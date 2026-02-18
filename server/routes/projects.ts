import { prisma } from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import OpenAI from "openai";
import { Router } from "express";
import { createNotification } from "../index";

const router = Router();
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
        "HTTP-Referer": "https://decomposr.ai",
        "X-Title": "Decomposr",
    },
});

async function generateWithRetry(model: string, messages: any[], maxRetries = 3) {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const completion = await openai.chat.completions.create({
                model,
                messages,
                temperature: 0.7,
            });
            return completion;
        } catch (error: any) {
            lastError = error;
            if (error.status === 429) {
                const waitTime = Math.pow(2, i) * 1000 + Math.random() * 1000;
                console.log(`Rate limited. Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

// Create Project (PM Only)
router.post("/:roomId", authenticateToken, async (req: AuthRequest, res) => {
    const roomId = req.params.roomId as string;
    const { name, description } = req.body;
    const userRole = req.user?.role;

    if (userRole !== "pm") {
        return res.status(403).json({ message: "Only Product Managers can create projects" });
    }

    try {
        const project = await prisma.project.create({
            data: {
                name,
                description,
                roomId,
            }
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error creating project" });
    }
});

// Update Task Status
router.patch("/:roomId/:projectId/tasks/:taskId", authenticateToken, async (req: AuthRequest, res) => {
    const taskId = req.params.taskId as string;
    const { status, timeEstimate, timeSpent, startDate } = req.body;

    try {
        if (status === 'review' && req.user?.role === 'pm') {
            return res.status(403).json({ message: "Only Team Members can move tasks to review." });
        }

        if (status === 'done' && req.user?.role !== 'pm') {
            return res.status(403).json({ message: "Only Product Managers can mark tasks as completed." });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (timeEstimate !== undefined) updateData.timeEstimate = timeEstimate;
        if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
        if (startDate !== undefined) updateData.startDate = startDate;

        const task = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
            include: { project: { include: { room: true } }, assignedTo: { select: { id: true, name: true, role: true, avatar: true } } }
        });

        // If task is DONE, notify PM (fire-and-forget)
        if (status === 'done') {
            createNotification({
                userId: task.project.room.creatorId,
                type: "task_updated",
                title: "Task Completed",
                message: `Task "${task.title}" in ${task.project.name} was completed.`,
                link: `/rooms/${task.project.room.id}`
            });
        }

        // If task is moved to REVIEW, notify PM (fire-and-forget)
        if (status === 'review') {
            createNotification({
                userId: task.project.room.creatorId,
                type: "task_updated", // You might want a specific type like 'task_review' if supported on frontend
                title: "Task Ready for Review",
                message: `Task "${task.title}" is ready for review.`,
                link: `/rooms/${task.project.room.id}`
            });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task" });
    }
});

// Assign Task (PM Only)
router.patch("/:roomId/:projectId/tasks/:taskId/assign", authenticateToken, async (req: AuthRequest, res) => {
    const taskId = req.params.taskId as string;
    const { userId } = req.body;
    const userRole = req.user?.role;

    if (userRole !== "pm") {
        return res.status(403).json({ message: "Only Product Managers can assign tasks" });
    }

    try {
        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                assignedToId: userId,
                isAccepted: false // Reset on update
            },
            include: { project: { include: { room: true } }, assignedTo: { select: { id: true, name: true, role: true, avatar: true } } }
        });

        // Notify Employee
        await createNotification({
            userId: userId,
            type: "task_assigned",
            title: "New Task",
            message: `You've been assigned task: ${task.title}`,
            link: `/rooms/${task.project.room.id}`
        });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error assigning task" });
    }
});

// Accept Task (Employee Only)
router.patch("/:roomId/:projectId/tasks/:taskId/accept", authenticateToken, async (req: AuthRequest, res) => {
    const taskId = req.params.taskId as string;
    const userId = req.user?.id;

    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { project: { include: { room: true } } }
        });

        if (!task) return res.status(404).json({ message: "Task not found" });
        if (task.assignedToId !== userId) {
            return res.status(403).json({ message: "You can only accept tasks assigned to you" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                isAccepted: true,
                status: 'inprogress'
            },
            include: { project: { include: { room: true } }, assignedTo: { select: { id: true, name: true, role: true, avatar: true } } }
        });

        // Notify PM (fire-and-forget)
        createNotification({
            userId: task.project.room.creatorId,
            type: "task_updated",
            title: "Task Accepted",
            message: `${req.user?.name || "An employee"} accepted task: ${task.title}`,
            link: `/rooms/${task.project.room.id}`
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error accepting task" });
    }
});

// AI Page: Generate Tasks
router.post("/:roomId/:projectId/generate-tasks", authenticateToken, async (req: AuthRequest, res) => {
    const projectId = req.params.projectId as string;
    const userRole = req.user?.role;

    if (userRole !== "pm") {
        return res.status(403).json({ message: "Only Product Managers can generate tasks" });
    }

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Clean slate: Delete existing tasks and epics before regenerating
        await prisma.task.deleteMany({ where: { projectId } });
        await prisma.epic.deleteMany({ where: { projectId } });

        // Senior Staff Architect AI Prompt - Professional Dynamic Scaling
        const prompt = `You are a Senior Staff Software Architect and Technical Product Manager.
        Decompose the following project into a professional-grade implementation plan.
        
        Project: "${project.name}"
        Goal: ${project.description}

        Phase 1: Scale Assessment
        Categorize the project into one of the following and scale your response accordingly:
        - TINY (e.g., Hello World, simple automation script, internal utility): 1-2 Epics, 5-10 tasks.
        - SMALL (e.g., Todo App, Landing Page, Personal Blog): 3-5 Epics, 15-35 tasks.
        - MEDIUM (e.g., Multi-user Dashboard, E-commerce backend): 8-12 Epics, 80-120 tasks.
        - LARGE/ENTERPRISE (e.g., Hyper-local delivery, Global CRM, FinTech Core): 15-25 Epics, 150-300+ tasks.

        Your output must be a strictly valid JSON object following this schema:
        {
            "summary": "Executive summary (3-4 paragraphs). Detail the value proposition, competitive landscape, and core technical hurdles.",
            "architecture": "Deep technical analysis. Specify architectural patterns (Microservices, Hexagonal, Event-driven), technology stack recommendations, data consistency strategies, and infrastructure (K8s, Serverless, etc.).",
            "timeline": "Realistic estimation in weeks (e.g., '12 weeks', '36 weeks'). Calculate based on task volume and complexity.",
            "epics": [
                {
                    "name": "Phase-specific Epic Title (e.g., 'Phase 1: Foundation & Auth', 'Phase 3: Logistics Engine')",
                    "description": "The strategic objective for this phase/module.",
                    "tasks": [
                        {
                            "title": "Actionable engineering task title (e.g., 'Implement Distributed Locking for Cart Service')",
                            "description": "Detailed technical spec. Mention specific tools, algorithms, or patterns.",
                            "priority": "low|medium|high|urgent",
                            "category": "Backend|Frontend|Database|DevOps|Integration|Security|Testing|UI/UX",
                            "ownerRole": "e.g., 'Senior Distributed Systems Engineer', 'Staff UI Architect'",
                            "timeEstimate": 4, 
                            "dependencies": "Title of the prerequisite task or 'None'"
                        }
                    ]
                }
            ]
        }
        
        Strict Professional Rules:
        1. LOGICAL DENSITY: Do not skimp on tasks for complex projects. A Zepto clone requires exhaustive granularity (e.g., dark store logic, last-mile routing, real-time inventory sync).
        2. COMPLEXITY ADAPTABILITY: Match the architectural complexity to the project description. Do NOT recommend Kubernetes, Microservices, or Enterprise-grade security (Vault, RBAC) for simple projects (TINY/SMALL) unless explicitly requested. For simple projects, prefer internal logic and standard deployment.
        3. PHASED APPROACH: Organize Epics chronologically: Foundation & Infra -> Schema & Core API -> Module 1 -> Module 2 -> ... -> Security Hardening -> QA & Load Testing.
        4. DOMAIN COVERAGE: Ensure larger plans include Epics for: CI/CD Pipeline, Database Architecture, Performance Monitoring, and Security/Compliance.
        5. NO FLUFF: Every task description must provide actual technical value to a developer.
        6. VALIDATION: Output ONLY raw JSON.`;

        const completion = await generateWithRetry(
            process.env.AI_MODEL_NAME || "gpt-4o",
            [
                {
                    role: "system",
                    content: "You are a world-class Technical Product Manager and Lead Software Architect. You generate detailed project plans in JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        );

        const text = completion.choices[0]?.message?.content || "{}";
        console.log("Raw AI Response:", text);

        // Safe JSON parse with improved extraction
        let aiOutput;
        try {
            // Remove markdown code blocks if they exist
            let cleanText = text.trim();
            if (cleanText.includes("```")) {
                const parts = cleanText.split("```");
                // Find the part that looks like JSON or is between the first set of backticks
                for (let part of parts) {
                    part = part.trim();
                    if (part.startsWith("json")) part = part.substring(4).trim();
                    if (part.startsWith("{") && part.endsWith("}")) {
                        cleanText = part;
                        break;
                    }
                }
            }
            aiOutput = JSON.parse(cleanText);
            console.log("Parsed AI Output:", JSON.stringify(aiOutput, null, 2));
        } catch (e) {
            console.error("Failed to parse AI output:", text);
            return res.status(500).json({ message: "Failed to parse AI plan. Please try again." });
        }

        // Update Project Metadata
        await prisma.project.update({
            where: { id: projectId },
            data: {
                summary: aiOutput.summary,
                architecture: aiOutput.architecture,
                timeline: aiOutput.timeline,
                isAIPlanGenerated: true
            }
        });

        // Create Epics and Tasks
        console.log(`Creating ${aiOutput.epics.length} epics...`);
        for (const epicData of aiOutput.epics) {
            console.log(`Creating epic: ${epicData.name}`);
            const epic = await prisma.epic.create({
                data: {
                    name: epicData.name,
                    description: epicData.description,
                    projectId: projectId
                }
            });

            if (epicData.tasks && epicData.tasks.length > 0) {
                console.log(`Creating ${epicData.tasks.length} tasks for epic: ${epicData.name}`);
                await prisma.task.createMany({
                    data: epicData.tasks.map((task: any) => {
                        // Map AI priorities to schema enums
                        let priority = (task.priority || 'medium').toLowerCase();
                        if (priority === 'critical') priority = 'urgent';
                        if (!['low', 'medium', 'high', 'urgent'].includes(priority)) priority = 'medium';

                        return {
                            title: task.title,
                            description: task.description,
                            priority: priority as any,
                            category: task.category,
                            ownerRole: task.ownerRole,
                            effort: task.effort || `${task.timeEstimate || 0} hours`,
                            timeEstimate: task.timeEstimate || 0,
                            dependencies: task.dependencies,
                            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
                            projectId: projectId,
                            epicId: epic.id
                        };
                    })
                });
            } else {
                console.warn(`No tasks found for epic: ${epicData.name}`);
            }
        }
        console.log("All epics and tasks created successfully.");

        // Return full project structure
        const updatedProject = await prisma.project.findUnique({
            where: { id: projectId },
            include: { epics: { include: { tasks: true } } }
        });

        res.json(updatedProject);
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        if (error.status === 429) {
            return res.status(429).json({
                message: "AI provider rate limit exceeded. Please wait a moment before trying again.",
                retryAfter: error.errorDetails?.find((d: any) => d.retryDelay)?.retryDelay
            });
        }
        res.status(error.status || 500).json({
            message: error.message || "Error generating tasks with AI"
        });
    }
});

export default router;

import { prisma } from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Router } from "express";
import { createNotification } from "../index";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    }
});

// Create Project (PM Only)
router.post("/:roomId/projects", authenticateToken, async (req: AuthRequest, res) => {
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
router.patch("/:roomId/projects/:projectId/tasks/:taskId", authenticateToken, async (req: AuthRequest, res) => {
    const taskId = req.params.taskId as string;
    const { status } = req.body;

    try {
        const task = await prisma.task.update({
            where: { id: taskId },
            data: { status },
            include: { project: { include: { room: true } }, assignedTo: { select: { id: true, name: true, role: true, avatar: true } } }
        });

        // If task is DONE, notify PM
        if (status === 'done') {
            await createNotification({
                userId: task.project.room.creatorId,
                type: "task_updated",
                title: "Task Completed",
                message: `Task "${task.title}" in ${task.project.name} was completed.`,
                link: `/rooms/${task.project.room.id}`
            });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task" });
    }
});

// Assign Task (PM Only)
router.patch("/:roomId/projects/:projectId/tasks/:taskId/assign", authenticateToken, async (req: AuthRequest, res) => {
    const taskId = req.params.taskId as string;
    const { userId } = req.body;
    const userRole = req.user?.role;

    if (userRole !== "pm") {
        return res.status(403).json({ message: "Only Product Managers can assign tasks" });
    }

    try {
        const task = await prisma.task.update({
            where: { id: taskId },
            data: { assignedToId: userId },
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

// AI Page: Generate Tasks
router.post("/:roomId/projects/:projectId/generate-tasks", authenticateToken, async (req: AuthRequest, res) => {
    const projectId = req.params.projectId as string;
    const userRole = req.user?.role;

    if (userRole !== "pm") {
        return res.status(403).json({ message: "Only Product Managers can generate tasks" });
    }

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project) return res.status(404).json({ message: "Project not found" });

        // AI Prompt
        const prompt = `You are an expert Technical Product Manager and Software Architect.
        Given a project idea, generate a comprehensive implementation plan stringified as a JSON object.
        
        Project Idea: "${project.name}" - ${project.description}

        Required JSON Structure:
        {
            "summary": "High-level executive summary of the project",
            "architecture": "Brief description of the recommended tech stack and architecture",
            "timeline": "Estimated timestamp (e.g., '4 weeks')",
            "epics": [
                {
                    "name": "Epic Title (e.g., Authentication, Core Features)",
                    "description": "Description of this module",
                    "tasks": [
                        {
                            "title": "Task Title",
                            "description": "Detailed implementation steps",
                            "priority": "low|medium|high|urgent",
                            "category": "Frontend|Backend|Database|DevOps|Testing",
                            "effort": "Estimated effort (e.g., '3 hours', '2 days')",
                            "dependencies": "List of dependencies or 'None'"
                        }
                    ]
                }
            ]
        }
        
        Ensure the output is strictly valid JSON. Generate at least 3-4 epics with multiple tasks each.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Safe JSON parse
        let aiOutput;
        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            aiOutput = JSON.parse(cleanText);
        } catch (e) {
            console.error("Failed to parse AI output:", text);
            return res.status(500).json({ message: "Failed to parse AI plan" });
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
        for (const epicData of aiOutput.epics) {
            const epic = await prisma.epic.create({
                data: {
                    name: epicData.name,
                    description: epicData.description,
                    projectId: projectId
                }
            });

            if (epicData.tasks && epicData.tasks.length > 0) {
                await prisma.task.createMany({
                    data: epicData.tasks.map((task: any) => ({
                        title: task.title,
                        description: task.description,
                        priority: (task.priority || 'medium').toLowerCase(),
                        category: task.category,
                        effort: task.effort,
                        dependencies: task.dependencies,
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
                        projectId: projectId,
                        epicId: epic.id
                    }))
                });
            }
        }

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
                message: "Gemini API rate limit exceeded. Please wait a moment before trying again.",
                retryAfter: error.errorDetails?.find((d: any) => d.retryDelay)?.retryDelay
            });
        }
        res.status(error.status || 500).json({
            message: error.message || "Error generating tasks with AI"
        });
    }
});

export default router;

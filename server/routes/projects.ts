import { prisma } from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import OpenAI from "openai";
import { Router } from "express";
import { createNotification } from "../index";

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
            include: { project: { include: { room: true } } }
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
            include: { project: { include: { room: true } } }
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
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an AI Product Manager. Given a project idea, generate a list of 5 concrete software development tasks. Format as JSON: { tasks: [{ title: string, description: string, priority: 'low'|'medium'|'high'|'urgent' }] }"
                },
                {
                    role: "user",
                    content: `Project Idea: ${project.name} - ${project.description}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const aiOutput = JSON.parse(response.choices[0].message.content || '{"tasks":[]}');

        // Create tasks in DB
        const tasks = await Promise.all(aiOutput.tasks.map((task: any) =>
            prisma.task.create({
                data: {
                    title: task.title,
                    description: task.description,
                    priority: (task.priority || 'medium').toLowerCase(),
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
                    projectId,
                }
            })
        ));

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating tasks" });
    }
});

export default router;

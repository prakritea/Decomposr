import { prisma } from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { Router } from "express";
import { createNotification } from "../index";

const router = Router();

const FALLBACK_MODELS = [
  process.env.AI_MODEL_NAME,
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
].filter(Boolean) as string[];

async function generateWithRetry(models: string[], messages: any[], maxRetries = 2) {
  let lastError: any;

  for (const model of models) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 240000);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://decomposr.ai",
            "X-Title": "Decomposr",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.3,
            max_tokens: 4096,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          console.error(`[OpenRouter Error] Model: ${model}, Status: ${response.status}`, JSON.stringify(errBody));
          const error: any = new Error(errBody.error?.message || `OpenRouter returned status ${response.status}`);
          error.status = response.status;
          error.errorDetails = errBody.error;

          if (response.status === 429) {
            const waitTime = Math.min(Math.pow(2, i) * 1500, 10000) + Math.random() * 1000;
            console.log(`[${model}] Rate limited. Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }

          if (response.status >= 500) {
            console.log(`[${model}] Server error (${response.status}). Trying next model...`);
            lastError = error;
            break;
          }

          throw error;
        }

        const data = await response.json();
        console.log(`[LATENCY] AI model used: ${model}`);

        // OpenRouter sometimes returns 200 with error body or empty choices
        if (data.error) {
          const errMsg = data.error.message || JSON.stringify(data.error);
          console.error(`[OpenRouter] Model ${model} returned error in 200 body: ${errMsg}`);
          const error: any = new Error(errMsg);
          error.status = data.error.code || 500;
          error.errorDetails = data.error;
          throw error;
        }
        if (!data.choices || data.choices.length === 0) {
          console.error(`[OpenRouter] Model ${model} returned empty choices. Full response:`, JSON.stringify(data).slice(0, 500));
          const error: any = new Error("AI returned empty response (no choices)");
          error.status = 500;
          throw error;
        }

        return data;
      } catch (error: any) {
        lastError = error;
        if (error.name === "AbortError") {
          console.log(`[${model}] Request timed out. Trying next model...`);
          break;
        }
        if (i < maxRetries - 1) continue;
        console.log(`[${model}] All retries exhausted. Trying next model...`);
      }
    }
  }

  throw lastError;
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

function parsePriority(p: string): string {
  let priority = (p || "medium").toLowerCase();
  if (priority === "critical") priority = "urgent";
  if (!["low", "medium", "high", "urgent"].includes(priority)) priority = "medium";
  return priority;
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
      data: { name, description, roomId }
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
    if (status === "review" && req.user?.role === "pm") {
      return res.status(403).json({ message: "Only Team Members can move tasks to review." });
    }

    if (status === "done" && req.user?.role !== "pm") {
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

    if (status === "done") {
      createNotification({
        userId: task.project.room.creatorId,
        type: "task_updated",
        title: "Task Completed",
        message: `Task "${task.title}" in ${task.project.name} was completed.`,
        link: `/rooms/${task.project.room.id}`
      });
    }

    if (status === "review") {
      createNotification({
        userId: task.project.room.creatorId,
        type: "task_updated",
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
      data: { assignedToId: userId, isAccepted: false },
      include: { project: { include: { room: true } }, assignedTo: { select: { id: true, name: true, role: true, avatar: true } } }
    });

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
      data: { isAccepted: true, status: "inprogress" },
      include: { project: { include: { room: true } }, assignedTo: { select: { id: true, name: true, role: true, avatar: true } } }
    });

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

// Get My Tasks (Employee)
router.get("/my-tasks", authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;

  try {
    const tasks = await prisma.task.findMany({
      where: { assignedToId: userId! },
      include: {
        project: { select: { id: true, name: true, roomId: true, room: { select: { name: true } } } },
        epic: { select: { name: true } },
      },
      orderBy: { dueDate: "asc" }
    });

    // Flatten for frontend compatibility
    const flattened = tasks.map(task => ({
      ...task,
      roomId: task.project.roomId,
      roomName: task.project.room.name,
      projectName: task.project.name,
      project: undefined,
    }));

    res.json(flattened);
  } catch (error) {
    res.status(500).json({ message: "Error fetching my tasks" });
  }
});

// AI Page: Generate Tasks (Merge/Upsert)
router.post("/:roomId/:projectId/generate-tasks", authenticateToken, async (req: AuthRequest, res) => {
  const projectId = req.params.projectId as string;
  const userRole = req.user?.role;

  if (userRole !== "pm") {
    return res.status(403).json({ message: "Only Product Managers can generate tasks" });
  }

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Fetch existing epics and tasks for merge
    const existingEpics = await prisma.epic.findMany({
      where: { projectId },
      include: { tasks: { where: { isAIGenerated: true } } }
    });

    const prompt = `You are a Senior Software Architect. Decompose this project into a JSON plan.

Project: "${project.name}"
Goal: ${project.description}

Scale your response based on project size:
- SMALL → 1-3 Epics, 5-15 tasks
- MEDIUM → 3-6 Epics, 15-60 tasks
- LARGE → 6-12 Epics, 60-150 tasks

Return ONLY valid JSON with this exact schema:
{
    "summary": "2-3 paragraph executive summary",
    "architecture": "ASCII tree diagram showing the full system architecture (use ─ ├ └ │ characters)",
    "timeline": "Estimated timeline in weeks",
    "epics": [
        {
            "name": "Epic name",
            "description": "Epic objective",
            "tasks": [
                {
                    "title": "Task title",
                    "description": "Task description",
                    "priority": "low|medium|high|urgent",
                    "category": "Backend|Frontend|Database|DevOps|Testing|Security",
                    "ownerRole": "Role title",
                    "timeEstimate": 4,
                    "dependencies": "None or task name"
                }
            ]
        }
    ]
}

Rules: Be concise, practical, and output ONLY raw JSON. No markdown, no explanations.`;

    const aiStart = Date.now();
    const completion = await generateWithRetry(
      FALLBACK_MODELS,
      [
        {
          role: "system",
          content: "You are a world-class Technical Product Manager and Lead Software Architect. You generate detailed project plans in JSON format."
        },
        { role: "user", content: prompt }
      ]
    );
    const aiEnd = Date.now();

    const msg = completion.choices[0]?.message;
    const text = msg?.content || msg?.reasoning || "{}";
    const tokenUsage = completion.usage;
    console.log(`[LATENCY] AI generation: ${(aiEnd - aiStart) / 1000}s`);
    if (tokenUsage) console.log(`[LATENCY] Tokens: ${tokenUsage.prompt_tokens} in → ${tokenUsage.completion_tokens} out (${tokenUsage.total_tokens} total)`);

    // Safe JSON parse with robust extraction
    let aiOutput;
    try {
      let cleanText = text.trim();
      if (cleanText.includes("```")) {
        const parts = cleanText.split("```");
        cleanText = "";
        for (let part of parts) {
          part = part.trim();
          if (part.startsWith("json")) part = part.substring(4).trim();
          const start = part.indexOf("{");
          const end = part.lastIndexOf("}");
          if (start !== -1 && end !== -1 && end > start) {
            cleanText = part.substring(start, end + 1);
            break;
          }
        }
      } else {
        const start = cleanText.indexOf("{");
        const end = cleanText.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          cleanText = cleanText.substring(start, end + 1);
        }
      }
      if (!cleanText) throw new Error("No JSON object found in response");
      aiOutput = JSON.parse(cleanText);
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

    // Merge: Upsert epics and tasks by name
    const dbStart = Date.now();
    const epicNameToId = new Map<string, string>();

    // Build lookup of existing epics by normalized name
    const existingEpicMap = new Map<string, typeof existingEpics[0]>();
    for (const epic of existingEpics) {
      existingEpicMap.set(normalizeName(epic.name), epic);
    }

    // Build lookup of existing AI tasks by epicId + normalized title
    const existingTasksByEpic = new Map<string, Map<string, any>>();
    for (const epic of existingEpics) {
      const taskMap = new Map<string, any>();
      for (const task of epic.tasks) {
        taskMap.set(normalizeName(task.title), task);
      }
      existingTasksByEpic.set(epic.id, taskMap);
    }

    const upsertedAiTaskIds: string[] = [];

    for (const epicData of aiOutput.epics) {
      const normalizedEpicName = normalizeName(epicData.name);
      let epic = existingEpicMap.get(normalizedEpicName);
      let epicId: string;

      if (epic) {
        // Update existing epic description
        await prisma.epic.update({
          where: { id: epic.id },
          data: { description: epicData.description }
        });
        epicId = epic.id;
        console.log(`Updated existing epic: ${epicData.name}`);
      } else {
        // Create new epic
        epic = await prisma.epic.create({
          data: {
            name: epicData.name,
            description: epicData.description,
            projectId
          }
        });
        epicId = epic.id;
        console.log(`Created new epic: ${epicData.name}`);
      }

      epicNameToId.set(epicData.name, epicId);

      // Get existing AI tasks for this epic
      const existingTasksMap = existingTasksByEpic.get(epicId) || new Map();

      if (epicData.tasks && epicData.tasks.length > 0) {
        for (const taskData of epicData.tasks) {
          const normalizedTitle = normalizeName(taskData.title);
          const priority = parsePriority(taskData.priority);
          const existingTask = existingTasksMap.get(normalizedTitle);

          if (existingTask) {
            // Update existing AI task — preserve manual edits (status, assignee, timeSpent)
            await prisma.task.update({
              where: { id: existingTask.id },
              data: {
                description: taskData.description,
                priority: priority as any,
                category: taskData.category,
                ownerRole: taskData.ownerRole,
                effort: taskData.effort || `${taskData.timeEstimate || 0} hours`,
                timeEstimate: taskData.timeEstimate || 0,
                dependencies: taskData.dependencies,
                isAIGenerated: true,
              }
            });
            upsertedAiTaskIds.push(existingTask.id);
            console.log(`Updated existing task: ${taskData.title}`);
          } else {
            // Create new task
            const created = await prisma.task.create({
              data: {
                title: taskData.title,
                description: taskData.description,
                priority: priority as any,
                category: taskData.category,
                ownerRole: taskData.ownerRole,
                effort: taskData.effort || `${taskData.timeEstimate || 0} hours`,
                timeEstimate: taskData.timeEstimate || 0,
                dependencies: taskData.dependencies,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                projectId,
                epicId,
                isAIGenerated: true,
              }
            });
            upsertedAiTaskIds.push(created.id);
            console.log(`Created new task: ${taskData.title}`);
          }
        }
      }
    }

    // Delete AI-generated tasks that existed before but are NOT in the new AI output
    // This removes tasks that the new plan no longer includes
    const allOldAiTaskIds = existingEpics.flatMap(e =>
      e.tasks.map(t => t.id)
    );
    const removedTaskIds = allOldAiTaskIds.filter(
      id => !upsertedAiTaskIds.includes(id)
    );
    if (removedTaskIds.length > 0) {
      await prisma.task.deleteMany({
        where: { id: { in: removedTaskIds } }
      });
      console.log(`Removed ${removedTaskIds.length} obsolete AI tasks`);
    }

    console.log(`[LATENCY] DB writes: ${(Date.now() - dbStart) / 1000}s`);

    // Return full project structure
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { epics: { include: { tasks: true } } }
    });

    res.json(updatedProject);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    if (error.status === 429) {
      const retryAfter = error.errorDetails?.metadata?.headers?.["Retry-After"]
        || error.errorDetails?.metadata?.retry_after_seconds
        || null;
      return res.status(429).json({
        message: error.errorDetails?.message || "AI provider rate limit exceeded. Please wait a moment before trying again.",
        retryAfter
      });
    }
    res.status(error.status || 500).json({
      message: error.message || "Error generating tasks with AI"
    });
  }
});

export default router;
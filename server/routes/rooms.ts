import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { createNotification } from "../index";

const router = Router();

// Create Room (PM Only)
router.post("/create", authenticateToken, async (req: AuthRequest, res) => {
  const { name, description } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole !== "pm") {
    return res.status(403).json({ message: "Only Product Managers can create rooms" });
  }

  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = await prisma.room.create({
      data: {
        name,
        description,
        inviteCode,
        creatorId: userId!,
        members: {
          create: { userId: userId!, role: "pm" as UserRole }
        },
        projects: {
          create: {
            name: name,
            description: description,
            isAIPlanGenerated: false
          }
        }
      },
      include: {
        members: { include: { user: { select: { name: true, email: true, role: true } } } },
        _count: { select: { members: true, projects: true } }
      }
    });
    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Error creating room" });
  }
});

// Join Room
router.post("/join", authenticateToken, async (req: AuthRequest, res) => {
  const { inviteCode } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role as UserRole;

  try {
    const room = await prisma.room.findUnique({ where: { inviteCode } });
    if (!room) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const existingMember = await prisma.roomMember.findUnique({
      where: { userId_roomId: { userId: userId!, roomId: room.id } }
    });

    if (existingMember) {
      return res.status(400).json({ message: "You are already a member of this room" });
    }

    await prisma.roomMember.create({
      data: { userId: userId!, roomId: room.id, role: userRole }
    });

    const joiningUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    await createNotification({
      userId: room.creatorId,
      type: "room_joined",
      title: "New Member",
      message: `${joiningUser?.name && !joiningUser.name.startsWith("cmk") ? joiningUser.name : "A new member"} joined your room ${room.name}`,
      link: `/rooms/${room.id}`
    });

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error joining room" });
  }
});

// PM Dashboard Stats
router.get("/stats", authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;

  try {
    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { creatorId: userId! },
          { members: { some: { userId: userId! } } }
        ]
      },
      include: {
        _count: { select: { members: true, projects: true } },
        projects: {
          include: {
            _count: { select: { tasks: true } },
            tasks: {
              where: { status: { in: ["done", "review"] } },
              select: { id: true, title: true, status: true, updatedAt: true, assignedTo: { select: { name: true, avatar: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const allTasks = rooms.flatMap(r => r.projects.flatMap(p => p.tasks));
    const totalTasks = rooms.reduce((sum, r) => sum + r.projects.reduce((s, p) => s + p._count.tasks, 0), 0);
    const completedTasks = allTasks.filter(t => t.status === "done").length;
    const pendingReviews = allTasks.filter(t => t.status === "review").length;

    const recentActivity = rooms.flatMap(room =>
      (room.projects || []).flatMap(project =>
        project.tasks.map(task => ({
          id: `task-${task.id}`,
          type: task.status === "done" ? "task_done" as const : "task_review" as const,
          title: task.title,
          status: task.status,
          timestamp: task.updatedAt,
          roomName: room.name,
          projectName: project.name,
          assignedTo: task.assignedTo ? { name: task.assignedTo.name, avatar: task.assignedTo.avatar } : undefined
        }))
      )
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);

    res.json({
      totalRooms: rooms.length,
      pendingReviews,
      activeProjects: rooms.reduce((sum, r) => sum + r._count.projects, 0),
      avgProgress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalTasks,
      completedTasks,
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// Get User Rooms (paginated, lightweight)
router.get("/user-rooms", authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  try {
    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where: { members: { some: { userId: userId! } } },
        include: {
          creator: { select: { name: true, email: true } },
          members: { include: { user: { select: { name: true, email: true, role: true } } } },
          _count: { select: { members: true, projects: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.room.count({
        where: { members: { some: { userId: userId! } } }
      }),
    ]);

    res.json({
      data: rooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
});

// Get Room Details (full nested for single room)
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
  const id = req.params.id;

  try {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true, role: true, email: true } } } },
        projects: {
          include: {
            epics: { include: { tasks: true } },
            tasks: { include: { assignedTo: { select: { id: true, name: true, role: true, avatar: true } } } }
          }
        },
      }
    });

    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room details" });
  }
});

// Delete Room (PM Only)
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  const id = req.params.id;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole !== "pm") {
    return res.status(403).json({ message: "Only Product Managers can delete rooms" });
  }

  try {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.creatorId !== userId) {
      return res.status(403).json({ message: "Only the creator can delete this room" });
    }

    // Cascade deletes handle members, projects, epics, tasks, notifications
    await prisma.room.delete({ where: { id } });

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Error deleting room" });
  }
});

export default router;
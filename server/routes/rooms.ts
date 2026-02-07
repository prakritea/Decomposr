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
                    create: {
                        userId: userId!,
                        role: "pm" as UserRole,
                    }
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
                projects: { include: { epics: { include: { tasks: true } }, tasks: { include: { assignedTo: { select: { id: true, name: true, role: true, avatar: true } } } } } },
            }
        });
        res.status(201).json(room);
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: `Error creating room: ${error instanceof Error ? error.message : "Unknown error"}` });
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
            data: {
                userId: userId!,
                roomId: room.id,
                role: userRole,
            }
        });

        // Notify PM (Creator)
        const joiningUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true }
        });

        await createNotification({
            userId: room.creatorId,
            type: "room_joined",
            title: "New Member",
            message: `${joiningUser?.name && !joiningUser.name.startsWith('cmk') ? joiningUser.name : "A new member"} joined your room ${room.name}`,
            link: `/rooms/${room.id}`
        });

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: "Error joining room" });
    }
});

// Get User Rooms
router.get("/user-rooms", authenticateToken, async (req: AuthRequest, res) => {
    const userId = req.user?.id;

    try {
        const rooms = await prisma.room.findMany({
            where: {
                members: {
                    some: { userId: userId! }
                }
            },
            include: {
                creator: { select: { name: true, email: true } },
                members: { include: { user: { select: { name: true, email: true, role: true } } } },
                projects: { include: { epics: { include: { tasks: true } }, tasks: { include: { assignedTo: { select: { id: true, name: true, role: true, avatar: true } } } } } },
                _count: { select: { members: true, projects: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rooms" });
    }
});

// Get Room Details
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
    const id = req.params.id as string;

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
    const id = req.params.id as string;
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

        // Delete all associated data
        // Order matters if no cascade: tasks -> epics -> projects -> members -> room
        // But since we want "Clean Slate", we might have complex relations.
        // Prisma cascade delete on the model level is preferred. 
        // Based on schema.prisma, relations don't have explicit cascade, so we do it manually.

        await prisma.task.deleteMany({ where: { project: { roomId: id } } });
        await prisma.epic.deleteMany({ where: { project: { roomId: id } } });
        await prisma.project.deleteMany({ where: { roomId: id } });
        await prisma.roomMember.deleteMany({ where: { roomId: id } });
        await prisma.notification.deleteMany({ where: { link: { contains: `/rooms/${id}` } } });

        await prisma.room.delete({ where: { id } });

        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ message: "Error deleting room" });
    }
});

export default router;

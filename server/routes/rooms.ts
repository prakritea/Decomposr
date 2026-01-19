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
                }
            },
            include: {
                members: { include: { user: { select: { name: true, email: true, role: true } } } },
                projects: { include: { tasks: true } },
            }
        });
        res.status(201).json(room);
    } catch (error) {
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
            data: {
                userId: userId!,
                roomId: room.id,
                role: userRole,
            }
        });

        // Notify PM (Creator)
        await createNotification({
            userId: room.creatorId,
            type: "room_joined",
            title: "New Member",
            message: `${req.user?.id} joined your room ${room.name}`,
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
                projects: { include: { tasks: true } },
                _count: { select: { members: true, projects: true } }
            }
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
                projects: { include: { tasks: true } },
            }
        });

        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: "Error fetching room details" });
    }
});

export default router;

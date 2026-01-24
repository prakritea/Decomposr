import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Get Notifications
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    const userId = req.user?.id;

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: userId! },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// Mark as Read
router.patch("/:id/read", authenticateToken, async (req: AuthRequest, res) => {
    const id = req.params.id as string;

    try {
        const notification = await prisma.notification.update({
            where: { id },
            data: { read: true }
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
});

// Mark All as Read
router.patch("/read-all", authenticateToken, async (req: AuthRequest, res) => {
    const userId = req.user?.id;

    try {
        await prisma.notification.updateMany({
            where: { userId: userId!, read: false },
            data: { read: true }
        });
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error marking all notifications as read" });
    }
});

export default router;

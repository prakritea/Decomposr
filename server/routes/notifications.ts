import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Get Notifications (paginated)
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  try {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: userId! },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { userId: userId! }
      }),
    ]);

    res.json({
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Get Unread Count
router.get("/unread-count", authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;

  try {
    const count = await prisma.notification.count({
      where: { userId: userId!, read: false }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread count" });
  }
});

// Mark as Read
router.patch("/:id/read", authenticateToken, async (req: AuthRequest, res) => {
  const id = req.params.id;

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
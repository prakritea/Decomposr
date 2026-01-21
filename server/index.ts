import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/rooms";
import projectRoutes from "./routes/projects";
import notificationRoutes from "./routes/notifications";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server;

export function createServer(httpServer?: any, existingApp?: express.Express) {
  const app = existingApp || express();

  if (httpServer) {
    io = new Server(httpServer, {
      cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId as string;
      if (userId) {
        socket.join(userId);
        console.log(`User ${userId} connected to socket`);
      }

      socket.on("disconnect", () => {
        console.log("User disconnected from socket");
      });
    });
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/notifications", notificationRoutes);

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Error handling
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

  return app;
}

export const sendNotification = (userId: string, notification: any) => {
  if (io) {
    io.to(userId).emit("notification", notification);
  }
};

export const createNotification = async (data: { userId: string, type: string, title: string, message: string, link?: string }) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link
      }
    });
    sendNotification(data.userId, notification);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/rooms";
import projectRoutes from "./routes/projects";
import notificationRoutes from "./routes/notifications";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { JWT_SECRET } from "./lib/config";

let io: Server;

export function createServer(httpServer?: any, existingApp?: express.Express) {
  const app = existingApp || express();

  if (httpServer) {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      }
    });

    // Authenticate socket connections via JWT
    io.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("Authentication required"));

      try {
        const decoded = jwt.verify(token as string, JWT_SECRET) as { id: string; name: string; role: string };
        (socket as any).userId = decoded.id;
        next();
      } catch {
        next(new Error("Invalid token"));
      }
    });

    io.on("connection", (socket) => {
      const userId = (socket as any).userId;
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
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Latency logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      if (ms > 100) console.log(`[LATENCY] ${req.method} ${req.originalUrl} — ${ms}ms`);
    });
    next();
  });

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

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/config";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
        role: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Auth Middleware] Verification failed. Error: ${errorMsg}`);
        console.error(`[Auth Middleware] Secret length: ${JWT_SECRET.length}`);
        console.error(`[Auth Middleware] Token prefix: ${token.substring(0, 10)}...`);
        res.status(401).json({ message: "Invalid token." });
    }
};

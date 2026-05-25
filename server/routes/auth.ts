import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { JWT_SECRET } from "../lib/config";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Me (Check Session)
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            select: { id: true, name: true, email: true, role: true }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

// Signup
router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "employee",
            },
        });

        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        console.log(`[Auth Route] Signed signup token with secret length: ${JWT_SECRET.length}`);

        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        console.log(`[Auth Route] Signed login token with secret length: ${JWT_SECRET.length}`);

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

export default router;

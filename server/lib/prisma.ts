import * as Prisma from "@prisma/client";
const { PrismaClient } = Prisma;
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const globalForPrisma = global as unknown as { prisma: Prisma.PrismaClient };

let prismaInstance: Prisma.PrismaClient;

if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
} else {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

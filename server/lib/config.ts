import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const JWT_SECRET = process.env.JWT_SECRET || (NODE_ENV === "production" ? "" : "fallback-secret");
export const PORT = process.env.PORT || 3000;

if (NODE_ENV === "production" && !JWT_SECRET) {
    console.error("[Config] FATAL: JWT_SECRET is not set in production environment!");
}

console.log(`[Config] NODE_ENV: ${NODE_ENV}`);
console.log(`[Config] JWT_SECRET Status: ${JWT_SECRET === "fallback-secret" ? "Using Fallback" : (JWT_SECRET ? `Set (len: ${JWT_SECRET.length})` : "MISSING!")}`);

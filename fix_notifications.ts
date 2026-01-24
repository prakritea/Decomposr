
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log("Checking for notifications with CUIDs in messages...");

        const notifications = await prisma.notification.findMany({
            where: {
                type: "room_joined",
                message: {
                    contains: "cmk"
                }
            }
        });

        console.log(`Found ${notifications.length} potentially problematic notifications.`);

        const users = await prisma.user.findMany();
        const userMap = new Map(users.map(u => [u.id, u.name]));

        for (const notif of notifications) {
            // Find if any user ID matches the content of the message
            for (const [userId, userName] of userMap.entries()) {
                if (notif.message.includes(userId)) {
                    const newMessage = notif.message.replace(userId, userName);
                    console.log(`Updating notification ${notif.id}: "${notif.message}" -> "${newMessage}"`);

                    await prisma.notification.update({
                        where: { id: notif.id },
                        data: { message: newMessage }
                    });
                    break;
                }
            }
        }

        console.log("Finished fixing notifications.");
    } catch (error) {
        console.error("Error fixing notifications:", error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();

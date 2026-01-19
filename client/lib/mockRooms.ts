import { ProjectRoom, RoomInvitation } from "@/types/room";

const ROOMS_KEY = "decomposr_rooms";
const INVITES_KEY = "decomposr_invites";

// Generate random invite code
function generateInviteCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export const mockRoomsService = {
    getRooms: (): ProjectRoom[] => {
        const stored = localStorage.getItem(ROOMS_KEY);
        return stored ? JSON.parse(stored).map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt),
            members: r.members.map((m: any) => ({
                ...m,
                joinedAt: new Date(m.joinedAt),
                user: {
                    ...m.user,
                    joinedAt: new Date(m.user.joinedAt),
                },
            })),
        })) : [];
    },

    createRoom: (name: string, description: string, userId: string, userName: string, userEmail: string): ProjectRoom => {
        const rooms = mockRoomsService.getRooms();
        const inviteCode = generateInviteCode();

        const newRoom: ProjectRoom = {
            id: `room-${Date.now()}`,
            name,
            description,
            inviteCode,
            createdBy: userId,
            createdAt: new Date(),
            members: [
                {
                    userId,
                    user: {
                        id: userId,
                        name: userName,
                        email: userEmail,
                        role: "pm",
                        joinedAt: new Date(),
                    },
                    joinedAt: new Date(),
                    role: "owner",
                },
            ],
        };

        rooms.push(newRoom);
        localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));

        // Create invitation
        const invitation: RoomInvitation = {
            code: inviteCode,
            roomId: newRoom.id,
            createdBy: userId,
            currentUses: 0,
        };

        const invites = mockRoomsService.getInvitations();
        invites.push(invitation);
        localStorage.setItem(INVITES_KEY, JSON.stringify(invites));

        return newRoom;
    },

    joinRoom: (inviteCode: string, userId: string, userName: string, userEmail: string, userRole: "pm" | "employee"): ProjectRoom => {
        const rooms = mockRoomsService.getRooms();
        const room = rooms.find((r) => r.inviteCode === inviteCode);

        if (!room) {
            throw new Error("Invalid invite code");
        }

        // Check if already a member
        if (room.members.some((m) => m.userId === userId)) {
            return room;
        }

        // Add member
        room.members.push({
            userId,
            user: {
                id: userId,
                name: userName,
                email: userEmail,
                role: userRole,
                joinedAt: new Date(),
            },
            joinedAt: new Date(),
            role: "member",
        });

        localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));

        // Update invitation uses
        const invites = mockRoomsService.getInvitations();
        const invite = invites.find((i) => i.code === inviteCode);
        if (invite) {
            invite.currentUses++;
            localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
        }

        return room;
    },

    getUserRooms: (userId: string): ProjectRoom[] => {
        const rooms = mockRoomsService.getRooms();
        return rooms.filter((room) => room.members.some((m) => m.userId === userId));
    },

    getRoom: (roomId: string): ProjectRoom | null => {
        const rooms = mockRoomsService.getRooms();
        return rooms.find((r) => r.id === roomId) || null;
    },

    getInvitations: (): RoomInvitation[] => {
        const stored = localStorage.getItem(INVITES_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    regenerateInviteCode: (roomId: string): string => {
        const rooms = mockRoomsService.getRooms();
        const room = rooms.find((r) => r.id === roomId);

        if (!room) {
            throw new Error("Room not found");
        }

        const newCode = generateInviteCode();
        room.inviteCode = newCode;
        localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));

        return newCode;
    },
};

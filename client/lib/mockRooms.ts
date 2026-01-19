import { ProjectRoom, RoomInvitation } from "@/types/room";
import { Project, Task, TaskStatus } from "@/types/project";

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
            projects: (r.projects || []).map((p: any) => ({
                ...p,
                createdAt: new Date(p.createdAt),
                tasks: (p.tasks || []).map((t: any) => ({
                    ...t,
                    dueDate: new Date(t.dueDate),
                })),
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
            projects: [],
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

    createProject: (roomId: string, name: string, description: string): Project => {
        const rooms = mockRoomsService.getRooms();
        const room = rooms.find((r) => r.id === roomId);
        if (!room) throw new Error("Room not found");

        const newProject: Project = {
            id: `proj-${Date.now()}`,
            roomId,
            name,
            description,
            tasks: [],
            isAIPlanGenerated: false,
            createdAt: new Date(),
        };

        room.projects.push(newProject);
        localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
        return newProject;
    },

    generateAIPlan: (roomId: string, projectId: string): Project => {
        const rooms = mockRoomsService.getRooms();
        const room = rooms.find((r) => r.id === roomId);
        if (!room) throw new Error("Room not found");

        const project = room.projects.find((p) => p.id === projectId);
        if (!project) throw new Error("Project not found");

        // Simulate AI generating tasks
        const mockTasks: Task[] = [
            {
                id: `task-${Date.now()}-1`,
                projectId,
                roomId,
                roomName: room.name,
                projectName: project.name,
                title: "Initial Research",
                description: "Gather user requirements and analyze competition.",
                dueDate: new Date(Date.now() + 86400000 * 3),
                status: "todo",
            },
            {
                id: `task-${Date.now()}-2`,
                projectId,
                roomId,
                roomName: room.name,
                projectName: project.name,
                title: "UI Mockups",
                description: "Create high-fidelity designs for the dashboard.",
                dueDate: new Date(Date.now() + 86400000 * 7),
                status: "todo",
            },
        ];

        project.tasks = mockTasks;
        project.isAIPlanGenerated = true;
        localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
        return project;
    },

    assignTask: (roomId: string, projectId: string, taskId: string, userId: string, userName: string): Task => {
        const rooms = mockRoomsService.getRooms();
        const room = rooms.find((r) => r.id === roomId);
        if (!room) throw new Error("Room not found");

        const project = room.projects.find((p) => p.id === projectId);
        if (!project) throw new Error("Project not found");

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) throw new Error("Task not found");

        task.assignedTo = userId;
        task.assignedToName = userName;
        localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
        return task;
    },

    updateTaskStatus: (roomId: string, projectId: string, taskId: string, status: TaskStatus): Task => {
        const rooms = mockRoomsService.getRooms();
        const room = rooms.find((r) => r.id === roomId);
        if (!room) throw new Error("Room not found");

        const project = room.projects.find((p) => p.id === projectId);
        if (!project) throw new Error("Project not found");

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) throw new Error("Task not found");

        task.status = status;
        localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
        return task;
    },

    getEmployeeTasks: (userId: string): Task[] => {
        const rooms = mockRoomsService.getRooms();
        const allTasks: Task[] = [];
        rooms.forEach((room) => {
            room.projects.forEach((project) => {
                project.tasks.forEach((task) => {
                    if (task.assignedTo === userId) {
                        allTasks.push(task);
                    }
                });
            });
        });
        return allTasks;
    },
};

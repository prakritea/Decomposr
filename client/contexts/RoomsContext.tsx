import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { ProjectRoom } from "@/types/room";
import { Project, Task, TaskStatus } from "@/types/project";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RoomsContextType {
    rooms: ProjectRoom[];
    userRooms: ProjectRoom[];
    createRoom: (name: string, description: string) => Promise<ProjectRoom>;
    joinRoom: (inviteCode: string) => Promise<ProjectRoom>;
    getRoom: (roomId: string) => Promise<ProjectRoom | null>;
    refreshRooms: () => Promise<void>;
    createProject: (roomId: string, name: string, description: string) => Promise<Project>;
    generateAIPlan: (roomId: string, projectId: string) => Promise<Project[]>;
    assignTask: (roomId: string, projectId: string, taskId: string, userId: string) => Promise<Task>;
    updateTaskStatus: (roomId: string, projectId: string, taskId: string, status: TaskStatus) => Promise<Task>;
    updateTask: (roomId: string, projectId: string, taskId: string, data: Partial<Task>) => Promise<Task>;
    getEmployeeTasks: () => Task[];
    deleteRoom: (id: string) => Promise<void>;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export function RoomsProvider({ children }: { children: ReactNode }) {
    const [rooms, setRooms] = useState<ProjectRoom[]>([]);
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();

    const refreshRooms = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await api.rooms.getUserRooms();
            setRooms(data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            refreshRooms();
        }
    }, [isAuthenticated, refreshRooms]);

    const userRooms = rooms; // Backend already returns user's rooms

    const createRoom = async (name: string, description: string): Promise<ProjectRoom> => {
        try {
            const room = await api.rooms.create({ name, description });
            await refreshRooms();
            toast({
                title: "Room created!",
                description: `${name} is ready for collaboration`,
            });
            return room;
        } catch (error) {
            toast({
                title: "Failed to create room",
                description: error instanceof Error ? error.message : "Unknown error",
                variant: "destructive",
            });
            throw error;
        }
    };

    const joinRoom = async (inviteCode: string): Promise<ProjectRoom> => {
        try {
            const room = await api.rooms.join({ inviteCode });
            await refreshRooms();
            toast({
                title: "Joined room!",
                description: `You are now a member of ${room.name}`,
            });
            return room;
        } catch (error) {
            toast({
                title: "Failed to join room",
                description: error instanceof Error ? error.message : "Invalid invite code",
                variant: "destructive",
            });
            throw error;
        }
    };

    const getRoom = async (roomId: string): Promise<ProjectRoom | null> => {
        try {
            return await api.rooms.getDetails(roomId);
        } catch (error) {
            return null;
        }
    };

    const createProject = async (roomId: string, name: string, description: string): Promise<Project> => {
        try {
            const project = await api.projects.create(roomId, { name, description });
            await refreshRooms();
            toast({ title: "Project created!", description: `${name} has been added to the room.` });
            return project;
        } catch (error) {
            toast({ title: "Error", description: "Could not create project", variant: "destructive" });
            throw error;
        }
    };

    const generateAIPlan = async (roomId: string, projectId: string): Promise<Project[]> => {
        try {
            const tasks = await api.projects.generateTasks(roomId, projectId);
            await refreshRooms();
            toast({ title: "AI Plan Generated!", description: "Tasks have been added to your project." });
            return tasks;
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Could not generate AI plan",
                variant: "destructive"
            });
            throw error;
        }
    };

    const assignTask = async (roomId: string, projectId: string, taskId: string, userId: string): Promise<Task> => {
        try {
            const task = await api.projects.assignTask(roomId, projectId, taskId, { userId });
            await refreshRooms();
            toast({ title: "Task assigned", description: "Task successfully assigned." });
            return task;
        } catch (error) {
            toast({ title: "Error", description: "Could not assign task", variant: "destructive" });
            throw error;
        }
    };

    const updateTaskStatus = async (roomId: string, projectId: string, taskId: string, status: TaskStatus): Promise<Task> => {
        try {
            const task = await api.projects.updateTask(roomId, projectId, taskId, { status });
            await refreshRooms();
            return task;
        } catch (error) {
            toast({ title: "Error", description: "Could not update task status", variant: "destructive" });
            throw error;
        }
    };

    const updateTask = async (roomId: string, projectId: string, taskId: string, data: Partial<Task>): Promise<Task> => {
        try {
            const task = await api.projects.updateTask(roomId, projectId, taskId, data);
            await refreshRooms();
            return task;
        } catch (error) {
            toast({ title: "Error", description: "Could not update task", variant: "destructive" });
            throw error;
        }
    };

    const getEmployeeTasks = (): Task[] => {
        if (!user) return [];
        return rooms.flatMap(room =>
            room.projects?.flatMap(project =>
                project.tasks?.filter(task => task.assignedToId === user.id) || []
            ) || []
        );
    };

    const deleteRoom = async (id: string): Promise<void> => {
        try {
            await api.rooms.delete(id);
            await refreshRooms();
            toast({ title: "Project deleted", description: "The project and all its data have been removed." });
        } catch (error) {
            toast({ title: "Error", description: "Could not delete project", variant: "destructive" });
        }
    };

    return (
        <RoomsContext.Provider
            value={{
                rooms,
                userRooms,
                createRoom,
                joinRoom,
                getRoom,
                refreshRooms,
                createProject,
                generateAIPlan,
                assignTask,
                updateTaskStatus,
                updateTask,
                getEmployeeTasks,
                deleteRoom,
            }}
        >
            {children}
        </RoomsContext.Provider>
    );
}

export function useRooms() {
    const context = useContext(RoomsContext);
    if (context === undefined) {
        throw new Error("useRooms must be used within a RoomsProvider");
    }
    return context;
}

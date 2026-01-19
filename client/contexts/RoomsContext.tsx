import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ProjectRoom } from "@/types/room";
import { mockRoomsService } from "@/lib/mockRooms";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RoomsContextType {
    rooms: ProjectRoom[];
    userRooms: ProjectRoom[];
    createRoom: (name: string, description: string) => Promise<ProjectRoom>;
    joinRoom: (inviteCode: string) => Promise<ProjectRoom>;
    getRoom: (roomId: string) => ProjectRoom | null;
    refreshRooms: () => void;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export function RoomsProvider({ children }: { children: ReactNode }) {
    const [rooms, setRooms] = useState<ProjectRoom[]>([]);
    const { user } = useAuth();
    const { toast } = useToast();

    const refreshRooms = () => {
        const allRooms = mockRoomsService.getRooms();
        setRooms(allRooms);
    };

    useEffect(() => {
        refreshRooms();
    }, []);

    const userRooms = user
        ? rooms.filter((room) => room.members.some((m) => m.userId === user.id))
        : [];

    const createRoom = async (name: string, description: string): Promise<ProjectRoom> => {
        if (!user) {
            throw new Error("Must be logged in to create a room");
        }

        try {
            const room = mockRoomsService.createRoom(name, description, user.id, user.name, user.email);
            refreshRooms();
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
        if (!user) {
            throw new Error("Must be logged in to join a room");
        }

        try {
            const room = mockRoomsService.joinRoom(inviteCode, user.id, user.name, user.email, user.role);
            refreshRooms();
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

    const getRoom = (roomId: string): ProjectRoom | null => {
        return rooms.find((r) => r.id === roomId) || null;
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

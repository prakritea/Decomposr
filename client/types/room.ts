import { User } from "./auth";
import { Project } from "./project";

export interface ProjectRoom {
    id: string;
    name: string;
    description: string;
    inviteCode: string;
    createdBy: string;
    createdAt: Date;
    members: RoomMember[];
    projects: Project[];
    projectPlanId?: string;
}

export interface RoomMember {
    userId: string;
    user: User;
    joinedAt: Date;
    role: "owner" | "member";
}

export interface RoomInvitation {
    code: string;
    roomId: string;
    createdBy: string;
    expiresAt?: Date;
    maxUses?: number;
    currentUses: number;
}

export type NotificationType =
    | "task_assigned"
    | "task_updated"
    | "deadline_changed"
    | "room_joined"
    | "room_invite"
    | "task_completed"
    | "plan_generated"
    | "member_joined";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    userId: string;
    metadata?: {
        taskId?: string;
        roomId?: string;
        projectId?: string;
    };
}

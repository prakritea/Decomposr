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
    type: string;
    title: string;
    message: string;
    createdAt: Date | string;
    read: boolean;
    userId: string;
    link?: string;
}

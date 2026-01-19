export type TaskStatus = "todo" | "inprogress" | "review" | "done";

export interface Task {
    id: string;
    projectId: string;
    roomId: string;
    roomName: string;
    projectName: string;
    title: string;
    description: string;
    assignedToId?: string; // userId
    assignedToName?: string;
    dueDate: Date | string;
    status: TaskStatus;
}

export interface Project {
    id: string;
    roomId: string;
    name: string;
    description: string;
    tasks: Task[];
    isAIPlanGenerated: boolean;
    createdAt: Date;
}

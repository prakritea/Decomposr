export type TaskStatus = "todo" | "inprogress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
    id: string;
    projectId: string;
    epicId?: string;
    roomId?: string;
    roomName?: string;
    projectName?: string;
    title: string;
    description: string;
    assignedToId?: string;
    assignedToName?: string;
    assignedTo?: {
        id: string;
        name: string;
        role: string;
        avatar: string | null;
    };
    dueDate: Date | string;
    status: TaskStatus;
    priority: TaskPriority;
    category?: string;
    effort?: string;
    dependencies?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    timeEstimate?: number;
    timeSpent?: number;
    startDate?: Date | string | null;
}

export interface Epic {
    id: string;
    name: string;
    description?: string;
    projectId: string;
    tasks: Task[];
}

export interface Project {
    id: string;
    roomId: string;
    name: string;
    description: string;
    summary?: string;
    architecture?: string;
    timeline?: string;
    tasks: Task[];
    epics: Epic[];
    isAIPlanGenerated: boolean;
    createdAt: Date;
}

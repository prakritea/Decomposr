import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Notification, NotificationType } from "@/types/notification";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const addNotification = (data: Omit<Notification, "id" | "timestamp" | "read">) => {
        const newNotification: Notification = {
            ...data,
            id: `notif-${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
            read: false,
        };
        setNotifications((prev) => [newNotification, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    // Add some demo notifications on mount
    useEffect(() => {
        const demoNotifications: Notification[] = [
            {
                id: "demo-1",
                type: "task_assigned",
                title: "New task assigned",
                message: "Build Login UI component",
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                read: false,
                userId: "current-user",
                metadata: { taskId: "task-1" },
            },
            {
                id: "demo-2",
                type: "room_joined",
                title: "New member joined",
                message: "Alice joined Food App project",
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                read: false,
                userId: "current-user",
                metadata: { roomId: "room-1" },
            },
        ];
        setNotifications(demoNotifications);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}

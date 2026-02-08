import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Notification } from "@/types/notification";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Fetch notifications from backend
    const fetchNotifications = async () => {
        try {
            const data = await api.notifications.getAll();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();

            // Connect socket
            const newSocket = io(window.location.origin, {
                query: { userId: user?.id }
            });

            newSocket.on("notification", (notif: Notification) => {
                setNotifications((prev) => [notif, ...prev]);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [isAuthenticated, user?.id]);

    const markAsRead = async (id: string) => {
        try {
            await api.notifications.markRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.notifications.markAllRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
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

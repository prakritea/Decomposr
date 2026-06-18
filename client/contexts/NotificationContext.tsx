import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Notification } from "@/types/notification";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  totalNotifications: number;
  hasMoreNotifications: boolean;
  loadMoreNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(false);
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async (pageNum = 1, append = false) => {
    try {
      const result = await api.notifications.getAll(pageNum, 20);
      if (append) {
        setNotifications(prev => [...prev, ...result.data]);
      } else {
        setNotifications(result.data);
      }
      setTotalNotifications(result.pagination.total);
      setHasMoreNotifications(result.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const loadMoreNotifications = async () => {
    if (hasMoreNotifications) {
      await fetchNotifications(page + 1, true);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();

      const getCookie = (name: string) => {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : null;
      };

      const newSocket = io(window.location.origin, {
        auth: { token: getCookie("token") },
      });

      newSocket.on("notification", (notif: Notification) => {
        setNotifications((prev) => [notif, ...prev]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated]);

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
      console.error("Failed to mark all as read:", error);
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
        totalNotifications,
        hasMoreNotifications,
        loadMoreNotifications,
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
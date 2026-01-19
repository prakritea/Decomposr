import { Notification } from "@/types/notification";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Users, FileText, Calendar } from "lucide-react";

interface NotificationItemProps {
    notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
    const { markAsRead } = useNotifications();

    const getIcon = () => {
        switch (notification.type) {
            case "task_assigned":
            case "task_completed":
                return <CheckCircle2 className="h-4 w-4 text-primary" />;
            case "task_updated":
            case "deadline_changed":
                return <AlertCircle className="h-4 w-4 text-yellow-400" />;
            case "room_joined":
            case "member_joined":
                return <Users className="h-4 w-4 text-accent" />;
            case "plan_generated":
                return <FileText className="h-4 w-4 text-blue-400" />;
            default:
                return <Calendar className="h-4 w-4 text-white/60" />;
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return "Just now";
    };

    return (
        <div
            className={cn(
                "p-4 hover:bg-white/5 transition-colors cursor-pointer",
                !notification.read && "bg-white/5"
            )}
            onClick={() => markAsRead(notification.id)}
        >
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{getIcon()}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                    </div>
                    <p className="text-sm text-white/60 mt-1">{notification.message}</p>
                    <p className="text-xs text-white/40 mt-2">{formatTime(notification.timestamp)}</p>
                </div>
            </div>
        </div>
    );
}

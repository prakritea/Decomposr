import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { CheckCheck, Trash2 } from "lucide-react";

export function NotificationPanel() {
    const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Notifications</h3>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-8 text-xs text-white/60 hover:text-white"
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                            className="h-8 text-xs text-white/60 hover:text-white"
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
            <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-white/40">
                        <Bell className="h-8 w-8 mb-2" />
                        <p className="text-sm">No notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {notifications.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

function Bell({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    );
}

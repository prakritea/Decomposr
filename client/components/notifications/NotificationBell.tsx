import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationPanel } from "./NotificationPanel";

export function NotificationBell() {
    const { unreadCount } = useNotifications();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white/80 hover:text-white hover:bg-white/10"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-[#60ff50] to-[#a64dff] flex items-center justify-center text-xs font-bold text-black">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-0 bg-black/95 border-white/10 backdrop-blur-xl"
                align="end"
            >
                <NotificationPanel />
            </PopoverContent>
        </Popover>
    );
}

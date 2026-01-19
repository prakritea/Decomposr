import { ProjectRoom } from "@/types/room";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface RoomCardProps {
    room: ProjectRoom;
    showInviteCode?: boolean;
}

export function RoomCard({ room, showInviteCode }: RoomCardProps) {
    const isOwner = (userId: string) => {
        return room.members?.find((m) => m.userId === userId)?.role === "owner";
    };

    return (
        <Card className="bg-black/80 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-white mb-2">{room.name}</CardTitle>
                        <CardDescription className="text-white/60">
                            {room.description || "No description"}
                        </CardDescription>
                    </div>
                    {showInviteCode && (
                        <Badge className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] text-black font-mono font-bold">
                            {room.inviteCode}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{room.members?.length || 0} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{room.createdAt ? new Date(room.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                    <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-primary hover:bg-white/10"
                    >
                        <Link to={`/rooms/${room.id}`}>
                            View
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

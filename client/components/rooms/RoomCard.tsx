import { ProjectRoom } from "@/types/room";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRooms } from "@/contexts/RoomsContext";
import { useAuth } from "@/contexts/AuthContext";

interface RoomCardProps {
    room: ProjectRoom;
    showInviteCode?: boolean;
}

export function RoomCard({ room, showInviteCode }: RoomCardProps) {
    const { deleteRoom } = useRooms();
    const { user } = useAuth();

    const isCreator = user?.id === room.creatorId;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${room.name}"? This action cannot be undone.`)) {
            await deleteRoom(room.id);
        }
    };

    return (
        <Card className="bg-black/80 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all group/card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
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
            <CardContent className="relative z-10">
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
                    <div className="flex items-center gap-2">
                        {isCreator && (
                            <Button
                                onClick={handleDelete}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
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
                </div>
            </CardContent>
        </Card>
    );
}

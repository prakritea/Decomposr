import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRooms } from "@/contexts/RoomsContext";
import { Button } from "@/components/ui/button";
import Aurora from "@/components/ui/Aurora";
import { Plus, Users as UsersIcon } from "lucide-react";
import { CreateRoomModal } from "@/components/rooms/CreateRoomModal";
import { JoinRoomModal } from "@/components/rooms/JoinRoomModal";
import { RoomCard } from "@/components/rooms/RoomCard";

export default function Rooms() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { userRooms, createRoom, joinRoom } = useRooms();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [joinModalOpen, setJoinModalOpen] = useState(
        location.state?.openJoinModal || false
    );

    useEffect(() => {
        if (location.state?.openJoinModal) {
            // Clear the state so it doesn't re-open on refresh or back navigation
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    const isPM = user?.role === "pm";

    const handleCreateRoom = async (name: string, description: string) => {
        await createRoom(name, description);
    };

    const handleJoinRoom = async (inviteCode: string) => {
        await joinRoom(inviteCode);
    };

    return (
        <div className="min-h-screen bg-black relative pt-20">
            {/* Aurora Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] z-0 opacity-30 pointer-events-none">
                <Aurora
                    colorStops={["#60ff50", "#a64dff", "#2000ff"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                        <p className="text-white/60">
                            {isPM
                                ? "Create and manage collaborative spaces for your team"
                                : "Join project rooms and collaborate with your team"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {!isPM && (
                            <Button
                                onClick={() => setJoinModalOpen(true)}
                                className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Join Room
                            </Button>
                        )}
                    </div>
                </div>

                {/* Rooms Grid */}
                {userRooms.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userRooms.map((room) => (
                            <RoomCard key={room.id} room={room} showInviteCode={isPM} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                            <UsersIcon className="w-8 h-8 text-white/40" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                        <p className="text-white/60 mb-6">
                            {isPM
                                ? "Start your first project to begin collaborating"
                                : "Join a room using an invite code to get started"}
                        </p>
                        {isPM ? (
                            <Button
                                onClick={() => setCreateModalOpen(true)}
                                className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Start Your First Project
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setJoinModalOpen(true)}
                                className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Join a Room
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateRoomModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onCreateRoom={handleCreateRoom}
            />
            <JoinRoomModal
                open={joinModalOpen}
                onOpenChange={setJoinModalOpen}
                onJoinRoom={handleJoinRoom}
            />
        </div>
    );
}

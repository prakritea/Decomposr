import { useParams } from "react-router-dom";
import { useRooms } from "@/contexts/RoomsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Aurora from "@/components/ui/Aurora";
import { Users, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectRoom() {
    const { roomId } = useParams<{ roomId: string }>();
    const { getRoom } = useRooms();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const room = roomId ? getRoom(roomId) : null;

    const copyInviteCode = () => {
        if (room) {
            navigator.clipboard.writeText(room.inviteCode);
            setCopied(true);
            toast({
                title: "Copied!",
                description: "Invite code copied to clipboard",
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!room) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Room not found
            </div>
        );
    }

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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{room.name}</h1>
                    <p className="text-white/60">{room.description}</p>
                </div>

                {/* Invite Code Card */}
                <Card className="bg-black/80 border-white/10 backdrop-blur-xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-white">Invite Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <Badge className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] text-black font-mono font-bold text-lg px-4 py-2">
                                    {room.inviteCode}
                                </Badge>
                                <p className="text-sm text-white/60 mt-2">
                                    Share this code with team members to invite them
                                </p>
                            </div>
                            <Button
                                onClick={copyInviteCode}
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Code
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Members */}
                <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Team Members ({room.members.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {room.members.map((member) => (
                                <div
                                    key={member.userId}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#60ff50] to-[#a64dff] flex items-center justify-center text-black font-bold">
                                            {member.user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()
                                                .slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{member.user.name}</p>
                                            <p className="text-sm text-white/60">{member.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="border-white/20 text-white/80">
                                            {member.user.role === "pm" ? "Product Manager" : "Team Member"}
                                        </Badge>
                                        {member.role === "owner" && (
                                            <Badge className="bg-primary/20 text-primary border-primary/30">
                                                Owner
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Briefcase, Users } from "lucide-react";
import Aurora from "@/components/ui/Aurora";

export default function Profile() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
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

            <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">
                <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24 border-4 border-white/10">
                                <AvatarFallback className="bg-gradient-to-br from-[#60ff50] to-[#a64dff] text-black font-bold text-2xl">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-3xl text-white mb-2">{user.name}</CardTitle>
                                <CardDescription className="text-white/60 text-lg">{user.email}</CardDescription>
                                <div className="mt-3">
                                    <Badge className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] text-black font-bold">
                                        {user.role === "pm" ? (
                                            <>
                                                <Briefcase className="w-3 h-3 mr-1" />
                                                Product Manager
                                            </>
                                        ) : (
                                            <>
                                                <Users className="w-3 h-3 mr-1" />
                                                Team Member
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 text-white/60 mb-2">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm font-medium">Email</span>
                                </div>
                                <p className="text-white">{user.email}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 text-white/60 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">Member Since</span>
                                </div>
                                <p className="text-white">
                                    {new Date(user.joinedAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Activity</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                                    <div className="text-3xl font-bold text-primary mb-1">0</div>
                                    <div className="text-sm text-white/60">Projects Joined</div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                                    <div className="text-3xl font-bold text-accent mb-1">0</div>
                                    <div className="text-sm text-white/60">Tasks Assigned</div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                                    <div className="text-3xl font-bold text-white mb-1">0</div>
                                    <div className="text-sm text-white/60">Tasks Completed</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Aurora from "@/components/ui/Aurora";
import {
    FolderKanban,
    CheckCircle2,
    Clock,
    Calendar,
    Plus,
} from "lucide-react";

export default function EmployeeDashboard() {
    const { user } = useAuth();

    const stats = [
        { label: "Joined Rooms", value: "0", icon: FolderKanban, color: "text-primary" },
        { label: "Assigned Tasks", value: "0", icon: CheckCircle2, color: "text-accent" },
        { label: "Completed", value: "0", icon: CheckCircle2, color: "text-green-400" },
        { label: "Upcoming Deadlines", value: "0", icon: Clock, color: "text-yellow-400" },
    ];

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
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user?.name}
                    </h1>
                    <p className="text-white/60">Team Member Dashboard</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <Card
                            key={idx}
                            className="bg-black/80 border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-white/60 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                                    </div>
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Join a Project Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/60 mb-4">
                                Enter an invite code to join a project room and start collaborating.
                            </p>
                            <Button
                                className="w-full bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Join Room
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">My Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/60 mb-4">
                                View and manage all tasks assigned to you across projects.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full border-white/20 text-white hover:bg-white/10"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                View All Tasks
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* My Rooms */}
                <Card className="bg-black/80 border-white/10 backdrop-blur-xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-white">My Project Rooms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-white/40">
                            <FolderKanban className="w-12 h-12 mx-auto mb-3" />
                            <p>No project rooms yet</p>
                            <p className="text-sm mt-1">Join a room using an invite code to get started</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-white/40">
                            <Calendar className="w-12 h-12 mx-auto mb-3" />
                            <p>No upcoming deadlines</p>
                            <p className="text-sm mt-1">Tasks with deadlines will appear here</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

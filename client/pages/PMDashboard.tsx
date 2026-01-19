import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Aurora from "@/components/ui/Aurora";
import {
    Users,
    FolderKanban,
    CheckCircle2,
    TrendingUp,
    Plus,
    ArrowRight,
} from "lucide-react";

export default function PMDashboard() {
    const { user } = useAuth();

    const stats = [
        { label: "Total Projects", value: "0", icon: FolderKanban, color: "text-primary" },
        { label: "Team Members", value: "0", icon: Users, color: "text-accent" },
        { label: "Tasks Completed", value: "0", icon: CheckCircle2, color: "text-green-400" },
        { label: "Sprint Progress", value: "0%", icon: TrendingUp, color: "text-blue-400" },
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
                    <p className="text-white/60">Product Manager Dashboard</p>
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
                            <CardTitle className="text-white">Create New Project</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/60 mb-4">
                                Use AI to generate a comprehensive project plan with tasks, roles, and timelines.
                            </p>
                            <Button
                                asChild
                                className="w-full bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold"
                            >
                                <Link to="/dashboard">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Generate Project Plan
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Project Rooms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/60 mb-4">
                                Create collaborative spaces for your team and manage invite codes.
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-white/20 text-white hover:bg-white/10"
                            >
                                <Link to="/rooms">
                                    <FolderKanban className="w-4 h-4 mr-2" />
                                    Manage Rooms
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-white/40">
                            <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                            <p>No recent activity</p>
                            <p className="text-sm mt-1">Create your first project to get started</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

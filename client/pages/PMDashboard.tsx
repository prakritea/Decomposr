import { useAuth } from "@/contexts/AuthContext";
import { useRooms } from "@/contexts/RoomsContext";
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
    Search,
    Activity as ActivityIcon,
    ListTodo,
    ClipboardCheck,
} from "lucide-react";
import { ActivityTimeline } from "@/components/rooms/ActivityTimeline";

export default function PMDashboard() {
    const { user } = useAuth();
    const { userRooms } = useRooms();

    const allTasks = userRooms.flatMap(r => (r.projects || []).flatMap(p => p.tasks || []));
    const completedTasks = allTasks.filter(t => t.status === 'done').length;
    const pendingReviews = allTasks.filter(t => t.status === 'review').length;
    const avgProgress = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

    const stats = [
        { label: "Project Rooms", value: userRooms.length.toString(), icon: FolderKanban, color: "text-primary" },
        { label: "Pending Reviews", value: pendingReviews.toString(), icon: ClipboardCheck, color: "text-accent" },
        { label: "Active Projects", value: userRooms.reduce((acc, room) => acc + (room.projects?.length || 0), 0).toString(), icon: FolderKanban, color: "text-green-400" },
        { label: "Avg. Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-blue-400" },
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
                        Product Manager Dashboard – Home
                    </h1>
                    <p className="text-white/60">Welcome back, {user?.name}</p>
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

                {/* Primary Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl border-dashed hover:border-primary/50 transition-all group overflow-hidden relative">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary" />
                                Create New Room
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-white/60 mb-6">
                                Start a new workspace for your team. You can invite members and create projects inside the room.
                            </p>
                            <Button
                                asChild
                                className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                            >
                                <Link to="/rooms">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl hover:border-accent/50 transition-all group overflow-hidden relative">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Search className="w-5 h-5 text-accent" />
                                View Existing Rooms
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-white/60 mb-6">
                                Access your active project rooms, manage members, and track project progress.
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-white/20 text-white hover:bg-white/10"
                            >
                                <Link to="/rooms">
                                    Open Rooms
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Aggregated from all rooms */}
                <div className="mt-8">
                    <ActivityTimeline tasks={userRooms.flatMap(room =>
                        (room.projects || []).flatMap(project =>
                            (project.tasks || []).map(task => ({
                                ...task,
                                roomName: room.name,
                                projectName: project.name
                            }))
                        )
                    )} />
                </div>
            </div>
        </div>
    );
}

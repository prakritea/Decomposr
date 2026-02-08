import { useAuth } from "@/contexts/AuthContext";
import { useRooms } from "@/contexts/RoomsContext";
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
    ArrowRight,
    Search,
    AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const { userRooms, getEmployeeTasks, acceptTask } = useRooms();

    const assignedTasks = getEmployeeTasks();
    const joinedRoomsCount = userRooms.length;
    const completedTasks = assignedTasks.filter(t => t.status === 'done').length;
    const upcomingDeadlines = assignedTasks.filter(t => t.status !== 'done' && new Date(t.dueDate) > new Date()).length;

    const stats = [
        { label: "Joined Rooms", value: joinedRoomsCount.toString(), icon: FolderKanban, color: "text-primary" },
        { label: "Assigned Tasks", value: assignedTasks.length.toString(), icon: CheckCircle2, color: "text-accent" },
        { label: "Completed", value: completedTasks.toString(), icon: CheckCircle2, color: "text-green-400" },
        { label: "Upcoming Deadlines", value: upcomingDeadlines.toString(), icon: Clock, color: "text-yellow-400" },
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
                        Team Member Dashboard – Home
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

                {/* Pending Tasks (Task Acceptance) */}
                <Card className="bg-black/80 border-white/10 backdrop-blur-xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            Tasks Needing Acceptance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {assignedTasks.filter(t => !t.isAccepted).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {assignedTasks.filter(t => !t.isAccepted).map((task) => (
                                    <div key={task.id} className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex flex-col justify-between group hover:border-primary/40 transition-all">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge className="bg-primary/20 text-primary border-none text-[10px] uppercase font-bold tracking-wider">{task.roomName}</Badge>
                                                <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">{task.projectName}</Badge>
                                            </div>
                                            <h4 className="text-white font-bold mb-1 group-hover:text-primary transition-colors">{task.title}</h4>
                                            <p className="text-white/60 text-xs line-clamp-2 mb-6">{task.description}</p>
                                        </div>
                                        <Button
                                            onClick={() => acceptTask(task.roomId!, task.projectId, task.id)}
                                            className="w-full bg-primary hover:bg-primary/80 text-black font-bold h-10 rounded-xl"
                                        >
                                            Accept Task
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-white/40 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-sm italic">All assigned tasks have been accepted. Check your rooms for progress!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Primary Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl border-dashed hover:border-primary/50 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary" />
                                Join New Room
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-white/60 mb-6">
                                Enter a room code provided by your Product Manager to join a team and start collaborating.
                            </p>
                            <Button
                                asChild
                                className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                            >
                                <Link to="/rooms">
                                    Enter Code
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl hover:border-accent/50 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Search className="w-5 h-5 text-accent" />
                                View My Rooms
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-white/60 mb-6">
                                Browse all the project rooms you've joined and access your assigned tasks.
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

                {/* Upcoming Deadlines */}
                <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            Upcoming Deadlines
                        </CardTitle>
                        <Badge variant="outline" className="text-white/40 border-white/10">Active Tasks</Badge>
                    </CardHeader>
                    <CardContent>
                        {assignedTasks.length > 0 ? (
                            <div className="space-y-4">
                                {assignedTasks
                                    .filter(t => t.status !== 'done')
                                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                                    .slice(0, 5)
                                    .map((task) => (
                                        <div key={task.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] uppercase border-primary/20 text-primary">
                                                        {task.roomName}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[10px] uppercase border-white/10 text-white/40">
                                                        {task.projectName}
                                                    </Badge>
                                                </div>
                                                <h4 className="text-white font-medium group-hover:text-primary transition-colors">{task.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Calendar className="w-4 h-4 text-white/20" />
                                                    <span className="text-sm">Due {new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}</span>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-white/40 border border-dashed border-white/10 rounded-xl">
                                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No upcoming deadlines</p>
                                <p className="text-sm mt-1">Tasks from all your rooms will appear here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

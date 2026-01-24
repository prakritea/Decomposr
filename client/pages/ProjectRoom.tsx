import { useParams } from "react-router-dom";
import { useRooms } from "@/contexts/RoomsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Aurora from "@/components/ui/Aurora";
import {
    Users,
    Copy,
    CheckCircle2,
    Plus,
    Sparkles,
    Calendar,
    LayoutDashboard,
    Clock,
    User as UserIcon,
    AlertCircle,
    ListTodo,
    Activity
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreateProjectModal } from "@/components/rooms/CreateProjectModal";
import { KanbanBoard } from "@/components/rooms/KanbanBoard";
import { ProjectOverview } from "@/components/rooms/ProjectOverview";
import { EpicsList } from "@/components/rooms/EpicsList";
import { AnalyticsTab } from "@/components/rooms/AnalyticsTab";
import { ActivityTimeline } from "@/components/rooms/ActivityTimeline";
import type { ProjectRoom as RoomData, RoomMember } from "@/types/room";
import { Project, Task, TaskStatus } from "@/types/project";

export default function ProjectRoom() {
    const { roomId } = useParams<{ roomId: string }>();
    const { getRoom, generateAIPlan, assignTask, updateTaskStatus, refreshRooms } = useRooms();
    const { user } = useAuth();
    const { toast } = useToast();
    const [room, setRoom] = useState<RoomData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [projectModalOpen, setProjectModalOpen] = useState(false);

    const fetchRoom = useCallback(async () => {
        if (!roomId) return;
        setIsLoading(true);
        const data = await getRoom(roomId);
        setRoom(data);
        setIsLoading(false);
    }, [roomId, getRoom]);

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom]);

    const isPM = user?.role === "pm";

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

    const handleGenerateAI = async (rid: string, pid: string) => {
        try {
            await generateAIPlan(rid, pid);
            await fetchRoom(); // Refresh room data to show new tasks
        } catch (error) {
            console.error(error);
        }
    };

    const handleSetActiveProject = (project: Project) => {
        setActiveProject(project);
        setActiveTab("board");
    };

    const handleAssignTask = async (pid: string, tid: string, uid: string) => {
        if (!room) return;
        try {
            await assignTask(room.id, pid, tid, uid);
            // Optimistically update active project if on board
            if (activeProject && activeProject.id === pid) {
                const updatedTasks = activeProject.tasks.map(t =>
                    t.id === tid ? { ...t, assignedToId: uid } : t
                );
                setActiveProject({ ...activeProject, tasks: updatedTasks });
            }
            await fetchRoom();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateStatus = async (pid: string, tid: string, status: TaskStatus) => {
        if (!room) return;
        try {
            await updateTaskStatus(room.id, pid, tid, status);
            // Optimistic update handled in board, but sync needed
            await fetchRoom();
        } catch (error) {
            console.error(error);
        }
    };

    // Sync active project with room data updates
    useEffect(() => {
        if (room) {
            if (activeProject) {
                const current = room.projects.find(p => p.id === activeProject.id);
                if (current) setActiveProject(current);
            } else if (room.projects.length > 0) {
                // Auto-select first project
                setActiveProject(room.projects[0]);
            }
        }
    }, [room, activeProject]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white/60">Loading room details...</p>
                </div>
            </div>
        );
    }

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
            <div className="absolute top-0 left-0 w-full h-[300px] z-0 opacity-20 pointer-events-none">
                <Aurora
                    colorStops={["#60ff50", "#a64dff", "#2000ff"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
                {/* Enhanced Header */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-4xl font-bold text-white tracking-tight">{room.name}</h1>
                                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1">
                                    <LayoutDashboard className="w-3 h-3 mr-1.5" />
                                    Room
                                </Badge>
                            </div>
                            <p className="text-white/70 text-lg max-w-3xl leading-relaxed">{room.description}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            {isPM && (
                                <Button
                                    onClick={() => setProjectModalOpen(true)}
                                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-black font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Project
                                </Button>
                            )}
                            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-3 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/50 uppercase font-semibold tracking-wider mb-0.5">Invite Code</span>
                                        <span className="text-sm text-white font-mono font-bold tracking-wide">{room.inviteCode}</span>
                                    </div>
                                    <Button
                                        onClick={copyInviteCode}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-purple-300/80 uppercase tracking-wide">Tasks</span>
                                    <ListTodo className="w-4 h-4 text-purple-400/60" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {room.projects.reduce((sum, p) => sum + p.tasks.length, 0)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-green-300/80 uppercase tracking-wide">Completed</span>
                                    <CheckCircle2 className="w-4 h-4 text-green-400/60" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {room.projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'done').length, 0)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-orange-300/80 uppercase tracking-wide">Members</span>
                                    <Users className="w-4 h-4 text-orange-400/60" />
                                </div>
                                <div className="text-2xl font-bold text-white">{room.members.length}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-gradient-to-r from-white/5 to-white/10 border border-white/20 p-1.5 rounded-xl backdrop-blur-sm shadow-lg">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:border data-[state=active]:border-primary/30 text-white/60 data-[state=active]:text-white font-medium rounded-lg transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="board"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:border data-[state=active]:border-primary/30 text-white/60 data-[state=active]:text-white font-medium rounded-lg transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10"
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Kanban Board
                        </TabsTrigger>
                        <TabsTrigger
                            value="epics"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:border data-[state=active]:border-primary/30 text-white/60 data-[state=active]:text-white font-medium rounded-lg transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Epics
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:border data-[state=active]:border-primary/30 text-white/60 data-[state=active]:text-white font-medium rounded-lg transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10"
                        >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger
                            value="members"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:border data-[state=active]:border-primary/30 text-white/60 data-[state=active]:text-white font-medium rounded-lg transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Members
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        {activeProject ? (
                            <ProjectOverview project={activeProject} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                                <p>No active project plan to view overview.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="epics">
                        {activeProject ? (
                            <EpicsList project={activeProject} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                <Calendar className="w-16 h-16 mb-4 opacity-20" />
                                <p>No active project plan to view epics.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics">
                        {activeProject ? (
                            <AnalyticsTab project={activeProject} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                <AlertCircle className="w-16 h-16 mb-4 opacity-20" />
                                <p>No active project plan to view analytics.</p>
                            </div>
                        )}
                    </TabsContent>


                    <TabsContent value="board" className="h-[calc(100vh-200px)]">
                        {activeProject ? (
                            <KanbanBoard
                                project={activeProject}
                                members={room.members}
                                currentUser={user || undefined}
                                onUpdateStatus={(tid, status) => handleUpdateStatus(activeProject.id, tid, status)}
                                onAssignTask={(taskId, userId) => handleAssignTask(activeProject.id, taskId, userId)}
                                onUpdateTask={(taskId, data) => useRooms().updateTask(room.id, activeProject.id, taskId, data)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white/40">
                                <ListTodo className="w-16 h-16 mb-4 opacity-20" />
                                <p>Select a project with an active plan to view the board.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="members">
                        <Card className="bg-gradient-to-br from-black/90 to-black/70 border-white/20 backdrop-blur-xl shadow-xl">
                            <CardHeader className="border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30">
                                        <Users className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-xl">Team Members</CardTitle>
                                        <p className="text-sm text-white/50 font-normal mt-0.5">{room.members.length} active members</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {room.members.map((member) => (
                                        <div key={member.userId} className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-xl shadow-lg">
                                                        {member.user.name.charAt(0)}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{member.user.name} {member.userId === user?.id && <span className="text-primary/60 text-xs ml-1">(You)</span>}</p>
                                                    <p className="text-xs text-white/40">{member.user.email}</p>
                                                    <div className="flex gap-3 mt-1.5">
                                                        {(() => {
                                                            const stats = room.projects.reduce((acc, project) => {
                                                                const userTasks = project.tasks.filter(t => t.assignedToId === member.userId);
                                                                return {
                                                                    assigned: acc.assigned + userTasks.length,
                                                                    completed: acc.completed + userTasks.filter(t => t.status === 'done').length
                                                                };
                                                            }, { assigned: 0, completed: 0 });

                                                            return (
                                                                <>
                                                                    <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                                        <ListTodo className="w-3 h-3" />
                                                                        <span className="text-white font-semibold">{stats.assigned}</span> Assigned
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                                                                        <span className="text-green-400 font-semibold">{stats.completed}</span> Done
                                                                    </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="border-white/10 text-white/60">
                                                {member.user.role === "pm" ? "Product Manager" : "Team Member"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <CreateProjectModal
                open={projectModalOpen}
                onOpenChange={setProjectModalOpen}
                roomId={room.id}
            />
        </div>
    );
}

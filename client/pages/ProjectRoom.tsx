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
    ListTodo
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreateProjectModal } from "@/components/rooms/CreateProjectModal";
import { KanbanBoard } from "@/components/rooms/KanbanBoard";
import { ProjectOverview } from "@/components/rooms/ProjectOverview";
import { EpicsList } from "@/components/rooms/EpicsList";
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
    const [activeTab, setActiveTab] = useState("projects");
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
        if (room && activeProject) {
            const current = room.projects.find(p => p.id === activeProject.id);
            if (current) setActiveProject(current);
        }
    }, [room]);

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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">{room.name}</h1>
                            <Badge variant="outline" className="text-primary border-primary/20">Room Dashboard</Badge>
                        </div>
                        <p className="text-white/60 max-w-2xl">{room.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isPM && (
                            <Button
                                onClick={() => setProjectModalOpen(true)}
                                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-black font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Project
                            </Button>
                        )}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center gap-3">
                            <span className="text-xs text-white/40 uppercase font-semibold">Invite Code: {room.inviteCode}</span>
                            <Button onClick={copyInviteCode} variant="ghost" size="icon" className="h-6 w-6 text-white/60 hover:text-white">
                                {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white/5 border border-white/10 p-1">
                        <TabsTrigger value="projects" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Projects
                        </TabsTrigger>
                        <TabsTrigger value="board" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                            <Clock className="w-4 h-4 mr-2" />
                            Kanban Board
                        </TabsTrigger>
                        <TabsTrigger value="members" className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white">
                            <Users className="w-4 h-4 mr-2" />
                            Members
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects" className="space-y-6">
                        {room.projects.length === 0 ? (
                            <Card className="bg-black/50 border-white/10 border-dashed py-12">
                                <CardContent className="flex flex-col items-center text-center">
                                    <AlertCircle className="w-12 h-12 text-white/20 mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                                    <p className="text-white/60 mb-6">Create a project to start planning and generating AI tasks.</p>
                                    {isPM && (
                                        <Button onClick={() => setProjectModalOpen(true)} variant="outline" className="border-white/20 text-white">
                                            Create First Project
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-8">
                                {room.projects.map((project) => (
                                    <div key={project.id} className="space-y-6">
                                        <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                                            <CardHeader>
                                                <CardTitle className="text-white flex items-center justify-between">
                                                    {project.name}
                                                    {project.isAIPlanGenerated ? (
                                                        <div className="flex gap-2">
                                                            <Button onClick={() => handleSetActiveProject(project)} size="sm" variant="outline" className="h-8 border-primary/30 text-primary">
                                                                View Board
                                                            </Button>
                                                            <Sparkles className="w-4 h-4 text-accent" />
                                                        </div>
                                                    ) : isPM && (
                                                        <Button
                                                            onClick={() => handleGenerateAI(room.id, project.id)}
                                                            className="bg-accent/20 hover:bg-accent/30 text-accent border border-accent/20 h-8"
                                                        >
                                                            <Sparkles className="w-4 h-4 mr-2" />
                                                            Generate AI Plan
                                                        </Button>
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {project.isAIPlanGenerated ? (
                                                    <Tabs defaultValue="overview" className="w-full">
                                                        <TabsList className="bg-black/40 border border-white/5 mb-4 w-full justify-start h-10 p-0">
                                                            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 h-full px-6 rounded-none data-[state=active]:border-b-2 border-primary">Overview</TabsTrigger>
                                                            <TabsTrigger value="epics" className="data-[state=active]:bg-white/10 h-full px-6 rounded-none data-[state=active]:border-b-2 border-primary">Epics & Breakdown</TabsTrigger>
                                                        </TabsList>
                                                        <TabsContent value="overview">
                                                            <ProjectOverview project={project} />
                                                        </TabsContent>
                                                        <TabsContent value="epics">
                                                            <EpicsList project={project} />
                                                        </TabsContent>
                                                    </Tabs>
                                                ) : (
                                                    <div className="text-center py-8 text-white/40">
                                                        <p>No plan generated yet. Generate an AI plan to see architecture, timeline, and epics.</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
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
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white/40">
                                <ListTodo className="w-16 h-16 mb-4 opacity-20" />
                                <p>Select a project with an active plan to view the board.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="members">
                        <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white">Active Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {room.members.map((member) => (
                                        <div key={member.userId} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold text-lg">
                                                    {member.user.name.charAt(0)}
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

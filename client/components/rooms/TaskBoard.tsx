import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project, Task, TaskStatus } from "@/types/project";
import { RoomMember } from "@/types/room";
import { CheckCircle2, Clock, User as UserIcon, AlertCircle, ChevronRight, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export function TaskBoard({
    roomId,
    projects,
    isPM,
    members,
    onAssignTask,
    onUpdateStatus
}: {
    roomId: string;
    projects: Project[];
    isPM: boolean;
    members: RoomMember[];
    onAssignTask: (pid: string, tid: string, uid: string) => void;
    onUpdateStatus: (pid: string, tid: string, status: TaskStatus) => void;
}) {
    const { user } = useAuth();

    // Flatten tasks and filter if employee
    const allTasks = projects.flatMap(p => p.tasks.map(t => ({ ...t, project: p })));
    const visibleTasks = isPM ? allTasks : allTasks.filter(t => t.assignedToId === user?.id);

    const statusConfig = {
        todo: { label: "To Do", color: "text-white/40", icon: AlertCircle },
        inprogress: { label: "In Progress", color: "text-blue-400", icon: Clock },
        review: { label: "Review", color: "text-yellow-400", icon: Clock },
        done: { label: "Completed", color: "text-green-400", icon: CheckCircle2 },
    };

    if (visibleTasks.length === 0) {
        return (
            <Card className="bg-black/50 border-white/10 border-dashed py-12">
                <CardContent className="flex flex-col items-center text-center">
                    <AlertCircle className="w-12 h-12 text-white/20 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                    <p className="text-white/60">
                        {isPM
                            ? "Generate an AI plan for a project to see tasks here."
                            : "No tasks have been assigned to you in this room yet."}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {visibleTasks.map((task) => {
                const StatusIcon = statusConfig[task.status].icon;
                return (
                    <Card key={task.id} className="bg-black/80 border-white/10 hover:border-white/20 transition-all">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] uppercase border-white/10 text-white/40">
                                            {task.project.name}
                                        </Badge>
                                        <span className={`text-xs flex items-center gap-1 ${statusConfig[task.status].color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusConfig[task.status].label}
                                        </span>
                                    </div>
                                    <h4 className="text-white font-medium">{task.title}</h4>
                                    <p className="text-sm text-white/40 line-clamp-1">{task.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-white/20" />
                                        <span className="text-xs text-white/60">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {task.assignedToId ? (
                                            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-black font-bold">
                                                    {task.assignedToName?.charAt(0)}
                                                </div>
                                                <span className="text-xs text-white/80">{task.assignedToName}</span>
                                            </div>
                                        ) : (
                                            isPM && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary/80 hover:bg-primary/10">
                                                            <UserPlus className="w-4 h-4 mr-1" />
                                                            Assign
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-[#0a0a0a] border-white/10 text-white">
                                                        {members.filter(m => m.user.role === "employee").map((member) => (
                                                            <DropdownMenuItem
                                                                key={member.userId}
                                                                onClick={() => onAssignTask(task.projectId, task.id, member.userId)}
                                                                className="hover:bg-white/10 cursor-pointer"
                                                            >
                                                                {member.user.name}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )
                                        )}
                                    </div>

                                    {!isPM && task.status !== "done" && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-8 border-white/10 text-white hover:bg-white/5">
                                                    Update Status
                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-[#0a0a0a] border-white/10 text-white">
                                                <DropdownMenuItem onClick={() => onUpdateStatus(task.projectId, task.id, "inprogress")} className="hover:bg-white/10 cursor-pointer">In Progress</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onUpdateStatus(task.projectId, task.id, "review")} className="hover:bg-white/10 cursor-pointer">In Review</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onUpdateStatus(task.projectId, task.id, "done")} className="hover:bg-white/10 cursor-pointer text-green-400">Mark Completed</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

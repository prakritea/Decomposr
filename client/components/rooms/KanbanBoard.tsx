import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Project, Task, TaskStatus } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CheckCircle2, MoreHorizontal, User as UserIcon } from "lucide-react";
import { TaskDetailSheet } from "@/components/dashboard/TaskDetailSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

import { RoomMember } from "@/types/room";

interface KanbanBoardProps {
    project: Project;
    members: RoomMember[];
    currentUser?: { id: string; role: string };
    onUpdateStatus: (taskId: string, status: TaskStatus) => void;
    onAssignTask: (taskId: string, userId: string) => void;
    onUpdateTask: (taskId: string, data: Partial<Task>) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: "todo", label: "To Do", color: "bg-white/5" },
    { id: "inprogress", label: "In Progress", color: "bg-blue-500/10 border-blue-500/20" },
    { id: "review", label: "Review", color: "bg-yellow-500/10 border-yellow-500/20" },
    { id: "done", label: "Done", color: "bg-green-500/10 border-green-500/20" }
];

export function KanbanBoard({ project, members, currentUser, onUpdateStatus, onAssignTask, onUpdateTask }: KanbanBoardProps) {
    const { toast } = useToast();
    const [tasks, setTasks] = useState<Task[]>(project.tasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        setTasks(project.tasks);
    }, [project.tasks]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as TaskStatus;

        // Restriction: PM cannot move to review
        if (newStatus === 'review' && currentUser?.role === 'pm') {
            toast({
                title: "Action Restricted",
                description: "Only Team Members can signal that a task is ready for review.",
                variant: "destructive"
            });
            // Card will snap back automatically if we don't update state
            return;
        }

        // Optimistic UI update
        const updatedTasks = tasks.map(t =>
            t.id === draggableId ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);

        // API Call
        onUpdateStatus(draggableId, newStatus);
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setSheetOpen(true);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
                {COLUMNS.map((col) => (
                    <div key={col.id} className="min-w-[300px] w-full flex flex-col rounded-xl bg-black/20 border border-white/10">
                        <div className={`p-4 border-b border-white/5 ${col.color}`}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-white">{col.label}</h3>
                                <Badge variant="secondary" className="bg-black/40 text-white/60">
                                    {tasks.filter(t => t.status === col.id).length}
                                </Badge>
                            </div>
                        </div>

                        <Droppable droppableId={col.id}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="p-3 flex-1 overflow-y-auto space-y-3"
                                >
                                    {tasks.filter(t => t.status === col.id).map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => handleTaskClick(task)}
                                                    className="bg-[#1a1a1a] border-white/5 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing group"
                                                >
                                                    <CardContent className="p-3 space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">
                                                                {task.priority}
                                                            </Badge>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white/20 opacity-0 group-hover:opacity-100">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </div>

                                                        <div>
                                                            <p className="text-white text-sm font-medium leading-tight mb-1">{task.title}</p>
                                                            <p className="text-xs text-white/40 line-clamp-2">{task.description}</p>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                            <div className="flex items-center gap-2">
                                                                {task.assignedTo ? (
                                                                    <div title={task.assignedTo.name}>
                                                                        <Avatar className="h-6 w-6 border border-white/10">
                                                                            <AvatarImage src={task.assignedTo.avatar || undefined} />
                                                                            <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                                                                                {task.assignedTo.name.charAt(0).toUpperCase()}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                    </div>
                                                                ) : task.assignedToName ? (
                                                                    <Badge variant="secondary" className="h-6 px-1.5 bg-primary/20 text-primary hover:bg-primary/30 text-[10px]">
                                                                        {task.assignedToName.charAt(0)}
                                                                    </Badge>
                                                                ) : (
                                                                    <UserIcon className="w-4 h-4 text-white/20" />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center text-[10px] text-white/40 gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>

            <TaskDetailSheet
                task={selectedTask}
                members={members}
                currentUser={currentUser}
                onAssign={onAssignTask}
                onStatusChange={onUpdateStatus}
                onUpdateTask={onUpdateTask}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </DragDropContext>
    );
}

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types/project";
import { RoomMember } from "@/types/room";
import { Clock, Calendar, AlertCircle, CheckCircle2, Bot, MessageSquare, Check, UserPlus } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskDetailSheetProps {
    task: Task | null;
    members: RoomMember[];
    currentUser?: { id: string; role: string };
    onAssign: (taskId: string, userId: string) => void;
    onStatusChange?: (taskId: string, status: "todo" | "inprogress" | "review" | "done") => void;
    onUpdateTask: (taskId: string, data: Partial<Task>) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TaskDetailSheet({ task, members, currentUser, onAssign, onStatusChange, onUpdateTask, open, onOpenChange }: TaskDetailSheetProps) {
    const [assigneeOpen, setAssigneeOpen] = useState(false);

    if (!task) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl w-[90vw] flex flex-col h-full">
                <SheetHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="capitalize">
                            {task.status}
                        </Badge>
                        <Badge
                            variant={task.priority === "urgent" || task.priority === "high" ? "destructive" : "secondary"}
                            className="capitalize"
                        >
                            {task.priority} Priority
                        </Badge>
                    </div>
                    <SheetTitle className="text-2xl font-bold">{task.title}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1 text-xs">
                            <Clock className="w-3 h-3" /> {task.effort || "No estimate"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-xs">
                            <Calendar className="w-3 h-3" /> Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="space-y-6 pb-8">
                        {/* Time & Schedule */}
                        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                    value={task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => onUpdateTask(task.id, { startDate: e.target.value ? new Date(e.target.value) : null })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block">Est. Hours</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                    placeholder="0"
                                    value={task.timeEstimate || 0}
                                    onChange={(e) => onUpdateTask(task.id, { timeEstimate: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block">Time Spent</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                    placeholder="0"
                                    value={task.timeSpent || 0}
                                    onChange={(e) => onUpdateTask(task.id, { timeSpent: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        {/* Assignee Section */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <span className="text-sm font-medium text-muted-foreground">Assignee</span>

                            <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                                        <div className="flex items-center gap-3 text-right">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {task.assignedTo?.name || "Unassigned"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {task.assignedTo?.role || "Click to assign"}
                                                </p>
                                            </div>
                                            <Avatar>
                                                <AvatarImage src={task.assignedTo?.avatar || undefined} />
                                                <AvatarFallback className={cn(!task.assignedTo && "bg-muted border-dashed border-2")}>
                                                    {task.assignedTo?.name?.charAt(0).toUpperCase() || <UserPlus className="w-4 h-4 text-muted-foreground" />}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="end">
                                    <Command>
                                        <CommandInput placeholder="Search team member..." />
                                        <CommandList>
                                            <CommandEmpty>No member found.</CommandEmpty>
                                            <CommandGroup>
                                                {members.map((member) => (
                                                    <CommandItem
                                                        key={member.userId}
                                                        value={member.user.name}
                                                        onSelect={() => {
                                                            onAssign(task.id, member.userId);
                                                            setAssigneeOpen(false);
                                                        }}
                                                    >
                                                        <Avatar className="mr-2 h-6 w-6">
                                                            <AvatarImage src={member.user.avatar || undefined} />
                                                            <AvatarFallback className="text-[10px]">
                                                                {member.user.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{member.user.name}</span>
                                                            <span className="text-[10px] text-muted-foreground capitalize">{member.user.role === 'pm' ? 'Product Manager' : 'Team Member'}</span>
                                                        </div>
                                                        {task.assignedToId === member.userId && (
                                                            <Check className="ml-auto h-4 w-4 opacity-100" />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-medium mb-2">Description</h3>
                            <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap rounded-md border p-3 bg-muted/30">
                                {task.description}
                            </div>
                        </div>

                        {/* Acceptance Criteria (Mocked for now) */}
                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Acceptance Criteria
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="text-muted-foreground">Feature functionality matches requirements</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="text-muted-foreground">Unit tests pass with &gt;80% coverage</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="text-muted-foreground">UI represents approved design mocks</span>
                                </li>
                            </ul>
                        </div>

                        {/* AI Suggestions */}
                        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                            <h3 className="text-sm font-medium text-purple-600 dark:text-purple-300 mb-3 flex items-center gap-2">
                                <Bot className="w-4 h-4" />
                                AI Suggestions
                            </h3>
                            <div className="space-y-3">
                                <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded border border-purple-500/10">
                                    Consider breaking this task into two smaller sub-tasks: "API Schema Design" and "Endpoint Implementation".
                                </div>
                                <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded border border-purple-500/10">
                                    Reminder: This task has a dependency on "User Authentication" which is currently In Progress.
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Activity / Comments */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Comments
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback>PM</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Product Manager</span>
                                            <span className="text-[10px] text-muted-foreground">2h ago</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Please ensure we handle the edge case for timeout errors.</p>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <Textarea
                                        placeholder="Add a comment..."
                                        className="text-xs min-h-[80px]"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button size="sm">Post Comment</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollArea>

                {/* Footer Actions */}
                {task.status === "todo" && task.assignedToId === currentUser?.id && (
                    <div className="border-t p-4 -mx-6 bg-muted/20 mt-auto">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                if (onStatusChange) {
                                    onStatusChange(task.id, "inprogress");
                                    onOpenChange(false);
                                }
                            }}
                        >
                            Accept Task & Start Working
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

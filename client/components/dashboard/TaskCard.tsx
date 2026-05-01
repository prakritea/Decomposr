import { Trash2, Edit2, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Task {
  id: string;
  title: string;
  description: string;
  role: string;
  priority: "low" | "medium" | "high";
  effort: string;
  assignedTo?: {
    id: string;
    name: string;
    role: string;
    avatar: string | null;
  };
  dependencies?: string[];
  category?: "Frontend" | "Backend" | "Integration" | "DevOps" | "Testing";
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const categoryColors = {
  Frontend: "text-blue-600 dark:text-blue-300",
  Backend: "text-purple-600 dark:text-purple-300",
  Integration: "text-cyan-600 dark:text-cyan-300",
  DevOps: "text-orange-600 dark:text-orange-300",
  Testing: "text-green-600 dark:text-green-300",
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  draggable = false,
  onDragStart,
}: TaskCardProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={`p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all ${draggable ? "cursor-grab active:cursor-grabbing" : ""
        }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm leading-tight">
            {task.title}
          </h3>
          {task.category && (
            <p className={`text-xs mt-1 font-medium ${categoryColors[task.category]}`}>
              {task.category}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-foreground/70 line-clamp-2 mb-3">
        {task.description}
      </p>

      <div className="flex items-center justify-between mt-3 space-x-2">
        <div className="flex items-center gap-2 flex-wrap">
          {task.role && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-primary-50 text-primary dark:bg-primary-900/20 dark:text-primary-300">
              {task.role}
            </span>
          )}
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]
              }`}
          >
            {task.priority}
          </span>
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-2" title={`Assigned to ${task.assignedTo.name} (${task.assignedTo.role})`}>
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={task.assignedTo.avatar || undefined} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {task.assignedTo.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      {(task.effort || (task.dependencies && task.dependencies.length > 0)) && (
        <div className="mt-3 pt-2 border-t border-border space-y-2">
          {task.effort && (
            <p className="text-xs text-foreground/60">
              <span className="font-medium">Effort:</span> {task.effort}
            </p>
          )}
          {task.dependencies && task.dependencies.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground/70 mb-1">
                Dependencies:
              </p>
              <p className="text-xs text-foreground/60">
                {task.dependencies.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

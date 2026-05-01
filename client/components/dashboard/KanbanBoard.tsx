import { useState } from "react";
import { TaskCard, Task } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export type BoardStatus = "backlog" | "todo" | "inprogress" | "done";

interface KanbanColumn {
  id: BoardStatus;
  title: string;
  color: string;
}

const columns: KanbanColumn[] = [
  { id: "backlog", title: "Backlog", color: "bg-slate-100 dark:bg-slate-900" },
  { id: "todo", title: "To Do", color: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "inprogress", title: "In Progress", color: "bg-yellow-50 dark:bg-yellow-900/20" },
  { id: "done", title: "Done", color: "bg-green-50 dark:bg-green-900/20" },
];

interface KanbanBoardProps {
  tasks: Record<BoardStatus, Task[]>;
  onMoveTask?: (taskId: string, from: BoardStatus, to: BoardStatus) => void;
  onAddTask?: (status: BoardStatus) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function KanbanBoard({
  tasks,
  onMoveTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    fromStatus: BoardStatus;
  } | null>(null);

  const handleDragStart = (taskId: string, status: BoardStatus) => {
    setDraggedTask({ taskId, fromStatus: status });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toStatus: BoardStatus) => {
    if (!draggedTask || !onMoveTask) return;

    if (draggedTask.fromStatus !== toStatus) {
      onMoveTask(draggedTask.taskId, draggedTask.fromStatus, toStatus);
    }
    setDraggedTask(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
          className={`rounded-lg border border-border p-4 min-h-[500px] ${column.color}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {column.title}
              <span className="text-xs font-normal bg-background/50 rounded-full px-2 py-1">
                {tasks[column.id]?.length || 0}
              </span>
            </h3>
            {onAddTask && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddTask(column.id)}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {tasks[column.id]?.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task.id, column.id)}
                className={draggedTask?.taskId === task.id ? "opacity-50" : ""}
              >
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  draggable
                />
              </div>
            ))}
            {(!tasks[column.id] || tasks[column.id].length === 0) && (
              <div className="p-8 text-center text-foreground/40">
                <p className="text-sm">Drop tasks here</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { TaskCard, Task } from "./TaskCard";

export interface Epic {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  estimatedWeeks?: number;
}

interface EpicCardProps {
  epic: Epic;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

export function EpicCard({ epic, onTaskEdit, onTaskDelete }: EpicCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const tasksByCategory = epic.tasks.reduce(
    (acc, task) => {
      const category = task.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20 hover:bg-primary-100/50 dark:hover:from-primary-800/30 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
          )}
          <div>
            <h3 className="font-semibold text-foreground">{epic.title}</h3>
            <p className="text-sm text-foreground/60">{epic.description}</p>
          </div>
        </div>
        <div className="text-right ml-2">
          <p className="text-sm font-medium text-foreground">
            {epic.tasks.length} tasks
          </p>
          {epic.estimatedWeeks && (
            <p className="text-xs text-foreground/60">
              ~{epic.estimatedWeeks}w
            </p>
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border p-4 space-y-6">
          {Object.entries(tasksByCategory).map(([category, tasks]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-primary mb-3">
                {category}
              </h4>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onTaskEdit}
                    onDelete={onTaskDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

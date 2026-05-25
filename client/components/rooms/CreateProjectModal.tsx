import { useState, useEffect } from "react";
import { useRooms } from "@/contexts/RoomsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";

export function CreateProjectModal({
    open,
    onOpenChange,
    roomId,
    roomName,
    roomDescription
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roomId: string;
    roomName?: string;
    roomDescription?: string;
}) {
    const { createProject, generateAIPlan } = useRooms();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState<"creating" | "generating" | null>(null);

    // Pre-fill with room data when modal opens
    useEffect(() => {
        if (open) {
            setName(roomName || "");
            setDescription(roomDescription || "");
        }
    }, [open, roomName, roomDescription]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Stage 1: Create project
            setLoadingStage("creating");
            const project = await createProject(roomId, name, description || roomDescription || "");

            // Stage 2: Generate AI plan
            setLoadingStage("generating");
            await generateAIPlan(roomId, project.id);

            // Reset and close
            setName("");
            setDescription("");
            setLoadingStage(null);
            onOpenChange(false);
        } catch (error) {
            setLoadingStage(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Generate Project with AI
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        AI will create a complete execution plan with Executive Summary, Architecture, Timeline, Epics, and Kanban board.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Project Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. E-commerce Platform"
                            className="bg-white/5 border-white/10"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">
                            Project Description <span className="text-white/40 text-xs">(Optional)</span>
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details or modify the description... (AI will use room description if left empty)"
                            className="bg-white/5 border-white/10 min-h-[120px]"
                            disabled={isLoading}
                        />
                    </div>

                    {isLoading && (
                        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">
                                        {loadingStage === "creating" && "Creating project..."}
                                        {loadingStage === "generating" && "Generating AI plan..."}
                                    </p>
                                    <p className="text-xs text-white/60 mt-0.5">
                                        {loadingStage === "creating" && "Setting up your project workspace"}
                                        {loadingStage === "generating" && "AI is decomposing your idea into actionable tasks"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="text-white/60 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-black font-bold"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate with AI
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

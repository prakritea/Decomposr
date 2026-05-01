import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CreateRoomModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateRoom: (name: string, description: string) => Promise<void>;
}

export function CreateRoomModal({ open, onOpenChange, onCreateRoom }: CreateRoomModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await onCreateRoom(name, description);
            setName("");
            setDescription("");
            onOpenChange(false);
        } catch (error) {
            // Error handled by context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black/95 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Start a New Project</DialogTitle>
                    <DialogDescription className="text-white/60">
                        Define your vision and let AI help you decompose it into tasks
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., E-commerce Platform"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Idea)</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your project idea... We'll generate the architecture and tasks."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white/5 border-white/10 text-white min-h-24"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !name.trim()}
                            className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Start Project"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

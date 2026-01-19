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
import { Loader2 } from "lucide-react";

interface JoinRoomModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onJoinRoom: (inviteCode: string) => Promise<void>;
}

export function JoinRoomModal({ open, onOpenChange, onJoinRoom }: JoinRoomModalProps) {
    const [inviteCode, setInviteCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await onJoinRoom(inviteCode.toUpperCase());
            setInviteCode("");
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
                    <DialogTitle>Join Project Room</DialogTitle>
                    <DialogDescription className="text-white/60">
                        Enter the invite code shared by your project manager
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Invite Code</Label>
                            <Input
                                id="code"
                                placeholder="ABCD1234"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                required
                                maxLength={8}
                                className="bg-white/5 border-white/10 text-white font-mono text-lg tracking-wider"
                            />
                            <p className="text-xs text-white/40">8-character code (letters and numbers)</p>
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
                            disabled={isLoading || inviteCode.length !== 8}
                            className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                "Join Room"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

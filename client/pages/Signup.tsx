import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Zap, Loader2, Briefcase, Users } from "lucide-react";
import Aurora from "@/components/ui/Aurora";
import { UserRole } from "@/types/auth";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>("employee");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            await signup({ name, email, password, role });
            navigate("/");
        } catch (error) {
            // Error is handled by AuthContext toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black relative flex items-center justify-center p-4">
            {/* Aurora Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-30 pointer-events-none">
                <Aurora
                    colorStops={["#60ff50", "#a64dff", "#2000ff"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            <Card className="w-full max-w-md relative z-10 bg-black/80 border-white/10 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#60ff50] to-[#a64dff] rounded-full">
                            <Zap className="w-6 h-6 text-black" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
                    <CardDescription className="text-white/60">
                        Join Decomposr and start planning smarter
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-white">I am a...</Label>
                            <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                                <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <RadioGroupItem value="pm" id="pm" />
                                    <Label htmlFor="pm" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Briefcase className="w-4 h-4 text-primary" />
                                        <div>
                                            <div className="font-medium text-white">Product Manager</div>
                                            <div className="text-xs text-white/60">Create projects and manage teams</div>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <RadioGroupItem value="employee" id="employee" />
                                    <Label htmlFor="employee" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Users className="w-4 h-4 text-accent" />
                                        <div>
                                            <div className="font-medium text-white">Team Member</div>
                                            <div className="text-xs text-white/60">Join projects and complete tasks</div>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {error && (
                            <p className="text-sm text-red-400">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create account"
                            )}
                        </Button>
                        <p className="text-sm text-center text-white/60">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

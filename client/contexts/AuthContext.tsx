import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState, LoginCredentials, SignupData } from "@/types/auth";
import { mockAuthService } from "@/lib/mockAuth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });
    const { toast } = useToast();

    useEffect(() => {
        // Check for existing session on mount
        const user = mockAuthService.getCurrentUser();
        setState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
        });
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const user = await mockAuthService.login(credentials);
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            toast({
                title: "Welcome back!",
                description: `Logged in as ${user.name}`,
            });
        } catch (error) {
            toast({
                title: "Login failed",
                description: error instanceof Error ? error.message : "Invalid credentials",
                variant: "destructive",
            });
            throw error;
        }
    };

    const signup = async (data: SignupData) => {
        try {
            const user = await mockAuthService.signup(data);
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            toast({
                title: "Account created!",
                description: `Welcome to Decomposr, ${user.name}`,
            });
        } catch (error) {
            toast({
                title: "Signup failed",
                description: error instanceof Error ? error.message : "Could not create account",
                variant: "destructive",
            });
            throw error;
        }
    };

    const logout = async () => {
        await mockAuthService.logout();
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
        toast({
            title: "Logged out",
            description: "See you next time!",
        });
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!state.user) return;

        try {
            const updatedUser = await mockAuthService.updateProfile(state.user.id, updates);
            setState((prev) => ({
                ...prev,
                user: updatedUser,
            }));
            toast({
                title: "Profile updated",
                description: "Your changes have been saved",
            });
        } catch (error) {
            toast({
                title: "Update failed",
                description: error instanceof Error ? error.message : "Could not update profile",
                variant: "destructive",
            });
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                signup,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

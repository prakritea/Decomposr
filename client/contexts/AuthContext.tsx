import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState, LoginCredentials, SignupData } from "@/types/auth";
import { api } from "@/lib/api";
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
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            setState({
                user: JSON.parse(storedUser),
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const { user, token } = await api.auth.login(credentials);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

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
            const { user, token } = await api.auth.signup(data);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
        // This would normally call a profile update endpoint
        // For now we just update local state and storage
        if (!state.user) return;

        const updatedUser = { ...state.user, ...updates };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setState((prev) => ({
            ...prev,
            user: updatedUser,
        }));

        toast({
            title: "Profile updated",
            description: "Your changes have been saved",
        });
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

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
    const verifySession = async () => {
      try {
        const { user } = await api.auth.me();
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    verifySession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user } = await api.auth.login(credentials);

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
      const { user } = await api.auth.signup(data);

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
    try {
      await api.auth.logout();
    } catch {
      // Still clear state even if logout API fails
    }
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
    const updatedUser = { ...state.user, ...updates };

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
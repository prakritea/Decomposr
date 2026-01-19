import { User, LoginCredentials, SignupData } from "@/types/auth";

const STORAGE_KEY = "decomposr_auth";
const USERS_KEY = "decomposr_users";

// Mock user database
const initializeUsers = () => {
    const existingUsers = localStorage.getItem(USERS_KEY);
    if (!existingUsers) {
        const defaultUsers = [
            {
                id: "pm-1",
                name: "Alice Johnson",
                email: "pm@decomposr.com",
                password: "password123",
                role: "pm" as const,
                joinedAt: new Date("2024-01-01"),
            },
            {
                id: "emp-1",
                name: "Bob Smith",
                email: "employee@decomposr.com",
                password: "password123",
                role: "employee" as const,
                joinedAt: new Date("2024-01-15"),
            },
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
};

initializeUsers();

export const mockAuthService = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const user = users.find(
            (u: any) => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const { password, ...userWithoutPassword } = user;
        const authUser: User = {
            ...userWithoutPassword,
            joinedAt: new Date(user.joinedAt),
        };

        if (credentials.rememberMe) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        } else {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        }

        return authUser;
    },

    signup: async (data: SignupData): Promise<User> => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

        // Check if email already exists
        if (users.some((u: any) => u.email === data.email)) {
            throw new Error("Email already registered");
        }

        const newUser = {
            id: `${data.role}-${Date.now()}`,
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            joinedAt: new Date(),
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const { password, ...userWithoutPassword } = newUser;
        const authUser: User = userWithoutPassword;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

        return authUser;
    },

    logout: async (): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
    },

    getCurrentUser: (): User | null => {
        const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        try {
            const user = JSON.parse(stored);
            return {
                ...user,
                joinedAt: new Date(user.joinedAt),
            };
        } catch {
            return null;
        }
    },

    updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const userIndex = users.findIndex((u: any) => u.id === userId);

        if (userIndex === -1) {
            throw new Error("User not found");
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const { password, ...userWithoutPassword } = users[userIndex];
        const updatedUser: User = {
            ...userWithoutPassword,
            joinedAt: new Date(users[userIndex].joinedAt),
        };

        // Update stored session
        const currentStorage = localStorage.getItem(STORAGE_KEY) ? localStorage : sessionStorage;
        currentStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

        return updatedUser;
    },
};

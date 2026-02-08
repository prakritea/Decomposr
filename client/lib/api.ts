const API_URL = import.meta.env.VITE_API_URL || "/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Request failed");
    }

    return response.json();
}

export const api = {
    auth: {
        signup: (data: any) => fetchWithAuth("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
        login: (data: any) => fetchWithAuth("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    },
    rooms: {
        create: (data: any) => fetchWithAuth("/rooms/create", { method: "POST", body: JSON.stringify(data) }),
        join: (data: any) => fetchWithAuth("/rooms/join", { method: "POST", body: JSON.stringify(data) }),
        getUserRooms: () => fetchWithAuth("/rooms/user-rooms"),
        getDetails: (id: string) => fetchWithAuth(`/rooms/${id}`),
        delete: (id: string) => fetchWithAuth(`/rooms/${id}`, { method: "DELETE" }),
    },
    projects: {
        create: (roomId: string, data: any) => fetchWithAuth(`/projects/${roomId}`, { method: "POST", body: JSON.stringify(data) }),
        generateTasks: (roomId: string, projectId: string) => fetchWithAuth(`/projects/${roomId}/${projectId}/generate-tasks`, { method: "POST" }),
        updateTask: (roomId: string, projectId: string, taskId: string, data: any) => fetchWithAuth(`/projects/${roomId}/${projectId}/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify(data) }),
        assignTask: (roomId: string, projectId: string, taskId: string, data: any) => fetchWithAuth(`/projects/${roomId}/${projectId}/tasks/${taskId}/assign`, { method: "PATCH", body: JSON.stringify(data) }),
        acceptTask: (roomId: string, projectId: string, taskId: string) => fetchWithAuth(`/projects/${roomId}/${projectId}/tasks/${taskId}/accept`, { method: "PATCH" }),
    },
    notifications: {
        getAll: () => fetchWithAuth("/notifications"),
        markRead: (id: string) => fetchWithAuth(`/notifications/${id}/read`, { method: "PATCH" }),
        markAllRead: () => fetchWithAuth("/notifications/read-all", { method: "PATCH" }),
    }
};

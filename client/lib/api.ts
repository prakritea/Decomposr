const API_URL = import.meta.env.VITE_API_URL || "/api";

async function fetchWithAuth<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const api = {
  auth: {
    signup: (data: any) => fetchWithAuth("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
    login: (data: any) => fetchWithAuth("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => fetchWithAuth("/auth/me"),
    logout: () => fetchWithAuth("/auth/logout", { method: "POST" }),
  },
  rooms: {
    create: (data: any) => fetchWithAuth("/rooms/create", { method: "POST", body: JSON.stringify(data) }),
    join: (data: any) => fetchWithAuth("/rooms/join", { method: "POST", body: JSON.stringify(data) }),
    getUserRooms: (page = 1, limit = 20) =>
      fetchWithAuth<PaginatedResponse<any>>(`/rooms/user-rooms?page=${page}&limit=${limit}`),
    getDetails: (id: string) => fetchWithAuth(`/rooms/${id}`),
    delete: (id: string) => fetchWithAuth(`/rooms/${id}`, { method: "DELETE" }),
    getStats: () => fetchWithAuth<any>("/rooms/stats"),
  },
  projects: {
    create: (roomId: string, data: any) => fetchWithAuth(`/projects/${roomId}`, { method: "POST", body: JSON.stringify(data) }),
    generateTasks: (roomId: string, projectId: string) => fetchWithAuth(`/projects/${roomId}/${projectId}/generate-tasks`, { method: "POST" }),
    updateTask: (roomId: string, projectId: string, taskId: string, data: any) =>
      fetchWithAuth(`/projects/${roomId}/${projectId}/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify(data) }),
    assignTask: (roomId: string, projectId: string, taskId: string, data: any) =>
      fetchWithAuth(`/projects/${roomId}/${projectId}/tasks/${taskId}/assign`, { method: "PATCH", body: JSON.stringify(data) }),
    acceptTask: (roomId: string, projectId: string, taskId: string) =>
      fetchWithAuth(`/projects/${roomId}/${projectId}/tasks/${taskId}/accept`, { method: "PATCH" }),
    getMyTasks: () => fetchWithAuth("/projects/my-tasks"),
  },
  notifications: {
    getAll: (page = 1, limit = 50) =>
      fetchWithAuth<PaginatedResponse<any>>(`/notifications?page=${page}&limit=${limit}`),
    getUnreadCount: () => fetchWithAuth<{ count: number }>("/notifications/unread-count"),
    markRead: (id: string) => fetchWithAuth(`/notifications/${id}/read`, { method: "PATCH" }),
    markAllRead: () => fetchWithAuth("/notifications/read-all", { method: "PATCH" }),
  }
};
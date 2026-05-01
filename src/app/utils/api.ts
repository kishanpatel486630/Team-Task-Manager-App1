import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-46b526d5`;

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem("access_token");
    }
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Always include Authorization header
    // Use access token if available, otherwise use anon key
    const token = this.getToken();
    headers["Authorization"] = `Bearer ${token || publicAnonKey}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || error.message || "Request failed");
    }

    return response.json();
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request("/auth/me");
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    avatarBase64?: string;
  }) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getProjects() {
    return this.request("/projects");
  }

  async createProject(data: { name: string; description?: string }) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: "DELETE",
    });
  }

  async inviteMember(
    projectId: string,
    data: { email: string; role?: string },
  ) {
    return this.request(`/projects/${projectId}/invite`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTasks(
    projectId: string,
    filters?: { status?: string; assignee?: string },
  ) {
    const params = new URLSearchParams({ projectId, ...filters });
    return this.request(`/tasks?${params}`);
  }

  async createTask(data: any) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: any) {
    return this.request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async updateTaskStatus(id: string, status: string) {
    return this.request(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async getDashboardStats() {
    return this.request("/dashboard/stats");
  }
}

export const api = new ApiClient();

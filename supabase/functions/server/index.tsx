import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Supabase client with auth
const getSupabaseClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Utility: Generate unique ID
const generateId = () => crypto.randomUUID();

// Middleware: Verify auth token
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized - Missing or invalid token" }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    c.set("userId", user.id);
    c.set("user", userData);
    await next();
  } catch (error) {
    console.log("Auth error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
};

// Health check endpoint
app.get("/make-server-46b526d5/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Register
app.post("/make-server-46b526d5/auth/register", async (c) => {
  try {
    const { email, password, firstName, lastName } = await c.req.json();

    if (!email || !password || !firstName || !lastName) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const existingUserId = await kv.get(`user:email:${email.toLowerCase()}`);
    if (existingUserId) {
      return c.json({ error: "Email already registered" }, 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { firstName, lastName }
    });

    if (error) {
      console.log("Supabase auth error:", error);
      return c.json({ error: error.message || "Failed to create user" }, 400);
    }

    const userId = data.user.id;

    const user = {
      id: userId,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role: "member",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, user);
    await kv.set(`user:email:${email.toLowerCase()}`, userId);
    await kv.set(`user:projects:${userId}`, []);

    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (sessionError) {
      return c.json({ error: "User created but login failed" }, 500);
    }

    return c.json({
      user: { ...user, password: undefined },
      accessToken: sessionData.session.access_token,
    });
  } catch (error) {
    console.log("Registration error:", error);
    return c.json({ error: "Registration failed: " + error.message }, 500);
  }
});

// Login
app.post("/make-server-46b526d5/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const userId = data.user.id;
    const user = await kv.get(`user:${userId}`);

    if (!user) {
      return c.json({ error: "User profile not found" }, 404);
    }

    return c.json({
      user,
      accessToken: data.session.access_token,
    });
  } catch (error) {
    console.log("Login error:", error);
    return c.json({ error: "Login failed: " + error.message }, 500);
  }
});

// Get current user
app.get("/make-server-46b526d5/auth/me", authMiddleware, async (c) => {
  const user = c.get("user");
  return c.json({ user });
});

// ==================== PROJECT ROUTES ====================

// List projects
app.get("/make-server-46b526d5/projects", authMiddleware, async (c) => {
  try {
    const userId = c.get("userId");
    const projectIds = await kv.get(`user:projects:${userId}`) || [];

    const projects = await Promise.all(
      projectIds.map(async (id: string) => await kv.get(`project:${id}`))
    );

    return c.json({ projects: projects.filter(Boolean) });
  } catch (error) {
    console.log("List projects error:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Create project
app.post("/make-server-46b526d5/projects", authMiddleware, async (c) => {
  try {
    const userId = c.get("userId");
    const user = c.get("user");
    const { name, description } = await c.req.json();

    if (!name) {
      return c.json({ error: "Project name required" }, 400);
    }

    const projectId = generateId();
    const project = {
      id: projectId,
      name,
      description: description || "",
      owner: userId,
      members: [
        { userId, role: "admin", name: `${user.firstName} ${user.lastName}` }
      ],
      createdAt: new Date().toISOString(),
    };

    console.log("Creating project:", {
      projectId,
      owner: userId,
      members: project.members,
      name: project.name
    });

    await kv.set(`project:${projectId}`, project);
    await kv.set(`project:tasks:${projectId}`, []);

    // Add project to user's list (avoid duplicates)
    const userProjects = await kv.get(`user:projects:${userId}`) || [];
    if (!userProjects.includes(projectId)) {
      await kv.set(`user:projects:${userId}`, [...userProjects, projectId]);
    }

    console.log("Project created successfully:", projectId);
    return c.json({ project });
  } catch (error) {
    console.log("Create project error:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// Get project details
app.get("/make-server-46b526d5/projects/:id", authMiddleware, async (c) => {
  try {
    const projectId = c.req.param("id");
    const userId = c.get("userId");

    const project = await kv.get(`project:${projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const isMember = project.members.some((m: any) => m.userId === userId);
    if (!isMember && project.owner !== userId) {
      console.log("Access denied for project:", {
        projectId,
        userId,
        projectOwner: project.owner,
        projectMembers: project.members.map((m: any) => ({ userId: m.userId, role: m.role })),
        isMember,
        isOwner: project.owner === userId
      });
      return c.json({
        error: "Access denied",
        details: "You are not a member of this project",
        debug: {
          userId,
          projectOwner: project.owner,
          memberIds: project.members.map((m: any) => m.userId)
        }
      }, 403);
    }

    return c.json({ project });
  } catch (error) {
    console.log("Get project error:", error);
    return c.json({ error: "Failed to fetch project" }, 500);
  }
});

// Delete project
app.delete("/make-server-46b526d5/projects/:id", authMiddleware, async (c) => {
  try {
    const projectId = c.req.param("id");
    const userId = c.get("userId");

    const project = await kv.get(`project:${projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    if (project.owner !== userId) {
      return c.json({ error: "Only project owner can delete the project" }, 403);
    }

    const taskIds = await kv.get(`project:tasks:${projectId}`) || [];
    await kv.mdel(taskIds.map((id: string) => `task:${id}`));

    await kv.del(`project:${projectId}`);
    await kv.del(`project:tasks:${projectId}`);

    for (const member of project.members) {
      const userProjects = await kv.get(`user:projects:${member.userId}`) || [];
      await kv.set(`user:projects:${member.userId}`, userProjects.filter((id: string) => id !== projectId));
    }

    return c.json({ success: true });
  } catch (error) {
    console.log("Delete project error:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

// Invite member to project
app.post("/make-server-46b526d5/projects/:id/invite", authMiddleware, async (c) => {
  try {
    const projectId = c.req.param("id");
    const userId = c.get("userId");
    const { email, role } = await c.req.json();

    const project = await kv.get(`project:${projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const member = project.members.find((m: any) => m.userId === userId);
    if (!member || (member.role !== "admin" && project.owner !== userId)) {
      return c.json({ error: "Only admins can invite members" }, 403);
    }

    const invitedUserId = await kv.get(`user:email:${email.toLowerCase()}`);
    if (!invitedUserId) {
      return c.json({ error: "User not found" }, 404);
    }

    const invitedUser = await kv.get(`user:${invitedUserId}`);

    if (project.members.some((m: any) => m.userId === invitedUserId)) {
      return c.json({ error: "User is already a member" }, 400);
    }

    project.members.push({
      userId: invitedUserId,
      role: role || "member",
      name: `${invitedUser.firstName} ${invitedUser.lastName}`
    });
    await kv.set(`project:${projectId}`, project);

    // Add project to invited user's list (avoid duplicates)
    const userProjects = await kv.get(`user:projects:${invitedUserId}`) || [];
    if (!userProjects.includes(projectId)) {
      await kv.set(`user:projects:${invitedUserId}`, [...userProjects, projectId]);
    }

    return c.json({ project });
  } catch (error) {
    console.log("Invite member error:", error);
    return c.json({ error: "Failed to invite member" }, 500);
  }
});

// ==================== TASK ROUTES ====================

// List tasks
app.get("/make-server-46b526d5/tasks", authMiddleware, async (c) => {
  try {
    const projectId = c.req.query("projectId");
    const status = c.req.query("status");
    const assigneeId = c.req.query("assignee");

    if (!projectId) {
      return c.json({ error: "projectId required" }, 400);
    }

    const taskIds = await kv.get(`project:tasks:${projectId}`) || [];
    let tasks = await Promise.all(
      taskIds.map(async (id: string) => await kv.get(`task:${id}`))
    );

    tasks = tasks.filter(Boolean);

    if (status) {
      tasks = tasks.filter((t: any) => t.status === status);
    }
    if (assigneeId) {
      tasks = tasks.filter((t: any) => t.assignee === assigneeId);
    }

    return c.json({ tasks });
  } catch (error) {
    console.log("List tasks error:", error);
    return c.json({ error: "Failed to fetch tasks" }, 500);
  }
});

// Create task
app.post("/make-server-46b526d5/tasks", authMiddleware, async (c) => {
  try {
    const userId = c.get("userId");
    const user = c.get("user");
    const { projectId, title, description, priority, assignee, dueDate, status } = await c.req.json();

    if (!projectId || !title) {
      return c.json({ error: "projectId and title required" }, 400);
    }

    const project = await kv.get(`project:${projectId}`);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    const isMember = project.members.some((m: any) => m.userId === userId);
    if (!isMember && project.owner !== userId) {
      console.log("Access denied for task creation:", {
        projectId,
        userId,
        projectOwner: project.owner,
        projectMembers: project.members.map((m: any) => ({ userId: m.userId, role: m.role })),
        isMember,
        isOwner: project.owner === userId
      });
      return c.json({
        error: "Access denied",
        details: "You are not a member of this project",
        debug: {
          userId,
          projectOwner: project.owner,
          memberIds: project.members.map((m: any) => m.userId)
        }
      }, 403);
    }

    const taskId = generateId();
    const task = {
      id: taskId,
      projectId,
      title,
      description: description || "",
      status: status || "todo",
      priority: priority || "medium",
      assignee: assignee || null,
      assigneeName: assignee ? project.members.find((m: any) => m.userId === assignee)?.name || "Unknown" : null,
      createdBy: userId,
      createdByName: `${user.firstName} ${user.lastName}`,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`task:${taskId}`, task);

    // Add task to project's list (avoid duplicates)
    const projectTasks = await kv.get(`project:tasks:${projectId}`) || [];
    if (!projectTasks.includes(taskId)) {
      await kv.set(`project:tasks:${projectId}`, [...projectTasks, taskId]);
    }

    return c.json({ task });
  } catch (error) {
    console.log("Create task error:", error);
    return c.json({ error: "Failed to create task" }, 500);
  }
});

// Get task
app.get("/make-server-46b526d5/tasks/:id", authMiddleware, async (c) => {
  try {
    const taskId = c.req.param("id");
    const task = await kv.get(`task:${taskId}`);

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json({ task });
  } catch (error) {
    console.log("Get task error:", error);
    return c.json({ error: "Failed to fetch task" }, 500);
  }
});

// Update task
app.put("/make-server-46b526d5/tasks/:id", authMiddleware, async (c) => {
  try {
    const taskId = c.req.param("id");
    const userId = c.get("userId");
    const updates = await c.req.json();

    const task = await kv.get(`task:${taskId}`);
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const project = await kv.get(`project:${task.projectId}`);
    const member = project.members.find((m: any) => m.userId === userId);

    const isAdmin = member?.role === "admin" || project.owner === userId;
    const isOwnTask = task.createdBy === userId;

    if (!isAdmin && !isOwnTask) {
      return c.json({ error: "You can only edit your own tasks" }, 403);
    }

    if (updates.assignee && updates.assignee !== task.assignee) {
      const assigneeMember = project.members.find((m: any) => m.userId === updates.assignee);
      updates.assigneeName = assigneeMember?.name || "Unknown";
    }

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`task:${taskId}`, updatedTask);

    return c.json({ task: updatedTask });
  } catch (error) {
    console.log("Update task error:", error);
    return c.json({ error: "Failed to update task" }, 500);
  }
});

// Delete task
app.delete("/make-server-46b526d5/tasks/:id", authMiddleware, async (c) => {
  try {
    const taskId = c.req.param("id");
    const userId = c.get("userId");

    const task = await kv.get(`task:${taskId}`);
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const project = await kv.get(`project:${task.projectId}`);
    const member = project.members.find((m: any) => m.userId === userId);

    if (member?.role !== "admin" && project.owner !== userId) {
      return c.json({ error: "Only admins can delete tasks" }, 403);
    }

    await kv.del(`task:${taskId}`);

    const projectTasks = await kv.get(`project:tasks:${task.projectId}`) || [];
    await kv.set(`project:tasks:${task.projectId}`, projectTasks.filter((id: string) => id !== taskId));

    return c.json({ success: true });
  } catch (error) {
    console.log("Delete task error:", error);
    return c.json({ error: "Failed to delete task" }, 500);
  }
});

// Update task status
app.patch("/make-server-46b526d5/tasks/:id/status", authMiddleware, async (c) => {
  try {
    const taskId = c.req.param("id");
    const { status } = await c.req.json();

    const task = await kv.get(`task:${taskId}`);
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();

    await kv.set(`task:${taskId}`, task);

    return c.json({ task });
  } catch (error) {
    console.log("Update status error:", error);
    return c.json({ error: "Failed to update status" }, 500);
  }
});

// ==================== DASHBOARD ROUTES ====================

app.get("/make-server-46b526d5/dashboard/stats", authMiddleware, async (c) => {
  try {
    const userId = c.get("userId");
    const projectIds = await kv.get(`user:projects:${userId}`) || [];

    let allTasks: any[] = [];
    for (const projectId of projectIds) {
      const taskIds = await kv.get(`project:tasks:${projectId}`) || [];
      const tasks = await Promise.all(
        taskIds.map(async (id: string) => await kv.get(`task:${id}`))
      );
      allTasks = allTasks.concat(tasks.filter(Boolean));
    }

    const myTasks = allTasks.filter((t: any) => t.assignee === userId);
    const inProgress = myTasks.filter((t: any) => t.status === "in-progress").length;
    const overdue = myTasks.filter((t: any) =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
    ).length;

    return c.json({
      totalTasks: myTasks.length,
      inProgress,
      overdue,
      recentTasks: myTasks.slice(0, 10),
    });
  } catch (error) {
    console.log("Dashboard stats error:", error);
    return c.json({ error: "Failed to fetch dashboard stats" }, 500);
  }
});

Deno.serve(app.fetch);

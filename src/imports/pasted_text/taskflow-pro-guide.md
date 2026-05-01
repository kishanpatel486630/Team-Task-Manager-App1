# TaskFlow Pro — Master Prompt (Full Cursor/AI Build Guide)

## Project Identity
**Name:** TaskFlow Pro  
**Stack:** React 18 + Node.js/Express + MongoDB Atlas  
**UI Theme:** Professional Corporate (Jira-inspired)  
**Deployment:** Railway (frontend + backend as separate services)

---

## 🎯 What You Are Building

A full-stack Team Task Manager web app with:
- JWT-based authentication (Signup / Login / Refresh tokens)
- Project creation and team management
- Task CRUD with assignment, priority, and status tracking
- Role-based access control (Admin / Member)
- Dashboard showing tasks, status distribution, and overdue items

---

## 📁 Exact Folder Structure

```
taskflow-pro/
├── client/                          # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/                  # SVG icons, logo
│   │   ├── components/
│   │   │   ├── ui/                  # Button, Input, Badge, Modal, Avatar, Spinner
│   │   │   ├── layout/              # Sidebar, Navbar, PageWrapper
│   │   │   ├── auth/                # LoginForm, RegisterForm, ProtectedRoute
│   │   │   ├── projects/            # ProjectCard, ProjectForm, ProjectList
│   │   │   ├── tasks/               # TaskCard, TaskForm, TaskBoard, TaskFilters
│   │   │   └── dashboard/           # StatsCard, ActivityFeed, OverdueAlert
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   └── NotFound.jsx
│   │   ├── store/
│   │   │   ├── index.js             # Redux store
│   │   │   ├── authSlice.js
│   │   │   ├── projectSlice.js
│   │   │   └── taskSlice.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useProjects.js
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with interceptors
│   │   ├── utils/
│   │   │   ├── dateUtils.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   └── env.js               # Env validation with dotenv
│   │   ├── middleware/
│   │   │   ├── auth.js              # verifyToken middleware
│   │   │   ├── rbac.js              # requireRole('admin') middleware
│   │   │   ├── validate.js          # express-validator wrapper
│   │   │   └── errorHandler.js      # Global error handler
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── user.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── user.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── project.service.js
│   │   │   └── task.service.js
│   │   └── app.js                   # Express app setup
│   ├── server.js                    # Entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ MongoDB Schemas (Mongoose)

### User
```js
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}
```

### Project
```js
{
  name: { type: String, required: true },
  description: String,
  owner: { type: ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' }
  }],
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
}
```

### Task
```js
{
  title: { type: String, required: true },
  description: String,
  project: { type: ObjectId, ref: 'Project', required: true },
  assignee: { type: ObjectId, ref: 'User', default: null },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'in-review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  dueDate: { type: Date, default: null },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 🔌 REST API Endpoints

### Auth
```
POST   /api/auth/register         Create account
POST   /api/auth/login            Login, returns { accessToken, refreshToken, user }
POST   /api/auth/refresh          Refresh access token
POST   /api/auth/logout           Invalidate refresh token
GET    /api/auth/me               Get current user (protected)
```

### Projects
```
GET    /api/projects              List all projects for current user
POST   /api/projects              Create project (requires auth)
GET    /api/projects/:id          Get project + members
PUT    /api/projects/:id          Update project (admin only)
DELETE /api/projects/:id          Delete project (owner only)
POST   /api/projects/:id/invite   Invite user by email (admin only)
DELETE /api/projects/:id/members/:userId  Remove member (admin only)
```

### Tasks
```
GET    /api/tasks?projectId=&status=&assignee=&priority=   Filtered task list
POST   /api/tasks                 Create task (project member)
GET    /api/tasks/:id             Get single task
PUT    /api/tasks/:id             Update task
DELETE /api/tasks/:id             Delete task (admin only)
PATCH  /api/tasks/:id/status      Update status only
PATCH  /api/tasks/:id/assign      Reassign task
```

### Users
```
GET    /api/users/search?q=       Search users by name/email (for invite)
PUT    /api/users/profile         Update own profile
```

---

## 🔐 Auth & RBAC Logic

### JWT Strategy
- `accessToken` — expires in 15m, stored in memory (Redux state)
- `refreshToken` — expires in 7d, stored in `httpOnly` cookie
- Axios interceptor auto-refreshes on 401 and retries the original request

### Middleware Stack (per request)
```
verifyToken → injectUser → requireProjectMember → requireRole('admin')
```

### Role Rules
| Action | Member | Admin | Owner |
|--------|--------|-------|-------|
| View project | ✅ | ✅ | ✅ |
| Create task | ✅ | ✅ | ✅ |
| Edit any task | ❌ | ✅ | ✅ |
| Delete task | ❌ | ✅ | ✅ |
| Invite member | ❌ | ✅ | ✅ |
| Delete project | ❌ | ❌ | ✅ |

---

## 🎨 UI/UX Design System

### Color Palette (Tailwind custom config)
```js
// tailwind.config.js
colors: {
  brand: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    500: '#2563EB',  // Primary blue (buttons, links)
    600: '#1D4ED8',
    700: '#1E40AF',
    900: '#1E3A5F',  // Sidebar dark
  },
  surface: {
    0:   '#FFFFFF',
    50:  '#F8FAFC',  // Page background
    100: '#F1F5F9',  // Card background
    200: '#E2E8F0',  // Borders
    300: '#CBD5E1',
  },
  status: {
    todo:       '#64748B',
    inprogress: '#2563EB',
    inreview:   '#D97706',
    done:       '#16A34A',
  },
  priority: {
    low:      '#22C55E',
    medium:   '#EAB308',
    high:     '#F97316',
    critical: '#EF4444',
  }
}
```

### Typography
- Font: `Inter` (Google Fonts)
- Page title: `text-2xl font-semibold text-slate-900`
- Section header: `text-lg font-medium text-slate-800`
- Body: `text-sm text-slate-600`
- Muted: `text-xs text-slate-400`

### Component Patterns

**Button variants:** `primary | secondary | ghost | danger`  
**Badge variants:** `status | priority` (use color maps above)  
**Card:** white bg, `shadow-sm border border-slate-200 rounded-xl p-4`  
**Sidebar:** dark blue `bg-brand-900`, width 240px, collapsible on mobile  
**Navbar:** white, sticky top, height 56px, contains breadcrumb + user avatar  

### Key Pages Layout

**Dashboard** — 3 stat cards (Total Tasks / In Progress / Overdue) + task list table + priority pie chart (use Recharts)

**Project Detail** — Kanban board with 4 columns (To Do / In Progress / In Review / Done). Each task card shows: title, assignee avatar, priority badge, due date. Drag-to-change-status using `@dnd-kit/core`.

**Projects list** — Grid of project cards. Each shows name, member count, task completion progress bar, last updated.

---

## 📦 NPM Dependencies

### Client
```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "@reduxjs/toolkit": "^2",
  "react-redux": "^9",
  "@tanstack/react-query": "^5",
  "axios": "^1",
  "recharts": "^2",
  "@dnd-kit/core": "^6",
  "@dnd-kit/sortable": "^8",
  "date-fns": "^3",
  "react-hook-form": "^7",
  "zod": "^3",
  "@hookform/resolvers": "^3",
  "lucide-react": "^0.400",
  "tailwindcss": "^3",
  "clsx": "^2",
  "tailwind-merge": "^2"
}
```

### Server
```json
{
  "express": "^4",
  "mongoose": "^8",
  "bcryptjs": "^2",
  "jsonwebtoken": "^9",
  "cookie-parser": "^1",
  "cors": "^2",
  "express-validator": "^7",
  "dotenv": "^16",
  "helmet": "^7",
  "morgan": "^1",
  "express-rate-limit": "^7"
}
```

---

## 🚀 Railway Deployment Config

### Backend service
- Root directory: `server/`
- Build command: `npm install`
- Start command: `node server.js`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `NODE_ENV=production`, `PORT`

### Frontend service
- Root directory: `client/`
- Build command: `npm run build`
- Start command: (static hosting or `npm run preview`)
- Environment variable: `VITE_API_URL=<your-backend-railway-url>`

### CORS Setup
```js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,  // Required for httpOnly cookie (refresh token)
}));
```

---

## ✅ Validation Rules

### Registration
- `name`: 2–50 chars, required
- `email`: valid email, unique
- `password`: min 8 chars, 1 uppercase, 1 number

### Task creation
- `title`: required, 3–200 chars
- `dueDate`: optional, must be future date
- `priority`: enum validation
- `assignee`: must be a member of the project

---

## 🏆 Extra Features (Make It Stand Out)

1. **Activity log** — log every task status change with timestamp + actor into a `notifications` collection, show in Dashboard
2. **Overdue detection** — any task with `dueDate < now` and `status !== 'done'` is flagged; show count in sidebar badge
3. **Task search** — full-text search on `title` using MongoDB text index
4. **Avatar initials** — if no avatar image, render a colored circle with user initials (deterministic color from name hash)
5. **Dark mode toggle** — Tailwind `dark:` classes + `localStorage` persistence
6. **Keyboard shortcut** — `N` opens new task modal when focused on a project

---

## 🧪 Demo Seed Data

Include a `server/seed.js` script that creates:
- 2 users: `admin@demo.com / Demo@1234` (Admin) and `member@demo.com / Demo@1234` (Member)
- 1 project: "TaskFlow Demo Project" with both users as members
- 8 tasks spread across all 4 statuses and priorities, some with past due dates

Run with: `node server/seed.js`

---

## 📋 Build Order (Step by Step)

1. Init both `client/` (Vite + React) and `server/` (Express) with packages
2. Build Express app: DB config → Models → Middleware → Routes → Controllers
3. Test all API endpoints with Postman/Thunder Client
4. Build React: Axios service → Auth store → ProtectedRoute → Login/Register pages
5. Build Dashboard and Projects pages
6. Build Kanban board with drag-and-drop
7. Connect all API calls, test full flows
8. Add seed script, test with demo credentials
9. Write README
10. Push to GitHub, deploy both services on Railway
11. Record 2–5 min demo video: signup → create project → invite member → create tasks → drag status → show dashboard

---

## 📝 README Template

See: `README.txt` (provided separately as submission file)
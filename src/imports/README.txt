================================================================================
  TASKFLOW PRO — Team Task Manager
  Full-Stack Assignment Submission
================================================================================

LIVE URL:       https://taskflow-pro.up.railway.app
GITHUB REPO:    https://github.com/YOUR_USERNAME/taskflow-pro
DEMO VIDEO:     https://www.loom.com/share/YOUR_VIDEO_ID

--------------------------------------------------------------------------------
  DEMO CREDENTIALS (pre-seeded)
--------------------------------------------------------------------------------

  Admin Account
  Email:    admin@demo.com
  Password: Demo@1234
  Role:     Admin (can manage members, edit/delete any task)

  Member Account
  Email:    member@demo.com
  Password: Demo@1234
  Role:     Member (can create and update own tasks)

--------------------------------------------------------------------------------
  PROJECT OVERVIEW
--------------------------------------------------------------------------------

TaskFlow Pro is a full-stack team task management application that allows
teams to collaborate on projects, assign tasks, track progress, and manage
access with role-based permissions.

Key capabilities:
  - Secure JWT authentication with refresh token rotation
  - Project creation with team member invitations (by email)
  - Kanban board with drag-and-drop status transitions
  - Dashboard showing task stats, overdue alerts, and activity feed
  - Admin / Member role-based access control at the API level
  - Full-text task search and priority/status filtering

--------------------------------------------------------------------------------
  TECH STACK
--------------------------------------------------------------------------------

  Frontend
  --------
  React 18           UI framework
  Redux Toolkit      Global state (auth, projects)
  React Query        Server state + caching
  React Router v6    Client-side routing
  Tailwind CSS       Utility-first styling
  @dnd-kit           Drag-and-drop Kanban board
  Recharts           Dashboard charts
  React Hook Form    Form state + validation
  Zod                Schema validation
  Axios              HTTP client with interceptors
  Lucide React       Icon library

  Backend
  -------
  Node.js / Express  REST API server
  MongoDB Atlas      NoSQL database
  Mongoose           ODM + schema validation
  JWT                Access token (15m) + Refresh token (7d, httpOnly cookie)
  bcryptjs           Password hashing
  express-validator  Request validation
  Helmet             HTTP security headers
  express-rate-limit  Brute-force protection
  Morgan             HTTP request logging
  Cookie-parser      Refresh token cookie handling

  Infrastructure
  --------------
  Railway            Deployment (separate services for API + static frontend)
  MongoDB Atlas      Managed cloud database (free tier)
  GitHub             Version control

--------------------------------------------------------------------------------
  ARCHITECTURE
--------------------------------------------------------------------------------

  Client (React SPA)
       |  JWT Bearer token (Authorization header)
       |  Refresh token (httpOnly cookie, auto-rotated)
       v
  Express REST API  -->  Middleware: JWT verify -> RBAC check -> Validate
       |
       v
  Mongoose ODM
       |
       v
  MongoDB Atlas (Collections: users, projects, tasks, notifications)

  Role-based access:
    Owner  > Admin > Member
    - Owner: full control including project deletion
    - Admin: manage members, edit/delete any task
    - Member: create tasks, update own tasks

--------------------------------------------------------------------------------
  LOCAL SETUP
--------------------------------------------------------------------------------

Prerequisites:
  - Node.js 18+
  - npm or yarn
  - MongoDB Atlas account (free tier works)

Step 1 — Clone the repository:

  git clone https://github.com/YOUR_USERNAME/taskflow-pro.git
  cd taskflow-pro

Step 2 — Backend setup:

  cd server
  npm install
  cp .env.example .env

  Edit .env with your values:
    MONGODB_URI=mongodb+srv://...
    JWT_SECRET=your_super_secret_key_min_32_chars
    JWT_REFRESH_SECRET=another_super_secret_key
    CLIENT_URL=http://localhost:5173
    PORT=5000
    NODE_ENV=development

  npm run dev

Step 3 — Frontend setup (new terminal):

  cd client
  npm install
  cp .env.example .env

  Edit .env:
    VITE_API_URL=http://localhost:5000

  npm run dev

Step 4 — Seed demo data (optional):

  cd server
  node seed.js

  This creates 2 users, 1 project, and 8 sample tasks.

Step 5 — Open in browser:
  http://localhost:5173

--------------------------------------------------------------------------------
  API REFERENCE
--------------------------------------------------------------------------------

  Auth Endpoints
  POST  /api/auth/register     Register new user
  POST  /api/auth/login        Login, returns tokens
  POST  /api/auth/refresh      Rotate access token using refresh cookie
  POST  /api/auth/logout       Clear refresh token cookie
  GET   /api/auth/me           Get authenticated user profile

  Project Endpoints  (all protected — requires Bearer token)
  GET    /api/projects             List current user's projects
  POST   /api/projects             Create project
  GET    /api/projects/:id         Get project details + members
  PUT    /api/projects/:id         Update project (admin)
  DELETE /api/projects/:id         Delete project (owner)
  POST   /api/projects/:id/invite  Invite user by email (admin)
  DELETE /api/projects/:id/members/:userId  Remove member (admin)

  Task Endpoints  (all protected)
  GET    /api/tasks                List tasks (filter: projectId, status, priority, assignee)
  POST   /api/tasks                Create task
  GET    /api/tasks/:id            Get task
  PUT    /api/tasks/:id            Update task
  DELETE /api/tasks/:id            Delete task (admin)
  PATCH  /api/tasks/:id/status     Update status only
  PATCH  /api/tasks/:id/assign     Reassign task

  User Endpoints
  GET    /api/users/search?q=      Search users for invite
  PUT    /api/users/profile        Update own profile

--------------------------------------------------------------------------------
  FEATURES IN DETAIL
--------------------------------------------------------------------------------

  Authentication
  - JWT access token stored in Redux memory (never localStorage)
  - Refresh token in httpOnly cookie (XSS-safe)
  - Axios interceptor auto-retries failed 401 requests after token refresh
  - Password hashed with bcrypt (salt rounds: 12)
  - Rate limiting: 10 login attempts per 15 minutes per IP

  Dashboard
  - Total tasks, in-progress count, overdue count
  - Overdue tasks highlighted with red badge
  - Activity feed showing recent status changes
  - Priority distribution pie chart (Recharts)

  Kanban Board
  - 4 columns: To Do, In Progress, In Review, Done
  - Drag-and-drop using @dnd-kit (accessible, keyboard-navigable)
  - Task cards show: title, assignee avatar, priority color, due date
  - Click task card to open detail modal with full edit form

  Project Management
  - Create unlimited projects
  - Invite team members by email; they receive a member role by default
  - Admin can promote members or remove them
  - Archive projects without deleting tasks

  Task Management
  - Required: title, project, priority
  - Optional: description, assignee, due date, tags
  - Full-text search on task title (MongoDB text index)
  - Filter by status, priority, assignee
  - Status history logged to notifications collection

  Role-Based Access Control
  - Enforced at the API middleware level (not just frontend)
  - requireProjectMember checks user is in project.members
  - requireRole('admin') checks member.role === 'admin' or 'owner'
  - Owner-only actions checked by comparing project.owner to req.user._id

  Overdue Detection
  - Tasks with dueDate < Date.now() and status !== 'done' are overdue
  - Overdue count shown as red badge in sidebar
  - Overdue tasks shown first in filtered lists

--------------------------------------------------------------------------------
  DEPLOYMENT
--------------------------------------------------------------------------------

  This app is deployed on Railway with two separate services:

  Service 1 — API (Node.js)
    Root: server/
    Start: node server.js
    Env vars: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET,
              CLIENT_URL, PORT, NODE_ENV

  Service 2 — Frontend (Static)
    Root: client/
    Build: npm run build
    Env vars: VITE_API_URL=<api service URL>

  Database: MongoDB Atlas (M0 free cluster)

  Steps to redeploy:
    1. Push to GitHub main branch
    2. Railway auto-deploys both services on push

--------------------------------------------------------------------------------
  DESIGN DECISIONS
--------------------------------------------------------------------------------

  Why httpOnly cookie for refresh token?
    Prevents XSS attacks from stealing refresh tokens. The access token
    lives only in Redux state (in-memory) so it can't be read by scripts
    either. This follows OWASP best practices.

  Why Mongoose over raw MongoDB driver?
    Schema validation, virtuals, and population (joins) make the code
    much more maintainable. The performance trade-off is negligible at
    this scale.

  Why @dnd-kit over react-beautiful-dnd?
    react-beautiful-dnd is deprecated. @dnd-kit is actively maintained,
    has better TypeScript support, and is accessible by default.

  Why Zod + React Hook Form?
    Zod schemas can be shared between client and server validation logic.
    React Hook Form is performant (uncontrolled inputs) and integrates
    cleanly with Zod via @hookform/resolvers.

--------------------------------------------------------------------------------
  FOLDER STRUCTURE
--------------------------------------------------------------------------------

  taskflow-pro/
  ├── client/                  React frontend (Vite)
  │   ├── src/
  │   │   ├── components/      UI, layout, auth, projects, tasks, dashboard
  │   │   ├── pages/           Route-level page components
  │   │   ├── store/           Redux slices
  │   │   ├── hooks/           Custom React hooks
  │   │   ├── services/        Axios API service
  │   │   └── utils/           Helpers and constants
  │   └── package.json
  └── server/                  Express REST API
      ├── src/
      │   ├── config/          DB + env config
      │   ├── middleware/       Auth, RBAC, validation, error handling
      │   ├── models/          Mongoose schemas
      │   ├── routes/          Express routers
      │   ├── controllers/     Request handlers
      │   └── services/        Business logic
      └── package.json

--------------------------------------------------------------------------------
  AUTHOR
--------------------------------------------------------------------------------

  Name:    [YOUR NAME]
  Email:   [YOUR EMAIL]
  GitHub:  https://github.com/YOUR_USERNAME

================================================================================

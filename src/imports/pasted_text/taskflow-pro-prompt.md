================================================================================
  TASKFLOW PRO — MASTER PROMPT
  Jira-Clone Full-Stack Web App  |  React + Express + MongoDB
  Version 2.0  |  With Profile Onboarding + Role System
================================================================================

────────────────────────────────────────────────────────────────────────────────
  SECTION 1 — PROJECT IDENTITY
────────────────────────────────────────────────────────────────────────────────

App name:     TaskFlow Pro
Stack:        React 18 (Vite) + Node.js/Express + MongoDB Atlas
UI design:    Pixel-accurate Jira clone (same colors, same layout, same UX)
Deployment:   Railway (two services: API + static frontend)
Key addition: Full user profile setup with role selection on first login


────────────────────────────────────────────────────────────────────────────────
  SECTION 2 — JIRA COLOR SYSTEM (use these EXACT hex values everywhere)
────────────────────────────────────────────────────────────────────────────────

Primary blue:      #0052CC   (buttons, links, sidebar active item underline)
Nav bar blue:      #0747A6   (top navigation bar background left logo area)
Sidebar dark:      #253858   (left sidebar background)
Sidebar hover:     #344563   (sidebar item hover state)
Blue light:        #DEEBFF   (selected item backgrounds, info highlights)
Page background:   #F4F5F7   (main content area background)
White:             #FFFFFF   (cards, modals, table rows)
Border:            #DFE1E6   (all dividers, card borders, input borders)
Text primary:      #172B4D   (headings, table body text)
Text muted:        #6B778C   (labels, metadata, secondary text)
Text micro:        #42526E   (column headers, breadcrumbs)

Status colors:
  To Do:           badge bg #DFE1E6  text #42526E
  In Progress:     badge bg #DEEBFF  text #0747A6
  In Review:       badge bg #FFF0B3  text #974F0C
  Done:            badge bg #E3FCEF  text #006644

Priority colors:
  Critical:        #DE350B  (dark red)
  High:            #FF5630  (orange red)
  Medium:          #FF8B00  (amber)
  Low:             #36B37E  (green)

Issue type icons (small 16×16 colored squares with letter):
  Story   [S]  background #36B37E  (green)
  Bug     [B]  background #FF5630  (red)
  Task    [T]  background #4C9AFF  (blue)
  Epic    [E]  background #6554C0  (purple)

Avatar colors (cycle through these for user initials):
  #FF5630  #0052CC  #36B37E  #FF8B00  #6554C0  #00B8D9  #DE350B


────────────────────────────────────────────────────────────────────────────────
  SECTION 3 — TYPOGRAPHY & SPACING
────────────────────────────────────────────────────────────────────────────────

Font:          -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Base size:     14px

Page title:    20px  font-weight 600  color #172B4D
Section title: 15px  font-weight 600
Sidebar links: 13px  font-weight 400  color rgba(255,255,255,.82)
Table headers: 11px  font-weight 600  color #6B778C  UPPERCASE  letter-spacing .05em
Table body:    13px  font-weight 400  color #172B4D
Badge text:    11px  font-weight 600
Key links:     12px  font-weight 600  color #0052CC  (e.g. TF-142)
Micro text:    11px  font-weight 400  color #6B778C

Spacing units: 4, 8, 12, 16, 20, 24, 32px
Card padding:  16px
Section padding: 20px 24px

Top nav height:     56px
Left sidebar width: 240px
Page header height: 56-72px (varies per page)


────────────────────────────────────────────────────────────────────────────────
  SECTION 4 — PAGE LAYOUT STRUCTURE
────────────────────────────────────────────────────────────────────────────────

Every page has this shell:

  ┌─────────────────────────────────────────────────────┐
  │  TOP NAV  (56px, bg #0747A6/#0052CC)                │
  │  [Logo] [Your work] [Projects] [Board] [Backlog]    │
  │  [People]    [Search input]  [?] [+] [Avatar]       │
  ├──────────┬──────────────────────────────────────────┤
  │          │  PAGE HEADER (varies per page)           │
  │ SIDEBAR  ├──────────────────────────────────────────┤
  │ (240px)  │                                          │
  │ #253858  │  PAGE CONTENT                            │
  │          │                                          │
  └──────────┴──────────────────────────────────────────┘

Sidebar sections:
  [TF logo + "TaskFlow Pro" label]
  ─── PROJECT ───
  □  Dashboard
  ☰  Board
  ≡  Backlog
  ⏱  Active sprint      (shows sprint name)
  👥 Team               (badge: member count)
  📊 Reports
  ─── SETTINGS ───
  ⚙  Project settings
  ─── bottom ───
  [Avatar]  User name   (click → profile)
  ✦  Edit profile


────────────────────────────────────────────────────────────────────────────────
  SECTION 5 — ONBOARDING / PROFILE SETUP (NEW — DO NOT SKIP)
────────────────────────────────────────────────────────────────────────────────

This is the FIRST screen any user sees after registering. It is a 3-step
wizard before they reach the dashboard.

──── Step 1: Personal info ────

Fields:
  • Profile photo upload (circular, 72px; fallback shows initials in colored circle)
  • First name  (required)
  • Last name   (required)
  • Work email  (pre-filled from registration, editable)
  • Phone number (optional)
  • Bio / tagline (textarea, max 160 chars, optional)

──── Step 2: Role & Team ────

This step saves to the User model as: role, department, teamName.

Role selection UI — 2-column grid of role cards (border + icon + name + description).
User must pick exactly ONE:

  ┌─────────────────────┐  ┌─────────────────────┐
  │ 👔                  │  │ 💻                  │
  │ Manager / Lead      │  │ Developer           │
  │ Manages projects,   │  │ Works on technical  │
  │ assigns tasks       │  │ tasks and stories   │
  └─────────────────────┘  └─────────────────────┘
  ┌─────────────────────┐  ┌─────────────────────┐
  │ 🎨                  │  │ 🔍                  │
  │ Designer            │  │ QA / Tester         │
  │ UI/UX, prototypes,  │  │ Tests, bugs, quality│
  │ design reviews      │  │ control             │
  └─────────────────────┘  └─────────────────────┘
  ┌─────────────────────┐  ┌─────────────────────┐
  │ 📦                  │  │ 🌱                  │
  │ Product Manager     │  │ Intern              │
  │ Roadmap, backlog,   │  │ Learning, limited   │
  │ stakeholders        │  │ task access         │
  └─────────────────────┘  └─────────────────────┘

Selected card state: border 2px solid #0052CC, background #DEEBFF

Department — pill/chip multi-select:
  Engineering · Design · Product · QA · DevOps
  Marketing · HR · Finance · Data · Operations

Team / Squad name — text input (e.g. "Platform Team", "Growth Squad")

Experience level — dropdown:
  Junior (0–2 years) | Mid-level (2–5 years) | Senior (5+ years) | Lead/Principal

──── Step 3: Preferences ────

  • Default project view: Board | Backlog | Timeline  (radio)
  • Notification preferences (checkboxes):
      ☑ Task assigned to me
      ☑ Due date reminders (24h before)
      ☐ Sprint start/end updates
      ☑ Mentions in comments
      ☐ Daily digest email
  • Timezone — searchable select (default: browser timezone)
  • Language — select (default: English)

──── Progress indicator ────

  • Header bar with 3 labeled steps: "1 Personal info" → "2 Role & team" → "3 Preferences"
  • Thin blue progress bar below the step labels
  • "Skip for now" link (grayed) takes to dashboard with incomplete flag
  • "Continue →" primary button (becomes "Finish setup ✓" on step 3)
  • "Back" ghost button appears on step 2+

──── What happens on completion ────

  • User.profileComplete = true  is saved to DB
  • User is redirected to /dashboard
  • If user skipped, show a banner on dashboard: "Complete your profile →" (dismissible)

──── Profile edit page ────

Same 3-step wizard, accessible from sidebar "Edit profile" or top-right avatar menu.
Pre-filled with current data. All fields editable.

Profile view page (/profile) shows:
  • Large avatar + name + email + role badge + department chip
  • Info grid (2 columns): Personal info | Work info | Task summary | Notifications
  • "Edit profile" button top-right of the card


────────────────────────────────────────────────────────────────────────────────
  SECTION 6 — USER ROLES & PERMISSIONS
────────────────────────────────────────────────────────────────────────────────

There are TWO role systems:

A) WORKSPACE ROLE (system-wide, set during onboarding):
   Developer | Manager/Lead | Designer | QA/Tester | Product Manager | Intern
   This is informational metadata — affects default task filters and UI labels.

B) PROJECT ROLE (enforced at API level, set per project):
   owner  > admin > member

   owner  — created the project; can delete it; cannot be removed
   admin  — can invite/remove members, edit/delete any task, manage sprint
   member — can create tasks, update own tasks, view everything

RBAC Matrix:
  Action                         | member | admin | owner
  ─────────────────────────────────────────────────────
  View project & tasks           |  ✅    |  ✅   |  ✅
  Create task                    |  ✅    |  ✅   |  ✅
  Edit own task                  |  ✅    |  ✅   |  ✅
  Edit any task                  |  ❌    |  ✅   |  ✅
  Delete task                    |  ❌    |  ✅   |  ✅
  Assign task to others          |  ❌    |  ✅   |  ✅
  Invite / remove members        |  ❌    |  ✅   |  ✅
  Start / complete sprint        |  ❌    |  ✅   |  ✅
  Edit project settings          |  ❌    |  ✅   |  ✅
  Delete project                 |  ❌    |  ❌   |  ✅
  Change member roles            |  ❌    |  ✅   |  ✅

Intern workspace role additionally has:
  - Cannot create projects (only join existing ones)
  - Cannot change task status to "Done" (needs admin approval)
  - Visible "Intern" badge on their profile card in team page


────────────────────────────────────────────────────────────────────────────────
  SECTION 7 — MONGODB SCHEMAS
────────────────────────────────────────────────────────────────────────────────

── User ──
{
  firstName:         String, required, trim
  lastName:          String, required, trim
  email:             String, required, unique, lowercase
  password:          String, required, select: false (hashed, bcrypt rounds: 12)
  avatar:            String, default: null  (URL or base64)
  phone:             String, default: null
  bio:               String, maxLength: 160, default: null
  workspaceRole:     String, enum: ['developer','manager','designer','qa',
                                    'product_manager','intern'], required
  department:        String, default: null
  teamName:          String, default: null
  experienceLevel:   String, enum: ['junior','mid','senior','lead'], default: 'mid'
  defaultView:       String, enum: ['board','backlog','timeline'], default: 'board'
  timezone:          String, default: 'UTC'
  notifications: {
    assignedTask:    Boolean, default: true
    dueReminder:     Boolean, default: true
    sprintUpdates:   Boolean, default: false
    mentions:        Boolean, default: true
    dailyDigest:     Boolean, default: false
  }
  profileComplete:   Boolean, default: false
  createdAt:         Date, default: Date.now
  updatedAt:         Date, default: Date.now
}

── Project ──
{
  name:              String, required, trim
  description:       String, default: null
  key:               String, required, unique, uppercase, maxLength: 6
                     (e.g. "TF", "PROJ" — used in issue keys like TF-142)
  owner:             ObjectId, ref: 'User', required
  members: [{
    user:            ObjectId, ref: 'User'
    role:            String, enum: ['admin','member'], default: 'member'
    joinedAt:        Date, default: Date.now
  }]
  status:            String, enum: ['active','archived'], default: 'active'
  icon:              String, default: null  (emoji or color string)
  createdAt:         Date, default: Date.now
  updatedAt:         Date, default: Date.now
}

── Sprint ──
{
  project:           ObjectId, ref: 'Project', required
  name:              String, required  (e.g. "Sprint 4")
  goal:              String, default: null
  startDate:         Date, required
  endDate:           Date, required
  status:            String, enum: ['planned','active','completed'], default: 'planned'
  createdBy:         ObjectId, ref: 'User'
  completedAt:       Date, default: null
}

── Task / Issue ──
{
  key:               String, required, unique  (e.g. "TF-142", auto-generated)
  title:             String, required, trim
  description:       String, default: null  (rich text stored as HTML string)
  project:           ObjectId, ref: 'Project', required
  sprint:            ObjectId, ref: 'Sprint', default: null
  assignee:          ObjectId, ref: 'User', default: null
  reporter:          ObjectId, ref: 'User', required
  type:              String, enum: ['story','bug','task','epic'], default: 'task'
  status:            String, enum: ['todo','in-progress','in-review','done'], default: 'todo'
  priority:          String, enum: ['low','medium','high','critical'], default: 'medium'
  storyPoints:       Number, default: null  (1,2,3,5,8,13)
  dueDate:           Date, default: null
  labels:            [String]
  attachments:       [String]  (URLs)
  order:             Number, default: 0  (for kanban column ordering)
  comments: [{
    author:          ObjectId, ref: 'User'
    text:            String, required
    createdAt:       Date, default: Date.now
  }]
  createdAt:         Date, default: Date.now
  updatedAt:         Date, default: Date.now
}

── Notification (Activity Log) ──
{
  project:           ObjectId, ref: 'Project'
  actor:             ObjectId, ref: 'User'
  target:            ObjectId, ref: 'User', default: null
  task:              ObjectId, ref: 'Task', default: null
  type:              String, enum: [
                       'task_created','task_status_changed','task_assigned',
                       'task_deleted','comment_added','member_invited',
                       'sprint_started','sprint_completed'
                     ]
  meta:              Mixed  (e.g. { from: 'todo', to: 'in-progress' })
  read:              Boolean, default: false
  createdAt:         Date, default: Date.now
}

Add these MongoDB indexes:
  Task: text index on { title: 'text', description: 'text' }
  Task: compound index on { project: 1, status: 1 }
  Task: compound index on { assignee: 1, dueDate: 1 }
  Notification: index on { target: 1, read: 1, createdAt: -1 }


────────────────────────────────────────────────────────────────────────────────
  SECTION 8 — REST API ENDPOINTS
────────────────────────────────────────────────────────────────────────────────

Base URL: /api

── Auth ──
POST  /auth/register        Body: { firstName, lastName, email, password }
                            Returns: { user, accessToken }  +  sets httpOnly refreshToken cookie
POST  /auth/login           Body: { email, password }
                            Returns: { user, accessToken }  +  sets httpOnly refreshToken cookie
POST  /auth/refresh         Uses httpOnly cookie → returns new accessToken
POST  /auth/logout          Clears refreshToken cookie
GET   /auth/me              Returns current user (populated with project count)

── Profile ──
PUT   /users/profile        Update profile (all onboarding fields)
                            Body: { firstName, lastName, phone, bio, workspaceRole,
                                    department, teamName, experienceLevel,
                                    defaultView, timezone, notifications,
                                    profileComplete }
POST  /users/avatar         Upload avatar (multipart/form-data; store as base64 or URL)
GET   /users/search?q=      Search users by name/email for project invite

── Projects ──
GET   /projects             List projects where user is owner or member
POST  /projects             Create project; body: { name, description, key, icon }
GET   /projects/:id         Get project + members (populated)
PUT   /projects/:id         Update project (admin/owner only)
DELETE /projects/:id        Delete project + all its tasks/sprints (owner only)
POST  /projects/:id/invite  Invite user by email; body: { email, role }
PATCH /projects/:id/members/:userId  Change member role; body: { role }
DELETE /projects/:id/members/:userId Remove member (cannot remove owner)

── Sprints ──
GET   /sprints?projectId=   List sprints for a project
POST  /sprints              Create sprint; body: { projectId, name, goal, startDate, endDate }
PATCH /sprints/:id/start    Start sprint (sets status: active; only 1 active at a time)
PATCH /sprints/:id/complete Complete sprint; moves incomplete tasks to backlog
DELETE /sprints/:id         Delete unstarted sprint

── Tasks ──
GET   /tasks                Query params: projectId (required), sprintId, status,
                            priority, assignee, type, q (search), page, limit
POST  /tasks                Create task; body: { title, description, projectId,
                                                  sprintId, type, priority, dueDate,
                                                  assignee, storyPoints, labels }
GET   /tasks/:id            Get single task (populated: assignee, reporter, comments.author)
PUT   /tasks/:id            Full update (admin or own task)
DELETE /tasks/:id           Delete task (admin only)
PATCH /tasks/:id/status     body: { status }  — logs to Notification
PATCH /tasks/:id/assign     body: { assigneeId }  — logs to Notification
PATCH /tasks/:id/move       body: { status, order }  — for kanban drag-drop reorder
POST  /tasks/:id/comments   Add comment; body: { text }

── Notifications ──
GET   /notifications        Returns last 30 for current user
PATCH /notifications/read   Mark all as read

── Dashboard ──
GET   /dashboard/stats      Returns:
                            { myOpenTasks, inProgress, overdue, sprintProgress,
                              recentActivity[], overdueItems[] }

All protected routes require:
  Authorization: Bearer <accessToken>


────────────────────────────────────────────────────────────────────────────────
  SECTION 9 — AUTH ARCHITECTURE
────────────────────────────────────────────────────────────────────────────────

Access token:   JWT, expires in 15 minutes, stored ONLY in Redux state (memory)
Refresh token:  JWT, expires in 7 days, stored in httpOnly + Secure + SameSite=Strict cookie

Axios setup (client/src/services/api.js):
  - Base URL from VITE_API_URL env var
  - withCredentials: true  (required for cookie)
  - Request interceptor: attach "Authorization: Bearer <accessToken>" header
  - Response interceptor: on 401, call /auth/refresh, update token in Redux,
    retry the original request once; if refresh also fails, dispatch logout()

JWT payload: { userId, email, iat, exp }

Middleware chain (server):
  verifyToken(req, res, next)
    → decodes accessToken from Authorization header
    → attaches req.user = { _id, email }
    → 401 if missing/expired

  injectFullUser(req, res, next)  (only on routes that need role checks)
    → fetches User from DB, attaches to req.fullUser

  requireProjectMember(req, res, next)
    → reads :id or req.body.projectId
    → fetches Project, checks req.user._id is in project.members
    → 403 if not a member

  requireRole(...roles)  e.g. requireRole('admin','owner')
    → checks member.role OR project.owner === req.user._id
    → 403 if insufficient role

  restrictIntern(req, res, next)
    → if req.fullUser.workspaceRole === 'intern', block project creation
      and block PATCH /tasks/:id/status to 'done'


────────────────────────────────────────────────────────────────────────────────
  SECTION 10 — FRONTEND PAGES (detailed spec)
────────────────────────────────────────────────────────────────────────────────

Route structure (React Router v6):
  /                     → redirect to /dashboard if logged in, else /login
  /login                → Login page
  /register             → Register page
  /onboarding           → Profile setup wizard (redirect here after register)
  /dashboard            → Dashboard
  /projects             → Projects list
  /projects/:id         → Project detail (defaults to board view)
  /projects/:id/board   → Kanban board
  /projects/:id/backlog → Backlog
  /projects/:id/reports → Reports & charts
  /profile              → My profile view
  /profile/edit         → Edit profile (same wizard)
  /settings             → Settings
  *                     → 404 Not found

ProtectedRoute:
  - Checks Redux auth.user is not null
  - If null, redirect to /login with `state.from` preserved
  - If logged in but !user.profileComplete, redirect to /onboarding

──── Login page ────
  Centered card (max-width 400px) on #F4F5F7 background.
  TaskFlow Pro logo + "Sign in to your account" heading.
  Fields: email, password (show/hide toggle).
  "Forgot password?" link.
  Blue "Sign in" button (full width).
  "Don't have an account? Sign up" link at bottom.
  On success: store accessToken in Redux, redirect to /dashboard
              (or /onboarding if !profileComplete).

──── Register page ────
  Same card layout.
  Fields: First name, Last name, Email, Password, Confirm password.
  Password strength meter (weak/fair/strong using regex).
  "Already have an account? Sign in" link.
  On success: redirect to /onboarding.

──── Onboarding wizard ────  (detailed in Section 5 above)

──── Dashboard ────
  Header: "Good morning/afternoon, [FirstName] 👋" + subtitle + "Create issue" button.
  Stats row (4 cards): My open tasks | In progress | Overdue | Sprint progress (with mini bar).
  "My tasks" table: Key | Summary | Priority | Status | Assignee | Due date.
    - Overdue rows have light red background (#FFEBE6).
    - Key column is a link that opens task detail modal.
    - Click row → open task detail modal.
  Recent activity feed (below table): avatar + text + timestamp.
    e.g. "Sneha Patel moved TF-135 to In Review · 2h ago"

──── Kanban Board ────
  Project selector breadcrumb at top: "All projects > TaskFlow Pro > Board".
  Sprint info bar: "Sprint 4 · May 27 – Jun 10 · 14 issues" + "Complete sprint" button (admin).
  Filter bar: [All | My tasks] + avatar chips (click to filter by person) + [+ Filter] button.
  4 columns: To Do | In Progress | In Review | Done.
  Each column header: COLUMN NAME (uppercase, #6B778C) + count badge.
  Each task card:
    - Issue key (e.g. TF-142) in top-left, #0052CC, 11px
    - Title (13px, #172B4D, 2-line max then ellipsis)
    - Footer row: [type icon] ... [priority colored dot] ... [assignee avatar]
    - Critical priority cards: left border 3px solid #DE350B
    - Hover: border turns #4C9AFF, subtle box-shadow
  "+" button at bottom of each column to add task inline.
  Drag-and-drop using @dnd-kit/core — PATCH /tasks/:id/move on drop.

──── Backlog ────
  Sprint blocks (collapsible, chevron toggle).
  Active sprint block has "Complete sprint" button + progress text.
  Each backlog item row: [type icon] [key] [title] [priority] [status badge] [story points pill].
  Hover row: light gray background, drag handle appears on left.
  "+ Create issue" button at bottom of each sprint block.
  Unscheduled "Backlog" block always last.
  "Create sprint" button to add a new sprint.

──── Project Detail / Settings ────
  Tab bar: Board | Backlog | Reports | Members | Settings
  Members tab: table of members with Name | Role | Joined | Actions (Change role | Remove).
    Admin-only: see "Invite" button, see role dropdowns, see remove buttons.
  Settings tab: Project name, description, key (read-only), icon, status.

──── Team / People page ────
  Grid of member cards (3 columns).
  Each card: colored avatar (initials) | name | email | role badge.
  Role badge colors:
    Admin:          bg #EAE6FF  text #403294
    Manager/Lead:   bg #DEEBFF  text #0747A6
    Developer:      bg #E3FCEF  text #006644
    QA:             bg #FFECDB  text #974F0C
    Designer:       bg #FFF0B3  text #974F0C
    Product Manager:bg #DEEBFF  text #0747A6
    Intern:         bg #FFF0B3  text #974F0C
  Click card → profile modal with task summary.
  "Invite member" button (admin only).

──── Profile page ────
  Hero card: large avatar | name | email | role badge | dept chip | "Edit profile" button.
  Info grid (2 columns, 2 rows = 4 sections):
    Personal info:  name, email, phone, timezone, joined date
    Work info:      role, department, squad, access level, active projects
    Task summary:   open tasks, in progress, overdue, completed this sprint
    Notifications:  each preference On/Off

──── Settings page ────
  Left nav (180px): Profile | Security | Notifications | ── | Members & roles | Permissions | Issue types
  Content area shows form for selected section.
  Profile section: same fields as onboarding step 1.
  Security section: change password form + active sessions list.
  Notifications: same toggles as onboarding step 3.

──── Task detail modal ────
  Opens as a right-side drawer (720px wide) over the board, NOT a new page.
  Left side (wider):
    - Editable title (click to edit inline)
    - Issue type dropdown + Status dropdown + Priority dropdown in a toolbar row
    - Description (rich text editor — use @uiw/react-md-editor or simple textarea)
    - Comments section: avatar + textarea + "Save" button; list of comments below
    - Activity log for this task
  Right side (narrower):
    - Assignee (avatar picker)
    - Reporter (read-only)
    - Sprint (dropdown)
    - Story points (1,2,3,5,8,13 button grid)
    - Due date (date picker)
    - Labels (chip input)
    - Created/Updated timestamps
    - "Delete issue" link at bottom (admin only, red, with confirm dialog)
  "X" to close drawer.


────────────────────────────────────────────────────────────────────────────────
  SECTION 11 — FRONTEND COMPONENT ARCHITECTURE
────────────────────────────────────────────────────────────────────────────────

client/src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx          variants: primary | secondary | ghost | danger | link
│   │   ├── Input.jsx           with label, error message, prefix icon slot
│   │   ├── Select.jsx          styled native select
│   │   ├── Badge.jsx           props: variant (status|priority|role|type)
│   │   ├── Avatar.jsx          props: name, size (xs|sm|md|lg), color (auto-from name)
│   │   ├── Modal.jsx           portal + backdrop + focus trap
│   │   ├── Drawer.jsx          right-side panel (for task detail)
│   │   ├── Spinner.jsx
│   │   ├── Toast.jsx           success | error | info (auto-dismiss 4s)
│   │   ├── Tooltip.jsx
│   │   ├── ConfirmDialog.jsx
│   │   └── ProgressBar.jsx
│   ├── layout/
│   │   ├── TopNav.jsx
│   │   ├── Sidebar.jsx
│   │   ├── PageLayout.jsx      (wraps TopNav + Sidebar + children)
│   │   └── Breadcrumb.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── onboarding/
│   │   ├── OnboardingWizard.jsx   (3-step container + progress bar)
│   │   ├── Step1Personal.jsx
│   │   ├── Step2Role.jsx
│   │   ├── RoleCard.jsx
│   │   ├── DeptChips.jsx
│   │   └── Step3Preferences.jsx
│   ├── projects/
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectForm.jsx
│   │   ├── ProjectList.jsx
│   │   └── InviteMemberModal.jsx
│   ├── tasks/
│   │   ├── TaskCard.jsx           (kanban card)
│   │   ├── TaskRow.jsx            (backlog row)
│   │   ├── TaskDetailDrawer.jsx
│   │   ├── TaskForm.jsx
│   │   ├── CommentSection.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── PriorityIcon.jsx
│   │   └── IssueTypeIcon.jsx
│   ├── board/
│   │   ├── KanbanBoard.jsx
│   │   ├── KanbanColumn.jsx
│   │   └── DraggableCard.jsx
│   ├── backlog/
│   │   ├── BacklogPage.jsx
│   │   ├── SprintBlock.jsx
│   │   └── BacklogItem.jsx
│   └── dashboard/
│       ├── StatsRow.jsx
│       ├── StatCard.jsx
│       ├── TaskTable.jsx
│       └── ActivityFeed.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx
│   ├── Profile.jsx
│   ├── Settings.jsx
│   └── NotFound.jsx
├── store/
│   ├── index.js
│   ├── authSlice.js            { user, accessToken, loading, error }
│   ├── projectSlice.js         { projects[], currentProject, loading }
│   └── uiSlice.js              { taskDrawerOpen, taskDrawerId, toasts[] }
├── hooks/
│   ├── useAuth.js              returns { user, login, logout, isLoading }
│   ├── useProject.js
│   ├── useTasks.js             react-query hooks for task CRUD
│   └── useToast.js
├── services/
│   └── api.js                  axios instance + interceptors
└── utils/
    ├── colors.js               avatar color from name hash, badge color maps
    ├── dateUtils.js            formatDate, isOverdue, timeAgo
    ├── issueKey.js             generate TF-142 style keys
    └── constants.js            STATUS_OPTIONS, PRIORITY_OPTIONS, ROLE_OPTIONS


────────────────────────────────────────────────────────────────────────────────
  SECTION 12 — NPM PACKAGES
────────────────────────────────────────────────────────────────────────────────

Client (client/package.json):
  react, react-dom, react-router-dom v6
  @reduxjs/toolkit, react-redux
  @tanstack/react-query v5
  axios
  @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
  react-hook-form, zod, @hookform/resolvers
  recharts
  date-fns
  lucide-react
  @uiw/react-md-editor  (or react-quill for description rich text)
  clsx, tailwind-merge
  tailwindcss, autoprefixer, postcss
  vite, @vitejs/plugin-react

Server (server/package.json):
  express
  mongoose
  bcryptjs
  jsonwebtoken
  cookie-parser
  cors
  express-validator
  dotenv
  helmet
  morgan
  express-rate-limit
  multer  (for avatar upload, optional)

Dev: nodemon, jest, supertest (for API testing)


────────────────────────────────────────────────────────────────────────────────
  SECTION 13 — TAILWIND CONFIG
────────────────────────────────────────────────────────────────────────────────

// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jira: {
          primary:  '#0052CC',
          nav:      '#0747A6',
          sidebar:  '#253858',
          'sidebar-hover': '#344563',
          blue:     '#DEEBFF',
          bg:       '#F4F5F7',
          border:   '#DFE1E6',
          text:     '#172B4D',
          muted:    '#6B778C',
        }
      },
      fontFamily: {
        sans: ['-apple-system','BlinkMacSystemFont','"Segoe UI"','sans-serif'],
      },
    }
  },
  plugins: [],
}


────────────────────────────────────────────────────────────────────────────────
  SECTION 14 — RAILWAY DEPLOYMENT
────────────────────────────────────────────────────────────────────────────────

Create two Railway services from the same GitHub repo:

Service 1: "taskflow-api" (Node.js)
  Root directory:  server/
  Build command:   npm install
  Start command:   node server.js
  Environment variables:
    NODE_ENV=production
    PORT=5000
    MONGODB_URI=mongodb+srv://...
    JWT_SECRET=<random 32+ char string>
    JWT_REFRESH_SECRET=<different random 32+ char string>
    CLIENT_URL=https://taskflow-ui.up.railway.app

Service 2: "taskflow-ui" (Static / Node)
  Root directory:  client/
  Build command:   npm install && npm run build
  Start command:   npx serve dist -p $PORT
  Environment variables:
    VITE_API_URL=https://taskflow-api.up.railway.app

CORS config in server/src/app.js:
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));

Cookie config for refresh token:
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  });


────────────────────────────────────────────────────────────────────────────────
  SECTION 15 — SEED SCRIPT (server/seed.js)
────────────────────────────────────────────────────────────────────────────────

Run with: node server/seed.js

Creates:
  Users:
    { email: 'admin@demo.com', password: 'Demo@1234',
      firstName: 'Sneha', lastName: 'Patel',
      workspaceRole: 'manager', department: 'Product',
      teamName: 'Leadership', profileComplete: true }

    { email: 'dev@demo.com', password: 'Demo@1234',
      firstName: 'Arjun', lastName: 'Kumar',
      workspaceRole: 'developer', department: 'Engineering',
      teamName: 'Platform Team', profileComplete: true }

    { email: 'intern@demo.com', password: 'Demo@1234',
      firstName: 'Neel', lastName: 'Khatri',
      workspaceRole: 'intern', department: 'Engineering',
      teamName: 'Platform Team', profileComplete: false }

  Project:
    { name: 'TaskFlow Pro', key: 'TF', description: 'Demo project',
      owner: admin._id,
      members: [
        { user: admin._id, role: 'admin' },
        { user: dev._id, role: 'member' },
        { user: intern._id, role: 'member' }
      ]
    }

  Sprint:
    { name: 'Sprint 4', project: project._id, status: 'active',
      startDate: [today - 4 days], endDate: [today + 10 days] }

  Tasks: 10 tasks spread across all 4 statuses, priorities, types.
    Include at least 2 with dueDate in the past (to demonstrate overdue feature).
    Include at least 1 bug, 1 epic, 3 stories, 5 tasks.
    Assign some to dev, some to admin, some unassigned.


────────────────────────────────────────────────────────────────────────────────
  SECTION 16 — EXTRA FEATURES (stand-out items)
────────────────────────────────────────────────────────────────────────────────

1. ISSUE KEY AUTO-GENERATION
   On task creation, query the project's task count + 1 and prepend the
   project key. e.g. if project.key = "TF" and there are 141 tasks, new key = "TF-142".
   Store as an atomic counter in the Project document: { ...issueCounter: Number }

2. FULL-TEXT TASK SEARCH
   MongoDB text index on { title: 'text', description: 'text' }.
   GET /tasks?q=<search> uses $text: { $search: query }.
   Frontend: search input in top nav triggers debounced API call.

3. OVERDUE BADGE IN SIDEBAR
   Tasks where dueDate < Date.now() AND status !== 'done' are overdue.
   Count shown as a red badge next to "Board" or "My tasks" in sidebar.
   Overdue task rows in Dashboard table highlighted with #FFEBE6 row background.

4. ACTIVITY LOG / NOTIFICATION FEED
   Every PATCH to task status, assign, or create logs a Notification document.
   GET /notifications returns the last 30 for the current user.
   Shown in Dashboard "Recent activity" section and in a notification popover
   on the bell icon in the top nav.

5. SPRINT BURNDOWN (reports page)
   Simple line chart (Recharts) showing:
   X axis: sprint days, Y axis: remaining story points.
   Ideal line vs actual line.
   Data computed server-side from task completions.

6. KEYBOARD SHORTCUT
   Press "C" anywhere on the board/backlog to open "Create issue" modal.
   Press "Escape" to close any modal/drawer.

7. PROFILE INCOMPLETE BANNER
   If user.profileComplete === false, show a yellow dismissible banner on
   dashboard: "Your profile is incomplete. Add your role and team →".
   Clicking it goes to /onboarding.

8. AVATAR COLOR CONSISTENCY
   In utils/colors.js, hash the user's name to pick a color deterministically
   from the 7 avatar colors. Same user always gets the same color across all
   pages and across page refreshes.


────────────────────────────────────────────────────────────────────────────────
  SECTION 17 — BUILD ORDER (step by step)
────────────────────────────────────────────────────────────────────────────────

Backend (do this first):
  1. Init Express app, connect MongoDB Atlas, setup .env
  2. Create all Mongoose models (User, Project, Sprint, Task, Notification)
  3. Build auth routes + middleware (register, login, refresh, logout, verifyToken)
  4. Build RBAC middleware (requireProjectMember, requireRole, restrictIntern)
  5. Build Project routes + controllers
  6. Build Sprint routes + controllers
  7. Build Task routes + controllers (including PATCH /status, /assign, /move)
  8. Build Notification route + auto-log on status/assign changes
  9. Build Dashboard /stats endpoint
  10. Add global error handler, validation middleware, rate limiting, helmet
  11. Test ALL endpoints with Postman — make sure RBAC works correctly
  12. Write seed.js and run it

Frontend:
  13. Vite + React setup, install all packages, configure Tailwind
  14. Build Axios service with interceptors (auth + refresh retry)
  15. Build Redux store (authSlice, projectSlice, uiSlice)
  16. Build Login and Register pages
  17. Build ProtectedRoute + redirect logic
  18. Build OnboardingWizard (3 steps) — connect to PUT /users/profile
  19. Build PageLayout (TopNav + Sidebar) with active state
  20. Build Dashboard page — connect stats + tasks + activity
  21. Build Projects list page
  22. Build Kanban Board with @dnd-kit — connect PATCH /tasks/:id/move
  23. Build Task detail drawer — full edit + comments
  24. Build Backlog page with sprint blocks
  25. Build Team/People page
  26. Build Profile page + Settings page
  27. Add Toast notifications, loading spinners, empty states, error boundaries
  28. Add keyboard shortcuts (C to create, Esc to close)
  29. Final QA: check all RBAC cases with all 3 user roles

Deploy:
  30. Push to GitHub
  31. Create Railway project, add both services, set all env vars
  32. Deploy and test live URL with seed credentials
  33. Record demo video (2–5 min):
      Open app → login as admin → complete onboarding (show role selection)
      → create project → invite member → create task → drag on board
      → show overdue item in dashboard → show team page → show profile

================================================================================
  END OF MASTER PROMPT
================================================================================
# Decomposr – AI-Powered Product Management Platform

> **Transform project ideas into actionable tasks with AI-driven planning and real-time collaboration**

Decomposr is a full-stack collaborative platform that revolutionizes product management through intelligent AI-driven task decomposition, interactive Kanban boards, and seamless real-time synchronization. It bridges the gap between high-level project concepts and concrete, executable development tasks.

![Decomposr Landing Page](docs/images/landing-hero.png)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)

---

## ✨ Key Features

### 🎯 Role-Based Workflows
**Product Managers (PMs)**
- Create and manage unlimited project rooms
- Generate secure invite codes for team collaboration
- Define project ideas and leverage AI to auto-generate comprehensive task breakdowns
- Assign tasks with priorities, deadlines, and effort estimates
- Monitor team progress through interactive Kanban boards and analytics
- Organize tasks into epics for better project structure

**Team Members (Employees)**
- Join multiple rooms using invite codes
- Access a unified dashboard showing all assigned tasks across projects
- Update task status with drag-and-drop Kanban interface
- Track time spent and progress on individual tasks
- Receive real-time notifications for task assignments and updates

### 🤖 AI-Powered Task Generation
- **Powered by OpenRouter** (using Qwen/other premium models)
- Intelligent project decomposition: Describe your idea (e.g., "Build a React Authentication Flow with OAuth")
- AI generates:
  - **Structured task breakdown** (5-15 actionable tasks)
  - **Epic organization** (logical grouping of related tasks)
  - **Architecture overview** (technical approach and stack recommendations)
  - **Timeline estimation** (project milestones and delivery estimates)
  - **Task metadata** (priority, effort, dependencies, categories)

### 🔄 Real-Time Collaboration
- **Socket.io integration** for instant synchronization
- Live notifications for:
  - New team members joining rooms
  - Task assignments and reassignments
  - Task status changes and completions
  - Project updates and AI plan generation
- Persistent notification history with read/unread tracking
- Real-time Kanban board updates across all connected users

### 🎨 Premium UI/UX Design
- **Modern Tech Stack**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Component Library**: Shadcn UI + Radix UI primitives
- **Visual Excellence**:
  - **Aurora Backgrounds**: Dynamic, animated gradient overlays
  - **Glassmorphism**: Frosted glass effects with backdrop blur
  - **Micro-animations**: Smooth transitions powered by Framer Motion
  - **Responsive Design**: Mobile-first approach with adaptive layouts
  - **Dark Mode**: Optimized for low-light environments

### 📊 Interactive Kanban Board
- **Drag-and-drop task management** with `@hello-pangea/dnd`
- Four-column workflow: **To Do → In Progress → Review → Done**
- Visual task cards with:
  - Priority indicators (color-coded badges)
  - Assignee avatars
  - Due date tracking with overdue warnings
  - Effort estimates and time tracking
  - Category tags (Frontend, Backend, Testing, etc.)
- Quick actions: Assign, edit, delete tasks inline
- Filter and search capabilities
- Project-specific board views

### 📈 Analytics & Insights
- **Project Overview**: Summary, architecture, timeline visualization
- **Epic Breakdown**: Hierarchical task organization
- **Progress Tracking**: Completion rates, velocity metrics
- **Team Analytics**: Task distribution, member workload
- **Time Tracking**: Estimated vs. actual time spent

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Vite** | Lightning-fast build tool and dev server |
| **React 18** | UI library with hooks and context |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling framework |
| **Shadcn UI** | Accessible component library |
| **Radix UI** | Unstyled, accessible primitives |
| **Framer Motion** | Animation library |
| **React Router** | Client-side routing |
| **Socket.io Client** | Real-time WebSocket communication |
| **@hello-pangea/dnd** | Drag-and-drop functionality |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express 5** | Web application framework |
| **TypeScript** | Type-safe server code |
| **Prisma** | Next-generation ORM |
| **PostgreSQL** | Relational database |
| **Socket.io** | Real-time bidirectional communication |
| **JWT** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **OpenRouter API** | AI task generation |

### DevOps & Tools
- **pnpm** - Fast, disk space efficient package manager
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **SWC** - Fast TypeScript/JavaScript compiler

---

## 🏗 System Architecture

### 1. Authentication & Authorization
- **JWT-based authentication** with secure token generation
- **bcryptjs** password hashing with salt rounds
- Role-based access control (RBAC) with `pm` and `employee` roles
- Protected API routes with middleware validation
- Token refresh mechanism for extended sessions

### 2. Database Schema (Prisma)
```
User ──┬─ createdRooms → Room
       ├─ memberships → RoomMember
       ├─ assignedTasks → Task
       └─ notifications → Notification

Room ──┬─ members → RoomMember
       └─ projects → Project

Project ──┬─ tasks → Task
          └─ epics → Epic

Epic ──→ tasks → Task
```

**Key Models:**
- **User**: Authentication, profile, role
- **Room**: Collaboration workspace with invite codes
- **RoomMember**: Join table with role inheritance
- **Project**: Container for tasks with AI metadata
- **Epic**: Logical task grouping
- **Task**: Granular work items with status, priority, assignments
- **Notification**: Real-time alert persistence

### 3. AI Task Generation Pipeline
```
1. PM creates project with description
2. Frontend triggers AI generation request
3. Backend constructs prompt with project context
4. OpenRouter API processes request
5. AI returns structured JSON:
   - Summary
   - Architecture recommendations
   - Timeline estimate
   - Epics array
   - Tasks array (with metadata)
6. Backend validates and persists to database
7. Socket.io broadcasts update to all room members
8. Frontend updates UI in real-time
```

### 4. Real-Time Notification System
- **Dual-layer approach**:
  1. **Database persistence**: All notifications stored in PostgreSQL
  2. **Socket.io events**: Instant delivery to connected clients
- **Event types**:
  - `room:join` - New member joins room
  - `task:assign` - Task assigned to user
  - `task:update` - Task status/details changed
  - `task:complete` - Task marked as done
  - `project:create` - New project added
  - `ai:generate` - AI plan generation complete
- **Connection management**: User ID to socket ID mapping
- **Offline support**: Notifications queued and delivered on reconnect

### 5. State Management
- **React Context API** for global state:
  - `AuthContext` - User session, login/logout
  - `RoomsContext` - Room data, projects, tasks
  - `NotificationContext` - Real-time alerts
- **Optimistic updates** for instant UI feedback
- **Background sync** to reconcile with server state

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **pnpm** (recommended) - `npm install -g pnpm`
- **OpenRouter API Key** - Available at [OpenRouter](https://openrouter.ai/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/decomposr.git
   cd decomposr
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/decomposr"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   
   # AI Integration
   OPENROUTER_API_KEY="your-openrouter-api-key"
   AI_MODEL_NAME="qwen/qwen3-next-80b-a3b-instruct:free"
   
   # Server (optional)
   PORT=5000
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # (Optional) Seed with sample data
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000

### Building for Production

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

---

## 📖 Usage Guide

### For Product Managers

1. **Sign up** with role `pm`
2. **Create a room** from the PM Dashboard
3. **Share the invite code** with your team
4. **Create a project** within the room
5. **Generate AI plan** by clicking "Generate AI Plan"
6. **Review and customize** the generated tasks, epics, and timeline
7. **Assign tasks** to team members via the Kanban board
8. **Monitor progress** through analytics and real-time updates

### For Team Members

1. **Sign up** with role `employee`
2. **Join a room** using the invite code from your PM
3. **View assigned tasks** on your Employee Dashboard
4. **Update task status** by dragging cards on the Kanban board
5. **Track time** and add notes to tasks
6. **Receive notifications** for new assignments and updates

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user (protected)

### Rooms
- `GET /api/rooms` - List user's rooms
- `POST /api/rooms` - Create new room (PM only)
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/join` - Join room with invite code

### Projects
- `POST /api/rooms/:roomId/projects` - Create project
- `POST /api/rooms/:roomId/projects/:projectId/generate-ai` - Generate AI plan
- `GET /api/rooms/:roomId/projects/:projectId` - Get project details

### Tasks
- `PATCH /api/rooms/:roomId/projects/:projectId/tasks/:taskId` - Update task
- `POST /api/rooms/:roomId/projects/:projectId/tasks/:taskId/assign` - Assign task
- `DELETE /api/rooms/:roomId/projects/:projectId/tasks/:taskId` - Delete task

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenRouter** for powerful AI capabilities
- **Shadcn UI** for beautiful, accessible components
- **Prisma** for excellent database tooling
- **Socket.io** for real-time communication

---

## 📧 Contact

For questions, feedback, or support, please open an issue on GitHub.

**Built with ❤️ by the Decomposr Team**

# Decomposr – AI-Powered Product Manager Dashboard

Decomposr is a full-stack collaborative platform designed to streamline product management through AI-driven task generation and real-time synchronization. It bridges the gap between high-level project ideas and concrete development tasks.

## 🚀 Key Features

### 1. Role-Based Experience
- **Product Managers (PMs)**: 
  - Create and manage project rooms.
  - Generate invite codes for team collaboration.
  - Create project ideas and use AI to decompose them into tasks.
  - Assign tasks to team members and monitor progress.
- **Team Members (Employees)**:
  - Join rooms using invite codes.
  - View a consolidated dashboard of assigned tasks across all rooms.
  - Update task status (To Do → In Progress → Review → Done).

### 2. AI Task Generation
- Powered by **Google Gemini (Pro/Flash)**.
- PMs can define a project idea (e.g., "Build a React Authentication Flow").
- The AI "Product Manager" automatically generates a structured plan with 5-10 actionable tasks using Google's generative AI.

### 3. Real-Time Collaboration
- Integrated **Socket.io** for instant notifications.
- Users receive real-time alerts when:
  - A new member joins their room.
  - A task is assigned to them.
  - A task they own/created is completed.

### 4. Modern & Premium UI
- Built with **React** and **Tailwind CSS**.
- Features high-fidelity aesthetics including:
  - **Aurora Backgrounds**: Dynamic, animated gradient layers.
  - **Glassmorphism**: Sleek, semi-transparent UI elements.
  - **Micro-animations**: Powered by Framer Motion.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Vite + React
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Context API
- **Real-time**: Socket.io Client

### Backend
- **Server**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Google Generative AI (Gemini)
- **Real-time**: Socket.io

---

## 🏗 System Architecture (A to Z)

### 1. Authentication Layer
Uses **JSON Web Tokens (JWT)** and **bcryptjs** for secure, stateless authentication. User roles (`pm` or `employee`) are embedded in the token to drive the frontend UI logic.

### 2. Data Persistence
- **Prisma** models relationships between `Users`, `Rooms`, `Projects`, `Tasks`, and `Notifications`.
- PostgreSQL ensures data integrity and high performance.

### 3. AI Decomposition Pipeline
When a PM triggers AI generation:
1. The backend sends the project description to Google Gemini with a specific prompt.
2. The AI returns a structured JSON task list.
3. The backend validates and persists these tasks to the database.
4. The frontend refreshes in real-time to show the new plan.

### 4. Real-time Notification Engine
- A dedicated socket server tracks active user connections.
- Every major action (Join, Assign, Finish) triggers a dual event: 
  1. A database record in the `Notification` table (for persistence).
  2. A socket `emit` to the specific user (for real-time alert).

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Google Gemini API Key (available for free at [Google AI Studio](https://aistudio.google.com/))

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd decomposr-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
   JWT_SECRET="your-super-secret-key"
   GEMINI_API_KEY="your-gemini-api-key"
   ```
4. Initialize the database:
   ```bash
   npx prisma db push
   ```
5. Run the application:
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

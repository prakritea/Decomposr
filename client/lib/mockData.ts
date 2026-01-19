import { Epic } from "@/components/dashboard/EpicCard";
import { Task } from "@/components/dashboard/TaskCard";

interface ProjectPlan {
  title: string;
  summary: string;
  architecture: string;
  estimatedTimeline: string;
  epics: Epic[];
  roles: string[];
  timeline: string[];
}

const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

export function mockGenerateProjectPlan(
  description: string,
  platform: string,
  techStack: string,
  teamSize: string,
  timeline: string
): ProjectPlan {
  // Extract key concepts from description for realistic project titles
  const words = description.toLowerCase().split(/\s+/);
  const projectTitle = words
    .slice(0, 3)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Define roles based on team size
  const rolesMap = {
    solo: ["Full Stack Developer"],
    small: ["Frontend Developer", "Backend Developer"],
    medium: [
      "Frontend Lead",
      "Backend Lead",
      "DevOps Engineer",
      "QA Engineer",
      "Product Manager",
    ],
    large: [
      "Frontend Lead",
      "Backend Lead",
      "DevOps Engineer",
      "QA Lead",
      "Product Manager",
      "UI/UX Designer",
      "Security Engineer",
    ],
  };

  const roles = rolesMap[teamSize as keyof typeof rolesMap] || rolesMap.medium;

  // Create sample epics based on platform
  const commonEpics = generateEpics(platform, teamSize, description);

  return {
    title: projectTitle,
    summary: description.substring(0, 200) + "...",
    architecture: generateArchitecture(platform, techStack),
    estimatedTimeline: timeline,
    epics: commonEpics,
    roles,
    timeline: generateTimeline(teamSize),
  };
}

function generateEpics(
  platform: string,
  teamSize: string,
  description: string
): Epic[] {
  const epics: Epic[] = [];

  // Always include these core epics
  const coreEpics = [
    {
      id: generateId("epic"),
      title: "User Authentication & Authorization",
      description:
        "Implement secure user registration, login, password reset, and role-based access control",
      tasks: generateAuthTasks(),
      estimatedWeeks: 2,
    },
    {
      id: generateId("epic"),
      title: "Core Features Implementation",
      description:
        "Build the primary features and functionality described in the project requirements",
      tasks: generateCoreTasks(description),
      estimatedWeeks: 4,
    },
    {
      id: generateId("epic"),
      title: "UI/UX & Frontend Polish",
      description:
        "Create responsive design, optimize user experience, and ensure cross-browser compatibility",
      tasks: generateUXTasks(),
      estimatedWeeks: 2,
    },
    {
      id: generateId("epic"),
      title: "Testing & Quality Assurance",
      description:
        "Implement unit tests, integration tests, and end-to-end testing coverage",
      tasks: generateTestingTasks(),
      estimatedWeeks: 2,
    },
    {
      id: generateId("epic"),
      title: "DevOps & Deployment",
      description:
        "Set up CI/CD pipelines, containerization, and production deployment infrastructure",
      tasks: generateDevOpsTasks(),
      estimatedWeeks: 2,
    },
  ];

  // Add platform-specific epics
  if (platform === "mobile" || platform === "fullstack") {
    coreEpics.push({
      id: generateId("epic"),
      title: "Mobile App Development",
      description: "Build native or cross-platform mobile applications",
      tasks: generateMobileTasks(),
      estimatedWeeks: 3,
    });
  }

  if (platform === "aiml") {
    coreEpics.push({
      id: generateId("epic"),
      title: "ML Model Development",
      description: "Train, validate, and deploy machine learning models",
      tasks: generateMLTasks(),
      estimatedWeeks: 4,
    });
  }

  return coreEpics;
}

function generateAuthTasks(): Task[] {
  return [
    {
      id: generateId("task"),
      title: "Design authentication schema",
      description: "Plan database schema for users and authentication tokens",
      role: "Backend Lead",
      priority: "high",
      effort: "4-6 hours",
      category: "Backend",
    },
    {
      id: generateId("task"),
      title: "Implement user registration endpoint",
      description: "Create REST API endpoint for user sign-up with validation",
      role: "Backend Lead",
      priority: "high",
      effort: "6-8 hours",
      category: "Backend",
    },
    {
      id: generateId("task"),
      title: "Create login UI",
      description: "Build responsive login form with email/password fields",
      role: "Frontend Lead",
      priority: "high",
      effort: "4-6 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "Implement JWT authentication",
      description: "Set up JWT token generation and validation",
      role: "Backend Lead",
      priority: "high",
      effort: "6-8 hours",
      category: "Backend",
      dependencies: ["Implement user registration endpoint"],
    },
    {
      id: generateId("task"),
      title: "Add password reset functionality",
      description: "Implement secure password reset via email",
      role: "Backend Lead",
      priority: "medium",
      effort: "4-6 hours",
      category: "Backend",
    },
    {
      id: generateId("task"),
      title: "Integrate OAuth providers",
      description: "Add Google and GitHub OAuth authentication",
      role: "Backend Lead",
      priority: "medium",
      effort: "8-10 hours",
      category: "Integration",
    },
  ];
}

function generateCoreTasks(description: string): Task[] {
  const tasks: Task[] = [
    {
      id: generateId("task"),
      title: "Design system architecture",
      description: "Plan overall system architecture and component structure",
      role: "Tech Lead",
      priority: "high",
      effort: "8-10 hours",
      category: "Backend",
    },
    {
      id: generateId("task"),
      title: "Setup database schema",
      description:
        "Design and implement database schema for core features",
      role: "Backend Lead",
      priority: "high",
      effort: "6-8 hours",
      category: "Backend",
    },
    {
      id: generateId("task"),
      title: "Create API endpoints",
      description: "Implement REST API endpoints for main features",
      role: "Backend Lead",
      priority: "high",
      effort: "16-20 hours",
      category: "Backend",
      dependencies: ["Setup database schema"],
    },
    {
      id: generateId("task"),
      title: "Build component library",
      description: "Create reusable UI components and patterns",
      role: "Frontend Lead",
      priority: "high",
      effort: "12-16 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "Implement main features UI",
      description: "Build UI for core application features",
      role: "Frontend Lead",
      priority: "high",
      effort: "20-24 hours",
      category: "Frontend",
      dependencies: ["Build component library"],
    },
    {
      id: generateId("task"),
      title: "Integrate frontend with backend",
      description: "Connect frontend components to backend APIs",
      role: "Frontend Lead",
      priority: "high",
      effort: "12-16 hours",
      category: "Integration",
      dependencies: ["Create API endpoints", "Implement main features UI"],
    },
  ];

  return tasks;
}

function generateUXTasks(): Task[] {
  return [
    {
      id: generateId("task"),
      title: "Implement responsive design",
      description: "Ensure all pages work on mobile, tablet, and desktop",
      role: "Frontend Lead",
      priority: "high",
      effort: "8-10 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "Add dark mode support",
      description: "Implement theme switching and dark mode styling",
      role: "Frontend Lead",
      priority: "medium",
      effort: "4-6 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "Optimize performance",
      description:
        "Reduce bundle size, optimize images, implement lazy loading",
      role: "Frontend Lead",
      priority: "medium",
      effort: "6-8 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "Add error handling & toast notifications",
      description: "Implement user-friendly error messages and notifications",
      role: "Frontend Lead",
      priority: "medium",
      effort: "4-6 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "Implement loading states",
      description: "Add loading spinners and skeleton screens",
      role: "Frontend Lead",
      priority: "low",
      effort: "3-4 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "User testing & feedback",
      description: "Conduct user testing sessions and incorporate feedback",
      role: "Product Manager",
      priority: "medium",
      effort: "6-8 hours",
      category: "Frontend",
    },
  ];
}

function generateTestingTasks(): Task[] {
  return [
    {
      id: generateId("task"),
      title: "Write unit tests for backend",
      description: "Create unit tests for backend services and utilities",
      role: "QA Engineer",
      priority: "high",
      effort: "12-16 hours",
      category: "Testing",
    },
    {
      id: generateId("task"),
      title: "Write unit tests for frontend",
      description: "Create unit tests for React components",
      role: "QA Engineer",
      priority: "high",
      effort: "10-12 hours",
      category: "Testing",
    },
    {
      id: generateId("task"),
      title: "Create integration tests",
      description: "Test API endpoints and component interactions",
      role: "QA Engineer",
      priority: "high",
      effort: "8-10 hours",
      category: "Testing",
    },
    {
      id: generateId("task"),
      title: "Setup E2E testing framework",
      description: "Configure Cypress or Playwright for end-to-end tests",
      role: "QA Engineer",
      priority: "medium",
      effort: "4-6 hours",
      category: "Testing",
    },
    {
      id: generateId("task"),
      title: "Performance testing",
      description: "Measure and optimize application performance",
      role: "QA Engineer",
      priority: "medium",
      effort: "6-8 hours",
      category: "Testing",
    },
  ];
}

function generateDevOpsTasks(): Task[] {
  return [
    {
      id: generateId("task"),
      title: "Setup Docker & containerization",
      description: "Create Docker containers for frontend and backend",
      role: "DevOps Engineer",
      priority: "high",
      effort: "6-8 hours",
      category: "DevOps",
    },
    {
      id: generateId("task"),
      title: "Configure CI/CD pipeline",
      description: "Setup GitHub Actions or GitLab CI for automated testing",
      role: "DevOps Engineer",
      priority: "high",
      effort: "6-8 hours",
      category: "DevOps",
    },
    {
      id: generateId("task"),
      title: "Setup production environment",
      description: "Configure servers and infrastructure for production",
      role: "DevOps Engineer",
      priority: "high",
      effort: "8-10 hours",
      category: "DevOps",
    },
    {
      id: generateId("task"),
      title: "Implement monitoring & logging",
      description: "Setup application monitoring and centralized logging",
      role: "DevOps Engineer",
      priority: "medium",
      effort: "6-8 hours",
      category: "DevOps",
    },
    {
      id: generateId("task"),
      title: "Configure database backups",
      description: "Setup automated database backup and recovery procedures",
      role: "DevOps Engineer",
      priority: "medium",
      effort: "4-6 hours",
      category: "DevOps",
    },
  ];
}

function generateMobileTasks(): Task[] {
  return [
    {
      id: generateId("task"),
      title: "Setup mobile project structure",
      description: "Initialize React Native or Flutter project",
      role: "Mobile Lead",
      priority: "high",
      effort: "4-6 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "Implement mobile UI components",
      description: "Create platform-specific UI components",
      role: "Mobile Lead",
      priority: "high",
      effort: "16-20 hours",
      category: "Frontend",
    },
    {
      id: generateId("task"),
      title: "Integrate with backend APIs",
      description: "Connect mobile app to backend services",
      role: "Mobile Lead",
      priority: "high",
      effort: "8-10 hours",
      category: "Integration",
    },
    {
      id: generateId("task"),
      title: "Implement push notifications",
      description: "Setup push notification system",
      role: "Mobile Lead",
      priority: "medium",
      effort: "4-6 hours",
      category: "Integration",
    },
    {
      id: generateId("task"),
      title: "Device testing",
      description: "Test on multiple devices and OS versions",
      role: "QA Engineer",
      priority: "medium",
      effort: "6-8 hours",
      category: "Testing",
    },
  ];
}

function generateMLTasks(): Task[] {
  return [
    {
      id: generateId("task"),
      title: "Data collection & preparation",
      description: "Gather and preprocess training data",
      role: "ML Engineer",
      priority: "high",
      effort: "20-24 hours",
      category: "Backend",
    },
    {
      id: generateId("task"),
      title: "Model development & training",
      description: "Build and train machine learning models",
      role: "ML Engineer",
      priority: "high",
      effort: "24-32 hours",
      category: "Backend",
    },
    {
      id: generateId("task"),
      title: "Model evaluation & optimization",
      description: "Test models and optimize performance",
      role: "ML Engineer",
      priority: "high",
      effort: "12-16 hours",
      category: "Backend",
      dependencies: ["Model development & training"],
    },
    {
      id: generateId("task"),
      title: "Create prediction API",
      description: "Build API endpoint for model predictions",
      role: "Backend Lead",
      priority: "high",
      effort: "6-8 hours",
      category: "Backend",
    },
    {
      id: generateId("task"),
      title: "Deploy ML model",
      description: "Package and deploy model to production",
      role: "DevOps Engineer",
      priority: "high",
      effort: "6-8 hours",
      category: "DevOps",
    },
  ];
}

function generateArchitecture(platform: string, techStack: string): string {
  const architectures: Record<string, Record<string, string>> = {
    react: {
      web: "React SPA with Node.js/Express backend, PostgreSQL database, REST APIs",
      mobile:
        "React Native for cross-platform mobile, Node.js backend, Firebase for real-time data",
      fullstack:
        "Next.js for full-stack, API routes for backend, PostgreSQL, and Redis caching",
      aiml: "React frontend with Python FastAPI backend for ML model serving",
    },
    vue: {
      web: "Vue.js SPA with Python/Django backend, MySQL database",
      mobile: "NativeScript with Python backend",
      fullstack: "Nuxt.js full-stack with PostgreSQL",
      aiml: "Vue.js frontend with Flask for ML serving",
    },
    angular: {
      web: "Angular SPA with Java Spring Boot backend, Oracle Database",
      mobile: "NativeScript with Java backend",
      fullstack: "Angular with Java microservices",
      aiml: "Angular frontend with Java ML services",
    },
    nextjs: {
      web: "Next.js with Firebase backend and Firestore database",
      mobile: "React Native with Firebase backend",
      fullstack: "Next.js full-stack with Firebase",
      aiml: "Next.js frontend with Firebase ML",
    },
  };

  return (
    architectures[techStack]?.[platform] ||
    "Scalable microservices architecture with cloud deployment"
  );
}

function generateTimeline(teamSize: string): string[] {
  const phases: Record<string, string[]> = {
    solo: [
      "Week 1-2: Setup & Planning",
      "Week 3-6: Core Development",
      "Week 7-8: Testing & Refinement",
      "Week 9: Deployment",
    ],
    small: [
      "Week 1: Planning & Architecture",
      "Week 2-4: Development Sprint 1",
      "Week 5-6: Development Sprint 2",
      "Week 7: Testing & QA",
      "Week 8: Deployment & Launch",
    ],
    medium: [
      "Week 1: Planning, Design & Kickoff",
      "Week 2-3: Development Sprint 1",
      "Week 4-5: Development Sprint 2",
      "Week 6-7: Development Sprint 3",
      "Week 8: Integration & Testing",
      "Week 9: UAT & Refinement",
      "Week 10: Deployment & Monitoring",
    ],
    large: [
      "Week 1-2: Planning, Design & Architecture",
      "Week 3-4: Development Sprint 1",
      "Week 5-6: Development Sprint 2",
      "Week 7-8: Development Sprint 3",
      "Week 9-10: Development Sprint 4",
      "Week 11-12: Testing, QA & Integration",
      "Week 13: UAT & Optimization",
      "Week 14: Deployment, Monitoring & Support",
    ],
  };

  return phases[teamSize] || phases.medium;
}

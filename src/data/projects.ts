/**
 * Projects Data
 *
 * NOTE: This file contains static project metadata.
 * Dynamic data (commits, roadmaps) is now loaded from the backend API:
 *
 * - devLog: Fetched from GitHub API via `/api/github/commits`
 *   - Uses useProjectCommits() hook in ProjectDetails.tsx
 *   - Data automatically filtered to team members and formatted
 *
 * - roadmap: Fetched from Notion API via `/api/notion/sprints`
 *   - Uses useProjectRoadmap() hook in ProjectDetails.tsx
 *
 * All dynamic data is cached until midnight PST to minimize API calls.
 */

// New roadmap structure: Sprint -> Epic -> Ticket

export interface Ticket {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description: string;
  assignees: string[]; // Array of assignee names
  storyPoints: number | null;
}

export interface Epic {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description: string;
  priority: string | null;
  tickets: Ticket[];
}

export interface Sprint {
  id: string;
  name: string;
  sprintNumber: number | null;
  startDate: string | null;
  endDate: string | null;
  status: 'not-started' | 'in-progress' | 'completed';
  epics: Epic[];
}

// DEPRECATED: Old interfaces kept for backward compatibility
export interface RoadmapItem {
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description?: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
  date: string;
  items: RoadmapItem[];
}

export interface DevLogEntry {
  id: string;
  date: string;
  week: string;
  type: 'feature' | 'fix' | 'design' | 'infra';
  content: string;
  assignee: string;
  assigneeImg?: string;
}

export interface Project {
  id: string;
  name: string;
  initials: string;
  tagline: string;
  description: string;
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    tools: string[];
    ai_cv?: string[];
  };
  features: string[];
  architecture: string;
  leadEngineers?: string[]; // Lead engineer(s) for the project
  teamSize: string;
  duration: string;
  status: string;
  statusColor: 'red' | 'yellow' | 'green' | 'blue';
  github?: string;
  liveDemo?: string;
  roadmap?: Sprint[]; // Loaded from Notion API (replaces old ProjectPhase structure)
  devLog?: DevLogEntry[]; // DEPRECATED: Now loaded from GitHub API
  notionProjectSlug?: string; // Optional: Override for Notion API calls if different from id
  // Visual media support
  mediaUrl?: string;
  mediaType?: 'image' | 'gif' | 'video';
}

export const projects: Project[] = [
  {
    id: 'clutch',
    name: 'Clutch',
    initials: 'CU',
    tagline: 'Uniting Everyone Under One Standard of Play',
    notionProjectSlug: 'Clutch',
    mediaUrl: '/assets/clutch.jpg',
    mediaType: 'image',
    description:
      'A mobile-first analytics platform designed to digitize and unify the game for the everyday person. Clutch replaces inconsistent manual scorekeeping with a standardized game state engine, leveraging AI and edge computer vision (YOLOv8) to capture real-time performance data. We build a permanent career profile for every player, creating a universal metric of success that validates every milestone and connects people through a shared history of the game.',
    techStack: {
      frontend: ['React Native', 'Expo', 'NativeWind'],
      backend: ['Python', 'FastAPI'],
      database: ['Supabase (PostgreSQL)'],
      tools: ['DigitalOcean', 'GitHub Actions'],
      ai_cv: ['YOLOv8 (Edge AI)', 'OpenCV', 'Roboflow'],
    },
    features: [
      'Edge-based Computer Vision (No internet required for gameplay)',
      'Real-time shot tracking & "Heat Check" analytics',
      'Proprietary MMR Ranking System (Global Ladder)',
      'Video Game HUD with Live AR Overlays',
      'Hybrid Cloud Sync (Offline-first architecture)',
      'Community "Pickup" matchmaking',
    ],
    architecture: 'Hybrid Edge-Cloud (On-Device Inference + Python Sync Engine)',
    leadEngineers: ['Giuseppi Pelayo'],
    teamSize: '4 Engineers',
    duration: '5 months',
    status: 'In Development',
    statusColor: 'yellow', // Changed from blue to indicate active building
    github: 'https://github.com/jagdteam/Clutch',
    // devLog: Loaded dynamically from GitHub API
  },
  {
    id: 'clicr-cli',
    name: 'CliCR',
    initials: 'CR',
    tagline: 'Command Line Interface Code Reader',
    mediaUrl: '/favicon.ico',
    mediaType: 'image',
    description:
      'A production-ready CLI tool that transforms static repositories into conversational knowledge bases. Built with Cohere, CliCr enables developers to learn about their codebase faster by querying in natural language, featuring intelligent incremental ingestion to minimize API costs.',
    techStack: {
      frontend: ['Python', 'Rich (TUI)', 'Typer'],
      backend: ['Cohere API (Command R+)', 'LangChain', 'Python'],
      database: ['ChromaDB', 'SQLite'],
      tools: ['Git', 'GitHub'],
    },
    features: [
      "Natural language chatting powered by Cohere's Command R+ LLM",
      'Automatic incremental ingestion via hashing to reduce API costs & re-indexing time',
      'Saved Conversation history',
      'Responses with answers & native file-path citations',
      'Universal support for 40+ programming languages & file types',
    ],
    architecture:
      "A local-first CLI implementing Retrieval-Augmented Generation (RAG) for codebases. It features a decoupled ingestion pipeline with persistent vector storage via ChromaDB and utilizes Cohere's Embed v3 for high-precision semantic search.",
    leadEngineers: ['Giuseppi Pelayo', 'Johnny Fok'],
    teamSize: '2 Engineers',
    duration: '1 Week',
    status: 'MVP Complete',
    statusColor: 'green',
    github: 'https://github.com/jagdteam/clicr',
    // devLog: Loaded dynamically from GitHub API
  },
  {
    id: 'codelens',
    name: 'CodeLens',
    initials: 'CL',
    tagline: 'AI-Powered Visual Abstraction for Engineering Teams',
    notionProjectSlug: 'CodeLens', // Notion database uses "CodeLens" with capital C and L
    mediaUrl: 'assets/Lens.png',
    mediaType: 'image',
    description:
      'An enterprise-grade developer tool designed to slash onboarding costs. It uses AI to synthesize complex code into high-level HUDs and automated diagrams, reducing developer ramp-up time and cognitive load.',
    techStack: {
      frontend: ['TypeScript', 'VS Code Extension API', 'React'],
      backend: ['Node.js', 'Tree-sitter', 'AI/LLM Integration'],
      database: ['Vector Embeddings (Contextual Search)', 'Redis'],
      tools: ['AST Parsing', 'System Design Visualization', 'GitHub Actions'],
    },
    features: [
      'AI-driven "Logic Blurring" to isolate critical code paths',
      'Automated system-design & dependency diagram generation',
      'Real-time HUD for instant function and architectural context',
      'Context-aware onboarding walkthroughs powered by RAG',
      'Cost-reduction tracking for developer ramp-up efficiency',
    ],
    architecture: 'Hybrid system utilizing local AST parsing and cloud-based AI to map internal project dependencies into visual mental models.',
    leadEngineers: ['Johnny Fok'],
    teamSize: '2 Engineers',
    duration: 'In Development',
    status: 'Beta/Research',
    statusColor: 'yellow',
    github: 'https://github.com/jagdteam/CodeLens',
    // devLog: Loaded dynamically from GitHub API
  },
  {
    id: 'scholarlens-ai',
    name: 'ScholarLens',
    initials: 'SL',
    tagline: 'AI-Powered Grading Assistant & Analytics',
    mediaUrl: '/favicon.ico',
    mediaType: 'image',
    description:
      'An intelligent education platform designed to reduce teacher workload by automating essay evaluation. It leverages Google Gemini LLMs to analyze PDF submissions against custom rubrics, generating instant feedback, identifying class-wide learning gaps, and visualizing grade distribution trends.',
    techStack: {
      frontend: ['React', 'TypeScript', 'TailwindCSS', 'Shadcn UI', 'Recharts', 'Lucide React'],
      backend: ['Python', 'Flask', 'Google Gemini AI', 'SQLAlchemy', 'PyPDF'],
      database: ['SQLite (Dev)', 'PostgreSQL (Prod)', 'SQLAlchemy ORM'],
      tools: ['Vite', 'Git', 'REST API', 'Axios'],
    },
    features: [
      'Automated PDF essay ingestion and text extraction',
      'LLM-based rubric scoring with specific feedback generation',
      'Interactive teacher dashboard with real-time class KPIs',
      'Visual grade distribution and weakness analysis charts',
      'Student-specific report generation (Strengths & Weaknesses)',
      'Secure REST API endpoints for frontend-backend communication',
    ],
    architecture: 'Modern Monolithic Architecture: Python Flask REST API serving a React Single Page Application (SPA)',
    leadEngineers: ['Andrew Espinosa'],
    teamSize: '4 Engineers',
    duration: '4 Weeks',
    status: 'MVP / In Development',
    statusColor: 'green',
    github: 'https://github.com/jagdteam/Education-Project',
    // devLog: Loaded dynamically from GitHub API
  },
];

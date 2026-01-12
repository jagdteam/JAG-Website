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
 * - roadmap: Fetched from Notion API via `/api/notion/roadmap`
 *   - Uses useProjectRoadmap() hook in ProjectDetails.tsx
 *
 * All dynamic data is cached until midnight PST to minimize API calls.
 */

export interface RoadmapItem {
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description?: string; // Optional - only show if you want extra detail on website
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
  teamSize: string;
  duration: string;
  status: string;
  statusColor: 'red' | 'yellow' | 'green' | 'blue';
  github?: string;
  liveDemo?: string;
  roadmap?: ProjectPhase[]; // DEPRECATED: Now loaded from Notion API
  devLog?: DevLogEntry[]; // DEPRECATED: Now loaded from GitHub API
  // Visual media support
  mediaUrl?: string;
  mediaType?: 'image' | 'gif' | 'video';
}

export const projects: Project[] = [
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
    teamSize: '4 Engineers',
    duration: '4 Weeks',
    status: 'MVP / In Development',
    statusColor: 'green',
    github: 'https://github.com/jagdteam/Education-Project',
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
      'A local-first CLI implementing Retrieval-Augmented Generation (RAG) for codebases. It features a decoupled ingestion pipeline with persistent vector storage via ChromaDB and utilizes Cohere’s Embed v3 for high-precision semantic search.',
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
    mediaUrl: '/favicon.ico',
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
    teamSize: '2 Engineers',
    duration: 'In Development',
    status: 'Beta/Research',
    statusColor: 'yellow',
    github: 'https://github.com/jagdteam/CodeLens',
    // devLog: Loaded dynamically from GitHub API
  },
  {
    id: 'clutch',
    name: 'Clutch',
    initials: 'CU',
    tagline: 'Uniting Everyone Under One Standard of Play',
    mediaUrl: '/assets/clutch.jpg',
    mediaType: 'image',
    description:
      'A mobile-first analytics platform designed to digitize and unify the game for the everyday person. Clutch replaces inconsistent manual scorekeeping with a standardized game state engine, leveraging computer vision to capture real-time performance data. We build a permanent career profile for every player, creating a universal metric of success that validates every milestone and connects people through a shared history of the game.',
    techStack: {
      frontend: ['Mobile Framework (TBD)'],
      backend: ['TBD'],
      database: ['Real-time DB (TBD)'],
      tools: ['TBD'],
      ai_cv: ['Computer Vision Libraries (TBD)'],
    },
    features: [
      'Real-time Game State Engine (Scalable)',
      'Automated shot detection & scoring',
      'Offline-first synchronization',
      'Personal stats & progression tracking',
      'Interactive "Career Mode" dashboard',
      'Community hub & pickup game coordination',
    ],
    architecture: 'TBD (Mobile-first with Edge AI inference planned)',
    teamSize: '4 Engineers',
    duration: '5 months',
    status: 'Planning',
    statusColor: 'blue',
    github: 'https://github.com/jagdteam/Clutch',
    // devLog: Loaded dynamically from GitHub API
  },
  {
    id: 'jagd-website',
    name: 'JAGD Company Website',
    initials: 'JW',
    tagline: 'Our Portfolio & Accountability Platform',
    mediaUrl: '/favicon.ico',
    mediaType: 'image',
    description:
      'A modern, high-performance company website built with React, TypeScript, and TailwindCSS. This platform showcases our projects, team, and technical capabilities while serving as a real-time accountability system. We integrated GitHub, LeetCode, and Notion APIs via Vercel serverless functions to dynamically display our contributions, coding activity, and project roadmaps—demonstrating our ability to build production-grade, data-driven applications.',
    techStack: {
      frontend: ['React', 'TypeScript', 'TailwindCSS', 'Shadcn UI', 'Framer Motion', 'Vite'],
      backend: ['Vercel Serverless Functions', 'Node.js', 'GitHub GraphQL API', 'LeetCode API', 'Notion API'],
      database: ['Server-side caching', 'Edge caching with PST midnight reset'],
      tools: ['GitHub Actions', 'Vercel', 'Git', 'REST & GraphQL APIs'],
    },
    features: [
      'Dynamic GitHub contribution graphs (5-month view with personal tokens)',
      'Real-time LeetCode activity tracking with problem breakdowns',
      'Notion-powered project roadmaps with live status updates',
      'Automated dev log generation from commit history',
      'Smart caching strategy (midnight PST reset) to minimize API calls',
      'Serverless architecture for scalable, cost-effective deployment',
      'Team member filtering for multi-contributor repositories',
      'Responsive 3D project carousel with physics-based animations',
    ],
    architecture:
      'Modern JAMstack architecture with React SPA frontend and Vercel serverless backend. Uses GitHub GraphQL API for contribution calendars, REST API for commit history, unofficial LeetCode API for coding stats, and Notion API for roadmap data. All API responses are cached server-side with automatic expiration at midnight PST to balance freshness with rate limits.',
    teamSize: '4 Engineers',
    duration: '6 Weeks (Ongoing)',
    status: 'Production / Iterating',
    statusColor: 'green',
    github: 'https://github.com/jagdteam/JAGD-Company-Website',
    liveDemo: 'https://jagd.com',
    // devLog: Loaded dynamically from GitHub API
  },
];

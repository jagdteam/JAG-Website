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
  roadmap?: ProjectPhase[];
  devLog?: DevLogEntry[];
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
    devLog: [
      {
            "id": "0875992f",
            "date": "2026-01-07",
            "type": "feature",
            "content": "added remaining files",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 4"
      },
      {
            "id": "f948fdae",
            "date": "2026-01-07",
            "type": "feature",
            "content": "feat: connect Dashboard to backend API with mock data for testing",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 4"
      },
      {
            "id": "a2148f09",
            "date": "2026-01-07",
            "type": "infra",
            "content": "updated frontend with loveable, need to redo api routing",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 4"
      },
      {
            "id": "75976e1c",
            "date": "2026-01-05",
            "type": "infra",
            "content": "Removed redundant useApi.ts and included react useQuery library",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 4"
      },
      {
            "id": "a3914d0f",
            "date": "2025-12-29",
            "type": "feature",
            "content": "Added the services folder with api functions & useApi file that mounts the useEffect operation into the desired tsx page to avoid redundant code in the tsx pages",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 3"
      },
      {
            "id": "b3023555",
            "date": "2025-12-29",
            "type": "infra",
            "content": "created frontend",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 3"
      },
      {
            "id": "5eafec20",
            "date": "2025-12-21",
            "type": "infra",
            "content": "commented main and changed server hosting",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 2"
      },
      {
            "id": "c6b7c01e",
            "date": "2025-12-21",
            "type": "infra",
            "content": "commented main and changed server hosting",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 2"
      },
      {
            "id": "4e83ab32",
            "date": "2025-12-21",
            "type": "feature",
            "content": "Added light documentation for backend db schema",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 2"
      },
      {
            "id": "eac2b0be",
            "date": "2025-12-21",
            "type": "infra",
            "content": "modified backend web view, implemented AI JSON ouput to propagate db",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 2"
      },
      {
            "id": "2d15305d",
            "date": "2025-12-20",
            "type": "infra",
            "content": "Updated daily README",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 2"
      },
      {
            "id": "29226883",
            "date": "2025-12-20",
            "type": "infra",
            "content": "Created mock backend for testing",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 2"
      },
      {
            "id": "a04c3736",
            "date": "2025-12-20",
            "type": "infra",
            "content": "Created mock backend for testing",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 2"
      },
      {
            "id": "13a792b7",
            "date": "2025-12-18",
            "type": "infra",
            "content": "Merge branch 'main' of https://github.com/jagdteam/EssayEvaluator",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "e07af3a9",
            "date": "2025-12-18",
            "type": "feature",
            "content": "Modified main.py to use regex to list students & added 1-21 student gemma test results",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "3dfb7761",
            "date": "2025-12-18",
            "type": "infra",
            "content": "Merge branch 'main' of https://github.com/jagdteam/EssayEvaluator",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "db0ba59b",
            "date": "2025-12-18",
            "type": "infra",
            "content": "updated README dev log",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "fa267692",
            "date": "2025-12-18",
            "type": "feature",
            "content": "merged johnny -> main with archived reports, essays & added the batch process main.py",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "e29e54fb",
            "date": "2025-12-18",
            "type": "infra",
            "content": "modified essay count",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "b779bc58",
            "date": "2025-12-18",
            "type": "infra",
            "content": "changed main name for merge",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "ca9c5413",
            "date": "2025-12-18",
            "type": "infra",
            "content": "separated essays to individual pdfs",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "506af845",
            "date": "2025-12-18",
            "type": "infra",
            "content": "Merge branch 'main' of https://github.com/jagdteam/EssayEvaluator",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "c1341f95",
            "date": "2025-12-18",
            "type": "infra",
            "content": "configured table of contents",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "8e3b90ec",
            "date": "2025-12-18",
            "type": "feature",
            "content": "added new set of essays & requirements.txt",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "76d7dcab",
            "date": "2025-12-18",
            "type": "infra",
            "content": "configured prereq in README",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "d1544a57",
            "date": "2025-12-18",
            "type": "infra",
            "content": "configured prereq in README",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "b54418ed",
            "date": "2025-12-18",
            "type": "infra",
            "content": "removed redundant README line",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "810562bb",
            "date": "2025-12-18",
            "type": "infra",
            "content": "updated README dev log",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "805b29fa",
            "date": "2025-12-18",
            "type": "infra",
            "content": "updated README",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "049569eb",
            "date": "2025-12-18",
            "type": "infra",
            "content": "1 api call batch process 5 students",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "597f4b2f",
            "date": "2025-12-18",
            "type": "feature",
            "content": "added batch processing for 5 students + class report",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "e368d0cf",
            "date": "2025-12-17",
            "type": "feature",
            "content": "added all student essays",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "c6532de9",
            "date": "2025-12-17",
            "type": "feature",
            "content": "added PDF functionality",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "990d4fb2",
            "date": "2025-12-17",
            "type": "feature",
            "content": "added essay and rubric functionality",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "71cfb0c5",
            "date": "2025-12-17",
            "type": "infra",
            "content": "init sandbox",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "5ade6018",
            "date": "2025-12-17",
            "type": "infra",
            "content": "Initial commit",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      }
],
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
    devLog: [
      {
            "id": "33d87176",
            "date": "2026-01-07",
            "type": "infra",
            "content": "Removed redundant file",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "9a11e867",
            "date": "2026-01-07",
            "type": "infra",
            "content": "removing redundant files",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "c4eb00d1",
            "date": "2026-01-07",
            "type": "feature",
            "content": "added 3 extra flags for RAG prompting types",
            "assignee": "Johnny Fok",
            "assigneeImg": "/assets/jf_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "2a9458b1",
            "date": "2026-01-07",
            "type": "infra",
            "content": "updated README",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      },
      {
            "id": "0e84094f",
            "date": "2026-01-07",
            "type": "infra",
            "content": "Initial commit",
            "assignee": "Giuseppi Pelayo",
            "assigneeImg": "/assets/g_pfp.jpg",
            "week": "Week 1"
      }
],
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
    devLog: [],
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
    devLog: [],
  },
];

export interface ProjectPhase {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'planned';
  date: string;
  items: string[];
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
    roadmap: [
      {
        id: 'sl-phase-1',
        name: 'Phase 1: Core Engine',
        status: 'completed',
        date: 'Oct 2024',
        items: ['PDF parsing & text extraction', 'Vector DB setup for embeddings', 'Gemini API integration', 'Base Flask server architecture'],
      },
      {
        id: 'sl-phase-2',
        name: 'Phase 2: Grading UI',
        status: 'in-progress',
        date: 'Nov 2024',
        items: ['Teacher dashboard with class overview', 'Student feedback view', 'Rubric builder interface', 'Real-time grading progress'],
      },
      {
        id: 'sl-phase-3',
        name: 'Phase 3: Analytics',
        status: 'planned',
        date: 'Dec 2024',
        items: ['Class-wide insights & trends', 'Learning gap identification', 'Export reports to PDF', 'Admin panel for school districts'],
      },
    ],
    devLog: [
      {
        id: 'sl-log-1',
        date: '2024-10-08',
        week: 'Week 1',
        type: 'infra',
        content: 'Set up Flask server with PostgreSQL connection, configured SQLAlchemy ORM with initial schema for essays and rubrics.',
        assignee: 'Giuseppi',
        assigneeImg: '/assets/g_jagd.jpg',
      },
      {
        id: 'sl-log-2',
        date: '2024-10-12',
        week: 'Week 1',
        type: 'feature',
        content: 'Implemented PDF upload endpoint with PyPDF text extraction, storing parsed content in vector DB.',
        assignee: 'Johnny',
        assigneeImg: '/assets/jf_pfp.jpg',
      },
      {
        id: 'sl-log-3',
        date: '2024-10-18',
        week: 'Week 2',
        type: 'feature',
        content: 'Built the React grading component with rubric selection, live preview, and submission handling.',
        assignee: 'Andrew',
      },
      {
        id: 'sl-log-4',
        date: '2024-10-22',
        week: 'Week 2',
        type: 'fix',
        content: 'Resolved Gemini API rate limit issues by implementing exponential backoff and request queuing.',
        assignee: 'Johnny',
        assigneeImg: '/assets/jf_pfp.jpg',
      },
      {
        id: 'sl-log-5',
        date: '2024-10-28',
        week: 'Week 3',
        type: 'design',
        content: 'Designed and implemented the teacher dashboard layout with Recharts for grade distribution visualization.',
        assignee: 'Dylan',
      },
    ],
  },
  {
    id: 'clicr-cli',
    name: 'CliCR',
    initials: 'CR',
    tagline: 'Command Line Interface Code Reader',
    mediaUrl: '/assets/g_pfp.jpg',
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
    roadmap: [
      {
        id: 'cl-phase-1',
        name: 'Phase 1: Core Ingestion',
        status: 'completed',
        date: 'Dec 2025',
        items: [
          'Recursive file walking directory logic',
          'Text chunking strategy (500 chars)',
          'ChromaDB local persistence setup',
          'CLI scaffolding with Typer',
        ],
      },
      {
        id: 'cl-phase-2',
        name: 'Phase 2: RAG Pipeline',
        status: 'completed',
        date: 'Jan 2026',
        items: ['Cohere Embed v3 integration', 'Vector search retrieval logic', 'Command R+ response generation', 'Citation mapping'],
      },
      {
        id: 'cl-phase-3',
        name: 'Phase 3: Optimization',
        status: 'in-progress',
        date: 'Jan 2026',
        items: ['Incremental update logic (MD5 hashing)', 'Session export features', 'Rich TUI enhancements', 'Performance benchmarking'],
      },
    ],
    devLog: [
      {
        id: 'cl-log-1',
        date: '2025-12-15',
        week: 'Week 1',
        type: 'infra',
        content: 'Technical Spike: Selected Cohere over OpenAI for better RAG citation support. Initialized ChromaDB schema.',
        assignee: 'Giuseppi',
        assigneeImg: '/assets/g_jagd.jpg',
      },
      {
        id: 'cl-log-2',
        date: '2025-12-22',
        week: 'Week 1',
        type: 'feature',
        content: 'Built the ingestion engine. Solved edge cases with non-UTF8 files and implemented the chunking overlap strategy.',
        assignee: 'Johnny',
        assigneeImg: '/assets/jf_pfp.jpg',
      },
      {
        id: 'cl-log-3',
        date: '2025-12-29',
        week: 'Week 1',
        type: 'feature',
        content: 'Implemented the file hashing system. Reduced re-indexing time from 40s to <2s for minor code changes.',
        assignee: 'Giuseppi',
        assigneeImg: '/assets/g_jagd.jpg',
      },
    ],
  },
  {
    id: 'codelens',
    name: 'CodeLens',
    initials: 'CL',
    tagline: 'AI-Powered Visual Abstraction for Engineering Teams',
    mediaUrl: '/assets/jf_pfp.jpg',
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
    roadmap: [
      {
        id: 'cl-phase-1',
        name: 'Phase 1: VS Code Extension',
        status: 'completed',
        date: 'Sep 2024',
        items: ['Basic sidebar rendering', 'Extension activation & lifecycle', 'VS Code API integration', 'Initial UI scaffolding'],
      },
      {
        id: 'cl-phase-2',
        name: 'Phase 2: Context Awareness',
        status: 'in-progress',
        date: 'Oct 2024',
        items: ['Tree-sitter AST parsing', 'Function dependency mapping', 'Symbol extraction & indexing', 'Real-time code analysis'],
      },
      {
        id: 'cl-phase-3',
        name: 'Phase 3: AI Integration',
        status: 'planned',
        date: 'Nov 2024',
        items: ['LLM-powered code summarization', 'RAG-based onboarding flows', 'Automated diagram generation', 'Team knowledge base sync'],
      },
    ],
    devLog: [
      {
        id: 'cl-log-1',
        date: '2024-09-15',
        week: 'Week 1',
        type: 'infra',
        content: 'Research spike: Evaluated Tree-sitter vs Babel for AST parsing. Tree-sitter selected for multi-language support.',
        assignee: 'Giuseppi',
        assigneeImg: '/assets/g_jagd.jpg',
      },
      {
        id: 'cl-log-2',
        date: '2024-09-22',
        week: 'Week 2',
        type: 'design',
        content: 'Architected the extension structure: separated core parsing logic from VS Code-specific rendering layer.',
        assignee: 'Dylan',
      },
      {
        id: 'cl-log-3',
        date: '2024-10-01',
        week: 'Week 3',
        type: 'feature',
        content: 'Implemented initial sidebar panel with collapsible function tree view and basic navigation.',
        assignee: 'Giuseppi',
        assigneeImg: '/assets/g_jagd.jpg',
      },
    ],
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
    roadmap: [
      {
        id: 'clutch-phase-1',
        name: 'Phase 1: Early Research & Feasibility',
        status: 'in-progress',
        date: 'Jan 2026',
        items: ['User research & interviews', 'Competitive analysis', 'Core feature prioritization', 'Technical feasibility study'],
      },
      {
        id: 'clutch-phase-2',
        name: 'Phase 2: Computer Vision Research & Implementation',
        status: 'planned',
        date: 'Feb 2026',
        items: ['Computer Vision research', 'Implementation of computer vision', 'Prototype for user testing', 'Design review & iteration'],
      },
      {
        id: 'clutch-phase-3',
        name: 'Phase 3: MVP Development',
        status: 'planned',
        date: 'March 2026',
        items: ['Mobile app scaffolding', 'Game state engine core', 'Basic CV integration', 'Alpha testing'],
      },
    ],
    devLog: [
      {
        id: 'clutch-log-1',
        date: '01-06-2026',
        week: 'Week 1',
        type: 'design',
        content: 'Test camera angles, boundaries, and lighting conditions for computer vision.',
        assignee: 'Giuseppi',
        assigneeImg: '/assets/g_jagd.jpg',
      },
      {
        id: 'clutch-log-1',
        date: '01-07-2026',
        week: 'Week 1',
        type: 'design',
        content:
          'Discuss setup and tech stack selection and technical constraints. Evaluating React Native vs Flutter for cross-platform development.',
        assignee: 'Giuseppi Pelayo',
        assigneeImg: '/assets/g_jagd.jpg',
      },
    ],
  },
];

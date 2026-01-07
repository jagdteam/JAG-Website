export interface Project {
  id: string;
  name: string;
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
}

// You can easily reorder projects here by changing their position in the array
export const projects: Project[] = [
  {
    id: 'scholarlens-ai',
    name: 'ScholarLens',
    tagline: 'AI-Powered Grading Assistant & Analytics',
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
  },
  {
    id: 'codelens-hud',
    name: 'CodeLens HUD',
    tagline: 'AI-Powered Visual Abstraction for Engineering Teams',
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
  },
  {
    id: 'clutch-sports',
    name: 'Clutch',
    tagline: 'Uniting Everyone Under One Standard of Play',
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
    statusColor: 'yellow',
  },
];

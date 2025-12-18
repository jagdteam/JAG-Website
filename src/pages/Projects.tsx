import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    tools: string[];
  };
  features: string[];
  architecture: string;
  teamSize: string;
  duration: string;
  status: string;
  github?: string;
  liveDemo?: string;
}

const projects: Project[] = [
  {
    id: "intelligent-systems",
    name: "Intelligent Systems",
    tagline: "AI-Powered Analytics Platform",
    description:
      "A comprehensive machine learning platform designed to transform how businesses analyze data and make decisions. Features real-time predictive analytics, natural language processing, and automated insights generation.",
    techStack: {
      frontend: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
      backend: ["Python", "FastAPI", "TensorFlow", "PyTorch"],
      database: ["PostgreSQL", "Redis", "Elasticsearch"],
      tools: ["Docker", "Kubernetes", "AWS", "GitHub Actions"],
    },
    features: [
      "Real-time data streaming and processing",
      "Custom ML model training pipeline",
      "Interactive dashboard with D3.js visualizations",
      "REST & GraphQL API endpoints",
      "Role-based access control",
      "Automated report generation",
    ],
    architecture: "Microservices architecture with event-driven communication using Apache Kafka",
    teamSize: "4 Engineers",
    duration: "6 months",
    status: "In Production",
  },
  {
    id: "cloud-infrastructure",
    name: "Cloud Infrastructure",
    tagline: "Enterprise-Grade Cloud Solutions",
    description:
      "A scalable cloud infrastructure management platform that provides automated provisioning, monitoring, and optimization of cloud resources across multiple providers.",
    techStack: {
      frontend: ["Next.js", "TypeScript", "Radix UI", "Zustand"],
      backend: ["Go", "gRPC", "Terraform", "Pulumi"],
      database: ["MongoDB", "InfluxDB", "etcd"],
      tools: ["AWS", "GCP", "Azure", "Prometheus", "Grafana"],
    },
    features: [
      "Multi-cloud resource management",
      "Infrastructure as Code templates",
      "Cost optimization recommendations",
      "Real-time monitoring & alerting",
      "Automated scaling policies",
      "Security compliance scanning",
    ],
    architecture: "Distributed system with leader election and consensus using Raft protocol",
    teamSize: "4 Engineers",
    duration: "8 months",
    status: "Beta",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    tagline: "Built for Engineers",
    description:
      "A suite of developer productivity tools including an intelligent code editor, automated testing framework, and collaborative development environment.",
    techStack: {
      frontend: ["Electron", "React", "Monaco Editor", "WebSockets"],
      backend: ["Node.js", "Rust", "WebAssembly"],
      database: ["SQLite", "LevelDB"],
      tools: ["LSP", "Tree-sitter", "Git", "npm/pnpm"],
    },
    features: [
      "Intelligent code completion with AI",
      "Real-time collaborative editing",
      "Integrated debugging & profiling",
      "Custom plugin architecture",
      "Git workflow integration",
      "Performance benchmarking tools",
    ],
    architecture: "Plugin-based architecture with sandboxed execution environments",
    teamSize: "4 Engineers",
    duration: "10 months",
    status: "Alpha",
  },
];

const SpecRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 py-8 border-b border-border/30">
    <h3 className="text-lg font-semibold text-foreground">{label}</h3>
    <div className="text-muted-foreground">{children}</div>
  </div>
);

const TechStackSection = ({ techStack }: { techStack: Project["techStack"] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    <div>
      <h4 className="text-sm font-medium text-primary mb-3">Frontend</h4>
      <ul className="space-y-1">
        {techStack.frontend.map((tech) => (
          <li key={tech} className="text-foreground">{tech}</li>
        ))}
      </ul>
    </div>
    <div>
      <h4 className="text-sm font-medium text-primary mb-3">Backend</h4>
      <ul className="space-y-1">
        {techStack.backend.map((tech) => (
          <li key={tech} className="text-foreground">{tech}</li>
        ))}
      </ul>
    </div>
    <div>
      <h4 className="text-sm font-medium text-primary mb-3">Database</h4>
      <ul className="space-y-1">
        {techStack.database.map((tech) => (
          <li key={tech} className="text-foreground">{tech}</li>
        ))}
      </ul>
    </div>
    <div>
      <h4 className="text-sm font-medium text-primary mb-3">Tools & DevOps</h4>
      <ul className="space-y-1">
        {techStack.tools.map((tech) => (
          <li key={tech} className="text-foreground">{tech}</li>
        ))}
      </ul>
    </div>
  </div>
);

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(0);
  const project = projects[selectedProject];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <span className="text-lg font-semibold">Projects</span>
          <div className="flex items-center gap-6 text-sm">
            <a href="#specs" className="text-primary">Tech Specs</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        {/* Project Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-card/50 rounded-full p-1 border border-border/30">
            {projects.map((p, index) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(index)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedProject === index
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Project Header */}
        <div className="text-center mb-16 px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
            {project.name}
          </h1>
          <p className="text-xl text-muted-foreground">{project.tagline}</p>
        </div>

        {/* Project Visual */}
        <div className="flex justify-center mb-16 px-6">
          <div className="w-full max-w-2xl aspect-video bg-gradient-to-br from-primary/20 via-background to-primary/10 rounded-2xl border border-border/30 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary/30">
              {project.name.split(" ").map(w => w[0]).join("")}
            </div>
          </div>
        </div>

        {/* Specs Section */}
        <section id="specs" className="max-w-4xl mx-auto px-6">
          <SpecRow label="Overview">
            <p className="text-lg leading-relaxed">{project.description}</p>
          </SpecRow>

          <SpecRow label="Tech Stack">
            <TechStackSection techStack={project.techStack} />
          </SpecRow>

          <SpecRow label="Architecture">
            <p className="text-lg">{project.architecture}</p>
          </SpecRow>

          <section id="features">
            <SpecRow label="Key Features">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </SpecRow>
          </section>

          <SpecRow label="Team Size">
            <p className="text-lg">{project.teamSize}</p>
          </SpecRow>

          <SpecRow label="Development Duration">
            <p className="text-lg">{project.duration}</p>
          </SpecRow>

          <SpecRow label="Status">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              project.status === "In Production"
                ? "bg-green-500/20 text-green-400"
                : project.status === "Beta"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-blue-500/20 text-blue-400"
            }`}>
              {project.status}
            </span>
          </SpecRow>
        </section>

        {/* CTA */}
        <div className="text-center mt-16 px-6">
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 JAGD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Projects;

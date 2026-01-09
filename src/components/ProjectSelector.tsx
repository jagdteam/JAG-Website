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

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: number;
  onSelectProject: (index: number) => void;
}

const ProjectSelector = ({ projects, selectedProject, onSelectProject }: ProjectSelectorProps) => {
  return (
    <div className="flex justify-center mb-12 w-full">
      <div className="inline-flex bg-card/50 rounded-full p-1 border border-border/30">
        {projects.map((p, index) => (
          <button
            key={p.id}
            onClick={() => onSelectProject(index)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedProject === index ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectSelector;

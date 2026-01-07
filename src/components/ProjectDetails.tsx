import { Link } from 'react-router-dom';

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

interface ProjectDetailsProps {
  project: Project;
}

const SpecRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 py-8 border-b border-border/30">
    <h3 className="text-lg font-semibold text-foreground">{label}</h3>
    <div className="text-muted-foreground">{children}</div>
  </div>
);

const TechStackSection = ({ techStack }: { techStack: Project['techStack'] }) => {
  const sections = [
    { title: 'Frontend', items: techStack.frontend },
    { title: 'Backend', items: techStack.backend },
    { title: 'Database', items: techStack.database },
    { title: 'Tools & DevOps', items: techStack.tools },
  ];

  if (techStack.ai_cv && techStack.ai_cv.length > 0) {
    sections.push({ title: 'AI/Computer Vision', items: techStack.ai_cv });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="text-sm font-medium text-primary mb-3">{section.title}</h4>
          <ul className="space-y-1">
            {section.items.map((tech) => (
              <li key={tech} className="text-foreground">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const getStatusColorClasses = (color: Project['statusColor']) => {
  const colorMap = {
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
    red: 'bg-red-500/20 text-red-400',
  };
  return colorMap[color];
};

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  return (
    <>
      {/* Project Header */}
      <div className="text-center mb-16 px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">{project.name}</h1>
        <p className="text-xl text-muted-foreground">{project.tagline}</p>
      </div>

      {/* Project Visual */}
      <div className="flex justify-center mb-16 px-6">
        <div className="w-full max-w-2xl aspect-video bg-gradient-to-br from-primary/20 via-background to-primary/10 rounded-2xl border border-border/30 flex items-center justify-center">
          <div className="text-6xl font-bold text-primary/30">
            {project.name
              .split(' ')
              .map((w) => w[0])
              .join('')}
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
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClasses(project.statusColor)}`}>
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
    </>
  );
};

export default ProjectDetails;


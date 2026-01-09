import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DevLogEntry, Project, ProjectPhase } from '@/data/projects';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Clock, Paintbrush, Server, Sparkles, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              <li
                key={tech}
                className="text-foreground"
              >
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

const getPhaseStatusColor = (status: ProjectPhase['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'in-progress':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'planned':
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getPhaseProgress = (status: ProjectPhase['status']) => {
  switch (status) {
    case 'completed':
      return 100;
    case 'in-progress':
      return 50;
    case 'planned':
      return 0;
  }
};

const getDevLogTypeIcon = (type: DevLogEntry['type']) => {
  switch (type) {
    case 'feature':
      return <Sparkles className="w-3 h-3" />;
    case 'fix':
      return <Wrench className="w-3 h-3" />;
    case 'design':
      return <Paintbrush className="w-3 h-3" />;
    case 'infra':
      return <Server className="w-3 h-3" />;
  }
};

const getDevLogTypeBadge = (type: DevLogEntry['type']) => {
  const styles = {
    feature: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    fix: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    design: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    infra: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };
  const labels = {
    feature: 'Feature',
    fix: 'Fix',
    design: 'Design',
    infra: 'Infra',
  };
  return (
    <Badge
      variant="outline"
      className={`${styles[type]} text-xs gap-1`}
    >
      {getDevLogTypeIcon(type)}
      {labels[type]}
    </Badge>
  );
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Overview Tab Content
const OverviewTab = ({ project }: { project: Project }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <SpecRow label="Overview">
      <p className="text-lg leading-relaxed">{project.description}</p>
    </SpecRow>

    <SpecRow label="Tech Stack">
      <TechStackSection techStack={project.techStack} />
    </SpecRow>

    <SpecRow label="Architecture">
      <p className="text-lg">{project.architecture}</p>
    </SpecRow>

    <SpecRow label="Key Features">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {project.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-2"
          >
            <span className="text-primary mt-1">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </SpecRow>

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
  </motion.div>
);

// Roadmap Tab Content
const RoadmapTab = ({ roadmap }: { roadmap?: ProjectPhase[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="space-y-6 py-8"
  >
    {!roadmap || roadmap.length === 0 ? (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Roadmap coming soon</p>
      </div>
    ) : (
      roadmap.map((phase, index) => (
        <motion.div
          key={phase.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-card/50 border border-border/50 rounded-xl p-6 hover:border-border transition-colors"
        >
          {/* Phase Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">{phase.name}</h3>
              <Badge
                variant="outline"
                className={getPhaseStatusColor(phase.status)}
              >
                {phase.status === 'completed' && 'Completed'}
                {phase.status === 'in-progress' && 'In Progress'}
                {phase.status === 'planned' && 'Planned'}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">{phase.date}</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress
              value={getPhaseProgress(phase.status)}
              className="h-1.5"
            />
          </div>

          {/* Phase Items */}
          <ul className="space-y-2">
            {phase.items.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="flex items-start gap-3 text-sm"
              >
                {phase.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <CircleDashed className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <span className={phase.status === 'completed' ? 'text-muted-foreground' : 'text-foreground'}>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))
    )}
  </motion.div>
);

// Dev Log Tab Content
const DevLogTab = ({ devLog }: { devLog?: DevLogEntry[] }) => {
  if (!devLog || devLog.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="text-center py-12 text-muted-foreground"
      >
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Development log coming soon</p>
      </motion.div>
    );
  }

  // Group entries by week
  const groupedByWeek = devLog.reduce((acc, entry) => {
    if (!acc[entry.week]) {
      acc[entry.week] = [];
    }
    acc[entry.week].push(entry);
    return acc;
  }, {} as Record<string, DevLogEntry[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="py-8"
    >
      {Object.entries(groupedByWeek).map(([week, entries], weekIndex) => (
        <div
          key={week}
          className="mb-8 last:mb-0"
        >
          {/* Week Header */}
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{week}</h3>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            {/* Entries */}
            <div className="space-y-4">
              {entries.map((entry, entryIndex) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: weekIndex * 0.1 + entryIndex * 0.05 }}
                  className="relative flex gap-4 pl-0"
                >
                  {/* Avatar */}
                  <div className="relative z-10 flex-shrink-0">
                    <Avatar className="w-8 h-8 border-2 border-background">
                      <AvatarImage
                        src={entry.assigneeImg}
                        alt={entry.assignee}
                      />
                      <AvatarFallback className="text-xs bg-muted">{getInitials(entry.assignee)}</AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-card/30 border border-border/30 rounded-lg p-4 hover:border-border/60 transition-colors">
                    {/* Top row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-medium text-foreground text-sm">{entry.assignee}</span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">{entry.date}</span>
                      {getDevLogTypeBadge(entry.type)}
                    </div>

                    {/* Content */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
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
      <div className="flex justify-center mb-12 px-6">
        <div className="w-full max-w-2xl aspect-video bg-gradient-to-br from-primary/20 via-background to-primary/10 rounded-2xl border border-border/30 flex items-center justify-center overflow-hidden">
          {project.mediaUrl && project.mediaType ? (
            <>
              {project.mediaType === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                >
                  <source
                    src={project.mediaUrl}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <img
                  src={project.mediaUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </>
          ) : (
            <div className="text-6xl font-bold text-primary/30">
              {project.initials ||
                project.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
            </div>
          )}
        </div>
      </div>

      {/* Tabbed Dashboard */}
      <section className="max-w-4xl mx-auto px-6">
        <Tabs
          defaultValue="overview"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="roadmap"
              className="data-[state=active]:bg-background"
            >
              Roadmap
            </TabsTrigger>
            <TabsTrigger
              value="devlog"
              className="data-[state=active]:bg-background"
            >
              Dev Log
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent
              value="overview"
              className="mt-0"
            >
              <OverviewTab project={project} />
            </TabsContent>

            <TabsContent
              value="roadmap"
              className="mt-0"
            >
              <RoadmapTab roadmap={project.roadmap} />
            </TabsContent>

            <TabsContent
              value="devlog"
              className="mt-0"
            >
              <DevLogTab devLog={project.devLog} />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
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

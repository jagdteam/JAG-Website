import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DevLogEntry, Project, Sprint } from '@/data/projects';
import { useProjectCommits } from '@/hooks/useProjectCommits';
import { useProjectRoadmap } from '@/hooks/useProjectRoadmap';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Clock, Loader2, Paintbrush, Server, Sparkles, Wrench } from 'lucide-react';
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

// const getPhaseStatusColor = (status: ProjectPhase['status']) => {
//   switch (status) {
//     case 'completed':
//       return 'bg-green-500/20 text-green-400 border-green-500/30';
//     case 'in-progress':
//       return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
//     case 'planned':
//       return 'bg-muted text-muted-foreground border-border';
//   }
// };

// const getPhaseProgress = (status: ProjectPhase['status']) => {
//   switch (status) {
//     case 'completed':
//       return 100;
//     case 'in-progress':
//       return 50;
//     case 'planned':
//       return 0;
//   }
// };

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

    {project.leadEngineers && project.leadEngineers.length > 0 && (
      <SpecRow label="Lead Engineer">
        <p className="text-lg">{project.leadEngineers.join(' & ')}</p>
      </SpecRow>
    )}

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

// Helper functions for roadmap status
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case 'in-progress':
      return <Clock className="w-4 h-4 text-yellow-400" />;
    default:
      return <CircleDashed className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'in-progress':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const calculateSprintProgress = (sprint: Sprint) => {
  if (!sprint.epics || sprint.epics.length === 0) return 0;

  const allTickets = sprint.epics.flatMap((epic) => epic.tickets || []);
  if (allTickets.length === 0) return 0;

  const completedTickets = allTickets.filter((t) => t.status === 'completed').length;
  return Math.round((completedTickets / allTickets.length) * 100);
};

// Roadmap Tab Content - New Sprint/Epic/Ticket Structure
const RoadmapTab = ({ roadmap }: { roadmap?: Sprint[] }) => (
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
      roadmap.map((sprint, index) => (
        <motion.div
          key={sprint.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-card/50 border border-border/50 rounded-xl p-6 hover:border-border transition-colors"
        >
          {/* Sprint Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">{sprint.name}</h3>
              <Badge
                variant="outline"
                className={getStatusBadgeClass(sprint.status)}
              >
                {sprint.status === 'completed' && 'Completed'}
                {sprint.status === 'in-progress' && 'In Progress'}
                {sprint.status === 'not-started' && 'Not Started'}
              </Badge>
            </div>
            {sprint.startDate && sprint.endDate && (
              <span className="text-sm text-muted-foreground">
                {new Date(sprint.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                {new Date(sprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs text-muted-foreground">{calculateSprintProgress(sprint)}%</span>
            </div>
            <Progress
              value={calculateSprintProgress(sprint)}
              className="h-1.5"
            />
          </div>

          {/* Epics - Collapsible */}
          {sprint.epics && sprint.epics.length > 0 ? (
            <Accordion
              type="multiple"
              className="space-y-3"
            >
              {sprint.epics.map((epic, epicIndex) => (
                <AccordionItem
                  key={epic.id}
                  value={epic.id}
                  className="border border-border/30 rounded-lg px-4 bg-background/30"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 text-left flex-1">
                      {getStatusIcon(epic.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-medium ${epic.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {epic.name || `Epic ${epicIndex + 1}`}
                          </span>
                          {epic.priority && (
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {epic.priority}
                            </Badge>
                          )}
                        </div>
                        {epic.description && <p className="text-xs text-muted-foreground mt-1">{epic.description}</p>}
                      </div>
                      {epic.tickets && epic.tickets.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {epic.tickets.filter((t) => t.status === 'completed').length}/{epic.tickets.length} tasks
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 pt-2">
                    {epic.tickets && epic.tickets.length > 0 ? (
                      <ul className="space-y-2 pl-7">
                        {epic.tickets.map((ticket) => (
                          <li
                            key={ticket.id}
                            className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors"
                          >
                            {getStatusIcon(ticket.status)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-sm ${ticket.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                                >
                                  {ticket.name || 'Untitled Ticket'}
                                </span>
                                {ticket.storyPoints && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {ticket.storyPoints} pts
                                  </Badge>
                                )}
                                {ticket.assignees &&
                                  ticket.assignees.length > 0 &&
                                  ticket.assignees.map((assignee, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {assignee}
                                    </Badge>
                                  ))}
                              </div>
                              {ticket.description && <p className="text-xs text-muted-foreground mt-1">{ticket.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground pl-7">No tickets yet</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No epics defined for this sprint</p>
          )}
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

  // Calculate type counts for summary badges
  const typeCounts = devLog.reduce((acc, commit) => {
    acc[commit.type] = (acc[commit.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group entries by week
  const groupedByWeek = devLog.reduce((acc, entry) => {
    if (!acc[entry.week]) {
      acc[entry.week] = [];
    }
    acc[entry.week].push(entry);
    return acc;
  }, {} as Record<string, DevLogEntry[]>);

  // Sort weeks in chronological order (most recent first: This Week, Week 4, Week 3, Week 2, Week 1)
  const sortedWeeks = Object.entries(groupedByWeek).sort(([weekA], [weekB]) => {
    // Handle "This Week" special case - it should come first
    if (weekA === 'This Week') return -1;
    if (weekB === 'This Week') return 1;

    // Extract week numbers and sort in descending order (Week 4 before Week 1)
    const numA = parseInt(weekA.match(/\d+/)?.[0] || '0');
    const numB = parseInt(weekB.match(/\d+/)?.[0] || '0');
    return numB - numA;
  });

  // Get the first (most recent) week as default open
  const mostRecentWeek = sortedWeeks[0]?.[0] || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="py-8"
    >
      {/* Summary Badges */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {Object.entries(typeCounts).map(([type, count]) => (
          <Badge
            key={type}
            variant="outline"
            className={`text-xs px-3 py-1 gap-1.5 ${
              type === 'feature'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                : type === 'fix'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                : type === 'design'
                ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
            }`}
          >
            {getDevLogTypeIcon(type as DevLogEntry['type'])}
            {type.charAt(0).toUpperCase() + type.slice(1)} | {count}
          </Badge>
        ))}
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1"
        >
          ✅ {devLog.length} Total
        </Badge>
      </div>

      <Accordion
        type="multiple"
        defaultValue={[mostRecentWeek]}
        className="space-y-6"
      >
        {sortedWeeks.map(([week, entries]) => (
          <AccordionItem
            key={week}
            value={week}
            className="border-none"
          >
            <AccordionTrigger className="hover:no-underline pb-0">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{week}</h3>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
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
                      transition={{ duration: 0.2, delay: entryIndex * 0.05 }}
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
                          <span className="text-muted-foreground text-xs">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                          </span>
                          {getDevLogTypeBadge(entry.type)}
                        </div>

                        {/* Content */}
                        <p className="text-sm text-muted-foreground leading-relaxed">{entry.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
};

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  // Fetch roadmap data from Notion
  const { roadmap, loading: roadmapLoading, error: roadmapError } = useProjectRoadmap(project);

  // Extract repo slug from GitHub URL (e.g., "https://github.com/jagdteam/clicr" -> "jagdteam/clicr")
  const getRepoSlug = (githubUrl?: string): string | undefined => {
    if (!githubUrl) return undefined;
    const match = githubUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    return match ? match[1] : undefined;
  };

  const repoSlug = getRepoSlug(project.github);

  // Fetch commits for this project
  const { commits, loading: commitsLoading, error: commitsError } = useProjectCommits(repoSlug);

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
              {roadmapLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Loading roadmap from Notion...</span>
                </div>
              ) : roadmapError ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Unable to load roadmap</p>
                  <p className="text-sm mt-2">{roadmapError}</p>
                </div>
              ) : (
                <RoadmapTab roadmap={roadmap} />
              )}
            </TabsContent>

            <TabsContent
              value="devlog"
              className="mt-0"
            >
              {commitsLoading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Loading commit history...</span>
                </div>
              ) : commitsError ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Unable to load commit history</p>
                  <p className="text-sm mt-2">{commitsError}</p>
                </div>
              ) : (
                <DevLogTab devLog={commits} />
              )}
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

/**
 * AccountabilitySection Component
 * Displays the dev log and technical overview for the JAGD Company Website project
 * Shows how we integrated Notion, GitHub, and LeetCode APIs via Vercel
 */

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { DevLogEntry } from '@/data/projects';
import { useProjectCommits } from '@/hooks/useProjectCommits';
import { Globe, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const WEBSITE_REPO = 'jagdteam/JAGD-Company-Website';

// Logo components with brand colors
const GitHubLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="#ffffff"
      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
    />
  </svg>
);

const LeetCodeLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="#FFA116"
      d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"
    />
  </svg>
);

const NotionLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="#ffffff"
      d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"
    />
  </svg>
);

const VercelLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="#ffffff"
      d="M12 0L24 24H0L12 0z"
    />
  </svg>
);

const integrations = [
  {
    Logo: GitHubLogo,
    name: 'GitHub API',
    description: 'GraphQL & REST APIs for contributions and commits',
    features: ['Contribution calendars', 'Commit history', 'Team filtering'],
  },
  {
    Logo: LeetCodeLogo,
    name: 'LeetCode API',
    description: 'Unofficial API for coding activity tracking',
    features: ['Problem counts', 'Submission calendar', 'Difficulty breakdown'],
  },
  {
    Logo: NotionLogo,
    name: 'Notion API',
    description: 'Project roadmap & task management',
    features: ['Live roadmaps', 'Status tracking', 'Phase management'],
  },
  {
    Logo: VercelLogo,
    name: 'Vercel Serverless',
    description: 'Edge functions with smart caching',
    features: ['Midnight PST reset', 'Rate limit protection', 'Global CDN'],
  },
];

const getTypeIcon = (type: DevLogEntry['type']) => {
  switch (type) {
    case 'feature':
      return '✨';
    case 'fix':
      return '🐛';
    case 'design':
      return '🎨';
    case 'infra':
      return '🔧';
  }
};

const getTypeBadgeClass = (type: DevLogEntry['type']) => {
  switch (type) {
    case 'feature':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'fix':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'design':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'infra':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  }
};

const DevLogTab = ({ devLog }: { devLog?: DevLogEntry[] }) => {
  if (!devLog || devLog.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No dev log entries yet. Start contributing to see your progress here!</p>
      </div>
    );
  }

  // Group by week (Week 4 = most recent)
  const groupedByWeek = devLog.reduce((acc, entry) => {
    if (!acc[entry.week]) {
      acc[entry.week] = [];
    }
    acc[entry.week].push(entry);
    return acc;
  }, {} as Record<string, DevLogEntry[]>);

  // Sort weeks in descending order (Week 4 -> Week 3 -> Week 2 -> Week 1)
  const sortedWeeks = Object.entries(groupedByWeek).sort(([a], [b]) => b.localeCompare(a));

  // Group entries within each week by type
  const groupByType = (entries: DevLogEntry[]) => {
    return entries.reduce((acc, entry) => {
      if (!acc[entry.type]) {
        acc[entry.type] = [];
      }
      acc[entry.type].push(entry);
      return acc;
    }, {} as Record<DevLogEntry['type'], DevLogEntry[]>);
  };

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        className="space-y-3"
      >
        {sortedWeeks.map(([week, entries]) => {
          const groupedByType = groupByType(entries);
          return (
            <AccordionItem
              key={week}
              value={week}
              className="border border-border/50 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {week.replace('Week ', '')}
                    </div>
                    <div className="text-left">
                      <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{week}</h4>
                      <p className="text-xs text-muted-foreground">{entries.length} commits</p>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    {Object.entries(groupedByType).map(([type, typeEntries]) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className={`${getTypeBadgeClass(type as DevLogEntry['type'])} text-xs px-2 py-0.5`}
                      >
                        {getTypeIcon(type as DevLogEntry['type'])} {typeEntries.length}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6 pt-4">
                  {Object.entries(groupedByType).map(([type, typeEntries]) => (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{getTypeIcon(type as DevLogEntry['type'])}</span>
                        <h5 className="text-sm font-medium text-foreground capitalize">{type}</h5>
                        <div className="flex-1 h-px bg-border/30 ml-2" />
                      </div>
                      <ul className="space-y-2">
                        {typeEntries.map((entry) => (
                          <li
                            key={entry.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/20 hover:border-border/40 transition-colors"
                          >
                            <Avatar className="w-7 h-7 mt-0.5">
                              <AvatarImage src={entry.assigneeImg} />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {entry.assignee
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground/90 leading-relaxed">{entry.content}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-muted-foreground">{entry.assignee}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{entry.date}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

const AccountabilitySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { commits, loading, error } = useProjectCommits(WEBSITE_REPO);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="accountability"
      className="relative min-h-screen py-32 px-6 overflow-hidden bg-background"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium tracking-widest uppercase">Building with Intent</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">Accountability Through Code</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            This website isn't just our portfolio, it's proof of our process. Every commit and integration is tracked and displayed below.
          </p>
          <p className="text-base text-muted-foreground/80 max-w-2xl mx-auto">
            We've built a live accountability system integrating <span className="text-primary font-medium">GitHub</span>,{' '}
            <span className="text-primary font-medium">LeetCode</span>, and <span className="text-primary font-medium">Notion APIs</span> via Vercel
            serverless functions.
          </p>
        </div>

        {/* Integration Logos Marquee */}
        <div
          className={`relative mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="relative overflow-hidden py-8">
            {/* Gradient overlays for seamless loop effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

            {/* Scrolling container */}
            <div
              className="flex gap-12 scroll-container"
              style={{
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* First set of logos */}
              {integrations.map((integration, idx) => (
                <div
                  key={`first-${idx}`}
                  className="flex flex-col gap-2 flex-shrink-0 group cursor-pointer max-w-[220px]"
                >
                  <div className="flex items-center gap-3 justify-center">
                    <div className="h-6 w-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <integration.Logo className="w-full h-full" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground whitespace-nowrap">{integration.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed text-center">{integration.description}</p>
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {integrations.map((integration, idx) => (
                <div
                  key={`second-${idx}`}
                  className="flex flex-col gap-2 flex-shrink-0 group cursor-pointer max-w-[220px]"
                >
                  <div className="flex items-center gap-3 justify-center">
                    <div className="h-6 w-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <integration.Logo className="w-full h-full" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground whitespace-nowrap">{integration.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed text-center">{integration.description}</p>
                </div>
              ))}

              {/* Third set for seamless loop */}
              {integrations.map((integration, idx) => (
                <div
                  key={`third-${idx}`}
                  className="flex flex-col gap-2 flex-shrink-0 group cursor-pointer max-w-[220px]"
                >
                  <div className="flex items-center gap-3 justify-center">
                    <div className="h-6 w-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <integration.Logo className="w-full h-full" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground whitespace-nowrap">{integration.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed text-center">{integration.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Integrated via Vercel serverless functions with smart caching. All data is fetched server-side, cached until midnight PST, and updated
            automatically.
          </p>
        </div>

        {/* Add animation keyframes */}
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 3));
            }
          }

          .scroll-container {
            animation: scroll 40s linear infinite;
            transition: animation-play-state 0.5s ease;
          }
        `}</style>

        {/* Dev Log Section */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">Development Log</h3>
              <p className="text-sm text-muted-foreground">
                Real-time commit history from <span className="font-mono text-primary">jagdteam/JAGD-Company-Website</span>
              </p>
            </div>
            {!loading && !error && commits.length > 0 && (
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1"
              >
                ✅ {commits.length} commits tracked
              </Badge>
            )}
          </div>

          {/* Dev Log Content */}
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Loading dev log from GitHub...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-16">
                <p className="text-red-400 mb-2">Failed to load dev log</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            )}

            {!loading && !error && <DevLogTab devLog={commits} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountabilitySection;

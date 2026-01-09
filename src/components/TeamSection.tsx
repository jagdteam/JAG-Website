import { useEffect, useRef, useState } from 'react';
import { teamStats } from '@/data/teamStats';

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  initial: string;
  bio: string;
  expertise: string[];
  education: string[];
}

const team: TeamMember[] = [
  {
    name: 'Andrew Espinosa',
    role: 'Front-End Software Engineer',
    initial: 'A',
    image: '',
    bio: "Andrew leads JAGD with a vision to transform how software solutions are built and delivered. His strategic thinking and entrepreneurial spirit drive the company's mission to create impactful technology.",
    expertise: ['Strategic Planning', 'Product Vision', 'Team Leadership'],
    education: [
      'Master of Computer Science - University of California, Irvine',
      'B.A., Computer Science - University of Redlands',
      'B.M., Music Performance - University of Redlands',
    ],
  },
  {
    name: 'Giuseppi Pelayo',
    role: 'Full-Stack Software Engineer',
    initial: 'G',
    image: '/assets/g_pfp.jpg',
    bio: 'Giuseppi is a Full-Stack Software Engineer who loves turning complex concepts into shipping products. He currently leads the technical vision at JAGD, where he focuses on rapid prototyping, AI integration, and scalable backend architecture. With a Master’s in Computer Science from UC Irvine, Giuseppi combines strong engineering fundamentals with a hands-on approach to building high-performance applications.',
    expertise: [
      'Full-Stack Engineering',
      'Mobile Development',
      'AI/LLM & API Integration',
      'Cloud Infrastructure',
      'C/C++',
      'Python',
      'Flask',
      'React',
      'Swift',
      'TypeScript/JavaScript',
      'Computer Vision',
      'Caffeine',
    ],
    education: ['Master of Computer Science - University of California, Irvine', 'B.S., Computer Science - University of California, Riverside'],
  },
  {
    name: 'Johnny Fok',
    role: 'Full-Stack Software Engineer',
    initial: 'J',
    image: '/assets/jf_pfp.jpg',
    bio: 'Johnny is a full-stack software engineer with a passion for building products and turning them into scalable, marketable solutions. He drives the rapid development of projects through his diverse experience in AI/ML, mobile development, and performance optimization.',
    expertise: [
      'Python (flask)',
      'Swift',
      'C/C++',
      'Java',
      'SQLAlchemy',
      'LLM Integration/Training',
      'Performance Optimization',
      'AR/VR Development',
      'AWS',
      'Mobile Development',
      'Computer Vision',
    ],
    education: [
      'Master of Computer Science - University of California, Irvine',
      'B.S., Computer Science - California State Polytechnic University, Pomona',
    ],
  },
  {
    name: 'Dylan Nguyen',
    role: 'Full-Stack Software Engineer',
    initial: 'D',
    image: '/assets/dn_pfp.jpg',
    bio: 'Dylan is a full-stack software engineer who enjoys building interactive systems and tackling complex problems through thoughtful design and implementation. He is especially interested in projects that blend creativity with technical depth, from 3D physics simulations and visual experiences to intelligent, real-world applications.',
    expertise: [
      'C/C++',
      'Java',
      'Python',
      '3D Graphics Development',
      '3D Animation',
      '3D Modeling',
      'Game Design',
      'Full-stack Development',
      'React',
      'TypeScript/JavaScript',
      'AWS',
      'Computer Vision',
    ],
    education: ['Master of Computer Science - University of California, Irvine', 'B.S., Computer Science - San Jose State University'],
  },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(selectedMember?.name === member.name ? null : member);
  };

  const handleImageError = (name: string) => {
    console.error(`TeamSection: Failed to load image for ${name}. Ensure file exists in public/assets/`);
    setImageErrors((prev) => ({ ...prev, [name]: true }));
  };

  const renderContributionGraph = (memberName: string, type: 'github' | 'leetcode') => {
    const stats = teamStats.find(s => s.name === memberName);
    if (!stats) return null;

    let data = type === 'github'
      ? stats.github.contributions
      : stats.leetcode?.stats.recentSubmissions || [];

    if (data.length === 0) return null;

    // Calculate max value for scaling
    const maxCount = Math.max(...data.map(d => d.count), 1);

    // Color themes - match GitHub/LeetCode exactly
    const colors = type === 'github'
      ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'] // GitHub green
      : ['#1a1a1a', '#0e4429', '#006d32', '#26a641', '#39d353']; // LeetCode uses same green!

    const getColor = (count: number) => {
      if (count === 0) return colors[0];
      const intensity = Math.ceil((count / maxCount) * 4);
      return colors[intensity];
    };

    // Define exact 5-month range
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 4);
    startDate.setDate(1); // Start from beginning of that month

    // Create data map for quick lookup
    const dataMap = new Map(data.map(d => [d.date, d.count]));

    // Create a full calendar grid (weeks × 7 days) - ONLY 5 months
    const weeks: Array<Array<{ date: string; count: number } | null>> = [];

    // Get to the start of the week (Sunday) for the start date
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    let currentWeek: Array<{ date: string; count: number } | null> = [];

    // Only iterate through exactly 5 months
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;

      currentWeek.push({ date: dateStr, count });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Get month labels - one label per unique month with minimum spacing
    const monthLabels: Array<{ month: string; weekIndex: number }> = [];
    let lastMonth = -1;
    let lastLabelWeekIndex = -4; // Ensure minimum spacing of ~4 weeks between labels

    weeks.forEach((week, idx) => {
      const firstDay = week.find(d => d !== null);
      if (firstDay) {
        const date = new Date(firstDay.date);
        const currentMonth = date.getMonth();

        // Only add label when we encounter a new month AND there's enough spacing
        if (currentMonth !== lastMonth && (idx - lastLabelWeekIndex) >= 3) {
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          monthLabels.push({ month: monthName, weekIndex: idx });
          lastMonth = currentMonth;
          lastLabelWeekIndex = idx;
        } else if (currentMonth !== lastMonth) {
          // Update lastMonth even if we skip the label to prevent duplicate month detection
          lastMonth = currentMonth;
        }
      }
    });

    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          {type === 'github' ? (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"></path>
            </svg>
          )}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {type === 'github' ? 'GitHub Activity (5 months)' : 'LeetCode Activity (5 months)'}
          </span>
        </div>

        {/* LeetCode Stats Summary */}
        {type === 'leetcode' && stats.leetcode && (
          <div className="mb-4 p-4 rounded-lg bg-background/50 border border-border/30">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.leetcode.stats.totalSolved}
                  <span className="text-sm text-muted-foreground ml-1">Solved</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-green-400">Easy </span>
                  <span className="text-foreground font-medium">{stats.leetcode.stats.easySolved}</span>
                </div>
                <div>
                  <span className="text-yellow-400">Med. </span>
                  <span className="text-foreground font-medium">{stats.leetcode.stats.mediumSolved}</span>
                </div>
                <div>
                  <span className="text-red-400">Hard </span>
                  <span className="text-foreground font-medium">{stats.leetcode.stats.hardSolved}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          {/* Month labels */}
          <div className="flex ml-8 mb-1 relative" style={{ height: '14px' }}>
            {monthLabels.map((label, idx) => (
              <div
                key={idx}
                className="text-[10px] text-muted-foreground absolute whitespace-nowrap"
                style={{ left: `${label.weekIndex * 13 + 32}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Day labels + Grid */}
          <div className="flex gap-1 mt-4">
            {/* Day of week labels */}
            <div className="flex flex-col gap-[3px] justify-start text-[10px] text-muted-foreground pr-1">
              <div style={{ height: '10px' }}></div>
              <div style={{ height: '10px' }}>Mon</div>
              <div style={{ height: '10px' }}></div>
              <div style={{ height: '10px' }}>Wed</div>
              <div style={{ height: '10px' }}></div>
              <div style={{ height: '10px' }}>Fri</div>
              <div style={{ height: '10px' }}></div>
            </div>

            {/* Contribution grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="w-[10px] h-[10px] rounded-sm hover:ring-1 hover:ring-primary/50 transition-all cursor-pointer"
                      style={{
                        backgroundColor: day ? getColor(day.count) : 'transparent',
                        opacity: day ? 1 : 0
                      }}
                      title={day ? `${day.date}: ${day.count} ${type === 'github' ? 'contributions' : 'problems'}` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAvatar = (member: TeamMember, sizeClasses: string, textClasses: string) => {
    const hasImage = member.image && member.image.trim().length > 0 && !imageErrors[member.name];

    return (
      <div
        className={`${sizeClasses} mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center transition-all duration-500 shadow-inner relative`}
      >
        {hasImage ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover block"
            style={{ minWidth: '100%', minHeight: '100%' }}
            onError={() => handleImageError(member.name)}
          />
        ) : (
          <span className={`${textClasses} font-semibold text-primary select-none uppercase`}>{member.initial}</span>
        )}
      </div>
    );
  };

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-primary text-sm font-medium mb-4 tracking-widest uppercase">The Minds Behind JAGD</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">Meet the Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collective of UCI Master students driven by innovation, excellence, and the pursuit of transformative software solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={member.name}
              onClick={() => handleMemberClick(member)}
              className={`group relative transition-all duration-700 cursor-pointer ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className={`relative bg-card/50 border rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2 ${
                  selectedMember?.name === member.name
                    ? 'border-primary bg-card shadow-lg shadow-primary/5'
                    : 'border-border/50 hover:bg-card hover:border-border'
                }`}
              >
                {renderAvatar(member, 'w-24 h-24', 'text-3xl')}
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 transition-all duration-300 ${
                    selectedMember?.name === member.name ? 'bg-card border-b border-r border-primary opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 overflow-hidden transition-all duration-700 ease-out ${
            selectedMember ? 'max-h-[1200px] opacity-100 py-4' : 'max-h-0 opacity-0'
          }`}
        >
          {selectedMember && (
            <div className="relative bg-gradient-to-br from-card via-card/80 to-card/50 border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors z-20"
              >
                <span className="text-muted-foreground text-xl">×</span>
              </button>

              <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                <div className="flex flex-col items-center md:items-start">
                  {renderAvatar(selectedMember, 'w-40 h-40 md:w-48 md:h-48', 'text-6xl md:text-7xl')}
                  <div className="text-center md:text-left mb-4">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-2">{selectedMember.name}</h3>
                    <p className="text-primary font-medium">{selectedMember.role}</p>
                  </div>

                  {/* Activity Graphs */}
                  <div className="w-full">
                    {renderContributionGraph(selectedMember.name, 'github')}
                    {renderContributionGraph(selectedMember.name, 'leetcode')}

                    {/* Centered Legend (shared for both graphs) */}
                    <div className="flex items-center justify-center gap-1 mt-4 text-[10px] text-muted-foreground">
                      <span>Less</span>
                      {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map((color, idx) => (
                        <div
                          key={idx}
                          className="w-[10px] h-[10px] rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <span>More</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">About</h4>
                    <p className="text-lg text-foreground/90 leading-relaxed">{selectedMember.bio}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 whitespace-nowrap"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Education</h4>
                      <div className="space-y-2">
                        {selectedMember.education.map((edu, i) => (
                          <p
                            key={i}
                            className="text-foreground/90 leading-snug"
                          >
                            {edu}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

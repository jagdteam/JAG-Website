import { TeamMemberActivity } from '@/components/TeamMemberActivity';
import { useEffect, useRef, useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  initial: string;
  bio: string;
  expertise: string[];
  education: string[];
  github: string; // GitHub username
  leetcode?: string; // LeetCode username (optional)
}

const team: TeamMember[] = [
  {
    name: 'Andrew Espinosa',
    role: 'Front-End Software Engineer',
    initial: 'A',
    image: '/assets/ade_pfp.jpeg',
    bio: "Andrew leads JAGD with a vision to transform how software solutions are built and delivered. His strategic thinking and entrepreneurial spirit drive the company's mission to create impactful technology.",
    expertise: ['Strategic Planning', 'Product Vision', 'Team Leadership'],
    education: [
      'Master of Computer Science - University of California, Irvine',
      'B.A., Computer Science - University of Redlands',
      'B.M., Music Performance - University of Redlands',
    ],
    github: 'adespinosa14',
    leetcode: 'adespinosa2002',
  },
  {
    name: 'Giuseppi Pelayo',
    role: 'Full-Stack Software Engineer',
    initial: 'G',
    image: '/assets/g_pfp.jpg',
    bio: "Giuseppi is a Full-Stack Software Engineer who loves turning complex concepts into shipping products. He currently leads the technical vision at JAGD, where he focuses on rapid prototyping, AI integration, and scalable backend architecture. With a Master's in Computer Science from UC Irvine, Giuseppi combines strong engineering fundamentals with a hands-on approach to building high-performance applications.",
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
    github: 'giuseppi',
    leetcode: 'giuseppi',
  },
  {
    name: 'Johnny Fok',
    role: 'Full-Stack Software Engineer',
    initial: 'J',
    image: '/assets/jf_pfp.jpg',
    bio: 'Johnny is a full-stack software engineer with a passion for building products and turning them into scalable, marketable solutions. He drives the rapid development of projects through his diverse experience in AI/ML, mobile development, and performance optimization.',
    expertise: [
      'Python (Flask)',
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
    github: 'JohnFok119',
    leetcode: 'LupusOW',
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
    github: 'DylanN143',
    leetcode: '', // Dylan doesn't have LeetCode (yet!)
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
    if (import.meta.env.DEV) {
      console.error(`TeamSection: Failed to load image for ${name}. Ensure file exists in public/assets/`);
    }
    setImageErrors((prev) => ({ ...prev, [name]: true }));
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
      className="relative py-32 px-6 overflow-hidden"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Subtle gradient - barely visible for seamless flow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none" />

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
                    <TeamMemberActivity
                      memberName={selectedMember.name}
                      github={selectedMember.github}
                      leetcode={selectedMember.leetcode}
                    />

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

import { useEffect, useRef, useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  initial: string;
  bio: string;
  expertise: string[];
  education: string;
}

const team: TeamMember[] = [
  {
    name: "Andrew Espinoza",
    role: "CEO",
    initial: "A",
    bio: "Andrew leads JAGD with a vision to transform how software solutions are built and delivered. His strategic thinking and entrepreneurial spirit drive the company's mission to create impactful technology.",
    expertise: ["Strategic Planning", "Product Vision", "Team Leadership"],
    education: "M.S. Computer Science, UC Irvine",
  },
  {
    name: "Giuseppi Pelayo",
    role: "Tech Lead",
    initial: "G",
    bio: "Giuseppi architects the technical foundation of JAGD's products. With deep expertise in system design and emerging technologies, he ensures every solution is built for scale and performance.",
    expertise: ["System Architecture", "Cloud Infrastructure", "Technical Strategy"],
    education: "M.S. Computer Science, UC Irvine",
  },
  {
    name: "Johnny Fok",
    role: "Full-Stack SWE",
    initial: "J",
    bio: "Johnny brings ideas to life through elegant code and intuitive interfaces. His full-stack expertise spans from pixel-perfect frontends to robust backend systems.",
    expertise: ["React & TypeScript", "Node.js", "Database Design"],
    education: "M.S. Computer Science, UC Irvine",
  },
  {
    name: "Dylan Nguyen",
    role: "Full-Stack SWE",
    initial: "D",
    bio: "Dylan crafts seamless user experiences backed by solid engineering principles. His attention to detail and passion for clean code elevates every project he touches.",
    expertise: ["Frontend Development", "API Design", "DevOps"],
    education: "M.S. Computer Science, UC Irvine",
  },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

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

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="text-primary text-sm font-medium mb-4 tracking-widest uppercase">
            The Minds Behind JAGD
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Meet the Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collective of UCI Master students driven by innovation, excellence,
            and the pursuit of transformative software solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={member.name}
              onClick={() => handleMemberClick(member)}
              className={`group relative transition-all duration-700 cursor-pointer ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className={`relative bg-card/50 border rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-2 ${
                  selectedMember?.name === member.name
                    ? "border-primary bg-card"
                    : "border-border/50 hover:bg-card hover:border-border"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center transition-all duration-500 ${
                    selectedMember?.name === member.name
                      ? "border-primary scale-105"
                      : "border-primary/20 group-hover:scale-105"
                  }`}
                >
                  <span className="text-3xl font-semibold text-primary">
                    {member.initial}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>

                {/* Selection indicator */}
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 transition-all duration-300 ${
                    selectedMember?.name === member.name
                      ? "bg-card border-b border-r border-primary opacity-100"
                      : "opacity-0"
                  }`}
                />

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Member Profile */}
        <div
          className={`mt-16 overflow-hidden transition-all duration-700 ease-out ${
            selectedMember
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {selectedMember && (
            <div className="relative bg-gradient-to-br from-card via-card/80 to-card/50 border border-border/50 rounded-3xl p-8 md:p-12">
              {/* Close button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <span className="text-muted-foreground text-xl">×</span>
              </button>

              <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                {/* Profile Image */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/30 flex items-center justify-center mb-6">
                    <span className="text-6xl md:text-7xl font-semibold text-primary">
                      {selectedMember.initial}
                    </span>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                      {selectedMember.name}
                    </h3>
                    <p className="text-primary font-medium">
                      {selectedMember.role}
                    </p>
                  </div>
                </div>

                {/* Bio & Details */}
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
                      About
                    </h4>
                    <p className="text-lg text-foreground/90 leading-relaxed">
                      {selectedMember.bio}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
                        Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
                        Education
                      </h4>
                      <p className="text-foreground/90">
                        {selectedMember.education}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

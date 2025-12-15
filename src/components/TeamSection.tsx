import { useEffect, useRef, useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  initial: string;
}

const team: TeamMember[] = [
  { name: "Andrew Espinoza", role: "CEO", initial: "A" },
  { name: "Giuseppi Pelayo", role: "Tech Lead", initial: "G" },
  { name: "Johnny Fok", role: "Full-Stack SWE", initial: "J" },
  { name: "Dylan Nguyen", role: "Full-Stack SWE", initial: "D" },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
              className={`group relative transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative bg-card/50 border border-border/50 rounded-2xl p-8 text-center hover:bg-card hover:border-border transition-all duration-500 hover:-translate-y-2">
                {/* Avatar */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <span className="text-3xl font-semibold text-primary">
                    {member.initial}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

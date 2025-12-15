import { useEffect, useRef, useState } from "react";

const AboutSection = () => {
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

  const stats = [
    { value: "4", label: "Team Members" },
    { value: "UCI", label: "University" },
    { value: "∞", label: "Possibilities" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            <p className="text-primary text-sm font-medium mb-4 tracking-widest uppercase">
              About Us
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Innovation starts with{" "}
              <span className="text-gradient-blue">vision</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              JAGD is a software company founded by a team of ambitious Master's
              students from the University of California, Irvine. We're passionate
              about building products that push the boundaries of what's possible.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our name represents our founding members: Johnny, Andrew, Giuseppi,
              and Dylan — each bringing unique expertise in full-stack development,
              systems architecture, and product innovation.
            </p>
          </div>

          {/* Right stats */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-6 bg-card/30 border border-border/30 rounded-2xl hover:bg-card/50 hover:border-border/50 transition-all duration-300"
                >
                  <div className="text-4xl md:text-5xl font-semibold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

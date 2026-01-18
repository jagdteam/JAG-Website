import { useEffect, useRef, useState } from 'react';

const ContactSection = () => {
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
      id="contact"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
    >

      <div
        className={`relative z-10 max-w-3xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <p className="text-primary text-sm font-medium mb-4 tracking-widest uppercase">Get in Touch</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
          Let's build something <span className="text-gradient-blue">extraordinary</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Interested in collaborating or learning more about our projects? We'd love to hear from you.
        </p>
        <a
          href="mailto:jagd.software@gmail.com"
          className="inline-flex items-center px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-all duration-300 hover:scale-105"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
};

export default ContactSection;

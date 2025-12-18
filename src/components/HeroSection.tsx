import { useEffect, useRef } from 'react';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video/gradient */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p
          className="text-muted-foreground text-sm md:text-base mb-4 animate-fade-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          UCI Master Students • Software Innovation
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6 animate-fade-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <span className="text-gradient">JAGD</span>
        </h1>
        <p
          className="text-xl md:text-2xl lg:text-3xl font-light text-muted-foreground mb-2 animate-fade-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          Building tomorrow's software.
        </p>
        <p
          className="text-lg md:text-xl text-muted-foreground/70 mb-12 animate-fade-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
        >
          Today.
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '1s', animationFillMode: 'both' }}
        >
          <a
            href="/projects"
            className="px-8 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-all duration-300"
          >
            Explore Products
          </a>
          <a
            href="#team"
            className="px-8 py-3 text-primary text-sm font-medium hover:text-primary/80 transition-colors duration-300"
          >
            Meet the Team →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

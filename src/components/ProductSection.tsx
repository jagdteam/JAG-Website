import { projects } from '@/data/projects';
import { useEffect, useRef, useState } from 'react';

interface Product {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
}

const products: Product[] = [
  {
    id: 1,
    title: 'Our Mission',
    subtitle: "Building Tomorrow's Software, Today",
    description:
      "To bridge the gap between academic theory and industry impact. We are driven to build software that matters. By tackling full-scale engineering challenges, we are proving our capability to navigate an ever-changing landscape. We don't just write code; we build resilient solutions that define who we are as engineers.",
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-artificial-intelligence-animated-concept-24728-large.mp4',
  },
  {
    id: 2,
    title: 'Our Story (So Far)',
    subtitle: 'How We Got Here',
    description:
      "Driven by a hunger to excel, we are a team of UCI Master's students turning potential into performance. We realized that the best engineers aren't just taught; they are forged through building. We established JAGD to take ownership of our growth, applying advanced concepts to build real products and creating the future we want to see.",
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cloud-computing-concept-animation-4817-large.mp4',
  },
  {
    id: 3,
    title: 'Technical Domain & Specialization',
    subtitle: 'Our Domain of Expertise',
    description:
      'We’re a mix of developers who don’t just code differently, we think differently. Our diverse backgrounds mean that we patch each other’s weaknesses in real-time, creating a collaborative environment where every technical gap is covered by a shared strength.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-programming-code-moving-on-a-dark-screen-28814-large.mp4',
  },
  {
    id: 4,
    title: 'Accountability',
    subtitle: 'We Hold Each Other Accountable',
    description: 'Leetcode & GitHub History UwU',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-programming-code-moving-on-a-dark-screen-28814-large.mp4',
  },
];

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play();
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate carousel for Mission card
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0a95a786-aa8c-42cc-b15f-f68b75db7ff8', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'ProductSection.tsx:77',
        message: 'Carousel effect triggered',
        data: { index, isVisible, projectsLength: projects.length },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'H1,H2,H3',
      }),
    }).catch(() => {});
    // #endregion
    if (index === 0 && isVisible) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0a95a786-aa8c-42cc-b15f-f68b75db7ff8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'ProductSection.tsx:80',
          message: 'Starting carousel interval',
          data: { intervalDelay: 5000 },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          hypothesisId: 'H1',
        }),
      }).catch(() => {});
      // #endregion
      const interval = setInterval(() => {
        setCurrentProjectIndex((prev) => {
          const next = (prev + 1) % projects.length;
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/0a95a786-aa8c-42cc-b15f-f68b75db7ff8', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'ProductSection.tsx:83',
              message: 'Carousel index updating',
              data: { prev, next, projectsLength: projects.length },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              hypothesisId: 'H1',
            }),
          }).catch(() => {});
          // #endregion
          return next;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [index, isVisible]);

  // Only show carousel on the Mission card (index 0)
  const showCarousel = index === 0;
  const currentProject = projects[currentProjectIndex];

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/0a95a786-aa8c-42cc-b15f-f68b75db7ff8', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'ProductSection.tsx:92',
        message: 'Carousel state',
        data: {
          showCarousel,
          currentProjectIndex,
          hasCurrentProject: !!currentProject,
          currentProjectId: currentProject?.id,
          currentProjectMediaUrl: currentProject?.mediaUrl,
          currentProjectMediaType: currentProject?.mediaType,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'H4',
      }),
    }).catch(() => {});
  }, [showCarousel, currentProjectIndex, currentProject]);
  // #endregion

  return (
    <div
      ref={cardRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source
          src={product.videoUrl}
          type="video/mp4"
        />
      </video>

      {/* Project Carousel Background (Mission card only) */}
      {showCarousel && currentProject && (
        <div className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-1000">
          <div className="absolute inset-0 flex items-center justify-center opacity-25">
            {currentProject.mediaUrl && currentProject.mediaType ? (
              currentProject.mediaType === 'video' ? (
                <video
                  key={currentProject.id}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source
                    src={currentProject.mediaUrl}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <img
                  key={currentProject.id}
                  src={currentProject.mediaUrl}
                  alt={currentProject.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )
            ) : (
              <div className="text-9xl font-bold text-primary/20">{currentProject.initials}</div>
            )}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60 z-[2]" />

      {/* Content */}
      <div
        className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <p className="text-primary text-sm font-medium mb-4 tracking-widest uppercase">{product.subtitle}</p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6">{product.title}</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{product.description}</p>
        {showCarousel && (
          <a
            href="/projects"
            className="inline-flex px-8 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-all duration-300"
          >
            View Projects
          </a>
        )}
      </div>
    </div>
  );
};

const ProductSection = () => {
  return (
    <section
      id="products"
      className="relative"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
        />
      ))}
    </section>
  );
};

export default ProductSection;

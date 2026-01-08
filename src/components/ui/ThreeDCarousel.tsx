import { useMemo } from 'react';
import type { Project } from '@/data/projects';

interface ThreeDCarouselProps {
  projects: Project[];
  isVisible: boolean;
  rotationDuration?: number;
  radius?: number;
  tilt?: number;
  className?: string;
}

export const ThreeDCarousel = ({
  projects,
  isVisible,
  rotationDuration = 30,
  radius = 280,
  tilt = 12,
  className = '',
}: ThreeDCarouselProps) => {
  const carouselItems = useMemo(() => {
    const angleStep = 360 / projects.length;
    return projects.map((project, index) => ({
      project,
      angle: angleStep * index,
    }));
  }, [projects]);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Horizontal edge fade masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* 3D rotating container */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt}deg)`,
          animation: isVisible 
            ? `rotate3d ${rotationDuration}s linear infinite` 
            : 'none',
          animationPlayState: isVisible ? 'running' : 'paused',
        }}
      >
        {carouselItems.map(({ project, angle }) => (
          <CarouselCard
            key={project.id}
            project={project}
            angle={angle}
            radius={radius}
          />
        ))}
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes rotate3d {
          from { transform: rotateX(${tilt}deg) rotateY(0deg); }
          to { transform: rotateX(${tilt}deg) rotateY(360deg); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-3d {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

interface CarouselCardProps {
  project: Project;
  angle: number;
  radius: number;
}

const CarouselCard = ({ project, angle, radius }: CarouselCardProps) => {
  return (
    <div
      className="absolute w-[200px] h-[150px] md:w-[200px] md:h-[150px] sm:w-[140px] sm:h-[100px]"
      style={{
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="w-full h-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden flex items-center justify-center">
        {project.mediaUrl && project.mediaType ? (
          project.mediaType === 'video' ? (
            <video
              src={project.mediaUrl}
              className="w-full h-full object-cover opacity-70"
              muted
              loop
              playsInline
              poster={project.mediaUrl}
            />
          ) : (
            <img
              src={project.mediaUrl}
              alt={project.name}
              className="w-full h-full object-cover opacity-70"
            />
          )
        ) : (
          <span className="text-4xl md:text-5xl font-bold text-white/40 select-none">
            {project.initials}
          </span>
        )}
      </div>
    </div>
  );
};

export default ThreeDCarousel;

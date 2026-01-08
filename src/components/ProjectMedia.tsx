import { useState } from 'react';
import { Project } from '@/data/projects';

interface ProjectMediaProps {
  project: Project;
  className?: string;
  showFallback?: boolean;
}

export const ProjectMedia = ({ project, className = '', showFallback = true }: ProjectMediaProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  // Show initials fallback
  if (!project.mediaUrl || hasError) {
    if (!showFallback) return null;
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl ${className}`}>
        <span className="text-4xl font-bold text-muted-foreground">
          {project.initials}
        </span>
      </div>
    );
  }

  // Render based on media type
  if (project.mediaType === 'video') {
    return (
      <video
        src={project.mediaUrl}
        className={`object-cover rounded-xl ${className}`}
        autoPlay
        loop
        muted
        playsInline
        onError={handleError}
      />
    );
  }

  // Image or GIF
  return (
    <img
      src={project.mediaUrl}
      alt={project.name}
      className={`object-cover rounded-xl ${className}`}
      onError={handleError}
    />
  );
};

// Smaller version for carousel/thumbnails
export const ProjectMediaThumb = ({ project, className = '' }: Omit<ProjectMediaProps, 'showFallback'>) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  // Show initials fallback
  if (!project.mediaUrl || hasError) {
    return (
      <div className={`flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg ${className}`}>
        <span className="text-2xl font-bold text-white/80">
          {project.initials}
        </span>
      </div>
    );
  }

  // Render based on media type
  if (project.mediaType === 'video') {
    return (
      <video
        src={project.mediaUrl}
        className={`object-cover rounded-lg ${className}`}
        autoPlay
        loop
        muted
        playsInline
        onError={handleError}
      />
    );
  }

  // Image or GIF
  return (
    <img
      src={project.mediaUrl}
      alt={project.name}
      className={`object-cover rounded-lg ${className}`}
      onError={handleError}
    />
  );
};

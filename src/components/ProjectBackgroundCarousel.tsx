import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/projects';
import { ProjectMediaThumb } from './ProjectMedia';

export const ProjectBackgroundCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid of project thumbnails */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full h-full flex items-center justify-center p-12">
              <ProjectMediaThumb
                project={projects[currentIndex]}
                className="w-full h-full max-w-[600px] max-h-[400px]"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Project indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {projects.map((_, index) => (
          <motion.div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-white/60' : 'bg-white/20'
            }`}
            animate={{
              scale: index === currentIndex ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

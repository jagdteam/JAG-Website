import ProjectDetails from '@/components/ProjectDetails';
import ProjectFooter from '@/components/ProjectFooter';
import ProjectNavigation from '@/components/ProjectNavigation';
import ProjectSelector from '@/components/ProjectSelector';
import { projects } from '@/data/projects';
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { AnimatePresence, motion } from 'framer-motion';
import ParallaxBackground from '@/components/shaders/ParallaxBackground';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(0);
  const project = projects[selectedProject];

  return (
    <PageTransition>
      <ParallaxBackground />
      <div className="min-h-screen relative z-0">
        <ProjectNavigation />
        <main className="pt-24 pb-20 flex flex-col items-center">
          <div className="w-full max-w-7xl">
            <ProjectSelector
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <ProjectDetails project={project} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <ProjectFooter />
      </div>
    </PageTransition>
  );
};

export default Projects;

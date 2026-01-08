import ProjectDetails from '@/components/ProjectDetails';
import ProjectFooter from '@/components/ProjectFooter';
import ProjectNavigation from '@/components/ProjectNavigation';
import ProjectSelector from '@/components/ProjectSelector';
import { projects } from '@/data/projects';
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { AnimatePresence, motion } from 'framer-motion';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(0);
  const project = projects[selectedProject];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <ProjectNavigation />
        <main className="pt-24 pb-20">
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
        </main>
        <ProjectFooter />
      </div>
    </PageTransition>
  );
};

export default Projects;

import ProjectDetails from '@/components/ProjectDetails';
import ProjectFooter from '@/components/ProjectFooter';
import ProjectNavigation from '@/components/ProjectNavigation';
import ProjectSelector from '@/components/ProjectSelector';
import { projects } from '@/data/projects';
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';

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
          <ProjectDetails project={project} />
        </main>
        <ProjectFooter />
      </div>
    </PageTransition>
  );
};

export default Projects;

import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectNavigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
        <span className="text-lg font-semibold">Projects</span>
        <div className="flex items-center gap-6 text-sm">
          <a
            href="#specs"
            className="text-primary"
          >
            Tech Specs
          </a>
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
        </div>
      </div>
    </nav>
  );
};

export default ProjectNavigation;


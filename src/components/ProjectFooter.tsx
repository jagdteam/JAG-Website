const ProjectFooter = () => {
  return (
    <footer className="border-t border-border/20 py-8">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} JAGD. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default ProjectFooter;


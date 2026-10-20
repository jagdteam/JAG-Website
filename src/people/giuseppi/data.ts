export type ProjectRef =
  | { slug: string; myPart?: string }
  | { local: string; myPart?: string };

export const profile = {
  name: "Giuseppi Pelayo",
  title: "AI/ML Engineer",
  blurb: [
    "AI/ML Engineer building LLM agents and computer vision systems.",
    "Master of Computer Science at UC Irvine, Dec 2026.",
  ],
  about:
    "AI/ML Engineer (Contract) at Human Proximity, previously an AI/ML Engineer Intern at VeloPrimo. I work with LLM agents, retrieval, and computer vision, and I built computer vision for Clutch, which took 1st Place at the 2026 UCI ICS Expo. I am finishing a Master of Computer Science at UC Irvine (Expected Dec 2026, Director's Fellowship Recipient) after a BS in Computer Science at UC Riverside.",
  contactLine: "",
  education: [
    {
      school: "University of California, Irvine",
      logo: "/assets/logos/uci.svg",
      degree: "Master of Computer Science, Director's Fellowship Recipient",
      gpa: "3.93",
      date: "Expected Dec 2026",
      place: "Irvine, CA",
    },
    {
      school: "University of California, Riverside",
      degree: "Bachelor of Science, Computer Science",
      gpa: "",
      date: "June 2021",
      place: "Riverside, CA",
    },
  ],
  skills: [
    { label: "Languages", list: "Python, TypeScript, JavaScript, C, C++, SQL" },
    {
      label: "LLM & Agents",
      list: "Claude Code, MCP Servers, Multi-Agent Orchestration, RAG, LLM-as-Judge Evals, OpenAI API",
    },
    {
      label: "CV & ML",
      list: "PyTorch, YOLOv8, ByteTrack, Kalman Filtering, TensorFlow Lite, Roboflow, NumPy, Hugging Face Transformers",
    },
    { label: "Databases", list: "PostgreSQL, Firestore, Pinecone, ChromaDB, FAISS" },
    {
      label: "Cloud & DevOps",
      list: "AWS (EC2, S3, SageMaker, Bedrock), GCP (Cloud Run), Firebase, Docker, GitHub Actions, Linux, Git",
    },
    {
      label: "Frameworks & Testing",
      list: "FastAPI, Next.js, React, React Native, Node.js, Express, pytest, Playwright, Vitest, Jest",
    },
  ],
  contact: {
    email: "glpelayo@uci.edu",
    github: "https://github.com/giuseppi",
    linkedin: "https://linkedin.com/in/giuseppipelayo",
    resume: undefined as string | undefined,
  },
  projects: [
    { slug: "clutch", myPart: "Basketball app with on-iPhone computer vision that tracks players and the ball." },
  ] as ProjectRef[],
  photo: undefined as string | undefined,
};

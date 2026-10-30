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
  about: [
    [
      "I build with LLMs (AI language models) and computer vision, from multi-agent systems in the cloud to models that run live on a phone.",
    ],
    [
      "One of my favorite projects is Clutch, an app that turns a phone into a scorekeeper for pickup basketball. I deployed custom-trained YOLO models running at 20 FPS on the iPhone with TensorFlow Lite, and built the tracking logic that keeps each player's identity even when they're blocked from view mid-air. Clutch won ",
      {
        text: "1st place at the 2026 UCI ICS Project Expo",
        href: "https://ics.uci.edu/2026/06/12/2026-uc-irvine-ics-project-expo-breaks-records/#:~:text=2026%20Project%20Expo,could%20have%20imagined.%E2%80%9D",
      },
      ", and it was a great way to bridge academic theory and production engineering.",
    ],
    [
      "Today I'm an AI/ML Engineer at Human Proximity, building BeesEye, a web app that helps people at in-person events find who they should meet. I built the Python pipeline that prepares each guest's AI profile before the event, cutting the wait for first matches from about 5 seconds to 1 second in testing. Before that, as an AI/ML Engineer Intern at VeloPrimo, I built multi-agent LLM orchestration with retrieval (looking up trusted sources before answering), guardrails, and an evaluation harness that uses LLM judges to keep answers accurate and safe.",
    ],
    [
      "I'm finishing my Master of Computer Science at UC Irvine (Dec 2026) as a Director's Fellowship recipient. Outside of code, you'll find me weightlifting, playing basketball, or following Formula 1.",
    ],
  ] as (string | { text: string; href: string })[][],
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
      logo: "/assets/logos/ucr.png",
      degree: "Bachelor of Science, Computer Science",
      gpa: "",
      date: "June 2021",
      place: "Riverside, CA",
    },
  ],
  skills: [
    { label: "Languages", list: ["Python", "TypeScript", "JavaScript", "C", "C++", "SQL"] },
    {
      label: "LLM & Agents",
      list: ["Claude Code", "MCP Servers", "Multi-Agent Orchestration", "RAG", "LLM-as-Judge Evals", "OpenAI API"],
    },
    {
      label: "CV & ML",
      list: ["PyTorch", "YOLOv8", "ByteTrack", "Kalman Filtering", "TensorFlow Lite", "Roboflow", "NumPy", "Hugging Face Transformers"],
    },
    { label: "Databases", list: ["PostgreSQL", "Firestore", "Pinecone", "ChromaDB", "FAISS"] },
    {
      label: "Cloud & DevOps",
      list: ["AWS (EC2, S3, SageMaker, Bedrock)", "GCP (Cloud Run)", "Firebase", "Docker", "GitHub Actions", "Linux", "Git"],
    },
    {
      label: "Frameworks & Testing",
      list: ["FastAPI", "Next.js", "React", "React Native", "Node.js", "Express", "pytest", "Playwright", "Vitest", "Jest"],
    },
  ],
  contact: {
    email: "glpelayo@uci.edu",
    github: "https://github.com/giuseppi",
    linkedin: "https://linkedin.com/in/giuseppipelayo",
    resume: undefined as string | undefined,
  },
  projects: [
    { local: "clutch", myPart: "Basketball app with on-iPhone computer vision that tracks players and the ball." },
    { local: "flip-assistant", myPart: "Building the price model from the collected price data." },
    { local: "beeseye" },
    { local: "clicr" },
    { local: "jit-expression-evaluator" },
  ] as ProjectRef[],
  photo: "/assets/giuseppi-photo.jpg" as string | undefined,
};

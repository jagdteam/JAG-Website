export type ProjectRef =
  | { slug: string; myPart?: string }
  | { local: string; myPart?: string };

export const profile = {
  name: "Johnny Fok",
  title: "AI/ML Engineer",
  blurb: [
    "Computer vision and LLM retrieval systems, shipped to real users.",
    "MS Computer Science at UC Irvine, Dec 2026.",
  ],
  about: [
    [
      "I build things with AI and ML, and I like making them work where it's hard to: on a phone, in front of live users, on a budget.",
    ],
    [
      "The project I'm proudest of is Clutch, an app I co-founded that turns a phone on a tripod into a scorekeeper for pickup basketball. It won ",
      {
        text: "1st place at the 2026 UCI ICS Project Expo",
        href: "https://ics.uci.edu/2026/06/12/2026-uc-irvine-ics-project-expo-breaks-records/#:~:text=2026%20Project%20Expo,could%20have%20imagined.%E2%80%9D",
      },
      ". Building it taught me that the model is the easy part. The hard part is everything around it: messy footage, edge cases, and deciding what to cut so the thing actually works.",
    ],
    [
      "Today I'm an AI/ML Engineer at Human Proximity, working on LLM matchmaking (using AI language models to pair up people at events). Before that, I built image retrieval (finding matching photos) at VeloPrimo. My habit across all of it is the same: build the evaluation first, so I know whether a change actually helped.",
    ],
    [
      "I'm finishing my MS in Computer Science at UC Irvine (Dec 2026) and looking for full-time roles in computer vision, applied ML, or ML-focused software engineering.",
    ],
  ] as (string | { text: string; href: string })[][],
  contactLine: "Hiring for AI/ML or computer vision work? Email is fastest.",
  education: [
    {
      school: "University of California, Irvine",
      logo: "/assets/logos/uci.svg",
      degree: "Master of Computer Science",
      gpa: "3.85",
      date: "Expected Dec. 2026",
      place: "Irvine, CA",
    },
    {
      school: "California Polytechnic State University, Pomona",
      logo: "/assets/logos/cpp.png",
      degree: "Bachelor of Science, Computer Science",
      gpa: "3.80",
      date: "June 2025",
      place: "Pomona, CA",
    },
  ],
  skills: [
    {
      label: "Languages",
      list: ["Python", "TypeScript", "JavaScript", "Swift", "SQL", "C#", "C++", "C", "Java"],
    },
    {
      label: "ML & Computer Vision",
      list: ["PyTorch", "TensorFlow Lite", "YOLO", "ByteTrack", "DINOv2", "SigLIP2", "Image Retrieval"],
    },
    {
      label: "LLMs & Retrieval",
      list: ["OpenAI API", "Gemini API", "Pinecone", "Embeddings", "LLM Reranking", "LLM Evaluation", "MCP"],
    },
    {
      label: "App & Backend",
      list: ["React Native", "FastAPI", "Flask", "Node.js", "Express", "Firestore", "Supabase Postgres"],
    },
    {
      label: "Cloud & DevOps",
      list: ["AWS (SageMaker, ECS Fargate, S3, EC2)", "GCP Cloud Run", "Docker", "GitHub Actions", "Git"],
    },
  ],
  contact: {
    email: "johnny.y.fok@gmail.com",
    github: "https://github.com/JohnFok119",
    linkedin: "https://linkedin.com/in/johnnyfok",
    resume: undefined as string | undefined,
  },
  projects: [{ slug: "clutch", myPart: "Trained the YOLOv11n detector, built the 26-keypoint court model, and designed the shot state machine." }, { local: "flip-assistant", myPart: "Built the plugin and the price data pipeline." }, { local: "shipwatch" }, { local: "second-ear" }, { slug: "beeseye" }, { local: "clicr" }, { local: "jit-expression-evaluator" }] as ProjectRef[],
  // Set to an image path (e.g. "/photo.jpg") to replace the JF initials.
  photo: "/assets/johnny-photo.jpg" as string | undefined,
};

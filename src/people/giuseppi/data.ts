import type { Profile } from "../../components/member/types";

export const profile: Profile = {
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
      "One of my favorite projects is Clutch, an app that turns a phone into a scorekeeper for pickup basketball. I was the team lead, setting the project's scope and leading software development. I labeled 1,944 frames to train custom YOLO models and ran them at 20 FPS on the iPhone with TensorFlow Lite, then built the tracking that keeps each player's identity when they're briefly blocked from view and follows the ball through the arc of a shot. Clutch won ",
      {
        text: "1st place at the 2026 UCI ICS Project Expo",
        href: "https://ics.uci.edu/2026/06/12/2026-uc-irvine-ics-project-expo-breaks-records/#:~:text=2026%20Project%20Expo,could%20have%20imagined.%E2%80%9D",
      },
      ", and on our hand-labeled test games it caught 10 of 10 made shots with no false points.",
    ],
    [
      "Today I'm an AI/ML Engineer at Human Proximity, building BeesEye, a web app that helps people at in-person events find who they should meet. I built the Python pipeline that prepares each guest's AI profile before the event, cutting the wait for first matches from about 5 seconds to 1 second in testing. Before that, as an AI/ML Engineer Intern at VeloPrimo, I built multi-agent LLM orchestration with retrieval (looking up trusted sources before answering), guardrails, and an evaluation harness that uses LLM judges to keep answers accurate and safe.",
    ],
    [
      "I'm finishing my Master of Computer Science at UC Irvine (Dec 2026) as a Director's Fellowship recipient. Outside of code, you'll find me weightlifting, playing basketball, or following Formula 1.",
    ],
  ],
  contactLine: "",
  education: [
    {
      school: "University of California, Irvine",
      logo: "/assets/logos/uci-monogram.svg",
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
      label: "LLMs & Agents",
      list: ["Multi-Agent Orchestration", "RAG", "Embeddings", "LLM Evaluation", "LLM Red Teaming", "OpenAI API", "Cohere"],
    },
    {
      label: "Computer Vision",
      list: ["PyTorch", "YOLO (v8, v11)", "ByteTrack", "Kalman Filtering", "Image Retrieval", "Roboflow", "TensorFlow Lite", "Hugging Face", "NumPy"],
    },
    { label: "AI Coding Tools", list: ["Claude Code", "MCP Servers", "Parallel Coding Agents"] },
    { label: "Databases", list: ["PostgreSQL", "Supabase", "Firestore", "Pinecone", "ChromaDB", "FAISS"] },
    {
      label: "Cloud & DevOps",
      list: ["AWS (EC2, S3, SageMaker, Bedrock)", "GCP (Cloud Run, Cloud Scheduler)", "Firebase", "Docker", "GitHub Actions", "Linux", "Git"],
    },
    { label: "Web & Mobile", list: ["FastAPI", "Node.js", "Express", "Next.js", "React", "React Native", "Expo"] },
    { label: "Testing", list: ["pytest", "Playwright", "Vitest", "Jest"] },
  ],
  contact: {
    email: "giuseppipelayo@gmail.com",
    github: "https://github.com/giuseppi",
    linkedin: "https://linkedin.com/in/giuseppipelayo",
    resume: undefined,
  },
  projects: [
    { local: "clutch", role: "Team Lead", myPart: "Set the scope and led software development. Built the on-iPhone computer vision, from YOLO training data to the shot state machine." },
    { local: "flip-assistant", myPart: "Building the model that turns collected Grand Exchange data into realistic flip profit estimates." },
    { local: "clicr", myPart: "Built the first version (Cohere, ChromaDB) with cited answers, chat memory and re-indexing of only changed code." },
    { local: "jit-expression-evaluator", myPart: "Wrote the first version: C code generation, gcc in a child process, and loading the result in-process." },
  ],
  photo: "/assets/giuseppi-photo.jpg",
};

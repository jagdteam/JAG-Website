import type { Profile } from "../../components/member/types";

export const profile: Profile = {
  name: "Giuseppi Pelayo",
  title: "AI/ML Engineer",
  blurb: [
    "AI/ML Engineer building real-time computer vision, drone and LLM systems.",
    "Master of Computer Science at UC Irvine, Dec 2026.",
  ],
  about: [
    [
      "I'm finishing my Master's in Computer Science at UC Irvine this December, and I like building software that works in the real world.",
    ],
    [
      "I studied computer science at UC Riverside, spent a few years working, and came back to school because I wanted to build things with real impact. Since then I led my team to ",
      {
        text: "1st place at the 2026 UCI ICS Project Expo",
        href: "https://ics.uci.edu/2026/06/12/2026-uc-irvine-ics-project-expo-breaks-records/#:~:text=2026%20Project%20Expo,could%20have%20imagined.%E2%80%9D",
      },
      " with Clutch, a mobile app that uses computer vision and object tracking to keep score of basketball games and track player stats.",
    ],
    [
      "Today I'm an AI/ML Engineer at Human Proximity, building BeesEye, an app that helps people at events find who to meet. I'm also building Heimdall, a GPS-free indoor drone system, with my teammates. Before that, I interned at VeloPrimo, where I deployed a cycling AI assistant to AWS.",
    ],
    [
      "I'm looking for full-time software engineering roles starting in 2027, especially in computer vision and full-stack development. Outside of code, you'll find me weightlifting, playing basketball, or following Formula 1.",
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
      date: "",
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
      list: ["PyTorch", "YOLO (v8, v11)", "ByteTrack", "OC-SORT", "Kalman Filtering", "Image Retrieval", "Roboflow", "TensorFlow Lite", "NumPy"],
    },
    { label: "AI Coding Tools", list: ["Claude Code", "MCP Servers", "Parallel Coding Agents"] },
    { label: "Databases", list: ["PostgreSQL", "Supabase", "Firestore", "Pinecone", "InfluxDB", "ChromaDB"] },
    {
      label: "Cloud & DevOps",
      list: ["AWS (EC2, S3)", "GCP (Cloud Run, Cloud Scheduler)", "Firebase", "Docker", "MQTT", "Grafana", "GitHub Actions", "Linux", "Git"],
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
    { local: "clutch", role: "Team Lead", myPart: "Set the scope and led software development. Co-built the on-phone computer vision with Johnny, from YOLO training data to the shot state machine, which I wrote." },
    { local: "heimdall", myPart: "Built the server's store-then-confirm step for signed readings, its InfluxDB and Grafana monitoring, the fix for a broker session takeover, the drone video reader, and the people counting in review." },
    { local: "flip-assistant", myPart: "Building the model that turns collected Grand Exchange data into realistic flip profit estimates." },
    { local: "clicr", myPart: "Built the first version (Cohere, ChromaDB) that answered questions with citations to file and line." },
    { local: "jit-expression-evaluator", myPart: "Wrote the first version: C code generation, gcc in a child process, and loading the result in-process." },
  ],
  photo: "/assets/giuseppi-photo.jpg",
};

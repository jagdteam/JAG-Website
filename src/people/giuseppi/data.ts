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
      "I build computer vision and LLM (AI language model) systems, from models that run live on a phone to an indoor drone system and multi-agent systems in the cloud.",
    ],
    [
      "One of my favorite projects is Clutch, an app that turns a phone into a scorekeeper for pickup basketball. I was the team lead, setting the project's scope and leading software development. Johnny and I labeled 1,944 frames to train custom YOLO models that run on the iPhone with TensorFlow Lite at a 20 FPS target, and I built the phone's player and ball tracking, with Kalman filters that follow the ball's arc through brief gaps, and the shot state machine that calls makes and misses. Clutch won ",
      {
        text: "1st place at the 2026 UCI ICS Project Expo",
        href: "https://ics.uci.edu/2026/06/12/2026-uc-irvine-ics-project-expo-breaks-records/#:~:text=2026%20Project%20Expo,could%20have%20imagined.%E2%80%9D",
      },
      ", and in our Python test harness it caught 10 of 10 made shots with no false points.",
    ],
    [
      "Today I'm an AI/ML Engineer at Human Proximity, building BeesEye, a web app that helps people at in-person events find who they should meet. I built the Python pipeline that prepares each guest's AI profile before they join, cutting the wait for first matches from about 5 seconds to 1 second in testing. Before that, as an AI/ML Engineer Intern at VeloPrimo, I built multi-agent LLM orchestration with retrieval (looking up trusted sources before answering), guardrails, and an evaluation harness that uses LLM judges to keep answers accurate and safe. Now I'm also building Heimdall, a GPS-free indoor drone system, where I built the step where our server stores every signed sensor reading before confirming it, and the monitoring dashboard.",
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

import type { Profile } from "../../components/member/types";

export const profile: Profile = {
  name: "Johnny Fok",
  title: "AI/ML Engineer",
  blurb: ["Focused on computer vision.", "Graduating MCS."],
  about: [
    ["Hey, I'm Johnny. I love building things with AI, mostly computer vision. Lately I've been learning how LLMs work, and building and refining my own AI agent harness."],
    ["Outside of that, I'm usually playing video games, watching Formula One, or catching up on anime. I'll also lose an hour to cooking videos or a good fight night."],
    ["To stay active I lift weights and do a little boxing, and lately I've been reading up on kinesiology: how the body moves and gets stronger."],
    ["Right now I'm an AI/ML Engineer at Human Proximity and finishing my master's at UC Irvine."],
  ],
  contactLine: "Hey, feel free to reach out on any of these. I'm always happy to chat!",
  education: [
    {
      school: "University of California, Irvine",
      logo: "/assets/logos/uci-monogram.svg",
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
    phone: "(858) 848-9892",
    github: "https://github.com/JohnFok119",
    linkedin: "https://linkedin.com/in/johnnyfok",
    resume: undefined,
  },
  projects: [
    { local: "clutch", myPart: "Trained the YOLOv11n detector, built the 26-keypoint court model, and designed the shot state machine." },
    { local: "heimdall", myPart: "Wrote the sensor node's firmware and the ground control desktop app, and I'm building hold mode." },
    { local: "flip-assistant", myPart: "Built the plugin and the price data pipeline." },
    { local: "second-ear" },
    { local: "shipwatch" },
    { local: "beeseye" },
    { local: "fast-track", myPart: "Built the server routes: the whole-city action plan and an optional Claude explanation step that can only cite the app's own rules." },
    { local: "clicr" },
    { local: "lootbox" },
    { local: "jit-expression-evaluator" },
  ],
  // Set to an image path (e.g. "/photo.jpg") to replace the JF initials.
  photo: "/assets/johnny-photo.jpg",
};

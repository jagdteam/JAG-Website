export type ProjectRef =
  | { slug: string; myPart?: string }
  | { local: string; myPart?: string };

export const profile = {
  name: "Andrew Espinosa",
  title: "Software Engineer",
  blurb: [
    "Software engineer building mobile apps, backends, and testing pipelines.",
    "Master of Computer Science at UC Irvine, expected Dec 2026.",
  ],
  about: [
    [
      "I build apps end to end: mobile and web front ends, cloud backends on AWS and Postgres, and the testing pipelines that keep every release safe.",
    ],
    [
      "On the team side, I led the frontend for Clutch, an app that turns a phone into a scorekeeper for pickup basketball. I set up its React Native and TypeScript architecture and added Google sign-in and Google Maps. Clutch won ",
      {
        text: "1st place at the 2026 UCI ICS Project Expo",
        href: "https://ics.uci.edu/2026/06/12/2026-uc-irvine-ics-project-expo-breaks-records/#:~:text=2026%20Project%20Expo,could%20have%20imagined.%E2%80%9D",
      },
      ".",
    ],
    [
      "On my own, I built MyMelodic, a native iOS app for musicians with a tuner, metronome, and practice streaks. I shipped it solo in Swift with a Supabase backend and Xcode Cloud releases, and it holds a 5.0 rating on the App Store.",
    ],
    [
      "Today I'm a Software Engineer at Human Proximity, where I architected an event networking app as its sole engineer, built a four-layer testing pipeline from scratch, and made its slowest API endpoints 3x faster. Before that, as a Full-Stack Engineer Intern at VeloPrimo, I owned a 51-screen React Native app and its React web app, and deployed backend services on AWS (ECS and Aurora Postgres).",
    ],
    [
      "I'm finishing my Master of Computer Science at UC Irvine (Dec 2026), after a BA in Computer Science and a BM in Clarinet Performance at the University of Redlands.",
    ],
  ] as (string | { text: string; href: string })[][],
  contactLine: "",
  education: [
    {
      school: "University of California, Irvine",
      logo: "/assets/logos/uci.svg",
      degree: "Master of Computer Science",
      gpa: "3.8",
      date: "Expected Dec. 2026",
      place: "Irvine, CA",
    },
    {
      school: "University of Redlands",
      logo: "/assets/logos/redlands.png",
      degree: "BA in Computer Science | BM in Clarinet Performance",
      gpa: "",
      date: "April 2025",
      place: "Redlands, CA",
    },
  ],
  skills: [
    { label: "Languages", list: ["Python", "TypeScript", "Swift", "C", "Java", "SQL", "HTML/CSS"] },
    { label: "Frameworks", list: ["React", "React Native", "Expo", "FastAPI", "Flask", "Node.js", ".NET"] },
    {
      label: "Architecture & Cloud",
      list: ["System Design", "AWS (ECS Fargate, S3, Cognito)", "Firebase", "Supabase", "PostgreSQL", "REST API Integration", "Microservices"],
    },
    {
      label: "DevOps & Testing",
      list: ["Agile/Scrum", "Git", "CI/CD", "GitHub Actions", "Xcode Cloud", "Jest", "Vitest", "pytest", "Pact", "Locust", "Linux"],
    },
    {
      label: "AI & Computer Science",
      list: ["Data Structures & Algorithms", "OpenAI API", "Pinecone Vector Search", "Signal Processing (FFT)", "Claude Code", "Codex"],
    },
  ],
  contact: {
    email: "andrewde@uci.edu",
    github: "https://github.com/adespinosa14",
    linkedin: "https://linkedin.com/in/andrew-espinosa2002",
    resume: undefined as string | undefined,
  },
  projects: [
    { local: "clutch", myPart: "Led frontend architecture in React Native and TypeScript; integrated Google OAuth sign-in and Google Maps API." },
    { local: "beeseye" },
    { local: "jit-expression-evaluator" },
  ] as ProjectRef[],
  photo: "/assets/andrew-photo.jpg" as string | undefined,
};

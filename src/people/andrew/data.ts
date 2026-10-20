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
  about:
    "Software engineer who shipped a native iOS app to the App Store (5.0 rating) and architected an event networking app as sole engineer in React Native/Expo on Firebase. I am finishing my Master of Computer Science at UC Irvine (expected December 2026) after a BA in Computer Science and a BM in Clarinet Performance at the University of Redlands.",
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
      degree: "BA in Computer Science | BM in Clarinet Performance",
      gpa: "",
      date: "April 2025",
      place: "Redlands, CA",
    },
  ],
  skills: [
    { label: "Languages", list: "Python, TypeScript, Swift, C, Java, SQL, HTML/CSS" },
    { label: "Frameworks", list: "React, React Native, Expo, FastAPI, Flask, Node.js, .NET" },
    {
      label: "Architecture & Cloud",
      list: "System Design, AWS (ECS Fargate, S3, Cognito), Firebase, Supabase, PostgreSQL, REST API Integration, Microservices",
    },
    {
      label: "DevOps & Testing",
      list: "Agile/Scrum, Git, CI/CD, GitHub Actions, Xcode Cloud, Jest, Vitest, pytest, Pact, Locust, Linux",
    },
    {
      label: "AI & Computer Science",
      list: "Data Structures & Algorithms, OpenAI API, Pinecone Vector Search, Signal Processing (FFT), Claude Code, Codex",
    },
  ],
  contact: {
    email: "andrewde@uci.edu",
    github: "https://github.com/adespinosa14",
    linkedin: "https://linkedin.com/in/andrew-espinosa2002",
    resume: undefined as string | undefined,
  },
  projects: [
    { slug: "clutch", myPart: "Led frontend architecture in React Native and TypeScript; integrated Google OAuth sign-in and Google Maps API." },
    { local: "jit-expression-evaluator" },
  ] as ProjectRef[],
  photo: undefined as string | undefined,
};

// Content for the team landing page (src/pages/index.astro).
// Everything the page says lives here so copy edits never touch markup.
// Facts only: no invented numbers, clients, logos or testimonials.

/** Inline text with optional no-wrap runs, e.g. ["Live at ", { nowrap: "example.com" }, "."] */
export type Rich = (string | { nowrap: string })[];

export interface Person {
  id: "johnny" | "andrew" | "giuseppi";
  first: string;
  name: string;
  href: string;
  photo: string;
  /** Intrinsic photo size in px (square). */
  photoSize: number;
  role: string;
  bio: string;
}

export const people: Person[] = [
  {
    id: "johnny",
    first: "Johnny",
    name: "Johnny Fok",
    href: "/johnny",
    photo: "/assets/johnny-photo.jpg",
    photoSize: 384,
    role: "AI/ML and data analytics",
    bio: "Builds AI features and the data analytics behind them.",
  },
  {
    id: "andrew",
    first: "Andrew",
    name: "Andrew Espinosa",
    href: "/andrew",
    photo: "/assets/andrew-photo.jpg",
    photoSize: 400,
    role: "Mobile and full-stack",
    bio: "Builds iOS and Android apps and the web and backend code behind them.",
  },
  {
    id: "giuseppi",
    first: "Giuseppi",
    name: "Giuseppi Pelayo",
    href: "/giuseppi",
    photo: "/assets/giuseppi-photo.jpg",
    photoSize: 400,
    role: "AI/ML and computer vision",
    bio: "Builds AI features, computer vision models and the backends that run them.",
  },
];

export const teamFoot = "All three of us are finishing a Master's in Computer Science at UC Irvine and graduate in December 2026.";

// TODO: shared JAG Gmail address (swap before merge)
export const contactEmail = "jag.placeholder@example.com";

/** The hero's todo.txt window. The last item is the call to action. */
export const todo = {
  done: [
    "Win 1st place at the UCI ICS Project Expo 2026",
    "Launch BeesEye for Human Proximity, used live by 100+ people",
    "Deliver mobile and web apps for a consumer fitness platform",
    "Start a mobile app, website and admin dashboards for a sports-tech company",
  ],
  next: { label: "Build your website or app", href: "#contact" },
};

/** "Now" section. Placeholder copy: the team edits this by hand each month (and the edited date with it). */
export const now = {
  edited: "edited Oct 30",
  month: "October 2026",
  paragraphs: [
    "Right now we're building for two clients: Human Proximity, where our BeesEye work is ongoing, and a sports-tech company that needs a mobile app, a website and admin dashboards.",
    "We're also taking on new projects now and can start right away. We keep the number small so every project gets all three of us.",
  ],
  list: [
    { term: "Ongoing", text: "BeesEye, client work for Human Proximity" },
    { term: "In progress", text: "A mobile app, website and admin dashboards for a sports-tech company" },
    { term: "Open", text: "New projects, starting right away" },
    { term: "Always", text: "Answering our own email" },
  ],
  aside: ["we update this by", "hand, so it's", "always true"],
};

export interface Figure {
  kind: "image" | "video";
  /** File name shown in the window title bar. */
  file: string;
  src: string;
  /** Video poster frame. */
  poster?: string;
  alt: string;
  width: number;
  height: number;
  /** Spans both columns. */
  wide?: boolean;
  caption: Rich;
}

export interface Project {
  id: string;
  num: string;
  name: string;
  logo: string;
  /** Logo needs a dark tile behind it (transparent artwork). */
  logoTile?: boolean;
  when: string;
  lede: string;
  story: { runIn: string; text: string }[];
  resultsHead: [string, string];
  results: { label: Rich; value: string }[];
  stack: string[];
  link: { href: string; label: string };
  aside: string[];
  figures: Figure[];
}

// TODO: exact month for each entry
export const projects: Project[] = [
  {
    id: "beeseye",
    num: "01",
    name: "BeesEye",
    logo: "/projects/beeseye/logo.webp",
    when: "2026 · client work for Human Proximity, ongoing",
    lede: "A networking-event app that ranks everyone in the room by what you came for.",
    story: [
      {
        runIn: "The problem.",
        text: "At a busy event you can't tell who's worth meeting. Human Proximity wanted guests to walk in, check in, and see their best matches on one screen.",
      },
      {
        runIn: "What we built.",
        text: "A mobile-first web app. Check-in takes one screen. Your profile builds itself from a few spoken sentences or your resume. Then you get a ranked list of people, each with reasons to meet and a conversation starter.",
      },
      {
        runIn: "How it went.",
        text: "More than 100 attendees used it live at a UCI event. Then we kept going and made it faster and sharper:",
      },
    ],
    resultsHead: ["results", "before → after"],
    results: [
      { label: ["Sign-up to your first matches ", { nowrap: "(local tests)" }], value: "4.9s → 1.0s" },
      { label: ["Top-match accuracy on hard test cases"], value: "42% → 67%" },
      { label: ["API speed under load"], value: "3x faster" },
    ],
    stack: ["Next.js", "FastAPI", "Firestore", "Pinecone", "OpenAI", "GCP Cloud Run"],
    link: { href: "https://beeseye-web.vercel.app/", label: "Visit the live site" },
    aside: ["100+ people used", "this live at a UCI", "event. fig. 2 is", "what they saw."],
    figures: [
      {
        kind: "image",
        file: "beeseye-landing.jpg",
        src: "/projects/beeseye/landing.jpg",
        alt: "The BeesEye landing page: a yellow bee logo and a headline inviting event guests to check in and find their best matches.",
        width: 1440,
        height: 900,
        wide: true,
        caption: ["The landing page, still live at ", { nowrap: "beeseye-web.vercel.app" }, "."],
      },
      {
        kind: "image",
        file: "beeseye-screens-a.webp",
        src: "/projects/beeseye/beeseye-screens-a.webp",
        alt: "Three BeesEye phone screens: check-in, a profile, and a ranked list of matches.",
        width: 1600,
        height: 1000,
        caption: ["Check-in, profile and ranked matches on a phone."],
      },
      {
        kind: "video",
        file: "beeseye-demo.mp4",
        src: "/projects/beeseye/demo.mp4",
        poster: "/projects/beeseye/demo-poster.jpg",
        alt: "Screen recording walking through the BeesEye app.",
        width: 1280,
        height: 800,
        caption: ["A short walkthrough."],
      },
    ],
  },
  {
    id: "clutch",
    num: "02",
    name: "Clutch",
    logo: "/projects/clutch/logo.webp",
    logoTile: true,
    when: "2026 · our own product, in development",
    lede: "An iOS and Android app that turns a phone on a tripod into an automatic scorekeeper for pickup basketball.",
    story: [
      { runIn: "The problem.", text: "Pickup games have no stats, and nobody wants to stop playing to keep score." },
      {
        runIn: "What we built.",
        text: "A React Native app with Google sign-in and a map of rated courts. Set your phone on a tripod and play: an on-device vision model tracks the ball, the hoop and the players. A Supabase backend keeps your game history and stats. We made the marketing website too.",
      },
      { runIn: "How it went.", text: "It won the Expo, and the tracking runs right on the phone:" },
    ],
    resultsHead: ["results", "2026"],
    results: [
      { label: ["UCI ICS Project Expo 2026"], value: "1st place" },
      { label: ["Ball, hoop and player tracking on the phone"], value: "20 fps" },
      { label: ["Field-tested on recorded pickup games"], value: "10 games" },
      { label: ["Shared code for iOS and Android"], value: "1 codebase" },
    ],
    stack: ["React Native", "TypeScript", "Supabase", "Google Maps", "PyTorch", "YOLOv11", "TensorFlow Lite"],
    link: { href: "https://v0-clutch-web.vercel.app", label: "See the Clutch website" },
    aside: ["1st place at the", "Expo. we're still", "a little giddy", "about it."],
    figures: [
      {
        kind: "image",
        file: "clutch-screens-a.webp",
        src: "/projects/clutch/clutch-screens-a.webp",
        alt: "Three Clutch phone screens: the home screen, a map of rated courts, and the game-type picker.",
        width: 1600,
        height: 1000,
        wide: true,
        caption: ["Home, the court map, and picking a game type."],
      },
      {
        kind: "video",
        file: "clutch-demo.mp4",
        src: "/projects/clutch/demo.mp4",
        poster: "/projects/clutch/demo-poster.jpg",
        alt: "The Clutch tracker running on an outdoor court, drawing boxes around the players, ball and hoop.",
        width: 800,
        height: 448,
        caption: ["The tracker on an outdoor court."],
      },
      {
        kind: "image",
        file: "clutch-screens-b.webp",
        src: "/projects/clutch/clutch-screens-b.webp",
        alt: "Clutch match recap and player stats screens.",
        width: 1600,
        height: 1000,
        caption: ["The match recap and your stats afterwards."],
      },
    ],
  },
];

/** Clients we can't name. Short cards only: no logos, screenshots or names. */
export interface ConfidentialProject {
  num: string;
  lede: string;
  scope: string;
  status: string;
}

export const confidential: ConfidentialProject[] = [
  { num: "03", lede: "A sports-tech company.", scope: "Mobile app, website and admin dashboards", status: "In progress" },
  { num: "04", lede: "A consumer fitness platform.", scope: "Mobile and web apps", status: "Completed" },
];

/** Values of the contact form's "What do you need?" choice. */
export type Need = "website" | "app" | "both" | "notsure";

export const needs: { value: Need; label: string }[] = [
  { value: "website", label: "A website" },
  { value: "app", label: "An app" },
  { value: "both", label: "Both" },
  { value: "notsure", label: "Not sure yet" },
];

export const timelines = [
  { value: "", label: "Whenever works" },
  { value: "asap", label: "As soon as possible" },
  { value: "1-3", label: "In the next 1 to 3 months" },
  { value: "3-6", label: "In 3 to 6 months" },
  { value: "exploring", label: "Just exploring for now" },
];

export interface Service {
  icon: "website" | "app" | "both" | "fix";
  title: string;
  text: string;
}

export const services: Service[] = [
  {
    icon: "website",
    title: "A website",
    text: "Marketing sites and web apps that load fast, show up in search, and turn visitors into leads.",
  },
  {
    icon: "app",
    title: "An app",
    text: "iOS and Android from one codebase. We take it through App Store and Google Play review with you.",
  },
  {
    icon: "both",
    title: "Both",
    text: "One backend, one login and one design across your website and your mobile app.",
  },
  {
    icon: "fix",
    title: "Fix what you have",
    text: "We take over existing sites and apps, fix what's broken, speed them up, or redesign them.",
  },
];

// Confirmed by the team (2026-10-30). Only these promises, nothing else.
export const promises = [
  { title: "A free 30-minute intro call.", text: "No pitch deck. Just a conversation about what you need." },
  { title: "We'll write back within one business day.", text: "From one of us, not an auto-responder." },
  { title: "A fixed quote before work starts.", text: "You know the price before we write a line of code." },
  { title: "Progress at your pace.", text: "We show you working builds as often as you'd like, on the schedule that suits you." },
  { title: "Tested, reviewed and security-checked.", text: "Every change is tested, security-reviewed and checked by a second engineer before it ships." },
  { title: "You own the code and the accounts.", text: "The code and every account we set up for your project, like domain, hosting and app store listings." },
  { title: "You talk directly to the engineers.", text: "No account managers in between. Just the three of us." },
];

export interface FaqItem {
  q: string;
  a: string;
  /** Answer not yet confirmed by the team; shows a "draft" tag. */
  draft?: boolean;
}

export const faq: FaqItem[] = [
  {
    q: "What does a project cost?",
    a: "Every project is different, so we quote each one. After the free 30-minute intro call, we send you a fixed quote for the agreed scope before any work starts, so you know the full price up front. No hourly billing and no surprise invoices.",
  },
  {
    q: "How long does it take?",
    a: "It depends on the scope. A marketing website usually takes a few weeks; an app, or a website and app together, usually takes a few months. Your quote comes with a schedule, and you see progress as often as you like along the way.",
  },
  {
    q: "Who owns the code?",
    a: "You do. The code, the designs, and every account (domain, hosting, App Store and Google Play) are in your name from day one.",
  },
  {
    q: "How do you keep our data secure?",
    a: "Every change is tested and security-reviewed, and a second engineer checks it before it ships. Passwords and keys are kept in secure settings, never in the code itself. We only ask for the logins we actually need, and you can remove our access at any time. The code and accounts for your project belong to you.",
  },
  {
    q: "We already have a website. Can you work with it?",
    a: "Yes. We take over existing sites and apps, fix them, speed them up or redesign them. We start by reading what you have and telling you honestly whether to fix it or rebuild.",
  },
  {
    q: "What happens after launch?",
    a: "We stick around. We fix anything that comes up after launch and can keep building with you as you grow. We'll agree on the details of ongoing support together, up front.",
  },
];

---
company: "Human Proximity"
product: "BeesEye"
showcase:
  {
    "id": "beeseye",
    "status": "live · ongoing",
    "description": "Check in on one screen, build a profile from a few spoken sentences or a resume, then see everyone in the room ranked, with reasons to meet.",
    "tags": ["FastAPI", "Next.js", "Firestore", "Pinecone", "OpenAI API"],
    "links": [{ "label": "Website", "href": "https://beeseye-web.vercel.app/" }],
    "media":
      [
        { "src": "/projects/beeseye/demo.mp4", "poster": "/projects/beeseye/demo-poster.jpg", "alt": "BeesEye walkthrough: join an event, build a profile, see people ranked by intent, open a match and send a connect request.", "kind": "video" },
        { "src": "/projects/beeseye/landing.jpg", "alt": "BeesEye landing page: The room. One screen. People ranked by your intent.", "kind": "image" },
        { "src": "/projects/beeseye/beeseye-screens-a.webp", "alt": "BeesEye on a phone: the event home, building a profile, and the room ranked by intent.", "kind": "image" },
        { "src": "/projects/beeseye/beeseye-screens-b.webp", "alt": "BeesEye on a phone: a match with reasons to meet and conversation starters, and the connect request.", "kind": "image" },
      ],
  }
logo: "/assets/logos/human-proximity.jpg"
place: "Irvine, CA"
start: "Oct 2026"
end: "Present"
order: 1
roles:
  [
    {
      "title": "AI/ML Engineer (Contract)",
      "start": "Oct 2026",
      "end": "Present",
      "summary": "BeesEye is a matchmaking web app for in-person events, used live by 100+ attendees at a UCI event. I built the FastAPI service on GCP Cloud Run that precomputes each guest's embeddings and LLM profile, cutting time to first AI matches from 4.9s to 1.0s.",
      "stack": ["Python", "FastAPI", "GCP Cloud Run", "OpenAI API", "Next.js", "Firestore", "Pinecone"],
      "bullets":
        [
          "Built a Python (FastAPI) service on GCP Cloud Run that precomputes each guest’s OpenAI embeddings and LLM profile before they join, cutting the wait from signing up to first AI matches from 4.9s to 1.0s in local tests.",
          "Rebuilt event check in from 3 typed or spoken steps into 1 screen of tappable choices in Next.js, adding LLM resume parsing and asynchronous prefetching of each guest’s AI matching data.",
          "Made every AI call fault tolerant with 30s timeouts, per-user rate limits and fallbacks, and skipped repeat model calls by caching output on a SHA-256 profile fingerprint, backed by 114 new tests.",
          "Rewrote Firestore security rules for least privilege access, limiting each user to their own records and moving every write behind the FastAPI backend, with 25 emulator tests in CI.",
          "Closed 4 API security holes and kept emails and phone numbers out of LLM prompts, the Pinecone index and match results with Python PII filters and a backfill script for saved matches.",
        ],
    },
  ]
---

---
company: "Human Proximity"
product: "BeesEye"
showcase:
  {
    "id": "beeseye",
    "status": "live · ongoing",
    "description": "Check in with one tap, build a profile from a few spoken sentences or a resume, then see everyone in the room ranked, with reasons to meet.",
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
      "summary": "BeesEye is a matchmaking web app for in-person events, used at 2 live events. I built the FastAPI service that prepares each guest's AI profile before they join, cutting time to first matches from 4.9s to 1.0s in testing.",
      "stack": ["Python", "FastAPI", "TypeScript", "GCP Cloud Run", "OpenAI API", "Next.js", "Firestore", "Pinecone"],
      "bullets":
        [
          "Built a Python (FastAPI) pipeline on GCP Cloud Run that precomputes each guest's OpenAI embeddings and profile before they join, cutting the wait for first AI matches from 4.9s to 1.0s in testing.",
          "Developed event registration, peer QR check in, and profile flows in React (TypeScript) for an app used at 2 live events.",
          "Closed 4 API security holes and kept emails and phone numbers out of the Pinecone index and match results with a shared Python PII filter and a backfill script for saved matches.",
          "Rewrote Firestore and Storage security rules for least privilege access, closing every direct client write so changes go through the FastAPI backend.",
          "Made the prep's AI calls fault tolerant with 30s timeouts, a per-user rate limit and fallbacks, and skipped repeat model calls by caching on a profile fingerprint.",
          "Fixed an endless “Finding your best matches” spinner by saving empty rankings, with tests that reproduced the user's exact case.",
        ],
    },
  ]
---

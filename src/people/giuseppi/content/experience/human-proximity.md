---
company: "Human Proximity"
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
      "summary": "FastAPI pipeline that precomputes each guest's OpenAI embeddings, cutting time to first AI matches from 4.9s to 1.0s.",
      "stack": ["Python", "FastAPI", "OpenAI API", "Next.js", "Firestore", "Pinecone"],
      "bullets":
        [
          "Built a Python (FastAPI) pipeline that precomputes each guest’s OpenAI embeddings and profile before they join, cutting the wait from signing up to first AI matches from 4.9s to 1.0s in local tests.",
          "Rebuilt event check in from 3 typed or spoken steps into 1 screen of tappable choices in Next.js, with asynchronous prefetching of each guest’s AI matching data.",
          "Rewrote Firestore security rules for least privilege access, limiting each user to their own records and moving every write behind the FastAPI backend, with 25 emulator tests in CI.",
          "Closed 4 API security holes and kept emails and phone numbers out of the Pinecone index and match results with a shared Python PII filter and a backfill script for saved matches.",
        ],
    },
  ]
---

---
company: "Human Proximity"
logo: "/assets/logos/human-proximity.jpg"
place: "Irvine, CA"
start: "Oct. 2026"
end: "Present"
order: 1
roles:
  [
    {
      "title": "AI/ML Engineer",
      "start": "Oct. 2026",
      "end": "Present",
      "summary": "LLM matchmaking system for networking event attendees.",
      "stack":
        [
          "OpenAI API (GPT-4o-mini)",
          "Pinecone",
          "Embeddings",
          "LLM Evaluation",
          "Prompt Engineering",
        ],
      "bullets":
        [
          "Shipped an LLM matchmaking system (Pinecone retrieval, GPT-4o-mini reranking) used live at a 100+ person UCI networking event, building attendee profiles from speech or uploaded resumes.",
          "Raised top-1 match accuracy on hard test cases from 42% to 67% by tracing ranking failures to the LLM favoring reverse matches and a company-name matching bug overriding its picks, then shipping fixes for both.",
          "Built an LLM evaluation benchmark in Python tracking top-1 accuracy, MRR, latency, and cost with confidence intervals across simulated events and adversarial test cases.",
          "Cut cost per ranking call 37% by trimming the prompt and unused model output, and added a per-user Firestore ranking cache to the FastAPI backend on GCP Cloud Run to block repeat calls.",
        ],
    },
  ]
---

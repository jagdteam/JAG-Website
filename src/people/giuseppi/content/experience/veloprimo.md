---
company: "VeloPrimo"
logo: "/assets/logos/veloprimo.png"
place: "Irvine, CA"
start: "July 2026"
end: "Oct 2026"
order: 2
roles:
  [
    {
      "title": "AI/ML Engineer Intern",
      "start": "July 2026",
      "end": "Oct 2026",
      "summary": "LLM agent orchestration on AWS Bedrock that routes each question to a specialist agent, raising routing accuracy from 79% to 95%.",
      "stack": ["Python", "AWS Bedrock", "RAG", "LLM Judges", "PostgreSQL", "PyTorch"],
      "bullets":
        [
          "Built the LLM agent orchestration layer on AWS Bedrock that routes each question to a specialist agent, raising intent routing accuracy from 79% to 95% on a hard test set of 62 questions.",
          "Grounded the cycling AI assistant’s answers with a retrieval (RAG) pipeline that cites its sources and a knowledge base validated in CI, and wrote 160 blind red team prompts to test its safety guardrails.",
          "Developed a Python evaluation framework with blind LLM judges and holdout test sets that blocked 7 regressions from shipping and benchmarked 3 models on 282 questions to pick the production model.",
          "Took the assistant from a laptop prototype to production on AWS with durable conversation memory and PostgreSQL Row Level Security on riders’ chats and saved bikes, merging 130 pull requests.",
          "Built an image retrieval pipeline in Python and PyTorch that identifies products from photos with vision embeddings, and fixed a data loader bug that had hidden 41 of 54 real photos from every accuracy test.",
        ],
    },
  ]
---

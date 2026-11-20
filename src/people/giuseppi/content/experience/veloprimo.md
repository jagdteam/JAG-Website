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
      "summary": "Cycling AI assistant: image retrieval, LLM agent orchestration and evaluation, deployed on AWS with 130 merged pull requests.",
      "stack": ["Python", "AWS", "RAG", "LLM Judges", "PostgreSQL", "PyTorch"],
      "bullets":
        [
          "Built an image retrieval pipeline in Python and PyTorch that identifies products from photos with vision embeddings, and fixed a data loader bug that had hidden 41 of 54 real photos from every accuracy test.",
          "Chose the vision embedding backbone with a paired statistical test on held out real photos.",
          "Deployed the cycling AI assistant to AWS with durable conversation memory and PostgreSQL Row Level Security on riders' chats and saved bikes.",
          "Built the LLM agent orchestration on AWS that sends each rider's question to the right specialist agent, and caught that a third of its accuracy test reused the prompt's own examples, then replaced it with new questions.",
          "Grounded the assistant's answers with a retrieval (RAG) pipeline that cites its sources and a knowledge base validated in CI, and wrote 160 blind red team prompts to test its safety guardrails.",
          "Developed a Python evaluation framework with blind LLM judges that benchmarked 3 models on 282 questions to pick the production model, and kept 7 changes that missed their bars out of production.",
          "Merged 130 pull requests across 5 codebases in 12 weeks.",
        ],
    },
  ]
---

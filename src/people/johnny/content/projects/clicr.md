---
name: "CliCR"
status: "completed"
order: 4
oneLiner: "Terminal tool that answers questions about a codebase with citations to file and line, running on local models through Ollama."
team: "solo"
tags: ["Python", "RAG", "Ollama", "tree-sitter", "Evaluation"]
description: "Terminal tool that answers questions about a codebase with citations to file and line. tree-sitter splits code into functions and classes; vector search and BM25 keyword search (SQLite FTS5) are merged with reciprocal rank fusion; an optional cross-encoder reranker and one-hop call-graph expansion add precision. Chat and embeddings run locally through Ollama, and an ablation eval on pinned questions measures what each retrieval stage adds. The browser demo runs the same hybrid search over Flask's source on your device."
repo: "https://github.com/jagdteam/clicr"
explore: { href: "/projects/clicr/demo/", label: "Try it in your browser" }
media: [{ src: "/projects/clicr/diagram.png", alt: "Diagram: CliCR indexes code into 500-character chunks embedded with Cohere into ChromaDB, then answers questions by retrieving the top 5 chunks for Command R+ with cited source files.", kind: "image" }]
thumb: "/projects/clicr/thumb.webp"
thumbFit: "contain"
---

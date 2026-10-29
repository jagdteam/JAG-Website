---
name: "CliCR"
status: "completed"
order: 4
oneLiner: "Terminal tool that answers questions about a codebase with citations to file and line, running on local models through Ollama."
team: ["Johnny", "Giuseppi"]
tags: ["Python", "RAG", "Ollama", "tree-sitter", "Evaluation"]
description: "Terminal tool that answers questions about a codebase with citations to file and line. tree-sitter splits code into functions and classes; vector search and BM25 keyword search (SQLite FTS5) are merged with reciprocal rank fusion; one-hop call-graph expansion, on by default, adds the definitions of functions the matches call. A cross-encoder reranker was measured and left off because it lowered accuracy on code. Chat and embeddings run locally through Ollama, and an ablation eval on pinned questions measures what each retrieval stage adds. The browser demo runs the same hybrid search over Flask's source on your device."
repo: "https://github.com/jagdteam/clicr"
explore: { href: "/projects/clicr/demo/", label: "Try it in your browser" }
media: [{ src: "/projects/clicr/demo-browser.mp4", poster: "/projects/clicr/demo-browser-poster.jpg", alt: "The in-browser demo, styled like a code editor: an example question about Flask plays by itself, each search step lights up the matching code in the editor, and it ends on the recorded answer with a citation that points to the url_for function in helpers.py.", kind: "video" }, { src: "/projects/clicr/demo.mp4", poster: "/projects/clicr/demo-poster.jpg", alt: "Terminal recording: clicr indexes its own repository, answers a question with cited code panels, then shows the ranking table from --explain.", kind: "video" }, { src: "/projects/clicr/diagram.png", alt: "Architecture diagram: an indexing lane (walk files, tree-sitter chunks, embed, SQLite store with FTS5 keyword index, vectors and call graph) and an asking lane (vector and BM25 search, reciprocal rank fusion, optional rerank, graph expansion, context packing, cited answer).", kind: "image" }]
thumb: "/projects/clicr/thumb.webp"
thumbStill: "/projects/clicr/thumb-static.webp"
---

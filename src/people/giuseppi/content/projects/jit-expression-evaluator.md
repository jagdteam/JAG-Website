---
name: "Just-in-Time Compiler Expression Evaluator"
status: "completed"
order: 2
oneLiner: "Built a C runtime compiling math expressions on the fly with GCC, dynamically linking output and executing generated machine code in-process."
team: "solo"
tags: ["C", "GCC"]
explore: { href: "/projects/jit-v2/demo/", label: "Try the upgraded version live" }
media: [{ src: "/projects/jit/demo.mp4", poster: "/projects/jit/demo-poster.jpg", alt: "Terminal: the evaluator compiles the expression 1-1 with gcc in a child process, loads it, and prints 0.500000 after sigmoid.", kind: "video" }, { src: "/projects/jit/diagram.png", alt: "Diagram: expression, parse, generate C, compile with gcc in a forked child, dlopen and dlsym, run evaluate and sigmoid.", kind: "image" }, { src: "/projects/jit-v2/demo-desktop.png", alt: "The upgraded version's live demo page: a formula box with its derivative and value, a graph with a ball rolling down to the lowest point, and a terminal-style log printing each gradient-descent step.", kind: "image" }]
thumb: "/projects/jit/thumb.webp"
thumbFit: "contain"
repo: "https://github.com/giuseppi/JIT-Compiler"
---

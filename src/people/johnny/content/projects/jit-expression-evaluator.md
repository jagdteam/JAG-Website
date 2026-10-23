---
name: "Just-in-Time Compiler"
status: "completed"
order: 6
oneLiner: "A from-scratch compiler for math in C: it optimizes the formula, writes x86-64 machine code straight into memory, and runs live in your browser through WebAssembly."
team: "solo"
tags: ["C", "x86-64", "WebAssembly", "Compilers"]
repo: "https://github.com/JohnFok119/JIT-Compiler"
explore: { href: "/projects/jit-v2/demo/", label: "Try it live" }
media: [{ src: "/projects/jit-v2/demo.mp4", poster: "/projects/jit-v2/demo-poster.jpg", alt: "Terminal clip of the jit command: it evaluates 2 + 3 * 4, checks that sin(x)^2 + cos(x)^2 equals 1 at x=0.7, prints the x86-64 assembly for x*x + 3*x, differentiates x^3 + sin(x)*x symbolically, benchmarks a polynomial over a million runs, and finally shows a parse error with a caret under the unclosed bracket.", kind: "video" }, { src: "/projects/jit-v2/pipeline.png", alt: "Diagram of the compiler pipeline: the formula is split into tokens, parsed into a tree, turned into a simplified step-by-step form, optimized, then sent to a backend that interprets it, writes x86-64 machine code, builds it with GCC, or emits WebAssembly.", kind: "image" }, { src: "/projects/jit-v2/demo-desktop.png", alt: "The live demo page: a formula box holding x^2 - 2*x + sigmoid(3*x), tabs showing each stage of the engine with x86-64 machine code open, a graph of the curve with a ball rolling to its lowest point, and a race showing the compiled version 1.6 times faster than the step-by-step one.", kind: "image" }]
thumb: "/projects/jit-v2/thumb.webp"
thumbFit: "contain"
---

---
name: "Just-in-Time Compiler Expression Evaluator"
status: "completed"
order: 2
oneLiner: "Built a C runtime compiling math expressions on the fly with GCC, dynamically linking output and executing generated machine code in-process. The upgraded version adds its own optimizer, writes x86-64 machine code straight into memory, and runs live in the browser through WebAssembly."
team: "solo"
tags: ["C", "GCC", "x86-64", "WebAssembly"]
explore: { href: "/projects/jit-v2/demo/", label: "Try it live" }
media: [{ src: "/projects/jit-v2/demo-browser.mp4", poster: "/projects/jit-v2/demo-browser-poster.jpg", alt: "The live browser demo: a formula is picked from the examples, compiled to WebAssembly and graphed with its derivative; Find the lowest point rolls a ball down the curve while the descent log prints every step, ending at the minimum.", kind: "video" }, { src: "/projects/jit-v2/demo.mp4", poster: "/projects/jit-v2/demo-poster.jpg", alt: "Terminal clip of the jit command: it evaluates 2 + 3 * 4, checks that sin(x)^2 + cos(x)^2 equals 1 at x=0.7, prints the x86-64 assembly for x*x + 3*x, differentiates x^3 + sin(x)*x symbolically, benchmarks a polynomial over a million runs, and finally shows a parse error with a caret under the unclosed bracket.", kind: "video" }, { src: "/projects/jit-v2/under-the-hood.mp4", poster: "/projects/jit-v2/under-the-hood-poster.jpg", alt: "The Under the hood panel of the live demo for the formula x*x + 3*x, clicking through its tabs in compiler order: Tokens, Tree, Steps, WebAssembly, and finally the x86-64 machine code.", kind: "video" }, { src: "/projects/jit-v2/under-the-hood.png", alt: "The Under the hood panel for x*x + 3*x on the Machine code (x86-64) tab: the x86-64 instructions this compiler writes, ending in ret and the constant pool.", kind: "image" }, { src: "/projects/jit-v2/demo-desktop.png", alt: "The browser demo page: a formula box with its derivative and value, a graph with a ball rolling down to the lowest point, and a terminal-style log printing each gradient-descent step", kind: "image" }]
thumb: "/projects/jit/thumb.webp"
thumbFit: "contain"
---

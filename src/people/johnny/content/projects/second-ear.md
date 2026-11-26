---
name: "SecondEar"
status: "live demo"
order: 3
oneLiner: "A PyTorch model that pinpoints where sounds come from, and a live 3D café that simulates one-sided hearing loss, inspired by my own one-sided deafness."
team: "solo"
tags: ["PyTorch", "Three.js", "Python", "STARSS23"]
description: "SecondEar asks how much a sound-locating model loses when it only hears with one ear, the way I do. I built a PyTorch model that draws a heat map of where sounds come from. With one ear its error rose from 24.9° to about 45° (300 simulated scenes), and on 46 real recordings only two ears beat chance at telling left from right. The live demo is a 3D pixel café built in Three.js: sit in my seat for thirty seconds, flip between Two ears and My ear to hear it the way I do, then see from above where each model thought every sound came from. In the café, two ears find 50% of sounds and the right ear alone finds 11%."
repo: "https://github.com/JohnFok119/second-ear"
demo: "https://second-ear-web.vercel.app"
media: [{ src: "/projects/second-ear/cafe-tour.mp4", poster: "/projects/second-ear/cafe-tour-poster.webp", alt: "The live café demo: from my seat facing a friend across the table, the view lifts to an overhead view where teal markers (two ears) and pink markers (one ear) point to where each model thinks a sound came from, and yellow rings show where it really was.", kind: "video" }, { src: "/projects/second-ear/cafe-seat.webp", alt: "Showcase section 'Sit in my seat at the café': a pixel-art friend talks across the table, with instructions to flip to My ear and hear every sound arrive from the same side.", kind: "image" }, { src: "/projects/second-ear/cafe-overview.webp", alt: "See from above: the whole café with 'You' in the middle, teal lines for the two-ear model's guesses, pink for the one-ear model's, and yellow rings on the real sounds; at this moment two ears found 1 of 3 sounds and one ear found 0 of 3.", kind: "image" }]
thumb: "/projects/second-ear/thumb.webp"
---

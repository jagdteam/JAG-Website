---
name: "Clutch"
status: "1st place · 2026 UCI ICS Project Expo"
order: 1
oneLiner: "iOS and Android app that turns a phone on a tripod into an automatic scorekeeper for pickup basketball."
team: ["Johnny", "Andrew", "Giuseppi", "Dylan"]
tags: ["PyTorch", "YOLOv11", "TensorFlow Lite", "React Native", "Supabase"]
description: "Clutch watches a pickup game through the phone's camera and keeps score on its own. A YOLOv11n detector finds the ball, hoop and players at 20 frames per second on the phone, a 26-keypoint court model maps them onto the court, and a shot state machine infers shot attempts, 2- vs 3-point shots, and possession. Field-tested on 10 recorded games."
thumb: "/projects/clutch/logo.webp"
thumbFit: "contain"
media: [{ src: "/projects/clutch/demo.mp4", poster: "/projects/clutch/demo-poster.jpg", alt: "Clutch tracking two players, the ball and the hoop on an outdoor court.", kind: "video" }]
explore: { href: "https://v0-clutch-web.vercel.app", label: "Website" }
demo: "https://v0-clutch-web.vercel.app"
---

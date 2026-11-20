---
name: "Clutch"
status: "1st place · 2026 UCI ICS Project Expo"
order: 1
oneLiner: "Cross-platform phone app (React Native) that turns a phone on a tripod into an automatic scorekeeper for pickup basketball."
team: ["Johnny", "Andrew", "Giuseppi", "Dylan"]
tags: ["PyTorch", "YOLO11", "TensorFlow Lite", "React Native", "Supabase"]
description: "Clutch watches a pickup game through the phone's camera and keeps score on its own. A YOLO11n detector finds the ball, hoop and players on the phone with a 20 frames per second target, tracking follows each player and the ball, and a shot state machine detects shot attempts, makes and misses, and possession."
thumb: "/projects/clutch/logo.webp"
thumbFit: "contain"
media: [{ src: "/projects/clutch/demo.mp4", poster: "/projects/clutch/demo-poster.jpg", alt: "Clutch tracking two players, the ball and the hoop on an outdoor court.", kind: "video" }, { src: "/projects/clutch/clutch-screens-a.webp", alt: "Clutch app screens: the home screen with an overall rating, a map of rated courts, and choosing a game type.", kind: "image" }, { src: "/projects/clutch/clutch-screens-b.webp", alt: "Clutch app screens: a 21-14 match recap with box score and a player's advanced stats.", kind: "image" }]
explore: { href: "https://v0-clutch-web.vercel.app", label: "Website" }
demo: "https://v0-clutch-web.vercel.app"
bullets:
  - "Built real-time computer vision for iPhone in React Native (TypeScript) that tracks players and the ball, using ByteTrack style tracking and Kalman filters that coast through short occlusions."
  - "Labeled 1,944 frames with Johnny and fine-tuned custom YOLO detectors on them, running on the phone with TensorFlow Lite at a 20 FPS target."
  - "Wrote the shot state machine that detects shot attempts, makes and misses on the phone, plus its Python twin in our test harness."
  - "Traced a hoop detector that drew two giant boxes on new courts to loose labels with an A/B test, then wrote rim-only labeling rules that brought it to one tight box on the rim at 0.91 confidence."
  - "Upgraded the Python harness tracker from ByteTrack to OC-SORT and rebuilt the make/miss logic, reaching 10/10 makes with no false points on a 21 shot test."
  - "Pulled steals from the MVP after auditing 3 labeled 1v1 clips and finding 16 fake steals and 0 real ones."
  - "Built the Node.js (Express, TypeScript) API, writing its first 34 endpoints, and the PostGIS courts table behind the court map."
---

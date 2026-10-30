---
name: "Flip Assistant"
status: "in progress"
order: 2
oneLiner: "A free, local RuneLite plugin that tells you what to flip on the Grand Exchange, at what price, and why."
team: ["Johnny", "Giuseppi"]
tags: ["Java", "RuneLite", "Python", "Parquet", "LightGBM"]
description: "Flip Assistant is a RuneLite plugin for Old School RuneScape that suggests what to buy and sell on the Grand Exchange, at what price and in what quantity, and tracks profit. The panel adds live trading-style price charts and a high-alch tracker. It builds on the open-source (BSD-2) client of the Flipping Copilot plugin and only advises: the one automated step is filling in the suggested price with the E key. A Python pipeline collects prices every 5 minutes from the OSRS Wiki real-time prices API, backfills price history to 2021 and exports daily snapshots, which feed a LightGBM price model in progress. Not released yet."
media: [{ src: "/projects/flip-assistant/flip-assistant-tour.mp4", poster: "/projects/flip-assistant/poster.jpg", alt: "Silent slow-panning walkthrough of the side suggestion panel, the price chart, the high alchemy table and the cards view (illustrative demo data).", kind: "video" }, { src: "/projects/flip-assistant/price-chart.png", alt: "Large price chart for Ranarr weed with instant buy and sell quotes, margin details, recent prices and a table of Grand Exchange offers (illustrative demo data).", kind: "image" }, { src: "/projects/flip-assistant/live-cards.png", alt: "Cards view showing small price charts for items on the Grand Exchange, pinned and watched, with a larger chart and quote panel on the right (illustrative demo data).", kind: "image" }, { src: "/projects/flip-assistant/high-alch.png", alt: "High alchemy table ranking items by profit per cast, with session totals and buy limits above it (illustrative demo data).", kind: "image" }, { src: "/projects/flip-assistant/side-suggestion.png", alt: "Narrow RuneLite side panel showing a flip suggestion to buy 1,800 Ranarr weed, with a small price chart, volume bars, a \"Next up\" list and session profit (illustrative demo data).", kind: "image" }]
thumb: "/projects/flip-assistant/thumb.webp"
---

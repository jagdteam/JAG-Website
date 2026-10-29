---
name: "Flip Assistant"
status: "in progress"
order: 2
oneLiner: "A free, local RuneLite plugin that tells you what to flip on the Grand Exchange, at what price, and why."
team: ["Johnny", "Giuseppi"]
tags: ["Java", "RuneLite", "Python", "Parquet", "LightGBM"]
description: "Flip Assistant is a RuneLite plugin for Old School RuneScape that suggests what to buy and sell on the Grand Exchange, at what price and in what quantity, and tracks profit. The panel adds live trading-style price charts and a high-alch tracker. It builds on the open-source (BSD-2) client of the Flipping Copilot plugin and only advises: the one automated step is filling in the suggested price with the E key. A Python pipeline collects prices every 5 minutes from the OSRS Wiki real-time prices API, backfills price history to 2021 and exports daily snapshots, which feed a LightGBM price model in progress. Not released yet."
---

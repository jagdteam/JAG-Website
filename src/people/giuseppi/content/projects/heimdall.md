---
bullets:
  - "Built the store-then-acknowledge step in our Python server with MQTT and InfluxDB, so none of the signed sensor readings sent every 5 seconds are lost to a crash or reconnect."
  - "Closed an MQTT session takeover flaw that let any device knock the server offline and wipe its queued readings."
  - "Built Grafana monitoring in Docker that tracks the drone's altitude and alerts when it gets too close to the ceiling."
  - "Wrote a Python (PyAV) reader that decodes the drone's live video with frame timestamps."
  - "Building YOLOv8 and ByteTrack people counting on the drone's video, now in review."
name: "Heimdall"
status: "in progress"
order: 1.5
oneLiner: "A GPS-free indoor drone system where a signed sensor node gives the drone a trusted height reading, with monitoring and video from the drone."
team: ["Johnny", "Andrew", "Giuseppi"]
tags: ["Python", "MQTT", "InfluxDB", "Grafana", "YOLOv8"]
description: "Heimdall is our UCI IoT class project. A sensor node signs each reading in hardware and sends it over MQTT, and a Python server stores every reading in InfluxDB before confirming it, so nothing is lost to a crash or reconnect. The node's graded test is a 72 hour run on a power bank, coming up this month. A Grafana dashboard shows the drone's altitude, with a ceiling alert. We're now building the vision side: ORB-SLAM3 tracks the drone's position, and YOLOv8 with ByteTrack places the people it sees on a live tactical map."
---

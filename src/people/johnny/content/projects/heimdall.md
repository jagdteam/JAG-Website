---
bullets:
  - "Wrote C++ ESP32 firmware for a sensor node that gives a GPS-less indoor drone a trusted altitude reference, signing each air-pressure reading in a secure chip (ECDSA P-256) and streaming it over MQTT with TLS."
  - "Replaced the drone's locked-down stock app with a ground control desktop app built from scratch (Electron, TypeScript), adding live video piped to our vision code, full flight logging, and custom controls."
  - "Building a hold mode to keep the drone in place, after measuring sideways drift its own sensors miss (up to 45 cm in 5 s hands-off, while its speed reads 0) with a camera tracker (Python, OpenCV optical flow)."
name: "Heimdall"
status: "in progress"
order: 1.5
oneLiner: "A GPS-free indoor drone system where a signed sensor node gives the drone a trusted height reading, with our own ground control app and vision on the drone's video."
team: ["Johnny", "Andrew", "Giuseppi"]
tags: ["C++", "ESP32", "TypeScript", "Electron", "MQTT", "OpenCV"]
description: "Heimdall lets a small drone fly indoors, where there is no GPS. A fixed sensor node signs each air-pressure reading in a secure chip and sends it over MQTT with TLS, so the drone can correct its height against a reading it can trust, and a Python server stores every reading before confirming it. I wrote the node's firmware and a ground control desktop app that replaces the drone's locked-down stock app, with live video piped to our vision code, full flight logging and custom controls. Now I'm building a hold mode that keeps the drone in place, after measuring sideways drift its own sensors miss. The team is also building the vision side: tracking the drone's position and placing the people it sees on a live map."
---

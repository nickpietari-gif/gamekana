---
type: Capability Overview
title: Shared game UI
description: Moving viewport, guided anvil SVG, keyboard controls, and persistence bridge.
---
# Shared game UI

`src/main.ts` composes a centered 16×10 CSS Grid camera viewport, nearby clickable stones, the position marker/anvil, jump and directional controls, inventory, ordered guided SVG stroke selection, and visible save errors. `src/style.css` uses only local CSS and SVG geometry under strict CSP and aims to fit compact Desktop windows. `src/persistence.ts` uses the narrow Electron bridge or isolated browser-local storage for preview. Native behavior still requires manual acceptance.

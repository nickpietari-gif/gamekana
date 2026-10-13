---
type: Module Contract
title: UI and persistence port contract
description: Compact CSP-safe field rendering and save-before-commit for forge actions.
---
# UI and persistence port contract

`shared` owns viewport composition, keyboard/pointer accessibility, jump direction from last movement, anvil guidance and visible save-error recovery; it cannot import Electron or Node APIs. `window.desktopProgress` exposes only `loadProgress` and `saveProgress`. Searching, depositing and each placed stroke must be saved before its result is committed to visible inventory/collection. Failed writes block new mutations until Retry succeeds. Walking/jumps remain in-memory until the next persisted action. Do not use inline CSS styles to position world cells under the restrictive CSP.

---
type: Usage Guide
title: Night Field gameplay
description: Controls, expanding map, stroke assembly and saved progress behavior.
---
# Usage

Walk the field with **WASD** or **arrow keys**. The camera keeps the player near the center of the 16×10 viewport and brings more stones into view as you move. The top line shows world coordinates. The base/anvil is fixed at `(2, 7)`, and the panel below the field shows its Manhattan distance in tiles.

Approach a **white stone** and press **E** or click it. Each stone can be checked only once: it contains **one green stick** or **nothing**. A flipped stone still blocks normal walking; face it (try moving toward it) and press **Space** or the Jump button to land two tiles ahead, provided that tile is empty. Fresh procedural stones continue beyond the original field.

Return near the base, and press **E** or the Deposit button to move carried sticks into base storage. The anvil shows the next uncrafted vowel (`あ → い → う → え → お`). Its dashed outline is divided into numbered strokes. Click the next stroke on the guide or press its number **1**, **2** or **3**. One stored stick becomes one green stroke; selecting a later stroke first has no cost. An incomplete kana stays on the anvil until you finish it, including across restarts. The number of required sticks is `3, 2, 2, 2, 3` respectively.

**These stroke drawings are schematic gameplay guides, not finalized handwriting-teaching examples.** The first five vowels are currently the only forgeable kana. A message appears when all five are complete.

## Local storage

The Electron host uses `progress.exploration.v1.json` under the app's OS-specific `userData` directory. The path is kept to preserve first-field saves; new documents use **profile format V2**. Existing V1 exploration saves are migrated in memory on load and remain untouched until a successful game interaction triggers a V2 write. Original quiz saves in `progress.v1.json` are never touched. Browser preview uses its own `hiragana-aero-exploration-preview-v1` key.

Malformed/future-version files are not reset. Errors appear in the UI and block further saved actions until Retry succeeds. Movement-only changes are not immediately persisted; a search, deposit or placed stroke records the position.

## Developer commands

```bash
npm run build
sh ./run_checks.sh
npm run dev
```

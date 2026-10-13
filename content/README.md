---
type: Capability Overview
title: Kana and world content
description: Bundled kana catalog, deterministic field stones, and five vowel stroke templates.
---
# Kana and world content

`src/kana.ts` provides the 46 basic hiragana and established row ordering. `src/field.ts` preserves the original fourteen stone IDs and outcomes inside the initial 16×10 area, and deterministically generates further stones by world-coordinate hash with empty corridors. It also owns five ordered vowel recipes and schematic SVG guide paths. These paths are prototype interaction geometry, **not reviewed handwriting instructions**. No module imports or I/O are allowed in `content`. See `contract.md`.

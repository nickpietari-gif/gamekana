---
type: Implementation
title: Current implementation
description: Implemented field, guided assembly, persistence, and remaining limitations.
---
# Current implementation

## Sources

- `content/src/kana.ts`: 46 unique basic hiragana in ten original groups.
- `content/src/field.ts`: 14 legacy stones, anvil and spawn, five vowel recipes with schematized SVG stroke paths, deterministic coordinate-based stone generation outside the starter region.
- `learning/src/exploration.ts`: pure movement, two-cell jump over a searched stone, binary stone results, deposits and ordered stroke placement.
- `progress/src/profile.ts`: V2 profile parsing and resource-economy checks, plus V1 exploration-profile migration.
- `shared/src/main.ts`: moving 16×10 viewport, field controls, anvil guide selection, save/error handling.
- `shared/src/style.css`: asset-free low-palette CSS Grid layout and SVG stroke styling under strict CSP.
- `shared/src/persistence.ts`: narrow Desktop bridge with isolated browser-preview localStorage.
- `desktopApp/main.cjs`, `desktopApp/preload.cjs`, `desktopApp/progress-store.cjs`: isolated Electron host and serialized, bounded atomic JSON storage.

## Implemented

The player can explore beyond the old fixed map, search procedurally placed stones, jump over flipped stones when there is a free landing tile, deposit green sticks, and assemble `あ い う え お` in order. Each correct stroke consumes a single stored stick, and partial assembly survives save/reload. New profiles use `formatVersion: 2` in the existing exploration save path. Legacy V1 exploration progress is read and migrated in memory, and written back as V2 only after the next successful interaction. Invalid profiles fail visibly without overwrite.

## Limits

- Stroke SVG guides are hand-authored schematic shapes; they are **not validated Japanese calligraphy training diagrams**. This slice is a gameplay interaction prototype. Confirm stroke shapes/order with a qualified educator before teaching handwriting.
- Generated stones are coordinate-deterministic, with a low density and empty corridors, rather than a Minecraft-style chunk/biome engine. Player coordinates are bounded to ±1,000,000 per axis for safe persistence; the world behaves as unbounded for ordinary play.
- Save size is bounded to 1 MiB, and the profile validator to 50,000 inspected stones. Huge expeditions require a future compact chunk-store format.
- Moving/jumping without interacting changes the in-memory position; stone search, deposit and each successful stroke persist the current position. There is no autosave on every step.
- Remaining 41 kana and group progression are not implemented. No sounds, procedural weather, remote services or installed package distribution.

Native Electron launch, final UI geometry on a 13-inch Mac, focus accessibility, and save/restart behavior in the real host still require manual acceptance.

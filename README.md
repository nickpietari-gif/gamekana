---
type: Project Overview
title: Hiragana Aero
description: Local-first desktop hiragana adventure with an expanding field and guided stroke assembly.
---
# Hiragana Aero

Hiragana Aero is a **local-first Desktop** game for learning the 46 basic hiragana. Its minimalist nighttime field has a dark blue sky, black ground and character, white stones, and green found fragments.

## Playable prototype 02

- **Walk** with WASD/arrow keys. The camera follows the player as the field extends beyond the first 16×10 area.
- **Search** a reachable white stone with `E` or a click. Its outcome (one green stick or nothing) is fixed and can only be discovered once.
- **Jump** over a previously flipped stone with `Space`, while facing the stone, if the landing cell is empty.
- **Return to the anvil** at world coordinate `(2, 7)` and deposit carried sticks with `E`.
- **Assemble** the first five vowel kana (`あ い う え お`) one stroke at a time. Click the next stroke guide or press `1`, `2`, or `3` near the anvil. One stored stick becomes one stroke; incorrect order consumes nothing.
- **Continue** an incomplete assembly after restart. Finished kana and searched stones are persisted. New field stones are generated deterministically from coordinates, not downloaded.

The SVG stroke guides are intentionally **schematic prototype drawings**, not reviewed handwriting instruction. The full reference catalog contains 46 kana, but only the five vowels are forgeable in this slice.

The original quiz save is untouched. A previous first-field exploration save can be loaded and migrated from the original V1 profile; the physical file name remains `progress.exploration.v1.json` to preserve compatibility even though the new payload is format V2.

## Architecture

```text
content             -> (no internal dependencies)
learning            -> content
progress            -> content, learning
shared              -> content, learning, progress
Desktop host        -> local data files through a narrow preload API
```

`content/` owns the catalog, stable starter stones, generated field rules and five stroke templates. `learning/` owns pure movement, jumps, searching, deposits and assembly rules. `progress/` validates and migrates saved profiles. `shared/` renders a moving viewport, anvil and keyboard-accessible actions. `desktopApp/` owns restricted Electron I/O. See capability contracts and the [active specification](docs/specs/active/subspecs/playable-level-loop.md).

## Quick start

Requires Node.js 22+, npm, and an Electron-compatible desktop OS. Network access is needed only for initial dependency installation.

```bash
npm install
npm run dev
```

```bash
sh ./run_checks.sh
```

The browser preview after `npm run build` uses separate browser-local storage. Native Desktop acceptance remains pending. For developer workflow, see `AGENTS.md`, `docs/INSTALLATION.md` and `docs/TESTS.md`.

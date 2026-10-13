---
type: Changelog
title: Hiragana Aero changes
description: High-level milestones and developer-accepted changes.
---
# Changelog

## Unreleased — prototype 02 expanding field and vowel assembly

- Preserved starter stones and added deterministic, camera-scrolling exploration outside the first 16×10 cells.
- Added one-stone jumps over previously inspected stones with empty landing checks.
- Added guided, ordered shard-to-stroke assembly for `あ い う え お` and restartable partial work.
- Migrated V1 exploration progress into a V2 resource-conserving profile without changing the save path or touching quiz saves.
- Reworked compact workshop UI with CSP-safe SVG guides, keyboard and pointer input.
- Added regression tests for procedural stones, jumping, five recipes, save migration and UI structure; native Mac acceptance remains pending.

## Earlier prototype

- Built a minimal night field, search/deposit/first あ forge loop, Electron persistence adapter and UI layout fixes.

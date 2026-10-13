---
type: Feature Catalog
title: Hiragana Aero stable feature IDs
description: Stable cross-specification vocabulary for MVP capabilities and extension seams.
---
# Feature catalog

Feature IDs name lasting capabilities, not implementation tasks or current statuses. Requirements and specifications use their own IDs. Status is owned by `ROADMAP.md`.

- `CONTENT.BASIC_HIRAGANA` — authoritative 46 basic hiragana entries with reading labels. Owner: `content`.
- `CONTENT.RECIPE_BOOK` — grouped progression sets and generic shard costs for each forgeable kana. Owner: `content`.
- `CONTENT.FIELD_LAYOUTS` — sparse field/base layout metadata, stone placement rules, and interaction markers. Owner: `content`.
- `GAME.EXPLORATION_FIELD` — top-down movement and world-state transitions on the active field. Owner: `learning` and `shared`.
- `GAME.STONE_SEARCH` — inspect/flip stones; each stone yields either one shard or nothing. Owner: `learning`.
- `GAME.SHARD_INVENTORY` — carrying and storing generic shards at the base/anvil. Owner: `learning`, persisted by `progress`.
- `GAME.FORGE_CRAFTING` — spend stored shards to forge hiragana on the anvil. Owner: `learning`, persisted by `progress`.
- `GAME.KANA_COLLECTION` — ordered completion of hiragana groups and a record of forged syllables. Owner: `progress`.
- `STORAGE.LOCAL_PROGRESS` — offline progress persistence with versioned validation. Owner: `progress` and Desktop adapter.
- `PLATFORM.DESKTOP` — Electron application lifecycle, isolated filesystem bridge, Desktop controls. Owner: `desktopApp`.
- `UI.MINIMAL_NIGHT_FIELD` — low-color minimalist rendering, readable HUD, and reduced-motion support. Owner: `shared`.
- `TESTING.DETERMINISTIC_LOCAL` — repeatable game and repository validation without network services. Owner: repository.

Add new IDs only for distinct durable capabilities. Keep IDs stable even after their original implementation specs are archived.

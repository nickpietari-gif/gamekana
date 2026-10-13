---
type: Specification
title: Initial minimalist Hiragana Aero desktop product
description: MVP umbrella for offline exploration, shard collection, and kana forging.
document_role: umbrella
spec_status: active
current_focus: subspecs/playable-level-loop.md
---
# Initial minimalist Hiragana Aero desktop product

## Status

Active umbrella. The earlier quiz prototype is no longer the target product shape. The repository is being redirected toward a minimalist exploration/crafting MVP. Current bounded focus: `subspecs/playable-level-loop.md`.

## Feature scope

- `CONTENT.BASIC_HIRAGANA`
- `CONTENT.RECIPE_BOOK`
- `CONTENT.FIELD_LAYOUTS`
- `GAME.EXPLORATION_FIELD`
- `GAME.STONE_SEARCH`
- `GAME.SHARD_INVENTORY`
- `GAME.FORGE_CRAFTING`
- `GAME.KANA_COLLECTION`
- `STORAGE.LOCAL_PROGRESS`
- `PLATFORM.DESKTOP`
- `UI.MINIMAL_NIGHT_FIELD`
- `TESTING.DETERMINISTIC_LOCAL`

## Goal

Deliver an encouraging, highly readable, standalone desktop game that helps a beginner learn all basic hiragana through repeated movement, discovery, and crafting. Users should understand the loop quickly: explore, inspect stones, gather fragments, return to base, forge kana, and gradually complete the full hiragana set without any online account.

## Requirement map

| ID | Features | Requirement |
|---|---|---|
| MVP-R1 | `PLATFORM.DESKTOP` | Desktop-first local-only experience |
| MVP-R2 | `CONTENT.BASIC_HIRAGANA`, `CONTENT.RECIPE_BOOK` | Complete beginner hiragana set with simple forge costs |
| MVP-R3 | `CONTENT.FIELD_LAYOUTS`, `GAME.EXPLORATION_FIELD`, `GAME.STONE_SEARCH` | Understandable exploration and discovery loop |
| MVP-R4 | `GAME.SHARD_INVENTORY`, `GAME.FORGE_CRAFTING`, `GAME.KANA_COLLECTION` | Measurable crafting-based progression |
| MVP-R5 | `STORAGE.LOCAL_PROGRESS` | Durable, recoverable progress |
| MVP-R6 | `UI.MINIMAL_NIGHT_FIELD` | Distinctive low-color, high-clarity presentation |
| MVP-R7 | `TESTING.DETERMINISTIC_LOCAL` | Repeatable verification |

## Requirements

### MVP-R1 — local-first Desktop

The game must work without an account or connection after installation. No runtime backend, ads, analytics, remote assets or login should be required. The native Desktop host must restrict filesystem access to a narrow internal storage adapter.

### MVP-R2 — comprehensive beginner set

The MVP must include the 46 conventional basic hiragana. Each kana must be forgeable from generic shards with a documented cost. Voiced combinations, small kana, katakana, and kanji are outside this milestone.

### MVP-R3 — understandable exploration loop

The player must be able to move around a sparse field, inspect stones, and learn that each stone yields either a shard or nothing. There must be a clear base/anvil destination. Progress should never depend on timers, combat, social accounts, or sound playback.

### MVP-R4 — predictable crafting progression

Generic shards collected on the field must contribute to forging kana at the base. Completing an ordered group of kana must unlock the next group. The currently active prototype uses guided stroke placement: one generic shard becomes one stroke, in the correct order. Freeform bending/dragging is outside the MVP.

### MVP-R5 — persistence safety

Progress must survive restart. Corrupt/unsupported data and failed writes must produce visible errors, not automatic data loss. Versioned data and its location must be documented.

### MVP-R6 — minimalist visual clarity

Use a very small palette: dark blue background, black world/player forms, white stones, and green shard/crafting highlights. Visual polish must not compromise legibility, keyboard controls, focus indication, or reduced-motion preferences.

### MVP-R7 — local deterministic validation

Core rules must have tests not dependent on Electron, OS integration or network access. Native behavior requires separate manual acceptance.

## Non-goals

Combat, enemies, procedural weather, audio and voice evaluation, writing recognition, katakana, kanji, spaced repetition, accounts, cloud sync, telemetry, advertisements, mobile builds, installer/signing pipelines and AI-generated questions.

## Validation

The umbrella closes only after all bounded requirements pass automated checks plus native Desktop first-launch, offline behavior, exploration/crafting progression, restart persistence, error handling, and visual/keyboard acceptance. Until then it stays active.

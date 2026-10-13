---
type: Specification
title: Playable exploration, guided five-vowel crafting, and save loop
description: Active implementation and acceptance requirements for a scrolling field, jumps, guided vowels and backward-compatible saves.
document_role: subspec
spec_status: active
parent: ../spec-initial-functional-product.md
---
# Playable exploration, guided five-vowel crafting, and save loop

## Status

Active. The first field and one-step あ forging have been extended in source with an expanding procedural field, a jump mechanic, guided stroke placement for all five vowels and backward-compatible V2 progress. Native Desktop acceptance and the remaining 41 kana are still outstanding.

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

Give a player a repeatable night-field loop: walk as the camera follows, search white stones for generic green shards, jump over searched stones, carry shards back to the base and assemble hiragana through ordered guide strokes. The five basic vowels provide a small testable learning/crafting milestone before expansion to all 46 kana.

## Requirement map

| ID | Feature IDs | Purpose |
|---|---|---|
| LL-R1 | `CONTENT.BASIC_HIRAGANA`, `CONTENT.RECIPE_BOOK`, `CONTENT.FIELD_LAYOUTS` | Stable catalog, first five recipes, generated field |
| LL-R2 | `GAME.EXPLORATION_FIELD`, `GAME.STONE_SEARCH` | Movement, stone interaction, camera and jumps |
| LL-R3 | `GAME.SHARD_INVENTORY`, `GAME.FORGE_CRAFTING` | Collect, deposit and assemble strokes |
| LL-R4 | `GAME.KANA_COLLECTION` | Ordered five-vowel completion |
| LL-R5 | `STORAGE.LOCAL_PROGRESS` | Safe V2 saving and V1 migration |
| LL-R6 | `PLATFORM.DESKTOP` | Secure host/renderer boundary |
| LL-R7 | `UI.MINIMAL_NIGHT_FIELD` | Readable compact low-color presentation |
| LL-R8 | `TESTING.DETERMINISTIC_LOCAL` | Repeatable tests and manual evidence |

## Requirements

### LL-R1 — immutable content and expanding field

The game must retain the 46-unique-kana reference catalog, the existing fourteen starter stone identities and outcomes, and the same base location. The first five recipes are `あ い う え お` and require `3, 2, 2, 2, 3` generic shards respectively, with one shard per guided stroke. The field must continue beyond the first 16×10 area through a deterministic, locally generated, reasonably sparse coordinate model. Render only the camera viewport; do not preallocate an entire world.

### LL-R2 — exploration, search and hop

The player must be able to walk in cardinal directions on unblocked cells. A stone is inspected once, at cardinal distance one, producing either one shard or nothing. Normal walking cannot cross a stone. Jumping must cross exactly one **previously inspected** stone in the player's facing direction only when the next landing cell is empty. Without a valid stone and landing cell, no movement occurs. A camera should follow the player's position, and the UI must show enough base orientation information for return trips.

### LL-R3 — transfer and guided shard-to-stroke assembly

Found shards are carried automatically. Only the base/anvil accepts deposits and crafted strokes. At the anvil the player must see a guide for the current uncrafted vowel and choose its **next** stroke. Every successful placement consumes exactly one stored shard and snaps/bends it into the displayed guide shape. Wrong-order selections must not spend anything. Any unfinished assembly must remain available after restart. Freeform shaping and dragging are not required in this slice.

### LL-R4 — ordered vowel collection

The five vowel recipes are forged in order. Finishing the final stroke records one new kana and opens the next; already forged kana cannot be duplicated or removed. The UI must honestly show progress relative to the 46-kana catalog while indicating that only five recipes are available today.

### LL-R5 — safe saves and migration

The current profile must use `formatVersion: 2` and preserve the player coordinate, inspected fixed/procedural stone IDs, carried/stored resources, ordered forged kana, and unfinished assembly or null. The original V1 exploration file must be accepted and migrated without deleting, overwriting, or silently resetting any previously acquired あ/shards. The existing save filename may remain for seamless compatibility. Invalid/future versions must fail visibly and preserve source bytes. Save errors block new persisted actions until explicit retry succeeds.

### LL-R6 — host isolation

The renderer must not access Node directly. The host must expose a minimal validated persistence bridge, deny untrusted navigation and window creation, and serialize bounded atomic file updates. Expanding the inspected-stone set must not remove host payload limits.

### LL-R7 — low-color compact UI and learning accuracy

Use the established dark blue sky, black world/player, white stones and green fragments/assembled strokes. Gameplay must remain usable on compact Desktop windows with focus indicators, keyboard/pointer input and reduced-motion support. Initial authored SVG stroke guides must be explicitly labeled schematic and must be reviewed by a qualified Japanese educator before release as handwriting teaching content.

### LL-R8 — verification

Deterministic tests must cover fixed and generated stones, field continuation, valid/invalid jumps, ordered placement, resource conservation, five-vowel completion, recovery of mid-assembly saves, and migration of an existing V1 exploration save. Automated source tests do not replace visual, keyboard and native Electron validation.

## Non-goals

Full 46-kana recipe implementation in this bounded slice, freeform shard dragging or bending, authentic stroke-recognition grading, audio, biomes, enemies, multiplayer, browser sync, installer distribution or mobile builds. The entire umbrella remains active beyond this limited slice.

## Validation

- `sh ./run_checks.sh` succeeds in a prepared environment.
- A player can navigate beyond the first field, search generated stones, jump correctly, return to the fixed anvil and complete all five vowels in sequence.
- Interrupted assembly resumes after restart, and V1 exploration saves migrate without losing prior achievements.
- Wrong-order strokes, blocked jumps, save failures and future/corrupt profiles fail without damaging player state.
- The native Mac keyboard/layout/persistence walkthrough and educator review must be recorded before final acceptance and archiving.

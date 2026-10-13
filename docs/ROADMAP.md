---
type: Roadmap
title: Hiragana Aero roadmap
description: Current expanding-field and guided-assembly prototype with remaining acceptance tasks.
---
# Roadmap

## Position

Prototype 02 extends the first playable field. A camera-following procedural field, jump over searched stones, V1-to-V2 exploration-profile migration and ordered five-vowel stroke assembly are implemented in source, with automated domain tests. Desktop acceptance is still pending.

| Slice | Feature IDs | State | Next acceptance |
|---|---|---|---|
| Hiragana and stroke recipes | `CONTENT.BASIC_HIRAGANA`, `CONTENT.RECIPE_BOOK` | five vowel recipes implemented; 41 more pending | Review actual stroke guides with a Japanese-language expert |
| Expanding field | `CONTENT.FIELD_LAYOUTS`, `GAME.EXPLORATION_FIELD`, `GAME.STONE_SEARCH` | procedural stones and camera viewport implemented | Native walk/search beyond starter region |
| Jump and inventory | `GAME.EXPLORATION_FIELD`, `GAME.SHARD_INVENTORY` | jumping and base deposits implemented | Native keyboard and mouse acceptance |
| Stroke assembly | `GAME.FORGE_CRAFTING`, `GAME.KANA_COLLECTION` | five ordered vowels with partial save | Native forge flow and pedagogical review |
| Save/host | `STORAGE.LOCAL_PROGRESS`, `PLATFORM.DESKTOP` | V2 + legacy migration in source | Restart and error handling on macOS |
| Low-color UI | `UI.MINIMAL_NIGHT_FIELD` | new anvil guide interface in source | 13-inch compact viewport review |
| Checks | `TESTING.DETERMINISTIC_LOCAL` | automated checks for this slice | Host-level integration |

## Next two bounded stages

1. Native Mac acceptance and usability refinement for travel, jumping, stroke selection and field/backtracking visibility.
2. Extend verified recipes to the next hiragana group and decide how much feedback/recognition practice is needed for genuine learning.

## Future, not active

- `docs/specs/planned/subspecs/feedback-and-sound.md`: **freeform** shard bending/dragging and more detailed recipe-book guidance, beyond the currently active guided snap assembly.
- `docs/specs/planned/subspecs/review-and-retention.md`: richer fragments, differentiated stones, reinforcement and retention.

Do not implement planned features without activating their specifications.

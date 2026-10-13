---
type: Specification
title: Freeform shard arrangement and detailed recipe-book guidance
description: Planned advanced forging that goes beyond the active guided snapping MVP.
document_role: subspec
spec_status: planned
parent: ../../active/spec-initial-functional-product.md
---
# Freeform shard arrangement and detailed recipe-book guidance

## Status

Planned only. Guided stroke-by-stroke snapping is now specified in the active playable-loop sub-spec. Freeform bending/dragging and detailed recipe pages are **not** approved for implementation in P0.

## Feature scope

- `GAME.FORGE_CRAFTING`
- `GAME.KANA_COLLECTION`

## Requirement map

| ID | Feature IDs | Proposed scope |
|---|---|---|
| FS-R1 | `GAME.FORGE_CRAFTING`, `GAME.KANA_COLLECTION` | Free placement, bending and recipe-book guidance |

## Requirements

### FS-R1 — more demanding construction

A future player may rotate, bend and position each shard freely, or study a reference recipe book and assemble without a visible guide. Such mechanics must retain keyboard/pointer accessibility, persist work safely and use educator-reviewed stroke templates. They should improve learning rather than add frustrating precision requirements.

## Non-goals

Physics simulation, remote assets or automatic handwriting recognition.

## Validation

Before activation, test instructional correctness, interaction precision, retries and learning value against the simple guided snapping mechanic.

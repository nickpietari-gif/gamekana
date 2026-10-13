---
type: Specification
title: Distinct shards, richer stones, and retention-oriented collection
description: Planned enhancement with more varied resource identity and light reinforcement mechanics.
document_role: subspec
spec_status: planned
parent: ../../active/spec-initial-functional-product.md
---
# Distinct shards, richer stones, and retention-oriented collection

## Status

Planned only. Requires gameplay evidence and a new active decision before implementation.

## Feature scope

- `GAME.STONE_SEARCH`
- `GAME.SHARD_INVENTORY`
- `GAME.KANA_COLLECTION`

## Requirement map

| ID | Feature IDs | Proposed scope |
|---|---|---|
| RR-R1 | `GAME.STONE_SEARCH`, `GAME.SHARD_INVENTORY` | Optional richer shard/stone variety |
| RR-R2 | `GAME.KANA_COLLECTION` | Optional light retention/review loops |

## Requirements

### RR-R1 — richer resource identity

A future implementation may introduce multiple shard looks or resource classes, as well as more differentiated stone states, while keeping the field readable and the rules explainable.

### RR-R2 — retention without losing simplicity

A future implementation may ask the player to revisit already forged kana or use crafted kana in small reinforcement tasks. It must not silently invalidate the simple ordered-progression model and must specify a versioned compatible persistence change if new state is stored.

## Non-goals

Backend user profiling, account-linked synchronization, or complicated economic simulation.

## Validation

Specify measured learning goals, content selection rules, and migration tests when this planned idea is activated.

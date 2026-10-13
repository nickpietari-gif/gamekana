---
type: Specification Guide
title: Hiragana Aero specifications
description: Requirements, acceptance criteria, metadata, feature references, and spec lifecycle.
---
# Change specifications

## Ownership

Specifications describe intended work, not immutable descriptions of already accepted code. Accepted current-state behavior is owned by `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION.md`, `docs/USAGE.md`, `docs/TESTS.md` and capability contracts. Stable feature IDs live only in `docs/FEATURES.md`. Current acceptance status lives in `docs/ROADMAP.md`.

## Lifecycle

1. Keep one active initial-product umbrella in `active/spec-*.md`.
2. Split bounded changes into `active/subspecs/<name>.md`. Usually one is the active focus at a time.
3. Place reviewed future work under `planned/subspecs` with `spec_status: planned`.
4. Before implementing a future slice, **move** the file to active, change status to `active`, and update umbrella focus and roadmap.
5. If implemented but unaccepted, an active sub-spec may have `spec_status: verification-pending`.
6. Once developer acceptance passes, move stable behavior into current-state docs and **move** its specification to `archive/subspecs` with `spec_status: completed`.
7. Archive the umbrella only after the entire initial-product acceptance target is met.

One specification must exist in exactly one lifecycle location; do not copy files between active/planned/archive. Do not introduce deeper nesting without clear need.

## Metadata and requirement conventions

All managed Markdown starts with YAML frontmatter containing `type`, `title`, and `description`. Specifications additionally define `document_role: umbrella|subspec`, `spec_status: planned|active|verification-pending|completed`, and `parent` (subspec only); the umbrella points to one `current_focus` sub-spec. Parent paths are relative to the spec file. Every spec should include `## Status`, `## Feature scope`, `## Requirement map`, `## Requirements`, `## Non-goals`, and `## Validation`.

A stable Feature ID such as `GAME.FORGE_CRAFTING` is not a requirement ID (`LL-R4`) or a spec filename (`playable-level-loop`). Keep these independent. Use `must` for mandatory invariants and `should` for reviewed expectations.

## Current tree

- `active/spec-initial-functional-product.md`: rebooted minimalist MVP umbrella.
- `active/subspecs/playable-level-loop.md`: active exploration/crafting implementation focus.
- `planned/subspecs/feedback-and-sound.md`: future manual glyph assembly and recipe-book guidance.
- `planned/subspecs/review-and-retention.md`: future distinct shard types, richer stones, and retention mechanics.

No sub-spec has been accepted and archived yet.

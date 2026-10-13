---
type: Module Contract
title: Kana and field content contract
description: Stable IDs, deterministic field generation, and vowel stroke templates.
---
# Kana and field content contract

`content` is immutable and has no internal imports or I/O. It owns the 46 unique basic kana, stable original 14 stone IDs/outcomes, deterministic generated stones keyed by coordinate (`p:x:y`), the base/spawn cells and ordered vowel recipes. One shard corresponds to one defined stroke. All five recipes follow the first catalog group order. The hand-authored SVG stroke guides must not be presented as expert-reviewed handwriting instruction. Reordering IDs, changing existing stone outcomes, or revising the persisted crafting economy requires reviewed save compatibility and migration tests.

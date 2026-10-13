---
type: Module Contract
title: Exploration profile contract
description: V2 profile invariants and V1 backward compatibility.
---
# Exploration profile contract

Exploration progress contains `formatVersion: 2`, `mode: exploration`, a valid player coordinate, unique inspected stone IDs, nonnegative carried/stored shard counts, a prefix of the ordered five-vowel recipe list, and either `assembly: null` or one in-progress next-vowel symbol with a positive placed stroke count less than that recipe's cost. Resource conservation is mandatory: generated and original inspected shard-bearing stones equal carried + stored + spent completed strokes + placed unfinished strokes. No crafted kana can be removed or duplicated. Legacy exploration format V1 is validated using first-field semantics and migrated to V2 without changing the loaded file; invalid/future data must throw. The file store alone controls atomic writes.

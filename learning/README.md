---
type: Capability Overview
title: Exploration and assembly rules
description: Pure movement, jump, stone search, shard economy, and guided stroke placement.
---
# Exploration and assembly rules

`src/exploration.ts` models cardinal walking on a virtually expanding field, jumping exactly one searched stone to an empty landing cell, one-time search outcomes, deposits at the base, and placement of the next guided vowel stroke for one stored shard. Wrong-order inputs and invalid landings reject without consuming inventory. The module never performs I/O or uses the DOM.

---
type: Test Strategy
title: Validation and acceptance checks
description: Automated domain and repository checks, plus pending native Desktop acceptance.
---
# Tests

`sh ./run_checks.sh` compiles TypeScript, checks Electron host syntax, runs deterministic JavaScript domain/file-store tests and Python repository contract checks, then validates a generated source archive. It does **not** prove native Electron UI behavior.

`tests/exploration.test.mjs` covers the 46-kana catalog, five vowel recipes, stable starter stones, coordinate-based generated stones, bounded movement, jumps over inspected stones, search outcomes, deposits, ordered stroke placement, full five-vowel completion, interrupted assembly, legacy V1 migration, and rejection of invalid resources/positions.

`tests/progress-store.test.cjs` checks JSON file persistence, invalid write rejection, corrupt file handling, atomic error recovery, serialization of overlapping writes, and V1 exploration-file migration without rewriting on mere load.

`tests/ui-layout.test.mjs` checks viewport tile rendering structure against strict CSP, compact CSS rules, and reduced-motion styles; it does **not** replace pixel/viewport inspection. `tests/test_repository_contracts.py` checks module and specification boundaries and archive hygiene.

## Native Desktop acceptance still required

Test on a disposable profile where corruption or write failures are simulated:

- A compact Mac window shows visible player/stones/anvil and usable forge instructions without requiring page scroll.
- WASD, arrow keys and on-screen buttons update the camera when walking beyond the original field; white stones still appear.
- Searched stones cannot be searched again; Space hops only over a searched stone with a clear landing tile.
- Found sticks transfer to the anvil; wrong stroke order does not spend sticks; correct order does.
- Pause partway through `あ`, restart, and finish it; check correct automatic progression through `い う え お`.
- Restart an existing V1 exploration save and verify that old `あ`, searched stones and remaining sticks survive migration.
- Missing, corrupt and future-version profiles behave safely; injected save failure blocks further changes until Retry.
- Keyboard focus, contrast, reduced motion, strict CSP and offline native operation are usable on the target machine.

Mark acceptance only after actual native execution.

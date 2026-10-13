---
type: Acceptance Checklist
title: Scrolling-field Desktop acceptance record
description: Native-host movement, jumping, vowel assembly, save migration, and compact UI checks awaiting user sign-off.
---
# Scrolling-field Desktop acceptance record

All scenarios are **pending native Desktop acceptance**. Headless Chromium with a synthetic local host confirmed the renderer displays a full 160-cell field, 3-stroke anvil, no page overflow at 1280×800, 1024×700 or 760×620, and the `E → D → Space` first-stone jump flow. That is not proof of production Electron behavior.

| ID | Scenario | Required observation | Status |
|---|---|---|---|
| P0-A1 | Offline native launch | Viewport and controls render without login or network | Not run |
| P0-A2 | Continue beyond old border | Walking changes world coordinates; camera follows and new stones appear | Not run |
| P0-A3 | Stone search | E/click once per stone produces shard or empty outcome | Not run |
| P0-A4 | Jump | Space hops over a flipped rock toward the last movement direction, never over unflipped rocks or onto occupied cells | Not run |
| P0-A5 | Return to base | Base remains at `(2, 7)` and deposits carried resources | Not run |
| P0-A6 | Guided assembly | Each correct numbered stroke consumes one stored stick; wrong order consumes none | Not run |
| P0-A7 | Five vowels | `あ → い → う → え → お` completed in order, with 12 total shards | Not run |
| P0-A8 | Incomplete assembly restart | One placed stroke survives native restart | Not run |
| P0-A9 | V1 exploration migration | Previously searched stones, stored shards and forged あ survive; original file is not lost | Not run |
| P0-A10 | Corrupt/future profile | Visible error and unchanged original data, using disposable saves | Not run |
| P0-A11 | Save failure and Retry | Failed write blocks new persisted actions and can be retried | Not run |
| P0-A12 | Compact 13-inch screen | Field, forge and controls remain visible without page scrolling | Not run |
| P0-A13 | Keyboard/focus/CSP | Buttons and SVG guide selections are accessible; no inline positioning or remote assets | Not run |
| P0-A14 | Kana stroke validity | Qualified Japanese educator checks all guide paths and ordering | Not run |

Record OS, Electron/Node versions, observations and date of real tests before sign-off. Never corrupt real player data in tests.

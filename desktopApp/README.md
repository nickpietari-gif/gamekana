---
type: Platform Host
title: Electron desktop host
description: Isolated preload bridge and bounded serialized atomic storage for exploration profiles.
---
# Electron desktop host

`main.cjs` opens a local `app://bundle` window with sandbox and context isolation. `preload.cjs` exposes exactly two progress methods. `progress-store.cjs` validates the outer V2 snapshot shape, enforces a 1 MiB serialized payload limit and writes through a serialized temporary-file rename. The legacy `progress.exploration.v1.json` **filename** remains deliberately unchanged during the V2 data migration. Existing quiz saves in `progress.v1.json` are not touched. See `contract.md`.

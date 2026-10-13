---
type: Module Contract
title: Desktop host contract
description: Restricted Electron IPC and bounded atomic V2 profile persistence.
---
# Desktop host contract

Only the host reads/writes application files. It exposes fixed `progress:load` and `progress:save` operations through specific preload methods, never raw IPC to the renderer. The host rejects untrusted senders, requires the V2 exploration envelope on writes, caps JSON size to 1 MiB, serializes updates and atomically renames temporary files. Reads can return original V1 exploration payloads for domain-side compatibility migration; invalid files are not auto-reset. The restricted secure protocol serves only bundled assets, and external navigation/windows remain denied. The host never interprets stone or forging rules.

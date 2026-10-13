---
type: Capability Overview
title: Player progress and compatibility
description: V2 exploration profiles, unfinished assembly, and safe migration from V1.
---
# Player progress and compatibility

`src/profile.ts` validates generated/fixed stone IDs, preserved shard counts, forged-vowel prefix order and unfinished assembly. The original exploration V1 profile is accepted and migrated in memory, retaining the old file path; the first successful game interaction saves it as V2. Future/corrupt profiles must be rejected without rewriting them. Host I/O lives outside this module.

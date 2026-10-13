---
type: Development Guide
title: Hiragana Aero development rules
description: Repository-wide boundaries, SDD workflow, TypeScript conventions, testing, persistence, and archive rules.
---
# Hiragana Aero development rules

## Intent and source of truth

Keep the product small, offline-capable, and easy to maintain with LLM-assisted / specification-driven development. The current intent is a minimalist exploration-and-forging game for learning hiragana, not a quiz-heavy app.

Before making a change, read: root `README.md`, root `AGENTS.md`, nearest local `AGENTS.md` (if present), active specification, owning feature documentation and contracts, relevant tests and implementation.

Current repository content overrides chat history, summaries, older archives, and suggested plans. Active specs define intended work; planned specs are future proposals, and archived specs are historical evidence.

## Module ownership and dependency direction

- `content`: the normative bundled hiragana catalog, field metadata, and crafting recipe tables; no internal imports.
- `learning`: pure exploration, stone search, inventory transfer, crafting eligibility, and progression rules; depends only on `content`.
- `progress`: versioned player-profile model, parsing, invariant enforcement and persistent update logic; depends on `content` and `learning`.
- `shared`: top-down screen composition, keyboard behavior, minimalist CSS, and a narrow persistence port; may use all domain modules.
- `desktopApp`: Electron lifecycle, sandboxed renderer bridge, application-data directory and local file I/O; does not own game rules.

Avoid `core`, `common`, `utils`, `engine` or framework-wide abstraction packages without an explicit current responsibility and active specification. Domain modules must not import `electron`, `node:*`, browser DOM, or filesystem APIs. The application/host integrates capabilities; sibling features should not acquire arbitrary cross-module imports.

## TypeScript and UI

Use strict TypeScript for game/domain/frontend logic. Prefer immutable data and explicit pure state transitions. Keep interfaces at real boundaries, not mechanical class/implementation pairs. The narrow Electron host uses CommonJS shims until a separate specification justifies a host build pipeline. Favor semantic HTML and CSS; focus-visible keyboard navigation and reduced-motion preferences are required.

The rebooted MVP uses a **minimal low-color visual language**: dark blue background, black traversable world/player forms, white stones, and green shard/crafting highlights. Do not add decorative stars, moon art, image assets, or large palettes unless an active spec permits it. No external web content in Electron; use renderer context isolation, sandbox, explicit preload methods, bounded IPC, and a restrictive CSP.

Source comments, configuration comments, test comments, and all software documentation must be **in English**. Add comments only for non-obvious reasoning or behavioral contracts.

## Data and behavior

The exploration profile now uses `formatVersion = 2` plus `mode = exploration` and stores position, searched stone IDs, carried/stored shards, forged kana IDs, and any unfinished vowel assembly. Version-1 exploration profiles must migrate without loss; the original save filename remains unchanged for compatibility. The legacy quiz progress is isolated under a different filename/key. Group unlock progression is not implemented. All bundled learning data is static and versioned through code changes. The Desktop host owns file operations; the `progress` capability owns meaning and validation. Do not silently erase or rewrite unknown/corrupt saved data. Writes must fail visibly; use a temporary file and rename, and keep writes serialized. No analytics, sign-in, sync, or server dependency in the MVP.

## Specification lifecycle and documents

- `docs/FEATURES.md`: stable feature IDs, never transient status.
- `docs/ARCHITECTURE.md`: stable dependency direction and boundaries.
- `docs/IMPLEMENTATION.md`: actually implemented structure and known gaps.
- `docs/ROADMAP.md`: accepted/current/future position.
- `docs/INSTALLATION.md`, `docs/USAGE.md`, `docs/TESTS.md`: toolchain and operations.
- `docs/specs/README.md`: spec metadata, lifecycle, navigation.
- `docs/specs/active/`: normative change intent and acceptance criteria.
- `docs/specs/planned/`: reviewed but not committed future slices.
- `docs/specs/archive/`: completed and accepted historical slices.
- Each capability `README.md` / `contract.md`: local responsibilities and public invariants.

Managed Markdown has short YAML frontmatter with `type`, `title`, and `description`. Significant changes must have a bounded active spec, tracked feature IDs, tests, and explicit acceptance. After acceptance, update current-state documentation before archiving the spec. Do not duplicate entire requirement sets in current-state docs.

## Validation

The canonical entry point is `./run_checks.sh`. Domain behavior needs deterministic unit tests. Repository-document structure and dependency direction have contract tests. UI appearance, native Electron lifecycle, accessibility and restart persistence also require manual Desktop acceptance because source tests cannot prove these behaviors.

Tests cover deterministic procedural field generation, jumps, shard accounting, five-vowel stroke assembly, legacy migration, persistence, and repository boundaries. The remaining kana groups need new tests when implemented. Run relevant checks; report exactly what ran, passed, skipped or failed. Never weaken failing tests merely to get a passing result. No test may require credentials, personal data, remote services or public network access after dependencies are installed.

## Artifact hygiene

FULL archives preserve the `hiragana-aero/` root. PATCH archives also preserve that root but include only new/changed files. Exclude `node_modules`, `dist`, build output, `.git`, IDE data, generated snapshots, user progress, caches, secrets, logs, and ZIP files. Use `hiragana-aero-PATCH-yyyy-MM-DD-HH-mm-<description>.zip` for patches and explicitly list deletions/moves outside ZIP overlays.

## Always / ask first / never

Always read current sources, stay within active scope, maintain boundaries and acceptance tests, and report truthful validation.

Ask first unless the active task explicitly authorizes new runtime dependencies, package/module restructuring, breaking saved-data changes, feature-ID migrations, network/backend integration, replacing Electron, or unrelated refactors.

Never add remote-only requirements to core learning; never silently reset corrupt/future-version progress; never expose raw Node/Electron objects or generic IPC invocation to the renderer; never use previous chat state to overrule current repository files.

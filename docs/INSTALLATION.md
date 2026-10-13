---
type: Installation Guide
title: Development setup
description: Local-first Node, TypeScript and Electron setup for Desktop.
---
# Installation

## Prerequisites

- Node.js 22 or newer and npm.
- Windows, macOS, or Linux with a working graphical Desktop supported by Electron.
- Python 3 for repository documentation-contract checks and optional browser preview.
- `zip` / `unzip` for FULL archive creation and validation.

From the repository root:

```bash
npm install
npm run dev
```

The initial dependency download requires Internet access. The game itself does not. The project intentionally does not check in `node_modules` or Electron binaries. Dependency versions are declared in `package.json`; after installing and verifying them, retain the generated lockfile for reproducible builds.

## Transition note

`npm run dev` now runs the first playable exploration/crafting slice. One field and the あ forge recipe are implemented; the full 46-character progression is still under active development.

## Browser preview

```bash
npm run build
python3 -m http.server 5173
```

Visit `http://localhost:5173/`. This previews the same current UI/game rules but persists in browser localStorage, not Electron's application-data folder. Do not use this mode as proof of Desktop file persistence.

## Scope of the current scaffold

`npm run dev` launches Electron from source and is not a redistributable installer. Creating signed installers, auto-update flows, and OS packaging is outside the MVP prototype until an explicit active spec authorizes the work.

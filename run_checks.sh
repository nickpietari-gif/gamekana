#!/bin/sh
set -eu
ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$ROOT_DIR"

echo '==> Compile strict TypeScript'
npm run build

echo '==> Electron host syntax checks'
node --check desktopApp/main.cjs
node --check desktopApp/preload.cjs
node --check desktopApp/progress-store.cjs

echo '==> Domain unit tests'
node --test tests/*.test.mjs tests/*.test.cjs

echo '==> Documentation and repository contract tests'
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py' -v

echo '==> FULL archive validation'
TMP_ARCHIVE=$(mktemp "${TMPDIR:-/tmp}/hiragana-aero-FULL.XXXXXX.zip")
trap 'rm -f "$TMP_ARCHIVE"' EXIT
sh ./archive.sh "$TMP_ARCHIVE" >/dev/null
unzip -t "$TMP_ARCHIVE" >/dev/null

echo 'All available headless checks passed. Native Electron acceptance is still manual.'

#!/bin/sh
set -eu
ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OUT=${1:-"$ROOT_DIR/../hiragana-aero-FULL.zip"}
python3 "$ROOT_DIR/scripts/repo_artifacts.py" archive "$OUT"

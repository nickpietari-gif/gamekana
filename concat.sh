#!/bin/sh
set -eu
ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OUT=${1:-"$ROOT_DIR/../hiragana-aero_files.txt"}
python3 "$ROOT_DIR/scripts/repo_artifacts.py" concat "$OUT"

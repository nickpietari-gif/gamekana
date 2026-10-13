#!/usr/bin/env python3
"""Create deterministic source artifacts without caches, secrets, or generated data."""

from __future__ import annotations

import argparse
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED_DIRS = {
    '.git', '.idea', '.vscode', '.cache', '__pycache__',
    'node_modules', 'dist', 'out', 'build', 'coverage',
}
EXCLUDED_NAMES = {'.DS_Store', 'hiragana-aero_files.txt'}
EXCLUDED_SUFFIXES = {'.log', '.zip', '.pyc', '.pyo'}


def sources():
    for path in sorted(ROOT.rglob('*')):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT)
        if any(component in EXCLUDED_DIRS for component in rel.parts[:-1]):
            continue
        if path.name in EXCLUDED_NAMES or path.suffix in EXCLUDED_SUFFIXES:
            continue
        if path.name.startswith('.env') or path.name.endswith('_files.txt'):
            continue
        yield path, rel


def archive(target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(target, 'w', compression=ZIP_DEFLATED) as output:
        for path, relative in sources():
            output.write(path, arcname=f'{ROOT.name}/{relative.as_posix()}')
    print(target)


def concatenate(target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open('w', encoding='utf-8') as output:
        for path, relative in sources():
            if path.suffix not in {'.ts', '.js', '.cjs', '.json', '.md', '.py', '.css', '.html', '.sh'} and path.name not in {'.gitignore', '.editorconfig'}:
                continue
            output.write(f'=== FILE: {relative.as_posix()} ===\n')
            output.write(path.read_text(encoding='utf-8'))
            output.write('\n=== END FILE ===\n\n')
    print(target)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('operation', choices=('archive', 'concat'))
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    if args.operation == 'archive':
        archive(args.output.resolve())
    else:
        concatenate(args.output.resolve())


if __name__ == '__main__':
    main()

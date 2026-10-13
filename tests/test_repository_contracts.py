from __future__ import annotations

import re
import unittest
from pathlib import Path
from zipfile import ZipFile
from tempfile import TemporaryDirectory
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SPECS = ROOT / 'docs' / 'specs'
FEATURE_RE = re.compile(r'`([A-Z][A-Z0-9_]*(?:\.[A-Z0-9_]+)+)`')
CATALOG_RE = re.compile(r'^- `([A-Z][A-Z0-9_]*(?:\.[A-Z0-9_]+)+)`')


def metadata(path: Path) -> dict[str, str]:
    lines = path.read_text(encoding='utf-8').splitlines()
    if not lines or lines[0] != '---':
        raise AssertionError(f'Missing frontmatter in {path}')
    try:
        index = lines.index('---', 1)
    except ValueError as error:
        raise AssertionError(f'Unterminated frontmatter in {path}') from error
    values = {}
    for line in lines[1:index]:
        if line.strip():
            key, _, value = line.partition(':')
            values[key] = value.strip()
    return values


class RepositoryContractsTest(unittest.TestCase):
    def test_all_managed_markdown_has_frontmatter(self):
        files = [ROOT / 'README.md', ROOT / 'AGENTS.md', ROOT / 'CHANGELOG.md']
        files += list((ROOT / 'docs').rglob('*.md'))
        for module in ('content', 'learning', 'progress', 'shared', 'desktopApp'):
            files.extend([ROOT / module / 'README.md', ROOT / module / 'contract.md'])
        for path in files:
            for key in ('type', 'title', 'description'):
                self.assertTrue(metadata(path).get(key), (path, key))

    def test_active_and_planned_spec_lifecycle(self):
        active = list((SPECS / 'active').rglob('*.md'))
        planned = list((SPECS / 'planned').rglob('*.md'))
        self.assertEqual(len(active), 2)
        self.assertGreaterEqual(len(planned), 2)
        umbrellas = []
        for path in [*active, *planned]:
            front = metadata(path)
            self.assertEqual(front['type'], 'Specification')
            self.assertIn(front['document_role'], ('umbrella', 'subspec'))
            self.assertEqual(front['spec_status'], 'planned' if path in planned else 'active')
            body = path.read_text(encoding='utf-8')
            for heading in ('## Status', '## Feature scope', '## Requirement map', '## Requirements', '## Non-goals', '## Validation'):
                self.assertIn(heading, body, path)
            if front['document_role'] == 'umbrella':
                umbrellas.append(path)
                self.assertTrue((path.parent / front['current_focus']).is_file())
            else:
                self.assertTrue((path.parent / front['parent']).is_file())
        self.assertEqual(len(umbrellas), 1)

    def test_no_uncataloged_feature_ids(self):
        catalog = {
            match.group(1)
            for line in (ROOT / 'docs' / 'FEATURES.md').read_text(encoding='utf-8').splitlines()
            if (match := CATALOG_RE.match(line))
        }
        self.assertGreater(len(catalog), 5)
        for path in [*SPECS.rglob('*.md'), ROOT / 'docs' / 'ROADMAP.md']:
            refs = set(FEATURE_RE.findall(path.read_text(encoding='utf-8')))
            self.assertFalse(refs - catalog, (path, refs - catalog))

    def test_domain_source_does_not_import_platform_or_wrong_capabilities(self):
        boundaries = {
            'content': set(),
            'learning': {'content'},
            'progress': {'content', 'learning'},
        }
        for module, allowed in boundaries.items():
            for path in (ROOT / module / 'src').rglob('*.ts'):
                content = path.read_text(encoding='utf-8')
                self.assertNotRegex(content, r'from [\'\"](?:node:|electron|react|@tauri)')
                self.assertNotRegex(content, r'\b(?:document|window|localStorage|fetch)\b')
                for reference in re.findall(r'from\s+[\'\"]\.\./\.\./([^/]+)/', content):
                    self.assertIn(reference, allowed, (path, reference))
        for path in (ROOT / 'shared' / 'src').rglob('*.ts'):
            self.assertNotRegex(path.read_text(encoding='utf-8'), r'from [\'\"](?:electron|node:)')

    def test_source_full_archive_is_clean_and_rooted(self):
        with TemporaryDirectory() as directory:
            target = Path(directory) / 'test.zip'
            subprocess.run(['sh', str(ROOT / 'archive.sh'), str(target)], check=True, capture_output=True)
            with ZipFile(target) as data:
                names = data.namelist()
                self.assertIn('hiragana-aero/AGENTS.md', names)
                self.assertIn('hiragana-aero/docs/specs/active/spec-initial-functional-product.md', names)
                for name in names:
                    self.assertTrue(name.startswith('hiragana-aero/'))
                    self.assertNotRegex(name, r'/(?:node_modules|dist|build|out|\.git|__pycache__)/')
                    self.assertFalse(name.endswith(('.zip', '.log', '.pyc')))


if __name__ == '__main__':
    unittest.main()

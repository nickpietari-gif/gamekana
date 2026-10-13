import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../shared/src/style.css', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('../shared/src/main.ts', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('viewport uses CSP-safe CSS Grid tiles, without inline coordinates or untrusted images', () => {
  assert.match(html, /style-src 'self'/);
  assert.doesNotMatch(html, /unsafe-inline/);
  assert.match(renderer, /function worldTiles\(disabled: boolean\)/);
  assert.match(renderer, /<div class="tile">/);
  assert.doesNotMatch(renderer, /style\s*=\s*["']/);
  assert.match(css, /grid-template-columns:\s*repeat\(16,/);
  assert.match(css, /grid-template-rows:\s*repeat\(10,/);
  assert.match(css, /\.tile\s*\{/);
  assert.match(css, /\.stroke-hit/);
});

test('compact two-column layout retains small window and reduced motion rules', () => {
  assert.match(css, /\.layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(255px, 286px\)/s);
  assert.match(css, /\.field\s*\{[^}]*160dvh/s);
  assert.match(css, /@media \(max-width: 690px\)/);
  assert.match(css, /@media \(max-height: 710px\) and \(min-width: 691px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.stone:disabled\s*\{\s*opacity:\s*1/);
});

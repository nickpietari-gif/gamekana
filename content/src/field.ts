import { LEVELS } from './kana.js';

export interface Cell {
  readonly x: number;
  readonly y: number;
}

export interface Stone extends Cell {
  readonly id: string;
  readonly containsShard: boolean;
}

export interface Stroke {
  readonly path: string;
  readonly marker: Cell;
}

export interface Recipe {
  readonly symbol: string;
  readonly romaji: string;
  readonly strokes: readonly Stroke[];
  readonly cost: number;
}

export const FIELD_WIDTH = 16;
export const FIELD_HEIGHT = 10;
export const ANVIL: Cell = { x: 2, y: 7 };
export const SPAWN: Cell = { x: 3, y: 7 };
export const WORLD_LIMIT = 1_000_000;

// Preserve the original field and its outcomes so existing progress remains valid.
export const STONES: readonly Stone[] = [
  { id: 's01', x: 4, y: 7, containsShard: true },
  { id: 's02', x: 5, y: 5, containsShard: false },
  { id: 's03', x: 7, y: 7, containsShard: true },
  { id: 's04', x: 9, y: 6, containsShard: false },
  { id: 's05', x: 11, y: 3, containsShard: true },
  { id: 's06', x: 13, y: 7, containsShard: true },
  { id: 's07', x: 4, y: 3, containsShard: true },
  { id: 's08', x: 6, y: 2, containsShard: false },
  { id: 's09', x: 10, y: 2, containsShard: true },
  { id: 's10', x: 14, y: 4, containsShard: false },
  { id: 's11', x: 8, y: 4, containsShard: true },
  { id: 's12', x: 12, y: 8, containsShard: true },
  { id: 's13', x: 6, y: 8, containsShard: false },
  { id: 's14', x: 2, y: 2, containsShard: true }
];

export const RECIPES: readonly Recipe[] = [
  { symbol: 'あ', romaji: 'a', cost: 3, strokes: [
    { path: 'M38 49 Q83 52 151 43', marker: { x: 32, y: 42 } },
    { path: 'M97 18 Q100 70 91 112 Q85 150 65 145 Q47 137 72 109 Q108 79 145 110 Q169 135 149 153', marker: { x: 98, y: 12 } },
    { path: 'M142 83 Q125 110 130 140 Q143 169 177 140', marker: { x: 146, y: 75 } }
  ] },
  { symbol: 'い', romaji: 'i', cost: 2, strokes: [
    { path: 'M55 39 Q48 83 64 130 Q76 152 96 113', marker: { x: 45, y: 32 } },
    { path: 'M131 42 Q157 60 171 118', marker: { x: 125, y: 34 } }
  ] },
  { symbol: 'う', romaji: 'u', cost: 2, strokes: [
    { path: 'M102 29 Q118 38 135 41', marker: { x: 95, y: 22 } },
    { path: 'M62 75 Q108 57 154 74 Q171 89 149 122 Q127 152 96 158', marker: { x: 55, y: 67 } }
  ] },
  { symbol: 'え', romaji: 'e', cost: 2, strokes: [
    { path: 'M100 25 Q121 29 137 31', marker: { x: 93, y: 18 } },
    { path: 'M57 69 Q107 62 153 69 L100 114 Q119 110 129 131 Q140 150 169 140', marker: { x: 50, y: 61 } }
  ] },
  { symbol: 'お', romaji: 'o', cost: 3, strokes: [
    { path: 'M38 57 Q90 60 151 48', marker: { x: 30, y: 49 } },
    { path: 'M100 22 Q103 80 100 131 Q94 162 69 145 Q58 132 76 112 Q105 91 141 108 Q171 130 145 150', marker: { x: 93, y: 14 } },
    { path: 'M152 31 Q164 43 171 52', marker: { x: 144, y: 23 } }
  ] }
];

export const FIRST_RECIPE = RECIPES[0];

if (RECIPES.some((recipe, index) => recipe.symbol !== LEVELS[0]!.kana[index]?.symbol || recipe.strokes.length !== recipe.cost)) {
  throw new Error('Vowel recipes must follow the kana catalog and use one shard per stroke');
}

function hash(x: number, y: number): number {
  let value = Math.imul(x, 0x1f123bb5) ^ Math.imul(y, 0x5f356495) ^ 0x26a25d37;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d);
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
}

export function validCell(cell: Cell): boolean {
  return Number.isSafeInteger(cell.x) && Number.isSafeInteger(cell.y) &&
    Math.abs(cell.x) <= WORLD_LIMIT && Math.abs(cell.y) <= WORLD_LIMIT;
}

export function stoneAt(cell: Cell): Stone | undefined {
  if (!validCell(cell) || (cell.x === ANVIL.x && cell.y === ANVIL.y) ||
    (cell.x === SPAWN.x && cell.y === SPAWN.y)) return undefined;
  if (cell.x >= 0 && cell.x < FIELD_WIDTH && cell.y >= 0 && cell.y < FIELD_HEIGHT) {
    return STONES.find((stone) => stone.x === cell.x && stone.y === cell.y);
  }
  // Sparse empty corridors make long expeditions less likely to be trapped by rocks.
  if (cell.x % 8 === 0 || cell.y % 8 === 0) return undefined;
  const code = hash(cell.x, cell.y);
  if (code % 100 >= 17) return undefined;
  return { ...cell, id: `p:${cell.x}:${cell.y}`, containsShard: hash(cell.x + 47, cell.y - 31) % 4 !== 0 };
}

export function stoneById(id: string): Stone | undefined {
  const fixed = STONES.find((stone) => stone.id === id);
  if (fixed) return fixed;
  const match = /^p:(-?(?:0|[1-9]\d*)):(-?(?:0|[1-9]\d*))$/.exec(id);
  if (!match) return undefined;
  const stone = stoneAt({ x: Number(match[1]), y: Number(match[2]) });
  return stone?.id === id ? stone : undefined;
}

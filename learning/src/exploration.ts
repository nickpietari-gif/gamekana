import { ANVIL, RECIPES, stoneAt, stoneById, validCell, type Cell, type Stone } from '../../content/src/field.js';

export interface Assembly {
  readonly symbol: string;
  readonly placedCount: number;
}

export interface Expedition {
  readonly player: Cell;
  readonly inspectedStoneIds: readonly string[];
  readonly carriedShards: number;
  readonly storedShards: number;
  readonly craftedKanaIds: readonly string[];
  readonly assembly: Assembly | null;
}

export type SearchResult = { readonly next: Expedition; readonly outcome: 'shard' | 'empty'; readonly stoneId: string };

export function distance(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function nearAnvil(state: Expedition): boolean {
  return distance(state.player, ANVIL) <= 1;
}

export function nextRecipe(state: Expedition) {
  return RECIPES[state.craftedKanaIds.length];
}

export function reachableStone(state: Expedition): Stone | undefined {
  return [
    { x: state.player.x + 1, y: state.player.y },
    { x: state.player.x - 1, y: state.player.y },
    { x: state.player.x, y: state.player.y + 1 },
    { x: state.player.x, y: state.player.y - 1 }
  ].map(stoneAt).find((stone) => stone && !state.inspectedStoneIds.includes(stone.id));
}

function cardinal(dx: number, dy: number): void {
  if (!Number.isInteger(dx) || !Number.isInteger(dy) || Math.abs(dx) + Math.abs(dy) !== 1) {
    throw new Error('Movement must be one cardinal step');
  }
}

function blocked(cell: Cell): boolean {
  return (cell.x === ANVIL.x && cell.y === ANVIL.y) || Boolean(stoneAt(cell));
}

export function move(state: Expedition, dx: number, dy: number): Expedition {
  cardinal(dx, dy);
  const player = { x: state.player.x + dx, y: state.player.y + dy };
  return !validCell(player) || blocked(player) ? state : { ...state, player };
}

export function jump(state: Expedition, dx: number, dy: number): Expedition {
  cardinal(dx, dy);
  const obstacle = stoneAt({ x: state.player.x + dx, y: state.player.y + dy });
  const player = { x: state.player.x + dx * 2, y: state.player.y + dy * 2 };
  if (!obstacle || !state.inspectedStoneIds.includes(obstacle.id) || !validCell(player) || blocked(player)) {
    throw new Error('Jump requires a flipped stone and an empty landing cell');
  }
  return { ...state, player };
}

export function inspect(state: Expedition, stoneId: string): SearchResult {
  const stone = stoneById(stoneId);
  if (!stone || state.inspectedStoneIds.includes(stoneId) || distance(state.player, stone) !== 1) {
    throw new Error('Stone is unavailable or out of reach');
  }
  return {
    next: {
      ...state,
      inspectedStoneIds: [...state.inspectedStoneIds, stoneId],
      carriedShards: state.carriedShards + (stone.containsShard ? 1 : 0)
    },
    outcome: stone.containsShard ? 'shard' : 'empty',
    stoneId
  };
}

export function deposit(state: Expedition): Expedition {
  if (!nearAnvil(state) || state.carriedShards === 0) {
    throw new Error('Return to the anvil with shards to store');
  }
  return { ...state, carriedShards: 0, storedShards: state.storedShards + state.carriedShards };
}

export function placeStroke(state: Expedition, strokeIndex: number): Expedition {
  const recipe = nextRecipe(state);
  const nextIndex = state.assembly?.placedCount ?? 0;
  if (!nearAnvil(state) || !recipe || state.storedShards < 1 || !Number.isInteger(strokeIndex) || strokeIndex !== nextIndex) {
    throw new Error('Place the next outlined stroke at the anvil with a stored shard');
  }
  if (nextIndex + 1 === recipe.strokes.length) {
    return {
      ...state,
      storedShards: state.storedShards - 1,
      craftedKanaIds: [...state.craftedKanaIds, recipe.symbol],
      assembly: null
    };
  }
  return {
    ...state,
    storedShards: state.storedShards - 1,
    assembly: { symbol: recipe.symbol, placedCount: nextIndex + 1 }
  };
}

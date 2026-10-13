import { ANVIL, RECIPES, SPAWN, stoneAt, stoneById, validCell } from '../../content/src/field.js';
import { type Expedition } from '../../learning/src/exploration.js';

export interface Progress extends Expedition {
  readonly formatVersion: 2;
  readonly mode: 'exploration';
}

export function emptyProgress(): Progress {
  return {
    formatVersion: 2,
    mode: 'exploration',
    player: { ...SPAWN },
    inspectedStoneIds: [],
    carriedShards: 0,
    storedShards: 0,
    craftedKanaIds: [],
    assembly: null
  };
}

export function parseProgress(raw: unknown): Progress {
  if (raw === null || raw === undefined) return emptyProgress();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid profile object');
  const value = raw as Record<string, unknown>;
  if ((value.formatVersion !== 1 && value.formatVersion !== 2) || value.mode !== 'exploration') {
    throw new Error('Unsupported profile format');
  }
  const player = value.player;
  if (!player || typeof player !== 'object' || Array.isArray(player)) throw new Error('Invalid player position');
  const { x, y } = player as Record<string, unknown>;
  if (typeof x !== 'number' || typeof y !== 'number' || !validCell({ x, y }) ||
      (x === ANVIL.x && y === ANVIL.y) || stoneAt({ x, y })) {
    throw new Error('Invalid player position');
  }
  const inspected = value.inspectedStoneIds;
  if (!Array.isArray(inspected) || inspected.length > 50_000 ||
      !inspected.every((id) => typeof id === 'string' && stoneById(id)) ||
      new Set(inspected).size !== inspected.length) {
    throw new Error('Invalid inspected stones');
  }
  const carried = value.carriedShards;
  const stored = value.storedShards;
  if (!Number.isSafeInteger(carried) || !Number.isSafeInteger(stored) || (carried as number) < 0 || (stored as number) < 0) {
    throw new Error('Invalid shard counts');
  }
  const crafted = value.craftedKanaIds;
  if (!Array.isArray(crafted) || crafted.length > RECIPES.length ||
      !crafted.every((id, index) => id === RECIPES[index]?.symbol) ||
      (value.formatVersion === 1 && crafted.length > 1)) {
    throw new Error('Invalid forged kana');
  }
  const assembly = value.formatVersion === 1 ? null : value.assembly;
  if (assembly !== null && (typeof assembly !== 'object' || Array.isArray(assembly) || !assembly ||
      (assembly as Record<string, unknown>).symbol !== RECIPES[crafted.length]?.symbol ||
      !Number.isInteger((assembly as Record<string, unknown>).placedCount) ||
      ((assembly as Record<string, unknown>).placedCount as number) < 1 ||
      ((assembly as Record<string, unknown>).placedCount as number) >= (RECIPES[crafted.length]?.cost ?? 0))) {
    throw new Error('Invalid unfinished assembly');
  }
  const placed = assembly ? (assembly as { symbol: string; placedCount: number }).placedCount : 0;
  const collected = (inspected as string[]).reduce((sum, id) => sum + (stoneById(id)?.containsShard ? 1 : 0), 0);
  const spent = (crafted as string[]).reduce((sum, _id, index) => sum + RECIPES[index]!.cost, 0) + placed;
  if ((carried as number) + (stored as number) + spent !== collected) {
    throw new Error('Shard economy is inconsistent');
  }
  return {
    formatVersion: 2,
    mode: 'exploration',
    player: { x, y },
    inspectedStoneIds: [...inspected],
    carriedShards: carried as number,
    storedShards: stored as number,
    craftedKanaIds: [...crafted],
    assembly: assembly ? { symbol: RECIPES[crafted.length]!.symbol, placedCount: placed } : null
  };
}

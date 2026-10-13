import test from 'node:test';
import assert from 'node:assert/strict';
import { ANVIL, FIELD_HEIGHT, FIELD_WIDTH, RECIPES, SPAWN, STONES, stoneAt, stoneById } from '../dist/content/src/field.js';
import { deposit, distance, inspect, jump, move, nearAnvil, nextRecipe, placeStroke } from '../dist/learning/src/exploration.js';
import { emptyProgress, parseProgress } from '../dist/progress/src/profile.js';
import { ALL_KANA } from '../dist/content/src/kana.js';

function follow(initial, directions) {
  return directions.reduce((state, [dx, dy]) => ({ ...state, ...move(state, dx, dy) }), initial);
}

function shortestPath(from, target) {
  const queue = [{ position: from, path: [] }];
  const seen = new Set([`${from.x},${from.y}`]);
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    if (distance(current.position, target) <= 1) return current.path;
    for (const step of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const next = { x: current.position.x + step[0], y: current.position.y + step[1] };
      if (next.x < -30 || next.y < -30 || next.x > 45 || next.y > 45 ||
          distance(next, ANVIL) === 0 || stoneAt(next)) continue;
      const key = `${next.x},${next.y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({ position: next, path: [...current.path, step] });
    }
  }
  throw new Error(`No path to ${target.x},${target.y}`);
}

function enoughShards(count) {
  const eligible = [...STONES];
  for (let x = -18; x < 38; x++) {
    for (let y = -18; y < 28; y++) {
      const stone = stoneAt({ x, y });
      if (stone && stone.id.startsWith('p:')) eligible.push(stone);
    }
  }
  const found = eligible.filter((stone) => stone.containsShard).slice(0, count);
  assert.equal(found.length, count);
  return parseProgress({ ...emptyProgress(), inspectedStoneIds: found.map((stone) => stone.id), storedShards: count });
}

test('catalog has 46 kana and five ordered recipes matching real stroke counts', () => {
  assert.equal(ALL_KANA.length, 46);
  assert.equal(new Set(ALL_KANA.map(({ symbol }) => symbol)).size, 46);
  assert.deepEqual(RECIPES.map((recipe) => recipe.symbol), ['あ', 'い', 'う', 'え', 'お']);
  assert.deepEqual(RECIPES.map((recipe) => recipe.cost), [3, 2, 2, 2, 3]);
  RECIPES.forEach((recipe) => assert.equal(recipe.strokes.length, recipe.cost));
});

test('original stone layout and outcome are stable, outside map is deterministic and open-ended', () => {
  assert.equal(FIELD_WIDTH, 16);
  assert.equal(FIELD_HEIGHT, 10);
  STONES.forEach((stone) => assert.deepEqual(stoneAt(stone), stone));
  assert.equal(stoneAt(SPAWN), undefined);
  const generated = stoneAt({ x: -30, y: 14 }) ?? stoneAt({ x: 100, y: 100 });
  const found = Array.from({ length: 500 }, (_, x) => stoneAt({ x: x + 16, y: -9 })).find(Boolean);
  assert.ok(found?.id.startsWith('p:'));
  assert.deepEqual(stoneById(found.id), found);
  assert.deepEqual(stoneAt(found), found);
  assert.equal(stoneById('p:04:3'), undefined);
  assert.equal(stoneById('p:999999999:4'), undefined);
  assert.equal(stoneById('unknown'), undefined);
  assert.ok(generated === undefined || generated.id.startsWith('p:'));
});

test('walking continues past the original map; only a flipped stone can be jumped', () => {
  const initial = emptyProgress();
  assert.deepEqual(move(initial, 1, 0), initial);
  assert.throws(() => jump(initial, 1, 0), /flipped stone/);
  assert.throws(() => move(initial, 2, 0), /cardinal/);
  assert.throws(() => move(initial, 1, 1), /cardinal/);
  const searched = inspect(initial, 's01').next;
  assert.equal(jump(searched, 1, 0).player.x, 5);
  assert.equal(jump(searched, 1, 0).player.y, 7);
  assert.deepEqual(move(initial, -1, 0), initial);
  const route = shortestPath(SPAWN, { x: 19, y: 7 });
  const further = follow(initial, route);
  assert.ok(further.player.x >= FIELD_WIDTH || further.player.y >= FIELD_HEIGHT || further.player.y < 0);
});

test('binary stone search only once and within cardinal reach', () => {
  const initial = emptyProgress();
  const result = inspect(initial, 's01');
  assert.equal(result.outcome, 'shard');
  assert.equal(result.next.carriedShards, 1);
  assert.throws(() => inspect(result.next, 's01'), /unavailable/);
  assert.throws(() => inspect(initial, 's05'), /unavailable/);
  const emptyStone = STONES.find((stone) => !stone.containsShard);
  const reachable = follow(initial, shortestPath(initial.player, emptyStone));
  const empty = inspect(reachable, emptyStone.id);
  assert.equal(empty.outcome, 'empty');
  assert.equal(empty.next.carriedShards, 0);
});

test('walking, searching and depositing carries real shards to the base', () => {
  let state = emptyProgress();
  for (const stone of STONES.filter((stone) => stone.containsShard).slice(0, 3)) {
    state = follow(state, shortestPath(state.player, stone));
    state = parseProgress({ ...state, ...inspect(state, stone.id).next });
  }
  assert.equal(state.carriedShards, 3);
  assert.throws(() => placeStroke(state, 0), /stored shard/);
  state = follow(state, shortestPath(state.player, ANVIL));
  assert.ok(nearAnvil(state));
  state = parseProgress({ ...state, ...deposit(state) });
  assert.equal(state.storedShards, 3);
  assert.equal(state.carriedShards, 0);
  state = parseProgress({ ...state, ...placeStroke(state, 0) });
  assert.deepEqual(state.assembly, { symbol: 'あ', placedCount: 1 });
  assert.throws(() => placeStroke(state, 2), /next outlined stroke/);
  state = parseProgress({ ...state, ...placeStroke(state, 1) });
  state = parseProgress({ ...state, ...placeStroke(state, 2) });
  assert.deepEqual(state.craftedKanaIds, ['あ']);
  assert.equal(nextRecipe(state).symbol, 'い');
});

test('all five vowels can be forged from twelve sticks, across reloads and interrupted assembly', () => {
  let state = enoughShards(12);
  for (const recipe of RECIPES) {
    assert.equal(nextRecipe(state).symbol, recipe.symbol);
    for (let index = 0; index < recipe.cost; index++) {
      state = parseProgress({ ...state, ...placeStroke(state, index) });
      state = parseProgress(JSON.parse(JSON.stringify(state)));
    }
  }
  assert.deepEqual(state.craftedKanaIds, RECIPES.map((recipe) => recipe.symbol));
  assert.equal(nextRecipe(state), undefined);
  assert.equal(state.assembly, null);
  assert.equal(state.storedShards, 0);
  assert.throws(() => placeStroke(state, 0), /next outlined stroke/);
});

test('legacy v1 profile migrates without erasing the original first-kana progress', () => {
  const old = {
    formatVersion: 1, mode: 'exploration', player: { x: 3, y: 7 },
    inspectedStoneIds: ['s01', 's03', 's05'], carriedShards: 0,
    storedShards: 0, craftedKanaIds: ['あ']
  };
  const profile = parseProgress(old);
  assert.equal(profile.formatVersion, 2);
  assert.deepEqual(profile.craftedKanaIds, ['あ']);
  assert.equal(nextRecipe(profile).symbol, 'い');
  assert.equal(profile.assembly, null);
  assert.deepEqual(old.craftedKanaIds, ['あ']);
});

test('reject corrupt snapshots, invalid strokes, unknown stones, and impossible shard economy', () => {
  const initial = emptyProgress();
  assert.deepEqual(parseProgress(null), initial);
  assert.throws(() => parseProgress({ ...initial, formatVersion: 3 }), /Unsupported/);
  assert.throws(() => parseProgress({ formatVersion: 1, completedLevelIds: [], bestScores: {} }), /Unsupported/);
  assert.throws(() => parseProgress({ ...initial, inspectedStoneIds: ['unknown'] }), /stones/);
  assert.throws(() => parseProgress({ ...initial, inspectedStoneIds: ['s01', 's01'] }), /stones/);
  assert.throws(() => parseProgress({ ...initial, player: { x: 4, y: 7 } }), /player/);
  assert.throws(() => parseProgress({ ...initial, storedShards: 1 }), /economy/);
  assert.throws(() => parseProgress({ ...initial, craftedKanaIds: ['い'] }), /kana/);
  assert.throws(() => parseProgress({ ...initial, carriedShards: -1 }), /shard/);
  assert.throws(() => parseProgress({ ...initial, assembly: { symbol: 'あ', placedCount: 3 } }), /assembly/);
  assert.throws(() => parseProgress({ ...initial, assembly: { symbol: 'い', placedCount: 1 } }), /assembly/);
});

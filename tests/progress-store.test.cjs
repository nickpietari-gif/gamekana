const test = require('node:test');
const assert = require('node:assert/strict');
const { promises: fs } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { createProgressStore } = require('../desktopApp/progress-store.cjs');

async function withStore(fn) {
  const directory = await fs.mkdtemp(path.join(tmpdir(), 'hiragana-aero-test-'));
  const file = path.join(directory, 'nested', 'progress.exploration.v1.json');
  try {
    await fn({ file, store: createProgressStore(file) });
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

function snapshot(inspectedStoneIds = [], carriedShards = 0) {
  return { formatVersion: 2, mode: 'exploration', player: { x: 3, y: 7 }, inspectedStoneIds, carriedShards, storedShards: 0, craftedKanaIds: [], assembly: null };
}

test('missing save starts empty, then a snapshot survives reopening the store', async () => {
  await withStore(async ({ file, store }) => {
    assert.equal(await store.load(), null);
    const progress = snapshot(['s01'], 1);
    await store.save(progress);
    assert.deepEqual(await createProgressStore(file).load(), progress);
    await assert.rejects(fs.access(`${file}.tmp`), { code: 'ENOENT' });
  });
});

test('invalid/future-version payload cannot overwrite a previous save', async () => {
  await withStore(async ({ file, store }) => {
    const before = snapshot(['s01', 's03'], 2);
    await store.save(before);
    assert.throws(() => store.save({ ...before, formatVersion: 3 }), /Invalid progress payload/);
    assert.throws(() => store.save({ ...before, craftedKanaIds: null }), /Invalid progress payload/);
    assert.throws(() => store.save({ ...before, extra: 'x'.repeat(1050000) }), /too large/);
    assert.deepEqual(await store.load(), before);
    assert.deepEqual(JSON.parse(await fs.readFile(file, 'utf8')), before);
  });
});

test('malformed JSON is reported without changing the saved file', async () => {
  await withStore(async ({ file, store }) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, '{bad json', 'utf8');
    await assert.rejects(store.load(), SyntaxError);
    assert.equal(await fs.readFile(file, 'utf8'), '{bad json');
  });
});

test('failed rename leaves the original snapshot unchanged and allows a retry', async () => {
  await withStore(async ({ file, store }) => {
    const before = snapshot(['s01'], 1);
    await store.save(before);
    let failNext = true;
    const io = {
      ...fs,
      async rename(from, to) {
        if (failNext) {
          failNext = false;
          throw new Error('Simulated disk failure');
        }
        return fs.rename(from, to);
      }
    };
    const fragile = createProgressStore(file, io);
    await assert.rejects(fragile.save(snapshot(['s01', 's03'], 2)), /Simulated disk failure/);
    assert.deepEqual(await store.load(), before);
    await assert.rejects(fs.access(`${file}.tmp`), { code: 'ENOENT' });
    const after = snapshot(['s01', 's03'], 2);
    await fragile.save(after);
    assert.deepEqual(await store.load(), after);
  });
});

test('overlapping writes are serialized and the last successful result wins', async () => {
  await withStore(async ({ file, store }) => {
    await Promise.all([
      store.save(snapshot(['s01'], 1)),
      store.save(snapshot(['s01', 's03'], 2))
    ]);
    assert.deepEqual(await store.load(), snapshot(['s01', 's03'], 2));
  });
});

test('a legacy V1 exploration file is readable and upgrades only after a successful save', async () => {
  await withStore(async ({ file, store }) => {
    const legacy = {
      formatVersion: 1, mode: 'exploration', player: { x: 3, y: 7 },
      inspectedStoneIds: ['s01', 's03', 's05'], carriedShards: 0,
      storedShards: 0, craftedKanaIds: ['あ']
    };
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(legacy), 'utf8');
    const { parseProgress } = await import('../dist/progress/src/profile.js');
    const migrated = parseProgress(await store.load());
    assert.equal(migrated.formatVersion, 2);
    assert.deepEqual(migrated.craftedKanaIds, ['あ']);
    assert.equal(JSON.parse(await fs.readFile(file, 'utf8')).formatVersion, 1);
    await store.save(migrated);
    assert.deepEqual(await store.load(), migrated);
    assert.equal(JSON.parse(await fs.readFile(file, 'utf8')).formatVersion, 2);
  });
});

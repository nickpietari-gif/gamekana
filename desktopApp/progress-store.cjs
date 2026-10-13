const { promises: fs } = require('node:fs');
const path = require('node:path');

function validateSnapshot(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      value.formatVersion !== 2 || value.mode !== 'exploration' ||
      !value.player || typeof value.player !== 'object' || Array.isArray(value.player) ||
      !Number.isInteger(value.player.x) || !Number.isInteger(value.player.y) ||
      !Array.isArray(value.inspectedStoneIds) ||
      !value.inspectedStoneIds.every((id) => typeof id === 'string') ||
      !Number.isSafeInteger(value.carriedShards) || !Number.isSafeInteger(value.storedShards) ||
      value.carriedShards < 0 || value.storedShards < 0 ||
      !Array.isArray(value.craftedKanaIds) ||
      !value.craftedKanaIds.every((id) => typeof id === 'string') ||
      (value.assembly !== null && (!value.assembly || typeof value.assembly !== 'object' ||
        typeof value.assembly.symbol !== 'string' || !Number.isInteger(value.assembly.placedCount)))) {
    throw new Error('Invalid progress payload');
  }
  const payload = JSON.stringify(value);
  if (payload.length > 1048576) throw new Error('Progress payload is too large');
  return payload;
}

function createProgressStore(filePath, io = fs) {
  let writeQueue = Promise.resolve();

  async function load() {
    await writeQueue;
    try {
      return JSON.parse(await io.readFile(filePath, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  function save(value) {
    const payload = validateSnapshot(value);
    const write = async () => {
      await io.mkdir(path.dirname(filePath), { recursive: true });
      const temporary = `${filePath}.tmp`;
      try {
        await io.writeFile(temporary, payload, { encoding: 'utf8', mode: 0o600 });
        await io.rename(temporary, filePath);
      } catch (error) {
        await io.rm(temporary, { force: true }).catch(() => {});
        throw error;
      }
    };
    const pending = writeQueue.then(write);
    writeQueue = pending.catch(() => {});
    return pending;
  }

  return { load, save };
}

module.exports = { createProgressStore };

import { ANVIL, FIELD_HEIGHT, FIELD_WIDTH, RECIPES, stoneAt, type Cell } from '../../content/src/field.js';
import { deposit, distance, inspect, jump, move, nearAnvil, nextRecipe, placeStroke, reachableStone } from '../../learning/src/exploration.js';
import { parseProgress, type Progress } from '../../progress/src/profile.js';
import { loadProgress, saveProgress } from './persistence.js';

const mount = document.getElementById('app');
if (!mount) throw new Error('Missing application mount point');
const root: HTMLElement = mount;

let state: Progress;
let pending: Progress | null = null;
let saving = false;
let bootError = '';
let saveError = '';
let notice = 'Ищи белые камни. Найденные палочки можно превращать в штрихи каны на базе.';
let facing: Cell = { x: 1, y: 0 };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]!);
}

function worldTiles(disabled: boolean): string {
  const offsetX = state.player.x - Math.floor(FIELD_WIDTH / 2);
  const offsetY = state.player.y - Math.floor(FIELD_HEIGHT / 2);
  const inspected = new Set(state.inspectedStoneIds);
  const cells: string[] = [];
  for (let y = 0; y < FIELD_HEIGHT; y++) {
    for (let x = 0; x < FIELD_WIDTH; x++) {
      const cell = { x: offsetX + x, y: offsetY + y };
      const stone = stoneAt(cell);
      let content = '';
      if (stone) {
        const flipped = inspected.has(stone.id);
        const reachable = distance(state.player, cell) === 1;
        const kind = flipped ? stone.containsShard ? ' found' : ' empty' : '';
        content = `<button class="stone${flipped ? ' flipped' : ''}${kind}${reachable && !flipped ? ' reachable' : ''}" data-action="inspect" data-id="${stone.id}" aria-label="${flipped ? 'Осмотренный камень' : 'Осмотреть камень'}" title="${flipped ? 'Перепрыгни через камень (Space)' : reachable ? 'Нажми, чтобы перевернуть' : 'Подойди ближе'}" ${disabled || flipped || !reachable ? 'disabled' : ''}><span aria-hidden="true"></span></button>`;
      } else if (cell.x === ANVIL.x && cell.y === ANVIL.y) {
        content = '<div class="anvil" title="База и наковальня" aria-label="База и наковальня">⌑</div>';
      } else if (cell.x === state.player.x && cell.y === state.player.y) {
        content = '<div class="player" aria-label="Персонаж"><span class="player-eyes" aria-hidden="true"></span></div>';
      }
      cells.push(`<div class="tile">${content}</div>`);
    }
  }
  return cells.join('');
}

function forgeMarkup(disabled: boolean, near: boolean): string {
  const recipe = nextRecipe(state);
  if (!recipe) {
    return '<section class="panel forge-panel"><div class="eyebrow">НАКОВАЛЬНЯ / ГЛАСНЫЕ</div><div class="forge-done" lang="ja">あ い う え お</div><p class="success">Пять гласных готовы! Следующие каны появятся в будущем этапе.</p></section>';
  }
  const placed = state.assembly?.placedCount ?? 0;
  const paths = recipe.strokes.map((stroke, index) => {
    const ready = index < placed;
    const path = escapeHtml(stroke.path);
    return `<g class="stroke-part${ready ? ' placed' : ''}">
      <path class="stroke-line" d="${path}" />
      <circle class="stroke-marker" cx="${stroke.marker.x}" cy="${stroke.marker.y}" r="10"/>
      <text class="stroke-number" x="${stroke.marker.x}" y="${stroke.marker.y + 4}" text-anchor="middle">${index + 1}</text>
      ${!ready && near && !disabled ? `<path class="stroke-hit" d="${path}" data-action="stroke" data-index="${index}" role="button" tabindex="0" aria-label="Уложить штрих ${index + 1}"/>` : ''}
    </g>`;
  }).join('');
  const buttons = recipe.strokes.map((_stroke, index) => `<button class="stroke-choice${index < placed ? ' completed' : ''}" data-action="stroke" data-index="${index}" ${disabled || !near || index < placed || state.storedShards < 1 ? 'disabled' : ''} aria-label="Положить палочку на штрих ${index + 1}">${index < placed ? '✓' : index + 1}</button>`).join('');
  return `<section class="panel forge-panel">
    <div class="eyebrow">НАКОВАЛЬНЯ / ГЛАСНЫЕ ${state.craftedKanaIds.length + 1} ИЗ 5</div>
    <div class="forge-heading"><span class="forge-kana" lang="ja">${recipe.symbol}</span><div><strong>${recipe.romaji}</strong><p class="helper">${placed} / ${recipe.cost} штрихов · ◆ ${state.storedShards} на базе</p></div></div>
    <svg class="forge-canvas" viewBox="0 0 210 180" role="group" aria-label="Контуры штрихов ${recipe.symbol}; зелёные уже уложены">
      ${paths}
    </svg>
    <div class="stroke-choices" aria-label="Выбор штриха">${buttons}</div>
    <p class="helper forge-instruction">${!near ? 'Подойди к наковальне, чтобы собрать кану.' : state.storedShards < 1 ? 'Сложи найденные палочки на базе.' : `Нажми следующий штрих №${placed + 1} на контуре или кнопкой.`}</p>
  </section>`;
}

function render(): void {
  if (bootError) {
    root.innerHTML = `<section class="boot-error" role="alert"><h1>Не удалось открыть сохранение</h1><p>${escapeHtml(bootError)}</p><p>Данные не изменены. Исправь файл сохранения и перезапусти игру.</p></section>`;
    return;
  }
  const near = nearAnvil(state);
  const disabled = saving || Boolean(saveError);
  const found = state.inspectedStoneIds.length;
  const back = distance(state.player, ANVIL);
  root.innerHTML = `<header class="header">
    <div><div class="eyebrow">HIRAGANA AERO / ПРОТОТИП 02</div><h1>Ночное поле</h1></div>
    <div class="header-progress"><span class="tiny">ВЫКОВАНО</span><strong>${state.craftedKanaIds.length} / 46</strong></div>
  </header>
  <div class="layout">
    <section class="world-panel" aria-label="Игровое поле">
      <div class="world-bar"><span>МИР БЕЗ КРАЯ · X ${state.player.x} / Y ${state.player.y}</span><span>ОСМОТРЕНО ${found}</span></div>
      <div class="field" aria-label="Поле; WASD или стрелки — движение, Space — прыжок через осмотренный камень">
        <div class="ground" aria-hidden="true"></div>${worldTiles(disabled)}
      </div>
      <p class="world-caption">Белые камни — переверни (E). Осмотренные — перепрыгни (Space). До базы: ${back} клеток.</p>
    </section>
    <aside class="sidebar">
      <section class="panel inventory-panel">
        <div class="eyebrow">РЮКЗАК И ХРАНИЛИЩЕ</div>
        <div class="inventory"><div><span>С собой</span><strong class="accent">◆ ${state.carriedShards}</strong></div><div><span>На базе</span><strong class="accent">◆ ${state.storedShards}</strong></div></div>
        <button class="action" data-action="deposit" ${disabled || !near || state.carriedShards === 0 ? 'disabled' : ''}>Сложить палочки <span>E</span></button>
      </section>
      ${forgeMarkup(disabled, near)}
      <section class="panel control-panel"><div class="control-info"><div class="eyebrow">УПРАВЛЕНИЕ</div>
        <p>WASD / стрелки — идти · E — камень/база<br>Space — прыгать · 1–3 — штрихи</p>
        <button class="jump-button" data-action="jump" ${disabled ? 'disabled' : ''}>↟ Прыжок <span>Space</span></button></div>
        <div class="dpad" aria-label="Кнопки движения"><button data-action="move" data-dx="0" data-dy="-1" ${disabled ? 'disabled' : ''} aria-label="Вверх">↑</button><div><button data-action="move" data-dx="-1" data-dy="0" ${disabled ? 'disabled' : ''} aria-label="Влево">←</button><button data-action="move" data-dx="0" data-dy="1" ${disabled ? 'disabled' : ''} aria-label="Вниз">↓</button><button data-action="move" data-dx="1" data-dy="0" ${disabled ? 'disabled' : ''} aria-label="Вправо">→</button></div></div>
      </section>
    </aside>
  </div>
  <div class="status-line" role="status" aria-live="polite">
    <span class="status-marker" aria-hidden="true"></span>
    <span>${escapeHtml(saveError ? `Ошибка сохранения: ${saveError}` : saving ? 'Сохраняем прогресс…' : notice)}</span>
    ${saveError ? '<button data-action="retry" class="retry">Повторить сохранение</button>' : ''}
  </div>`;
}

async function commit(next: Progress, nextNotice: string): Promise<void> {
  pending = parseProgress(next);
  saving = true;
  saveError = '';
  render();
  try {
    await saveProgress(pending);
    state = pending;
    pending = null;
    notice = nextNotice;
  } catch (error) {
    saveError = error instanceof Error ? error.message : String(error);
  } finally {
    saving = false;
    render();
  }
}

function change(action: string, id?: string, dx = 0, dy = 0, index = -1): void {
  if (saving || saveError) {
    if (action === 'retry' && !saving && pending) void commit(pending, 'Прогресс сохранён.');
    return;
  }
  try {
    switch (action) {
      case 'move': {
        facing = { x: dx, y: dy };
        const next = move(state, dx, dy);
        state = { ...state, player: next.player };
        render();
        break;
      }
      case 'jump': {
        const next = jump(state, facing.x, facing.y);
        state = { ...state, player: next.player };
        notice = 'Перепрыгнул через перевёрнутый камень!';
        render();
        break;
      }
      case 'inspect': {
        if (!id) return;
        const result = inspect(state, id);
        void commit({ ...state, ...result.next }, result.outcome === 'shard'
          ? 'Под камнем найдена зелёная палочка! Она уже в рюкзаке.'
          : 'Под камнем пусто. Можно перепрыгнуть через него.');
        break;
      }
      case 'deposit':
        void commit({ ...state, ...deposit(state) }, 'Палочки перенесены из рюкзака на базу.');
        break;
      case 'stroke': {
        const recipe = nextRecipe(state);
        const next = placeStroke(state, index);
        const completed = next.craftedKanaIds.length > state.craftedKanaIds.length;
        void commit({ ...state, ...next }, completed
          ? `Ты собрал ${recipe?.symbol} (${recipe?.romaji})! Следующая кана открыта.`
          : `Штрих №${index + 1} уложен. Палочка приняла его форму.`);
        break;
      }
    }
  } catch (error) {
    notice = error instanceof Error ? error.message : String(error);
    render();
  }
}

root.addEventListener('click', (event) => {
  const element = (event.target as Element).closest<HTMLElement>('[data-action]');
  if (!element || (element instanceof HTMLButtonElement && element.disabled)) return;
  const action = element.dataset.action;
  if (!action) return;
  change(action, element.dataset.id, Number(element.dataset.dx ?? 0), Number(element.dataset.dy ?? 0), Number(element.dataset.index ?? -1));
});

window.addEventListener('keydown', (event) => {
  if (!state || bootError || event.altKey || event.metaKey || event.ctrlKey) return;
  const target = event.target as Element;
  if ((event.key === 'Enter' || event.key === ' ') && target?.matches?.('[data-action="stroke"][role="button"]')) {
    event.preventDefault();
    change('stroke', undefined, 0, 0, Number((target as HTMLElement).dataset.index));
    return;
  }
  if ((event.key === ' ' || event.key === 'Enter') && target?.closest?.('button')) return;
  const key = event.key.toLowerCase();
  const directions: Record<string, readonly [number, number]> = {
    w: [0, -1], arrowup: [0, -1], s: [0, 1], arrowdown: [0, 1],
    a: [-1, 0], arrowleft: [-1, 0], d: [1, 0], arrowright: [1, 0]
  };
  if (event.repeat && !directions[key]) return;
  if (directions[key]) {
    event.preventDefault();
    const [dx, dy] = directions[key];
    change('move', undefined, dx, dy);
  } else if (key === 'e') {
    event.preventDefault();
    if (nearAnvil(state) && state.carriedShards > 0) change('deposit');
    else {
      const stone = reachableStone(state);
      if (stone) change('inspect', stone.id);
      else { notice = 'Рядом нет нового камня. Подойди ближе или перепрыгни осмотренный.'; render(); }
    }
  } else if (key === ' ' || key === 'spacebar') {
    event.preventDefault();
    change('jump');
  } else if (['1', '2', '3'].includes(key) && nearAnvil(state)) {
    event.preventDefault();
    change('stroke', undefined, 0, 0, Number(key) - 1);
  }
});

async function start(): Promise<void> {
  try {
    state = await loadProgress();
    render();
  } catch (error) {
    bootError = error instanceof Error ? error.message : String(error);
    render();
  }
}

void start();

// ── Constants ─────────────────────────────────────────────────────────────────
const COLORS = ['red', 'blue', 'green', 'yellow'];
const WILDS  = ['wild', 'wild4'];

// ── Utils ─────────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildDeck() {
  const deck = [];
  for (const color of COLORS) {
    deck.push({ color, value: '0' });
    for (const v of ['1','2','3','4','5','6','7','8','9','skip','reverse','draw2']) {
      deck.push({ color, value: v });
      deck.push({ color, value: v });
    }
  }
  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'wild', value: 'wild' });
    deck.push({ color: 'wild', value: 'wild4' });
  }
  return shuffle(deck);
}

// ── Game state ────────────────────────────────────────────────────────────────
let state = null;
let setupNames = ['', ''];
let switchTimer = null;
let switchTimer2 = null;

function createState(names) {
  let deck = buildDeck();
  const players = names.map(name => ({ name, hand: [] }));

  // Deal 7 cards each
  for (let r = 0; r < 7; r++) {
    for (const p of players) p.hand.push(deck.pop());
  }

  // First discard card – never a wild
  let firstCard;
  while (true) {
    firstCard = deck.pop();
    if (!WILDS.includes(firstCard.value)) break;
    deck.push(firstCard);
    deck = shuffle(deck);
  }

  const s = {
    phase: 'play',       // play | color-pick | switching | winner
    players,
    deck,
    discard: [firstCard],
    currentIdx: 0,
    direction: 1,        // 1 = clockwise, -1 = counter-clockwise
    currentColor: firstCard.color,
    selectedIdx: null,   // index into current player's hand
    drawnIdx: null,      // index of card drawn this turn (if any)
    pendingSkip: false,  // next player loses their turn
    unoShouted: false,
    message: '',
    winner: null,
    nextIdx: null,
    penaltyInfo: null,   // { playerName, amount } if draw2/wild4 just penalized someone
    switchPhase: 1,      // 1 = penalty notice, 2 = "pass to next"
  };

  // Apply starting card effect
  switch (firstCard.value) {
    case 'skip':
      s.currentIdx = 1 % names.length;
      break;
    case 'reverse':
      s.direction = -1;
      s.currentIdx = (names.length - 1);
      break;
    case 'draw2':
      s.players[0].hand.push(deck.pop(), deck.pop());
      s.currentIdx = 1 % names.length;
      break;
  }

  return s;
}

// ── Core game logic ───────────────────────────────────────────────────────────
function topCard() { return state.discard[state.discard.length - 1]; }
function curPlayer() { return state.players[state.currentIdx]; }

function canPlay(card) {
  if (WILDS.includes(card.value)) return true;
  return card.color === state.currentColor || card.value === topCard().value;
}

function nextIdx(skip = false) {
  const n = state.players.length;
  let i = (state.currentIdx + state.direction + n) % n;
  if (skip) i = (i + state.direction + n) % n;
  return i;
}

function drawFromDeck(count) {
  const drawn = [];
  for (let i = 0; i < count; i++) {
    if (state.deck.length === 0) reshuffleDiscard();
    if (state.deck.length > 0) drawn.push(state.deck.pop());
  }
  return drawn;
}

function reshuffleDiscard() {
  if (state.discard.length <= 1) return;
  const savedTop = state.discard.pop();
  state.deck = shuffle([...state.discard]);
  state.discard = [savedTop];
}

function applyEffect(card) {
  switch (card.value) {
    case 'reverse':
      state.direction *= -1;
      if (state.players.length === 2) state.pendingSkip = true;
      state.currentColor = card.color;
      break;
    case 'skip':
      state.pendingSkip = true;
      state.currentColor = card.color;
      break;
    case 'draw2': {
      const p2 = state.players[nextIdx()];
      p2.hand.push(...drawFromDeck(2));
      state.penaltyInfo = { playerName: p2.name, amount: 2 };
      state.pendingSkip = true;
      state.currentColor = card.color;
      break;
    }
    case 'wild4': {
      const p4 = state.players[nextIdx()];
      p4.hand.push(...drawFromDeck(4));
      state.penaltyInfo = { playerName: p4.name, amount: 4 };
      state.pendingSkip = true;
      // color chosen by picker
      break;
    }
    default:
      state.currentColor = card.color;
  }
}

// ── Actions ───────────────────────────────────────────────────────────────────
function selectCard(handIdx) {
  const player = curPlayer();

  // After drawing, only allow playing the drawn card
  if (state.drawnIdx !== null && handIdx !== state.drawnIdx) {
    state.message = 'After drawing you can only play the drawn card.';
    render(); return;
  }

  // Deselect tap
  if (state.selectedIdx === handIdx) {
    state.selectedIdx = null;
    state.message = '';
    render(); return;
  }

  const card = player.hand[handIdx];
  if (!canPlay(card)) {
    state.message = "That card can't be played right now!";
    render(); return;
  }

  state.selectedIdx = handIdx;
  state.message = '';
  render();
}

function drawCard() {
  if (state.drawnIdx !== null) {
    state.message = 'You already drew a card this turn.';
    render(); return;
  }

  const player = curPlayer();
  const drawn = drawFromDeck(1);
  if (!drawn.length) return;

  player.hand.push(drawn[0]);
  state.drawnIdx = player.hand.length - 1;
  state.selectedIdx = null;
  state.message = canPlay(drawn[0])
    ? 'Drawn card is playable — select it and press Enter, or press Enter to pass.'
    : 'No playable card drawn. Press Enter to pass.';
  render();
}

function confirmTurn() {
  if (state.phase !== 'play') return;

  const player = curPlayer();

  if (state.selectedIdx !== null) {
    // Play the selected card
    const card = player.hand.splice(state.selectedIdx, 1)[0];

    // Clear drawn reference if it was the drawn card (indices shift after splice)
    state.drawnIdx = null;
    state.selectedIdx = null;

    // UNO penalty: had 2 cards, now has 1, didn't call UNO
    if (player.hand.length === 1 && !state.unoShouted) {
      player.hand.push(...drawFromDeck(2));
      state.message = `${player.name} forgot to say UNO! +2 cards.`;
    }

    // Winner check
    if (player.hand.length === 0) {
      state.discard.push(card);
      state.winner = player.name;
      state.phase = 'winner';
      render(); return;
    }

    applyEffect(card);
    state.discard.push(card);
    state.unoShouted = false;

    if (WILDS.includes(card.value)) {
      state.phase = 'color-pick';
      render(); return;
    }

    beginSwitch();

  } else if (state.drawnIdx !== null) {
    // Drew but chose not to play
    state.drawnIdx = null;
    state.unoShouted = false;
    beginSwitch();

  } else {
    state.message = 'Draw a card or select one to play first!';
    render();
  }
}

function pickColor(color) {
  state.currentColor = color;
  state.phase = 'play';
  state.unoShouted = false;
  beginSwitch();
}

function beginSwitch() {
  const skip = state.pendingSkip;
  state.pendingSkip = false;
  state.nextIdx    = nextIdx(skip);
  state.switchPhase = 1;
  state.phase      = 'switching';
  render();

  if (switchTimer)  clearTimeout(switchTimer);
  if (switchTimer2) clearTimeout(switchTimer2);

  const delay1 = state.penaltyInfo ? 2000 : 4000;
  const delay2 = state.penaltyInfo ? 2000 : 0;

  switchTimer = setTimeout(() => {
    if (state.penaltyInfo) {
      state.switchPhase = 2;
      render();
    }
    switchTimer2 = setTimeout(() => {
      state.currentIdx  = state.nextIdx;
      state.phase       = 'play';
      state.message     = '';
      state.selectedIdx = null;
      state.drawnIdx    = null;
      state.penaltyInfo = null;
      state.switchPhase = 1;
      render();
    }, delay2);
  }, delay1);
}

// ── Card rendering ────────────────────────────────────────────────────────────
function cardSymbol(value) {
  return { skip: '⊘', reverse: '↺', draw2: '+2', wild: '★', wild4: '+4' }[value] ?? value;
}

function cardColorClass(card) {
  return WILDS.includes(card.value) ? 'card-wild' : `card-${card.color}`;
}

function cardHTML(card, { selected = false, unplayable = false, drawn = false, dataIdx } = {}) {
  const sym = cardSymbol(card.value);
  const cls = [
    'card',
    cardColorClass(card),
    selected   ? 'selected'   : '',
    unplayable ? 'unplayable' : '',
    drawn      ? 'drawn-card' : '',
  ].filter(Boolean).join(' ');
  const data = dataIdx !== undefined ? `data-idx="${dataIdx}"` : '';

  return `
    <div class="${cls}" ${data} title="${esc(card.color)} ${esc(card.value)}">
      <span class="card-corner tl">${sym}</span>
      <span class="card-mid">${sym}</span>
      <span class="card-corner br">${sym}</span>
    </div>`;
}

function deckHTML(count) {
  return `
    <div class="card card-back draw-pile-btn" id="draw-pile-btn" title="Draw a card">
      <span class="card-mid" style="font-size:13px;opacity:.7">🂠<br><small>${count}</small></span>
    </div>`;
}

// ── Screen renderers ──────────────────────────────────────────────────────────
function renderSetup() {
  const app = document.getElementById('app');
  const valid = setupNames.filter(n => n.trim()).length >= 2;

  app.innerHTML = `
    <div class="setup-screen">
      <h1 class="uno-logo">UNO</h1>
      <div class="setup-box">
        <h2>Who's playing? (2–10 players)</h2>
        <div id="names-list">
          ${setupNames.map((n, i) => `
            <div class="name-row">
              <div class="player-num">${i + 1}</div>
              <input class="name-input" type="text" placeholder="Player ${i + 1}"
                value="${esc(n)}" data-i="${i}" maxlength="18"
                autocomplete="off" spellcheck="false" />
              ${i >= 2
                ? `<button class="rm-btn" data-rm="${i}">✕</button>`
                : `<div style="width:34px"></div>`}
            </div>`).join('')}
        </div>
        ${setupNames.length < 10 ? `<button class="add-btn" id="add-btn">+ Add Player</button>` : ''}
        <button class="start-btn" id="start-btn" ${valid ? '' : 'disabled'}>Start Game →</button>
      </div>
    </div>`;

  app.querySelectorAll('.name-input').forEach(inp => {
    inp.addEventListener('input', e => {
      setupNames[+e.target.dataset.i] = e.target.value;
      const s = document.getElementById('start-btn');
      if (s) s.disabled = setupNames.filter(n => n.trim()).length < 2;
    });
    inp.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const all = [...app.querySelectorAll('.name-input')];
      const next = all[all.indexOf(e.target) + 1];
      if (next) next.focus();
      else document.getElementById('start-btn')?.click();
    });
  });

  app.querySelectorAll('[data-rm]').forEach(btn => {
    btn.addEventListener('click', e => {
      setupNames.splice(+e.target.dataset.rm, 1);
      renderSetup();
    });
  });

  document.getElementById('add-btn')?.addEventListener('click', () => {
    setupNames.push('');
    renderSetup();
    document.querySelectorAll('.name-input')[setupNames.length - 1]?.focus();
  });

  document.getElementById('start-btn')?.addEventListener('click', () => {
    const names = setupNames.map(n => n.trim()).filter(Boolean);
    if (names.length < 2) return;
    state = createState(names);
    render();
  });

  // Focus first empty input
  const empty = app.querySelector('.name-input[value=""]') ?? app.querySelector('.name-input');
  empty?.focus();
}

function renderSwitching() {
  const app  = document.getElementById('app');
  const next = state.players[state.nextIdx];
  const same = state.nextIdx === state.currentIdx;

  let heading, subheading;

  if (state.switchPhase === 1 && state.penaltyInfo) {
    heading    = `${esc(state.penaltyInfo.playerName)} draws ${state.penaltyInfo.amount}!`;
    subheading = `${esc(state.penaltyInfo.playerName)} is skipped`;
  } else if (same) {
    heading    = 'Play again!';
    subheading = esc(next.name);
  } else {
    heading    = 'Pass the device to';
    subheading = esc(next.name);
  }

  const totalDuration = state.penaltyInfo ? 2 : 4;

  app.innerHTML = `
    <div class="switching-screen">
      <div class="switch-msg">${heading}</div>
      <div class="switch-name">${subheading}</div>
      <div id="sw-count" class="switch-count">${totalDuration}</div>
      <div class="switch-sub">Cards are hidden — please wait</div>
    </div>`;

  let t = totalDuration;
  const el = document.getElementById('sw-count');
  const iv = setInterval(() => {
    t--;
    if (el) el.textContent = t;
    if (t <= 0) clearInterval(iv);
  }, 1000);
}

function renderGame() {
  const app = document.getElementById('app');
  const player = curPlayer();
  const discardTop = topCard();
  const hand = player.hand;

  const colorMap = { red: '#ef4444', blue: '#3b82f6', green: '#22c55e', yellow: '#eab308' };
  const dotColor = colorMap[state.currentColor] ?? '#6b7280';

  const handHTML = hand.map((card, i) => {
    const isSelected  = state.selectedIdx === i;
    const isDrawn     = state.drawnIdx === i;
    const isUnplayable = state.drawnIdx !== null
      ? i !== state.drawnIdx          // after drawing only drawn card is usable
      : !canPlay(card);

    return cardHTML(card, {
      selected: isSelected,
      unplayable: !isSelected && isUnplayable,
      drawn: isDrawn,
      dataIdx: i,
    });
  }).join('');

  const canDraw    = state.drawnIdx === null && state.selectedIdx === null;
  const canConfirm = state.selectedIdx !== null || state.drawnIdx !== null;
  const showUno    = hand.length === 2 && !state.unoShouted;

  const colorPickHTML = state.phase === 'color-pick' ? `
    <div class="color-overlay">
      <div class="color-title">Choose a color</div>
      <div class="color-grid">
        ${COLORS.map(c => `
          <button class="color-choice color-choice-${c}" data-color="${c}">
            ${c.charAt(0).toUpperCase() + c.slice(1)}
          </button>`).join('')}
      </div>
    </div>` : '';

  app.innerHTML = `
    ${colorPickHTML}
    <div class="game-layout">
      <div class="status-bar">
        <span class="status-turn">🎮 ${esc(player.name)}'s turn</span>
        <span class="status-sep">·</span>
        <span>Color: <span class="color-dot" style="background:${dotColor}"></span><strong>${esc(state.currentColor)}</strong></span>
        <span class="status-sep">·</span>
        <span>${state.direction === 1 ? '↻ Clockwise' : '↺ Counter-CW'}</span>
        ${state.message ? `<span class="status-sep">·</span><span class="status-msg">${esc(state.message)}</span>` : ''}
      </div>

      <div class="table-area" id="table-area">
        <div class="table-oval" id="table-oval">
          <div class="piles">
            <div class="pile">
              <div class="pile-lbl">Draw (${state.deck.length})</div>
              ${deckHTML(state.deck.length)}
            </div>
            <div class="pile">
              <div class="pile-lbl">Discard</div>
              ${cardHTML(discardTop)}
            </div>
          </div>
          <div class="direction-badge">${state.direction === 1 ? '↻' : '↺'}</div>
        </div>
        <div class="seats" id="seats"></div>
      </div>

      <div class="hand-area">
        <div class="hand-header">
          <span class="hand-name">🖐 ${esc(player.name)}</span>
          <span class="hand-count">${hand.length} card${hand.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="hand-cards" id="hand-cards">${handHTML}</div>
        <div class="hand-actions">
          <button class="btn btn-draw" id="btn-draw" ${canDraw ? '' : 'disabled'}>Draw Card</button>
          ${showUno ? `<button class="btn btn-uno" id="btn-uno">UNO! 🔴</button>` : ''}
          <button class="btn btn-end" id="btn-end" ${canConfirm ? '' : 'disabled'}>End Turn ↵</button>
        </div>
        <div class="hand-hint">Click a card to select · Press Enter or End Turn to confirm</div>
      </div>
    </div>`;

  // Bind hand card clicks
  document.querySelectorAll('[data-idx]').forEach(el => {
    el.addEventListener('click', () => selectCard(+el.dataset.idx));
  });

  document.getElementById('draw-pile-btn')?.addEventListener('click', () => {
    if (state.drawnIdx === null) drawCard();
  });
  document.getElementById('btn-draw')?.addEventListener('click', drawCard);
  document.getElementById('btn-end')?.addEventListener('click', confirmTurn);
  document.getElementById('btn-uno')?.addEventListener('click', () => {
    state.unoShouted = true;
    state.message = 'UNO! 🔴';
    render();
  });

  // Color picker buttons
  document.querySelectorAll('[data-color]').forEach(btn => {
    btn.addEventListener('click', () => pickColor(btn.dataset.color));
  });

  // Position seat tokens around the oval (after layout)
  requestAnimationFrame(positionSeats);
}

function positionSeats() {
  const seats    = document.getElementById('seats');
  const oval     = document.getElementById('table-oval');
  const area     = document.getElementById('table-area');
  if (!seats || !oval || !area) return;

  const oR = oval.getBoundingClientRect();
  const aR = area.getBoundingClientRect();
  const cx = oR.left + oR.width  / 2 - aR.left;
  const cy = oR.top  + oR.height / 2 - aR.top;
  const rx = oR.width  / 2 + 75;
  const ry = oR.height / 2 + 60;
  const n  = state.players.length;

  seats.innerHTML = state.players.map((p, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i / n);
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    const active = i === state.currentIdx;

    return `
      <div class="seat ${active ? 'seat-active' : ''}" style="left:${x}px;top:${y}px;">
        <div class="seat-avatar">${esc(p.name.charAt(0).toUpperCase())}</div>
        <div class="seat-label">${esc(p.name)}</div>
        <div class="seat-count">${p.hand.length} 🃏</div>
      </div>`;
  }).join('');
}

function renderWinner() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="winner-screen">
      <div class="winner-trophy">🏆</div>
      <div class="winner-shout">UNO!</div>
      <div class="winner-name">${esc(state.winner)} wins!</div>
      <div class="winner-sub">First to play all their cards</div>
      <button class="btn-again" id="btn-again">Play Again</button>
    </div>`;

  document.getElementById('btn-again').addEventListener('click', () => {
    state = null;
    setupNames = ['', ''];
    render();
  });
}

// ── Master render ─────────────────────────────────────────────────────────────
function render() {
  if (!state) { renderSetup(); return; }
  switch (state.phase) {
    case 'switching':  renderSwitching(); break;
    case 'winner':     renderWinner();    break;
    default:           renderGame();      break;
  }
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && state?.phase === 'play') confirmTurn();
});

// ── Boot ──────────────────────────────────────────────────────────────────────
render();

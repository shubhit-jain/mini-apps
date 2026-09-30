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

// ── Question Banks ────────────────────────────────────────────────────────────
const BANKS = {
  hardware: {
    name: 'Computer Hardware',
    emoji: '💻',
    color: '#6366f1',
    questions: [
      { visual: '🧠', clue: 'Called the "brain" of the computer. Every app, game, and task runs through it. Short form: C-P-U.', answer: 'cpu', aliases: ['processor', 'central processing unit'] },
      { visual: '📋', clue: 'The computer\'s short-term memory. It holds open apps and tabs. Clears completely when you restart. Short form: R-A-M.', answer: 'ram', aliases: ['random access memory', 'memory'] },
      { visual: '💾', clue: 'The big storage inside your computer. Keeps all your files, photos, and games even when powered off. Called a "hard ___".', answer: 'hard drive', aliases: ['hdd', 'hard disk', 'hard disk drive'] },
      { visual: '⚡', clue: 'The box inside your PC that converts electricity from the wall into safe voltage for all parts. Short: P-S-U.', answer: 'power supply', aliases: ['psu', 'power supply unit'] },
      { visual: '🖥️', clue: 'The big flat circuit board that everything plugs into — CPU, RAM, and more. Also called "mobo".', answer: 'motherboard', aliases: ['mainboard', 'mobo'] },
      { visual: '🎮', clue: 'Makes all the visuals on your screen. Gamers spend big money on this. Also called a "video card" or GPU.', answer: 'graphics card', aliases: ['gpu', 'graphics processing unit', 'video card'] },
      { visual: '❄️', clue: 'Sits on top of the CPU and keeps it from overheating. Has a spinning fan. Two words — "CPU ___".', answer: 'cpu fan', aliases: ['fan', 'cooler', 'cpu cooler', 'heatsink', 'heat sink'] },
      { visual: '📀', clue: 'The tray that slides out to hold a CD or DVD. Uses a laser to read the disc. Called an "optical ___".', answer: 'optical drive', aliases: ['dvd drive', 'cd drive', 'disc drive', 'dvd'] },
      { visual: '⚙️', clue: 'Like a hard drive but way faster and silent — no spinning parts inside. 3 letters: S-S-_', answer: 'ssd', aliases: ['solid state drive', 'solid-state drive'] },
      { visual: '🖱️', clue: 'You slide it around on your desk and it moves the pointer on screen.', answer: 'mouse', aliases: [] },
      { visual: '⌨️', clue: 'You press its keys to type words, numbers, and commands into the computer.', answer: 'keyboard', aliases: [] },
      { visual: '📡', clue: 'A small card inside a desktop PC that lets it connect to wireless internet without a cable.', answer: 'wifi card', aliases: ['wireless card', 'wifi adapter', 'wireless adapter', 'wi-fi card', 'wifi'] },
      { visual: '🔊', clue: 'Plugged into your computer or TV to produce sound. Come in pairs usually!', answer: 'speakers', aliases: ['speaker', 'sound card'] },
      { visual: '📺', clue: 'The screen that shows you everything — your desktop, videos, and games. Measured diagonally in inches.', answer: 'monitor', aliases: ['screen', 'display'] },
      { visual: '🔋', clue: 'Found in every laptop. Lets you use it away from the charger. Loses charge over time.', answer: 'battery', aliases: [] },
    ],
  },

  supercars: {
    name: 'Supercar Brands',
    emoji: '🏎️',
    color: '#f43f5e',
    questions: [
      { visual: '🇮🇹', clue: 'The most famous supercar brand in the world. Italian. Red cars with a prancing horse logo. Starts with F.', answer: 'ferrari', aliases: [] },
      { visual: '🇮🇹', clue: 'Italian rival to Ferrari — started by a tractor maker! A raging bull is their logo. Makes the Aventador and Huracán.', answer: 'lamborghini', aliases: [] },
      { visual: '🇩🇪', clue: 'German sports car brand. Their most famous model is the "911". Four-letter brand starting with P.', answer: 'porsche', aliases: [] },
      { visual: '🇬🇧', clue: 'British brand that also races in Formula 1. Made the iconic P1 hypercar. 7 letters, starts with Mc.', answer: 'mclaren', aliases: [] },
      { visual: '🇫🇷', clue: 'French hypercar — the most expensive and powerful production car ever made. The Chiron and Veyron are their models.', answer: 'bugatti', aliases: [] },
      { visual: '🇬🇧', clue: 'The world\'s most luxurious car brand. Has a "Spirit of Ecstasy" figurine on the hood. Two words — like the famous poem "Rolls ___".', answer: 'rolls royce', aliases: ['rolls-royce', 'rollsroyce'] },
      { visual: '🇮🇹', clue: 'Italian luxury brand with a trident logo (like a pitchfork). Their supercar is called the MC20.', answer: 'maserati', aliases: [] },
      { visual: '🇸🇪', clue: 'Swedish hypercar — one of the rarest in the world. The Jesko model aims for 300+ mph. Hard to spell! Starts with K.', answer: 'koenigsegg', aliases: [] },
      { visual: '🇬🇧', clue: 'Ultra-luxury British car brand. Owned by Volkswagen. Their Continental GT is a grand tourer. Starts with B.', answer: 'bentley', aliases: [] },
      { visual: '🇺🇸', clue: 'America\'s most famous sports car — made by Chevrolet since 1953. Mid-engine layout since 2020! Starts with C.', answer: 'corvette', aliases: ['chevrolet corvette', 'chevy corvette'] },
      { visual: '🇩🇪', clue: 'Famous German car brand. Their AMG performance division makes the GT Black Series. Three-pointed star logo.', answer: 'mercedes', aliases: ['mercedes-benz', 'mercedes benz', 'merc'] },
      { visual: '🇮🇹', clue: 'Italian hypercar brand founded in 1992 — makes only a handful of cars per year. The Huayra is their flagship model.', answer: 'pagani', aliases: [] },
      { visual: '🇩🇪', clue: 'German car brand with FOUR interlocking rings as their logo. Their sports car is the R8 with a V10 engine.', answer: 'audi', aliases: [] },
      { visual: '🇺🇸', clue: 'American tuner known for extreme modified cars. Their Venom F5 is one of the fastest cars ever. Starts with H.', answer: 'hennessey', aliases: ['hennessey venom'] },
      { visual: '🇬🇧', clue: 'The British sports car that James Bond drives! Makes the DB11 and Vantage. Two words — starts with "Aston".', answer: 'aston martin', aliases: ['astonmartin', 'aston-martin'] },
    ],
  },

  states: {
    name: 'Indian States',
    emoji: '🗺️',
    color: '#10b981',
    questions: [
      {
        // Kerala: very tall and narrow — like a thin finger along the southwest coast
        // Width ~30px, height ~170px
        points: '76,5 96,5 102,32 100,62 96,92 91,122 85,150 78,172 65,175 56,160 60,130 65,100 68,70 71,38',
        hint: 'A very long, narrow state along the southwest coast. Famous for backwaters, coconut trees, and houseboats. Capital: Thiruvananthapuram.',
        answer: 'kerala',
        aliases: [],
      },
      {
        // Rajasthan: largest state — wide and tall, roughly rectangular, slightly tapered
        // Width ~165px, height ~115px
        points: '8,35 158,18 175,52 165,110 125,130 55,135 8,115 0,72',
        hint: 'The LARGEST state in India by area — mostly desert (Thar Desert). The Pink City Jaipur is its capital.',
        answer: 'rajasthan',
        aliases: [],
      },
      {
        // Tamil Nadu: roughly triangular — wide at north, narrows sharply to a point at south (Kanyakumari)
        // Wide top (~145px), narrows to a point at bottom (~y=175)
        points: '22,18 152,18 168,55 150,100 122,140 90,176 65,174 28,138 14,95 20,55',
        hint: 'Shaped like a triangle pointing south. Chennai is its capital. The very tip at Kanyakumari is where three seas meet!',
        answer: 'tamil nadu',
        aliases: ['tamilnadu'],
      },
      {
        // Punjab: small and roughly square/trapezoidal — northwest India
        // ~100px x 100px
        points: '30,28 108,20 120,55 112,128 60,135 22,110 18,65',
        hint: 'A small state in the northwest. Famous for the Golden Temple in Amritsar and rich farmland. Capital: Chandigarh.',
        answer: 'punjab',
        aliases: [],
      },
      {
        // Goa: tiny coastal state — visibly smaller than all others
        // Make it clearly small ~70px x 80px, centered
        points: '62,45 122,38 132,70 124,128 66,134 48,105 46,70',
        hint: 'The SMALLEST state in India. Famous for beaches, seafood, and festivals. Capital: Panaji.',
        answer: 'goa',
        aliases: [],
      },
      {
        // Gujarat: distinctive — main body at top, Saurashtra peninsula bulges south
        // The Gulf of Khambhat creates a concavity on the east side of the peninsula
        points: '8,20 155,14 170,50 164,82 152,98 160,115 148,148 106,172 70,165 46,142 53,118 36,98 14,78 6,50',
        hint: 'Western state with a big peninsula (Saurashtra) jutting into the Arabian Sea. Home of Garba and the Gir Forest lions. Capital: Gandhinagar.',
        answer: 'gujarat',
        aliases: [],
      },
      {
        // West Bengal: DISTINCTIVE chicken neck — narrow corridor at top (~25px wide), then widens sharply
        // Narrow at top (Siliguri corridor), wide at bottom
        points: '83,5 103,5 108,28 106,52 120,72 140,96 137,128 116,160 76,165 45,148 40,118 52,80 79,58 85,32',
        hint: 'Has a very narrow "chicken neck" corridor at the top connecting to Northeast India, then widens. Kolkata is its capital.',
        answer: 'west bengal',
        aliases: ['bengal', 'wb'],
      },
      {
        // Madhya Pradesh: wide central state — wider than tall
        // ~175px wide, ~95px tall
        points: '5,38 168,24 188,60 168,102 95,118 12,102 0,65',
        hint: 'The large central state of India — "Madhya" means "middle". Famous for tiger reserves like Kanha and Bandhavgarh. Capital: Bhopal.',
        answer: 'madhya pradesh',
        aliases: ['mp'],
      },
      {
        // Uttar Pradesh: very wide and flat — wider than MP
        // ~185px wide, ~85px tall, very rectangular
        points: '2,25 178,18 192,55 178,100 85,118 2,98',
        hint: 'The most POPULOUS state in India — more people than most countries! The Taj Mahal is here. Capital: Lucknow.',
        answer: 'uttar pradesh',
        aliases: ['up'],
      },
      {
        // Maharashtra: wide N border, irregular S border that dips in the middle
        // Left coast (Konkan) is NOT vertical — x varies 12→22 as you go south
        // S border slopes: high-E (Chandrapur ~y=92) dips to middle-S (Nanded ~y=128) rises to W (Sindhudurg ~y=112)
        points: '15,32 170,25 178,58 172,92 148,108 118,128 62,130 22,112 14,82 12,52',
        hint: 'A large western state home to Mumbai — India\'s financial capital and Bollywood. Capital: Mumbai.',
        answer: 'maharashtra',
        aliases: [],
      },
      {
        // Karnataka: roughly quadrilateral/irregular — wider at north, tapers south
        // ~148px wide, ~135px tall
        points: '10,22 108,14 152,35 162,88 122,134 68,144 10,120 4,70',
        hint: 'Southern state. Bengaluru (Bangalore) is its capital — India\'s IT hub and "Silicon Valley of India".',
        answer: 'karnataka',
        aliases: [],
      },
      {
        // Himachal Pradesh: elongated E-W, narrow N-S — sits in the mountains
        // ~145px wide, ~100px tall
        points: '20,55 58,20 108,8 150,28 146,84 110,102 56,118 14,92',
        hint: 'A northern mountain state in the Himalayas. Shimla is the capital. Famous for apple orchards and heavy snowfall in winter.',
        answer: 'himachal pradesh',
        aliases: ['hp', 'himachal'],
      },
    ],
  },
};

// ── State ─────────────────────────────────────────────────────────────────────
let state = null;

function initState(playerName, categoryKey) {
  return {
    phase: 'playing',
    playerName,
    categoryKey,
    questions: shuffle([...BANKS[categoryKey].questions]),
    currentQ: 0,
    score: 0,
    timeLeft: 60,
    timerInterval: null,
    lastCorrect: null,
    lastCorrectAnswer: '',
  };
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function getLeaderboard() {
  try { return JSON.parse(localStorage.getItem('guesser_lb') || '[]'); }
  catch { return []; }
}

function saveScore(playerName, categoryKey, score) {
  const lb = getLeaderboard();
  lb.push({ name: playerName, category: categoryKey, score });
  lb.sort((a, b) => b.score - a.score);
  lb.splice(10);
  localStorage.setItem('guesser_lb', JSON.stringify(lb));
}

// ── Answer checking ───────────────────────────────────────────────────────────
function checkAnswer(input, question) {
  const norm = input.trim().toLowerCase();
  if (!norm) return false;
  return [question.answer, ...question.aliases]
    .map(a => a.toLowerCase())
    .some(a => a === norm);
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerUI();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      endGame();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function updateTimerUI() {
  const txt = document.getElementById('timer-text');
  const bar = document.getElementById('timer-fill');
  if (txt) txt.textContent = state.timeLeft;
  if (bar) {
    bar.style.width = (state.timeLeft / 60 * 100) + '%';
    bar.className = 'timer-fill'
      + (state.timeLeft <= 10 ? ' danger'  : '')
      + (state.timeLeft > 10 && state.timeLeft <= 20 ? ' warning' : '');
  }
}

// ── Game actions ──────────────────────────────────────────────────────────────
function submitAnswer() {
  if (state.phase !== 'playing') return;
  const input = document.getElementById('answer-input');
  if (!input) return;

  const question = state.questions[state.currentQ];
  const correct  = checkAnswer(input.value, question);

  state.lastCorrect      = correct;
  state.lastCorrectAnswer = question.answer;
  if (correct) state.score++;

  state.phase = 'result';
  render();

  setTimeout(() => {
    if (state.phase !== 'result') return; // time ran out during flash
    advanceQuestion();
  }, 1500);
}

function skipQuestion() {
  if (state.phase !== 'playing') return;
  state.lastCorrect       = false;
  state.lastCorrectAnswer = state.questions[state.currentQ].answer;
  state.phase = 'result';
  render();

  setTimeout(() => {
    if (state.phase !== 'result') return;
    advanceQuestion();
  }, 1000);
}

function advanceQuestion() {
  state.currentQ++;
  if (state.currentQ >= state.questions.length) { endGame(); return; }
  state.phase = 'playing';
  render();
  document.getElementById('answer-input')?.focus();
}

function endGame() {
  stopTimer();
  saveScore(state.playerName, state.categoryKey, state.score);
  state.phase = 'end';
  render();
}

// ── Renderers ─────────────────────────────────────────────────────────────────
function render() {
  if (!state) { renderHome(); return; }
  switch (state.phase) {
    case 'playing':     renderPlaying();     break;
    case 'result':      renderResult();      break;
    case 'end':         renderEnd();         break;
    case 'leaderboard': renderLeaderboard(); break;
    default:            renderHome();        break;
  }
}

function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="home-screen">
      <div class="game-title">GUESSER! 🎯</div>
      <div class="game-subtitle">60 seconds &middot; answer as many as you can</div>

      <div class="card">
        <label class="field-label" for="player-name">Your name</label>
        <input id="player-name" class="text-input" type="text"
          placeholder="Enter your name..."
          maxlength="20" autocomplete="off" spellcheck="false" />
      </div>

      <div class="card">
        <div class="field-label">Pick a category</div>
        <div class="category-list">
          ${Object.entries(BANKS).map(([key, bank]) => `
            <button class="cat-btn" data-key="${key}">
              <span class="cat-emoji">${bank.emoji}</span>
              <span>${esc(bank.name)}</span>
            </button>`).join('')}
        </div>
      </div>

      <button class="btn-primary" id="start-btn" disabled>Play! &rarr;</button>
      <button class="btn-ghost"   id="lb-btn">&#127942; Leaderboard</button>
    </div>`;

  let chosenCat = null;
  const nameInput = document.getElementById('player-name');
  const startBtn  = document.getElementById('start-btn');

  const checkReady = () => {
    startBtn.disabled = !(nameInput.value.trim() && chosenCat);
  };

  nameInput.addEventListener('input', checkReady);

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      chosenCat = btn.dataset.key;
      checkReady();
    });
  });

  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name || !chosenCat) return;
    state = initState(name, chosenCat);
    render();
    startTimer();
    document.getElementById('answer-input')?.focus();
  });

  document.getElementById('lb-btn').addEventListener('click', () => {
    state = { phase: 'leaderboard' };
    render();
  });

  nameInput.focus();
}

function renderPlaying() {
  const app      = document.getElementById('app');
  const bank     = BANKS[state.categoryKey];
  const question = state.questions[state.currentQ];
  const qNum     = state.currentQ + 1;
  const total    = state.questions.length;

  let questionHTML;
  if (state.categoryKey === 'states') {
    questionHTML = `
      <div class="state-visual">
        <svg viewBox="-5 0 210 210" class="state-svg" aria-hidden="true">
          <polygon points="${esc(question.points)}"
            style="fill:${bank.color}28;stroke:${bank.color};stroke-width:2.5;stroke-linejoin:round" />
        </svg>
      </div>
      <div class="q-hint">${esc(question.hint)}</div>`;
  } else {
    const blanks = question.answer.split(' ').map(w => '_ '.repeat(w.length).trim()).join('  ');
    questionHTML = `
      <div class="q-visual">${question.visual}</div>
      <div class="q-clue">${esc(question.clue)}</div>
      <div class="q-blanks">${esc(blanks)}</div>`;
  }

  app.innerHTML = `
    <div class="game-screen" data-cat="${state.categoryKey}">
      <div class="top-bar">
        <div class="score-badge">Score: <strong>${state.score}</strong></div>
        <div class="q-counter">${qNum} / ${total}</div>
      </div>

      <div class="timer-bar-wrap">
        <div class="timer-bar">
          <div class="timer-fill" id="timer-fill"
               style="width:${state.timeLeft / 60 * 100}%"></div>
        </div>
        <div class="timer-text" id="timer-text">${state.timeLeft}</div>
      </div>

      <div class="question-card">
        <div class="cat-badge" style="background:${bank.color}">
          ${bank.emoji} ${esc(bank.name)}
        </div>
        ${questionHTML}
      </div>

      <div class="answer-area">
        <input id="answer-input" class="answer-input" type="text"
          placeholder="Type your answer..."
          autocomplete="off" spellcheck="false" maxlength="50" />
        <div class="answer-actions">
          <button class="btn-skip"   id="skip-btn">Skip &rarr;</button>
          <button class="btn-submit" id="submit-btn">Submit &crarr;</button>
        </div>
      </div>
    </div>`;

  document.getElementById('answer-input').focus();
  document.getElementById('submit-btn').addEventListener('click', submitAnswer);
  document.getElementById('skip-btn').addEventListener('click', skipQuestion);
  document.getElementById('answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAnswer();
  });
  updateTimerUI();
}

function renderResult() {
  const app     = document.getElementById('app');
  const correct = state.lastCorrect;
  app.innerHTML = `
    <div class="result-screen ${correct ? 'correct' : 'wrong'}">
      <div class="result-icon">${correct ? '✅' : '❌'}</div>
      <div class="result-msg">${correct ? 'Correct! +1' : 'Not quite!'}</div>
      ${!correct
        ? `<div class="result-ans">Answer: <strong>${esc(state.lastCorrectAnswer)}</strong></div>`
        : ''}
      <div class="result-score">Score: ${state.score}</div>
    </div>`;
}

function renderEnd() {
  const app  = document.getElementById('app');
  const bank = BANKS[state.categoryKey];
  app.innerHTML = `
    <div class="end-screen">
      <div class="end-trophy">&#127942;</div>
      <div class="end-title">Time's Up!</div>
      <div class="end-name">${esc(state.playerName)}</div>
      <div class="end-category">${bank.emoji} ${esc(bank.name)}</div>
      <div class="end-score">${state.score}
        <span class="end-score-label">correct</span>
      </div>
      <div class="end-total">out of ${state.questions.length} questions</div>
      <div class="end-actions">
        <button class="btn-primary" id="play-again-btn">Play Again</button>
        <button class="btn-ghost"   id="lb-btn">&#127942; Leaderboard</button>
      </div>
    </div>`;

  document.getElementById('play-again-btn').addEventListener('click', () => {
    state = null;
    render();
  });
  document.getElementById('lb-btn').addEventListener('click', () => {
    state.phase = 'leaderboard';
    render();
  });
}

function renderLeaderboard() {
  const app = document.getElementById('app');
  const lb  = getLeaderboard();
  const catNames = {
    hardware:  'Computer Hardware',
    supercars: 'Supercar Brands',
    states:    'Indian States',
  };

  app.innerHTML = `
    <div class="lb-screen">
      <div class="lb-title">&#127942; Leaderboard</div>
      ${lb.length === 0
        ? '<div class="lb-empty">No scores yet — be the first!</div>'
        : `<div class="lb-list">
            ${lb.map((entry, i) => `
              <div class="lb-row ${i < 3 ? 'lb-top' : ''}">
                <span class="lb-rank">${i + 1}</span>
                <span class="lb-name">${esc(entry.name)}</span>
                <span class="lb-cat">${esc(catNames[entry.category] || entry.category)}</span>
                <span class="lb-score">${entry.score}</span>
              </div>`).join('')}
          </div>`}
      <button class="btn-ghost" id="back-btn">&larr; Back</button>
    </div>`;

  document.getElementById('back-btn').addEventListener('click', () => {
    state = null;
    render();
  });
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && state?.phase === 'playing') submitAnswer();
});

// ── Boot ──────────────────────────────────────────────────────────────────────
render();

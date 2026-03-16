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
    color: '#4f46e5',
    questions: [
      { visual: '🧠', clue: 'The brain of the computer — processes every instruction', answer: 'cpu', aliases: ['processor', 'central processing unit'] },
      { visual: '📋', clue: 'Temporary memory that holds running programs. Gone when you shut down!', answer: 'ram', aliases: ['random access memory', 'memory'] },
      { visual: '💾', clue: 'Stores your files permanently, even when powered off. Has spinning discs inside!', answer: 'hard drive', aliases: ['hdd', 'hard disk', 'hard disk drive'] },
      { visual: '⚡', clue: 'Converts wall power into safe voltage for all components', answer: 'power supply', aliases: ['psu', 'power supply unit'] },
      { visual: '🖥️', clue: 'The main circuit board — every component plugs into it', answer: 'motherboard', aliases: ['mainboard', 'mobo'] },
      { visual: '🎮', clue: 'Renders all the graphics and video on your screen. Gamers want a powerful one!', answer: 'graphics card', aliases: ['gpu', 'graphics processing unit', 'video card'] },
      { visual: '❄️', clue: 'Keeps the CPU from overheating. It spins fast to blow heat away!', answer: 'cpu fan', aliases: ['fan', 'cooler', 'cpu cooler', 'heatsink', 'heat sink'] },
      { visual: '📀', clue: 'Reads and writes CDs and DVDs using a laser beam', answer: 'optical drive', aliases: ['dvd drive', 'cd drive', 'disc drive', 'dvd'] },
      { visual: '⚙️', clue: 'Super-fast storage with no moving parts — much quicker than an HDD', answer: 'ssd', aliases: ['solid state drive', 'solid-state drive'] },
      { visual: '🖱️', clue: 'You move it on your desk to control the cursor on screen', answer: 'mouse', aliases: [] },
      { visual: '⌨️', clue: 'You type on it to give text and commands to the computer', answer: 'keyboard', aliases: [] },
      { visual: '📡', clue: 'Lets your computer connect to Wi-Fi without any cables', answer: 'wifi card', aliases: ['wireless card', 'wifi adapter', 'wireless adapter', 'wi-fi card', 'wifi'] },
      { visual: '🔊', clue: 'Turns digital audio signals into sounds you can actually hear', answer: 'speakers', aliases: ['speaker', 'sound card'] },
      { visual: '📺', clue: 'Displays everything visually. Size is measured diagonally in inches.', answer: 'monitor', aliases: ['screen', 'display'] },
      { visual: '🔋', clue: 'Stores power in laptops so you can use them without plugging in', answer: 'battery', aliases: [] },
    ],
  },

  supercars: {
    name: 'Supercar Brands',
    emoji: '🏎️',
    color: '#dc2626',
    questions: [
      { visual: '🇮🇹', clue: 'Italian brand since 1947. Prancing horse logo. The 458 Italia and LaFerrari are iconic.', answer: 'ferrari', aliases: [] },
      { visual: '🇮🇹', clue: 'Italian brand since 1963, started by a tractor manufacturer! Raging bull logo. Makes the Aventador and Huracán.', answer: 'lamborghini', aliases: [] },
      { visual: '🇩🇪', clue: 'German sports car legend since 1931. The 911 has been in production for over 60 years!', answer: 'porsche', aliases: [] },
      { visual: '🇬🇧', clue: 'British brand from Woking. Makes the P1, Senna, and Speedtail hypercars.', answer: 'mclaren', aliases: [] },
      { visual: '🇫🇷', clue: 'French luxury brand owned by Volkswagen. The Chiron does 0–100 km/h in just 2.4 seconds!', answer: 'bugatti', aliases: [] },
      { visual: '🇬🇧', clue: 'British brand with the "Spirit of Ecstasy" hood ornament. Ghost, Wraith, and Phantom models.', answer: 'rolls royce', aliases: ['rolls-royce', 'rollsroyce'] },
      { visual: '🇮🇹', clue: 'Italian brand since 1914. Trident logo. The MC20 is their modern supercar.', answer: 'maserati', aliases: [] },
      { visual: '🇸🇪', clue: 'Swedish hypercar brand. The Jesko is engineered to surpass 300 mph!', answer: 'koenigsegg', aliases: [] },
      { visual: '🇬🇧', clue: 'British grand-tourer brand since 1919. Famous for the Continental GT.', answer: 'bentley', aliases: [] },
      { visual: '🇺🇸', clue: 'American sports car, a division of Chevrolet since 1953. Mid-engine since 2020!', answer: 'corvette', aliases: ['chevrolet corvette', 'chevy corvette'] },
      { visual: '🇩🇪', clue: 'German brand. The AMG GT Black Series makes 730 hp from a twin-turbo V8.', answer: 'mercedes', aliases: ['mercedes-benz', 'mercedes benz', 'merc'] },
      { visual: '🇮🇹', clue: 'Italian brand founded in 1992. The Huayra is named after the Andean wind god.', answer: 'pagani', aliases: [] },
      { visual: '🇩🇪', clue: 'German brand with signature quad LED headlights. The R8 V10 is their supercar.', answer: 'audi', aliases: [] },
      { visual: '🇺🇸', clue: 'American tuning company. The Venom F5 is chasing the title of world\'s fastest car.', answer: 'hennessey', aliases: ['hennessey venom'] },
      { visual: '🇬🇧', clue: 'British brand since 1913. Makes the DB11 and Vantage — licensed to kill, so to speak.', answer: 'aston martin', aliases: ['astonmartin', 'aston-martin'] },
    ],
  },

  states: {
    name: 'Indian States',
    emoji: '🗺️',
    color: '#059669',
    questions: [
      {
        points: '85,10 100,25 97,60 83,100 69,140 58,170 43,170 38,142 48,100 58,60 67,25',
        hint: 'Southernmost state, famous for backwaters and coconut trees',
        answer: 'kerala',
        aliases: [],
      },
      {
        points: '12,18 130,13 148,38 140,85 115,102 38,98 8,70',
        hint: 'Largest state by area, mostly desert. Jaipur is the Pink City capital.',
        answer: 'rajasthan',
        aliases: [],
      },
      {
        points: '38,12 135,12 148,45 133,88 92,140 62,168 33,138 22,88 32,45',
        hint: 'Southeasternmost state. Chennai is its capital. Famous for biryani and temples!',
        answer: 'tamil nadu',
        aliases: ['tamilnadu'],
      },
      {
        points: '28,32 108,22 120,52 115,105 78,118 22,93 18,57',
        hint: 'Small state in northwest India. Home of the Golden Temple in Amritsar.',
        answer: 'punjab',
        aliases: [],
      },
      {
        points: '58,42 108,32 120,62 108,102 72,112 52,87 48,62',
        hint: 'Smallest state in India by area. Famous for beaches. Panaji is the capital.',
        answer: 'goa',
        aliases: [],
      },
      {
        points: '8,12 78,8 102,28 90,62 118,78 148,92 132,128 88,148 52,143 28,118 12,82',
        hint: 'Western state with a distinctive peninsula poking into the sea. Home of Garba!',
        answer: 'gujarat',
        aliases: [],
      },
      {
        points: '58,8 92,8 108,32 102,78 85,112 52,132 22,108 22,65 42,28',
        hint: 'Eastern state with a narrow northern "neck". Home of Kolkata and the Sundarbans.',
        answer: 'west bengal',
        aliases: ['bengal', 'wb'],
      },
      {
        points: '8,28 162,18 178,48 162,90 100,102 18,90 2,58',
        hint: 'Large central state. Home of many tiger reserves including Kanha and Bandhavgarh.',
        answer: 'madhya pradesh',
        aliases: ['mp'],
      },
      {
        points: '5,18 168,12 180,48 168,95 88,108 5,90',
        hint: 'Most populous state in India. Lucknow is the capital. Home of the Taj Mahal!',
        answer: 'uttar pradesh',
        aliases: ['up'],
      },
      {
        points: '8,28 138,18 168,45 165,88 118,108 62,118 10,82',
        hint: 'Western state. Mumbai — India\'s financial capital — is here.',
        answer: 'maharashtra',
        aliases: [],
      },
      {
        points: '16,16 98,8 138,28 148,72 115,118 62,128 16,105 6,58',
        hint: 'Southern state. Bengaluru (Bangalore), India\'s IT hub, is the capital.',
        answer: 'karnataka',
        aliases: [],
      },
      {
        points: '22,48 58,18 100,6 138,22 132,72 102,92 57,105 12,84',
        hint: 'Northern mountain state. Shimla is the capital. Famous for apples and snow!',
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
        <svg viewBox="0 0 200 200" class="state-svg" aria-hidden="true">
          <polygon points="${esc(question.points)}" />
        </svg>
      </div>
      <div class="q-hint">${esc(question.hint)}</div>`;
  } else {
    questionHTML = `
      <div class="q-visual">${question.visual}</div>
      <div class="q-clue">${esc(question.clue)}</div>`;
  }

  app.innerHTML = `
    <div class="game-screen">
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

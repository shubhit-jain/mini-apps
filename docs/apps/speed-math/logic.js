// ─────────────────────────────────────────────
// Question Bank  –  tables 11–20 × 1–10
// ─────────────────────────────────────────────
const QUESTIONS = (() => {
  const q = [];
  for (let a = 11; a <= 20; a++) {
    for (let b = 1; b <= 10; b++) {
      q.push({ a, b, answer: a * b });
    }
  }
  return q; // 100 questions
})();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function generateOptions({ a, b, answer }) {
  const pool = new Set();
  for (let db = -3; db <= 3; db++) {
    if (db === 0) continue;
    const nb = b + db;
    if (nb >= 1 && nb <= 10) pool.add(a * nb);
  }
  [-10, 10, -5, 5, -11, 11, -1, 1].forEach(d => {
    const v = answer + d;
    if (v > 0) pool.add(v);
  });
  pool.delete(answer);
  const candidates = shuffle([...pool].filter(v => v > 0));
  const wrong = candidates.slice(0, 3);
  for (let i = 1; wrong.length < 3; i++) {
    const v = answer + i * 7;
    if (!wrong.includes(v) && v !== answer) wrong.push(v);
  }
  return shuffle([answer, ...wrong]);
}

// ─────────────────────────────────────────────
// Shared AudioContext
// ─────────────────────────────────────────────
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

// ─────────────────────────────────────────────
// Sound Effects
// ─────────────────────────────────────────────
const SFX = (() => {
  function tone({ freq = 440, type = 'sine', dur = 0.12, vol = 0.28, delay = 0 }) {
    try {
      const c = getAudioCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(vol, c.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + dur + 0.02);
    } catch (_) {}
  }

  return {
    countTick(n) {
      const freqs = { 3: 440, 2: 554, 1: 659 };
      tone({ freq: freqs[n] ?? 440, dur: 0.1, vol: 0.3 });
    },
    go() {
      [523, 659, 784, 1047].forEach((f, i) =>
        tone({ freq: f, dur: 0.15, vol: 0.28, delay: i * 0.075 })
      );
    },
    correct() {
      tone({ freq: 523, dur: 0.1,  vol: 0.3 });
      tone({ freq: 880, dur: 0.22, vol: 0.3, delay: 0.09 });
    },
    wrong() {
      tone({ freq: 220, type: 'sawtooth', dur: 0.12, vol: 0.18 });
      tone({ freq: 150, type: 'sawtooth', dur: 0.18, vol: 0.18, delay: 0.1 });
    },
    urgentTick() {
      tone({ freq: 1047, dur: 0.04, vol: 0.18 });
    },
    timeUp() {
      [784, 659, 523, 392].forEach((f, i) =>
        tone({ freq: f, dur: 0.22, vol: 0.3, delay: i * 0.11 })
      );
    },
    fanfare() {
      [392, 494, 587, 740, 988].forEach((f, i) =>
        tone({ freq: f, dur: 0.22, vol: 0.25, delay: i * 0.09 })
      );
    },
  };
})();

// ─────────────────────────────────────────────
// Background Music
// Upbeat looping melody (C major pentatonic)
// ─────────────────────────────────────────────
const Music = (() => {
  // [frequency Hz, duration seconds]  (0 Hz = rest)
  const MELODY = [
    [523, 0.25], [659, 0.25], [784, 0.25], [880, 0.25],  // C5 E5 G5 A5
    [784, 0.25], [659, 0.25], [523, 0.4],  [0,   0.25],  // G5 E5 C5 --
    [392, 0.25], [523, 0.25], [659, 0.25], [784, 0.25],  // G4 C5 E5 G5
    [659, 0.25], [523, 0.25], [392, 0.5],  [0,   0.3],   // E5 C5 G4 --
    [523, 0.2],  [659, 0.2],  [784, 0.2],  [880, 0.2],   // faster run up
    [1047,0.4],  [880, 0.2],  [784, 0.4],                // C6 A5 G5
    [659, 0.2],  [784, 0.2],  [659, 0.2],  [523, 0.6],   // resolve
    [0,   0.3],                                           // breathe
  ];

  const BASS = [
    [130, 0.5], [130, 0.5], [147, 0.5], [130, 0.5],  // C3 C3 D3 C3
    [110, 0.5], [98,  0.5], [110, 0.5], [130, 0.5],  // A2 G2 A2 C3
    [130, 0.5], [130, 0.5], [147, 0.5], [130, 0.5],  // repeat
    [110, 0.5], [98,  0.5], [110, 1.0],               // resolve longer
  ];

  const MELODY_DUR = MELODY.reduce((s, [, d]) => s + d, 0);
  const BASS_DUR   = BASS.reduce((s, [, d]) => s + d, 0);
  // Both intentionally equal — verify: MELODY_DUR ≈ BASS_DUR ≈ 8.0s

  let playing = false;
  let masterGain = null;
  let loopTimer = null;

  function scheduleTrack(notes, type, vol, startTime) {
    const c = getAudioCtx();
    let t = startTime;
    for (const [freq, dur] of notes) {
      if (freq > 0) {
        const osc = c.createOscillator();
        const g   = c.createGain();
        osc.connect(g);
        g.connect(masterGain);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.82);
        osc.start(t);
        osc.stop(t + dur + 0.01);
      }
      t += dur;
    }
  }

  function loop() {
    if (!playing) return;
    const c = getAudioCtx();
    const now = c.currentTime;
    scheduleTrack(MELODY, 'sine',     0.18, now);
    scheduleTrack(BASS,   'triangle', 0.1,  now);
    // Schedule next loop slightly before this one ends
    loopTimer = setTimeout(loop, (MELODY_DUR - 0.15) * 1000);
  }

  return {
    start() {
      if (playing) return;
      playing = true;
      const c = getAudioCtx();
      masterGain = c.createGain();
      masterGain.gain.value = 1.0;
      masterGain.connect(c.destination);
      loop();
    },
    stop() {
      if (!playing) return;
      playing = false;
      clearTimeout(loopTimer);
      if (masterGain) {
        try {
          const c = getAudioCtx();
          masterGain.gain.setValueAtTime(masterGain.gain.value, c.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
          setTimeout(() => { try { masterGain.disconnect(); } catch (_) {} masterGain = null; }, 500);
        } catch (_) {}
      }
    },
    toggle() {
      if (playing) { this.stop(); return false; }
      this.start(); return true;
    },
    isPlaying() { return playing; },
  };
})();

// ─────────────────────────────────────────────
// Alpine.js Component
// ─────────────────────────────────────────────
function gameApp() {
  return {
    screen: 'name-entry',

    nameInput: '',
    playerName: '',
    countdownValue: 3,

    score: 0,
    timeLeft: 60,
    timerInterval: null,
    questionPool: [],
    qIndex: 0,
    currentQ: null,
    options: [],
    selectedOption: null,
    answerState: null,
    locked: false,

    leaderboard: [],
    sessionEnded: false,
    musicOn: true,

    init() {
      try {
        const saved = localStorage.getItem('speedmath_lb');
        if (saved) this.leaderboard = JSON.parse(saved);
      } catch (_) {}
    },

    // ── name entry ───────────────────────────
    capitalizeName() {
      if (this.nameInput.length > 0)
        this.nameInput = this.nameInput.charAt(0).toUpperCase() + this.nameInput.slice(1);
    },

    startGame() {
      const name = this.nameInput.trim();
      if (!name) return;
      this.playerName = name.charAt(0).toUpperCase() + name.slice(1);
      this.nameInput = '';
      Music.start();
      this.musicOn = true;
      this.screen = 'countdown';
      this.$nextTick(() => this.runCountdown());
    },

    // ── countdown ────────────────────────────
    async runCountdown() {
      for (const val of [3, 2, 1, 0]) {
        if (this.screen !== 'countdown') return;
        this.countdownValue = val;
        const el = this.$refs.countEl;
        if (el) {
          el.classList.remove('anim-count', 'anim-go');
          void el.offsetWidth;
          el.classList.add(val === 0 ? 'anim-go' : 'anim-count');
        }
        if (val === 0) SFX.go(); else SFX.countTick(val);
        await sleep(val === 0 ? 850 : 920);
      }
      if (this.screen === 'countdown') this.beginPlaying();
    },

    get countdownDisplay() {
      return this.countdownValue === 0 ? 'GO!' : String(this.countdownValue);
    },

    // ── playing ──────────────────────────────
    beginPlaying() {
      this.score = 0;
      this.timeLeft = 60;
      this.questionPool = shuffle([...QUESTIONS]);
      this.qIndex = 0;
      this.screen = 'playing';
      this.nextQuestion();
      this.startTimer();
    },

    startTimer() {
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 10 && this.timeLeft > 0) SFX.urgentTick();
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          clearInterval(this.timerInterval);
          this.endRound();
        }
      }, 1000);
    },

    nextQuestion() {
      if (this.qIndex >= this.questionPool.length) {
        this.questionPool = shuffle([...QUESTIONS]);
        this.qIndex = 0;
      }
      const q = this.questionPool[this.qIndex++];
      this.currentQ = q;
      this.options = generateOptions(q);
      this.selectedOption = null;
      this.answerState = null;
      this.locked = false;
    },

    selectOption(opt) {
      if (this.locked) return;
      this.locked = true;
      this.selectedOption = opt;
      if (opt === this.currentQ.answer) {
        this.answerState = 'correct';
        this.score++;
        SFX.correct();
      } else {
        this.answerState = 'wrong';
        SFX.wrong();
      }
      setTimeout(() => this.nextQuestion(), 700);
    },

    optionClass(opt) {
      if (!this.answerState) return '';
      if (opt === this.currentQ.answer)
        return opt === this.selectedOption ? 'is-correct' : 'is-correct-reveal';
      if (opt === this.selectedOption) return 'is-wrong';
      return 'is-dim';
    },

    get timerPercent() { return (this.timeLeft / 60) * 100; },

    get timerColor() {
      if (this.timeLeft > 30) return '#4ade80';
      if (this.timeLeft > 10) return '#fbbf24';
      return '#f87171';
    },

    get timerUrgent() { return this.timeLeft <= 10; },

    // ── end of round ─────────────────────────
    endRound() {
      clearInterval(this.timerInterval);
      this.locked = true;
      SFX.timeUp();
      this.leaderboard.push({ name: this.playerName, score: this.score });
      this.leaderboard.sort((a, b) => b.score - a.score);
      try { localStorage.setItem('speedmath_lb', JSON.stringify(this.leaderboard)); } catch (_) {}
      this.screen = 'score-reveal';
      setTimeout(() => SFX.fanfare(), 600);
    },

    // ── music ─────────────────────────────────
    toggleMusic() {
      this.musicOn = Music.toggle();
    },

    // ── session ──────────────────────────────
    viewLeaderboard() {
      this.sessionEnded = false;
      this.screen = 'leaderboard';
    },

    addPlayer() {
      this.sessionEnded = false;
      this.screen = 'name-entry';
    },

    endSession() {
      this.sessionEnded = true;
      this.screen = 'leaderboard';
    },

    newGame() {
      clearInterval(this.timerInterval);
      Music.stop();
      this.leaderboard = [];
      try { localStorage.removeItem('speedmath_lb'); } catch (_) {}
      this.sessionEnded = false;
      this.musicOn = false;
      this.playerName = '';
      this.screen = 'name-entry';
    },

    get sortedBoard() {
      return [...this.leaderboard].sort((a, b) => b.score - a.score);
    },

    rankIcon(i) {
      return ['🥇', '🥈', '🥉'][i] ?? `${i + 1}.`;
    },
  };
}

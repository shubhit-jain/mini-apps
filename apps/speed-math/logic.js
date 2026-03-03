// ─────────────────────────────────────────────
// Question Bank  –  tables 11–20 × 1–10
// Fully expanded so every product is explicit.
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

/**
 * Build 3 plausible distractors for a question.
 *  1. Adjacent products in the same table (±1..±3 on b, capped at 1–10)
 *  2. Nearby trap values (±5, ±10, ±11)
 */
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
// Sound Manager  (Web Audio API, no files needed)
// ─────────────────────────────────────────────
const SFX = (() => {
  let ctx = null;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone({ freq = 440, type = 'sine', dur = 0.12, vol = 0.28, delay = 0, ramp = true }) {
    try {
      const c = ac();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(vol, c.currentTime + delay);
      if (ramp) gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + dur + 0.02);
    } catch (_) {}
  }

  return {
    // Countdown ticks — each number has a rising pitch
    countTick(n) {
      const freqs = { 3: 440, 2: 554, 1: 659 };
      tone({ freq: freqs[n] ?? 440, dur: 0.1, vol: 0.3 });
    },

    // "GO!" — bright ascending arpeggio
    go() {
      [523, 659, 784, 1047].forEach((f, i) =>
        tone({ freq: f, dur: 0.15, vol: 0.28, delay: i * 0.075 })
      );
    },

    // Correct — two rising chime notes
    correct() {
      tone({ freq: 523, dur: 0.1,  vol: 0.3 });
      tone({ freq: 880, dur: 0.22, vol: 0.3, delay: 0.09 });
    },

    // Wrong — short descending buzz
    wrong() {
      tone({ freq: 220, type: 'sawtooth', dur: 0.12, vol: 0.18 });
      tone({ freq: 150, type: 'sawtooth', dur: 0.18, vol: 0.18, delay: 0.1 });
    },

    // Last-10-seconds tick — sharp click
    urgentTick() {
      tone({ freq: 1047, dur: 0.04, vol: 0.18 });
    },

    // Time's up — descending 4-note drop
    timeUp() {
      [784, 659, 523, 392].forEach((f, i) =>
        tone({ freq: f, dur: 0.22, vol: 0.3, delay: i * 0.11 })
      );
    },

    // Score reveal fanfare — quick ascending sweep
    fanfare() {
      [392, 494, 587, 740, 988].forEach((f, i) =>
        tone({ freq: f, dur: 0.22, vol: 0.25, delay: i * 0.09 })
      );
    },
  };
})();

// ─────────────────────────────────────────────
// Alpine.js Component
// ─────────────────────────────────────────────
function gameApp() {
  return {
    screen: 'name-entry', // name-entry | countdown | playing | score-reveal | leaderboard

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
    answerState: null,   // null | 'correct' | 'wrong'
    locked: false,

    leaderboard: [],
    sessionEnded: false,

    // ── init ─────────────────────────────────
    init() {
      try {
        const saved = localStorage.getItem('speedmath_lb');
        if (saved) this.leaderboard = JSON.parse(saved);
      } catch (_) {}
    },

    // ── name entry ───────────────────────────
    startGame() {
      const name = this.nameInput.trim();
      if (!name) return;
      this.playerName = name;
      this.nameInput = '';
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
      this.leaderboard = [];
      try { localStorage.removeItem('speedmath_lb'); } catch (_) {}
      this.sessionEnded = false;
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

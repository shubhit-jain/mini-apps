/* ==========================
   STATIC DATA: levels & words
   Edit these lists directly as you need.
   Keep keys as identifiers (shown as levels in UI).
   ========================== */
const data = {
  "level-1": {
    "label": "Level 1 — Sound Basics (2-letter, no matra)",
    "focus": "Simple consonant-vowel syllables. Build sound decoding and reading fluency.",
    "words": [
      "घर", "जल", "मन", "धन", "वन", "फल", "तन", "घट", "पत", "डब",
      "कस", "नक", "थल", "रथ", "चल", "मत", "डग", "घन", "मक", "लक",
      "पथ", "मल", "संग", "डग", "गग", "धक", "बस", "रस", "गज", "मट",
      "कथ", "सख", "घन", "धन", "जन", "मल", "पन", "टब", "लस", "मग",
      "रम", "कथ", "दन", "बल", "सल", "पल", "कल", "थन", "घन", "फन"
    ]
  },
  "level-2": {
    "label": "Level 2 — Simple Matras",
    "focus": "2-letter or short words using one simple matra. Reinforce sound and pronunciation.",
    "words": [
      "जा", "खा", "पा", "ना", "ला", "मा", "ता", "भा", "सा", "रा",
      "दी", "नी", "मी", "पी", "ती", "ही", "री", "की", "सी", "जी",
      "लू", "कू", "सू", "भू", "रू", "धू", "चू", "जू", "पू", "टू",
      "खा", "जा", "पा", "धा", "ता", "ला", "गा", "मा", "ना", "भा",
      "दी", "मी", "नी", "पी", "सी", "टी", "ही", "री", "की", "जी"
    ]
  },
  "level-3": {
    "label": "Level 3 — Mixed Matras",
    "focus": "Words with complex matras or nasal sounds. Two or more consonants per word.",
    "words": [
      "मेह", "सेब", "तेल", "गेहूं", "मोती", "घोड़ा", "धोबी", "बैल", "कैम", "मैना",
      "रोज़", "दोस्त", "होंठ", "चौक", "नौक", "गौर", "शेर", "ढोल", "खेत", "भौं",
      "हैं", "नैं", "तैं", "रैं", "घैं", "जौं", "लौक", "कौन", "कब", "जब",
      "कहा", "यहाँ", "वहाँ", "अब", "तब", "सब", "हम", "तुम", "उन", "उनका",
      "पेड़", "खेल", "सेन", "मेल", "टेंट", "रेल", "गेंद", "हेल", "फेंक", "लेख"
    ]
  },
  "level-4": {
    "label": "Level 4 — Everyday 3–4 Letter Words",
    "focus": "Common daily-use nouns and verbs for early comprehension.",
    "words": [
      "पानी", "खाना", "लाना", "जाना", "मामा", "दादा", "चाचा", "नानी", "माता", "भाई",
      "पापा", "रोटी", "दूध", "काला", "माला", "गाना", "बैठा", "खेला", "सोया", "लिखा",
      "पढ़ा", "देखा", "सुना", "कहा", "आया", "गया", "रहा", "करे", "देना", "लेना",
      "रखो", "चलो", "बैठो", "सोना", "खेलो", "पीना", "गिरा", "तैरना", "नाचना", "सोचना",
      "कूदना", "बोलना", "सुनना", "पकड़ा", "लाया", "धोना", "बांधा", "खोला", "भेजा", "छोड़ा"
    ]
  },
  "level-5": {
    "label": "Level 5 — Extended Vocabulary",
    "focus": "Common adjectives, verbs, and abstract nouns used in school or life.",
    "words": [
      "सफाई", "खुशी", "भोजन", "मित्र", "विद्यालय", "शिक्षक", "परिवार", "समय", "स्वास्थ्य", "प्रेम",
      "आनंद", "विश्वास", "ईमानदारी", "सच्चाई", "भविष्य", "संदेश", "उत्तर", "प्रश्न", "यात्रा", "सपना",
      "कहानी", "दुनिया", "सफलता", "अध्ययन", "परिश्रम", "संवाद", "उपयोग", "आवश्यक", "प्रकृति", "पर्यावरण",
      "अध्यापक", "सहायता", "मित्रता", "शिक्षा", "रंगीन", "संपर्क", "खुशहाल", "प्रयास", "सफर", "राष्ट्र",
      "अनुभव", "उत्सव", "संगीत", "सुविधा", "सुरक्षा", "सेवा", "अधिकार", "विकास", "न्याय", "नीति"
    ]
  },
  "level-6": {
    "label": "Level 6 — Grammar & Function Words",
    "focus": "Sight words and connectors for sentence construction and fluency.",
    "words": [
      "और", "भी", "या", "पर", "तो", "से", "को", "में", "का", "की",
      "के", "यह", "वह", "जो", "क्यों", "कब", "कहाँ", "कौन", "कैसे", "क्या",
      "जब", "तब", "अगर", "लेकिन", "फिर", "क्योंकि", "इसलिए", "जैसे", "वैसे", "तभी",
      "जहाँ", "तहाँ", "कोई", "कुछ", "सब", "हर", "अभी", "यहीं", "वहीं", "यहाँ",
      "वहाँ", "सभी", "हमेशा", "कभी", "अब", "फिरसे", "इधर", "उधर", "भीतर", "बाहर"
    ]
  },
  "level-7": {
    "label": "Level 7 — Phrases & Fluency Practice",
    "focus": "Common spoken phrases, idioms, and reading fluency for contextual use.",
    "words": [
      "सुबह जल्दी", "शुभ रात्रि", "धन्यवाद", "शुभकामनाएँ", "कैसे हो", "सब ठीक", "मुझे अच्छा", "बहुत अच्छा",
      "आपका स्वागत", "कैसा लगा", "मुझे पसंद", "कृपया करें", "ध्यान दें", "फिर मिलेंगे", "जल्दी आओ", "सही समय",
      "कोई बात नहीं", "शुभ प्रभात", "सुप्रभात", "शुभ संध्या", "काम पूरा", "अपना ध्यान रखें", "किताब खोलो",
      "दरवाज़ा बंद", "लाइट जलाओ", "बैठ जाओ", "खेल शुरू", "समय समाप्त", "ध्यान लगाओ", "सुनो ध्यान से",
      "देखो ज़रा", "पढ़ो सब", "चलो घर", "जल्दी करो", "शुभ दिन", "आप कैसे हैं", "खुश रहो", "मिलते रहो",
      "फिर आना", "याद रखना", "कोई परेशानी नहीं", "सब बढ़िया", "मुझे बताओ", "अब जाओ", "शांत रहो", "आराम करो",
      "आओ बैठो", "खुश रहिए", "आभार प्रकट", "शुभ यात्रा", "अच्छा काम", "ध्यान रखना"
    ]
  },
  "level-8": {
    "label": "Level 8 — Complex Sight Words",
    "focus": "Fluent-level reading with conjunct consonants and longer, real-life vocabulary.",
    "words": [
      "प्रसन्न", "संपर्क", "संस्कृति", "संपादन", "प्रयोजन", "विकासशील", "संगठन", "निर्णय", "प्रबंधन", "संविधान",
      "आवश्यकता", "परिस्थिति", "संवेदना", "अधिकारिता", "विपरीत", "प्रतिभा", "प्रतियोगिता", "विज्ञान", "अध्यक्ष", "संपूर्ण",
      "प्रशासन", "संघर्ष", "अभ्यास", "अभियान", "संग्रहालय", "पर्यावरणीय", "निर्माण", "निर्देशन", "संवेदनशील", "विचारशील",
      "संस्मरण", "प्रभावशाली", "सहयोगी", "अंतरिक्ष", "उत्पादन", "संभावना", "नियंत्रण", "संयोजन", "संगठनात्मक", "प्रोत्साहन",
      "संचालन", "व्यवस्था", "संवर्धन", "विजेता", "असफलता", "प्रवर्तन", "संवाददाता", "स्मरणीय", "संबंधित", "व्याख्यान",
      "संपादक", "निर्देशक", "अनुसंधान", "परामर्श", "उपलब्धि", "निष्कर्ष", "प्रसारक", "संप्रेषण", "संग्रहण", "संस्थापक",
      "व्यवसाय", "प्रबंधन", "सहकर्मी", "संवेदन", "अभिनव", "प्रेरणा", "उपस्थिति", "प्रतिनिधि", "संभवतः", "अनुभवजन्य",
      "सार्थकता", "संघटन", "सम्पूर्ण", "नियुक्ति", "प्रतिपादन", "साहित्यिक", "संवेदनशीलता", "संरक्षण", "प्रकाशन", "अनुशासन",
      "अभिवादन", "विस्तार", "संयम", "संकेत", "प्रतीक्षा", "संघटनात्मक", "विप्रेषण", "संघर्षशील", "संविधानिक", "संसाधन",
      "अभिनेत्री", "संचार", "प्रबंधनात्मक", "समाजशास्त्र", "संवर्धनशील", "संवेदनात्मक", "उत्प्रेरक", "संवेदनामूलक", "अधिकारपत्र"
    ]
  }
};

/* ============
   App state & refs
   ============ */
const overlay = document.getElementById('levelOverlay');
const levelGrid = document.getElementById('levelGrid');
const mainStage = document.getElementById('mainStage');

const card = document.getElementById('card');
const wordElWrapper = document.getElementById('wordEl');
const wordText = document.getElementById('wordText');
const hint = document.getElementById('hint');
const progress = document.getElementById('progress');
const shuffleBtn = document.getElementById('shuffleBtn');
const soundBtn = document.getElementById('soundBtn');
const hintTTS = document.getElementById('hintTTS');
const readTodayCountEl = document.getElementById('readTodayCount');
const backBtn = document.getElementById('backBtn');
const themeSelector = document.getElementById('themeSelector');

/* ============
   Theming
   ============ */
function themeKey() { return 'hindi_flash_theme'; }

function applyTheme(theme) {
    // More robustly remove any existing theme class
    for (const t of document.body.classList) {
        if (t.startsWith('theme-')) {
            document.body.classList.remove(t);
        }
    }

    if (theme && theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
}

themeSelector.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    applyTheme(selectedTheme);
    try {
        localStorage.setItem(themeKey(), selectedTheme);
    } catch (e) {}
});


/* ============
   LocalStorage helpers
   ============ */
function todayKey() {
  const d = new Date();
  return 'hindi_flash_' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function levelKey() { return 'hindi_flash_level'; }

function readTodayGet() { try { return parseInt(localStorage.getItem(todayKey()) || '0', 10); } catch (e) { return 0; } }
function readTodaySet(n) { try { localStorage.setItem(todayKey(), String(n)); } catch (e) { } }

/* ============
   Voice / TTS
   ============ */
const supportsSpeechSynthesis = typeof window.speechSynthesis !== 'undefined';
let availableVoices = [];
let preferHindiVoice = null;
function populateVoices() {
  if (!supportsSpeechSynthesis) return;
  availableVoices = window.speechSynthesis.getVoices() || [];
  preferHindiVoice = availableVoices.find(v => /hi|hin|hi-IN/i.test(v.lang)) || null;
}
populateVoices();
if (supportsSpeechSynthesis) window.speechSynthesis.onvoiceschanged = populateVoices;

function speakAsync(text, timeoutMs = 4500) {
  return new Promise((resolve) => {
    if (!supportsSpeechSynthesis) { resolve({ ok: false, reason: 'no-tts' }); return; }
    try {
      try { window.speechSynthesis.cancel(); } catch (e) { }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = preferHindiVoice ? preferHindiVoice.lang : 'hi-IN';
      if (preferHindiVoice) u.voice = preferHindiVoice;
      u.rate = 0.95; u.pitch = 1.05;
      let finished = false;
      const onEnd = () => { if (finished) return; finished = true; cleanup(); resolve({ ok: true }); };
      const onErr = () => { if (finished) return; finished = true; cleanup(); resolve({ ok: false, reason: 'error' }); };
      function cleanup() { u.onend = u.onerror = null; clearTimeout(tout); }
      u.onend = onEnd; u.onerror = onErr;
      window.speechSynthesis.speak(u);
      const tout = setTimeout(() => { if (finished) return; finished = true; try { window.speechSynthesis.cancel(); } catch (e) { }; cleanup(); resolve({ ok: false, reason: 'timeout' }); }, timeoutMs);
    } catch (e) { resolve({ ok: false, reason: 'exception' }); }
  });
}

/* ============
   Sound ding
   ============ */
let soundOn = true;
soundBtn.addEventListener('click', (e) => { soundOn = !soundOn; soundBtn.textContent = soundOn ? '🔊' : '🔈'; e.stopPropagation(); });
function playDing() {
  if (!soundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const o1 = ctx.createOscillator(), g1 = ctx.createGain();
    o1.type = 'sine'; o1.frequency.value = 880; g1.gain.value = 0.0001;
    o1.connect(g1); g1.connect(ctx.destination);
    g1.gain.setValueAtTime(0.0001, now); g1.gain.exponentialRampToValueAtTime(0.06, now + 0.005); g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    o1.start(now); o1.stop(now + 0.25);
    const o2 = ctx.createOscillator(), g2 = ctx.createGain();
    o2.type = 'square'; o2.frequency.value = 1760; g2.gain.value = 0.0001;
    o2.connect(g2); g2.connect(ctx.destination);
    g2.gain.setValueAtTime(0.0001, now); g2.gain.exponentialRampToValueAtTime(0.03, now + 0.002); g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o2.start(now); o2.stop(now + 0.13);
    setTimeout(() => { try { ctx.close(); } catch (e) { } }, 700);
  } catch (e) { }
}

/* ============
   Level selection UI (static keys derived from data)
   ============ */
function showLevelOverlay() {
  levelGrid.innerHTML = '';
  Object.keys(data).forEach(key => {
    const item = data[key];
    const btn = document.createElement('button');
    btn.className = 'level-btn';
    btn.type = 'button';
    btn.innerHTML = `<div>${item.label}</div><small>${item.words.length} words</small>`;
    btn.addEventListener('click', () => {
      selectLevel(key);
    });
    levelGrid.appendChild(btn);
  });
  overlay.style.display = 'flex';
  mainStage.setAttribute('aria-hidden', 'true');
}
function hideLevelOverlay() {
  overlay.style.display = 'none';
  mainStage.setAttribute('aria-hidden', 'false');
}

/* ============
   App navigation: back/forward stacks (max 5)
   ============ */
const HISTORY_MAX = 5;
let currentLevelKey = null;
let levelWords = []; // words of selected level
let backStack = [];   // stack of indices previously seen (older at 0, newest at end). top = end()
let forwardStack = []; // stack of indices that were reached by going back (top = end)
let currentIndex = null; // index in levelWords that is currently visible
let isSpeakingOrAdvancing = false;

/* Utility: show word by index with animation & optionally update progress */
function showWordIndex(idx, { animate = true } = {}) {
  const text = (typeof idx === 'number' && idx >= 0 && idx < levelWords.length) ? levelWords[idx] : '';
  if (!text) return;
  if (animate) {
    wordElWrapper.classList.add('out');
    setTimeout(() => {
      wordText.textContent = text;
      wordElWrapper.classList.remove('out');
      wordElWrapper.classList.add('in');
      void wordElWrapper.offsetWidth;
      setTimeout(() => wordElWrapper.classList.add('show'), 10);
      setTimeout(() => wordElWrapper.classList.remove('in', 'show'), 360);
    }, 120);
  } else {
    wordText.textContent = text;
  }
  // update progress (history length shows how many unique forward advances we have)
  progress.textContent = `${(currentIndex !== null ? currentIndex + 1 : 0)} / ${levelWords.length}`;
}

/* Advance flow when the user requests "next" (click / space / right):
   1) If there's no current card -> generate a new sequential (no TTS).
   2) Otherwise: forced speak current word, then:
      - If forwardStack not empty -> pop from forwardStack and show it (preserve order). This is NOT counted as new read.
      - Else -> generate a new sequential index, show it, increment read-today.
   Maintain stacks: when moving forward to a new sequential, push previous current to backStack (trim to 5) and clear forwardStack.
   When moving forward using forwardStack, push previous current to backStack (trim to 5).
*/
async function userRequestedNext() {
  if (isSpeakingOrAdvancing) return;
  // if no current card, just advance to next (no TTS)
  if (currentIndex === null) {
    advanceToNext();
    return;
  }

  isSpeakingOrAdvancing = true;
  try {
    // forced speak current
    await speakAsync(levelWords[currentIndex], 4500).catch(() => { });
  } finally {
    // proceed to next (either forwardStack or new sequential)
    if (forwardStack.length > 0) {
      // go forward from forwardStack
      const nextIdx = forwardStack.pop();
      // push current to backStack
      if (currentIndex !== null) {
        backStack.push(currentIndex);
        if (backStack.length > HISTORY_MAX) backStack.shift();
      }
      currentIndex = nextIdx;
      showWordIndex(currentIndex, { animate: true });
      // pronounce the new card after showing
      try { await speakAsync(levelWords[currentIndex], 3500); } catch (e) { }
      playDing();
      // note: not incrementing read-today when moving through forward stack
    } else {
      // no forward history — generate a new sequential card
      advanceToNext();
    }
    isSpeakingOrAdvancing = false;
  }
}

/* advanceToNext: advance to the next sequential index, push previous current to backStack, clear forwardStack,
   update read-today (increment), show & play ding.
*/
function advanceToNext() {
  if (levelWords.length === 0) return;
  const prev = currentIndex;
  const next = (prev === null) ? 0 : (prev + 1) % levelWords.length;

  // push prev into backStack (if exists)
  if (prev !== null) {
    backStack.push(prev);
    if (backStack.length > HISTORY_MAX) backStack.shift();
  }
  // clear forwardStack (new branch)
  forwardStack = [];
  currentIndex = next;
  showWordIndex(currentIndex, { animate: true });
  // increment read-today
  const nowCount = readTodayGet() + 1;
  readTodaySet(nowCount);
  readTodayCountEl.textContent = nowCount;
  // play ding
  setTimeout(() => playDing(), 220);
}

/* User requested "back" (Left Arrow) behavior:
   - If backStack empty -> nothing.
   - Else: move current to forwardStack (if exists), pop previous from backStack to current, show it, pronounce it.
   - Do not increment read-today when going back.
*/
async function userRequestedBack() {
  if (isSpeakingOrAdvancing) return;
  if (backStack.length === 0) return; // nothing to go back to
  isSpeakingOrAdvancing = true;
  try {
    const prevIdx = backStack.pop(); // the one to show
    // push current into forwardStack (if exists)
    if (currentIndex !== null) {
      forwardStack.push(currentIndex);
      if (forwardStack.length > HISTORY_MAX) forwardStack.shift();
    }
    currentIndex = prevIdx;
    showWordIndex(currentIndex, { animate: true });
    // pronounce the shown card
    try { await speakAsync(levelWords[currentIndex], 4500); } catch (e) { }
    playDing();
  } finally {
    isSpeakingOrAdvancing = false;
  }
}

/* hint button: pronounce current card on demand (no navigation) */
if (!supportsSpeechSynthesis) {
  hintTTS.title = 'Pronunciation unavailable';
  hintTTS.disabled = true;
  hintTTS.style.opacity = 0.6;
  hintTTS.textContent = '❌';
} else {
  hintTTS.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIndex === null) return;
    // speak current
    speakAsync(levelWords[currentIndex], 3500).catch(() => { });
  });
}

/* Restart: clear stacks and create fresh sequential state for level */
shuffleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  // clear stacks and current, then advance to the first card (no forced TTS)
  backStack = [];
  forwardStack = [];
  currentIndex = null;
  // show blank and then new
  wordText.textContent = '';
  setTimeout(() => advanceToNext(), 120);
});

backBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  showLevelOverlay();
  mainStage.style.display = 'none';
});

/* Keyboard / click wiring */
card.addEventListener('click', () => userRequestedNext());
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowRight') {
    e.preventDefault();
    userRequestedNext();
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault();
    userRequestedBack();
  } else if (e.code === 'KeyR') {
    // restart
    backStack = []; forwardStack = []; currentIndex = null; advanceToNext();
  }
});

/* make card focusable for Enter */
card.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    userRequestedNext();
  }
});
card.setAttribute('tabindex', '0');

/* Read-today init */
readTodayCountEl.textContent = readTodayGet();

/* Date rollover safety — refresh displayed readToday if day changes */
let lastTodayKey = todayKey();
setInterval(() => {
  const k = todayKey();
  if (k !== lastTodayKey) {
    readTodayCountEl.textContent = readTodayGet();
    lastTodayKey = k;
  }
}, 60 * 1000);

/* Level selection - persist chosen level to localStorage */
function selectLevel(key) {
  if (!data[key]) return;
  localStorage.setItem(levelKey(), key);
  currentLevelKey = key;
  levelWords = Array.isArray(data[key].words) ? data[key].words.slice() : [];
  hideLevelOverlay();
  // initialize stacks and show first card
  backStack = []; forwardStack = []; currentIndex = null;
  readTodayCountEl.textContent = readTodayGet();
  // show stage
  mainStage.style.display = 'flex';
  overlay.style.display = 'none';
  setTimeout(() => advanceToNext(), 180);
}

/* Build level selection buttons from static data keys */
function initLevelGrid() {
  levelGrid.innerHTML = '';
  Object.keys(data).forEach(k => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'level-btn';
    btn.innerHTML = `<div>${data[k].label}</div><small>${data[k].words.length} words</small>`;
    btn.addEventListener('click', () => selectLevel(k));
    levelGrid.appendChild(btn);
  });
}

/* On load: show overlay unless a saved level exists */
window.addEventListener('load', () => {
  initLevelGrid();

  // Load saved theme
  const savedTheme = localStorage.getItem(themeKey());
  if (savedTheme) {
    applyTheme(savedTheme);
    themeSelector.value = savedTheme;
  }

  const savedLevel = localStorage.getItem(levelKey());
  if (savedLevel && data[savedLevel]) {
    // auto-select and start
    selectLevel(savedLevel);
  } else {
    // show overlay
    overlay.style.display = 'flex';
    mainStage.style.display = 'none';
  }
});

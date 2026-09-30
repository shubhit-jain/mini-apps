const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('apps/flash-cards-app/index-hindi.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const bank = JSON.parse(script.match(/const data = (\{[\s\S]*?\n\});/)[1]);

function loadApp({ speech = false, savedSound = null } = {}) {
  const elements = new Map();
  const storage = new Map(savedSound ? [['hindi_flash_sound', savedSound]] : []);
  const audio = { spoken: [], cancellations: 0 };
  function element() {
    return {
      style: { display: 'none' }, classList: { add() {}, remove() {} },
      textContent: '', innerHTML: '', hidden: false,
      addEventListener() {}, setAttribute() {}, focus() {},
      appendChild() {}, querySelector() { return null; },
    };
  }
  const context = vm.createContext({
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, element());
        return elements.get(id);
      },
      createElement: element,
    },
    window: {
      addEventListener() {},
      ...(speech ? { speechSynthesis: {
        getVoices() { return []; },
        speak(utterance) { audio.spoken.push(utterance); },
        cancel() { audio.cancellations++; },
      } } : {}),
    },
    SpeechSynthesisUtterance: function(text) { this.text = text; },
    localStorage: { getItem(key) { return storage.get(key) ?? null; }, setItem(key, value) { storage.set(key, value); } },
    setTimeout() {}, setInterval() {}, clearTimeout() {},
  });
  vm.runInContext(script, context);
  return { run: code => vm.runInContext(code, context), elements, storage, audio };
}

test('550 distinct Hindi words with the requested per-level counts', () => {
  assert.deepEqual(Object.values(bank).map(level => level.words.length), [50, 100, 200, 200]);
  const all = Object.values(bank).flatMap(level => level.words);
  assert.equal(new Set(all).size, 550);
  for (const word of all) assert.match(word, /^[\u0900-\u097f]+$/);
  for (const level of Object.values(bank)) {
    for (const example of level.examples) assert.ok(level.words.includes(example));
  }
});

test('word spellings follow the level boundaries', () => {
  for (const word of bank['level-1'].words) assert.match(word, /^[अ-ह]{2,3}$/);
  for (const word of bank['level-2'].words) assert.match(word, /^[अआक-हािी]+$/);
  for (const sign of ['ा', 'ि', 'ी']) assert.ok(bank['level-2'].words.some(word => word.includes(sign)));
  for (const word of bank['level-3'].words) {
    assert.doesNotMatch(word, /[\u0900-\u0903\u093c\u094d]/);
    assert.ok((word.match(/[\u0904-\u0939]/g) || []).length >= 2, word);
  }
  for (const word of bank['level-4'].words) {
    assert.ok(/[\u0900-\u0903\u093c\u094d]/.test(word) || (word.match(/[\u0904-\u0939]/g) || []).length >= 4, word);
  }
});

test('a full practice cycle shows each word once and avoids a repeat across cycles', () => {
  for (const [key, level] of Object.entries(bank)) {
    const app = loadApp();
    app.run(`selectLevel('${key}');`);
    const drawn = [app.run('currentIndex')];
    for (let i = 1; i < level.words.length; i++) {
      app.run('advanceToNewRandom();');
      drawn.push(app.run('currentIndex'));
    }
    assert.equal(new Set(drawn).size, level.words.length);
    const last = drawn.at(-1);
    app.run('advanceToNewRandom();');
    assert.notEqual(app.run('currentIndex'), last);
  }
});

test('explored count survives back review and resets when choosing a level', () => {
  const app = loadApp();
  app.run("selectLevel('level-3');");
  for (let i = 0; i < 8; i++) app.run('advanceToNewRandom();');
  assert.equal(app.elements.get('progress').textContent, '9 / 200 explored');
  app.run('showWordIndex(backStack[0], { animate: false });');
  assert.equal(app.elements.get('progress').textContent, '9 / 200 explored');
  app.run("selectLevel('level-1');");
  assert.equal(app.elements.get('progress').textContent, '1 / 50 explored');
});

test('opening the level picker blocks accidental word advances', () => {
  const app = loadApp();
  app.run("selectLevel('level-2'); showLevelOverlay();");
  const index = app.run('currentIndex');
  app.run('advanceToNewRandom();');
  assert.equal(app.run('currentIndex'), index);
  assert.equal(app.elements.get('mainStage').inert, true);
  app.run('hideLevelOverlay();');
  assert.equal(app.elements.get('mainStage').inert, false);
});

test('the deployed HTML matches the source', () => {
  assert.equal(fs.readFileSync('docs/apps/flash-cards-app/index-hindi.html', 'utf8'), html);
});

test('mute cancels current pronunciation, blocks new speech, and persists', async () => {
  const app = loadApp({ speech: true });
  const speaking = app.run("speakAsync('घर');");
  assert.equal(app.audio.spoken.length, 1);
  app.run('setSoundEnabled(false);');
  await speaking;
  await app.run("speakAsync('पानी');");
  assert.equal(app.audio.spoken.length, 1);
  assert.ok(app.audio.cancellations > 0);
  assert.equal(app.elements.get('soundBtn').textContent, '🔇');
  assert.equal(app.elements.get('hintTTS').disabled, true);
  assert.equal(app.storage.get('hindi_flash_sound'), 'off');
  app.run('setSoundEnabled(true);');
  const resumed = app.run("speakAsync('पानी');");
  assert.equal(app.audio.spoken.length, 2);
  app.audio.spoken.at(-1).onend();
  await resumed;
  assert.equal(app.elements.get('hintTTS').disabled, false);
  const saved = loadApp({ speech: true, savedSound: 'off' });
  await saved.run("speakAsync('घर');");
  assert.equal(saved.audio.spoken.length, 0);
});

test('daily cards and unique session words measure different things', () => {
  const app = loadApp();
  app.run("selectLevel('level-1');");
  for (let i = 1; i < 51; i++) app.run('advanceToNewRandom();');
  assert.equal(app.run('readTodayGet()'), 51);
  assert.equal(app.elements.get('progress').textContent, '50 / 50 explored');
  app.run('showWordIndex(backStack[0], { animate: false });');
  assert.equal(app.run('readTodayGet()'), 51);
});

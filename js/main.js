import { G, initRenderer, initInput, startLoop, input, lockPointer, unlockPointer, player, resize, clearLevel, playerLookAt, applyPlayerCam } from './engine.js';
import { Audio, stopSpeech } from './audio.js';
import { $, hud, setFade, letterbox, hideDialogue, objective } from './ui.js';
import { SAVE, loadSave, writeSave, newGame, runChapter, CHAPTER_LIST, NOTES, hooks } from './story.js';
import { faceFromImage, FACE_W, FACE_H, EYE_L, EYE_R, MOUTH, paintFace, LOOKS } from './characters.js';
import { T } from './textures.js';

// ---------------------------------------------------------------------------
// Settings (persisted per browser)
// ---------------------------------------------------------------------------
const SKEY = 'moonkai_settings_v1';
function loadSettings() {
  try { Object.assign(G.settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch (e) { }
}
function saveSettings() { try { localStorage.setItem(SKEY, JSON.stringify(G.settings)); } catch (e) { } }

// ---------------------------------------------------------------------------
// Menus
// ---------------------------------------------------------------------------
const menus = ['menu-title', 'menu-pause', 'menu-chapters', 'menu-journal', 'menu-settings', 'menu-credits', 'menu-death', 'menu-ending'];
let menuStack = [];
function show(id) {
  menus.forEach(m => $(m).classList.add('hidden'));
  if (id) $(id).classList.remove('hidden');
}
function openMenu(id) { menuStack.push(id); show(id); }
function back() { menuStack.pop(); const top = menuStack[menuStack.length - 1]; show(top || null); if (!top) resumeGame(); }

function toTitle() {
  G.runToken++; G.tasks = []; G.mode = 'title'; G.paused = true;
  stopSpeech(); Audio.stopAmbient(); hideDialogue(); letterbox(false); objective('');
  ['choices', 'phone', 'card', 'scare', 'click-resume', 'score', 'charge', 'boss', 'hp', 'hold-ball'].forEach(e => $(e).classList.add('hidden'));
  $('hurt').style.opacity = 0;
  hud(false); unlockPointer();
  menuStack = ['menu-title']; show('menu-title');
  refreshTitle();
  // a quiet menu backdrop
  clearLevel(); setFade(0);
}
function refreshTitle() {
  $('btn-continue').disabled = !SAVE.chapter;
  const e = SAVE.endings;
  $('endings-seen').textContent = e.length ? `Endings found: ${['bad', 'good', 'true'].map(k => e.includes(k) ? { bad: 'Hungry', good: 'Dawn', true: 'The Red Thread' }[k] : '???').join(' · ')}` : '';
}
function startChapter(id) {
  Audio.init(); Audio.resume(); Audio.setVolume(G.settings.volume);
  menuStack = []; show(null);
  lockPointer();
  runChapter(id);
}
function pauseGame() {
  if (G.mode !== 'game' || G.paused) return;
  G.paused = true; stopSpeech(); G.pausedAt = performance.now();
  menuStack = ['menu-pause']; show('menu-pause');
}
function resumeGame() {
  show(null); menuStack = [];
  if (G.mode === 'game') { G.paused = false; lockPointer(); }
}

function buildChapters() {
  const list = $('chapter-list'); list.innerHTML = '';
  CHAPTER_LIST.forEach(([id, name]) => {
    const b = document.createElement('button');
    const ok = SAVE.unlocked.includes(id);
    b.textContent = ok ? name : '— locked —';
    b.disabled = !ok;
    b.onclick = () => startChapter(id);
    list.appendChild(b);
  });
}
function buildJournal() {
  $('journal-threads').textContent = `Red thread pieces: ${SAVE.threads.length}/5`;
  const list = $('journal-list'); list.innerHTML = '';
  const ids = Object.keys(NOTES).filter(k => SAVE.notes.includes(k));
  if (!ids.length) { const p = document.createElement('p'); p.className = 'small'; p.textContent = 'Nothing yet. Look around — examine things, read notes.'; list.appendChild(p); }
  for (const k of ids) {
    const d = document.createElement('div'); d.className = 'note';
    const b = document.createElement('b'); b.textContent = NOTES[k][0];
    d.append(b, document.createTextNode(NOTES[k][1]));
    list.appendChild(d);
  }
}

document.addEventListener('click', e => {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (!act) return;
  Audio.init(); Audio.resume(); Audio.click();
  switch (act) {
    case 'new': newGame(); startChapter('day1'); break;
    case 'continue': if (SAVE.chapter) startChapter(SAVE.chapter); break;
    case 'chapters': buildChapters(); openMenu('menu-chapters'); break;
    case 'settings': syncSettingsUI(); openMenu('menu-settings'); break;
    case 'credits': openMenu('menu-credits'); break;
    case 'journal': buildJournal(); openMenu('menu-journal'); break;
    case 'back': back(); break;
    case 'resume': resumeGame(); break;
    case 'restart': case 'retry': startChapter(G.checkpoint || SAVE.chapter || 'day1'); break;
    case 'quit': toTitle(); break;
  }
});

// pointer lock / pause
document.addEventListener('pointerlockchange', () => {
  const locked = !!document.pointerLockElement;
  if (!locked && G.mode === 'game' && !G.paused && !G.inChoice && !G.inJournal) {
    // browser released the mouse (Esc) → pause
    pauseGame();
  }
  $('click-resume').classList.add('hidden');
});
$('view').addEventListener('click', () => {
  if (G.mode === 'game' && !G.paused && !document.pointerLockElement && !G.inChoice) lockPointer();
});
addEventListener('keydown', e => {
  if (e.code === 'KeyJ' && G.mode === 'game') {
    if (G.inJournal) { G.inJournal = false; back(); }
    else if (!G.paused && !G.inChoice) { G.inJournal = true; G.paused = true; buildJournal(); menuStack = ['menu-journal']; show('menu-journal'); unlockPointer(); }
  }
  if (e.code === 'Escape' && G.mode === 'game' && G.paused && menuStack.length && performance.now() - (G.pausedAt || 0) > 400) {
    if (G.inJournal) { G.inJournal = false; }
    back();
  }
});
// journal "Close" should also clear the flag
$('menu-journal').addEventListener('click', e => { if (e.target.dataset.act === 'back') G.inJournal = false; });

hooks.death = (title, sub) => {
  G.paused = true;
  $('death-title').textContent = title; $('death-sub').textContent = sub;
  unlockPointer(); Audio.stopAmbient();
  menuStack = ['menu-death']; show('menu-death');
};
hooks.ending = (title, sub, stats) => {
  G.paused = true; hud(false); letterbox(false); unlockPointer();
  $('ending-title').textContent = title; $('ending-sub').textContent = sub; $('ending-stats').textContent = stats;
  Audio.setAmbient(title.startsWith('BAD') ? 'night' : 'dawn');
  menuStack = ['menu-ending']; show('menu-ending');
};

// ---------------------------------------------------------------------------
// Settings UI + Eric's face editor (photo never leaves this browser)
// ---------------------------------------------------------------------------
function syncSettingsUI() {
  const s = G.settings;
  $('set-sens').value = s.sens; $('set-vol').value = s.volume; $('set-res').value = s.res;
  $('set-invert').checked = s.invertY; $('set-tts').checked = s.tts; $('set-grain').checked = s.grain;
  $('face-zoom').value = s.faceZoom; $('face-x').value = s.faceX; $('face-y').value = s.faceY;
  drawFacePreview();
}
function applyGrain() { $('grain').style.display = $('scanlines').style.display = G.settings.grain ? '' : 'none'; }
const bind = (id, key, fn = v => parseFloat(v), after) => $(id).addEventListener('input', e => {
  G.settings[key] = e.target.type === 'checkbox' ? e.target.checked : fn(e.target.value);
  saveSettings(); after && after();
});
bind('set-sens', 'sens');
bind('set-vol', 'volume', parseFloat, () => Audio.setVolume(G.settings.volume));
bind('set-res', 'res', v => parseInt(v, 10), resize);
bind('set-invert', 'invertY');
bind('set-tts', 'tts');
bind('set-grain', 'grain', null, applyGrain);
bind('face-zoom', 'faceZoom', parseFloat, drawFacePreview);
bind('face-x', 'faceX', parseFloat, drawFacePreview);
bind('face-y', 'faceY', parseFloat, drawFacePreview);

function drawFacePreview() {
  const c = $('face-preview'), g = c.getContext('2d');
  const face = G.customFaceImg ? faceFromImage(G.customFaceImg, G.settings.faceZoom, G.settings.faceX, G.settings.faceY) : paintFace(LOOKS.eric);
  g.clearRect(0, 0, c.width, c.height); g.drawImage(face, 0, 0, c.width, c.height);
  if (G.customFaceImg) { // alignment guides
    g.strokeStyle = 'rgba(0,255,120,0.9)'; g.lineWidth = 1;
    for (const [x, y] of [EYE_L, EYE_R]) { g.beginPath(); g.arc(x * c.width, y * c.height, 7, 0, 7); g.stroke(); }
    g.beginPath(); g.moveTo((MOUTH[0] - 0.14) * c.width, MOUTH[1] * c.height); g.lineTo((MOUTH[0] + 0.14) * c.width, MOUTH[1] * c.height); g.stroke();
  }
}
function setCustomFace(dataUrl, persist) {
  const img = new Image();
  img.onload = () => { G.customFaceImg = img; drawFacePreview(); };
  img.src = dataUrl;
  if (persist) { // store a small copy so it survives reloads (this browser only)
    const tmp = new Image();
    tmp.onload = () => {
      const c = document.createElement('canvas'); const s = Math.min(1, 640 / Math.max(tmp.width, tmp.height));
      c.width = Math.round(tmp.width * s); c.height = Math.round(tmp.height * s);
      c.getContext('2d').drawImage(tmp, 0, 0, c.width, c.height);
      try { localStorage.setItem('moonkai_face', c.toDataURL('image/jpeg', 0.85)); } catch (e) { }
    };
    tmp.src = dataUrl;
  }
}
$('face-file').addEventListener('change', e => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { G.settings.faceZoom = 1; G.settings.faceX = 0; G.settings.faceY = 0; saveSettings(); syncSettingsUI(); setCustomFace(r.result, true); };
  r.readAsDataURL(f);
});
$('face-clear').addEventListener('click', () => {
  G.customFaceImg = null; try { localStorage.removeItem('moonkai_face'); } catch (e) { }
  $('face-file').value = ''; drawFacePreview();
});

// ---------------------------------------------------------------------------
// Title moon
// ---------------------------------------------------------------------------
function drawTitleMoon() {
  const c = $('title-moon'), g = c.getContext('2d');
  const img = T.moon(true).image;
  g.imageSmoothingEnabled = false;
  g.drawImage(img, 16, 16, 128, 128);
  g.fillStyle = '#000'; g.beginPath(); g.ellipse(58, 70, 12, 10, 0, 0, 7); g.ellipse(102, 70, 12, 10, 0, 0, 7); g.fill();
  g.fillStyle = '#ffe28a'; g.fillRect(56, 68, 4, 4); g.fillRect(100, 68, 4, 4);
  g.fillStyle = '#1a0000'; g.beginPath(); g.moveTo(52, 100); g.quadraticCurveTo(80, 124, 108, 100); g.quadraticCurveTo(80, 110, 52, 100); g.fill();
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
loadSettings(); loadSave();
try { const f = localStorage.getItem('moonkai_face'); if (f) setCustomFace(f, false); } catch (e) { }
function fatal(title, msg) {
  if (document.getElementById('fatal')) return;
  const d = document.createElement('div'); d.id = 'fatal';
  const h = document.createElement('h2'); h.textContent = title;
  const p = document.createElement('p'); p.textContent = msg;
  d.append(h, p); $('stage').appendChild(d);
}
try { initRenderer($('view')); }
catch (e) {
  fatal('3D GRAPHICS UNAVAILABLE', 'This browser could not start WebGL, which the game needs. Try Chrome, Edge or Firefox on a computer, and make sure "Use graphics acceleration / hardware acceleration" is turned on in the browser settings, then reload.');
  throw e;
}
window.addEventListener('error', e => { if (G.mode === 'game') fatal('SOMETHING BROKE', 'The game hit an error: ' + (e.message || e) + '. Reload the page to try again; your progress is saved at the start of each chapter.'); });
initInput($('view'));
applyGrain();
drawTitleMoon();
startLoop();
toTitle();

// Dev/test hook: ?ch=day3 jumps straight to a chapter (after a click for audio)
const qs = new URLSearchParams(location.search);
if (qs.get('ch')) { menuStack = []; show(null); runChapter(qs.get('ch')); }
window.__moonkai = { G, player, runChapter, SAVE, look: (x, y, z) => { playerLookAt(x, y, z); applyPlayerCam(); } };

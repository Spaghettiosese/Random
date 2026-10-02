/* HEARTLINE AGENCY — VN engine, UI, and agency sim systems. */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const Game = (() => {
  const NEXT = 1, WAIT = 2, CONT = 3;
  const WHO = {
    hikari: { n: 'Hikari', c: '#ffcf3f', p: 880 }, rei: { n: 'Rei', c: '#b99bff', p: 480 }, mira: { n: 'Mira', c: '#ff8fb8', p: 700 },
    kaede: { n: 'Kaede', c: '#5ef0a0', p: 760 }, tetsu: { n: 'Tetsu', c: '#e0a060', p: 220 }, sora: { n: 'Sora', c: '#c9b6ff', p: 960 },
    kyouya: { n: 'Kyouya', c: '#7ff6ff', p: 300 }, glazier: { n: 'The Glazier', c: '#7ff6ff', p: 300, art: 'kyouya' },
    rin: { n: 'Rin', c: '#9ff0ff', p: 1040 }, echo: { n: 'Echo', c: '#9ff0ff', p: 1040, art: 'rin' }, shiori: { n: 'Shiori', c: '#f2c14e', p: 560 },
    kuroda: { n: 'Chairman Kuroda', c: '#b8bcc8', p: 170 }, saeki: { n: 'Deputy Saeki', c: '#b58aff', p: 290 }, natsuki: { n: 'Natsuki', c: '#ffb45a', p: 780 },
    aya: { n: 'Director Takamine', c: '#ff5a5a', p: 360 }, bit: { n: 'B.I.T.', c: '#52e0ff', p: 1300 }, me: { n: '', c: '#8fd3ff', p: 250 }
  };
  const POS = { ll: 12, l: 25, c: 50, r: 75, rr: 88 };
  const SLOTS = ['Evening', 'Night'];
  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const WX = () => Sys.WEATHER[(G && G.weather) || 0];
  const ACH = {
    prologue: ['First Spark', 'Complete the Prologue'], perfect: ['Perfect Timing', 'Land a PERFECT strike in training'],
    srank: ['S-Rank Shift', 'Finish a dispatch shift with an S grade'], shopper: ['Big Spender', 'Buy 3 gifts'], gift: ['Thoughtful', 'Give a hero a gift they love'],
    bond: ['Heartline', 'Reach 20 affection with anyone'], rest: ['Self-Care', 'Take a rest'], social: ['Social Butterfly', 'Hang out with everyone you\'ve met'],
    eye: ['Handler\'s Eye', 'Call every Handler\'s Eye moment correctly'], cert: ['Squad Zero', 'Pass Field Certification'],
    cert_s: ['Flawless', 'Pass certification with a top score'], night: ['Night Owl', 'Reply to 3 late-night messages'],
    route_hikari: ['Lightning Heart', 'See Hikari\'s rooftop scene'], route_rei: ['Shadow Heart', 'See Rei\'s rooftop scene'], route_mira: ['Healing Heart', 'See Mira\'s rooftop scene'],
    ch1: ['Squad Zero', 'Clear Chapter 1'], ch2: ['Glass Hearts', 'Clear Chapter 2'], ch3: ['Fractures', 'Clear Chapter 3'], ch4: ['Shattered City', 'Clear Chapter 4'], finale: ['Heartline', 'Finish the story'], goodend: ['Nobody Left Behind', 'Bring Kyouya home'],
    route_sora: ['Gravity Heart', 'See Sora\'s rooftop scene'], fin_squad: ['Found Family', 'See the Squad ending'], veteran: ['Veteran', 'Raise a hero to Lv 5'],
    fight_win: ['Standoff', 'Win your first Standoff'], fight_clean: ['Nobody Down', 'Win a Standoff without losing a hero'], fight_parry: ['Read the Room', 'Land 3 parries in one Standoff'], fight_reads: ['Studied', 'Use 4 different Notebook Reads in Standoffs'], fight_kneel: ['Not On My Knees', 'Stand up a Kneeling hero'], log: ['Rewind', 'Open the backlog'], deploy5: ['Dispatcher', 'Resolve 25 calls'], coach: ['Coach', 'Run 5 training sessions']
  };
  let settings = { textSpeed: 45, autoDelay: 1.4, music: .55, sfx: .7, voice: true, hints: false, motion: true, parallax: true, textSize: 23, boxAlpha: .88, skipUnread: false, wheelBack: true, pixel: true, pixelSmooth: false };
  let meta = { ach: {}, gallery: {}, cleared: false, scenes: {}, codex: {}, endings: {}, chaps: {}, maxChap: 0, met: { hikari: 1 }, stats: { lines: 0, choices: 0, calls: 0, shifts: 0, sranks: 0, dates: 0, gifts: 0, playSec: 0, clears: 0 } };
  let hist = [], readSet = {}, readDirty = 0, lastUnread = false;
  let G = null, R = {}, run = 0;
  let wait = null, typing = false, typeTimer = null, auto = false, skip = false, ctrlSkip = false, hidden = false, autoTimer = null;
  let log = [];

  // ---------- persistence ----------
  const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  function loadPrefs() { settings = Object.assign(settings, LS.get('hl_settings', {})); const m = LS.get('hl_meta', {}); meta = Object.assign(meta, m); meta.stats = Object.assign({ lines: 0, choices: 0, calls: 0, shifts: 0, sranks: 0, dates: 0, gifts: 0, playSec: 0, clears: 0 }, m.stats || {}); readSet = LS.get('hl2_read', {}); applySettings(); }
  const saveMeta = () => LS.set('hl_meta', meta), saveSettings = () => LS.set('hl_settings', settings);
  function applySettings() { window.PIXEL_ON = settings.pixel; if (window.PIXEL_SMOOTH !== undefined && window.PIXEL_SMOOTH !== settings.pixelSmooth && typeof PX !== 'undefined') PX.cache.clear(); window.PIXEL_SMOOTH = settings.pixelSmooth; Sound.setVol('music', settings.music); Sound.setVol('sfx', settings.sfx); Sound.vol.voice = settings.voice; document.body.classList.toggle('nomotion', !settings.motion); const g = document.getElementById('game'); if (g) { g.style.setProperty('--tsize', settings.textSize + 'px'); g.style.setProperty('--boxa', settings.boxAlpha); } }

  const HB = (com, vig, mob, cha, int) => ({ lvl: 1, xp: 0, sp: 0, st: { com, vig, mob, cha, int }, fat: 0, hurt: 0, perks: [], gear: null });
  function newState() {
    return {
      name: 'Haru', flags: {}, aff: { hikari: 0, rei: 0, mira: 0, aya: 0, kaede: 0, tetsu: 0, sora: 0, rin: 0, natsuki: 0, shiori: 0 }, known: { bit: 0 },
      heroes: { hikari: HB(6, 5, 4, 4, 2), rei: HB(5, 3, 6, 1, 6), kaede: HB(3, 3, 8, 4, 3), tetsu: HB(5, 8, 2, 4, 3), sora: HB(4, 4, 3, 8, 4), rin: HB(4, 4, 5, 3, 7), natsuki: HB(3, 7, 6, 6, 3), shiori: HB(7, 6, 5, 5, 4) }, roster: ['hikari', 'rei'],
      day: 1, slot: 0, energy: 100, credits: 300, rep: 10, inv: {}, gifted: {}, seen: {}, ev: {}, texts: {}, chap: 0, chapT: 'Prologue', goal: null,
      calls: 0, trains: 0, bought: 0, replies: 0, eyes: 0, eyesOk: 0, today: {}, weather: 0, score: 0, shifts: [],
      morale: 60, tells: {}, hq: {}, pairs: {}, nem: {}, chains: {}, album: [], gearInv: {}, journal: [], mood: {}, saved: 0, dates: 0, skillsK: {},
      stack: [], vis: { bg: 'black', fx: null, music: null, chars: {}, tint: null }
    };
  }

  // ---------- script registry ----------
  function reg(arr, id) {
    R[id] = arr;
    arr.forEach((c, i) => {
      if (c[0] === 'choice') c[1].forEach((o, j) => o.then && reg(o.then, `${id}.${i}.${j}`));
      if (c[0] === 'eye') c[1].opts.forEach((o, j) => o.then && reg(o.then, `${id}.${i}.${j}`));
      if (c[0] === 'if') { reg(c[2], `${id}.${i}.a`); if (c[3]) reg(c[3], `${id}.${i}.b`); }
    });
  }
  const idOf = arr => Object.keys(R).find(k => R[k] === arr);

  // ---------- runner ----------
  const top = () => G.stack[G.stack.length - 1];
  function step() {
    for (let guard = 0; guard < 5000; guard++) {
      const f = top(); if (!f) { if (G && G.replay) { const my = run; setTimeout(() => { if (my === run) toTitle(); }, 400); } return; }
      const arr = R[f.id]; if (!arr || f.i >= arr.length) { G.stack.pop(); continue; }
      if (f.i === 0 && /^(hang_|date_|eve_|fin_|save_|end_|ev_)/.test(f.id) && !meta.scenes[f.id]) { meta.scenes[f.id] = 1; saveMeta(); }
      const r = exec(arr[f.i], f);
      if (r === WAIT) { prewarm(arr, f.i); return; }
      if (r === NEXT) f.i++;
    }
  }
  // Look a few lines ahead and start painting the pixel frames that will be needed next.
  function prewarm(arr, i) {
    if (!settings.pixel || typeof PixelCast === 'undefined') return;
    for (let j = i + 1; j < Math.min(arr.length, i + 10); j++) {
      const [op, a, b, d, e] = arr[j];
      if (op === 'show' || op === 'emo' || (op === 'say' && G.vis.chars[a] && d)) { const st = G.vis.chars[a] || {}, id = (WHO[a] && WHO[a].art) || a, emo = op === 'say' ? d : b, pose = (op === 'say' ? e : d) || st.pose || 'default'; if (id === 'bit') Art.char('bit', emo, '', false); else PixelCast.prewarm(id, emo, pose, st.of || G.vis.of || 'hero'); }
      else if (op === 'bg') PixelBG.prewarm(a);
      else if (op === 'cg') Art.cg(a);
    }
  }
  function advance() { const f = top(); if (f) f.i++; wait = null; step(); }
  const later = (ms, fn = advance) => { const my = run; setTimeout(() => { if (my === run) fn(); }, skipping() ? Math.min(ms, 80) : ms); };
  function jump(label) { if (!R[label]) console.error('missing label', label); G.stack = [{ id: label, i: 0 }]; }
  function push(arr) { G.stack.push({ id: idOf(arr), i: 0 }); }
  const skipping = () => skip || ctrlSkip;
  const T = s => String(s).replace(/\{name\}/g, G.name).replace(/\{grade\}/g, G.last ? G.last.grade : '').replace(/\{ok\}/g, G.last ? G.last.ok : '');

  function exec(c, f) {
    const [op, a, b, d, e] = c;
    switch (op) {
      case 'bg': setBg(a, b); return NEXT;
      case 'fx': setFx(a); return NEXT;
      case 'music': G.vis.music = a; a ? Sound.play(a) : Sound.stop(); return NEXT;
      case 'sfx': Sound.sfx(a); return NEXT;
      case 'tint': setTint(a); return NEXT;
      case 'show': showChar(a, b, d, e); return NEXT;
      case 'emo': if (G.vis.chars[a]) showChar(a, b, d || G.vis.chars[a].pose); return NEXT;
      case 'outfit': { const st = G.vis.chars[a]; if (st) { st.of = b; showChar(a); } else { G.vis.pre = G.vis.pre || {}; G.vis.pre[a] = b; } } return NEXT;
      case 'wear': G.vis.of = a || null; Object.keys(G.vis.chars).forEach(k => showChar(k)); return NEXT;
      case 'move': if (G.vis.chars[a]) showChar(a, null, null, b); return NEXT;
      case 'hide': hideChar(a); return NEXT;
      case 'hideall': Object.keys(G.vis.chars).forEach(hideChar); return NEXT;
      case 'know': G.known[a] = 1; if (!meta.met[a]) { meta.met[a] = 1; saveMeta(); } if (STORY.codex['c_' + a] && !G.replay) codexUnlock('c_' + a); return NEXT;
      case 'say': mark(); if (b !== undefined && typeof b === 'string' && G.vis.chars[a] && d) showChar(a, d, e || G.vis.chars[a].pose); say(a, b); return WAIT;
      case 'n': mark(); say(null, a); return WAIT;
      case 't': mark(); say('think', a); return WAIT;
      case 'me': mark(); say('me', a); return WAIT;
      case 'choice': choice(a, false); return WAIT;
      case 'eye': choice(a.opts, a); return WAIT;
      case 'jump': jump(a); return CONT;
      case 'call': f.i++; G.stack.push({ id: a, i: 0 }); return CONT;
      case 'if': f.i++; { const br = a(G) ? b : d; if (br) push(br); } return CONT;
      case 'do': a(G, api); return NEXT;
      case 'aff': addAff(a, b); return NEXT;
      case 'set': G.flags[a] = b === undefined ? 1 : b; return NEXT;
      case 'ach': unlock(a); return NEXT;
      case 'shake': shake(a); return NEXT;
      case 'flash': flash(a); return NEXT;
      case 'wait': wait = 'timer'; later(a); return WAIT;
      case 'cg': showCg(a); return NEXT;
      case 'cgoff': $('#cg').classList.remove('on'); return NEXT;
      case 'zoom': zoom(a, b, d, e); return NEXT;
      case 'blur': G.vis.blur = a || 0; $('#stage').style.setProperty('--bgblur', (a || 0) + 'px'); return NEXT;
      case 'filter': setFilter(a); return NEXT;
      case 'light': G.vis.light = a; applyLight(); return NEXT;
      case 'vfx': setVfx(a); return NEXT;
      case 'crack': crack(); return NEXT;
      case 'impact': impact(); return NEXT;
      case 'cutin': wait = 'timer'; cutin(a, b, d); later(1500); return WAIT;
      case 'split': split(a); return NEXT;
      case 'letterbox': $('#letterbox').classList.toggle('on', !!a); return NEXT;
      case 'speed': $('#speed').classList.toggle('on', !!a); return NEXT;
      case 'eyefx': $('#game').classList.toggle('eyemode', !!a); return NEXT;
      case 'title': titleCard(a, b); return WAIT;
      case 'daycard': dayCard(); return WAIT;
      case 'name': nameEntry(); return WAIT;
      case 'phone': phone(a, b, false); return WAIT;
      case 'hub': if (G.slot >= SLOTS.length) { hideHub(); return NEXT; } autosave(); renderHub(); return WAIT;
      case 'shift': startShift(a); return WAIT;
      case 'recruit': if (b === 0) G.roster = G.roster.filter(x => x !== a); else if (!G.roster.includes(a)) G.roster.push(a); return NEXT;
      case 'jumpf': jump(a + (G.flags[b] || 'squad')); return CONT;
      case 'chapter': G.chap = a; G.chapT = b; G.weather = Sys.rollWeather(G); G.goal = d ? { n: d, day: e } : null; if (a > 1 && ACH['ch' + (a - 1)]) unlock('ch' + (a - 1)); G.chapStart = { aff: Object.assign({}, G.aff), shifts: G.shifts.length, calls: G.calls, t: Date.now(), credits: G.credits }; if (!G.replay) { meta.chaps[a] = b; meta.maxChap = Math.max(meta.maxChap || 0, a); saveMeta(); LS.set('hl2_chap_' + a, snapshot()); ((STORY.codexAt || {})[a] || []).forEach(k => codexUnlock(k, 1)); } autosave(); return NEXT;
      case 'goal': G.goal = a ? { n: a, day: b } : null; return NEXT;
      case 'night': night(); return WAIT;
      case 'nextday': nextDay(); return NEXT;
      case 'route': { const pool = (b || ['hikari', 'rei', 'mira']).filter(x => G.known[x] !== undefined); let k = pool.reduce((m, x) => G.aff[x] > G.aff[m] ? x : m, pool[0]); if (d && G.aff[k] < d) k = 'squad'; jump((a || 'end_') + k); } return CONT;
      case 'end': theEnd(); return WAIT;
      case 'autosave': autosave(); return NEXT;
      case 'codex': codexUnlock(a); return NEXT;
      case 'ending': meta.endings[a] = 1; saveMeta(); return NEXT;
      case 'scene': meta.scenes[a] = 1; saveMeta(); return NEXT;
      case 'recap': recap(); return WAIT;
      case 'photo': photoCard(); return WAIT;
      case 'rhythm': rhythmOp(a || {}); return WAIT;
      case 'breach': breachOp(a || {}); return WAIT;
      case 'fight': fightOp(a || {}); return WAIT;
      case 'morale': G.morale = clamp((G.morale === undefined ? 60 : G.morale) + a, 0, 100); if (!skipping()) toast(a > 0 ? '📈 Morale up' : '📉 Morale down', `Squad morale: ${G.morale}`); return NEXT;
      case 'journal': Sys.journal(G, a); return NEXT;
      case 'tell': learnTell(a, b, d); return NEXT;
      case 'hero': Object.assign(G.heroes[a].st, b); return NEXT;
    }
    console.warn('unknown op', op); return NEXT;
  }

  // ---------- stage ----------
  function setBg(name, trans = 'fade') {
    G.vis.bg = name;
    const A = $('#bgA'), B = $('#bgB'), front = A.classList.contains('show') ? A : B, back = front === A ? B : A;
    back.innerHTML = Art.bg(name);
    if (trans === 'flash') flash('#fff');
    if (trans === 'shatter' && !skipping()) shatterOut(front.innerHTML);
    back.classList.remove('tr-iris', 'tr-wipe', 'tr-heart', 'tr-blur');
    if (trans === 'cut' || trans === 'shatter' || skipping()) { back.style.transition = 'none'; front.style.transition = 'none'; }
    else { back.style.transition = ''; front.style.transition = ''; }
    if (['iris', 'wipe', 'heart', 'blur'].includes(trans) && !skipping()) { back.style.transition = 'none'; void back.offsetWidth; back.classList.add('tr-' + trans); setTimeout(() => front.classList.remove('show'), 900); back.classList.add('show'); }
    else { back.classList.add('show'); front.classList.remove('show'); }
    applyLight();
    back.classList.remove('kb'); void back.offsetWidth; back.classList.add('kb');
  }
  function setTint(t) { G.vis.tint = t; $('#tint').className = 'layer ' + (t || ''); }
  function showChar(id, emo, pose, pos) {
    const st = G.vis.chars[id] || { emo: 'neutral', pose: 'default', pos: 'c', of: G.vis.pre && G.vis.pre[id] };
    let d = $(`#chars .char[data-id="${id}"]`), fresh = !d;
    if (fresh) { d = document.createElement('div'); d.className = 'char enter' + (id === 'bit' ? ' isbit' : ''); d.dataset.id = id; $('#chars').appendChild(d); setTimeout(() => d.classList.remove('enter'), 600); }
    const changed = emo && emo !== st.emo;
    if (emo) st.emo = emo; if (pose) st.pose = pose; if (pos) st.pos = pos;
    G.vis.chars[id] = st;
    d.innerHTML = Art.char((WHO[id] && WHO[id].art) || id, st.emo, st.pose, false, st.of || G.vis.of || 'hero');
    d.style.left = POS[st.pos] + '%';
    if (changed && !fresh) { d.classList.remove('hop'); void d.offsetWidth; d.classList.add('hop'); }
    d.querySelectorAll('.blink').forEach(b => b.style.animationDelay = (-Math.random() * 5).toFixed(2) + 's');
  }
  function hideChar(id) {
    delete G.vis.chars[id]; const d = $(`#chars .char[data-id="${id}"]`); if (!d) return;
    d.classList.add('leave'); setTimeout(() => d.remove(), 450);
  }
  function shake(n = 5) { if (!settings.motion) return; const g = $('#stage'); g.style.setProperty('--sh', n + 'px'); g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake'); }
  function flash(col = '#fff') { const f = $('#flash'); f.style.background = col; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }
  function showCg(name) {
    const el = $('#cg'); el.innerHTML = Art.cg(name); el.classList.add('on');
    if (!meta.gallery[name]) { meta.gallery[name] = 1; saveMeta(); toast('🖼️ CG Unlocked', Art.CG_NAMES[name]); }
  }
  function restoreVis() {
    const v = G.vis; $('#chars').innerHTML = ''; const cs = v.chars; v.chars = {};
    setBg(v.bg, 'cut'); setFx(v.fx); setTint(v.tint); v.music ? Sound.play(v.music) : Sound.stop();
    Object.entries(cs).forEach(([id, s]) => { showChar(id, s.emo, s.pose, s.pos); if (s.of) { G.vis.chars[id].of = s.of; showChar(id); } });
    ['#cg', '#letterbox', '#speed'].forEach(s => $(s).classList.remove('on')); $('#game').classList.remove('eyemode');
    zoom(v.zoom ? v.zoom[0] : 1, v.zoom && v.zoom[1], v.zoom && v.zoom[2], 0); setFilter(v.filter); setVfx(v.vfx); split(null); $('#stage').style.setProperty('--bgblur', (v.blur || 0) + 'px'); applyLight();
  }


  // ---------- cinematic effects ----------
  const LIGHT = { city_night: 'night', street_night: 'night', apartment: 'night', alley: 'night', harbor: 'dusk', rooftop: 'dusk', festival: 'night', snow_city: 'cold', aquarium: 'deep', glass_city: 'glass', rift: 'rift', ascension: 'rift', blacksite: 'alarm', lab: 'deep', boardroom: 'dark', konbini_hq: 'night', amusement: 'dusk', dome: 'stage', stage: 'stage', mountain: 'dusk', shrine: 'dusk' };
  function applyLight() { if (!G) return; const l = G.vis.light || LIGHT[G.vis.bg] || ''; $('#chars').className = 'layer' + (l ? ' l-' + l : ''); }
  function zoom(sc = 1, x = 50, y = 40, ms = 900) {
    G.vis.zoom = sc === 1 ? null : [sc, x, y];
    const st = $('#stage'); st.style.transition = ms && !skipping() ? `transform ${ms}ms cubic-bezier(.3,.1,.2,1)` : 'none';
    st.style.transformOrigin = `${x || 50}% ${y || 40}%`; st.style.transform = sc === 1 ? '' : `scale(${sc})`;
  }
  function setFilter(f) { G.vis.filter = f || null; const st = $('#stage'); st.classList.remove('f-flashback', 'f-mono', 'f-glitch', 'f-dream', 'f-noir'); if (f) st.classList.add('f-' + f); }
  function setVfx(v) {
    G.vis.vfx = v || null; const el = $('#vfx'); el.className = 'layer' + (v ? ' v-' + v : '');
    el.innerHTML = v === 'bokeh' ? [...Array(18)].map((_, i) => `<i style="left:${(i * 53) % 100}%;top:${(i * 37) % 90}%;width:${30 + (i * 17) % 60}px;height:${30 + (i * 17) % 60}px;animation-delay:${-i * .7}s;background:${['#ffd8a0', '#ff9ac8', '#9fdcff'][i % 3]}"></i>`).join('')
      : v === 'rainlens' ? [...Array(26)].map((_, i) => `<i style="left:${(i * 41) % 100}%;top:${(i * 29) % 95}%;width:${6 + i % 14}px;height:${8 + i % 16}px;animation-delay:${-i * .9}s"></i>`).join('')
      : v === 'godrays' ? [...Array(6)].map((_, i) => `<i style="left:${10 + i * 15}%;animation-delay:${-i * 1.3}s"></i>`).join('') : '';
  }
  function crack() {
    if (!settings.motion) return; Sound.sfx('glass');
    let d = ''; const cx = 540 + Math.random() * 200, cy = 280 + Math.random() * 160;
    for (let i = 0; i < 14; i++) { let a = i / 14 * 6.283 + Math.random() * .3, x = cx, y = cy; d += `M${cx},${cy}`; for (let k = 0; k < 5; k++) { x += Math.cos(a) * (60 + Math.random() * 90); y += Math.sin(a) * (60 + Math.random() * 90); a += (Math.random() - .5) * .6; d += ` L${x | 0},${y | 0}`; } }
    for (let r = 50; r < 260; r += 70) d += ` M${cx + r},${cy} A${r},${r * .9} 0 1 0 ${cx + r - .1},${cy - 1}`;
    const el = $('#crack'); el.innerHTML = `<svg viewBox="0 0 1280 720"><path d="${d}" fill="none" stroke="#fff" stroke-width="2.5" opacity=".9"/><path d="${d}" fill="none" stroke="#9ff6ff" stroke-width="7" opacity=".25"/></svg>`;
    el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); shake(10);
  }
  function impact() { const g = $('#stage'); g.classList.remove('impact'); void g.offsetWidth; g.classList.add('impact'); Sound.sfx('punch'); shake(8); setTimeout(() => g.classList.remove('impact'), 260); }
  function cutin(who, text, emo) {
    const c = $('#cutin'), info = WHO[who] || { c: '#fff', n: '' }, id = (info.art || who);
    c.style.setProperty('--c', info.c);
    c.innerHTML = `<div class="cdim"></div><div class="cband"><div class="cstreak"></div><div class="cface">${Art.char(id, emo || 'determined', 'default', true, G.vis.chars[who] && G.vis.chars[who].of || G.vis.of || 'hero')}</div><div class="ctext"><small>${info.n}</small><b>${T(text || '')}</b></div></div>`;
    c.classList.remove('go'); void c.offsetWidth; c.classList.add('go'); Sound.sfx('whoosh'); setTimeout(() => Sound.sfx('punch'), 180);
    setTimeout(() => c.classList.remove('go'), skipping() ? 100 : 1450);
  }
  function split(pair) {
    const el = $('#split'); G.vis.split = pair || null;
    if (!pair) { el.className = 'layer'; el.innerHTML = ''; return; }
    el.innerHTML = pair.map(([id, emo], i) => { const info = WHO[id] || {}; return `<div class="sp sp${i}" style="--c:${info.c || '#fff'}"><div class="spin">${Art.char(info.art || id, emo || 'determined', 'default', true, G.vis.of || 'hero')}</div></div>`; }).join('') + '<div class="spline"></div>';
    el.className = 'layer on'; Sound.sfx('swoosh');
  }
  function shatterOut(html) {
    const el = document.createElement('div'); el.className = 'layer shatter'; Sound.sfx('shatter');
    const pieces = [[0, 0, 50, 0, 30, 40, 0, 55], [50, 0, 100, 0, 100, 30, 60, 45, 30, 40], [0, 55, 30, 40, 45, 70, 20, 100, 0, 100], [30, 40, 60, 45, 70, 75, 45, 70], [60, 45, 100, 30, 100, 70, 70, 75], [20, 100, 45, 70, 70, 75, 80, 100], [70, 75, 100, 70, 100, 100, 80, 100]];
    el.innerHTML = pieces.map((p, i) => { const pts = []; for (let k = 0; k < p.length; k += 2) pts.push(`${p[k]}% ${p[k + 1]}%`); const dx = (p[0] + p[2] - 100) * 6, dy = (p[1] + p[3] - 60) * 6; return `<div class="shard" style="clip-path:polygon(${pts.join(',')});--dx:${dx}px;--dy:${dy}px;--r:${(i % 2 ? 1 : -1) * (8 + i * 3)}deg">${html}</div>`; }).join('');
    $('#stage').appendChild(el); setTimeout(() => el.remove(), 1300);
  }
  function fireworkDraw(x, p) {
    if (p.l > p.max) return;
    const k = 1 - p.l / p.max, r = p.s * Math.min(1, k * 2.2), a = Math.max(0, 1 - k * 1.1);
    if (p.l === p.max && Math.random() < .5) Sound.sfx('boom');
    x.save(); x.globalAlpha = a; x.fillStyle = p.c; x.shadowColor = p.c; x.shadowBlur = 10;
    for (let i = 0; i < 26; i++) { const an = i / 26 * 6.283; x.beginPath(); x.arc(p.x + Math.cos(an) * r, p.y + Math.sin(an) * r + k * k * 30, 2.4, 0, 7); x.fill(); }
    x.restore();
  }
  // ---------- gamepad ----------
  let padPrev = [], padSel = 0;
  function pollPad() {
    const gp = navigator.getGamepads && [...navigator.getGamepads()].find(x => x); if (!gp) return;
    const down = i => gp.buttons[i] && gp.buttons[i].pressed && !padPrev[i];
    const ch = $$('#choices .choice');
    if (ch.length) { if (down(12)) padSel = (padSel + ch.length - 1) % ch.length; if (down(13)) padSel = (padSel + 1) % ch.length; ch.forEach((b, i) => b.classList.toggle('padf', i === padSel)); }
    if (down(0)) { if ($('#splash').classList.contains('on')) startSplash(); else if (ch.length) ch[Math.min(padSel, ch.length - 1)].click(); else if (modalOpen()) { const b = $('#modal .btn.primary') || $('#modal .pick, #modal .slot'); b && b.click(); } else if (wait === 'text') clickText(); }
    if (down(1)) { if (modalOpen()) { const x = $('#mx'); x && x.click(); } else rollback(); }
    if (down(2)) quick('auto'); if (down(3)) logModal(); if (down(9)) { modalOpen() ? closeModal() : G && pauseMenu(); }
    padPrev = gp.buttons.map(b => b.pressed);
  }

  // ---------- particles ----------
  const Fx = { type: null, parts: [] };
  function setFx(t) { G.vis.fx = t; Fx.type = t; Fx.parts = []; Fx.init = 0; }
  function fxLoop() {
    const cv = $('#particles'), x = cv.getContext('2d'); x.clearRect(0, 0, 1280, 720);
    const t = Fx.type;
    if (t) {
      const want = { rain: 160, petals: 40, sparks: 60, embers: 70, stars: 50, glass: 90, hearts: 26, dust: 40, shadow: 50, snow: 120, leaves: 34, fireflies: 40, bubbles: 40, confetti: 90, fireworks: 3 }[t] || 40;
      while (Fx.parts.length < want) Fx.parts.push(spawn(t, Fx.parts.length < want * .8 && !Fx.init));
      Fx.init = 1;
      Fx.parts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.a += p.va || 0; p.l--;
        if (t === 'petals' || t === 'glass' || t === 'leaves' || t === 'snow' || t === 'confetti') p.vx += Math.sin((p.y + p.x) / 60) * .02;
        if (t === 'fireflies') { p.vx += (Math.random() - .5) * .08; p.vy += (Math.random() - .5) * .08; p.o = .5 + Math.sin(p.l / 12) * .5; }
        if (t === 'fireworks') { fireworkDraw(x, p); if (p.l <= 0) Fx.parts[i] = spawn(t); return; }
        x.save(); x.globalAlpha = Math.max(0, Math.min(1, p.o * Math.min(1, p.l / 40)));
        if (t === 'rain') { x.strokeStyle = '#bcd8ff'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(p.x - p.vx * 2, p.y - p.vy * 2); x.stroke(); }
        else if (t === 'petals') { x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = '#ffc1d8'; x.beginPath(); x.ellipse(0, 0, p.s, p.s * .55, 0, 0, 7); x.fill(); }
        else if (t === 'glass') { x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = `rgba(200,250,255,.9)`; x.beginPath(); x.moveTo(0, -p.s); x.lineTo(p.s * .6, 0); x.lineTo(0, p.s); x.lineTo(-p.s * .6, 0); x.fill(); }
        else if (t === 'hearts') { x.translate(p.x, p.y); x.fillStyle = '#ff7aa8'; x.font = `${p.s * 3}px sans-serif`; x.fillText('♥', 0, 0); }
        else if (t === 'snow') { x.fillStyle = '#fff'; x.shadowColor = '#fff'; x.shadowBlur = 4; x.beginPath(); x.arc(p.x, p.y, p.s, 0, 7); x.fill(); }
        else if (t === 'leaves') { x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.beginPath(); x.ellipse(0, 0, p.s * 1.4, p.s * .6, 0, 0, 7); x.fill(); x.strokeStyle = '#0003'; x.beginPath(); x.moveTo(-p.s * 1.4, 0); x.lineTo(p.s * 1.4, 0); x.stroke(); }
        else if (t === 'confetti') { x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.s, -p.s * .4, p.s * 2, p.s * .8); }
        else if (t === 'bubbles') { x.strokeStyle = '#cff6ff'; x.lineWidth = 1.2; x.beginPath(); x.arc(p.x, p.y, p.s, 0, 7); x.stroke(); x.fillStyle = '#fff'; x.beginPath(); x.arc(p.x - p.s * .35, p.y - p.s * .35, p.s * .2, 0, 7); x.fill(); }
        else if (t === 'fireflies') { x.fillStyle = '#e8ff8a'; x.shadowColor = '#e8ff8a'; x.shadowBlur = 12; x.beginPath(); x.arc(p.x, p.y, p.s, 0, 7); x.fill(); }
        else { x.fillStyle = { sparks: '#fff27a', embers: '#ff8a3a', stars: '#fff', dust: '#ffffff', shadow: '#6a3ac0' }[t]; x.shadowColor = x.fillStyle; x.shadowBlur = t === 'dust' ? 0 : 8; x.beginPath(); x.arc(p.x, p.y, p.s, 0, 7); x.fill(); }
        x.restore();
        if (p.l <= 0 || p.y > 760 || p.y < -60 || p.x < -60 || p.x > 1340) Fx.parts[i] = spawn(t);
      });
    }
    pollPad();
    requestAnimationFrame(fxLoop);
  }
  function spawn(t, anywhere) {
    const r = Math.random, y0 = anywhere ? r() * 720 : -20;
    switch (t) {
      case 'rain': return { x: r() * 1400, y: anywhere ? r() * 720 : -20, vx: -3, vy: 18 + r() * 8, s: 1, o: .5, l: 200 };
      case 'petals': return { x: r() * 1400, y: y0, vx: -1 - r(), vy: 1 + r() * 1.2, s: 4 + r() * 4, o: .9, a: r() * 6, va: .03, l: 900 };
      case 'glass': return { x: r() * 1280, y: y0, vx: (r() - .5), vy: .6 + r() * 1.2, s: 2 + r() * 4, o: .8, a: r() * 6, va: .05, l: 900 };
      case 'sparks': return { x: r() * 1280, y: 720, vx: (r() - .5) * 3, vy: -2 - r() * 4, s: 1 + r() * 2, o: 1, l: 60 + r() * 80 };
      case 'embers': return { x: r() * 1280, y: anywhere ? r() * 720 : 730, vx: (r() - .3), vy: -.8 - r() * 1.6, s: 1 + r() * 2.2, o: .9, l: 200 + r() * 300 };
      case 'shadow': return { x: r() * 1280, y: anywhere ? r() * 720 : 730, vx: (r() - .5) * .5, vy: -.4 - r(), s: 2 + r() * 5, o: .6, l: 300 };
      case 'hearts': return { x: r() * 1280, y: anywhere ? r() * 720 : 740, vx: (r() - .5) * .6, vy: -.6 - r(), s: 4 + r() * 5, o: .7, l: 700 };
      case 'dust': return { x: r() * 1280, y: r() * 720, vx: (r() - .5) * .3, vy: (r() - .5) * .3, s: r() * 1.5 + .5, o: .35, l: 400 + r() * 400 };
      case 'snow': return { x: r() * 1400, y: y0, vx: -.3 - r() * .5, vy: .6 + r() * 1.4, s: 1 + r() * 2.8, o: .9, l: 1200 };
      case 'leaves': return { x: r() * 1400, y: y0, vx: -1 - r(), vy: 1 + r(), s: 5 + r() * 4, o: .95, a: r() * 6, va: .04, l: 900, c: ['#e8742a', '#d8a02a', '#b8401a', '#f0c040'][(r() * 4) | 0] };
      case 'confetti': return { x: r() * 1280, y: y0, vx: (r() - .5) * 1.5, vy: 1.5 + r() * 2, s: 4 + r() * 3, o: 1, a: r() * 6, va: .15, l: 700, c: ['#ff5d85', '#ffd24a', '#52e0ff', '#6fffb0', '#b58aff'][(r() * 5) | 0] };
      case 'bubbles': return { x: r() * 1280, y: anywhere ? r() * 720 : 740, vx: (r() - .5) * .4, vy: -.6 - r() * 1.2, s: 2 + r() * 6, o: .7, l: 900 };
      case 'fireflies': return { x: r() * 1280, y: 300 + r() * 420, vx: (r() - .5) * .5, vy: (r() - .5) * .5, s: 1.5 + r() * 1.5, o: .8, l: 600 + r() * 600 };
      case 'fireworks': return { x: 150 + r() * 980, y: 80 + r() * 260, vx: 0, vy: 0, s: 60 + r() * 80, o: 1, l: 110 + ((r() * 90) | 0), max: 110, c: ['#ff5d85', '#ffd24a', '#52e0ff', '#b58aff', '#6fffb0'][(r() * 5) | 0] };
      default: return { x: r() * 1280, y: r() * 500, vx: 0, vy: 0, s: r() * 1.5 + .3, o: r(), l: 200 + r() * 600 };
    }
  }

  // ---------- text ----------
  function parse(text) {
    const out = []; let em = 0, shk = 0, big = 0, wav = 0, whi = 0, rb = 0;
    for (const ch of T(text)) {
      if (ch === '*') { em ^= 1; continue; } if (ch === '~') { shk ^= 1; continue; } if (ch === '^') { big ^= 1; continue; }
      if (ch === '%') { wav ^= 1; continue; } if (ch === '|') { whi ^= 1; continue; } if (ch === '$') { rb ^= 1; continue; }
      out.push({ ch, cls: (em ? 'em ' : '') + (shk ? 'shk ' : '') + (big ? 'big ' : '') + (wav ? 'wav ' : '') + (whi ? 'whi ' : '') + (rb ? 'rb' : '') });
    }
    return out;
  }
  function say(who, text) {
    wait = 'text'; clearTimeout(autoTimer);
    const tb = $('#textbox'); tb.classList.remove('hide'); hideHub(true);
    const np = $('#nameplate'), info = who && who !== 'think' ? WHO[who] : null;
    let nm = '';
    if (info) nm = who === 'me' ? G.name : (G.known[who] !== undefined || who === 'me' ? info.n : '???');
    np.textContent = nm; np.style.setProperty('--c', info ? info.c : '#8fd3ff'); np.classList.toggle('on', !!nm);
    tb.style.setProperty('--c', info ? info.c : who === 'think' ? '#8fd3ff' : '#c9b8ff');
    tb.classList.toggle('think', who === 'think'); tb.classList.toggle('narr', !who);
    $$('#chars .char').forEach(d => { d.classList.toggle('dim', !!(info && G.vis.chars[who] && d.dataset.id !== who)); d.classList.remove('talking'); });
    const sp = info && $(`#chars .char[data-id="${who}"]`); if (sp) sp.classList.add('talking');
    tb.classList.toggle('unread', lastUnread);
    if (lastUnread && skipping() && !settings.skipUnread) { skip = false; ctrlSkip = false; updateQuick(); toast('⏸ Skip stopped', 'Unread text ahead'); }
    const parts = parse(text), box = $('#text');
    box.innerHTML = parts.map((p, i) => `<span class="${p.cls}" style="--i:${i}">${p.ch === ' ' ? ' ' : p.ch.replace('<', '&lt;')}</span>`).join('');
    const spans = box.children; let i = 0;
    log.push({ n: nm || (who === 'think' ? '(thought)' : ''), c: info ? info.c : '#aaa', t: parts.map(p => p.ch).join('') }); if (log.length > 150) log.shift();
    $('#next').classList.remove('on'); typing = true; clearInterval(typeTimer);
    const done = () => {
      typing = false; clearInterval(typeTimer); for (const s of spans) s.classList.add('on'); $('#next').classList.add('on');
      if (sp) sp.classList.remove('talking');
      if (skipping()) autoTimer = later(40, () => { if (wait === 'text') advance(); });
      else if (auto) { const my = run; autoTimer = setTimeout(() => { if (my === run && wait === 'text' && auto) advance(); }, settings.autoDelay * 1000 + parts.length * 22); }
    };
    tb._done = done;
    if (skipping() || settings.textSpeed >= 120) return done();
    const pitch = info ? info.p : who === 'think' ? 0 : 0;
    typeTimer = setInterval(() => {
      if (i >= spans.length) return done();
      spans[i].classList.add('on'); if (pitch && i % 2 === 0 && parts[i].ch !== ' ') Sound.blip(pitch); i++;
    }, 1000 / settings.textSpeed);
  }
  function clickText() {
    if (wait !== 'text' || hidden) return;
    if (typing) { $('#textbox')._done(); return; }
    Sound.sfx('click'); advance();
  }

  // ---------- choices ----------
  function choice(opts, eyeCfg) {
    wait = 'choice'; skip = false; ctrlSkip = false; updateQuick(); $$('#toasts .toast:not(.ach)').forEach(t => t.remove());
    const box = $('#choices'); box.innerHTML = ''; box.className = eyeCfg ? 'on eye' : 'on';
    const my = run;
    if (eyeCfg) {
      $('#game').classList.add('eyemode'); Sound.sfx('heartbeat'); Sound.sfx('whoosh');
      box.innerHTML = `<div class="eyehead"><div class="eyetag">◉ HANDLER'S EYE</div><div class="eyeq">${T(eyeCfg.prompt)}</div><div class="eyebar"><i style="animation-duration:${eyeCfg.time}ms"></i></div></div>`;
      const hb = setInterval(() => { if (wait !== 'choice' || my !== run) return clearInterval(hb); Sound.sfx('heartbeat'); }, 900);
      box._t = setTimeout(() => { if (my === run && wait === 'choice') pick(opts.find(o => o.timeout) || opts[opts.length - 1], eyeCfg); }, eyeCfg.time);
    }
    opts.forEach((o, k) => {
      if (o.if && !o.if(G)) return;
      if (o.read && !(G.tells && G.tells[o.read])) return;
      const btn = document.createElement('button'); btn.className = 'choice'; btn.style.animationDelay = k * 80 + 'ms';
      const hint = settings.hints && o.aff ? Object.entries(o.aff).filter(([, v]) => v > 0).map(([w]) => `<b style="color:${WHO[w].c}">♥</b>`).join('') : '';
      btn.innerHTML = `<span class="k">${k + 1}</span>${o.read ? '<span class="rd">📓</span>' : ''}${T(o.t)}${hint ? `<span class="hint">${hint}</span>` : ''}`;
      btn.onmouseenter = () => Sound.sfx('hover');
      btn.onclick = () => pick(o, eyeCfg);
      box.appendChild(btn);
    });
  }
  function pick(o, eyeCfg) {
    if (wait !== 'choice') return;
    const box = $('#choices'); clearTimeout(box._t); box.className = ''; box.innerHTML = ''; $('#game').classList.remove('eyemode');
    Sound.sfx('confirm'); log.push({ n: '▶', c: '#8fd3ff', t: T(o.t) }); meta.stats.choices++;
    if (eyeCfg) { G.eyes++; if (o.ok) { G.eyesOk++; flash('#9feaff'); toast('◉ Sharp read!', 'Handler\'s Eye success'); } }
    if (o.aff) Object.entries(o.aff).forEach(([w, v]) => addAff(w, v));
    if (o.set) G.flags[o.set] = 1;
    wait = null;
    const f = top(); f.i++;
    if (o.go) jump(o.go); else if (o.then) push(o.then);
    step();
  }

  // ---------- affection / achievements / toasts ----------
  function addAff(w, v) {
    if (!(w in G.aff) || !v) return;
    G.aff[w] = clamp(G.aff[w] + v, -20, 99); if (w !== 'aya') G.today[w] = (G.today[w] || 0) + 1;
    if (w === 'aya') return;
    Sound.sfx(v > 0 ? 'heart' : 'heartdown');
    const p = document.createElement('div'); p.className = 'affpop' + (v < 0 ? ' down' : '');
    const cpos = G.vis.chars[w]; p.style.left = (cpos ? POS[cpos.pos] : 88) + '%';
    p.style.color = WHO[w].c; p.innerHTML = `${v > 0 ? '♥' : '💔'} ${WHO[w].n} ${v > 0 ? '+' : ''}${v}`;
    $('#game').appendChild(p); setTimeout(() => p.remove(), 1800);
    if (G.aff[w] >= 20) unlock('bond');
  }
  function unlock(id) {
    if (meta.ach[id] || !ACH[id]) return; meta.ach[id] = Date.now(); saveMeta();
    Sound.sfx('chime'); toast('🏆 ' + ACH[id][0], ACH[id][1], 'ach');
  }
  function learnTell(hero, key, text) {
    G.tells = G.tells || {}; const k = hero + '_' + key; if (G.tells[k]) return; G.tells[k] = text;
    Sys.journal(G, `Notebook — ${WHO[hero] ? WHO[hero].n : hero}: ${text}`);
    const have = Object.keys(G.tells).length; if (have >= 6) unlock('notebook'); if (['hikari_count', 'rei_scarf', 'mira_tidy', 'kaede_heel', 'sora_stage', 'tetsu_polite', 'rin_hum', 'shiori_cuffs'].every(k => G.tells[k])) unlock('tell_all');
    if (!skipping()) { Sound.sfx('page'); toast('📓 Notebook · ' + (WHO[hero] ? WHO[hero].n : hero), text, 'tell'); }
  }
  function toast(t, s, cls = '') {
    const d = document.createElement('div'); d.className = 'toast ' + cls; d.innerHTML = `<b>${t}</b><span>${s || ''}</span>`;
    const tb = $('#toasts'); tb.appendChild(d); while (tb.children.length > 4) tb.firstChild.remove(); setTimeout(() => d.classList.add('out'), 2800); setTimeout(() => d.remove(), 3300);
  }

  // ---------- cards ----------
  function titleCard(small, big) {
    wait = 'card'; Sound.sfx('whoosh');
    const c = $('#card'); c.className = 'on title'; c.innerHTML = `<div class="tc"><div class="tcs">${small}</div><div class="tcb">${big}</div><div class="tcl"></div></div>`;
    later(3400, () => { c.className = ''; later(400); });
  }
  function dayCard() {
    wait = 'card'; Sound.sfx('page');
    const c = $('#card'); c.className = 'on day';
    c.innerHTML = `<div class="dc"><div class="dcal"><div class="dtop">${DAYS[(G.day - 1) % 7]}</div><div class="dnum">${G.day}</div></div><div class="dinfo"><small class="dch">${G.chapT}</small><b>DAY ${G.day}</b><span>${WX().i} ${WX().n}</span><em>${G.goal ? (G.goal.day > G.day ? `${G.goal.day - G.day} day${G.goal.day - G.day > 1 ? 's' : ''} until ${G.goal.n}` : G.goal.n) : G.chapT}</em></div></div>`;
    later(2600, () => { c.className = ''; later(300); });
  }
  function nameEntry() {
    wait = 'modal';
    modal(`<h2>Your Name</h2><p class="sub">What will Hikari call you?</p><input id="nm" maxlength="12" value="${G.name}" autocomplete="off"/><div class="row"><button class="btn primary" id="nmok">Confirm</button></div>`, { noclose: 1, small: 1 });
    const inp = $('#nm'); inp.focus({ preventScroll: true }); inp.select();
    const ok = () => { G.name = (inp.value.trim() || 'Haru').replace(/[<>&"]/g, ''); meta.lastName = G.name; closeModal(); Sound.sfx('confirm'); advance(); };
    $('#nmok').onclick = ok; inp.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') ok(); };
  }

  // ---------- modal ----------
  function modal(html, o = {}) {
    const m = $('#modal'); m.className = 'on' + (o.small ? ' small' : '') + (o.wide ? ' wide' : '') + (o.cls ? ' ' + o.cls : '');
    m.innerHTML = `<div class="panel">${o.noclose ? '' : '<button class="x" id="mx">✕</button>'}${html}</div>`;
    if (!o.noclose) $('#mx').onclick = () => { Sound.sfx('cancel'); closeModal(); o.onclose && o.onclose(); };
    m._onclose = o.onclose; Sound.sfx('swoosh');
    m.querySelectorAll('button').forEach(b => { if (!b.onmouseenter) b.addEventListener('mouseenter', () => Sound.sfx('hover')); });
    return m;
  }
  function closeModal() { const m = $('#modal'); m.className = ''; m.innerHTML = ''; }
  const modalOpen = () => $('#modal').classList.contains('on');

  // ---------- HUB (evening free time) ----------
  const ROMANCE = ['hikari', 'rei', 'mira', 'sora', 'kaede'];
  const MET = () => ['hikari', 'rei', 'mira', 'kaede', 'tetsu', 'sora', 'rin', 'natsuki', 'shiori'].filter(h => G.known[h] !== undefined);
  const HERE = () => MET().filter(h => !G.flags['away_' + h]);
  const NEED = [0, 0, 5, 11, 18, 26];
  const sceneCount = h => { let n = 0; while (STORY.scripts[`hang_${h}_${n + 1}`]) n++; return n; };
  const moodTag = h => { const m = G.mood && G.mood[h] && Sys.MOOD[G.mood[h]]; return m && G.mood[h] !== 'calm' ? `<span class="mood" title="${m[2]}">${m[0]} ${m[1]}</span>` : ''; };
  function hudHtml() {
    const seg = SLOTS.map((s, i) => `<div class="seg ${i < G.slot ? 'used' : i === G.slot ? 'now' : ''}"><span>${s}</span></div>`).join('');
    const mo = G.morale === undefined ? 60 : G.morale;
    return `<div class="hudday"><b>DAY ${G.day}</b><span>${G.chapT || ''} · ${DAYS[(G.day - 1) % 7]} ${WX().i}</span></div>
      <div class="timebar">${seg}<div class="sun" style="left:${(G.slot + .5) / SLOTS.length * 100}%">${G.slot < 1 ? '🌆' : '🌙'}</div></div>
      <div class="hudstats"><div class="energy"><label>ENERGY</label><div class="bar"><i style="width:${Math.min(100, G.energy)}%"></i></div><small>${G.energy}</small></div>
      <div class="chip" title="Squad morale · affects every dispatch call">${mo >= 70 ? '😄' : mo < 40 ? '😣' : '🙂'} ${mo}</div><div class="chip">💴 ${G.credits}</div><div class="chip">⭐ ${G.rep}</div></div>`;
  }
  function renderHub() {
    wait = 'hub'; hist = []; $('#textbox').classList.add('hide'); G.vis.of = null; G.vis.pre = null;
    Object.keys(G.vis.chars).forEach(hideChar); ['#cg', '#letterbox', '#speed'].forEach(s => $(s).classList.remove('on'));
    const hbg = G.flags.hubbg || 'hq_lobby', hfx = hbg === 'shrine' && G.chap >= 9 && G.chap <= 10 ? 'snow' : 'dust'; if (G.vis.bg !== hbg) setBg(hbg); if (G.vis.fx !== hfx) setFx(hfx); if (G.vis.music !== 'daily') { G.vis.music = 'daily'; Sound.play('daily'); }
    const hud = $('#hud'); hud.innerHTML = hudHtml(); hud.classList.add('on');
    setTint(['evening', 'night'][G.slot]);
    const ch = G.chap || 0;
    const acts = [
      ['hang', '💗', 'Hang Out', 'Spend the evening together', 10], ['date', '💞', 'Date', ch >= 1 ? 'Pick a place · deepen a bond' : 'Unlocks in Chapter 1', 15, ch < 1],
      ['train', '🥊', 'Train', 'Five drills or a Sim fight · XP', 20], ['rest', '🛏️', 'Rest', 'Squad recovers fatigue', 0],
      ['dinner', '🍲', 'Squad Dinner', ch >= 2 ? '💴120 · morale & bonds' : 'Unlocks in Chapter 2', 0, ch < 2 || G.credits < 120], ['job', '🏪', 'Night Shift', 'Work the konbini · +💴', 25]
    ];
    const frees = [['dossier', '📁', 'Dossier', perkAlert()], ['hq', '🏗️', 'HQ', ''], ['shop', '🛍️', 'Shop', ''], ['heronet', '📱', 'HeroNet', ''], ['journal', '📓', 'Notes', '']];
    const squad = G.roster.map(h => { const s = G.heroes[h]; return `<div class="sq" style="--c:${WHO[h].c}"><div class="pt">${Art.char(h, s.hurt ? 'sad' : s.fat > 70 ? 'sweat' : G.mood[h] === 'fired' ? 'determined' : G.mood[h] === 'moody' ? 'gloomy' : 'smile', 'default', true)}</div><div class="sqs"><b>${WHO[h].n} <small>Lv ${s.lvl}</small>${s.sp ? `<em class="spb">+${s.sp} SP</em>` : ''}${Sys.perkDue(G, h) >= 0 ? '<em class="spb pk">PERK</em>' : ''}</b>
      <div class="mini fat"><label>FTG</label><span><i style="width:${s.fat}%"></i></span><em>${s.fat}</em></div>${s.hurt ? '<div class="hurtb">🩹 injured</div>' : moodTag(h)}</div></div>`; }).join('')
      + `<h3 class="bh">BONDS</h3>` + MET().filter(h => h !== 'tetsu').map(h => `<div class="bond" style="--c:${WHO[h].c}"><b>${WHO[h].n}${G.bday === h ? ' 🎂' : ''}</b>${heart(G.aff[h])}<small>${tier(G.aff[h])}</small></div>`).join('')
      + (G.goal && G.goal.day >= G.day ? `<div class="countdown"><b>${Math.max(0, G.goal.day - G.day)}</b><span>day${G.goal.day - G.day === 1 ? '' : 's'} until<br>${G.goal.n}</span></div>` : '');
    $('#hub').innerHTML = `<div class="squad"><h3>SQUAD ZERO${G.flags.rogue && !G.flags.restored ? ' <small class="rogue">OFF THE BOOKS</small>' : ''}</h3>${squad}</div>
      <div class="hubmain">${G.bday ? `<div class="bdayb">🎂 It's <b>${WHO[G.bday].n}</b>'s birthday today! Gifts count double.</div>` : ''}<div class="acts">${acts.map(([k, ic, n, d, cost, off]) => `<button class="act ${off || (cost > 0 && G.energy < cost) ? 'off' : ''}" data-a="${k}" data-why="${off ? (d.startsWith('Unlocks') ? d : 'Not enough credits.') : 'Not enough energy. Rest first!'}"><div class="ic">${ic}</div><b>${n}</b><small>${d}</small>${cost > 0 ? `<em>-${cost} ⚡</em>` : cost === 0 ? '<em>uses slot</em>' : ''}</button>`).join('')}</div>
      <div class="frees">${frees.map(([k, ic, n, al]) => `<button class="free" data-a="${k}"><span>${ic}</span><b>${n}</b>${al ? `<i>${al}</i>` : ''}</button>`).join('')}</div></div>
      <div class="bittip"><div class="bitface">${Art.char('bit', 'happy', '', true)}</div><p>${hubTip()}</p></div>`;
    $('#hub').classList.add('on');
    $$('#hub .act, #hub .free').forEach(b => { b.onmouseenter = () => Sound.sfx('hover'); b.onclick = () => { if (b.classList.contains('off')) { Sound.sfx('fail'); toast('Not now', b.dataset.why); return; } Sound.sfx('click'); ACTS[b.dataset.a](); }; });
  }
  const perkAlert = () => { const n = G.roster.filter(h => Sys.perkDue(G, h) >= 0 || G.heroes[h].sp).length; return n ? '!' : ''; };
  function hideHub(keepHud) { $('#hub').classList.remove('on'); if (!keepHud) $('#hud').classList.remove('on'); }
  function hubTip() {
    const tips = [];
    if (G.bday) tips.push(`It's ${WHO[G.bday].n}'s birthday! A gift today counts double. Beep-beep-boop, that's the birthday song.`);
    G.roster.forEach(k => { if (Sys.perkDue(G, k) >= 0) tips.push(`${WHO[k].n} can learn a new PERK! Open the Dossier and pick one. They change how shifts play out.`); });
    G.roster.forEach(k => { const h = G.heroes[k]; if (h.sp) tips.push(`${WHO[k].n} has ${h.sp} unspent skill point${h.sp > 1 ? 's' : ''}! Open the Dossier to boost a stat.`); });
    G.roster.forEach(k => { if (G.heroes[k].fat > 60) tips.push(`${WHO[k].n} is worn out. Fatigue lowers success odds and slows recovery during shifts. Rest helps!`); });
    if ((G.morale || 60) < 40) tips.push('Squad morale is low. A Squad Dinner, a good shift, or some rest would help. Low morale hurts every call!');
    if (G.credits >= Sys.HQCOST[0] && !Object.keys(G.hq || {}).length) tips.push('We can afford an HQ upgrade! The Garage and Med Bay pay for themselves. Check the HQ menu.');
    if (G.last && G.last.miss > 1) tips.push(`We missed ${G.last.miss} calls today. Tip: use ▶▶ when heroes are busy, and ❚❚ to plan!`);
    if (tips.length) return tips[(G.day + G.slot) % tips.length];
    const gen = ['Match the red outline on a call! Heroes stack their stats when you send a team.', 'Pairs who clear calls together build Bond levels, and bonded pairs get bonus success.', 'Mobility gets heroes there faster. Vigor gets them back on their feet sooner.', 'Gifts a hero LOVES give big affection boosts. Check their Dossier for hints!', 'Higher affection unlocks new Hang Out scenes, and at Friend you can ask someone on a Date!', 'Handler skills (🎯📣⚡☕) in the dispatch bar can save a shift. Use them wisely.', 'Nemeses escape twice before they go down for good. Beat them three times!', 'Gear from the Shop gives permanent stat boosts. One item per hero.', 'Hold CTRL to skip text you\'ve read. Press H to hide the UI and admire the view.'];
    return gen[(G.day * 3 + G.slot) % gen.length];
  }
  function useSlot(evChance = .3) {
    G.slot++; closeModal();
    const hud = $('#hud'); hud.innerHTML = hudHtml(); Sound.sfx('swoosh');
    const pool = Object.keys(STORY.events).filter(k => !G.ev[k] && STORY.events[k].day <= G.day && (!STORY.events[k].need || G.known[STORY.events[k].need] !== undefined) && (!STORY.events[k].ch || (G.chap || 0) >= STORY.events[k].ch) && (!STORY.events[k].until || (G.chap || 0) <= STORY.events[k].until));
    if (G.slot < SLOTS.length && pool.length && Math.random() < evChance) { const k = pool[(Math.random() * pool.length) | 0]; G.ev[k] = 1; hideHub(true); G.stack.push({ id: k, i: 0 }); setTimeout(step, 500); return; }
    setTimeout(step, 450);
  }
  const heroPick = (title, cb, opts = {}) => {
    const hs = opts.list || G.roster;
    modal(`<h2>${title}</h2><p class="sub">${opts.sub || 'Choose a hero'}</p><div class="picks ${hs.length > 5 ? 'dense' : ''}">${hs.map(h => {
      const s = G.heroes[h];
      return `<button class="pick" data-h="${h}" style="--c:${WHO[h].c}"><div class="pp">${Art.char(h, s && s.fat > 70 ? 'sad' : 'smile', 'default', true)}</div>
      <b>${WHO[h].n}</b>${opts.extra ? opts.extra(h) : `<small>Lv ${s.lvl} · XP ${s.xp}/${s.lvl * 40 + 40}</small><small>Fatigue ${s.fat}%</small>${moodTag(h)}`}</button>`;
    }).join('')}</div>`, { wide: hs.length > 3 });
    $$('#modal .pick').forEach(b => b.onclick = () => { Sound.sfx('confirm'); cb(b.dataset.h); });
  };
  function giveXP(id, amt) {
    const h = G.heroes[id]; h.xp += amt; let n = 0;
    while (h.lvl < 10 && h.xp >= h.lvl * 40 + 40) { h.xp -= h.lvl * 40 + 40; h.lvl++; h.sp++; n++; }
    if (n) { Sound.sfx('levelup'); toast(`⬆ ${WHO[id].n} reached Lv ${h.lvl}!`, Sys.perkDue(G, id) >= 0 ? '+1 skill point · new PERK available' : '+1 skill point'); } if (h.lvl >= 5) unlock('veteran');
    return n;
  }
  const DRILLS = [['com', '🥊', 'Sparring', 'Combat · timing strikes'], ['mob', '👟', 'Agility Course', 'Mobility · reflex targets'], ['int', '⌨', 'Breach Sim', 'Intellect · code puzzle'], ['cha', '🎤', 'Stage Practice', 'Charisma · rhythm game'], ['vig', '🏋️', 'Endurance', 'Vigor · timing strikes']];
  const DINNER = [['hikari', 'kaede', 'Hikari: The last gyoza is MINE.', 'Kaede: Faster hands win, Amane.'], ['rei', 'hikari', 'Rei silently slides her pickled plums onto Hikari\'s plate.', 'Hikari: …Rei. Are we… FRIENDS?! Rei: Don\'t make it weird.'],
    ['tetsu', 'sora', 'Tetsu: I made the curry mild, so everyone can have some.', 'Sora: Tetsu, marry me. …Kidding! Mostly!'], ['mira', 'rei', 'Mira: Vegetables, Rei. I\'m watching.', 'Rei: …I will eat one carrot. Under protest.'],
    ['kaede', 'tetsu', 'Kaede: Bet I finish my bowl before you finish saying "itadakimasu."', 'Tetsu: Itada— oh. She\'s done.'], ['sora', 'hikari', 'Sora teaches everyone the chorus of her new single.', 'Hikari: ♪ Shining star, shining sta— ♪ Rei: Please stop.'],
    ['rin', 'kaede', 'Rin: This is the first hot meal I\'ve had at a table in two years.', 'Kaede: Then have mine too. I\'m fast, I\'ll get more.'], ['natsuki', 'tetsu', 'Natsuki: Squad One used to do this. Every Friday.', 'Tetsu: Then we\'ll do it every Friday. It\'s tradition now.'],
    ['shiori', 'mira', 'Shiori: The Board fed us nutrient bars. This is… inefficient.', 'Mira: It\'s called flavor, Shiori. Have seconds.'], ['hikari', 'mira', 'Hikari: Mira, is there more rice? For science?', 'Mira: There is always more rice, Hikari. I made four kilos.']];
  const JOB = ['A salaryman buys forty onigiri and says nothing. You respect him.', 'The hero broadcast on the tiny TV shows one of YOUR calls from today. You don\'t tell the night manager.', 'A kid asks if you\'re "the HandlerZero guy." You deny everything and give him a free pudding.', 'Nothing happens for six hours. It is the most peaceful you\'ve felt in weeks.', 'A cat walks in, inspects aisle four, and leaves. Standards are standards.', 'Your old manager cries a little and says the store hasn\'t been the same. The new guy keeps rotating the onigiri wrong.'];

  const ACTS = {
    train() {
      if (Object.keys(G.foeSeen || {}).length) {
        modal(`<h2>Training</h2><p class="sub">What kind of evening is it?</p><div class="trainpick"><button class="tp" id="tpd"><b>🥊 Drills</b><small>One hero · five drills · stat gains</small></button><button class="tp" id="tps"><b>🎯 Sim Room</b><small>The squad against a foe you have fought · XP and credits</small></button></div>`, {});
        $('#tpd').onclick = () => { Sound.sfx('click'); closeModal(); ACTS.drills(); }; $('#tps').onclick = () => { Sound.sfx('click'); simRoom(); }; return;
      }
      ACTS.drills();
    },
    drills() {
      heroPick('Training', h => {
        modal(`<h2>Training · ${WHO[h].n}</h2><p class="sub">Pick a drill. Great results can permanently raise that stat. Costs 20 energy and adds fatigue.</p><div class="drills">${DRILLS.map(([k, i, n, d]) => `<button class="drill" data-k="${k}"><span>${i}</span><b>${n}</b><small>${d}</small><em>${Dispatch.SI[k]} ${G.heroes[h].st[k]}</em></button>`).join('')}</div>`, { wide: 1 });
        $$('#modal .drill').forEach(b => b.onclick = () => { Sound.sfx('confirm'); drill(h, b.dataset.k); });
      }, { sub: 'Who is training tonight?' });
    },
    hang() {
      heroPick('Hang Out', h => {
        G.energy -= 10; const n = (G.seen[h] || 0) + 1;
        let label = `hang_${h}_x`;
        if (n <= sceneCount(h) && G.aff[h] >= NEED[n]) { G.seen[h] = n; label = `hang_${h}_${n}`; }
        if (!R[label]) label = 'hang_generic';
        G.today[h] = (G.today[h] || 0) + 1; G.morale = clamp((G.morale || 60) + 2, 0, 100);
        if (HERE().every(k => G.seen[k])) unlock('social');
        if (Sys.hq(G, 'lounge') >= 2 || G.mood[h] === 'cheer') G.aff[h] += 1;
        Sys.journal(G, `Spent the evening with ${WHO[h].n}.`);
        G.slot++; closeModal(); hideHub(); G.vis.of = G.chap >= 9 && G.chap <= 10 ? 'winter' : 'casual'; G.hangWho = h;
        G.stack.push({ id: label, i: 0 }); step();
      }, { list: HERE(), sub: 'Who do you want to spend the evening with?', extra: h => { const n = (G.seen[h] || 0) + 1, max = sceneCount(h); return `<small>${heart(G.aff[h])}</small><small>${tier(G.aff[h])}</small>${moodTag(h)}<small class="nextscene">${n > max ? 'All scenes seen' : G.aff[h] >= NEED[n] ? '✨ New scene available' : `Next scene at ♥${NEED[n]}`}</small>`; } });
    },
    date() {
      const list = ROMANCE.filter(h => G.known[h] !== undefined && !G.flags['away_' + h]);
      heroPick('Date', h => {
        if (G.aff[h] < Sys.DATE_MIN) { Sound.sfx('fail'); toast('Not yet…', `Reach ♥${Sys.DATE_MIN} (Friend) with ${WHO[h].n} first.`); return; }
        datePlace(h);
      }, { list, sub: 'Who do you want to ask out?', extra: h => `<small>${heart(G.aff[h])}</small>${moodTag(h)}<small class="nextscene">${G.aff[h] >= Sys.DATE_MIN ? '💞 Available' : `Unlocks at ♥${Sys.DATE_MIN}`}</small>` });
    },
    rest() {
      modal(`<h2>Rest</h2><div class="rest"><div class="zzz">Z<span>z</span><span>z</span></div><p>You order takeout for the whole squad and call it an early night. B.I.T. hums a lullaby at 40 decibels.</p><p class="gain">+45 Energy · Squad −35 Fatigue · Morale +4</p></div>`, { noclose: 1 });
      Sound.sfx('snore'); unlock('rest');
      G.energy = clamp(G.energy + 45, 0, 100); G.morale = clamp((G.morale || 60) + 4, 0, 100); G.roster.forEach(h => { const s = G.heroes[h]; s.fat = clamp(s.fat - 35, 0, 100); });
      setTimeout(() => useSlot(.45), 2200);
    },
    dinner() {
      const known = h => G.known[h] !== undefined, pool = DINNER.filter(([a, b]) => known(a) && known(b)), pk = Sys.shuffle(pool, Math.random).slice(0, 2);
      G.credits -= 120; G.morale = clamp((G.morale || 60) + 12, 0, 100); MET().forEach(h => { G.aff[h] = (G.aff[h] || 0) + 1; }); unlock('dinner');
      modal(`<h2>Squad Dinner</h2><p class="sub">Hot pot on the break room floor. Somebody brought a speaker.</p><div class="dinner">${pk.map(([a, b, l1, l2]) => `<div class="dn"><div class="dnp">${Art.char(a, 'laugh', 'default', true)}</div><div class="dnt"><p>${T(l1)}</p><p>${T(l2)}</p></div><div class="dnp">${Art.char(b, 'happy', 'default', true)}</div></div>`).join('')}</div><p class="gain">Morale +12 · ♥ +1 with everyone</p><button class="btn primary" id="dnok">Itadakimasu!</button>`, { noclose: 1 });
      Sound.sfx('heart'); Sys.journal(G, 'Hosted a squad dinner. Hot pot. Nobody got stabbed with chopsticks.');
      $('#dnok').onclick = () => { Sound.sfx('confirm'); useSlot(.2); };
    },
    job() {
      const pay = 150 + ((Math.random() * 6) | 0) * 10; G.energy -= 25; G.credits += pay; unlock('sidejob');
      modal(`<h2>Night Shift · Konbini</h2><div class="rest"><div class="zzz">🏪</div><p>You put the old apron back on for one night. ${JOB[(Math.random() * JOB.length) | 0]}</p><p class="gain">+💴 ${pay}</p></div><button class="btn primary" id="jbok">Clock Out</button>`, { noclose: 1 });
      Sound.sfx('coin'); Sys.journal(G, `Worked a night at the konbini. +${pay} credits.`);
      $('#jbok').onclick = () => { Sound.sfx('confirm'); useSlot(.25); };
    },
    shop(tab) { shopModal(typeof tab === 'string' ? tab : 'gifts'); },
    hq() { if (G.flags.rogue && !G.flags.restored) { Sound.sfx('fail'); toast('🏗️ HQ is under Board control', 'Upgrades are locked while Squad Zero is off the books.'); return; } hqModal(); },
    dossier(sel) { dossier(typeof sel === 'string' ? sel : MET()[0]); },
    heronet() {
      const posts = STORY.feed(G);
      modal(`<div class="phone feed"><div class="phead">📱 HeroNet <small>#NeoTokyo</small></div><div class="pbody">${posts.map(p => `<div class="post"><div class="pav" style="background:${p.c}">${p.a}</div><div><b>${p.u}</b> <small>${p.h}</small><p>${T(p.t)}</p><small class="likes">♥ ${p.l} · ↻ ${Math.round(p.l / 7)}</small></div></div>`).join('')}</div></div>`, { cls: 'phonewrap' });
    },
    journal(tab) { journalModal(typeof tab === 'string' ? tab : 'notes'); }
  };
  const heart = v => { const n = clamp(Math.floor(v / 5), 0, 6); return '<span class="hearts">' + '♥'.repeat(n) + '<span>' + '♥'.repeat(6 - n) + '</span></span>'; };
  const tier = v => v < 3 ? 'Stranger' : v < 8 ? 'Acquaintance' : v < 14 ? 'Friend' : v < 22 ? 'Close Friend' : v < 30 ? 'Something More…' : 'Heartline ♥';

  // ---------- dates ----------
  function datePlace(h) {
    const locs = Sys.locsFor(G), know = G.aff[h] >= 14;
    modal(`<h2>Date with ${WHO[h].n}</h2><p class="sub">${know ? 'You have a good idea what she likes by now.' : 'Get closer (♥14) to learn which places she likes.'} Costs 15 energy · Wallet 💴 ${G.credits}</p>
      <div class="dlocs">${locs.map(([k, l]) => { const pref = know ? Sys.locPref(h, k) : null; return `<button class="dloc ${G.credits < l.cost || G.energy < 15 ? 'off' : ''}" data-k="${k}"><div class="dlbg" data-bg="${l.bg}"></div><div class="dlt"><b>${l.icon} ${l.n}</b><small>${l.cost ? '💴 ' + l.cost : 'Free'}${pref ? ' · ' + { love: '💖 She\'d love it', like: '🙂 She\'d like it', dislike: '😬 Not her thing' }[pref] : ''}</small></div>${l.cg ? '<i class="cgtag">✦ CG</i>' : ''}</button>`; }).join('')}</div>`, { wide: 1 });
    $$('#modal .dlbg').forEach((e, i) => setTimeout(() => { if (e.isConnected) e.innerHTML = Art.bg(e.dataset.bg); }, 40 + i * 35));
    $$('#modal .dloc').forEach(b => b.onclick = () => {
      if (b.classList.contains('off')) { Sound.sfx('fail'); toast('Can\'t afford it', 'Not enough credits or energy.'); return; }
      const l = Sys.LOCS[b.dataset.k]; G.credits -= l.cost; G.energy -= 15; G.today[h] = (G.today[h] || 0) + 2;
      Sound.sfx('heart'); G.slot++; closeModal(); hideHub(); hist = [];
      reg(Sys.startDate(G, h, b.dataset.k), '__date'); G.stack.push({ id: '__date', i: 0 }); step();
    });
  }
  function photoCard() {
    wait = 'card'; const ph = G.album && G.album[G.album.length - 1]; if (!ph) { later(10); return; }
    const c = $('#card'); c.className = 'on photo'; c.innerHTML = `<div class="photowrap">${Sys.photoHtml(ph, true)}<small>📷 Added to your Photo Album</small></div>`;
    flash('#fff'); Sound.sfx('shutter');
    later(3000, () => { c.className = ''; c.innerHTML = ''; later(200); });
  }
  function albumModal(list, meta0) {
    modal(`<h2>Photo Album</h2><p class="sub">${list.length} photo${list.length === 1 ? '' : 's'}${meta0 ? ' · every date you\'ve been on, across all playthroughs' : ''}</p><div class="album">${list.length ? list.map((ph, i) => `<button class="alb" data-i="${i}">${Sys.photoHtml(ph, false, true)}</button>`).join('') : '<p class="sub">No photos yet. Go on a date!</p>'}</div>`, { wide: 1 });
    Sys.fillLazy($('#modal'));
    $$('#modal .alb').forEach(b => b.onclick = () => { const v = $('#viewer'); v.innerHTML = `<div class="photowrap">${Sys.photoHtml(list[+b.dataset.i], true)}</div>`; v.className = 'on'; v.onclick = () => { v.className = ''; v.innerHTML = ''; }; });
  }
  function journalModal(tab) {
    const tabs = [['notes', '📓 Notes'], ['tells', '👁 Tells'], ['album', '📷 Album'], ['cases', '🗂 Case Files'], ['bonds', '💞 Pair Bonds']];
    let body = '';
    if (tab === 'notes') body = `<div class="jrnl">${(G.journal || []).slice().reverse().map(e => `<div><em>Day ${e.d}</em><p>${T(e.t)}</p></div>`).join('') || '<p class="sub">Nothing written yet.</p>'}</div>`;
    if (tab === 'tells') { const T0 = G.tells || {}, by = {}; Object.entries(T0).forEach(([k, t]) => { const [h, ...r] = k.split('_'); (by[h] = by[h] || []).push(t); }); body = `<div class="tells">${Object.keys(by).length ? Object.entries(by).map(([h, l]) => `<div class="tl" style="--c:${(WHO[h] || { c: '#fff' }).c}"><b>${(WHO[h] || { n: h }).n}</b>${l.map(t => `<p>${T(t)}</p>`).join('')}</div>`).join('') : '<p class="sub">You haven\'t noticed anything yet. Watch people. They give themselves away.</p>'}</div>`; }
    if (tab === 'album') body = `<div class="album">${(G.album || []).map((ph, i) => `<button class="alb" data-i="${i}">${Sys.photoHtml(ph, false, true)}</button>`).join('') || '<p class="sub">No photos yet. Go on a date!</p>'}</div>`;
    if (tab === 'cases') body = `<div class="cases">${Object.entries(Sys.NEMESES).map(([k, v]) => { const n = (G.nem || {})[k] || 0, seen = meta.codex['nem_' + k]; return `<div class="case ${n >= 3 ? 'closed' : ''}"><span>${seen ? v.icon : '❔'}</span><div><b>${seen ? v.n : '??? (Chapter ' + v.ch + '+)'}</b><small>${seen ? v.d : 'No sightings yet.'}</small><i>${'●'.repeat(n)}${'○'.repeat(3 - n)} ${n >= 3 ? 'CAPTURED' : ''}</i></div></div>`; }).join('')}
      ${Sys.CHAINS.map(c => `<div class="case ${(G.chains || {})[c.id] ? 'closed' : ''}"><span>🔗</span><div><b>${(G.chap || 0) >= c.ch ? c.n : '???'}</b><small>${c.steps.length}-part incident chain</small><i>${(G.chains || {})[c.id] ? 'SOLVED' : 'open'}</i></div></div>`).join('')}</div>`;
    if (tab === 'bonds') { const ps = Object.entries(G.pairs || {}).sort((a, b) => b[1] - a[1]); body = `<div class="pairs">${ps.length ? ps.map(([k, n]) => { const [a, b] = k.split('|'), l = Math.min(3, Math.floor(n / 3)); return `<div class="pair"><b style="color:${WHO[a].c}">${WHO[a].n}</b> & <b style="color:${WHO[b].c}">${WHO[b].n}</b><div class="bar"><i style="width:${Math.min(100, n / 9 * 100)}%"></i></div><small>Bond Lv ${l} · ${n} calls together${l ? ` · +${l * 3}% success` : ''}</small></div>`; }).join('') : '<p class="sub">Send heroes out together to build pair bonds.</p>'}</div>`; }
    modal(`<h2>Handler Notes</h2><div class="stabs">${tabs.map(([k, n]) => `<button class="dtab ${k === tab ? 'on' : ''}" data-t="${k}" style="--c:#ffd24a">${n}</button>`).join('')}</div>${body}`, { wide: 1 });
    $$('#modal .stabs .dtab').forEach(b => b.onclick = () => { Sound.sfx('page'); journalModal(b.dataset.t); }); Sys.fillLazy($('#modal'));
    $$('#modal .alb').forEach(b => b.onclick = () => { const v = $('#viewer'); v.innerHTML = `<div class="photowrap">${Sys.photoHtml(G.album[+b.dataset.i], true)}</div>`; v.className = 'on'; v.onclick = () => { v.className = ''; v.innerHTML = ''; }; });
  }

  // ---------- HQ upgrades / shop ----------
  function hqModal() {
    modal(`<h2>HALO HQ Upgrades</h2><p class="sub">Permanent upgrades for Squad Zero's floor. Wallet 💴 ${G.credits}</p><div class="hqg">${Object.entries(Sys.HQ).map(([k, u]) => { const l = Sys.hq(G, k), cost = Sys.HQCOST[l]; return `<div class="hqu ${l >= 3 ? 'max' : ''}"><div class="hqi">${u.icon}</div><div class="hqt"><b>${u.n}</b><div class="pips">${[0, 1, 2].map(i => `<i class="${i < l ? 'on' : ''}"></i>`).join('')}</div><small>${l ? u.d(l) : 'Not built'}</small>${l < 3 ? `<small class="nx">Next: ${u.d(l + 1)}</small>` : ''}</div>${l < 3 ? `<button class="btn buy" data-k="${k}" ${G.credits < cost ? 'disabled' : ''}>💴 ${cost}</button>` : '<em>MAX</em>'}</div>`; }).join('')}</div>`, { wide: 1 });
    $$('#modal .hqu .buy').forEach(b => b.onclick = () => {
      const k = b.dataset.k, l = Sys.hq(G, k), cost = Sys.HQCOST[l]; if (G.credits < cost) return;
      G.credits -= cost; G.hq = Object.assign(G.hq || {}, { [k]: l + 1 }); Sound.sfx('levelup'); flash('#9feaff'); unlock('hq1'); if (l + 1 >= 3) unlock('hqmax');
      toast(`🏗️ ${Sys.HQ[k].n} Lv ${l + 1}`, Sys.HQ[k].d(l + 1)); Sys.journal(G, `Upgraded the ${Sys.HQ[k].n} to level ${l + 1}.`);
      $('#hud').innerHTML = hudHtml(); hqModal();
    });
  }
  function shopModal(tab) {
    const tabs = `<div class="stabs"><button class="dtab ${tab === 'gifts' ? 'on' : ''}" data-t="gifts" style="--c:#ff5d9e">🎁 Gifts</button><button class="dtab ${tab === 'gear' ? 'on' : ''}" data-t="gear" style="--c:#52e0ff">🧰 Gear</button></div>`;
    const rows = tab === 'gifts' ? Object.entries(STORY.items).map(([k, it]) => `<div class="item"><div class="iic">${it.icon}</div><div class="itx"><b>${it.n}</b><small>${it.d}</small><small class="own">Owned: ${G.inv[k] || 0}</small></div><button class="btn buy" data-k="${k}" ${G.credits < it.p ? 'disabled' : ''}>💴 ${it.p}</button></div>`)
      : Object.entries(Sys.GEAR).filter(([, g]) => (G.chap || 0) >= (g.chap || 0)).map(([k, g]) => `<div class="item"><div class="iic">${g.icon}</div><div class="itx"><b>${g.n}</b><small>${g.d} · equip one per hero in the Dossier</small><small class="own">In storage: ${(G.gearInv || {})[k] || 0} · equipped: ${G.roster.filter(h => G.heroes[h].gear === k).length}</small></div><button class="btn buy" data-g="${k}" ${G.credits < g.p ? 'disabled' : ''}>💴 ${g.p}</button></div>`);
    modal(`<h2>HALO Supply Store</h2><p class="sub">Wallet: 💴 ${G.credits}</p>${tabs}<div class="shop">${rows.join('')}</div>`, { wide: 1 });
    $$('#modal .stabs .dtab').forEach(b => b.onclick = () => { Sound.sfx('page'); shopModal(b.dataset.t); });
    $$('#modal .buy[data-k]').forEach(b => b.onclick = () => { const it = STORY.items[b.dataset.k]; if (G.credits < it.p) return; G.credits -= it.p; G.inv[b.dataset.k] = (G.inv[b.dataset.k] || 0) + 1; G.bought++; if (G.bought >= 3) unlock('shopper'); Sound.sfx('coin'); $('#hud').innerHTML = hudHtml(); shopModal('gifts'); });
    $$('#modal .buy[data-g]').forEach(b => b.onclick = () => { const k = b.dataset.g, g = Sys.GEAR[k]; if (G.credits < g.p) return; G.credits -= g.p; G.gearInv = G.gearInv || {}; G.gearInv[k] = (G.gearInv[k] || 0) + 1; Sound.sfx('coin'); toast(`${g.icon} ${g.n}`, 'Equip it from a hero\'s Dossier.'); $('#hud').innerHTML = hudHtml(); shopModal('gear'); });
  }

  // ---------- training ----------
  function drill(h, stat) {
    if (stat === 'com' || stat === 'vig') return minigame(h, stat);
    const s = G.heroes[h];
    modal(`<h2>${DRILLS.find(d => d[0] === stat)[2]} · ${WHO[h].n}</h2><div id="mghost" class="mghost"></div>`, { noclose: 1, wide: 1 });
    const host = $('#mghost'), my = run;
    if (stat === 'mob') Sys.reflex(host, { n: 8, life: 1150 + s.st.mob * 40 + Sys.hq(G, 'gym') * 60 }, sc => my === run && trainResult(h, sc, stat));
    if (stat === 'int') Sys.breach(host, { len: 3, buf: 6 + (s.st.int >= 6 ? 1 : 0), time: 20000 + s.st.int * 900, autoP: .75 }, (ok, perfect) => { if (my !== run) return; if (perfect) unlock('breach'); trainResult(h, ok ? (perfect ? 9 : 7) : 2, stat); });
    if (stat === 'cha') Sys.rhythm(host, { track: 'idol', bars: 6, title: 'STAGE PRACTICE' }, res => { if (my !== run) return; if (res.grade === 'S') unlock('rhythm_s'); Sound.play(G.vis.music); trainResult(h, res.score, stat); });
  }
  function minigame(h, stat = 'com') {
    const s = G.heroes[h], zone = clamp(70 + s.st.int * 6 + s.st.mob * 4 - s.fat * .5 + Sys.hq(G, 'gym') * 15, 50, 220), W = 600;
    let round = 0, score = 0, pos = 0, dir = 1, speed = 5.2, running = true, zx = 0;
    const my = run;
    modal(`<h2>${stat === 'vig' ? 'Endurance' : 'Sparring'} · ${WHO[h].n}</h2><p class="sub">Press <kbd>SPACE</kbd> or click <b>STRIKE</b> when the needle is in the zone. 3 rounds. Intellect & Mobility widen the zone.</p>
      <div class="mg"><div class="mgport" style="--c:${WHO[h].c}">${Art.char(h, 'determined', 'fist', true)}</div>
      <div class="mgbar" id="mgbar"><div class="zone" id="zone"><div class="perf"></div></div><div class="needle" id="needle"></div></div>
      <div class="mgres" id="mgres">Round 1 / 3</div><div class="mgdots" id="mgdots"><i></i><i></i><i></i></div>
      <button class="btn primary big" id="strike">STRIKE!</button></div>`, { noclose: 1 });
    const place = () => { zx = 20 + Math.random() * (W - zone - 40); $('#zone').style.left = zx + 'px'; $('#zone').style.width = zone + 'px'; };
    place();
    const loop = () => {
      if (!running || my !== run || !$('#needle')) return;
      pos += dir * speed; if (pos > W - 4 || pos < 0) { dir *= -1; pos = clamp(pos, 0, W - 4); }
      $('#needle').style.left = pos + 'px'; requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const hit = () => {
      if (!running) return;
      const c = zx + zone / 2, dd = Math.abs(pos - c);
      let r = dd < 10 ? 3 : dd < zone / 2 ? 2 : 0;
      score += r; const t = ['MISS', '', 'GOOD!', 'PERFECT!!'][r];
      const res = $('#mgres'); res.textContent = t; res.className = 'mgres pop r' + r; $('#mgdots').children[round].className = 'r' + r;
      Sound.sfx(r === 3 ? 'perfect' : r ? 'punch' : 'miss'); if (r === 3) { unlock('perfect'); flash('#fff6a0'); } if (r) shake(3);
      round++; speed += 1.6;
      if (round >= 3) { running = false; document.removeEventListener('keydown', key, true); setTimeout(() => trainResult(h, score, stat), 700); }
      else setTimeout(() => { place(); }, 250);
    };
    const key = e => { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); hit(); } };
    document.addEventListener('keydown', key, true);
    $('#strike').onclick = hit;
  }
  function trainResult(h, score, stat) {
    const s = G.heroes[h], xp = Math.round((20 + score * 8) * (1 + Sys.hq(G, 'gym') * .25)), before = s.xp, lvl0 = s.lvl;
    s.fat = clamp(s.fat + 15, 0, 100); G.energy -= 20; G.trains++; if (G.trains >= 5) unlock('coach');
    const ups = giveXP(h, xp), line = STORY.trainQuip(h, score), need = s.lvl * 40 + 40;
    const gain = stat && score >= 7 && s.st[stat] < 10 && Math.random() < .4; if (gain) { s.st[stat]++; if (s.st[stat] >= 10) unlock('stat10'); }
    Sound.sfx(score >= 6 ? 'levelup' : 'confirm');
    modal(`<div class="result ok"><div class="stamp small">TRAINING COMPLETE</div><div class="statup"><label>Experience · Lv ${lvl0}${ups ? ` → ${s.lvl}` : ''}</label><div class="bar big"><i style="width:${ups ? 0 : before / need * 100}%"></i><i class="gain" style="left:${ups ? 0 : before / need * 100}%;width:0"></i></div><b>+${xp} XP ${ups ? '<em>LEVEL UP! +1 SP</em>' : ''}${gain ? `<em>${Dispatch.SI[stat]} ${Dispatch.SN[stat]} +1!</em>` : ''}</b></div>
      <div class="quip" style="--c:${WHO[h].c}"><div class="qp">${Art.char(h, score >= 6 ? 'happy' : score >= 3 ? 'smile' : 'pout', 'default', true)}</div><p><b>${WHO[h].n}</b>${T(line)}</p></div>
      <button class="btn primary" id="rok">Continue</button></div>`, { noclose: 1 });
    setTimeout(() => { const g = $('#modal .gain'); if (g) g.style.width = Math.min(100, s.xp / need * 100 - (ups ? 0 : before / need * 100)) + '%'; }, 100);
    addAff(h, score >= 6 ? 2 : 1);
    Sys.journal(G, `Trained ${WHO[h].n} (${Dispatch.SN[stat || 'com']}).${gain ? ' Stat up!' : ''}`);
    $('#rok').onclick = () => { Sound.sfx('confirm'); useSlot(); };
  }
  function rhythmOp(cfg) {
    wait = 'modal'; const my = run;
    modal(`<h2>${cfg.title || 'Live Stage'}</h2>${cfg.sub ? `<p class="sub">${T(cfg.sub)}</p>` : ''}<div id="mghost" class="mghost"></div>`, { noclose: 1, wide: 1, cls: 'stage' });
    G.vis.music = cfg.track || 'idol';
    Sys.rhythm($('#mghost'), { track: cfg.track || 'idol', bars: cfg.bars || 10, title: cfg.title }, res => {
      if (my !== run) return; const f = cfg.flag || 'rhythm'; G.flags[f] = res.grade; G.flags[f + '_score'] = res.score; if (res.grade === 'S') unlock('rhythm_s');
      closeModal(); toast(`🎤 Grade ${res.grade}`, `${Math.round(res.acc * 100)}% accuracy · max combo ${res.combo}`); advance();
    });
  }
  function fightCtx(onDone) {
    return {
      G, WHO, T, unlock, host: $('#fighthost'), sfx: n => Sound.sfx(n), music: m => { G.vis.music = m; Sound.play(m); }, shake: n => shake(n), xp: (id, n) => giveXP(id, n),
      art: { warm: id => { if (window.PIXEL_ON !== false && typeof PixelCast !== 'undefined') ['smile', 'scared', 'sad'].forEach(e => PixelCast.prewarm(id, e, 'default', 'hero')); }, bg: n => Art.bg(n), char: (id, emo, pose, port) => Art.char(id, emo, pose, port), monster: kind => (window.PIXEL_ON !== false && typeof PixelMon !== 'undefined') ? PixelMon.monSprite(kind) : Art.monster(kind === 'leviathan' || kind === 'glazier') },
      onDone
    };
  }
  function fightOp(cfg) {
    wait = 'modal'; const my = run; $('#textbox').classList.add('hide'); Object.keys(G.vis.chars).forEach(hideChar); autosave();
    const prevMusic = G.vis.music;
    modal('<div id="fighthost"></div>', { noclose: 1, wide: 1, cls: 'fightwrap' });
    Fight.start(cfg, fightCtx(res => {
      if (my !== run) return; const id = cfg.id || cfg.foe; G.flags['f_' + id] = res.win ? 'win' : 'lose'; G.flags['f_' + id + '_clean'] = res.clean ? 1 : 0; G.flags['f_' + id + '_reads'] = res.reads; (res.readKeys || []).forEach(k => { G.flags['f_' + id + '_r_' + k] = 1; });
      G.foeSeen = G.foeSeen || {}; G.foeSeen[cfg.foe] = 1;
      meta.stats.fights = (meta.stats.fights || 0) + 1; if (res.win) { unlock('fight_win'); if (res.clean) unlock('fight_clean'); } if (res.parries >= 3) unlock('fight_parry');
      if (Object.keys(G.readsUsed || {}).length >= 4) unlock('fight_reads');
      if (!res.win) G.morale = clamp((G.morale === undefined ? 60 : G.morale) - 8, 0, 100);
      saveMeta(); closeModal(); if (prevMusic) { G.vis.music = prevMusic; Sound.play(prevMusic); } hist = []; advance();
    }));
  }
  // Sim Room: rematch any foe you have already fought, for XP and credits (no story flags)
  function simRoom() {
    const foes = Object.keys(G.foeSeen || {}).filter(k => Fight.FOES[k]);
    if (!foes.length) { toast('Sim Room', 'Fight something for real first.'); return; }
    let foe = foes[0], team = G.roster.slice(0, 3);
    const draw = () => {
      const ft = Fight.FOES[foe];
      modal(`<h2>Sim Room</h2><p class="sub">A Standoff against a foe you have already met. Costs 25 energy. Wins pay XP and credits; nothing here changes the story.</p>
        <div class="simfoes">${foes.map(k => `<button class="simf ${k === foe ? 'on' : ''}" data-f="${k}"><b>${Fight.FOES[k].n}</b><small>Tier ${Fight.FOES[k].tier}</small></button>`).join('')}</div>
        <h4>Team (2–5)</h4><div class="simteam">${G.roster.filter(h => Fight.KIT[h]).map(h => `<button class="simh ${team.includes(h) ? 'on' : ''}" data-h="${h}" style="--c:${WHO[h].c}"><div class="pp">${Art.char(h, 'smile', 'default', true)}</div><b>${WHO[h].n}</b><small>Lv ${G.heroes[h].lvl}</small></button>`).join('')}</div>
        <div class="row"><button class="btn" id="simx">Back</button><button class="btn primary" id="simgo" ${team.length < 2 || G.energy < 25 ? 'disabled' : ''}>${G.energy < 25 ? 'Too tired' : 'Start ▸'}</button></div>`, { wide: 1 });
      $$('#modal .simf').forEach(b => b.onclick = () => { foe = b.dataset.f; Sound.sfx('click'); draw(); });
      $$('#modal .simh').forEach(b => b.onclick = () => { const h = b.dataset.h; team = team.includes(h) ? team.filter(x => x !== h) : team.length < 5 ? team.concat(h) : team; Sound.sfx('click'); draw(); });
      $('#simx').onclick = () => { Sound.sfx('cancel'); closeModal(); };
      $('#simgo').onclick = () => {
        Sound.sfx('confirm'); G.energy -= 25; const my = run, prev = G.vis.music;
        modal('<div id="fighthost"></div>', { noclose: 1, wide: 1, cls: 'fightwrap' });
        Fight.start({ id: 'sim', foe, team, title: 'Sim Room', sub: ft.n, bg: 'training', music: 'boss', sim: 1, xpMul: .5, noPress: 1, loseText: 'The sim shuts down. Mira is already writing up what went wrong.' }, fightCtx(res => {
          if (my !== run) return; closeModal(); if (prev) { G.vis.music = prev; Sound.play(prev); }
          if (res.win) { const c = 40 * ft.tier; G.credits += c; G.morale = clamp((G.morale || 60) + 3, 0, 100); toast('🎯 Sim cleared', `+💴${c} · morale +3`); }
          team.forEach(h => { G.heroes[h].fat = clamp(G.heroes[h].fat + 10, 0, 100); });
          Sys.journal(G, `Sim Room: ${ft.n}, ${res.win ? 'cleared' : 'failed'}.`); useSlot(0);
        }));
      };
    };
    draw();
  }
  function breachOp(cfg) {
    wait = 'modal'; const my = run;
    modal(`<h2>${cfg.title || 'Breach'}</h2>${cfg.sub ? `<p class="sub">${T(cfg.sub)}</p>` : ''}<div id="mghost" class="mghost"></div>`, { noclose: 1, wide: 1 });
    Sys.breach($('#mghost'), { len: cfg.len || 4, buf: cfg.buf || 7, time: cfg.time || 26000, autoP: .8 }, (ok, perfect) => {
      if (my !== run) return; G.flags[cfg.flag || 'breach'] = ok ? 1 : -1; if (perfect) unlock('breach'); closeModal(); advance();
    });
  }

  function dossier(sel) {
    const list = MET(), P = STORY.profiles[sel] || { full: WHO[sel].n, tag: '', rows: [], bio: '', likes: '???' }, s = G.heroes[sel] && G.roster.includes(sel) ? G.heroes[sel] : null, ST = Dispatch.ST;
    const perkBox = s && Sys.PERKS[sel] ? `<div class="perks"><h4>Perks</h4>${Sys.PERKS[sel].map((pair, i) => { const got = s.perks[i], due = Sys.perkDue(G, sel) === i;
      return `<div class="prow ${got ? 'got' : due ? 'due' : 'locked'}"><em>Lv ${Sys.PERK_LV[i]}</em>${got ? (p => `<div class="pk on"><b>${p.n}</b><small>${p.d}</small></div>`)(Sys.findPerk(sel, got)) : pair.map(p => `<button class="pk ${due ? 'pick' : ''}" data-p="${p.id}" ${due ? '' : 'disabled'}><b>${p.n}</b><small>${p.d}</small></button>`).join('<span class="or">or</span>')}</div>`; }).join('')}</div>` : '';
    const gearInv = Object.entries(G.gearInv || {}).filter(([, n]) => n > 0);
    const gearBox = s ? `<div class="gearb"><h4>Gear</h4><div class="gcur">${s.gear ? `<span>${Sys.GEAR[s.gear].icon} <b>${Sys.GEAR[s.gear].n}</b> <small>${Sys.GEAR[s.gear].d}</small></span><button class="btn gun">Unequip</button>` : '<small>Nothing equipped.</small>'}</div>${gearInv.length ? `<div class="ginv">${gearInv.map(([k, n]) => `<button class="btn geq" data-g="${k}">${Sys.GEAR[k].icon} ${Sys.GEAR[k].n} ×${n}</button>`).join('')}</div>` : '<small class="dim">Buy gear in the Shop.</small>'}</div>` : '';
    const radar = s ? (() => {
      const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [100 + Math.cos(a) * r, 100 + Math.sin(a) * r]; };
      const pts = ST.map((k, i) => pt(i, s.st[k] / 10 * 78).join(',')).join(' ');
      return `<svg viewBox="-20 -4 240 212" class="radar">${[.25, .5, .75, 1].map(f => `<polygon points="${ST.map((k, i) => pt(i, 78 * f).join(',')).join(' ')}" fill="none" stroke="#ffffff22"/>`).join('')}
        <polygon points="${pts}" fill="${WHO[sel].c}55" stroke="${WHO[sel].c}" stroke-width="2" class="radarpoly"/>${ST.map((k, i) => { const [x, y] = pt(i, 96); return `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="15">${Dispatch.SI[k]}</text>`; }).join('')}</svg>
        <div class="lvl">Lv <b>${s.lvl}</b> <small>XP ${s.xp}/${s.lvl * 40 + 40}</small>${s.sp ? `<em class="spb">${s.sp} SP</em>` : ''}</div>
        <div class="skills">${ST.map(k => `<div class="sk"><span>${Dispatch.SI[k]} ${Dispatch.SN[k]}</span><div class="skb"><i style="width:${s.st[k] * 10}%"></i></div><b>${s.st[k]}</b>${s.sp && s.st[k] < 10 ? `<button class="spp" data-k="${k}">+</button>` : ''}</div>`).join('')}</div>
        <div class="fatm">Fatigue <div class="bar"><i style="width:${s.fat}%;background:#ff6b6b"></i></div></div>`;
    })() : `<div class="mirastat">${P.role || 'Support'}<br><small>${P.roleNote || 'Not deployable'}</small></div>`;
    const inv = Object.entries(G.inv).filter(([, n]) => n > 0), bp = [G.aff[sel] >= 12 ? '🤝 <b>Trust</b>: +1 to best stat on calls' : '🔒 Trust at ♥12', G.aff[sel] >= 22 ? '♥ <b>Heartline</b>: +5% success on calls' : '🔒 Heartline at ♥22'];
    modal(`<div class="dossier"><div class="dtabs">${list.map(h => `<button class="dtab ${h === sel ? 'on' : ''}" data-h="${h}" style="--c:${WHO[h].c}">${WHO[h].n}${G.roster.includes(h) && (Sys.perkDue(G, h) >= 0 || G.heroes[h].sp) ? ' <i class="dot"></i>' : ''}</button>`).join('')}</div>
      <div class="dbody"><div class="dport" style="--c:${WHO[sel].c}">${Art.char(sel, 'smile', 'hip')}</div>
      <div class="dsinfo"><h2 style="color:${WHO[sel].c}">${P.full}</h2><div class="dtag">${P.tag} ${moodTag(sel)}</div><table>${P.rows.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table><p>${P.bio}</p>
      <div class="aff">${heart(G.aff[sel])} <b>${tier(G.aff[sel])}</b> <small>(♥ ${G.aff[sel]})</small></div>${s ? `<div class="bperks">${bp.map(x => `<small>${x}</small>`).join('')}</div>` : ''}<div class="likes">Likes: ${G.aff[sel] >= 4 ? P.likes : '??? — get closer to find out'}</div>
      <div class="gifts"><h4>Give a Gift ${G.gifted[sel] ? '<small>(already gifted today)</small>' : G.bday === sel ? '<small>🎂 Birthday! Double effect</small>' : ''}</h4>${inv.length ? inv.map(([k, n]) => `<button class="btn gift" data-k="${k}" ${G.gifted[sel] ? 'disabled' : ''}>${STORY.items[k].icon} ${STORY.items[k].n} ×${n}</button>`).join('') : '<small>Inventory empty — visit the Shop.</small>'}</div>${perkBox}${gearBox}</div>
      <div class="dradar">${radar}</div></div></div>`, { wide: 1 });
    $$('#modal .dtab').forEach(b => b.onclick = () => { Sound.sfx('page'); dossier(b.dataset.h); });
    $$('#modal .spp').forEach(b => b.onclick = () => { s.st[b.dataset.k]++; s.sp--; if (s.st[b.dataset.k] >= 10) unlock('stat10'); Sound.sfx('levelup'); dossier(sel); });
    $$('#modal .pk.pick').forEach(b => b.onclick = () => { s.perks.push(b.dataset.p); Sound.sfx('levelup'); flash('#fff6a0'); unlock('perk'); const p = Sys.findPerk(sel, b.dataset.p); toast(`✨ ${WHO[sel].n} learned ${p.n}`, p.d); Sys.journal(G, `${WHO[sel].n} learned the ${p.n} perk.`); dossier(sel); });
    $$('#modal .geq').forEach(b => b.onclick = () => { const k = b.dataset.g; if (s.gear) G.gearInv[s.gear] = (G.gearInv[s.gear] || 0) + 1; G.gearInv[k]--; s.gear = k; Sound.sfx('confirm'); if (G.roster.filter(h => G.heroes[h].gear).length >= 4) unlock('gear'); dossier(sel); });
    $$('#modal .gun').forEach(b => b.onclick = () => { G.gearInv[s.gear] = (G.gearInv[s.gear] || 0) + 1; s.gear = null; Sound.sfx('cancel'); dossier(sel); });
    $$('#modal .gift').forEach(b => b.onclick = () => {
      const k = b.dataset.k, it = STORY.items[k]; G.inv[k]--; G.gifted[sel] = 1;
      let lv = it.love === sel ? 4 : (it.like || []).includes(sel) ? 2 : 1; if (lv === 4) unlock('gift'); meta.stats.gifts++;
      if (G.bday === sel) { lv *= 2; unlock('birthday'); }
      const line = STORY.giftLine(sel, Math.min(lv, 4));
      dossier(sel); addAff(sel, lv);
      const q = document.createElement('div'); q.className = 'giftq'; q.style.setProperty('--c', WHO[sel].c); q.innerHTML = `<div class="qp">${Art.char(sel, lv >= 4 ? 'love' : lv === 2 ? 'happy' : 'smile', 'default', true)}</div><p><b>${WHO[sel].n}</b>${T(line)}${G.bday === sel ? ' 🎂' : ''}</p>`;
      $('#modal .panel').appendChild(q);
    });
  }

  // ---------- dispatch shift ----------
  function startShift(cfg) {
    wait = 'shift'; hideHub(); $('#textbox').classList.add('hide'); Object.keys(G.vis.chars).forEach(hideChar); autosave();
    const my = run;
    Dispatch.start(cfg, {
      G, WHO, T, toast, unlock, sfx: n => Sound.sfx(n), music: m => { G.vis.music = m; Sound.play(m); },
      calls: STORY.calls, events: STORY.callEvents, quips: STORY.quips, synergy: (a, b) => STORY.synergy(G, a, b), items: STORY.items, codex: codexUnlock, journal: t => Sys.journal(G, t),
      portrait: id => Art.char(id, G.heroes[id] && G.heroes[id].hurt ? 'sad' : 'smile', 'default', true), bit: Art.char('bit', 'happy', '', true),
      onDone: res => { if (my !== run) return; $$('#toasts .toast:not(.ach)').forEach(t => t.remove()); G.last = res; meta.stats.shifts++; meta.stats.calls += res.ok; meta.stats.saved = (meta.stats.saved || 0) + (res.saved || 0); if (res.grade === 'S') meta.stats.sranks++; saveMeta(); hist = []; setBg('hq_lobby', 'cut'); later(200); }
    });
  }

  // ---------- phone / night ----------
  function phone(who, convo, isNight) {
    wait = 'modal'; Sound.sfx('phone');
    const info = WHO[who];
    modal(`<div class="phone"><div class="phead"><div class="pav" style="background:${info.c}">${Art.char(who, 'smile', 'default', true)}</div><div><b>${info.n}</b><small>online</small></div></div><div class="pbody" id="pbody"></div><div class="preply" id="preply"></div></div>`, { noclose: 1, cls: 'phonewrap' });
    const body = $('#pbody'), my = run;
    const add = (t, mine) => { const d = document.createElement('div'); d.className = 'bub ' + (mine ? 'me' : 'them'); d.innerHTML = T(t); body.appendChild(d); body.scrollTop = 1e4; Sound.sfx('msg'); };
    const typingDots = () => { const d = document.createElement('div'); d.className = 'bub them dots'; d.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(d); body.scrollTop = 1e4; return d; };
    const seq = async (msgs) => { for (const m of msgs) { if (my !== run) return; const d = typingDots(); await sleep(skipping() ? 60 : 500 + m.length * 18); d.remove(); add(m); } };
    const finish = () => { const pr = $('#preply'); if (!pr) return; pr.innerHTML = '<button class="btn primary" id="pdone">Close Phone</button>'; $('#pdone').onclick = () => { closeModal(); Sound.sfx('cancel'); if (isNight) sleepThen(); else advance(); }; };
    (async () => {
      await seq(convo.msgs);
      if (!convo.replies) return finish();
      const pr = $('#preply'); if (!pr) return;
      const reps = convo.replies.filter(r => !r.read || (G.tells && G.tells[r.read]));
      pr.innerHTML = reps.map((r, i) => `<button class="btn reply" data-i="${i}">${r.read ? '📓 ' : ''}${T(r.t)}</button>`).join('');
      $$('#preply .reply').forEach(b => b.onclick = async () => {
        const r = reps[+b.dataset.i]; pr.innerHTML = ''; add(r.t, true); G.replies++; if (G.replies >= 3) unlock('night');
        if (r.aff) addAff(who, r.aff); await sleep(400); await seq(r.resp || []); finish();
      });
    })();
  }
  function night() {
    wait = 'modal'; hideHub(); setBg(G.flags.rogue && !G.flags.restored && G.flags.hubbg || 'apartment'); setTint('night'); Sound.play('night'); G.vis.music = 'night';
    Object.keys(G.vis.chars).forEach(hideChar);
    const cand = HERE().sort((a, b) => ((G.today[b] || 0) * 3 + G.aff[b]) - ((G.today[a] || 0) * 3 + G.aff[a]));
    const who = cand[0] || 'hikari', seen = (G.textSeen = G.textSeen || {})[who] = G.textSeen[who] || [], L = STORY.phone[who] || [];
    const i = L.findIndex((c, j) => !seen.includes(j) && (!c.ch || (G.chap || 0) >= c.ch) && (!c.until || (G.chap || 0) <= c.until));
    const convo = i >= 0 ? L[i] : STORY.phoneFallback(who, G); if (i >= 0) seen.push(i); G.texts[who] = (G.texts[who] || 0) + 1;
    setTimeout(() => phone(who, convo, true), skipping() ? 50 : 900);
  }
  function sleepThen() {
    const c = $('#card'); c.className = 'on sleep'; c.innerHTML = `<div class="zzzbig">Z<span>z</span><span>z</span></div>`; Sound.sfx('snore');
    later(1800, () => { c.className = ''; advance(); });
  }
  function nextDay() {
    G.day++; G.slot = 0; G.energy = 100; G.gifted = {}; G.today = {};
    Object.values(G.heroes).forEach(s => { s.fat = clamp(s.fat - 65, 0, 100); s.hurt = 0; });
    Sys.dayStart(G);
    setTint(null);
  }

  // ---------- save / load ----------
  const SLOTKEYS = ['a', 'q', ...Array.from({ length: 18 }, (_, i) => i + 1)];
  function snapshot(desc) { return { G: JSON.parse(JSON.stringify(G)), t: Date.now(), desc: desc || describe(), bg: G.vis.bg, chars: Object.entries(G.vis.chars).slice(0, 3).map(([id, s]) => [(WHO[id] && WHO[id].art) || id, s.emo, s.of || G.vis.of || 'hero']) }; }
  function describe() { const f = top(); const ch = G.chapT || 'Prologue'; return G.slot !== undefined && f && R[f.id] && R[f.id][f.i] && R[f.id][f.i][0] === 'hub' ? `${ch} · Day ${G.day} · ${SLOTS[G.slot] || 'Night'}` : `${ch} · Day ${G.day}` + (log.length ? ` — “${log[log.length - 1].t.slice(0, 40)}…”` : ''); }
  const canSave = () => G && !G.replay && ['text', 'choice', 'hub'].includes(wait) && !modalOpen() && !Dispatch.active;
  function saveTo(k, silent) { if (!G) return; LS.set('hl2_save_' + k, snapshot()); if (!silent) { toast('💾 Saved', k === 'q' ? 'Quick save' : 'Slot ' + k); Sound.sfx('confirm'); } }
  function autosave() { if (G && !G.replay) { LS.set('hl2_save_a', snapshot()); const ic = $('#asave'); if (ic) { ic.classList.remove('go'); void ic.offsetWidth; ic.classList.add('go'); } } }
  function loadState(d) {
    run++; closeModal(); hideTitle(); clearInterval(typeTimer); typing = false; auto = skip = false; updateQuick(); hist = [];
    G = migrate(Object.assign(newState(), d.G)); $('#choices').className = ''; $('#card').className = ''; hideHub(); $('#textbox').classList.add('hide');
    Sound.init(); restoreVis(); wait = null; step();
  }
  function migrate(g) {
    const n = newState();
    Object.entries(n.heroes).forEach(([k, h]) => { if (!g.heroes[k]) g.heroes[k] = h; g.heroes[k].perks = g.heroes[k].perks || []; if (g.heroes[k].gear === undefined) g.heroes[k].gear = null; });
    Object.keys(n.aff).forEach(k => { if (g.aff[k] === undefined) g.aff[k] = 0; });
    if (g.date && g.stack.some(f => f.id.startsWith('__date'))) reg(Sys.buildDate(g.date, g), '__date');
    if (!g.textSeen) { g.textSeen = {}; Object.entries(g.texts || {}).forEach(([w, n]) => { g.textSeen[w] = [...Array(n).keys()]; }); }
    return g;
  }
  function loadFrom(k) { const d = LS.get('hl2_save_' + k); if (!d) return false; loadState(d); toast('📂 Loaded', d.desc); return true; }
  function slotsModal(mode, page = 0) {
    const keys = page === 0 ? SLOTKEYS.slice(0, 8) : SLOTKEYS.slice(2 + page * 6, 8 + page * 6);
    const thumb = d => d ? Art.bg(d.bg) + (d.chars || []).map(([id, emo, of], i) => `<div class="stc" style="left:${10 + i * 32}%">${Art.char(id, emo, 'default', true, of)}</div>`).join('') : '';
    modal(`<h2>${mode === 'save' ? 'Save Game' : 'Load Game'}</h2><div class="stabs">${[0, 1, 2].map(p => `<button class="dtab ${p === page ? 'on' : ''}" data-p="${p}" style="--c:#ff5d9e">Page ${p + 1}</button>`).join('')}</div><div class="slots">${keys.map(k => {
      const d = LS.get('hl2_save_' + k), lock = mode === 'save' && (k === 'a');
      return `<button class="slot ${d ? '' : 'empty'} ${lock ? 'lock' : ''}" data-k="${k}"><div class="sthumb">${thumb(d)}</div><div class="stxt"><b>${k === 'a' ? 'AUTO' : k === 'q' ? 'QUICK' : 'SLOT ' + k}</b><small>${d ? d.desc : '— empty —'}</small><small>${d ? new Date(d.t).toLocaleString() : ''}</small></div>${d && mode === 'save' && k !== 'a' ? `<i class="sdel" data-k="${k}" title="Delete">✕</i>` : ''}</button>`;
    }).join('')}</div>`, { wide: 1 });
    $$('#modal .stabs .dtab').forEach(b => b.onclick = () => { Sound.sfx('page'); slotsModal(mode, +b.dataset.p); });
    $$('#modal .sdel').forEach(b => b.onclick = e => { e.stopPropagation(); try { localStorage.removeItem('hl2_save_' + b.dataset.k); } catch (x) { } Sound.sfx('cancel'); slotsModal(mode, page); });
    $$('#modal .slot').forEach(b => b.onclick = () => {
      const k = b.dataset.k;
      if (mode === 'save') { if (k === 'a') return Sound.sfx('fail'); saveTo(k); slotsModal('save', page); }
      else if (!loadFrom(k)) Sound.sfx('fail');
    });
  }

  // ---------- rollback & read tracking ----------
  function mark() {
    const f = top(); if (!f) return; const key = f.id + ':' + f.i;
    lastUnread = !readSet[key]; if (lastUnread) { readSet[key] = 1; if (++readDirty > 25) { LS.set('hl2_read', readSet); readDirty = 0; } }
    if (!G.replay) { hist.push(JSON.stringify(G)); if (hist.length > 80) hist.shift(); }
    meta.stats.lines++;
  }
  function rollback() {
    if (!G || G.replay || !['text', 'choice'].includes(wait) || modalOpen()) return;
    if (wait === 'text' && hist.length) hist.pop();
    const prev = hist.pop(); if (!prev) { toast('⏪ Can\'t go back further'); return; }
    run++; clearInterval(typeTimer); typing = false; auto = false; skip = false; updateQuick();
    $('#choices').className = ''; $('#choices').innerHTML = ''; $('#game').classList.remove('eyemode');
    G = JSON.parse(prev); log.splice(-2, 2); Sound.sfx('swoosh'); restoreVis(); wait = null; step();
  }

  // ---------- chapter recap ----------
  function recap() {
    wait = 'modal'; const cs = G.chapStart || { aff: {}, shifts: 0, calls: 0, t: 0, credits: G.credits };
    const sh = G.shifts.slice(cs.shifts), newAch = Object.entries(meta.ach).filter(([, t]) => t >= cs.t).map(([k]) => ACH[k] ? ACH[k][0] : k);
    const bonds = MET().filter(h => h !== 'tetsu').map(h => { const d = G.aff[h] - (cs.aff[h] || 0); return `<div class="rcb" style="--c:${WHO[h].c}"><b>${WHO[h].n}</b><div class="bar"><i style="width:${clamp(G.aff[h] / 40 * 100, 0, 100)}%;background:${WHO[h].c}"></i></div><em>${d >= 0 ? '+' : ''}${d} ♥</em></div>`; }).join('');
    modal(`<div class="recap"><div class="rch"><small>${(G.chapT || '').split(' · ')[0]} · COMPLETE</small>${(G.chapT || '').split(' · ').slice(1).join(' · ') || G.chapT}</div><div class="rcgrid"><div><h4>Dispatch</h4>${sh.length ? sh.map((x, i) => `<span class="rcg g${x.grade}">${x.grade}</span>`).join('') : '<small>No shifts</small>'}<p>${G.calls - (cs.calls || 0)} calls resolved · 💴 ${G.credits - (cs.credits || 0) >= 0 ? '+' : ''}${G.credits - (cs.credits || 0)}</p></div>
      <div><h4>Bonds</h4>${bonds}</div><div><h4>Achievements</h4>${newAch.length ? newAch.map(a => `<small>🏆 ${a}</small>`).join('') : '<small>—</small>'}</div></div><button class="btn primary" id="rcok">Continue ▸</button></div>`, { noclose: 1, wide: 1 });
    Sound.sfx('levelup'); $('#rcok').onclick = () => { closeModal(); Sound.sfx('confirm'); advance(); };
  }

  // ---------- menus ----------
  function settingsModal() {
    const sl = (k, l, min, max, stp) => `<label class="set"><span>${l}</span><input type="range" min="${min}" max="${max}" step="${stp}" data-k="${k}" value="${settings[k]}"><em>${settings[k]}</em></label>`;
    const tg = (k, l) => `<label class="set tg"><span>${l}</span><button class="tog ${settings[k] ? 'on' : ''}" data-k="${k}"><i></i></button></label>`;
    modal(`<h2>Settings</h2><div class="sets two"><div>${sl('textSpeed', 'Text Speed (120 = instant)', 10, 120, 5)}${sl('autoDelay', 'Auto-Advance Delay (s)', .5, 4, .1)}${sl('textSize', 'Text Size', 18, 30, 1)}${sl('boxAlpha', 'Textbox Opacity', .3, 1, .05)}${sl('music', 'Music Volume', 0, 1, .05)}${sl('sfx', 'SFX Volume', 0, 1, .05)}</div>
      <div>${tg('voice', 'Voice Blips')}${tg('hints', 'Affection Hints on Choices')}${tg('motion', 'Screen Shake & Flashes')}${tg('parallax', 'Mouse Parallax')}${tg('skipUnread', 'Skip Unread Text')}${tg('pixel', 'Pixel-Art Graphics')}${tg('pixelSmooth', 'Smooth Pixels (Scale2x)')}${tg('wheelBack', 'Mouse Wheel Up = Rollback')}</div></div>
      <div class="row"><button class="btn" id="fs">⛶ Toggle Fullscreen</button><button class="btn" id="keys">⌨ Controls</button></div>`, { wide: 1 });
    $$('#modal input[type=range]').forEach(r => r.oninput = () => { settings[r.dataset.k] = +r.value; r.nextElementSibling.textContent = r.value; applySettings(); saveSettings(); });
    $$('#modal .tog').forEach(b => b.onclick = () => { settings[b.dataset.k] = !settings[b.dataset.k]; b.classList.toggle('on'); applySettings(); saveSettings(); Sound.sfx('click'); if (/^pixel/.test(b.dataset.k) && G && G.vis && G.vis.bg) restoreVis(); if (!settings.parallax) { $('#game').style.setProperty('--px', 0); $('#game').style.setProperty('--py', 0); } });
    $('#fs').onclick = () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => { }); };
    $('#keys').onclick = () => modal(`<h2>Controls</h2><div class="log">${[['Click / Space / Enter', 'Advance'], ['Wheel up / Backspace', 'Rollback one line'], ['Ctrl (hold) / S', 'Skip'], ['A', 'Auto'], ['H', 'Hide UI'], ['L', 'Backlog'], ['1-4', 'Choose'], ['F5 / F9', 'Quick save / load'], ['Esc', 'Menu'], ['Dispatch: Space', 'Pause shift'], ['Gamepad A / B / X / Y / Start', 'Advance / Back / Auto / Log / Menu'], ['Touch: swipe up / down / long-press', 'Log / Rollback / Hide UI']].map(([k, v]) => `<div class="ll"><b>${k}</b><p>${v}</p></div>`).join('')}</div>`, { small: 1 });
  }
  function logModal() {
    unlock('log');
    modal(`<h2>Backlog</h2><div class="log" id="logb">${log.map(l => `<div class="ll"><b style="color:${l.c}">${l.n}</b><p>${l.t}</p></div>`).join('') || '<p class="sub">Nothing yet.</p>'}</div>`, { wide: 1 });
    const b = $('#logb'); b.scrollTop = b.scrollHeight;
  }
  function viewCg(k) {
    const v = $('#viewer'); v.innerHTML = Art.cg(k) + `<div class="vcap">${Art.CG_NAMES[k]} — click to close</div>`; v.className = 'on'; Sound.sfx('confirm');
    v.onclick = () => { v.className = ''; v.innerHTML = ''; };
  }
  function galleryModal() {
    modal(`<h2>CG Gallery</h2><p class="sub">${Object.keys(meta.gallery).length} / ${Object.keys(Art.CG_NAMES).length} unlocked</p><div class="gallery">${Object.entries(Art.CG_NAMES).map(([k, n]) => `<button class="gthumb ${meta.gallery[k] ? '' : 'locked'}" data-k="${k}"><div class="gimg" data-k="${meta.gallery[k] ? k : ''}">${meta.gallery[k] ? '' : '<span>🔒</span>'}</div><small>${meta.gallery[k] ? n : '???'}</small></button>`).join('')}</div>`, { wide: 1 });
    $$('#modal .gthumb').forEach(b => b.onclick = () => { if (b.classList.contains('locked')) return Sound.sfx('fail'); viewCg(b.dataset.k); });
    const todo = $$('#modal .gimg').filter(g => g.dataset.k), fill = () => { const g = todo.shift(); if (!g || !g.isConnected) return; g.innerHTML = Art.cg(g.dataset.k); setTimeout(fill, 30); }; fill();
  }
  const sceneTitle = k => STORY.sceneNames && STORY.sceneNames[k] || k.replace(/^hang_(\w+)_(\d|x)$/, (m, w, n) => `${(WHO[w] || { n: w }).n} · Hang Out ${n === 'x' ? '(extra)' : n}`).replace(/^date_(\w+)_(\w+)$/, (m, w, l) => `${(WHO[w] || { n: w }).n} · Date: ${l}`).replace(/^(eve|fin|save)_(\w+)$/, (m, a, w) => `${(WHO[w] || { n: 'Squad' }).n} · ${{ eve: 'The Night Before', fin: 'Ending', save: 'Into the Light' }[a]}`).replace(/^ev_/, 'Event: ').replace(/_/g, ' ');
  function scenesModal() {
    const keys = Object.keys(STORY.scripts).filter(k => /^(hang_|date_|eve_|fin_|save_|end_)/.test(k)).concat(Object.keys(STORY.events)).sort();
    const got = keys.filter(k => meta.scenes[k]).length;
    modal(`<h2>Scene Replay</h2><p class="sub">${got} / ${keys.length} scenes seen · replays don't affect your saves</p><div class="scenes">${keys.map(k => `<button class="scn ${meta.scenes[k] ? '' : 'locked'}" data-k="${k}">${meta.scenes[k] ? sceneTitle(k) : '🔒 ???'}</button>`).join('')}</div>`, { wide: 1 });
    $$('#modal .scn').forEach(b => b.onclick = () => { if (b.classList.contains('locked')) return Sound.sfx('fail'); startReplay(b.dataset.k); });
  }
  function startReplay(label) {
    run++; closeModal(); hideTitle(); hist = []; log = []; Sound.sfx('confirm');
    G = newState(); G.name = meta.lastName || 'Haru'; G.replay = true; Object.keys(WHO).forEach(k => G.known[k] = 1); G.roster = ['hikari', 'rei', 'kaede', 'tetsu', 'sora']; G.vis.of = /^(hang|date)_/.test(label) ? 'casual' : null;
    G.stack = [{ id: label, i: 0 }]; restoreVis(); step();
  }
  function charViewer(sel, emo = 'smile', pose = 'default', of = 'hero') {
    const ids = Object.keys(CharArt.CH).filter(k => meta.met[k] || ['hikari'].includes(k));
    sel = ids.includes(sel) ? sel : ids[0];
    const ofs = ['hero'].concat(Object.keys(CharArt.OUTFITS[sel] || {}));
    modal(`<h2>Character Viewer</h2><div class="cview"><div class="cvlist">${ids.map(k => `<button class="dtab ${k === sel ? 'on' : ''}" data-id="${k}" style="--c:${(WHO[k] || { c: '#fff' }).c}">${(WHO[k] || { n: k }).n}</button>`).join('')}</div>
      <div class="cvstage" style="--c:${(WHO[sel] || { c: '#fff' }).c}">${Art.char(sel, emo, pose, false, of)}</div>
      <div class="cvctl"><h4>Expression</h4><div class="cvgrid">${Object.keys(settings.pixel && typeof PixelCast !== 'undefined' ? PixelCast.EMO : CharArt.EMO).map(e => `<button class="cvb ${e === emo ? 'on' : ''}" data-e="${e}">${e}</button>`).join('')}</div>
      <h4>Pose</h4><div class="cvgrid">${Object.keys(settings.pixel && typeof PixelCast !== 'undefined' ? PixelCast.POSES : CharArt.POSES).map(p => `<button class="cvb ${p === pose ? 'on' : ''}" data-p="${p}">${p}</button>`).join('')}</div>
      <h4>Outfit</h4><div class="cvgrid">${ofs.map(o => `<button class="cvb ${o === of ? 'on' : ''}" data-o="${o}">${o}</button>`).join('')}</div>
      ${settings.pixel && typeof PixelCast !== 'undefined' && PixelCast.CAST[sel] ? '<button class="btn" id="pxexp">⬇ Open in Moonkai Pixel Studio (.pxs.json)</button>' : ''}</div></div>`, { wide: 1 });
    const ex = $('#pxexp'); if (ex) ex.onclick = () => { Sound.sfx('confirm'); PixelCast.exportPxs(sel, emo, pose, of); };
    $$('#modal .cvlist .dtab').forEach(b => b.onclick = () => { Sound.sfx('page'); charViewer(b.dataset.id, emo, pose, 'hero'); });
    $$('#modal .cvb').forEach(b => b.onclick = () => { Sound.sfx('click'); charViewer(sel, b.dataset.e || emo, b.dataset.p || pose, b.dataset.o || of); });
  }
  const TRACKS = { title: 'Heartline (Title)', daily: 'Squad Zero Morning', hq: 'HALO Tower', night: 'Night Shift Lo-fi', tension: 'Rift Alert', action: 'Thunder & Shadow', romance: 'Sunset Promise', mystery: 'The Glazier', sad: 'Glass Tears', victory: 'Mission Clear', idol: 'Starlight Stage', date: 'Date Night', festival: 'Summer Lanterns', snow: 'Winter of Glass', board: 'The Board', boss: 'Absolute Command', finale: 'Heartline (Finale)' };
  function musicRoom() {
    modal(`<h2>Music Room</h2><p class="sub">All tracks are composed live by the game's synthesizer.</p><div class="music">${Object.entries(TRACKS).map(([k, n]) => `<button class="mtr ${Sound.current === k ? 'on' : ''}" data-k="${k}"><i>${Sound.current === k ? '♪' : '▶'}</i>${n}</button>`).join('')}</div>`, { small: 1, onclose: () => Sound.play(G ? G.vis.music : 'title') });
    $$('#modal .mtr').forEach(b => b.onclick = () => { Sound.play(b.dataset.k); setTimeout(musicRoom, 60); });
  }
  function codexModal(sel) {
    const C = STORY.codex || {}, cats = [...new Set(Object.values(C).map(e => e.cat))];
    const keys = Object.keys(C).filter(k => !sel || C[k].cat === sel);
    modal(`<h2>Codex</h2><p class="sub">${Object.keys(meta.codex).length} / ${Object.keys(C).length} entries</p><div class="stabs"><button class="dtab ${!sel ? 'on' : ''}" data-c="" style="--c:#52e0ff">All</button>${cats.map(c => `<button class="dtab ${c === sel ? 'on' : ''}" data-c="${c}" style="--c:#52e0ff">${c}</button>`).join('')}</div>
      <div class="codex">${keys.map(k => meta.codex[k] ? `<details class="cx"><summary><b>${C[k].t}</b><small>${C[k].cat}</small></summary><p>${C[k].body}</p></details>` : `<div class="cx locked"><b>🔒 ???</b><small>${C[k].cat}</small></div>`).join('')}</div>`, { wide: 1 });
    $$('#modal .stabs .dtab').forEach(b => b.onclick = () => { Sound.sfx('page'); codexModal(b.dataset.c || null); });
  }
  const ENDINGS = { hikari: 'Forever Partners (Hikari)', rei: 'Out of the Shadows (Rei)', mira: 'Healing Hearts (Mira)', sora: 'Encore (Sora)', kaede: 'Slow Down (Kaede)', squad: 'Found Family (Squad)', true: 'TRUE — Squad One, Home' };
  function statsModal() {
    const st = meta.stats, h = Math.floor(st.playSec / 3600), m = Math.floor(st.playSec / 60) % 60;
    const rows = [['⏱ Play time', `${h}h ${m}m`], ['💬 Lines read', st.lines], ['🔀 Choices made', st.choices], ['🚨 Calls resolved', st.calls], ['🗓 Shifts worked', st.shifts], ['🌟 S-rank shifts', st.sranks], ['💗 Dates', st.dates], ['📷 Photos', Object.keys(meta.album || {}).length], ['🧍 Civilians helped', st.saved || 0], ['🎁 Gifts given', st.gifts], ['🏁 Story clears', st.clears], ['🏆 Achievements', `${Object.keys(meta.ach).length} / ${Object.keys(ACH).length}`], ['🖼 CGs', `${Object.keys(meta.gallery).length} / ${Object.keys(Art.CG_NAMES).length}`], ['📖 Codex', `${Object.keys(meta.codex).length} / ${Object.keys(STORY.codex || {}).length}`], ['📚 Chapters reached', `${meta.maxChap || 0} / 12`]];
    modal(`<h2>Records</h2><div class="statsg">${rows.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}</div><h4>Endings</h4><div class="endl">${Object.entries(ENDINGS).map(([k, n]) => `<div class="${meta.endings[k] ? 'got' : ''}">${meta.endings[k] ? '★ ' + n : '☆ ???'}</div>`).join('')}</div>`, { wide: 1 });
  }
  function extrasModal() {
    const tiles = [['gal', '🖼', 'CG Gallery'], ['scn', '🎬', 'Scene Replay'], ['chr', '🧑‍🎤', 'Characters'], ['mus', '🎵', 'Music Room'], ['cdx', '📖', 'Codex'], ['ach', '🏆', 'Achievements'], ['alb', '📷', 'Photo Album'], ['sts', '📊', 'Records & Endings']];
    modal(`<h2>Extras</h2><div class="xtiles">${tiles.map(([k, i, n]) => `<button class="xt" data-k="${k}"><span>${i}</span><b>${n}</b></button>`).join('')}</div>`, { wide: 1 });
    $$('#modal .xt').forEach(b => b.onclick = () => { Sound.sfx('confirm'); ({ gal: galleryModal, scn: scenesModal, chr: () => charViewer('hikari'), mus: musicRoom, cdx: () => codexModal(), ach: achModal, sts: statsModal, alb: () => albumModal(Object.values(meta.album || {}), true) })[b.dataset.k](); });
  }
  function chaptersModal() {
    const T12 = STORY.chapterTitles || [];
    modal(`<h2>Chapter Select</h2><p class="sub">Replay any chapter you've reached with the squad you had at that point.</p><div class="chaps">${T12.map((t, i) => { const n = i + 1, ok = meta.chaps[n] && LS.get('hl2_chap_' + n); return `<button class="chp ${ok ? '' : 'locked'}" data-n="${n}"><em>${n}</em><b>${ok ? t : '???'}</b></button>`; }).join('')}</div>`, { wide: 1 });
    $$('#modal .chp').forEach(b => b.onclick = () => { if (b.classList.contains('locked')) return Sound.sfx('fail'); const d = LS.get('hl2_chap_' + b.dataset.n); if (d) { loadState(d); toast('📚 Chapter ' + b.dataset.n, d.G.chapT); } });
  }
  function achModal() {
    modal(`<h2>Achievements</h2><p class="sub">${Object.keys(meta.ach).length} / ${Object.keys(ACH).length}</p><div class="achs">${Object.entries(ACH).map(([k, [n, d]]) => `<div class="achi ${meta.ach[k] ? 'got' : ''}"><div class="aic">${meta.ach[k] ? '🏆' : '🔒'}</div><div><b>${n}</b><small>${d}</small></div></div>`).join('')}</div>`, { wide: 1 });
  }
  function pauseMenu() {
    modal(`<h2>Menu</h2><div class="pmenu">${[['resume', 'Resume'], ['back', '⏪ Rollback'], ['save', 'Save'], ['load', 'Load'], ['log', 'Backlog'], ['codex', 'Codex'], ['chars', 'Characters'], ['settings', 'Settings'], ['ach', 'Achievements'], ['title', 'Return to Title']].map(([k, n]) => `<button class="btn" data-k="${k}">${n}</button>`).join('')}</div>`, { small: 1 });
    $$('#modal .pmenu .btn').forEach(b => b.onclick = () => {
      Sound.sfx('click'); const k = b.dataset.k;
      if (k === 'resume') closeModal(); else if (k === 'back') { closeModal(); rollback(); } else if (k === 'save') canSave() || wait === 'hub' ? (closeModal(), slotsModal('save')) : toast('Can\'t save right now'); else if (k === 'load') slotsModal('load');
      else if (k === 'log') logModal(); else if (k === 'settings') settingsModal(); else if (k === 'ach') achModal(); else if (k === 'codex') codexModal(); else if (k === 'chars') charViewer('hikari');
      else if (k === 'title') { closeModal(); toTitle(); }
    });
  }
  function quick(k) {
    Sound.sfx('click');
    if (k === 'auto') { auto = !auto; skip = false; if (auto && wait === 'text' && !typing) advance(); }
    else if (k === 'skip') { skip = !skip; auto = false; if (skip && wait === 'text') { typing ? $('#textbox')._done() : advance(); } }
    else if (k === 'back') rollback();
    else if (k === 'log') logModal(); else if (k === 'save') { if (canSave()) slotsModal('save'); } else if (k === 'load') slotsModal('load');
    else if (k === 'qsave') { if (canSave()) saveTo('q'); } else if (k === 'qload') { if (!loadFrom('q')) toast('No quick save'); }
    else if (k === 'settings') settingsModal(); else if (k === 'hide') toggleHide(); else if (k === 'menu') pauseMenu();
    updateQuick();
  }
  function updateQuick() { $$('#quick [data-q]').forEach(b => b.classList.toggle('on', (b.dataset.q === 'auto' && auto) || (b.dataset.q === 'skip' && (skip || ctrlSkip)))); }
  function toggleHide() { hidden = !hidden; $('#game').classList.toggle('uihidden', hidden); }

  // ---------- title / end ----------
  function toTitle() {
    run++; G = null; clearInterval(typeTimer); wait = null; auto = skip = false; hideHub(); closeModal();
    $('#textbox').classList.add('hide'); $('#chars').innerHTML = ''; $('#choices').className = ''; $('#card').className = '';
    ['#cg', '#letterbox', '#speed'].forEach(s => $(s).classList.remove('on')); $('#game').classList.remove('eyemode');
    G = newState(); setBg('city_night', 'cut'); setFx('stars'); setTint(null); G = null;
    Sound.play('title'); LS.set('hl2_read', readSet); saveMeta(); hist = [];
    const mc = meta.maxChap || 0, tbg = meta.cleared ? 'ascension' : mc >= 9 ? 'snow_city' : mc >= 6 ? 'festival' : 'city_night';
    G = newState(); setBg(tbg, 'cut'); setFx(tbg === 'snow_city' ? 'snow' : tbg === 'festival' ? 'fireworks' : tbg === 'ascension' ? 'glass' : 'stars'); G = null;
    const t = $('#title'); t.classList.add('on');
    $('#tcont').classList.toggle('dis', !latestSave()); $('#tng').style.display = meta.cleared ? '' : 'none'; $('#tchap').classList.toggle('dis', !mc);
    const trio = meta.cleared ? [['sora', 'wink', 'wave', 'formal'], ['rin', 'excited', 'cheer', 'hero'], ['kaede', 'smirk', 'hip', 'hero']] : mc >= 6 ? [['hikari', 'excited', 'cheer', 'yukata'], ['rei', 'blush', 'shy', 'yukata'], ['mira', 'tender', 'heart', 'yukata']] : [['hikari', 'happy', 'wave', 'hero'], ['rei', 'smug', 'cross', 'hero'], ['mira', 'smile', 'shy', 'hero']];
    $('#tchars').innerHTML = trio.map(([id, e, p, o], i) => `<div class="tch ${['h', 'r', 'm'][i]}">${Art.char(id, e, p, false, o)}</div>`).join('');
    $('#tbadge').textContent = meta.cleared ? `★ Story Cleared ×${meta.stats.clears || 1} — New Game+ unlocked` : mc ? `Chapter ${mc} / 12 reached` : '12 Chapters · 7 Endings';
  }
  function hideTitle() { $('#title').classList.remove('on'); }
  const latestSave = () => SLOTKEYS.map(k => [k, LS.get('hl2_save_' + k)]).filter(x => x[1]).sort((a, b) => b[1].t - a[1].t)[0];
  function newGame(ng) {
    Sound.sfx('confirm');
    modal(`<h2>${ng ? 'New Game+' : 'New Game'}</h2><p class="sub">Choose your Handler difficulty. You can't change it later.</p><div class="picks three">${[['story', '🌸', 'Story', 'Generous timers, softer calls. For the romance & plot.'], ['normal', '🚨', 'Handler', 'The intended balance.'], ['hard', '🔥', 'Veteran', 'Tougher calls, shorter timers, less forgiving.']].map(([k, i, n, d]) => `<button class="pick diff" data-d="${k}"><div class="big">${i}</div><b>${n}</b><small>${d}</small></button>`).join('')}</div>${ng ? '<p class="sub" style="margin-top:14px">New Game+: your heroes keep their levels & stats, you start with bonus credits, and a hidden path opens…</p>' : ''}`, { wide: 1 });
    $$('#modal .diff').forEach(b => b.onclick = () => { closeModal(); beginGame(ng, b.dataset.d); });
  }
  function beginGame(ng, diff) {
    Sound.sfx('confirm'); hideTitle(); run++; log = []; hist = [];
    G = newState(); G.diff = diff || 'normal'; G.stack = [{ id: 'prologue', i: 0 }];
    if (ng && meta.ngCarry) { Object.entries(meta.ngCarry.heroes || {}).forEach(([k, h]) => { if (G.heroes[k]) Object.assign(G.heroes[k], { lvl: h.lvl, xp: h.xp, sp: h.sp, st: h.st, perks: h.perks || [] }); }); G.credits += 2000; G.ngp = (meta.ngCarry.ngp || 0) + 1; G.flags.ngp = 1; }
    $('#fade').classList.add('on'); setTimeout(() => { $('#fade').classList.remove('on'); restoreVis(); step(); }, 700);
  }
  function theEnd() {
    wait = 'card'; skip = ctrlSkip = false; if (!G.replay) { meta.cleared = true; meta.stats.clears = (meta.stats.clears || 0) + 1; meta.ngCarry = { heroes: JSON.parse(JSON.stringify(G.heroes)), ngp: G.ngp || 0 }; meta.lastName = G.name; } saveMeta(); unlock('finale');
    hideHub(); $('#textbox').classList.add('hide'); Object.keys(G.vis.chars).forEach(hideChar); Sound.play('title');
    const c = $('#card'); c.className = 'on credits';
    c.innerHTML = `<div class="roll">${STORY.credits.map(l => l.startsWith('#') ? `<h3>${l.slice(1)}</h3>` : l === '' ? '<br>' : `<p>${T(l)}</p>`).join('')}</div><button class="btn skipc" id="skipc">Skip ▸</button>`;
    const end = () => { c.className = ''; c.innerHTML = ''; toTitle(); };
    $('#skipc').onclick = end; later(26000, end);
  }

  // ---------- input ----------
  function bind() {
    $('#textbox').addEventListener('click', e => { if (e.target.closest('#quick')) return; clickText(); });
    $('#stage').addEventListener('click', () => { if (hidden) return toggleHide(); if (wait === 'text') clickText(); if (wait === 'card') { } });
    $$('#quick [data-q]').forEach(b => b.onclick = e => { e.stopPropagation(); quick(b.dataset.q); });
    $('#game').addEventListener('wheel', e => { if (e.deltaY < 0 && G && !modalOpen() && (wait === 'text' || wait === 'choice') && !Dispatch.active) settings.wheelBack ? rollback() : logModal(); });
    let tx = 0, ty = 0, tt = 0, lp = 0;
    $('#game').addEventListener('touchstart', e => { const p = e.touches[0]; tx = p.clientX; ty = p.clientY; tt = Date.now(); clearTimeout(lp); lp = setTimeout(() => { if (G && !modalOpen()) toggleHide(); }, 650); }, { passive: true });
    $('#game').addEventListener('touchmove', () => clearTimeout(lp), { passive: true });
    $('#game').addEventListener('touchend', e => { clearTimeout(lp); const p = e.changedTouches[0], dy = p.clientY - ty; if (!G || modalOpen() || Dispatch.active || Date.now() - tt > 600) return; if (dy < -70) logModal(); else if (dy > 70) rollback(); }, { passive: true });
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      if ($('#splash').classList.contains('on')) return startSplash();
      if ($('#viewer').classList.contains('on')) { $('#viewer').click(); return; }
      if (e.key === 'Escape') { if (modalOpen() && !$('#modal .x')) return; if (modalOpen()) { $('#mx').click(); return; } if (G && !$('#title').classList.contains('on')) pauseMenu(); return; }
      if (!G || modalOpen()) return;
      if (e.key === 'Control') { ctrlSkip = true; updateQuick(); if (wait === 'text') typing ? $('#textbox')._done() : advance(); }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (hidden) toggleHide(); else clickText(); }
      if (wait === 'choice' && /^[1-4]$/.test(e.key)) { const b = $$('#choices .choice')[+e.key - 1]; b && b.click(); }
      const k = e.key.toLowerCase();
      if (k === 'a') quick('auto'); if (k === 's') quick('skip'); if (k === 'h') toggleHide(); if (k === 'l') logModal();
      if (e.key === 'F5') { e.preventDefault(); quick('qsave'); } if (e.key === 'F9') { e.preventDefault(); quick('qload'); }
      if ((e.key === 'Backspace' || e.key === 'PageUp') && !Dispatch.active) { e.preventDefault(); rollback(); }
    });
    document.addEventListener('keyup', e => { if (e.key === 'Control') { ctrlSkip = false; updateQuick(); } });
    $('#tnew').onclick = () => newGame(false); $('#tng').onclick = () => newGame(true); $('#tchap').onclick = chaptersModal; $('#textra').onclick = extrasModal;
    $('#tcont').onclick = () => { const l = latestSave(); if (l) loadFrom(l[0]); };
    $('#tload').onclick = () => slotsModal('load'); $('#tset').onclick = settingsModal;
    setInterval(() => { if (G && !G.replay && document.visibilityState === 'visible') { meta.stats.playSec++; if (meta.stats.playSec % 30 === 0) saveMeta(); } }, 1000);
    $('#tcred').onclick = () => modal(`<h2>Credits</h2><div class="log">${STORY.credits.map(l => l.startsWith('#') ? `<h3>${l.slice(1)}</h3>` : `<p>${l.replace('{name}', 'You')}</p>`).join('')}</div>`, { small: 1 });
    $$('#title .tb').forEach(b => b.addEventListener('mouseenter', () => Sound.sfx('hover')));
    $('#splash').onclick = startSplash;
    $('#game').addEventListener('mousemove', e => { if (!settings.parallax) return; const r = $('#game').getBoundingClientRect(); $('#game').style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3)); $('#game').style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
    const fit = () => { const k = Math.min(innerWidth / 1280, innerHeight / 720); $('#game').style.transform = `translate(-50%,-50%) scale(${k})`; };
    addEventListener('resize', fit); fit();
    const g = $('#game'); g.addEventListener('scroll', () => { g.scrollTop = 0; g.scrollLeft = 0; });
  }
  function startSplash() { const s = $('#splash'); if (!s.classList.contains('on')) return; s.classList.remove('on'); Sound.init(); Sound.sfx('chime'); toTitle(); }

  const api = { toast, unlock, addAff, flash, shake, setTint, giveXP, modal, closeModal, WHO, T, saveMeta, sfx: n => Sound.sfx(n), get G() { return G; }, get meta() { return meta; } };
  function codexUnlock(k, quiet) { if (meta.codex[k]) return; meta.codex[k] = 1; saveMeta(); const e = STORY.codex && STORY.codex[k]; if (!quiet) toast('📖 Codex updated', e ? e.t : k); }
  function boot() {
    Object.entries(STORY.scripts).forEach(([k, v]) => reg(v, k));
    Object.entries(STORY.events).forEach(([k, v]) => reg(v.s, k));
    Object.assign(ACH, Sys.ACH, STORY.ach || {}); STORY.codex = Object.assign({}, STORY.codex || {}, Sys.CODEX); Sys.init(api);
    loadPrefs(); bind(); requestAnimationFrame(fxLoop);
    $('#bgA').innerHTML = Art.bg('city_night'); $('#bgA').classList.add('show'); Fx.type = 'stars';
  }
  const dev = { play(arr) { run++; hideTitle(); closeModal(); R.__dev = arr; reg(arr, '__dev'); if (!G) G = newState(); G.stack = [{ id: '__dev', i: 0 }]; restoreVis(); step(); } };
  return { boot, get G() { return G; }, WHO, dev };
})();
window.addEventListener('DOMContentLoaded', Game.boot);

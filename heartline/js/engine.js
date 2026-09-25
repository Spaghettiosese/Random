/* HEARTLINE AGENCY — VN engine, UI, and agency sim systems. */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const Game = (() => {
  const NEXT = 1, WAIT = 2, CONT = 3;
  const WHO = {
    hikari: { n: 'Hikari', c: '#ffcf3f', p: 880 }, rei: { n: 'Rei', c: '#b99bff', p: 480 }, mira: { n: 'Mira', c: '#ff8fb8', p: 700 },
    aya: { n: 'Director Takamine', c: '#ff5a5a', p: 360 }, bit: { n: 'B.I.T.', c: '#52e0ff', p: 1300 }, me: { n: '', c: '#8fd3ff', p: 250 }
  };
  const POS = { ll: 12, l: 25, c: 50, r: 75, rr: 88 };
  const SLOTS = ['Morning', 'Afternoon', 'Evening'];
  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const WEATHER = ['☀️ Clear', '🌤️ Breezy', '🌧️ Rain', '⛈️ Storm'];
  const STAT = { pow: 'Power', ctl: 'Control', team: 'Teamwork' };
  const ACH = {
    prologue: ['First Spark', 'Complete the Prologue'], perfect: ['Perfect Timing', 'Land a PERFECT strike in training'],
    srank: ['S-Rank Handler', 'Earn an S rank on a mission'], shopper: ['Big Spender', 'Buy 3 gifts'], gift: ['Thoughtful', 'Give a hero a gift they love'],
    bond: ['Heartline', 'Reach 20 affection with anyone'], rest: ['Self-Care', 'Take a rest'], social: ['Social Butterfly', 'Hang out with all three heroines'],
    eye: ['Handler\'s Eye', 'Call every Handler\'s Eye moment correctly'], cert: ['Squad Zero', 'Pass Field Certification'],
    cert_s: ['Flawless', 'Pass certification with a top score'], night: ['Night Owl', 'Reply to 3 late-night messages'],
    route_hikari: ['Lightning Heart', 'See Hikari\'s rooftop scene'], route_rei: ['Shadow Heart', 'See Rei\'s rooftop scene'], route_mira: ['Healing Heart', 'See Mira\'s rooftop scene'],
    ch1: ['To Be Continued', 'Clear Chapter 1'], log: ['Rewind', 'Open the backlog'], deploy5: ['Dispatcher', 'Complete 5 missions'], coach: ['Coach', 'Run 5 training sessions']
  };
  let settings = { textSpeed: 45, autoDelay: 1.4, music: .55, sfx: .7, voice: true, hints: false, motion: true };
  let meta = { ach: {}, gallery: {}, cleared: false };
  let G = null, R = {}, run = 0;
  let wait = null, typing = false, typeTimer = null, auto = false, skip = false, ctrlSkip = false, hidden = false, autoTimer = null;
  let log = [];

  // ---------- persistence ----------
  const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  function loadPrefs() { settings = Object.assign(settings, LS.get('hl_settings', {})); meta = Object.assign(meta, LS.get('hl_meta', {})); applySettings(); }
  const saveMeta = () => LS.set('hl_meta', meta), saveSettings = () => LS.set('hl_settings', settings);
  function applySettings() { Sound.setVol('music', settings.music); Sound.setVol('sfx', settings.sfx); Sound.vol.voice = settings.voice; document.body.classList.toggle('nomotion', !settings.motion); }

  function newState() {
    return {
      name: 'Haru', flags: {}, aff: { hikari: 0, rei: 0, mira: 0, aya: 0 }, known: { bit: 0 },
      heroes: { hikari: { pow: 38, ctl: 14, team: 22, morale: 70, fat: 0 }, rei: { pow: 30, ctl: 44, team: 8, morale: 40, fat: 0 } },
      day: 1, slot: 0, energy: 100, credits: 300, rep: 10, inv: {}, gifted: {}, seen: { hikari: 0, rei: 0, mira: 0 }, ev: {},
      missions: [], done: 0, trains: 0, bought: 0, replies: 0, eyes: 0, eyesOk: 0, today: {}, weather: 0, score: 0,
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
      const f = top(); if (!f) return;
      const arr = R[f.id]; if (!arr || f.i >= arr.length) { G.stack.pop(); continue; }
      const r = exec(arr[f.i], f);
      if (r === WAIT) return;
      if (r === NEXT) f.i++;
    }
  }
  function advance() { const f = top(); if (f) f.i++; wait = null; step(); }
  const later = (ms, fn = advance) => { const my = run; setTimeout(() => { if (my === run) fn(); }, skipping() ? Math.min(ms, 80) : ms); };
  function jump(label) { G.stack = [{ id: label, i: 0 }]; }
  function push(arr) { G.stack.push({ id: idOf(arr), i: 0 }); }
  const skipping = () => skip || ctrlSkip;
  const T = s => String(s).replace(/\{name\}/g, G.name);

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
      case 'move': if (G.vis.chars[a]) showChar(a, null, null, b); return NEXT;
      case 'hide': hideChar(a); return NEXT;
      case 'hideall': Object.keys(G.vis.chars).forEach(hideChar); return NEXT;
      case 'know': G.known[a] = 1; return NEXT;
      case 'say': if (b !== undefined && typeof b === 'string' && G.vis.chars[a] && d) showChar(a, d, e || G.vis.chars[a].pose); say(a, b); return WAIT;
      case 'n': say(null, a); return WAIT;
      case 't': say('think', a); return WAIT;
      case 'me': say('me', a); return WAIT;
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
      case 'letterbox': $('#letterbox').classList.toggle('on', !!a); return NEXT;
      case 'speed': $('#speed').classList.toggle('on', !!a); return NEXT;
      case 'eyefx': $('#game').classList.toggle('eyemode', !!a); return NEXT;
      case 'title': titleCard(a, b); return WAIT;
      case 'daycard': dayCard(); return WAIT;
      case 'name': nameEntry(); return WAIT;
      case 'phone': phone(a, b, false); return WAIT;
      case 'hub': if (G.slot >= 3) { hideHub(); return NEXT; } autosave(); renderHub(); return WAIT;
      case 'night': night(); return WAIT;
      case 'nextday': nextDay(); return NEXT;
      case 'route': { const k = ['hikari', 'rei', 'mira'].reduce((m, x) => G.aff[x] > G.aff[m] ? x : m, 'hikari'); jump('end_' + k); } return CONT;
      case 'end': theEnd(); return WAIT;
      case 'autosave': autosave(); return NEXT;
    }
    console.warn('unknown op', op); return NEXT;
  }

  // ---------- stage ----------
  function setBg(name, trans = 'fade') {
    G.vis.bg = name;
    const A = $('#bgA'), B = $('#bgB'), front = A.classList.contains('show') ? A : B, back = front === A ? B : A;
    back.innerHTML = Art.bg(name);
    if (trans === 'flash') flash('#fff');
    if (trans === 'cut' || skipping()) { back.style.transition = 'none'; front.style.transition = 'none'; }
    else { back.style.transition = ''; front.style.transition = ''; }
    back.classList.add('show'); front.classList.remove('show');
    back.classList.remove('kb'); void back.offsetWidth; back.classList.add('kb');
  }
  function setTint(t) { G.vis.tint = t; $('#tint').className = 'layer ' + (t || ''); }
  function showChar(id, emo, pose, pos) {
    const st = G.vis.chars[id] || { emo: 'neutral', pose: 'default', pos: 'c' };
    let d = $(`#chars .char[data-id="${id}"]`), fresh = !d;
    if (fresh) { d = document.createElement('div'); d.className = 'char enter' + (id === 'bit' ? ' isbit' : ''); d.dataset.id = id; $('#chars').appendChild(d); setTimeout(() => d.classList.remove('enter'), 600); }
    const changed = emo && emo !== st.emo;
    if (emo) st.emo = emo; if (pose) st.pose = pose; if (pos) st.pos = pos;
    G.vis.chars[id] = st;
    d.innerHTML = Art.char(id, st.emo, st.pose);
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
    Object.entries(cs).forEach(([id, s]) => showChar(id, s.emo, s.pose, s.pos));
    ['#cg', '#letterbox', '#speed'].forEach(s => $(s).classList.remove('on')); $('#game').classList.remove('eyemode');
  }

  // ---------- particles ----------
  const Fx = { type: null, parts: [] };
  function setFx(t) { G.vis.fx = t; Fx.type = t; Fx.parts = []; Fx.init = 0; }
  function fxLoop() {
    const cv = $('#particles'), x = cv.getContext('2d'); x.clearRect(0, 0, 1280, 720);
    const t = Fx.type;
    if (t) {
      const want = { rain: 160, petals: 40, sparks: 60, embers: 70, stars: 50, glass: 90, hearts: 26, dust: 40, shadow: 50 }[t] || 40;
      while (Fx.parts.length < want) Fx.parts.push(spawn(t, Fx.parts.length < want * .8 && !Fx.init));
      Fx.init = 1;
      Fx.parts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.a += p.va || 0; p.l--;
        if (t === 'petals' || t === 'glass') p.vx += Math.sin((p.y + p.x) / 60) * .02;
        x.save(); x.globalAlpha = Math.max(0, Math.min(1, p.o * Math.min(1, p.l / 40)));
        if (t === 'rain') { x.strokeStyle = '#bcd8ff'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(p.x - p.vx * 2, p.y - p.vy * 2); x.stroke(); }
        else if (t === 'petals') { x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = '#ffc1d8'; x.beginPath(); x.ellipse(0, 0, p.s, p.s * .55, 0, 0, 7); x.fill(); }
        else if (t === 'glass') { x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = `rgba(200,250,255,.9)`; x.beginPath(); x.moveTo(0, -p.s); x.lineTo(p.s * .6, 0); x.lineTo(0, p.s); x.lineTo(-p.s * .6, 0); x.fill(); }
        else if (t === 'hearts') { x.translate(p.x, p.y); x.fillStyle = '#ff7aa8'; x.font = `${p.s * 3}px sans-serif`; x.fillText('♥', 0, 0); }
        else { x.fillStyle = { sparks: '#fff27a', embers: '#ff8a3a', stars: '#fff', dust: '#ffffff', shadow: '#6a3ac0' }[t]; x.shadowColor = x.fillStyle; x.shadowBlur = t === 'dust' ? 0 : 8; x.beginPath(); x.arc(p.x, p.y, p.s, 0, 7); x.fill(); }
        x.restore();
        if (p.l <= 0 || p.y > 760 || p.y < -60 || p.x < -60 || p.x > 1340) Fx.parts[i] = spawn(t);
      });
    }
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
      default: return { x: r() * 1280, y: r() * 500, vx: 0, vy: 0, s: r() * 1.5 + .3, o: r(), l: 200 + r() * 600 };
    }
  }

  // ---------- text ----------
  function parse(text) {
    const out = []; let em = 0, shk = 0, big = 0;
    for (const ch of T(text)) {
      if (ch === '*') { em ^= 1; continue; } if (ch === '~') { shk ^= 1; continue; } if (ch === '^') { big ^= 1; continue; }
      out.push({ ch, cls: (em ? 'em ' : '') + (shk ? 'shk ' : '') + (big ? 'big' : '') });
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
    wait = 'choice'; skip = false; ctrlSkip = false; updateQuick();
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
      const btn = document.createElement('button'); btn.className = 'choice'; btn.style.animationDelay = k * 80 + 'ms';
      const hint = settings.hints && o.aff ? Object.entries(o.aff).filter(([, v]) => v > 0).map(([w]) => `<b style="color:${WHO[w].c}">♥</b>`).join('') : '';
      btn.innerHTML = `<span class="k">${k + 1}</span>${T(o.t)}${hint ? `<span class="hint">${hint}</span>` : ''}`;
      btn.onmouseenter = () => Sound.sfx('hover');
      btn.onclick = () => pick(o, eyeCfg);
      box.appendChild(btn);
    });
  }
  function pick(o, eyeCfg) {
    if (wait !== 'choice') return;
    const box = $('#choices'); clearTimeout(box._t); box.className = ''; box.innerHTML = ''; $('#game').classList.remove('eyemode');
    Sound.sfx('confirm'); log.push({ n: '▶', c: '#8fd3ff', t: T(o.t) });
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
  function toast(t, s, cls = '') {
    const d = document.createElement('div'); d.className = 'toast ' + cls; d.innerHTML = `<b>${t}</b><span>${s || ''}</span>`;
    $('#toasts').appendChild(d); setTimeout(() => d.classList.add('out'), 2800); setTimeout(() => d.remove(), 3300);
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
    c.innerHTML = `<div class="dc"><div class="dcal"><div class="dtop">${DAYS[(G.day - 1) % 5]}</div><div class="dnum">${G.day}</div></div><div class="dinfo"><b>DAY ${G.day}</b><span>${WEATHER[G.weather]}</span><em>${G.day === 4 ? 'Field Certification' : `${4 - G.day} day${4 - G.day > 1 ? 's' : ''} until Certification`}</em></div></div>`;
    later(2600, () => { c.className = ''; later(300); });
  }
  function nameEntry() {
    wait = 'modal';
    modal(`<h2>Your Name</h2><p class="sub">What will Hikari call you?</p><input id="nm" maxlength="12" value="${G.name}" autocomplete="off"/><div class="row"><button class="btn primary" id="nmok">Confirm</button></div>`, { noclose: 1, small: 1 });
    const inp = $('#nm'); inp.focus({ preventScroll: true }); inp.select();
    const ok = () => { G.name = (inp.value.trim() || 'Haru').replace(/[<>&"]/g, ''); closeModal(); Sound.sfx('confirm'); advance(); };
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

  // ---------- HUB (daily planner) ----------
  function hudHtml() {
    const seg = SLOTS.map((s, i) => `<div class="seg ${i < G.slot ? 'used' : i === G.slot ? 'now' : ''}"><span>${s}</span></div>`).join('');
    return `<div class="hudday"><b>DAY ${G.day}</b><span>${DAYS[(G.day - 1) % 5]} · ${WEATHER[G.weather]}</span></div>
      <div class="timebar">${seg}<div class="sun" style="left:${(G.slot + .5) / 3 * 100}%">${G.slot < 2 ? '☀️' : '🌙'}</div></div>
      <div class="hudstats"><div class="energy"><label>ENERGY</label><div class="bar"><i style="width:${G.energy}%"></i></div><small>${G.energy}</small></div>
      <div class="chip">💴 ${G.credits}</div><div class="chip">⭐ ${G.rep}</div></div>`;
  }
  function renderHub() {
    wait = 'hub'; $('#textbox').classList.add('hide');
    Object.keys(G.vis.chars).forEach(hideChar); ['#cg', '#letterbox', '#speed'].forEach(s => $(s).classList.remove('on'));
    if (G.vis.bg !== 'hq_lobby') setBg('hq_lobby'); if (G.vis.fx !== 'dust') setFx('dust'); if (G.vis.music !== 'daily') { G.vis.music = 'daily'; Sound.play('daily'); }
    const hud = $('#hud'); hud.innerHTML = hudHtml(); hud.classList.add('on');
    setTint(['morning', 'noon', 'evening'][G.slot]);
    const acts = [
      ['train', '🥊', 'Train', 'Raise a hero\'s stats', 20], ['deploy', '🚨', 'Deploy', 'Send heroes on missions', 15],
      ['hang', '💗', 'Hang Out', 'Spend time together', 10], ['rest', '🛏️', 'Rest', 'Recover energy & fatigue', 0],
      ['shop', '🛍️', 'Shop', 'Gifts & goods · free', -1], ['dossier', '📁', 'Dossier', 'Profiles & gifting · free', -1], ['heronet', '📱', 'HeroNet', 'Feed & news · free', -1]
    ];
    const mini = (l, v, c = '') => `<div class="mini ${c}"><label>${l}</label><span><i style="width:${v}%"></i></span><em>${v}</em></div>`;
    const squad = ['hikari', 'rei'].map(h => { const s = G.heroes[h]; return `<div class="sq" style="--c:${WHO[h].c}"><div class="pt">${Art.char(h, s.fat > 70 ? 'sad' : s.morale > 60 ? 'smile' : 'neutral', 'default', true)}</div><div class="sqs"><b>${WHO[h].n}</b>
      ${mini('POW', s.pow)}${mini('CTL', s.ctl)}${mini('TEAM', s.team)}${mini('FTG', s.fat, 'fat')}</div></div>`; }).join('')
      + `<h3 class="bh">BONDS</h3>` + ['hikari', 'rei', 'mira'].map(h => `<div class="bond" style="--c:${WHO[h].c}"><b>${WHO[h].n}</b>${heart(G.aff[h])}<small>${tier(G.aff[h])}</small></div>`).join('')
      + `<div class="countdown"><b>${Math.max(0, 4 - G.day)}</b><span>day${4 - G.day === 1 ? '' : 's'} until<br>Field Certification</span></div>`;
    const tip = hubTip();
    $('#hub').innerHTML = `<div class="squad"><h3>SQUAD ZERO</h3>${squad}</div>
      <div class="acts">${acts.map(([k, ic, n, d, cost]) => `<button class="act ${cost > 0 && G.energy < cost ? 'off' : ''}" data-a="${k}"><div class="ic">${ic}</div><b>${n}</b><small>${d}</small>${cost > 0 ? `<em>-${cost} ⚡</em>` : cost === 0 ? '<em>+45 ⚡</em>' : ''}</button>`).join('')}</div>
      <div class="bittip"><div class="bitface">${Art.char('bit', 'happy', '', true)}</div><p>${tip}</p></div>`;
    $('#hub').classList.add('on');
    $$('#hub .act').forEach(b => { b.onmouseenter = () => Sound.sfx('hover'); b.onclick = () => { if (b.classList.contains('off')) { Sound.sfx('fail'); toast('Too tired!', 'Rest to recover energy.'); return; } Sound.sfx('click'); ACTS[b.dataset.a](); }; });
  }
  function hideHub(keepHud) { $('#hub').classList.remove('on'); if (!keepHud) $('#hud').classList.remove('on'); }
  function hubTip() {
    const h = G.heroes, tips = [];
    if (G.energy < 25) tips.push('Your energy is low, Handler! Consider resting. Beep.');
    ['hikari', 'rei'].forEach(k => { if (h[k].fat > 65) tips.push(`${WHO[k].n} looks exhausted. Tired heroes fail missions!`); });
    if (h.hikari.ctl < 25) tips.push('Hikari\'s Control is very low. Control training widens her strike window!');
    if (h.rei.team < 20) tips.push('Rei\'s Teamwork is critical. Squad deployments and Teamwork drills help!');
    if (G.day === 3) tips.push('Tomorrow is Certification Day! Balanced stats and strong bonds will matter!');
    if (tips.length) return tips[(G.day + G.slot) % tips.length];
    const gen = ['Gifts a hero LOVES give big affection boosts. Check their Dossier for hints!', 'Evening is great for hanging out. Just saying. Beep boop.', 'Squad deployments train Teamwork for both heroes at once!', 'Higher affection unlocks new Hang Out scenes. Bonds are power!', 'Hold CTRL to skip text you\'ve read. Press H to hide the UI and admire the view.'];
    return gen[(G.day * 3 + G.slot) % gen.length];
  }
  function useSlot(evChance = .3) {
    G.slot++; closeModal();
    const hud = $('#hud'); hud.innerHTML = hudHtml(); Sound.sfx('swoosh');
    setTint(['morning', 'noon', 'evening', 'night'][G.slot]);
    const pool = Object.keys(STORY.events).filter(k => !G.ev[k] && STORY.events[k].day <= G.day);
    if (G.slot < 3 && pool.length && Math.random() < evChance) { const k = pool[(Math.random() * pool.length) | 0]; G.ev[k] = 1; hideHub(true); G.stack.push({ id: k, i: 0 }); setTimeout(step, 500); return; }
    setTimeout(step, 450);
  }
  const heroPick = (title, cb, opts = {}) => {
    const hs = opts.list || ['hikari', 'rei'];
    modal(`<h2>${title}</h2><p class="sub">${opts.sub || 'Choose a hero'}</p><div class="picks">${hs.map(h => {
      const s = G.heroes[h];
      return `<button class="pick" data-h="${h}" style="--c:${h === 'squad' ? '#7fe8ff' : WHO[h].c}"><div class="pp">${h === 'squad' ? `<div class="duo">${Art.char('hikari', 'happy', 'default', true)}${Art.char('rei', 'cold', 'default', true)}</div>` : Art.char(h, s && s.fat > 70 ? 'sad' : 'smile', 'default', true)}</div>
      <b>${h === 'squad' ? 'Squad Deploy' : WHO[h].n}</b>${opts.extra ? opts.extra(h) : s ? `<small>POW ${s.pow} · CTL ${s.ctl} · TEAM ${s.team}</small><small>Fatigue ${s.fat}% · Morale ${s.morale}</small>` : `<small>♥ ${G.aff[h]}</small>`}</button>`;
    }).join('')}</div>`);
    $$('#modal .pick').forEach(b => b.onclick = () => { Sound.sfx('confirm'); cb(b.dataset.h); });
  };

  const ACTS = {
    train() {
      heroPick('Training', h => {
        const s = G.heroes[h];
        modal(`<h2>Train ${WHO[h].n}</h2><p class="sub">Pick a focus. Higher Control widens the strike zone.</p><div class="picks three">${Object.entries(STAT).map(([k, n]) => `<button class="pick stat" data-k="${k}"><div class="big">${{ pow: '💥', ctl: '🎯', team: '🤝' }[k]}</div><b>${n}</b><small>Current: ${s[k]}</small></button>`).join('')}</div>`);
        $$('#modal .stat').forEach(b => b.onclick = () => { Sound.sfx('confirm'); minigame(h, b.dataset.k); });
      }, { sub: 'Training costs 20 energy and adds fatigue.' });
    },
    deploy() {
      if (!G.missions.length) genMissions();
      modal(`<h2>Mission Board</h2><p class="sub">HALO Dispatch · ${G.missions.filter(m => !m.done).length} open requests</p><div class="missions">${G.missions.map((m, i) => `<button class="mission ${m.done ? 'done' : ''}" data-i="${i}"><div class="tier">${'★'.repeat(m.tier)}<span>${'★'.repeat(3 - m.tier)}</span></div><b>${m.n}</b><p>${m.d}</p><div class="mfoot"><span class="tag">${STAT[m.stat]}</span><span>💴 ${m.cr}</span><span>⭐ +${m.rep}</span>${m.done ? `<span class="res ${m.ok ? 'ok' : 'bad'}">${m.ok ? 'CLEARED' : 'FAILED'}</span>` : ''}</div></button>`).join('')}</div>`, { wide: 1 });
      $$('#modal .mission').forEach(b => b.onclick = () => {
        const m = G.missions[+b.dataset.i]; if (m.done) return Sound.sfx('fail'); Sound.sfx('confirm');
        heroPick(m.n, h => runMission(m, h), { list: ['hikari', 'rei', 'squad'], sub: `Requires ${STAT[m.stat]} · Difficulty ${m.diff}`, extra: h => `<small class="chance">Success ${Math.round(chance(m, h) * 100)}%</small><small>${h === 'squad' ? 'Both heroes · uses Teamwork' : `${STAT[m.stat]} ${G.heroes[h][m.stat]} · Fatigue ${G.heroes[h].fat}%`}</small>` });
      });
    },
    hang() {
      heroPick('Hang Out', h => {
        G.energy -= 10; const n = G.seen[h] + 1, need = [0, 0, 6, 14][n];
        let label = `hang_${h}_x`;
        if (n <= 3 && G.aff[h] >= need) { G.seen[h] = n; label = `hang_${h}_${n}`; }
        G.today[h] = (G.today[h] || 0) + 1;
        if (G.seen.hikari && G.seen.rei && G.seen.mira) unlock('social');
        G.slot++; closeModal(); hideHub();
        G.stack.push({ id: label, i: 0 }); step();
      }, { list: ['hikari', 'rei', 'mira'], sub: 'Who do you want to spend time with?', extra: h => `<small>${heart(G.aff[h])}</small><small>${tier(G.aff[h])}</small><small class="nextscene">${G.seen[h] >= 3 ? 'All scenes seen' : G.aff[h] >= [0, 0, 6, 14][G.seen[h] + 1] ? '✨ New scene available' : `Next scene at ♥${[0, 0, 6, 14][G.seen[h] + 1]}`}</small>` });
    },
    rest() {
      modal(`<h2>Rest</h2><div class="rest"><div class="zzz">Z<span>z</span><span>z</span></div><p>You grab a nap on the break-room couch. B.I.T. hums a lullaby at 40 decibels.</p><p class="gain">+45 Energy · Heroes −30 Fatigue · +5 Morale</p></div>`, { noclose: 1 });
      Sound.sfx('snore'); unlock('rest');
      G.energy = clamp(G.energy + 45, 0, 100); ['hikari', 'rei'].forEach(h => { const s = G.heroes[h]; s.fat = clamp(s.fat - 30, 0, 100); s.morale = clamp(s.morale + 5, 0, 100); });
      setTimeout(() => useSlot(.45), 2200);
    },
    shop() {
      const draw = () => {
        modal(`<h2>HALO Supply Store</h2><p class="sub">Wallet: 💴 ${G.credits}</p><div class="shop">${Object.entries(STORY.items).map(([k, it]) => `<div class="item"><div class="iic">${it.icon}</div><div class="itx"><b>${it.n}</b><small>${it.d}</small><small class="own">Owned: ${G.inv[k] || 0}</small></div><button class="btn buy" data-k="${k}" ${G.credits < it.p ? 'disabled' : ''}>💴 ${it.p}</button></div>`).join('')}</div>`, { wide: 1 });
        $$('#modal .buy').forEach(b => b.onclick = () => { const it = STORY.items[b.dataset.k]; if (G.credits < it.p) return; G.credits -= it.p; G.inv[b.dataset.k] = (G.inv[b.dataset.k] || 0) + 1; G.bought++; if (G.bought >= 3) unlock('shopper'); Sound.sfx('coin'); $('#hud').innerHTML = hudHtml(); draw(); });
      };
      draw();
    },
    dossier(sel = 'hikari') { dossier(sel); },
    heronet() {
      const posts = STORY.feed(G);
      modal(`<div class="phone feed"><div class="phead">📱 HeroNet <small>#NeoTokyo</small></div><div class="pbody">${posts.map(p => `<div class="post"><div class="pav" style="background:${p.c}">${p.a}</div><div><b>${p.u}</b> <small>${p.h}</small><p>${T(p.t)}</p><small class="likes">♥ ${p.l} · ↻ ${Math.round(p.l / 7)}</small></div></div>`).join('')}</div></div>`, { cls: 'phonewrap' });
    }
  };
  const heart = v => { const n = clamp(Math.floor(v / 5), 0, 6); return '<span class="hearts">' + '♥'.repeat(n) + '<span>' + '♥'.repeat(6 - n) + '</span></span>'; };
  const tier = v => v < 3 ? 'Stranger' : v < 8 ? 'Acquaintance' : v < 14 ? 'Friend' : v < 22 ? 'Close Friend' : 'Something More…';

  function genMissions() {
    const pool = STORY.missions.filter(m => !m.min || G.day >= m.min).sort(() => Math.random() - .5);
    G.missions = pool.slice(0, 3).map(m => Object.assign({}, m, { done: 0 }));
  }
  function chance(m, h) {
    const H = G.heroes;
    let st, mor, fat;
    if (h === 'squad') { st = (H.hikari[m.stat] + H.rei[m.stat]) / 2 * .6 + (H.hikari.team + H.rei.team) / 2 * .6 + 6; mor = (H.hikari.morale + H.rei.morale) / 2; fat = Math.max(H.hikari.fat, H.rei.fat); }
    else { st = H[h][m.stat]; mor = H[h].morale; fat = H[h].fat; }
    return clamp(.5 + (st - m.diff) / 55 + (mor - 50) / 400 - fat / 260, .05, .97);
  }
  function runMission(m, h) {
    G.energy -= 15;
    const p = chance(m, h), roll = Math.random(), ok = roll < p, margin = p - roll;
    const who = h === 'squad' ? ['hikari', 'rei'] : [h];
    const lines = STORY.missionLog(m, who, ok);
    modal(`<h2>Deploying: ${m.n}</h2><div class="deploy"><svg class="map" viewBox="0 0 600 300">${[...Array(12)].map((_, i) => `<path d="M${i * 50},0 v300" stroke="#3dd8ff" stroke-opacity=".15"/>`).join('')}${[...Array(6)].map((_, i) => `<path d="M0,${i * 50} h600" stroke="#3dd8ff" stroke-opacity=".15"/>`).join('')}
      <path id="route" d="M60,240 C160,240 180,80 300,120 S460,60 530,70" stroke="#7fe8ff" stroke-width="4" fill="none" stroke-dasharray="10 8" class="dash"/>
      <circle cx="60" cy="240" r="10" fill="#7fe8ff"/><text x="60" y="275" fill="#7fe8ff" font-size="14" text-anchor="middle">HALO</text>
      <circle cx="530" cy="70" r="12" fill="#ff3355" class="pulse"/><circle cx="530" cy="70" r="30" fill="none" stroke="#ff3355" stroke-width="3" class="ping"/>
      <g id="unit"><circle r="16" fill="#fff" stroke="${WHO[who[0]].c}" stroke-width="4"/><text y="6" text-anchor="middle" font-size="16">${h === 'squad' ? '⚡' : h === 'rei' ? '🌑' : '⚡'}</text></g></svg>
      <div class="dlog" id="dlog"></div><div class="dprog"><i id="dprog"></i></div></div>`, { noclose: 1, wide: 1 });
    Sound.sfx('siren');
    const path = $('#route'), L = path.getTotalLength(), unit = $('#unit'), t0 = performance.now(), dur = skipping() ? 800 : 4200, my = run;
    const anim = now => {
      if (my !== run || !$('#unit')) return;
      const k = clamp((now - t0) / dur, 0, 1), pt = path.getPointAtLength(L * k); unit.setAttribute('transform', `translate(${pt.x},${pt.y})`);
      $('#dprog').style.width = k * 100 + '%';
      const li = Math.floor(k * lines.length);
      const dl = $('#dlog'); while (dl.children.length < Math.min(li + 1, lines.length)) { const d = document.createElement('div'); d.innerHTML = T(lines[dl.children.length]); dl.appendChild(d); Sound.sfx(dl.children.length === lines.length ? (ok ? 'punch' : 'miss') : 'type'); dl.scrollTop = 1e4; }
      if (k < 1) requestAnimationFrame(anim); else setTimeout(() => missionResult(m, h, who, ok, margin), 600);
    };
    requestAnimationFrame(anim);
  }
  function missionResult(m, h, who, ok, margin) {
    m.done = 1; m.ok = ok;
    const rank = !ok ? 'C' : margin > .35 ? 'S' : margin > .15 ? 'A' : 'B';
    const cr = ok ? Math.round(m.cr * (rank === 'S' ? 1.5 : rank === 'A' ? 1.2 : 1)) : Math.round(m.cr * .2), rep = ok ? m.rep : -1;
    G.credits += cr; G.rep = Math.max(0, G.rep + rep); if (ok) G.done++;
    const gains = [];
    who.forEach(w => {
      const s = G.heroes[w], g = ok ? 2 + (rank === 'S' ? 2 : 0) : 1; s[m.stat] = clamp(s[m.stat] + g, 0, 100); if (h === 'squad') s.team = clamp(s.team + 3, 0, 100);
      s.fat = clamp(s.fat + (ok ? 22 : 30), 0, 100); s.morale = clamp(s.morale + (ok ? 6 : -8), 0, 100); gains.push(`${WHO[w].n}: ${STAT[m.stat]} +${g}${h === 'squad' ? ', Teamwork +3' : ''}`);
    });
    if (rank === 'S') unlock('srank'); if (G.done >= 5) unlock('deploy5');
    Sound.sfx(ok ? 'success' : 'fail');
    const w0 = who[who.length === 2 ? (Math.random() < .5 ? 0 : 1) : 0], line = STORY.missionQuip(w0, ok, h === 'squad');
    modal(`<div class="result ${ok ? 'ok' : 'bad'}"><div class="stamp">${ok ? 'MISSION CLEAR' : 'MISSION FAILED'}</div><div class="rank">RANK <b>${rank}</b></div>
      <div class="rgrid"><div>💴 +${cr}</div><div>⭐ ${rep >= 0 ? '+' : ''}${rep}</div>${gains.map(g => `<div>${g}</div>`).join('')}</div>
      <div class="quip" style="--c:${WHO[w0].c}"><div class="qp">${Art.char(w0, ok ? 'happy' : 'sad', 'default', true)}</div><p><b>${WHO[w0].n}</b>${T(line)}</p></div>
      <button class="btn primary" id="rok">Continue</button></div>`, { noclose: 1 });
    if (ok) who.forEach(w => addAff(w, 1));
    $('#rok').onclick = () => { Sound.sfx('confirm'); useSlot(); };
  }

  function minigame(h, stat) {
    const s = G.heroes[h], zone = clamp(70 + s.ctl * 1.1 - s.fat * .5, 50, 190), W = 600;
    let round = 0, score = 0, pos = 0, dir = 1, speed = 5.2, running = true, zx = 0;
    const my = run;
    modal(`<h2>${STAT[stat]} Training · ${WHO[h].n}</h2><p class="sub">Press <kbd>SPACE</kbd> or click <b>STRIKE</b> when the needle is in the zone. 3 rounds.</p>
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
      if (round >= 3) { running = false; document.removeEventListener('keydown', key, true); setTimeout(() => trainResult(h, stat, score), 700); }
      else setTimeout(() => { place(); }, 250);
    };
    const key = e => { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); hit(); } };
    document.addEventListener('keydown', key, true);
    $('#strike').onclick = hit;
  }
  function trainResult(h, stat, score) {
    const s = G.heroes[h], before = s[stat], gain = Math.round(2 + score * .9 * (s.morale > 60 ? 1.15 : 1));
    s[stat] = clamp(s[stat] + gain, 0, 100); s.fat = clamp(s.fat + 18, 0, 100); s.morale = clamp(s.morale + (score >= 6 ? 4 : -3), 0, 100);
    G.energy -= 20; G.trains++; if (G.trains >= 5) unlock('coach');
    const line = STORY.trainQuip(h, score);
    Sound.sfx(score >= 6 ? 'levelup' : 'confirm');
    modal(`<div class="result ok"><div class="stamp small">TRAINING COMPLETE</div><div class="statup"><label>${STAT[stat]}</label><div class="bar big"><i style="width:${before}%"></i><i class="gain" style="left:${before}%;width:0"></i></div><b>${before} → ${s[stat]} <em>+${gain}</em></b></div>
      <div class="quip" style="--c:${WHO[h].c}"><div class="qp">${Art.char(h, score >= 6 ? 'happy' : score >= 3 ? 'smile' : 'pout', 'default', true)}</div><p><b>${WHO[h].n}</b>${T(line)}</p></div>
      <button class="btn primary" id="rok">Continue</button></div>`, { noclose: 1 });
    setTimeout(() => { const g = $('#modal .gain'); if (g) g.style.width = gain + '%'; }, 100);
    addAff(h, score >= 6 ? 2 : 1);
    $('#rok').onclick = () => { Sound.sfx('confirm'); useSlot(); };
  }

  function dossier(sel) {
    const list = ['hikari', 'rei', 'mira'], P = STORY.profiles[sel], s = G.heroes[sel];
    const radar = s ? (() => {
      const k = ['pow', 'ctl', 'team', 'morale'], pts = k.map((x, i) => { const a = -Math.PI / 2 + i * Math.PI / 2, r = s[x] / 100 * 80; return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`; }).join(' ');
      return `<svg viewBox="-18 0 236 200" class="radar">${[.25, .5, .75, 1].map(f => `<polygon points="${[0, 1, 2, 3].map(i => { const a = -Math.PI / 2 + i * Math.PI / 2; return `${100 + Math.cos(a) * 80 * f},${100 + Math.sin(a) * 80 * f}`; }).join(' ')}" fill="none" stroke="#ffffff22"/>`).join('')}
        <polygon points="${pts}" fill="${WHO[sel].c}55" stroke="${WHO[sel].c}" stroke-width="2" class="radarpoly"/>${['POW', 'CTL', 'TEAM', 'MOR'].map((l, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; return `<text x="${100 + Math.cos(a) * 94}" y="${104 + Math.sin(a) * 94}" text-anchor="middle" font-size="11" fill="#cde">${l}</text>`; }).join('')}</svg>`;
    })() : `<div class="mirastat">Medical Officer<br><small>Not deployable · Support</small></div>`;
    const inv = Object.entries(G.inv).filter(([, n]) => n > 0);
    modal(`<div class="dossier"><div class="dtabs">${list.map(h => `<button class="dtab ${h === sel ? 'on' : ''}" data-h="${h}" style="--c:${WHO[h].c}">${WHO[h].n}</button>`).join('')}</div>
      <div class="dbody"><div class="dport" style="--c:${WHO[sel].c}">${Art.char(sel, 'smile', 'hip')}</div>
      <div class="dsinfo"><h2 style="color:${WHO[sel].c}">${P.full}</h2><div class="dtag">${P.tag}</div><table>${P.rows.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table><p>${P.bio}</p>
      <div class="aff">${heart(G.aff[sel])} <b>${tier(G.aff[sel])}</b> <small>(♥ ${G.aff[sel]})</small></div><div class="likes">Likes: ${G.aff[sel] >= 4 ? P.likes : '??? — get closer to find out'}</div>
      <div class="gifts"><h4>Give a Gift ${G.gifted[sel] ? '<small>(already gifted today)</small>' : ''}</h4>${inv.length ? inv.map(([k, n]) => `<button class="btn gift" data-k="${k}" ${G.gifted[sel] ? 'disabled' : ''}>${STORY.items[k].icon} ${STORY.items[k].n} ×${n}</button>`).join('') : '<small>Inventory empty — visit the Shop.</small>'}</div></div>
      <div class="dradar">${radar}${s ? `<div class="fatm">Fatigue <div class="bar"><i style="width:${s.fat}%;background:#ff6b6b"></i></div></div>` : ''}</div></div></div>`, { wide: 1 });
    $$('#modal .dtab').forEach(b => b.onclick = () => { Sound.sfx('page'); dossier(b.dataset.h); });
    $$('#modal .gift').forEach(b => b.onclick = () => {
      const k = b.dataset.k, it = STORY.items[k]; G.inv[k]--; G.gifted[sel] = 1;
      const lv = it.love === sel ? 4 : (it.like || []).includes(sel) ? 2 : 1; if (lv === 4) unlock('gift');
      const line = STORY.giftLine(sel, lv);
      dossier(sel); addAff(sel, lv);
      const q = document.createElement('div'); q.className = 'giftq'; q.style.setProperty('--c', WHO[sel].c); q.innerHTML = `<div class="qp">${Art.char(sel, lv === 4 ? 'love' : lv === 2 ? 'happy' : 'smile', 'default', true)}</div><p><b>${WHO[sel].n}</b>${T(line)}</p>`;
      $('#modal .panel').appendChild(q);
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
    const finish = () => { const pr = $('#preply'); pr.innerHTML = '<button class="btn primary" id="pdone">Close Phone</button>'; $('#pdone').onclick = () => { closeModal(); Sound.sfx('cancel'); if (isNight) sleepThen(); else advance(); }; };
    (async () => {
      await seq(convo.msgs);
      if (!convo.replies) return finish();
      const pr = $('#preply'); if (!pr) return;
      pr.innerHTML = convo.replies.map((r, i) => `<button class="btn reply" data-i="${i}">${T(r.t)}</button>`).join('');
      $$('#preply .reply').forEach(b => b.onclick = async () => {
        const r = convo.replies[+b.dataset.i]; pr.innerHTML = ''; add(r.t, true); G.replies++; if (G.replies >= 3) unlock('night');
        if (r.aff) addAff(who, r.aff); await sleep(400); await seq(r.resp || []); finish();
      });
    })();
  }
  function night() {
    wait = 'modal'; hideHub(); setBg('apartment'); setTint('night'); Sound.play('night'); G.vis.music = 'night';
    Object.keys(G.vis.chars).forEach(hideChar);
    const cand = ['hikari', 'rei', 'mira'].sort((a, b) => ((G.today[b] || 0) * 3 + G.aff[b]) - ((G.today[a] || 0) * 3 + G.aff[a]));
    const who = cand[0], convo = STORY.phone[who][Math.min(G.day, 3) - 1];
    setTimeout(() => phone(who, convo, true), skipping() ? 50 : 900);
  }
  function sleepThen() {
    const c = $('#card'); c.className = 'on sleep'; c.innerHTML = `<div class="zzzbig">Z<span>z</span><span>z</span></div>`; Sound.sfx('snore');
    later(1800, () => { c.className = ''; advance(); });
  }
  function nextDay() {
    G.day++; G.slot = 0; G.energy = 100; G.gifted = {}; G.today = {}; G.missions = []; G.weather = [0, 1, 2, 0][G.day % 4];
    ['hikari', 'rei'].forEach(h => { const s = G.heroes[h]; s.fat = clamp(s.fat - 40, 0, 100); });
    setTint(null);
  }

  // ---------- save / load ----------
  function snapshot(desc) { return { G: JSON.parse(JSON.stringify(G)), t: Date.now(), desc: desc || describe(), bg: G.vis.bg }; }
  function describe() { const f = top(); const ch = f && f.id.startsWith('prologue') ? 'Prologue' : 'Chapter 1'; return G.slot !== undefined && f && R[f.id] && R[f.id][f.i] && R[f.id][f.i][0] === 'hub' ? `${ch} · Day ${G.day} · ${SLOTS[G.slot] || 'Night'}` : `${ch} · Day ${G.day}` + (log.length ? ` — “${log[log.length - 1].t.slice(0, 40)}…”` : ''); }
  const canSave = () => G && ['text', 'choice', 'hub'].includes(wait) && !modalOpen();
  function saveTo(k, silent) { if (!G) return; LS.set('hl_save_' + k, snapshot()); if (!silent) { toast('💾 Saved', k === 'q' ? 'Quick save' : 'Slot ' + k); Sound.sfx('confirm'); } }
  function autosave() { if (G) LS.set('hl_save_a', snapshot()); }
  function loadFrom(k) {
    const d = LS.get('hl_save_' + k); if (!d) return false;
    run++; closeModal(); hideTitle(); clearInterval(typeTimer); typing = false; auto = skip = false; updateQuick();
    G = Object.assign(newState(), d.G); $('#choices').className = ''; $('#card').className = ''; hideHub(); $('#textbox').classList.add('hide');
    Sound.init(); restoreVis(); wait = null; step(); toast('📂 Loaded', d.desc); return true;
  }
  function slotsModal(mode) {
    const keys = ['a', 'q', 1, 2, 3, 4, 5, 6];
    modal(`<h2>${mode === 'save' ? 'Save Game' : 'Load Game'}</h2><div class="slots">${keys.map(k => {
      const d = LS.get('hl_save_' + k), lock = mode === 'save' && (k === 'a');
      return `<button class="slot ${d ? '' : 'empty'} ${lock ? 'lock' : ''}" data-k="${k}"><div class="sthumb">${d ? Art.bg(d.bg) : ''}</div><div class="stxt"><b>${k === 'a' ? 'AUTO' : k === 'q' ? 'QUICK' : 'SLOT ' + k}</b><small>${d ? d.desc : '— empty —'}</small><small>${d ? new Date(d.t).toLocaleString() : ''}</small></div></button>`;
    }).join('')}</div>`, { wide: 1 });
    $$('#modal .slot').forEach(b => b.onclick = () => {
      const k = b.dataset.k;
      if (mode === 'save') { if (k === 'a') return Sound.sfx('fail'); saveTo(k); slotsModal('save'); }
      else if (!loadFrom(k)) Sound.sfx('fail');
    });
  }

  // ---------- menus ----------
  function settingsModal() {
    const sl = (k, l, min, max, stp) => `<label class="set"><span>${l}</span><input type="range" min="${min}" max="${max}" step="${stp}" data-k="${k}" value="${settings[k]}"><em>${settings[k]}</em></label>`;
    const tg = (k, l) => `<label class="set tg"><span>${l}</span><button class="tog ${settings[k] ? 'on' : ''}" data-k="${k}"><i></i></button></label>`;
    modal(`<h2>Settings</h2><div class="sets">${sl('textSpeed', 'Text Speed (120 = instant)', 10, 120, 5)}${sl('autoDelay', 'Auto-Advance Delay (s)', .5, 4, .1)}${sl('music', 'Music Volume', 0, 1, .05)}${sl('sfx', 'SFX Volume', 0, 1, .05)}
      ${tg('voice', 'Voice Blips')}${tg('hints', 'Affection Hints on Choices')}${tg('motion', 'Screen Shake & Flashes')}</div>
      <div class="row"><button class="btn" id="fs">⛶ Toggle Fullscreen</button></div>`, { small: 1 });
    $$('#modal input[type=range]').forEach(r => r.oninput = () => { settings[r.dataset.k] = +r.value; r.nextElementSibling.textContent = r.value; applySettings(); saveSettings(); });
    $$('#modal .tog').forEach(b => b.onclick = () => { settings[b.dataset.k] = !settings[b.dataset.k]; b.classList.toggle('on'); applySettings(); saveSettings(); Sound.sfx('click'); });
    $('#fs').onclick = () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => { }); };
  }
  function logModal() {
    unlock('log');
    modal(`<h2>Backlog</h2><div class="log" id="logb">${log.map(l => `<div class="ll"><b style="color:${l.c}">${l.n}</b><p>${l.t}</p></div>`).join('') || '<p class="sub">Nothing yet.</p>'}</div>`, { wide: 1 });
    const b = $('#logb'); b.scrollTop = b.scrollHeight;
  }
  function galleryModal() {
    modal(`<h2>CG Gallery</h2><p class="sub">${Object.keys(meta.gallery).length} / ${Object.keys(Art.CG_NAMES).length} unlocked</p><div class="gallery">${Object.entries(Art.CG_NAMES).map(([k, n]) => `<button class="gthumb ${meta.gallery[k] ? '' : 'locked'}" data-k="${k}"><div class="gimg">${meta.gallery[k] ? Art.cg(k) : '<span>🔒</span>'}</div><small>${meta.gallery[k] ? n : '???'}</small></button>`).join('')}</div>`, { wide: 1 });
    $$('#modal .gthumb').forEach(b => b.onclick = () => {
      if (b.classList.contains('locked')) return Sound.sfx('fail');
      const v = $('#viewer'); v.innerHTML = Art.cg(b.dataset.k) + `<div class="vcap">${Art.CG_NAMES[b.dataset.k]} — click to close</div>`; v.className = 'on'; Sound.sfx('confirm');
      v.onclick = () => { v.className = ''; v.innerHTML = ''; };
    });
  }
  function achModal() {
    modal(`<h2>Achievements</h2><p class="sub">${Object.keys(meta.ach).length} / ${Object.keys(ACH).length}</p><div class="achs">${Object.entries(ACH).map(([k, [n, d]]) => `<div class="achi ${meta.ach[k] ? 'got' : ''}"><div class="aic">${meta.ach[k] ? '🏆' : '🔒'}</div><div><b>${n}</b><small>${d}</small></div></div>`).join('')}</div>`, { wide: 1 });
  }
  function pauseMenu() {
    modal(`<h2>Menu</h2><div class="pmenu">${[['resume', 'Resume'], ['save', 'Save'], ['load', 'Load'], ['log', 'Backlog'], ['settings', 'Settings'], ['ach', 'Achievements'], ['title', 'Return to Title']].map(([k, n]) => `<button class="btn" data-k="${k}">${n}</button>`).join('')}</div>`, { small: 1 });
    $$('#modal .pmenu .btn').forEach(b => b.onclick = () => {
      Sound.sfx('click'); const k = b.dataset.k;
      if (k === 'resume') closeModal(); else if (k === 'save') canSave() || wait === 'hub' ? (closeModal(), slotsModal('save')) : toast('Can\'t save right now'); else if (k === 'load') slotsModal('load');
      else if (k === 'log') logModal(); else if (k === 'settings') settingsModal(); else if (k === 'ach') achModal();
      else if (k === 'title') { closeModal(); toTitle(); }
    });
  }
  function quick(k) {
    Sound.sfx('click');
    if (k === 'auto') { auto = !auto; skip = false; if (auto && wait === 'text' && !typing) advance(); }
    else if (k === 'skip') { skip = !skip; auto = false; if (skip && wait === 'text') { typing ? $('#textbox')._done() : advance(); } }
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
    Sound.play('title');
    const t = $('#title'); t.classList.add('on');
    $('#tcont').classList.toggle('dis', !latestSave());
    $('#tchars').innerHTML = `<div class="tch h">${Art.char('hikari', 'happy', 'wave')}</div><div class="tch r">${Art.char('rei', 'smug', 'cross')}</div><div class="tch m">${Art.char('mira', 'smile', 'shy')}</div>`;
    $('#tbadge').textContent = meta.cleared ? '★ Chapter 1 Cleared' : 'Tech Demo · Prologue + Chapter 1';
  }
  function hideTitle() { $('#title').classList.remove('on'); }
  const latestSave = () => ['a', 'q', 1, 2, 3, 4, 5, 6].map(k => [k, LS.get('hl_save_' + k)]).filter(x => x[1]).sort((a, b) => b[1].t - a[1].t)[0];
  function newGame() {
    Sound.sfx('confirm'); hideTitle(); run++; log = [];
    G = newState(); G.stack = [{ id: 'prologue', i: 0 }];
    $('#fade').classList.add('on'); setTimeout(() => { $('#fade').classList.remove('on'); restoreVis(); step(); }, 700);
  }
  function theEnd() {
    wait = 'card'; skip = ctrlSkip = false; meta.cleared = true; saveMeta(); unlock('ch1');
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
    $('#game').addEventListener('wheel', e => { if (e.deltaY < 0 && G && !modalOpen() && wait === 'text') logModal(); });
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
    });
    document.addEventListener('keyup', e => { if (e.key === 'Control') { ctrlSkip = false; updateQuick(); } });
    $('#tnew').onclick = newGame;
    $('#tcont').onclick = () => { const l = latestSave(); if (l) loadFrom(l[0]); };
    $('#tload').onclick = () => slotsModal('load'); $('#tgal').onclick = galleryModal; $('#tach').onclick = achModal; $('#tset').onclick = settingsModal;
    $('#tcred').onclick = () => modal(`<h2>Credits</h2><div class="log">${STORY.credits.map(l => l.startsWith('#') ? `<h3>${l.slice(1)}</h3>` : `<p>${l.replace('{name}', 'You')}</p>`).join('')}</div>`, { small: 1 });
    $$('#title .tb').forEach(b => b.addEventListener('mouseenter', () => Sound.sfx('hover')));
    $('#splash').onclick = startSplash;
    const fit = () => { const k = Math.min(innerWidth / 1280, innerHeight / 720); $('#game').style.transform = `translate(-50%,-50%) scale(${k})`; };
    addEventListener('resize', fit); fit();
    const g = $('#game'); g.addEventListener('scroll', () => { g.scrollTop = 0; g.scrollLeft = 0; });
  }
  function startSplash() { const s = $('#splash'); if (!s.classList.contains('on')) return; s.classList.remove('on'); Sound.init(); Sound.sfx('chime'); toTitle(); }

  const api = { toast, unlock, addAff, flash, shake, setTint, get G() { return G; } };
  function boot() {
    Object.entries(STORY.scripts).forEach(([k, v]) => reg(v, k));
    Object.entries(STORY.events).forEach(([k, v]) => reg(v.s, k));
    loadPrefs(); bind(); requestAnimationFrame(fxLoop);
    $('#bgA').innerHTML = Art.bg('city_night'); $('#bgA').classList.add('show'); Fx.type = 'stars';
  }
  return { boot, get G() { return G; }, WHO };
})();
window.addEventListener('DOMContentLoaded', Game.boot);

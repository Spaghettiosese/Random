'use strict';
// Visual novel engine: script compiler + runner, stage renderer, text box, choices,
// saves, backlog, config, gallery.
(function () {
  const $ = s => document.querySelector(s), el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const store = { get(k, d) { try { const v = localStorage.getItem('aegis.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('aegis.' + k, JSON.stringify(v)); } catch (e) { } }, del(k) { try { localStorage.removeItem('aegis.' + k); } catch (e) { } } };
  const WHO = { a: 'akari', r: 'rei', m: 'mio', t: 'touko' };
  const POS = { left: 140, cl: 225, center: 320, cr: 415, right: 500 };
  const PSCALE = 1.15;

  const AH = window.AH = {
    $, el, sleep, store, hooks: {}, script: {}, order: [],
    cfg: Object.assign({ textSpeed: 45, autoDelay: 1.6, music: .55, sfx: .7 }, store.get('cfg', {})),
    state: null, log: [], mode: { auto: false, skip: false }, busy: false,
    scene: { bg: 'black', tod: null, cg: null, cgArg: null, cgT: 0, chars: [], custom: null, speaker: null, typing: false },
  };
  const freshState = () => ({ name: 'Haru', label: 'prologue', idx: 0, vars: {}, chapter: 'Prologue',
    sim: { active: false, day: 1, slot: 0, energy: 100, funds: 500, rep: 0, gifts: 0,
      h: { akari: { pow: 22, ctl: 8, hrt: 14, aff: 0, bond: 0 }, rei: { pow: 14, ctl: 22, hrt: 6, aff: 0, bond: 0 }, mio: { pow: 10, ctl: 16, hrt: 12, aff: 0, bond: 0 } } } });

  // ---------------- script compiler ----------------
  AH.compile = src => {
    let cur = null, lastChoice = null;
    for (const raw of src.split('\n')) {
      const l = raw.trim(); if (!l || l.startsWith('//')) continue;
      if (l[0] === '#') { cur = l.slice(1).trim(); AH.script[cur] = []; AH.order.push(cur); continue; }
      const S = AH.script[cur];
      if (l[0] === '@') { const sp = l.indexOf(' '), c = sp < 0 ? l.slice(1) : l.slice(1, sp), raw2 = sp < 0 ? '' : l.slice(sp + 1).trim(); S.push({ c, raw: raw2, a: raw2 ? raw2.split(/\s+/) : [] }); }
      else if (l[0] === '?') { lastChoice = { c: 'choice', prompt: l.slice(1).trim(), opts: [] }; S.push(lastChoice); }
      else if (l[0] === '*') { const k = l.lastIndexOf('->'); lastChoice.opts.push({ text: l.slice(1, k).trim(), to: l.slice(k + 2).trim() }); }
      else if (l[0] === '>') S.push({ c: 'say', who: null, text: l.slice(1).trim() });
      else { const m = l.match(/^(\w+|\[[^\]]+\])(?: (\w+))?(?: (\w+))?:\s(.*)$/); if (!m) { console.warn('script?', l); continue; } S.push({ c: 'say', who: m[1], expr: m[2], pose: m[3], text: m[4] }); }
    }
  };

  // ---------------- stage renderer ----------------
  const cv = $('#cv'), cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
  const snap = document.createElement('canvas'); snap.width = 640; snap.height = 360; const snapX = snap.getContext('2d');
  let fadeA = 0, shakeT = 0, T0 = performance.now() / 1000, lastT = T0;
  AH.time = () => performance.now() / 1000 - T0;
  AH.tod = () => AH.scene.tod != null ? AH.scene.tod : (AH.state && AH.state.sim.active ? AH.state.sim.slot : 0);
  AH.transition = () => { snapX.clearRect(0, 0, 640, 360); snapX.drawImage(cv, 0, 0); fadeA = 1; };
  function frame() {
    const now = performance.now() / 1000, t = now - T0, dt = Math.min(.05, now - lastT); lastT = now;
    const sc = AH.scene;
    cx.save();
    if (shakeT > 0) { shakeT -= dt; cx.translate(Math.round((Math.random() - .5) * 10 * Math.min(1, shakeT * 3)), Math.round((Math.random() - .5) * 8 * Math.min(1, shakeT * 3))); }
    if (sc.custom) sc.custom(cx, t, dt);
    else if (sc.cg) AHArt.CG[sc.cg](cx, t - sc.cgT, sc.cgArg);
    else {
      AHArt.drawBg(cx, sc.bg, t, AH.tod());
      const talkOpen = sc.typing && Math.floor(t * 9) % 2 === 0;
      for (const c of sc.chars) {
        c.x += (c.tx - c.x) * Math.min(1, dt * 9); c.alpha += ((c.gone ? 0 : 1) - c.alpha) * Math.min(1, dt * 8);
        if (c.hop > 0) c.hop -= dt; if (c.shake > 0) c.shake -= dt;
        if (now > c.nextBlink) { c.blinkEnd = now + .13; c.nextBlink = now + 2.2 + Math.random() * 3.5; }
      }
      sc.chars = sc.chars.filter(c => !(c.gone && c.alpha < .03));
      const order = sc.chars.slice().sort((a, b) => (a.id === sc.speaker) - (b.id === sc.speaker));
      for (const c of order) {
        const sp = sc.speaker === c.id, img = AHChars.portrait(c.id, c.expr, c.pose, now < c.blinkEnd, sp && talkOpen, PSCALE);
        const hop = c.hop > 0 ? -Math.abs(Math.sin((0.4 - c.hop) / .4 * Math.PI * 2)) * 9 : 0, sh = c.shake > 0 ? Math.sin(c.shake * 60) * 4 : 0;
        const y = 360 - img.height + 46 + Math.round(Math.sin(t * 1.7 + c.phase) * 1.6) + (1 - c.alpha) * 10 + hop;
        cx.globalAlpha = Math.max(0, Math.min(1, c.alpha));
        if (sc.speaker && !sp && WHO_SET.has(sc.speaker)) cx.filter = 'brightness(.72)';
        cx.drawImage(img, Math.round(c.x - img.width / 2 + sh), Math.round(y));
        cx.filter = 'none'; cx.globalAlpha = 1;
      }
    }
    cx.restore();
    if (fadeA > 0) { fadeA -= dt * 2; cx.globalAlpha = Math.max(0, fadeA); cx.drawImage(snap, 0, 0); cx.globalAlpha = 1; }
    requestAnimationFrame(frame);
  }
  const WHO_SET = new Set(Object.values(WHO));
  const findChar = id => AH.scene.chars.find(c => c.id === id && !c.gone);
  AH.show = (id, expr, pose, pos, instant) => {
    let c = findChar(id); const tx = POS[pos] != null ? POS[pos] : null;
    if (!c) { const x = tx != null ? tx : 320; c = { id, expr: 'neutral', pose: 'down', x: instant ? x : x + (x < 320 ? -30 : 30), tx: x, alpha: instant ? 1 : 0, phase: Math.random() * 6, nextBlink: performance.now() / 1000 + 1 + Math.random() * 3, blinkEnd: 0, hop: 0, shake: 0 }; AH.scene.chars.push(c); }
    if (expr && expr !== '-') c.expr = expr; if (pose && pose !== '-') c.pose = pose; if (tx != null) c.tx = tx;
    return c;
  };
  AH.hide = id => { for (const c of AH.scene.chars) if (id === 'all' || c.id === id) c.gone = true; };
  AH.shake = (s = .5) => { shakeT = s; };
  AH.flash = async (col = '#fff', ms = 350) => { const f = $('#flash'); f.style.transition = 'none'; f.style.background = col; f.style.opacity = 1; await sleep(60); f.style.transition = `opacity ${ms}ms`; f.style.opacity = 0; };
  AH.fade = async on => { $('#fade').classList.toggle('on', on); await sleep(AH.mode.skip ? 60 : 520); };
  AH.toast = (html, col) => { const t = el('div', 'toast', html); if (col) t.style.setProperty('--c', col); $('#toasts').appendChild(t); setTimeout(() => t.remove(), 2700); };

  // ---------------- text box ----------------
  const box = $('#textbox'), nameEl = $('#name'), textEl = $('#text'), nextEl = $('#next');
  let advance = null, typingDone = null;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const fmt = s => esc(s.replace(/\{name\}/g, AH.state.name)).replace(/\*([^*]+)\*/g, '<em>$1</em>');
  function speakerInfo(who) {
    if (!who) return { name: null };
    if (who[0] === '[') return { name: who.slice(1, -1), color: '#6a78c0' };
    if (who === 'y') return { name: AH.state.name, color: '#2f9ad8', you: true };
    const id = WHO[who] || who, c = AHChars.CHARS[id]; return c ? { name: c.name, color: c.tag || c.color, id } : { name: who, color: '#6a78c0' };
  }
  async function say(st) {
    const info = speakerInfo(st.who), sc = AH.scene;
    if (info.id) { const c = findChar(info.id); if (c) { if (st.expr) c.expr = st.expr; if (st.pose) c.pose = st.pose; if (st.expr && /happy|laugh|sparkle|surprised|shock/.test(st.expr)) c.hop = .4; if (st.expr === 'angry') c.shake = .3; } }
    sc.speaker = info.id || (info.you ? 'you' : null);
    box.classList.remove('hidden'); $('#quick').classList.remove('hidden');
    nameEl.classList.toggle('none', !info.name); if (info.name) { nameEl.innerHTML = `<span>${esc(info.name)}</span>`; nameEl.style.setProperty('--tag', info.color); }
    let text = fmt(st.text), thought = !info.name && /^\(.*\)$/.test(st.text);
    AH.log.push({ name: info.name, color: info.color, text }); if (AH.log.length > 200) AH.log.shift();
    AH.state.preview = (info.name ? info.name + ': ' : '') + st.text.replace(/\{name\}/g, AH.state.name).replace(/\*/g, '');
    // wrap every visible character so the line can be revealed without reflowing
    textEl.innerHTML = ''; const holder = el('div', thought ? 'thought' : '', text), chars = [];
    const walk = n => { for (const k of [...n.childNodes]) { if (k.nodeType === 3) { const f = document.createDocumentFragment(); for (const ch of k.textContent) { const s = el('span', 'ch'); s.textContent = ch; chars.push(s); f.appendChild(s); } k.replaceWith(f); } else walk(k); } };
    walk(holder); textEl.appendChild(holder); nextEl.classList.remove('on');
    const voice = info.id === 'rei' || info.id === 'touko' || info.you ? 'blipLow' : 'blip';
    let i = 0, done = false; sc.typing = !!info.id;
    const finish = () => { done = true; for (const c of chars) c.classList.add('on'); };
    typingDone = finish;
    if (AH.mode.skip || AH.cfg.textSpeed >= 100) finish();
    else { const cps = 18 + AH.cfg.textSpeed * 1.1; let last = performance.now(), acc = 0;
      while (!done && i < chars.length) { await sleep(16); const n = performance.now(); acc += (n - last) / 1000 * cps; last = n;
        while (acc >= 1 && i < chars.length) { const ch = chars[i].textContent; chars[i++].classList.add('on'); acc -= 1; if (/[,.!?…—]/.test(ch)) acc -= ch === ',' ? 3 : 6; if (info.name && ch.trim() && i % 2 === 0) AHAudio.sfx(voice); } }
      finish(); }
    typingDone = null; sc.typing = false; nextEl.classList.add('on');
    await new Promise(res => {
      let tm = null; advance = () => { clearTimeout(tm); advance = null; res(); };
      if (AH.mode.skip) tm = setTimeout(() => advance && advance(), 45);
      else if (AH.mode.auto) tm = setTimeout(() => advance && advance(), 500 + AH.cfg.autoDelay * 600 + chars.length * 28);
    });
    if (!AH.mode.skip) AHAudio.sfx('next');
  }
  function userAdvance() {
    if (document.body.classList.contains('hideui')) { document.body.classList.remove('hideui'); return; }
    if (typingDone) typingDone(); else if (advance) advance();
  }
  async function choice(st) {
    setMode('skip', false); setMode('auto', false); nextEl.classList.remove('on');
    const wrap = $('#choices'); wrap.innerHTML = '';
    if (st.prompt) wrap.appendChild(el('div', 'prompt', fmt(st.prompt)));
    const pick = await new Promise(res => st.opts.forEach((o, i) => { const b = el('button', '', fmt(o.text)); b.style.animationDelay = i * 80 + 'ms'; b.onmouseenter = () => AHAudio.sfx('hover'); b.onclick = e => { e.stopPropagation(); AHAudio.sfx('confirm'); res(o); }; wrap.appendChild(b); }));
    wrap.innerHTML = ''; AH.log.push({ name: '▶', color: '#ffd766', text: '<span class="ch1">' + fmt(pick.text) + '</span>' });
    return pick.to;
  }
  function setMode(k, v) { AH.mode[k] = v; if (v) AH.mode[k === 'auto' ? 'skip' : 'auto'] = false; for (const b of document.querySelectorAll('#quick button')) if (b.dataset.q === 'auto' || b.dataset.q === 'skip') b.classList.toggle('on', AH.mode[b.dataset.q]);
    if (v && advance && !typingDone) advance(); if (v && k === 'skip' && typingDone) typingDone(); }
  AH.setMode = setMode; AH.say = say;
  AH.hideBox = () => { box.classList.add('hidden'); $('#quick').classList.add('hidden'); AH.scene.speaker = null; };

  // ---------------- runner ----------------
  let runId = 0;
  const evalJs = code => new Function('s', 'v', 'h', 'AH', 'return (' + code + ')')(AH.state.sim, AH.state.vars, AH.state.sim.h, AH);
  AH.unlockCG = key => { const u = store.get('cg', []); if (!u.includes(key)) { u.push(key); store.set('cg', u); } };
  const waitMs = ms => sleep(AH.mode.skip ? Math.min(ms, 40) : ms);
  const CMD = {
    async bg(a) { const sc = AH.scene; AH.transition(); if (sc.cg) { sc.cg = null; AH.hud && AH.hud(); } $('#cgtitle').classList.remove('on'); sc.bg = a[0]; sc.tod = a[1] != null && a[1] !== '-' ? +a[1] : null; if (a[2] !== 'keep') sc.chars = []; sc.speaker = null; await waitMs(450); },
    async cg(a) { const sc = AH.scene; AH.transition();
      if (a[0] === 'off') { sc.cg = null; AH.hud && AH.hud(); $('#cgtitle').classList.remove('on'); await waitMs(400); return; }
      $('#hud').classList.add('hidden'); const [n, arg] = a[0].split(':'); sc.cg = n; sc.cgArg = arg || null; sc.cgT = AH.time(); sc.chars = []; AH.hideBox(); AH.unlockCG(a[0]);
      const title = (AHArt.CG_LIST.find(c => c[0] === a[0]) || [])[1]; if (title) { $('#cgtitle').textContent = '✦ ' + title; $('#cgtitle').classList.add('on'); setTimeout(() => $('#cgtitle').classList.remove('on'), 3200); }
      AHAudio.sfx('sparkle'); await waitMs(900); },
    show(a) { AH.show(a[0], a[1], a[2], a[3]); return waitMs(180); },
    hide(a) { AH.hide(a[0]); return waitMs(150); },
    move(a) { const c = findChar(a[0]); if (c) c.tx = POS[a[1]]; },
    hop(a) { const c = findChar(a[0]); if (c) c.hop = .4; },
    music(a) { a[0] === 'stop' ? AHAudio.stop(1) : AHAudio.play(a[0]); AH.scene.music = a[0] === 'stop' ? null : a[0]; },
    sfx(a) { if (!AH.mode.skip) AHAudio.sfx(a[0]); },
    wait(a) { return waitMs(+a[0] * 1000); },
    flash(a) { return AH.mode.skip ? null : AH.flash(a[0] || '#fff'); },
    shake(a) { AH.shake(+a[0] || .5); },
    hidebox() { AH.hideBox(); },
    async fade(a) { await AH.fade(a[0] !== 'in'); },
    aff(a, st) { const h = AH.state.sim.h[a[0]], n = +a[1]; h.aff = Math.max(0, Math.min(100, h.aff + n)); const c = AHChars.CHARS[a[0]]; if (n > 0) { AH.toast(`<b>♥</b> ${c.name} likes that <b>+${n}</b>`, '#ff6f9c'); AHAudio.sfx('heart'); } },
    set(a, st) { evalJs(st.raw); },
    jump(a) { return { jump: a[0] }; },
    if(a, st) { const k = st.raw.lastIndexOf('->'); if (evalJs(st.raw.slice(0, k))) return { jump: st.raw.slice(k + 2).trim() }; },
    async call(a, st) { const r = await AH.hooks[a[0]](...a.slice(1)); if (typeof r === 'string') return { jump: r }; },
    async card(a, st) { const [sub, title, note] = st.raw.split('|').map(s => s.trim()); AH.hideBox(); await AH.card(sub, title, note); },
    chapter(a, st) { AH.state.chapter = st.raw; },
    end() { return { end: true }; },
  };
  AH.card = async (sub, title, note) => { $('#cardSub').textContent = sub; $('#cardTitle').textContent = title; $('#cardNote').textContent = (note || '').replace(/\\n/g, '\n'); const c = $('#card'); c.classList.remove('hidden'); AHAudio.sfx('chime');
    await new Promise(res => { const tm = setTimeout(done, AH.mode.skip ? 500 : 4200); function done() { clearTimeout(tm); c.onclick = null; res(); } setTimeout(() => { c.onclick = done; }, 900); }); c.classList.add('hidden'); };
  AH.run = async (label, idx = 0) => {
    const my = ++runId, S = AH.state; S.label = label; S.idx = idx;
    if (advance) { const a = advance; advance = null; a(); } if (typingDone) typingDone();
    $('#choices').innerHTML = '';
    while (my === runId) {
      let steps = AH.script[S.label];
      if (!steps) { console.error('no label', S.label); return; }
      if (S.idx >= steps.length) { const k = AH.order.indexOf(S.label); if (k < 0 || k + 1 >= AH.order.length) return; S.label = AH.order[k + 1]; S.idx = 0; continue; }
      const st = steps[S.idx]; let r;
      try {
        if (st.c === 'say') await say(st);
        else if (st.c === 'choice') { const to = await choice(st); if (my !== runId) return; r = { jump: to }; }
        else if (CMD[st.c]) r = await CMD[st.c](st.a, st);
        else console.warn('unknown command', st.c);
      } catch (e) { console.error('script error at', S.label, S.idx, e); }
      if (my !== runId) return;
      if (r && r.end) return;
      if (r && r.jump) { S.label = r.jump; S.idx = 0; } else S.idx++;
    }
  };
  AH.stopRun = () => { runId++; if (advance) { const a = advance; advance = null; a(); } if (typingDone) typingDone(); setMode('skip', false); setMode('auto', false); };

  // ---------------- save / load ----------------
  AH.snapshot = () => { const sc = AH.scene, S = AH.state; return JSON.parse(JSON.stringify({ v: 1, when: Date.now(), state: S,
    scene: { bg: sc.bg, tod: sc.tod, cg: sc.cg, cgArg: sc.cgArg, music: AHAudio.current, chars: sc.chars.filter(c => !c.gone).map(c => ({ id: c.id, expr: c.expr, pose: c.pose, tx: c.tx })) } })); };
  AH.save = slot => { store.set('save.' + slot, AH.snapshot()); if (slot !== 0) { AHAudio.sfx('save'); AH.toast('Saved to <b>slot ' + slot + '</b>'); } };
  AH.load = async slot => {
    const d = store.get('save.' + slot); if (!d) return false;
    AH.stopRun(); await AH.fade(true); AH.closeModal(); AH.hooks.resetUi && AH.hooks.resetUi();
    AH.state = d.state; const sc = AH.scene; sc.bg = d.scene.bg; sc.tod = d.scene.tod; sc.cg = d.scene.cg; sc.cgArg = d.scene.cgArg; sc.cgT = AH.time(); sc.custom = null; sc.chars = []; sc.speaker = null;
    for (const c of d.scene.chars) { const n = AH.show(c.id, c.expr, c.pose, null, true); n.x = n.tx = c.tx; }
    AH.log = []; AH.hideBox(); $('#title').classList.add('hidden'); AHAudio.play(d.scene.music);
    AH.fade(false); AH.run(AH.state.label, AH.state.idx); return true;
  };
  const slotInfo = n => { const d = store.get('save.' + n); if (!d) return null; const dt = new Date(d.when), s = d.state; return { title: s.chapter + (s.sim.active ? ` · Day ${s.sim.day}` : ''), when: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), preview: s.preview || '' }; };

  // ---------------- modal screens ----------------
  const modal = $('#modal'), mBody = $('#modalBody');
  AH.openModal = (title, build) => { $('#modalTitle').textContent = title; mBody.innerHTML = ''; mBody.className = ''; build(mBody); modal.classList.remove('hidden'); AHAudio.sfx('click'); };
  AH.closeModal = () => { modal.classList.add('hidden'); mBody.innerHTML = ''; if (galleryView) document.body.classList.remove('hideui'); modal.style.background = ''; $('.modal-in').style.visibility = ''; galleryView = null; if (AH.scene.custom === galleryDraw) AH.scene.custom = prevCustom; };
  $('#modalClose').onclick = () => { AHAudio.sfx('cancel'); if (galleryView) { galleryView = null; document.body.classList.remove('hideui'); AH.scene.custom = prevCustom; modal.style.background = ''; $('.modal-in').style.visibility = ''; return; } AH.closeModal(); };
  AH.saveScreen = isSave => AH.openModal(isSave ? 'SAVE' : 'LOAD', b => {
    const g = el('div', 'slots'); b.appendChild(g);
    for (const n of isSave ? [1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6]) { const info = slotInfo(n), bt = el('button', 'slot', `<div class="sn">${n === 0 ? 'AUTO' : '0' + n}</div><div class="si">${info ? `<b>${esc(info.title)}</b><span>${info.when}</span><i>${esc(info.preview)}</i>` : '<b>— Empty —</b>'}</div>`);
      if (n === 0) bt.querySelector('.sn').style.fontSize = '22px';
      bt.disabled = !isSave && !info; bt.onmouseenter = () => AHAudio.sfx('hover');
      bt.onclick = () => { if (isSave) { AH.save(n); AH.saveScreen(true); } else AH.load(n); }; g.appendChild(bt); }
  });
  AH.configScreen = () => AH.openModal('CONFIG', b => {
    const g = el('div', 'cfg'); b.appendChild(g);
    const row = (label, key, min, max, fmtV, on) => { g.appendChild(el('label', '', label)); const i = el('input'); i.type = 'range'; i.min = min; i.max = max; i.value = AH.cfg[key] * (max === 100 && key !== 'textSpeed' ? 100 : 1); const v = el('div', 'val', fmtV(+i.value)); g.appendChild(i); g.appendChild(v);
      i.oninput = () => { AH.cfg[key] = key === 'textSpeed' || key === 'autoDelay' ? +i.value : +i.value / 100; v.textContent = fmtV(+i.value); store.set('cfg', AH.cfg); on && on(); }; };
    row('Text speed', 'textSpeed', 5, 100, v => v >= 100 ? 'MAX' : v);
    row('Auto-mode delay', 'autoDelay', 0, 5, v => v + 's');
    row('Music volume', 'music', 0, 100, v => v + '%', () => AHAudio.setVol('music', AH.cfg.music));
    row('Sound volume', 'sfx', 0, 100, v => v + '%', () => { AHAudio.setVol('sfx', AH.cfg.sfx); AHAudio.sfx('confirm'); });
    const w = el('div', 'wide'); g.appendChild(w);
    const fs = el('button', 'pbtn', 'FULLSCREEN'); fs.onclick = () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => { }); }; w.appendChild(fs);
    if (AH.state && !$('#title').offsetParent) { const t = el('button', 'pbtn', 'RETURN TO TITLE'); t.onclick = () => { AH.closeModal(); AH.hooks.toTitle(); }; w.appendChild(t); }
  });
  AH.logScreen = () => AH.openModal('BACKLOG', b => { b.className = 'log'; for (const l of AH.log) { const p = el('p', '', (l.name ? `<b>${esc(l.name)}</b>` : '<b></b>') + l.text); if (l.color) p.style.setProperty('--c', l.color); b.appendChild(p); } if (!AH.log.length) b.innerHTML = '<p>Nothing yet.</p>'; setTimeout(() => b.scrollTop = b.scrollHeight, 0); });
  let galleryView = null, prevCustom = null;
  const galleryDraw = (x, t) => { const [n, arg] = galleryView.split(':'); AHArt.CG[n](x, t - galT, arg); }; let galT = 0;
  AH.galleryScreen = () => AH.openModal('GALLERY', b => {
    const g = el('div', 'gallery'), un = store.get('cg', []); b.appendChild(g);
    for (const [key, title] of AHArt.CG_LIST) { const bt = el('button'); if (un.includes(key)) { const c = document.createElement('canvas'); c.width = 640; c.height = 360; const [n, arg] = key.split(':'); const x = c.getContext('2d'); x.imageSmoothingEnabled = false; AHArt.CG[n](x, 3.4, arg); bt.appendChild(c); bt.appendChild(el('span', '', title));
        bt.onclick = () => { AHAudio.sfx('confirm'); prevCustom = AH.scene.custom; document.body.classList.add('hideui'); galleryView = key; galT = AH.time(); AH.scene.custom = galleryDraw; modal.style.background = 'transparent'; $('.modal-in').style.visibility = 'hidden'; $('#modalClose').style.visibility = 'visible'; }; }
      else { bt.disabled = true; bt.appendChild(el('div', 'locked')); bt.appendChild(el('span', '', '???')); } g.appendChild(bt); }
    b.appendChild(el('p', '', `<br><span style="color:#9aa6d8">${un.length} / ${AHArt.CG_LIST.length} unlocked · click a picture to watch it animated</span>`));
  });
  modal.addEventListener('click', e => { if (galleryView && e.target === modal) $('#modalClose').onclick(); });
  AH.hooks.name = () => new Promise(res => AH.openModal('IDENTIFICATION', b => {
    const w = el('div', 'namer', '<p>What is your name, Handler?</p>'), i = el('input'); i.maxLength = 12; i.value = AH.state.name; w.appendChild(i); const ok = el('button', 'pbtn', 'CONFIRM'); w.appendChild(el('br')); w.appendChild(ok); b.appendChild(w); $('#modalClose').style.display = 'none';
    const done = () => { AH.state.name = i.value.trim() || 'Haru'; $('#modalClose').style.display = ''; AHAudio.sfx('confirm'); AH.closeModal(); res(); }; ok.onclick = done; i.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') done(); }; setTimeout(() => { i.focus(); i.select(); }, 50);
  }));

  // ---------------- input ----------------
  document.querySelectorAll('#quick button').forEach(b => { b.onmouseenter = () => AHAudio.sfx('hover'); b.onclick = e => { e.stopPropagation(); const q = b.dataset.q; AHAudio.sfx('click');
    if (q === 'auto' || q === 'skip') setMode(q, !AH.mode[q]); else if (q === 'log') AH.logScreen(); else if (q === 'save') AH.saveScreen(true); else if (q === 'load') AH.saveScreen(false); else if (q === 'config') AH.configScreen(); else if (q === 'hide') document.body.classList.add('hideui'); }; });
  $('#stage').addEventListener('click', e => { if (e.target.closest('button, input, #modal, #title, #hub, #hud, #card, #start, #sceneui')) return; if (AH.mode.skip) { setMode('skip', false); return; } userAdvance(); });
  window.addEventListener('keydown', e => {
    if (!$('#start').classList.contains('hidden')) return;
    if (!modal.classList.contains('hidden')) { if (e.key === 'Escape') $('#modalClose').onclick(); return; }
    if (!$('#title').classList.contains('hidden')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!box.classList.contains('hidden') && !$('#choices').children.length) userAdvance(); }
    else if (e.key === 'Control') setMode('skip', true);
    else if (e.key === 'Escape') AH.configScreen(); else if (e.key === 'l' || e.key === 'L') AH.logScreen(); else if (e.key === 'h' || e.key === 'H') document.body.classList.toggle('hideui'); else if (e.key === 'a' || e.key === 'A') setMode('auto', !AH.mode.auto);
  });
  window.addEventListener('keyup', e => { if (e.key === 'Control') setMode('skip', false); });
  $('#stage').addEventListener('wheel', e => { if (e.deltaY < 0 && modal.classList.contains('hidden') && !box.classList.contains('hidden')) AH.logScreen(); }, { passive: true });
  function fit() { const s = Math.min(innerWidth / 1280, innerHeight / 720), st = $('#stage'); st.style.transform = `scale(${s})`; st.style.marginLeft = -640 * s + 'px'; st.style.marginTop = -360 * s + 'px'; }
  window.addEventListener('resize', fit); fit();
  $('#stage').addEventListener('scroll', () => { $('#stage').scrollLeft = 0; $('#stage').scrollTop = 0; });

  AH.newState = () => { AH.state = freshState(); AH.log = []; };
  AH.newState();
  requestAnimationFrame(frame);
})();

/* HEARTLINE AGENCY — Dispatch shifts: real-time call management on a city map. */
const Dispatch = (() => {
  const ST = ['com', 'vig', 'mob', 'cha', 'int'];
  const SN = { com: 'Combat', vig: 'Vigor', mob: 'Mobility', cha: 'Charisma', int: 'Intellect' };
  const SI = { com: '👊', vig: '❤️', mob: '👟', cha: '💬', int: '🧠' };
  const HQ = [400, 235];
  const DIST = { harbor: ['Harbor', 680, 385], shibuya: ['Shibuya', 215, 300], akiba: ['Akiba', 560, 110], oldtown: ['Old Town', 135, 125], uptown: ['Uptown', 380, 80], industrial: ['Industrial', 705, 190], riverside: ['Riverside', 360, 400], park: ['Ueno Park', 560, 295] };
  const TIERC = ['#6fffb0', '#6fffb0', '#ffd24a', '#ff8a3a', '#ff3355'];
  const STATE = { ready: 'READY', travel: 'EN ROUTE', work: 'ON SCENE', ret: 'RETURNING', rest: 'RESTING', hurt: 'INJURED' };
  let S = null, ctx = null, raf = 0, lastRender = 0;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = m => { const t = ((S && S.cfg.start) || 9) * 60 + Math.floor(m); return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const H = id => ctx.G.heroes[id];

  function pent(vals, max, r = 70, cx = 90, cy = 90) {
    return ST.map((k, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5, v = clamp((vals[k] || 0) / max, 0, 1.15) * r; return `${(cx + Math.cos(a) * v).toFixed(1)},${(cy + Math.sin(a) * v).toFixed(1)}`; }).join(' ');
  }
  function teamStats(team) { const t = {}; ST.forEach(k => t[k] = team.reduce((s, id) => s + H(id).st[k], 0)); return t; }
  function synergy(team) {
    let v = 0; const notes = [];
    for (let i = 0; i < team.length; i++) for (let j = i + 1; j < team.length; j++) { const r = ctx.synergy(team[i], team[j]); if (r) { v += r[0]; notes.push(r[1]); } }
    return [clamp(v, -.25, .25), notes];
  }
  function chance(call, team) {
    if (!team.length) return 0;
    const t = teamStats(team); let need = 0, got = 0, over = 0;
    ST.forEach(k => { need += call.req[k]; got += Math.min(t[k], call.req[k]); over += Math.max(0, t[k] - call.req[k]); });
    const cover = need ? got / need : 1, fat = team.reduce((s, id) => s + H(id).fat, 0) / team.length;
    return clamp(.06 + .9 * Math.pow(cover, 1.35) + Math.min(.08, over / 120) + synergy(team)[0] - fat / 500, .03, .98);
  }

  // ---------- setup ----------
  function start(cfg, c) {
    ctx = c; cancelAnimationFrame(raf);
    const G = ctx.G, r = mkRng(cfg.seed || (G.day * 97 + 13));
    S = { cfg, t: 0, len: cfg.len || 480, speed: 1, calls: [], sel: null, n: 0, ok: 0, fail: 0, miss: 0, xp: {}, hero: {}, spawn: [], tip: 0, done: false, evOpen: false, r, flags: {} };
    G.roster.forEach(id => { S.hero[id] = { s: H(id).hurt ? 'hurt' : 'ready', call: null, until: 0 }; S.xp[id] = 0; });
    const n = cfg.calls || 8, span = S.len - 70;
    for (let i = 0; i < n; i++) S.spawn.push({ at: Math.round(8 + (i / n) * span + r() * span / n * .7) });
    (cfg.special || []).forEach(sp => S.spawn.push({ at: sp.at, special: sp }));
    S.spawn.sort((a, b) => a.at - b.at);
    if (cfg.tutorial) S.spawn[0].at = 2;
    build(); lastT = performance.now(); raf = requestAnimationFrame(loop);
    ctx.music('tension');
    tip(cfg.tutorial ? 0 : -1);
  }
  function mkRng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  function mkCall(sp) {
    const G = ctx.G, r = S.r, pool = ctx.calls.filter(c => (c.tier || 1) >= (S.cfg.tiers || [1, 3])[0] && (c.tier || 1) <= (S.cfg.tiers || [1, 3])[1] && !S.usedT?.includes(c.t));
    const tpl = sp || pool[(r() * pool.length) | 0] || ctx.calls[0];
    S.usedT = (S.usedT || []).concat(tpl.t);
    const DM = { story: [.8, 1.4], normal: [1, 1], hard: [1.2, .8] }[G.diff || 'normal'];
    const dk = tpl.dist || Object.keys(DIST)[(r() * 8) | 0], d = DIST[dk], diff = (S.cfg.diff || 1) * DM[0];
    const rv = String(tpl.r).split(/\s+/).map(Number), req = {};
    ST.forEach((k, i) => req[k] = Math.round((rv[i] || 0) * diff));
    const a = r() * 6.28, rad = 18 + r() * 38;
    S.n++;
    return { id: S.n, t: tpl.t, d: tpl.d, req, slots: tpl.n || 1, tier: tpl.tier || 1, ev: tpl.ev, flag: tpl.flag, special: !!sp, dname: d[0],
      x: clamp(d[1] + Math.cos(a) * rad, 30, 770), y: clamp(d[2] + Math.sin(a) * rad, 30, 440), born: S.t, exp: S.t + (tpl.exp || (75 + r() * 45)) * (sp ? 1.4 : 1) * DM[1],
      state: 'open', team: [], bonus: 0 };
  }

  // ---------- loop ----------
  let lastT = 0;
  function loop(now) {
    if (!S || S.done) return;
    const dt = Math.min(100, now - lastT); lastT = now;
    const rate = S.len / ((S.cfg.real || 330) * 1000) * (S.cfg.tutorial && S.tip < 4 && S.speed > 0 ? .6 : 1);
    if (S.speed > 0 && !S.evOpen) step(dt * rate * (Dispatch.auto ? 40 : S.speed));
    if (now - lastRender > 120) { render(); lastRender = now; }
    raf = requestAnimationFrame(loop);
  }
  function step(dm) {
    S.t += dm;
    while (S.spawn.length && S.spawn[0].at <= S.t && S.t < S.len) {
      const sp = S.spawn.shift(), c = mkCall(sp.special); S.calls.push(c);
      ctx.sfx(c.special ? 'alarm' : 'phone'); pingPin(c);
      if (S.cfg.tutorial && S.tip === 0) tip(1);
      if (c.special) ctx.toast('🚨 PRIORITY CALL', c.t);
    }
    S.calls.forEach(c => {
      if (c.state === 'open' && S.t > c.exp) { c.state = 'missed'; S.miss++; ctx.sfx('fail'); ctx.toast('⌛ Call missed', c.t); if (S.sel === c.id) { S.sel = null; side(); } }
      if (c.state === 'travel' && S.t >= c.arrive) { c.state = 'work'; c.team.forEach(id => S.hero[id].s = 'work'); }
      if (c.state === 'work' && c.ev && !c.evDone && S.t >= c.arrive + (c.done - c.arrive) / 2) openEvent(c);
      if (c.state === 'work' && S.t >= c.done && !S.evOpen) resolve(c);
    });
    Object.entries(S.hero).forEach(([id, h]) => {
      if (h.s === 'ret' && S.t >= h.until) { h.s = 'rest'; h.until = S.t + restTime(id); }
      else if (h.s === 'rest' && S.t >= h.until) { h.s = 'ready'; H(id).fat = clamp(H(id).fat - 10, 0, 100); ctx.sfx('beep'); }
    });
    if (S.t >= S.len && !S.done) finish();
    if (Dispatch.auto) autoplay();
  }
  const restTime = id => Math.max(10, 42 - H(id).st.vig * 2.6 + H(id).fat * .35);
  function send(c) {
    const team = c.team, mob = Math.min(...team.map(id => H(id).st.mob)), travel = 6 + dist(HQ, [c.x, c.y]) / (7 + mob * 2.4);
    c.p = chance(c, team); c.state = 'travel'; c.sent = S.t; c.arrive = S.t + travel; c.done = c.arrive + 20 + c.tier * 14; c.travel = travel;
    team.forEach(id => { S.hero[id].s = 'travel'; S.hero[id].call = c.id; });
    ctx.sfx('siren'); quip(team[0], 'go');
    if (S.cfg.tutorial && S.tip <= 3) tip(4);
    S.sel = null; side();
  }
  function resolve(c) {
    const p = clamp(c.p + c.bonus, .02, .99), ok = S.r() < p;
    c.state = ok ? 'ok' : 'fail'; c.result = ok;
    if (ok) S.ok++; else S.fail++;
    if (c.flag) S.flags[c.flag] = ok ? 1 : -1;
    const injured = !ok && S.r() < .35 ? c.team[(S.r() * c.team.length) | 0] : null;
    c.team.forEach(id => {
      const h = S.hero[id], hero = H(id); hero.fat = clamp(hero.fat + 9 + c.tier * 3, 0, 100);
      S.xp[id] += ok ? 18 + c.tier * 14 : 8;
      if (id === injured) { h.s = 'hurt'; hero.fat = clamp(hero.fat + 25, 0, 100); ctx.toast(`🩹 ${ctx.WHO[id].n} injured`, 'Out for the rest of the shift'); }
      else { h.s = 'ret'; h.until = S.t + c.travel; }
      h.call = null;
    });
    ctx.sfx(ok ? 'success' : 'fail'); quip(c.team[(S.r() * c.team.length) | 0], ok ? 'win' : 'lose');
    ctx.toast(ok ? '✔ Call resolved' : '✖ Call failed', c.t);
    if (S.cfg.tutorial && S.tip === 4) tip(5);
  }

  // ---------- mid-mission events ----------
  function openEvent(c) {
    const ev = typeof c.ev === 'string' ? ctx.events[c.ev] : c.ev; c.evDone = true; if (!ev) return;
    S.evOpen = true; ctx.sfx('alarm');
    const t = teamStats(c.team), best = k => c.team.reduce((b, id) => H(id).st[k] > H(b).st[k] ? id : b, c.team[0]);
    const odds = (k, need) => { const v = t[k]; return v >= need + 2 ? ['LIKELY', 'good'] : v >= need ? ['SOLID', 'good'] : v >= need - 2 ? ['RISKY', 'mid'] : ['LONG SHOT', 'bad']; };
    const box = $('#devent');
    box.innerHTML = `<div class="evp"><div class="evh">⚠ LIVE UPDATE · ${c.t}</div><p>${ctx.T(ev.q)}</p><div class="evo">${ev.o.map(([k, need, txt], i) => { const [lab, cls] = odds(k, need), b = best(k); return `<button data-i="${i}"><span class="evs">${SI[k]} ${SN[k]}</span><b>${ctx.T(txt)}</b><small>${ctx.WHO[b].n} leads · team ${SN[k]} ${t[k]}</small><em class="${cls}">${lab}</em></button>`; }).join('')}</div></div>`;
    box.classList.add('on');
    const pick = i => {
      const [k, need, , win, lose] = ev.o[i], v = t[k], ok = v >= need || S.r() < (v - need + 3) * .12;
      c.bonus += ok ? .3 : -.25; box.classList.remove('on'); S.evOpen = false; ctx.sfx(ok ? 'confirm' : 'miss');
      ctx.toast(ok ? '👍 Good call' : '👎 That went badly', ctx.T(ok ? (win || 'The team pulls it off.') : (lose || 'It gets messy.')));
    };
    box.querySelectorAll('button').forEach(b => b.onclick = () => pick(+b.dataset.i));
    if (Dispatch.auto) setTimeout(() => S && S.evOpen && pick(0), 30);
  }

  // ---------- chatter ----------
  function quip(id, kind) {
    const q = ctx.quips[id] && ctx.quips[id][kind]; if (!q) return;
    const card = document.querySelector(`#droster .hc[data-h="${id}"]`); if (!card) return;
    const b = document.createElement('div'); b.className = 'hq'; b.textContent = ctx.T(q[(Math.random() * q.length) | 0]);
    card.appendChild(b); setTimeout(() => b.remove(), 2600);
  }
  function pingPin(c) { const p = document.createElement('div'); p.className = 'dping'; p.style.left = (c.x / 800 * 100) + '%'; p.style.top = (c.y / 470 * 100) + '%'; $('.dmap').appendChild(p); setTimeout(() => p.remove(), 1500); }

  // ---------- tutorial ----------
  const TIPS = ['Shift started! Calls will pop up on the city map. I\'ll walk you through the first one. Beep!',
    'A call came in! Click the flashing pin — or the card on the right — to open it.',
    'The red outline is what the call NEEDS. Click heroes in the roster below to assign them. Try to cover the shape!',
    'See the success %? Heroes stack their stats. When you\'re happy, hit DISPATCH!',
    'They\'re en route! Travel time depends on Mobility. You can keep taking calls meanwhile.',
    'Resolved! After a call, heroes return and need to REST — Vigor shortens it. Don\'t let calls expire! Use ▶▶ to speed up time.'];
  function tip(i) {
    if (!S.cfg.tutorial || i < 0) { $('#dtip').classList.remove('on'); return; }
    S.tip = i; const el = $('#dtip'); el.innerHTML = `<div class="bitface">${ctx.bit}</div><p>${TIPS[i]}</p>${i === 5 ? '<button id="dtipx">Got it</button>' : ''}`; el.classList.add('on');
    if (i === 5) $('#dtipx').onclick = () => el.classList.remove('on');
  }

  // ---------- UI ----------
  function build() {
    const roads = Object.values(DIST).map(d => `<path d="M${HQ[0]},${HQ[1]} Q${(HQ[0] + d[1]) / 2 + 30},${(HQ[1] + d[2]) / 2 - 20} ${d[1]},${d[2]}" stroke="#23456a" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('');
    const blobs = Object.entries(DIST).map(([k, d], i) => `<ellipse cx="${d[1]}" cy="${d[2]}" rx="${80 + (i % 3) * 14}" ry="${56 + (i % 2) * 12}" fill="hsl(${200 + i * 18},45%,${14 + (i % 3) * 2}%)" stroke="#2a5a88" stroke-opacity=".6"/><text x="${d[1]}" y="${d[2] + 4}" text-anchor="middle" class="dlab">${d[0].toUpperCase()}</text>`).join('');
    const blocks = [...Array(70)].map((_, i) => { const r = mkRng(i + 3); return `<rect x="${(r() * 780) | 0}" y="${(r() * 450) | 0}" width="${8 + (r() * 16 | 0)}" height="${8 + (r() * 14 | 0)}" fill="#1b3656" opacity=".7"/>`; }).join('');
    const el = document.createElement('div'); el.id = 'dispatch';
    el.innerHTML = `<div class="dtop"><div class="dbrand"><b>HALO DISPATCH</b><span>${ctx.T(S.cfg.title || 'Shift')}</span></div>
      <div class="dclock"><b id="dtime">09:00</b><div class="dprog"><i id="dprogf"></i></div><small>SHIFT ENDS ${fmt(S.len)}</small></div>
      <div class="dscore"><span class="ok">✔ <b id="dok">0</b></span><span class="bad">✖ <b id="dfail">0</b></span><span class="miss">⌛ <b id="dmiss">0</b></span></div>
      <div class="dspeed">${['❚❚', '▶', '▶▶', '▶▶▶'].map((t, i) => `<button data-s="${i}" class="${i === 1 ? 'on' : ''}">${t}</button>`).join('')}</div></div>
      <div class="dmap"><svg id="dsvg" viewBox="0 0 800 470"><rect width="800" height="470" fill="#0a1a2e"/>${blocks}
        <path d="M0,330 C150,300 260,380 400,350 S650,420 800,360" stroke="#12365e" stroke-width="26" fill="none"/>${blobs}${roads}
        <circle cx="${HQ[0]}" cy="${HQ[1]}" r="34" fill="none" stroke="#7fe8ff" stroke-width="3" class="glowpulse"/><circle cx="${HQ[0]}" cy="${HQ[1]}" r="20" fill="#0e3a5e" stroke="#7fe8ff" stroke-width="2"/><text x="${HQ[0]}" y="${HQ[1] + 4}" text-anchor="middle" class="dhq">HALO</text>
        <g id="dlines"></g><g id="dpins"></g><g id="dunits"></g></svg><div id="dtip" class="dtip"></div></div>
      <div class="dside" id="dside"></div><div class="droster" id="droster"></div><div id="devent" class="devent"></div><div id="dreport" class="dreport"></div>`;
    $('#game').appendChild(el);
    requestAnimationFrame(() => el.classList.add('on'));
    el.querySelectorAll('.dspeed button').forEach(b => b.onclick = () => setSpeed(+b.dataset.s));
    $('#dpins').addEventListener('pointerdown', e => { const g = e.target.closest('.pin'); if (g) selectCall(+g.dataset.id); });
    roster(); side();
  }
  function setSpeed(v) { S.speed = v; $$('.dspeed button').forEach(b => b.classList.toggle('on', +b.dataset.s === v)); ctx.sfx('click'); }
  function selectCall(id) {
    const c = S.calls.find(x => x.id === id); if (!c) return;
    S.sel = id; ctx.sfx('confirm');
    if (S.cfg.tutorial && S.tip === 1 && c.state === 'open') tip(2);
    side(); roster();
  }
  function toggleHero(id) {
    const c = S.calls.find(x => x.id === S.sel);
    if (!c || c.state !== 'open') return ctx.sfx('fail');
    const h = S.hero[id];
    if (c.team.includes(id)) c.team = c.team.filter(x => x !== id);
    else { if (h.s !== 'ready') return (ctx.sfx('fail'), ctx.toast(`${ctx.WHO[id].n} is busy`, STATE[h.s])); if (c.team.length >= c.slots) return (ctx.sfx('fail'), ctx.toast('Team full', `This call takes ${c.slots} hero${c.slots > 1 ? 'es' : ''}`)); c.team.push(id); }
    ctx.sfx('click'); if (S.cfg.tutorial && S.tip === 2 && c.team.length) tip(3);
    side(); roster();
  }
  function side() {
    const el = $('#dside'); if (!el) return;
    const c = S.sel && S.calls.find(x => x.id === S.sel);
    if (c && c.state === 'open') {
      const t = teamStats(c.team), p = chance(c, c.team), [sv, notes] = synergy(c.team), mx = Math.max(8, ...ST.map(k => Math.max(c.req[k], t[k])));
      el.innerHTML = `<div class="dasg"><button class="dback" id="dback">‹ Calls</button><div class="dct"><span style="color:${TIERC[c.tier]}">${'★'.repeat(c.tier)}</span> ${c.t}</div><div class="dcd">📍 ${c.dname} · ${ctx.T(c.d)}</div>
        <div class="dpent"><svg viewBox="0 0 180 180">${[.33, .66, 1].map(f => `<polygon points="${pent({ com: f * mx, vig: f * mx, mob: f * mx, cha: f * mx, int: f * mx }, mx)}" fill="none" stroke="#ffffff1c"/>`).join('')}
          <polygon points="${pent(t, mx)}" fill="#52e0ff55" stroke="#52e0ff" stroke-width="2" class="tpoly"/><polygon points="${pent(c.req, mx)}" fill="none" stroke="#ff3355" stroke-width="2.5" stroke-dasharray="5 3"/>
          ${ST.map((k, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return `<text x="${90 + Math.cos(a) * 84}" y="${94 + Math.sin(a) * 84}" text-anchor="middle" class="plab">${SI[k]}</text>`; }).join('')}</svg>
          <div class="dstats">${ST.map(k => `<div class="${t[k] >= c.req[k] ? 'met' : c.req[k] ? 'short' : ''}"><span>${SN[k]}</span><b>${t[k]}</b><i>/ ${c.req[k]}</i></div>`).join('')}</div></div>
        <div class="dslots">${[...Array(c.slots)].map((_, i) => { const id = c.team[i]; return id ? `<div class="dslot on" style="--c:${ctx.WHO[id].c}">${ctx.portrait(id)}</div>` : `<div class="dslot">+</div>`; }).join('')}
          <div class="dchance ${p > .7 ? 'good' : p > .45 ? 'mid' : 'bad'}"><b>${Math.round(p * 100)}%</b><small>success</small></div></div>
        <div class="dsyn">${notes.length ? notes.map(n => `<div class="${n[0] === '+' ? 'pos' : 'neg'}">${ctx.T(n)}</div>`).join('') : c.team.length > 1 ? '<div>No special synergy.</div>' : ''}</div>
        <div class="dexp">Expires in <b>${Math.max(0, Math.round(c.exp - S.t))} min</b></div>
        <button class="ddisp" id="ddisp" ${c.team.length ? '' : 'disabled'}>DISPATCH ▸</button></div>`;
      $('#dback').onclick = () => { S.sel = null; side(); roster(); };
      $('#ddisp').onclick = () => send(c);
      return;
    }
    const list = S.calls.filter(x => ['open', 'travel', 'work'].includes(x.state) || S.t - (x.done || x.exp) < 40).sort((a, b) => (a.state === 'open' ? a.exp : 1e6 + a.id) - (b.state === 'open' ? b.exp : 1e6 + b.id));
    el.innerHTML = `<div class="dlisth">INCOMING CALLS <small>${S.calls.filter(x => x.state === 'open').length} open</small></div><div class="dlist">${list.length ? list.map(callCard).join('') : '<div class="dempty">No active calls.<br><small>Stay sharp, Handler.</small></div>'}</div>`;
    el.querySelectorAll('.dcall').forEach(b => b.onpointerdown = () => selectCall(+b.dataset.id));
  }
  function callCard(c) {
    const st = { open: '', travel: `EN ROUTE`, work: 'ON SCENE', ok: '✔ RESOLVED', fail: '✖ FAILED', missed: '⌛ MISSED' }[c.state];
    const frac = c.state === 'open' ? clamp((c.exp - S.t) / (c.exp - c.born), 0, 1) : c.state === 'travel' ? (S.t - c.sent) / (c.arrive - c.sent) : c.state === 'work' ? (S.t - c.arrive) / (c.done - c.arrive) : 1;
    return `<button class="dcall ${c.state} ${c.special ? 'sp' : ''}" data-id="${c.id}"><div class="dcrow"><span class="tier" style="color:${TIERC[c.tier]}">${'★'.repeat(c.tier)}</span><b>${c.t}</b></div>
      <div class="dcrow2"><span>📍 ${c.dname}</span><span>${'👤'.repeat(c.slots)}</span>${st ? `<em>${st}</em>` : `<em class="req">${ST.filter(k => c.req[k]).map(k => SI[k]).join('')}</em>`}</div>
      ${c.team.length && c.state !== 'open' ? `<div class="dteam">${c.team.map(id => `<i style="background:${ctx.WHO[id].c}">${ctx.WHO[id].n[0]}</i>`).join('')}</div>` : ''}
      <div class="dtbar ${c.state === 'open' && frac < .3 ? 'urgent' : ''}"><i style="width:${frac * 100}%"></i></div></button>`;
  }
  function roster() {
    const el = $('#droster'); if (!el) return;
    const c = S.sel && S.calls.find(x => x.id === S.sel);
    el.innerHTML = ctx.G.roster.map(id => {
      const h = S.hero[id], hero = H(id), inTeam = c && c.team.includes(id), lab = STATE[h.s] + (h.s === 'rest' ? ` ${Math.max(0, Math.ceil(h.until - S.t))}m` : '');
      return `<button class="hc ${h.s} ${inTeam ? 'sel' : ''} ${c && c.state === 'open' && h.s === 'ready' ? 'pickable' : ''}" data-h="${id}" style="--c:${ctx.WHO[id].c}">
        <div class="hp">${ctx.portrait(id)}</div><div class="hi"><div class="hn"><b>${ctx.WHO[id].n}</b><small>Lv ${hero.lvl}</small></div><div class="hs">${lab}</div>
        <div class="hst">${ST.map(k => `<span title="${SN[k]}">${SI[k]}<b>${hero.st[k]}</b></span>`).join('')}</div><div class="hf"><i style="width:${hero.fat}%"></i></div></div></button>`;
    }).join('');
    el.querySelectorAll('.hc').forEach(b => b.onpointerdown = () => toggleHero(b.dataset.h));
  }
  let rosterSig = '', listSig = '';
  function render() {
    if (!$('#dtime')) return;
    $('#dtime').textContent = fmt(Math.min(S.t, S.len)); $('#dprogf').style.width = Math.min(100, S.t / S.len * 100) + '%';
    $('#dok').textContent = S.ok; $('#dfail').textContent = S.fail; $('#dmiss').textContent = S.miss;
    const pins = S.calls.filter(c => ['open', 'travel', 'work'].includes(c.state) || (['ok', 'fail'].includes(c.state) && S.t - c.done < 25));
    $('#dpins').innerHTML = pins.map(c => {
      const col = c.state === 'ok' ? '#6fffb0' : c.state === 'fail' ? '#ff6b6b' : c.state === 'open' ? TIERC[c.tier] : '#52e0ff';
      const f = c.state === 'open' ? clamp((c.exp - S.t) / (c.exp - c.born), 0, 1) : c.state === 'work' ? clamp((S.t - c.arrive) / (c.done - c.arrive), 0, 1) : 1, C = 2 * Math.PI * 21;
      const icon = { open: '!', travel: '…', work: '⚡', ok: '✔', fail: '✖' }[c.state];
      return `<g class="pin ${c.state} ${S.sel === c.id ? 'sel' : ''} ${c.special ? 'sp' : ''}" data-id="${c.id}" transform="translate(${c.x.toFixed(0)},${c.y.toFixed(0)})"><circle r="21" fill="none" stroke="#ffffff22" stroke-width="4"/>
        <circle r="21" fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="${(C * f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90)"/><circle r="14" fill="${col}" class="${c.state === 'open' ? 'pulse' : ''}"/><text y="5" text-anchor="middle">${icon}</text></g>`;
    }).join('');
    let lines = '', units = '';
    S.calls.filter(c => c.state === 'travel' || c.state === 'work').forEach(c => {
      lines += `<path d="M${HQ[0]},${HQ[1]} L${c.x.toFixed(0)},${c.y.toFixed(0)}" stroke="#52e0ff" stroke-width="2" stroke-dasharray="6 6" class="dash" opacity=".7"/>`;
      const k = c.state === 'travel' ? clamp((S.t - c.sent) / (c.arrive - c.sent), 0, 1) : 1;
      c.team.forEach((id, i) => { const x = HQ[0] + (c.x - HQ[0]) * k + (i - (c.team.length - 1) / 2) * 16, y = HQ[1] + (c.y - HQ[1]) * k - (c.state === 'work' ? 28 : 0); units += `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)})"><circle r="9" fill="${ctx.WHO[id].c}" stroke="#fff" stroke-width="2"/><text y="4" text-anchor="middle" class="dun">${ctx.WHO[id].n[0]}</text></g>`; });
    });
    Object.entries(S.hero).filter(([, h]) => h.s === 'ret').forEach(([id, h]) => { units += `<g transform="translate(${HQ[0] + 30},${HQ[1] - 30})"><circle r="7" fill="${ctx.WHO[id].c}" opacity=".7"/></g>`; });
    $('#dlines').innerHTML = lines; $('#dunits').innerHTML = units;
    const sig = ctx.G.roster.map(id => S.hero[id].s).join() + S.sel;
    if (sig !== rosterSig) { rosterSig = sig; roster(); }
    else ctx.G.roster.forEach(id => { const h = S.hero[id]; if (h.s === 'rest') { const e = document.querySelector(`#droster .hc[data-h="${id}"] .hs`); if (e) e.textContent = `RESTING ${Math.max(0, Math.ceil(h.until - S.t))}m`; } });
    const c = S.sel && S.calls.find(x => x.id === S.sel);
    if (S.sel && (!c || c.state !== 'open')) { S.sel = null; listSig = ''; }
    if (!S.sel) {
      const ls = S.calls.map(x => x.id + x.state).join() + '|' + S.calls.filter(x => ['ok', 'fail', 'missed'].includes(x.state) && S.t - (x.done || x.exp) < 40).length;
      if (ls !== listSig) { listSig = ls; side(); }
      else S.calls.forEach(x => { const b = document.querySelector(`#dside .dcall[data-id="${x.id}"] .dtbar`); if (!b) return; const fr = x.state === 'open' ? clamp((x.exp - S.t) / (x.exp - x.born), 0, 1) : x.state === 'travel' ? clamp((S.t - x.sent) / (x.arrive - x.sent), 0, 1) : x.state === 'work' ? clamp((S.t - x.arrive) / (x.done - x.arrive), 0, 1) : 1; b.firstChild.style.width = fr * 100 + '%'; b.classList.toggle('urgent', x.state === 'open' && fr < .3); });
    } else { const e = $('.dexp b'); if (e) e.textContent = Math.max(0, Math.round(c.exp - S.t)) + ' min'; }
  }

  // ---------- end of shift ----------
  function finish() {
    S.done = true; cancelAnimationFrame(raf);
    S.calls.forEach(c => { if (c.state === 'open') { c.state = 'missed'; S.miss++; } if (c.state === 'travel' || c.state === 'work') { c.state = c.state; c.bonus += 0; resolve(c); } });
    const G = ctx.G, total = S.ok + S.fail + S.miss, ratio = total ? S.ok / total : 1;
    const grade = ratio >= .9 ? 'S' : ratio >= .75 ? 'A' : ratio >= .6 ? 'B' : ratio >= .4 ? 'C' : 'D';
    const credits = S.calls.filter(c => c.state === 'ok').reduce((s, c) => s + c.tier * 25, 0), rep = S.ok * 2 - S.miss * 2 - S.fail;
    G.credits += credits; G.rep = Math.max(0, G.rep + rep); G.calls = (G.calls || 0) + S.ok;
    const ups = [];
    G.roster.forEach(id => {
      const h = H(id); h.xp += S.xp[id];
      while (h.lvl < 10 && h.xp >= h.lvl * 40 + 40) { h.xp -= h.lvl * 40 + 40; h.lvl++; h.sp++; ups.push(id); }
      if (S.hero[id].s === 'hurt') h.hurt = 1;
    });
    Object.assign(G.flags, S.flags);
    const res = { grade, ok: S.ok, fail: S.fail, miss: S.miss, total, credits, rep, ups };
    G.shifts = (G.shifts || []).concat([{ grade, ok: S.ok, total }]);
    ctx.sfx(['S', 'A', 'B'].includes(grade) ? 'success' : 'fail'); ctx.music('victory');
    const rr = $('#dreport');
    rr.innerHTML = `<div class="rep"><div class="reph">SHIFT REPORT</div><div class="repg g${grade}">${grade}</div>
      <div class="repn"><div><b>${S.ok}</b><span>Resolved</span></div><div><b>${S.fail}</b><span>Failed</span></div><div><b>${S.miss}</b><span>Missed</span></div><div><b>💴 ${credits}</b><span>Earned</span></div><div><b>⭐ ${rep >= 0 ? '+' : ''}${rep}</b><span>Reputation</span></div></div>
      <div class="repx">${G.roster.map(id => { const h = H(id); return `<div class="rx" style="--c:${ctx.WHO[id].c}"><div class="hp">${ctx.portrait(id)}</div><b>${ctx.WHO[id].n}</b><small>+${S.xp[id]} XP · Lv ${h.lvl}</small>${ups.includes(id) ? '<em>LEVEL UP! +1 SP</em>' : ''}${h.hurt ? '<em class="hurt">INJURED</em>' : ''}</div>`; }).join('')}</div>
      ${ups.length ? '<p class="reptip">Spend skill points in the <b>Dossier</b> tonight.</p>' : ''}<button class="btn primary" id="repok">Clock Out ▸</button></div>`;
    rr.classList.add('on');
    if (ups.length) setTimeout(() => ctx.sfx('levelup'), 700);
    if (grade === 'S') ctx.unlock('srank');
    if (G.calls >= 25) ctx.unlock('deploy5');
    $('#repok').onclick = () => { ctx.sfx('confirm'); close(); ctx.onDone(res); };
    if (Dispatch.auto) setTimeout(() => $('#repok') && $('#repok').click(), 50);
  }
  function close() { cancelAnimationFrame(raf); const el = $('#dispatch'); if (el) { el.classList.remove('on'); setTimeout(() => el.remove(), 400); } S = null; }

  function autoplay() {
    S.calls.filter(c => c.state === 'open').forEach(c => {
      const free = ctx.G.roster.filter(id => S.hero[id].s === 'ready' && !S.calls.some(o => o !== c && o.state === 'open' && o.team.includes(id)));
      if (!free.length) return;
      free.sort((a, b) => ST.reduce((s, k) => s + Math.min(H(b).st[k], c.req[k]), 0) - ST.reduce((s, k) => s + Math.min(H(a).st[k], c.req[k]), 0));
      c.team = free.slice(0, c.slots); send(c);
    });
  }
  return { start, close, auto: false, ST, SN, SI, get active() { return !!S; } };
})();

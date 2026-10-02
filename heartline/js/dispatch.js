/* HEARTLINE AGENCY — Dispatch shifts: real-time call management on a city map.
   Hero perks, gear, weather, morale and pair bonds all feed the odds (see systems.js). */
const Dispatch = (() => {
  const ST = ['com', 'vig', 'mob', 'cha', 'int'];
  const SN = { com: 'Combat', vig: 'Vigor', mob: 'Mobility', cha: 'Charisma', int: 'Intellect' };
  const SI = { com: '👊', vig: '❤️', mob: '👟', cha: '💬', int: '🧠' };
  const HQ = [400, 235];
  const APPR = { fast: ['⚡', 'Rush in', 'Travel −35% · success −8% · more tiring'], std: ['⚖', 'Standard', 'No modifiers'], care: ['🛡', 'Careful', 'Success +8% · slower on scene · half injury chance'] };
  const apprP = c => c.appr === 'fast' ? -.08 : c.appr === 'care' ? .08 : 0;
  const DIST = { harbor: ['Harbor', 680, 385], shibuya: ['Shibuya', 215, 300], akiba: ['Akiba', 560, 110], oldtown: ['Old Town', 135, 125], uptown: ['Uptown', 380, 80], industrial: ['Industrial', 705, 190], riverside: ['Riverside', 360, 400], park: ['Ueno Park', 560, 295] };
  const TIERC = ['#6fffb0', '#6fffb0', '#ffd24a', '#ff8a3a', '#ff3355'];
  const STATE = { ready: 'READY', travel: 'EN ROUTE', work: 'ON SCENE', ret: 'RETURNING', rest: 'RESTING', hurt: 'INJURED' };
  let S = null, ctx = null, raf = 0, lastRender = 0;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = m => { const t = ((S && S.cfg.start) || 9) * 60 + Math.floor(m); return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const H = id => ctx.G.heroes[id];
  const N = id => ctx.WHO[id].n;

  function pent(vals, max, r = 70, cx = 90, cy = 90) {
    return ST.map((k, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5, v = clamp((vals[k] || 0) / max, 0, 1.15) * r; return `${(cx + Math.cos(a) * v).toFixed(1)},${(cy + Math.sin(a) * v).toFixed(1)}`; }).join(' ');
  }
  function teamStats(team, call) { const t = {}; ST.forEach(k => t[k] = team.reduce((s, id) => s + Sys.stat(ctx.G, S, id, k, call, team), 0)); return t; }
  function synergy(team) {
    let v = 0; const notes = [];
    for (let i = 0; i < team.length; i++) for (let j = i + 1; j < team.length; j++) { const r = ctx.synergy(team[i], team[j]); if (r) { v += r[0]; notes.push(r[1]); } }
    return [clamp(v, -.25, .25), notes];
  }
  function chance(call, team) {
    if (!team.length) return 0;
    const t = teamStats(team, call); let need = 0, got = 0, over = 0;
    ST.forEach(k => { need += call.req[k]; got += Math.min(t[k], call.req[k]); over += Math.max(0, t[k] - call.req[k]); });
    const cover = need ? got / need : 1, fat = team.reduce((s, id) => s + H(id).fat, 0) / team.length;
    return clamp(.06 + .9 * Math.pow(cover, 1.35) + Math.min(.08, over / 120) + synergy(team)[0] + Sys.bonus(ctx.G, S, call, team)[0] + (call.ow || 0) + apprP(call) - fat / 500, .03, .98);
  }

  // ---------- setup ----------
  function start(cfg, c) {
    ctx = c; cancelAnimationFrame(raf);
    const G = ctx.G, r = mkRng(cfg.seed || (G.day * 97 + 13)), W = Sys.WEATHER[G.weather || 0];
    S = { cfg, t: 0, len: cfg.len || 480, speed: 1, calls: [], sel: null, n: 0, ok: 0, fail: 0, miss: 0, xp: {}, hero: {}, spawn: [], tip: 0, done: false, evOpen: false, r, flags: {},
      streak: 0, best: 0, hiOk: 0, inj: 0, soloOk: 0, fast: 0, skillsUsed: 0, heroOk: {}, saved: 0, log: [], pairUp: [], nemRes: [], chainRes: null, drops: [], usedK: {},
      obj: cfg.tutorial || cfg.noObj ? [] : Sys.objectives(G, r), skills: cfg.tutorial ? {} : Sys.skillCharges(G) };
    G.roster.forEach(id => { S.hero[id] = { s: H(id).hurt ? 'hurt' : 'ready', call: null, until: 0 }; S.xp[id] = 0; });
    const n = (cfg.calls || 8) + (W.calls || 0), span = S.len - 70;
    for (let i = 0; i < n; i++) S.spawn.push({ at: Math.round(8 + (i / n) * span + r() * span / n * .7) });
    (cfg.special || []).forEach(sp => S.spawn.push({ at: sp.at, special: sp }));
    if (!cfg.tutorial && !cfg.noExtra) {
      const nc = Sys.nemesisCall(G, S, r); if (nc) S.spawn.push({ at: nc.at, extra: nc });
      const ch = Sys.chainFor(G, r); if (ch) { S.chain = ch; S.spawn.push({ at: 40 + ((r() * 120) | 0), extra: Object.assign({}, ch.steps[0], { chain: ch.id, step: 0 }) }); }
    }
    S.spawn.sort((a, b) => a.at - b.at);
    if (cfg.tutorial) S.spawn[0].at = 2;
    build(); lastT = performance.now(); raf = requestAnimationFrame(loop);
    ctx.music(cfg.music || 'tension');
    tip(cfg.tutorial ? 0 : -1);
    radio(`Shift started. Weather: ${W.i} ${W.n}${W.d !== 'No modifiers' ? ' · ' + W.d : ''}`, 'sys');
    if (S.obj.length) radio(`Objectives: ${S.obj.map(o => o.t).join(' · ')}`, 'sys');
  }
  function mkRng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  function mkCall(sp, extra) {
    const G = ctx.G, r = S.r, pool = ctx.calls.filter(c => (c.tier || 1) >= (S.cfg.tiers || [1, 3])[0] && (c.tier || 1) <= (S.cfg.tiers || [1, 3])[1] && !S.usedT?.includes(c.t) && (!c.ch || (G.chap || 0) >= c.ch) && (!c.until || (G.chap || 0) <= c.until));
    const tpl = sp || extra || pool[(r() * pool.length) | 0] || ctx.calls[0];
    S.usedT = (S.usedT || []).concat(tpl.t);
    const DM = { story: [.8, 1.4], normal: [1, 1], hard: [1.2, .8] }[G.diff || 'normal'];
    const dk = tpl.dist || Object.keys(DIST)[(r() * 8) | 0], d = DIST[dk], diff = (S.cfg.diff || 1) * DM[0];
    const rv = String(tpl.r).split(/\s+/).map(Number), req = {};
    ST.forEach((k, i) => req[k] = Math.round((rv[i] || 0) * diff));
    const a = r() * 6.28, rad = 18 + r() * 38, tier = tpl.tier || 1;
    S.n++;
    return { id: S.n, t: tpl.t, d: tpl.d, req, slots: tpl.n || 1, tier, ev: tpl.ev, flag: tpl.flag, special: !!sp, dname: d[0], dk,
      hack: tpl.hack || (!tpl.ev && !sp && req.int >= 4 && tier >= 2 && r() < .45), nem: tpl.nem, chain: tpl.chain, step: tpl.step, esc: tpl.esc,
      x: clamp(d[1] + Math.cos(a) * rad, 30, 770), y: clamp(d[2] + Math.sin(a) * rad, 30, 440), born: S.t, exp: S.t + (tpl.exp || (75 + r() * 45)) * (sp || tpl.nem ? 1.4 : 1) * DM[1] * Sys.expMul(G),
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
      const sp = S.spawn.shift(), c = mkCall(sp.special, sp.extra); S.calls.push(c);
      ctx.sfx(c.special || c.nem ? 'alarm' : 'phone'); pingPin(c);
      if (S.cfg.tutorial && S.tip === 0) tip(1);
      if (c.special) { ctx.toast('🚨 PRIORITY CALL', c.t); radio(`PRIORITY: ${c.t} — ${c.dname}`, 'hot'); }
      else if (c.nem) { const v = Sys.NEMESES[c.nem]; ctx.toast(`${v.icon} NEMESIS SIGHTED`, v.n); radio(`${v.n}: “${v.taunt[(S.r() * v.taunt.length) | 0]}”`, 'nem'); ctx.codex('nem_' + c.nem, true); }
      else if (c.chain) { radio(`INCIDENT ${S.chain.n} (${c.step + 1}/${S.chain.steps.length}): ${c.t}`, 'chain'); if (!c.step) ctx.toast('🔗 Incident chain', S.chain.n); }
      else if (c.esc) radio(`ESCALATION: ${c.t.replace('⚠ ESCALATED: ', '')} got worse!`, 'hot');
      else radio(`New call: ${c.t} — ${c.dname}`);
    }
    S.calls.forEach(c => {
      if (c.state === 'open' && S.t > c.exp) { c.state = 'missed'; S.miss++; S.streak = 0; ctx.sfx('fail'); ctx.toast('⌛ Call missed', c.t); radio(`Missed: ${c.t}`, 'bad'); if (c.nem) nemesisResult(c, false); if (c.chain) chainBroken(c); if (S.sel === c.id) { S.sel = null; side(); } }
      if (c.state === 'travel' && S.t >= c.arrive) { c.state = 'work'; c.team.forEach(id => S.hero[id].s = 'work'); radio(`${c.team.map(N).join(' & ')} on scene: ${c.dname}`); }
      if (c.state === 'work' && !c.evDone && S.t >= c.arrive + (c.done - c.arrive) / 2) { if (c.hack) openBreach(c); else if (c.ev) openEvent(c); else c.evDone = true; }
      if (c.state === 'work' && S.t >= c.done && !S.evOpen) resolve(c);
    });
    Object.entries(S.hero).forEach(([id, h]) => {
      if (h.s === 'ret' && S.t >= h.until) { h.s = 'rest'; h.until = S.t + restTime(id); }
      else if (h.s === 'rest' && S.t >= h.until) { h.s = 'ready'; H(id).fat = clamp(H(id).fat - 10, 0, 100); ctx.sfx('beep'); }
    });
    if (S.t >= S.len && !S.done) finish();
    if (Dispatch.auto) autoplay();
  }
  const restTime = id => Math.max(8, (42 - H(id).st.vig * 2.6 + H(id).fat * .35) * Sys.restMul(ctx.G, id));
  function send(c) {
    const team = c.team, mob = Math.min(...team.map(id => Sys.stat(ctx.G, S, id, 'mob', c, team))), travel = (6 + dist(HQ, [c.x, c.y]) / (7 + mob * 2.4)) * Sys.travelMul(ctx.G, team, S) * (c.appr === 'fast' ? .65 : 1);
    c.p = chance(c, team); c.state = 'travel'; c.sent = S.t; c.arrive = S.t + travel; c.done = c.arrive + (20 + c.tier * 14) * (c.appr === 'care' ? 1.3 : 1); c.travel = travel;
    if (c.appr === 'fast') team.forEach(id => { H(id).fat = clamp(H(id).fat + 4, 0, 100); });
    if (S.t - c.born <= 10) S.fast++;
    team.forEach(id => { S.hero[id].s = 'travel'; S.hero[id].call = c.id; });
    ctx.sfx('siren'); quip(team[0], 'go'); radio(`${team.map(N).join(' & ')} → ${c.dname} (${Math.round(c.p * 100)}%)`, 'go');
    if (S.cfg.tutorial && S.tip <= 3) tip(4);
    S.sel = null; side();
  }
  function resolve(c) {
    const G = ctx.G, p = clamp(c.p + c.bonus, .02, .99), ok = S.r() < p;
    c.state = ok ? 'ok' : 'fail'; c.result = ok;
    if (ok) { S.ok++; S.streak++; S.best = Math.max(S.best, S.streak); if (c.tier >= 3) S.hiOk++; if (c.team.length === 1) S.soloOk++; }
    else { S.fail++; S.streak = 0; }
    if (c.flag) S.flags[c.flag] = ok ? 1 : -1;
    const cand = c.team[(S.r() * c.team.length) | 0], injured = !ok && S.r() < .35 * Sys.injMul(G, c.team, cand) * (c.appr === 'care' ? .5 : 1) ? cand : null;
    const xm = Sys.xpMul(G, c.team);
    c.team.forEach(id => {
      const h = S.hero[id], hero = H(id); hero.fat = clamp(hero.fat + 9 + c.tier * 3, 0, 100);
      S.xp[id] += Math.round((ok ? 18 + c.tier * 14 : 8) * xm);
      if (ok) S.heroOk[id] = (S.heroOk[id] || 0) + 1;
      if (id === injured) { h.s = 'hurt'; S.inj++; hero.fat = clamp(hero.fat + 25, 0, 100); ctx.toast(`🩹 ${N(id)} injured`, 'Out for the rest of the shift'); radio(`${N(id)} is hurt! Pulling out.`, 'bad'); }
      else { h.s = 'ret'; h.until = S.t + c.travel; }
      h.call = null;
    });
    if (ok) {
      c.cred = Math.round(c.tier * 20 * Sys.credMul(G, c.team) * (1 + Math.min(5, S.streak - 1) * .05));
      S.saved += c.tier * (3 + ((S.r() * 10) | 0));
      G.pairs = G.pairs || {};
      for (let i = 0; i < c.team.length; i++) for (let j = i + 1; j < c.team.length; j++) {
        const a = c.team[i], b = c.team[j], k = Sys.pairKey(a, b), l0 = Sys.pairLv(G, a, b); G.pairs[k] = (G.pairs[k] || 0) + 1; const l1 = Sys.pairLv(G, a, b);
        if (l1 > l0) { S.pairUp.push([a, b, l1]); ctx.toast(`💞 Bond Lv ${l1}`, `${N(a)} & ${N(b)} work better together`); if (l1 >= 3) ctx.unlock('bond3'); }
      }
      if (S.r() < .12) { const ks = Object.keys(ctx.items).filter(k => ctx.items[k].p <= 160), k = ks[(S.r() * ks.length) | 0]; if (k) { G.inv[k] = (G.inv[k] || 0) + 1; S.drops.push(k); ctx.toast(`🎁 ${ctx.items[k].icon} ${ctx.items[k].n}`, 'A grateful civilian insisted.'); } }
      if (c.esc) ctx.unlock('escalate');
      if (S.streak >= 10) ctx.unlock('streak10');
      if (S.streak >= 3) radio(`Streak ×${S.streak}! Credits +${Math.min(5, S.streak - 1) * 5}%`, 'go');
    }
    if (c.nem) nemesisResult(c, ok);
    if (c.chain) { if (ok) chainNext(c); else chainBroken(c); }
    if (!ok && !c.esc && !c.special && !c.nem && !c.chain && c.tier < 4 && S.r() < .45 && S.t < S.len - 45) escalate(c);
    ctx.sfx(ok ? 'success' : 'fail'); quip(c.team[(S.r() * c.team.length) | 0], ok ? 'win' : 'lose');
    ctx.toast(ok ? '✔ Call resolved' : '✖ Call failed', c.t); radio(`${ok ? '✔ Resolved' : '✖ Failed'}: ${c.t}`, ok ? 'ok' : 'bad');
    if (S.cfg.tutorial && S.tip === 4) tip(5);
  }
  function escalate(c) {
    const rv = ST.map(k => Math.round(c.req[k] * 1.25 / (S.cfg.diff || 1))).join(' ');
    S.spawn.unshift({ at: S.t, extra: { t: '⚠ ESCALATED: ' + c.t, d: 'It got worse after the first attempt. ' + c.d, r: rv, n: Math.min(3, c.slots + 1), tier: c.tier + 1, dist: c.dk, esc: 1, exp: 70 } });
  }
  function chainNext(c) {
    const ch = S.chain, i = c.step + 1;
    if (i < ch.steps.length) { const at = S.t + 6 + S.r() * 10; S.spawn.push({ at, extra: Object.assign({}, ch.steps[i], { chain: ch.id, step: i }) }); S.spawn.sort((a, b) => a.at - b.at); radio(`Incident developing: ${ch.n}. Stand by…`, 'chain'); if (at >= S.len) S.len = at + 60; }
    else { S.chainRes = [ch.n, true]; ctx.G.chains = Object.assign(ctx.G.chains || {}, { [ch.id]: 1 }); ctx.toast('🔗 CHAIN COMPLETE', `${ch.n} · +150 credits`); ctx.unlock('chain'); radio(`Incident closed: ${ch.n}. Outstanding work.`, 'ok'); }
  }
  function chainBroken(c) { S.chainRes = [S.chain.n, false]; radio(`Incident lost: ${S.chain.n}. The trail went cold.`, 'bad'); }
  function nemesisResult(c, ok) {
    const G = ctx.G, v = Sys.NEMESES[c.nem]; G.nem = G.nem || {};
    if (ok) G.nem[c.nem] = (G.nem[c.nem] || 0) + 1;
    const n = G.nem[c.nem] || 0, caught = ok && n >= 3;
    S.nemRes.push([c.nem, ok, n]);
    if (caught) { ctx.toast(`${v.icon} ${v.n} CAPTURED`, 'Nemesis file closed'); radio(v.caught, 'ok'); ctx.unlock('nemesis'); if (Object.keys(Sys.NEMESES).every(k => (G.nem[k] || 0) >= 3)) ctx.unlock('nemall'); }
    else radio(ok ? `${v.n} beaten back, but escaped again. (${n}/3)` : v.flee, ok ? 'nem' : 'bad');
  }

  // ---------- Handler skills ----------
  function useSkill(k) {
    if (!S.skills[k]) return ctx.sfx('fail');
    const sel = S.sel && S.calls.find(x => x.id === S.sel);
    if (k === 'overwatch') { if (!sel || sel.state !== 'open') return (ctx.sfx('fail'), ctx.toast('🎯 Overwatch', 'Select an open call first.')); sel.ow = (sel.ow || 0) + .15; }
    if (k === 'rally') { const rs = Object.entries(S.hero).filter(([, h]) => h.s === 'rest' || h.s === 'ret'); if (!rs.length) return (ctx.sfx('fail'), ctx.toast('📣 Rally', 'Nobody is resting.')); rs.forEach(([, h]) => h.s = 'ready'); }
    if (k === 'rush') { const tr = S.calls.filter(c => c.state === 'travel'); if (!tr.length) return (ctx.sfx('fail'), ctx.toast('⚡ Rush', 'Nobody is en route.')); tr.forEach(c => { const w = c.done - c.arrive; c.arrive = S.t; c.done = S.t + w; }); }
    if (k === 'coffee') ctx.G.roster.forEach(id => H(id).fat = clamp(H(id).fat - 25, 0, 100));
    S.skills[k]--; S.skillsUsed++; S.usedK[k] = 1; ctx.G.skillsK = Object.assign(ctx.G.skillsK || {}, { [k]: 1 });
    if (Object.keys(Sys.SKILLS).every(x => ctx.G.skillsK[x])) ctx.unlock('skills');
    ctx.sfx('levelup'); radio(`Handler: ${Sys.SKILLS[k].i} ${Sys.SKILLS[k].n}!`, 'go'); ctx.toast(`${Sys.SKILLS[k].i} ${Sys.SKILLS[k].n}`, Sys.SKILLS[k].d);
    skillBar(); side(); rosterSig = '';
  }
  function skillBar() {
    const el = $('#dskills'); if (!el) return;
    el.innerHTML = Object.entries(Sys.SKILLS).map(([k, s]) => S.skills[k] === undefined ? `<button class="lock" title="${s.n}: unlocks in Chapter ${s.ch}">🔒</button>` : `<button data-k="${k}" class="${S.skills[k] ? '' : 'spent'}" title="${s.n}: ${s.d}">${s.i}<b>${S.skills[k]}</b></button>`).join('');
    el.querySelectorAll('button[data-k]').forEach(b => b.onpointerdown = e => { e.stopPropagation(); useSkill(b.dataset.k); });
  }

  // ---------- radio log / objectives ----------
  function radio(t, cls = '') {
    if (!S) return; S.log.push([fmt(S.t), t, cls]); if (S.log.length > 60) S.log.shift();
    const el = $('#dlog'); if (!el) return;
    el.innerHTML = S.log.slice(-5).map(([tm, x, c]) => `<div class="${c}"><em>${tm}</em>${ctx.T(x)}</div>`).join('');
  }
  function objHtml() {
    if (!S.obj.length) return '';
    return S.obj.map(o => { const now = Sys.objOk(S, o), fixed = ['nomiss', 'noinj', 'noskill'].includes(o.id); return `<div class="${now ? (fixed ? 'hold' : 'done') : fixed ? 'lost' : ''}">${now ? (fixed ? '◇' : '✔') : fixed ? '✖' : '◇'} ${o.t}</div>`; }).join('');
  }

  // ---------- mid-mission events ----------
  function openEvent(c) {
    const ev = typeof c.ev === 'string' ? ctx.events[c.ev] : c.ev; c.evDone = true; if (!ev) return;
    S.evOpen = true; ctx.sfx('alarm');
    const t = teamStats(c.team, c), best = k => c.team.reduce((b, id) => Sys.stat(ctx.G, S, id, k, c, c.team) > Sys.stat(ctx.G, S, b, k, c, c.team) ? id : b, c.team[0]);
    const odds = (k, need) => { const v = t[k]; return v >= need + 2 ? ['LIKELY', 'good'] : v >= need ? ['SOLID', 'good'] : v >= need - 2 ? ['RISKY', 'mid'] : ['LONG SHOT', 'bad']; };
    const box = $('#devent');
    box.innerHTML = `<div class="evp"><div class="evh">⚠ LIVE UPDATE · ${c.t}</div><p>${ctx.T(ev.q)}</p><div class="evo">${ev.o.map(([k, need, txt], i) => { const [lab, cls] = odds(k, need), b = best(k); return `<button data-i="${i}"><span class="evs">${SI[k]} ${SN[k]}</span><b>${ctx.T(txt)}</b><small>${N(b)} leads · team ${SN[k]} ${t[k]}</small><em class="${cls}">${lab}</em></button>`; }).join('')}</div></div>`;
    box.classList.add('on');
    const pick = i => {
      const [k, need, , win, lose] = ev.o[i], v = t[k], ok = v >= need || S.r() < (v - need + 3) * .12;
      c.bonus += ok ? .3 : -.25; box.classList.remove('on'); S.evOpen = false; ctx.sfx(ok ? 'confirm' : 'miss');
      ctx.toast(ok ? '👍 Good call' : '👎 That went badly', ctx.T(ok ? (win || 'The team pulls it off.') : (lose || 'It gets messy.')));
      radio(ok ? `Live update handled: the ${SN[k]} call paid off.` : 'Live update went badly.', ok ? 'ok' : 'bad');
    };
    box.querySelectorAll('button').forEach(b => b.onclick = () => pick(+b.dataset.i));
    if (Dispatch.auto) setTimeout(() => S && S.evOpen && pick(0), 30);
  }
  function openBreach(c) {
    c.evDone = true; S.evOpen = true; ctx.sfx('alarm');
    const ti = teamStats(c.team, c).int, box = $('#devent'), lead = c.team.reduce((b, id) => H(id).st.int > H(b).st.int ? id : b, c.team[0]);
    box.innerHTML = `<div class="evp brp"><div class="evh">⌨ LIVE UPDATE · ${c.t}</div><p>The scene is locked behind a security system. ${N(lead)} is patching you into the terminal. Breach it!</p><div id="brhost"></div></div>`;
    box.classList.add('on');
    Sys.breach($('#brhost'), { len: c.tier >= 3 ? 4 : 3, buf: 6 + (ti >= 8 ? 1 : 0) + (ti >= 12 ? 1 : 0), time: 16000 + ti * 700, autoP: clamp(.45 + ti * .05, .3, .95) }, (ok, perfect) => {
      if (!S) return; c.bonus += ok ? .35 : -.2; box.classList.remove('on'); S.evOpen = false;
      if (perfect) ctx.unlock('breach');
      ctx.toast(ok ? '⌨ Breach successful' : '⌨ Breach failed', ok ? 'The team has the building.' : 'Alarms everywhere. This got harder.'); radio(ok ? 'Breach successful. Systems are ours.' : 'Breach failed. Alarms tripped.', ok ? 'ok' : 'bad');
    });
  }

  // ---------- chatter ----------
  function quip(id, kind) {
    const q = ctx.quips[id] && ctx.quips[id][kind]; if (!q) return;
    const line = ctx.T(q[(Math.random() * q.length) | 0]);
    const card = document.querySelector(`#droster .hc[data-h="${id}"]`); if (!card) return;
    const b = document.createElement('div'); b.className = 'hq'; b.textContent = line;
    card.appendChild(b); setTimeout(() => b.remove(), 2600);
  }
  function pingPin(c) { const p = document.createElement('div'); p.className = 'dping' + (c.nem ? ' nem' : ''); p.style.left = (c.x / 800 * 100) + '%'; p.style.top = (c.y / 470 * 100) + '%'; $('.dmap').appendChild(p); setTimeout(() => p.remove(), 1500); }

  // ---------- tutorial ----------
  const TIPS = ['Shift started. Calls will appear on the city map. I will walk you through the first one. This is the part where I am useful.',
    'A call came in. Click the flashing pin, or its card on the right, to open it.',
    'The red outline is what the call needs. Click heroes in the roster below to assign them. Try to cover the shape.',
    'See the success percentage? Heroes stack their stats. When you are happy with it, press DISPATCH. Below it you can choose how they go in: Rush in, Standard, or Careful.',
    'They are en route. Travel time depends on Mobility. You can take other calls in the meantime.',
    'Resolved. Heroes need to rest afterwards; Vigor shortens it. Do not let calls expire. Use ▶▶ to speed up the clock. Also, you will start writing things in the notebook. Anything you learn about a hero helps when you send them out.'];
  function tip(i) {
    if (!S.cfg.tutorial || i < 0) { $('#dtip').classList.remove('on'); return; }
    S.tip = i; const el = $('#dtip'); el.innerHTML = `<div class="bitface">${ctx.bit}</div><p>${TIPS[i]}</p>${i === 5 ? '<button id="dtipx">Got it</button>' : ''}`; el.classList.add('on');
    if (i === 5) $('#dtipx').onclick = () => el.classList.remove('on');
  }

  // ---------- UI ----------
  function build() {
    const G = ctx.G, W = Sys.WEATHER[G.weather || 0], mo = G.morale === undefined ? 60 : G.morale;
    const roads = Object.values(DIST).map(d => `<path d="M${HQ[0]},${HQ[1]} Q${(HQ[0] + d[1]) / 2 + 30},${(HQ[1] + d[2]) / 2 - 20} ${d[1]},${d[2]}" stroke="#23456a" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('');
    const blobs = Object.entries(DIST).map(([k, d], i) => `<ellipse cx="${d[1]}" cy="${d[2]}" rx="${80 + (i % 3) * 14}" ry="${56 + (i % 2) * 12}" fill="hsl(${200 + i * 18},45%,${14 + (i % 3) * 2}%)" stroke="#2a5a88" stroke-opacity=".6"/><text x="${d[1]}" y="${d[2] + 4}" text-anchor="middle" class="dlab">${d[0].toUpperCase()}</text>`).join('');
    const blocks = [...Array(70)].map((_, i) => { const r = mkRng(i + 3); return `<rect x="${(r() * 780) | 0}" y="${(r() * 450) | 0}" width="${8 + (r() * 16 | 0)}" height="${8 + (r() * 14 | 0)}" fill="#1b3656" opacity=".7"/>`; }).join('');
    const el = document.createElement('div'); el.id = 'dispatch'; el.className = 'w' + (G.weather || 0);
    el.innerHTML = `<div class="dtop"><div class="dbrand"><b>HALO DISPATCH</b><span>${ctx.T(S.cfg.title || 'Shift')}</span></div>
      <div class="dclock"><b id="dtime">09:00</b><div class="dprog"><i id="dprogf"></i></div><small>ENDS ${fmt(S.len)}</small></div>
      <div class="dchips"><span title="${W.n}: ${W.d}">${W.i}</span><span title="Squad morale: affects every call" class="${mo >= 70 ? 'hi' : mo < 40 ? 'lo' : ''}">${mo >= 70 ? '😄' : mo < 40 ? '😣' : '🙂'} <b>${mo}</b></span><span id="dstreak" class="streak"></span></div>
      <div class="dscore"><span class="ok">✔ <b id="dok">0</b></span><span class="bad">✖ <b id="dfail">0</b></span><span class="miss">⌛ <b id="dmiss">0</b></span></div>
      <div class="dskills" id="dskills"></div>
      <div class="dspeed">${['❚❚', '▶', '▶▶', '▶▶▶'].map((t, i) => `<button data-s="${i}" class="${i === 1 ? 'on' : ''}">${t}</button>`).join('')}</div></div>
      <div class="dmap"><svg id="dsvg" viewBox="0 0 800 470"><rect width="800" height="470" fill="#0a1a2e"/>${blocks}
        <path d="M0,330 C150,300 260,380 400,350 S650,420 800,360" stroke="#12365e" stroke-width="26" fill="none"/>${blobs}${roads}
        <circle cx="${HQ[0]}" cy="${HQ[1]}" r="34" fill="none" stroke="#7fe8ff" stroke-width="3" class="glowpulse"/><circle cx="${HQ[0]}" cy="${HQ[1]}" r="20" fill="#0e3a5e" stroke="#7fe8ff" stroke-width="2"/><text x="${HQ[0]}" y="${HQ[1] + 4}" text-anchor="middle" class="dhq">HALO</text>
        <g id="dlines"></g><g id="dpins"></g><g id="dunits"></g></svg><div class="dwx"></div><div id="dobj" class="dobj"></div><div id="dlog" class="rlog"></div><div id="dtip" class="dtip"></div></div>
      <div class="dside" id="dside"></div><div class="droster ${G.roster.length > 5 ? 'dense' : ''}" id="droster"></div><div id="devent" class="devent"></div><div id="dreport" class="dreport"></div>`;
    $('#game').appendChild(el);
    requestAnimationFrame(() => el.classList.add('on'));
    el.querySelectorAll('.dspeed button').forEach(b => b.onclick = () => setSpeed(+b.dataset.s));
    $('#dpins').addEventListener('pointerdown', e => { const g = e.target.closest('.pin'); if (g) selectCall(+g.dataset.id); });
    roster(); side(); skillBar();
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
    else { if (h.s !== 'ready') return (ctx.sfx('fail'), ctx.toast(`${N(id)} is busy`, STATE[h.s])); if (c.team.length >= c.slots) return (ctx.sfx('fail'), ctx.toast('Team full', `This call takes ${c.slots} hero${c.slots > 1 ? 'es' : ''}`)); c.team.push(id); }
    ctx.sfx('click'); if (S.cfg.tutorial && S.tip === 2 && c.team.length) tip(3);
    side(); roster();
  }
  function side() {
    const el = $('#dside'); if (!el) return;
    const c = S.sel && S.calls.find(x => x.id === S.sel);
    if (c && c.state === 'open') {
      const t = teamStats(c.team, c), p = chance(c, c.team), notes = synergy(c.team)[1].concat(c.team.length ? Sys.bonus(ctx.G, S, c, c.team)[1] : []), mx = Math.max(8, ...ST.map(k => Math.max(c.req[k], t[k])));
      const tags = [c.nem ? `<i class="tg nem">${Sys.NEMESES[c.nem].icon} NEMESIS</i>` : '', c.chain ? `<i class="tg chain">🔗 ${c.step + 1}/${S.chain.steps.length}</i>` : '', c.esc ? '<i class="tg esc">⚠ ESCALATED</i>' : '', c.hack ? '<i class="tg hack">⌨ BREACH</i>' : '', c.ow ? `<i class="tg ow">🎯 +${Math.round(c.ow * 100)}%</i>` : ''].join('');
      el.innerHTML = `<div class="dasg"><button class="dback" id="dback">‹ Calls</button><div class="dct"><span style="color:${TIERC[c.tier]}">${'★'.repeat(c.tier)}</span> ${c.t}</div>${tags ? `<div class="dtags">${tags}</div>` : ''}<div class="dcd">📍 ${c.dname} · ${ctx.T(c.d)}</div>
        <div class="dpent"><svg viewBox="0 0 180 180">${[.33, .66, 1].map(f => `<polygon points="${pent({ com: f * mx, vig: f * mx, mob: f * mx, cha: f * mx, int: f * mx }, mx)}" fill="none" stroke="#ffffff1c"/>`).join('')}
          <polygon points="${pent(t, mx)}" fill="#52e0ff55" stroke="#52e0ff" stroke-width="2" class="tpoly"/><polygon points="${pent(c.req, mx)}" fill="none" stroke="#ff3355" stroke-width="2.5" stroke-dasharray="5 3"/>
          ${ST.map((k, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return `<text x="${90 + Math.cos(a) * 84}" y="${94 + Math.sin(a) * 84}" text-anchor="middle" class="plab">${SI[k]}</text>`; }).join('')}</svg>
          <div class="dstats">${ST.map(k => `<div class="${t[k] >= c.req[k] ? 'met' : c.req[k] ? 'short' : ''}"><span>${SN[k]}</span><b>${t[k]}</b><i>/ ${c.req[k]}</i></div>`).join('')}</div></div>
        <div class="dslots">${[...Array(c.slots)].map((_, i) => { const id = c.team[i]; return id ? `<div class="dslot on" style="--c:${ctx.WHO[id].c}">${ctx.portrait(id)}</div>` : `<div class="dslot">+</div>`; }).join('')}
          <div class="dchance ${p > .7 ? 'good' : p > .45 ? 'mid' : 'bad'}"><b>${Math.round(p * 100)}%</b><small>success</small></div></div>
        <div class="dsyn">${notes.length ? notes.map(n => `<div class="${n[0] === '+' ? 'pos' : 'neg'}">${ctx.T(n)}</div>`).join('') : c.team.length > 1 ? '<div>No special synergy.</div>' : ''}</div>
        <div class="dappr">${Object.entries(APPR).map(([k, a]) => `<button data-a="${k}" class="${(c.appr || 'std') === k ? 'on' : ''}" title="${a[2]}">${a[0]} ${a[1]}</button>`).join('')}</div><div class="dapprd">${APPR[c.appr || 'std'][2]} · Expires in <b>${Math.max(0, Math.round(c.exp - S.t))} min</b></div>
        <button class="ddisp" id="ddisp" ${c.team.length ? '' : 'disabled'}>DISPATCH ▸</button></div>`;
      $('#dback').onclick = () => { S.sel = null; side(); roster(); };
      el.querySelectorAll('.dappr button').forEach(b => b.onclick = () => { c.appr = b.dataset.a === 'std' ? null : b.dataset.a; ctx.sfx('click'); side(); });
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
    return `<button class="dcall ${c.state} ${c.special ? 'sp' : ''} ${c.nem ? 'nem' : ''} ${c.chain ? 'chain' : ''} ${c.esc ? 'esc' : ''}" data-id="${c.id}"><div class="dcrow"><span class="tier" style="color:${TIERC[c.tier]}">${'★'.repeat(c.tier)}</span><b>${c.nem ? Sys.NEMESES[c.nem].icon + ' ' : c.chain ? '🔗 ' : c.hack ? '⌨ ' : ''}${c.t}</b></div>
      <div class="dcrow2"><span>📍 ${c.dname}</span><span>${'👤'.repeat(c.slots)}</span>${st ? `<em>${st}</em>` : `<em class="req">${ST.filter(k => c.req[k]).map(k => SI[k]).join('')}</em>`}</div>
      ${c.team.length && c.state !== 'open' ? `<div class="dteam">${c.team.map(id => `<i style="background:${ctx.WHO[id].c}">${N(id)[0]}</i>`).join('')}</div>` : ''}
      <div class="dtbar ${c.state === 'open' && frac < .3 ? 'urgent' : ''}"><i style="width:${frac * 100}%"></i></div></button>`;
  }
  function roster() {
    const el = $('#droster'); if (!el) return;
    const c = S.sel && S.calls.find(x => x.id === S.sel), G = ctx.G;
    el.innerHTML = G.roster.map(id => {
      const h = S.hero[id], hero = H(id), inTeam = c && c.team.includes(id), lab = STATE[h.s] + (h.s === 'rest' ? ` ${Math.max(0, Math.ceil(h.until - S.t))}m` : ''), m = G.mood && G.mood[id] && Sys.MOOD[G.mood[id]];
      const st = k => c ? Sys.stat(G, S, id, k, c, c.team.includes(id) ? c.team : c.team.concat(id)) : hero.st[k];
      return `<button class="hc ${h.s} ${inTeam ? 'sel' : ''} ${c && c.state === 'open' && h.s === 'ready' ? 'pickable' : ''}" data-h="${id}" style="--c:${ctx.WHO[id].c}">
        <div class="hp">${ctx.portrait(id)}</div><div class="hi"><div class="hn"><b>${N(id)}</b><small>Lv ${hero.lvl}</small>${m && G.mood[id] !== 'calm' ? `<i title="${m[1]}: ${m[2]}">${m[0]}</i>` : ''}${hero.gear ? `<i title="${Sys.GEAR[hero.gear].n}">${Sys.GEAR[hero.gear].icon}</i>` : ''}</div><div class="hs">${lab}</div>
        <div class="hst">${ST.map(k => { const v = st(k); return `<span title="${SN[k]}">${SI[k]}<b class="${v > hero.st[k] ? 'up' : ''}">${v}</b></span>`; }).join('')}</div><div class="hf"><i style="width:${hero.fat}%"></i></div></div></button>`;
    }).join('');
    el.querySelectorAll('.hc').forEach(b => b.onpointerdown = () => toggleHero(b.dataset.h));
  }
  let rosterSig = '', listSig = '', objSig = '';
  function render() {
    if (!$('#dtime')) return;
    $('#dtime').textContent = fmt(Math.min(S.t, S.len)); $('#dprogf').style.width = Math.min(100, S.t / S.len * 100) + '%';
    $('#dok').textContent = S.ok; $('#dfail').textContent = S.fail; $('#dmiss').textContent = S.miss;
    const sk = $('#dstreak'); if (sk) { sk.textContent = S.streak >= 2 ? `🔥×${S.streak}` : ''; sk.classList.toggle('on', S.streak >= 2); }
    const os = S.obj.map(o => Sys.objOk(S, o)).join(); if (os !== objSig) { objSig = os; const e = $('#dobj'); if (e) e.innerHTML = objHtml(); }
    const pins = S.calls.filter(c => ['open', 'travel', 'work'].includes(c.state) || (['ok', 'fail'].includes(c.state) && S.t - c.done < 25));
    $('#dpins').innerHTML = pins.map(c => {
      const col = c.state === 'ok' ? '#6fffb0' : c.state === 'fail' ? '#ff6b6b' : c.state === 'open' ? (c.nem ? '#ff3df0' : TIERC[c.tier]) : '#52e0ff';
      const f = c.state === 'open' ? clamp((c.exp - S.t) / (c.exp - c.born), 0, 1) : c.state === 'work' ? clamp((S.t - c.arrive) / (c.done - c.arrive), 0, 1) : 1, C = 2 * Math.PI * 21;
      const icon = { open: c.nem ? '☠' : c.chain ? '⛓' : '!', travel: '…', work: c.hack ? '⌨' : '⚡', ok: '✔', fail: '✖' }[c.state];
      return `<g class="pin ${c.state} ${S.sel === c.id ? 'sel' : ''} ${c.special ? 'sp' : ''} ${c.nem ? 'nem' : ''}" data-id="${c.id}" transform="translate(${c.x.toFixed(0)},${c.y.toFixed(0)})"><circle r="21" fill="none" stroke="#ffffff22" stroke-width="4"/>
        <circle r="21" fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="${(C * f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90)"/><circle r="14" fill="${col}" class="${c.state === 'open' ? 'pulse' : ''}"/><text y="5" text-anchor="middle">${icon}</text></g>`;
    }).join('');
    let lines = '', units = '';
    S.calls.filter(c => c.state === 'travel' || c.state === 'work').forEach(c => {
      lines += `<path d="M${HQ[0]},${HQ[1]} L${c.x.toFixed(0)},${c.y.toFixed(0)}" stroke="#52e0ff" stroke-width="2" stroke-dasharray="6 6" class="dash" opacity=".7"/>`;
      const k = c.state === 'travel' ? clamp((S.t - c.sent) / (c.arrive - c.sent), 0, 1) : 1;
      c.team.forEach((id, i) => { const x = HQ[0] + (c.x - HQ[0]) * k + (i - (c.team.length - 1) / 2) * 16, y = HQ[1] + (c.y - HQ[1]) * k - (c.state === 'work' ? 28 : 0); units += `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)})"><circle r="9" fill="${ctx.WHO[id].c}" stroke="#fff" stroke-width="2"/><text y="4" text-anchor="middle" class="dun">${N(id)[0]}</text></g>`; });
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
    } else { const e = $('.dapprd b'); if (e) e.textContent = Math.max(0, Math.round(c.exp - S.t)) + ' min'; }
  }

  // ---------- end of shift ----------
  function finish() {
    S.done = true; cancelAnimationFrame(raf);
    S.calls.forEach(c => { if (c.state === 'open') { c.state = 'missed'; S.miss++; if (c.nem) nemesisResult(c, false); } if (c.state === 'travel' || c.state === 'work') resolve(c); });
    const G = ctx.G, total = S.ok + S.fail + S.miss, ratio = total ? S.ok / total : 1;
    const grade = ratio >= .9 ? 'S' : ratio >= .75 ? 'A' : ratio >= .6 ? 'B' : ratio >= .4 ? 'C' : 'D';
    const objRes = S.obj.map(o => [o.t, Sys.objOk(S, o)]), objN = objRes.filter(x => x[1]).length;
    const credits = S.calls.filter(c => c.state === 'ok').reduce((s, c) => s + (c.cred || c.tier * 20), 0) + objN * 80 + (S.chainRes && S.chainRes[1] ? 150 : 0);
    const rep = S.ok * 2 - S.miss * 2 - S.fail + objN * 3;
    G.credits += credits; G.rep = Math.max(0, G.rep + rep); G.calls = (G.calls || 0) + S.ok; G.saved = (G.saved || 0) + S.saved;
    const m0 = G.morale === undefined ? 60 : G.morale, dm = { S: 10, A: 5, B: 1, C: -5, D: -10 }[grade] - S.inj * 3 + objN * 2;
    G.morale = clamp(m0 + dm, 0, 100); if (G.morale >= 90) ctx.unlock('morale'); if (objN >= 2) ctx.unlock('objectives');
    const ups = [];
    G.roster.forEach(id => {
      const h = H(id); h.xp += S.xp[id];
      while (h.lvl < 10 && h.xp >= h.lvl * 40 + 40) { h.xp -= h.lvl * 40 + 40; h.lvl++; h.sp++; ups.push(id); }
      if (S.hero[id].s === 'hurt') h.hurt = 1;
    });
    Object.assign(G.flags, S.flags);
    const res = { grade, ok: S.ok, fail: S.fail, miss: S.miss, total, credits, rep, ups, saved: S.saved, obj: objN, best: S.best, morale: G.morale };
    G.shifts = (G.shifts || []).concat([{ grade, ok: S.ok, total }]);
    ctx.sfx(['S', 'A', 'B'].includes(grade) ? 'success' : 'fail'); ctx.music('victory');
    const extra = [
      objRes.length ? `<div class="repo">${objRes.map(([t, ok]) => `<span class="${ok ? 'ok' : ''}">${ok ? '✔' : '✖'} ${t}${ok ? ' <b>+💴80</b>' : ''}</span>`).join('')}</div>` : '',
      `<div class="repm"><span>🔥 Best streak <b>${S.best}</b></span><span>🧍 Civilians helped <b>${S.saved}</b></span><span>${G.morale >= m0 ? '📈' : '📉'} Morale <b>${m0} → ${G.morale}</b></span>${S.drops.length ? `<span>🎁 Gifts <b>${S.drops.map(k => ctx.items[k].icon).join('')}</b></span>` : ''}</div>`,
      S.pairUp.length || S.nemRes.length || S.chainRes ? `<div class="repm">${S.pairUp.map(([a, b, l]) => `<span>💞 ${N(a)} & ${N(b)} <b>Bond Lv ${l}</b></span>`).join('')}${S.nemRes.map(([k, ok, n]) => `<span>${Sys.NEMESES[k].icon} ${Sys.NEMESES[k].n} <b>${ok ? (n >= 3 ? 'CAPTURED' : `beaten ${n}/3`) : 'escaped'}</b></span>`).join('')}${S.chainRes ? `<span>🔗 ${S.chainRes[0]} <b>${S.chainRes[1] ? 'COMPLETE +💴150' : 'lost'}</b></span>` : ''}</div>` : ''
    ].join('');
    const rr = $('#dreport');
    rr.innerHTML = `<div class="rep"><div class="reph">SHIFT REPORT</div><div class="repg g${grade}">${grade}</div>
      <div class="repn"><div><b>${S.ok}</b><span>Resolved</span></div><div><b>${S.fail}</b><span>Failed</span></div><div><b>${S.miss}</b><span>Missed</span></div><div><b>💴 ${credits}</b><span>Earned</span></div><div><b>⭐ ${rep >= 0 ? '+' : ''}${rep}</b><span>Reputation</span></div></div>${extra}
      <div class="repx">${G.roster.map(id => { const h = H(id); return `<div class="rx" style="--c:${ctx.WHO[id].c}"><div class="hp">${ctx.portrait(id)}</div><b>${N(id)}</b><small>+${S.xp[id]} XP · Lv ${h.lvl}</small>${ups.includes(id) ? '<em>LEVEL UP! +1 SP</em>' : ''}${h.hurt ? '<em class="hurt">INJURED</em>' : ''}</div>`; }).join('')}</div>
      ${ups.length ? '<p class="reptip">Spend skill points and pick perks in the <b>Dossier</b> tonight.</p>' : ''}<button class="btn primary" id="repok">Clock Out ▸</button></div>`;
    rr.classList.add('on');
    if (ups.length) setTimeout(() => ctx.sfx('levelup'), 700);
    if (grade === 'S') ctx.unlock('srank');
    if (G.calls >= 25) ctx.unlock('deploy5');
    ctx.journal(`Shift “${ctx.T(S.cfg.title || 'Shift')}”: grade ${grade}, ${S.ok}/${total} calls${S.best >= 4 ? `, best streak ${S.best}` : ''}.`);
    let clocked = false;
    $('#repok').onclick = () => { if (clocked) return; clocked = true; ctx.sfx('confirm'); const cb = ctx.onDone; close(); cb(res); };
    if (Dispatch.auto) setTimeout(() => $('#repok') && $('#repok').click(), 50);
  }
  function close() { cancelAnimationFrame(raf); const el = $('#dispatch'); if (el) { el.classList.remove('on'); setTimeout(() => el.remove(), 400); } S = null; rosterSig = listSig = objSig = ''; }

  function autoplay() {
    S.calls.filter(c => c.state === 'open').forEach(c => {
      const free = ctx.G.roster.filter(id => S.hero[id].s === 'ready' && !S.calls.some(o => o !== c && o.state === 'open' && o.team.includes(id)));
      if (!free.length) return;
      free.sort((a, b) => ST.reduce((s, k) => s + Math.min(H(b).st[k], c.req[k]), 0) - ST.reduce((s, k) => s + Math.min(H(a).st[k], c.req[k]), 0));
      c.team = free.slice(0, c.slots); send(c);
    });
  }
  return { start, close, auto: false, ST, SN, SI, useSkill, get S() { return S; }, get active() { return !!S; } };
})();

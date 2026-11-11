'use strict';
// Chapter 1 day planner: HUD, agency hub, training drills, missions (battles), title screen.
(function () {
  const { $, el, sleep } = AH, C = AHChars.CHARS, IDS = ['akari', 'rei', 'mio'];
  const DOW = ['MON', 'TUE', 'WED', 'THU', 'FRI'], DAYNAME = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], SLOT = ['Morning', 'Afternoon', 'Evening'];
  const STAT = { pow: ['POWER', 'p', 'POW'], ctl: ['CONTROL', 'c', 'CTL'], hrt: ['HEART', 'h', 'HRT'] };
  const rank = r => r < 15 ? 'E' : r < 35 ? 'D' : r < 60 ? 'C' : r < 90 ? 'B' : 'A';
  const S = () => AH.state.sim, snd = n => AHAudio.sfx(n);
  const hover = b => { b.onmouseenter = () => snd('hover'); return b; };
  const ui = $('#sceneui'), hub = $('#hub');

  function hud() {
    const s = S(); $('#hud').classList.toggle('hidden', !s.active); if (!s.active) return;
    $('#hudDayN').textContent = 'DAY ' + s.day; $('#hudDow').textContent = DOW[s.day - 1] || '';
    document.querySelectorAll('.hud-time .seg').forEach((e, i) => { e.classList.toggle('now', i === s.slot); e.classList.toggle('done', i < s.slot); });
    $('#hudEn').style.width = s.energy + '%'; $('#hudEnN').textContent = s.energy; $('#hudEn').parentNode.classList.toggle('low', s.energy < 30);
    $('#hudRep').style.width = Math.min(100, s.rep) + '%'; $('#hudRank').textContent = rank(s.rep); $('#hudFunds').textContent = s.funds;
  }
  AH.hud = hud;
  $('#hudMenu').onclick = () => { snd('click'); AH.openModal('MENU', b => { const w = el('div', 'cfg'); const r = el('div', 'wide'); r.style.flexWrap = 'wrap';
    for (const [t, f] of [['SAVE', () => AH.saveScreen(true)], ['LOAD', () => AH.saveScreen(false)], ['BACKLOG', AH.logScreen], ['CONFIG', AH.configScreen], ['GALLERY', AH.galleryScreen]]) { const bt = hover(el('button', 'pbtn', t)); bt.onclick = f; r.appendChild(bt); } w.appendChild(r); b.appendChild(w); }); };
  const addStat = (id, k, n) => { const h = S().h[id]; h[k] = Math.max(0, Math.min(100, h[k] + n)); };
  const spend = n => { S().energy = Math.max(0, Math.min(100, S().energy - n)); hud(); };

  // ---------------- hub ----------------
  const tri = x => Math.abs(((x % 2) + 2) % 2 - 1);
  function hubDraw(x, t) {
    AHArt.drawBg(x, 'lobby', t, AH.tod());
    IDS.forEach((id, i) => { const ph = t * (.05 + i * .012) + i * .7, px = 50 + tri(ph) * 380, right = (((ph % 2) + 2) % 2) > 1;
      AHArt.sprite(x, id, 'walk', t + i, px, 348 - i * 5, 96, !right); });
    AHArt.sprite(x, 'you', 'idle', t, 368, 300, 96, false);
  }
  const LOCS = [
    { k: 'train', ico: '⚔', name: 'Training Hall', c: '#ff7a3c', d: 'Run a drill with one hero. Raises a stat.' },
    { k: 'lounge', ico: '♥', name: 'Lounge', c: '#ff6f9c', d: 'Spend time with a hero, or bring a gift.' },
    { k: 'command', ico: '✦', name: 'Command Room', c: '#58d6ff', d: 'Deploy a hero on a mission for funds and rating.' },
    { k: 'office', ico: '✎', name: 'Your Office', c: '#ffd766', d: 'File reports for funds, or rest to recover.' },
  ];
  const TIPS = ['Each action uses one time slot. Three slots a day, five days until the Certification Trial.', 'Akari hits hard, Rei endures, Mio turns a fight around. Train what the team is missing.',
    'Bond scenes in the Lounge raise affection the most. Whoever you are closest to on Friday joins you on the rooftop.', 'In a fight, read the beast: STRIKE when it is exposed, FOCUS when it charges, SYNC when it guards.', 'Low on energy? Resting in your office takes a slot, but you cannot train on empty.'];
  function roster() {
    const r = el('div', 'roster');
    IDS.forEach((id, i) => { const h = S().h[id], c = C[id], card = el('div', 'hero'); card.style.setProperty('--c', c.color); card.style.animationDelay = i * 90 + 'ms';
      card.appendChild(AHChars.faceIcon(id, h.aff >= 40 ? 'happy' : 'smile')); const full = Math.min(5, Math.floor(h.aff / 12));
      const info = el('div', 'hi', `<div class="hn"><span>${c.full}</span><small>${c.alias}</small></div><div class="hearts"><b>${'♥'.repeat(full)}</b>${'♥'.repeat(5 - full)} <span style="font-size:11px;color:#9aa6d8">${h.aff}</span></div>` +
        Object.keys(STAT).map(k => `<div class="stat ${STAT[k][1]}">${STAT[k][2]}<div class="bar"><b style="width:${h[k]}%"></b></div><span>${h[k]}</span></div>`).join(''));
      card.appendChild(info); r.appendChild(card); });
    return r;
  }
  AH.hooks.hub = () => new Promise(res => {
    const s = S(), sc = AH.scene; s.active = true; AH.state.label = 'hub'; AH.state.idx = 0; AH.state.preview = `Agency hub — ${DAYNAME[s.day - 1]} ${SLOT[s.slot].toLowerCase()}`;
    sc.cg = null; sc.chars = []; sc.bg = 'lobby'; sc.tod = null; sc.custom = hubDraw; AH.hideBox(); AH.setMode('skip', false); AH.setMode('auto', false);
    AHAudio.play(s.slot === 2 ? 'night' : 'daily'); AH.scene.music = AHAudio.current; AH.save(0); hud(); hub.classList.remove('hidden');
    const done = (label, vars) => { Object.assign(AH.state.vars, vars || {}); hub.classList.add('hidden'); sc.custom = null; res(label); };
    const main = () => {
      hub.innerHTML = ''; hub.appendChild(el('div', 'hub-title', `AEGIS HQ · ${DAYNAME[s.day - 1].toUpperCase()} ${SLOT[s.slot].toUpperCase()} · WHAT WILL YOU DO?`));
      const g = el('div', 'locs'); LOCS.forEach((L, i) => { const b = hover(el('button', 'loc', `<div class="ico"><span>${L.ico}</span></div><b>${L.name}</b><small>${L.d}</small>`)); b.style.setProperty('--c', L.c); b.style.animationDelay = i * 70 + 'ms'; b.onclick = () => { snd('click'); sub(L); }; g.appendChild(b); });
      hub.appendChild(g); const tip = el('div', 'hub-tip', '<b style="color:#ffd766">HANDLER NOTE</b> — ' + TIPS[(s.day * 3 + s.slot) % TIPS.length]); tip.style.top = '300px'; tip.style.bottom = 'auto'; hub.appendChild(tip); hub.appendChild(roster());
    };
    const panel = (L, title, text, opts) => { hub.querySelectorAll('.locs, .sub, .hub-tip').forEach(e => e.remove()); const p = el('div', 'sub', `<h3>${title}</h3><p>${text}</p>`); p.style.setProperty('--c', L.c); const o = el('div', 'opts'); p.appendChild(o);
      for (const [html, fn, dis, col] of opts) { const b = hover(el('button', 'opt', html)); if (col) b.style.setProperty('--c', col); b.disabled = !!dis; b.onclick = () => { snd('click'); fn(); }; o.appendChild(b); }
      const bk = hover(el('button', 'opt back', '◂ Back')); bk.onclick = () => { snd('cancel'); main(); }; o.appendChild(bk); hub.appendChild(p); };
    const heroOpts = (fn, extra) => IDS.map(id => [`<span>${C[id].full}</span><small>${extra ? extra(id) : C[id].alias}</small>`, () => fn(id), false, C[id].color]);
    const sub = L => {
      if (L.k === 'train') panel(L, 'Training Hall', `Pick a hero to drill. Costs <b>20 energy</b>.${s.energy < 20 ? ' <b style="color:#ff5a6a">You are too tired to run a drill.</b>' : ''}`, s.energy < 20 ? [] : heroOpts(id => panel(L, C[id].name + ' — choose a drill', 'Time your call when the meter is in the gold zone for a bonus.',
        Object.keys(STAT).map(k => [`<span>${STAT[k][0]} drill</span><small>now ${s.h[id][k]}</small>`, () => done('act_train', { who: id, drill: k })]))));
      else if (L.k === 'lounge') panel(L, 'Lounge', 'Who do you want to see?', heroOpts(id => { const h = s.h[id];
        panel(L, C[id].name, h.bond < 3 ? 'She looks like she has something on her mind.' : 'She waves you over to the sofa.', [
          [`<span>Spend time together</span><small>${h.bond < 3 ? 'Bond scene ' + (h.bond + 1) + ' / 3' : 'Chat'} · 10 energy</small>`, () => { if (h.bond < 3) { h.bond++; done('bond_' + id + '_' + h.bond); } else done('act_chat', { who: id }); }, s.energy < 10],
          [`<span>Buy her something from the vending machine</span><small>◈ 250 · no time cost${AH.state.vars.gifted === s.day + '-' + s.slot + id ? ' · already did' : ''}</small>`, () => { AH.state.vars.gifted = s.day + '-' + s.slot + id; done('act_gift', { who: id }); }, s.funds < 250 || AH.state.vars.gifted === s.day + '-' + s.slot + id]]); },
        id => `Bond ${s.h[id].bond} / 3`));
      else if (L.k === 'command') panel(L, 'Command Room', `Rift activity on the board. Costs <b>30 energy</b>.${s.energy < 30 ? ' <b style="color:#ff5a6a">You are too tired to run a deployment.</b>' : ''}`, s.energy < 30 ? [] : MISSIONS.map((m, i) => [`<span>${m.name}</span><small>${m.tag} · ◈ ${m.funds}</small>`, () => panel(L, m.name, 'Who do you send?', heroOpts(id => done('act_mission', { who: id, mission: i }), id => `POW ${s.h[id].pow} · CTL ${s.h[id].ctl} · HRT ${s.h[id].hrt}`))]));
      else panel(L, 'Your Office', 'A desk, a monitor, and a growing pile of incident forms.', [
        ['<span>File reports</span><small>◈ +200 · rating up · 15 energy</small>', () => done('act_paper'), s.energy < 15],
        ['<span>Rest</span><small>+50 energy</small>', () => done('act_rest'), s.energy >= 100]]);
    };
    main();
  });
  AH.hooks.resetUi = () => { hub.classList.add('hidden'); ui.classList.add('hidden'); ui.innerHTML = ''; $('#hud').classList.add('hidden'); $('#card').classList.add('hidden'); $('#choices').innerHTML = ''; document.body.classList.remove('hideui'); };

  // Advance the clock; returns the next label (a scripted event or the hub).
  const EVENTS = { '3-0': 'ev_deploy', '5-0': 'ev_friday', '5-2': 'finale' };
  AH.hooks.advance = async () => {
    const s = S(); s.slot++; AH.hideBox();
    if (s.slot > 2) { await AH.fade(true); s.slot = 0; s.day++; s.energy = Math.min(100, s.energy + 40); AH.scene.chars = []; AH.scene.bg = 'black'; hud(); AH.fade(false); snd('day');
      await AH.card('DAY ' + s.day, DAYNAME[s.day - 1], s.day === 5 ? 'Certification Trial tonight' : (5 - s.day) + (5 - s.day === 1 ? ' day' : ' days') + ' until the Certification Trial'); }
    else snd('whoosh');
    hud(); return EVENTS[s.day + '-' + s.slot] || 'hub';
  };
  AH.hooks.simOn = () => { S().active = true; hud(); };
  AH.hooks.simOff = () => { S().active = false; hud(); };

  // ---------------- training drill ----------------
  const FXCOL = { akari: ['#ff8a2a', '#fff2a0'], rei: ['#7ad0f0', '#ffffff'], mio: ['#b07aff', '#2a1848'] };
  const BARK = {
    akari: { pow: ['a grin fists: Did you SEE that?! The target is *gone*, Handler!', 'a happy wave: One more! One more! I can go hotter!'], ctl: ['a pout down: Small flames are so much harder than big ones…', 'a smile chest: I held it! Ten whole seconds without burning the mat!'], hrt: ['a happy fists: Calling out before I move… it actually works!', 'a smile wave: I waited for your signal this time. Proud of me?'] },
    rei: { pow: ['r serious power: Output up eight percent. Acceptable.', 'r cool crossed: I do not need to hit hard. …But I can.'], ctl: ['r smile chest: Every shard exactly where I wanted it.', 'r cool power: Precision is simply respect for the people standing nearby.'], hrt: ['r blush chest: Relying on a call is… not unpleasant.', 'r sigh crossed: Fine. I will say "covering you" out loud next time.'] },
    mio: { pow: ['m smug power: Critical hit. Mio wins. Loot, please.', 'm surprised down: W-wait, that actually broke? I broke it?'], ctl: ['m smile chest: Landed the blink on the mark. First try. …Okay, third.', 'm smug hip: Teleport cooldown management. It is a *skill*, Handler.'], hrt: ['m blush chest: I said the plan out loud. With my mouth. To people.', 'm shy chest: …It is easier when it is your voice in the earpiece.'] },
  };
  AH.hooks.train = async () => {
    const { who, drill } = AH.state.vars, s = S(), sc = AH.scene, c = C[who], anim = { pow: 'attack', ctl: 'jump', hrt: 'kick' }[drill];
    await AH.fade(true); AHAudio.play('training'); spend(20);
    let phase = 'run', t0 = AH.time(), burst = 0;
    sc.chars = []; sc.custom = (x, t) => { AHArt.drawBg(x, 'training', t, 0); const e = t - t0, px = phase === 'run' ? 120 + Math.min(1, e / 1.2) * 150 : 270;
      AHArt.sprite(x, who, phase === 'run' && e < 1.2 ? 'run' : phase === 'done' ? 'idle' : anim, t, px, 330, 128);
      AHArt.sprite(x, 'you', 'idle', t, 70, 322, 96, false);
      // holo target
      const tx = 430, ty = 250 + Math.sin(t * 3) * 6, hit = burst > 0; x.strokeStyle = hit ? '#ffffff' : '#ffd766'; x.lineWidth = hit ? 4 : 2; for (const r of [34, 22, 9]) { x.beginPath(); x.arc(tx, ty, r + (hit ? 4 : 0), 0, 7); x.stroke(); }
      if (phase !== 'done') for (let i = 0; i < 10; i++) { const l = (t * 1.6 + i / 10) % 1; x.globalAlpha = 1 - l; AHArt.R(x, FXCOL[who][i % 2], 300 + l * 120, 270 - Math.sin(l * 3.1) * (20 + i * 3) + (i % 3) * 8, 5, 5); } x.globalAlpha = 1;
      if (burst > 0) { burst -= .016; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28, d = (1 - burst) * 70; AHArt.R(x, FXCOL[who][i % 2], tx + Math.cos(a) * d, ty + Math.sin(a) * d, 6, 6); } } };
    ui.innerHTML = ''; ui.classList.remove('hidden'); const ban = el('div', 'banner', `${STAT[drill][0]} DRILL<small>${c.full.toUpperCase()} · ${c.alias}</small>`); ban.style.setProperty('--c', c.color); ui.appendChild(ban);
    await AH.fade(false); snd(c.fx); await sleep(900); phase = 'drill';
    // timing call
    const meter = el('div', 'meter', `CALL IT IN THE GOLD ZONE<div class="bar"><b></b><i style="position:absolute;left:68%;width:20%;top:0;bottom:0;background:#ffd76690;border:2px solid #ffd766"></i></div>`), fill = meter.querySelector('b'); ui.appendChild(meter);
    const calls = el('div', 'calls'), cb = hover(el('button', 'call', '<b>CALL!</b><small>click or press Space</small>')); cb.style.setProperty('--c', '#ffd766'); calls.appendChild(cb); calls.style.bottom = '26px'; meter.style.bottom = '122px'; ui.appendChild(calls);
    const v = await new Promise(res => { let p = 0, stop = false, last = performance.now(); const key = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fin(); } };
      const fin = () => { if (stop) return; stop = true; window.removeEventListener('keydown', key, true); res(p); }; cb.onclick = fin; window.addEventListener('keydown', key, true);
      (function tick() { if (stop) return; const n = performance.now(); p = tri((n - last) / 1100) * 100; fill.style.width = p + '%'; if (Math.random() < .08) snd('step'); requestAnimationFrame(tick); })(); });
    const q = v >= 68 && v <= 88 ? 2 : v >= 52 && v <= 96 ? 1 : 0, gain = Math.round((7 + Math.random() * 3 + (who === 'akari' && drill === 'pow' || who === 'rei' && drill === 'ctl' || who === 'mio' && drill === 'hrt' ? 2 : 0)) * [1, 1.25, 1.6][q]);
    calls.remove(); meter.remove(); burst = 1; snd('impact'); AH.shake(.3); await sleep(500); phase = 'done';
    addStat(who, drill, gain); addStat(who, 'aff', q === 2 ? 2 : 1); s.rep += 1; hud();
    const pop = el('div', 'pop', `${['OK!', 'GREAT!', 'PERFECT!'][q]}<small>${c.name} · ${STAT[drill][0]} +${gain}</small>`); ui.appendChild(pop); snd(q === 2 ? 'fanfare' : 'statup'); await sleep(1900);
    await AH.fade(true); ui.classList.add('hidden'); ui.innerHTML = ''; sc.custom = null; sc.bg = 'training'; sc.tod = null; AH.show(who, 'smile', 'down', 'center', true); AH.fade(false);
    const line = BARK[who][drill][Math.floor(Math.random() * 2)], m = line.match(/^(\w) (\w+) (\w+): (.*)$/); await AH.say({ who: m[1], expr: m[2], pose: m[3], text: m[4] });
    return 'slot_end';
  };

  // ---------------- battles ----------------
  const MISSIONS = [
    { name: 'Street Patrol', tag: 'Easy', hp: 70, atk: 9, funds: 300, rep: 5, foe: 'Riftling' },
    { name: 'Rift Sweep', tag: 'Normal', hp: 120, atk: 13, funds: 500, rep: 9, foe: 'Rift Hound' },
    { name: 'Breach Response', tag: 'Hard', hp: 175, atk: 17, funds: 800, rep: 14, foe: 'Rift Brute' },
  ];
  const INTENT = { charge: ['CHARGING UP', 'It is gathering power. Brace for it.', '#ff5a6a'], guard: ['GUARDING', 'Its hide has hardened. Brute force will bounce.', '#58d6ff'], open: ['EXPOSED', 'Its core is showing. Now is the moment.', '#ffd766'] };
  // opts: { heroes:[ids], foe, hp, atk, big, bg }
  AH.battle = async opts => {
    const s = S(), sc = AH.scene, team = opts.heroes, k = team.length > 1 ? .5 : 1;
    const st = { pow: 0, ctl: 0, hrt: 0 }; for (const id of team) for (const key in st) st[key] += s.h[id][key] * k;
    const maxHp = Math.round(60 + st.ctl * .8 + (team.length > 1 ? 40 : 0)); let hp = maxHp, ehp = opts.hp, charged = false, front = team[0], round = 0;
    const A = { hero: 'idle', heroT: 0, lunge: 0, elunge: 0, ehurt: 0, hhurt: 0, shield: 0, fx: null, fxT: 0 };
    await AH.fade(true); AHAudio.play(opts.big ? 'battle' : 'tension');
    sc.chars = []; sc.custom = (x, t, dt) => { AHArt.drawBg(x, opts.bg || ['city_day', 'city_sunset', 'city_night'][AH.tod()], t, 0);
      for (const key of ['lunge', 'elunge', 'ehurt', 'hhurt', 'shield', 'fxT']) if (A[key] > 0) A[key] -= dt;
      AHArt.beast(x, 470 - Math.sin(Math.max(0, A.elunge) * 6.3) * 60 + (A.ehurt > 0 ? Math.sin(t * 80) * 4 : 0), opts.big ? 286 : 296, opts.big ? 1.2 : .75, t, A.ehurt > .25 ? 1 : 0);
      team.forEach((id, i) => { if (id === front) return; AHArt.sprite(x, id, 'idle', t + i, 50 + i * 46, 300 + i * 3, 112, false); });
      const hx = 190 + Math.sin(Math.max(0, A.lunge) * 6.3) * 90 + (A.hhurt > 0 ? Math.sin(t * 80) * 4 : 0), anim = A.heroT > t ? A.hero : 'idle';
      AHArt.sprite(x, front, anim, anim === 'idle' ? t : (t - (A.heroT - 1)), hx, 304, 160);
      if (A.shield > 0) { x.strokeStyle = '#7ad0f0'; x.lineWidth = 3; x.globalAlpha = Math.min(1, A.shield * 2); x.beginPath(); x.arc(hx, 240, 60 + Math.sin(t * 10) * 2, 0, 7); x.stroke(); x.globalAlpha = 1; }
      if (A.fxT > 0 && A.fx) { const l = 1 - A.fxT / .6, col = FXCOL[A.fx]; for (let i = 0; i < 14; i++) { const a = i * .45; AHArt.R(x, col[i % 2], 250 + l * 200 + Math.cos(a) * 16, 240 + Math.sin(a + l * 8) * 22, 7, 7); } } };
    ui.innerHTML = ''; ui.classList.remove('hidden');
    const hb = el('div', 'hpbox l', `<span></span><div class="bar"><b style="width:100%"></b></div><small></small>`), eb = el('div', 'hpbox r', `<span>${opts.foe}</span><div class="bar"><b style="width:100%"></b></div><small></small>`), logEl = el('div', 'blog'), calls = el('div', 'calls');
    ui.appendChild(hb); ui.appendChild(eb); ui.appendChild(logEl); ui.appendChild(calls);
    const upd = () => { hb.querySelector('span').textContent = (team.length > 1 ? 'UNIT 7 · ' : '') + C[front].alias; hb.querySelector('b').style.width = Math.max(0, hp / maxHp * 100) + '%'; hb.querySelector('.bar').classList.toggle('low', hp < maxHp * .3); hb.querySelector('small').textContent = charged ? '★ FOCUSED — next strike hits harder' : `HP ${Math.max(0, Math.round(hp))} / ${maxHp}`; eb.querySelector('b').style.width = Math.max(0, ehp / opts.hp * 100) + '%'; };
    const dmgPop = (n, left, col) => { const d = el('div', 'dmg', n); d.style.left = left + 'px'; d.style.top = '330px'; if (col) d.style.color = col; ui.appendChild(d); setTimeout(() => d.remove(), 900); };
    upd(); await AH.fade(false); snd('alarm'); logEl.textContent = `${opts.foe} emerges from the rift!`; await sleep(1300);
    while (hp > 0 && ehp > 0) {
      round++; const intent = round === 1 ? 'open' : ['charge', 'guard', 'open', 'charge', 'guard'][Math.floor(Math.random() * 5)], I = INTENT[intent];
      eb.querySelector('small').textContent = '▶ ' + I[0]; eb.querySelector('small').style.color = I[2]; logEl.innerHTML = `<span style="color:${I[2]}">${I[1]}</span>`; if (intent === 'charge') snd('rumble'); else snd('scan');
      const pick = await new Promise(res => { calls.innerHTML = ''; [['strike', 'STRIKE', 'Power. Double on an exposed core.', '#ff7a3c'], ['focus', 'FOCUS', 'Control. Block most of the hit, charge up.', '#58d6ff'], ['sync', 'SYNC', 'Heart. Breaks a guard and heals.', '#ff6f9c']].forEach(([key, n, d, col], i) => { const b = hover(el('button', 'call', `<b>${n}</b><small>${d}</small>`)); b.style.setProperty('--c', col); b.style.animationDelay = i * 60 + 'ms'; b.onclick = () => { snd('confirm'); res(key); }; calls.appendChild(b); }); });
      calls.innerHTML = ''; const rnd = () => .88 + Math.random() * .24; let dmg = 0, block = 1, msg = '';
      if (team.length > 1) front = { strike: 'akari', focus: 'rei', sync: 'mio' }[pick]; upd();
      if (pick === 'strike') { dmg = (10 + st.pow * .5) * rnd() * (charged ? 1.5 : 1) * (intent === 'guard' ? .4 : intent === 'open' ? 1.9 : 1); charged = false; A.hero = 'attack'; A.heroT = AH.time() + .62; A.lunge = .5; msg = intent === 'open' ? 'Direct hit on the core!' : intent === 'guard' ? 'The blow glances off its hide…' : 'A solid hit!'; }
      else if (pick === 'focus') { dmg = (4 + st.ctl * .22) * rnd(); block = .25; charged = true; A.shield = 1.6; A.hero = 'hover'; A.heroT = AH.time() + .8; msg = 'Guard up. Power gathering.'; }
      else { dmg = (8 + st.hrt * .5) * rnd() * (intent === 'guard' ? 1.7 : 1); const heal = Math.round(6 + st.hrt * .16); hp = Math.min(maxHp, hp + heal); A.hero = 'kick'; A.heroT = AH.time() + .62; A.lunge = .5; msg = intent === 'guard' ? 'In sync — the guard shatters!' : 'In sync! The team steadies.'; setTimeout(() => dmgPop('+' + heal, 330, '#7dffb0'), 250); }
      A.fx = front; A.fxT = .6; snd(C[front].fx); await sleep(330); dmg = Math.round(dmg); ehp -= dmg; A.ehurt = .4; snd('hit'); AH.shake(.25); dmgPop(dmg, 900, intent === 'open' && pick === 'strike' ? '#ffd766' : '#fff'); logEl.textContent = msg; upd(); await sleep(800);
      if (ehp <= 0) break;
      let ed = Math.round(Math.max(2, (opts.atk * (intent === 'charge' ? 2.3 : intent === 'guard' ? .5 : 1) - st.ctl * .1) * rnd() * block));
      A.elunge = .5; await sleep(250); hp -= ed; A.hhurt = .4; snd('impact'); AH.shake(intent === 'charge' ? .5 : .25); dmgPop(ed, 360, '#ff5a6a'); logEl.textContent = block < 1 ? 'Blocked! Barely a scratch.' : intent === 'charge' ? 'The charged blow lands hard!' : `${opts.foe} strikes back.`; upd(); await sleep(850);
    }
    const win = ehp <= 0; logEl.textContent = ''; eb.querySelector('small').textContent = '';
    const pop = el('div', 'pop', win ? `MISSION CLEAR<small>${opts.foe} sealed</small>` : `RETREAT<small>${C[front].name} falls back</small>`); if (!win) pop.style.color = '#ff5a6a'; ui.appendChild(pop); snd(win ? 'fanfare' : 'fail'); if (win) AH.flash('#fff', 500); await sleep(2100);
    await AH.fade(true); ui.classList.add('hidden'); ui.innerHTML = ''; sc.custom = null; return win;
  };
  AH.hooks.mission = async () => {
    const { who, mission } = AH.state.vars, m = MISSIONS[mission], s = S(), sc = AH.scene; spend(30);
    const win = await AH.battle({ heroes: [who], foe: m.foe, hp: m.hp, atk: m.atk });
    sc.bg = 'command'; sc.tod = null; AH.show(who, win ? 'happy' : 'sad', win ? 'wave' : 'down', 'center', true); AHAudio.play(s.slot === 2 ? 'night' : 'daily'); AH.fade(false);
    if (win) { s.funds += m.funds; s.rep += m.rep; addStat(who, 'aff', 2); for (const k of ['pow', 'ctl', 'hrt']) addStat(who, k, 1 + mission); AH.toast(`<b>◈ +${m.funds}</b> funds`, '#ffd766'); AH.toast(`Rating <b>+${m.rep}</b>`); snd('coin'); }
    else { s.funds += 80; s.rep += 1; addStat(who, 'ctl', 2); AH.toast('<b>◈ +80</b> hazard pay', '#ffd766'); }
    hud(); AH.state.vars.win = win; return 'mission_after';
  };
  AH.hooks.finaleBattle = async () => {
    let hpK = 1;
    for (; ;) { const win = await AH.battle({ heroes: IDS, foe: 'The Gatekeeper', hp: Math.round(330 * hpK), atk: 20, big: true, bg: 'city_attack' }); if (win) break;
      AH.scene.bg = 'city_attack'; AH.fade(false); await AH.say({ who: null, text: '(Not yet. Breathe. Look again — *where is the seam?*)' }); await AH.say({ who: 't', text: 'Handler. They are still standing because they are waiting on your call. Give it to them.' }); hpK *= .8; }
    AH.scene.bg = 'black'; AH.fade(false); S().rep += 25; AH.state.vars.trialRank = rank(S().rep); hud();
  };
  AH.hooks.tutorialBattle = async () => { for (; ;) { if (await AH.battle({ heroes: IDS, foe: 'Rift Hound', hp: 150, atk: 11, bg: 'city_attack' })) break; AH.scene.bg = 'city_attack'; AH.fade(false); await AH.say({ who: 't', text: 'Again. Read it first, *then* call. Strike when exposed, Focus when it charges, Sync when it guards.' }); } AH.scene.bg = 'black'; AH.fade(false); S().rep += 10; S().funds += 400; hud(); };
  AH.hooks.gift = () => { const s = S(); s.funds -= 250; hud(); snd('coin'); };
  AH.hooks.paper = () => { const s = S(); spend(15); s.funds += 200; s.rep += 4; hud(); snd('coin'); AH.toast('<b>◈ +200</b> funds', '#ffd766'); AH.toast('Rating <b>+4</b>'); };
  AH.hooks.rest = () => { spend(-50); snd('chime'); AH.toast('Energy <b>+50</b>', '#3ae08a'); };
  AH.hooks.tired = () => { spend(10); };
  AH.hooks.best = () => { const h = S().h; AH.state.vars.best = IDS.slice().sort((a, b) => h[b].aff - h[a].aff)[0]; AH.state.vars.total = IDS.reduce((n, id) => n + h[id].pow + h[id].ctl + h[id].hrt, 0); };

  // ---------------- title ----------------
  AH.hooks.toTitle = async () => {
    AH.stopRun(); await AH.fade(true); AH.hooks.resetUi(); AH.hideBox(); const sc = AH.scene; sc.chars = []; sc.cg = null; sc.custom = AHArt.CG.title; AHAudio.play('title');
    const m = $('#tmenu'); m.innerHTML = ''; const has = n => !!AH.store.get('save.' + n), any = [0, 1, 2, 3, 4, 5, 6].some(has);
    const items = [['NEW GAME', async () => { AH.newState(); $('#title').classList.add('hidden'); await AH.fade(true); sc.custom = null; sc.bg = 'black'; AH.fade(false); AH.run('prologue'); }],
      ['CONTINUE', () => { let best = -1, w = 0; for (let n = 0; n <= 6; n++) { const d = AH.store.get('save.' + n); if (d && d.when > w) { w = d.when; best = n; } } AH.load(best); }, !any], ['LOAD', () => AH.saveScreen(false), !any], ['GALLERY', AH.galleryScreen], ['CONFIG', AH.configScreen]];
    items.forEach(([t, f, dis], i) => { const b = hover(el('button', '', `<span>${t}</span>`)); b.disabled = !!dis; b.style.animationDelay = 300 + i * 90 + 'ms'; b.onclick = () => { snd('confirm'); f(); }; m.appendChild(b); });
    $('#title').classList.remove('hidden'); AH.fade(false);
  };
})();

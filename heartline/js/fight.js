/* HEARTLINE AGENCY — Standoff: the turn-based fights against the big ones.
   Every foe shows its hand: the next move and its target are always on the board. You answer it with orders for each
   hero (Strike, Guard, Cover, a signature Skill) and with the Handler's Focus (Scan, Brace, Triage, Stand Up).
   Every Notebook tell you have learned for a hero on the field unlocks a one-time READ for that hero.
   The core (state, rules, resolution) is DOM-free so it can be simulated; the UI at the bottom drives it. */
const Fight = (() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mkRng = seed => { let s = (seed >>> 0) || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const SK = ['com', 'vig', 'mob', 'cha', 'int'];
  const CALL = { tier: 4, req: {}, special: 1 };
  const EL = { lightning: ['⚡', 'Lightning'], shadow: ['🌑', 'Shadow'], wind: ['💨', 'Wind'], steel: ['🔩', 'Steel'], sound: ['🎵', 'Sound'], fire: ['🔥', 'Fire'], light: ['✨', 'Hard-light'], none: ['', ''] };

  // ---------- hero kits ----------
  // el: element of their Strike. sk: signature Skill (cooldown in rounds, tgt: what it needs picked).
  const KIT = {
    hikari: { el: 'lightning', sk: { n: 'Lightning Lance', ic: '⚡', cd: 3, d: 'Her biggest hit: 2.1× a Strike, ignores armor. She is spent next round (Guard only).' } },
    rei: { el: 'shadow', sk: { n: 'Shadow Bind', ic: '🌑', cd: 4, d: 'Binds the foe: it loses its action this round (a charge is cancelled) and it loses 1 Poise.' } },
    kaede: { el: 'wind', sk: { n: 'Gale Rush', ic: '💨', cd: 3, d: 'Moves first. Two hits at 70%, and she is gone before the foe answers: she takes no damage this round.' } },
    tetsu: { el: 'steel', sk: { n: 'Hold the Line', ic: '🔩', cd: 3, d: 'Single-target attacks must go through him, at 40% damage. He answers with a 1.2× counter.' } },
    sora: { el: 'sound', sk: { n: 'Rally Song', ic: '🎤', cd: 3, d: 'The whole team deals +35% this round, and everyone standing heals 12%.' } },
    rin: { el: 'sound', sk: { n: 'Resonance', ic: '🔔', cd: 3, d: 'Finds the crack. The foe takes +40% from everyone this round, and its next two moves are revealed.' } },
    natsuki: { el: 'fire', sk: { n: 'Fireman\'s Carry', ic: '🧯', cd: 3, tgt: 'ally', d: 'Pulls an ally out of the line of fire (cannot be targeted this round) and patches them for 25%.' } },
    shiori: { el: 'light', sk: { n: 'Hard-Light Lance', ic: '✨', cd: 3, d: '1.6× a Strike. Pierces armor and breaks 1 Poise.' } }
  };

  // ---------- Notebook reads: one use per fight, free, only if you learned the tell ----------
  const READS = {
    hikari_count: { who: 'hikari', n: 'Count with her', ic: '🔢', d: 'Say the numbers with her. Skill ready again, and her next hit is a guaranteed crit.' },
    rei_scarf: { who: 'rei', n: 'Wait for the true thing', ic: '🧣', d: 'Give Rei a beat. Everyone Kneeled, Bound or Frozen is freed, and her Skill is ready.' },
    rei_still: { who: 'rei', n: 'Cover her while she freezes', ic: '🫥', d: 'Rei heals 35% and cannot be targeted this round.' },
    mira_tidy: { who: 'mira', n: 'Let Mira tidy up', ic: '🩺', d: 'A full sweep: heals everyone 30%, clears every status and raises the fallen.' },
    kaede_heel: { who: 'kaede', n: 'Let Kaede go quiet', ic: '🥁', d: 'She moves first, takes no damage this round, and her next hit is a guaranteed crit.' },
    sora_stage: { who: 'sora', n: 'Cue the real voice', ic: '🎙️', d: 'No stage face. The team deals +40% this round and heals 15%.' },
    tetsu_polite: { who: 'tetsu', n: 'He said "please"', ic: '🙏', d: 'Tetsu takes no damage this round, draws every single-target attack, and breaks 2 Poise.' },
    rin_hum: { who: 'rin', n: 'Follow the hum', ic: '〰️', d: 'The foe\'s next three moves and its weakness are revealed; it takes +50% this round.' },
    shiori_cuffs: { who: 'shiori', n: 'Don\'t give that order', ic: '⌚', d: 'Shiori ignores every command for the rest of the fight, and her next hit pierces and breaks 1 Poise.' }
  };

  // ---------- foes ----------
  const M = (n, ic, k, o) => Object.assign({ n, ic, k }, o);
  const FOES = {
    hound: { n: 'Rift Hound', art: 'hound', hp: 62, atk: 6, poise: 2, tier: 1, weak: ['lightning'], res: [], seq: ['lunge', 'lunge', 'howl', 'crouch'],
      mv: { lunge: M('Lunge', '🐺', 'single', { d: 1.25, tg: 'weak', t: 'Jaws first, no warning.' }), howl: M('Howl', '📢', 'sweep', { d: .55, t: 'A note that rattles every tooth in the room.' }), crouch: M('Crouch', '🌀', 'charge', { rel: 'pounce', t: 'Weight shifts back. Something is about to be thrown.' }), pounce: M('Pounce', '💥', 'single', { d: 2.2, tg: 'rand', heavy: 1 }) } },
    leviathan: { n: 'Glass Leviathan', art: 'leviathan', hp: 150, atk: 8, poise: 3, tier: 4, weak: ['lightning', 'sound'], res: ['shadow'], seq: ['tide', 'lash', 'coil', 'reform', 'tide', 'lash', 'coil'],
      mv: { tide: M('Tidal Sweep', '🌊', 'sweep', { d: .8, t: 'The bay stands up and leans.' }), lash: M('Glass Lash', '🪢', 'single', { d: 1.3, tg: 'rand', t: 'A whip of shards.' }), coil: M('Coil', '🌀', 'charge', { rel: 'maw', t: 'It draws back. Whatever comes next is large.' }), maw: M('Crystal Maw', '🦷', 'single', { d: 2.4, tg: 'weak', heavy: 1 }), reform: M('Reform', '🛡️', 'shield', { heal: .06, t: 'Shards knit across its flank. Hits will bounce.' }) } },
    glazier: { n: 'The Glazier', art: 'glazier', hp: 150, atk: 11, poise: 3, tier: 4, weak: ['sound', 'wind'], res: ['shadow'], seq: ['shatter', 'grip', 'mirror', 'pane', 'shatter', 'grip', 'mirror', 'pane'],
      mv: { shatter: M('Shatter', '💎', 'sweep', { d: .7, t: 'Every surface lets go at once.' }), grip: M('Cold Grip', '🥶', 'bind', { d: .7, tg: 'strong', t: 'Frost climbs the leg of whoever hits hardest.' }), mirror: M('Mirror Pane', '🪞', 'mirror', { t: 'It raises a mirror. Whatever strikes it, strikes back.' }), pane: M('Pane Through', '🔪', 'single', { d: 1.6, tg: 'weak', t: 'A pane of glass, edge first.' }) } },
    aegis: { n: 'Shiori Kagami', art: 'shiori', hp: 170, atk: 12, poise: 3, tier: 4, weak: ['shadow', 'wind'], res: ['light'], yield: 'shiori_cuffs', seq: ['lance', 'wall', 'warn', 'volley', 'command', 'lance', 'wall', 'warn', 'volley', 'command'],
      mv: { lance: M('Hard-Light Lance', '✨', 'single', { d: 1.8, tg: 'strong', t: 'Textbook form. No wasted motion.' }), warn: M('Final Warning', '⚠️', 'charge', { rel: 'exec', t: 'She squares her shoulders. This is the move the manual calls a last resort.' }), exec: M('Execute Order', '🗡️', 'single', { d: 2.5, tg: 'weak', heavy: 1 }), wall: M('Aegis Wall', '🛡️', 'shield', { heal: 0, t: 'A hex wall goes up between her and you.' }), volley: M('Volley', '🔆', 'sweep', { d: .9, t: 'Eight beams, one for each exit.' }), command: M('Stand Down!', '📣', 'bind', { d: .5, tg: 'strong', t: 'An order in a voice that expects obedience. One of you will be unable to disobey it.' }) } },
    rift: { n: 'The Rift Heart', art: 'leviathan', hp: 220, atk: 11, poise: 3, tier: 5, weak: ['lightning', 'light'], res: ['shadow'], phase2: .5, seq: ['pulse', 'spear', 'coil', 'reform', 'pulse', 'spear', 'coil'], seq2: ['collapse', 'spear', 'spear', 'coil2', 'collapse', 'spear', 'coil2'],
      mv: { pulse: M('Rift Pulse', '🔴', 'sweep', { d: .75, t: 'The red core beats once. The street flinches.' }), spear: M('Glass Spear', '🗡️', 'single', { d: 1.35, tg: 'rand', t: 'A lance of the city\'s own windows.' }), coil: M('Gather', '🌀', 'charge', { rel: 'nova', t: 'Everything nearby leans toward the core.' }), nova: M('Heartbreak', '💥', 'single', { d: 2.5, tg: 'weak', heavy: 1 }), reform: M('Reform', '🛡️', 'shield', { heal: .05, t: 'The core rolls under armor.' }), collapse: M('Collapse', '🌋', 'sweep', { d: 1.0, t: 'The sky starts coming down in sheets.' }), coil2: M('Overload', '☀️', 'charge', { rel: 'nova2', t: 'The core goes white. Whatever this is, it ends something.' }), nova2: M('Whiteout', '☀️', 'sweep', { d: 1.6, heavy: 1 }) } },
    chairman: { n: 'Chairman Kuroda', art: 'kuroda', hp: 190, atk: 11, poise: 4, tier: 5, weak: [], res: [], kneel: 2, seq: ['verdict', 'decree', 'verdict', 'edict', 'decree', 'verdict'],
      mv: { verdict: M('Verdict', '⚖️', 'single', { d: 1.5, tg: 'strong', t: 'Said gently. The worst things he says are always kind.' }), decree: M('Decree', '📜', 'sweep', { d: .6, t: 'Everyone is addressed by name, one at a time.' }), edict: M('Edict', '🔒', 'shield', { heal: .05, t: 'He rewrites the rules of the room so that he cannot be hurt in it.' }) } }
  };
  const ATK_K = 1.8;
  const diffMul = G => ({ story: .6, normal: 1, hard: 1.25 }[G.diff || 'normal'] || 1);

  // ---------- state ----------
  function mk(cfg, G, WHO, seed) {
    const def = FOES[cfg.foe] || FOES.hound, ids = (cfg.team || G.roster).filter(id => G.heroes[id] && KIT[id]).slice(0, 5);
    const team = ids.map(id => mkHero(G, id, ids, WHO));
    const n = Math.max(1, team.length), avg = team.reduce((s, h) => s + h.lvl, 0) / n;
    const hp = Math.round(def.hp * (.7 + .15 * n) * (1 + (avg - 1) * .06) * (cfg.hpx || 1));
    const F = { cfg, G, WHO, r: mkRng(seed || (G.day * 7919 + n * 31 + def.hp)), def, team, round: 0, focus: cfg.focus === undefined ? 2 : cfg.focus, maxFocus: 4, triage: cfg.medic === false ? 0 : 2, medic: cfg.medic !== false,
      usedRead: {}, events: [], log: [], over: null, stats: { parries: 0, downs: 0, reads: 0, orders: 0, crits: 0, staggers: 0, damage: 0 }, known: (G.foeK && G.foeK[cfg.foe]) || { weak: [], res: [] },
      foe: { id: cfg.foe, n: cfg.name || def.n, hp, max: hp, atk: def.atk * ATK_K * (1 + (avg - 1) * .06) * diffMul(G) * (cfg.atkx || 1), poise: def.poise, maxPoise: def.poise, phase: 1, i: 0, pend: null, next: null, shield: 0, mirror: 0, exposed: 0, bound: 0, stag: 0, rage: 0, boost: 0 },
      brace: 0, rally: 0, scan: 0, reveal: [], seq: def.seq, kneelN: Math.max(0, (def.kneel || 0) - (G.diff === 'story' ? 1 : 0)) };
    if (cfg.prep && G.flags && G.flags[cfg.prep] > 0) F.focus = Math.min(F.maxFocus, F.focus + 1);
    startRound(F); return F;
  }
  function mkHero(G, id, ids, WHO) {
    const h = G.heroes[id], st = {}; SK.forEach(k => st[k] = Sys.stat(G, null, id, k, CALL, ids));
    const max = 20 + st.vig * 4 + h.lvl * 3, mo = ((G.morale === undefined ? 60 : G.morale) - 50) / 250;
    const hp0 = Math.round(max * clamp(1 - (h.fat || 0) / 350 - (h.hurt ? .25 : 0), .5, 1));
    return { id, n: WHO[id] ? WHO[id].n : id, lvl: h.lvl, st, max, hp: hp0, down: 0, el: KIT[id].el, cd: 0, spent: 0, guard: 0, covering: null, safe: 0, evade: 0, frozen: 0, kneel: 0, noKneel: 0, crit: 0, first: 0, taunt: 0, counter: 0, pierce: 0, act: null, mo, upg: 0, tid: 0 };
  }
  const alive = F => F.team.filter(h => !h.down);
  const base = h => 3 + h.st.com * 1.2 + h.lvl * .5;
  const say = (F, t, c) => { F.log.push([t, c || '']); if (F.log.length > 60) F.log.shift(); F.events.push({ t: 'log', x: t, c: c || '' }); };
  const ev = (F, o) => F.events.push(o);

  // ---------- planning the foe's next move ----------
  const mvOf = (F, id) => F.def.mv[id];
  function pickTgt(F, rule) {
    const L = alive(F).filter(h => !h.safe); if (!L.length) return null;
    const tn = L.find(h => h.taunt); if (tn) return tn;
    if (rule === 'weak') return L.reduce((b, h) => (h.hp / h.max < b.hp / b.max ? h : b), L[0]);
    if (rule === 'strong') return L.reduce((b, h) => (h.st.com > b.st.com ? h : b), L[0]);
    return L[(F.r() * L.length) | 0];
  }
  function startRound(F) {
    const f = F.foe; F.round++;
    F.events.push({ t: 'round', n: F.round });
    if (F.round > 1) F.focus = clamp(F.focus + 1, 0, F.maxFocus);
    F.team.forEach(h => {
      h.guard = 0; h.covering = null; h.safe = 0; h.evade = 0; h.taunt = 0; h.counter = 0; h.act = null; h.first = 0; h.kneel = 0; h.immune = 0;
      if (h.cd > 0) h.cd--; h.spent = h.spentNext || 0; h.spentNext = 0;
    });
    F.rally = 0; F.brace = 0; f.exposed = 0; f.boost = 0; F.res = null;
    if (F.scan > 0) F.scan--;
    // rage: long fights get meaner
    if (F.round > 9) { f.rage = (F.round - 9) * .15; if (F.round === 10) say(F, `${f.n} is running out of patience.`, 'warn'); }
    // plan the move
    if (f.stag > 0) { f.stag--; f.next = { id: '_stag', k: 'stag' }; f.exposed = 1; f.poise = f.maxPoise; f.shield = 0; }
    else if (f.pend) { const m = mvOf(F, f.pend); f.next = { id: f.pend, k: m.k, tgt: m.k === 'sweep' ? null : pickTgt(F, m.tg), rel: 1 }; f.pend = null; }
    else {
      const seq = f.phase === 2 && F.def.seq2 ? F.def.seq2 : F.seq, id = seq[f.i++ % seq.length], m = mvOf(F, id);
      f.next = { id, k: m.k, tgt: m.k === 'single' || m.k === 'bind' ? pickTgt(F, m.tg) : null };
    }
    // the Chairman's Kneel: two heroes simply obey
    if (F.kneelN) { const L = alive(F).filter(h => !h.noKneel); for (let k = 0; k < Math.min(F.kneelN, L.length); k++) { const i = (F.r() * L.length) | 0, h = L.splice(i, 1)[0]; h.kneel = 1; } F.events.push({ t: 'kneel' }); }
    // frozen from the last round
    F.team.forEach(h => { if (h.frozenNext) { h.frozen = 1; h.frozenNext = 0; } else h.frozen = 0; });
    if (F.focus > F.maxFocus) F.focus = F.maxFocus;
  }
  function teleOf(F) {
    const f = F.foe, n = f.next; if (!n) return null;
    if (n.k === 'stag') return { ic: '💫', n: 'Staggered', t: `${f.n} can't act this round. Everything you hit lands for +60%.`, k: 'stag', tgt: null };
    const m = mvOf(F, n.id);
    return { ic: m.ic, n: m.n + (n.rel ? ' — released' : ''), t: m.t || '', k: m.k, tgt: n.tgt, heavy: !!m.heavy, d: m.d, charge: m.k === 'charge', rel: m.rel && mvOf(F, m.rel) };
  }
  function peek(F, n) {
    const f = F.foe, out = []; let i = f.i, pend = f.pend, ph = f.phase;
    if (f.next && f.next.id !== '_stag' && mvOf(F, f.next.id).k === 'charge') pend = mvOf(F, f.next.id).rel;
    for (let k = 0; k < n; k++) {
      if (pend) { out.push(mvOf(F, pend)); pend = null; continue; }
      const seq = ph === 2 && F.def.seq2 ? F.def.seq2 : F.seq, m = mvOf(F, seq[i++ % seq.length]); out.push(m); if (m.k === 'charge') pend = m.rel;
    }
    return out;
  }

  // ---------- damage ----------
  function toFoe(F, h, mult, o = {}) {
    const f = F.foe; let d = base(h) * mult * (1 + h.mo);
    const el = o.el || h.el, weak = F.def.weak.includes(el), res = F.def.res.includes(el);
    if (weak) { d *= 1.5; if (!F.known.weak.includes(el)) { F.known.weak.push(el); F.G.foeK = F.G.foeK || {}; F.G.foeK[F.cfg.foe] = F.known; say(F, `${EL[el][0]} ${f.n} flinches. Weak to ${EL[el][1]}.`, 'tip'); } }
    if (res) d *= .7;
    d *= 1 + (F.rally ? F.rally - 1 : 0) + (f.boost || 0);
    if (f.exposed) d *= 1.6;
    if (f.shield && !o.pierce && !h.pierce) d *= .4;
    const crit = h.crit || F.r() < h.st.int * .025; if (crit) { d *= 1.6; h.crit = 0; F.stats.crits++; }
    d *= .92 + F.r() * .16; d = Math.max(1, Math.round(d));
    if (f.mirror && o.phys) { const back = Math.round(d * .6); hurt(F, h, back, { src: 'mirror' }); say(F, `🪞 ${h.n}'s strike is thrown back at them for ${back}.`, 'bad'); ev(F, { t: 'reflect', who: h.id }); return 0; }
    f.hp = Math.max(0, f.hp - d); F.stats.damage += d;
    ev(F, { t: 'foe', n: d, crit: !!crit, weak, res, who: h.id, shield: !!(f.shield && !o.pierce && !h.pierce) });
    if (f.phase === 1 && F.def.phase2 && f.hp > 0 && f.hp <= f.max * F.def.phase2) { f.phase = 2; f.i = 0; f.pend = null; f.poise = f.maxPoise; f.shield = 0; say(F, `${f.n} changes. The red core goes white.`, 'warn'); ev(F, { t: 'phase' }); if (f.next && f.next.k === 'charge') {} }
    return d;
  }
  function breakPoise(F, n, why) {
    const f = F.foe; if (f.stag || (f.next && f.next.k === 'stag')) return;
    f.poise -= n; ev(F, { t: 'poise' });
    if (f.poise <= 0) { f.stag = 1; f.poise = 0; F.stats.staggers++; say(F, `💫 ${why || 'Poise broken'} — ${f.n} is staggered! It loses its next move, and you hit for +60%.`, 'good'); ev(F, { t: 'stagger' }); }
  }
  function hurt(F, h, raw, o = {}) {
    if (h.down) return 0;
    let d = raw * (1 - h.st.vig * .012);
    if (h.guard) d *= o.cover ? .5 : .35;
    if (h.taunt && o.single) d *= .4;
    if (h.taunt && !o.single) d *= .5;
    if (F.brace) d *= .7;
    if (h.evade || h.immune) d = 0;
    d = Math.round(d);
    if (d <= 0) { ev(F, { t: 'hero', who: h.id, n: 0 }); return 0; }
    h.hp = Math.max(0, h.hp - d); ev(F, { t: 'hero', who: h.id, n: d, guard: !!h.guard });
    if (h.hp <= 0) { h.down = 1; h.act = null; F.stats.downs++; say(F, `${h.n} is down.`, 'bad'); ev(F, { t: 'down', who: h.id }); }
    return d;
  }
  const heal = (F, h, n) => { if (h.down || n <= 0) return; n = Math.round(n); h.hp = Math.min(h.max, h.hp + n); ev(F, { t: 'heal', who: h.id, n }); };

  // ---------- actions ----------
  function canAct(F, h) { return !h.down && !h.frozen && !h.kneel; }
  function can(F, h, k) {
    if (!canAct(F, h)) return false;
    if (k === 'skill') return h.cd === 0 && !h.spent;
    if (k === 'strike') return !h.spent;
    return true;
  }
  const needsTgt = (h, k) => k === 'cover' || (k === 'skill' && KIT[h.id].sk.tgt === 'ally');
  function setAct(F, id, k, tgt) { const h = F.team.find(x => x.id === id); if (!h || !can(F, h, k)) return false; h.act = { k, tgt: tgt || null }; return true; }
  function estimate(F, h, k) {
    if (k === 'strike') return Math.round(base(h) * (1 + h.mo));
    const sk = h.id;
    if (k === 'skill') return { hikari: 2.1, shiori: 1.6, kaede: 1.4 }[sk] ? Math.round(base(h) * { hikari: 2.1, shiori: 1.6, kaede: 1.4 }[sk]) : 0;
    return 0;
  }

  // order: Handler's calls. returns true if applied
  function order(F, k, arg) {
    if (F.over) return false;
    const f = F.foe;
    if (k === 'scan') { if (F.focus < 1) return false; F.focus--; F.scan = 3; F.known.weak = F.def.weak.slice(); F.known.res = F.def.res.slice(); F.G.foeK = F.G.foeK || {}; F.G.foeK[F.cfg.foe] = F.known; F.stats.orders++; say(F, `📡 Scan: ${F.def.weak.length ? 'weak to ' + F.def.weak.map(e => EL[e][0] + EL[e][1]).join(', ') : 'no weakness'}${F.def.res.length ? '; resists ' + F.def.res.map(e => EL[e][0] + EL[e][1]).join(', ') : ''}. Next moves marked.`, 'tip'); ev(F, { t: 'order', k }); return true; }
    if (k === 'brace') { if (F.focus < 1 || F.brace) return false; F.focus--; F.brace = 1; F.stats.orders++; say(F, '🛡 Brace! The team takes 30% less this round.', 'good'); ev(F, { t: 'order', k }); return true; }
    if (k === 'triage') {
      if (!F.medic || F.triage < 1) return false; const h = F.team.find(x => x.id === arg); if (!h) return false;
      if (h.down) { h.down = 0; h.hp = Math.round(h.max * .3); say(F, `🩺 Mira pulls ${h.n} back to their feet.`, 'good'); ev(F, { t: 'revive', who: h.id }); }
      else if (h.hp < h.max) { heal(F, h, h.max * .4); say(F, `🩺 Mira patches ${h.n} through the comms. “Hold still. I said hold still.”`, 'good'); }
      else return false;
      F.triage--; F.stats.orders++; ev(F, { t: 'order', k }); return true;
    }
    if (k === 'standup') { if (F.focus < 1) return false; const h = F.team.find(x => x.id === arg); if (!h || !h.kneel) return false; F.focus--; h.kneel = 0; h.noKneelNow = 1; say(F, `${h.n} stands up. “Not on my knees. Not for him.”`, 'good'); F.stats.orders++; ev(F, { t: 'order', k }); return true; }
    if (k === 'read') {
      const r = READS[arg]; if (!r || F.usedRead[arg] || !(F.G.tells && F.G.tells[arg])) return false;
      const h = F.team.find(x => x.id === r.who), foeRead = arg === 'shiori_cuffs' && F.def.yield === 'shiori_cuffs'; if (r.who !== 'mira' && !foeRead && (!h || h.down)) return false;
      F.usedRead[arg] = 1; F.stats.reads++; ev(F, { t: 'read', k: arg });
      F.G.readsUsed = F.G.readsUsed || {}; F.G.readsUsed[arg] = 1;
      if (arg === 'hikari_count') { h.cd = 0; h.spent = 0; h.crit = 1; say(F, `📓 ${r.n}. “…three, four — okay.” ${h.n} steadies, and the numbers stop.`, 'read'); }
      if (arg === 'rei_scarf') { F.team.forEach(x => { x.kneel = 0; x.frozen = 0; x.noKneelNow = 1; }); h.cd = 0; say(F, `📓 ${r.n}. Her hand finds the scarf. “…Fine. Let go of them.”`, 'read'); }
      if (arg === 'rei_still') { heal(F, h, h.max * .35); h.safe = 1; if (f.next && f.next.tgt === h) f.next.tgt = pickTgt(F, 'rand'); say(F, `📓 ${r.n}. The others close ranks around the one person who isn't moving.`, 'read'); }
      if (arg === 'mira_tidy') { F.team.forEach(x => { if (x.down) { x.down = 0; x.hp = Math.round(x.max * .3); ev(F, { t: 'revive', who: x.id }); } else heal(F, x, x.max * .3); x.kneel = 0; x.frozen = 0; }); say(F, `📓 ${r.n}. “Everybody lie down. No, you stand. Hold this.”`, 'read'); }
      if (arg === 'kaede_heel') { h.first = 1; h.evade = 1; h.crit = 1; say(F, `📓 ${r.n}. The tapping stops. That is the thing to be afraid of.`, 'read'); }
      if (arg === 'sora_stage') { F.rally = Math.max(F.rally, 1.4); F.team.forEach(x => heal(F, x, x.max * .15)); say(F, `📓 ${r.n}. Flat, tired, funny. “Okay. Everybody. Together. Not for the crowd.”`, 'read'); }
      if (arg === 'tetsu_polite') { h.taunt = 1; h.guard = 1; h.safe = 0; h.immune = 1; h.counter = 1.5; if (f.next && (f.next.k === 'single' || f.next.k === 'bind')) f.next.tgt = h; breakPoise(F, 2, 'Tetsu planted his feet'); say(F, `📓 ${r.n}. “Please step back.” The room does.`, 'read'); }
      if (arg === 'rin_hum') { F.scan = 4; F.known.weak = F.def.weak.slice(); F.known.res = F.def.res.slice(); f.boost += .5; say(F, `📓 ${r.n}. Her hum bends toward the foe's weak point and holds there.`, 'read'); }
      if (arg === 'shiori_cuffs') { if (h) { h.noKneel = 1; h.kneel = 0; h.frozen = 0; h.pierce = 1; h.cmdImmune = 1; } if (F.def.yield === 'shiori_cuffs') { f.stag = 2; f.hp = Math.min(f.hp, Math.round(f.max * .28)); say(F, `📓 ${r.n}. Left cuff, right cuff. She doesn't fix the third one. Something in the line holds.`, 'read'); breakPoise(F, 9, 'She stops'); } else say(F, `📓 ${r.n}. Left cuff, right cuff — and she doesn't finish the third.`, 'read'); }
      return true;
    }
    return false;
  }
  function readsFor(F) {
    const out = []; Object.entries(READS).forEach(([k, r]) => { if (!(F.G.tells && F.G.tells[k])) return; if (r.who === 'mira' ? !F.medic : !(F.team.some(h => h.id === r.who) || (k === 'shiori_cuffs' && F.def.yield === 'shiori_cuffs'))) return; out.push([k, r, !!F.usedRead[k]]); });
    return out;
  }

  // ---------- resolution ----------
  function resolve(F) {
    if (F.over) return;
    const f = F.foe, L = alive(F);
    // idle heroes default to a plain Strike if they are able, else nothing
    L.forEach(h => { if (!h.act && can(F, h, 'strike')) h.act = { k: 'strike' }; if (!h.act && can(F, h, 'guard')) h.act = { k: 'guard' }; });
    // phase 1: stances (guard, cover, support skills, bind)
    L.forEach(h => {
      const a = h.act; if (!a || !canAct(F, h)) return;
      if (a.k === 'guard') { h.guard = 1; if (h.hp < h.max) heal(F, h, 2 + h.st.vig * .5); }
      if (a.k === 'cover') { const t = F.team.find(x => x.id === a.tgt); if (t && !t.down && t !== h) { h.guard = 1; h.covering = t; say(F, `🤝 ${h.n} steps in front of ${t.n}.`); } else h.guard = 1; }
      if (a.k === 'skill') skillStance(F, h, a);
    });
    // phase 2: attacks, quickest first (Kaede's rush and quiet reads go first)
    const queue = L.filter(h => h.act && canAct(F, h) && !h.down).sort((a, b) => (b.first - a.first) || (b.act.k === 'skill' && b.id === 'kaede') - (a.act.k === 'skill' && a.id === 'kaede') || b.st.mob - a.st.mob);
    for (const h of queue) {
      if (F.foe.hp <= 0) break;
      const a = h.act; if (h.down) continue;
      if (a.k === 'strike') { const d = toFoe(F, h, 1, { phys: 1 }); if (d) say(F, `${EL[h.el][0]} ${h.n} strikes for ${d}.`); if (h.pierce && d) { h.pierce = 0; breakPoise(F, 1, `${h.n}'s strike breaks its guard`); } }
      else if (a.k === 'skill') skillAttack(F, h, a);
    }
    if (f.hp <= 0) return end(F, 'win');
    // phase 3: the foe answers
    foeAct(F);
    if (F.foe.hp <= 0) return end(F, 'win');
    // phase 4: tick
    F.team.forEach(h => { if (h.act && h.act.k === 'skill' && !h.down && h.act.done) h.cd = KIT[h.id].sk.cd; h.act = null; });
    if (F.team.every(h => h.down)) return end(F, 'lose');
    f.shield = f.shield && f.next && f.next.id !== 'reform' && f.next.k !== 'shield' ? 0 : f.shield; if (f.bound) f.bound = 0;
    if (f.mirror && !(f.next && f.next.k === 'mirror')) f.mirror = 0;
    startRound(F);
  }
  function skillStance(F, h, a) {
    const f = F.foe, k = h.id; a.done = 1;
    if (k === 'rei') { f.bound = 1; breakPoise(F, 1, 'Shadows hold it'); say(F, `🌑 ${h.n} binds ${f.n}. It cannot move this round.`, 'good'); if (f.pend) f.pend = null; }
    if (k === 'kaede') { h.evade = 1; h.first = 1; }
    if (k === 'tetsu') { h.taunt = 1; h.guard = 1; h.counter = 1.2; if (f.next && (f.next.k === 'single' || f.next.k === 'bind')) f.next.tgt = h; say(F, `🔩 ${h.n} plants his feet. “Come on, then.”`, 'good'); }
    if (k === 'sora') { F.rally = Math.max(F.rally, 1.35); F.team.forEach(x => heal(F, x, x.max * .12)); say(F, `🎤 ${h.n}: “Okay — everybody, with me.” +35% for the team.`, 'good'); }
    if (k === 'rin') { f.boost += .4; F.scan = 3; F.known.weak = F.def.weak.slice(); say(F, `🔔 ${h.n} hums the foe's crack out loud. Everyone hits harder.`, 'good'); }
    if (k === 'natsuki') { const t = F.team.find(x => x.id === a.tgt) || h; t.safe = 1; heal(F, t, t.max * .25); h.guard = 1; if (f.next && f.next.tgt === t) f.next.tgt = pickTgt(F, 'rand'); say(F, `🧯 ${h.n} hauls ${t.n} clear of the line of fire.`, 'good'); }
  }
  function skillAttack(F, h, a) {
    const k = h.id, f = F.foe;
    if (k === 'hikari') { const d = toFoe(F, h, 2.1, { pierce: 1 }); say(F, `⚡ ${h.n}: ‘Lightning Lance!’ ${d} damage.`, 'good'); h.spentNext = 1; }
    if (k === 'kaede') { const d1 = toFoe(F, h, .7, { phys: 1 }), d2 = f.hp > 0 ? toFoe(F, h, .7, { phys: 1 }) : 0; say(F, `💨 ${h.n} is two places at once: ${d1} and ${d2}.`, 'good'); }
    if (k === 'shiori') { const d = toFoe(F, h, 1.6, { pierce: 1 }); breakPoise(F, 1, 'Hard-light breaks its guard'); say(F, `✨ ${h.n}'s lance: ${d} damage.`, 'good'); h.pierce = 0; }
    if (k === 'rei' && f.hp > 0) { const d = toFoe(F, h, .5, { pierce: 1 }); if (d) say(F, `🌑 The shadows bite for ${d}.`); }
    if (k === 'tetsu' || k === 'sora' || k === 'rin' || k === 'natsuki') {}
  }
  function foeAct(F) {
    const f = F.foe, n = f.next; if (!n) return;
    if (n.k === 'stag') { say(F, `💫 ${f.n} can't act.`, 'good'); return; }
    const m = mvOf(F, n.id), atk = f.atk * (1 + f.rage + (f.rageHit || 0));
    if (f.bound) { say(F, `${m.ic} ${f.n}'s ${m.n} dies in the shadows.`, 'good'); ev(F, { t: 'cancel' }); f.pend = null; return; }
    if (n.k === 'charge') { f.pend = m.rel; say(F, `${m.ic} ${f.n}: ${m.n}. ${m.t}`, 'warn'); return; }
    if (n.k === 'shield') { f.shield = 1; if (m.heal) { const hh = Math.round(f.max * m.heal); f.hp = Math.min(f.max, f.hp + hh); ev(F, { t: 'foeheal', n: hh }); } say(F, `${m.ic} ${f.n}: ${m.n}. ${m.t}`, 'warn'); return; }
    if (n.k === 'mirror') { f.mirror = 1; say(F, `${m.ic} ${f.n}: ${m.n}. ${m.t}`, 'warn'); return; }
    ev(F, { t: 'foeact', ic: m.ic, n: m.n });
    if (n.k === 'sweep') {
      say(F, `${m.ic} ${f.n}: ${m.n}!`, 'bad');
      alive(F).forEach(h => { if (h.safe && h.cmdImmune !== 1) return; const d = hurt(F, h, atk * m.d, { cover: 0 }); if (h.guard && d >= 0) { /* guard soaks sweeps but does not parry */ } if (h.taunt && h.counter) counter(F, h); });
      return;
    }
    // single / bind: find the real target (cover redirects)
    let t = n.tgt && !n.tgt.down ? n.tgt : pickTgt(F, m.tg); if (!t) return;
    let cov = null; const c = F.team.find(x => x.covering === t && !x.down); if (c) { cov = c; t = c; }
    if (m.heavy && F.team.some(x => x.taunt && x.id === 'tetsu' && !x.down)) { const tt = F.team.find(x => x.taunt && !x.down); if (tt) t = tt; }
    const parry = t.guard && !t.immune;
    const hit = hurt(F, t, atk * m.d * (m.heavy ? 1 : 1), { single: 1, cover: !!cov });
    say(F, `${m.ic} ${f.n}: ${m.n} → ${t.n}. ${hit ? hit + ' damage' + (t.guard ? ' (guarded)' : '') : (t.evade ? 'Nothing. She was already gone.' : 'No damage.')}`, hit ? 'bad' : 'good');
    if (parry) { F.stats.parries++; ev(F, { t: 'parry', who: t.id }); breakPoise(F, m.heavy ? 2 : 1, `${t.n} takes it on the guard`); }
    if (t.counter && !t.down) counter(F, t);
    if (n.k === 'bind' && !t.down && !(parry) && !t.cmdImmune) { t.frozenNext = 1; say(F, `${m.ic} ${t.n} can't move next round.`, 'bad'); ev(F, { t: 'frozen', who: t.id }); }
  }
  function counter(F, h) { const d = toFoe(F, h, h.counter, { phys: 0 }); if (d) say(F, `${h.n} answers with a counter: ${d}.`, 'good'); h.counter = 0; }
  function end(F, res) {
    F.over = res; const f = F.foe;
    F.G.foeK = F.G.foeK || {}; F.G.foeK[F.cfg.foe] = F.known;
    ev(F, { t: 'end', res });
    if (res === 'win') say(F, `${f.n} is finished.`, 'good');
    F.clean = F.team.every(h => !h.down) && F.stats.downs === 0;
    return res;
  }

  // ---------- AI used by auto-play and balance sims ----------
  function aiPlan(F, skill = 1, naive = 0) {
    const f = F.foe, n = f.next, tele = teleOf(F), L = alive(F);
    if (naive) { L.forEach(h => { if (!canAct(F, h)) return; if (can(F, h, 'skill') && ['hikari', 'kaede', 'shiori', 'rei'].includes(h.id)) return setAct(F, h.id, 'skill'); if (can(F, h, 'strike')) return setAct(F, h.id, 'strike'); setAct(F, h.id, 'guard'); }); return; }
    readsFor(F).forEach(([k, r, used]) => { if (used) return; const h = F.team.find(x => x.id === r.who); if (r.who === 'mira') { if (L.some(x => x.hp < x.max * .5) || F.team.some(x => x.down)) order(F, 'read', k); return; } if (h && !h.down && (F.round >= 2 || F.def.yield)) order(F, 'read', k); });
    F.team.forEach(h => { if (h.kneel && F.focus > 0) order(F, 'standup', h.id); });
    if (F.focus >= 2 && !F.scan && skill) order(F, 'scan');
    const low = F.team.slice().sort((a, b) => (a.down ? 9 : a.hp / a.max) - (b.down ? 9 : b.hp / b.max))[0];
    if (low && F.medic && F.triage > 0 && (low.down || low.hp < low.max * .35)) order(F, 'triage', low.id);
    if (tele && tele.heavy && F.focus > 0) order(F, 'brace');
    L.forEach(h => {
      if (!canAct(F, h)) return;
      if (tele && tele.heavy && tele.k === 'sweep' && can(F, h, 'guard')) return setAct(F, h.id, 'guard');
      const targeted = n && n.tgt === h, danger = targeted && tele && (tele.heavy || (tele.d || 0) * f.atk > h.hp * .8);
      if (h.id === 'rei' && can(F, h, 'skill') && (f.shield || (n && n.rel) || F.def.yield || F.round > 1)) return setAct(F, h.id, 'skill');
      if (h.id === 'sora' && can(F, h, 'skill') && L.length > 1) return setAct(F, h.id, 'skill');
      if (h.id === 'tetsu' && can(F, h, 'skill') && tele && (tele.k === 'single' || tele.heavy)) return setAct(F, h.id, 'skill');
      if (h.id === 'natsuki' && can(F, h, 'skill') && targeted) return setAct(F, h.id, 'skill', L.find(x => x !== h) ? L.find(x => x !== h).id : h.id);
      if (h.id === 'rin' && can(F, h, 'skill')) return setAct(F, h.id, 'skill');
      if (danger && can(F, h, 'guard')) return setAct(F, h.id, 'guard');
      if (f.shield && !F.rally && (h.id !== 'hikari' && h.id !== 'shiori') && can(F, h, 'guard') && h.hp < h.max) return setAct(F, h.id, 'guard');
      if (f.mirror && can(F, h, 'skill') && ['hikari', 'kaede', 'shiori'].includes(h.id)) return setAct(F, h.id, 'skill');
      if (f.mirror && can(F, h, 'guard')) return setAct(F, h.id, 'guard');
      if (can(F, h, 'skill') && ['hikari', 'kaede', 'shiori'].includes(h.id)) return setAct(F, h.id, 'skill');
      if (can(F, h, 'strike')) return setAct(F, h.id, 'strike');
      setAct(F, h.id, 'guard');
    });
  }
  // balance harness: play the fight with the AI until it ends
  function sim(cfg, G, WHO, seed, o = {}) {
    const F = mk(cfg, G, WHO, seed); let guard = 0;
    while (!F.over && guard++ < 40) { aiPlan(F, o.scan === undefined ? 1 : o.scan, o.naive); resolve(F); }
    return { res: F.over || 'timeout', rounds: F.round, clean: F.clean, hpLeft: F.team.map(h => h.down ? 0 : h.hp / h.max), parries: F.stats.parries, staggers: F.stats.staggers, reads: F.stats.reads };
  }

  // ======================= UI =======================
  let U = null; // { F, ctx, sel, armed, busy, results }
  const sleep = ms => new Promise(r => setTimeout(r, Fight.auto ? 4 : ms));
  const T = s => (U && U.ctx.T ? U.ctx.T(s) : s);
  const isHuman = def => ['shiori', 'kuroda'].includes(def.art);
  function foeArt() {
    const d = U.F.def;
    if (isHuman(d)) return U.ctx.art.char(d.art, d.art === 'shiori' ? 'angry' : 'cold', 'default', true);
    return U.ctx.art.monster(d.art);
  }
  function start(cfg, ctx) {
    const F = mk(cfg, ctx.G, ctx.WHO); U = { F, ctx, sel: null, armed: null, busy: false, tries: 0, cfg };
    F.team.forEach(h => ctx.art.warm && ctx.art.warm(h.id)); build(); ctx.music(cfg.music || 'boss'); draw(); intro();
    if (!Fight.auto && !(ctx.G.flags && ctx.G.flags.fightHowto)) { ctx.G.flags.fightHowto = 1; howto(); }
  }
  function intro() {
    const F = U.F, d = F.def; const t = teleOf(F);
    say(F, `${F.foe.n} · ${d.hp ? 'HP ' + F.foe.max : ''}. Read the board, then give your orders.`, 'sys');
    flushEvents();
    if (Fight.auto) setTimeout(autoTurn, 20);
  }
  function howto() {
    const el = $('#fover'); if (!el) return;
    el.innerHTML = `<div class="fres howto"><h2>HOW A STANDOFF WORKS</h2><ul>
      <li><b>Read the banner.</b> The foe's next move and its target are always on the board. Nothing is hidden from the Handler.</li>
      <li><b>Give orders.</b> Tap a hero: <i>Strike</i>, <i>Guard</i> (parry what is aimed at you), <i>Cover</i> (take a hit for an ally) or their <i>Skill</i>. Anyone you skip will Strike.</li>
      <li><b>Break its Poise.</b> Parries and Binds chip it; at zero the foe is staggered and takes +60%. Heavy moves telegraph a round early.</li>
      <li><b>Spend Focus ◆.</b> Scan shows weaknesses, Brace softens the round, Stand Up frees a hero. <b>📓 Reads</b> are free, but only exist for tells you wrote down.</li>
      <li><b>Losing isn't the end.</b> You can retry, or press on and pay for it.</li></ul>
      <div class="frow"><button class="btn primary" id="fhgo">Got it</button></div></div>`;
    el.classList.add('on'); $('#fhgo').onclick = () => { U.ctx.sfx('confirm'); el.classList.remove('on'); el.innerHTML = ''; };
  }
  function build() {
    const { F, cfg } = U, host = U.ctx.host;
    host.innerHTML = `<div class="fight"><div class="fhead"><div><b>${T(cfg.title || F.foe.n)}</b>${cfg.sub ? `<small>${T(cfg.sub)}</small>` : ''}</div><div class="fchips"><button class="fq" id="fq" title="How a Standoff works">?</button><span id="fround">Round 1</span><span class="focus" id="ffocus" title="Handler's Focus. Spent on Scan, Brace and Stand Up. +1 every round."></span></div></div>
      <div class="farena">${cfg.bg && U.ctx.art.bg ? `<div class="fbg">${U.ctx.art.bg(cfg.bg)}</div>` : ''}<div class="ffoe ${isHuman(F.def) ? 'human' : ''}" id="ffoe"><div class="fsp">${foeArt()}</div><div class="fname"><b>${F.foe.n}</b><span id="ffst"></span></div><div class="fbar foe"><i id="ffhp"></i><em id="ffhpt"></em></div><div class="fpoise" id="ffpoise" title="Poise. Parries and Binds break it; at zero the foe is staggered."></div><div class="fknown" id="ffknown"></div></div>
        <div class="fparty n${F.team.length}" id="fparty"></div></div>
      <div class="ftele" id="ftele"></div>
      <div class="fcmd" id="fcmd"></div>
      <div class="forders" id="forders"></div>
      <div class="fbot"><div class="flog" id="flog"></div><button class="btn primary fgo" id="fgo">Resolve round ▸</button></div><div class="fover" id="fover"></div></div>`;
    $('#fgo').onclick = () => go(); $('#fq').onclick = () => { U.ctx.sfx('click'); howto(); };
  }
  const pct = (a, b) => Math.max(0, Math.min(100, a / b * 100));
  function draw() {
    const { F } = U, f = F.foe;
    $('#fround').textContent = `Round ${F.round}`;
    $('#ffocus').innerHTML = [...Array(F.maxFocus)].map((_, i) => `<i class="${i < F.focus ? 'on' : ''}"></i>`).join('') + `<small>Focus</small>`;
    $('#ffhp').style.width = pct(f.hp, f.max) + '%'; $('#ffhpt').textContent = `${f.hp}/${f.max}`;
    $('#ffpoise').innerHTML = `Poise ${[...Array(f.maxPoise)].map((_, i) => `<i class="${i < f.poise ? 'on' : ''}"></i>`).join('')}`;
    const st = []; if (f.shield) st.push('🛡 Hardened'); if (f.mirror) st.push('🪞 Mirror'); if (f.next && f.next.k === 'stag') st.push('💫 Staggered'); if (f.phase === 2) st.push('☀ Phase 2'); if (f.rage) st.push('😡 Enraged');
    $('#ffst').textContent = st.join(' · ');
    $('#ffknown').innerHTML = (F.known.weak.length ? `Weak ${F.known.weak.map(e => EL[e][0]).join('')}` : 'Weak ?') + (F.known.res.length ? ` · Resists ${F.known.res.map(e => EL[e][0]).join('')}` : '');
    const tl = teleOf(F), nxt = F.scan > 0 ? peek(F, 2) : [];
    const tgt = tl && tl.tgt ? `→ <b>${tl.tgt.n}</b>` : tl && (tl.k === 'sweep') ? '→ <b>everyone</b>' : '';
    const hint = tl ? (tl.k === 'single' || tl.k === 'bind' ? (tl.heavy ? 'Heavy. Guard on the target parries it and breaks 2 Poise. Binding it cancels it.' : 'Guard on the target parries it. Cover steps in front.') : tl.k === 'sweep' ? 'Hits everyone. Guard softens it, Brace helps the team.' : tl.k === 'charge' ? `It is gathering for ${tl.rel ? tl.rel.n : 'something big'}. Bind it, or hit hard now.` : tl.k === 'shield' ? 'Hits will bounce next round. Pierce it, guard, or support.' : tl.k === 'mirror' ? 'Strikes will be thrown back. Use skills, or hold.' : tl.k === 'stag' ? 'Open window: hit it with everything.' : '') : '';
    $('#ftele').innerHTML = tl ? `<div class="ftl ${tl.heavy ? 'heavy' : ''} ${tl.k}"><span class="ftic">${tl.ic}</span><div><b>${tl.n} ${tgt}</b><small>${tl.t || ''} <i>${hint}</i></small></div>${nxt.length ? `<div class="ftnx">then ${nxt.map(m => m.ic).join(' ')}</div>` : ''}</div>` : '';
    // party
    $('#fparty').innerHTML = F.team.map(h => {
      const a = h.act, ico = a ? { strike: '⚔', guard: '🛡', cover: '🤝', skill: KIT[h.id].sk.ic }[a.k] : '';
      const stt = [h.guard ? '🛡' : '', h.frozen ? '🥶' : '', h.kneel ? '⛓' : '', h.spent ? '💤' : '', h.safe ? '🫥' : '', h.evade ? '💨' : '', h.crit ? '✦' : ''].join('');
      return `<button class="fh ${h.down ? 'down' : ''} ${U.sel === h.id ? 'sel' : ''} ${U.armed ? 'pick' : ''} ${h.kneel ? 'kneel' : ''} ${a ? 'acted' : ''}" data-h="${h.id}" style="--c:${F.WHO[h.id].c}"><div class="fpt">${U.ctx.art.char(h.id, h.down ? 'sad' : h.kneel ? 'sad' : h.hp < h.max * .35 ? 'scared' : 'smile', 'default', true)}</div>
        <div class="fhi"><b>${h.n}</b><div class="fbar"><i style="width:${pct(h.hp, h.max)}%"></i><em>${h.hp}/${h.max}</em></div><div class="fst">${stt}${h.cd > 0 ? `<span title="Skill cooldown">⏳${h.cd}</span>` : ''}${ico ? `<span class="fact">${ico}</span>` : ''}</div></div></button>`;
    }).join('');
    $$('#fparty .fh').forEach(b => b.onclick = () => pickHero(b.dataset.h));
    cmd(); orders();
    const ready = alive(F).every(h => h.act || !can(F, h, 'strike') && !can(F, h, 'guard'));
    $('#fgo').textContent = ready ? 'Resolve round ▸' : 'Resolve (idle heroes Strike) ▸';
    $('#fgo').disabled = U.busy || !!F.over;
    $('#flog').innerHTML = F.log.slice(-5).map(([t, c]) => `<div class="${c}">${T(t)}</div>`).join('');
  }
  function pickHero(id) {
    if (U.busy || U.F.over) return;
    const h = U.F.team.find(x => x.id === id); if (!h) return;
    if (U.armed) {
      const A = U.armed; U.armed = null;
      if (A.k === 'triage') { if (order(U.F, 'triage', id)) U.ctx.sfx('heal'); else U.ctx.sfx('fail'); }
      else if (A.k === 'standup') { if (order(U.F, 'standup', id)) { U.ctx.sfx('confirm'); U.ctx.unlock && U.ctx.unlock('fight_kneel'); } else U.ctx.sfx('fail'); }
      else if (A.k === 'cover' || A.k === 'skill') { if (h.id !== A.h && !h.down) { setAct(U.F, A.h, A.k, id); U.ctx.sfx('confirm'); } else U.ctx.sfx('fail'); }
      flushEvents(); return draw();
    }
    U.sel = id; U.ctx.sfx('click'); draw();
  }
  function cmd() {
    const { F } = U, el = $('#fcmd'), h = F.team.find(x => x.id === U.sel);
    if (U.armed) { el.innerHTML = `<div class="fhint">${U.armed.msg}</div><button class="btn" id="fcancel">Cancel</button>`; $('#fcancel').onclick = () => { U.armed = null; draw(); }; return; }
    if (!h) { el.innerHTML = `<div class="fhint">${alive(F).length ? 'Pick a hero, then give them an order. Anyone you skip will Strike.' : ''}</div>`; return; }
    const kit = KIT[h.id], sk = kit.sk, a = h.act ? h.act.k : '';
    const reason = h.down ? 'Down' : h.frozen ? 'Frozen: loses this round' : h.kneel ? 'Kneeling. Spend Focus on Stand Up, or find a Read' : '';
    if (reason) { el.innerHTML = `<div class="fhint"><b>${h.n}</b>: ${reason}.</div>`; return; }
    const btn = (k, ic, lab, sub, on) => `<button class="fc ${a === k ? 'on' : ''}" data-k="${k}" ${on ? '' : 'disabled'}><b>${ic} ${lab}</b><small>${sub}</small></button>`;
    el.innerHTML = `<div class="fcrow">${btn('strike', '⚔', 'Strike', `${EL[h.el][0]} ~${estimate(F, h, 'strike')} dmg`, can(F, h, 'strike'))}${btn('guard', '🛡', 'Guard', 'Take 65% less. Parry what is aimed at you', true)}${btn('cover', '🤝', 'Cover', 'Take the hit meant for an ally', F.team.some(x => x !== h && !x.down))}${btn('skill', sk.ic, sk.n, h.spent ? 'Spent: Guard only' : h.cd ? `Ready in ${h.cd}` : sk.d, can(F, h, 'skill'))}</div>`;
    $$('#fcmd .fc').forEach(b => b.onclick = () => {
      const k = b.dataset.k; U.ctx.sfx('click');
      if (needsTgt(h, k)) { U.armed = { k, h: h.id, msg: `${k === 'cover' ? 'Cover whom?' : sk.n + ': pick an ally'} Click a hero.` }; return draw(); }
      setAct(F, h.id, k); U.sel = null; draw();
    });
  }
  function orders() {
    const { F } = U, el = $('#forders'), rs = readsFor(F);
    const kn = F.team.filter(h => h.kneel);
    el.innerHTML = `<span class="fol">Handler</span><button class="fo" data-o="scan" ${F.focus < 1 || F.scan ? 'disabled' : ''} title="Reveal weaknesses and the next two moves"><b>📡 Scan</b><i>◆1</i></button>
      <button class="fo" data-o="brace" ${F.focus < 1 || F.brace ? 'disabled' : ''} title="The team takes 30% less this round"><b>🛡 Brace</b><i>◆1</i></button>
      ${F.medic ? `<button class="fo" data-o="triage" ${F.triage < 1 ? 'disabled' : ''} title="Mira on comms: heal 40% or raise a fallen hero"><b>🩺 Triage</b><i>×${F.triage}</i></button>` : ''}
      ${kn.length ? `<button class="fo kn" data-o="standup" ${F.focus < 1 ? 'disabled' : ''} title="Free a Kneeling hero"><b>⛓ Stand up</b><i>◆1</i></button>` : ''}
      ${rs.map(([k, r, used]) => `<button class="fo read ${used ? 'used' : ''}" data-r="${k}" ${used ? 'disabled' : ''} title="${r.d}"><b>📓 ${r.n}</b><i>${used ? 'used' : 'free'}</i></button>`).join('')}`;
    $$('#forders .fo').forEach(b => b.onclick = () => {
      if (U.busy || F.over) return; const o = b.dataset.o, r = b.dataset.r;
      if (r) { if (order(F, 'read', r)) { U.ctx.sfx('page'); } else U.ctx.sfx('fail'); flushEvents(); return draw(); }
      if (o === 'triage') { U.armed = { k: 'triage', msg: 'Triage whom? Click a hero.' }; return draw(); }
      if (o === 'standup') { U.armed = { k: 'standup', msg: 'Stand up whom? Click a kneeling hero.' }; return draw(); }
      if (order(F, o)) U.ctx.sfx('confirm'); else U.ctx.sfx('fail');
      flushEvents(); draw();
    });
  }

  // floating numbers, shakes and sounds for what just happened
  function float(sel, txt, cls) {
    const host = typeof sel === 'string' ? $(sel) : sel; if (!host) return;
    const e = document.createElement('div'); e.className = 'fnum ' + (cls || ''); e.textContent = txt; host.appendChild(e); setTimeout(() => e.remove(), 1200);
  }
  const heroEl = id => $(`#fparty .fh[data-h="${id}"]`);
  async function flushEvents() {
    const F = U.F, evs = F.events.splice(0); const sfx = U.ctx.sfx;
    for (const e of evs) {
      if (e.t === 'foe') { float('#ffoe', (e.crit ? '✦ ' : '') + e.n, e.weak ? 'weak' : e.shield ? 'soft' : 'foe'); const el = $('#ffoe .fsp'); if (el) { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); } sfx(e.weak ? 'thunder' : 'punch'); await sleep(260); }
      else if (e.t === 'hero') { const el = heroEl(e.who); if (el) { float(el, e.n ? '−' + e.n : 'miss', e.n ? (e.guard ? 'guard' : 'hurt') : 'heal'); el.classList.remove('hurt'); void el.offsetWidth; el.classList.add('hurt'); } sfx(e.n ? 'hit' : 'miss'); await sleep(240); }
      else if (e.t === 'heal') { const el = heroEl(e.who); if (el) float(el, '+' + e.n, 'heal'); sfx('heal'); }
      else if (e.t === 'parry') { sfx('shatter'); const el = heroEl(e.who); if (el) float(el, 'PARRY', 'good'); await sleep(220); }
      else if (e.t === 'stagger') { sfx('perfect'); float('#ffoe', 'STAGGER', 'good'); await sleep(300); }
      else if (e.t === 'down') { sfx('fail'); await sleep(260); }
      else if (e.t === 'revive') { sfx('levelup'); }
      else if (e.t === 'read') { sfx('page'); }
      else if (e.t === 'phase') { sfx('roar'); U.ctx.shake && U.ctx.shake(8); await sleep(500); }
      else if (e.t === 'kneel') { sfx('heartbeat'); }
      else if (e.t === 'cancel') { sfx('shadow'); }
    }
    if (U && U.F) $('#flog') && ($('#flog').innerHTML = U.F.log.slice(-5).map(([t, c]) => `<div class="${c}">${T(t)}</div>`).join(''));
  }
  async function go() {
    if (!U || U.busy || U.F.over) return; const F = U.F; U.busy = true; U.sel = null; U.armed = null; $('#fgo').disabled = true;
    resolve(F); await flushEvents(); U.busy = false; draw();
    if (F.over) return finish();
    if (Fight.auto) setTimeout(autoTurn, 20);
  }
  function autoTurn() { if (!U || U.F.over || U.busy) return; aiPlan(U.F); go(); }

  function finish() {
    const { F, ctx, cfg } = U, win = F.over === 'win', G = ctx.G;
    const res = { id: cfg.id || cfg.foe, readKeys: Object.keys(F.usedRead), win, clean: !!F.clean, rounds: F.round, reads: F.stats.reads, parries: F.stats.parries, staggers: F.stats.staggers, downs: F.stats.downs };
    const xp = Math.round((win ? 20 + F.def.tier * 12 + (F.clean ? 12 : 0) + (cfg.xp || 0) : 8) * (cfg.xpMul || 1)), el = $('#fover');
    const rows = F.team.map(h => `<span style="--c:${F.WHO[h.id].c}">${h.n} <b>+${xp} XP</b></span>`).join('');
    const stat = `<div class="fstats"><span>🔁 Rounds <b>${F.round}</b></span><span>🛡 Parries <b>${F.stats.parries}</b></span><span>💫 Staggers <b>${F.stats.staggers}</b></span><span>📓 Reads <b>${F.stats.reads}</b></span><span>🩹 Downed <b>${F.stats.downs}</b></span></div>`;
    el.innerHTML = `<div class="fres ${win ? 'win' : 'lose'}"><h2>${win ? (F.clean ? 'CLEAN WIN' : 'VICTORY') : 'DEFEAT'}</h2>${stat}<div class="fxp">${rows}</div>
      <p>${win ? (F.clean ? 'Nobody went down. Write that in the notebook.' : 'It is down, and so is someone. Mira is already on the radio.') : cfg.loseText || 'The line breaks. Everyone gets out, barely. This will cost you.'}</p>
      <div class="frow">${win ? '<button class="btn primary" id="fdone">Continue ▸</button>' : `<button class="btn primary" id="fretry">Try again</button><button class="btn" id="fdone">${cfg.noPress ? 'Leave' : 'Press on (setback)'}</button>`}</div></div>`;
    el.classList.add('on'); ctx.sfx(win ? 'success' : 'fail'); if (!win) ctx.music('sad');
    const done = () => { if (!U || U.F !== F) return; ctx.sfx('confirm'); const my = U; U = null; ctx.host.innerHTML = ''; xp && F.team.forEach(h => ctx.xp(h.id, xp)); my.ctx.onDone(res); };
    $('#fdone').onclick = done;
    const rt = $('#fretry'); if (rt) rt.onclick = () => { ctx.sfx('confirm'); const t = U.tries + 1; start(cfg, ctx); U.tries = t; };
    if (Fight.auto) setTimeout(() => { if (win || U.tries >= 2) done(); else rt.click(); }, 30);
  }
  return { start, mk, resolve, order, setAct, aiPlan, sim, FOES, KIT, READS, EL, teleOf, readsFor, auto: false, get active() { return !!U; } };
})();

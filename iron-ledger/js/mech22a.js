// 2.2 mechanics, part one: codebreaking, scientists, refugees, operational planning, industrial evacuation.
'use strict';
const monthOf = () => new Date(Date.UTC(1936, 0, 1 + G.day)).getUTCMonth() + 1;
// ======================= 1. Codebreaking =======================
// Every nation encrypts its orders; codebreakers work on one enemy cipher at a time. A broken cipher lets us read that
// nation: our armies fight better against it, its armies are visible through the fog of war, its raiders lose our
// convoys and our raiders find its ships. The more openly we act on what we read, the likelier they notice and change it.
const CR0 = { GER: [3, 2], JAP: [3, 1], ENG: [2, 2], USA: [2, 2], SOV: [2, 1], FRA: [2, 1], ITA: [2, 1], POL: [2, 3], CZE: [2, 1], SWE: [2, 1] };
const crOf = c => c.crypto || (c.crypto = { cipher: (CR0[c.tag] || [1, 0])[0], team: (CR0[c.tag] || [1, 0])[1], work: {}, broken: {}, target: null, use: 'careful' });
const crBroken = (a, b) => { const c = C(a); return !!(c && c.crypto && (c.crypto.broken[b] || 0) > G.day); };
function crGain(c, t) { const k = crOf(c), T = crOf(C(t)); return (k.team * 4 + (c.techs.s_computing ? 6 : 0) + (typeof netOf === 'function' && netOf(c, t) >= 50 ? 3 : 0) + (hasSpirit(c, 'p_codebreak') ? 5 : 0) + sciBonus(c, 'math') * 2) / (1 + T.cipher * 0.6); }
function crMonthly(c) { const k = crOf(c);
  if (c.ai && (!k.target || !ok(k.target) || !atWar(c.tag, k.target))) { const e = enemiesOf(c.tag).map(C).filter(x => x && !x.capitulated).sort((a, b) => countryStr(b.tag) - countryStr(a.tag))[0]; k.target = e ? e.tag : null; }
  const t = k.target; if (t && ok(t) && t !== c.tag && (atWar(c.tag, t) || G.tension > 40) && !crBroken(c.tag, t)) { k.work[t] = (k.work[t] || 0) + crGain(c, t);
    if (k.work[t] >= 100) { k.work[t] = 0; k.broken[t] = G.day + 240; if (c.tag === G.player) UIH.popup({ title: 'A Cipher Broken', icon: '🔐', desc: `Our codebreakers can read ${cname(t)}'s signals. Use the intelligence carefully, or they will notice and change their ciphers.`, options: [{ name: 'Excellent.' }] }); } }
  for (const b in k.broken) { if (k.broken[b] <= G.day) { delete k.broken[b]; continue; } if (Math.random() < (k.use === 'full' ? 0.08 : 0.025)) { delete k.broken[b]; const B = crOf(C(b)); B.cipher = Math.min(5, B.cipher + 1); if (c.tag === G.player) UIH.notify(`${cname(b)} has changed its ciphers. Our codebreakers must start again.`, 'bad'); if (b === G.player) UIH.notify(`Our signals had been read by ${c.name}. New ciphers are issued.`, 'bad'); } }
  if (c.ai && c.pp > 150 && k.cipher < 4 && Object.keys(C(c.tag).crypto.broken).length === 0 && enemiesOf(c.tag).some(e => crBroken(e, c.tag))) crAct(c, 'cipher'); }
function crAct(c, a, v) { const k = crOf(c);
  if (a === 'cipher') { if (k.cipher >= 5) return 'Our ciphers are as strong as they can be'; if (c.pp < 40) return 'Needs 40 political power'; c.pp -= 40; k.cipher++; for (const o of alive()) if (o.crypto && o.crypto.broken[c.tag]) delete o.crypto.broken[c.tag]; return ''; }
  if (a === 'team') { if (k.team >= 5) return 'The codebreakers are as many as we can use'; const cost = 6 * Math.max(200, (c.budget && c.budget.income) || 200); if (c.pp < 50 || c.money < cost) return `Needs 50 political power and ${fmt(cost)}`; c.pp -= 50; c.money -= cost; k.team++; return ''; }
  if (a === 'target') { k.target = v || null; return ''; } if (a === 'use') { k.use = k.use === 'full' ? 'careful' : 'full'; return ''; } return ''; }
// ======================= 2. Scientists =======================
// The great scientists of the age, where they are in 1936. Each strengthens the research and the arms of the country
// where they work. Persecution drives some abroad; nations can invite them; when a country is defeated, the victors
// take its scientists home.
const SCI = [['Albert Einstein', 'phys', 'GER', 'USA', 3, 1], ['Enrico Fermi', 'phys', 'ITA', 'ITA', 3, 2], ['Niels Bohr', 'phys', 'DEN', 'DEN', 3, 1], ['Werner Heisenberg', 'phys', 'GER', 'GER', 3, 0], ['Otto Hahn', 'chem', 'GER', 'GER', 3, 0], ['Lise Meitner', 'phys', 'AUT', 'GER', 3, 1],
  ['Leo Szilard', 'phys', 'HUN', 'ENG', 2, 1], ['Edward Teller', 'phys', 'HUN', 'USA', 2, 1], ['John von Neumann', 'math', 'HUN', 'USA', 3, 1], ['Robert Oppenheimer', 'phys', 'USA', 'USA', 3, 0], ['Hans Bethe', 'phys', 'GER', 'USA', 3, 1], ['Emilio Segrè', 'phys', 'ITA', 'ITA', 2, 2], ['Max Born', 'phys', 'GER', 'ENG', 2, 1],
  ['Erwin Schrödinger', 'phys', 'AUT', 'AUT', 3, 1], ['Igor Kurchatov', 'phys', 'SOV', 'SOV', 3, 0], ['Pyotr Kapitsa', 'phys', 'SOV', 'SOV', 2, 0], ['Lev Landau', 'phys', 'SOV', 'SOV', 3, 0], ['Frédéric Joliot-Curie', 'phys', 'FRA', 'FRA', 3, 0], ['Hideki Yukawa', 'phys', 'JAP', 'JAP', 2, 0], ['Yoshio Nishina', 'phys', 'JAP', 'JAP', 2, 0],
  ['James Chadwick', 'phys', 'ENG', 'ENG', 3, 0], ['John Cockcroft', 'phys', 'ENG', 'ENG', 2, 0], ['Mark Oliphant', 'phys', 'AST', 'ENG', 2, 0], ['C. V. Raman', 'phys', 'RAJ', 'RAJ', 2, 0],
  ['Wernher von Braun', 'rocket', 'GER', 'GER', 3, 0], ['Hermann Oberth', 'rocket', 'GER', 'GER', 2, 0], ['Robert Goddard', 'rocket', 'USA', 'USA', 2, 0], ['Sergei Korolev', 'rocket', 'SOV', 'SOV', 3, 0],
  ['Frank Whittle', 'aero', 'ENG', 'ENG', 3, 0], ['Hans von Ohain', 'aero', 'GER', 'GER', 3, 0], ['Willy Messerschmitt', 'aero', 'GER', 'GER', 3, 0], ['Andrei Tupolev', 'aero', 'SOV', 'SOV', 3, 0], ['Igor Sikorsky', 'aero', 'SOV', 'USA', 2, 0], ['Kelly Johnson', 'aero', 'USA', 'USA', 2, 0], ['Jiro Horikoshi', 'aero', 'JAP', 'JAP', 2, 0],
  ['Alan Turing', 'math', 'ENG', 'ENG', 3, 0], ['Marian Rejewski', 'math', 'POL', 'POL', 3, 0], ['William Friedman', 'math', 'USA', 'USA', 3, 0], ['Konrad Zuse', 'math', 'GER', 'GER', 2, 0],
  ['Robert Watson-Watt', 'eng', 'ENG', 'ENG', 3, 0], ['Ferdinand Porsche', 'eng', 'AUT', 'GER', 3, 0], ['Mikhail Koshkin', 'eng', 'SOV', 'SOV', 3, 0], ['Vannevar Bush', 'eng', 'USA', 'USA', 2, 0], ['Louis Renault', 'eng', 'FRA', 'FRA', 2, 0],
  ['Alexander Fleming', 'med', 'ENG', 'ENG', 3, 0], ['Howard Florey', 'med', 'AST', 'ENG', 2, 0], ['Ernst Chain', 'med', 'GER', 'ENG', 2, 1], ['Gerhard Domagk', 'med', 'GER', 'GER', 2, 0]];
const SCI_FIELD = { phys: ['Physics', 'Research +1% per skill; with the bomb, faster atomic production and special projects'], chem: ['Chemistry', 'Research and output'], rocket: ['Rocketry', 'Special projects and bombing'], aero: ['Aeronautics', 'Air power +2% per skill'], math: ['Mathematics', 'Codebreaking and research'], eng: ['Engineering', 'War production and armour'], med: ['Medicine', 'Manpower and resistance to disease'] };
const scis = () => G.sci || (G.sci = SCI.map(([n, f, h, l, s, p], i) => ({ id: i, n, f, home: h, loc: l, s, p })));
const sciBonus = (c, f) => sum(scis().filter(x => x.loc === c.tag && x.f === f), x => x.s);
function sciMods(c) { const b = f => sciBonus(c, f); return { research: (b('phys') + b('chem') + b('math')) * 0.01, proj: (b('phys') + b('rocket')) * 0.03, air: b('aero') * 0.02, bombing: b('rocket') * 0.03, mil_out: b('eng') * 0.01, tank: b('eng') * 0.02, manpower: b('med') * 0.01, output: b('chem') * 0.005 }; }
function sciMonthly() { const L = scis();
  for (const s of L) { const at = C(s.loc); if (!at || !at.exists) { s.loc = ok(s.home) ? s.home : 'USA'; continue; }
    // persecution: those the regime hates flee to a democracy that will take them
    const hunted = s.p && (at.ideology === 'fas' && (s.p === 1 || (s.p === 2 && at.tag === 'ITA' && year() >= 1938)));
    if (hunted && Math.random() < 0.08) { const to = ['USA', 'ENG', 'SWE', 'SWI', 'FRA'].filter(t => ok(t) && C(t).ideology === 'dem' && (!C(t).ref || C(t).ref.pol !== 'closed') && !atWar(t, s.loc))[0]; if (to) { logMsg(`${s.n} flees ${at.name} for ${cname(to)}.`, 'world', [s.loc, to]); s.loc = to; } } }
  for (const c of alive()) { const id = 'sci_' + c.tag, has = L.some(s => s.loc === c.tag); removeSpirit(c, id); if (has) { SPIRITS[id] = ['Scientists', `${L.filter(s => s.loc === c.tag).map(s => s.n).join(', ')}.`, sciMods(c)]; addSpirit(c, id); } }
  // invitations by the AI: great powers court the stars of rival nations
  for (const c of alive()) { if (!c.ai || !c.major || c.infl < 80 || Math.random() > 0.1) continue; const t = L.filter(s => s.loc !== c.tag && C(s.loc) && C(s.loc).ideology !== c.ideology).sort((a, b) => b.s - a.s)[0]; if (t) sciInvite(c, t.id); } }
function sciChance(c, s) { const at = C(s.loc); if (s.p && c.ideology === 'fas') return 0; if (s.p && c.ideology === 'com' && Math.random() < 0.7) return 0.02; return clamp(0.15 + (at.ideology === c.ideology ? 0.15 : 0) + (s.p && at.ideology === 'fas' ? 0.4 : 0) + (isAtWar(at.tag) && capInfo(at.tag).prog > 0.3 ? 0.2 : 0) - (s.home === s.loc ? 0.2 : 0) - (atWar(c.tag, at.tag) ? 0.5 : 0), 0.02, 0.85); }
function sciInvite(c, id) { const s = scis()[id]; if (!s || s.loc === c.tag) return 'Not possible'; if (c.infl < 30) return 'Needs 30 influence'; c.infl -= 30; const ch = sciChance(c, s);
  if (Math.random() < ch) { logMsg(`${s.n} accepts an invitation from ${c.name}.`, 'world', [c.tag, s.loc]); s.loc = c.tag; return ''; } return `${s.n} declines (chance was ${Math.round(ch * 100)}%).`; }
{ const _cap = capitulate; capitulate = function (tag) { const occ = {}; for (const p of G.P) if (p.owner === tag && p.ctrl !== tag && atWar(tag, p.ctrl)) occ[p.ctrl] = (occ[p.ctrl] || 0) + p.vp; _cap(tag);
  const top = Object.keys(occ).filter(ok).sort((a, b) => occ[b] - occ[a])[0]; if (!top) return; const taken = scis().filter(s => s.loc === tag); for (const s of taken) s.loc = top; if (taken.length) logMsg(`${cname(top)} takes ${taken.map(s => s.n).join(', ')} from defeated ${cname(tag)}.`, 'world', [top, tag]); }; }
// ======================= 3. Refugees =======================
// War, occupation and persecution drive people from their homes. Each nation sets an asylum policy; refugees cost money
// and strain stability at first, then settle, adding people and soldiers; a generous policy wins friends abroad.
const rfOf = c => c.ref || (c.ref = { pool: 0, pol: c.ideology === 'dem' ? 'quota' : 'closed', inM: 0, outM: 0, total: 0 });
const RF_POL = { open: ['Open Borders', 1, 'All who flee are admitted.'], quota: ['Quotas', 0.35, 'A limited number, with papers.'], closed: ['Closed Borders', 0.04, 'Turned back at the border.'] };
function rfMonthly() { for (const c of alive()) { const r = rfOf(c); r.inM = 0; r.outM = 0; }
  for (const c of alive()) { let out = 0; const occd = G.P.filter(p => p.owner === c.tag && p.cores.includes(c.tag) && p.ctrl !== c.tag && atWar(c.tag, p.ctrl));
    for (const p of occd) { const n = p.pop * 0.003; p.pop -= n; out += n; }
    if (G.wars.some(w => w.civil && (w.att.includes(c.tag) || w.def.includes(c.tag)))) out += sum(provsOf(c.tag), p => p.pop) * 0.0004;
    if (c.ideology === 'fas' && c.laws.citizen === 'ethnic') out += sum(provsOf(c.tag), p => p.pop) * 0.00004;
    if (out < 0.5) continue; rfOf(c).outM = out;
    const nb = new Set(), far = new Set(); for (const p of provsOf(c.tag)) for (const e of NB[p.id]) { const o = P(e.to).owner; if (!e.sea && o !== c.tag && ok(o) && !atWar(o, c.tag) && !C(o).capitulated) nb.add(o); } for (const t of ['USA', 'ENG', 'ARG', 'MEX', 'SWI', 'SWE']) if (ok(t) && !nb.has(t) && t !== c.tag && !atWar(t, c.tag)) far.add(t);
    const dest = [...nb].map(t => [t, RF_POL[rfOf(C(t)).pol][1]]).concat([...far].map(t => [t, RF_POL[rfOf(C(t)).pol][1] * 0.3])), W = sum(dest, d => d[1]) || 1;
    for (const [t, w] of dest) { const k = C(t), r = rfOf(k), n = out * w / W; r.pool += n; r.inM += n; r.total += n; } }
  for (const c of alive()) { const r = rfOf(c); if (r.pool < 0.5) { removeSpirit(c, 'refugee_strain'); continue; } const settle = r.pool * 0.04; r.pool -= settle; const cap = P(c.capital); if (cap && cap.owner === c.tag) cap.pop += settle; c.manpower += settle * 0.1;
    c.money -= r.pool * 2; const share = r.pool / Math.max(1, sum(provsOf(c.tag), p => p.pop)); SPIRITS.refugee_strain[2] = { stab: -Math.min(8, Math.round(share * 400)), research: Math.min(0.03, r.total / 200000) }; removeSpirit(c, 'refugee_strain'); if (share > 0.002) addSpirit(c, 'refugee_strain');
    if (r.pol === 'open' && r.inM > 1) for (const k of alive()) if (k.ideology === 'dem' && k.tag !== c.tag) addRel(k.tag, c.tag, 0.5);
    if (c.ai) { r.pol = c.ideology === 'dem' ? (share > 0.01 ? 'quota' : 'open') : c.ideology === 'com' ? 'quota' : 'closed'; } } }
SPIRITS.refugee_strain = ['Refugee Camps', 'Camps at the border, and the cost of feeding them.', { stab: -1 }];
// ======================= 4. Operational planning =======================
// A named operation against one air zone: weeks of preparation, then six weeks in which our armies attack there much
// harder. If the enemy learns of it (their spies, our codes read, our own carelessness), their defenders are ready for it.
const OP_NAMES = ['Barbarossa', 'Overlord', 'Torch', 'Husky', 'Bagration', 'Typhoon', 'Citadel', 'Uranus', 'Crusader', 'Compass', 'Lightfoot', 'Cobra', 'Dragoon', 'Avalanche', 'Iskra', 'Kutuzov', 'Mars', 'Blau', 'Marita', 'Weserübung', 'Gelb', 'Rot', 'Felix', 'Herkules', 'Watchtower', 'Cartwheel', 'Ichi-Go', 'Battleaxe', 'Goodwood', 'Veritable', 'Plunder', 'Grenade', 'Supercharge', 'Saturn', 'Jupiter', 'Polar Star', 'Winter Storm', 'Spring Awakening', 'Market Garden', 'Shingle'];
const opsOf = c => c.ops || (c.ops = []);
function opPlan(c, provId, deceive) { const p = P(provId); if (!p || !atWar(c.tag, p.ctrl)) return 'The target must be held by an enemy'; if (opsOf(c).filter(o => o.st !== 'done').length >= 3) return 'Three operations at once is the most our staff can plan'; if (c.pp < (deceive ? 45 : 25)) return `Needs ${deceive ? 45 : 25} political power`;
  c.pp -= deceive ? 45 : 25; const used = new Set(alive().flatMap(k => (k.ops || []).map(o => o.name))), name = OP_NAMES.find(n => !used.has(n)) || 'Operation ' + (G.nid++);
  opsOf(c).push({ id: G.nid++, name, z: PZ[provId], prov: provId, vs: p.ctrl, prep: 0, st: 'plan', dec: !!deceive, det: false, start: G.day }); return ''; }
function opMonthly(c) { const O = opsOf(c); for (const o of O) {
    if (o.st === 'plan') { o.prep = Math.min(100, o.prep + 35 + (c.gens.length > 3 ? 10 : 0) + M(c, 'org') * 100); if (!o.det) { const k = C(o.vs), spot = 0.06 + (k && typeof netOf === 'function' ? netOf(k, c.tag) / 600 : 0) + (crBroken(o.vs, c.tag) ? 0.3 : 0) - (o.dec ? 0.05 : 0); if (Math.random() < spot) { o.det = true; if (o.vs === G.player) UIH.notify(`Intelligence: ${c.name} is preparing an offensive towards ${P(o.prov).name}.`, 'bad'); if (c.tag === G.player) UIH.notify(`The enemy may have learned of Operation ${o.name}.`, 'bad'); } }
      if (o.prep >= 100) { o.st = 'act'; o.until = G.day + 45; logMsg(`Operation ${o.name} begins.`, c.major ? 'world' : 'info', [c.tag, o.vs]); } }
    else if (o.st === 'act' && G.day >= o.until) o.st = 'done'; }
  c.ops = O.filter(o => o.st !== 'done' || G.day - (o.until || 0) < 120);
  if (c.ai && c.major && isAtWar(c.tag) && O.filter(o => o.st !== 'done').length < 1 && c.pp > 80 && Math.random() < 0.3) { const fr = G.P.filter(p => atWar(c.tag, p.ctrl) && NB[p.id].some(e => !e.sea && P(e.to).ctrl === c.tag)).sort((a, b) => b.vp - a.vp)[0]; if (fr) opPlan(c, fr.id, Math.random() < 0.5); } }
const opActive = (tag, z) => (C(tag) && C(tag).ops || []).some(o => o.st === 'act' && o.z === z);
const opForewarned = (tag, z, eo) => eo.some(t => (C(t) && C(t).ops || []).some(o => o.st === 'act' && o.z === z && o.det && o.vs === tag));
// ======================= 5. Industrial evacuation and scorched earth =======================
// Factories near a front can be taken apart and carried by rail to the interior: they arrive two months later, a third
// of them lost on the way. Or they can be destroyed so the enemy gains nothing from them.
const EV_TYPES = ['steel', 'tools', 'chem', 'arms', 'artyf', 'tankp', 'aircraftp', 'engines', 'autos', 'textile', 'furniture'];
const evQ = () => G.evac || (G.evac = []);
function evSafeProv(c) { const front = G.P.filter(p => atWar(c.tag, p.ctrl)); let best = null, bd = -1; for (const p of G.P) { if (p.owner !== c.tag || p.ctrl !== c.tag || !p.cores.includes(c.tag)) continue; let d = 1e9; for (const f of front) d = Math.min(d, kmBetween(p.id, f.id)); if (d > bd) { bd = d; best = p; } } return best; }
const evLevels = p => sum(EV_TYPES, t => p.b[t] || 0);
function evacuate(c, provId) { const p = P(provId); if (!p || p.owner !== c.tag || p.ctrl !== c.tag) return 'Not our province'; const lv = evLevels(p); if (!lv) return 'No factories to move'; const to = evSafeProv(c); if (!to || to.id === p.id) return 'There is nowhere safer'; const cost = 5 + lv * 2; if (c.pp < cost) return `Needs ${cost} political power`;
  c.pp -= cost; const bld = {}; for (const t of EV_TYPES) if (p.b[t]) { const n = Math.ceil(p.b[t] * 0.9); bld[t] = n; p.b[t] -= n; if (!p.b[t]) delete p.b[t]; } evQ().push({ owner: c.tag, from: p.id, to: to.id, bld, arrive: G.day + 60 });
  logMsg(`${c.name} evacuates the factories of ${p.name} to ${to.name}.`, 'info', [c.tag]); return ''; }
function scorch(c, provId) { const p = P(provId); if (!p || p.owner !== c.tag || p.ctrl !== c.tag) return 'Not our province'; if (c.pp < 10) return 'Needs 10 political power'; c.pp -= 10;
  for (const t in p.b) if (EV_TYPES.includes(t) || ['coalm', 'ironm', 'oilr', 'power', 'railway'].includes(t)) { p.b[t] = Math.floor(p.b[t] * 0.5); if (!p.b[t]) delete p.b[t]; } p.dmg = Math.max(p.dmg, 0.6); p.scorched = G.day; c.stab = Math.max(0, c.stab - 2);
  logMsg(`${c.name} burns everything of value around ${p.name} before the enemy arrives.`, 'info', [c.tag]); return ''; }
function evMonthly() { for (const e of evQ().slice()) { if (G.day < e.arrive) continue; evQ().splice(evQ().indexOf(e), 1); const to = P(e.to), c = C(e.owner); if (!c || !c.exists || to.owner !== e.owner) continue;
    for (const t in e.bld) { const n = Math.max(1, Math.round(e.bld[t] * 0.7)); to.b[t] = (to.b[t] || 0) + n; } if (e.owner === G.player) UIH.notify(`The evacuated factories are working again at ${to.name}.`, 'good'); }
  for (const c of alive()) { if (!c.ai || !isAtWar(c.tag) || c.pp < 30) continue; const keen = c.tag === 'SOV' || c.ideology === 'com' || c.major;
    for (const p of G.P) { if (p.owner !== c.tag || p.ctrl !== c.tag || evLevels(p) < 3) continue; const threat = NB[p.id].some(e => !e.sea && armiesAt(e.to).some(a => atWar(c.tag, a.owner)));
      if (threat && keen && Math.random() < 0.5) { evacuate(c, p.id); break; } } } }
// ---------- hooks ----------
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo0) { const r = _sp(armies, attacking, p, eo0); if (!armies.length || !eo0) return r; const eo = Array.from(eo0), tag = armies[0].owner, z = PZ ? PZ[p.id] : null;
  if (eo.some(t => crBroken(tag, t))) { const full = crOf(C(tag)).use === 'full'; r.atk *= full ? 1.1 : 1.06; r.tough *= full ? 1.06 : 1.04; }
  if (attacking && z !== null && opActive(tag, z)) { const o = C(tag).ops.find(x => x.st === 'act' && x.z === z); r.atk *= o && !o.det ? 1.2 : 1.12; }
  if (!attacking && z !== null && opForewarned(tag, z, eo)) r.tough *= 1.1; return r; }; }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); sciMonthly(); rfMonthly(); evMonthly(); }; }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (!c.exists || c.capitulated) return; crMonthly(c); opMonthly(c); }; }

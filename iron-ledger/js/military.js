// Armies, generals, movement, battles, supply, air and naval power.
'use strict';
const armiesOf = t => Object.values(G.armies).filter(a => a.owner === t);
const armiesAt = id => Object.values(G.armies).filter(a => a.loc === id);
const genOf = a => a.gen ? C(a.owner).gens.find(g => g.id === a.gen) : null;
const airPower = c => c.stock.aircraft * (1 + M(c, 'air'));
const navalPower = c => c.stock.ships * (1 + M(c, 'navy'));
const armyStr = a => sum(a.divs, d => (UNITS[d.t].atk + UNITS[d.t].def) * d.str);
const countryStr = t => sum(armiesOf(t), armyStr) * (1 + M(C(t), 'atk') + M(C(t), 'def'));
function maxManpower(c) { return (c.stats.corePop || 0) * M(c, 'conscr') * (1 + M(c, 'manpower')); }
function inService(c) { let n = 0; for (const a of armiesOf(c.tag)) for (const d of a.divs) n += UNITS[d.t].mp * d.str; for (const t of c.training) n += UNITS[t.t].mp; return n; }
function newArmy(c, loc) {
  const n = (c.armyN = (c.armyN || 0) + 1), ord = n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
  const a = { id: G.nid++, owner: c.tag, name: `${c.adj} ${ord} Army`, loc, divs: [], gen: null, path: [], prog: 0, auto: true, battle: 0 }; G.armies[a.id] = a; return a;
}
function spawnDivisions(c, type, n, prov, str = 1) {
  let loc = prov !== undefined && P(prov).ctrl === c.tag ? prov : P(c.capital).ctrl === c.tag ? c.capital : (heldBy(c.tag)[0] || {}).id; if (loc === undefined) return;
  for (let i = 0; i < n; i++) { let a = armiesAt(loc).find(x => x.owner === c.tag && x.divs.length < 10 && !x.battle); if (!a) a = newArmy(c, loc); a.divs.push({ t: type, str, org: 0.6, xp: 0 }); }
}
function setupArmies(c) {
  const d = COUNTRY_DEF[c.tag]; if (!d || !d.army) return; const list = []; for (const t in d.army) for (let i = 0; i < d.army[t]; i++) list.push(t);
  list.sort((a, b) => (a === 'arm' || a === 'mot' ? 0 : 1) - (b === 'arm' || b === 'mot' ? 0 : 1));
  const size = list.length > 60 ? 10 : list.length > 24 ? 8 : 6, nA = Math.ceil(list.length / size);
  const home = regionOf(c.capital, c.tag), border = home.filter(id => NB[id].some(e => !e.sea && P(e.to).owner !== c.tag)).sort((a, b) => P(b).vp - P(a).vp);
  const spots = [c.capital, ...border, ...home.sort((a, b) => P(b).vp - P(a).vp)];
  for (let i = 0; i < nA; i++) { const a = newArmy(c, spots[i % spots.length]); if (i % 5 === 0 && nA > 2) a.home = true; a.divs = list.slice(i * size, (i + 1) * size).map(t => ({ t, str: 1, org: 1, xp: 0 })); }
  const free = c.gens.slice().sort((a, b) => b.skill - a.skill); armiesOf(c.tag).sort((a, b) => b.divs.length - a.divs.length).forEach((a, i) => { if (free[i]) assignGeneral(a, free[i]); });
}
function regionOf(start, tag) { const seen = new Set([start]), st = [start]; while (st.length) { const x = st.pop(); for (const e of NB[x]) if (!e.sea && !seen.has(e.to) && P(e.to).ctrl === tag) { seen.add(e.to); st.push(e.to); } } return [...seen]; }
function borderProvs(tag) { return heldBy(tag).filter(p => NB[p.id].some(e => !e.sea && P(e.to).ctrl !== tag)).sort((a, b) => b.vp - a.vp); }
function assignGeneral(a, g) { const c = C(a.owner); for (const x of armiesOf(a.owner)) if (x.gen === g.id) x.gen = null; if (a.gen) { const o = genOf(a); if (o) o.army = null; } a.gen = g.id; g.army = a.id; }
function hireGeneral(c) { if (c.pp < 40) return null; c.pp -= 40; const g = { id: G.nid++, name: pick(['A.', 'B.', 'C.', 'E.', 'F.', 'G.', 'H.', 'J.', 'K.', 'L.', 'M.', 'N.', 'P.', 'R.', 'S.', 'T.', 'V.', 'W.']) + ' ' + pick(NAMEPOOL[c.np] || NAMEPOOL.west), skill: rint(1, 3), trait: pick(Object.keys(TRAITS)), xp: 0 }; c.gens.push(g); return g; }
function recruit(c, type, n = 1) {
  const u = UNITS[type]; if (u.tech && !c.techs[u.tech]) return 0; let k = 0;
  for (let i = 0; i < n; i++) { if (c.manpower < u.mp) break; c.manpower -= u.mp; c.training.push({ t: type, days: Math.round(u.days / (1 + M(c, 'train'))) }); k++; } return k;
}
function militaryNeeds(c) {
  const need = { arms: 0, artillery: 0, tanks: 0, autos: 0, oil: 0 }, war = isAtWar(c.tag) ? 1 : 0.35; let n = 0;
  for (const id in G.armies) { const a = G.armies[id]; if (a.owner !== c.tag) continue; for (const d of a.divs) { n++; const u = UNITS[d.t]; for (const g in u.eq) need[g] += u.eq[g] * ((1 - d.str) * 0.3 + 0.004); need.oil += (u.oil || 0) * war; } }
  for (const t of c.training) for (const g in UNITS[t.t].eq) need[g] += UNITS[t.t].eq[g] * 0.12;
  c._ndiv = n; need.oil += (c.stock.aircraft * 0.004 + c.stock.ships * 0.01) * war;
  for (const g of ['arms', 'artillery', 'tanks', 'autos']) need[g] = Math.max(0, need[g] * 1.5 - (c.stock[g] || 0) * 0.1);
  return need;
}
// ---------- movement ----------
function passable(tag, p) { const t = p.ctrl; return t === tag || friendly(tag, t) || atWar(tag, t) || hasPact('access', tag, t); }
function seaOK(tag, p) { // can `tag` cross the sea into province p?
  if (!atWar(tag, p.ctrl)) return true; let mine = 0, theirs = 0;
  for (const c of alive()) { if (c.tag === tag || (friendly(tag, c.tag) && atWar(c.tag, p.ctrl))) mine += navalPower(c); else if (c.tag === p.ctrl || (friendly(p.ctrl, c.tag) && atWar(c.tag, tag))) theirs += navalPower(c); }
  return mine >= theirs * 1.2 && mine > 0;
}
function moveDays(a, from, to, sea) {
  if (sea) return 3 + sea / 260; let spd = 99; for (const d of a.divs) spd = Math.min(spd, UNITS[d.t].spd); const p = P(to), g = genOf(a);
  const rail = Math.min(0.4, (p.b.railway || 0) * 0.08); return Math.max(2, 7 * TERRAIN[p.ter][2] * (1 - rail) / spd * (g && g.trait === 'log' ? 0.8 : 1) * (p.ctrl !== a.owner && !friendly(a.owner, p.ctrl) ? 1.4 : 1));
}
function findPath(tag, from, to, maxCost = 400) {
  if (from === to) return []; const dist = new Map([[from, 0]]), prev = new Map(), open = [[0, from]], seaC = {};
  while (open.length) { let bi = 0; for (let i = 1; i < open.length; i++) if (open[i][0] < open[bi][0]) bi = i; const [d, x] = open.splice(bi, 1)[0]; if (x === to) break; if (d > dist.get(x) || d > maxCost) continue;
    for (const e of NB[x]) { const p = P(e.to); if (!passable(tag, p)) continue; if (e.sea) { if (seaC[p.ctrl] === undefined) seaC[p.ctrl] = seaOK(tag, p); if (!seaC[p.ctrl]) continue; }
      const nd = d + (e.sea ? 3 + e.sea / 260 : 7 * TERRAIN[p.ter][2]) + (atWar(tag, p.ctrl) && e.to !== to ? 6 : 0); if (nd < (dist.get(e.to) ?? 1e9)) { dist.set(e.to, nd); prev.set(e.to, x); open.push([nd, e.to]); } } }
  if (!prev.has(to)) return null; const path = []; let x = to; while (x !== from) { path.unshift(x); x = prev.get(x); } return path;
}
function orderMove(a, to) { const path = findPath(a.owner, a.loc, to); if (!path) return false; if (a.battle) leaveBattle(a); a.path = path; a.prog = 0; return true; }
function leaveBattle(a) { const b = G.battles.find(x => x.id === a.battle); if (b) b.att = b.att.filter(i => i !== a.id); a.battle = 0; }
function occupy(p, tag) {
  const old = p.ctrl; if (old === tag) return; let to = tag;
  if (p.owner !== tag && (friendly(tag, p.owner) || p.owner === tag) && !atWar(tag, p.owner)) to = p.owner;
  p.ctrl = to; p.dmg = Math.min(0.7, p.dmg + 0.04); p.fort = Math.max(0, p.fort - 1); UIH.mapDirty();
  if (p.vp >= 10 && C(old)) logMsg(`${p.name} falls to ${cname(tag)}.`, C(old).major || p.vp >= 20 ? 'world' : 'info', [old, tag]);
  checkCapitulation(old); if (p.owner !== old) checkCapitulation(p.owner);
}
function militaryDaily() {
  for (const id in G.armies) { const a = G.armies[id]; if (!a.divs.length) { removeArmy(a); continue; }
    const c = C(a.owner);
    if (!a.battle) { const r = 0.025 * (1 + M(c, 'org')) * (a.oos ? 0.3 : 1), mx = a.oos ? 0.4 : 1; for (const d of a.divs) if (d.org < mx) d.org = Math.min(mx, d.org + r); }
    if (!a.path.length || a.battle) continue;
    const nx = a.path[0], p = P(nx), e = NB[a.loc].find(q => q.to === nx); if (!e || !passable(a.owner, p)) { a.path = []; continue; }
    const hostile = atWar(a.owner, p.ctrl);
    if (hostile) { const defs = armiesAt(nx).filter(x => atWar(a.owner, x.owner)); if (defs.length) { if (e.sea && !seaOK(a.owner, p)) { a.path = []; continue; } joinBattle(a, nx); continue; } }
    a.prog += 1; if (a.prog < moveDays(a, a.loc, nx, e.sea)) continue;
    if (hostile && e.sea && !seaOK(a.owner, p)) { a.path = []; continue; }
    a.loc = nx; a.path.shift(); a.prog = 0; a.dug = 0; if (hostile) { occupy(p, a.owner); for (const d of a.divs) d.org *= 0.7; }
  }
  for (const b of G.battles.slice()) resolveBattle(b);
  for (const id in G.armies) { const a = G.armies[id]; if (!a.path.length && !a.battle) a.dug = Math.min(10, (a.dug || 0) + 1); }
}
function removeArmy(a) { const g = genOf(a); if (g) g.army = null; if (a.battle) leaveBattle(a); delete G.armies[a.id]; }
function joinBattle(a, prov) {
  let b = G.battles.find(x => x.prov === prov && x.att.length && friendlyOrSame(G.armies[x.att[0]].owner, a.owner));
  if (!b) { b = { id: G.nid++, prov, att: [], days: 0, bal: 0.5 }; G.battles.push(b); }
  if (!b.att.includes(a.id)) b.att.push(a.id); a.battle = b.id;
}
const friendlyOrSame = (a, b) => a === b || friendly(a, b);
function sidePower(armies, attacking, p, enemyOwners) {
  let atk = 0, tough = 0, divs = []; const owners = new Set();
  for (const a of armies) { owners.add(a.owner); for (const d of a.divs) divs.push([d, a]); }
  divs.sort((x, y) => y[0].org * y[0].str - x[0].org * x[0].str); const eng = divs.slice(0, 12), ter = TERRAIN[p.ter];
  let air = 0, eair = 0; for (const o of owners) air += airPower(C(o)); for (const o of enemyOwners) eair += airPower(C(o));
  const airF = 1 + clamp((air - eair) / Math.max(50, air + eair), -1, 1) * 0.18;
  for (const [d, a] of eng) { const u = UNITS[d.t], c = C(a.owner), g = genOf(a); let fa = 1 + M(c, 'atk'), fd = 1 + M(c, 'def'); const amph = attacking && (a._amph === p.id ? a._amphV : (a._amph = p.id, a._amphV = (NB[a.loc].find(e => e.to === p.id) || {}).sea ? 0.5 : 1)); const eff = d.str * (0.3 + 0.7 * d.org) * (1 + d.xp * 0.25) * (a.oos ? 0.5 : 1) * (amph || 1);
    if (d.t === 'arm') { fa += M(c, 'tank'); if ('mjsu'.includes(p.ter)) fa -= 0.4; } if (u.oil) fa *= 0.5 + 0.5 * c.ful.oil; if (d.t === 'mtn' && 'mh'.includes(p.ter)) { fa += 0.3; fd += 0.3; }
    if (g) { fa += g.skill * 0.05; fd += g.skill * 0.05; const t = g.trait;
      if (t === 'panzer' && d.t === 'arm') fa += 0.2; if (t === 'inf' && (d.t === 'inf' || d.t === 'hvy')) fd += 0.1; if (t === 'def') fd += 0.15; if (t === 'off') fa += 0.12; if (t === 'mtn' && 'mh'.includes(p.ter)) { fa += 0.25; fd += 0.25; }
      if (t === 'winter') { fd += 0.1; fa += 0.05; } if (t === 'brilliant') { fa += 0.1; fd += 0.1; } if (t === 'old') { fa -= 0.05; fd += 0.05; } if (t === 'cav' && (d.t === 'cav' || d.t === 'mot')) fa += 0.15;
      if (t === 'jungle' && 'js'.includes(p.ter)) { fa += 0.25; fd += 0.25; } if (t === 'desert' && p.ter === 'd') { fa += 0.25; fd += 0.25; } if (t === 'urban' && p.ter === 'u') { fa += 0.25; fd += 0.25; } if (t === 'politic') fd += 0.05; if (t === 'trick' && divs.length < 6) fa += 0.1; }
    atk += u.atk * eff * fa * airF * (attacking ? 1 : 1.0);
    tough += attacking ? (u.brk + u.def * 0.45) * eff * fd : u.def * eff * fd * (1 + ter[1] + p.fort * 0.12 + Math.min(10, a.dug || 0) * 0.02 * (1 + M(c, 'entrench') * 4));
  }
  return { atk, tough, eng, divs, owners };
}
function resolveBattle(b) {
  const p = P(b.prov); const att = b.att.map(i => G.armies[i]).filter(a => a && a.divs.length && a.path[0] === b.prov);
  for (const i of b.att) { const a = G.armies[i]; if (a && !att.includes(a)) a.battle = 0; } b.att = att.map(a => a.id);
  const end = () => { for (const a of att) a.battle = 0; G.battles.splice(G.battles.indexOf(b), 1); };
  if (!att.length) return end();
  const defs = armiesAt(b.prov).filter(x => atWar(att[0].owner, x.owner));
  if (!defs.length || !atWar(att[0].owner, p.ctrl)) { for (const a of att) a.prog = 99; return end(); }
  const A = sidePower(att, true, p, new Set(defs.map(d => d.owner))), D = sidePower(defs, false, p, A.owners); b.days++;
  const dmgD = 0.02 * clamp((A.atk / Math.max(1, D.tough)) ** 0.8, 0.15, 4) * rnd(0.8, 1.2), dmgA = 0.02 * clamp((D.atk / Math.max(1, A.tough)) ** 0.8, 0.15, 4) * rnd(0.8, 1.2);
  const hit = (S, dmg) => { const n = S.eng.length || 1, k = Math.min(1.6, 12 / n); for (const [d, a] of S.eng) { d.org = Math.max(0, d.org - dmg * k); const sl = Math.min(d.str, dmg * 0.11 * k); d.str -= sl; d.xp = Math.min(1, d.xp + 0.004); const c = C(a.owner); c.casualties += sl * UNITS[d.t].mp; c.warExh = Math.min(100, c.warExh + sl * 0.5 / Math.max(1, c._ndiv || 1) * 30); } };
  hit(D, dmgD); hit(A, dmgA); b.bal = dmgD / (dmgD + dmgA);
  for (const a of att.concat(defs)) { a.divs = a.divs.filter(d => d.str > 0.05); const g = genOf(a); if (g) { g.xp += 0.02; if (g.xp > g.skill * 2 + 2 && g.skill < 5) { g.skill++; g.xp = 0; } } }
  const avg = S => { const l = S.divs; return l.length ? sum(l, x => x[0].org) / l.length : 0; };
  const aBroken = avg(A) < 0.12 || !att.some(a => a.divs.length), dBroken = avg(D) < 0.1 || !defs.some(a => a.divs.length);
  if (dBroken) { for (const a of defs) retreat(a, att[0].owner); for (const a of att) { a.prog = 99; const g = genOf(a); if (g) g.xp += 0.5; } battleNote(b, att, defs, true); return end(); }
  if (aBroken) { for (const a of att) { a.path = []; a.prog = 0; } for (const a of defs) { const g = genOf(a); if (g) g.xp += 0.5; } battleNote(b, att, defs, false); return end(); }
}
function battleNote(b, att, defs, won) {
  const tags = [...new Set(att.concat(defs).map(a => a.owner))]; if (!tags.includes(G.player)) return; const mine = att.some(a => a.owner === G.player);
  UIH.notify(`${mine === won ? 'Victory' : 'Defeat'} at ${P(b.prov).name}: ${cname(att[0].owner)} ${won ? 'breaks through' : 'is repulsed'} after ${b.days} days.`, mine === won ? 'good' : 'bad');
}
function retreat(a, enemy) {
  if (!a.divs.length) return removeArmy(a); if (a.battle) leaveBattle(a);
  const opts = NB[a.loc].filter(e => { const p = P(e.to); return (p.ctrl === a.owner || friendly(a.owner, p.ctrl)) && (!e.sea || e.sea < 600) && !armiesAt(e.to).some(x => atWar(a.owner, x.owner)); });
  if (!opts.length) { const out = NB[a.loc].filter(e => !e.sea && atWar(a.owner, P(e.to).ctrl) && !armiesAt(e.to).some(x => atWar(a.owner, x.owner))); if (out.length) { const q = P(out[0].to); a.loc = q.id; a.path = []; a.prog = 0; a.dug = 0; for (const d of a.divs) { d.org = 0.1; d.str *= 0.8; } occupy(q, a.owner); return; } }
  if (!opts.length) { const c = C(a.owner), ec = C(enemy); for (const d of a.divs) { c.casualties += UNITS[d.t].mp * d.str; for (const g in UNITS[d.t].eq) ec.stock[g] = (ec.stock[g] || 0) + UNITS[d.t].eq[g] * d.str * 0.3; }
    c.warExh = Math.min(100, c.warExh + a.divs.length * 0.6); logMsg(`${a.name} (${a.divs.length} divisions) is encircled and destroyed at ${P(a.loc).name}.`, a.divs.length >= 5 ? 'world' : 'info', [a.owner, enemy]); return removeArmy(a); }
  opts.sort((x, y) => (x.sea ? 1 : 0) - (y.sea ? 1 : 0) || P(y.to).vp - P(x.to).vp); a.loc = opts[0].to; a.path = []; a.prog = 0; a.dug = 0; for (const d of a.divs) d.org = Math.max(d.org, 0.15);
}
// ---------- weekly ----------
function militaryWeekly(c) {
  const war = isAtWar(c.tag), mine = armiesOf(c.tag);
  // training
  for (const t of c.training) t.days -= 7; const done = c.training.filter(t => t.days <= 0); c.training = c.training.filter(t => t.days > 0);
  for (const t of done) spawnDivisions(c, t.t, 1, undefined, 0.3); if (done.length && c.tag === G.player) UIH.notify(`${done.length} new division${done.length > 1 ? 's' : ''} finished training.`, 'mil');
  // supply
  if (war) { const sup = new Set(), st = []; for (const p of G.P) if ((p.ctrl === c.tag || friendly(c.tag, p.ctrl)) && (p.cores.includes(p.ctrl) || (p.coastal && !(c.blockade > 0.3)))) { sup.add(p.id); st.push(p.id); }
    while (st.length) { const x = st.pop(); for (const e of NB[x]) if (!e.sea && !sup.has(e.to)) { const q = P(e.to); if (q.ctrl === c.tag || friendly(c.tag, q.ctrl)) { sup.add(e.to); st.push(e.to); } } }
    for (const a of mine) { const was = a.oos; a.oos = !sup.has(a.loc) && !(genOf(a) && genOf(a).trait === 'log'); if (a.oos) { for (const d of a.divs) d.str = Math.max(0.05, d.str - 0.05); if (!was && c.tag === G.player) UIH.notify(`${a.name} is cut off from supply at ${P(a.loc).name}!`, 'bad'); } }
  } else for (const a of mine) a.oos = false;
  // reinforcement
  for (const a of mine) { if (a.oos) continue; const p = P(a.loc), cap = (8 + (p.b.railway || 0) * 3 + p.dev * 2 + (p.b.port ? 3 : 0)) * (1 + M(c, 'supply')); const over = armiesAt(a.loc).reduce((n, x) => n + (x.owner === c.tag ? x.divs.length : 0), 0) > cap * 1.5;
    for (const d of a.divs) { if (over) { d.str = Math.max(0.2, d.str - 0.01); continue; } if (d.str >= 1) continue; const u = UNITS[d.t]; let f = Math.min(0.12, 1 - d.str); f = Math.min(f, c.manpower / u.mp);
      const keys = Object.keys(u.eq), pr = keys[0]; f = Math.min(f, (c.stock[pr] || 0) / u.eq[pr]); if (f <= 0.001) continue; let r = 1; for (const g of keys) if (g !== pr) r = Math.min(r, (c.stock[g] || 0) / (f * u.eq[g])); f *= 0.5 + 0.5 * Math.min(1, r);
      d.str += f; c.manpower -= f * u.mp; for (const g of keys) c.stock[g] = Math.max(0, (c.stock[g] || 0) - f * u.eq[g]); } }
  for (const g of ['arms', 'artillery', 'tanks', 'autos']) c.stock[g] = Math.max(0, (c.stock[g] || 0) * 0.997);
  const mt = maxManpower(c) - inService(c); if (c.manpower < mt) c.manpower += (mt - c.manpower) * 0.04; else c.manpower = Math.max(0, mt + (c.manpower - mt) * 0.9);
  c.stock.aircraft *= 0.998; c.stock.ships *= 0.9992;
  if (!war) { c.blockade = 0; return; }
  // air and sea war
  let eAir = 0, eNav = 0, fAir = airPower(c), fNav = navalPower(c); const foes = enemiesOf(c.tag);
  for (const t of foes) { eAir += airPower(C(t)); eNav += navalPower(C(t)); }
  for (const o of alive()) if (o.tag !== c.tag && friendly(c.tag, o.tag) && foes.some(f => atWar(o.tag, f))) fNav += navalPower(o);
  const reach = foes.some(t => C(t).exists && !C(t).capitulated);
  if (reach) { c.stock.aircraft = Math.max(0, c.stock.aircraft - Math.min(c.stock.aircraft * 0.03, eAir * 0.01)); c.stock.ships = Math.max(0, c.stock.ships - Math.min(c.stock.ships * 0.015, eNav * 0.006)); }
  c.blockade = eNav > fNav * 1.5 && eNav > 20 ? 0.35 : 0;
  if (c.techs.m_air2 && fAir > 100) { const tg = foes.map(C).filter(e => !e.capitulated && airPower(e) * 1.2 < fAir); if (tg.length) { const e = pick(tg), ps = heldBy(e.tag).filter(p => p.dev >= 1 && p.dmg < 0.5);
      if (ps.length) { const p = pick(ps); p.dmg = Math.min(0.6, p.dmg + 0.035 * (1 + M(c, 'bombing')) * (1 - M(e, 'civdef'))); e.warExh = Math.min(100, e.warExh + 0.15); } } }
}
function disbandArmy(a) { const c = C(a.owner); for (const d of a.divs) { c.manpower += UNITS[d.t].mp * d.str * 0.8; for (const g in UNITS[d.t].eq) c.stock[g] = (c.stock[g] || 0) + UNITS[d.t].eq[g] * d.str * 0.8; } removeArmy(a); }
function mergeArmies(a, b) { if (a.owner !== b.owner || a.loc !== b.loc || a === b) return false; a.divs.push(...b.divs); b.divs = []; if (!a.gen && b.gen) { a.gen = b.gen; genOf(a).army = a.id; b.gen = null; } removeArmy(b); return true; }
function splitArmy(a) { if (a.divs.length < 2) return null; const c = C(a.owner), n = newArmy(c, a.loc), h = Math.floor(a.divs.length / 2); n.divs = a.divs.splice(h); n.auto = a.auto; return n; }

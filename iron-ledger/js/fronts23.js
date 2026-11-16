// 2.3 The army remade: provinces are taken a piece at a time, and armies fight on fronts with battle plans.
'use strict';
// ======================= provinces taken a piece at a time =======================
// p.cq = { t: the side pushing in, v: the share already taken (0..1), from: the province the push comes from }.
// A march into undefended ground takes the province gradually. In a battle the line moves with the fighting: a clear
// edge carries it through, a narrow one wins part of the province, and the defenders of a half-taken province have lost
// half their ground. What is taken is kept while our troops stand next to it, and drains away when they leave.
const cqSide = (p, o) => !!(p.cq && o && (p.cq.t === o || (friendly(p.cq.t, o) && !atWar(p.cq.t, o))));
const cqShare = p => (p.cq && p.cq.v > 0 ? p.cq.v : 0);
const cqFor = (p, o) => (cqSide(p, o) ? p.cq.v : 0);
function cqSet(p, t, v, from) { if (!p.cq || !cqSide(p, t)) p.cq = { t, v: 0, from }; p.cq.t = t; p.cq.v = clamp(v, 0, 0.99); if (from !== undefined) p.cq.from = from; p.cq.d = G.day; }
// big provinces take longer to cross and to fight through, small ones fall in a rush
let CQ_AREA = null;
function cqScale(id) { if (!CQ_AREA) { CQ_AREA = MAP.P.map(q => { let s = 0; for (const r of q.poly) for (let k = 0; k < r.length; k += 2) { const j = (k + 2) % r.length; s += r[k] * r[j + 1] - r[j] * r[k + 1]; } return Math.abs(s / 2); }); }
  return clamp(Math.pow(2300 / Math.max(50, CQ_AREA[id]), 0.35), 0.45, 1.6) / Math.sqrt(TERRAIN[P(id).ter][2]); }
const CQ_PUSH = 0.055;
{ const _mh = militaryHourly; militaryHourly = function () { _mh();
  for (const id in G.armies) { const a = G.armies[id]; if (!a.path.length || a.battle || !a.divs.length) continue; const nx = a.path[0], p = P(nx); if (!atWar(a.owner, p.ctrl)) continue;
    const e = NB[a.loc].find(q => q.to === nx); if (!e || e.sea || armiesAt(nx).some(x => atWar(a.owner, x.owner))) continue; const md = moveDays(a, a.loc, nx, e.sea), had = cqFor(p, a.owner);
    if (had > 0 && a.prog < md * had) a.prog = md * had; // the ground already taken need not be taken again
    cqSet(p, a.owner, Math.max(had, a.prog / md), a.loc); } }; }
{ const _rb = resolveBattle; resolveBattle = function (b) { const p = P(b.prov), a0 = G.armies[b.att[0]];
  if (b.push === undefined) b.push = a0 ? cqFor(p, a0.owner) : 0;
  _rb(b); if (!G.battles.includes(b)) return;
  const att = b.att.map(i => G.armies[i]).filter(a => a && a.divs.length); if (!att.length) return; const o = att[0].owner;
  // the attackers chose the time and the place: in an even fight they still gain a little ground
  b.push = clamp(b.push + CQ_PUSH * cqScale(p.id) * (b.bal - 0.45) * 2, 0, 1); cqSet(p, o, b.push, att[0].loc);
  if (b.push >= 1) { const defs = armiesAt(b.prov).filter(x => atWar(o, x.owner)); for (const d of defs) retreat(d, o); for (const a of att) { a.prog = 99; a.battle = 0; const g = genOf(a); if (g) g.xp += 0.3; } battleNote(b, att, defs, true); G.battles.splice(G.battles.indexOf(b), 1); } }; }
// a narrow win at the end of an assault takes part of the province (called from the three-week rule in v17.js)
function cqPartial(b, att, defs) { const p = P(b.prov), o = att[0].owner, v = Math.max(cqFor(p, o), b.push || 0); cqSet(p, o, v, att[0].loc);
  for (const a of att) { a.path = []; a.prog = 0; for (const d of a.divs) d.org = Math.min(d.org, 0.45); } for (const a of defs) for (const d of a.divs) d.org = Math.min(d.org, 0.6);
  const tags = [...new Set(att.concat(defs).map(a => a.owner))]; if (tags.includes(G.player)) { const mine = att.some(a => a.owner === G.player); UIH.notify(`${P(b.prov).name}: ${cname(o)} ${mine ? 'takes' : 'has taken'} ${Math.round(v * 100)}% of the province after ${Math.max(1, Math.round(b.days))} days of fighting, but the defenders hold the rest.`, mine ? 'good' : 'bad'); } }
{ const _oc = occupy; occupy = function (p, tag) { _oc(p, tag); delete p.cq; frSectorGrow(p, tag); }; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (attacking || !armies.length || !p || !p.cq || !eo) return r;
  const v = cqShare(p); if (v > 0 && [...eo].some(t => cqSide(p, t))) r.tough *= 1 - 0.32 * v; return r; }; }
function cqDaily() { for (const p of G.P) { const q = p.cq; if (!q) continue;
    if (!ok(q.t) || !atWar(q.t, p.ctrl) || cqSide(p, p.ctrl)) { delete p.cq; continue; }
    if (G.battles.some(b => b.prov === p.id)) continue;
    const near = NB[p.id].some(e => !e.sea && armiesAt(e.to).some(a => cqSide(p, a.owner) && a.divs.length)) || Object.values(G.armies).some(a => a.path[0] === p.id && cqSide(p, a.owner));
    const held = armiesAt(p.id).some(a => atWar(q.t, a.owner));
    q.v -= near ? (held ? 0.01 : 0) : 0.06; if (q.v <= 0.01) delete p.cq; } }

// ======================= fronts and battle plans =======================
// A front is a stretch of border with one enemy, held by the armies assigned to it. Its order is to hold, to attack
// (along the whole front, or towards the objectives of the battle plan), or to fall back to a line the player draws.
// While a front prepares, its staff plans: up to +25% attack when the offensive starts, spent as it goes on.
const FR_STANCE = { careful: ['Careful', 1.6, 0.75, 'Attack only with a clear superiority of strength and rested troops.'], balanced: ['Balanced', 1.15, 0.55, 'Attack where we are stronger.'], bold: ['All-out', 0.8, 0.35, 'Attack everywhere, whatever the odds, with tired troops too. Fast and costly.'] };
const FR_ORDER = { hold: ['Hold', 'Spread along the front by threat and dig in. Planning goes on.'], attack: ['Attack', 'Execute the battle plan: advance against the enemy, towards the objectives if there are any.'], fallback: ['Fall back', 'Withdraw to the fallback line and hold it.'] };
const FR_COLORS = ['#f0c040', '#5fd0ff', '#ff7ae0', '#9cff6a', '#ffa04a', '#c8a0ff', '#6affd2', '#ff6a6a'];
const fronts = () => G.fronts || (G.fronts = {});
const frontsOf = t => Object.values(fronts()).filter(f => f.owner === t);
const frontOf = a => { if (!a || a.front === undefined || a.front === null || typeof a.front === 'object' || !G.fronts) return null; const f = G.fronts[a.front]; return f && f.owner === a.owner ? f : null; };
const frOurs = (o, p) => p.ctrl === o || (friendly(o, p.ctrl) && !atWar(o, p.ctrl));
// a front faces one nation: its own land and troops, its subjects, and its land held by its allies
// (2.5: a front that was drawn on the map may face several nations at once: f.faces)
const frTheirs = (f, q) => { if (!q.ctrl || frOurs(f.owner, q)) return false; const E = f.faces && f.faces.length ? f.faces : [f.enemy]; if (E.includes(q.ctrl)) return true; const k = C(q.ctrl); return !!k && (E.includes(k.overlord) || (E.includes(q.owner) && atWar(f.owner, q.ctrl))); };
function frontNew(owner, enemy) { const id = G.nid++, n = frontsOf(owner).filter(f => f.enemy === enemy).length, used = new Set(frontsOf(owner).map(f => f.col));
  let col = 0; while (used.has(col) && col < FR_COLORS.length - 1) col++;
  return (fronts()[id] = { id, owner, enemy, name: `${C(enemy).adj || cname(enemy)} Front${n ? ' ' + 'ABCDEFGH'[Math.min(7, n)] : ''}`, armies: [], order: 'hold', stance: 'balanced', targets: [], fallback: [], only: [], plan: 0, col, made: G.day }); }
// the facing pairs of provinces (ours, theirs) along the front, limited to the drawn sector if there is one
function frSector(f) { if (!f.only || !f.only.length) return null; const s = new Set(f.only);
  // a sector province the enemy has taken still belongs to the sector: the line runs behind it now
  for (const id of f.only) { const p = P(id); if (!frOurs(f.owner, p)) for (const e of NB[id]) if (!e.sea && frOurs(f.owner, P(e.to))) s.add(e.to); } return s; }
function frontPairs(f) { const out = [], only = frSector(f);
  for (const p of G.P) { if (!frOurs(f.owner, p) || (only && !only.has(p.id))) continue; for (const e of NB[p.id]) { if (e.sea) continue; const q = P(e.to); if (frTheirs(f, q)) out.push([p.id, q.id]); } } return out; }
// when a sector advances, the ground it takes joins it
function frSectorGrow(p, tag) { if (!G.fronts) return; for (const f of Object.values(G.fronts)) { if (!f.only || !f.only.length || !frOurs(f.owner, p) || f.only.includes(p.id)) continue; if (f.owner !== tag && !friendly(f.owner, tag)) continue; if (NB[p.id].some(e => !e.sea && f.only.includes(e.to))) f.only.push(p.id); } }
const frArmies = f => (f.armies = f.armies.filter(i => G.armies[i] && G.armies[i].owner === f.owner && G.armies[i].divs.length && G.armies[i].front === f.id)).map(i => G.armies[i]);
function frontAssign(f, list) { for (const a of list) { if (a.owner !== f.owner) continue; const old = frontOf(a); if (old && old !== f) old.armies = old.armies.filter(i => i !== a.id); if (!f.armies.includes(a.id)) f.armies.push(a.id); a.front = f.id; a.auto = false; delete a.order; delete a.inv; delete a.fpost; } }
function frontRelease(a) { const f = frontOf(a); if (f) f.armies = f.armies.filter(i => i !== a.id); delete a.front; delete a.fpost; }
function frontDelete(f) { for (const a of frArmies(f)) { delete a.front; delete a.fpost; } delete fronts()[f.id]; }
const frDist = (a, b) => { const p = MAP.P[a], q = MAP.P[b]; let dx = Math.abs(p.x - q.x); if (dx > MAP.W / 2) dx = MAP.W - dx; return Math.hypot(dx, p.y - q.y); };
const frThreat = (o, id) => sum(NB[id].filter(e => !e.sea), e => sum(armiesAt(e.to).filter(x => atWar(o, x.owner)), armyStr));
const frOrg = a => (a.divs.length ? sum(a.divs, d => d.org) / a.divs.length : 0);
const frEnemyStr = (o, id) => sum(armiesAt(id).filter(x => atWar(o, x.owner)), x => armyStr(x) * (0.4 + 0.6 * frOrg(x)));
const frTargetOf = (f, id) => { let best = null, bd = 1e9; for (const t of f.targets || []) { const d = frDist(id, t); if (d < bd) { bd = d; best = t; } } return best; };
function frontDaily(f) { const c = C(f.owner); if (!c || !c.exists || c.capitulated) return; const A = frArmies(f);
  if (typeof frFacesGrow === 'function') frFacesGrow(f);
  const war = typeof frWar === 'function' ? frWar(f) : ok(f.enemy) && atWar(f.owner, f.enemy), attacking = f.order === 'attack' && war;
  // objectives reached
  if (f.targets && f.targets.length) { const left = f.targets.filter(id => !frOurs(f.owner, P(id)));
    if (left.length < f.targets.length && f.owner === G.player && !f.tAuto) for (const id of f.targets) if (!left.includes(id)) UIH.notify(`${f.name}: the battle plan's objective ${P(id).name} is taken.`, 'good');
    f.targets = left; if (!left.length && f.order === 'attack' && f._hadT && !f.tAuto) { f.order = 'hold'; if (f.owner === G.player) UIH.notify(`${f.name}: every objective of the battle plan is taken. The front holds and plans again.`, 'good'); } f._hadT = left.length > 0; }
  if (!f.targets.length) f.tAuto = false; if (f.tAuto && !attacking) { f.targets = []; f.tAuto = false; }
  // planning: preparation while the front holds, spent while it attacks (2.5: slower, and quieter, in radio silence)
  const fighting = A.some(a => a.battle);
  if (!attacking) f.plan = Math.min(1, (f.plan || 0) + 0.02 * (1 + M(c, 'org')) * (A.length ? 1 : 0.3) * (f.silent ? 0.7 : 1)); else if (fighting) f.plan = Math.max(0, (f.plan || 0) - 0.03);
  if (!A.length) return;
  // where the armies should stand
  const pairs = frontPairs(f); let line = [...new Set(pairs.map(x => x[0]))];
  if (f.order === 'fallback') { const fb = f.fallback.filter(id => frOurs(f.owner, P(id))); if (fb.length) line = fb; }
  if (!line.length && f.only && f.only.length) line = f.only.filter(id => frOurs(f.owner, P(id))); // 2.5: a line drawn behind the border is held as it is
  if (!line.length) { if (f.owner === G.player && f._noLine !== G.day - 1 && !f._toldNo) { f._toldNo = 1; UIH.notify(`${f.name}: there is no land border with ${cname(f.enemy)} in this sector. The armies wait where they are.`, 'bad'); } f._noLine = G.day; return; } f._toldNo = 0;
  // 2.5: an offensive drives along an axis. With no objectives drawn, the staff picks the nearest capitals and cities.
  if (attacking && !f.targets.length && typeof frAutoTargets === 'function') { f.targets = frAutoTargets(f, line); f.tAuto = f.targets.length > 0; f._hadT = f.tAuto; }
  const hasT = attacking && f.targets.length > 0, field = hasT && typeof hopField === 'function' ? hopField(f.targets, 40, p => frOurs(f.owner, p) || atWar(f.owner, p.ctrl)) : null;
  const fd = id => { const v = field ? field.get(id) : undefined; return v === undefined ? 99 : v; }; let minF = 99; if (field) for (const id of line) minF = Math.min(minF, fd(id));
  const w = {}; let mt = 1; for (const id of line) { const t = frThreat(f.owner, id); w[id] = t; mt = Math.max(mt, t); }
  for (const id of line) { const k = fd(id) - minF; w[id] = 1 + 2.2 * w[id] / mt + P(id).vp / 10 + (id === c.capital ? 2 : 0) + (field ? (k <= 0 ? 5 : k === 1 ? 2.5 : k === 2 ? 1 : 0) : 0); }
  const R = A.filter(a => a.role === 'reserve'), L = A.filter(a => a.role !== 'reserve');
  const tw = sum(line, id => w[id]), want = {}; for (const id of line) want[id] = L.length * w[id] / tw;
  const onLine = new Set(line), have = {};
  for (const a of L) { if (a.fpost !== undefined && !onLine.has(a.fpost)) delete a.fpost; if (a.fpost !== undefined) have[a.fpost] = (have[a.fpost] || 0) + 1; }
  // battle plan: armies at their posts strike down the axis, and widen the breach on its shoulders; nothing else moves
  const busy = new Set(), ourN = id => NB[id].filter(e => !e.sea && frOurs(f.owner, P(e.to))).length;
  if (attacking) { const st = FR_STANCE[f.stance] || FR_STANCE.balanced, cand = new Map();
    for (const a of A) { if (a.battle || a.path.length || a.oos || frOrg(a) < st[2] || !onLine.has(a.loc)) continue;
      for (const e of NB[a.loc]) { if (e.sea) continue; const q = P(e.to); if (!frTheirs(f, q) || !atWar(f.owner, q.ctrl)) continue; (cand.get(q.id) || cand.set(q.id, []).get(q.id)).push(a); } }
    const scored = [...cand.entries()].map(([id, list]) => { const q = P(id), mine = sum(list, a => armyStr(a) * (0.4 + 0.6 * frOrg(a))) * (1 + 0.25 * (f.plan || 0)), def = frEnemyStr(f.owner, id) * (1 + TERRAIN[q.ter][1] + q.fort * 0.12) * (1 - 0.32 * cqFor(q, f.owner)), r = def > 0 ? mine / def : 9;
      let axis, spear = false;
      if (field) { const from = Math.min(...list.map(a => fd(a.loc))), g = from - fd(id), n = ourN(id);
        if (g > 0) { spear = true; axis = 4 + (f.targets.includes(id) ? 3 : 0) + (from <= minF ? 1.5 : 0); } else if (g === 0 && fd(id) <= minF + 1 && n >= 2) axis = 0.4; else if (def === 0 && n >= 3) axis = 0.2; else axis = -9; }
      else axis = q.vp / 5 + (q.cores.includes(f.owner) || q.claims.includes(f.owner) ? 1 : 0);
      return { id, list, r, spear, s: Math.min(4, r) + axis + cqFor(q, f.owner) * 2 }; }).sort((x, y) => y.s - x.s);
    for (const x of scored) { if (x.r < st[1] * (x.spear ? 0.9 : 1) || (field && x.s < 0.5)) continue; const go = x.list.filter(a => !busy.has(a.id)); if (!go.length) continue;
      // keep a part of the line manned: never strip a post facing a strong enemy bare
      for (const a of go) { const lone = armiesAt(a.loc).filter(y => y.owner === f.owner && !busy.has(y.id) && y !== a).length === 0, threat = frThreat(f.owner, a.loc) - frEnemyStr(f.owner, x.id);
        if (lone && threat > armyStr(a) * 1.5 && go.length > 1) continue; if (orderMove(a, x.id)) { busy.add(a.id); a.fpost = x.id; } } } }
  // 2.5: reserves stand behind the point of main effort in the attack, and go where the line is hardest pressed in defence
  if (R.length) { let post = null, bs = -1e9; for (const id of line) { const hot = G.battles.some(b => b.prov === id) ? 3 : 0, s = attacking && field ? -fd(id) * 3 + w[id] : w[id] + hot; if (s > bs) { bs = s; post = id; } }
    for (const a of R) { if (busy.has(a.id) || a.battle) continue; a.fpost = post; if (post !== null && a.loc !== post && (!a.path.length || a.path[a.path.length - 1] !== post)) { if (!orderMove(a, post)) delete a.fpost; } } }
  // everyone else takes up a post on the line, staying put while the post is still needed
  for (const a of L.slice().sort((x, y) => armyStr(y) - armyStr(x))) { if (busy.has(a.id) || a.battle) continue;
    const cur = a.fpost !== undefined ? a.fpost : (onLine.has(a.loc) ? a.loc : undefined);
    if (cur !== undefined && onLine.has(cur) && (have[cur] || 0) <= Math.ceil(want[cur]) + (a.fpost === undefined ? 0 : 0.5)) { if (a.fpost === undefined) { a.fpost = cur; have[cur] = (have[cur] || 0) + 1; } }
    else { let best = null, bs = -1e9; for (const id of line) { const gap = want[id] - (have[id] || 0) - (id === cur ? -1 : 0); const s = gap * 4 - frDist(a.loc, id) / 250; if (s > bs) { bs = s; best = id; } }
      if (best !== null && best !== cur) { if (cur !== undefined && a.fpost === cur) have[cur]--; a.fpost = best; have[best] = (have[best] || 0) + 1; } }
    if (a.fpost === undefined) continue;
    if (a.loc !== a.fpost && (!a.path.length || a.path[a.path.length - 1] !== a.fpost)) { if (!orderMove(a, a.fpost)) { delete a.fpost; } else if (typeof railTry === 'function') railTry(a); } } }
// planned battles: the front's preparation is spent in its attacks; a planned defence holds a little better
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (!armies.length || !G.fronts) return r; let n = 0, b = 0;
  for (const a of armies) { const f = frontOf(a); n += a.divs.length; if (!f) continue; if (attacking && f.order === 'attack') b += 0.25 * (f.plan || 0) * a.divs.length; else if (!attacking && f.order !== 'attack') b += 0.1 * (f.plan || 0) * a.divs.length; }
  if (n && b) { if (attacking) r.atk *= 1 + b / n; else r.tough *= 1 + b / n; } return r; }; }
// the old fronts of 1.7 (a.front = { vs, mode, st }) become real fronts
function frMigrate() { for (const id in G.armies) { const a = G.armies[id]; if (!a.front || typeof a.front !== 'object') continue; const o = a.front;
    if (!ok(o.vs)) { delete a.front; continue; } let f = frontsOf(a.owner).find(x => x.enemy === o.vs && x._v17); if (!f) { f = frontNew(a.owner, o.vs); f._v17 = 1; f.order = o.mode === 'push' ? 'attack' : 'hold'; f.stance = { agg: 'bold', care: 'careful' }[o.st] || 'balanced'; }
    delete a.front; frontAssign(f, [a]); } }
// the daily hook: v17's frontTick is called every day by the war layer; it now runs the new fronts
frontTick = function () { frMigrate(); cqDaily(); for (const f of Object.values(fronts())) { if (!ok(f.owner)) { frontDelete(f); continue; } try { frontDaily(f); } catch (e) { if (typeof console !== 'undefined') console.warn('front', f.name, e); } } };
{ const _ra = removeArmy; removeArmy = function (a) { if (frontOf(a)) frontRelease(a); return _ra(a); }; }
// an army given another order by the player leaves its front
{ const _so = setOrder; setOrder = function (a, ...r) { if (frontOf(a)) frontRelease(a); return _so(a, ...r); }; }

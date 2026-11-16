// 2.5 The art of war. Pockets and encirclement; offensives that drive along an axis, for the player's fronts and for
// the AI; fronts drawn first, facing several enemies, bound to an army group, spread out or concentrated; and five
// mechanics: railway redeployment, airborne landings, battle honours, operational surprise and deception, and reserves.
'use strict';
// ======================= pockets =======================
// Every nation at war is checked each day. Land we or our friends hold is one supplied body while it contains a capital,
// a coast that is not blockaded, a depot, or at least five provinces. Armies in a smaller body are in a pocket: they
// are not reinforced; after three days on what they carry they weaken a little more every day, and in the end they lay
// down their arms, unless they break out, are relieved, or are kept alive by an air bridge.
const ENC_SIZE = 5, ENC_GRACE = 3;
let ENC = { day: -1, list: [] };
const encFriendly = (tag, p) => p.ctrl === tag || (friendly(tag, p.ctrl) && !atWar(tag, p.ctrl));
function encSource(c, p) { const k = C(p.ctrl); return p.id === c.capital || (!!k && k.capital === p.id && !k.capitulated) || (p.coastal && !((c.blockade || 0) > 0.3)) || (c.depots || []).includes(p.id); }
function encCompute() { const list = [], tags = new Set(); for (const id in G.armies) { const a = G.armies[id]; if (a.divs.length) tags.add(a.owner); }
  for (const tag of tags) { const c = C(tag); if (!c || !c.exists) continue; const mine = armiesOf(tag);
    if (!isAtWar(tag)) { for (const a of mine) if (a.enc) { a.enc = 0; a.airsup = false; } continue; } const lab = new Map();
    for (const a of mine) { if (!a.divs.length) continue; const s = a.loc; let k = lab.get(s);
      if (k === undefined) { if (!encFriendly(tag, P(s))) { k = { ok: true, provs: [] }; lab.set(s, k); }
        else { k = { ok: false, provs: [s], owner: tag, armies: [] }; lab.set(s, k); const st = [s];
          while (st.length && !k.ok) { const x = st.pop(); if (encSource(c, P(x))) { k.ok = true; break; }
            for (const e of NB[x]) { if (e.sea) continue; const o = lab.get(e.to); if (o) { if (o !== k && o.ok) k.ok = true; continue; } const q = P(e.to); if (!encFriendly(tag, q)) continue; lab.set(e.to, k); k.provs.push(e.to); st.push(e.to); }
            if (k.provs.length >= ENC_SIZE) k.ok = true; }
          if (!k.ok) list.push(k); } }
      const was = a.enc || 0;
      if (!k.ok) { a.enc = was + 1; k.armies.push(a.id); if (!was) encNote(a, true); } else if (was) { a.enc = 0; a.airsup = false; encNote(a, false); } } }
  for (const k of list) { const set = new Set(k.provs), foes = {}; k.press = false;
    for (const id of k.provs) for (const e of NB[id]) { if (e.sea || set.has(e.to)) continue; const q = P(e.to); if (!atWar(k.owner, q.ctrl)) continue; let s = 1; for (const x of armiesAt(e.to)) if (atWar(k.owner, x.owner)) { s += armyStr(x); k.press = true; } foes[q.ctrl] = (foes[q.ctrl] || 0) + s; }
    k.foe = Object.keys(foes).sort((a, b) => foes[b] - foes[a])[0] || null; k.days = Math.max(0, ...k.armies.map(i => G.armies[i].enc || 0)); }
  // the corks: enemy provinces that touch a pocket and, if possible, the supplied land of the pocket's nation as well
  const cork = new Map(); for (const k of list) { const set = new Set(k.provs), ring = new Set(); for (const id of k.provs) for (const e of NB[id]) if (!e.sea && !set.has(e.to) && atWar(k.owner, P(e.to).ctrl)) ring.add(e.to);
    const thin = [...ring].filter(id => NB[id].some(e => !e.sea && !set.has(e.to) && encFriendly(k.owner, P(e.to)))); for (const id of (thin.length ? thin : [...ring])) (cork.get(id) || cork.set(id, new Set()).get(id)).add(k.owner); }
  ENC = { day: G.day, list, cork }; return list; }
const pockets = () => ENC.list;
function encNote(a, on) { const pl = G.player, n = a.divs.length, at = P(a.loc).name;
  if (a.owner === pl) UIH.notify(on ? `${a.name} is encircled at ${at}! Cut off, it weakens every day: break out, relieve it, or supply it by air.` : `${a.name} is relieved: the road to ${at} is open again.`, on ? 'bad' : 'good');
  else if (on && pl && atWar(pl, a.owner) && n >= 3 && NB[a.loc].some(e => !e.sea && encFriendly(pl, P(e.to)))) UIH.notify(`${n} ${C(a.owner).adj} divisions are encircled at ${at}.`, 'good'); }
// the fighting value of an army that is cut off: it falls by the day, and men who must break out fight harder
function encF(a, attacking) { const n = a.enc || 0; if (!n) return a.oos ? 0.5 : 1; if (n <= ENC_GRACE) return 1; return clamp(0.9 - (n - ENC_GRACE) * 0.02, 0.4, 0.9) * (attacking ? 1.1 : 1); }
function encSuffer(c, a, k) { if ((a.paraUntil || 0) > G.day || a.enc <= ENC_GRACE) return; const n = a.enc - ENC_GRACE, g = genOf(a), slow = g && g.trait === 'log' ? 0.6 : 1; let air = 1, lift = 0;
  if (a.airsup) { const need = a.divs.length * 0.4, foe = k.foe && C(k.foe), contested = !!foe && airPower(foe) > airPower(c) * 1.5;
    if ((c.stock.aircraft || 0) < need * 4) { a.airsup = false; if (c.tag === G.player) UIH.notify(`The air bridge to ${a.name} is given up: no aircraft are left to fly it.`, 'bad'); }
    else { c.stock.aircraft -= need * (contested ? 0.5 : 0.22); air = contested ? 0.7 : 0.45; lift = contested ? 0.1 : 0.2; } }
  const floor = k.press ? 0.05 : 0.35, loss = Math.min(0.012, 0.003 + 0.0004 * n) * slow * air, cap = clamp(0.8 - n * 0.02 + lift, 0.25, 0.9);
  for (const d of a.divs) { if (d.str > floor) { const l = Math.min(loss, d.str - floor); d.str -= l; c.casualties += l * UNITS[d.t].mp; } if (d.org > cap) d.org = cap; }
  if (!k.press) return; const N = a.divs.length || 1, org = sum(a.divs, d => d.org) / N, str = sum(a.divs, d => d.str) / N;
  if ((n >= 18 && org < 0.3 && str < 0.45) || n >= (a.airsup ? 120 : 60) || str < 0.12) encSurrender(c, a, k); }
function encSurrender(c, a, k) { const foe = k.foe && C(k.foe), n = a.divs.length, at = P(a.loc).name;
  if (foe && foe.exists) { for (const d of a.divs) for (const g in UNITS[d.t].eq) foe.stock[g] = (foe.stock[g] || 0) + UNITS[d.t].eq[g] * d.str * 0.3; if (typeof prestigeAdd === 'function') prestigeAdd(foe.tag, n * 0.4); }
  c.warExh = Math.min(100, c.warExh + n * 0.8); if (typeof prestigeAdd === 'function') prestigeAdd(c.tag, -n * 0.4);
  logMsg(`${a.name} (${n} division${n > 1 ? 's' : ''}) lays down its arms in the ${at} pocket after ${a.enc} days cut off.`, n >= 5 ? 'world' : 'info', foe ? [c.tag, foe.tag] : [c.tag]);
  if (c.tag === G.player) UIH.notify(`${a.name} has surrendered at ${at}.`, 'bad'); removeArmy(a); }
function encDaily() { for (const k of encCompute()) { const c = C(k.owner); for (const id of k.armies.slice()) { const a = G.armies[id]; if (a && a.divs.length) encSuffer(c, a, k); } } }
// an AI army in a pocket attacks the weakest part of the ring on the side of home
function encBreakout(a) { const c = C(a.owner); let best = null, bs = 1e9; for (const e of NB[a.loc]) { if (e.sea) continue; const q = P(e.to); if (!atWar(a.owner, q.ctrl)) continue;
    const en = sum(armiesAt(q.id).filter(x => atWar(a.owner, x.owner)), armyStr), s = en * 3 + frDist(q.id, c.capital) / 100; if (s < bs) { bs = s; best = q.id; } }
  return best !== null && orderMove(a, best); }
function airBridge(a, on) { const c = C(a.owner); if (!a.enc) return 'Only an army that is cut off needs an air bridge'; if (on && (c.stock.aircraft || 0) < a.divs.length * 4) return 'We have too few aircraft to supply it'; a.airsup = !!on; return ''; }
// attacks from several sides; defenders with nowhere to go
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (!armies.length) return r;
  if (attacking) { const dirs = new Set(armies.map(a => a.loc)).size; r.dirs = dirs; if (dirs > 1) r.atk *= 1 + 0.07 * Math.min(3, dirs - 1);
    let n = 0, b = 0; for (const a of armies) { const f = frontOf(a); n += a.divs.length; if (f && f.sur && f.sur >= G.day) b += (f.surV || 0) * a.divs.length; } if (n && b) r.atk *= 1 + b / n; }
  else if (!NB[p.id].some(e => !e.sea && encFriendly(armies[0].owner, P(e.to)))) r.tough *= 0.9;
  return r; }; }

// ======================= the axis of an offensive =======================
// hops over land from a set of provinces, through the provinces `pass` allows
function hopField(src, depth, pass) { const d = new Map(); let cur = []; for (const s of src) if (!d.has(s)) { d.set(s, 0); cur.push(s); } let k = 0;
  while (cur.length && k < depth) { k++; const nx = []; for (const x of cur) for (const e of NB[x]) { if (e.sea || d.has(e.to)) continue; if (pass && !pass(P(e.to))) continue; d.set(e.to, k); nx.push(e.to); } cur = nx; } return d; }
// the objectives of an offensive: capitals and cities near the line, one for every nine provinces of front or so
function opPick(line, hostile, pass, own, kMax, minVp) { const d = hopField(line, 14, pass), cand = [];
  for (const [id, h] of d) { if (!h) continue; const q = P(id); if (!hostile(q)) continue; const k = C(q.ctrl), o = C(q.owner), cap = (!!k && k.capital === id) || (!!o && o.capital === id && o.exists && atWar(own, q.owner)); if (q.vp < minVp && !cap) continue;
    cand.push({ id, v: (q.vp + (cap ? 25 : 0) + (q.cores.includes(own) ? 6 : 0)) / (h + 2) }); }
  if (!cand.length) { let best = null; for (const [id, h] of d) { if (!h || !hostile(P(id))) continue; const v = (P(id).vp + 1) / (h + 2); if (!best || v > best.v) best = { id, v }; } if (best) cand.push(best); }
  cand.sort((a, b) => b.v - a.v); const K = clamp(Math.round(line.length / 9), 1, kMax), objs = [];
  for (const x of cand) { if (objs.length >= K) break; if (objs.some(o => frDist(o, x.id) < 420)) continue; objs.push(x.id); } return objs; }
// --- the AI's general staff: objectives for every nation at war, kept for twelve days or until they fall
const OPF = new Map();
function opObjectives(tag) { const S = G.ops || (G.ops = {}), cur = S[tag], hostile = p => atWar(tag, p.ctrl);
  if (cur && G.day - cur.day < 12 && cur.objs.length && cur.objs.every(id => hostile(P(id)))) return cur.objs;
  const F = []; for (const p of G.P) { if (!encFriendly(tag, p)) continue; if (NB[p.id].some(e => !e.sea && hostile(P(e.to)))) F.push(p.id); }
  if (!F.length) { delete S[tag]; return []; }
  const objs = opPick(F, hostile, p => encFriendly(tag, p) || hostile(p), tag, 4, 8); S[tag] = { objs, day: G.day }; return objs; }
function opField(tag) { const o = OPF.get(tag); if (o && o.day === G.day) return o.f; const objs = opObjectives(tag), f = objs.length ? hopField(objs, 40, p => encFriendly(tag, p) || atWar(tag, p.ctrl)) : null; OPF.set(tag, { day: G.day, f }); return f; }
function opGain(tag, from, to) { const f = opField(tag); if (!f) return 0; const a = f.get(from), b = f.get(to); return a === undefined || b === undefined ? 0 : a - b; }
const opThr = (tag, from, to) => { if (reliefScore(tag, to)) return 0.75; const g = opGain(tag, from, to); return g > 0 ? 0.9 : g === 0 ? 1.08 : 1.3; };
const opScore = (tag, from, to) => { const g = opGain(tag, from, to); return g > 0 ? 5 : g === 0 ? 0 : -3; };
// the staff sends more to the stretch of front nearest the objective, but never piles a province higher than it can use
let DIVAT = { day: -1, m: new Map() };
function divAt(id, tag) { if (DIVAT.day !== G.day) { const m = new Map(); for (const i in G.armies) { const a = G.armies[i], k = a.loc + '|' + a.owner; m.set(k, (m.get(k) || 0) + a.divs.length); } DIVAT = { day: G.day, m }; } return DIVAT.m.get(id + '|' + tag) || 0; }
const opNeed = (tag, id) => { const f = opField(tag), v = f ? f.get(id) : undefined, over = divAt(id, tag) - 24; return (v === undefined ? 0 : Math.max(0, 4 - v * 0.7)) - (over > 0 ? over * 3 : 0); };
// the ring around a pocket of ours or of a friend: breaking it comes before everything else
function reliefScore(tag, id) { const s = ENC.cork && ENC.cork.get(id); if (!s) return 0; for (const o of s) if (o === tag || friendly(tag, o)) return 8; return 0; }
// too many divisions in one province are no use: the surplus moves to the neighbouring stretch of front
function aiUnstack(tag) { const by = {}; for (const a of armiesOf(tag)) if (a.divs.length) (by[a.loc] = by[a.loc] || []).push(a);
  for (const loc in by) { const l = by[loc]; let n = sum(l, a => a.divs.length); if (n <= 28) continue; const nb = NB[loc].filter(e => !e.sea && P(e.to).ctrl === tag).map(e => ({ id: e.to, n: divAt(e.to, tag), fr: NB[e.to].some(x => !x.sea && atWar(tag, P(x.to).ctrl)) })).sort((x, y) => (y.fr - x.fr) || (x.n - y.n)); if (!nb.length) continue;
    for (const a of l.filter(x => x.auto && !x.battle && !x.path.length).sort((x, y) => x.divs.length - y.divs.length)) { if (n <= 24) break; const to = nb.find(x => x.n + a.divs.length <= 24); if (!to) break; if (orderMove(a, to.id)) { a._t = G.day; n -= a.divs.length; to.n += a.divs.length; } } } }
// --- the player's fronts: objectives chosen by the staff when none are drawn
function frAutoTargets(f, line) { return opPick(line, q => frTheirs(f, q) && atWar(f.owner, q.ctrl), p => frOurs(f.owner, p) || atWar(f.owner, p.ctrl), f.owner, 3, 6); }
// deception: the AI's staff counts armies that are not there
function decoyStr(tag, strAt) { if (!G.fronts) return; for (const f of Object.values(G.fronts)) { if (!f.decoy || f.decoy < G.day || !atWar(tag, f.owner)) continue; const A = frArmies(f), line = [...new Set(frontPairs(f).map(x => x[0]))]; if (!line.length || !A.length) continue; const add = sum(A, armyStr) * 0.8 / line.length; for (const id of line) strAt[id] = (strAt[id] || 0) + add; } }

// ======================= fronts: drawn first, several enemies, army groups, reserves =======================
const frFaces = f => (f.faces && f.faces.length ? f.faces : [f.enemy]);
const frWar = f => frFaces(f).some(t => ok(t) && atWar(f.owner, t));
// who stands across the line from these provinces of ours
function frFacing(owner, ids) { const n = {}; for (const id of ids) for (const e of NB[id]) { if (e.sea) continue; const q = P(e.to); if (!q.ctrl || frOurs(owner, q) || !ok(q.ctrl)) continue; n[q.ctrl] = (n[q.ctrl] || 0) + (atWar(owner, q.ctrl) ? 10 : 1); }
  const all = Object.keys(n).sort((a, b) => n[b] - n[a]), war = all.filter(t => atWar(owner, t)); return war.length ? war : all; }
function frFacesGrow(f) { if (!f.drawn) return; const ids = f.only && f.only.length ? [...frSector(f)] : null; if (!ids) return; const t = frFacing(f.owner, ids); if (!t.length) return;
  const war = t.filter(x => atWar(f.owner, x)), cur = (f.faces || []).filter(ok); f.faces = war.length ? [...new Set(cur.filter(x => atWar(f.owner, x)).concat(war))] : [...new Set(cur.concat(t))];
  if (f.faces.length && !f.faces.includes(f.enemy)) { f.enemy = f.faces[0]; if (f.autoName) f.name = frAutoName(f); } }
function frAutoName(f) { const g = f.group && (C(f.owner).agroups || []).find(x => x.id === f.group); if (g) return g.name; const adj = C(f.enemy) ? C(f.enemy).adj || cname(f.enemy) : 'Home'; const n = frontsOf(f.owner).filter(x => x !== f && x.enemy === f.enemy).length; return `${adj} Front${n ? ' ' + 'ABCDEFGH'[Math.min(7, n)] : ''}`; }
// the likeliest enemy of a group of armies: the nation at war with us that is nearest to them, or else a neighbour
function frGuessEnemy(owner, list) { const at = list.length ? list[0].loc : C(owner).capital; let best = null, bd = 1e9;
  for (const p of G.P) { if (!p.ctrl || p.ctrl === owner || frOurs(owner, p) || !ok(p.ctrl)) continue; const w = atWar(owner, p.ctrl); if (!w && isAtWar(owner) && enemiesOf(owner).some(ok)) continue; const d = frDist(at, p.id) * (w ? 1 : 3); if (d < bd) { bd = d; best = p.ctrl; } } return best; }
function frontDrawn(owner, list, gid) { const enemy = frGuessEnemy(owner, list); if (!enemy) return null; const f = frontNew(owner, enemy); f.drawn = true; f.autoName = true; f.faces = [enemy]; if (gid) f.group = gid; f.name = frAutoName(f); frontAssign(f, list); return f; }
// a front bound to an army group follows its roll: armies that join the group join the front
function frGroupSync() { if (!G.fronts) return; for (const f of Object.values(G.fronts)) { if (!f.group) continue; const c = C(f.owner), g = c && (c.agroups || []).find(x => x.id === f.group); if (!g) { f.group = null; continue; }
    const ids = new Set(g.armies); for (const i of g.armies) { const a = G.armies[i]; if (a && a.owner === f.owner && a.divs.length && frontOf(a) !== f && !a.battle) frontAssign(f, [a]); } for (const a of frArmies(f)) if (!ids.has(a.id)) frontRelease(a); } }
const frLine = f => { let l = [...new Set(frontPairs(f).map(x => x[0]))]; if (!l.length && f.only && f.only.length) l = f.only.filter(id => frOurs(f.owner, P(id))); return l; };
// spread: split the stacks until every province of the line can have one (two divisions at least in each)
function frSpread(f) { const line = frLine(f); let A = frArmies(f).filter(a => a.role !== 'reserve'); if (!line.length || !A.length) return 0; const divs = sum(A, a => a.divs.length), want = Math.min(line.length, Math.floor(divs / 2)); let made = 0, guard = 0;
  while (A.length < want && guard++ < 60) { const big = A.filter(a => !a.battle && a.divs.length >= 4).sort((x, y) => y.divs.length - x.divs.length)[0]; if (!big) break; const n = splitArmy(big); if (!n) break; n.auto = false; frontAssign(f, [n]); const g = agOf(big); if (g) g.armies.push(n.id); A.push(n); made++; }
  if (made) frontDaily(f); return made; }
// concentrate: stacks of the front that stand together become one again
function frConcentrate(f) { const by = {}; let n = 0; for (const a of frArmies(f)) if (!a.battle) (by[a.loc] = by[a.loc] || []).push(a);
  for (const k in by) { const l = by[k].sort((x, y) => y.divs.length - x.divs.length); for (let i = 1; i < l.length; i++) if (mergeArmies(l[0], l[i])) n++; } return n; }
// generals for the armies that have none: the best free men to the largest armies
function autoGenerals(c) { const marshals = new Set((c.agroups || []).map(g => g.marshal).filter(Boolean)), free = c.gens.filter(g => (!g.army || !G.armies[g.army] || G.armies[g.army].gen !== g.id) && !marshals.has(g.id)).sort((a, b) => b.skill - a.skill);
  const need = armiesOf(c.tag).filter(a => !genOf(a) && a.divs.length).sort((a, b) => b.divs.length - a.divs.length); let n = 0; for (const a of need) { const g = free.shift(); if (!g) break; assignGeneral(a, g); n++; } return n; }
// executing a plan: surprise for the first days, the more the longer the staff has planned, and more in radio silence
function frExecute(f) { f.order = 'attack'; if (!frWar(f)) return 0; const c = C(f.owner), foe = C(f.enemy), seen = foe && airPower(foe) > airPower(c) * 1.2 ? 0.6 : 1;
  f.surV = Math.round(0.12 * (f.plan || 0) * (f.silent ? 1.6 : 1) * seen * 100) / 100; f.sur = f.surV > 0.01 ? G.day + 5 : 0; return f.surV; }
function frDecoy(f) { const c = C(f.owner); if (f.decoy && f.decoy >= G.day) return 'The deception is already running'; if (c.pp < 30) return 'Needs 30 political power'; c.pp -= 30; f.decoy = G.day + 25; return ''; }

// ======================= railways: strategic redeployment =======================
// Behind the front an army moves by train: three times as fast along our own railways, as long as no enemy stands next
// to the line. It arrives tired. The railways carry only so many divisions at a time.
function railOK(tag, p) { return (p.b.railway || 0) > 0 && encFriendly(tag, p) && (typeof railFor !== 'function' || railFor(p, tag)) && !NB[p.id].some(e => !e.sea && atWar(tag, P(e.to).ctrl)); }
function railCap(c) { let n = 0; for (const p of G.P) if (p.ctrl === c.tag) n += p.b.railway || 0; return 8 + Math.floor(n / 3); }
const railUse = c => sum(armiesOf(c.tag).filter(a => a.rail), a => a.divs.length);
function railTry(a) { const c = C(a.owner); if (a.rail || a.battle || a.path.length < 3 || c.noRail) return false; if (!railOK(a.owner, P(a.loc)) || !a.path.every(id => railOK(a.owner, P(id)))) return false;
  if (railUse(c) + a.divs.length > railCap(c)) return false; a.rail = true; return true; }
{ const _md = moveDays; moveDays = function (a, from, to, sea) { const d = _md(a, from, to, sea); return !sea && a.rail && railOK(a.owner, P(from)) && railOK(a.owner, P(to)) ? d * 0.33 : d; }; }
function railDaily() { for (const id in G.armies) { const a = G.armies[id]; if (!a.rail) continue; if (!a.path.length || a.battle) { a.rail = false; for (const d of a.divs) d.org *= 0.75; continue; } if (!railOK(a.owner, P(a.path[0]))) a.rail = false; } }

// ======================= airborne landings =======================
// An airborne division is raised for men, transport aircraft and political power. It can be dropped on an undefended
// enemy province within reach of our ground, if we are not outmatched in the air; it carries supplies for ten days.
const PARA_RANGE = 700;
const paraMax = c => 1 + (c.major ? 2 : 0);
function paraRaise(c) { if ((c.para || 0) >= paraMax(c)) return `At most ${paraMax(c)} airborne divisions`; if ((c.stock.aircraft || 0) < 100) return 'Needs an air force of 100 aircraft'; if (c.manpower < 12) return 'Needs 12,000 men'; if (c.pp < 25) return 'Needs 25 political power';
  c.pp -= 25; c.manpower -= 12; c.stock.aircraft -= 30; c.para = (c.para || 0) + 1; return ''; }
function paraCan(c, p) { if (!(c.para > 0)) return 'No airborne division is ready'; if ((c.paraCd || 0) > G.day) return `The transports are refitting until ${dateStr(c.paraCd)}`; if (!atWar(c.tag, p.ctrl)) return 'Not held by an enemy';
  if (armiesAt(p.id).some(a => atWar(c.tag, a.owner))) return 'The province is defended: paratroops land only where no enemy army stands'; const k = C(p.ctrl); if (k && airPower(k) > airPower(c) * 1.25) return 'The enemy rules the air over it';
  if (!G.P.some(q => q.ctrl === c.tag && frDist(q.id, p.id) <= PARA_RANGE)) return 'Out of range of our airfields'; return ''; }
function paraDrop(c, pid) { const p = P(pid), why = paraCan(c, p); if (why) return why; c.para--; c.paraCd = G.day + 20; const from = p.ctrl; occupy(p, c.tag); const a = newArmy(c, p.id); a.name = `${c.adj} Airborne`; a.auto = false; a.paraUntil = G.day + 10;
  a.divs.push({ t: 'inf', str: 0.75, org: 0.8, xp: 0.6, para: 1 }); logMsg(`${c.adj} paratroops drop on ${p.name}.`, 'world', [c.tag, from]); UIH.mapDirty(); return ''; }
function paraAI(c) { if (!c.major || !isAtWar(c.tag)) return; if (!(c.para > 0)) { if ((c.stock.aircraft || 0) > 400 && c.pp > 80 && c.manpower > 60 && (c.paraT || 0) < G.day) { c.paraT = G.day + 180; paraRaise(c); } return; }
  if ((c.paraCd || 0) > G.day || Math.random() > 0.06) return; const f = opField(c.tag); if (!f) return; let best = null, bs = 0;
  for (const p of G.P) { if (!atWar(c.tag, p.ctrl) || p.vp < 3) continue; const h = f.get(p.id); if (h === undefined || h > 6) continue; if (!NB[p.id].some(e => !e.sea && (encFriendly(c.tag, P(e.to)) || NB[e.to].some(e2 => !e2.sea && encFriendly(c.tag, P(e2.to)))))) continue; /* within two steps of our lines */
    if (paraCan(c, p)) continue; const s = p.vp + (p.coastal ? 3 : 0) - h; if (s > bs) { bs = s; best = p.id; } }
  if (best !== null) paraDrop(c, best); }

// ======================= battle honours =======================
// Divisions that win earn honours (three at most), each worth 3% in battle; a seasoned division with two becomes a Guards
// division, worth 8% more. Generals count their victories and are decorated at five, fifteen and thirty.
const GUARD_NAME = { SOV: 'Guards', ENG: 'Guards', GER: 'Grenadier', JAP: 'Imperial Guard', ITA: 'Granatieri', FRA: 'Chasseurs', USA: 'Ranger', CHI: 'Teaching Corps', POL: 'Legions', FIN: 'Jäger' };
const guardName = t => GUARD_NAME[t.slice(0, 3)] || 'Guards';
const MEDALS = [[5, 'is decorated for five victories'], [15, 'receives the nation\'s highest order after fifteen victories'], [30, 'is a living legend: thirty victories']];
function honours(b, att, defs, won) { const win = won ? att : defs, size = sum(att, a => a.divs.length) + sum(defs, a => a.divs.length);
  for (const a of win) { if (!a || !a.divs.length || !G.armies[a.id]) continue; const c = C(a.owner), g = genOf(a);
    if (g) { g.wins = (g.wins || 0) + 1; const m = MEDALS[g.medal || 0]; if (m && g.wins >= m[0]) { g.medal = (g.medal || 0) + 1; if (c.tag === G.player) UIH.notify(`General ${g.name} ${m[1]}.`, 'good'); c.ws = Math.min(100, c.ws + 0.5); } }
    if (size < 6 || Math.random() > 0.3) continue; const d = a.divs.filter(x => (x.hon || 0) < 3).sort((x, y) => y.org * y.str - x.org * x.str)[0]; if (!d) continue; d.hon = (d.hon || 0) + 1;
    if (d.hon >= 2 && d.xp >= 0.45 && !d.g) { d.g = 1; if (c.tag === G.player) UIH.notify(`A division of ${a.name} earns the title of ${guardName(c.tag)} at ${P(b.prov).name}.`, 'good'); } } }
{ const _bn = battleNote; battleNote = function (b, att, defs, won) { _bn(b, att, defs, won); try { honours(b, att, defs, won); } catch (e) { /* never block a battle */ } }; }

// ======================= hooks =======================
{ const _pd = playDaily; playDaily = function () { _pd(); encDaily(); railDaily(); frGroupSync();
  // a nation is weighed for capitulation every third day, not only on the day a province changes hands
  if (G.day % 3 === 1) for (const c of alive()) if (!c.capitulated && isAtWar(c.tag)) checkCapitulation(c.tag); if (G.day % 3 === 0) for (const c of alive()) if (c.ai && !c.capitulated) paraAI(c); }; }
{ const _aa = aiArmies; aiArmies = function (tag) { _aa(tag); const k = C(tag); if (!k || !k.ai) return;
  for (const a of armiesOf(tag)) { if (!a.auto || !a.divs.length) continue; if (a.enc >= 2 && !a.battle && !a.path.length) { encBreakout(a); continue; } if (!a.rail && a.path.length >= 4) railTry(a); if (a.enc >= 3 && !a.airsup && a.divs.length >= 4 && (k.stock.aircraft || 0) > 300) a.airsup = true; }
  }; }

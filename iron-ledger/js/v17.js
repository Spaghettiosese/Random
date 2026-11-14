// 1.7 "Iron and Fire": the war layer.
//  - The Air War: the world is divided into air regions. Air forces are sent to regions with a mission, fight for
//    superiority there, and only help battles, harass armies or bomb factories in the regions they are sent to.
//  - Fronts: armies can be given a front against a nation. They spread themselves along it, dig in, and on the
//    order to advance attack wherever the odds suit their stance. Works before a war, to deploy on a border.
'use strict';

// ---------- air regions: k-means over province centres, fixed at load ----------
const AIRZ = (() => { // split the provinces by count along the longer axis until each group is small, then let k-means round them off
  const pts = MAP.P.map(m => [m.x, m.y]), n = pts.length, d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2, groups = [];
  const split = ids => { if (ids.length <= 9) { groups.push(ids); return; } let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const i of ids) { x0 = Math.min(x0, pts[i][0]); x1 = Math.max(x1, pts[i][0]); y0 = Math.min(y0, pts[i][1]); y1 = Math.max(y1, pts[i][1]); }
    const ax = x1 - x0 >= y1 - y0 ? 0 : 1, s = ids.slice().sort((a, b) => pts[a][ax] - pts[b][ax] || a - b), h = s.length >> 1; split(s.slice(0, h)); split(s.slice(h)); };
  split([...Array(n).keys()]); let cent = groups.map(g => [sum(g, i => pts[i][0]) / g.length, sum(g, i => pts[i][1]) / g.length]); const K = cent.length, asg = new Array(n).fill(0);
  for (let it = 0; it < 5; it++) { for (let i = 0; i < n; i++) { let bi = 0, bd = Infinity; for (let k = 0; k < K; k++) { const v = d2(pts[i], cent[k]); if (v < bd) { bd = v; bi = k; } } asg[i] = bi; }
    cent = cent.map((c, k) => { let sx = 0, sy = 0, m = 0; for (let i = 0; i < n; i++) if (asg[i] === k) { sx += pts[i][0]; sy += pts[i][1]; m++; } return m ? [sx / m, sy / m] : c; }); }
  const zones = cent.map((c, k) => ({ id: k, provs: [], x: c[0], y: c[1] })); asg.forEach((k, i) => zones[k].provs.push(i));
  const live = zones.filter(z => z.provs.length); live.forEach((z, i) => { z.id = i; for (const p of z.provs) asg[p] = i; });
  return { zones: live, of: asg };
})();
const PZ = AIRZ.of, ZONES = AIRZ.zones;
const zoneName = z => { const ps = ZONES[z].provs.map(i => PROV_RAW_NAMES[i]); return ps.sort((a, b) => b[1] - a[1])[0][0]; };
const PROV_RAW_NAMES = PROV_RAW.trim().split('\n').map(l => { const f = l.split('|'); return [f[0], +f[9] || 0]; });

// ---------- missions ----------
const AIR_MISSION = { sup: ['Air superiority', '✈️', 1.0, 'Fighters sweep the region. Counts fully towards superiority.'], cas: ['Ground support', '💥', 0.6, 'Dive and light bombers join every battle in the region: up to +22% to our side.'],
  int: ['Interdiction', '🚂', 0.6, 'Attacks on roads and railways: enemy armies in the region lose organisation every day and march slower.'], bomb: ['Strategic bombing', '🏭', 0.4, 'Bombers hit the factories of enemy provinces in the region. Needs Heavy Bombers (m_air2).'] };
const airSlots = c => clamp(1 + Math.floor(airPower(c) / 350), 1, 6);
function airPlanOf(c) { const pl = (c.airPlan || []).filter(x => ZONES[x.z] && AIR_MISSION[x.m]).slice(0, airSlots(c)); return pl.length ? pl : [{ z: PZ[c.capital], m: 'sup' }]; }
// per day: who flies where, and with what
function airDaily() {
  const az = G._az = {}; for (const c of alive()) { const ap = airPower(c); if (ap < 5 || c.capitulated) continue; const pl = airPlanOf(c), each = ap / pl.length;
    for (const x of pl) (az[x.z] = az[x.z] || []).push({ t: c.tag, s: each, m: x.m }); }
  // interdiction: hostile armies in the region lose organisation
  for (const z in az) { const ints = az[z].filter(e => e.m === 'int'); if (!ints.length) continue; for (const id in G.armies) { const a = G.armies[id]; if (PZ[a.loc] !== +z) continue; const f = airIntensity(a.owner, +z, 'int', true); if (f > 0.05) for (const d of a.divs) d.org = Math.max(0, d.org - 0.014 * f); } }
}
// friendly and hostile air in a region, from the point of view of `tag`; superiority weights each mission
function zoneAir(tag, z) { const L = (G._az || {})[z] || []; let f = 0, h = 0; for (const e of L) { const w = e.s * AIR_MISSION[e.m][2]; if (e.t === tag || friendly(tag, e.t)) f += w; else if (atWar(tag, e.t)) h += w; } return [f, h]; }
const zoneSup = (tag, z) => { const [f, h] = zoneAir(tag, z); return f + h < 1 ? 0.5 : f / (f + h); };
// how hard a mission bites in a region: own mission strength against hostile fighters; `against` = hostile missions aimed at `tag`
function airIntensity(tag, z, m, against) {
  const L = (G._az || {})[z] || []; let s = 0, own = 0, foe = 0; for (const e of L) { const mine = e.t === tag || friendly(tag, e.t), war = atWar(tag, e.t); if (e.m === m && (against ? war : mine)) s += e.s; const w = e.s * AIR_MISSION[e.m][2]; if (mine) own += w; else if (war) foe += w; }
  if (s <= 0) return 0; const block = against ? own : foe; return s / (s + block * 1.5 + 150);
}
function airCombat(tag, pid) { const z = PZ[pid], sup = zoneSup(tag, z), cas = airIntensity(tag, z, 'cas') * (1 + Math.max(0, M(C(tag), 'cas'))); return { z, sup, supF: 1 + (sup - 0.5) * 0.3, casF: 0.22 * Math.min(1.3, cas) }; }
// combat: the old nation-wide air factor is replaced by the region's
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) {
  const r = _sp(armies, attacking, p, eo); if (!armies.length) return r; const owners = new Set(armies.map(a => a.owner)); let air = 0, eair = 0; for (const o of owners) air += airPower(C(o)); for (const o of eo || []) eair += airPower(C(o));
  const oldF = 1 + clamp((air - eair) / Math.max(50, air + eair), -1, 1) * 0.18, ac = airCombat(armies[0].owner, p.id); r.atk *= ac.supF * (1 + ac.casF) / oldF; return r; }; }
{ const _md = moveDays; moveDays = function (a, from, to, sea) { const d = _md(a, from, to, sea); if (sea) return d; const f = airIntensity(a.owner, PZ[to], 'int', true); return f > 0.05 ? d * (1 + 0.45 * f) : d; }; }
// weekly: losses in contested regions, and the bombing of industry
function airWeekly() {
  const az = G._az || {}; G.airLog = G.airLog || {};
  for (const c of alive()) { const ap = airPower(c); if (ap < 5) continue; const pl = airPlanOf(c); let lost = 0;
    for (const x of pl) { const [f, h] = zoneAir(c.tag, x.z); if (h < 1) continue; const frac = 0.03 * (h / (f + h)) * (x.m === 'sup' ? 0.75 : 1.25); const l = c.stock.aircraft / pl.length * frac; c.stock.aircraft = Math.max(0, c.stock.aircraft - l); lost += l; }
    for (const x of pl) { if (x.m !== 'bomb' || !c.techs.m_air2) continue; const f = airIntensity(c.tag, x.z, 'bomb') * (1 + Math.max(0, M(c, 'bombing')));
      const tg = ZONES[x.z].provs.map(P).filter(p => atWar(c.tag, p.ctrl) && p.ctrl === p.owner && p.dmg < 0.4).sort((a, b) => provLevels(b) - provLevels(a))[0]; if (!tg || f < 0.05) continue; const e = C(tg.owner);
      tg.dmg = Math.min(0.4, tg.dmg + 0.05 * f * (1 - Math.max(0, M(e, 'civdef')))); if (typeof civDeath === 'function') civDeath(tg, tg.pop * 0.0008 * f * (1 - Math.max(0, M(e, 'civdef'))) * (tg.ter === 'u' ? 1.6 : 1), warOf(c.tag, e.tag), 'bombing'); e.warExh = Math.min(100, e.warExh + 0.25 * f); if (c.tag === G.player || e.tag === G.player) (G.airLog[x.z] = G.airLog[x.z] || []).push([G.day, c.tag, tg.id]); }
    c._airLost = (c._airLost || 0) * 0.5 + lost; }
}
// the AI, and the player's air staff when set to automatic
function autoAirPlan(c) {
  const slots = airSlots(c), cap = { z: PZ[c.capital], m: 'sup' }; if (!isAtWar(c.tag)) return [cap];
  const score = {}; const add = (z, v) => { score[z] = (score[z] || 0) + v; };
  for (const b of G.battles) { const att = b.att.map(i => G.armies[i]).filter(Boolean); if (!att.length) continue; const mine = att.some(a => a.owner === c.tag) || armiesAt(b.prov).some(a => a.owner === c.tag); if (mine) add(PZ[b.prov], 6 + sum(att, a => a.divs.length) * 0.2); }
  for (const p of G.P) if (p.ctrl === c.tag && NB[p.id].some(e => !e.sea && atWar(c.tag, P(e.to).ctrl))) add(PZ[p.id], 1 + p.vp * 0.1);
  for (const p of G.P) if (p.owner === c.tag && p.ctrl !== c.tag) add(PZ[p.id], 2 + p.vp * 0.2);
  const zs = Object.keys(score).map(Number).sort((a, b) => score[b] - score[a]); const plan = [];
  for (const z of zs.slice(0, Math.max(1, slots - (c.techs.m_air2 && slots >= 3 ? 1 : 0)))) { const [f, h] = zoneAir(c.tag, z); plan.push({ z, m: h > f * 0.8 ? 'sup' : (c._ndiv || 0) > 20 && Math.random() < 0.25 ? 'int' : 'cas' }); }
  if (c.techs.m_air2 && plan.length < slots) { const tg = G.P.filter(p => atWar(c.tag, p.ctrl) && p.ctrl === p.owner && provLevels(p) > 20 && kmBetween(c.capital, p.id) < 1800).sort((a, b) => provLevels(b) - provLevels(a))[0]; if (tg) plan.push({ z: PZ[tg.id], m: 'bomb' }); }
  if (P(c.capital).ctrl === c.tag && NB[c.capital].some(e => atWar(c.tag, P(e.to).ctrl)) && !plan.some(x => x.z === cap.z)) { if (plan.length < slots) plan.push(cap); else plan[slots - 1] = cap; }
  return plan.length ? plan.slice(0, slots) : [cap];
}
aiAir = function (c) { c.airPlan = autoAirPlan(c); };
airApply = function (c) { for (const m in AIRM) removeSpirit(c, 'airm_' + m); };
setAirMission = function () { return false; };
function airPlanSet(c, z, m) { c.airAuto = false; let pl = (c.airPlan || []).slice(); const i = pl.findIndex(x => x.z === z); if (!m) { if (i >= 0) pl.splice(i, 1); } else if (i >= 0) pl[i] = { z, m }; else { if (pl.length >= airSlots(c)) return 'All air wings are already assigned. Withdraw one first.'; pl.push({ z, m }); } c.airPlan = pl; G._az = null; airDaily(); return ''; }

// ---------- fronts ----------
const frontEnemy = (owner, vs, q) => q.ctrl === vs || (atWar(owner, vs) && atWar(owner, q.ctrl) && (friendly(vs, q.ctrl) || C(q.ctrl).overlord === vs));
function frontProvs(owner, vs) { const out = []; for (const p of G.P) { if (!(p.ctrl === owner || (friendly(owner, p.ctrl) && !atWar(owner, p.ctrl)))) continue; if (NB[p.id].some(e => !e.sea && frontEnemy(owner, vs, P(e.to)))) out.push(p); } return out; }
function frontCandidates(owner) { const s = new Set(enemiesOf(owner)); for (const p of G.P) if (p.ctrl === owner) for (const e of NB[p.id]) if (!e.sea) { const t = P(e.to).ctrl; if (t !== owner && !friendly(owner, t)) s.add(t); } return [...s].filter(t => ok(t)); }
function setFront(a, vs, mode, st) { a.front = { vs, mode, st: st || 'bal' }; a.auto = false; delete a.order; delete a.inv; }
function frontTick() {
  const groups = {}; for (const id in G.armies) { const a = G.armies[id]; if (!a.front || !a.divs.length) continue; if (!ok(a.front.vs)) { delete a.front; continue; } (groups[a.owner + '|' + a.front.vs] = groups[a.owner + '|' + a.front.vs] || []).push(a); }
  for (const k in groups) { const list = groups[k], owner = list[0].owner, vs = list[0].front.vs, war = atWar(owner, vs), fp = frontProvs(owner, vs);
    if (!fp.length) { if (owner === G.player && !G['_nofront' + vs]) { G['_nofront' + vs] = 1; UIH.notify(`There is no land front with ${cname(vs)}. The armies hold where they are.`, 'bad'); } continue; } G['_nofront' + vs] = 0;
    const strAt = {}; for (const id in G.armies) { const x = G.armies[id]; if (atWar(owner, x.owner) || x.owner === vs) strAt[x.loc] = (strAt[x.loc] || 0) + armyStr(x); }
    const need = {}; for (const p of fp) { let n = p.vp * 2 + (p.id === C(owner).capital ? 30 : 0); for (const e of NB[p.id]) if (!e.sea && frontEnemy(owner, vs, P(e.to))) n += 8 + (strAt[e.to] || 0) * 0.6 + P(e.to).vp; need[p.id] = n; }
    // spread out: each army takes the post where the remaining need is greatest, staying put if its post is still needed
    const have = {}, tot = sum(list, armyStr), totNeed = sum(fp, p => need[p.id]) || 1;
    for (const a of list.slice().sort((x, y) => armyStr(y) - armyStr(x))) { const s = armyStr(a); let best = null, bv = -Infinity;
      for (const p of fp) { const share = tot * need[p.id] / totNeed, v = share - (have[p.id] || 0) - (p.id === a.loc || p.id === a.front.post ? -s * 0.3 : 0) - Math.sqrt((MAP.P[p.id].x - MAP.P[a.loc].x) ** 2 + (MAP.P[p.id].y - MAP.P[a.loc].y) ** 2) * 0.01; if (v > bv) { bv = v; best = p.id; } }
      have[best] = (have[best] || 0) + s; if (a.front.post !== best && (G.day - (a.front.t || -99) >= 6 || !fp.some(p => p.id === a.front.post))) { a.front.post = best; a.front.t = G.day; } }
    for (const a of list) { if (a.battle) continue; const post = a.front.post;
      if (a.loc !== post) { if (!a.path.length || a.path[a.path.length - 1] !== post) { if (!orderMove(a, post)) a.front.post = a.loc; } continue; }
      if (!war || a.front.mode !== 'push' || a.path.length || a.oos) continue; const st = STANCE[a.front.st] || STANCE.bal; if (sum(a.divs, d => d.org) / a.divs.length < st[2]) continue;
      let best = null, bs = -1; for (const e of NB[a.loc]) { if (e.sea) continue; const q = P(e.to); if (!frontEnemy(owner, vs, q)) continue; const def = (strAt[q.id] || 0) * (1 + TERRAIN[q.ter][1] + q.fort * 0.12);
        let att = armyStr(a); for (const x of armiesAt(a.loc)) if (x !== a && x.owner === owner && x.front && x.front.vs === vs && !x.battle) att += armyStr(x) * 0.7; for (const b of G.battles) if (b.prov === q.id) att += sum(b.att, i => G.armies[i] && G.armies[i].owner === owner && G.armies[i] !== a ? armyStr(G.armies[i]) : 0);
        const ratio = def > 0 ? att / def : 9; if (ratio < st[1]) continue; const s = q.vp + ratio + (def === 0 ? 6 : 0) + (q.cores.includes(owner) || q.claims.includes(owner) ? 4 : 0) + (q.id === C(q.owner).capital ? 8 : 0); if (s > bs) { bs = s; best = q.id; } }
      if (best !== null) { a.path = [best]; a.prog = 0; a.front.post = best; } }
  }
}
// order of play each day
// game.js loads after this file in the browser, so the daily hook is installed once every script has run
function installWarLayer() { if (installWarLayer.done) return; installWarLayer.done = true; const _dt = dayTick; dayTick = function () { _dt(); airDaily(); frontTick(); if (G.day % 7 === 3) { airWeekly(); const pl = C(G.player); if (pl && pl.exists && pl.airAuto !== false) pl.airPlan = autoAirPlan(pl); for (const c of alive()) if (c.ai && isAtWar(c.tag)) c.airPlan = autoAirPlan(c); } }; }
if (typeof dayTick === 'function') installWarLayer(); else document.addEventListener('DOMContentLoaded', installWarLayer);

// ---------- battles end ----------
// A battle used to last until a whole stack ran out of organisation, so a large garrison could hold out for a year against
// waves of fresh attackers. Now an assault is decided after three weeks by who has been winning the exchange.
{ const _rb = resolveBattle; resolveBattle = function (b) {
  _rb(b); if (!G.battles.includes(b)) return; b.mbal = b.mbal === undefined ? b.bal : b.mbal * 0.93 + b.bal * 0.07; if (b.days < 14) return;
  const p = P(b.prov), att = b.att.map(i => G.armies[i]).filter(a => a && a.divs.length), defs = att.length ? armiesAt(b.prov).filter(x => atWar(att[0].owner, x.owner)) : [];
  const fin = () => { for (const a of att) a.battle = 0; G.battles.splice(G.battles.indexOf(b), 1); };
  if (!att.length || !defs.length) return fin();
  if (b.mbal >= 0.52) { for (const a of defs) retreat(a, att[0].owner); for (const a of att) a.prog = 99; battleNote(b, att, defs, true); }
  else { for (const a of att) { a.path = []; a.prog = 0; for (const d of a.divs) d.org = Math.min(d.org, 0.35); } battleNote(b, att, defs, false); }
  fin(); }; }

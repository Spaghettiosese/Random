// 2.0 war accounting: manpower that runs out, casualties and the wounded, civilian deaths and what they do to a nation,
// and naval control that depends on the air over the landing zone.
'use strict';
const warOf = (a, b) => G.wars.find(w => (w.att.includes(a) && w.def.includes(b)) || (w.att.includes(b) && w.def.includes(a)));
const wacc = (w, k, tag, v) => { if (!w) return; const o = w[k] || (w[k] = {}); o[tag] = (o[tag] || 0) + v; };
const menOf = a => sum(a.divs, d => d.str * UNITS[d.t].mp);
function civDeath(p, n, w, cause) { if (n <= 0) return; n = Math.min(n, p.pop * 0.05); p.pop = Math.max(1, p.pop - n); const c = C(p.owner); c.civDead = (c.civDead || 0) + n; c._civM = (c._civM || 0) + n; if (cause) (c.civBy = c.civBy || {})[cause] = (c.civBy[cause] || 0) + n; wacc(w, 'civ', p.owner, n); }
function milLoss(tag, n, w) { if (n <= 0) return; const c = C(tag); c.milDead = (c.milDead || 0) + n * 0.55; c.wounded = (c.wounded || 0) + n * 0.45; wacc(w, 'loss', tag, n); }

// battles: who lost how many men, who took part, and the people caught in between
{ const _rb = resolveBattle; resolveBattle = function (b) {
  const p = P(b.prov), att = b.att.map(i => G.armies[i]).filter(Boolean), A0 = att.length ? att[0].owner : null, defs = A0 ? armiesAt(b.prov).filter(x => atWar(A0, x.owner)) : [], snap = att.concat(defs).map(a => [a, a.owner, menOf(a)]);
  _rb(b); if (!A0 || !defs.length) return; const w = warOf(A0, defs[0].owner);
  for (const [a, o, m0] of snap) { const lost = G.armies[a.id] ? Math.max(0, m0 - menOf(a)) : 0; milLoss(o, lost, w); wacc(w, 'part', o, a.divs.length * 0.25); }
  civDeath(p, p.pop * (p.ter === 'u' ? 0.00003 : 0.000015) * (1 + p.vp / 20), w, 'battle'); }; }
// an army destroyed in a pocket: most of it dies or is captured
{ const _da = disbandArmy; disbandArmy = function (a) { a._disband = true; return _da(a); }; }
{ const _ra = removeArmy; removeArmy = function (a) { if (G && G.armies[a.id] && !a._disband && a.divs.length && enemiesOf(a.owner).length) { const m = menOf(a), e = enemiesOf(a.owner).find(t => armiesAt(a.loc).some(x => x.owner === t)) || enemiesOf(a.owner)[0]; const c = C(a.owner); c.milDead = (c.milDead || 0) + m * 0.4; c.pows = (c.pows || 0) + m * 0.6; wacc(warOf(a.owner, e), 'loss', a.owner, m); } return _ra(a); }; }

// manpower: the dead and the captured no longer come back; the wounded do, slowly
{ const _mw = militaryWeekly; militaryWeekly = function (c) {
  const before = c.manpower; _mw(c); const back = (c.wounded || 0) * 0.08; c.wounded = (c.wounded || 0) - back; c.manpower += back;
  const lostForGood = (c.milDead || 0) * 0.5 + (c.pows || 0) * 0.35, cap = Math.max(0, maxManpower(c) - inService(c) - lostForGood); if (c.manpower > cap && c.manpower > before) c.manpower = Math.max(before, cap);
  c.milDead = (c.milDead || 0) * 0.9975; // each year a new class comes of age
  const crisis = isAtWar(c.tag) && c.manpower < Math.max(15, maxManpower(c) * 0.04); if (crisis && !hasSpirit(c, 'manpower_crisis')) { addSpirit(c, 'manpower_crisis'); if (c.tag === G.player) UIH.notify('Manpower crisis: the depots are empty. Divisions can no longer be brought up to strength.', 'bad'); } else if (!crisis && hasSpirit(c, 'manpower_crisis')) removeSpirit(c, 'manpower_crisis'); }; }
SPIRITS.manpower_crisis = ['Manpower Crisis', 'There are no more men to send. Boys and old men fill the gaps.', { org: -0.06, atk: -0.05, stab: -4 }];
SPIRITS.blitz_spirit = ['Under the Bombs', 'The bombing has hardened the nation, for now.', { ws: 6 }];
SPIRITS.mass_grief = ['A Nation in Mourning', 'Civilian losses have reached every family.', { stab: -6, ws: -6, output: -0.03 }];

// occupation kills too: resistance, reprisals, requisitions
{ const _ot = occupationTick; occupationTick = function () { _ot();
  for (const p of G.P) { if (p.ctrl === p.owner || friendly(p.ctrl, p.owner)) continue; const pol = occPolicy(C(p.ctrl)), u = p.unrest || 0; const n = p.pop * (0.00004 + u / 100 * 0.00012) * (pol === 'harsh' ? 2.5 : pol === 'lenient' ? 0.5 : 1); civDeath(p, n, warOf(p.ctrl, p.owner), 'occupation'); } }; }
// monthly: what civilian losses do to a nation
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); const m = c._civM || 0; c._civM = 0; if (m <= 0) return; const pop = c.stats.pop || 1, r = m / pop;
  c.warExh = Math.min(100, c.warExh + r * 2500); c.stab = Math.max(0, c.stab - r * 1200);
  if (r > 0.0003 && c.ws < 70 && !hasSpirit(c, 'blitz_spirit') && (c.civDead || 0) / pop < 0.01) { addSpirit(c, 'blitz_spirit', 180); }
  if ((c.civDead || 0) / pop > 0.02 && !hasSpirit(c, 'mass_grief')) { addSpirit(c, 'mass_grief', 540); if (c.tag === G.player) UIH.notify(`Civilian deaths have passed ${fmt((c.civDead || 0) * 1000)}. The nation mourns.`, 'bad'); } }; }

// naval control: navies count, but so does the air over the landing zone; and a crossing needs a real margin
seaOK = function (tag, p) {
  if (!atWar(tag, p.ctrl)) return true; let mine = 0, theirs = 0;
  for (const c of alive()) { if (c.tag === tag || (friendly(tag, c.tag) && atWar(c.tag, p.ctrl))) mine += navalPower(c); else if (c.tag === p.ctrl || (friendly(p.ctrl, c.tag) && atWar(c.tag, tag))) theirs += navalPower(c); }
  const sup = typeof zoneSup === 'function' ? zoneSup(tag, PZ[p.id]) : 0.5; return mine >= 40 && mine * (0.5 + sup) >= theirs * (1.5 - sup) * 1.5;
};
const navalControl = (tag, p) => { let mine = 0, theirs = 0; for (const c of alive()) { if (c.tag === tag || (friendly(tag, c.tag) && atWar(c.tag, p.ctrl))) mine += navalPower(c); else if (c.tag === p.ctrl || (friendly(p.ctrl, c.tag) && atWar(c.tag, tag))) theirs += navalPower(c); } const sup = zoneSup(tag, PZ[p.id]); return { mine, theirs, sup, ratio: (mine * (0.5 + sup)) / Math.max(1, theirs * (1.5 - sup)) }; };

// capitulation progress, as checkCapitulation sees it
function capInfo(tag) { const c = C(tag); let tot = 0, lost = 0; for (const p of G.P) if (p.owner === tag && p.cores.includes(tag)) { tot += p.vp; if (p.ctrl !== tag && atWar(tag, p.ctrl)) lost += p.vp; }
  if (!tot) for (const p of G.P) if (p.owner === tag) { tot += p.vp; if (p.ctrl !== tag && atWar(tag, p.ctrl)) lost += p.vp; }
  const lim = clamp(0.58 + (c.ws - 50) / 220 + (c.major ? 0.08 : 0) + M(c, 'caplimit') + (c.civilOf || G.wars.some(w => w.civil && (w.att.includes(tag) || w.def.includes(tag))) ? 0.15 : 0), 0.4, 0.92);
  const f = tot ? lost / tot : 0; return { held: 1 - f, lim, prog: c.capitulated ? 1 : clamp(f / lim, 0, 1) }; }
const fielded = tag => sum(armiesOf(tag), menOf);

// marching time follows distance: dense Europe is crossed a province at a time, the steppe takes longer
{ const _md = moveDays; moveDays = function (a, from, to, sea) { const d = _md(a, from, to, sea); if (sea || typeof kmBetween !== 'function') return d; const km = kmBetween(from, to); return Math.max(1.5, d * clamp(km / 210, 0.4, 1.6)); }; }

// 2.2 national systems for Spain, Scandinavia and the Low Countries (Spain first; the others follow below).
'use strict';
// ======================= Spain: the factions of the two Spains =======================
const SFAC = {
  rep: { psoe: ['Socialists', 'PSOE and the UGT: Largo Caballero\'s unions and Prieto\'s moderates.', { stab: 2, manpower: 0.03 }], pce: ['Communists', 'A small party grown great on Soviet rifles: discipline, commissars and the Popular Army.', { org: 0.05, def: 0.03 }],
    cnt: ['Anarchists', 'The CNT-FAI: militias, collectives and revolution now.', { atk: 0.04, mil_out: -0.05, ws: 6 }], poum: ['POUM', 'Anti-Stalinist Marxists, strongest in Catalonia.', { ws: 3, atk: 0.02 }],
    rep: ['Republicans', 'Azaña\'s middle-class Republicans: legality, and friends in Paris and London.', { infl: 0.1, legit: 4 }], reg: ['Basques and Catalans', 'Home rule in Bilbao and Barcelona, and the factories that go with it.', { output: 0.04 }] },
  nat: { army: ['The Generals', 'Franco, Mola and the Army of Africa.', { org: 0.04, atk: 0.04 }], fal: ['Falange', 'José Antonio\'s blue shirts, swollen with new recruits.', { ws: 6, pp: 0.08 }],
    car: ['Carlists', 'The red berets of Navarre, for God, country and their own king.', { manpower: 0.05, def: 0.03 }], mon: ['Monarchists', 'Alfonsine officers and grandees who want the King back.', { legit: 6, stab: 2 }], chu: ['The Church', 'Bishops who bless the Crusade.', { stab: 4 }] } };
const SFAC0 = { rep: { psoe: 30, pce: 8, cnt: 25, poum: 5, rep: 22, reg: 10 }, nat: { army: 40, fal: 20, car: 15, mon: 15, chu: 10 } };
SPIRITS.sp_trench = ['A War of Positions', 'Trenches around Madrid, Oviedo and Teruel: neither side can break the other quickly.', { def: 0.18, org: 0.04, caplimit: 0.12 }];
SPIRITS.sp_divided = ['A Divided Cause', 'Our own side fights over everything.', { atk: -0.05, org: -0.05, stab: -5 }];
SPIRITS.sp_united = ['A United Cause', 'One command, one purpose.', { org: 0.04, def: 0.04, stab: 3 }];
for (const s in SFAC) for (const k in SFAC[s]) SPIRITS['sf_' + k] = [`${SFAC[s][k][0]} Lead`, SFAC[s][k][1], SFAC[s][k][2]];
const sSide = c => ['fas', 'aut'].includes(c.ideology) ? 'nat' : 'rep';
function sfacOf(c) { const side = sSide(c); if (!c.sfac || c.sfac.side !== side) c.sfac = { side, unity: side === 'nat' ? 45 : 40, f: Object.assign({}, SFAC0[side]) }; return c.sfac; }
const sfacTop = s => Object.keys(s.f).sort((a, b) => s.f[b] - s.f[a])[0];
function sfacNorm(s) { const t = sum(Object.keys(s.f), k => s.f[k]) || 1; for (const k in s.f) s.f[k] = Math.max(1, s.f[k] * 100 / t); }
function sfacShift(c, k, n) { const s = sfacOf(c); if (!(k in s.f)) return; s.f[k] = Math.max(1, s.f[k] + n); sfacNorm(s); }
const spCW = () => G.flags.spain_cw && alive().filter(k => k.tag.startsWith('SPA')).length > 1;
function spainMonthly(c) { const s = sfacOf(c), top = sfacTop(s), sorted = Object.keys(s.f).sort((a, b) => s.f[b] - s.f[a]), lead = s.f[sorted[0]] - s.f[sorted[1]];
  // a clear leader holds the coalition together; a war going badly pulls it apart
  s.unity = clamp(s.unity + (lead > 15 ? 0.6 : -0.3) + (s.side === 'nat' ? 0.4 : 0) - (isAtWar(c.tag) && capInfo(c.tag).prog > 0.3 ? 1 : 0) - (s.side === 'rep' && s.f.cnt + s.f.poum > 35 && s.f.pce > 20 ? 0.8 : 0), 0, 100);
  if (s.side === 'rep' && spCW()) { const sov = ok('SOV') && opinion('SOV', c.tag) > 20; if (sov) s.f.pce += 0.6; sfacNorm(s); }
  for (const x in SFAC.rep) removeSpirit(c, 'sf_' + x); for (const x in SFAC.nat) removeSpirit(c, 'sf_' + x); removeSpirit(c, 'sp_divided'); removeSpirit(c, 'sp_united');
  removeSpirit(c, 'sp_trench'); if (spCW() && year() < 1940) addSpirit(c, 'sp_trench');
  addSpirit(c, 'sf_' + top); if (s.unity < 30) addSpirit(c, 'sp_divided'); else if (s.unity > 70) addSpirit(c, 'sp_united');
  // the May Days: anarchists and communists fight in the streets of Barcelona
  if (s.side === 'rep' && s.unity < 22 && s.f.cnt + s.f.poum > 25 && s.f.pce > 15 && !c.flags.maydays && Math.random() < 0.25) { c.flags.maydays = G.day; c.stab = Math.max(0, c.stab - 8); const loser = s.f.pce > s.f.cnt ? 'cnt' : 'pce'; s.f[loser] *= 0.5; s.f.poum *= 0.3; sfacNorm(s); s.unity = Math.min(100, s.unity + 15);
    logMsg(`Fighting in the streets of Barcelona: ${loser === 'cnt' ? 'the Communists crush the Anarchists and the POUM' : 'the Anarchists drive out the Communists'}.`, 'world', [c.tag]); }
  if (c.ai && c.pp > 90) { const want = s.side === 'nat' ? 'army' : (c.ideology === 'com' ? 'pce' : 'psoe'); if (s.unity < 40) sfacAct(c, 'unite'); else if (top !== want) sfacAct(c, 'favour', want); } }
const SFAC_ACT = { favour: ['Favour', 30, 'Ministries, weapons and posts for them: their share +10.'], unite: ['Appeal for Unity', 40, 'Speeches, a common programme and a joint command: unity +10.'], curb: ['Curb', 25, 'Disarm their militias and close their newspapers: their share -12, unity -4.'] };
function sfacAct(c, a, k) { const d = SFAC_ACT[a], s = sfacOf(c); if (c.pp < d[1]) return 'Not enough political power'; if (a !== 'unite' && !(k in s.f)) return 'Unknown faction'; c.pp -= d[1];
  if (a === 'favour') { s.f[k] += 10; s.unity = Math.max(0, s.unity - 2); } else if (a === 'unite') s.unity = Math.min(100, s.unity + 10); else { s.f[k] = Math.max(1, s.f[k] - 12); s.unity = Math.max(0, s.unity - 4); } sfacNorm(s); return ''; }
Object.assign(REQF, {
  spRep: [c => !['fas', 'aut'].includes(c.ideology), 'The Republic governs'], spNat: [c => ['fas', 'aut'].includes(c.ideology), 'The Nationalists govern'],
  spWar: [c => spCW() && alive().some(k => k.tag !== c.tag && k.tag.startsWith('SPA') && atWar(c.tag, k.tag)), 'The Civil War rages'],
  spPeace: [c => !spCW(), 'Spain is at peace with itself'],
  spWon: [c => !!G.flags.spain_cw && !spCW(), 'The Civil War is over']
});
Object.assign(XTOK, {
  sfac: v => { const [k, n] = v.trim().split(' '); const nm = (SFAC.rep[k] || SFAC.nat[k] || [k])[0]; return [c => sfacShift(c, k, +n), `${nm}: share ${+n > 0 ? '+' : ''}${n}`]; },
  sunity: v => [c => { const s = sfacOf(c); s.unity = clamp(s.unity + +v, 0, 100); }, `Unity of our cause ${+v > 0 ? '+' : ''}${v}`],
  spsurrender: () => [c => { const o = alive().find(k => k.tag !== c.tag && k.tag.startsWith('SPA') && atWar(c.tag, k.tag)); if (o) { logMsg(`${c.name} lays down its arms. The Civil War is over.`, 'world', [c.tag, o.tag]); capitulate(c.tag); } }, 'Surrender to the other side, with what terms can be had'],
  merge: v => { const [a, b] = v.trim().split(' '); return [c => { const s = sfacOf(c); if (a in s.f && b in s.f) { s.f[a] += s.f[b]; s.f[b] = 1; sfacNorm(s); s.unity = Math.min(100, s.unity + 15); } }, `The ${(SFAC.nat[b] || SFAC.rep[b] || [b])[0]} are merged into the ${(SFAC.nat[a] || SFAC.rep[a] || [a])[0]}`]; }
});
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.exists && !c.capitulated && c.tag.startsWith('SPA')) spainMonthly(c); }; }
{ const _ng = newGame; newGame = function (...a) { const r = _ng(...a); const g = PN('Gibraltar'); if (g && !g.claims.includes('SPA')) g.claims.push('SPA'); return r; }; }
// The Spanish war lasted almost three years: the Republic armed its workers at once, and neither side could finish the
// other quickly. Neither side capitulates before the autumn of 1938 while it still holds more than two provinces.
{ const _cc = checkCapitulation; checkCapitulation = function (tag) { if (tag && tag.startsWith('SPA') && spCW() && G.day < 1004 && G.P.filter(p => p.ctrl === tag).length > 2) return; return _cc(tag); }; }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (spCW() && !G.flags.spMilitia && c.tag.startsWith('SPA') && sSide(c) === 'rep' && c.exists) { G.flags.spMilitia = G.day; spawnDivisions(c, 'mil', 8, c.capital); logMsg('The Republic arms the workers: militia columns march out of Madrid and Barcelona.', 'info', [c.tag]); } }; }

// 1.6 "Reckoning": systems rebuilt after a hard review.
//  - Doctrine is a system of its own, bought with army experience (it used to be generated focus filler).
//  - Stacked modifiers have diminishing returns.
//  - Wars end: a beaten coalition surrenders with its leader, and frozen AI wars are settled.
'use strict';

// ---------- modifiers: diminishing returns past 30%, hard stop at 60% ----------
const SOFT_KEYS = new Set(['atk', 'def', 'org', 'output', 'mil_out', 'build', 'research', 'tank', 'air', 'navy', 'supply', 'farm_out', 'res_out', 'tax', 'manpower', 'train', 'entrench', 'cas', 'bombing']);
const softCap = v => { const a = Math.abs(v); return a <= 0.3 ? v : Math.sign(v) * Math.min(0.6, 0.3 + (a - 0.3) * 0.5); };
{ const _M = M; M = function (c, key) { const v = _M(c, key); return SOFT_KEYS.has(key) ? softCap(v) : v; }; }
const rawMod = (c, key) => { M(c, key); return (c._m && c._m[key]) || 0; };

// ---------- doctrine ----------
const DOC_NAME = { land: 'Army', air: 'Air force', sea: 'Navy' };
const DOC_BLURB = {
  land: ['Tanks and trucks break through and keep going.', 'Guns and aircraft do the killing; infantry occupies.', 'Meticulous preparation, deep defences, set-piece attacks.', 'Numbers, reserves and a front that never stops moving.'],
  air: ['Bombers win wars by destroying industry.', 'Aircraft are flying artillery for the army.', 'Fighters first: own the sky, then everything else.'],
  sea: ['A battle line that controls the sea by existing.', 'Submarines and raiders strangle the enemy\'s trade.', 'Carriers strike from beyond the horizon.']
};
const docCost = s => 20 + s * 10;
const docSteps = (k, pi) => DOCTRINES[k][2][pi].length / 2;
for (const k in DOCTRINES) DOCTRINES[k][2].forEach((path, pi) => { for (let i = 0; i < path.length; i += 2) SPIRITS[`doc_${k}${pi}_${i / 2}`] = [path[i], `${DOC_NAME[k]} doctrine: ${DOCTRINES[k][2][pi][0]}.`, kvs(path[i + 1])]; });
const docOf = (c, k) => (c.doc && c.doc[k]) || null;
function docBlock(c, k, pi) { const d = docOf(c, k); if (d && d.p !== pi) return 'Another school is in force. Abandon it first.'; const s = d ? d.n : 0; if (s >= docSteps(k, pi)) return 'This school is complete'; if ((c.axp || 0) < docCost(s)) return `Needs ${docCost(s)} army experience`; return ''; }
function adoptDoctrine(c, k, pi) { if (docBlock(c, k, pi)) return false; c.doc = c.doc || {}; const d = c.doc[k] || (c.doc[k] = { p: pi, n: 0 }); c.axp -= docCost(d.n); addSpirit(c, `doc_${k}${pi}_${d.n}`); d.n++; if (d.n === docSteps(k, pi)) logMsg(`${c.name} completes its ${DOC_NAME[k].toLowerCase()} doctrine: ${DOCTRINES[k][2][pi][0]}.`, c.major ? 'world' : 'info', [c.tag]); return true; }
function abandonDoctrine(c, k) { const d = docOf(c, k); if (!d) return; for (let s = 0; s < d.n; s++) removeSpirit(c, `doc_${k}${d.p}_${s}`); c.axp = (c.axp || 0) + Math.round(d.n * 8); delete c.doc[k]; }
const DOC_PREF = { land: { GER: 0, JAP: 2, SOV: 3, CHI: 3, PRC: 3, USA: 1, ENG: 1, FRA: 2, ITA: 2, POL: 0 }, air: { GER: 1, SOV: 1, ENG: 0, USA: 0, JAP: 2, ITA: 2 }, sea: { GER: 1, ITA: 0, ENG: 0, USA: 2, JAP: 2, SOV: 1 } };
function aiDoctrine(c) {
  if ((c.axp || 0) < 45) return; const base = c.tag.slice(0, 3), order = navalPower(c) > 120 ? ['land', 'sea', 'air'] : ['land', 'air', 'sea'];
  for (const k of order) { const d = docOf(c, k), pi = d ? d.p : (DOC_PREF[k][base] !== undefined ? DOC_PREF[k][base] : hashTag(c.tag + k) % DOCTRINES[k][2].length); if (!docBlock(c, k, pi) && c.axp >= docCost(d ? d.n : 0) + 20) { adoptDoctrine(c, k, pi); return; } }
}
// manoeuvres: turn money and wear into experience
function exerciseBlock(c) { if (isAtWar(c.tag)) return 'The army is learning the hard way already'; if ((c.exDay || -999) + 90 > G.day) return `Next manoeuvres possible in ${c.exDay + 90 - G.day} days`; const cost = exerciseCost(c); if (c.money < cost) return 'The treasury cannot pay for them'; return ''; }
const exerciseCost = c => Math.round(Math.max(300, (c._ndiv || 10) * 60 + (c.budget.income || 0) * 0.15));
function armyExercise(c) { if (exerciseBlock(c)) return false; c.money -= exerciseCost(c); c.exDay = G.day; c.axp = (c.axp || 0) + 14 + Math.min(16, (c._ndiv || 10) / 5); for (const a of armiesOf(c.tag)) for (const d of a.divs) { d.org = Math.max(0.4, d.org - 0.15); d.xp = Math.min(1, (d.xp || 0) + 0.04); } return true; }
{ const _sw = supportWeekly; supportWeekly = function (c) { _sw(c); c.axp = Math.min(500, (c.axp || 0) + 0.5); if (c.ai) { aiDoctrine(c); if (!isAtWar(c.tag) && c.money > exerciseCost(c) * 6 && Math.random() < 0.08) armyExercise(c); } }; }

// ---------- wars end ----------
// 1. When the leader of a side has capitulated and what is left is only its subjects and lesser allies, the side sues for peace.
// 2. A war between AI coalitions that has not moved for a year and a half, three years in, ends on the lines held.
{ const _cwe = checkWarEnd; checkWarEnd = function (w) {
    _cwe(w); if (!G.wars.includes(w) || w.civil) return;
    for (const side of ['att', 'def']) { const S = w[side], L = C(S[0]); if (!L || (L.exists && !L.capitulated)) continue; const foe = side === 'att' ? w.def : w.att, foeStr = Math.max(...foe.map(t => C(t).exists && !C(t).capitulated ? countryStr(t) : 0), 1);
      const rest = S.filter(t => C(t).exists && !C(t).capitulated); if (rest.some(t => C(t).major || (!C(t).overlord && countryStr(t) > foeStr * 0.5)) || rest.some(t => t === G.player && !C(t).ai)) continue;
      logMsg(`With ${L.name} beaten, its remaining allies ask for terms.`, 'world'); for (const t of rest) C(t).capitulated = true; _cwe(w); return; }
  };
  const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm();
    for (const w of G.wars.slice()) { if (w.civil) continue; const sc = warScore(w), v = sc.att - sc.def; w.born = w.born === undefined ? G.day : w.born; if (w.sc === undefined || Math.abs(v - w.sc) > 0.03) { w.sc = v; w.still = 0; continue; } w.still = (w.still || 0) + 1;
      if (w.still >= 18 && G.day - w.born > 1000 && !w.att.concat(w.def).some(t => t === G.player && !C(t).ai) && Math.abs(v) < 0.25) { logMsg(`After years of stalemate the ${w.name} is ended by an armistice.`, 'world'); whitePeace(w); } } }; }

// requirements on the old object-style trees
{ const need = (tree, id, req) => { const f = (TREES[tree] || []).find(x => x.id === id); if (f) f.req = f.req ? both(f.req, req) : req; };
  need('ITA', 'i_albania', tensionReq(15)); need('SOV', 's_fin', REQX.divs(110)); need('SOV', 's_baltic', tensionReq(35)); }

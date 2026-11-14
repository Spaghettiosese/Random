// 2.1 balance: enemies on our own soil come first, and a landing on a great power's coast needs command of the sea,
// command of the air and time to plan. Before this, a single six-division army could land at Hamburg in 1940 and walk
// to Berlin while two hundred German divisions stood in France.
'use strict';
// may this (AI-driven) army cross the sea to attack q?
function aiMayLand(tag, q) {
  if (!atWar(tag, q.ctrl)) return true;
  const own = C(q.owner), homeland = own && own.major && q.cores.includes(q.owner) && q.owner === q.ctrl;
  const nc = navalControl(tag, q); if (nc.ratio < (homeland ? 2.2 : 1.6)) return false;
  if (zoneSup(tag, PZ[q.id]) < (homeland ? 0.6 : 0.45)) return false;
  if (homeland) { const w = warOf(tag, q.ctrl), J = (w && w.joined) || {}; if (!w || G.day - Math.max(w.start, J[tag] || 0, J[q.ctrl] || 0) < 900) return false; if (G.historical && year() < 1943) return false;
    // the defender's coast is watched: do not land next to a large army
    const near = sum(NB[q.id].filter(e => !e.sea).map(e => e.to), id => sum(armiesAt(id).filter(x => atWar(tag, x.owner)), armyStr)); if (near > 400) return false; }
  return true;
}
const strictSea = fn => function (...args) { const s = seaOK; seaOK = (t, p) => s(t, p) && aiMayLand(t, p); try { return fn.apply(this, args); } finally { seaOK = s; } };
// home defence: armies are pulled back to fight an enemy standing on our core land
function aiHomeDefence(tag) {
  const c = C(tag); if (!c || !c.exists || c.capitulated) return; if (!enemiesOf(tag).length) return;
  const intr = []; for (const p of G.P) { if (p.owner !== tag || !p.cores.includes(tag)) continue; const en = armiesAt(p.id).filter(a => atWar(tag, a.owner)), held = atWar(tag, p.ctrl); if (!held && !en.length) continue;
    // a province on the fighting line next to our own field armies is the front's business; deep intrusions are ours
    intr.push({ p, es: sum(en, armyStr), w: p.vp + (p.id === c.capital ? 60 : 0) + (held ? 6 : 2) }); }
  if (!intr.length) return; intr.sort((a, b) => b.w - a.w);
  const mine = armiesOf(tag).filter(a => a.auto && a.divs.length && !a.inv && !a.battle && !a.oos && sum(a.divs, d => d.org) / a.divs.length > 0.35), used = new Set();
  for (const it of intr.slice(0, 6)) { const need = it.es * 1.8 + 12;
    let got = sum(mine.filter(a => a.loc === it.p.id || (a.path.length && a.path[a.path.length - 1] === it.p.id)), armyStr); if (got >= need) continue;
    const cand = mine.filter(a => !used.has(a.id) && !(a.path.length && G.day - (a._hd || -99) < 12)).map(a => [a, kmBetween(a.loc, it.p.id)]).filter(x => x[1] < 1300).sort((x, y) => x[1] - y[1]);
    for (const [a] of cand) { if (got >= need) break;
      const here = P(a.loc), threatened = NB[a.loc].some(e => !e.sea && armiesAt(e.to).some(x => atWar(tag, x.owner))); if (threatened && armiesAt(a.loc).filter(x => x.owner === tag).length <= 1 && here.cores.includes(tag)) continue;
      if (orderMove(a, it.p.id)) { a._t = G.day; a._hd = G.day; used.add(a.id); got += armyStr(a); } } }
}
{ const _aa = aiArmies; aiArmies = function (tag) { strictSea(_aa)(tag); if (G.armies && C(tag) && C(tag).exists) aiHomeDefence(tag); }; }
{ const _ai = aiInvasions; aiInvasions = strictSea(_ai); }
// The Soviet Union's border wars of 1939-40 (Poland, Finland, the Baltic, Bessarabia) did not bring Britain, France or
// Germany into war with Moscow. In historical mode they stay local until Germany and the Soviet Union are at war.
const sovLocal = () => G.historical && ok('SOV') && !(ok('GER') && atWar('SOV', 'GER')) && year() < 1946;
{ const _dw = declareWarInner; declareWarInner = function (a, b, goals, name, noCall, rt) {
  if (a === 'SOV' && sovLocal() && !C(b).major && b !== G.player) { const w = _dw(a, b, goals, name, true, rt); if (w) { const allies = G.pacts.filter(p => p.t === 'ally' && (p.a === b || p.b === b)).map(p => p.a === b ? p.b : p.a).filter(t => ok(t) && !C(t).major); for (const t of allies) if (!atWar(t, a)) joinWar(w, t, w.att.includes(b) ? 'att' : 'def'); } return w; }
  // nor does Germany open the eastern war before the west is settled, unless the player leads it
  if (a === 'GER' && b === 'SOV' && G.historical && C('GER').ai && !(REQF.franceDown && REQF.franceDown[0](C('GER'))) && year() < 1942) return null;
  if (a === 'SOV' && b === 'GER' && G.historical && C('SOV').ai && year() < 1943 && !G.P.some(p => p.owner === 'SOV' && p.ctrl === 'GER')) return null;
  return _dw(a, b, goals, name, noCall, rt); }; }
{ const _sp = startPlay; startPlay = function (a, b, goal, opt = {}) { if (a === 'SOV' && sovLocal()) opt = Object.assign({}, opt, { noBackHist: (opt.noBackHist || []).concat(['GER', 'ITA', 'ENG', 'FRA', 'USA', 'JAP']) }); return _sp(a, b, goal, opt); }; }
// Neutrals stay neutral: in historical mode an AI minor joins a faction only when that faction is already fighting the
// power that attacks or threatens it (Poland, Norway, Greece did; Sweden, Turkey and the Baltic states did not).
function histFactionOK(minor, leader) {
  const m = C(minor); if (!G.historical || !m || !m.ai || m.major || minor === G.player || m.overlord || year() >= 1944) return true;
  const foes = enemiesOf(minor).concat(G.plays.filter(p => p.b === minor).map(p => p.a)); return foes.some(e => atWar(leader, e));
}
{ const j = DIPLO.joinf.ai; DIPLO.joinf.ai = (a, b) => j(a, b) && histFactionOK(a, b); const i = DIPLO.invite.ai; DIPLO.invite.ai = (a, b) => i(a, b) && histFactionOK(b, a); }
// in a historical game the Front forms when Japan invades, unless the Chinese are already fighting each other
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { const w = _dw(a, b, ...r);
  if (w && G.historical && !G.flags.unitedFront && ((a === 'JAP' && b === 'CHI') || (a === 'CHI' && b === 'JAP')) && !atWar('CHI', 'PRC')) formUnitedFront(); return w; }; }
// ... nor through a faction: a small ally of the West fighting Moscow does not bring the great powers in with it
{ const _jw = joinWar; joinWar = function (w, t, side) { const opp = side === 'att' ? w.def : w.att;
  if (opp.includes('SOV') && sovLocal() && ['ENG', 'FRA', 'USA', 'GER', 'ITA', 'JAP'].includes(t) && C(t) && C(t).ai && !atWar(t, 'SOV') && t !== G.player) return; return _jw(w, t, side); }; }
// partisans fight for their own land: they do not march abroad
{ const _aa = aiArmies; aiArmies = function (tag) { _aa(tag); for (const a of armiesOf(tag)) if (a.partisan && a.path.length && !P(a.path[0]).cores.includes(a.partisan)) a.path = []; }; }
// a great power fighting on its own soil fights harder: interior lines, every village a strongpoint
SPIRITS.home_ground = ['Defending the Homeland', 'The enemy stands on our soil. Every man defends his own street.', { def: 0.08, org: 0.03, ws: 4 }];
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (!c.major || !c.exists) return; const onSoil = G.P.some(p => p.owner === c.tag && p.cores.includes(c.tag) && p.ctrl !== c.tag && atWar(c.tag, p.ctrl)); if (onSoil && !c.capitulated) addSpirit(c, 'home_ground'); else removeSpirit(c, 'home_ground'); }; }
// before September 1939 a quarrel between two small states stays theirs: the great powers send notes, not armies
const PREWAR_DAY = 1339; // 1 September 1939
{ const _jw = joinWar; joinWar = function (w, t, side) { const k = C(t);
  if (G.historical && G.day < PREWAR_DAY && k && k.major && k.ai && t !== G.player && w.att[0] && w.def[0] && !C(w.att[0]).major && !C(w.def[0]).major && !w.civil) return; return _jw(w, t, side); }; }
// Historical games keep to the shape of the war. When a great power is in trouble, it does what it did in history:
// Germany mobilises for total war, Britain fights on alone, the Soviet people fight a Patriotic War, and America comes in
// when Britain is in mortal danger. These apply only to AI-led nations in historical mode.
SPIRITS.ger_total_war = ['Total War', 'Goebbels at the Sportpalast: do you want total war? The economy is turned over to the front.', { def: 0.12, atk: 0.05, mil_out: 0.2, manpower: 0.1 }];
SPIRITS.britain_alone = ['Britain Alone', 'Never was so much owed by so many to so few.', { def: 0.12, navy: 0.15, air: 0.12, ws: 8 }];
SPIRITS.patriotic_war = ['The Great Patriotic War', 'Not a step back. The whole nation goes to war.', { def: 0.15, manpower: 0.15, mil_out: 0.15, ws: 10 }];
function histCourse() { if (!G.historical) return; const yr = year();
  const set = (t, sp, on) => { const c = C(t); if (!ok(t) || !c.ai) return; if (on && !c.capitulated) addSpirit(c, sp); else removeSpirit(c, sp); };
  if (ok('GER')) { const p = capInfo('GER').prog; set('GER', 'ger_total_war', yr < 1945 && isAtWar('GER') && (p > 0.2 || (hasSpirit(C('GER'), 'ger_total_war') && p > 0.08))); }
  if (ok('ENG')) { const fr = !ok('FRA') || C('FRA').capitulated, inv = G.P.some(p => p.owner === 'ENG' && p.cores.includes('ENG') && atWar('ENG', p.ctrl)); set('ENG', 'britain_alone', isAtWar('ENG') && ok('GER') && atWar('ENG', 'GER') && (fr || inv));
    // America will not let Britain fall
    const U = C('USA'); if (ok('USA') && U.ai && !atWar('USA', 'GER') && ok('GER') && atWar('ENG', 'GER') && (inv || capInfo('ENG').prog > 0.25 || (yr >= 1942 && fr))) { sideWith(U, 'ENG'); logMsg('The United States enters the war: Britain must not fall.', 'world'); } }
  if (ok('SOV') && ok('GER')) set('SOV', 'patriotic_war', atWar('SOV', 'GER') && capInfo('SOV').prog > 0.15);
}
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); histCourse(); }; }
// remember when each nation joined each war (landings on a homeland are timed from then)
{ const _jw = joinWar; joinWar = function (w, t, side) { const was = w.att.includes(t) || w.def.includes(t); const r = _jw(w, t, side); if (!was && (w.att.includes(t) || w.def.includes(t))) (w.joined = w.joined || {})[t] = G.day; return r; }; }
// great powers at war rebuild: with men and rifles to spare, up to 24 divisions train at once instead of 8
{ const _ar = aiRecruit; aiRecruit = function (c) { _ar(c); if (!c.major || !isAtWar(c.tag) || c.manpower < 150 || (c.stock.arms || 0) < 400 || c.training.length >= 24) return;
  const cap = Math.max(40, Math.round((c.stats.corePop || 0) / 600)); if ((c._ndiv || 0) + c.training.length >= cap) return; recruit(c, c.techs.m_art1 && (c.stock.artillery || 0) > 200 && Math.random() < 0.3 ? 'hvy' : 'inf', 3); }; }
// the Polish crisis belongs to 1939: an AI Germany does not press Warsaw before then in a historical game
{ const _sp = startPlay; startPlay = function (a, b, goal, opt) { if (G.historical && a === 'GER' && b === 'POL' && C('GER').ai && year() < 1939) return null; return _sp(a, b, goal, opt); }; }
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { if (G.historical && a === 'GER' && b === 'POL' && C('GER').ai && G.day < 1339 - 60) return null; return _dw(a, b, ...r); }; }

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
  if (homeland) { const w = warOf(tag, q.ctrl); if (!w || G.day - w.start < 900) return false;
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
const sovLocal = () => G.historical && ok('SOV') && !(ok('GER') && atWar('SOV', 'GER')) && year() < 1942;
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

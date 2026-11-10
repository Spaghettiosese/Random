// 1.2 systems: subjects (puppets), auto-build, auto-trade and recruitment helpers.
'use strict';
// ---------- subjects ----------
const SUBJ_LEVEL = [['Integrated Puppet', 0.2], ['Puppet', 0.1], ['Dominion', 0.04], ['Associated State', 0]];
const autonomyOf = c => c.autonomy === undefined ? (c.autonomy = ['CAN', 'AST', 'NZL', 'SAF'].includes(c.tag) ? 75 : c.tag === 'PHI' ? 65 : 45) : c.autonomy;
const subjLevel = c => { const a = autonomyOf(c); return a < 25 ? 0 : a < 60 ? 1 : a < 85 ? 2 : 3; };
const tributeRate = c => SUBJ_LEVEL[subjLevel(c)][1];
const subjectsOf = t => alive().filter(k => k.overlord === t);
const SUBJ = {
  tighten: { name: 'Tighten Control', cost: 60, tip: 'Autonomy -15. Their stability -5 and relations suffer.', can: (o, s) => autonomyOf(s) > 5 ? '' : 'They are already under our thumb', do: (o, s) => { s.autonomy = Math.max(0, s.autonomy - 15); s.stab = Math.max(0, s.stab - 5); addRel(o.tag, s.tag, -15); } },
  loosen: { name: 'Grant Autonomy', cost: 20, tip: 'Autonomy +15. Relations +20, their stability +4.', can: (o, s) => autonomyOf(s) < 100 ? '' : 'They are free in all but name', do: (o, s) => { s.autonomy = Math.min(100, s.autonomy + 15); s.stab = Math.min(100, s.stab + 4); addRel(o.tag, s.tag, 20); } },
  levy: { name: 'Levy Manpower', cost: 30, tip: 'Take a third of their available manpower. Autonomy +5.', can: (o, s) => s.manpower > 30 ? '' : 'They have no men to spare', do: (o, s) => { const n = s.manpower / 3; s.manpower -= n; o.manpower += n; s.autonomy = Math.min(100, s.autonomy + 5); } },
  colonial: { name: 'Raise Colonial Divisions', cost: 50, tip: 'Two infantry divisions raised from their manpower join our army in their capital. Autonomy +6.', can: (o, s) => s.manpower > 30 ? '' : 'They have no men to spare', do: (o, s) => { s.manpower -= 24; let a = armiesAt(s.capital).find(x => x.owner === o.tag && x.divs.length < 9 && !x.battle); if (!a) a = newArmy(o, s.capital); a.divs.push({ t: 'inf', str: 0.7, org: 0.6, xp: 0 }, { t: 'inf', str: 0.7, org: 0.6, xp: 0 }); s.autonomy = Math.min(100, s.autonomy + 6); } },
  invest: { name: 'Invest in Their Industry', cost: 40, tip: 'We pay for two factories and a railway there. Autonomy -6, relations +10.', can: o => o.money > 0 ? '' : 'Our treasury is empty', do: (o, s) => { o.money -= Math.max(400, o.budget.income * 2); const op = buildOptions(s)[0]; freeBuild(s, op ? op.type : 'tools', 2); freeBuild(s, 'railway', 1); s.autonomy = Math.max(0, s.autonomy - 6); addRel(o.tag, s.tag, 10); } },
  annex: { name: 'Annex', cost: 150, tip: 'Only an Integrated Puppet (autonomy below 25) can be absorbed. Infamy +6.', can: (o, s) => subjLevel(s) > 0 ? 'Their autonomy must be below 25' : isAtWar(o.tag) ? 'Not while at war' : '', do: (o, s) => { o.infamy += 6; annex(o.tag, s.tag, true); } },
  release: { name: 'Grant Independence', cost: 0, tip: 'They become fully sovereign. Relations +40.', can: () => '', do: (o, s) => { s.overlord = null; addRel(o.tag, s.tag, 40); logMsg(`${o.name} grants independence to ${s.name}.`, 'world'); } }
};
function subjAction(id, o, s) { const d = SUBJ[id]; if (s.overlord !== o.tag) return 'Not our subject'; const why = d.can(o, s); if (why) return why; if (o.pp < d.cost) return `Requires ${d.cost} political power`; autonomyOf(s); o.pp -= d.cost; d.do(o, s); return ''; }
// actions for a player who is a subject
function seekAutonomy(c) { if (!c.overlord || c.pp < 50) return false; c.pp -= 50; c.autonomy = Math.min(100, autonomyOf(c) + 10); addRel(c.tag, c.overlord, -5); return true; }
function declareIndependence(c) {
  if (!c.overlord) return; const o = c.overlord;
  if (autonomyOf(c) >= 85) { c.overlord = null; logMsg(`${c.name} becomes fully independent of ${cname(o)}.`, 'world'); return; }
  c.overlord = null; logMsg(`${c.name} throws off the rule of ${cname(o)}!`, 'world'); declareWar(o, c.tag, [{ by: o, vs: c.tag, type: 'puppet' }, { by: c.tag, vs: o, type: 'take', provs: [] }], `${c.adj} War of Independence`, true);
}
const releasable = c => Object.keys(G.C).filter(t => !G.C[t].exists && !/\d$/.test(t) && G.P.some(p => p.owner === c.tag && p.ctrl === c.tag && p.orig === t));
function releasePuppet(c, tag) {
  if (!releasable(c).includes(tag) || !releaseCountry(tag, c.tag)) return false; const s = C(tag); makeSubject(c.tag, tag); s.autonomy = 40; setIdeology(s, c.ideology, true); addRel(c.tag, tag, 30); c.infamy = Math.max(0, c.infamy - 4); return true;
}
function subjectsMonthly() {
  for (const s of alive()) { if (!s.overlord) continue; const o = C(s.overlord); if (!o || !o.exists) { s.overlord = null; continue; } let a = autonomyOf(s);
    a += 0.12 + (s.stab > 60 ? 0.08 : 0) + (o.capitulated ? 2 : 0) + (isAtWar(o.tag) ? 0.1 : 0) - (o.ideology !== 'dem' ? 0.12 : 0); s.autonomy = clamp(a, 0, 100);
    if (s.ai && s.autonomy >= 92 && !isAtWar(s.tag) && Math.random() < 0.04) declareIndependence(s);
    else if (s.ai && o.capitulated && s.autonomy >= 60 && Math.random() < 0.05) { s.overlord = null; logMsg(`${s.name} breaks away from defeated ${o.name}.`, 'world'); }
    if (o.ai && !isAtWar(o.tag)) { if (o.ideology !== 'dem' && s.autonomy > 55 && o.pp > 220 && Math.random() < 0.1) subjAction('tighten', o, s); else if ((o.ideology === 'fas' || o.ideology === 'com') && subjLevel(s) === 0 && o.pp > 300 && provsOf(s.tag).length <= 6 && Math.random() < 0.03) subjAction('annex', o, s); } }
}
// ---------- automation ----------
const AUTO_BUILD = { off: 'Off', balanced: 'Balanced', civ: 'Civilian', mil: 'Military' };
function autoBuild(c) {
  const mode = c.autoBuild || 'off'; if (mode === 'off' || c.queue.length >= 2) return; const B = c.budget; if (c.money < 0 && B.net < 0) return;
  const st = c.stats, lv = st.levels || 1, infraBad = heldBy(c.tag).filter(p => provLevels(p) > infraCap(p, c) + 1).sort((a, b) => provLevels(b) - infraCap(b, c) - provLevels(a) + infraCap(a, c))[0];
  const mil = () => { const need = c.milNeed; return (need.arms || 0) > 1 || !c.bt.arms ? 'arms' : (need.artillery || 0) > 0.5 ? 'artyf' : c.techs.m_tank1 && (need.tanks || 0) > 0.3 ? 'tankp' : pick(['aircraftp', 'arms', 'artyf', c.techs.m_tank1 ? 'tankp' : 'arms']); };
  let type = null, prov = null; const r = Math.random(), wantMil = mode === 'mil' ? 0.75 : mode === 'balanced' ? 0.3 : 0;
  if (infraBad && r < 0.2) { type = 'railway'; prov = infraBad.id; }
  else if (st.cpts < Math.max(5, lv * 0.06) && r < 0.35 && B.net > 0) type = 'construction';
  else if (st.bureau < st.pop / 2500 + lv / 12 + 3 && r < 0.45) type = 'admin';
  else if (Math.random() < wantMil) type = mil();
  else { const o = buildOptions(c)[0]; if (o) { type = o.type; prov = o.prov; } else if (mode !== 'civ') type = mil(); }
  if (!type) return; if (prov === null) { const p = bestProvFor(c, type); if (!p) return; prov = p.id; } queueBuild(c, type, prov);
}
function autoTrade(c) {
  if (!c.autoTrade || c.infl < 45) return; const cand = alive().filter(k => k.tag !== c.tag && DIPLO.trade.can(c.tag, k.tag) && DIPLO.trade.ai(c.tag, k.tag)).sort((a, b) => b.gdp - a.gdp)[0];
  if (cand && !diploAction('trade', c.tag, cand.tag) && c.tag === G.player) UIH.notify(`Auto-trade: agreement signed with ${cand.name}.`, 'good');
}
const tradePacts = t => G.pacts.reduce((n, p) => n + (p.t === 'trade' && (p.a === t || p.b === t) ? 1 : 0), 0);
function cancelTraining(c, i) { const t = c.training[i]; if (!t) return; c.manpower += UNITS[t.t].mp; c.training.splice(i, 1); }

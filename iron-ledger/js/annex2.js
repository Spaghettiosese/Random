// 2.0 Annexed territories: how land taken from a nation that no longer exists is governed, and how to give it back.
'use strict';
const ADMIN = {
  integrate: ['Integration', 'Full rights and investment. Low yield, little unrest; after five years the land becomes a core.', { tax: 0.3, unrest: -2, cores: true, pp: -0.4 }],
  civil: ['Civil Administration', 'Ordinary government by our officials.', { tax: 0.6, unrest: 0 }],
  colonial: ['Colonial Rule', 'Governors and a separate law for the natives. Higher taxes, growing resentment.', { tax: 0.9, unrest: 1.5, levy: 0.002 }],
  exploit: ['Exploitation', 'Requisitions, forced labour and deportations. The highest yield, fierce resistance and many deaths.', { tax: 1.3, unrest: 4, levy: 0.006, deaths: 0.0006 }]
};
// nations whose land we hold after annexing them
function annexedNations(c) { const by = {}; for (const p of G.P) if (p.owner === c.tag && p.orig && p.orig !== c.tag && !p.cores.includes(c.tag) && G.C[p.orig] && !G.C[p.orig].exists) (by[p.orig] = by[p.orig] || []).push(p); return by; }
const adminOf = (c, t) => (c.admin && c.admin[t]) || (c.ideology === 'fas' ? 'colonial' : 'civil');
function adminWeekly(c) { const by = annexedNations(c);
  for (const t in by) { const A = ADMIN[adminOf(c, t)][2], ps = by[t];
    for (const p of ps) { const g = armiesAt(p.id).some(a => a.owner === c.tag); p.unrest = clamp((p.unrest || 0) + A.unrest * (g ? 0.4 : 1) - (g ? 1 : 0), 0, 100);
      c.money += p.pop * 0.002 * A.tax; if (A.levy) c.manpower += p.pop * A.levy; if (A.deaths && typeof civDeath === 'function') civDeath(p, p.pop * A.deaths, null, 'occupation');
      if (A.cores) { p.integ = (p.integ || 0) + 1 / 260; if (p.integ >= 1 && !p.cores.includes(c.tag)) { p.cores.push(c.tag); if (c.tag === G.player) UIH.notify(`${p.name} is now fully integrated: a core of ${c.name}.`, 'good'); } } }
    if (A.pp) c.pp = Math.max(0, c.pp + A.pp * 0.1 * ps.length);
    // an uprising: when most of a nation's land is in revolt, it rises again
    const hot = ps.filter(p => (p.unrest || 0) > 85 && !armiesAt(p.id).some(a => a.owner === c.tag)); if (hot.length >= Math.max(2, ps.length * 0.4) && Math.random() < 0.25) { if (releaseCountry(t, c.tag)) { declareWar(t, c.tag, [{ by: t, vs: c.tag, type: 'take', provs: [] }], `${C(t).adj} Uprising`, true); logMsg(`${C(t).name} rises against ${c.name}!`, 'world', [c.tag, t]); } } }
}
{ const _mw = militaryWeekly; militaryWeekly = function (c) { _mw(c); if (c.exists && !c.capitulated) adminWeekly(c); }; }
// release: the whole nation, or only what is not ours by core; free, or as a subject of a chosen status; with a leader, ideology and laws
function releaseAnnexed(c, t, o) { // o: { status: 'free'|SUBJ_TYPE key, keep: 'none'|'cores'|'list', keepIds: [], ideo, leader, laws: preset ideology }
  const ps = annexedNations(c)[t] || []; if (!ps.length) return 'Nothing to release'; const keep = new Set(o.keep === 'cores' ? ps.filter(p => p.claims.includes(c.tag)).map(p => p.id) : o.keep === 'list' ? o.keepIds || [] : []);
  if (keep.size >= ps.length) return 'You would keep everything';
  for (const p of G.P) if (p.owner === c.tag && p.orig === t && !ps.includes(p)) keep.add(p.id); // cores of ours stay ours
  if (!releaseCountry(t, c.tag)) return 'They cannot be released'; const k = C(t);
  for (const id of keep) { const p = P(id); if (p.owner === t) { p.owner = c.tag; p.ctrl = c.tag; } } if (P(k.capital).owner !== t) { const r = provsOf(t).sort((a, b) => b.vp - a.vp)[0]; if (r) k.capital = r.id; }
  if (!provsOf(t).length) { eliminate(t); return 'Nothing was left to release'; }
  const ideo = o.ideo === 'ours' ? c.ideology : o.ideo || k.ideology; setIdeology(k, ideo, true); if (o.leader && o.leader.trim()) { k.leader = o.leader.trim().slice(0, 40); const rp = typeof rulingParty === 'function' && rulingParty(k); if (rp) rp.leader = k.leader; }
  if (o.laws && LAW_PRESET[o.laws]) { for (const cat in LAW_PRESET[o.laws]) if (!LAWS[cat] || !LAWS[cat].instant) k.laws[cat] = LAW_PRESET[o.laws][cat]; k._m = null; }
  if (o.status === 'free') { addRel(c.tag, t, 40); c.infamy = Math.max(0, c.infamy - 6); legacyAdd(c, 'liber', 10, `${k.name} is freed.`); }
  else { makeSubject(c.tag, t); k.stype = SUBJ_TYPE[o.status] ? o.status : 'puppet'; k.autonomy = Math.min(SUBJ_TYPE[k.stype].cap, k.stype === 'dominion' ? 70 : k.stype === 'protect' ? 60 : k.stype === 'rk' || k.stype === 'milgov' ? 0 : 30); if (k.stype === 'rk') k.name = regimeName(c, t, 'rk'); addRel(c.tag, t, 15); c.infamy = Math.max(0, c.infamy - 2); }
  logMsg(`${c.name} releases ${k.name}${o.status === 'free' ? ' as a free nation' : ` as a ${SUBJ_TYPE[k.stype].name.toLowerCase()}`}.`, 'world', [c.tag, t]); UIH.mapDirty(); return ''; }
// the AI: lets go of what it cannot hold
function aiAdmin(c) { const by = annexedNations(c); for (const t in by) { const ps = by[t], hot = ps.filter(p => (p.unrest || 0) > 70).length; if (c.ideology === 'dem' && ps.length >= 3 && Math.random() < 0.05) releaseAnnexed(c, t, { status: 'free', keep: 'cores' }); else if (hot > ps.length * 0.5 && Math.random() < 0.1) releaseAnnexed(c, t, { status: 'puppet', keep: 'cores', ideo: 'ours' }); } }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.ai && c.exists && !c.capitulated && !isAtWar(c.tag)) aiAdmin(c); }; }
// when the player annexes a nation, open the screen once
{ const _an = annex; annex = function (a, tag, peaceful) { _an(a, tag, peaceful); if (a === G.player && C(a) && !C(a).ai && !C(tag).exists && G.P.some(p => p.owner === a && p.orig === tag)) { G.annexOpen = tag; } }; }

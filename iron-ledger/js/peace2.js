// 2.0 Peace conference. When a war the player is winning ends, the clock stops and a conference opens.
// Each victor has points from its share of the fighting; the player spends them province by province (take it, give it to
// one of our occupation governments or to an ally, release a nation) and on terms for each defeated nation. AI victors
// first take the occupied land they claim. What is not assigned stays with the defeated.
'use strict';
const CONF_ACT = { keep: ['Leave it', 0], take: ['Annex', 1], regime: ['Our occupation government', 0.6], ally: ['Give to an ally', 0.4], release: ['Release the nation', 0.3] };
const CONF_TERMS = { none: ['No further terms', 0, 0], puppet: ['Puppet the remainder', 0.35, 10], collab: ['Collaboration government', 0.3, 8], zones: ['Occupation zones', 0.25, 5], demil: ['Demilitarise', 0, 6], repar: ['Reparations', 0, 6], regime: ['Regime change', 0, 8] };
const confCost = (p, act) => Math.round((p.vp + 1) * CONF_ACT[act][1] * 10) / 10;
function openConference(w, winSide) {
  const win = w[winSide].slice(), lose = (winSide === 'att' ? w.def : w.att).slice(), pl = G.player, part = w.part || {}, totPart = sum(win, t => part[t] || 0) || 1;
  const provs = G.P.filter(p => lose.includes(p.owner)).map(p => ({ id: p.id, owner: p.owner, ctrl: p.ctrl, act: 'keep', to: null }));
  const pool = sum(provs, x => P(x.id).vp + 1) + lose.length * 10, share = Math.max(0.15, (part[pl] || 0) / totPart || (G.P.filter(p => lose.includes(p.owner) && p.ctrl === pl).length / Math.max(1, provs.length)));
  // AI victors first take what they hold and claim
  for (const x of provs) { const p = P(x.id); if (x.ctrl !== pl && win.includes(x.ctrl) && C(x.ctrl).ai && (p.claims.includes(x.ctrl) || p.cores.includes(x.ctrl))) { x.act = 'ai'; x.to = x.ctrl; } }
  G.conf = { wid: w.id, winSide, win, lose, provs, points: Math.round(pool * Math.min(1, share * 1.15)), terms: Object.fromEntries(lose.map(t => [t, 'none'])) };
  G.paused = true; logMsg(`A peace conference opens to end the ${w.name}.`, 'world');
}
function confSpent(cf) { let s = 0; for (const x of cf.provs) if (CONF_ACT[x.act]) s += confCost(P(x.id), x.act); for (const t in cf.terms) { const T = CONF_TERMS[cf.terms[t]]; if (!T || !C(t)) continue; const rest = cf.provs.filter(x => x.owner === t && x.act === 'keep'); s += T[2] + T[1] * sum(rest, x => P(x.id).vp + 1); } return Math.round(s * 10) / 10; }
function concludeConference() {
  const cf = G.conf; if (!cf) return; const w = G.wars.find(x => x.id === cf.wid), pl = C(G.player); if (confSpent(cf) > cf.points + 0.01) return 'You have spent more points than you have';
  for (const x of cf.provs) { const p = P(x.id); if (!cf.lose.includes(p.owner)) continue;
    if (x.act === 'ai' || x.act === 'ally') { if (x.to && C(x.to).exists) transferProv(p, x.to); }
    else if (x.act === 'take') { transferProv(p, pl.tag); pl.infamy += 0.5 + p.vp * 0.1; }
    else if (x.act === 'regime') { const g = pl.regimes && pl.regimes[p.owner] && C(pl.regimes[p.owner].tag); if (g && g.exists) { p.owner = g.tag; p.ctrl = g.tag; if (g.stype === 'collab' && !p.cores.includes(g.tag)) p.cores.push(g.tag); } }
    else if (x.act === 'release') { const t = p.orig !== p.owner && G.C[p.orig] && !G.C[p.orig].exists ? p.orig : null; if (t) { if (!releaseCountry(t, p.owner)) transferProv(p, pl.tag); else { makeSubject(pl.tag, t); C(t).autonomy = 50; } } } }
  const terms = cf.terms; G.conf = null; G.confTerms = terms;
  if (w) { w.goals = (w.goals || []).filter(g => C(g.by).ai); peace(w, cf.winSide); }
  for (const L of cf.lose) if (C(L).exists && !provsOf(L).length) eliminate(L);
  G.confTerms = null; restoreControl(); claimCache(); UIH.mapDirty(); G.paused = false; return '';
}
// peace() asks: hold a conference first if the player is among the victors
{ const _pe = peace; peace = function (w, winSide) { const pl = C(G.player);
  if (!G.confTerms && pl && !pl.ai && pl.exists && w[winSide].includes(pl.tag) && !w.civil) {
    if (G.conf && G.conf.wid === w.id) return; openConference(w, winSide); return; }
  // the player's terms replace the old one-question dialog
  const _pp = UIH.popup; if (G.confTerms) UIH.popup = p => { const L = (w[winSide === 'att' ? 'def' : 'att'] || []).find(t => p.title === `Peace with ${cname(t)}`); if (!L) return _pp(p);
    const t = G.confTerms[L] || 'none', o = p.options, f = n => (o.find(x => x.name.startsWith(n)) || o[o.length - 1]).fn;
    const fn = t === 'puppet' ? f('Install a subject government') : t === 'collab' ? f('Install a collaboration government') : t === 'zones' ? f('Divide it into occupation zones') : t === 'regime' ? f('Change the regime') : t === 'repar' ? f('War reparations') : t === 'demil' ? f('Demilitarise') : f('A lenient peace'); if (fn) fn(); };
  try { _pe(w, winSide); } finally { UIH.popup = _pp; } }; }
// while the conference sits, the war does not move
function installConfPause() { if (installConfPause.done) return; installConfPause.done = true; const _ht = hourTick; hourTick = function () { if (G && G.conf) return; _ht(); }; }
if (typeof hourTick === 'function') installConfPause(); else document.addEventListener('DOMContentLoaded', installConfPause);
{ const _cw = checkWarEnd; checkWarEnd = function (w) { if (G.conf && G.conf.wid === w.id) return; _cw(w); }; }

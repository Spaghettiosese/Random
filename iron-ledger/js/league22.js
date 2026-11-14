// 2.2 The League of Nations. Members meet every three months in Geneva. Each session considers the wars of the day:
// whether to condemn an aggressor, and whether to impose sanctions (members who vote for them embargo the aggressor).
// The League's authority rises when sanctions end a war and falls when aggressors ignore it, when great powers leave
// and when members are swallowed; below 10 it collapses. Members enjoy a little collective security while it lasts.
'use strict';
const LG_OUT = ['USA', 'GER', 'JAP', 'BRA', 'COS', 'SAU', 'YEM', 'MAN', 'PRC', 'TIB', 'NEP', 'SIK', 'GXC', 'YUN', 'SHX', 'XSM', 'SIC', 'MON'];
const LG_LEFT = { ITA: 1374, HUN: 1200, SPA: 1200, ROM: 1650 }; // historical departures (game day), AI only
SPIRITS.collective_security = ['Collective Security', 'The League stands behind its members.', { def: 0.02, stab: 1 }];
SPIRITS.lg_sanctions = ['League Sanctions', 'Most of the world will not trade with us.', { tradecap: -0.08, infl: -0.1 }];
const league = () => G.league || (G.league = { members: Object.keys(G.C).filter(t => G.C[t].exists && !LG_OUT.includes(t) && !/\d$/.test(t) && !G.C[t].overlord), auth: 55, next: 75, agenda: [], history: [], sanctions: {}, dead: false });
const lgMember = t => !league().dead && league().members.includes(t);
const lgWeight = t => C(t) && C(t).major ? 3 : 1;
function lgAgenda() { const L = league(), items = [];
  for (const w of G.wars) { if (w.civil) continue; const ag = w.att[0], vic = w.def[0]; if (!ok(ag) || !ok(vic) || !lgMember(vic) || L.sanctions[ag]) continue; if (L.history.some(h => h.ag === ag && h.vic === vic && G.day - h.day < 360)) continue;
    items.push({ ag, vic, war: w.id }); }
  return items.slice(0, 3); }
function lgVote(t, it) { const k = C(t); if (!k || !k.exists) return 0; if (t === it.ag || friendly(t, it.ag) || k.overlord === it.ag) return -1; if (t === it.vic || friendly(t, it.vic)) return 1;
  const s = (opinion(t, it.vic) - opinion(t, it.ag)) / 60 + (k.ideology === 'dem' ? 0.3 : 0) - (k.ideology === C(it.ag).ideology ? 0.4 : 0) - (hasSpirit(k, 'appeasement') ? 0.4 : 0) - (C(it.ag).major && !k.major ? 0.25 : 0);
  return s > 0.15 ? 1 : s < -0.25 ? -1 : 0; }
function lgSession() { const L = league(); if (L.dead) return; L.next = G.day + 90; L.agenda = lgAgenda(); const pl = G.player;
  for (const it of L.agenda) { let yes = 0, no = 0; it.votes = {};
    for (const t of L.members) { if (!ok(t)) continue; const v = t === pl && !C(pl).ai && L.myVote && L.myVote[it.ag] !== undefined ? L.myVote[it.ag] : lgVote(t, it); it.votes[t] = v; if (v > 0) yes += lgWeight(t); else if (v < 0) no += lgWeight(t); }
    it.pass = yes > no * 1.2 && yes >= 6; L.history.push({ day: G.day, ag: it.ag, vic: it.vic, pass: it.pass, yes, no }); if (L.history.length > 30) L.history.shift();
    if (it.pass) { L.sanctions[it.ag] = { since: G.day, war: it.war }; C(it.ag).infamy += 5; for (const t in it.votes) if (it.votes[t] > 0 && ok(t) && t !== it.ag) setEmbargo(C(t), it.ag, true, true);
      logMsg(`The League of Nations condemns ${cname(it.ag)} for its attack on ${cname(it.vic)} and votes sanctions (${yes} to ${no}).`, 'world', [it.ag, it.vic]);
      if (lgMember(it.ag) && C(it.ag).ai && (C(it.ag).ideology !== 'dem' || Math.random() < 0.3)) lgLeave(it.ag, 'in protest at the sanctions'); }
    else logMsg(`The League of Nations debates ${cname(it.ag)}'s attack on ${cname(it.vic)} but takes no action (${yes} to ${no}).`, 'world', [it.ag, it.vic]); }
  L.myVote = {};
  // sanctions that worked, and sanctions that did not
  for (const ag of Object.keys(L.sanctions)) { const s = L.sanctions[ag], w = G.wars.find(x => x.id === s.war);
    if (!w || !ok(ag)) { L.auth = Math.min(100, L.auth + (w ? 0 : 6)); delete L.sanctions[ag]; for (const k of alive()) if (embargoing(k, ag)) setEmbargo(k, ag, false); logMsg(`The League lifts its sanctions on ${cname(ag)}.`, 'info', [ag]); continue; }
    if (G.day - s.since > 170) L.auth = Math.max(0, L.auth - 4); }
  if (L.agenda.some(it => !it.pass && C(it.vic) && C(it.vic).exists)) L.auth = Math.max(0, L.auth - 3);
  if (L.auth < 10) { L.dead = true; for (const ag in L.sanctions) for (const k of alive()) if (embargoing(k, ag)) setEmbargo(k, ag, false); L.sanctions = {}; logMsg('The League of Nations has failed. Its palace in Geneva stands empty.', 'world'); } }
function lgLeave(t, why) { const L = league(); if (!lgMember(t)) return; L.members = L.members.filter(x => x !== t); L.auth = Math.max(0, L.auth - (C(t).major ? 6 : 2)); logMsg(`${cname(t)} leaves the League of Nations${why ? ' ' + why : ''}.`, 'world', [t]); }
function lgJoin(t) { const L = league(); if (L.dead || lgMember(t)) return 'Not possible'; if (L.sanctions[t]) return 'Not while under its sanctions'; L.members.push(t); L.auth = Math.min(100, L.auth + (C(t).major ? 5 : 1)); logMsg(`${cname(t)} joins the League of Nations.`, 'world', [t]); return ''; }
function lgRaise(c, ag) { const L = league(); if (!lgMember(c.tag)) return 'Only members can raise a question'; if (c.infl < 20) return 'Needs 20 influence'; const w = G.wars.find(x => x.att[0] === ag && !x.civil); if (!w) return 'They are not waging an aggressive war'; c.infl -= 20; L.raised = { ag, vic: w.def[0], war: w.id }; L.next = Math.min(L.next, G.day + 14); return ''; }
{ const _a = lgAgenda; lgAgenda = function () { const items = _a(), L = league(); if (L.raised && !items.some(i => i.ag === L.raised.ag)) items.unshift(L.raised); L.raised = null; return items; }; }
function lgMonthly() { const L = league(); if (L.dead) { for (const c of alive()) removeSpirit(c, 'collective_security'); return; }
  L.members = L.members.filter(ok); if (G.day >= L.next) lgSession();
  for (const c of alive()) { removeSpirit(c, 'collective_security'); removeSpirit(c, 'lg_sanctions'); if (lgMember(c.tag) && !c.major && L.auth >= 40) addSpirit(c, 'collective_security'); if (L.sanctions[c.tag]) addSpirit(c, 'lg_sanctions'); }
  for (const c of alive()) { if (!c.ai || !lgMember(c.tag)) continue; if (G.historical && LG_LEFT[c.tag] && G.day >= LG_LEFT[c.tag] && c.ideology !== 'dem') { lgLeave(c.tag); continue; }
    if ((c.ideology === 'fas' && G.tension > 60 && Math.random() < 0.05) || (c.major && c.ideology !== 'dem' && L.auth < 20 && Math.random() < 0.05)) lgLeave(c.tag); }
  if (G.historical && ok('SOV') && lgMember('SOV') && G.wars.some(w => w.att[0] === 'SOV' && w.def[0] === 'FIN')) { lgLeave('SOV', '— expelled for its attack on Finland'); } }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); lgMonthly(); }; }

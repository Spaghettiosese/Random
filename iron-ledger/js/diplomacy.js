// Diplomacy: relations, pacts, factions, diplomatic plays, wars, capitulation and peace.
'use strict';
// ---------- relations & pacts ----------
function initDiplomacy() { for (const a of alive()) for (const b of alive()) if (a !== b) a.rel[b.tag] = 0; }
function recalcRelations() { }
function addRel(a, b, v) { if (!G.C[a] || !G.C[b] || a === b) return; C(a).rel[b] = clamp((C(a).rel[b] || 0) + v, -100, 100); C(b).rel[a] = clamp((C(b).rel[a] || 0) + v, -100, 100); }
const IDEO_REL = { dem: { dem: 15, fas: -25, com: -15, aut: 0 }, fas: { dem: -25, fas: 15, com: -40, aut: 5 }, com: { dem: -15, fas: -40, com: 25, aut: -10 }, aut: { dem: 0, fas: 5, com: -10, aut: 5 } };
function opinion(a, b) { // how a sees b
  const A = C(a), B = C(b); if (!A || !B) return 0; let o = (A.rel[b] || 0) + IDEO_REL[A.ideology][B.ideology] - B.infamy * 0.6;
  if (hasPact('ally', a, b)) o += 35; if (hasPact('nap', a, b)) o += 12; if (hasPact('trade', a, b)) o += 10; if (hasPact('guar', b, a)) o += 20;
  const fa = factionOf(a), fb = factionOf(b); if (fa && fa === fb) o += 40; if (A.overlord === b || B.overlord === a) o += 30;
  if (atWar(a, b)) o -= 100; if (A._claims && A._claims[b]) o -= 20; if (B._claims && B._claims[a]) o -= 35;
  return clamp(o, -200, 200);
}
function claimCache() { for (const c of alive()) c._claims = {}; for (const p of G.P) { for (const t of p.claims) if (t !== p.owner && G.C[t]) (C(t)._claims || (C(t)._claims = {}))[p.owner] = 1; for (const t of p.cores) if (t !== p.owner && G.C[t] && C(t).exists) (C(t)._claims || (C(t)._claims = {}))[p.owner] = 1; } }
function hasPact(t, a, b) { return G.pacts.some(p => p.t === t && ((p.a === a && p.b === b) || (t !== 'guar' && p.a === b && p.b === a))); }
function addPact(t, a, b, days) { if (a === b || hasPact(t, a, b)) return; G.pacts.push({ t, a, b, until: days ? G.day + days : 0 }); if (t !== 'truce') addRel(a, b, t === 'ally' ? 20 : 8);
  const nm = { ally: 'sign an alliance', nap: 'sign a non-aggression pact', trade: 'sign a trade agreement', access: 'agree on military access' }[t]; if (nm) logMsg(`${cname(a)} and ${cname(b)} ${nm}.`, (C(a).major && C(b).major) ? 'world' : 'info', [a, b]); if (t === 'guar') logMsg(`${cname(a)} guarantees the independence of ${cname(b)}.`, C(a).major ? 'world' : 'info', [a, b]); }
function removePact(t, a, b) { G.pacts = G.pacts.filter(p => !(p.t === t && ((p.a === a && p.b === b) || (p.a === b && p.b === a)))); }
function dropPacts(a, b) { G.pacts = G.pacts.filter(p => !((p.a === a && p.b === b) || (p.a === b && p.b === a))); }
// ---------- factions ----------
const factionOf = t => { const c = C(t); const key = c && c.overlord && C(c.overlord).exists ? c.overlord : t; return G.factions.find(f => f.members.includes(key)) || null; };
function createFaction(leader, name) { if (factionOf(leader)) { factionOf(leader).name = name; return; } G.factions.push({ name, leader, members: [leader] }); logMsg(`${cname(leader)} founds the ${name}.`, 'world'); }
function joinFaction(t, leaderOrMember) {
  const f = factionOf(leaderOrMember); if (!f || f.members.includes(t)) return false; const old = factionOf(t); if (old) leaveFaction(t);
  if (f.members.some(m => atWar(m, t))) return false; f.members.push(t); logMsg(`${cname(t)} joins the ${f.name}.`, 'world');
  for (const w of G.wars) { const side = w.att.includes(f.leader) ? 'att' : w.def.includes(f.leader) ? 'def' : null; if (side && !w.att.includes(t) && !w.def.includes(t)) joinWar(w, t, side); }
  for (const w of G.wars.slice()) { const side = w.att.includes(t) ? 'att' : w.def.includes(t) ? 'def' : null; if (side) for (const m of f.members) if (!w.att.includes(m) && !w.def.includes(m) && !C(m).capitulated) joinWar(w, m, side); }
  return true;
}
function leaveFaction(t) { for (const f of G.factions) { f.members = f.members.filter(m => m !== t); if (f.leader === t && f.members.length) f.leader = f.members.slice().sort((a, b) => C(b).gdp - C(a).gdp)[0]; } G.factions = G.factions.filter(f => f.members.length); }
// ---------- war state ----------
function warCache() { const m = G._wc = {}; G._ws = {}; for (const w of G.wars) { for (const a of w.att) for (const d of w.def) { m[a + '|' + d] = m[d + '|' + a] = 1; }
    for (const s of [w.att, w.def]) for (const a of s) for (const b of s) if (a !== b) G._ws[a + '|' + b] = 1; } }
const atWar = (a, b) => { if (!G._wc) warCache(); return !!G._wc[a + '|' + b]; };
const isAtWar = t => G.wars.some(w => w.att.includes(t) || w.def.includes(t));
const enemiesOf = t => { const s = new Set(); for (const w of G.wars) { if (w.att.includes(t)) w.def.forEach(x => s.add(x)); else if (w.def.includes(t)) w.att.forEach(x => s.add(x)); } return [...s].filter(x => C(x).exists); };
function friendly(a, b) {
  if (a === b) return false; if (!G._wc) warCache(); if (G._wc[a + '|' + b]) return false; if (G._ws[a + '|' + b]) return true;
  const A = C(a), B = C(b); if (!A || !B) return false; const oa = A.overlord || a, ob = B.overlord || b; if (oa === ob) return true;
  const f = G.factions.find(x => x.members.includes(oa)); return !!f && f.members.includes(ob);
}
function joinWar(w, t, side) {
  const c = C(t); if (!c || !c.exists || w.att.includes(t) || w.def.includes(t)) return; const other = side === 'att' ? w.def : w.att;
  if (w[side].some(m => atWar(m, t))) return; w[side].push(t); G._wc = null; for (const o of other) dropPacts(t, o);
  if (!w.civil && !w.ww && w.att.some(t => C(t).major) && w.def.some(t => C(t).major) && w.att.length + w.def.length > 6) { w.ww = true; w.name = 'Second World War'; logMsg('The conflict has become a world war.', 'world'); }
  logMsg(`${c.name} joins the ${w.name} ${side === 'att' ? 'against ' + cname(w.def[0]) : 'against ' + cname(w.att[0])}.`, c.major ? 'world' : 'info', [t]);
  for (const s of alive()) if (s.overlord === t) joinWar(w, s.tag, side);
  repatriate(); UIH.mapDirty();
}
function declareWar(a, b, goals, name, noCall) {
  if (!ok(a) || !ok(b) || a === b || atWar(a, b)) return null; const A = C(a), B = C(b);
  if (B.overlord && B.overlord !== a && C(B.overlord).exists && !noCall) { const o = B.overlord; goals = goals.map(g => g.vs === b && g.type === 'conquer' ? g : g); return declareWarInner(a, o, goals, name, noCall, b); }
  return declareWarInner(a, b, goals, name, noCall, b);
}
function declareWarInner(a, b, goals, name, noCall, realTarget) {
  if (atWar(a, b)) return null; const A = C(a), B = C(b);
  if (A.overlord === b) A.overlord = null; if (B.overlord === a) B.overlord = null;
  const fa = factionOf(a), fb = factionOf(b); if (fa && fa === fb) leaveFaction(fa.leader === a ? b : a);
  dropPacts(a, b); G.pacts = G.pacts.filter(p => !(p.t === 'truce' && ((p.a === a && p.b === b) || (p.a === b && p.b === a))));
  let w = null, side = null;
  for (const x of G.wars) { const s = x.att.includes(a) ? 'att' : x.def.includes(a) ? 'def' : null; if (!s || x.civil) continue; const opp = s === 'att' ? x.def : x.att; if (!x.att.includes(b) && !x.def.includes(b) && !opp.some(m => atWar(b, m))) { w = x; side = s === 'att' ? 'def' : 'att'; break; } }
  A.infamy += (B.major ? 12 : 6) * (1 + M(A, 'infamy')); G.tension = clamp(G.tension + (noCall && A.civilOf ? 2 : (B.major ? 6 : 2) + (A.major ? 1 : 0)), 0, 100);
  if (w) { w.goals.push(...goals); logMsg(`${A.name} declares war on ${B.name}!`, 'world'); joinWar(w, b, side); }
  else { w = { id: G.nid++, name: name || `${A.adj}–${B.adj} War`, att: [a], def: [b], goals, start: G.day }; G.wars.push(w); G._wc = null; logMsg(`${A.name} declares war on ${B.name}!`, 'world');
    for (const s of alive()) { if (s.overlord === a) joinWar(w, s.tag, 'att'); if (s.overlord === b) joinWar(w, s.tag, 'def'); } }
  A.ws = Math.min(100, A.ws + 5); B.ws = Math.min(100, B.ws + 20);
  if (!noCall) { const side2 = w.att.includes(b) ? 'att' : 'def', sideA = side2 === 'att' ? 'def' : 'att';
    if (fb) for (const m of fb.members.slice()) if (m !== b) joinWar(w, m, side2);
    for (const p of G.pacts.slice()) { if (p.t === 'guar' && (p.b === b || p.b === realTarget) && p.a !== a && !friendly(p.a, a)) callAlly(w, p.a, side2, b); if (p.t === 'ally' && (p.a === b || p.b === b)) { const o = p.a === b ? p.b : p.a; if (o !== a) callAlly(w, o, side2, b); } }
    if (fa) for (const m of fa.members.slice()) if (m !== a && !atWar(m, a)) joinWar(w, m, sideA);
  }
  G._wc = null; repatriate(); UIH.mapDirty(); return w;
}
function callAlly(w, t, side, forWhom) {
  const c = C(t); if (!c.exists || w.att.includes(t) || w.def.includes(t)) return; const opp = side === 'att' ? w.def : w.att; if (opp.some(m => friendly(m, t))) return;
  if (hasSpirit(c, 'isolationism') || hasSpirit(c, 'armed_neutrality')) { logMsg(`${c.name} stays out of the war despite its commitments.`, 'info', [t]); return; }
  const join = () => { joinWar(w, t, side); const f = factionOf(t); if (f) for (const m of f.members.slice()) joinWar(w, m, side); };
  if (t === G.player && !c.ai) UIH.popup({ title: 'A Call to Arms', icon: '📯', desc: `${cname(forWhom)} has been attacked and invokes our pledge. Will ${c.name} honour its word and join the ${w.name}?`, options: [{ name: 'We stand by our word.', fn: join }, { name: 'This is not our war.', tip: 'Stability -8, relations suffer.', fn: () => { c.stab = Math.max(0, c.stab - 8); addRel(t, forWhom, -40); dropPacts(t, forWhom); } }] });
  else join();
}
function repatriate() {
  for (const id in G.armies) { const a = G.armies[id], p = P(a.loc), c = C(a.owner); if (p.ctrl === a.owner || friendly(a.owner, p.ctrl) || atWar(a.owner, p.ctrl) || hasPact('access', a.owner, p.ctrl)) continue;
    const home = P(c.capital).ctrl === a.owner ? c.capital : (heldBy(a.owner)[0] || {}).id; if (home === undefined) { removeArmy(a); continue; } a.loc = home; a.path = []; a.prog = 0; if (a.battle) leaveBattle(a); }
}
// ---------- territory ----------
function transferProv(p, tag) {
  const old = p.owner; if (old === tag) { p.ctrl = atWar(tag, p.ctrl) ? p.ctrl : tag; return; } p.owner = tag; if (!atWar(tag, p.ctrl)) p.ctrl = tag; p.claims = p.claims.filter(t => t !== tag);
  const o = C(old); if (o && o.exists) { if (o.capital === p.id) { const rest = provsOf(old).sort((a, b) => b.vp - a.vp); if (rest.length) o.capital = rest[0].id; } if (!provsOf(old).length) eliminate(old, tag); }
  const n = C(tag); if (n && !n.exists) { n.exists = true; n.capital = p.id; }
  G._cl = null; UIH.mapDirty();
}
function eliminate(tag, by) {
  const c = C(tag); if (!c.exists) return; c.exists = false; c.capitulated = false; for (const a of armiesOf(tag)) removeArmy(a);
  leaveFaction(tag); G.pacts = G.pacts.filter(p => p.a !== tag && p.b !== tag); G.plays = G.plays.filter(p => p.a !== tag && p.b !== tag);
  for (const w of G.wars) { w.att = w.att.filter(t => t !== tag); w.def = w.def.filter(t => t !== tag); }
  for (const s of alive()) if (s.overlord === tag) s.overlord = by && C(by).exists ? by : null;
  G._wc = null; for (const w of G.wars.slice()) checkWarEnd(w);
  if (tag === G.player) UIH.popup({ title: 'The End', icon: '🏴', desc: `${c.name} is no more. History will be written by others.<br><br>You may keep watching the world or start a new game.`, options: [{ name: 'So it goes.' }] });
}
function annex(a, tag, peaceful) {
  const c = C(tag), A = C(a); if (!c.exists) return; const cap = c.capital;
  for (const g of MIL_GOODS.concat('autos')) A.stock[g] += (c.stock[g] || 0) * 0.6; A.money += Math.max(0, c.money) * 0.5;
  if (peaceful) for (const ar of armiesOf(tag)) { ar.owner = a; ar.gen = null; ar.name = ar.name.replace(c.adj, A.adj + ' (' + c.adj + ')'); for (const d of ar.divs) d.org = 0.3; }
  for (const p of provsOf(tag)) { p.owner = a; if (p.ctrl === tag || !atWar(a, p.ctrl)) p.ctrl = a; }
  eliminate(tag, a); logMsg(`${A.name} annexes ${c.name}.`, 'world'); G.tension = clamp(G.tension + (peaceful ? 3 : 1), 0, 100); UIH.mapDirty();
}
function makeSubject(a, t) {
  const c = C(t); if (!c.exists || a === t) return; leaveFaction(t); c.overlord = a; dropPacts(a, t); c.capitulated = false;
  for (const w of G.wars) { w.att = w.att.filter(x => x !== t); w.def = w.def.filter(x => x !== t); } G._wc = null;
  for (const w of G.wars) { const s = w.att.includes(a) ? 'att' : w.def.includes(a) ? 'def' : null; if (s) joinWar(w, t, s); }
  logMsg(`${c.name} becomes a subject of ${cname(a)}.`, 'world'); repatriate();
}
function releaseCountry(tag, from) {
  const c = C(tag); if (!c || c.exists) return false; const ps = G.P.filter(p => p.owner === from && p.orig === tag); if (!ps.length) return false;
  c.exists = true; c.capitulated = false; c.overlord = null; c.capital = (ps.find(p => p.id === PNAME[COUNTRY_DEF[tag].cap]) || ps.sort((a, b) => b.vp - a.vp)[0]).id; c.money = 0; c.queue = []; c.pq = []; c.training = []; c.warExh = 0; c.stab = 55; c.infamy = 0;
  for (const p of ps) { p.owner = tag; p.ctrl = tag; } for (const o of alive()) { c.rel[o.tag] = 0; o.rel[tag] = 0; }
  spawnDivisions(c, 'inf', Math.max(2, Math.round(sum(ps, p => p.pop) / 3000)), c.capital, 0.6); logMsg(`${c.name} is restored as an independent state.`, 'world'); UIH.mapDirty(); return true;
}
// ---------- capitulation & peace ----------
function checkCapitulation(tag) {
  const c = C(tag); if (!c || !c.exists || c.capitulated || !isAtWar(tag)) return; let tot = 0, lost = 0;
  for (const p of G.P) if (p.owner === tag && p.cores.includes(tag)) { tot += p.vp; if (p.ctrl !== tag && atWar(tag, p.ctrl)) lost += p.vp; }
  if (!tot) { for (const p of G.P) if (p.owner === tag) { tot += p.vp; if (p.ctrl !== tag && atWar(tag, p.ctrl)) lost += p.vp; } }
  const lim = clamp(0.58 + (c.ws - 50) / 220 + (c.major ? 0.08 : 0) + M(c, 'caplimit') + (c.civilOf || G.wars.some(w => w.civil && (w.att.includes(tag) || w.def.includes(tag))) ? 0.15 : 0), 0.4, 0.92), capLost = atWar(tag, P(c.capital).ctrl);
  if (lost / tot >= lim || (capLost && lost / tot >= lim * 0.85)) capitulate(tag);
}
function capitulate(tag) {
  const c = C(tag); c.capitulated = true; const occ = {}; for (const p of G.P) if (p.owner === tag && p.ctrl !== tag) occ[p.ctrl] = (occ[p.ctrl] || 0) + p.vp;
  const top = Object.keys(occ).sort((a, b) => occ[b] - occ[a])[0]; for (const a of armiesOf(tag)) removeArmy(a); c.training = [];
  const patron = alive().find(o => o.tag !== tag && !o.capitulated && o.major && G._ws[tag + '|' + o.tag]);
  for (const p of G.P) if (p.ctrl === tag) { if (p.cores.includes(tag) || !patron) { if (top) p.ctrl = top; } else p.ctrl = patron.tag; }
  logMsg(`${c.name} capitulates!`, 'world'); G.tension = clamp(G.tension + (c.major ? 4 : 1), 0, 100); UIH.mapDirty();
  for (const w of G.wars.slice()) checkWarEnd(w);
}
function checkWarEnd(w) {
  if (!G.wars.includes(w)) return; const live = s => s.filter(t => C(t).exists && !C(t).capitulated);
  w.att = w.att.filter(t => C(t).exists); w.def = w.def.filter(t => C(t).exists);
  if (!w.att.length || !w.def.length) { G.wars.splice(G.wars.indexOf(w), 1); G._wc = null; restoreControl(); return; }
  if (!live(w.def).length) peace(w, 'att'); else if (!live(w.att).length) peace(w, 'def');
}
function restoreControl() { warCache(); for (const p of G.P) if (p.ctrl !== p.owner && !atWar(p.ctrl, p.owner)) p.ctrl = p.owner; repatriate(); UIH.mapDirty(); }
function whitePeace(w) { logMsg(`The ${w.name} ends in a white peace.`, 'world'); for (const a of w.att) for (const d of w.def) addPact('truce', a, d, 720); G.wars.splice(G.wars.indexOf(w), 1); for (const t of w.att.concat(w.def)) C(t).capitulated = false; G._wc = null; restoreControl(); }
function peace(w, winSide) {
  const win = w[winSide].slice(), lose = (winSide === 'att' ? w.def : w.att).slice(); G.wars.splice(G.wars.indexOf(w), 1); G._wc = null; warCache();
  logMsg(`The ${w.name} is over. ${win.slice(0, 3).map(cname).join(', ')} ${win.length > 1 ? 'are' : 'is'} victorious.`, 'world');
  const leader = win.filter(t => !C(t).capitulated).sort((a, b) => countryStr(b) - countryStr(a))[0] || win[0];
  for (const L of lose) { const c = C(L); if (!c.exists) continue; const occ = {}; for (const p of G.P) if (p.owner === L && win.includes(p.ctrl)) occ[p.ctrl] = (occ[p.ctrl] || 0) + p.vp;
    const top = Object.keys(occ).filter(t => !C(t).capitulated).sort((a, b) => occ[b] - occ[a])[0] || leader; let gone = false;
    for (const g of w.goals) { if (g.vs !== L || !win.includes(g.by) || !C(g.by).exists) continue; if (g.type === 'take') g.provs.forEach(id => P(id).owner === L && transferProv(P(id), g.by)); if (g.type === 'annex' && c.exists) { annex(g.by, L); gone = true; } if (g.type === 'puppet' && c.exists) { makeSubject(g.by, L); setIdeology(c, C(g.by).ideology, true); gone = true; } if (g.type === 'regime' && c.exists) setIdeology(c, C(g.by).ideology, true); }
    if (!c.exists) continue;
    // cores and claims of the victors, restoration of conquered nations
    for (const p of provsOf(L)) { if (p.cores.includes(L) && p.orig === L && !win.some(t => p.claims.includes(t))) continue;
      const o = p.orig; if (o !== L && G.C[o] && p.cores.includes(o)) { if (C(o).exists && (win.includes(o) || !atWar(o, leader))) { transferProv(p, o); continue; } if (!C(o).exists && !o.match(/\d$/)) { releaseCountry(o, L); continue; } }
      const cl = win.find(t => C(t).exists && (p.cores.includes(t) || p.claims.includes(t))); if (cl) transferProv(p, cl); }
    if (!c.exists || gone) continue; c.capitulated = false;
    const fate = ch => { if (!c.exists) return; if (ch === 'annex') annex(top, L); else if (ch === 'puppet') { makeSubject(top, L); setIdeology(c, C(top).ideology, true); } else if (ch === 'regime') { setIdeology(c, C(top).ideology, true); addRel(top, L, 30); } c.stab = Math.max(c.stab, 35); c.warExh = 0; restoreControl(); };
    const T = C(top), frac = (occ[top] || 0) / Math.max(1, sum(provsOf(L), p => p.vp)), limited = w.goals.some(g => g.by === top && g.vs === L) && !w.goals.some(g => g.by === top && g.vs === L && g.type !== 'take'), def = w.civil ? 'annex' : frac < 0.3 || (limited && frac < 0.85) ? 'lenient' : T.ideology === 'fas' ? (c.major || provsOf(L).length > 12 ? 'puppet' : 'annex') : T.ideology === 'com' ? 'puppet' : c.ideology !== T.ideology ? 'regime' : 'lenient';
    if (top === G.player && !T.ai && !w.civil) UIH.popup({ title: `Peace with ${c.name}`, icon: '🕊️', desc: `${c.name} lies defeated. Our claims and the claims of our allies have been settled. What shall become of what remains?`, options: [
      { name: 'Annex the country outright', tip: 'Infamy +' + (c.major ? 30 : 12), fn: () => { T.infamy += c.major ? 30 : 12; fate('annex'); } }, { name: 'Install a subject government', tip: 'Infamy +' + (c.major ? 12 : 5), fn: () => { T.infamy += c.major ? 12 : 5; fate('puppet'); } },
      { name: 'Change the regime and withdraw', fn: () => fate('regime') }, { name: 'A lenient peace', tip: 'Relations +20', fn: () => { addRel(top, L, 20); fate('lenient'); } }] });
    else { if (def === 'annex') T.infamy += 8; fate(def); }
  }
  for (const t of win.concat(lose)) { const c = C(t); if (c.exists) { c.capitulated = false; c.warExh *= 0.4; } } for (const a of win) for (const d of lose) if (C(a).exists && C(d).exists) addPact('truce', a, d, 900);
  G.tension = Math.max(0, G.tension - 10); restoreControl(); claimCache();
}
function warScore(w) { let a = 0, d = 0, ta = 0, td = 0; for (const p of G.P) { if (w.def.includes(p.owner)) { td += p.vp; if (w.att.includes(p.ctrl)) a += p.vp; } else if (w.att.includes(p.owner)) { ta += p.vp; if (w.def.includes(p.ctrl)) d += p.vp; } } return { att: a / Math.max(1, td), def: d / Math.max(1, ta) }; }
// ---------- diplomatic plays ----------
const GOAL_TXT = g => ({ take: 'cede ' + (g.provs || []).map(i => P(i).name).join(', '), annex: 'submit to annexation', puppet: 'become a subject', regime: 'change its government', conquer: 'surrender' })[g.type];
function startPlay(a, b, goal, opt = {}) {
  if (!ok(a) || !ok(b) || atWar(a, b) || C(a).overlord || friendly(a, b) || G.plays.some(p => p.a === a && p.b === b)) return null; if (goal.type === 'take' && !goal.provs.length) return null;
  if (hasPact('truce', a, b)) G.pacts = G.pacts.filter(p => !(p.t === 'truce' && ((p.a === a && p.b === b) || (p.a === b && p.b === a))));
  const pl = { id: G.nid++, a, b, goal, day: G.day, dur: opt.days || 35, A: [a], B: [b], force: opt.force || null, noBack: (opt.noBack || []).concat(G.historical ? opt.noBackHist || [] : []) }; G.plays.push(pl);
  const size = goal.type === 'take' ? sum(goal.provs, i => P(i).claims.includes(a) || P(i).cores.includes(a) ? 1 : 3) : goal.type === 'annex' ? 4 + provsOf(b).length : 5;
  C(a).infamy += Math.min(25, size) * (1 + M(C(a), 'infamy')); G.tension = clamp(G.tension + 1 + Math.min(4, size * 0.3), 0, 100); dropPacts(a, b); addRel(a, b, -30);
  logMsg(`Diplomatic play: ${cname(a)} demands that ${cname(b)} ${GOAL_TXT(goal)}.`, 'world');
  if (a === G.player && !C(a).ai) UIH.popup({ title: 'The Demand Is Delivered', icon: '📜', desc: `Our ambassador has handed ${cname(b)} our demand: ${GOAL_TXT(goal)}.<br><br>Other powers have about a week to take sides. In <b>${pl.dur} days</b> ${cname(b)} must yield or fight. Follow the crisis in the Diplomacy tab.`, options: [{ name: 'Let them sweat.' }] });
  return pl;
}
function playStrength(list) { return sum(list, t => countryStr(t) + C(t).gdp / 4000); }
function playDaily() {
  for (const pl of G.plays.slice()) { const A = C(pl.a), B = C(pl.b), t = G.day - pl.day; if (!A.exists || !B.exists || atWar(pl.a, pl.b)) { G.plays.splice(G.plays.indexOf(pl), 1); continue; }
    if (t === 8) for (const k of alive()) { if (pl.A.includes(k.tag) || pl.B.includes(k.tag)) continue; let side = null;
        if (friendly(k.tag, pl.b) || hasPact('guar', k.tag, pl.b) || hasPact('ally', k.tag, pl.b)) side = 'B'; else if (friendly(k.tag, pl.a) || hasPact('ally', k.tag, pl.a)) side = 'A'; if (!side) continue;
        if (side === 'B' && (pl.noBack.includes(k.tag) || hasSpirit(k, 'appeasement') && !hasPact('guar', k.tag, pl.b) || hasSpirit(k, 'isolationism') || hasSpirit(k, 'political_paralysis') && !hasPact('guar', k.tag, pl.b))) { if (k.major) logMsg(`${k.name} declines to back ${B.name}.`, 'world'); continue; }
        const go = () => { pl[side].push(k.tag); logMsg(`${k.name} backs ${cname(side === 'A' ? pl.a : pl.b)} in the crisis.`, k.major ? 'world' : 'info', [pl.a, pl.b]); };
        if (k.tag === G.player && !k.ai && !k.overlord) UIH.popup({ title: 'A Crisis Abroad', icon: '⚖️', desc: `${A.name} demands that ${B.name} ${GOAL_TXT(pl.goal)}. Our commitments point towards ${cname(side === 'A' ? pl.a : pl.b)}. Do we back them — at the risk of war?`, options: [{ name: 'We back them.', fn: go }, { name: 'We stay out of it.', tip: 'Relations suffer', fn: () => addRel(k.tag, side === 'A' ? pl.a : pl.b, -25) }] }); else go(); }
    if (t < pl.dur) continue; G.plays.splice(G.plays.indexOf(pl), 1);
    const R = playStrength(pl.A) / Math.max(1, playStrength(pl.B)), concede = () => { logMsg(`${B.name} backs down and agrees to ${GOAL_TXT(pl.goal)}.`, 'world'); if (pl.a === G.player && !A.ai) UIH.popup({ title: 'They Yield', icon: '🕊️', desc: `${B.name} backs down. Without a shot fired, they agree to ${GOAL_TXT(pl.goal)}.`, options: [{ name: 'A bloodless victory.' }] }); B.stab = Math.max(0, B.stab - 8); applyGoal(pl.a, pl.b, pl.goal); addPact('truce', pl.a, pl.b, 365); },
      fight = () => { logMsg(`${B.name} rejects the demands of ${A.name}.`, 'world'); const goA = () => { const g = [Object.assign({ by: pl.a, vs: pl.b }, pl.goal)]; const w = declareWar(pl.a, pl.b, g, null, true); if (!w) return; const sa = w.att.includes(pl.a) ? 'att' : 'def', sb = sa === 'att' ? 'def' : 'att'; pl.A.forEach(x => joinWar(w, x, sa)); pl.B.forEach(x => { joinWar(w, x, sb); const f = factionOf(x); if (f) f.members.forEach(m => joinWar(w, m, sb)); }); const f = factionOf(pl.a); if (f) f.members.forEach(m => joinWar(w, m, sa)); },
          backA = () => { logMsg(`${A.name} backs down. The crisis passes.`, 'world'); A.stab = Math.max(0, A.stab - 10); A.pp = Math.max(0, A.pp - 50); addPact('truce', pl.a, pl.b, 365); };
        if (pl.a === G.player && !A.ai) UIH.popup({ title: 'They Refuse', icon: '⚔️', desc: `${B.name} rejects our demands${pl.B.length > 1 ? ', backed by ' + pl.B.slice(1).map(cname).join(', ') : ''}. It is war, or humiliation.`, options: [{ name: 'Then it is war.', fn: goA }, { name: 'Back down.', tip: 'Stability -10, political power -50', fn: backA }] });
        else if (R < 0.55 && !pl.force) backA(); else goA(); };
    if (pl.force === 'concede') concede(); else if (pl.force === 'resist') fight();
    else if (pl.b === G.player && !B.ai) UIH.popup({ title: 'An Ultimatum', icon: '📜', desc: `${A.name} demands that we ${GOAL_TXT(pl.goal)}.<br><br>Their side: ${pl.A.map(cname).join(', ')}<br>Our side: ${pl.B.map(cname).join(', ')}<br>Estimated strength ratio: ${R.toFixed(2)} : 1`, options: [{ name: 'We will never yield.', fn: fight }, { name: 'We have no choice…', tip: 'Stability -8', fn: concede }] });
    else { const backed = pl.B.some(x => x !== pl.b && C(x).major); if (R > (backed ? 2.6 : 1.5) * (0.7 + B.ws / 160) && pl.goal.type !== 'annex' || (pl.goal.type === 'annex' && R > 6 && !backed && B.ws < 45)) concede(); else fight(); }
  }
}
function applyGoal(a, b, g) { if (g.type === 'take') g.provs.forEach(i => P(i).owner === b && transferProv(P(i), a)); else if (g.type === 'annex') annex(a, b, true); else if (g.type === 'puppet') { makeSubject(a, b); setIdeology(C(b), C(a).ideology, true); } else if (g.type === 'regime') setIdeology(C(b), C(a).ideology, true); claimCache(); }
// ---------- diplomatic actions ----------
const DIPLO = {
  improve: { name: 'Improve Relations', cost: 15, can: (a, b) => !atWar(a, b), ai: () => true, do: (a, b) => addRel(a, b, 15), tip: 'Relations +15' },
  trade: { name: 'Trade Agreement', cost: 20, can: (a, b) => !atWar(a, b) && !hasPact('trade', a, b), ai: (a, b) => opinion(b, a) > 5, do: (a, b) => addPact('trade', a, b), tip: 'Both sides gain trade openness. They accept if their opinion of us is above 5.' },
  nap: { name: 'Non-Aggression Pact', cost: 30, can: (a, b) => !atWar(a, b) && !hasPact('nap', a, b), ai: (a, b) => opinion(b, a) > -5 && !(C(b)._claims || {})[a], do: (a, b) => addPact('nap', a, b, 365 * 5), tip: 'Neither side may start a play against the other for five years. Requires opinion above -5.' },
  access: { name: 'Military Access', cost: 20, can: (a, b) => !atWar(a, b) && !hasPact('access', a, b), ai: (a, b) => opinion(b, a) > 30, do: (a, b) => addPact('access', a, b), tip: 'Armies may cross each other\'s land. Requires opinion above 30.' },
  guar: { name: 'Guarantee Independence', cost: 25, can: (a, b) => !atWar(a, b) && !hasPact('guar', a, b) && !friendly(a, b), ai: () => true, do: (a, b) => addPact('guar', a, b), tip: 'We will defend them if attacked.' },
  ally: { name: 'Offer Alliance', cost: 50, can: (a, b) => !atWar(a, b) && !hasPact('ally', a, b) && !friendly(a, b) && !C(b).overlord, ai: (a, b) => opinion(b, a) > 45 && !hasSpirit(C(b), 'isolationism') && !hasSpirit(C(b), 'armed_neutrality'), do: (a, b) => addPact('ally', a, b), tip: 'A mutual defence pact. Requires opinion above 45.' },
  invite: { name: 'Invite to Faction', cost: 60, can: (a, b) => { const f = factionOf(a); return f && f.leader === a && factionOf(b) !== f && !atWar(a, b) && !C(b).overlord; }, ai: (a, b) => (opinion(b, a) > 55 || (opinion(b, a) > 20 && enemiesOf(b).some(e => atWar(a, e)))) && !factionOf(b) && !hasSpirit(C(b), 'isolationism') && !hasSpirit(C(b), 'armed_neutrality'), do: (a, b) => joinFaction(b, a), tip: 'They join our faction and its wars. Requires opinion above 55, or a common enemy.' },
  joinf: { name: 'Ask to Join Faction', cost: 40, can: (a, b) => { const f = factionOf(b); return f && f.leader === b && !factionOf(a) && !atWar(a, b) && !C(a).overlord; }, ai: (a, b) => opinion(b, a) > 40, do: (a, b) => joinFaction(a, b), tip: 'Requires their opinion above 40.' },
  release: { name: 'Grant Independence', cost: 0, can: (a, b) => C(b).overlord === a, ai: () => true, do: (a, b) => { C(b).overlord = null; addRel(a, b, 40); logMsg(`${cname(a)} grants independence to ${cname(b)}.`, 'world'); }, tip: 'The subject becomes fully sovereign.' },
  integrate: { name: 'Annex Subject', cost: 120, can: (a, b) => C(b).overlord === a && C(a).pp >= 150 && !isAtWar(a), ai: () => true, do: (a, b) => { C(a).pp -= 150; C(a).infamy += 6; annex(a, b, true); }, tip: 'Costs 150 political power as well. Infamy +6.' },
  peace: { name: 'Offer White Peace', cost: 20, can: (a, b) => atWar(a, b) && G.wars.some(w => (w.att[0] === a && w.def[0] === b) || (w.att[0] === b && w.def[0] === a)), ai: (a, b) => { const w = G.wars.find(x => x.att.includes(a) && x.def.includes(b) || x.att.includes(b) && x.def.includes(a)), s = warScore(w), mine = w.att.includes(b) ? s.att - s.def : s.def - s.att; return G.day - w.start > 240 && (mine < -0.1 || (mine < 0.1 && C(b).warExh > 35)); }, do: (a, b) => whitePeace(G.wars.find(w => (w.att[0] === a && w.def[0] === b) || (w.att[0] === b && w.def[0] === a))), tip: 'Only war leaders can negotiate. They accept if the war is going badly or dragging on.' }
};
function diploAction(id, a, b) {
  const d = DIPLO[id], A = C(a); if (!d.can(a, b)) return 'Not possible'; if (A.infl < d.cost) return `Requires ${d.cost} influence`;
  A.infl -= d.cost; if (!d.ai(a, b)) { addRel(a, b, -3); return `${cname(b)} declines.`; } d.do(a, b); return '';
}
function playCost(a, b, goal) { return 40; }
function canPlay(a, b) { if (atWar(a, b)) return 'Already at war'; if (friendly(a, b)) return 'They are our friends'; if (hasPact('nap', a, b)) return 'Non-aggression pact in force'; if (hasPact('truce', a, b)) return 'Truce in force'; if (G.plays.some(p => p.a === a)) return 'We are already pressing a diplomatic play'; if (C(a).overlord) return 'Subjects cannot start plays'; if (C(a).infl < 40) return 'Requires 40 influence';
  if (C(a).ideology === 'dem' && G.tension < 25 && !(C(a)._claims || {})[b]) return 'Democracies need 25 world tension or a claim'; return ''; }
function diplomacyMonthly() {
  G.pacts = G.pacts.filter(p => !p.until || p.until > G.day); claimCache();
  for (const c of alive()) { c.infamy = Math.max(0, c.infamy - 0.4); for (const t in c.rel) if (c.rel[t]) c.rel[t] -= Math.sign(c.rel[t]) * Math.min(Math.abs(c.rel[t]), 0.5); }
  G.tension = Math.max(0, G.tension - (G.wars.some(w => w.att.concat(w.def).some(t => C(t).major)) ? 0 : 0.25));
  for (const w of G.wars.slice()) { if (G.day - w.start > 1300 && !w.civil) { const s = warScore(w); if (Math.abs(s.att - s.def) < 0.08 && C(w.att[0]).warExh + C(w.def[0]).warExh > 80) whitePeace(w); } else checkWarEnd(w); }
  for (const f of G.factions) f.members = f.members.filter(t => C(t).exists); G.factions = G.factions.filter(f => f.members.length);
}

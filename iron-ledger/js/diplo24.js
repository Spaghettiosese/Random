// 2.4 Diplomacy 3.0.
//  - Opinion has reasons: every nation remembers why it likes or dislikes another (aid in war, a common enemy, an
//    attacked friend, an annexed neighbour, an embargo, an insult, a broken treaty...), and the memories fade.
//  - Trust: treaties kept build it, betrayal destroys it for everyone watching. It weighs on every agreement.
//  - New treaties: friendship, defensive pacts (called only when attacked), border settlements (both renounce their
//    claims), loans with monthly repayments, and arms supply agreements.
//  - Every proposal is weighed with its reasons, and we see their likely answer before we ask.
//  - Envoys: a few diplomats to improve relations, build trust, court a nation for our faction, or mediate a war.
//  - Incidents: shootings on the border, spies, insults and seized ships, answered with a protest, a demand for an
//    apology, retaliation or silence.
'use strict';
// ======================= opinion and its reasons =======================
const OM_TEXT = { mobilised: 'Mobilised on their border', envoy: 'Our envoy', aid: 'Aid in war', sharedfoe: 'A common enemy', warfriend: 'Attacked a friend of theirs', annexed: 'Annexed a neighbour', embargo: 'Embargo against them', insult: 'An insult', incident: 'A border incident', apology: 'An apology', broke: 'Broke a treaty', betray: 'Betrayed them', refused: 'Refused their request', mediated: 'Mediated a peace', loan: 'A loan', arms: 'Arms supplies', border: 'Border settled', gift: 'A gift', protest: 'A formal protest', retaliation: 'Retaliation', called: 'Answered their call to arms', abandoned: 'Abandoned them in war', royal: 'Royal ties', prestige: 'Their prestige', treaty: 'Arms control' };
const omS = () => G.om || (G.om = {});
function omAdd(a, b, k, v, days) { if (!a || !b || a === b || !G.C[a] || !G.C[b]) return; const key = a + '|' + b, L = omS()[key] || (omS()[key] = []), e = L.find(x => x[0] === k), until = days >= 9999 ? 1e9 : G.day + days;
  if (e) { if (Math.abs(v) >= Math.abs(e[1]) || e[2] <= G.day) e[1] = v; e[2] = Math.max(e[2] > G.day ? e[2] : 0, until); } else L.push([k, v, until]); }
function omEnd(a, b, k) { const L = G.om && G.om[a + '|' + b]; if (L) for (const x of L) if (x[0] === k) x[2] = G.day; }
function omSum(a, b) { const L = G.om && G.om[a + '|' + b]; if (!L) return 0; let s = 0; for (const x of L) if (x[2] > G.day) s += x[1]; return s; }
const omList = (a, b) => ((G.om && G.om[a + '|' + b]) || []).filter(x => x[2] > G.day).map(x => [OM_TEXT[x[0]] || x[0], x[1], x[2]]);
function omClean() { for (const k in G.om || {}) { G.om[k] = G.om[k].filter(x => x[2] > G.day); if (!G.om[k].length) delete G.om[k]; } }
// ======================= trust =======================
function trustOf(a, b) { const v = G.trust && G.trust[a + '|' + b]; return v === undefined ? 50 : v; }
function trustAdd(a, b, v) { if (!G.C[a] || !G.C[b] || a === b) return; (G.trust || (G.trust = {}))[a + '|' + b] = clamp(trustOf(a, b) + v, 0, 100); }
function trustAll(t, v, but) { for (const k of alive()) if (k.tag !== t && k.tag !== but) trustAdd(k.tag, t, v); }
{ const _op = opinion; opinion = function (a, b) { const o = _op(a, b); if (!G.om && !G.trust) return o; return clamp(o + omSum(a, b) + (trustOf(a, b) - 50) * 0.2 + (hasPact('friend', a, b) ? 15 : 0) + (hasPact('border', a, b) ? 10 : 0) + (hasPact('defense', a, b) ? 20 : 0), -200, 200); }; }
// the whole picture of how a sees b, for the dossier
function opinionWhy(a, b) { const A = C(a), B = C(b), L = []; if (!A || !B) return L; const add = (t, v) => { if (Math.abs(v) >= 0.5) L.push([t, Math.round(v)]); };
  add('Relations over the years', A.rel[b] || 0); add(`${IDEO[A.ideology][0]} view of the ${IDEO[B.ideology][0].toLowerCase()}`, IDEO_REL[A.ideology][B.ideology]); add('Infamy', -B.infamy * 0.6);
  if (hasPact('ally', a, b)) add('Alliance', 35); if (hasPact('nap', a, b)) add('Non-aggression pact', 12); if (hasPact('trade', a, b)) add('Trade agreement', 10); if (hasPact('guar', b, a)) add('Guarantees their independence', 20);
  if (hasPact('friend', a, b)) add('Treaty of friendship', 15); if (hasPact('border', a, b)) add('Border treaty', 10); if (hasPact('defense', a, b)) add('Defensive pact', 20);
  const fa = factionOf(a), fb = factionOf(b); if (fa && fa === fb) add('The same faction', 40); if (A.overlord === b || B.overlord === a) add('Overlord and subject', 30);
  if (atWar(a, b)) add('At war', -100); if (A._claims && A._claims[b]) add('Their land is claimed', -20); if (B._claims && B._claims[a]) add('Claims on their land', -35);
  for (const [t, v] of omList(a, b)) add(t, v); add('Trust', (trustOf(a, b) - 50) * 0.2); return L.sort((x, y) => Math.abs(y[1]) - Math.abs(x[1])); }
// ======================= treaties =======================
const TREATY = { friend: ['Treaty of Friendship', 'Opinion +15 both ways, no obligations. Ten years.', 3650], defense: ['Defensive Pact', 'Each comes to the other\'s aid only if attacked. Opinion +20. Ten years.', 3650], border: ['Border Treaty', 'Both renounce their claims on each other\'s land. Opinion +10, world tension falls.', 0] };
{ const _ap = addPact; addPact = function (t, a, b, days) { const had = hasPact(t, a, b); _ap(t, a, b, days === undefined && TREATY[t] ? TREATY[t][2] : days); if (had || !TREATY[t] || !hasPact(t, a, b)) return; logMsg(`${cname(a)} and ${cname(b)} sign a ${TREATY[t][0].toLowerCase()}.`, C(a).major && C(b).major ? 'world' : 'info', [a, b]);
  if (t === 'border') { for (const p of G.P) { if (p.owner === b) p.claims = p.claims.filter(x => x !== a); if (p.owner === a) p.claims = p.claims.filter(x => x !== b); } claimCache(); G.tension = Math.max(0, G.tension - 2); } }; }
// loans: the lender pays now, the borrower repays with interest every month; default ruins trust
const loansS = () => G.loans || (G.loans = []);
function makeLoan(from, to, weeks) { const L = C(from), B = C(to), amt = weeks * wkInc(B); if (L.money < amt * 1.5) return 'They cannot spare it'; L.money -= amt; B.money += amt; const months = 24, monthly = amt * 1.12 / months;
  loansS().push({ id: G.nid++, from, to, amt, monthly, left: months, day: G.day }); omAdd(to, from, 'loan', 15, 730); logMsg(`${L.name} lends ${B.name} money for two years.`, 'info', [from, to]); return ''; }
function loansMonthly() { for (const l of loansS().slice()) { const B = C(l.to), L = C(l.from); if (!B || !B.exists || !L || !L.exists) { loansS().splice(loansS().indexOf(l), 1); continue; }
    if (B.money >= l.monthly) { B.money -= l.monthly; L.money += l.monthly; l.left--; if (l.left <= 0) { loansS().splice(loansS().indexOf(l), 1); trustAdd(l.from, l.to, 10); trustAll(l.to, 2, l.from); } }
    else { loansS().splice(loansS().indexOf(l), 1); trustAdd(l.from, l.to, -40); trustAll(l.to, -5, l.from); omAdd(l.from, l.to, 'broke', -35, 1825); logMsg(`${B.name} defaults on its loan from ${L.name}.`, 'info', [l.from, l.to]); if (l.to === G.player) UIH.notify(`We have defaulted on our loan from ${L.name}. No one will lend to us for years.`, 'bad'); } } }
// arms supply agreements: the seller ships part of its weekly production, the buyer pays for it
const armsS = () => G.armsDeals || (G.armsDeals = []);
function armsDeal(seller, buyer) { if (armsS().some(d => d.seller === seller && d.buyer === buyer)) return 'Already supplying them'; armsS().push({ id: G.nid++, seller, buyer, until: G.day + 730 }); omAdd(buyer, seller, 'arms', 15, 730); logMsg(`${cname(seller)} agrees to supply ${cname(buyer)} with arms.`, 'info', [seller, buyer]); return ''; }
function armsMonthly() { for (const d of armsS().slice()) { const S = C(d.seller), B = C(d.buyer); if (!S || !B || !S.exists || !B.exists || G.day > d.until || atWar(d.seller, d.buyer)) { armsS().splice(armsS().indexOf(d), 1); continue; }
    const price = 0.3 * wkInc(B); if (B.money < price) { armsS().splice(armsS().indexOf(d), 1); omAdd(d.seller, d.buyer, 'refused', -10, 365); continue; }
    B.money -= price; S.money += price; for (const g of ['arms', 'artillery']) { const v = Math.min((S.stock[g] || 0) * 0.03, g === 'arms' ? 120 : 20); S.stock[g] -= v; B.stock[g] = (B.stock[g] || 0) + v; } omAdd(d.buyer, d.seller, 'arms', 15, 60); } }
// ======================= will they agree? =======================
const capDist = (a, b) => (typeof kmBetween === 'function' && ok(a) && ok(b) ? kmBetween(C(a).capital, C(b).capital) : 2000);
function diploEval(id, a, b) { const A = C(a), B = C(b), R = []; const add = (t, v) => { if (Math.abs(v) >= 1) R.push([t, Math.round(v)]); };
  if (!A || !B) return { score: -999, reasons: [] }; if (!B.ai) return { score: 0, reasons: [['They decide for themselves', 0]], human: true };
  const o = opinion(b, a), tr = trustOf(b, a), sameI = A.ideology === B.ideology, foeShared = enemiesOf(b).some(e => atWar(a, e)) || alive().some(k => k.tag !== a && k.tag !== b && (k._claims || {})[b] && (k._claims || {})[a]);
  const claims = (A._claims || {})[b], strA = countryStr(a) || 1, strB = countryStr(b) || 1, km = capDist(a, b), neutral = hasSpirit(B, 'isolationism') || hasSpirit(B, 'armed_neutrality');
  add('Their opinion of us', o * 0.4); add('Trust', (tr - 50) * 0.5);
  const base = { trade: 10, nap: 10, friend: 10, access: -15, ally: -25, defense: -10, border: 0, joinf: -10, invite: -10, loan: -5, arms: 5 }[id] || 0; add('The proposal', base);
  if (id === 'trade') { if (hasSpirit(B, 'autarky') || B.laws.trade === 'autarky') add('Autarky', -25); if (A.laws.trade === 'free') add('Our open markets', 8); }
  if (id === 'nap') { if (claims) add('They fear our claims', 15 + Math.min(20, (strA / strB - 1) * 10)); if ((B._claims || {})[a]) add('They claim our land', -20); }
  if (id === 'ally' || id === 'defense') { add(sameI ? 'Kindred governments' : 'Different governments', sameI ? 15 : -10); if (foeShared) add('A common enemy', 30); if (isAtWar(a) && !foeShared) add('Our war is not theirs', -40); add('Distance', -Math.max(0, km - 1500) / 150); if (neutral) add('They keep out of alliances', -60); if (factionOf(b) && factionOf(b) !== factionOf(a)) add('They belong to another faction', -50); if (claims) add('Our claims on their land', -40); }
  if (id === 'access') { if (isAtWar(a)) add('Our war might come to them', -20); if (foeShared) add('A common enemy', 25); }
  if (id === 'friend') { add(sameI ? 'Kindred governments' : 'Different governments', sameI ? 10 : -5); if (claims) add('Our claims on their land', -30); }
  if (id === 'border') { const theirs = (B._claims || {})[a], ours = claims; if (theirs) add('They would give up their claims', -25); if (ours) add('We would give up ours', 25); if (!theirs && !ours) add('Nothing to settle', -100); }
  if (id === 'joinf' || id === 'invite') { const f = factionOf(id === 'joinf' ? b : a); if (f) { const c0 = id === 'joinf' ? A : B, nf = c0.tag; if (enemiesOf(nf).some(e => !f.members.some(x => atWar(x, e)))) add('Their war would become ours', -80); add('Distance', -Math.max(0, km - 2000) / 80); add(sameI ? 'Kindred governments' : 'Different governments', sameI ? 20 : -20); if (foeShared) add('A common enemy', 25); add('Faction cohesion', ((f.coh === undefined ? 60 : f.coh) - 50) / 3); if (neutral) add('They keep out of alliances', -60); void c0; } }
  if (id === 'loan') { add(B.money > wkInc(B) * 20 ? 'Their treasury is full' : 'Their treasury is low', B.money > wkInc(B) * 20 ? 15 : -30); if (A.ec && A.ec.defaulted) add('We defaulted before', -60); }
  if (id === 'arms') { add('A customer for their factories', 10); if ((B.stock.arms || 0) < 500) add('They have little to spare', -30); if (isAtWar(b)) add('They need their arms', -20); }
  const score = sum(R, x => x[1]); return { score, reasons: R }; }
const willAgree = (id, a, b) => { const e = diploEval(id, a, b); return e.human || e.score > 0; };
// the old acceptance rules give way to the weighed answer
for (const id of ['trade', 'nap', 'access', 'ally', 'joinf', 'invite']) if (DIPLO[id]) { const d = DIPLO[id], old = d.ai; d.ai = (a, b) => { const hist = typeof histFactionOK !== 'function' || (id === 'joinf' ? histFactionOK(a, b) : id === 'invite' ? histFactionOK(b, a) : true); const r = hist && willAgree(id, a, b); if (!r && G.C[b]) omAdd(a, b, 'refused', -8, 365); return r; }; d.tip = (d.tip || '').replace(/ ?(They accept|Requires)[^.]*\./g, '') + ' Their answer depends on opinion, trust and their interests: the reasons are shown before we ask.'; void old; }
Object.assign(DIPLO, {
  friend: { name: 'Treaty of Friendship', cost: 25, can: (a, b) => !atWar(a, b) && !hasPact('friend', a, b), ai: (a, b) => willAgree('friend', a, b), do: (a, b) => addPact('friend', a, b), tip: TREATY.friend[1] },
  defense: { name: 'Defensive Pact', cost: 40, can: (a, b) => !atWar(a, b) && !hasPact('defense', a, b) && !hasPact('ally', a, b) && !friendly(a, b) && !C(b).overlord, ai: (a, b) => willAgree('defense', a, b), do: (a, b) => addPact('defense', a, b), tip: TREATY.defense[1] },
  border: { name: 'Border Treaty', cost: 30, can: (a, b) => !atWar(a, b) && !hasPact('border', a, b) && (!!(C(a)._claims || {})[b] || !!(C(b)._claims || {})[a]), ai: (a, b) => willAgree('border', a, b), do: (a, b) => addPact('border', a, b, 0), tip: TREATY.border[1] },
  loan: { name: 'Request a Loan', cost: 20, can: (a, b) => !atWar(a, b) && !loansS().some(l => l.to === a && l.from === b), ai: (a, b) => willAgree('loan', a, b), do: (a, b) => { const e = makeLoan(b, a, 6); if (e && a === G.player) UIH.notify(e, 'bad'); }, tip: 'Six weeks of our income now; we repay 112% over two years. Defaulting ruins our credit and their trust.' },
  arms: { name: 'Buy Arms', cost: 20, can: (a, b) => !atWar(a, b) && b !== a && !armsS().some(d => d.seller === b && d.buyer === a), ai: (a, b) => willAgree('arms', a, b), do: (a, b) => { const e = armsDeal(b, a); if (e && a === G.player) UIH.notify(e, 'bad'); }, tip: 'They ship rifles and guns every month for two years; we pay a third of a week\'s income each month.' },
  mediate: { name: 'Offer Mediation', cost: 30, can: (a, b) => isAtWar(b) && !isAtWar(a) && !enemiesOf(b).some(e => friendly(a, e)), ai: () => true, do: (a, b) => mediate(a, b), tip: 'Offer to broker a white peace between them and their main enemy. Both must be tired of the war.' },
  apology: { name: 'Demand an Apology', cost: 15, can: (a, b) => !atWar(a, b) && omList(a, b).some(x => x[1] < -5), ai: (a, b) => willApologise(a, b), do: (a, b) => { omAdd(a, b, 'apology', 15, 730); omEnd(a, b, 'incident'); omEnd(a, b, 'insult'); if (typeof prestigeAdd === 'function') prestigeAdd(a, 3); }, tip: 'They apologise, or refuse and lose face with the world.' }
});
function willApologise(a, b) { const r = (countryStr(a) / (countryStr(b) || 1)) * 30 + opinion(b, a) / 3 - (C(b).major ? 20 : 0); if (r <= 10) { omAdd(a, b, 'refused', -10, 730); if (typeof prestigeAdd === 'function') prestigeAdd(a, -2); } return r > 10; }
// the defensive pact is called only when its partner is attacked
{ const _dw = declareWarInner; declareWarInner = function (a, b, goals, name, noCall, realTarget) {
  // betrayal: war on a nation we have a treaty with
  const broken = ['nap', 'friend', 'defense', 'ally'].filter(t => hasPact(t, a, b)).concat(hasPact('guar', a, b) ? ['guar'] : []);
  const w = _dw(a, b, goals, name, noCall, realTarget); if (!w) return w;
  if (broken.length && !noCall) { trustAdd(b, a, -60); omAdd(b, a, 'betray', -60, 3650); trustAll(a, -8, b); for (const k of alive()) if (k.tag !== a && k.tag !== b) omAdd(k.tag, a, 'broke', -12, 1095); C(a).infamy += 8; logMsg(`${cname(a)} breaks its ${broken.includes('nap') ? 'non-aggression pact' : 'treaty'} with ${cname(b)}.`, 'world', [a, b]); }
  if (!noCall) { const side = w.att.includes(b) ? 'att' : 'def'; for (const p of G.pacts.slice()) if (p.t === 'defense' && (p.a === b || p.b === b)) { const o = p.a === b ? p.b : p.a; if (o !== a && !friendly(o, a) && !atWar(o, a)) callAlly(w, o, side, b); }
    // the friends of the attacked remember
    for (const k of alive()) if (k.tag !== a && k.tag !== b && (friendly(k.tag, b) || hasPact('guar', k.tag, b) || hasPact('friend', k.tag, b) || opinion(k.tag, b) > 60)) omAdd(k.tag, a, 'warfriend', -25, 1095); }
  return w; }; }
// calls answered and refused
{ const _ca = callAlly; callAlly = function (w, t, side, forWhom) { _ca(w, t, side, forWhom); const inW = w.att.includes(t) || w.def.includes(t); if (inW) { trustAdd(forWhom, t, 12); omAdd(forWhom, t, 'called', 25, 1825); trustAll(t, 2, forWhom); } else if (G.wars.includes(w)) { trustAdd(forWhom, t, -25); omAdd(forWhom, t, 'abandoned', -30, 1825); trustAll(t, -4, forWhom); } }; }
{ const _an = annex; annex = function (a, tag, peaceful) { const nb = new Set(); for (const p of G.P) if (p.owner === tag) for (const e of NB[p.id]) { const o = P(e.to).owner; if (o && o !== tag && o !== a) nb.add(o); } _an(a, tag, peaceful); for (const n of nb) { omAdd(n, a, 'annexed', -20, 1095); trustAdd(n, a, -5); } }; }
{ const _se = setEmbargo; setEmbargo = function (c, t, on, free) { const r = _se(c, t, on, free); if (on) omAdd(t, c.tag, 'embargo', -25, 9999); else omEnd(t, c.tag, 'embargo'); return r; }; }
// ======================= mediation =======================
function mediate(a, b) { const w = G.wars.find(x => (x.att.includes(b) || x.def.includes(b)) && !x.civil); if (!w) return; const foe = (w.att.includes(b) ? w.def : w.att).filter(t => ok(t) && !C(t).capitulated).sort((x, y) => countryStr(y) - countryStr(x))[0]; if (!foe) return;
  const tired = t => C(t).warExh > 35 || capInfo(t).prog > 0.15 || G.day - w.start > 900, pl = [b, foe].includes(G.player);
  if (tired(b) && tired(foe) && !pl && w.att[0] !== 'GER' && !(G.historical && C(w.att[0]).major)) { separatePeace(C(b), foe); omAdd(b, a, 'mediated', 25, 1825); omAdd(foe, a, 'mediated', 25, 1825); if (typeof prestigeAdd === 'function') prestigeAdd(a, 8); logMsg(`${cname(a)} brokers a peace between ${cname(b)} and ${cname(foe)}.`, 'world', [a, b, foe]); }
  else { omAdd(b, a, 'mediated', 6, 365); if (a === G.player) UIH.notify(`${cname(b)} and ${cname(foe)} are not ready to talk. Our effort is remembered.`, 'info'); } }
// ======================= envoys =======================
const ENVOY_TASK = { improve: ['Improve relations', 'Their opinion of us rises by 3 a month, up to 40.'], trust: ['Build trust', 'Their trust in us rises by 2 a month, up to 80.'], court: ['Court for our faction', 'Their people warm to our cause: our ideology gains support there, and their view of our faction improves.'], mediate: ['Mediate', 'Work for a peace in their war; after three months a mediation is offered.'] };
function envoySlots(c) { return 1 + (c.major ? 1 : 0) + (c.envoyX || 0); }
const envoysOf = c => { const n = envoySlots(c); c.envoys = (c.envoys || []).filter(e => ok(e.t)); while (c.envoys.length > n) c.envoys.pop(); return c.envoys; };
function envoySet(c, t, task) { const E = envoysOf(c); const i = E.findIndex(e => e.t === t); if (!task) { if (i >= 0) E.splice(i, 1); return ''; } if (!ENVOY_TASK[task]) return 'Unknown task'; if (t === c.tag || !ok(t)) return 'Not a valid nation';
  if (task === 'mediate' && !isAtWar(t)) return 'They are not at war'; if (i >= 0) { E[i].task = task; E[i].since = G.day; return ''; } if (E.length >= envoySlots(c)) return 'All our envoys are abroad'; E.push({ t, task, since: G.day }); return ''; }
function envoysMonthly() { for (const c of alive()) { const E = envoysOf(c); for (const e of E.slice()) { const k = C(e.t); if (!k || !k.exists || atWar(c.tag, e.t)) { E.splice(E.indexOf(e), 1); continue; } const months = Math.floor((G.day - e.since) / 30);
      if (e.task === 'improve') omAdd(e.t, c.tag, 'envoy', Math.min(40, 3 * (months + 1)), 45);
      else if (e.task === 'trust') { if (trustOf(e.t, c.tag) < 80) trustAdd(e.t, c.tag, 2); }
      else if (e.task === 'court') { if (typeof shiftSupport === 'function' && k.sup) shiftSupport(k, { [c.ideology]: 0.5 }); const f = factionOf(c.tag); if (f) for (const m of f.members) if (m !== e.t) omAdd(e.t, m, 'envoy', Math.min(20, 2 * (months + 1)), 45); }
      else if (e.task === 'mediate' && months >= 3) { mediate(c.tag, e.t); E.splice(E.indexOf(e), 1); } }
    // the AI sends its envoys where it wants friends
    if (c.ai && (G.day + c.capital) % 90 < 30 && E.length < envoySlots(c)) { const f = factionOf(c.tag), cand = alive().filter(k => k.tag !== c.tag && !atWar(c.tag, k.tag) && !E.some(e => e.t === k.tag) && (k.ideology === c.ideology || (f && f.leader === c.tag && !factionOf(k.tag)))).sort((x, y) => opinion(y.tag, c.tag) - opinion(x.tag, c.tag)).slice(0, 6); const k = cand.length ? pick(cand) : null; if (k) envoySet(c, k.tag, f && f.leader === c.tag && !factionOf(k.tag) ? 'court' : 'improve'); } } }
// ======================= incidents =======================
const INCIDENTS = [['Shooting on the Border', 'Guards exchange fire across the frontier; two are dead.'], ['Spies Arrested', 'Their military attaché is caught photographing our fortifications.'], ['An Insult in the Press', 'Their newspapers print a cartoon of our head of state.'], ['A Ship Seized', 'Their navy stops one of our merchantmen and seizes the cargo.'], ['A Diplomat Expelled', 'Our consul is declared persona non grata.']];
function incidentsMonthly() { for (const c of alive()) { if (Math.random() > 0.03) continue; const nb = new Set(); for (const p of G.P) if (p.owner === c.tag) for (const e of NB[p.id]) { const o = P(e.to).owner; if (o && o !== c.tag && ok(o)) nb.add(o); }
    const t = [...nb].filter(x => !atWar(c.tag, x) && !friendly(c.tag, x) && opinion(c.tag, x) < 10)[0]; if (!t) continue; const [nm, d] = pick(INCIDENTS);
    omAdd(c.tag, t, 'incident', -15, 540); omAdd(t, c.tag, 'incident', -8, 540); G.tension = clamp(G.tension + 0.5, 0, 100);
    if (c.tag === G.player) UIH.popup({ title: nm, icon: '⚠️', desc: `${d}<br><br>The incident is with ${cname(t)}.`, options: [
      { name: 'Lodge a formal protest', tip: 'War support +3; their opinion of us -5', fn: () => { c.ws = Math.min(100, c.ws + 3); omAdd(t, c.tag, 'protest', -5, 365); } },
      { name: 'Demand an apology', tip: 'They apologise (prestige +3, opinion +15), or refuse (prestige -2)', fn: () => { if (willApologise(c.tag, t)) { omAdd(c.tag, t, 'apology', 15, 730); omEnd(c.tag, t, 'incident'); if (typeof prestigeAdd === 'function') prestigeAdd(c.tag, 3); UIH.notify(`${cname(t)} apologises.`, 'good'); } else UIH.notify(`${cname(t)} refuses to apologise.`, 'bad'); } },
      { name: 'Retaliate', tip: 'Expel their diplomats: war support +5, tension +1, their opinion -20', fn: () => { c.ws = Math.min(100, c.ws + 5); G.tension = clamp(G.tension + 1, 0, 100); omAdd(t, c.tag, 'retaliation', -20, 730); } },
      { name: 'Let it pass', tip: 'Stability +1; prestige -1', fn: () => { c.stab = Math.min(100, c.stab + 1); if (typeof prestigeAdd === 'function') prestigeAdd(c.tag, -1); } }] }); } }
// ======================= the monthly round =======================
function diplo24Monthly() { loansMonthly(); armsMonthly(); envoysMonthly(); incidentsMonthly();
  for (const c of alive()) for (const t in c.lend || {}) if (c.lend[t] > 0 && ok(t)) omAdd(t, c.tag, 'aid', 20, 60);
  const war = alive().filter(k => isAtWar(k.tag)); for (const a of war) for (const b of war) if (a !== b && !atWar(a.tag, b.tag) && enemiesOf(a.tag).some(e => atWar(b.tag, e))) omAdd(a.tag, b.tag, 'sharedfoe', 15, 45);
  for (const k in G.trust || {}) G.trust[k] += (50 - G.trust[k]) * 0.02; for (const p of G.pacts) if (['nap', 'friend', 'defense', 'ally', 'trade', 'border'].includes(p.t) && !atWar(p.a, p.b)) { trustAdd(p.a, p.b, 0.3); trustAdd(p.b, p.a, 0.3); }
  if (dateObj(G.day).getUTCMonth() === 0) omClean();
  // the AI buys arms when it runs short in war, and borrows when its treasury is empty
  for (const c of alive()) { if (!c.ai || c.overlord || c.infl < 30) continue;
    if (isAtWar(c.tag) && (c.stock.arms || 0) < 250 && c.money > 3 * wkInc(c) && Math.random() < 0.15) { const s = alive().filter(k => k.tag !== c.tag && k.major && !atWar(k.tag, c.tag) && (k.stock.arms || 0) > 1500 && !enemiesOf(c.tag).some(e => friendly(k.tag, e)) && DIPLO.arms.can(c.tag, k.tag)).sort((x, y) => opinion(y.tag, c.tag) - opinion(x.tag, c.tag))[0]; if (s) diploAction('arms', c.tag, s.tag); }
    if (c.money < 0 && Math.random() < 0.06) { const l = alive().filter(k => k.tag !== c.tag && !atWar(k.tag, c.tag) && k.money > 30 * wkInc(k) && opinion(k.tag, c.tag) > 10 && DIPLO.loan.can(c.tag, k.tag)).sort((x, y) => opinion(y.tag, c.tag) - opinion(x.tag, c.tag))[0]; if (l) diploAction('loan', c.tag, l.tag); } }
  // the AI signs the new treaties when they suit it
  for (const c of alive()) { if (!c.ai || c.infl < 50 || Math.random() > 0.04) continue; const k = pick(alive().filter(x => x.tag !== c.tag && !atWar(c.tag, x.tag) && (capDist(c.tag, x.tag) < 2500 || (factionOf(c.tag) && factionOf(x.tag) === factionOf(c.tag))))); if (!k) continue;
    for (const id of ['border', 'friend', 'defense']) if (DIPLO[id].can(c.tag, k.tag) && diploEval(id, c.tag, k.tag).score > 15 && diploEval(id, k.tag, c.tag).score > 0 && !(G.historical && c.major && id === 'defense')) { diploAction(id, c.tag, k.tag); break; } } }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); try { diplo24Monthly(); } catch (e) { if (typeof console !== 'undefined') console.warn('diplo24', e); } }; }
// proposals the AI makes to the player are put to the player
const ASK_TXT = { ally: 'proposes an alliance', defense: 'proposes a defensive pact', joinf: 'asks to join our faction', invite: 'invites us into its faction', access: 'asks for military access through our land', loan: 'asks us for a loan', arms: 'wants to buy our arms', border: 'proposes a border treaty: both sides give up their claims', friend: 'proposes a treaty of friendship', nap: 'proposes a non-aggression pact', trade: 'proposes a trade agreement' };
{ const _da = diploAction; diploAction = function (id, a, b) { const d = DIPLO[id], B = C(b), A = C(a);
  if (d && ASK_TXT[id] && B && !B.ai && b === G.player && A && A.ai) { if (!d.can(a, b)) return 'Not possible'; if (A.infl < d.cost) return `Requires ${d.cost} influence`; A.infl -= d.cost;
    UIH.popup({ title: `${A.name}: ${d.name}`, icon: '🤝', desc: `${A.name} ${ASK_TXT[id]}.<br><span class="dim">${d.tip || ''}</span><br>Their opinion of us: ${Math.round(opinion(a, b))} · our trust in them: ${Math.round(trustOf(b, a))}`, options: [{ name: 'Accept', fn: () => d.do(a, b) }, { name: 'Decline', tip: 'Their opinion of us -8', fn: () => omAdd(a, b, 'refused', -8, 365) }] }); return ''; }
  return _da(id, a, b); }; }

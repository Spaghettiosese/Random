// 2.2 mechanics, part two: prisoners of war, disease and medicine, propaganda, defensive lines, summits and conferences.
'use strict';
// ======================= 6. Prisoners of war =======================
// Soldiers captured in pockets and broken armies are held by the enemy. How they are treated is the captor's choice:
// the Geneva Convention costs money; labour camps add to output; harsh camps kill and harden the enemy's will.
// Prisoners escape, die, are exchanged when both sides agree, and go home at the peace.
const PW_POL = { geneva: ['Geneva Convention', 'Fed, housed and inspected by the Red Cross: few die; the camps cost money.', 0.002], labour: ['Prisoner Labour', 'Prisoners work in farms, mines and factories: more output, more deaths, some infamy.', 0.01], harsh: ['Harsh Camps', 'Hunger and cold: many die; infamy grows; their countrymen will not surrender.', 0.03] };
const pwOf = c => c.pw || (c.pw = { held: {}, pol: c.ideology === 'dem' ? 'geneva' : c.ideology === 'fas' ? 'labour' : 'labour', seen: c.pows || 0 });
SPIRITS.pow_labour = ['Prisoner Labour', 'Prisoners of war work for us.', { output: 0.01 }];
SPIRITS.vengeance = ['Vengeance for Our Prisoners', 'Our soldiers know what awaits them in enemy camps; they fight to the last.', { def: 0.03, ws: 4 }];
function pwMonthly() {
  for (const t of alive()) { const P0 = pwOf(t), d = (t.pows || 0) - P0.seen; P0.seen = t.pows || 0; if (d <= 0) continue; const cap = enemiesOf(t.tag).map(C).filter(e => e && e.exists && !e.capitulated); const W = sum(cap, e => countryStr(e.tag)) || 1; for (const e of cap) { const H = pwOf(e).held; H[t.tag] = (H[t.tag] || 0) + d * countryStr(e.tag) / W; } }
  for (const c of alive()) { const P0 = pwOf(c); let labour = 0;
    for (const o of Object.keys(P0.held)) { const n = P0.held[o], O = C(o); if (n < 0.05 || !O) { delete P0.held[o]; continue; } const die = n * PW_POL[P0.pol][2], esc = n * (P0.pol === 'geneva' ? 0.003 : 0.005);
      P0.held[o] = n - die - esc; if (O.exists) { O.milDead = (O.milDead || 0) + die; O.manpower += esc; O.pows = Math.max(0, (O.pows || 0) - die - esc); pwOf(O).seen = O.pows; }
      if (P0.pol === 'geneva') c.money -= n * 0.5; if (P0.pol === 'labour') labour += n; if (P0.pol === 'harsh') { c.infamy += Math.min(1, n / 200); if (O.exists) addSpirit(O, 'vengeance', 60); } }
    removeSpirit(c, 'pow_labour'); if (labour > 20) { SPIRITS.pow_labour[2] = { output: Math.min(0.05, labour / 40000) }; addSpirit(c, 'pow_labour'); }
    if (c.ai) P0.pol = c.ideology === 'dem' ? 'geneva' : c.ideology === 'fas' && enemiesOf(c.tag).some(e => C(e) && C(e).ideology === 'com') ? 'harsh' : c.ideology === 'aut' ? 'geneva' : 'labour'; } }
function pwExchange(c, t) { const A = pwOf(c), B = pwOf(C(t)); const a = A.held[t] || 0, b = B.held[c.tag] || 0; if (a < 1 || b < 1) return 'Both sides must hold prisoners'; if (c.pp < 10) return 'Needs 10 political power'; c.pp -= 10;
  const n = Math.min(a, b) * 0.25; A.held[t] -= n; B.held[c.tag] -= n; c.manpower += n; C(t).manpower += n; c.pows = Math.max(0, (c.pows || 0) - n); C(t).pows = Math.max(0, (C(t).pows || 0) - n); A.seen = c.pows; B.seen = C(t).pows; addRel(c.tag, t, 5);
  logMsg(`${c.name} and ${cname(t)} exchange ${fmt(n * 1000)} sick and wounded prisoners.`, 'info', [c.tag, t]); return ''; }
{ const _pe = peace; peace = function (w, side) { const att = w.att.slice(), def = w.def.slice(); const r = _pe(w, side);
  for (const a of att) for (const b of def) for (const [x, y] of [[a, b], [b, a]]) { const X = C(x), Y = C(y); if (!X || !Y) continue; const n = pwOf(X).held[y] || 0; if (n > 0) { delete pwOf(X).held[y]; if (Y.exists) { Y.manpower += n * 0.9; Y.pows = Math.max(0, (Y.pows || 0) - n); pwOf(Y).seen = Y.pows; } } }
  return r; }; }
// ======================= 7. Disease and medicine =======================
// Jungles, marshes and deserts kill more soldiers than battles do, and winter brings typhus. Medicine, antibiotics,
// quinine and a medical corps protect an army; occupied cities in winter breed epidemics.
const DZ_RISK = { j: 0.08, s: 0.06, d: 0.04, m: 0.02, f: 0.012, h: 0.012, p: 0.008, u: 0.012 };
const dzOf = c => c.dz || (c.dz = { med: 0, lost: 0, lostT: 0, quin: 0 });
const dzProtect = c => { const d = dzOf(c); return Math.min(0.85, (c.techs.s_medicine ? 0.3 : 0) + (hasSpirit(c, 'p_penicillin') ? 0.3 : 0) + d.med * 0.1 + sciBonus(c, 'med') * 0.03); };
function dzMonthly() { const winter = [12, 1, 2].includes(monthOf());
  for (const c of alive()) dzOf(c).lost = 0;
  for (const a of Object.values(G.armies)) { const c = C(a.owner), p = P(a.loc); if (!c || !p) continue; const d = dzOf(c); let risk = DZ_RISK[p.ter] || 0.01; if (winter && Math.abs(PLAT[p.id] || 0) > 45) risk += 0.015;
    let prot = dzProtect(c); if (d.quin > G.day && 'js'.includes(p.ter)) prot = Math.min(0.9, prot + 0.3); risk *= 1 - prot;
    for (const dv of a.divs) { const loss = dv.str * risk * 0.5; dv.str = Math.max(0.1, dv.str - loss); const men = loss * UNITS[dv.t].mp; c.wounded = (c.wounded || 0) + men * 0.85; c.milDead = (c.milDead || 0) + men * 0.15; d.lost += men; d.lostT += men; } }
  if (winter) for (const p of G.P) if (p.ctrl !== p.owner && (p.unrest || 0) > 60 && p.pop > 500 && Math.random() < 0.01) { civDeath(p, p.pop * 0.002, null, 'disease'); if (p.owner === G.player || p.ctrl === G.player) UIH.notify(`Typhus breaks out in ${p.name}.`, 'bad'); }
  for (const c of alive()) { if (!c.ai || !isAtWar(c.tag) || !c.major) continue; const d = dzOf(c); if (d.lost > 5 && d.med < 3 && c.pp > 60) dzAct(c, 'medcorps'); if (c.techs.s_medicine && d.quin < G.day && Object.values(G.armies).some(a => a.owner === c.tag && 'js'.includes(P(a.loc).ter)) && c.pp > 40) dzAct(c, 'quinine'); } }
function dzAct(c, a) { const d = dzOf(c);
  if (a === 'medcorps') { if (d.med >= 3) return 'The medical corps is at full strength'; const cost = 6 * Math.max(200, (c.budget && c.budget.income) || 200); if (c.pp < 30 || c.money < cost) return `Needs 30 political power and ${fmt(cost)}`; c.pp -= 30; c.money -= cost; d.med++; return ''; }
  if (a === 'quinine') { if (!c.techs.s_medicine) return 'Requires Modern Medicine'; if (c.pp < 20) return 'Needs 20 political power'; c.pp -= 20; d.quin = G.day + 365; return ''; } return ''; }
// ======================= 8. Propaganda =======================
// The Ministry runs one campaign at a time, three months long; each kind tires the public if repeated within the year.
// Enemy great powers broadcast against us in wartime; censorship and jamming blunt it.
const PG = { rally: ['Rally the Nation', 40, 'War support +3 a month for three months.'], unity: ['National Unity', 40, 'Stability +2 a month and radicals fade, for three months.'], recruit: ['Join Up!', 30, 'Volunteers: manpower +1.5% of the pool a month for three months.'],
  hate: ['Hate the Enemy', 35, 'Attack +3% and war support +4 for three months; stability -2; infamy +1.'], production: ['Work for Victory', 35, 'Output and war production +3% for three months.'], blame: ['Find the Culprits', 25, 'Stability +4 at once; radicals +3%; legitimacy -3.'] };
SPIRITS.pg_hate = ['Hate the Enemy', 'Posters, newsreels and songs.', { atk: 0.03, ws: 4, stab: -2 }]; SPIRITS.pg_prod = ['Work for Victory', 'Every shift a battle.', { output: 0.03, mil_out: 0.03 }];
const pgOf = c => c.pg || (c.pg = { cur: null, until: 0, used: {}, jam: 0, f: 1 });
function pgStart(c, k) { const g = pgOf(c), d = PG[k]; if (!d) return 'Unknown'; if (g.cur && g.until > G.day) return 'A campaign is already running'; if (c.pp < d[1]) return 'Not enough political power'; c.pp -= d[1];
  const n = (g.used[k] || []).filter(x => G.day - x < 365).length; g.used[k] = (g.used[k] || []).filter(x => G.day - x < 365).concat(G.day); g.f = Math.pow(0.7, n);
  if (k === 'blame') { c.stab = Math.min(100, c.stab + 4 * g.f); c.rad = Math.min(1, c.rad + 0.03); c.legitBonus = (c.legitBonus || 0) - 3; return ''; }
  g.cur = k; g.until = G.day + 90; if (k === 'hate') { addSpirit(c, 'pg_hate', 90); c.infamy += 1; } if (k === 'production') addSpirit(c, 'pg_prod', 90); return ''; }
function pgMonthly(c) { const g = pgOf(c);
  if (g.cur && g.until > G.day) { const f = g.f; if (g.cur === 'rally') c.ws = Math.min(100, c.ws + 3 * f); if (g.cur === 'unity') { c.stab = Math.min(100, c.stab + 2 * f); c.rad = Math.max(0, c.rad - 0.01 * f); } if (g.cur === 'recruit') c.manpower += maxManpower(c) * 0.015 * f; } else g.cur = null;
  if (isAtWar(c.tag)) { const sub = Math.min(1, enemiesOf(c.tag).filter(t => C(t) && C(t).major && !C(t).capitulated).length * 0.3) * (c.laws.speech === 'outlawed' ? 0.4 : c.laws.speech === 'censorship' ? 0.7 : 1) * (g.jam > G.day ? 0 : 1); c.ws = Math.max(0, c.ws - sub); g.sub = sub; } else g.sub = 0;
  if (c.ai && !(g.cur && g.until > G.day) && c.pp > 70) { const war = isAtWar(c.tag); if (war && c.ws < 50) pgStart(c, 'rally'); else if (c.stab < 35) pgStart(c, 'unity'); else if (war && c.manpower < maxManpower(c) * 0.15) pgStart(c, 'recruit'); else if (war && Math.random() < 0.3) pgStart(c, 'production'); } }
function pgJam(c) { if (c.pp < 20) return 'Needs 20 political power'; c.pp -= 20; pgOf(c).jam = G.day + 90; return ''; }
// ======================= 9. Defensive lines =======================
// Named lines of fortifications along a frontier. Each is built up level by level; while the whole line is held and
// garrisoned, its defenders are much harder to dislodge. When the enemy takes one province, the line is breached.
const DL0 = [['FRA', 'The Maginot Line', ['Strasbourg', 'Metz'], 4], ['GER', 'The Westwall', ['Saarbrücken', 'Koblenz', 'Freiburg'], 1], ['FIN', 'The Mannerheim Line', ['Viipuri'], 2], ['SOV', 'The Stalin Line', ['Minsk', 'Zhitomir', 'Proskurov', 'Polotsk'], 2],
  ['GRE', 'The Metaxas Line', ['Kavala', 'Alexandroupoli'], 1], ['CZE', 'The Czechoslovak Wall', ['Karlsbad', 'Reichenberg', 'Brno'], 2], ['BEL', 'The KW Line and Eben-Emael', ['Liège', 'Antwerp'], 2], ['HOL', 'The Dutch Water Line', ['Utrecht'], 1],
  ['ITA', 'The Alpine Wall', ['Turin', 'Bolzano'], 1], ['YUG', 'The Rupnik Line', ['Ljubljana', 'Zagreb'], 0], ['ROM', 'The Carol Line', ['Galați', 'Chișinău'], 0], ['SWI', 'The National Redoubt', ['Bern'], 2], ['POL', 'The Masurian Line', ['Grodno', 'Białystok'], 0]];
const dlAll = () => G.lines || (G.lines = DL0.filter(l => ok(l[0])).map((l, i) => ({ id: i + 1, owner: l[0], name: l[1], provs: l[2].map(n => PNAME[n]).filter(id => id !== undefined && P(id).owner === l[0]), level: l[3], gar: 0, intact: true, build: 0 })).filter(l => l.provs.length));
const dlOf = tag => dlAll().filter(l => l.owner === tag);
function dlInProv(tag, pid) { return dlAll().find(l => l.owner === tag && l.provs.includes(pid)); }
function dlMonthly() { for (const L of dlAll().slice()) { const c = C(L.owner); if (!c || !c.exists) { G.lines.splice(G.lines.indexOf(L), 1); continue; }
    const intact = L.provs.every(id => P(id).ctrl === L.owner); if (L.intact && !intact) { c.ws = Math.max(0, c.ws - 3); logMsg(`${L.name} is breached.`, c.major ? 'world' : 'info', [L.owner]); } L.intact = intact;
    L.gar = Math.min(1, sum(L.provs, id => sum(armiesAt(id).filter(a => a.owner === L.owner), a => a.divs.length)) / Math.max(1, L.provs.length * 2));
    if (L.build && G.day >= L.build) { L.build = 0; L.level = Math.min(5, L.level + 1); for (const id of L.provs) P(id).fort = Math.max(P(id).fort, L.level); if (L.owner === G.player) UIH.notify(`${L.name} is strengthened to level ${L.level}.`, 'good'); } }
  for (const c of alive()) { if (!c.ai || G.tension < 45 || Math.random() > 0.15) continue; const L = dlOf(c.tag).filter(l => !l.build && l.level < 5 && l.intact)[0]; if (L) dlUpgrade(c, L.id); } }
function dlCost(c, L) { return Math.round(4 * Math.max(200, (c.budget && c.budget.income) || 200) * Math.max(1, L.provs.length / 2)); }
function dlUpgrade(c, id) { const L = dlAll().find(l => l.id === id && l.owner === c.tag); if (!L) return 'Not our line'; if (L.build) return 'Already under construction'; if (L.level >= 5) return 'Already at its strongest'; const cost = dlCost(c, L); if (c.money < cost) return `Needs ${fmt(cost)}`; c.money -= cost; L.build = G.day + 90; return ''; }
function dlBorders(c) { const by = {}; for (const p of G.P) { if (p.owner !== c.tag || p.ctrl !== c.tag) continue; for (const e of NB[p.id]) { if (e.sea) continue; const o = P(e.to).owner; if (o !== c.tag && ok(o)) (by[o] = by[o] || new Set()).add(p.id); } } return Object.entries(by).map(([t, s]) => ({ t, provs: [...s].slice(0, 6) })).filter(x => !dlOf(c.tag).some(l => x.provs.every(id => l.provs.includes(id)))); }
function dlNew(c, vs) { if (c.pp < 30) return 'Surveying a new line costs 30 political power'; const b = dlBorders(c).find(x => x.t === vs); if (!b) return 'No open frontier there'; c.pp -= 30; dlAll().push({ id: G.nid++, owner: c.tag, name: `The ${c.adj}–${C(vs).adj} Line`, provs: b.provs, level: Math.round(sum(b.provs, id => P(id).fort) / b.provs.length), gar: 0, intact: true, build: 0 }); return ''; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (attacking || !armies.length) return r; const L = dlInProv(armies[0].owner, p.id); if (L && L.intact && L.level > 0) r.tough *= 1 + 0.04 * L.level * (0.4 + 0.6 * L.gar); return r; }; }
// ======================= 10. Summits and war conferences =======================
// Allies at war meet every ten months: the hardest-pressed member can demand a second front, the richest can be asked
// for aid, and later in the war the allies can agree on unconditional surrender, spheres of influence and the peace.
// Promises have deadlines: a second front promised and not opened costs friendship. In peacetime, a crisis that sets
// great powers against each other can end in a summit where the democracies decide whether to give way.
const smOf = () => G.summit || (G.summit = { next: {}, log: [], commits: [], plays: {} });
const struggling = t => isAtWar(t) && (capInfo(t).prog > 0.2 || C(t).warExh > 50);
const landContact = (t, foes) => G.P.some(p => p.ctrl === t && NB[p.id].some(e => !e.sea && foes.includes(P(e.to).ctrl)));
function smAgenda(f, foes) { const ms = f.members.filter(t => ok(t) && !C(t).capitulated && isAtWar(t)), majors = ms.filter(t => C(t).major), items = [];
  const hard = majors.filter(struggling).sort((a, b) => capInfo(b).prog - capInfo(a).prog)[0], idle = majors.filter(t => t !== hard && !landContact(t, foes))[0];
  if (hard && idle) items.push({ k: 'front', a: hard, b: idle, txt: `${cname(hard)} demands that ${cname(idle)} open a second front within a year.` });
  const rich = majors.filter(t => C(t).money > 25 * Math.max(200, C(t).budget.income || 200)).sort((a, b) => C(b).money - C(a).money)[0], poor = ms.filter(t => t !== rich && struggling(t))[0];
  if (rich && poor) items.push({ k: 'aid', a: poor, b: rich, txt: `${cname(poor)} asks ${cname(rich)} for rifles, aircraft and credit.` });
  if (G.wars.some(w => (w.att.includes(f.leader) || w.def.includes(f.leader)) && G.day - w.start > 700)) items.push({ k: 'uncond', txt: 'The allies will accept nothing less than unconditional surrender.' });
  if (foes.some(t => capInfo(t).prog > 0.45)) items.push({ k: 'spheres', txt: 'The allies divide the lands of the enemy into spheres of influence.' });
  if (year() >= 1943) items.push({ k: 'postwar', txt: 'A new world organisation will keep the peace after the war.' }); return items.slice(0, 4); }
function smApply(f, it, yes) { const ms = f.members.filter(t => ok(t) && !C(t).capitulated);
  if (it.k === 'front') { if (yes) { smOf().commits.push({ by: it.b, to: it.a, until: G.day + 365, foes: enemiesOf(it.a) }); addRel(it.a, it.b, 10); } else { addRel(it.a, it.b, -20); } }
  else if (it.k === 'aid' && yes) { const R = C(it.b), Q = C(it.a); const m = 10 * Math.max(200, R.budget.income || 200); R.money -= m; Q.money += m; for (const [g, n] of [['arms', 400], ['aircraft', 80], ['tanks', 30]]) { const x = Math.min(R.stock[g] || 0, n); R.stock[g] -= x; Q.stock[g] = (Q.stock[g] || 0) + x; } addRel(it.a, it.b, 15); }
  else if (it.k === 'uncond' && yes) { for (const t of ms) addSpirit(C(t), 'unconditional', 730); for (const e of enemiesOf(f.leader)) if (C(e)) addSpirit(C(e), 'fight_to_end', 730); }
  else if (it.k === 'spheres' && yes) { for (const t of ms) { const foes = enemiesOf(t); let n = 0; for (const p of G.P) { if (n >= 4) break; if (foes.includes(p.owner) && !p.claims.includes(t) && NB[p.id].some(e => !e.sea && P(e.to).ctrl === t)) { p.claims.push(t); n++; } } } claimCache(); }
  else if (it.k === 'postwar' && yes) { for (const t of ms) { C(t).infl += 30; C(t).stab = Math.min(100, C(t).stab + 2); } } }
SPIRITS.unconditional = ['Unconditional Surrender', 'There will be no negotiated peace.', { ws: 6 }]; SPIRITS.fight_to_end = ['Fight to the End', 'The enemy offers nothing but surrender.', { def: 0.03, ws: 4 }];
function smMonthly() { const S = smOf();
  for (const f of G.factions) { const foes = enemiesOf(f.leader); if (!foes.length || f.members.filter(t => ok(t) && isAtWar(t)).length < 2) continue; const key = f.name;
    if (!S.next[key]) { S.next[key] = G.day + 180; continue; } if (G.day < S.next[key]) continue; S.next[key] = G.day + 300;
    const items = smAgenda(f, foes); if (!items.length) continue; const VEN = f.leader === 'ENG' || f.leader === 'USA' ? ['Placentia Bay', 'Casablanca', 'Quebec', 'Cairo', 'Tehran', 'Yalta', 'Potsdam'] : f.leader === 'GER' ? ['Brenner', 'Salzburg', 'Klessheim', 'Berchtesgaden', 'Rastenburg'] : [P(C(f.leader).capital).name], venue = VEN[S.log.filter(x => x.f === key).length % VEN.length];
    const pl = G.player, mine = f.members.includes(pl) && !C(pl).ai;
    const decide = it => { const who = it.k === 'front' || it.k === 'aid' ? it.b : f.leader; if (who === pl && !C(pl).ai) return null; if (it.k === 'front') return opinion(it.b, it.a) > -10 && !hasSpirit(C(it.b), 'isolationism'); if (it.k === 'aid') return opinion(it.b, it.a) > 0; return true; };
    const auto = items.map(it => [it, decide(it)]), pending = auto.filter(x => x[1] === null);
    for (const [it, y] of auto) if (y !== null) smApply(f, it, y);
    S.log.push({ day: G.day, f: key, venue, items: auto.map(([it, y]) => ({ txt: it.txt, ok: y })) }); if (S.log.length > 20) S.log.shift();
    logMsg(`The leaders of the ${key} meet at ${venue}.`, 'world', f.members);
    if (mine) UIH.popup({ title: `The ${venue} Conference`, icon: '🤝', days: 20, def: 0, desc: `The leaders of the ${key} meet at ${venue}.<br>${auto.map(([it, y]) => `• ${it.txt}${y === true ? ' <span class="pos">Agreed.</span>' : y === false ? ' <span class="neg">Refused.</span>' : ''}`).join('<br>')}${pending.length ? '<br><br><b>We must answer:</b> ' + pending.map(x => x[0].txt).join(' ') : ''}`,
      options: pending.length ? [{ name: 'We agree.', fn: () => pending.forEach(([it]) => smApply(f, it, true)) }, { name: 'We refuse.', fn: () => pending.forEach(([it]) => smApply(f, it, false)) }] : [{ name: 'Understood.' }] }); }
  for (const k of S.commits.slice()) { const B = C(k.by); const met = B && G.P.some(p => p.ctrl === k.by && k.foes.includes(p.owner));
    if (met) { S.commits.splice(S.commits.indexOf(k), 1); addRel(k.to, k.by, 20); if (C(k.to)) C(k.to).ws = Math.min(100, C(k.to).ws + 5); logMsg(`${cname(k.by)} has opened the second front it promised ${cname(k.to)}.`, 'world', [k.by, k.to]); }
    else if (G.day > k.until) { S.commits.splice(S.commits.indexOf(k), 1); addRel(k.to, k.by, -30); if (C(k.to)) C(k.to).stab = Math.max(0, C(k.to).stab - 3); logMsg(`${cname(k.to)} accuses ${cname(k.by)} of breaking its promise of a second front.`, 'world', [k.by, k.to]); } }
  // crisis summits: great powers on both sides of a demand meet, and the democracies decide whether to give way
  for (const pl of (G.plays || []).slice()) { if (S.plays[pl.id] || G.tension < 35 || G.day - pl.day < 10) continue; const A = pl.A.filter(t => C(t) && C(t).major), B = pl.B.filter(t => t !== pl.b && C(t) && C(t).major); if (!A.length || !B.length) continue;
    S.plays[pl.id] = 1; const human = B.find(t => t === G.player && !C(t).ai), soft = !(G.historical && (G.flags.appeased || year() >= 1939)) && B.every(t => C(t).ai && (hasSpirit(C(t), 'appeasement') || C(t).ws < 50 || C(t).ideology === 'dem' && C(t).ws < 60)), venue = ['Munich', 'Berchtesgaden', 'Godesberg', 'Stresa', 'Geneva'][Object.keys(S.plays).length % 5];
    const appease = () => { G.flags.appeased = G.day; S.log.push({ day: G.day, f: 'Crisis summit', venue, items: [{ txt: `The powers agree that ${cname(pl.b)} must ${GOAL_TXT(pl.goal)}.`, ok: true }] }); logMsg(`The ${venue} Agreement: ${B.map(cname).join(' and ')} accept that ${cname(pl.b)} must ${GOAL_TXT(pl.goal)}.`, 'world', [pl.a, pl.b]); G.tension = Math.max(0, G.tension - 5);
      if (C(pl.b).ai && pl.goal.type === 'take' && typeof playSettle === 'function') playSettle(pl, pl.goal.provs); else { pl.B = [pl.b]; if (pl.b === G.player) UIH.notify(`At ${venue} our protectors have agreed to our partition. We stand alone.`, 'bad'); } };
    if (human) UIH.popup({ title: `A Summit at ${venue}`, icon: '🤝', days: 10, def: 1, desc: `${A.map(cname).join(' and ')} propose a summit at ${venue} to settle the crisis: ${cname(pl.a)} demands that ${cname(pl.b)} ${GOAL_TXT(pl.goal)}. Do we give way for the sake of peace?`, options: [{ name: 'Peace for our time.', tip: `${cname(pl.b)} is told to yield; world tension -5.`, fn: appease }, { name: 'We stand firm.', tip: 'The crisis goes on. World tension +3.', fn: () => { G.tension = Math.min(100, G.tension + 3); } }] });
    else if (soft) appease(); } }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); pwMonthly(); dzMonthly(); dlMonthly(); smMonthly(); }; }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.exists && !c.capitulated) pgMonthly(c); }; }

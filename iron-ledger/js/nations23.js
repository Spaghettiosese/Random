// 2.3 National systems for the three new trees.
//  - Portugal: the Oldest Alliance and the wolfram. Salazar's treasury fills with every balanced budget; in a European
//    war the wolfram of Panasqueira sells to Germany, to the Allies, to both or to no one, and each choice tilts
//    Portugal and spends or builds the credibility of its neutrality; Lisbon becomes the gangway of Europe for refugees;
//    the Azores can be leased to the Allies.
//  - Canada: conscription and the Commonwealth. The unity of English and French Canada against the needs of the war:
//    volunteers, home-defence conscription, the plebiscite and conscription for overseas service; the Air Training
//    Plan that trains the Commonwealth's aircrew; the Billion Dollar Gift.
//  - The Raj: the road to independence. Congress, the Muslim League and the princes; self-government won by talks or
//    by struggle; the Indian Army; Quit India; famine; independence, as one India or partitioned.
'use strict';
// ======================= Portugal =======================
const PT_WOLF = { both: ['Sell to Both', 'Wolfram to whoever pays: the best prices in Europe, and neither side is pleased.', 4, 0], axis: ['Sell to Germany', 'The Reich pays in gold, and Berlin is grateful.', 3, -5], allies: ['Sell to the Allies', 'The British and Americans buy it all to keep it from Germany.', 2.5, 5], embargo: ['Embargo', 'No wolfram leaves Portugal.', 0, 0] };
const ptOf = c => c.pt || (c.pt = { tilt: 10, wolf: 'both', cred: 60, gold: 20, ref: 0, visas: false, azores: false });
const ptWar = c => ok('GER') && ok('ENG') && atWar('GER', 'ENG') && !atWar(c.tag, 'GER') && !atWar(c.tag, 'ENG');
function ptMonthly(c) { const T = ptOf(c), war = ptWar(c);
  if (c.money > 0) T.gold = Math.min(250, T.gold + 1 + (c.laws.econ === 'corporatist' ? 0.5 : 0));
  if (war) { const w = PT_WOLF[T.wolf]; c.money += w[2] * (1 + (c.techs.p_deepdrill ? 0.25 : 0)); T.tilt = clamp(T.tilt + w[3] / 5, -100, 100);
    if (T.wolf === 'axis' || T.wolf === 'both') addRel('ENG', c.tag, T.wolf === 'axis' ? -2 : -0.5); if (T.wolf === 'allies' || T.wolf === 'both') addRel('GER', c.tag, T.wolf === 'allies' ? -2 : -0.5);
    T.cred = clamp(T.cred + (T.wolf === 'both' || T.wolf === 'embargo' ? 0.6 : -0.7) - Math.max(0, Math.abs(T.tilt) - 40) / 120, 0, 100);
    if (year() >= 1940 && year() <= 1944) { T.ref += T.visas ? 8 : 2; c.money += T.visas ? 0.6 : 0.2; if (T.visas) { c.legit = Math.min(100, c.legit + 0.4); addRel('GER', c.tag, -0.5); addRel('USA', c.tag, 0.6); } } }
  else T.cred = clamp(T.cred + 0.4, 0, 100);
  // a neutral nobody believes in invites invasion; in historical games neither side came
  if (war && !G.historical && T.cred < 15 && Math.random() < 0.08) { const by = T.tilt > 0 ? 'GER' : 'ENG'; if (ok(by) && C(by).ai && !atWar(by, c.tag)) declareWar(by, c.tag, [{ by, vs: c.tag, type: 'puppet' }]); }
  if (c.ai) { if (war && G.historical) T.wolf = year() >= 1944 ? 'embargo' : 'both'; if (war && year() >= 1943 && dateObj(G.day).getUTCMonth() >= 9 && !T.azores) ptAct(c, 'azores'); if (war && !T.visas && year() === 1940) T.visas = true; } }
function ptAct(c, a) { const T = ptOf(c);
  if (PT_WOLF[a]) { if (!ptWar(c)) return 'There is only a market for wolfram while Britain and Germany are at war'; T.wolf = a; return ''; }
  if (a === 'azores') { if (T.azores) return 'The bases are already leased'; if (!ptWar(c)) return 'Only while Britain is at war'; T.azores = true; T.tilt = clamp(T.tilt + 30, -100, 100); addRel('ENG', c.tag, 30); addRel('USA', c.tag, 20); addRel('GER', c.tag, -25); c.money += 10;
    logMsg('Portugal leases the Azores to the Allies under the alliance of 1373: air bases on Terceira close the Atlantic gap.', 'world', [c.tag, 'ENG']); if (ok('ENG')) addSpirit(C('ENG'), 'azores_bases'); return ''; }
  if (a === 'visas') { T.visas = !T.visas; return ''; }
  if (a === 'works') { if (T.gold < 25) return 'Needs 25 of the treasury'; T.gold -= 25; applyEff(c, { build: { construction: 1, railway: 1 } }); c.stab = Math.min(100, c.stab + 1); return ''; }
  if (a === 'arms') { if (T.gold < 25) return 'Needs 25 of the treasury'; T.gold -= 25; c.stock.arms = (c.stock.arms || 0) + 150; c.stock.artillery = (c.stock.artillery || 0) + 25; return ''; }
  return 'Unknown'; }
SPIRITS.azores_bases = ['The Azores Bases', 'Lajes and the harbours of the Azores close the air gap in the middle of the Atlantic.', { navy: 0.04 }];
// ======================= Canada =======================
const CA_CONS = { volunteer: ['Volunteers Only', 'No one is sent abroad who does not volunteer. Quebec is content.', {}], nrma: ['Home Defence Conscription', 'The National Resources Mobilization Act: conscripts serve in Canada only, the "zombies".', { manpower: 0.12 }], overseas: ['Conscription for Overseas Service', 'Conscripts go to Europe. Quebec feels betrayed.', { manpower: 0.25, stab: -3 }] };
for (const k in CA_CONS) SPIRITS['ca_' + k] = [CA_CONS[k][0], CA_CONS[k][1], CA_CONS[k][2]];
const caOf = c => c.ca || (c.ca = { unity: 62, cons: 'volunteer', bcatp: false, trained: 0, gift: 0, pleb: false });
function caSetCons(c, k) { const A = caOf(c); if (!CA_CONS[k] || A.cons === k) return 'Already in force'; if (k !== 'volunteer' && !isAtWar(c.tag)) return 'Only in war';
  if (k === 'overseas' && !A.pleb) return 'Hold the plebiscite first'; for (const x in CA_CONS) removeSpirit(c, 'ca_' + x); A.cons = k; addSpirit(c, 'ca_' + k);
  A.unity = clamp(A.unity - (k === 'nrma' ? 8 : k === 'overseas' ? 18 : -6), 0, 100); if (k === 'overseas') logMsg('Canada sends conscripts overseas. Riots in Montreal; a minister resigns.', 'info', [c.tag]); return ''; }
function caMonthly(c) { const A = caOf(c), war = isAtWar(c.tag);
  A.unity = clamp(A.unity + (war ? -0.25 : 0.3) - (A.cons === 'nrma' ? 0.2 : A.cons === 'overseas' ? 0.9 : 0) + (c.leader === 'William Lyon Mackenzie King' ? 0.15 : 0), 0, 100);
  if (A.unity < 35) { c.stab = Math.max(0, c.stab - 0.5); const R = typeof regsOf === 'function' ? regsOf(c) : []; if (R[0]) R[0].s = Math.min(100, R[0].s + 1.5); }
  if (A.bcatp && war) { A.trained += 1; if (ok('ENG') && atWar('ENG', enemiesOf(c.tag)[0] || 'ENG')) { const E = C('ENG'); E.stock.aircraft = (E.stock.aircraft || 0) + 4; } c.money -= 0.5; }
  if (c.ai && war) { if (A.cons === 'volunteer' && year() >= 1940 && G.day > mjDay(1940, 6)) caSetCons(c, 'nrma'); if (!A.bcatp) caAct(c, 'bcatp'); if (!A.pleb && year() >= 1942 && G.day > mjDay(1942, 4) + 26) caAct(c, 'pleb'); if (A.pleb && A.cons === 'nrma' && G.day > mjDay(1944, 11) + 22) caSetCons(c, 'overseas'); if (A.unity < 45 && c.pp > 60) caAct(c, 'king'); } }
function caAct(c, a) { const A = caOf(c);
  if (CA_CONS[a]) return caSetCons(c, a);
  if (a === 'king') { if (c.pp < 30) return 'Needs 30 political power'; c.pp -= 30; A.unity = Math.min(100, A.unity + 6); return ''; }
  if (a === 'pleb') { if (A.pleb) return 'Already held'; if (!isAtWar(c.tag)) return 'Only in war'; if (c.pp < 20) return 'Needs 20 political power'; c.pp -= 20; A.pleb = true; A.unity = Math.max(0, A.unity - 8);
    logMsg('Canada votes to release the government from its promise of no overseas conscription: 64% yes, but Quebec votes 72% no.', 'info', [c.tag]); return ''; }
  if (a === 'bcatp') { if (A.bcatp) return 'Already running'; if (!isAtWar(c.tag)) return 'Only in war'; A.bcatp = true; addSpirit(c, 'bcatp'); addRel('ENG', c.tag, 15); logMsg('The British Commonwealth Air Training Plan opens its schools on the prairies.', 'info', [c.tag, 'ENG']); return ''; }
  if (a === 'gift') { if (!ok('ENG') || !isAtWar('ENG')) return 'Britain is not at war'; if (c.money < 20) return 'Needs 20 in the treasury'; c.money -= 20; C('ENG').money += 20; A.gift += 1; addRel('ENG', c.tag, 15); return ''; }
  return 'Unknown'; }
SPIRITS.bcatp = ['The Air Training Plan', '131,000 aircrew from the whole Commonwealth learn to fly over the prairies.', { air: 0.05 }];
// ======================= the Raj =======================
const rjOf = c => c.rj || (c.rj = { cong: 55, league: 22, princes: 72, self: 20, unrest: 15, rep: 0, quit: false, famine: false, indep: false });
function rjMonthly(c) { const R = rjOf(c); if (R.indep) return; const war = isAtWar(c.tag) || (ok('ENG') && isAtWar('ENG'));
  R.cong = clamp(R.cong + (war ? 0.35 : 0.1) - (R.self > 60 ? 0.4 : 0) + (R.rep > 0 ? 0.15 : 0), 0, 100);
  R.league = clamp(R.league + (year() >= 1940 ? 0.35 : 0.1) + (c.flags.congResign ? 0.3 : 0) - (R.self > 80 ? 0.2 : 0), 0, 100);
  R.princes = clamp(R.princes - (R.self > 50 ? 0.25 : 0) + (R.self < 30 ? 0.1 : 0), 0, 100);
  R.unrest = clamp(R.unrest - 1 + (R.cong > 70 ? 1 : 0) + (R.famine ? 3 : 0) + (war ? 0.3 : 0), 0, 100);
  if (R.unrest > 50) c.stab = Math.max(0, c.stab - (R.unrest - 50) / 40);
  // Quit India: August 1942, when the Japanese are at the gate and the talks have failed
  if (!R.quit && war && year() >= 1942 && R.cong >= 72 && R.self < 50 && Math.random() < 0.12) { R.quit = true; R.unrest = Math.min(100, R.unrest + 30); c.stab = Math.max(0, c.stab - 8);
    logMsg('Quit India: Congress calls on the British to leave India now. The leaders are arrested within hours; the country rises.', 'world', [c.tag, 'ENG']); }
  // the Bengal famine: the rice of Burma is gone, the boats are seized, prices soar
  if (!R.famine && year() >= 1943 && war && G.P.some(p => p.name === 'Rangoon' && (atWar(c.tag, p.ctrl) || (ok('ENG') && atWar('ENG', p.ctrl))))) { R.famine = true; for (const n of ['Calcutta', 'Dacca', 'Chittagong']) { const p = PN(n); if (p && p.owner === c.tag) pmAdd(p, 'famine', 300); }
    logMsg('Famine in Bengal: the rice of Burma is lost, boats and stocks are seized against invasion, and prices quadruple.', 'world', [c.tag]); }
  if (R.famine && !G.P.some(p => p.owner === c.tag && p.pm && p.pm.famine > G.day)) R.famine = false;
  if (R.self >= 100) rjIndependence(c);
  if (c.ai) { if (R.unrest > 60 && c.pp > 50) rjAct(c, 'repress'); else if (R.cong > 65 && c.pp > 70 && (c.overlord ? C(c.overlord).ideology === 'dem' : true) && Math.random() < 0.15) rjAct(c, 'talks');
    if (R.famine && c.money > 15) rjAct(c, 'relief'); if (isAtWar(c.tag) && c.pp > 60 && Math.random() < 0.1) rjAct(c, 'recruit'); } }
function rjAct(c, a) { const R = rjOf(c); if (R.indep) return 'India is independent';
  if (a === 'talks') { if (c.pp < 40) return 'Needs 40 political power'; c.pp -= 40; R.self = Math.min(100, R.self + 10); R.cong = Math.max(0, R.cong - 5); R.league = Math.min(100, R.league + 3); R.princes = Math.max(0, R.princes - 3); return ''; }
  if (a === 'repress') { if (c.pp < 30) return 'Needs 30 political power'; c.pp -= 30; R.unrest = Math.max(0, R.unrest - 15); R.cong = Math.max(0, R.cong - 10); R.rep++; c.legit = Math.max(0, c.legit - 3); return ''; }
  if (a === 'recruit') { if (c.pp < 30) return 'Needs 30 political power'; c.pp -= 30; spawnDivisions(c, 'inf', 3, c.capital); c.manpower += 60; R.unrest = Math.min(100, R.unrest + 3); return ''; }
  if (a === 'princes') { if (c.pp < 20) return 'Needs 20 political power'; if (R.princes < 30) return 'The princes will not answer'; c.pp -= 20; spawnDivisions(c, 'inf', 1, c.capital); R.princes = Math.max(0, R.princes - 4); return ''; }
  if (a === 'relief') { if (c.money < 10) return 'Needs 10 in the treasury'; c.money -= 10; for (const p of G.P) if (p.owner === c.tag && p.pm && p.pm.famine) { delete p.pm.famine; p._pe = null; } R.famine = false; R.unrest = Math.max(0, R.unrest - 5); return ''; }
  return 'Unknown'; }
// independence: one India, or two states if the League is strong enough to insist on Pakistan
const PAK_PROVS = ['Lahore', 'Karachi', 'Peshawar', 'Quetta', 'Multan', 'Rawalpindi', 'Hyderabad (Sind)', 'Dacca', 'Chittagong'];
function newNation(from, tag, name, adj, color, ps, ideo) { const E = C(from), skip = new Set(['parties', 'leader', 'party', 'regimes', 'occ', 'cabinet', 'legacy', 'intel', 'proj', 'lend', 'rj', 'ca', 'pt', 'coal', 'regs', 'street', 'ops', 'airPlan', 'focus']);
  const r = G.C[tag] = JSON.parse(JSON.stringify(E, function (k, v) { return k[0] === '_' || (this === E && skip.has(k)) ? undefined : v; }));
  Object.assign(r, { tag, name, adj, color, ai: true, exists: true, capitulated: false, overlord: null, focus: { cur: null, prog: 0, done: {} }, gens: [], queue: [], pq: [], enact: null, rel: {}, money: 5, training: [], flags: {}, spirits: [], parties: null, infamy: 0, warExh: 0 });
  for (const k in r.stock) r.stock[k] = 0; r.capital = ps[0].id; for (const o of alive()) if (o.tag !== tag) { r.rel[o.tag] = 0; o.rel[tag] = 0; }
  for (const p of ps) { p.owner = tag; p.ctrl = tag; if (!p.cores.includes(tag)) p.cores.push(tag); } setIdeology(r, ideo, true); spawnDivisions(r, 'inf', Math.max(2, Math.round(ps.length / 2)), r.capital, 0.7); G._wc = null; UIH.mapDirty(); return r; }
function rjIndependence(c) { const R = rjOf(c); if (R.indep) return; R.indep = true; const o = c.overlord; c.overlord = null; c.autonomy = 100; if (o) addRel(c.tag, o, 20);
  const part = R.league >= 55; c.name = part ? 'Dominion of India' : 'Union of India'; c.adj = 'Indian'; if (c.ideology !== 'com' && c.ideology !== 'fas') setIdeology(c, 'dem', true);
  if (part && !G.C.PAK) { const ps = PAK_PROVS.map(n => PN(n)).filter(p => p && p.owner === c.tag); if (ps.length >= 3) { newNation(c.tag, 'PAK', 'Pakistan', 'Pakistani', '#2f7f3f', ps, 'dem'); logMsg('India is partitioned: Pakistan is born in the north-west and in eastern Bengal, amid the largest migration in history.', 'world', [c.tag, 'PAK']);
      for (const p of ps) { pmAdd(p, 'refugees', 365); civDeath(p, p.pop * 0.004, null, 'partition'); } } }
  logMsg(`${c.name} is independent${o ? ` of ${cname(o)}` : ''}. "At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom."`, 'world', [c.tag]); UIH.mapDirty(); }
// ======================= effects for the trees =======================
Object.assign(XTOK, {
  ptilt: v => [c => { const T = ptOf(c); T.tilt = clamp(T.tilt + +v, -100, 100); }, `Portugal leans ${+v > 0 ? 'towards the Allies' : 'towards the Axis'} (${Math.abs(+v)})`],
  pgold: v => [c => { ptOf(c).gold = Math.max(0, ptOf(c).gold + +v); }, `Salazar's treasury ${+v > 0 ? '+' : ''}${v}`],
  pcred: v => [c => { const T = ptOf(c); T.cred = clamp(T.cred + +v, 0, 100); }, `Credibility of our neutrality ${+v > 0 ? '+' : ''}${v}`],
  pvisas: () => [c => { ptOf(c).visas = true; }, 'Visas for every refugee who asks'],
  pazores: () => [c => ptAct(c, 'azores'), 'Lease the Azores bases to the Allies'],
  caunity: v => [c => { const A = caOf(c); A.unity = clamp(A.unity + +v, 0, 100); }, `National unity ${+v > 0 ? '+' : ''}${v}`],
  cacons: v => [c => caSetCons(c, v.trim()), `Conscription: ${CA_CONS[v.trim()][0]}`],
  cabcatp: () => [c => caAct(c, 'bcatp'), 'The Air Training Plan begins'],
  capleb: () => [c => caAct(c, 'pleb'), 'Hold the conscription plebiscite'],
  rjself: v => [c => { const R = rjOf(c); R.self = clamp(R.self + +v, 0, 100); }, `Indian self-government ${+v > 0 ? '+' : ''}${v}`],
  rjcong: v => [c => { const R = rjOf(c); R.cong = clamp(R.cong + +v, 0, 100); }, `Congress ${+v > 0 ? '+' : ''}${v}`],
  rjleague: v => [c => { const R = rjOf(c); R.league = clamp(R.league + +v, 0, 100); }, `Muslim League ${+v > 0 ? '+' : ''}${v}`],
  rjprinces: v => [c => { const R = rjOf(c); R.princes = clamp(R.princes + +v, 0, 100); }, `Loyalty of the princes ${+v > 0 ? '+' : ''}${v}`],
  rjunrest: v => [c => { const R = rjOf(c); R.unrest = clamp(R.unrest + +v, 0, 100); }, `Unrest ${+v > 0 ? '+' : ''}${v}`],
  rjindep: () => [c => rjIndependence(c), 'India becomes independent']
});
Object.assign(REQX, {
  ptwar: () => [c => ptWar(c), 'Britain and Germany are at war, and we are not'],
  tilt: v => [c => (+v >= 0 ? ptOf(c).tilt >= +v : ptOf(c).tilt <= +v), `Our lean ${+v >= 0 ? 'towards the Allies' : 'towards the Axis'} at least ${Math.abs(+v)}`],
  unity: v => [c => caOf(c).unity >= +v, `National unity ${v} or more`],
  self: v => [c => rjOf(c).self >= +v, `Self-government ${v} or more`],
  cong: v => [c => rjOf(c).cong >= +v, `Congress ${v} or more`],
  league: v => [c => rjOf(c).league >= +v, `Muslim League ${v} or more`]
});
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (!c.exists) return; const t = c.tag.slice(0, 3); try { if (t === 'POR') ptMonthly(c); else if (t === 'CAN') caMonthly(c); else if (t === 'RAJ') rjMonthly(c); } catch (e) { if (typeof console !== 'undefined') console.warn(t, e); } }; }

// 2.7 Vichy France. When Paris has fallen and the French armies are broken, France does not simply capitulate: it
// asks for an armistice. The north and the Atlantic coast are occupied; Alsace and the Moselle go to the Reich; the
// south and the Empire become the French State under Marshal Pétain, neutral, disarmed, paying for its own occupation.
// The Republic lives on in London as Free France (the old nation, in exile). The colonies choose between them one by
// one; the British strike at what might serve Germany; and on the day the Allies land in North Africa, or the day
// Berlin loses patience, the Germans cross the demarcation line. A player France chooses its road in the hour of
// decision: the Marshal, London, Algiers, or union with Britain.
'use strict';
const VZ_FREE = ['Vichy', 'Lyon', 'Marseille', 'Toulouse', 'Limoges', 'Clermont-Ferrand', 'Grenoble', 'Montpellier', 'Perpignan', 'Toulon', 'Nice', 'Ajaccio'];
const VZ_REICH = ['Strasbourg', 'Mulhouse', 'Metz'];
const VZ_ITALY = ['Nice', 'Grenoble', 'Ajaccio'];
// the Empire: [name, loyalty to the Marshal in June 1940, provinces]
const VEMP = {
  northafrica: ['French North Africa', 82, ['Algiers', 'Oran', 'Constantine', 'Bône', 'Biskra', 'Laghouat', 'Tlemcen', 'Colomb-Béchar', 'Tamanrasset', 'Rabat', 'Marrakech', 'Casablanca', 'Fez', 'Agadir', 'Oujda', 'Tunis', 'Sfax', 'Bizerte', 'Gabès', 'Kasserine']],
  westafrica: ['French West Africa', 76, ['Dakar', 'Bamako', 'Atar', 'Niamey', 'Conakry', 'Abidjan', 'Ouagadougou', 'Lomé', 'Porto-Novo']],
  equatorial: ['French Equatorial Africa', 30, ['Brazzaville', 'Libreville', 'Yaoundé', 'Bangui', 'Fort-Lamy']],
  levant: ['The Levant', 66, ['Damascus', 'Beirut', 'Aleppo', 'Homs', 'Latakia', 'Deir ez-Zor', 'Alexandretta']],
  indochina: ['Indochina', 74, ['Hanoi', 'Haiphong', 'Hue', 'Saigon', 'Vinh', 'Nha Trang', 'Lang Son', 'Vientiane', 'Luang Prabang', 'Phnom Penh', 'Fort-Bayard']],
  madagascar: ['Madagascar', 70, ['Tananarive']],
  djibouti: ['French Somaliland', 72, ['Djibouti']],
  pacific: ['New Caledonia', 24, ['Nouméa']],
  guiana: ['Guiana', 56, ['Cayenne']]
};
const VEMP_GAR = { northafrica: 9, westafrica: 3, equatorial: 1, levant: 3, indochina: 4, madagascar: 1, djibouti: 1 };
if (typeof COLONIAL !== 'undefined' && !COLONIAL.includes('VIC')) COLONIAL.push('VIC');
SPIRITS.vi_armistice = ['The Armistice', 'A hundred thousand men, no tanks, no heavy guns, and the fleet disarmed in its ports.', { manpower: -0.5, mil_out: -0.45 }];
SPIRITS.vi_marshal = ['The Victor of Verdun', 'The country has given itself to an old soldier who promises to share its misfortune.', { stab: 6, legit: 6 }];
SPIRITS.vi_occupied = ['Under the Boot', 'The whole of France is occupied. The government at Vichy signs what is put before it.', { stab: -6, legit: -10, tax: -0.1 }];
SPIRITS.fr_fightson = ['France Fights On', 'The Republic has left the mainland, not the war. The Empire, the fleet and the gold are in Algiers.', { ws: 10, caplimit: 0.3, stab: -4 }];
SPIRITS.fb_union = ['The Franco-British Union', 'One cabinet, one parliament, one citizenship: France and Great Britain shall no longer be two nations.', { ws: 6, stab: -3, research: 0.03 }];
const vichy = () => { const v = G.C.VIC; return v && v.exists ? v : null; };
// a nation made from another (newNation copies its parent) must not inherit its parent's standing, envoys, fleet of
// merchantmen, army groups, cooldowns or production lines
function freshState(r, o = {}) { Object.assign(r, { major: false, envoys: [], dcd: {}, agroups: [], pp: o.pp || 30, infl: o.infl || 10, manpower: o.manpower || 20 }); for (const k of ['sea', 'prod', 'gpRank', 'gpStatus', 'gpScore', 'deployTo', 'formed', 'dynp', 'fr', 'reform']) delete r[k]; if (o.money !== undefined) r.money = o.money; return r; }
const viOf = () => { const v = vichy(); return v ? v.vi : null; };
const viProvs = k => VEMP[k][2].map(n => PN(n)).filter(Boolean);
const viHolds = k => viProvs(k).filter(p => p.owner === 'VIC');
const frHost = () => { const fr = C('FRA'); if (fr && fr.exists && !fr.capitulated) return 'FRA'; const ex = typeof exiles === 'function' ? exiles().FRA : null; return ex && ok(ex.host) ? ex.host : ok('ENG') ? 'ENG' : null; };
// ======================= the hour of decision =======================
function armisticeDue() { const fr = C('FRA'), paris = PN('Paris'); if (!fr || !fr.exists || fr.capitulated || G.flags.armistice || G.C.VIC || fr.overlord || fr.flags.algiers || !ok('GER') || !atWar('FRA', 'GER') || !paris || year() > 1943) return false;
  const k = C(paris.ctrl); return paris.ctrl === 'GER' || (!!k && atWar('FRA', paris.ctrl) && (k.overlord === 'GER' || friendly('GER', paris.ctrl))); }
let ARM_BUSY = false;
// (France capitulates once a day at most: a war that ends with the armistice makes peace and clears the flag, and the
// next check the same day must not capitulate the government in exile a second time)
{ const _cap = capitulate; capitulate = function (tag) { if (tag === 'FRA' && !ARM_BUSY && G.flags.fraCap === G.day) return; if (tag !== 'FRA' || ARM_BUSY || !armisticeDue()) { const r = _cap(tag); if (tag === 'FRA') G.flags.fraCap = G.day; return r; }
  ARM_BUSY = true; try { armisticeAsk(() => _cap('FRA')); } finally { ARM_BUSY = false; } G.flags.fraCap = G.day; }; }
function armisticeAsk(cap) { const fr = C('FRA'), hum = t => t === G.player && C(t) && !C(t).ai;
  // the armistice is signed first, then France capitulates: a peace that ends the war at once must not hand the Empire to the victor
  const grant = (harsh, play) => { const ships0 = fr.stock.ships || 0; ARM_BUSY = true; try { armistice({ harsh, ships0 }); cap(); armisticeAfter(ships0); } finally { ARM_BUSY = false; } if (play && vichy()) { vichy().pp = Math.max(vichy().pp, fr.pp); switchPlayer('VIC'); vichy().ai = false; if (typeof renderAll === 'function') renderAll(); } };
  const none = () => { G.flags.armistice = -1; ARM_BUSY = true; try { cap(); } finally { ARM_BUSY = false; } logMsg('There is no armistice. The German army occupies the whole of France; the Empire and the fleet fight on beside Britain.', 'world', ['FRA', 'GER']); };
  if (hum('FRA')) return UIH.popup({ title: 'The Hour of Decision', icon: '⚖️', desc: 'Paris has fallen. The armies are cut to pieces and eight million people are on the roads. At Bordeaux the cabinet is split: Marshal Pétain says the fighting must stop; General de Gaulle has a seat on an aeroplane to London; the Empire, the fleet and the gold are untouched; and Mr Churchill offers something no one has heard of before.',
    options: [{ name: 'Ask for an armistice. I stay with the Marshal.', tip: 'The north and the Atlantic coast are occupied; the south and the Empire become the French State. <b>You play on as Vichy France</b>, with its own national focus tree.', fn: () => grant(false, true) },
      { name: 'Ask for an armistice. I go to London.', tip: 'The same armistice, but <b>you play on as Free France</b>, a government in exile that must win back the Empire colony by colony.', fn: () => grant(false, false) },
      { name: 'No armistice. The government sails for Algiers.', tip: 'France fights on from North Africa with the fleet and the Empire. The mainland will be lost province by province; the Republic does not capitulate while Algiers holds.', fn: () => fraAlgiers() },
      ...(ok('ENG') && friendly('FRA', 'ENG') ? [{ name: 'Accept the Franco-British Union.', tip: 'France and Britain become one state. <b>You play on as the Union</b>, from London, with the French armies, fleet and Empire under one flag.', fn: () => francoBritish() }] : [])] });
  if (hum('GER')) return UIH.popup({ title: 'France Asks for an Armistice', icon: '🚂', desc: 'Marshal Pétain has asked, through Madrid, on what terms the fighting may cease. The railway carriage of 1918 can be brought out of its museum. How much shall we leave them?',
    options: [{ name: 'The north and the coast. Leave them a government in the south.', tip: 'Vichy France is created: neutral, disarmed, paying the costs of our occupation, and keeping its Empire and fleet out of British hands. We can end it whenever we choose (Case Anton).', fn: () => grant(false) },
      { name: 'Harsh terms: the fleet and the African bases too.', tip: 'Half the time they sign, and collaborate from the first day. Half the time they refuse, and the fleet and the Empire fight on from Algiers.', fn: () => (Math.random() < 0.5 ? grant(true) : fraAlgiers()) },
      { name: 'No armistice. Occupy everything.', tip: 'France capitulates as any nation does: the Empire and what escapes of the fleet go on fighting beside Britain.', fn: none }] });
  const r = Math.random(); if (G.historical || r < 0.82) grant(false); else if (r < 0.9) none(); else fraAlgiers(); }
// ---------- the armistice of Compiègne ----------
function armistice(o) { const fr = C('FRA'), cap = PN('Vichy'); if (!cap) return; G.flags.armistice = G.day;
  const ours = p => p && (p.owner === 'FRA' || (C(p.owner) && C(p.owner).collabOf === 'FRA')), zone = VZ_FREE.map(n => PN(n)).filter(p => ours(p) && !(p.ctrl !== 'FRA' && atWar('GER', p.ctrl))), emp = [];
  for (const k in VEMP) for (const p of viProvs(k)) if (p.owner === 'FRA') emp.push(p);
  if (!zone.includes(cap)) return; const v = newNation('FRA', 'VIC', 'French State', 'French', '#6f8fb5', [cap, ...zone.filter(p => p !== cap), ...emp], 'aut');
  for (const p of emp) p.cores = p.cores.filter(t => t !== 'VIC'); for (const a of armiesOf('VIC')) removeArmy(a);
  freshState(v, { pp: 60, infl: 20, manpower: 120, money: 6 * wkInc(fr) }); Object.assign(v, { leader: 'Philippe Pétain', party: 'National Revolution', capital: cap.id, ai: true, stab: 62, ws: 20, warExh: 0, infamy: 0, exists: true, capitulated: false });
  try { setLaw(v, 'autocracy'); } catch (e) { /* the form of government keeps what it had */ }
  v.stock.ships = (o.ships0 || 0) * 0.8; v.stock.arms = 500; v.stock.artillery = 50; v.stock.aircraft = Math.min(300, (fr.stock.aircraft || 0) * 0.5);
  v.vi = { collab: o.harsh ? 55 : 25, press: 8, marshal: 86, pow: 1500, cost: 3, fleet: 1, emp: {}, since: G.day, axis: false };
  for (const k in VEMP) if (viHolds(k).length) v.vi.emp[k] = VEMP[k][1] - (o.harsh ? 10 : 0);
  addSpirit(v, 'vi_armistice'); addSpirit(v, 'vi_marshal');
  // the Armistice Army in the free zone, and the garrisons of the Empire
  spawnDivisions(v, 'inf', 3, cap.id, 0.6); for (const n of ['Lyon', 'Marseille', 'Toulouse', 'Toulon']) { const p = PN(n); if (p && p.owner === 'VIC') spawnDivisions(v, 'inf', 1, p.id, 0.6); }
  for (const k in VEMP_GAR) { const ps = viHolds(k); if (!ps.length) continue; const n = VEMP_GAR[k], sites = ps.sort((a, b) => b.vp - a.vp).slice(0, Math.max(1, Math.ceil(n / 3))); for (let i = 0; i < n; i++) spawnDivisions(v, i % 4 === 3 ? 'cav' : 'inf', 1, sites[i % sites.length].id, 0.7); }
  for (const a of armiesOf('VIC')) a.auto = true;
  // the Reich takes Alsace and the Moselle; everyone else leaves the free zone
  for (const n of VZ_REICH) { const p = PN(n); if (p && ours(p) && (p.ctrl === 'GER' || friendly('GER', p.ctrl))) { p.owner = 'GER'; p.ctrl = 'GER'; if (!p.claims.includes('FRA')) p.claims.push('FRA'); } }
  for (const r of alive()) if (r.collabOf === 'FRA' && r.overlord === 'GER' && r.stype === 'collab') { r.stype = 'milgov'; r.name = 'Military Administration in France'; }
  viExpel(); addPact('nap', 'VIC', 'GER'); if (ok('ITA')) addPact('nap', 'VIC', 'ITA'); addRel('VIC', 'GER', -10); if (ok('ENG')) addRel('VIC', 'ENG', -10); addRel('VIC', 'FRA', -50);
  fr.stock.ships = 0; G._wc = null; claimCache(); UIH.mapDirty();
  logMsg('The armistice is signed at Compiègne, in the railway carriage of 1918. Three fifths of France are occupied; Marshal Pétain governs the rest from the spa town of Vichy.', 'world', ['FRA', 'VIC', 'GER']);
  if (typeof worldNews === 'function') worldNews('Armistice at Compiègne', 'France has laid down its arms. The north and the Atlantic coast are occupied by Germany; Alsace and the Moselle are annexed to the Reich. In the south a new French State under Marshal Pétain keeps the Empire and the fleet, and declares itself neutral. In London a general named de Gaulle says France has lost a battle, not the war.', '🚂', []); }
// the fleet stays with the Marshal; a handful of ships and men reach England
function armisticeAfter(ships0) { const host = frHost(); if (host && host !== 'FRA') { const h = C(host); h.stock.ships = Math.max(0, h.stock.ships - (ships0 || 0) * 0.3); for (const a of armiesOf(host)) if (a.exileOf === 'FRA' && a.divs.length > 1) a.divs.length = 1; } C('FRA').stock.ships = 0; viExpel(); UIH.mapDirty(); }
// armies that have no business on the French State's ground go back to the nearest ground of their own
function viExpel() { for (const id in G.armies) { const a = G.armies[id], p = P(a.loc); if (p.owner !== 'VIC' || a.owner === 'VIC') continue; const seen = new Set([a.loc]); let cur = [a.loc], to = null;
    for (let d = 0; d < 12 && to === null && cur.length; d++) { const nx = []; for (const x of cur) for (const e of NB[x]) { if (seen.has(e.to)) continue; seen.add(e.to); const q = P(e.to); if (q.owner !== 'VIC' && (q.ctrl === a.owner || (friendly(a.owner, q.ctrl) && !atWar(a.owner, q.ctrl)))) { to = e.to; break; } nx.push(e.to); } cur = nx; }
    if (to === null) to = C(a.owner).capital; if (a.battle) leaveBattle(a); a.loc = to; a.path = []; a.prog = 0; } }
// ---------- no armistice: Algiers, or union with Britain ----------
function fraAlgiers() { const fr = C('FRA'), al = PN('Algiers'); if (!al || al.owner !== 'FRA' || al.ctrl !== 'FRA') { G.flags.armistice = -1; ARM_BUSY = true; try { capitulate('FRA'); } finally { ARM_BUSY = false; } return; }
  G.flags.armistice = -2; fr.flags.algiers = G.day; fr.capital = al.id; addSpirit(fr, 'fr_fightson'); for (const n of ['Algiers', 'Oran', 'Constantine', 'Bône', 'Tunis', 'Rabat', 'Casablanca']) { const p = PN(n); if (p && p.owner === 'FRA' && !p.cores.includes('FRA')) p.cores.push('FRA'); }
  logMsg('No armistice: the French government, the fleet and what can be saved of the army cross to Algiers. France fights on from the Empire.', 'world', ['FRA', 'GER']);
  if (typeof worldNews === 'function') worldNews('France Fights On', 'The Republic has refused to ask for terms. The President, the chambers and the Bank of France have sailed for Algiers; the fleet has left Toulon. The mainland is lost, but four hundred thousand men and the second navy of Europe remain in the war.', '⚓', []); }
function francoBritish() { const en = C('ENG'), fr = C('FRA'), pl = G.player === 'FRA' && !fr.ai; G.flags.armistice = -3; annex('ENG', 'FRA', true); en.name = 'Franco-British Union'; en.adj = 'Franco-British'; addSpirit(en, 'fb_union'); if (pl) { switchPlayer('ENG'); en.ai = false; }
  logMsg('"France and Great Britain shall no longer be two nations, but one Franco-British Union." The offer telegraphed to Bordeaux on 16 June is accepted.', 'world', ['ENG', 'GER']);
  if (typeof worldNews === 'function') worldNews('The Franco-British Union', 'Two empires have become one state, with a single war cabinet and a common citizenship. Its capital is London; its armies, fleets and colonies fight on wherever they stand.', '🤝', []); if (typeof renderAll === 'function') renderAll(); }
// France that has moved to Algiers does not capitulate while Algiers holds
{ const _cc = checkCapitulation; checkCapitulation = function (tag) { if (tag === 'FRA') { const fr = C('FRA'), al = PN('Algiers'); if (fr && fr.flags.algiers && al && (al.ctrl === 'FRA' || (friendly('FRA', al.ctrl) && !atWar('FRA', al.ctrl)))) return; } return _cc(tag); }; }
// while the Marshal governs, the occupier sets up no second French State beside his
{ const _cr = createRegime; createRegime = function (c, e, kind, opt) { return _cr(c, e, e === 'FRA' && kind === 'collab' && vichy() ? 'milgov' : kind, opt); }; }
// ======================= the Empire chooses =======================
// a region passes to Free France: part of its garrison comes over, the rest goes home or lays down its arms
function viRally(k, how, defect) { const v = vichy(), ps = viHolds(k); if (!v || !ps.length) return false; const host = frHost(); if (!host) return false; const ids = new Set(ps.map(p => p.id)), fr = C('FRA'), H = C(host);
  let over = 0; for (const a of armiesOf('VIC')) { if (!ids.has(a.loc)) continue; const n = Math.round(a.divs.length * (defect === undefined ? 0.5 : defect)); over += n; removeArmy(a); }
  for (const p of ps) { p.owner = 'FRA'; p.ctrl = host; p.cores = p.cores.filter(t => t !== 'VIC'); }
  if (over) { const at = ps.sort((a, b) => b.vp - a.vp)[0], a = newArmy(H, at.id); a.name = host === 'FRA' ? `Army of ${VEMP[k][0]}` : 'Free French Forces'; if (host !== 'FRA') a.exileOf = 'FRA'; a.auto = true; for (let i = 0; i < over; i++) a.divs.push({ t: 'inf', str: 0.7, org: 0.6, xp: 0.2 }); }
  delete v.vi.emp[k]; const ex = typeof exiles === 'function' ? exiles().FRA : null; if (ex) ex.legit = Math.min(100, ex.legit + 5); v.vi.marshal = Math.max(0, v.vi.marshal - 3); G._wc = null; UIH.mapDirty();
  logMsg(how || `${VEMP[k][0]} rallies to Free France.`, 'world', ['VIC', 'FRA']); if (!Object.keys(v.vi.emp).length && !VZ_FREE.some(n => PN(n) && PN(n).owner === 'VIC')) viEnd('The French State has nothing left to govern.'); return true; }
function empMonthly(v) { const V = v.vi, ex = typeof exiles === 'function' ? exiles().FRA : null, gl = ok('GER') && capInfo('GER').prog > 0.1, usa = ok('USA') && ok('GER') && atWar('USA', 'GER');
  for (const k of Object.keys(V.emp)) { const ps = viHolds(k); if (!ps.length) { delete V.emp[k]; continue; } const ids = new Set(ps.map(p => p.id)), gar = sum(armiesOf('VIC').filter(a => ids.has(a.loc)), a => a.divs.length);
    V.emp[k] = clamp(V.emp[k] + (V.marshal - 70) / 60 - (ex ? ex.legit / 90 : 0.5) - (gl ? 0.7 : 0) - (usa ? 0.5 : 0) + Math.min(0.5, gar * 0.08) - (V.collab > 60 ? 0.3 : 0), 0, 100);
    if (V.emp[k] < 30 && k !== 'indochina') viRally(k); }
  // the Three Glorious Days: Chad, Cameroon and the Congo rally to de Gaulle at the end of August 1940
  if (G.historical && V.emp.equatorial !== undefined && G.day >= mjDay(1940, 8) + 25) viRally('equatorial', 'Les Trois Glorieuses: Félix Éboué brings Chad over to Free France, and Leclerc and a dozen men take Douala and Brazzaville. French Equatorial Africa is in the war again.', 0.7); }
// ---------- the Allies' operations against the French State (no war is declared) ----------
const VOPS = {
  catapult: ['Operation Catapult', 'Mers-el-Kébir', 'The French fleet must not fall into German hands. Our battleships offer it four choices at Oran, and open fire when the hour runs out.', 0],
  menace: ['Operation Menace', 'Dakar', 'A Free French landing at Dakar, with the Royal Navy behind it, to bring West Africa over.', 0],
  exporter: ['Operation Exporter', 'the Levant', 'German aircraft are refuelling at Aleppo on their way to Iraq. British, Indian, Australian and Free French columns cross into Syria and Lebanon.', 0],
  ironclad: ['Operation Ironclad', 'Madagascar', 'Diego-Suarez is the best harbour in the Indian Ocean, and the Japanese fleet has been seen off Ceylon.', 0],
  torch: ['Operation Torch', 'North Africa', 'A hundred thousand men land at Casablanca, Oran and Algiers. The Army of Africa must decide whom it serves.', 0] };
function vopCan(c, id) { const v = vichy(); if (!v) return 'There is no French State'; const V = v.vi; if (V.ops && V.ops[id]) return 'Already done'; if (!ok('GER') || !atWar(c.tag, 'GER')) return 'Only while we fight Germany';
  if (id === 'catapult') return v.stock.ships > 5 ? '' : 'There is no fleet left to seize'; if (id === 'menace') return viHolds('westafrica').length ? '' : 'West Africa is not Vichy\'s';
  if (id === 'exporter') return !viHolds('levant').length ? 'The Levant is not Vichy\'s' : ['Jerusalem', 'Amman', 'Baghdad', 'Mosul'].some(n => { const p = PN(n); return p && (p.ctrl === c.tag || friendly(c.tag, p.ctrl)); }) ? '' : 'We need a base in Palestine or Iraq';
  if (id === 'ironclad') return !viHolds('madagascar').length ? 'Madagascar is not Vichy\'s' : navalPower(c) > navalPower(v) ? '' : 'Our fleet is too weak';
  if (id === 'torch') return !viHolds('northafrica').length ? 'North Africa is not Vichy\'s' : (ok('USA') && atWar('USA', 'GER')) || c.tag === 'USA' ? '' : 'Needs the United States in the war'; return 'Unknown'; }
function vopDo(c, id) { const why = vopCan(c, id); if (why) return why; const v = vichy(), V = v.vi; (V.ops = V.ops || {})[id] = G.day; const ex = typeof exiles === 'function' ? exiles().FRA : null;
  if (id === 'catapult') { V.catapult = G.day; const lost = v.stock.ships * 0.3; v.stock.ships -= lost; c.stock.ships = Math.max(0, c.stock.ships - lost * 0.04); addRel('VIC', c.tag, -60); V.marshal = Math.min(100, V.marshal + 4); V.press = Math.max(0, V.press - 6); for (const k in V.emp) V.emp[k] = Math.min(100, V.emp[k] + 8); if (ex) ex.legit = Math.max(0, ex.legit - 6); if (ok('USA')) addRel('USA', c.tag, 6);
    logMsg('Mers-el-Kébir: the Royal Navy opens fire on the French fleet at anchor. Bretagne blows up; twelve hundred and ninety-seven French sailors are dead. Vichy breaks off relations with London.', 'world', ['VIC', c.tag]); }
  else if (id === 'menace') { if (V.emp.westafrica < 58) viRally('westafrica', 'Dakar opens its gates to General de Gaulle: French West Africa is in the war again.', 0.6); else { V.emp.westafrica = Math.min(100, V.emp.westafrica + 8); if (ex) ex.legit = Math.max(0, ex.legit - 8); c.stock.ships = Math.max(0, c.stock.ships - 2); addRel('VIC', c.tag, -15);
      logMsg('Dakar: Governor Boisson answers the Free French envoys with gunfire, and the battleship Richelieu answers the Royal Navy. After three days in the fog the expedition sails away.', 'world', ['VIC', c.tag]); } }
  else if (id === 'exporter') { const ids = new Set(viHolds('levant').map(p => p.id)), gar = sum(armiesOf('VIC').filter(a => ids.has(a.loc)), armyStr), near = sum(Object.values(G.armies).filter(a => (a.owner === c.tag || friendly(c.tag, a.owner)) && ['Jerusalem', 'Nablus', 'Amman', 'Baghdad', 'Mosul', 'Kuwait'].includes(P(a.loc).name)), armyStr);
    if (near * 1.3 >= gar) viRally('levant', 'After five weeks of fighting between Frenchmen, General Dentz signs the armistice of Saint-Jean-d\'Acre: Syria and Lebanon pass to Free France.', 0.2); else { addRel('VIC', c.tag, -20); V.emp.levant = Math.min(100, V.emp.levant + 6); logMsg('The columns that crossed into Syria are thrown back on the Litani. The Levant stays with Vichy.', 'world', ['VIC', c.tag]); delete V.ops[id]; } }
  else if (id === 'ironclad') viRally('madagascar', 'British troops land at Diego-Suarez; after six months of slow retreat the governor of Madagascar surrenders, and the island passes to Free France.', 0.2);
  else if (id === 'torch') { G.flags.torch = G.day; const ga = V.emp.northafrica || 0; viRally('northafrica', ga > 60 ? 'Operation Torch: after three days of fighting at Casablanca and Oran, Admiral Darlan, caught in Algiers by chance, orders a cease-fire in the Marshal\'s name. The Army of Africa turns its guns on the Axis.' : 'Operation Torch: the Army of Africa greets the landings with open arms. North Africa is in the war again.', 0.75);
    if (viHolds('westafrica').length) viRally('westafrica', 'Governor Boisson brings French West Africa over to the Allies without a shot.', 0.8); fraRebirth(); caseAnton('The Allies are in Algiers.'); }
  return ''; }
// the Republic takes up its seat again, in Algiers until Paris is free
function fraRebirth() { const fr = C('FRA'), al = PN('Algiers'); if (!fr || !fr.exists || !fr.capitulated || !al || al.owner !== 'FRA') return; fr.capitulated = false; fr.flags.algiers = G.day; fr.capital = al.id; fr.leader = 'Charles de Gaulle'; fr.party = 'French Committee of National Liberation';
  for (const p of G.P) if (p.owner === 'FRA' && p.ctrl !== 'FRA' && !atWar('FRA', p.ctrl) && (friendly('FRA', p.ctrl) || p.ctrl === 'ENG' || p.ctrl === 'USA')) p.ctrl = 'FRA';
  for (const a of Object.values(G.armies)) if (a.exileOf === 'FRA') { a.owner = 'FRA'; a.name = a.name.replace('Free French Forces', 'French Army of Liberation'); delete a.exileOf; }
  if (typeof exiles === 'function') delete exiles().FRA; fr.stab = Math.max(fr.stab, 50); fr.ws = Math.max(fr.ws, 60); fr.manpower = Math.max(fr.manpower, 150); G._wc = null; UIH.mapDirty();
  logMsg('The French Committee of National Liberation takes its seat in Algiers: France has a government on French soil and an army in the field again.', 'world', ['FRA']); }
// ======================= Case Anton =======================
function caseAnton(why) { const v = vichy(); if (!v || v.vi.anton) return; const V = v.vi; V.anton = G.day; const zone = VZ_FREE.map(n => PN(n)).filter(p => p && p.owner === 'VIC'), ita = ok('ITA') && ok('GER') && friendly('GER', 'ITA') && !C('ITA').capitulated;
  const scuttle = V.fleet === 1 ? v.stock.ships : v.stock.ships * 0.25, joins = V.fleet === 2 ? v.stock.ships * 0.6 : 0, host = frHost();
  if (!ok('GER') || C('GER').capitulated) return;
  const go = () => { for (const p of zone) { for (const a of armiesAt(p.id)) if (a.owner === 'VIC') removeArmy(a); p.owner = 'FRA'; p.ctrl = ita && VZ_ITALY.includes(p.name) ? 'ITA' : 'GER'; p.cores = p.cores.filter(t => t !== 'VIC'); }
    C('GER').stock.ships += scuttle * 0.06; if (host && joins) C(host).stock.ships += joins; v.stock.ships = 0; G._wc = null; UIH.mapDirty();
    logMsg(`Case Anton: ${why || 'Berlin has lost patience.'} German and Italian columns cross the demarcation line and occupy the whole of France. ${V.fleet === 1 ? 'At Toulon the fleet scuttles itself at its moorings: seventy-seven ships go down under the eyes of the panzers.' : 'What is left of the fleet in African ports hoists its colours beside the Allies.'}`, 'world', ['VIC', 'GER', 'FRA']);
    // what is left of the Empire: Indochina stays with its admiral, the rest goes over
    for (const k of Object.keys(V.emp)) if (k !== 'indochina') viRally(k, `${VEMP[k][0]}, with no France left to obey, passes to the Fighting French.`, 0.6);
    if (viHolds('indochina').length && vichy()) { const h = PN('Hanoi'); v.name = 'French Indochina'; v.leader = 'Jean Decoux'; v.party = 'Government-General'; if (h && h.owner === 'VIC') v.capital = h.id; removeSpirit(v, 'vi_marshal'); addSpirit(v, 'vi_occupied'); V.rump = true; }
    else if (vichy()) viEnd('The French State is a government without a country.'); };
  if (v.tag === G.player && !v.ai) UIH.popup({ title: 'The Germans Cross the Line', icon: '🪖', desc: `${why || 'Berlin has lost patience.'} At dawn the panzers are on the road to Lyon and Toulon. The armistice is dead. The Army of the Armistice has orders not to fire; the fleet has orders never to be taken.`, options: [
    { name: 'The Marshal stays with his people. Scuttle the fleet.', tip: 'France is wholly occupied. We govern on, as a subject of the Reich, with nothing left to bargain with.', fn: () => { viSubject(); } },
    { name: 'Fly to Algiers. Order the Army of Africa to fight.', tip: 'The French State ends. <b>You play on as France</b>, restored at Algiers, with whatever of the Empire, the army and the fleet will follow.', fn: () => { go(); const fr = C('FRA'); if (fr && fr.exists) { if (fr.capitulated) fraRebirth(); switchPlayer('FRA'); fr.ai = false; if (typeof renderAll === 'function') renderAll(); } } }] });
  else go(); }
// the government stays, as a subject: the collaborationist road
function viSubject() { const v = vichy(); if (!v) return; const V = v.vi; v.stock.ships = V.fleet === 1 ? 0 : v.stock.ships; makeSubject('GER', 'VIC'); v.stype = 'collab'; v.autonomy = 15; v.legitC = 20; removeSpirit(v, 'vi_marshal'); addSpirit(v, 'vi_occupied'); V.axis = true; V.press = 0;
  for (const k of Object.keys(V.emp)) if (k !== 'indochina') viRally(k, `${VEMP[k][0]} will not follow a government under German guard, and passes to the Fighting French.`, 0.6);
  logMsg('The Germans occupy the free zone. The fleet scuttles itself at Toulon; Marshal Pétain remains at Vichy, a prisoner in his own hotel.', 'world', ['VIC', 'GER', 'FRA']); }
function viEnd(why) { const v = vichy(); if (!v) return; const pl = G.player === 'VIC' && !v.ai; for (const p of G.P) if (p.owner === 'VIC') { p.owner = 'FRA'; p.cores = p.cores.filter(t => t !== 'VIC'); if (p.ctrl === 'VIC') p.ctrl = frHost() || 'FRA'; }
  for (const a of armiesOf('VIC')) removeArmy(a); eliminate('VIC', null); logMsg(why || 'The French State is no more.', 'world', ['FRA']); if (pl && ok('FRA')) { switchPlayer('FRA'); C('FRA').ai = false; if (typeof renderAll === 'function') renderAll(); } }
// ======================= the French State month by month =======================
const VI_COST = [0, 0.5, 0.9, 1.3];
const VI_ACT = { relief: ['Bargain Over the Costs', 25, 'Ask the Armistice Commission at Wiesbaden to lower the daily payment. Needs collaboration of 30 for each step; each step costs 12 of it.'],
  releve: ['The Relève', 20, 'Three skilled workers for Germany against one prisoner released: 120,000 prisoners come home (60,000 for the army), collaboration +8, the Marshal\'s standing -5.'],
  proconsul: ['Send a Proconsul', 30, 'A general of the Marshal\'s to the least loyal part of the Empire: its loyalty +14.'],
  fleet: ['Move the Fleet', 25, 'From Toulon to the African ports, out of the panzers\' reach, or back again. In Africa it will not be scuttled, and most of it will join whoever holds North Africa; Berlin\'s patience suffers.'],
  camouflage: ['Hide the Arms', 20, 'The army\'s own conspiracy: lorries, guns and rifles walled up in barns and caves. 300 small arms and 30 guns kept from the Armistice Commission; German pressure +6.'],
  message: ['A Message from the Marshal', 15, 'The old man speaks on the wireless: his standing +6, and the Empire listens.'] };
function viAct(v, a, arg) { const V = v.vi, d = VI_ACT[a]; if (!V || !d) return 'Not possible'; if (v.pp < d[1]) return `Needs ${d[1]} political power`; if (V.anton && a !== 'message') return 'The armistice is dead';
  if (a === 'relief') { if (V.cost < 1) return 'The costs cannot go lower'; if (V.collab < 30) return 'Wiesbaden will not listen: collaboration must be 30'; V.cost--; V.collab -= 12; }
  else if (a === 'releve') { if (V.pow < 150) return 'Few prisoners are left'; V.pow -= 120; v.manpower += 60; V.collab = Math.min(100, V.collab + 8); V.marshal = Math.max(0, V.marshal - 5); if (ok('GER')) C('GER').money += wkInc(C('GER')) * 0.3; }
  else if (a === 'proconsul') { const k = arg && V.emp[arg] !== undefined ? arg : Object.keys(V.emp).sort((x, y) => V.emp[x] - V.emp[y])[0]; if (!k) return 'No Empire is left'; V.emp[k] = Math.min(100, V.emp[k] + 14); }
  else if (a === 'fleet') { if (v.stock.ships < 1) return 'There is no fleet'; if (V.fleet === 1) { if (!viHolds('northafrica').length && !viHolds('westafrica').length) return 'We hold no African port'; V.fleet = 2; V.press = Math.min(100, V.press + 12); } else V.fleet = 1; }
  else if (a === 'camouflage') { v.stock.arms += 300; v.stock.artillery += 30; V.press = Math.min(100, V.press + 6); V.cdm = (V.cdm || 0) + 1; }
  else if (a === 'message') { V.marshal = Math.min(100, V.marshal + 6); for (const k in V.emp) V.emp[k] = Math.min(100, V.emp[k] + 2); }
  v.pp -= d[1]; return ''; }
function viMonthly() { const v = vichy(); if (!v || !v.vi) return; const V = v.vi, ge = C('GER'), gl = ok('GER') && capInfo('GER').prog > 0.1, usa = ok('USA') && ok('GER') && atWar('USA', 'GER');
  if (V.rump) { // Indochina alone, under Japan's eye, until Tokyo ends the pretence
    if (ok('JAP') && (G.day >= mjDay(1945, 3) || (!G.historical && isAtWar('JAP') && Math.random() < 0.04)) && viHolds('indochina').length) { const ps = viHolds('indochina'); G.flags.indoCoup = G.day; for (const a of armiesOf('VIC')) removeArmy(a); for (const p of ps) { p.owner = 'JAP'; p.ctrl = 'JAP'; } logMsg('The Japanese army disarms the French garrisons of Indochina in a single night. Eighty years of French rule end at Lang Son.', 'world', ['JAP', 'FRA']); viEnd('French Indochina is no more.'); if (typeof dynPuppetCheck === 'function') dynPuppetCheck('JAP'); } return; }
  if (!ok('GER') || ge.capitulated) { viLiberation(); return; }
  if (!V.axis && !V.anton) { const pay = wkInc(v) * VI_COST[V.cost]; v.money -= pay; ge.money += pay * 0.8; V.paid = pay;
    V.press = clamp(V.press + 1 + (gl ? 1.5 : 0) + (usa ? 0.8 : 0) - V.collab / 30 + (V.fleet === 2 ? 0.3 : 0), 0, 100); }
  V.marshal = clamp(V.marshal - 0.5 - Math.max(0, V.collab - 40) / 60 - (v.money < 0 ? 0.5 : 0) - (V.anton ? 1 : 0), 0, 100); v.stab = clamp(v.stab + (V.marshal - 55) / 60, 0, 100);
  const back = Math.min(V.pow, 4 + V.collab / 12); V.pow -= back; v.manpower += back * 0.5;
  empMonthly(v); if (!vichy()) return; if (v.ai) viAI(v);
  if (!V.axis && !V.anton && (V.press >= 100 || (G.historical && G.day >= mjDay(1942, 11) + 10) || G.flags.torch)) caseAnton(V.press >= 100 ? 'Berlin no longer believes in Vichy\'s neutrality.' : G.flags.torch ? 'The Allies are in Algiers.' : 'The Mediterranean coast lies open to the Allies.'); }
function viAI(v) { const V = v.vi; if (V.anton) return; if (V.cost > 1 && V.collab >= 34 && v.pp >= 25) viAct(v, 'relief'); if (V.marshal < 60 && v.pp >= 15) viAct(v, 'message'); const low = Object.keys(V.emp).sort((a, b) => V.emp[a] - V.emp[b])[0]; if (low && V.emp[low] < 45 && v.pp >= 30) viAct(v, 'proconsul', low);
  if (V.press > 70 && V.pow > 400 && v.pp >= 20) viAct(v, 'releve'); if (V.collab < 30 + (G.day - V.since) / 60 && Math.random() < 0.4) V.collab = Math.min(100, V.collab + 4); }
// when Germany is beaten the French State hands over what it still holds
function viLiberation() { const v = vichy(); if (!v) return; viEnd('With Germany beaten the French State dissolves itself. The Republic takes back all that was France.'); }
// the capital returns to Paris when Paris is French again
function fraHome() { const fr = C('FRA'); if (!fr || !fr.exists || !fr.flags.algiers) return; const pa = PN('Paris'); if (pa && pa.owner === 'FRA' && pa.ctrl === 'FRA') { delete fr.flags.algiers; fr.capital = pa.id; removeSpirit(fr, 'fr_fightson'); logMsg('Paris is free. The government of the Republic comes home.', 'world', ['FRA']); } }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); viMonthly(); fraHome(); vopAI(); }; }
// the British (and American) staffs strike at Vichy on the dates of history, or when the moment offers
const VOP_DATE = { catapult: [1940, 7, 3], menace: [1940, 9, 23], exporter: [1941, 6, 8], ironclad: [1942, 5, 5], torch: [1942, 11, 8] };
function vopAI() { const v = vichy(); if (!v || !v.vi || v.vi.anton) return; const c = C('ENG'); if (!c || !c.exists || !c.ai || c.capitulated) return;
  for (const id in VOPS) { if (vopCan(c, id)) continue; const d = VOP_DATE[id], due = G.day >= mjDay(d[0], d[1]) + d[2] - 1; if (G.historical ? due : (due && Math.random() < 0.5) || (id !== 'catapult' && Math.random() < 0.03)) { vopDo(c, id); break; } } }
// decisions for a player Britain or America
for (const id in VOPS) DECISIONS['vop_' + id] = D(VOPS[id][0], 'The French State', id === 'torch' ? 60 : 30, VOPS[id][2], { fn: c => { const r = vopDo(c, id); if (r && c.tag === G.player) UIH.notify(r, 'bad'); }, tip: id === 'catapult' ? 'A third of Vichy\'s fleet is sunk or crippled; Vichy breaks with us; the Empire rallies round the Marshal for a year.' : id === 'torch' ? 'North and West Africa pass to France, which takes its seat again in Algiers; the Germans occupy the rest of France.' : `If it succeeds, ${VOPS[id][1]} passes to Free France.` },
  { once: true, visible: c => ['ENG', 'USA'].includes(c.tag) && !!vichy() && !(vichy().vi.ops || {})[id], avail: c => vopCan(c, id), ai: 0 });
// ---------- what other nations want from French land now goes to whoever holds it ----------
if (typeof FNS !== 'undefined' && FNS.indochina) FNS.indochina = [c => { const names = ['Hanoi', 'Haiphong', 'Hue', 'Saigon', 'Phnom Penh', 'Vientiane'], t = (PN('Hanoi') || {}).owner; if (!t || !ok(t) || t === c.tag) return; const k = C(t);
  startPlay(c.tag, t, { type: 'take', provs: names.map(n => PNAME[n]).filter(i => i !== undefined && P(i).owner === t) }, { force: t === 'VIC' || k.capitulated || isAtWar(t) ? 'concede' : null, days: 15 }); if (t === 'VIC' && vichy()) { vichy().vi.emp.indochina !== undefined && delete vichy().vi.emp.indochina; } }, 'Demand French Indochina from whoever governs it; a France at war or under the armistice yields'];
// ======================= the national focus tree's vocabulary =======================
Object.assign(XTOK, {
  vcollab: v => [c => { if (c.vi) c.vi.collab = clamp(c.vi.collab + +v, 0, 100); }, `Collaboration ${+v > 0 ? '+' : ''}${v}`],
  vpress: v => [c => { if (c.vi) c.vi.press = clamp(c.vi.press + +v, 0, 100); }, `German pressure ${+v > 0 ? '+' : ''}${v}`],
  vmarshal: v => [c => { if (c.vi) c.vi.marshal = clamp(c.vi.marshal + +v, 0, 100); }, `The Marshal's standing ${+v > 0 ? '+' : ''}${v}`],
  vpow: v => [c => { if (c.vi) { const n = Math.min(c.vi.pow, +v); c.vi.pow -= n; c.manpower += n * 0.5; } }, `${v},000 prisoners of war come home`],
  vemp: v => { const [k, n] = v.trim().split(/\s+/); return [c => { if (!c.vi) return; for (const r in c.vi.emp) if (k === 'all' || r === k) c.vi.emp[r] = clamp(c.vi.emp[r] + +n, 0, 100); }, `Loyalty of ${k === 'all' ? 'the Empire' : VEMP[k][0]} ${+n > 0 ? '+' : ''}${n}`]; },
  vcost: v => [c => { if (c.vi) c.vi.cost = clamp(c.vi.cost + +v, 0, 3); }, +v < 0 ? 'The occupation costs are lowered' : 'The occupation costs are raised']
});
Object.assign(REQX, {
  collab: v => [c => !!c.vi && c.vi.collab >= +v, `Collaboration at least ${v}`], collabmax: v => [c => !!c.vi && c.vi.collab <= +v, `Collaboration at most ${v}`],
  marshal: v => [c => !!c.vi && c.vi.marshal >= +v, `The Marshal's standing at least ${v}`], vpressmax: v => [c => !!c.vi && c.vi.press <= +v, `German pressure at most ${v}`],
  vholds: v => [c => viHolds(v).length > 0, `We hold ${VEMP[v][0]}`], noanton: () => [c => !!c.vi && !c.vi.anton, 'The free zone is unoccupied'], anton: () => [c => !!c.vi && !!c.vi.anton, 'The Germans have occupied the free zone']
});
Object.assign(FNS, {
  viAxis: [c => { const V = c.vi; if (!V || !ok('GER')) return; V.axis = true; V.press = 0; V.cost = 0; removeSpirit(c, 'vi_armistice'); const f = factionOf('GER'); if (f) joinFaction(c.tag, 'GER'); for (const w of G.wars) if (w.att.includes('GER') || w.def.includes('GER')) joinWar(w, c.tag, w.att.includes('GER') ? 'att' : 'def'); V.pow = Math.max(0, V.pow - 600); c.manpower += 300; logMsg('France enters the war at Germany\'s side. The armistice is replaced by a treaty; the prisoners begin to come home.', 'world', [c.tag, 'GER']); }, 'France joins the Axis and its wars: the armistice limits end, the occupation costs stop, 600,000 prisoners come home, and Berlin will not occupy the free zone'],
  viSwitch: [c => { const V = c.vi; if (!V) return; const fr = C('FRA'), pl = G.player === c.tag && !c.ai; for (const k of Object.keys(V.emp)) viRally(k, `${VEMP[k][0]} follows the Marshal's men into the Allied camp.`, 0.8); if (vichy()) { const host = frHost(); if (host && V.fleet === 2) C(host).stock.ships += c.stock.ships * 0.7; } fraRebirth(); if (vichy()) caseAnton('Vichy\'s men in Africa have changed sides.'); if (pl && ok('FRA') && vichy()) { switchPlayer('FRA'); fr.ai = false; } }, 'The Empire, its army and (if it lies in African ports) the fleet rejoin the war beside the Allies; France takes its seat again in Algiers; the Germans will occupy the free zone at once'],
  viAfrica: [c => { if (c.vi && c.vi.fleet === 1 && (viHolds('northafrica').length || viHolds('westafrica').length)) { c.vi.fleet = 2; c.vi.press = Math.min(100, c.vi.press + 8); } }, 'The fleet leaves Toulon for the African ports'],
  viKing: [c => { c.leader = 'Henri, Count of Paris'; c.party = 'The Crown'; c.name = c.vi && c.vi.anton ? c.name : 'Kingdom of France'; try { setLaw(c, 'monarchy'); } catch (e) { /* no such law */ } }, 'The Count of Paris is called to the throne'],
  viRepublic: [c => { const fr = C('FRA'); if (!c.vi) return; logMsg('Marshal Pétain hands his powers to the National Assembly, which hands them to the Provisional Government. The French State ends as it began, by a vote.', 'world', [c.tag, 'FRA']); if (fr && fr.exists && fr.capitulated) fraRebirth(); viEnd('The French State hands the country back to the Republic.'); }, 'The French State dissolves itself into the Republic: everything we hold passes to France'],
  viScuttleOrder: [c => { if (c.vi) c.vi.scuttle = true; }, 'Standing orders: no ship is ever to fall into foreign hands'],
  viSyriaFields: [c => { if (!c.vi) return; c.vi.collab = Math.min(100, c.vi.collab + 10); c.vi.syria = G.day; if (ok('ENG')) addRel(c.tag, 'ENG', -20); if (ok('IRQ') && ok('GER')) addRel('GER', 'IRQ', 10); }, 'German aircraft may land at Aleppo and Damascus: collaboration +10, and the British will have their reason to march on Syria']
});

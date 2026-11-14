// 2.1 The Balkans: a unique system for each of Romania, Yugoslavia, Bulgaria, Greece and Turkey, and regional ententes.
'use strict';
const nm = n => PN(n);
// ======================= Romania: the oil contracts =======================
const RO_BUYERS = { GER: ['Germany', 'Pays in arms and artillery (barter)'], ENG: ['Britain', 'Pays in gold'], FRA: ['France', 'Pays in gold'], ITA: ['Italy', 'Pays in gold and ships'], home: ['Home use', 'Fuels our own army and industry'] };
const roOilOut = c => sum(provsOf(c.tag), p => (p.res.oil || 0) * (1 + (p.b.oilr || 0))) * 12;
const oilc = c => c.oilc || (c.oilc = { GER: 25, ENG: 25, FRA: 15, ITA: 10, home: 25 });
function setOilShare(c, b, d) { const o = oilc(c); if (b === 'home' || !o[b] && d < 0) return; const v = clamp(o[b] + d, 0, 100); const dd = v - o[b]; if (o.home - dd < 0) return; o[b] = v; o.home -= dd; }
function roOilMonthly(c) {
  const o = oilc(c), out = roOilOut(c); c.oilIncome = 0; for (const b in o) { if (b === 'home' || !o[b]) continue; const k = C(b); if (!ok(b) || atWar(b, c.tag)) continue; const v = out * o[b] / 100;
    if (b === 'GER') { c.stock.arms = (c.stock.arms || 0) + v * 0.5; c.stock.artillery = (c.stock.artillery || 0) + v * 0.08; } else if (b === 'ITA') { c.money += v * 0.6; c.stock.ships = (c.stock.ships || 0) + v * 0.004; } else c.money += v * 1.1;
    c.oilIncome += v; k.roOil = v; addRel(b, c.tag, o[b] / 20); }
  if (o.home > 30) addSpirit(c, 'ro_home_oil', 40); // the army runs on its own oil
  // Germany presses if it is short-changed
  const g = C('GER'); if (ok('GER') && g.ideology === 'fas' && year() >= 1938 && !atWar('GER', c.tag) && !friendly('GER', c.tag)) { c.gerPress = clamp((c.gerPress || 0) + (o.GER < 35 ? 6 : -4), 0, 100);
    if (c.gerPress >= 60) { c.gerPress = 20; if (c.ai) { o.GER = Math.min(60, o.GER + 20); o.home = 100 - sum(Object.keys(o).filter(x => x !== 'home'), x => o[x]); if (o.home < 0) { o.ENG += o.home; o.home = 0; } } else UIH.popup({ title: 'The Oil-for-Arms Ultimatum', icon: '🛢', desc: 'The German minister presents a draft: half our oil to the Reich, at prices Berlin will set. He mentions Hungary\'s claims on Transylvania, and Moscow\'s on Bessarabia, in the same breath.', days: 20, def: 0, options: [
      { name: 'Sign the economic treaty.', tip: 'Germany takes 50% of our oil. Relations with Germany +30.', fn: () => { o.GER = 50; let rest = 50; for (const b of ['ENG', 'FRA', 'ITA', 'home']) { o[b] = Math.min(o[b], rest); rest -= o[b]; } addRel('GER', c.tag, 30); } },
      { name: 'Refuse.', tip: 'Germany will back the claims of our neighbours. Relations with Germany -40.', fn: () => { addRel('GER', c.tag, -40); for (const [t, n] of [['HUN', 'Cluj'], ['HUN', 'Oradea'], ['BUL', 'Dobrich'], ['SOV', 'Chișinău']]) { const p = nm(n); if (p && !p.claims.includes(t)) p.claims.push(t); } claimCache(); } }] }); } }
}
SPIRITS.ro_home_oil = ['Oil for Our Own Army', 'Ploiești fuels Romania first.', { supply: 0.06, air: 0.04 }];
{ const _ef = econFinish; econFinish = function (c, warm) { _ef(c, warm); if (c.roOil && c.ful) c.ful.oil = Math.min(1, c.ful.oil + c.roOil * 0.0008); }; }
// ======================= Yugoslavia: the nationalities =======================
const NATS = { serb: ['Serbs', ['Belgrade', 'Niš', 'Kragujevac', 'Novi Sad', 'Pristina']], croat: ['Croats', ['Zagreb', 'Split', 'Osijek', 'Dubrovnik']], slovene: ['Slovenes', ['Ljubljana']], bosniak: ['Bosnian Muslims', ['Sarajevo', 'Mostar', 'Banja Luka']], macedon: ['Macedonians', ['Skopje', 'Bitola']] };
const natOf = c => c.nat || (c.nat = { serb: 70, croat: 28, slovene: 55, bosniak: 45, macedon: 30 });
function natShift(c, v) { const n = natOf(c); for (const k in v) if (k in n) n[k] = clamp(n[k] + v[k], 0, 100); }
SPIRITS.yug_unity = ['Brotherhood and Unity', 'The South Slavs pull together.', { stab: 5, manpower: 0.05, legit: 4 }];
SPIRITS.yug_discord = ['The Peoples Pull Apart', 'Every party is a national party.', { stab: -6, pp: -0.1, manpower: -0.05 }];
function secede(c, names, name, ideo, color, war) {
  const ps = names.map(nm).filter(p => p && p.owner === c.tag); if (!ps.length) return null; let i = 0, tag; do { tag = c.tag.slice(0, 3) + 'S' + (i || ''); i++; } while (G.C[tag] && G.C[tag].exists);
  const r = G.C[tag] = JSON.parse(JSON.stringify(c, function (k, v) { return k[0] === '_' || (this === c && ['parties', 'leader', 'party', 'nat', 'cabinet', 'legacy', 'intel', 'proj', 'regimes', 'admin', 'prog', 'doc', 'airPlan', 'templates', 'agroups', 'net', 'netTargets'].includes(k)) ? undefined : v; }));
  Object.assign(r, { tag, name, adj: name.split(' ').pop(), color, ai: true, exists: true, capitulated: false, overlord: null, focus: { cur: null, prog: 0, done: {} }, gens: [], queue: [], pq: [], enact: null, rel: {}, money: 0, training: [], flags: {}, spirits: [], manpower: 40, warExh: 0 });
  for (const k in r.stock) r.stock[k] = 0; ps.sort((a, b) => b.vp - a.vp); r.capital = ps[0].id; for (const o of alive()) if (o.tag !== tag) { r.rel[o.tag] = 0; o.rel[tag] = 0; }
  for (const p of ps) { p.owner = tag; p.ctrl = tag; if (!p.cores.includes(tag)) p.cores.push(tag); } setIdeology(r, ideo, true); spawnDivisions(r, 'mil', Math.max(3, ps.length * 2), r.capital); r.stock.arms = 400;
  if (war) declareWar(tag, c.tag, [{ by: tag, vs: c.tag, type: 'take', provs: [] }], `${name} War of Independence`, true); logMsg(`${name} breaks away from ${c.name}!`, 'world', [c.tag]); UIH.mapDirty(); return r; }
function yugMonthly(c) { const n = natOf(c); for (const k in n) n[k] += (45 - n[k]) * 0.01 + (c.laws.citizen === 'civic' ? 0.2 : c.laws.citizen === 'ethnic' && k !== 'serb' ? -0.4 : 0);
  const avg = sum(Object.keys(n), k => n[k]) / 5; removeSpirit(c, 'yug_unity'); removeSpirit(c, 'yug_discord'); if (avg > 58) addSpirit(c, 'yug_unity'); else if (avg < 38) addSpirit(c, 'yug_discord');
  for (const k in n) if (n[k] < 25) for (const x of NATS[k][1]) { const p = nm(x); if (p && p.owner === c.tag) { p.unrest = Math.min(100, (p.unrest || 0) + (25 - n[k]) * 0.4); c.rad = Math.min(1, c.rad + 0.002); } }
  if (n.croat < 15 && (isAtWar(c.tag) || c.stab < 30) && Math.random() < 0.06 && !G.flags.croatia_gone) { G.flags.croatia_gone = G.day; secede(c, NATS.croat[1], 'Independent State of Croatia', 'fas', '#7a2a2a', true); }
  if (c.ai && c.pp > 70) { const low = Object.keys(n).filter(k => k !== 'serb').sort((a, b) => n[a] - n[b])[0]; if (n[low] < 30) yugAct(c, 'concede', low); } }
const YUG_ACT = { concede: ['Concessions', 40, 'Schools, posts and money for them: +15 for the group, -5 for the Serbs.'], centralise: ['Centralise', 30, 'Belgrade decides: Serbs +10, every other group -6, political power +40.'], repress: ['Repression', 20, 'Gendarmes and arrests: unrest in their lands -20, their goodwill -10, stability +2.'] };
function yugAct(c, a, g) { const d = YUG_ACT[a]; if (c.pp < d[1]) return 'Not enough political power'; c.pp -= d[1]; const n = natOf(c);
  if (a === 'concede') { n[g] = Math.min(100, n[g] + 15); n.serb = Math.max(0, n.serb - 5); } else if (a === 'centralise') { for (const k in n) n[k] = clamp(n[k] + (k === 'serb' ? 10 : -6), 0, 100); c.pp += 40; } else { n[g] = Math.max(0, n[g] - 10); c.stab = Math.min(100, c.stab + 2); for (const x of NATS[g][1]) { const p = nm(x); if (p) p.unrest = Math.max(0, (p.unrest || 0) - 20); } } return ''; }
// ======================= Bulgaria: the lost provinces =======================
const REV = { dobruja: ['Southern Dobruja', 'ROM', ['Dobrich']], macedonia: ['Macedonia', 'YUG', ['Skopje', 'Bitola']], thrace: ['Western Thrace', 'GRE', ['Kavala', 'Alexandroupoli']] };
const PATRONS = ['GER', 'ITA', 'SOV', 'ENG'];
const revOf = c => c.rev || (c.rev = { dobruja: { p: 5, patron: null }, macedonia: { p: 0, patron: null }, thrace: { p: 0, patron: null } });
function revOwnerOf(k) { const ps = REV[k][2].map(nm).filter(Boolean); return ps.length ? ps[0].owner : null; }
function revMonthly(c) { const R = revOf(c); for (const k in R) { const r = R[k], own = revOwnerOf(k); if (!own || own === c.tag || friendly(c.tag, own) && C(own).overlord === c.tag) { r.p = 100; continue; } if (r.done) continue;
    let g = 0; if (opinion(own, c.tag) > 0 && !atWar(c.tag, own)) g += 0.8; const pat = r.patron && C(r.patron); if (pat && pat.exists && !atWar(r.patron, c.tag) && opinion(r.patron, c.tag) > 10) { g += pat.major ? 2 : 1; if (opinion(r.patron, own) < 0 || atWar(r.patron, own)) g += 2; }
    if (sum(armiesOf(c.tag), a => a.divs.length) >= sum(armiesOf(own), a => a.divs.length) * 0.7) g += 0.8; if (C(own).capitulated) g += 6; r.p = clamp(r.p + g, 0, 100);
    if (r.p >= 100) { r.done = true; const provs = REV[k][2].map(nm).filter(p => p && p.owner === own).map(p => p.id); if (provs.length) startPlay(c.tag, own, { type: 'take', provs }, { force: C(own).ai ? 'concede' : null, days: 15 }); logMsg(`${c.name} presses its claim to ${REV[k][0]}.`, 'world', [c.tag, own]); } }
  if (c.ai) for (const k in R) if (!R[k].patron) { const p = PATRONS.filter(t => ok(t) && opinion(t, c.tag) > 0).sort((a, b) => opinion(b, c.tag) - opinion(a, c.tag))[0]; if (p) R[k].patron = p; } }
const REV_ACT = { talks: ['Open Talks', 30, 'pp', 10, 'Diplomats meet in a spa town: +10 progress. Requires peace with the owner.'], patron: ['Ask the Patron to Press', 30, 'infl', 15, 'Our patron leans on them: +15 progress, relations with the patron +15.'], border: ['Mobilise on the Border', 25, 'pp', 10, 'Divisions on the frontier: +10 progress, world tension +2, relations with the owner -20.'] };
function revAct(c, k, a) { const d = REV_ACT[a], r = revOf(c)[k], own = revOwnerOf(k); if (!own || r.done) return 'Nothing to press'; if (c[d[2]] < d[1]) return 'Not enough ' + (d[2] === 'pp' ? 'political power' : 'influence');
  if (a === 'talks' && atWar(c.tag, own)) return 'Not while at war'; if (a === 'patron' && !r.patron) return 'Choose a patron first'; c[d[2]] -= d[1]; r.p = Math.min(100, r.p + d[3]); if (a === 'patron') addRel(c.tag, r.patron, 15); if (a === 'border') { G.tension = Math.min(100, G.tension + 2); addRel(own, c.tag, -20); } return ''; }
// ======================= Greece: the National Schism and the merchant fleet =======================
BOP.GRE = ['The National Schism', 'Royalists', 'Venizelists', [['The King\'s Men', { legit: 8, stab: 4, ig: 0, org: 0.03 }], ['Crown Ascendant', { legit: 4, stab: 2 }], ['An Uneasy Truce', { pp: -0.05 }], ['Venizelist Revival', { research: 0.03, infl: 0.1 }], ['The Liberal Republic', { research: 0.05, infl: 0.15, stab: -4 }]]];
BOP.GRE[3].forEach((b, i) => { delete b[1].ig; SPIRITS[`bop_GRE_${i}`] = [`${BOP.GRE[0]}: ${b[0]}`, `The balance between the ${BOP.GRE[1]} and the ${BOP.GRE[2]}.`, b[1]]; });
const FLEET_BUY = { ENG: ['Britain', 0.16], USA: ['America', 0.15], GER: ['Germany', 0.13], ITA: ['Italy', 0.12], home: ['Greek trade', 0.06] };
const fleetOf = c => c.fleet || (c.fleet = { ton: 100, ch: { ENG: 30, USA: 10, GER: 15, ITA: 10, home: 35 } });
function setCharter(c, b, d) { const f = fleetOf(c).ch; if (b === 'home') return; const v = clamp(f[b] + d, 0, 100), dd = v - f[b]; if (f.home - dd < 0) return; f[b] = v; f.home -= dd; }
function greMonthly(c) { const f = fleetOf(c); let inc = 0, lost = 0;
  for (const b in f.ch) { const share = f.ch[b] / 100, ton = f.ton * share; if (!share) continue; if (b !== 'home' && (!ok(b) || atWar(b, c.tag))) { lost += ton * (b !== 'home' && ok(b) && atWar(b, c.tag) ? 1 : 0); f.ch.home += f.ch[b]; f.ch[b] = 0; continue; }
    inc += ton * FLEET_BUY[b][1]; if (b !== 'home') { addRel(b, c.tag, share * 3); if (isAtWar(b)) { const e = enemiesOf(b).reduce((s, t) => s + navalPower(C(t)), 0); if (e > 50) lost += ton * 0.02; } } }
  f.ton = Math.max(5, f.ton - lost + sum(provsOf(c.tag), p => p.b.shipyard || 0) * 0.4); c.money += inc; c.fleetIncome = inc; removeSpirit(c, 'greek_fleet'); if (f.ton > 40) addSpirit(c, 'greek_fleet'); SPIRITS.greek_fleet[2] = { tradecap: Math.min(0.2, f.ton / 800), infl: 0.05 }; }
SPIRITS.greek_fleet = ['The Greek Merchant Marine', 'Tramp steamers from Piraeus and Andros on every sea.', { tradecap: 0.1 }];
// ======================= Turkey: active neutrality and the Straits =======================
const BLOCS = { allies: ['The Allies', 'ENG'], axis: ['The Axis', 'GER'], sov: ['The Soviet Union', 'SOV'] };
const STRAIT_POW = ['ENG', 'FRA', 'ITA', 'GER', 'SOV', 'USA'];
const levOf = c => c.lev || (c.lev = { allies: 20, axis: 10, sov: 25 });
const straitsOf = c => c.straits || (c.straits = Object.fromEntries(STRAIT_POW.map(t => [t, t === 'SOV' ? 'open' : 'limited'])));
const blocOf = t => { if (!ok(t)) return null; for (const b in BLOCS) if (t === BLOCS[b][1] || friendly(t, BLOCS[b][1])) return b; return null; };
const TUR_AID = { allies: ['Accept Allied Credits', 'money 25, 300 rifles and 60 aircraft', c => { c.money += 25 * 30; c.stock.arms = (c.stock.arms || 0) + 300; c.stock.aircraft = (c.stock.aircraft || 0) + 60; }, 20], axis: ['Sell Chromite to Germany', 'money 20, 150 artillery', c => { c.money += 20 * 30; c.stock.artillery = (c.stock.artillery || 0) + 150; }, 15], sov: ['Soviet Friendship Treaty', 'non-aggression, trade and 200 rifles', c => { addPact('nap', c.tag, 'SOV', 1825); c.stock.arms = (c.stock.arms || 0) + 200; }, 15] };
function turAid(c, b) { const L = levOf(c), lead = BLOCS[b][1]; if (!ok(lead) || atWar(lead, c.tag)) return 'They are in no position'; if (c.turAidDay && G.day - c.turAidDay < 90) return `Another package only in ${90 - (G.day - c.turAidDay)} days`; TUR_AID[b][2](c); L[b] = Math.min(100, L[b] + TUR_AID[b][3]); addRel(lead, c.tag, 15); c.turAidDay = G.day; return ''; }
function setStrait(c, t, v) { const S = straitsOf(c); if (S[t] === v) return; if (c.pp < 20) return 'Needs 20 political power'; c.pp -= 20; S[t] = v; const b = blocOf(t); addRel(t, c.tag, v === 'open' ? 15 : v === 'closed' ? -25 : 0); if (b) { const L = levOf(c); L[b] = clamp(L[b] + (v === 'open' ? 6 : v === 'closed' ? -10 : 0), 0, 100); } return ''; }
function turMonthly(c) { const L = levOf(c), S = straitsOf(c); for (const b in L) L[b] = Math.max(0, L[b] - 0.8);
  for (const t of STRAIT_POW) if (ok(t) && S[t] !== 'closed' && !atWar(t, c.tag)) c.money += S[t] === 'open' ? 18 : 8;
  for (const b in L) { const lead = BLOCS[b][1]; if (L[b] >= 80 && ok(lead) && isAtWar(lead) && !friendly(c.tag, lead) && !isAtWar(c.tag)) { L[b] = 40;
      const join = () => sideWith(c, lead), refuse = () => { addRel(lead, c.tag, -40); L[b] = 0; addSpirit(c, 'tur_aid_cut', 365); };
      if (c.ai) (Math.random() < 0.25 ? join : refuse)(); else UIH.popup({ title: `${BLOCS[b][0]} Call In Their Debts`, icon: '⚖️', days: 30, def: 1, desc: `${cname(lead)} has paid for our rifles, aircraft and loans. Its ambassador now asks when Turkey intends to enter the war.`, options: [{ name: 'Turkey enters the war.', tip: `We join ${cname(lead)}'s wars.`, fn: join }, { name: 'Turkey remains neutral.', tip: `Relations with ${cname(lead)} -40; their aid stops for a year.`, fn: refuse }] }); } }
  if (c.ai && !isAtWar(c.tag) && Math.random() < 0.15) { const b = Object.keys(L).sort((x, y) => L[x] - L[y])[0]; turAid(c, b); } }
SPIRITS.tur_aid_cut = ['Aid Withdrawn', 'A great power feels cheated.', { tradecap: -0.05, stab: -2 }];
// ======================= regional ententes =======================
const entOf = t => (G.ent || []).filter(e => e.members.includes(t));
function ententeSetup() { G.ent = [{ id: 'balkan', name: 'Balkan Entente', members: ['GRE', 'TUR', 'ROM', 'YUG'], rivals: ['BUL'], coh: 55 }, { id: 'little', name: 'Little Entente', members: ['CZE', 'ROM', 'YUG'], rivals: ['HUN'], coh: 50 }, { id: 'baltic', name: 'Baltic Entente', members: ['EST', 'LAT', 'LIT'], rivals: [], coh: 40 }]; }
SPIRITS.entente_member = ['Regional Entente', 'Small states stand together.', { def: 0.03, infl: 0.05 }];
function entMonthly() { if (!G.ent) ententeSetup();
  for (const e of G.ent.slice()) { e.members = e.members.filter(ok); const facs = new Set(e.members.map(t => (factionOf(t) || {}).name).filter(Boolean)); e.coh = clamp(e.coh + 0.4 - (facs.size > 1 ? 1.5 : 0) - (e.members.some(a => e.members.some(b => atWar(a, b))) ? 30 : 0) - (e.members.some(t => C(t).overlord && !e.members.includes(C(t).overlord)) ? 0.8 : 0), 0, 100);
    if (e.coh <= 0 || e.members.length < 2) { G.ent.splice(G.ent.indexOf(e), 1); logMsg(`The ${e.name} is dissolved.`, 'world', e.members); continue; } for (const a of e.members) for (const b of e.members) if (a !== b) addRel(a, b, 0.3); }
  for (const c of alive()) { removeSpirit(c, 'entente_member'); if (entOf(c.tag).length) addSpirit(c, 'entente_member'); } }
{ const _dw = declareWarInner; declareWarInner = function (a, b, goals, name, noCall, rt) { const w = _dw(a, b, goals, name, noCall, rt); if (!w || !G.ent) return w;
  for (const e of G.ent) if (e.members.includes(b) && (e.rivals.includes(a) || e.coh >= 70) && !e.members.includes(a)) for (const m of e.members) { if (m === b || atWar(m, a) || !ok(m) || C(m).capitulated) continue; const M_ = C(m);
      if (M_.ai) { if (e.coh >= 40 && countryStr(m) > 0) { joinWar(w, m, w.att.includes(a) ? 'def' : 'att'); logMsg(`${M_.name} honours the ${e.name}.`, 'world', [m, b]); } else e.coh -= 15; }
      else UIH.popup({ title: `The ${e.name} Is Invoked`, icon: '🤝', days: 10, def: 0, desc: `${cname(a)} has attacked ${cname(b)}, our partner in the ${e.name}.`, options: [{ name: 'We stand with them.', fn: () => { if (G.wars.includes(w)) joinWar(w, m, 'def'); } }, { name: 'We cannot.', tip: 'The entente\'s cohesion -25.', fn: () => { e.coh -= 25; } }] }); }
  return w; }; }
function foundEntente(c, name, invite) { if (c.infl < 60) return 'Needs 60 influence'; if (entOf(c.tag).length >= 2) return 'We already belong to two ententes'; c.infl -= 60; const e = { id: 'e' + G.nid++, name: name || `${c.adj} Entente`, members: [c.tag], rivals: [], coh: 45 }; (G.ent = G.ent || []).push(e);
  for (const t of invite || []) if (ok(t) && C(t).ai && opinion(t, c.tag) > 15 && !factionOf(t)) e.members.push(t); logMsg(`The ${e.name} is founded: ${e.members.map(cname).join(', ')}.`, 'world', e.members); return ''; }
// ---------- effect tokens for the Balkan trees ----------
Object.assign(XTOK, {
  nat: v => { const o = kvs(v); return [c => natShift(c, o), Object.keys(o).map(k => `${NATS[k][0]}: goodwill ${o[k] > 0 ? '+' : ''}${o[k]}`).join('<br>')]; },
  rev: v => { const [k, n] = v.trim().split(' '); return [c => { const r = revOf(c)[k]; if (r) r.p = clamp(r.p + +n, 0, 100); }, `Claim to ${REV[k][0]}: progress +${n}`]; },
  patron: v => [c => { for (const k in revOf(c)) c.rev[k].patron = v.trim(); addRel(c.tag, v.trim(), 15); }, `${COUNTRY_DEF[v.trim()].n} becomes the patron of our claims`],
  oil: v => { const [b, n] = v.trim().split(' '); return [c => setOilShare(c, b, +n), `Oil contracts: ${RO_BUYERS[b][0]} ${+n > 0 ? '+' : ''}${n}%`]; },
  fleet: v => [c => { fleetOf(c).ton += +v; }, `Merchant fleet +${v} (thousand tons ×10)`],
  lev: v => { const [b, n] = v.trim().split(' '); return [c => { const L = levOf(c); L[b] = clamp(L[b] + +n, 0, 100); }, `${BLOCS[b][0]}: leverage over us ${+n > 0 ? '+' : ''}${n}`]; },
  straits: v => { const [t, s] = v.trim().split(' '); return [c => { straitsOf(c)[t] = s; }, `The Straits are ${s} to ${COUNTRY_DEF[t].n}`]; },
  ent: v => { const [id, n] = v.trim().split(' '); return [c => { const e = (G.ent || []).find(x => x.id === id && x.members.includes(c.tag)); if (e) e.coh = clamp(e.coh + +n, 0, 100); }, `Cohesion of our entente ${+n > 0 ? '+' : ''}${n}`]; },
  secede: v => { const [names, name, ideo] = v.split('/').map(s => s.trim()); return [c => secede(c, csv(names), name, ideo, '#7a5a8a', true), `${name} breaks away`]; }
});
// ---------- hooks ----------
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (!c.exists || c.capitulated) return; const t = c.tag;
  if (t === 'ROM') roOilMonthly(c); else if (t === 'YUG') yugMonthly(c); else if (t === 'BUL') revMonthly(c); else if (t === 'GRE') greMonthly(c); else if (t === 'TUR') turMonthly(c); }; }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); entMonthly(); }; }
{ const _ng = newGame; newGame = function (...a) { const r = _ng(...a); ententeSetup();
  const claim = (t, ns) => ns.forEach(n => { const p = nm(n); if (p && !p.claims.includes(t)) p.claims.push(t); }); const core = (t, ns) => ns.forEach(n => { const p = nm(n); if (p && !p.cores.includes(t)) p.cores.push(t); });
  claim('BUL', ['Dobrich', 'Skopje', 'Bitola', 'Kavala', 'Alexandroupoli']); core('BUL', ['Dobrich']); claim('TUR', ['Alexandretta']); claim('GRE', ['Rhodes']); core('GRE', ['Rhodes']); claim('YUG', ['Fiume', 'Zara']); core('ITA', ['Fiume', 'Zara', 'Rhodes']);
  claim('HUN', ['Cluj', 'Oradea', 'Arad']); claim('SOV', ['Chișinău', 'Bălți', 'Cetatea Albă', 'Czernowitz']); claim('ITA', ['Split', 'Dubrovnik', 'Corfu']); claimCache(); return r; }; }
// named requirements used by the Balkan trees
Object.assign(REQF, {
  allyENG: [c => ok('ENG') && friendly(c.tag, 'ENG'), 'Allied with Britain'],
  occupiedByAxis: [c => G.P.some(p => p.owner === c.tag && p.ctrl !== c.tag && atWar(c.tag, p.ctrl)), 'Enemy troops hold part of our land']
});

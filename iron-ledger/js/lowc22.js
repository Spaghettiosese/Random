// 2.2 The Low Countries: the Dutch Water Line and the oil of the East Indies; Belgium's two peoples, the King's choice and
// the uranium of the Congo; Radio Luxembourg and the steel of ARBED.
'use strict';
// ======================= The Netherlands: the Water Line and the Indies =======================
// Holland can drown its own polders: the New Dutch Water Line around Utrecht, the Defence Line of Amsterdam, the islands of
// Zeeland. Flooding takes ten days, ruins the harvest and makes the provinces behind it very hard to take. In the Indies,
// Royal Dutch Shell's oil is the other thing every great power wants from us: Japan above all.
const HL_FLOOD = ['Utrecht', 'Amsterdam', 'Rotterdam', 'Vlissingen'];
SPIRITS.inundations = ['The Inundations', 'The sluices are open: grassland and polders lie under knee-deep water.', { farm_out: -0.15, stab: -2 }];
SPIRITS.fortress_holland = ['Fortress Holland', 'Behind the Water Line the cities of Holland can hold out for months.', { def: 0.05, stab: 2 }];
const hlOf = c => c.hl || (c.hl = { flood: 0, ready: 0, drained: 0, oil: 1, asked: 0 });
const hlFlooded = () => { const k = C('HOL'); return !!k && !!k.hl && k.hl.flood > 0 && G.day >= k.hl.ready; };
const HL_ACT = { flood: ['Open the Sluices', 30, 'Flood the Water Line, Amsterdam, Rotterdam and Zeeland: in ten days every province behind it defends at +60%, attackers at -30%; the harvest suffers while the water stands.'],
  drain: ['Drain the Polders', 15, 'Close the sluices and pump the land dry. It cannot be flooded again for two months.'],
  oilfull: ['Full Oil Contracts for Japan', 15, 'Shell and the BPM sell Japan everything it asks: more income; Japan +15; Britain and America -10.'],
  oilhalf: ['Limit Oil for Japan', 15, 'Sell Japan its usual quota and no more: Japan -10.'],
  oilcut: ['Stop Oil for Japan', 25, 'Not one more tanker for Japan: Japan -40, tension +4; America and Britain +15. The Japanese navy will look south.'] };
function hlAct(c, a) { const H = hlOf(c), d = HL_ACT[a]; if (!d) return 'Unknown'; if (c.pp < d[1]) return 'Not enough political power';
  if (a === 'flood') { if (H.flood) return 'The sluices are already open'; if (G.day - H.drained < 60) return 'The land is still being drained'; if (!HL_FLOOD.some(n => ndCtrl(n) === c.tag)) return 'We hold none of the Water Line'; }
  if (a === 'drain' && !H.flood) return 'Nothing is flooded'; const lv = { oilfull: 1, oilhalf: 0.5, oilcut: 0 }[a]; if (lv !== undefined && H.oil === lv) return 'That is already our policy';
  c.pp -= d[1];
  if (a === 'flood') { H.flood = G.day; H.ready = G.day + 10; addSpirit(c, 'inundations'); logMsg('The Dutch open the sluices: the Water Line begins to fill.', 'world', [c.tag]); }
  else if (a === 'drain') { H.flood = 0; H.drained = G.day; removeSpirit(c, 'inundations'); removeSpirit(c, 'fortress_holland'); }
  else { H.oil = lv; if (ok('JAP')) addRel('JAP', c.tag, { 1: 15, 0.5: -10, 0: -40 }[lv]); if (lv === 1) for (const t of ['ENG', 'USA']) ok(t) && addRel(t, c.tag, -10);
    if (lv === 0) { G.tension = Math.min(100, G.tension + 4); for (const t of ['ENG', 'USA']) ok(t) && addRel(t, c.tag, 15); logMsg('The Netherlands Indies stop selling oil to Japan.', 'world', [c.tag, 'JAP']); } }
  return ''; }
// how much of the Indies' oil still reaches Japan (0..1): set by whoever holds Palembang and Balikpapan
function hlOilToJapan() { const ps = ['Palembang', 'Balikpapan'].map(PN).filter(Boolean); if (!ps.length || !ok('JAP')) return 0; let s = 0;
  for (const p of ps) { const t = p.ctrl, k = t && C(t); if (!k || !ok(t) || t === 'JAP' || k.overlord === 'JAP') continue; if (atWar(t, 'JAP') || embargoing(k, 'JAP')) continue; s += t === 'HOL' ? hlOf(k).oil : 0.5; }
  return s / ps.length; }
function hlMonthly(c) { const H = hlOf(c), war = isAtWar(c.tag);
  if (H.flood) { const held = HL_FLOOD.some(n => ndCtrl(n) === c.tag || (ndCtrl(n) && friendly(c.tag, ndCtrl(n)) && !atWar(c.tag, ndCtrl(n)))); if (!held) { H.flood = 0; removeSpirit(c, 'inundations'); }
    removeSpirit(c, 'fortress_holland'); if (H.flood && G.day >= H.ready && war) addSpirit(c, 'fortress_holland'); }
  // the oil money: Shell, the BPM and the tankers of the Indies
  const indies = ['Palembang', 'Balikpapan', 'Medan'].filter(n => ndCtrl(n) === c.tag).length; c.money += weeksIncome(c, indies * (0.12 + 0.12 * H.oil * (ok('JAP') && !atWar(c.tag, 'JAP') ? 1 : 0)));
  if (c.ai) { if (war && !H.flood && ok('GER') && atWar(c.tag, 'GER') && c.pp >= 30) hlAct(c, 'flood'); if (H.flood && !war && G.day - H.flood > 120) hlAct(c, 'drain');
    if (G.historical) { if (H.oil === 1 && G.day >= ndDay(1940, 11)) hlAct(c, 'oilhalf'); if (H.oil > 0 && G.day >= ndDay(1941, 8)) hlAct(c, 'oilcut'); }
    else if (ok('JAP') && opinion(c.tag, 'JAP') < -40 && H.oil > 0 && c.pp > 40) hlAct(c, H.oil === 1 ? 'oilhalf' : 'oilcut'); } }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo0) { const r = _sp(armies, attacking, p, eo0); if (!armies.length || !p || !hlFlooded() || !HL_FLOOD.includes(p.name)) return r;
  const t = armies[0].owner; if (!attacking && (t === 'HOL' || friendly('HOL', t))) r.tough *= 1.6; else if (attacking && atWar(t, 'HOL')) r.atk *= 0.7; return r; }; }

// ======================= Belgium: two peoples, the King and the Congo =======================
SPIRITS.linguistic_peace = ['Linguistic Peace', 'Flemings and Walloons each feel the state is theirs too.', { stab: 3 }];
SPIRITS.linguistic_strife = ['Linguistic Strife', 'Every law, school and regiment is a quarrel between Flemings and Walloons.', { stab: -4, manpower: -0.03 }];
SPIRITS.policy_independence = ['The Policy of Independence', 'Belgium has left the French alliance: neutral, armed, and alone.', { def: 0.04 }];
const beOf = c => c.be || (c.be = { fl: 50, wa: 55, king: '', sengier: 0, indep: 0 });
const BE_ACT = { dutch: ['Dutch-Language Laws', 25, 'Dutch in the schools, courts and regiments of Flanders: Flemish goodwill +12, Walloon -6.'],
  french: ['Protect the French Speakers', 25, 'Guarantees for French in Brussels and the Walloon provinces: Walloon goodwill +12, Flemish -6.'],
  unity: ['Appeal to the Nation', 30, 'One Belgium, under one King: both communities +4.'],
  ban: ['Ban the VNV and Rex', 35, 'Outlaw the Flemish nationalists and Degrelle\'s Rexists: fascist support -6, stability +2, Flemish goodwill -5.'],
  indep: ['The Policy of Independence', 30, 'Leave every alliance and defend ourselves alone: France -15, Germany +5, defence +4%. Once.'],
  sengier: ['Ship the Ore to New York', 25, 'Union Minière sends 1,200 tons of Shinkolobwe uranium ore to a warehouse on Staten Island: the American atomic programme gains a great head start; income +6 weeks. Once.'] };
function beAct(c, a) { const B = beOf(c), d = BE_ACT[a]; if (!d) return 'Unknown'; if (c.pp < d[1]) return 'Not enough political power';
  if (a === 'indep' && B.indep) return 'Done once'; if (a === 'sengier') { if (B.sengier) return 'Done once'; if (!ok('USA')) return 'America is gone'; if (year() < 1939) return 'Not before 1939'; if (!['Élisabethville', 'Léopoldville'].some(n => ndCtrl(n) === c.tag || (ndCtrl(n) && friendly(c.tag, ndCtrl(n))))) return 'We do not hold the Congo'; }
  c.pp -= d[1];
  if (a === 'dutch') { B.fl = Math.min(100, B.fl + 12); B.wa = Math.max(0, B.wa - 6); } else if (a === 'french') { B.wa = Math.min(100, B.wa + 12); B.fl = Math.max(0, B.fl - 6); }
  else if (a === 'unity') { B.fl = Math.min(100, B.fl + 4); B.wa = Math.min(100, B.wa + 4); } else if (a === 'ban') { c.sup.fas = Math.max(0, c.sup.fas - 6); c.stab = Math.min(100, c.stab + 2); B.fl = Math.max(0, B.fl - 5); }
  else if (a === 'indep') { B.indep = G.day; leaveFaction(c.tag); for (const p of G.pacts.filter(x => x.t === 'ally' && (x.a === c.tag || x.b === c.tag))) G.pacts.splice(G.pacts.indexOf(p), 1); if (ok('FRA')) addRel('FRA', c.tag, -15); if (ok('GER')) addRel('GER', c.tag, 5); addSpirit(c, 'policy_independence'); logMsg('Belgium announces a policy of independence: no more alliance with France.', 'world', [c.tag]); }
  else { B.sengier = G.day; C('USA').uran = G.day; c.money += weeksIncome(c, 6); logMsg('Edgar Sengier ships 1,200 tons of Congolese uranium ore to New York. It will sit in a Staten Island warehouse until someone asks for it.', 'world', [c.tag, 'USA']); }
  return ''; }
function beMonthly(c) { const B = beOf(c); for (const k of ['fl', 'wa']) B[k] += (50 - B[k]) * 0.02;
  removeSpirit(c, 'linguistic_peace'); removeSpirit(c, 'linguistic_strife'); if (B.fl >= 60 && B.wa >= 60) addSpirit(c, 'linguistic_peace'); else if (B.fl < 30 || B.wa < 30) addSpirit(c, 'linguistic_strife');
  if (B.fl < 30) { c.sup.fas = Math.min(60, c.sup.fas + 0.5); for (const n of ['Antwerp', 'Ghent']) { const p = PN(n); if (p && p.owner === c.tag) p.unrest = Math.min(100, (p.unrest || 0) + 3); } }
  if (B.wa < 30) { c.sup.fas = Math.min(60, c.sup.fas + 0.3); for (const n of ['Liège', 'Charleroi']) { const p = PN(n); if (p && p.owner === c.tag) p.unrest = Math.min(100, (p.unrest || 0) + 3); } }
  c.money += weeksIncome(c, ['Élisabethville', 'Léopoldville', 'Stanleyville'].filter(n => ndCtrl(n) === c.tag).length * 0.1);
  if (c.ai) { if (B.fl < 35 && c.pp > 40) beAct(c, 'dutch'); else if (B.wa < 35 && c.pp > 40) beAct(c, 'french');
    if (G.historical && !B.indep && G.day >= ndDay(1936, 10)) beAct(c, 'indep'); if (G.historical && !B.sengier && G.day >= ndDay(1940, 9)) beAct(c, 'sengier'); } }
// the American bomb runs faster on Congolese ore
function uranMonthly() { for (const k of alive()) { if (!k.uran) continue; const r = k.research && k.research.prod; if (r && ['p_atomic', 'p_bomb'].includes(r.id)) r.prog += techCost(r.id) * 0.02; if (k.techs.p_bomb) k.nukeProg = (k.nukeProg || 0) + 2; } }
// when Belgium falls: does the King go to London with his government, or stay with his army?
function beKing(c, stay) { const B = beOf(c), E = exiles()[c.tag]; B.king = stay ? 'stay' : 'exile'; if (E) E.legit = clamp(E.legit + (stay ? -15 : 10), 0, 100);
  logMsg(stay ? 'King Leopold III surrenders with his army and stays at Laeken, a prisoner. His ministers go to London without him.' : 'King Leopold III leaves for London with his government: Belgium fights on.', 'world', [c.tag]); }

// ======================= Luxembourg: the radio and the steel =======================
SPIRITS.radio_lux = ['Radio Luxembourg', 'The most powerful transmitter in Europe speaks for us.', { ws: 3, pp: 0.03 }];
SPIRITS.arbed_steel = ['ARBED Steel', 'The Luxembourg steelworks deliver to our factories.', { output: 0.01 }];
const lxOf = c => c.lx || (c.lx = { air: '', steel: 'FRA', strike: 0 });
const LX_BUY = ['ENG', 'FRA', 'GER', 'USA', 'BEL', 'ITA'];
const LX_ACT = { air: ['Sell the Airtime', 15, 'A foreign power buys the evening hours of Radio Luxembourg for its own broadcasts: income every month, and their war support and political power rise; their enemies are not pleased.'],
  neutral: ['Keep the Radio Neutral', 10, 'Dance music and advertisements only: the airtime goes back on the open market.'],
  steel: ['ARBED Contract', 15, 'Send the steel of Esch and Differdange to one buyer: income, relations +10; their industry gains a little.'] };
function lxAct(c, a, to) { const L = lxOf(c), d = LX_ACT[a]; if (!d) return 'Unknown'; if (c.pp < d[1]) return 'Not enough political power'; if (ndCtrl('Luxembourg') !== c.tag) return 'We do not hold the transmitter';
  if ((a === 'air' || a === 'steel') && (!to || !ok(to) || atWar(c.tag, to) || !LX_BUY.includes(to))) return 'No such buyer'; if (a === 'air' && L.air === to) return 'They already buy it'; if (a === 'steel' && L.steel === to) return 'They already buy it'; if (a === 'neutral' && !L.air) return 'It is neutral already';
  c.pp -= d[1]; if (a === 'air') { L.air = to; addRel(to, c.tag, 10); for (const e of LX_BUY) if (e !== to && ok(e) && (atWar(e, to) || opinion(e, to) < -30)) addRel(e, c.tag, -10); } else if (a === 'neutral') L.air = ''; else { L.steel = to; addRel(to, c.tag, 10); }
  return ''; }
function lxMonthly() { const lux = C('LUX'), t = ndCtrl('Luxembourg'), L = lux ? lxOf(lux) : null; let radio = null, steel = null;
  if (lux && lux.exists && t === 'LUX' && !lux.capitulated) { radio = L.air && ok(L.air) ? L.air : null; steel = L.steel && ok(L.steel) ? L.steel : null; lux.money += weeksIncome(lux, (radio ? 0.5 : 0.25) + (steel ? 0.4 : 0.2)); }
  else if (t && ok(t) && C(t).major) { radio = t; steel = t; }
  for (const k of alive()) { removeSpirit(k, 'radio_lux'); removeSpirit(k, 'arbed_steel'); } if (radio) addSpirit(C(radio), 'radio_lux'); if (steel && ndCtrl('Esch') && (ndCtrl('Esch') === 'LUX' || ndCtrl('Esch') === steel)) addSpirit(C(steel), 'arbed_steel');
  // the general strike of 1942 against conscription into the Wehrmacht
  if (lux && L && !L.strike && year() >= 1942 && ndAxis(t) && (G.day >= ndDay(1942, 9) || !G.historical) && Math.random() < (G.historical ? 1 : 0.1)) { L.strike = G.day; for (const n of ['Luxembourg', 'Esch']) { const p = PN(n); if (p) p.unrest = Math.min(100, (p.unrest || 0) + 40); } const E = exiles().LUX; if (E) E.legit = Math.min(100, E.legit + 15);
    logMsg('Luxembourg answers conscription into the Wehrmacht with a general strike. Twenty-one strikers are shot.', 'world', ['LUX', 'GER']); }
  const E = exiles().LUX; if (E) E.legit = Math.min(100, E.legit + 0.4);
  if (lux && lux.ai && lux.exists && !lux.capitulated && t === 'LUX' && lux.pp > 30 && G.day % 365 < 31) { const buyer = pick(LX_BUY.filter(x => ok(x) && !atWar('LUX', x) && opinion('LUX', x) > 0)); if (buyer && !L.air && Math.random() < 0.5) lxAct(lux, 'air', buyer); } }

// ---------- hooks ----------
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (!c.exists || c.capitulated) return; if (c.tag === 'HOL') hlMonthly(c); else if (c.tag === 'BEL') beMonthly(c); }; }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); uranMonthly(); lxMonthly(); const E = exiles().BEL; if (E && ['Élisabethville', 'Léopoldville'].some(n => { const t = ndCtrl(n); return t === 'BEL' || (t && friendly('BEL', t)); })) E.funds = (E.funds || 0) + 2; }; }
{ const _cap = capitulate; capitulate = function (tag) { const c = C(tag), bel = tag === 'BEL' && c && !c.capitulated && !c.overlord; _cap(tag);
  if (bel && !beOf(c).king) { if (c.tag === G.player && !c.ai) UIH.popup({ title: 'The King\'s Choice', icon: '👑', desc: 'The army has fought for eighteen days and is surrounded on the Lys. The government urges the King to leave for France and London. He says his place is with his soldiers.', options: [{ name: 'The King stays with his army.', fn: () => beKing(c, true) }, { name: 'The King goes into exile with his government.', fn: () => beKing(c, false) }] }); else beKing(c, G.historical || Math.random() < 0.5); } }; }
Object.assign(XTOK, {
  hldo: v => { const k = v.trim(); if (!HL_ACT[k]) throw new Error('Unknown Dutch action ' + k); return [ndFree(hlAct, k), `${HL_ACT[k][0]}: ${HL_ACT[k][2]}`]; },
  bedo: v => { const k = v.trim(); if (!BE_ACT[k]) throw new Error('Unknown Belgian action ' + k); return [ndFree(beAct, k), `${BE_ACT[k][0]}: ${BE_ACT[k][2]}`]; },
  hloil: v => [c => { hlOf(c).oil = clamp(+v, 0, 1); }, `Oil for Japan: ${+v >= 1 ? 'full contracts' : +v > 0 ? 'limited' : 'none'}`],
  befl: v => [c => { const B = beOf(c); B.fl = clamp(B.fl + +v, 0, 100); }, `Flemish goodwill ${+v > 0 ? '+' : ''}${v}`],
  bewa: v => [c => { const B = beOf(c); B.wa = clamp(B.wa + +v, 0, 100); }, `Walloon goodwill ${+v > 0 ? '+' : ''}${v}`],
  uran: v => [() => { if (ok(v.trim())) C(v.trim()).uran = C(v.trim()).uran || G.day; }, `${COUNTRY_DEF[v.trim()].n} receives Congolese uranium for its atomic programme`],
  lxair: v => { const t = v.trim(); return [c => { lxOf(c).air = t === '-' ? '' : t; }, t === '-' ? 'Radio Luxembourg goes back on the open market' : `Radio Luxembourg broadcasts for ${COUNTRY_DEF[t].n}`]; },
  lxsteel: v => [c => { lxOf(c).steel = v.trim(); }, `ARBED steel goes to ${COUNTRY_DEF[v.trim()].n}`]
});
Object.assign(REQF, {
  holFlooded: [c => hlOf(c).flood > 0, 'The Water Line is flooded'],
  holFallen: [() => !ok('HOL') || C('HOL').capitulated || ndAxis(ndCtrl('Amsterdam')), 'The Netherlands have fallen'],
  belFallen: [() => !ok('BEL') || C('BEL').capitulated || ndAxis(ndCtrl('Brussels')), 'Belgium has fallen'],
  luxFallen: [() => !ok('LUX') || C('LUX').capitulated || ndAxis(ndCtrl('Luxembourg')), 'Luxembourg has fallen'],
  japWar: [() => ok('JAP') && isAtWar('JAP'), 'Japan is at war']
});

// 2.2 Economy 2.0: public debt and credit, inflation and the price level, unemployment and the business cycle, currency
// blocs and devaluation, war finance (war bonds, rationing, price controls), strategic reserves and investment priorities.
// It sits on top of the market economy: the weekly tick pays interest and runs the reserves; the monthly tick moves
// unemployment, inflation and growth, applies their effects and lets the AI manage its finances.
'use strict';
const UNEMP0 = { USA: 0.17, ENG: 0.12, GER: 0.05, FRA: 0.07, ITA: 0.07, JAP: 0.04, SOV: 0.01, CAN: 0.13, AST: 0.09, NZL: 0.08, SAF: 0.08, POL: 0.12, CZE: 0.1, AUT: 0.15, HOL: 0.14, BEL: 0.1, SWE: 0.07, NOR: 0.09, DEN: 0.1, SPA: 0.12, IRE: 0.12, LUX: 0.05, SWI: 0.08, HUN: 0.09, ROM: 0.06, YUG: 0.06 };
const DEBT0 = { ENG: 0.4, FRA: 0.4, ITA: 0.3, USA: 0.2, JAP: 0.3, GER: 0.15, BEL: 0.3, HOL: 0.2, POL: 0.2, SPA: 0.2, CHI: 0.3 };
const INFL0 = { FRA: -1, HOL: -1, SWI: -1, POL: -1, JAP: 2, ITA: 3, SOV: 5, SPA: 3, CHI: 7, GER: 1 };
const CUR_BLOC = { sterling: ['Sterling Area', 'ENG', 'Trade in sterling across the Empire and its friends.'], gold: ['Gold Bloc', 'FRA', 'Currencies still tied to gold: stable prices, dear exports and stubborn unemployment.'],
  dollar: ['Dollar Area', 'USA', 'The Americas trade in dollars.'], mark: ['Reichsmark Clearing', 'GER', 'Bilateral barter with Germany: guaranteed markets for raw materials, paid in German goods.'], yen: ['Yen Bloc', 'JAP', 'Japan\'s empire and its client states.'], rouble: ['Rouble Zone', 'SOV', 'The planned economy trades on its own terms.'] };
const BLOC0 = { sterling: ['ENG', 'CAN', 'AST', 'NZL', 'SAF', 'RAJ', 'IRE', 'EGY', 'IRQ', 'POR', 'SWE', 'NOR', 'DEN', 'FIN', 'EST', 'LAT', 'LIT'], gold: ['FRA', 'HOL', 'SWI', 'POL', 'LUX'], dollar: ['USA', 'PHI', 'CUB', 'MEX', 'PAN', 'COL', 'VEN', 'GUA', 'HON', 'ELS', 'NIC', 'COS', 'DOM', 'HAI', 'ECU'], mark: ['GER', 'AUT', 'HUN', 'ROM', 'YUG', 'BUL', 'GRE', 'TUR'], yen: ['JAP', 'MAN'], rouble: ['SOV', 'MON'] };
const ECON_PRIO = { balanced: ['Balanced', []], heavy: ['Heavy industry', ['steel', 'tools', 'chem', 'coalm', 'ironm', 'power', 'engines', 'oilr', 'synth']], consumer: ['Consumer goods', ['textile', 'furniture', 'farm', 'ranch', 'urban', 'autos', 'plantation']], military: ['War industry', ['arms', 'artyf', 'tankp', 'aircraftp', 'shipyard', 'steel', 'engines']], infra: ['Infrastructure', ['railway', 'port', 'construction', 'power']] };
const RES_GOODS = ['oil', 'rubber', 'steel'];
SPIRITS.unemp_some = ['Unemployment', 'Men stand outside the labour exchanges.', { stab: -2, tax: -0.03 }];
SPIRITS.unemp_mass = ['Mass Unemployment', 'One worker in seven has no job. The soup kitchens are full.', { stab: -6, tax: -0.08, legit: -4 }];
SPIRITS.unemp_full = ['Full Employment', 'Every pair of hands is needed.', { output: 0.03, stab: 2 }];
SPIRITS.infl_rising = ['Rising Prices', 'Wages lag behind the shops.', { stab: -3 }];
SPIRITS.infl_high = ['High Inflation', 'Savings melt away; prices are marked up every week.', { stab: -6, output: -0.03, tax: -0.05 }];
SPIRITS.infl_hyper = ['Hyperinflation', 'Banknotes by the basket. The currency is dying.', { stab: -15, output: -0.1, tax: -0.2, legit: -10 }];
SPIRITS.deflation = ['Deflation', 'Falling prices, falling wages, postponed investment.', { invest: -0.2, stab: -2 }];
SPIRITS.ration1 = ['Rationing', 'Coupons for meat, sugar and petrol.', { needs: -0.15, stab: -2 }];
SPIRITS.ration2 = ['Total Rationing', 'Everything is rationed; the queues never end.', { needs: -0.3, stab: -5 }];
SPIRITS.price_ctrl = ['Price Controls', 'Fixed prices, and a black market in everything.', { stab: -1, output: -0.02 }];
SPIRITS.devaluation = ['Devaluation', 'A cheaper currency sells more abroad.', { tradecap: 0.06 }];
for (const b in CUR_BLOC) SPIRITS['cb_' + b] = [CUR_BLOC[b][0], CUR_BLOC[b][2], b === 'gold' ? { tradecap: -0.02 } : b === 'mark' ? { tradecap: 0.06 } : b === 'rouble' ? { tradecap: 0.02 } : { tradecap: 0.05 }];
const ecOf = c => c.ec || (c.ec = { debt: (DEBT0[c.tag.slice(0, 3)] || 0.1) * (c.gdp || 0), rate: 0.035, infl: INFL0[c.tag.slice(0, 3)] || 1, cpi: 100, unemp: UNEMP0[c.tag.slice(0, 3)] !== undefined ? UNEMP0[c.tag.slice(0, 3)] : 0.08, hist: [], printed: 0, ration: 0, pctrl: false, res: { oil: 0, rubber: 0, steel: 0 }, resT: { oil: 0, rubber: 0, steel: 0 }, prio: 'balanced', bloc: Object.keys(BLOC0).find(b => BLOC0[b].includes(c.tag)) || null });
const debtRatio = c => { const e = ecOf(c); return c.gdp > 0 ? e.debt / c.gdp : 0; };
function creditScore(c) { const e = ecOf(c); return clamp(100 - debtRatio(c) * 55 - (e.defaulted && G.day - e.defaulted < 1825 ? 50 : 0) - Math.max(0, e.infl - 8) * 1.2 + (c.stab - 50) / 5 - (isAtWar(c.tag) && capInfo(c.tag).prog > 0.3 ? 15 : 0) - (hasSpirit(c, 'bankruptcy') ? 30 : 0), 0, 100); }
const RATINGS = [[85, 'AAA'], [75, 'AA'], [65, 'A'], [55, 'BBB'], [45, 'BB'], [35, 'B'], [25, 'CCC'], [0, 'D']];
const ratingOf = c => RATINGS.find(r => creditScore(c) >= r[0])[1];
const bondRate = (c, war) => Math.max(0.01, 0.02 + (100 - creditScore(c)) / 1000 - (war ? 0.015 : 0));
const weeksIncome = (c, n) => n * Math.max(200, (c.budget && c.budget.income) || 200);
// ---------- actions ----------
function ecAct(c, a, arg) { const e = ecOf(c), war = isAtWar(c.tag);
  if (a === 'bonds' || a === 'warbonds') { if (a === 'warbonds' && !war) return 'War bonds can only be sold in wartime'; if (creditScore(c) < 25) return 'No one will lend to us'; if (e.debt > c.gdp * 2) return 'Our debt is already twice our national income';
    if (e.bondDay && G.day - e.bondDay < 30) return `The market needs ${30 - (G.day - e.bondDay)} more days`; const amt = weeksIncome(c, a === 'warbonds' ? 16 : 12), r = bondRate(c, a === 'warbonds');
    e.rate = (e.debt * e.rate + amt * r) / Math.max(1, e.debt + amt); e.debt += amt; c.money += amt; e.bondDay = G.day; if (a === 'warbonds') { c.ws = Math.min(100, c.ws + 3); e.printed = Math.max(0, e.printed - 1); } return ''; }
  if (a === 'repay') { const amt = Math.min(e.debt, weeksIncome(c, 12)); if (amt <= 0) return 'We owe nothing'; if (c.money < amt + weeksIncome(c, 2)) return 'Not enough money in the treasury'; c.money -= amt; e.debt -= amt; return ''; }
  if (a === 'print') { if (e.printDay && G.day - e.printDay < 30) return `Again in ${30 - (G.day - e.printDay)} days`; c.money += weeksIncome(c, 10); e.printed += 6; e.printDay = G.day; return ''; }
  if (a === 'default') { if (e.debt <= 0) return 'We owe nothing'; e.debt = 0; e.defaulted = G.day; c.stab = Math.max(0, c.stab - 10); addSpirit(c, 'bankruptcy', 540); logMsg(`${c.name} repudiates its national debt.`, c.major ? 'world' : 'info', [c.tag]); return ''; }
  if (a === 'ration') { const v = +arg; if (v === 2 && !war) return 'Total rationing needs a war'; if (v === 1 && !war && G.tension < 50) return 'Rationing in peacetime needs world tension of 50'; e.ration = v; return ''; }
  if (a === 'pctrl') { e.pctrl = !e.pctrl; return ''; }
  if (a === 'reserve') { const [g, w] = String(arg).split(':'); if (!RES_GOODS.includes(g)) return 'Unknown good'; e.resT[g] = +w; return ''; }
  if (a === 'prio') { if (!ECON_PRIO[arg]) return 'Unknown'; e.prio = arg; return ''; }
  if (a === 'join') { const L = CUR_BLOC[arg]; if (!L || e.bloc === arg) return 'Not possible'; if (arg === 'gold') return 'No one joins the gold bloc any more'; if (!ok(L[1]) || atWar(c.tag, L[1])) return 'Its leader is gone or at war with us'; if (opinion(L[1], c.tag) < 0) return `${cname(L[1])} will not have us`; if (c.infl < 25) return 'Needs 25 influence'; c.infl -= 25; e.bloc = arg; addRel(L[1], c.tag, 10); return ''; }
  if (a === 'leave') { if (!e.bloc) return 'We belong to no bloc'; if (CUR_BLOC[e.bloc][1] === c.tag) return 'We lead it'; e.bloc = null; return ''; }
  if (a === 'devalue') { if (e.bloc !== 'gold') return 'Only a gold currency can be devalued this way'; devalue(c); return ''; }
  return 'Unknown'; }
function devalue(c) { const e = ecOf(c); e.bloc = null; e.devalued = G.day; e.printed += 4; addSpirit(c, 'devaluation', 540); c.stab = Math.max(0, c.stab - 3); logMsg(`${c.name} devalues its currency and leaves the gold standard.`, c.major ? 'world' : 'info', [c.tag]);
  if (c.tag === 'FRA') for (const k of alive()) if (k.tag !== 'FRA' && ecOf(k).bloc === 'gold' && k.ai) devalue(k); }
// ---------- weekly: interest and strategic reserves ----------
{ const _ef = econFinish; econFinish = function (c, warm) { _ef(c, warm); if (warm || !c.exists) return; const e = ecOf(c), B = c.budget;
  const int = e.debt * e.rate / 52; c.money -= int; B.debtInt = int; B.expense += int; B.net -= int;
  for (const g of RES_GOODS) { const m = c.market[g], D = m.d + m.exp, S = m.s + m.imp; if (D <= 0) continue; const want = e.resT[g] * D;
    if (c.ful[g] >= 0.98) { if (e.res[g] < want) { const buy = Math.min(want - e.res[g], D * 0.25), cost = buy * G.wp[g].p * 1.1; if (c.money > cost + weeksIncome(c, 2)) { c.money -= cost; e.res[g] += buy; B.reserve = (B.reserve || 0) + cost; } } }
    else if (e.res[g] > 0) { const draw = Math.min(e.res[g], D - S); e.res[g] -= draw; c.ful[g] = Math.min(1, (S + draw) / D); } } }; }
// private investors follow the national priority
{ const _bo = buildOptions; buildOptions = function (c, priv) { const out = _bo(c, priv), pr = c.ec && ECON_PRIO[c.ec.prio]; if (!pr || !pr[1].length) return out; for (const o of out) if (pr[1].includes(o.type)) o.score *= 1.6; return out.sort((a, b) => b.score - a.score); }; }
// ---------- monthly: unemployment, inflation, growth ----------
function econMonthly(c) { const e = ecOf(c); if (!c.gdp) return; const B = c.budget || {}, st = c.stats || {};
  e.hist.push([Math.round(c.gdp), +(e.unemp * 100).toFixed(1), +e.infl.toFixed(1)]); if (e.hist.length > 120) e.hist.shift();
  const h = e.hist, old = h.length > 12 ? h[h.length - 13][0] : h[0][0]; e.growth = old > 0 ? c.gdp / old - 1 : 0;
  // unemployment: slumps, deflation and austerity raise it; deficits, building and the army absorb it
  const deficit = clamp((-(B.net || 0) * 52) / c.gdp, -0.2, 0.3), soldiers = (c._ndiv || 0) * 12 / Math.max(1, (st.pop || 1) * 0.4), build = Math.min(0.03, (c.queue.length + c.pq.length) * 0.002);
  let tu = (c.laws.econ === 'command' ? 0.01 : 0.05) + Math.max(0, -e.growth) * 1.5 + (e.bloc === 'gold' ? 0.03 : 0) + (e.infl < 0 ? 0.02 : 0) - deficit * 0.6 - soldiers - build + (hasSpirit(c, 'us_recession') ? 0.06 : 0);
  if (isAtWar(c.tag)) tu -= 0.03; e.unemp = clamp(e.unemp + (clamp(tu, 0.005, 0.3) - e.unemp) * 0.08, 0, 0.35);
  // inflation: printing, shortages, deficits; price controls and rationing hold it down, gold holds it below zero
  const BASIC = ['grain', 'clothes', 'coal', 'furniture'], short = sum(BASIC, g => 1 - (c.ful[g] === undefined ? 1 : c.ful[g])) / BASIC.length;
  let ti = 1.5 + e.printed * 2 + short * 15 + Math.max(0, deficit - 0.04) * 40 - e.ration * 2 - (e.bloc === 'gold' ? 2.5 : 0) - Math.max(0, e.unemp - 0.08) * 20; if (e.pctrl) ti *= 0.5;
  e.infl += (ti - e.infl) * 0.25; e.printed *= 0.85; e.cpi *= 1 + e.infl / 1200;
  // effects
  for (const s of ['unemp_some', 'unemp_mass', 'unemp_full', 'infl_rising', 'infl_high', 'infl_hyper', 'deflation', 'ration1', 'ration2', 'price_ctrl']) removeSpirit(c, s);
  if (e.unemp >= 0.15) addSpirit(c, 'unemp_mass'); else if (e.unemp >= 0.08) addSpirit(c, 'unemp_some'); else if (e.unemp < 0.03) addSpirit(c, 'unemp_full');
  if (e.infl > 60) addSpirit(c, 'infl_hyper'); else if (e.infl > 20) addSpirit(c, 'infl_high'); else if (e.infl > 8) addSpirit(c, 'infl_rising'); else if (e.infl < -2) addSpirit(c, 'deflation');
  if (e.ration === 1) addSpirit(c, 'ration1'); else if (e.ration === 2) addSpirit(c, 'ration2'); if (e.pctrl) addSpirit(c, 'price_ctrl');
  for (const b in CUR_BLOC) removeSpirit(c, 'cb_' + b); if (e.bloc && ok(CUR_BLOC[e.bloc][1]) && !atWar(c.tag, CUR_BLOC[e.bloc][1])) addSpirit(c, 'cb_' + e.bloc); else if (e.bloc && !ok(CUR_BLOC[e.bloc][1])) e.bloc = null;
  if (e.bloc === 'mark' && c.tag !== 'GER' && ok('GER')) addRel(c.tag, 'GER', 1);
  if (e.unemp > 0.12) c.rad = Math.min(1, c.rad + (e.unemp - 0.12) * 0.03); if (e.infl > 20) c.rad = Math.min(1, c.rad + 0.003);
  // history: the franc goes off gold in the autumn of 1936
  if (G.historical && c.tag === 'FRA' && c.ai && e.bloc === 'gold' && G.day >= 268) devalue(c);
  if (c.ai) aiEcon(c, e);
}
function aiEcon(c, e) { const war = isAtWar(c.tag), inc = Math.max(200, (c.budget && c.budget.income) || 200);
  if (c.money < inc * 3 && creditScore(c) > 35 && debtRatio(c) < 1.2) ecAct(c, war ? 'warbonds' : 'bonds');
  else if (c.money < -inc * 10 && war && (c.ideology === 'fas' || c.ideology === 'com' || creditScore(c) < 30)) ecAct(c, 'print');
  else if (c.money > inc * 30 && e.debt > 0 && !war) ecAct(c, 'repay');
  if (war && (c.warExh > 30 || (c.ful.grain || 1) < 0.8) && e.ration < 1) e.ration = 1; if (war && c.warExh > 60 && e.ration < 2) e.ration = 2; if (!war && e.ration && G.tension < 50) e.ration = 0;
  e.pctrl = e.infl > 15;
  if (c.major && G.tension > 40) { for (const g of RES_GOODS) if (!e.resT[g]) e.resT[g] = g === 'oil' ? 12 : 6; }
  if (c.major && war && e.prio !== 'military') e.prio = 'military'; }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.exists && !c.capitulated) econMonthly(c); }; }
SPIRITS.us_recession = ['The Recession of 1937', 'The budget was balanced too soon. Factories close again.', { output: -0.04, stab: -3 }];
// ---------- effect tokens and economic events ----------
Object.assign(XTOK, {
  unemp: v => [c => { const e = ecOf(c); e.unemp = clamp(e.unemp + +v / 100, 0, 0.35); }, `Unemployment ${+v > 0 ? '+' : ''}${v} points`],
  inflx: v => [c => { ecOf(c).printed += +v / 2; }, `Inflation ${+v > 0 ? 'rises' : 'falls'} (${v})`],
  borrow: v => [c => { const e = ecOf(c), amt = weeksIncome(c, +v); e.rate = (e.debt * e.rate + amt * bondRate(c)) / Math.max(1, e.debt + amt); e.debt += amt; c.money += amt; }, `Borrow ${v} weeks of income`],
  devalue: () => [c => { if (ecOf(c).bloc === 'gold') devalue(c); else { addSpirit(c, 'devaluation', 540); ecOf(c).printed += 4; } }, 'Devalue the currency']
});
EV2('ec_franc', { t: ['FRA', 'HOL', 'SWI'], when: [1936, 1937], mtth: 4, req: c => ecOf(c).bloc === 'gold' && !c.ai, icon: '💱', title: 'The Gold Standard', desc: 'Gold is leaving the Bank. Our exports cost a third more than Britain\'s, and unemployment will not fall. The Treasury proposes to devalue.', opts: [['Devalue.', 'devalue', 2], ['Defend the currency.', 'unemp 2; stab 1', 1]] });
EV2('ec_recession', { t: 'USA', when: [1937, 1938], mtth: 4, req: c => !isAtWar(c.tag), icon: '📉', title: 'The Roosevelt Recession', desc: 'The Treasury has cut spending to balance the budget, and the Federal Reserve has tightened credit. Industrial production is falling faster than in 1929.', opts: [['Back to deficit spending.', 'borrow 10; unemp -2', 2], ['Hold the line on the budget.', 'spirit us_recession [365]; unemp 4', 1]] });
EV2('ec_mefo', { t: 'GER', when: [1938, 1939], mtth: 6, icon: '🧾', title: 'The Mefo Bills Fall Due', desc: 'Schacht\'s secret rearmament bills, twelve billion marks of them, are coming due. The Reichsbank warns of inflation.', opts: [['Roll them over.', 'borrow 8; inflx 3', 2], ['Print the money.', 'money 8; inflx 8', 1], ['Dismiss Schacht and squeeze the economy.', 'money 4; unemp 1; stab -2', 1]] });
EV2('ec_bankrun', { mtth: 6, rep: true, req: c => c.ec && creditScore(c) < 35 && c.gdp > 0, icon: '🏧', title: 'A Run on the Banks', desc: 'Depositors are queuing to withdraw their savings. Two provincial banks have closed their doors.', opts: [['Guarantee the deposits.', 'money -6; stab 2', 2], ['A bank holiday.', 'stab -4; unemp 2', 1]] });
EV2('ec_hyper', { mtth: 2, rep: true, req: c => c.ec && c.ec.infl > 60, icon: '💸', title: 'The Currency Is Dying', desc: 'Workers are paid twice a day and run to spend their wages before the afternoon prices. Peasants refuse paper money.', opts: [['A new currency, backed by land and gold.', 'inflx -20; stab -5; money -6', 2], ['Keep printing.', 'money 10; stab -6', 0]] });
EV2('ec_blackmarket', { mtth: 10, req: c => c.ec && c.ec.ration > 0 && isAtWar(c.tag), icon: '🧺', title: 'Spivs and Profiteers', desc: 'Petrol coupons, nylon stockings and butter change hands in every back street at three times the price.', opts: [['Make an example of a few.', 'stab 2; legit -1', 1], ['Look the other way.', 'stab -1; inflx 2', 1]] });
EV2('ec_hunger', { mtth: 8, req: c => c.ec && c.ec.unemp > 0.15, icon: '🚶', title: 'The Hunger March', desc: 'Unemployed men have marched on the capital and camp in the parks. Their banners ask for work, not charity.', opts: [['Public works for them.', 'borrow 6; unemp -2; stab 2', 2], ['Send them home.', 'stab -3; rad .03', 1]] });
EV2('ec_boom', { mtth: 18, req: c => c.ec && (c.ec.growth || 0) > 0.08 && c.ec.unemp < 0.05, icon: '🏭', title: 'Boom Times', desc: 'Order books are full, wages are rising and the factories advertise for workers.', opts: [['Cool it down: raise taxes a little.', 'money 6; inflx -3', 1], ['Let it run.', 'stab 3; inflx 3', 1]] });
EV2('ec_gold', { mtth: 3, req: c => occupied(c) && P(c.capital).ctrl !== c.tag && !c.flags.goldSaved, icon: '🪙', title: 'Save the Gold', desc: 'The gold reserve of the National Bank is in the vaults of the capital. The enemy is at the gates.', opts: [['Ship it abroad.', 'money 12; cflag goldSaved', 2], ['Hide it in the mountains.', 'money 6; cflag goldSaved', 1]] });

// 2.6 The Arsenal. Production lines with a learning curve; equipment models and the quality of what the army carries;
// labour and conscription; the named arms works of 1936 on the map (and what they are worth to whoever holds them);
// bombing of plants and their dispersal; civilian industry converted to war production; merchant shipbuilding; and
// the arms industry of every nation in 1936.
'use strict';
const PLANT = { arms: 'arms', artyf: 'artillery', tankp: 'tanks', aircraftp: 'aircraft', shipyard: 'ships' };
const PLANT_IDS = Object.keys(PLANT), PROD_NORM = 0.9;
// ---------- what the plants can build: [id, name, technology, quality, rate, text, flag] ----------
const MODELS = {
  arms: [['a_rifle', 'Bolt-Action Rifles', null, 1, 1, 'The rifle of the last war and the machine gun on its tripod.'],
    ['a_auto', 'Automatic Weapons', 'm_smg', 1.15, 0.95, 'Submachine guns and a light machine gun for every section.'],
    ['a_assault', 'Assault Rifles', 'm_assault', 1.35, 0.9, 'A rifle that fires like a machine gun, for every infantryman.'],
    ['a_cheap', 'Emergency Arms', null, 0.72, 1.45, 'Stamped tubes, simplified rifles, anything that shoots: numbers when nothing else counts.', 'cheap']],
  artyf: [['r_old', 'Guns of the Last War', null, 1, 1, 'Field guns of the 1914 pattern on wooden wheels.'],
    ['r_field', 'Modern Field Artillery', 'm_art1', 1.15, 0.95, 'Split-trail howitzers with rubber tyres, towed by lorries.'],
    ['r_at', 'Anti-Tank and Anti-Aircraft Guns', 'm_tank2', 1.25, 0.9, 'High-velocity guns that stop a tank at a thousand metres and reach a bomber at eight.'],
    ['r_rocket', 'Rocket Artillery', 'm_art2', 1.4, 0.9, 'Salvoes of rockets from rails on a lorry.']],
  tankp: [['t_light', 'Light Tanks', 'm_tank1', 1, 1, 'Machine guns and a small cannon behind thin armour.'],
    ['t_medium', 'Medium Tanks', 'm_tank2', 1.3, 0.9, 'A gun that kills tanks, armour that stops shells, and a radio.'],
    ['t_assault', 'Assault Guns', 'm_tank2', 1.1, 1.08, 'A gun in a fixed casemate on a tank chassis: cheaper than a turret.'],
    ['t_heavy', 'Heavy Tanks', 'm_tank3', 1.6, 0.7, 'Fifty tons and more: few, slow, and all but invulnerable.']],
  aircraftp: [['f_bi', 'Biplanes', null, 1, 1, 'Fabric, struts and wires.'],
    ['f_mono', 'Monoplane Fighters', 'm_air1', 1.2, 0.95, 'All-metal, a closed cockpit and a retractable undercarriage.'],
    ['f_cas', 'Ground-Attack Aircraft', 'm_cas', 1.25, 0.92, 'Dive bombers and armoured attack aircraft for the army.'],
    ['f_bomb', 'Heavy Bombers', 'm_air2', 1.4, 0.7, 'Four engines and four tons of bombs.'],
    ['f_jet', 'Jet Aircraft', 'm_air3', 1.7, 0.75, 'No propeller, and a hundred miles an hour faster than anything else in the sky.']],
  shipyard: [['s_escort', 'Destroyers and Escorts', null, 1, 1, 'The fleet\'s maids of all work.'],
    ['s_capital', 'Cruisers and Battleships', null, 1.2, 0.86, 'The line of battle.'],
    ['s_carrier', 'Fleet Carriers', 'm_nav1', 1.4, 0.76, 'A floating airfield that strikes beyond the horizon.'],
    ['s_sub', 'Submarines', 'm_nav2', 1.08, 1.12, 'The weapon of the weaker fleet.'],
    ['s_merchant', 'Merchant Ships', null, 1, 1.5, 'Freighters and tankers: they join the merchant fleet, not the navy.', 'merchant']]
};
const MODEL_BY = {}; for (const t in MODELS) for (const m of MODELS[t]) MODEL_BY[m[0]] = m;
const qEff = q => 1 + 0.5 * (q - 1);  // what quality is worth in a fight
const modelOK = (c, m) => !m[2] || !!c.techs[m[2]];
const modelsFor = (c, t) => MODELS[t].filter(m => modelOK(c, m));
// the best model for a plant: quality when the stockpile is healthy, value for the factory when it is not
function bestModel(c, t, short) { const l = modelsFor(c, t).filter(m => !m[6]); if (!l.length) return null; return l.slice().sort((a, b) => short ? b[4] * qEff(b[3]) - a[4] * qEff(a[3]) : b[3] - a[3])[0]; }
// ---------- the state of a nation's war industry ----------
function plantCounts(c) { const n = {}; for (const p of G.P) { if (p.owner !== c.tag || p.ctrl !== c.tag) continue; for (const t of PLANT_IDS) if (p.b[t]) n[t] = (n[t] || 0) + p.b[t]; } return n; }
function prodOf(c) { if (c.prod) return c.prod; const P0 = c.prod = { lines: [], q: {}, pol: {}, lf: {}, lab: 1, auto: true }, cnt = plantCounts(c);
  for (const t of PLANT_IDS) { const m = bestModel(c, t); P0.q[PLANT[t]] = m ? Math.round((1 + (m[3] - 1) * 0.8) * 100) / 100 : 1; if (cnt[t] && m) P0.lines.push({ id: G.nid++, t, m: m[0], fac: cnt[t], eff: PROD_NORM }); }
  P0.cnt = cnt; return P0; }
const lineOut = l => l.fac * l.eff * MODEL_BY[l.m][4];
function effCap(c) { const P0 = prodOf(c); return clamp(0.9 + (c.techs.p_assembly ? 0.05 : 0) + (c.techs.p_automation ? 0.05 : 0) + (c.techs.s_corp ? 0.03 : 0) - (P0.pol.foreign ? 0.05 : 0) + (M(c, 'prodcap') || 0), 0.6, 1.1); }
// men under arms against the workers left at the benches: the army's tail is counted with its teeth
const UNIFORM_TAIL = 2.2;
function labourF(c) { const P0 = prodOf(c), pop = (c.stats && c.stats.pop) || 0; if (!pop) return 1; const s = inService(c) * UNIFORM_TAIL / pop, thr = 0.045 + (P0.pol.women ? 0.035 : 0) + (P0.pol.foreign ? 0.03 : 0), k = P0.pol.reserved ? 1.4 : 2.6; P0.drafted = s; return clamp(1 - Math.max(0, s - thr) * k, 0.55, 1); }
function lineFactors(c) { const P0 = prodOf(c), cnt = P0.cnt || plantCounts(c), lf = {}; for (const t of PLANT_IDS) { const F = cnt[t] || 0; lf[t] = F ? sum(P0.lines.filter(l => l.t === t), lineOut) / F / PROD_NORM * P0.lab * (P0.pol.disperse ? 0.92 : 1) : 1; } return lf; }
// the multiplier the economy applies to a military plant in a province
function prodMul(c, p, t) { const P0 = c.prod; return (P0 && P0.lf && P0.lf[t] !== undefined ? P0.lf[t] : 1) * (1 - (p.fdm || 0)) * (1 + worksBonus(p, t)); }
function inSvcEq(c) { const n = {}; for (const a of armiesOf(c.tag)) for (const d of a.divs) { const eq = UNITS[d.t].eq; for (const g in eq) n[g] = (n[g] || 0) + eq[g] * d.str; } return n; }
// what a division's equipment is worth: its kit weighted by cost
function eqF(c, u) { const q = c.prod && c.prod.q; if (!q) return 1; let w = 0, s = 0; for (const g in u.eq) { const v = u.eq[g] * GOODS[g][1]; w += v; s += v * (q[g] || 1); } return w ? qEff(s / w) : 1; }
// ---------- every week ----------
function prodWeekly(c, warm) { const P0 = prodOf(c), cnt = P0.cnt = plantCounts(c);
  for (const t of PLANT_IDS) { const F = cnt[t] || 0, L = P0.lines.filter(l => l.t === t); let used = sum(L, l => l.fac);
    if (used > F) { for (let i = L.length - 1; i >= 0 && used > F; i--) { const cut = Math.min(L[i].fac, used - F); L[i].fac -= cut; used -= cut; } }
    else if (used < F && (c.ai || P0.auto !== false)) { let l = L.slice().sort((a, b) => b.fac - a.fac)[0]; if (!l) { const m = bestModel(c, t); if (m) { l = { id: G.nid++, t, m: m[0], fac: 0, eff: 0.5 }; P0.lines.push(l); } }
      if (l) { const add = F - used; l.eff = (l.eff * l.fac + 0.5 * add) / (l.fac + add); l.fac += add; } } }
  if (c.ai) P0.lines = P0.lines.filter(l => l.fac > 0);
  if (!warm) { const cap = effCap(c), st = 0.7 + 0.4 * c.stab / 100; for (const l of P0.lines) { if (!l.fac) continue; l.eff = l.eff < cap ? Math.min(cap, l.eff + (cap - l.eff) * 0.05 * st * (1 + (M(c, 'prodgain') || 0))) : Math.max(cap, l.eff - 0.01); } }
  P0.lab = labourF(c); P0.lf = lineFactors(c); }
// after the week's output is known: the quality of the inventory, merchant ships, the repair of bombed plants
const TON_PER_SHIP = 4;
function prodAfter(c, warm) { const P0 = prodOf(c), mk = c.market, svc = inSvcEq(c);
  for (const t of PLANT_IDS) { const g = PLANT[t], L = P0.lines.filter(l => l.t === t && l.fac > 0 && MODEL_BY[l.m][6] !== 'merchant'), w = sum(L, lineOut); if (!w) continue; const newQ = sum(L, l => lineOut(l) * MODEL_BY[l.m][3]) / w;
    const made = Math.max(0, mk[g].s), pool = Math.max(0, c.stock[g] || 0) + (svc[g] || 0); if (made + pool > 0 && !warm) P0.q[g] = Math.round(((P0.q[g] || 1) * pool + newQ * made) / (pool + made) * 1000) / 1000; }
  if (warm) return; const S = P0.lines.filter(l => l.t === 'shipyard' && l.fac > 0), all = sum(S, lineOut), mer = sum(S.filter(l => MODEL_BY[l.m][6] === 'merchant'), lineOut);
  if (mer > 0 && all > 0) { const took = Math.max(0, mk.ships.s) * mer / all; c.stock.ships = Math.max(0, c.stock.ships - took); if (typeof seaOf === 'function') { const s = seaOf(c); s.ton += took * TON_PER_SHIP; P0.merW = took * TON_PER_SHIP; } } else P0.merW = 0; }
function plantsRepair() { for (const p of G.P) { if (!p.fdm) continue; const c = C(p.ctrl), k = c && c.bt && c.bt.construction ? Math.min(2, 0.6 + c.bt.construction.lv * 0.05) : 0.6; p.fdm -= 0.022 * k; if (p.fdm <= 0.005) delete p.fdm; } }
{ const _et = economyTick; economyTick = function (warm) { for (const c of alive()) prodWeekly(c, warm); _et(warm); for (const c of alive()) prodAfter(c, warm); if (!warm) { plantsRepair(); worksWeekly(); } }; }
// bombs on the plants: called by the air war when a province is hit
function bombPlants(p, by, vic) { if (!PLANT_IDS.some(t => p.b[t])) return; const d = 0.06 * (1 + Math.max(0, M(by, 'bombing'))) * (1 - Math.max(0, M(vic, 'civdef'))) * (vic.prod && vic.prod.pol.disperse ? 0.5 : 1) * qEff((by.prod && by.prod.q.aircraft) || 1); p.fdm = Math.min(0.8, (p.fdm || 0) + d); }
// ---------- lines: what the player (and the AI) can do ----------
const lineById = (c, id) => prodOf(c).lines.find(l => l.id === +id);
const plantFree = (c, t) => ((prodOf(c).cnt || {})[t] || 0) - sum(prodOf(c).lines.filter(l => l.t === t), l => l.fac);
function lineAdd(c, t, mid) { const m = MODEL_BY[mid]; if (!m || !MODELS[t].includes(m)) return 'No such model'; if (!modelOK(c, m)) return `Needs ${TECHS[m[2]][0]}`; if (m[6] === 'cheap' && !isAtWar(c.tag)) return 'Only in wartime'; const P0 = prodOf(c); if (P0.lines.filter(l => l.t === t).length >= 4) return 'At most four lines for a kind of plant';
  const l = { id: G.nid++, t, m: mid, fac: 0, eff: 0.3 }; P0.lines.push(l); const f = plantFree(c, t); if (f > 0) lineFac(c, l.id, Math.min(f, 99)); return ''; }
function lineFac(c, id, n) { const l = lineById(c, id); if (!l) return 'No such line'; if (n > 0) { const f = Math.min(n, plantFree(c, l.t)); if (f <= 0) return 'No plant of this kind stands idle: take one from another line first'; l.eff = (l.eff * l.fac + 0.3 * f) / (l.fac + f); l.fac += f; } else l.fac = Math.max(0, l.fac + n); prodOf(c).lf = lineFactors(c); return ''; }
function lineDel(c, id) { const P0 = prodOf(c); P0.lines = P0.lines.filter(l => l.id !== +id); P0.lf = lineFactors(c); return ''; }
function lineRetool(c, id, mid) { const l = lineById(c, id), m = MODEL_BY[mid]; if (!l || !m || !MODELS[l.t].includes(m)) return 'No such model'; if (!modelOK(c, m)) return `Needs ${TECHS[m[2]][0]}`; if (m[6] === 'cheap' && !isAtWar(c.tag)) return 'Only in wartime'; if (l.m === mid) return '';
  const was = MODEL_BY[l.m]; l.eff = Math.max(0.2, l.eff * (m[6] === 'cheap' ? 0.85 : was[6] === 'cheap' ? 0.7 : 0.55)); l.m = mid; prodOf(c).lf = lineFactors(c); return ''; }
function lineMove(c, id, d) { const L = prodOf(c).lines, i = L.findIndex(l => l.id === +id), j = i + d; if (i < 0 || j < 0 || j >= L.length) return; [L[i], L[j]] = [L[j], L[i]]; }
// ---------- policies ----------
SPIRITS.pol_reserved = ['Reserved Occupations', 'Skilled men stay at their benches: the factories lose far fewer hands to the army, the army loses recruits.', { manpower: -0.08 }];
SPIRITS.pol_women = ['Women in the Factories', 'The women take the men\'s places at the lathes.', { stab: -1 }];
SPIRITS.pol_foreign = ['Foreign Labour', 'Workers brought from the occupied lands and the camps, few of them willingly.', { legit: -3 }];
SPIRITS.pol_disperse = ['Dispersed Industry', 'Plants split up among small towns, cellars and tunnels: bombs do half the harm, and output is 8% lower.', {}];
const PROD_POL = { reserved: ['Reserved Occupations', 30, 'The call-up passes over skilled workers. Men under arms cost the factories barely half as much output; conscriptable manpower -8%.'],
  women: ['Women in the Factories', 40, 'The share of the people that can be in uniform before output suffers rises from 4.5% to 8%. Stability -1.'],
  foreign: ['Foreign Labour', 20, 'Workers from occupied lands and prisoner-of-war camps: another 3% of the people can be in uniform before output suffers. The best a line can reach falls by 5%, unrest grows in the occupied lands, legitimacy -3 and infamy with it. Needs occupied land or prisoners.'],
  disperse: ['Disperse the Plants', 0, 'Bombs do half the harm to our plants; output of every line -8%. Costs two weeks of income to move the machines.'] };
function polCan(c, k) { const P0 = prodOf(c); if (P0.pol[k]) return ''; if (c.pp < PROD_POL[k][1]) return `Needs ${PROD_POL[k][1]} political power`;
  if (k === 'foreign' && !G.P.some(p => p.ctrl === c.tag && p.owner !== c.tag && !friendly(c.tag, p.owner)) && !(c.pw && Object.keys(c.pw.held || {}).length)) return 'Needs occupied land or prisoners of war';
  if (k === 'disperse' && c.money < 2 * Math.max(200, c.budget.income || 0)) return 'Needs two weeks of income in the treasury'; return ''; }
function polSet(c, k, on) { const P0 = prodOf(c); if (on) { const why = polCan(c, k); if (why) return why; c.pp -= PROD_POL[k][1]; if (k === 'disperse') c.money -= 2 * Math.max(200, c.budget.income || 0); if (k === 'foreign') c.infamy += 4; P0.pol[k] = G.day; addSpirit(c, 'pol_' + k); }
  else { delete P0.pol[k]; removeSpirit(c, 'pol_' + k); } P0.lab = labourF(c); P0.lf = lineFactors(c); return ''; }
function polMonthly(c) { const P0 = c.prod; if (!P0 || !P0.pol.foreign) return; for (const p of G.P) if (p.ctrl === c.tag && p.owner !== c.tag && !friendly(c.tag, p.owner)) p.unrest = Math.min(100, (p.unrest || 0) + 1); }
// ---------- conversion: civilian plants turned to war work ----------
const CONV = { tankp: 'autos', aircraftp: 'engines', artyf: 'tools' };
function convCan(c, to) { const from = CONV[to]; if (!from) return 'Cannot be converted'; if (BLD[to].tech && !c.techs[BLD[to].tech]) return `Needs ${TECHS[BLD[to].tech][0]}`; if (!isAtWar(c.tag) && G.tension < 50 && c.laws.econ !== 'command') return 'Only in wartime, at world tension 50, or in a command economy';
  if (c.pp < 20) return 'Needs 20 political power'; if (!G.P.some(p => p.owner === c.tag && p.ctrl === c.tag && p.b[from] > 0)) return `No ${BLD[from].name} to convert`; return ''; }
function convert(c, to) { const why = convCan(c, to); if (why) return why; const from = CONV[to], p = G.P.filter(q => q.owner === c.tag && q.ctrl === c.tag && q.b[from] > 0).sort((a, b) => b.b[from] - a.b[from] || b.dev - a.dev)[0];
  c.pp -= 20; p.b[from]--; if (!p.b[from]) delete p.b[from]; p.b[to] = (p.b[to] || 0) + 1; (p.conv = p.conv || {})[to] = (p.conv[to] || 0) + 1; const P0 = prodOf(c); P0.cnt = plantCounts(c); const l = P0.lines.filter(x => x.t === to).sort((a, b) => b.fac - a.fac)[0];
  if (l) { l.eff = (l.eff * l.fac + 0.35) / (l.fac + 1); l.fac++; } else { const m = bestModel(c, to, true); if (m) P0.lines.push({ id: G.nid++, t: to, m: m[0], fac: 1, eff: 0.35 }); } P0.lf = lineFactors(c); return ''; }
function reconvert(c, to) { const from = CONV[to], p = G.P.find(q => q.owner === c.tag && q.ctrl === c.tag && q.conv && q.conv[to] > 0 && q.b[to] > 0); if (!p) return 'Nothing was converted'; p.b[to]--; if (!p.b[to]) delete p.b[to]; p.b[from] = (p.b[from] || 0) + 1; p.conv[to]--; if (!p.conv[to]) delete p.conv[to]; if (!Object.keys(p.conv).length) delete p.conv; prodWeekly(c, true); return ''; }
const convCount = (c, to) => sum(G.P.filter(p => p.owner === c.tag && p.conv && p.conv[to]), p => p.conv[to]);
// ---------- the arms industry of 1936: arms works, artillery foundries, tank plants, aircraft plants, shipyards ----------
const MIL36 = { GER: [8, 4, 2, 4, 2], SOV: [12, 6, 4, 5, 2], USA: [4, 2, 1, 3, 6], ENG: [5, 3, 1, 4, 7], FRA: [7, 4, 2, 3, 3], ITA: [5, 3, 1, 3, 3], JAP: [6, 3, 1, 4, 5],
  CHI: [4, 1, 0, 1, 1], GXC: [1, 0, 0, 0, 0], YUN: [1, 0, 0, 0, 0], SHX: [2, 1, 0, 0, 0], XSM: [1, 0, 0, 0, 0], SIC: [1, 0, 0, 0, 0], PRC: [1, 0, 0, 0, 0], MAN: [2, 1, 0, 0, 0], SIK: [0, 0, 0, 0, 0], TIB: [0, 0, 0, 0, 0], MON: [0, 0, 0, 0, 0],
  POL: [3, 2, 1, 1, 0], CZE: [4, 3, 1, 2, 0], AUT: [2, 1, 0, 0, 0], HUN: [2, 1, 0, 1, 0], ROM: [2, 1, 0, 1, 0], YUG: [2, 1, 0, 1, 0], BUL: [1, 0, 0, 0, 0], GRE: [1, 0, 0, 0, 1], ALB: [0, 0, 0, 0, 0], TUR: [2, 1, 0, 1, 1],
  SPA: [3, 1, 0, 1, 2], POR: [1, 0, 0, 0, 1], IRE: [0, 0, 0, 0, 0], BEL: [3, 1, 0, 1, 1], HOL: [1, 1, 0, 2, 3], LUX: [0, 0, 0, 0, 0], SWI: [2, 2, 0, 1, 0], DEN: [1, 0, 0, 0, 1], NOR: [1, 0, 0, 0, 1], SWE: [2, 2, 1, 1, 2], FIN: [2, 1, 0, 1, 1],
  EST: [1, 0, 0, 0, 0], LAT: [1, 0, 0, 0, 0], LIT: [1, 0, 0, 0, 0], PER: [1, 0, 0, 0, 0], IRQ: [0, 0, 0, 0, 0], SAU: [0, 0, 0, 0, 0], YEM: [0, 0, 0, 0, 0], AFG: [1, 0, 0, 0, 0], RAJ: [3, 1, 0, 0, 1], NEP: [0, 0, 0, 0, 0], SIA: [1, 0, 0, 0, 0], PHI: [0, 0, 0, 0, 0],
  AST: [1, 1, 0, 1, 1], NZL: [0, 0, 0, 0, 0], CAN: [2, 1, 0, 1, 1], SAF: [1, 0, 0, 0, 0], EGY: [0, 0, 0, 0, 0], ETH: [0, 0, 0, 0, 0], LIB: [0, 0, 0, 0, 0], MEX: [1, 0, 0, 0, 0], GUA: [0, 0, 0, 0, 0], HON: [0, 0, 0, 0, 0], ELS: [0, 0, 0, 0, 0], NIC: [0, 0, 0, 0, 0],
  COS: [0, 0, 0, 0, 0], PAN: [0, 0, 0, 0, 0], CUB: [0, 0, 0, 0, 0], HAI: [0, 0, 0, 0, 0], DOM: [0, 0, 0, 0, 0], COL: [0, 0, 0, 0, 0], VEN: [0, 0, 0, 0, 0], ECU: [0, 0, 0, 0, 0], PRU: [0, 0, 0, 0, 1], BOL: [0, 0, 0, 0, 0], CHL: [1, 0, 0, 0, 1],
  ARG: [1, 1, 0, 1, 1], URU: [0, 0, 0, 0, 0], PAR: [0, 0, 0, 0, 0], BRA: [2, 1, 0, 0, 1] };
// the named works: province | name | plants | bonus to that kind of plant in the province
const WORKS = []; const WORKS_AT = {};
(`Essen|Krupp|artyf 2|.2
Berlin|Rheinmetall-Borsig|artyf 1
Berlin|Deutsche Waffen- und Munitionsfabriken|arms 1
Stuttgart|Mauser Works, Oberndorf|arms 2|.15
Erfurt|The Gunmakers of Suhl|arms 1
Kassel|Henschel|tankp 1
Nuremberg|MAN|tankp 1
Augsburg|Messerschmitt|aircraftp 1|.15
Magdeburg|Junkers, Dessau|aircraftp 1
Rostock|Heinkel|aircraftp 1
Bremen|Focke-Wulf|aircraftp 1
Hamburg|Blohm & Voss|shipyard 1|.15
Kiel|Germaniawerft|shipyard 1
Tula|Tula Arms Works|arms 2|.2
Vladimir|Kovrov Machine-Gun Works|arms 1
Kazan|Izhevsk Arms Works|arms 2
Leningrad|Sestroretsk Arsenal|arms 1
Molotov|Motovilikha Works|artyf 2|.15
Leningrad|Bolshevik Works|artyf 1
Gorky|Novoye Sormovo|artyf 1
Stalingrad|Barrikady Works|artyf 1
Kharkov|Kharkov Locomotive Works|tankp 2|.2
Leningrad|Kirov Works|tankp 1
Stalingrad|Stalingrad Tractor Works|tankp 1
Moscow|Aviation Plants No. 1 and No. 22|aircraftp 2
Gorky|Aviation Plant No. 21|aircraftp 1
Voronezh|Aviation Plant No. 18|aircraftp 1
Kazan|Aviation Plant No. 124|aircraftp 1
Leningrad|Baltic Works|shipyard 1
Nikolaev|Marti Yard|shipyard 1
Boston|Springfield Armory|arms 2|.15
Chicago|Rock Island Arsenal|arms 1, artyf 1, tankp 1
New York|Watervliet Arsenal|artyf 1
Seattle|Boeing|aircraftp 1|.15
Los Angeles|Douglas|aircraftp 1
Buffalo|Curtiss-Wright|aircraftp 1
Norfolk|Newport News Shipbuilding|shipyard 2|.2
New York|New York Navy Yard|shipyard 1
Philadelphia|Philadelphia Navy Yard|shipyard 1
Boston|Fore River Yard|shipyard 1
San Francisco|Mare Island Navy Yard|shipyard 1
London|Royal Small Arms Factory, Enfield|arms 2|.15
Birmingham|Birmingham Small Arms|arms 2
Newcastle|Vickers-Armstrongs, Elswick|artyf 2, tankp 1|.2
London|Royal Arsenal, Woolwich|artyf 1
Southampton|Supermarine|aircraftp 1|.15
Manchester|Avro|aircraftp 1
London|Hawker, Kingston|aircraftp 1
Bristol|Bristol Aeroplane Company|aircraftp 1
Glasgow|John Brown, Clydebank|shipyard 2|.15
Belfast|Harland & Wolff|shipyard 1
Liverpool|Cammell Laird|shipyard 1
Southampton|Portsmouth Dockyard|shipyard 1
Plymouth|Devonport Dockyard|shipyard 1
Newcastle|The Tyne Yards|shipyard 1
Lyon|Manufacture d'Armes de Saint-Étienne|arms 2|.15
Poitiers|Manufacture d'Armes de Châtellerault|arms 2
Limoges|Manufacture d'Armes de Tulle|arms 1
Dijon|Schneider, Le Creusot|artyf 2|.2
Orléans|Bourges Arsenal|artyf 1
Paris|Puteaux Workshops|artyf 1
Paris|Renault, Billancourt|tankp 1
Paris|SOMUA and Hotchkiss|tankp 1
Paris|Bloch and Potez|aircraftp 1
Toulouse|Dewoitine|aircraftp 1
Brest|Brest Arsenal|shipyard 1
Nantes|Penhoët, Saint-Nazaire|shipyard 1
Toulon|Toulon Arsenal|shipyard 1
Milan|Beretta, Gardone|arms 2|.15
Perugia|Terni Arms Works|arms 1
Genoa|Ansaldo|artyf 2, tankp 1, shipyard 1|.15
Livorno|OTO, La Spezia|artyf 1
Turin|Fiat Aviazione|aircraftp 1
Milan|Breda and Macchi|aircraftp 1
Trieste|Cantieri Riuniti, Monfalcone|shipyard 1
Naples|Castellammare Yard|shipyard 1
Fukuoka|Kokura Arsenal|arms 2
Tokyo|Tokyo Arsenal|arms 2, tankp 1
Nagoya|Nagoya Arsenal|arms 1
Osaka|Osaka Arsenal|artyf 2|.15
Nagoya|Mitsubishi Aircraft|aircraftp 2|.15
Tokyo|Nakajima, Ota|aircraftp 1
Osaka|Kawasaki, Kobe|aircraftp 1, shipyard 1
Hiroshima|Kure Naval Arsenal|shipyard 2|.2
Tokyo|Yokosuka Naval Arsenal|shipyard 1
Fukuoka|Mitsubishi Yard, Nagasaki|shipyard 1
Wuhan|Hanyang Arsenal|arms 2|.15
Nanjing|Jinling Arsenal|arms 1
Luoyang|Gongxian Arsenal|arms 1, artyf 1
Hangzhou|Central Aircraft Works|aircraftp 1
Shanghai|Kiangnan Dockyard|shipyard 1
Mukden|Mukden Arsenal|arms 2, artyf 1|.1
Taiyuan|Taiyuan Arsenal|arms 2, artyf 1
Radom|Fabryka Broni|arms 2|.15
Warsaw|State Rifle Factory|arms 1
Kielce|Starachowice Works|artyf 2
Warsaw|PZInż, Ursus|tankp 1
Warsaw|PZL, Okęcie|aircraftp 1
Brno|Zbrojovka Brno|arms 2|.2
Budějovice|Strakonice Arms Works|arms 1
Pilsen|Škoda Works|artyf 2|.25
Ostrava|Vítkovice Ironworks|artyf 1
Prague|ČKD|tankp 1
Prague|Avia and Letov|aircraftp 2
Linz|Steyr Works|arms 2|.15
Graz|Böhler, Kapfenberg|artyf 1
Budapest|Manfréd Weiss, Csepel|arms 2, aircraftp 1
Miskolc|Diósgyőr Works|artyf 1
Sibiu|Cugir Arms Works|arms 1
Bucharest|Malaxa|arms 1
Timișoara|Reșița Works|artyf 1
Brașov|IAR|aircraftp 1
Kragujevac|Kragujevac Arsenal|arms 2, artyf 1|.1
Belgrade|Ikarus, Zemun|aircraftp 1
Stara Zagora|Kazanlak Arsenal|arms 1
Athens|Pyrkal|arms 1
Athens|Skaramangas Yard|shipyard 1
Ankara|Kırıkkale Arsenal|arms 2, artyf 1
Kayseri|Kayseri Aircraft Factory|aircraftp 1
Istanbul|Gölcük Naval Yard|shipyard 1
Oviedo|Oviedo and Trubia|arms 1, artyf 1
Toledo|Toledo Arms Factory|arms 1
Bilbao|The Gunmakers of Eibar|arms 1
Seville|CASA and Hispano|aircraftp 1
Corunna|Ferrol Arsenal|shipyard 1
Murcia|Cartagena Arsenal|shipyard 1
Lisbon|Braço de Prata|arms 1
Lisbon|Alfeite Arsenal|shipyard 1
Liège|Fabrique Nationale, Herstal|arms 2|.25
Liège|Cockerill, Seraing|artyf 1
Brussels|SABCA|aircraftp 1
Antwerp|Cockerill Yard, Hoboken|shipyard 1
Amsterdam|Artillerie-Inrichtingen, Hembrug|arms 1, artyf 1
Amsterdam|Fokker|aircraftp 1|.1
Rotterdam|Koolhoven|aircraftp 1
Rotterdam|Wilton-Fijenoord|shipyard 2
Vlissingen|De Schelde|shipyard 1
Bern|SIG and the Federal Arms Factory|arms 2
Bern|Oerlikon|artyf 2|.2
Bern|Federal Aircraft Works|aircraftp 1
Copenhagen|Dansk Industri Syndikat (Madsen)|arms 1
Copenhagen|Orlogsværftet|shipyard 1
Oslo|Kongsberg Våpenfabrikk|arms 1|.15
Oslo|Horten Naval Yard|shipyard 1
Stockholm|Carl Gustaf Rifle Factory|arms 1
Gothenburg|Husqvarna|arms 1
Örebro|Bofors|artyf 2|.25
Malmö|Landsverk|tankp 1
Stockholm|ASJA, Linköping|aircraftp 1
Gothenburg|Götaverken|shipyard 1
Malmö|Kockums|shipyard 1
Tampere|Tikkakoski and the State Rifle Factory|arms 2
Helsinki|State Artillery Factory|artyf 1
Tampere|State Aircraft Factory|aircraftp 1
Turku|Crichton-Vulcan|shipyard 1
Tallinn|Arsenal, Tallinn|arms 1
Riga|VEF|arms 1
Šiauliai|Linkaičiai Armoury|arms 1
Tehran|Tehran Arsenal|arms 1
Kabul|Mashin Khana|arms 1
Calcutta|Ishapore Rifle Factory|arms 2
Poona|Kirkee Ammunition Factory|arms 1
Calcutta|Cossipore Gun and Shell Factory|artyf 1
Bombay|Bombay Dockyard|shipyard 1
Bangkok|Bangkok Arsenal|arms 1
Sydney|Lithgow Small Arms Factory|arms 1
Melbourne|Maribyrnong Ordnance Factory|artyf 1
Melbourne|Commonwealth Aircraft Corporation|aircraftp 1
Sydney|Cockatoo Island Dockyard|shipyard 1
Quebec|Dominion Arsenal|arms 1
Toronto|John Inglis|arms 1
Montreal|Sorel Industries|artyf 1
Montreal|Canadian Vickers|aircraftp 1, shipyard 1
Johannesburg|Pretoria Arsenal|arms 1
Mexico City|Fábrica Nacional de Armas|arms 1
Santiago|FAMAE|arms 1
Buenos Aires|Fábrica Militar de Armas|arms 1
Córdoba|Fábrica Militar de Aviones|aircraftp 1
Buenos Aires|Río Santiago Yard|shipyard 1
Belo Horizonte|Itajubá Arms Factory|arms 1
Rio de Janeiro|Realengo Arsenal|arms 1, artyf 1
Rio de Janeiro|Arsenal de Marinha|shipyard 1`).split('\n').forEach((line, i) => { const [prov, name, pl, bonus] = line.split('|'), lv = {}; for (const x of pl.split(',')) { const [t, n] = x.trim().split(' '); lv[t] = +n; } WORKS.push({ i, prov, name, lv, bonus: +bonus || 0 }); });
function worksInit() { for (const k in WORKS_AT) delete WORKS_AT[k]; for (const w of WORKS) { const id = PNAME[w.prov]; w.id = id; if (id !== undefined) (WORKS_AT[id] = WORKS_AT[id] || []).push(w); } }
const worksAt = p => { if (WORKS[0].id === undefined && WORKS[0].id !== null) worksInit(); return WORKS_AT[p.id] || []; };
function worksBonus(p, t) { const l = worksAt(p); let b = 0; for (const w of l) if (w.lv[t] && w.bonus && p.b[t] > 0) b = Math.max(b, w.bonus); return b; }
// at the start of a game the named works take their share of a nation's plants; the rest go to its best provinces
function placeWorks(c, mil, types) { worksInit(); for (const w of WORKS) { if (w.id === undefined) continue; const p = P(w.id); if (p.owner !== c.tag) continue; for (const t in w.lv) { const i = types.indexOf(t); if (i < 0 || (t === 'shipyard' && !p.coastal)) continue; const n = Math.min(w.lv[t], Math.max(0, mil[i])); if (!n) continue; p.b[t] = (p.b[t] || 0) + n; mil[i] -= n; } } }
// works in occupied land turn out a third of their output for the occupier, less what sabotage and bombs cost
function worksWeekly() { if (WORKS[0].id === undefined) worksInit(); for (const w of WORKS) { if (w.id === undefined) continue; const p = P(w.id); if (p.ctrl === p.owner || !atWar(p.ctrl, p.owner)) continue; const o = C(p.ctrl); if (!o || !o.exists) continue;
    for (const t in w.lv) { const lv = Math.min(w.lv[t], p.b[t] || 0); if (!lv) continue; const g = PLANT[t], rate = BLD[t].pms[0][3][g] || 0; o.stock[g] = (o.stock[g] || 0) + lv * rate * 0.33 * (1 - p.dmg) * (1 - (p.fdm || 0)) * (1 - Math.min(0.6, (p.unrest || 0) / 150)); } } }
// ---------- the AI's ministry of armaments ----------
function aiProduction(c) { const P0 = prodOf(c), war = isAtWar(c.tag), need = c.milNeed || {};
  for (const t of PLANT_IDS) { const g = PLANT[t], L = P0.lines.filter(l => l.t === t && l.fac > 0); if (!L.length) continue; const short = war && (c.stock[g] || 0) < (need[g] || 0) * 4, best = bestModel(c, t, short); if (!best) continue;
    for (const l of L) { const cur = MODEL_BY[l.m]; if (cur[0] === best[0] || cur[6] === 'merchant') continue; const gain = best[4] * qEff(best[3]) / (cur[4] * qEff(cur[3])); if (l.eff >= 0.7 && (best[3] > cur[3] + 0.04 || gain > 1.08) && (!war || gain > 1.02 || Math.random() < 0.3)) { lineRetool(c, l.id, best[0]); break; } } }
  // merchant ships for nations that live by the sea and are losing tonnage
  if (typeof seaOf === 'function' && (P0.cnt.shipyard || 0) >= 3) { const s = seaOf(c), low = s.ton < s.ton0 * 0.85, mer = P0.lines.find(l => l.t === 'shipyard' && l.m === 's_merchant'), big = P0.lines.filter(l => l.t === 'shipyard' && l.m !== 's_merchant').sort((a, b) => b.fac - a.fac)[0];
    if (low && !mer && big && big.fac >= 3) { const n = Math.max(1, Math.round(big.fac * 0.35)); big.fac -= n; P0.lines.push({ id: G.nid++, t: 'shipyard', m: 's_merchant', fac: n, eff: 0.35 }); } else if (mer && s.ton >= s.ton0 && big) { big.eff = (big.eff * big.fac + 0.5 * mer.fac) / (big.fac + mer.fac); big.fac += mer.fac; mer.fac = 0; } }
  if (war) { if (P0.lab < 0.93 && !P0.pol.women && (c.ideology !== 'fas' || year() >= 1942 || P0.lab < 0.8)) polSet(c, 'women', true); if (P0.lab < 0.86 && !P0.pol.reserved) polSet(c, 'reserved', true); if (P0.lab < 0.9 && !P0.pol.foreign && c.ideology !== 'dem') polSet(c, 'foreign', true);
    if (!P0.pol.disperse && sum(G.P.filter(p => p.owner === c.tag && p.fdm), p => p.fdm) > 1.2) polSet(c, 'disperse', true);
    if (c.major && (need.tanks || 0) > 0 && (c.stock.tanks || 0) < (need.tanks || 0) * 3 && convCount(c, 'tankp') < 3 && Math.random() < 0.4) convert(c, 'tankp'); if (c.major && convCount(c, 'aircraftp') < 2 && (c.stock.aircraft || 0) < 200 && Math.random() < 0.25) convert(c, 'aircraftp'); }
  else { for (const k of ['women', 'reserved', 'foreign']) if (P0.pol[k] && G.day - P0.pol[k] > 200 && P0.lab >= 1) polSet(c, k, false); for (const t in CONV) if (convCount(c, t) && Math.random() < 0.3) reconvert(c, t); } }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (!c.exists || c.capitulated) return; polMonthly(c); if (c.ai) aiProduction(c); }; }

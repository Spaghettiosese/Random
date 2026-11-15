// 2.2 national systems for the great powers: Germany's polycracy, the Soviet plan and terror, America's Congress and
// public opinion, the British Commonwealth, the French Republic's cabinet crises, the Duce's prestige and Japan's oil clock.
'use strict';
const mjDay = (y, m) => Math.round((Date.UTC(y, m - 1, 1) - Date.UTC(1936, 0, 1)) / 864e5);
// ======================= Germany: the Führer state =======================
const POLY = { wehr: ['The Wehrmacht', 'The generals of the old army.', { atk: 0.04, org: 0.03 }], ss: ['The SS', 'Himmler\'s order: police, camps and its own divisions.', { stab: 4, pp: 0.05 }], party: ['The Party', 'Gauleiters, the Hitler Youth and the propaganda machine.', { ws: 6, pp: 0.08 }], ind: ['Industry and the Four-Year Plan', 'Göring\'s plan, Speer\'s ministry and the industrialists.', { mil_out: 0.06, output: 0.02 }] };
for (const k in POLY) SPIRITS['poly_' + k] = [`${POLY[k][0]} Ascendant`, POLY[k][1], POLY[k][2]];
SPIRITS.poly_chaos = ['A Chaos of Competencies', 'Rival offices duplicate and sabotage each other; only the Führer decides.', { output: -0.03, pp: -0.05 }];
const polyOf = c => c.poly || (c.poly = { f: { wehr: 35, ss: 12, party: 28, ind: 25 }, last: 0 });
const polyNorm = P0 => { const t = sum(Object.keys(P0.f), k => P0.f[k]); for (const k in P0.f) P0.f[k] = Math.max(2, P0.f[k] * 100 / t); };
function polyMonthly(c) { const P0 = polyOf(c), f = P0.f, war = isAtWar(c.tag), win = G.P.filter(p => p.ctrl === c.tag && p.owner !== c.tag && atWar(c.tag, p.owner)).length, lose = capInfo(c.tag).prog;
  f.wehr += war ? (lose > 0.15 ? -1.5 : Math.min(2, win * 0.05)) : 0.2; f.ss += (c.laws.security === 'secret_police' ? 0.8 : 0) + (c.occ2 && Object.values(c.occ2).some(L => L.pol === 'terror') ? 1 : 0) + (lose > 0.3 ? 1 : 0); f.party += c.ws > 70 ? 0.5 : -0.3; f.ind += ['war_econ', 'total'].includes(c.laws.mobil) ? 1 : 0.2; polyNorm(P0);
  for (const k in POLY) removeSpirit(c, 'poly_' + k); removeSpirit(c, 'poly_chaos'); const top = Object.keys(f).sort((a, b) => f[b] - f[a])[0]; if (f[top] < 34) addSpirit(c, 'poly_chaos'); else addSpirit(c, 'poly_' + top);
  // the generals' plot
  if (year() >= 1943 && f.wehr < 22 && lose > 0.3 && !c.flags.julyPlot && Math.random() < 0.1) { c.flags.julyPlot = G.day; const ok_ = Math.random() < 0.4;
    if (c.tag === G.player && !c.ai) UIH.popup({ title: 'The 20th of July', icon: '💣', desc: 'A bomb has exploded under the map table at the Wolf\'s Lair. Officers in Berlin claim the Führer is dead and order the SS disarmed.', options: [{ name: 'The plot succeeds: the generals take over.', fn: () => julyPlot(c, true) }, { name: 'The Führer survives. Hunt them down.', fn: () => julyPlot(c, false) }] });
    else julyPlot(c, ok_); }
  if (c.ai && c.pp > 120 && G.day - P0.last > 180) { const want = war ? (lose > 0.2 ? 'ind' : 'wehr') : 'ind'; if (top !== want) polyAct(c, 'favour', want); }
  // Fall Gelb (10 May 1940): when the Phoney War ends, the armour goes through the Ardennes whether or not the focus is done
  if (G.historical && c.ai && G.day >= mjDay(1940, 5) + 9 && !c.flags.sichel && ok('FRA') && atWar(c.tag, 'FRA') && !C('FRA').capitulated) { c.flags.sichel = G.day; if (!hasSpirit(c, 'blitzkrieg')) addSpirit(c, 'blitzkrieg', 150); } } // 2.3: balance23.js announces Fall Gelb
function julyPlot(c, success) { const f = polyOf(c).f;
  if (success) { setIdeology(c, 'aut', true); c.ws = Math.max(0, c.ws - 15); f.wehr = 60; polyNorm(polyOf(c)); logMsg('The generals seize power in Berlin. The Führer is dead.', 'world', [c.tag]); }
  else { f.ss += 25; f.wehr = Math.max(2, f.wehr - 10); polyNorm(polyOf(c)); c.gens = c.gens.slice(0, Math.max(2, c.gens.length - 2)); c.stab = Math.min(100, c.stab + 2); logMsg('The plot against the Führer fails. Thousands are arrested; field marshals are hanged.', 'world', [c.tag]); } }
const POLY_ACT = { favour: ['Favour', 40, 'The Führer listens to them: their influence +12.'], divide: ['Divide and Rule', 40, 'Play them against each other: the strongest -10, the others +3, stability +3.'], purge: ['Purge', 30, 'An affair is arranged: their influence -20, political power +30, stability -4.'] };
function polyAct(c, a, k) { const P0 = polyOf(c), d = POLY_ACT[a]; if (c.pp < d[1]) return 'Not enough political power'; if (a !== 'divide' && !(k in P0.f)) return 'Unknown'; c.pp -= d[1]; P0.last = G.day;
  if (a === 'favour') P0.f[k] += 12; else if (a === 'purge') { P0.f[k] = Math.max(2, P0.f[k] - 20); c.pp += 30; c.stab = Math.max(0, c.stab - 4); } else { const top = Object.keys(P0.f).sort((x, y) => P0.f[y] - P0.f[x])[0]; for (const x in P0.f) P0.f[x] += x === top ? -10 : 3; c.stab = Math.min(100, c.stab + 3); } polyNorm(P0); return ''; }
// ======================= Soviet Union: plan and terror =======================
const PLAN_B = ['steel', 'tools', 'arms', 'coalm', 'power'];
SPIRITS.plan_fulfilled = ['The Plan Fulfilled Ahead of Time', 'Medals for the shock workers.', { output: 0.05, stab: 3 }];
SPIRITS.plan_failed = ['The Plan Is Not Met', 'Someone must have sabotaged it.', { stab: -4 }];
SPIRITS.great_terror = ['The Great Terror', 'Night arrests; generals, engineers and old Bolsheviks shot.', { stab: 6, pp: 0.1, org: -0.08, atk: -0.05, research: -0.05 }];
SPIRITS.vigilance = ['Revolutionary Vigilance', 'The NKVD watches everyone.', { stab: 3, org: -0.03 }];
const lvOf = (c, t) => (c.bt && c.bt[t] ? c.bt[t].lv : 0);
const planOf = c => c.plan || (c.plan = { n: 2, end: mjDay(1938, 1), target: Object.fromEntries(PLAN_B.map(t => [t, Math.max(1, Math.ceil(lvOf(c, t) * 1.1))])), terror: 15 });
const planProg = c => { const P0 = planOf(c); return sum(PLAN_B, t => Math.min(1, lvOf(c, t) / P0.target[t])) / PLAN_B.length; };
function planMonthly(c) { const P0 = planOf(c);
  if (G.day >= P0.end) { const met = planProg(c) >= 0.9; removeSpirit(c, 'plan_fulfilled'); removeSpirit(c, 'plan_failed'); addSpirit(c, met ? 'plan_fulfilled' : 'plan_failed', 730); if (!met) P0.terror = Math.min(100, P0.terror + 15);
    logMsg(`The ${['', 'First', 'Second', 'Third', 'Fourth', 'Fifth'][P0.n] || P0.n + 'th'} Five-Year Plan ends: ${met ? 'fulfilled' : 'not fulfilled'}.`, 'world', [c.tag]);
    P0.n++; P0.end = G.day + (isAtWar(c.tag) ? 365 * 3 : 365 * 5); for (const t of PLAN_B) P0.target[t] = Math.max(1, Math.ceil(lvOf(c, t) * (isAtWar(c.tag) ? 1.1 : 1.25))); }
  if (G.historical && c.ai && G.day >= mjDay(1937, 6) && G.day < mjDay(1938, 11) && P0.terror < 70) P0.terror += 10; // the Yezhovshchina
  P0.terror = Math.max(0, P0.terror - 2); removeSpirit(c, 'great_terror'); removeSpirit(c, 'vigilance'); if (P0.terror > 50) addSpirit(c, 'great_terror'); else if (P0.terror > 20) addSpirit(c, 'vigilance');
  if (P0.terror > 60 && c.gens.length > 4 && Math.random() < 0.15) { const g = c.gens.splice(Math.floor(Math.random() * c.gens.length), 1)[0]; if (g) logMsg(`${g.name} is arrested and shot as an enemy of the people.`, c.tag === G.player ? 'world' : 'info', [c.tag]); }
  if (c.ai && P0.terror > 50 && isAtWar(c.tag) && c.pp > 60) planAct(c, 'rehab'); }
const PLAN_ACT = { purge: ['Purge the Enemies of the People', 30, 'Terror +20: stability and political power now; the army and the laboratories pay.'], rehab: ['Rehabilitate the Officers', 40, 'Terror -25; officers return from the camps to command.'], storm: ['Stakhanovite Storming', 30, 'Shock work for the plan: output +3% for six months, stability -2.'] };
SPIRITS.storming = ['Shock Work', 'Records broken every week.', { output: 0.03 }];
function planAct(c, a) { const P0 = planOf(c), d = PLAN_ACT[a]; if (c.pp < d[1]) return 'Not enough political power'; c.pp -= d[1];
  if (a === 'purge') { P0.terror = Math.min(100, P0.terror + 20); c.pp += 40; c.stab = Math.min(100, c.stab + 3); }
  else if (a === 'rehab') { P0.terror = Math.max(0, P0.terror - 25); const back = [['Konstantin Rokossovsky', 4, 'off'], ['Kirill Meretskov', 3, 'def'], ['Alexander Gorbatov', 3, 'inf']].find(g => !c.gens.some(x => x.name === g[0])); if (back) c.gens.push({ id: G.nid++, name: back[0], skill: back[1], trait: back[2], xp: 0 }); }
  else { addSpirit(c, 'storming', 180); c.stab = Math.max(0, c.stab - 2); } return ''; }
// ======================= United States: Congress and the public =======================
const US_ACTS = { cashcarry: ['Cash and Carry', 30, 'The belligerents may buy arms if they pay cash and carry them away: relations with Britain and France +15; isolationism softens.'], draft: ['Selective Service', 40, 'The first peacetime draft: six divisions and a larger army.'],
  twoocean: ['The Two-Ocean Navy Act', 40, 'Seventy per cent more warships: a naval building programme.'], lendlease: ['Lend-Lease', 62, 'The arsenal of democracy: arms for every nation fighting our enemies, every month.'], war: ['A Declaration of War', 85, 'Congress declares war on the enemies of our friends.'] };
SPIRITS.neutrality_acts = ['The Neutrality Acts', 'Cash and carry: we sell, but we do not fight.', { ws: -10, mil_out: -0.1 }];
const usOf = c => c.us || (c.us = { inter: 18, d: 333, r: 89, acts: {}, tried: {} });
function usMonthly(c) { const U = usOf(c); let d = -0.1;
  if (ok('ENG') && ok('GER') && atWar('ENG', 'GER')) d += 0.5 + capInfo('ENG').prog * 3 + (ok('FRA') && C('FRA').capitulated ? 0.5 : 0); if (ok('JAP') && ok('CHI') && atWar('JAP', 'CHI')) d += 0.2;
  if (alive().some(k => k.sea && k.sea.unres && enemiesOf(k.tag).includes('ENG'))) d += 0.5; if (isAtWar(c.tag)) d += 5;
  if (!U.s39 && ok('ENG') && ok('GER') && atWar('ENG', 'GER')) { U.s39 = 1; d += 14; } if (!U.s40 && ok('FRA') && C('FRA').capitulated) { U.s40 = 1; d += 15; } if (!U.s41 && ok('SOV') && ok('GER') && atWar('SOV', 'GER')) { U.s41 = 1; d += 4; }
  U.inter = clamp(U.inter + d, 0, 100);
  if (G.day === mjDay(1938, 11) || (G.day > mjDay(1938, 11) && !U.e38)) { U.e38 = 1; U.d -= 72; U.r += 72; } if (G.day > mjDay(1942, 11) && !U.e42) { U.e42 = 1; U.d -= 45; U.r += 45; }
  if (U.inter >= 50 && hasSpirit(c, 'isolationism')) { removeSpirit(c, 'isolationism'); if (!U.acts.lendlease) addSpirit(c, 'neutrality_acts'); logMsg('American opinion turns: isolation is over.', 'world', [c.tag]); }
  // Lend-Lease: two per cent of America's arms, aircraft and tanks a month, shared among the nations fighting its enemies
  if (U.acts.lendlease) { const R = alive().filter(k => k.tag !== c.tag && !k.capitulated && isAtWar(k.tag) && !atWar(k.tag, c.tag) && (friendly(k.tag, 'ENG') || ['ENG', 'SOV', 'CHI'].includes(k.tag)) && enemiesOf(k.tag).some(e => ['GER', 'JAP', 'ITA'].includes(e)));
    if (R.length) { for (const g of ['arms', 'aircraft', 'tanks']) { const x = (c.stock[g] || 0) * 0.02; c.stock[g] -= x; for (const k of R) k.stock[g] = (k.stock[g] || 0) + x / R.length; } for (const k of R) addRel(k.tag, c.tag, 1); } }
  if (c.ai) for (const a of Object.keys(US_ACTS)) if (!U.acts[a] && U.inter >= US_ACTS[a][1] && (!U.tried[a] || G.day - U.tried[a] > 120) && (a !== 'war' || (!isAtWar(c.tag) && (!G.historical || year() >= 1942)))) usAct(c, a);
  if (G.historical && c.ai && G.day >= mjDay(1941, 8) && ok('JAP') && C('JAP').ideology !== 'dem' && !atWar('JAP', c.tag) && !c.flags.oilFreeze) { c.flags.oilFreeze = G.day; if (!embargoing(c, 'JAP')) setEmbargo(c, 'JAP', true, true); if (ok('HOL') && !C('HOL').capitulated && !embargoing(C('HOL'), 'JAP')) setEmbargo(C('HOL'), 'JAP', true, true); addSpirit(C('JAP'), 'oil_embargo');
    logMsg('Washington freezes Japanese assets and embargoes oil; the Dutch East Indies follow. Japan has two years of fuel.', 'world', [c.tag, 'JAP']); } }
function usVoteChance(c, a) { const U = usOf(c); return clamp(0.35 + (U.d / (U.d + U.r) - 0.5) + (U.inter - US_ACTS[a][1]) / 50, 0.05, 0.97); }
function usAct(c, a) { const U = usOf(c), d = US_ACTS[a]; if (U.acts[a]) return 'Already law'; if (U.inter < d[1]) return `Public opinion is not ready (interventionism ${d[1]} needed)`; if (U.tried[a] && G.day - U.tried[a] < 120) return 'Congress will not vote on it again so soon'; if (c.pp < 30) return 'Needs 30 political power'; c.pp -= 30; U.tried[a] = G.day;
  if (Math.random() > usVoteChance(c, a)) { logMsg(`Congress votes down ${d[0]}.`, 'world', [c.tag]); return `Congress votes it down.`; } U.acts[a] = G.day; logMsg(`Congress passes ${d[0]}.`, 'world', [c.tag]);
  if (a === 'cashcarry') { addRel('ENG', c.tag, 15); addRel('FRA', c.tag, 15); if (hasSpirit(c, 'isolationism')) { removeSpirit(c, 'isolationism'); addSpirit(c, 'neutrality_acts'); } }
  if (a === 'draft') { spawnDivisions(c, 'inf', 6, c.capital); c.manpower += 200; } if (a === 'twoocean') { c.stock.ships += 60; freeBuild(c, 'shipyard', 2); }
  if (a === 'lendlease') removeSpirit(c, 'neutrality_acts'); if (a === 'war') { removeSpirit(c, 'isolationism'); removeSpirit(c, 'neutrality_acts'); if (ok('ENG')) sideWith(c, 'ENG'); } return ''; }
SPIRITS.fireside = ['A Fireside Chat', 'The President speaks to the nation from the White House.', { stab: 1 }];
function usChat(c) { if (c.pp < 20) return 'Needs 20 political power'; c.pp -= 20; usOf(c).inter = Math.min(100, usOf(c).inter + 5); addSpirit(c, 'fireside', 30); return ''; }
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { const w = _dw(a, b, ...r); if (w && b === 'USA' && C('USA')) usOf(C('USA')).inter = 100; return w; }; }
// ======================= Britain: the Commonwealth =======================
SPIRITS.commonwealth = ['A United Commonwealth', 'The Dominions and India stand with the mother country.', { manpower: 0.05, tradecap: 0.03 }];
SPIRITS.empire_strain = ['An Empire Under Strain', 'The Dominions ask why they should fight Britain\'s wars.', { stab: -3, manpower: -0.03 }];
const CW_MEM = ['CAN', 'AST', 'NZL', 'SAF', 'RAJ', 'IRE', 'EGY', 'IRQ'];
const cwOf = c => c.cw || (c.cw = { unity: 60, conf: 0, asked: 0 });
function cwMonthly(c) { const W = cwOf(c); W.unity = clamp(W.unity + (isAtWar(c.tag) && capInfo(c.tag).prog > 0.2 ? -1 : 0.2) - (hasSpirit(c, 'shipping_losses') ? 0.3 : 0), 0, 100);
  removeSpirit(c, 'commonwealth'); removeSpirit(c, 'empire_strain'); if (W.unity >= 60) addSpirit(c, 'commonwealth'); else if (W.unity < 30) addSpirit(c, 'empire_strain');
  if (ok('RAJ') && year() >= 1942 && W.unity < 50 && !c.flags.quitIndia && Math.random() < 0.1) { c.flags.quitIndia = G.day; for (const p of provsOf('RAJ')) p.unrest = Math.min(100, (p.unrest || 0) + 25); logMsg('Congress launches the Quit India movement: strikes and riots across India.', 'world', ['RAJ', c.tag]); }
  if (c.ai) { if (G.day - W.conf > 700 && c.pp > 80) cwAct(c, 'conference'); if (isAtWar(c.tag) && W.unity > 45 && G.day - W.asked > 365) cwAct(c, 'troops'); } }
const CW_ACT = { conference: ['Imperial Conference', 40, 'Prime ministers of the Dominions in London: unity +10. Once every two years.'], troops: ['Ask the Dominions for Troops', 20, 'Every Dominion at war sends a corps to Britain: unity -8. Once a year.'], preference: ['Imperial Preference', 30, 'Tariffs favour Empire goods: unity +4, trade with the Dominions.'] };
function cwAct(c, a) { const W = cwOf(c), d = CW_ACT[a]; if (c.pp < d[1]) return 'Not enough political power';
  if (a === 'conference' && G.day - W.conf < 700) return 'The last conference was too recent'; if (a === 'troops') { if (!isAtWar(c.tag)) return 'Only in wartime'; if (G.day - W.asked < 365) return 'Asked too recently'; }
  c.pp -= d[1]; if (a === 'conference') { W.conf = G.day; W.unity = Math.min(100, W.unity + 10); for (const t of CW_MEM) if (ok(t)) addRel(t, c.tag, 10); }
  else if (a === 'troops') { W.asked = G.day; W.unity = Math.max(0, W.unity - 8); for (const t of CW_MEM) { const k = C(t); if (!ok(t) || k.capitulated || !isAtWar(t) || atWar(t, c.tag)) continue; const n = Math.max(1, Math.min(4, Math.round(sum(armiesOf(t), x => x.divs.length) * 0.3))); const a2 = newArmy(c, c.capital); a2.name = `${k.adj} Corps`; a2.expFrom = t; a2.expKind = 'exp'; a2.auto = true; for (let i = 0; i < n; i++) a2.divs.push({ t: 'inf', str: 0.9, org: 0.8, xp: 0.1 }); } }
  else { W.unity = Math.min(100, W.unity + 4); for (const t of CW_MEM) if (ok(t) && !G.pacts.some(p => p.t === 'trade' && ((p.a === t && p.b === c.tag) || (p.b === t && p.a === c.tag)))) addPact('trade', c.tag, t); } return ''; }
// ======================= France: the unstable Republic =======================
const FR_PM = ['Léon Blum', 'Camille Chautemps', 'Édouard Daladier', 'Paul Reynaud', 'Albert Sarraut', 'Pierre-Étienne Flandin', 'Yvon Delbos', 'Georges Bonnet', 'Albert Lebrun'];
SPIRITS.decree_laws = ['Rule by Decree-Laws', 'The Chamber has given the government full powers for six months.', { pp: 0.1 }];
SPIRITS.cabinet_crisis = ['A Cabinet Crisis', 'The government hangs by a thread in the Chamber; nothing can be decided.', { pp: -0.15, stab: -3 }];
const frOf = c => c.fr || (c.fr = { conf: 45, falls: 0, pm: 'Albert Sarraut' });
function frMonthly(c) { if (c.ideology !== 'dem') return; const F = frOf(c), u = c.ec ? c.ec.unemp : 0.07;
  F.conf = clamp(F.conf - 2.2 - u * 20 + (c.stab - 50) / 25 + (hasSpirit(c, 'decree_laws') ? 2 : 0) + (isAtWar(c.tag) && !capInfo(c.tag).prog ? 1 : 0), -5, 100);
  if (F.conf <= 0) { F.falls++; c.pp = Math.round(c.pp * 0.5); c.stab = Math.max(0, c.stab - 3); F.pm = pick(FR_PM.filter(n => n !== F.pm)); F.conf = 50; logMsg(`The French government falls. ${F.pm} forms the ${F.falls}${F.falls === 1 ? 'st' : F.falls === 2 ? 'nd' : F.falls === 3 ? 'rd' : 'th'} cabinet since 1936.`, 'world', [c.tag]); }
  removeSpirit(c, 'cabinet_crisis'); if (F.conf < 25) addSpirit(c, 'cabinet_crisis');
  if (c.ai && G.historical) { const h = FR_HIST.filter(x => G.day >= x[0]).pop(); if (h && F.hist !== h[0]) { F.hist = h[0]; if (h[1] !== F.pm) { F.falls++; F.pm = h[1]; F.conf = 55; logMsg(`${h[1]} becomes Président du Conseil. ${h[2]}`, 'world', [c.tag]); } } else if (F.conf < 30) F.conf = 30; }
  else if (c.ai && F.conf < 12 && c.pp > 60 && Math.random() < 0.5) frAct(c, isAtWar(c.tag) || G.tension > 60 ? 'union' : 'decree'); }
const FR_HIST = [[mjDay(1936, 6), 'Léon Blum', 'The Popular Front governs: the forty-hour week and paid holidays.'], [mjDay(1937, 6), 'Camille Chautemps', 'Blum resigns when the Senate refuses him full powers.'], [mjDay(1938, 3), 'Léon Blum', 'A second Blum government, for a month.'], [mjDay(1938, 4), 'Édouard Daladier', 'The Bull of the Vaucluse promises order and rearmament.'], [mjDay(1940, 3), 'Paul Reynaud', 'Daladier falls over Finland; Reynaud promises to fight harder.']];
const FR_ACT = { decree: ['Ask for Decree Powers', 40, 'Six months of rule by decree-laws: confidence +25, legitimacy -3.'], union: ['Union Nationale', 40, 'A government of every party: confidence +15, stability +3. Only in a crisis.'], vote: ['Pose the Question of Confidence', 15, 'A gamble: confidence +20, or the government falls.'] };
function frAct(c, a) { const F = frOf(c), d = FR_ACT[a]; if (c.pp < d[1]) return 'Not enough political power'; if (a === 'union' && !isAtWar(c.tag) && G.tension < 60) return 'Only in war or a grave crisis'; c.pp -= d[1];
  if (a === 'decree') { F.conf += 25; c.legitBonus = (c.legitBonus || 0) - 3; addSpirit(c, 'decree_laws', 180); } else if (a === 'union') { F.conf += 15; c.stab = Math.min(100, c.stab + 3); } else { if (Math.random() < 0.6) F.conf += 20; else F.conf = 0; } return ''; }
// ======================= Italy: the Duce's prestige =======================
SPIRITS.imperial_prestige = ['Imperial Prestige', 'The Duce is always right.', { pp: 0.1, ws: 5 }]; SPIRITS.fading_prestige = ['Fading Prestige', 'People joke about the Duce in the cafés.', { stab: -5, legit: -5 }];
const itOf = c => c.it || (c.it = { prestige: 60, held: 0 });
function itMonthly(c) { if (c.ideology !== 'fas') return; const I = itOf(c), held = G.P.filter(p => p.ctrl === c.tag).length, ch = held - (I.held || held); I.held = held;
  I.prestige = clamp(I.prestige + ch * 1.5 + (isAtWar(c.tag) ? (G.wars.some(w => (w.att.includes(c.tag) || w.def.includes(c.tag)) && G.day - w.start > 730) ? -1 : 0) : 0.4), 0, 100);
  removeSpirit(c, 'imperial_prestige'); removeSpirit(c, 'fading_prestige'); if (I.prestige > 70) addSpirit(c, 'imperial_prestige'); else if (I.prestige < 30) addSpirit(c, 'fading_prestige');
  if (I.prestige < 15 && isAtWar(c.tag) && capInfo(c.tag).prog > 0.15 && !c.flags.grandCouncil) { c.flags.grandCouncil = G.day;
    if (c.tag === G.player && !c.ai) UIH.popup({ title: 'The Grand Council Votes', icon: '🏛', desc: 'The Fascist Grand Council has voted nineteen to seven to return command of the armed forces to the King. Tomorrow the King will receive the Duce at the Villa Savoia.', options: [{ name: 'Go to the King.', tip: 'Mussolini is arrested; Marshal Badoglio governs.', fn: () => grandCouncil(c, true) }, { name: 'Arrest the conspirators.', tip: 'Prestige +10, stability -10; the Fascists may tear the country apart.', fn: () => grandCouncil(c, false) }] });
    else grandCouncil(c, Math.random() < 0.7); } }
function grandCouncil(c, king) { if (king) { setIdeology(c, 'aut', true); c.ws = Math.max(0, c.ws - 20); logMsg('Mussolini is arrested at the Villa Savoia. Marshal Badoglio heads the government.', 'world', [c.tag]); }
  else { itOf(c).prestige += 10; c.stab = Math.max(0, c.stab - 10); if (Math.random() < 0.4) startCivilWar(c.tag, 'aut', 0.35, 'Kingdom of the South'); logMsg('The Duce arrests the Grand Council conspirators.', 'world', [c.tag]); } }
function itAct(c) { if (c.pp < 30) return 'Needs 30 political power'; c.pp -= 30; itOf(c).prestige = Math.min(100, itOf(c).prestige + 8); return ''; }
// ======================= Japan: the oil clock =======================
SPIRITS.oil_rationing = ['Oil Rationing', 'The fleet stays in harbour to save fuel.', { navy: -0.1, air: -0.05 }]; SPIRITS.oil_crisis = ['The Oil Is Running Out', 'Months, not years, of fuel remain.', { navy: -0.3, air: -0.2, atk: -0.05 }];
const jpOf = c => c.jp || (c.jp = { oil: 24, bal: 0 });
const JP_OIL = { USA: 1.05, HOL: 0.25, ENG: 0.1 }; // where Japan's oil came from in 1936: four-fifths American
function jpCut(c) { let s = 0; for (const t in JP_OIL) { if (t === 'HOL' && typeof hlOilToJapan === 'function') { s += JP_OIL.HOL * (1 - hlOilToJapan()); continue; }
    if (!ok(t) || C(t).capitulated || embargoing(C(t), c.tag) || atWar(t, c.tag) || (t === 'USA' && hasSpirit(c, 'oil_embargo'))) s += JP_OIL[t]; } return s; }
function jpMonthly(c) { const J = jpOf(c), war = isAtWar(c.tag), cut = jpCut(c);
  const own = sum(G.P.filter(p => p.ctrl === c.tag), p => (p.res.oil || 0) * (1 + (p.b.oilr || 0) * 0.3)) * 0.15 + sum(provsOf(c.tag), p => p.b.synth || 0) * 0.1;
  const imp = 1.4 - cut, use = 0.75 + (war ? 0.55 : 0) + navalPower(c) / 5000; J.bal = own + imp - use; J.oil = clamp(J.oil + J.bal, 0, 36);
  removeSpirit(c, 'oil_rationing'); removeSpirit(c, 'oil_crisis'); if (J.oil < 6) addSpirit(c, 'oil_crisis'); else if (J.oil < 12) addSpirit(c, 'oil_rationing');
  if (J.oil < 10 && J.bal < 0 && !c.flags.oilWarn) { c.flags.oilWarn = G.day; logMsg('The Japanese navy warns that its oil will run out within the year. The oilfields of the Indies beckon.', 'world', [c.tag]); G.tension = Math.min(100, G.tension + 3); } }
// ======================= China: the War of Resistance =======================
// Foreign arms reach Free China by four routes, each closed in turn as the war spreads; the interior is trading space for time;
// the Nationalists and the Communists keep an uneasy front against Japan.
const CN_ROUTES = { hanoi: ['The Haiphong Railway', 'From the port of Haiphong by the French railway to Kunming: the cheapest way in.', ['Haiphong', 'Hanoi', 'Kunming'], 150],
  burma: ['The Burma Road', 'Rangoon by rail to Lashio, then seven hundred miles of mountain road to Kunming.', ['Rangoon', 'Mandalay', 'Kunming'], 120],
  nw: ['The Northwest Highway', 'Soviet trucks and aircraft across Xinjiang to Lanzhou.', ['Urumqi', 'Lanzhou'], 100],
  hump: ['The Hump', 'Transport aircraft over the Himalaya from Assam to Kunming.', ['Calcutta', 'Kunming'], 0] };
const CN_DEEP = { Chongqing: 0.35, Chengdu: 0.3, Kunming: 0.3, Lanzhou: 0.3, Guiyang: 0.25, "Xi'an": 0.25, "Yan'an": 0.25, Changsha: 0.15, Guilin: 0.15, Hengyang: 0.1, Nanning: 0.1 };
SPIRITS.space_for_time = ['Trading Space for Time', 'Every mile the invader advances, his line of supply grows longer and his garrisons thinner.', { def: 0.05 }];
SPIRITS.uf_friction = ['Friction in the United Front', 'Nationalist and Communist troops fight each other behind the lines.', { stab: -3, atk: -0.03 }];
const cnOf = () => G.cn || (G.cn = { open: {}, aid: 0, total: 0, coh: 70, hump: 0, joint: 0 });
const cnClear = n => { const p = PN(n); if (!p || !p.ctrl) return false; const t = p.ctrl, k = C(t); return t !== 'JAP' && !!k && k.overlord !== 'JAP' && !k.capitulated && (!ok('CHI') || !atWar(t, 'CHI')) && !(ok('JAP') && factionOf(t) && factionOf(t) === factionOf('JAP')); };
function cnRouteOpen(r) { const R = CN_ROUTES[r]; if (!R[2].every(cnClear)) return false;
  if (r === 'hanoi') return !(ok('FRA') && C('FRA').capitulated);
  if (r === 'burma') return !(G.historical && G.day >= mjDay(1940, 7) && G.day < mjDay(1940, 10)) && !(ok('ENG') && atWar('ENG', 'CHI'));
  if (r === 'nw') return ok('SOV') && !atWar('SOV', 'CHI') && !(ok('GER') && atWar('SOV', 'GER')) && !G.pacts.some(p => p.t === 'nap' && ((p.a === 'SOV' && p.b === 'JAP') || (p.a === 'JAP' && p.b === 'SOV')));
  return ok('USA') && ok('JAP') && atWar('USA', 'JAP'); }
function cnMonthly(c) { const N = cnOf(); let aid = 0; const usa = ok('USA') ? usOf(C('USA')) : null, sponsor = 0.5 + (usa && usa.acts.cashcarry ? 0.25 : 0) + (usa && usa.acts.lendlease ? 0.5 : 0);
  for (const r in CN_ROUTES) { const was = N.open[r], now = cnRouteOpen(r); N.open[r] = now;
    if (was !== undefined && was !== now && r !== 'hump') logMsg(`${CN_ROUTES[r][0]} is ${now ? 'open again' : 'closed'}${now ? '.' : ': one less road for the arms of Free China.'}`, 'world', [c.tag]);
    if (!now) continue; if (r === 'hump') { N.hump = Math.min(260, (N.hump || 20) + 8); aid += N.hump * (usa && usa.acts.lendlease ? 1 : 0.4); }
    else aid += CN_ROUTES[r][3] * (r === 'nw' ? 1 : sponsor); }
  if (!(ok('JAP') && atWar(c.tag, 'JAP'))) aid = 0; // the roads carry war aid, and the war has not begun
  if (aid > 0) { c.stock.arms += aid; c.stock.artillery += aid * 0.12; c.stock.aircraft += aid * (N.open.nw ? 0.08 : 0.04); N.total += aid; } N.aid = Math.round(aid);
  removeSpirit(c, 'space_for_time'); if (isAtWar(c.tag) && ok('JAP') && atWar(c.tag, 'JAP')) addSpirit(c, 'space_for_time');
  // the United Front
  if (G.flags.unitedFront && ok('PRC') && !C('PRC').capitulated && factionOf('PRC') && factionOf('PRC') === factionOf('CHI')) {
    N.coh = clamp(N.coh - 0.6 + (capInfo('CHI').prog > 0.4 ? 0.5 : 0) + (G.day - N.joint < 365 ? 0.6 : 0), 0, 100);
    if (G.historical && c.ai && G.day >= mjDay(1941, 1) && !N.anhui) { N.anhui = 1; N.coh = Math.max(5, N.coh - 25); logMsg('The New Fourth Army Incident: Nationalist troops ambush the Communist headquarters column in southern Anhui. The United Front survives in name.', 'world', ['CHI', 'PRC']); }
    for (const t of ['CHI', 'PRC']) { removeSpirit(C(t), 'uf_friction'); if (N.coh < 25) addSpirit(C(t), 'uf_friction'); }
    if (N.coh <= 0) { N.coh = 0; const f = factionOf('CHI'); if (f && f.members.includes('PRC') && typeof leaveFaction === 'function') leaveFaction('PRC'); logMsg('The United Front breaks apart: Nationalists and Communists fight each other again.', 'world', ['CHI', 'PRC']); }
    if (c.ai && N.coh < 30 && c.pp > 60) cnAct(c, 'joint'); } }
const CN_ACT = { joint: ['A Joint Command', 35, 'Communist and Nationalist officers plan together: United Front cohesion +15 for a year.', 'CHI'], blockade: ['Blockade the Border Region', 25, 'Seal off the Communist base areas: their manpower -40, our stability +2, cohesion -15.', 'CHI'],
  guerrilla: ['Guerrilla Behind the Lines', 30, 'Raise the villages behind the Japanese lines: unrest +12 in every Chinese province the Japanese hold.', 'PRC'], regiments: ['The Hundred Regiments Offensive', 50, 'Every Communist regiment strikes the railways at once: Japanese stability -4, Japanese-held Chinese provinces unrest +20, cohesion +10. Once.', 'PRC'] };
function cnAct(c, a) { const N = cnOf(), d = CN_ACT[a]; if (!d || c.tag !== d[3]) return 'Not ours to order'; if (c.pp < d[1]) return 'Not enough political power'; if (a === 'regiments' && N.hundred) return 'Done once'; c.pp -= d[1];
  const japHeld = () => G.P.filter(p => p.cores.includes('CHI') && p.ctrl && (p.ctrl === 'JAP' || (C(p.ctrl) && C(p.ctrl).overlord === 'JAP')));
  if (a === 'joint') { N.joint = G.day; N.coh = Math.min(100, N.coh + 15); }
  else if (a === 'blockade') { if (ok('PRC')) C('PRC').manpower = Math.max(0, C('PRC').manpower - 40); c.stab = Math.min(100, c.stab + 2); N.coh = Math.max(0, N.coh - 15); }
  else if (a === 'guerrilla') for (const p of japHeld()) p.unrest = Math.min(100, (p.unrest || 0) + 12);
  else { N.hundred = G.day; for (const p of japHeld()) p.unrest = Math.min(100, (p.unrest || 0) + 20); if (ok('JAP')) C('JAP').stab = Math.max(0, C('JAP').stab - 4); N.coh = Math.min(100, N.coh + 10); logMsg('The Hundred Regiments Offensive: Communist forces blow up railways and blockhouses across North China.', 'world', ['PRC', 'JAP']); }
  return ''; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo0) { const r = _sp(armies, attacking, p, eo0); if (attacking || !armies.length || !eo0 || !p) return r;
  const t = armies[0].owner; if (t !== 'CHI' && !UF_MEMBERS.includes(t)) return r; if (!Array.from(eo0).some(k => k === 'JAP' || (C(k) && C(k).overlord === 'JAP'))) return r;
  r.tough *= 1 + 0.06 + (CN_DEEP[p.name] || 0) + (p.ter === 'm' ? 0.08 : p.ter === 'h' ? 0.04 : 0); return r; }; }
// in the historical course the Japanese never reached Chongqing, Chengdu, Kunming, Xi'an, Lanzhou or Yan'an, and took
// Changsha, Guilin and Hengyang only in the great offensive of 1944: the AI armies of Japan and its regimes stop there
const CN_HALT = ['Chongqing', 'Chengdu', 'Kunming', "Xi'an", 'Lanzhou', "Yan'an", 'Guiyang', 'Urumqi'], CN_HALT44 = ['Changsha', 'Guilin', 'Hengyang'];
{ const _aa = aiArmies; aiArmies = function (tag) { _aa(tag); const k = C(tag); if (!G.historical || year() >= 1946 || !k || !k.ai || (tag !== 'JAP' && k.overlord !== 'JAP')) return;
  const halt = new Set(CN_HALT.concat(year() < 1944 ? CN_HALT44 : []).map(n => PNAME[n]).filter(x => x !== undefined));
  for (const a of armiesOf(tag)) if (a.auto && a.path.length && halt.has(a.path[0]) && atWar(tag, P(a.path[0]).ctrl)) a.path = []; }; }
// Dunkirk: when a nation falls, the armies of its allies that came from overseas and are now cut off from any friendly
// land are taken off by sea, as the British were from Dunkirk, Norway and Greece. Their heavy equipment stays behind.
function mjLandPath(from, ok2, goal) { const seen = new Set([from]), q = [from]; let n = 0;
  while (q.length && n++ < 900) { const id = q.shift(); if (goal(P(id))) return true; for (const e of NB[id]) { if (e.sea || seen.has(e.to)) continue; const p = P(e.to); if (!ok2(p)) continue; seen.add(e.to); q.push(e.to); } } return false; }
function evacuateStranded(fallen, allies) { const out = {};
  for (const a of Object.values(G.armies)) { const o = a.owner, k = C(o); if (!allies.includes(o) || !k || !k.exists || k.capitulated || o === fallen || !a.divs.length || a.inv) continue; const here = P(a.loc); if (!here || here.owner === o) continue;
    const home = P(k.capital); if (!home || home.ctrl !== o) continue;
    if (mjLandPath(a.loc, () => true, p => p.id === home.id)) continue; // the homeland can be reached overland: not an overseas army
    const held = p => p.ctrl === o || (friendly(o, p.ctrl) && !atWar(o, p.ctrl) && !C(p.ctrl).capitulated);
    const friendlySoil = p => p.ctrl === p.owner && p.owner !== fallen && (p.owner === o || (friendly(o, p.owner) && !atWar(o, p.owner) && !C(p.owner).capitulated));
    if (mjLandPath(a.loc, held, friendlySoil)) continue; // still joined to an ally's front
    if (a.battle && typeof leaveBattle === 'function') leaveBattle(a); a.path = []; a.loc = home.id; a.order = null;
    for (const d of a.divs) { d.str = Math.max(0.3, d.str * 0.7); d.org = Math.min(d.org, 0.2); }
    k.stock.arms = Math.max(0, (k.stock.arms || 0) - a.divs.length * 30); k.stock.artillery = Math.max(0, (k.stock.artillery || 0) - a.divs.length * 5); k.stock.autos = Math.max(0, (k.stock.autos || 0) - a.divs.length * 10);
    out[o] = (out[o] || 0) + a.divs.length; }
  for (const o in out) logMsg(o === 'ENG' && fallen === 'FRA' ? `Dunkirk: ${out[o]} divisions of the British Expeditionary Force are taken off the beaches by every ship in England. Their guns and lorries stay behind.` : `${out[o]} ${C(o).adj} divisions are evacuated by sea from ${cname(fallen)}, leaving their heavy equipment.`, 'world', [o, fallen]); }
{ const _cap = capitulate; capitulate = function (tag) { // only the fallen nation's own comrades in arms are taken off
  const allies = G.wars.filter(w => w.att.includes(tag) || w.def.includes(tag)).flatMap(w => w.att.includes(tag) ? w.att : w.def).filter(t => t !== tag);
  _cap(tag); try { evacuateStranded(tag, [...new Set(allies)]); } catch (e) { /* never block a capitulation */ } }; }
// Fortress Europe: in the historical course the AI makes no landings on Axis-held Europe before the real ones
// (Sicily in July 1943, Normandy in June 1944, Greece in October 1944)
const FORTRESS = { ITA: [1943, 7], FRA: [1944, 6], BEL: [1944, 6], HOL: [1944, 6], LUX: [1944, 6], DEN: [1944, 6], NOR: [1944, 6], GER: [1944, 6], GRE: [1944, 10], YUG: [1944, 10], ALB: [1944, 10] };
const axisHeld = t => !!t && ok(t) && (t === 'GER' || t === 'ITA' || (ok('GER') && friendly('GER', t)) || (ok('ITA') && friendly('ITA', t)));
{ const _ml = aiMayLand; aiMayLand = function (tag, q) { if (G.historical && atWar(tag, q.ctrl) && axisHeld(q.ctrl) && !axisHeld(tag)) { const k = [q.owner].concat(q.cores).find(x => FORTRESS[x]); if (k && G.day < mjDay(FORTRESS[k][0], FORTRESS[k][1])) return false; } return _ml(tag, q); }; }
// ---------- hooks ----------
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (!c.exists || c.capitulated) return; const t = c.tag;
  if (t === 'GER' && c.ideology === 'fas') polyMonthly(c); else if (t === 'SOV' && c.ideology === 'com') planMonthly(c); else if (t === 'USA') usMonthly(c); else if (t === 'ENG') cwMonthly(c); else if (t === 'FRA') frMonthly(c); else if (t === 'ITA') itMonthly(c); else if (t === 'JAP') jpMonthly(c); else if (t === 'CHI') cnMonthly(c); }; }
// the decisive strike waits for the oil to run short (in the historical course, for the autumn of 1941)
REQF.pearlTime[0] = c => year() >= 1942 || (year() >= 1941 && (!c.ai || !G.historical || G.day >= mjDay(1941, 9))) || (!c.ai && year() >= 1940 && hasSpirit(c, 'oil_embargo')) || (year() >= 1940 && jpOf(c).oil < 6 && (!c.ai || !G.historical));
REQF.pearlTime[1] = 'Year 1941 (1940 under the Oil Embargo), or the oil almost gone';
// in the historical course Japan's AI does not turn on the Western powers before the autumn of 1941, nor America embargo it before July 1941
const JP_LATE = ['USA', 'PHI', 'ENG', 'HOL', 'AST', 'NZL', 'RAJ', 'CAN', 'SAF'], jpWaits = (a, b) => G.historical && a === 'JAP' && C('JAP') && C('JAP').ai && G.day < mjDay(1941, 9) && JP_LATE.includes(b) && !atWar(a, b);
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { if (jpWaits(a, b)) return null; return _dw(a, b, ...r); }; }
{ const _sp = startPlay; startPlay = function (a, b, ...r) { if (jpWaits(a, b)) return null; return _sp(a, b, ...r); }; }
{ const _jw = joinWar; joinWar = function (w, t, side) { if (t === 'JAP') { const opp = side === 'att' ? w.def : w.att; if (opp.some(x => jpWaits('JAP', x))) return; } return _jw(w, t, side); }; }
{ const f = (TREES.USA || []).find(x => x.name === 'Embargo Japan'); if (f) { const q = [c => !c.ai || !G.historical || G.day >= mjDay(1941, 7), 'Not before July 1941 (historical course)']; f.req = f.req ? both(f.req, q) : q; } }

// 2.2 Scandinavia: Sweden's balance between the belligerents and its iron ore; Norway's neutral waters, its heavy water and
// its merchant fleet; Denmark's farm exports, its policy of cooperation under occupation, and Iceland and Greenland.
'use strict';
const ndDay = (y, m) => Math.round((Date.UTC(y, m - 1, 1) - Date.UTC(1936, 0, 1)) / 864e5);
const ndCtrl = n => { const p = PN(n); return p ? p.ctrl : null; };
const ndMonth = () => new Date(Date.UTC(1936, 0, 1) + G.day * 864e5).getUTCMonth();
const ndAxis = t => !!t && ok(t) && (t === 'GER' || C(t).overlord === 'GER' || (ok('GER') && !!factionOf(t) && factionOf(t) === factionOf('GER')));

// ======================= Sweden: the balance between the belligerents =======================
// Berlin and the Allies each press Stockholm. Every concession to one side relieves its pressure and raises the other's;
// each concession also spends the credibility of Swedish neutrality. Kiruna's ore goes out through Luleå (frozen in winter)
// and Narvik; Germany's steelworks feel it at once when the share sent to them falls.
SPIRITS.armed_neutrality = ['Armed Neutrality', 'Strong enough that invading us would cost more than it would gain.', { def: 0.06, stab: 2 }];
SPIRITS.compromised_neutrality = ['Compromised Neutrality', 'Everyone knows we bend; no one believes we would fight.', { stab: -3, legit: -4 }];
SPIRITS.transit_traffic = ['The Transit Traffic', 'Leave trains full of German soldiers cross Sweden to and from Norway.', { stab: -2 }];
SPIRITS.beredskap = ['The Readiness', 'Beredskapen: conscripts on the frontiers, rationing at home, the whole nation on guard.', { def: 0.1, manpower: 0.05, tax: -0.03 }];
SPIRITS.swedish_ore = ['Swedish Iron Ore', 'Kiruna\'s high-grade ore feeds the blast furnaces of the Ruhr.', { output: 0.03 }];
SPIRITS.ore_famine = ['Ore Famine', 'Without Swedish ore the steelworks run short of their best feedstock.', { output: -0.04 }];
const swOf = c => c.sw || (c.sw = { ax: 10, al: 10, cred: 70, ore: 65, conc: {}, ult: 0, vol: 0 });
const SW_ACT = {
  transit: ['Allow the Transit Traffic', 25, 'German soldiers on leave may cross Sweden by train: Axis pressure -35, Allied pressure +12, credibility -15.', 'ax'],
  engel: ['Let the Engelbrecht Division Pass', 30, 'A whole German division crosses from Norway to Finland: Axis pressure -25, Allied pressure +10, credibility -12. Only while Germany fights the Soviet Union; once.', 'ax'],
  oreup: ['Raise the Ore Quota', 20, 'More of Kiruna\'s ore for Germany: its share +15, Axis pressure -15, Allied pressure +8.', 'ax'],
  oredown: ['Cut the Ore Quota', 20, 'Less ore for Germany: its share -15, Axis pressure +15, Allied pressure -15.', 'al'],
  stop: ['Stop the Transit Traffic', 25, 'No more German soldiers on Swedish rails: Allied pressure -25, Axis pressure +20, credibility +8.', 'al'],
  bearings: ['The Ball-Bearing Run', 20, 'SKF ball bearings flown to Scotland by night: Allied pressure -12, Axis pressure +6, two weeks\' income.', 'al'],
  police: ['Police Troops for Norway and Denmark', 30, 'Train refugees as "police": Allied pressure -10, Axis pressure +12; the Norwegian and Danish exiles gain a brigade each. From 1943; once.', 'al'],
  refuge: ['A Haven for Refugees', 20, 'Open the border to everyone who flees: credibility +10, Axis pressure +8, Allied pressure -6, manpower +10.', 'al'],
  ready: ['The Readiness', 40, 'Mobilise for armed neutrality for a year: defence +10%, Axis and Allied pressure -10; costs two weeks\' income.', ''],
  finvol: ['Finland\'s Cause Is Ours', 20, 'A volunteer corps for Finland\'s war against the Soviet Union: Finland gains a division; Soviet relations -20.', '']
};
const swTransit = S => !!S.conc.transit && !S.conc.stop;
function swAct(c, a) { const S = swOf(c), d = SW_ACT[a]; if (!d) return 'Unknown'; if (c.pp < d[1]) return 'Not enough political power'; if (isAtWar(c.tag) && a !== 'finvol' && a !== 'ready') return 'Only while we are neutral';
  if (a === 'transit' && swTransit(S)) return 'The trains already run'; if (a === 'stop' && !swTransit(S)) return 'There is no transit traffic to stop';
  if (a === 'engel' && (S.conc.engel || !(ok('GER') && ok('SOV') && atWar('GER', 'SOV')))) return S.conc.engel ? 'Done once' : 'Only while Germany fights the Soviet Union';
  if (a === 'police' && (year() < 1943 || S.conc.police)) return S.conc.police ? 'Done once' : 'Not before 1943';
  if (a === 'oreup' && S.ore >= 95) return 'Germany already takes almost all of it'; if (a === 'oredown' && S.ore <= 0) return 'No ore goes to Germany';
  if (a === 'ready' && hasSpirit(c, 'beredskap')) return 'Already mobilised';
  if (a === 'finvol' && (S.conc.finvol || !(ok('FIN') && ok('SOV') && atWar('FIN', 'SOV')) || atWar(c.tag, 'FIN'))) return S.conc.finvol ? 'Our volunteers are already there' : 'Only while Finland fights the Soviet Union';
  c.pp -= d[1]; S.conc[a] = G.day;
  const f = { transit: [-35, 12, -15], engel: [-25, 10, -12], oreup: [-15, 8, 0], oredown: [15, -15, 0], stop: [20, -25, 8], bearings: [6, -12, 0], police: [12, -10, 0], refuge: [8, -6, 10], ready: [-10, -10, 0], finvol: [0, -4, 0] }[a];
  S.ax = clamp(S.ax + f[0], 0, 100); S.al = clamp(S.al + f[1], 0, 100); S.cred = clamp(S.cred + f[2], 0, 100);
  if (a === 'transit') { delete S.conc.stop; addSpirit(c, 'transit_traffic'); logMsg('Sweden lets German leave trains cross to Norway.', 'world', [c.tag]); }
  else if (a === 'stop') { removeSpirit(c, 'transit_traffic'); logMsg('Sweden stops the German transit traffic.', 'world', [c.tag]); }
  else if (a === 'engel') logMsg('A German division crosses Sweden by rail from Norway to Finland.', 'world', [c.tag]);
  else if (a === 'oreup') S.ore = Math.min(95, S.ore + 15); else if (a === 'oredown') S.ore = Math.max(0, S.ore - 15);
  else if (a === 'bearings') c.money += weeksIncome(c, 2); else if (a === 'refuge') c.manpower += 10;
  else if (a === 'ready') { addSpirit(c, 'beredskap', 365); c.money -= weeksIncome(c, 2); }
  else if (a === 'police') for (const t of ['NOR', 'DEN']) { const E = exiles()[t]; if (!E || !ok(E.host)) continue; const h = C(E.host), ar = newArmy(h, h.capital); ar.name = `${COUNTRY_DEF[t].n} Police Troops`; ar.exileOf = t; ar.auto = true; for (let i = 0; i < 2; i++) ar.divs.push({ t: 'inf', str: 0.8, org: 0.6, xp: 0.1 }); }
  else if (a === 'finvol') { spawnDivisions(C('FIN'), 'inf', 1, C('FIN').capital); addRel('FIN', c.tag, 20); if (ok('SOV')) addRel('SOV', c.tag, -20); logMsg('Swedish volunteers cross into Finland: "Finland\'s cause is ours!"', 'world', [c.tag, 'FIN']); }
  return ''; }
function swUltimatum(c, side) { const S = swOf(c), ax = side === 'ax'; S.ult = G.day;
  const concede = () => { if (ax) { if (!swTransit(S)) { S.conc.transit = G.day; delete S.conc.stop; addSpirit(c, 'transit_traffic'); } S.ore = Math.min(95, S.ore + 15); S.ax = 40; S.al = Math.min(100, S.al + 10); S.cred = Math.max(0, S.cred - 15); }
      else { S.ore = Math.max(0, S.ore - 30); if (swTransit(S)) { S.conc.stop = G.day; removeSpirit(c, 'transit_traffic'); } S.al = 40; S.ax = Math.min(100, S.ax + 10); }
      logMsg(ax ? 'Stockholm yields to Berlin: more ore, and German trains on Swedish rails.' : 'Stockholm yields to the Allies: less ore for Germany, and the transit traffic stops.', 'world', [c.tag]); };
  const refuse = () => { if (ax) { S.ax = 80; addRel('GER', c.tag, -30); c.stab = Math.max(0, c.stab - 2); if (!G.historical && ok('GER') && C('GER').ai && Math.random() < 0.4) startPlay('GER', c.tag, { type: 'take', provs: ['Kiruna', 'Luleå'].map(n => PNAME[n]).filter(x => x !== undefined) }); }
      else { S.al = 80; for (const t of ['ENG', 'USA']) if (ok(t) && !embargoing(C(t), c.tag)) setEmbargo(C(t), c.tag, true, true); }
      logMsg(ax ? 'Sweden rejects the German demands.' : 'Sweden rejects the Allied demands; London and Washington blacklist Swedish trade.', 'world', [c.tag]); };
  if (c.tag === G.player && !c.ai) UIH.popup({ title: ax ? 'A Note from Berlin' : 'The Allies Lose Patience', icon: ax ? '🦅' : '🤝', desc: ax ? 'The German minister calls at the Foreign Ministry. The Reich expects more ore, and free passage for its soldiers. He does not say what will happen otherwise; he does not need to.' : 'The British and American ministers deliver a joint note: Swedish ore is prolonging the war, and Swedish rails carry German soldiers. Unless both stop, Swedish trade will be blacklisted.', options: [{ name: 'We must give way.', fn: concede }, { name: 'Sweden will not be dictated to.', fn: refuse }] });
  else (S.cred > 60 && Math.random() < 0.25 ? refuse : concede)(); }
function swMonthly(c) { const S = swOf(c); if (c.overlord) return; const war = isAtWar(c.tag), gw = ok('GER') && isAtWar('GER') && !C('GER').capitulated, gl = ok('GER') ? capInfo('GER').prog : 1;
  const north = ['Oslo', 'Copenhagen', 'Narvik', 'Trondheim', 'Helsinki'].filter(n => ndAxis(ndCtrl(n))).length, alw = ok('ENG') && ok('GER') && atWar('ENG', 'GER') && !C('ENG').capitulated;
  if (!war) { S.ax = clamp(S.ax + (gw ? 0.6 + north * 0.5 - (S.ore - 50) / 60 - gl * 4 : -1.5) - (hasSpirit(c, 'beredskap') ? 0.5 : 0), 0, 100);
    S.al = clamp(S.al + (alw ? 0.2 + (year() >= 1943 ? 0.8 : 0) + gl * 3 + (S.ore - 40) / 60 + (swTransit(S) ? 0.5 : 0) : -1.5), 0, 100); S.cred = clamp(S.cred + (S.cred < 70 ? 0.3 : 0), 0, 100); }
  // the ore: Kiruna by rail to Luleå (frozen from December to April) and to Narvik in Norway
  const m = ndMonth(), winter = m <= 3 || m === 11, kir = ndCtrl('Kiruna') === c.tag, lul = !winter && ndCtrl('Luleå') === c.tag, nt = ndCtrl('Narvik'), nar = !!nt && ok(nt) && !atWar(nt, c.tag) && !(G.flags.leadsMined && nt === 'NOR');
  S.vol = kir ? Math.min(1, (lul ? 0.6 : 0) + (nar ? 0.6 : 0)) : 0; c.money += weeksIncome(c, 0.4 * S.vol);
  if (ok('GER')) { const g = C('GER'), toG = !atWar(c.tag, 'GER') && !embargoing(c, 'GER') ? S.ore / 100 : 0, narG = nar && !atWar(nt, 'GER'), got = (ndCtrl('Kiruna') === 'GER' ? 1 : 0) + (kir ? Math.min(1, (lul ? 0.6 : 0) + (narG ? 0.6 : 0)) * toG : 0);
    removeSpirit(g, 'swedish_ore'); removeSpirit(g, 'ore_famine'); if (got >= 0.45) addSpirit(g, 'swedish_ore'); else if (gw && got < 0.2) addSpirit(g, 'ore_famine'); }
  removeSpirit(c, 'armed_neutrality'); removeSpirit(c, 'compromised_neutrality'); if (!war) { if (S.cred >= 70) addSpirit(c, 'armed_neutrality'); else if (S.cred < 30) addSpirit(c, 'compromised_neutrality'); }
  if (!war && G.day - S.ult > 150) { if (S.ax >= 100 && gw) swUltimatum(c, 'ax'); else if (S.al >= 100 && alw) swUltimatum(c, 'al'); }
  if (c.ai) swAI(c); }
function swAI(c) { const S = swOf(c); if (!S.conc.finvol && ok('FIN') && ok('SOV') && atWar('FIN', 'SOV') && !atWar(c.tag, 'SOV') && c.pp >= 20) swAct(c, 'finvol'); if (isAtWar(c.tag)) return;
  if (!hasSpirit(c, 'beredskap') && c.pp >= 60 && (G.historical ? G.day >= ndDay(1939, 9) && G.day < ndDay(1945, 6) : G.tension > 60)) swAct(c, 'ready');
  if (G.historical) { if (!S.conc.transit && G.day >= ndDay(1940, 7) && ndAxis(ndCtrl('Oslo'))) swAct(c, 'transit');
    if (!S.conc.engel && G.day >= ndDay(1941, 6)) swAct(c, 'engel'); if (swTransit(S) && G.day >= ndDay(1943, 8)) swAct(c, 'stop');
    if (!S.conc.police && G.day >= ndDay(1943, 6)) swAct(c, 'police'); if (!S.conc.refuge && G.day >= ndDay(1943, 10)) swAct(c, 'refuge'); if (G.day >= ndDay(1944, 11) && S.ore > 0) swAct(c, 'oredown'); return; }
  if (S.ax > 85 && S.ax >= S.al && c.pp > 40) swAct(c, swTransit(S) ? 'oreup' : 'transit'); else if (S.al > 85 && c.pp > 40) swAct(c, swTransit(S) ? 'stop' : 'oredown'); }

// ======================= Norway: neutral waters, heavy water and the merchant fleet =======================
SPIRITS.guarded_waters = ['Guarded Waters', 'Our warships and coastal forts escort every foreign ship through the Leads.', { def: 0.04, stab: 1 }];
SPIRITS.violated_waters = ['Violated Waters', 'Foreign warships do as they please in our fjords.', { stab: -3, legit: -3 }];
SPIRITS.heavy_water = ['Norwegian Heavy Water', 'Deuterium from Vemork moderates our atomic piles.', { research: 0.02 }];
const noOf = c => c.no || (c.no = { watch: 35, viol: 0, last: '', charter: 0 });
const hwOf = () => G.hw || (G.hw = { rate: 8, halt: 0, sab: 0, ferry: 0 });
const NO_ACT = { patrol: ['Patrol the Leads', 25, 'Warships and coastal batteries watch the inner passage: neutrality watch +25; costs two weeks\' income.'],
  mine: ['Mine Our Own Waters', 25, 'Close the Leads to the German ore ships from Narvik: Germany -25, Britain +15, watch +15. Once.'],
  charter: ['Charter Ships to Britain', 20, 'A fifth of our merchant fleet sails for Britain under charter: four weeks\' income; Germany -10. Once a year, while Britain is at war.'] };
function noAct(c, a) { const N = noOf(c), d = NO_ACT[a]; if (!d) return 'Unknown'; if (c.pp < d[1]) return 'Not enough political power';
  if (a === 'mine' && G.flags.leadsMined) return 'The Leads are already mined'; if (a === 'charter') { if (isAtWar(c.tag)) return 'Only while neutral'; if (G.day - N.charter < 365) return 'Once a year'; if (!(ok('ENG') && isAtWar('ENG'))) return 'Britain is not at war'; }
  c.pp -= d[1];
  if (a === 'patrol') { N.watch = Math.min(100, N.watch + 25); c.money -= weeksIncome(c, 2); }
  else if (a === 'mine') { G.flags.leadsMined = G.day; N.watch = Math.min(100, N.watch + 15); addRel('GER', c.tag, -25); addRel('ENG', c.tag, 15); G.tension = Math.min(100, G.tension + 3); logMsg('Norway mines its own coastal waters: no more German ore ships down the Leads from Narvik.', 'world', [c.tag]); }
  else { N.charter = G.day; const S = seaOf(c), e = seaOf(C('ENG')), n = Math.max(1, Math.round(S.ton * 0.2)); S.ton -= n; e.ton += n; c.money += weeksIncome(c, 4); addRel('ENG', c.tag, 10); addRel('GER', c.tag, -10); }
  return ''; }
function noMonthly(c) { const N = noOf(c), war = isAtWar(c.tag); N.watch = Math.max(0, N.watch - 0.8); removeSpirit(c, 'guarded_waters'); removeSpirit(c, 'violated_waters');
  if (!war && !c.overlord && ok('ENG') && ok('GER') && atWar('ENG', 'GER')) {
    if (Math.random() < 0.3 * (1 - N.watch / 100)) { const by = N.last === 'GER' ? 'ENG' : 'GER'; N.last = by; N.viol++; c.stab = Math.max(0, c.stab - 1); G.tension = Math.min(100, G.tension + 1); addRel(c.tag, by, -5);
      logMsg(by === 'GER' ? 'A German supply ship slips down the Leads under armed escort; the Norwegian navy can only watch.' : 'British destroyers chase a German ship into a Norwegian fjord and board it.', c.tag === G.player ? 'world' : 'info', [c.tag, by]); }
    if (N.watch >= 60) addSpirit(c, 'guarded_waters'); else if (N.viol >= 4) addSpirit(c, 'violated_waters');
    // Operation Wilfred: in the historical course the Royal Navy mines the Leads in April 1940
    if (G.historical && !G.flags.leadsMined && G.day >= ndDay(1940, 4) && ok('ENG') && C('ENG').ai) { G.flags.leadsMined = G.day; N.viol++; addRel(c.tag, 'ENG', -10); logMsg('Operation Wilfred: the Royal Navy lays mines in Norwegian waters to stop the ore ships from Narvik.', 'world', [c.tag, 'ENG']); } }
  if (c.ai) { if (!war && N.watch < 40 && c.pp > 60 && G.tension > 50) noAct(c, 'patrol');
    if (G.historical && !c.flags.hwFrance && G.day >= ndDay(1940, 3) && (c.hwkg || 0) > 10 && ok('FRA') && !C('FRA').capitulated && !atWar(c.tag, 'FRA')) { c.flags.hwFrance = G.day; hwSell(c, 'FRA'); } } }
function hwSell(c, to) { if (c.tag !== 'NOR') return 'Only Norway sells Norwegian heavy water'; const kg = c.hwkg || 0, k = C(to); if (kg < 10) return 'There is almost none in stock'; if (!k || !ok(to) || atWar(c.tag, to)) return 'They cannot buy from us';
  k.hwkg = (k.hwkg || 0) + kg; c.hwkg = 0; c.money += weeksIncome(c, kg / 40); addRel(to, c.tag, 10); for (const e of enemiesOf(to)) if (ok(e)) addRel(e, c.tag, -10);
  logMsg(`Norsk Hydro sells its stock of heavy water, ${Math.round(kg)} kilograms, to ${k.name}.`, 'world', [c.tag, to]); return ''; }
// the Vemork plant at Rjukan: whoever holds it gets its heavy water, which speeds atomic research and the bomb
function hwMonthly() { const H = hwOf(), t = ndCtrl('Rjukan'); if (t && ok(t) && G.day >= H.halt) { const k = C(t); k.hwkg = (k.hwkg || 0) + H.rate * (t === 'NOR' ? 1 : 1.5); } H.rate = Math.min(30, H.rate + 0.05);
  for (const k of alive()) { const kg = k.hwkg || 0; removeSpirit(k, 'heavy_water'); if (kg < 1) continue; const b = Math.min(1, kg / 500), r = k.research && k.research.prod, atom = r && ['p_atomic', 'p_bomb'].includes(r.id);
    if (kg >= 100 && (k.techs.p_atomic || atom)) addSpirit(k, 'heavy_water'); if (atom) r.prog += techCost(r.id) * 0.015 * b; if (k.techs.p_bomb) k.nukeProg = (k.nukeProg || 0) + 2 * b; }
  if (G.historical && t && ok(t) && t !== 'NOR' && ok('ENG') && atWar(t, 'ENG')) { if (!H.sab && G.day >= ndDay(1943, 2)) hwSabotage('gunnerside'); else if (H.sab && !H.ferry && G.day >= ndDay(1944, 2)) hwSabotage('ferry'); } }
function hwSabotage(kind) { const H = hwOf(), t = ndCtrl('Rjukan'), k = t && C(t); if (!k) return 'No one holds Rjukan';
  if (kind === 'gunnerside') { if (H.sab) return 'Already done'; H.sab = G.day; H.halt = G.day + 300; k.hwkg = Math.round((k.hwkg || 0) * 0.4); logMsg('Norwegian commandos blow up the heavy-water cells at Vemork. Not a shot is fired.', 'world', [t, 'NOR']); }
  else { if (H.ferry || !H.sab) return H.ferry ? 'Already done' : 'The plant must be hit first'; H.ferry = G.day; k.hwkg = Math.round((k.hwkg || 0) * 0.15); H.halt = Math.max(H.halt, G.day + 365); logMsg('The ferry Hydro sinks in Lake Tinn with the last Norwegian heavy water bound for Germany.', 'world', [t, 'NOR']); }
  return ''; }

// ======================= Denmark: butter and bacon, cooperation, and the islands =======================
SPIRITS.model_protectorate = ['The Model Protectorate', 'King, Folketing and courts carry on under German occupation.', { stab: 2 }];
SPIRITS.dk_martial = ['Martial Law', 'The government has resigned; the Germans rule Denmark directly.', { stab: -10, output: -0.05 }];
SPIRITS.danish_butter = ['Danish Butter and Bacon', 'Danish farms help feed the Reich.', { stab: 1 }];
SPIRITS.dk_sabotage = ['Danish Sabotage', 'Railways and factories in Denmark are blown up night after night.', { output: -0.01 }];
const dkOf = c => c.dk || (c.dk = { uk: 60, coop: 0, pol: 'free', since: 0, elect: 0 });
const DK_ACT = { uk: ['Sell to Britain', 10, 'Shift a sixth of our farm exports to the British market: Britain +5, Germany -5.', 'free'], ger: ['Sell to Germany', 10, 'Shift a sixth of our farm exports to the German market: Germany +5, Britain -5.', 'free'],
  protest: ['Protest Formally', 15, 'The King rides through Copenhagen every morning, unguarded: legitimacy +4, cooperation -5.', 'coop'], concede: ['Concede', 20, 'Give the Germans what they ask, this time: cooperation +12, legitimacy -4, Germany +10.', 'coop'],
  blind: ['Look the Other Way', 25, 'The police do not see the saboteurs: cooperation -12; German production suffers for six months.', 'coop'], vote: ['Hold the Election', 25, 'Let the Danes vote, under occupation: cooperation +8, legitimacy +10. Once.', 'coop'],
  warn: ['Warn the Jews', 20, 'A German diplomat leaks the date of the round-up; fishing boats wait in every harbour on the Sound. Once.', 'martial'] };
function dkAct(c, a) { const D = dkOf(c), d = DK_ACT[a]; if (!d) return 'Unknown'; if (D.pol !== d[3]) return d[3] === 'free' ? 'Only while we are free' : d[3] === 'coop' ? 'Only under the policy of cooperation' : 'Only under martial law'; if (c.pp < d[1]) return 'Not enough political power';
  if (a === 'vote' && D.elect) return 'Done once'; if (a === 'warn' && D.warned) return 'Done once'; if (a === 'uk' && D.uk >= 100) return 'All of it goes to Britain already'; if (a === 'ger' && D.uk <= 0) return 'All of it goes to Germany already';
  c.pp -= d[1];
  if (a === 'uk' || a === 'ger') { D.uk = clamp(D.uk + (a === 'uk' ? 17 : -17), 0, 100); addRel('ENG', c.tag, a === 'uk' ? 5 : -5); addRel('GER', c.tag, a === 'uk' ? -5 : 5); }
  else if (a === 'protest') { c.legitBonus = (c.legitBonus || 0) + 4; D.coop = Math.max(0, D.coop - 5); }
  else if (a === 'concede') { D.coop = Math.min(100, D.coop + 12); c.legitBonus = (c.legitBonus || 0) - 4; addRel('GER', c.tag, 10); }
  else if (a === 'blind') { D.coop = Math.max(0, D.coop - 12); if (ok('GER')) addSpirit(C('GER'), 'dk_sabotage', 180); }
  else if (a === 'vote') { D.elect = G.day; D.coop = Math.min(100, D.coop + 8); c.legitBonus = (c.legitBonus || 0) + 10; logMsg('Denmark votes under occupation: the democratic parties win 95 per cent; the Danish Nazis barely 2.', 'world', [c.tag]); }
  else dkRescue(c); return ''; }
function dkRescue(c) { const D = dkOf(c); if (D.warned) return; D.warned = G.day; const sw = ok('SWE') && !atWar('SWE', c.tag); if (sw) swOf(C('SWE')).cred = Math.min(100, swOf(C('SWE')).cred + 10);
  logMsg(sw ? 'In one October fortnight fishing boats carry seven thousand Danish Jews across the Sound to Sweden.' : 'Danish Jews are hidden in hospitals, churches and summer houses across the country.', 'world', [c.tag, 'SWE']); }
// when the Germans cross the border: fight, or yield under protest and keep a Danish government
function dkChoose(c) { if (!ok('GER') || !atWar(c.tag, 'GER') || c.overlord || c.capitulated) return;
  if (c.tag === G.player && !c.ai) UIH.popup({ title: 'The Ninth of April', icon: '🇩🇰', desc: 'German troops crossed the border at dawn and landed at the Langelinie pier. The German minister presents a memorandum: if we do not resist, Denmark keeps its King, its government and its army. The Royal Guard is already fighting at Amalienborg.', options: [{ name: 'Yield under protest. Denmark will be governed by Danes.', fn: () => dkCooperate(c) }, { name: 'Fight. Let the world see we did not consent.', fn: () => {} }] });
  else if (G.historical || Math.random() < 0.7) dkCooperate(c); }
function dkCooperate(c) { const D = dkOf(c); if (!ok('GER') || !atWar(c.tag, 'GER')) return; separatePeace(c, 'GER'); makeSubject('GER', c.tag); c.autonomy = 70; D.pol = 'coop'; D.coop = 75; D.since = G.day;
  for (const p of provsOf(c.tag)) if (p.ctrl === 'GER') p.ctrl = c.tag; addSpirit(c, 'model_protectorate');
  logMsg('Denmark yields under protest. King Christian X stays in Copenhagen and the government carries on under German occupation: the "model protectorate".', 'world', [c.tag, 'GER']); }
function dkAugust(c) { const D = dkOf(c); D.pol = 'martial'; D.aug = G.day; removeSpirit(c, 'model_protectorate'); addSpirit(c, 'dk_martial'); c.autonomy = 5; c.stock.ships = 0; for (const a of armiesOf(c.tag)) removeArmy(a);
  for (const p of provsOf(c.tag)) p.unrest = Math.min(100, (p.unrest || 0) + 20);
  logMsg('Strikes and sabotage across Denmark. The government resigns rather than enforce German justice; the Germans declare martial law and the Danish fleet scuttles itself at Holmen.', 'world', [c.tag, 'GER']);
  if (c.ai || c.tag !== G.player) dkRescue(c); }
function dkMonthly(c) { const D = dkOf(c), gw = ok('GER') && isAtWar('GER');
  if (D.pol === 'free') { const toUK = ok('ENG') && !atWar(c.tag, 'ENG') && !embargoing(c, 'ENG') ? D.uk / 100 : 0, toG = ok('GER') && !atWar(c.tag, 'GER') && !embargoing(c, 'GER') ? (100 - D.uk) / 100 : 0, blockade = ok('ENG') && ok('GER') && atWar('ENG', 'GER') ? 0.5 : 1;
    c.money += weeksIncome(c, 0.35 * (toUK * blockade + toG)); if (ok('GER')) removeSpirit(C('GER'), 'danish_butter'); }
  else { c.money += weeksIncome(c, 0.15); if (ok('GER')) addSpirit(C('GER'), 'danish_butter'); }
  if (D.pol === 'coop') { if (!ok('GER') || c.overlord !== 'GER') { D.pol = 'free'; removeSpirit(c, 'model_protectorate'); return; } const gl = capInfo('GER').prog;
    D.coop = clamp(D.coop - 0.5 - gl * 3 - (G.day - D.since > 900 ? 0.5 : 0) + (gw && gl < 0.05 ? 0.4 : 0), 0, 100);
    if (G.historical && c.ai) { if (G.day >= ndDay(1943, 3) && !D.elect) dkAct(c, 'vote'); if (G.day >= ndDay(1943, 8)) D.coop = Math.min(D.coop, 10); }
    if (D.coop <= 15) dkAugust(c); }
  else if (D.pol === 'martial' && (!ok('GER') || c.overlord !== 'GER')) { D.pol = 'free'; removeSpirit(c, 'dk_martial'); } }
// Iceland and Greenland: when Denmark falls, Britain lands at Reykjavik, America takes Greenland under protection, and in
// June 1944 Iceland proclaims its republic
function dkIslands() { const den = C('DEN'); if (!den) return; const fallen = !den.exists || den.capitulated || den.overlord === 'GER' || ndAxis(ndCtrl('Copenhagen')); if (!fallen) return; const ice = PN('Reykjavik'), gr = PN('Godthaab');
  if (ice && ice.owner === 'DEN') { const want = ok('USA') && isAtWar('USA') ? 'USA' : ok('ENG') && ok('GER') && atWar('ENG', 'GER') ? 'ENG' : null;
    if (want && ice.ctrl !== want && !ndAxis(ice.ctrl)) { const first = !G.flags.iceOcc; G.flags.iceOcc = G.day; ice.ctrl = want; if (first) logMsg('British marines land at Reykjavik: Iceland will not become a German base.', 'world', ['ENG', 'DEN']); else if (want === 'USA' && !G.flags.iceUSA) { G.flags.iceUSA = G.day; logMsg('American troops relieve the British garrison in Iceland.', 'world', ['USA']); } UIH.mapDirty(); }
    if (G.day >= ndDay(1944, 6) && !G.flags.iceland && den.exists) { G.flags.iceland = G.day; const k = ice.ctrl, r = secede(den, ['Reykjavik'], 'Iceland', 'dem', '#4a7fb5', false); if (r) { if (k && k !== r.tag && ok(k) && !ndAxis(k)) addRel(r.tag, k, 30); logMsg('At Þingvellir the Althing proclaims the Republic of Iceland.', 'world', [r.tag, 'DEN']); } } }
  if (gr && gr.owner === 'DEN' && ok('USA') && gr.ctrl !== 'USA' && !ndAxis(gr.ctrl) && (year() >= 1941 || isAtWar('USA'))) { const first = !G.flags.grUSA; G.flags.grUSA = G.day; gr.ctrl = 'USA'; if (first) logMsg('The Danish minister in Washington places Greenland under American protection.', 'world', ['USA', 'DEN']); UIH.mapDirty(); } }

// ---------- hooks ----------
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (!c.exists || c.capitulated) return; if (c.tag === 'SWE') swMonthly(c); else if (c.tag === 'NOR') noMonthly(c); else if (c.tag === 'DEN') dkMonthly(c); }; }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); hwMonthly(); dkIslands(); const E = exiles().NOR; if (E) E.funds = (E.funds || 0) + 1.5; }; }
// Nortraship: when Norway falls while fighting, the merchant fleet at sea sails for Allied ports; France's heavy water goes to England
{ const _cap = capitulate; capitulate = function (tag) { const c = C(tag), nor = tag === 'NOR' && c && !c.capitulated && !c.overlord && ok('ENG') && enemiesOf('NOR').some(e => atWar('ENG', e)), fra = tag === 'FRA' && c && (c.hwkg || 0) > 0 && ok('ENG') && !C('ENG').capitulated;
  _cap(tag);
  if (nor) { const S = seaOf(c), n = Math.round(S.ton * 0.8); if (n > 0) { S.ton -= n; seaOf(C('ENG')).ton += n; logMsg('Nortraship: a thousand Norwegian merchant ships at sea sail for Allied ports. The largest shipping company in the world now works for the Allies.', 'world', ['NOR', 'ENG']); } }
  if (fra) { C('ENG').hwkg = (C('ENG').hwkg || 0) + c.hwkg; c.hwkg = 0; logMsg('Halban and Kowarski reach Falmouth with France\'s heavy water in the hold of the Broompark.', 'world', ['ENG', 'FRA']); } }; }
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { const w = _dw(a, b, ...r); if (w && a === 'GER' && b === 'DEN' && ok('DEN') && !C('DEN').overlord) G.flags.dkChoice = G.day; return w; }; }
{ const _pd = playDaily; playDaily = function () { _pd(); if (G.flags.dkChoice && G.day > G.flags.dkChoice) { delete G.flags.dkChoice; if (ok('DEN')) dkChoose(C('DEN')); } }; }
// a focus may carry out one of the national actions without paying its political power
const ndFree = (fn, ...a) => c => { const keep = c.pp; c.pp = 1e9; try { fn(c, ...a); } finally { c.pp = keep; } };
Object.assign(XTOK, {
  swdo: v => { const k = v.trim(); if (!SW_ACT[k]) throw new Error('Unknown Swedish action ' + k); return [ndFree(swAct, k), `${SW_ACT[k][0]}: ${SW_ACT[k][2]}`]; },
  nodo: v => { const k = v.trim(); if (!NO_ACT[k]) throw new Error('Unknown Norwegian action ' + k); return [ndFree(noAct, k), `${NO_ACT[k][0]}: ${NO_ACT[k][2]}`]; },
  dkdo: v => { const k = v.trim(); if (!DK_ACT[k]) throw new Error('Unknown Danish action ' + k); return [ndFree(dkAct, k), `${DK_ACT[k][0]}: ${DK_ACT[k][2]}`]; },
  hwsell: v => [ndFree(hwSell, v.trim()), `Sell our heavy water to ${COUNTRY_DEF[v.trim()].n}`],
  hwsab: v => { const k = v.trim(); return [() => hwSabotage(k), k === 'gunnerside' ? 'Blow up the heavy-water cells at Vemork, if an enemy holds Rjukan: production stops for ten months and most of the stock is lost' : 'Sink the last stocks of heavy water on their way to the enemy']; },
  swpress: v => { const [s, n] = v.trim().split(' '); return [c => { const S = swOf(c); S[s] = clamp(S[s] + +n, 0, 100); }, `${s === 'ax' ? 'Axis' : 'Allied'} pressure on us ${+n > 0 ? '+' : ''}${n}`]; },
  swcred: v => [c => { const S = swOf(c); S.cred = clamp(S.cred + +v, 0, 100); }, `Credibility of our neutrality ${+v > 0 ? '+' : ''}${v}`],
  swore: v => [c => { const S = swOf(c); S.ore = clamp(S.ore + +v, 0, 95); }, `Share of our iron ore sold to Germany ${+v > 0 ? '+' : ''}${v}`],
  nowatch: v => [c => { const N = noOf(c); N.watch = clamp(N.watch + +v, 0, 100); }, `Neutrality watch ${+v > 0 ? '+' : ''}${v}`],
  hw: v => [c => { c.hwkg = (c.hwkg || 0) + +v; }, `Heavy water +${v} kg`],
  hwrate: v => [() => { const H = hwOf(); H.rate = Math.min(30, H.rate + +v); }, `Vemork produces ${v} kg more heavy water a month`],
  seaton: v => [c => { seaOf(c).ton += +v; }, `Merchant fleet ${+v > 0 ? '+' : ''}${v} (×100,000 tons)`],
  dkuk: v => [c => { const D = dkOf(c); D.uk = clamp(D.uk + +v, 0, 100); }, `Share of our farm exports sold to Britain ${+v > 0 ? '+' : ''}${v}`],
  dkyield: () => [c => { if (ok('GER') && atWar(c.tag, 'GER')) dkCooperate(c); }, 'Yield under protest: peace with Germany, and a Danish government under German occupation'],
  dkcoop: v => [c => { const D = dkOf(c); D.coop = clamp(D.coop + +v, 0, 100); }, `Cooperation with the occupier ${+v > 0 ? '+' : ''}${v}`]
});
Object.assign(REQF, {
  swNeutral: [c => !isAtWar(c.tag) && !c.overlord, 'We are neutral'],
  gerWar: [() => ok('GER') && isAtWar('GER'), 'Germany is at war'],
  finWinter: [() => ok('FIN') && ok('SOV') && atWar('FIN', 'SOV'), 'Finland is at war with the Soviet Union'],
  norFallen: [() => !ok('NOR') || C('NOR').capitulated || ndAxis(ndCtrl('Oslo')), 'Norway has fallen'],
  denFallen: [() => !ok('DEN') || C('DEN').capitulated || C('DEN').overlord === 'GER' || ndAxis(ndCtrl('Copenhagen')), 'Denmark has fallen'],
  dkCoop: [c => dkOf(c).pol === 'coop', 'We govern ourselves under German occupation'],
  dkFree: [c => dkOf(c).pol === 'free' && !c.overlord, 'Denmark is free'],
  gerLosing: [() => !ok('GER') || capInfo('GER').prog > 0.2 || C('GER').capitulated, 'Germany is losing the war']
});

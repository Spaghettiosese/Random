// National focus trees. Majors and several minors have unique political branches; everyone shares
// the industry / army / air / navy branches. F(id, name, x, y, prerequisites, effects, description, extra)
'use strict';
const F = (id, name, x, y, pre, eff, desc, ex = {}) => Object.assign({ id, name, x, y, pre: pre || '', eff, desc, days: 70 }, ex);
const atWarWith = t => [c => G.C[t] && atWar(c.tag, t), `At war with ${COUNTRY_DEF[t] ? COUNTRY_DEF[t].n : t}`];
const existsReq = t => [c => ok(t) && !atWar(c.tag, t), `${COUNTRY_DEF[t].n} exists and we are at peace with it`];
const tensionReq = n => [() => G.tension >= n, `World tension at least ${n}`];
// Historical timetable: binds the AI only. A human player may move as early as the other requirements allow.
const dateReq = (y, m) => { const r = [c => !G.historical || (c && !c.ai) || G.day >= dayOf(y, m, 1), `The AI waits until ${MONTHS[m - 1]} ${y} (historical mode)`]; r.aiOnly = true; return r; };
const both = (a, b) => [c => a[0](c) && b[0](c), a[1] + '; ' + b[1]];
const warReq = [c => isAtWar(c.tag), 'At war'];
const peaceReq = [c => !isAtWar(c.tag), 'At peace'];
const bestRes = c => { const cnt = { coalm: 0, ironm: 0, oilr: 0 }; for (const p of heldBy(c.tag)) for (const t in cnt) if (canBuild(c, t, p)) cnt[t] += p.res[RES_OF[t]]; const o = Object.keys(cnt).filter(t => cnt[t]).sort((a, b) => cnt[b] - cnt[a]); o.slice(0, 2).forEach(t => freeBuild(c, t, 2)); if (!o.length) freeBuild(c, 'chem', 1); };
function std(x, o = {}) {
  const n = Object.assign({ ia: 'Public Works Programme', ib: 'Heavy Industry Drive', ic: 'Electrify the Nation', id: 'Research Institutes', ie: 'Rural Modernisation', if: 'Resource Self-Reliance', ig: 'War Industry', aa: 'Army Reform', ab: 'Modern Artillery', ac: 'Armoured Corps', ad: 'Doctrine of Manoeuvre', ae: 'Reserve System', ra: 'Air Ministry', rb: 'Air Doctrine', na: 'Naval Programme', nb: 'Blue-Water Fleet' }, o);
  return [
    F('ia', n.ia, x, 0, '', { build: { construction: 1 }, infra: 2 }, 'Roads, rails and public buildings put idle hands to work.'),
    F('ie', n.ie, x - 1, 1, 'ia', { build: { farm: 3 }, tech: 'p_fert' }, 'Fertiliser and credit for the countryside.'),
    F('ib', n.ib, x, 1, 'ia', { build: { steel: 2, tools: 1 } }, 'Steel is the bread of industry.'),
    F('if', n.if, x - 1, 2, 'ib', { fn: bestRes, tip: 'Expand our richest coal, iron or oil deposits' }, 'Dig deeper, drill further.'),
    F('ic', n.ic, x, 2, 'ib', { build: { power: 2 }, tech: 'p_electrification' }, 'A grid to power the factories of tomorrow.'),
    F('ig', n.ig, x + 1, 2, 'ib', { build: { arms: 2, artyf: 1 } }, 'Ploughshares into swords.'),
    F('id', n.id, x, 3, 'ic', { build: { university: 2 }, research: 30 }, 'Laboratories, institutes and scholarships.'),
    F('aa', n.aa, x + 3, 0, '', { spirit: 'army_reform', tip: 'Gain a new general' }, 'Sweep out the cobwebs of the general staff.', { fnGen: true }),
    F('ae', n.ae, x + 2, 1, 'aa', { manpower: 150, spirit: 'reserve_system' }, 'Every citizen a trained reservist.'),
    F('ab', n.ab, x + 3, 1, 'aa', { tech: 'm_art1', equip: { artillery: 60 } }, 'Guns win battles.'),
    F('ac', n.ac, x + 3, 2, 'ab', { tech: ['m_tank1', 'm_mot'], build: { tankp: 1 }, units: { arm: 1 } }, 'A mailed fist for the army.'),
    F('ad', n.ad, x + 3, 3, 'ac', { spirit: 'manoeuvre_doctrine' }, 'Speed, shock and concentration.'),
    F('ra', n.ra, x + 5, 0, '', { build: { aircraftp: 1 }, tech: 'm_air1' }, 'The future of war is in the sky.'),
    F('rb', n.rb, x + 5, 1, 'ra', { equip: { aircraft: 150 }, spirit: 'air_doctrine' }, 'Fighters to shield us, bombers to answer.'),
    F('na', n.na, x + 6, 0, '', { build: { shipyard: 1 }, equip: { ships: 12 } }, 'New keels on the slipways.'),
    F('nb', n.nb, x + 6, 1, 'na', { equip: { ships: 25 }, spirit: 'naval_tradition' }, 'A fleet that can sail any ocean.')
  ];
}
const hist = { ai: 3 }, alt = { ai: 0 };
const germanCzech = c => { const z = C('CZE'); if (!z.exists) return; const backed = alive().some(k => k.major && !hasSpirit(k, 'appeasement') && !hasSpirit(k, 'political_paralysis') && (hasPact('guar', k.tag, 'CZE') || friendly(k.tag, 'CZE')));
  if (backed || !z.ai || z.flags.resist) { startPlay(c.tag, 'CZE', { type: 'annex' }); return; }
  if (ok('HUN')) ['Košice', 'Uzhhorod'].forEach(n => PN(n).owner === 'CZE' && transferProv(PN(n), 'HUN')); annex(c.tag, 'CZE', true); G.flags.czech_gone = G.day; logMsg('German troops march into Prague. Czechoslovakia has ceased to exist.', 'world'); queueEvent('end_appeasement', 'ENG', 5); queueEvent('end_appeasement', 'FRA', 6); };
const anschluss = c => { const a = C('AUT'); if (!a.exists) return; if (!a.ai || alive().some(k => k.major && k.tag !== c.tag && hasPact('guar', k.tag, 'AUT'))) startPlay(c.tag, 'AUT', { type: 'annex' }); else { annex(c.tag, 'AUT', true); provsOf(c.tag).filter(p => p.orig === 'AUT').forEach(p => p.cores.push(c.tag)); } };
const lowCountries = c => { ['BEL', 'HOL', 'LUX'].forEach(t => { if (ok(t) && !atWar(c.tag, t) && !friendly(c.tag, t)) declareWar(c.tag, t, [{ by: c.tag, vs: t, type: 'puppet' }]); }); if (ok('FRA') && !atWar(c.tag, 'FRA')) declareWar(c.tag, 'FRA', [{ by: c.tag, vs: 'FRA', type: 'take', provs: [PNAME.Metz] }]); };
const sovPoland = c => { ['Lwów', 'Równe', 'Brest-Litovsk', 'Baranowicze', 'Wilno', 'Białystok'].forEach(n => { const p = PN(n); if (!p.cores.includes('SOV')) p.cores.push('SOV'); if (p.owner === 'GER' && !atWar('SOV', 'GER')) transferProv(p, 'SOV'); });
  if (ok('POL') && !atWar('SOV', 'POL') && !friendly('SOV', 'POL')) declareWar('SOV', 'POL', [{ by: 'SOV', vs: 'POL', type: 'take', provs: ['Lwów', 'Równe', 'Brest-Litovsk', 'Baranowicze', 'Wilno', 'Białystok'].map(n => PNAME[n]) }], 'Soviet Invasion of Poland', true); };
const aidTo = (to, goods) => c => { const t = typeof to === 'function' ? to(c) : C(to); if (!t || !t.exists) return; for (const g in goods) t.stock[g] = (t.stock[g] || 0) + goods[g]; addRel(c.tag, t.tag, 25); logMsg(`${c.name} ships military aid to ${t.name}.`, 'info', [c.tag, t.tag]); };
const spainSide = ideo => c => alive().find(k => k.tag.startsWith('SPA') && k.ideology === ideo && isAtWar(k.tag));
const pearl = c => { ['USA', 'ENG', 'HOL'].forEach(t => { if (ok(t) && !atWar(c.tag, t)) declareWar(c.tag, t, [{ by: c.tag, vs: t, type: 'take', provs: provsOf(t).concat(provsOf('PHI')).filter(p => p.claims.includes(c.tag)).map(p => p.id) }], 'Pacific War'); }); if (ok('USA')) { C('USA').stock.ships *= 0.8; removeSpirit(C('USA'), 'isolationism'); C('USA').ws = Math.max(C('USA').ws, 75); } };

const TREES = {
GER: [
  F('g_rhine', 'Remilitarise the Rhineland', 2, 0, '', { ws: 5, stab: 5, tension: 4, fort: ['Essen', 'Frankfurt'], news: 'German troops march into the demilitarised Rhineland.' }, 'Tear up Locarno and station troops on the Rhine.', { mutex: 'g_oppose', ai: 9 }),
  F('g_oppose', 'Oppose Hitler', 6, 0, '', { setIdeo: 'aut', civilwar: { ideo: 'fas', name: 'National Socialist Germany', frac: 0.45, seed: 'Munich' } }, 'The generals move against the regime. The Party will not go quietly.', { mutex: 'g_rhine', ai: 0 }),
  F('g_four', 'Four Year Plan', 0, 1, 'g_rhine', { spirit: 'four_year_plan', tech: 'p_synthetic', build: { arms: 2 } }, 'The economy must be fit for war within four years.', hist),
  F('g_autarky', 'Autarky Programme', 0, 2, 'g_four', { build: { synth: 2, coalm: 2, steel: 1 } }, 'Rubber and fuel from coal: independence from the world market.', hist),
  F('g_axis', 'Rome–Berlin Axis', 1, 1, 'g_rhine', { faction: 'Axis', rel: { ITA: 40 }, fn: c => { if (ok('ITA') && C('ITA').ideology === 'fas' && C('ITA').ai) joinFaction('ITA', c.tag); }, tip: 'Fascist Italy is invited to the Axis' }, 'A vertical line around which Europe may revolve.', { req: dateReq(1936, 10), ai: 3 }),
  F('g_anti', 'Anti-Comintern Pact', 1, 2, 'g_axis', { rel: { JAP: 40, HUN: 20, ROM: 10 }, infl: 30 }, 'A common front against Bolshevism.', hist),
  F('g_tri', 'Tripartite Pact', 1, 3, 'g_anti', { fn: c => ['JAP', 'HUN', 'ROM', 'BUL'].forEach(t => { if (ok(t) && C(t).ai && C(t).ideology !== 'dem' && C(t).ideology !== 'com' && !factionOf(t) && !atWar(t, c.tag)) joinFaction(t, c.tag); }), tip: 'Japan, Hungary, Romania and Bulgaria may join the Axis' }, 'Three empires divide the world between them.', { req: warReq, ai: 3 }),
  F('g_anschluss', 'Anschluss', 2, 1, 'g_rhine', { fn: anschluss, tip: 'Austria is united with the Reich (if nobody guarantees it)', tension: 5 }, 'One people, one Reich.', { req: both(existsReq('AUT'), dateReq(1938, 2)), ai: 6 }),
  F('g_sudeten', 'Demand the Sudetenland', 2, 2, 'g_anschluss', { play: { vs: 'CZE', provs: ['Karlsbad', 'Reichenberg'], noBackHist: ['FRA', 'ENG', 'ROM', 'YUG', 'SOV', 'POL'] } }, 'Three million Germans live under Czech rule. Not for long.', { req: both(existsReq('CZE'), dateReq(1938, 8)), ai: 6 }),
  F('g_czech', 'Fate of Czechoslovakia', 2, 3, 'g_sudeten', { fn: germanCzech, tip: 'Occupy Bohemia and Moravia if the West stands aside; otherwise open a play for annexation' }, 'The rump state cannot be allowed to survive.', { req: both(existsReq('CZE'), dateReq(1939, 2)), ai: 6 }),
  F('g_memel', 'Memel Ultimatum', 1, 4, 'g_czech', { play: { vs: 'LIT', provs: ['Memel'], force: 'concede', days: 12 } }, 'The Memelland returns home.', { req: existsReq('LIT'), ai: 5 }),
  F('g_pact', 'Molotov–Ribbentrop Pact', 3, 4, 'g_czech', { nap: 'SOV', flag: 'mr_pact', eventFor: ['SOV', 'mr_pact_sov', 2] }, 'A pact with the devil buys a free hand in the west.', { req: both(existsReq('SOV'), dateReq(1939, 6)), ai: 6 }),
  F('g_danzig', 'Danzig or War', 2, 5, 'g_memel|g_pact', { claim: ['Danzig', 'Poznań', 'Katowice', 'Łódź'], play: { vs: 'POL', provs: ['Danzig', 'Poznań', 'Katowice'], force: 'resist', days: 20 } }, 'The Free City and the Corridor — or else.', { req: both(existsReq('POL'), dateReq(1939, 6)), ai: 8 }),
  F('g_west', 'Strike in the West', 2, 6, 'g_danzig', { spirit: [['blitzkrieg', 420]], claim: ['Metz'], fn: lowCountries, tip: 'Declare war on the Low Countries and France' }, 'Through the Ardennes, to the sea.', { req: [c => !ok('POL') || C('POL').capitulated || !atWar(c.tag, 'POL'), 'Poland is defeated or at peace'], ai: 8 }),
  F('g_barb', 'War in the East', 2, 7, 'g_west', { ws: 10, spirit: [['blitzkrieg', 300]], claim: ['Minsk', 'Kiev', 'Odessa', 'Riga', 'Tallinn', 'Kaunas'], war: 'SOV' }, 'Living space lies in the east.', { req: [c => dateReq(1941, 3)[0](c) && ok('SOV') && (!ok('FRA') || C('FRA').capitulated || !atWar(c.tag, 'FRA')), 'France is defeated or at peace; ' + dateReq(1941, 3)[1]], ai: 5 }),
  F('g_kaiser', 'Restore the Kaiser', 5, 1, 'g_oppose', { law: 'monarchy', stab: 10, rel: { ENG: 20, HOL: 20 }, spirit: 'kaiserreich' }, 'The Hohenzollerns return to Berlin.', { mutex: 'g_republic', ai: 0 }),
  F('g_republic', 'Reforge the Republic', 7, 1, 'g_oppose', { setIdeo: 'dem', rmspirit: 'versailles', rel: { ENG: 30, FRA: 30, USA: 20 } }, 'Weimar failed. The next republic must not.', { mutex: 'g_kaiser', ai: 0 }),
  F('g_mittel', 'Mitteleuropa', 5, 2, 'g_kaiser', { faction: 'Central Powers', fn: c => ['AUT', 'HUN', 'BUL'].forEach(t => ok(t) && C(t).ai && joinFaction(t, c.tag)), tip: 'Austria, Hungary and Bulgaria are invited' }, 'An old alliance under new management.', alt),
  F('g_entente', 'Join the Western Powers', 7, 2, 'g_republic', { fn: c => { if (factionOf('ENG')) joinFaction(c.tag, 'ENG'); else addPact('ally', c.tag, 'ENG'); }, tip: 'Join the faction of the United Kingdom or ally with it' }, 'Germany\'s place is among the democracies.', alt),
  ...std(10, { ia: 'Reichsautobahn', ig: 'Rearmament Contracts', aa: 'Wehrmacht Expansion', ac: 'Panzerwaffe', ad: 'Bewegungskrieg', ra: 'Luftwaffe', na: 'Plan Z' })
],
SOV: [
  F('s_plan', 'Third Five-Year Plan', 0, 0, '', { build: { steel: 3, power: 2, tools: 2 }, pp: 30 }, 'Fulfil and overfulfil.', hist),
  F('s_ural', 'Ural Industrial Region', 0, 1, 's_plan', { fn: c => { ['Sverdlovsk', 'Chelyabinsk', 'Novosibirsk'].forEach(n => { const p = PN(n); if (p.owner === c.tag) { p.b.steel = (p.b.steel || 0) + 1; p.b.arms = (p.b.arms || 0) + 1; p.b.railway = (p.b.railway || 0) + 1; } }); }, tip: 'Steel mills, arms factories and railways beyond the Urals' }, 'Industry out of reach of any invader.', hist),
  F('s_tank', 'Tank Factories of Kharkov', 0, 2, 's_ural', { build: { tankp: 2, engines: 1 }, tech: 'm_tank2' }, 'Steel beasts by the thousand.', hist),
  F('s_purge', 'The Great Purge', 2, 0, '', { stab: 8, pp: 120, rmspirit: 'paranoia', spirit: [['officer_purge', 1200]], fn: c => { const g = c.gens.find(x => x.name.includes('Tukhachevsky')); if (g) { if (g.army && G.armies[g.army]) G.armies[g.army].gen = null; c.gens.splice(c.gens.indexOf(g), 1); } }, tip: 'Marshal Tukhachevsky is shot' }, 'Enemies of the people are everywhere, even on the General Staff.', { mutex: 's_trust', ai: 5 }),
  F('s_trust', 'Trust the Marshals', 3, 0, '', { rmspirit: 'paranoia', spirit: 'red_army_prestige', stab: -8, ig: { army: { appr: 5, clout: 0.3 } } }, 'The Red Army is loyal. Let it prepare for the real enemy.', { mutex: 's_purge', ai: 0 }),
  F('s_coll', 'Collective Security', 4, 1, 's_purge|s_trust', { rel: { FRA: 25, CZE: 25, ENG: 10 }, guarantee: 'CZE', infl: 30 }, 'Litvinov\'s line: contain the fascists with treaties.', { mutex: 's_revision', ai: 0 }),
  F('s_revision', 'Revise the Western Border', 2, 1, 's_purge|s_trust', { claim: ['Chișinău', 'Viipuri', 'Tallinn', 'Riga', 'Kaunas'], infl: 20 }, 'The borders of 1918 were imposed on a weak Russia.', { mutex: 's_coll', ai: 4 }),
  F('s_baltic', 'Baltic Ultimatums', 1, 2, 's_revision', { fn: c => ['EST', 'LAT', 'LIT'].forEach(t => ok(t) && startPlay(c.tag, t, { type: 'annex' }, { force: C(t).ai && !alive().some(k => k.major && hasPact('guar', k.tag, t)) ? 'concede' : null, days: 15 })), tip: 'Demand the annexation of Estonia, Latvia and Lithuania' }, 'Mutual assistance — at gunpoint.', { req: [c => G.flags.mr_pact || G.tension >= 70, 'Molotov–Ribbentrop Pact signed, or world tension 70'], ai: 5 }),
  F('s_fin', 'Demands on Finland', 2, 2, 's_revision', { play: { vs: 'FIN', provs: ['Viipuri'], force: 'resist', days: 20 } }, 'Leningrad is within artillery range of the border.', { req: [c => ok('FIN') && (G.flags.mr_pact || G.tension >= 70), 'Molotov–Ribbentrop Pact signed, or world tension 70'], ai: 5 }),
  F('s_bess', 'Reclaim Bessarabia', 3, 2, 's_revision', { play: { vs: 'ROM', provs: ['Chișinău', 'Czernowitz'], days: 15 } }, 'Romania stole it in 1918.', { req: [c => ok('ROM') && (G.flags.mr_pact || G.tension >= 70), 'Molotov–Ribbentrop Pact signed, or world tension 70'], ai: 5 }),
  F('s_poland', 'Liberate Western Ukraine and Belarus', 2, 3, 's_baltic|s_fin|s_bess', { fn: sovPoland, tip: 'Take eastern Poland if Poland is collapsing' }, 'Our brothers beyond the Curzon line await.', { req: [c => (G.flags.mr_pact || isAtWar(c.tag)) && (!ok('POL') || isAtWar('POL')), 'Molotov–Ribbentrop Pact signed and Poland is at war or gone'], ai: 6 }),
  F('s_patriot', 'The Great Patriotic War', 4, 3, 's_coll|s_revision', { spirit: 'great_patriotic_war', ws: 20, manpower: 600, law: 'requirement', rmspirit: ['officer_purge', 'rigid_command'] }, 'Not one step back.', { req: [c => G.wars.some(w => w.def.includes(c.tag) && w.att.some(t => C(t).major)), 'A major power has attacked us'], ai: 10 }),
  F('s_east', 'Far Eastern Front', 5, 0, '', { units: { inf: 4, cav: 1 }, fort: ['Vladivostok', 'Khabarovsk'] }, 'The Kwantung Army watches the Amur.', hist),
  F('s_japnap', 'Neutrality Pact with Japan', 5, 1, 's_east', { nap: 'JAP' }, 'One front at a time.', { req: existsReq('JAP'), ai: 3 }),
  F('s_china', 'Aid to China', 6, 1, 's_east', { fn: aidTo('CHI', { arms: 300, artillery: 60, aircraft: 150 }), tip: 'Ship arms and aircraft to China' }, 'Keep Japan bogged down.', { req: [c => ok('CHI') && atWar('CHI', 'JAP'), 'China is at war with Japan'], ai: 4 }),
  F('s_spain', 'Aid the Spanish Republic', 6, 0, '', { fn: c => { const t = spainSide('dem')(c) || spainSide('com')(c); if (t) aidTo(() => t, { arms: 250, tanks: 40, aircraft: 120 })(c); }, tip: 'Tanks, aircraft and advisers for the Republic' }, 'No pasarán.', { req: [c => alive().some(k => k.tag.startsWith('SPA') && k.civilOf) || alive().some(k => k.civilOf === 'SPA'), 'Civil war in Spain'], ai: 4 }),
  F('s_comintern', 'World Revolution', 4, 2, 's_coll', { spirit: 'export_revolution', fn: c => alive().forEach(k => { if (k.tag !== c.tag && k.sup.com > 12) shiftSupport(k, { com: 4 }); }), tip: 'Communist support grows wherever it has a foothold' }, 'Workers of the world, unite.', alt),
  ...std(9, { ia: 'Stakhanovite Movement', ie: 'Collectivisation Completed', aa: 'Red Army Reform', ad: 'Deep Battle', na: 'Red Banner Fleet' })
],
USA: [
  F('u_newdeal', 'Second New Deal', 1, 0, '', { rmspirit: 'great_depression', spirit: 'recovery', stab: 5 }, 'Relief, recovery and reform.', hist),
  F('u_wpa', 'Works Progress Administration', 0, 1, 'u_newdeal', { build: { construction: 2, power: 2 }, infra: 3 }, 'Dams, roads and post offices in every county.', hist),
  F('u_ssa', 'Social Security Act', 1, 1, 'u_newdeal', { law: ['pensions', 'regulated'], ig: { union: { appr: 5 }, ind: { appr: -3 } } }, 'Freedom from want.', hist),
  F('u_recovery', 'Full Recovery', 1, 2, 'u_wpa,u_ssa', { rmspirit: 'recovery', pp: 100, build: { autos: 2, steel: 2 } }, 'Happy days are here again.', hist),
  F('u_neutral', 'Neutrality Acts', 3, 0, '', { stab: 5, pp: 50 }, 'No more foreign wars.', { mutex: 'u_quarantine', ai: 1 }),
  F('u_quarantine', 'Quarantine the Aggressors', 4, 0, '', { ws: 8, rmspirit: 'isolationism', spirit: 'great_debate' }, 'War is a contagion.', { mutex: 'u_neutral', req: tensionReq(30), ai: 5 }),
  F('u_two', 'Two-Ocean Navy', 4, 1, 'u_quarantine', { build: { shipyard: 3 }, equip: { ships: 50 } }, 'A fleet for each ocean.', hist),
  F('u_lend', 'Lend-Lease', 5, 1, 'u_quarantine', { flag: 'lendlease', rmspirit: 'great_debate', spirit: 'arsenal_of_democracy', rel: { ENG: 30, SOV: 10, CHI: 20 } }, 'Lend a neighbour your garden hose.', { req: tensionReq(50), ai: 5 }),
  F('u_draft', 'Selective Service', 4, 2, 'u_two|u_lend', { law: 'limited', manpower: 400, units: { inf: 6 }, rmspirit: 'peacetime_army' }, 'The first peacetime draft.', hist),
  F('u_embargo', 'Embargo Japan', 5, 2, 'u_lend', { rel: { JAP: -50 }, fn: c => ok('JAP') && addSpirit(C('JAP'), 'oil_embargo'), tip: 'Japan suffers the Oil Embargo' }, 'Not one more barrel.', { req: [c => ok('JAP') && isAtWar('JAP'), 'Japan is at war'], ai: 5 }),
  F('u_allies', 'Join the Allies', 5, 3, 'u_draft|u_embargo', { fn: c => { if (factionOf('ENG')) joinFaction(c.tag, 'ENG'); else addPact('ally', c.tag, 'ENG'); }, tip: 'Join the faction of the United Kingdom', law: 'war_econ', ws: 15 }, 'The great arsenal goes to war.', { req: [c => G.tension >= 85 || isAtWar(c.tag), 'World tension 85 or at war'], ai: 6 }),
  F('u_monroe', 'Reaffirm the Monroe Doctrine', 2, 1, '', { guarantee: ['MEX', 'CUB', 'PAN', 'VEN', 'COL', 'BRA'] }, 'This hemisphere is closed to conquest.', { ai: 2 }),
  F('u_good', 'Good Neighbor Policy', 2, 2, 'u_monroe', { rel: { MEX: 30, BRA: 30, ARG: 20, CHL: 20, COL: 20, VEN: 20, PRU: 20, CUB: 20 }, infl: 40 }, 'Trade, not marines.', hist),
  F('u_manhattan', 'Manhattan Project', 3, 3, 'u_recovery|u_lend', { tech: 'p_atomic', research: 40 }, 'A weapon to end all wars.', { req: [c => year() >= 1940, 'Year 1940 or later'], ai: 4 }),
  F('u_america', 'America First', 3, 1, 'u_neutral', { ideo: { aut: 8, fas: 4 }, stab: 5, spirit: 'fortress_america' }, 'Let Europe burn; the oceans are our walls.', alt),
  F('u_wealth', 'Share Our Wealth', 0, 2, 'u_wpa', { law: ['graduated', 'welfare_state'], ig: { union: { appr: 6, clout: 0.2 }, ind: { appr: -8 } } }, 'Every man a king.', alt),
  ...std(9, { ia: 'Interstate Highways', ig: 'Arsenal of Democracy', ac: 'Armored Force', ra: 'Army Air Corps', na: 'Naval Expansion Act' })
],
ENG: [
  F('e_rearm', 'Limited Rearmament', 0, 0, '', { build: { arms: 1, aircraftp: 1 }, ws: 4 }, 'Quietly, the estimates go up.', hist),
  F('e_shadow', 'Shadow Factories', 0, 1, 'e_rearm', { build: { aircraftp: 2, arms: 2 } }, 'Car plants that can build Spitfires.', hist),
  F('e_radar', 'Chain Home', 0, 2, 'e_shadow', { tech: 'm_radar', spirit: 'chain_home' }, 'Eyes that see beyond the horizon.', hist),
  F('e_appease', 'Peace for Our Time', 2, 0, '', { stab: 8, pp: 80 }, 'War is a fearful thing; we must be very clear before we embark on it.', { mutex: 'e_steel', ai: 6 }),
  F('e_steel', 'Stand Up to the Dictators', 3, 0, '', { rmspirit: 'appeasement', ws: 10, guarantee: 'CZE', tension: 2 }, 'An appeaser feeds the crocodile hoping it eats them last.', { mutex: 'e_appease', ai: 0 }),
  F('e_guar', 'Guarantee Poland', 2, 1, 'e_appease|e_steel', { rmspirit: 'appeasement', guarantee: ['POL', 'ROM', 'GRE'], ws: 8 }, 'Thus far and no further.', { req: [c => G.flags.czech_gone || !hasSpirit(c, 'appeasement') || G.tension >= 40, 'Czechoslovakia has fallen, appeasement abandoned, or world tension 40'], ai: 9 }),
  F('e_allies', 'The Grand Alliance', 3, 1, 'e_appease|e_steel', { faction: 'Allies', fn: c => { if (ok('FRA') && C('FRA').ideology === 'dem' && C('FRA').ai) joinFaction('FRA', c.tag); }, tip: 'France is invited if democratic' }, 'Our dominions and the French Republic at our side.', { ai: 6 }),
  F('e_bef', 'Expeditionary Force', 3, 2, 'e_allies', { units: { inf: 5, mot: 1 }, tech: 'm_mot' }, 'A continental commitment.', hist),
  F('e_churchill', 'Their Finest Hour', 2, 3, 'e_guar', { fn: c => { c.leader = 'Winston Churchill'; }, tip: 'Winston Churchill becomes Prime Minister', spirit: 'finest_hour', law: 'war_econ', ws: 20 }, 'We shall never surrender.', { req: [c => enemiesOf(c.tag).some(t => C(t).major), 'At war with a major power'], ai: 10 }),
  F('e_empire', 'Imperial Conference', 5, 0, '', { manpower: 200, rel: { CAN: 20, AST: 20, NZL: 20, SAF: 20, RAJ: 10 }, infl: 30 }, 'The Empire speaks with one voice.', hist),
  F('e_dominion', 'Dominion Status for India', 5, 1, 'e_empire', { fn: c => { if (ok('RAJ')) { removeSpirit(C('RAJ'), 'independence_movement'); C('RAJ').stab += 15; setIdeology(C('RAJ'), 'dem', true); addRel('ENG', 'RAJ', 50); } }, tip: 'India calms down and becomes democratic', stab: -3 }, 'A promise long deferred.', { mutex: 'e_grip', ai: 1 }),
  F('e_grip', 'Tighten the Raj', 6, 1, 'e_empire', { manpower: 300, fn: c => ok('RAJ') && (C('RAJ').stab -= 10), tip: 'Indian stability -10' }, 'The jewel stays in the crown.', { mutex: 'e_dominion', ai: 2 }),
  F('e_med', 'Fortress Mediterranean', 5, 2, 'e_empire', { fort: ['Valletta', 'Alexandria', 'Singapore'], units: { inf: 3 } }, 'Gibraltar, Malta, Suez: the lifeline.', hist),
  F('e_usa', 'The Special Relationship', 6, 2, 'e_empire', { rel: { USA: 40 }, fn: c => ok('USA') && addPact('trade', c.tag, 'USA'), tip: 'Trade agreement with the United States' }, 'In the west, the land is bright.', hist),
  F('e_king', 'The King\'s Party', 4, 3, 'e_appease', { setIdeo: 'aut', stab: -10, rel: { GER: 30, ITA: 20 } }, 'Edward VIII keeps the throne — and takes the reins.', { ai: 0, req: [c => year() < 1938, 'Before 1938'] }),
  ...std(10, { ia: 'Special Areas Act', aa: 'Hore-Belisha Reforms', ac: 'Royal Armoured Corps', ra: 'Fighter Command', rb: 'Bomber Command', na: 'Naval Rearmament', nb: 'Rule Britannia' })
],
FRA: [
  F('f_front', 'The Popular Front', 0, 0, '', { fn: c => { c.leader = 'Léon Blum'; c.party = 'Popular Front'; }, tip: 'Léon Blum forms a government', ig: { union: { appr: 6, clout: 0.2 }, ind: { appr: -4 } }, ideo: { com: 4 }, stab: 4 }, 'Bread, peace and liberty.', { mutex: 'f_right', ai: 6 }),
  F('f_right', 'The National Bloc', 2, 0, '', { ig: { ind: { appr: 5 }, army: { appr: 5, clout: 0.2 } }, ideo: { aut: 8 }, stab: 3 }, 'Order before all else.', { mutex: 'f_front', ai: 0 }),
  F('f_matignon', 'Matignon Agreements', 0, 1, 'f_front', { law: 'protections', rad: -0.08, stab: 5 }, 'The forty-hour week and paid holidays.', hist),
  F('f_revive', 'Revive the National Will', 1, 2, 'f_matignon|f_right', { rmspirit: 'political_paralysis', stab: 8, pp: 50 }, 'The Republic remembers what it is for.', { ai: 4 }),
  F('f_etat', 'L\'État Français', 2, 1, 'f_right', { setIdeo: 'aut', rmspirit: 'political_paralysis', rel: { GER: 20, ITA: 20 } }, 'Work, family, fatherland.', alt),
  F('f_commune', 'The Second Commune', 0, 2, 'f_matignon', { setIdeo: 'com', rmspirit: 'political_paralysis', rel: { SOV: 40 } }, 'The Wall of the Communards is avenged.', alt),
  F('f_maginot', 'Extend the Maginot Line', 4, 0, '', { fort: ['Metz', 'Lille', 'Lyon'], spirit: 'maginot_mentality' }, 'Concrete does not bleed.', { mutex: 'f_mobile', ai: 6 }),
  F('f_mobile', 'The Professional Army', 5, 0, '', { tech: ['m_tank1', 'm_mot'], units: { arm: 2, mot: 1 }, spirit: 'manoeuvre_doctrine', rmspirit: ['great_war_trauma', 'methodical_battle'] }, 'Colonel de Gaulle\'s armoured corps gets its hearing.', { mutex: 'f_maginot', ai: 0 }),
  F('f_rearm', 'Nationalise the Arms Industry', 4, 1, 'f_maginot|f_mobile', { build: { arms: 2, aircraftp: 2, artyf: 1 } }, 'The merchants of death answer to the Republic.', hist),
  F('f_empire', 'Mobilise the Empire', 5, 1, 'f_maginot|f_mobile', { manpower: 300, units: { inf: 5 } }, 'A hundred million Frenchmen.', hist),
  F('f_petite', 'Honour the Little Entente', 3, 1, '', { guarantee: ['CZE', 'ROM', 'YUG'], rel: { CZE: 20, ROM: 20, YUG: 20 } }, 'Our eastern allies must know France keeps her word.', { ai: 0, req: [c => !hasSpirit(c, 'political_paralysis'), 'Political Paralysis overcome'] }),
  F('f_britain', 'Entente Cordiale', 3, 2, '', { fn: c => { if (factionOf('ENG')) joinFaction(c.tag, 'ENG'); else addPact('ally', c.tag, 'ENG'); }, tip: 'Join the British faction, or ally with Britain', rel: { ENG: 30 } }, 'Together again, as in 1914.', { req: existsReq('ENG'), ai: 5 }),
  F('f_soviet', 'Franco-Soviet Pact', 3, 3, 'f_britain', { rel: { SOV: 30 }, nap: 'SOV' }, 'An eastern counterweight.', { ai: 2 }),
  F('f_sacree', 'Union Sacrée', 4, 2, 'f_rearm', { rmspirit: ['great_war_trauma', 'maginot_mentality'], ws: 20, law: 'war_econ' }, 'Once more, the nation in arms.', { req: [c => enemiesOf(c.tag).some(t => C(t).major), 'At war with a major power'], ai: 10 }),
  ...std(9, { ia: 'Grands Travaux', aa: 'Reform the High Command', ac: 'Divisions Cuirassées', ra: 'Armée de l\'Air', na: 'Marine Nationale' })
],
ITA: [
  F('i_eth', 'Triumph in Africa', 0, 0, '', { rmspirit: 'abyssinian_war', pp: 80, stab: 6, core: ['Addis Ababa', 'Harar', 'Gondar'], spirit: 'new_roman_empire' }, 'Italy finally has its empire.', { req: [c => !ok('ETH') || !atWar(c.tag, 'ETH'), 'The war in Ethiopia is over'], ai: 6 }),
  F('i_axis', 'Rome–Berlin Axis', 2, 0, '', { fn: c => { if (factionOf('GER')) joinFaction(c.tag, 'GER'); else addPact('ally', c.tag, 'GER'); }, tip: 'Join the German faction, or ally with Germany', rel: { GER: 30 } }, 'Two revolutions march together.', { mutex: 'i_stresa', req: both([c => ok('GER') && C('GER').ideology === 'fas', 'Germany is fascist'], dateReq(1936, 10)), ai: 6 }),
  F('i_stresa', 'Revive the Stresa Front', 3, 0, '', { rel: { ENG: 30, FRA: 30 }, guarantee: 'AUT', nap: 'FRA' }, 'Contain Germany; Austria is our buffer.', { mutex: 'i_axis', ai: 0 }),
  F('i_steel', 'Pact of Steel', 2, 1, 'i_axis', { spirit: 'pact_of_steel', equip: { arms: 150 } }, 'Bound in blood and iron.', hist),
  F('i_alb', 'Annex Albania', 1, 1, 'i_eth|i_axis', { play: { vs: 'ALB', type: 'annex', force: 'concede', days: 10 } }, 'King Zog\'s little kingdom is already ours in all but name.', { req: both(existsReq('ALB'), dateReq(1939, 3)), ai: 5 }),
  F('i_mare', 'Mare Nostrum', 0, 1, 'i_eth', { claim: ['Tunis', 'Valletta', 'Alexandria', 'Cairo', 'Djibouti'], build: { shipyard: 1 }, equip: { ships: 15 } }, 'The Mediterranean is a Roman lake.', hist),
  F('i_greece', 'Ultimatum to Greece', 1, 2, 'i_alb', { claim: ['Athens', 'Salonika'], play: { vs: 'GRE', type: 'puppet', days: 20 } }, 'We shall break Greece\'s back.', { req: both(existsReq('GRE'), dateReq(1940, 8)), ai: 3 }),
  F('i_balk', 'Balkan Ambitions', 2, 2, 'i_alb', { claim: ['Ljubljana', 'Zagreb', 'Cetinje'] }, 'Dalmatia was promised to us in 1915.', hist),
  F('i_spain', 'Corpo Truppe Volontarie', 4, 0, '', { fn: c => { const t = spainSide('fas')(c) || spainSide('aut')(c); if (t) aidTo(() => t, { arms: 250, artillery: 60, aircraft: 120 })(c); }, tip: 'Send arms and "volunteers" to the Spanish Nationalists' }, 'Fascism must win in Spain.', { req: [c => alive().some(k => k.civilOf === 'SPA' || (k.tag.startsWith('SPA') && k.civilOf)), 'Civil war in Spain'], ai: 5 }),
  F('i_war', 'Seize the Hour', 2, 3, 'i_steel', { claim: ['Marseille', 'Tunis', 'Algiers'], fn: c => { ['FRA', 'ENG'].forEach(t => { if (ok(t) && !atWar(c.tag, t) && enemiesOf('GER').includes(t)) { const w = G.wars.find(x => x.att.includes('GER') && x.def.includes(t) || x.def.includes('GER') && x.att.includes(t)); if (w) joinWar(w, c.tag, w.att.includes('GER') ? 'att' : 'def'); } }); }, tip: 'Enter Germany\'s war against the West' }, 'A few thousand dead to sit at the peace table.', { req: [c => ok('GER') && ok('FRA') && atWar('GER', 'FRA'), 'Germany is at war with France'], ai: 5 }),
  F('i_autarchia', 'Autarchia', 4, 1, '', { build: { steel: 2, chem: 1, power: 1 }, tech: 'p_synthetic', rmspirit: 'industrial_weakness' }, 'Sanctions taught us to rely on ourselves.', hist),
  F('i_king', 'The King\'s Coup', 4, 2, 'i_stresa', { setIdeo: 'aut', rel: { ENG: 30, FRA: 20, USA: 20 }, stab: -8 }, 'Victor Emmanuel dismisses the Duce.', alt),
  ...std(9, { ia: 'Bonifica Integrale', aa: 'Reform the Regio Esercito', ac: 'Divisioni Corazzate', ra: 'Regia Aeronautica', na: 'Regia Marina' })
],
JAP: [
  F('j_kodo', 'The Imperial Way', 0, 0, '', { spirit: 'spiritual_mobilisation', ws: 8, ig: { army: { appr: 5, clout: 0.2 } } }, 'Spirit over steel; the Army leads the nation.', { mutex: 'j_tosei,j_purge', ai: 3 }),
  F('j_tosei', 'The Control Faction', 1, 0, '', { spirit: 'total_war_planning', build: { arms: 2, steel: 2 } }, 'A planned economy for total war.', { mutex: 'j_kodo,j_purge', ai: 5 }),
  F('j_purge', 'Purge the Militarists', 2, 0, '', { setIdeo: 'dem', rmspirit: 'militarism', stab: -12, rel: { USA: 30, ENG: 30, CHI: 20 } }, 'The Diet reasserts civilian rule after the February Incident.', { mutex: 'j_kodo,j_tosei', ai: 0 }),
  F('j_china', 'The China Incident', 0, 1, 'j_kodo|j_tosei', { claim: ['Peiping', 'Tianjin', 'Shanghai', 'Nanjing', 'Kalgan', 'Jinan', 'Qingdao'], fn: c => { if (ok('CHI') && !atWar(c.tag, 'CHI')) declareWar(c.tag, 'CHI', [{ by: c.tag, vs: 'CHI', type: 'take', provs: ['Peiping', 'Tianjin', 'Shanghai', 'Nanjing', 'Kalgan', 'Jinan', 'Qingdao', 'Hohhot'].map(n => PNAME[n]) }], 'Second Sino-Japanese War'); }, tip: 'War with China' }, 'Shots at the Marco Polo Bridge.', { req: [c => ok('CHI') && year() >= 1937, 'Year 1937 or later'], ai: 8 }),
  F('j_axis', 'Join the Axis', 1, 1, 'j_kodo|j_tosei', { fn: c => { if (factionOf('GER')) joinFaction(c.tag, 'GER'); else addRel(c.tag, 'GER', 40); }, tip: 'Join the German faction if it exists' }, 'Berlin, Rome, Tokyo.', { req: [c => ok('GER') && C('GER').ideology === 'fas' && isAtWar('GER'), 'Fascist Germany is at war'], ai: 3 }),
  F('j_north', 'Strike North', 0, 2, 'j_china', { claim: ['Vladivostok', 'Khabarovsk', 'Chita', 'Okha', 'Ulan Bator'], war: 'SOV' }, 'The Army\'s war: Siberia and the Bolsheviks.', { mutex: 'j_south', ai: 0, req: existsReq('SOV') }),
  F('j_south', 'Strike South', 1, 2, 'j_china', { claim: ['Saigon', 'Hanoi', 'Hue', 'Batavia', 'Surabaya', 'Palembang', 'Balikpapan', 'Medan', 'Singapore', 'Kuala Lumpur', 'Manila', 'Rangoon', 'Hong Kong', 'Kuching', 'Brunei'], build: { shipyard: 2 } }, 'The Navy\'s war: oil, rubber and the southern resource area.', { mutex: 'j_north', ai: 6 }),
  F('j_nap', 'Neutrality Pact with Moscow', 2, 2, 'j_south', { nap: 'SOV' }, 'Secure the north before turning south.', { req: existsReq('SOV'), ai: 4 }),
  F('j_indo', 'Occupy Indochina', 1, 3, 'j_south', { fn: c => { if (!ok('FRA')) return; startPlay(c.tag, 'FRA', { type: 'take', provs: ['Hanoi', 'Hue', 'Saigon', 'Phnom Penh', 'Vientiane'].map(n => PNAME[n]).filter(i => P(i).owner === 'FRA') }, { force: C('FRA').capitulated || isAtWar('FRA') ? 'concede' : null, days: 15 }); }, tip: 'Demand French Indochina — France yields if it is already at war' }, 'Close the Burma Road, open the road south.', { req: [c => ok('FRA') && (isAtWar('FRA') || G.tension >= 70), 'France is at war, or world tension 70'], ai: 5 }),
  F('j_pearl', 'The Decisive Strike', 1, 4, 'j_indo', { fn: pearl, tip: 'War with the United States, the United Kingdom and the Netherlands. The US Pacific Fleet is crippled.', spirit: [['rising_sun', 240]] }, 'Climb Mount Niitaka.', { req: [c => year() >= 1941 || (hasSpirit(c, 'oil_embargo') && year() >= 1940), 'Year 1941, or 1940 under the Oil Embargo'], ai: 7 }),
  F('j_sphere', 'Co-Prosperity Sphere', 2, 3, 'j_south', { fn: c => { if (!factionOf(c.tag)) createFaction(c.tag, 'Greater East Asia Co-Prosperity Sphere'); if (ok('SIA') && C('SIA').ai && !factionOf('SIA')) joinFaction('SIA', c.tag); }, tip: 'Found our own sphere and bring Siam into it', spirit: 'asia_for_asians' }, 'Asia for the Asians — under Tokyo.', hist),
  F('j_zaibatsu', 'Zaibatsu Partnership', 3, 0, '', { build: { steel: 2, engines: 1, autos: 1 }, ig: { ind: { appr: 4 } } }, 'Mitsui, Mitsubishi, Sumitomo, Yasuda.', hist),
  F('j_oil', 'Synthetic Fuel Programme', 3, 1, 'j_zaibatsu', { tech: 'p_synthetic', build: { synth: 2 } }, 'A drop of oil is a drop of blood.', hist),
  ...std(8, { aa: 'Army Expansion Law', ra: 'Naval Air Arm', na: 'Circle Three Plan', nb: 'Kantai Kessen' })
],
CHI: [
  F('c_unity', 'National Unification', 0, 0, '', { rmspirit: 'warlord_era', spirit: 'fragile_unity', stab: 8 }, 'One country, one government, one leader.', hist),
  F('c_reform', 'Rural Reconstruction', 0, 1, 'c_unity', { build: { farm: 4, textile: 2 }, rad: -0.05, rmspirit: 'corruption', spirit: 'new_life_movement' }, 'The land feeds the revolution.', hist),
  F('c_front', 'The United Front', 2, 0, '', { nap: 'PRC', ws: 10, fn: c => { if (ok('PRC')) { addRel('CHI', 'PRC', 40); const w = G.wars.find(x => x.def.includes('CHI') || x.att.includes('CHI')); if (w && isAtWar('CHI') && !atWar('CHI', 'PRC')) joinWar(w, 'PRC', w.def.includes('CHI') ? 'def' : 'att'); } }, tip: 'Truce with the Communists; they join our war against the invader' }, 'Chinese do not fight Chinese.', { mutex: 'c_bandit', ai: 6 }),
  F('c_bandit', 'Final Encirclement Campaign', 3, 0, '', { war: 'PRC' }, 'The Japanese are a disease of the skin; the Communists, of the heart.', { mutex: 'c_front', req: [c => ok('PRC') && !isAtWar(c.tag), 'Communist China exists and we are at peace'], ai: 0 }),
  F('c_german', 'Sino-German Cooperation', 2, 1, '', { equip: { arms: 250, artillery: 50 }, build: { arms: 1 }, general: ['Alexander von Falkenhausen', 4, 'def'], units: { inf: 4 }, rmspirit: 'inept_officers' }, 'German advisers, German rifles, German helmets.', { req: [c => ok('GER') && !atWar(c.tag, 'GER'), 'At peace with Germany'], ai: 4 }),
  F('c_soviet', 'Soviet Volunteer Group', 3, 1, 'c_front', { equip: { aircraft: 200, arms: 150 }, rel: { SOV: 30 } }, 'Stalin\'s falcons over Wuhan.', { req: atWarWith('JAP'), ai: 4 }),
  F('c_resist', 'War of Resistance', 2, 2, 'c_front|c_bandit', { spirit: 'war_of_resistance', ws: 20, units: { mil: 12 }, law: 'requirement' }, 'Trade space for time.', { req: atWarWith('JAP'), ai: 10 }),
  F('c_chongqing', 'The Wartime Capital', 2, 3, 'c_resist', { fn: c => { const p = PN('Chongqing'); if (p.owner === c.tag) { c.capital = p.id; p.vp = 25; p.b.arms = (p.b.arms || 0) + 2; p.b.steel = (p.b.steel || 0) + 1; p.fort = 3; } }, tip: 'Move the capital to Chongqing and relocate arsenals there' }, 'Beyond the gorges, beyond their reach.', { req: atWarWith('JAP'), ai: 6 }),
  F('c_burma', 'The Burma Road', 3, 2, 'c_resist', { spirit: 'burma_road', rel: { ENG: 20, USA: 20 } }, 'A lifeline through the mountains.', { ai: 4 }),
  F('c_allies', 'Join the Allies', 3, 3, 'c_burma', { fn: c => { if (factionOf('ENG')) joinFaction(c.tag, 'ENG'); }, tip: 'Join the British faction' }, 'One of the Four Policemen.', { req: [c => ok('ENG') && atWar('ENG', 'JAP'), 'The United Kingdom is at war with Japan'], ai: 6 }),
  F('c_west', 'Reassert the Western Marches', 0, 2, 'c_unity', { core: ['Urumqi', 'Kashgar', 'Lhasa', 'Chamdo'], fn: c => { ['SIK', 'TIB'].forEach(t => ok(t) && startPlay(c.tag, t, { type: 'puppet' }, { days: 25 })); }, tip: 'Demand the submission of Sinkiang and Tibet' }, 'The Republic of Five Races.', { req: peaceReq, ai: 2 }),
  F('c_manch', 'Recover the Northeast', 0, 3, 'c_west|c_resist', { core: ['Mukden', 'Hsinking', 'Harbin', 'Qiqihar', 'Hailar', 'Chengde', 'Dairen', 'Taihoku'], ws: 10 }, 'The Mukden Incident will be answered.', hist),
  ...std(8, { aa: 'Whampoa Clique', ab: 'Arsenal Modernisation' })
],
POL: [
  F('p_cop', 'Central Industrial Region', 0, 0, '', { build: { steel: 2, arms: 2, power: 1 }, infra: 2 }, 'Industry in the security triangle between the Vistula and the San.', hist),
  F('p_gdynia', 'Port of Gdynia', 0, 1, 'p_cop', { build: { port: 1, shipyard: 1 }, equip: { ships: 6 } }, 'A window on the world that is not Danzig.', hist),
  F('p_sanacja', 'Strengthen the Sanacja', 2, 0, '', { pp: 80, stab: 5, ideo: { aut: 6 } }, 'The Marshal\'s heirs close ranks.', { mutex: 'p_peasant', ai: 5 }),
  F('p_peasant', 'Compromise with the Peasants', 3, 0, '', { ideo: { dem: 12 }, ig: { rural: { appr: 6 } }, law: 'universal' }, 'The great strike ends at the negotiating table.', { mutex: 'p_sanacja', ai: 0 }),
  F('p_fra', 'The Western Alliance', 2, 1, 'p_sanacja|p_peasant', { rel: { FRA: 30, ENG: 30 }, ally: 'FRA' }, 'France and Britain are far, but they are great.', { mutex: 'p_ger', ai: 6 }),
  F('p_ger', 'Reach Out to Berlin', 3, 1, 'p_sanacja|p_peasant', { nap: 'GER', rel: { GER: 40 }, fn: c => { if (ok('GER')) { transferProv(PN('Danzig'), 'GER'); G.P.forEach(p => { if (p.owner === c.tag) p.claims = p.claims.filter(t => t !== 'GER'); }); if (factionOf('GER') && C('GER').ai) joinFaction(c.tag, 'GER'); } }, tip: 'Cede Danzig, drop German claims and join the Axis if it exists' }, 'Better a junior partner than a battlefield.', { mutex: 'p_fra', ai: 0 }),
  F('p_inter', 'Intermarium', 2, 2, 'p_fra', { faction: 'Intermarium', fn: c => ['ROM', 'LIT', 'LAT', 'EST', 'HUN'].forEach(t => { if (ok(t) && C(t).ai && !factionOf(t) && opinion(t, c.tag) > -10) joinFaction(t, c.tag); }), tip: 'Invite Romania, Hungary and the Baltic states' }, 'Between the seas, between the giants.', { ai: 0, req: [c => !factionOf(c.tag), 'Not in a faction'] }),
  F('p_fort', 'Fortify the Borders', 4, 0, '', { fort: ['Poznań', 'Katowice', 'Danzig', 'Warsaw'] }, 'Bunkers on the Warta and in Silesia.', hist),
  F('p_plan', 'Plan Zachód', 4, 1, 'p_fort', { spirit: 'plan_west', manpower: 150 }, 'A fighting withdrawal to the Romanian bridgehead.', hist),
  ...std(8, { aa: 'Modernise the Cavalry', ac: 'Armoured-Motorised Brigades' })
],
SPA: [
  F('sp_land', 'Agrarian Reform', 0, 0, '', { ig: { rural: { appr: 6 }, land: { appr: -6 } }, build: { farm: 2 }, rad: -0.05 }, 'Land to those who work it.', hist),
  F('sp_victory', 'Victory in the Civil War', 2, 0, '', { rmspirit: 'two_spains', stab: 20, pp: 100, spirit: [['war_weary', 900]] }, 'One Spain remains.', { req: [c => G.flags.spain_cw && !alive().some(k => k.tag !== c.tag && k.tag.startsWith('SPA')), 'The civil war has been fought and won'], ai: 10 }),
  F('sp_rebuild', 'Reconstruction', 2, 1, 'sp_victory', { build: { construction: 2, steel: 1, textile: 2 }, infra: 3 }, 'From the rubble.', hist),
  F('sp_neutral', 'Calculated Neutrality', 1, 2, 'sp_rebuild', { spirit: 'armed_neutrality', stab: 5 }, 'Spain has bled enough.', { mutex: 'sp_side', ai: 6 }),
  F('sp_side', 'Repay Our Friends', 3, 2, 'sp_rebuild', { fn: c => { const t = c.ideology === 'fas' || c.ideology === 'aut' ? 'GER' : c.ideology === 'com' ? 'SOV' : 'ENG'; if (factionOf(t)) joinFaction(c.tag, t); else addRel(c.tag, t, 40); }, tip: 'Join the faction of our ideological patron' }, 'Those who helped us win shall not stand alone.', { mutex: 'sp_neutral', ai: 1 }),
  ...std(8)
],
TUR: [
  F('t_etat', 'Second Five-Year Plan', 0, 0, '', { build: { steel: 1, textile: 2, coalm: 1 }, infra: 2 }, 'Etatism: the state builds what capital will not.', hist),
  F('t_reform', 'Kemalist Reforms', 0, 1, 't_etat', { law: 'public', spirit: 'village_institutes', ig: { devout: { appr: -4 }, intel: { appr: 5 } } }, 'A new alphabet, a new nation.', hist),
  F('t_montreux', 'Montreux Convention', 2, 0, '', { stab: 5, infl: 40, fort: ['Istanbul'], rel: { ENG: 15, SOV: 10 } }, 'The Straits are Turkish again.', hist),
  F('t_balkan', 'Balkan Entente', 2, 1, 't_montreux', { fn: c => ['GRE', 'YUG', 'ROM'].forEach(t => ok(t) && C(t).ai && opinion(t, c.tag) > -20 && addPact('ally', c.tag, t)), tip: 'Alliances with Greece, Yugoslavia and Romania' }, 'Peace at home, peace in the world.', { mutex: 't_turan', ai: 5 }),
  F('t_turan', 'Dreams of Turan', 3, 1, 't_montreux', { claim: ['Mosul', 'Baku', 'Tabriz', 'Damascus', 'Nicosia'], ideo: { fas: 10 }, ws: 10 }, 'From the Adriatic to the Great Wall.', { mutex: 't_balkan', ai: 0 }),
  F('t_neutral', 'Active Neutrality', 2, 2, 't_balkan', { spirit: 'armed_neutrality' }, 'Friends with all, allied to none.', { ai: 5 }),
  ...std(8)
]
};
function genericTree(c) {
  const d = COUNTRY_DEF[c.tag.slice(0, 3)] || { a: c.adj };
  const neighbours = k => { const s = new Set(); for (const p of provsOf(k.tag)) for (const e of NB[p.id]) if (!e.sea && P(e.to).owner !== k.tag) s.add(P(e.to).owner); return [...s].filter(ok); };
  return [
    F('n_stab', 'National Consolidation', 3, 0, '', { stab: 6, pp: 60 }, `The ${d.a} state finds its footing.`),
    F('n_dem', 'Liberal Reforms', 1, 1, 'n_stab', { ideo: { dem: 14 }, law: 'protected' }, 'A free press and free associations.', { mutex: 'n_fas,n_com,n_aut', aiIdeo: 'dem' }),
    F('n_dem2', 'Constitutional Order', 1, 2, 'n_dem', { setIdeo: 'dem', law: 'universal', stab: 4 }, 'Ballots, not bullets.', { aiIdeo: 'dem' }),
    F('n_dem3', 'Seek Western Protection', 1, 3, 'n_dem2', { rel: { ENG: 30, USA: 30, FRA: 30 }, fn: k => { if (factionOf('ENG') && isAtWar(k.tag) && enemiesOf(k.tag).some(e => atWar('ENG', e))) joinFaction(k.tag, 'ENG'); else if (ok('ENG') && !hasSpirit(C('ENG'), 'appeasement') && C('ENG').ai) addPact('guar', 'ENG', k.tag); }, tip: 'Britain may guarantee us, or accept us as an ally if we share an enemy' }, 'The democracies must stand together.', { aiIdeo: 'dem' }),
    F('n_fas', 'National Rebirth', 2, 1, 'n_stab', { ideo: { fas: 14 }, ws: 5 }, 'Blood, soil and a strong hand.', { mutex: 'n_dem,n_com,n_aut', aiIdeo: 'fas', ai: 0.4 }),
    F('n_fas2', 'March on the Capital', 2, 2, 'n_fas', { setIdeo: 'fas', stab: -4 }, 'The old order steps aside.', { aiIdeo: 'fas' }),
    F('n_fas3', 'Align with the Axis', 2, 3, 'n_fas2', { fn: k => { if (factionOf('GER') && C('GER').ideology === 'fas') joinFaction(k.tag, 'GER'); else if (ok('GER')) addRel(k.tag, 'GER', 40); }, tip: 'Join the German faction if it exists' }, 'The future belongs to the new order.', { aiIdeo: 'fas', req: [k => !k.overlord, 'Not a subject'] }),
    F('n_com', 'Workers\' Councils', 4, 1, 'n_stab', { ideo: { com: 14 }, ig: { union: { clout: 0.3 } } }, 'All power to the councils.', { mutex: 'n_dem,n_fas,n_aut', aiIdeo: 'com', ai: 0.3 }),
    F('n_com2', 'The Revolution', 4, 2, 'n_com', { setIdeo: 'com', stab: -6 }, 'The red flag over the capital.', { aiIdeo: 'com' }),
    F('n_com3', 'Join the Comintern', 4, 3, 'n_com2', { fn: k => { if (factionOf('SOV')) joinFaction(k.tag, 'SOV'); else if (ok('SOV')) addPact('ally', k.tag, 'SOV'); }, tip: 'Join the Soviet faction' }, 'Moscow\'s shield.', { aiIdeo: 'com', req: [k => !k.overlord, 'Not a subject'] }),
    F('n_aut', 'A Firm Hand', 5, 1, 'n_stab', { ideo: { aut: 14 }, pp: 40, stab: 4 }, 'Order, tradition, continuity.', { mutex: 'n_dem,n_fas,n_com', aiIdeo: 'aut' }),
    F('n_aut2', 'Armed Neutrality', 5, 2, 'n_aut', { spirit: 'armed_neutrality', fort: 1 }, 'We want nothing from the world but to be left alone.', { aiIdeo: 'aut', req: [k => !factionOf(k.tag), 'Not in a faction'], ai: 0.6 }),
    F('n_indep', 'Full Sovereignty', 6, 2, 'n_stab', { independence: 10, stab: 5 }, 'No more orders from abroad.', { req: [k => !!k.overlord && !isAtWar(k.tag) && k.stab > 50, 'We are a subject, at peace, with stability above 50'], ai: 0.15 }),
    F('n_claims', 'Old Grievances', 6, 0, '', { fn: k => { const ns = neighbours(k).filter(t => !friendly(k.tag, t)).sort((a, b) => countryStr(a) - countryStr(b)); const t = ns[0]; if (!t) return; let n = 0; for (const p of provsOf(t)) if (n < 2 && NB[p.id].some(e => !e.sea && P(e.to).owner === k.tag) && p.id !== C(t).capital) { if (!p.claims.includes(k.tag)) p.claims.push(k.tag); n++; } claimCache(); }, tip: 'Gain claims on up to two border provinces of our weakest neighbour', ws: 5 }, 'The maps were drawn by others.', { ai: 0.12, req: [k => k.ideology !== 'dem' && !k.overlord, 'Not a democracy, not a subject'] }),
    F('n_war', 'Press Our Claims', 6, 1, 'n_claims', { fn: k => { const tg = {}; for (const p of G.P) if (p.claims.includes(k.tag) && p.owner !== k.tag && ok(p.owner) && !friendly(k.tag, p.owner)) (tg[p.owner] = tg[p.owner] || []).push(p.id); const t = Object.keys(tg).sort((a, b) => countryStr(a) - countryStr(b))[0]; if (t && !canPlay(k.tag, t).replace('Requires 40 influence', '') && (!k.ai || countryStr(k.tag) > 1.4 * (countryStr(t) + sum(alive().filter(o => o.tag !== t && (friendly(o.tag, t) || hasPact('guar', o.tag, t))), o => countryStr(o.tag))))) startPlay(k.tag, t, { type: 'take', provs: tg[t] }); }, tip: 'Open a diplomatic play for our claimed provinces' }, 'Words have failed.', { req: [k => G.P.some(p => p.claims.includes(k.tag) && p.owner !== k.tag) && !k.overlord, 'We hold a claim and are sovereign'], ai: 0.5 }),
    F('n_region', 'Regional Pact', 0, 0, '', { fn: k => { const t = neighbours(k).filter(t2 => !C(t2).major && !C(t2).overlord && opinion(t2, k.tag) > 0 && !hasPact('ally', k.tag, t2)).sort((a, b) => opinion(b, k.tag) - opinion(a, k.tag))[0]; if (t) addPact('ally', k.tag, t); else k.infl += 30; }, tip: 'Alliance with our friendliest minor neighbour' }, 'Small states survive together.', { req: [k => !k.overlord, 'Not a subject'], ai: 0.7 }),
    ...std(9)
  ];
}
const FAS_ONLY = { GER: 'g_four,g_autarky,g_axis,g_anti,g_tri,g_anschluss,g_sudeten,g_czech,g_memel,g_pact,g_danzig,g_west,g_barb', ITA: 'i_axis,i_steel,i_alb,i_greece,i_war,i_mare,i_balk,i_spain', JAP: 'j_china,j_axis,j_north,j_south,j_indo,j_pearl,j_sphere' };
for (const k in FAS_ONLY) for (const id of FAS_ONLY[k].split(',')) { const f = TREES[k].find(x => x.id === id); if (!f) throw new Error('bad focus ' + id); f.ideo = 'fas'; }
const _trees = {};
function focusTree(c) { const k = c.tag.slice(0, 3); if (TREES[k]) return TREES[k]; return _trees[c.tag] || (_trees[c.tag] = genericTree(c)); }
const focusById = (c, id) => focusTree(c).find(f => f.id === id);
function focusState(c, f) {
  if (c.focus.done[f.id]) return 'done'; if (c.focus.cur === f.id) return 'active';
  if (f.mutex && f.mutex.split(',').some(m => c.focus.done[m] || c.focus.cur === m)) return 'blocked';
  if (f.pre) { const any = f.pre.includes('|'), parts = f.pre.split(any ? '|' : ','); if (any ? !parts.some(p => c.focus.done[p]) : !parts.every(p => c.focus.done[p])) return 'locked'; }
  if (f.ideo && c.ideology !== f.ideo) return 'unmet';
  if (f.req && !f.req[0](c)) return 'unmet';
  return 'available';
}
function startFocus(c, id) { const f = focusById(c, id); if (!f || focusState(c, f) !== 'available') return false; c.focus.cur = id; c.focus.prog = 0; return true; }
function focusEff(c, f) { return f.eff; }
function focusDaily(c) {
  if (!c.focus.cur) return; const f = focusById(c, c.focus.cur); if (!f) { c.focus.cur = null; return; }
  if (++c.focus.prog < f.days) return; c.focus.cur = null; c.focus.done[f.id] = G.day;
  if (f.fnGen) hireFree(c);
  applyEff(c, focusEff(c, f)); claimCache();
  G.log.push({ d: G.day, text: `${c.name} completes the focus “${f.name}”.`, kind: 'info' });
  if (c.tag === G.player) UIH.notify(`Focus complete: ${f.name}. Choose a new national focus.`, 'focus');
}
function hireFree(c) { c.pp += 40; hireGeneral(c); }

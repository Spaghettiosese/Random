// National spirits, the 1936 scenario setup, events and decisions.
'use strict';
const SPIRITS = {
  versailles: ['Legacy of Versailles', 'A humiliated nation yearns to tear up the treaty.', { ws: 8, drift_fas: 0.1 }],
  general_staff: ['The General Staff', 'A professional officer corps schooled in mission command.', { atk: 0.1, org: 0.12, train: 0.1 }],
  corruption: ['Rampant Corruption', 'Squeeze, graft and padded muster rolls: half of what is sent to the front never arrives.', { tax: -0.2, mil_out: -0.25, build: -0.12, supply: -0.15 }],
  inept_officers: ['Inept Officer Corps', 'Commands are bought, inherited or handed to the loyal. Few generals have read a map exercise.', { atk: -0.12, def: -0.06, org: -0.1, train: -0.15 }],
  new_life_movement: ['New Life Movement', 'Discipline, hygiene and honest accounts.', { stab: 4, tax: 0.05 }],
  currency_shortage: ['Foreign Currency Shortage', 'The Reichsbank has gold for a few weeks of imports.', { tradecap: -0.15, tax: -0.05 }],
  collectivised: ['Collectivised Agriculture', 'The kolkhoz feeds the cities, badly.', { farm_out: -0.15, rad: 0.05 }],
  rigid_command: ['Rigid Command', 'No officer acts without orders, and orders come slowly.', { org: -0.1, atk: -0.05 }],
  endless_steppe: ['The Endless Land', 'Space, winter and numbers have swallowed invaders before.', { manpower: 0.15, caplimit: 0.12, supply: 0.1 }],
  peacetime_army: ['A Constabulary Army', 'Smaller than Portugal\'s, and equipped from 1918 stores.', { train: -0.25, atk: -0.08, org: -0.05 }],
  industrial_giant: ['Industrial Giant', 'Half the world\'s manufacturing, running at half speed.', { build: 0.1, invest: 0.25, research: 0.05 }],
  global_commitments: ['Global Commitments', 'An army scattered from Hong Kong to Jamaica.', { upkeep: 0.15, supply: -0.05 }],
  senior_service: ['The Senior Service', 'Three centuries of command of the sea.', { navy: 0.15 }],
  declining_births: ['The Hollow Years', 'The children not born in 1914–18 are the conscripts missing now.', { manpower: -0.15, growth: -0.4 }],
  methodical_battle: ['Methodical Battle', 'Firepower kills; everything moves at the pace of the guns.', { org: -0.08, atk: -0.05, def: 0.05 }],
  industrial_weakness: ['Industrial Weakness', 'Too little coal, too little steel, too many workshops.', { mil_out: -0.15, output: -0.05 }],
  unready_army: ['Eight Million Bayonets', 'Divisions of two regiments, tanks the size of cars, and a great deal of rhetoric.', { org: -0.1, atk: -0.06 }],
  resource_poverty: ['Resource Poverty', 'Four islands with almost no oil, iron or rubber.', { output: -0.05, supply: -0.05 }],
  bushido: ['Code of the Warrior', 'Surrender is not in the manual.', { org: 0.1, def: 0.05, caplimit: 0.1 }],
  zaibatsu: ['Zaibatsu', 'Four family combines own most of what matters.', { invest: 0.2, mil_out: 0.05 }],
  peace_dividend: ['Unready for War', 'Twenty years of disarmament conferences have left the forces hollow.', { mil_out: -0.15, train: -0.15, org: -0.06, atk: -0.04 }],
  obsolete_army: ['Army of 1920', 'Brave, numerous and equipped for the last war.', { atk: -0.08, def: -0.04, org: -0.05 }],
  clique_army: ['Clique Army', 'Soldiers loyal to their general first and to China second.', { org: -0.08, tax: -0.15, def: 0.05 }],
  rearmament: ['Rearmament', 'The Reich rebuilds its armed forces at breakneck speed.', { mil_out: 0.15, train: 0.1, needs: -0.04 }],
  four_year_plan: ['Four Year Plan', 'The economy is being readied for war.', { mil_out: 0.12, build: 0.1 }],
  blitzkrieg: ['Blitzkrieg', 'Armour, aircraft and audacity.', { atk: 0.15, tank: 0.2, org: 0.15 }],
  kaiserreich: ['The Kaiser Returns', 'The monarchy lends the state an old legitimacy.', { legit: 12, stab: 5 }],
  five_year_plan: ['Five-Year Plans', 'Forced industrialisation at any human cost.', { build: 0.2, output: 0.05, needs: -0.08 }],
  paranoia: ['Stalin\'s Paranoia', 'The General Secretary sees enemies everywhere.', { stab: -6, pp: -0.15 }],
  officer_purge: ['Purged Officer Corps', 'The best commanders are dead or in camps.', { atk: -0.12, def: -0.08, org: -0.15 }],
  red_army_prestige: ['Prestige of the Red Army', 'A confident, professional officer corps.', { atk: 0.06, org: 0.08, pp: -0.1 }],
  great_patriotic_war: ['Great Patriotic War', 'The Motherland calls.', { def: 0.12, ws: 20, manpower: 0.2, mil_out: 0.15, caplimit: 0.2 }],
  export_revolution: ['Exporting the Revolution', 'The Comintern funds parties abroad.', { infl: 0.2, drift_com: 0.1 }],
  great_depression: ['The Great Depression', 'Breadlines and shuttered factories.', { output: -0.15, needs: -0.1, build: -0.15, rad: 0.25 }],
  recovery: ['Uneven Recovery', 'The worst is over, but the scars remain.', { output: -0.06, build: -0.05, rad: 0.08 }],
  isolationism: ['Isolationism', 'Europe\'s quarrels are none of our business.', { ws: -25, mil_out: -0.25, infl: -0.3 }],
  great_debate: ['The Great Debate', 'Interventionists and isolationists battle for public opinion.', { ws: -10, mil_out: -0.1 }],
  arsenal_of_democracy: ['Arsenal of Democracy', 'American industry arms the free world.', { mil_out: 0.25, output: 0.05 }],
  fortress_america: ['Fortress America', 'Defend the hemisphere and nothing else.', { def: 0.1, ws: -10, navy: 0.1 }],
  empire: ['The Empire', 'A quarter of the world, held together by ships and habit.', { navy: 0.1, tradecap: 0.1, infl: 0.15 }],
  appeasement: ['Appeasement', 'Peace at almost any price.', { ws: -15, mil_out: -0.1, stab: 4 }],
  chain_home: ['Chain Home', 'Radar stations ring the coast.', { air: 0.15, civdef: 0.3 }],
  finest_hour: ['Their Finest Hour', 'A nation that will never surrender.', { ws: 25, def: 0.1, mil_out: 0.15, caplimit: 0.15 }],
  political_paralysis: ['Political Paralysis', 'Governments fall every few months.', { pp: -0.35, stab: -8, build: -0.05 }],
  great_war_trauma: ['Trauma of the Great War', 'A million and a half dead: never again.', { ws: -15, atk: -0.12, manpower: -0.1 }],
  maginot_mentality: ['Maginot Mentality', 'The army trusts in concrete.', { def: 0.08, atk: -0.08, entrench: 0.1 }],
  victor_emmanuel: ['The Diarchy', 'The Duce rules, but the King still reigns.', { pp: -0.15, legit: 5 }],
  abyssinian_war: ['War in Abyssinia', 'Sanctions and expense for a place in the sun.', { tradecap: -0.15, upkeep: 0.1, ws: 5 }],
  new_roman_empire: ['The New Roman Empire', 'Italy has its place in the sun.', { ws: 8, stab: 3, infl: 0.1 }],
  pact_of_steel: ['Pact of Steel', 'Bound to Berlin for better or worse.', { mil_out: 0.08, atk: 0.03 }],
  militarism: ['Militarism', 'The armed forces dominate politics.', { ws: 15, pp: -0.1, manpower: 0.1, mil_out: 0.1 }],
  army_navy_rivalry: ['Army–Navy Rivalry', 'Two services, two wars, one budget.', { upkeep: 0.1, research: -0.05 }],
  spiritual_mobilisation: ['Spiritual Mobilisation', 'Yamato spirit will overcome material odds.', { ws: 10, org: 0.1, def: 0.05 }],
  total_war_planning: ['Total War Planning', 'A national defence state.', { mil_out: 0.12, build: 0.08 }],
  rising_sun: ['Rising Sun', 'A run of stunning victories.', { atk: 0.12, navy: 0.25, org: 0.1 }],
  asia_for_asians: ['Asia for the Asians', 'Liberation — of a kind.', { infl: 0.2, manpower: 0.05 }],
  oil_embargo: ['Oil Embargo', 'The tanks of the fleet are running dry.', { output: -0.08, navy: -0.1, tradecap: -0.2 }],
  warlord_era: ['Warlord Era', 'The provinces obey their own generals.', { tax: -0.3, org: -0.15, pp: -0.2, stab: -6 }],
  fragile_unity: ['Fragile Unity', 'The cliques have bowed — for now.', { tax: -0.12, org: -0.05 }],
  nanjing_decade: ['Nanjing Decade', 'A decade of cautious modernisation.', { build: 0.08, research: 0.05, caplimit: 0.3 }],
  war_of_resistance: ['War of Resistance', 'Trading space for time.', { def: 0.15, ws: 20, manpower: 0.15, caplimit: 0.2 }],
  burma_road: ['The Burma Road', 'Supplies trickle in over the mountains.', { tradecap: 0.15, mil_out: 0.1 }],
  long_march: ['Veterans of the Long March', 'Hardened survivors who know the countryside.', { def: 0.2, org: 0.15, supply: 0.3 }],
  sanacja: ['Sanacja Regime', 'The colonels govern in the Marshal\'s name.', { pp: 0.1, drift_aut: 0.05 }],
  plan_west: ['Plan Zachód', 'A prepared defence in depth.', { def: 0.08, entrench: 0.1 }],
  border_forts: ['Border Fortifications', 'A chain of bunkers in the Sudeten mountains.', { def: 0.1, entrench: 0.15 }],
  trianon: ['Trauma of Trianon', 'No, no, never!', { ws: 10, drift_fas: 0.08 }],
  kemalism: ['Kemalism', 'Republicanism, populism, secularism, reformism, nationalism, statism.', { stab: 6, literacy: 0.5, build: 0.05 }],
  village_institutes: ['Village Institutes', 'Teachers for every village.', { literacy: 0.8, research: 0.05 }],
  two_spains: ['The Two Spains', 'A country split down the middle.', { stab: -15, rad: 0.3, pp: -0.2 }],
  war_weary: ['War Weariness', 'The nation needs time to heal.', { ws: -15, output: -0.08, rad: 0.1 }],
  armed_neutrality: ['Armed Neutrality', 'Every citizen a soldier, every pass a fortress.', { def: 0.2, ws: 10, entrench: 0.15, infl: -0.2 }],
  independence_movement: ['Independence Movement', 'Congress demands self-rule.', { stab: -8, drift_dem: 0.1, manpower: -0.3 }],
  chaco_exhaustion: ['Chaco Exhaustion', 'The Chaco War bled the country white.', { ws: -15, manpower: -0.2, tax: -0.1 }],
  bankruptcy: ['Bankruptcy', 'The state has defaulted on its debts.', { output: -0.12, stab: -10, build: -0.3, invest: -0.5 }],
  army_reform: ['Reformed General Staff', 'A modern staff system.', { org: 0.06, train: 0.1 }],
  reserve_system: ['Reserve System', 'Trained reserves ready for recall.', { manpower: 0.1, train: 0.1 }],
  manoeuvre_doctrine: ['Doctrine of Manoeuvre', 'Speed, shock and concentration.', { atk: 0.06, tank: 0.1 }],
  air_doctrine: ['Air Doctrine', 'A coherent doctrine for the air arm.', { air: 0.15, cas: 0.2 }],
  naval_tradition: ['Naval Tradition', 'Sailors who know their trade.', { navy: 0.12 }],
  bad_harvest: ['Failed Harvest', 'Drought and blight ruin the crop.', { farm_out: -0.2, rad: 0.1 }],
  good_harvest: ['Bumper Harvest', 'Granaries overflow.', { farm_out: 0.15 }],
  austerity: ['Austerity', 'The state tightens its belt.', { tax: 0.12, welfare: -0.3, rad: 0.12, build: -0.1 }],
  stimulus: ['Stimulus Programme', 'Cheap credit for industry.', { invest: 0.4, build: 0.08 }],
  boom: ['Economic Boom', 'Order books are full.', { output: 0.06, invest: 0.2 }],
  slump: ['Slump', 'Confidence has evaporated.', { output: -0.06, invest: -0.3, rad: 0.08 }],
  martial_law: ['Martial Law', 'Soldiers on every corner.', { rad: -0.3, stab: 6, output: -0.05, legit: -6 }],
  land_reform: ['Land Reform', 'Tenant farmers become owners.', { farm_out: 0.1, rad: -0.08 }],
  strike_wave: ['Strike Wave', 'Pickets at the factory gates.', { output: -0.1 }],
  propaganda: ['Propaganda Campaign', 'Posters, parades and the wireless.', { stab: 5, ws: 5 }],
  war_bonds: ['War Bonds', 'Citizens lend to the nation.', { needs: -0.04 }],
  volunteer_veterans: ['Veteran Volunteers', 'Lessons learned on a foreign battlefield.', { atk: 0.04, org: 0.04 }],
  national_pride: ['National Pride', 'The world looked upon us and was impressed.', { stab: 4, infl: 0.15 }],
  great_power_union: ['A Nation Reborn', 'A new union under one flag.', { stab: 8, ws: 8, legit: 10 }],
  nuclear_power: ['Atomic Power', 'The destroyer of worlds.', { infl: 0.5, ws: 10 }],
  occupied_resistance: ['Colonial Unrest', 'The subjects are restless.', { rad: 0.1, tax: -0.05 }],
  foreign_capital: ['Foreign Capital', 'Investors from abroad build our industry.', { invest: 0.3, pp: -0.05 }]
};

function setupScenario() {
  const cl = (tag, list) => list.forEach(n => { const p = PN(n); if (p.owner !== tag && !p.claims.includes(tag)) p.claims.push(tag); });
  const co = (tag, list) => list.forEach(n => { const p = PN(n); if (!p.cores.includes(tag)) p.cores.push(tag); });
  cl('GER', ['Memel', 'Karlsbad', 'Reichenberg', 'Danzig']); co('GER', ['Vienna', 'Innsbruck']);
  cl('HUN', ['Košice', 'Uzhhorod', 'Cluj']); cl('ITA', ['Tirana']); cl('BUL', ['Constanța']); co('LIT', ['Wilno']); cl('ARG', ['Stanley']);
  const CLQ = ['GXC', 'YUN', 'SHX', 'XSM', 'SIC']; co('CHI', ['Mukden', 'Hsinking', 'Harbin', 'Qiqihar', 'Hailar', 'Chengde', "Yan'an"]); CLQ.forEach(t => { provsOf(t).forEach(p => p.cores.push('CHI')); C(t).autonomy = 78; }); provsOf('CHI').concat(...CLQ.map(provsOf)).forEach(p => p.cores.push('PRC')); cl('PRC', []);
  co('SOV', []); cl('BOL', []); cl('JAP', []);
  // colonies are not cores of their masters
  const home = { ENG: 'United Kingdom', FRA: 'France', ITA: 'Italy', SPA: 'Spain', POR: 'Portugal', BEL: 'Belgium', HOL: 'Netherlands', DEN: 'Denmark', JAP: 'Japan', USA: 'United States of America', AST: 'Australia', SAF: 'South Africa' };
  const rows = PROV_RAW.trim().split('\n').map(l => l.split('|'));
  G.P.forEach(p => { const h = home[p.owner]; if (h && rows[p.id][1] !== h && !(p.owner === 'FRA' && p.name === 'Cayenne' ? false : false)) { if (!(p.owner === 'JAP' && ['Taihoku', 'Toyohara'].includes(p.name)) && !(p.owner === 'USA' && p.name === 'San Juan')) p.cores = p.cores.filter(t => t !== p.owner); } });
  PN('Cayenne').cores = [];
  G.factions.push({ name: 'Comintern', leader: 'SOV', members: ['SOV'] });
  [['FRA', 'CZE'], ['FRA', 'POL'], ['CZE', 'ROM'], ['CZE', 'YUG'], ['ROM', 'YUG'], ['ENG', 'POR'], ['ENG', 'IRQ']].forEach(([a, b]) => G.pacts.push({ t: 'ally', a, b, until: 0 }));
  [['ENG', 'FRA'], ['ENG', 'USA'], ['USA', 'CAN'], ['GER', 'HUN'], ['HOL', 'BEL'], ['SWE', 'NOR'], ['SWE', 'DEN'], ['ARG', 'ENG']].forEach(([a, b]) => G.pacts.push({ t: 'trade', a, b, until: 0 }));
  [['ENG', 'BEL'], ['FRA', 'BEL']].forEach(([a, b]) => G.pacts.push({ t: 'guar', a, b, until: 0 }));
  [['GER', 'POL', 700], ['SOV', 'POL', 1500], ['SOV', 'FIN', 2000]].forEach(([a, b, d]) => G.pacts.push({ t: 'nap', a, b, until: d }));
  const rel = [['GER', 'ITA', 15], ['GER', 'AUT', -20], ['GER', 'FRA', -30], ['GER', 'POL', -10], ['GER', 'CZE', -30], ['GER', 'SOV', -30], ['JAP', 'CHI', -50], ['JAP', 'SOV', -30], ['JAP', 'USA', -20], ['ENG', 'FRA', 30], ['ENG', 'USA', 30], ['FRA', 'ITA', -10], ['ENG', 'ITA', -20], ['ITA', 'ETH', -80], ['ITA', 'YUG', -20], ['ITA', 'GRE', -15], ['HUN', 'ROM', -40], ['HUN', 'CZE', -40], ['HUN', 'YUG', -25], ['BUL', 'ROM', -20], ['BUL', 'GRE', -25], ['POL', 'LIT', -40], ['POL', 'CZE', -20], ['SOV', 'FIN', -20], ['SOV', 'ROM', -25], ['CHI', 'PRC', -50], ['BOL', 'PAR', -50], ['PRU', 'ECU', -30], ['GRE', 'TUR', 10], ['USA', 'MEX', 10], ['USA', 'PHI', 30], ['SOV', 'MON', 40], ['JAP', 'MAN', 40], ['ARG', 'CHL', -10], ['SOV', 'CHI', 10], ['GER', 'CHI', 20], ['GER', 'JAP', 15]];
  rel.forEach(([a, b, v]) => addRel(a, b, v));
  // the Second Italo-Ethiopian War is already raging
  const w = declareWar('ITA', 'ETH', [{ by: 'ITA', vs: 'ETH', type: 'annex' }], 'Second Italo-Ethiopian War', true); G.tension = 8; C('ITA').infamy = 8;
  for (const a of armiesOf('ETH')) for (const d of a.divs) { d.str = 0.5; d.org = 0.5; } PN('Gondar').ctrl = 'ITA'; PN('Harar').ctrl = 'ITA';
  const exp = armiesOf('ITA').slice(-3); exp.forEach((a, i) => { a.loc = PNAME[i === 2 ? 'Mogadishu' : 'Asmara']; a.name = `Italian East Africa Corps ${i + 1}`; });
  // garrisons for the empires
  const gar = [['ENG', 'Cairo', 0], ['ENG', 'Alexandria', 4], ['ENG', 'Singapore', 3], ['ENG', 'Jerusalem', 2], ['ENG', 'Hong Kong', 1], ['ENG', 'Khartoum', 2], ['ENG', 'Rangoon', 2], ['ENG', 'Nairobi', 2], ['FRA', 'Algiers', 4], ['FRA', 'Tunis', 3], ['FRA', 'Hanoi', 3], ['FRA', 'Damascus', 2], ['FRA', 'Dakar', 2], ['FRA', 'Saigon', 2], ['ITA', 'Tripoli', 4], ['ITA', 'Benghazi', 2], ['JAP', 'Keijo', 3], ['JAP', 'Dairen', 4], ['JAP', 'Taihoku', 2], ['JAP', 'Mukden', 6], ['JAP', 'Harbin', 4], ['HOL', 'Batavia', 3], ['HOL', 'Palembang', 1], ['USA', 'Honolulu', 2], ['USA', 'Manila', 2], ['BEL', 'Léopoldville', 1], ['POR', 'Luanda', 1], ['POR', 'Lourenço Marques', 1], ['SPA', 'Tetuan', 4], ['AST', 'Port Moresby', 1], ['SOV', 'Vladivostok', 6], ['SOV', 'Chita', 4], ['SOV', 'Baku', 3], ['SOV', 'Tashkent', 2], ['SOV', 'Leningrad', 6], ['SOV', 'Kiev', 8], ['SOV', 'Minsk', 8], ['SOV', 'Odessa', 4]];
  gar.forEach(([t, n, k]) => { if (!k) return; const a = newArmy(C(t), PNAME[n]); for (let i = 0; i < k; i++) a.divs.push({ t: t === 'SPA' ? 'inf' : i % 5 === 4 ? 'cav' : 'inf', str: 1, org: 1, xp: t === 'SPA' ? 0.4 : 0 }); a.garrison = true; });
  PN('Metz').fort = 4; PN('Lille').fort = 1; PN('Karlsbad').fort = 3; PN('Reichenberg').fort = 3; PN('Viipuri').fort = 2; PN('Valletta').fort = 3; PN('Singapore').fort = 2; PN('Bern').fort = 3; PN('Essen').fort = 0;
  claimCache(); warCache();
  G.timeline = TIMELINE.map(t => ({ d: dayOf(...t[0]), ev: t[1], to: t[2] }));
}
const TIMELINE = [[[1936, 7, 17], 'spanish_civil_war', 'SPA'], [[1936, 8, 10], 'spain_intervention', 'GER'], [[1936, 8, 14], 'spain_intervention', 'ITA'], [[1936, 12, 11], 'abdication', 'ENG'], [[1936, 12, 12], 'xian_incident', 'CHI'], [[1936, 8, 1], 'olympics', 'GER'], [[1937, 7, 7], 'marco_polo', 'JAP'], [[1939, 5, 11], 'khalkhin_gol', 'SOV'], [[1938, 3, 18], 'oil_expropriation', 'MEX'], [[1937, 11, 10], 'estado_novo', 'BRA'], [[1936, 8, 4], 'metaxas', 'GRE'], [[1938, 2, 10], 'royal_dictatorship', 'ROM'], [[1941, 8, 14], 'atlantic_charter', 'USA']];

// ---------- events ----------
const hostileNeighbour = c => { for (const p of provsOf(c.tag)) for (const e of NB[p.id]) { const o = P(e.to).owner; if (!e.sea && o !== c.tag && ok(o) && !friendly(c.tag, o) && !atWar(c.tag, o) && opinion(c.tag, o) < 0) return o; } return null; };
const EVENTS = {
  spanish_civil_war: { title: 'The Generals Rise', icon: '⚔️', desc: 'Garrisons in Morocco and across Spain have risen against the Republic. General Franco is flying to Tetuán to take command of the Army of Africa. Spain is at war with itself.',
    trigger: c => c.exists && !isAtWar(c.tag) && c.ideology !== 'fas', options: [
      { name: 'The Republic will defend itself!', eff: { flag: 'spain_cw', ws: 20, units: { mil: 8 }, civilwar: { ideo: 'fas', name: 'Nationalist Spain', frac: 0.5, seed: 'Seville', gens: [['Francisco Franco', 4, 'off'], ['Emilio Mola', 3, 'mtn'], ['Juan Yagüe', 3, 'off']] }, fn: c => { for (const a of armiesAt(PNAME.Tetuan)) { const r = alive().find(k => k.civilOf === 'SPA'); if (r) { a.owner = r.tag; a.gen = null; a.loc = r.capital; } } const r = alive().find(k => k.civilOf === 'SPA'); if (r && PN('Tetuan').owner === 'SPA') { PN('Tetuan').owner = r.tag; PN('Tetuan').ctrl = r.tag; } } }, ai: 1 },
      { name: 'Join the rising — Arriba España!', eff: { flag: 'spain_cw', setIdeo: 'fas', ws: 20, civilwar: { ideo: 'dem', name: 'Republican Spain', frac: 0.5, seed: 'Barcelona', gens: [['José Miaja', 3, 'urban'], ['Vicente Rojo', 4, 'def']] } }, ai: 0 }] },
  spain_intervention: { title: 'War in Spain', icon: '✈️', desc: 'The Spanish generals beg for transport aircraft, arms and men. Spain could be a proving ground for our new weapons — and a friendly regime on the Pyrenees.', trigger: c => c.ideology === 'fas' && alive().some(k => k.civilOf === 'SPA'), options: [
      { name: 'Send aircraft, tanks and "volunteers".', eff: { fn: c => { const t = spainSide('fas')(c); if (t) { aidTo(() => t, { arms: 300, artillery: 50, aircraft: 150, tanks: 30 })(c); spawnDivisions(t, 'inf', 2, t.capital); } }, tip: 'The Nationalists receive arms, aircraft and two divisions', spirit: [['volunteer_veterans', 1500]], tension: 2 }, ai: 5 },
      { name: 'This is not our affair.', eff: { stab: 2 }, ai: 1 }] },
  abdication: { title: 'The Abdication Crisis', icon: '👑', desc: 'King Edward VIII is determined to marry Mrs Simpson, a twice-divorced American. The Cabinet, the Church and the Dominions will not have it.', trigger: c => c.ideology === 'dem', options: [
      { name: 'The King must go. Long live George VI.', eff: { stab: 3, pp: 30 }, ai: 5 }, { name: 'Let him marry; the Empire will adjust.', eff: { stab: -6, ideo: { aut: 5 }, ig: { devout: { appr: -5 } } }, ai: 0 }] },
  xian_incident: { title: 'The Xi\'an Incident', icon: '🏯', desc: 'Generalissimo Chiang has been kidnapped by his own generals, who demand an end to the civil war and a united front against Japan.', trigger: c => ok('PRC') && !atWar('CHI', 'PRC'), options: [
      { name: 'Agree to a united front.', eff: { nap: 'PRC', ws: 10, stab: 5, cflag: 'united_front' }, ai: 5 }, { name: 'Never. Crush the mutineers.', eff: { stab: -10, ig: { army: { appr: -5 } } }, ai: 1 }] },
  olympics: { title: 'The Olympic Games', icon: '🏅', desc: 'The world\'s athletes — and its newsreel cameras — arrive in our capital.', trigger: c => !isAtWar(c.tag), options: [{ name: 'A triumph of organisation.', eff: { spirit: [['national_pride', 400]], infl: 30 }, ai: 1 }] },
  marco_polo: { title: 'Incident at the Marco Polo Bridge', icon: '🌉', desc: 'Shots have been exchanged between our garrison and Chinese troops near Peiping. The Army demands a decisive response.', trigger: c => ok('CHI') && !atWar('JAP', 'CHI') && c.ideology !== 'dem' && !c.focus.done.j_china, options: [
      { name: 'Chastise China!', eff: { fn: c => { const f = focusById(c, 'j_china'); c.focus.done.j_china = G.day; if (c.focus.cur === 'j_china') c.focus.cur = null; applyEff(c, f.eff); }, tip: 'War with China', ws: 10 }, ai: 6 }, { name: 'Settle it locally.', eff: { ig: { army: { appr: -6 } }, stab: 2 }, ai: 1 }] },
  khalkhin_gol: { title: 'Clash at Khalkhin Gol', icon: '🐎', desc: 'Japanese and Manchukuoan troops have crossed into Mongolia. A border skirmish is turning into a battle.', trigger: c => ok('JAP') && !atWar('SOV', 'JAP') && !hasPact('nap', 'SOV', 'JAP'), options: [
      { name: 'Send Zhukov to teach them a lesson.', eff: { rel: { JAP: -20 }, tension: 2, fn: c => { const g = c.gens.find(x => x.name.includes('Zhukov')); if (g && g.skill < 5) g.skill++; C('JAP').ws -= 5; }, tip: 'Zhukov gains experience; Japan thinks twice about striking north' }, ai: 5 }, { name: 'Avoid escalation.', eff: { stab: -2 }, ai: 1 }] },
  oil_expropriation: { title: 'The Oil Expropriation', icon: '🛢️', desc: 'Foreign oil companies defy our courts. The President could seize the fields for the nation.', trigger: c => !isAtWar(c.tag), options: [
      { name: 'The oil is ours!', eff: { stab: 8, build: { oilr: 2 }, rel: { USA: -15, ENG: -30 }, ig: { union: { appr: 6 } } }, ai: 5 }, { name: 'Negotiate a compromise.', eff: { money: 4, rel: { USA: 10 } }, ai: 1 }] },
  estado_novo: { title: 'The Estado Novo', icon: '📜', desc: 'Citing a communist plot, the President cancels the elections and proclaims a new constitution.', trigger: c => c.ideology === 'aut', options: [{ name: 'A new state for a new Brazil.', eff: { law: ['oneparty', 'autocracy'], pp: 60, ideo: { aut: 10 } }, ai: 5 }, { name: 'Hold the elections after all.', eff: { setIdeo: 'dem', stab: -5 }, ai: 0 }] },
  metaxas: { title: 'The Fourth of August', icon: '🏛️', desc: 'General Metaxas asks the King to suspend parliament in the face of a general strike.', trigger: c => c.ideology !== 'dem' && c.ideology !== 'com', options: [{ name: 'Sign the decree.', eff: { law: 'autocracy', stab: 5, fort: ['Salonika'], general: ['Ioannis Metaxas', 3, 'def'] }, ai: 5 }, { name: 'Refuse.', eff: { ideo: { dem: 10 } }, ai: 1 }] },
  royal_dictatorship: { title: 'The Royal Dictatorship', icon: '👑', desc: 'King Carol tires of squabbling parties and the Iron Guard alike.', trigger: c => c.ideology === 'aut', options: [{ name: 'The King rules alone.', eff: { law: 'autocracy', pp: 50, ideo: { fas: -8 } }, ai: 5 }, { name: 'Bring the Guard into government.', eff: { ideo: { fas: 15 }, rel: { GER: 20 } }, ai: 1 }] },
  atlantic_charter: { title: 'The Atlantic Charter', icon: '⚓', desc: 'Aboard a warship off Newfoundland, the President and the British Prime Minister set out their aims for the post-war world.', trigger: c => ok('ENG') && isAtWar('ENG') && c.ideology === 'dem' && !atWar('USA', 'ENG'), options: [{ name: 'Sign it.', eff: { rel: { ENG: 30 }, ws: 8, rmspirit: 'isolationism' }, ai: 5 }] },
  mr_pact_sov: { title: 'A Pact with Berlin', icon: '🤝', desc: 'Ribbentrop has flown to Moscow. A secret protocol divides Eastern Europe into spheres of influence.', options: [{ name: 'A toast to the Führer\'s health.', eff: { claim: ['Chișinău', 'Viipuri', 'Tallinn', 'Riga', 'Kaunas'], core: ['Lwów', 'Równe', 'Brest-Litovsk', 'Baranowicze'], pp: 50 }, ai: 1 }] },
  end_appeasement: { title: 'Prague Has Fallen', icon: '🕯️', desc: 'Hitler has broken his word. The guarantees given at Munich are worthless, and the public mood has turned.', trigger: c => c.ideology === 'dem', options: [
      { name: 'No more concessions. Guarantee Poland.', eff: { rmspirit: ['appeasement'], guarantee: ['POL'], ws: 10, fn: c => { if (c.tag === 'FRA') removeSpirit(c, 'political_paralysis'); }, tip: 'France shakes off its paralysis' }, ai: 9 }, { name: 'It is still not worth a war.', eff: { stab: -5 }, ai: 1 }] },
  ideology_crisis: { title: 'The Regime Totters', icon: '🔥', desc: (c, d) => `${IDEO[d.ideo][0]} sentiment has swept the country. Crowds fill the squares and parts of the army waver.`, options: [
      { name: 'Hand over power.', eff: (c, d) => ({ setIdeo: d.ideo, stab: 5 }), ai: c => c.stab < 45 ? 3 : 1 },
      { name: 'Crush the movement.', eff: (c, d) => ({ stab: -12, rad: 0.1, ideo: { [c.ideology]: 14 }, spirit: [['martial_law', 365]] }), ai: 2 },
      { name: 'Let them try to take it.', eff: (c, d) => ({ civilwar: { ideo: d.ideo, frac: 0.4 } }), ai: c => c.stab < 30 ? 2 : 0 }] },
  uprising: { title: 'Uprising!', icon: '🔥', desc: 'Hunger, anger and agitators have done their work. Barricades are going up in the provinces.', options: [
      { name: 'Declare martial law.', eff: { spirit: [['martial_law', 540]], stab: 8, rad: -0.1 }, ai: 4 }, { name: 'Promise sweeping reforms.', eff: { rad: -0.15, pp: -80, ig: { union: { appr: 5 }, rural: { appr: 5 }, land: { appr: -5 }, ind: { appr: -5 } } }, ai: 3 },
      { name: 'Let the rebels come.', eff: c => ({ civilwar: { ideo: c.sup.com > c.sup.fas ? (c.ideology === 'com' ? 'dem' : 'com') : (c.ideology === 'fas' ? 'dem' : 'fas'), frac: 0.35 } }), ai: 0.5 }] },
  // ----- random events -----
  strike: { title: 'Strike Wave', icon: '✊', desc: 'Workers have downed tools across the industrial districts, demanding better pay and shorter hours.', trigger: c => c.rad > 0.2 && c.stats.emp > 2000 && c.laws.labor !== 'protections', mtth: 30, options: [
      { name: 'Meet their demands.', eff: { rad: -0.06, ig: { union: { appr: 5 }, ind: { appr: -4 } }, money: -2 }, ai: 2 }, { name: 'Send in the police.', eff: { spirit: [['strike_wave', 120]], rad: 0.04, ig: { union: { appr: -6 }, ind: { appr: 3 } } }, ai: 2 }] },
  boom: { title: 'Boom Times', icon: '📈', desc: 'Order books are full, credit is cheap and new firms open every week.', trigger: c => c.stab > 50 && !isAtWar(c.tag) && !hasSpirit(c, 'great_depression'), mtth: 90, options: [{ name: 'Excellent.', eff: { spirit: [['boom', 365]] }, ai: 1 }] },
  slump: { title: 'Bank Panic', icon: '📉', desc: 'A major bank has failed and depositors are queuing in the streets.', trigger: c => !isAtWar(c.tag) && c.laws.econ !== 'command', mtth: 140, options: [{ name: 'Bail out the banks.', eff: { money: -6, stab: 2 }, ai: 2 }, { name: 'Let the market correct itself.', eff: { spirit: [['slump', 300]] }, ai: 1 }] },
  bad_harvest: { title: 'Harvest Failure', icon: '🌾', desc: 'Drought has withered the fields. Grain prices are climbing.', trigger: c => c.stats.peas > 1500, mtth: 100, options: [{ name: 'Buy grain abroad for relief.', eff: { money: -4, spirit: [['bad_harvest', 120]] }, ai: 2 }, { name: 'They must tighten their belts.', eff: { spirit: [['bad_harvest', 240]], stab: -3 }, ai: 1 }] },
  good_harvest: { title: 'Bumper Harvest', icon: '🌾', desc: 'Perfect weather has given the best harvest in a generation.', trigger: c => true, mtth: 110, options: [{ name: 'A blessing.', eff: { spirit: [['good_harvest', 240]], stab: 2 }, ai: 1 }] },
  scandal: { title: 'Corruption Scandal', icon: '📰', desc: 'A minister has been caught with his hand in the till. The newspapers smell blood.', trigger: c => c.laws.speech !== 'outlawed', mtth: 80, options: [{ name: 'Sack him and move on.', eff: { pp: -40 }, ai: 2 }, { name: 'Suppress the story.', eff: { stab: -4, ig: { intel: { appr: -4 } } }, ai: 1 }] },
  border_incident: { title: 'Border Incident', icon: '🚧', desc: (c, d) => `Border guards have exchanged fire with a ${C(d.t).adj} patrol. Both capitals blame the other.`, trigger: c => !!hostileNeighbour(c), data: c => ({ t: hostileNeighbour(c) }), mtth: 70, options: [
      { name: 'Demand an apology.', eff: (c, d) => ({ rel: { [d.t]: -20 }, ws: 3, tension: 1 }), ai: 2 }, { name: 'Play it down.', eff: (c, d) => ({ rel: { [d.t]: 5 }, ig: { army: { appr: -3 } } }), ai: 2 }] },
  coup_plot: { title: 'Rumours of a Coup', icon: '🗡️', desc: 'Officers have been meeting in secret. The security services report talk of "restoring order".', trigger: c => c.ig.army.appr < -4 && !c.ig.army.gov && c.stab < 50, mtth: 24, options: [
      { name: 'Arrest the ringleaders.', eff: { stab: -4, ig: { army: { appr: -4, clout: -0.15 } }, pp: -30 }, ai: 2 }, { name: 'Bring the army into government.', eff: { fn: c => { c.ig.army.gov = true; }, tip: 'The Armed Forces join the government', ig: { army: { appr: 6 } } }, ai: 2 },
      { name: 'Ignore the rumours.', eff: { fn: c => { if (Math.random() < 0.5) { setIdeology(c, 'aut'); c.stab -= 10; } }, tip: '50% chance the army seizes power' }, ai: 0.5 }] },
  breakthrough: { title: 'Scientific Breakthrough', icon: '🔬', desc: 'A university laboratory announces a discovery that astonishes its rivals abroad.', trigger: c => c.stats.innov > 3, mtth: 70, options: [{ name: 'Fund them generously.', eff: { research: 35 }, ai: 1 }] },
  discovery: { title: 'Mineral Discovery', icon: '⛏️', desc: (c, d) => `Surveyors report rich new ${d.r} deposits near ${P(d.p).name}.`, trigger: c => heldBy(c.tag).length > 0, data: c => ({ p: pick(heldBy(c.tag)).id, r: pick(['coal', 'iron', 'oil', 'oil']) }), mtth: 130, options: [{ name: 'Splendid news.', eff: (c, d) => ({ fn: () => { P(d.p).res[d.r] = Math.min(6, P(d.p).res[d.r] + 1); }, tip: `${P(d.p).name} gains ${d.r} potential` }), ai: 1 }] },
  talent: { title: 'A Rising Star', icon: '🎖️', desc: 'A young staff officer has impressed everyone at this year\'s manoeuvres.', trigger: c => armiesOf(c.tag).length > c.gens.length, mtth: 50, options: [{ name: 'Promote him.', eff: { fn: c => { c.pp += 40; const g = hireGeneral(c); if (g) g.skill = Math.min(5, g.skill + 1); }, tip: 'Gain a talented general' }, ai: 1 }] },
  reform_demand: { title: 'Petition for Reform', icon: '🎓', desc: 'Professors, journalists and lawyers have signed an open letter demanding political liberties.', trigger: c => c.ig.intel.appr < -2 && c.ideology !== 'dem', mtth: 50, options: [{ name: 'Promise gradual change.', eff: { ideo: { dem: 5 }, ig: { intel: { appr: 5 } }, pp: -20 }, ai: 1 }, { name: 'Arrest the signatories.', eff: { ig: { intel: { appr: -5 } }, stab: 2, rad: 0.03 }, ai: 2 }] },
  agitation: { title: 'Radical Agitation', icon: '📣', desc: (c, d) => `${IDEO[d.i][0]} agitators draw ever larger crowds.`, trigger: c => c.rad > 0.15, data: c => ({ i: ['com', 'fas'].filter(i => i !== c.ideology).sort((a, b) => c.sup[b] - c.sup[a])[0] }), mtth: 45, options: [
      { name: 'Ban their meetings.', eff: (c, d) => ({ ideo: { [d.i]: -4 }, stab: -2 }), ai: 2 }, { name: 'Tolerate them.', eff: (c, d) => ({ ideo: { [d.i]: 6 } }), ai: 1 }] },
  investment: { title: 'Foreign Investors', icon: '💼', desc: 'A consortium from abroad offers to build factories and railways in return for generous concessions.', trigger: c => !c.major && c.lit < 0.7 && !isAtWar(c.tag) && c.laws.econ !== 'command', mtth: 80, options: [
      { name: 'Welcome them.', eff: { build: { textile: 1, tools: 1 }, infra: 1, spirit: [['foreign_capital', 720]] }, ai: 3 }, { name: 'Our resources are not for sale.', eff: { stab: 3, ig: { pb: { appr: 3 } } }, ai: 1 }] },
  disaster: { title: 'Natural Disaster', icon: '🌊', desc: (c, d) => `Floods have devastated the region around ${P(d.p).name}.`, trigger: c => heldBy(c.tag).length > 0, data: c => ({ p: pick(heldBy(c.tag)).id }), mtth: 150, options: [
      { name: 'Send relief at once.', eff: (c, d) => ({ money: -3, stab: 2, fn: () => { P(d.p).dmg = Math.min(0.6, P(d.p).dmg + 0.1); } }), ai: 2 }, { name: 'They will manage.', eff: (c, d) => ({ stab: -3, fn: () => { P(d.p).dmg = Math.min(0.6, P(d.p).dmg + 0.25); } }), ai: 1 }] },
  war_weariness: { title: 'War Weariness', icon: '🕯️', desc: 'Casualty lists grow longer and the queues for bread no shorter. People are asking what it is all for.', trigger: c => isAtWar(c.tag) && c.warExh > 40, mtth: 12, options: [
      { name: 'A propaganda offensive.', eff: { pp: -40, ws: 8 }, ai: 2 }, { name: 'Ease rationing.', eff: { money: -3, stab: 4 }, ai: 1 }, { name: 'They will endure.', eff: { stab: -5, rad: 0.05 }, ai: 1 }] },
  colonial_unrest: { title: 'Colonial Unrest', icon: '🌍', desc: 'Nationalists in the colonies are organising boycotts and demonstrations.', trigger: c => provsOf(c.tag).filter(p => !p.cores.includes(c.tag)).length > 5, mtth: 60, options: [
      { name: 'Send troops.', eff: { spirit: [['occupied_resistance', 365]], pp: -20 }, ai: 2 }, { name: 'Offer limited self-government.', eff: { stab: 2, ig: { land: { appr: -3 }, intel: { appr: 3 } }, pp: -40 }, ai: 1 }] },
  worlds_fair: { title: 'International Exposition', icon: '🎡', desc: 'Our pavilion is the talk of the world\'s fair.', trigger: c => c.major && !isAtWar(c.tag), mtth: 120, options: [{ name: 'Splendid.', eff: { infl: 40, spirit: [['national_pride', 300]] }, ai: 1 }] },
  refugees: { title: 'Refugees at the Border', icon: '🧳', desc: 'Scientists, artists and ordinary families fleeing persecution ask for asylum.', trigger: c => c.ideology === 'dem' && G.tension > 20, mtth: 60, options: [{ name: 'Give them shelter.', eff: { research: 20, fn: c => { P(c.capital).pop += 30; }, tip: 'Population and talent arrive' }, ai: 2 }, { name: 'We have troubles of our own.', eff: { stab: 1 }, ai: 1 }] },
  arms_deal: { title: 'Arms Dealers', icon: '🔫', desc: 'A discreet gentleman offers a shipment of surplus rifles and field guns — for gold.', trigger: c => !c.major && (isAtWar(c.tag) || G.tension > 30), mtth: 30, options: [{ name: 'Buy the lot.', eff: { money: -4, equip: { arms: 150, artillery: 30 } }, ai: 3 }, { name: 'Too expensive.', eff: {}, ai: 1 }] }
};
function queueEvent(id, tag, delay = 1, data) { G.evq.push({ id, tag, d: G.day + delay, data }); }
function fireEvent(id, tag, data) {
  const ev = EVENTS[id], c = C(tag); if (!ev || !c || !c.exists) return false; if (ev.trigger && !ev.trigger(c)) return false;
  data = data || (ev.data ? ev.data(c) : {}); const opts = ev.options.map(o => ({ o, eff: typeof o.eff === 'function' ? o.eff(c, data) : o.eff }));
  const run = x => { applyEff(c, x.eff); claimCache(); };
  if (c.ai || tag !== G.player) { let tot = 0; const ws = opts.map(x => { const w = typeof x.o.ai === 'function' ? x.o.ai(c) : x.o.ai === undefined ? 1 : x.o.ai; tot += w; return w; }); let r = Math.random() * tot; for (let i = 0; i < opts.length; i++) { r -= ws[i]; if (r <= 0) { run(opts[i]); break; } } return true; }
  { let bi = 0, bw = -1; opts.forEach((x, i) => { const w = typeof x.o.ai === 'function' ? x.o.ai(c) : x.o.ai === undefined ? 1 : x.o.ai; if (w > bw) { bw = w; bi = i; } }); var _def = bi; }
  UIH.popup({ def: _def, days: ev.days || 30, title: ev.title, icon: ev.icon, desc: typeof ev.desc === 'function' ? ev.desc(c, data) : ev.desc, options: opts.map(x => ({ name: x.o.name, tip: effText(x.eff, c), fn: () => run(x) })) }); return true;
}
function eventsDaily() {
  if (G.timeline) { for (const t of G.timeline) if (t.d === G.day && ok(t.to)) fireEvent(t.ev, t.to); }
  if (G.evq.length) { const due = G.evq.filter(e => e.d <= G.day); if (due.length) { G.evq = G.evq.filter(e => e.d > G.day); for (const e of due) fireEvent(e.id, e.tag, e.data); } }
}
const RANDOM_EVENTS = Object.keys(EVENTS).filter(k => EVENTS[k].mtth);
function eventsMonthly(c) {
  if (c.capitulated) return; const start = rint(0, RANDOM_EVENTS.length - 1);
  for (let i = 0; i < RANDOM_EVENTS.length; i++) { const id = RANDOM_EVENTS[(start + i) % RANDOM_EVENTS.length], ev = EVENTS[id]; if ((c.flags['ev_' + id] || -999) > G.day - 500) continue; if (Math.random() > 1 / ev.mtth) continue; if (ev.trigger && !ev.trigger(c)) continue; c.flags['ev_' + id] = G.day; fireEvent(id, c.tag); return; }
}

// ---------- decisions ----------
const D = (name, cat, cost, desc, eff, x = {}) => Object.assign({ name, cat, cost, desc, eff }, x);
const hasProvs = (c, list) => list.every(n => PN(n).owner === c.tag);
const form = (name, adj, color) => c => { c.name = name; c.adj = adj; if (color) c.color = color; provsOf(c.tag).forEach(p => { if (!p.cores.includes(c.tag)) p.cores.push(c.tag); }); logMsg(`${name} has been proclaimed!`, 'world'); UIH.mapDirty(); };
const friendAtWar = c => alive().filter(k => k.tag !== c.tag && isAtWar(k.tag) && !atWar(c.tag, k.tag) && (friendly(c.tag, k.tag) || ((c.major || !c.ai) && opinion(c.tag, k.tag) > 40)) && !k.capitulated).sort((a, b) => opinion(c.tag, b.tag) - opinion(c.tag, a.tag))[0];
const civilSide = c => alive().find(k => k.civilOf && k.ideology === c.ideology && isAtWar(k.tag)) || alive().find(k => !k.civilOf && k.ideology === c.ideology && k.tag !== c.tag && G.wars.some(w => w.civil && (w.att.includes(k.tag) || w.def.includes(k.tag))));
const DECISIONS = {
  public_works: D('Public Works Programme', 'Economy', 60, 'Put the unemployed to work on roads and railways.', { build: { construction: 1 }, infra: 1, rad: -0.02 }, { cd: 400, ai: 0.1 }),
  stimulus: D('Cheap Credit', 'Economy', 40, 'The central bank floods industry with cheap loans.', { money: -5, spirit: [['stimulus', 365]] }, { cd: 500, avail: c => c.laws.econ === 'command' ? 'Pointless in a command economy' : '', ai: 0.03 }),
  austerity: D('Austerity Budget', 'Economy', 30, 'Slash spending to balance the books.', { spirit: [['austerity', 365]], money: 4 }, { cd: 500, visible: c => c.money < 0, ai: 0.25 }),
  war_bonds: D('Issue War Bonds', 'Economy', 30, 'Ask the people to lend their savings to the war effort.', { money: 12, spirit: [['war_bonds', 365]] }, { cd: 365, avail: c => isAtWar(c.tag) ? '' : 'Requires being at war', ai: 0.3 }),
  prospect: D('Geological Survey', 'Economy', 50, 'Send surveyors into the hinterland in search of coal, iron and oil.', { money: -2, fn: c => { if (Math.random() < 0.6 && heldBy(c.tag).length) { const p = pick(heldBy(c.tag)), r = pick(['coal', 'iron', 'oil']); p.res[r] = Math.min(6, p.res[r] + 1); if (c.tag === G.player) UIH.notify(`Surveyors find ${r} near ${p.name}!`, 'good'); } else if (c.tag === G.player) UIH.notify('The surveyors return empty-handed.', 'bad'); }, tip: '60% chance to find a new deposit' }, { cd: 240, ai: 0.04 }),
  land_reform: D('Land Reform', 'Economy', 100, 'Break up the great estates.', { spirit: 'land_reform', ig: { land: { appr: -8, clout: -0.25 }, rural: { appr: 8 } } }, { once: true, avail: c => c.ig.land.gov ? 'The Landowners are in government' : '', ai: 0.02 }),
  nationalise: D('Nationalise Key Industries', 'Economy', 120, 'Mines, railways and steel pass into public hands.', { money: 10, ig: { ind: { appr: -10, clout: -0.2 }, union: { appr: 6 } }, law: 'interventionism' }, { once: true, avail: c => c.laws.econ === 'laissez' || c.laws.econ === 'traditionalism' ? '' : 'Requires Laissez-Faire or Traditionalism', ai: 0.01 }),
  foreign_engineers: D('Hire Foreign Engineers', 'Economy', 50, 'Experts from the industrial powers train our workforce.', { money: -4, research: 45 }, { cd: 500, visible: c => !c.major, ai: 0.06 }),
  propaganda: D('Propaganda Campaign', 'Politics', 50, 'Posters, parades and the wireless.', { spirit: [['propaganda', 240]] }, { cd: 300, ai: 0.08 }),
  suppress: D('Suppress the Radicals', 'Politics', 60, 'Round up the usual suspects.', { rad: -0.1, legit: -5, ig: { intel: { appr: -4 }, union: { appr: -4 } } }, { cd: 240, avail: c => c.laws.security === 'no_police' ? 'Requires a National Guard or Secret Police' : '', visible: c => c.rad > 0.15, ai: 0.2 }),
  amnesty: D('General Amnesty', 'Politics', 40, 'Open the prisons and start afresh.', { rad: -0.05, stab: 3, ig: { intel: { appr: 4 }, army: { appr: -3 } } }, { cd: 700, visible: c => c.ideology !== 'dem', ai: 0.02 }),
  rally: D('Rally Round the Flag', 'Politics', 50, 'Appeal to the nation in its hour of danger.', { ws: 10, stab: 3 }, { cd: 300, avail: c => isAtWar(c.tag) || G.tension > 50 ? '' : 'Requires war or world tension 50', ai: 0.3 }),
  snap_election: D('Call a Snap Election', 'Politics', 40, 'Go to the country early.', { fn: c => { c.nextElection = G.day + 30; }, tip: 'An election is held in 30 days' }, { cd: 720, visible: c => hasElections(c), ai: 0 }),
  purge_opposition: D('Purge the Opposition', 'Politics', 80, 'There is room for only one party.', { fn: c => shiftSupport(c, { [c.ideology]: 10 }), tip: 'Support for the ruling ideology +10%', stab: -4, rad: 0.03 }, { cd: 400, visible: c => c.ideology !== 'dem', ai: 0.1 }),
  state_visit: D('State Visit', 'Politics', 25, 'Pomp, banquets and quiet conversations.', { infl: 30 }, { cd: 200, ai: 0.05 }),
  integrate: D('Integrate a Territory', 'Politics', 120, 'Extend full citizenship and administration to a loyal, developed territory.', { fn: c => { const p = provsOf(c.tag).filter(q => !q.cores.includes(c.tag)).sort((a, b) => b.dev - a.dev || a.pop - b.pop)[0]; if (p) { p.cores.push(c.tag); if (c.tag === G.player) UIH.notify(`${p.name} is now a core territory.`, 'good'); } }, tip: 'Our most developed non-core province becomes a core' }, { cd: 500, avail: c => provsOf(c.tag).some(q => !q.cores.includes(c.tag)) ? '' : 'No non-core territory', ai: 0.02 }),
  anti_corruption: D('Anti-Corruption Campaign', 'Politics', 150, 'Shoot a few quartermasters and audit the rest.', { rmspirit: 'corruption', stab: -6, ig: { army: { appr: -5 }, land: { appr: -4 } } }, { once: true, visible: c => hasSpirit(c, 'corruption'), ai: 0.03 }),
  officer_schools: D('Reform the Officer Corps', 'Military', 150, 'Promotion by examination, not by patronage.', { rmspirit: ['inept_officers', 'rigid_command', 'methodical_battle', 'unready_army', 'peacetime_army', 'obsolete_army'], ig: { army: { appr: -4 } }, money: -4 }, { once: true, visible: c => ['inept_officers', 'rigid_command', 'methodical_battle', 'unready_army', 'peacetime_army', 'obsolete_army'].some(s => hasSpirit(c, s)), avail: c => c.techs.m_doc1 ? '' : 'Requires the Operational Doctrine technology', ai: 0.05 }),
  fortify: D('Fortify the Border', 'Military', 50, 'Bunkers, wire and anti-tank ditches.', { money: -3, fort: 1 }, { cd: 300, ai: 0.05 }),
  war_games: D('Grand Manoeuvres', 'Military', 40, 'A full-scale exercise for the whole army.', { fn: c => armiesOf(c.tag).forEach(a => a.divs.forEach(d => d.xp = Math.min(1, d.xp + 0.1))), tip: 'All divisions gain experience', money: -2 }, { cd: 365, avail: c => isAtWar(c.tag) ? 'Not while at war' : '', ai: 0.05 }),
  staff_college: D('Found a Staff College', 'Military', 60, 'Train the next generation of commanders.', { fn: c => { c.pp += 40; const g = hireGeneral(c); if (g) g.skill = Math.max(g.skill, 3); }, tip: 'Gain a general of at least skill 3' }, { cd: 500, ai: 0.05 }),
  emergency_mob: D('Levée en Masse', 'Military', 50, 'Arm everyone who can hold a rifle.', { units: { mil: 8 }, stab: -5, manpower: 60 }, { cd: 300, avail: c => enemiesOf(c.tag).some(e => heldBy(e).length && G.P.some(p => p.owner === c.tag && p.ctrl === e)) ? '' : 'Requires enemy troops on our soil', ai: 0.6 }),
  requisition: D('Requisition Civilian Stocks', 'Military', 40, 'Hunting rifles, lorries, horses — everything.', { equip: { arms: 200, autos: 40 }, stab: -4 }, { cd: 365, avail: c => isAtWar(c.tag) ? '' : 'Requires being at war', ai: 0.3 }),
  lend_lease: D('Send Military Aid', 'Foreign', 40, 'Ship a share of our stockpiles to a friend at war.', { fn: c => { const t = friendAtWar(c); if (!t) return; for (const g of ['arms', 'artillery', 'tanks', 'aircraft', 'autos']) { const v = c.stock[g] * 0.15; c.stock[g] -= v; t.stock[g] += v; } addRel(c.tag, t.tag, 20); logMsg(`${c.name} sends military aid to ${t.name}.`, 'world'); }, tip: '15% of our equipment stockpile goes to the friend who needs it most' }, { cd: 120, avail: c => friendAtWar(c) ? (c.tag === 'USA' && !G.flags.lendlease && hasSpirit(c, 'isolationism') ? 'Blocked by Isolationism' : '') : 'No friendly country is at war', ai: 0.15, aiIf: c => c.major }),
  volunteers: D('Send Volunteers', 'Foreign', 60, 'Our "volunteers" will fight in a foreign civil war.', { fn: c => { const t = civilSide(c); if (!t) return; spawnDivisions(t, 'inf', 3, t.capital); t.stock.arms += 150; addRel(c.tag, t.tag, 30); logMsg(`${c.adj} volunteers arrive to fight for ${t.name}.`, 'world'); }, tip: 'Three divisions join our ideological brethren', manpower: -40, spirit: [['volunteer_veterans', 900]], tension: 1 }, { cd: 365, avail: c => civilSide(c) ? '' : 'No civil war with a side that shares our ideology', ai: 0.2, aiIf: c => c.major && c.ideology !== 'dem' }),
  atom_bomb: D('Deploy the Atomic Bomb', 'Military', 100, 'A single aircraft, a single bomb, a single city.', { fn: c => { const e = enemiesOf(c.tag).map(C).filter(k => !k.capitulated).sort((a, b) => countryStr(b.tag) - countryStr(a.tag))[0]; if (!e) return; const p = heldBy(e.tag).sort((a, b) => b.vp - a.vp)[0]; if (!p) return; p.dmg = 0.7; p.pop = Math.round(p.pop * 0.85); e.ws = Math.max(0, e.ws - 30); e.warExh = Math.min(100, e.warExh + 35); e.stab = Math.max(0, e.stab - 15); logMsg(`${c.name} drops an atomic bomb on ${p.name}. The world will never be the same.`, 'world'); checkCapitulation(e.tag); }, tip: 'Devastates the greatest city of our strongest enemy', spirit: 'nuclear_power', tension: 10 }, { cd: 150, visible: c => !!c.techs.p_bomb, avail: c => isAtWar(c.tag) ? '' : 'Requires being at war', ai: 0.5 }),
  form_scandinavia: D('Unite Scandinavia', 'Formable', 150, 'One crown from the North Cape to the Sound.', { fn: form('Scandinavia', 'Scandinavian', '#4a90c8'), spirit: 'great_power_union', tip: 'Become Scandinavia; all territory becomes core' }, { once: true, visible: c => ['SWE', 'NOR', 'DEN'].includes(c.tag), avail: c => hasProvs(c, ['Stockholm', 'Oslo', 'Copenhagen']) ? '' : 'Requires Stockholm, Oslo and Copenhagen', ai: 1 }),
  form_danubia: D('Restore the Danubian Monarchy', 'Formable', 150, 'The double eagle flies again over Vienna, Budapest and Prague.', { fn: form('Danubian Federation', 'Danubian', '#d8d0b0'), spirit: 'great_power_union', law: 'monarchy', tip: 'Become the Danubian Federation' }, { once: true, visible: c => ['AUT', 'HUN'].includes(c.tag), avail: c => hasProvs(c, ['Vienna', 'Budapest', 'Prague']) ? '' : 'Requires Vienna, Budapest and Prague', ai: 1 }),
  form_rome: D('Proclaim the Roman Empire', 'Formable', 200, 'Mare Nostrum is ours once more.', { fn: form('Roman Empire', 'Roman', '#8a2040'), spirit: 'great_power_union', tip: 'Become the Roman Empire' }, { once: true, visible: c => c.tag === 'ITA', avail: c => hasProvs(c, ['Rome', 'Athens', 'Tunis', 'Alexandria', 'Tripoli', 'Marseille']) ? '' : 'Requires Rome, Athens, Tunis, Alexandria, Tripoli and Marseille', ai: 1 }),
  form_colombia: D('Reunite Gran Colombia', 'Formable', 150, 'Bolívar\'s dream, a century late.', { fn: form('Gran Colombia', 'Colombian', '#e0b040'), spirit: 'great_power_union', tip: 'Become Gran Colombia' }, { once: true, visible: c => ['COL', 'VEN', 'ECU'].includes(c.tag), avail: c => hasProvs(c, ['Bogotá', 'Caracas', 'Quito']) ? '' : 'Requires Bogotá, Caracas and Quito', ai: 1 }),
  form_china: D('Proclaim a Reunified China', 'Formable', 150, 'One China, from the Amur to Hainan.', { fn: c => { removeSpirit(c, 'warlord_era'); removeSpirit(c, 'fragile_unity'); form(c.ideology === 'com' ? 'People\'s Republic of China' : 'Republic of China', 'Chinese')(c); }, spirit: 'great_power_union', tip: 'Warlordism ends; all territory becomes core' }, { once: true, visible: c => c.tag.startsWith('CHI') || c.tag.startsWith('PRC'), avail: c => hasProvs(c, ['Nanjing', 'Peiping', 'Mukden', 'Guangzhou', 'Chongqing', "Yan'an", 'Urumqi']) ? '' : 'Requires Nanjing, Peiping, Mukden, Guangzhou, Chongqing, Yan\'an and Urumqi', ai: 1 }),
  form_arabia: D('Unite the Arabs', 'Formable', 150, 'From the Gulf to the Mediterranean.', { fn: form('Arabia', 'Arab', '#3f8f5f'), spirit: 'great_power_union', tip: 'Become Arabia' }, { once: true, visible: c => ['SAU', 'IRQ', 'EGY'].includes(c.tag), avail: c => hasProvs(c, ['Riyadh', 'Baghdad', 'Damascus', 'Jerusalem']) ? '' : 'Requires Riyadh, Baghdad, Damascus and Jerusalem', ai: 1 })
};
function decisionState(c, id) {
  const d = DECISIONS[id]; if (d.visible && !d.visible(c)) return null; if (d.once && c.dcd[id]) return null;
  if ((c.dcd[id] || 0) > G.day) return `On cooldown until ${dateStr(c.dcd[id])}`; if (c.pp < d.cost) return `Requires ${d.cost} political power`; return d.avail ? d.avail(c) : '';
}
function takeDecision(c, id) { if (decisionState(c, id) !== '') return false; const d = DECISIONS[id]; c.pp -= d.cost; c.dcd[id] = G.day + (d.cd || 99999); applyEff(c, d.eff); claimCache(); if (c.major || d.cat === 'Formable') logMsg(`${c.name}: ${d.name}.`, 'info', [c.tag]); return true; }

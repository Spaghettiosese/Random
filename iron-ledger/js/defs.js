// Static definitions: goods, buildings, laws, interest groups, technologies, units.
'use strict';
const START_YEAR = 1936;
const GOODS = {
  grain: ['Grain', 20, 'staple'], fabric: ['Fabric', 20, 'staple'], wood: ['Wood', 20, 'staple'], coal: ['Coal', 30, 'industrial'], iron: ['Iron', 40, 'industrial'],
  oil: ['Oil', 50, 'industrial'], rubber: ['Rubber', 50, 'industrial'], steel: ['Steel', 60, 'industrial'], tools: ['Tools', 50, 'industrial'], chemicals: ['Chemicals', 50, 'industrial'],
  electricity: ['Electricity', 30, 'industrial'], engines: ['Engines', 70, 'industrial'], clothes: ['Clothes', 35, 'consumer'], furniture: ['Furniture', 35, 'consumer'],
  luxuries: ['Luxuries', 50, 'consumer'], services: ['Services', 30, 'consumer'], autos: ['Automobiles', 100, 'consumer'],
  arms: ['Small Arms', 70, 'military'], artillery: ['Artillery', 90, 'military'], tanks: ['Tanks', 130, 'military'], aircraft: ['Aircraft', 140, 'military'], ships: ['Warships', 150, 'military']
};
const GOOD_IDS = Object.keys(GOODS);
const MIL_GOODS = ['arms', 'artillery', 'tanks', 'aircraft', 'ships'];
const GOOD_ICON = { grain: '🌾', fabric: '🧵', wood: '🪵', coal: '⚫', iron: '⛏️', oil: '🛢️', rubber: '🌴', steel: '🔩', tools: '🔧', chemicals: '⚗️', electricity: '⚡', engines: '⚙️', clothes: '👔', furniture: '🪑', luxuries: '☕', services: '🏬', autos: '🚗', arms: '🔫', artillery: '💣', tanks: '🛡️', aircraft: '✈️', ships: '⚓' };
// Per 1,000k people per week: [base, extra at full wealth]
const NEEDS = { grain: [30, 4], clothes: [5, 10], furniture: [3, 7], services: [5, 20], luxuries: [2, 10], coal: [3, 2], electricity: [1, 9], autos: [0, 2.5], oil: [0.5, 3.5] };
const SUBSIST = { grain: 88, fabric: 9, wood: 9, luxuries: 3 }; // per 1,000k subsistence workers
const EMP = 50; // thousand workers per building level

// Buildings. pms: [name, tech|null, inputs, outputs]
const BLD = {
  farm: { name: 'Grain Farms', cat: 'rural', cost: 120, pms: [['Traditional Farming', null, {}, { grain: 32 }], ['Fertilised Fields', 'p_fert', { tools: 2, chemicals: 3 }, { grain: 52 }], ['Tractor Farming', 'p_tractors', { tools: 3, chemicals: 5, engines: 2, oil: 2 }, { grain: 78 }]] },
  ranch: { name: 'Livestock & Fibre', cat: 'rural', cost: 120, pms: [['Open Range', null, {}, { fabric: 26, grain: 5 }], ['Managed Herds', 'p_fert', { tools: 2 }, { fabric: 42, grain: 8 }]] },
  plantation: { name: 'Plantations', cat: 'rural', cost: 120, pms: [['Hand Picking', null, {}, { luxuries: 24 }], ['Estate Agriculture', 'p_fert', { tools: 2, chemicals: 2 }, { luxuries: 40 }]] },
  rubberp: { name: 'Rubber Plantations', cat: 'rural', res: 'rubber', cost: 140, pms: [['Tapping', null, {}, { rubber: 26 }], ['Estate Tapping', 'p_fert', { tools: 2 }, { rubber: 40 }]] },
  logging: { name: 'Logging Camps', cat: 'rural', cost: 100, pms: [['Hand Saws', null, {}, { wood: 40 }], ['Power Saws', 'p_mech_mining', { tools: 3 }, { wood: 62 }]] },
  coalm: { name: 'Coal Mines', cat: 'mine', res: 'coal', cost: 160, pms: [['Pick & Shovel', null, {}, { coal: 40 }], ['Mechanised Mining', 'p_mech_mining', { tools: 3, electricity: 3 }, { coal: 66 }]] },
  ironm: { name: 'Iron Mines', cat: 'mine', res: 'iron', cost: 160, pms: [['Pick & Shovel', null, {}, { iron: 36 }], ['Mechanised Mining', 'p_mech_mining', { tools: 3, electricity: 3 }, { iron: 58 }]] },
  oilr: { name: 'Oil Rigs', cat: 'mine', res: 'oil', cost: 200, pms: [['Derricks', null, { tools: 2 }, { oil: 36 }], ['Deep Drilling', 'p_deepdrill', { tools: 4, steel: 2 }, { oil: 62 }]] },
  steel: { name: 'Steel Mills', cat: 'heavy', cost: 260, pms: [['Bessemer Process', null, { iron: 30, coal: 25 }, { steel: 45 }], ['Open Hearth', 'p_openhearth', { iron: 40, coal: 25 }, { steel: 66 }], ['Electric Arc', 'p_arc', { iron: 46, coal: 10, electricity: 15 }, { steel: 92 }]] },
  tools: { name: 'Tooling Workshops', cat: 'heavy', cost: 200, pms: [['Forges', null, { steel: 15, wood: 10 }, { tools: 40 }], ['Precision Tooling', 'p_precision', { steel: 20, electricity: 5 }, { tools: 66 }]] },
  chem: { name: 'Chemical Plants', cat: 'heavy', cost: 240, pms: [['Coal Tar Chemistry', null, { coal: 16 }, { chemicals: 30 }], ['Petrochemistry', 'p_petro', { oil: 14 }, { chemicals: 48 }]] },
  synth: { name: 'Synthetic Plants', cat: 'heavy', cost: 300, tech: 'p_synthetic', pms: [['Synthetic Rubber', null, { coal: 20, chemicals: 10 }, { rubber: 24 }], ['Synthetic Fuel', null, { coal: 40 }, { oil: 26 }]] },
  power: { name: 'Power Plants', cat: 'heavy', cost: 220, pms: [['Coal-Fired', null, { coal: 20 }, { electricity: 50 }], ['Oil-Fired', 'p_petro', { oil: 12 }, { electricity: 56 }], ['Hydroelectric', 'p_hydro', {}, { electricity: 46 }]] },
  engines: { name: 'Motor Works', cat: 'heavy', cost: 280, pms: [['Workshop Assembly', null, { steel: 20, tools: 5 }, { engines: 25 }], ['Assembly Lines', 'p_assembly', { steel: 30, tools: 8, electricity: 8 }, { engines: 46 }]] },
  autos: { name: 'Automobile Plants', cat: 'heavy', cost: 300, pms: [['Coachbuilding', null, { engines: 15, steel: 15, rubber: 8 }, { autos: 20 }], ['Mass Production', 'p_assembly', { engines: 25, steel: 25, rubber: 14, electricity: 8 }, { autos: 40 }]] },
  textile: { name: 'Textile Mills', cat: 'light', cost: 160, pms: [['Steam Looms', null, { fabric: 35 }, { clothes: 40 }], ['Electric Looms', 'p_electrification', { fabric: 52, electricity: 6 }, { clothes: 66 }]] },
  furniture: { name: 'Furniture Works', cat: 'light', cost: 160, pms: [['Carpentry', null, { wood: 30, tools: 2 }, { furniture: 40 }], ['Powered Lathes', 'p_electrification', { wood: 42, tools: 4, electricity: 4 }, { furniture: 62 }]] },
  urban: { name: 'Service Districts', cat: 'light', cost: 140, pms: [['Gaslit Streets', null, { coal: 2 }, { services: 44 }], ['Electrified City', 'p_electrification', { electricity: 9 }, { services: 70 }]] },
  arms: { name: 'Arms Factories', cat: 'military', cost: 260, pms: [['Hand Fitting', null, { steel: 12, tools: 6 }, { arms: 20 }], ['Stamped Parts', 'p_precision', { steel: 18, tools: 8, electricity: 5 }, { arms: 36 }]] },
  artyf: { name: 'Artillery Foundries', cat: 'military', cost: 280, pms: [['Cast Guns', null, { steel: 20, tools: 6 }, { artillery: 14 }], ['Forged Guns', 'p_precision', { steel: 28, tools: 8, chemicals: 5 }, { artillery: 25 }]] },
  tankp: { name: 'Tank Plants', cat: 'military', cost: 340, tech: 'm_tank1', pms: [['Batch Production', null, { steel: 25, engines: 12 }, { tanks: 8 }], ['Line Production', 'p_assembly', { steel: 36, engines: 18, electricity: 8 }, { tanks: 15 }]] },
  aircraftp: { name: 'Aircraft Plants', cat: 'military', cost: 340, pms: [['Hand-Built Airframes', null, { engines: 14, steel: 8, rubber: 4 }, { aircraft: 8 }], ['Flow Production', 'p_assembly', { engines: 22, steel: 12, rubber: 6, electricity: 8 }, { aircraft: 15 }]] },
  shipyard: { name: 'Naval Shipyards', cat: 'military', cost: 360, coastal: true, pms: [['Slipways', null, { steel: 35, engines: 8 }, { ships: 6 }], ['Welded Hulls', 'p_arc', { steel: 46, engines: 12, electricity: 6 }, { ships: 11 }]] },
  admin: { name: 'Government Offices', cat: 'gov', cost: 150, pms: [['Clerks', null, {}, {}]] },
  university: { name: 'Universities', cat: 'gov', cost: 250, pms: [['Faculties', null, {}, {}]] },
  construction: { name: 'Construction Sector', cat: 'gov', cost: 200, pms: [['Timber Frames', null, { wood: 20, tools: 5 }, {}], ['Steel Frames', 'p_steelframe', { steel: 14, tools: 8, wood: 10 }, {}], ['Prefabrication', 'p_prefab', { steel: 20, tools: 10, electricity: 8, engines: 3 }, {}]] },
  railway: { name: 'Railways', cat: 'gov', cost: 220, pms: [['Steam Trains', null, { coal: 5 }, {}]] },
  port: { name: 'Ports', cat: 'gov', cost: 180, coastal: true, pms: [['Docks', null, {}, {}]] }
};
const BLD_IDS = Object.keys(BLD);
const CONSTR_PTS = [5, 8, 12];
const CAT_NAME = { rural: 'Agriculture', mine: 'Extraction', heavy: 'Heavy Industry', light: 'Light Industry', military: 'War Industry', gov: 'Government' };

const IGS = {
  ind: ['Industrialists', '🏭'], land: ['Landowners', '🏰'], union: ['Trade Unions', '✊'], army: ['Armed Forces', '🎖️'],
  intel: ['Intelligentsia', '🎓'], pb: ['Petite Bourgeoisie', '🏪'], rural: ['Rural Folk', '🚜'], devout: ['Devout', '⛪']
};
const IG_IDS = Object.keys(IGS);
const IDEO = { dem: ['Democratic', '#3d7fd9'], fas: ['Fascist', '#7a4b2a'], com: ['Communist', '#c0392b'], aut: ['Authoritarian', '#7f8c8d'] };

// Laws: cat -> { name, laws: { id: [name, effects, stances, extra] } }
const LAWS = {
  gov: { name: 'Governance', laws: {
    monarchy: ['Monarchy', { legit: 10 }, { land: 2, devout: 1, army: 1, intel: -2, union: -1 }],
    presidential: ['Presidential Republic', { pp: 0.1 }, { intel: 1, ind: 1, pb: 1 }],
    parliamentary: ['Parliamentary System', { stab: 5 }, { intel: 2, union: 1, ind: 1, land: -1 }],
    oneparty: ['Single-Party State', { pp: 0.25, rad: -0.1 }, { army: 1, pb: 1, intel: -2, union: -1 }],
    council: ['Council Republic', { build: 0.05, rad: -0.1 }, { union: 2, intel: 1, ind: -2, land: -2, devout: -2 }],
    theocracy: ['Theocracy', { legit: 10, research: -0.15 }, { devout: 2, land: 1, intel: -2 }] } },
  power: { name: 'Distribution of Power', laws: {
    autocracy: ['Autocracy', { pp: 0.25 }, { army: 1, land: 1, intel: -2, union: -2 }],
    oligarchy: ['Oligarchy', { pp: 0.1, invest: 0.1 }, { ind: 1, land: 2, union: -2, rural: -1 }],
    census: ['Census Suffrage', { invest: 0.15 }, { ind: 2, pb: 1, union: -1, rural: -1 }],
    universal: ['Universal Suffrage', { stab: 8, legit: 5 }, { union: 2, intel: 1, rural: 1, land: -2, army: -1 }] } },
  econ: { name: 'Economic System', laws: {
    traditionalism: ['Traditionalism', { build: -0.25, output: -0.1 }, { land: 2, rural: 1, devout: 1, ind: -2 }],
    interventionism: ['Interventionism', { build: 0.05 }, { union: 1, pb: 1 }],
    laissez: ['Laissez-Faire', { invest: 0.4, output: 0.05 }, { ind: 2, pb: 1, union: -2 }],
    corporatist: ['State Corporatism', { mil_out: 0.1, build: 0.1, invest: -0.2 }, { army: 1, ind: 1, pb: 1, union: -1 }],
    command: ['Command Economy', { build: 0.25, invest: -1, needs: -0.1, output: -0.05 }, { union: 1, ind: -2, land: -2, pb: -2 }] } },
  trade: { name: 'Trade Policy', laws: {
    free: ['Free Trade', { tradecap: 0.35 }, { ind: 1, intel: 1, land: -1, rural: -1 }],
    protectionism: ['Protectionism', {}, { pb: 1, rural: 1, ind: 1 }],
    autarky: ['Autarky', { tradecap: -0.4, output: -0.03, mil_out: 0.05 }, { army: 1, intel: -1, ind: -1 }] } },
  tax: { name: 'Taxation', laws: {
    land_tax: ['Land Tax', { tax: -0.25 }, { ind: 1, rural: -1, land: -1 }],
    per_capita: ['Per-Capita Tax', { tax: -0.1, rad: 0.1 }, { ind: 1, land: 1, union: -1, rural: -1 }],
    proportional: ['Proportional Tax', {}, { pb: 1 }],
    graduated: ['Graduated Tax', { tax: 0.15, invest: -0.15 }, { union: 2, intel: 1, ind: -1, land: -1 }] } },
  labor: { name: 'Labour Rights', laws: {
    no_rights: ['No Workers\' Rights', { output: 0.05, rad: 0.15 }, { ind: 1, land: 1, union: -2 }],
    regulated: ['Regulatory Bodies', {}, { union: 1, intel: 1 }],
    protections: ['Worker Protections', { output: -0.04, rad: -0.2, stab: 4 }, { union: 2, ind: -2 }],
    state_unions: ['State-Run Unions', { rad: -0.1, mil_out: 0.05 }, { army: 1, ind: 1, union: -1 }] } },
  welfare: { name: 'Welfare', laws: {
    no_welfare: ['No Social Security', {}, { ind: 1, union: -1 }],
    poor_laws: ['Poor Relief', { rad: -0.08, welfare: 0.4 }, { devout: 1 }],
    pensions: ['Old-Age Pensions', { rad: -0.18, welfare: 1, stab: 3 }, { union: 1, intel: 1, ind: -1 }],
    welfare_state: ['Welfare State', { rad: -0.3, welfare: 2, stab: 6 }, { union: 2, intel: 1, ind: -2 }] } },
  edu: { name: 'Education', laws: {
    no_schools: ['No Schools', { research: -0.2 }, { land: 1, intel: -2 }],
    religious: ['Religious Schools', { literacy: 0.5, research: -0.05 }, { devout: 2, intel: -1 }],
    private: ['Private Schools', { literacy: 0.7 }, { ind: 1, pb: 1 }],
    public: ['Public Schools', { literacy: 1.3, research: 0.1, welfare: 0.4 }, { intel: 2, union: 1, devout: -2 }] } },
  speech: { name: 'Free Speech', laws: {
    outlawed: ['Outlawed Dissent', { rad: -0.2, research: -0.05, pp: 0.1 }, { army: 1, intel: -2, union: -1 }],
    censorship: ['Censorship', { rad: -0.08 }, { devout: 1, land: 1, intel: -1 }],
    protected: ['Protected Speech', { research: 0.08, rad: 0.05, stab: 3 }, { intel: 2, union: 1, army: -1 }] } },
  security: { name: 'Internal Security', laws: {
    no_police: ['No Home Affairs', {}, { intel: 1 }],
    guard: ['National Guard', { rad: -0.08, stab: 2 }, { land: 1, pb: 1 }],
    secret_police: ['Secret Police', { rad: -0.3, stab: 5, research: -0.03 }, { army: 1, intel: -2, union: -2 }] } },
  conscription: { name: 'Conscription', instant: true, laws: {
    volunteer: ['Volunteer Only', { conscr: 0.012 }, {}, {}],
    limited: ['Limited Conscription', { conscr: 0.025 }, {}, {}],
    extensive: ['Extensive Conscription', { conscr: 0.05, output: -0.02 }, {}, { ws: 30 }],
    requirement: ['Service by Requirement', { conscr: 0.1, output: -0.06, train: -0.1 }, {}, { war: true, ws: 50 }],
    all_adults: ['All Adults Serve', { conscr: 0.2, output: -0.15, train: -0.2 }, {}, { war: true, ws: 70 }] } },
  mobil: { name: 'Economic Mobilisation', instant: true, laws: {
    civilian: ['Civilian Economy', { mil_out: -0.3, needs: 0.05 }, {}, {}],
    early: ['Early Mobilisation', { mil_out: -0.1 }, {}, {}],
    partial: ['Partial Mobilisation', { mil_out: 0.1, needs: -0.05 }, {}, { ws: 25 }],
    war_econ: ['War Economy', { mil_out: 0.3, needs: -0.15, build: 0.1 }, {}, { ws: 50 }],
    total: ['Total Mobilisation', { mil_out: 0.5, needs: -0.25, build: 0.1, rad: 0.1 }, {}, { war: true, ws: 70 }] } }
};
const LAW_PRESET = {
  dem: { gov: 'parliamentary', power: 'universal', econ: 'interventionism', trade: 'protectionism', tax: 'proportional', labor: 'regulated', welfare: 'poor_laws', edu: 'public', speech: 'protected', security: 'guard', conscription: 'volunteer', mobil: 'civilian' },
  fas: { gov: 'oneparty', power: 'autocracy', econ: 'corporatist', trade: 'autarky', tax: 'proportional', labor: 'state_unions', welfare: 'poor_laws', edu: 'public', speech: 'outlawed', security: 'secret_police', conscription: 'limited', mobil: 'early' },
  com: { gov: 'council', power: 'autocracy', econ: 'command', trade: 'autarky', tax: 'proportional', labor: 'state_unions', welfare: 'pensions', edu: 'public', speech: 'outlawed', security: 'secret_police', conscription: 'limited', mobil: 'early' },
  aut: { gov: 'presidential', power: 'oligarchy', econ: 'interventionism', trade: 'protectionism', tax: 'per_capita', labor: 'no_rights', welfare: 'no_welfare', edu: 'religious', speech: 'censorship', security: 'guard', conscription: 'limited', mobil: 'civilian' },
  mon: { gov: 'monarchy', power: 'oligarchy', econ: 'interventionism', trade: 'protectionism', tax: 'per_capita', labor: 'no_rights', welfare: 'no_welfare', edu: 'religious', speech: 'censorship', security: 'guard', conscription: 'limited', mobil: 'civilian' },
  trad: { gov: 'monarchy', power: 'autocracy', econ: 'traditionalism', trade: 'protectionism', tax: 'land_tax', labor: 'no_rights', welfare: 'no_welfare', edu: 'no_schools', speech: 'censorship', security: 'no_police', conscription: 'volunteer', mobil: 'civilian' }
};
const IDEO_GOV = { dem: ['ind', 'intel', 'pb'], fas: ['army', 'pb', 'ind'], com: ['union', 'intel'], aut: ['army', 'land', 'devout'] };
const TAX_RATE = [0.1, 0.18, 0.26, 0.34, 0.42];
const TAX_NAME = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

// Technologies: id: [name, category, year, effects, unlock text]
const TECHS = {
  p_openhearth: ['Open-Hearth Steel', 'prod', 1924, {}, 'Open Hearth steelmaking'], p_mech_mining: ['Mechanised Mining', 'prod', 1926, {}, 'Mechanised mines and logging'],
  p_fert: ['Nitrogen Fertilisers', 'prod', 1928, {}, 'Fertilised farms, estates'], p_steelframe: ['Steel-Frame Construction', 'prod', 1929, {}, 'Steel Frames construction'],
  p_electrification: ['Mass Electrification', 'prod', 1931, {}, 'Electric looms, lathes and cities'], p_assembly: ['Assembly Lines', 'prod', 1933, {}, 'Mass production of engines, cars, tanks, aircraft'],
  p_precision: ['Precision Tooling', 'prod', 1936, {}, 'Precision tools, stamped arms'], p_tractors: ['Tractorisation', 'prod', 1936, {}, 'Tractor Farming'],
  p_petro: ['Petrochemistry', 'prod', 1937, {}, 'Petrochemicals, oil-fired power'], p_deepdrill: ['Deep Drilling', 'prod', 1937, {}, 'Deep oil drilling'],
  p_rail: ['Diesel Locomotion', 'prod', 1938, { infra: 0.25 }, ''], p_hydro: ['Hydroelectric Dams', 'prod', 1938, {}, 'Hydroelectric power'],
  p_synthetic: ['Synthetic Materials', 'prod', 1938, {}, 'Synthetic Plants (rubber / fuel)'], p_arc: ['Electric Arc Furnaces', 'prod', 1939, {}, 'Electric Arc steel, welded hulls'],
  p_prefab: ['Prefabrication', 'prod', 1940, {}, 'Prefabricated construction'], p_logistics: ['Modern Logistics', 'prod', 1941, { tradecap: 0.1, supply: 0.15 }, ''],
  p_automation: ['Industrial Automation', 'prod', 1943, { output: 0.08 }, ''], p_atomic: ['Atomic Research', 'prod', 1943, { research: 0.05 }, ''], p_bomb: ['The Atomic Bomb', 'prod', 1945, {}, 'Decision: deploy the Bomb'],
  m_fort: ['Fortification Engineering', 'mil', 1930, { entrench: 0.15 }, ''], m_art1: ['Modern Field Artillery', 'mil', 1932, {}, 'Heavy Infantry divisions'],
  m_mot: ['Motorised Infantry', 'mil', 1934, {}, 'Motorised divisions'], m_tank1: ['Light Tanks', 'mil', 1934, {}, 'Armoured divisions, Tank Plants'],
  m_air1: ['Monoplane Fighters', 'mil', 1935, { air: 0.2 }, ''], m_mtn: ['Special Forces', 'mil', 1936, {}, 'Mountain divisions'], m_doc1: ['Operational Doctrine', 'mil', 1936, { org: 0.1 }, ''],
  m_log: ['Field Logistics', 'mil', 1937, { supply: 0.2 }, ''], m_nav1: ['Fleet Carriers', 'mil', 1937, { navy: 0.2 }, ''], m_smg: ['Automatic Weapons', 'mil', 1938, { atk: 0.05, def: 0.05 }, ''],
  m_air2: ['Strategic Bombers', 'mil', 1938, { bombing: 0.5 }, 'Strategic bombing'], m_cas: ['Close Air Support', 'mil', 1938, { cas: 0.5 }, ''], m_radio: ['Signal Companies', 'mil', 1938, { org: 0.1 }, ''],
  m_tank2: ['Medium Tanks', 'mil', 1939, { tank: 0.2 }, ''], m_doc2: ['Deep Operations', 'mil', 1939, { atk: 0.06 }, ''], m_nav2: ['Submarine Wolfpacks', 'mil', 1939, { navy: 0.15 }, ''],
  m_radar: ['Radar', 'mil', 1940, { air: 0.15, navy: 0.05 }, ''], m_art2: ['Rocket Artillery', 'mil', 1941, { atk: 0.07 }, ''], m_tank3: ['Heavy Tanks', 'mil', 1942, { tank: 0.2 }, ''],
  m_doc3: ['Combined Arms', 'mil', 1942, { atk: 0.05, def: 0.05 }, ''], m_assault: ['Assault Rifles', 'mil', 1943, { atk: 0.06, def: 0.04 }, ''], m_air3: ['Jet Engines', 'mil', 1944, { air: 0.3 }, ''],
  s_bank: ['Central Banking', 'soc', 1928, { tax: 0.05 }, ''], s_radio: ['Mass Broadcasting', 'soc', 1930, { stab: 3 }, ''], s_stat: ['National Statistics', 'soc', 1933, { tax: 0.05 }, ''],
  s_labor: ['Collective Bargaining', 'soc', 1935, { rad: -0.1 }, ''], s_edu: ['Technical Schools', 'soc', 1936, { research: 0.1, literacy: 0.3 }, ''], s_diplo: ['Shuttle Diplomacy', 'soc', 1936, { infl: 0.15 }, ''],
  s_nation: ['National Identity', 'soc', 1936, { legit: 5, ws: 3 }, ''], s_psy: ['Mass Mobilisation', 'soc', 1937, { ws: 5, manpower: 0.05 }, ''], s_keynes: ['Macroeconomics', 'soc', 1937, { build: 0.1, invest: 0.1 }, ''],
  s_welfare: ['Social Insurance', 'soc', 1937, { rad: -0.1 }, ''], s_planning: ['Economic Planning', 'soc', 1938, { build: 0.1 }, ''], s_intel: ['Intelligence Agencies', 'soc', 1938, { def: 0.03, infl: 0.1 }, ''],
  s_civildef: ['Civil Defence', 'soc', 1939, { civdef: 0.5 }, ''], s_corp: ['Modern Management', 'soc', 1939, { output: 0.05 }, ''], s_medicine: ['Antibiotics', 'soc', 1941, { manpower: 0.05, stab: 2 }, ''],
  s_computing: ['Computing Machines', 'soc', 1943, { research: 0.15 }, '']
};
const TECH_CAT = { prod: 'Production', mil: 'Military', soc: 'Society' };
const techCost = id => 90 + 14 * (TECHS[id][2] - 1924);

// Units: name, atk, def, brk, speed, equipment, manpower(k), train days, tech, oil/week
const UNITS = {
  mil: { name: 'Militia', icon: '🪖', atk: 3, def: 5, brk: 2, spd: 1, eq: { arms: 5 }, mp: 8, days: 25, upkeep: 12 },
  inf: { name: 'Infantry', icon: '🪖', atk: 6, def: 9, brk: 3, spd: 1, eq: { arms: 10, artillery: 1 }, mp: 12, days: 60, upkeep: 22 },
  cav: { name: 'Cavalry', icon: '🐎', atk: 5, def: 5, brk: 5, spd: 1.6, eq: { arms: 8 }, mp: 8, days: 60, upkeep: 24 },
  mtn: { name: 'Mountaineers', icon: '⛰️', atk: 6, def: 10, brk: 3, spd: 1, eq: { arms: 11, artillery: 1 }, mp: 11, days: 90, tech: 'm_mtn', upkeep: 28 },
  hvy: { name: 'Heavy Infantry', icon: '💣', atk: 10, def: 11, brk: 4, spd: 0.9, eq: { arms: 10, artillery: 6 }, mp: 14, days: 80, tech: 'm_art1', upkeep: 30 },
  mot: { name: 'Motorised', icon: '🚚', atk: 8, def: 9, brk: 7, spd: 2, eq: { arms: 10, artillery: 2, autos: 6 }, mp: 12, days: 80, tech: 'm_mot', oil: 1, upkeep: 34 },
  arm: { name: 'Armoured', icon: '🛡️', atk: 16, def: 7, brk: 22, spd: 2, eq: { tanks: 10, autos: 3, arms: 3 }, mp: 8, days: 120, tech: 'm_tank1', oil: 2.5, upkeep: 48 }
};
const UNIT_IDS = Object.keys(UNITS);
const TERRAIN = { p: ['Plains', 0, 1], f: ['Forest', 0.15, 1.3], h: ['Hills', 0.15, 1.3], m: ['Mountains', 0.4, 1.8], d: ['Desert', 0, 1.3], j: ['Jungle', 0.25, 1.7], u: ['Urban', 0.25, 1.1], s: ['Marsh', 0.2, 1.6] };
const TRAITS = {
  panzer: ['Armour Officer', 'Armoured divisions +20% attack'], inf: ['Infantry Expert', 'Infantry +10% defence'], def: ['Defensive Doctrine', '+15% defence'], off: ['Offensive Doctrine', '+12% attack'],
  mtn: ['Mountaineer', '+25% in mountains and hills'], winter: ['Winter Specialist', '+10% defence, +5% attack'], log: ['Logistics Wizard', 'Ignores supply penalties, faster movement'],
  brilliant: ['Brilliant Strategist', '+10% attack and defence'], old: ['Old Guard', '-5% attack, +5% defence'], trick: ['Trickster', '+10% attack when outnumbered'],
  cav: ['Cavalry Leader', 'Cavalry and motorised +15% attack'], jungle: ['Jungle Rat', '+25% in jungle and marsh'], desert: ['Desert Fox', '+25% in desert'], urban: ['Urban Assault', '+25% in cities'], politic: ['Politically Connected', '+5% defence']
};
const NAMEPOOL = {
  west: ['Adams', 'Baker', 'Clarke', 'Dawson', 'Ellis', 'Foster', 'Graham', 'Hayes', 'Irving', 'Jensen', 'Keller', 'Lambert', 'Moreau', 'Novak', 'Olsen', 'Peters', 'Quint', 'Renard', 'Sorensen', 'Thorne', 'Van Dijk', 'Weber'],
  east: ['Antonov', 'Bogdan', 'Cernik', 'Dragan', 'Horvat', 'Ivanov', 'Kovac', 'Lazar', 'Milos', 'Nowak', 'Orlov', 'Petrov', 'Radu', 'Sokol', 'Toma', 'Vasil', 'Zoltan'],
  latin: ['Alvarez', 'Benitez', 'Castro', 'Duarte', 'Espinosa', 'Fuentes', 'Gomez', 'Herrera', 'Ibarra', 'Lopez', 'Mendoza', 'Navarro', 'Ortiz', 'Pereira', 'Quiroga', 'Ramos', 'Silva', 'Torres', 'Vargas'],
  asia: ['Chen', 'Dao', 'Fang', 'Guo', 'Huang', 'Kim', 'Li', 'Ma', 'Nguyen', 'Pan', 'Sato', 'Tanaka', 'Wang', 'Xu', 'Yamada', 'Zhang'],
  mid: ['Abbas', 'Bakr', 'Demir', 'Farouk', 'Ghazi', 'Hassan', 'Ismail', 'Jalal', 'Karim', 'Mansur', 'Nasser', 'Omar', 'Rashid', 'Selim', 'Tariq', 'Yusuf'],
  afr: ['Abebe', 'Bekele', 'Diallo', 'Haile', 'Kebede', 'Mensah', 'Okoro', 'Tesfaye', 'Tubman', 'Wolde']
};

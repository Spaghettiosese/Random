// Allied Nations update (1.2): focus trees for the United States, the United Kingdom and France,
// the Intelligence Agency (covert operations) and the Lend-Lease programme.
'use strict';
const giveDivs = (t, type, n) => { if (ok(t)) spawnDivisions(C(t), type, n, C(t).capital); };
const giveBuild = (t, b) => { if (ok(t)) for (const k in b) freeBuild(C(t), k, b[k]); };
Object.assign(FNS, {
  leaderMac: [setLeader('Douglas MacArthur', 'Emergency Government'), 'General MacArthur heads an emergency government'],
  invitePanAm: [c => inviteAll(c, ['MEX', 'BRA', 'ARG', 'CHL', 'COL', 'VEN', 'PRU', 'CUB', 'PAN', 'URU'], k => opinion(k.tag, c.tag) > 10), 'Friendly American republics are invited'],
  armPhil: [() => { giveDivs('PHI', 'inf', 3); if (ok('PHI')) C('PHI').stock.arms += 200; }, 'The Philippine Army gains three divisions'],
  destroyers: [c => { if (!ok('ENG')) return; const n = Math.min(25, c.stock.ships * 0.1); c.stock.ships -= n; C('ENG').stock.ships += n; addSpirit(c, slug('Atlantic Bases')); }, 'Old destroyers go to Britain; we lease bases across the Atlantic'],
  aidChina: [c => aidTo('CHI', { arms: 400, artillery: 80, aircraft: 100 })(c), 'Arms and aircraft for China'],
  tigers: [c => { if (ok('CHI')) { C('CHI').stock.aircraft += 200; addRel(c.tag, 'CHI', 20); } }, 'Volunteer pilots and two hundred fighters reach China'],
  embargoJap: [() => ok('JAP') && addSpirit(C('JAP'), 'oil_embargo'), 'Japan suffers the Oil Embargo'],
  atlanticAlliance: [c => { if (!factionOf(c.tag)) createFaction(c.tag, 'Atlantic Alliance'); inviteAll(c, ['ENG', 'FRA', 'BEL', 'HOL', 'LUX', 'DEN', 'NOR', 'ITA', 'POR', 'CAN'], k => k.ideology === 'dem'); }, 'Found the Atlantic Alliance if we stand alone, and invite the democracies of the Atlantic'],
  xpAll: [c => armiesOf(c.tag).forEach(a => a.divs.forEach(d => d.xp = Math.min(1, d.xp + 0.15))), 'Every division gains experience'],
  leaderEdward: [setLeader('Edward VIII', 'King\'s Party'), 'Edward VIII keeps his throne and takes the reins'],
  leaderChurchill: [setLeader('Winston Churchill', 'War Coalition'), 'Winston Churchill becomes Prime Minister'],
  intelBoost: [c => { const i = intelOf(c); i.lvl = Math.min(3, i.lvl + 1); }, 'Our intelligence agency gains a level'],
  rajStab: [() => { if (ok('RAJ')) C('RAJ').stab = Math.min(100, C('RAJ').stab + 8); }, 'Stability in India +8'],
  indiaDominion: [() => { if (ok('RAJ')) { const r = C('RAJ'); removeSpirit(r, 'independence_movement'); r.stab = Math.min(100, r.stab + 15); setIdeology(r, 'dem', true); addRel('ENG', 'RAJ', 50); } }, 'India becomes a democratic dominion; the independence movement is satisfied'],
  rajGrip: [() => { if (ok('RAJ')) { C('RAJ').stab = Math.max(0, C('RAJ').stab - 8); C('RAJ').manpower += 200; } }, 'Indian stability -8, Indian manpower +200K'],
  rajDivs: [() => giveDivs('RAJ', 'inf', 6), 'The Indian Army gains six divisions'],
  rajBuild: [() => giveBuild('RAJ', { arms: 2, steel: 1, textile: 2 }), 'India gains arms factories, a steel mill and textile mills'],
  canBuild: [() => giveBuild('CAN', { arms: 2, autos: 1, aircraftp: 1 }), 'Canada gains arms, automobile and aircraft plants'],
  anzDivs: [() => { giveDivs('AST', 'inf', 3); giveDivs('NZL', 'inf', 1); }, 'Australia gains three divisions, New Zealand one'],
  safStay: [() => { if (ok('SAF')) { C('SAF').stab = Math.min(100, C('SAF').stab + 10); giveDivs('SAF', 'inf', 2); } }, 'South Africa steadies and raises two divisions'],
  egyDivs: [() => giveDivs('EGY', 'inf', 2), 'Egypt raises two divisions'],
  allyFrance: [c => { if (ok('FRA') && !friendly(c.tag, 'FRA') && C('FRA').ideology !== 'fas') addPact('ally', c.tag, 'FRA'); }, 'Alliance with France'],
  inviteFranceAllies: [c => inviteAll(c, ['FRA'], k => k.ideology === 'dem'), 'France is invited if democratic'],
  sanctionITA: [() => { if (ok('ITA')) { C('ITA').infamy += 3; addSpirit(C('ITA'), slug('League Sanctions'), 540); } }, 'Italy suffers League sanctions for eighteen months'],
  buyAmerican: [c => { if (!ok('USA') || atWar(c.tag, 'USA')) return; c.stock.aircraft += 200; c.stock.arms += 300; addRel(c.tag, 'USA', 10); }, 'Buy two hundred aircraft and small arms from American factories'],
  freeFrance: [c => { spawnDivisions(c, 'inf', 4, c.capital); c.manpower += 60; }, 'Four Free French divisions fight under our command'],
  restoreEth: [c => { const ps = G.P.filter(p => p.orig === 'ETH' && p.owner !== 'ETH' && (p.ctrl === c.tag || friendly(c.tag, p.ctrl))); if (ps.length && !ok('ETH') && releaseCountry('ETH', ps[0].owner)) { makeSubject(c.tag, 'ETH'); restoreControl(); } else c.infl += 30; }, 'If we hold Ethiopian soil, the Emperor returns to Addis Ababa'],
  leaderBlum: [setLeader('Léon Blum', 'Popular Front'), 'Léon Blum forms a government'],
  aidSpainRep: [c => { const t = spainSide('dem')(c) || spainSide('com')(c); if (t) aidTo(() => t, { arms: 300, aircraft: 100, artillery: 50 })(c); }, 'Arms and aircraft cross the Pyrenees to the Republic'],
  latinBloc: [c => { if (!factionOf(c.tag)) createFaction(c.tag, 'Latin Bloc'); inviteAll(c, ['ITA', 'POR', 'SPA', 'ROM'], k => k.ideology !== 'dem' && k.ideology !== 'com'); alive().forEach(k => { if (k.civilOf === 'SPA' && k.ai && !factionOf(k.tag) && !isAtWar(k.tag)) joinFaction(k.tag, c.tag); }); }, 'Found the Latin Bloc with Italy, Spain, Portugal and Romania'],
  leaderOrleans: [setLeader('Henri VI', 'Action Française'), 'The Count of Paris is crowned'],
  fortCZE: [() => ['Karlsbad', 'Reichenberg', 'Prague'].forEach(n => { const p = PN(n); if (p.owner === 'CZE') p.fort = Math.min(5, p.fort + 1); }), 'French engineers strengthen the Czech border forts'],
  leaderDeGaulle: [setLeader('Charles de Gaulle', 'Free France'), 'General de Gaulle leads Fighting France'],
  coreAlgiers: [c => ['Algiers', 'Oran', 'Constantine'].forEach(n => { const p = PN(n); if (p.owner === c.tag && !p.cores.includes(c.tag)) p.cores.push(c.tag); }), 'Algiers, Oran and Constantine become core territory'],
  promoteDeGaulle: [c => { const g = c.gens.find(x => x.name.includes('de Gaulle')); if (g) g.skill = Math.min(5, g.skill + 1); else c.gens.push({ id: G.nid++, name: 'Charles de Gaulle', skill: 5, trait: 'panzer', xp: 0 }); }, 'Charles de Gaulle gains a skill level'],
  retireOld: [c => { c.gens.filter(g => g.trait === 'old' && g.skill <= 2).forEach(g => { if (g.army && G.armies[g.army]) G.armies[g.army].gen = null; c.gens.splice(c.gens.indexOf(g), 1); }); }, 'Elderly, low-skilled generals are retired']
});
SPIRITS[slug('Atlantic Bases')] = ['Atlantic Bases', 'Ninety-nine-year leases from Newfoundland to Trinidad.', { navy: 0.08 }];
SPIRITS[slug('League Sanctions')] = ['League Sanctions', 'Fifty nations refuse our trade.', { tradecap: -0.2, output: -0.04 }];
Object.assign(REQF, {
  engAtWar: [() => ok('ENG') && enemiesOf('ENG').some(t => C(t).major), 'The United Kingdom is at war with a major power'],
  chiJapWar: [() => ok('CHI') && atWar('CHI', 'JAP'), 'China is at war with Japan'],
  japAtWar: [() => ok('JAP') && isAtWar('JAP'), 'Japan is at war'],
  crisis: [c => G.tension >= 85 || isAtWar(c.tag), 'World tension 85, or at war'],
  wakeup: [c => !!G.flags.czech_gone || !hasSpirit(c, 'appeasement') || G.tension >= 40, 'Czechoslovakia has fallen, appeasement abandoned, or world tension 40'],
  fraCap: [() => ok('FRA') && C('FRA').capitulated, 'France has capitulated'],
  noParalysis: [c => !hasSpirit(c, 'political_paralysis'), 'Political Paralysis overcome']
});

TREES.USA = parseTree('u_', `
newdeal|Second New Deal|4|0||rmspirit great_depression; spirit recovery; stab 5|Relief, recovery and reform.|mx landon; ai 6; sec New Deal
landon|Return to Normalcy|8|0||law laissez; ig ind 8, union -6; spirit Balanced Budget: tax .08, invest .25, rad .08|The Kansas governor promises to undo the alphabet agencies.|mx newdeal; ai 0
wealth|Share Our Wealth|0|1|newdeal|law graduated, welfare_state; ig union 6 .2, ind -8|Every man a king, and no man a millionaire.|ai 0
wpa|Works Progress Administration|2|1|newdeal|build construction 2, power 1; infra 3|Dams, roads and post offices in every county.|ai 3
ssa|Social Security Act|4|1|newdeal|law pensions, regulated; ig union 5, ind -3|Freedom from want in old age.|ai 3
wagner|Wagner Act|6|1|newdeal|ig union 6 .15; rad -.05|Labour's Magna Carta.|
gold|Sound Dollar|8|1|landon|money 10; spirit Gold Standard Restored: invest .2|A dollar as good as gold.|
openshop|Open Shop|9|1|landon|law no_rights; ig union -8, ind 6; spirit Right to Work: output .04|The sit-down strikes are broken.|
everyman|Every Man a King|0|2|wealth|rad -.1; stab 4; money -6|A homestead and a radio for every family.|
tva|Tennessee Valley Authority|1|2|wpa|build power 3; tech p_hydro|A river tamed, a region lit.|
ccc|Civilian Conservation Corps|2|2|wpa|mp 150; build logging 2; rad -.03|Three million young men in forest camps.|
rural|Rural Electrification|3|2|wpa|tech p_electrification; build power 1, farm 2|Light for the farmhouse.|
flsa|Fair Labor Standards|5|2|ssa|wagner|law protections; ig union 4|A floor under wages, a ceiling over hours.|
court|Court-Packing Plan|6|2|wagner|pp 100; stab -4; legit -3|Six new justices for nine old men.|mx respect
respect|Respect the Court|7|2|wagner|stab 4; legit 5|The Constitution is what the judges say it is.|mx court
macarthur|The General Steps In|8|2|gold|openshop|setIdeo aut; stab -5; fn leaderMac|Order will be restored, by the man who cleared the Bonus Army.|ai 0
silver|Silver Shirts March|9|2|openshop|ideo fas 12; stab -5|A legion in silver shirts parades through Asheville.|ai 0
cpusa|American Popular Front|0|3|everyman|ideo com 12|Communism is twentieth-century Americanism, says the Party.|ai 0
recovery|Full Recovery|4|3|rural|flsa|rmspirit recovery; pp 100; build autos 2, steel 2|Happy days are here again.|ai 3
legion|Legion Government|9|3|silver|setIdeo fas; stab -8|It can happen here.|
soviets|American Soviets|0|4|cpusa|setIdeo com; stab -8|A workers' republic from sea to shining sea.|
third|A Third Term|4|4|recovery|pp 80; legit 6|No president has asked for one. This one does.|
bonds|War Bonds Drive|3|5|third|money 14|Movie stars sell the national debt.|req war
fourfree|Four Freedoms|4|5|third|ws 10; ideo dem 5; infl 40|Of speech, of worship, from want, from fear.|req tension 40
opa|Office of Price Administration|5|5|third|spirit Price Controls: needs -.08, rad -.03|Ration books and ceiling prices.|req war
fepc|Fair Employment|3|6|bonds|opa|mp 200; spirit Open Shop Floor: output .03|Defence jobs for everyone who can do them.|
gibill|GI Bill|4|6|fourfree|spirit Educated Veterans: research .06, rad -.05|College and a mortgage for every veteran.|req war
rosie|Rosie the Riveter|5|6|opa|mp 300; spirit Women in Industry: output .05|We can do it.|req war
neutral|Neutrality Acts|12|0||stab 5; pp 50|No more foreign wars.|mx quarantine; ai 1; sec Foreign Policy
monroe|Reaffirm the Monroe Doctrine|14|0||guarantee MEX, CUB, PAN, VEN, COL, BRA|This hemisphere is closed to conquest.|ai 2
quarantine|Quarantine the Aggressors|16|0||ws 8; rmspirit isolationism; spirit great_debate|War is a contagion, whether declared or not.|mx neutral; req tension 30; ai 5
first|America First|11|1|neutral|ideo aut 6; stab 5; spirit fortress_america|The oceans are our walls.|
cash|Cash and Carry|13|1|neutral|money 8; trade ENG, FRA|Pay in dollars and take it away in your own ships.|
good|Good Neighbor Policy|14|1|monroe|rel MEX 30, BRA 30, ARG 20, CHL 20, COL 20, VEN 20, PRU 20, CUB 20; infl 40|Trade, not marines.|
lend|Lend-Lease|16|1|quarantine|flag lendlease; rmspirit great_debate; spirit arsenal_of_democracy; rel ENG 30, SOV 10, CHI 20|Lend a neighbour your garden hose when his house is on fire.|req tension 50; ai 5
destroyers|Destroyers for Bases|18|1|quarantine|rel ENG 30; fn destroyers|Fifty old ships for eight new bases.|req engAtWar
hemis|Hemisphere Defense|12|2|first|cash|guarantee MEX, BRA, ARG, CHL|From Alaska to Cape Horn.|
revise|Repeal Neutrality|13|2|cash|rmspirit isolationism; spirit great_debate; ws 5|The arms embargo helps only the aggressor.|req tension 50
exim|Export-Import Bank|14|2|good|trade BRA, MEX, ARG, CHL; spirit Dollar Diplomacy: tradecap .1, infl .1|Credit follows the flag.|
charter|Atlantic Charter|16|2|lend|rel ENG 30; ws 8; infl 30|A declaration of war aims by a country not yet at war.|req engAtWar
china|Aid to China|17|2|lend|fn aidChina|Keep China fighting and Japan is half beaten.|req chiJapWar
embargo|Embargo Japan|18|2|lend|destroyers|rel JAP -50; fn embargoJap|Not one more barrel.|req japAtWar; ai 5
fortress|Continental Fortress|11|3|hemis|fort 2; build shipyard 1; spirit Coastal Batteries: def .08|Sixteen-inch guns at every harbour mouth.|
panam|Pan-American Union|12|3|hemis|faction Pan-American Union; fn invitePanAm|Twenty-one republics, one doctrine.|ai 0; req sovereign
rubber|Brazilian Rubber Accord|14|3|exim|rel BRA 20; trade BRA; spirit Hemisphere Rubber: mil_out .03|The Amazon taps again.|
phil|Philippine Commonwealth|15|3|exim|rel PHI 30; fn armPhil|Ten years to independence, and an army to keep it.|
patrol|Neutrality Patrol|16|3|charter|ws 4; spirit Shoot on Sight: navy .08|Three hundred miles of ocean declared off limits to raiders.|
tigers|Flying Tigers|17|3|china|fn tigers; spirit Volunteer Airmen [900]: air .05|Shark teeth painted on borrowed fighters.|
freeze|Freeze Japanese Assets|18|3|embargo|rel JAP -20; tension 3; ws 5|Every yen in an American bank is locked.|
allies|Join the Allies|17|4|freeze|patrol|fn joinAllies; law war_econ; ws 15|The great arsenal goes to war.|req crisis; ai 6
infamy|A Date Which Will Live in Infamy|18|4|freeze|ws 30; mp 500; law war_econ, extensive; spirit Righteous Might [1095]: atk .08, ws 15|The American people in their righteous might will win through.|req majorwar; ai 10
europe|Germany First|16|5|allies|spirit Europe First [1095]: atk .05, supply .05|Beat the strongest enemy first.|mx pacific
un|Declaration of the United Nations|17|5|allies|infamy|infl 80; spirit United Nations: infl .3, legit 5|Twenty-six governments sign in a Washington study.|
pacific|Pacific First|18|5|infamy|spirit Pacific Priority [1095]: navy .15|The fleet that struck us must be sunk.|mx europe
torch|Second Front|16|6|europe|units inf 6, arm 2|Across the Atlantic with an army.|req majorwar
marshall|European Recovery Program|17|6|un|rel FRA 40, ENG 30, ITA 20, GER 20; trade FRA, ITA; infl 60|Thirteen billion dollars against hunger, poverty and chaos.|req peace
island|Island Hopping|18|6|pacific|units inf 4; spirit Amphibious Doctrine: navy .1, atk .03|Take the airfields, bypass the garrisons.|
nato|Atlantic Alliance|17|7|marshall|fn atlanticAlliance|An attack on one is an attack on all.|
imp|Industrial Mobilization Plan|24|0||build tools 2, steel 2|A plan in a filing cabinet, waiting for an emergency.|ai 2; sec Industry
detroit|Motor City|22|1|imp|build autos 2, engines 2|A car every forty-five seconds.|
bigsteel|Big Steel|23|1|imp|build steel 3, ironm 2|Mesabi ore down the lakes to Pittsburgh.|
crude|Texas Crude|24|1|imp|build oilr 3; tech p_deepdrill|Two-thirds of the world's oil.|
aluminum|Aluminum for Airframes|25|1|imp|build aircraftp 1, power 2|Dams on the Columbia make metal for wings.|
synrub|Synthetic Rubber Program|26|1|imp|tech p_synthetic; build synth 2|Fifty-one plants in two years.|
highway|Interstate Highways|22|2|detroit|infra 5|Coast to coast without a stop light.|
liberty|Liberty Ships|23|2|bigsteel|build shipyard 3; spirit Prefabricated Shipbuilding: navy .05, tradecap .05|Ugly ducklings, launched faster than they can be sunk.|
octane|Hundred-Octane|24|2|crude|build chem 2; tech p_petro; spirit Aviation Fuel: air .05|Fuel that gives a fighter another thirty miles an hour.|
willow|The Mile-Long Factory|25|2|aluminum|build aircraftp 3|A bomber an hour.|req war
foodwin|Food Will Win the War|26|2|synrub|build farm 4; tech p_tractors|The breadbasket of the alliance.|
jeep|General Purpose Vehicle|22|3|highway|equip autos 400; tech m_mot|A quarter-ton truck that goes anywhere.|
wpb|War Production Board|24|3|liberty|octane|highway|law war_econ; spirit Dollar-a-Year Men: mil_out .12|Executives on loan run the war economy.|req tension 60
convert|Convert the Auto Industry|23|4|wpb|build tankp 3, arms 2; spirit Tanks from Car Plants: mil_out .06|No more cars for the duration.|
miracle|Production Miracle|24|5|convert|spirit Production Miracle: mil_out .15, output .05, build .1|More than all the Axis powers combined.|req majorwar
pmp|Protective Mobilization Plan|31|0||spirit army_reform; units inf 3|An army smaller than Portugal's must start somewhere.|ai 2; sec Army
guard|Federalize the National Guard|29|1|pmp|units inf 6; mp 100|Eighteen divisions of weekend soldiers.|
draft|Selective Service|31|1|pmp|law limited; mp 400; units inf 4; rmspirit peacetime_army|The first peacetime draft.|ai 3
armored|Armored Force|33|1|pmp|tech m_tank1, m_mot; build tankp 1; units arm 1|The cavalry trades horses for tanks.|
benning|Infantry School|29|2|guard|generals Courtney Hodges/3/inf; spirit Fire and Maneuver: atk .04|Follow me.|
garand|Semi-Automatic Rifle|30|2|draft|equip arms 500; spirit Eight-Round Clip: atk .03, def .03|The greatest battle implement ever devised.|
fdc|Fire Direction Centers|31|2|draft|tech m_art1; equip artillery 200; spirit Time on Target: atk .04|Every gun in range, landing at the same second.|
airborne|Airborne Divisions|32|2|draft|tech m_mtn; units mtn 2|Jump boots and silk.|
sherman|Medium Tank Program|33|2|armored|tech m_tank2; build tankp 2|Reliable, easy to ship, and there will be fifty thousand of them.|
td|Tank Destroyer Doctrine|34|2|armored|equip tanks 100; spirit Seek Strike Destroy: def .04|Fast guns to meet massed armour.|
stars|The Class the Stars Fell On|30|3|benning|generals Walter Krueger/4/jungle; pp 30|A generation of officers reaches high command.|
louisiana|Louisiana Maneuvers|31|3|garand|fdc|fn xpAll; tech m_doc1; generals Mark Clark/3/mtn|Four hundred thousand men fight a war with flour bags.|
redball|Truck Convoys|32|3|airborne|sherman|tech m_log; spirit Red Ball Highways: supply .2|An army that outruns its railways needs trucks.|
bazooka|Rocket Launcher|30|4|louisiana|stars|equip arms 300; spirit Shoulder-Fired Rockets: def .03|A stovepipe that kills tanks.|
commands|Combat Commands|31|4|louisiana|tech m_doc2; spirit Flexible Task Forces: atk .04, org .05|Tanks, infantry and guns mixed to order.|
rangers|Rangers Lead the Way|32|4|redball|units mtn 2; spirit Raider Battalions: atk .02|Volunteers for the hardest jobs.|
vinson|Naval Expansion Act|38|0||build shipyard 2; equip ships 20|Build to the treaty limits at last.|ai 2; sec Navy
carriers|Carrier Task Forces|36|1|vinson|tech m_nav1; equip ships 25; spirit Fast Carriers: navy .1|The flat-top replaces the battleship.|mx battleline
twoocean|Two-Ocean Navy|38|1|vinson|build shipyard 3; equip ships 50|A fleet for each ocean.|ai 3
battleline|The Battle Line|40|1|vinson|equip ships 40; spirit Big Guns: navy .06|Sixteen-inch rifles settle arguments.|mx carriers
fleetsubs|Fleet Submarines|37|2|twoocean|tech m_nav2; equip ships 20|Long legs for the Pacific.|
escorts|Destroyer Escorts|38|2|twoocean|equip ships 25; spirit Convoy Escorts: navy .06, tradecap .05|Cheap hulls to shepherd the merchantmen.|
marines|Fleet Marine Force|39|2|twoocean|units inf 3; spirit Amphibious Corps: atk .03|From the halls of Montezuma.|
essex|Fleet Carrier Program|36|3|carriers|fleetsubs|equip ships 50|Twenty-four big carriers on order.|req war
pearl|Forward Fleet at Pearl Harbor|37|3|fleetsubs|escorts|fort Honolulu; equip ships 10; spirit Forward Fleet: navy .05|The battle fleet moves two thousand miles west.|
magic|Purple Code Broken|38|3|escorts|spirit Signals Intelligence: navy .08, def .03|We read their diplomatic mail before their ambassador does.|
seabees|Construction Battalions|39|3|marines|build port 2; spirit Can Do: supply .1, build .03|An airfield in ten days, anywhere.|
advbase|Advanced Base Force|38|4|pearl|magic|seabees|fort Manila; spirit Fleet Train: navy .05|Floating dry docks follow the fleet.|
ghq|GHQ Air Force|43|0||build aircraftp 2; tech m_air1; equip aircraft 150|Air power under a single commander.|ai 2; sec Air Corps
fortress2|Flying Fortress|42|1|ghq|tech m_air2; equip aircraft 150; spirit Daylight Precision: bombing .3|Four engines and thirteen machine guns.|
pursuit|Pursuit Squadrons|43|1|ghq|equip aircraft 250; spirit Interceptor Command: air .08|Fighters, by an older name.|
pilots|Civilian Pilot Training|44|1|ghq|mp 50; spirit Fifty Thousand Pilots: air .08|A flying course at every college.|
bombsight|Precision Bombsight|42|2|fortress2|spirit Pickle Barrel Accuracy: bombing .25|A secret carried to the aircraft under armed guard.|
escort|Long-Range Escort|43|2|pursuit|equip aircraft 300; spirit Escort Fighters: air .1|A fighter that can go all the way with the bombers.|req war
transport|Air Transport Command|44|2|pilots|equip aircraft 100; spirit Over the Hump: supply .1|An airline that flies to war zones.|
superfort|Very Heavy Bomber|42|3|bombsight|equip aircraft 200; spirit Superfortress: bombing .4|Pressurised cabins and remote turrets.|date 1942-6
usaaf|Independent Air Arm|43|3|escort|transport|spirit air_doctrine; tech m_cas|The Army Air Forces in all but name a separate service.|
ndrc|National Defense Research Committee|48|0||build university 2; res 30; spirit Mobilised Science: research .06, proj .15|Every laboratory in the country is put on contract.|ai 2; sec Science
radlab|Radiation Laboratory|47|1|ndrc|tech m_radar; proj 30|Microwaves on the roof of a Cambridge institute.|
osrd|Office of Scientific Research|48|1|ndrc|spirit Science at War: proj .2|One engineer reports directly to the President.|
letter|The Einstein Letter|49|1|ndrc|res 25; proj 30|Some recent work leads me to expect that uranium may be turned into a new source of energy.|date 1939-8
fuze|Proximity Fuze|47|2|radlab|spirit Radio Fuze: def .04, civdef .2|A radio set inside an artillery shell.|req war
penicillin|Penicillin for All|48|2|osrd|tech s_medicine|Deep-tank fermentation in a corn-belt laboratory.|date 1941-1
manhattan|Manhattan Project|49|2|letter|tech p_atomic; proj 80|Three secret cities and two billion dollars.|date 1940-6; ai 4
computer|Electronic Computer|48|3|penicillin|fuze|tech s_computing|Eighteen thousand vacuum tubes.|date 1942-1
trinity|Trinity|49|3|manhattan|tech p_bomb|A test in the desert before dawn.|date 1944-6
`);

TREES.ENG = parseTree('e_', `
baldwin|The National Government|5|0||pp 50; stab 4|Safety first.|sec Politics
labour|Labour Landslide|1|1|baldwin|ig union 8 .2; ideo dem 4, com 3|The opposition benches change sides.|mx kingsparty; ai 0
abdic|The King Must Go|4|1|baldwin|stab 3; pp 30; ig devout 3|The Cabinet, the Church and the Dominions agree.|mx kingsparty; ai 5
kingsparty|The King's Party|8|1|baldwin|ideo aut 10; stab -8; fn leaderEdward|A monarch who means to rule as well as reign.|mx abdic,labour; ai 0
nationalise|Commanding Heights|0|2|labour|law interventionism; ig ind -6; money 8; build coalm 2|Coal, rail and steel in public hands.|
nhs|National Health Service|1|2|labour|law welfare_state; rad -.1|Free at the point of use.|
chamberlain|Chamberlain's Cabinet|4|2|abdic|pp 60; money 6; spirit Treasury Orthodoxy: tax .06, mil_out -.05|A businesslike government.|ai 3
regency|A Royal Government|8|2|kingsparty|setIdeo aut; stab -4|Ministers chosen by the Palace.|mx mosley
mosley|Blackshirt Surge|9|2|kingsparty|ideo fas 14|Rallies at Olympia, marches in the East End.|mx regency
popular|Popular Front Britain|1|3|nhs|nationalise|ideo com 10; rel SOV 30|Unity of the left against fascism.|ai 0
areas|Special Areas Act|3|3|chamberlain|build construction 1, steel 1; rad -.04|Trading estates for the valleys and the Tyne.|
holidays|Holidays with Pay|5|3|chamberlain|rad -.04; ig union 4|A week at the seaside by Act of Parliament.|
buf|Mosley at Downing Street|9|3|mosley|setIdeo fas; stab -8|The lightning-flash flag over Whitehall.|
unionsoc|Union of Britain|1|4|popular|setIdeo com; stab -8|The red flag flies over the Trades Union Congress.|
appease|Peace for Our Time|4|4|areas|holidays|stab 8; pp 80|War is a fearful thing; we must be very clear before we embark on it.|mx steel; ai 6
steel|Stand Up to the Dictators|6|4|areas|holidays|rmspirit appeasement; ws 10; tension 2; guarantee CZE|An appeaser feeds the crocodile hoping it eats them last.|mx appease; ai 0
empirefirst|Empire First|8|4|regency|buf|spirit Imperial Autarky: tradecap -.1, output .05, ws 5|Let Europe look after itself.|
understanding|Anglo-German Understanding|9|4|buf|regency|nap GER; rel GER 40, ITA 20; rmspirit appeasement|Two great Nordic empires need not quarrel.|
comintern|Hands Across the Baltic|1|5|unionsoc|fn joinComintern|London and Moscow in step.|
lesson|The Lesson of Munich|4|5|appease|rmspirit appeasement; ws 8|The paper he waved was worth nothing.|req wakeup; ai 8
londonaxis|London–Berlin Axis|9|5|understanding|fn joinAxis|An alliance nobody in 1936 would have believed.|
guar|Guarantee Poland|5|6|lesson|steel|rmspirit appeasement, peace_dividend; guarantee POL, ROM, GRE; ws 8|Thus far and no further.|ai 9
service|National Service|4|7|guar|law limited; mp 300|Conscription in peacetime, for the first time.|ai 4
coalition|War Coalition|5|7|guar|stab 6; legit 8; ig union 4|All parties, one government.|req majorwar; ai 6
churchill|Their Finest Hour|5|8|coalition|service|fn leaderChurchill; spirit finest_hour; law war_econ; ws 20|We shall never surrender.|req majorwar; ai 10
homeguard|Home Guard|4|9|churchill|units mil 10; fort London|Look, duck, vanish — and then fight.|
blitz|Britain Can Take It|5|9|churchill|spirit Blitz Spirit: civdef .3, ws 8, stab 4|Business as usual, among the rubble.|
soe|Set Europe Ablaze|6|9|churchill|fn intelBoost; infl 30; spirit Special Operations: infl .15|A ministry of ungentlemanly warfare.|
beveridge|The Beveridge Report|5|10|blitz|law welfare_state; rad -.1; ig union 6|Want, Disease, Ignorance, Squalor and Idleness.|req war
conf|Imperial Conference|17|0||mp 200; rel CAN 20, AST 20, NZL 20, SAF 20, RAJ 10; infl 30|The Empire speaks with one voice, for a week.|ai 2; sec Empire
goi|Government of India Act|14|1|conf|fn rajStab|Provincial autonomy and a federation that never meets.|
statute|Commonwealth of Equals|17|1|conf|rel CAN 20, AST 20, NZL 20, SAF 20; spirit Commonwealth of Equals: infl .1, stab 2|Autonomous communities, equal in status.|mx fed
fed|Imperial Federation|19|1|conf|rel CAN -10, SAF -10; spirit Imperial Parliament: pp .1, manpower .1|One parliament for a quarter of the world.|mx statute; ai 0
mideast|Middle East Command|20|1|conf|units inf 3; fort Alexandria, Cairo; generals Richard O'Connor/4/desert|Cairo becomes the hinge of the Empire.|
dominion|Dominion Status for India|13|2|goi|fn indiaDominion; stab -3|A promise long deferred.|mx grip; ai 1
grip|Tighten the Raj|15|2|goi|mp 300; fn rajGrip|The jewel stays in the crown.|mx dominion; ai 2
airplan|Empire Air Training Scheme|16|2|statute|fed|equip aircraft 150; spirit Commonwealth Air Training: air .12|Aircrew trained under Canadian skies.|
pref|Imperial Preference|17|2|statute|fed|trade CAN, AST, NZL, SAF, RAJ; spirit Sterling Area: tradecap .12|The Empire buys from the Empire.|
canada|Canadian Arsenal|18|2|statute|fed|fn canBuild; rel CAN 20|Lorries and Bren guns from Ontario.|
singapore|Singapore Strategy|19|2|conf|fort Singapore, Hong Kong; equip ships 10|Main fleet to Singapore, when it can be spared.|
malta|Fortress Malta|20|2|mideast|fort Valletta; spirit Unsinkable Carrier: navy .04|A rock in the middle of somebody else's sea.|
egypt|Anglo-Egyptian Treaty|21|2|mideast|rel EGY 30; fn egyDivs|Twenty years' lease on the Canal Zone.|
indind|Indian War Industry|13|3|dominion|fn rajBuild|Jamshedpur steel, Cawnpore boots.|
indarmy|Expand the Indian Army|14|3|dominion|grip|fn rajDivs|The largest volunteer army in history.|
quit|Answer Quit India|15|3|grip|mp 150; fn rajGrip|The Congress leadership is interned.|
anzac|ANZAC Pact|16|3|airplan|fn anzDivs|The diggers sail again.|
smuts|Smuts Prevails|17|3|pref|fn safStay; rel SAF 30|Pretoria votes for war, narrowly.|
convoy|Imperial Convoys|18|3|canada|spirit Convoy System: tradecap .08, navy .05|Sixty ships at seven knots.|
fareast|Eastern Fleet|19|3|singapore|equip ships 25; units inf 2|Capital ships for the Indian Ocean.|
persia|Persian Oil|20|3|malta|egypt|rel PER 20; trade PER, IRQ; spirit Abadan Refinery: supply .08|The Navy runs on Abadan.|
palestine|Palestine White Paper|21|3|egypt|stab 2; rel IRQ 15, SAU 15, EGY 10|A policy that satisfies nobody and holds for now.|
burma|Burma Road Open|14|4|indarmy|rel CHI 30; trade CHI; fort Rangoon|Seven hundred miles of hairpin bends to China.|
wind|Wind of Change|17|4|smuts|anzac|convoy|rmspirit global_commitments; spirit Commonwealth of Nations: stab 5, infl .2, upkeep -.1|An empire becomes a club.|req peace
league|Collective Security|27|0||infl 40; rel FRA 15|The Covenant, for what it is worth.|ai 2; sec Foreign Policy
entente|Entente Renewed|25|1|league|rel FRA 30; fn allyFrance|The alliance of 1914, signed again.|ai 3
allies|The Grand Alliance|27|1|league|faction Allies; fn inviteFranceAllies|Our dominions and the French Republic at our side.|ai 6
stresa|Stresa Front|29|1|league|rel ITA 30; nap ITA|Keep the Duce out of the Führer's arms.|mx sanction; ai 0
sanction|Sanction Italy|30|1|league|rel ITA -30; tension -2; fn sanctionITA|Fifty nations led by one.|mx stresa
staff|Anglo-French Staff Talks|25|2|entente|rel FRA 20; spirit Joint Staff: org .04|Where exactly do we put our four divisions?|
bef|Expeditionary Force|26|2|allies|entente|units inf 5, mot 1; tech m_mot|A continental commitment after all.|ai 3
benelux|Low Countries Guarantee|27|2|allies|guarantee BEL, HOL; rel BEL 20, HOL 20|Britain's frontier is on the Rhine.|
balkans|Balkan Guarantees|28|2|allies|guarantee GRE, YUG; rel TUR 20|Promises easier to give than to keep.|ai 0
ethiopia|Restore the Emperor|30|2|sanction|fn restoreEth|The Lion of Judah waits in Bath.|req atwar ITA
norway|Northern Barrage|25|3|staff|rel NOR 30; guarantee NOR; units mtn 2|Mine the Leads and watch Narvik.|
usa|The Special Relationship|26|3|bef|benelux|rel USA 40; trade USA|In the west, the land is bright.|ai 3
turkey|Turkish Treaty|28|3|balkans|rel TUR 40; nap TUR; trade TUR|Chrome, and a neutral Straits.|
moscow|Mission to Moscow|29|3|balkans|rel SOV 30; nap SOV|A slow boat to Leningrad.|mx contain
contain|Contain Bolshevism|30|3|balkans|rel FIN 30, POL 20, ROM 20; ws 3|Two dictators are no better than one.|mx moscow
freefrench|Recognise Free France|25|4|norway|fn freeFrance|A brigadier with a microphone and no country.|req fraCap
purchase|Purchasing Commission|26|4|usa|fn buyAmerican; money -6|Gold and securities for aircraft.|
bases|Bases for Destroyers|27|4|usa|equip ships 20; rel USA 20|Fifty four-stackers, gratefully received.|req majorwar
med|Mediterranean Strategy|29|4|turkey|moscow|contain|units inf 3, arm 1; spirit Soft Underbelly [730]: atk .05|Knock out the weaker partner first.|req majorwar
exiles|Governments in Exile|25|5|freefrench|mp 150; units inf 3; infl 30|Seven flags fly over London hotels.|
bigthree|The Big Three|27|5|purchase|bases|rel USA 30, SOV 30; infl 60; spirit Grand Strategy: atk .04, org .04|A naughty document and a very long table.|req majorwar
overlord|Second Front Now|27|6|bigthree|units inf 6, arm 2; spirit Combined Operations: navy .1, atk .03|The greatest armada ever assembled.|
percent|Percentages Agreement|28|6|bigthree|guarantee GRE; rel SOV 10; infl 30|Ninety per cent here, ten per cent there, on half a sheet of paper.|
un|United Nations Founder|27|7|overlord|percent|infl 80; spirit Security Council Seat: infl .25, legit 5|A permanent seat at the top table.|
rearm|Limited Rearmament|35|0||build arms 1, aircraftp 1; ws 4|Quietly, the estimates go up.|ai 3; sec Industry
shadow|Shadow Factories|34|1|rearm|build aircraftp 2, arms 2|Car plants that can build fighters.|ai 3
coal|Coal Board|35|1|rearm|build coalm 3, power 1|A quarter of a billion tons a year.|
yards|Clyde and Tyne|36|1|rearm|build shipyard 2, steel 1|The idle slips are busy again.|
motors|Midlands Motor Works|33|2|shadow|build autos 1, engines 2, tankp 1|Coventry and Birmingham retool.|
supply|Ministry of Supply|35|2|shadow|coal|build tools 2; spirit Ministry of Supply: mil_out .1|One buyer for the whole army.|
grid|National Grid|36|2|coal|yards|build power 3; tech p_electrification|Pylons march across the shires.|
dig|Dig for Victory|34|3|supply|build farm 4; spirit Allotments: farm_out .08|Onions in the rose beds.|req war
bevin|The Manpower Budget|35|3|supply|mp 250; spirit Directed Labour: output .05, mil_out .05|Every adult counted and placed.|req war
map|Ministry of Aircraft Production|36|3|supply|grid|build aircraftp 3; equip aircraft 200|Saucepans into fighters.|req war
utility|Utility Scheme|35|4|bevin|dig|spirit Austerity Britain: needs -.1, rad -.03|Fair shares for all.|
reforms|Army Reforms|41|0||spirit army_reform; units inf 3|A war minister who reads Liddell Hart.|ai 2; sec Army
ta|Double the Territorials|39|1|reforms|units inf 6; mp 100|Every battalion splits in two.|
camberley|Staff College|40|1|reforms|generals Miles Dempsey/3/inf, Brian Horrocks/3/off|Two years of map exercises and hunting.|
rac|Royal Armoured Corps|42|1|reforms|tech m_tank1, m_mot; build tankp 1; units arm 1|The cavalry is told to dismount.|
bren|Carrier Platoons|39|2|ta|equip arms 300, autos 150|A tracked taxi for a light machine gun.|
gun25|Twenty-Five Pounder|40|2|camberley|tech m_art1; equip artillery 250; spirit Field Regiment: atk .04|The best field gun of its generation.|
commando|Commandos|41|2|ta|camberley|tech m_mtn; units mtn 2; spirit Raiding Forces: atk .02|Butcher and bolt.|
inftank|Infantry Tanks|42|2|rac|equip tanks 150; spirit Queen of the Battlefield: def .04|Thick armour at walking pace.|mx cruiser
cruiser|Cruiser Tanks|43|2|rac|tech m_tank2; units arm 1|Fast, thin-skinned and elegant.|mx inftank
schools|Battle Schools|40|3|gun25|bren|tech m_doc1; spirit Battle Drill: org .06|Live ammunition over the trainees' heads.|
para|Airborne Forces|41|3|commando|units mtn 2|A maroon beret and a winged horse.|
desert|Desert Rats|42|3|inftank|cruiser|units arm 1, mot 1; spirit Desert Veterans: supply .1|A jerboa on a red field.|
setpiece|The Set-Piece Battle|40|4|schools|spirit Colossal Cracks: atk .05, def .03|No attack until the last shell is stacked.|req war
chindits|Long-Range Penetration|41|4|para|generals Orde Wingate/4/jungle; spirit Jungle Columns: supply .08|Columns supplied entirely from the air.|
funnies|Specialised Armour|42|4|desert|equip tanks 150; spirit Engineer Tanks: atk .04|Tanks that swim, flail, bridge and burn.|
naval|Naval Rearmament|47|0||build shipyard 2; equip ships 20|The holiday from building is over.|ai 2; sec Royal Navy
kgv|New Battleships|45|1|naval|equip ships 40|Fourteen-inch guns, to treaty.|
armoured|Armoured Carriers|47|1|naval|tech m_nav1; equip ships 30; spirit Fleet Air Arm: navy .08|A flight deck that shrugs off bombs.|
corvettes|Corvettes|49|1|naval|equip ships 30; spirit Western Approaches: navy .06, tradecap .06|A whaler's hull, a four-inch gun and seasick reservists.|
scapa|Home Fleet at Scapa|45|2|kgv|fort Glasgow; spirit Northern Anchorage: navy .05|The cork in the North Sea bottle.|
medfleet|Mediterranean Fleet|46|2|kgv|armoured|equip ships 20; fort Alexandria|From Gibraltar to Alexandria.|
asdic|ASDIC and Depth Charges|48|2|corvettes|spirit Anti-Submarine Warfare: navy .1|A ping, an echo, a pattern of ten.|
coastal|Coastal Forces|49|2|corvettes|spirit Motor Gun Boats: navy .03|Plywood and Merlin engines.|
raiders|Hunt the Raiders|46|3|medfleet|scapa|spirit Hunting Groups: navy .06|Three cruisers corner a pocket battleship.|
combined|Combined Operations|47|3|armoured|asdic|units inf 2; spirit Landing Craft: navy .08|Soldiers, sailors and airmen under one headquarters.|
atlantic|Battle of the Atlantic|48|3|asdic|coastal|spirit Convoy Battle [1095]: navy .15, tradecap .1|The only thing that ever really frightened me.|req majorwar
pacific|British Pacific Fleet|47|4|combined|raiders|equip ships 40|The White Ensign returns east of Suez.|req atwar JAP
airmin|Air Expansion Schemes|52|0||build aircraftp 1; tech m_air1; equip aircraft 150|Scheme A, Scheme C, Scheme F…|ai 3; sec Royal Air Force
fighter|Fighter Command|51|1|airmin|equip aircraft 250; spirit Eight-Gun Fighters: air .1|Monoplanes with a thousand horsepower.|ai 3
bomber|Bomber Command|53|1|airmin|tech m_air2; equip aircraft 200; spirit Trenchard Doctrine: bombing .3|The bomber will always get through.|
chain|Chain Home|51|2|fighter|tech m_radar; spirit chain_home|Eyes that see beyond the horizon.|ai 3
coastalc|Coastal Command|52|2|fighter|bomber|spirit Long-Range Patrols: navy .08|Constant endeavour over grey water.|
heavies|Four-Engined Heavies|53|2|bomber|equip aircraft 250; spirit Area Offensive: bombing .3|Seven men and five tons of bombs.|req war
dowding|Sector Control|51|3|chain|spirit Filter Rooms: air .1, civdef .2|A plotting table and a telephone to every squadron.|
tactical|Desert Air Force|52|3|coastalc|tech m_cas; spirit air_doctrine|Fighter-bombers on call from the front line.|
pathfinders|Pathfinder Force|53|3|heavies|spirit Target Marking: bombing .2|Coloured flares for the main force to aim at.|
jet|Jet Engine|52|4|dowding|tactical|pathfinders|tech m_air3|An officer's patent, ignored for ten years.|date 1941-6
tizard|Committee for Scientific Survey|57|0||build university 1; res 25; spirit Boffins: research .05, proj .15|Dons in tweed jackets are given secrets and a budget.|ai 2; sec Science
stationx|Station X|56|1|tizard|proj 30; spirit Ultra Secret: def .05, navy .08, infl .1|A country house full of chess players and crossword solvers.|
magnetron|Cavity Magnetron|57|1|tizard|tech m_radar; proj 30|A block of copper that fits in the hand and changes the war.|
maud|Uranium Committee|58|1|tizard|res 25; proj 40|Two refugees calculate that a few pounds would be enough.|date 1939-9
colossus|Colossus|56|2|stationx|tech s_computing|Fifteen hundred valves reading tape at thirty miles an hour.|date 1942-1
mission|The Black Box Mission|57|2|magnetron|rel USA 30; res 30|Our best secrets, carried to Washington in a deed box.|
tube|Tube Alloys|58|2|maud|tech p_atomic|A deliberately dull name.|date 1941-1
mould|Oxford Penicillin|57|3|mission|tech s_medicine|Grown in bedpans, purified in milk churns.|date 1940-6
`);

TREES.FRA = parseTree('f_', `
republic|The Third Republic|6|0||pp 50; stab 3|Ninety-odd governments in sixty-five years, and still standing.|sec Politics
front|The Popular Front|3|1|republic|fn leaderBlum; ig union 6 .2, ind -4; ideo com 4; stab 4|Bread, peace and liberty.|mx right,leagues; ai 6
right|The National Bloc|8|1|republic|ig ind 5, army 5 .2; ideo aut 8; stab 3|Order before all else.|mx front,leagues; ai 0
leagues|The Leagues March|12|1|republic|ideo fas 12; stab -6|February 1934 again, and this time the bridge is crossed.|mx front,right; ai 0
matignon|Matignon Agreements|2|2|front|law protections; rad -.08; stab 5|Collective contracts and a twelve per cent rise, signed at one in the morning.|ai 4
laval|Deflation Decrees|7|2|right|money 8; rad .05; spirit Franc Fort: tax .08, invest .1|Ten per cent off every state salary.|
petain|The Marshal as Minister|9|2|right|ig army 6; stab 4; spirit Victor of Verdun: legit 6, def .03|The most trusted man in France, and the oldest.|
doriot|The Great Party|12|2|leagues|setIdeo fas; stab -6|A former communist mayor leads the new right.|
forty|Forty-Hour Week|1|3|matignon|ig union 5; spirit Forty Hours: output -.05, rad -.08, stab 4|Two days of rest and two weeks by the sea.|
wheat|Wheat Office|2|3|matignon|build farm 3; ig rural 5|A guaranteed price for the peasant.|
banque|Reform the Bank of France|3|3|matignon|money 8; ig ind -4; spirit Regents Dismissed: tax .08|The two hundred families lose their vote.|
natarms|Nationalise the Arms Industry|4|3|matignon|build arms 2, aircraftp 2, artyf 1|The merchants of death answer to the Republic.|ai 3
etat|L'État Français|8|3|laval|petain|setIdeo aut; rmspirit political_paralysis; rel GER 20, ITA 20|Work, family, fatherland.|ai 0
pretender|Call the Pretender|10|3|petain|law monarchy; legit 8; fn leaderOrleans|The forty kings who made France have an heir.|ai 0
cross|The Fiery Cross|11|3|doriot|units mil 6; ig army 4|Veterans in berets and armbands.|
entente|Paris–Berlin Entente|12|3|doriot|nap GER; rel GER 40|The hereditary enemy becomes a partner.|mx rhine
rhine|The Rhine Frontier|13|3|doriot|claim Luxembourg, Brussels; ws 8|France's natural borders.|mx entente
commune|The Second Commune|0|4|forty|setIdeo com; rmspirit political_paralysis; rel SOV 40|The Wall of the Communards is avenged.|ai 0
pause|The Pause|2|4|forty|wheat|banque|money 6; ig ind 4, union -3; rmspirit f_forty_hours|Reform must catch its breath.|
spain|Arms for Spain|4|4|natarms|fn aidSpainRep|Aircraft slip over the Pyrenees by night.|mx nonint; req spainCW
nonint|Non-Intervention|5|4|natarms|stab 3; rel ENG 15|A committee in London keeps everyone's hands clean.|mx spain; ai 3
charter|Corporatist Charter|7|4|etat|law corporatist; ig union -5|Employers and workers in one compulsory body.|
latin|The Latin Bloc|8|4|etat|rel ITA 40, POR 30; fn latinBloc|Rome, Madrid, Lisbon and Paris.|mx aloof
aloof|Armed Aloofness|9|4|etat|spirit armed_neutrality|France alone.|mx latin
orleans|Constitutional Charter|10|4|pretender|stab 6; law census|A king of the French, not of France.|
axis|Join the Axis|12|4|entente|fn joinAxis|Collaboration, as policy.|
councils|Councils of Workers and Soldiers|0|5|commune|law council; ig union 6 .3|The factories elect the government.|
revive|Revive the National Will|3|5|pause|spain|nonint|rmspirit political_paralysis; stab 8; pp 50|The Republic remembers what it is for.|ai 4
moscow|Paris–Moscow Axis|0|6|councils|fn joinComintern|Two revolutions, one front.|mx fourthint
fourthint|The Fourth International|1|6|councils|fn exportRev; spirit Permanent Revolution: ws 8, infl .2|Neither Washington nor Moscow.|mx moscow
daladier|Government by Decree|3|6|revive|pp 80; spirit Decree Powers: pp .15, mil_out .08|Parliament votes itself a holiday.|ai 3
quai|Quai d'Orsay|18|0||infl 40|The best-informed and least decisive foreign ministry in Europe.|ai 2; sec Diplomacy
petite|Honour the Little Entente|16|1|quai|guarantee CZE, ROM, YUG; rel CZE 20, ROM 20, YUG 20|Our eastern allies must know France keeps her word.|req noParalysis; ai 0
britain|Entente Cordiale|18|1|quai|fn joinAllies; rel ENG 30|Together again, as in 1914.|req ex ENG; ai 5
italy|Franco-Italian Accord|20|1|quai|rel ITA 30; nap ITA|A free hand in Africa for a quiet Alpine border.|mx geneva; ai 0
geneva|Back the League|21|1|quai|rel ITA -25, ENG 10|Sanctions, reluctantly.|mx italy
poland|Polish Alliance Reaffirmed|15|2|petite|rel POL 30; guarantee POL|The treaty of 1921 is taken out of its drawer.|
prague|Stand by Prague|16|2|petite|ws 8; rel CZE 20; fn fortCZE|Forty Czech divisions are worth defending.|
soviet|Franco-Soviet Pact|17|2|britain|petite|rel SOV 30; nap SOV|An eastern counterweight, signed and never staffed.|ai 2
belgium|Belgian Staff Accord|18|2|britain|rel BEL 30; guarantee BEL; fort Lille|Where the Maginot Line ends, Belgium begins.|
council|Supreme War Council|19|2|britain|spirit Allied War Council: org .04, atk .02|Two prime ministers and two commanders-in-chief.|req war
frontier|Hold the Frontier|17|3|belgium|soviet|fort Lille, Metz; spirit Frontier Positions: def .05|Let them come to us.|mx dyle
dyle|The Dyle Plan|18|3|belgium|units mot 1; spirit Advance into Belgium [540]: atk .04|Meet them on someone else's soil.|mx frontier
orders|American Orders|19|3|council|belgium|fn buyAmerican; rel USA 20|Gold shipped to Canada, fighters shipped back.|
sacree|Union Sacrée|18|4|dyle|frontier|orders|rmspirit great_war_trauma, maginot_mentality, peace_dividend; ws 20; law war_econ|Once more, the nation in arms.|req majorwar; ai 10
union|Franco-British Union|18|5|sacree|rel ENG 50; spirit Indissoluble Union: caplimit .2, ws 10|No longer two nations, but one.|req majorwar
algiers|Fight On from Algiers|19|5|sacree|fort Algiers; spirit Empire at War: caplimit .25|The government and the fleet cross the sea.|req enemyOnSoil
appeal|The Appeal of 18 June|19|6|algiers|fn leaderDeGaulle; units inf 4; ws 15|France has lost a battle. France has not lost the war.|
liberation|Liberation|18|7|appeal|union|stab 10; pp 100; rmspirit political_paralysis|Paris outraged, Paris broken, Paris martyred — but Paris liberated.|req own Paris
fourth|The Fourth Republic|18|8|liberation|law universal, pensions; legit 10|A new constitution, by referendum.|req peace
schuman|The Schuman Declaration|18|9|fourth|trade GER, BEL, HOL, LUX, ITA; spirit Coal and Steel Community: output .05, tradecap .1|War between France and Germany becomes materially impossible.|
empire|Greater France|25|0||mp 150; infl 20|A hundred million Frenchmen, on paper.|ai 2; sec Empire
mobilise|Mobilise the Empire|24|1|empire|mp 300; units inf 5|Senegal, Morocco and Tonkin send their sons.|
sahara|Trans-Saharan Railway|25|1|empire|infra 3|A line on the map since 1879.|
citizens|Citizenship Reform|26|1|empire|stab 2; fn coreAlgiers; ig land -3|The vote for an Algerian elite.|mx settlers
settlers|Settler Ascendancy|27|1|empire|ig land 4; mp 100|Algeria is France, say the colons.|mx citizens
africa|Army of Africa|24|2|mobilise|units mtn 2, inf 2; spirit Tirailleurs: manpower .05|Zouaves, spahis and goumiers.|
indochina|Indochina Defence|25|2|sahara|fort Hanoi, Saigon; units inf 2|Ten thousand kilometres from Toulon.|
levant|The Levant Mandates|26|2|citizens|settlers|stab 2; rel IRQ 10, EGY 10; infl 20|Treaties of independence, unratified.|
dakar|Dakar Naval Base|24|3|africa|equip ships 10; fort Dakar|The Atlantic narrows.|
kebir|Fleet at Mers-el-Kébir|25|3|indochina|africa|equip ships 15; fort Oran|A harbour for the battle squadron.|
frunion|The French Union|26|3|levant|spirit French Union: stab 4, manpower .08, upkeep -.05|An empire renamed.|req peace
travaux|Grands Travaux|31|0||build construction 1; infra 3|Public works against unemployment.|ai 2; sec Industry
lorraine|Lorraine Steel|29|1|travaux|build steel 3, ironm 2|The richest iron basin in Europe.|
hydro|Alpine Hydropower|30|1|travaux|tech p_hydro; build power 3|White coal from the Isère and the Rhône.|
sncf|National Railways|31|1|travaux|infra 4; tech p_rail|Five bankrupt companies become one.|
billancourt|Billancourt Works|32|1|travaux|build autos 1, engines 2, tankp 1|A factory on an island in the Seine.|
aviation|Nationalised Aircraft Companies|33|1|travaux|build aircraftp 3|Six regional companies in place of twenty workshops.|
south|Disperse Industry South|30|2|lorraine|hydro|build arms 2, aircraftp 1; spirit Southern Arsenals: civdef .3|Out of range of the Rhine.|
planning|Planning Commissariat|31|2|sncf|hydro|spirit Indicative Planning: build .1, invest .15|A plan that persuades instead of commanding.|
dautry|Ministry of Armaments|32|2|billancourt|aviation|spirit Armaments Ministry: mil_out .12|The man who ran the railways now runs the shell factories.|req tension 30
cnrs|National Research Centre|31|3|planning|build university 2; res 30; spirit Organised Research: research .05, proj .1|Scientists on the state payroll.|
heavywater|Heavy Water Mission|32|3|cnrs|proj 50; res 20|The world's entire stock, in twenty-six cans.|date 1939-9
modernise|Modernise or Decline|31|4|cnrs|south|build tools 2, chem 1, steel 1; spirit Modernisation Plan: output .06|Six basic sectors, five years.|
command|Reform the High Command|37|0||spirit army_reform; pp 30|Too many generals, too few decisions.|ai 2; sec Army
maginot|Extend the Maginot Line|36|1|command|fort Metz, Lille, Lyon; spirit maginot_mentality|Concrete does not bleed.|mx mobile; ai 6
mobile|The Professional Army|38|1|command|tech m_tank1, m_mot; units arm 2, mot 1; spirit manoeuvre_doctrine; rmspirit great_war_trauma, methodical_battle|A hundred thousand specialists in six armoured divisions.|mx maginot; ai 0
ouvrages|New Fronts|35|2|maginot|fort Lille, Marseille; spirit Fortress Troops: def .06, entrench .1|They shall not pass, again.|
alpine|The Alpine Line|36|2|maginot|fort Lyon, Marseille; units mtn 2|Forts cut into the cliffs above Menton.|
interval|Interval Troops|37|2|maginot|units inf 4; equip artillery 150|Infantry to hold the gaps between the forts.|
dcr|Armoured Divisions|38|2|mobile|units arm 2; tech m_tank2|Heavy tanks concentrated at last.|
dlm|Light Mechanised Divisions|39|2|mobile|units mot 2, cav 1; equip autos 200|The cavalry's answer to the panzer division.|
colonial|Colonial Infantry|35|3|ouvrages|units inf 3|Anchors on the collar.|
seventyfive|The Seventy-Five Reborn|36|3|interval|alpine|tech m_art1; equip artillery 250|The gun of 1897 on pneumatic tyres.|
weapons|New Infantry Weapons|37|3|interval|equip arms 400; spirit Modern Small Arms: def .03|A rifle of 1936 for an army of 1916.|
heavy|Heavy Breakthrough Tank|38|3|dcr|equip tanks 200; spirit Battle Tanks: tank .08, def .03|Sixty millimetres of armour and a howitzer in the hull.|
radios|Radios in Every Tank|39|3|dlm|dcr|tech m_radio; spirit Radio Net: org .06|Commanders who can talk to each other.|
legion|Foreign Legion|35|4|colonial|units inf 2; spirit The Legion Is Our Country: org .04|March or die.|
hedgehog|Hedgehog Defence|36|4|seventyfive|ouvrages|spirit Defence in Depth: def .08|Villages turned into strongpoints.|req war
oldguard|Retire the Old Guard|37|4|weapons|heavy|fn retireOld; generals Gaston Billotte/3/off; rmspirit methodical_battle; ig army -3|Generals who remember 1870 are thanked for their service.|
armour|Towards the Army of the Future|38|4|heavy|radios|fn promoteDeGaulle; spirit Combined Armour: atk .05, tank .1|The colonel's book is finally read by his own army.|
marine|Marine Nationale|43|0||build shipyard 2; equip ships 15|The fourth navy in the world.|ai 2; sec Navy and Air
airforce|Armée de l'Air|46|0||build aircraftp 1; tech m_air1; equip aircraft 150|An independent air arm since 1934, and little else.|ai 2
battleships|Fast Battleships|42|1|marine|equip ships 35|All eight guns forward.|
submarines|Submarine Cruisers|43|1|marine|tech m_nav2; equip ships 15|The largest submarine in the world carries a seaplane.|
carrier|Carrier Aviation|44|1|marine|tech m_nav1; equip ships 15|One old carrier and two on the slips.|
planv|Plan V|45|1|airforce|build aircraftp 2; equip aircraft 250|Four thousand modern aircraft, on order.|
fighters|Modern Fighters|46|1|airforce|equip aircraft 250; spirit Cannon Fighters: air .1|A cannon firing through the propeller hub.|
assault|Assault Aviation|47|1|airforce|tech m_cas; spirit Low-Level Attack: cas .2|Bombers at treetop height.|
toulon|Master of the Western Mediterranean|43|2|battleships|submarines|carrier|fort Marseille; spirit Toulon Squadron: navy .1|Toulon to Bizerta is a French lake.|
warning|Territorial Air Defence|46|2|fighters|planv|spirit Air Raid Warning: civdef .25|Watchers on church towers with telephones.|
doctrine|Independent Air Doctrine|47|2|assault|fighters|spirit air_doctrine; tech m_air2|The air force stops being the army's eyes.|
`);

// ---------- Intelligence Agency ----------
Object.assign(SPIRITS, {
  i_counter: ['Counter-Espionage Sweep', 'Every embassy clerk is being watched.', { def: 0.02 }],
  i_plans: ['Stolen War Plans', 'We know where they will strike.', { atk: 0.06, def: 0.04 }]
});
const intelOf = c => c.intel || (c.intel = { lvl: 0, ops: [] });
const AGENCY_COST = [100, 150, 200];
const OPS = {
  steal: { name: 'Steal Blueprints', icon: '📐', cost: 25, days: 60, base: 45, desc: 'Copy a technology they have and we lack.', can: (c, t) => Object.keys(t.techs).some(x => TECHS[x] && !c.techs[x]) ? '' : 'They know nothing we do not',
    win: (c, t) => { const l = Object.keys(t.techs).filter(x => TECHS[x] && !c.techs[x]).sort((a, b) => TECHS[a][2] - TECHS[b][2]); const x = l[0]; if (x && TECHS[x][2] <= year() + 1) { grantTech(c, x); return `We obtained ${TECHS[x][0]}.`; } c.resBank = (c.resBank || 0) + 60; for (const k in c.research) if (c.research[k]) c.research[k].prog += 30; return 'Their papers speed our own research.'; } },
  sabotage: { name: 'Sabotage Industry', icon: '💥', cost: 20, days: 30, base: 50, desc: 'Wreck machinery in their greatest industrial centre.', can: () => '',
    win: (c, t) => { const p = heldBy(t.tag).sort((a, b) => provLevels(b) - provLevels(a))[0]; if (!p) return 'Nothing left to wreck.'; p.dmg = Math.min(0.6, p.dmg + 0.15); return `Fires and derailments cripple ${p.name}.`; } },
  propaganda: { name: 'Spread Propaganda', icon: '📣', cost: 20, days: 45, base: 60, desc: 'Fund newspapers and parties that share our ideology.', can: (c, t) => c.ideology === t.ideology ? 'They already share our ideology' : '',
    win: (c, t) => { shiftSupport(t, { [c.ideology]: 6 }); return `${IDEO[c.ideology][0]} support in ${t.name} grows by 6%.`; } },
  unrest: { name: 'Incite Unrest', icon: '🔥', cost: 25, days: 45, base: 50, desc: 'Strikes, riots and rumours.', can: () => '',
    win: (c, t) => { t.stab = Math.max(0, t.stab - 7); t.rad = Math.min(1, t.rad + 0.05); return `${t.name} loses 7% stability.`; } },
  infiltrate: { name: 'Infiltrate the General Staff', icon: '🗺️', cost: 30, days: 30, base: 45, desc: 'Obtain their operational plans. Gives our armies an edge for six months.', can: (c, t) => atWar(c.tag, t.tag) ? '' : 'Requires being at war with them',
    win: c => { addSpirit(c, 'i_plans', 180); return 'Their war plans are on our desks.'; } },
  coup: { name: 'Stage a Coup', icon: '🗡️', cost: 60, days: 90, base: 10, desc: 'Topple their government and install one of our ideology. Needs local support and instability.', can: (c, t) => c.ideology === t.ideology ? 'They already share our ideology' : t.sup[c.ideology] < 25 ? `Requires 25% ${IDEO[c.ideology][0].toLowerCase()} support there` : t.stab >= 50 ? 'Requires their stability below 50%' : '',
    win: (c, t) => { setIdeology(t, c.ideology); addRel(c.tag, t.tag, 40); return `The government of ${t.name} has fallen to our friends.`; }, lose: (c, t) => { addRel(c.tag, t.tag, -40); c.infamy += 3; } }
};
function opChance(c, t, id) { const o = OPS[id], i = intelOf(c); let ch = o.base + i.lvl * 12 - (t.intel ? t.intel.lvl * 8 : 0) - ({ no_police: 0, guard: 5, secret_police: 15 })[t.laws.security] - (hasSpirit(t, 'i_counter') ? 15 : 0); if (id === 'coup') ch += (t.sup[c.ideology] - 25) * 0.8 + (50 - t.stab) * 0.5; return clamp(ch, 5, 95); }
function opBlock(c, t, id) { const i = intelOf(c), o = OPS[id]; if (!i.lvl) return 'Found an intelligence agency first'; if (i.ops.length > i.lvl) return `Our agency can run ${i.lvl + 1} operations at once`; if (i.ops.some(x => x.t === t.tag)) return 'An operation is already under way there'; if (c.infl < o.cost) return `Requires ${o.cost} influence`; return o.can(c, t); }
function startOp(c, tag, id) { const t = C(tag); if (!t || !t.exists || opBlock(c, t, id)) return false; c.infl -= OPS[id].cost; intelOf(c).ops.push({ op: id, t: tag, until: G.day + OPS[id].days }); return true; }
function upgradeAgency(c) { const i = intelOf(c); if (i.lvl >= 3 || c.pp < AGENCY_COST[i.lvl]) return false; c.pp -= AGENCY_COST[i.lvl]; i.lvl++; return true; }
function counterIntel(c) { if (c.infl < 20 || !intelOf(c).lvl) return false; c.infl -= 20; addSpirit(c, 'i_counter', 365); return true; }
function intelTick(c) {
  const i = c.intel; if (!i || !i.ops.length) return; const due = i.ops.filter(o => o.until <= G.day); if (!due.length) return; i.ops = i.ops.filter(o => o.until > G.day);
  for (const o of due) { const t = C(o.t), d = OPS[o.op]; if (!t || !t.exists) continue; const okk = Math.random() * 100 < opChance(c, t, o.op); let msg;
    if (okk) { msg = d.win(c, t); if (t.tag === G.player) UIH.notify(`Foreign agents are at work: ${d.name.toLowerCase()}.`, 'bad'); }
    else { msg = 'The operation failed.'; if (d.lose) d.lose(c, t); if (Math.random() < 0.5) { addRel(c.tag, o.t, -15); msg += ` Our agents were caught; ${t.name} protests.`; if (t.tag === G.player) UIH.notify(`We have arrested ${c.adj} spies.`, 'good'); } }
    if (c.tag === G.player) UIH.notify(`${d.icon} ${d.name} in ${t.name}: ${okk ? '<b>success</b>' : '<b>failure</b>'}. ${msg}`, okk ? 'good' : 'bad');
    if (o.op === 'coup' && okk) logMsg(`A coup in ${t.name}, backed by ${c.name}, brings a ${IDEO[c.ideology][0].toLowerCase()} government to power.`, 'world'); }
}
function aiIntel(c) {
  if (!c.major && Math.random() > 0.3) return; const i = intelOf(c);
  if (i.lvl < 3 && c.pp > AGENCY_COST[i.lvl] + 150 && Math.random() < (c.major ? 0.25 : 0.05)) upgradeAgency(c);
  if (!i.lvl || i.ops.length > i.lvl || c.infl < 60 || Math.random() > 0.35) return;
  const foes = enemiesOf(c.tag).map(C).filter(t => !t.capitulated), rivals = alive().filter(t => t.tag !== c.tag && !friendly(c.tag, t.tag) && opinion(c.tag, t.tag) < -25 && (t.major || NBcountry(c.tag, t.tag)));
  const t = foes.length ? pick(foes) : rivals.length ? pick(rivals) : null; if (!t) return;
  const order = foes.length ? ['infiltrate', 'sabotage', 'steal', 'unrest'] : ['coup', 'propaganda', 'steal', 'unrest']; for (const id of order.sort(() => Math.random() - 0.4)) if (!opBlock(c, t, id) && (id !== 'coup' || opChance(c, t, id) > 30)) { startOp(c, t.tag, id); return; }
}
const NBcountry = (a, b) => G.P.some(p => p.owner === a && NB[p.id].some(e => !e.sea && P(e.to).owner === b));

// ---------- Lend-Lease ----------
const LEND_GOODS = ['arms', 'artillery', 'tanks', 'aircraft'];
function lendBlock(c, t) { if (c.tag === t.tag) return 'Ourselves'; if (atWar(c.tag, t.tag)) return 'We are at war with them'; if (!isAtWar(t.tag)) return 'They are not at war'; if (hasSpirit(c, 'isolationism')) return 'Blocked by Isolationism'; if (!friendly(c.tag, t.tag) && opinion(c.tag, t.tag) < 10) return 'Our opinion of them is too low'; return ''; }
function setLend(c, tag, pct) { const l = c.lend || (c.lend = {}); if (!pct) { delete l[tag]; return true; } if (lendBlock(c, C(tag))) return false; l[tag] = pct; let tot = 0; for (const k in l) tot += l[k]; if (tot > 0.6) { l[tag] = Math.max(0, pct - (tot - 0.6)); if (!l[tag]) delete l[tag]; } return true; }
function lendLeaseTick(c) {
  const l = c.lend; c.lendOut = 0; if (!l) return;
  for (const tag in l) { const t = C(tag); if (!t || !t.exists || lendBlock(c, t)) { delete l[tag]; if (c.tag === G.player) UIH.notify(`Lend-Lease to ${cname(tag)} has ended.`, 'info'); continue; }
    const loss = (c.blockade || t.blockade) ? 0.3 : 0.04; let val = 0;
    for (const g of LEND_GOODS) { const n = Math.min(c.stock[g] || 0, c.market[g].s * l[tag]); if (n <= 0) continue; c.stock[g] -= n; t.stock[g] = (t.stock[g] || 0) + n * (1 - loss); val += n * c.market[g].p; }
    c.lendOut += val; t.lendIn = (t.lendIn || 0) * 0.5 + val; if ((c.rel[tag] || 0) < 60) addRel(c.tag, tag, 0.4); }
}
function aiLend(c) {
  if (hasSpirit(c, 'isolationism') || !(c.bt.arms && c.bt.arms.lv >= 2)) { c.lend = {}; return; }
  const hard = isAtWar(c.tag) && G.P.some(p => p.owner === c.tag && p.cores.includes(c.tag) && p.ctrl !== c.tag); if (hard) { c.lend = {}; return; }
  const fr = alive().filter(t => !lendBlock(c, t) && !t.capitulated && (friendly(c.tag, t.tag) || (c.major && opinion(c.tag, t.tag) > 35))).sort((a, b) => (a.stock.arms / Math.max(1, a._ndiv || 1)) - (b.stock.arms / Math.max(1, b._ndiv || 1)));
  c.lend = {}; const share = hasSpirit(c, 'arsenal_of_democracy') ? 0.2 : isAtWar(c.tag) ? 0.08 : 0.15; fr.slice(0, 2).forEach(t => setLend(c, t.tag, share));
}

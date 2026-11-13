// Eastern Front update (1.3): focus trees for the Soviet Union, Czechoslovakia, Finland and Romania.
'use strict';
const giveAccess = t => c => { if (ok(t) && !atWar(c.tag, t)) addPact('access', c.tag, t); };
const dropClaimsOf = (who, on) => { G.P.forEach(p => { if (p.owner === on) p.claims = p.claims.filter(t => t !== who); }); claimCache(); };
Object.assign(FNS, {
  shootTukh: [c => { const g = c.gens.find(x => x.name.includes('Tukhachevsky')); if (g) { if (g.army && G.armies[g.army]) G.armies[g.army].gen = null; c.gens.splice(c.gens.indexOf(g), 1); } }, 'Marshal Tukhachevsky is shot'],
  leaderTukh: [setLeader('Mikhail Tukhachevsky', 'Military Directorate'), 'Marshal Tukhachevsky takes power'],
  leaderTsar: [setLeader('Vladimir Kirillovich', 'Zemsky Sobor'), 'A Romanov is called to the throne'],
  evacuate: [c => ['Sverdlovsk', 'Chelyabinsk', 'Novosibirsk', 'Kuibyshev'].forEach(n => { const p = PN(n); if (p.owner === c.tag) { p.b.arms = (p.b.arms || 0) + 1; p.b.steel = (p.b.steel || 0) + 1; p.b.tankp = (p.b.tankp || 0) + 1; } }), 'Arms, steel and tank works rise in the Urals, Siberia and on the Volga'],
  uralBuild: [c => ['Sverdlovsk', 'Chelyabinsk', 'Novosibirsk'].forEach(n => { const p = PN(n); if (p.owner === c.tag) { p.b.steel = (p.b.steel || 0) + 1; p.b.arms = (p.b.arms || 0) + 1; p.b.railway = (p.b.railway || 0) + 1; } }), 'Steel mills, arms factories and railways beyond the Urals'],
  ufaOil: [addRes('Ufa', 'oil', 2), 'New oilfields between the Volga and the Urals'],
  finNickel: [addRes('Oulu', 'iron', 2), 'Nickel is found in the far north'],
  popFronts: [() => ['FRA', 'SPA', 'CZE', 'BEL'].forEach(t => ok(t) && shiftSupport(C(t), { com: 5 })), 'Communist support rises in France, Spain, Czechoslovakia and Belgium'],
  allyWest: [c => { let n = 0; if (ok('FRA') && C('FRA').ai && !hasSpirit(C('FRA'), 'political_paralysis') && !friendly(c.tag, 'FRA')) { addPact('ally', c.tag, 'FRA'); n++; } if (ok('ENG') && C('ENG').ai && !hasSpirit(C('ENG'), 'appeasement') && !friendly(c.tag, 'ENG')) { addPact('ally', c.tag, 'ENG'); n++; } if (!n) c.infl += 40; }, 'Alliances with France and Britain, if they have shaken off paralysis and appeasement'],
  lendFromWest: [c => { c.stock.autos += 400; c.stock.aircraft += 200; c.stock.arms += 400; }, 'Trucks, aircraft and small arms arrive from the West'],
  balticUlt: [c => ['EST', 'LAT', 'LIT'].forEach(t => ok(t) && startPlay(c.tag, t, { type: 'annex' }, { force: C(t).ai && !alive().some(k => k.major && hasPact('guar', k.tag, t)) ? 'concede' : null, days: 15 })), 'Demand the annexation of Estonia, Latvia and Lithuania'],
  finDemand: [softPlay('FIN', 'take', ['Viipuri'], { force: 'resist', days: 20 }), 'Demand the Karelian Isthmus. Finland will refuse.'],
  bessDemand: [softPlay('ROM', 'take', ['Chișinău', 'Czernowitz'], { days: 15 }), 'Demand Bessarabia and northern Bukovina'],
  sovPoland: [c => sovPoland(c), 'Take eastern Poland if Poland is collapsing'],
  monDivs: [() => giveDivs('MON', 'cav', 3), 'Mongolia raises three cavalry divisions'],
  playSIK: [softPlay('SIK', 'puppet', null, { days: 20 }), 'Open a play to make Sinkiang a protectorate'],
  playTabriz: [softPlay('PER', 'take', ['Tabriz'], { days: 25 }), 'Open a play for Iranian Azerbaijan'],
  inviteCom: [c => inviteAll(c, alive().map(k => k.tag), k => k.ideology === 'com'), 'Every communist state is invited to our faction'],
  slovakInd: [c => { const p = PN('Bratislava'); if (p.owner === c.tag) { p.b.arms = (p.b.arms || 0) + 2; p.b.steel = (p.b.steel || 0) + 1; p.b.railway = (p.b.railway || 0) + 1; } }, 'Arms works and a steel mill rise in Slovakia'],
  sovGuar: [c => { if (ok('SOV') && C('SOV').ai && C('SOV').ideology === 'com' && !friendly('SOV', 'GER')) addPact('guar', 'SOV', c.tag); else addRel(c.tag, 'SOV', 15); }, 'The Soviet Union guarantees us (if it is communist and not bound to Germany)'],
  accessSOV: [giveAccess('SOV'), 'Military access agreement with the Soviet Union'],
  accessGER: [giveAccess('GER'), 'Military access agreement with Germany'],
  accessPOL: [giveAccess('POL'), 'Military access agreement with Poland'],
  promoteMannerheim: [c => { const g = c.gens.find(x => x.name.includes('Mannerheim')); if (g) g.skill = 5; else c.gens.push({ id: G.nid++, name: 'Carl Gustaf Mannerheim', skill: 5, trait: 'winter', xp: 0 }); }, 'Mannerheim becomes Marshal of Finland (skill 5)'],
  leaderHesse: [setLeader('Väinö I', 'Royal Government'), 'A king is crowned in Helsinki'],
  leaderMannerheim: [setLeader('Carl Gustaf Mannerheim', 'Regency'), 'Mannerheim becomes Regent'],
  kareliaGift: [c => { const p = PN('Petrozavodsk'); if (p.owner === 'SOV' && C('SOV').ai && friendly(c.tag, 'SOV')) { transferProv(p, c.tag); p.cores.push(c.tag); } else c.infl += 30; }, 'A friendly Moscow cedes East Karelia'],
  inviteNordic: [c => inviteAll(c, ['SWE', 'NOR', 'DEN'], k => opinion(k.tag, c.tag) > 10), 'Sweden, Norway and Denmark are invited'],
  finJoinGer: [c => { const w = G.wars.find(x => (x.att.includes('GER') && x.def.includes('SOV')) || (x.def.includes('GER') && x.att.includes('SOV'))); if (w && !atWar(c.tag, 'SOV')) joinWar(w, c.tag, w.att.includes('GER') ? 'att' : 'def'); }, 'Enter the war against the Soviet Union alongside Germany, without joining its faction'],
  dropSovClaims: [c => dropClaimsOf('SOV', c.tag), 'The Soviet Union drops its claims on our territory'],
  whitePeaceSOV: [c => { const w = G.wars.find(x => (x.att[0] === 'SOV' && x.def[0] === c.tag) || (x.att[0] === c.tag && x.def[0] === 'SOV')); if (w && C('SOV').ai && G.day - w.start > 90 && P(c.capital).ctrl === c.tag) whitePeace(w); else c.ws = Math.min(100, c.ws + 5); }, 'If we lead our own war with Moscow, have held out for three months and still hold the capital, the war ends in a white peace'],
  leaderMichael: [setLeader('Michael I', 'Royal Government'), 'Young King Michael takes the throne'],
  leaderAntonescu: [setLeader('Ion Antonescu', 'Military Government'), 'General Antonescu becomes Conducător'],
  kingCoup: [c => { const f = factionOf(c.tag); if (f && f.leader !== c.tag) { const foes = enemiesOf(c.tag); for (const w of G.wars) { w.att = w.att.filter(t => t !== c.tag); w.def = w.def.filter(t => t !== c.tag); } G._wc = null; leaveFaction(c.tag); c.capitulated = false; restoreControl(); if (ok(f.leader) && foes.length) declareWar(c.tag, f.leader, [{ by: c.tag, vs: f.leader, type: 'conquer' }], null, true); } joinTo(c, 'ENG'); }, 'Leave our faction, make peace with its enemies, turn our guns on its leader and seek the Allies'],
  guarFromGER: [c => { if (ok('GER') && C('GER').ai && C('GER').ideology === 'fas') addPact('guar', 'GER', c.tag); else addRel(c.tag, 'GER', 15); }, 'Fascist Germany guarantees our borders'],
  dropHunClaim: [c => dropClaimsOf('HUN', c.tag), 'Hungary\'s claims on our territory are set aside'],
  dropBulClaim: [c => dropClaimsOf('BUL', c.tag), 'Bulgaria\'s claims on our territory are settled']
});
Object.assign(REQF, {
  attacked: [c => G.wars.some(w => w.def.includes(c.tag) && w.att.some(t => C(t).major)), 'A major power has attacked us'],
  pactOrTension: [() => !!G.flags.mr_pact || G.tension >= 70, 'Molotov–Ribbentrop Pact signed, or world tension 70'],
  polWar: [c => (!!G.flags.mr_pact || isAtWar(c.tag)) && (!ok('POL') || isAtWar('POL')), 'Pact with Berlin signed, and Poland is at war or gone']
});

TREES.SOV = parseTree('s_', `
stalin|Socialism in One Country|5|0||pp 60; stab 3|The revolution will be built here first, whatever it costs.|sec Party
const|The Stalin Constitution|3|1|stalin|legit 8; stab 4; ideo com 4|The most democratic constitution in the world, on paper.|
purge|The Great Purge|6|1|stalin|stab 8; pp 120; rmspirit paranoia; spirit officer_purge [1200]; fn shootTukh ?? Spare the best commanders => generals Konstantin Rokossovsky/5/panzer; stab -2 // Let the organs do their work => pp 60; rad -.08|Enemies of the people are everywhere, even on the General Staff.|mx trust,left; ai 5
trust|Trust the Marshals|9|1|stalin|rmspirit paranoia; spirit red_army_prestige; stab -8; ig army 5 .3|The Red Army is loyal. Let it prepare for the real enemy.|mx purge,left; ai 0
left|The Left Opposition|12|1|stalin|stab -8; pp 60; spirit Permanent Revolution: ws 8, infl .2, drift_com .05|The exiles return and the bureaucrats tremble.|mx purge,trust; ai 0
stakhanov|Stakhanovite Movement|2|2|const|rad .02; spirit Shock Workers: output .05|A hundred and two tons of coal in a single shift.|
cult|Cult of Personality|3|2|const|spirit Father of Nations: stab 6, legit 8, drift_com .05|His portrait hangs in every schoolroom.|
nkvd|The Commissariat of Internal Affairs|5|2|purge|law secret_police; rad -.08; spirit Organs of Security: rad -.1, research -.03|Quotas for arrests, by region.|
trials|The Moscow Trials|6|2|purge|pp 80; ideo com 5; legit -3|Old Bolsheviks confess to the impossible.|
tukh|Tukhachevsky's Reforms|9|2|trust|tech m_doc1, m_doc2; spirit Deep Battle Reborn: atk .06, tank .1|Mechanised corps and airborne brigades, as the Marshal always wanted.|
young|Promote the Young Commanders|10|2|trust|generals Ivan Chernyakhovsky/4/panzer; fn xpAll|Talent rises without a denunciation attached.|
fourth|World Revolution|12|2|left|fn exportRev; infl 50; tension 4|Socialism in one country was always a contradiction.|
nation|Friendship of Peoples|2|3|stakhanov|cult|stab 4; mp 200; spirit Union of Nationalities: manpower .06|A hundred nations, one Union.|
labour|Far Northern Construction|4|3|cult|nkvd|build coalm 2, ironm 2, logging 2; rad .03|Gold, timber and nickel from the frozen east, dug by prisoners.|
beria|A New Commissar|5|3|nkvd|stab 4; fn intelBoost; spirit Controlled Terror: pp .1|The purgers are purged.|
rehab|Release the Officers|6|3|trials|rmspirit officer_purge; generals Kirill Meretskov/3/off, Aleksandr Gorbatov/3/def|Colonels go from the camps straight back to their regiments.|
collective|Collective Leadership|9|3|tukh|young|pp 60; stab 5; spirit Politburo Rule: pp .1, legit 5|No single man shall hold all the reins.|mx bonaparte
bonaparte|The Red Bonaparte|10|3|tukh|setIdeo aut; fn leaderTukh; stab -8|Every revolution ends with a general.|mx collective; ai 0
warcom|War Communism Renewed|12|3|fourth|spirit Militarised Economy: mil_out .15, needs -.1, rad .05|The whole country is a single armed camp.|
church|Peace with the Patriarch|3|4|nation|labour|ig devout 8; stab 5; ws 5|The churches reopen; the bells ring for the front.|req war
soviets|Soviet Democracy|8|4|collective|law protected; ideo dem 8; rad -.08|Contested elections to the soviets.|
nep|A New NEP|9|4|collective|law interventionism; ig rural 6; spirit Market Socialism: invest .2, farm_out .1, rad -.05|The peasant may sell his surplus again.|
directorate|The Military Directorate|10|4|bonaparte|rel GER -10; spirit Rule of the Marshals: org .08, pp .1|Five men in uniform govern a sixth of the earth.|
sobor|Call the Zemsky Sobor|11|4|bonaparte|law monarchy; fn leaderTsar; legit 10|An assembly of the land chooses a tsar.|ai 0
patriot|The Great Patriotic War|5|5|beria|rehab|church|spirit great_patriotic_war; ws 20; mp 600; law requirement; rmspirit officer_purge, rigid_command|Brothers and sisters, I am speaking to you, my friends.|req attacked; ai 10
nostep|Not One Step Back|4|6|patriot|spirit Order 227: def .08, org .05, rad .03|There is no land beyond the Volga.|
evac|Evacuate Industry East|5|6|patriot|fn evacuate; spirit Evacuated Plants: civdef .3|Fifteen hundred factories on a million and a half railway wagons.|
guards|Guards Armies|6|6|patriot|units inf 6, arm 2; spirit Guards Units: atk .05|A title earned in battle, with double pay.|
stavka|Stavka Reserve|5|7|nostep|evac|guards|units inf 8, hvy 2; mp 400|Fresh armies appear where the enemy thought there were none.|
victory|Banner over the Reichstag|5|8|stavka|pp 150; stab 10; spirit Victors: legit 12, ws 10|Raised on the roof by two sergeants.|req own Berlin
narkom|Commissariat for Foreign Affairs|19|0||infl 40|Diplomacy in the service of survival.|sec Foreign Policy
comintern|Comintern Congress|14|1|narkom|spirit export_revolution; infl 30|Delegates from sixty-five parties.|
collsec|Collective Security|16|1|narkom|rel FRA 25, CZE 25, ENG 10; infl 30|Peace is indivisible.|mx revision; ai 0
fareast|Far Eastern Front|18|1|narkom|units inf 4, cav 1; fort Vladivostok, Khabarovsk|The Kwantung Army watches the Amur.|ai 3
revision|Revise the Western Border|21|1|narkom|claim Chișinău, Viipuri, Tallinn, Riga, Kaunas; infl 20|The borders of 1918 were imposed on a weak Russia.|mx collsec; ai 4
spain|Aid the Spanish Republic|24|1|narkom|fn aidSpainRep|Tanks, aircraft and advisers.|req spainCW; ai 4
francopact|Franco-Soviet Pact|15|2|collsec|nap FRA; rel FRA 30|Signed, ratified and never given a staff agreement.|
prague|Stand by Prague|16|2|collsec|guarantee CZE; rel CZE 30|If France moves, we move.|
league|Champion of the League|17|2|collsec|infl 50; tension -3|The outcast of 1919 becomes Geneva's loudest voice.|
japnap|Neutrality Pact with Japan|18|2|fareast|nap JAP|One front at a time.|req ex JAP; ai 3
chinaaid|Aid to China|19|2|fareast|fn aidChina|Keep Japan bogged down.|req chiJapWar; ai 4
pact|Pact with Berlin|21|2|revision|nap GER; flag mr_pact; core Lwów, Równe, Brest-Litovsk, Baranowicze|A toast to the Führer's health.|req ex GER; date 1939-6; ai 6
gold|Spanish Gold|24|2|spain|money 10|Five hundred tons, for safekeeping.|
popfront|Popular Front Line|15|3|francopact|fn popFronts|Communists everywhere are told to embrace the socialists they denounced last year.|
antifascist|Anti-Fascist Coalition|16|3|prague|league|rel ENG 30, FRA 20; fn allyWest|An alliance of convenience against a common enemy.|
mongolia|Mongolian Protectorate|18|3|japnap|chinaaid|rel MON 30; fn monDivs; fort Ulan Bator|A buffer on the steppe.|
sinkiang|Sinkiang Protectorate|19|3|chinaaid|rel SIK 20; fn playSIK|The governor already takes Moscow's advice.|
baltic|Baltic Ultimatums|20|3|revision|fn balticUlt|Mutual assistance, at gunpoint.|req pactOrTension; ai 5
finland|Demands on Finland|21|3|revision|fn finDemand|Leningrad is within artillery range of the border.|req ex FIN & pactOrTension; ai 5
bessarabia|Reclaim Bessarabia|22|3|revision|fn bessDemand|Romania took it in 1918.|req ex ROM & pactOrTension; ai 5
second|Demand a Second Front|16|4|antifascist|rel USA 20, ENG 20; fn lendFromWest|We pay in blood; they may pay in trucks.|req majorwar
august|Far Eastern Offensive|18|4|mongolia|claim Toyohara, Dairen; war JAP|Three fronts strike across the Gobi, the mountains and the Amur.|req ex JAP; date 1944-1; ai 1
balticssr|Baltic Soviet Republics|19|4|baltic|core Tallinn, Riga, Kaunas; mp 80|Three new stars on the coat of arms.|req own Riga
terijoki|A People's Government for Finland|20|4|finland|ws 5; units inf 3|A cabinet of exiles in a border village.|req atwar FIN
poland|Liberate Western Ukraine and Belarus|21|4|baltic|finland|bessarabia|fn sovPoland|Our brothers beyond the Curzon line.|req polWar; ai 6
moldavia|Moldavian Republic|22|4|bessarabia|core Chișinău|The Dniester is no longer a frontier.|req own Chișinău
straits|The Question of the Straits|23|4|bessarabia|claim Istanbul, Erzurum; rel TUR -30|The key to our own front door.|ai 0
karelia|Karelo-Finnish Republic|20|5|terijoki|core Viipuri; pp 40|A sixteenth republic, in hope of more.|req own Viipuri
yalta|Spheres of Influence|21|5|poland|infl 60; rel USA 10, ENG 10|Whoever occupies a territory also imposes his own social system.|req majorwar
iran|Northern Iran|23|5|straits|claim Tabriz; fn playTabriz|Oil concessions and a friendly republic in Tabriz.|ai 0
bloc|People's Democracies|21|6|yalta|fn inviteCom; spirit Fraternal Bloc: infl .2|Friendly governments from the Baltic to the Adriatic.|
eastpact|Eastern Defence Pact|21|7|bloc|units inf 4; spirit Unified Command: org .05, def .05|One command for all the fraternal armies.|
plan3|Third Five-Year Plan|29|0||build steel 3, power 2, tools 2; pp 30|Fulfil and overfulfil.|ai 3; sec Economy
ural|Ural-Kuznetsk Combine|27|1|plan3|fn uralBuild|Industry out of reach of any invader.|ai 3
secondbaku|Second Baku|29|1|plan3|build oilr 3; fn ufaOil; tech p_deepdrill|Oil where no bomber from the west can reach.|
dnieper|Dnieper Hydroelectric|30|1|plan3|tech p_hydro; build power 3|Communism is Soviet power plus electrification.|
mts|Machine-Tractor Stations|31|1|plan3|tech p_tractors; build farm 4; rmspirit collectivised|Tractors hired out to the collectives.|
metro|Palaces for the People|32|1|plan3|build urban 3; stab 3|Marble and chandeliers, forty metres underground.|
magnit|Magnetic Mountain|26|2|ural|build steel 3, ironm 2|A steel city built in a bare steppe.|
kuzbass|Kuzbass Coal|27|2|ural|build coalm 4, power 1|The other end of a two-thousand-kilometre shuttle.|
tankograd|Tankograd|28|2|ural|build tankp 2, engines 2; tech m_tank2|A tractor plant that will not be making tractors.|
gosplan|The State Plan|29|2|secondbaku|dnieper|spirit Balanced Plan: build .1, output .04|Every nail has a line in the ledger.|
railways|Trans-Siberian Double Track|30|2|dnieper|infra 6; tech p_rail|Eight thousand kilometres, both directions.|
plots|Collective-Farm Markets|31|2|mts|ig rural 5; spirit Private Plots: farm_out .1, rad -.04|Half a hectare of one's own feeds the family.|
institutes|Technical Institutes|32|2|metro|build university 2; res 30; spirit Red Specialists: literacy .5, research .05|Engineers by the hundred thousand.|
arsenal|Arsenal of the Revolution|28|3|tankograd|gosplan|build arms 3, artyf 2|Every lathe can be turned to shells.|
aviaprom|Aviation Commissariat|29|3|gosplan|build aircraftp 3|Design bureaus compete; factories copy the winner.|
volga|Factories Beyond the Volga|30|3|railways|gosplan|build arms 2, steel 2, tools 2; spirit Strategic Depth: civdef .3|A duplicate of every vital plant, further east.|
corridor|Lend-Lease Routes|31|3|railways|infra 2; spirit Persian Corridor: supply .1, tradecap .1|Through Iran, the Arctic and across the Pacific.|req majorwar
front|Everything for the Front|29|4|arsenal|aviaprom|volga|law total; spirit All for Victory: mil_out .2, needs -.1|Fourteen-hour shifts in unheated halls.|req majorwar
rebuild|Reconstruction|29|5|front|build construction 2, steel 2, urban 3; rad -.05|Seventeen hundred towns to raise from ashes.|req peace
rkka|Workers' and Peasants' Red Army|38|0||spirit army_reform; units inf 4|The largest army in the world, and it knows it.|ai 2; sec Red Army
academy|The Military Academy|36|1|rkka|generals Nikolai Vatutin/4/off; spirit Staff Academy: org .04|Operational art has a faculty of its own.|
mass|The Mass Army|38|1|rkka|law extensive; mp 500; units inf 6|Universal military duty.|ai 3
mech|Mechanised Corps|40|1|rkka|tech m_tank1, m_mot; build tankp 1; units arm 2|A thousand tanks to a corps.|
deep|Deep Operations|35|2|academy|tech m_doc1; spirit Operational Art: atk .04|Strike the whole depth of the enemy at once.|
commissars|Political Commissars|36|2|academy|spirit Dual Command: org -.03, ws 6, stab 3|Every order needs two signatures.|mx single
single|Unity of Command|37|2|academy|rmspirit rigid_command; spirit One-Man Command: org .06|The commander commands.|mx commissars
rifle|Rifle Divisions|38|2|mass|units inf 8|Three hundred of them, on paper.|
artillery|The God of War|39|2|mass|tech m_art1; equip artillery 400; build artyf 2; spirit Artillery Divisions: atk .06|Two hundred guns to the kilometre.|
t34|The Medium Tank|40|2|mech|tech m_tank2; equip tanks 300|Sloped armour, wide tracks, a diesel engine.|
kv|Heavy Breakthrough Tanks|41|2|mech|equip tanks 150; spirit Heavy Tank Battalions: tank .08|Nothing the enemy fields can pierce it.|date 1939-6
cavmech|Cavalry-Mechanised Groups|42|2|mech|units cav 4, mot 1|Horses go where tanks bog down.|
maskirovka|Maskirovka|35|3|deep|spirit Deception Operations: atk .05, def .03|Whole armies that exist only on the radio.|
partisans|Partisan Movement|36|3|commissars|single|fn intelBoost; spirit People's Avengers: def .03, supply .05|The forests belong to us at night.|req enemyOnSoil
winter|General Winter|37|3|rifle|single|commissars|spirit Winter Warfare: def .05, supply .1|Felt boots and quilted jackets.|
smg|Submachine Guns for All|38|3|rifle|tech m_smg; equip arms 600|Stamped steel and a drum of seventy-one rounds.|
katyusha|Guards Mortars|39|3|artillery|tech m_art2; spirit Rocket Salvoes: atk .05|Sixteen rails on the back of a lorry.|
tankarmy|Tank Armies|40|3|t34|kv|units arm 3; spirit Tank Armies: tank .1, atk .03|Armour massed to exploit, not to support.|req war
heavytank|Heavy Tank Regiments|41|3|kv|tech m_tank3; units arm 1|A hundred and twenty-two millimetres on tracks.|date 1942-6
airborne|Airborne Corps|42|3|cavmech|tech m_mtn; units mtn 3|The first army to drop a whole brigade.|
shock|Shock Armies|35|4|maskirovka|partisans|units hvy 4; spirit Breakthrough Artillery: atk .04|Built to break a front, and to be used up doing it.|
siberians|Siberian Divisions|37|4|winter|units inf 6, mtn 2|Fresh troops from the Far East, in white.|req majorwar
snipers|Sharpshooter Movement|38|4|smg|spirit Marksmen: def .04|One round, one enemy.|
depth|Strategic Offensive|36|5|shock|tankarmy|tech m_doc2, m_doc3; spirit Ten Blows [540]: atk .1|A whole army group ceases to exist in a fortnight.|req majorwar
fleet|Big Fleet Programme|45|0||build shipyard 2; equip ships 20|An ocean-going navy, by decree.|ai 2; sec Red Fleet
subs|Submarine Fleet|44|1|fleet|tech m_nav2; equip ships 30; spirit Largest Submarine Arm: navy .08|More boats than any other navy.|
battleships|Great Battleships|46|1|fleet|equip ships 40|Sixty thousand tons each, if the steel can be found.|
balticf|Baltic Fleet|44|2|subs|fort Leningrad; spirit Kronstadt: navy .05|Bottled up, but dangerous.|
blacksea|Black Sea Fleet|45|2|subs|battleships|fort Sevastopol; equip ships 15|The southern flank rests on it.|
northern|Northern Fleet|46|2|battleships|fort Murmansk; spirit Arctic Convoys: tradecap .05, navy .04|An ice-free port at the top of the world.|
marines|Naval Infantry|45|3|blacksea|balticf|units inf 3; spirit Striped Vests: atk .03|Sailors ashore, with rifles.|
pacific|Pacific Fleet|46|3|northern|blacksea|fort Vladivostok; equip ships 20|Submarines against the Japanese sea lanes.|
vvs|Red Air Fleet|50|0||build aircraftp 2; tech m_air1; equip aircraft 200|More aircraft than anyone; fewer radios.|ai 2; sec Air Force
falcons|Fighter Regiments|49|1|vvs|equip aircraft 300; spirit Fighter Aviation: air .08|Records for speed, altitude and distance.|
shturmovik|The Flying Tank|50|1|vvs|tech m_cas; spirit Armoured Attack Aircraft: cas .3|As necessary to the army as air and bread.|
longrange|Long-Range Aviation|51|1|vvs|tech m_air2; equip aircraft 150|Four-engined giants for parades and distant targets.|
clubs|Flying Clubs|49|2|falcons|mp 100; spirit Trained Reserves: air .06|Every factory has a parachute tower.|
airarmies|Air Armies|50|2|shturmovik|falcons|spirit air_doctrine|A whole air army for each front.|
nightbombers|Night Bomber Regiments|51|2|longrange|spirit Night Harassment: bombing .15, cas .05|Biplanes gliding in with engines cut.|
pvo|Air Defence of the Capital|50|3|airarmies|clubs|fort Moscow; spirit Capital Air Defence: civdef .3, air .05|Rings of guns and balloons around the Kremlin.|
jets|Reactive Aircraft|51|3|nightbombers|airarmies|tech m_air3|A rocket-powered interceptor flies for six minutes.|date 1943-1
sciences|Academy of Sciences|55|0||build university 2; res 30; spirit Soviet Science: research .05, proj .1|Physics has no class enemy, most of the time.|ai 2; sec Science
bureaus|Special Design Bureaus|54|1|sciences|spirit Prison Design Offices: proj .2|The best engineers work behind barbed wire.|
radio|Radio-Location|55|1|sciences|tech m_radar; proj 30|A set that detects aircraft at a hundred kilometres.|
lab2|Laboratory Number Two|56|1|sciences|res 25; proj 40|A physicist of forty is given a tent and a mandate.|date 1942-6
rockets|Reactive Institute|54|2|bureaus|tech m_art2; proj 30|Liquid fuel and solid fuel factions denounce each other.|
espionage|Atomic Espionage|55|2|lab2|radio|fn intelBoost; proj 60|Ten thousand pages from friends abroad.|
lightning|First Lightning|56|2|lab2|tech p_atomic; proj 60|A reactor goes critical in a Moscow suburb.|date 1943-6
bomb|The Bomb|56|3|lightning|espionage|tech p_bomb|A copy first; our own design later.|date 1945-6
`);

TREES.CZE = parseTree('cz_', `
castle|The Castle|4|0||pp 50; stab 4|The President's circle steers the only democracy left east of the Rhine.|sec Politics
benes|Humanist Democracy|2|1|castle|ideo dem 8; legit 6|Truth prevails.|mx agrarian,gottwald,unity; ai 5
agrarian|Authoritarian Democracy|5|1|castle|ideo aut 10; pp 60|The strongest party wants a firmer hand.|mx benes,gottwald,unity; ai 0
gottwald|The Party of Gottwald|8|1|castle|ideo com 12|We go to Moscow to learn how to wring your necks.|mx benes,agrarian,unity; ai 0
unity|National Unity Front|10|1|castle|ideo fas 12; stab -4|One nation, one party, one will.|mx benes,agrarian,gottwald; ai 0
minor|Nationalities Statute|1|2|benes|stab 5; rad -.05; spirit Statute of Nationalities: stab 4|Proportional posts and schools for every nationality.|
slovak|Slovak Autonomy|2|2|benes|stab 3; mp 60; spirit Czecho-Slovak Compromise: legit 5, manpower .05|The Pittsburgh promise, kept at last.|
ban|Ban the Separatist Party|3|2|benes|ideo fas -8; stab -3; rel GER -15; cflag resist|A party that takes its orders from abroad has no place in parliament.|
hodza|The Danubian Plan|4|2|agrarian|trade AUT, HUN, ROM, YUG; spirit Danubian Preference: tradecap .1|Wheat and machinery along the old imperial routes.|
decrees|Presidential Decrees|5|2|agrarian|setIdeo aut; pp 60|Parliament delegates, the government decides.|
between|Neutrality Between Blocs|6|2|agrarian|spirit armed_neutrality|A Switzerland in the heart of Europe.|
popular|Popular Front|8|2|gottwald|setIdeo com; stab -5|The streets of Prague fill with factory militias.|
party|Party of National Unity|10|2|unity|setIdeo fas; stab -5|The old parties dissolve themselves.|
activists|German Activists|1|3|minor|stab 3; rel GER 5; ideo dem 4|German parties that sit in the Czechoslovak government.|
social|Social Insurance|2|3|slovak|minor|law pensions; rad -.06|The Ghent system, extended.|
readiness|Defence of the Republic Act|3|3|ban|law extensive; spirit State of Readiness: ws 10, def .04|Every citizen has a wartime post.|
accommodate|Accommodation with Berlin|5|3|decrees|nap GER; rel GER 30|A small state must live with its large neighbour.|mx defiant
defiant|Defiant Nationalism|6|3|decrees|between|ws 15; cflag resist; rel POL 20|Not a metre.|mx accommodate
moscow|Treaty with Moscow|7|3|popular|fn joinComintern|With the Soviet Union for all time.|mx ownroad
national|Nationalise the Arsenals|8|3|popular|law command; build arms 2, steel 1|The works belong to those who work them.|
ownroad|A Czechoslovak Road|9|3|popular|spirit National Road to Socialism: stab 5, legit 5|Socialism without the Lubyanka.|mx moscow
vienna|Lean on Berlin|10|3|party|fn joinAxis; rel GER 40|Survival as a satellite.|mx slavic
slavic|A Slavic Mission|11|3|party|rel GER -20; spirit Slavic Mission: ws 8, atk .03|The westernmost Slavs, and proud of it.|mx vienna
never|We Shall Not Yield|2|4|readiness|social|ws 20; cflag resist; spirit Fortress Republic: caplimit .2, def .06|Give us arms, we paid for them.|
estates|Estates Economy|5|4|accommodate|defiant|law corporatist; build arms 1|Chambers in place of parties.|
militias|Workers' Militias|8|4|national|moscow|ownroad|units mil 8|Blue overalls and rifles.|
exile|Continuity of the State|2|5|never|infl 30; spirit Government Abroad: caplimit .1|Whatever happens to the territory, the republic exists.|
third|The Third Republic|2|6|exile|stab 8; law welfare_state|A republic that has learned something.|req peace
czernin|Czernin Palace|15|0||infl 40|A foreign ministry larger than the country seems to need.|ai 2; sec Diplomacy
entente|The Little Entente|13|1|czernin|rel ROM 30, YUG 30; allies ROM, YUG|Three states that owe their borders to the same treaties.|
france|The French Alliance|15|1|czernin|rel FRA 30; ally FRA|Signed in 1924, tested soon.|ai 3
soviet|The Soviet Treaty|17|1|czernin|rel SOV 30; nap SOV; fn sovGuar|Valid only if France acts first.|
teschen|Settle Teschen|12|2|entente|rel POL 40; nap POL|A few coal mines are not worth an enemy.|
jointarmy|Little Entente Army|13|2|entente|rel ROM 20, YUG 20; spirit Joint Command: org .04|A common staff in Belgrade.|
danube|Danubian Talks|14|2|entente|france|rel AUT 30, HUN 20; trade AUT, HUN|An economic bloc of the successor states.|
runciman|The Mediator|15|2|france|rel ENG 25; infl 20|A British lord arrives to adjudicate.|
geneva|Presidency of the Assembly|16|2|france|soviet|infl 50; tension -2|Our foreign minister chairs the League.|
airbridge|Soviet Air Bridge|17|2|soviet|equip aircraft 150; rel SOV 20|Bombers ferried over Romania.|
warsaw|Prague–Warsaw Axis|12|3|teschen|ally POL; rel POL 30|The alliance both countries needed and neither wanted.|
austria|Defend Austria|14|3|danube|guarantee AUT; rel AUT 30|If Vienna falls, we are surrounded.|
guarantees|Western Guarantees|15|3|runciman|fn guarFromWest|Paper, unless they mean it.|
passage|Passage for the Red Army|17|3|airbridge|fn accessSOV|The question nobody in Warsaw or Bucharest will answer.|
allies|Join the Allies|15|4|guarantees|austria|fn joinAllies|A small democracy among large ones.|req tension 30
skoda|The Pilsen Works|22|0||build arms 2, artyf 2|One of the three great arsenals of Europe.|ai 3; sec Industry
bata|The Zlín System|20|1|skoda|build textile 3, urban 2; spirit Rational Management: output .05|Shoes for the whole world, from a company town.|
brno|Brno Small Arms|21|1|skoda|build arms 2; equip arms 400; spirit Brno Small Arms: def .03|A light machine gun half the world copies.|
ckd|Prague Tank Works|22|1|skoda|tech m_tank1; build tankp 2; equip tanks 150|Light tanks good enough for anyone's army.|
avia|Aircraft Works|23|1|skoda|build aircraftp 2; tech m_air1|Biplanes that outclimb monoplanes.|
electric|Electrify the Republic|20|2|bata|tech p_electrification; build power 2|Lignite in the north, turbines everywhere.|
exports|Arms Exports|21|2|brno|ckd|money 10; trade ROM, YUG, TUR; spirit Arms Exporter: tradecap .08, mil_out .05|A tenth of the world's arms trade.|
eastward|Move Industry East|22|2|ckd|avia|fn slovakInd; spirit Dispersed Arsenals: civdef .3|Out of the reach of the first day's bombers.|
steel|Ostrava Steel|23|2|avia|build steel 3, coalm 2|Coal and iron within sight of the Polish border.|
tech|Technical Universities|21|3|electric|exports|build university 2; res 25|Brno and Prague train a nation of engineers.|
economy|Supreme Economic Office|22|3|eastward|steel|exports|spirit Defence Economy: mil_out .12|Every factory has its mobilisation orders.|req tension 25
council|Supreme Defence Council|28|0||spirit army_reform; pp 30|A million and a half men in five days.|ai 2; sec Army
forts|Border Fortifications|27|1|council|fort Karlsbad, Reichenberg, Prague|A line modelled on the French, built in half the time.|ai 4
fast|Fast Divisions|29|1|council|tech m_mot; units mot 2, arm 1|Cavalry, cyclists and tanks together.|
airforce|Air Force Expansion|31|1|council|equip aircraft 200; spirit Air Regiments: air .08|Thirteen hundred aircraft, mostly modern.|
artforts|Artillery Forts|26|2|forts|fort Karlsbad, Reichenberg, Brno; spirit Concrete Shield: entrench .15, def .05|Underground barracks linked by railways.|
south|The Southern Line|27|2|forts|fort Brno, Bratislava|The frontier that opened the day Austria vanished.|
mobilise|General Mobilisation|28|2|forts|fast|law extensive; mp 250; units inf 6|The call goes out by radio at night.|req tension 20
lt38|The Light Tank of 1938|29|2|fast|tech m_tank2; equip tanks 200|So reliable its enemies will keep building it.|
howitzers|Heavy Howitzers|30|2|fast|airforce|tech m_art1; equip artillery 300|Siege guns sold to a dozen armies.|
redoubt|Carpathian Redoubt|26|3|artforts|fort Košice, Uzhhorod; tech m_mtn; units mtn 2|If Bohemia falls, the war continues in the east.|
guard|State Defence Guard|27|3|artforts|south|units mil 6, mtn 2|Gendarmes, customs men and volunteers.|
legions|Spirit of the Legions|28|3|mobilise|generals Sergej Vojcechovský/4/def; spirit Legionary Tradition: org .06|Men who crossed Siberia do not frighten easily.|
active|Active Defence|29|3|lt38|howitzers|tech m_doc1; spirit Counter-Attack Reserve: atk .05|Hold the forts, strike with the fast divisions.|
fight|The Army Will Fight|28|4|legions|guard|active|ws 15; cflag resist; spirit Mobilised Nation [540]: def .1, org .08|With allies or without them.|
`);

TREES.FIN = parseTree('fi_', `
republic|The Young Republic|4|0||pp 50; stab 4|Eighteen years old, and still divided by its civil war.|sec Politics
redearth|Red-Earth Coalition|2|1|republic|ig union 5, rural 5; stab 6; ideo dem 6|Social Democrats and Agrarians govern together.|mx lapua,kuusinen; ai 5
lapua|Legacy of Lapua|6|1|republic|ideo fas 10; ig army 5|The peasant march on Helsinki is not forgotten.|mx redearth,kuusinen; ai 0
kuusinen|The Underground Party|8|1|republic|ideo com 12; stab -5|The losers of 1918 have long memories too.|mx redearth,lapua; ai 0
heal|Heal the Wounds of 1918|1|2|redearth|rad -.1; stab 5; spirit National Reconciliation: stab 5, ws 5|Reds and Whites in the same government.|
maternity|The Maternity Package|2|2|redearth|law pensions; spirit Child Welfare: growth .3|A box for every newborn.|
language|Language Peace|3|2|redearth|stab 3; rel SWE 20|Finnish and Swedish, both official.|
ikl|People's Patriotic Movement|6|2|lapua|setIdeo fas; stab -5|Black shirts and blue ties in parliament.|mx crown
crown|Offer the Crown|7|2|lapua|setIdeo aut; law monarchy; fn leaderHesse; rel GER 20|The throne voted in 1918 is filled after all.|mx ikl; ai 0
redfin|Finnish Democratic Republic|8|2|kuusinen|setIdeo com; stab -8|A government that this time is not in exile.|
agrarian|Agrarian Presidency|1|3|heal|pp 60; ig rural 5|A farmer in the presidential palace.|
winterwar|Spirit of the Winter War|2|3|heal|maternity|language|spirit Spirit of the Winter War: def .1, ws 15, caplimit .2|A nation of four million that will not be told what to do.|req war; ai 10
olympics|Helsinki Games|3|3|language|infl 40; build urban 2|A stadium with a seventy-two-metre tower.|req peace
greater|Greater Finland|5|3|ikl|claim Petrozavodsk, Murmansk, Tallinn; ws 10|From the Gulf of Bothnia to the White Sea.|
kindred|Kindred Nations|6|3|ikl|rel EST 30, HUN 15; spirit Kinship Movement: ws 6, manpower .05|Students dream of the Finnic peoples united.|
northaxis|Northern Axis|7|3|ikl|fn joinAxis|Berlin's northernmost ally.|
regent|Mannerheim as Regent|8|3|crown|fn leaderMannerheim; legit 10; ig army 6|The Marshal has done it before.|
friendship|Treaty of Friendship|9|3|redfin|fn joinComintern|Signed in Moscow, as these things are.|
isthmus|Three-Isthmus Border|5|4|greater|claim Arkhangelsk; spirit Kindred Wars [540]: atk .08|The shortest defensible line in the north.|req atwar SOV
exchange|Karelia Exchange|9|4|friendship|fn kareliaGift|Forest for friendship.|
danger|Years of Danger Overcome|2|5|winterwar|stab 8; law welfare_state|The debt is paid and the country is still its own.|req peace
neutral|Path of Neutrality|13|0||infl 30; stab 2|Friends with everyone, allied to no one.|ai 2; sec Foreign Policy
nordic|Nordic Orientation|11|1|neutral|rel SWE 30, NOR 20, DEN 20; trade SWE|Finland is a northern country, not a border state.|ai 3
western|Western Sympathy|13|1|neutral|rel ENG 20, FRA 20, USA 25; infl 20|Sympathy is free.|
german|German Orientation|15|1|neutral|rel GER 30; trade GER|The power that helped in 1918.|mx talks
talks|Moscow Negotiations|16|1|neutral|rel SOV 25; nap SOV|An elderly banker takes the night train east.|mx german
stockholm|The Stockholm Plan|11|2|nordic|ally SWE; fort Helsinki|Joint defence of the Åland islands.|
debts|The Country That Pays Its Debts|13|2|western|rel USA 30; money 6; trade USA|The only one that did.|
estonia|Bridge to Estonia|14|2|western|guarantee EST; rel EST 40|Coastal guns that can close the Gulf from both shores.|
transit|Transit Agreement|15|2|german|equip arms 400, artillery 100; fn accessGER|Troop trains to Norway, and guns in return.|
realism|Realism Toward Moscow|16|2|talks|rel SOV 30; spirit Recognised Geography: stab 3, infl .1|We cannot change our geography, nor can you.|
defence|Nordic Defence Union|11|3|stockholm|faction Nordic Defence Union; fn inviteNordic|Four small states, one shield.|req sovereign
volunteers|Swedish Volunteers|12|3|stockholm|units inf 2; equip aircraft 60; rel SWE 20|Finland's cause is ours.|req war
expedition|Allied Expedition|13|3|debts|fn guarFromWest; equip aircraft 100, arms 300|Help that is always three weeks away.|req war
cobelligerent|Co-Belligerent|15|3|transit|fn finJoinGer|Not an ally: a country fighting the same enemy.|req gerSovWar
concessions|Island Concessions|16|3|realism|rel SOV 40; fn dropSovClaims|A few rocks in the Gulf for a quiet border.|
peace|Peace on Honourable Terms|14|4|volunteers|expedition|cobelligerent|fn whitePeaceSOV|Independence kept, at a price.|req atwar SOV
separate|A Separate War|15|4|cobelligerent|rel USA 10; spirit Separate War: caplimit .1|Our aims stop at our old border.|
green|Green Gold|20|0||build logging 3, furniture 1; trade ENG|Three-quarters of the country is forest.|ai 3; sec Economy
settle|Settlement Act|18|1|green|build farm 3; ig rural 5|Smallholdings for the landless.|
pulp|Pulp and Paper|19|1|green|build chem 1, logging 2; spirit Paper Exports: tradecap .08, tax .04|Newsprint for Fleet Street.|
nickel|Arctic Nickel|20|1|green|fn finNickel; build ironm 2|An ore every great power wants.|
imatra|Rapids Harnessed|21|1|green|tech p_hydro; build power 3|The largest power station in the north.|
coop|Cooperative Movement|19|2|pulp|settle|spirit Cooperatives: rad -.05, invest .15|Dairies and shops owned by their customers.|
copper|Copper of the East|20|2|nickel|build ironm 1, steel 1; tech p_mech_mining|One mine supplies half a continent.|
arsenals|State Arsenals|21|2|imatra|nickel|build arms 2, artyf 1, aircraftp 1|Rifles, guns and fighters under licence.|
yards|Shipyards and Engines|22|2|imatra|build shipyard 1, engines 1|Icebreakers first, then everything else.|
rails|Northern Railways|20|3|copper|coop|infra 3|A line to the Arctic Ocean.|
metal|Metal Industry|21|3|arsenals|yards|build tools 2, engines 1, steel 1; spirit Engineering Nation: output .06|Reparations paid in locomotives build an industry.|req peace
dcouncil|Defence Council|26|0||spirit army_reform; pp 30|An old cavalry general asks for money and gets a little.|ai 2; sec Army
line|The Isthmus Line|25|1|dcouncil|fort Viipuri, Helsinki; spirit Isthmus Bunkers: entrench .12|Granite, logs and a few concrete bunkers.|ai 4
cadre|Cadre Mobilisation|27|1|dcouncil|law extensive; mp 120; units inf 4|Every district raises its own regiment.|ai 3
lotta|Women's Auxiliary|28|1|dcouncil|mp 60; spirit Auxiliaries: manpower .08, supply .05|A hundred thousand volunteers free men for the front.|
civic|Civic Guard|29|1|dcouncil|units mil 6|Every parish has its rifle range.|
volunteerwork|Volunteer Fortification Work|25|2|line|fort Viipuri; stab 2|Students spend the summer digging anti-tank ditches.|
sissi|Guerrilla Tactics|26|2|cadre|line|tech m_mtn; units mtn 3; spirit Pocket Battles: atk .06, def .04|Cut the column into pieces and let the cold do the rest.|
smg|The Submachine Gun|27|2|cadre|equip arms 300; tech m_smg|Seventy rounds in a drum, in a forest fight.|
antitank|Bottles and Satchel Charges|28|2|lotta|civic|spirit Improvised Anti-Tank: def .05|A drink to go with the bread baskets.|
squadron|Fighter Squadrons|29|2|civic|equip aircraft 150; tech m_air1; spirit Loose Pairs: air .1|Tactics the great powers will copy later.|
second|The Second Line|25|3|volunteerwork|fort Helsinki, Oulu; spirit Rear Line: def .05|Twelve hundred kilometres of rock and concrete.|
ski|Ski Troops|26|3|sissi|units mtn 2; spirit White Camouflage: def .05, supply .1|Silent, fast and invisible.|
gunnery|Fire Correction Chart|27|3|smg|sissi|tech m_art1; equip artillery 150; spirit Massed Fires: atk .05|Any battery can fire for any observer.|
captured|Captured Armour|28|3|antitank|equip tanks 80; tech m_tank1|An armoured division built from the enemy's losses.|req war
coast|Coastal Artillery|29|3|squadron|fort Helsinki; equip ships 6; spirit Coastal Forts: navy .05|Twelve-inch guns from the Tsar's fortresses.|
marshal|Marshal of Finland|27|4|gunnery|ski|fn promoteMannerheim; spirit Marshal's Headquarters: org .08, def .04|A title created for one man.|
`);
TREES.ROM = parseTree('ro_', `
carol|The King's Game|5|0||pp 60|Carol plays the parties against each other and wins every hand, so far.|sec Politics
camarilla|The Royal Camarilla|3|1|carol|pp 60; ig land 4; legit -3|The court favourites govern from the palace.|mx liberal,guard,front; ai 4
liberal|Liberal-Peasant Pact|6|1|carol|ideo dem 12|The old parties combine against the King.|mx camarilla,guard,front; ai 0
guard|The Archangel's Legion|9|1|carol|ideo fas 12; stab -5|Green shirts, white horses and death squads.|mx camarilla,liberal,front; ai 0
front|The Ploughmen's Front|11|1|carol|ideo com 12|A country lawyer leads the peasants leftward.|mx camarilla,liberal,guard; ai 0
dictatorship|Royal Dictatorship|3|2|camarilla|law autocracy; pp 50; ideo fas -8; spirit Front of National Rebirth: pp .1, legit 4|One party, and the King at its head.|
maniu|The Peasants' Government|6|2|liberal|setIdeo dem; ig rural 6|An honest man from Transylvania.|
legion|National Legionary State|9|2|guard|setIdeo fas; stab -8|The Captain's movement takes the state.|
groza|The Front in Government|11|2|front|setIdeo com; stab -6|A cabinet the Soviet embassy approves of.|
suppress|Suppress the Guard|2|3|dictatorship|ideo fas -10; stab -3; rad .03|Shot while trying to escape.|mx tame
sentinel|Sentinel of the Motherland|3|3|dictatorship|mp 100; spirit Youth Corps: manpower .05|Every schoolboy in uniform.|
tame|Tame the Guard|4|3|dictatorship|ideo fas 8; ig army -3; stab 3|Bring the wolves into the house.|mx suppress
reform|Land to the Peasants|5|3|maniu|spirit land_reform; ig land -6|The estates were divided once; divide them again.|
constitution|Constitution of 1923|6|3|maniu|law universal, protected; legit 8|The parliamentary charter is restored.|
minorities|Minority Rights|7|3|maniu|stab 4; rel HUN 15, BUL 15|Hungarians, Germans, Jews and Ukrainians are citizens too.|
worksites|Legionary Work Sites|8|3|legion|build construction 1, farm 2; ig rural 4|Volunteer camps build roads and churches.|
greenshirts|Party Militia|9|3|legion|units mil 8|The death teams become regiments.|
axis|Join the Axis|10|3|legion|fn joinAxis|Oil for protection.|
soviet|Soviet Friendship|11|3|groza|fn joinComintern|Geography leaves little choice.|
ploughmen|The Ploughmen's Reform|12|3|groza|ig land -10 -.4, rural 6; build farm 3|No holding over fifty hectares.|
michael|Abdicate for Michael|3|4|suppress|tame|sentinel|fn leaderMichael; legit 8; stab 5|The King leaves on a train full of paintings.|mx holdon
holdon|Carol Holds On|4|4|tame|sentinel|pp 80; legit -5|The throne is not vacant.|mx michael
western|Western Democracy|6|4|constitution|reform|minorities|fn joinAllies; rel FRA 30, ENG 30|Where Romania's heart has always been.|
crusade|Crusade in the East|9|4|axis|greenshirts|claim Odessa; ws 10; spirit Reconquest [540]: atk .06|Soldiers, I order you: cross the Prut.|req gerSovWar
conducator|The Conducător|3|5|michael|holdon|setIdeo aut; fn leaderAntonescu; ig army 8 .2; spirit Military Regime: org .05, pp .1|A general who despises politicians governs without them.|ai 3
coup|The King's Coup|2|6|conducator|setIdeo dem; fn leaderMichael; fn kingCoup|The Marshal is arrested in the palace; the army changes sides overnight.|req war; ai 0
titulescu|Active Diplomacy|16|0||infl 50; rel FRA 20|A foreign minister better known in Geneva than in Bucharest.|ai 2; sec Foreign Policy
little|The Little Entente|14|1|titulescu|rel CZE 30, YUG 30; allies CZE, YUG|Against any revision of Trianon.|ai 3
balkan|The Balkan Entente|15|1|titulescu|rel GRE 25, TUR 25, YUG 15; allies GRE, TUR|Against any revision of Neuilly.|
french|French Guarantee|16|1|titulescu|fn guarFromWest; rel FRA 20|Our Latin sister, a long way off.|
polish|The Polish Alliance|17|1|titulescu|ally POL; rel POL 30|A common frontier with the same eastern neighbour.|
oilarms|Oil for Arms|18|1|titulescu|trade GER; equip arms 400, artillery 100; rel GER 30|A clearing agreement that grows every year.|
craiova|Settle the Dobruja|14|2|little|balkan|rel BUL 40; nap BUL; fn dropBulClaim|A population exchange and a quiet southern border.|
protocol|The Moscow Protocol|15|2|balkan|little|nap SOV; rel SOV 20|Neither side mentions Bessarabia.|mx furrow
furrow|Not One Furrow|16|2|french|little|ws 15; cflag resist; fort Chișinău, Iași; spirit Hold Every Border: caplimit .1, def .04|What we gained in 1918 we keep.|mx protocol
bridgehead|The Romanian Bridgehead|17|2|polish|fn accessPOL; rel POL 20|A way out for an ally, if the worst happens.|
germanguar|German Guarantee|18|2|oilarms|fn guarFromGER; rel GER 20|Protection has a price in barrels.|
neutral|Neutrality Declared|16|3|protocol|furrow|spirit armed_neutrality|We sell to everyone and fight for no one.|
diktat|Avoid the Diktat|18|3|germanguar|fn dropHunClaim; rel HUN -10|Berlin arbitrates in our favour, this time.|
greater|Greater Romania Secured|17|4|bridgehead|furrow|core Chișinău, Czernowitz, Cluj; stab 5; spirit România Mare: legit 6, ws 5|All Romanians in one state.|
transnistria|Beyond the Dniester|18|4|diktat|claim Odessa|Compensation in the east for losses in the west.|req atwar SOV
oil|Black Gold|23|0||build oilr 3, chem 1; tech p_deepdrill|The largest oilfield in Europe outside the Caucasus.|ai 3; sec Economy
grain|Granary of Europe|21|1|oil|build farm 4; tech p_fert; trade GER, ENG|Maize and wheat down the Danube.|
refineries|Refineries|22|1|oil|build chem 2; tech p_petro; spirit Refining Centre: tradecap .08|A ring of stacks around one small city.|
works|Bucharest Works|23|1|oil|build steel 2, arms 2, engines 1|Locomotives, tubes and artillery under one roof.|
steel|Banat Steel|24|1|oil|build steel 2, ironm 2, artyf 1|Furnaces older than the kingdom.|
concessions|Foreign Concessions|21|2|refineries|grain|money 6; rel ENG 15, USA 10; spirit Oil Majors: invest .25|Three-quarters of the oil belongs to foreigners. Let them invest.|mx subsoil
subsoil|Nationalise the Subsoil|22|2|refineries|money 10; rel ENG -15, USA -10; spirit Oil for the Nation: tax .1|By ourselves.|mx concessions
aircraft|Brașov Aircraft|23|2|works|build aircraftp 2; tech m_air1; equip aircraft 100|A home-designed fighter flies.|
ports|Danube and Black Sea Ports|24|2|steel|build port 1, shipyard 1; infra 2|A bridge, a canal and a naval base.|
weapon|The Oil Weapon|22|3|subsoil|concessions|infl 60; spirit Oil Diplomacy: infl .2, tradecap .05|Everyone is polite to the country that fuels their tanks.|
endowment|Rearmament Endowment|23|3|aircraft|ports|subsoil|concessions|build arms 2, tools 1; spirit Endowment Fund: mil_out .1|A ten-year plan for the army, paid in oil.|
staff|Great General Staff|29|0||spirit army_reform; pp 30|Trained in Paris, wondering about Berlin.|ai 2; sec Army
carolline|The Eastern Line|28|1|staff|fort Iași, Chișinău, Timișoara|Casemates along the Dniester and in the west.|
infantry|Infantry Divisions|29|1|staff|units inf 6; equip arms 300|Peasant soldiers who endure anything.|ai 3
cavalry|Cavalry Brigades|30|1|staff|units cav 4; spirit Cavalry Tradition: org .04|Lancers of the red and the black.|
mountain|Mountain Hunters|31|1|staff|tech m_mtn; units mtn 4|The elite of the army.|
airforce|Royal Aeronautics|32|1|staff|equip aircraft 150; spirit Air Flotillas: air .08|French bombers, Polish fighters, our own pilots.|
gate|The Focșani Gate|28|2|carolline|fort Bucharest, Ploiești; spirit Fortified Gap: entrench .12|Eighty kilometres between the mountains and the river.|
guns|French Guns|29|2|infantry|tech m_art1; equip artillery 200; build artyf 1|The artillery of the last war, relined.|
motor|Motorised Cavalry|30|2|cavalry|tech m_mot, m_tank1; units mot 2|Half the squadrons exchange horses for lorries.|
fortress|Carpathian Fortress|31|2|mountain|fort Cluj; spirit Mountain Corps: def .05|The passes held us in 1916.|
navy|Black Sea Division|32|2|airforce|equip ships 8; fort Constanța|Four destroyers and a submarine.|
oilguard|Defence of the Oilfields|29|3|guns|gate|fort Ploiești; spirit Oilfield Flak: civdef .4|The most heavily defended target in Europe.|
tanks|Light Tanks|30|3|motor|equip tanks 150; units arm 1|Bought from Pilsen while it was still for sale.|
doctrine|French School, German Lessons|29|4|oilguard|tanks|fortress|tech m_doc1; spirit Reformed Doctrine: atk .04, org .05|An army relearning its trade in mid-career.|
`);

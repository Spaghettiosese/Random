// Italy (2.0): a hand-written tree. The Duce's road, the King's coup, a liberal restoration or the Resistance;
// the Axis or the Stresa Front; an empire from Libya to the Horn; and an army, navy and air force that must be made real.
'use strict';
Object.assign(FNS, {
  itaSpain: [c => { const t = spainSide('fas')(c) || spainSide('aut')(c); if (t) aidTo(() => t, { arms: 300, artillery: 60, aircraft: 100 })(c); }, 'Arms, aircraft and "volunteers" for the Spanish Nationalists'],
  itaAxis: [c => { if (!ok('GER')) return; if (factionOf('GER')) joinFaction(c.tag, 'GER'); else addPact('ally', c.tag, 'GER'); addRel(c.tag, 'GER', 30); }, 'Join the German faction, or ally with Germany'],
  itaJoinWar: [c => { for (const t of ['FRA', 'ENG']) if (ok(t) && !atWar(c.tag, t) && ok('GER') && atWar('GER', t)) { const w = G.wars.find(x => (x.att.includes('GER') && x.def.includes(t)) || (x.def.includes('GER') && x.att.includes(t))); if (w) joinWar(w, c.tag, w.att.includes('GER') ? 'att' : 'def'); } }, 'Enter Germany\'s war against France and Britain'],
  itaAlbania: [c => { if (ok('ALB') && !friendly(c.tag, 'ALB')) startPlay(c.tag, 'ALB', { type: 'annex' }, { force: C('ALB').ai ? 'concede' : null, days: 10 }); }, 'Albania is given ten days to accept union with the Italian crown; it will yield'],
  itaGreece: [c => { if (ok('GRE') && !atWar(c.tag, 'GRE')) declareWar(c.tag, 'GRE', [{ by: c.tag, vs: 'GRE', type: 'puppet' }], 'Greco-Italian War'); }, 'War with Greece'],
  itaStresa: [c => { if (ok('AUT')) addPact('guar', c.tag, 'AUT'); if (ok('FRA')) addPact('nap', c.tag, 'FRA', 1825); addRel(c.tag, 'ENG', 30); addRel(c.tag, 'FRA', 30); addRel(c.tag, 'GER', -30); }, 'Guarantee Austria; non-aggression with France; relations with Britain and France +30, Germany -30'],
  itaDanube: [c => { if (!factionOf(c.tag)) createFaction(c.tag, 'Danubian Entente'); inviteAll(c, ['AUT', 'HUN', 'YUG'], k => k.ideology !== 'com'); }, 'Found the Danubian Entente with Austria, Hungary and Yugoslavia'],
  itaBreak: [c => { for (const w of G.wars.slice()) if ((w.att.includes(c.tag) || w.def.includes(c.tag)) && (w.att.includes('ENG') || w.def.includes('ENG') || w.att.includes('USA') || w.def.includes('USA'))) { for (const t of ['ENG', 'USA', 'FRA']) if (ok(t) && atWar(c.tag, t) && C(t).ai) separatePeace(c, t); } leaveFaction(c.tag); addRel(c.tag, 'GER', -60); addRel(c.tag, 'ENG', 40); }, 'A separate peace with Britain, France and America, and out of the Axis'],
  itaCobelligerent: [c => { if (ok('GER') && !atWar(c.tag, 'GER')) declareWar(c.tag, 'GER', [{ by: c.tag, vs: 'GER', type: 'take', provs: [PNAME.Innsbruck] }], 'Italian War of Liberation'); joinTo(c, 'ENG'); }, 'War on Germany, and alliance with Britain'],
  itaBalbo: [c => { const g = { id: G.nid++, name: 'Italo Balbo', skill: 4, trait: 'desert', xp: 0 }; c.gens.push(g); c.stock.aircraft += 120; }, 'Italo Balbo returns from Libya: a four-star desert general, and 120 aircraft'],
  itaOil: [c => { const p = PN('Benghazi'); if (p.owner === c.tag) { p.res.oil = Math.min(6, (p.res.oil || 0) + 4); p.b.oilr = (p.b.oilr || 0) + 2; } const q = PN('Tripoli'); if (q.owner === c.tag) { q.res.oil = Math.min(6, (q.res.oil || 0) + 2); q.b.oilr = (q.b.oilr || 0) + 1; } }, 'Oil is found beneath the Libyan sand: oil deposits and wells at Benghazi and Tripoli']
});
Object.assign(REQF, {
  ethPeace: [c => !ok('ETH') || !atWar(c.tag, 'ETH'), 'The war in Ethiopia is over'],
  gerAtWarWest: [() => ok('GER') && ((ok('FRA') && atWar('GER', 'FRA')) || (ok('ENG') && atWar('GER', 'ENG'))), 'Germany is at war with France or Britain'],
  losingWar: [c => isAtWar(c.tag) && (c.warExh > 45 || G.P.some(p => p.owner === c.tag && p.cores.includes(c.tag) && p.ctrl !== c.tag && atWar(c.tag, p.ctrl))), 'At war, and losing: war exhaustion above 45, or Italian soil occupied'],
  gerFriend: [() => ok('GER') && C('GER').ideology === 'fas', 'Germany is fascist']
});
TREES.ITA = autoTree('i_', `
# Politics
regime|The Regime at Fourteen||pp 40; stab 3|Fourteen years since the March on Rome, and the Duce has never been stronger.|ai 6
empire|Proclaim the Empire|regime|spirit new_roman_empire; rmspirit abyssinian_war; core Addis Ababa, Harar, Gondar; stab 6; pp 80 ?? Hold a triumph in Rome => ws 6; legit 5 // Quietly consolidate => money 8; stab 3|After fifteen centuries, the Empire reappears on the fated hills of Rome.|req ethPeace; ai 7
## the duce
duce|The Duce Is Always Right|empire|pp 60; legit 6; bop -5|Mussolini, Mussolini, Mussolini — painted on the walls of every village.|mx king,liberal,resist; ai 6
d_starace|Starace's Party|duce|ig pb 6; law oneparty; spirit Fascist Style: stab 3, sway .1|The Roman salute replaces the handshake; the 'voi' replaces the 'lei'.|
d_ovra|Strengthen the OVRA|duce|law secret_police; fn intelBoost; rad -.08|A secret police whose name means nothing, which is the point.|
d_corporate|The Corporate State|d_starace|law corporatist; ig ind 6, union -6 -.3; spirit Chamber of Fasces and Corporations: pp .08, output .03|Parliament is abolished; employers and syndicates sit in one chamber.|
d_youth|Gioventù Italiana del Littorio|d_starace|mp 120; spirit Book and Musket: manpower .05, train .08|Believe, obey, fight — from the age of eight.|
d_ministry|Ministry of Popular Culture|d_ovra|law censorship; spirit MinCulPop: ws 4, sway .1|The newspapers receive their headlines by telephone each morning.|
d_race|The Racial Laws|d_ovra,d_corporate|rel GER 25; rel USA -20, ENG -10; ig intel -10 -.3; stab -3; spirit Scientists in Exile: research -.04|A manifesto, signed by professors who are told to sign it. Fermi leaves for America.|ai 2
d_cult|Cult of the Duce|d_ministry,d_youth|stab 6; legit 6; spirit The Balcony at Piazza Venezia: ws 5, pp .06|He is photographed bare-chested, threshing wheat.|
d_ciano|Ciano at the Palazzo Chigi|d_cult|infl 40; rel GER 10, HUN 15, YUG 10|The Duce's son-in-law runs foreign policy from a diary.|
d_grand|Silence the Grand Council|d_cult,d_race|pp 80; bop -15; ig army -4; spirit Rule of One: pp .1, legit -3|The council that made him can unmake him. It will not meet.|
d_crown|Subordinate the Crown|d_grand|rmspirit victor_emmanuel; legit 6; bop -15; ig land -6|The First Marshal of the Empire: a rank shared, for now, with the King.|
d_militia|The Blackshirt Divisions|d_grand|units inf 4, mil 6; ig army -4; spirit MVSN Legions: manpower .05, org -.02|Party militia in the line beside the army, and competing with it.|
d_social|The Social Republic Programme|d_crown|ig union 6, ind -6; spirit Socialisation of Industry: output .04, rad -.05|Workers on the boards of the great firms, says the manifesto of Verona.|
d_dictator|Dictatorship Complete|d_crown,d_militia|law autocracy; stab 6; spirit Mussolini's Italy: pp .12, stab 4, ws 5|No King, no Council, no Pope's say.|
d_capo|The Duce Commands the Armed Forces|d_dictator|spirit Supreme Command: org .03, atk .03; ig army -6|He takes personal command of all forces in the field, as the King did in 1915.|req war
d_eternal|The Eternal City|d_dictator,d_social|stab 10; spirit Third Rome: legit 10, ws 6, infl .1|A regime built to last a thousand years, in marble.|
## the king's coup
king|The King Stirs|empire|bop 15; legit 6; stab -4|Victor Emmanuel III has seen three Prime Ministers come and go before this one.|mx duce,liberal,resist; ai 0
k_marshal|Badoglio's Faction|king|ig army 8 .2; generals Pietro Badoglio/4/old|The Chief of Staff remembers who conquered Ethiopia.|
k_court|The Court Party|king|ig land 6, devout 4; pp 50|Dukes, generals and bankers meet at the Quirinal.|
k_grandi|Grandi's Motion|k_marshal,k_court|stab -6; pp 60; bop 15|The Grand Council votes nineteen to eight. The Duce is called to the palace.|
k_arrest|Arrest at the Villa Savoia|k_grandi|setIdeo aut; leader Pietro Badoglio/Government of Generals; stab -6; legit 8|He is placed in an ambulance 'for his own protection'.|
k_dissolve|Dissolve the Party|k_arrest|ig pb -6; rad -.06; pp 40; spirit Fascism Dissolved: legit 5, stab -2|The Blackshirts disband faster than anyone expected.|
k_monarchy|A Constitutional Monarchy|k_dissolve|law census; legit 10; spirit Statuto Restored: stab 4, legit 5|The Statute of 1848 is dusted off.|
k_army|The Army Above Politics|k_arrest|ig army 6; spirit Royal Army: org .04, stab 3|The officers swore an oath to the King, not to the Duce.|
k_neutral|Armed Neutrality|k_monarchy|spirit armed_neutrality; rel ENG 20, FRA 20; tension -3|Italy watches Europe burn and keeps its powder dry.|mx k_switch
k_switch|Change Sides|k_army|fn itaBreak; ws -10|An armistice signed in a Sicilian olive grove.|mx k_neutral; req war
k_cob|Co-Belligerence|k_switch|fn itaCobelligerent; units inf 4|The Royal Army turns its guns north.|req ex GER
k_prince|The Prince of Piedmont|k_monarchy,k_army|legit 8; stab 6; rel ENG 15|Umberto is groomed as a liberal King.|
k_settle|A Royal Settlement|k_prince|stab 10; spirit Crown and Country: legit 8, stab 5|The House of Savoy survives its worst minister.|
## liberal restoration
liberal|The Aventine Returns|empire|ideo dem 14; stab -6; bop 25|The deputies who walked out in 1924 never stopped thinking of coming back.|mx duce,king,resist; ai 0
l_croce|Croce's Manifesto|liberal|ig intel 10 .3; legit 6|The philosopher who answered Gentile is listened to again.|
l_popolari|The Popular Party|liberal|ig devout 6, rural 6; pp 40|A Catholic party with a Sicilian priest's programme.|
l_socialists|The Socialists Return from Paris|liberal|ig union 8; ideo com 4|Nenni and Saragat bring the old party home.|
l_cln|National Liberation Committee|l_croce,l_popolari,l_socialists|setIdeo dem; leader Ivanoe Bonomi/National Liberation Committee; stab -6|Six parties, one committee, and an old reformist as Premier.|
l_assembly|A Constituent Assembly|l_cln|law universal; legit 10; spirit Constituent Assembly: legit 5, pp .05|Women vote for the first time.|
l_press|Free the Press|l_cln|law protected; ig intel 8; rad -.05|Il Corriere prints its own editorials again.|
l_republic|The Question of the Monarchy|l_assembly|stab -4; pp 60 ?? Keep the Crown => law monarchy; ig land 6; legit 4 // Proclaim the Republic => law parliamentary; rename Italian Republic/Italian; ig devout -4; legit 6|Twelve million to ten.|
l_south|Land Reform in the South|l_assembly|spirit land_reform; ig land -10 -.4, rural 10; build farm 3|The latifundia are broken up, at last.|
l_cassa|The Fund for the South|l_south|build construction 1, railway 2; infra 3; money -8; spirit Southern Development: output .03|Roads, aqueducts and schools south of Rome.|
l_allies|Back to the Entente|l_press,l_republic|fn joinAllies; rel ENG 30, FRA 30, USA 30|Italy returns to the side it fought on in 1915.|
l_marshall|American Credit|l_allies|money 20; build tools 2, steel 1|Ships of wheat and coal arrive in Genoa.|
l_europe|A European Vocation|l_marshall,l_cassa|stab 8; spirit European Italy: output .05, tradecap .08, legit 6|A Common Market is first sketched in Messina.|
## the resistance
resist|Giustizia e Libertà|empire|ideo com 12; stab -6|The partisans of justice and liberty were never as dead as the regime said.|mx duce,king,liberal; ai 0
r_turin|The Turin Strikes|resist|ig union 10 .3; rad .06; stab -5|Fiat Mirafiori stops. Then Lancia. Then the trams.|
r_gramsci|Gramsci's Notebooks|resist|ig intel 8; ideo com 6|Thirty notebooks smuggled out of a prison clinic.|
r_partisans|Partisan Brigades|r_turin|units mil 10; spirit Brigate Garibaldi: def .05, manpower .05|In the Alps and the Apennines, brigades with red scarves.|
r_toglatti|Togliatti's Return|r_gramsci,r_partisans|setIdeo com; leader Palmiro Togliatti/PCI; stab -8|'The Best' arrives from Moscow with instructions.|
r_councils|Factory Councils|r_toglatti|law council; ig union 10, ind -10 -.5; spirit Councils in Every Plant: output .04, rad -.05|The occupations of 1920, completed.|
r_land|Land to the Braccianti|r_toglatti|spirit land_reform; ig land -12 -.5, rural 10; mp 150|The day labourers of the Po valley become owners.|
r_moscow|The Eastern Alliance|r_councils|fn joinComintern; rel SOV 40|Italy joins the International it once tried to destroy.|mx r_own
r_own|The Italian Road|r_councils|spirit Polycentrism: stab 5, infl .15|Socialism in the language of Garibaldi.|mx r_moscow
r_republic|The Italian Soviet Republic|r_land,r_moscow|r_land,r_own|rename Italian Socialist Republic/Italian; stab 10; spirit Workers' Italy: output .05, manpower .08, legit 8|The Palace of the Quirinal becomes a museum.|
# Foreign Policy
fp|Ciano's Diary||infl 20; pp 20|A son-in-law, a diary, and a great many receptions.|ai 4
## the axis
axis|Rome–Berlin Axis|fp|fn itaAxis|A vertical line around which Europe may revolve.|req gerFriend; mx stresa; date 1936-10; ai 6
a_anti|Join the Anti-Comintern Pact|axis|rel GER 15, JAP 20; rel SOV -20|Three signatures against an International.|
a_spain|Corpo Truppe Volontarie|fp|fn itaSpain; axp 20; spirit Volunteers in Spain [540]: atk .02|Fascism must win in Spain, and Italy must be seen to help.|req spainCW; ai 6
a_steel|Pact of Steel|a_anti|spirit pact_of_steel; equip arms 150 ?? A defensive alliance, as drafted => rel GER 10 // Any war, any time => ws 6; tension 3|Bound in blood and iron, in a text the Germans wrote.|date 1939-5
a_nonbell|Non-Belligerence|a_steel|ws -4; stab 4; money 6; rel ENG 5|Not neutral, not at war. A new word for a new position.|ai 3
a_hour|Seize the Hour|a_steel|fn itaJoinWar; claim Marseille, Tunis, Algiers, Djibouti; ws 8|A few thousand dead to sit at the peace table.|req gerAtWarWest; date 1940-6; ai 7
a_parallel|The Parallel War|a_hour|spirit Parallel War [365]: atk .05, supply -.05|Our war, beside theirs, not under it.|req war
a_east|Expedition to the East|a_parallel|units inf 6; spirit ARMIR [540]: def .03|An Italian army on the Don, in summer uniforms.|req gerSovWar
a_tripartite|The Tripartite Pact|a_parallel|rel JAP 30; infl 30|Berlin, Rome, Tokyo — and a new order in two hemispheres.|
## the stresa front
stresa|Revive the Stresa Front|fp|fn itaStresa|Contain Germany; Austria is our buffer.|mx axis; ai 0
s_brenner|Divisions on the Brenner|stresa|fort Innsbruck; units mtn 2; rel AUT 30|Four divisions marched to the pass in 1934, and Hitler backed down.|
s_danube|The Danubian Entente|stresa|fn itaDanube|Rome protocols for the whole Danube basin.|
s_france|The Laval Accords|stresa|rel FRA 30; nap FRA; trade FRA|A desert strip in Chad for a free hand in Ethiopia.|
s_britain|The Gentlemen's Agreement|s_france|rel ENG 30; trade ENG; tension -2|The Mediterranean status quo, written down.|
s_guarantee|Guarantee the Small States|s_danube,s_brenner|guarantee AUT; rel CZE 20, YUG 20; infl 40|Rome, not Berlin, will be the protector of central Europe.|
s_allies|Join the Western Alliance|s_britain,s_guarantee|fn joinAllies|Italy chooses the side it chose in 1915.|req tension 40
s_brenner2|The Alpine Wall|s_guarantee|fort Innsbruck, Milan, Venice; spirit Vallo Alpino: def .06|Bunkers facing Germany, built by a fascist state.|
## the balkans
balkan|The Adriatic Question||infl 20|Dalmatia was promised to us in 1915.|ai 3
albania|Union with Albania|balkan|fn itaAlbania|King Zog's little kingdom is already ours in all but name.|req ex ALB; date 1939-4; ai 6
b_tirana|The Albanian Protectorate|albania|build port 1, railway 1; calm; rel ALB 20|Roads, a port and a Viceroy in Tirana.|req own Tirana
b_croats|Sponsor the Ustaše|balkan|rel YUG -20; fn intelBoost|Croatian exiles train in camps near Bologna.|
b_dalmatia|Claim Dalmatia|b_croats|claim Ljubljana, Zagreb, Cetinje|The coast that Venice ruled for four centuries.|
b_yugo|The Yugoslav Ultimatum|b_dalmatia|demand YUG take Ljubljana, Cetinje|Slovenia and Montenegro, or war.|req ex YUG; date 1941-3
b_greece|Break Greece's Back|albania|fn itaGreece; claim Athens, Salonika|An ultimatum delivered at three in the morning.|req ex GRE; date 1940-10; ai 4
b_epirus|The Epirus Front|b_greece|units mtn 3; spirit Mountain War [365]: atk .04, supply .04|Albanian mountains, Greek winter.|req atwar GRE
b_islands|The Ionian Islands|b_greece|claim Athens; equip ships 10|Corfu was bombarded in 1923; next time it will be kept.|
b_viceroy|A Balkan Viceroyalty|b_tirana,b_yugo|b_tirana,b_islands|infl 40; calm; spirit Adriatic Empire: tax .04, manpower .03|The Adriatic becomes an Italian lake.|
## mare nostrum
mare|Mare Nostrum||infl 20; equip ships 10|The Mediterranean is a Roman lake.|ai 4
m_claims|The Lost Provinces|mare|claim Tunis, Valletta, Djibouti, Marseille|Nice, Corsica, Tunis, Malta — the march on them begins in the newspapers.|
m_malta|Neutralise Malta|m_claims|spirit Malta Under Siege [540]: navy .05; claim Valletta|The unsinkable aircraft carrier must be sunk.|req atwar ENG
m_suez|The Road to Suez|m_claims|claim Alexandria, Cairo; spirit Libyan Offensive [365]: atk .06|Through Sidi Barrani to the Canal.|req atwar ENG
m_egypt|An Egyptian Protectorate|m_suez|demand EGY puppet; infl 30|Cairo will choose its friends wisely.|req ex EGY
m_tunis|Tunis Is Italian|m_claims|core Tunis; ws 4|A hundred thousand Italians live there already.|req own Tunis
m_corsica|Corsica and Nice|m_claims|claim Marseille; ws 6|The irredenta, in full.|req franceDown
m_lake|The Roman Lake|m_malta,m_suez|spirit Mare Nostrum: navy .08, tradecap .1|From Gibraltar to Suez under the Italian flag.|
# Empire
africa|The African Empire||stab 2; infl 20|Libya, Eritrea, Somalia and now Ethiopia: four colonies looking for a purpose.|ai 4
## libya
libya|The Fourth Shore|africa|build farm 2, port 1; popgrow 1|Libya is declared part of the metropolis.|
y_balbo|Balbo's Governorship|libya|fn itaBalbo|The aviator who flew across the Atlantic runs Tripoli.|
y_road|The Litoranea|libya|infra 3; build railway 1|Eighteen hundred kilometres of coast road, with a triumphal arch at the border.|
y_settlers|The Twenty Thousand|libya|popgrow 2; build farm 2; mp 20|A fleet sails from Genoa with colonists and their furniture.|
y_oil|Survey the Desert|y_balbo,y_road|res 15; fn itaOil|The geologists were right: there is oil under the sand.|date 1938-1
y_tobruk|Fortify Tobruk|y_road|fort Benghazi; units inf 2|The harbour that will decide the desert war.|
y_desert|Desert Formations|y_tobruk|units mot 2; spirit Sahariana Companies: supply .1, atk .03|Trucks with sand tyres and machine guns.|
y_fezzan|The Fezzan Garrison|y_settlers|fort Sabha; units cav 1|A fort in an oasis.|
## the horn
eth|Pacify Ethiopia|africa|calm; units inf 3; stab 3 ?? Aosta's conciliation => calm; rel ETH 0; legit 4; spirit Lenient Viceroyalty: tax .02 // Graziani's terror => stab -4; spirit Iron Fist in Ethiopia: tax .05, rad .04|Resistance continues in the highlands.|req ethPeace
e_roads|The Imperial Highways|eth|infra 3; build railway 2|Asphalt from Asmara to Addis Ababa.|
e_askari|Askari Battalions|eth|units inf 4, cav 2; spirit Colonial Troops: manpower .05|Eritreans in red fezzes.|
e_aoi|Italian East Africa|e_roads|build farm 2, plantation 1; money 5|A single colony from the Red Sea to the Indian Ocean.|
e_somaliland|British Somaliland|e_askari|claim Djibouti; war ENG|The one British colony we could take.|req atwar ENG
e_kenya|Towards Kenya and Sudan|e_somaliland|claim Khartoum; spirit East African Offensive [365]: atk .05|Kassala, then the Nile.|req atwar ENG
e_hold|Hold the Amba Alagi|e_aoi|fort Asmara; spirit The Duke's Last Stand: def .08|An army cut off from home fights for honour.|req war
## the dodecanese and beyond
dodec|The Dodecanese||build port 1; equip ships 5|A naval base at Leros in sight of Turkey.|ai 2
o_turkey|Reassure Ankara|dodec|rel TUR 25; nap TUR|We will not covet Anatolia this time.|mx o_anatolia
o_anatolia|The Anatolian Claim|dodec|claim Izmir, Adana; rel TUR -30|The coast promised at St Jean de Maurienne.|mx o_turkey
o_levant|Arab Friends|o_turkey|o_anatolia|infl 40; rel IRQ 20, EGY 15; spirit Protector of Islam: infl .1|The Duce is presented with a sword in Tripoli.|
o_cyprus|Cyprus|o_levant|claim Nicosia, Famagusta|An island of no particular use, much coveted.|req atwar ENG
# Economy
autarchia|Autarchia||build steel 2, chem 1, power 1; tech p_synthetic; rmspirit industrial_weakness|Sanctions taught us to rely on ourselves.|ai 4
## the state
iri|The Institute for Industrial Reconstruction|autarchia|law interventionism; build steel 2, shipyard 1; ig ind -4|The state owns the banks that owned the industries.|
w_finsider|Finsider|iri|build steel 2, ironm 1|One state steel company, one plan.|
w_ansaldo|Ansaldo Reorganised|iri|build arms 2, artyf 1, shipyard 1|Genoa's arsenal is modernised.|
w_coal|The Sardinian Coal|w_finsider|build coalm 2; dep Cagliari coal 2|A new town, Carbonia, built around a coal mine.|
w_hydro|White Coal|w_finsider|build power 3; tech p_hydro|Alpine dams power the north.|
w_cogne|The Cogne Steelworks|w_coal,w_hydro|build steel 2, tools 1|Valle d'Aosta's iron, Valle d'Aosta's steel.|
w_agip|AGIP|w_ansaldo|build oilr 1, synth 1; res 10|The state oil company looks for oil everywhere but where it is.|
w_azienda|War Economy Plan|w_cogne,w_agip|spirit Fabbriguerra: mil_out .08|An undersecretariat for war production that produces little.|req tension 40
## industry
fiat|FIAT and the North|autarchia|build autos 2, engines 1; ig ind 6|Mirafiori, the largest factory in Europe, opens in 1939.|
w_mirafiori|Mirafiori|fiat|build autos 2, tools 2|Twenty thousand workers under one roof.|
w_breda|Breda and Caproni|fiat|build aircraftp 2, arms 1|Aircraft and machine guns from the same firms.|
w_olivetti|Olivetti|w_mirafiori|build tools 1, furniture 1; res 15; spirit Enlightened Industry: output .03, research .02|Typewriters, and a factory town with a library.|
w_tanks|Tanks from Turin|w_mirafiori|build tankp 2; tech m_tank1|FIAT-Ansaldo builds the M11, then the M13.|
w_pirelli|Pirelli Rubber|fiat|build chem 1; tech p_petro|Synthetic rubber from Ferrara.|
w_textile|The Textile Districts|fiat|build textile 3|Biella wool, Como silk, Prato rags.|
w_north|The Industrial Triangle|w_breda,w_tanks,w_olivetti|spirit Industrial Triangle: output .06, mil_out .05|Milan, Turin and Genoa carry the war economy.|
## the land
grano|The Battle for Grain|autarchia|build farm 3; spirit Battle for Grain: farm_out .1, needs -.02|The Duce threshes wheat for the newsreels.|
w_pontine|Drain the Pontine Marshes|grano|build farm 3, urban 1; popgrow 1|Five new towns where mosquitoes ruled.|
w_lira|Quota Novanta|grano|money 10; spirit Strong Lira: tax .04, tradecap -.04|Ninety lire to the pound: prestige over exports.|mx w_devalue
w_devalue|Devalue the Lira|grano|money 6; spirit Cheap Lira: tradecap .08, needs .02|Exports first.|mx w_lira
w_south|Develop the Mezzogiorno|w_pontine|build farm 2, railway 1; infra 2; ig rural 6|The South waits, as usual.|
w_rationing|Rationing|w_lira|w_devalue|spirit Ration Cards: needs -.06, stab -2|Two hundred grams of bread a day.|req war
w_bonifica|Bonifica Integrale|w_south,w_pontine|spirit Reclaimed Land: farm_out .1, growth .1|The integral reclamation of Italy.|
# Army
esercito|Reform the Regio Esercito||spirit army_reform; pp 20|Eight million bayonets, the Duce says. Fewer than half have rifles.|ai 3
## doctrine
binary|Binary Divisions|esercito|units inf 6; spirit Two-Regiment Divisions: manpower .05, org -.03|More divisions on paper; each one smaller.|mx triangular
triangular|Restore the Triangular Division|esercito|spirit Three Regiments: org .06; units inf 2|Fewer divisions, but real ones.|mx binary
v_staff|Rebuild the General Staff|binary|triangular|tech m_doc1; xp; rmspirit unready_army|Graziani's purges are reversed; the staff college reopens.|
v_motor|Motorised Divisions|v_staff|tech m_mot; units mot 2|Trento and Trieste get their trucks.|
v_guerra|Guerra di Rapido Corso|v_motor|tech m_doc2; spirit War of Rapid Decision: atk .05, supply -.03|A doctrine of mobile war, on paper since 1938.|
v_armour|The Armoured Divisions|v_motor|tech m_tank1; units arm 2; equip tanks 60|Ariete, Centauro, Littorio.|
v_m13|The M13/40|v_armour|tech m_tank2; build tankp 1|A medium tank, at last — with riveted armour.|
v_semovente|Self-Propelled Guns|v_m13|tech m_art2; units hvy 2; spirit Semoventi: atk .04|A 75mm gun on a tank chassis: the best thing Italy built.|
## the mountains
alpini|The Alpini|esercito|tech m_mtn; units mtn 3|The feather in the cap means mountains.|
v_julia|The Julia Division|alpini|units mtn 2; spirit Alpine Corps: def .05|They will fight on the Don, in snow they know.|
v_winter|Winter Equipment|v_julia|spirit Mountain Winter: def .04, org .03|Boots that do not split at minus twenty.|
v_bersaglieri|Bersaglieri|esercito|units mot 1, inf 2; spirit Bersaglieri: atk .04|Cyclists at the run, cock feathers in the wind.|
v_folgore|The Folgore|v_bersaglieri|units inf 2; spirit Paratroopers: def .06; axp 20|Paratroopers who will fight on foot at El Alamein.|
v_arditi|The Arditi Reborn|v_folgore|spirit Shock Troops: atk .05|Assault companies with daggers and grenades.|
## supply and command
v_trucks|Requisition the Trucks|esercito|equip autos 120; spirit Lorry Columns: supply .08|Every lorry in Italy is painted grey-green.|
v_arty|The Artillery Plan|v_trucks|tech m_art1; equip artillery 200; build artyf 1|Guns from 1915 are replaced, slowly.|
v_rifles|The Carcano 91/38|v_arty|equip arms 400; build arms 1|A new rifle and a new calibre, abandoned halfway.|
v_marshals|The Marshals|v_trucks|generals Giovanni Messe/4/def, Ettore Bastico/3/log, Rodolfo Graziani/3/old|Messe will be Italy's best.|
v_comando|Comando Supremo|v_marshals,v_rifles|spirit Unified Command: org .04, supply .04|Army, navy and air force under one staff, in theory.|
# Navy
marina|The Regia Marina||build shipyard 2; equip ships 20|A modern fleet built to fight the French.|ai 3
## battleships
n_littorio|The Littorio Class|marina|equip ships 40; spirit Fast Battleships: navy .08|Forty-five thousand tons and thirty knots.|
n_cavour|Rebuild the Cavours|n_littorio|equip ships 20|Old dreadnoughts with new engines.|
n_taranto|Taranto Defences|n_cavour|fort Naples; spirit Harbour Nets: navy .04, def .02|Torpedo nets, ordered too late.|
n_fleet|Fleet in Being|n_taranto|spirit A Fleet That Waits: navy .06, upkeep -.04|Its presence is its purpose.|mx n_battle
n_battle|Seek a Decisive Battle|n_taranto|spirit Decisive Engagement: navy .08|Off Calabria, Matapan or Sirte.|mx n_fleet
## the light forces
n_mas|MAS Boats|marina|equip ships 10; spirit Motor Torpedo Boats: navy .05|The boats that sank an Austrian dreadnought in 1918.|
n_decima|Decima MAS|n_mas|spirit Human Torpedoes: navy .08; axp 20|Frogmen ride torpedoes into Alexandria harbour.|
n_subs|The Submarine Arm|marina|tech m_nav2; equip ships 15; spirit Oceanic Submarines: navy .04|The second-largest submarine fleet in the world.|
n_atlantic|BETASOM|n_subs|spirit Bordeaux Flotilla: navy .04, tradecap .03|Italian submarines in the Atlantic, from a French port.|req franceDown
n_convoy|Convoys to Libya|n_mas,n_subs|spirit African Convoys: supply .1|Tripoli is two nights away, if Malta lets us.|
## air at sea
n_aquila|The Carrier Aquila|marina|tech m_nav1; equip ships 20; spirit Carrier Programme: navy .05|A liner becomes an aircraft carrier. Too late, as usual.|
n_radar|Naval Radar|n_aquila|tech m_radar; spirit Night Eyes: navy .06|After Matapan, the navy discovers it cannot see in the dark.|
# Air
aeronautica|The Regia Aeronautica||build aircraftp 1; equip aircraft 100|An air force famous for its records.|ai 3
## fighters
f_cr42|The Last Biplanes|aeronautica|equip aircraft 150|The CR.42 is a superb aircraft, of 1918.|mx f_monoplane
f_monoplane|Monoplanes Now|aeronautica|tech m_air1; equip aircraft 100; spirit Modern Fighters: air .06|Skip a generation.|mx f_cr42
f_engines|Licence the Daimler Engine|f_cr42|f_monoplane|build engines 1, aircraftp 1; rel GER 10|A German engine makes the Macchi a world-class fighter.|
f_macchi|The Macchi Folgore|f_engines|tech m_air2; equip aircraft 150; spirit Folgore Squadrons: air .08|As good as a Spitfire, and a tenth as numerous.|
f_aces|Aces of the Stormo|f_macchi|spirit Stormo Aces: air .06|Pilots with a hundred victories over Spain.|
## bombers
b_sparviero|The Sparviero|aeronautica|equip aircraft 120; spirit Three-Engined Bombers: bombing .1|The hunchback of the Mediterranean.|
b_torpedo|Aerosiluranti|b_sparviero|spirit Torpedo Bombers: navy .08, air .02|The best torpedo bombers in Europe.|
b_douhet|Douhet's Doctrine|b_sparviero|tech m_cas; spirit Command of the Air: bombing .12|The theorist of strategic bombing was an Italian.|
b_balbo|Mass Formation Flights|b_douhet|spirit Balbo's Formations: air .05, infl .1|Twenty-four flying boats over Lake Michigan.|
# Society
lateran|The Lateran Settlement||ig devout 6; stab 3; legit 4|The Roman Question, closed in 1929, must stay closed.|ai 2
c_catholic|Catholic Action|lateran|ig devout 6; rad -.04; spirit Parish Associations: stab 3|Youth clubs the regime tolerates and the Church protects.|mx c_clash
c_clash|Clash with the Vatican|lateran|ig devout -8 -.3; pp 60; legit -3|The Duce's youth movement will have no rivals.|mx c_catholic
c_pope|The Vatican Channel|c_catholic|c_clash|infl 40; fn intelBoost|Every embassy in Rome has an ear at the Holy See.|
c_mori|The Iron Prefect|lateran|calm; rad -.06; spirit Mafia Suppressed: tax .04, stab 2|Cesare Mori besieges whole Sicilian towns.|
c_mezzo|The Southern Question|c_mori|ig rural 6; build farm 2|Six provinces where half the children never finish school.|
c_emigrants|Italians Abroad|lateran|infl 30; rel USA 10, ARG 15, BRA 10; money 5|Twenty million Italians live outside Italy.|
c_return|Call the Emigrants Home|c_emigrants|popgrow 1; mp 40; build farm 1|Settlers for Libya and the Pontine towns.|
c_schools|The Gentile Reform|c_catholic|c_clash|law public; build university 1; spirit Classical Lycée: research .03, literacy .2|Latin and philosophy for the elite, trades for the rest.|
c_cinecitta|Cinecittà|lateran|build urban 1; ws 3; spirit Film City: sway .1|'Cinema is the strongest weapon,' reads the sign at the gate.|
c_venice|The Venice Film Festival|c_cinecitta|infl 30; legit 3|The oldest film festival in the world.|
c_sport|Victories in Sport|c_cinecitta|ws 4; stab 3; spirit World Champions: ws 3|The World Cup twice, the Tour de France, Primo Carnera.|
c_eur|E42: The Third Rome|c_venice,c_sport|build urban 2, construction 1; legit 5; money -6|A whole district of marble for an exhibition that will never open.|
c_futurism|Futurism|c_cinecitta|ig intel 4; res 10|Speed, machines and the glory of war, in verse.|
c_rural|Ruralisation|c_mezzo|ig rural 6; popgrow 1; spirit Back to the Land: farm_out .05, output -.02|Cities are bad for the birth rate, says the regime.|
c_birth|The Battle for Births|c_rural|popgrow 2; spirit Battle for Births: growth .2|A tax on bachelors and medals for mothers.|
c_dopolavoro|The Dopolavoro|c_schools|stab 4; rad -.05; spirit After Work: stab 3|Excursions, bands and theatre for twenty million.|
c_nation|One People, One Faith|c_eur,c_birth,c_dopolavoro|stab 8; spirit United Italy: legit 6, stab 4, manpower .03|Seventy-five years after unification, the Italians are made.|
# Science
scienza|The National Research Council||build university 1; res 20|Marconi presides; the money is short.|ai 2
x_marconi|Marconi's Laboratories|scienza|tech s_radio; res 15|Microwaves on the cliffs at Santa Margherita.|
x_radar|The Radiotelemetro|x_marconi|tech m_radar; spirit Gufo Radar: navy .03, civdef .1|An Italian radar, built from scratch, in time for nothing.|
x_fermi|The Boys of Via Panisperna|scienza|res 25; proj 20|Slow neutrons, and the Nobel Prize.|
x_keep|Keep Fermi in Italy|x_fermi|res 20; proj 30; ig intel 4|A chair, a laboratory and no racial laws for his wife.|mx x_lose
x_lose|Let Them Go|x_fermi|money 4; ig intel -4|Fermi, Segrè and Pontecorvo leave. Others will build the bomb.|mx x_keep
x_synthetic|Synthetic Fuel from Lignite|x_marconi|tech p_synthetic; build synth 1|Tuscan lignite into petrol, at a price.|
x_jet|The Campini Jet|x_synthetic|res 15; spirit Jet Prototype: air .03|The second jet aircraft ever to fly.|
x_medicine|Tropical Medicine|scienza|tech s_medicine; spirit Malaria Control: growth .1, manpower .02|The marshes and the colonies both need quinine.|
x_atom|Uranium Research|x_keep|proj 40; res 20|A reactor in Rome would need uranium from Germany.|date 1941-1
# The Home Front
home|Defence of the Homeland||fort Naples, Palermo, Cagliari|The peninsula is three thousand kilometres of coast.|ai 2
h_sicily|Fortify Sicily|home|fort Palermo; units inf 3|Coastal divisions of older men.|req war
h_coast|Coastal Divisions|h_sicily|units mil 8; spirit Coastal Defence: def .05|Every beach a bunker, on paper.|
h_flak|Anti-Aircraft for the Cities|home|tech s_civildef; spirit Flak over Milan: civdef .25|Milan and Turin learn what the Blitz was.|
h_shelters|Air-Raid Shelters|h_flak|spirit Shelters: civdef .2; build construction 1|Tunnels under Naples, cellars under Rome.|
h_gothic|The Gothic Line|h_coast|fort Florence, Milan; spirit Gothic Line: def .08, entrench .1|A wall across the Apennines.|req losingWar
h_salo|A Northern Republic|h_gothic|stab -6; ws 8; spirit Last Stand of the Regime: caplimit .15, manpower .05|If Rome falls, the government moves to a lakeside town.|req losingWar
h_partisans|Partisans in the Mountains|h_shelters|stir 25; spirit Mountain Bands: def .05|Whoever occupies Italy will fight for every valley.|req losingWar
h_end|The Long Defence|h_salo,h_partisans|h_gothic,h_partisans|spirit Fight for Every Town: def .06, caplimit .1; units inf 4|Italy will not be a corridor.|req losingWar
# Intelligence and Diplomacy
sim|The Military Intelligence Service||fn intelBoost; pp 20|SIM reads the British embassy's safe every night.|ai 2
g_safe|The Embassy Safe|sim|fn intelBoost; spirit Stolen Ciphers: atk .02, navy .03|A footman with a key and a camera.|
g_codes|Break the Naval Codes|g_safe|tech m_radio; spirit Naval Intercepts: navy .05|Convoy routes, a day in advance.|
g_spain|The Spanish Friendship|sim|rel SPA 30; trade SPA; infl 20|Franco owes us, and knows it.|
g_latin|The Latin Bloc|g_spain|rel POR 20, SPA 20, ARG 15; infl 30|Rome, Madrid, Lisbon and Buenos Aires: a Catholic, Latin front.|
g_tokyo|The Tokyo Mission|sim|rel JAP 25; trade JAP; tech m_nav1|Admirals compare notes on carriers.|
g_hungary|Friendship with Budapest|sim|rel HUN 30; trade HUN; infl 20|Rome is Hungary's first friend.|
g_austria|Austria's Protector|g_hungary|rel AUT 30; guarantee AUT|A treaty, a loan and a promise.|mx g_abandon
g_abandon|Abandon Austria|g_hungary|rel GER 30; rel AUT -30|The Brenner is a better frontier than Vienna.|mx g_austria
g_vienna|The Vienna Arbitration|g_austria|g_abandon|infl 40; rel HUN 15, ROM 10|Rome and Berlin divide Transylvania between two clients.|
g_mediation|A Great Power Mediator|g_vienna,g_latin|infl 60; tension -3; spirit Honest Broker: infl .15|At Munich, the Duce translated for everyone.|
g_america|The Italian-American Vote|g_latin|rel USA 20; infl 20|Four million voters in New York, Boston and Chicago.|
g_balkan|The Balkan Pact|g_hungary|rel YUG 20, ROM 15, BUL 15; nap YUG|Belgrade accepts a treaty of friendship.|
g_red|Treaty with Moscow|sim|rel SOV 25; trade SOV; nap SOV|The 1933 treaty of friendship is renewed: oil for ships.|
g_arms|Arms for Export|g_tokyo|money 10; build arms 1; infl 20|Italian aircraft and destroyers for anyone who pays.|
g_league|Leave the League|g_safe|rel ENG -10, FRA -10; tension 2; pp 40|The League voted sanctions; Italy votes with its feet.|
g_neutrals|Watch the Neutrals|g_codes|fn intelBoost; rel SWI 15, SWE 10, POR 10|Bern and Lisbon are the clearing houses of every secret.|
`);

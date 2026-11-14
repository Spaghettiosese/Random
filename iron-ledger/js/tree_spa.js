// Spain (2.2): hand-written. The Popular Front of 1936; the Republic at war and the National Crusade (each side sees its own
// branches); the Spain that wins; and the army, navy, economy, Morocco, Iberia and Church that both sides share.
'use strict';
TREES.SPA = autoTree('es_', `
# The Second Republic
front|The Popular Front Government||pp 40; stab -2|February 1936: the Popular Front wins the election by a hair. The right says it was stolen.|ai 6
f_azana|Azaña to the Presidency|front|legit 4; pp 20 ?? Elevate him to the Presidency => leader Manuel Azaña/Republican Left; legit 4 // Keep him as Prime Minister => pp 30|The Republic's best orator becomes its head of state, and loses his grip on the government.|
f_amnesty|Amnesty for Asturias|front|sfac cnt 4, psoe 4; stab -2|Thirty thousand prisoners of the 1934 rising walk free.|
f_land|Restart the Land Reform|front|ig rural 6, land -6; sfac psoe 4; spirit Agrarian Reform: farm_out .03, stab -2|Peasants occupy the estates of Extremadura before the law can catch up.|
f_generals|Watch the Generals|f_azana|stab 1 ?? Send them to the islands => sunity 5; stab 2; spirit Generals Dispersed [180]: stab 2 // Trust their oath => pp 20|Franco to the Canaries, Goded to the Balearics, Mola to Pamplona.|
f_strikes|The Summer of Strikes|f_amnesty|stab -3; sfac cnt 6|Builders, waiters and farm labourers walk out across Spain.|
f_order|Restore Public Order|f_strikes|stab 4; sfac cnt -4, rep 4|Assault Guards in the streets of Madrid.|
f_calvo|The Murder of Calvo Sotelo|f_generals,f_order|stab -6; ws 6|Assault Guards take the monarchist leader from his bed and shoot him. The plotters set the date.|date 1936-7
f_reform|The Republic Reforms|f_land,f_order|legit 6; stab 2; spirit Reforming Republic: legit 3|Schools, land and a secular state, against all the odds.|
# The Republic at War
r_defend|Defend the Republic!|front|ws 10; units mil 6; sunity 6|"Better to die on your feet than live on your knees." The workers ask for rifles.|req spRep & spWar; ai 6
r_arm|Arm the Unions|r_defend|units mil 6; equip arms 300; sfac cnt 6, psoe 4|The arsenals are opened to the CNT and the UGT.|
r_giral|The Giral Government|r_defend|leader José Giral/Republican Left; rel FRA 10; pp 20|A chemist presides over the first weeks of the war.|
r_caballero|Largo Caballero's Government|r_giral,r_arm|leader Francisco Largo Caballero/PSOE; sfac psoe 8; sunity 8|The "Spanish Lenin" brings the unions, and then the anarchists, into the cabinet.|
r_madrid|No Pasarán|r_caballero|fort Madrid; spirit No Pasarán [365]: def .1, ws 6|The government flees to Valencia; the city holds.|req spWar
r_brigades|The International Brigades|r_madrid|units inf 2; generals Emilio Kléber/3/def; ws 4|Volunteers from fifty countries march into the Casa de Campo.|req spWar
r_soviet|Soviet Aid|r_caballero|rel SOV 25; equip tanks 40, aircraft 60, artillery 60; sfac pce 8|T-26 tanks and Mosca fighters unload at Cartagena.|req spWar
r_gold|The Gold of the Bank of Spain|r_soviet|money 6 ?? Ship it to Moscow => rel SOV 20; equip arms 300, aircraft 40; sfac pce 6 // Ship it to Paris => rel FRA 15; money 10; sfac rep 4|Five hundred tons of gold, the fourth-largest reserve in the world.|
r_popular|The Popular Army|r_brigades,r_soviet|units inf 4; spirit Popular Army: org .05, train .1; sfac pce 6|Militia columns become mixed brigades with commissars and a general staff.|
r_commissars|Political Commissars|r_popular|spirit Commissars: org .03, ws 4; sfac pce 4|Every unit has its political officer.|
r_rojo|General Rojo's Staff|r_popular|generals Vicente Rojo/4/def, José Miaja/3/def; xp|The Republic's best soldier plans its offensives.|
r_collect|The Collectives|r_arm|stab -2 ?? Let the collectives run => sfac cnt 8; ws 4; spirit Collectivised Economy: output -.04, farm_out .02 // Bring them under the state => sfac pce 6, cnt -6; spirit State Control: output .03|Factories and farms in Catalonia and Aragon are run by their workers.|
r_maydays|The May Days|r_collect|stab -4 ?? Side with the Communists => sfac pce 8, cnt -10, poum -6; sunity 6 // Side with the Anarchists => sfac cnt 8, pce -8; rel SOV -15|Shooting at the Barcelona telephone exchange.|date 1937-5; req spWar
r_poum|Outlaw the POUM|r_maydays|sfac poum -15, pce 4; stab 2; legit -3|Andreu Nin disappears in Communist custody.|
r_negrin|Negrín's Government|r_maydays|leader Juan Negrín/PSOE; sunity 10; pp 30|A physiologist who believes the Republic can last until the world war begins.|
r_13|The Thirteen Points|r_negrin|infl 30; rel ENG 10, FRA 10; legit 4|War aims for a democratic Spain, written for London and Paris.|
r_jarama|The Battle of the Jarama|r_madrid|spirit Jarama [180]: def .06; xp|The Brigades hold the Valencia road.|req spWar
r_guadalajara|Guadalajara|r_jarama|ws 8; spirit Victory of Guadalajara [180]: atk .05|Mussolini's Blackshirts are routed in the sleet.|req spWar
r_brunete|The Brunete Offensive|r_rojo|spirit Brunete [180]: atk .06; mp -20|The first great Republican offensive.|req spWar
r_teruel|Teruel|r_brunete|spirit Teruel [180]: atk .05; ws 4|The coldest winter of the century, and a town taken and lost.|req spWar
r_ebro|The Battle of the Ebro|r_teruel,r_13|spirit The Ebro [240]: atk .08, def .05; mp -40|The last great gamble: across the river at night.|req spWar
r_resist|Resistir es Vencer|r_ebro|spirit To Resist Is To Win: def .08, ws 8|Hold on until the war in Europe begins.|req spWar
r_basque|The Basque Statute|r_caballero|sfac reg 8; stab 2; units inf 2|Aguirre's Basque government raises its own army.|
r_catalan|The Generalitat|r_basque|sfac reg 6; build arms 1|Companys' Catalonia runs its own war industry.|
r_france|Open the French Border|r_13|rel FRA 15; equip arms 300, artillery 40|Blum's government lets arms through the Pyrenees, sometimes.|req spWar
r_league|Appeal to the League|r_giral|infl 20; rel ENG 5, FRA 5|Spain's delegate denounces the German and Italian intervention in Geneva.|
r_children|Evacuate the Children|r_resist|stab 2; rel SOV 10, ENG 10, FRA 10|Thousands of children sail for Britain, France and the Soviet Union.|req spWar
r_casado|The Casado Coup|r_resist|stab -4 ?? Negotiate an honourable peace => spsurrender // Fight to the end => ws 10; units mil 4|Colonel Casado rises against Negrín to end the war.|req spWar & losingWar
r_exile|The Retreat to France|r_casado|stab -2; mp -40; rel FRA 10|Half a million cross the Pyrenees in the snow.|req spWar & losingWar
r_victory|Victory of the Republic|r_resist|stab 15; ws 10; pp 100; rmspirit two_spains|Madrid holds; the Republic stands.|req spRep & spWon
# The Republic Victorious
v_peace|The Peace of the Republic|r_victory|stab 6; spirit Republican Reconciliation: stab 3, legit 4|Amnesties, prisoners released, the dead counted.|
v_land|Finish the Land Reform|v_peace|ig rural 10, land -10; build farm 3; spirit land_reform|The great estates are gone.|
v_schools|Ten Thousand Schools|v_peace|law public; spirit Republican Schools: literacy .3|The Republic's promise to the villages.|
v_secular|A Secular State|v_schools|law separation; ig devout -6; stab -2|Church and state, separated for good.|
v_federal|A Federal Republic|v_peace|sfac reg 10; stab 3; spirit Federal Spain: stab 2, output .03|Home rule for Catalonia, the Basque Country and Galicia.|
v_rebuild|Rebuild the Cities|v_peace|build construction 2; infra 2|Madrid, Teruel and Belchite rise from the ruins.|
v_liberal|The Liberal Republic|v_federal,v_secular|setIdeo dem; law universal, protected; legit 8|A parliamentary republic on the French model.|mx v_socialist
v_socialist|The Spanish Socialist Republic|v_federal,v_land|setIdeo com; law command; rename Spanish Socialist Republic/Spanish|The collectives and the commissars inherit the state.|mx v_liberal
v_allies|The Anti-Fascist Front|v_liberal|fn joinAllies; rel ENG 20, FRA 20|The Republic stands with the democracies.|req tension 50
v_comintern|With Moscow|v_socialist|fn joinComintern; rel SOV 30|Spain repays its friend.|
v_morocco|Free Morocco|v_liberal|stab 2 ?? Grant independence => infl 30; rel FRA -10 // Autonomy only => stab 2|The Republic keeps its promise to the Rif.|
v_women|Women in the Republic|v_schools|law equality; legit 4|Clara Campoamor's work finished.|
v_capital|Madrid, Capital of Freedom|v_allies,v_women|v_comintern,v_women|stab 6; spirit Heroic Madrid: ws 4, infl .1|The city that held.|
# The National Crusade
n_rising|The National Rising|front|ws 10; units inf 3; sunity 6|18 July 1936: the Army of Africa rises in Morocco, and garrisons across Spain follow.|req spNat & spWar; ai 6
n_airlift|The Airlift from Morocco|n_rising|units inf 3; rel GER 15, ITA 10; equip aircraft 20|German Junkers fly the Legion and the Regulares across the Strait.|
n_junta|The Junta of National Defence|n_rising|pp 30; sfac army 6|Generals in Burgos form a government.|
n_franco|The Generalísimo|n_junta|leader Francisco Franco/National Movement; sfac army 8; sunity 10|Franco is named head of state and supreme commander, "for the duration".|
n_mola|Mola's Army of the North|n_junta|generals Emilio Mola/3/def, Juan Yagüe/3/off; units inf 2|Columns march on Madrid from the north.|
n_queipo|Queipo de Llano in Seville|n_airlift|sfac army 4; units inf 2; stab -1|A general on the radio takes Seville with bluff and terror.|
n_alcazar|Relieve the Alcázar|n_franco|ws 8; spirit The Alcázar [365]: ws 6, def .03|The cadets of Toledo held out for seventy days.|req spWar
n_madrid|The Assault on Madrid|n_alcazar,n_mola|claim Madrid; spirit Assault on Madrid [180]: atk .06|The columns reach the Casa de Campo.|req spWar
n_condor|The Condor Legion|n_franco|rel GER 25; equip aircraft 80, tanks 20; spirit Condor Legion: air .08, atk .03|A hundred German aircraft and their crews.|req spWar & gerFriend
n_ctv|Italian Volunteers|n_franco|rel ITA 25; units inf 3; equip artillery 60|Fifty thousand Italian soldiers, "volunteers".|req spWar
n_hisma|HISMA|n_condor|trade GER; money 6; rel GER 10|Spanish ore for German weapons, through a trading company.|
n_unify|The Unification Decree|n_franco|merge fal car; leader Francisco Franco/FET y de las JONS; law oneparty; pp 40|Falange and Carlists are fused into one party, under Franco.|
n_falange|The Falange Militias|n_unify|units mil 4; sfac fal 6; ws 4|Blue shirts at the front and in the rearguard.|
n_requetes|The Navarrese Requetés|n_mola|units mtn 2; sfac car 6|Red berets from the villages of Navarre.|
n_legion|The Spanish Legion|n_airlift|units inf 2; spirit The Legion: atk .04, org .02|"Long live death!"|
n_regulares|The Regulares|n_legion|units inf 2; mp 30|Moroccan troops recruited in the Rif.|
n_north|The Northern Campaign|n_madrid|claim Bilbao, Santander, Oviedo; spirit Northern Campaign [240]: atk .05|If Madrid will not fall, take the north and its factories.|req spWar
n_bilbao|The Iron Belt|n_north|claim Bilbao; spirit Siege Guns: atk .04|Bilbao's fortifications, betrayed by their own engineer.|req spWar
n_steel|The Basque Steel|n_bilbao|build steel 1; money 6|The mills of Bilbao work for the Crusade.|req hold Bilbao
n_aragon|The Aragon Offensive|n_north|claim Lleida, Zaragoza; spirit Aragon Offensive [180]: atk .06|To the Mediterranean, cutting the Republic in two.|req spWar
n_catalonia|The Catalonia Offensive|n_aragon|claim Barcelona; spirit Catalonia Offensive [180]: atk .06|Barcelona falls without a fight.|req spWar
n_final|The Last Offensive|n_catalonia|claim Madrid, Valencia; spirit The Last Offensive [120]: atk .08|"Today, with the Red Army captive and disarmed..."|req spWar
n_church|The Crusade|n_franco|sfac chu 8; ig devout 8; ws 4|The bishops' collective letter: a war for God.|
n_burgos|The Burgos Government|n_unify|pp 30; law decree; spirit Burgos Ministries: tax .04|A real state, with ministries and a currency.|
n_recognition|Recognition|n_burgos|infl 30 ?? Seek London's recognition => rel ENG 15 // Seek the Vatican's => sfac chu 6; legit 4|The powers line up to recognise the winner.|
n_blockade|Blockade the Republic|n_burgos|spirit Naval Blockade: navy .08|Italian submarines and our cruisers close the ports.|req spWar
n_victory|Victory Day|n_final|stab 15; ws 10; pp 100; rmspirit two_spains|1 April 1939: "The war has ended."|req spNat & spWon
# Franco's Spain
s_new|The New State|n_victory|law oneparty, censorship; pp 50|One party, one church, one Caudillo.|
s_hunger|The Years of Hunger|s_new|stab -2 ?? Ration and wait => stab 2; spirit Rationing: needs -.15 // Import grain from Argentina => money -6; stab 3; rel ARG 10|Bread made from chestnut flour.|
s_purge|The Repression|s_new|stab 2 ?? Mass tribunals => rad -.1; legit -8; resist SPA -10 // Clemency for the rank and file => legit 4; stab 2|Military courts sit in every town.|
s_autarky|Autarky|s_new|law autarky; spirit Spanish Autarky: output -.02, mil_out .04|Spain will make everything itself.|
s_ini|The National Institute of Industry|s_autarky|build steel 1, chem 1, engines 1; spirit INI: build .05|State firms for steel, trucks and fertiliser.|
s_hendaye|The Hendaye Meeting|s_new|infl 20 ?? Enter the war => fn joinAxis; rel GER 30 // Non-belligerence => rel GER 10, ENG -5; money 6 // Strict neutrality => spirit armed_neutrality; rel ENG 15|Hitler and Franco meet on a railway platform. Hitler says he would rather have teeth pulled.|req year 1940
s_felix|Operation Felix|s_hendaye|claim Gibraltar; ws 6|Take the Rock with German help.|req gerFriend & tension 60
s_gibraltar|The Rock|s_felix|core Gibraltar; stab 4|Gibraltar is Spanish again.|req hold Gibraltar
s_morocco|French Morocco|s_hendaye|claim Fez, Rabat, Casablanca|Greater Morocco under the Spanish flag.|req franceDown
s_oran|Oran|s_morocco|claim Oran|A Spanish city until 1792.|req franceDown
s_blue|The Blue Division|s_hendaye|units inf 2; rel GER 20; ws 4|Volunteers for the crusade against Bolshevism.|req gerSovWar
s_wolfram|The Wolfram War|s_hendaye|money 8 ?? Sell to Germany => rel GER 10; money 4 // Sell to the Allies => rel ENG 10, USA 10; money 4|Both sides bid for the tungsten of Galicia.|req year 1942
s_succession|The Law of Succession|s_purge|sfac mon 10; legit 6|Spain is declared a kingdom, without a king.|req year 1942
s_donjuan|Restore Don Juan|s_succession|setIdeo aut; leader Juan de Borbón/Monarchy; sfac mon 20; legit 10|The Count of Barcelona returns from Lausanne.|mx s_caudillo
s_caudillo|Caudillo for Life|s_succession|pp 60; sfac army 8; spirit Caudillo: pp .1, stab 3|The King can wait.|mx s_donjuan
s_americans|American Bases|s_caudillo|s_donjuan|rel USA 30; money 10; equip aircraft 40|Dollars and jets in return for bases.|req year 1944
s_opus|The Technocrats|s_ini|spirit Technocrats: output .04, tax .03; res 10|Engineers from Opus Dei replace the Falangists in the economic ministries.|
s_tourism|Sun and Beaches|s_opus|money 8; infl 10|The Costa del Sol discovers foreign visitors.|
# The Army
a_root|The Army of Spain||spirit army_reform; pp 20|Too many officers, too few rifles, and an Army of Africa that is the only one fit to fight.|ai 3
a_africa|The Army of Africa|a_root|units inf 2; spirit Africanistas: atk .04|Hard men from the Rif war.|
a_officers|Reform the Officer Corps|a_root|xp; generals Juan Vigón/3/def, José Solchaga/3/off|Fewer generals, better colonels.|
a_rifles|Mausers from Oviedo|a_root|equip arms 300; build arms 1|The Oviedo arms factory works three shifts.|
a_artillery|The Artillery Parks|a_rifles|tech m_art1; equip artillery 60|Guns from Trubia.|
a_tanks|Tank Battalions|a_artillery|tech m_tank1; equip tanks 30; units arm 1|Captured T-26s and German Panzer Is.|
a_motor|Motorised Columns|a_tanks|tech m_mot; units mot 1|Trucks for the columns.|
a_mtn|Mountain Troops|a_officers|tech m_mtn; units mtn 2|The Pyrenees and the Cantabrian range.|
a_lessons|Lessons of the Civil War|a_motor,a_mtn|spirit Civil War Veterans: atk .04, def .04, org .03|We have fought the war the others are only planning.|req spWon
a_reserve|The Reserves|a_officers|mp 80; law extensive|Every class called up.|
a_frontier|Fortify the Pyrenees|a_reserve|fort Lleida, Corunna; spirit Pyrenean Line: def .04|A wall against anyone from the north.|
a_divs|New Divisions|a_reserve|units inf 4|Spain can field fifty divisions.|req war
a_staff|The War College|a_lessons|tech m_doc1; spirit Spanish Staff: org .03|Officers trained on the battlefields of 1936-39.|
a_coast|Coastal Batteries|a_frontier|fort Cádiz, Palma|Guns on the Strait and the Balearics.|
a_doctrine|Doctrine of the Mixed Brigade|a_staff,a_coast|spirit Mixed Brigades: atk .03, def .03|Infantry, guns and engineers in one unit.|
# Navy and Air
na_root|The Navy and Air Force||equip ships 6, aircraft 30|Two cruisers, a dozen destroyers, and an air force split in two by the war.|ai 2
na_canarias|The Cruiser Canarias|na_root|equip ships 6; spirit Heavy Cruisers: navy .04|The most powerful ship in the Spanish navy.|
na_ferrol|The Ferrol Yards|na_canarias|build shipyard 1|Destroyers built at home.|
na_subs|Submarines|na_ferrol|equip ships 4; tech m_nav2|Italian help for a submarine flotilla.|
na_strait|Command of the Strait|na_subs|spirit Strait of Gibraltar: navy .05, def .02|No convoy passes Gibraltar without our consent.|
na_balearic|The Balearic Base|na_strait|fort Palma; build port 1|Mallorca, an aircraft carrier in the Mediterranean.|
na_air|The Air Force|na_root|equip aircraft 40; tech m_air1|Moscas and Chatos, or Fiats and Heinkels.|
na_aces|The Aces of the War|na_air|spirit Spanish Aces: air .06|García Morato and his patrol.|
na_bombers|Bomber Wings|na_aces|equip aircraft 40; spirit Bomber Wings: bombing .06|Savoias and Tupolevs.|
na_flak|Air Defence of the Cities|na_air|tech s_civildef; spirit City Air Defence: civdef .25|Madrid and Barcelona learned what bombs do.|
na_hispano|Hispano-Suiza|na_bombers,na_flak|build aircraftp 1; build engines 1|Aircraft engines from Barcelona.|
# Economy
e_root|The Spanish Economy||money 4; build farm 1|Oranges, olive oil, iron ore and mercury.|ai 3
e_bilbao|Basque Iron|e_root|dep Bilbao iron 1; build ironm 1|The ore that built Britain's ships.|
e_asturias|Asturian Coal|e_root|dep Oviedo coal 1; build coalm 1|The miners of 1934.|
e_riotinto|Río Tinto Copper|e_root|money 6 ?? Leave it to the British company => rel ENG 10; money 4 // Nationalise it => money 10; rel ENG -15|Copper and sulphur in Huelva.|
e_mercury|The Almadén Mercury|e_riotinto|money 6|A third of the world's mercury.|
e_wolfram|Galician Wolfram|e_mercury|money 6; dep Corunna iron 1|Tungsten for armour-piercing shells.|
e_oranges|Valencian Oranges|e_root|build farm 2; money 4|Oranges for London.|
e_olive|Olive Oil of Andalusia|e_oranges|build farm 2|Jaén's endless groves.|
e_textile|Catalan Textiles|e_root|build textile 2|The mills of Sabadell and Terrassa.|
e_steel|Altos Hornos de Vizcaya|e_bilbao|build steel 2|Spain's great steelworks.|
e_rail|RENFE|e_steel|infra 3; build railway 1|One national railway out of four bankrupt companies.|
e_roads|Roads for the Interior|e_rail|infra 2; build construction 1|Castile's villages joined to the world.|
e_dams|Dams and Irrigation|e_olive|build power 2, farm 2; tech p_hydro|Water for the dry lands.|
e_chem|Chemicals and Fertilisers|e_dams|build chem 1|Nitrates made at home.|
e_motor|Spanish Lorries|e_rail|build autos 1, engines 1|Trucks from Barcelona and Madrid.|
e_bank|The Bank of Spain|e_root|money 8; spirit Peseta: tax .04|A currency the world trusts, again.|
e_tariff|Protect Industry|e_bank|law protectionism; build tools 1|Behind the tariff wall.|
e_export|An Export Drive|e_tariff,e_oranges|money 6; spirit Spanish Exports: tradecap .05|Oranges, wine and cork for the world.|
e_plan|A National Plan|e_chem,e_motor,e_export|spirit National Plan: build .05, output .03|A plan for the whole economy.|
e_war|The War Economy|e_plan|law war_econ; spirit Spanish War Industry: mil_out .1|Everything for the front.|req war
# Morocco and the Empire
m_root|The Protectorate||stab 1|Spanish Morocco, Ifni, the Sahara and Guinea: the remains of an empire.|ai 2
m_tetuan|The High Commissioner at Tetuán|m_root|stab 2; mp 20|Morocco gives Spain its best soldiers.|
m_khalifa|The Khalifa|m_tetuan|stab 2 ?? Respect his authority => stab 2; rel EGY 5 // Rule directly => money 4; stab -1|The Sultan's deputy in the Spanish zone.|
m_rif|The Rif|m_tetuan|units inf 1; fort Tetuan|The mountains where Spain lost twelve thousand men in 1921.|
m_tangier|Tangier|m_rif|stab 1 ?? Occupy the international zone => infl -10; ws 4 // Respect its statute => infl 10|A city run by eight powers.|req franceDown
m_sahara|The Sahara|m_root|money 2|Villa Cisneros and the desert.|
m_guinea|Spanish Guinea|m_sahara|build plantation 1; money 3|Cocoa from Fernando Póo.|
m_canaries|The Canary Islands|m_root|fort Las Palmas; build port 1|An Atlantic base the Germans covet.|
m_empire|The Empire|m_tangier,m_guinea,m_canaries|ws 4; spirit Spanish Africa: manpower .02, infl .05|Spain has an empire, still.|
# Iberia
i_root|The Iberian Question||infl 10|Portugal next door, Britain in Gibraltar, France beyond the Pyrenees.|ai 2
i_portugal|The Iberian Pact|i_root|rel POR 30; nap POR|Salazar and Spain agree to keep the war out of the peninsula.|
i_bloc|The Iberian Bloc|i_portugal|rel POR 15; infl 20|Two neutral states, one voice.|
i_gibraltar|The Gibraltar Claim|i_root|claim Gibraltar; rel ENG -10|The Rock was taken in 1704 and never returned.|
i_negotiate|Negotiate for the Rock|i_gibraltar|rel ENG 10; infl 20 ?? A joint administration => infl 10 // Nothing less than all of it => ws 4|London will not discuss it, yet.|
i_france|The French Frontier|i_root|fort Lleida; rel FRA 5|The Pyrenees are a wall in both directions.|
i_latin|Hispanidad|i_bloc|rel ARG 20, MEX 10, CHL 10; infl 20|The Spanish-speaking world looks to Madrid.|
i_union|An Iberian Union|i_bloc|stab 1 ?? Federation with Portugal => rel POR -20; claim Lisbon // A close alliance => allies POR|One peninsula, one state?|req year 1942
# The Church and Society
c_root|Spanish Society||stab 1|A country of priests and anarchists, grandees and day labourers.|ai 2
c_church|The Church|c_root|ig devout 6 ?? A concordat with Rome => ig devout 6; stab 2 // Keep the Church out of politics => legit 3|The question that divides every Spanish family.|
c_schools|Village Schools|c_root|spirit Spanish Schools: literacy .2|A school in every pueblo.|
c_culture|The Generation of '27|c_schools|infl 15; res 10|Lorca, Alberti, Buñuel and Dalí.|
c_picasso|Guernica|c_culture|infl 20; ws 2|A painting shown at the Paris exhibition of 1937.|
c_health|Public Health|c_schools|tech s_medicine; spirit Health Service: growth .1|Typhus and hunger in the cities.|
c_women|Women's Rights|c_schools|law suffrage; legit 2|Spanish women voted in 1933.|
c_regions|The Regions|c_root|stab 2 ?? Autonomy for the regions => sfac reg 6; stab 2 // One Spain, one language => ws 4; stab -2|Catalan, Basque and Galician: languages or dialects?|
c_football|Football and Bullfights|c_regions|stab 2|Real Madrid, Barcelona and Athletic, and Manolete in the ring.|
c_exiles|The Exiles|c_culture|stab 1 ?? Invite them home => legit 4; res 10 // Let them stay away => stab 2|Scientists and writers abroad.|req spWon
c_reconcile|Reconciliation|c_exiles,c_health,c_football|stab 8; spirit National Reconciliation: stab 3, legit 3|Two Spains, one future.|
# The Anarchist Revolution
x_root|The Revolution of July|r_arm|sfac cnt 6; ws 4|In Barcelona the workers have beaten the army in the streets. The revolution has begun.|req spRep
x_durruti|The Durruti Column|x_root|units mil 4; generals Buenaventura Durruti/3/off|Three thousand militiamen march on Zaragoza.|req spWar
x_aragon|The Council of Aragon|x_durruti|sfac cnt 6; stab -2|Anarchist Aragon governs itself.|
x_collectives|Libertarian Communism|x_aragon|sfac cnt 8; spirit Free Collectives: farm_out .04, output -.03, ws 4|Money abolished in a hundred villages.|
x_women|Mujeres Libres|x_root|mp 30; sfac cnt 4; law equality|Free Women: militia, schools and clinics run by women.|
x_ministers|Anarchists in the Cabinet|x_aragon|sfac cnt 6; sunity 8; legit -2|García Oliver becomes Minister of Justice, against every principle.|
x_militarise|Militarise the Militias|x_ministers|units inf 2; sfac cnt -4, pce 4; spirit Militarised Columns: org .04|The columns become divisions, with officers and salutes.|
x_federation|The Iberian Federation|x_collectives,x_militarise|sfac cnt 10; stab 4; spirit Federated Communes: ws 6, stab 2|A federation of free communes from Lleida to Alcoy.|req spWon
# The Falange
fa_root|The Falange|n_rising|sfac fal 6; ws 4|José Antonio's party grows from thousands to hundreds of thousands in a summer.|req spNat
fa_jose|José Antonio's Legacy|fa_root|ws 4 ?? Exchange him for prisoners => sfac fal 6 // Let him become a martyr => ws 6; sfac fal 4|The founder is in a Republican prison in Alicante.|
fa_hedilla|Hedilla's Challenge|fa_root|stab -2 ?? Arrest him => sfac army 6, fal -6 // Make him a minister => sfac fal 8; sunity -6|The Falange's second leader refuses the unification.|
fa_syndicates|National Syndicalism|fa_hedilla|law corporatist; ig union -6; build tools 1|Vertical unions for workers and employers alike.|
fa_youth|The Youth Front|fa_jose|mp 40; spirit Youth Front: manpower .03, ws 3|Every boy in a blue shirt.|
fa_women|The Women's Section|fa_youth|stab 2; spirit Auxilio Social: stab 2|Pilar Primo de Rivera's social service.|
fa_imperial|The Imperial Vocation|fa_syndicates|claim Gibraltar, Oran; ws 6|"Through the Empire to God."|
fa_state|The Falangist State|fa_imperial,fa_women|setIdeo fas; sfac fal 10; spirit National Syndicalist State: pp .08, ws 4|The party, not the army, rules Spain.|req spWon
# The Carlist Cause
ca_root|The Communion|n_rising|sfac car 6; units mtn 1|The Carlists have been ready for this war for a century.|req spNat
ca_falconde|Fal Conde's Requetés|ca_root|units mtn 2; generals José Enrique Varela/3/off|The red berets march to the Guadarrama.|
ca_regent|Prince Xavier, Regent|ca_root|sfac car 6; legit 2|The Carlist pretender's regent arrives in Navarre.|
ca_fueros|Restore the Fueros|ca_regent|stab 2; sfac car 4|The ancient liberties of Navarre.|
ca_academy|The Requeté Academy|ca_falconde|stab -2 ?? Defy Franco => sfac car 8; sunity -8 // Submit => sfac army 4; sunity 4|Franco forbids a Carlist officer school; Fal Conde goes into exile.|
ca_king|A Carlist King|ca_fueros,ca_academy|setIdeo aut; leader Xavier of Bourbon-Parma/Traditionalist Communion; sfac car 15|The Traditionalist monarchy, at last.|req spWon; mx s_donjuan
# Catalonia and the Basque Country
cb_root|The Historic Nations||stab 1|Catalonia and the Basque Country have their own languages, parliaments and industries.|ai 2
cb_companys|Lluís Companys|cb_root|sfac reg 4; stab 1|The President of the Generalitat.|req spRep
cb_aguirre|Lehendakari Aguirre|cb_root|sfac reg 4; units inf 1|A Catholic, conservative Basque government on the Republican side.|req spRep
cb_euzkadi|The Army of Euzkadi|cb_aguirre|units inf 2; fort Bilbao|The Iron Belt around Bilbao.|req spWar
cb_industry|Catalan War Industry|cb_companys|build arms 1, artyf 1|The textile mills make grenades and shells.|
cb_language|Catalan and Basque|cb_root|stab 1 ?? Official languages => stab 2; sfac reg 4 // Castilian only => ws 2; stab -2|In schools, courts and newspapers.|
cb_galicia|The Galician Statute|cb_language|stab 2|Galicia votes for autonomy in 1936.|
cb_settle|A Settlement with the Regions|cb_euzkadi,cb_industry,cb_galicia|cb_galicia|stab 6; spirit Regional Settlement: stab 2, output .02|Spain as a nation of nations, or a nation with provinces: decided at last.|
# Foreign Intervention
fi_root|The Spanish Question||infl 10|Every power in Europe takes sides in Spain, while signing a pact not to.|ai 2
fi_nonint|The Non-Intervention Committee|fi_root|infl 20 ?? Accept it => rel ENG 10, FRA 10 // Denounce it => ws 4|Twenty-seven nations promise not to send arms. Three of them lie.|req spWar
fi_volunteers|Foreign Volunteers|fi_root|units inf 1; ws 2|Irishmen, Portuguese, Romanians, Americans.|req spWar
fi_germany|Ties with Germany|fi_root|rel GER 15|Germany's friendship has a price in ore.|
fi_italy|Ties with Italy|fi_root|rel ITA 15|Mussolini wants the Balearics as a base.|
fi_soviet|Ties with Moscow|fi_root|rel SOV 15|The only great power that sells us arms openly.|
fi_france|Ties with France|fi_root|rel FRA 15|Léon Blum is torn between his heart and his cabinet.|
fi_britain|Ties with Britain|fi_root|rel ENG 15|London fears revolution more than Franco.|
fi_mexico|Mexican Rifles|fi_soviet|equip arms 200; rel MEX 20|Mexico sends rifles and asks for nothing.|req spRep
fi_portugal|Portuguese Help|fi_italy|rel POR 20; units inf 1|Salazar's Viriatos.|req spNat
# The Guerrilla
g_root|The Maquis||ws 2|The war does not end for everyone: men stay in the mountains with their rifles.|ai 1
g_hills|Into the Hills|g_root|resist SPA 15; units mil 2|Asturias, León and the Levante.|req losingWar
g_valle|The Val d'Aran|g_hills|resist SPA 10|Exiles try to invade from France.|
g_guardia|The Civil Guard|g_root|units mil 3; rad -.04|The tricorn hats hunt the guerrillas.|req spWon
g_amnesty|An Amnesty|g_guardia|resist SPA -15; legit 4; stab 2|Those who come down from the hills go home.|
g_end|The Last Guerrillas|g_amnesty,g_valle|g_amnesty|stab 4|The mountains are quiet.|
# The Countryside
co_root|Rural Spain||stab 1|Half of Spain works the land, much of it on estates its labourers will never own.|ai 2
co_braceros|The Braceros|co_root|ig rural 4; stab 1|Day labourers of Andalusia, hired by the morning.|
co_wheat|The Wheat Service|co_root|build farm 2; money 2|A state monopoly buys the harvest.|
co_tractors|Tractors|co_wheat|tech p_tractors; build farm 1|Machines for Castile.|
co_irrigate|Irrigation of the Levante|co_tractors|build farm 2|Canals for the huertas.|
co_colonise|Internal Colonisation|co_irrigate|popgrow 1; build farm 2|New villages on reclaimed land.|
co_forest|Reforest the Meseta|co_braceros|build logging 1; stab 1|Pines on the bare hills.|
co_vine|The Wines of Rioja and Jerez|co_forest|money 4; build farm 1|Sherry for London.|
co_cattle|Cattle of the North|co_vine|build ranch 2|Asturias and Galicia.|
co_fishing|The Fishing Fleets|co_cattle|build port 1; money 2|Galicia's boats.|
co_village|A Better Village|co_colonise,co_fishing|stab 6; spirit Rural Renewal: farm_out .05, stab 2|Water, electricity and a road for every village.|
# The Home Front
h_root|The Rearguard||stab 1|Behind every front, a city that must be fed, heated and kept loyal.|ai 2
h_bread|Bread for the Cities|h_root|stab 2; money -2|Flour convoys from the countryside.|
h_shelters|Air-Raid Shelters|h_root|tech s_civildef; spirit Shelters: civdef .2|The metro stations of Madrid and Barcelona.|
h_posters|The Poster War|h_bread|ws 4; infl 5|Artists paint the war on every wall.|
h_radio|Radio Nacional|h_shelters|ws 3; pp 10|A voice that reaches every village.|
h_refugees|Refugees from the Front|h_posters,h_radio|stab 3; mp 20|Families from the lost provinces resettled.|
`);

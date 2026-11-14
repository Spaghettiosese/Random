// Yugoslavia (2.1): hand-written. Five peoples in one kingdom; a regent, a general, a Croat leader and a locksmith from Kumrovec.
'use strict';
TREES.YUG = autoTree('yu_', `
# The Regency
regency|The Regency of Prince Paul||pp 40; stab 2|King Alexander was shot in Marseille; his cousin rules until Peter comes of age.|ai 6
r_council|The Regency Council|regency|pp 30; legit 2 ?? Govern through Stojadinović => ig land 4; pp 20 // Govern through the generals => ig army 6; stab 2|Three regents, one of whom decides.|ai 6
## prince paul's course
paul|Prince Paul's Course|r_council|bop -5; stab 3; pp 30|An Oxford-educated aesthete who collects paintings and hates politics.|mx stoj,coup,maček,tito; ai 6
pa_cvetkovic|The Cvetković Government|paul|leader Dragiša Cvetković/Yugoslav Radical Union; stab 2|A modest man from Niš, chosen to make a deal with the Croats.|
pa_talks|Talks with Maček|pa_cvetkovic|nat croat 8; pp 20|Secret meetings in Zagreb hotels.|
pa_sporazum|The Sporazum|pa_talks|nat croat 20, serb -8; stab 4 ?? A Banovina of Croatia => nat croat 10; spirit Banovina of Croatia: stab 3, legit 2 // Autonomy for every people => nat slovene 10, bosniak 10, macedon 6; nat serb -4|The agreement of August 1939.|
pa_vice|Maček as Vice-Premier|pa_sporazum|stab 3; nat croat 6|Zagreb sits in the cabinet.|
pa_banovinas|Reform the Banovinas|pa_sporazum|stab 2 ?? Serbian lands united => nat serb 12; nat croat -4 // Slovene lands united => nat slovene 12 // A Bosnian unit => nat bosniak 12; nat serb -4|Who else gets a banovina?|
pa_neutral|Armed Neutrality|pa_cvetkovic|spirit armed_neutrality; infl 20|Yugoslavia will fight anyone who crosses its frontiers.|
pa_british|The British Connection|pa_neutral|rel ENG 20; infl 20|Prince Paul's sister-in-law is the Duchess of Kent.|
pa_balance|Between the Axis and London|pa_neutral|infl 30; spirit Prince Paul's Balance: infl .1, stab 2|Belgrade answers both ambassadors politely.|
pa_pressure|German Pressure|pa_balance|stab -2 ?? Sign the Tripartite Pact => fn joinAxis; rel GER 30; ws -6; nat serb -10 // Refuse once more => rel GER -25; ws 6; nat serb 6|Hitler receives the Regent at the Berghof.|req gerFriend
pa_terms|Special Terms|pa_pressure|stab 3 ?? No German troops on our soil => rel GER -5; stab 3 // Salonika as our reward => claim Salonika; rel GRE -20|Yugoslavia signs only with conditions.|req year 1940
pa_survive|The Regency Survives|pa_vice,pa_balance|stab 6; spirit A Steady Regency: stab 3, legit 3|Peter comes of age in a country still at peace.|
pa_peter|King Peter II|pa_survive|leader Peter II/Royal Government; legit 10|The young King takes the oath in Belgrade cathedral.|req year 1941
pa_museum|The Prince Paul Museum|pa_survive|infl 20; ws 2|Rembrandts and Poussins in Belgrade.|
## stojadinovic
stoj|Stojadinović's Radical Union|r_council|ideo fas 8; bop 10; pp 30|A Prime Minister who wants to be called Vođa.|mx paul,coup,maček,tito; ai 0
st_vodja|The Leader|stoj|leader Milan Stojadinović/Yugoslav Radical Union; law censorship; pp 40|Green-shirted youth chant his name.|
st_italy|The Italian Treaty|st_vodja|rel ITA 35; nap ITA|Ciano and Stojadinović hunt together.|
st_bulgaria|Eternal Friendship with Bulgaria|st_vodja|rel BUL 35; nap BUL; ent balkan -10|The Treaty of 1937.|
st_germany|German Trade|st_italy|trade GER; rel GER 25; money 8|Bauxite, copper and wheat for German machines.|
st_greenshirts|The Green Shirts|st_vodja|ideo fas 8; mp 30; spirit Radical Youth: manpower .03|A youth movement that looks like Italy's.|
st_ljotic|Ljotić's ZBOR|st_greenshirts|ideo fas 10; stab -3|A movement more extreme than the Leader.|mx st_moderate
st_moderate|Keep the Radicals Moderate|st_greenshirts|stab 4; legit 2|Stojadinović is a banker, not a revolutionary.|mx st_ljotic
st_dictator|The Leader's State|st_ljotic,st_germany|st_moderate,st_germany|setIdeo fas; law oneparty; stab -4|The Regency becomes a formality.|
st_concord|The Concordat|st_vodja|stab -4; ig devout 4 ?? Ratify it => nat croat 8, serb -12; rel ITA 10 // Withdraw it => nat serb 8, croat -6|The Orthodox Church marches against the Vatican agreement.|
st_axis|Join the Axis|st_dictator|fn joinAxis|Belgrade, Rome and Berlin.|req gerFriend
st_albania|Partition Albania|st_axis|claim Shkodër; rel ITA 15|Italy offers the north of Albania.|
st_salonika|The Road to Salonika|st_axis|claim Salonika; ws 6|A Yugoslav port on the Aegean.|req atwar GRE
st_order|The New Yugoslav Order|st_dictator|stab 6; spirit Radical Order: pp .08, stab 3, legit -2|A kingdom run like a party.|
## the generals' coup
coup|The Serbian Generals|r_council|ig army 8; bop 15; ws 4|The officers think the Regent is too soft.|mx paul,stoj,maček,tito; ai 0
gc_club|The Serbian Cultural Club|coup|nat serb 12; nat croat -4|Professors and officers for a Serbian Yugoslavia.|
gc_officers|The Officers' Conspiracy|coup|ig army 6; pp 20|Air Force General Simović and his staff.|
gc_27march|27 March|gc_club,gc_officers|leader Dušan Simović/Government of National Unity; setIdeo aut; ws 10; stab -4|Better war than the pact; better the grave than a slave.|
gc_peter|Proclaim Peter of Age|gc_27march|legit 10; stab 3|The seventeen-year-old King is declared an adult overnight.|
gc_crowds|Crowds in Belgrade|gc_27march|ws 8; nat serb 10; spirit Better War Than Pact: ws 6, def .03|British flags in the streets.|
gc_mob|Full Mobilisation|gc_crowds|law extensive; mp 150; units inf 4|Too late, and too slowly.|
gc_britain|An Appeal to London|gc_peter|rel ENG 30; equip aircraft 40|Britain promises everything it does not have.|
gc_greece|Joint Plan with Greece|gc_britain|rel GRE 30; ent balkan 15|A common front in the south.|
gc_soviet|The Soviet Friendship Treaty|gc_britain|rel SOV 30; nap SOV|Signed on the eve of the invasion.|
gc_allies|Join the Allies|gc_greece,gc_soviet|fn joinAllies|Yugoslavia will not bow.|req tension 55
gc_croats|Bring in the Croats|gc_27march|nat croat 10; stab 3|Maček is begged to join the new government.|mx gc_serbia
gc_serbia|A Serbian Government|gc_27march|nat serb 10, croat -12; pp 30|The Croats can join later.|mx gc_croats
gc_line|Defend the North|gc_mob|fort Zagreb, Ljubljana, Novi Sad|Hold the plains, or retreat to the mountains?|
gc_redoubt|The Southern Redoubt|gc_mob|fort Sarajevo, Cetinje, Mostar; spirit Mountain Redoubt: def .05|Fall back to Bosnia and Montenegro, as in 1915.|
## the federal agreement
maček|Maček's Federal Yugoslavia|r_council|ideo dem 12; bop -10; nat croat 10|The Croatian Peasant Party has the votes of every Croat village.|mx paul,stoj,coup,tito; ai 0
fd_bloc|The United Opposition|maček|ideo dem 8; pp 20|Croats, Serbian democrats and Slovenes on one list.|
fd_election|Free Elections|fd_bloc|law universal; stab -4; legit 6|The first honest vote since 1927.|
fd_gov|Maček Takes Office|fd_election|setIdeo dem; leader Vladko Maček/United Opposition; nat croat 12|A Croat leads Yugoslavia.|
fd_federation|A Federation of Equals|fd_gov|nat croat 10, slovene 10, bosniak 10, macedon 8, serb -6; spirit Federal Yugoslavia: stab 4, legit 4|Six republics and one crown.|
fd_serbs|Reassure the Serbs|fd_federation|nat serb 15; pp -20|Belgrade remains the capital, and the King remains a Karađorđević.|
fd_parl|Parliament in Every Banovina|fd_federation|law protected; spirit Federal Parliaments: legit 4, tax .03|Assemblies in Zagreb, Ljubljana and Sarajevo.|
fd_peasant|The Peasant State|fd_gov|ig rural 12 .3; spirit Peasant Cooperatives: farm_out .08|Radić's dream: a state for those who till.|
fd_coops|Village Banks|fd_peasant|build farm 3; money 4|Credit without moneylenders.|
fd_west|The Western Democracies|fd_parl|rel ENG 20, FRA 20, USA 15|Yugoslavia belongs with the democracies.|
fd_neutral|Democratic Neutrality|fd_west|infl 30; ent balkan 10|A democracy that keeps out of war.|mx fd_allies
fd_allies|Join the Allies|fd_west|fn joinAllies|Democrats against dictators.|req tension 50; mx fd_neutral
fd_brother|Brotherhood of the Peoples|fd_serbs,fd_coops|stab 8; spirit yug_unity [730]|For a moment, every people is content.|
## tito
tito|The Communist Underground|r_council|ideo com 12; bop 20; rad .04|A banned party, a secretary-general just back from Moscow.|mx paul,stoj,coup,maček; ai 0
ti_party|Rebuild the Party|tito|ideo com 8; pp 20|Josip Broz, called Tito, takes over a shattered organisation.|
ti_students|The Students of Belgrade|ti_party|ig intel 8; ideo com 6|The University is red.|
ti_spain|Veterans of Spain|ti_party|generals Koča Popović/3/off, Peko Dapčević/3/off|Yugoslav volunteers come home from the International Brigades.|
ti_unions|The Illegal Unions|ti_students|ig union 10; rad .04|Strikes in the mines of Bor and Trepča.|
ti_rising|The Rising|ti_unions,ti_spain|setIdeo com; leader Josip Broz Tito/Communist Party of Yugoslavia; stab -8|The red star over Belgrade.|req war
ti_nations|Brotherhood and Unity|ti_rising|nat croat 15, slovene 15, bosniak 15, macedon 15, serb 4; spirit yug_unity|A federation of five peoples, and a sixth for the Montenegrins.|
ti_macedonia|A Macedonian Republic|ti_nations|nat macedon 20; rel BUL -15|The Macedonians are a nation of their own.|
ti_land|Land to the Peasants|ti_rising|ig land -15 -.5, rural 12; spirit land_reform|The great estates of Vojvodina are divided.|
ti_plan|The Five-Year Plan|ti_land|law command; build steel 2, tools 2; spirit Planned Yugoslavia: build .06|Factories in Bosnia, where the ore is.|
ti_moscow|With Moscow|ti_nations|rel SOV 40; fn joinComintern|The Yugoslav Party is Stalin's most loyal.|mx ti_own
ti_own|Our Own Road|ti_nations|infl 50; rel SOV -20; spirit Yugoslav Road to Socialism: pp .08, stab 3|Not Moscow's satellite.|mx ti_moscow
ti_workers|Workers' Councils|ti_own|ig union 10; spirit Self-Management: output .04, stab 2|The factories belong to those who work in them.|
ti_balkan|The Balkan Federation|ti_moscow,ti_plan|ti_own,ti_plan|claim Tirana, Shkodër; rel BUL 20, ALB 20|Albania and Bulgaria within a South Slav federation.|
ti_nonaligned|The Third Way|ti_workers|infl 60; spirit Non-Aligned: infl .2, stab 3|Neither East nor West.|
ti_republic|The Federal People's Republic|ti_balkan,ti_nonaligned|ti_balkan,ti_moscow|rename Federal People's Republic of Yugoslavia/Yugoslav; stab 8|The crown is abolished.|
# The National Question
nq|The National Question||stab 2|Serbs, Croats and Slovenes were promised a kingdom of equals; the Croats do not think they got one.|ai 4
## croats
nq_croats|The Croatian Question|nq|nat croat 6|Zagreb remembers Stjepan Radić, shot in parliament in 1928.|
nq_radic|Honour Radić|nq_croats|nat croat 8; legit 2|A monument in Zagreb, paid for by Belgrade.|
nq_zagreb|Invest in Zagreb|nq_croats|build tools 1, textile 1; nat croat 6|Zagreb is the industrial heart of the kingdom.|
nq_ustase|The Ustaše Threat|nq_radic|stab 2 ?? Hunt them down => nat croat -6; rad -.04; ig intel -3 // Demand Italy expel them => rel ITA -10; rad -.03|Pavelić trains terrorists in Italian camps.|
nq_dalmatia|Dalmatian Autonomy|nq_zagreb|nat croat 8; build port 1|Split and Dubrovnik govern their own coast.|
nq_croat_army|Croat Officers|nq_ustase|nat croat 6; ig army -3|Croats in the general staff, at last.|
## slovenes
nq_slovenes|The Slovene Lands|nq|nat slovene 8|The most prosperous and the most loyal of the peoples.|
nq_ljubljana|The University of Ljubljana|nq_slovenes|build university 1; nat slovene 8; res 10|Lectures in Slovene.|
nq_korosec|Korošec's People's Party|nq_ljubljana|nat slovene 8; ig devout 4|A priest who is a minister in every cabinet.|
nq_carinthia|Remember Carinthia|nq_slovenes|nat slovene 6; ws 3|The Slovenes of Austria were lost in a plebiscite.|
nq_industry|Slovene Industry|nq_korosec|build tools 1, chem 1|Jesenice steel, Celje zinc.|
## bosniaks
nq_bosnia|The Bosnian Muslims|nq|nat bosniak 8|The Yugoslav Muslim Organisation holds the balance in parliament.|
nq_spaho|Spaho's Party|nq_bosnia|nat bosniak 10; stab 2|The JMO in the government.|
nq_waqf|The Islamic Community|nq_spaho|nat bosniak 8; ig devout 3|Mosques and schools in Sarajevo.|
nq_sarajevo|Invest in Sarajevo|nq_bosnia|build steel 1; dep Sarajevo iron 1; nat bosniak 6|The Zenica steelworks.|
nq_bosnia_unit|A Bosnian Banovina|nq_waqf,nq_sarajevo|nat bosniak 12, serb -6, croat -4|Bosnia is neither Serbian nor Croatian.|
## the south
nq_south|Southern Serbia|nq|nat macedon 4|Officially there are no Macedonians.|
nq_imro|The IMRO|nq_south|stab 2 ?? Crush the band => nat macedon -6; rel BUL -15; rad -.04 // Recognise Macedonian culture => nat macedon 12; rel BUL -5|Bulgarian-backed revolutionaries cross the border.|
nq_kosovo|Kosovo|nq_south|stab 2 ?? Colonise it => nat serb 6; stab -2; rel ALB -20 // Leave the Albanians in peace => stab 3; rel ALB 15|Serb colonists and Albanian villages.|
nq_monten|Montenegro|nq_south|nat serb 4; stab 2|The Montenegrins remember their own king.|
nq_vojvodina|The Vojvodina Germans|nq_south|rel GER 10; build farm 2|Half a million Germans farm the plains of Banat and Bačka.|
nq_skopje|Develop Skopje|nq_imro|build textile 1; nat macedon 6|Tobacco and opium processing.|
## serbs
nq_serbs|The Serbian Heartland|nq|nat serb 8|Serbia gave the dynasty, the army and the capital.|
nq_church|The Patriarch of Peć|nq_serbs|nat serb 8; ig devout 6|The Orthodox Church speaks for the Serbs.|
nq_veterans|The Veterans of Salonika|nq_serbs|nat serb 6; ws 4; ig army 4|Survivors of the Albanian retreat of 1915.|
## the settlement
nq_civic|Yugoslav Citizenship|nq_bosnia_unit,nq_dalmatia,nq_industry|law civic; stab 4|One citizenship, many peoples.|
nq_census|A Fair Census|nq_civic|stab 3; legit 3|Count every people as it counts itself.|
nq_unity|Brotherhood and Unity|nq_census,nq_church,nq_skopje|spirit yug_unity [1095]; stab 6|The kingdom works.|
nq_federal|A Federal Constitution|nq_unity|nat croat 10, slovene 10, bosniak 10, macedon 10; legit 6|The constitution of 1921 is rewritten.|
# Foreign Policy
fp|The Foreign Policy of the Kingdom||infl 20|Surrounded by Italy, Austria, Hungary, Romania, Bulgaria, Greece and Albania; friendly with two of them.|ai 4
fp_little|The Little Entente|fp|ent little 15; rel CZE 20, ROM 20|Against Hungarian revision.|
fp_balkan|The Balkan Pact|fp|ent balkan 15; rel GRE 20, TUR 15, ROM 15|Four Balkan states guarantee each other.|
fp_france|The French Alliance|fp_little|rel FRA 30; equip artillery 80|Paris built our army.|
fp_staff|Joint Staff Talks|fp_balkan|ent balkan 10; xp|Plans to fight together.|
fp_italy|Watch Italy|fp|fort Ljubljana, Split|Mussolini's army is a day from Ljubljana.|
fp_fiume|Fiume and Zara|fp_italy|claim Fiume, Zara; ws 4|Croatian towns in Italian hands.|
fp_trieste|Trieste|fp_fiume|claim Trieste; ws 4|The port of all the South Slavs.|req war
fp_albania|The Albanian Question|fp_italy|rel ALB 15; infl 20 ?? Protect Albania => rel ITA -15; guarantee ALB // Leave it to Italy => rel ITA 15|Zog is Italy's client.|
fp_bulgaria|Make Peace with Bulgaria|fp_balkan|rel BUL 25; nat macedon 4|The old enemy may be a friend.|
fp_hungary|Treaty with Hungary|fp_little|rel HUN 25; ent little -10|Eternal friendship, signed 1940.|
fp_soviet|Recognise the Soviet Union|fp_france|rel SOV 25; trade SOV|The last Balkan state to do so.|req year 1940
fp_trade|Trade with Germany|fp|trade GER; rel GER 15; money 6|Germany buys what France will not.|
fp_aircraft|Buy Hurricanes and Messerschmitts|fp_trade|equip aircraft 60; tech m_air1|Both sides sell us fighters.|
fp_entente|The Grand Entente|fp_staff,fp_france|ent balkan 20; ent little 15; spirit Grand Entente: def .03, infl .1|Our alliances hold.|
# Economy
ec|The Royal Economy||money 4|A country of peasants with some of Europe's richest mines.|ai 3
ec_bor|The Bor Copper Mine|ec|money 8; rel FRA 10|The largest copper mine in Europe, French-owned.|
ec_trepca|The Trepča Mines|ec|money 6; rel ENG 10|Lead and zinc, worked by an English company.|
ec_bauxite|Dalmatian Bauxite|ec_bor|money 6; build chem 1|Aluminium ore for German aircraft.|
ec_nationalise|Nationalise the Mines|ec_bor,ec_trepca|money 15; rel FRA -15, ENG -15; spirit National Mines: tax .06|Foreign capital out of the mountains.|
ec_zenica|Zenica Steel|ec|build steel 2; dep Sarajevo iron 1|Bosnian ore, Bosnian coal.|
ec_kragujevac|The Kragujevac Arsenal|ec_zenica|build arms 2, artyf 1|Rifles and guns in the heart of Serbia.|
ec_ikarus|Ikarus and Rogožarski|ec_kragujevac|build aircraftp 1; tech m_air1|Two aircraft works in Zemun.|
ec_kraljevo|The Kraljevo Aircraft Factory|ec_ikarus|build aircraftp 1, engines 1|Licence-built Dorniers.|
ec_coal|Bosnian Coal|ec_zenica|build coalm 2; dep Banja Luka coal 2|Lignite in the hills.|
ec_rail|The Belgrade–Zagreb Line|ec|infra 2; build railway 1|Double track across Slavonia.|
ec_roads|Roads into Bosnia|ec_rail|infra 2; build construction 1|Narrow gauge and gravel tracks.|
ec_coast|The Lika Railway|ec_roads|infra 1; build port 1|The capital connected to the sea at Split.|
ec_split|The Port of Split|ec_coast|build port 2; spirit Adriatic Trade: tradecap .05|The kingdom's window on the Mediterranean.|
ec_danube|The Danube Ports|ec_rail|build port 1; money 4|Belgrade and Novi Sad ship grain to Vienna.|
ec_vojvodina|The Vojvodina Granary|ec|build farm 3|Wheat and maize on the Pannonian plain.|
ec_tobacco|The Tobacco Monopoly|ec_vojvodina|money 6; spirit Tobacco Monopoly: tax .04|Macedonian leaf, state cigarettes.|
ec_timber|Bosnian Forests|ec_vojvodina|build logging 2, furniture 1|Beech and oak for export.|
ec_power|Hydroelectric Dams|ec_coal|build power 2; tech p_hydro|Rivers falling from the Dinaric Alps.|
ec_plan|An Industrial Plan|ec_power,ec_kraljevo|spirit Industrial Plan: build .05, output .03|Factories in the interior, far from the borders.|
ec_tourism|The Adriatic Coast|ec_split|money 6; infl 10|Dubrovnik and Opatija for English tourists.|
ec_bank|The National Bank|ec|money 8; spirit Stable Dinar: tax .04|The dinar is backed by gold and copper.|
ec_chemical|The Chemical Industry|ec_bauxite|build chem 1; tech p_petro|Explosives and fertiliser.|
ec_war|War Economy|ec_plan|law war_econ; spirit Yugoslav War Industry: mil_out .1|Everything for the army.|req war
# The Royal Army
ar|The Royal Yugoslav Army||spirit army_reform; pp 20|Thirty divisions on paper, mostly infantry, mostly on foot.|ai 3
ar_mobplan|A Real Mobilisation Plan|ar|mp 80; spirit Mobilisation Plan: manpower .04|In 1941 half the reservists never reached their units.|
ar_croats|Croat Reservists|ar_mobplan|nat croat 6; mp 40|Regiments raised from Croatian villages, under Croatian officers.|
ar_czech|Czech Arms|ar|equip arms 400, artillery 80; rel CZE 15|Skoda guns and Zbrojovka rifles.|
ar_mtn|Mountain Brigades|ar|tech m_mtn; units mtn 3|The Dinaric Alps are our fortress.|
ar_cav|The Royal Cavalry|ar_mtn|units cav 2|Horsemen for the Vojvodina plain.|
ar_staff|The Military Academy|ar_czech|generals Milan Nedić/3/def, Danilo Kalafatović/2/def; xp|Old officers from the Salonika front.|
ar_rupnik|The Rupnik Line|ar_staff|fort Ljubljana, Zagreb; spirit Rupnik Line: def .04|Bunkers on the Italian and German borders.|
ar_chetnik|The Chetnik Command|ar_mtn|units mil 4; spirit Chetnik Detachments: def .03|Guerrilla units of the army, ready for occupation.|
ar_anti|Anti-Tank Guns|ar_staff|tech m_art2; equip artillery 80|We have almost none.|
ar_motor|Motorised Divisions|ar_anti|tech m_mot; units mot 1|One motorised division, at least.|
ar_tanks|French Tanks|ar_motor|tech m_tank1; equip tanks 30; units arm 1|Renault R35s for the 1st Armoured Battalion.|
ar_artillery|The Artillery Programme|ar_czech|tech m_art1; build artyf 1|Guns built in Kragujevac.|
ar_doctrine|The Defence of the Kingdom|ar_rupnik,ar_chetnik|spirit Defence of the Kingdom: def .05, org .03|Defend the border only to delay; fight from the mountains.|
ar_mihailovic|Colonel Mihailović|ar_chetnik|generals Draža Mihailović/3/def|A staff officer who wrote the guerrilla manual.|
ar_reserve|Second-Line Divisions|ar_mobplan|units inf 4|Old reservists for the interior.|req tension 40
ar_frontier|The Frontier Guard|ar_reserve|units mil 4; fort Skopje, Niš|Every border, all at once.|
ar_marshal|A Modern General Staff|ar_doctrine,ar_tanks|tech m_doc1; spirit Modern Staff: atk .03, org .03|Lessons from Poland and France.|
# Navy and Air Force
na|The Royal Navy and Air Force||equip ships 6, aircraft 40|A destroyer leader from Glasgow and a few dozen modern aircraft.|ai 2
na_dubrovnik|The Destroyer Dubrovnik|na|equip ships 6|Built at Yarrow, the pride of the fleet.|
na_kotor|The Bay of Kotor|na_dubrovnik|fort Cetinje; build port 1; spirit Kotor Fleet Base: navy .04|The finest natural harbour in the Adriatic.|
na_subs|Submarines|na_dubrovnik|equip ships 4; tech m_nav2|French-built submarines.|
na_destroyers|Split-Class Destroyers|na_kotor|build shipyard 1; equip ships 6|Built at home with French help.|
na_escape|Plan the Escape|na_subs|spirit Fleet in Being: navy .03|If the kingdom falls, the fleet sails for Alexandria.|
na_ik3|The IK-3 Fighter|na|tech m_air2; equip aircraft 40; spirit Home-Built Fighters: air .05|Yugoslavia's own fighter.|
na_hurricanes|Licence-Built Hurricanes|na_ik3|equip aircraft 60; rel ENG 10|Built at Zmaj in Zemun.|
na_bombers|Dornier Bombers|na_ik3|equip aircraft 40; spirit Bomber Regiments: bombing .06|German bombers with Yugoslav crews.|
na_pilots|The Pilots' School|na_hurricanes|spirit Royal Air Force Pilots: air .05|Officers trained in France.|
na_dispersal|Disperse the Airfields|na_pilots|spirit Dispersed Airfields: air .03, civdef .15|Do not let the air force die on the ground.|
# The Resistance
rs|If the Kingdom Falls||ws 4|Every Yugoslav officer remembers 1915: the army retreated, the state survived.|ai 2
rs_gold|Evacuate the Gold|rs|money 10|The National Bank's gold to Nikšić, then abroad.|req war
rs_exile|A Government in Exile|rs_gold|legit 6; stab 2|The King and the cabinet fly to Athens, then London.|req enemyOnSoil
rs_ravna|Ravna Gora|rs_exile|resist YUG 15; generals Draža Mihailović/3/def|A colonel refuses to surrender and goes to the hills.|req enemyOnSoil
rs_partisans|The Partisans|rs_exile|resist YUG 15; ideo com 6|The Communists call the people to arms.|req enemyOnSoil
rs_uzice|The Užice Republic|rs_partisans|resist YUG 15; ideo com 4|A liberated territory with its own rifle factory.|req enemyOnSoil
rs_bbc|Radio Yugoslavia from London|rs_ravna|resist YUG 10; ws 4|The BBC broadcasts in Serbo-Croatian.|req enemyOnSoil
rs_missions|Allied Missions|rs_bbc,rs_uzice|resist YUG 15; rel ENG 15|British officers parachute into Bosnia.|req enemyOnSoil
rs_choice|Whom Do the Allies Back?|rs_missions|resist YUG 10 ?? Back Mihailović => ideo dem 8; rel ENG 10 // Back Tito => ideo com 10; rel SOV 15|Churchill's son is with the Partisans; his liaison officers report on both.|req enemyOnSoil
rs_neretva|The Battle of the Neretva|rs_choice|resist YUG 20; xp|The wounded are carried across a broken bridge.|req enemyOnSoil
rs_avnoj|The Anti-Fascist Council|rs_neretva|legit 6; nat croat 8, bosniak 8, slovene 8|A parliament in the mountains.|
rs_liberation|The Liberation of Belgrade|rs_avnoj|ws 10; stab 6|The capital is free.|req hold Belgrade
# Society
so|The South Slav Kingdom||stab 2|Three faiths, two alphabets, one kingdom.|ai 2
so_alphabet|Two Alphabets|so|stab 2 ?? Cyrillic and Latin as equals => nat croat 4, slovene 4 // Cyrillic first => nat serb 6; nat croat -4|Every official form is printed twice.|
so_schools|The School Law|so|law public; spirit Yugoslav Schools: literacy .3|Schools in the villages of Bosnia and Macedonia.|
so_sokol|The Sokol Movement|so|mp 40; spirit Sokol Gymnasts: manpower .02, ws 2|Gymnastics and patriotism.|
so_health|Fight Malaria and Typhus|so_schools|tech s_medicine; spirit Public Health: growth .2|Rockefeller doctors in the Macedonian valleys.|
so_writers|Andrić and Krleža|so_alphabet|infl 20; res 10|A Bosnian diplomat and a Croatian Marxist write for the whole kingdom.|
so_film|The Yugoslav Film Studio|so_writers|infl 10; ws 2|Newsreels in every town.|
so_women|Women's Vote|so_schools|law suffrage; legit 3|The women of Yugoslavia demand the vote.|
so_belgrade|Belgrade the Capital|so_sokol|build urban 1; ws 3|Palaces and ministries on the Sava.|
so_peace|Religious Peace|so_writers,so_health|stab 4; ig devout 4|Orthodox, Catholic and Muslim leaders bless the same flag.|
so_kingdom|A Kingdom of All Its Peoples|so_peace,so_belgrade,so_women|stab 6; spirit South Slav Kingdom: stab 3, legit 3|Yugoslavia is more than Greater Serbia.|
# The April War
aw|Plan R-41|ar|ws 4; pp 10|The war plan for an attack by Germany, Italy, Hungary and Bulgaria at once.|req tension 45
aw_north|Hold the Whole Frontier|aw|fort Zagreb, Novi Sad, Osijek; units inf 2|Every inch of Croatian soil is Yugoslav.|mx aw_south
aw_south|Fall Back on the South|aw|fort Sarajevo, Kragujevac, Skopje; spirit Southern Strategy: def .04|Give up the plains to keep the army.|mx aw_north
aw_salonika|The Salonika Link|aw_south|rel GRE 20; ent balkan 10|Join the Greek army, as in 1918.|
aw_albania|Strike into Albania|aw_south|claim Shkodër; spirit Albanian Offensive [365]: atk .05|Throw the Italians into the sea.|req atwar ITA
aw_bridges|Blow the Danube Bridges|aw_north|fort Belgrade; spirit Demolitions: def .03|Delay the panzers at every river.|
aw_air|Disperse the Air Force|aw|airm sup; spirit Air Force Dispersed: air .03|Do not lose the planes on the first morning.|
aw_croat|Keep the Croat Units Loyal|aw_north|nat croat 8; stab 2|The Croatian regiments are wavering.|
aw_reserve|The Supreme Command Reserve|aw_salonika,aw_bridges|aw_albania,aw_bridges|units inf 3|Three divisions held back for the counterstroke.|req war
aw_last|To the Last Cartridge|aw_reserve|ws 8; spirit Hold to the Last: def .06, org .03|The army does not capitulate.|req enemyOnSoil
# The Peasant Kingdom
pk|The Village and the Zadruga||stab 2; build farm 1|Families of forty under one roof in the Bosnian hills.|ai 2
pk_debt|The Peasant Debt Moratorium|pk|ig rural 8; money -4|The banks may not seize farms.|
pk_privileged|The Privileged Export Company|pk_debt|money 6; trade GER|The state buys the harvest and sells it abroad.|
pk_co|The Cooperative Union|pk_debt|build farm 2; spirit Cooperative Union: farm_out .05|The largest peasant movement in the Balkans.|
pk_school|Agricultural Schools|pk_co|res 10; tech p_tractors|Teach crop rotation in every county.|
pk_livestock|Livestock for Export|pk_privileged|build ranch 2; money 4|Pigs from Šumadija for Vienna.|
pk_plum|The Plum Harvest|pk|money 3; stab 2|Šljivovica, the national spirit.|
pk_irrigation|Irrigate the Vardar|pk_school|build farm 2; nat macedon 4|Cotton and rice in Macedonia.|
pk_land|Finish the Land Reform|pk_school,pk_livestock|ig land -6, rural 8; spirit land_reform|The Muslim beys of Bosnia lose the last of their estates.|
pk_hunger|No More Hungry Springs|pk_land,pk_irrigation|stab 6; spirit Fed Villages: stab 2, growth .1|For the first time, no famine in the karst.|
# Montenegro & the Coast
mc|The Black Mountain||stab 1|The Montenegrins lost their kingdom to Belgrade in 1918.|ai 2
mc_greens|The Greens and the Whites|mc|stab 2 ?? Amnesty for the Greens => stab 3; legit 2 // Rely on the Whites => nat serb 4|Federalists and unionists, still feuding.|
mc_cetinje|Cetinje the Royal Town|mc_greens|build urban 1; stab 2|The old capital restored.|
mc_roads|The Coast Road|mc|infra 2|Kotor, Budva and Bar joined by road.|
mc_bar|The Port of Bar|mc_roads|build port 1; money 3|A railway to the sea, one day.|
mc_highlanders|The Highland Clans|mc_cetinje|units mtn 1; mp 20|Every Montenegrin owns a rifle.|
mc_dubrovnik|Dubrovnik and the Islands|mc_bar|build port 1; fort Dubrovnik|The walls of Ragusa, guns on Korčula.|
mc_dalmatia|The Dalmatian Fleet Base|mc_dubrovnik|spirit Dalmatian Fleet Base: navy .04|Šibenik and Split for the navy.|
mc_unity|One Coast|mc_highlanders,mc_dalmatia|stab 4; nat croat 4, serb 4|From Sušak to Ulcinj.|
# The Great Powers
gp|The Great Powers and Us||infl 20|Every great power wants Yugoslavia's copper, bauxite and position.|ai 3
gp_paris|Paris Is Far|gp|rel FRA 10; infl 10|France will not march for Belgrade.|
gp_rome|The Ciano Visit|gp|rel ITA 20; nap ITA|Rome promises to keep the Ustaše quiet.|
gp_berlin|The Berlin Clearing|gp|money 6; rel GER 15|Germany buys half our exports.|
gp_moscow|The Pan-Slav Card|gp_paris|rel SOV 25|Russia, the old protector of the Serbs.|
gp_london|London's Promise|gp_paris|rel ENG 20; equip aircraft 30|A credit for aircraft.|
gp_play|Play Them Off|gp_rome,gp_berlin,gp_london|infl 40; spirit Playing the Powers: infl .15, invest .1|Each power bids against the others.|
gp_us|The American Loan|gp_play|money 10; rel USA 20|Washington lends to neutrals.|
gp_guarantee|A Four-Power Guarantee|gp_play|infl 30; stab 4|Our neutrality is recognised.|req notwar GER
`);

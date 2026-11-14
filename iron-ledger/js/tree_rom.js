// Romania (2.1): hand-written. The King, the Legion, the Peasants or the Ploughmen; oil for whoever pays; Greater Romania defended or lost.
'use strict';
TREES.ROM = autoTree('ro_', `
# Politics
carol|The Restoration Regime||pp 40; stab 2; spirit The Camarilla: pp -.05, legit -2|Carol II flew home in 1930 and has been accumulating power ever since.|ai 6
camarilla|The Camarilla|carol|pp 30; legit -2 ?? Indulge the court => pp 40; ig land 4; legit -3 // Rein it in => legit 4; stab 2|Madame Lupescu's salon decides more than the cabinet.|ai 6
## the king's dictatorship
royal|The Royal Dictatorship|camarilla|law autocracy; pp 60; bop -10|A new constitution, written in the palace.|mx legion,peasant,plough; ai 6
k_front|The Front of National Rebirth|royal|law oneparty; pp 60; spirit Front of National Rebirth: pp .1, stab 2|One party, with a royal anthem and a Roman salute.|
k_ban|Dissolve the Parties|royal|stab -3; ig intel -6; pp 40|The old parties go home; their leaders stay in Bucharest.|
k_youth|Straja Țării|k_front|mp 80; spirit Sentinel of the Fatherland: manpower .04, train .06|The King's own youth movement, in navy blue.|
k_codreanu|Arrest the Captain|k_ban|stab -6; rad -.08; spirit Legion Decapitated: rad -.03|Codreanu is tried for treason.|mx k_bargain
k_bargain|Bargain with the Legion|k_ban|ideo fas 6; stab 3|A ministry for the Guard in return for its silence.|mx k_codreanu
k_night|The Night of the Vampires|k_codreanu|stab -4; rad -.08; ig army 4 ?? Shoot them while escaping => rad -.06; legit -4 // A proper trial => legit 3|Legionaries die on the road to Jilava.|
k_lupescu|Marry Elena|k_youth|legit -6; stab 3|The Church and half the army are scandalised.|mx k_dismiss
k_dismiss|Send the Mistress Away|k_youth|legit 6; ig devout 4; pp -20|The King chooses the crown over the woman.|mx k_lupescu
k_planned|The Royal Economy|k_front|law interventionism; build tools 1, steel 1; spirit Royal Industry: output .03|Ministries of armament and national economy, under palace men.|
k_minorities|The Minorities Statute|k_front|stab 4; spirit Minority Rights: stab 3, legit 2; rel HUN 10|Hungarians, Germans and Jews get a statute, on paper.|
k_court|A Court of Technicians|k_planned|res 15; spirit Technocrats of the Palace: research .03|Engineers instead of boyars in the ministries.|
k_neutral|The King's Balance|k_court,k_minorities|infl 30; spirit Royal Balancing Act: infl .1, stab 2|Guarantees from London, oil for Berlin.|
k_abdicate|Abdicate for Michael|k_night,k_dismiss|leader Michael I/Royal Government; legit 10; stab 4; rmspirit f_the_camarilla|The father leaves by special train; the son is eighteen.|req stab 20
k_survive|The Crown Survives|k_neutral,k_lupescu|k_neutral,k_dismiss|stab 8; legit 8; spirit Royal Romania: legit 6, stab 3|The dynasty outlasts the storm.|
k_michael|King Michael's Coup|k_abdicate|setIdeo aut; fn joinAllies; rel SOV 20|The young King arrests the Conducător at the palace.|req losingWar
## the legion
legion|The Archangel Michael's Legion|camarilla|ideo fas 12; stab -5; bop 10|Green shirts, wooden crosses and death as a sacrament.|mx royal,peasant,plough; ai 0
l_codreanu|Codreanu's Programme|legion|ig rural 6; ideo fas 6; pp 40|The Captain promises a Romania as clean as the sun in the sky.|
l_worksites|The Work Camps|l_codreanu|build construction 1, farm 2; spirit Legionary Work Camps: build .05|Students dig ditches and build churches for free.|
l_shops|Legionary Commerce|l_codreanu|ig pb 6; money 6|Cooperatives and restaurants run by the movement.|
l_death|The Death Squads|l_worksites|rad .06; stab -6; spirit Decemviri: pp .05|The Legion's enemies are shot in their offices.|mx l_peace
l_peace|A Respectable Movement|l_worksites|stab 3; legit 4|Ties and suits for the Captain's lieutenants.|mx l_death
l_state|The National Legionary State|l_shops,l_death|l_shops,l_peace|setIdeo fas; leader Horia Sima/Iron Guard; stab -8|The Legion takes power with a general beside it.|
l_police|Legionary Police|l_state|law secret_police; fn intelBoost; rad -.05|Green shirts in the police stations.|
l_romanise|Romanianisation|l_state|ig pb 8, ind -6; money 10; stab -4|Businesses are seized from those the Legion calls foreigners.|
l_church|The Orthodox Crusade|l_state|ig devout 8; law state_church; ws 4|Priests bless the flags.|
l_rebellion|The Legionary Rebellion|l_police,l_romanise|stab -8; ws 6 ?? The Legion wins the streets => pp 60; rad -.05 // The army crushes it => setIdeo aut; leader Ion Antonescu/Conducător; ig army 6|Three days of fighting in Bucharest.|
l_axis|Join the Axis|l_state|fn joinAxis; rel GER 30|Romania belongs with the New Order.|req gerFriend
l_crusade|The Crusade in the East|l_axis|claim Chișinău, Bălți, Odessa; spirit Holy War: atk .05, ws 8|Bessarabia and beyond.|req gerSovWar
l_transnistria|Transnistria|l_crusade|claim Odessa, Vinnitsa; fn collabSOV|A province between the Dniester and the Bug.|req hold Odessa
l_eternal|The Eternal Legion|l_church,l_rebellion|stab 8; spirit Legionary Romania: ws 6, manpower .05, rad .02|The Captain's portrait in every house.|
## the national peasants
peasant|The National Peasant Party|camarilla|ideo dem 14; bop 15; stab -4|Iuliu Maniu, the incorruptible Transylvanian, refuses the King again.|mx royal,legion,plough; ai 0
p_maniu|Maniu Takes Office|peasant|setIdeo dem; leader Iuliu Maniu/National Peasant Party; stab -4|A government that answers to parliament, not to the palace.|
p_land|Credit for Smallholders|p_maniu|ig rural 10 .2; spirit Peasant Credit: farm_out .08, rad -.04|The 1921 land reform is finished properly.|
p_coops|The Cooperative Movement|p_land|build farm 3, textile 1; spirit Village Cooperatives: farm_out .05|Dairies and mills owned by villages.|
p_honest|Clean Government|p_maniu|rmspirit f_the_camarilla; legit 8; spirit Honest Administration: tax .06|The ministers publish their accounts.|
p_local|Regional Autonomy|p_honest|stab 4; rel HUN 15; spirit Transylvanian Self-Government: stab 3|Cluj gets a say in how it is governed.|
p_free|Free Elections Every Four Years|p_honest,p_land|law universal, protected; legit 8|The King reigns; he no longer governs.|
p_west|The Western Orientation|p_free|rel FRA 25, ENG 25; ent balkan 10, little 10|Paris and London first, always.|
p_schools|Village Schools|p_coops|law public; spirit Village Teachers: literacy .3|A teacher in every commune.|
p_guarantee|Ask for a Guarantee|p_west|rel ENG 15; infl 30 ?? From London and Paris => guarantee ROM; rel ENG 10 // From all our neighbours => ent balkan 15; ent little 15|Romania asks the West to put its promises in writing.|req tension 30
p_armistice|The Armistice of Liberation|p_guarantee|fn joinAllies|Romania changes sides in a single evening.|req losingWar
p_democracy|A Peasant Democracy|p_schools,p_west|stab 8; spirit Peasant Democracy: legit 8, farm_out .05, stab 3|The country of villages governs itself.|
## the ploughmen's front
plough|The Ploughmen's Front|camarilla|ideo com 12; stab -6; bop 20|A landowner who sides with the poor peasants of Hunedoara.|mx royal,legion,peasant; ai 0
f_groza|Groza's Programme|plough|ig rural 10 .3; ideo com 6|The land of the great estates to those who plough it.|
f_strikes|The Grivița Strikes|plough|ig union 10; rad .04; stab -4|The railway workshops stop the capital.|
f_estates|Seize the Estates|f_groza|ig land -12 -.5, rural 10; spirit land_reform; mp 100|Every estate over fifty hectares is divided.|
f_gov|A People's Government|f_estates,f_strikes|setIdeo com; leader Petru Groza/Ploughmen's Front; stab -6|The red flag on the Royal Palace.|
f_moscow|Friendship with Moscow|f_gov|rel SOV 40; nap SOV; fn dropHunClaim|Bessarabia is no longer a question.|mx f_balkan
f_balkan|A Balkan Federation|f_gov|infl 40; rel YUG 20, BUL 20|Socialist Romania among socialist neighbours.|mx f_moscow
f_plan|The Five-Year Plan|f_gov|law command; build steel 2, tools 2; spirit Planned Industry: build .06|Oil, steel and tractors.|
f_comintern|Join the Comintern|f_moscow|fn joinComintern|Bucharest joins Moscow's camp.|
f_republic|The People's Republic|f_plan,f_comintern|f_plan,f_balkan|rename Romanian People's Republic/Romanian; stab 8; spirit Workers' Romania: output .05, manpower .05|The monarchy is abolished by decree.|
# Oil
oil|The Black Gold of Ploiești||money 6; build oilr 1|Europe's largest oilfield west of the Caspian.|ai 4
## contracts
o_auction|Auction the Oil|oil|money 8; infl 20|Every great power's legation wants Ploiești.|
o_berlin|The Wohlthat Treaty|o_auction|oil GER 20; rel GER 25; equip arms 200|Oil for German arms and technicians.|mx o_west
o_west|The Western Consortium|o_auction|oil ENG 15; oil FRA 10; rel ENG 20, FRA 20; money 8|British and French capital owns the wells.|mx o_berlin
o_italy|Tankers for Italy|o_auction|oil ITA 10; rel ITA 20; equip ships 4|Constanța loads Italian tankers.|
o_home|Oil for Romania First|o_auction|oil home 15; spirit ro_home_oil|The army and the railways come first.|
o_price|Index the Price to Gold|o_berlin|o_west|money 12; infl 10|No more paper marks or frozen sterling.|
o_sabotage|Prepare to Sabotage the Wells|o_home|spirit Wells Mined: def .03|If the fields are taken, they will burn.|
o_guard|The Oilfield Guard|o_home,o_italy|units inf 2; fort Ploiești; spirit Oil Guard: civdef .25|Anti-aircraft guns ring the refineries.|
o_lever|Oil as a Lever|o_price|infl 40; spirit Oil Diplomacy: infl .15|Who wants our oil must want our borders too.|
## the wells
o_drill|New Drilling|oil|res 10; dep Ploiești oil 1|Deeper wells in Prahova.|
o_refine|The Astra Română Refinery|o_drill|build oilr 2|One of the largest refineries in Europe.|
o_pipeline|The Pipeline to Constanța|o_refine|infra 2; build port 1|Oil to the sea without tank cars.|
o_moreni|The Moreni Field|o_drill|dep Ploiești oil 1; build oilr 1|A field that caught fire for two years.|
o_chem|Petrochemicals|o_refine|build chem 2; tech p_petro|Rubber and explosives from crude.|
o_nationalise|Nationalise the Oil Companies|o_pipeline,o_moreni|money 15; rel ENG -15, HOL -10; spirit National Oil: tax .06|The foreign companies are bought out at a price of our choosing.|
o_reserve|A Strategic Reserve|o_chem|spirit Oil Reserve of Romania: supply .08|Tanks of fuel for a year of war.|
# Foreign Policy
greater|Greater Romania||infl 20; ws 3|Transylvania, Bessarabia, Bukovina and Dobruja: everything won in 1918 must be held.|ai 4
## the ententes
g_titulescu|Titulescu's Diplomacy|greater|infl 40; rel FRA 15, CZE 15, YUG 15|The most eloquent foreign minister in Europe.|mx g_beck
g_beck|Beck's Friend|greater|rel POL 30; infl 20|Warsaw, not Paris, is the key.|mx g_titulescu
g_little|Revive the Little Entente|g_titulescu|ent little 20; rel CZE 20, YUG 20|Three small allies against Hungarian revision.|
g_balkan|The Balkan Entente|g_titulescu|g_beck|ent balkan 20; rel GRE 20, TUR 20|Four states, one guarantee of the frontiers.|
g_polish|The Polish Alliance|g_beck|allies POL; rel POL 20|An alliance against Moscow.|
g_france|The French Treaty|g_little|rel FRA 25; equip artillery 100|Schneider guns and a promise.|
g_conf|A Balkan Conference|g_balkan|ent balkan 15; infl 30|Every year, in a different capital.|
g_bridgehead|The Romanian Bridgehead|g_polish|infra 2; spirit Polish Corridor: supply .04|In defeat, Poland's army can cross to us.|
g_armed|Armed Neutrality|g_conf,g_france|g_conf,g_bridgehead|spirit armed_neutrality; stab 4|We will defend every frontier, against anyone.|
## the axis road
g_guarantee|The German Guarantee|greater|rel GER 30; infl 20|Berlin promises to protect what is left.|req gerFriend
g_vienna|Accept the Vienna Award|g_guarantee|stab -10; rel HUN 20, GER 20 ?? Cede the north of Transylvania => fn dropHunClaim // Demand a plebiscite instead => rel HUN -20; ws 6|Ribbentrop draws a line across Transylvania.|req tension 50
g_craiova|The Treaty of Craiova|g_guarantee|rel BUL 30; stab -4|Southern Dobruja returns to Bulgaria.|
g_tripartite|The Tripartite Pact|g_vienna|fn joinAxis|Romania signs in Berlin.|req gerFriend
g_mission|The German Military Mission|g_tripartite|tech m_doc1; equip arms 300, artillery 80; spirit German Instructors: org .05|A Wehrmacht division arrives to train ours.|
g_bessarabia|Recover Bessarabia|g_mission|claim Chișinău, Bălți, Cetatea Albă, Czernowitz; ws 10|The Prut is not our border.|req gerSovWar
g_odessa|Siege of Odessa|g_bessarabia|claim Odessa; spirit Siege Artillery [365]: atk .06|Two months and a hundred thousand casualties.|req atwar SOV
g_stalingrad|The Don Front|g_odessa|units inf 6; spirit Third and Fourth Armies [365]: def .04|Romania's best armies hold the flank of Stalingrad.|req atwar SOV
## the soviet question
g_moscow|Talks with Moscow|greater|rel SOV 20; nap SOV|A non-aggression pact without recognition of the border.|
g_concede|The Bessarabian Ultimatum|g_moscow|stab -10; rel SOV 20 ?? Yield without a shot => fn dropBulClaim; legit -6 // Fight => ws 10; units inf 4|Moscow gives us twenty-four hours.|req tension 55
g_dniester|The Dniester Line|g_moscow|fort Chișinău, Bălți|Bunkers along the river.|
g_carpathian|The Carpathian Line|g_dniester|fort Czernowitz, Cluj, Brașov|Mountains are our best fortress.|
g_hungary|Watch Budapest|greater|fort Oradea, Arad; units inf 2|The Hungarian army is practising on our border.|
g_minor|Treat the Hungarians Fairly|g_hungary|rel HUN 15; stab 3|Concessions in Cluj take the wind from Budapest's sails.|mx g_hard
g_hard|Romanianise Transylvania|g_hungary|rel HUN -20; ig pb 4; ws 4|Romanian names on Hungarian shops.|mx g_minor
# Economy
eco|The Economy of a Grain Exporter||money 4; build farm 2|Wheat and oil; little else.|ai 3
e_reform|Complete the Land Reform|eco|ig rural 8, land -6; spirit land_reform|Six million hectares redistributed, the work half-done.|
e_grain|Grain for Export|e_reform|build farm 3; trade GER, ITA|The Danube barges load for Vienna and Genoa.|
e_tractors|Tractors for the Villages|e_grain|tech p_tractors; build farm 2|The ox gives way, slowly.|
e_banat|The Banat Granary|e_tractors|build farm 2; dep Timișoara iron 1|The richest farmland in the kingdom.|
e_bank|The National Bank|eco|money 10; spirit Sound Leu: tax .06|A currency backed by gold and oil.|
e_debts|Settle the Foreign Debts|e_bank|money -10; rel FRA 10, ENG 10; spirit Good Credit: invest .2|The bondholders are paid, at last.|
e_tariff|Protect Home Industry|e_bank|law protectionism; build textile 2, tools 1|Factories behind high walls.|
e_reșița|The Reșița Works|eco|build steel 2, arms 1; dep Timișoara iron 1|Iron, steel and guns in the Banat hills.|
e_malaxa|Malaxa's Factories|e_reșița|build engines 1, autos 1, arms 1|Locomotives, tubes and rifles from one industrialist.|
e_iar|IAR Brașov|e_malaxa|build aircraftp 2; tech m_air1|Aircraft designed in Romania.|
e_coal|Jiu Valley Coal|e_reșița|build coalm 2; dep Sibiu coal 2|The mines that heat Bucharest.|
e_power|Hydroelectric Power|e_coal|build power 2; tech p_hydro|Dams in the Carpathians.|
e_rail|The Railway Programme|e_tariff|infra 3; build railway 2|New lines through the mountains to Transylvania.|
e_danube|The Danube Fleet of Barges|e_rail|build port 1; spirit Danube Shipping: tradecap .06|Galați and Brăila on the river.|
e_roads|Roads for the Villages|e_rail|infra 2; build construction 1|Most of the country is still mud in spring.|
e_plan|The Ten-Year Plan|e_power,e_iar|spirit Planned Development: build .06, output .03|An economy planned like a campaign.|
e_university|The Polytechnic of Bucharest|e_tariff|build university 1; res 20|Engineers for the oilfields.|
e_war|War Economy|e_plan|law war_econ; spirit Romanian War Production: mil_out .1|Everything for the front.|req war
e_textile|Textile Mills of Transylvania|e_tariff|build textile 2|Wool from the mountains, cloth from Sibiu.|
e_salt|The Salt Mines|e_coal|money 6; build chem 1|Salt for preserving and for chemistry.|
e_export|An Export Bureau|e_grain,e_debts|money 8; infl 20; spirit Export Office: tradecap .06|Selling grain and timber abroad.|
e_timber|Carpathian Timber|e_export|build logging 2, furniture 1|The forests of Bukovina.|
# Armed Forces
army|The Royal Romanian Army||spirit army_reform; pp 20|The largest army in the Balkans; mostly on paper.|ai 3
a_skoda|Czech Rifles and Guns|army|equip arms 400, artillery 100; rel CZE 15|The Zbrojovka contracts.|
a_mountain|Vânătorii de Munte|army|tech m_mtn; units mtn 3|Mountain troops, the elite of the army.|
a_cavalry|The Cavalry Corps|army|units cav 3|Romania's horsemen will ride to the Don.|
a_staff|The War College|army|xp; generals Petre Dumitrescu/3/def, Constantin Constantinescu/3/off|Officers trained in Paris.|
a_reform|Reorganise the Divisions|a_staff|units inf 4; spirit New Divisions: org .04|Twenty-one divisions with real equipment.|
a_carol|The Carol Line|a_reform|fort Galați, Chișinău; spirit Fortified Line: def .05|A line of bunkers along the eastern rivers.|
a_motor|Motorised Infantry|a_cavalry,a_reform|tech m_mot; units mot 1|Trucks from Malaxa.|
a_tanks|Renault and Panzer Tanks|a_motor|tech m_tank1; units arm 1; equip tanks 40|A tank regiment for the whole army.|
a_tacam|The TACAM Tank Destroyer|a_tanks|tech m_art2; units hvy 1|Captured Soviet guns on Czech chassis.|
a_reserves|Train the Reserves|a_reform|mp 150; law extensive|Every village sends its sons.|
a_artillery|The Artillery Programme|a_skoda|tech m_art1; build artyf 1|Guns from Reșița.|
a_antitank|Anti-Tank Guns|a_artillery|tech m_art2; equip artillery 100; spirit Anti-Tank Battalions: def .04|Lessons from Poland.|
a_marshal|Marshal of Romania|a_tacam,a_antitank|generals Ion Antonescu/4/off|A red-haired general with a temper.|
a_doctrine|A Doctrine of Our Own|a_marshal|tech m_doc1; spirit Romanian Doctrine: atk .03, def .03|French method, German speed, Romanian men.|
a_guard|The Royal Guard Division|a_staff|units inf 1; legit 2; spirit Guard Division: org .03|The King's own.|
a_border|Frontier Guards|a_reserves|units mil 6; fort Constanța|Every border, all at once.|
a_fortress|The Eastern Rampart|a_carol|fort Bălți, Iași; spirit Moldavian Fortifications: def .04|Concrete on the Prut.|
navy|The Royal Romanian Navy||equip ships 6; build port 1|Two destroyers and a submarine named Delfinul.|ai 2
n_destroyers|Italian Destroyers|navy|equip ships 8; rel ITA 10|Regele Ferdinand and Regina Maria.|
n_mines|Mine the Coast|navy|spirit Black Sea Mines: def .03, navy .05|Constanța behind a minefield.|
n_danube|The Danube Flotilla|n_mines|equip ships 4; spirit River Monitors: def .02|Monitors on the river.|
n_subs|Submarines from Galați|n_destroyers|tech m_nav2; equip ships 4|Built at home, with German help.|
n_base|Fortify Constanța|n_danube,n_subs|fort Constanța; spirit Coastal Batteries: navy .04|Coastal batteries along the cliffs.|
air|The Royal Air Force||build aircraftp 1; equip aircraft 60|Polish fighters and French bombers.|ai 2
f_iar80|The IAR 80|air|tech m_air2; equip aircraft 100; spirit Home-Built Fighters: air .06|A Romanian fighter that can hold its own.|
f_school|The Flying School at Cotroceni|air|spirit Romanian Pilots: air .05|Aces trained at home.|
f_bombers|Savoia Bombers|f_school|equip aircraft 60; spirit Bomber Group: bombing .08|Italian three-engined bombers.|
f_flak|Anti-Aircraft for Ploiești|f_iar80|tech s_civildef; spirit Ploiești Flak: civdef .35|The most defended target in Europe.|
f_cantacuzino|Prince Cantacuzino's Squadron|f_iar80,f_school|spirit Aces of the Bâzu: air .06|A prince among fighter pilots.|
# Society
soc|A Peasant Nation||stab 2|Four in five Romanians live in villages.|ai 2
s_church|The Orthodox Patriarchate|soc|ig devout 6; stab 3|The Patriarch is also a regent.|
s_schools|The Gusti School|soc|res 15; spirit Village Sociology: literacy .2, farm_out .03|Sociologists study and teach the villages.|
s_health|The Fight against Pellagra|s_schools|tech s_medicine; spirit Rural Health: growth .2|Maize alone is not a diet.|
s_culture|Eminescu and Enescu|soc|ws 3; infl 20|A national poet and a national composer.|
s_jews|The Jewish Question|soc|stab -2 ?? Protect them => rel USA 15, ENG 10; legit 4 // Restrict them => ig pb 6; rel GER 15; stab -2|Seven hundred thousand Jews, and a law about citizenship.|
s_women|Women's Vote|s_schools|law suffrage; legit 3|Women vote in local elections first.|
s_bucharest|Little Paris|s_culture|build urban 1; infl 20; spirit Little Paris: infl .05, research .02|Boulevards, cafés and a triumphal arch.|
s_press|The Universul Newspaper|s_culture|ig intel 5; legit 3|The largest daily in the Balkans.|
s_youth|Village Youth Clubs|s_health|mp 40; stab 2|Sport and choirs in every commune.|
s_unity|One Romania|s_bucharest,s_youth,s_church|stab 6; spirit United Principalities: stab 3, legit 4|Wallachia, Moldavia and Transylvania as one people.|
# The Conducător
c_crisis|The Summer of Humiliation|greater|stab -4; ws 6|Every neighbour wants a province, and the King has no answer.|req tension 45
c_call|Call General Antonescu|c_crisis|pp 30 ?? Make him Conducător => setIdeo aut; leader Ion Antonescu/Conducător; ig army 8 // Keep him in the army => generals Ion Antonescu/4/off; stab 4|A general under house arrest is summoned to the palace.|
c_full|Full Powers|c_call|law decree; pp 60; spirit Conducătorul: pp .1, stab 2|The constitution is suspended; the King signs decrees.|req ideo aut
c_purge|Purge the Guard|c_full|rad -.08; stab -3; ig army 6|The Legion's police are disarmed by the army.|mx c_share
c_share|Govern with the Legion|c_full|ideo fas 8; pp 40|Green-shirted ministers beside generals.|mx c_purge
c_officers|A Government of Officers|c_purge|spirit Military Administration: tax .04, stab 3|Colonels as prefects in every county.|
c_order|Order and Work|c_officers,c_share|c_purge,c_share|stab 6; build construction 1|Trains on time, peasants in the fields.|
c_german|German Credits|c_order|money 12; rel GER 20; oil GER 10|Berlin pays for oil with goods and gold.|req gerFriend
c_arms|The Armament Programme|c_german|build arms 2, artyf 1; equip arms 300|Rifles from Cugir, guns from Reșița.|
c_ration|Rationing|c_order|spirit Wartime Rationing: stab -2, mil_out .06|Bread cards in Bucharest.|req war
c_lands|Colonise the Liberated Lands|c_arms|stab -2; popgrow 1|Settlers for Bessarabia.|req hold Chișinău
c_jews|The Deportations|c_order|stab -2 ?? Deport to Transnistria => ig pb 6; rel GER 15; legit -8; rel USA -20 // Refuse Berlin's demands => rel GER -15; legit 6; rel USA 10|Berlin asks for the Jews of Romania.|req gerFriend
c_feelers|Peace Feelers in Stockholm|c_ration|infl 20; rel ENG 10, USA 10|Diplomats meet Soviet envoys over coffee.|req losingWar
c_cairo|The Cairo Talks|c_feelers|rel ENG 15; stab 2 ?? Seek a separate peace => sepeace SOV, ENG // Fight on beside Germany => ws 8; rel GER 10|Prince Știrbey flies to Egypt.|req losingWar
c_trial|The Marshal's Last Stand|c_cairo|units inf 4; spirit Last Stand: def .06, ws 6|If there is no peace, there is the Siret line.|req losingWar
# The Eastern Provinces
b_root|The Eastern Provinces||stab 2; infl 10|Bessarabia and Bukovina, Romanian since 1918 and claimed by Moscow ever since.|ai 3
b_schools|Schools for Bessarabia|b_root|build university 1; stab 2|Romanian schools in Chișinău.|
b_rail|The Bessarabian Railway|b_root|infra 2; build railway 1|A standard-gauge line to the Dniester.|
b_sugar|The Bălți Sugar Mills|b_rail|build farm 1; money 4|Beet from the black earth.|
b_wine|Wines of Cetatea Albă|b_sugar|money 4; build farm 1|Vineyards by the Dniester estuary.|
b_czernowitz|The University of Czernowitz|b_schools|res 10; stab 2|Lectures in Romanian, Yiddish heard in the corridors.|
b_land|Land for the Bessarabian Peasants|b_schools|ig rural 6; stab 3; spirit Bessarabian Smallholders: stab 2|The estates of the Russian nobles are divided.|
b_police|The Siguranța in Bessarabia|b_root|law guard; ig intel -4; rad -.04|Moscow's agitators are arrested.|
b_divs|Divisions on the Dniester|b_police|units inf 3; fort Chișinău|The border with the Soviet Union is the longest and the coldest.|
b_bukovina|Defend Bukovina|b_divs|fort Czernowitz, Suceava; units mtn 1|The Carpathian passes.|
b_recover|Recover the Lost Provinces|b_divs|claim Chișinău, Bălți, Cetatea Albă, Czernowitz; ws 8|What was taken in 1940 will be retaken.|req war
b_refugees|Settle the Refugees|b_land,b_czernowitz|stab 4; mp 30|Families who fled across the Prut.|
b_loyal|A Loyal Bessarabia|b_refugees,b_bukovina|stab 6; spirit Loyal Eastern Provinces: stab 3, manpower .03|Bessarabia votes, and votes Romanian.|
# Transylvania & the Minorities
t_root|The Transylvanian Question||stab 2|One and a half million Hungarians and seven hundred thousand Germans live inside our borders.|ai 3
t_cluj|The Cluj University|t_root|res 10; build university 1|The capital of Transylvanian learning.|
t_saxons|The Saxon Towns|t_root|rel GER 10; build tools 1|Hermannstadt and Kronstadt, German for eight hundred years.|
t_volks|The German Volksgruppe|t_saxons|rel GER 20; stab -2 ?? Grant autonomy => rel GER 15; stab -3; equip arms 100 // Keep them Romanian citizens => stab 3; rel GER -10|Berlin wants a state within the state.|
t_swabians|The Banat Swabians|t_saxons|build farm 2; mp 20|Farmers who came from Württemberg.|
t_szekler|The Székely Land|t_root|stab -2 ?? Cultural autonomy => rel HUN 20; stab 3 // Colonise it with Romanians => rel HUN -20; ig pb 4|Hungarians in the bend of the Carpathians.|
t_hungarian|The Hungarian Party|t_szekler|stab 3; rel HUN 10|Deputies in Bucharest who speak for Cluj's Hungarians.|
t_churches|The Uniate Church|t_cluj|ig devout 4; stab 2|Greek Catholics, the church of Transylvanian Romanians.|
t_alba|Alba Iulia Remembered|t_churches,t_hungarian|ws 4; stab 4; spirit The Great Union: stab 3, ws 4|Where the union was proclaimed on 1 December 1918.|
t_cede|Northern Transylvania Lost|t_alba|claim Cluj, Oradea; ws 8|The Vienna line will not stand.|req war
t_return|Restore Transylvania|t_cede|core Cluj, Oradea, Arad; stab 6|The north comes home.|req hold Cluj
# Danube & Black Sea
d_root|The Mouth of the Danube||money 4; build port 1|Romania sits where Europe's great river meets the sea.|ai 2
d_sulina|The Sulina Canal|d_root|build port 1; spirit Sulina Canal: tradecap .04|Deepened for ocean ships.|
d_commission|The Danube Commission|d_sulina|infl 30; rel ENG 10, FRA 10 ?? Keep the international regime => rel ENG 10, FRA 10 // Take full sovereignty => money 6; rel GER 10|Who rules the river?|
d_constanta|The Port of Constanța|d_root|build port 2; infra 1|The grain and oil port of the Black Sea.|
d_turkey|Black Sea Partners|d_constanta|rel TUR 25; trade TUR|Istanbul and Constanța share a sea.|
d_snake|Snake Island Lighthouse|d_constanta|spirit Snake Island Watch: navy .03|A rock in the sea, and a radio station.|
d_shipyard|The Galați Shipyard|d_sulina|build shipyard 1; tech m_nav2|River monitors and minesweepers.|
d_maritime|The Maritime Service|d_shipyard,d_turkey|spirit Romanian Merchant Marine: tradecap .05, navy .03|A merchant fleet under the tricolour.|
d_delta|Fisheries of the Delta|d_root|build farm 1; money 3|Sturgeon and caviar.|
d_bridge|The Cernavodă Bridge|d_delta|infra 2|The longest bridge in Europe, carrying the oil pipeline.|
# King Michael's Romania
m_young|The Young King|k_abdicate|legit 6; stab 3|Michael is popular because he is not his father.|
m_parties|Recall the Parties|m_young|ideo dem 8; stab 2|Maniu and Brătianu are received at the palace.|
m_bloc|The National Democratic Bloc|m_parties|ideo dem 6; pp 30|Liberals, Peasants, Social Democrats and even Communists.|
m_army|The Loyal Generals|m_young|ig army 6; generals Gheorghe Mihail/3/def|Officers who will obey the King against the Marshal.|
m_coup|23 August|m_bloc,m_army|setIdeo dem; fn joinAllies; rel SOV 20, ENG 20; ws -8|The Marshal is arrested in the palace; Romania changes sides.|req losingWar
m_turn|Turn the Guns West|m_coup|units inf 4; ws 10; spirit Romania Changes Sides: atk .04, ws 6|Twenty divisions march on Budapest and Vienna.|req war
m_transylvania|Liberate Northern Transylvania|m_turn|claim Cluj, Oradea; core Cluj, Oradea|The Allies promise the north.|req war
m_order|The Order of Michael the Brave|m_turn|xp; legit 4|The Soviet Union gives the King the Order of Victory.|
m_free|Free Elections|m_transylvania,m_order|law universal; stab 4; legit 6|The King insists on a vote.|
m_crown|The Crown Endures|m_free|stab 8; spirit Constitutional Kingdom: legit 8, stab 3|A king who saved his country.|
# The Army at War
w_mobilise|General Mobilisation|army|law extensive; mp 120|The reservists report to their depots.|req tension 40
w_corps|The Mountain Corps|w_mobilise|units mtn 2; spirit Mountain Corps: def .03|The Vânători in the Carpathians and the Crimea.|
w_cav|The Cavalry Corps Rides|w_mobilise|units cav 2; tech m_mot|Horsemen on the steppe, trucks behind them.|
w_rear|Rear Area Security|w_mobilise|units mil 3; spirit Rear Security: supply .03|Gendarmes behind the front.|
w_sanit|The Sanitary Service|w_rear|tech s_medicine; spirit Field Hospitals: manpower .03|Ambulance trains from Iași.|
w_staff2|The General Staff|w_corps,w_cav|generals Nicolae Dăscălescu/3/def; xp|The staff learns to plan a campaign.|
w_heavy|Heavy Artillery Regiments|w_staff2|units hvy 1; equip artillery 80|Skoda howitzers for the sieges.|
w_tanks2|The 1st Armoured Division|w_heavy|units arm 1; equip tanks 30|Romania Mare, the armoured division.|
w_air2|Air Support for the Army|w_staff2|equip aircraft 40; airm cas|Bombers over the battlefield.|
w_lessons|The Lessons of Odessa|w_tanks2,w_air2|spirit Lessons of Odessa: atk .04, org .03|We will not attack fortifications in waves again.|req war
w_reserve|Reserve Divisions|w_sanit|units inf 4|Old classes recalled.|req war
w_home|Home Defence Units|w_reserve|units mil 4; fort Bucharest|Militia around the capital.|
e_ploiesti2|Rebuild Ploiești|o_refine|build oilr 1; spirit Refinery Repair Crews: civdef .2|Crews who restore a refinery in a week.|
e_synth|Synthetic Fuel|o_chem|build synth 1|Fuel from coal, in case the wells burn.|
e_credit|The Industrial Credit Bank|e_bank|money 8; spirit Industrial Credit: invest .2|Loans for factories.|
`);

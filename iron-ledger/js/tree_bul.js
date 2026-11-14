// Bulgaria (2.1): hand-written. A Tsar who rules by balancing, a nation that lost three wars and three provinces, and four ways to win them back.
'use strict';
TREES.BUL = autoTree('bg_', `
# The Tsar's Throne
boris|Tsar Boris III||pp 40; stab 2|The quiet Tsar has abolished the parties and governs through ministers who do not matter.|ai 6
b_zveno|The Legacy of 1934|boris|pp 30 ?? Thank the Zveno colonels => ig army 6; bop 5 // Send them abroad as military attachés => pp 30; ig army -4|The officers who made the coup of 19 May 1934 expect a say.|ai 6
## the tsar's regime
tsar|The Tsar's Regime|b_zveno|law autocracy; pp 50; bop -5|No parties, no parliament worth the name, and a king who keeps his own counsel.|mx zv,agr,leg,ff; ai 6
t_kyoseivanov|The Kyoseivanov Cabinet|tsar|leader Georgi Kyoseivanov/Tsar's Government; stab 3|A diplomat as Prime Minister: the Tsar's secretary.|
t_assembly|A Controlled Assembly|t_kyoseivanov|legit 4; stab 2 ?? Elections without parties => legit 4 // No elections at all => pp 40; legit -4|Deputies elected as individuals, never as parties.|
t_filov|Professor Filov|t_assembly|leader Bogdan Filov/Tsar's Government; res 10|An archaeologist governs Bulgaria.|req year 1940
t_balance|Balance Between the Powers|t_kyoseivanov|infl 30; spirit The Tsar's Balance: infl .1, stab 2|Boris speaks German to the Germans and English to the English.|
t_neutral|Strict Neutrality|t_balance|spirit armed_neutrality; rel ENG 10, SOV 10|Bulgaria fought the last war and lost everything.|mx t_axis
t_axis|The Road to Vienna|t_balance|rel GER 30; patron GER|Germany is the only power that will help us recover what we lost.|mx t_neutral
t_pact|Sign the Tripartite Pact|t_axis|fn joinAxis|Bulgaria joins in March 1941, the German army already on the Danube.|req gerFriend & tension 55
t_noeast|No Bulgarian Soldier on the Eastern Front|t_pact|rel SOV 20; ws 4; spirit No War with Russia: stab 3|The Tsar refuses Hitler: the people would not fight Russians.|mx t_east
t_east|March East|t_pact|units inf 4; rel SOV -40; ws -10|The army goes to Russia, against the advice of every officer.|req gerSovWar; mx t_noeast
t_symbolic|The Symbolic War|t_noeast|stab 2 ?? Declare war on Britain and America => ws -4; rel ENG -20 // Refuse that too => rel GER -15; stab 3|Berlin asks for a symbolic declaration.|req gerFriend
t_jews|Save the Jews of Bulgaria|t_noeast|legit 8; rel USA 20; rel GER -15; stab 2|The Metropolitan lies on the rails; the deportations are stopped.|
t_death|The Tsar Dies|t_symbolic,t_jews|stab -6; leader Prince Kiril/Regency Council|Boris returns from a meeting with Hitler and dies within a fortnight.|req year 1943
t_regency|The Regency Council|t_death|pp 30; stab 2|A six-year-old Tsar and three regents.|
t_switch|Change Sides|t_regency|fn joinAllies; rel SOV 20, ENG 20|Bulgaria asks for peace before the Red Army reaches the Danube.|req losingWar
t_neutral2|The Neutral Kingdom|t_neutral|spirit Bulgarian Neutrality: stab 3, infl .1; infl 30|Bulgaria sits out the war, rearmed and waiting.|
t_profit|Profit from Neutrality|t_neutral2|money 12; trade GER, ENG|Tobacco and roses for both sides.|
t_dynasty|The Dynasty Secure|t_profit,t_assembly|stab 8; legit 8; spirit Saxe-Coburg Throne: legit 6, stab 3|The Tsar who kept Bulgaria out of the war.|
## zveno
zv|The Zveno Republicans|b_zveno|ideo aut 10; bop 10; ig army 6|Kimon Georgiev and Damyan Velchev want a modern, republican, Yugoslav-friendly Bulgaria.|mx tsar,agr,leg,ff; ai 0
z_velchev|Velchev Returns|zv|generals Damyan Velchev/4/def; ig army 8|The colonel who made two coups comes home.|
z_coup|The Third Coup|z_velchev|setIdeo aut; leader Kimon Georgiev/Zveno; stab -6|The Tsar is sent to his hunting lodge.|
z_republic|Proclaim the Republic|z_coup|rename Bulgarian Republic/Bulgarian; legit -4; pp 40|Bulgaria without a Coburg.|
z_technocrats|Government by Experts|z_coup|res 15; spirit Zveno Technocrats: tax .06, build .04|Engineers and economists replace the party bosses.|
z_yugoslav|Friendship with Yugoslavia|z_coup|rel YUG 40; nap YUG; rev macedonia -40|Macedonia is a bridge, not a battlefield.|
z_imro|Destroy the IMRO|z_yugoslav|rad -.06; stab 4; spirit IMRO Broken: stab 3|The Macedonian terrorists are hunted in the Pirin mountains.|
z_southslav|A South Slav Union|z_imro|rel YUG 20; ent balkan 20 ?? Federation with Yugoslavia => rel YUG 20; claim Skopje // Close alliance only => allies YUG|Two Slav kingdoms, one federal state.|
z_modern|Modernise the State|z_technocrats|build construction 1, railway 1; law interventionism|A state that builds roads and schools.|
z_army|A Professional Army|z_modern|xp; spirit Professional Officers: org .04|Promotion by merit, not by court favour.|
z_france|The French Connection|z_southslav|rel FRA 25, ENG 15; equip artillery 60|Paris will arm a Bulgaria that does not threaten Yugoslavia.|
z_balkan|Join the Balkan Entente|z_france|fn dropBulClaim; ent balkan 20|Bulgaria abandons revision.|
z_fatherland|Zveno in the Fatherland Front|z_army|ideo com 6; rel SOV 15|Georgiev joins the communists against the Germans.|req losingWar
## the agrarians
agr|The Agrarian Union|b_zveno|ideo dem 12; bop -10; ig rural 6|Stamboliyski's peasant party, banned but remembered in every village.|mx tsar,zv,leg,ff; ai 0
a_gichev|Gichev's Agrarians|agr|ig rural 8; ideo dem 6|The moderate wing, ready to share power.|mx a_pladne
a_pladne|The Pladne Agrarians|agr|ig rural 10; ideo com 4|The left wing, close to the communists.|mx a_gichev
a_popular|The Popular Bloc|a_gichev,a_pladne|pp 30; ideo dem 6|Agrarians, Democrats, Radicals and Social Democrats together.|
a_election|Free Elections|a_popular|law universal; stab -4; legit 8|The parties return to Sofia.|
a_gov|The Agrarian Government|a_election|setIdeo dem; leader Nikola Mushanov/Popular Bloc; stab 2|Peasants in the ministries again.|
a_land|The Land Belongs to Those Who Work It|a_gov|ig rural 12 .3, land -10; spirit land_reform|No estate larger than thirty hectares.|
a_labour|Compulsory Labour Service|a_land|build construction 1; mp 30; spirit Labour Service: build .04|Stamboliyski's invention: every young Bulgarian builds for a year.|
a_coops|The Cooperative Banks|a_land|build farm 3; money 4|Credit for the smallholders.|
a_green|The Green International|a_gov|rel YUG 15, ROM 15, POL 15; infl 20|Peasant parties of Eastern Europe, united.|
a_west|With the Democracies|a_green|rel ENG 25, FRA 25|Bulgaria will not be Germany's ally.|
a_allies|Join the Allies|a_west|fn joinAllies|The peasant democracy goes to war against fascism.|req tension 55
a_peasant|A Peasant Democracy|a_coops,a_labour|stab 8; spirit Agrarian Bulgaria: farm_out .08, stab 3, legit 4|The country of villages governs itself.|
## the legions
leg|The National Legions|b_zveno|ideo fas 12; bop 15; rad .04|Students in uniform, Macedonian revolutionaries and old Tsankovists.|mx tsar,zv,agr,ff; ai 0
l_ratniks|The Ratniks|leg|ideo fas 8; mp 20|The Warriors for the Advancement of the Bulgarian National Spirit.|
l_tsankov|Tsankov's Movement|leg|ideo fas 6; pp 30|The man who crushed the 1923 rising wants power again.|
l_imro|Ally with the IMRO|l_ratniks|rad .04; rev macedonia 15; generals Ivan Mihailov/2/off|The Macedonian Revolutionary Organisation's killers.|
l_march|The March on Sofia|l_tsankov,l_imro|setIdeo fas; leader Aleksandar Tsankov/National Social Movement; stab -8|The Tsar gives way.|
l_state|The Legionary State|l_march|law oneparty, secret_police; pp 40|Bulgaria, reborn in the image of Rome and Berlin.|
l_youth|Brannik Youth|l_state|mp 60; spirit Brannik: manpower .04, ws 4|The Defenders, Bulgaria's Hitler Youth.|
l_axis|The Axis Alliance|l_state|fn joinAxis; patron GER|Bulgaria is Germany's most eager ally.|req gerFriend
l_greater|Greater Bulgaria|l_axis|claim Skopje, Bitola, Kavala, Alexandroupoli, Dobrich, Salonika; ws 10|The borders of San Stefano.|
l_aegean|The Aegean Coast|l_greater|core Kavala, Alexandroupoli; build port 1|At last, a port on the Aegean.|req hold Kavala
l_ohrid|The Ohrid Lake|l_greater|core Skopje, Bitola; stab 4|Where Tsar Samuel's empire ruled.|req hold Skopje
l_police|The Police State|l_state|fn intelBoost; rad -.06|The Interior Ministry rounds up the opposition.|
l_eternal|The Eternal Bulgaria|l_aegean,l_ohrid|stab 8; spirit Greater Bulgaria: ws 6, stab 3, atk .03|Three seas, one tsardom.|
## the fatherland front
ff|The Workers' Party|b_zveno|ideo com 12; bop 20; rad .04|The communists are the strongest underground party in the Balkans.|mx tsar,zv,agr,leg; ai 0
f_dimitrov|Dimitrov's Line|ff|ideo com 8; rel SOV 20|The hero of the Reichstag fire trial directs from Moscow.|
f_front|The Fatherland Front|f_dimitrov|ideo com 6; pp 30|Communists, left Agrarians, Zveno and Social Democrats.|
f_partisans|Partisans in the Balkan Mountains|f_front|resist BUL 10; units mil 3|Detachments in the Stara Planina.|
f_strikes|The Tobacco Workers' Strikes|f_dimitrov|ig union 10; rad .04|Plovdiv's tobacco women walk out.|
f_rising|9 September|f_partisans,f_strikes|setIdeo com; leader Georgi Dimitrov/Fatherland Front; stab -8|The Fatherland Front takes Sofia.|
f_court|The People's Court|f_rising|ig land -10, army -6; rad -.08; stab -4|Regents, ministers and deputies are shot.|
f_moscow|The Soviet Alliance|f_rising|rel SOV 40; fn joinComintern|The Red Army is welcome in Bulgaria.|
f_plan|The Two-Year Plan|f_court|law command; build steel 2, tools 2|Factories for a country of farmers.|
f_coops|Labour Cooperative Farms|f_plan|ig rural -6; build farm 3; spirit Collective Farms: farm_out .04, stab -2|The village becomes a cooperative.|
f_federation|The Balkan Federation|f_moscow|rel YUG 30; claim Skopje ?? With Yugoslavia => rel YUG 20; rev macedonia 20 // Bulgaria leads it => ws 6; rel YUG -10|Dimitrov and Tito plan a single state.|
f_republic|The People's Republic|f_plan,f_federation|rename People's Republic of Bulgaria/Bulgarian; stab 8|The monarchy is abolished by referendum.|
# The Lost Lands
lost|The Lost Lands||ws 4; infl 10|Neuilly took Western Thrace, the Western Outlands and Southern Dobruja; Macedonia was lost in 1913.|ai 5
## dobruja
d_root|Southern Dobruja|lost|rev dobruja 10|The granary of Bulgaria, Romanian since 1913.|
d_refugees|The Dobrujan Refugees|d_root|rev dobruja 8; ws 2|Associations of exiles in Varna.|
d_moscow|Ask Moscow|d_root|patron SOV; rev dobruja 10|The Soviet Union is redrawing Romania's borders too.|mx d_berlin
d_berlin|Ask Berlin|d_root|patron GER; rev dobruja 10|Germany will arbitrate in Romania.|mx d_moscow
d_craiova|The Craiova Negotiations|d_moscow,d_berlin|d_refugees|rev dobruja 20; rel ROM 10|Talks in a Romanian town.|req tension 40
d_return|Dobruja Returns|d_craiova|core Dobrich; stab 4; ws 4|The province comes home without a shot.|req hold Dobrich
d_settle|Settle Dobruja|d_return|build farm 2; popgrow 1|Wheat from the Dobrujan plateau.|
## macedonia
m_root|Macedonia|lost|rev macedonia 8|Bulgarians, the Bulgarians say; Serbs, say the Serbs; Macedonians, say the Macedonians.|
m_committee|The Macedonian Committee|m_root|rev macedonia 8; rad .02|Exiles in Sofia keep the cause alive.|
m_imro|Unleash the IMRO|m_committee|rev macedonia 15; rel YUG -25; stab -2|Bands cross the border to Skopje.|mx m_school
m_school|Schools, Not Bombs|m_committee|rev macedonia 8; rel YUG 10|Bulgarian culture, not Bulgarian terror.|mx m_imro
m_patron|A Great-Power Patron|m_root|stab 1 ?? Italy => patron ITA; rel ITA 20 // Germany => patron GER; rel GER 20|Who will give us Macedonia?|
m_take|Occupy Macedonia|m_imro,m_patron|m_school,m_patron|rev macedonia 25; claim Skopje, Bitola|When Yugoslavia falls, the Bulgarian army moves in.|req tension 55
m_admin|Administer Macedonia|m_take|core Skopje, Bitola; spirit Macedonian Administration: stab -2, manpower .03|Bulgarian teachers and priests for the new provinces.|req hold Skopje
m_ohrid|Ohrid University|m_admin|build university 1; nat macedon -10|The seat of St Clement's school.|
## thrace
th_root|Western Thrace|lost|rev thrace 8|Our lost outlet to the Aegean.|
th_refugees|Thracian Refugees|th_root|rev thrace 6; mp 20|Families from Xanthi and Komotini.|
th_aegean|The Aegean Outlet|th_root|rev thrace 10; infl 20|Neuilly promised us economic access to the sea.|
th_greece|Talk to Athens|th_aegean|rel GRE 20; rev thrace 5 ?? Access to a free port => money 6; rev thrace -20 // Insist on the land => rev thrace 15; rel GRE -20|Metaxas will not cede a village.|
th_take|Occupy Thrace|th_refugees,th_greece|claim Kavala, Alexandroupoli; rev thrace 20|The Bulgarian Second Army moves to the coast.|req tension 55
th_admin|Administer Thrace|th_take|core Kavala, Alexandroupoli; build port 1|Bulgarian administration in Kavala.|req hold Kavala
th_edirne|Eastern Thrace|th_admin|claim Edirne; rel TUR -30|Adrianople, the city we took in 1913.|req atwar TUR
## the outlands
o_root|The Western Outlands|lost|rev macedonia 4; claim Niš|Strumica, Tsaribrod and Bosilegrad, given to Yugoslavia.|
o_salonika|Salonika|o_root|claim Salonika; ws 4|The port of all Macedonia.|req atwar GRE
o_neuilly|Tear Up Neuilly|o_root|ws 8; spirit Neuilly Repudiated: ws 4, manpower .03|The treaty's limits on our army are ignored.|
o_san|The Borders of San Stefano|o_neuilly,m_take,th_take|ws 10; stab 6; spirit San Stefano Restored: ws 6, stab 4|For three months in 1878 Bulgaria was whole.|
# Foreign Policy
fp|Bulgaria and the Powers||infl 20|Bulgaria has no friends among its neighbours.|ai 4
fp_yug|Eternal Friendship with Yugoslavia|fp|rel YUG 30; nap YUG|The 1937 treaty with Belgrade.|
fp_salonika|The Salonika Agreement|fp|ws 6; spirit Salonika Agreement: manpower .05|The Balkan Entente lets us rearm.|
fp_italy|The Italian Queen|fp|rel ITA 25; patron ITA|Tsaritsa Giovanna is Victor Emmanuel's daughter.|
fp_sobolev|The Sobolev Mission|fp|rel SOV 20 ?? Accept the Soviet pact => nap SOV; rel GER -20 // Refuse politely => rel SOV -10; rel GER 10|Moscow offers a pact of mutual assistance and Dobruja.|req year 1940
fp_turkey|Peace with Turkey|fp_salonika|rel TUR 30; nap TUR|The 1941 declaration of non-aggression.|
fp_germany|The German Clearing|fp|trade GER; money 8; rel GER 20|Germany buys our tobacco and pays in machines.|
fp_britain|The British Market|fp_germany|rel ENG 15; money 4|Rose oil for London's perfumers.|
fp_arms|German Arms on Credit|fp_germany|equip arms 300, artillery 80, tanks 20; rel GER 15|Panzers on credit.|
fp_hungary|Revisionist Brothers|fp_italy|rel HUN 30|Budapest and Sofia want the same thing.|
fp_watch|Watch the Turks|fp_turkey|fort Edirne, Burgas|The Turkish army is on the Maritsa.|
fp_balance|The Balanced Diplomacy|fp_britain,fp_sobolev,fp_hungary|infl 40; spirit Patient Revisionism: infl .1, stab 2|Wait for the war, and take sides only when sure.|
# Economy
ec|The Peasant Economy||build farm 2; money 3|Tobacco, roses and wheat.|ai 3
ec_tobacco|The Tobacco Monopoly|ec|money 8; spirit Oriental Tobacco: tax .05|The finest tobacco in the world, sold to Germany.|
ec_roses|The Rose Valley|ec|money 6; infl 10|Kazanlak rose oil, worth more than gold.|
ec_pernik|The Pernik Coal Mines|ec|build coalm 2; dep Sofia coal 2|Coal for the railways.|
ec_kremik|Kremikovtsi Iron|ec_pernik|dep Sofia iron 1; build steel 1|A steel mill for Bulgaria.|
ec_sofia|Sofia's Factories|ec_kremik|build tools 1, textile 1|A capital that makes things.|
ec_arms|The State Arsenal at Kazanlak|ec_sofia|build arms 2, artyf 1|Rifles and guns made at home.|
ec_air|DAR and Kaproni Bulgarski|ec_arms|build aircraftp 1; tech m_air1|Aircraft factories at Bozhurishte and Kazanlak.|
ec_rail|The Railway to the Sea|ec|infra 2; build railway 1|Sofia to Burgas, Ruse to Varna.|
ec_ports|Varna and Burgas|ec_rail|build port 2|Black Sea ports for our grain.|
ec_ruse|Ruse on the Danube|ec_rail|build port 1; money 3|Bulgaria's river port.|
ec_coops|Agricultural Cooperatives|ec_tobacco|build farm 2; spirit Cooperative Movement: farm_out .05|The strongest cooperative movement in Europe.|
ec_power|Dams on the Iskar|ec_pernik|build power 2; tech p_hydro|Electricity for Sofia.|
ec_chem|Chemical Works|ec_power|build chem 1|Fertiliser for the fields.|
ec_plan|The Economic Plan|ec_air,ec_chem|spirit Bulgarian Industry: build .05, output .03|From peasant country to industrial state.|
ec_bank|The Bulgarian National Bank|ec|money 8; spirit Sound Lev: tax .04|The lev is stable at last.|
ec_textile|The Gabrovo Mills|ec_coops|build textile 2|The Bulgarian Manchester.|
ec_roads|Mountain Roads|ec_ports|infra 2; build construction 1|Through the Shipka Pass.|
ec_war|War Economy|ec_plan|law war_econ; spirit Bulgarian War Effort: mil_out .1|Everything for the front.|req war
ec_export|The Export Institute|ec_roses,ec_bank|money 6; spirit Export Institute: tradecap .06|Bulgarian goods for every market.|
# The Army
ar|The Bulgarian Army||spirit army_reform; pp 20|Neuilly limited us to twenty thousand men. We have a great many more.|ai 3
ar_secret|The Secret Reserves|ar|mp 80; units inf 2|Labour battalions that drill with rifles.|
ar_conscript|Restore Conscription|ar_secret|law extensive; mp 120|The treaty no longer binds us.|req tension 30
ar_mtn|The Rhodope Mountain Troops|ar|tech m_mtn; units mtn 2|Mountains on every border.|
ar_cav|The Cavalry Divisions|ar_mtn|units cav 2|Horsemen for the Dobrujan plain.|
ar_staff|The War School|ar_conscript|generals Konstantin Lukash/3/def, Nikola Mihov/3/off; xp|The staff of 1915 trains a new generation.|
ar_german|German Instructors|ar_staff|tech m_doc1; spirit German Training: org .05|A Wehrmacht mission in Sofia.|req gerFriend
ar_czech|Czech Equipment|ar_secret|equip arms 300, artillery 60|Skoda guns, bought through Germany.|
ar_art|Artillery Programme|ar_czech|tech m_art1; build artyf 1|Guns for every division.|
ar_at|Anti-Tank Battalions|ar_art|tech m_art2; equip artillery 60|Lessons from the French campaign.|
ar_motor|The Motorised Brigade|ar_cav|tech m_mot; units mot 1|Trucks from Germany.|
ar_tanks|The Armoured Brigade|ar_motor|tech m_tank1; units arm 1; equip tanks 40|Czech and French tanks, German-supplied.|
ar_metaxas|Facing the Metaxas Line|ar_at|units hvy 1; spirit Siege Engineers: atk .04|We will need to break through Greek bunkers.|
ar_turk|The Turkish Front|ar_staff|fort Burgas, Stara Zagora; units inf 2|Three corps face Edirne.|
ar_doctrine|A Bulgarian Doctrine|ar_tanks,ar_metaxas,ar_german|spirit Bulgarian Doctrine: atk .04, def .03|Fast in the plain, stubborn in the mountains.|
ar_reserve|Mobilisation of the Reserves|ar_conscript|units inf 4|Every class to 45.|req war
ar_border|The Border Guard|ar_reserve|units mil 4|The frontier with three hostile neighbours.|
ar_occupation|Occupation Corps|ar_border|units inf 3; spirit Occupation Corps: supply .03|Divisions to hold Macedonia and Thrace.|req war
na|Navy and Air Force||equip ships 4, aircraft 30|Four torpedo boats and an air force forbidden by treaty.|ai 2
na_torp|Torpedo Boats from Varna|na|equip ships 4; build shipyard 1|A fleet for the Black Sea coast.|
na_mines|Mine the Coast|na|spirit Black Sea Mines: navy .04, def .02|Varna and Burgas behind minefields.|
na_aegean|An Aegean Squadron|na_torp|equip ships 4|Ships for a port we do not yet have.|req hold Kavala
na_air|The Royal Air Force|na|equip aircraft 60; tech m_air1|Avia fighters and Dornier bombers.|
na_bf|Messerschmitts|na_air|tech m_air2; equip aircraft 60; spirit Bulgarian Fighter Wing: air .05|The 6th Fighter Regiment.|
na_flak|Defend Sofia|na_bf|tech s_civildef; spirit Sofia Air Defence: civdef .3|If the Americans come, they will bomb the capital.|
na_pilots|Pilot Training|na_air|spirit Bulgarian Pilots: air .04|Schools in Kazanlak.|
# Society and Church
so|The Bulgarian Nation||stab 2|A people who freed themselves from the Turks in 1878 and have been fighting their neighbours since.|ai 2
so_church|The Bulgarian Exarchate|so|ig devout 6; stab 3|The Church that kept the nation alive under the Ottomans.|
so_stefan|Metropolitan Stefan|so_church|legit 4; ig devout 4|An outspoken bishop of Sofia.|
so_schools|The Chitalishte|so|spirit Reading Rooms: literacy .25, stab 1|A reading room and a theatre in every village.|
so_university|Sofia University|so_schools|build university 1; res 15|The intelligentsia of the nation.|
so_health|Public Health|so_schools|tech s_medicine; spirit Village Doctors: growth .15|Tuberculosis in the tobacco villages.|
so_writers|Elin Pelin and Yovkov|so_university|infl 20; ws 2|Writers of the village.|
so_sport|The Yunak Sports Union|so_health|mp 30; ws 2|Gymnastics and patriotic songs.|
so_jews|The Jewish Question|so_stefan|stab 1 ?? Protect them => legit 6; rel USA 10 // The Law for the Defence of the Nation => rel GER 15; ig pb 4; legit -6|Berlin asks for a law; the writers and the Church protest.|
so_turks|The Turkish Minority|so|stab 2 ?? Equal rights => stab 3; rel TUR 15 // Emigration to Turkey => rel TUR -10; popgrow -1|Six hundred thousand Muslims live in Bulgaria.|
so_women|Women's Vote|so_schools|law suffrage; legit 3|Married women may vote, since 1937.|
so_nation|One Bulgarian Nation|so_writers,so_sport,so_jews|stab 6; spirit Bulgarian Revival: stab 3, ws 3|The spirit of the National Revival.|
# The IMRO
im|The Internal Macedonian Revolutionary Organisation||rad .02|A state within the state in the Pirin region, with its own taxes and its own executions.|ai 2
im_pirin|The Pirin Statelet|im|stab -2 ?? Tolerate it => rev macedonia 8; rad .03 // Break it up => stab 4; rad -.04; rev macedonia -6|Petrich is governed by Mihailov's men.|
im_feud|The Mihailovists and the Protogerovists|im|stab -2; rad .02|Twenty years of assassinations between two factions.|
im_mihailov|Back Ivan Mihailov|im_feud|rev macedonia 10; ideo fas 4|The leader in exile in Turkey, then Italy.|mx im_left
im_left|The United IMRO|im_feud|rev macedonia 6; ideo com 4|The left wing wants a Macedonian republic in a Balkan federation.|mx im_mihailov
im_ustase|The Croatian Connection|im_mihailov|rel ITA 10; rad .03|The IMRO trained the man who shot King Alexander.|
im_bands|The Cheti|im_pirin,im_mihailov|im_pirin,im_left|units mil 3; rev macedonia 8|Armed bands for the day Yugoslavia falls.|
im_volunteers|Macedonian Volunteers|im_bands|mp 30; units mil 2|Ochrana and the volunteer legions.|req war
im_skopje|The Skopje Committee|im_volunteers|rev macedonia 15; stab 2|A Bulgarian committee waiting for the Yugoslav collapse.|req tension 55
im_disband|Disband the Bands|im_bands|stab 6; rad -.05; rel YUG 15|The Macedonian question is settled by diplomats.|req hold Skopje
im_republic|An Independent Macedonia|im_skopje|stab 2 ?? Annexed to Bulgaria => core Skopje, Bitola // A Macedonian state under our protection => infl 40; rev macedonia 10|Mihailov dreams of a Macedonian Switzerland.|req hold Skopje
# The Occupied Lands
oc|The New Provinces||stab 1|Administering lands that were ours by right.|ai 2
oc_bulgarise|Bulgarisation|oc|stab -2 ?? Teachers and priests => stab 2; spirit Bulgarian Schools in the New Lands: stab 1 // Expel the Serbian and Greek officials => ws 4; stab -3; rel YUG -10, GRE -10|The Exarchate returns to Ohrid and Kavala.|req hold Skopje
oc_colonists|Settle the Aegean Coast|oc_bulgarise|popgrow 1; build farm 1|Bulgarian families to Drama and Serres.|req hold Kavala
oc_tobacco|The Thracian Tobacco|oc_colonists|money 10|The richest tobacco fields in Greece.|req hold Kavala
oc_drama|The Drama Uprising|oc_bulgarise|stab -4 ?? Crush it => resist GRE -15; legit -6; rel GRE -20 // Ease the occupation => stab 3; resist GRE -5|Greek communists rise in September 1941.|req hold Kavala
oc_serbia|Occupation Duty in Serbia|oc|units inf 2; rel GER 15; stab -2|Germany asks for divisions to hold southern Serbia.|req gerFriend & war
oc_partisans|Hunting Partisans|oc_serbia|resist YUG -10; rel GER 10; stab -2|The Bulgarian occupation corps sweeps the hills.|req war
oc_admin|The Civil Administration|oc_bulgarise|spirit New Provinces Administration: tax .03, stab -1|Prefects from Sofia.|
oc_rail|Railways to the Aegean|oc_admin|infra 2|Sofia to Kavala, by way of the Struma.|req hold Kavala
oc_keep|Keep What We Took|oc_rail,oc_tobacco,oc_partisans|oc_admin,oc_tobacco|ws 6; spirit Holders of the New Lands: def .03, ws 4|Bulgaria will not give back Thrace and Macedonia lightly.|
# The Black Sea and the Danube
bs|The Black Sea Coast||money 3|Varna, Burgas and the beaches of Nesebar.|ai 2
bs_varna|The Varna Naval School|bs|build shipyard 1; spirit Varna Naval School: navy .03|Officers for a navy that does not yet exist.|
bs_burgas|Develop Burgas|bs|build port 1; build chem 1|Salt pans and a refinery.|
bs_trade|Black Sea Trade|bs_burgas|trade TUR, ROM; money 4|Constanța, Istanbul and Odessa.|
bs_danube|The Danube Bridge|bs|infra 2; rel ROM 10|A bridge from Ruse to Giurgiu, one day.|
bs_fisheries|Fisheries|bs_varna|money 3; build farm 1|Mackerel and turbot.|
bs_coast|Coastal Artillery|bs_varna|fort Varna, Burgas; spirit Coastal Guns: navy .02, def .02|In case the Soviet fleet comes.|
bs_resorts|The Golden Sands|bs_trade|money 4; infl 10|Holidaymakers from Germany.|
bs_shipping|A Merchant Fleet|bs_trade,bs_fisheries|spirit Bulgarian Merchant Fleet: tradecap .05|Ships under our own flag.|
# The Tsar's Court
ct|The Court at Vrana||legit 2|The Tsar's palace outside Sofia, where ministers are made and unmade.|ai 2
ct_ferdinand|The Shadow of Ferdinand|ct|legit -2 ?? Keep the old Tsar in Coburg => legit 4 // Let him advise => infl 20; legit -2|Boris's father, who lost two wars, still writes letters.|
ct_giovanna|Tsaritsa Giovanna|ct|rel ITA 15; legit 3|An Italian princess, beloved for her charity.|
ct_simeon|The Heir Simeon|ct_giovanna|legit 6; stab 2|A son is born in 1937; the bells ring for a day.|req year 1937
ct_hunt|The Royal Hunts|ct|infl 15; rel GER 5, ENG 5|Ambassadors are invited to shoot bears.|
ct_palace|The Palace Guard|ct_ferdinand|units inf 1; spirit Royal Guard: org .02, legit 2|A regiment loyal to the Tsar, not to the colonels.|
ct_spies|The Court's Ears|ct_palace|fn intelBoost|Officers who report on the officers.|
ct_kiril|Prince Kiril|ct_simeon|legit 2; stab 1|The Tsar's brother, a regent in waiting.|
ct_legacy|The Tsar's Legacy|ct_kiril,ct_spies,ct_hunt|stab 6; spirit Tsar's Legacy: legit 5, stab 3|A monarchy that knows how to survive.|
# The Reckoning
rk|The Reckoning||ws 2|Bulgaria has lost every war of the century. Plan for the next defeat.|ai 2
rk_feelers|Peace Feelers in Ankara|rk|rel ENG 10, USA 10; infl 20|Bulgarian diplomats meet the British in Turkey.|req losingWar
rk_bombing|The Bombing of Sofia|rk_feelers|stab -4; ws -6 ?? Seek peace at once => rel ENG 15; ws -4 // Stand firm => ws 8|American bombers set the capital on fire.|req losingWar
rk_bagryanov|The Bagryanov Cabinet|rk_feelers|leader Ivan Bagryanov/Tsar's Government; infl 20|A minister to get Bulgaria out of the war.|req losingWar
rk_neutral|Declare Neutrality|rk_bagryanov|rel SOV 15, ENG 15; ws -4|The German troops are asked to leave.|req losingWar
rk_soviet|The Soviet Declaration|rk_neutral|stab -6 ?? Join the Allies at once => fn joinAllies; rel SOV 30 // Plead neutrality => rel SOV -20|Moscow declares war on a neutral Bulgaria.|req losingWar
rk_evacuate|Evacuate Thrace and Macedonia|rk_neutral|stab 2; rel GRE 20, YUG 20|The army comes home.|req losingWar
rk_army|The Bulgarian Army in Hungary|rk_soviet|units inf 4; ws 6|Bulgarian divisions fight beside the Red Army at Drava.|req war
rk_keep|Keep Dobruja|rk_evacuate|core Dobrich; stab 4|Southern Dobruja remains Bulgarian.|req hold Dobrich
# The Village
vl|The Bulgarian Village||stab 1; build farm 1|Four Bulgarians in five live by the land.|ai 2
vl_tobacco|The Tobacco Growers|vl|ig rural 4; money 3|Plovdiv and Haskovo grow the leaf for Reemtsma.|
vl_roses|The Rose Pickers|vl|money 3; infl 5|Dawn harvests in the valley of Kazanlak.|
vl_yogurt|Bacillus Bulgaricus|vl|tech s_medicine; infl 10|Metchnikoff says Bulgarians live long because of yogurt.|
vl_cattle|Cattle and Sheep|vl_tobacco|build ranch 2|The shepherds of the Balkan mountains.|
vl_wells|Village Wells|vl_yogurt|spirit Clean Water: growth .1, stab 1|Water from the tap, not the river.|
vl_mills|Electric Mills|vl_wells|build power 1; build farm 1|The water mill gives way.|
vl_credit|Cheap Credit|vl_tobacco,vl_roses|money -4; ig rural 6; spirit Village Credit: farm_out .04|The Agricultural Bank lends at five per cent.|
vl_vineyards|The Vineyards of Melnik|vl_roses|money 3|Red wine from the Struma valley.|
vl_teachers|Teachers for the Villages|vl_wells|spirit Village Teachers: literacy .2|Literacy reaches the mountain hamlets.|
vl_roads|Village Roads|vl_mills|infra 1; build construction 1|Carts reach the market in any season.|
vl_tractors|Tractor Stations|vl_credit,vl_mills|tech p_tractors; build farm 2|Machines lent by the cooperatives.|
vl_folk|The Folk Song|vl_teachers|ws 2; stab 2|The village choirs of Shopluk.|
vl_harvest|The Great Harvest|vl_tractors,vl_roads,vl_folk|stab 6; spirit Bountiful Harvests: farm_out .06, stab 2|Granaries full for the first time since 1912.|
vl_export|Grain for Germany|vl_harvest|money 8; rel GER 10|The surplus goes north.|
vl_reserve|A Strategic Grain Reserve|vl_harvest|spirit Grain Reserve: supply .04, stab 1|In case the war comes again.|
`);

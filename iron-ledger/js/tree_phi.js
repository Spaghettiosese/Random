// The Philippines (1.5): hand-written tree. Commonwealth politics, the road to independence, and seven thousand islands to defend.
'use strict';
TREES.PHI = autoTree('ph_', `
# The Commonwealth
commonwealth|The Commonwealth||pp 50; stab 4|Ten years of self-government under the American flag.|ai 5
inaugural|Inauguration at the Legislative Building|commonwealth|legit 6; pp 30|A quarter of a million people on the Luneta.|ai 5
## social justice
justice|Social Justice|inaugural|ig rural 6, union 4; rad -.08; bop 5|Justice for the man behind the plough.|mx sakdal,unions,statehood; ai 6
q_language|A National Language|justice|stab 4; spirit National Language: legit 5, literacy .3|One tongue among eighty.|
q_suffrage|Women's Suffrage|justice|law universal; legit 6|Decided by a plebiscite of women.|
q_tenancy|Rice Share Tenancy Act|justice|ig rural 5, land -4; spirit land_reform|Half the crop to the man who grows it.|
q_wage|The Minimum Wage|justice|law regulated; ig union 6; rad -.05|One peso a day in the provinces.|
q_capital|A New Capital|q_language|build urban 2, admin 1; vp Manila 3|A planned city named for the President.|
q_institute|Institute of National Language|q_language|res 10; ig intel 6; build university 1|A grammar and a dictionary by the deadline.|
q_estates|Buy the Friar Estates|q_tenancy|ig rural 8, devout -4; money -4; spirit Homesteads for Tenants: farm_out .08, rad -.05 ?? Pay the full asking price => money -8; ig devout 5 // Expropriate at assessed value => ig devout -8, rural 5; rad -.03|The government buys haciendas and sells them to their tillers.|
q_courts|Court of Industrial Relations|q_wage|ig union 5, ind -3; stab 3; spirit Compulsory Arbitration: rad -.05, output .03|Strikes go before a judge.|
q_partyless|Partyless Democracy|q_suffrage,q_courts|pp 80; ideo aut 6; spirit Coalition Rule: pp .1|Opposition is a luxury a new nation cannot afford.|mx q_opposition
q_opposition|A Loyal Opposition|q_suffrage,q_courts|ideo dem 6; stab 4; legit 5|Two parties, one constitution.|mx q_partyless
q_term|Amend the Term Limit|q_partyless|q_opposition|pp 60; legit 5|Eight years, in two terms of four.|
q_senate|Restore the Senate|q_term|legit 6; ig land 4; stab 3|A second chamber, elected at large.|
q_emergency|Emergency Powers Act|q_term|pp 100; spirit Presidential Decrees: pp .12, legit -3|The Assembly votes itself a long holiday.|req tension 40
q_code|A Code of Citizenship|q_institute,q_capital|stab 5; spirit Sixteen Rules of Conduct: stab 3, sway .1|Memorised in every schoolroom.|
q_health|The President's Illness|q_senate|stab -3; pp 40; leader Sergio Osmeña/Nacionalista|The old rival, patient for twenty years, takes over.|mx q_cling
q_cling|Hold On to Office|q_senate|stab 3; pp 60; legit -4|A resolution suspends the succession for the duration.|mx q_health
q_roxas|The Young Lion|q_health|q_cling|generals Manuel Roxas/3/politic; ig ind 6; pp 40|A brigadier, a speaker and a president in waiting.|
q_nation|A Nation Ready|q_roxas,q_code,q_estates|stab 10; spirit Tested Institutions: legit 10, pp .08, output .04|Whatever comes, the state will still be standing.|
## the sakdal rising
sakdal|The Sakdal Rising|inaugural|ideo fas 12; stab -6; bop 25|'To accuse': peasants who want independence now and help from Tokyo.|mx justice,unions,statehood; ai 0
s_exile|The Leader in Tokyo|sakdal|rel JAP 30; pp 50; leader Benigno Ramos/Ganap|He edits his newspaper from a Japanese boarding house.|
s_ganap|The Ganap Party|s_exile|setIdeo fas; stab -6|Complete independence, by any ally.|
s_boycott|Boycott the Commonwealth|sakdal|rad .08; ig rural 8 .2; bop 10|No taxes to a government of the landlords.|
s_asians|Asia for the Asians|s_ganap|rel JAP 40; fn phJapan|A friend across the Luzon Strait.|
s_league|The Patriotic League|s_ganap,s_boycott|units mil 6|Bamboo-hatted auxiliaries.|
s_general|The Old General|s_ganap|generals Artemio Ricarte/3/old; legit 6; ws 6|He never swore allegiance to the Americans, in forty years.|
s_expel|Expel the High Commissioner|s_asians|free 0; rel USA -40; ws 10|The mansion on the bay is given an hour to pack.|
s_kalibapi|One Party for the New Philippines|s_league,s_general|law oneparty; pp 80; spirit Service to the New Philippines: pp .1, stab 4|Every other party is dissolved into it.|
s_land|Sakdal Land Decrees|s_boycott,s_league|ig land -10 -.4, rural 10; build farm 3|The haciendas of Central Luzon are occupied by their tenants.|
s_pact|Pact of Alliance|s_expel|jointo JAP; trade JAP|Independence, recognised first by Tokyo.|
s_makapili|The Patriots' Corps|s_kalibapi,s_pact|units inf 4, mil 6; equip arms 300|Armed by the ally, loyal to the cause.|
s_tagalog|Tagalog Only|s_kalibapi|ig intel -5; spirit Purified Language: sway .15, legit 4|English signs come down.|
s_malay|Greater Malay Nation|s_pact,s_tagalog|claim Jesselton, Kuching, Brunei; infl 40|One people from Luzon to Sumatra, says the pamphlet.|
s_republic|The Sakdal Republic|s_makapili,s_land,s_malay|stab 10; spirit Freedom at Any Price: manpower .1, ws 10, legit 6|The poor man's independence.|
## peasant unions
unions|Peasant Unions|inaugural|ideo com 12; stab -4; ig rural 8 .2|Central Luzon's tenants organise.|mx justice,sakdal,statehood; ai 0
u_merger|Socialists and Communists Merge|unions|ideo com 8; pp 50; leader Pedro Abad Santos/Socialist Party|A landlord's son leads the tenants.|
u_strikes|The Harvest Strikes|unions|rad .08; ig land -8 -.3; bop 8|The rice stays in the fields until the shares change.|
u_mayors|Red Mayors of Pampanga|u_merger,u_strikes|legit 6; stab -3; ig rural 6|Socialists win town halls, legally.|
u_front|The Popular Front|u_merger|setIdeo com; stab -6|An electoral alliance becomes a government.|
u_army|A People's Army|u_front,u_mayors|units mil 8; spirit Squadrons of a Hundred: manpower .08, def .04|Armed with what they can find.|
u_haciendas|Break the Haciendas|u_front|ig land -10 -.5, rural 8; build farm 3; spirit land_reform|The sugar barons' land is divided.|
u_councils|Barrio Councils|u_haciendas|law council; stab 4; spirit United Defence Corps: civdef .2, stab 3|Each village governs and guards itself.|
u_church|Church Lands|u_haciendas|ig devout -10 -.3; money 10|The largest landlord in the islands wears a cassock.|
u_supremo|The Supremo|u_army|generals Luis Taruc/4/jungle; xp; pp 40|A tailor's son commands from Mount Arayat.|
u_soviet|The Luzon Councils|u_councils,u_supremo|fn joinComintern; rel PRC 20|A red republic in the rice bowl.|mx u_national
u_national|A National Road|u_councils,u_supremo|rel USA 10; legit 8; spirit Democratic Alliance: pp .08, legit 5|Socialism in the Assembly, not from the forest.|mx u_soviet
u_bases|Close the Bases|u_soviet|u_national|free 0; rel USA -25; ws 6|No foreign flag on Philippine soil.|
u_coops|Rice Cooperatives|u_church,u_councils|build farm 2, tools 1; spirit Tenants No More: farm_out .12, rad -.08|The mill belongs to those who use it.|
u_islands|Carry It to the Visayas|u_bases,u_coops|ig union 8; stab 4; build plantation 2|Cane cutters of Negros hear the news.|
u_republic|The Republic of Toilers|u_islands|stab 10; spirit New Democracy of the Islands: output .05, manpower .08, legit 8|Land, bread and independence.|
## the forty-ninth star
statehood|The Statehood Movement|inaugural|rel USA 30; bop -30; ideo dem 6|Why leave, when we could join?|mx justice,sakdal,unions; ai 0
t_federal|The Federalistas Revived|statehood|pp 50; ig ind 8; legit -3|A party last heard of in 1907.|
t_english|English in Every Barrio|statehood|law public; spirit Thomasite Tradition: literacy .5, research .04|A new shipload of American teachers.|
t_petition|Petition to Congress|t_federal|rel USA 20; infl 30; auto -15|A million signatures cross the Pacific.|
t_dollar|Dollar Economy|t_federal|trade USA; money 12; spirit Peso at Two to One: invest .25, tradecap .08|Tied to the strongest currency on earth.|
t_citizens|American Nationals|t_petition,t_english|rel USA 15; popgrow 1; stab 3|Free movement to Hawaii and California.|
t_bases|Bases Without End|t_petition|fn usGarrison; fort Manila; rel USA 15|The fleet stays as long as it likes.|
t_capital|Open the Door to Capital|t_dollar|ig ind 8; build ironm 1, steel 1; spirit American Capital: invest .3, pp -.05|Mines, utilities and plantations.|
t_guard|The Philippine Division|t_bases,t_citizens|units inf 4; equip arms 300, artillery 60|Regulars paid on the American scale.|
t_territory|Incorporated Territory|t_citizens,t_capital|auto -20; legit 6; spirit Under the Constitution: stab 6, invest .1|The Constitution follows the flag after all.|
t_delegate|A Voice in Congress|t_territory|infl 60; rel USA 20; pp 60|Two resident commissioners become two senators-in-waiting.|
t_star|The Forty-Ninth Star|t_delegate,t_guard|jointo USA; stab 10; spirit State of the Union: output .06, def .05, legit 8|The largest state by population after New York.|
# Independence
road|The Ten-Year Road||infl 20; bop 5 ?? Campaign on the timetable => stab 3; rel USA 10; bop -5 // Campaign on impatience => ws 5; rel USA -5; bop 8|Independence is promised for the fourth of July, 1946.|ai 3
## the american connection
permanent|The Special Relationship|road|rel USA 40; trade USA; bop -15; spirit American Protection: def .05, invest .2|Leaving the safest harbour in the Pacific, slowly.|mx now; ai 4
i_mission|The Joint Preparatory Committee|permanent|rel USA 10; money 6; infl 20|Experts argue about sugar quotas until 1960.|
bases|Military Bases Agreement|permanent|fn usGarrison; fort Manila; rel USA 20|Ninety-nine years, twenty-three sites.|
parity|Parity Rights|i_mission|money 10; ig ind 5; spirit Parity for Americans: invest .2, legit -3|Americans may mine and build as citizens do.|
i_quota|The Sugar Quota|i_mission|trade USA; money 8; build plantation 2|Duty-free, up to a limit.|
i_fleet|The Asiatic Fleet|bases|equip ships 10; spirit Guests in the Harbour: navy .08|Cruisers, old destroyers and a great many submarines.|
alliance|Mutual Defence Treaty|parity,bases|fn joinUSA|An attack on one is an attack on both.|
i_lease|Lend-Lease for the Islands|alliance|equip arms 400, aircraft 100, artillery 80|The convoy is somewhere west of Hawaii.|req war
return|I Shall Return|i_lease|units inf 4; equip arms 400, aircraft 100|A promise made from Australia.|req war
exile|Government in Washington|return|spirit Government in Exile: caplimit .2|The Commonwealth continues on borrowed desks.|req war
i_leyte|The Landing in the Gulf|exile|units inf 6; stir 30; spirit Liberation Campaign [365]: atk .12|People of the Philippines: I have returned.|req war
## independence now
now|Independence Now|road|fn phIndep; bop 20|Better a government run like hell by Filipinos.|mx permanent; ai 0
neutral|Neutralisation Treaty|now|nap JAP; rel JAP 20; spirit armed_neutrality|The Switzerland of the Orient.|req sovereign
i_envoys|Envoys of Our Own|now|infl 40; rel ENG 10, FRA 10, CHI 10|Legations in six capitals.|req sovereign
malay|Malay Brotherhood|i_envoys|rel SIA 30; infl 30; claim Jesselton|An old sultan's lease on North Borneo.|
i_sabah|Press the Sabah Claim|malay|demand ENG take Jesselton|The rent was five thousand dollars a year, and it was rent.|req peace
i_trade|Trade with All Comers|neutral,i_envoys|trade JAP, CHI, ENG; spirit Entrepot Manila: tradecap .12, tax .04|Hemp, sugar and copra to whoever pays.|
voice|Voice of Small Nations|malay,neutral|infl 60; legit 6|A delegate who speaks for the colonised.|
i_asia|An Asian Relations Conference|voice|infl 60; rel CHI 15, SIA 15; mkfaction Association of Free Asia|Manila invites every free and not-yet-free people in Asia.|req sovereign
i_guarantee|Seek a Guarantee|voice,i_trade|rel USA 20, ENG 20; spirit Guaranteed Neutrality: def .05, infl .1|Four powers promise to respect the islands.|
## the republic
republic|The Third Republic|exile,alliance|i_guarantee,i_asia|fn phFree; stab 10; legit 10|The flag goes up alone.|date 1945-1
i_flag|The Sun and Stars Alone|republic|ws 6; legit 6; rename Republic of the Philippines/Filipino|The other flag comes down the same pole.|
i_veterans|Veterans' Rights|republic|ig army 8; rel USA 10; mp 60|Back pay for the men of the peninsula.|
i_rehab|War Damage Payments|republic|money 25; build construction 2|Manila was the second most ruined Allied capital.|
i_un|A Seat in the Assembly|i_flag|infl 60; legit 6|A Filipino presides within four years.|
i_baguio|The Baguio Conference|i_un|infl 50; rel SIA 15, RAJ 15|A Pacific pact without the great powers.|
i_seato|A Pacific Pact|i_baguio,i_veterans|jointo USA; rel AST 20|Manila gives a treaty its name.|
i_future|Pearl of the Orient|i_rehab,i_un|stab 8; spirit Young Republic: output .05, legit 6, infl .1|The first colony in Asia to become a republic.|
# Economy
sugar|Beyond Sugar||build plantation 2, textile 1|Free entry to the American market ends with independence.|ai 3
nepa|Buy Filipino|sugar|build textile 2, tools 1; spirit Economic Protectionism: invest .15|A national association for home industry.|
gold|Mountain Gold|sugar|money 8; build ironm 1; fn phIron|A gold rush in the pine forests.|
hemp|Manila Hemp|sugar|build ranch 2; trade USA, JAP|Every navy's ropes come from Davao.|
promise|Land of Promise|sugar|build farm 3, logging 2; mp 60|Settlers for the empty south.|
e_copra|The Coconut Republic|sugar|build plantation 2; money 5; spirit Copra Exports: tradecap .06|A third of the people live off one tree.|
state|State University|nepa|build university 1; res 20|Scholars of the nation.|
ndc|National Development Company|nepa,gold|build steel 1, power 1, construction 1|The state builds what capital will not.|
e_cebu|Cebu Portland Cement|ndc|build construction 1; infra 1|Roads need cement, and the company is ours.|
e_textile|National Textile Mills|nepa|build textile 3; ig union 4|Homespun becomes factory-spun.|
e_rice|National Rice and Corn Corporation|nepa,promise|build farm 2; spirit Stable Rice Price: needs -.04, rad -.04|The state buys high and sells low.|
dam|The First Great Dam|hemp,gold|tech p_hydro; build power 2|Light for the capital from a mountain lake.|
e_chrome|Chromite of Zambales|gold|dep Manila iron 1; trade USA; money 6|The largest refractory chrome deposit known.|
e_copper|Copper of the Cordillera|gold|build ironm 1; money 6; trade JAP|The buyer is whoever is re-arming.|
e_davao|The Davao Question|hemp|rel JAP -10; ig ind 4; money 6; spirit Leases Reviewed: tax .05|Twenty thousand Japanese settlers grow most of the hemp.|
e_koronadal|The Koronadal Settlements|promise|build farm 3; popgrow 2; vp Davao 2|A general leads homesteaders into the valley.|
e_logging|Mahogany|promise|build logging 2, furniture 1; trade USA|It is not mahogany, but it sells as such.|
e_fish|Fishing Fleets|e_copra|build ranch 2; spirit Inter-Island Fisheries: farm_out .06|The sea is the largest province.|
railroad|The Manila Railroad|ndc,dam|infra 3|North to the gulf, south to the volcano.|
e_ships|Inter-Island Shipping|e_copra,hemp|build port 2, shipyard 1; spirit Island Steamers: tradecap .06, supply .05|A country joined by water needs hulls.|
e_bank|A Central Bank|ndc,e_rice|money 12; tech s_bank; spirit Managed Peso: tax .08|The peso gets a policy of its own.|
e_roads|Roads to the Barrios|railroad,e_cebu|infra 3; ig rural 5|Farm to market, in the dry season at least.|
e_agri|College of Agriculture|state|tech p_fert; spirit Los Baños Seed: farm_out .1|A rice that yields twice the old one.|
e_science|National Research Council|state|res 25; proj 10; tech s_stat|The first census counts sixteen million.|
e_iron|Surigao Iron|e_chrome,e_copper|dep Davao iron 2; build ironm 2|A reserve of a billion tons, kept for the nation.|
e_steel|A Steel Mill of Our Own|e_iron,e_bank|build steel 2, tools 1|From imported scrap at first.|
e_power|Electrify Luzon|dam,railroad|build power 2; tech p_electrification|The Manila grid reaches the provinces.|
e_tourism|Summer Capital|e_roads|build urban 1; money 5; stab 2|The government moves to the mountains every April.|
e_plan|The Economic Council|e_steel,e_power,e_agri|law interventionism; spirit Planned Industrialisation: build .1, output .05|A ten-year plan for a ten-year transition.|
e_abaca|Break the Quotas|e_plan,e_ships|trade ENG, FRA; spirit New Markets: tradecap .1|Sugar for someone other than the Americans.|
# The Army
defence|National Defense Act||law limited; mp 80; spirit army_reform ?? A large reserve of citizen soldiers => mp 80; spirit Many Reservists: manpower .05 // A small professional core => units inf 2; spirit Few and Good: org .04|The Assembly's first law.|ai 3
adviser|The Military Adviser|defence|generals Vicente Lim/3/def, Basilio Valdes/2/log; spirit Field Marshal's Plan: org .06, train .1|A retired American general designs an army and a uniform.|
citizen|Citizen Army|defence|units inf 4; spirit Reserve Divisions: manpower .1|Forty thousand trainees a year.|
scouts|The Scouts|defence|units inf 2; equip arms 200; spirit Scout Regiments: atk .04|The best soldiers in the islands.|
constab|The Constabulary|defence|units mil 6; rad -.05; stab 3|Police in peace, light infantry in war.|
academy|Military Academy|adviser|fn xpAll; pp 20|Cadets in the mountain air.|
a_staff|The Aide from Abilene|adviser|generals Dwight Eisenhower/4/log; axp 20|The adviser's chief of staff does the actual planning.|req lord USA
a_camps|Training Camps in Every Province|citizen|mp 80; spirit Five and a Half Months: train .15, manpower .05|One hundred and twenty-eight camps.|
a_rotc|Cadets in the Colleges|citizen,academy|mp 40; spirit Reserve Officers: org .04|Wooden rifles on the campus lawn.|
a_enfield|Rifles from the Arsenal|scouts|equip arms 400; rel USA 5|Surplus from the last war, extractors and all.|
a_artillery|Field Artillery School|scouts,a_enfield|tech m_art1; equip artillery 100|Mountain guns with wooden wheels.|
a_cavalry|The Twenty-Sixth Cavalry|scouts|units cav 2; spirit Last Horse Soldiers: org .04|The last mounted charge of a modern army will be theirs.|
beaches|Beach Defence|citizen,scouts|fort Manila, Cebu|Stop them at the waterline.|mx a_orange
a_orange|War Plan Orange|citizen,scouts|fort Manila; spirit Withdraw to the Peninsula: caplimit .15, supply .1|Do not fight for the beaches; hold the bay.|mx beaches
peninsula|The Peninsula Fortress|beaches|a_orange|fort Manila; spirit Last Stand Plan: caplimit .2, def .06|Hold the bay until the fleet arrives.|
a_rock|The Rock|peninsula|tech m_fort; fort Manila; spirit Tunnel Headquarters: def .05, civdef .2|A fortress island with a railway inside it.|
a_tanks|Provisional Tank Group|a_artillery|tech m_tank1; units arm 1|National Guardsmen from the Midwest, with light tanks.|req lord USA
a_moro|Moro Battalions|constab|units inf 2; rel SIA 5; spirit Bolo Battalions: def .04|Short of rifles, never short of blades.|
a_visayan|The Visayan Force|a_camps,constab|units inf 3; fort Cebu|The central islands will fight on their own.|
a_mindanao|The Mindanao Force|a_visayan,a_moro|units inf 3; fort Davao; infra 1|An airfield in a pineapple plantation is the last way out.|
guerrillas|Guerrilla Resistance|a_rotc,a_mindanao|fn selfUnrest; spirit Island Guerrillas: def .05, supply .1|Every island has its colonel.|
a_coast|Coastwatchers|guerrillas|fn intelBoost; spirit Eyes on Every Strait: navy .04|A radio, a hilltop and a great deal of patience.|
a_subs|Supply by Submarine|guerrillas|equip arms 300; stir 20; tech m_radio|Carbines, medicine and matchbooks with a promise printed on them.|req war
a_ranks|Recognise the Guerrillas|a_coast,a_subs|units inf 5; mp 60; axp 30|A quarter of a million claim the back pay; perhaps half fought.|
a_engineers|Engineer Battalions|a_camps,a_artillery|infra 2; spirit Bridge Builders: supply .08|Every river in Luzon needs a bridge, or its demolition.|
a_med|The Medical Service|a_rotc|tech s_medicine; spirit Malaria Control: manpower .04, supply .04|Quinine decides more than bullets here.|
a_regular|Regular Divisions|peninsula,a_engineers|units inf 4; equip arms 300, artillery 60|Ten reserve divisions, one that is real.|
a_doctrine|Defence of an Archipelago|a_regular,a_med|tech m_doc1; spirit Fight for Every Island: def .06, entrench .1|No single defeat can end the war.|
a_modern|Armed Forces of the Philippines|a_doctrine,a_ranks|stab 5; spirit National Army at Last: atk .05, def .05, org .05|Army, constabulary, air and sea under one staff.|
# Sea and Air
mosquito|Mosquito Fleet||equip ships 5; spirit Torpedo Boats: navy .05|Fast boats for seven thousand islands.|ai 2
n_q|The Q-Boats|mosquito|equip ships 5; build shipyard 1|British hulls, then copies built in Manila.|
n_patrol|Offshore Patrol|mosquito|spirit Coast Patrol: navy .04, tradecap .03; mp 20|Customs cutters with one gun each.|
n_cavite|Cavite Navy Yard|n_q|build shipyard 1, port 1; fort Manila|A Spanish arsenal with American machine tools.|
n_mines|Mine the Channels|n_patrol|spirit Harbour Minefields: navy .06, def .03|Both entrances to the bay.|
n_marine|Naval Reserve|n_patrol,n_q|mp 30; equip ships 5; spirit Inter-Island Crews: navy .04|Every steamer captain is a reserve officer.|
n_convoy|Island Convoys|n_cavite,n_marine|spirit Night Coasters: supply .08, tradecap .04|Rice moves by night, close inshore.|
n_fleet|A Navy for the Republic|n_convoy,n_mines|equip ships 12; tech m_nav1; spirit Patrol Force: navy .08|Escorts handed over with a salute.|
aircorps|Army Air Corps|mosquito|build aircraftp 1; tech m_air1; equip aircraft 80|A handful of trainers and a great deal of hope.|
r_school|Flying School at the Lake|aircorps|spirit Zablan Cadets: air .08; equip aircraft 40|The first class solos in biplanes.|
r_fields|A Chain of Airfields|aircorps|infra 1; spirit Dispersal Strips: air .05, civdef .15|Grass strips from Luzon to Mindanao.|
r_pursuit|The Sixth Pursuit Squadron|r_school|equip aircraft 80; tech m_air2|Obsolete fighters, flown as if they were not.|
r_fortress|Bombers on the Plain|r_fields|equip aircraft 120; spirit Heavy Bombers at Clark: bombing .2, air .05|Enough, it is hoped, to deter.|req lord USA
r_warning|Air Warning Service|r_fields,r_pursuit|tech m_radar; spirit Watchers and One Radar Set: civdef .25|Reports arrive by telephone, runner and bicycle.|
r_airline|The Flag Carrier|r_school|money 5; infra 1; spirit Asia's First Airline: tradecap .04|Manila to Baguio in a single-engined monoplane.|
r_force|Philippine Air Force|r_warning,r_fortress,r_airline|equip aircraft 150; tech m_cas; spirit Wings of the Republic: air .1|A separate service with its own blue uniform.|
# The Islands
islands|Seven Thousand Islands||stab 3; infra 1|Three island groups, eighty languages, one government.|ai 2
m_moro|The Moro Question|islands|stab -2; pp 40; rel SIA 5|The south was never really conquered by anyone.|
m_datus|Honour the Datus|m_moro|ig land 5, devout 5; stab 4; spirit Sultans in the Assembly: legit 5|Titles are recognised; rifles stay in the cupboards.|mx m_integrate
m_integrate|One Law for All|m_moro|ig devout -6; stab -3; spirit No Special Provinces: tax .06, pp .05|The Bureau of Non-Christian Tribes is abolished.|mx m_datus
m_lanao|Roads into Lanao|m_datus|m_integrate|infra 2; build farm 2; fort Davao|A highway around the lake.|
m_schools|Schools in the South|m_lanao|spirit Madrasa and Public School: literacy .3, stab 3|Arabic in the morning, English in the afternoon.|
m_visayas|The Sugar Barons of Negros|islands|ig land 6 .2, ind 4; money 8|Thirty families and most of the export earnings.|
m_workers|The Sacadas|m_visayas|ig union 8, land -5; rad -.06; spirit Cane Cutters' Contract: output .04|Migrant labourers get a written wage.|
m_cebu|Queen City of the South|m_visayas|build port 1, urban 1; vp Cebu 3|The oldest city wants to be the second capital.|
m_igorot|The Mountain Province|islands|ig rural 4; build ironm 1; spirit Rice Terrace Peoples: manpower .03, def .03|Gold country, and a people never Hispanised.|
m_church|Church and State|islands|ig devout 6; stab 3|Religious instruction in public schools: the bill is vetoed, narrowly.|
m_aglipay|The Independent Church|m_church|ig devout -4, intel 5; legit 4|A national church born in the revolution still has a million members.|
m_chinese|The Chinese Merchants|m_cebu|ig pb 6; money 8; rel CHI 15|Retail trade and rice milling, in a few thousand hands.|mx m_retail
m_retail|Nationalise Retail Trade|m_cebu|ig pb -6, rural 5; rel CHI -15; spirit Filipino First: invest .1, tax .05|Market stalls for citizens only.|mx m_chinese
m_census|The First Census|m_schools,m_igorot|tech s_stat; pp 40; popgrow 1|Sixteen million, a third under fifteen.|
m_health|Fight the Three Diseases|m_census|tech s_medicine; spirit Rural Health Units: growth .3, manpower .03|Tuberculosis, malaria and beriberi.|
m_press|A Free and Noisy Press|m_aglipay,m_workers|law protected; ig intel 8; spirit Liveliest Press in Asia: legit 5, pp .05|Thirty dailies in a city of half a million.|
m_heroes|The Hero's Day|m_press|ws 5; stab 4; legit 5|The novelist shot at dawn is on every coin.|
m_one|One Nation of Islands|m_health,m_heroes,m_chinese|m_health,m_heroes,m_retail|stab 10; spirit Archipelago United: stab 5, tax .06, manpower .05|Christian, Muslim and highlander under one flag.|
# The Pacific Neighbourhood
pacific|The Pacific Neighbourhood||infl 20; pp 20|Tokyo is nearer than Honolulu.|ai 2
o_japan|The Japanese Question|pacific|rel JAP 10; trade JAP; money 5|Our second-largest customer, and the reason for the army.|
o_davao|Davao Land Leases|o_japan|rel JAP -10; ig rural 4; spirit Land Laws Enforced: tax .04, legit 3|'Davaokuo', the newspapers call it.|mx o_accom
o_accom|Accommodate the Settlers|o_japan|rel JAP 20; money 8; ig ind 4|Their hemp pays a great many salaries.|mx o_davao
o_china|The Chinese Community|pacific|rel CHI 15; money 6; ig pb 4|Relief funds for the war at home are raised in Binondo.|
o_refugees|Open Doors|pacific|popgrow 1; ig intel 5; rel USA 10; spirit Refugee Physicians: research .03, growth .1|Twelve hundred refugees from Europe are given visas no one else would issue.|
o_mindanao|A Refuge in Mindanao|o_refugees|build farm 1; popgrow 1; infl 30|Ten thousand more could farm in the south, the President offers.|
o_dutch|The Indies Next Door|pacific|rel HOL 15; trade HOL; infl 10|Oil from Borneo, a day's sail away.|
o_british|Hong Kong and Singapore|o_dutch|rel ENG 15; trade ENG|The clipper stops at all three.|
o_clipper|The China Clipper|o_british|infra 1; rel USA 10; spirit Six Days to San Francisco: tradecap .06, research .02|A flying boat lands on the bay with the mail.|
o_siam|The Other Free Nation|pacific|rel SIA 20; infl 20|The only neighbour with a flag of its own.|
o_australia|The Southern Dominion|o_british|rel AST 20; trade AST|If the islands fall, they are next, and they know it.|
o_abda|A Joint Defence Conference|o_australia,o_dutch|rel ENG 10, HOL 10, AST 10; axp 20; spirit Staff Talks at Manila: navy .03, def .03|Four flags, no common code book.|req tension 40
o_embargo|Join the Embargo|o_davao,o_abda|embargo JAP; rel USA 15; rel JAP -25|Iron ore and copper stop sailing north.|req tension 40
o_neutrality|Declare Neutral Waters|o_accom,o_siam|nap JAP; spirit Neutral Sea Lanes: tradecap .08, def -.02|A proclamation, and very few ships to enforce it.|mx o_embargo
o_indon|Friends of Free Indonesia|o_dutch,o_siam|infl 30; rel HOL -15; spirit Malay Solidarity: infl .1|Exiles from Java find a printing press in Manila.|req sovereign
o_korea|Witness for Korea|o_china|infl 20; rel JAP -5; claim Keijo|A Filipino delegate will one day chair the commission.|
o_charter|Sign the Declaration|o_abda|rel USA 20, ENG 15; infl 40; legit 5|The twenty-seventh signature, by a nation not yet independent.|req war
o_relief|Relief and Rehabilitation|o_charter|money 20; build construction 1; popgrow 1|Flour, cloth and bulldozers.|
o_claims|Reparations|o_relief|money 20; rel JAP -10; build shipyard 1|Paid in ships and machinery over twenty years.|req gone JAP
o_bridge|Bridge Between East and West|o_claims,o_indon|o_claims,o_korea|o_neutrality,o_korea,o_clipper|stab 5; spirit Crossroads of the Pacific: infl .2, tradecap .08|Asian by geography, Western by habit, itself by now.|
# Schools and Letters
schools|A Schoolhouse in Every Barrio||law public; spirit Barrio Schools: literacy .3|The one American institution everyone wanted.|ai 2
c_teachers|Normal Schools|schools|build university 1; res 10; ig intel 5|Teachers for two million pupils.|
c_double|Double-Session Classes|c_teachers|spirit Morning and Afternoon Shifts: literacy .3, research -.01|The same room teaches twice a day.|
c_adult|Adult Education Office|c_teachers|spirit Night Schools: literacy .3, output .02|Half the nation's adults cannot read a ballot.|
c_vocational|Farm Schools|c_double|tech p_fert; build farm 1; spirit School Gardens: farm_out .05|Every school grows its own lunch.|
c_trade|Schools of Arts and Trades|c_double,c_adult|build tools 1; spirit Trained Mechanics: output .04, mil_out .03|Lathes in the classroom.|
c_up|The State University Grows|schools|build university 1; res 20|A campus is planned on the plateau outside the capital.|
c_med|School of Hygiene|c_up|tech s_medicine; spirit Leprosy and Malaria Research: growth .2|A leper colony becomes a research station.|
c_eng|College of Engineering|c_up|res 15; build construction 1; spirit Filipino Engineers: build .06|Bridges designed at home.|
c_law|The Bar and the Bench|c_up|legit 5; ig intel 5; spirit Doctrine of Judicial Independence: legit 4, invest .08|A justice who writes in three languages.|
c_tagalog|Literature in Tagalog|schools|ig intel 5; ws 3; spirit Commonwealth Literary Awards: sway .1, legit 3|A prize for a novel about a strike.|
c_english|Writers in English|c_tagalog|infl 20; rel USA 5; ig intel 4|A poet from Negros is read in New York.|
c_spanish|The Last Hispanists|c_tagalog|ig land 4; infl 10; rel SPA 10|The constitution is still printed in Spanish first.|
c_radio|Radio in the Provinces|c_english|tech s_radio; spirit Sunrise Broadcast: sway .15, pp .03|Zarzuela and crop prices.|
c_film|Tagalog Talkies|c_radio|ws 4; money 4; spirit Studios by the River: sway .1|Fifty features a year.|
c_scouts|Boy Scouts of the Philippines|c_trade|mp 30; spirit Be Prepared: train .08, civdef .1|A national council of our own, chartered by the Assembly.|
c_physical|Bureau of Physical Education|c_scouts|ws 3; spirit Far Eastern Games: stab 2, org .02|A swimmer won bronze twice at the Olympics.|
c_museum|The National Museum|c_law,c_spanish|legit 4; infl 20; res 10|Gold death masks older than the cross.|
c_hist|Rewrite the Textbooks|c_museum|ws 5; legit 5; spirit History by Filipinos: sway .1, legit 4|The 'insurrection' becomes the 'war of independence'.|
c_science|Bureau of Science|c_med,c_eng|res 25; proj 10; spirit Institute at the Bay: research .06|Rice chemistry, typhoon warnings and fish.|
c_weather|The Typhoon Observatory|c_science|spirit Storm Warnings: farm_out .04, navy .03, tradecap .03|A Jesuit with a barometer has warned the China coast for sixty years.|
c_gi|A Generation in School|c_film,c_physical,c_hist|stab 6; spirit Most Literate Nation in the Region: research .05, output .04, legit 5|Half the population is in a classroom or just out of one.|
c_brain|The Pensionados Return|c_science,c_gi|res 20; build university 1; spirit Scholars from Abroad: research .05, build .04|Sent to American universities on the promise to come home.|
`);

// Manchukuo (1.5): hand-written tree. An emperor without power, an army that is not his, and thirty million subjects.
'use strict';
TREES.MAN = autoTree('mc_', `
# Court and Garrison
kangde|The Kangde Emperor||pp 50; legit 4|The last emperor of China is, for the second time, an emperor.|ai 5
audience|The Quarterly Audience|kangde|pp 30; bop -5 ?? Nod, and sign => rel JAP 10; bop 8; pp 30 // Ask one awkward question => bop -8; legit 4; rel JAP -5|The Kwantung commander calls on His Majesty, and tells him what he has decided.|ai 5
## the kingly way
loyal|Paradise of the Kingly Way|audience|rel JAP 30; bop 15; stab 4|Order, harmony and Japanese guidance.|mx restore,return,red; ai 6
k_concordia|The Concordia Association|loyal|law oneparty; pp 60; spirit Concord of Five Races: stab 4, sway .1|Not a party, the handbook insists: a way of life.|
k_secretary|The General Affairs Board|loyal|bop 10; spirit Vice-Ministers Rule: build .08, pp .06, legit -3|Every Manchu minister has a Japanese deputy who signs.|
k_extraterr|End of Extraterritoriality|k_secretary|rel JAP 10; legit 6; spirit One Law for Residents: tax .08|Japanese residents pay our taxes, on paper.|
k_visit|The Emperor Visits Tokyo|k_concordia|rel JAP 20; legit 6; stab 3|He returns with a sacred mirror and a new state religion.|
k_shrine|The National Foundation Shrine|k_visit|ig devout -6; rel JAP 15; spirit One Virtue One Heart: stab 3, legit -3|The sun goddess is declared the ancestor of the dynasty.|
k_reform|The Reform Bureaucrats|k_secretary|law command; build tools 2, steel 1; spirit Planned Paradise: build .1, mil_out .05|Young officials try out what Tokyo will not yet permit at home.|
k_youth|Concordia Youth Corps|k_concordia|mp 100; spirit Youth of the New State: manpower .06, train .1|Drill, callisthenics and five-coloured flags.|
k_labour|The Labour Service|k_youth,k_reform|mp 150; build construction 1; spirit National Labour Service: build .08, rad .04|Three years' duty with a shovel.|
k_police|The Special Police|k_concordia|law secret_police; fn intelBoost; rad -.1|Trained by the gendarmerie, loyal to it.|
k_neighbour|Neighbourhood Pledges|k_police|calm; spirit Collective Responsibility: rad -.06, stab 3|Ten families sign for each other's conduct.|
k_hamlets|Collective Hamlets|k_police,k_labour|stab -3; rad -.1; spirit Walled Villages: def .06, farm_out -.05|Scattered farms are burned and their people moved inside a wall.|
k_special|The Special Relationship|k_extraterr,k_visit|rel JAP 30; trade JAP; spirit Inseparable Friendship: invest .25, mil_out .05|One economy, one defence, two flags.|
k_war|Share the Holy War|k_special|sidewith JAP; ws 10; units inf 4|The Emperor issues a rescript; the army was already marching.|req japAtWar
k_grain|Grain Deliveries|k_war,k_hamlets|money 10; rad .05; spirit Quotas for the Front: mil_out .08, needs -.06|Soybeans, millet and sorghum, at fixed prices.|
k_coreg|The Co-Prosperity Model|k_special,k_reform|infl 40; rel JAP 15; spirit Showcase of the New Order: output .05, build .05|Visiting delegations are shown the steelworks and the train.|
k_equal|An Ally, Not a Dependency|k_coreg,k_war|auto 25; bop -10; legit 8|The embassy in Hsinking ceases to give orders in writing.|
k_treaty|Treaty of Alliance|k_equal|auto 20; nap JAP; legit 8; spirit Sovereign Ally: pp .08, legit 5|The 1932 protocol is replaced by something that looks like a treaty.|
k_final|The Model State|k_treaty,k_grain|stab 10; spirit Industrial Heart of the Sphere: mil_out .1, output .06, build .06|Whatever it was founded as, it works.|
## the dragon throne
restore|The Dragon Throne|audience|bop -25; legit 8; ig land 6, devout 6; rel JAP -10|He did not come north to be a clerk's seal.|mx loyal,return,red; ai 0
d_robes|The Dragon Robes|restore|legit 8; stab 3; rel JAP -5|Forbidden at the enthronement; worn at the ancestral rites.|
d_court|A Court of Loyalists|restore|pp 60; ig land 6 .2; generals Zhang Haipeng/3/cav|Pigtailed tutors and old Qing viceroys.|
d_guard|The Imperial Guard|d_court|units inf 2; fn intelBoost; bop -8; spirit Palace Guard Regiment: def .04, legit 3|Manchu bannermen, picked by the Emperor himself.|
d_brother|The Emperor's Brother|d_court|generals Pujie/3/politic; rel JAP 10; pp 30|Trained at the Japanese academy, married to a marquis's daughter, loyal to the family.|
d_premier|A Premier with a Spine|d_robes,d_court|pp 60; bop -10; ig intel 6|The old calligrapher is replaced by someone who reads what he signs.|
d_edict|Rule by Edict|d_premier|law autocracy; pp 80; legit 6; bop -10|An edict the General Affairs Board did not draft.|
d_princes|The Mongol Princes|d_guard|units cav 3; rel MON -10; spirit Banners of Xing'an: manpower .05, org .03|The dynasty's oldest allies ride in.|
d_officers|Win the Manchukuo Army|d_guard,d_brother|ig army 10 .3; bop -10; spirit The Emperor's Soldiers: org .05, legit 4|An oath to the throne, not to the adviser.|
d_confucius|The Kingly Way, Truly|d_edict|ig devout 8 .2; law religious; spirit Confucian Monarchy: stab 6, legit 6, research -.03|Sacrifices at the temple of Confucius, in person.|
d_ministers|Dismiss the Vice-Ministers|d_edict,d_officers|bop -20; rel JAP -25; auto 20; stab -5 ?? All at once, in one edict => stab -4; pp 60; bop -8 // One a month, with pensions => money -6; stab 3|The deputies who sign find their desks in the corridor.|
d_confront|Face Down the Kwantung Army|d_ministers|auto 25; rel JAP -20; ws 8|The commander is received standing.|
d_indep|An Empire in Fact|d_confront|free -20; legit 12; nap JAP|The protocol of 1932 is declared lapsed.|req bopl 20
d_recog|Recognition Without Tokyo|d_indep|infl 50; rel ENG 15, USA 10, SOV 10|If they will not recognise the state, they may recognise the dynasty.|
d_qing|The Great Qing Restored|d_indep,d_confucius|rename Great Qing Empire/Qing; claim Peiping, Tianjin, Kalgan, Jinan; legit 10; ws 10|The reign name is kept; the state's name is not.|
d_peiping|Return to the Forbidden City|d_qing|war CHI; spirit Banners Go South [540]: atk .1, manpower .08|He was driven out of it at eighteen.|req ex CHI
d_warlords|Summon the Warlords|d_qing|warlord; rel SHX 20, XSM 20|Some of them held Qing commissions once.|
d_five|Emperor of Five Races|d_peiping|core Peiping, Tianjin, Kalgan; capital Peiping; legit 12; stab 6|Han, Manchu, Mongol, Hui and Tibetan, as in the old formula.|req own Peiping
d_reforms|The Late Reforms, Completed|d_recog,d_confucius|law census; build university 1; spirit Constitutional Qing: legit 8, research .04|The constitution promised in 1908.|
d_final|The Mandate Regained|d_five,d_reforms|d_recog,d_reforms,d_warlords|stab 10; spirit Son of Heaven: legit 12, stab 6, pp .1|Three times enthroned. This time it holds.|
## the northeast returns
return|The Northeast Remembers|audience|bop -10; rel CHI 25; rel JAP -15; ig army 6|Most of the Manchukuo Army once wore the Young Marshal's badge.|mx loyal,restore,red; ai 0
n_fengtian|The Fengtian Old Guard|return|generals Ma Zhanshan/4/cav, Xi Qia/2/politic; pp 40|He defected to them, took their money and guns, and defected back.|
n_cells|Kuomintang Cells|return|fn intelBoost; rel CHI 15; rad .04|Party branches in the railway workshops.|
n_letters|Letters to Nanjing|n_cells|rel CHI 20; infl 20; money 6|Subsidies arrive through a bank in Tianjin.|
n_army|Subvert the Army|n_fengtian|ig army 10 .3; bop -10; spirit Two Loyalties: org -.03, manpower .05|Whole regiments are waiting for a signal.|
n_students|The Students' Oath|n_cells|ig intel 8; mp 60; ws 5|Never forget the eighteenth of September.|
n_volunteers|Righteous and Brave Armies|n_army,n_students|units mil 10; stir 20; spirit Volunteer Armies of the Northeast: manpower .08, def .04|The 1932 volunteers never entirely went home.|
n_mutiny|The Mutiny|n_army,n_letters|free -40; stab -10; ws 12; units inf 4|Advisers are arrested in their beds from Harbin to Chengde.|
n_emperor|The Emperor's Choice|n_mutiny|stab 4; legit 4; pp 60|He may abdicate, flee or broadcast for the cause.|
n_abdicate|A Third Abdication|n_emperor|setIdeo aut; leader Ma Zhanshan/Northeast Committee; legit -5; stab 5|Citizen Puyi takes a pension.|mx n_figure
n_figure|A Patriot on the Throne|n_emperor|legit 10; rel CHI 10; stab 3|He reads the declaration himself, surprisingly well.|mx n_abdicate
n_join|Rejoin the Republic|n_abdicate|n_figure|jointo CHI; rel CHI 50; sidewith CHI|The five-barred flag comes down; the white sun goes up.|
n_marshal|Free the Young Marshal|n_join|generals Zhang Xueliang/4/politic; rel CHI -10; ig army 8|Nanjing is asked for one prisoner in exchange for four provinces.|
n_auto|The Northeast Political Council|n_join|stab 6; spirit Autonomous Northeast: tax .08, legit 6|Loyal to the Republic, administered from Mukden.|
n_arsenal|Mukden Arsenal for China|n_join|equip arms 500, artillery 150; build arms 1|The largest arsenal in Asia outside Japan changes customers.|
n_korea|Arm the Korean Exiles|n_volunteers,n_join|units inf 2; claim Keijo, Heijo; rel JAP -10|Two million Koreans live north of the Yalu.|
n_liao|Clear the Peninsula|n_arsenal,n_marshal|claim Dairen; core Dairen; ws 8|The leased territory is the last piece.|
n_final|The Northeast Restored|n_auto,n_liao|stab 10; spirit Homecoming: legit 10, manpower .1, org .04|Fourteen years, by the count that starts in 1931.|
## red banners in the forest
red|Red Banners in the Forest|audience|ideo com 12; stab -6; rel SOV 20; bop -5|The United Army has eleven corps and no shoes.|mx loyal,restore,return; ai 0
x_army|The Anti-Japanese United Army|red|units mil 8; generals Yang Jingyu/4/winter; spirit Forest Camps: def .06, supply .05|Log cabins hidden in the snow.|
x_korean|The Korean Partisans|red|units inf 2; generals Kim Il-sung/3/mtn; claim Heijo|A young captain raids across the Yalu.|
x_peasants|Land to the Tenants|x_army|ig rural 10 .3, land -10 -.4; mp 100|Japanese colonists took the best fields.|
x_miners|Fushun Miners' Cells|x_army|ig union 10 .3; rad .06; fn intelBoost|The largest open-cast pit in the world can be stopped by forty men.|
x_border|Camps Across the Amur|x_korean|rel SOV 25; equip arms 300; xp|A brigade retrains in Soviet uniform.|
x_rising|The August Rising|x_peasants,x_miners,x_border|free -40; setIdeo com; stab -10; leader Zhou Baozhong/Northeast Committee|Railway junctions first.|
x_emperor|The Emperor in Custody|x_rising|legit 4; pp 60; rel SOV 10|Caught at an airfield with a suitcase of jewels.|
x_soviets|People's Committees|x_rising|law council; stab 5; ig rural 6|One in every county town.|
x_moscow|The Northern Alliance|x_emperor|fn joinComintern; trade SOV|The longest land border we have is friendly.|mx x_yanan
x_yanan|With the Chinese Party|x_emperor|jointo PRC; rel PRC 50; equip arms 300|The Northeast Bureau reports to Yan'an.|mx x_moscow
x_factories|Factories to the Workers|x_soviets|law command; build steel 1, arms 1; spirit Captured Industry: mil_out .1, output .04|The zaibatsu's managers left the keys.|
x_colonists|Send the Colonists Home|x_soviets|rel JAP -20; build farm 3; ig rural 6|Their fields return to those they were taken from.|
x_dairen|Take the Leased Territory|x_moscow|x_yanan|claim Dairen; core Dairen; war JAP|The peninsula is still theirs.|req ex JAP
x_school|The Northeast Military University|x_border,x_factories|tech m_doc1; xp; axp 30|Staffed by men who learned war in the forests.|
x_republic|The Northeast People's Republic|x_factories,x_colonists|rename Northeast People's Government/Northeastern; stab 8; legit 8|Neither puppet nor province.|
x_final|The Red Northeast|x_republic,x_school|stab 10; spirit Liberated Northeast: output .06, manpower .08, mil_out .06|The most industrial region in Asia after Japan itself, and it is ours.|
# The Five Races
harmony|Harmony of Five Races||stab 3; pp 30|Five colours on the flag, one of them much larger than the others.|ai 3
h_han|The Thirty Million|harmony|ig rural 5; popgrow 1; spirit Han Farmers: farm_out .06|Nine subjects in ten are Chinese.|
h_migrants|Seasonal Migrants from Shandong|h_han|mp 100; popgrow 3; build farm 2|Half a million arrive each spring.|
h_gentry|The County Gentry|h_han|ig land 6; stab 4; spirit Local Notables: tax .06|The same families run the counties as under the warlords.|
h_manchu|Bannermen's Pensions|harmony|ig land 4; legit 5; money -3|The dynasty's own people are a small, poor minority.|
h_mongol|The Xing'an Provinces|harmony|units cav 2; rel MON -10; spirit Mongol Self-Rule: manpower .04, stab 3|Four provinces where Chinese settlement is forbidden.|
h_lamas|Patron of the Lamas|h_mongol|ig devout 6; rel TIB 10; infl 20|A living Buddha is invited to Hsinking.|
h_korean|Koreans in Jiandao|harmony|build farm 2; mp 40; spirit Rice in the North: farm_out .06|They brought paddy rice to the frontier.|
h_gando|The Special Detachment|h_korean|units inf 1; calm; spirit Counter-Guerrilla Unit: def .04|Koreans recruited to hunt Koreans.|
h_colonists|The Million Households Plan|harmony|popgrow 2; rel JAP 15; ig rural -5; build farm 2|Japanese farmers are promised twenty hectares each.|mx h_limit
h_limit|Limit the Colonists|harmony|ig rural 8; rel JAP -10; stab 4|Our own peasants were on that land.|mx h_colonists
h_pioneers|Youth Pioneer Brigades|h_colonists|mp 60; units mil 4; fort Harbin|Armed farm boys settled along the Soviet border.|
h_russians|The White Russians|harmony|ig intel 4; money 4; rel SOV -5|Sixty thousand émigrés made Harbin a Russian city.|
h_asano|The Émigré Detachment|h_russians|units cav 1; fn intelBoost; rel SOV -10|Saboteurs for a war on the Amur.|
h_harbin|The Paris of the East|h_russians|build urban 1; vp Harbin 3; spirit Symphony and Railway Club: research .03, invest .1|Orchestras, department stores and a cathedral made of wood.|
h_refuge|A Haven in Harbin|h_harbin|money 10; ig ind 6; rel USA 10; popgrow 1|Refugee engineers and financiers are offered a settlement.|
h_hui|The Hui Communities|h_han|ig devout 4; stab 2; rel TUR 5|Mosques in every railway town.|
h_schools|New Learning Schools|h_gentry,h_manchu|law public; spirit Four Languages in School: literacy .4, research .03|Japanese is compulsory. So, officially, is Manchu.|
h_univ|Nation-Building University|h_schools|build university 1; res 25; spirit National Foundation University: research .05|Students of all five races share dormitories, and argue all night.|
h_film|The Film Association|h_harbin,h_schools|ws 4; infl 20; spirit Songs of the Orchid: sway .15|Its star is everywhere believed to be Chinese.|
h_medicine|The Plague Service|h_schools|tech s_medicine; spirit Plague Prevention: growth .25|Pneumonic plague killed sixty thousand in 1911.|
h_opium|The Opium Monopoly|h_gentry|money 15; stab -3; rad .04; spirit Monopoly Bureau: tax .12, growth -.2|A third of the budget, officially for 'gradual suppression'.|mx h_ban
h_ban|Ten-Year Suppression Plan|h_gentry|money -6; legit 6; spirit Clinics Not Dens: growth .15, stab 3|Registered addicts, tapering rations.|mx h_opium
h_capital|The New Capital|harmony|build urban 2, admin 1; vp Hsinking 4|Boulevards wider than Tokyo's, with flush toilets.|
h_census|The First Census|h_capital|tech s_stat; pp 40; spirit Counted Subjects: tax .06, manpower .04|Forty-three million, growing by a million a year.|
h_law|A Law Code of Our Own|h_capital,h_gentry|legit 6; spirit Codified Laws: stab 3, invest .1|Translated, but promulgated here.|
h_equal|Equal Rations|h_census,h_limit|ig rural 8; rad -.08; legit 6|Rice was for Japanese, sorghum for Chinese. No longer.|
h_nation|A Manchurian Nationality|h_law,h_univ,h_film|stab 8; spirit Something Like a Nation: legit 8, stab 4, manpower .05|Nobody planned for the subjects to start believing it.|
# Industry
fiveyear|The Five-Year Industrial Plan||build steel 2, coalm 2; spirit five_year_plan ?? Steel and coal first => build steel 1, coalm 1 // Machines and vehicles first => build tools 1, engines 1 // Farms and railways first => build farm 2; infra 2|Two and a half billion yen, on a blank slate.|ai 4
i_showa|The Showa Steelworks|fiveyear|build steel 3; dep Mukden iron 1|Low-grade ore, a new process, a million tons a year.|
i_fushun|The Fushun Colliery|fiveyear|build coalm 3; dep Mukden coal 1|A seam a hundred metres thick, mined from the sky.|
i_shale|Shale Oil at Fushun|i_fushun|build synth 2; tech p_synthetic|The oil shale lies on top of the coal; it has to be moved anyway.|
i_smr|The South Manchuria Railway|fiveyear|infra 3; build railway 2; money 8|A company that owns hotels, mines, a research institute and a country.|
i_express|The Asia Express|i_smr|infra 2; infl 20; spirit Streamliner: supply .06, tradecap .04|Air-conditioned, 130 kilometres an hour, light blue.|
i_research|The Railway Research Department|i_smr|res 25; fn intelBoost; spirit Two Thousand Researchers: research .06|The largest think tank in Asia, staffed partly by ex-Marxists.|
i_mangyo|Manchurian Heavy Industries|i_showa|build engines 2, autos 1; ig ind 6; bop 5|A whole zaibatsu is persuaded to move here.|
i_break|Break the Railway's Monopoly|i_mangyo,i_smr|ig ind 5; spirit One Industry One Company: output .05, invest .1|Heavy industry is taken from the railway and given to the newcomer.|
i_autos|Dowa Automobile|i_mangyo|build autos 2; tech m_mot|Trucks assembled from kits, then built.|
i_aircraft|Manchurian Aircraft|i_mangyo|build aircraftp 2; tech m_air1; equip aircraft 60|Fighters built in Mukden to a licensed design.|
i_arsenal|The Mukden Arsenal|i_showa|build arms 2, artyf 1; equip arms 300|Built by a warlord, inherited with its Danish machine tools.|
i_tanks|A Tank Workshop|i_arsenal,i_autos|build tankp 1; tech m_tank1|Light tanks for the border garrisons.|
i_dam|The Sungari Dam|fiveyear|build power 4; tech p_hydro|The largest dam in Asia, poured in winter.|
i_yalu|The Yalu Dam|i_dam|build power 3; rel JAP 10; build chem 1|Half the current goes to Korea.|
i_alu|Aluminium from Shale|i_dam,i_fushun|build aircraftp 1, chem 1; spirit Alumina Works: air .04, mil_out .03|There is no bauxite; chemists improvise.|
i_grid|A National Grid|i_dam,i_yalu|build power 2; tech p_electrification; spirit High-Tension Lines: output .04|Hsinking to Mukden to Dairen.|
i_soy|The Soybean Kingdom|fiveyear|build farm 3; trade GER, JAP; money 8|Half the world's export crop.|
i_oilmills|Bean Oil Mills|i_soy|build chem 1, farm 1; spirit Bean Cake and Bean Oil: tradecap .08, farm_out .05|The cake fertilises Japan; the oil lubricates Europe.|
i_monopoly|State Crop Monopolies|i_soy|money 10; ig rural -6; spirit Compulsory Purchase: tax .1, rad .04|The state is the only buyer.|mx i_market
i_market|Free Grain Markets|i_soy|ig rural 6, pb 5; spirit Exchange at Dairen: tradecap .08, farm_out .04|The futures board reopens.|mx i_monopoly
i_bank|The Central Bank of Manchou|fiveyear|tech s_bank; money 10; spirit Yuan at Par: tax .08, invest .15|Fifteen warlord currencies are redeemed for one.|
i_develop|The Industrial Bank|i_bank|money 12; build construction 1; spirit Long Credit: invest .2, build .05|Bonds sold in Osaka, spent in Anshan.|
i_forest|Timber of the Khingan|fiveyear|build logging 3, furniture 1|Larch for sleepers, pine for pit props.|
i_paper|Pulp and Paper|i_forest|build chem 1, logging 1; spirit Reed Pulp: output .03|Paper from the reeds of the Liao delta.|
i_gold|Gold on the Amur|i_forest|money 12; build ironm 1; rel SOV -5|Placer gold on a river that is also a frontier.|
i_north|Open the North|i_gold,i_smr|infra 3; build farm 2; popgrow 2; fort Harbin|New railways to the Soviet border, for settlers and for divisions.|
i_magnesite|Magnesite and Molybdenum|i_showa,i_fushun|trade GER, JAP; money 8; spirit Rare Ores of the South: tradecap .06|Furnace linings for half of Asia's steel.|
i_oil|Drill at Fuxin|i_shale,i_magnesite|dep Chengde oil 1; build oilr 1; res 10|Traces. The great field is elsewhere, under a marsh nobody has drilled.|
i_marsh|The Marsh Between the Rivers|i_oil,i_research|dep Qiqihar oil 3; build oilr 2; spirit The Great Field: res_out .15|A geologist ignores the textbook, and finds one of the largest fields in Asia.|req year 1941
i_second|The Second Five-Year Plan|i_break,i_grid,i_develop|build steel 2, tools 2, engines 1; spirit Planned Heavy Industry: build .08, mil_out .08|Double everything.|
i_auto2|Self-Sufficiency in the North|i_second,i_oilmills|law autarky; spirit Yen-Bloc Autarky: output .05, tradecap -.05, needs -.03|Nothing imported that can be made.|
i_final|The Ruhr of the East|i_second,i_marsh|i_second,i_north,i_tanks|spirit Arsenal of the Continent: mil_out .12, output .06|Built in ten years on the plan of a railway company's economists.|
# The Army
army|The Manchukuo Imperial Army||spirit army_reform; units inf 2 ?? Loyalty first: promote the Emperor's men => bop -8; ig army 5 // Skill first: promote the academy men => bop 5; xp|Ex-warlord troops with new cap badges and old habits.|ai 3
a_purge|Weed Out the Bandits|army|stab 3; rad -.05; spirit Smaller and Paid: org .05, upkeep -.08|Half the army is discharged; the other half is paid on time.|
a_advisers|Japanese Advisers|army|rel JAP 10; xp; bop 8; spirit Adviser System: org .04, legit -2|An officer in every battalion who does not take orders.|mx a_own
a_own|Officers of Our Own|army|bop -8; ig army 6; spirit Native Command: org .03, legit 3|Manchukuoans command; advisers advise.|mx a_advisers
a_academy|The Military Academy at Hsinking|a_advisers|a_own|tech m_doc1; axp 30; generals Xing Shilian/3/def|Four years, three languages. Some graduates will be famous, on other sides.|
a_central|Central Training School|a_purge|xp; spirit Mukden Training Depot: train .15, org .03|Warlord soldiers learn to march in step.|
a_conscript|The Military Service Law|a_purge,a_academy|law limited; mp 200|Three years at twenty; the first draft law the region has known.|
a_districts|Eleven Military Districts|a_central|fort Mukden, Harbin; spirit District Armies: def .05, supply .05|One per province, each with its own railway to guard.|
a_cavalry|Xing'an Cavalry|army|units cav 3; generals Urzhin Garmaev/3/cav; spirit Mongol Horse: org .04|Mongol troopers under a Buryat general.|
a_cavschool|The Cavalry School|a_cavalry|units cav 2; tech m_mot|Horses in winter, armoured cars in summer.|
a_guard|The Guard Regiment|army|units inf 1; fn intelBoost; legit 3|Guards the palace. Disarmed once already for brawling with the Kwantung Army.|
a_artillery|Artillery from the Arsenal|a_districts,a_conscript|tech m_art1; equip artillery 150|Mukden-pattern mountain guns.|
a_armour|An Armoured Car Company|a_cavschool,a_artillery|tech m_tank1; units mot 1|Wheeled, because the tracks went to someone else.|
a_river|The River Defence Fleet|army|equip ships 5; spirit Sungari Gunboats: navy .05, def .03|Shallow-draught gunboats on the Amur and Sungari.|
a_coast|The Coastal Flotilla|a_river|equip ships 5; build shipyard 1; build port 1|A destroyer on loan and a customs cutter.|
a_air|The Air Force|army|build aircraftp 1; tech m_air1; equip aircraft 60|Began as an airline with bomb racks.|
a_flying|The Flying School|a_air|equip aircraft 60; spirit Mukden Cadets: air .08|The first class mutinied. The second was vetted more carefully.|
a_airdef|Defend the Steelworks|a_flying|tech m_air2; spirit Interceptors over Anshan: civdef .3, air .05|The bombers come from Chengdu, at extreme range.|req war
a_forts|The Border Fortresses|a_districts|fort Hailar, Harbin, Qiqihar; tech m_fort|Seventeen fortified zones under the taiga.|
a_hutou|The Tiger's Head|a_forts|fort Harbin; spirit Underground Fortress: def .08, entrench .15|A railway gun points across the river at the Trans-Siberian.|
a_bandit|The Bandit Suppression Campaigns|a_central,a_cavalry|calm; axp 20; stab 4|A hundred thousand 'bandits' in 1932; a few thousand by 1940.|
a_incident|An Incident on the Frontier|a_forts,a_cavalry|clash SOV; tension 2|Two patrols claim the same island.|req ex SOV
a_steppe|The Steppe Border|a_incident|clash MON; axp 20|The line runs wherever the last herdsman said.|req ex MON
a_lessons|Lessons of the Steppe|a_steppe|tech m_doc2; spirit Respect for Armour: def .05, tank .05|Cavalry does not charge tanks twice.|
a_expand|Expand to Twenty Divisions|a_conscript,a_artillery|units inf 6; equip arms 400|From gendarmerie to army.|
a_women|The Nurses' Corps|a_expand|tech s_medicine; spirit Field Hospitals of the Army: org .03, manpower .03|Trained at the railway hospital.|
a_reserve|The Reserve Army|a_expand,a_bandit|mp 200; units mil 8; spirit Trained Reserves: manpower .08|Every discharged conscript keeps his uniform.|
a_kantokuen|Partner in the Special Manoeuvres|a_lessons,a_expand|rel JAP 15; units inf 3; equip artillery 100|Seven hundred thousand guests need hosts.|req lord JAP
a_loyal|Whose Army?|a_reserve,a_academy|pp 60; ig army 8; spirit An Army That Knows Its Mind: org .05, atk .03|In the end they will follow whoever they decided on years ago.|
a_modern|A Real Army|a_loyal,a_armour,a_airdef|a_loyal,a_armour,a_hutou|stab 5; spirit Imperial Army of the North: atk .05, def .05, org .05|Nobody intended it to be this good.|
# Foreign Affairs
recog|The Question of Recognition||infl 20|Recognised by Japan and El Salvador.|ai 2
r_league|The League's Verdict|recog|infl 10; legit -2; rel ENG -5|Forty-two to one. The one walked out.|
r_axis|Recognition from Berlin and Rome|recog|rel GER 25, ITA 25; trade GER; infl 30|Soybeans for machine tools.|ai 3
r_vatican|An Apostolic Delegate|recog|ig devout 4; infl 20; legit 4|Not recognition, the Vatican explains, merely a bishop.|
r_spain|The Nationalist Exchange|r_axis|rel SPA 15; infl 20|Two unrecognised governments recognise each other.|
r_anticom|Join the Anti-Comintern Pact|r_axis|rel GER 15, JAP 15; rel SOV -15; fn intelBoost|A signature of our own on a treaty.|
r_trade|The Trade Mission|r_axis|trade GER, ITA; money 10; spirit Barter Agreements: tradecap .08|A delegation tours Europe selling soybeans.|
r_cer|Buy the Chinese Eastern Railway|recog|infra 2; rel SOV 15; money -10|Moscow sells its last asset in the north for a third of the asking price.|
r_regauge|Regauge in a Night|r_cer|infra 2; spirit Standard Gauge Throughout: supply .1|Two hundred and forty kilometres of track are moved three inches in three hours.|
r_fisheries|The Amur Navigation Talks|r_cer|rel SOV 10; trade SOV; stab 2|Both banks agree on which channel is the border, for this year.|
r_borderpact|A Border Commission|r_fisheries|nap SOV; rel MON 10|Eighteen months of maps.|
r_mengjiang|Brother State in Inner Mongolia|recog|rel JAP 10; claim Kalgan, Hohhot; units cav 1|Another prince, another flag, the same advisers.|
r_northchina|The North China Buffer|r_mengjiang|claim Peiping, Tianjin; rel CHI -20; infl 20|A demilitarised zone south of the Wall that is ours in all but name.|
r_customs|The Customs at the Wall|r_northchina|money 10; trade CHI; spirit Great Wall Customs: tax .06, tradecap .05|Silver goes north, cloth goes south; both pay.|
r_nanjing|Recognise the Nanjing Regime|r_northchina,r_anticom|rel JAP 10; infl 30; nap CHI|The two client governments exchange ambassadors.|req warwith JAP, CHI
r_thai|Recognition from Bangkok|r_trade|rel SIA 25; trade SIA; infl 20|The first Asian state to recognise us unprompted.|
r_olympics|An Olympic Team|r_vatican,r_league|infl 30; legit 4; ws 3|The entry is refused; the athletes become famous at home.|
r_sphere|A Seat in the Sphere|r_nanjing,r_thai|jointo JAP; infl 40|Our premier stands second from the left in the photograph.|req lord JAP
r_conference|The Greater East Asia Declaration|r_sphere|legit 6; auto 10; spirit Signatory Nation: infl .15, legit 4|Mutual respect for sovereignty, it says. We keep a copy.|
r_neutral|Quiet Channels|r_borderpact,r_olympics|rel USA 10, ENG 10, SOV 10; infl 40; fn intelBoost|Consuls in Harbin talk to everybody.|
r_survive|A State That Outlives Its Maker|r_conference,r_neutral|stab 8; spirit Recognised by Habit: legit 10, infl .2, tradecap .06|Twenty-three governments, and counting.|
# The Secret State
secret|The Secret State||fn intelBoost; pp 20|Four police forces, and each watches the other three.|ai 2
z_gendarmes|The Gendarmerie|secret|law secret_police; rad -.08; bop 8|The Kwantung Army's own police, with powers over everyone.|
z_ours|A Police of Our Own|secret|law guard; bop -8; legit 4; spirit Capital Police Bureau: stab 3, legit 2|Manchukuoan constables who report to a Manchukuoan minister.|
z_harbin|The Harbin Station|z_gendarmes|fn intelBoost; rel SOV -10; spirit Special Service Agency: infl .1|Every émigré faction has a case officer.|
z_radio|Listening Posts on the Amur|z_harbin|tech m_radio; fn intelBoost; spirit Border Intercepts: def .03|Soviet traffic is read daily until the codes change.|
z_defector|The Commissar Who Crossed|z_radio|fn intelBoost; axp 20; rel SOV -10; spirit Order of Battle of the Far East: def .04, atk .03|A secret-police general walks over the border with the whole Far Eastern order of battle.|
z_fascists|The Russian Fascist Party|z_harbin|units cav 1; rel SOV -10; ig intel -3|Black shirts in a wooden city.|mx z_ban
z_ban|Ban the Émigré Parties|z_harbin|rel SOV 10; stab 3|Too many informers, too little information.|mx z_fascists
z_bandits|Bandit Registers|z_ours|calm; rad -.06; spirit Surrender Bureaus: stab 3|A pardon and a plot of land for every rifle handed in.|
z_passports|Residence Certificates|z_ours|tech s_stat; spirit Fingerprint Registers: tax .05, rad -.04|Every worker carries a card with ten prints.|
z_labour|Labour Recruiters|z_passports|mp 100; build construction 1; rad .05; spirit Contract Labour from the South: build .06|A million men a year are brought north of the Wall.|
z_mines|Mine Police|z_labour|build coalm 1; rad .04; stab -2|Barracks with barbed wire, and a pit of bones on the hillside.|mx z_welfare
z_welfare|A Labour Welfare Code|z_labour|ig union 6; rad -.08; legit 4; spirit Wages Paid in Full: output .04|Inspectors who are not on the company's payroll.|mx z_mines
z_press|The News Agency|secret|infl 20; spirit Manchukuo News Agency: sway .15|One wire service, five languages.|
z_radio2|Hsinking Central Radio|z_press|tech s_radio; spirit Hundred Kilowatts: sway .1, infl .05|The most powerful transmitter in Asia.|
z_censor|The Thought Section|z_press,z_gendarmes|law censorship; ig intel -8; rad -.06|Reading societies are raided.|mx z_thaw
z_thaw|A Literary Thaw|z_press,z_ours|ig intel 8; legit 4; spirit Northern Writers: research .03, legit 3|Novels about the soil get past the censor.|mx z_censor
z_units|Close the Hidden Compound|z_ours,z_welfare|legit 8; rel JAP -15; rel USA 10; stab 3|A 'water purification unit' outside Harbin is inspected, and shut.|
z_loyal|Vet the Officials|z_bandits,z_passports|pp 40; rmspirit corruption; spirit Examined Bureaucracy: tax .06, pp .04|Twelve thousand officials, each with a file.|
z_courts|Courts of Our Own|z_loyal,z_thaw|legit 6; spirit Manchukuoan Judges: legit 4, invest .08|Judges trained in Hsinking, not Tokyo.|
z_balance|The Watchers Watched|z_courts,z_defector|z_loyal,z_censor,z_defector|stab 6; spirit Balanced Police Powers: stab 4, pp .06, infl .1|In the end information is the only thing the state makes that everyone wants.|
# The Land
land|The Black Earth||build farm 2; popgrow 1|The best farmland in East Asia, settled for barely two generations.|ai 3
g_sorghum|Sorghum and Millet|land|build farm 2; spirit Kaoliang Fields: farm_out .06|Tall enough in August to hide an army, which is why it is banned near railways.|
g_rice|Rice in the North|land|build farm 2; tech p_fert; spirit Cold-Resistant Rice: farm_out .08|Korean farmers grow paddy at the latitude of Milan.|
g_stations|Experiment Stations|g_rice,g_sorghum|res 15; spirit Kungchuling Station: farm_out .08, research .02|A soybean with twenty per cent oil.|
g_tractors|Tractor Stations|g_stations|tech p_tractors; build farm 2|The plain is flat for five hundred kilometres.|
g_coops|Agricultural Development Cooperatives|g_sorghum|ig rural 5; spirit Village Credit: farm_out .05, tax .04|Seed loans at less than the pawnbroker's rate.|
g_landlords|The Great Estates|land|ig land 8; money 6|Warlords' relatives own counties.|mx g_reform
g_reform|Rent Ceilings|land|ig rural 8, land -6; rad -.08; spirit Thirty-Seven Per Cent: farm_out .05, stab 3|The tenants of the north never had a rent law before.|mx g_landlords
g_survey|The Cadastral Survey|g_landlords|g_reform|tech s_stat; spirit Every Field on a Map: tax .1|Unregistered land turns out to be a third of the country.|
g_sheep|Sheep for the West|land|build ranch 2; trade JAP|Merinos on the Mongol border.|
g_horses|The Horse Administration|g_sheep|units cav 1; spirit Remount Studs: supply .05, org .02|An army that still moves on hooves needs a ministry for them.|
g_forest|The Forest Railways|land|build logging 2; infra 1|Narrow-gauge spurs into the Changbai mountains.|
g_ginseng|Ginseng and Furs|g_forest|money 6; trade CHI; spirit Mountain Goods: tradecap .04|A root worth its weight in silver.|
g_liao|Tame the Liao River|land|infra 2; build farm 1; popgrow 1; spirit Dikes on the Liao: farm_out .05|It flooded Yingkou in three of the last ten years.|
g_canal|The Sungari–Liao Canal|g_liao|infra 2; build port 1; spirit Barges to the Sea: tradecap .06|Surveyed by the Russians in 1900 and by everyone since.|
g_harbour|The Port of Hulutao|g_liao|build port 2, shipyard 1; vp Chengde 2|An ice-free harbour that is not in the leased territory.|
g_fish|Fisheries of the Great Lake|g_ginseng|build ranch 1; spirit Khanka Fisheries: farm_out .03|A lake shared, uneasily, with the neighbour.|
g_north|Reclaim the Northern Wilderness|g_tractors,g_survey|build farm 3; popgrow 3; spirit Great Northern Granary: farm_out .1|Marsh and black soil the size of a small country.|
g_grain|The Grain Reserve|g_coops,g_survey|spirit State Granaries: needs -.04, supply .06, stab 2|Elevators at every junction.|
g_famine|Relief for Shandong|g_grain|rel CHI 15; popgrow 2; legit 4|Refugees from the Yellow River floods are fed, and stay.|
g_sugar|Beet Sugar|g_stations|build farm 1, chem 1; spirit Sugar Mills of the North: output .02|Mills built by Poles before the revolution run again.|
g_flax|Flax and Hemp|g_stations,g_sheep|build textile 2|Linen for uniforms, since cotton will not ripen.|
g_tobacco|Leaf Tobacco|g_coops|money 6; build plantation 1; spirit Tobacco Monopoly: tax .05|Every soldier's ration starts here.|
g_full|The Granary of Asia|g_north,g_canal,g_flax|stab 6; spirit Surplus Every Year: farm_out .1, tradecap .06, growth .15|It feeds itself, its garrison and two neighbours.|
`);

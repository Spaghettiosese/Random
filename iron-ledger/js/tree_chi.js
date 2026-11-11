// China (1.5): hand-written tree. Four political roads, the warlords one by one, and the War of Resistance.
'use strict';
TREES.CHI = autoTree('c_', `
# Politics
tutelage|Political Tutelage||pp 50; stab 3|The party governs until the people are ready, says the party.|ai 5
xian|The Xi'an Incident|tutelage|stab -5; pp 60; rel PRC 15|The Generalissimo is arrested in his nightshirt by his own deputy.|ai 5
## the generalissimo
chiang|The Generalissimo Returns|xian|pp 80; legit 8; stab 8; bop -15|He flies home on Christmas Day to firecrackers.|mx democracy,wang,left; ai 6
g_whampoa|Whampoa Loyalists|chiang|ig army 6; generals Hu Zongnan/3/def, Tang Enbo/3/off|The Generalissimo's students command his best divisions.|
g_newlife|New Life Movement|chiang|rmspirit corruption; spirit new_life_movement|Button your collar; do not spit.|
g_machine|The Party Machine|chiang|pp 60; spirit Organisation Clique: pp .1, tax .05|Two brothers control every appointment.|
g_young|Confine the Young Marshal|chiang|stab 4; ig army 4; bop -8|House arrest, for the next half-century.|
g_blue|The Blue Shirts|g_whampoa|law secret_police; fn intelBoost; ideo fas 4|A secret society inside the party.|
g_bureau|The Investigation Bureau|g_blue,g_machine|fn intelBoost; rad -.08; spirit Spymaster's Web: stab 3, pp .05|The most feared man in China carries no title.|
g_profit|Punish the Profiteers|g_newlife|stab -3; spirit Clean Government: tax .1|A few examples are made.|
g_family|The Four Families|g_machine|money 15; ig ind 8 .2; spirit Family Finance: invest .2, tax -.04|Finance ministers come from one dinner table.|mx g_profit
g_youth|Three Principles Youth Corps|g_blue,g_young|mp 300; spirit Youth Corps of the Party: manpower .06, sway .1|A new party inside the old one.|
united|The United Front|g_young,g_machine|nap PRC; ws 10; fn unitedFront|Chinese do not fight Chinese.|mx bandit; ai 6
bandit|Final Encirclement|g_whampoa,g_machine|war PRC|A disease of the heart must be cured first.|mx united; req prcPeace; ai 0
g_destiny|China's Destiny|g_bureau,g_youth|legit 8; ideo aut 8; spirit The Leader's Book: stab 5, sway .15|Required reading, ghost-written.|
g_supreme|Supreme National Defence Council|united|bandit|pp 80; bop -12; spirit Wartime Powers: pp .12, mil_out .05|Party, government and army in one chair.|
leader|Leader of All China|g_supreme,g_profit|g_supreme,g_family|legit 10; stab 6; bop -15; rmspirit warlord_era; spirit fragile_unity|The warlords bow, for the moment.|ai 5
g_title|Director-General of the Party|leader|pp 100; legit 6|A title created so that no one else may hold the founder's.|
g_soong|The American Lobby|leader|rel USA 30; money 10; infl 40|A brother-in-law in Washington, a wife before Congress.|
g_baojia|The Household Registers|g_destiny|spirit Mutual Guarantee: manpower .08, rad -.06, tax .04|Ten households answer for each other.|
g_reform|The Party Reform Committee|g_title,g_baojia|rmspirit corruption; rmspirit inept_officers; stab 5|Too late is better than never.|
g_const|A Constitution on His Terms|g_title,g_soong|law presidential; legit 12; rel USA 15|A president with emergency powers, elected by a hand-picked assembly.|
g_china|One Country, One Leader|g_reform,g_const|stab 10; spirit Undisputed Authority: pp .1, org .04, caplimit .1|No rival is left standing.|
## constitutional government
democracy|Constitutional Government|xian|ideo dem 12; bop 5; stab -3|The third stage of the founder's plan, ahead of schedule.|mx chiang,wang,left; ai 0
d_release|Release the Seven Gentlemen|democracy|ig intel 10 .2; legit 5; rad -.05|Lawyers and editors jailed for demanding resistance.|
d_league|The Democratic League|democracy|setIdeo dem; stab -4; pp 60|Professors and small parties find a voice.|
d_press|Free the Press|d_release|law protected; ig intel 6; spirit Hundred Newspapers: research .03, legit 4|Shanghai's papers print what they please.|
d_assembly|National Assembly|d_league|law universal; legit 10|Four hundred million electors.|
d_council|People's Political Council|d_league,d_release|pp 60; stab 4; rel PRC 10|Every party gets a seat, including the awkward ones.|
d_tiller|Land to the Tiller|d_assembly|spirit land_reform; ig land -8 -.3, rural 8; rmspirit corruption|The founder's third principle.|
d_federal|A Federal China|d_assembly,d_council|fn federalChina; bop 20; spirit Federal Compact: stab 6, manpower .08|United provinces rather than a unitary state.|
d_courts|Independent Courts|d_press,d_council|rmspirit corruption; legit 6; spirit Rule of Law: invest .15, stab 3|A judge acquits a man the police wanted hanged.|
d_village|Village Elections|d_tiller|ig rural 8 .2; rad -.1; spirit County Self-Government: tax .06, stab 3|The county magistrate now has to ask.|
d_army|An Army of the Nation|d_federal|ig army -5; rmspirit inept_officers; spirit National Not Party Army: org .05, legit 5|Commissars of the party leave the barracks.|
d_coalition|Coalition with Yan'an|d_council|nap PRC; rel PRC 40; fn unitedFront; rel SOV 20|Two seats in cabinet for the Communists.|mx d_ban
d_ban|Outlaw the Armed Parties|d_council|rel PRC -30; stab 3; ig army 5|Ballots, not private armies.|mx d_coalition
d_labour|Labour Code|d_village,d_courts|law regulated; ig union 8; rad -.06|An eight-hour day on paper is a start.|
d_schools|Mass Education Movement|d_village|law public; spirit Thousand Character Lessons: literacy .5, research .04|A reading primer for every village.|
d_women|New Civil Code|d_courts|legit 5; ig intel 5; popgrow 1|Daughters inherit; concubinage is abolished.|
democracies|Ally of the Democracies|d_army,d_labour|rel USA 40, ENG 30; trade USA|A republic among republics.|
d_arsenal|Arsenal of Asian Democracy|democracies|equip arms 400, aircraft 100; money 15|Credits from Washington arrive by the shipload.|
d_un|A Founding Signatory|democracies,d_women|infl 80; legit 8; fn joinAllies|The first delegation to sign the charter.|req tension 30
d_republic|The Republic Fulfilled|d_un,d_schools|stab 10; spirit Three Principles Achieved: output .05, research .05, legit 10|Nationalism, democracy and the people's livelihood.|
## the peace faction
wang|The Peace Faction|xian|ideo fas 8; rel JAP 30; stab -4|A war with Japan cannot be won; why fight it?|mx chiang,democracy,left; ai 0
w_low|The Low-Key Club|wang|pp 60; ig intel 5; rel JAP 15|Defeatism over tea and good manners.|
w_telegram|The Peace Telegram|w_low|stab -8; rel JAP 30; legit -5|From Hanoi he calls for negotiations.|
w_gov|A Government of Peace|w_telegram|setIdeo fas; stab -6; leader Wang Jingwei/Reorganised Kuomintang|Peace, anti-communism, national reconstruction.|
w_orthodox|The Orthodox Kuomintang|w_gov|legit 10; pp 60; spirit Founder's True Heir: legit 5, sway .1|Same flag, with a small yellow pennant.|
w_peace|Peace with Japan|w_gov|fn peaceWithJapan; trade JAP|An armistice on the enemy's terms.|
w_anticom|Exterminate the Reds|w_gov|war PRC|The one point on which Tokyo and Nanjing agree.|req prcPeace
w_army|The Peace Army|w_peace|units inf 6, mil 10; equip arms 400|Surrendered divisions change their cap badges.|
w_rural|Rural Pacification|w_peace,w_anticom|rad -.1; spirit Model Peace Zones: tax .08, stab 4|Bamboo palisades around whole counties.|
w_bank|The Central Reserve Bank|w_orthodox|money 20; spirit New Banknotes: tax .08, invest .1|Gunfights between rival bank clerks in Shanghai.|
w_panasia|Pan-Asianism|w_peace|fn joinSphere; rel MAN 30|The founder once gave a speech on it in Kobe.|
w_conc|Recover the Concessions|w_panasia|core Hong Kong; claim Hong Kong; legit 8; rel ENG -20|Tokyo hands over what belonged to London.|
w_equal|An Equal Partner|w_army,w_panasia|rel JAP 20; legit 6; spirit Treaty of Alliance: mil_out .06, pp .05|The advisers are renamed liaison officers.|
w_auto|Out of the Shadow|w_equal,w_bank|bop -15; stab 6; spirit Quiet Independence: tax .06, legit 6|Every month a few more decisions are made in Nanjing.|
w_reunify|Reunify Under Nanjing|w_auto,w_rural|fn integrateAll; core Mukden, Hsinking, Harbin; rel MAN -20; stab 8|If peace brings back the lost provinces, history may forgive.|
## the left kuomintang
left|The Left Kuomintang|xian|ideo com 10; rel PRC 20|The founder's widow speaks for the party he founded.|mx chiang,democracy,wang; ai 0
l_widow|Madame Sun's Appeal|left|legit 8; ig intel 6; pp 50|No one dares arrest her.|
l_threepol|Three Great Policies|left|rel SOV 40, PRC 40; ig union 6|Alliance with Russia, with the Communists, with workers and peasants.|
l_young|The Young Marshal's Programme|l_widow,l_threepol|ig army 6; generals Zhang Xueliang/3/politic; units inf 4|He kidnapped the leader for the nation's sake, and is rewarded.|
l_gov|A Revolutionary Committee|l_young|setIdeo com; stab -8; leader Soong Ching-ling/Revolutionary Committee|The party returns to 1926.|
l_unions|Labour and Peasant Unions|l_gov|ig union 10 .3, rural 8 .2; law protections|Wuhan's pickets march again.|
l_rent|Twenty-Five Per Cent|l_gov|ig rural 8, land -8 -.3; spirit land_reform|The rent reduction promised in 1926.|
l_soviet|The Soviet Pact|l_gov|nap SOV; trade SOV; equip aircraft 200, arms 300|Stalin prefers a friendly Nanjing to a red Yan'an.|
l_merge|Merge with Yan'an|l_unions,l_soviet|fn mergePRC|Two parties born of the same revolution.|
l_school|Revive the Whampoa Spirit|l_soviet|rmspirit inept_officers; spirit Political Commissars: org .06, sway .1|A political officer in every company, as at the founding.|
l_state|State Capital|l_rent,l_unions|law interventionism; build steel 2, tools 2; ig ind -6|Restrict private capital, develop state capital.|
l_comintern|A Seat in Moscow|l_merge,l_school|fn joinComintern|The Kuomintang was once an associate member.|
l_antiimp|Down with Imperialism|l_comintern|claim Hong Kong; core Hong Kong; rel ENG -25, FRA -15; ws 8|The concessions and the gunboats must go.|
l_newchina|New China|l_state,l_antiimp|stab 10; spirit Second Revolution: output .05, manpower .08, legit 8|The revolution, resumed after twenty years.|
# Unification
onechina|One China||infl 30; bop -5|Five flags still fly south of the Great Wall.|ai 3
## guangxi
guangxi|The Guangxi Question|onechina|fn cliqueGXC|Two generals who have rebelled three times already.|
u_planes|Buy Their Air Force|guangxi|equip aircraft 80; sub GXC -10|The Cantonese pilots fly north one morning.|
revolt|Face Down the Southern Revolt|guangxi|fn forceGXC|They march for 'resistance to Japan' in the wrong direction.|
u_libai|Li and Bai Take Commands|u_planes,revolt|generals Li Zongren/4/def, Bai Chongxi/5/trick; rel GXC 30|The 'Little Zhuge' joins the general staff.|
u_gxin|Guangxi Under the Centre|u_libai|absorb GXC; bop -8|The model province keeps its militia and loses its treasury.|
## yunnan
yunnan|The Yunnan Question|onechina|fn cliqueYUN|A mountain kingdom with its own currency.|
road|The Yunnan Road|yunnan|infra 2; spirit burma_road|A back door to the sea.|
u_tin|The Tin of Gejiu|yunnan|money 8; sub YUN -10; trade USA|The province's wealth goes through the central bank now.|
u_long|The Dragon Cloud's Bargain|road,u_tin|generals Lu Han/3/mtn; rel YUN 30|He keeps his title and his opium revenue.|
u_yunin|Yunnan Under the Centre|u_long|absorb YUN; bop -8|Central divisions arrive 'in transit' and stay.|
## shanxi
shanxi|The Shanxi Question|onechina|fn cliqueSHX|The Model Governor has ruled since 1911.|
model|The Model Province|shanxi|build coalm 2, steel 1|Narrow-gauge railways keep outsiders out.|
u_arsenal|The Taiyuan Arsenal|shanxi|equip arms 300, artillery 60; sub SHX -10|The best arsenal in the north supplies the centre.|
u_yan|Old Yan's Bargain|model,u_arsenal|generals Fu Zuoyi/4/def; rel SHX 30|He has outlasted every government since the empire.|
u_shxin|Shanxi Under the Centre|u_yan|absorb SHX; bop -8|The governor becomes a war-zone commander.|
## the ma lands
ma|The Ma Question|onechina|fn cliqueXSM|Three families of Muslim generals hold the north-west.|
muslims|Loyal Muslim Cavalry|ma|units cav 3|Horsemen who hate the Communists more than they distrust us.|
u_hajj|The Pilgrim Diplomats|ma|rel TUR 15, EGY 15; infl 30; sub XSM -10|Muslim envoys carry China's case to Cairo and Mecca.|
u_nwroad|The North-West Highway|muslims,u_hajj|infra 3; rel SOV 10|Soviet trucks roll through the corridor.|
u_main|The North-West Under the Centre|u_nwroad|absorb XSM; bop -8|The Ma generals take central commissions.|
## sichuan
sichuan|The Sichuan Question|onechina|fn cliqueSIC|Seventy million people and a dozen feuding commanders.|
ricebowl|Rice Bowl of the West|sichuan|build farm 3|The province that can feed a government in exile.|
u_garrison|Abolish the Garrison Areas|sichuan|sub SIC -15; money 6|Each general collected taxes decades in advance.|
u_sicin|Sichuan Under the Centre|ricebowl,u_garrison|absorb SIC; bop -8|The governor dies conveniently on his way to the front.|
## the whole
central|Central Army Everywhere|u_gxin,u_yunin,u_shxin|fn integrateAll; bop -20; stab 5|Every division takes its orders from the capital.|
west|The Western Marches|onechina|core Urumqi, Kashgar, Lhasa, Chamdo; fn playSIKTIB|The Republic of Five Races.|req peace
highway|The Qinghai Road|west|infra 2|A motor road to the roof of the world.|
u_sik|The Sinkiang Governor|west|demand SIK puppet; rel SOV -10|He flew a Soviet flag last year and may fly ours next.|
u_treaties|End the Unequal Treaties|central|rel USA 20, ENG 20; legit 10; spirit Sovereign Customs: tax .08, tradecap .05|Extraterritoriality ends after a century.|
northeast|Recover the Northeast|central|core Mukden, Hsinking, Harbin, Qiqihar, Hailar, Chengde, Dairen; ws 10|The eighteenth of September will be answered.|
u_mongol|The Mongolian Question|northeast|claim Ulan Bator; rel SOV -15; rel MON -30|Outer Mongolia was never signed away, the maps insist.|
taiwan|Retrocession|northeast|claim Taihoku; core Taihoku|Fifty years is long enough.|req war
u_hk|The Leased Territory|u_treaties|claim Hong Kong; core Hong Kong; demand ENG take Hong Kong|Ninety-nine years is too long.|req peace
u_five|The Republic of Five Races|taiwan,u_mongol,highway|stab 10; legit 10; spirit China Restored: tax .08, manpower .08|Every province on the old maps answers to one capital.|
# War of Resistance
prepare|Prepare for the Inevitable||ws 5; fort Nanjing, Shanghai|Buy time, build divisions, pray for another year.|ai 5
## before the storm
german|Sino-German Cooperation|prepare|equip arms 250, artillery 50; build arms 1; generals Alexander von Falkenhausen/4/def; units inf 4; rmspirit inept_officers|German advisers, German rifles, German helmets.|req peaceWithGER; ai 4
line|The Shanghai–Nanjing Line|german|fort Nanjing, Shanghai, Hangzhou|Pillboxes between the lake and the river.|
r_barter|Tungsten for Krupp|german|trade GER; equip artillery 100; build artyf 1|Ore for guns, no currency needed.|
r_coast|Yangtze Forts|line|fort Wuhan, Nanjing; equip ships 3|Booms and batteries below the capital.|
r_sovpact|Sino-Soviet Non-Aggression|prepare|nap SOV; rel SOV 25|Signed a month after the shooting starts.|
volunteers|Soviet Volunteer Group|r_sovpact|equip aircraft 200, arms 150; rel SOV 15|Stalin's falcons over the Yangtze.|req atwar JAP; ai 4
r_airraid|Air Raid Precautions|prepare|tech s_civildef; spirit Tunnel Shelters: civdef .3|Cliffs along the river are hollowed out.|
## the war
resist|War of Resistance|prepare|spirit war_of_resistance; ws 20; units mil 12; law requirement|The last critical moment has come.|req atwar JAP; ai 10
r_shanghai|Three Months at Shanghai|resist|axp 30; ws 5; spirit Lost Battalion: def .06, org .04|Eight hundred men in a warehouse, watched by the world.|req atwar JAP
space|Trade Space for Time|resist|spirit Space for Time: caplimit .15, supply .05|Give up the coast; keep the army.|
capital|The Wartime Capital|resist|fn moveCapital|Beyond the gorges, beyond their reach.|req atwar JAP; ai 6
river|Hold the Yellow River|resist|fort Zhengzhou, Xi'an|The last line before the north-west.|
r_dikes|Break the Dikes|river|fort Zhengzhou, Xuzhou; stab -5; rad .05; spirit Flooded Plain [540]: def .1|The river is turned loose on the enemy, and on the farmers.|req atwar JAP
r_wuhan|Defend Wuhan|r_shanghai,space|units inf 6; spirit Battle for the Middle Yangtze [300]: def .1|A million men for four months.|req atwar JAP
r_scorch|Scorched Earth|space|spirit Nothing Left Behind: supply .05, caplimit .05; stab -3|Factories on the move; what cannot move burns.|req atwar JAP
r_changsha|Three Battles of Changsha|r_wuhan|generals Xue Yue/5/trick; spirit Heavenly Furnace: def .08; axp 30|Let them in, then close the door.|req atwar JAP
r_winter|The Winter Offensive|r_wuhan,capital|spirit Eighty Divisions Attack [180]: atk .12|The only general offensive of the long middle years.|req atwar JAP
behind|Behind Enemy Lines|space|fn stirJapan|Every occupied county has a second government.|
r_zones|Guerrilla War Zones|behind|fn stirJapan; units mil 8; spirit Two Kinds of Front: supply .05|Whole armies left behind on purpose.|
burma|The Burma Road|capital|spirit burma_road; rel ENG 20, USA 20|A lifeline through the mountains.|
avg|American Volunteer Group|burma|equip aircraft 150; rel USA 30|Shark mouths on borrowed fighters.|req atwar JAP
r_exped|Expedition into Burma|burma|units inf 4; rel ENG 20; axp 20|The first Chinese army to fight abroad in centuries.|req engJapWar
hump|Over the Hump|avg|equip aircraft 150; spirit Air Bridge: supply .1|Transports over the Himalayas.|
r_vinegar|The American Chief of Staff|r_exped,hump|generals Joseph Stilwell/4/inf; equip arms 300; bop -5|He calls the Generalissimo 'the Peanut' in his diary.|
xforce|The Army in India|r_vinegar|units inf 4; spirit American-Trained Divisions: atk .05, org .05|Chinese soldiers, American rations and rifles.|
allies|Join the Allies|hump,burma|fn joinAllies|One of the Four Policemen.|req engJapWar; ai 6
r_bases|Bomber Bases at Chengdu|allies|build aircraftp 1; spirit Runways Built by Hand: bombing .25, air .05|Half a million labourers with baskets.|
r_ledo|The Ledo Road|xforce|infra 3; spirit Road Back to China: supply .1|A highway through the worst terrain on earth.|
counter|General Counter-Offensive|xforce,r_zones|spirit Counter-Offensive [540]: atk .12|After eight years, forward.|req atwar JAP
cairo|The Four Policemen|allies,xforce|infl 80; legit 8; core Taihoku|A seat beside the great powers.|
r_korea|The Provisional Koreans|cairo|infl 30; claim Keijo, Heijo; units inf 1|An exiled government in Chongqing has waited since 1919.|
r_victory|Victory and Return|counter,cairo|stab 10; ws 10; spirit Victor Nation: legit 10, pp .1|The capital returns down the river.|req japDone
r_occupy|A Share in the Occupation|r_victory|claim Fukuoka; infl 50; rel USA 10|A Chinese division is offered a prefecture.|
# Economy
reconstruction|National Reconstruction||build construction 1; infra 2|A decade of roads, schools and deficits.|ai 3
fabi|Currency Reform|reconstruction|money 8; spirit Legal Tender: tax .1|Silver is nationalised; paper becomes money.|
rural|Rural Reconstruction|reconstruction|build farm 4, textile 2; rad -.05|Model counties and mass education.|
nrc|National Resources Commission|reconstruction|build steel 2, coalm 2, tools 1|State industry planned by engineers.|
rail|The Canton–Hankow Line|reconstruction|infra 4|The last gap in the north-south railway is closed.|
arsenal|The Great Arsenal|reconstruction|build arms 2, artyf 1|Rifles of a German pattern.|
e_banks|The Four Government Banks|fabi|money 10; spirit Joint Treasury: invest .2|One board for four banks.|
e_salt|The Salt Administration|fabi|spirit Salt Gabelle: tax .08|The oldest tax in the world, collected honestly for once.|
e_silver|The Silver Agreement|e_banks|trade USA; money 12; rel USA 10|Washington buys the silver the new currency no longer needs.|
coops|Industrial Cooperatives|rural,fabi|build tools 2, textile 2; spirit Work Together: output .04|Small workshops that can be carried on a man's back.|
e_seed|Agricultural Research Bureau|rural|tech p_fert; build farm 2; spirit Improved Rice: farm_out .1|Better seed for the Yangtze valley.|
e_cotton|The Cotton Mills|rural|build textile 3; ig ind 4|Shanghai spins for the whole country.|
tungsten|Tungsten for Arms|nrc|trade GER, USA; money 6; spirit Strategic Ores: tradecap .06|Half the world's supply.|
e_steel|The Central Steelworks|nrc|build steel 2, ironm 1; dep Wuhan iron 1|A German-designed mill on the middle Yangtze.|
e_oil|The Jade Gate Wells|nrc|dep Lanzhou oil 2; build oilr 1|China's first oilfield, at the end of the Great Wall.|
e_power|Electrify the Lower Yangtze|nrc,rail|build power 3; tech p_electrification|A grid from Nanjing to Shanghai.|
e_roads|The Seven-Province Highways|rail|infra 3; build construction 1|Built to chase the Reds, useful for everything else.|
e_ports|The Port of the East|rail|build port 2, shipyard 1|A deep-water harbour that foreigners do not own.|
inland|Move Industry Inland|rail,arsenal|fn inlandBuild; spirit Inland Arsenals: civdef .4|Machines carried upriver by hand.|
e_arsenal21|The Arsenal in the Caves|arsenal,inland|build arms 2, artyf 1; equip arms 300|Lathes in limestone caverns above the river.|
e_chem|Yungli Chemicals|e_steel,e_power|build chem 2; tech p_petro|Nitrates for fertiliser and for shells.|
university|The Associated University|tungsten,coops|build university 2; res 25|Three universities walk a thousand miles and reopen.|
e_academia|Academia Sinica|university|res 30; proj 15; spirit Refugee Scholars: research .06|Oracle bones and cosmic rays, in a farmhouse.|
e_stable|Stabilisation Board|e_silver,e_salt|money 15; rel USA 10, ENG 10; spirit Propped Currency: tax .05|Foreign credits hold the exchange rate.|
e_grain|Land Tax in Kind|e_salt,e_seed|spirit Grain Not Paper: tax .1, rad .03, supply .05|The army is fed in rice, not banknotes.|req war
plan|Three-Year Plan|inland,tungsten|build steel 2, power 2, chem 1|Heavy industry in the far interior.|
e_rebuild|Post-War Reconstruction Plan|plan,e_stable|build construction 2, railway 3; money 20|A hundred thousand miles of railway, on paper.|req peace
e_dam|The Great Dam at the Gorges|e_rebuild,e_academia|tech p_hydro; build power 5; infra 2|An American engineer surveys the site.|
# Army
reorg|Reorganise the Army||spirit army_reform; pp 30|Sixty divisions to be made real instead of nominal.|ai 2
trained|German-Trained Divisions|reorg|units inf 6, hvy 2; tech m_art1|Eight divisions as good as any in Asia.|
academy|Central Military Academy|reorg|rmspirit inept_officers; generals Du Yuming/3/panzer|Promotion by examination.|
conscript|Conscription Law|reorg|law extensive; mp 500|Every household owes a son.|
corps|Peace Preservation Corps|reorg|units mil 12|Provincial troops by another name.|
airforce|Air Force Commission|reorg|build aircraftp 1; tech m_air1; equip aircraft 150|Bought with public subscriptions for the leader's birthday.|
m_tax|The Tax Police Regiments|trained|units inf 3; generals Sun Li-jen/5/brilliant|The finance minister's private army is the best equipped in China.|
mechanised|The Mechanised Division|academy,trained|tech m_tank1; units arm 1, mot 1|China's only armoured formation.|
m_staff|The Army Staff College|academy|tech m_doc1; xp; axp 30|Lectures translated from German.|
zones|War Zone System|conscript|spirit War Zones: supply .1, org .04|Each front lives off its own provinces.|
m_recruit|Fix the Press Gangs|conscript|rad -.06; spirit Fair Conscription: manpower .06, org .03|Roped-together recruits are a scandal even here.|
daretodie|Dare-to-Die Corps|corps|spirit Dare to Die: def .06, org .04|Big swords against tanks.|
m_bigsword|The Big Sword Units|corps|units inf 3; ws 5|A marching song is written about them.|
m_pilots|The Aviation School|airforce|tech m_air2; equip aircraft 100; spirit Hangzhou Cadets: air .08|American instructors, Italian aircraft, Chinese courage.|
m_flyboys|Overseas Chinese Pilots|m_pilots|equip aircraft 80; money 6|Volunteers from Portland and Penang.|
m_cacw|The Composite Wing|m_pilots,m_flyboys|tech m_cas; spirit Mixed Squadrons: air .06, cas .1|Chinese and American crews in the same aircraft.|req atwar JAP
m_navy|River Gunboats|airforce|equip ships 6; spirit Mine Barrages: navy .05|A navy that fights with mines.|
magnet|Magnetic Warfare|zones,daretodie|tech m_doc2; spirit Lure and Encircle: def .08|Draw them in, then close behind them.|
m_art|Howitzer Regiments|trained,m_staff|tech m_art2; equip artillery 200|Fifteen-centimetre guns, bought before the embargo.|
m_medical|The Red Cross Corps|m_recruit|tech s_medicine; spirit Medical Relief: manpower .04, org .03|An overseas surgeon organises what the army never had.|
m_alpha|Thirty-Nine Divisions|magnet,m_art|units inf 8; equip arms 500, artillery 150|Re-armed and re-trained on the American pattern.|req atwar JAP
m_armour|Tank Battalions|mechanised|tech m_tank2; units arm 1; equip tanks 80|Lend-lease mediums on the Burma front.|
m_youth|Youth Army|m_recruit,m_bigsword|mp 200; units inf 4; spirit Hundred Thousand Students: manpower .05, org .04|An inch of land, an inch of blood.|req war
m_modern|A Modern National Army|m_alpha,m_armour,m_medical|rmspirit clique_army; stab 5; spirit Standard Divisions: atk .06, def .06|One table of organisation for every division at last.|
# Diplomacy
foreign|The Waichiaopu||infl 30; pp 20|A foreign ministry with more treaties to undo than to sign.|ai 2
x_league|Appeal to the League|foreign|infl 30; rel ENG 10, FRA 10; tension 1|Sympathy, a commission and a report.|
x_brussels|The Nine-Power Conference|x_league|infl 30; rel USA 10; legit 3|Nineteen nations meet, deplore and adjourn.|req atwar JAP
x_boycott|Boycott Japanese Goods|foreign|embargo JAP; rel JAP -15; ig pb 5|Overseas Chinese stop buying, from Singapore to San Francisco.|
x_overseas|The Overseas Chinese|foreign|money 15; mp 60; spirit Remittances for the Nation: tax .08|A rubber king in Malaya funds whole divisions.|
x_bonds|Liberty Bonds|x_overseas|money 15; rel USA 5|Sold in Chinatowns around the Pacific.|
x_hu|The Scholar Ambassador|x_league|rel USA 25; infl 30|A philosopher explains China to Washington in its own idiom.|
x_loans|The Tung Oil Loan|x_hu|money 15; trade USA; equip arms 200|Credits secured on varnish.|
x_embargo|Ask for an Oil Embargo|x_loans|rel USA 15; rel JAP -10; tension 2; spirit Moral Embargo on Japan: infl .1|Every bomb on Chongqing was flown on Californian petrol.|req atwar JAP
x_british|The Sterling Credits|x_league|money 10; rel ENG 20; trade ENG|London props the currency to protect its own investments.|
x_hkroute|The Hong Kong Lifeline|x_british|spirit Arms Through the Colony: supply .06, tradecap .06; rel ENG 10|Half of all imports come in through the free port.|
x_french|The Haiphong Railway|x_british|rel FRA 20; infra 1; spirit Yunnan Railway Traffic: supply .05|A metre-gauge line through the gorges.|
x_soviet|The Soviet Credits|foreign|rel SOV 25; equip aircraft 150, artillery 100; trade SOV|Guns for tea and tungsten, with no questions about ideology.|
x_sinkiang|The Turkestan Route|x_soviet|infra 2; rel SIK 15; spirit Three Thousand Kilometres by Truck: supply .06|Camels carry the petrol for the lorries.|
x_german|Keep the German Door Open|foreign|rel GER 20; trade GER|Berlin's businessmen prefer us; Berlin's diplomats prefer Tokyo.|req peaceWithGER
x_recall|The Advisers Are Recalled|x_german|rel GER -20; rel USA 10; generals Wei Lihuang/4/off|They leave by train, some of them in tears.|req atwar JAP
x_india|The Visit to India|x_british|rel RAJ 25; infl 30; rel ENG -5|The Generalissimo calls on a man in a loincloth.|
x_korea|Recognise Free Korea|x_boycott|claim Keijo; infl 20; rel JAP -10|The provisional government has lived in our cities since 1919.|
x_asia|Spokesman of Asia|x_india,x_korea|infl 60; spirit Voice of the Colonised: infl .15, legit 4|The only Asian power at the top table speaks for the rest.|
x_treaty|The New Equal Treaties|x_embargo,x_hkroute|rel USA 20, ENG 20; legit 10; rmspirit nanjing_decade; spirit Equal Among Nations: tax .06, infl .1|Signed in Washington and Chongqing on the same day.|
x_big|One of the Big Four|x_treaty,x_asia|infl 80; legit 8; stab 5|A permanent seat, and a veto.|
# Culture and Society
culture|The New Culture||ig intel 6; res 10|Twenty years after the May Fourth students marched.|ai 2
k_vernacular|The National Language|culture|spirit Mandarin in Every School: literacy .4, sway .1|One pronunciation for four hundred million.|
k_simplify|Simplified Characters|k_vernacular|spirit Three Hundred Simpler Characters: literacy .3; ig intel -3|Announced, attacked by a scholar on his knees, withdrawn. Try again.|
k_mass|The Mass Education Movement|k_vernacular|law public; build university 1; spirit Ding County Experiment: literacy .4, farm_out .04|A Yale graduate teaches a county to read.|
k_health|County Health Stations|k_mass|tech s_medicine; spirit Village Health Workers: growth .3, manpower .03|A trained farmer with a box of nine medicines.|
k_women|The Women's Advisory Council|culture|ig intel 5; mp 50; spirit War Orphanages: stab 3, manpower .03|Thirty thousand 'warphans' are gathered up.|
k_film|Shanghai Cinema|culture|ws 4; infl 20; spirit Songs from the Films: sway .1, ws 3|A film song about volunteers is on every tongue.|
k_anthem|March of the Volunteers|k_film|ws 8; stab 3|Arise, ye who refuse to be slaves.|
k_press|The Great Newspapers|culture|ig intel 6; spirit Impartial Daily: legit 4, pp .05|An editor who takes no subsidy from anyone.|
k_censor|Wartime Censorship|k_press|law censorship; stab 4; ig intel -8|Blank columns where the editorials were.|mx k_free
k_free|Leave the Press Alone|k_press|ig intel 8; legit 5; rad .03|The government is criticised daily and survives.|mx k_censor
k_museum|Evacuate the Palace Museum|culture|legit 5; stab 3; infl 20|Twenty thousand crates travel ahead of the front for sixteen years. Nothing is broken.|
k_scholars|Scholars in Exile|k_museum,k_mass|res 30; spirit Universities in Temples: research .06|A physicist lectures in a bombed pagoda.|
k_oracle|The Bones of Anyang|k_scholars|res 15; infl 20; legit 4|Three thousand years of written history, dug from a field.|
k_confucius|Honour the Sage|culture|ig devout 6; stab 4; spirit Teacher's Day: stab 3, sway .05|His seventy-seventh-generation descendant is given a state office.|
k_christian|The Methodist First Family|k_confucius|rel USA 15; ig devout 3; infl 20|The Generalissimo reads his Bible every morning, the missionaries report.|
k_muslim|Protect the Five Faiths|k_confucius|rel XSM 20, TIB 10; stab 3; ig devout 4|An imam and a living Buddha sit on the same committee.|
k_opium|The Six-Year Suppression Plan|k_health|money -5; spirit Anti-Opium Inspectorate: growth .2, tax .04, stab 2|The Generalissimo makes himself chief inspector.|
k_labour|The Factory Law|k_women,k_press|law regulated; ig union 6; rad -.05|Eight hours for children, at least.|
k_new|A Modern People|k_scholars,k_anthem,k_opium|stab 8; spirit Renewed Nation: research .05, legit 6, manpower .04|Old civilisation, new citizens.|
`);

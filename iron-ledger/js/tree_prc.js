// Communist China (1.5): hand-written tree. Yan'an, the united front, the base areas and the road to Peking.
'use strict';
TREES.PRC = autoTree('r_', `
# The Party
yanan|The Yan'an Way||stab 5; pp 50|Caves in the loess hills, at the end of a six-thousand-mile retreat.|ai 5
wayaobu|The Wayaobu Resolution|yanan|pp 40; rel CHI 10; infl 20|The party decides it needs allies more than purity.|ai 5
## mao
mao|Mao Zedong Thought|wayaobu|legit 8; bop -20; spirit Sinified Marxism: stab 5, org .05|Marxism must take a Chinese form.|mx students,zhang; ai 6
y_lectures|Lectures in the Caves|mao|res 15; pp 40; spirit On Practice: research .03, org .02|Philosophy taught to men who cannot yet read.|
y_massline|The Mass Line|mao|ig rural 8 .2; mp 150|From the masses, to the masses.|
y_selfrely|Self-Reliance|mao|build farm 2, textile 1, arms 1; spirit Wasteland Reclaimed: farm_out .15, output .05|A brigade turns a barren valley into farmland.|
y_protracted|On Protracted War|y_lectures|spirit Three Stages: def .06, caplimit .1; axp 20|Neither quick victory nor national doom.|
y_school|The Central Party School|y_lectures|build university 1; res 20; pp 30|Every cadre is a student again.|
y_rectify|Rectification|y_school,y_massline|pp 80; rad -.1; bop -15; stab -3|Cure the sickness to save the patient.|
y_rescue|The Rescue Campaign|y_rectify|law secret_police; stab -5; rad -.1; fn intelBoost|Confessions come faster than anyone can check them.|mx y_apology
y_apology|The Chairman's Apology|y_rectify|stab 6; legit 6; ig intel 6|He bows to the hall and takes off his cap.|mx y_rescue
y_forum|The Forum on Literature|y_rectify|spirit Art Serves Politics: sway .15, ws 4|Writers learn whom they write for.|
y_newdem|New Democracy|y_protracted,y_selfrely|ideo com 6; stab 5; spirit New Democracy: legit 8, rad -.1|A bloc of four classes, for now.|
y_liu|The Organisation Man|y_rescue|y_apology|generals Liu Shaoqi/2/politic; pp 60; spirit How to Be a Good Communist: pp .08, stab 3|The underground's chief becomes the second man.|
y_history|Resolution on History|y_liu,y_forum|legit 10; bop -15|Every past line but one is declared an error.|
y_dissolve|Farewell to the Comintern|y_history|rel SOV -10; legit 6; bop -10; spirit Own Masters: pp .08, infl .1|Moscow dissolves its International; Yan'an is not sorry.|
y_congress|The Seventh Congress|y_newdem,y_history|pp 100; legit 10|A million members and one chairman.|
y_thought|Written into the Constitution|y_congress|bop -20; stab 8; spirit Guiding Thought: org .05, sway .1|The party's guide in all its work.|
y_coalition|On Coalition Government|y_congress|infl 50; fn stirCHI; rel USA 10|An offer the Generalissimo cannot accept.|
y_helm|The Great Helmsman|y_thought,y_coalition|stab 10; spirit The East Is Red: legit 10, pp .12, manpower .05|A folk tune gets new words.|
## the returned students
students|The Returned Students|wayaobu|rel SOV 40; bop 20; equip arms 300|Twenty-eight and a half Bolsheviks, fresh from Moscow.|mx mao,zhang; ai 1
s_plane|The Plane from Moscow|students|leader Wang Ming/CCP; pp 60; rel SOV 20|He steps off with the Comintern's instructions in his pocket.|
s_line|The Comintern Line|s_plane|fn joinComintern|Everything through the united front, says Moscow.|
s_cells|City Cells|s_plane|fn stirCHI; spirit Urban Underground: infl .1|The proletariat is in Shanghai, not in the hills.|
s_wuhan|The Yangtze Bureau|s_line,s_cells|rel CHI 30; infl 40; nap CHI|A second party centre, in the Generalissimo's own capital.|
s_advisers|Soviet Advisers|s_line|equip artillery 100, arms 300; tech m_art1; bop 10|A German with a Russian name plans the battles.|
s_regular|Positional Warfare|s_advisers|units inf 4; spirit Regular Front Lines: atk .05, def -.03|Not an inch of soviet soil is to be given up.|
s_workers|Proletarian Leadership|s_cells|ig union 10 .3, rural -4; build tools 2, arms 1|Workers, not peasants, must lead.|
s_corridor|The Sinkiang Corridor|s_advisers,s_wuhan|trade SOV; equip aircraft 60, arms 300; rel SIK 20|Trucks from Alma-Ata by way of Urumqi.|
s_academy|Moscow-Trained Staff|s_regular|tech m_doc1; xp; generals Liu Bocheng/4/trick|Frunze Academy graduates take the brigades.|
s_plan|A Plan for the Border Region|s_workers,s_corridor|law command; build steel 1, power 1, chem 1|Heavy industry in a land without coal trucks.|
s_ortho|Orthodoxy Enforced|s_academy,s_wuhan|bop 15; stab -4; pp 60|The 'narrow empiricists' are sent to study.|
s_bloc|Loyal Section of the International|s_ortho,s_plan|rel SOV 30; spirit Moscow's Favour: mil_out .1, research .05, legit -5|Stalin's portrait hangs beside Marx's.|
s_red|Red Manchuria|s_bloc|claim Mukden, Harbin, Hsinking; rel SOV 20; units inf 4|The Soviet border is the party's lifeline.|
s_soviet|The Chinese Soviet Republic|s_red|rename Chinese Soviet Republic/Chinese; stab 6; spirit Soviet Model State: build .1, output .05|The 1931 name returns, this time for good.|
## a rival centre
zhang|A Rival Central Committee|wayaobu|stab -8; units inf 3; leader Zhang Guotao/CCP|The commander of the larger army thinks he should lead.|mx mao,students; ai 0
z_fourth|The Fourth Front Army|zhang|units inf 4; generals Xu Xiangqian/4/off; bop 5|Eighty thousand men against the First Front's ten.|
z_west|The Western Route|z_fourth|claim Urumqi, Lanzhou; units cav 2|Towards Sinkiang and Soviet supplies.|
z_ma|Break the Ma Cavalry|z_west|war XSM; spirit Gansu Campaign [365]: atk .1|The corridor must be forced.|req ex XSM
z_nw|North-West Federation|z_west|claim Lanzhou, Xining; ws 8; ig rural 5|A soviet among the Muslim clans.|
z_minor|The Minorities Programme|z_nw|stab 5; mp 100; spirit Tibetan and Hui Regiments: manpower .06|Self-determination, promised in six scripts.|
z_base|A Base on the Soviet Border|z_ma,z_nw|rel SOV 30; equip arms 400, artillery 80|With our backs to a friendly frontier.|
z_purge|Purge the Yan'an Clique|z_fourth|stab -6; pp 80; rad -.08|The cave-dwellers are 'reassigned'.|
z_staff|A Professional Red Army|z_purge,z_base|rmspirit long_march; spirit Staff and Signals: org .05, supply .05; tech m_radio|Radios and rank badges.|
z_deal|An Understanding with Nanjing|z_purge|nap CHI; rel CHI 40; money 8|He always did think the soviet slogan was a mistake.|
z_auto|The Special Region|z_deal,z_staff|stab 8; legit 8; spirit Recognised Autonomy: tax .1, build .08|A legal government with a legal army.|
z_third|A Third Force|z_auto|ideo aut 10; infl 60; spirit Between Two Parties: pp .1, stab 4|Neither Chongqing's China nor Moscow's.|
# The Revolution
enemy|Which Enemy First?||pp 30|Chiang, or the Japanese?|ai 5
## the united front
front|The United Front|enemy|nap CHI; ws 10; fn joinChinaWar; rel CHI 30|Resist Japan and save the nation.|mx overthrow; ai 6
u_xian|Mediate at Xi'an|front|rel CHI 20; legit 6; infl 30|The party's negotiator saves the life of the man who hunted him.|
eighth|Eighth Route Army|front|units inf 4; equip arms 300|Red soldiers in Nationalist caps.|
fourth|New Fourth Army|front|units inf 3, mil 4|Guerrillas of the south, gathered into one army.|
u_pass|Ambush at the Pass|eighth|axp 30; ws 8; spirit First Victory [365]: org .06|A supply column caught in a sunken road.|req atwar JAP
u_liaison|The Chongqing Office|u_xian|fn intelBoost; rel CHI 10; infl 30|A newspaper, a liaison mission and a great many listeners.|
u_seventy|Seventy Per Cent Expansion|eighth,fourth|mp 300; units mil 8; bop -5|Ten per cent fighting Japan, twenty dealing with the Kuomintang.|
hundred|Hundred Regiments|u_pass,u_seventy|fn stirJapan; spirit Hundred Regiments Offensive [365]: atk .1|Every railway in north China is cut in a night.|req atwar JAP
u_incident|The Southern Anhui Incident|fourth,u_liaison|rel CHI -30; ws 6; legit 6; units inf 2|The headquarters column is ambushed by its allies.|
u_rebuild|Rebuild the New Fourth|u_incident|units inf 5; generals Chen Yi/4/off; spirit North of the River: supply .08|Seven divisions where one was destroyed.|
observers|The Observer Mission|u_liaison|rel USA 30; equip arms 200|American officers are impressed by what they see.|req atwar JAP
u_journalists|Red Star Over China|u_liaison|infl 50; rel USA 15, ENG 10|A foreign reporter's book does what no pamphlet could.|
u_weather|Weather and Downed Pilots|observers|rel USA 15; tech m_radio; fn intelBoost|Useful services for an ally who is not yet one.|
coalition|Demand a Coalition|u_rebuild,observers|infl 50; fn stirCHI|One-party rule must end, says the other party.|
u_august|August Storm|hundred,coalition|claim Mukden, Harbin, Hsinking, Kalgan; units inf 4; mp 200|Seven orders in one night: advance, accept surrenders, take the cities.|req japDone
u_talks|The Chongqing Talks|u_august|rel CHI 20; stab 5; pp 60|Forty-three days of toasts. Nothing is settled.|
## overthrow
overthrow|Overthrow Chiang|enemy|war CHI|The civil war never ended.|mx front; req chiPeace; ai 0
o_landwar|Land Revolution|overthrow|ig land -10 -.5, rural 8; mp 300|Burn the deeds; divide the fields.|
o_soviets|Soviets Everywhere|o_landwar|stab -5; units mil 10; spirit Village Soviets: manpower .1, tax -.05|Red spears and red seals.|
o_defect|Win Over Their Soldiers|overthrow|spirit Captives Become Comrades: manpower .08; units inf 3|Travel money for those who go home; a rifle for those who stay.|
o_south|Back to the Old Soviet|o_soviets,o_defect|claim Nanchang, Changsha, Fuzhou; ws 8|The mountains the march began from.|
## liberation
liberation|War of Liberation|u_talks|o_south|war CHI; spirit Liberation War [720]: atk .1, manpower .1|Millet plus rifles.|req japDone; ai 4
l_northeast|Race to the Northeast|liberation|claim Mukden, Harbin, Hsinking; units inf 4; rel SOV 10|Whoever holds Manchuria's factories wins.|
l_abandon|Abandon Yan'an|liberation|spirit Keep Men Lose Land: caplimit .2, def .05; axp 20|An empty city is not a defeat.|req atwar CHI
l_plains|Leap to the Central Plains|l_abandon|spirit Strike into Their Rear [365]: atk .1; units inf 3|Across the Yellow River into the enemy's heartland.|req atwar CHI
l_outline|Outline Land Law|liberation|spirit land_reform; mp 400; ig rural 10 .3|A hundred million peasants now have a reason to win.|
campaigns|Three Decisive Campaigns|l_northeast,l_plains|spirit Three Campaigns [540]: atk .12|A million and a half enemy soldiers in five months.|req atwar CHI
l_peiping|The Peiping Formula|campaigns|stab 5; units inf 4; spirit Peaceful Surrenders: manpower .05|A garrison of two hundred thousand walks out intact.|req atwar CHI
yangtze|Cross the Yangtze|campaigns,l_outline|ws 15; units inf 6|Carry the revolution through to the end.|req atwar CHI
l_south|Pursuit to the South|yangtze|spirit Great Pursuit [365]: atk .08, supply .1|Divisions march thirty miles a day.|req atwar CHI
proclaim|The People's Republic|yangtze|fn proclaimPRC; stab 15; legit 15; capital Peiping|The Chinese people have stood up.|req own Nanjing, Peiping
l_cppcc|The Consultative Conference|proclaim|legit 10; pp 60; ig intel 8|Eight small parties and a new flag.|
lean|Lean to One Side|proclaim|fn joinComintern; rel SOV 50; trade SOV|There is no third road.|mx ownroad
ownroad|An Independent Road|proclaim|spirit Neither Bloc: infl .2, stab 5|Neither Washington nor Moscow.|mx lean
l_treaty|Treaty of Friendship|lean|money 20; build steel 2, power 2; equip aircraft 150|Two months of bargaining in a Moscow dacha.|
l_west|Peaceful Liberation of the West|proclaim|claim Lhasa, Chamdo, Urumqi, Kashgar; fn playSIKTIB|The old frontiers of the empire.|
l_island|Across the Strait|l_south|claim Taihoku; core Taihoku; equip ships 10|The last province.|
l_bandits|Suppress the Bandits|l_south,l_cppcc|calm; stab 6; rad -.1|Two million stragglers and secret-society men.|
l_volunteers|People's Volunteers|l_treaty|ownroad|units inf 6; axp 30; spirit Resist and Aid [720]: atk .06, ws 8|Volunteers, by the army corps.|req war
l_new|The New China|l_bandits,l_west|stab 10; spirit Stood Up: legit 10, output .05, manpower .05|A hundred years of humiliation are declared over.|
# The Base Areas
border|Border Region Government||build admin 1, farm 2; stab 3|A state the size of a province, recognised by nobody.|ai 3
shaanxi|The Home Base|border|build farm 2, textile 1; mp 100|A million and a half people and very little rain.|
lines|Behind Japanese Lines|border|fn stirJapan; fn baseAreas|The enemy holds the towns and the railways. The rest is ours.|req atwar JAP; ai 6
rent|Rent Reduction|border|ig rural 6; rad -.08; mp 150|A quarter off every rent.|
thirds|The Three-Thirds System|border|legit 6; stab 4; infl 20|One-third Communists, one-third progressives, one-third the rest.|
college|Resistance University|border|build university 1; res 20; generals Nie Rongzhen/3/mtn|Lectures on a hillside, rifles for desks.|
production|Great Production Campaign|shaanxi,rent|build farm 3, tools 1, arms 1|The chairman grows his own tobacco.|
b_nanniwan|The Model Brigade|production|build farm 2; spirit Army That Feeds Itself: upkeep -.12, farm_out .08|Soldiers with rifles in one hand and hoes in the other.|
b_salt|The Salt Trade|shaanxi|money 6; spirit Salt Caravans: tax .08, tradecap .05|The border region's one export.|
b_notes|Border Currency|b_salt|money 6; spirit Border Bank Notes: tax .06|Printed on cloth when paper runs out.|
b_jinchaji|The Model Base|lines|fn growBases; mp 150; generals Luo Ronghuan/3/politic|A government in the mountains between three railways.|req atwar JAP
b_shandong|The Shandong Base|b_jinchaji|fn growBases; mp 150|The peninsula's hills and its long coast.|req atwar JAP
b_central|The Central China Base|b_jinchaji|fn growBases; mp 150|Among the lakes north of the Yangtze.|req atwar JAP
tunnels|Tunnel Warfare|lines,rent|spirit Tunnel Villages: def .1, entrench .1|A second village under the first.|
b_mines|Landmine Warfare|tunnels|spirit Stone Mines: def .05; equip arms 200|Every potter becomes an ordnance worker.|
b_railway|Railway Guerrillas|tunnels|fn stirJapan; spirit Train Wreckers: supply .05|They board moving trains and unload them.|
militia|People's Militia|thirds,rent|units mil 10; spirit Every Village a Fortress: manpower .1|Home-made mines and spears.|
b_women|Women's Associations|militia|mp 100; spirit Half the Sky: output .05, manpower .04|Shoes for the army, sentries on the roads.|
b_children|The Children's Corps|militia|fn intelBoost; stab 3|Road passes are checked by ten-year-olds.|
b_elect|Bean Ballots|thirds|legit 8; stab 4; ig rural 6|Illiterate voters drop beans in bowls behind the candidates.|
b_gentry|The Enlightened Gentry|thirds,b_elect|ig land 6; money 6; stab 3|A landlord sits in the assembly and proposes 'better troops, simpler administration'.|
b_simpler|Better Troops, Simpler Administration|b_gentry,production|spirit Crack Troops Lean Government: upkeep -.08, pp .08|A quarter of the officials go back to the fields.|
yellowcliff|The Hidden Arsenal|college|build arms 2; equip arms 300|A rifle factory in a gorge.|
b_doctor|The Foreign Surgeon|college|tech s_medicine; spirit Mobile Operating Theatre: org .04, manpower .03|He operates within earshot of the guns.|
b_radio|New China Radio|college|tech s_radio; infl 30; spirit Voice of Yan'an: sway .15|A transmitter carried from Moscow in pieces.|
b_opera|The White-Haired Girl|b_radio,b_women|ws 6; ig rural 6; spirit Village Drama Troupes: sway .1, ws 3|Audiences have to be stopped from shooting the villain.|
liberated|Liberated Areas|production,tunnels,militia|fn growBases; pp 50|A hundred million people behind the front.|
b_blockade|Break the Blockade|b_notes,b_simpler|trade SOV; money 10; spirit Smugglers' Routes: tradecap .08|Everything the region lacks comes through the enemy's lines.|
b_cities|From Village to City|liberated,b_blockade|build urban 1, admin 1; spirit Learning to Govern Cities: tax .08, output .04|Cadres are told not to smash the telephones.|
b_nation|A State in Waiting|b_cities,b_opera|stab 8; legit 8; pp 80|Ministries exist before there is a country to administer.|
# The Red Army
redarmy|The People's Army||spirit army_reform; units inf 2|An army the people do not fear.|ai 2
sixteen|Sixteen Characters|redarmy|spirit Guerrilla Maxims: def .08, supply .1|The enemy advances, we retreat; the enemy camps, we harass.|
mobile|Mobile Warfare|redarmy|tech m_doc1; spirit Concentrate Superior Force: atk .06|Ten against one in every battle.|
rules|Three Rules, Eight Points|redarmy|rad -.05; spirit Army of the People: org .06, manpower .05|Do not take a needle or thread from the people.|
a_survivors|Veterans of the March|redarmy|rmspirit long_march; xp; generals Peng Dehuai/5/def, Lin Biao/5/brilliant|One in ten arrived. Those are the officers now.|
sparrow|Sparrow Warfare|sixteen|spirit Harassment Squads: def .04|Three men, one shot, gone.|
captured|Our Arsenal Is the Enemy|sixteen,mobile|equip arms 400, artillery 60|Supplied by the transport corps of our opponents.|
regular|Regularisation|mobile|units inf 6; tech m_art1|Guerrilla bands become regiments.|
cavalry|Cavalry Brigades|mobile,rules|units cav 3|For the open country of the north.|
political|Political Work|rules|spirit Party Branch in Every Company: org .05, ws 6|The party commands the gun.|
a_grievance|Speak Bitterness Meetings|political|spirit Pour Out Grievances: org .05, manpower .04|Captured conscripts weep, then enlist.|
a_night|Night Fighting|sparrow,a_survivors|spirit Owners of the Night: atk .05|The enemy's aircraft and guns are blind after dark.|
a_march|Iron Feet|a_survivors|spirit Outmarch the Trucks: supply .08, org .03|Seventy miles in a day and a night, then attack.|
a_ten|Ten Military Principles|captured,a_night|tech m_doc2; axp 30; spirit Annihilation Battles: atk .06|Wipe out units; cities will follow.|
a_art|The Artillery School|regular,captured|tech m_art2; equip artillery 150; generals Zhu Rui/3/off|Captured guns finally get trained crews.|
a_japanese|The Japanese Instructors|a_art|tech m_air1; equip aircraft 40; units arm 1; tech m_tank1|A stranded air unit and its mechanics agree to teach.|req japDone
a_sappers|Trench Approaches|a_art|tech m_assault; spirit Dig to the Wall: atk .05, entrench .05|Sap forward at night until the bunkers are in grenade range.|
a_militia|Militia to Main Force|cavalry,political|units inf 6; mp 200|Village platoon, county battalion, regional regiment.|
a_logistics|Wheelbarrow Logistics|a_march,a_militia|spirit Five Million Porters: supply .2|Every army has a second army behind it carrying millet.|
field|Field Armies|regular,a_ten|units inf 8, hvy 2; generals Su Yu/5/brilliant|Five great armies, each half a million strong.|
a_marshal|The Commander-in-Chief|field|generals Zhu De/4/old, He Long/3/cav; xp|He carried his own bedroll on the March.|
a_engineers|Railway Corps|a_logistics,a_sappers|infra 2; build railway 2; spirit Repair as We Advance: supply .08|Lines are restored a day behind the front.|
a_navy|A Navy from Defectors|field|equip ships 8; spirit Junk Flotillas: navy .05|A cruiser changes sides; fishing junks carry the infantry.|
a_air|The Aviation School|a_japanese|build aircraftp 1; tech m_air2; equip aircraft 80|Trainers run on alcohol; there is no petrol.|
pla|People's Liberation Army|field,political,sparrow|spirit Liberation Army: atk .05, def .05, org .05|A new name for a new kind of war.|
a_modern|Regular and Modern|pla,a_engineers,a_air|tech m_log; spirit Defence Army of a State: org .04, supply .06|Ranks, pay and regulations, reluctantly.|
# Economy and Society
millet|Millet and Rifles||build farm 2; money 4|The whole economy fits on a donkey.|ai 2
e_mutual|Mutual Aid Teams|millet|spirit Labour Exchange: farm_out .1|Four families share one ox.|
e_spin|The Spinning Movement|millet|build textile 2; ig rural 4|The general's hands are photographed at a spinning wheel.|
e_literacy|Winter Schools|millet|spirit Thousand Characters: literacy .6; res 10|Slates in the threshing barn after harvest.|
e_oil|The Yanchang Wells|millet|dep Yan'an oil 1; build oilr 1|A few barrels a day, the only oil the party owns.|
e_coop|Consumer Cooperatives|e_mutual,e_spin|build furniture 1, tools 1; spirit Southern District Model: output .04, tax .04|Matches, cloth and salt at fixed prices.|
e_heroes|Labour Heroes|e_mutual|spirit Model Workers: output .05, ws 3|A refugee farmer becomes the most famous man in the region.|
e_latin|New Writing|e_literacy|res 15; spirit Latinised Script: literacy .3, research .03|An alphabet for people the characters failed.|
e_marriage|The Marriage Regulations|e_literacy|ig rural 3; legit 5; popgrow 1|Free choice of partners, and divorce.|
e_medicine|Unite the Two Medicines|e_literacy|tech s_medicine; spirit Herbalists and Surgeons: growth .2|Two thousand herbalists, twenty doctors.|
e_works|The Pharmaceutical Works|e_oil,e_coop|build chem 1, tools 1|Morphine, soap and smokeless powder under one roof.|
e_grain|Public Grain|e_coop,e_heroes|spirit Fair Grain Levy: tax .08, rad -.04|The rich pay most; the poorest fifth pay nothing.|
e_science|Academy of Natural Sciences|e_latin,e_medicine|build university 1; res 25; spirit Science for Production: research .05|Glass, paper and explosives from local materials.|
e_capital|Protect National Capital|e_grain|ig ind 8, pb 6; build textile 2, tools 2; spirit Benefit Labour and Capital: invest .2|Shopkeepers are told they have nothing to fear, yet.|
e_takeover|Take Over the Arsenals|e_works,e_science|build arms 2, artyf 1, steel 1|Factories inherited with their engineers.|req year 1945
e_northeast|The Manchurian Workshop|e_takeover|build steel 2, power 2, engines 1; infra 2|What the dismantlers left can still be restarted.|req own Mukden
e_money|The People's Currency|e_capital,e_grain|money 15; spirit One Currency: tax .1|A dozen border scrips become one.|
e_inflation|Break the Speculators|e_money|stab 5; rad -.08; spirit Rice Cotton and Coal Battles: tax .06, needs -.03|Shanghai's exchange is surrounded one morning.|
e_plan|A Plan of Our Own|e_northeast,e_inflation|spirit five_year_plan; build steel 2, tools 2|One hundred and fifty-six projects.|
# Foreign Affairs
world|The Party and the World||infl 20|A party with no foreign ministry and many visitors.|ai 1
f_moscow|The Moscow Channel|world|rel SOV 25; equip arms 150|A radio link, a liaison officer and occasional dollars.|
f_america|The Dixie Channel|world|rel USA 20; infl 20|Could Washington be persuaded to arm both Chinas?|
f_korea|Korean Volunteers|world|units inf 2; rel SOV 5; claim Keijo|An exile corps trains at Yan'an.|
f_japan|The Peasants' and Workers' School|world|fn stirJapan; fn intelBoost|Prisoners of war are re-educated and sent to the loudspeakers.|
f_viet|Brothers to the South|f_korea|rel FRA -10; infl 30; claim Hanoi|A Vietnamese exile once lived in these caves.|
f_mongol|Recognise Mongolia|f_moscow|rel MON 40; rel SOV 15; nap MON|What Chongqing will not concede costs us nothing.|
f_stalin|A Telegram to Stalin|f_moscow|rel SOV 20; equip artillery 100|He advises caution. He always does.|
f_marshall|The Mediation Mission|f_america|rel USA 20; nap CHI; pp 40|A general with a truce team in every county.|req notwar CHI
f_asia|Leader of the Colonial Revolution|f_viet,f_japan|infl 60; spirit Example to the East: sway .2, infl .1|The Chinese road is offered to all of Asia.|
f_recog|Seek Recognition|f_marshall,f_stalin|infl 60; legit 8; trade ENG|London, at least, will talk to whoever holds the ports.|
f_five|Five Principles|f_asia,f_recog|stab 5; spirit Peaceful Coexistence: infl .2, tradecap .08|Mutual respect, non-interference.|
# The Hidden Front
hidden|The Hidden Front||fn intelBoost; pp 20|Every party office in the enemy's cities is one room and a code book.|ai 2
h_social|The Social Affairs Department|hidden|law secret_police; fn intelBoost; spirit Counter-Espionage Section: stab 3, pp .04|It watches the enemy, and the comrades.|
h_radio|Clandestine Radio Nets|hidden|tech m_radio; fn intelBoost|A transmitter in a Shanghai attic sends for twelve years.|
h_long|Lie Low for a Long Time|h_social|spirit Sleeper Cells: infl .1, stab 2|Get a job, make friends, wait.|
h_stenographer|The Stenographer|h_long|fn intelBoost; axp 20; spirit Their Orders on Our Desk: atk .04|The Generalissimo's confidential secretary has a second employer.|
h_staff|An Agent in the War Ministry|h_stenographer|fn intelBoost; spirit Read Their War Plans: atk .05, def .03|He drafts the enemy's operational plans, in duplicate.|
h_tokyo|The Tokyo Ring's Warning|h_radio|rel SOV 15; fn intelBoost; infl 20|A journalist's cables from Tokyo pass through Shanghai.|
h_puppet|Inside the Puppet Regime|h_long|fn stirJapan; fn intelBoost|The collaborators' security chief dines with our man weekly.|req atwar JAP
h_trade|The Trading Companies|h_radio|money 10; spirit Guang Da Hua Company: tradecap .06, tax .04|Medicine, wolfram and gold move under respectable letterheads.|
h_press|The Legal Newspaper|hidden|infl 30; ig intel 6; spirit New China Daily: sway .15|Printed in the enemy's capital, censored, and read anyway.|
h_students|The Student Movement|h_press|ig intel 8; fn stirCHI; mp 40|December the Ninth: marchers in the snow.|
h_league|The Minor Parties|h_press|infl 30; rel CHI 5; legit 4|Professors who trust neither big party are courted by one.|
h_defect|Arrange Defections|h_staff,h_puppet|units inf 3; equip arms 300; spirit Uprisings on the Battlefield: manpower .05|A corps commander changes sides in mid-battle, as arranged in 1938.|
h_second|The Second Front|h_students,h_league|fn stirCHI; rad -.04; spirit Hunger Marches in Their Cities: sway .15|Against hunger, against civil war, against persecution.|
h_fleet|The Cruiser Changes Flags|h_defect|equip ships 6; ws 4|The enemy's flagship sails north one night without orders.|
h_planes|Pilots Who Fly North|h_defect|equip aircraft 40; tech m_air1|A bomber lands at our airfield; its crew ask for supper.|
h_cities|Take the Cities Intact|h_second,h_fleet|build power 1, tools 1; stab 4; spirit Factory Protection Teams: output .04, civdef .2|Workers guard the generators against their own retreating army.|
h_final|A War Won Twice|h_cities,h_planes,h_trade|stab 6; spirit The Invisible Army: atk .04, infl .15, pp .06|Half the victories were arranged before the shooting.|
# The Peoples of the Frontier
frontier|The Peoples of the Frontier||stab 3; infl 20|The March passed through the lands of a dozen nations.|ai 2
p_hui|The Hui Brigade|frontier|units cav 1; rel XSM -10; mp 40|Muslim horsemen under a red flag with a crescent.|
p_mosque|The Yan'an Mosque|p_hui|ig devout 5; stab 3; legit 3|The chairman writes the inscription over the door.|
p_mongol|The Mongol Banner Work|frontier|rel MON 20; claim Hohhot; units cav 1|A Mongol cadre trained in Moscow returns to the grasslands.|
p_inner|Inner Mongolian Autonomy|p_mongol|core Hohhot, Kalgan; stab 3; spirit First Autonomous Region: manpower .04, legit 4|An autonomous government two years before the republic.|
p_yi|Blood Oath with the Yi|frontier|mp 40; axp 10; legit 3|A general drinks chicken blood with a clan chief, and the army passes.|
p_tibet|The Tibetan Marches|p_yi|rel TIB 10; claim Chamdo; units mtn 1|Barley bought with IOUs that will be honoured in 1950.|
p_institute|The Nationalities Institute|p_mosque,p_inner|build university 1; res 15; spirit Cadres in Seven Languages: pp .05, stab 3|Students who had never seen a map of China.|
p_korean|The Korean Volunteers' Army|frontier|units inf 2; claim Heijo|Exiles who will go home with an army.|
p_yanbian|The Yanbian Koreans|p_korean|mp 80; claim Harbin; spirit Rice Growers of the Northeast: farm_out .05, manpower .03|The border prefecture supplies three divisions.|
p_taiwan|The Taiwan League|frontier|claim Taihoku; infl 20|Islanders in exile plan a homecoming.|
p_sinkiang|The Three Districts|p_institute|rel SIK -10; claim Urumqi, Kashgar; rel SOV 10|A revolt in the far north-west needs a friend.|
p_peace|Peace in the Three Districts|p_sinkiang|demand SIK puppet|A plane carrying their leaders is lost; their deputies sign.|req peace
p_viet|Vietnamese Comrades|p_taiwan|rel FRA -10; infl 30; equip arms 100|Instructors, rifles and a quiet border.|
p_japan|The Japanese People's League|p_korean|fn stirJapan; infl 20|Prisoners who chose to stay write the leaflets.|
p_overseas|The Overseas Chinese|p_viet|money 12; mp 40; spirit Returned Sons: research .03, tax .04|Engineers come home from Java and California.|
p_common|The Common Programme for Nationalities|p_peace,p_tibet,p_yanbian|stab 6; legit 6; spirit Regional Autonomy: stab 4, manpower .05|Autonomy, never secession.|
p_family|One Big Family|p_common,p_overseas,p_japan|stab 8; spirit Fifty-Odd Nations: legit 8, manpower .06|The census takers will find more peoples than anyone expected.|
# Building the Party
cadres|Cadres Decide Everything||pp 40; stab 2|Forty thousand members in 1937.|ai 3
c_recruit|Recruit Boldly|cadres|pp 40; mp 60; ig intel 6; spirit Mass Party: pp .08, stab -1|Eight hundred thousand by 1940. Not all of them know why.|
c_screen|Screen the Newcomers|c_recruit|stab 3; rad -.05; pp 30|Who vouched for you, and who vouched for him?|
c_students|Students Walk to Yan'an|cadres|ig intel 8; res 15; mp 40|Forty thousand come on foot through the blockade.|
c_women|The Women's University|c_students|build university 1; spirit Women Cadres: output .03, pp .04|A president who was once the chairman's rival's wife.|
c_marx|The Institute of Marxism-Leninism|c_students|res 20; pp 30; spirit Translated Classics: research .04|Capital, complete, in Chinese at last.|
c_style|Reform the Work Style|c_screen,c_marx|rad -.06; spirit Oppose Book Worship: pp .06, org .03|No investigation, no right to speak.|
c_branch|A Branch in Every Village|c_recruit|ig rural 8 .2; spirit Village Branches: tax .06, manpower .05|Three members make a cell.|
c_secret|The Party Is Secret Here|c_branch|fn intelBoost; stab 3|In the villages only the branch secretary knows who belongs.|
c_poor|Poor Peasant Leagues|c_branch|ig rural 8, land -6; mp 100; rad .03|Those with nothing are organised first.|
c_cadre|Cadre Schools|c_style|build admin 1; spirit Ten Thousand District Officers: tax .08, pp .06|A government needs clerks who can add.|
c_south|Cadres Go South|c_cadre|stab 4; spirit Southbound Work Teams: tax .06, build .04|Fifty thousand northerners prepare to govern provinces they have never seen.|req year 1945
c_three|Three Check-Ups|c_poor,c_secret|rad -.08; stab 3; spirit Class Origin Ideology and Style: org .04, pp .04|The army's branches are purified by the soldiers themselves.|
c_youth|The New Democratic Youth League|c_women,c_branch|mp 80; spirit Youth League: manpower .05, train .1|Fourteen to twenty-five.|
c_unions|The Federation of Labour|c_youth|ig union 8 .2; build tools 1; spirit Workers' Pickets: output .04|Revived in Harbin, the first big city.|
c_exam|Going to the Capital for the Examination|c_south,c_three|pp 80; legit 6; stab 4|We must not be another rebel king who took the capital and lost it in forty days.|
c_sugar|Sugar-Coated Bullets|c_exam|rmspirit corruption; rad -.05; spirit Two Musts: stab 4, tax .05|Remain modest; remain hard-working.|
c_party|A Party of Five Million|c_exam,c_unions|stab 8; spirit Vanguard Organised: pp .1, org .04, legit 6|The largest party outside the Soviet Union.|
c_paper|Liberation Daily|c_marx|infl 20; spirit Party Newspaper: sway .1, pp .03|Four pages, read aloud in every unit.|
c_song|The Yellow River Cantata|c_students|ws 6; stab 2|Composed in six days in a cave; sung by five hundred voices.|
c_medal|Model Party Members|c_style|pp 30; spirit Serve the People: org .03, legit 3|A charcoal burner's funeral gives the party its motto.|
`);

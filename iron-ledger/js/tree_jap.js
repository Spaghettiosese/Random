// Japan (1.5): a fully hand-written tree. Four political roads, three strategic directions.
'use strict';
TREES.JAP = autoTree('j_', `
# Politics
feb26|The February Incident||stab -3; pp 60|Fourteen hundred soldiers occupy central Tokyo in the snow.|ai 6
aftermath|Martial Law in Tokyo|feb26|stab 4; pp 30 ?? Shoot the ringleaders => stab 4; ig army -5; bop 5 // Quiet transfers to Manchuria => ig army 5; stab -2; bop -8|The capital is quiet. The question is who gained.|ai 6
## the imperial way
kodo|The Imperial Way|aftermath|spirit spiritual_mobilisation; ws 8; ig army 5 .2; bop -20|The rebels lost; their ideas need not.|mx tosei,purge,front; ai 0
k_araki|Recall General Araki|kodo|generals Sadao Araki/3/politic, Jinzaburo Mazaki/2/old; pp 40|The prophet of the spiritual army returns to office.|
k_pardon|Pardon the Young Officers|kodo|stab -4; ig army 6; ws 4; bop -8|They acted from pure motives, the court-martial is told.|
k_spirit|Spirit Over Steel|k_araki|spirit Yamato Spirit: org .06, def .03, research -.02|An army that believes it cannot lose.|
k_purge|Purge the Control Faction|k_araki,k_pardon|ig army -4; pp 60; bop -10; spirit One Faction: pp .08, org .03|The planners and staff clerks are posted to distant garrisons.|
k_village|Relief for the Villages|k_pardon|ig rural 10 .2; rad -.1; build farm 3|The soldiers' sisters were being sold to pay the rent.|
k_restore|The Showa Restoration|k_purge|law autocracy; legit 8; pp 80; stab -5|The Diet is prorogued without a date.|
k_zaibatsu|Curb the Zaibatsu|k_village,k_purge|ig ind -10 -.3; money 12; rmspirit zaibatsu; spirit Humbled Combines: tax .08, invest -.2|The combines discover patriotism under supervision.|
k_agrarian|Agrarian Nationalism|k_village|ig rural 6; spirit Farm Villages First: farm_out .12, manpower .05|The village is the root of the nation.|
k_shinto|State Shinto|k_restore|ig devout 8 .2; stab 6; spirit Shrine and State: stab 4, legit 5|Every schoolchild bows toward the palace.|
k_direct|Direct Imperial Rule|k_restore|legit 10; spirit No Cabinet Between: pp .15, stab 3|No minister stands between the throne and the people.|
k_thought|The Thought Police|k_restore,k_zaibatsu|law secret_police; rad -.1; fn intelBoost|Dangerous thoughts are a police matter.|
k_polity|Clarify the National Polity|k_shinto,k_direct|ideo fas 8; stab 5; spirit Fundamentals of the Polity: rad -.05, sway .1|A textbook settles what the nation is.|
k_north|Northern Road Doctrine|k_direct,k_thought|claim Vladivostok, Khabarovsk, Chita, Okha; bop -10; ws 5|The real enemy is in Siberia.|
k_handsoff|Hands Off China|k_north|nap CHI; rel CHI 25; fn dropClaimsChina|Every division in China is one fewer on the Amur.|
k_crusade|Anti-Comintern Crusade|k_north|rel GER 30, ITA 20; mkfaction Anti-Comintern League; invite MAN, SIA|Japan leads Asia against Bolshevism.|
k_divine|The Divine Nation|k_polity|ws 10; spirit Land of the Gods: caplimit .15, org .04|Never once invaded, never once defeated.|
k_strike|Prepare the Northern Strike|k_handsoff,k_crusade|units inf 8, cav 2; equip artillery 200; axp 30|Ripe persimmons fall by themselves; green ones must be shaken.|
k_amur|Incident on the Amur|k_strike|clash SOV; tension 3|A sandbar in the river is worth a regiment.|req ex SOV
k_baikal|To Lake Baikal|k_amur|war SOV; spirit Northern Expedition [540]: atk .1, supply .1|The Imperial Way leads north.|req ex SOV; ideo fas
k_myriad|Eight Hundred Myriad Gods|k_divine,k_strike|stab 10; legit 10; spirit The Emperor's Own Army: atk .05, def .05, org .05|The restoration is complete.|
## the control faction
tosei|The Control Faction|aftermath|spirit total_war_planning; build arms 2, steel 2; bop -10|The rebels are shot. The planners inherit the army.|mx kodo,purge,front; ai 6
t_trials|Closed Courts-Martial|tosei|stab 5; ig army -3; pp 40|No public statements, no appeals.|
t_hirota|The Hirota Cabinet|tosei|pp 50; rel GER 15; spirit Three Principles: infl .1|A diplomat fronts for the generals.|
t_active|Active Duty Rule|t_trials,t_hirota|ig army 8 .3; bop -8; spirit Army Veto: pp -.05, mil_out .06|Only serving officers may be service ministers. Any cabinet can now be toppled.|
t_natdef|National Defence State|t_active|spirit Planned War Economy: mil_out .08, build .05|Every yen and every ton accounted for.|
t_planning|Cabinet Planning Board|t_hirota|build construction 1, tools 2; res 15|Bureaucrats in uniform draw up five-year plans.|
t_konoe|The Prince's Cabinet|t_active,t_planning|pp 80; legit 6; stab 4|A popular aristocrat lends his name.|
t_mobilise|National Mobilisation Law|t_natdef|law partial; spirit State Mobilisation: mil_out .1, needs -.05|The state may requisition anything and anyone.|req war
t_power|State Control of Electricity|t_planning|build power 3; ig ind -4|Every generator under one company.|
t_spirit|Spiritual Mobilisation Campaign|t_konoe|ws 8; spirit Luxury Is the Enemy: needs -.06, ws 4|No permanent waves, no neon.|
t_parties|Dissolve the Parties|t_konoe|law oneparty; pp 60; ig intel -6|They vote themselves out of existence.|
t_sanpo|Patriotic Labour Association|t_mobilise,t_power|law state_unions; ig union -6 -.3; spirit Industrial Service: output .05, rad -.05|Unions are replaced by a duty.|
t_assist|Imperial Rule Assistance|t_parties,t_spirit|pp 80; spirit One Party Under Heaven: pp .15, stab 4|All politics dissolve into one association.|
t_neighbour|Neighbourhood Associations|t_assist|stab 6; spirit Ten Households: civdef .2, rad -.06|Rations, fire drills and watching one another.|
t_youth|Greater Japan Youth Corps|t_assist|mp 150; spirit Youth Corps: manpower .06, train .1|Drill begins at twelve.|
t_liaison|Liaison Conference|t_assist,t_sanpo|rmspirit army_navy_rivalry; bop 10; spirit Joint Planning: research .03, supply .05|For once the Army and Navy sit at one table.|
t_institute|Total War Research Institute|t_liaison|build university 1; res 30; proj 20|Its first war game predicts defeat. The report is filed.|
t_neworder|New Order in East Asia|t_assist|infl 50; tension 3; rel MAN 20|Japan, Manchukuo and China under one roof.|
t_econ|Economic New Order|t_sanpo,t_neworder|law command; ig ind -6; spirit Control Associations: mil_out .1, invest -.2|Each industry gets a cartel with a general on the board.|
t_razor|The Razor's Cabinet|t_neworder,t_liaison|fn leaderTojo; ws 10; spirit Soldier-Premier: atk .04, pp .1; bop -15|One general holds the premiership and the war ministry.|ai 3
t_kempei|Military Police State|t_razor|law secret_police; fn intelBoost; rad -.1|The gendarmerie reads the mail.|
t_hats|Three Offices, One Man|t_razor|pp 100; spirit Unified Command: org .05, supply .05, legit -4|Premier, war minister, chief of staff.|req war
t_munitions|Ministry of Munitions|t_econ,t_razor|spirit Aircraft Above All: mil_out .12, air .05|Every factory gets a production quota in airframes.|req war
t_students|Students to the Front|t_hats|mp 300; spirit Student Mobilisation: manpower .08, research -.04|The deferments end in a rain-soaked stadium.|req war
t_decisive|The Decisive Year|t_munitions,t_hats|ws 15; spirit Hundred Million Advancing [365]: atk .08, mil_out .08|Everything is staked on one more victory.|req war
t_hundred|One Hundred Million, One Heart|t_decisive,t_neighbour|stab 10; spirit National Unity of Purpose: caplimit .2, def .06|A nation organised to its last household.|
## the civilian purge
purge|Purge the Militarists|aftermath|setIdeo dem; rmspirit militarism; stab -12; rel USA 30, ENG 30, CHI 20|The Diet reasserts civilian rule.|mx kodo,tosei,front; ai 0
p_saito|The Anti-Military Speech|purge|pp 60; ig intel 8; bop 8|A member asks the war minister what the army is for.|
p_court|Open Courts-Martial|purge|ig army -8 -.3; stab 4; legit 6|The plotters are tried in public, and so is the system.|
p_genro|The Last Genro's Counsel|purge|legit 8; pp 40|An old prince still names the premiers.|
p_cabinet|A Party Cabinet|p_saito,p_genro|law universal, protected; legit 8|Ministers answerable to the Diet again.|
p_civilian|Civilian Service Ministers|p_court,p_cabinet|ig army -8 -.3; spirit Civil Supremacy: pp .1, upkeep -.1; bop 10|The army's veto over cabinets is abolished.|
p_organ|The Organ Theory Restored|p_cabinet|legit 6; ig intel 8; spirit Constitutional Monarchy: stab 5, research .03|The Emperor is an organ of the state, as the professors always said.|
p_shidehara|Conciliation Diplomacy|p_cabinet|nap CHI; rel CHI 40, USA 20; fn dropClaimsChina|Trade and treaties instead of garrisons.|
p_labour|Taisho Democracy Restored|p_organ|law regulated; ig union 6; rad -.08|Unions and tenant leagues are legal again.|
p_women|Votes for Women|p_organ|legit 6; ig intel 5; stab 3|The bill had passed the lower house once before.|
p_recall|Recall the Kwantung Army|p_civilian,p_shidehara|sub MAN 30; rel CHI 30; rel SOV 15; ig army -6|The officers who seized Manchuria are retired.|
p_manchuria|Autonomy for Manchuria|p_recall|rel CHI 30; fn manAutonomy; tension -3|A face-saving formula for a seized province.|
p_tenancy|Tenancy Reform|p_labour|spirit land_reform; ig land -8 -.3, rural 8|Rents in cash, capped by law.|
p_antitrust|Break Up the Combines|p_labour,p_women|rmspirit zaibatsu; ig ind -8 -.3, pb 8; spirit Open Economy: invest .2, output .04|Holding companies are dissolved.|
p_korea|Home Rule for Korea|p_recall|core Keijo, Heijo; stab 3; rel USA 10; spirit Korean Assembly: manpower .04, legit 3|An elected assembly in Keijo.|
p_treaties|Return to the Treaties|p_shidehara,p_civilian|rel USA 40, ENG 40; trade USA, ENG; tension -4|Back to Washington and London.|
p_league|Return to the League|p_treaties|infl 60; rel FRA 20, ENG 10|The delegation that walked out walks back in.|
p_opendoor|The Open Door|p_treaties|trade USA, CHI; spirit Export Boom: tradecap .12, tax .05|Silk, toys and cotton cloth for the world.|
p_withdraw|Withdraw from North China|p_manchuria,p_league|rel CHI 40; nap CHI; legit 5; ig army -6|The garrisons south of the Wall come home.|
p_bank|Asian Development Bank|p_opendoor,p_antitrust|money 15; build construction 1; infl 30|Capital, not conquest.|
p_navy|A Treaty Navy|p_treaties|bop 15; spirit Fleet in Being: navy .08, upkeep -.08|Enough to defend, too little to tempt.|
p_pact|Pacific Pact|p_league,p_navy|fn joinAllies|An ocean kept peaceful by its largest navies.|req tension 30
p_peace|The Peace State|p_withdraw,p_bank|stab 10; spirit Trading Nation: output .06, research .05, ws -10|A great power without an empire's bills.|
## the people's front
front|The People's Front|aftermath|ideo com 12; stab -8; ig union 8 .2|Tenant unions and factory cells come out of hiding.|mx kodo,tosei,purge; ai 0
f_strike|The General Strike|front|stab -6; ig union 8 .3; ideo com 8|Tokyo's trams stop first.|
f_tenants|The Tenant Leagues|front|ig rural 8 .2; ideo com 6; rad .05|Rent strikes across the north-east.|
f_soldiers|Soldiers' Councils|f_strike|ig army -8 -.3; ideo com 6; bop 5|Conscripts are peasants in uniform.|
f_nosaka|The Exile Returns|f_strike,f_tenants|leader Sanzo Nosaka/People's Front; pp 60|From Moscow by way of Yan'an.|
f_peoples|People's Front Government|f_nosaka,f_soldiers|setIdeo com; stab -8; rmspirit militarism|Red flags in the Ginza.|
f_peerage|Abolish the Peerage|f_peoples|ig land -10 -.5; law council|Counts and barons become citizens.|
f_throne|The Question of the Throne|f_peoples|stab -6; pp 60|A symbol, or nothing at all.|
f_symbol|A Symbol Emperor|f_throne|stab 10; legit 8; ig devout 5|He keeps the palace and loses the prerogative.|mx f_republic
f_republic|The People's Republic|f_throne|rename People's Republic of Japan/Japanese; stab -8; legit -5; ig devout -10; pp 100|The chrysanthemum throne stands empty.|mx f_symbol
f_combines|Nationalise the Combines|f_peerage|law command; rmspirit zaibatsu; ig ind -12 -.5; money 20|Four families' holdings become the people's.|
f_land|Land to the Tillers|f_peerage|spirit land_reform; ig rural 10; mp 150|Three million tenant families become owners.|
f_redarmy|People's Army|f_symbol|f_republic|ig army 6; units inf 4; spirit Army of Workers and Peasants: manpower .08, org .04|Officers are elected, for a while.|
f_korea|Free Korea, Free Taiwan|f_symbol|f_republic|rel CHI 30, SOV 20; stab 4; infl 40|Colonies become fraternal republics in waiting.|
f_plan|The First Plan|f_combines,f_land|spirit five_year_plan; build steel 2, power 2, tools 2|Steel targets on every wall.|
f_socialist|Socialist Asia|f_redarmy,f_korea|fn joinComintern; rel PRC 40, SOV 30|Workers of the East, unite.|
f_china|Arms for Yan'an|f_socialist|rel PRC 40; nap CHI|The Kwantung arsenals are opened to the Chinese Red Army.|
f_liberate|Liberate the Colonies|f_socialist,f_plan|claim Hanoi, Saigon, Batavia, Singapore, Manila, Rangoon; ws 10; tension 5|The white empires in Asia are next.|
f_pacific|Pacific Revolution|f_liberate|spirit Red Sun [720]: atk .08, sway .2|From Sakhalin to Java.|req war
# Asia Policy
hakko|Eight Corners, One Roof||infl 30; ws 3|A slogan from the first emperor, repurposed.|ai 6
## china
china|The China Incident|hakko|claim Peiping, Tianjin, Shanghai, Nanjing, Kalgan, Jinan, Qingdao; fn chinaWar; units inf 8; spirit Continental Offensive [540]: atk .1, supply .1|Shots at the Marco Polo Bridge.|req chinaTime & divs 50; ai 8; ideo fas
c_hebei|East Hebei Autonomy|hakko|rel CHI -15; infl 20; claim Peiping, Tianjin|A smugglers' republic outside the Wall.|
mengjiang|The Mongol Borderlands|c_hebei|claim Kalgan, Hohhot; units cav 2|A prince, a flag and a Japanese adviser.|
c_shanghai|The Shanghai Landing|china|units inf 8, hvy 1; equip ships 10; spirit Yangtze Expedition [365]: atk .06, navy .04|Three months for a city the plan gave three days.|req atwar CHI; ai 7
c_nanjing|Drive on the Capital|c_shanghai|ws 5; axp 30; spirit Pursuit Up the River [240]: atk .08 ?? Offer terms through the German ambassador => rel CHI 10; stab 3; tension -2 // No dealings with the Nationalists => ws 8; pp 40; tension 2|No one ordered the advance; no one stopped it.|req atwar CHI; ai 6
wang|The Reorganised Government|china|fn collabCHI|A former premier agrees to head a rival China. Every Chinese province we take — and, when China falls, all of China — passes to his government.|req holdNanjing; ai 8
c_xuzhou|The Xuzhou Pincers|c_nanjing|axp 25; equip artillery 150; units inf 4; spirit Railway Offensive [365]: atk .08|North and central armies link along the railway.|req atwar CHI; ai 5
c_wuhan|Up to Wuhan|c_xuzhou|spirit River Campaign [300]: atk .06, supply .08|A thousand kilometres from the sea.|req atwar CHI
pacify|Pacification Campaigns|wang|calm; spirit Garrison Armies: supply .05|Blockhouses and sweeps along the railways.|req atwar CHI
c_puppet|Collaborationist Armies|wang|units mil 10; calm|Peace-preservation troops, unreliable but numerous.|
c_treaty|The Basic Treaty|wang|rel CHI 0; infl 40; calm; spirit Recognised Client: tax .04|Nanjing signs what Chongqing refused.|
c_blockade|Blockade the Coast|c_shanghai|spirit Coastal Blockade: navy .04, tradecap .03|Every port from Tianjin to Canton.|req atwar CHI
c_roads|Cut the Supply Roads|c_blockade,c_wuhan|rel ENG -10, FRA -10; infl 30; spirit Closed Back Doors [540]: atk .05|Burma and Indochina are leaned on.|req atwar CHI
c_ndc|North China Development Company|pacify,c_treaty|build coalm 2, ironm 1; money 10|Coal and cotton from the occupied north.|
ichigo|Continental Corridor|c_wuhan,c_roads|spirit Operation Number One [540]: atk .08, supply .1|A land route from Korea to Indochina.|req atwar CHI
warlords|Buy the Warlords|mengjiang,wang|fn bribeWarlord|Silver bullets are cheaper than lead ones.|
c_second|A Second Envelope of Silver|warlords|fn bribeWarlord|Another general discovers his province's neutrality.|
chinapeace|Peace Through Nanjing|c_treaty,ichigo|fn chinaPeace|An end to a war nobody planned.|
## north
north|Strike North|hakko|claim Vladivostok, Khabarovsk, Chita, Okha, Ulan Bator; bop -25|The Army's war: Siberia and the Bolsheviks.|mx south; ai 0; ideo fas; req divs 70
kantoku|Kwantung Special Manoeuvres|north|units inf 6, arm 1; bop -8|Seven hundred thousand men for an exercise.|
n_lake|The Hill by the Lake|north|clash SOV; tension 2|A hilltop where three borders meet.|req ex SOV
n_river|The River in the Steppe|n_lake|clash MON; axp 20|A border nobody surveyed.|req ex MON
n_whites|White Russian Detachments|kantoku|units cav 2; rel SOV -10; fn intelBoost|Émigrés in Harbin still dream of going home.|
panmongol|A Pan-Mongol State|n_river|claim Ulan Bator, Chita; rel MON -20|From Lake Baikal to the Great Wall.|
n_coord|Coordinate with Berlin|kantoku|rel GER 30; spirit Two-Front Squeeze [540]: atk .06|If they strike from the west, we strike from the east.|req gerSovWar
northwar|The Northern Expedition|kantoku,n_lake|war SOV|Green persimmons must be shaken.|req ex SOV; ideo fas
n_sakhalin|All of Sakhalin|northwar|claim Okha; units mtn 2; equip ships 10|Oil at the northern tip of the island.|
n_amur|Across the Amur|northwar|spirit River Crossing Battalions: atk .05; axp 25|Assault boats at dawn.|req atwar SOV
siberia|A Far Eastern Republic|n_amur|fn collabSOV|A buffer state, as in 1920.|req holdVlad
n_baikal|The Baikal Line|siberia,n_sakhalin|fort Hailar, Harbin; spirit Siberian Frontier: def .06, res_out .05|Dig in where the railway meets the lake.|
## south
south|Strike South|hakko|claim Saigon, Hanoi, Hue, Batavia, Surabaya, Palembang, Balikpapan, Medan, Singapore, Kuala Lumpur, Manila, Rangoon, Hong Kong, Kuching, Brunei; build shipyard 2; bop 25|The Navy's war: oil, rubber and the southern resource area.|mx north; ai 6; ideo fas; date 1939-9; req navy 220
s_hainan|The Hainan Operation|south|units inf 2; equip ships 10; spirit Southern Springboard: navy .04|An island that points at Indochina.|ai 5; date 1939-10
nonagg|Neutrality Pact with Moscow|south|nap SOV ?? Sell Moscow the northern concessions => money 12; rel SOV 15 // Keep the Kwantung Army at full strength => units inf 3; rel SOV -5|Secure the north before turning south.|req ex SOV; ai 4; date 1941-4
indo|Occupy Indochina|s_hainan|fn indochina ?? The north only, by agreement => rel USA -5; rel FRA -10 // The whole colony, airfields and all => rel USA -25, ENG -15; build port 1; tension 3|Close the roads into China; open the road south.|req ex FRA; ai 5; ideo fas; date 1940-7
thai|The Thai Alliance|s_hainan|rel SIA 30; fn inviteSIA|The only independent state in the region picks a side.|date 1941-6
s_plans|The Southern Plan|indo,nonagg|axp 30; units inf 4; equip ships 20|Malaya, the Philippines and the Indies in a hundred and fifty days.|
pearl|The Decisive Strike|indo|fn pearl; spirit rising_sun [240] ?? Hit the fleet at anchor => spirit Battleship Row [300]: navy .12 // Hit the oil tanks and dry docks => spirit Crippled Base [540]: navy .07, tradecap .05|Climb Mount Niitaka.|req pearlTime & navy 250; ai 7; ideo fas
sphere|Co-Prosperity Sphere|thai,indo|fn sphere; spirit asia_for_asians ?? Real independence for the liberated => infl 60; calm; legit 5 // Military administration everywhere => money 15; spirit Southern Requisitions: res_out .1, stab -2|Asia for the Asians, under Tokyo.|
southern|The Southern Operation|pearl|units inf 6; spirit Centrifugal Offensive [365]: atk .1, navy .1|A hundred days to take an empire.|req war
s_malaya|Down the Peninsula|southern|units inf 3; spirit Bicycle Blitz [240]: atk .08, supply .08|Seventy days to the causeway.|req atwar ENG
s_hong|The Fragrant Harbour|southern|axp 15; equip ships 10|Eighteen days.|req atwar ENG
manila|A Philippine Republic|southern|fn collabPHI|Independence, granted by the occupier.|req holdManila
indies|Liberate the Indies|southern|fn collabHOL|Three centuries of Dutch rule end in a week.|req holdBatavia
s_oil|The Oilfields Intact|indies|fn southRes; build port 1|Paratroops seize the refineries before the charges blow.|req holdOil
burma|Burma and Free India|s_malaya,sphere|fn collabBurma|The road to Delhi.|req holdRangoon
s_delhi|On to Delhi|burma|claim Calcutta, Dacca, Gauhati; spirit March on India [365]: atk .06|An army of exiles marches with ours.|req atwar ENG
s_isolate|Isolate Australia|s_malaya,indies|claim Port Moresby, Rabaul, Lae, Tulagi, Darwin; equip ships 20|Cut the line from San Francisco to Sydney.|req war
s_midway|The Decisive Sea Battle|s_isolate|spirit All Carriers Forward [240]: navy .15|Lure their carriers out and sink them.|req atwar USA
perimeter|Absolute Defence Perimeter|s_isolate,s_oil|fort Tokyo, Fukuoka, Taihoku; spirit Island Fortresses: def .08, entrench .1|Every atoll a fortress.|
conference|Greater East Asia Conference|manila,indies,burma|infl 80; calm; spirit Asian Solidarity: manpower .06|Six heads of government in one photograph.|
s_convoy|Convoy the Oil Home|s_oil|spirit Southern Convoys: tradecap .1, supply .05|Three thousand miles of submarine water.|
s_feeler|Peace Feelers|perimeter,conference|sepeace USA, ENG, HOL; stab -5|Through Moscow, through Stockholm, through anyone.|req hold Manila, Singapore
homeland|Battle for the Homeland|perimeter|units mil 15; spirit The Hundred Million: caplimit .2, def .05|Bamboo spears on the beaches.|req majorwar
## the axis
d_anticom|Anti-Comintern Pact|hakko|rel GER 30, ITA 15; rel SOV -15|An agreement against an International.|ai 4; ideo fas
axis|Join the Axis|d_anticom|fn joinAxisJ|Berlin, Rome, Tokyo.|req gerFasWar; ai 3; ideo fas; date 1940-9
d_noseparate|No Separate Peace|axis|rel GER 20; spirit Tripartite Solidarity: ws 5, infl .1|Three signatures on one sheet.|req war
d_yanagi|The Submarine Exchange|axis|tech m_radar; proj 30; res 20|Blueprints, quinine and gold cross two oceans under water.|
d_embargo|Defy the Embargo|d_anticom|embargo USA; trade GER; spirit Autarky Drive: output .03, tradecap -.05|If they will not sell, we will not buy.|ai 0
# Economy
zaibatsu|Zaibatsu Partnership||build steel 2, engines 1, autos 1; ig ind 4 ?? Leave the combines their freedom => ig ind 6; spirit Private Initiative: invest .2 // Direct them from the ministry => ig ind -6; spirit Guided Combines: mil_out .06, build .04|Four family combines own most of what matters.|ai 3
manind|Manchurian Industrial Plan|zaibatsu|fn manBuild; trade MAN|A planned economy on a blank slate.|
yawata|The Great Steelworks|zaibatsu|build steel 3|Half the nation's steel from one town.|
synfuel|Synthetic Fuel|zaibatsu|tech p_synthetic; build synth 2|A drop of oil is a drop of blood.|
merchant|Merchant Marine|zaibatsu|build shipyard 1, port 1; spirit Great Merchant Fleet: tradecap .1|Six million tons under the sun flag.|
silk|From Silk to Steel|zaibatsu|build textile 2, tools 2; money 6|The export that paid for the battleships.|
heavy|Manchurian Heavy Industries|manind|build engines 2, autos 1, tankp 1|A new combine moves to the mainland.|
e_korea|Industrialise the North of Korea|manind|build chem 2, power 2; dep Heijo coal 1|Dams on the Yalu, fertiliser at the coast.|
e_rice|Colonial Rice|e_korea|build farm 3; spirit Imported Rice: growth .2, needs -.03|Korea and Taiwan feed the home islands.|
metals|Light Metals|yawata|build aircraftp 2, power 1|Bauxite in, airframes out.|
e_scrap|The Scrap Drive|yawata|equip arms 200; build steel 1; rel USA -5|Temple bells and park railings.|
reserve|Strategic Stockpiles|synfuel|spirit Oil Reserve: supply .1|Two years of fuel, if nothing goes wrong.|
e_liquid|Coal Liquefaction|synfuel|build synth 2, coalm 1|The German patents cost a fortune.|
tankers|Tanker Programme|merchant|spirit Tanker Fleet: tradecap .06, navy .03|Oil must cross three thousand miles of sea.|
e_fish|The Northern Fisheries|merchant|build ranch 2; trade SOV; money 4|Crab canneries afloat off Kamchatka.|
yen|The Yen Bloc|silk|trade MAN, SIA; spirit Yen Bloc: tradecap .08, tax .04|One currency for the empire.|
e_savings|National Savings Campaign|silk|money 15; spirit Patriotic Savings: tax .06, needs -.03|Every pay packet buys a bond.|
e_workshops|A Million Small Workshops|silk|build tools 2, arms 1; spirit Subcontracting Web: mil_out .05|Aircraft parts made in back streets.|
power|Electric Power Control|metals,reserve|build power 3; tech p_hydro|Every generator under one state company.|
e_rail|The Trunk Line Plan|power|infra 4; build railway 2|A new wide-gauge line from Tokyo to the straits.|
e_alu|Aluminium from the South|metals,tankers|build aircraftp 2; spirit Bauxite Convoys: air .04|Bintan ore, Korean power.|
e_prices|Price Control Ordinance|e_savings,yen|rad -.05; spirit Frozen Prices: needs -.04, invest -.1|Everything is fixed at the level of the eighteenth of September.|
e_ships|Standard Ship Programme|tankers,e_workshops|build shipyard 2; equip ships 20|One design, built faster than it can be sunk — in theory.|
e_women|Women's Volunteer Corps|e_workshops|mp 80; spirit Women in the Factories: output .05|Schoolgirls on the lathes.|req war
munitions|Munitions Ministry|power,heavy,e_ships|spirit Munitions Ministry: mil_out .12|Aircraft above all.|req war
resources|Southern Resources|tankers,yen|fn southRes|What the embargo denied, the fleet has taken.|req holdOil
e_total|Total Economic Mobilisation|munitions,e_prices|law war_econ; spirit Everything for the Front: mil_out .08, needs -.06|Nothing is produced that does not fight.|req war
# Army
armylaw|Army Expansion Law||spirit army_reform; units inf 4|Seventeen divisions become fifty.|ai 2
kwantung|The Kwantung Army|armylaw|units inf 4, cav 1; bop -8|An army that makes its own foreign policy.|ai 5
spirit|Infantry Spirit|armylaw|spirit Night Infantry: atk .05, org .04|The bayonet decides.|
tanks|Tank Regiments|armylaw|tech m_tank1; build tankp 1; units arm 1|Light tanks for an infantry army.|
a_academy|The Army War College|armylaw|xp; generals Tomoyuki Yamashita/5/off, Masaharu Homma/3/inf|Red-stripe staff officers run everything.|
a_korea|The Korea Army|kwantung|units inf 3; fort Keijo|A garrison with a habit of crossing rivers unasked.|
a_fortress|Manchurian Border Forts|kwantung|fort Hailar, Harbin, Mukden|Concrete facing the Trans-Siberian.|
jungle|Jungle Warfare School|spirit|tech m_mtn; units mtn 2; spirit Jungle Training: supply .1|Read this alone, and the war can be won.|
infiltrate|Bold Infiltration|spirit|spirit Infiltration Tactics: atk .04|Around the flank, through the swamp, at night.|
guns|Mountain Guns|spirit,tanks|tech m_art1; equip artillery 200|Artillery a mule can carry.|
medium|Medium Tank|tanks|tech m_tank2; equip tanks 120|Good enough for China.|
a_staff|Operations Section|a_academy|tech m_doc1; axp 30; spirit Staff Supremacy: org .03, supply -.03|Plans drawn without consulting the quartermasters.|
a_south|Southern Expeditionary Army|a_staff,jungle|generals Hisaichi Terauchi/3/log, Hitoshi Imamura/4/jungle; units inf 4|A count commands from Saigon.|
bicycles|Bicycle Infantry|jungle|units inf 4; spirit Bicycle Columns: supply .08, atk .02|Six hundred miles down a peninsula in seventy days.|
tiger|Lightning in the Jungle|infiltrate,jungle|spirit Driving Charge [365]: atk .08|Bluff, speed and thirty thousand men.|req war
expedition|China Expeditionary Army|guns|units inf 6; calm|A million men to hold the railways.|
garrisons|Island Garrisons|medium,guns|fort Taihoku, Dairen; units inf 3|Every rock in the mandates gets a battalion.|
a_para|Raiding Regiments|a_staff|units inf 2; spirit Airborne Raiders: atk .03|Parachutes over the refineries.|
a_armour|An Armoured Army|medium|tech m_tank3; units arm 2, mot 1|Formed in Manchuria, for a war that came elsewhere.|date 1942-1
a_caves|Defence in Depth|garrisons|tech m_fort; spirit Honeycomb Defence: def .08, entrench .15|Fight from inside the island, not on its beaches.|
shortwar|Short War Doctrine|tiger,expedition,bicycles|tech m_doc2; spirit Decisive Battle on Land: atk .05, supply -.05|Win in six months or not at all.|
a_last|Decisive Battle Armies|a_caves,shortwar|units inf 8, mil 10; ws 10|Every man in the home islands under arms.|req majorwar
# Navy
circle|Third Replenishment Plan||build shipyard 2; equip ships 30; bop 8|Quality to offset American quantity.|ai 2
treaties2|Leave the Naval Treaties|circle|rel USA -15, ENG -15; equip ships 30; tension 2|No more ratios.|
kido|Mobile Strike Force|circle|tech m_nav1; equip ships 30; spirit Carrier Striking Force: navy .12; bop 8|Six carriers sailing as one.|
giants|Super-Battleships|circle|equip ships 50; spirit Largest Guns Afloat: navy .06|Eighteen-inch guns behind a wall of secrecy.|
v_fleetfac|The Fleet Faction|circle|bop 12; pp 30; ig army 3|Admirals who think a war with America can be won.|mx v_treatyfac
v_treatyfac|The Treaty Faction|circle|bop 5; rel USA 15, ENG 10; spirit Cautious Admirals: upkeep -.06, navy .03|Admirals who have seen Detroit.|mx v_fleetfac
torpedo|Oxygen Torpedo|treaties2|spirit Long Lance: navy .08|Twice the range of anyone else's.|
night|Night Battle Training|treaties2,kido|spirit Night Fighting: navy .06|Lookouts chosen for their eyes.|
fighter|Carrier Fighter|kido|equip aircraft 250; spirit Agile Fighters: air .12|Nothing in the Pacific can turn with it.|
isubs|Fleet Submarines|kido,giants|tech m_nav2; equip ships 20|Boats built to scout for the battle line.|
landing|Naval Landing Forces|giants|units inf 3; spirit Landing Forces: navy .05, atk .02|Sailors with rifles and steel helmets.|
v_shallow|Shallow-Water Torpedoes|torpedo,fighter|spirit Wooden Fins: navy .05; axp 10|A harbour forty feet deep is no longer safe.|
v_yamamoto|The Gambler Admiral|v_fleetfac|v_treatyfac|generals Isoroku Yamamoto/5/brilliant; bop 8|He opposes the war and plans its first day.|
kessen|Decisive Fleet Battle|fighter,night,torpedo|spirit Kantai Kessen: navy .1|One great battle near home waters.|
escort|Escort Command|isubs|spirit Convoy Escorts of the Empire: tradecap .08|An afterthought that should not have been.|
mandates|Mandate Bases|landing|fort Taihoku; spirit Unsinkable Carriers: navy .05, air .03|Airstrips on coral.|
v_barges|Daihatsu Barges|landing|spirit Landing Craft: navy .04, supply .05|A bow ramp, years before anyone else's.|
v_carriers|Convert the Liners|kessen,v_yamamoto|equip ships 30; equip aircraft 100|Passenger ships get flight decks.|
combinedfleet|The Combined Fleet|kessen,escort,mandates|equip ships 40; spirit Combined Fleet: navy .08; bop 10|The finest navy in the world, for about a year.|
v_tokyo|The Destroyer Runs|v_barges,combinedfleet|spirit Night Supply Runs: supply .08|Garrisons fed by destroyers at thirty knots.|req war
# Air and Science
airarms|Two Air Arms||build aircraftp 2; tech m_air1; equip aircraft 150|The Army and the Navy each build their own.|ai 2
navalair|Land-Based Naval Bombers|airarms|tech m_air2; equip aircraft 200; spirit Long-Range Naval Air: navy .06, bombing .15|Torpedo bombers with a thousand-mile reach.|
armyair|Army Aviation|airarms|tech m_cas; equip aircraft 200|Light bombers over China.|
elite|Elite Pilot Training|navalair|spirit Elite Aircrew: air .1|A hundred graduates a year, each a master.|
masspilots|Mass Pilot Training|navalair,armyair|mp 80; spirit Pilot Reserve: air .06|Too late is better than never.|
homeair|Home Air Defence|armyair|spirit Air Defence Sectors: civdef .25|Wooden cities under a wide sky.|
ar_engines|The Engine Problem|armyair|build engines 2; res 15|Two thousand horsepower, on paper.|
ar_heavy|A Heavy Fighter|ar_engines,homeair|tech m_air3; equip aircraft 150|Something to reach the bombers.|date 1943-1
special|Special Attack Units|elite,masspilots,homeair|spirit Divine Wind: navy .12, air -.05|A weapon of desperation.|req majorwar
riken|Institute of Physical Research|airarms|build university 2; res 25; spirit Research Institute: research .05, proj .1|A private foundation with a cyclotron.|
locators|Radio Locators|riken|tech m_radar; proj 30|An antenna invented here and ignored here.|
nuclear|Nuclear Research|riken|res 20; proj 40|Two rival projects, one per service.|date 1941-1
sc_medicine|Tropical Medicine|riken|tech s_medicine; spirit Field Hygiene: supply .05|Quinine and water purification.|
rocket|Rocket Interceptors|locators|proj 30; res 15|Plans carried from Europe by submarine.|date 1944-1
balloons|Balloon Bombs|nuclear|spirit Stratospheric Balloons: bombing .1|Paper, lacquer and the jet stream.|
`);

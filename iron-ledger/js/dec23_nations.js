// 2.3 Unique decisions: every other nation of 1936.
'use strict';
autoDecisions(`
# POL | The Second Republic
cop|The Central Industrial Region|60|build steel 1, arms 1, chem 1; money -4|Steelworks at Stalowa Wola, far from both borders, in the triangle of the Vistula and the San.|once; ai 0.4
bridgehead|The Romanian Bridgehead|30|ws 5; legit 5|Fall back to the south-east corner, where Romania keeps the road open to the sea and the exile.|once; req polWar & lost Warsaw,Kraków,Łódź; ai 0.6; urgent
enigma|Share the Enigma Secret|20|rel ENG 25, FRA 25; res 15|Three young mathematicians hand the British and the French a working copy of the German machine.|once; date 1939-7; ai 0.5
warsawdef|Defend Warsaw|30|dig 365 Warsaw; spawn mil 3 Warsaw|The mayor calls the city to dig: barricades in every street.|once; req polWar & near Warsaw; ai 0.8; urgent
# CZE | The Czechoslovak Republic
benes|The Czechoslovak Wall|60|dig 9999 Karlsbad,Reichenberg,Pilsen,Brno; money -4|Ten thousand bunkers in the Sudeten mountains, built to the French pattern.|once; date 1936-6; ai 0.4
skoda|Expand the Škoda Works|50|build arms 1, artyf 1|The arsenal of Central Europe sells to Romania, Yugoslavia and anyone who pays.|once; ai 0.3
fight|Mobilise and Fight|40|ws 15; units inf 4|The army is ready in the mountains. The government decides to use it, alone if need be.|once; req tension 60; ai 0.1
# AUT | The Federal State
heimat|The Fatherland Front Rally|30|stab 3; legit 3|Red-white-red flags and the crutch cross: Austria is not a German province.|cd 365; ai 0.2
gold|Ship the Gold to London|20|money 4; rel ENG 10|Before the Germans can take it, the national bank's gold is lent where it is safe.|once; req tension 50; ai 0.1
plebiscite|Call the Plebiscite|40|legit 8; ws 10; tension 3|Schuschnigg asks the people to vote for a free, German, independent, social, Christian and united Austria.|once; date 1938-1; ai 0.1
# HUN | The Kingdom
gyor|The Győr Programme|60|build arms 1, aircraftp 1; money -4|A billion pengő for rearmament, announced in a provincial town.|once; date 1938-3; ai 0.4
revision|Justice for Hungary|30|infl 30; ws 5|The press baron Rothermere's campaign: the borders of Trianon must be revised.|cd 730; ai 0.2
kallay|The Kállay Double Game|40|rel ENG 15, USA 10; stab -2|Secret envoys in Istanbul and Lisbon look for a way out of Hitler's war.|once; req year 1942 & war; ai 0.3
# ROM | Greater Romania
carolline|The Carol Line|50|dig 9999 Chișinău,Iași,Czernowitz,Galați|A belt of fortifications along the Prut, facing the Soviet Union.|once; date 1938-1; ai 0.3
ploiesti|Guard the Oil Fields|40|dig 9999 Ploiești; spawn inf 1 Ploiești|Anti-aircraft guns, smoke generators and a German air division over the refineries.|once; req war; ai 0.5
iron|Ban the Iron Guard|40|rad -0.06; stab -2; legit 2|The Legionaries are rounded up; Codreanu is shot "while trying to escape".|once; req ideo aut; ai 0.2
# YUG | The Kingdom
sporazum|The Agreement with the Croats|50|stab 6; legit 4|Cvetković and Maček create a Croatian banovina: Belgrade gives up power to keep the state together.|once; date 1939-1; ai 0.4
coup|The Belgrade Coup|30|ws 15; rel GER -40, ENG 30|Officers overthrow the regent the night after he signs the Tripartite Pact. Better war than the pact.|once; req year 1941 & ideo fas; ai 0.1
mountains|Retreat into the Mountains|30|units mil 4; ws 5|The army becomes guerrillas: Bosnia, Montenegro and the Šumadija.|once; req war & lost Belgrade,Zagreb; ai 0.6
# BUL | The Tsardom
neutral|Boris's Careful Neutrality|30|stab 3; rel GER 5, ENG 5, SOV 5|The Tsar promises everybody something and nobody everything.|cd 730; ai 0.2
jews|Refuse the Deportations|30|legit 6; rel GER -15, USA 10|The Church, the parliament's vice-president and ordinary people stop the trains.|once; req gerFriend & year 1943; ai 0.4
# GRE | The Kingdom
metaxas|The Metaxas Line|50|dig 9999 Salonika,Kavala,Alexandroupoli|Bunkers along the Bulgarian border, from the Struma to the Nestos.|once; ai 0.3
ochi|Answer: No|20|ws 20; stab 3|At three in the morning, the Italian ambassador demands passage. Metaxas answers: No.|once; req atwar ITA; ai 0.9; urgent
crete|Hold Crete|30|dig 365 Heraklion; spawn inf 2 Heraklion|The island will be the last line: British, Australians, New Zealanders and Cretans together.|once; req war & lost Athens,Salonika; ai 0.6
# ALB | The Kingdom
zog|King Zog's Treasury|20|money 3; stab 2|The King's gold, the King's guard, and the King's flight plan.|once; ai 0.2
mountains|The Mountain Bands|30|units mil 2; ws 5|Every clan has rifles and every valley has a hiding place.|once; req war; ai 0.5
# TUR | The Republic
straits|Remilitarise the Straits|40|dig 9999 Istanbul,Edirne; tension 2|At Montreux the powers agree: Turkey may fortify the Bosporus and the Dardanelles again.|once; date 1936-7; ai 0.5
hatay|The Hatay Question|50|infl 30; rel FRA -10|The Sanjak of Alexandretta is Turkish. France needs Turkey more than the Sanjak.|once; date 1938-6; ai 0.3
village|Village Institutes|40|res 15; stab 2; spirit Village Institutes [9999]: literacy .05|Peasant children trained as teachers, sent back to teach the villages.|once; date 1940-4; ai 0.3
varlik|The Wealth Tax|30|money 10; stab -4; legit -4|A capital levy set by local committees, falling hardest on Greeks, Armenians and Jews.|once; req year 1942; ai 0.2
# SPA | Spain
alcazar|Hold the Alcázar|20|dig 365 Toledo; heal 5|A thousand defenders in the fortress above Toledo will not surrender.|once; req spWar & near Toledo; ai 0.5
noPasaran|No Pasarán|30|dig 365 Madrid; units mil 3; ws 10|Madrid will be the tomb of fascism: the whole city digs trenches in the Casa de Campo.|once; req spWar & near Madrid; ai 0.8; urgent
gold|The Moscow Gold|20|money 15; rel SOV 30; legit -5|Five hundred tonnes of the Bank of Spain's gold shipped to Odessa for safekeeping, and for arms.|once; req spWar & spRep; ai 0.4
hendaye|Meet at Hendaye|30|rel GER 10; ws -3; stab 3|Franco talks for nine hours and promises nothing. Hitler would rather have teeth pulled.|once; req year 1940 & spPeace; ai 0.5
bluediv|Send the Blue Division|30|rel GER 20, ENG -15; units inf 1|Falangist volunteers to fight Communism in Russia, and to pay Spain's debt to Berlin.|once; req gerSovWar & spPeace; ai 0.3
# POR | The New State
salazar|Balance the Budget|30|money 6; stab 2|The professor of finance from Coimbra keeps the books, and keeps them balanced.|cd 730; ai 0.3
azores|Lease the Azores Bases|30|rel ENG 25, USA 20; money 4|Invoking the alliance of 1373, Salazar lets the Allies use the islands.|once; req year 1943 & engAtWar; ai 0.4
wolfram|Wolfram Prices|20|money 8; rel GER 5, ENG -5|Tungsten for German shells, sold at war prices to both sides.|cd 365; req gerWar; ai 0.4
# IRE | Éire
emergency|The Emergency|30|ws 5; stab 3; units mil 2|Neutral in the war, which Ireland calls the Emergency: censorship, rationing and the Local Defence Force.|once; req engAtWar; ai 0.5
ports|The Treaty Ports|30|rel ENG -10; legit 5|Britain hands back Cobh, Berehaven and Lough Swilly: the guarantee of Irish neutrality.|once; date 1938-4; ai 0.4
# BEL | Belgium
kwlinie|The KW Line|50|dig 9999 Antwerp,Brussels; money -3|Anti-tank obstacles between Koningshooikt and Wavre, the line the Allies are to come to.|once; date 1939-1; ai 0.3
eben|Fortify Eben-Emael|30|dig 9999 Liège|The strongest fort in the world overlooks the Albert Canal.|once; ai 0.4
# HOL | The Netherlands
grebbe|Man the Grebbe Line|40|dig 9999 Utrecht,Amsterdam,Rotterdam|Behind the inundations of the Gelderse Vallei, the army waits.|once; req tension 60; ai 0.4
oil|Destroy the Indies Oil|20|oilfire 730 Palembang,Balikpapan|Before the Japanese arrive, the wells are blown and the refineries burnt.|once; req near Palembang,Balikpapan & atwar JAP; ai 0.8; urgent
# LUX | Luxembourg
schuster|The Schuster Line|20|dig 9999 Luxembourg|Concrete barriers on the frontier roads with Germany: not much, but something.|once; date 1939-1; ai 0.4
# SWI | The Confederation
reduit|The National Redoubt|40|dig 9999 Bern; spirit Réduit National [9999]: def .15, entrench .1|Give up the plateau and hold the Alps: the army will fight from the mountains.|once; req tension 60; ai 0.6
bank|Discreet Banking|20|money 6; infl 10|Gold from every side passes through Bern. Nobody asks where it comes from.|cd 365; req war; ai 0.4
guisan|The Rütli Report|30|ws 10; stab 4|General Guisan gathers his officers on the meadow where the Confederation was sworn.|once; req franceDown; ai 0.6
# DEN | Denmark
butter|Bacon and Butter for Britain|20|money 4; rel ENG 5|The pigs and the dairies of Jutland feed London's breakfast.|cd 365; req peace; ai 0.2
boats|The Little Boats to Sweden|30|legit 8; rel SWE 10, USA 5|Fishermen ferry seven thousand Jews across the Sound in October nights.|once; req denFallen & year 1943; ai 0.5
# NOR | Norway
gold|Save the Gold|20|money 6; legit 4|Fifty tonnes of gold by lorry, train and fishing boat, one step ahead of the Germans.|once; req near Oslo; ai 0.7; urgent
coast|Coastal Fortresses|40|dig 9999 Oslo,Bergen,Narvik|Oscarsborg's old guns still guard the Oslofjord.|once; req tension 60; ai 0.4
# SWE | Sweden
ore|Expand Kiruna|40|build ironm 2|More shafts in the mountain of iron, more trains to Narvik and Luleå.|once; ai 0.4
readiness|Readiness|40|units inf 4; spirit Readiness [730]: def .08|The beredskap: a hundred thousand men on the borders in all directions.|once; req tension 60; ai 0.5
# FIN | Finland
mannerheim|The Mannerheim Line|50|dig 9999 Viipuri,Sortavala; money -3|Concrete and granite across the Karelian Isthmus.|once; date 1937-1; ai 0.5
motti|Motti Tactics|30|spirit Motti [365]: atk .08, def .05|Ski troops cut the road-bound columns into pieces and destroy them one by one.|once; req atwar SOV; ai 0.8; urgent
molotov|Molotov Cocktails|20|equip arms 60; ws 5|The state liquor monopoly fills bottles with petrol and kerosene: "a drink for Molotov".|once; req atwar SOV; ai 0.6
# EST | Estonia
neutral|Declare Strict Neutrality|20|stab 3; legit 3|Estonia will be neutral, and it says so in every capital.|once; ai 0.3
forest|The Forest Brothers|30|units mil 2; ws 5|The men go into the woods rather than into the Red Army.|once; req war; ai 0.4
# LAT | Latvia
ulmanis|The Ulmanis Economy|30|build farm 1; stab 2|A leader's regime of cooperatives, dairies and national pride.|once; ai 0.3
riga|Fortify Riga|30|dig 9999 Riga|The old fortress of Daugavgrīva and new trenches along the river.|once; req tension 60; ai 0.3
# LIT | Lithuania
memel|Keep Memel|30|dig 9999 Memel; ws 5|Lithuania's only port, and Germany wants it back.|once; ai 0.3
vilnius|The Vilnius Question|30|infl 20; rel POL -10|Vilnius is the capital, even if Poland holds it.|cd 730; ai 0.2
# SAF | The Union
smuts|Smuts Takes the Union to War|30|ws 10; stab -3|Parliament votes eighty to sixty-seven: South Africa fights with Britain.|once; req engAtWar; ai 0.6
gold|The Rand's Gold|20|money 8|The deepest mines in the world pay for the war.|cd 365; ai 0.4
# AST | The Commonwealth
brisbane|The Brisbane Line|40|dig 9999 Brisbane,Sydney,Melbourne|If the Japanese come, the north will be given up and the south defended.|once; req atwar JAP; ai 0.4
kokoda|Hold the Kokoda Track|30|dig 365 Port Moresby; spawn inf 2 Port Moresby|Militiamen on a muddy path over the Owen Stanley Range.|once; req atwar JAP & near Buna,Lae,Port Moresby; ai 0.7; urgent
# NZL | New Zealand
reinforce|Send the Second Expedition|20|units inf 2; ws 4|The Second New Zealand Expeditionary Force sails for Egypt.|once; req engAtWar; ai 0.5
coast|Home Defence|30|dig 9999 Auckland,Wellington|Coastal guns and an army of farmers against a Japanese landing.|once; req atwar JAP; ai 0.5
# CAN | The Dominion
bcatp|The Air Training Plan|40|spirit Air Training Plan [9999]: air .05; rel ENG 15|Pilots from the whole Commonwealth learn to fly over the prairies.|once; req engAtWar; ai 0.6
victoryloan|Victory Loans|30|money 8; ws 3|Twelve billion dollars raised in Victory Bond drives.|cd 365; req war; ai 0.4
# RAJ | The Raj
civdef|Air Raid Precautions in Calcutta|20|spirit ARP [365]: civdef .1|Trenches and sirens: Japanese bombers are in range of Calcutta.|once; req atwar JAP; ai 0.4
imphal|Fortify Imphal and Kohima|40|dig 9999 Imphal,Kohima; spawn inf 2 Imphal|The hills of Assam are the gate to India.|once; req atwar JAP & near Imphal,Myitkyina,Mandalay,Akyab; ai 0.7; urgent
famine|Famine Relief for Bengal|40|relief Calcutta,Dacca,Chittagong; money -6; stab 4|Ration cards, grain from Punjab and the army's lorries, too late for millions.|cd 365; req year 1943; ai 0.5
# EGY | The Kingdom
canal|Defend the Canal|40|dig 9999 Suez,Port Said; spawn inf 1 Suez|The Suez Canal: the jugular of the Empire.|once; req war; ai 0.4
alamein|The Alamein Line|40|dig 730 El Alamein; mines 730 El Alamein|Between the sea and the Qattara Depression, the desert narrows to forty miles.|once; req near Mersa Matruh,El Alamein; ai 0.8; urgent
# ETH | The Empire
geneva|Appeal to Geneva|20|infl 30; rel ENG 10, FRA 10|The Emperor speaks to the League: "It is us today. It will be you tomorrow."|once; req atwar ITA; ai 0.6
arbegnoch|The Patriots|30|units mil 3; ws 10|The arbegnoch, the patriots, fight on in the highlands.|once; req atwar ITA & lost Addis Ababa; ai 0.7
# IRQ | The Kingdom
golden|The Golden Square|30|ws 5; rel GER 15, ENG -20|Four colonels and Rashid Ali want the British out of Iraq.|once; req year 1941; ai 0.2
kirkuk|Develop Kirkuk|40|build oilr 1|The Iraq Petroleum Company's pipeline runs to Haifa and Tripoli.|once; ai 0.3
# PER | Iran
railway|The Trans-Iranian Railway|50|build railway 2; infra 1|From the Caspian to the Gulf, through two hundred tunnels.|once; ai 0.3
abadan|Abadan Refinery|30|build oilr 1; rel ENG 10|The largest refinery in the world, run by the Anglo-Iranian Oil Company.|once; ai 0.3
# SAU | The Kingdom
dammam|Dammam No. 7|30|build oilr 1; money 4|After six dry wells the Americans strike oil in commercial quantities.|once; date 1938-3; ai 0.4
ikhwan|The King's Tribes|20|units mil 2; stab 3|Ibn Saud's bedouin levies swear loyalty again.|cd 730; ai 0.2
# YEM | The Mutawakkilite Kingdom
imam|The Imam's Isolation|20|stab 3; legit 3|No roads, no foreigners and no debts: the Imam keeps Yemen closed.|cd 730; ai 0.2
# AFG | The Kingdom
neutral|The Loya Jirga Declares Neutrality|20|stab 3; legit 3|The great assembly of the tribes decides Afghanistan will not take sides.|once; req war; ai 0.4
# NEP | The Kingdom
gurkhas|Gurkha Recruitment|20|money 4; rel ENG 15|Nepal's young men join the Gurkha regiments of the British army.|cd 365; ai 0.3
# TIB | Tibet
monks|The Monastery Militias|20|units mil 1; stab 2|The great monasteries arm their monks.|cd 730; ai 0.2
# SIK | Sinkiang
sovaid|Soviet Advisers|20|rel SOV 15; units inf 1|Sheng Shicai's warlord state lives on Soviet arms and Soviet advisers.|once; ai 0.3
# MON | The People's Republic
khalkhin|Hold the Khalkhin Gol|30|dig 365 Tamsag Bulag; rel SOV 10|The Soviet army and ours, on the river line against the Japanese.|once; req atwar JAP; ai 0.6
# MAN | Manchukuo
kwantung|The Kwantung Army's Development Plan|50|build steel 1, coalm 1|Five years, five plans: Manchuria will be the factory of the Empire.|once; ai 0.4
colonists|Japanese Settlers|30|popgrow 1; stab -2|A million farm households are to be settled on Chinese land.|once; ai 0.2
# PRC | The Communist Party
baseareas|Expand the Base Areas|30|units mil 2; ws 5|Behind the Japanese lines, the Eighth Route Army organises the villages.|cd 365; req chiJapWar; ai 0.5
yanan|The Yan'an Rectification|40|stab 6; legit 4; rad 0.02|Self-criticism sessions until every cadre thinks like the Chairman.|once; date 1942-2; ai 0.4
hundred|The Hundred Regiments Offensive|40|spirit Hundred Regiments [120]: atk .1|Four hundred thousand men strike the railways of north China at once.|once; req chiJapWar & year 1940; ai 0.4
# GXC | The Guangxi Clique
militia|The Guangxi Militia System|30|units mil 3; mp 40|Every man in Guangxi trains with the militia: the model province.|once; ai 0.4
# YUN | The Yunnan Clique
burmaroad|Build the Burma Road|40|build railway 1; money 3|Two hundred thousand labourers cut a road over the mountains to Lashio.|once; req chiJapWar; ai 0.5
# SHX | The Shanxi Clique
model|The Model Governor|30|build coalm 1, steel 1|Yan Xishan runs Shanxi like a company, with its own narrow-gauge railways.|once; ai 0.4
# XSM | The Ma Clique
cavalry|Hui Cavalry|20|units cav 2|The Muslim horsemen of the north-west.|cd 730; ai 0.3
# SIC | The Sichuan Clique
rice|Sichuan Rice for the Front|20|money 3; stab 2|The rice bowl of China feeds the government in Chongqing.|cd 365; req chiJapWar; ai 0.3
# PHI | The Commonwealth
army|The Philippine Army Plan|40|units inf 2; mp 30|MacArthur's plan: ten years to build an army of reservists.|once; ai 0.4
bataan|Withdraw to Bataan|30|dig 365 Manila; heal 10|War Plan Orange: hold the peninsula and Corregidor until the fleet comes.|once; req atwar JAP & near Manila,Lingayen,Legazpi; ai 0.8; urgent
# SIA | Siam
phibun|Thai Cultural Mandates|30|stab 3; legit 3|Siam becomes Thailand: trousers, hats and the national anthem at eight in the morning.|once; date 1939-6; ai 0.4
seri|The Free Thai Movement|30|rel USA 20, ENG 15; legit 4|The ambassador in Washington refuses to deliver the declaration of war.|once; req atwar ENG; ai 0.4
# LIB | Liberia
firestone|The Firestone Concession|20|build rubberp 1; money 3|A million acres of rubber, leased to an American tyre company.|once; ai 0.3
# MEX | The United Mexican States
oil|Nationalise the Oil|50|build oilr 1; ig ind -5, union 5; rel USA -15, ENG -15|Cárdenas expropriates the foreign oil companies. The whole country chips in to pay compensation.|once; date 1938-3; ai 0.5
squadron|Squadron 201|20|rel USA 15; ws 3|The Aztec Eagles fly P-47s over the Philippines.|once; req atwar JAP; ai 0.4
# BRA | The New State
volta|Volta Redonda|50|build steel 2|The Americans finance a steel mill in exchange for bases on the bulge of Brazil.|once; date 1941-1; ai 0.5
feb|The Brazilian Expeditionary Force|30|units inf 2; rel USA 15|"The snake will smoke": Brazilians fight in Italy.|once; req atwar GER; ai 0.4
# ARG | The Republic
neutral|Neutrality and Beef|20|money 6; rel ENG 5|Argentina feeds Britain and stays out of the war.|cd 365; req engAtWar; ai 0.4
goi|The Colonels' Lodge|30|rad 0.03; legit -3; stab 2|The GOU, a secret society of officers, waits for its moment.|once; date 1943-1; ai 0.2
# CHL | The Republic
copper|Copper Contracts|20|money 5|Chuquicamata's copper for American shells.|cd 365; ai 0.3
# COL | The Republic
scadta|Nationalise SCADTA|20|rel USA 10, GER -10|The German pilots of Colombia's airline are replaced, near the Panama Canal.|once; date 1940-1; ai 0.4
# VEN | The Republic
maracaibo|Maracaibo Oil|30|build oilr 1; money 3|Lake Maracaibo bristles with derricks.|once; ai 0.4
# PRU | The Republic
marañon|The Marañón Campaign|30|ws 5; tension 1|The border war with Ecuador.|once; ai 0.1
# BOL | The Republic
standard|Seize Standard Oil|30|build oilr 1; rel USA -10|After the Chaco War, Bolivia takes the American wells.|once; ai 0.3
# PAR | The Republic
chaco|Veterans of the Chaco|20|axp 10; stab 2|The army that won the Chaco War remembers how.|once; ai 0.3
# URU | The Republic
grafspee|The Graf Spee at Montevideo|10|infl 20; rel ENG 10|The German raider is given seventy-two hours to leave the harbour.|once; req engAtWar; ai 0.4
# ECU | The Republic
galapagos|Lease the Galápagos Bases|20|money 3; rel USA 10|An American airfield on Baltra guards the Panama Canal.|once; req atwar JAP; ai 0.4
# CUB | The Republic
sugar|The Sugar Quota|20|money 4; rel USA 5|Washington buys the harvest at a fixed price.|cd 365; ai 0.3
# HAI | The Republic
rubber|SHADA Rubber Plantations|20|build rubberp 1; rel USA 5|American money plants rubber, and evicts the farmers.|once; req war; ai 0.3
# DOM | The Republic
trujillo|The Benefactor's Works|20|stab 3; legit -2|Monuments, roads and a capital renamed Ciudad Trujillo.|once; ai 0.3
# GUA | The Republic
ubico|Ubico's Roads|20|infra 1; stab 1|Vagrancy laws send peasants to build roads for free.|once; ai 0.3
# HON | The Republic
banana|The Banana Concessions|20|money 3; rel USA 5|United Fruit runs the north coast.|cd 365; ai 0.3
# ELS | The Republic
coffee|Coffee Prices|20|money 3|The fourteen families sell their coffee to America.|cd 365; ai 0.3
# NIC | The Republic
guard|The National Guard|20|units mil 1; stab 2|Somoza's Guard is the state.|once; ai 0.3
# COS | The Republic
reform|Social Guarantees|20|stab 3; ig union 4|Calderón's labour code and social security.|once; date 1940-1; ai 0.3
# PAN | The Republic
canalzone|Canal Zone Defence Sites|20|money 4; rel USA 10|American bases across the isthmus.|once; req war; ai 0.4
`);

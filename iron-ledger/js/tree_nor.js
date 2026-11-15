// Norway (2.2): hand-written. Nygaardsvold's Labour Norway; neutral waters, worked through the neutrality watch; the
// defence of April 1940; the heavy water of Vemork and the merchant fleet that is the largest in the world after three
// great powers'; the King's No and the government in London; the Home Front under occupation; Quisling's Norway; the
// Arctic and the far south; and the Norway that is rebuilt.
'use strict';
TREES.NOR = autoTree('no_', `
# Labour's Norway
labour|The Nygaardsvold Government||pp 30; stab 3|A former sawmill worker from Hommelvik leads the first Labour government that lasts.|ai 6
crisisdeal|The Crisis Agreement|labour|ig rural 8; stab 2; spirit The Crisis Agreement: farm_out .04, stab 2|1935: Labour and the Farmers' Party agree on prices for the farmer and work for the unemployed.|
basicagree|The Basic Agreement|labour|ig union 5, ind 5; stab 3; spirit The Basic Agreement: output .03|The LO and the employers' federation write down the rules of collective bargaining: the "constitution of working life".|
election36|The Election of 1936|labour|legit 5; pp 20|October 1936: Labour wins 42.5 per cent, its best result yet.|date 1936-10
oldage|Old-Age Pensions|election36|stab 3; money -4|1936: a pension for every Norwegian over seventy, as of right.|
workerslaw|The Workers' Protection Act|basicagree|ig union 5; stab 2|An eight-hour day, safety inspectors and two weeks' holiday.|
unempins|Unemployment Insurance|oldage|unemp -2; stab 2; money -3|1938: insurance against the slump for every industrial worker.|date 1938-1
tranmael|Tranmæl's Arbeiderbladet|labour|pp 10; ideo dem 3|Martin Tranmæl, who once wanted a Norwegian soviet, now edits the paper of the governing party.|
gerhardsen|Gerhardsen of Oslo|tranmael|leader Einar Gerhardsen/Labour Party; pp 20|The road worker who becomes mayor of Oslo, then a prisoner at Sachsenhausen, then Prime Minister for seventeen years.|date 1945-6
trotsky|The Trotsky Affair|labour|pp 10 ?? Expel him to Mexico => rel SOV 15; legit -3 // Let him stay => rel SOV -20; legit 3|Leon Trotsky has lived near Hønefoss since 1935. Moscow threatens to stop buying Norwegian herring.|date 1936-12
roads|Roads for the West Country|crisisdeal|build railway 1; unemp -2; infra 1|Roads and ferries along the fjords, built by men who had no work.|
fisheries|Help for the Fishermen|crisisdeal|ig rural 4; money -2; stab 2|Minimum prices for herring and cod, and loans for new boats.|
housing|The Housing Bank|oldage|build urban 1; stab 1|Cheap loans for workers' houses in Oslo and Bergen.|
cooperation|Labour and the Farmers|crisisdeal,basicagree|stab 3; legit 3|The red-green alliance keeps the government in office until the war.|
radio|The Broadcasting Company|labour|pp 10; ws 2|NRK reaches the islands of the north and the farms of the valleys.|
wholepeople|The Whole People at Work|gerhardsen|unemp -4; spirit The Whole People at Work: output .04, stab 3|The joint programme of 1945: every party agrees on rebuilding the country first.|date 1945-6
# Neutral Waters
koht|Halvdan Koht at the Foreign Ministry|labour|pp 15; nowatch 5|A historian at the Foreign Ministry, sure that Norway can stay out of a great war as it did the last one.|ai 6
neutralrules|The Nordic Neutrality Rules|koht|nowatch 5; rel SWE 10, DEN 10|1938: the northern kingdoms publish the same rules for belligerent ships in their waters.|date 1938-5
patrols|The Neutrality Watch|neutralrules|nodo patrol|Torpedo boats and old minelayers patrol the Leads day and night.|
coastforts|The Coastal Forts|patrols|fort Oslo, Bergen, Kristiansand, Trondheim|Guns from the 1890s at Oscarsborg, Kvarven and Odderøya, manned at last.|
narvikguard|Guard the Ore Port|patrols|fort Narvik; nowatch 5|The coastal defence ships Eidsvold and Norge lie at anchor in Narvik.|
cityofflint|The City of Flint|koht|nowatch 5; rel USA 10 ?? Intern the German prize crew => rel GER -10; rel USA 10 // Let it sail on => rel GER 5|October 1939: a German crew brings a captured American freighter into Haugesund. Norway frees the ship.|date 1939-11
tonnage|The Tonnage Agreement|koht|seaton -2; money 6; rel ENG 15, GER -10|November 1939: Norway charters much of its fleet to Britain, which promises not to blockade Norway.|date 1939-11
charter|Charter More Ships|tonnage|nodo charter|More tankers and freighters sail under British charter.|
altmark|The Altmark Incident|patrols|stab -2 ?? Protest to London => rel ENG -10; nowatch 5 // Protest to Berlin => rel GER -10|February 1940: British destroyers board a German prison ship in Jøssingfjord and free three hundred British sailors.|date 1940-2
mineleads|Mine Our Own Waters|altmark|nodo mine|Close the Leads to the German ore ships ourselves, before someone else does it for us.|
protest|Protest to Both Sides|altmark|legit 3; nowatch 3|Notes to London and Berlin every week.|
oslostates|The Oslo States|koht|trade SWE, DEN, HOL, BEL, FIN; rel HOL 5, BEL 5|The small democracies of the north and the west stand together, at least on trade.|
sanctions|No More Sanctions|oslostates|pp 10 ?? Declare ourselves free of League sanctions => nowatch 5 // Stay loyal to Geneva => legit 3; rel ENG 5|July 1936: after Abyssinia, Norway no longer feels bound by Article Sixteen.|date 1936-7
nobelpeace|The Peace Prize|koht|legit 3; rel FRA 5, ENG 5|1936: the Nobel committee in Oslo gives the prize to Carl von Ossietzky, a prisoner in a German camp. Göring is furious.|date 1936-11
ossietzky|After Ossietzky|nobelpeace|rel GER -15; ws 3|Hitler forbids Germans to accept any Nobel prize.|
finlandhelp|Help for Finland|koht|rel FIN 15; ws 2|Volunteers, ambulances and collections for Finland in the Winter War.|req finWinter
wilfred|Operation Wilfred|mineleads|stab -2 ?? Protest the British mines => rel ENG -10; nowatch 5 // Quietly accept them => rel ENG 5; rel GER -10|8 April 1940: British destroyers lay mines off Bodø. The next morning the German fleet is in the fjords.|date 1940-4
navalreserve|Call Up the Naval Reserve|patrols|nowatch 10; units mil 1|Fishermen and whalers in naval uniform for the guard ships.|
lighthouses|Darken the Coast|patrols|nowatch 5; stab -1|Lighthouses are dimmed and buoys removed, so that no one can use our waters at night.|
intern|Intern the Fugitives|patrols|legit 2|Belligerent sailors and airmen who reach our shores are interned until the end of the war.|
neutralconvoy|Escorted Neutrals|tonnage|seaton 1; rel ENG 5|Norwegian ships join the British convoys from Bergen to Methil.|
# The Defence of Norway
budget|The Defence Budget|labour|units inf 1; money -3|Labour was elected on a broken rifle; now it orders new ones.|
rearm|Rearmament at Last|budget|units inf 2; equip arms 300; build arms 1|1937: the defence budget doubles, from almost nothing.|date 1937-6
oscarsborg|The Guns of Oscarsborg|coastforts|fort Oslo; spirit Oscarsborg Fortress: def .05|An old fort, Krupp guns from 1893 and torpedoes in the rock: enough to stop a cruiser in the narrows.|
blucher|Sink the Blücher|oscarsborg|ws 8; spirit The Blücher Sunk: def .05, ws 4|9 April 1940: Colonel Eriksen fires on the heavy cruiser bringing the German administration to Oslo. It sinks in the fjord.|date 1940-4; req atwar GER
ruge|General Ruge|rearm|generals Otto Ruge/3/def, Carl Gustav Fleischer/3/mtn|The two generals who will fight for two months in the mountains and at Narvik.|
midtskogen|The Battle of Midtskogen|ruge|ws 6; legit 3|The night of 9 April: Royal Guards and rifle club volunteers stop the German paratroopers sent to seize the King.|req atwar GER
mountains|Mountain Troops|ruge|units mtn 2; spirit Mountain Infantry: def .06|Ski battalions for a country that is mostly mountain.|
narvik|The Battle for Narvik|mountains|ws 6; rel ENG 10, FRA 10, POL 10|May 1940: Norwegian, French, Polish and British troops retake Narvik, and then have to leave it.|req atwar GER
mobilise|Mobilisation by Post|budget|units inf 3 ?? Mobilise in time => units inf 2; stab -1 // Mobilise by letter, as the law says => stab 1|The government orders a "silent mobilisation" by post on the morning the Germans land.|
airservice|The Army Air Service|budget|equip aircraft 40; build aircraftp 1|Gloster Gladiators and Fokker reconnaissance planes.|
navyfleet|The Old Fleet|budget|equip ships 3|Two coastal defence ships, a handful of destroyers and torpedo boats from the last war.|
shipguns|New Destroyers|navyfleet|equip ships 3; build shipyard 1|The Sleipner-class destroyers from Horten.|
reserves|The Reserve Battalions|mobilise|units mil 3; ws 2|Old men and boys with rifle-club Krag-Jørgensens.|
fortgold|Save the Gold|ruge|money 8; legit 3|Fifty tons of gold leave Oslo by lorry and train on 9 April, a step ahead of the Germans, for the coast and then America.|req atwar GER
krag|New Rifles|rearm|equip arms 300|Krag-Jørgensens for the reserves and Madsen guns for the companies.|
kongsberg|The Kongsberg Arms Works|rearm|build arms 1|The state arms factory, founded beside the silver mines in 1814.|
raufoss|Raufoss Munitions|kongsberg|build arms 1; equip arms 200|Cartridges and shells from the factory on Lake Mjøsa.|
fieldguns|Field Guns|kongsberg|build artyf 1; equip artillery 40|New guns for the field artillery, ordered at last.|
hawks|Curtiss Hawks from America|airservice|equip aircraft 60; rel USA 5|Autumn 1939: fighters ordered from Buffalo, still in their crates when the Germans come.|date 1939-10
horten|The Horten Navy Yard|navyfleet|build shipyard 1|The naval base at the mouth of the Oslofjord.|
officers|The Officers' Corps|ruge|generals Jacob Hvinden Haug/3/def; spirit The Staff College: org .03|Officers who have studied the last war and fear the next.|
skischools|The Ski Schools|mountains|spirit Ski Troops: atk .03, def .03|Every recruit learns to fight on skis.|
hegra|Hegra Fortress|coastforts|fort Trondheim; ws 4|Two hundred and fifty volunteers in an old fort hold out until the fifth of May.|req atwar GER
dombas|The Paratroopers at Dombås|midtskogen|ws 3|April 1940: Norwegian troops capture a whole German parachute company in the Gudbrandsdal.|req atwar GER
tromsocap|Tromsø, Capital of the North|narvik|capital Tromsø; legit 2|May 1940: with Oslo lost, the King and the government govern from Tromsø.|req atwar GER
gratangen|Gratangen|narvik|ws 2; units mtn 1|A battalion is overrun in the snow at Gratangen; the next day the Norwegians attack again.|req atwar GER
evacuation|The Evacuation|tromsocap|legit 3; units inf -1|June 1940: the Allies leave Narvik for France. Norway's army must lay down its arms; its government sails for England.|req atwar GER
# Heavy Water
hydro|Norsk Hydro||money 6; build chem 1|The nitrogen works at Rjukan and Notodden, driven by waterfalls, make fertiliser for half of Europe.|ai 5
vemork|The Vemork Plant|hydro|hw 20; hwrate 2|The biggest power station in the world also makes, as a by-product, almost all of the world's heavy water.|
deuterium|More Electrolysis Cells|vemork|hwrate 4; money -3|A new cascade of cells in the basement at Vemork, ordered by chemists from half a dozen countries.|
tronstad|Leif Tronstad|vemork|res 15; hw 10|The chemistry professor in Trondheim who designed the heavy-water plant, and who knows what it is for.|
frenchbuy|The French Purchase|deuterium|hwsell FRA|March 1940: agents of the Deuxième Bureau buy the entire stock, 185 kilograms, and fly it out in milk churns by way of Scotland.|date 1940-2
britishbuy|Sell to Britain|deuterium|hwsell ENG|Imperial Chemical Industries would like every kilogram we can make.|
americanbuy|Sell to America|deuterium|hwsell USA|Columbia University wants heavy water for Fermi's experiments.|
germanbuy|Sell to IG Farben|deuterium|hwsell GER|IG Farben owns a quarter of Norsk Hydro, and asks for far more heavy water than any laboratory needs.|ai 1
fertiliser|Saltpetre for the World|hydro|money 4; spirit Norwegian Saltpetre: farm_out .03|Norway saltpetre on the fields of Denmark, Germany and Egypt.|
alu|Aluminium from the Fjords|hydro|build steel 1; money 3|Høyanger and Årdal smelt bauxite with power that costs almost nothing.|
whitecoal|White Coal|hydro|build power 2|Norway has more water power for each of its people than any country on earth.|
heroya|The Herøya Light Metals|alu|build steel 1; money 2 ?? Build it with the Germans => rel GER 10; build steel 1 // Refuse them => rel GER -10; stab 1|The Germans plan the biggest aluminium and magnesium works in Europe on the Herøya peninsula.|req norFallen
grouse|Operation Grouse|tronstad|rel ENG 10; ws 3|October 1942: four Norwegian commandos parachute onto the Hardanger plateau and live on moss and reindeer through the winter.|date 1942-10; req norFallen
freshman|Operation Freshman|grouse|rel ENG 5; ws -2|November 1942: two British gliders carrying sappers crash in the mountains; the survivors are shot.|date 1942-11; req norFallen
gunnerside|Operation Gunnerside|grouse|hwsab gunnerside; ws 6|February 1943: nine men ski down the gorge, climb to the plant, set their charges and leave without a shot fired.|date 1943-2; req norFallen
vemorkbomb|The Bombing of Vemork|gunnerside|hwrate -2; stab -2|November 1943: American bombers hit the plant, and twenty-one civilians die at Rjukan.|date 1943-11; req norFallen
ferry|The Ferry on Lake Tinn|gunnerside|hwsab ferry; stab -2|February 1944: the last barrels for Germany go down with the ferry Hydro, and fourteen Norwegian passengers with them.|date 1944-2; req norFallen
electrochem|The Odda Smelters|hydro|build chem 1|Carbide and cyanamide at the head of the Sørfjord.|
falconbridge|The Falconbridge Nickel Works|electrochem|money 2; build steel 1 ?? Refine Canadian nickel for Britain => rel ENG 10 // Sell the nickel to Germany => rel GER 10; rel ENG -10|At Kristiansand Canadian nickel matte is refined into the metal that hardens armour.|
# The Merchant Fleet
shipowners|The Shipowners||money 6; seaton 2|Wilhelmsen, Fred. Olsen, Bergesen: the merchant fleet earns more foreign currency than anything else Norway sells.|ai 5
tankers|The Tanker Fleet|shipowners|seaton 3; money 4|A fifth of the world's tankers fly the Norwegian flag.|
whaling|The Whaling Fleet|shipowners|money 6; spirit Whale Oil: needs -.02|Factory ships off South Georgia and in the Ross Sea bring home the oil for Europe's margarine.|
queenmaud|Queen Maud Land|whaling|legit 2; pp 10|January 1939: a royal decree claims a slice of Antarctica, a step ahead of a German expedition.|date 1939-1
seamen|The Seamen's Union|shipowners|ig union 4; seaton 1|Thirty thousand Norwegian sailors, most of them abroad at any moment.|
newships|Motor Ships|tankers|seaton 3; money -4|The yards of Gothenburg and Copenhagen build diesel tankers for Norwegian owners.|
requisition|Requisition the Fleet|newships|money 10; rel ENG 15|April 1940: the government takes over every Norwegian ship outside German reach, by decree.|req norFallen
nortraship|Nortraship|requisition|seaton 4; spirit Nortraship: tradecap .1|The Norwegian Shipping and Trade Mission in London becomes the largest shipping company in the world.|req norFallen
warsailors|The War Sailors|nortraship|ws 6; rel ENG 10, USA 5|Norwegian tankers carry the fuel of the Battle of Britain. One in five sailors will not come home.|
shetland|The Shetland Bus|warsailors|ws 4; rel ENG 5|Fishing boats from Scalloway cross the North Sea in the winter dark, with agents, radios and weapons.|date 1941-1
convoys|Norwegian Ships in the Convoys|warsailors|seaton -2; rel ENG 10|Murmansk, Malta, the Atlantic: wherever the convoys go, Norwegian ships go too.|
seamensfund|The Seamen's Fund|nortraship|stab 2; money -4|The sailors want their war bonus; the government in exile keeps it in a fund. They will argue about it for fifty years.|
fishing|The Fishing Fleet|shipowners|spirit Cod and Herring: farm_out .03|Lofoten cod and North Sea herring feed Norway and pay its bills.|
freightrates|War Freight Rates|tankers|money 8; seaton -1|Autumn 1939: freight rates triple; so do the sinkings.|date 1939-10
shippingbanks|The Shipping Banks|shipowners|money 4|The banks of Oslo and Bergen that finance the new ships.|
# The King's No
kingsno|The King's No|koht|legit 6; ws 8|10 April 1940: at Nybergsund the King tells his ministers he will abdicate rather than appoint Quisling. The government says no.|req atwar GER
elverum|The Elverum Authorisation|kingsno|pp 40; legit 4|The Storting, in a school at Elverum, gives the government full powers until it can meet again.|req atwar GER
gold|The Gold Convoy|elverum|money 10|Fifty tons of gold travel by lorry, train and fishing boat to the British cruisers at Tromsø.|req atwar GER
devonshire|To London on HMS Devonshire|gold|legit 5; rel ENG 15|7 June 1940: the King and the government sail from Tromsø.|req atwar GER
kingston|Kingston House|devonshire|pp 20; legit 3|The government in exile sets up in London, with a fleet, gold and the war sailors behind it.|req norFallen
radiolondon|Radio London|kingston|ws 6; legit 3|Every night the BBC speaks Norwegian to the occupied country, and every set in Norway is listening.|req norFallen
h7|The Royal Monogram|radiolondon|ws 4; stab 2|H7 is painted on walls all over Norway.|req norFallen
littlenorway|Little Norway|kingston|equip aircraft 40; units inf 1|A training camp for Norwegian airmen by the lake in Toronto.|date 1940-11; req norFallen
brigade|The Norwegian Brigade|kingston|units inf 2|Norwegian soldiers in Scottish camps, waiting to go home.|req norFallen
linge|The Linge Company|brigade|units inf 1; fn intelBoost|Norwegian commandos trained by the SOE: Lofoten, Måløy, Vemork.|req norFallen
lie|Trygve Lie|kingston|rel ENG 10, USA 10, SOV 10; pp 15|The foreign minister in exile, who will become the first Secretary-General of the United Nations.|
marthasus|Crown Princess Märtha|kingston|rel USA 20|The Crown Princess and her children live near Washington, and the President visits often.|
olav|Crown Prince Olav Commands|brigade|generals Crown Prince Olav/3/def; ws 4|1944: the Crown Prince becomes Chief of Defence.|date 1944-6
finnmark|Into Finnmark|olav|units mtn 1; rel SOV 10|October 1944: Norwegian troops land in the north behind the Red Army.|date 1944-10; req gerLosing
homecoming|The King Comes Home|olav|legit 8; stab 6; ws 4|7 June 1945, five years to the day: the King steps ashore in Oslo.|date 1945-5; req gerLosing
# The Home Front
homefront|The Home Front|kingsno|ws 4|Under occupation a whole nation decides not to cooperate.|req norFallen
milorg|Milorg|homefront|units mil 3; resist SELF 10|The military organisation of the resistance, under orders from London to wait for the day.|req norFallen
xu|XU|homefront|fn intelBoost|The intelligence network that reports every German ship in every fjord.|req norFallen
teachers|The Teachers' Strike|homefront|ws 4; stab 2|1942: twelve thousand teachers refuse to join Quisling's union. Hundreds are sent to Kirkenes; the schools close; Quisling gives in.|date 1942-2; req norFallen
bishops|The Bishops Resign|homefront|ws 4; legit 3|Easter 1942: the bishops and almost every priest lay down their offices rather than serve Quisling's church.|date 1942-4; req norFallen
sportsstrike|The Sports Strike|homefront|ws 2|No Norwegian athlete will compete in a Nazified sport.|req norFallen
paperclip|The Paper Clip|sportsstrike|ws 2; stab 1|A Norwegian invention worn on the lapel: we hold together.|req norFallen
milkstrike|The Milk Strike|milorg|stab -3; ws 4|September 1941: Oslo workers strike when their milk ration is stopped. Two union leaders are shot.|date 1941-9; req norFallen
oslogang|Max Manus and the Oslo Gang|milorg|resist SELF 10; ws 3|Limpet mines on German ships in Oslo harbour.|date 1943-1; req norFallen
osvald|The Osvald Group|milorg|resist SELF 8; stab -1|Communist saboteurs who do not wait for London's orders.|req norFallen
telavag|Telavåg|homefront|ws 6; stab -3|April 1942: the Germans burn a fishing village and deport its men for hiding two agents from Shetland.|date 1942-4; req norFallen
jews|The Donau|homefront|legit -2 ?? Warn them to flee to Sweden => rel SWE 10; legit 3 // There is nothing we can do => stab -1|November 1942: the Norwegian police round up the Jews for the ship Donau. Half escape to Sweden.|date 1942-11; req norFallen
scorched|The Burning of Finnmark|homefront|stab -4; ws 4|Winter 1944: the retreating Germans burn every house in Finnmark and drive the people south.|date 1944-10; req norFallen
underground|The Illegal Press|homefront|ws 3; stab 1|Three hundred secret newspapers, typed on carbon paper and passed hand to hand.|req norFallen
# Quisling's Norway
ns|Nasjonal Samling|labour|ideo fas 3|A former defence minister's party: two per cent of the vote in 1936, and a sun cross for a badge.|ai 1
quisling|Vidkun Quisling|ns|ideo fas 4; rel GER 5|He was Nansen's assistant in the Russian famine; now he talks of a Greater Nordic peace under German protection.|ai 1
hird|The Hird|quisling|units mil 2; ideo fas 3|The party's uniformed militia, named for the bodyguards of the Viking kings.|ai 1
berlinvisit|Quisling in Berlin|quisling|rel GER 15; ideo fas 3|December 1939: Quisling meets Hitler and tells him the British are about to occupy Norway.|date 1939-12; ai 1
coupradio|The Radio Coup|berlinvisit|setIdeo fas; leader Vidkun Quisling/Nasjonal Samling; stab -10; legit -15|9 April 1940, evening: Quisling seizes the broadcasting house and announces that he is Prime Minister. Almost no one obeys.|ai 0
actofstate|The Act of State|coupradio|pp 40; law oneparty; legit -5|February 1942: at Akershus Castle Quisling becomes "Minister-President" with German approval.|ai 0; req ideo fas
legion|The Norwegian Legion|actofstate|units inf 2; rel GER 10, FIN 10|Volunteers for the Eastern Front, at Leningrad and on the Arctic coast.|ai 0; req gerSovWar & ideo fas
germanicss|Germanic SS Norway|legion|units inf 1; ideo fas 3|A Norwegian SS, to be a model for a Germanic order.|ai 0; req ideo fas
labourfront|The Labour Front|actofstate|ig union -6; law state_unions|Quisling's corporative state: every union under the party.|ai 0; req ideo fas
youth|The Youth Service|labourfront|ideo fas 3; stab -3|Every child in the party's youth organisation. The parents refuse.|ai 0; req ideo fas
greaternorway|Greater Norway|actofstate|claim Murmansk, Reykjavik, Godthaab|Quisling's dream: Norway with Iceland, Greenland and the Kola peninsula.|ai 0; req ideo fas
peacetreaty|A Peace Treaty with Germany|actofstate|fn joinAxis; legit 3|Quisling asks Berlin for a peace treaty and a free Norway in the New Order. Berlin says later.|ai 0; req ideo fas
hamsunpraise|The Old Poet's Praise|quisling|ideo fas 2; legit -2|Knut Hamsun writes that Norwegians should throw down their rifles and go home.|ai 1
# The Arctic and the Far South
svalbard|Svalbard Coal|labour|money 4; build coalm 1|Norwegian and Soviet mines at Longyearbyen and Barentsburg, by treaty.|
bearisland|Bear Island|svalbard|nowatch 3|A weather station halfway between Norway and Svalbard.|
janmayen|Jan Mayen|bearisland|nowatch 3; rel ENG 5|A volcanic island and a weather station that the Allies and the Germans will both want.|
gauntlet|Operation Gauntlet|svalbard|rel ENG 10, SOV 5; money -2|August 1941: the Canadians evacuate the miners of Svalbard and burn the coal stocks.|date 1941-8; req norFallen
bouvet|Bouvet Island|queenmaud|legit 1|The loneliest island on earth, annexed in 1928.|
peter|Peter I Island|bouvet|legit 1; pp 5|An island in the ice off Antarctica, claimed by a whaler in 1929.|
greenlandclaim|Eirik the Red's Land|svalbard|rel DEN -10 ?? Accept the Hague judgement => rel DEN 10 // Renew the claim to East Greenland => claim Godthaab; rel DEN -15|In 1933 the court at The Hague gave East Greenland to Denmark. Some Norwegians have not accepted it.|
kirkenes|Sydvaranger|svalbard|money 4; build ironm 1|Iron ore at Kirkenes, by the Soviet border.|
lofoten|The Lofoten Fishery|fishing|money 3; spirit The Lofoten Season: farm_out .02|Every winter five thousand boats chase the spawning cod under the Lofoten wall.|
claymore|Operation Claymore|lofoten|ws 4; rel ENG 5|March 1941: British commandos raid the Lofoten islands, sink the fish-oil factories and carry off an Enigma rotor.|date 1941-3; req norFallen
kolaborder|The Kola Border|kirkenes|fort Tromsø; rel SOV -5|A frontier on the tundra with the Soviet Union.|
arcticroad|The Arctic Highway|kolaborder|build railway 1; infra 1|A road north of the Arctic Circle to Kirkenes.|
# The Communists
nkp|The Communist Party|labour|ideo com 3|Small, quarrelsome and loyal to Moscow, at least until 1939.|ai 1
furubotn|Peder Furubotn|nkp|ideo com 3; stab -1|A party secretary who comes home from Moscow in 1938 and fights the Germans his own way.|ai 1
motdag|Mot Dag|nkp|ideo com 2; res 5|The Marxist intellectuals of the Oslo students.|
redfinnmark|Red Finnmark|furubotn|ideo com 4|In 1944 the Red Army liberates Kirkenes, and some in the far north ask why it should stop there.|date 1944-10; ai 1
peoplesnorway|A Norwegian People's Republic|redfinnmark|setIdeo com; leader Peder Furubotn/Communist Party; stab -8|The councils take over.|ai 0
comintern|With Moscow|peoplesnorway|fn joinComintern|Norway joins the camp of the Soviet Union.|ai 0; req ideo com
# Industry and the Land
sulitjelma|Sulitjelma Copper|labour|money 3; build ironm 1|Copper and pyrites from the mountains of Nordland.|
timber|Timber and Paper|labour|build logging 1; money 3|Pulp and paper from the forests of the east.|
canning|The Stavanger Canneries|fishing|money 3; build textile 1|Brisling sardines in tins for the grocers of the world.|
bergenline|The Bergen Line|timber|build railway 1; infra 1|The railway over the mountain plateau between Oslo and Bergen.|
sorland|The Southern Line|bergenline|build railway 1|1938: the line to Kristiansand, finished at last in 1944.|date 1938-6
nordland|The Nordland Line|sorland|build railway 1; infra 1 ?? Build it ourselves => money -4 // Let the Germans build it with prisoners => rel GER 5; stab -2|The railway to the north, which the Germans push on with Soviet prisoners of war.|req norFallen
herringoil|Herring Oil|canning|money 3|Oil, meal and fertiliser from the herring of the west coast.|
krone|The Krone and the Pound|timber|money 4 ?? Keep the krone tied to sterling => rel ENG 5 // Let the krone go its own way => money 2|Since 1933 the krone has followed the pound.|
electrify|Electrify the Valleys|whitecoal|build power 1; stab 2|Light in every farmhouse in Telemark and Hedmark.|
fjordcruises|Fjord Cruises|timber|money 2; rel ENG 2, GER 2|British and German tourists on the same steamers, every summer before the war.|
# The Navy and the Air in Exile
stord|The Destroyer Stord|brigade|equip ships 2; ws 3|December 1943: a Norwegian destroyer closes to point-blank range at the sinking of the Scharnhorst off the North Cape.|date 1943-12; req norFallen
mtb|The Shetland MTBs|shetland|equip ships 2; resist SELF 5|Motor torpedo boats from Lerwick strike German convoys in the fjords.|req norFallen
ula|The Submarine Ula|mtb|equip ships 1|A Norwegian submarine sinks a U-boat off Stavanger.|date 1944-4; req norFallen
squadrons|Spitfire Squadrons|littlenorway|equip aircraft 40; rel ENG 10|Nos. 331 and 332 Squadrons, RAF: the highest-scoring Spitfire wing of 1944.|date 1942-1; req norFallen
catalina|The Catalinas|squadrons|equip aircraft 20; rel ENG 5|No. 333 Squadron flies agents and supplies to the fjords from Scotland.|req norFallen
iceland330|Seaplanes from Iceland|catalina|equip aircraft 10; rel ENG 5|No. 330 Squadron hunts U-boats from Reykjavik in Northrop seaplanes.|req norFallen
# Culture and Society
undset|Sigrid Undset|labour|legit 3; ws 2|The Nobel laureate who campaigns against Nazism from America after her son falls in 1940.|
hamsun|Knut Hamsun|labour|legit -1 ?? Shun him => ideo dem 2 // Honour the old poet => ideo fas 2|Norway's greatest novelist admires Hitler and will send him his Nobel medal.|
munch|Edvard Munch|labour|legit 2; res 5|The old painter refuses the Germans and dies at Ekely in January 1944, leaving his pictures to the city of Oslo.|
henie|Sonja Henie|munch|rel USA 10|Three Olympic golds on the ice, then Hollywood.|
grieg|Nordahl Grieg|undset|ws 4|The poet who flies with the RAF and is shot down over Berlin in 1943.|
nansen|The Nansen Office|koht|legit 3; rel ENG 5, FRA 5|1938: the Nobel Peace Prize for Nansen's refugee office, the passports of the stateless.|date 1938-12
holmenkollen|Holmenkollen|radio|ws 2; stab 1|The ski jump above Oslo, where the whole city goes every March.|
language|The Spelling of 1938|radio|stab -1 ?? Bring the two written languages together => stab -1; pp 10 // Leave each to its own => stab 1|A new spelling for both Bokmål and Nynorsk; no one is pleased.|date 1938-1
heyerdahl|Thor Heyerdahl|munch|legit 2; res 5|1947: a raft of balsa logs from Peru to Polynesia.|date 1947-4
# The Northern Alliances
nordicdef|A Nordic Defence Union?|neutralrules|rel SWE 10, DEN 10, FIN 10 ?? Stay alone => nowatch 5 // Join the Nordic union => invite SWE, DEN, FIN; rel SWE 10|The northern kingdoms talk of standing together; no one wants to fight the others' wars.|ai 1
allianceeng|An Alliance with Britain?|koht|rel ENG 15 ?? Seek a British alliance => fn joinAllies // Stay neutral => nowatch 5|The fleet that rules the North Sea is British; perhaps Norway should say so openly.|ai 0
joinallies|Allied Nation|kingston|fn joinAllies; rel ENG 10, USA 10|The government in London is a full member of the alliance against Germany.|req norFallen
atlantic|The Atlantic Choice|lie|rel USA 15, ENG 10 ?? Join the Atlantic alliance => fn joinAllies; spirit The Atlantic Choice: def .05 // A Nordic defence union instead => invite SWE, DEN; nowatch 10|1949: Norway must choose between Washington and Stockholm.|date 1948-6
sweden|Good Neighbours with Sweden|nordicdef|rel SWE 15; trade SWE|The longest border in Europe and the friendliest.|
# Liberation and Reckoning
capitulation|The German Capitulation|homecoming|units inf 2; ws 6|May 1945: 350,000 German soldiers in Norway lay down their arms without a fight.|req gerLosing
landssvik|The Treason Trials|capitulation|stab 2 ?? Try every NS member => legit 4; stab -2 // Only the leaders => stab 3|Fifty thousand Norwegians are investigated for treason; Quisling is shot at Akershus.|date 1945-6
rebuildnorth|Rebuild Finnmark|capitulation|build urban 2, railway 1; money -6|New houses, harbours and churches in the burned north.|date 1945-6
warchildren|The German Children|capitulation|stab -2 ?? Protect the children => legit 3 // Let the country take its revenge => stab 1; legit -3|Ten thousand children of German fathers, and their mothers, face the anger of the liberated.|date 1945-6
marshall|The Marshall Plan|wholepeople|money 10; rel USA 10|1948: American dollars for new ships, power stations and factories.|date 1947-6
welfare|The Welfare State|wholepeople|law welfare_state; stab 4|Child allowances, health insurance and pensions: the Labour state.|date 1946-1
un|The United Nations|lie|legit 4; rel USA 5, SOV 5|1946: the first Secretary-General of the United Nations is Norwegian.|date 1946-2
shippingboom|The Shipping Boom|capitulation|seaton 4; money 6|After the war, the fleet that survived earns more than ever.|date 1946-1
hydroboom|Power for a New Norway|whitecoal|build power 2; spirit Power and Aluminium: output .03|The great dams of the fifties begin as plans in 1946.|date 1946-1
nordicpass|No More Passports|sweden|rel SWE 10, DEN 10|The Nordic countries let each other's citizens travel without passports.|date 1946-1
monuments|The War Memorials|capitulation|stab 2; ws -2|Every village counts its dead.|
defencerebuild|A New Defence|capitulation|units inf 2; build arms 1|Never again the ninth of April: a real army, a navy and an air force.|date 1945-9
# The Storting and the Parties
hoyre|The Conservatives|labour|ig ind 3; legit 1|C. J. Hambro's Conservatives, the party of the shipowners and the towns.|
hambro|President Hambro|hoyre|legit 3; rel ENG 5|The President of the Storting, and in 1939 of the League of Nations Assembly too.|date 1939-12
venstre|The Liberals|labour|legit 2|Mowinckel's party, which governed in the twenties and still sets the tone of the west country.|
bondeparti|The Farmers' Party|crisisdeal|ig rural 3|The farmers' party that keeps Labour in office, for a price.|
broadgov|A Broader Government|kingston|stab 3; legit 3|In London the cabinet takes in the other parties: one government for all of Norway.|req norFallen
admincouncil|The Administrative Council|kingsno|legit -2 ?? Let the Supreme Court govern the occupied south => stab 2; legit -2 // Recognise only the government in exile => legit 3|April 1940: the Supreme Court sets up a council to run the occupied districts, with German consent.|req norFallen
riksrad|The State Council Talks|admincouncil|legit -3 ?? Ask the King to abdicate => rel GER 10; legit -10 // Refuse => legit 6; ws 4|Summer 1940: Terboven tells the Storting presidium to depose the King. The King answers from London: no.|date 1940-6; req norFallen
supremecourt|The Supreme Court Resigns|riksrad|legit 4; ws 3|December 1940: the judges resign rather than accept the Reichskommissar's right to make laws.|date 1940-12; req norFallen
# Neighbours and Trade
denmark|Brothers in Denmark|koht|rel DEN 15|The King of Norway is the brother of the King of Denmark.|
britishmarket|The British Market|labour|trade ENG; money 4|Britain buys our fish, our timber and our shipping services.|
fishforgermany|Fish for Germany|britishmarket|trade GER; money 3; rel GER 5|Herring and whale oil for German margarine.|
soviettrade|The Soviet Trade|britishmarket|trade SOV; money 2|Moscow buys herring, when it is not punishing us.|
norwegianamericans|The Norwegian Americans|labour|rel USA 15|More Norwegians live in Minnesota and the Dakotas than in Bergen.|
brandt|A German Exile in Oslo|labour|legit 2; rel GER -5|A young German socialist who calls himself Willy Brandt writes for the Labour press.|
# The Occupied Country
terboven|Reichskommissar Terboven|homefront|stab -3; ws 3|24 April 1940: a Gauleiter from Essen takes over the administration of Norway.|req norFallen
rationcards|Ration Cards|budget|spirit Ration Cards: needs -.04, stab -1|Bread, butter, coffee and tobacco on coupons.|date 1940-5
blackmarket|The Black Market|terboven|money 2; stab -1|Fish for cigarettes, mutton for coffee, and everything for a price.|req norFallen
grini|Grini|terboven|ws 3; stab -2|The prison camp outside Oslo, where twenty thousand Norwegians will pass.|req norFallen
radios|The Radios Confiscated|terboven|ws 2; stab -1|August 1941: every wireless set in Norway must be handed in. Thousands are hidden.|date 1941-8; req norFallen
hostages|The Trondheim Martial Law|terboven|stab -2; ws 4|October 1942: ten leading citizens of Trondheim are shot as "atonement".|date 1942-10; req norFallen
kirkenesbombs|Kirkenes Under the Bombs|kirkenes|stab -2; ws 2|After Malta, the most bombed place in Europe.|date 1941-7; req norFallen
tirpitz|The Tirpitz in the Fjords|xu|rel ENG 10 ?? Report her every move to London => fn intelBoost // Leave her to the bombers => ws 2|The largest German battleship hides in the northern fjords, until the RAF sinks her at Tromsø in November 1944.|date 1942-1; req norFallen
# The Church and the Schools
berggrav|Bishop Berggrav|labour|legit 3; ws 2|The Bishop of Oslo, a pacifist before the war, leads the church against Quisling.|
foundation|The Foundation of the Church|berggrav|ws 3; legit 2|Easter 1942: the bishops' confession is read from every pulpit.|req norFallen
folkschools|The Folk High Schools|radio|spirit Folk High Schools: literacy .02, stab 1|Winter schools for young farmers and fishermen.|
university|The University of Oslo|folkschools|res 10; build university 1|Norway's only university, on Karl Johan.|
students|The Students Deported|university|ws 3; legit 2|November 1943: the Germans close the university and send hundreds of students to camps in Germany.|date 1943-11; req norFallen
# Science of the Poles and the Weather
polarinst|The Polar Institute|svalbard|res 5; pp 5|Mapping Svalbard, Greenland and the Antarctic coast.|
amundsen|Amundsen's Memory|polarinst|ws 2; legit 1|The man who reached the South Pole first and vanished over the Arctic in 1928.|
whalescience|Whale Research at Sandefjord|whaling|res 5|The whaling town studies the whales it hunts.|
bergenschool|The Bergen School|polarinst|res 10; rel ENG 5|Vilhelm Bjerknes's meteorologists invented the weather front.|
petterssen|Petterssen's Forecast|bergenschool|rel ENG 10, USA 10|June 1944: a Norwegian meteorologist helps choose the day for the landings in Normandy.|date 1944-6
`);

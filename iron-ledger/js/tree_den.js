// Denmark (2.2): hand-written. Stauning's social democracy; the farm exports of butter and bacon, split between Britain
// and Germany; the unarmed neutrality of a small kingdom; the ninth of April and the policy of cooperation, worked through
// the cooperation mechanic; the resistance and the rescue; Iceland, Greenland and the Faroes; and the other Denmarks.
'use strict';
TREES.DEN = autoTree('da_', `
# Stauning's Denmark
stauning|Stauning or Chaos||pp 30; stab 3|The 1935 slogan, and the bearded cigar-maker who has governed since 1929.|ai 6
kanslergade|The Kanslergade Agreement|stauning|ig rural 6, union 4; stab 3; spirit The Kanslergade Settlement: farm_out .03, stab 2|January 1933, in the Prime Minister's flat: a devaluation for the farmers, public works for the workers, peace for the employers.|
steincke|Steincke's Social Reform|kanslergade|stab 3; money -4|Four laws replace the poor relief: the needy receive help as a right.|
pensions|Better Pensions|steincke|stab 2; money -3; ig union 3|A pension that an old couple can live on.|
unemp|The Unemployment Funds|steincke|unemp -2; stab 2|The union funds get more money from the state.|
election39|The Election of 1939|kanslergade|legit 4; pp 20|April 1939: the Social Democrats lose a little and keep governing with the Social Liberals.|date 1939-4
constitution|The Constitutional Referendum|election39|legit 3 ?? Campaign hard for it => legit 4; pp -10 // Let it take its chance => stab 1|May 1939: a new constitution without the upper house wins a majority, but not the 45 per cent of all voters it needs. It fails.|date 1939-5
hedtoft|Hans Hedtoft|stauning|pp 15; ig union 3|The party secretary, a printer, who will lead the Social Democrats after the war.|
buhl|Vilhelm Buhl|hedtoft|leader Vilhelm Buhl/Social Democrats; pp 20; legit 3|May 1942: Stauning dies, and his finance minister takes over the government and the difficult job of dealing with the Germans.|date 1942-5
radikale|The Social Liberals|stauning|legit 2; pp 10|Munch's small Radical Liberals, pacifist and indispensable.|
cooperativefarms|The Cooperative Movement|kanslergade|ig rural 4; stab 2; spirit The Andelsbevægelse: farm_out .04|Every village has its cooperative dairy and its cooperative store.|
folkhighschool|The Folk High Schools|stauning|spirit Grundtvig's Schools: literacy .03, stab 1|Winter schools where farmers' sons read history and sing.|
housing|Workers' Housing|steincke|build urban 1; stab 1|Copenhagen builds flats with balconies on Bispebjerg.|
radio|State Radio|stauning|pp 10; ws 2|Statsradiofonien in the new broadcasting house on Rosenørns Allé.|
welfare|The Welfare State|pensions,unemp|law welfare_state; stab 3|By 1945 Danes are protected from cradle to grave, the Social Democrats promise.|date 1945-6
justice|The Justice Party|stauning|legit 1|Georgists who want to tax the land and nothing else.|
localgov|Local Government|steincke|stab 1; legit 1|Councils in every parish run the schools and the poor relief.|
# Butter and Bacon
farms|Butter and Bacon||money 6; dkuk 0|Danish farms are the larder of Britain: half its bacon and a third of its butter.|ai 5
anglodanish|The Anglo-Danish Agreement|farms|dkuk 10; trade ENG; rel ENG 10|Britain buys our bacon, we buy British coal: that is the bargain of 1933.|
germanmarket|The German Market|farms|dkuk -10; trade GER; rel GER 5|Germany buys cattle, eggs and butter, and pays in clearing marks.|
balance|Two Markets|anglodanish,germanmarket|money 4 ?? Lean to Britain => dkuk 15 // Lean to Germany => dkuk -15|Every year the farmers and the Foreign Ministry argue over where the bacon should go.|
dairies|The Cooperative Dairies|farms|build farm 2; money 2|Fourteen hundred cooperative dairies churning Lur Brand butter.|
bacon|The Bacon Factories|dairies|build ranch 1; money 3|Danish pigs, fed on skimmed milk, cured for the breakfast tables of England.|
eggs|Eggs for London|bacon|money 2; dkuk 5|Denmark sends Britain an egg a week for every family.|
cattle|Cattle for Hamburg|dairies|money 2; dkuk -5|Live cattle go south by rail from Jutland.|
krone|The Krone and the Pound|farms|money 4 ?? Keep the krone with sterling => rel ENG 5 // Loosen the tie => money 2|Since 1933 the krone has followed the pound, for the sake of the bacon trade.|
bw|Burmeister & Wain|farms|build shipyard 1, engines 1|The yard that built the first ocean-going motor ship builds diesel engines for the world.|
smidth|F. L. Smidth|bw|build construction 1; money 3|Cement works engineered in Copenhagen for China, India and the Soviet Union.|
carlsberg|Carlsberg|farms|money 3; res 5|The brewery whose profits pay for Danish science.|
eac|The East Asiatic Company|bw|money 4; seaton 1|Ships, plantations and trading houses from Bangkok to Shanghai.|
maersk|A. P. Møller's Ships|eac|seaton 2; money 2 ?? Order the ships abroad to sail for Allied ports => rel ENG 10, USA 5; seaton -1 // Order them home => seaton 1; rel GER 5|April 1940: the shipowner's son in New York keeps the fleet abroad working for the Allies.|req denFallen
greatnorthern|The Great Northern Telegraph|carlsberg|money 2; res 5|Danish cables across Siberia to China and Japan.|
sugar|The Sugar Factories|dairies|build plantation 1; money 1|Beet sugar from Lolland and Falster.|
lego|A Workshop in Billund|carlsberg|money 1; stab 1|A carpenter makes wooden toys and calls the business LEGO: "play well".|
# The Unarmed Kingdom
munch|Munch's Foreign Ministry|stauning|pp 15; legit 2|Peter Munch believes a small country is safest when it threatens no one, and arms accordingly.|ai 6
neutrality|Strict Neutrality|munch|rel SWE 5, NOR 5; legit 2|Denmark will be neutral in any war between the great powers.|
leagueexit|Free of Article Sixteen|munch|pp 10 ?? We are no longer bound to sanctions => rel GER 5 // We stay loyal to Geneva => rel ENG 5, FRA 5; legit 2|July 1936: with the other Oslo States, Denmark declares that League sanctions no longer bind it.|date 1936-7
oslostates|The Oslo States|neutrality|trade SWE, NOR, HOL, BEL, FIN|The small democracies of the north and the west trade together.|
napgermany|Non-Aggression with Germany|neutrality|nap GER; rel GER 15, ENG -5 ?? Sign it => nap GER // Refuse, as Norway and Sweden do => rel GER -10; legit 2|May 1939: Hitler offers a pact to the northern states. Only Denmark signs.|date 1939-5
schleswig|The Border Is Firm|neutrality|stab 2 ?? The border of 1920 stands => legit 3; rel GER -5 // Talk to the Germans of North Schleswig => rel GER 5; stab -1|The German minority north of Flensburg wants the border moved, and so do the Nazis in Kiel.|
defact|The Defence Act of 1937|munch|units inf 1; money -2|A little more money for an army that everyone agrees could not stop Germany.|date 1937-1
prior|General Prior|defact|generals W. W. Prior/2/def|The commander-in-chief who wants to fight on the ninth of April and is overruled.|
navyships|The Fleet|defact|equip ships 2|Two coastal defence ships, Niels Juel and Peder Skram, and some torpedo boats.|
airarmy|The Army Air Corps|defact|equip aircraft 20|A handful of Fokker fighters at Værløse.|
jutlandline|Defend Jutland?|defact|units inf 2 ?? Rely on the non-aggression pact => rel GER 5; money 2 // Fortify the border => fort Aarhus; units inf 1|The border with Germany is a line on a flat field.|
nordicties|Nordic Ties|neutrality|rel SWE 10, NOR 10, FIN 10|Three kings who are brothers and cousins, and a president in Helsinki.|
finlandaid|Volunteers for Finland|nordicties|rel FIN 15; units inf -1|A thousand Danish volunteers go to fight for Finland in the Winter War.|req finWinter
britishfriends|Old Friends in London|anglodanish|rel ENG 10|The British have bought our bacon for seventy years and remember it.|
danishamericans|The Danish Americans|britishfriends|rel USA 10|Danes in Iowa, Nebraska and California, and a Danish minister in Washington who will act on his own.|
moscowtrade|Trade with Moscow|germanmarket|trade SOV; money 1|Butter for Soviet timber and grain.|
refugees33|Refugees from Germany|munch|legit 2 ?? Let them stay => legit 3; rel GER -5 // Send them on => stab 1|Brecht writes in a farmhouse on Fyn; Danish Social Democrats hide German comrades.|
# The Ninth of April
ninthapril|The Ninth of April|neutrality|ws 4|At dawn the Germans cross the border and land at the Langelinie pier.|req atwar GER
amalienborg|The Guard at Amalienborg|ninthapril|ws 4; legit 3|The Royal Life Guards fire on the Germans at the palace while the cabinet decides.|req atwar GER
sonderjylland|The Fighting in Southern Jutland|ninthapril|ws 3; legit 2|At Hokkerup and Bredevad a few companies fight for an hour; sixteen Danish soldiers die.|req atwar GER
fightchoice|Fight On?|amalienborg,sonderjylland|ws 6; units inf 2 ?? Mobilise the reserves => units mil 3 // Retreat to the islands and fight => fort Copenhagen; units inf 2; ws 4|The general wants to fight; the King and the cabinet must decide in the next hour.|req atwar GER
langelinie|The Langelinie Pier|ninthapril|ws 2|At dawn a German troopship ties up at the pier where the tourists photograph the Little Mermaid.|req atwar GER
cabinet|The Cabinet Decides|langelinie|stab -2 ?? Yield under protest => dkyield // Fight on => ws 6; units inf 1|Two hours after the landings the King and the cabinet must choose between a hopeless fight and an occupation with a Danish government.|req atwar GER
# The Policy of Cooperation
protectorate|Under Protest|ninthapril|legit 3; stab 2|The government stays, the King stays, the courts stay. Denmark is occupied, and still governs itself.|req dkCoop
scavenius|Erik Scavenius|protectorate|pp 25; dkcoop 8; legit -3|The new foreign minister, who did the same job in the last war, believes Denmark survives only by giving Berlin what it wants first.|date 1940-7; req dkCoop
kingride|The King's Morning Ride|protectorate|legit 5; ws 3; stab 2|Christian X rides through Copenhagen every morning without a guard, and does not return German salutes.|req dkCoop
nationalunity|The Unity Government|protectorate|stab 4; pp 20|Every party except the Nazis and the Communists sits in one cabinet.|req dkCoop
deliveries|The Deliveries|scavenius|dkcoop 10; money 4; rel GER 10|Butter, bacon and cattle for Germany, paid into a clearing account that grows and grows.|req dkCoop
workers|Danish Workers for Germany|deliveries|dkcoop 6; unemp -3; stab -2|Unemployed Danes are sent to work in German factories and on the Atlantic Wall.|req dkCoop
anticomintern|The Anti-Comintern Pact|scavenius|dkcoop 12; legit -6; stab -4 ?? Sign it with reservations => dkcoop 12 // Refuse => dkcoop -15; legit 4|November 1941: Berlin demands that Denmark sign. Students demonstrate in the streets of Copenhagen.|date 1941-11; req dkCoop
communistlaw|The Communist Law|anticomintern|dkcoop 6; legit -4; ideo com -3|August 1941: the Danish police intern the Communists at Horserød, against the constitution.|date 1941-8; req dkCoop
freecorps|The Free Corps Denmark|anticomintern|dkcoop 5; rel GER 10; units inf -1|Danish volunteers for the Eastern Front, with the government's permission to leave the army.|date 1941-7; req dkCoop
telegram|The Telegram Crisis|kingride|dkcoop -15; legit 3 ?? Apologise to Hitler => dkcoop 10; legit -3 // Let the King's word stand => dkcoop -10; ws 4|September 1942: Hitler sends the King a long birthday telegram. The King answers: "My best thanks, Christian Rex." Hitler is enraged.|date 1942-9; req dkCoop
best|Werner Best|telegram|dkcoop 10; stab 2|November 1942: the new Reich plenipotentiary is an SS lawyer who decides that a quiet Denmark is worth more than a crushed one.|date 1942-11; req dkCoop
election43|The Election of 1943|best|dkdo vote|March 1943: Denmark votes under occupation, and the democratic parties win almost every vote.|date 1943-3; req dkCoop
concede|Concede Again|deliveries|dkdo concede|Give the Germans what they ask, this time.|req dkCoop
protest|Protest Formally|kingride|dkdo protest|Notes, delays and objections at every step.|req dkCoop
blindeye|Look the Other Way|protest|dkdo blind|The police do not see the saboteurs.|req dkCoop
jewsprotect|No Yellow Stars|kingride|legit 4; dkcoop -5|Denmark refuses any law against its Jews; the Germans do not insist, for now.|req dkCoop
clearing|The Clearing Account|deliveries|money -4; inflx 2|Germany pays in promises: the account in the National Bank reaches billions of kroner.|req dkCoop
schalburg|The Schalburg Corps|freecorps|dkcoop 4; stab -4|Danish SS men return from the East to terrorise their countrymen.|date 1943-2; req dkCoop
students|The Students Demonstrate|anticomintern|ws 3; dkcoop -5|November 1941: students march on Christiansborg against the Anti-Comintern Pact.|date 1941-11; req dkCoop
# The Resistance
resistance|The First Saboteurs|ninthapril|ws 3|Students and Communists who will not wait for permission.|req denFallen
fritdanmark|Frit Danmark|resistance|ws 3; legit 2|An illegal paper, and then a movement, Conservatives and Communists together.|req denFallen
bopa|BOPA|resistance|resist SELF 8; ideo com 2|The Communist sabotage groups blow up factories working for Germany.|req denFallen
holgerdanske|Holger Danske|resistance|resist SELF 8|Named for the sleeping hero who will wake when Denmark is in danger.|req denFallen
soeagents|The SOE Parachutists|resistance|fn intelBoost; rel ENG 10|Danish agents dropped from British bombers, with radios and plastic explosive.|req denFallen
muus|Flemming Muus|soeagents|resist SELF 6; rel ENG 5|The SOE's organiser in Denmark, who knows everyone.|date 1943-3; req denFallen
august|The August Uprising|bopa,holgerdanske|dkcoop -30; ws 6|August 1943: strikes in Odense, Aalborg and Esbjerg. The Germans demand the death penalty for saboteurs.|date 1943-8; req denFallen
fleetscuttle|Scuttle the Fleet|august|ws 6; legit 4|29 August 1943: the Danish navy sinks its own ships at Holmen and escapes to Sweden with what it can.|req denFallen
freedomcouncil|The Freedom Council|august|legit 6; resist SELF 10|September 1943: seven men speak for the resistance and, they say, for Denmark.|date 1943-9; req denFallen
rescue|The Rescue|freedomcouncil|dkdo warn|October 1943: fishing boats from Gilleleje to Dragør carry seven thousand Jews to Sweden.|date 1943-10; req denFallen
railsabotage|The Railway Sabotage|freedomcouncil|resist SELF 10|Jutland's railways are cut every night to delay German divisions bound for Normandy.|date 1944-6; req denFallen
peoplesstrike|The People's Strike|freedomcouncil|ws 6; stab -3|June 1944: Copenhagen stops working until the Germans lift the curfew. They do.|date 1944-6; req denFallen
police|The Police Arrested|freedomcouncil|stab -4; ws 4|September 1944: the Germans arrest the Danish police and send two thousand of them to Buchenwald.|date 1944-9; req denFallen
shellhouse|The Shell House Raid|railsabotage|ws 4; rel ENG 10|March 1945: Mosquitoes bomb the Gestapo headquarters in Copenhagen at rooftop height.|date 1945-3; req denFallen
illegalpress|The Illegal Press|fritdanmark|ws 3; stab 1|Hundreds of secret newspapers, millions of copies.|req denFallen
weapons|Weapons from Sweden|freedomcouncil|units mil 2; rel SWE 10|Boats across the Sound with Swedish rifles.|req denFallen
# Iceland, Greenland and the Faroes
northatlantic|The North Atlantic|stauning|pp 10; legit 1|Iceland in personal union, Greenland and the Faroes as colonies: the kingdom reaches across the ocean.|
cryolite|The Cryolite Mine|northatlantic|money 4; rel USA 5|Ivittuut in Greenland has the only cryolite mine in the world, and the aluminium industry of America needs it.|
greenland|The Greenland Administration|northatlantic|stab 1; legit 1|A closed colony, run from Copenhagen for the Inuit, it says.|
kauffmann|Henrik Kauffmann's Treaty|greenland|rel USA 20; money 4|April 1941: the Danish minister in Washington, on his own authority, places Greenland under American protection.|date 1941-4; req denFallen
thule|Bases in Greenland|kauffmann|rel USA 10|American airfields at Narsarsuaq and weather stations on the ice.|req denFallen
sledgepatrol|The Sledge Patrol|thule|ws 3; rel USA 5|Seven Danish hunters and their dogs hunt the German weather stations on the east coast.|date 1942-9; req denFallen
icelandunion|The Act of Union|northatlantic|legit 1 ?? Prepare to renew the union => rel ENG -2 // Prepare the Icelanders for independence => legit 3|The 1918 Act of Union can be ended by either side after 1943.|
icelanders|Iceland Takes Charge|icelandunion|legit -2; rel ENG 5|April 1940: with the King in occupied Copenhagen, the Althing takes over the King's powers in Iceland.|req denFallen
faroes|The Faroes|northatlantic|rel ENG 5|Eighteen islands of fishermen and sheep.|
valentine|Operation Valentine|faroes|rel ENG 5; legit -1|April 1940: the British land in Tórshavn, and the Faroese fly their own flag on their fishing boats.|req denFallen
fishfaroes|Faroese Fish for Britain|valentine|rel ENG 10; money 2|Faroese trawlers keep Britain's fish-and-chip shops open.|req denFallen
knudrasmussen|Knud Rasmussen's Legacy|greenland|res 5; legit 1|The explorer who crossed the Arctic by dog sledge from Greenland to Alaska.|
althing|The Althing|icelandunion|legit 1|The oldest parliament in the world, at Þingvellir since 930.|
icelandfish|Icelandic Fish for Britain|icelanders|money -1; rel ENG 5|Iceland's trawlers sell their catch in Grimsby and Hull, under British protection.|req denFallen
recognise|Recognise the Republic|icelanders|legit 3 ?? Send the King's good wishes => legit 3; stab 1 // Protest that the union was broken in wartime => legit -2|June 1944: Iceland proclaims a republic while Denmark is occupied. The King is hurt; the Danes understand.|date 1944-6
faroeflag|The Faroese Flag|valentine|legit -1; rel ENG 5|The British let Faroese ships fly the Merkið instead of the Dannebrog, so that no one mistakes them for occupied Danes.|req denFallen
eastgreenland|The Hague Judgement|greenland|legit 2; rel NOR -5|1933: the Permanent Court gives all of East Greenland to Denmark, against Norway's claim.|
scoresbysund|Scoresbysund|eastgreenland|stab 1|A settlement on the east coast, founded in 1925 so that the land would not be empty.|
greenlanders|The Greenlanders|greenland|stab 1; legit 1|Twenty thousand Inuit, ruled from Copenhagen, who will want a say.|
# The King and the Crown
christianx|Christian X|stauning|legit 3; stab 1|Six foot six, stiff, conservative, and the most popular man in Denmark.|
margrethe|A Princess Is Born|christianx|stab 3; ws 2|16 April 1940, a week after the invasion: a daughter for the Crown Prince. All of Denmark celebrates.|date 1940-4
alsang|The Great Sing-Songs|christianx|ws 4; stab 2|Summer 1940: three hundred thousand Danes gather in the parks to sing the old songs together.|date 1940-7
kingsbadge|The King's Badge|alsang|ws 3; legit 2|26 September 1940: on the King's seventieth birthday, Danes wear his monogram on their lapels.|date 1940-9
crownprince|Crown Prince Frederik|christianx|legit 2; generals Crown Prince Frederik/2/def|A naval officer, and regent when the old King is too ill.|
kingfall|The King's Fall|crownprince|stab -2; legit 2|October 1942: the King is thrown from his horse and never rides again.|date 1942-10
dannebrog|The Dannebrog|kingsbadge|ws 2; stab 1|The oldest flag in the world, in every window on the King's birthday.|
# The Danish Nazis
dnsap|The DNSAP|stauning|ideo fas 3|Frits Clausen's National Socialists: two per cent of the vote, mostly in North Schleswig.|ai 1
clausen|Frits Clausen|dnsap|ideo fas 4; rel GER 5|A country doctor from Bov who wants to be Denmark's Quisling.|ai 1
storm|The Storm Troops|clausen|units mil 1; ideo fas 3|The party's uniformed men march in Copenhagen and are laughed at.|ai 1
nsgovernment|A National Socialist Government|storm|setIdeo fas; leader Frits Clausen/DNSAP; stab -10; legit -15|With German bayonets behind them, the Danish Nazis take the ministries.|ai 0
greaterdenmark|Greater Denmark?|nsgovernment|rel GER -5 ?? Ask Berlin for South Schleswig => claim Kiel; rel GER -10 // Ask for nothing => rel GER 10|The Danish Nazis, too, think the border should move, but south.|ai 0; req ideo fas
newordereconomy|Denmark in the New Order|nsgovernment|fn joinAxis; dkuk -40|Every pound of butter for the Reich.|ai 0; req ideo fas
easternvol|Volunteers for the East|newordereconomy|units inf 1; rel GER 10, FIN 5|Danish volunteers march with the Waffen SS.|ai 0; req gerSovWar
nazilegion|The Nordic Division|easternvol|units inf 1; ideo fas 2|Danes in the Wiking and Nordland divisions.|ai 0; req ideo fas
# The Danish Communists
dkp|The Communist Party|stauning|ideo com 3|Aksel Larsen's party: two seats in the Folketing.|ai 1
larsen|Aksel Larsen|dkp|ideo com 3|The Communist leader, who will survive the camps and lead the party after the war.|ai 1
landdag|The Land Dag|larsen|ideo com 3; ig union 2|The Communists lead the unemployed marches of the thirties.|ai 1
undergroundcp|The Communists Underground|larsen|resist SELF 6; ideo com 3|Banned in 1941, the party goes underground and into the resistance.|req denFallen
redsummer|The Red Summer of 1945|undergroundcp|ideo com 6|The Communists win twelve per cent in October 1945 on their resistance record.|date 1945-10; ai 1
danishpeoples|A Danish People's Republic|redsummer|setIdeo com; leader Aksel Larsen/Communist Party; stab -8|The councils of the resistance take over the state.|ai 0
redcomintern|With Moscow|danishpeoples|fn joinComintern|Denmark joins the Soviet camp.|ai 0; req ideo com
# The Conservatives and Christmas Møller
conservatives|The Conservative People's Party|stauning|ig ind 3; legit 1|John Christmas Møller's Conservatives, the party of the merchants of Copenhagen.|
christmas|Christmas Møller|conservatives|ws 3; legit 2|The Conservative leader who refuses to keep quiet about Germany.|
tolondon|Christmas Møller in London|christmas|rel ENG 15; legit 3|May 1942: Christmas Møller escapes to London and speaks to Denmark on the BBC.|date 1942-5; req denFallen
danishcouncil|The Danish Council in London|tolondon|rel ENG 10; legit 3|Danes abroad organise, and ask the Allies to count Denmark as one of them.|req denFallen
venstre|The Liberals|conservatives|ig rural 3; legit 1|Venstre, the party of the farmers of Jutland.|
smallholders|The Smallholders|venstre|ig rural 3; stab 1|Thirty thousand small farms given out since 1919.|
danskunity|Dansk Samling|christmas|ws 2; ideo dem 1|A small nationalist party that goes into the resistance early.|
# Science and Culture
bohr|Niels Bohr's Institute|stauning|res 20; build university 1|Every great physicist of the age has worked in a house on Blegdamsvej.|
hevesy|The Dissolved Medals|bohr|res 5; legit 2|April 1940: Hevesy dissolves the Nobel medals of von Laue and Franck in acid, so the Germans cannot take them. The liquid sits on a shelf all war.|date 1940-4
bohrflees|Bohr Flees|bohr|res -10; rel ENG 10, USA 10; proj 0|October 1943: Bohr crosses to Sweden in a fishing boat, flies to Britain in a bomb bay, and goes on to Los Alamos.|date 1943-10; req denFallen
krogh|August Krogh|bohr|res 10|The Nobel physiologist of the capillaries, who also escapes to Sweden in 1943.|
blixen|Karen Blixen|stauning|legit 2; rel USA 5|1937: Out of Africa, by a Danish baroness who ran a coffee farm in Kenya.|date 1937-4
dreyer|Carl Dreyer's Day of Wrath|blixen|legit 1; ws 2|1943: a film about the witch-burnings of 1623 that everyone takes as being about the occupation.|date 1943-11
munk|Kaj Munk|dreyer|ws 4; stab -1|The playwright-priest who preaches against the Germans from his pulpit at Vedersø and is murdered by the Gestapo in January 1944.|date 1944-1; req denFallen
pietheim|Piet Hein's Grooks|munk|ws 2|Short poems in the newspapers that the censors cannot quite object to.|req denFallen
jacobsen|Arne Jacobsen|blixen|build urban 1; legit 1|The architect of Bellevue Beach, the town hall at Aarhus, and the chairs.|
klint|Danish Design|jacobsen|money 2|Kaare Klint teaches that a chair should fit the body; the world will want them.|
borge|Victor Borge|blixen|rel USA 5|The pianist who mocked Hitler on stage, and flees to America in 1940.|
andersen|Hans Christian Andersen|stauning|legit 2|The fairy tales are read in every language of the world.|
copenhagenschool|The Copenhagen Interpretation|bohr|res 10|Physicists argue about what quantum mechanics means at the institute's dinners.|
finsen|The Finsen Institute|bohr|spirit The Finsen Institute: growth .01|Light therapy and radiology, founded by a Nobel laureate from the Faroes.|
ballet|The Royal Danish Ballet|andersen|legit 1; stab 1|Bournonville's ballets at the Royal Theatre, as they were danced in 1840.|
nielsen|Carl Nielsen's Symphonies|ballet|ws 1; legit 1|The Inextinguishable: a symphony about the will to live.|
# Copenhagen
copenhagen|Copenhagen|stauning|build urban 1; money 2|The capital of a farming country is also one of the great cities of the north.|
tivoli|Tivoli|copenhagen|stab 2|The gardens are open through the war, until the Germans blow up the concert hall in 1944.|
freeport|The Free Port|copenhagen|build port 1; money 2|The port of the whole Baltic, duty-free.|
kastrup|Kastrup Airport|copenhagen|build railway 1; money 1|DDL's airliners to London, Berlin and Hamburg.|
ferries|The Sound Ferries|copenhagen|rel SWE 5; money 1|Helsingør to Helsingborg, twenty minutes.|
christiansborg|Christiansborg|copenhagen|legit 2|The parliament, the government and the Supreme Court under one roof.|
# The Free Danes
freedanes|The Free Danes|tolondon|legit 3; ws 2|Danes abroad who never accepted the ninth of April.|req denFallen
sailors|Danish Sailors for the Allies|freedanes|seaton 1; rel ENG 10|Five thousand Danish sailors on Allied ships; a thousand will die.|req denFallen
volunteersraf|Danes in the RAF|freedanes|equip aircraft 10; rel ENG 5|Danish pilots and ground crew in British squadrons.|req denFallen
buffs|The Danish Company of the Buffs|freedanes|units inf 1; rel ENG 5|Danish volunteers in a company of the Royal East Kent Regiment.|req denFallen
alliedrecognition|An Allied Nation|danishcouncil,freedomcouncil|fn joinAllies; legit 6|1944: the Allies agree to count Denmark as one of them.|date 1944-6; req denFallen
danforce|The Danish Brigade in Sweden|weapons|units inf 2; rel SWE 10|Five thousand Danish refugees train as "police" in Swedish camps.|date 1943-11; req denFallen
# Liberation and After
liberation|The Fifth of May|alliedrecognition|ws 8; legit 8; stab 6|4 May 1945, evening: the BBC announces the German surrender in Denmark. Candles burn in every window.|date 1945-5; req gerLosing
bornholmsoviet|The Soviets on Bornholm|liberation|rel SOV -10; stab -2|May 1945: Soviet aircraft bomb Rønne and Nexø; the Red Army stays on Bornholm until April 1946.|req gerLosing
reckoning|The Reckoning|liberation|stab 2 ?? Punish the collaborators hard => legit 3; stab -2 // Let the courts take their time => stab 3|A retroactive law brings back the death penalty; forty-six collaborators are executed.|date 1945-6
germanrefugees|The German Refugees|liberation|stab -3; money -4|A quarter of a million German refugees from the east are behind wire in Danish camps until 1949.|date 1945-5
bordenfirm|The Border Lies Firm|liberation|legit 3 ?? Keep the border of 1920 => rel GER 5; legit 2 // Ask for South Schleswig => claim Kiel; stab -2|1945: many in Flensburg want to be Danish; the government says the border stays where it is.|date 1945-9
hedtoftgov|Hedtoft's Government|liberation|leader Hans Hedtoft/Social Democrats; pp 20|1947: the printer becomes Prime Minister.|date 1947-11
marshall|The Marshall Plan|liberation|money 10; rel USA 10|American dollars for tractors and ships.|date 1947-6
nato|The Atlantic Pact|marshall|rel USA 15, ENG 10 ?? Join the Atlantic alliance => fn joinAllies // A Nordic defence union instead => invite SWE, NOR|1949: the talks on a Nordic alliance fail, and Denmark must choose.|date 1949-1
unitednations|The United Nations|liberation|legit 3; rel USA 5, ENG 5|Denmark signs the Charter at San Francisco.|date 1945-6
faroesrule|Home Rule for the Faroes|fishfaroes|legit 2; stab 1|1948: the Faroes get their own government, after a referendum for independence that nearly passes.|date 1946-9
greenlandbases|Greenland and America|thule|rel USA 10; money 2|The Americans do not leave Greenland. A new treaty makes the bases legal.|date 1946-1
newconstitution|The New Constitution|constitution|legit 4|Without the upper house, and with a daughter able to inherit the throne.|date 1947-1
tradeuk|The Trade Agreement of 1946|marshall|money 4; rel ENG 5|Bacon for Britain again, and coal for Denmark.|date 1946-1
rebuildfleet|Rebuild the Fleet|merchantfleet|seaton 2; money -2|Half the merchant fleet was sunk; the yards work double shifts.|date 1945-9
foodaid|Food for Europe|liberation|legit 2; dkuk 5|Danish butter and meat for the hungry of the Netherlands and Norway.|date 1945-6
# Bornholm
bornholm|Bornholm|stauning|fort Copenhagen; stab 1|The island in the Baltic, closer to Sweden than to Copenhagen.|
v1photo|The Bomb on Bornholm|bornholm|rel ENG 15; res 5|August 1943: a strange pilotless aircraft crashes in a turnip field. A Danish naval officer photographs it, and the pictures reach London.|date 1943-8; req denFallen
bornholmguns|The Bornholm Batteries|bornholm|fort Copenhagen; units inf 1|Coastal guns at Rønne and Nexø.|
fishermen|The Bornholm Fishermen|bornholm|seaton 1; money 1|Salmon and herring, and smoked herring in the chimneys of Gudhjem.|
# The Farms
crisisfarms|The Farm Crisis|cooperativefarms|ig rural 4; money -3|Prices have fallen by half since 1929; the farmers want help.|
landrace|The Danish Landrace|bacon|money 2; build ranch 1|The long pig, bred for bacon.|
slaughterhouses|The Cooperative Slaughterhouses|landrace|money 2|Every pig in Jutland goes to a slaughterhouse its owner co-owns.|
agschools|The Agricultural Schools|folkhighschool|spirit Scientific Farming: farm_out .03|Dairy science, crop rotation and bookkeeping for young farmers.|
tractors|Tractors and Milking Machines|agschools|build farm 1; money -2|The horse is giving way to the Ferguson.|
lurpak|Lur Brand|dairies|money 2; dkuk 3|The brand of quality butter, with the bronze-age horns on the wrapper.|
peat|Peat and Lignite|rationing|build coalm 1; stab -1|No British coal: Danes dig peat in the bogs and lignite in Jutland.|req denFallen
# The Army and the Navy
lifeguards|The Royal Life Guards|defact|units inf 1; ws 1|Bearskins at Amalienborg, and rifles when needed.|
hussars|The Guard Hussars|defact|units cav 1|The last cavalry regiment, at Næstved.|
mines|Mine the Belts|navyships|fort Copenhagen; rel GER -5, ENG 5|Minefields in the Great and Little Belts, to keep out everyone's warships.|date 1939-9
coastartillery|The Coastal Artillery|mines|fort Copenhagen, Aarhus|Forts on the Sound: Middelgrunden, Stevnsfortet.|
navyair|The Naval Air Service|navyships|equip aircraft 10|Seaplanes from Copenhagen to patrol the straits.|
madsen|The Madsen Gun|defact|equip arms 200; build arms 1|The light machine gun that every army in the world has bought.|
nielsjuel|The Niels Juel|navyships|equip ships 1|The coastal defence ship, a training ship by 1940, which the crew runs aground in August 1943 rather than surrender.|
# The Occupation Economy
rationing|Ration Cards|farms|spirit Ration Cards: needs -.04|Coffee, tea and tobacco disappear; butter does not, at first.|date 1940-4
blackmarket|The Black Market|rationing|money 2; stab -1|Pork and butter at night prices, for those who can pay.|req denFallen
bicycles|The Bicycle Nation|rationing|stab 1|No petrol: half a million bicycles on the roads of Copenhagen.|date 1940-6
gascars|Gas Generator Cars|bicycles|spirit Generator Gas: needs -.02|Lorries that burn wood and peat in a boiler at the back.|date 1940-9
priceboard|The Price Control Board|rationing|inflx -2; stab 1|Prices fixed by law.|
# Schleswig
northschleswig|North Schleswig|schleswig|stab 1; legit 1|The German minority of thirty thousand around Aabenraa and Tønder.|
germanminority|The German Minority|northschleswig|stab -1 ?? Allow their schools => stab 1; rel GER 5 // Limit them => legit 1; rel GER -5|Their party asks for "Heim ins Reich".|
southschleswig|The Danes of Flensburg|northschleswig|legit 1; rel GER -5|A Danish minority south of the border, with its own schools and newspaper.|
# Nordic Ties
nordicunion|A Nordic Defence Union?|nordicties|rel SWE 10, NOR 10 ?? Stay alone => legit 2 // Join the Nordic union => invite SWE, NOR, FIN|The northern kingdoms talk of standing together.|ai 1
nordiccouncil|A Nordic Council|nordicunion|trade SWE, NOR, FIN; rel SWE 10, NOR 10, FIN 10|One labour market and no passports.|date 1946-1
swedishfriend|Sweden Across the Sound|nordicties|rel SWE 15; trade SWE|The Swedes are an hour away by ferry.|
# Industry
danfoss|Danfoss|bw|build engines 1; money 1|A refrigeration valve invented in a farmhouse attic on Als in 1933.|
novo|Insulin from Novo|carlsberg|money 2; spirit Danish Insulin: growth .01|Novo and Nordisk make insulin for the diabetics of the world.|
bo|Bang & Olufsen|danfoss|money 1; build engines 1|Radios from Struer; the Germans burn the factory in 1945 for refusing to work for them.|
thrige|Thrige of Odense|bw|build engines 1|Electric motors for ships, trams and factories.|
merchantfleet|The Danish Merchant Fleet|eac|seaton 2|A million tons of shipping, much of it at sea when the Germans come.|
esbjerg|The Port of Esbjerg|anglodanish|build port 1; money 2|The bacon boats to Harwich and the butter boats to Newcastle leave from Esbjerg.|
fishing|The North Sea Fishery|esbjerg|money 2; spirit North Sea Fish: farm_out .02|Danish cutters from Skagen and Esbjerg.|
aalborg|Aalborg Portland Cement|smidth|build construction 1; money 1|The biggest cement works in Europe, on the Limfjord.|
odenseyard|The Odense Steel Shipyard|bw|build shipyard 1|A. P. Møller's own yard, opened in 1918.|
# The Home Front
coldwinters|The Ice Winters|rationing|stab -2|1940, 1941, 1942: the coldest winters in a century, with no coal.|date 1940-1
blackout|The Blackout|rationing|spirit The Blackout: bombing -.05|Blue light bulbs and blackout curtains.|date 1940-4
curfew|The Curfew|blackout|stab -1; ws 2|No one in the streets after dark.|req denFallen
radiolondon|Listening to London|freedanes|ws 3|The BBC's Danish service, in every kitchen at night.|req denFallen
swing|Swing Youth|copenhagen|stab -1; ideo dem 1|Jazz in the cellars of Copenhagen; the Germans disapprove.|req denFallen
# Jutland and the Islands
jutland|Jutland|farms|stab 1; ig rural 2|Heath, dunes and pig farms from Skagen to the German border.|
skagen|Skagen|jutland|money 1; legit 1|Fishermen, painters, and the point where two seas meet.|
aarhusuni|Aarhus University|jutland|res 5; build university 1|Founded in 1928, in yellow brick.|
aarhusraid|The Aarhus Raid|aarhusuni|ws 4; rel ENG 5|October 1944: Mosquitoes bomb the Gestapo headquarters in the university buildings and destroy its files on the resistance.|date 1944-10; req denFallen
limfjord|The Limfjord Bridges|jutland|build railway 1|Road and rail across the fjord at Aalborg.|
littlebelt|The Little Belt Bridge|limfjord|build railway 1; infra 1|1935: the bridge between Jutland and Funen.|
greatbelt|The Great Belt Ferries|littlebelt|money 1|Trains ride the ferries from Funen to Zealand.|
`);

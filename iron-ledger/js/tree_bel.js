// Belgium (2.2): hand-written. Van Zeeland's and Spaak's Belgium; the policy of independence; the defence of the Albert
// Canal and the eighteen days; Flemings and Walloons, worked through the goodwill of the two peoples; Rex and the New Order;
// the King's choice and the Royal Question; the government in London; the occupation; the Congo and its uranium, worked
// through Union Minière; and the Belgium that is rebuilt at the heart of Europe.
'use strict';
TREES.BEL = autoTree('be_', `
# Van Zeeland's Belgium
vanzeeland|The Government of National Union||pp 30; stab 3|Paul van Zeeland, a banker from Princeton, governs with Catholics, Socialists and Liberals together.|ai 6
devalue35|After the Devaluation|vanzeeland|money 4; unemp -2|1935: the belga is devalued by a quarter and the economy recovers.|
election36|The Election of May 1936|vanzeeland|stab -3; legit 2|The great shock: Rex wins twenty-one seats, the Flemish nationalists sixteen.|date 1936-5
strike36|The Strikes of June 1936|election36|stab -2 ?? Grant the forty-hour week and paid holidays => ig union 8; money -4; stab 2 // Hold firm => ig union -6; stab -3|Half a million workers walk out from Antwerp to the Borinage.|date 1936-6
holidays|Paid Holidays|strike36|stab 2; ig union 4|Six days with pay: the first summer at the sea for the working class.|
spaak|Paul-Henri Spaak|vanzeeland|pp 15; legit 2|The young Socialist foreign minister who moves from revolution to realism in two years.|
degrellebyelection|The Brussels By-Election|election36|ideo fas -4; legit 3|April 1937: Degrelle challenges the Prime Minister in Brussels; the Cardinal tells Catholics to vote against Rex; Degrelle is crushed.|date 1937-4
bankaffair|The National Bank Affair|degrellebyelection|stab -2; pp -20|October 1937: Van Zeeland resigns over payments from the National Bank.|date 1937-10
janson|Janson's Cabinet|bankaffair|leader Paul-Émile Janson/Liberal Party; stab 1|A Liberal holds the coalition together for six months.|date 1937-11
spaakpm|Spaak, Prime Minister|janson|leader Paul-Henri Spaak/Belgian Labour Party; pp 20; ig union 4|May 1938: the first Socialist prime minister of Belgium.|date 1938-5
pierlot|Pierlot's Government|spaakpm|leader Hubert Pierlot/Catholic Party; pp 20; stab 2|April 1939: a Catholic lawyer forms the government that will go to London.|date 1939-4
tripartite|The Three Families|vanzeeland|stab 3; legit 2|Catholics, Socialists and Liberals: three pillars, one government.|
vanzeelandreport|The Van Zeeland Report|devalue35|legit 2; rel USA 5, ENG 5|1938: a plan for reopening world trade, written for London and Paris. Nobody acts on it.|date 1938-1
deman|Hendrik de Man's Plan|spaak|unemp -2; money -3 ?? Adopt the Labour Plan => law interventionism; unemp -3 // Shelve it => stab 1|A socialist plan to nationalise credit and energy, from a professor who will later welcome the occupation.|
welfare|Social Insurance|holidays|money -3; stab 2|Family allowances and pensions for the wage earners.|
# The Policy of Independence
independence|The King's Speech|vanzeeland|bedo indep|14 October 1936: King Leopold tells his ministers that Belgium will follow a policy "exclusively Belgian".|date 1936-10
locarnorelease|Released from Locarno|independence|legit 2; rel ENG 5, FRA 5|April 1937: Britain and France release Belgium from its Locarno obligations, and promise to defend it anyway.|date 1937-4
germanpledge|The German Pledge|locarnorelease|rel GER 10|October 1937: Germany promises to respect Belgium's neutrality.|date 1937-10
oslostates|The Oslo States|independence|trade HOL, SWE, NOR, DEN, LUX|The small democracies of the north and the west trade together.|
peaceoffer|The Royal Peace Offer|independence|legit 3|November 1939: King Leopold and Queen Wilhelmina offer their good offices for peace.|date 1939-11
mechelen|The Mechelen Incident|peaceoffer|ws 6; stab -2 ?? Stay strictly neutral => rel GER 5 // Let the French and British in => rel FRA 10, ENG 10; rel GER -15|January 1940: a German plane lands in the snow near Mechelen carrying the plans for the invasion of the West.|date 1940-1
noalliance|No Staff Talks|independence|rel GER 5; rel FRA -5|The army may not even plan with the French, who will have to rescue it.|
hollandtalks|Talks with The Hague|oslostates|rel HOL 15|Two neutrals with the same enemy, who cannot agree to plan together.|
britishfriend|The British Guarantee|locarnorelease|rel ENG 10|Britain fought in 1914 for Belgium; London says it would again.|
frenchfriend|The French Alliance?|locarnorelease|rel FRA 10 ?? Keep our distance => rel GER 5 // Talk to Gamelin in secret => rel FRA 10; rel GER -5|The French generals want to come forward to the Dyle; the Belgian generals cannot invite them.|
# The Defence of Belgium
army|The Belgian Army|vanzeeland|units inf 2|Twenty-two divisions by 1940: more than the British send to France.|ai 5
overstraeten|Van Overstraeten|army|generals Raoul Van Overstraeten/3/def|The King's military adviser, the real commander of the army.|
albertcanal|The Albert Canal|army|fort Liège; spirit The Canal Line: def .04|The new canal from Liège to Antwerp is the first line of defence.|date 1939-6
ebenemael|Eben-Emael|albertcanal|fort Liège; spirit The Strongest Fort in the World: def .04|A fortress cut into the rock where the canal meets the Maas, said to be impregnable.|
gliders|The Gliders on the Roof|ebenemael|ws 4; stab -2|10 May 1940: German gliders land on top of Eben-Emael, and the fort falls in a day.|req atwar GER
kwline|The KW Line|albertcanal|fort Brussels; units inf 1|The line from Koningshooikt to Wavre, where the French and British will join us.|
pfl|The Fortified Position of Liège|ebenemael|fort Liège, Charleroi|The ring of forts around Liège, which held for twelve days in 1914.|
chasseurs|The Ardennes Chasseurs|army|units mtn 1; spirit The Boar's Head: def .04|Light infantry in green berets with a boar's head on the badge.|
lys|The Battle of the Lys|kwline|ws 6|May 1940: the Belgian army holds the Lys for four days while the British fall back on Dunkirk.|req atwar GER
fnherstal|FN Herstal|army|build arms 1; equip arms 300|The National Factory makes Brownings, Mausers and machine guns for half the world.|
cockerill|Cockerill Guns|fnherstal|build artyf 1; equip artillery 40|Field guns from the steelworks at Seraing.|
t13|The T-13 Tank Destroyer|cockerill|equip tanks 20; build tankp 1|A light tank with an anti-tank gun, for the canal line.|
airforce|The Aéronautique Militaire|army|equip aircraft 40; build aircraftp 1|Fairey Battles, Gladiators and Italian fighters: brave pilots in obsolete machines.|
mobilisation|Mobilisation|army|units inf 3; ws 4|August 1939: six hundred thousand men under arms.|date 1939-8
reserves|The Reserve Divisions|mobilisation|units inf 2; mp 30|Second-line divisions of older men, to hold the forts.|
cavalry|The Cavalry Corps|army|units cav 1, mot 1|Lancers, guides and motorcyclists.|
eighteendays|The Eighteen Days|lys|ws 4; legit 3|Eighteen days of war, and a surrender that will divide the country.|req atwar GER
namur|The Fortified Position of Namur|pfl|fort Charleroi|The forts on the Meuse at Namur, modernised.|
antwerpforts|The Antwerp Redoubt|kwline|fort Antwerp|The ring of forts around Antwerp, the national redoubt of 1914.|
cointet|The Belgian Gates|kwline|fort Brussels; spirit Steel Barricades: def .03|Steel anti-tank gates, the Cointet elements, across the roads of the KW line.|
dyle|Plan D|kwline|rel FRA 10, ENG 10|The French and British will advance to the Dyle when the Germans attack.|
navycorps|The Corps de Marine|army|equip ships 1|A few patrol boats on the Scheldt and the coast.|
# Flemings and Walloons
twopeoples|Two Peoples||stab 2; legit 1|Flemings in the north, Walloons in the south, and Brussels in between, French-speaking in a Flemish land.|ai 5
languagelaws|The Language Laws|twopeoples|bedo dutch|Dutch in the courts, schools and town halls of Flanders, as the laws of 1932 promised.|
frenchrights|French Speakers' Rights|twopeoples|bedo french|Guarantees for the French speakers of Brussels and the Walloon towns.|
nationalappeal|One Belgium|languagelaws,frenchrights|bedo unity|The King and the government speak for all Belgians, in both languages.|
ghent|The Dutch University of Ghent|languagelaws|befl 6; res 5|Since 1930 Flanders has a university that teaches in its own language.|
yser|The Yser Pilgrimage|languagelaws|befl 4; stab -1|Every summer tens of thousands of Flemings march to the tower at Diksmuide, built for the Flemish soldiers of 1914.|
amnesty|The Amnesty Law|yser|befl 6; bewa -4 ?? Pardon the activists of the last war => befl 6; bewa -4 // Refuse => bewa 4; befl -4|1937: should Flemings who collaborated with the Germans in 1914-18 be pardoned?|date 1937-6
armylanguage|Flemish Regiments|languagelaws|befl 5; spirit Regiments in Their Own Language: org .03|Flemish soldiers commanded in Dutch, at last.|date 1938-6
brussels|The Brussels Question|frenchrights|stab 1 ?? Keep Brussels bilingual => befl 2; bewa 2 // Let French dominate => bewa 4; befl -4|A Flemish city that speaks French, and will not stop growing.|
walloonmovement|The Walloon Movement|frenchrights|bewa 5; stab -1|Wallonia's industrial towns feel ruled by a Catholic, Flemish majority.|
walloonfrance|The Walloon Congress|walloonmovement|bewa 4; stab -3 ?? Refuse => bewa -6; stab 2 // Promise Wallonia autonomy => bewa 8; befl -4|October 1945: the Walloon Congress in Liège votes first, sentimentally, to join France.|date 1945-10
culturalautonomy|Cultural Councils|nationalappeal|befl 4; bewa 4; stab 2|Separate cultural councils for each language, in one state.|
banparties|Ban the VNV and Rex|nationalappeal|bedo ban|The Flemish nationalists and the Rexists are outlawed.|
flamenpolitik|The Flamenpolitik|languagelaws|befl 4; bewa -6|The Germans release the Flemish prisoners of war and keep the Walloons. They mean to divide Belgium.|req belFallen
walloonpows|The Walloon Prisoners|flamenpolitik|bewa 6; ws 3|Sixty thousand Walloon soldiers spend five years in German camps.|req belFallen
belgianunity|The Belgian Union|culturalautonomy|stab 3; befl 3; bewa 3|After the war, the two peoples rebuild one country, for now.|date 1945-6
frontpartij|The Front Party|yser|befl 4; stab -1|The party of the Flemish soldiers of the Yser, who were commanded in French.|
borms|The Borms Election|frontpartij|befl 4; bewa -3|In 1928 Flanders elected a convicted collaborator of the last war, from his prison cell.|
# Rex and the New Order
rex|Rex|twopeoples|ideo fas 3|Léon Degrelle's movement, named for Christ the King, against the corrupt parties and the banks.|ai 1
degrelle|Léon Degrelle|rex|ideo fas 4; rel ITA 5|A young Catholic journalist with a gift for crowds and money from Mussolini.|ai 1
vnv|The VNV|twopeoples|ideo fas 3; befl 3|Staf De Clercq's Flemish National League: a Flemish state, and then a Greater Netherlands.|ai 1
rexvnv|The Rex-VNV Pact|degrelle,vnv|ideo fas 4; stab -2|October 1936: Degrelle and De Clercq agree to work together, against Belgium's parties.|date 1936-10; ai 1
newordergov|A Government of the New Order|rexvnv|setIdeo fas; leader Léon Degrelle/Rex; stab -10; legit -15|With German support, Rex and the VNV divide the ministries.|ai 0
legionwallonie|The Walloon Legion|newordergov|units inf 1; rel GER 10|Degrelle leads Walloon volunteers to the Eastern Front.|ai 0; req ideo fas & gerSovWar
flemishlegion|The Flemish Legion|newordergov|units inf 1; befl 3|Flemish volunteers in the Waffen-SS.|ai 0; req ideo fas & gerSovWar
devlag|DeVlag|newordergov|befl 4; bewa -6|The SS's own Flemish movement: Flanders into the Reich.|ai 0; req ideo fas
greaterneth|A Greater Netherlands|devlag|claim Amsterdam, Rotterdam|The VNV's dream: Flanders and the Netherlands in one Dutch state.|ai 0; req ideo fas
axis|The Axis Camp|newordergov|fn joinAxis|Belgium joins the New Order.|ai 0; req ideo fas
verdinaso|Verdinaso|vnv|ideo fas 2; befl 2|Joris Van Severen's black-shirted Dietse movement, which turns to Belgian unity; he is shot by French soldiers at Abbeville in May 1940.|ai 1
# The King's Choice
leopold|King Leopold III|twopeoples|legit 3; stab 2|Young, handsome, shy, and since Queen Astrid's death in 1935, alone.|
wijnendale|The Meeting at Wijnendale|leopold|legit -2 ?? The King stays with his army => legit -3; stab 2 // The King goes with his ministers => legit 4; stab -2|25 May 1940: at a château near the coast, the King and his four ministers part. He will stay; they will go.|req atwar GER
laeken|The Prisoner of Laeken|wijnendale|legit -2; stab 2|The King lives under guard in his palace and does nothing, or so he says.|req belFallen
berchtesgaden|The Visit to Berchtesgaden|laeken|legit -6 ?? Go and ask Hitler for the prisoners' release => rel GER 10; legit -6 // Refuse to go => legit 3|November 1940: the King meets Hitler. He gets nothing; Belgians will never forgive him for asking.|date 1940-11; req belFallen
lilian|The King's Second Marriage|laeken|legit -6; stab -2|September 1941: the King marries Lilian Baels in secret while his soldiers are prisoners.|date 1941-9; req belFallen
politicaltestament|The Political Testament|laeken|legit -4|1944: the King writes that he will not take back the ministers who called him a traitor.|date 1944-1; req belFallen
deported|The King Deported|politicaltestament|legit 2; stab -2|June 1944: the Germans take the King to Germany.|date 1944-6; req belFallen
regency|The Regency of Prince Charles|deported|legit 4; stab 3|September 1944: Parliament makes the King's brother regent.|date 1944-9
royalquestion|The Royal Question|regency|stab -4 ?? Bring the King home => legit -4; stab -6 // Ask him to abdicate for his son => legit 4; stab 2|1950: a referendum gives the King 57 per cent, but Wallonia and Brussels vote no. Strikes, riots, and three dead at Grâce-Berleur.|date 1950-3
baudouin|King Baudouin|royalquestion|legit 6; stab 4|July 1951: the King abdicates for his son, a shy young man of twenty.|date 1951-7
astrid|The Memory of Queen Astrid|leopold|stab 2; legit 2|August 1935: the young Swedish-born Queen dies in a car crash in Switzerland; all Belgium mourns.|
queenelisabeth|Queen Elisabeth|leopold|legit 2; stab 1|The Queen Mother, patron of musicians and scientists, who will protect Jewish children during the war.|
ysaye|The Ysaÿe Competition|queenelisabeth|legit 1; stab 1|1937: a violin competition in Brussels, won by a young Soviet violinist named David Oistrakh.|date 1937-3
princebaudouin|The Young Prince|astrid|stab 1|Baudouin, the heir, is six years old in 1936.|
# The Government in London
pierlotescape|Across the Pyrenees|pierlot|legit 4; rel ENG 10|October 1940: Pierlot and Spaak escape from Vichy France through Spain, hidden in the back of a lorry.|date 1940-8; req belFallen
eatonsquare|Eaton Square|pierlotescape|pp 20; legit 3|The Belgian government in London, with the Congo and the gold behind it.|req belFallen
gutt|Camille Gutt|eatonsquare|money 6; pp 10|The finance minister who runs the war on Congolese copper.|req belFallen
gold|The Belgian Gold|eatonsquare|money -6 ?? Demand the gold back from Vichy => rel FRA -10; money 4 // Let the Bank of France keep it => money -6|The National Bank's gold went to France in 1940 and then to Dakar; Vichy hands it to the Germans.|req belFallen
brigadepiron|The Piron Brigade|eatonsquare|units inf 2|Belgian volunteers who will land in Normandy and liberate Brussels.|req belFallen
pilots|Belgian Pilots|brigadepiron|equip aircraft 30; rel ENG 5|Nos. 349 and 350 Squadrons, RAF.|req belFallen
radiobelgique|Radio Belgique|eatonsquare|ws 6|The BBC speaks French and Dutch to the occupied country every night.|req belFallen
merchantships|The Belgian Merchant Fleet|eatonsquare|seaton 1; rel ENG 5|Belgian ships sail in the Allied convoys.|req belFallen
alliedbelgium|An Allied Nation|eatonsquare|fn joinAllies; legit 4|Belgium fights on, with its government, its colony and its ships.|req belFallen
belgiansas|The Belgian SAS|brigadepiron|units inf 1; resist SELF 4|Paratroopers who jump into the Ardennes in 1944.|date 1944-6
postwarplans|The Postwar Commission|eatonsquare|pp 10; legit 2|In London, Belgian experts plan the country they will go home to.|req belFallen
newyorkinfo|The Belgian Information Center|eatonsquare|rel USA 10|Belgium tells its story to America from Fifth Avenue.|req belFallen
middleeast|Belgians in the Middle East|nigeria|rel ENG 5|The Congolese brigade guards Egypt and Palestine.|req belFallen
# The Occupation
falkenhausen|General von Falkenhausen|eighteendays|stab -2|A Prussian general, once adviser to Chiang Kai-shek, governs Belgium for the German army.|req belFallen
secretaries|The Secretaries-General|falkenhausen|stab 2 ?? Keep the administration running => stab 2; legit -2 // Order them to resign => legit 3; stab -3|The ministers are gone; the civil servants stay to choose the lesser evil.|req belFallen
galopin|The Galopin Doctrine|secretaries|money 4 ?? Keep the factories working => money 4; rel GER 5 // Slow everything down => money -4; ws 3|The governor of the Société Générale argues that industry must work, or Belgians will starve or be deported.|req belFallen
forcedlabour|Forced Labour|galopin|stab -4; mp -20|October 1942: young Belgians are sent to work in German factories.|date 1942-10; req belFallen
blackmarket|The Black Market|secretaries|money 2; stab -2|Butter and coal at night prices, and rationed bread by day.|req belFallen
malines|The Dossin Barracks|falkenhausen|ws 3; legit -2|Mechelen, 1942: the assembly camp for the deportation of Belgium's Jews.|date 1942-7; req belFallen
convoy20|The Twentieth Convoy|malines|ws 4; resist SELF 4|April 1943: three young men with one pistol stop a deportation train; over two hundred prisoners escape.|date 1943-4; req belFallen
hiddenchildren|The Hidden Children|malines|legit 3; ws 2|Convents, boarding schools and families hide three thousand Jewish children.|req belFallen
strike100000|The Strike of the 100,000|forcedlabour|ws 4; stab -2|May 1941: the steelworkers of Liège, led by the women, strike for bread.|date 1941-5; req belFallen
# The Resistance
secretarmy|The Secret Army|eighteendays|units mil 2; resist SELF 6|Officers of the old army organise the underground.|req belFallen
indepfront|The Independence Front|secretarmy|resist SELF 6; ideo com 2|Communists, Catholics and liberals in one movement.|req belFallen
groupeg|Groupe G|secretarmy|resist SELF 8|Engineers from the Free University blow up the high-tension lines: in one night in January 1944 the whole power grid goes down.|date 1944-1; req belFallen
cometline|The Comet Line|secretarmy|rel ENG 15; ws 3|Andrée de Jongh walks shot-down Allied airmen across the Pyrenees: eight hundred reach Gibraltar.|date 1941-8; req belFallen
fauxsoir|The Fake Le Soir|indepfront|ws 6|November 1943: the resistance prints its own edition of the collaborationist daily, mocking the Germans, and sells it on the streets.|date 1943-11; req belFallen
libre|La Libre Belgique|indepfront|ws 3|The clandestine paper of the last war appears again.|req belFallen
whitebrigade|The White Brigade|secretarmy|resist SELF 5|The Antwerp resistance, which will help the British take the port intact.|req belFallen
# The Congo
congo|The Belgian Congo||money 6; legit 1|A colony eighty times the size of Belgium: copper, cobalt, diamonds, rubber, and uranium.|ai 5
ryckmans|Governor-General Ryckmans|congo|legit 3; pp 15|Pierre Ryckmans, who will tell the Congo in May 1940 that it fights on.|
unionminiere|Union Minière|congo|money 6; build ironm 1|The copper and cobalt mines of Katanga.|
shinkolobwe|Shinkolobwe|unionminiere|money 2; res 5|A mine in Katanga with the richest uranium ore in the world.|
sengier|Ship the Ore to New York|shinkolobwe|bedo sengier|September 1940: Edgar Sengier quietly ships twelve hundred tons of uranium ore to a warehouse on Staten Island.|date 1940-9
manhattanore|The Ore for Manhattan|sengier|uran USA; rel USA 15; money 4|September 1942: an American colonel asks if the ore can be had; Sengier tells him it is already in New York.|date 1942-9
forcepublique|The Force Publique|congo|units inf 2|The Congo's own army, African soldiers and Belgian officers.|
saio|The Victory at Saïo|forcepublique|ws 6; rel ENG 10|July 1941: the Force Publique captures an Italian army in Ethiopia.|date 1941-7; req atwar ITA
nigeria|The Congolese in Nigeria|saio|units inf 1; rel ENG 5|A Congolese brigade guards West Africa and goes on to the Middle East.|req belFallen
wareffort|The War Effort|unionminiere|money 4; stab -2|Forced labour on plantations and in mines to supply the Allies with copper, rubber and palm oil.|req belFallen
forminiere|Diamonds of Kasai|congo|money 4|Industrial diamonds for the machine tools of the Allies.|
matadi|The Matadi Railway|congo|build railway 1; build port 1|The line around the rapids from the sea to Léopoldville.|
ruanda|Ruanda-Urundi|congo|stab 1; legit -1|The mandate taken from Germany in 1919, governed through the Tutsi kings.|
kimbangu|The Prophet in Prison|congo|stab 1 ?? Keep Kimbangu in prison => stab 1; legit -2 // Release him => legit 2; stab -2|Simon Kimbangu, who preached in 1921, is still in a cell in Élisabethville.|
elisabethvillestrike|The Élisabethville Strike|wareffort|stab -2 ?? Fire on the strikers => stab 2; legit -4 // Raise their wages => money -2; stab 1|December 1941: African miners strike at Union Minière.|date 1941-12
sabenacongo|Sabena to Léopoldville|congo|rel ENG 5; money 1|The airline that links Brussels to the Congo, and flies the Allied route across Africa.|
tenyearplan|The Ten-Year Plan|congo|build railway 1, construction 1; money -4|1949: roads, schools and hospitals for the Congo.|date 1949-1
leopoldville|Léopoldville|congo|build urban 1; money 1|The capital, on the river opposite Brazzaville.|
congofights|The Congo Fights On|ryckmans|legit 4; rel ENG 10|May 1940: Ryckmans tells the colony that it will stay in the war, whatever happens in Belgium.|req belFallen
evolues|The Évolués|leopoldville|stab 1 ?? Give educated Congolese a status => legit 2; stab -1 // Leave things as they are => stab 1|Clerks, teachers and nurses who want to be citizens, not subjects.|
luluabourg|The Luluabourg Mutiny|evolues|stab -3|February 1944: the soldiers of the Force Publique garrison rise against their officers.|date 1944-2
uraniumagreement|The Uranium Agreement|manhattanore|money 8; rel USA 10, ENG 10; uran ENG|1944: Belgium agrees to sell the Congo's uranium only to the United States and Britain.|date 1944-9
# Coal, Steel and the Port
coal|The Coal of Wallonia||money 4; build coalm 1|The pits of the Borinage, Charleroi and Liège, the oldest coalfield on the continent.|ai 4
steel|Cockerill and Ougrée|coal|build steel 2|The steelworks of the Meuse valley.|
glass|The Glassworks of Charleroi|coal|money 3; build construction 1|Window glass for the world.|
zinc|Vieille Montagne|coal|money 3; build ironm 1|The zinc works at Moresnet and Liège.|
solvay|Solvay|coal|build chem 2; res 5|Soda from Couillet and a family of chemists who fund physics.|
gevaert|Gevaert|solvay|build chem 1; money 2|Photographic film from Mortsel.|
antwerp|The Port of Antwerp|coal|build port 2; money 4|The second port of Europe, on the Scheldt.|
diamonds|The Diamond Quarter|antwerp|money 4|Antwerp cuts most of the world's diamonds, many of them from the Congo.|
albertcanalport|The Canal to Liège|antwerp|build railway 1; money 2|1939: the Albert Canal opens, linking Liège's industry to Antwerp's port.|date 1939-7
societegenerale|The Société Générale|coal|money 6; ig ind 4|The holding company that owns a third of Belgium's industry and much of the Congo.|
belga|The Belga|societegenerale|money 2 ?? Defend the currency => money 2 // Let it slide => unemp -2; inflx 2|Five francs make one belga, for foreign trade at least.|
sabena|Sabena|antwerp|money 2|The national airline, flying Savoia-Marchettis to Africa.|
minerva|Minerva Cars|steel|build autos 1|Luxury cars from Antwerp, and army lorries when needed.|
textiles|The Mills of Ghent|antwerp|build textile 2|Flax and cotton mills along the Leie.|
rails|The Densest Railways in the World|steel|build railway 1; infra 1|Every village in Belgium is near a station.|
borinage|The Misery of the Borinage|coal|stab -2 ?? Invest in the old mines => money -4; ig union 4 // Leave it to the companies => ig ind 4; stab -1|Miners' cottages and slag heaps, where Van Gogh once preached.|
kempen|The Kempen Coalfield|coal|build coalm 1; befl 2|New pits in Flemish Limburg, deeper and richer than the old Walloon ones.|
bankofbrussels|The Bank of Brussels|societegenerale|money 2|The second financial power of Belgium, after the Société Générale.|
# Liberation and After
liberation|Brussels Liberated|alliedbelgium|ws 8; legit 6; stab 6|3 September 1944: the Welsh Guards drive into Brussels; the city goes mad with joy.|date 1944-9; req belFallen
antwerpintact|The Port Taken Intact|liberation|build port 1; rel ENG 10|4 September 1944: with the help of the resistance, British tanks take the docks of Antwerp before the Germans can blow them.|date 1944-9; req belFallen
vweapons|The V-Weapons on Antwerp|antwerpintact|stab -4; ws 4|Winter 1944: more flying bombs and rockets fall on Antwerp than on any other city.|date 1944-10
bulge|The Battle of the Bulge|liberation|stab -4; ws 4|December 1944: the Germans strike through the Ardennes once more; Bastogne holds.|date 1944-12
gutteoperation|The Gutt Operation|liberation|inflx -6; money -4; stab -1|October 1944: all banknotes are exchanged and most bank accounts frozen, to stop inflation in one stroke.|date 1944-10
socialpact|The Social Pact|liberation|law welfare_state; stab 4; ig union 4|Employers and unions, meeting in secret during the war, agree on social security for all.|date 1944-12
repression|The Repression|liberation|stab 2 ?? Try every collaborator => legit 3; stab -2 // Try only the leaders => stab 3; befl 2|Four hundred thousand files are opened; two hundred and forty-two are executed.|date 1944-11
marshall|The Marshall Plan|socialpact|money 10; rel USA 10|American credits for Belgian steel and coal.|date 1947-6
nato|The Atlantic Pact|marshall|fn joinAllies; rel USA 10|1949: no more policy of independence.|date 1949-4
coalminers|Italian Miners|marshall|mp 20; build coalm 1|1946: Belgium trades coal for Italian workers, fifty thousand of them.|date 1946-6
womensvote|Votes for Women|socialpact|legit 4; stab 1|1948: Belgian women vote in national elections for the first time.|date 1948-3
oeec|The OEEC|marshall|legit 1; rel FRA 5, HOL 5|The European organisation that shares out the Marshall money.|date 1948-4
# Spaak's Europe
benelux|The Benelux|spaak|trade HOL, LUX; rel HOL 15, LUX 15|September 1944, London: a customs union of Belgium, the Netherlands and Luxembourg.|date 1944-9
unassembly|President of the General Assembly|benelux|legit 4; rel USA 5, ENG 5|1946: Spaak is elected the first president of the United Nations General Assembly.|date 1946-1
brusselstreaty|The Brussels Treaty|unassembly|rel ENG 10, FRA 10, HOL 10, LUX 10|March 1948: five western nations sign a defence pact in Brussels.|date 1948-3
councilofeurope|The Council of Europe|brusselstreaty|legit 3|1949: Spaak presides over the first assembly of Europe in Strasbourg.|date 1949-5
coalsteel|Coal and Steel for Europe|councilofeurope|money 4; build steel 1|1951: a common market for coal and steel with France, Germany, Italy and the Netherlands.|date 1950-5
# Culture and Science
herge|Hergé|twopeoples|stab 2; legit 1|A young illustrator's reporter with a quiff and a white dog, in the children's supplement of a Catholic paper.|
tintinsoir|Tintin in Le Soir|herge|stab 1 ?? Keep drawing for the occupied paper => stab 1; legit -2 // Stop drawing => legit 1|1940: the Catholic paper closes; Hergé goes on drawing for Le Soir, now under German control.|req belFallen
magritte|Magritte|herge|legit 1|This is not a pipe: surrealism in a bowler hat, from a suburb of Brussels.|
simenon|Simenon|magritte|legit 1; rel FRA 5|A man from Liège writes a novel every few weeks about a pipe-smoking commissaire.|
django|Django Reinhardt|magritte|stab 1|A Belgian-born Gypsy guitarist plays jazz in Paris with two fingers of his left hand.|
lemaitre|Lemaître's Primeval Atom|twopeoples|res 10|A priest at Louvain proposes that the universe began as a single atom.|
louvain|The Library of Louvain|lemaitre|legit 2; ws 3|Burned by the Germans in 1914, rebuilt with American money, burned again in May 1940.|req atwar GER
bordet|The Pasteur Institute of Brussels|lemaitre|spirit Bordet's Institute: growth .01|Jules Bordet's laboratory of immunology.|
cyclists|The Tour de France|herge|ws 2; stab 1|Sylvère Maes wins the Tour in 1936 and 1939. Belgium cheers.|date 1936-8
comics|Spirou and Tintin|herge|stab 1; money 1|1946: a magazine for Tintin, and a rival called Spirou: the Belgian school of comics.|date 1946-9
ensor|James Ensor|magritte|legit 1|The old painter of masks and skeletons in his house in Ostend.|
delvaux|Paul Delvaux|magritte|legit 1|Sleepwalking women in railway stations.|
maeterlinck|Maeterlinck|simenon|legit 1; rel USA 5|The Nobel playwright of The Blue Bird flees to America in 1940.|
ghelderode|Ghelderode's Theatre|ensor|stab 1|Carnival, death and the devil in the plays of a clerk from Brussels.|
piccard|Piccard's Balloon|lemaitre|res 10|A professor at the Free University rose higher than anyone into the stratosphere; now he designs a craft for the deepest sea.|
royalacademy|The Royal Academies|lemaitre|res 5; legit 1|Separate academies of science and letters for Flemings and French speakers, and a royal one for both.|
liegebastogne|Liège-Bastogne-Liège|cyclists|stab 1; ws 1|The oldest classic of cycling, through the hills of the Ardennes.|
# The Communists
pcb|The Communist Party|twopeoples|ideo com 3|The party of the miners of the Borinage and Liège.|ai 1
communistres|The Partisans|pcb|resist SELF 5; ideo com 3|The armed partisans of the Independence Front, most of them Communists.|req belFallen
redwallonia|Red Wallonia|pcb|ideo com 4; bewa 3|1946: the Communists win twelve per cent, on their resistance and in the coal towns.|date 1946-2; ai 1
peoplesbelgium|A Belgian People's Republic|redwallonia|setIdeo com; leader Julien Lahaut/Communist Party; stab -8|The councils of the partisans take over.|ai 0
redcamp|With Moscow|peoplesbelgium|fn joinComintern|Belgium joins the camp of the Soviet Union.|ai 0; req ideo com
# The Cities
brusselscity|Brussels|twopeoples|build urban 1; money 2|The capital, with its Grand Place and its giant Palace of Justice.|
liege|Liège|coal|stab 1; ig union 2|The fiery city of the Walloon steelworkers.|
ghentcity|Ghent|textiles|stab 1|The city of the Flemish textile workers and the Dutch-speaking university.|
bruges|Bruges|ghentcity|legit 1|The dead city of canals, beloved of English tourists.|
ostend|Ostend|bruges|build port 1|The ferries to Dover, and the beach of the kings.|
coast|The Flemish Coast|bruges|money 1; stab 1|Knokke, De Haan and De Panne: the beaches of the Belgian holiday.|
zeebrugge|Zeebrugge|coast|build port 1|The harbour of Bruges, where the British sank blockships in 1918.|
polders|The Polders of the Yser|coast|build farm 1|Flat fields behind the dunes, flooded on purpose in 1914 to stop the Germans.|
yserflood|Flood the Yser Again?|polders|fort Ghent ?? Prepare the sluices at Nieuwpoort => fort Ghent // Leave the fields dry => stab 1|In 1914 the sluice-keepers of Nieuwpoort flooded the Yser plain and saved the last corner of Belgium.|req tension 50
liegeuni|The University of Liège|liege|res 5; build university 1|The engineers and scientists of the Walloon industrial country.|
ghentport|The Port of Ghent|ghentcity|build port 1; money 1|The canal from Ghent to Terneuzen, through the Netherlands to the sea.|
# Daily Life
fritkot|The Chip Stalls|brusselscity|stab 1|Fried potatoes in a paper cone, on every square.|
rationing|Ration Stamps|mobilisation|spirit Ration Stamps: needs -.04|Bread and coal on stamps, from the first winter of the war.|date 1940-6
breweries|The Abbey Breweries|brusselscity|money 1; stab 1|Monks and village brewers keep up the old ales.|
binche|The Gilles of Binche|liege|stab 1|On Shrove Tuesday the Gilles dance through Binche in wax masks, throwing oranges.|
unionsg|Union Saint-Gilloise|brusselscity|stab 1|The Brussels club that went sixty matches unbeaten between 1933 and 1935.|
grandplace|The Grand Place|brusselscity|legit 1; stab 1|The most beautiful square in the world, Victor Hugo said.|
# The Catholic World
catholicparty|The Catholic Party|tripartite|ig devout 3; stab 1|The largest party: farmers' leagues, Christian unions and the middle class of the towns.|
vanroey|Cardinal Van Roey|catholicparty|legit 2; ideo fas -2|The Archbishop of Mechelen, who condemns Rex in 1937 and forced labour in 1943.|
boerenbond|The Boerenbond|catholicparty|ig rural 4; build farm 1|The Catholic farmers' league, with its own bank, cooperatives and schools.|
christianunions|The Christian Unions|catholicparty|ig union 3; stab 1|The ACV and CSC, the unions of the Catholic workers.|
cardijn|Cardijn's Young Workers|christianunions|stab 2|A priest from Halle builds the Young Christian Workers, spreading to every continent.|
psccvp|The Christian Social Party|vanroey|stab 2; legit 2|August 1945: the Catholics refound their party, open to all.|date 1945-8
# The Socialist World
pob|The Labour Party|tripartite|ig union 3; ideo dem 2|The POB-BWP of Vandervelde and De Man.|
vooruit|The Vooruit Cooperative|pob|ig union 2; money 1|Bakeries, shops, a bank and a theatre for the workers of Ghent.|
maisonsdupeuple|The People's Houses|pob|stab 1|In every industrial town, a House of the People with a café, a library and a hall.|
vanacker|Van Acker|socialpact|leader Achille Van Acker/Belgian Socialist Party; pp 20; stab 2|February 1945: a former docker from Bruges becomes Prime Minister and builds social security.|date 1945-2
fgtb|The FGTB|vanacker|ig union 4|1945: the socialist unions unite in one federation.|date 1945-4
# The Liberal World
liberalparty|The Liberal Party|tripartite|ig ind 3; legit 1|The party of the anticlerical bourgeoisie of Brussels and Ghent.|
ulb|The Free University Closes|liberalparty|legit 3; ws 3|November 1941: rather than accept Nazi professors, the Free University of Brussels closes itself.|date 1941-11; req belFallen
# The Eastern Cantons
eupen|The Eastern Cantons|twopeoples|stab 1|Eupen, Malmedy and Sankt Vith, German-speaking, Belgian since 1920.|
heimtreu|The Heimattreue Front|eupen|stab -2|The pro-German party of the cantons wants to go back to the Reich.|
annexedcantons|Annexed to the Reich|heimtreu|stab -3|May 1940: Germany annexes the cantons; their young men are drafted into the Wehrmacht.|req belFallen
malmedy|The Malmedy Massacre|annexedcantons|ws 4|December 1944: SS troops shoot eighty-four American prisoners at the Baugnez crossroads.|date 1944-12
`);

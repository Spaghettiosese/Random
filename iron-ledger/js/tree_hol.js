// The Netherlands (2.2): hand-written. Colijn's Netherlands of the gold guilder and the pillars; the policy of independence;
// the Water Line, worked through the inundations; the fleet and the East Indies, whose oil Japan wants, worked through the
// oil contracts; the occupation, the strikes and the Hunger Winter; the Queen in London; Mussert's Netherlands; and the
// Netherlands that is rebuilt and loses an empire.
'use strict';
TREES.HOL = autoTree('nl_', `
# Colijn's Netherlands
colijn|Colijn's Cabinet||pp 30; stab 3|Hendrikus Colijn, former general, oil director and Calvinist, governs a country in the depths of the slump.|ai 6
austerity|Sound Money|colijn|money 6; unemp 2; stab -1|Balanced budgets and the guilder on gold, whatever the cost in jobs.|
goldbloc|The Gold Bloc|austerity|money 2 ?? Hold the gold standard => money 2; unemp 2 // Leave gold and devalue => devalue; unemp -3|With France and Switzerland, the guilder is one of the last currencies tied to gold.|date 1936-1
devaluation|The Guilder Floats|goldbloc|unemp -3; money 4; stab 2|27 September 1936: the gold bloc breaks up, and Colijn lets the guilder go. Exports recover at once.|date 1936-9
workrelief|Work Relief|colijn|unemp -3; build railway 1, construction 1|The unemployed dig canals and build roads for their benefit money.|
zuiderzee|The Zuiderzee Works|workrelief|build farm 2; unemp -2|The enclosing dike was closed in 1932; now the polders are pumped dry, one by one.|
noordoost|The Northeast Polder|zuiderzee|build farm 2; popgrow 1|1937 to 1942: a new province rises out of the IJsselmeer.|date 1937-1
election37|The Election of 1937|colijn|legit 5; pp 20|May 1937: Colijn's party gains, and the National Socialists fall back to four per cent.|date 1937-5
colijnfive|The Fifth Colijn Cabinet|election37|stab -2 ?? Govern without the Catholics => pp 20; stab -2 // Keep the Catholics in => stab 2|July 1939: Colijn's last cabinet falls in two days.|date 1939-7
degeer|De Geer's Cabinet|colijnfive|leader Dirk Jan de Geer/CHU; pp 20; stab 2|August 1939: a cautious old man forms a government with the Social Democrats in it for the first time.|date 1939-8
sdapgov|Socialists in Government|degeer|ig union 6; ideo dem 3; stab 2|The SDAP, which once dreamed of revolution, takes two ministries.|
unemployment|The Unemployment Fund|workrelief|unemp -2; money -3; stab 2|Help for the half a million without work.|
welfare|Old-Age Pensions|sdapgov|money -4; stab 3|A pension for the old, paid by the state.|
dreespension|Drees's Emergency Pension|welfare|law welfare_state; stab 4|1947: Willem Drees gives every Dutch man and woman over sixty-five a pension.|date 1947-5
# The Pillars
pillars|The Pillars||stab 3; legit 2|Catholics, Protestants, socialists and liberals each have their own schools, papers, unions, broadcasters and football clubs.|ai 4
catholics|The Catholic State Party|pillars|ig devout 4; stab 1|The largest party, led by priests and lawyers from the south.|
arp|The Anti-Revolutionaries|pillars|ig devout 3; legit 1|Colijn's Calvinists, the party of the small people of the Reformation.|
sdap|The Social Democrats|pillars|ig union 4; ideo dem 2|Koos Vorrink's party, which abandons its pacifism in 1937.|
liberals|The Liberals|pillars|ig ind 3|The party of the merchants of Amsterdam and the professors of Leiden.|
broadcasters|The Broadcasting Associations|catholics,sdap|pp 10; ws 2|KRO, NCRV, VARA and AVRO share the airwaves, each with its own pillar.|
schoolpeace|The School Peace|catholics,arp|stab 2; spirit Schools for Every Pillar: literacy .02|Since 1917 the state pays for Catholic, Protestant and public schools alike.|
romme|Carl Romme|catholics|pp 10; legit 1|The Catholic leader who will dominate the coalitions after the war.|
vorrink|Koos Vorrink|sdap|ideo dem 2; ws 2|The Social Democratic chairman, who will lead the party underground.|
newparty|The Breakthrough|vorrink|ideo dem 3; stab 2|After the war, the Labour Party tries to break through the walls between the pillars.|date 1946-2
kvp|The Catholic People's Party|romme|ig devout 3; stab 1|December 1945: the Catholics renew their party for the post-war world.|date 1945-12
# The Policy of Independence
independence|The Policy of Independence||pp 20; legit 2|The Netherlands stayed out of the last war, and will stay out of the next.|ai 6
oslostates|The Oslo States|independence|trade SWE, NOR, DEN, BEL, FIN|The small democracies of the north and the west stand together, on trade at least.|
noalliances|No Alliances|independence|legit 2 ?? Refuse every alliance => rel GER 5 // Talk quietly to Britain => rel ENG 10; rel GER -5|The government will not even hold staff talks with the British or the Belgians.|
article16|Free of Article Sixteen|oslostates|pp 10 ?? We are no longer bound to sanctions => rel ITA 5 // We stay loyal to Geneva => rel ENG 5, FRA 5|July 1936: the Netherlands declares, with the Oslo States, that League sanctions no longer bind it.|date 1936-7
peaceoffer|The Royal Peace Offer|noalliances|legit 3; rel ENG 5, GER 5|November 1939: Queen Wilhelmina and King Leopold offer their good offices for peace. No one accepts.|date 1939-11
venlo|The Venlo Incident|noalliances|rel GER -10; stab -2|November 1939: German agents kidnap two British officers at the border; a Dutch officer is shot. Berlin will call it a breach of neutrality.|date 1939-11
sas|The Warnings of Major Sas|venlo|ws 4; legit 1|The military attaché in Berlin is told the date of the attack by a German officer. No one in The Hague believes him.|date 1940-1
mobilisation|Mobilisation|noalliances|units inf 3; ws 4|August 1939: 280,000 men under arms.|date 1939-8
britishguarantee|Britain's Guarantee|noalliances|rel ENG 10|London says it will not let the Low Countries fall. The Hague says nothing.|
belgiumtalks|Talks with Brussels|oslostates|rel BEL 15|Two neutrals with the same enemy, who cannot agree to plan together.|
britishfriends|Friends Across the North Sea|noalliances|rel ENG 10; trade ENG|Britain is the best customer for Dutch butter and bacon, and the oldest ally of the House of Orange.|
germantrade|The German Hinterland|noalliances|trade GER; money 3|The Rhine trade: German coal and steel through Rotterdam.|
americanfriends|The Dutch Americans|britishfriends|rel USA 10|New York was New Amsterdam once.|
# The Water Line
waterline|The New Dutch Water Line|mobilisation|fort Utrecht; spirit Prepared Sluices: def .04|Forts, dikes and sluices from the Zuiderzee to the Waal, ready to drown the land in front of Holland.|
inundate|Open the Sluices|waterline|hldo flood|The polders east of Utrecht go under knee-deep water: too deep to march through, too shallow for boats.|req atwar GER
drain|Drain the Polders|inundate|hldo drain|Close the sluices and pump the water back out.|
grebbe|The Grebbe Line|waterline|fort Utrecht; units inf 1|Trenches and casemates on the Grebbeberg, the gate to the Water Line.|
peelraam|The Peel-Raam Line|grebbe|fort Eindhoven|Anti-tank ditches across the marshes of North Brabant.|
kornwerderzand|Kornwerderzand|waterline|fort Amsterdam; spirit Kornwerderzand: def .04|Casemates on the great enclosing dike, which hold for three days against everything the Germans send.|
fortressholland|Fortress Holland|kornwerderzand,grebbe|fort Amsterdam, Rotterdam|Amsterdam, The Hague, Rotterdam and Utrecht behind water, the last redoubt.|
reijnders|General Reijnders|mobilisation|generals Izaak Reijnders/3/def|The commander-in-chief who wants to defend the Grebbe Line and is overruled.|
winkelman|General Winkelman|reijnders|generals Henri Winkelman/3/def|February 1940: a retired general takes command of an army of reservists.|date 1940-2
thehague|The Hague Airfields|winkelman|ws 6; legit 2|10 May 1940: German paratroopers land at Ypenburg, Ockenburg and Valkenburg to seize the Queen. Dutch troops throw them back.|req atwar GER
moerdijk|The Moerdijk Bridges|winkelman|fort Rotterdam ?? Blow the bridges in time => fort Rotterdam // Hold them for the French => rel FRA 10|The long bridges over the Hollandsch Diep lead straight into Fortress Holland.|
maasbridges|The Maas Bridges|thehague|ws 4|Marines hold the north bank of the Maas in Rotterdam for five days.|req atwar GER
rotterdamblitz|The Bombing of Rotterdam|maasbridges|stab -6; ws 6|14 May 1940: the old city burns while the surrender is being negotiated.|req atwar GER
capitulation|The Capitulation at Rijsoord|rotterdamblitz|stab 2 ?? Surrender the army in Holland => stab 2 // Fight on in Zeeland => units inf 1; ws 4|Winkelman surrenders the army to save Utrecht from Rotterdam's fate; Zeeland fights on for three more days.|req atwar GER
fokker|Fokker Fighters|reijnders|build aircraftp 1; equip aircraft 40|The D.XXI fighter and the G.I "Reaper" from Amsterdam-Noord.|
airforce|The Army Aviation Brigade|fokker|equip aircraft 40; spirit The Aviation Brigade: air .05|Too few aircraft, too late, but flown with skill.|
artillery|New Guns|reijnders|build artyf 1; equip artillery 40|Bofors guns ordered from Sweden, and anti-tank guns from Austria.|
reservists|The Reserve Divisions|mobilisation|units inf 2; mp 30|Clerks and farmers in grey-green uniforms, with rifles from 1895.|
borderguard|The Border Battalions|reservists|units mil 2; fort Groningen|Light troops to blow the bridges on the IJssel and the Maas.|
lightdivision|The Light Division|reservists|units mot 1|Bicycle troops and hussars on motorcycles, the army's only mobile force.|
pampus|The Forts of Amsterdam|fortressholland|fort Amsterdam|Pampus, IJmuiden and the forts of the Defence Line of Amsterdam.|
antiaircraft|Anti-Aircraft Guns|artillery|equip artillery 20; spirit Air Defence: civdef .04|Bofors guns around the airfields and the cities.|
staffcollege|The Staff College|reijnders|spirit The Higher War School: org .03|Officers trained in the lessons of 1914, waiting for 1940.|
defencebudget|The Defence Budget|mobilisation|units inf 1; money -3; build arms 1|After twenty years of cuts, the money comes back in 1936.|date 1936-6
# The Fleet
fleet|The Royal Netherlands Navy||equip ships 3; seaton 1|Cruisers and destroyers for the Indies, minelayers and submarines for home waters.|ai 4
fleetplan|The Fleet Plan of 1939|fleet|build shipyard 1; equip ships 4; money -6|Battlecruisers for the Indies, designed with German help, and never built.|date 1939-6
cruisers|De Ruyter and Java|fleet|equip ships 3|Light cruisers for the Java Sea.|
submarines|The Submarine Service|fleet|equip ships 2; spirit The Snorkel: navy .05|Dutch submarines breathe through a pipe while submerged; the Germans will copy the idea.|
doorman|Karel Doorman|cruisers|generals Karel Doorman/3/off|The rear admiral who will lead the Allied squadron in the Java Sea.|
fleetescape|The Fleet Sails for England|fleet|seaton 2; rel ENG 10|May 1940: every ship that can sail leaves for British ports.|req holFallen
javasea|The Battle of the Java Sea|doorman|ws 6; equip ships -3|February 1942: Doorman attacks the Japanese invasion fleet with everything he has. "I am attacking, follow me."|date 1942-2; req japWar
malaccasubs|Submarines in the South China Sea|submarines|rel ENG 5; ws 3|December 1941: Dutch submarines sink Japanese troopships off Malaya in the first week of the war.|date 1941-12; req japWar
minelayers|The Minelayers|fleet|fort Vlissingen|Minefields in the Scheldt and the Wadden Sea.|
# The East Indies
indies|The Netherlands East Indies||money 6; legit 2|Sixty million people, and the oil, rubber and tin of the world.|ai 5
knil|The KNIL|indies|units inf 2|The Royal Netherlands Indies Army: Indonesian soldiers, Dutch officers.|
knilair|The Indies Air Force|knil|equip aircraft 40|Glenn Martin bombers and Brewster fighters for Java.|
oilfields|The Oil of Palembang|indies|build oilr 1; money 4|The Bataafsche Petroleum Maatschappij drills in Sumatra and Borneo.|
oilfull|Oil for Everyone|oilfields|hldo oilfull|Shell sells to every customer who pays: Japan most of all.|
oilhalf|Japan's Quota and No More|oilfull|hldo oilhalf|November 1940: Japan asks for three million tons a year; Batavia offers half.|date 1940-9
oilcut|Freeze the Japanese Assets|oilhalf|hldo oilcut|July 1941: with America and Britain, the Indies stop selling oil to Japan.|date 1941-7
kobayashi|The Kobayashi Mission|oilfields|rel JAP 5 ?? Bargain for time => rel JAP 5; hloil 0.5 // Give them what they ask => rel JAP 15; hloil 1|September 1940: a Japanese minister arrives in Batavia demanding oil, rubber and tin, and more.|date 1940-9
rubber|Rubber and Tin|indies|build plantation 1; money 4|The plantations of Sumatra and the tin mines of Bangka.|
volksraad|The Volksraad|indies|stab 1; legit 2|A council of Dutch, Indonesians and Chinese that may advise, but not decide.|
soetardjo|The Soetardjo Petition|volksraad|stab -1 ?? Reject it => stab 1; legit -2 // Promise autonomy within ten years => legit 4; stab -2|1936: the People's Council asks for Indonesian self-government within ten years.|date 1936-9
exiles|The Nationalists in Exile|volksraad|stab 2 ?? Keep Sukarno and Hatta in exile => stab 2; legit -2 // Bring them home to talk => legit 3; stab -2|Sukarno in Flores, Hatta and Sjahrir on Banda: the leaders of the nationalists are far from Java.|
vanmook|Van Mook|indies|pp 15; legit 2|The Lieutenant Governor-General who will try to save the Indies after the war.|
abda|ABDA Command|knil|rel ENG 10, USA 10, AST 10|January 1942: Americans, British, Dutch and Australians under one command, for six weeks.|date 1942-1; req japWar
javadefence|The Defence of Java|abda|units inf 2; fort Batavia|The last stand of the KNIL.|req japWar
scorched|Burn the Oilfields|javadefence|money -4; stab -1|March 1942: the engineers blow up the refineries at Palembang and Balikpapan before the Japanese arrive.|req japWar
newguinea|New Guinea|indies|legit 1|The western half of the great island, barely explored.|
australia|The Government in Australia|newguinea|rel AST 15|The Indies government escapes to Brisbane and fights on.|req japWar
sjahrir|Sjahrir|exiles|legit 2|The socialist exile who refuses to work with the Japanese and will be the Republic's first prime minister.|
starkenborgh|The Governor-General|indies|legit 2; pp 10|Tjarda van Starkenborgh Stachouwer stays in Batavia when the Japanese come, and spends the war in a camp in Manchuria.|
bandung|Bandung|knil|fort Batavia; res 5|The cool hill city that is the headquarters of the KNIL, and the planned capital of the Indies.|
deli|The Deli Plantations|rubber|money 3; build plantation 1|Tobacco and rubber estates in East Sumatra, worked by contract labourers.|
moluccans|The Moluccan Soldiers|knil|units inf 1|Christian soldiers from Ambon, the most loyal in the KNIL.|
digoel|Boven-Digoel|exiles|stab 1; legit -3|A prison camp in the jungle of New Guinea for nationalists and communists.|
tamansiswa|The Taman Siswa Schools|volksraad|legit 2; stab -1|Indonesian schools in Javanese spirit, founded by Ki Hajar Dewantara.|
youthpledge|One Land, One People, One Language|tamansiswa|legit -2; stab -1|The youth pledge of 1928: Indonesia, as one nation.|
japanrelations|The Old Friendship with Japan|indies|rel JAP 10 ?? Keep the trade with Japan => money 3; rel JAP 10 // Keep Japan at a distance => rel JAP -5; legit 1|For two centuries at Deshima the Dutch were Japan's only window on the West.|
# The West Indies
curacao|The Curaçao Refineries||money 6; build oilr 1|Shell's refinery on Curaçao and Standard's on Aruba refine the oil of Venezuela.|ai 4
arubaguard|Guard Aruba|curacao|rel USA 10, ENG 5; money 2|One of the largest refineries in the world, a few miles off the coast of Venezuela.|
uboatraid|The U-boats at Aruba|arubaguard|stab -1; ws 3|February 1942: German submarines shell the refinery and sink the tankers in the harbour.|date 1942-2
surinam|Surinamese Bauxite|curacao|money 4; rel USA 10|Most of the bauxite for American aluminium comes from Surinam.|
americangarrison|American Garrisons|surinam|rel USA 15|1941: American troops guard the bauxite mines and the refineries, with Dutch consent.|date 1941-11
paramaribo|Paramaribo|surinam|stab 1|A city of wooden houses on the river, with Hindustani, Javanese, Creole and Jewish citizens.|
bonaire|Bonaire and Saint Martin|curacao|legit 1|The smaller islands of the Antilles.|
willemstad|Willemstad|curacao|money 2; seaton 1|The harbour of Curaçao, with its floating bridge and its painted houses.|
# Industry and Trade
philips|Philips of Eindhoven||build engines 2; money 4|Radios, valves and light bulbs from the town that the factory built.|ai 4
philipsradar|Valves for Radar|philips|res 10; tech m_radio|Philips engineers know more about short waves than almost anyone.|
shell|Royal Dutch Shell|indies|money 6; rel ENG 5|Half Dutch, half British, and the second-largest oil company in the world.|
unilever|Unilever|philips|money 4; build textile 1|Margarine and soap, made from the palm oil and copra of the colonies.|
klm|KLM|philips|money 2; rel ENG 5|The oldest airline in the world flies from Amsterdam to Batavia in six days.|
uiver|The Uiver|klm|legit 2; ws 2|1934: a KLM Douglas airliner, carrying passengers and mail, comes second in the race from London to Melbourne.|
rotterdamport|The Port of Rotterdam|shell|build port 2; money 4|The biggest port in Europe: the Rhine's door to the sea.|
hoogovens|The IJmuiden Steelworks|rotterdamport|build steel 2|Hoogovens' blast furnaces at the mouth of the North Sea Canal.|
statemines|The State Mines|hoogovens|build coalm 1; money 2|Coal from South Limburg, and the start of a chemical industry.|
twente|The Twente Mills|philips|build textile 2|Cotton mills in Enschede and Hengelo.|
shipyards|The Shipyards|rotterdamport|build shipyard 1; seaton 2|Wilton-Fijenoord and the yards of the Maas build ships for the world.|
stork|Stork and Werkspoor|shipyards|build engines 1, tools 1|Diesel engines, locomotives and machine tools.|
diamonds|The Diamond Trade|rotterdamport|money 4|Amsterdam's cutters and polishers, most of them Jewish.|
bulbs|Flowers and Bulbs|indies|money 2|Tulips for the world from the fields behind Haarlem.|
dairy|Frisian Dairy|bulbs|build farm 1; money 2|Butter and cheese from the cooperative dairies of Friesland.|
tradeagreements|Trade Treaties|rotterdamport|trade ENG, GER, BEL|The Netherlands lives by trade, and signs with everyone.|
gold|The Gold of the Nederlandsche Bank|tradeagreements|money 6 ?? Ship the gold abroad in time => money 4; legit 2 // Keep it in Amsterdam => money 6|Most of the gold is moved to London and New York before May 1940, but not all of it.|date 1939-9
cheese|The Cheese Markets|dairy|money 2|Gouda and Edam on the markets of Alkmaar.|
margarine|Margarine for Europe|unilever|money 2|Jurgens and Van den Bergh, now Unilever, feed Europe its breakfast fat.|
greenhouses|The Westland Greenhouses|bulbs|build farm 1|Tomatoes and grapes under glass between The Hague and the sea.|
fishing|The Herring Fleet|dairy|money 2; spirit Dutch Herring: farm_out .02|The luggers of Scheveningen and Vlaardingen.|
peat|Peat from Drenthe|groningen|build coalm 1|The peat colonies dig fuel when the coal runs short.|
aku|AKU Rayon|unilever|build textile 1; money 2|Artificial silk from Arnhem.|
fokkerairliners|Fokker Airliners|klm|build aircraftp 1|Fokker builds airliners for KLM and fighters for the army.|
daf|Van Doorne's Workshop|philips|build autos 1|A smith in Eindhoven builds trailers, and will build lorries.|
stockexchange|The Amsterdam Exchange|diamonds|money 4|The oldest stock exchange in the world.|
# The Occupation
seyssinquart|Reichskommissar Seyss-Inquart|capitulation|stab -3|May 1940: an Austrian lawyer who helped hand Austria to Hitler now rules the Netherlands.|req holFallen
secretariesgeneral|The Secretaries-General|seyssinquart|stab 2 ?? Keep the civil service working => stab 2; legit -2 // Order them to resign => legit 3; stab -2|The ministers have gone to London; the civil servants stay to choose "the lesser evil".|req holFallen
dutchunion|The Netherlands Union|secretariesgeneral|stab 2; ws -2|A mass movement of 800,000 that wants to make the best of the new order, until the Germans ban it in 1941.|date 1940-7; req holFallen
februarystrike|The February Strike|seyssinquart|ws 8; stab -4|February 1941: Amsterdam stops work in protest at the first round-up of Jews. It is the only mass strike against the persecution in occupied Europe.|date 1941-2; req holFallen
westerbork|Westerbork|februarystrike|ws 4; legit -2|A camp in Drenthe, built for Jewish refugees, becomes the transit station to Auschwitz and Sobibor.|date 1942-7; req holFallen
annefrank|The Secret Annex|westerbork|ws 3|A family hides in rooms behind a warehouse on the Prinsengracht. Their daughter keeps a diary.|date 1942-7; req holFallen
onderduikers|The People in Hiding|annefrank|resist SELF 6; ws 3|By 1944 three hundred thousand Dutch men and women are hiding from the Germans.|req holFallen
lo|The LO|onderduikers|resist SELF 6|The national organisation that finds ration cards and addresses for those in hiding.|req holFallen
kp|The Knokploegen|lo|resist SELF 8|Armed groups that raid ration offices and free prisoners.|req holFallen
undergroundpress|Het Parool and Vrij Nederland|onderduikers|ws 4|The underground papers that will become the papers of the free Netherlands.|req holFallen
englandspiel|The England Game|lo|rel ENG -5 ?? Warn London that the radio sets are controlled => fn intelBoost // Trust the messages => stab -2|1942 to 1944: the Germans capture SOE agents and play their radios back to London. Fifty agents parachute into German hands.|date 1942-3; req holFallen
aprilstrike|The April-May Strike|februarystrike|ws 6; stab -3|1943: half a million strike when the soldiers of 1940 are ordered back into captivity.|date 1943-4; req holFallen
railwaystrike|The Railway Strike|aprilstrike|ws 4; stab -4|September 1944: the government in London calls on the railwaymen to strike for Arnhem. They stay out until liberation.|date 1944-9; req holFallen
hungerwinter|The Hunger Winter|railwaystrike|stab -8; ws 4|Winter 1944: the Germans stop food reaching the west; tulip bulbs are eaten and twenty thousand die.|date 1944-11; req holFallen
manna|Operation Manna|hungerwinter|stab 4; rel ENG 15, USA 15|April 1945: Allied bombers drop food on the fields of Holland, with German permission.|date 1945-4; req holFallen
councilresistance|The Council of Resistance|kp|resist SELF 6; legit 2|1943: the armed groups agree to coordinate, more or less.|date 1943-6; req holFallen
vanhall|The Bank of the Resistance|lo|money -2; resist SELF 4|Walraven van Hall, a banker, finances the resistance with forged loans against the treasury, which London will honour.|date 1943-1; req holFallen
oranjehotel|The Orange Hotel|seyssinquart|ws 3; stab -1|The prison at Scheveningen, where the prisoners scratch their names on the cell walls.|req holFallen
hannieschaft|The Girl with the Red Hair|kp|resist SELF 4; ws 2|Hannie Schaft, a law student from Haarlem, shoots collaborators. She is executed three weeks before liberation.|date 1944-1; req holFallen
creche|The Crèche|westerbork|ws 3; legit 2|Six hundred Jewish children are smuggled out of a nursery opposite the deportation centre in Amsterdam.|date 1942-10; req holFallen
# The Queen in London
queenleaves|The Queen Leaves|independence|legit 4; rel ENG 10|13 May 1940: Queen Wilhelmina sails for England on a British destroyer, to fight on from London.|req atwar GER
radiooranje|Radio Oranje|queenleaves|ws 6; legit 3|Every evening the old Queen speaks to the occupied country. The Germans call her the only man in the Dutch government.|req holFallen
gerbrandy|Gerbrandy's Government|queenleaves|leader Pieter Gerbrandy/ARP; pp 30; legit 3|September 1940: De Geer wants to go home and make peace; the Queen replaces him with a Frisian who will fight to the end.|date 1940-9; req holFallen
shippingcommittee|The Shipping Committee|gerbrandy|seaton 3; money 6|The Dutch merchant fleet sails for the Allies.|req holFallen
irene|The Princess Irene Brigade|gerbrandy|units inf 2|Dutch soldiers from every corner of the world, training in Wales.|req holFallen
squadrons|Dutch Squadrons|irene|equip aircraft 30; rel ENG 5|Nos. 320 and 322 Squadrons of the RAF, Dutch crews.|req holFallen
engelandvaarders|The Englandfarers|irene|units inf 1; ws 3|Young Dutchmen who cross the North Sea in canoes and rowing boats to join the fight.|req holFallen
bernhard|Prince Bernhard|irene|generals Prince Bernhard/2/def; ws 3|The German-born prince flies with the RAF and commands the Dutch forces of the interior in 1944.|req holFallen
juliana|Princess Juliana in Ottawa|queenleaves|rel CAN 20, USA 10|The heir to the throne spends the war in Canada; in 1943 a ward of an Ottawa hospital is declared Dutch so that her daughter is born in the Netherlands.|req holFallen
bureauintel|The Intelligence Bureau|gerbrandy|fn intelBoost|London's own Dutch intelligence service, after the disaster of the England Game.|date 1942-11; req holFallen
shipsatwar|The Dutch Merchant Fleet at War|shippingcommittee|seaton -2; rel ENG 10, USA 5|The tankers of Curaçao and the freighters of Rotterdam sail in every convoy.|req holFallen
indiesgold|The Wealth of the Indies|gerbrandy|money 8|Until 1942 the Indies pay for the government in London.|req holFallen
# Mussert's Netherlands
nsb|The NSB|pillars|ideo fas 3|Anton Mussert's National Socialist Movement: eight per cent in 1935, four in 1937.|ai 1
mussert|Anton Mussert|nsb|ideo fas 3; rel GER 5|A water engineer from Utrecht who wants to lead a Greater Netherlands.|ai 1
rost|Rost van Tonningen|mussert|ideo fas 3; stab -2|The party's radical, who wants the Netherlands inside the Reich.|ai 1
wa|The Weer-Afdeling|mussert|units mil 1; ideo fas 2|The party's black-shirted militia.|ai 1
nsbgov|A National Socialist Government|wa|setIdeo fas; leader Anton Mussert/NSB; stab -10; legit -15|Mussert becomes "Leader of the Dutch People", with Seyss-Inquart's permission.|ai 0
dietsland|Dietsland|nsbgov|claim Antwerp, Ghent; ws 3|The dream of a Greater Netherlands with Flanders, under one Dutch-speaking state.|ai 0; req ideo fas
legion|The Volunteer Legion Netherlands|nsbgov|units inf 2; rel GER 10|Dutch volunteers for the Eastern Front.|ai 0; req ideo fas & gerSovWar
landwacht|The Landwacht|nsbgov|units mil 2; stab -3|An auxiliary police of NSB members, hated even by the Germans.|ai 0; req ideo fas
neworder|The New Order|nsbgov|fn joinAxis; law oneparty|The Netherlands joins the camp of the Axis.|ai 0; req ideo fas
# The Communists
cpn|The Communist Party|pillars|ideo com 3|The CPN, strong among the Amsterdam dockers and the unemployed.|ai 1
dewaarheid|De Waarheid|cpn|ideo com 2; ws 2|The Communist paper, illegal from 1940, never stops appearing.|
communiststrike|The Communists' Strike|cpn,februarystrike|ideo com 4; resist SELF 4|The February Strike was organised by Communists, and everyone knows it.|req holFallen
redliberation|The Red Liberation|communiststrike|ideo com 4|1946: the Communists win ten per cent, on their resistance.|date 1946-5; ai 1
peoplesneth|A Dutch People's Republic|redliberation|setIdeo com; leader Paul de Groot/CPN; stab -8|The councils of the resistance take power.|ai 0
redcamp|With Moscow|peoplesneth|fn joinComintern|The Netherlands joins the Soviet camp.|ai 0; req ideo com
# Liberation
maastricht|Maastricht Is Free|bernhard|ws 4; stab 2|September 1944: the first Dutch city is liberated by the Americans.|date 1944-9; req holFallen
marketgarden|Market Garden|maastricht|ws 4 ?? Rise in support of the airborne landings => resist SELF 10; stab -2 // Wait for the Allies to cross the Rhine => stab 1|September 1944: paratroopers drop at Eindhoven, Nijmegen and Arnhem. The bridge at Arnhem is a bridge too far.|date 1944-9; req holFallen
scheldt|The Battle of the Scheldt|marketgarden|ws 3; stab -2|October 1944: the Canadians clear the banks of the Scheldt so that Antwerp can be used.|date 1944-10; req holFallen
walcheren|Walcheren Flooded|scheldt|stab -3; fort Vlissingen|The RAF breaches the dikes of Walcheren and drowns the island to drive out the Germans.|date 1944-10; req holFallen
canadians|The Canadians|scheldt|rel CAN 25|The First Canadian Army liberates the north and the west in April 1945.|date 1945-4; req holFallen
wageningen|The Wageningen Capitulation|canadians|ws 6; legit 6; stab 6|5 May 1945: in a hotel in Wageningen the German commander surrenders the Netherlands.|date 1945-5; req gerLosing
queenreturns|The Queen Returns|wageningen|legit 8; stab 4|The Queen crosses the border on foot in Zeeland.|date 1945-3
purge|The Special Courts|wageningen|stab 2 ?? Try every collaborator => legit 3; stab -2 // Try only the leaders => stab 3|Two hundred thousand are arrested; Mussert is shot in 1946.|date 1945-6
schermerhorn|The Schermerhorn Government|wageningen|leader Willem Schermerhorn/Labour Party; pp 30; stab 2|June 1945: a government of the resistance, until there can be elections.|date 1945-6
# The Indonesian Question
japanoccupation|The Japanese Occupation|australia|stab -4; legit -2|March 1942: the Japanese intern the Dutch and offer the Indonesian nationalists a share of power.|req japWar
proclamation|The Proclamation|japanoccupation|legit -4; stab -2|17 August 1945: Sukarno and Hatta proclaim the independence of Indonesia.|date 1945-8
bersiap|The Bersiap|proclamation|stab -4|Months of chaos on Java, as the young revolutionaries attack the Dutch and Indo-Europeans freed from the Japanese camps.|date 1945-10
linggadjati|The Linggadjati Agreement|bersiap|legit 3; stab 2|November 1946: the Netherlands recognises the Republic on Java and Sumatra, within a federal Indonesia under the Crown.|date 1946-11
policeaction|The Police Actions|linggadjati|units inf 2; legit -6 ?? Send in the army => money -6; stab -2 // Negotiate further => legit 4|1947: the Dutch army attacks the Republic to seize the plantations and the oilfields.|date 1947-7
roundtable|The Round Table Conference|policeaction|legit 6; stab 3; rel USA 10|1949: under American pressure, the Netherlands transfers sovereignty to the United States of Indonesia.|date 1949-8
dutchguinea|Keep New Guinea|roundtable|legit -2; pp 10|The Netherlands keeps the western half of New Guinea, for now.|date 1949-12
repatriation|The Indies Dutch Come Home|roundtable|stab -2; mp 10|Three hundred thousand Dutch and Indo-Europeans leave Indonesia for a country most of them have never seen.|date 1950-1
camps|The Japanese Camps|japanoccupation|stab -3; ws 3|A hundred thousand Dutch civilians interned on Java and Sumatra; thousands die.|req japWar
railway|The Burma Railway|camps|ws 2; stab -1|Dutch prisoners of war build the railway through the jungle to Burma.|req japWar
# Rebuilding
marshall|The Marshall Plan|schermerhorn|money 12; rel USA 15|The Netherlands receives more Marshall aid for each of its people than any other country.|date 1947-6
benelux|The Benelux|schermerhorn|trade BEL, LUX; rel BEL 15, LUX 15|Agreed in London in 1944: one customs union for Belgium, the Netherlands and Luxembourg.|date 1944-9
nato|The Atlantic Pact|marshall|fn joinAllies; rel USA 10|1949: the policy of independence is over.|date 1949-4
unitednations|The United Nations|schermerhorn|legit 3; rel USA 5|The Netherlands signs the Charter at San Francisco.|date 1945-6
drees|Drees|dreespension|leader Willem Drees/Labour Party; pp 20; stab 3|1948: the father of the old-age pension becomes Prime Minister for ten years.|date 1948-8
rotterdamrebuilt|Rebuild Rotterdam|marshall|build urban 2, port 1|A new city centre, with the first pedestrian shopping street in Europe.|date 1946-1
emigration|Emigration|marshall|mp -10; stab 2|Farmers' sons leave for Canada, Australia and New Zealand.|date 1947-1
haguecongress|The Hague Congress|benelux|legit 3; rel FRA 5, ENG 5, BEL 5|May 1948: Churchill and seven hundred delegates meet in The Hague to found a united Europe.|date 1948-5
brusselstreaty|The Brussels Treaty|haguecongress|rel ENG 10, FRA 10, BEL 10, LUX 10|March 1948: five western nations promise to defend each other.|date 1948-3
coalsteel|Coal and Steel|brusselstreaty|money 4; build steel 1|1951: the Netherlands joins France, Germany, Italy and Belgium in one market for coal and steel.|date 1950-5
# Culture and Science
huizinga|Huizinga's Homo Ludens|pillars|res 5; legit 2|1938: the historian of the Middle Ages writes that civilisation arises in play.|date 1938-6
mondrian|Mondrian|huizinga|legit 1; rel USA 5|The painter of red, yellow and blue squares leaves for London in 1938 and New York in 1940.|
escher|Escher|mondrian|legit 1|Impossible staircases, interlocking birds and fish, drawn in Baarn.|
concertgebouw|The Concertgebouw|huizinga|stab 1 ?? Keep Mengelberg as conductor => rel GER 5; legit -2 // Dismiss him => legit 2|The finest orchestra in Europe, led by a conductor who admires Germany.|
leiden|Cleveringa's Speech|huizinga|ws 6; legit 3|26 November 1940: a law professor in Leiden protests against the dismissal of his Jewish colleague. The students strike; the Germans close the university.|date 1940-11; req holFallen
physics|Dutch Physics|huizinga|res 15|Zernike's phase-contrast microscope, Kramers' quantum theory, the cold laboratory at Leiden.|
tinbergen|Tinbergen's Models|physics|res 10; spirit The Central Planning Bureau: growth .02|The first econometric model of an economy, and a planning bureau to use it.|date 1945-9
delft|Delft|physics|res 10; build university 1|The technical university that trains the engineers of the dikes, the ports and the Indies.|
# The Cities and the North
amsterdam|Amsterdam|colijn|build urban 1; money 2|The capital, the canals and the port of the Indies trade.|
thehaguecity|The Hague|amsterdam|legit 2|The seat of the government and the court of international justice.|
groningen|Groningen and Friesland|amsterdam|ig rural 3; build farm 1|The rich clay farms of the north, and a people with its own language.|
frisian|The Frisian Language|groningen|stab 1|A language of its own, spoken from Leeuwarden to the islands.|
limburg|Limburg|amsterdam|build coalm 1; stab 1|The Catholic south, with coal mines and Maastricht.|
# Water and Land
waterstaat|Rijkswaterstaat|zuiderzee|infra 1; build construction 1|The state's engineers of dikes, locks and canals, the oldest technocracy in Europe.|
ijsselmeer|The IJsselmeer|waterstaat|build farm 1; spirit A Freshwater Lake: farm_out .02|The salt Zuiderzee becomes a freshwater lake behind the great dike.|
pumping|Steam Pumping Stations|waterstaat|build power 1|The Wouda station in Friesland, the largest steam pumping station ever built.|
riverdikes|The River Dikes|waterstaat|fort Utrecht; stab 1|The dikes of the Rhine, the Waal and the Maas, raised again after every flood.|
lelylegacy|Lely's Plan|ijsselmeer|build farm 1; popgrow 1|Cornelis Lely planned the Zuiderzee works in 1891; the polders bear his name.|
# The House of Orange
wilhelmina|Queen Wilhelmina|colijn|legit 4; stab 1|Queen since 1890, stern and stubborn, with no patience for politicians.|
royalwedding|The Royal Wedding|wilhelmina|stab 3; legit 2; rel GER -2|January 1937: Princess Juliana marries a German prince, Bernhard of Lippe-Biesterfeld. The orchestra is told not to play the German anthem.|date 1937-1
beatrix|Princess Beatrix|royalwedding|stab 2; legit 1|January 1938: a daughter for the heir to the throne.|date 1938-1
orangeday|Orange Flowers|radiooranje|ws 3|On Prince Bernhard's birthday the Dutch wear carnations in his honour; the Germans arrest them for it.|date 1940-6; req holFallen
# Daily Life
elfstedentocht|The Elfstedentocht|amsterdam|ws 2; stab 1|The eleven-cities skating race across Friesland, held in the hard winters of 1940, 1941 and 1942.|date 1940-1
bicycles|The Bicycle Country|amsterdam|stab 1; infra 1|Three million bicycles; in 1942 the Germans requisition them, and the Dutch never forgive it.|
football|Feyenoord and Ajax|amsterdam|stab 1|Football on Sunday, whatever the pillar.|
distribution|The Distribution Office|mobilisation|spirit Ration Coupons: needs -.04|Coupons for bread, butter and textiles, from the first month of the war.|date 1939-9
`);

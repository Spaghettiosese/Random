// Canada (2.3): hand-written. Mackenzie King's Dominion and the unity of English and French Canada, worked through the
// conscription system (nations23.js); the economy from the Dust Bowl to the arsenal of C. D. Howe; the army overseas
// from Hong Kong and Dieppe to the Scheldt; the battle of the Atlantic and the Air Training Plan; the Pacific coast and
// the North; and other Canadas: the CCF's Cooperative Commonwealth, Arcand's fascists, a Communist Canada and a Canada
// that turns its back on the Empire.
'use strict';
TREES.CAN = autoTree('ca_', `
# The Dominion
king|Mackenzie King||pp 30; caunity 3|William Lyon Mackenzie King, back in office since October 1935, governs by doing as little as possible as slowly as possible: it keeps the country together.|ai 6
westminster|The Statute of Westminster|king|legit 5; infl 10|Since 1931 the Dominion makes its own laws and its own foreign policy, when it chooses to.|
cabinet|A Cabinet of Regions|king|caunity 4; stab 2|Every province and both languages have their ministers; Ernest Lapointe speaks for Quebec.|
lapointe|Ernest Lapointe, the Quebec Lieutenant|cabinet|caunity 6; ig devout 3|The minister of justice is the government's voice in French Canada, and its promise against conscription.|
bankofcanada|Nationalise the Bank of Canada|king|spirit Central Bank: invest .05; money 2|1938: the central bank founded three years before passes into public hands.|date 1938-1
cbc|The Canadian Broadcasting Corporation|westminster|pp 15; caunity 3|1936: a public radio network coast to coast, in English and in French.|date 1936-11
tca|Trans-Canada Air Lines|cbc|infra 1; money 2|1937: a national airline from Vancouver to Montreal.|date 1937-4
rowellsirois|The Rowell-Sirois Commission|bankofcanada|pp 20; stab 2|A royal commission on the federal bargain: who taxes, who pays for the poor.|date 1937-8
equalisation|Equalisation|rowellsirois|caunity 5; money -3; stab 2|The rich provinces help the poor ones: the Maritimes and the Prairies get their share.|
unemployinsurance|Unemployment Insurance|rowellsirois|law pensions; stab 3; ig union 5|1940: a constitutional amendment and the first national unemployment insurance.|date 1940-8
familyallowance|The Baby Bonus|unemployinsurance|popgrow 1; stab 3; money -3|1944: a monthly cheque for every child, paid to the mother.|date 1944-8
veterans|The Veterans Charter|familyallowance|stab 3; ws 3|Land, education and loans for every returning serviceman and woman.|date 1944-6
citizenship|The Canadian Citizenship Act|veterans|legit 6; caunity 3|1947: for the first time, Canadians are citizens of Canada and not only British subjects.|date 1946-6
stlaurent|Louis St. Laurent|citizenship|leader Louis St. Laurent/Liberal Party; caunity 6; pp 20|1948: the corporation lawyer from Quebec succeeds King, and becomes Uncle Louis.|date 1948-11
royalvisit|The Royal Visit|westminster|ws 5; caunity 2; rel ENG 10|May 1939: King George VI and Queen Elizabeth cross Canada by train, the first reigning monarch to see it.|date 1939-5
duplessis|Duplessis in Quebec|lapointe|caunity -3; ig devout 3 ?? Fight him in the election => caunity 4; pp -10 // Leave him alone => stab 2|Maurice Duplessis's Union Nationale governs Quebec against the trade unions, the Communists and Ottawa.|
godbout|Godbout's Liberals Win Quebec|duplessis|caunity 6; law suffrage|October 1939: Lapointe and the federal ministers campaign in Quebec and Duplessis falls. Quebec's women get the vote.|date 1939-10
hydroquebec|Hydro-Québec|godbout|build power 2; caunity 2|1944: Montreal Light, Heat and Power is nationalised.|date 1944-4
schoolsquebec|Compulsory Schooling in Quebec|godbout|spirit Quebec Schools: literacy .03; ig devout -3|1943: Quebec's children must go to school until fourteen.|date 1943-5
aberhart|Social Credit in Alberta|cabinet|ig rural 3; stab -1 ?? Disallow Aberhart's laws => pp 15; caunity -1 // Let Alberta experiment => ig rural 4; money -2|William Aberhart's radio preachers promise every Albertan a dividend of twenty-five dollars a month.|
padlock|The Padlock Law|duplessis|rad -0.02; legit -3 ?? Leave it to the courts => legit 3 // Disallow it => caunity -3; legit 4|Quebec may padlock any building used to propagate communism, a word the law never defines.|date 1937-3
dpconference|The Dominion-Provincial Conference|rowellsirois|pp 15; caunity -2|January 1941: the provinces refuse the commission's report; Ottawa takes the income tax for the war anyway.|date 1941-1
taxrental|The Tax Rental Agreements|dpconference|money 6; caunity -1|1942: the provinces rent their income and corporate taxes to Ottawa for the duration.|date 1942-5
seances|Séances at Laurier House|king|pp 10 ?? Consult the spirits => pp 15; stab 1 // Keep the diary private => legit 2|The Prime Minister talks to his late mother, and to his dogs, and writes it all down.|
privycouncil|End Appeals to London|citizenship|legit 4|1949: the Supreme Court of Canada becomes the court of last resort.|date 1949-12
redensign|The Red Ensign|royalvisit|ws 3; caunity -1|The army fights under the Red Ensign; the question of a national flag waits.|
macdonald|Angus L. Macdonald|cabinet|stab 1; spirit Naval Minister: navy .02|The premier of Nova Scotia comes to Ottawa as minister of the naval service.|
powerdefence|Chubby Power at the Air Ministry|cabinet|spirit Air Minister: air .02; caunity 1|Charles Power, a Quebec minister, runs the air force and resigns over conscription in 1944.|
leaguesnations|The Riddell Incident|westminster|infl 10 ?? Support sanctions on Italy => rel ENG 5; rel ITA -10 // Repudiate Riddell => caunity 3|1935: Canada's delegate in Geneva proposed oil sanctions on Italy; King disowns him.|
dominionday|Dominion Day|royalvisit|ws 2; caunity 2|The first of July: picnics and parades from Halifax to Victoria.|
# The Dominion's Economy
depression|The Dirty Thirties||stab -2; pp 10|A quarter of the workforce idle and the Prairies blowing away in the drought.|ai 5
reliefcamps|Close the Relief Camps|depression|stab 3; ig union 4|The army's camps for single unemployed men, where they worked for twenty cents a day, are closed.|
pfra|Prairie Farm Rehabilitation|depression|build farm 2; ig rural 5|Dugouts, shelter belts and community pastures against the dust.|
wheatboard|The Wheat Board|pfra|money 3; ig rural 4|A single seller for the western wheat crop, with a floor price for the farmers.|
reciprocal|Trade Agreements with Washington|depression|trade USA; money 3; rel USA 10|1935 and 1938: the walls of the tariff come down between Canada and the United States.|
inco|Sudbury Nickel|reciprocal|build ironm 1; money 3|International Nickel's mines supply nine-tenths of the free world's nickel.|
pulp|Pulp and Paper|reciprocal|build logging 1; money 2|The forests of Quebec and Ontario print America's newspapers.|
goldmines|The Gold Mines of the Shield|inco|money 4|Kirkland Lake and Timmins dig gold through the Depression.|
eldorado|Eldorado at Port Radium|goldmines|money 2; proj 10|Radium from the shore of Great Bear Lake, and later uranium for the bomb.|
ontariohydro|Ontario Hydro|depression|build power 2|Niagara's power for the factories of southern Ontario.|
stelco|Hamilton Steel|ontariohydro|build steel 2; ig ind 3|Stelco and Dofasco make the steel for the war plants of Ontario.|
arvida|Aluminium at Arvida|ontariohydro|build chem 1, aircraftp 1|The Saguenay's power makes aluminium for the Allies' aircraft.|req war
polymer|The Polymer Corporation|stelco|build synth 1; money 2|1942: a Crown company at Sarnia makes synthetic rubber after Malaya falls.|date 1942-8
highway|The Trans-Canada Highway Plan|tca|infra 1; build railway 1|A road across the continent, planned in the thirties and built in the fifties.|
hudsonbay|The Hudson Bay Railway|wheatboard|build railway 1, port 1|Grain to Europe through Churchill, on the shore of the northern sea.|
seaway|The St. Lawrence Seaway Plan|highway,ontariohydro|build port 1; rel USA 10|Locks and dams to take ocean ships to the Great Lakes, agreed in 1941 and built in 1954.|date 1941-3
leduc|Leduc No. 1|goldmines|dep Edmonton oil 3; money 4|February 1947: oil gushes near Edmonton, and Alberta is changed forever.|date 1947-2
ironquebec|The Iron of Labrador|leduc|build ironm 2; money 3|The ore of the Quebec-Labrador trough, opened by railway in the fifties.|date 1950-1
cpr|The Canadian Pacific|hudsonbay|infra 1; money 2|The railway that made the country: trains, ships, hotels and its own telegraph.|
cnr|Canadian National Railways|cpr|build railway 1; money -2|The state's railway, made of every bankrupt line in the country.|
capebreton|Cape Breton Coal|stelco|build coalm 1; ig union 2|The miners of Glace Bay dig under the sea for the steelworks of Sydney.|
asbestos|The Asbestos Mines|pulp|money 2; build ironm 1|Thetford Mines and Asbestos produce most of the world's supply.|
autos|The Windsor and Oshawa Plants|ontariohydro|build autos 2; ig union 3|Ford in Windsor and General Motors in Oshawa: the auto industry of the Empire.|
massey|Massey-Harris|wheatboard|build tools 1; money 2|Tractors and combines from Toronto for the farmers of four continents.|
bata|Batawa|autos|build textile 1; legit 2|1939: the Bata shoe company brings its Czech workers to a new town on the Trent.|date 1939-3
pc1003|Collective Bargaining|wartimeprices|ig union 8; stab 2|Order in Council P.C. 1003, 1944: unions have the right to be recognised.|date 1944-2
randformula|The Rand Formula|pc1003|ig union 5, ind -3; stab 3|After the Ford strike of 1945, a judge decides every worker pays dues, union member or not.|date 1945-12
wartimehousing|Wartime Housing|wartimeprices|build urban 1; stab 2|Prefabricated houses for the war workers, built by the thousand.|
fisheries|The Atlantic Fisheries|halifaxconvoys,pfra|build farm 1; money 2|Salt cod from Lunenburg and Newfoundland for the West Indies and Europe.|
transmountain|The Trans Mountain Pipeline|leduc|infra 1; money 3|Alberta oil to Vancouver over the Rockies.|date 1952-1
wartimeprices|The Wartime Prices and Trade Board|reliefcamps|stab 3; spirit Price Ceilings: needs -.03, stab 1|1941: a ceiling on every price and every wage in the country.|req war
# The War Effort
declaration|Canada Declares War||ws 10; caunity 3|10 September 1939: Parliament decides, a week after Britain, and Canada goes to war on its own declaration.|req engAtWar; ai 8
howe|C. D. Howe, Minister of Everything|declaration|pp 20; spirit Munitions and Supply: mil_out .08, build .05|The Department of Munitions and Supply gives its engineer-minister power over every factory in Canada.|
crowncorps|The Crown Companies|howe|build arms 1, artyf 1; ig ind 4|Twenty-eight state companies make what private industry will not.|
inglis|Bren Guns from Inglis|howe|build arms 1; equip arms 100|The John Inglis company in Toronto makes Bren guns for half the Commonwealth.|
mlw|The Ram Tank|crowncorps|build tankp 1; tech m_tank1|Montreal Locomotive Works builds a Canadian tank on an American chassis.|
victoryaircraft|Victory Aircraft|crowncorps|build aircraftp 2|The Malton plant builds Lancaster bombers, and flies them across the Atlantic.|req war
shipyards|The Wartime Shipyards|howe|build shipyard 2|From Vancouver to Halifax, yards turn out corvettes, frigates and freighters.|
parkships|The Park Ships|shipyards|build shipyard 1; money 3|Four hundred merchant ships, Canada's answer to the Liberty ships.|
cmp|The Canadian Military Pattern Truck|crowncorps|build autos 2; equip autos 60|Ford and Chevrolet Canada build the trucks that carry the Eighth Army across Africa.|
victoryloans|Victory Loans|declaration|money 8; ws 3|Twelve billion dollars from Canadians in nine Victory Loan drives.|
ogdensburg|The Ogdensburg Agreement|declaration|rel USA 20; spirit Permanent Joint Board on Defence: def .05|August 1940: Roosevelt and King agree in a railway car to defend North America together.|date 1940-8
hydepark|The Hyde Park Declaration|ogdensburg|money 6; rel USA 10|April 1941: the Americans will buy what Canada makes, so Canada can pay for what Britain needs.|date 1941-4
billiongift|The Billion Dollar Gift|hydepark|rel ENG 30; money -10|1942: a billion dollars of munitions and food to Britain, free.|req engAtWar; date 1942-1
mutualaid|Mutual Aid|billiongift|rel ENG 20, SOV 10; money -8|Canada's own Lend-Lease, to Britain, the Soviet Union, China and others.|date 1943-5
womenwork|Women in the Factories|howe|mp 60; spirit Women at War: manpower .06, output .02|A quarter of a million women go into the war plants; the government pays for nurseries.|
selectiveservice|National Selective Service|womenwork|mp 40; caunity -2|1942: the state directs every worker to where the war needs them.|date 1942-3
arsenal|An Arsenal for the Commonwealth|victoryaircraft,mlw,shipyards|spirit Arsenal of the Commonwealth: mil_out .06, output .03|By 1944 Canada is the fourth industrial power of the Allies.|
registration|National Registration|declaration|mp 30; caunity -2|August 1940: every adult must register for national service.|date 1940-8
nrc|The National Research Council|howe|res 25; tech m_radar|Radar, proximity fuses and the explosives laboratory of C. J. Mackenzie.|
rel|Research Enterprises Limited|nrc|build tools 1; tech m_radio|A Crown company in Leaside makes radar sets and optical glass.|
suffield|The Suffield Experimental Station|nrc|res 15|A thousand square miles of Alberta prairie for testing what armies may one day use.|
campx|Camp X|declaration|res 10; rel ENG 5, USA 10|A secret school for agents on the shore of Lake Ontario, near Whitby.|date 1941-12
warmeasures|The War Measures Act|declaration|stab 3; legit -3|The government may rule by order in council for the duration.|
internment|Intern the Enemy Aliens|warmeasures|stab 2; legit -3 ?? Intern only the suspects => legit 3 // Intern by nationality => stab 2; legit -3|Germans, Italians and Communists are sent to camps at Petawawa and Kananaskis.|
cwac|The Canadian Women's Army Corps|womenwork|mp 20; spirit Women in Uniform: manpower .03|1941: women join the army as clerks, drivers and signallers.|date 1941-8
warsavings|War Savings Stamps|victoryloans|money 3; ws 2|Children buy twenty-five-cent stamps at school to help win the war.|
salvage|Salvage Drives|warsavings|money 2; equip arms 20|Pots, pans and bacon fat for the munitions factories.|
wartimeinfo|The Wartime Information Board|warmeasures|pp 10; ws 3|Posters and newsreels: the National Film Board's Canada Carries On.|
nfb|The National Film Board|wartimeinfo|ws 3; res 5|John Grierson's documentaries show the war to the country.|
foodforbritain|Food for Britain|billiongift|rel ENG 10; build farm 1|Bacon, cheese and wheat to keep Britain fed.|
# The Army Overseas
firstdivision|The First Division Sails||units inf 2; ws 4|December 1939: the 1st Canadian Division lands in Scotland.|req engAtWar; ai 6
mcnaughton|General McNaughton|firstdivision|generals Andrew McNaughton/3/def; axp 5|The scientist-soldier who wants the Canadians kept together as one army.|
firstarmy|First Canadian Army|mcnaughton|units inf 3; axp 10|1942: five divisions and two armoured brigades, the dagger pointed at the heart of Berlin.|date 1942-4
hongkong|C Force to Hong Kong|firstdivision|rel ENG 10; units inf 1 ?? Send the Winnipeg Grenadiers and the Royal Rifles => rel ENG 10 // Refuse => caunity 2|November 1941: two battalions sail to reinforce Hong Kong. They arrive three weeks before the Japanese.|date 1941-10
dieppe|Operation Jubilee|firstarmy|axp 15; ws -5; rel ENG 5|August 1942: five thousand Canadians land at Dieppe; nine hundred die, two thousand are taken.|date 1942-8
husky|Sicily|dieppe|axp 10; ws 4|July 1943: the 1st Division lands at Pachino and fights through the mountains of Sicily.|date 1943-7
ortona|Ortona|husky|axp 10; ws 3|Christmas 1943: house by house, mouse-holing through the walls of a little Adriatic town.|date 1943-12
juno|Juno Beach|firstarmy|axp 15; ws 6|6 June 1944: the 3rd Division lands at Courseulles and gets further inland than anyone.|date 1944-6
falaise|The Falaise Gap|juno|axp 10; spirit Totalize: atk .06|August 1944: Canadian and Polish armour close the pocket on the German Seventh Army.|date 1944-8
scheldt|The Battle of the Scheldt|falaise|axp 10; rel HOL 20|October 1944: in the flooded polders the Canadians open the port of Antwerp.|date 1944-10
liberation|Liberate the Netherlands|scheldt|rel HOL 30; legit 4; ws 4|April 1945: the Canadians free the Dutch; the tulips come to Ottawa every spring after.|date 1945-4
crerar|General Crerar|firstarmy|generals Harry Crerar/3/inf|The staff officer who commands First Canadian Army in Normandy.|
simonds|General Simonds|crerar|generals Guy Simonds/4/off; axp 5|The best tactician in the army: armoured personnel carriers made of self-propelled guns.|
devils|The Devil's Brigade|firstarmy|units mtn 1; rel USA 10|The First Special Service Force: Canadians and Americans in one unit.|date 1942-7
italycampaign|The Italian Campaign|ortona|axp 5; units inf 1|I Canadian Corps fights through the Liri valley and the Gothic Line.|date 1944-5
khaki|Khaki University|liberation|res 15; stab 2|While they wait for ships home, soldiers study at a university in uniform.|
worthington|The Canadian Armoured Corps|firstarmy|tech m_tank1; units arm 1|Worthington, the father of the armoured corps, trains his men on Ram and Sherman tanks.|
verrieres|Verrières Ridge|juno|axp 10; ws -3|July 1944: the Black Watch of Montreal is cut down on the ridge south of Caen.|date 1944-7
carpiquet|Carpiquet|juno|axp 5|The Winnipeg Rifles and the airfield held by the Hitler Youth division.|date 1944-7
channelports|The Channel Ports|falaise|axp 5; rel FRA 15|Boulogne, Calais and the flying-bomb sites of the coast.|date 1944-9
veritable|Operation Veritable|scheldt|axp 10; spirit Into the Reichswald: atk .05|February 1945: through the flooded Rhineland and the Reichswald forest.|date 1945-2
fourtharmoured|The 4th Armoured Division|worthington|units arm 1; axp 5|The green patch division: Falaise, the Hochwald and the march to Oldenburg.|
mororiver|The Moro River|husky|axp 5|December 1943: the advance to Ortona across the gullies of the Adriatic coast.|
liri|The Liri Valley|italycampaign|axp 5|May 1944: the Hitler Line is broken in the Liri valley.|
gothic|The Gothic Line|liri|axp 5; ws 2|August 1944: the Canadians break the last German line in Italy at the Adriatic end.|
olive|Operation Goldflake|gothic|units inf 1|1945: I Canadian Corps comes north to join First Canadian Army for the end.|date 1945-2
fifthdiv|The 5th Armoured Division|fourtharmoured|units arm 1|The Mighty Maroon Machine fights in Italy and Holland.|
hochwald|The Hochwald Gap|veritable|axp 5; spirit Blockbuster: atk .04|March 1945: the last German line west of the Rhine.|date 1945-3
groningen|Groningen|liberation|rel HOL 10; ws 2|April 1945: the 2nd Division clears the northern Netherlands.|date 1945-4
# The Navy and the Atlantic
rcn|The Royal Canadian Navy||spirit Royal Canadian Navy: navy .03; build shipyard 1|Six destroyers in 1939. By 1945, the third largest navy in the world.|ai 5
corvettes|The Flower Class|rcn|build shipyard 1; spirit Corvettes: navy .04|Small, wet and seaworthy: the corvettes that escort the convoys.|
halifaxconvoys|The Halifax Convoys|corvettes|money 2; rel ENG 10|HX convoys sail from Bedford Basin for Liverpool, every few days for six years.|req engAtWar
moef|The Mid-Ocean Escort Force|halifaxconvoys|spirit Mid-Ocean Escort Force: navy .05|1942: the Canadian navy takes on half the escort work of the North Atlantic.|date 1942-2
newfiederry|The Newfie-Derry Run|moef|rel ENG 5; caunity 1|From St. John's to Londonderry and back, through the worst weather in the world.|
stlawrence|The Battle of the St. Lawrence|halifaxconvoys|dig 9999 Quebec; ws 4|1942: U-boats in the river itself, sinking ships within sight of Quebec farms.|date 1942-5
frigates|The River Class Frigates|corvettes|build shipyard 1; tech m_nav2|Bigger, faster escorts with radar and hedgehog.|date 1942-6
tribals|The Tribal Destroyers|frigates|spirit Tribal Destroyers: navy .04|HMCS Haida, the fightingest ship in the navy, in the Channel.|date 1943-8
merchantnavy|The Merchant Navy|parkships|money 3; ws 2|Canadian merchant seamen die at a higher rate than any of the armed forces.|
halifaxriots|The Halifax Riots|merchantnavy|stab -2 ?? Blame the navy => caunity 2 // Blame the city => stab 2|May 1945: sailors celebrate the victory by looting Halifax.|date 1945-5
navalreserve|The Naval Volunteer Reserve|rcn|mp 20; caunity 2|Prairie boys who have never seen the sea join the navy.|
battleatlantic|The Battle of the Atlantic Committee|moef|res 10; caunity 1|Scientists and sailors learn to sink submarines together.|
murmansk|The Murmansk Run|moef|rel SOV 15|Canadian destroyers escort the convoys to Russia around the North Cape.|
minesweepers|The Normandy Minesweepers|frigates|ws 2; rel ENG 5|Sixteen Canadian minesweepers clear the lanes to the beaches before D-Day.|date 1944-6
carriers|A Naval Air Arm|tribals|tech m_nav2; build shipyard 1|After the war, light carriers for the navy: Warrior and Magnificent.|date 1945-6
halifaxbase|The Halifax Base|halifaxconvoys|dig 9999 Halifax; build port 1|The greatest convoy port of the Allies.|
bedford|The Bedford Magazine Fire|halifaxbase|stab -1 ?? Evacuate the north end => stab 1 // Fight the fire => ws 2|July 1945: the naval magazine explodes for a day. Halifax remembers 1917.|date 1945-7
uboats|U-Boat Surrender|halifaxbase|ws 3; res 5|May 1945: U-boats surface off Shelburne and surrender to the Canadian navy.|date 1945-5
# The Air Force
bcatp|The Air Training Plan||cabcatp; rel ENG 10|December 1939: Canada will be the aerodrome of democracy.|req engAtWar; ai 7
rcaf|The Royal Canadian Air Force|bcatp|tech m_air1; build aircraftp 1|A small peacetime air force becomes a quarter of a million strong.|
no1squadron|No. 1 Squadron in the Battle of Britain|rcaf|ws 4; rel ENG 5|Canadian Hurricanes over London in September 1940.|date 1940-8
article15|Article XV Squadrons|no1squadron|spirit Article XV: air .02|Canadian squadrons in the RAF, flying under their own names.|
sixgroup|No. 6 Group|article15|tech m_air2; spirit No. 6 Group: bombing .06|1943: an all-Canadian bomber group in Yorkshire.|date 1943-1
eac|Eastern Air Command|rcaf|spirit Eastern Air Command: navy .03|Long-range Liberators close the air gap over the Grand Banks.|
goosebay|Goose Bay|eac|infra 1; rel USA 5|An air base in Labrador for the ferry route to Britain.|date 1941-12
ferry|The Atlantic Ferry|goosebay|rel ENG 10; equip aircraft 20|Bombers built in America are flown across the ocean from Dorval.|
avro|Avro Canada|victoryaircraft|build aircraftp 1; res 15|After the war, a Canadian company to build jet fighters at Malton.|date 1945-12
trainingschools|Schools on the Prairies|bcatp|spirit Prairie Air Schools: air .03; money -3|A hundred and five schools from Ontario to British Columbia.|
bishop|Billy Bishop Recruits|rcaf|mp 20; ws 3|The ace of the last war tours the country recruiting for the air force.|
wd|The RCAF Women's Division|bishop|mp 10; spirit Women's Division: air .02|1941: they serve so that men may fly.|date 1941-7
ferrycommand|Ferry Command|ferry|rel USA 10, ENG 10|The RAF's ferry organisation at Dorval delivers ten thousand aircraft.|date 1941-7
ottawaconference|The Ottawa Air Training Conference|bcatp|rel ENG 10; money -2|1942: the plan is renewed and enlarged until 1945.|date 1942-5
jetliner|The Avro Jetliner|avro|res 15|1949: the second jet airliner in the world flies at Malton.|date 1949-8
lancasterx|The Lancaster X|victoryaircraft|equip aircraft 30; rel ENG 5|430 Canadian-built Lancasters fly with No. 6 Group.|date 1943-8
woodbridge|Bomber Crews|sixgroup|ws -2; axp 5|Ten thousand Canadian airmen die over Europe with Bomber Command.|
# The Conscription Question
noconscription|No Conscription for Overseas||caunity 6; ig devout 2|King's promise of 1939: no Canadian will be conscripted to fight abroad.|ai 5
nrma|The National Resources Mobilization Act|noconscription|cacons nrma|June 1940: conscription for the defence of Canada only.|req war; date 1940-6
plebiscite|The Plebiscite of 1942|nrma|capleb|"Conscription if necessary, but not necessarily conscription."|date 1942-4
bill80|Bill 80|plebiscite|caunity -3; pp 15|The government gives itself the power to send conscripts abroad, and promises not to use it.|date 1942-7
ralston|Ralston Resigns|bill80|caunity 3; ig army -4|1944: the defence minister wants conscripts sent to Europe; King fires him.|date 1944-11
crisis44|The Conscription Crisis|ralston|cacons overseas|November 1944: sixteen thousand home-defence conscripts are ordered overseas.|date 1944-11
bloc|The Bloc populaire|plebiscite|caunity -4 ?? Answer it with concessions => caunity 5; pp -15 // Ignore it => stab -2|A new party in Quebec against conscription and the war.|
volunteerdrive|The Volunteer Drives|noconscription|mp 30; caunity 2|Recruiting parades, posters and pressure: volunteers first.|
frenchregiments|French-Speaking Regiments|volunteerdrive|caunity 6; units inf 1|The Royal 22nd and the Régiment de la Chaudière: French Canada's own battalions.|
unitydrive|Unity Above All|frenchregiments,lapointe|caunity 8; spirit The King Compromise: stab 2|King keeps the country together by never saying what he will do until he has to.|
houde|Camillien Houde|nrma|caunity -3 ?? Intern him => stab 2; caunity -3 // Ignore him => caunity 1; legit -2|The mayor of Montreal tells the city not to register. He spends four years in a camp.|date 1940-8
zombies|The Zombies|nrma|units inf 2|Home-defence conscripts guard the coasts and are taunted as zombies.|
terrace|The Terrace Mutiny|crisis44|caunity -3; stab -2|November 1944: home-defence conscripts in British Columbia refuse to be sent overseas.|date 1944-11
cardin|Cardin Resigns|bill80|caunity -2; pp 10|P. J. A. Cardin, the senior Quebec minister after Lapointe's death, leaves over Bill 80.|date 1942-5
quebecrally|The Anti-Conscription League|plebiscite|caunity -3; ig devout 2|André Laurendeau's League campaigns for a No vote across Quebec.|
reinforcement|The Reinforcement Crisis|crisis44|units inf 2|Infantry reinforcements are short after Normandy and the Scheldt.|
lapointedies|Lapointe Dies|lapointe|caunity -3; pp 10|November 1941: the Quebec lieutenant dies, and King loses his surest bridge to French Canada.|date 1941-11
# The Pacific Coast
pacific|The Pacific Coast||dig 9999 Vancouver, Prince Rupert|Batteries at Esquimalt and Prince Rupert against a Japanese raid.|req atwar JAP; ai 4
pacificcommand|Pacific Command|pacific|units inf 2|Two divisions guard British Columbia.|
estevan|The Shelling of Estevan Point|pacificcommand|ws 3|June 1942: a Japanese submarine shells a lighthouse on Vancouver Island.|date 1942-6
removal|The Removal of the Japanese Canadians|pacific|stab 1; legit -6 ?? Order the removal => stab 2; legit -4 // Refuse it => legit 6; caunity -1|1942: twenty-two thousand Japanese Canadians are forced from the coast and their property sold. A wrong the country will apologise for in 1988.|date 1942-2
kiska|Kiska|pacificcommand|axp 5; rel USA 10|August 1943: Canadian and American troops land on Kiska in the Aleutians and find the Japanese gone.|date 1943-8
princerupert|The Port of Prince Rupert|pacific|build port 1; rel USA 5|The northern port becomes an American supply base for Alaska.|
pacificforce|The Pacific Force|kiska|units inf 2; rel USA 10|1945: volunteers for a Canadian division to invade Japan. The war ends first.|date 1945-5
hongkongpow|The Hong Kong Prisoners|hongkong|ws 3; legit 2|The survivors of Hong Kong spend the war in Japanese camps.|
esquimalt|Esquimalt Naval Base|pacific|build port 1; dig 9999 Vancouver|The Pacific base of the navy at Victoria.|
balloonbombs|The Balloon Bombs|pacificcommand|stab -1; ws 2|1945: Japanese paper balloons carry incendiaries across the Pacific; some land in British Columbia.|date 1944-11
# The North
north|The North||infra 1|Half the country is tundra and forest that few Canadians have seen.|ai 3
alaskahighway|The Alaska Highway|north|infra 1; rel USA 10|1942: the Americans build a road from Dawson Creek to Fairbanks in eight months.|date 1942-3
canol|The Canol Pipeline|alaskahighway|dep Yellowknife oil 1; rel USA 5|Oil from Norman Wells piped across the mountains to Whitehorse.|date 1943-1
sovereignty|Arctic Sovereignty|canol|legit 3; core Yellowknife, Whitehorse, Churchill|After the war Canada buys back the American installations: the North is Canadian.|date 1946-1
yellowknifegold|Yellowknife Gold|north|money 3|A gold rush on Great Slave Lake.|
rcmp|The RCMP Patrols|north|stab 1|The St. Roch sails the Northwest Passage both ways.|date 1942-6
stagingroute|The Northwest Staging Route|alaskahighway|infra 1; rel SOV 5, USA 5|Airfields from Edmonton to Whitehorse, the route of the Lend-Lease aircraft to Russia.|
churchillport|The Port of Churchill|north|build port 1|Grain ships on Hudson Bay, for the few weeks the ice allows.|
dewline|Northern Radar|sovereignty|tech m_radar; rel USA 10|Radar stations across the Arctic against the bombers of the Cold War.|date 1950-1
# After the War
montreallab|The Montreal Laboratory|sixgroup,eldorado|proj 30; res 20|British and Canadian scientists work on the bomb's heavy-water reactor.|date 1942-12
chalkriver|Chalk River|montreallab|proj 30; res 20|September 1945: ZEEP, the first reactor outside the United States.|date 1945-9
gouzenko|The Gouzenko Affair|chalkriver|rel SOV -30, USA 15; stab 2|A Soviet cipher clerk walks out of the embassy in Ottawa with the proof of an atomic spy ring.|date 1945-9
un|The United Nations|liberation|infl 20; legit 3|Canada at San Francisco: a middle power with a voice.|date 1945-4
pearson|Lester Pearson|un|infl 20; rel USA 10, ENG 10|The diplomat who will win a Nobel prize for peacekeeping.|
nato|The North Atlantic Treaty|pearson,gouzenko|rel USA 20, ENG 10; spirit North Atlantic Alliance: def .05|1949: Canada is a founding member, and insists on Article 2.|date 1949-4
newfoundland|Confederation with Newfoundland|nato|core St. John's, Labrador; legit 4; caunity 3|31 March 1949: after two referendums, Newfoundland becomes the tenth province.|date 1949-3
middlepower|A Middle Power|newfoundland,citizenship|spirit A Middle Power: infl .2, stab 2|Rich, safe and listened to: Canada's golden age begins.|
warbrides|The War Brides|un|popgrow 1; stab 2|Forty-eight thousand brides and twenty-two thousand children cross the Atlantic.|date 1946-1
dps|Displaced Persons|warbrides|popgrow 1; legit 3|Refugees from the camps of Europe come to the factories and farms of Canada.|date 1947-6
oas|Old Age Security|veterans|law welfare_state; money -4; stab 3|1951: a pension for every Canadian over seventy.|date 1951-1
masseycomm|The Massey Commission|middlepower|res 10; spirit Canada Council: research .02|1951: the arts and letters of Canada need support, or the Americans will supply them.|date 1951-6
immigrants|Postwar Immigration|dps|popgrow 1; build urban 1|Italians, Dutch and Poles come by the hundred thousand.|
babyboom|The Baby Boom|warbrides|popgrow 1; stab 2|The children of the peace fill the new suburbs.|
# The Cooperative Commonwealth
ccf|The CCF||ideo dem 3; ig union 4|The Co-operative Commonwealth Federation: farmers, workers and socialists for the Regina Manifesto.|ai 1
woodsworth|J. S. Woodsworth|ccf|legit 2; ws -4|The CCF leader votes alone against the war in 1939.|
douglas|Tommy Douglas|woodsworth|ideo dem 4; ig union 4|A Baptist preacher from Weyburn wins Saskatchewan in 1944.|date 1944-6
ccfgovernment|A CCF Government|douglas|leader M. J. Coldwell/Co-operative Commonwealth Federation; law welfare_state; ig union 8, ind -6; stab -3|1945: the CCF wins Ottawa, as the Gallup poll once predicted.|req year 1945; mx arcand, communist, northamerica
medicare|Public Hospital Insurance|ccfgovernment|law welfare_state; stab 4; money -5|The Saskatchewan plan for the whole country: hospital care free for all.|
crowncorpsccf|Crown Corporations for All|medicare|build steel 1, power 1; ig ind -6|Insurance, buses, power and mines in public hands.|
regina|The Regina Manifesto|ccfgovernment|spirit Cooperative Commonwealth: output .03, stab 3|No CCF government will rest until it has eradicated capitalism, the manifesto promised.|
unemployed|Work and Wages|ccf|ig union 3; unemp -2|The CCF's program of public works.|
socialplanning|Social Planning|ccfgovernment|spirit Social Planning: output .02, growth .02|A planning board to direct the postwar economy.|
# Arcand's Fascists
arcand|Adrien Arcand||ideo fas 3; rad 0.03|A Montreal journalist leads a small party of blue shirts and borrowed swastikas.|ai 1
nationalunity|The National Unity Party|arcand|ideo fas 4; caunity -4|1938: Arcand merges the fascist groups of Quebec and the West.|date 1938-7
fascistcanada|A Fascist Dominion|nationalunity|setIdeo fas; leader Adrien Arcand/National Unity Party; stab -10; legit -8|A coup the Dominion never imagined.|req stab 40; mx ccfgovernment, communist, northamerica
leaveempire|Leave the Empire|fascistcanada|rel ENG -40, GER 30|Ottawa denounces the British connection.|
axisnorth|An Axis Outpost|leaveempire|join GER; ws 10|Canada joins the Axis, and finds the Americans on its border.|req war
bluesquads|The Blue Shirts of Montreal|arcand|rad 0.02; units mil 1|Arcand's legionnaires parade at the Montreal Forum.|
interned|Arcand Interned|nationalunity|rad -0.03; stab 2|1940: the fascist leader is arrested and held for the duration.|mx fascistcanada
# The Communist Party
timbuck|Tim Buck||ideo com 3; ig union 2|The Communist leader, out of Kingston Penitentiary, organises the unemployed.|ai 1
lpp|The Labour-Progressive Party|timbuck|ideo com 4|1943: the banned party returns under a new name, after the Soviet Union becomes an ally.|date 1943-8
communist|A Soviet Canada|lpp|setIdeo com; leader Tim Buck/Labour-Progressive Party; law council; stab -10|The revolution comes to the Dominion.|req stab 35; mx ccfgovernment, fascistcanada, northamerica
comintern|Join the Comintern|communist|join SOV; rel USA -40, SOV 40|A Red Canada on the American border.|
onetrek|The Relief Camp Workers' Union|timbuck|ig union 3; ideo com 2|The Communists organised the On-to-Ottawa trek of 1935.|
macpap|The Mackenzie-Papineau Battalion|lpp|ideo com 2; axp 5|Fifteen hundred Canadians fight for the Spanish Republic.|
# North American Canada
continental|A North American Nation||rel USA 10; caunity 2|Canada's future lies with its continent, not with an empire across the sea.|ai 1
neutralcanada|Stay Out of Europe's War|continental|ws -10; caunity 8; rel ENG -20|Let Britain fight its own wars this time.|mx declaration
northamerica|The Continental Union|neutralcanada|rel USA 30, ENG -30; ally USA|A defence union with the United States in place of the Empire.|req stab 50; mx ccfgovernment, fascistcanada, communist
republic|A Canadian Republic|northamerica|law presidential; legit -4; caunity 5|The Crown goes; Canada becomes a republic of the Americas.|
continentalsupply|Continental Defence Production|northamerica|build arms 1, aircraftp 1; rel USA 10|One arsenal for one continent.|
dollar|The Canadian Dollar|continental|money 3; rel USA 5|The dollar floats and trades with the American one.|
`);

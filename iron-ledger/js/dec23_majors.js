// 2.3 Unique decisions: the great powers and China.
'use strict';
autoDecisions(`
# GER | The Reich
westwall|Build the West Wall|60|dig 9999 Saarbrücken,Aachen,Karlsruhe,Freiburg,Koblenz; money -4|Half a million labourers pour concrete along the French border: eighteen thousand bunkers from Kleve to Basel.|once; date 1938-5; ai 0.5
todt|Organisation Todt|50|build construction 2; infra 1; ig ind 3|Fritz Todt's builders take over every road, fortification and factory site in the Reich.|once; date 1938-1; ai 0.4
kdf|Strength Through Joy|40|stab 3; spirit Strength Through Joy [365]: stab 2, needs -.03|Cruise ships, holiday camps and the promise of a car for every worker.|cd 730; ai 0.2; req ideo fas
vw|The People's Car|50|build autos 2; money -3; stab 2|A factory at Fallersleben will build a car any German can buy, one day.|once; date 1938-5; ai 0.3
winterhilfe|Winter Relief Collection|25|stab 3; money 1|Rattling tins on every street corner: give to the Winterhilfswerk.|cd 365; ai 0.1
atlantik|Build the Atlantic Wall|70|dig 9999 Calais,Le Havre,Cherbourg,Caen,Brest,Dunkirk; money -5|Rommel's asparagus, bunkers and mines from Norway to the Pyrenees.|once; req hold Calais,Cherbourg & engAtWar; date 1942-3; ai 0.5
ostwall|Fortify the East Wall|60|dig 9999 Königsberg,Breslau,Frankfurt an der Oder,Allenstein; money -3|The Oder-Warthe bend and the Masurian lakes: the last line before the Reich.|once; req near Königsberg,Breslau,Allenstein,Elbing,Oppeln; ai 0.8; urgent
evacost|Evacuate East Prussia and Silesia|30|evacp Königsberg,Breslau,Oppeln,Elbing; stab -4|Too late, in the snow: the factories and the people go west.|once; req near Königsberg,Breslau,Oppeln; ai 0.7; urgent
totalwar|Proclaim Total War|60|ws 15; spirit Total War [720]: mil_out .12, stab -4, output .03|"Do you want total war?" The Sportpalast roars back.|once; req year 1943 & majorwar; ai 0.6
volkssturm|Raise the Volkssturm|50|units mil 12; mp 80; stab -6|Every man from sixteen to sixty: old men and boys with a rifle and a Panzerfaust.|once; req enemyOnSoil & year 1944; ai 0.8; urgent
wunder|Wonder Weapons|80|proj 40; res 60; ws 4|Jets, rockets and the promise of something worse: the engineers are given whatever they ask.|once; req year 1943 & war; ai 0.4
# SOV | The Motherland
stalinline|Man the Stalin Line|50|dig 9999 Minsk,Kiev,Polotsk,Mozyr,Pskov; money -3|Fortified districts along the old border, half-finished and half-forgotten.|once; date 1938-1; ai 0.3
stakhanov|Stakhanovite Movement|40|spirit Stakhanovites [365]: output .05, stab -2|A miner cut a hundred and two tonnes of coal in one shift; now everyone must.|cd 730; ai 0.2
evacuate|Evacuate Industry to the Urals|60|evacp Kiev,Kharkov,Dnepropetrovsk,Stalino,Zaporozhye,Leningrad,Odessa|Whole factories on flatcars, rolling east to Magnitogorsk, Chelyabinsk and Sverdlovsk.|once; req gerSovWar; ai 0.9; urgent; aiif near Kiev,Kharkov,Minsk,Smolensk,Odessa
scorched|Scorched Earth Order|40|burn 365 Minsk,Vitebsk,Gomel,Smolensk,Zhitomir; stab -3|Not a locomotive, not a wagon, not a kilo of grain is to be left to the enemy.|once; req gerSovWar & near Minsk,Smolensk,Zhitomir,Vitebsk; ai 0.8; urgent
mozhaisk|Dig the Mozhaisk Line|50|dig 730 Moscow,Kalinin,Tula,Kaluga,Vyazma; spawn mil 6 Moscow|Half a million Muscovites with shovels: anti-tank ditches around the capital.|once; req gerSovWar & near Smolensk,Vyazma,Kaluga,Tula,Bryansk,Kalinin,Rzhev; ai 0.9; urgent
siberians|Bring the Siberian Divisions West|40|spawn inf 10 Moscow; ws 5|Sorge reports that Japan will strike south. The Far Eastern divisions can come west.|once; req gerSovWar & notwar JAP & year 1941; ai 0.9; urgent
order227|Not One Step Back|50|ws 10; spirit Order No. 227 [365]: def .1, stab -4|Panic-mongers and cowards are to be destroyed on the spot.|once; req gerSovWar & lost Rostov,Kiev,Smolensk; ai 0.8; urgent
churches|Reopen the Churches|30|stab 5; ws 5|Stalin receives the metropolitans; the bells ring again for the Motherland.|once; req gerSovWar; ai 0.5
ladoga|The Road of Life|30|relief Leningrad; heal 5|Lorries cross the ice of Lake Ladoga with flour, and come back with children.|cd 365; req gerSovWar & near Leningrad; ai 0.6; urgent
officers|Free the Imprisoned Officers|60|rmspirit officer_purge; generals Konstantin Rokossovsky/4/off; stab -2|Rokossovsky and four thousand others come back from the camps to command again.|once; req gerSovWar; ai 0.7
stalingrad|Fortify Stalingrad|40|dig 730 Stalingrad,Kamyshin,Astrakhan; spawn inf 4 Stalingrad|The city that bears his name will not be given up.|once; req gerSovWar & near Rostov,Voronezh,Millerovo,Stalingrad; ai 0.9; urgent
# USA | The Arsenal of Democracy
wpa|Works Progress Administration|50|build construction 2; stab 3; money -3|Eight million on the public payroll building roads, bridges, schools and airfields.|once; ai 0.3
tva|Tennessee Valley Authority|60|build power 2; infra 1|Dams on the Tennessee bring light and work to the poorest valley in America.|once; ai 0.3
pearlfort|Fortify Pearl Harbor|40|dig 9999 Honolulu; mines 9999 Honolulu|Torpedo nets, radar on Opana Point and guns on every ridge of Oahu.|once; req tension 50; ai 0.3
wpb|War Production Board|60|spirit War Production Board [9999]: mil_out .08, output .02|Detroit stops building cars: it builds tanks, bombers and engines.|once; req war; ai 0.8
rosie|Rosie the Riveter|40|spirit Rosie the Riveter [9999]: manpower .08, mil_out .03|Six million women go to work in the shipyards and the aircraft plants.|once; req war; ai 0.7
gardens|Victory Gardens|20|spirit Victory Gardens [730]: farm_out .05, stab 1|Twenty million backyard plots grow a third of the nation's vegetables.|once; req war; ai 0.4
manhattan|Manhattan Engineer District|80|proj 40; res 50|Oak Ridge, Hanford and a mesa called Los Alamos.|once; req war & year 1942; ai 0.7
bonds|Hollywood War Bond Drive|30|money 8; ws 4|Film stars tour the country selling bonds from the back of trains.|cd 365; req war; ai 0.4
# ENG | The Empire
shadow|Shadow Factories|60|build aircraftp 2, engines 1; money -3|Car makers build aircraft engines in factories the Air Ministry pays for.|once; date 1936-6; ai 0.4
radar|Chain Home|50|spirit Chain Home [9999]: air .06, civdef .1|Radar towers along the coast see the bombers coming a hundred miles away.|once; date 1937-6; ai 0.5
homeguard|Raise the Home Guard|30|units mil 6; ws 5|Local Defence Volunteers: a million men with shotguns, pikes and armbands.|once; req franceDown; ai 0.7
ghqline|The GHQ Line|40|dig 730 Dover,London,Norwich,Southampton,Plymouth|Pillboxes and anti-tank ditches across the south of England against the invasion.|once; req franceDown; ai 0.6
piedpiper|Operation Pied Piper|20|stab 2; spirit Evacuees [240]: civdef .12|Three million children with gas masks and labels on their coats go to the country.|once; req war; ai 0.4
digvictory|Dig for Victory|30|spirit Dig for Victory [730]: farm_out .06|Parks, lawns and golf courses are ploughed up for potatoes.|once; req war; ai 0.4
malta|Reinforce Malta|30|dig 365 Valletta; spawn inf 1 Valletta|Spitfires flown off carriers, and convoys fought through to the island fortress.|cd 365; req atwar ITA; ai 0.5
singapore|Fortify Singapore|50|dig 9999 Singapore,Kuala Lumpur,Penang|The great guns face the sea. The jungle, they say, is impassable.|once; req tension 60; ai 0.3
# FRA | The Republic
maginot|Extend the Maginot Line to the Sea|70|dig 9999 Sedan,Lille,Dunkirk,Saint-Quentin; money -5|The line was never carried along the Belgian border. It could be, at a price.|once; ai 0.1
holidays|Paid Holidays for All|30|stab 3; ig union 5|For the first time, workers take the train to the sea.|once; req ideo dem; ai 0.2
colonial|Raise the Colonial Army|50|units inf 6; mp 40|Tirailleurs from Senegal, Algeria and Morocco sail for the metropole.|once; req war; ai 0.6
taxis|The Taxis of the Marne|10|heal 10; ws 5|Every taxi in Paris takes soldiers to the front, as in 1914.|once; req near Paris,Reims,Amiens,Troyes,Orléans; ai 0.7; urgent
northafrica|Fight On from North Africa|60|capital Algiers; legit -5; ws 10|The government crosses to Algiers with the gold and the fleet, and the war goes on.|once; req lost Paris & safe Algiers; ai 0.2
weygand|The Weygand Line|40|dig 365 Amiens,Reims,Rouen,Troyes; heal 5|A chain of fortified villages along the Somme and the Aisne.|once; req near Sedan,Lille,Amiens,Reims; ai 0.8; urgent
# ITA | The Duce's Italy
grain|The Battle for Grain|40|spirit Battle for Grain [730]: farm_out .08|Mussolini threshes wheat bare-chested for the newsreels.|cd 1000; ai 0.2
gold|Gold for the Fatherland|30|money 6; stab 2|Women give their wedding rings to pay for the war in Ethiopia.|once; ai 0.3
pontine|Drain the Pontine Marshes|50|build farm 2; infra 1|New towns rise where malaria ruled: Littoria, Sabaudia, Pontinia.|once; ai 0.2
alpine|The Alpine Wall|50|dig 9999 Turin,Bolzano,Udine|Bunkers in the passes, facing France, Switzerland, Germany and Yugoslavia alike.|once; date 1938-1; ai 0.2
decima|Decima MAS|40|spirit Decima MAS [365]: navy .06|Frogmen on human torpedoes, against the battleships in Alexandria harbour.|once; req atwar ENG; ai 0.5
tobruk|Fortify Tobruk|40|dig 730 Tobruk,Bardia,Derna|A perimeter of concrete posts around the harbour, the best in Africa.|once; req atwar ENG; ai 0.4
# JAP | The Empire
zaibatsu|Mobilise the Zaibatsu|50|build arms 2, aircraftp 1; ig ind 5|Mitsubishi, Mitsui and Sumitomo build for the Emperor.|once; ai 0.4
railways|Pacify the Railways|30|fn calmUnrest; stab -1|Blockhouses every few miles along the lines, and reprisals against every village near a cut.|cd 365; req chiJapWar; ai 0.5
ichigo|Operation Ichi-Go|60|spirit Ichi-Go [180]: atk .12, supply -.05|Half a million men drive south to link Peking with Indochina and take the American airfields.|once; req year 1944 & chiJapWar; ai 0.6
southres|Develop the Southern Resource Area|60|build oilr 2, rubberp 1|Engineers rebuild the wrecked wells of Palembang and Balikpapan.|once; req hold Palembang; ai 0.6
tokko|Special Attack Corps|50|spirit Divine Wind [365]: navy .1, air .05, stab -2|Young pilots volunteer, or are volunteered, to dive their aircraft into the enemy fleet.|once; req year 1944 & losingWar; ai 0.6
ketsugo|Ketsu-Go: Defend the Home Islands|60|dig 9999 Tokyo,Kagoshima,Fukuoka,Osaka; spawn mil 10 Tokyo; mp 100|A hundred million will die with honour rather than surrender.|once; req year 1944 & losingWar; ai 0.8; urgent
# CHI | War of Resistance
yellowriver|Breach the Yellow River Dikes|30|flood 900 Zhengzhou,Kaifeng,Zhoukou,Fuyang; stab -6; legit -6|Blow the dikes at Huayuankou. The river will stop the Japanese, and drown the plain of Henan.|once; req chiJapWar & near Zhengzhou,Kaifeng,Xuzhou; ai 0.9; urgent; aiif near Zhengzhou,Kaifeng
changsha|Burn Changsha|10|burn 365 Changsha; stab -4|Rather than leave it to the Japanese, the city is set alight. The Japanese do not come; the city burns anyway.|once; req chiJapWar & near Changsha; ai 0.2
universities|Move the Universities West|30|res 30; legit 3|Peking, Tsinghua and Nankai walk a thousand miles to Kunming and teach in mud huts.|once; req chiJapWar; ai 0.5
coops|Industrial Cooperatives|30|build tools 1, textile 1|Gung Ho: small workshops in the interior make what the coastal mills used to.|once; req chiJapWar; ai 0.4
shanghaifac|Evacuate the Coastal Factories|40|evacp Shanghai,Wuhan,Nanjing,Tianjin|Six hundred factories on junks and barges up the Yangtze, through the gorges.|once; req chiJapWar & near Shanghai,Wuhan,Nanjing,Tianjin; ai 0.9; urgent
newlife|New Life Movement|30|stab 3; legit 2|Confucian virtue, clean clothes and no spitting: Madame Chiang's moral revival.|cd 730; ai 0.2
pressgang|The Conscription Drive|40|mp 150; stab -3|Press-gangs tie the recruits together with rope so they cannot run.|cd 365; req chiJapWar; ai 0.5
hengyang|Fortify the Hunan Line|40|dig 730 Changsha,Hengyang,Changde|Three times the Japanese will come to Changsha. Three times they will be met.|once; req chiJapWar; ai 0.5
`);

// 2.7 Decisions: the French State and Free France, the puppet states of the war, and a second round for the great
// powers and the nations of the world. Written like the decisions of 2.3 (decisions23.js).
'use strict';
// effects these decisions need
Object.assign(FNS, {
  indep: [c => { const o = c.overlord; if (!o) return; c.overlord = null; c.autonomy = 100; addRel(c.tag, o, -40); if (ok(o)) declareWar(c.tag, o, [{ by: c.tag, vs: o, type: 'take', provs: [] }], `${c.adj} Rising`, true); logMsg(`${c.name} rises against ${cname(o)}.`, 'world', [c.tag, o]); }, 'We break with our overlord and fight it'],
  deposeDuce: [c => { c.leader = 'Pietro Badoglio'; c.party = 'Military Government'; setIdeology(c, 'aut', true); c.stab = Math.max(0, c.stab - 10); logMsg('The Grand Council votes against Mussolini; the King has him arrested at the Villa Savoia and names Marshal Badoglio. "The war goes on."', 'world', [c.tag]); }, 'Mussolini falls; Badoglio governs'],
  surrenderJap: [c => { for (const w of G.wars.slice()) if (w.att.includes(c.tag) || w.def.includes(c.tag)) { const side = w.att.includes(c.tag) ? 'def' : 'att'; if (G.wars.includes(w)) peace(w, side); } logMsg('The Emperor broadcasts to his people: Japan accepts the Potsdam Declaration.', 'world', [c.tag]); }, 'Japan surrenders: every war it fights ends in the enemy\'s favour']
});
autoDecisions(`
# VIC | The French State
xnatrev|The National Revolution|40|stab 4; vmarshal 4; legit 2; spirit Work, Family, Fatherland [720]: stab 3, ws -2|Liberty, Equality, Fraternity are chiselled off the town halls; Work, Family, Fatherland go up in their place.|once; ai 0.8
xcharter|The Labour Charter|40|ig union -8; ig ind 4; rad -0.03; spirit The Labour Charter: output .03, stab 1|Strikes and lockouts forbidden; unions and employers in single corporations under the State's eye.|once; ai 0.5
xpeasant|The Peasant Corporation|30|ig rural 6; build farm 1; vmarshal 2|"The land does not lie." The Marshal promises the peasant his place at the heart of the nation.|once; ai 0.6
xsecours|The National Relief|20|stab 3; money -1|The Secours National runs soup kitchens and parcels for the prisoners, and the Marshal's portrait hangs in all of them.|cd 365; ai 0.4
xwiesbaden|The Armistice Commission|25|vcost -1; vcollab -10|Months of haggling at Wiesbaden over the price of occupation.|cd 180; req collab 30 & noanton; ai 0.5
xcdm|Camouflage du Matériel|25|equip arms 400, artillery 40; vpress 6|Lorries in barns, guns in caves, rifles in the walls of monasteries: the army's own conspiracy against the Armistice Commission.|cd 240; req noanton; ai 0.3
xafricarmy|The Army of Africa|30|spawn inf 2 Algiers; vpress 5; vemp northafrica 6|Germany permits 120,000 men in North Africa to defend it against the British; Weygand counts them differently.|once; req vholds northafrica & noanton; ai 0.5
xfleetafrica|The Fleet to Africa|25|fn viAfrica|Mers-el-Kébir, Bizerte, Dakar, Casablanca: the battle squadrons put to sea for the African ports, where no panzer can reach them.|once; req noanton; ai 0.15
xscuttle|Standing Orders for the Fleet|10|fn viScuttleOrder; vmarshal 2|Darlan's order of 1940: no ship is to fall into foreign hands, German or British.|once; ai 0.6
xlvf|The Legion of French Volunteers|30|vcollab 8; vpress -6; axp 3; rel GER 10; rel SOV -20|Doriot and Déat raise a legion to fight Bolshevism in German uniform with a tricolour patch.|once; req collab 40 & noanton; date 1941-7; ai 0.2
xmilice|The Milice|40|vcollab 10; rad -0.06; legit -8; units mil 3|Darnand's paramilitary police against the Maquis: forty thousand men who fear the Resistance more than the Gestapo does.|once; req collab 50; date 1943-1; ai 0.2
xpaxsyria|The Airfields of Syria|20|fn viSyriaFields|German aircraft may refuel at Aleppo on their way to Iraq.|once; req vholds levant & noanton; date 1941-4; until 1941-12; ai 0.2
xbizerte|Bizerte for the Axis|30|vcollab 12; vpress -10; vemp northafrica -10; rel ENG -20|The port and the railway through Tunisia, to supply Rommel.|once; req vholds northafrica & collab 45 & noanton; ai 0.1
xdecoux|Decoux's Indochina|20|vemp indochina 12; stab 1|The Admiral governs a colony cut off from France with a Japanese army in its ports, and a cult of the Marshal for the Vietnamese.|once; req vholds indochina; ai 0.6
xjapindo|The Agreement with Japan|20|vemp indochina -6; vpress -3; rel JAP 15|Airfields and garrisons in Tonkin for Japan, and French sovereignty, on paper, in return.|once; req vholds indochina; date 1940-9; ai 0.5
xcount|The Count of Paris|60|fn viKing; vmarshal -4; legit 3|The pretender in Morocco is the obvious heir to a Marshal who is eighty-four. Some at Vichy dream of a restoration.|once; req marshal 50; ai 0.02
xdoublegame|The Double Game|30|vpress 8; rel USA 15; rel ENG 10; vcollab -6|Secret talks with Washington through Admiral Leahy, and with London through Madrid and Lisbon.|cd 365; req noanton & collabmax 50; ai 0.2
xrejoin|Africa Rejoins the War|80|fn viSwitch|The Army of Africa, and the fleet if it lies in African ports, turn on the Axis in the Marshal's name. The free zone will be occupied within days.|once; req noanton & collabmax 35 & vholds northafrica; date 1942-1; ai 0
xaxis|A Treaty with the Reich|80|fn viAxis|An end to the armistice: France at war at Germany's side, its prisoners home, its costs gone, its zone untouched.|once; req collab 75 & noanton; ai 0
xhandover|Hand the Country to the Republic|60|fn viRepublic|The Marshal resigns to the National Assembly; the French State ends; everything it holds passes to the Republic.|once; req anton; ai 0
# FRA | Free France
xappeal|The Appeal of the Eighteenth of June|10|legit 4; ws 6; infl 10|"Whatever happens, the flame of French resistance must not and shall not go out."|once; req fraCap; ai 0.9
xbroadcast|Les Français parlent aux Français|10|resist SELF 5; legit 1|Every evening the BBC broadcasts in French: the news, the personal messages, and the songs mocking Radio Paris.|cd 90; req fraCap; ai 0.5
xleclerc|Leclerc's Column|20|axp 4; legit 3; ws 4|From Chad across the Sahara to Kufra: "We shall not lay down our arms until our colours fly over the cathedral of Strasbourg."|once; req fraCap; date 1941-1; ai 0.5
xnormandie|The Normandie-Niemen Squadron|15|rel SOV 15; axp 2|French pilots to fly Yaks on the Eastern Front: the Resistance has a seat in Moscow too.|once; req fraCap & atwar GER; date 1942-11; ai 0.4
xcnr|The National Council of the Resistance|30|resist SELF 15; legit 6; ideo dem 3|Communists, Christian Democrats, Socialists and Gaullists around one table in a Paris flat, with a programme for after the war.|once; req fraCap; date 1943-5; ai 0.5
xffi|The French Forces of the Interior|30|resist SELF 10; spawn mil 3 Limoges|The Maquis under one command, ready to rise when the landings come.|once; req fraCap; date 1944-2; ai 0.5
xepuration|The Purge|30|legit 4; stab -3; rad -0.03|Collaborators before the courts: ten thousand summary executions, then trials. Pétain is condemned to death and his sentence commuted.|once; req peace; date 1944-9; ai 0.4
xfrenchunion|The French Union|40|stab 3; legit 3; spirit The French Union: stab 2, manpower .04|The Empire renamed and promised a voice: the Brazzaville Conference's promise, kept by half.|once; date 1944-1; ai 0.3
# AOI | Italian East Africa
xaoiroads|The Roads of the Empire|25|infra 2; money -2|Strade dell'Impero, tarred across the highlands with Italian labour.|once; ai 0.6
xaoicol|Colonists for the Highlands|30|ig land 4; mp 10; rad 0.02|Farm villages for Italian peasants in Gojjam and the Galla lands.|once; ai 0.3
xaoiascari|The Ascari|20|units inf 2; mp 20|Eritrean and Somali battalions with red fezzes, the empire's best soldiers.|cd 365; ai 0.6
xaoibanda|Recruit the Bande|15|units mil 2|Irregular bands of Ethiopian tribesmen, paid in silver thalers.|cd 180; ai 0.4
xaoiamnesty|Amnesty for the Rases|30|stab 4; resist SELF -8; legit 3|The Duke of Aosta offers the Ethiopian nobles their lands back in return for peace.|once; ai 0.5
xaoiredoubt|The Redoubt of Amba Alagi|20|fort Dessie, Gondar; dig 365 Gondar|When the British come, the army will hold the mountains of the north.|once; req war; ai 0.6
# BOH | The Protectorate
xbohhacha|Hácha's Government|20|stab 3; legit 2|The President accepts the Protectorate to save Czech lives. History will argue over him.|once; ai 0.6
xbohskoda|Škoda for the Wehrmacht|20|build artyf 1; rel GER 10; stab -2|Shifts round the clock at Pilsen and Brno.|cd 365; ai 0.5
xbohanthro|Operation Anthropoid|0|resist SELF 10; stab -6|Two Czech paratroopers wait at a tram stop in Libeň for the Reich Protector's open car.|once; date 1942-5; ai 0
# SLK | The Slovak State
xslktiso|The Priest-President|20|stab 3; legit 3; ig devout 4|Tiso governs from the pulpit and the presidential palace at once.|once; ai 0.6
xslkguard|The Hlinka Guard|25|units mil 2; rad -0.03; legit -3|The party's militia, in black.|once; ai 0.4
xslkrising|The Slovak National Uprising|0|fn indep; ws 10|August 1944: the army rises at Banská Bystrica against Tiso and the Germans.|once; date 1944-8; req atwar SOV; ai 0
# MEN | Mengjiang
xmenbanners|Raise the Banners|20|units cav 2; mp 10|The Mongol banner cavalry rides again under Prince De.|cd 365; ai 0.5
xmenopium|The Opium Monopoly|15|money 3; legit -3|Kalgan's revenue is opium, grown in the oasis farms and sold in Peking.|cd 365; ai 0.4
xmenunite|One Mongolia|40|claim Ulan Bator; ws 5; rel MON -20|Prince De dreams of uniting the Inner and Outer Mongols, under Japan or without it.|once; ai 0.1
# NDH,HEL,SRB | Occupied Europe
xndhdomobran|The Home Guard|20|units inf 2|The Domobranstvo: conscripts who would rather be farming.|cd 365; ai 0.5
xndhcoast|The Rome Agreements|20|rel ITA 10; stab -3|Dalmatia to Italy, as the price of independence.|once; ai 0.4
xhelbread|Bread from the Red Cross|20|stab 4; rel SWE 10|Swedish ships bring wheat to Piraeus under a neutral flag, by leave of both blockades.|once; ai 0.6
# BRM,AZH,VNM | Free Asia
xbrmbna|The Burma National Army|20|units inf 2; ws 4|Aung San's army, trained by the Japanese, waits for its moment.|once; ai 0.5
xbrmturn|Turn on the Japanese|40|fn indep; rel ENG 20; ws 8|March 1945: the BNA marches out of Rangoon to fight the Japanese, by arrangement with Mountbatten.|once; date 1945-3; ai 0
xazhjhansi|The Rani of Jhansi Regiment|15|units inf 1; ws 4|A regiment of women, raised in Singapore by Captain Lakshmi.|once; ai 0.4
xazhdelhi|Chalo Delhi|30|ws 10; axp 3|"Give me blood and I will give you freedom!"|once; ai 0.4
xvnmviet|Vietnam United|20|legit 5; stab 3|The Emperor's government recovers Cochinchina from the French on paper, and takes the name Vietnam.|once; ai 0.5
# GER | The Reich at War
xtodt|The Organisation Todt|30|build construction 1; infra 1|Fritz Todt's army of labourers builds the autobahns, the West Wall and the Atlantic Wall.|once; ai 0.5
xwinterhilfe|The Winter Relief|20|stab 2; money 1|Collection tins rattle in every street every winter: give for the Winterhilfswerk.|cd 365; ai 0.3
xwolfslair|The Wolf's Lair|30|pp 30; ig army -4|The Führer's headquarters in the East Prussian forest: concrete, mosquitoes and every decision.|once; req atwar SOV; ai 0.5
xtotalwar|The Sportpalast Speech|40|ws 15; spirit Total War [540]: mil_out .1, stab -3|"Do you want total war?" Goebbels asks a hall of party members, who answer as they are expected to.|once; date 1943-2; req war; ai 0.6
xv2|The Vengeance Weapons|60|money -4; ws 6; tech m_art2|Rockets from Peenemünde for London and Antwerp.|once; date 1944-6; req war; ai 0.4
# SOV | The Motherland at War
xstavka|The Stavka|30|pp 20; spirit The Stavka: org .05|The supreme headquarters of the Red Army, with Stalin at its head and Zhukov at his side.|once; req atwar GER; ai 0.7
xpartisans|The Central Staff of the Partisan Movement|30|resist SELF 10; axp 3|Ponomarenko's staff runs the war behind the German lines with radios, parachutes and NKVD officers.|once; req atwar GER; date 1942-5; ai 0.6
xsiberians|The Siberian Divisions|40|spawn inf 6 Moscow; fort Moscow|Sorge reports that Japan will strike south, not north: the Far Eastern army can come west.|once; req atwar GER & lost Smolensk; ai 0.8; urgent
xchurch|The Church Restored|20|ig devout 6; ws 4; legit 3|Stalin receives the three surviving metropolitans and lets them elect a Patriarch.|once; date 1943-9; ai 0.5
# ENG | The Island Fortress
xspitfire|The Spitfire Fund|20|equip aircraft 40; ws 3|Towns, firms and schools buy fighters by subscription; the Ministry names them after the donors.|cd 365; req atwar GER; ai 0.5
xbletchley|Station X|30|res 15; spirit Ultra [720]: def .04, navy .05|Codebreakers in huts at a country house in Buckinghamshire read the German machine.|once; date 1940-1; ai 0.6
xsoe|Set Europe Ablaze|30|resist SELF 6; axp 2|Churchill's order to the Special Operations Executive: arms, money and agents for every resistance in Europe.|once; date 1940-7; req war; ai 0.6
xmulberry|The Mulberry Harbours|60|build port 1; money -4|Concrete caissons the size of apartment blocks, to be towed across the Channel and sunk off Normandy.|once; date 1943-9; req war; ai 0.4
# USA | The Arsenal of Democracy
xliberty|The Liberty Ships|50|build shipyard 2; money -4|Prefabricated freighters welded together in four days: Henry Kaiser launches one every day.|once; date 1941-9; ai 0.6
xmanhattan|The Manhattan Engineer District|80|res 30; proj 40|Two billion dollars, three secret cities and the best physicists in the world.|once; date 1942-6; req war; ai 0.5
xwacs|The Women's Army Corps|20|mp 60; stab 1|A hundred and fifty thousand women in uniform free men for the front.|once; req war; ai 0.5
xgibill|The GI Bill|40|stab 4; legit 3; res 10|College, homes and businesses for sixteen million veterans: the war's most lasting victory at home.|once; date 1944-6; ai 0.5
# ITA | The Empire at War
xautarchia|Autarky in Earnest|30|build synth 1; spirit Autarchia: tradecap -.04, res_out .05|Iron from Elba, bauxite from Istria, wool from ersatz milk: Italy shall need no one.|once; ai 0.4
xgold|Gold for the Fatherland|20|money 4; stab 2|Italian wives give their wedding rings to the state and receive iron ones blessed by the bishops.|once; req war; ai 0.6
xgrandcouncil|Convene the Grand Council|40|fn deposeDuce|The Grand Council of Fascism has not met since 1939. Grandi has a motion ready.|once; date 1943-7; req war & lost Palermo; ai 0
# JAP | The Empire at War
xkamikaze|The Special Attack Units|40|ws 10; spirit Divine Wind [365]: navy .06, ws 4|Volunteers to fly their aircraft into the enemy's ships.|once; date 1944-10; req war; ai 0.6
xhome|The Decisive Battle on Home Soil|40|units mil 10; fort Tokyo, Osaka, Fukuoka|Ketsu-Go: a hundred million will die as one, with bamboo spears if need be.|once; date 1945-4; req war; ai 0.6
xsurrender|The Imperial Rescript|60|fn surrenderJap; stab -10|"We have resolved to pave the way for a grand peace for all the generations to come by enduring the unendurable and suffering what is insufferable."|once; date 1945-8; req war; ai 0
# CHI | The War of Resistance
xstilwell|Stilwell's Divisions|30|units inf 2; rel USA 10; axp 3|American-trained divisions at Ramgarh in India, the X Force, to reopen the road to Burma.|once; date 1942-8; req atwar JAP; ai 0.5
xflying|The Flying Tigers|30|equip aircraft 40; rel USA 10|Chennault's American Volunteer Group: shark-mouthed P-40s over Kunming.|once; date 1941-8; req atwar JAP; ai 0.6
xyellowgold|The Gold Yuan|20|money 4; stab -3; rad 0.03|New notes to pay the army; the price of rice doubles every month.|cd 365; req war; ai 0.3
# SWE,NOR,DEN,FIN | The North
xnordic27|A Nordic Defence Council|30|rel SWE 10, NOR 10, DEN 10, FIN 10; ws 3|The four foreign ministers meet in Stockholm to talk of a common defence, and agree to meet again.|once; ai 0.2
# EST,LAT,LIT | The Baltic States
xbaltic27|The Baltic Entente in Arms|30|rel EST 10, LAT 10, LIT 10; ws 5|Joint staff talks and a common air-defence plan, too late and too small.|once; req tension 40; ai 0.3
xforest|The Forest Brothers|20|resist SELF 10; units mil 1|Men who will not serve the occupier go to the woods with their hunting rifles.|once; req war; ai 0.4
# CAN,AST,NZL,SAF | The Dominions
xcomtrain|The Commonwealth Air Training Plan|40|equip aircraft 30; axp 3; rel ENG 10|Pilots from every dominion trained on the prairies, a hundred and thirty thousand of them.|once; req atwar GER; ai 0.6
xwarbrides|Victory Bonds|20|money 4; ws 3|Posters, parades and film stars sell the bonds door to door.|cd 365; req war; ai 0.4
# IRQ,EGY,SAU,PER | The Middle East
xpipeline|The Pipeline to the Sea|30|money 3; rel ENG 5; build oilr 1|Oil from Kirkuk and Abadan through the desert to the Mediterranean.|once; ai 0.4
xarableague27|The Alexandria Protocol|30|infl 15; rel EGY 10, IRQ 10, SAU 10|The Arab states agree on a league of their own.|once; date 1944-9; ai 0.4
# MEX,BRA,ARG,CHL,COL,VEN,CUB,PRU | The Americas
xbracero|The Bracero Programme|20|money 3; rel USA 10; mp -5|Mexican farmhands for American fields, at the American government's guarantee.|once; date 1942-8; ai 0.4
xnatoil|National Oil|30|build oilr 1; legit 4; rel USA -10|The subsoil belongs to the nation.|once; ai 0.3
xhemisphere|Hemispheric Defence|20|rel USA 10; equip arms 100|Lend-Lease for the republics that break with the Axis.|once; req tension 50; ai 0.4
`);

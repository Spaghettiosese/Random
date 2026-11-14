// Greece (2.1): hand-written. The National Schism between the King and the Venizelists, the merchant fleet that is Greece's fortune, the Great Idea, and the mountains of Epirus.
'use strict';
TREES.GRE = autoTree('gr_', `
# The National Schism
restored|The Restored King||pp 40; stab 2|George II returned in 1935 after a rigged plebiscite. Venizelos died in Paris in March 1936.|ai 6
s_parliament|A Hung Parliament|restored|stab -2 ?? Let the parties bargain => legit 4; pp -10 // Let the King appoint => pp 30; bop -5|Royalists 143, Venizelists 141, Communists 15.|ai 6
## the fourth of august
metaxas|The Fourth of August|s_parliament|law autocracy, decree; leader Ioannis Metaxas/4th of August Regime; bop -15; pp 60|A general who lost every election is made dictator by the King.|mx monarchy,venizelist,kke; ai 6
m_third|The Third Hellenic Civilisation|metaxas|spirit Third Hellenic Civilisation: ws 4, stab 2, pp .05|After ancient Greece and Byzantium, the Greece of Metaxas.|
m_eon|The EON Youth|m_third|mp 60; spirit National Youth Organisation: manpower .03, ws 3|Blue uniforms and Spartan salutes.|
m_maniadakis|Maniadakis's Police|metaxas|law secret_police; fn intelBoost; ig intel -6|Communists sign declarations of repentance or go to the islands.|
m_labour|The Labour Charter|m_third|ig union -6; law regulated; spirit Labour Peace: output .03, stab 2|Collective contracts, compulsory arbitration, the eight-hour day.|
m_peasant|Debts Forgiven|m_labour|ig rural 8; stab 3; money -4|Metaxas cancels the peasants' debts.|
m_censor|The Censors|m_maniadakis|law censorship; stab 2 ?? Ban Pericles' Funeral Oration => stab 2; legit -4 // Keep the classics => legit 2|Even Thucydides is censored.|
m_king|The King's Man|metaxas|legit 4; ig army 6|Metaxas governs because the King lets him.|mx m_leader
m_leader|The First Peasant, the First Worker|metaxas|pp 40; legit -4; bop -10|Metaxas wants to be the Leader, not the King's servant.|mx m_king
m_fascism|The Italian Model|m_leader,m_eon|ideo fas 10; rel ITA 20|A corporate state on the Roman pattern.|mx m_britain
m_britain|Britain's Friend|m_king,m_eon|m_leader,m_eon|rel ENG 30; infl 20|Greece's dictator remains loyal to the Royal Navy.|mx m_fascism
m_ochi|Ochi|m_britain|ws 15; spirit The Day of No: ws 8, def .05, org .03|At three in the morning Metaxas answers the Italian ultimatum with a single word.|req atwar ITA
m_ally|The British Alliance|m_britain|fn joinAllies|Greece stands with Britain.|req tension 55
m_axis|The Axis Road|m_fascism|fn joinAxis; rel GER 20|Greece chooses the side that seems to be winning.|req gerFriend
m_death|Metaxas Dies|m_ochi|stab -4; leader Alexandros Koryzis/4th of August Regime|The dictator dies in January 1941, the war half-won.|req year 1941
m_regime|The Regime Endures|m_peasant,m_censor|stab 6; spirit Fourth of August State: stab 3, pp .05|Metaxas's state outlives its founder.|
## the constitutional monarchy
monarchy|The Constitutional Monarchy|s_parliament|bop -5; legit 4; stab 2|The King keeps his oath to the 1911 constitution.|mx metaxas,venizelist,kke; ai 0
k_demertzis|A Caretaker Cabinet|monarchy|leader Konstantinos Demertzis/Royal Government; stab 2|A professor governs until the parties agree.|
k_pact|The Sofoulis–Tsaldaris Pact|k_demertzis|pp 30; bop 5; legit 4|Liberals and Populists agree to share power.|
k_amnesty|Amnesty for the Venizelist Officers|k_pact|bop 8; ig army -4; xp|The officers of the 1935 coup return to the army.|
k_elections|Honest Elections|k_amnesty|law universal; legit 8|The King accepts whatever the voters decide.|
k_crown|The Crown Above Parties|k_elections|legit 6; spirit Constitutional Crown: legit 4, stab 3|George II reigns; he does not govern.|
k_britain|The British Connection|k_crown|rel ENG 30|The royal family has a London home.|
k_allies|Join the Allies|k_britain|fn joinAllies|Greece fights beside Britain.|req tension 55
k_exile|The King in Exile|k_allies|legit 4|The court goes to Crete, then Cairo, then London.|req enemyOnSoil
k_return|The King Returns|k_exile|legit 10; stab 4|The plebiscite of 1946 brings him home again.|req hold Athens
## the venizelists
venizelist|The Venizelist Revival|s_parliament|bop 15; ideo dem 10|The Liberal Party without Venizelos, but with his heirs.|mx metaxas,monarchy,kke; ai 0
v_sofoulis|Sofoulis Leads the Liberals|venizelist|leader Themistoklis Sofoulis/Liberal Party; ideo dem 6|An old man from Samos.|
v_plastiras|General Plastiras|venizelist|generals Nikolaos Plastiras/3/off; ig army 4|The Black Rider, in exile in France.|
v_coup|The Officers' Movement|v_plastiras|stab -4 ?? Seize power => setIdeo aut; leader Nikolaos Plastiras/Officers' Movement; bop 10 // Wait for elections => legit 4|Venizelist officers prepare a coup, as in 1922 and 1935.|
v_republic|The Second Republic|v_sofoulis,v_coup|v_sofoulis|setIdeo dem; rename Hellenic Republic/Greek; bop 15; stab -6|The King is sent into exile once more.|
v_crete|The Cretan Base|v_republic|stab 2; mp 20|Crete, Venizelos's island, is the heart of the Republic.|
v_refugees|The Refugee Vote|v_republic|ig rural 8; stab 3|The million and a half refugees of 1922 vote Liberal.|
v_land|Land for the Refugees|v_refugees|build farm 3; spirit Refugee Settlements: farm_out .05, stab 2|Macedonian estates for the families of Smyrna.|
v_west|The Western Democracies|v_republic|rel ENG 25, FRA 25, USA 20|Venizelos's Greece was always with the Entente.|
v_balkan|The Balkan Pact Renewed|v_west|ent balkan 20; rel TUR 20|Venizelos made peace with Atatürk; his heirs keep it.|
v_allies|Join the Allies|v_west|fn joinAllies|The Republic stands with the democracies.|req tension 55
v_democracy|A Venizelist Greece|v_land,v_balkan|stab 8; spirit Liberal Greece: legit 6, research .03, infl .1|Modern, democratic and Western.|
## the communists
kke|The KKE Underground|s_parliament|ideo com 12; bop 20; rad .04|Fifteen deputies hold the balance; the Party wants more.|mx metaxas,monarchy,venizelist; ai 0
c_zachariadis|Zachariadis's Line|kke|ideo com 6; pp 20|A secretary-general trained in Moscow.|
c_tobacco|The Tobacco Workers|kke|ig union 10; rad .04|Salonika's tobacco warehouses strike.|
c_may|The May Days of Salonika|c_tobacco|stab -6; ideo com 8|Twelve workers shot; the city in revolt.|
c_popular|The Popular Front|c_zachariadis|ideo com 6, dem 4; pp 30|Communists and Agrarians on a joint list.|
c_eam|The National Liberation Front|c_popular,c_may|resist GRE 10; ideo com 8|EAM: a front of every party that will fight.|
c_rising|The People's Rising|c_eam|setIdeo com; leader Nikos Zachariadis/KKE; stab -8|The red flag on the Acropolis.|req war
c_land|Land to the Peasants|c_rising|ig land -10, rural 10; spirit land_reform|The last estates of Thessaly.|
c_ships|Nationalise the Ships|c_rising|fleet -20; money 20; ig pb -10|The shipowners flee to London with half the fleet.|
c_moscow|With Moscow|c_land|rel SOV 40; fn joinComintern|Greece joins the socialist camp.|
c_balkan|The Balkan Federation|c_moscow|rel YUG 30, BUL 30, ALB 20|A socialist Balkan.|
c_republic|The People's Republic|c_ships,c_balkan|rename Hellenic People's Republic/Greek; stab 8|The monarchy is abolished.|
# The Merchant Fleet
fl|The Merchant Fleet||fleet 10; money 4|The fifth largest merchant fleet in the world, owned by families from Chios, Andros and Kasos.|ai 4
f_owners|The Shipowners of London|fl|fleet 8; money 4|The Greek shipping houses are run from the City.|
f_liberty|Old Tramp Steamers|fl|fleet 10|Second-hand ships, bought cheap in the Depression.|
f_lloyds|Lloyd's Insurance|f_owners|money 6; rel ENG 10|Insured in London, chartered by anyone.|
f_onassis|Onassis and Niarchos|f_owners|fleet 12; money 6|Young men from Smyrna and Athens build tanker empires.|
f_tankers|Oil Tankers|f_onassis|fleet 10; spirit Tanker Fleet: tradecap .05|The future of shipping is oil.|
f_charter|Charter to the Highest Bidder|f_lloyds|money 8; infl 10|Greek ships carry everyone's cargo.|
f_panama|Flags of Convenience|f_tankers|money 10; stab -2|Ships registered in Panama pay no Greek tax.|mx f_patriotic
f_patriotic|Under the Greek Flag|f_tankers|fleet 8; ws 2; spirit Greek Flag: tax .04|Ships stay Greek and pay Greek tax.|mx f_panama
f_piraeus|The Port of Piraeus|f_liberty|build port 2; infra 1|The busiest port in the eastern Mediterranean.|
f_yards|The Skaramanga Yards|f_piraeus|build shipyard 1; fleet 6|Ships built in Greece.|
f_seamen|The Seamen's Union|f_yards|ig union 6; stab 2|Sailors' wages and pensions.|
f_wartime|The Wartime Pool|f_charter,f_seamen|fleet 10; spirit Merchant Fleet at War: tradecap .06, supply .03|Greek ships join the Allied convoys.|req war
f_losses|Replace the Losses|f_wartime|fleet 15; money -6|Every ship sunk is replaced.|req war
f_empire|A Shipping Empire|f_patriotic,f_wartime|f_panama,f_wartime|fleet 20; money 12; spirit Masters of the Sea Lanes: tradecap .08, invest .2|Greece owns the largest merchant fleet in the world.|
# The Great Idea
mi|The Great Idea||ws 3|Every Greek child knows the map of Byzantium. 1922 ended the dream in the fires of Smyrna.|ai 3
mi_epirus|Northern Epirus|mi|claim Vlorë; rel ALB -15|The Greeks of Argyrokastro and Korytsa are under Albanian rule.|
mi_epirus_take|Liberate Northern Epirus|mi_epirus|core Vlorë; ws 6|The Greek army takes the towns it won in 1913.|req hold Vlorë
mi_tirana|March on Tirana|mi_epirus_take|claim Tirana, Shkodër|Throw the Italians out of Albania.|req atwar ITA
mi_dodecanese|The Dodecanese|mi|claim Rhodes|Twelve Greek islands under the Italian flag.|
mi_rhodes|Rhodes Returns|mi_dodecanese|core Rhodes; stab 4|The Colossus would be proud.|req hold Rhodes
mi_cyprus|Enosis with Cyprus|mi|stab 2 ?? Demand it of Britain => claim Nicosia, Famagusta; rel ENG -25 // Wait for a better day => rel ENG 10|The Greeks of Cyprus rioted in 1931.|
mi_cyprus_union|The Union of Cyprus|mi_cyprus|core Nicosia, Famagusta; ws 6|The island comes home.|req hold Nicosia
mi_smyrna|Remember Smyrna|mi|ws 4; rel TUR -15|The Asia Minor catastrophe will not be forgotten.|mx mi_peace
mi_peace|The Venizelos–Atatürk Friendship|mi|rel TUR 30; nap TUR; ent balkan 10|The old enemy is a neighbour now.|mx mi_smyrna
mi_ionia|Ionia|mi_smyrna|claim Izmir; ws 6|The Greek coast of Asia.|req atwar TUR
mi_city|The City|mi_ionia|claim Istanbul, Edirne; ws 8|Constantinople.|req atwar TUR
mi_thrace|Keep Western Thrace|mi_peace|fort Kavala, Alexandroupoli; units inf 2|Bulgaria wants Kavala; it will not get it.|
mi_byzantium|The Empire Reborn|mi_city,mi_cyprus_union,mi_rhodes|stab 10; spirit Byzantium Reborn: ws 8, stab 4, infl .2|Two continents, five seas.|
# Defence of the Realm
df|The Army of Greece||spirit army_reform; pp 20|Fourteen divisions, an excellent officer corps, almost no tanks.|ai 3
d_papagos|General Papagos|df|generals Alexandros Papagos/4/def; xp|The Chief of Staff plans for an Italian and a Bulgarian war.|
d_metaxas_line|The Metaxas Line|d_papagos|fort Kavala, Alexandroupoli, Salonika; spirit Metaxas Line: def .06|Twenty-one forts on the Bulgarian border.|
d_rupel|Fort Rupel|d_metaxas_line|fort Salonika; spirit Fort Rupel: def .03|The Germans will need days to take it.|
d_epirus|The Epirus Front|d_papagos|fort Ioannina; units mtn 2|The Pindus mountains face Albania.|
d_evzones|The Evzones|df|units mtn 2; spirit Evzones: atk .03, def .03|Highlanders in kilts, the best infantry in the Balkans.|
d_mules|Mules for the Mountains|d_evzones|spirit Mule Trains: supply .06|Where there are no roads, mules.|
d_cav|The Cavalry Division|d_mules|units cav 1|Horsemen for the plain of Thessaly.|
d_mob|The Mobilisation Plan|df|law extensive; mp 120|Every Greek man between 21 and 45.|
d_reserve|Reserve Divisions|d_mob|units inf 4|Reservists from Macedonia and the islands.|req tension 40
d_arms|Buy Arms Abroad|d_mob|equip arms 300, artillery 80|Rifles from Germany, guns from France.|
d_art|The Mountain Artillery|d_arms|tech m_art1; equip artillery 60|Schneider mountain guns that can be carried by mules.|
d_at|Anti-Tank Guns|d_art|tech m_art2; equip artillery 60|We have none against the panzers.|
d_counter|The Winter Counter-Offensive|d_epirus,d_evzones|spirit Winter Offensive [365]: atk .06|Push the Italians back into Albania.|req atwar ITA
d_crete|The Defence of Crete|d_reserve|fort Heraklion; units inf 2|The last ditch of Greece.|req war
d_motor|A Motorised Division|d_cav,d_art|tech m_mot; units mot 1|Trucks for one division at least.|
d_tanks|Light Tanks|d_motor|tech m_tank1; equip tanks 20|Captured Italian tanks.|
d_staff|Doctrine of the Mountains|d_counter,d_rupel|spirit Mountain Warfare School: def .04, atk .02|The Greek army knows how to fight in the hills.|
d_british|British Reinforcements|d_staff|units inf 2; rel ENG 15|W Force lands at Piraeus.|req allyENG
# The Royal Navy and Air Force
nv|The Royal Hellenic Navy||equip ships 8|The armoured cruiser Averof, ten destroyers and six submarines.|ai 3
n_averof|The Averof|nv|equip ships 4; spirit Averof: navy .03|The hero of 1912, still the flagship.|
n_destroyers|British Destroyers|nv|equip ships 8; rel ENG 10|The Vasilefs Georgios class.|
n_subs|Submarines|n_destroyers|equip ships 4; tech m_nav2|The Papanikolis sinks Italian transports.|
n_salamis|The Salamis Base|n_averof|build shipyard 1; fort Athens|The navy's arsenal.|
n_escape|Sail for Alexandria|n_subs|spirit Fleet in Exile: navy .04|If Greece falls, the fleet fights on.|
n_islands|The Island Garrisons|n_salamis|fort Corfu, Heraklion|Every island is a fortress.|
n_mine|Minefields in the Gulfs|n_salamis|spirit Gulf Minefields: navy .03, def .02|The Saronic and Thermaic gulfs.|
n_cruiser|A New Cruiser|n_islands,n_escape|equip ships 10|The Salamis, ordered in Germany before 1914, finally delivered.|
ai|The Royal Air Force||equip aircraft 30|A few dozen PZL fighters and Potez bombers.|ai 2
a_pzl|PZL Fighters|ai|equip aircraft 40; tech m_air1|Polish gull-wing fighters.|
a_bloch|French Bombers|ai|equip aircraft 30; spirit Bomber Squadrons: bombing .05|Bloch and Potez bombers.|
a_aces|Mitralexis's Ram|a_pzl|spirit Greek Aces: air .05|Out of ammunition, a pilot rams an Italian bomber.|
a_hurricanes|Hurricanes|a_aces|tech m_air2; equip aircraft 40|Britain sends fighters.|req allyENG
a_flak|Defend Athens|a_pzl|tech s_civildef; spirit Athens Air Defence: civdef .25|Guns on Lycabettus.|
# Economy
ec|The Greek Economy||money 3|Tobacco, currants, olive oil and the earnings of ships.|ai 3
e_tobacco|Macedonian Tobacco|ec|money 8; trade GER|Kavala's leaf, sold in Germany.|
e_currants|Currants and Olive Oil|ec|build farm 2; money 4|The Peloponnese exports to Britain.|
e_laurion|The Laurium Mines|ec|money 4; build chem 1|Silver, lead and manganese from the ancient mines.|
e_bauxite|Bauxite of Parnassus|e_laurion|money 6; build chem 1|Aluminium ore for Germany or Britain.|
e_power|Hydroelectric Plans|e_laurion|build power 2; tech p_hydro|Dams on the Acheloos.|
e_industry|Athens–Piraeus Industry|e_power|build tools 1, textile 2|Textiles, cement and chemicals.|
e_arms|The Pyrkal Works|e_industry|build arms 2, artyf 1|Greek Powder and Cartridge Company.|
e_aircraft|The State Aircraft Factory|e_arms|build aircraftp 1|Licence-built French planes.|
e_drachma|Defend the Drachma|ec|money 6; spirit Gold Drachma: tax .04|The Bank of Greece holds gold.|
e_debts|The Foreign Debt|e_drachma|stab 2 ?? Repay the bondholders => money -8; rel ENG 15; spirit Good Credit: invest .2 // Default again => money 10; rel ENG -15|Greece has defaulted three times.|
e_drain|Drain the Plains|e_currants|build farm 3; tech p_tractors|The Strymon and Axios marshes become farmland.|
e_rail|The Salonika Railway|ec|infra 2; build railway 1|Athens to Salonika in a day.|
e_roads|Roads to Epirus|e_rail|infra 2; build construction 1|The army needs roads to the Albanian border.|
e_tourism|Tourists at Delphi|e_rail|money 4; infl 10|The ancient sites draw visitors.|
e_plan|The Varvaresos Plan|e_aircraft,e_drain|spirit Greek Development Plan: build .05, output .03|A plan for industry and irrigation.|
e_war|War Economy|e_plan|law war_econ; spirit Greek War Production: mil_out .1|Everything for the Albanian front.|req war
e_famine|Prepare for Famine|e_drain|spirit Grain Stores: supply .04, stab 2|Greece imports a third of its bread.|
# The Resistance
rs|If Greece Falls||ws 3|The mountains have hidden Greek fighters for four hundred years.|ai 2
r_cairo|The Government in Cairo|rs|legit 4|The King and the cabinet escape to Egypt.|req enemyOnSoil
r_elas|ELAS|r_cairo|resist GRE 15; ideo com 6|The People's Liberation Army of EAM.|req enemyOnSoil
r_edes|EDES|r_cairo|resist GRE 15; ideo dem 4|Napoleon Zervas's republicans in Epirus.|req enemyOnSoil
r_gorgo|Gorgopotamos|r_elas,r_edes|resist GRE 15; rel ENG 15|ELAS and EDES blow a viaduct together with British commandos.|req enemyOnSoil
r_famine|The Great Famine|r_cairo|stab -6; resist GRE 10|Athens starves in the first winter of the occupation.|req enemyOnSoil
r_choose|Who Rules After?|r_gorgo|resist GRE 10 ?? Back EDES and the King => ideo dem 6; bop -6 // Accept EAM's mountain government => ideo com 10|The Political Committee of National Liberation sits in the mountains.|req enemyOnSoil
r_sacred|The Sacred Band|r_cairo|units inf 1; xp|Officers who fight as privates in North Africa.|
r_navy|The Navy in Exile|r_sacred|equip ships 6|Ships from Alexandria.|
r_lebanon|The Lebanon Conference|r_choose|stab 4; legit 4|Every party signs a charter in a hotel in Lebanon.|
r_liberation|The Liberation of Athens|r_lebanon|ws 10; stab 6|The flag returns to the Acropolis.|req hold Athens
r_dekemvriana|The December Events|r_liberation|stab -6 ?? Disarm ELAS => resist GRE -20; ideo dem 6 // Share power with EAM => ideo com 10; stab 2|Shooting in Syntagma Square.|
# Society
so|The Hellenic Nation||stab 2|A nation that was half refugees fifteen years ago.|ai 2
s_church|The Church of Greece|so|ig devout 6; stab 2|Archbishop Damaskinos will be a regent one day.|
s_refugees|The Refugees of 1922|so|stab 2; ig rural 4|The new quarters of Athens: Nea Smyrni, Nea Ionia, Kallithea.|
s_schools|Demotic or Katharevousa|so|stab 1 ?? Teach the spoken language => legit 2; spirit Demotic Schools: literacy .2 // The purified language => ig devout 4; legit 2|Even the language is a political question.|
s_university|The University of Athens|s_schools|build university 1; res 15|Professors who read Plato in the original.|
s_health|Fight Malaria|s_schools|tech s_medicine; spirit Malaria Campaign: growth .15|The marshes of Macedonia kill thousands every summer.|
s_cavafy|Cavafy and Seferis|s_university|infl 20|A poet in Alexandria and a diplomat poet.|
s_olympics|The Olympic Flame|so|infl 15; ws 2|The flame for Berlin is lit at Olympia.|
s_women|Women's Vote|s_refugees|law suffrage; legit 3|Women vote in local elections since 1930.|
s_jews|The Jews of Salonika|s_church|stab 1 ?? Protect them => legit 4; rel USA 10 // Look away => rel GER 10; legit -4|Fifty thousand Sephardic Jews have lived in Salonika for four centuries.|
s_hellenism|Hellenism Abroad|s_cavafy|infl 20; money 4|Greek communities from Alexandria to Chicago send money home.|
s_nation|One Greece|s_hellenism,s_olympics,s_health,s_women|stab 6; spirit Hellenic Unity: stab 3, ws 3, legit 3|The Schism heals.|
# Diplomacy
dp|Greece and the Powers||infl 20|A small country between the British fleet and the Italian Dodecanese.|ai 4
dp_balkan|The Balkan Pact|dp|ent balkan 15; rel TUR 15, YUG 15, ROM 15|Athens, Ankara, Belgrade and Bucharest guarantee one another.|
dp_ankara|The Ankara Friendship|dp_balkan|rel TUR 25; nap TUR|The 1930 treaty that ended a century of war.|
dp_guarantee|The British Guarantee|dp|rel ENG 20; infl 10|Chamberlain guarantees Greece after Italy takes Albania.|req tension 40
dp_italy|Appease Rome|dp|rel ITA 20; stab 2|Ciano is assured that Greece is no one's base.|mx dp_defy
dp_defy|Defy Rome|dp|rel ITA -20; ws 6|The torpedoing of the Elli will not be forgiven.|mx dp_italy
dp_germany|The German Clearing|dp|trade GER; money 6|Germany buys Greek tobacco.|
dp_neutral|Neutral as Long as Possible|dp_germany,dp_italy|dp_germany,dp_defy|spirit armed_neutrality; infl 20|Greece will not be dragged into a great-power war.|
dp_salonika|The Yugoslav Free Zone|dp_balkan|rel YUG 20; money 3|A free port zone at Salonika for Belgrade.|
dp_bulgaria|Watch Bulgaria|dp_balkan|fort Kavala; rel BUL -5|Sofia wants Thrace.|
dp_us|The American Greeks|dp|rel USA 25; money 4|Half a million Greek Americans.|
dp_alliance|The Mediterranean Alliance|dp_guarantee,dp_ankara|rel ENG 15, TUR 15; spirit Mediterranean Front: def .03, infl .1|London and Ankara stand with Athens.|
# The Albanian Front
al|The Albanian Frontier||ws 2|After April 1939, Italian divisions stand on the Kalamas.|ai 2
al_kalamas|Hold the Kalamas|al|fort Ioannina; units inf 2|The first line, on the river.|req tension 45
al_pindus|The Pindus Detachment|al_kalamas|units mtn 1; spirit Pindus Detachment: def .04|Colonel Davakis holds the mountains against the Julia Division.|
al_women|The Women of Epirus|al_pindus|ws 6; spirit Women of the Pindus: supply .04|Village women carry shells up the mountains.|req atwar ITA
al_korce|Take Korçë|al_women|claim Vlorë; ws 6|The Greek army enters Albania.|req atwar ITA
al_klisura|The Klisura Pass|al_korce|xp; spirit Klisura: atk .04|The mountain pass is stormed in the snow.|req atwar ITA
al_frostbite|The Winter of Frostbite|al_klisura|stab -2 ?? Rotate the divisions => mp -40; stab 2 // Hold every metre => ws 4; spirit Frozen Front: org -.03|Thousands lose their feet to the cold.|req atwar ITA
al_spring|Break the Spring Offensive|al_frostbite|spirit Spring Defence [365]: def .06|Mussolini watches his offensive fail from a hillside.|req atwar ITA
al_valona|The Road to Valona|al_spring|ws 8; claim Vlorë|One more push to the sea.|req atwar ITA
al_admin|Administer Northern Epirus|al_valona|core Vlorë; stab 2|Greek prefects in Argyrokastro.|req hold Vlorë
al_victory|The First Victory over the Axis|al_admin|ws 10; stab 6; spirit Victors of Albania: ws 6, org .03|The world learns that the Axis can be beaten.|
# Crete
cr|The Great Island||stab 1|Crete was Venizelos's home and the last refuge of every Greek government.|ai 2
cr_venizelist|The Venizelist Island|cr|bop 6; mp 20|The 1938 Chania revolt against Metaxas.|
cr_airfields|The Cretan Airfields|cr|build construction 1; spirit Maleme Airfield: air .02|Maleme, Rethymno and Heraklion.|
cr_suda|Suda Bay|cr_airfields|build port 1; fort Heraklion|A harbour for the Royal Navy.|
cr_division|The 5th Cretan Division|cr_venizelist|units inf 1; ws 2|The island's own division fights in Albania.|
cr_villagers|The Cretan Villagers|cr_division|resist GRE 8; spirit Cretan Resistance: def .03|Old men with rifles from the Ottoman wars.|req war
cr_hold|Hold Crete|cr_suda,cr_villagers|units inf 2; fort Heraklion; spirit Fortress Crete: def .06|The parachutists will die at Maleme.|req war
cr_kreipe|Kidnap a General|cr_hold|resist GRE 10; ws 4|Patrick Leigh Fermor and the Cretan andartes.|req enemyOnSoil
cr_olive|Olive Oil of Crete|cr|money 4; build farm 1|The finest oil in Greece.|
cr_minos|The Palace of Minos|cr_olive|infl 10; money 2|Knossos draws scholars from all the world.|
# Macedonia and the North
mn|Greek Macedonia||stab 1|Won in 1912, settled with refugees in 1923, coveted by Bulgaria ever since.|ai 2
mn_salonika|The Port of Salonika|mn|build port 1; money 4|The second city, and the gateway of the Balkans.|
mn_fair|The Salonika Fair|mn_salonika|money 4; infl 10|Merchants from every Balkan state.|
mn_refugees|Settle the Pontic Greeks|mn|popgrow 1; stab 2|Families from the Black Sea coast in the villages of Kilkis.|
mn_slavs|The Slavophones|mn|stab 1 ?? Hellenise them => stab -2; ws 2 // Leave them in peace => stab 2; rel YUG 10, BUL 5|Thousands in Macedonia speak a Slavic tongue at home.|
mn_tobacco|Tobacco of Drama and Xanthi|mn_refugees|money 6; build farm 1|Oriental leaf for the cigarettes of Europe.|
mn_roads|The Via Egnatia|mn_salonika|infra 2|The Roman road, paved again.|
mn_garrison|The III Army Corps|mn_roads|units inf 2; fort Salonika|Salonika must not fall in a day.|
mn_irrigation|Drain the Lakes|mn_tobacco|build farm 2|Lake Giannitsa becomes wheat fields.|
mn_north|A Loyal North|mn_garrison,mn_irrigation,mn_slavs|stab 5; spirit Loyal Macedonia: stab 2, manpower .03|The north is as Greek as Athens.|
# The Aegean
ag|The Islands||stab 1|Two thousand islands and every one of them a sailors' nursery.|ai 2
ag_chios|Chios and Andros|ag|fleet 6|The islands of the shipowners.|
ag_lesbos|Lesbos and Samos|ag|stab 2; fort Corfu|Islands within sight of Turkey.|
ag_sponge|The Sponge Divers of Kalymnos|ag_chios|money 3|Divers working off the coast of Libya.|
ag_ferries|Island Ferries|ag_chios|infra 1; build port 1|Piraeus to every island in a week.|
ag_coastguard|The Coast Guard|ag_lesbos|spirit Aegean Coast Guard: navy .03|Patrol boats against smugglers.|
ag_sailors|Sailors for the Navy|ag_ferries,ag_coastguard|mp 30; spirit Island Sailors: navy .04|Every island family has a son at sea.|
ag_caiques|The Caique Fleet|ag_sailors|resist GRE 6; spirit Caique Runners: supply .03|Small boats run arms to the resistance.|req war
# Metaxas's State
ms|The Leader's Programme|m_third|pp 20|Metaxas wants a Greece of peasants, soldiers and workers, and no politicians.|
ms_works|Public Works|ms|build construction 1; infra 1|Roads, schools and drainage.|
ms_insurance|Social Insurance|ms_works|law pensions; ig union 4; stab 3|The IKA pension fund.|
ms_army|The Army of the Regime|ms|ig army 6; units inf 2|Metaxas spends on the army what the parties spent on themselves.|
ms_lines|Fortify the North|ms_army|fort Salonika, Kavala|The Metaxas Line, paid for out of the budget.|
ms_purge|Purge the Venizelist Officers|ms_army|bop -10; ig army -4; stab 2|Officers dismissed for disloyalty.|
ms_unity|National Unity|ms_insurance,ms_lines|stab 6; ws 4|Even the regime's enemies volunteer for the army in 1940.|
# Athens
at|The Capital||stab 1|A city that tripled in size in fifteen years.|ai 2
at_water|The Marathon Dam|at|build power 1; spirit Athens Water Supply: growth .1|Water for a million people.|
at_housing|Refugee Housing|at|build urban 1; stab 2|Concrete blocks replace the shanties.|
at_trams|Trams and the Electric Railway|at_water|infra 1|Piraeus to Kifissia.|
at_university|The Polytechnic|at_housing|build university 1; res 10|Engineers for the dams and the yards.|
at_museum|The National Museum|at_university|infl 10; ws 1|The bronze Poseidon of Artemision is put on show.|
at_press|The Athens Press|at_trams|ig intel 4; legit 2|Twenty newspapers, each a party.|
at_bombing|Shelters for Athens|at_trams|tech s_civildef; spirit Athens Shelters: civdef .2|Tunnels under Lycabettus.|
at_capital|The Capital of Hellenism|at_museum,at_press,at_bombing|stab 5; spirit Athens Rising: research .02, stab 2|Athens is a European capital again.|
# The Officer Corps
oc|The Officer Corps||ig army 2|The Greek army has made six coups since 1909.|ai 2
oc_league|The Military League|oc|stab -2 ?? Disband the secret leagues => stab 4; ig army -4 // Use them => pp 30; ig army 4|Officers who swore oaths to each other, not to the state.|
oc_reinstate|Reinstate the Cashiered|oc_league|bop 6; xp|Fifteen hundred Venizelist officers want their commissions back.|
oc_school|The Evelpidon Academy|oc|xp; generals Georgios Tsolakoglou/2/def, Konstantinos Bakopoulos/2/def|The cadet school in Athens.|
oc_staff|The General Staff College|oc_school|spirit Staff College: org .03|French methods, Greek improvisation.|
oc_loyal|An Apolitical Army|oc_reinstate,oc_staff|stab 5; spirit Apolitical Army: stab 2, org .02|The army serves the nation, not a party.|
oc_katsimitros|General Katsimitros|oc_staff|generals Charalambos Katsimitros/3/def|The commander of the 8th Division in Epirus.|
oc_tsolakoglou|Forbid Separate Surrender|oc_loyal|ws 6; spirit No Separate Surrender: def .03|No general will sign an armistice behind the government's back.|
`);

// Turkey (2.1): hand-written. The Republic of the Six Arrows, the Straits that every power needs, and a neutrality that pays as long as it can be sold.
'use strict';
TREES.TUR = autoTree('tr_', `
# The Republic
ataturk|The Father of the Turks||pp 40; stab 2|Mustafa Kemal is fifty-five, ill, and still remaking his country by decree.|ai 6
r_arrows|The Six Arrows|ataturk|pp 30; legit 4 ?? Write them into the constitution => legit 6; stab 2 // Keep them as party doctrine => pp 30|Republicanism, nationalism, populism, statism, secularism, revolutionism.|ai 6
## the national chief
inonu|The National Chief|r_arrows|law oneparty; pp 40|İsmet Pasha, the victor of İnönü and Lausanne, is the obvious heir.|mx bayar,turan,caliph,tkp; ai 6
i_heir|İnönü Succeeds|inonu|leader İsmet İnönü/Republican People's Party; stab 3|Atatürk dies in November 1938; the Assembly elects his oldest comrade.|req year 1938
i_milli|Milli Şef|i_heir|pp 40; spirit The National Chief: pp .08, stab 3|The cult of the leader passes to the second man.|
i_etatism|Etatism|inonu|law interventionism; build tools 1, textile 1; spirit State Enterprises: output .04|The state builds what private capital will not.|
i_neutral|Active Neutrality|i_milli|spirit armed_neutrality; infl 30|Turkey will not repeat the mistake of 1914.|
i_sell|Sell Neutrality Dearly|i_neutral|lev allies 10, axis 10; money 6|Each side pays to keep us out of the other's camp.|
i_wealth|The Wealth Tax|i_etatism|money 15; stab -4 ?? Tax everyone equally => stab 2; money -5 // Tax the minorities harder => money 8; rel USA -10; legit -6|The Varlık Vergisi of 1942.|req year 1942
i_villages|The Village Institutes|i_etatism|spirit Village Institutes: literacy .3, farm_out .03|Peasant children trained as teachers.|
i_land|The Land Law|i_villages|ig rural 8, land -6; stab 2|Land for the landless of Anatolia.|
i_tripartite|The Tripartite Treaty|i_sell|lev allies 15; rel ENG 25, FRA 25|Britain and France pay in gold and guns.|mx i_german
i_german|The German Friendship Treaty|i_sell|lev axis 15; rel GER 25|Signed four days before the invasion of the Soviet Union.|mx i_tripartite
i_adana|The Adana Conference|i_tripartite|rel ENG 15; equip aircraft 60, tanks 30|Churchill flies to Turkey to ask for war.|req year 1943
i_waiting|Wait and Watch|i_sell|stab 3; ws -2; spirit Watchful Neutrality: stab 2, infl .05|Turkey's army is mobilised, and stays home.|
i_join|Join the Winning Side|i_adana,i_waiting|i_german,i_waiting|stab 2 ?? Declare war on Germany => fn joinAllies; ws 4 // Stay out to the end => stab 4; infl 30|In February 1945 Turkey declares war to join the United Nations.|req year 1944
i_multiparty|Allow a Second Party|i_land|law universal; legit 6; stab -2|İnönü decides the Republic is ready for opposition.|req year 1945
i_republic|The Republic Endures|i_multiparty,i_milli|stab 8; spirit Kemalist Republic: legit 6, stab 3|The heir of Atatürk keeps the country whole.|
## the liberal turn
bayar|Bayar's Liberal Economy|r_arrows|ideo dem 10; bop 10|Celal Bayar, the banker of the revolution, wants private enterprise.|mx inonu,turan,caliph,tkp; ai 0
b_premier|Bayar as Premier|bayar|leader Celal Bayar/Republican People's Party; pp 20|Atatürk prefers the banker to the general for a year.|
b_isbank|The İş Bank|b_premier|money 10; spirit İş Bankası: invest .2|The first national private bank.|
b_private|Private Industry|b_isbank|law laissez; build textile 2, tools 1|Factories owned by Turks, not the state.|
b_foreign|Foreign Investment|b_private|money 8; rel USA 15, ENG 10|American and British capital, carefully.|
b_democrats|The Democrat Party|b_premier|ideo dem 10; stab -3|Bayar, Menderes and Köprülü found an opposition.|
b_election|A Free Election|b_democrats|law universal; legit 8; stab -4|The first contested vote since 1923.|
b_gov|The Democrats Govern|b_election|setIdeo dem; leader Adnan Menderes/Democrat Party; stab 2|The CHP goes into opposition and does not shoot anyone.|
b_ezan|The Call to Prayer in Arabic|b_gov|ig devout 8; stab 3; legit -2|The ezan returns to the old language.|
b_farmers|Tractors for the Farmers|b_gov|tech p_tractors; build farm 3; ig rural 8|American tractors on Anatolian fields.|
b_west|The Western Alliance|b_gov|rel USA 30, ENG 20; lev allies 20|Turkey belongs with the West.|
b_allies|Join the Allies|b_west|fn joinAllies|Democratic Turkey joins the democracies.|req tension 60
b_boom|The Democrat Boom|b_farmers,b_foreign|money 12; spirit Democrat Boom: output .05, tradecap .05|Roads, tractors and loans.|
## turan
turan|The Turanist Movement|r_arrows|ideo fas 12; bop 15; rad .04|Nihal Atsız dreams of the Turks of the Caucasus, Crimea and Central Asia.|mx inonu,bayar,caliph,tkp; ai 0
t_atsiz|Atsız's Circle|turan|ideo fas 8; ig intel 4|Racial nationalists in the universities.|
t_cakmak|Marshal Çakmak|turan|ig army 8; generals Fevzi Çakmak/4/def|The Chief of Staff is sympathetic to the cause.|
t_seize|The Marshal Takes Power|t_atsiz,t_cakmak|setIdeo fas; leader Fevzi Çakmak/Turanist Front; stab -6|The army installs a nationalist government.|
t_germany|The German Connection|t_seize|rel GER 30; lev axis 20; trade GER|Von Papen is a frequent guest in Ankara.|
t_caucasus|The Caucasus|t_germany|claim Baku, Tiflis, Yerevan; ws 6|The Azerbaijani Turks await liberation.|
t_crimea|The Crimean Tatars|t_caucasus|claim Sevastopol|Our kin on the Black Sea.|req gerSovWar
t_central|Turkestan|t_caucasus|claim Tashkent, Alma-Ata|Samarkand and Bukhara, the old heart of the Turks.|req atwar SOV
t_axis|Join the Axis|t_germany|fn joinAxis|Turkey enters the war against Moscow.|req gerSovWar
t_legions|The Turkic Legions|t_axis|units inf 4; spirit Turkic Legions: manpower .04|Soviet Turkic prisoners volunteer.|req atwar SOV
t_mosul|Mosul|t_seize|claim Mosul; rel IRQ -20|Lausanne left Mosul to Britain's Iraq.|
t_greater|Great Turan|t_central,t_crimea,t_legions|stab 6; spirit Great Turan: ws 8, atk .03, stab 3|From the Bosphorus to the Altai.|
## the caliphate
caliph|The Ottoman Restoration|r_arrows|ideo aut 10; bop 15; ig devout 10|The old pashas and the dervish orders have not forgotten the Sultan.|mx inonu,bayar,turan,tkp; ai 0
c_conservatives|The Conservative Opposition|caliph|ig devout 8, land 6|Landlords and sheikhs who hate the reforms.|
c_dervish|The Dervish Orders|c_conservatives|ig devout 8; stab -3|The Nakşibendi are banned but everywhere.|
c_return|Invite the Dynasty Home|c_dervish|setIdeo aut; leader Ömer Faruk Efendi/Ottoman Restoration; legit -8; stab -8|A prince of the House of Osman returns from Nice.|
c_caliph|Restore the Caliphate|c_return|ig devout 12; infl 50; law state_church|The Muslim world has a caliph again.|
c_sharia|Religious Courts|c_caliph|ig devout 8, intel -8; stab 2|The old courts return beside the Swiss civil code.|
c_hejaz|The Holy Cities|c_caliph|rel SAU -20; infl 20|Mecca and Medina were Ottoman until 1918.|
c_arab|The Arab Provinces|c_hejaz|claim Aleppo, Mosul, Damascus|The empire's lost lands.|req war
c_empire|The Sublime State|c_arab,c_sharia|rename Ottoman Empire/Ottoman; stab 4; spirit The Sublime State: legit 6, infl .2|The empire is proclaimed in Topkapı.|
## the left
tkp|The Underground Left|r_arrows|ideo com 12; bop 20; rad .04|The Communist Party is banned; Nazım Hikmet is in Bursa prison.|mx inonu,bayar,turan,caliph; ai 0
k_hikmet|Free Nazım Hikmet|tkp|ideo com 6; infl 20; legit 4|The greatest poet of the Republic sings of the peasants.|
k_unions|The Unions of Zonguldak|tkp|ig union 10; rad .03|The miners strike.|
k_kadro|The Kadro Circle|k_hikmet|ideo com 6; res 10|Kemalist intellectuals who read Marx.|
k_front|The People's Front|k_kadro,k_unions|setIdeo com; leader Şefik Hüsnü/Turkish Workers' Party; stab -8|The left takes Ankara.|
k_moscow|Friendship with Moscow|k_front|rel SOV 40; nap SOV; lev sov 20|Lenin sent gold to Atatürk in 1921.|
k_plan|The Five-Year Plan|k_front|law command; build steel 2, tools 2|Kemalist etatism, finished.|
k_land|Land to the Peasants|k_plan|ig land -12 -.5, rural 10; spirit land_reform|The aghas of the east lose their villages.|
k_straits|The Straits Open to the Red Fleet|k_moscow|straits SOV open; rel SOV 20|Moscow's warships pass freely.|
k_comintern|Join the Comintern|k_straits|fn joinComintern|Turkey joins the socialist camp.|
k_republic|The Turkish People's Republic|k_land,k_comintern|rename Turkish People's Republic/Turkish; stab 8|The Republic becomes a workers' state.|
# The Straits
st|The Straits Question||infl 20|Lausanne demilitarised the Bosphorus and the Dardanelles. Turkey wants them back.|ai 5
s_montreux|The Montreux Convention|st|fort Istanbul, Edirne; infl 30; spirit Montreux Convention: def .03|July 1936: Turkey may fortify the Straits again.|
s_forts|Fortify the Dardanelles|s_montreux|fort Istanbul, Bursa; spirit Dardanelles Forts: def .04, navy .03|The guns that stopped the Royal Navy in 1915.|
s_mines|Minefields in the Narrows|s_forts|spirit Narrows Minefields: navy .04|Every ship passes on our sufferance.|
s_regime|The Regime of the Straits|s_montreux|stab 1 ?? Neutral warships only in peace => straits GER limited; straits ITA limited; straits SOV limited; straits ENG limited // Close them to every warship => straits GER closed; straits ITA closed; straits SOV closed; straits ENG closed|Who may pass the Bosphorus in wartime?|
s_soviet|The Soviet Demand|s_regime|stab -2 ?? Refuse bases => rel SOV -20; lev allies 10 // Joint defence => straits SOV open; rel SOV 20; rel ENG -20|Molotov wants bases on the Bosphorus.|req year 1939
s_british|Open to the Royal Navy|s_regime|straits ENG open; rel ENG 15; lev allies 10|British warships may pass to the Black Sea.|mx s_axis
s_axis|Open to the Axis|s_regime|straits GER open; straits ITA open; rel GER 15; lev axis 10|German and Italian ships to the Black Sea.|mx s_british
s_tolls|Transit Fees|s_montreux|money 6; spirit Straits Tolls: tax .03|Every merchant ship pays.|
s_fleet|A Fleet to Guard the Straits|s_mines|equip ships 6; build shipyard 1|Destroyers and submarines for the Sea of Marmara.|
s_master|Masters of the Straits|s_fleet,s_tolls|infl 40; spirit Masters of the Straits: infl .15, def .03|Nothing passes between two seas without our leave.|
# Neutrality
ne|The Neutral Republic||infl 20|Turkey is courted by everyone because it can say no to everyone.|ai 4
n_balkan|The Balkan Entente|ne|ent balkan 15; rel GRE 15, ROM 15, YUG 15|Ankara anchors the Balkan Pact.|
n_saadabad|The Saadabad Pact|ne|rel PER 25, IRQ 25, AFG 20; infl 20|A pact of the Middle East: Turkey, Iran, Iraq and Afghanistan.|
n_greece|Friendship with Greece|n_balkan|rel GRE 30; nap GRE|Venizelos nominated Atatürk for the Nobel Peace Prize.|
n_soviet|The Soviet Treaty|ne|rel SOV 20; nap SOV|The 1925 friendship treaty, renewed.|
n_chromite|The Chromite Card|ne|lev allies 5, axis 5; money 6|Every tank needs chromium, and Turkey has it.|
n_sell_axis|Chromite for Germany|n_chromite|lev axis 15; money 8; equip artillery 100|Krupp guns in exchange for ore.|
n_sell_allies|Preemptive Purchase|n_chromite|lev allies 15; money 10|Britain buys the chromite so that Germany cannot.|
n_credits|British Credits|n_balkan|lev allies 10; money 8|A loan of sixteen million pounds.|
n_papen|Von Papen's Embassy|n_soviet|lev axis 10; rel GER 15|The former Chancellor is sent to Ankara.|
n_balance|The Balance of Leverage|n_sell_axis,n_sell_allies,n_credits,n_papen|infl 50; spirit Masters of Balance: infl .2, stab 2|No one power owns Turkey's debts.|
n_cicero|The Cicero Affair|n_balance|fn intelBoost|The British ambassador's valet sells secrets to the Germans.|req war
n_refuse|Refuse Them All|n_balance|stab 4; ws -2; lev allies -15, axis -15, sov -15|Turkey does not have to pay its debts in blood.|
# The Hatay Question
hy|The Sanjak of Alexandretta||ws 2|A Turkish province left in French Syria.|ai 4
h_league|Take It to the League|hy|infl 20; rel FRA -5|The League sends observers to Antioch.|
h_assembly|The Hatay Assembly|h_league|claim Alexandretta; infl 20|An autonomous Hatay State with a Turkish majority.|
h_france|A Deal with Paris|h_assembly|rel FRA 20 ?? Hatay for a treaty of friendship => demand FRA take Alexandretta // March in => war FRA|France needs Turkey more than it needs a sanjak.|req tension 30
h_annex|Hatay Joins the Republic|h_france|core Alexandretta; stab 4|The 1939 referendum.|req own Alexandretta
h_aleppo|Aleppo|h_annex|claim Aleppo|The National Pact included Aleppo.|req war
h_mosul|The Mosul Question|hy|claim Mosul|Settled by the League in 1926, not by us.|req war
# The Eastern Provinces
ea|The East||stab 1|Kurdish mountains, Armenian ruins, and a border with the Soviet Union.|ai 3
e_dersim|The Dersim Question|ea|stab -2 ?? Military operation => stab 4; rad -.05; legit -6 // Roads and schools instead => stab 2; build construction 1|The tribes of Dersim refuse conscription and taxes.|
e_inspectorate|The General Inspectorate|e_dersim|spirit Eastern Inspectorate: stab 2, tax .03|Military governors in the east.|
e_rail|The Railway to Erzurum|ea|infra 3; build railway 2|The line reaches Erzurum in 1939.|
e_roads|Mountain Roads|e_rail|infra 2|Roads to Van and Hakkari.|
e_kars|The Kars Fortress|e_rail|fort Erzurum; units inf 2|The Soviet border is a day's march.|
e_kurds|The Kurdish Language|e_inspectorate|stab 2 ?? Tolerate it => stab 3; legit 2 // Forbid it => ws 2; stab -2|The Republic recognises only Turks.|
e_ararat|Mount Ararat|e_kars|fort Van|The 1930 rebellion began on the mountain.|
e_dams|The Euphrates Dams|e_roads|build power 1; build farm 2|Water for the plains of Harran.|
e_divs|The Third Army|e_kars|units inf 3; spirit Third Army: def .04|Corps at Erzurum and Kars.|
e_settled|A Settled East|e_dams,e_kurds,e_ararat|stab 6; spirit Pacified East: stab 3, manpower .03|The east is quiet.|
# The Statist Economy
ec|Etatism||money 4|The state as entrepreneur: the First Five-Year Industrial Plan.|ai 3
ec_sumer|Sümerbank|ec|build textile 2; money 4|State textile mills in Kayseri and Nazilli.|
ec_eti|Etibank|ec|money 6; spirit Etibank Mining: output .03|The state mining bank.|
ec_karabuk|The Karabük Steelworks|ec_eti|build steel 2; dep Zonguldak iron 1|British-built blast furnaces.|
ec_zonguldak|Zonguldak Coal|ec_eti|build coalm 2; dep Zonguldak coal 2|The Black Sea coalfield.|
ec_chrome|Chromium Mines|ec_eti|money 6; dep Diyarbakır iron 1|Guleman, the richest chromite in the world.|
ec_plan2|The Second Five-Year Plan|ec_karabuk,ec_zonguldak|build tools 2, chem 1; spirit Second Plan: build .06|Heavy industry for the Republic.|
ec_kayseri|The Kayseri Aircraft Factory|ec_plan2|build aircraftp 1; tech m_air1|Licence-built Gothas and PZLs.|
ec_arms|The MKE Arsenal|ec_plan2|build arms 2, artyf 1|The Machine and Chemical Industry Corporation.|
ec_sugar|Sugar Factories|ec_sumer|build farm 2|Beet sugar from Uşak and Alpullu.|
ec_rail|The Railway Programme|ec|infra 2; build railway 2|A railway iron net over Anatolia.|
ec_ports|The Ports of Izmir and Mersin|ec_rail|build port 2|Cotton and tobacco for export.|
ec_tobacco|The Tekel Monopoly|ec_sugar|money 6; spirit Tekel Monopoly: tax .04|Tobacco and raki for the treasury.|
ec_oil|Oil at Raman|ec_chrome|dep Diyarbakır oil 1; build oilr 1|The first Turkish oilfield.|req year 1940
ec_power|Electricity for Anatolia|ec_zonguldak|build power 2; tech p_hydro|Coal stations and river dams.|
ec_cotton|Çukurova Cotton|ec_ports|build farm 2; money 3|The plain of Adana.|
ec_bank|The Central Bank|ec|money 8; spirit Central Bank of the Republic: tax .04|The lira is stable.|
ec_debt|The Ottoman Debt|ec_bank|money -6; rel FRA 10; spirit Debt-Free Republic: invest .15|The last payment to the old bondholders.|
ec_war|National Protection Law|ec_plan2|law war_econ; spirit National Protection: mil_out .08, stab -2|Price controls and requisitions for an army that may fight.|req tension 50
ec_industrial|An Industrial Republic|ec_kayseri,ec_arms,ec_power|spirit Industrial Republic: output .05, research .03|Anatolia makes its own steel, cloth and aircraft.|
# The Army
ar|The Army of the Republic||spirit army_reform; pp 20|The army that won the War of Independence, now armed with its rifles.|ai 3
ar_cakmak|Marshal Çakmak's Staff|ar|generals Fevzi Çakmak/4/def, Kâzım Orbay/3/def; xp|Twenty years as Chief of Staff.|
ar_modern|Modernise the Divisions|ar_cakmak|units inf 4; spirit Modernised Divisions: org .04|Twenty divisions with real artillery.|
ar_mob|The Mobilisation Law|ar|law extensive; mp 150|Two million men under arms in 1941.|
ar_thrace|The Çakmak Line|ar_cakmak|fort Edirne, Istanbul; spirit Thracian Line: def .05|Bunkers between Edirne and the Black Sea.|
ar_anatolia|The Anatolian Redoubt|ar_thrace|fort Ankara, Konya; spirit Anatolian Redoubt: def .04|If Thrace falls, the army fights in the hills.|
ar_cav|The Cavalry Divisions|ar_mob|units cav 3|Horsemen for the steppes of the east.|
ar_mtn|Mountain Troops|ar_mob|tech m_mtn; units mtn 2|The Taurus and the Pontic Alps.|
ar_british|British Equipment|ar_modern|equip arms 300, artillery 100, tanks 30; lev allies 10|Valentines and Bren guns on credit.|mx ar_german
ar_german|German Equipment|ar_modern|equip arms 300, artillery 100; lev axis 10|Krupp guns and Mauser rifles.|mx ar_british
ar_art|The Artillery Programme|ar_british,ar_german|tech m_art1; build artyf 1|Guns for every corps.|
ar_tanks|The Armoured Brigade|ar_art|tech m_tank1; units arm 1|One tank brigade near Istanbul.|
ar_motor|Motorised Divisions|ar_tanks|tech m_mot; units mot 1|Trucks from America.|
ar_reserve|Reserve Corps|ar_mob|units inf 4|Reservists from Anatolia.|req tension 45
ar_doctrine|The Doctrine of the Defence|ar_anatolia,ar_motor|spirit Turkish Defence Doctrine: def .05, org .03|Delay in Thrace, hold in Anatolia.|
ar_staff|The War Academy|ar_cakmak|res 10; spirit War Academy: org .03|Officers trained in Ankara.|
ar_eastarmy|The Eastern Front Army|ar_reserve|units inf 3; fort Erzurum|Facing the Caucasus.|
na|The Navy and Air Force||equip ships 6, aircraft 40|The battlecruiser Yavuz, which was once the German Goeben.|ai 2
n_yavuz|The Yavuz|na|equip ships 6; spirit Yavuz: navy .04|The last dreadnought-era ship in the Black Sea.|
n_golcuk|The Gölcük Shipyard|n_yavuz|build shipyard 1|The navy's base in the Gulf of İzmit.|
n_subs|British and German Submarines|n_golcuk|equip ships 6; tech m_nav2|Both sides sell us boats.|
n_destroyers|Destroyers from Britain|n_subs|equip ships 8; rel ENG 10|The Demirhisar class.|
n_black|The Black Sea Squadron|n_destroyers|spirit Black Sea Squadron: navy .04|Watch the Soviet fleet.|
a_vecihi|The Turkish Aeronautical Association|na|spirit THK: air .04|Young Turks learn to fly.|
a_gokcen|Sabiha Gökçen|a_vecihi|ws 3; spirit First Woman Combat Pilot: air .03|Atatürk's adopted daughter flies in the Dersim operation.|
a_fighters|Modern Fighters|a_vecihi|tech m_air2; equip aircraft 60|Hurricanes and Focke-Wulfs.|
a_bombers|The Bomber Regiments|a_fighters|equip aircraft 40; spirit Bomber Regiments: bombing .05|Blenheims for the defence of Thrace.|
a_flak|Defend Istanbul|a_fighters|tech s_civildef; spirit Istanbul Air Defence: civdef .25|Anti-aircraft guns around the old city.|
# The Reforms
rf|The Kemalist Reforms||stab 2|The Republic has changed the alphabet, the calendar, the hat and the law in ten years.|ai 2
rf_alphabet|The New Alphabet|rf|spirit Latin Alphabet: literacy .25|Atatürk teaches the Latin letters in the parks with a blackboard.|
rf_surname|The Surname Law|rf|stab 2; legit 2|Every Turk takes a family name.|
rf_women|Women Vote and Stand|rf|law suffrage; legit 4|Eighteen women deputies in 1935.|
rf_people|The People's Houses|rf_alphabet|spirit Halkevleri: literacy .1, stab 2|Libraries and theatres in every town.|
rf_language|The Language Reform|rf_alphabet|stab 1 ?? Purify Turkish => ws 3; legit 2 // Keep the Ottoman words => stab 2|Arabic and Persian words are replaced.|
rf_history|The Turkish History Thesis|rf_language|ws 4; ig intel 4|The Turks, mother of all civilisations.|
rf_university|Istanbul University|rf_people|build university 1; res 15|German professors who fled Hitler teach in Istanbul.|
rf_ankara|Ankara the Capital|rf_surname|build urban 1; stab 2|A new capital built on a village.|
rf_secular|Laiklik|rf|law separation; ig devout -6; stab -2|Religion in the mosque, not in the state.|
rf_medicine|The Health Ministry|rf_people|tech s_medicine; spirit Public Health: growth .15|Malaria and trachoma in the villages.|
rf_music|The State Conservatory|rf_university|infl 10|Hindemith advises on a Turkish conservatory.|
rf_sport|Sport and Youth|rf_ankara|mp 30; ws 2|Youth Day on 19 May.|
rf_complete|The Revolution Complete|rf_history,rf_music,rf_medicine,rf_sport,rf_secular|stab 6; spirit Kemalist Revolution: stab 3, legit 4, research .03|A modern nation, built in a generation.|
# Atatürk's Last Years
al|The Ghazi's Health||stab 1|Cirrhosis; the doctors say rest; he does not.|ai 3
al_will|Atatürk's Will|al|legit 4; res 10|His shares in the İş Bank go to the Language and History Societies.|
al_successor|Name a Successor|al|stab 2 ?? İnönü => ig army 4; stab 2 // Bayar => money 4; ig pb 4 // Let the Assembly choose => legit 4|Two men expect to follow him.|
al_dolmabahce|The Last Summer at Dolmabahçe|al_will|stab 2; infl 10|He dies at 9:05 on 10 November 1938; the palace clocks are stopped.|req year 1938
al_mourning|A Nation Mourns|al_dolmabahce|ws 6; stab 4; spirit Grief for the Ghazi [365]: stab 4, ws 4|Millions line the railway from Istanbul to Ankara.|
al_mausoleum|Anıtkabir|al_mourning|build construction 1; legit 6|A mausoleum on a hill above Ankara.|
al_cult|The Eternal Leader|al_mausoleum,al_successor|stab 4; spirit Ebedi Şef: legit 5, stab 2|His portrait in every office forever.|
al_hatay|One Last Gift|al_will|claim Alexandretta; ws 4|Atatürk insists on Hatay from his sickbed.|
al_balkan|The Balkan Statesman|al_successor|ent balkan 15; infl 20|Atatürk proposes a Balkan Union.|
al_peace|Peace at Home, Peace in the World|al_balkan,al_hatay|stab 4; infl 30; spirit Yurtta Sulh: stab 3, infl .1|The motto of the Republic's foreign policy.|
# Istanbul and the Marmara
is|The Old Capital||money 3|Istanbul lost its role in 1923 but not its people or its wealth.|ai 2
is_port|The Port of Istanbul|is|build port 2; money 4|Galata's quays and warehouses.|
is_prost|The Prost Plan|is|build urban 1; infra 1|A French planner draws boulevards through the old city.|
is_bridge|The Galata Bridge|is_prost|infra 1|A new pontoon bridge over the Golden Horn.|
is_industry|Industry on the Golden Horn|is_port|build tools 1, textile 1|Workshops and small yards.|
is_university|Professors in Exile|is_prost|res 15; build university 1|Refugee scholars from Germany and Austria.|
is_bazaar|The Grand Bazaar|is_industry|money 4; spirit Istanbul Merchants: tradecap .04|Merchants who trade with every shore.|
is_evac|Plan to Evacuate the City|is_bridge|spirit Istanbul Evacuation Plan: civdef .3|If the Germans come through Thrace.|req tension 50
is_spies|The City of Spies|is_bazaar|fn intelBoost|Every intelligence service has an office in Pera.|req war
is_capital|Queen of Cities|is_spies,is_university,is_evac|is_university,is_bazaar|stab 4; spirit Istanbul Revived: research .02, tradecap .03|Istanbul is the window of the Republic.|
# The Black Sea Coast
bs|The Pontic Coast||stab 1|Samsun, Trabzon and Zonguldak, between the mountains and the sea.|ai 2
bs_samsun|Samsun, Where It Began|bs|ws 2; build port 1|Mustafa Kemal landed here in 1919.|
bs_hazelnut|The Hazelnut Coast|bs|money 4; build farm 1|Giresun and Ordu grow most of the world's hazelnuts.|
bs_tea|Tea from Rize|bs_hazelnut|build farm 1; money 2|Tea plantations, a new idea.|
bs_trabzon|The Trabzon Road|bs_samsun|infra 2; build port 1|The old caravan road to Persia.|
bs_laz|The Laz Sailors|bs_trabzon|mp 20; spirit Black Sea Sailors: navy .02|Boatmen of the eastern coast.|
bs_coast|Coastal Batteries|bs_trabzon|fort Trabzon, Samsun|In case the Soviet fleet comes.|
bs_mines|The Coal Port of Zonguldak|bs_hazelnut|build port 1; build coalm 1|Coal shipped to Istanbul.|
bs_prosper|A Prosperous Coast|bs_tea,bs_laz,bs_coast,bs_mines|stab 4; money 4|The Black Sea is Turkish.|
# The Islands and Cyprus
ci|The Lost Islands||ws 1|The Dodecanese and Cyprus, a few miles from Anatolia.|ai 2
ci_cyprus|The Turks of Cyprus|ci|stab 1 ?? Defend them => rel ENG -5; ws 2 // Leave them to Britain => rel ENG 10|A hundred thousand Turks live on the island.|
ci_claim|Cyprus Is Turkish|ci_cyprus|claim Nicosia, Famagusta; rel ENG -15, GRE -15|Cyprus was Ottoman until 1878.|req war
ci_dodecanese|The Dodecanese|ci|claim Rhodes; rel ITA -15|Italian islands on our coast.|
ci_rhodes|Take Rhodes|ci_dodecanese|core Rhodes; ws 4|The island returns to Anatolia.|req hold Rhodes
ci_islands|Fortify the Coast|ci|fort Izmir, Antalya|Italian bases are twenty kilometres away.|
ci_squadron|The Aegean Squadron|ci_islands|equip ships 4; spirit Aegean Patrol: navy .03|Destroyers based at Izmir.|
ci_greeks|A Settlement with Athens|ci_islands|rel GRE 20; ent balkan 10|The islands are a common problem, not a war.|
# The Middle East
me|The Southern Neighbours||infl 20|Former Ottoman lands under French, British and Arab rule.|ai 3
me_saadabad|Lead the Saadabad Pact|me|infl 30; rel PER 15, IRQ 15, AFG 15|Ankara leads the Muslim states of the Middle East.|
me_iraq|The Iraqi Pipeline|me_saadabad|rel IRQ 20; money 4|Oil from Kirkuk could flow to Iskenderun.|
me_iran|Reza Shah's Visit|me_saadabad|rel PER 25; trade PER|The Shah came to Turkey and went home a moderniser.|
me_syria|Watch Syria|me|fort Adana; units inf 1|The French army of the Levant is on the border.|
me_palestine|The Palestine Question|me_saadabad|stab 1 ?? Stay silent => rel ENG 10 // Speak for the Arabs => infl 20; rel ENG -10|Britain's mandate is in revolt.|
me_kurds|The Kurdish Border|me_syria|stab 2; rel IRQ 10, PER 10|Three states, one people, one shared worry.|
me_aleppo|The Aleppo Railway|me_syria|infra 1; trade FRA|The Baghdad Railway runs through Syria.|
me_mosul|Revive the Mosul Claim|me_iraq|claim Mosul|The National Pact drew the border south of Mosul.|req war
me_bloc|A Turkish Middle East|me_iran,me_kurds,me_palestine|infl 50; spirit Leader of the Middle East: infl .15|Ankara speaks for the region.|
# The Minorities
mi|The Minorities||stab 1|Greeks, Armenians and Jews in Istanbul; Kurds, Laz and Alevis in Anatolia.|ai 2
mi_rum|The Greeks of Istanbul|mi|stab 1 ?? Protect the Patriarchate => rel GRE 15; legit 3 // Restrict the Rum schools => ws 2; rel GRE -15|A hundred thousand Rum who stayed after 1923.|
mi_armenians|The Armenians|mi|stab 1 ?? Leave the past alone => stab 2 // Open the archives => legit 6; stab -4; rel SOV 10|Survivors of 1915 live in Istanbul.|
mi_jews|The Jews of Turkey|mi|stab 1; rel USA 10|Sephardim since 1492; Ashkenazim fleeing Germany now.|
mi_refugees|Professors and Refugees|mi_jews|res 10; rel USA 10|Turkey takes in scientists Germany expels.|
mi_struma|The Struma|mi_refugees|stab 1 ?? Let the passengers land => legit 6; rel USA 15; rel ENG -10 // Tow it back to sea => rel ENG 10; legit -8|A ship of Jewish refugees waits off Istanbul.|req war
mi_alevi|The Alevis|mi|ig devout -4; stab 2|Heterodox Muslims who love the secular Republic.|
mi_laz|The Laz and the Circassians|mi_alevi|mp 20; stab 1|Peoples of the Black Sea and the Caucasus.|
mi_turkish|Citizen, Speak Turkish!|mi_alevi|stab 1 ?? Make it a law => ws 2; stab -2 // A slogan only => stab 2|The student campaign against other languages.|
mi_citizens|Citizens of the Republic|mi_struma,mi_turkish,mi_armenians,mi_rum|mi_turkish,mi_armenians,mi_rum|law civic; stab 4|Every citizen is a Turk by law.|
# The War Years
wy|Mobilised Neutrality||ws 2|In 1941 one Turk in fifteen is in uniform and the army eats the harvest.|ai 3
wy_mob|General Mobilisation|wy|mp 100; units inf 4; stab -3|A million men are called up.|req tension 50
wy_bread|Bread Rationing|wy_mob|stab -3; spirit Rationing: supply .03, stab -1|The cities queue for bread.|req year 1941
wy_black|The Black Market|wy_bread|money 4; stab -2 ?? Crack down => stab 3; money -2 // Tolerate it => money 4; legit -3|Profiteers grow rich.|
wy_harvest|The National Harvest|wy_mob|build farm 2; spirit Harvest Brigades: farm_out .04|Soldiers bring in the wheat.|
wy_aid|Lend-Lease|wy_harvest|lev allies 10; equip arms 200, aircraft 40, tanks 20|American goods via Basra.|req year 1942
wy_bases|Allied Bases?|wy_aid|stab 1 ?? Allow British airfields => lev allies -20; rel ENG 20; rel GER -30 // Refuse => lev allies 5; stab 2|The RAF wants to bomb Ploiești from Anatolia.|req year 1943
wy_demob|Demobilise|wy_black|stab 4; mp 50|The farmers go home.|req notwar GER
wy_un|The United Nations|wy_bases,wy_demob|wy_bases|infl 40; rel USA 20|Turkey signs the charter in San Francisco.|req year 1945
wy_truman|The American Shield|wy_un|rel USA 25; lev sov -20; money 10|Washington promises to stand by Turkey against Moscow.|req year 1945
`);

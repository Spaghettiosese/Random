// Mongolia (1.5): hand-written tree. The Party, the lamas, the princes, and two giant neighbours.
'use strict';
TREES.MON = autoTree('m_', `
# Party and Throne
khural|The Little Khural||pp 50|A parliament of herdsmen, watched by advisers.|ai 5
summons|A Summons to Moscow|khural|rel SOV 10; stab -3; pp 30 ?? Go, and be agreeable => rel SOV 15; bop -8; pp 30 // Plead illness and stay home => rel SOV -10; bop 8; stab 3|The premier is invited to explain himself.|ai 5
## the marshal
choibalsan|The Marshal's Ascent|summons|pp 80; rel SOV 20; bop -20|Moscow has chosen its man.|mx genden,bogd,amar; ai 6
c_interior|The Interior Ministry|choibalsan|law secret_police; fn intelBoost; stab -3|The green-capped service answers to one man.|
c_plot|The Counter-Revolutionary Centre|c_interior|stab -6; rad -.1; pp 60; ig army -6|A conspiracy is discovered, with exactly the right members.|
c_troika|The Extraordinary Commission|c_plot|rad -.1; legit -4; pp 60; bop -10|Three men, a rubber stamp and a list.|
c_monasteries|Close the Monasteries|c_troika|ig devout -10 -.5; mp 80; rad .05; bop -15 ?? Spare the great libraries => res 15; ig devout 3 // Leave nothing standing => money 10; rad .04; ig devout -5|Seven hundred of them, emptied in two years.|
c_treasure|Monastery Treasure|c_monasteries|money 15; build admin 1|Bronze Buddhas become ball bearings in Chelyabinsk.|
c_lamas|Lamas to the Workshops|c_monasteries|mp 100; build tools 1, textile 1; ig devout -5|Eighty thousand monks need new trades.|
c_collectives|Herding Collectives|c_troika|law command; build ranch 2; rad .04|The first attempt ended in revolt.|mx c_gradual
c_gradual|Voluntary Associations|c_troika|build ranch 2; ig rural 4; spirit Herders' Mutual Aid: farm_out .08|Persuasion, with quotas for the persuaders.|mx c_collectives
c_marshal|Marshal of the Republic|c_plot,c_monasteries|leader Khorloogiin Choibalsan/MPRP; legit 8; spirit Soviet Model: build .1, pp .1|Premier, minister of war and commander-in-chief.|
c_congress|The Tenth Congress|c_marshal|pp 80; legit 6; stab 4|A new programme, a new constitution, the same chairman.|
c_const|The 1940 Constitution|c_congress|law council; legit 8; spirit Non-Capitalist Road: build .06, research .03|From feudalism to socialism without the stage in between.|
c_tsedenbal|The Young Economist|c_congress|pp 40; res 15; spirit Irkutsk Graduates: research .05, pp .05|A general secretary at twenty-three.|
c_cult|The Mongolian Stalin|c_const|stab 6; legit 5; spirit Portraits in Every Ger: stab 3, sway .1|His birthplace becomes a city with his name.|
c_plan|The First Five-Year Plan|c_tsedenbal,c_collectives|c_tsedenbal,c_gradual|spirit five_year_plan; build tools 2, power 1|Targets in head of livestock.|
c_sixteenth|The Sixteenth Republic?|c_cult|rel SOV 30; auto -30; stab -4|Should we not simply apply for admission?|mx c_own
c_own|A State of Our Own|c_cult|auto 20; legit 8; rel SOV -5|Tuva's fate is noted. The marshal quietly declines.|mx c_sixteenth
c_final|Socialism on the Steppe|c_plan,c_sixteenth|c_plan,c_own|stab 10; spirit Second Socialist State: output .06, build .06, legit 8|The world's second people's republic is still standing.|
## the defiant premier
genden|The Premier's Defiance|summons|rel SOV -20; stab 5; bop 15; ig devout 5|He broke the General Secretary's pipe, they say.|mx choibalsan,bogd,amar; ai 1
g_rich|Get Rich!|genden|law interventionism; ig rural 6; spirit Private Herds: farm_out .15, rad -.05|A slogan borrowed from a purged Bolshevik.|
g_faith|Socialism and the Faith|genden|ig devout 8; stab 6; spirit Tolerance of the Faith: stab 4, legit 5|The Buddha and Lenin both stood for the poor.|
g_refuse|Refuse the Troops|genden|rel SOV -15; auto 15; bop 10|We did not ask for a garrison.|
g_guard|The Premier's Guard|g_refuse|units cav 2; ig army 6; fn intelBoost|Before the interior ministry can act, it is acted upon.|
g_arrest|Arrest the Marshal's Men|g_guard|stab -5; pp 60; rad -.08; bop 10|The list changes hands.|
g_new|The New Turn Renewed|g_rich,g_faith|ig rural 6, pb 6; build ranch 2, textile 1|The 1932 retreat from collectivisation becomes policy, not pause.|
g_traders|Chinese and Russian Traders|g_new|trade CHI, SOV; money 8; spirit Open Caravan Routes: tradecap .1|The firms expelled in the twenties are invited back.|
g_independent|Truly Independent|g_refuse,g_arrest|fn monIndep; bop 20|A friend of Moscow, not its province.|
g_two|A Treaty with Each Neighbour|g_independent|nap SOV; nap CHI; infl 40|The same text, in two languages.|
g_tokyo|A Channel to Hsinking|g_independent|rel JAP 20, MAN 20; nap JAP|The border commission meets at a railway siding.|
g_assembly|An Elected Great Khural|g_new,g_arrest|law census; legit 10; ig intel 6|Secret ballot, with coloured sheep knucklebones.|
g_lamas|A Concordat with the Lamas|g_faith,g_assembly|ig devout 8 .2; money 6; spirit Taxed Not Closed: tax .08, stab 4|Monasteries pay a levy and keep their doors open.|
g_panmongol|All the Mongols|g_two,g_tokyo|claim Hohhot, Kalgan, Hailar; ws 8|More Mongols live outside the republic than in it.|
g_army|An Army of the Nation|g_guard,g_independent|units cav 3; spirit Officers Without Advisers: org .05, legit 4|The instructors are thanked and sent home.|
g_neutral|The Asian Switzerland|g_two,g_lamas|spirit armed_neutrality; infl 50; stab 5|Too poor to covet, too large to garrison.|
g_final|The Third Way of the Steppe|g_neutral,g_army,g_traders|stab 10; spirit Herdsmen's Republic: farm_out .1, legit 10, pp .08|Neither commissars nor princes.|
## the ninth incarnation
bogd|Find the Ninth Incarnation|summons|ideo aut 12; ig devout 8; stab -4|The search was forbidden in 1924.|mx choibalsan,genden,amar; ai 0
b_search|The Search Party|bogd|ig devout 6; pp 40; rel TIB 20|Lamas ride for Lhasa with a list of signs.|
b_rising|The Monastery Rising|bogd|stab -8; units mil 8; ig devout 8 .3; bop 25|The 1932 rebels were only waiting.|
b_child|The Boy from Lhasa|b_search|legit 10; stab 4; rel TIB 20|A child recognises the right rosary.|
b_khanate|Restore the Khanate|b_child,b_rising|setIdeo aut; law theocracy; leader The Ninth Bogd/Council of Lamas; legit 12|A living Buddha on the throne again.|
b_regent|The Regent Lama|b_khanate|pp 80; stab 4; spirit Regency Council: pp .08, stab 3|A child reigns; an abbot rules.|
b_princes|Banner Princes|b_khanate|ig land 8 .3; units cav 3|The old nobility saddles up.|
b_expel|Expel the Advisers|b_khanate|free -30; rel SOV -30; ws 8|They are given horses and a direction.|
b_tokyo|Friends in the East|b_expel|rel JAP 40; nap JAP; equip arms 300|Tokyo also has uses for a Mongol prince.|mx b_china
b_china|Under the Republic's Wing|b_expel|rel CHI 40; nap CHI; money 10|Autonomy under a distant suzerain was not so bad.|mx b_tokyo
b_tithe|The Monastery Tithe|b_regent|law traditionalism; spirit Estates of the Faith: tax .1, research -.05|A third of the herds belong to the church again.|
b_serfs|Restore the Banners|b_princes|ig land 8, rural -6; spirit Hereditary Banners: manpower .08, rad .04|Every herdsman has a lord once more.|mx b_free
b_free|Free Herdsmen Under the Faith|b_princes|ig rural 8, land -4; spirit No Serfs in the Khanate: farm_out .08, stab 3|The Bogd abolishes what the Party merely renamed.|mx b_serfs
b_dege|Prince De's Offer|b_tokyo|rel MAN 20; claim Hohhot, Kalgan; units cav 2|The Inner Mongolian prince proposes one crown for all.|
b_army|The Army of the Faith|b_princes,b_expel|units cav 4, mil 6; spirit Soldiers of Shambhala: org .06, ws 6|The prophecy says the last war will be won from the north.|
b_tibet|The Lhasa Alliance|b_child,b_regent|rel TIB 40; ally TIB; infl 30|Two Buddhist states recognised each other in 1913 and no one else did.|
b_schools|Monastery Schools|b_tithe|law religious; spirit Tibetan and Mongol Letters: literacy .3, stab 3|The old script, the old curriculum.|
b_greater|The Great Mongol State|b_dege,b_army|b_china,b_army|claim Hohhot, Kalgan, Hailar, Chita; ws 10; fn pressClaims|The name used in 1911.|
b_final|The Khanate Endures|b_greater,b_tibet,b_schools|stab 10; spirit Throne of the Living Buddha: legit 12, stab 6, manpower .08|The revolution was an interruption.|
## the scholar premier
amar|The Scholar Premier|summons|ideo dem 8; ig intel 8; bop 8; stab 3|He wrote the nation's history and would like it to continue.|mx choibalsan,genden,bogd; ai 0
a_history|A Brief History of Mongolia|amar|legit 8; ws 4; spirit National Memory: stab 4, sway .1|A textbook that begins before 1921.|
a_law|Socialist Legality|amar|rad -.08; legit 6; law guard|The interior ministry must show a warrant.|
a_release|Release the Arrested|a_law|stab 5; ig devout 5, intel 6; rel SOV -10|Cells empty faster than Moscow likes.|
a_khural|A Real Khural|a_law|law census; legit 8; pp 50|Deputies who may vote no.|
a_parties|The Herdsmen's Union|a_khural|setIdeo dem; ig rural 8 .2; stab -4|A second party, which is one more than permitted.|
a_balance|The Balance of Neighbours|a_release|nap SOV; nap CHI; rel JAP 10|Friendly with all, bound to none.|
a_recog|Recognition Abroad|a_balance|infl 50; rel USA 20, ENG 15|A vice-president lands on the steppe and is given a horse.|
a_indep|Sovereign in Fact|a_balance,a_parties|fn monIndep; legit 8|The advisers become guests.|
a_coops|Marketing Cooperatives|a_parties|build ranch 2, textile 1; spirit Wool Pools: farm_out .08, tradecap .06|Herders sell together and keep the difference.|
a_faith|Freedom of Conscience|a_release,a_khural|law protected; ig devout 8; stab 4|Neither established nor forbidden.|
a_univ|A National University|a_history,a_coops|build university 1; res 25; spirit Scholars of the Steppe: research .06|Founded with eleven professors.|
a_trade|Trade Through Tianjin|a_recog,a_coops|trade CHI, USA; money 10; spirit Camel Road to the Sea: tradecap .1|Cashmere reaches New York without passing Moscow.|
a_league|Apply to the League|a_recog,a_indep|infl 60; legit 8; rel FRA 10|The application is at least received.|
a_final|The Republic of Letters|a_univ,a_league,a_faith|stab 10; spirit Constitutional Steppe: legit 10, research .05, pp .08|A small democracy between two empires.|
# Foreign Policy
between|Between Bear and Dragon||infl 30|Two neighbours, and neither thinks we exist.|ai 2
## the northern neighbour
protocol|Mutual Assistance Protocol|between|rel SOV 30; units inf 2; fort Ulan Bator|A Soviet corps moves in, by invitation.|ai 5
f_corps|The Fifty-Seventh Corps|protocol|units mot 1, inf 2; spirit Garrison of Friends: def .08, legit -3|Tanks parked beside the monasteries.|
tuva|Brothers in Tuva|between|infl 20; rel SOV 10; mp 30|The only other state that recognises us.|
f_tuvafate|Tuva's Example|tuva|rel SOV -5; auto 10; pp 40|They applied for annexation and got it. We take notes.|date 1944-10
khalkha|Battle on the Khalkha|protocol|clash JAP; rel JAP -20; spirit Victory at the Khalkha: def .08, ws 8|A river nobody had heard of.|date 1939-5
f_zhukov|The Corps Commander|khalkha|generals Georgy Zhukov/5/panzer; axp 30|An unknown general wins his first battle here.|req lord SOV
f_border|The Border Commission|khalkha|nap JAP; rel MAN 10; stab 3|Eighteen months to draw one line on a map.|
f_gifts|Gifts to the Front|f_corps|rel SOV 30; money -6; spirit Revolutionary Mongolia Tank Column: legit 5, ws 5|A tank brigade, a fighter squadron and half a million horses.|req gerSovWar
f_horses|Horses for the Red Army|f_gifts|trade SOV; money 10; rel SOV 15|One horse in five on the eastern front is Mongolian.|req gerSovWar
ride|Ride with the Red Army|f_border,f_horses|fn monJoinSovWar; units cav 3|Across the Gobi and the Khingan range.|req sovJapWar
f_khingan|Across the Khingan|ride|spirit Gobi Crossing [240]: atk .1, supply .1; axp 30|Three hundred kilometres of desert in a week.|req atwar JAP
## the southern neighbours
inner|The Inner Mongolian Question|between|claim Hohhot, Kalgan, Hailar; rel CHI -20|South of the Gobi the banners await.|
f_agents|Agents Among the Banners|inner|fn intelBoost; infl 20; rel MAN -10|Caravan masters carry more than tea.|
greater|Greater Mongolia|inner|ws 8; fn pressClaims|One state for one people.|req sovereign
f_barga|The Barga Mongols|f_agents|claim Hailar, Qiqihar; units cav 1|The pastures east of the lake are ours by kinship.|
f_union|Union Petition|f_khingan,f_barga|core Hohhot, Kalgan, Hailar; infl 30|Delegates from the south arrive asking to join.|
f_yalta|The Status Quo Clause|ride|rel SOV 15; legit 6|Three great powers agree we shall remain as we are.|
plebiscite|Independence Plebiscite|f_yalta|legit 10; fn monAutonomy; rel CHI 10|One hundred per cent in favour, exactly.|
f_china|China Recognises|plebiscite|nap CHI; rel CHI 30; infl 30|Three centuries of suzerainty end in a telegram.|
## the wider world
guards|Border Guards|between|fort Ulan Bator; units cav 2|Five thousand kilometres of frontier.|
recognition|Seek Recognition|tuva|rel USA 15, ENG 15, CHI 10; infl 40|A vice-president visits by aeroplane.|
f_legation|Legations Abroad|recognition|infl 40; pp 30|Our second embassy, after Moscow.|
f_stamps|Stamps and Passports|recognition|money 4; infl 20; legit 4|Collectors notice us before governments do.|
f_scholars|The Mongolists|f_legation|res 15; infl 20; rel ENG 5, FRA 5|Foreign scholars are finally let in.|
seat|A Seat Among Nations|plebiscite,f_legation|infl 60; legit 8|The veto delays it; it comes anyway.|
f_bloc|A Fraternal Bloc|seat,f_china|fn joinComintern; trade SOV|A member of something, at last.|mx f_non
f_non|Friend to All Neighbours|seat,f_china|spirit Good Neighbour of Two Giants: infl .2, tradecap .08, stab 4|We will not be anyone's corridor.|mx f_bloc
# Economy
herds|Twenty-Five Million Head||build ranch 3 ?? Herders keep what they breed => ig rural 6; spirit Herders' Incentive: farm_out .06 // The state sets delivery targets => money 8; ig rural -4; spirit Delivery Targets: tax .06|Thirty animals for every person.|ai 3
vets|Veterinary Service|herds|spirit Healthy Herds: farm_out .15|Inoculation against the cattle plague.|
wool|Wool for the Red Army|herds|build textile 2; trade SOV; money 5|Greatcoats, felt boots and half a million horses.|
coal|The First Mine|herds|build coalm 2; fn monCoal|Heat for the capital's first power station.|
e_wells|Wells in the Gobi|herds|build ranch 2; spirit Deep Wells: farm_out .08, growth .1|A motor pump where there was a leather bucket.|
e_five|The Five Snouts|herds|ig rural 5; spirit Balanced Herds: farm_out .06, stab 2|Horse, camel, cattle, sheep and goat, in proportion.|
hay|Haymaking Stations|vets|build farm 2; spirit Winter Fodder: growth .3, farm_out .05|A defence against the white death of the steppe.|
e_shelters|Winter Shelters|vets,e_wells|build ranch 1; spirit Stone Corrals: farm_out .06|Half the losses in a bad winter are from wind.|
e_breeds|Breeding Stations|vets|tech p_fert; spirit Fine-Wool Sheep: farm_out .08, tradecap .04|Rams from the Caucasus.|
combine|The Industrial Combine|wool,coal|build tools 1, power 1, furniture 1|Tannery, boot factory and wool-washing plant on one site.|
e_felt|Felt and Boots|wool|build textile 2; equip arms 100|Every ger and every soldier needs felt.|
e_cashmere|Cashmere|wool,e_five|build textile 1; money 8; spirit Goat Down: tradecap .08|The Gobi's one luxury.|
e_meat|The Meat Combine|combine|build ranch 2, chem 1; trade SOV|Tinned mutton for two armies.|
railway|Railway to the Border|coal|infra 3|The first tracks in the country.|
e_narrow|The Coal Line|coal|infra 1; build railway 1; build coalm 1|Forty kilometres of narrow gauge to the capital.|
e_trucks|The State Transport Company|railway|tech m_mot; infra 2; spirit Lorries on the Caravan Road: supply .1|Camels still carry the fuel for the lorries.|
e_bank|The Mongol Bank|wool|tech s_bank; money 8; spirit The Tugrik: tax .08|A currency of our own replaces Chinese silver and brick tea.|
e_coops|Consumer Cooperatives|e_bank|build furniture 1; spirit Montsenkoop: tax .05, needs -.03|One shop per district, with the same nine goods.|
e_gold|Gold in the North|coal|money 12; build ironm 1|Washed from the same rivers since the Tsar's concession.|
e_fluor|Fluorspar and Tungsten|e_gold|trade SOV; money 6; spirit Strategic Ores of the East: tradecap .06|A geologist's hammer finds what armour plate needs.|
e_oil|Oil at the Red Spring|e_gold,e_trucks|dep Ulan Bator oil 1; build oilr 1|A small field in the east Gobi.|
e_power|The Capital Power Station|combine,e_narrow|build power 2; tech p_electrification|Electric light in a city of felt.|
city|Build the Capital|combine,railway|build urban 2, admin 1, university 1; vp Ulan Bator 3|Felt tents give way to brick.|
e_brick|Brickworks and Sawmills|city|build construction 1, logging 1|The northern forests float down to the capital.|
e_farms|State Farms|hay,e_wells|build farm 3; tech p_tractors; spirit Ploughing the Steppe: farm_out .1|Wheat where no one had ever ploughed.|
e_print|The State Printing House|city|tech s_radio; spirit Newspapers by Horse Relay: literacy .2, sway .1|The paper is called 'Truth', naturally.|
e_tele|Telegraph to Every Province|e_trucks,e_print|infra 1; spirit Wire Across the Steppe: pp .05, supply .05|Eighteen provincial capitals on one line.|
e_plan|The Livestock Plan|e_farms,e_breeds,e_shelters|spirit Two Hundred Million Head: farm_out .12; popgrow 2|An arithmetic of sheep.|
e_trans|The Trans-Mongolian Line|e_tele,e_oil,e_power|infra 4; build railway 2; spirit Shortest Route to Peking: tradecap .12|From the Soviet border to the Chinese, through the capital.|req year 1945
e_copper|The Copper Mountain|e_fluor,e_trans|dep Ulan Bator iron 2; build ironm 2|Herders always said the hill attracted lightning.|
e_final|From Herding to Industry|e_plan,e_trans,e_brick|spirit Agrarian-Industrial Nation: output .08, build .06|A working class of a few thousand, to begin with.|
# The Army
pra|People's Revolutionary Army||spirit army_reform; units cav 2|Eight cavalry divisions and an armoured brigade.|ai 2
saddle|A Nation on Horseback|pra|units cav 4; spirit Born in the Saddle: org .06, supply .1|Every herdsman is a trooper.|
equipment|Soviet Equipment|pra|equip arms 300, artillery 60; tech m_art1|Rifles, guns and instructors.|
armoured|Armoured Car Brigade|pra|tech m_mot, m_tank1; units mot 1|Wheels suit the steppe better than tracks.|
r_service|Universal Service|pra|law extensive; mp 60|Three years, from eighteen.|
officers|Officers' School|saddle|generals Jamyangiin Lhagvasuren/3/cav; fn xpAll|Cadets trained in the Soviet academies.|
steppe|Steppe Defence|equipment,saddle|spirit Deep Steppe: def .08, caplimit .15|There is always further to retreat.|
squadron|Air Squadron|armoured|equip aircraft 60; tech m_air1|Biplanes that also carry the mail.|
r_remount|Remount Depots|saddle|spirit Three Horses a Man: supply .1, org .03|A trooper changes horses, not pace.|
r_archers|From Bow to Carbine|saddle,r_service|equip arms 200; spirit Mounted Marksmen: atk .04|The naadam archery field gets a rifle range.|
r_camel|Camel Transport Columns|r_remount|spirit Ships of the Gobi: supply .12|No fuel, no water, no complaint.|
r_borderpost|Frontier Outposts|r_service|fort Ulan Bator; fn intelBoost; units cav 1|A hut, a telephone and a horse line every thirty kilometres.|
r_militia|Herdsmen's Militia|r_service|units mil 6; spirit Every Ger a Sentry Post: manpower .1|Nothing crosses the steppe unseen.|
r_artillery|Horse Artillery|equipment|equip artillery 80; units hvy 1|Guns that keep up with cavalry.|
r_antitank|Anti-Tank Rifles|equipment,r_archers|tech m_smg; spirit Tank Hunters on Horseback: def .05|Ride up, dismount, fire, ride off.|
r_tanks|The Armoured Brigade|armoured,r_artillery|units arm 1; equip tanks 60; tech m_tank2|Fast tanks on a sea of grass.|
r_signals|Radio Squadrons|armoured,officers|tech m_radio; spirit Wireless Cavalry: org .04, atk .02|A column a hundred kilometres deep stays in touch.|
r_air|The Mongolian Arat Squadron|squadron|equip aircraft 80; tech m_air2; spirit Herdsmen's Wings: air .08|Paid for by donations of livestock.|
r_fields|Steppe Airstrips|squadron|infra 1; spirit Any Flat Pasture: air .05, civdef .1|The whole east is a landing ground.|
r_academy|Sukhbaatar Officers' Academy|officers,r_signals|tech m_doc1; axp 30; xp|Named for the man who rode to meet the Red Army in 1921.|
r_cavmech|Cavalry-Mechanised Groups|r_tanks,r_camel|tech m_doc2; spirit Horse and Tank Together: atk .08, supply .05|Horses go where tanks cannot, and the reverse.|
r_desert|Desert Warfare|steppe,r_camel|spirit Masters of the Gobi: supply .1, def .04|Water is the only objective that matters.|
r_winter|Fifty Below|steppe|spirit Winter Riders: def .05, org .04|The cold is a neighbour, not an enemy.|
r_heroes|Heroes of the Republic|r_academy,r_air|ws 6; legit 4; spirit Order of the Red Banner: org .04, ws 3|A machine-gunner holds a hill alone.|
r_modern|A Modern Small Army|r_cavmech,r_desert,r_heroes|stab 5; spirit Eighty Thousand Sabres and Engines: atk .05, def .05, org .05|A tenth of the population can be mobilised.|
# Society
gers|A Nation of Tents||stab 3; popgrow 1|Seven hundred thousand people in a land three times the size of France.|ai 2
script|A New Alphabet|gers|spirit New Alphabet: literacy .6, research .04|The old vertical script is retired.|mx s_old
s_old|Keep the Old Script|gers|ig devout 5, intel 5; spirit Vertical Script: literacy .2, stab 4, legit 4|Eight centuries of books stay readable.|mx script
s_schools|Ger Schools|script|s_old|law public; build university 1; spirit Teacher on Horseback: literacy .4|A school that moves with the pasture.|
s_medicine|The First Hospitals|gers|tech s_medicine; spirit Doctors Not Shamans: growth .3, manpower .03|Soviet doctors and a vaccination cart.|
s_lamas|Lama Medicine|s_medicine|ig devout 5; spirit Two Pharmacies: growth .1, stab 2|Tibetan herbals are studied, not burned.|
s_women|Unveil the Yurt|gers|ig rural 3; popgrow 1; spirit Women's Sections: output .04, manpower .03|Women may divorce, inherit and vote.|
s_mothers|Order of Maternal Glory|s_women,s_medicine|popgrow 2; spirit Mothers of Many: growth .3|A medal for the fifth child, a better one for the eighth.|
s_naadam|The National Naadam|gers|stab 4; ws 4; legit 4|Wrestling, archery and horse racing, now on Revolution Day.|
s_wrestlers|Titans of the Nation|s_naadam|ws 4; spirit Three Manly Games: org .03, stab 3|A champion is worth a regiment for morale.|
s_theatre|The State Theatre|s_naadam,s_schools|ig intel 6; spirit Among Three Sad Hills: sway .1, stab 3|An opera about star-crossed herders.|
s_sciences|Committee of Sciences|s_schools|res 25; build university 1; spirit Institute of Scripture and Manuscripts: research .05|Founded to study old books; becomes an academy.|
s_dinos|Bones of the Gobi|s_sciences|res 15; infl 20|An expedition finds eggs, and then a great deal more.|
s_radio|Ulan Bator Calling|s_theatre|tech s_radio; spirit Loudspeaker in the Square: sway .15|Long songs on long wave.|
s_film|Mongol Kino|s_radio|ws 4; legit 4; spirit Son of Mongolia: sway .1, ws 3|The first feature is shot with a borrowed crew.|
s_census|Count the People and the Herds|s_schools,s_medicine|tech s_stat; pp 40; spirit Registered Households: tax .06, manpower .04|The first reliable number: 738,200.|
s_settle|Settle the Nomads|s_census|build urban 1, farm 1; ig rural -5; spirit District Centres: tax .06, build .05|A school, a clinic and a shop at every well.|mx s_roam
s_roam|Let Them Roam|s_census|ig rural 6; spirit Four Seasons Four Pastures: farm_out .08, stab 3|The administration will have to learn to ride.|mx s_settle
s_youth|The Revolutionary Youth League|s_theatre,s_wrestlers|mp 40; spirit Pioneers of the Steppe: manpower .05, train .1|Red scarves and marksmanship badges.|
s_hero|The Statue of the Rider|s_film,s_youth|stab 5; legit 6; ws 4|The founder on his horse, pointing south.|
s_chinggis|The Great Ancestor|s_hero|stab 6; ws 6; rel SOV -10; spirit Memory of the Khan: legit 8, org .03|Eight hundred years since his birth. Moscow frowns.|mx s_forget
s_forget|A Feudal Reactionary|s_hero|rel SOV 10; ig intel -5; spirit Correct History: pp .05, sway .1|The celebration is cancelled; the stamp is withdrawn.|mx s_chinggis
s_final|A People, Not a Province|s_chinggis,s_settle,s_dinos|s_chinggis,s_roam,s_dinos|s_forget,s_settle,s_dinos|s_forget,s_roam,s_dinos|stab 10; spirit Mongol Nation: legit 10, stab 5, manpower .05|Whatever the maps in other capitals say.|
# The Provinces
aimags|Eighteen Provinces||build admin 1; stab 2|Each larger than most countries, with a capital of a few hundred tents.|ai 2
p_west|The Western Peoples|aimags|stab 3; mp 20; spirit Oirat Banners: manpower .03|Dörvöd, Torguud and Zakhchin never quite forgot they were once an empire.|
p_kazakh|The Kazakh Province|p_west|ig devout 3; mp 20; spirit Eagle Hunters: manpower .03, stab 2|A province with its own language is carved out of the Altai.|
p_altai|Altai Passes|p_kazakh|fort Ulan Bator; rel SIK 10; units cav 1|Caravans, refugees and raiders use the same three passes.|
p_uriankhai|The Northern Lake|aimags|build logging 1, ranch 1; rel SOV 5|Reindeer herders on the largest lake, and a steamer.|
p_north|The Northern Fields|p_uriankhai|build farm 2; spirit Selenge Wheat: farm_out .06|The only valley where grain reliably ripens.|
p_altanbulag|The Trading Gate|p_north|trade SOV; money 6; build port 1|The tea road crossed the frontier here for two centuries.|
p_east|The Eastern Steppe|aimags|build ranch 2; fort Ulan Bator|Flat to the horizon, and the horizon is Manchukuo.|
p_tamsag|The Tamsag Salient|p_east|infra 1; units cav 1; spirit Forward Base in the East: supply .08|A railhead in a bulge of the border.|
p_gazelle|The Gazelle Herds|p_east|build ranch 1; money 3; spirit Steppe Game: farm_out .03|A million white gazelle, hunted by lorry.|
p_gobi|The Gobi Provinces|aimags|build ranch 1; spirit Camel Country: supply .05|A camel for every man, woman and child.|
p_wells|The Caravan Wells|p_gobi|infra 1; spirit Mapped Water: supply .06|A well every thirty kilometres, marked on a map for the first time.|
p_salt|Gobi Salt|p_wells|money 5; build chem 1|Scraped from dry lakes.|
p_kharkhorin|The Old Capital|aimags|legit 5; infl 10; ig devout 3|A monastery built from the ruins of the Khan's city.|
p_orkhon|The Orkhon Valley Farms|p_kharkhorin|build farm 2; tech p_tractors|Irrigation ditches the Uighurs dug, re-opened.|
p_centres|Provincial Centres|p_west,p_east,p_gobi|build admin 1, urban 1; spirit A Town in Every Province: tax .06, pp .04|A school, a hospital, a party office, a jail.|
p_relay|The Horse Relay|p_centres|infra 1; spirit Urtuu Post: supply .06, pp .03|Fresh horses every forty kilometres, as in the thirteenth century.|
p_air|The Air Mail|p_relay|infra 1; equip aircraft 20; spirit Provincial Air Service: pp .04, supply .04|A biplane does in three hours what a rider did in ten days.|
p_doctors|A Doctor in Every Province|p_centres|tech s_medicine; popgrow 1; spirit Feldshers: growth .2|Trained for two years in Ulan Bator.|
p_vets|A Veterinarian in Every District|p_centres,p_gazelle|spirit District Veterinary Points: farm_out .08|Animals outnumber people thirty to one; so should their doctors, nearly.|
p_dzud|Prepare for the Dzud|p_vets,p_orkhon|build farm 1; spirit Emergency Fodder Reserve: farm_out .06, growth .1|One winter in seven kills a third of the herds.|
p_hunters|The Fur Trade|p_uriankhai,p_altai|money 8; trade SOV; spirit Marmot and Sable: tradecap .05|Two million marmot skins a year.|
p_quotas|Livestock Delivery Quotas|p_dzud|money 8; ig rural -6; spirit Compulsory Deliveries: tax .1, rad .04|So many kilos of wool per head, whatever the winter.|mx p_prices
p_prices|Pay a Fair Price|p_dzud|ig rural 6; spirit State Purchasing Prices: farm_out .06, rad -.04|Herders sell more when it is worth their while.|mx p_quotas
p_roads|The Millennium Road|p_air,p_wells,p_altanbulag|infra 3; spirit East-West Track: supply .08, tradecap .04|A graded track from the Altai to the eastern border.|
p_whole|A Country, Not a Map|p_roads,p_doctors,p_hunters|stab 8; spirit Administered Steppe: tax .06, stab 4, manpower .04|The government can now find its citizens.|
# Faith and Memory
faith|A Thousand Monasteries||ig devout 3; pp 20|One man in three is a lama.|ai 2
t_gandan|The Great Monastery|faith|ig devout 5; stab 3; legit 3|The one whose gates will stay open, as an exhibit if nothing else.|
t_tax|Tax the Monasteries|faith|money 10; ig devout -6; bop -8|A levy on herds that were always 'the Buddha's'.|
t_low|Free the Low Lamas|t_tax|mp 80; ig devout -4, rural 5; spirit Lamas to the Herds: manpower .05, farm_out .04|The poor monks were servants. They are offered sheep.|
t_art|Lama Artisans' Cooperatives|t_low|build furniture 1, tools 1; spirit Monastery Craftsmen: output .03|Carvers of Buddhas make saddles and furniture.|
t_library|Save the Libraries|t_gandan|res 20; ig intel 6; legit 4|The Kanjur in letters of gold on black paper.|
t_museum|The Palace Museum|t_library|infl 20; legit 4; stab 2|The last king's winter palace, with his stuffed animals.|
t_choijin|The Oracle's Temple|t_museum|infl 10; ig devout 3|Kept as a museum of religion. The masks are real.|
t_medicine|The Lama Doctors|t_gandan|tech s_medicine; spirit Institute of Folk Medicine: growth .15|Pulse-reading and four hundred herbs.|
t_astrology|The Calendar Office|t_library|res 10; spirit Lunar and Solar Calendars: farm_out .03, stab 2|White Month falls when the astrologers say, still.|
t_whitemonth|Herdsmen's Day|t_astrology|stab 4; ig rural 4; ws 2|The lunar new year, under a new name.|
t_epic|The Epic Singers|faith|ws 4; legit 3; spirit Bards of the Jangar: sway .1|An epic takes eleven nights to sing.|
t_fiddle|The Horse-Head Fiddle|t_epic|ws 3; stab 2; infl 10|Two strings, a carved horse and the sound of the wind.|
t_secret|The Secret History|t_epic,t_library|res 15; legit 6; ws 4; spirit Our Own Chronicle: legit 5, sway .1|Seven hundred years old, and finally printed in Mongolian.|
t_script|Calligraphers of the Old Script|t_secret|ig intel 5; legit 3; spirit Brush and Reed Pen: literacy .1, stab 2|A script written downward, like rain.|
t_stupas|The Stupas of the Steppe|t_gandan,t_choijin|ig devout 5; stab 3; spirit Ovoo on Every Pass: stab 3|Stones added by every traveller, monk or commissar.|
t_shaman|The Shamans of the North|t_epic|ig devout 3; stab 2; mp 10|Older than the lamas, and harder to count.|
t_atheist|The Anti-Religious League|t_tax|ig devout -8 -.3; rad -.05; bop -10; spirit Godless Campaign: research .03, stab -2|Lectures on thunder, with a magneto.|mx t_tolerate
t_tolerate|Belief Is a Private Matter|t_tax,t_gandan|ig devout 8; stab 4; bop 8; spirit Quiet Faith: stab 4, legit 3|An altar in the back of every tent, and no questions.|mx t_atheist
t_buryat|The Buryat Refugees|t_shaman,t_script|popgrow 1; ig intel 5; rel SOV -5; spirit Buryat Teachers: research .03, literacy .2|The first schoolmasters, doctors and ministers came across the northern border.|
t_scholar|The Learned Lamas|t_library,t_medicine|res 20; build university 1; spirit Monks as Scholars: research .05|A Tibetan grammar is written by a man who now teaches physics.|
t_art2|The Painter of One Day|t_museum,t_fiddle|ws 3; infl 20; spirit National School of Painting: sway .1|A whole country's summer on a single canvas.|
t_heritage|A Nation's Memory|t_scholar,t_art2,t_whitemonth|stab 6; legit 6; spirit Old Roots New State: legit 6, stab 4|What is kept is kept deliberately.|
t_buddha|The Great Buddha Recast|t_heritage,t_tolerate|ig devout 10; stab 5; money -8|The statue that was melted for bullets is cast again, twenty-six metres tall.|
t_new|New Man of the Steppe|t_heritage,t_atheist|stab 4; spirit Scientific Outlook: research .06, output .03|He reads, votes and vaccinates his sheep.|
p_coalprov|Provincial Coal Pits|p_centres|build coalm 1; spirit Dung No Longer the Only Fuel: output .02|A small pit beside every provincial town.|
p_wolf|The Wolf Hunts|p_gazelle|ig rural 3; spirit Bounty on Wolves: farm_out .03|Forty thousand pelts a year, paid for per tail.|
t_khoomei|The Throat Singers|t_fiddle|ws 3; infl 10|One man, two notes at once.|
`);

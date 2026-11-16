// Siam (2.8): hand-written. The Promoters of 1932 and their quarrel: Phibun's state of the Leader and the cultural
// mandates, Pridi's university, treaties and Free Thai, and the princes who wait; rice, teak, tin and rubber and the
// buying back of the economy; the army, the Japanese-built navy and the home-built air force; the bamboo that bends
// with the wind (nations28.js), the lost territories and the war with France; then the night of 8 December 1941.
'use strict';
TREES.SIA = autoTree('th_', `
# The Promoters
promoters|The People's Party||pp 30; stab 2|In June 1932 a hundred officers and officials ended seven centuries of absolute monarchy before breakfast. Four years on, the Promoters still govern, and still argue.|ai 6
phahon|Colonel Phahon's Cabinet|promoters|stab 3; ig army 3|Phraya Phahon, the eldest of the Promoters, holds the soldiers and the civilians of the party in one cabinet by offending neither.|
sixprinciples|The Six Principles|promoters|legit 4; pp 15|Independence, safety, economic well-being, equality, liberty and education: the programme proclaimed on the morning of the revolution.|
constitution|The Permanent Constitution|sixprinciples|legit 4; stab 2; law parliamentary|The charter of December 1932: a king who reigns, an Assembly half elected and half appointed until the people are schooled.|
constitutionday|Constitution Day|constitution|stab 2; legit 2; money -1|Every tenth of December the charter is carried in procession on a golden tray, and Bangkok keeps a fair for a week.|
assembly|The National Assembly|constitution|pp 20; legit 2|Seventy-eight elected members and seventy-eight appointed ones sit in the Ananta Samakhom throne hall.|
election37|The Election of 1937|assembly|legit 3; pp 15 ?? Let the provinces speak => legit 3; stab -1 // Keep the appointed half firm => stab 2; legit -2|November 1937: the first direct election. There are no parties, only men and their provinces.|date 1937-11
landscandal|The Crown Land Scandal|election37|pp 10 ?? Phahon resigns and returns => legit 3; stab -2 // Bury the report => stab 1; legit -4|July 1937: Promoters are found to have bought crown land at a friend's price. A deputy from the north-east reads the list aloud.|date 1937-7
boyking|The Boy King in Lausanne|promoters|legit 3; stab 2|Ananda Mahidol is eleven and at school in Switzerland. His portrait reigns; three regents sign.|
regency|The Council of Regency|boyking|pp 15; stab 2|Prince Aditya Dibabha, an old general and an old minister sign what the cabinet lays before them.|
kingsvisit|The King Comes Home|regency|stab 5; legit 5; money -2|November 1938: the thirteen-year-old King sees his kingdom for two months. The crowds along the river are larger than any the Promoters have drawn.|date 1938-11
boworadet|The Shadow of Boworadet|phahon|rad -0.03; ig army 2 ?? Amnesty for the lesser rebels => legit 3; stab 1 // Keep them on Tarutao => rad -0.02; legit -2|The royalist rising of October 1933 failed at Lak Si. Its prisoners break stones on Tarutao island.|
laksi|The Monument at Lak Si|boworadet|legit 2; ig army 2|A memorial to the seventeen soldiers of the government who fell against the princes' rebellion: the charter on a golden tray, in concrete.|date 1936-10
twowings|Soldiers and Civilians|phahon|pp 20|The party has a military wing and a civilian wing, and each has found its man: Luang Phibun, the artillery colonel, and Luang Pradit, the lawyer they call Pridi.|
quarrel|The Quarrel of the Promoters|twowings|pp 15 ?? The army must lead => ig army 5; ideo aut 4 // The Assembly must lead => legit 3; ideo dem 4|Whose revolution was it? The men with the tanks at the throne hall, or the men who wrote the proclamation?|
phahonretires|Phahon Steps Down|quarrel,election37|pp 20; stab -2|December 1938: the old colonel has had enough of votes of no confidence. The Assembly must choose his successor.|date 1938-12
treatyrev|An End to the Unequal Treaties|sixprinciples|infl 20; legit 4|Since 1855 foreigners have been judged by their own consuls and Siam has taxed its imports at three per cent. Every treaty is to be renegotiated.|
treaties37|The Treaties of 1937|treatyrev|legit 6; stab 2; spirit Full Sovereignty: tax .04, legit 2|Thirteen powers sign new treaties within two years. For the first time since King Mongkut, Siam is master of its courts and its customs house.|date 1937-11
lawcodes|The Law Codes|treatyrev|legit 3; res 10|The civil, commercial and criminal codes are finished at last: the price the powers asked for giving up their consular courts.|
localgov|Municipalities|assembly|legit 2; infra 1; ig pb 3|Elected councils for the towns: a school of self-government, the Promoters say, for a people who have never been asked.|
education|Four Years of School for All|sixprinciples|res 10; spirit Compulsory Schooling: research .02, stab 1|Half the Assembly is to stay appointed until half the people can read. The schools race the clock.|
templeschools|The Monastery Schools|education|ig devout 4; stab 1|Most village schools still sit in the wat, under a monk and a government primer.|
radio|Radio Bangkok|constitutionday|stab 2; pp 15|The government's voice reaches the provinces at Phaya Thai's transmitter, an hour each evening.|
songsuradet|The Rival: Phraya Songsuradet|twowings|pp 15 ?? Send him abroad => stab 2; ig army -2 // Leave him his staff college => ig army 3; stab -2|The brain of the 1932 coup teaches tactics at Chiang Mai and thinks little of the artillery colonel who has passed him.|
promotersend|The Revolution Grows Up|phahonretires|pp 30; stab 2|The first generation of the People's Party hands on. What Siam becomes is now a matter of which Promoter wins.|

# The Leader
phibun|Luang Phibunsongkhram|phahonretires|leader Plaek Phibunsongkhram/People's Party (Military Wing); pp 40; ig army 6; ideo aut 5; smbend 5|16 December 1938: the forty-one-year-old Minister of Defence becomes Prime Minister, keeping Defence and taking the Interior as well.|ai 5; mx pridi, khuang
plot39|The Songsuradet Plot|phibun|rad -0.05; stab 2; legit -4; ig army 2 ?? The special court => rad -0.03; legit -3 // Exile and no more => legit 2; stab -1|January 1939: fifty-one arrests in a night. Eighteen men are shot at Bang Khwang; Songsuradet dies selling sweets in Phnom Penh.|date 1939-1
leaderstate|The Nation Follows the Leader|plot39|law decree; pp 30; spirit Trust the Leader: stab 4, pp .1, legit -2|"Chuea Phu Nam, Chat Phon Phai": believe in the Leader and the nation will escape danger. The slogan is on every wall and wireless.|
mandate1|The First Mandate: Thailand|leaderstate|rename Thailand/Thai; smmand 1; ws 4; legit 3|24 June 1939: the country, the people and the nationality are to be called Thai. Siam was a name foreigners used.|date 1939-6
mandate2|Mandates on Loyalty|mandate1|smmand 1; rad -0.02; stab 1|No Thai shall act for a foreign power or reveal what may harm the nation. Treason is given a wide definition.|
anthem|A New Anthem|mandate1|smmand 1; ws 3; stab 1|Luang Saranupraphan's words win the competition: "Thailand embraces in its bosom all people of Thai blood."|date 1939-12
flagsalute|Eight in the Morning|anthem|smmand 1; stab 2|The flag goes up and the anthem plays at eight o'clock; everyone in the street stands still until it ends.|
mandate5|Buy Thai, Eat Thai|mandate2|smmand 1; ig pb 4; spirit Thai Goods: output .02, tradecap -.02|The fifth mandate: Thais should eat what Thais grow and wear what Thais weave.|
mandate9|One Language|mandate5|smmand 1; legit 2; rad 0.01|Central Thai for everyone: the Lao of the north-east, the Malay of the south, the Chinese of the markets.|
dress|Hats and Trousers|flagsalute|smmand 1; stab -1; pp 15 ?? Enforce it at the ministries' doors => smmand 1; rad 0.01 // Persuade with posters => stab 1|The tenth mandate: no more sarongs or bare chests in town. "Hats lead the nation to greatness." No hat, no stamp, no tram ticket.|date 1941-1
dailylife|The Mandate on Daily Life|dress|smmand 1; spirit Ordered Days: output .02, stab 1|Eight hours of work, eight of rest, eight of sleep; four meals; a kiss for the wife before the office.|
newyear|New Year in January|mandate1|stab 1; infl 5|The year will begin on the first of January, as in the civilised countries, and no longer in April.|date 1941-1
yuwachon|The Yuwachon|leaderstate|spirit Yuwachon Thahan: manpower .03, ws 2; ig army 3|Schoolboys in khaki drill with wooden rifles. The Leader has read about the Hitler Youth and the Boy Scouts and taken something from each.|
wichit|Luang Wichit's Theatre|leaderstate|ws 4; pp 15; spirit Blood of Suphan: ws 3, legit 1|The head of the Fine Arts Department writes plays in which Thai heroines die for the nation and songs the whole country hums.|
panthai|The Great Thai Race|wichit|ws 3; claim Luang Prabang, Vientiane; smbend 5|Luang Wichit's map shows sixty million Thai from Assam to Hainan. Only fourteen million of them live inside the frontier.|
chinese|The Thai Economy for the Thai|mandate5|money 2; ig pb 5; rad 0.02 ?? Reserve the trades => money 2; rel CHI -10 // Tax and license => money 1|Twenty-seven occupations are reserved for citizens; Chinese schools and newspapers are closed; the tobacco, salt and birds' nest trades are taken over.|
fieldmarshal|Field Marshal|leaderstate|pp 30; ig army 5; legit -2|July 1941: after the victory over France the Leader promotes himself two ranks at once, with a baton the King has not been asked to give.|date 1941-7; req cf th_victory
monument|The Democracy Monument|constitutionday,leaderstate|stab 2; legit 2; money -2|Four wings seventy-five feet high around the charter on its tray, in the middle of Ratchadamnoen Avenue. The date of the revolution is in every measurement.|date 1940-6
victorymon|The Victory Monument|fieldmarshal|ws 4; stab 2|An obelisk like a bayonet for the fifty-nine who died against France.|
phetchabun|A Capital in the Jungle|fieldmarshal|fort Korat; money -4 ?? Build Phetchabun => infra 2; stab -3; smseri 4 // A plan on paper => pp 10|A new capital in the fever valleys of Phetchabun, out of reach of a fleet and of the Japanese. The conscript labourers die by the thousand.|date 1943-6
buddhistcity|The Buddhist City|phetchabun|ig devout 4; money -3; stab -2|A holy city at Saraburi to make the country the centre of the faith: the second bill on which the Assembly finds its courage.|date 1944-3
censor|The Publicity Department|radio,leaderstate|law censorship; stab 2; rad -0.02|Nai Man and Nai Khong argue the day's news on the wireless every evening, and always reach the Leader's conclusion.|
police|Luang Adul's Police|plot39|law secret_police; rad -0.04; legit -3|The Director-General of Police is the Leader's oldest friend, and his file on everyone is very full.|
tenyears|Ten Years More|leaderstate|pp 25; legit -3; stab 2|1940: the appointed half of the Assembly, due to retire when the people could read, is kept for another decade.|date 1940-9
ratthaniyom|Twelve Mandates|dailylife,mandate9|stab 3; ws 3; spirit Ratthaniyom: stab 3, ws 3, research -.02|A nation with one name, one language, one dress and one Leader. Whether it is a nation of one mind is not asked.|req mand 8
leadertotal|The Leader's War Powers|tenyears|law autocracy; pp 30; ig army 4|Supreme Commander, Prime Minister, Minister of Defence, of the Interior and of Foreign Affairs.|req war
bushido|The Code of the Brave|yuwachon|ws 3; axp 4|Wira Tham: fourteen virtues for a warrior nation, modelled a little too plainly on a neighbour's.|
womens|The Women's Bureau|dailylife|stab 1; spirit Lady La-iad's Bureau: stab 1, manpower .01|The Leader's wife leads the nation's women in hats, gloves and patriotic verse, and a women's cadet corps.|
operas|National Dress and Dance|wichit|stab 1; infl 5|The ramwong is taken from the villages, given rules and ten approved tunes, and danced at the ministries on Wednesdays.|

# Pridi's Road
pridi|Pridi's Cabinet|phahonretires|leader Pridi Banomyong/People's Party (Civilian Wing); pp 40; legit 4; ideo dem 6; smbend -5|The Assembly chooses the lawyer: the man who wrote the first proclamation and the first constitution.|ai 1; mx phibun, khuang
thammasat|The University of Moral and Political Sciences|sixprinciples|res 15; spirit Thammasat: research .03, legit 2|Pridi's open university by the river: anyone may enrol, and seven thousand did in the first year.|
openadmission|Lectures by Post|thammasat|res 10; ig intel 4|Clerks and provincial teachers read law at night. The civilian wing is raising its own army, of graduates.|
yellowbook|The Yellow Book|pridi|pp 15 ?? Co-operatives for the villages => ig rural 5; rad -0.02; ig land -4 // Leave it in the drawer => stab 2|Pridi's economic plan of 1933 would have made every farmer an employee of the state. It cost him a year of exile; the King called it communism.|
coops|Village Co-operatives|yellowbook|ig rural 4; spirit Credit Co-operatives: farm_out .04, stab 1|Loans at six per cent in place of the Chinese rice-miller's sixty.|
revenuecode|The Revenue Code|treaties37|money 3; spirit Revenue Code: tax .05; ig rural 4|1938: the capitation tax and the land tax on the poor are abolished; income is taxed in their place.|date 1938-4
goldreserve|Gold in the Vault|revenuecode|money 4; stab 2|Pridi moves the reserve out of sterling and into gold bars under the Ministry of Finance, a year before the pound falls.|date 1939-6
centralbank|The Bank of Thailand|goldreserve|spirit Bank of Thailand: tax .03, build .04; money 2|A national bank of issue, founded in a year when no one else's notes could be trusted.|date 1942-12
fullassembly|A Fully Elected Assembly|pridi|law universal; legit 6; stab -2; ideo dem 4|The appointed members go home ten years early. The people can read well enough to choose.|
parties|Parties Allowed|fullassembly|legit 3; pp 15; rad 0.01|The Promoters have ruled as a club. Now anyone may found another.|
pressfree|A Free Press|fullassembly|legit 4; stab -1; ig intel 5|Kulap Saipradit's newspapers print what the Publicity Department would not.|
civilarmy|The Army Under the Assembly|pridi|ig army -6; legit 4; pp 20 ?? Retire the colonels => ig army -4; stab -2; ideo dem 3 // Buy them with a budget => money -3; ig army 4|The military wing made the revolution with tanks. Pridi means it to be the last thing the tanks decide.|
neutral39|The Neutrality Proclamation|pridi|smcred 15; stab 2; spirit Strict Neutrality: stab 2, ws -3|September 1939: Siam will take no side in Europe's war, and says so in three languages.|date 1939-9
pacts40|Three Pacts in One Day|neutral39|smcred 10; rel ENG 10, FRA 10, JAP 10; infl 15|12 June 1940: non-aggression with Britain and with France, friendship with Japan, signed the same afternoon in Bangkok and Tokyo.|date 1940-6
regentpridi|Pridi, Regent|kingsvisit|pp 25; legit 3; smseri 5|December 1941: kicked upstairs to the Council of Regency for refusing to sign what the Japanese wanted. From the palace he can see everything.|date 1941-12; req cf th_passage
ruth|"Ruth"|regentpridi|smseri 15; pp 15|The Regent has a code name and a wireless set in a house by the river. X.O. Group is recruited from his students.|req cf th_passage
seni|The Minister in Washington|ruth|smseri 12; rel USA 20|Seni Pramoj is handed the declaration of war and puts it in his drawer. "I keep my allegiance to the Thai people."|date 1942-1; req cf th_passage
force136|Force 136 and the OSS|seni|smseri 12; rel ENG 10, USA 10; axp 3|Thai students from Cambridge and Cornell drop by parachute into the north. The police who arrest them are in the movement.|date 1944-3; req seri 30
secretfields|The Secret Airfields|force136|smseri 10; equip arms 300|Dakotas land at night on strips cut in the forest of Sakon Nakhon. Eighty thousand guerrillas are counted, on paper.|req seri 50
peaceprocl|The Peace Proclamation|secretfields|fn seriRise; legit 6; stab 3|The declaration of war was unconstitutional and against the will of the Thai people, and is void.|req seri 60
elderstatesman|The Elder Statesman|peaceprocl|pp 30; legit 4|The King confers the title on Pridi. No commoner has held it before.|
constitution46|The Constitution of 1946|elderstatesman|law universal; legit 6; ideo dem 5|Two elected houses, parties, and no appointed soldiers.|date 1946-5
unseat|A Seat at the United Nations|peaceprocl|infl 25; rel ENG 10, FRA 10, SOV 5|The price is the lost provinces returned to France and the anti-communist law repealed for Moscow's vote.|date 1946-12
seasia|A League of South-East Asia|elderstatesman|infl 20; rel CHI 5 ?? Shelter the Viet Minh and the Lao Issara => infl 10; rel FRA -15 // Stay out of the colonies' wars => rel FRA 5; rel ENG 5|Pridi dreams of a union of free nations from Rangoon to Hanoi, with Bangkok as its meeting-place.|date 1947-1

# Crown and Tradition
khuang|Khuang Aphaiwong|phahonretires|leader Khuang Aphaiwong/Progressive; pp 30; legit 3; ideo dem 3|The telegraph engineer of the Promoters, a prince's grandson with a comedian's tongue, forms a cabinet of the men nobody fears.|ai 1; mx phibun, pridi
princesfree|The Princes Released|khuang|legit 4; stab 2; ig land 4|Prince Rangsit, the King's uncle, comes home from Tarutao; Prince Boworadet from Saigon.|
rangsit|Prince Rangsit of Chainat|princesfree|pp 15; legit 3|The old prince sentenced to death in 1939 lives to be Regent of the kingdom.|
prajadhipok|The King Over the Water|boyking|legit 2 ?? Invite Prajadhipok home => legit 5; ig land 5; stab -2 // Leave him in Surrey => stab 1|The King who abdicated in 1935 rather than sign away his people's rights "to any individual or group" grows roses in Virginia Water.|
crownproperty|The Crown Property Bureau|landscandal|money 3; legit 2|The privy purse is separated from the King's own estate and put under the Ministry of Finance.|
royalists|The Blue Ribbon|princesfree|ideo aut 4; ig land 5; legit 2|The princes and the old nobility have their newspapers again, and a quarrel with every Promoter.|
democrats|The Democrat Party|royalists,parties|pp 20; legit 3|Khuang and Seni found a party of royalists, lawyers and everyone who dislikes Pridi.|date 1946-4
strongcrown|A Crown Above the Parties|rangsit|law monarchy; legit 6; stab 3; ideo aut 3|The King appoints the upper house and the Privy Council returns. Fourteen years after the revolution, half of it is undone.|
ananda|King Ananda Returns|strongcrown|stab 5; legit 6|December 1945: a tall young man of twenty in a field marshal's uniform. He walks through Sampheng with the Chinese merchants who rioted a month before.|date 1945-12
privy|The Privy Council|strongcrown|pp 20; legit 2|Five princes advise the throne. The Promoters learn to bow again.|
sangha|The Sangha Act|templeschools|ig devout 6; stab 2; legit 2|1941: the monkhood is given an assembly, a cabinet and courts of its own, in the image of the state.|date 1941-10
emerald|The Emerald Buddha|sangha|stab 3; ig devout 4|The King changes the robes of the kingdom's palladium three times a year. A regent has been doing it since 1935.|
oldnobles|The Old Officials|royalists|pp 15; res 8; ig land 3|The Phraya and Chao Phraya who ran the ministries before 1932 are let back to their desks.|
siamagain|Siam Again|ananda|rename Kingdom of Siam/Siamese; infl 10; legit 2|The Leader's name for the country is put away with his hats. In English, at least, it is Siam once more.|date 1945-9
lese|The Dignity of the Throne|strongcrown|rad -0.03; legit -2; stab 2|The law on lèse-majesté is used again, and more widely than before the revolution.|

# Rice, Teak, Tin and Rubber
economy|A Country That Sells Rice|promoters|money 2; pp 15|Nine Siamese in ten grow rice. The mills, the boats, the banks and the ships that carry it away belong to other people.|ai 4
ricecompany|The Thai Rice Company|economy|money 2; ig pb 4; ig ind 3; build textile 1|1938: the state buys ten Chinese mills and enters the trade that is the country.|date 1938-11
riceboard|Rice at a Fair Price|ricecompany|ig rural 5; spirit Rice Office: farm_out .04, stab 1|A government buyer at the landing stage with scales that are true.|
irrigation|The Royal Irrigation Department|economy|build farm 2; infra 1; money -2|Canals and regulators for the central plain: the Chao Phraya is to feed two crops a year.|
chainat|The Chainat Dam|irrigation|build farm 2; build power 1; money -4|A barrage on the Chao Phraya, planned since 1903 and drawn again by every government.|date 1939-1
rangsitcanals|The Rangsit Fields|irrigation|build farm 1; ig land 3; ig rural 2|The canal grid north of Bangkok dug by a concession company in the last reign, now cleared and deepened.|
northeast|The Poor North-East|economy|infra 1; ig rural 4; rad -0.02|Isan has a third of the people and a tenth of the money. Its deputies are the loudest in the Assembly.|
roads|The Eighteen-Year Road Plan|northeast|infra 2; money -3|1936: fifteen thousand kilometres of highway for a country that has four hundred beyond its railways.|date 1936-4
railways|The State Railways|economy|build railway 1; infra 1|A metre-gauge net from the Malayan frontier to Chiang Mai and Ubon, with Bangkok at the centre like a spider.|
northline|The Khorat Lines|railways|build railway 1; infra 1; fort Korat|The line to Udon and the line to Ubon open the plateau, and carry an army to the Mekong in two days.|
southline|The Southern Line|railways|build railway 1; rel ENG 5|Bangkok to Penang in thirty hours, with a sleeping car.|
port|The Port at Khlong Toei|economy|build port 1; money -3; infl 5|Ocean ships have to unload onto lighters at Ko Sichang because of the bar at the river's mouth. A deep-water port is dredged below Bangkok.|date 1938-6
teak|The Teak Forests|economy|money 2; build logging 1|The northern forests are worked by British firms with elephants and thirty-year leases.|
teakleases|The Leases Fall In|teak|money 2; rel ENG -8; ig pb 3 ?? Take half for the Forest Department => money 2; rel ENG -6 // Renew them on better terms => money 1; rel ENG 6|The Bombay Burmah and Borneo Company leases expire. Half the forest could be the state's.|date 1939-7
forestind|The Forest Industry Organisation|teakleases|build logging 1; build furniture 1; ig ind 3|A state company to cut, float and saw.|
tin|The Tin of the South|economy|money 2; build ironm 1|Dredges in the estuaries of Phuket and Ranong, most of them Australian, all of them smelted in Penang.|
tinquota|The Tin Agreement|tin|money 2; rel ENG 5; infl 5|Siam bargains a larger share of the world cartel's quota than its mines deserve, by threatening to leave.|date 1937-1
smelter|A Smelter of Our Own|tinquota|build steel 1; rel ENG -5; ig ind 3|Tin has left the country as ore for a century.|
rubber|Rubber Smallholders|economy|build rubberp 1; ig rural 3|In the far south the Chinese and Malay planters tap a few acres each. The big estates are across the frontier.|
rubberquota|The Rubber Quota|rubber|build rubberp 1; money 1|The restriction scheme gives Siam more than it can yet produce: the planters set to work.|
industry|State Enterprise|ricecompany|build tools 1; ig ind 3; pp 15|Where no Thai has the capital, the state will be the capitalist.|
cement|Siam Cement|industry|build construction 1; infra 1|The Crown's cement works at Bang Sue, the only heavy industry in the kingdom, doubles its kilns.|
sugar|The Lampang Sugar Mill|industry|build plantation 1; ig rural 2|A state mill to end the import of Javanese sugar.|
paper|The Kanchanaburi Paper Mill|industry|build furniture 1; res 5|Bamboo pulp, a German engineer, and the army's Department of Science.|date 1938-1
tobacco|The Tobacco Monopoly|chinese|money 3; ig pb -2|The British-American Tobacco factory is bought out in 1941; cigarettes become a ministry.|date 1941-4
textiles|The Army's Cotton Mill|industry|build textile 1; equip arms 100|The Ministry of Defence spins the cloth for its own uniforms at Bang Sue.|
oilfuel|The Fuel Division|industry|build chem 1; smbend 3; rel ENG -6; rel USA -6|1939: the Ministry of Defence takes over the sale of oil. Shell and Standard-Vacuum close their depots and leave.|date 1939-4
fang|The Seepage at Fang|oilfuel|build oilr 1; money -2|Oil has oozed from the ground in the far north for longer than anyone remembers. The army drills.|
shipping|The Thai Navigation Company|port|money 1; build shipyard 1; ig pb 2|Four small steamers under the trident flag take the coasting trade from the Danes.|date 1940-1
baht|The Baht|goldreserve|money 2; stab 2|Eleven to the pound since 1928, and backed pound for pound in London.|
yenbloc|The Yen Bloc|baht|money 3; smbend 10; spirit Yen Credits: tax .04, stab -3, needs .04|April 1942: the baht is cut to par with the yen, and Japan pays for its army in Thailand with notes the Thai treasury must print.|req cf th_passage
inflation|Notes Without Number|yenbloc|money 2; stab -4; rad 0.03 ?? Sell gold to the public => stab 3; money -2 // Print => money 3; rad 0.02|The note issue grows tenfold in three years. A sarong costs a month's salary.|req cf th_passage
thainiyom|Thai Niyom|industry,chinese|spirit Thai-ism: output .04, tradecap -.03; ig pb 4|An economy of Thai owners, Thai workers and Thai customers. The Chinese take Thai names and carry on.|
vocational|Trade Schools|education|res 10; build tools 1|Carpenters, mechanics and weavers: the Leader wants a Thai behind every counter.|
chula|Chulalongkorn University|education|res 12; spirit Chulalongkorn: research .03|Engineers and doctors from the old royal university, with a Rockefeller medical school.|
medicine|Malaria and the Health Stations|chula|stab 2; spirit Rural Health: manpower .02, stab 1|Quinine, a midwife and a latrine for every district.|
survey|The Land Survey|rangsitcanals|ig rural 3; money 1|Title deeds for the farmers of the central plain, so that a moneylender must at least go to court.|
selfreliance|A Self-Reliant Kingdom|thainiyom,smelter|spirit Economic Independence: output .05, tax .03|The treaties are gone and the trade is coming home. It took the revolution fifteen years.|

# The Army
army|The Royal Siamese Army|promoters|axp 4; ig army 3|Thirty-three battalions of infantry, good artillery, and the only political party that matters.|ai 4
defbudget|A Quarter of the Budget|army|money -2; units inf 2; ig army 4|Luang Phibun at the Ministry of Defence takes twenty-six per cent of the revenue, and the Assembly does not argue.|
conscription|Two Years in Uniform|defbudget|law extensive; mp 60|Every man at twenty-one, by lot, with the village headman watching the draw.|
lopburi|The Artillery Centre at Lopburi|defbudget|build artyf 1; axp 4; fort Korat|A military town laid out by the Leader himself, with a zoo and a cinema.|
bofors|Bofors Guns|lopburi|equip artillery 60; rel SWE 8|Swedish 75-millimetre mountain guns and anti-aircraft guns for a country with few roads.|
vickers|Vickers Tanks|defbudget|equip tanks 30; rel ENG 5|Carden-Loyd tankettes and Vickers six-tonners: the armour that decided 1932 and 1933, sixty machines in all.|
ha-go|Tanks from Japan|vickers|equip tanks 40; smbend 5; tech m_tank1|Fifty Type 95 light tanks, cheap, on credit, with instructors.|date 1940-6
rifle66|The Type 66 Rifle|army|equip arms 250; build arms 1|The Siamese Mauser is rebored for a rimless cartridge at the Bangkok arsenal.|
arsenal|The Bang Sue Arsenal|rifle66|build arms 1; ig army 2|Cartridges, shells and uniforms from the army's own factories.|
madsen|Madsen Guns|rifle66|equip arms 150; rel DEN 5|Danish light machine guns, one to a section.|
cadets|Chulachomklao Academy|army|axp 5; generals Phin Choonhavan/3/off|The cadet school turns out a class a year. The class of 1932 has done rather well.|
staffcollege|The Staff College|cadets|tech m_doc1; axp 4|French textbooks until 1932, German ones after.|
fivearmies|The Army Circles|conscription|units inf 3; fort Chiang Mai, Songkhla|Five commands: Bangkok, Prachinburi, Khorat, Nakhon Sawan and Nakhon Si Thammarat.|
isanarmy|The Isan Army|fivearmies,northline|units inf 2; fort Korat; axp 3|Two divisions on the plateau facing the Mekong, under the Leader's favourite colonel.|
burapha|The Burapha Army|fivearmies|units inf 2; axp 3|The eastern army, facing Battambang across a frontier a man can walk over.|
payap|The Phayap Army|isanarmy|units inf 2, cav 1; axp 4|The north-western army that will march on Kengtung, if anyone ever marches on Kengtung.|req war
mountain|Jungle and Mountain|payap|tech m_mtn; units mtn 1|Mules, elephants and men who do not get malaria. There are not enough of the last.|
territorial|The Territorial Defence Corps|yuwachon,conscription|units mil 3; mp 40|Schoolboys of seventeen with rifles older than their fathers. At Chumphon they will fight, and stop the Japanese for five hours.|
gendarmes|The Provincial Police|army|units mil 2; rad -0.02|Luang Adul's gendarmerie is the second army of the kingdom and the first to meet any invader.|
reserves|The Reserve Rolls|conscription|mp 80; units inf 1|Every class since 1917 is on the district officer's list.|
motor|Lorries for the Guns|bofors|tech m_mot; equip autos 40|The artillery gives up its bullocks.|
antiair|Guns for Bangkok|bofors|equip artillery 30; spirit Bangkok Anti-Aircraft: civdef .2|Forty-millimetre Bofors around Don Mueang and the Rama VI bridge.|
warcollege|An Army That Has Fought|burapha|axp 6; ws 3|It has beaten a European power, or at any rate a governor-general. The army will not forget it, and will not let anyone else forget.|req cf th_victory

# The Navy
navy|The Royal Siamese Navy|promoters|equip ships 3; ig army 1|Old gunboats at the mouth of the Chao Phraya, and admirals who sided with the wrong rebellion.|ai 3
navalscheme|The Naval Scheme of 1935|navy|money -3; equip ships 6|Eighteen million baht voted for twenty-two ships: the largest order the kingdom has ever placed.|
trad|Torpedo Boats from Monfalcone|navalscheme|equip ships 8; rel ITA 8|Nine Trad-class torpedo boats from the Adriatic yards, delivered in two years.|date 1937-3
thonburi|Thonburi and Sri Ayudhya|navalscheme|equip ships 12; rel JAP 10; smbend 4|Two coast-defence ships from Kawasaki, two thousand tons with eight-inch guns: battleships for the Gulf.|date 1938-6
matchanu|The Submarines|navalscheme|equip ships 8; rel JAP 8; tech m_nav2|Four boats from Mitsubishi, three hundred and seventy tons each, named for the fish-tailed heroes of the Ramakien.|date 1938-7
sloops|Maeklong and Tachin|trad|equip ships 5|Two sloops from Uraga to train the cadets and show the flag.|
cruisers|Cruisers from Trieste|trad|equip ships 14; money -3; rel ITA 6|Two light cruisers, Taksin and Naresuan, are laid down in Italy. Whether they will ever be delivered depends on other people's wars.|date 1938-8
sattahip|Sattahip|navy|build port 1; build shipyard 1; fort Bangkok|A naval base on the eastern shore of the Gulf, with deep water and a hill to put guns on.|
dockyard|The Royal Dockyard|sattahip|build shipyard 1; ig ind 2|Minesweepers and patrol boats built opposite the Grand Palace.|
marines|The Marines at Chanthaburi|sattahip|units inf 1; axp 3|A battalion with its own artillery, to hold the coast road to Cambodia.|
navalair|Seaplanes at Chuk Samet|sattahip|equip aircraft 20|Watanabe floatplanes to find a fleet in the Gulf.|
kochang|The Guard at Ko Chang|thonburi,trad|fort Bangkok; spirit Gulf Squadron: navy .08|A coast-defence ship and three torpedo boats in the anchorage south of the island, watching for the French.|
kochangbattle|The Battle of Ko Chang|kochang|ws 6; axp 4|17 January 1941: the cruiser Lamotte-Picquet comes in at dawn. Thonburi fights for two hours on fire and is beached; the navy has its epic.|date 1941-1; req cf th_francowar
mines|Mines in the Bar|navy|fort Bangkok; spirit River Mouth Mined: navy .04|No fleet has forced the Chao Phraya since the French gunboats of 1893. The navy means it to stay so.|

# The Air Force
airforce|The Royal Siamese Air Force|promoters|equip aircraft 30; tech m_air1|Siam has flown since 1913, and built its own aircraft since 1915. In 1937 the air arm becomes a service of its own.|ai 3
donmueang|Don Mueang|airforce|infra 1; equip aircraft 15|The great field north of Bangkok, with the workshops, the school and the only concrete runway.|
workshops|The Aeronautical Workshops|donmueang|build aircraftp 1; res 8|Bang Sue has built Bréguets and Nieuports under licence, and the Boripatra, a bomber of Siamese design.|
hawk3|Hawks Built at Home|workshops|equip aircraft 50; build aircraftp 1; rel USA 6|Curtiss sells the licence for the Hawk III: fifty biplane fighters are built in Bangkok.|date 1937-6
corsair|The Corsair|workshops|equip aircraft 40|Seventy Vought Corsair observation machines, most of them home-built: the air force's maid of all work.|
hawk75|The Hawk 75N|hawk3|equip aircraft 25; tech m_air1|Twelve monoplane fighters with fixed wheels, bought from Buffalo: the fastest thing east of Rangoon.|date 1939-1
martin|Martin Bombers|airforce|equip aircraft 20; rel USA 5|Six Martin 139s, twin-engined and all metal.|date 1937-4
northamerican|The Embargoed Aircraft|hawk75|rel USA -15; smbend 8 ?? Protest and buy from Japan => smbend 6; equip aircraft 20 // Swallow it => rel USA 6; smcred 4|October 1940: ten dive bombers and six fighters paid for in dollars are seized on the dock at Manila. Washington thinks Siam is too friendly with Tokyo.|date 1940-10
nagoya|The "Nagoya"|northamerican|equip aircraft 35; rel JAP 8; smbend 5|Twenty-four Ki-30 light bombers and nine Ki-21s from Mitsubishi, flown in by Japanese crews.|date 1940-11
airwings|Five Wings|donmueang|equip aircraft 20; axp 2|Lopburi, Korat, Prachuap, Chiang Mai and Don Mueang.|
flyingschool|The Flying School|donmueang|res 6; equip aircraft 10|Avro trainers built in the workshops, and a class of sixty cadets a year.|
paratroops|Air Infantry|airwings|units inf 1; axp 2|A company that jumps, and guards the airfields when it does not.|
bombfrance|Bombs on Vientiane|nagoya,airwings|ws 4; axp 3; spirit Air Raids on Indochina: air .08, bombing .1|The air force raids Vientiane, Sisophon and Battambang by daylight, and for once nobody is there to stop it.|req cf th_francowar
prachuap|Wing Five at Prachuap|airwings|fort Songkhla; ws 3|On the morning of 8 December the airmen at Ao Manao will fight the landing for thirty-three hours, not having been told of the cease-fire.|date 1941-12

# The Bamboo and the Wind
bamboo|Bamboo in the Wind|treaties37|smcred 8; infl 15; pp 15|A small kingdom between two empires has kept its independence for a century by bending to the stronger wind, and straightening after.|ai 5
british|The British Neighbour|bamboo|rel ENG 12; smbend -6; money 1|Burma to the west, Malaya to the south; the Hongkong Bank, the Borneo Company, and an Englishman advising the Ministry of Finance.|
adviser|The Financial Adviser|british|money 2; rel ENG 6; smcred 4|Mr Doll keeps the reserve in London and the budget in balance, and reports to the Bank of England as well as to the minister.|
french|The French Neighbour|bamboo|rel FRA 5; smcred 3|Indochina took the left bank of the Mekong in 1893 with two gunboats off the Grand Palace. Nobody in Bangkok has forgotten the hour.|
japan|The Japanese Friend|bamboo|rel JAP 12; smbend 8|In 1933 Siam alone abstained when the League condemned Japan in Manchuria. Tokyo has not forgotten that either.|
abstain|An Asian Vote|japan|rel JAP 8; rel CHI -8; smbend 4; infl 5|Siam is the only free nation in the Far East besides Japan and China, and will not join the white powers in judging either.|
kra|The Kra Canal Rumour|japan|smbend 4; rel ENG -8 ?? Deny it loudly => smcred 6; rel ENG 6 // Let London wonder => infl 10; smbend 3|Every year a newspaper reports that Japanese engineers are surveying a canal across the isthmus that would ruin Singapore.|
usa|The American Adviser|bamboo|rel USA 10; smbend -4; res 5|Since Francis Sayre the adviser on foreign affairs has been a Harvard lawyer. The Americans want nothing here, which is why they are trusted.|
league|A Voice at Geneva|usa|infl 10; smcred 5|A founder member of the League, with a prince as its delegate.|
losttalk|The Lost Territories|french,panthai|claim Luang Prabang, Vientiane, Phnom Penh; ws 4; rel FRA -10|Maps go up in every school: the kingdom of Rama I in one colour, and in others what was taken in 1867, 1888, 1893, 1904, 1907 and 1909. Half of old Siam is under foreign flags.|
mekong|The Thalweg|losttalk|pp 10 ?? Demand the deep-water line => rel FRA -8; ws 3 // Ask politely => rel FRA 4; smcred 4|The French frontier runs along the Siamese bank of the Mekong, so that every island in the river is theirs.|date 1939-8
opportunity|France Has Fallen|mekong|ws 5; smbend 6; rel FRA -10|June 1940. The non-aggression pact was signed twelve days before; it has not been ratified, and will not be until the frontier is put right.|req franceDown
demand40|The Note of September|opportunity|fn francoDemand; ws 4|The thalweg as frontier, and the two enclaves on the right bank, Sayaboury and Champasak, returned. And if France should ever leave Indochina, Laos and Cambodia too.|date 1940-9
students|The Students March|demand40|ws 5; stab 1; smmand 1|Thammasat and Chulalongkorn march together on the Ministry of Defence shouting for the lost provinces. The Leader comes out on the balcony in tears.|date 1940-10
francowar|The War with France|students|fn francoThai; cflag th_francowar; ws 6; axp 4|28 November 1940: border incidents become air raids, and in January the Burapha and Isan armies cross the frontier.|date 1940-11; mx peacefulmekong
peacefulmekong|No War for Two Enclaves|demand40|smcred 12; rel FRA 10; rel ENG 8; stab 2; ws -4|The pact is ratified as it stands. The maps stay on the schoolroom walls.|mx francowar
yangdangkum|Yang Dang Khum|francowar|axp 5; ws 3|16 January 1941: the Foreign Legion counter-attacks into a Thai position that is ready for it. Neither side will have a larger battle.|
mediation|Japan Mediates|yangdangkum|smbend 12; rel JAP 10; pp 15|Tokyo offers its good offices, on a cruiser anchored off Saigon. France cannot refuse; Thailand does not ask what the favour will cost.|date 1941-1
tokyoconv|The Tokyo Convention|mediation|fn tokyoConv; cflag th_victory; ws 6; stab 3; legit 4|9 May 1941: Sayaboury, Champasak and Battambang come home. Four new provinces; one is named for the Leader.|date 1941-5
newprovinces|Phibunsongkhram Province|tokyoconv|core Luang Prabang; legit 2; money 1|Siem Reap without Angkor becomes a province with the Leader's name. Governors and schoolmasters go east.|
priceoffavour|The Price of the Favour|tokyoconv|smbend 8; rel ENG -8; rel USA -8; smcred -10|A secret letter promises Tokyo that Thailand will make no agreement against Japan. London and Washington assume there is more.|
arming41|Guns from Anyone|priceoffavour|equip arms 150, artillery 20 ?? Ask Britain for aircraft and oil => rel ENG 10; smbend -8; equip aircraft 15 // Ask Japan => rel JAP 8; smbend 8; equip tanks 20|Summer 1941: the Leader asks London for Hurricanes and Washington for oil, and tells each that the other has refused him.|date 1941-7
crosby|Sir Josiah Crosby|british|rel ENG 10; smcred 6; smbend -4|The British minister has been in Bangkok since 1904 and believes the Leader can be kept neutral with a little oil and a guarantee.|
guarantee41|Will Britain Fight for Us?|crosby,arming41|pp 10 ?? Ask Churchill to say so => rel ENG 8; smbend -10; smcred 5 // Rely on ourselves => ws 3|"If you are attacked, defend yourselves. We shall regard an attack on you as an attack on ourselves." The telegram reaches Bangkok on 8 December, some hours late.|date 1941-11
lastman|"To the Last Man"|guarantee41|ws 5; law extensive; spirit To the Last Man: def .05, ws 3|An act of the Assembly orders every Thai to resist an invader with whatever is to hand, and to burn what cannot be defended.|date 1941-9
matador|Operation Matador|guarantee41|smcred -6 ?? Let the British into Songkhla first => fn matador; smbend -15 // Neither side crosses our frontier => smcred 8|The British plan to seize the Songkhla beaches before the Japanese can. Whoever enters first is the invader.|date 1941-12
neutralzone|A Neutral Zone of Asia|league,neutral39|smcred 10; infl 15; rel USA 6|Roosevelt proposes that Indochina and Thailand be neutralised like Switzerland. Tokyo does not reply.|date 1941-8
swissasia|The Switzerland of Asia|neutralzone,lastman|spirit Armed Neutrality: def .06, stab 3, ws -2; smcred 15; fort Bangkok, Songkhla, Chiang Mai|Armed, mobilised, mined and friends with everyone: a small power can do no more.|req cred 60

# The Night of 8 December
dec8|The Night of 8 December|priceoffavour,lastman|pp 20; ws 3|At eleven at night the Japanese ambassador calls for the Prime Minister with an ultimatum that expires at two. The Prime Minister is at the Cambodian frontier and cannot be found. At two the landings begin.|date 1941-12; ai 6
fivehours|Five Hours' Fighting|dec8|axp 4; ws 2; units mil 1|At Songkhla, Pattani, Nakhon Si Thammarat, Surat, Chumphon and Prachuap the police, the youth corps and the garrisons fight until the telegram comes.|
passage|Right of Passage|fivehours|fn japPassage; cflag th_passage; smbend 20; stab -2; legit -3|Half past seven in the morning: a cease-fire. The Japanese army may cross Thailand to Malaya and Burma; Thailand's sovereignty is respected.|mx resist; ai 6
resist|Thailand Fights|fivehours|fn resistJapan; ws 10; legit 5; smbend -40|The cabinet votes to carry out its own law. The army falls back on the Khorat plateau; the British are asked for everything they have.|mx passage; ai 0.3
alliance|The Alliance of 21 December|passage|faction Greater East Asia Co-Prosperity Sphere; smbend 15; rel JAP 15; legit -3|Signed before the Emerald Buddha: Japan will help Thailand recover the territories lost to Britain.|date 1941-12
wardecl|War on Britain and America|alliance|war ENG; legit -4; smseri 8; ws 2|25 January 1942. One of the three regents is not in Bangkok that day and never signs.|date 1942-1
bombs|Bombs on Bangkok|wardecl|spirit Allied Raids: civdef -.1, stab -2; smseri 4|The Rama VI bridge, the Bang Sue yards and the power station; from 1944 the B-29s try out their first raid here.|
shan|The Shan States|wardecl,payap|fn shanStates; ws 4; legit 2|May 1942: the Phayap Army marches through the monsoon to Kengtung, losing more men to malaria than to the Chinese.|date 1942-5
saharat|The Original Thai State|shan|core Lashio; pp 15; stab 1|Kengtung and Möng Pan are annexed as Saharat Thai Doem, with a military governor and Thai postage stamps.|date 1943-8; req own Lashio
malaystates|The Four Malay States|wardecl|fn malayStates; ws 3; legit 2; smbend 5|Tōjō visits Bangkok in July 1943 and gives away Kedah, Perlis, Kelantan and Terengganu, which were not his.|date 1943-7
sirat|Si Rat Malai|malaystates|core Kota Bharu; ig devout -2|The four sultans keep their thrones under a Thai commissioner.|req own Kota Bharu
railwaydeath|The Railway to Burma|alliance|infra 1; legit -3; smseri 3 ?? Lend the land and look away => rel JAP 6; legit -3 // Protest the treatment of the labourers => rel JAP -8; legit 2|Four hundred and fifteen kilometres from Ban Pong to Thanbyuzayat, built by prisoners of war and Asian labourers. A life for every sleeper.|date 1942-9
banpong|The Ban Pong Incident|railwaydeath|ws 2 ?? Punish the Thai police => rel JAP 6; stab -3; smseri 4 // Stand by them => rel JAP -10; legit 3|December 1942: a Japanese soldier slaps a monk; labourers and police attack the camp.|date 1942-12
greaterasia|The Greater East Asia Conference|malaystates|infl 10 ?? The Leader goes himself => rel JAP 10; smbend 10; legit -2 // Send Prince Wan => rel JAP -5; smseri 4; smcred 5|November 1943: Tōjō gathers the leaders of free Asia in Tokyo. The Leader pleads illness and sends a prince.|date 1943-11
doublegame|The Double Game|greaterasia|smseri 8; pp 15|The Leader lets it be known in Chongqing that his army will turn on the Japanese when the Chinese come down from Yunnan.|req bendmax 60
leaderfalls|The Leader Falls|doublegame|pp 20; stab 2; smseri 10; ideo dem 5|24 July 1944: the Assembly votes down the Phetchabun bill and the Buddhist City bill. The Field Marshal resigns, expecting to be asked back.|date 1944-7; req cf th_passage
khuangwar|Khuang's War Cabinet|leaderfalls|leader Khuang Aphaiwong/Progressive; legit 4; smseri 8|A Prime Minister who jokes with the Japanese ambassador in the morning and hides American officers in the afternoon.|
underjapan|The Guest Who Stays|alliance|money -2; stab -2; spirit Japanese Garrison: stab -3, tax -.04, def .04|Fifty thousand Japanese soldiers, paid in baht the treasury must lend. They are polite, and they are everywhere.|
rising|The Rising That Was Ready|secretfields,khuangwar|ws 6; axp 5; units mil 4|Fifty thousand armed men wait for the word from Kandy. Mountbatten asks them to wait a little longer, and then the bomb falls.|req seri 60
allied|Thailand With the Allies|resist|faction Allies; rel ENG 20, USA 20; equip arms 200|The only independent state of South-East Asia fights beside Malaya and Burma.|req notwar ENG
khoratredoubt|The Khorat Redoubt|resist|fort Korat, Chiang Mai; capital Korat; spirit Fighting Retreat: def .08, caplimit .15|Bangkok cannot be held against a fleet. The government and the gold go up the railway to the plateau.|
burmaroad|The Road to Burma|allied|rel ENG 10; infra 1; units inf 1|If the south is lost the army can still fall back on Kengtung and the British.|
peace46|The Peace with Britain|peaceprocl,unseat|rel ENG 15; money -3 ?? Deliver the rice => money -3; rel ENG 10 // Haggle => rel ENG -5; money 1|January 1946: a million and a half tons of rice, free, and the Malay and Shan states returned. Washington talks London out of the rest.|date 1946-1
returnland|The Provinces Returned|peace46|rel FRA 15; legit -2; ws -4|The Tokyo Convention is annulled. The four provinces of 1941 go back to Indochina, and the monument to the victory stays where it is.|date 1946-11
warcrimes|The War Criminals Act|peace46|legit 3 ?? Try the Field Marshal => legit 3; ig army -6; ideo dem 3 // The court finds the law retroactive => ig army 4; stab 2|The Leader spends five months in a cell before the Supreme Court sets him free.|date 1945-10
greaterthai|The Great Thai Kingdom|saharat,sirat,newprovinces|spirit Maha Anachak Thai: ws 5, legit 4, stab 2; claim Mandalay, Penang|From the Salween to the Mekong and down to the Perak frontier: the map on the schoolroom wall is the map of the kingdom.|
`);

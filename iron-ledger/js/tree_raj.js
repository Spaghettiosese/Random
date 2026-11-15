// The British Raj (2.3): hand-written. The Viceroy's India under the Act of 1935; Congress and the Muslim League, the
// princes and the road to independence, worked through the Raj's system (nations23.js); the Indian Army from Keren to
// Kohima; the war economy and the Bengal famine; the war in the east; and other Indias: Bose's Azad Hind at the Axis's
// side, a loyal Dominion, a united Union of India, a partitioned subcontinent and a Communist India.
'use strict';
TREES.RAJ = autoTree('rj_', `
# The Government of India
act1935|The Government of India Act||pp 25; rjself 5|The longest act Parliament ever passed: elected ministries in the provinces, a federation that may never come.|ai 6
linlithgow|Lord Linlithgow|act1935|stab 3; ig army 3|The tall, dour Scottish Viceroy rules from the new capital of Lutyens.|
elections37|The Provincial Elections of 1937|act1935|rjself 5; rjcong 5; legit 3|Thirty million voters; Congress wins eight provinces of eleven.|date 1937-2
ministries|The Congress Ministries|elections37|rjself 5; stab 2; ig union 3|Congress governs Madras, Bombay, the United Provinces and five more: prohibition, debt relief and Gandhi's basic education.|
ics|The Steel Frame|linlithgow|stab 2; spirit Indian Civil Service: tax .03, stab 1|A thousand British officers of the ICS govern three hundred million people.|
indianisation|Indianise the Services|ics|rjself 4; legit 3|More Indians in the ICS and the officer corps every year.|
federation|The Federation Plan|act1935|rjprinces 5; pp 10 ?? Press the princes to join => rjprinces -5; rjself 5 // Let it lapse => rjprinces 5|An all-India federation of provinces and princely states, if half the princes accede. They never do.|
newdelhi|The New Capital|linlithgow|stab 2; infl 10|Lutyens's Delhi, finished in 1931: the Viceroy's House is bigger than Versailles.|
waraims|Declare War for India|linlithgow|ws 5; rjcong 10 ?? Declare without consulting the Indian leaders => ws 5; rjcong 8 // Consult them first => rjself 5; pp -20|September 1939: the Viceroy declares India at war without asking a single Indian.|req engAtWar
resign|The Congress Ministries Resign|waraims,ministries|rjcong 8; rjself -5; cflag congResign|October 1939: in protest, every Congress ministry leaves office.|req engAtWar
augustoffer|The August Offer|resign|rjself 5; rjcong -3; rjleague 4|1940: more Indians on the Viceroy's council and a promise of Dominion status after the war.|date 1940-8
expanded|The Expanded Council|augustoffer|rjself 5; pp 15|Indians become a majority of the Viceroy's Executive Council.|date 1941-7
cripps|The Cripps Mission|expanded|rjself 15; rjcong -5 ?? Accept the offer => rjself 10; rjcong -10 // Reject it as a post-dated cheque => rjcong 8|March 1942: Stafford Cripps offers Dominion status after the war, with the right of provinces to opt out.|date 1942-3
wavell|Lord Wavell|cripps|stab 3; rjself 5|October 1943: the soldier-viceroy, who wants to end the deadlock.|date 1943-10
simla|The Simla Conference|wavell|rjself 10; rjleague 5|June 1945: an all-Indian council is proposed; Jinnah insists on naming every Muslim member, and it fails.|date 1945-6
elections46|The Elections of 1946|simla|rjcong 5; rjleague 10; rjself 10|Congress sweeps the general seats; the League wins almost every Muslim one.|date 1945-12
cabinetmission|The Cabinet Mission|elections46|rjself 15; rjleague -5|1946: three British ministers propose a loose union of three groups of provinces.|date 1946-3
interim|The Interim Government|cabinetmission|rjself 15; pp 30|September 1946: Nehru heads a government of Indians in Delhi.|date 1946-9
mountbatten|Lord Mountbatten|interim|rjself 10; stab 2|March 1947: the last Viceroy, with orders to leave by June 1948. He leaves sooner.|date 1947-2
governorsrule|Governor's Rule|resign|stab 2; rjcong 3; pp 10|Section 93: with the ministries gone, the governors rule the Congress provinces by decree.|
dir|The Defence of India Rules|waraims|stab 3; rjunrest -5; legit -3|Detention without trial, censorship and the power to ban any meeting.|req engAtWar
ambedkar|Ambedkar Joins the Council|expanded|rjself 3; ig union 4; legit 3|1942: B. R. Ambedkar, leader of the Depressed Classes, becomes the Labour Member.|date 1942-7
depressed|The Depressed Classes|ambedkar|stab 2; spirit Reserved Seats: legit 2|Seats and posts reserved for the untouchable castes, by the Poona Pact of 1932.|
rbi|The Reserve Bank of India|act1935|spirit Reserve Bank: invest .05; money 2|1935: a central bank for the rupee, in Bombay.|
simlasummer|The Summer Capital|newdelhi|stab 1|Every April the government moves up to Simla, seven thousand feet above the heat.|
waziristan|The Waziristan Campaign|linlithgow|axp 10; rjunrest 3|1936 to 1939: forty thousand troops chase the Faqir of Ipi through the tribal hills.|date 1936-11
ipi|The Faqir of Ipi|waziristan|ws 2; units mtn 1 ?? Bomb the villages => rjunrest 5; axp 5 // Pay the tribes => money -3; rjunrest -3|A holy man the British never catch, who fights them until they leave.|
afghan|The Afghan Frontier|waziristan|rel AFG 10; stab 1|The Durand Line and the King of Afghanistan's neutrality.|
extended|The Viceroy's Term Extended|augustoffer|stab 2; pp 10|Linlithgow stays for seven and a half years, the longest of any viceroy.|
khizar|Khizar Hayat Tiwana|elections46|rjleague -4; stab 2|1946: the Unionist premier holds the Punjab with Congress and Sikh support against the League.|date 1946-3
khizarfalls|Khizar Resigns|khizar|rjleague 6; rjunrest 6|March 1947: the last coalition of the Punjab falls, and the province burns.|date 1947-3
officersincouncil|An Indian War Member|expanded|ig army 3; rjself 2|An Indian joins the council for defence matters.|date 1942-7
# The Congress
congress|The Indian National Congress||rjcong 5; legit 2|The party of Gandhi and Nehru: four million members and a national movement.|ai 5
gandhi|The Mahatma|congress|stab 2; rjcong 5; spirit Satyagraha: stab 2, ws -4|The half-naked fakir, Churchill calls him. He has the whole country behind him.|
nehru|Jawaharlal Nehru|congress|res 10; rjcong 5|The Harrow-educated socialist, Congress president in 1936 and 1937.|
patel|Vallabhbhai Patel|congress|stab 3; rjcong 4|The Iron Man of the party machine, who will unite the princely states.|
boseprez|Bose Elected President|nehru|rjcong 5; rad 0.03|1938: Subhas Chandra Bose wins the Congress presidency at Haripura, and again at Tripuri over Gandhi's candidate.|date 1938-2
basiced|Basic Education|ministries,gandhi|spirit Wardha Scheme: literacy .03|Gandhi's plan: children learn through spinning and crafts in their own language.|
prohibition|Prohibition|ministries|stab 2; money -2|The Congress provinces close the liquor shops.|
debtrelief|Debt Relief|ministries|ig rural 6; ig land -4|Laws against the moneylenders in the United Provinces and Bihar.|
satyagraha40|Individual Satyagraha|resign|rjcong 6; rjunrest 5|1940: one by one, chosen volunteers make anti-war speeches and are arrested.|date 1940-10
planning|The National Planning Committee|nehru|res 10; spirit National Planning: growth .02|Nehru's committee plans an industrial India before there is an India to plan.|
quitindia|Quit India|satyagraha40,cripps|rjcong 15; rjunrest 30; stab -8|August 1942: "Do or die." The leaders are arrested before dawn, and the country rises.|date 1942-8
augustrev|The August Revolution|quitindia|rjunrest 15; units mil 1|Railways cut, police stations burnt, parallel governments in Satara and Midnapore.|
releaseleaders|Release the Leaders|quitindia|rjunrest -15; rjcong 5; rjself 5|1944 and 1945: Gandhi, then the Working Committee, are released.|date 1944-5
inatrials|The INA Trials|releaseleaders|rjcong 10; rjunrest 10; ig army -5|1945: three officers of Bose's army are tried at the Red Fort, and the whole country takes their side.|date 1945-11
navalmutiny|The Naval Mutiny|inatrials|rjunrest 10; rjself 10|February 1946: the ratings of the Royal Indian Navy mutiny in Bombay.|date 1946-2
tryst|A Tryst with Destiny|mountbatten,navalmutiny|rjindep|15 August 1947: at the stroke of the midnight hour, India awakes to life and freedom.|req self 80
constitution|The Constitution of India|tryst|law parliamentary, universal; legit 10|1950: a republic, with Ambedkar's constitution and the vote for every adult.|date 1949-11
gandhideath|Gandhi Is Killed|tryst|stab -8; rad -0.04|30 January 1948: a Hindu nationalist shoots the Mahatma at a prayer meeting. The RSS is banned.|date 1948-1
refugees|Refugee Rehabilitation|tryst|build urban 1; stab 2|Camps and new towns for the millions from Punjab and Bengal.|
iit|The Institutes of Technology|firstplan|res 20|1951: the first Institute of Technology opens at Kharagpur.|date 1951-8
ceasefire|The Kashmir Ceasefire|kashmirwar|stab 2; ws -3|1 January 1949: the United Nations draws a line across the valley.|date 1948-12
republicday|Republic Day|constitution|legit 5; stab 2|26 January 1950: India becomes a republic within the Commonwealth.|date 1950-1
firstplan|The First Five-Year Plan|constitution|build farm 2, power 1; spirit First Plan: growth .03|1951: dams, canals and fertiliser for the villages.|date 1951-4
haripura|The Haripura Session|boseprez|rjcong 4; ideo dem 2|February 1938: Bose calls for planning and for war on the Empire when it comes.|date 1938-2
tripuri|The Tripuri Crisis|haripura|rjcong -3 ?? Back Gandhi's man => stab 2 // Back Bose => rjcong 3; rad 0.02|1939: Bose is re-elected against Gandhi's wishes and is forced to resign.|date 1939-3
khadi|Khadi|gandhi|build textile 1; stab 1|Hand-spun cloth: the uniform of the nation and a boycott of Lancashire.|
harijan|Against Untouchability|gandhi|legit 3; stab 1|Gandhi calls the untouchables Harijans, children of God, and opens temples to them.|
discovery|The Discovery of India|nehru|res 10; legit 2|In Ahmednagar Fort, in prison, Nehru writes the history of his country.|date 1944-4
csp|The Congress Socialist Party|nehru|ideo com 2; ig union 4|Jayaprakash Narayan's socialists inside Congress.|
jpescape|Jayaprakash Escapes|augustrev|rjunrest 5; rjcong 3|November 1942: JP escapes from Hazaribagh jail and leads the underground.|date 1942-11
congressradio|The Secret Congress Radio|augustrev|rjcong 3; pp -5|Usha Mehta broadcasts from secret transmitters in Bombay.|
satara|The Parallel Government at Satara|augustrev|rjunrest 5; units mil 1|The Prati Sarkar runs its own courts and police for three years.|
rajaji|The Rajaji Formula|releaseleaders|rjleague 3; rjcong -2; rjself 3|1944: Rajagopalachari proposes a plebiscite in the Muslim-majority districts.|date 1944-3
gandhijinnah|The Gandhi-Jinnah Talks|rajaji,pakistan|rjself 3; stab 2|September 1944: eighteen days of talks at Jinnah's house in Bombay, and no agreement.|date 1944-9
kasturba|Kasturba Dies|releaseleaders|stab -1; rjcong 4|February 1944: Gandhi's wife dies in detention at the Aga Khan Palace.|date 1944-2
manifesto|The Election Manifesto|elections46|rjcong 4|Congress promises planning, land reform and a united India.|
wardha|The Wardha Resolution|resign|rjcong 3; rjself 2|Congress will help the war if India is made free first.|date 1939-9
kripalani|Acharya Kripalani|patel|rjcong 2; stab 1|The general secretary who keeps the party's machinery running through the arrests.|
naidu|Sarojini Naidu|gandhi|rjcong 3; legit 2|The Nightingale of India, the first Indian woman to preside over Congress.|
constructive|The Constructive Programme|khadi|stab 2; build farm 1|Village industries, sanitation and hand-spinning: Gandhi's alternative to politics.|
# The Muslim League
league|The Muslim League||rjleague 5|The party of the Muslim landlords and lawyers, beaten in the elections of 1937.|ai 4
jinnah|Mohammad Ali Jinnah|league|rjleague 8; legit 2|The Quaid-i-Azam, an elegant lawyer who once worked for Hindu-Muslim unity.|
masscontact|Muslim Mass Contact|jinnah|rjleague 6|After 1937 the League reaches beyond the landlords to the villages.|
deliverance|The Day of Deliverance|resign|rjleague 6; rjcong -2|December 1939: Jinnah celebrates the end of the Congress ministries.|
lahore|The Lahore Resolution|masscontact,deliverance|rjleague 10|March 1940: independent states in the Muslim-majority north-west and east. The press calls it Pakistan.|date 1940-3
leagueministries|League Ministries|lahore|rjleague 6; stab 1|With Congress out of office, the League forms governments in Sind, Bengal and the Frontier.|
pakistan|The Pakistan Demand|leagueministries|rjleague 10; rjunrest 5|By 1945 the League speaks for most Muslims, and asks for nothing less than Pakistan.|
directaction|Direct Action Day|pakistan,cabinetmission|rjleague 10; rjunrest 25; stab -10 ?? Call out the army in Calcutta => rjunrest -10; ig army 3 // Leave it to the provinces => rjunrest 10|August 1946: the League's day of protest ends in the Great Calcutta Killings.|date 1946-8
partition|Partition|directaction|rjleague 10; rjindep|August 1947: two dominions, a border drawn in five weeks, and ten million on the move.|req league 55 & self 75
radcliffe|The Radcliffe Line|partition|stab -6; legit -4|A lawyer who has never been to India draws the line through Punjab and Bengal.|
kashmirwar|The Kashmir War|radcliffe|ws 10; dig 365 Srinagar; units inf 2|October 1947: tribesmen invade Kashmir; the Maharaja accedes to India; the armies of two new states fight.|date 1947-10
unionist|The Unionist Party of the Punjab|league|rjleague -5; stab 3|Sikander Hayat Khan's party of Muslim, Hindu and Sikh landlords keeps the Punjab together.|
khudai|The Red Shirts of the Frontier|congress|rjcong 4; rjleague -3|Abdul Ghaffar Khan's non-violent Pathans side with Congress.|
sikander|The Sikander-Jinnah Pact|jinnah|rjleague 4; stab 1|1937: the Punjab premier brings his Muslims into the League, but keeps his province to himself.|date 1937-10
huq|Fazlul Huq|masscontact|rjleague 3|The Bengal premier who moved the Lahore Resolution, and quarrels with Jinnah after.|
liaquat|Liaquat Ali Khan|jinnah|rjleague 4; pp 10|The League's general secretary and Jinnah's right hand.|
dawn|The Dawn|liaquat|rjleague 3; pp 5|Jinnah's newspaper, published in Delhi from 1941.|date 1941-10
nationalguard|The League National Guards|pakistan|rjleague 3; rjunrest 3|Uniformed volunteers for the League's meetings and marches.|
aligarh|The Students of Aligarh|lahore|rjleague 4|The Muslim University's students take the Pakistan idea to the villages.|
ispahani|The League's Treasurers|liaquat|money 2; rjleague 2|Merchant families of Calcutta and Bombay finance the movement.|
pakistanday|Pakistan Day|lahore|rjleague 4; ws 1|The 23rd of March is celebrated by the League every year.|
nwfpreferendum|The Frontier Referendum|partition|rjleague 3; stab -1|July 1947: the North-West Frontier votes to join Pakistan; the Red Shirts boycott it.|date 1947-7
# The Princes
princes|The Chamber of Princes||rjprinces 5|Five hundred and sixty-five rulers of states great and small, bound to the Crown by treaty.|ai 5
nizam|The Nizam of Hyderabad|princes|money 4; rjprinces 3|The richest man in the world rules a state the size of Italy.|
mysore|Mysore|princes|build tools 1, power 1|The model state of Sir Mirza Ismail: dams, silk and the Bangalore factories.|
kashmir|The Maharaja of Kashmir|princes|rjprinces 2|A Hindu prince over a Muslim people, in the most beautiful valley in India.|
travancore|Travancore|princes|spirit Travancore Schools: literacy .03|The most literate state in India, where temples open to all castes in 1936.|date 1936-11
baroda|Baroda|princes|build textile 1; money 2|The Gaekwad's progressive state: free schools and a public library in every village.|
statelevies|The State Forces|princes|units inf 2; rjprinces -3|The princes' own regiments serve the Crown in the war.|req engAtWar
princesloyal|Loyal Princes|statelevies|rjprinces 10; money 3|The princes give money, aircraft and men.|
paramountcy|The End of Paramountcy|interim|rjprinces -10; rjself 5|With the British going, the princes' treaties lapse. They must choose.|
accession|The Instrument of Accession|paramountcy,patel|rjprinces 5; stab 3|V. P. Menon's single page: defence, foreign affairs and communications to the new India.|date 1947-6
integration|The Integration of the States|accession|core Hyderabad, Mysore, Jaipur, Baroda, Gwalior, Bhopal, Indore, Jodhpur, Bikaner, Trivandrum|Patel and Menon merge five hundred states into a dozen unions in two years.|
polo|Operation Polo|integration|ws 4; stab 2|September 1948: the army enters Hyderabad; the Nizam surrenders in four days.|date 1948-9
bhopal|The Nawab of Bhopal|princes|rjprinces 3; rjleague 2|The Chancellor of the Chamber of Princes wants the princes kept apart from both new states.|
patiala|The Maharaja of Patiala|princes|units inf 1; rjprinces 3|The Sikh prince whose state troops fight in every theatre.|
gwalior|Gwalior|princes|money 2|The Scindia's great state in central India.|
bikaner|The Bikaner Camel Corps|statelevies|units cav 1; rjprinces 2|The Ganga Risala, camels in the desert war of the Empire.|
jaipur|Jaipur|princes|build construction 1|Sir Mirza Ismail comes from Mysore to modernise the pink city.|
junagadh|Junagadh|accession|ws 2; stab 1|1947: the Nawab accedes to Pakistan; his Hindu subjects and the Indian army reverse it.|date 1947-9
travancoreindep|Travancore's Independence Bid|paramountcy|rjprinces 3; stab -2|Sir C. P. Ramaswami Aiyar declares Travancore independent. A stabbing changes his mind.|date 1947-6
razakars|The Razakars|nizam|rjunrest 5; rjprinces -3|The Nizam's militia of Qasim Razvi terrorises Hyderabad's villages.|date 1947-8
kashmiraccession|The Kashmir Accession|kashmir,accession|ws 5; stab -2|October 1947: with tribal raiders at the gates of Srinagar, the Maharaja signs.|date 1947-10
# The Indian Army
indianarmy|The Indian Army||units inf 2; ig army 4|Two hundred thousand regulars, the largest volunteer army in the world.|ai 6
indianisedofficers|Indian Officers|indianarmy|axp 5; rjself 3|King's commissions for Indians; Cariappa will command the army one day.|
expansion|Expand the Army|indianarmy|units inf 4; mp 100|Two and a half million volunteers by 1945.|req engAtWar
modernise|The Chatfield Report|indianarmy|tech m_mot; equip autos 50|1939: the army is to be motorised and given modern weapons.|date 1939-1
fourthdiv|The 4th Indian Division|expansion|units inf 1; axp 5|The Red Eagles fight at Sidi Barrani, Keren and Cassino.|
keren|Keren|fourthdiv|axp 10; ws 3|March 1941: Indian and British troops storm the mountain fortress of Eritrea.|date 1941-2
fifthdiv|The 5th Indian Division|expansion|units inf 1|The Ball of Fire division: Eritrea, the desert and Imphal.|
desert|The Western Desert|fourthdiv|axp 5; rel ENG 10|Indian brigades with the Eighth Army at Gazala and El Alamein.|req atwar ITA
cassino|Monte Cassino|desert|axp 10|1944: Indian troops at the monastery hill.|date 1944-2
italy|The Italian Front|cassino|axp 5; units inf 1|Three Indian divisions fight the length of Italy.|
gurkhas|The Gurkha Regiments|indianarmy|units mtn 2; rel NEP 10|Nepal's soldiers, the bravest of the brave.|
paratroops|The 50th Parachute Brigade|expansion|units inf 1; axp 5|Indian paratroops hold the line at Sangshak before Kohima.|date 1944-3
rin|The Royal Indian Navy|indianarmy|build shipyard 1; spirit Royal Indian Navy: navy .03|Sloops and minesweepers for the coasts and the convoys of the Indian Ocean.|
riaf|The Royal Indian Air Force|indianarmy|build aircraftp 1; tech m_air1|Hurricanes and Vengeance dive-bombers over Burma.|
fourteenth|The Fourteenth Army|expansion|generals William Slim/4/def; axp 10|The forgotten army of Slim: Indians, Britons, Africans and Gurkhas.|req atwar JAP
arakan|The First Arakan|fourteenth|axp 5; ws -3|1943: an offensive on the coast of Burma fails in the jungle.|date 1943-1
admin|The Admin Box|arakan|axp 10; ws 4|February 1944: surrounded troops hold and are supplied by air; the Japanese are beaten.|date 1944-2
imphal|Imphal and Kohima|admin|dig 365 Imphal, Kohima; axp 15; ws 6|April 1944: the decisive battle; on the tennis court at Kohima the lines are a few yards apart.|date 1944-3
meiktila|Meiktila and Mandalay|imphal|axp 10; claim Mandalay|1945: across the Irrawaddy; Rangoon before the monsoon.|date 1945-1
chindits|The Chindits|fourteenth|units inf 1; axp 5|Wingate's brigades go behind the Japanese lines, supplied by air.|date 1943-2
victorycross|Thirty-One Victoria Crosses|imphal,keren|ws 5; legit 3|The Indian Army's honour roll of the war.|
cariappa|K. M. Cariappa|indianisedofficers|generals K. S. Thimayya/3/inf; axp 5|The first Indian to command a battalion; Thimayya leads a brigade in Burma.|
punjabis|The Punjabi Regiments|expansion|units inf 2; mp 40|The Punjab gives a third of the army's soldiers.|
sikhs|The Sikh Regiments|punjabis|units inf 1; axp 3|Sikhs in every theatre of the war.|
sappers|The Madras Sappers|expansion|units inf 1; tech m_fort|The Queen Victoria's Own sappers and miners build the roads of Burma.|
malaya|The 11th Division in Malaya|expansion|axp 5; ws -3|December 1941: Jitra and Slim River; the division is destroyed in the retreat to Singapore.|req atwar JAP
singaporefall|The Fall of Singapore|malaya|ws -5; rjunrest 5|February 1942: forty-five thousand Indian soldiers are taken prisoner.|date 1942-2
paiforce|Persia and Iraq Force|fifthdiv|axp 5; rel IRQ -10, PER -10|1941: Indian divisions occupy Iraq and Persia to secure the oil and the road to Russia.|date 1941-5
syria|The Syrian Campaign|paiforce|axp 5|June 1941: against Vichy France in the Levant.|date 1941-6
ambaalagi|Amba Alagi|keren|axp 5; rel ETH 10|May 1941: the Duke of Aosta surrenders on the mountain.|date 1941-5
auchinleck|Auchinleck in India|fourteenth|generals Claude Auchinleck/4/log; axp 5|The Auk, Commander-in-Chief India, builds the base for the reconquest of Burma.|date 1943-6
waci|The Women's Auxiliary Corps|expansion|mp 10; spirit WAC India: manpower .02|Indian women in uniform as signallers, clerks and drivers.|date 1942-4
civilaid|Aid to the Civil Power|quitindia|rjunrest -10; ig army 3; legit -3|Fifty-seven battalions are used to put down the Quit India rising.|
pioneers|The Indian Pioneer Corps|expansion|mp 30; infra 1|Labour battalions build the roads, airfields and railways of the war.|
signals|The Indian Signal Corps|expansion|tech m_radio; axp 3|Wireless and telephone for an army spread across three continents.|
mules|The Animal Transport Companies|pioneers|equip autos 20; infra 1|Mules on the hill tracks of Burma, where no truck can go.|
tenthdiv|The 10th Indian Division|paiforce|units inf 1; axp 5|From Iraq to Italy under the Persian Gulf command.|
# The War Economy
economy|The War Economy||money 3|India pays for its own defence, and for Britain's war in the east.|req engAtWar; ai 5
tata|Tata Steel|economy|build steel 2; ig ind 4|Jamshedpur makes the steel for the Eastern Group's armies.|
egsc|The Eastern Group Supply Council|economy|build arms 1, textile 1; rel AST 5, NZL 5|1940: India, Australia and the other Dominions east of Suez supply each other's armies.|date 1940-10
hal|Hindustan Aircraft|tata|build aircraftp 1; res 10|1940: Walchand Hirachand's factory in Bangalore repairs and builds aircraft.|date 1940-12
ordnance|The Ordnance Factories|egsc|build arms 1, artyf 1|Rifles, shells and boots from the government factories.|
jute|The Jute Mills of Calcutta|economy|money 3; build textile 1|Sandbags for every army in the world.|
textilesbombay|The Mills of Bombay and Ahmedabad|economy|build textile 2|Cotton cloth for uniforms, and fortunes for the mill owners.|
coalbihar|The Coalfields of Bihar|tata|build coalm 1|Jharia's coal for the railways and the steelworks.|
railways|The Railways|economy|infra 1; build railway 1|Forty thousand miles of line, worn out by the war.|
sterling|The Sterling Balances|economy|money 6; rjself 3|Britain pays for India's war in IOUs; by 1945 London owes India a billion pounds.|
inflation|Wartime Inflation|sterling|inflx 5 ?? Print money => money 6; inflx -3 // Tax and borrow => stab -1|Prices triple: the poor go hungry while profits soar.|
bombayplan|The Bombay Plan|tata,planning|spirit Bombay Plan: growth .03, output .02|1944: India's industrialists propose a fifteen-year plan of state-led industry.|date 1944-1
famine|The Bengal Famine|inflation|rjunrest 10; stab -6|1943: rice prices quadruple; three million die.|date 1943-5
relief|Famine Relief|famine|relief Calcutta, Dacca, Chittagong; money -8; rjunrest -8|Wavell sends the army to move grain to the villages, too late for millions.|
foodzones|Food Rationing|relief|stab 3; spirit Rationing: needs -.03|Rationing in the cities and controls on the grain trade.|
groundnuts|The Grow More Food Campaign|foodzones|build farm 2|Every acre into food.|
blackmarket|The Black Market|inflation|money 2; stab -2|Grain hoarded by merchants sells at any price.|
clothcontrol|Cloth Control|textilesbombay|stab 2; spirit Standard Cloth: needs -.02|Standard cloth at fixed prices for the poor.|
saltax|The Salt Tax|economy|money 3 ?? Keep it => money 3; rjcong 3 // Abolish it => stab 2; rjcong -3|The tax Gandhi marched against in 1930 still fills the treasury.|
canals|The Punjab Canals|groundnuts|build farm 1; ig rural 3|The canal colonies feed the army.|
bhakra|The Bhakra Dam Plan|canals|build power 1, farm 1|A great dam on the Sutlej, planned before independence.|date 1945-1
airindia|Air India|hal|infra 1; money 2|1946: Tata Airlines becomes Air India.|date 1946-7
hindustanmotors|Hindustan Motors|hal|build autos 1|1942: the Birlas found a car factory near Calcutta.|date 1942-5
scindia|The Vizagapatam Shipyard|jute|build shipyard 1|1941: the Scindia company's yard builds the first Indian ocean-going ships.|date 1941-6
tea|The Tea Gardens of Assam|economy|money 3; build plantation 1|The gardens supply the army's tea, and their labourers build the Ledo road.|
sugar|The Sugar of the United Provinces|economy|build farm 1; money 1|Mills in the cane fields of the Ganges plain.|
isi|The Indian Statistical Institute|bombayplan|res 15|Mahalanobis's institute in Calcutta: sampling, surveys and the arithmetic of planning.|
cottonexports|Cotton for the Empire|textilesbombay|money 3|Raw cotton and cloth for the armies of the Middle East.|
# The War in the East
east|The Eastern Frontier||ws 3|Burma, the Bay of Bengal and the hills of Assam: India's front door.|req atwar JAP; ai 5
assamdefence|Defend Assam|east|dig 9999 Gauhati, Imphal; units inf 2|The army digs in on the hills between Burma and India.|
calcuttaraids|The Calcutta Raids|east|stab -2; dig 365 Calcutta|December 1942: Japanese bombers over Calcutta; half a million flee.|date 1942-12
ceylon|The Easter Sunday Raid|east|ws 3; rel ENG 5|April 1942: Nagumo's carriers raid Colombo and Trincomalee.|date 1942-4
hump|The Hump|assamdefence|rel USA 15, CHI 15; infra 1|Airfields in Assam fly supplies over the Himalayas to China.|date 1942-6
ledo|The Ledo Road|hump|rel USA 10, CHI 10; build railway 1|American engineers cut a road through the jungle to China.|date 1943-1
stilwell|Vinegar Joe|ledo|rel USA 10|Stilwell's Chinese divisions advance through northern Burma.|
andamans|The Andamans|east|stab -1|March 1942: the Japanese occupy Port Blair.|date 1942-3
burmaretreat|The Retreat from Burma|east|ws -4; rjunrest 5|1942: the longest retreat in British history; half a million refugees walk to India.|date 1942-3
americans|The Americans in India|hump|money 4; rel USA 10|A quarter of a million GIs pass through India.|
victoryburma|Rangoon|meiktila|ws 6; rel ENG 10|May 1945: Rangoon is retaken from the sea.|date 1945-5
madraspanic|The Madras Evacuation|ceylon|stab -2|April 1942: the government leaves Madras in a panic when the Japanese fleet appears.|date 1942-4
chittagongdef|Defend Chittagong|calcuttaraids|dig 9999 Chittagong; units inf 1|The port at the edge of the Burma front.|
secondarakan|The Second Arakan|admin|axp 5|1944: the offensive on the coast succeeds.|date 1944-1
dracula|Operation Dracula|victoryburma|ws 3|May 1945: the amphibious assault on Rangoon finds the Japanese gone.|date 1945-5
andamansfree|The Andamans Liberated|andamans|legit 2|October 1945: the islands are reoccupied.|date 1945-10
vforce|V Force|assamdefence|units inf 1; rel ENG 5|Naga and Kuki scouts watch the hills ahead of the army.|date 1942-6
silchar|The Silchar Track|assamdefence|infra 1|A road through the hills to Imphal, built by hand.|
# Subhas Chandra Bose
bose|Netaji||rad 0.03; rjcong 3|Subhas Chandra Bose wants independence now, from anyone who will help.|ai 1
forwardbloc|The Forward Bloc|bose|rjcong -3; rjunrest 5|1939: Bose leaves Congress and founds his own party.|date 1939-5
escape|The Great Escape|forwardbloc|rel GER 10|January 1941: Bose slips out of house arrest in Calcutta, disguised as a Pathan, and reaches Berlin.|date 1941-1
freeindiacentre|The Free India Centre|escape|rel GER 10, JAP 10|Azad Hind Radio broadcasts from Berlin; an Indian Legion is raised from prisoners.|
submarine|The Submarine Voyage|freeindiacentre|rel JAP 20|1943: from a German U-boat to a Japanese one off Madagascar: Bose comes to Asia.|date 1943-2
ina|The Indian National Army|submarine|units inf 3; rel JAP 15|Forty thousand Indian prisoners of war take up arms against the British.|req atwar JAP
azadhind|Azad Hind|ina|setIdeo fas; leader Subhas Chandra Bose/Azad Hind; free; rel JAP 30, ENG -50|The Provisional Government of Free India declares war on Britain from Singapore.|req stab 30 & atwar JAP; mx dominion, unionindia, redindia
chalodelhi|Chalo Delhi|azadhind|ws 15; units inf 2|On to Delhi! The INA marches with the Japanese towards Imphal.|
axisindia|Join the Co-Prosperity Sphere|chalodelhi|join JAP|Free India becomes an ally of Japan.|req war
legion|The Free India Legion|freeindiacentre|units inf 1|Indian prisoners in German uniform, sent to guard the Atlantic coast.|date 1942-1
rani|The Rani of Jhansi Regiment|ina|units inf 1; legit 2|A women's regiment under Lakshmi Swaminathan.|date 1943-10
azadbank|The Azad Hind Bank|azadhind|money 4|The expatriates of Malaya and Burma fund the provisional government.|
taipei|The Last Flight|chalodelhi|stab -2; rjcong 5|August 1945: Bose dies in a plane crash at Taipei, and few believe it.|date 1945-8
andamansgift|The Andamans to Azad Hind|azadhind|legit 2; ws 2|November 1943: Japan hands the Andamans to the Provisional Government, in name.|date 1943-11
inaimphal|The INA at Imphal|chalodelhi|units inf 1; ws 3|1944: INA regiments fight beside the Japanese on the Imphal front.|date 1944-3
# A Loyal Dominion
loyal|The Jewel in the Crown||rjprinces 5; ws 3|The Raj can still be a partner of the Empire, if it is given its due.|ai 1
statusoffer|The Dominion Status Offer|loyal|rjself 10; rel ENG 10|A promise of Dominion status like Canada's, made good.|
dominion|The Dominion of India|statusoffer|rjself 25; rel ENG 20; stab 4|India becomes a Dominion within the Commonwealth, with its princes and its provinces in one federation.|req self 50 & year 1944; mx azadhind, unionindia, redindia
commonwealthpartner|A Commonwealth Partner|dominion|join ENG; rel AST 10, CAN 10|India stands with the Commonwealth as an equal.|
federalindia|The Federal Constitution|dominion|rjprinces 10; rjleague -5; law parliamentary|The federation of 1935, at last: provinces and princes together.|
warsupport|India Fights for the Empire|loyal|ws 6; rjprinces 3; rel ENG 10|Two and a half million volunteers: the largest army in history raised without conscription.|
indiansecretary|An Indian Secretary of State|statusoffer|rjself 5; rel ENG 5|An Indian at the India Office in London.|
imperialpartner|Imperial Preference|commonwealthpartner|trade ENG, AST, CAN; money 3|The trade of the Commonwealth, on equal terms.|
dominionnavy|A Dominion Navy|dominion|build shipyard 1; spirit Indian Navy: navy .04|The Royal Indian Navy becomes the navy of a Dominion.|
# One India
oneindia|One India||rjcong 5; rjleague -3|A single India from the Khyber to Chittagong, as Congress demands.|ai 1
unity|Hindu-Muslim Unity|oneindia|rjleague -8; rjcong 3; stab 2|Maulana Azad, a Muslim president of Congress, argues for one nation.|
unionindia|The Union of India|unity|rjindep; rjself 20; stab -4|Independence without partition: a united India of three great groups of provinces.|req self 70 & cong 60; mx azadhind, dominion, redindia
nonaligned|Non-Alignment|unionindia|infl 30; spirit Non-Aligned: stab 2, infl .15|Neither East nor West: Nehru's foreign policy.|
azad|Maulana Azad|oneindia|rjleague -3; stab 1|The Congress president through the war, a Muslim scholar who refuses partition.|
groups|Groups of Provinces|unity|rjleague -3; rjself 5|The Cabinet Mission's plan, accepted in full: three groups and one centre.|
gandhicampaign|Gandhi Walks Through Noakhali|unity|stab 3; rjunrest -8|1946: the old man walks barefoot from village to village to stop the riots.|date 1946-11
constituent|The Constituent Assembly|groups|rjself 5; legit 3|December 1946: elected India begins to write its constitution.|date 1946-12
# A Red India
cpi|The Communist Party of India||ideo com 3|The party, banned until 1942, organises the mill workers of Bombay and the peasants of Bengal.|ai 1
peopleswar|The People's War|cpi|ideo com 3; rel SOV 10|After June 1941 the Communists support the war, and are legalised.|req gerSovWar
tebhaga|The Tebhaga Movement|peopleswar|ideo com 4; rjunrest 8|Bengal's sharecroppers demand two-thirds of the crop.|date 1946-9
telangana|The Telangana Rising|tebhaga|units mil 2; ideo com 4|Peasant guerrillas take three thousand villages in Hyderabad.|date 1946-7
redindia|A People's India|telangana|setIdeo com; leader P. C. Joshi/Communist Party of India; rjindep; law council; stab -10|The revolution comes to the subcontinent.|req stab 35; mx azadhind, dominion, unionindia
comintern|Join the Comintern|redindia|join SOV; rel SOV 40, ENG -40|A Soviet India on the Indian Ocean.|
meerut|The Meerut Veterans|cpi|ideo com 2|The trade unionists of the Meerut conspiracy trial lead the party.|
aitu|The All-India Trade Union Congress|meerut|ig union 4; ideo com 2|The Communists control the biggest union federation.|
pinkbengal|The Bengal Kisan Sabha|tebhaga|ideo com 2; ig rural 3|The peasants' league of Bengal organises the sharecroppers.|
`);

// Portugal (2.3): hand-written. Salazar's New State and its treasury; the Spanish war next door; the Oldest Alliance
// and the wolfram of Panasqueira, worked through the Lisbon Balance (nations23.js); Lisbon as the gangway of Europe;
// the armed forces and the Atlantic islands; the empire from Angola to Timor; and other Portugals: the National
// Syndicalists' Portugal at the Axis's side, a restored monarchy, a democratic Republic and a Communist Portugal.
'use strict';
TREES.POR = autoTree('pt_', `
# The New State
estadonovo|The New State||pp 30; stab 3|Since the constitution of 1933 the professor of finance from Coimbra governs Portugal: God, Fatherland, Family.|ai 6
uniaonacional|The National Union|estadonovo|legit 4; ig pb 4|Not a party, its founders insist, but a union of all Portuguese of good will. It wins every seat at every election.|
carmona|President Carmona|estadonovo|stab 3; ig army 4|The old general in the presidential palace of Belém lends the regime the army's blessing.|
pvde|The PVDE|uniaonacional|law guard; rad -0.03; ig army 2, intel -3|The Polícia de Vigilância e Defesa do Estado, trained by Italian and German advisers, watches the opposition.|
tarrafal|The Camp at Tarrafal|pvde|rad -0.04; legit -4 ?? Open the camp => rad -0.03; stab 2 // Keep the prisoners at home => legit 3|A penal camp in the Cape Verde islands for the regime's political prisoners: the camp of the slow death.|date 1936-10
censorship|The Blue Pencil|uniaonacional|law censorship; stab 2; spirit The Blue Pencil: stab 2, legit -2|The censors' blue pencil passes over every newspaper, book and film before the public sees it.|
propaganda|The Secretariat of Propaganda|censorship|pp 20; ws 3|António Ferro's Secretariat sells the New State as a work of art: folk costume, model villages and the politics of the spirit.|
mocidade|The Portuguese Youth|propaganda|spirit Portuguese Youth: manpower .02, stab 1; ig devout 3|Green shirts and Roman salutes for every schoolchild, by law from 1936.|date 1936-5
legiao|The Portuguese Legion|mocidade|units mil 2; ig army -2; rad -0.02|Founded in the heat of the Spanish war, the Legion is the regime's militia against communism.|date 1936-9
corporative|The Corporative State|estadonovo|law corporatist; ig ind 3, union -4; spirit National Labour Statute: output .02, stab 2|The National Labour Statute abolishes free unions: guilds of employers and syndicates of workers, arbitrated by the state.|
casasdopovo|The Houses of the People|corporative|ig rural 5; stab 2|In every parish a Casa do Povo for the farmworkers: insurance, a school room and a priest's blessing.|
concordat|The Concordat of 1940|corporative|law concordat; ig devout 8; legit 4|Salazar settles with the Holy See: the Church regains its schools, the state keeps the Church's property.|date 1940-5
fatima|The Message of Fátima|concordat|stab 4; ws 3; spirit Our Lady of Fátima: stab 3, ws 2|A million pilgrims kneel at the Cova da Iria and give thanks that Portugal has been spared the war.|
exposicao|The Exhibition of the Portuguese World|propaganda|stab 3; legit 3; money -3|1940: eight centuries of the nation and three of independence are celebrated in Belém while Europe burns.|date 1940-6
family|God, Fatherland, Family|fatima,mocidade|spirit God, Fatherland, Family: stab 4, legit 3, research -.02|The regime's three words: no politics, no strikes, no scandal.|
salazarism|Salazarism|family,exposicao|pp 40; spirit The Salazar Order: stab 5, pp .1|Not a fascist, he says; a professor who balanced the books and would rather be left alone to govern.|
plebiscite45|Elections Without Opponents|salazarism|legit 3; pp 20 ?? Let the opposition run and withdraw => legit 4; rad 0.02 // Forbid their lists => stab 2; legit -3|1945: the opposition is allowed a month to campaign, then withdraws rather than lend the vote its name.|date 1945-10
succession|The Question of Succession|salazarism|pp 20; legit 2|Salazar has no heir and wants none. Who will govern Portugal after the professor?|date 1946-1
caetano|Marcelo Caetano, Dauphin|succession|res 15; pp 15|The young law professor who runs the Portuguese Youth is the regime's thinker, and perhaps its future.|
craveiro|Craveiro Lopes, President|succession|stab 3; ig army 3|An airman in Belém, more willing than Carmona to talk to the opposition.|date 1951-7
salwar|Salazar Takes the War Ministry|carmona|ig army 5; pp 15|May 1936: the dictator becomes his own minister of war, to keep the officers in line during the Spanish crisis.|date 1936-5
salforeign|Salazar Takes Foreign Affairs|salwar|infl 20; pcred 5|November 1936: the professor runs foreign policy himself, and will for eleven years.|date 1936-11
cerejeira|Cardinal Cerejeira|concordat|ig devout 5; stab 2|The Patriarch of Lisbon was Salazar's room-mate at Coimbra. Church and state are on first-name terms.|
coimbra|The University of Coimbra|estadonovo|res 15; ig intel 3|The ancient university trains the regime's ministers, and a few of its enemies.|
centenarios|The Centenary Schools|coimbra|build construction 1; spirit Centenary Schools: literacy .03|A plan to build a primary school in every parish for the centenaries of 1940.|date 1940-1
fnat|Joy in Work|casasdopovo|stab 2; ig union 2|The FNAT gives workers holiday camps, choirs and folk dancing, on the Italian model.|
previdencia|Social Insurance|fnat|law pensions; money -3; stab 2|The Previdência: pensions and sick pay through the corporations, for those who have a job.|
casaseconomicas|Cheap Houses|previdencia|build urban 1; stab 2|Little white houses with gardens for respectable working families, rented by the state.|
santamariahosp|The Santa Maria Hospital|casaseconomicas|stab 2; popgrow 1|A great teaching hospital in Lisbon, begun in the war and opened in 1953.|
mealhada|The Mealhada Revolt|plebiscite45|stab -2 ?? Crush it => stab 3; rad -0.02 // Pardon the officers => legit 3; ig army 2|October 1946: a regiment marches on Lisbon from the north, and is stopped at Mealhada.|date 1946-10
abrilada|The April Plot|mealhada|ig army -2; stab 2 ?? Retire the conspirators => stab 2 // Promote them abroad => ig army 3|1947: generals and admirals plan a coup; the PVDE knows the plan before they finish it.|date 1947-4
# Salazar's Treasury
treasury|The Balanced Budget||pgold 15; money 4|Every year since 1928 the budget has closed with a surplus. Salazar intends to keep it that way.|ai 5
escudo|A Strong Escudo|treasury|spirit Sound Money: invest .05, tax .02|The escudo is the hardest currency in southern Europe; the gold reserve grows every year.|
reconstitution|The Economic Reconstitution Law|treasury|build construction 1, railway 1; pgold -5|Fifteen years of public investment, paid for in cash, never by borrowing.|
duartepacheco|Duarte Pacheco's Public Works|reconstitution|build construction 2; stab 2; pgold -8|The minister who builds: roads, ports, schools, hospitals, the national stadium and the new Lisbon.|
lisbonport|The Port of Lisbon|duartepacheco|build port 1; money 2|New docks along the Tagus for the liners and the convoys.|
marginal|The Coastal Road to Cascais|duartepacheco|infra 1; stab 1|An avenue by the sea to Estoril, where the exiled kings of Europe will wait out the war.|
stadium|The National Stadium|duartepacheco|stab 2; ws 2|Inaugurated on Portugal's day in 1944 before sixty thousand spectators.|date 1944-6
airport|Lisbon Airport|lisbonport|infra 1; money 2|Portela opens in 1942: the busiest neutral airport in Europe.|date 1942-10
roads|The National Road Plan|reconstitution|infra 1; build railway 1|Tarmac reaches the villages of Trás-os-Montes and the Alentejo.|
electrify|Hydroelectric Power|reconstitution|build power 2; pgold -6|Dams on the Zêzere and the Cávado: the Electrification Law of 1944.|date 1944-12
castelodobode|The Castelo do Bode Dam|electrify|build power 1, steel 1|The largest dam in Portugal lights Lisbon and powers new industry.|
industrialdev|The Industrial Development Law|electrify,escudo|build steel 1, chem 1; ig ind 5|Ferreira Dias persuades Salazar that Portugal must make what it buys.|date 1945-3
cuf|The CUF Combine|industrialdev|build chem 1, textile 1; ig ind 3|Alfredo da Silva's Companhia União Fabril: soap, fertiliser, ships and tobacco on the Barreiro shore.|
sacor|The SACOR Refinery|cuf|build oilr 1; money 2|A refinery at Cabo Ruivo for the oil of the empire and the tankers of the world.|
siderurgia|A National Steelworks|cuf|build steel 2|The dream of a Portuguese steel industry at Seixal.|
cork|The Cork Monopoly|escudo|money 4; spirit Cork of the World: tax .02|Half the world's cork comes from the oaks of the Alentejo.|
wine|Port Wine|cork|money 3; stab 1|The lodges of Vila Nova de Gaia sell to London, war or no war.|
sardines|The Sardine Canneries|cork|build farm 1; money 2|Matosinhos and Setúbal can sardines for armies on both sides.|
whitefleet|The White Fleet|sardines|money 2; spirit The White Fleet: farm_out .03|The cod schooners sail to the Grand Banks every spring with their white-painted hulls, protected by the Navy.|
wheat|The Wheat Campaign|treasury|build farm 1; ig rural 4|The Alentejo is ploughed for wheat so Portugal need not import its bread.|
colonization|Internal Colonisation|wheat|build farm 1; popgrow 1|The Junta of Internal Colonisation settles families on reclaimed land.|
rationing|Rationing Without Hunger|wheat|stab 2; spirit Ration Cards: stab 1, needs -.02|Bread, sugar and olive oil by the card, and the black market in the city.|req war
goldreserve|The Gold Reserve|escudo,wine|pgold 25; money 5|The Bank of Portugal's vaults fill with gold, some of it from Berlin.|
fomento|The First Development Plan|goldreserve,industrialdev|build steel 1, tools 1, power 1; pgold -20; spirit Development Plan: output .04, growth .02|1953: six years of investment in metropole and empire, the first plan Salazar will allow.|date 1952-6
tobacco|The Tobacco Monopoly|cork|money 3|The state's tobacco company pays a fixed rent into the treasury every year.|
textiles|The Mills of the Ave|cuf|build textile 2; ig union -2|Cotton from Mozambique and Angola spun in the valleys north of Porto.|
merchantmarine|The Merchant Marine Plan|lisbonport|build shipyard 1; money 2|1945: seventy new ships for the trade of the empire.|date 1945-1
tourism|Estoril and the Algarve|marginal|money 3|Casinos, golf and the sun: the first tourists come for the neutrality.|
emigration|Emigration to Brazil|wheat|popgrow -1; money 3|The poor of the north leave for Brazil and send money home.|
banking|The Bank of Portugal Reform|escudo|spirit Central Bank: invest .05; money 2|The bank of issue answers to the finance minister.|
douro|The Douro Dams|castelodobode|build power 1; money 2|The Douro's gorges will light the north.|
metro|The Lisbon Metro Plan|airport,electrify|infra 1; build urban 1|A first underground line from Sete Rios to the Restauradores.|date 1948-1
# The Spanish War
spanishwar|The War Next Door||ws 4; pp 10|Spain is at war with itself. A Red Spain would not stop at the frontier.|req spainCW; ai 5
viriatos|The Viriatos|spanishwar|rel SPA 10; units mil 1 ?? Encourage volunteers => rel SPA 10; ws 3 // Look the other way => stab 2|Some eight thousand Portuguese volunteers fight for Franco, named after the shepherd who fought Rome.|
radioclube|Radio Clube Português|spanishwar|pp 10; rel SPA 5|The radio station of Parede broadcasts for the Nationalists.|
frontier|Open the Frontier to Supplies|viriatos|rel SPA 15, ENG -5; money 2|German arms for Franco land in Lisbon and cross the border by rail.|
nonintervention|The Non-Intervention Committee|spanishwar|infl 20; rel ENG 5 ?? Join, and let observers watch the frontier => rel ENG 10; infl 10 // Refuse the observers => rel SPA 10|London asks every power to stay out of Spain. Lisbon joins late and lets the observers see little.|date 1936-8
badajoz|The Massacre at Badajoz|frontier|legit -2; rel SPA 5|Refugees who fled across the frontier are handed back to the Nationalists.|
recognize|Recognise Franco|frontier,radioclube|rel SPA 15; infl 10|In May 1938 Portugal recognises the Nationalist government at Burgos.|date 1938-5
iberianpact|The Iberian Pact|recognize|nap SPA; rel SPA 20; stab 2|March 1939: a Treaty of Friendship and Non-Aggression with Franco's Spain.|date 1939-3
additional|The Additional Protocol|iberianpact|rel SPA 10, ENG 5; pcred 5|July 1940: the two dictators agree to consult before either goes to war.|date 1940-7
iberianbloc|The Iberian Bloc|additional|rel SPA 15; pcred 10; spirit Iberian Bloc: def .05|Salazar and Franco meet in Seville in 1942: the peninsula will stay neutral together.|date 1942-2
nogaliza|Keep Spain Out of the War|iberianbloc|pcred 10; rel ENG 10|Salazar's quiet counsel in Madrid: let the Germans pass through Spain and Portugal is next.|
barrancos|The Refugees of Barrancos|spanishwar|legit 4; rel SPA -5|A Portuguese lieutenant hides a thousand Spanish Republican refugees in a border village and ships them to Tarragona.|mx frontier
legionvolunteers|Legionaries for Spain|viriatos|units mil 1; ig army 2|The Legion sends its own volunteers to the Nationalist columns.|
francovisit|Franco Comes to Lisbon|iberianbloc|rel SPA 10; stab 2|The Caudillo is received at the Belém palace: the two dictators are seen arm in arm.|date 1949-10
anticommunist|The Anti-Communist Front|recognize|rad -0.03; rel SPA 5, ITA 5|Lisbon, Burgos and Rome agree that Bolshevism is the enemy.|
breakmoscow|No Relations with Moscow|anticommunist|rel SOV -20; rad -0.02|Portugal will not recognise the Soviet Union, and does not until 1974.|
# The Oldest Alliance
oldest|The Oldest Alliance||rel ENG 10; infl 15|The Treaty of Windsor of 1386 still binds Portugal and England, the oldest alliance in the world.|ai 5
windsor|Renew the Alliance|oldest|rel ENG 15; pcred 5|Lisbon reminds London that the alliance has never been broken.|
neutral|Neutral in Name|windsor|pcred 15; ptilt 5; spirit Collaborating Neutrality: stab 2, ws -3|September 1939: Portugal will be neutral, as Britain herself prefers, since the alliance is not invoked.|req ptwar; ai 6
nicaragua|The Wolfram Rush|neutral|money 6 ?? Let the prices rise => money 6; pcred -3 // Fix the price => pcred 3; stab 2|Peasants dig wolfram with picks in the hills of Beira; prices rise tenfold; the Panasqueira mine works day and night.|req ptwar
panasqueira|The Panasqueira Mine|nicaragua|build ironm 1; money 4|The British-owned mine is the richest source of tungsten in Europe.|
quotas|Wolfram Quotas|panasqueira|money 4; pcred 5|Sell both sides by quota, so neither can say it was cheated.|req ptwar
gold|German Gold|quotas|money 8; ptilt -10; pgold 10|Berlin pays in bullion from the Reichsbank, some of it looted from Belgium and the Netherlands.|req ptwar; mx preemptive
preemptive|Pre-emptive Purchases|quotas|money 5; ptilt 10; rel ENG 10, USA 10|The British and Americans buy everything they can, at any price, to keep it from the Germans.|req ptwar; mx gold
embargo|The Wolfram Embargo|gold|ptilt 15; rel ENG 15, GER -20; pcred 5|June 1944: under Allied pressure all wolfram exports are stopped.|date 1944-6; req ptwar
azores|The Azores Agreement|preemptive|pazores; ptilt 10|October 1943: invoking the alliance of 1373, Portugal leases the islands to Britain.|date 1943-8; req ptwar
santamaria|Santa Maria for the Americans|azores|rel USA 20; money 4|1944: an American airfield on Santa Maria, built for the Americans, operated in the name of the British.|date 1944-6
timorpact|The Price of Timor|santamaria|rel USA 10, AST 10|In exchange for the airfield, the Allies promise that Timor will be returned to Portugal.|
allied|Join the Allies|azores|join ENG; ptilt 20; ws 10|With the war won, Portugal can stand openly with its oldest ally.|req year 1945; ai 1
brazil|Brother Brazil|oldest|rel BRA 25; trade BRA|The Luso-Brazilian Agreement: two nations, one language.|
vatican|The Holy See|oldest|rel ITA 5; infl 15; legit 2|Lisbon and Rome: the Catholic powers keep in touch.|
lisbonmeeting|The Lisbon Meeting|windsor|rel ENG 10; infl 10|The British ambassador and the dictator meet weekly over tea.|
ambassador|Sir Ronald Campbell|lisbonmeeting|rel ENG 10; pcred -2|The British ambassador presses for the Azores, the wolfram and the refugees.|req ptwar
hoyningen|Baron Hoyningen-Huene|lisbonmeeting|rel GER 10; pcred -2|The German minister, an old diplomat, presses for wolfram and keeps his distance from the Party.|req ptwar
nato|A Founding Member of NATO|allied|rel USA 20, ENG 10; spirit Atlantic Alliance: def .05, research .02|April 1949: a dictatorship among the founders, because the Azores matter more than the constitution.|date 1949-4
marshall|The Marshall Plan|nato|money 10; build tools 1|After refusing it in 1947, Portugal asks for aid in 1948.|date 1948-9
tradeagreement|The War Trade Agreement|windsor|trade ENG; money 3; rel ENG 5|Sardines, cork and wine for British coal and the navicerts that let our ships pass the blockade.|req ptwar
navicerts|Navicerts|tradeagreement|money 2; pcred -2|Every Portuguese cargo needs a British certificate. The blockade runs through Lisbon.|req ptwar
leslie|Flight 777|lisbonmeeting|rel ENG 5; ws 2|June 1943: the airliner from Lisbon to Bristol, with the actor Leslie Howard on board, is shot down over the Bay of Biscay.|date 1943-6
felix|Operation Felix|neutral|pcred 5; units inf 2|If Germany marches on Gibraltar through Spain, Portugal is next. The army plans for the worst.|req ptwar
isabella|The Isabella Plan|felix|dig 9999 Lisbon, Porto; pcred 5|A German contingency plan to occupy the Portuguese coast. The British offer to help defend it, from the islands.|req ptwar
usambassador|The American Minister|santamaria|rel USA 15; infl 10|George Kennan comes to Lisbon to negotiate the Azores for Washington.|
lajes|Lajes Field|nato|rel USA 15; money 4|1951: the American air base on Terceira, the bridge between America and Europe.|date 1951-9
unmembership|United Nations Membership|nato|infl 20; legit 3|Vetoed by the Soviets until 1955, Portugal joins the United Nations.|date 1955-12
balance|Balance the Belligerents|neutral|pcred 10; spirit Even-Handed Neutrality: stab 2|Salazar treats both sides with the same cold courtesy.|req ptwar
# Lisbon, Gangway of Europe
gangway|The Gangway of Europe||pp 10; money 2|Every refugee, spy and exiled king in Europe wants a passage from Lisbon.|req ptwar; ai 4
circular14|Circular Fourteen|gangway|stab 2; legit -2|November 1939: consuls may not issue visas to Jews, Russians or the stateless without Lisbon's approval.|mx sousamendes
sousamendes|The Consul at Bordeaux|gangway|pvisas; legit 5; rel GER -10, USA 15|June 1940: Aristides de Sousa Mendes signs thirty thousand visas in three days and is ruined for it.|date 1940-6; mx circular14
clipper|The Pan Am Clipper|gangway|money 3; rel USA 10|The flying boats leave Cabo Ruivo for New York with whoever can buy a ticket.|
estoril|The Kings at Estoril|clipper|infl 15; money 2|Carol of Romania, Umberto of Italy, the Count of Barcelona and the Duke of Windsor wait in the casinos.|
spies|The Spies of the Avenida|estoril|res 15; infl 10 ?? Watch them all => res 10; pcred 3 // Sell what they say => money 4; pcred -3|The Abwehr, MI6 and the OSS share the bars of Lisbon; the PVDE watches them all.|
garbo|Agent Garbo|spies|rel ENG 10; res 10|A Catalan in Lisbon invents a network of agents for the Germans and works for the British.|req year 1942
gulbenkian|The Gulbenkian Arrival|estoril|money 5; res 10|Calouste Gulbenkian, Mr Five Per Cent, settles in Lisbon with his art and his oil fortune.|date 1942-4
redcross|The Red Cross Ships|gangway|legit 3; rel USA 5, ENG 5|Portuguese ships carry the parcels for prisoners of war and the exchanges of the wounded.|
casablanca|The Last Boat|redcross,sousamendes|legit 3; money 2|The Serpa Pinto and the Nyassa carry refugees to New York until the end.|
windsorplot|Operation Willi|estoril|rel ENG 5, GER -5|The Duke of Windsor waits in Cascais; German agents plot to keep him in Europe. He sails for the Bahamas.|date 1940-7
aviz|The Hotel Aviz|estoril|money 2; infl 5|Gulbenkian's hotel, the most discreet in Lisbon, where every conversation is overheard.|
amzalak|The Jewish Community of Lisbon|sousamendes|legit 3; rel USA 5|Moisés Amzalak's committee feeds and houses the refugees waiting for a ship.|
joint|The Joint and HICEM|amzalak|money 2; legit 2|American Jewish relief agencies move their European offices to Lisbon.|
caldas|The Residence at Caldas|gangway|stab 1 ?? House the refugees in the spa towns => legit 3; money -1 // Keep them in Lisbon => money 1|Refugees awaiting visas are sent to the spa towns of Caldas da Rainha and Ericeira.|
# The Armed Forces
army|The Army Reform of 1937||ig army 5; units inf 2|A reorganisation on paper: ten divisions, few modern weapons.|date 1937-6; ai 4
santos|Santos Costa at the Ministry|army|stab 2; ig army 4|The under-secretary for war, Salazar's loyal soldier, keeps the army quiet and the officers paid.|
britisharms|British Arms|army|equip arms 200, artillery 30; rel ENG 5|The British mission rearms the army with rifles, guns and Bren carriers.|req year 1943
mobilization|Mobilise the Army|army|units inf 3; mp 30|If Germany comes through Spain, the army will be on the frontier.|req ptwar
borderdefence|The Spanish Frontier|mobilization|fort Lisbon, Porto; dig 9999 Porto|Positions along the Douro and the passes of the Beira.|
lisbonfortress|The Lisbon Entrenched Camp|borderdefence|dig 9999 Lisbon; fort Lisbon|The forts of Monsanto and the Tagus batteries guard the capital.|
islands|Defend the Atlantic Islands|army|dig 9999 Azores, Madeira; units inf 1|Garrisons for the Azores, Madeira and Cape Verde, the islands everyone wants.|req ptwar
navy|The Naval Programme of 1930||ig army 2; build shipyard 1|Destroyers, sloops and submarines from British yards: a small, modern navy.|ai 3
destroyers|The Vouga Class|navy|build shipyard 1; spirit The Vouga Destroyers: navy .04|Five destroyers built in Britain and at Lisbon's arsenal.|
sloops|Colonial Sloops|navy|spirit Colonial Sloops: navy .03; build port 1|The Afonso de Albuquerque and the Bartolomeu Dias show the flag from Goa to Macau.|
convoys|Escort the White Fleet|destroyers|money 2; spirit Escorted Fishing: farm_out .02|The navy shepherds the cod fleet across U-boat waters, lights blazing to show its neutrality.|req ptwar
airforce|Military Aeronautics|army|tech m_air1; build aircraftp 1|Gladiators and Hurricanes from Britain, some Junkers from Germany.|
spitfires|Spitfires for Portugal|airforce|equip aircraft 30; rel ENG 5|1943: the British deliver modern fighters, a down payment on the Azores.|req year 1943
officers|The Officer Corps|santos|axp 10; ig army 3|Graduates of the Military School learn from British and French manuals.|
paratroops|The Atlantic Brigade|officers,islands|units inf 2|A mobile brigade to answer a landing on the islands.|
legionarmy|The Legion as Reserve|legiao,mobilization|units mil 3|The Portuguese Legion's companies are attached to the army.|
dumbarton|Joint Staff Talks|britisharms,islands|rel ENG 10; spirit Allied Staff Talks: def .04|British and Portuguese officers plan the defence of the islands together.|
nationalservice|The Military Service Law|army|law limited; mp 30|1937: eighteen months of service for every young man.|
bracodeprata|The Arsenal at Braço de Prata|army|build arms 1, artyf 1|The army's own factory makes rifles and shells in eastern Lisbon.|
coastal|Coastal Batteries|lisbonfortress|fort Lisbon, Porto, Faro|Great guns at the mouth of the Tagus and the Douro.|
submarines|The Delfim Submarines|destroyers|spirit Delfim Class: navy .03|Three small submarines to guard the approaches.|
navalair|Naval Aviation|airforce|tech m_nav1|Seaplanes at Bom Sucesso patrol the coast for submarines and wrecks.|
capeverde|The Cape Verde Garrison|islands|dig 9999 Bissau; units inf 1|The islands lie across the convoy routes; both sides want their harbours.|
cavalry|The Cavalry School|officers|units cav 1; axp 5|Mafra's riders, the pride of the old army.|
militarymission|The British Military Mission|britisharms|axp 10; rel ENG 5; tech m_art1|British officers teach the use of the new weapons.|
staffcollege|The Institute of High Military Studies|officers|res 10; axp 5|A staff college for the officers who will command a modern army.|
# The Empire
ultramar|The Colonial Act||pp 15; law exploit|The Act of 1930: the colonies are Portugal, overseas, and their wealth is the nation's.|ai 4
empirecongress|The Colonial Empire Congress|ultramar|infl 15; stab 2|The imperial exhibition of Porto, 1934: Portugal is not a small country.|
angola|Angola|ultramar|build farm 1; money 2|The largest colony, from the Congo to the Cunene: coffee, diamonds and settlers.|
diamang|Diamang|angola|money 4; build ironm 1|The Diamond Company of Angola, a state within the state in the Lunda.|
benguela|The Benguela Railway|angola|build railway 1; infra 1|From Lobito to the Katanga copper belt: the railway across Africa.|
coffee|Angolan Coffee|diamang|money 3; build plantation 1|The wartime coffee boom makes the planters of Uíge rich.|
colonatos|The Colonatos|coffee|popgrow 1; stab -1|Planned settlements bring peasants from Minho to Angola: Cela and Cunene.|date 1950-1
mozambique|Mozambique|ultramar|build plantation 1; money 2|From Lourenço Marques to Lake Nyasa: sugar, cotton and the ports of southern Africa.|
beira|The Port of Beira|mozambique|build port 1; money 3|Rhodesia's sea gate: the railway from Salisbury ends here.|
labourtreaty|The Labour Convention|mozambique|money 4; rel SAF 10|Mozambican miners for the Rand, paid in gold to the Portuguese treasury.|
cotton|Forced Cotton|labourtreaty|build plantation 1; legit -3|Every African family must grow cotton for the concessionary companies, at prices fixed in Lisbon.|
guinea|Guinea and Cape Verde|ultramar|build farm 1|Bissau, the islands and the groundnut trade.|
caboverde|Famine in Cape Verde|guinea|stab -1 ?? Send relief => money -3; legit 3 // Let the islanders emigrate => popgrow 1|Drought on the islands: thousands die in 1941 and 1947.|date 1941-1
saotome|São Tomé Cocoa|guinea|money 2; build plantation 1|The cocoa islands and the contract labourers who work them.|
goa|Portuguese India|ultramar|infl 10; stab 1|Goa, Daman and Diu: four and a half centuries of Portuguese rule.|
goaships|The German Ships at Goa|goa|rel ENG 5 ?? Intern them strictly => rel ENG 10; pcred 3 // Look away => rel GER 5; pcred -3|Three German merchantmen shelter in the harbour of Mormugão; one of them radios U-boats.|req ptwar
macau|Macau|ultramar|money 2; infl 10|The city of the Name of God in China, neutral through the whole Japanese war.|
macauneutral|Macau Neutral|macau|money 3; rel JAP 5, CHI 5|Refugees from Hong Kong and Canton crowd the colony; the Japanese leave it alone, for a price.|req japAtWar
timor|Timor|ultramar|rel AST 5|The eastern half of the island, at the edge of the empire.|
timorwar|The Battle of Timor|timor|rel AST 10, JAP -10; ws 3|Dutch and Australian troops land at Dili in 1941; the Japanese follow. The Portuguese cannot keep them out.|req japAtWar
timorreturn|Recover Timor|timorwar|core Dili; rel AST 10|In 1945 the Portuguese flag returns to Dili, by Allied promise.|req gone JAP
assimilation|Assimilados|empirecongress|legit 2 ?? Widen assimilation => law assimilate; legit 3 // Keep the native statute => law exploit; money 2|A few thousand Africans may become citizens, if they read, write and renounce their customs.|
colonialarmy|The Colonial Army|empirecongress|units inf 2; mp 20|Native companies under Portuguese officers garrison the empire.|
lusotropical|Lusotropicalism|assimilation|legit 4; infl 20|Gilberto Freyre's theory: Portuguese colonialism alone mixes, and never segregates.|date 1951-1
provinces|Overseas Provinces|lusotropical|law assimilate; core Luanda, Lourenço Marques, Bissau, Goa, Dili|1951: there are no colonies any more, only provinces of one Portugal from Minho to Timor.|date 1951-6
pinkmap|The Pink Map|colonialarmy|claim Lusaka, Salisbury, Zomba; ws 4|The old dream of 1886: Angola and Mozambique joined across the heart of Africa.|req ideo fas
huila|The Huíla Plateau|angola|build farm 1; popgrow 1|Cool highlands for European settlers around Sá da Bandeira.|
novalisboa|Nova Lisboa|benguela|build urban 1; infra 1|A planned capital on the railway in the highlands of Huambo.|
cabinda|Cabinda|angola|money 2|The enclave north of the Congo: timber, and perhaps oil.|
angolaoil|Oil in the Cuanza|cabinda|dep Luanda oil 2; money 3|Petrofina strikes oil near Luanda.|date 1955-1
mozco|The End of the Company Charter|mozambique|money 3; legit 2|1942: the Mozambique Company's charter expires and the state takes over central Mozambique.|date 1942-7
zambezi|The Zambezi Bridge|beira|infra 1; build railway 1|The longest railway bridge in Africa carries Nyasaland's trade to Beira.|
sugarmz|Sena Sugar|mozambique|build plantation 1; money 2|The British sugar estates on the Zambezi.|
macaugold|The Macau Gold Trade|macau|money 4; pgold 5|Gold flows through Macau to China; the colony takes its share.|
goarail|The Mormugão Railway|goa|infra 1; money 1|The port of Goa ships the iron ore of the hinterland.|
goaore|Goan Iron Ore|goarail|build ironm 1; money 2|Japanese and German buyers want the ore of Goa.|date 1947-1
nehrugoa|Nehru Demands Goa|goa|ws 4; stab -1 ?? Refuse to negotiate => ws 4; rel RAJ -15 // Offer talks => legit 2|1950: an independent India wants Goa back. Salazar will not talk.|date 1950-1
sandalwood|Timor Sandalwood|timor|money 2|The old trade of the island, almost exhausted.|
missions|The Catholic Missions|ultramar|ig devout 4; spirit Colonial Missions: literacy .02|The Concordat's missionary agreement gives the Church the schools of the empire.|
escolacolonial|The Colonial School|empirecongress|res 10; ig intel 2|Lisbon trains the administrators of the empire.|
indigenato|The Native Statute|assimilation|money 3; legit -2|Most Africans live under the native statute: forced labour, the head tax and no vote.|
# Integralism
integralism|The National Syndicalists||rad 0.04; ideo fas 4|Rolão Preto's Blue Shirts want a revolution Salazar never made.|ai 1
bluefsirts|The Blue Shirts Rise|integralism|setIdeo fas; leader Francisco Rolão Preto/National Syndicalist Movement; stab -8; legit -6|The regime is overthrown from the right: Rolão Preto in São Bento.|req ideo aut & stab 60; mx monarchy, democracy, communism
nsrevolution|The National Syndicalist Revolution|bluefsirts|law corporatist, oneparty; ig union 5, ind -5; spirit National Syndicalism: mil_out .05, stab -2|Syndicates of workers, not guilds of bosses: the revolution of the Blue Shirts.|
axislean|Lean Towards the Axis|nsrevolution|rel GER 20, ITA 20, ENG -20; ptilt -25|Lisbon looks to Rome and Berlin, and the alliance with England is forgotten.|
anglosphere|Denounce the Alliance|axislean|rel ENG -40; ptilt -30; pcred -20|The treaty of 1386 is declared dead.|
axisjoin|Join the Axis|anglosphere|join GER; ws 15|Portugal joins the war at Germany's side.|req war
galiza|Claim Galicia|axisjoin|claim Corunna; ws 5|Galicia speaks almost our language: the Portuguese of the north.|
olivenza|Claim Olivenza|axisjoin|claim Badajoz; rel SPA -20|Spain has held Olivenza since 1801. Portugal never recognised it.|
iberianfascism|Iberian Fascism|nsrevolution|rel SPA 30; nap SPA|Two Blue Shirt regimes stand together in the peninsula.|
rearm|Rearm for the Revolution|nsrevolution|build arms 2; units inf 3|A militia army to defend the new order.|
revolucao|The Newspaper Revolução|integralism|ideo fas 4; pp 10|Rolão Preto's paper calls for a national syndicalist revolution against the bourgeois dictatorship.|
bluemarch|The March of the Blue Shirts|revolucao|rad 0.03; stab -2; ideo fas 4|Thousands of Blue Shirts parade in Lisbon with the Cross of Christ on their armbands.|
legionfascist|Capture the Legion|bluemarch|units mil 2; ig army -3|The Portuguese Legion's young officers go over to the Blue Shirts.|
workersyndicates|Syndicates of Workers|nsrevolution|ig union 8; stab 2|The national syndicates run the factories with the engineers, not the owners.|
empirerevolution|The Revolutionary Empire|axisjoin|units inf 2; claim Léopoldville|The empire too must serve the revolution: Léopoldville is within reach of Angola.|

# The Restored Monarchy
monarchy|The Integralists' King||ig land 4, devout 3|The Integralismo Lusitano wants the King back: Dom Duarte Nuno of Braganza.|ai 1
restoration|Restore the Monarchy|monarchy|law monarchy; leader Duarte Nuno/Integralismo Lusitano; legit 8; stab -4|1940: the King returns to Lisbon, thirty years after the Republic sent his family into exile.|req stab 55; date 1940-1; mx bluefsirts, democracy, communism
crown|The Crown and the Cortes|restoration|law census; stab 4; spirit The Braganza Crown: legit 6, stab 2|A Cortes of estates, a council of state and a king who reigns.|
kingsportugal|The King's Portugal|crown|infl 20; rel ENG 15, SPA 10|The crowned heads of Europe come to Lisbon, and the alliance with England is renewed in royal style.|
braganzaempire|The Braganza Empire|kingsportugal|core Luanda, Lourenço Marques; legit 4|The empire answers to a king again, as in the days of Manuel the Fortunate.|
duartenuno|Dom Duarte Nuno|monarchy|legit 3; ig devout 2|The pretender, raised in exile, may return to Portugal under the law of 1950.|
integralismo|The Integralist Doctrine|duartenuno|ig land 4; stab 2|António Sardinha's Integralismo Lusitano: an organic monarchy of municipalities and guilds.|
coronation|The Acclamation at Vila Viçosa|restoration|legit 6; stab 3|The King is acclaimed in the palace chapel of the Braganzas.|
royalnavy|A Royal Navy|kingsportugal|build shipyard 1; spirit Royal Portuguese Navy: navy .04|The navy takes back its royal title and its traditions.|
# The Democratic Republic
democracy|The Opposition||ideo dem 4; rad 0.02|Republicans, freemasons and liberals remember the First Republic.|ai 1
mud|The Movement of Democratic Unity|democracy|ideo dem 5; legit -2|October 1945: the MUD is allowed to campaign for a month, and fifty thousand sign its lists.|date 1945-10
normatos|General Norton de Matos|mud|leader José Norton de Matos/Movement of Democratic Unity; setIdeo dem; law parliamentary, universal; stab -6|The old republican general wins the presidential election, and the New State falls.|req stab 50; mx bluefsirts, restoration, communism
freepress|The Free Press Returns|normatos|law protected; legit 6; spirit Free Portugal: research .03, stab -2|The blue pencil is broken; the PVDE is dissolved.|
amnesty|The Amnesty|freepress|legit 4; rad -0.03|Tarrafal is closed and the prisoners come home.|
republicwest|The Atlantic Republic|amnesty|rel ENG 20, USA 20; join ENG|A democratic Portugal stands with the democracies.|
decolonise|Promise Self-Government|republicwest|law selfrule; legit 5; money -4|The colonies will be prepared for self-government, slowly.|
republicans|The Republican Exiles|democracy|ideo dem 3; rel FRA 10|The exiles of the First Republic in Paris and Madrid keep the flame.|
humberto|General Humberto Delgado|mud|ws 3; ideo dem 4|A general who once admired the regime becomes its fearless opponent.|
universalvote|The Vote for Women|freepress|law suffrage; legit 4|The Republic extends the vote to every adult.|
landreformdem|The Alentejo Settlement|decolonise|build farm 1; ig land -5, rural 6|Credit and land for the farmhands of the south, without revolution.|
# The Communist Underground
communism|The Communist Underground||ideo com 4; rad 0.03|The Portuguese Communist Party survives in the cork factories and the fields of the Alentejo.|ai 1
cunhal|Álvaro Cunhal|communism|ideo com 5; rad 0.02|A young lawyer reorganises the party in 1941; Avante! is printed in secret.|date 1941-1
strikes|The Great Strikes|cunhal|stab -6; ideo com 6|1943 and 1944: strikes in Lisbon and the Alentejo, put down by the GNR.|date 1943-7
redrevolution|The People's Revolution|strikes|setIdeo com; leader Álvaro Cunhal/Portuguese Communist Party; law council; stab -10|The regime falls to the workers of the Barreiro and the farmhands of the south.|req stab 40; mx bluefsirts, restoration, normatos
agrarian|The Agrarian Reform|redrevolution|build farm 2; ig land -10, rural 10|The great estates of the Alentejo are given to those who work them.|
comintern|Join the Comintern|agrarian|join SOV; rel SOV 40, ENG -30|A Soviet Portugal on the Atlantic.|
avante|Avante!|cunhal|ideo com 4; rad 0.02|The party's clandestine paper reaches the factories every fortnight.|
alentejo|The Red Alentejo|avante|units mil 2; ideo com 3|The farmhands of the south organise in secret.|
nationalisecuf|Nationalise the CUF|agrarian|build chem 1, steel 1; ig ind -10|The empire of the Mellos becomes the property of the people.|
## The Salazar Order
salazarorder|The Professor's Peace|salazarism,neutral|pcred 15; stab 4; spirit The Professor's Peace: stab 3, ws -4|Portugal stays out of the war: not a bomb falls on Lisbon.|
victoryneutral|Neutral to the End|salazarorder,embargo|legit 5; stab 3; pgold 20|1945: Portugal has kept out of the war, and is richer for it.|date 1945-5
lisbonflags|Flags at Half-Mast|victoryneutral|rel ENG -10, USA -10 ?? Mourn Hitler officially => rel GER 5; legit -5 // Celebrate the Allied victory => rel ENG 15, USA 15|May 1945: the government flies the flags at half-mast for the dead German leader. The crowds in Lisbon cheer the Allies.|
`);

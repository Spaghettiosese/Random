// Sweden (2.2): hand-written. The People's Home of Per Albin Hansson; the balance between the belligerents, worked through
// the Swedish Balance (pressure from Berlin and from the Allies, the credibility of neutrality, the ore of Kiruna); armed
// neutrality; the cause of Finland; the humanitarian great power; and four other Swedens: the activists' Sweden at
// Germany's side, a Swedish people's republic, a Nordic union, and a Sweden that enters the war at the end.
'use strict';
TREES.SWE = autoTree('sv_', `
# The People's Home
folkhem|The People's Home||pp 30; stab 3|Per Albin Hansson's promise: a Sweden where no one is the favourite child and no one the stepchild.|ai 6
cowtrade|The Cow Trade Renewed|folkhem|ig rural 8; stab 2; spirit Red-Green Bargain: farm_out .04, stab 2|The Social Democrats buy the Farmers' League with price supports for milk and grain; the Farmers buy relief work for the towns.|
election36|The Election of 1936|folkhem|legit 5; pp 20 ?? Govern with the Farmers' League => ig rural 6; stab 3 // Govern alone => pp 30; ig union 6|September 1936: the Social Democrats win 45.9 per cent, and the King has to give Per Albin his government back after a summer out of office.|date 1936-9
wigforss|Wigforss's Budget|cowtrade|money -6; unemp -3; spirit Stockholm School Budget: growth .03, tax -.02|The finance minister borrows in the slump to repay in the boom, a year before Keynes's General Theory reaches Stockholm.|
publicworks|Relief Work at Market Wages|wigforss|unemp -3; build railway 1, construction 1; ig union 6|Roads, bridges and harbours, paid at union rates instead of poor relief.|
taxreform|The Progressive Income Tax|wigforss|law graduated; money 6; ig ind -4|Those who earn the most pay the most, and the Wallenbergs pay more than anyone.|
saltsjobaden|The Saltsjöbaden Agreement|election36|stab 4; ig union 4, ind 6; spirit Saltsjöbaden Spirit: output .03, stab 2|December 1938: at a seaside hotel the employers and the LO agree to settle their quarrels without the state. The Swedish Model begins.|date 1938-12
holidays|Two Weeks' Holiday|saltsjobaden|stab 3; ig union 6; ideo dem 3|The holiday law of 1938: every Swede gets twelve days off with pay, and the Swedish summer is invented.|
folkpark|The People's Parks|holidays|stab 2; ws 2|Dance floors, open-air theatres and May Day speeches beside the lakes.|
myrdal|The Population Crisis|folkhem|pp 15; popgrow 1|Alva and Gunnar Myrdal warn that Swedes are not having enough children, and propose that the state help pay for them.|
maternity|Maternity Benefits|myrdal|popgrow 1; stab 2; spirit Child-Friendly State: manpower .02, stab 1|Free maternity care and a grant for every mother, married or not.|
housing|The Bright Flats|maternity|build urban 2; stab 2|Functionalist flats with bathrooms and balconies replace the one-room cottages of the working districts.|
schools|One School for Every Child|maternity|spirit The Comprehensive School: literacy .03, research .03|The farmer's son and the director's daughter in the same classroom, the reformers say.|
pensions|The People's Pension|election36|money -4; stab 3; ig union 4|A pension for every old Swede, as a right, not as charity.|
moller|Möller's Social Ministry|pensions,holidays|law welfare_state; stab 4; money -6|Gustav Möller builds the welfare state law by law: unemployment insurance, sick pay, child allowances.|
cooperatives|The Cooperative Union|cowtrade|stab 2; build textile 1; ig rural 3|KF breaks the margarine and galosh cartels by building its own factories.|
luma|Luma Light Bulbs|cooperatives|build tools 1; money 2|The cooperatives' lamp factory on Lake Hammarby undercuts the international light-bulb cartel.|
temperance|The Ration Book for Spirits|folkhem|stab 2 ?? Keep the motbok => stab 2; money 3 // Abolish it => stab -1; ig union 3|Every Swede may buy a set ration of spirits a month, entered in a little book at the state shop.|
radio|Radiotjänst|folkhem|pp 10; ws 3|The national radio reaches every farmhouse from Skåne to Lapland.|
memory|No More Ådalen|saltsjobaden|ig army -2, union 4; stab 2|Never again will soldiers fire on strikers, as they did at Lunde in 1931.|
fullemploy|Full Employment|publicworks,taxreform|unemp -4; stab 2|By 1943 there are more jobs than Swedes to fill them.|date 1943-1
model|The Swedish Model|moller,saltsjobaden|spirit The Swedish Model: output .04, stab 4, tax .03|Free unions, free employers, a strong state and work for everyone.|
erlander|Tage Erlander|model|leader Tage Erlander/Social Democrats; pp 30; legit 4|Per Albin dies on a tram in 1946. A young minister from Värmland takes over, and keeps the job for twenty-three years.|date 1946-10
thirdway|The Middle Way|erlander|spirit The Middle Way: growth .03, stab 3|American journalists come to study the country between capitalism and socialism.|
lo|The LO|election36|ig union 6; stab 1|The trade union confederation, a million members strong, sits at every table.|
unempins|Unemployment Insurance|publicworks|unemp -2; stab 2; money -3|The unions' insurance funds get a subsidy from the state.|
sickpay|Sick Pay for All|moller|stab 2; spirit Sick Pay: manpower .01, stab 1|No Swede need go to work with a fever to feed the family.|
childallow|Child Allowances|sickpay|popgrow 1; stab 2|1947: an allowance for every child, paid to the mother.|date 1947-1
# The Neutral Kingdom
neutral|Strict Neutrality||pp 20; swcred 5|Sweden has not fought a war since 1814, and Per Albin means to keep it that way.|ai 6
sandler|Sandler's Foreign Ministry|neutral|pp 15; rel NOR 10, DEN 10, FIN 10|Rickard Sandler believes in the League and in the North, in that order.|
oslo|The Oslo States|sandler|trade NOR,DEN,HOL,BEL,FIN; rel HOL 10, BEL 10|The small democracies of the north and the west coordinate their trade and their neutrality.|
article16|Free of Article Sixteen|sandler|pp 10 ?? We are no longer bound to impose sanctions => swcred 8 // We stay loyal to Geneva => rel ENG 10, FRA 10; legit 3|July 1936: after the fiasco over Abyssinia, the Oslo States declare that League sanctions no longer bind them.|date 1936-7
nordic|Nordic Neutrality|oslo|rel NOR 10, DEN 10, FIN 10; swcred 5|The four northern countries promise each other everything except help.|
aland|The Stockholm Plan|sandler|rel FIN 15, SOV -10|Sweden and Finland agree to fortify the Åland Islands together, if Moscow does not object. Moscow objects.|date 1939-1
kingsfavour|The King's Foreign Policy|neutral|pp 15 ?? The government speaks for Sweden => legit 4 // Let Gustaf V speak for Sweden => rel GER 10; swpress ax -8|The old King plays tennis in Nice as Mr G, and is suspected of liking the Germans more than his ministers do.|
oretreaty|The Ore Treaty with Germany|neutral|money 8; swore 10; swpress ax -10; rel GER 10|Ten million tons of ore a year, paid for in coal, coke and chemicals.|
gunther|Christian Günther|neutral|pp 20 ?? A career diplomat at the Foreign Ministry => swcred 4; pp 20 // Keep Sandler and his principles => rel FIN 10; swcred 6|December 1939: Sandler resigns over Finland, and a diplomat who believes in nothing but survival takes over.|date 1939-12
smallsteps|The Policy of Small Steps|gunther|swpress ax -10; swpress al -5; swcred -3|Give a little to whoever is strongest; take it back when he weakens.|
wartrade|The War Trade Agreement|gunther|rel ENG 10; money 4; swpress al -10|December 1939: Britain lets Swedish ships through its blockade in return for limits on what Sweden sells to Germany.|
lejd|The Safe-Conduct Traffic|wartrade|seaton 2; money 6; spirit The Gothenburg Traffic: tradecap .1|Four ships a month leave Gothenburg with the permission of both sides to cross the Skagerrak.|
midsummer|The Midsummer Crisis|smallsteps|stab -3 ?? Let the division pass => swdo engel; rel GER 15 // Refuse, and let the King threaten to abdicate => swpress ax 25; swcred 10; stab -3|June 1941: Berlin asks to move a whole division across Sweden to Finland. The King lets it be known he will abdicate if it is refused.|date 1941-6; req gerSovWar
transit|The Leave Trains|smallsteps|swdo transit|July 1940: German soldiers on leave may ride Swedish trains to and from occupied Norway, unarmed, in sealed carriages.|date 1940-7; req norFallen
boheman|Boheman's Negotiations|wartrade|rel ENG 10, USA 10; swpress al -12|The Secretary-General of the Foreign Ministry bargains with London and Washington over every ton of ore.|date 1943-1
endtransit|Stop the Leave Trains|boheman|swdo stop|August 1943: no more German soldiers on Swedish rails.|date 1943-8
bearings|The Ball-Bearing Agreement|boheman|swore -10; swpress al -10; rel USA 10|1944: under American pressure SKF cuts its deliveries to Germany.|date 1944-4
oreend|The Last Ore Ship|bearings|swore -40; swpress al -20; swpress ax 15|Autumn 1944: Swedish ore stops going to Germany altogether.|date 1944-10; req gerLosing
humanitarian|A Humanitarian Great Power|boheman|swcred 10; rel ENG 10, USA 10|Sweden protects the interests of a dozen belligerents and feeds the hungry of Greece.|
greece|Grain for Greece|humanitarian|rel GRE 20, ENG 5; seaton -1|Swedish ships under the Red Cross carry wheat to starving Athens through both blockades.|date 1942-1
protecting|The Protecting Power|humanitarian|pp 15; rel USA 5, GER 5, JAP 5|Swedish diplomats look after the embassies and prisoners of nations at war with each other.|
mediation|The Moscow Peace|aland|rel FIN 10, SOV 10; swcred 5|March 1940: Swedish diplomats carry the messages that end the Winter War.|req finWinter
un|The United Nations|protecting|legit 4; rel USA 5, ENG 5, SOV 5|Sweden joins the United Nations in November 1946.|date 1946-11
nonaligned|Freedom from Alliances|un|swcred 10; spirit Non-Alignment in Peace: def .04|Neutral in war, and free of alliances in peace: no Atlantic pact for Sweden.|date 1949-1
jubilee|The King's Eightieth Birthday|kingsfavour|legit 3|June 1938: the whole country celebrates the old King, who has reigned since 1907.|date 1938-6
nordicsummit|The Kings Meet in Stockholm|nordic|legit 2; rel NOR 10, DEN 10, FIN 10|October 1939: the three Nordic kings and the Finnish president meet in Stockholm and promise each other sympathy.|date 1939-10
tradetalks|The Winter Trade Talks|oretreaty|money 4; swpress ax -5|Every winter a delegation goes to Berlin to bargain coal against ore.|
# Armed Neutrality
defact36|The Defence Act of 1936|neutral|units inf 2; pp 10; spirit The 1936 Defence Act: train .05|The first increase in defence spending since the Great War, passed grudgingly.|
boden|The Boden Fortress|defact36|fort Luleå, Kiruna|The fortress on the Lule river guards the ore railway from the east.|
coast|The Coastal Artillery|boden|fort Gothenburg, Stockholm, Malmö|Batteries in the granite at Vaxholm, Älvsborg and Karlskrona.|
gotland|Fortress Gotland|coast|fort Visby; units inf 1|The island in the middle of the Baltic that every great power would like to own.|
thornell|General Thörnell|defact36|generals Olof Thörnell/3/def, Archibald Douglas/3/off|The Supreme Commander warns the government every week that Sweden is not ready.|
staff|The Defence Staff|thornell|spirit The Defence Staff: org .04, supply .05|Plans for invasion from every direction at once.|
winterwar|Winter Warfare|thornell|spirit Winter Soldiers: def .05, atk .03|Skis, white smocks, and a field kitchen pulled through the snow by a horse.|
norrland|The Norrland Army|winterwar|units mtn 2; fort Kiruna|Mountain and ski troops for the long border with Norway and Finland.|
conscription|Longer Service|defact36|mp 50 ?? A year in uniform => law extensive; mp 50 // Keep the short service => stab 2|Conscripts serve for months, not weeks.|
hemvarn|The Home Guard|defact36|units mil 4; ws 4|1940: rifles for farmers, foresters and factory workers in every parish.|date 1940-5
readiness|The Readiness|hemvarn|swdo ready|September 1939: half a million men under arms, and rationing at home.|date 1939-9
landsverk|Landsverk Tanks|defact36|build tankp 1; equip tanks 20|The works at Landskrona builds light tanks for anyone who will buy, and now for Sweden.|
strv42|Stridsvagn m/42|landsverk|equip tanks 40; units arm 1|A medium tank with a 75 mm gun, the best Sweden can build.|date 1942-1
bofors|Bofors Guns|defact36|build artyf 1; equip artillery 60|The 40 mm Bofors anti-aircraft gun: the best of its kind in the world, and every side wants it.|
boforsall|Sell Bofors to Everyone|bofors|money 10; rel ENG 5, GER 5; swcred -3|The order books from London, Berlin, Warsaw and Helsinki are all full.|
husqvarna|Husqvarna Rifles|defact36|equip arms 400; build arms 1|The sewing-machine makers of Småland turn out Mausers and submachine guns.|
defact42|The Defence Act of 1942|hemvarn,staff|units inf 4; build arms 2; money -8; spirit Total Defence: def .08, org .04|The largest defence budget in Swedish history: by 1945 Sweden has one of the strongest air forces in Europe.|date 1942-6
jung|Helge Jung|defact42|generals Helge Jung/4/def; xp|The new Supreme Commander turns a militia into a modern army.|date 1944-4
police|The Police Troops|defact42|swdo police|Norwegian and Danish refugees train in Swedish camps as "police", ready to go home.|date 1943-6
savedk|Plans for the Liberation|jung|units inf 2 ?? Plan to cross the Sound into Denmark => rel DEN 20; swpress al -15 // Plan to march into Norway => rel NOR 20; swpress al -15; units mtn 2|Spring 1945: Swedish divisions are made ready in case the Germans in Norway and Denmark refuse to surrender.|date 1944-10; req gerLosing
pansarbrig|The Armoured Brigades|strv42|units arm 1, mot 1|By 1945 the army has armoured brigades at Strängnäs and Skövde.|date 1943-6
reserveoff|Reserve Officers|staff|spirit Reserve Officers: org .03, train .05|Teachers, engineers and clerks with commissions in the reserve.|
stockpiles|Ammunition in the Mountains|husqvarna|equip arms 300, artillery 30|Shells and cartridges stored in caverns for a long war.|
# Iron and Industry
iron|Kiruna's Iron||money 6; build ironm 1|LKAB's mountain of magnetite: some of the richest ore on earth, two-thirds pure iron.|ai 5
lkab|The LKAB Question|iron|money 4 ?? Leave the company as it is => ig ind 6; money 6 // Buy out Grängesberg's half => ig ind -4; money -6; spirit State Ore: tax .04|Half of the ore company belongs to the state and half to the Grängesberg trust.|
lulea|The Luleå Harbour|iron|build port 1; infra 1|Ore trains run down to the Gulf of Bothnia, which freezes for five months of the year.|
icebreak|Icebreakers for the Gulf|lulea|seaton 1; money 4|Icebreakers keep the channel to Luleå open a few weeks longer every spring and autumn.|
ofoten|The Ofoten Railway|iron|build railway 1; rel NOR 5|The line over the mountains to Narvik, where the sea never freezes.|
inland|The Inland Railway|ofoten|build railway 1; infra 1|August 1937: the line through the forests of the interior is finished after twenty-nine years.|date 1937-8
oreforbritain|Ore for Britain|lkab|swore -10; rel ENG 10; money 2|More Kiruna ore goes west by Narvik to the furnaces of Middlesbrough.|
skf|SKF Ball Bearings|iron|build tools 2; money 4|Ball bearings from Gothenburg turn in half the machines of the world, on both sides of every front.|
asea|ASEA and the Grid|iron|build power 2|Västerås builds the transformers and turbines that carry the power of the northern rivers south.|
harspranget|Harsprånget|asea|build power 2; spirit Northern Hydropower: output .03|The greatest waterfall on the Lule river is harnessed for the cities of the south.|date 1944-1
ericsson|Ericsson|asea|build engines 1; res 10|Telephone exchanges for Stockholm, Mexico City and Istanbul.|
electrolux|Electrolux|skf|money 4; build furniture 1|Vacuum cleaners and refrigerators for the homes of the People's Home.|
volvo|Volvo Lorries|iron|build autos 2; equip autos 100|The Gothenburg car works turns from saloons to army lorries.|
gengas|Wood Gas|volvo|spirit Producer Gas: needs -.03|No petrol? Then burn birch: by 1942 most Swedish lorries carry a gas stove behind the cab.|date 1940-1
kvarntorp|Kvarntorp Shale Oil|gengas|build synth 1; dep Örebro oil 1|1942: oil cooked out of the alum shale of Närke.|date 1941-6
forest|The Forest Industry|iron|build logging 2; money 4|The pine and spruce of Norrland go to the sawmills and pulp mills of the coast.|
pulp|Pulp and Paper|forest|build chem 1; money 4|Newsprint for the papers of London, and cellulose for German explosives.|
sundsvall|The Sundsvall District|forest|build logging 1; money 2|The greatest timber district in the world, on a cold and empty coast.|
krona|The Krona and the Pound|iron|money 4 ?? Keep the krona tied to sterling => rel ENG 5; money 4 // Let the krona float => money 2; inflx -2|Since 1933 the krona has followed the pound up and down.|
match|Swedish Match After Kreuger|krona|money 6; ig ind 3|The Match King shot himself in Paris in 1932. His empire is put back together, smaller and honest.|
enskilda|The Enskilda Bank|match|money 6; ig ind 4|The Wallenberg brothers do business with both sides of the war: Jacob in Berlin, Marcus in London.|
rationing|Ration Cards|iron|stab -1; spirit Ration Cards: needs -.05, stab -1|Coffee, sugar, bread and textiles on coupons from the first winter of the war.|date 1939-9
indcomm|The Industry Commission|rationing|spirit The Industry Commission: output .03, mil_out .04|A state board decides which factory gets coal, oil and rubber.|
ikea|A Shop in Småland|electrolux|money 2; build furniture 1|1943: a seventeen-year-old in Älmhult starts selling pens and wallets by post.|date 1943-7
steelworks|Sandvik and Uddeholm|iron|build steel 2|The fine steels of Värmland and Gästrikland: razor blades, drill bits and gun barrels.|
aga|AGA Lighthouses|ericsson|res 5; money 2|Gustaf Dalén's sun valves light the coasts of every continent.|
scania|Scania-Vabis|volvo|build engines 1; equip autos 40|Lorries and diesel engines from Södertälje.|
# The Air Force and the Fleet
flygvapnet|The Air Force Programme|defact36|build aircraftp 1; equip aircraft 60|Flygvapnet is barely ten years old, and it needs everything.|
saab|Found SAAB|flygvapnet|build aircraftp 1; res 15|1937: Svenska Aeroplan AB, at Trollhättan and Linköping, to build Swedish aircraft in Sweden.|date 1937-4
saab17|The Saab 17|saab|equip aircraft 80; tech m_cas|A dive bomber on skis, built in Linköping.|date 1940-1
saab21|The Saab 21|saab17|equip aircraft 100; tech m_air2|A twin-boom pusher fighter with an ejection seat, the first in service anywhere in the world.|date 1943-7
buyabroad|Buy Aircraft Abroad|flygvapnet|equip aircraft 120; money -8 ?? Buy Italian fighters => rel ITA 10 // Buy American fighters => rel USA 10|Fiat, Reggiane and Seversky: whatever can be had before the borders close.|date 1939-6
f19|Wing F 19|flygvapnet|equip aircraft -30; rel FIN 15|Swedish volunteer pilots fly Gladiators over Lapland for Finland.|req finWinter
shelters|Shelters in the Granite|flygvapnet|spirit Rock Shelters: civdef .1|Air-raid shelters blasted into the bedrock under Stockholm, Gothenburg and Malmö.|
radar|Radar on the Coast|saab|tech m_radar|Swedish radar stations watch the Baltic and the Kattegat.|date 1942-1
fleet|The Fleet Programme|defact36|build shipyard 1; equip ships 4|Coastal defence ships, destroyers and submarines for the Baltic.|
gotlandship|HMS Gotland|fleet|equip ships 2; rel ENG 5|An aircraft cruiser that sights the Bismarck in the Kattegat in May 1941 and tells the British.|
destroyers|The Italian Destroyers|fleet|equip ships 4; rel ITA 10|Four destroyers bought from Italy in 1940, briefly seized by the British in the Faroes on their way home.|date 1940-3
trekronor|The Tre Kronor Cruisers|destroyers|equip ships 6; build shipyard 1|Two modern cruisers ordered in 1943 for the Baltic after the war.|date 1943-1
submarines|Submarines for the Sound|fleet|equip ships 3; spirit The Submarine Screen: navy .05|Small submarines watch the Sound and the Sea of Åland.|
minefields|Mine the Sound|submarines|fort Malmö; swcred 3|Swedish minefields close our waters in the Sound to every navy.|
karlskrona|The Karlskrona Yard|fleet|build shipyard 1; seaton 1|The old naval base of the Blekinge archipelago builds again.|
yards|Götaverken and Kockums|karlskrona|build shipyard 1; seaton 2|The shipyards of Gothenburg and Malmö build tankers for the world.|
j22|The J 22|saab|equip aircraft 60|1942: when America stops selling fighters, Sweden builds its own in a year, of wood and steel tube.|date 1942-9
roadbases|Road Bases in the Forest|flygvapnet|spirit Dispersed Airfields: air .05|Straight stretches of highway become runways, with hangars under the pines.|
bombers|Bombers for the Air Force|saab17|equip aircraft 40|The B 18: Sweden's own medium bomber.|date 1942-6
# Finland's Cause
finlandcause|Finland's Cause Is Ours|neutral|rel FIN 15; ws 4|"Finlands sak är vår": the slogan on every lamppost in Stockholm when the Red Army attacks.|req finWinter
volunteers|The Swedish Volunteer Corps|finlandcause|swdo finvol|Eight thousand volunteers in white smocks take over the front at Salla.|req finWinter
armsfin|Arms for Finland|finlandcause|equip arms -300, artillery -40; rel FIN 20|Bofors guns, rifles and shells go north by rail from the army's own stocks.|req finWinter
warchildren|The War Children|finlandcause|rel FIN 15; stab 1|Seventy thousand Finnish children are sent to live with Swedish families.|
haparanda|The Haparanda Border|finlandcause|fort Luleå; rel FIN 5|Refugees, wounded soldiers and smuggled coffee cross the Torne at Haparanda.|
finunion|A Union with Finland?|armsfin,warchildren|rel FIN 10 ?? Offer Finland a union of the two states => rel FIN 20, SOV -25, GER -5 // Leave Finland to its own fate => rel SOV 10|Autumn 1940: the two foreign ministers discuss a union of Sweden and Finland. Moscow and Berlin both say no.|date 1940-10
lapland|The Lapland War|haparanda|rel FIN 10; units mtn 1|1944: the Germans burn northern Finland as they retreat to Norway; Swedish ambulances wait at the border.|date 1944-9
sami|The Reindeer Herders|norrland|stab 1; ig rural 2|The Sámi keep their grazing rights across the mountains, war or no war.|
nonbel|Non-Belligerent, Not Neutral|finlandcause|swcred -5; rel FIN 15, SOV -10|December 1939: Sweden declares itself non-belligerent in Finland's war, not neutral, and sends what it can.|req finWinter
boforsfin|Bofors for Finland|armsfin|equip artillery -20; rel FIN 10; money 2|Anti-aircraft guns for Helsinki, paid for later or not at all.|req finWinter
lapps|The Lapland Railway|lapland|build railway 1; infra 1|A railway along the border, in case the Germans come from Finland.|
# A Refuge in the North
jstamp|The J Stamp|neutral|stab 1 ?? Ask Germany to mark Jewish passports => swpress ax -5; legit -6 // Refuse to ask => legit 2|Autumn 1938: Swiss and Swedish officials want to know which German visitors are Jews.|date 1938-10
evian|After Évian|jstamp|legit 2 ?? Keep the door almost shut => stab 1 // Let in the scientists and the children => res 10; legit 3|July 1938: thirty-two nations meet at Évian to discuss Germany's Jews, and almost none will take them.|date 1938-7
refuge|Open the Border|evian,humanitarian|swdo refuge|November 1942: when Norway's Jews are deported, Sweden says publicly that every refugee may come.|date 1942-11
danishjews|The October Crossing|refuge|rel DEN 25; swcred 8; mp 5|October 1943: fishing boats bring seven thousand Danish Jews across the Sound in a fortnight. Niels Bohr is among them.|date 1943-10
baltic|The Baltic Boats|refuge|mp 20; rel SOV -10|1944: thirty thousand Estonians and Latvians cross the Baltic in fishing boats.|date 1944-9
baltsoldiers|The Baltic Soldiers|baltic|stab -2 ?? Hand them over to the Soviet Union => rel SOV 20; legit -6 // Let them stay => rel SOV -20; legit 4|The Soviet Union demands the Balts who fought in German uniform. They are interned in Swedish camps.|date 1945-11
wallenberg|Raoul Wallenberg|danishjews|rel USA 15, HUN -10; legit 4|1944: a Swedish businessman with a diplomatic passport issues protective papers to thousands of Budapest Jews.|date 1944-7
whitebuses|The White Buses|wallenberg|rel NOR 15, DEN 15; legit 4; swcred 6|1945: Count Folke Bernadotte's buses, painted white with red crosses, bring fifteen thousand prisoners out of the German camps.|date 1945-3
bernadotte|Count Bernadotte's Mission|whitebuses|rel ENG 10, USA 10; pp 20|In Lübeck, Himmler asks Bernadotte to carry an offer to surrender to the West alone. The Allies refuse it.|date 1945-4
redcross|The Gothenburg Exchanges|humanitarian|legit 3; rel GER 5, ENG 5|Wounded British and German prisoners go home in each other's ships from the quays of Gothenburg.|date 1943-10
# Science and Culture
nobel|The Nobel Prizes|folkhem|legit 2; res 10|Every December the great minds of the world come to Stockholm, until the war stops the ceremonies.|
siegbahn|Siegbahn's Institute|nobel|res 25; build university 1|Manne Siegbahn's Nobel Institute for Physics opens in 1937.|date 1937-1
meitner|Lise Meitner in Stockholm|siegbahn|res 20; proj 10|1938: Lise Meitner escapes from Berlin to Stockholm, and at Christmas explains nuclear fission to her nephew on a walk in the snow.|date 1938-12
alfven|Hannes Alfvén|meitner|res 15|Plasma, magnetism and the northern lights.|
foa|The Defence Research Institute|meitner|res 20 ?? Study the atom for defence => proj 20 // Study the atom for power => build power 1|1945: the new FOA quietly asks whether Sweden should build an atomic bomb of its own.|date 1945-1
medicine|Swedish Medicine|siegbahn|spirit Swedish Medicine: growth .02|Tiselius, Theorell and the clinics of the Karolinska.|
functionalism|Functionalism|nobel|stab 1; build urban 1|White cubes and flat roofs: the style of the Stockholm Exhibition becomes the style of the People's Home.|
asplund|The Woodland Cemetery|functionalism|legit 2|Gunnar Asplund's chapel among the pines at Enskede, finished in 1940.|date 1940-6
hollywood|Garbo and Bergman|nobel|rel USA 10; legit 1|Two Swedes are the most famous women in Hollywood.|
writers|The Proletarian Writers|nobel|stab 1; ideo dem 2|Moberg, Martinson and Lo-Johansson write the lives of farmhands and stokers.|
ridenight|Ride This Night!|writers|ws 3; swpress ax 5|1941: Moberg's novel of a seventeenth-century peasant who will not bow to foreign lords. No one misses the point.|date 1941-6
pippi|Pippi Longstocking|functionalism|stab 2|1945: a girl who can lift a horse and does not need any grown-ups.|date 1945-11
taube|The Songs of Evert Taube|radio|stab 1; ws 1|Ballads of sailors, gardens and the archipelago on every gramophone.|
swedamerica|The Swedish Americans|hollywood|rel USA 10; legit 1|A million Swedes in Minnesota and Illinois write home.|
cinema|Swedish Film|hollywood|stab 1|1944: a young Ingmar Bergman writes the script of Torment.|date 1944-10
# The Government of National Unity
coalition|The Government of National Unity|gunther,election36|stab 5; pp 30; legit 3|December 1939: every party but the Communists joins one cabinet for the duration of the emergency.|date 1939-12
censorship|Press Restraint|coalition|stab 2 ?? Confiscate the papers that insult Hitler => swpress ax -6; legit -3 // Leave the press free => legit 3; swpress ax 4|The government seizes editions of the Gothenburg paper whose editor attacks Germany every day.|
segerstedt|Segerstedt's Pen|censorship|ws 3; swcred 3; rel GER -10|Torgny Segerstedt of the Göteborgs Handels- och Sjöfartstidning: "Herr Hitler is an insult."|
infoboard|The State Information Board|coalition|pp 15; ws 4|A propaganda office for a country at peace, with a great deal to keep quiet about.|
tiger|A Swedish Tiger|infoboard|spirit A Swedish Tiger: civdef .05, stab 2|1941: the poster's pun says both "a Swede keeps silent" and "a Swedish tiger" stands guard.|date 1941-1
bagge|Bagge's Conservatives|coalition|ig ind 4; legit 2|The Right sits in government beside the Social Democrats for the first time.|
farmersleague|Pehrsson-Bramstorp's Farmers|coalition|ig rural 4; stab 1|The Farmers' League minister of agriculture runs the ration system.|
election40|The Election of 1940|coalition|legit 5; pp 20|September 1940: the Social Democrats win an absolute majority, 53.8 per cent, and still govern with everyone.|date 1940-9
election44|The Election of 1944|election40|legit 3 ?? The coalition carries on => stab 2 // Prepare for peace and a Social Democratic government => pp 20; ideo dem 3|Autumn 1944: the Communists gain on the Red Army's victories; the coalition carries on to the end.|date 1944-9
# The Crown and the Right
crown|The Crown and the Right|kingsfavour|ideo aut 3; ig army 3|The officers' clubs, the Conservative youth and the old King have their own idea of what Sweden should be.|ai 1
farmersmarch|The Memory of the Farmers' March|crown|ig rural 4, army 2; ideo aut 2|In 1914 thirty thousand farmers marched to the palace to demand stronger defence, and the King spoke for them.|ai 1
courtyard|A Second Courtyard Crisis|farmersmarch|stab -5 ?? The King dismisses his ministers => setIdeo aut; leader Gustaf V/Royal Government // The King backs down => legit 4; stab 3|The King addresses the officers in the palace courtyard against his ministers' wishes, as he did in 1914.|ai 0
royalcab|A Cabinet of Officials|courtyard|pp 30; law decree; ig pb 5|Civil servants and generals govern in the King's name.|ai 0; req ideo aut
armycrown|The Army of the Crown|royalcab|units inf 3; spirit The King's Army: org .05, stab 2|The Life Guards and the officers' corps rally to Gustaf V.|ai 0; req ideo aut
crownprince|The Crown Prince|crown|legit 3; pp 10|Gustaf Adolf digs in Greece and China and, unlike his father, prefers his ministers to his generals.|
regency|The Crown Prince Regent|crownprince|legit 5; stab 3; ideo dem 3|If the old King will not keep to his constitutional role, his son will keep it for him.|ai 1
# The Activists
activists|The Activists|neutral|ideo fas 3; rel GER 10|Officers, students and professors who believe Sweden belongs at Germany's side against Bolshevism.|ai 1
lindholm|Lindholm's Movement|activists|ideo fas 5; stab -2|Sven Olov Lindholm's Swedish Socialist Union, with a wheatsheaf for its badge.|ai 1
snf|The National League of Sweden|lindholm|ideo fas 4; ig army 2|The Conservative youth breaks with its party and marches with the activists.|ai 1
kingactivist|Court the Powerful|snf|stab -4; ideo fas 4 ?? Court the old King => rel GER 10 // Court the officers => ig army 6|The activists need someone stronger than themselves.|ai 0
nsweden|A New Sweden|kingactivist|setIdeo fas; leader Sven Olov Lindholm/Swedish Socialist Union; law oneparty; stab -6|The activists take the ministries with the army's blessing.|ai 0
npress|The Party Press|nsweden|ws 6; law censorship|Dagsposten and Den Svenske Folksocialisten replace the free papers.|ai 0; req ideo fas
axis|Join the New Order|nsweden|fn joinAxis; swpress ax -50|Stockholm signs the Anti-Comintern Pact and opens its railways to the Wehrmacht.|ai 0; req ideo fas
eastvol|Volunteers for the East|axis|units inf 2; rel GER 10, FIN 10|Swedish volunteers in Finnish and SS uniforms.|ai 0; req gerSovWar
oreall|All the Ore for the Reich|axis|swore 30; rel GER 20, ENG -30|Every ore train, summer and winter, for Germany.|ai 0
greatersweden|Greater Sweden|axis|claim Trondheim, Narvik; ws 4|Trondheim was Swedish once, the activists say, and Narvik should be.|ai 0
balticdream|The Baltic Empire|greatersweden|claim Tallinn, Riga|The Sweden of Gustavus Adolphus held Reval and Riga.|ai 0
northfront|The Northern Front|eastvol|units inf 3, mtn 2; war SOV|Sweden marches with Finland on Leningrad.|ai 0; req gerSovWar & ideo fas
# The Swedish Left
linderot|Linderot's Communists|folkhem|ideo com 4|Sven Linderot's party: small, disciplined, and loyal to Moscow.|ai 1
rednorth|The Red North|linderot|ideo com 4; ig union 3|The miners of Kiruna and the lumberjacks of Norrbotten vote Communist.|ai 1
nydag|Ny Dag|rednorth|ideo com 3; ws 2|The Communist daily in Stockholm, sympathetic to Moscow even over Finland.|ai 1
transportban|The Transport Ban|nydag|stab 2 ?? Ban the Communist press from trains and the post => ideo com -4; legit -2 // Leave it be => ideo com 2|1940: the government decides which newspapers the State Railways may carry.|date 1940-2
flamman|The Norrskensflamman Bombing|rednorth|ideo com 3; stab -2|March 1940: a fascist bomb destroys the Communist paper's offices in Luleå and kills five.|date 1940-3
redwave|The Red Wave of 1944|linderot|ideo com 6; stab -2|The Communists win ten per cent in 1944 on the Red Army's victories.|date 1944-9; ai 1
peoplesrep|A Swedish People's Republic|redwave|setIdeo com; leader Sven Linderot/Communist Party; stab -8; law council|The Riksdag gives way to councils of workers and soldiers.|ai 0
nationalise|Nationalise the Banks|peoplesrep|ig ind -10; law command; money 10|The banks, the mines and the shipyards pass to the people.|ai 0; req ideo com
comintern|With Moscow|peoplesrep|fn joinComintern|Sweden joins the camp of the Soviet Union.|ai 0; req ideo com
# The Nordic Union
nordunion|A Nordic Defence Union|nordic|mkfaction Nordic Defence Union; invite NOR, DEN, FIN|Bind the North together: if one is attacked, all fight.|ai 0; req tension 50
kalmar|The Kalmar Dream|nordunion|rel NOR 10, DEN 10, FIN 10|Five centuries ago one crown ruled the whole North.|ai 0
nordcouncil|A Nordic Council|kalmar|trade NOR, DEN, FIN; rel NOR 15, DEN 15, FIN 15|Ministers meet every year, and no Nordic citizen needs a passport.|ai 0
nordindustry|Nordic Industry|nordcouncil|build arms 1, steel 1|Swedish steel, Norwegian power, Danish farms and Finnish timber in one economy.|ai 0
nordarmy|A Nordic Army|nordcouncil|units inf 3; spirit Nordic Brotherhood: def .05|Swedish, Norwegian, Danish and Finnish brigades train together in Lapland.|ai 0; req tension 60
nordfleet|A Nordic Fleet|nordarmy|equip ships 4; seaton 2|Destroyers from Karlskrona, Horten and Copenhagen in one squadron.|ai 0
nordguarantee|Guarantee the North|nordarmy|guarantee NOR, DEN, FIN|Whoever attacks one of us attacks Sweden.|ai 0
nordfed|The Nordic Federation|nordguarantee,nordindustry|pp 50; legit 5; invite NOR, DEN, FIN; spirit The Nordic Federation: stab 3, def .05|One foreign policy, one army and four parliaments.|ai 0
# The War's End
endgame|The Turn of the Tide|boheman|swpress al -10; swcred 4|After Stalingrad the question in Stockholm is no longer who will win, but when.|date 1943-2
enterwar|Enter the War?|endgame,defact42|swpress al -20 ?? Stay neutral to the end => swcred 15; stab 3 // Join the Allies => fn joinAllies; war GER|Spring 1945: the Allies would welcome Swedish divisions in Norway and Denmark. The government hesitates, and waits.|date 1945-2; req gerLosing; ai 1
intonorway|Into Norway|enterwar|units mtn 2; rel NOR 25|Swedish divisions cross into Trøndelag.|ai 0; req atwar GER
acrosssound|Across the Sound|enterwar|units inf 2; rel DEN 25|Swedish troops land in Zealand.|ai 0; req atwar GER
sovcredit|The Soviet Credit|endgame|rel SOV 15; money 6|1946: a billion kronor of credit for Soviet orders, to keep the factories busy after the war.|date 1946-10
marshall|The Marshall Plan|thirdway|money 10; rel USA 10|1948: American credits and the reopening of European trade.|date 1947-6
contribution|The Swedish Contribution|endgame|money -6; legit 4; rel NOR 10, DEN 10, FIN 10, HOL 5|1945: food, clothing and credits for the ruined neighbours.|date 1945-6
# The Baltic Neighbour
kollontai|Madame Kollontai|neutral|rel SOV 15|The Soviet minister in Stockholm, the first woman ambassador in the world, is everyone's favourite dinner guest.|
sovtrade|Trade with Moscow|kollontai|money 4; trade SOV|Swedish machinery for Soviet grain and oil, war or no war.|
channel|The Stockholm Channel|kollontai|rel SOV 10, FIN 10|1943: Finnish and Soviet diplomats meet in Swedish drawing rooms to discuss a separate peace.|date 1943-11
subincidents|Submarines off Gotland|submarines|fort Visby; rel SOV -5|Unknown submarines torpedo Swedish ships off Gotland, and everyone knows whose they are.|date 1942-6
hansa|The Sinking of the Hansa|subincidents|ws 4; rel SOV -10|November 1944: the Gotland ferry is torpedoed at night; eighty-four die.|date 1944-11
# The Home Front
coffee|No Coffee|rationing|stab -1 ?? Chicory and roasted rye => stab -1 // Buy coffee through the blockade => money -4; stab 1|Coffee is rationed from 1940, which the Swedes take harder than anything else.|date 1940-6
gardens|Potatoes in the Parks|rationing|spirit Kitchen Gardens: farm_out .02|Allotments in every town park.|
blackout|The Blackout|shelters|spirit The Blackout: bombing -.05, stab -1|The coast goes dark at night.|
vasaloppet|The Vasaloppet|radio|ws 2; stab 1|Ninety kilometres on skis from Sälen to Mora, in the tracks of Gustav Vasa.|
cbureau|The C Bureau|thornell|fn intelBoost|The secret intelligence service, in two rooms of the Defence Staff.|
beurling|Arne Beurling's Pencil|cbureau|spirit The Geheimschreiber Broken: def .03, atk .02|May 1940: in two weeks, a mathematics professor breaks the German teleprinter cipher with pencil and paper.|date 1940-5
firewood|Firewood for the Cities|rationing|stab 1; build logging 1|The hard winters of 1940 and 1942: no coal comes, so the forests warm the towns.|date 1940-11
gasmasks|Gas Masks for the People|shelters|spirit Gas Masks: civdef .05|A gas mask in a tin for every Swede.|
# The North
norrbotten|The Norrbotten Question|norrland|stab 2; build railway 1|The poorest county in Sweden sits on its richest ore.|
tornedalen|The Torne Valley|norrbotten|stab 1; rel FIN 5|Finnish-speaking villages along the border, taught in Swedish.|
narvikore|The Ore Trapped at Narvik|ofoten|money -4 ?? Stockpile at Kiruna => money -4 // Send it all by Luleå => swore 5|April 1940: the war in Norway stops the trains to Narvik; the ore piles up at Kiruna.|date 1940-4; req norFallen
kirunadef|The Defence of Kiruna|narvikore,norrbotten|fort Kiruna; units mtn 1|Anti-aircraft guns on the mountain and demolition charges in the mine.|
svedberg|Svedberg's Centrifuge|siegbahn|res 15|The Svedberg spins proteins in Uppsala at forty thousand turns a minute.|
wennergren|Wenner-Gren on the Blacklist|enskilda|money -4 ?? Stand by him => rel GER 5; rel ENG -10 // Let him go => rel ENG 10; ig ind -3|1942: the Allies blacklist the founder of Electrolux, a friend of Göring.|date 1942-1
ballrun|The Ball-Bearing Run|bearings|swdo bearings|Unarmed Mosquitoes of the British airline fly SKF bearings from Stockholm to Leuchars by night.|date 1943-1
shiplosses|Ships Lost at Sea|lejd|seaton -1; ws 3|Two hundred Swedish ships are sunk by mines and submarines of every navy.|date 1941-1
latam|Trade with the Americas|lejd|money 6; rel ARG 10, BRA 10|Argentine hides and Brazilian coffee for Swedish machines, through the Gothenburg traffic.|
danforce|The Danish Brigade|police|rel DEN 20; units inf 1|Danish refugees train as a brigade in Swedish camps, to go home in 1945.|date 1943-11
norhelp|Help for Norway|refuge|rel NOR 20; money -3|Food parcels, hospitals and a refugee office for the fifty thousand Norwegians who cross the border.|date 1942-1
`);

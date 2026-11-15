// Luxembourg (2.2): hand-written. Bech's and Dupong's Grand Duchy; the Muzzle Law; perpetual neutrality without an army;
// Radio Luxembourg, whose airtime the great powers buy, and ARBED's steel, whose contracts they want; the invasion and
// Gauleiter Simon's Germanisation; the general strike; the government in London and Montreal; the Battle of the Bulge;
// and the end of neutrality, with Luxembourg at the founding of every European institution.
'use strict';
TREES.LUX = autoTree('lx_', `
# Bech's Grand Duchy
bech|Bech's Government||pp 30; stab 3|Joseph Bech, Prime Minister since 1926, governs a country of three hundred thousand with a Catholic majority and a liberal touch.|ai 6
rightparty|The Party of the Right|bech|stab 2; ig devout 3|The Catholic party of the farmers of the north and the middle class of the capital.|
socialists|The Socialist Workers|bech|ig union 3; ideo dem 2|The party of the steelworkers of the south.|
liberals|The Liberals|bech|ig ind 2; legit 1|Freethinkers and businessmen of the capital.|
dupong|Pierre Dupong|bech|leader Pierre Dupong/Party of the Right; pp 20; stab 2|November 1937: after the Muzzle Law fails, Bech's colleague forms a coalition with the Socialists, and will lead it through the war.|date 1937-11
coalition|The Black-Red Coalition|dupong|stab 3; ig union 3|Catholics and Socialists govern together for the first time.|
krier|Pierre Krier, Minister of Labour|coalition|ig union 4; stab 2|A former steelworker as minister: collective agreements and social insurance.|
socialinsurance|Social Insurance|krier|money -2; stab 2|Sickness, accident and old-age insurance for the workers of the south.|
workweek|The Steelworkers' Contracts|krier|ig union 3; stab 1|National collective agreements for the iron and steel industry.|
centenary|The Centenary of Independence|bech|legit 4; ws 3|April 1939: a hundred years since the Treaty of London left Luxembourg independent. Flags in every window.|date 1939-4
civilservice|The State Administration|bech|pp 10; legit 1|A small state, run by a few hundred civil servants who know every family.|
farmers|The Farmers of the Ösling|rightparty|ig rural 3; build farm 1|Poor hill farms in the Ardennes north of the country.|
chamber|The Chamber of Deputies|bech|legit 2|Fifty-five deputies elected by the four constituencies.|
councilofstate|The Council of State|chamber|legit 1; stab 1|A council of wise men who review every law.|
womenvote|Votes for Women|chamber|legit 2|Luxembourg women have voted since 1919, earlier than the women of France or Belgium.|
labourcouncil|The National Labour Council|krier|ig union 3; stab 2|1936: unions, employers and the state meet in one council.|date 1936-10
communes|The Communes|councilofstate|stab 1|A hundred and twenty-six communes, each with its burgomaster.|
tageblatt|The Escher Tageblatt|socialists|ideo dem 1; ig union 1|The socialist daily of the steel towns.|
luxzeitung|The Luxemburger Zeitung|liberals|legit 1|The liberal paper of the capital.|
pressrestraint|Neutral Restraint|neutrality|stab 1 ?? Ask the papers to be careful => rel GER 5 // Let them write freely => legit 2|1939: the government asks the newspapers not to offend any belligerent.|date 1939-9
# The Muzzle Law
muzzle|The Order Law|bech|ideo com -2; stab -1|1937: Bech proposes a law to dissolve the Communist party and any organisation that threatens the constitution.|date 1937-3
muzzlecampaign|The Muzzle Law Campaign|muzzle|stab -2 ?? Campaign for the law => ideo com -2; legit -2 // Let the people decide freely => legit 2|Socialists, Liberals and Communists call it the Maulkuerfgesetz, the Muzzle Law.|
referendum|The Referendum of June 1937|muzzlecampaign|legit 4; stab -2 ?? Accept the people's no => legit 4 // Ignore the vote => legit -6; stab -2|6 June 1937: by a margin of under four thousand votes, the people reject the law. Bech resigns.|date 1937-6
democraticvictory|A Democratic Victory|referendum|ideo dem 4; stab 2|The Grand Duchy has decided that liberty includes the liberty of those one dislikes.|
# The Neutral Grand Duchy
neutrality|Perpetual Neutrality||pp 15; legit 2|Since 1867 Luxembourg has been neutral by treaty, its fortress razed, its army abolished.|ai 6
treatylondon|The Treaty of London|neutrality|legit 2; rel ENG 5, FRA 5, GER 5|The great powers guaranteed our neutrality in 1867. Germany broke it in 1914.|
benelecon|The Belgian Economic Union|neutrality|trade BEL; rel BEL 10; money 2|Since 1921 Luxembourg and Belgium share one customs territory and one currency system.|
oslostates|The Oslo States|neutrality|trade HOL, SWE, NOR, DEN|The small neutrals of the north and the west trade together.|
schusterline|The Schuster Line|neutrality|fort Luxembourg; spirit The Schuster Line: def .03|1939: concrete blocks and iron gates on the bridges across the Sauer and the Moselle, named after the engineer who built them.|date 1939-9
volunteercompany|The Volunteer Company|neutrality|units mil 1|A company of a few hundred volunteers and the gendarmerie: the whole armed force of the Grand Duchy.|
gendarmes|The Gendarmerie|volunteercompany|stab 1; units mil 1|Two hundred and fifty gendarmes guard the borders and the ministries.|
neutralitynotes|Notes to Berlin and Paris|treatylondon|legit 2|Every month the Foreign Ministry reminds the great powers of their promises.|
frenchties|French Friendship|treatylondon|rel FRA 10|French culture, French newspapers, and the French language of the courts.|
germanties|German Trade|treatylondon|rel GER 5; money 2|Coke from the Ruhr for the blast furnaces of Esch.|
leaguemember|A Member of the League|treatylondon|legit 2 ?? Stay bound by Article Sixteen => rel ENG 5, FRA 5 // Declare ourselves free of sanctions => rel GER 5|The smallest member of the League of Nations.|date 1936-7
mobilisationplan|A Plan for the Tenth of May|schusterline|stab 1|What to do if the Germans come: the government will leave, and the Grand Duchess with it.|date 1940-1
airwardens|The Air-Raid Wardens|casemates|spirit Passive Defence: civdef .04|Volunteers with helmets and armbands in every street.|date 1939-9
redcrosslux|The Luxembourg Red Cross|airwardens|stab 1; legit 1|Ambulances, blood and parcels for prisoners.|
customs|The Customs Officers|gendarmes|stab 1|Customs men on every border road, the eyes of the state.|
borderposts|The Border Posts|customs|fort Esch|Posts on the roads from France and Germany.|
rationing|Ration Cards|neutrality|spirit Ration Cards: needs -.04|September 1939: coffee, sugar and petrol on cards.|date 1939-9
pricecontrol|Price Control|rationing|inflx -2; stab 1|A price office fixes what bread and coal may cost.|
smugglers|The Smugglers|rationing|money 2; stab -1|Tobacco, coffee and butter across every border at night.|
refugees|Refugees from Germany|neutrality|legit 2 ?? Let them stay => legit 2; rel GER -5 // Send them on to France => stab 1|Jews and socialists from across the Moselle look for safety in the Grand Duchy.|
nassau|The House of Nassau|charlotte|rel HOL 10|Our grand dukes are cousins of the Queen of the Netherlands.|
holyrome|The Holy See|wort|legit 1; ig devout 1|The papal nuncio in the capital, the bishop in the cathedral.|
swissmodel|The Swiss Example|neutrality|legit 1 ?? Stay unarmed, as the treaty says => legit 1 // Arm, like the Swiss => units mil 1; money -2|Switzerland is neutral and armed; Luxembourg is neutral and disarmed.|
germanembassy|The German Legation|germanties|rel GER 5; stab -1|A German minister in the capital who knows too much about everyone.|
# Radio Luxembourg
radiolux|Radio Luxembourg||money 4; pp 5|The most powerful transmitter in Europe, at Junglinster, financed by advertising in every language.|ai 5
englishsunday|English Sunday Programmes|radiolux|lxair ENG; money 2|On Sundays, when the BBC plays hymns, Britain listens to dance bands and soap adverts from Luxembourg.|
frenchprograms|Programmes for France|radiolux|lxair FRA; money 2|French announcers, French songs, French advertisers.|
germanprograms|Programmes for Germany|radiolux|lxair GER; money 2; rel GER 5|Light music for the Reich, approved by Goebbels' ministry.|
neutralair|Keep the Airwaves Neutral|radiolux|lxair -|Music, advertisements, and no politics.|
ovaltineys|The Ovaltineys|englishsunday|rel ENG 5; money 1|"We are the Ovaltineys, little girls and boys": the children's club of Radio Luxembourg.|
newsdesk|A News Service|radiolux|pp 5; ws 2|News bulletins in five languages.|
offair|Off the Air|radiolux|stab -1|21 September 1939: the government closes the station to protect our neutrality.|date 1939-9
germanstation|The Reich's Transmitter|offair|stab -2|1940: the Germans seize Junglinster and broadcast propaganda to Britain and France from it.|req luxFallen
radioannie|Radio Annie|germanstation|rel USA 10; ws 3|1944: liberated Radio Luxembourg broadcasts American "black" propaganda to the German army under the name Radio Annie.|date 1944-10
clr|The Radio Company|radiolux|money 2; pp 5|The Compagnie Luxembourgeoise de Radiodiffusion, founded in 1931 with French capital.|
transmitter|The Junglinster Transmitter|clr|money 2; ws 1|Two hundred kilowatts: the voice of Luxembourg reaches from Ireland to Poland.|
belgianprogrammes|Programmes for Belgium|clr|lxair BEL; rel BEL 5|Belgian advertisers and Belgian listeners.|
italianprogrammes|Programmes for Italy|clr|lxair ITA; rel ITA 5|Italian songs and advertisements, paid for in lire.|
americanprogrammes|Programmes for America|radioannie|lxair USA; rel USA 10|After the war, American programmes from the free station.|
radiorelaunch|Radio Luxembourg Returns|americanprogrammes|money 4; legit 2|November 1945: the station goes back on the air for its own listeners and advertisers.|date 1945-11
# ARBED and the Minette
arbed|ARBED||money 6; build steel 1|The United Steelworks of Burbach, Eich and Dudelange: more steel for each Luxembourger than any people on earth produces.|ai 5
minette|The Minette|arbed|build ironm 1; money 2|The red iron ore of the south, phosphorous and poor, which only the Thomas process made valuable.|
esch|Esch-sur-Alzette|arbed|build urban 1; stab 1|The steel town, the second city of the Grand Duchy.|
belval|The Belval Furnaces|esch|build steel 1|Blast furnaces at the edge of Esch.|
differdange|Differdange and Hadir|arbed|build steel 1; money 2|The rival steel company, with French and Belgian owners.|
dudelange|The Dudelange Works|arbed|build steel 1|The rolling mills by the French border.|
contractfrance|Steel for France|arbed|lxsteel FRA; rel FRA 10|ARBED rolls rails and beams for France.|
contractgermany|Steel for Germany|arbed|lxsteel GER; rel GER 10|The Saar and the Ruhr need our steel too.|
contractbelgium|Steel for Belgium|arbed|lxsteel BEL; rel BEL 10|Our partner in the economic union buys first.|
contractbritain|Steel for Britain|arbed|lxsteel ENG; rel ENG 10|Sheet steel for British car factories.|
steelcartel|The International Steel Cartel|arbed|money 4; rel FRA 5, GER 5, BEL 5|The European steel cartel has its seat in Luxembourg, and its president is ARBED's Aloyse Meyer.|
meyer|Aloyse Meyer|steelcartel|money 2; ig ind 4|The director-general of ARBED, the most powerful man in the country after the Grand Duchess.|
miners|The Iron Miners|minette|ig union 3; stab -1|Miners of the Minette, many of them Italian immigrants.|
italians|The Italian Workers|miners|mp 5; stab 1|Thousands of Italians in Esch and Dudelange, with their own priests and their own anarchists.|
railways|The Railways|arbed|build railway 1; infra 1|The Prince Henri and Guillaume-Luxembourg lines, run by foreign companies.|
steelunion|The Steelworkers' Union|miners|ig union 3|The metalworkers' federation of the south.|
thomasslag|Thomas Slag|minette|money 2; build farm 1|The slag of the Thomas converters is sold as fertiliser for the fields.|
steelforreich|Steel for the Reich|contractgermany|money 2; rel GER 10; stab -2|After 1940 every furnace works for the German war economy.|req luxFallen
belgomineira|Belgo-Mineira|arbed|rel BRA 10; money 2|ARBED's steelworks in Minas Gerais, Brazil.|
saarworks|The Saar Works|arbed|rel GER 5; money 2|Burbach and the other ARBED works in the Saar.|
cokeruhr|Coke from the Ruhr|arbed|rel GER 5|Every blast furnace in the Grand Duchy burns German coke.|
germanmanagers|German Managers|steelforreich|stab -2; money -2|Göring's industrial empire puts its own men in charge of the works.|req luxFallen
schifflange|The Schifflange Strike|germanmanagers|ws 4; stab -2|The steelworkers of the south join the general strike of 1942.|date 1942-9; req luxFallen
furnacemodern|New Converters|belval|build steel 1; money -2|Bigger converters and a new rolling mill.|
findel|The Findel Airfield|railways|build railway 1|1946: an airfield for the capital on the plateau of Findel.|date 1946-1
trams|The Capital's Trams|railways|stab 1|Electric trams from the station to the old town.|
posts|Posts and Telegraphs|railways|stab 1; pp 2|The post offices in every village, and the telephone to Brussels.|
cfl|The National Railways|railways|build railway 1; infra 1|1946: the railways pass to a national company.|date 1946-4
# The Grand Ducal House
charlotte|Grand Duchess Charlotte|bech|legit 4; stab 2|The young Grand Duchess who saved the dynasty in the referendum of 1919.|
felix|Prince Felix|charlotte|legit 1|The consort, a Bourbon-Parma prince and an officer.|
jean|Hereditary Grand Duke Jean|charlotte|legit 2; stab 1|The heir, fifteen in 1936.|
irishguards|Jean in the Irish Guards|jean|rel ENG 10; ws 3|1942: the Hereditary Grand Duke joins the Irish Guards, and will land in Normandy.|date 1942-11; req luxFallen
charlottebbc|The Grand Duchess on the BBC|charlotte|ws 6; legit 3|Her broadcasts from London are listened to in every kitchen, in secret.|req luxFallen
charlotteflees|The Flight of the Grand Duchess|charlotte|legit 3; rel FRA 5|10 May 1940: the Grand Duchess and the government leave by car for France.|req atwar GER
charlottereturn|The Return of the Grand Duchess|charlottebbc|legit 8; stab 6; ws 4|14 April 1945: the Grand Duchess comes home to a liberated capital.|date 1945-4
# The Tenth of May
invasion|The Tenth of May|schusterline|ws 4|At dawn German columns cross the bridges of the Sauer and the Our.|req atwar GER
gendarmesfire|The Gendarmes Fire|invasion|ws 2; legit 2|A few gendarmes and volunteers fire on the invaders; the Volunteer Company stays in its barracks as ordered.|req atwar GER
governmentleaves|The Government Leaves|invasion|legit 3|The ministers follow the Grand Duchess to France, then Portugal, then London and Montreal.|req atwar GER
admincommission|The Administrative Commission|governmentleaves|stab 1 ?? Let the civil servants run the country => stab 1; legit -2 // Refuse to serve the occupier => legit 3; stab -2|Senior officials stay behind to run the country under the Germans.|req luxFallen
# Gauleiter Simon
simon|Gauleiter Simon|governmentleaves|stab -4|July 1940: Gustav Simon, Gauleiter of Koblenz-Trier, arrives to make Luxembourg German.|req luxFallen
nofrench|French Is Forbidden|simon|ws 3; stab -2|August 1940: no more French in the streets, the shops or the names. Pierre becomes Peter.|date 1940-8; req luxFallen
vdb|The Volksdeutsche Bewegung|simon|ideo fas 2; stab -2|The Germans' own movement: "Heim ins Reich". Membership is compulsory for officials.|req luxFallen
census|Three Times Luxembourgish|nofrench|ws 8; stab -2|10 October 1941: the census asks for nationality, mother tongue and ethnicity. Ninety-five per cent answer: Luxembourgish, Luxembourgish, Luxembourgish.|date 1941-10; req luxFallen
annexation|The Annexation|census|stab -4|August 1942: Luxembourg is declared part of the Reich, its young men subject to German conscription.|date 1942-8; req luxFallen
generalstrike|The General Strike|annexation|ws 8; stab -6|31 August 1942: Luxembourg strikes against conscription. Twenty-one strikers are shot.|date 1942-8; req luxFallen
onsjongen|Ons Jongen|generalstrike|mp -20; ws 4|Ten thousand young Luxembourgers are forced into the Wehrmacht; three thousand will not come back.|req luxFallen
deportations|The Resettlements|generalstrike|stab -3; ws 3|Whole families of strikers and resisters are deported to Silesia.|req luxFallen
refractaires|The Refractaires|onsjongen|resist SELF 6; ws 3|Young men who refuse the call-up hide in bunkers in the forests and in mine galleries.|req luxFallen
requisitions|The Requisitions|simon|stab -2|The Germans take cars, bicycles, radios and church bells.|req luxFallen
reichsmark|The Reichsmark|requisitions|money -4; stab -2|February 1941: the Luxembourg franc is abolished.|date 1941-2; req luxFallen
germanlaw|German Law|reichsmark|legit -3; stab -2|Courts, taxes and registers become German.|req luxFallen
deportationjews|The Jews of Luxembourg|simon|ws 3; legit -2|October 1941: the first deportation from Luxembourg; of four thousand Jews in 1940, fewer than a thousand survive.|date 1941-10; req luxFallen
fuenfbrunnen|Fünfbrunnen|deportationjews|ws 2|The monastery at Cinqfontaines in the north becomes a prison for the old and the sick before deportation.|req luxFallen
# The Resistance
lpl|The Patriots' League|charlottebbc|resist SELF 5|The Lëtzebuerger Patriote Liga, one of the first resistance groups.|req luxFallen
pimen|The PI-Men|lpl|resist SELF 4|The Patriotic Independent men: couriers, forgers and escape guides.|req luxFallen
lvl|The Luxembourg Volunteer Legion|lpl|resist SELF 4; units mil 1|Former volunteers and scouts who train in secret.|req luxFallen
unioun|The Union of the Resistance|lvl,pimen|resist SELF 5; legit 3|1944: the movements unite as the Unio'n.|date 1944-3; req luxFallen
escapeline|The Escape Lines|pimen|rel ENG 5, BEL 5|Refractaires and Allied airmen guided across the border into Belgium and France.|req luxFallen
hinzert|Hinzert|simon|ws 3; stab -2|The camp in the Hunsrück where Luxembourgers are sent and shot.|req luxFallen
clandestinepress|The Clandestine Papers|lpl|ws 3|Typed and stencilled sheets passed from hand to hand under the occupation.|req luxFallen
# London and Montreal
dupongexile|The Government in Exile|governmentleaves|pp 20; legit 4|The ministers divide between London and Montreal, so that some of them are always safe.|req luxFallen
montreal|Dupong in Montreal|dupongexile|rel CAN 15, USA 10|The Prime Minister governs from Canada, close to the Grand Duchess's children.|req luxFallen
bechlondon|Bech in London|dupongexile|rel ENG 15; legit 2|The foreign minister represents the Grand Duchy among the Allies.|req luxFallen
alliedlux|An Allied Nation|bechlondon|fn joinAllies; legit 4|The smallest of the Allies signs the Declaration of the United Nations.|date 1942-1; req luxFallen
battery|The Luxembourg Battery|alliedlux|units inf 1; rel BEL 10|Luxembourg volunteers serve as a battery of the Belgian Piron Brigade, and land in Normandy.|req luxFallen
exilefunds|The Funds Abroad|dupongexile|money 4|ARBED's foreign holdings and the gold sent to safety keep the government in exile going.|req luxFallen
gutttalks|Talks on the Benelux|bechlondon|rel BEL 10, HOL 10|1944: in London, Bech, Spaak and Van Kleffens agree on a customs union for after the war.|date 1944-6; req luxFallen
americanlux|The Luxembourgers of America|montreal|rel USA 10|Chicago and Dubuque have more Luxembourgers than Esch.|
stjames|The St James's Palace Declaration|bechlondon|legit 2; rel ENG 5|June 1941: the governments in exile pledge to fight on together.|date 1941-6; req luxFallen
brettonwoods|Bretton Woods|stjames|money 2; rel USA 5|July 1944: the smallest delegation at the monetary conference in New Hampshire.|date 1944-7
unrra|UNRRA|stjames|rel USA 5; stab 1|Relief for liberated Europe, planned in exile.|date 1943-11
emigrants|The Emigrants|americanlux|mp -2; rel USA 5|Luxembourgers leave for Paris, Brussels and America to find work.|
# The Liberation and the Bulge
liberation|The Americans Arrive|charlottebbc|ws 6; legit 4; stab 4|10 September 1944: American troops enter the capital; the Gauleiter has fled.|date 1944-9; req luxFallen
bulge|The Battle of the Bulge|liberation|stab -6; ws 4|16 December 1944: the Germans attack through the Ardennes; the north of the country is fought over for six weeks.|date 1944-12
clervaux|Clervaux and Wiltz|bulge|stab -2; ws 2|The towns of the Ösling burn; their people hide in cellars.|date 1944-12
diekirch|The Crossing at Diekirch|bulge|ws 3|January 1945: Patton's army crosses the Sauer back into the north.|date 1945-1
vianden|The Defence of Vianden|bulge|ws 3; resist SELF 3|November 1944: thirty resistance fighters hold the castle town against an SS company.|date 1944-11
patton|Patton's Grave|bulge|rel USA 15; legit 2|General Patton is buried among his soldiers at Hamm, as he asked.|date 1946-1
warDamage|The War Damage|bulge|build urban 1, railway 1; money -4|Rebuilding the villages of the north, one farmhouse at a time.|date 1945-3
americancemetery|The American Cemetery|patton|rel USA 10|Five thousand American soldiers buried at Hamm.|date 1946-1
ashcan|Ashcan|liberation|rel USA 10, ENG 10|May 1945: the Palace Hotel at Mondorf-les-Bains holds Göring, Ribbentrop, Keitel and fifty other Nazi leaders before Nuremberg.|date 1945-5
bulgerefugees|The Refugees of the Bulge|bulge|stab -2; money -2|Fifty thousand from the north flee south through the snow.|date 1944-12
# The End of Neutrality
endneutrality|Neutrality Is Over|liberation|legit 3|The treaty of 1867 did not protect us twice. Luxembourg will defend itself, with friends.|date 1944-10
conscriptionlux|Conscription|endneutrality|units inf 1; mp 10|1944: Luxembourg introduces military service for the first time.|date 1944-11
army|A Luxembourg Army|conscriptionlux|units inf 1; equip arms 200|A battalion, then two, trained by the British and equipped by the Americans.|date 1945-6
benelux|The Benelux|endneutrality|trade BEL, HOL; rel BEL 15, HOL 15|1948: the customs union of the three small countries comes into force.|date 1948-1
unitednations|The United Nations|endneutrality|legit 4; rel USA 5, ENG 5|Luxembourg signs the Charter at San Francisco.|date 1945-6
constitution48|The Constitution of 1948|endneutrality|legit 3 ?? Strike out neutrality => rel ENG 5, FRA 5 // Keep it in the constitution => legit 2|April 1948: the word "neutral" is struck from the constitution.|date 1948-4
brusselstreaty|The Brussels Treaty|constitution48|rel ENG 10, FRA 10, BEL 10, HOL 10|March 1948: Luxembourg joins the Western Union.|date 1948-3
nato|The Atlantic Pact|brusselstreaty|fn joinAllies; rel USA 10|1949: a founding member of NATO, the smallest one.|date 1949-4
korea|Volunteers for Korea|nato|units inf -1; rel USA 10|1950: Luxembourg volunteers go to Korea with the Belgian battalion.|date 1950-9
schuman|Robert Schuman|endneutrality|rel FRA 15; legit 2|Born in Luxembourg in 1886, he is now the French foreign minister with a plan.|date 1948-7
highauthority|The High Authority|schuman|money 6; legit 4; build urban 1|1952: the European Coal and Steel Community makes its seat in Luxembourg.|date 1950-5
councileurope|The Council of Europe|brusselstreaty|legit 2|1949: Luxembourg is among the ten founders.|date 1949-5
europeanmovement|The European Movement|councileurope|legit 2|Bech goes to the Hague Congress of 1948.|date 1948-5
oeec|The OEEC|marshall|rel FRA 5, BEL 5|The organisation that shares out the Marshall money.|date 1948-4
# The Bankers' Grand Duchy
holdinglaw|The Holding Law|bech|money 6; ig ind 3|The 1929 law that lets holding companies settle in Luxembourg almost untaxed.|
bil|The Banque Internationale|holdinglaw|money 4|The oldest bank in the country, founded in 1856.|
spuerkeess|The Savings Bank|bil|money 2; stab 1|The state savings bank, where every family keeps its money.|
stockexchange|The Luxembourg Stock Exchange|bil|money 3|Founded in 1928, for bonds from half the world.|
luxfranc|The Luxembourg Franc|holdinglaw|money 2 ?? Keep par with the Belgian franc => rel BEL 5 // Insist on our own value => legit 1; money 2|Luxembourg prints its own francs, worth the same as Belgium's.|
insurance|La Luxembourgeoise|spuerkeess|money 2|An insurance company for the farmers and shopkeepers.|
foreigncapital|Foreign Capital|stockexchange|money 4; rel BEL 5, FRA 5|French and Belgian capital owns half of our industry.|
# The Land and the People
remain|We Want to Remain What We Are|bech|ws 4; stab 2|"Mir wëlle bleiwe wat mir sinn": the line from a song of 1859 that becomes the motto of a people.|
language|Lëtzebuergesch|remain|ws 3; stab 1|A Moselle Franconian dialect, the Germans say. A language, Luxembourgers answer.|
trilingual|The Three Languages|language|spirit Three Languages: literacy .02|School in German, law in French, life in Luxembourgish.|
gellefra|The Golden Lady|remain|ws 4; legit 2|October 1940: the Germans pull down the memorial to the Luxembourgers who died for France in 1914. Students who protest are arrested.|date 1940-10; req luxFallen
moselle|The Moselle Wine|farmers|money 2; build farm 1|White wines from Remich and Grevenmacher.|
echternach|The Dancing Procession|remain|stab 2|Every Whit Tuesday thousands dance through Echternach in honour of Saint Willibrord.|
viandencastle|Vianden|echternach|legit 1|The castle above the Our, where Victor Hugo once spent his exile.|
casemates|The Bock Casemates|remain|fort Luxembourg; spirit The Old Fortress: civdef .05|Seventeen kilometres of tunnels under the old fortress shelter thirty-five thousand people during the air raids.|date 1939-9
schueberfouer|The Schueberfouer|remain|stab 1|The great fair of the capital, held every August since 1340.|
wort|The Luxemburger Wort|rightparty|pp 5; ig devout 2|The Catholic newspaper, read in every village.|
octave|The Octave of Our Lady|wort|stab 1; ig devout 2|Pilgrims from every parish walk to the cathedral every spring.|
mullerthal|Little Switzerland|echternach|money 1|Sandstone gorges and forests in the east, for the walkers of Belgium and Holland.|
beaufort|The Castles|viandencastle|legit 1; money 1|Beaufort, Clervaux, Larochette: a castle on every hill.|
clervauxabbey|The Abbey of Clervaux|beaufort|stab 1; ig devout 1|The Benedictines of the north.|
winecoops|The Wine Cooperatives|moselle|money 1; ig rural 2|The winegrowers of the Moselle press their grapes together.|
mondorf|Mondorf-les-Bains|moselle|money 1|The spa on the French border.|
schengen|Schengen|moselle|stab 1|A wine village where Luxembourg, France and Germany meet on the river.|
wasserbillig|Wasserbillig|schengen|fort Luxembourg|The border crossing where the Sauer flows into the Moselle, across from Germany.|
grevenmacher|Grevenmacher|schengen|money 1|The wine town of the lower Moselle, with its own cellars.|
remich|The Remich Bridge|schengen|build railway 1|The bridge to France, blown up in 1944 and rebuilt.|
luxcity|The City of Luxembourg|bech|build urban 1; legit 1|The old fortress town on its rock, with its gorges and bridges.|
adolphebridge|The Adolphe Bridge|luxcity|infra 1|The great stone arch over the Pétrusse valley, the largest of its kind when it was built.|
palace|The Grand Ducal Palace|luxcity|legit 1 ?? Protect it => legit 1 // Let the Germans use it => stab -1|The Germans turn the palace into a tavern and a concert hall.|req luxFallen
cathedral|The Cathedral of Notre-Dame|luxcity|ig devout 1; stab 1|The Jesuit church that became a cathedral, with its crypt of the grand dukes.|
kirchberg|The Kirchberg Plateau|luxcity|build urban 1|Empty fields across the valley from the old town, waiting for a future.|date 1948-1
osling|The Ösling|farmers|stab 1|The Luxembourg Ardennes: forests, slate and poor villages.|
wiltz|Wiltz|osling|ws 3|The town where the general strike of 1942 begins.|date 1942-8; req luxFallen
ettelbruck|Ettelbruck|osling|build railway 1|The railway junction of the north.|
gutland|The Gutland|farmers|build farm 1|The good land of the centre: wheat, cattle and orchards.|
minettestyle|The Minett|miners|stab 1; ig union 1|The red-earth country of the south, with its own dialect and its own football clubs.|
# Heim ins Reich
kratzenberg|Damian Kratzenberg|bech|ideo fas 2|A German teacher at the Athénée who believes Luxembourg is German land.|ai 1
volksjugend|The German Youth|kratzenberg|ideo fas 2; stab -1|Rallies, songs and hikes for the young, paid for from across the border.|ai 1
heimreich|Home to the Reich|volksjugend|setIdeo fas; leader Damian Kratzenberg/Volksdeutsche Bewegung; stab -12; legit -15|The Volksdeutsche Bewegung takes the Grand Duchy into the Reich of its own will.|ai 0
gauleiterrule|A Gau of the Reich|heimreich|fn joinAxis; legit -4|Luxembourg joins the Gau Moselland.|ai 0; req ideo fas
germanschools|German Schools Only|gauleiterrule|ws 2; stab -3|French disappears from the timetable.|ai 0; req ideo fas
eastfront|Luxembourgers in the Wehrmacht|gauleiterrule|units inf 1; rel GER 5|Volunteers, and many more who are not.|ai 0; req ideo fas & gerSovWar
# The Communists
kpl|The Communist Party|socialists|ideo com 3|Founded in 1921, strong among the miners of the Minette.|ai 1
urbany|Dominique Urbany|kpl|ideo com 2|A railwayman who leads the party out of the war.|ai 1
redesch|Red Esch|kpl|ideo com 3; ig union 2|The steel town votes Communist in the shadow of the furnaces.|ai 1
kpl1945|The Election of 1945|redesch|ideo com 4|The Communists win eleven per cent and a minister in the government of national union.|date 1945-10; ai 1
peopleslux|A People's Grand Duchy|kpl1945|setIdeo com; leader Dominique Urbany/Communist Party; stab -8|The Grand Duchess abdicates; the councils of the Minette govern.|ai 0
redcamp|With Moscow|peopleslux|fn joinComintern|Luxembourg joins the camp of the Soviet Union.|ai 0; req ideo com
# Union or Greatness
belgianunion|A Union with Belgium?|benelecon|rel BEL 10 ?? Draw closer to Brussels => rel BEL 15; legit -2 // Keep our sovereignty => legit 3|Belgium asked for Luxembourg in 1919; the Luxembourgers voted for their own Grand Duchess instead.|
commonarmy|A Common Defence with Belgium|belgianunion|units inf 1; rel BEL 10|Belgian officers train our volunteers.|ai 1
thionville|The Lost Lands of Thionville|neutrality|claim Metz; ws 2|Thionville belonged to the Duchy of Luxembourg until 1659.|ai 0
bitburg|The Lost Lands of the Eifel|thionville|claim Koblenz; ws 2|Prussia took Bitburg and Sankt Vith in 1815.|ai 0
greaterlux|A Greater Luxembourg|bitburg|legit -2; ws 4|The old duchy was four times the size of the Grand Duchy.|ai 0
# The Army of the Grand Duchy
volunteers40|The Volunteers of 1940|volunteercompany|units mil 1; ws 2|The Volunteer Company stays in its barracks on the tenth of May, as ordered, and is taken prisoner.|req atwar GER
sandhurst|Officers from Sandhurst|army|spirit British-Trained Officers: org .04|The new army's officers train in Britain.|date 1945-9
diekirchbarracks|The Barracks at Diekirch|army|units inf 1|A home for the new army in the north.|date 1946-1
militaryband|The Grand Ducal Band|volunteercompany|stab 1|The band of the Volunteer Company plays at every national day.|
nationalday|The National Day|charlotte|stab 2; legit 1|The Grand Duchess's birthday, celebrated as the national day.|
# Culture
dicks|Dicks and Lentz|remain|legit 1; ws 1|The fathers of Luxembourgish theatre and poetry, a century ago.|
onsheemecht|Ons Heemecht|dicks|ws 2; stab 1|"Our Homeland": the national anthem, sung in secret under the occupation.|
steichen|Edward Steichen|dicks|rel USA 10; legit 1|A boy from Bivange, now the greatest photographer in America, who will lead the US Navy's photographers in the Pacific.|
kutter|Joseph Kutter|steichen|legit 1|The expressionist painter of clowns and Luxembourg landscapes, who dies in 1941.|
athenee|The Athénée|trilingual|res 5|The old Jesuit college of the capital, where every leader of the country went to school.|
scouts|The Scouts|athenee|resist SELF 3; ws 1|The scouts and guides carry messages for the resistance.|req luxFallen
universitycourses|The University Courses|athenee|res 5|There is no university; the best students go to Paris, Liège and Louvain.|
faber|The Memory of François Faber|remain|stab 1|The Giant of Colombes won the Tour de France in 1909 and died in the Foreign Legion in 1915.|
fanfares|The Village Bands|onsheemecht|stab 1|Every village has its brass band.|
# After the War
epuration|The Purge|liberation|stab 2 ?? Try every collaborator => legit 3; stab -2 // Only the leaders => stab 3|Ten thousand files; Kratzenberg is shot in 1946.|date 1945-6
onsjongenfund|The Forced Conscripts|epuration|stab 2; money -2|Pensions and recognition for the families of the young men forced into German uniform.|date 1946-1
wardamagelaw|The War Damage Law|warDamage|money -4; stab 3|The state pays for every house destroyed in the Bulge.|date 1950-2
marshall|The Marshall Plan|benelux|money 6; rel USA 10|American credits for the steelworks and the farms of the north.|date 1947-6
steelboom|The Steel Boom|marshall|money 6; build steel 1|The furnaces of Esch run day and night for the rebuilding of Europe.|date 1948-1
nationalunion|A Government of National Union|liberation|stab 3; pp 20|1945: every party, including the Communists, in one government.|date 1945-11
`);

// The French State (2.7): hand-written. The Marshal's regime and its National Revolution; the armistice and its
// prices (prisoners, occupation costs, the demarcation line); two roads, collaboration and the double game; the Empire
// colony by colony and the fleet at Toulon; an economy of shortages; youth, family and the cult of the Marshal; the
// choices of conscience; and the ends: the Reich's side, Algiers, the throne, Sigmaringen or the Republic.
'use strict';
TREES.VIC = autoTree('vi_', `
# The French State
fullpowers|Full Powers to the Marshal||pp 40; stab 4; vmarshal 4|10 July 1940: in the Grand Casino of Vichy the National Assembly votes the Republic's powers to Marshal Pétain, 569 to 80. The Third Republic dies without a vote on its name.|ai 6
acts|The Constitutional Acts|fullpowers|law decree; pp 20; legit -2|Act One: "We, Philippe Pétain, Marshal of France, declare that we assume the functions of Chief of the French State." There will be twelve such acts.|
etatfr|The French State|acts|rename French State/French; legit 3; stab 2|Not the Republic, nor the Empire, nor the Kingdom: the État français, a state without a regime's name.|
hotelduparc|The Hôtel du Parc|fullpowers|pp 15; res 5|The ministries move into the spa hotels of Vichy. Bathrooms are offices, and the Ministry of Foreign Affairs has its telephones in the wardrobes.|
oath|The Oath of Officials|acts|stab 2; legit -2; rad -0.02|Judges, prefects and officers swear personal loyalty to the Marshal. One judge in all France refuses.|
prefects|The Regional Prefects|oath|pp 15; stab 2|Regions under super-prefects with police powers: Paris governs the provinces as it did under Napoleon.|
mayors|Appointed Mayors|prefects|stab 2; legit -2; ig pb -2|Elected councils are dissolved in towns of more than two thousand; the prefect names the mayor.|
nationalcouncil|The National Council|acts|legit 2; pp 15|A consultative assembly of notables, appointed, that meets in committees and is never called in full.|
constitutionproj|A Constitution for After|nationalcouncil|legit 3; vmarshal 2|A charter drafted for the day when France is free, never promulgated: an executive, two chambers, and a president for ten years.|
marshalcult|Marshal, Here We Are|fullpowers|vmarshal 6; stab 3; spirit The Cult of the Marshal: stab 3, legit 2|"Maréchal, nous voilà!" Schoolchildren sing it every morning; the portrait hangs in every classroom and café.|
francisque|The Francisque|marshalcult|vmarshal 3; pp 10|The double-headed axe of the Gauls, the Marshal's personal emblem, on badges, stamps and banknotes.|
tours|The Marshal's Tours|marshalcult|vmarshal 6; stab 2; money -1|Lyon, Marseille, Toulouse, Saint-Étienne: crowds of a hundred thousand for an old man in a white moustache.|
tours2|The Second Round of Tours|tours|vmarshal 4; vemp all 1|Annecy, Pau, Montpellier, and a broadcast to the Empire on the anniversary of Verdun.|date 1941-6
messages|The Marshal's Messages|marshalcult|vmarshal 3; ws -2|"I hate the lies that have done you so much harm." The speeches are written by others and read in a cracked voice.|
windill|The Ill Wind|messages|vmarshal -2; pp 25; rad -0.03|12 August 1941: "Frenchmen, I have serious things to tell you. From several regions of France I feel an ill wind rising."|date 1941-8
legion|The French Legion of Veterans|fullpowers|vmarshal 4; units mil 1; ig army 2|One million five hundred thousand old soldiers in one legion: the regime's party, though it must not be called one.|
legionpolice|The Legion's Order Service|legion|rad -0.03; legit -2; vcollab 3|A political police inside the Legion, the SOL, which will become something worse.|
riom|The Supreme Court of Justice|acts|pp 15; vmarshal -2|A court at Riom to judge those responsible for the defeat: Blum, Daladier, Gamelin.|
riomtrial|The Riom Trial|riom|vmarshal -4; legit -3 ?? Let it run => vmarshal -4; legit -2 // Suspend it sine die => vmarshal 2; legit -1|February 1942: the accused turn the dock into a tribune. Berlin is furious that the trial is about the defeat rather than about starting the war.|date 1942-2
revolution|The National Revolution|marshalcult,acts|stab 4; vmarshal 4; spirit The National Revolution: stab 3, legit 2, research -.02|Work, Family, Fatherland: France will be born again by returning to the land, the family and the Church.|ai 5
tfp|Work, Family, Fatherland|revolution|stab 3; ws -2|The new motto on the coins and the town halls.|
statecouncil|The Purged Council of State|acts|pp 15; legit -2|Republicans, Freemasons and others are removed from the highest courts.|
freemasons|The Secret Societies Banned|statecouncil|rad -0.02; legit -3; ig intel -3|The lodges are closed and their membership lists published in the Journal officiel.|
centralpower|The Centralised State|prefects,nationalcouncil|pp 30; spirit A State Without Parliament: pp .1, legit -2|No elections, no parties, no Assembly: the Marshal and his ministers govern by decree.|
lavalvp|Laval, Vice-President|fullpowers|vcollab 6; pp 20; vmarshal -2|Pierre Laval, who engineered the vote of full powers, is heir and chief negotiator with the Germans.|mx flandin
flandin|Flandin's Ministry|fullpowers|vcollab -4; vpress 4; legit 2|After Laval's arrest on 13 December 1940 the Marshal tries a conservative of the old Republic.|mx lavalvp
darlanheir|Admiral Darlan, Heir|lavalvp|flandin|pp 30; vcollab 4; spirit Darlan's Ministry: output .04, stab 1|February 1941: vice-premier, foreign minister, minister of the interior, of the navy and of information, and the Marshal's named successor.|date 1941-2
lavalback|Laval Returns|darlanheir|vcollab 10; vpress -8; vmarshal -4; pp 20|April 1942: the Germans insist. Laval is Head of Government; Darlan keeps the armed forces.|date 1942-4; req collab 30
technocrats|The Synarchy|darlanheir|build tools 1; ig ind 4; pp 10|Young ministers from the banks and the École polytechnique run the economy as engineers would. The press calls them a secret society.|

ministers|The Marshal's Ministers|acts|pp 20|Admirals, generals, inspectors of finance and a few professors: a government of experts without a party.|
bouthillier|Bouthillier at Finance|ministers|money 3; pp 10|An inspector of finance who balances the budget of a country that pays its occupier four hundred million francs a day.|
huntziger|Huntziger at War|ministers|ig army 4; axp 2|The general who signed the armistice now commands the army it allows.|
carcopino|Carcopino at Education|ministers|res 6; ig intel -2|A great historian of Rome as Minister of Education: Latin in the schools, and the teachers' colleges closed.|
lehideux|Lehideux at Industry|ministers|build tools 1; ig ind 3|Louis Renault's nephew plans the industry of a France at peace.|
pucheu|Pucheu at the Interior|ministers|rad -0.04; legit -3 ?? Hard on the communists => rad -0.03; vcollab 2 // Correct with everyone => legit 2|A steel executive at the Ministry of the Interior: special sections in the courts, and the communists first.|
menetrel|Doctor Ménétrel|marshalcult|vmarshal 3; pp 10|The Marshal's physician and private secretary, who opens his letters and decides who sees him.|
regions|The Old Provinces|prefects|stab 2; legit 2|Brittany, Provence, Languedoc: the regime revives the provinces of the old monarchy, their costumes and their languages.|
mistral|The Centenary of Mistral|regions|stab 2; infl 5|Provençal poetry honoured by the State: the Félibrige finds itself in favour for the first time.|
# The Armistice
armistice|Living Under the Armistice||pp 20; stab 2|Ninety-four articles signed in the forest of Compiègne: the north occupied, the south free, the fleet disarmed, the costs of occupation paid by France.|ai 6
wiesbaden|The Commission at Wiesbaden|armistice|vcollab 3; pp 10|French officers and German officers argue over every gun and every franc in a hotel on the Rhine.|
costs|The Costs of Occupation|wiesbaden|vcost -1; vcollab 6; vpress -3|Four hundred million francs a day, reckoned at twenty francs to the mark: enough to keep an army of eighteen million men.|req collab 20
costs2|A Second Reduction|costs|vcost -1; vcollab 6|After a year of bargaining the payment falls to three hundred million.|req collab 40 & noanton; date 1941-5
line|The Demarcation Line|armistice|stab 2; money -1|A frontier through the middle of France, with customs posts, passes and letters on pre-printed cards: "family in good health, tired."|
ausweis|The Ausweis|line|stab 2; money 1; vcollab 2|Passes to cross the line for businessmen, officials and doctors; for everyone else, a smuggler.|
mailcards|Interzonal Mail|line|stab 2|Thirteen lines of printed text to cross out as needed: "in good health — slightly ill — killed — prisoner".|
prisoners|The Prisoners of War|armistice|vmarshal 3; pp 10|One million six hundred thousand men in German camps. Every family has someone in a Stalag.|
prisonersback|Fathers of Large Families|prisoners|vpow 50; vcollab 3|The first releases: veterans of 1914, fathers of four, farmers.|
prisonersback2|The Relève|prisonersback|vpow 120; vcollab 8; vmarshal -4; resist SELF 4|Laval's bargain of June 1942: three volunteers for German factories for every prisoner released.|date 1942-6; req collab 35 & noanton
scapini|The Scapini Mission|prisoners|vpow 30; stab 2; rel GER 5|A blind ambassador, wounded in 1914, protects the prisoners' interests in Berlin.|
armisticearmy|The Army of the Armistice|armistice|units inf 2; ig army 4; vpress 2|A hundred thousand men, eight divisions, no tanks, no heavy guns. Its officers mean it to be the core of a new army.|
cdm|Camouflage of Matériel|armisticearmy|equip arms 400, artillery 40; vpress 6|Colonel Mollard's service hides guns, lorries and ammunition from the Commission at Wiesbaden in barns and caves.|
cdm2|Sixty Thousand Rifles|cdm|equip arms 500, artillery 20, autos 40; vpress 6|The hidden stocks grow: a whole army's equipment, if anyone finds it first.|
mobplan|The Secret Mobilisation Plan|cdm|mp 60; vpress 4|Each regiment has its plan to call up reservists and recover hidden arms within a week.|
gendarmerie|The Gendarmerie and the GMR|armisticearmy|units mil 2; rad -0.03|The Mobile Reserve Groups: police battalions of the State, armed with what the armistice allows.|
gold|The Gold of the Bank of France|armistice|money 4; vpress 3|Two thousand tons of gold, at Dakar and Kayes, beyond the Germans' reach.|
foodsupply|The Food Supply Ministry|armistice|stab 2; money -1|Ration cards: bread, meat, sugar, fat, coffee, a ration of wine for the adult.|
coal|Coal from the North|line|build coalm 1; vcollab 3|The mines of the Nord are under the military administration in Brussels; the free zone gets what Berlin allows.|
nogermans|The Free Zone Is Free|line|vmarshal 4; stab 2|No German uniform south of the line: the regime's one claim to sovereignty.|req noanton
mersresponse|The Answer to Mers-el-Kébir|armistice|ws 4; rel ENG -15; vpress -4 ?? Bomb Gibraltar => ws 4; rel ENG -10; vcollab 3 // Break relations and no more => rel ENG -5; vmarshal 2|3 July 1940: the British sink the fleet at Mers-el-Kébir. Thirteen hundred French sailors are dead. Vichy breaks with London; French aircraft raid Gibraltar.|date 1940-7
sovereignty|A Sovereign State|nogermans,wiesbaden|legit 4; vpress 2; infl 10|Ambassadors from Washington, Moscow (until 1941), the Vatican and forty other states present their credentials at Vichy.|
leahy|Admiral Leahy|sovereignty|rel USA 15; vpress 4|Roosevelt sends an admiral as ambassador to keep France out of Hitler's hands and the fleet out of his navy.|date 1941-1
vatican|The Nunciature|sovereignty|ig devout 4; legit 2|Monsignor Valeri, nuncio to the Marshal: the Church blesses the National Revolution.|
neutralembassies|The Embassies Abroad|sovereignty|infl 15; vemp all 2|Madrid, Ankara, Washington, Tokyo: the French State still speaks for France in most of the world.|
peaceprep|A Peace Treaty|wiesbaden,costs|vcollab 6; vpress -4|Laval wants a definitive peace with Germany to replace the armistice. Berlin prefers to keep France waiting.|req collab 40

forbidden|The Forbidden Zone|line|stab -2; vpress -2|The north-east beyond the Somme and the Aisne: no refugee may go home, and German farm managers take over the land.|
alsace|Alsace and the Moselle|line|legit 3; vpress 4 ?? Protest the annexation => legit 3; vpress 4 // Say nothing => vcollab 3|The Gauleiters expel the French officials, forbid the French language and conscript the young men. Vichy protests in eighty-seven notes; Berlin answers none.|
nordbrussels|The North Under Brussels|forbidden|stab -1; money -1|The Nord and the Pas-de-Calais are governed from Brussels with Belgium, as if a new border were being drawn.|
italianzone|The Italian Zone|line|vpress 2; rel ITA -10|Menton and a few Alpine villages under Italian administration, and Italian claims on Nice, Corsica and Tunisia.|
parcels|Parcels for the Prisoners|prisoners|vmarshal 3; money -1|Every family sends a parcel to the Stalag each month: chocolate, socks and the Marshal's portrait.|
escapers|The Escaped Prisoners|prisoners|mp 20; vpress 3|Seventy thousand prisoners escape to the free zone in two years, and the gendarmes look the other way.|
wounded|The Wounded Come Home|prisonersback|vpow 30; vmarshal 2|The badly wounded and the sick are exchanged through Switzerland.|
# Collaboration
collab|The Path of Collaboration|armistice|vcollab 10; vpress -6; vmarshal -3|"It is with honour and to preserve French unity that I enter today upon the path of collaboration."|ai 3; mx attentisme
montoire|Montoire|collab|vcollab 10; vpress -6; rel GER 15; vmarshal -3|24 October 1940: the handshake at the station. Nothing was signed; everything was photographed.|date 1940-10
abetz|Ambassador Abetz|collab|vcollab 6; pp 15|The German ambassador in Paris is a francophile who married a Frenchwoman and wants France in a German Europe.|
parisprotocols|The Paris Protocols|montoire,darlanheir|vcollab 10; vpress -8; vcost -1; rel ENG -15|May 1941: Aleppo for the Luftwaffe, Bizerte and Dakar later, in return for a lighter occupation.|date 1941-5
syriafields|Airfields in Syria|parisprotocols|fn viSyriaFields|German aircraft refuel at Aleppo on their way to Rashid Ali in Baghdad.|req vholds levant
bizerte|Bizerte for Rommel|parisprotocols|vcollab 10; vpress -6; vemp northafrica -8|The port and the railway through Tunisia to supply the Afrika Korps.|req vholds northafrica
dakarbase|Dakar for the U-boats|bizerte|vcollab 8; vemp westafrica -10; rel USA -15|A base for German submarines on the Atlantic coast of Africa.|req vholds westafrica
groupcollab|The Collaborationist Parties|collab|ideo fas 6; vcollab 5|In Paris, Doriot's Popular French Party, Déat's National Popular Rally and Deloncle's Social Revolutionary Movement compete for German favour.|
lvf|The Legion of Volunteers Against Bolshevism|groupcollab|vcollab 8; axp 3; rel GER 10; rel SOV -20; mp -5|Six thousand men in German uniform with a tricolour on the sleeve, at the gates of Moscow in December 1941.|date 1941-7
tricolore|The Tricolour Legion|lvf|vcollab 4; units inf 1|A legion of the French State itself to fight Bolshevism: Berlin does not want it, and it lasts six months.|date 1942-6
germanvictory|"I Wish for the Victory of Germany"|lavalback|vcollab 10; vpress -8; vmarshal -8; resist SELF 8|22 June 1942, on the wireless: "I wish for the victory of Germany, because without it Bolshevism will tomorrow be installed everywhere."|date 1942-6
sto|The Compulsory Labour Service|germanvictory|vcollab 10; vpress -8; vpow 100; mp -60; resist SELF 15; vmarshal -8|February 1943: every man of twenty to twenty-three must go to work in Germany. Two hundred thousand go to the hills instead.|date 1943-2
milice|The Milice|germanvictory|vcollab 10; rad -0.08; legit -10; units mil 4; resist SELF 10|Darnand's French Militia, January 1943: the regime's own police against the Maquis, hated more than the Germans.|date 1943-1
phalange|The African Phalanx|bizerte|vcollab 5; units inf 1; axp 2|A few hundred volunteers fight beside the Germans in Tunisia in 1943.|date 1942-12
newerope|France in the New Europe|groupcollab,peaceprep|vcollab 8; build tools 1|French industry in the German order: Renault and Berliet build lorries for the Wehrmacht.|
cobelligerent|Co-Belligerence|newerope,germanvictory|vcollab 10; ws 6; vpress -10|France stops being neutral against Britain in all but name.|req collab 70
recoverchad|Recover Chad|cobelligerent|claim Fort-Lamy, Brazzaville, Yaoundé; ws 4|A column from Niger to retake the colonies that went over to de Gaulle in 1940.|
treaty|A Treaty with the Reich|cobelligerent|fn viAxis|An end to the armistice: France takes its place in the war at Germany's side. The prisoners come home; the free zone stays French.|req collab 80
charlemagne|The Charlemagne Division|treaty|axp 4; legit -6; units inf 2|Seven thousand Frenchmen in Waffen-SS uniform, the last of them in the ruins of Berlin.|date 1944-9
triparti|The Tripartite Pact|treaty|rel GER 10; rel ITA 10; rel JAP 10|France signs the pact of Berlin, Rome and Tokyo.|
reconquest|The Reconquest of the Empire|treaty,recoverchad|ws 6; vemp all 8|With Germany beside it France will win back every colony that went over to de Gaulle and the British.|
europe|The European Order|treaty|infl 15; build arms 1|France's industry, colonies and fleet in a Europe under German leadership.|

pressparis|The Paris Press|groupcollab|vcollab 4; pp 10|Je suis partout, Le Petit Parisien, Radio-Paris: Paris writes for the Germans and against Vichy as much as against London.|
antibolshevik|The Exhibition Against Bolshevism|pressparis|vcollab 3; rel SOV -10; ideo fas 2|A travelling exhibition: the Soviet paradise, in photographs.|
doriot|Doriot's Ambition|groupcollab|ideo fas 4 ?? Bring Doriot into the government => vcollab 10; ideo fas 6; vmarshal -6 // Keep him out => vpress 6; vmarshal 2|The former communist leader of Saint-Denis, now the most fascist man in France, wants Laval's place.|
singleparty|A Single Party?|groupcollab|pp 10 ?? Refuse Déat's single party => vmarshal 3; vpress 4 // Allow it => vcollab 8; law oneparty; vmarshal -6|Déat dreams of a mass party to make the revolution the Marshal only talks about.|
europeexpo|France European|newerope|infl 10; vcollab 3|An exhibition at the Grand Palais: France's place in the new Europe.|
# The Double Game
attentisme|Waiting|armistice|vpress 4; vmarshal 3; vcollab -4|Neither collaboration nor resistance: wait, give nothing that cannot be taken back, and see who wins.|ai 4; mx collab
weygand|Weygand in Africa|attentisme|vemp northafrica 10; vpress 6; spawn inf 1 Algiers|The old general is sent to Algiers as Delegate-General: Africa will be defended against everyone, Germans included.|req vholds northafrica
murphy|The Murphy–Weygand Accord|weygand|rel USA 20; vpress 6; vemp northafrica 4|February 1941: American goods for North Africa, and American vice-consuls to watch where they go.|date 1941-2
vice|The Twelve Apostles|murphy|rel USA 10; vemp northafrica -4 ?? Let them work => rel USA 10; vpress 4 // Watch them closely => vpress -2|Murphy's vice-consuls in Algiers, Oran, Casablanca and Tunis count tanks and talk to officers.|
rivet|Colonel Rivet's Service|attentisme|res 8; vpress 3|The army's secret intelligence, officially dissolved, keeps working, and passes some of what it learns to London.|
alibi|The Alibi Network|rivet|rel ENG 8; vpress 3|Officers of the Deuxième Bureau run agents for the British out of Vichy itself.|
madrid|Secret Channels to London|attentisme|rel ENG 15; vpress 4|Professor Rougier's mission in 1940; Chevalier's letters through Halifax; an understanding that is never written down.|
fleetnever|The Fleet Will Never Be Handed Over|attentisme|fn viScuttleOrder; rel ENG 8|Darlan's promise to Churchill, and his standing order to every captain.|
giraud|General Giraud|rivet|pp 15; rel USA 10|April 1942: a general of sixty-three escapes from Königstein by a rope of wire and string, and reaches Vichy. The Americans think he is their man.|date 1942-4
armycore|An Army for the Day|cdm,attentisme|equip arms 300; mp 40; ig army 4|The armistice army keeps its cadres and its secret mobilisation lists.|
anfa|American Equipment|murphy,armycore|equip arms 400, artillery 40, tanks 30; rel USA 10|The Americans promise to arm eight divisions of the Army of Africa if it changes sides.|date 1942-6
darlanalgiers|Darlan in Algiers|anfa|pp 20; vemp northafrica 10|November 1942: the Admiral happens to be in Algiers, visiting his son in hospital, when the Americans land.|date 1942-11
rejoin|Africa Rejoins the War|darlanalgiers|fn viSwitch|The Army of Africa turns its guns on the Axis in the Marshal's name, and the government follows it.|req noanton & collabmax 40
ora|The Army's Resistance|armycore|resist SELF 10; units mil 2|The Organisation of Army Resistance: the officers of the dissolved armistice army join the Maquis.|req anton
vichystores|The Resisters of Vichy|attentisme|resist SELF 6; vpress 4; legit 3|Officials who serve the Marshal by day and the Resistance by night: false papers, warnings, files that go missing.|
nogold|The Gold Stays in Africa|gold,attentisme|money 2; vpress 4; rel BEL 10|The Belgian gold is not handed to Germany: the paperwork is lost between Kayes and Dakar.|
noparis|No Paris Protocols|attentisme|vpress 8; vemp all 4|Weygand threatens to resign and the cabinet refuses to ratify the Protocols of May 1941.|date 1941-6
leahyfriend|Leahy's Friendship|leahy,attentisme|rel USA 10; vpress 3; stab 1|The American ambassador dines with the Marshal every week and reports that the old man is a prisoner of his ministers.|
doublegame|The Double Game|madrid,murphy|rel ENG 10; rel USA 10; vpress 6; vcollab -6|Promises to Berlin, promises to Washington, and nothing delivered to either.|
thirdway|The Third Way|doublegame,vichystores|legit 6; vmarshal 4|A France neither German nor Gaullist, that will be at the peace table on the winning side.|
algiers|The Government to Algiers|thirdway,rejoin|legit 6; stab 4|The ministers who reach Algiers before the Germans reach Vichy take the State with them.|req anton

weygandplan|The Weygand Plan|weygand|units inf 2; equip artillery 30; vpress 4|Seven divisions for Africa, more than the armistice allows, hidden as police and labour units.|
atlasstores|Stores in the Atlas|weygandplan,cdm|equip arms 300, tanks 20; vpress 4|Tanks walled up in the caves of the Moroccan mountains.|
juin|General Juin|weygand|axp 4; vemp northafrica 4|Released from captivity by the Germans to command in North Africa, he will lead the French in Italy in 1944.|date 1941-6
lisbon|Talks in Lisbon|madrid|rel ENG 8; rel USA 8; vpress 3|Diplomats meet in the hotels of Estoril, where every waiter works for someone.|
ossalgiers|The Americans in Algiers|vice|rel USA 10; vemp northafrica -2|Colonel Eddy of the OSS lands at Tangier with a suitcase of dollars.|date 1942-1
# The Empire
empire|The Empire Remains|armistice|vemp all 4; vmarshal 2|Twelve million square kilometres and seventy million people from Dakar to Saigon: the armistice did not touch them.|ai 5
delegate|The Delegate-General in Africa|empire|vemp northafrica 6; vemp westafrica 4|One authority for all of French Africa, in Algiers.|req vholds northafrica
dakar|The Defence of Dakar|empire|vemp westafrica 10; fort Dakar|Governor Boisson and the battleship Richelieu, half finished and wholly armed.|req vholds westafrica
richelieu|The Richelieu|dakar|equip ships 10; vemp westafrica 4|The newest battleship of the French fleet, damaged by British torpedoes at Dakar, its guns still working.|
kayes|The Fort at Kayes|dakar,gold|money 2; vemp westafrica 4|The gold of three central banks in a fort on the Senegal river.|
transsaharan|The Trans-Saharan Railway|delegate|infra 2; legit -4; vemp northafrica 2|The line from Colomb-Béchar to the Niger, built by internees and forced labourers in the desert heat.|
sultan|The Sultan of Morocco|delegate|vemp northafrica 6; stab 1|Sidi Mohammed protects his Jewish subjects from Vichy's laws as far as he can, and listens to the Americans.|
bey|Moncef Bey|delegate|vemp northafrica 4|The Bey of Tunis, a nationalist, is courted by Vichy, the Axis and the Allies at once.|
algeria|The Algerian Notables|delegate|vemp northafrica 4; legit -2|Ferhat Abbas's manifesto will ask for an Algerian republic in 1943. In 1941 he still asks for reforms.|
levant|General Dentz in the Levant|empire|vemp levant 10; units inf 1|The High Commissioner in Beirut, with thirty-five thousand men and the Foreign Legion.|req vholds levant
druze|The Druze and the Alawites|levant|vemp levant 6; stab 1|Old allies of France in the mountains of Syria.|
syriaind|A Promise of Independence|levant|vemp levant -4; legit 4; infl 10|Syria and Lebanon are promised independence after the war: Catroux will promise it too.|
indochina|Admiral Decoux|empire|vemp indochina 10|The Governor-General of Indochina, cut off from France, keeps the tricolour flying with a Japanese army in the harbours.|req vholds indochina
japtonkin|The Japanese in Tonkin|indochina|vemp indochina -4; vpress -2; rel JAP 15|September 1940: airfields and the railway to China for six thousand Japanese soldiers. A few days' fighting at Lang Son first.|date 1940-9
thaiwar|The War with Siam|indochina|axp 4; ws 4; rel SIA -20|Bangkok wants the provinces lost in 1893 and 1907. The Thai army crosses the Mekong in January 1941.|date 1941-1
kochang|Victory at Ko Chang|thaiwar|ws 6; equip ships 2; vemp indochina 6|The cruiser Lamotte-Picquet sinks half the Thai navy in an hour off Ko Chang.|date 1941-1
indoyouth|The Youth of Indochina|indochina|vemp indochina 6; stab 1|Decoux's sports clubs and youth movements: loyalty to the Marshal, and a Vietnamese patriotism that will turn on France.|
indofed|The Indochinese Federation|indoyouth|vemp indochina 6; legit 3|A federal council for Annam, Tonkin, Cochinchina, Cambodia and Laos.|
madagascar|Governor Annet|empire|vemp madagascar 10; fort Tananarive|Madagascar and the harbour of Diego-Suarez.|req vholds madagascar
djibouti|Djibouti Under Blockade|empire|vemp djibouti 6; stab -1|The British blockade the port. The garrison eats camel and waits.|req vholds djibouti
antilles|Admiral Robert in the Antilles|empire|money 3; rel USA 5|The gold of the Bank of France at Fort-de-France, the cruiser Émile Bertin and the aircraft carrier Béarn, watched by the American Navy.|
guiana|French Guiana|empire|vemp guiana 6|The penal colony on the Maroni, cut off from the world.|req vholds guiana
spm|Saint-Pierre and Miquelon|empire|ws 2 ?? Protest Muselier's coup => rel USA 8; rel ENG -5 // Ignore it => stab 1|Christmas Eve 1941: Admiral Muselier takes the islands for de Gaulle with three corvettes and a submarine. Washington is furious, at de Gaulle.|date 1941-12
colonialtroops|The Colonial Troops|empire|units inf 2; mp 40|Tirailleurs from Senegal, Morocco and Algeria: the regime's largest army is African.|
spahis|The Spahis and the Goums|colonialtroops|units cav 2; axp 2|Cavalry of North Africa and the mountain fighters of the Atlas.|
legionetr|The Foreign Legion|colonialtroops|units inf 1; axp 4|At Sidi-bel-Abbès the Legion serves the Marshal; in the Levant it will fight the Legion that serves de Gaulle.|
empireeconomy|The Empire Feeds France|empire|money 3; build farm 1; stab 1|Wine, wheat and phosphates from North Africa, groundnuts from Senegal, rice from Indochina, when the British let the ships through.|
convoys|The Convoys to Africa|empireeconomy,fleetbase|money 2; vemp northafrica 2; vemp westafrica 2|Escorted convoys across the Mediterranean, under British eyes.|
africafirst|Africa First|delegate,convoys|vemp all 6; spirit Imperial Defence: def .05|The Empire is France's last card. It will be defended against whoever comes first.|
oneempire|The One and Indivisible Empire|africafirst,indofed|vemp all 8; legit 4|From Dakar to Hanoi, the Empire stays loyal to the Marshal: so the regime says, every evening on the wireless.|

gabon|Gabon Holds|empire|vemp equatorial 8; fort Libreville|Libreville refuses to rally to de Gaulle in August 1940 and holds out until November.|
pacific|Tahiti and New Caledonia|empire|vemp pacific 6|The islands of the Pacific, where the Americans will build bases, wonder which France they belong to.|
indiacomptoirs|The Comptoirs of India|empire|infl 5|Pondichéry and four other trading towns: they rally to de Gaulle, and Vichy can do nothing about it.|
phosphates|The Phosphates of Morocco|empire|money 3; build ironm 1|Khouribga's phosphates, the Empire's richest export, and the Germans' favourite fertiliser.|
sahara|The Saharan Companies|delegate|units cav 1; fort Tamanrasset|Camel corps and armoured cars from Colomb-Béchar to Agadez.|
mamelouk|Muslim Veterans|colonialtroops|vemp northafrica 4; stab 1|The anciens combattants of North Africa are honoured beside the French ones, and listened to.|
# The Fleet
fleet|The Fleet of Darlan|armistice|equip ships 5; vmarshal 2|The second navy of Europe, untouched by the defeat: four battleships, seven cruisers, a hundred destroyers and submarines.|ai 4
fleetbase|Toulon|fleet|fort Toulon; equip ships 3|The High Seas Fleet lies at Toulon, disarmed under the armistice, with steam up.|
raid|The Raiding Force|fleetbase|spirit Raiding Force: navy .08|Strasbourg and the light cruisers: the fastest squadron in the Mediterranean.|
navalair|The Naval Air Arm|fleet|equip aircraft 30|Seaplanes and dive bombers of the Aéronavale.|
submarines|The Submarines|fleet|spirit The French Submarines: navy .05|Eighty boats, some of them the largest in the world.|
laborde|Admiral de Laborde|fleetbase|pp 10 ?? He will never sail to join anyone => vpress -2; rel ENG -5 // He will obey the Marshal => vmarshal 2|The commander at Toulon hates the British more than the Germans, and de Gaulle most of all.|
africaports|The Fleet to Africa|raid,convoys|fn viAfrica|Mers-el-Kébir, Bizerte, Dakar, Casablanca: the battle squadrons sail for the African ports.|req noanton
jeanbart|The Jean Bart at Casablanca|fleet|equip ships 6; fort Casablanca|An unfinished battleship with one working turret, moored at the quay.|
scuttleorder|No Ship Shall Be Taken|fleetbase|fn viScuttleOrder; legit 2|Darlan's order of 24 June 1940, renewed every month: no warship is to fall into foreign hands.|
gibraltarraid|Bombs on Gibraltar|fleet|ws 3; rel ENG -10; vcollab 2|Reprisals for Mers-el-Kébir and Dakar: French aircraft from Morocco bomb the Rock.|date 1940-9
fleetfuel|Oil for the Fleet|fleetbase|vcollab 4; vpress -2|The Germans release fuel oil for exercises in exchange for good behaviour.|
navyschool|The Naval School|fleet|res 6; axp 2|Brest is occupied: the naval college moves to Toulon.|
merchant|The Merchant Navy|fleet|money 2; vemp all 2|Merchant ships under escort keep the Empire's trade alive.|
fleetwhole|A Fleet in Being|raid,submarines,scuttleorder|spirit A Fleet in Being: navy .08, def .02; vpress 4|As long as the fleet is intact, every side must reckon with it.|

strasbourgescape|The Strasbourg Escapes|fleet|equip ships 4; ws 2|At Mers-el-Kébir the battleship Strasbourg breaks out through the smoke and reaches Toulon.|
bearn|The Béarn at Martinique|antilles|equip aircraft 20|An aircraft carrier full of American fighters, bought in 1940 and never delivered, swinging at anchor at Fort-de-France.|
cruiserdakar|The Cruisers at Dakar|dakar,fleet|equip ships 6; vemp westafrica 4|Gloire, Montcalm and Georges Leygues slip through the Strait of Gibraltar in September 1940.|
# The Economy of Shortage
shortage|An Economy of Shortage|armistice|stab -2; pp 15|Half the coal, a third of the steel, no oil, no rubber, and the Germans buy what is left.|ai 4
rationing|Ration Cards|shortage|stab 3; spirit Rationing: stab 2, needs -.1|Categories A, J1, J2, J3, T, V: bread, meat and sugar by age and work.|
blackmarket|The Black Market|rationing|money 2; stab -2; legit -2|Butter, eggs and cigarettes at ten times the ration price. Half of France trades on it.|
gardens|Family Gardens|rationing|stab 2; build farm 1|Potatoes in the Tuileries and rabbits on the balconies.|
gazogene|The Gazogène|shortage|spirit Wood Gas: needs -.05, output -.01; stab 1|Lorries and cars run on charcoal burners bolted to the back.|
fibranne|Fibranne and Wooden Soles|shortage|stab 1; build textile 1|Clothes of artificial fibre and shoes with wooden soles: the sound of the war in French streets.|
comites|The Organisation Committees|shortage|ig ind 6; build tools 1; spirit Organisation Committees: output .04|Each industry run by a committee of its employers, which allocates raw materials and sets prices.|
ocrpi|The Office of Industrial Distribution|comites|pp 15; build steel 1|Raw materials allocated by ministry, branch and factory.|
planequip|The Ten-Year Plan|comites|build power 1; build construction 1; res 10|The Plan d'Équipement National of 1942: electricity, railways and housing for a France at peace.|date 1942-1
genissiat|The Dam at Génissiat|planequip|build power 2; money -3|A hydroelectric dam on the Rhône, begun in 1937 and finished, somehow, in the middle of the occupation.|
aluminium|The Aluminium of Provence|comites|build chem 1; vcollab 3; money 2|Pechiney's smelters work for the Luftwaffe's factories.|
renault|Renault for the Wehrmacht|newerope|money 3; vcollab 4; legit -3|Louis Renault builds lorries for the German army at Billancourt. The RAF bombs the works in March 1942.|
peasantcorp|The Peasant Corporation|shortage|ig rural 6; build farm 1; stab 1|"The land does not lie": farmers in one corporation, with the Marshal as their patron.|
returnland|Return to the Land|peasantcorp|ig rural 4; mp 10; stab 1|Grants for townsmen who go back to the farms of their fathers. Few do.|
clearing|The Franco-German Clearing|wiesbaden|money -2; vcollab 3|German purchases are paid through an account at the Bank of France that the Bank of France finances.|
franc|Twenty Francs to the Mark|clearing|money -2; vcollab 2|An exchange rate fixed at the armistice that makes everything French cheap for German buyers.|
taxes|New Taxes|shortage|money 4; stab -2|A tax on wages and a national lottery to pay for the occupation.|
labourcharter|The Labour Charter|comites|ig union -8; rad -0.03; spirit The Labour Charter: output .03, stab 1|October 1941: no strikes, no lockouts, one union per trade, social committees in every factory.|date 1941-10
pensions|Old Age Pensions|labourcharter|stab 3; money -2; ig pb 4|The allowance for aged workers, the regime's most lasting social law.|
selfsupply|Autarky of the Free Zone|gardens,comites|build farm 1; build tools 1|What the free zone can make for itself it will make.|
shortageend|An Economy That Holds|selfsupply,planequip,pensions|spirit The Managed Economy: output .05, stab 2|Despite everything, France eats, works and plans for afterwards.|

bread|Bread and Wine|rationing|stab 2; ig rural 2|The ration of bread falls to two hundred and seventy-five grams a day; wine is rationed too, which the regime regrets.|
nationalloan|The National Loan|taxes|money 4; vmarshal 2|Bonds of the French State, bought by those who still believe in the Marshal.|
# Youth, Family and Faith
youth|A New Youth|revolution|stab 2; res 3|The schools and the youth movements will make the French of the National Revolution.|ai 3
chantiers|The Youth Work Camps|youth|mp 30; stab 1; spirit The Chantiers: manpower .03|Eight months in the forests for every young man of twenty, in green uniforms, under General de La Porte du Theil.|
compagnons|The Companions of France|youth|stab 2; money -1|Teenagers in workshops and on the roads, helping the harvest and the refugees.|
uriage|The School at Uriage|youth|res 8; legit 2 ?? Let it think freely => legit 2; resist SELF 4 // Close it as subversive => vcollab 3; stab 1|A château in the Alps where young officers train the elites of the new France, and begin to think for themselves.|
sport|The Commissariat for Sport|youth|stab 2; mp 10|Jean Borotra, the tennis champion, makes sport compulsory in schools.|
schoolreform|The School Reform|youth|res 5; ig devout 4; ig intel -4|The teachers' training colleges, "seedbeds of the Republic", are closed.|
family|The Family First|revolution|stab 3; mp 20|Family allowances raised, divorce made harder, a medal for mothers of five.|
mothersday|Mothers' Day|family|stab 2; vmarshal 2|The last Sunday in May: the Marshal's message to the mothers of France.|
church|The Church and the State|revolution|ig devout 8; legit 2|Religious teaching back in state schools, and subsidies for Church schools.|
cardinals|"Pétain Is France"|church|vmarshal 4; ig devout 4|Cardinal Gerlier at Lyon: "Pétain is France, and France today is Pétain."|
radio|Radio-Vichy|youth,messages|stab 2; pp 10|"Radio-Paris lies, Radio-Paris is German": the BBC's jingle is about the other station.|
cinema|The Cinema of the Occupation|radio|stab 2; money 1|Carné, Clouzot and Cocteau make their best films in the worst years.|
secours|The National Relief|family|stab 3; money -1; vmarshal 2|Soup kitchens and parcels for the prisoners in the Marshal's name.|
veterans|The Old Soldiers|legion,family|vmarshal 4; ig army 3|The men of Verdun stand with the man of Verdun.|
newfrance|A France Reborn|chantiers,family,church|spirit A France Reborn: stab 3, manpower .03, legit 2|The regime's own verdict on itself, in the textbooks.|

# Conscience
conscience|Matters of Conscience|armistice|legit 2; pp 10|Every official of the French State will one day be asked what he did.|ai 2
refugees|The Refugees in the South|conscience|legit 3; money -1; stab -1|Spaniards, Germans, Poles, Belgians and Jews from everywhere crowd the free zone, many of them in the camps of the South.|
quakers|The Relief Committees|refugees|legit 3; rel USA 6|The Quakers, the YMCA and the Jewish committees feed the camps at Gurs and Rivesaltes, and get children out.|
varianfry|Exit Visas from Marseille|refugees|legit 4; rel USA 8; vpress 3|An American journalist smuggles Chagall, Arendt and two thousand others out through Spain. The prefecture does not look too hard.|
chambon|Le Chambon-sur-Lignon|quakers|legit 6; vpress 3; resist SELF 4|A Protestant village on a plateau hides five thousand people, most of them Jewish children. The pastor says it was nothing.|
saliege|The Archbishop's Letter|chambon,church|legit 6; vmarshal -2; vpress 4|August 1942: Archbishop Saliège's pastoral letter is read in every church of Toulouse: "The Jews are men, the Jews are women."|date 1942-8
nopolice|No French Police for the Round-ups|saliege|legit 8; vpress 12; vcollab -10|The government refuses to let its police do the occupier's arresting. The Germans will have to do it themselves, and they have too few men.|req noanton
nostar|No Yellow Star in the Free Zone|conscience|legit 4; vpress 6|The German ordinance of June 1942 is not applied south of the line.|date 1942-6
hostagesrefuse|We Will Not Choose the Hostages|conscience|legit 4; vpress 8; vmarshal 3|When the Germans shoot hostages in reprisal, the Minister of the Interior will not give them names.|
justbooks|The Righteous|nopolice,varianfry|legit 6; spirit The Righteous: legit 3, stab 1|Thousands of ordinary French people hide their neighbours. Three-quarters of the Jews of France survive the war.|
trial|The Judgement of History|justbooks|legit 4; vmarshal 2|The regime will be judged. Some of its servants will be able to say what they refused.|

# The Hour of Truth
hour|The Hour of Truth|armistice|pp 20|One day the Germans will cross the line, or the Allies will land, and every Frenchman will have to choose.|ai 3
anton|The Germans Cross the Line|hour|ws 4 ?? Protest and stay => vmarshal 4; stab -2 // Order resistance => ws 8; vpress 20|11 November 1942: the Wehrmacht occupies the free zone. The armistice army is disbanded in its barracks.|req anton
toulon|Toulon|anton|legit 4; ws 4|27 November 1942: as the panzers enter the arsenal the fleet scuttles itself. Seventy-seven ships go to the bottom.|req anton
prisoner|The Marshal, a Prisoner|anton|vmarshal 4; legit 2|The old man stays at Vichy to "protect the French", with a German guard at his door.|req anton
sigmaringen|Sigmaringen|prisoner|legit -4; vmarshal 4|August 1944: the Germans carry the Marshal off to a castle on the Danube. He refuses to govern from there.|date 1944-8
republic|Hand Over to the Republic|prisoner|fn viRepublic|The Marshal resigns his powers to the National Assembly, which hands them to the Provisional Government.|req anton
restoration|The Count of Paris|hour,revolution|fn viKing; legit 3|The pretender's manifesto from Morocco: a Bourbon-Orléans king to reconcile the French. Some at Vichy dream of it.|req marshal 50; ai 0.2
regency|A Council of Regency|restoration|stab 4; pp 20|Until the Count of Paris can come home, a council governs in the King's name.|
newkingdom|The Kingdom of France|regency|law monarchy; legit 6; stab 4|The Bourbon lily over the Hôtel du Parc, a hundred and fifty years after the Revolution.|
legitimate|The Legitimate Government|algiers|legit 8; ws 6|In Algiers, Darlan's men and Giraud's army claim to be the true France. De Gaulle disagrees.|
finalchoice|Whose France?|legitimate|republic|newkingdom|sigmaringen|legit 4; stab 2|Vichy, London and Algiers each claim to be France. The Liberation will decide.|
`);

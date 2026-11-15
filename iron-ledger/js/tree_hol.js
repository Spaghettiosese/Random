// The Netherlands (2.2): hand-written. Colijn's Netherlands of the gold guilder and the pillars; the policy of independence;
// the Water Line, worked through the inundations; the fleet and the East Indies, whose oil Japan wants, worked through the
// oil contracts; the occupation, the strikes and the Hunger Winter; the Queen in London; Mussert's Netherlands; and the
// Netherlands that is rebuilt and loses an empire.
'use strict';
TREES.HOL = autoTree('nl_', `
# Colijn's Netherlands
colijn|Colijn's Cabinet||pp 30; stab 3|Hendrikus Colijn, former general, oil director and Calvinist, governs a country in the depths of the slump.|ai 6
austerity|Sound Money|colijn|money 6; unemp 2; stab -1|Balanced budgets and the guilder on gold, whatever the cost in jobs.|
goldbloc|The Gold Bloc|austerity|money 2 ?? Hold the gold standard => money 2; unemp 2 // Leave gold and devalue => devalue; unemp -3|With France and Switzerland, the guilder is one of the last currencies tied to gold.|date 1936-1
devaluation|The Guilder Floats|goldbloc|unemp -3; money 4; stab 2|27 September 1936: the gold bloc breaks up, and Colijn lets the guilder go. Exports recover at once.|date 1936-9
workrelief|Work Relief|colijn|unemp -3; build railway 1, construction 1|The unemployed dig canals and build roads for their benefit money.|
zuiderzee|The Zuiderzee Works|workrelief|build farm 2; unemp -2|The enclosing dike was closed in 1932; now the polders are pumped dry, one by one.|
noordoost|The Northeast Polder|zuiderzee|build farm 2; popgrow 1|1937 to 1942: a new province rises out of the IJsselmeer.|date 1937-1
election37|The Election of 1937|colijn|legit 5; pp 20|May 1937: Colijn's party gains, and the National Socialists fall back to four per cent.|date 1937-5
colijnfive|The Fifth Colijn Cabinet|election37|stab -2 ?? Govern without the Catholics => pp 20; stab -2 // Keep the Catholics in => stab 2|July 1939: Colijn's last cabinet falls in two days.|date 1939-7
degeer|De Geer's Cabinet|colijnfive|leader Dirk Jan de Geer/CHU; pp 20; stab 2|August 1939: a cautious old man forms a government with the Social Democrats in it for the first time.|date 1939-8
sdapgov|Socialists in Government|degeer|ig union 6; ideo dem 3; stab 2|The SDAP, which once dreamed of revolution, takes two ministries.|
unemployment|The Unemployment Fund|workrelief|unemp -2; money -3; stab 2|Help for the half a million without work.|
welfare|Old-Age Pensions|sdapgov|money -4; stab 3|A pension for the old, paid by the state.|
dreespension|Drees's Emergency Pension|welfare|law welfare_state; stab 4|1947: Willem Drees gives every Dutch man and woman over sixty-five a pension.|date 1947-5
# The Pillars
pillars|The Pillars||stab 3; legit 2|Catholics, Protestants, socialists and liberals each have their own schools, papers, unions, broadcasters and football clubs.|ai 4
catholics|The Catholic State Party|pillars|ig devout 4; stab 1|The largest party, led by priests and lawyers from the south.|
arp|The Anti-Revolutionaries|pillars|ig devout 3; legit 1|Colijn's Calvinists, the party of the small people of the Reformation.|
sdap|The Social Democrats|pillars|ig union 4; ideo dem 2|Koos Vorrink's party, which abandons its pacifism in 1937.|
liberals|The Liberals|pillars|ig ind 3|The party of the merchants of Amsterdam and the professors of Leiden.|
broadcasters|The Broadcasting Associations|catholics,sdap|pp 10; ws 2|KRO, NCRV, VARA and AVRO share the airwaves, each with its own pillar.|
schoolpeace|The School Peace|catholics,arp|stab 2; spirit Schools for Every Pillar: literacy .02|Since 1917 the state pays for Catholic, Protestant and public schools alike.|
romme|Carl Romme|catholics|pp 10; legit 1|The Catholic leader who will dominate the coalitions after the war.|
vorrink|Koos Vorrink|sdap|ideo dem 2; ws 2|The Social Democratic chairman, who will lead the party underground.|
newparty|The Breakthrough|vorrink|ideo dem 3; stab 2|After the war, the Labour Party tries to break through the walls between the pillars.|date 1946-2
# The Policy of Independence
independence|The Policy of Independence||pp 20; legit 2|The Netherlands stayed out of the last war, and will stay out of the next.|ai 6
oslostates|The Oslo States|independence|trade SWE, NOR, DEN, BEL, FIN|The small democracies of the north and the west stand together, on trade at least.|
noalliances|No Alliances|independence|legit 2 ?? Refuse every alliance => rel GER 5 // Talk quietly to Britain => rel ENG 10; rel GER -5|The government will not even hold staff talks with the British or the Belgians.|
article16|Free of Article Sixteen|oslostates|pp 10 ?? We are no longer bound to sanctions => rel ITA 5 // We stay loyal to Geneva => rel ENG 5, FRA 5|July 1936: the Netherlands declares, with the Oslo States, that League sanctions no longer bind it.|date 1936-7
peaceoffer|The Royal Peace Offer|noalliances|legit 3; rel ENG 5, GER 5|November 1939: Queen Wilhelmina and King Leopold offer their good offices for peace. No one accepts.|date 1939-11
venlo|The Venlo Incident|noalliances|rel GER -10; stab -2|November 1939: German agents kidnap two British officers at the border; a Dutch officer is shot. Berlin will call it a breach of neutrality.|date 1939-11
sas|The Warnings of Major Sas|venlo|ws 4; legit 1|The military attaché in Berlin is told the date of the attack by a German officer. No one in The Hague believes him.|date 1940-1
mobilisation|Mobilisation|noalliances|units inf 3; ws 4|August 1939: 280,000 men under arms.|date 1939-8
britishguarantee|Britain's Guarantee|noalliances|rel ENG 10|London says it will not let the Low Countries fall. The Hague says nothing.|
belgiumtalks|Talks with Brussels|oslostates|rel BEL 15|Two neutrals with the same enemy, who cannot agree to plan together.|
`);

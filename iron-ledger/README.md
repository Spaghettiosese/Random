# Iron Ledger 1936

An original grand strategy game that starts on 1 January 1936. It combines a wartime layer
(focus trees, divisions, generals, fronts, capitulation) with a peacetime layer (a market economy of
pops, goods and production methods, interest groups, laws and diplomatic plays).

Open `index.html` in a browser. No build step, no server.

## Updates

### 2.1 "The Balkans and the Bomb"

- **Balkan focus trees**: Romania (235), Yugoslavia (233), Bulgaria (232), Greece (232) and Turkey (234), hand-written with choices, requirements and sections.
- **A system for each**: Romanian oil contracts; Yugoslavia's five peoples and Croatian secession; Bulgaria's lost provinces and great-power patrons; the Greek merchant fleet and the National Schism; Turkish neutrality leverage, aid packages and control of the Straits. Regional ententes (Balkan, Little, Baltic) with cohesion.
- **Resistance**: movements in occupied countries with strength, a communist wing, sabotage, liberated provinces, partisan armies and post-war civil wars; sweep, reprisal, amnesty, supply and rise actions.
- **Occupation 2.0**: per-country occupation laws (administration, economy, labour, policing, recruitment), compliance, garrison coverage, plunder, foreign labour and volunteer legions.
- **Colonies**: territories with nationalism, development and administration; investment, colonial troops, reforms, repression, self-government as a dominion; independence revolts; enemies stir colonies.
- **Nuclear weapons**: production reactors, a bomb stockpile from 1944, range and interception, blast, fallout, nuclear shock and surrender, world reaction, deterrence-aware AI.
- **Crisis screen** for diplomatic plays: phases, mobilisation, courting other powers, raising or moderating demands, compromise offers, mediation, live odds.
- **Fog of war** (an Open map rule turns it off) and read-only viewing of any nation's focus tree.
- **Factions** card; Communist China joins China's **United Front**.
- **Events 2.0**: 65 new national and situational events, some in chains.
- **Map**: 754 provinces. **Balance**: in historical games the war opens in September 1939, the Soviet border wars stay local, landings on a great power's coast wait for 1943, armies return to fight invaders, great powers rebuild divisions, and nations in trouble fight as they did in history.

### 2.0 "Empires"

The second edition. Highlights:

- **Map**: 734 provinces (from 477); marching time follows distance.
- **War**: wars as circles at the bottom right with a war overview; permanent military deaths, slow return of the wounded; civilian deaths from battles, bombing and occupation; naval control weighed against air over the landing zone; large encircled armies lose half their divisions rather than vanishing.
- **Politics**: named parties and leaders by culture, traits, ageing and succession, elections that change the governing party, boosting and banning parties at home and abroad, coups d'état.
- **Government 2.0**: 17 forms of government changed by constitutional reform; regime transitions (suspend the constitution, free elections, march on the capital, revolution, the generals restore order); six new law categories; the Government Programme (two pledges per two-year term).
- **Subjects and occupation**: six subject statuses with tribute, levies, autonomy ceilings and independence drive; wartime occupation governments (military governor, commissariat, collaboration government) that take over newly conquered land; annexed-territory administration and release screens.
- **Peace conference**: point-based, province by province, with terms per defeated nation; occupation zones; no duplicate governments of one nation.
- **Army 2.0**: division designer, army groups under field marshals, experience ranks, reinforcement priority. **Industry**: equipment readiness scales combat power. **Spy networks** and **oil embargoes**.
- **Italy**: a hand-written 232-focus tree. **Japan/China**: annexation war aims and the Reorganised Government hand-over.
- Balance: an early-war German edge that fades by 1942; Czechoslovakia folds in historical mode.

### 1.7 "Iron and Fire"

The war layer, rebuilt.

- **The Air War**: 64 air regions. Air wings fly one mission each (superiority, ground support, interdiction, strategic bombing) over one region; superiority, losses, battle bonuses and bombing are all regional. New Air map mode; an automatic air staff until you take over.
- **Fronts**: give armies a front against a nation; they spread out by threat, dig in, and advance on their own when the odds suit their stance. Works before a war for deployment. The front line is drawn on the map.
- **Battles end**: an assault is decided after three weeks by who has been winning the exchange, instead of lasting until an entire stack runs dry (a siege of Prague had lasted 439 days).

### 1.6 "Reckoning"

The game was reviewed harshly by an independent reviewer (overall 4/10, focus trees 3/10) and rebuilt where it scored worst.

- **Focuses cost political power** (15 to 75) and take 21 to 63 days according to their weight. Switching returns half.
- **The generated filler is deleted.** Trees show only authored focuses. Doctrine, which used to be filler rows, is now its own system bought with army experience.
- **Requirements you play towards**, with live progress: divisions, fleet, world tension. Historical dates bind the AI; a human may move early only once world tension allows.
- **Choice focuses**: 39 key focuses end in a decision with real trade-offs. Syntax: `effects ?? Label => effects // Label => effects`.
- **New tree view**: icons, price, length, hover details, requirement checklists, the route to a focus, what it opens and closes, drag to pan, and a plan that starts queued focuses by itself.
- **Dispatches**: news and reports are non-blocking headlines; decisions wait in a tray with a deadline; toasts are filtered by category. Measured as Britain over five years: forced interruptions 49 → 2, pop-up notes 8 a month → 0.3.
- **Battle reports** list the factors on each side. **Wars end**: beaten coalitions ask for terms; frozen AI wars are settled.
- Diminishing returns on stacked modifiers; map label, camera and counter fixes.

### 1.5 "Dragon and Sun"

Asia done properly.

- **Six trees written by hand**, each over 230 focuses with no generic filler: Japan, China, Communist China, the Philippines, Mongolia and (new) Manchukuo. Every political road runs fifteen to twenty-five focuses deep.
- **Border Conflicts**: six weeks of fighting on a frontier without a declaration of war, for prestige, experience and sometimes a claimed province.
- **Embargoes**: the larger the share of the world economy that embargoes a nation, the harder its trade and output are hit.
- **Support Companies and Army Experience**: spend experience on artillery, engineers, reconnaissance, field hospitals and signals, three per army.
- **Air Missions**: superiority, ground support, strategic bombing, naval strike or home defence.
- **Game Rules**: difficulty, and strengthen or weaken eight powers before the game starts.
- Balance of Power for Manchukuo; a Kwantung garrison so Manchukuo is not overrun in 1937; focus prerequisites may now be alternatives of groups.
- Tree sources are in `js/tree_*.js`, written in a compact format laid out automatically by `autoTree` (`js/asia_tools.js`).

### 1.4 "Rising Sun"

Asia rebuilt.

- **Five new focus trees**, each over 230 focuses: Japan (Imperial Way, Control Faction, civilian purge or people's front; strike north or strike south), China (unify the warlords, fight the War of Resistance), Communist China (base areas, united front or civil war, the People's Republic), the Philippines (the ten-year road to independence) and Mongolia (Party, lamas and two giant neighbours).
- **A new map of China**: Guangxi, Yunnan, Shanxi, Sichuan and the Ma lands start as warlord cliques, Chinese subjects with very high autonomy.
- **Balance of Power**: an internal rivalry bar for Japan, China, Communist China, the Philippines and Mongolia, moved by focuses and political power, with bonuses and costs in each band.
- **Warlords and Unification**: China wears down and absorbs the cliques, or reconciles them in a federation; Japan can buy a warlord out of the war.
- **Naval Invasions**: land armies on an enemy coast within 3,800 km by sea, given naval superiority. The AI does it too.
- **Collaboration Governments**: turn occupied enemy land into a subject state from the Diplomacy tab.
- **Seasons and Weather**: winter, mud and monsoon slow marches and blunt attacks; new Weather map mode.
- Communist base areas can take over uprisings in occupied China. Authoritarian AI governments no longer vote themselves out of power. A war is only called a world war when four or more sovereign states are in it.

### 1.3 "Eastern Front"

- **Soviet Union, Czechoslovakia, Finland and Romania** get new focus trees.
- **Every national tree now has 230+ focuses**: shared sections add doctrine trees with exclusive
  paths, a programme per technology, law campaigns, interest-group politics, great-power
  relations and development of the country's own provinces.
- **Cabinet**: three ministers and three high-command seats with standing bonuses.
- **Occupation and Resistance**: occupation policy, requisition income, unrest, sabotage, uprisings.
- **Offensive Orders**: give armies an objective and a stance; they fight their way there.
- **The Verdict of History** (unique): five legacy ledgers earn the leader a lasting epithet,
  with a chronicle and a Year in Review each January.
- **World news and reaction events**: news popups for major events, decisions for the Rhineland,
  the Anschluss and Spain, and a prompt to step into any great-power crisis.
- **Wars screen** and a war/peace indicator in the top bar.
- **Interface**: outliner with alerts; left-drag box selection, right-drag / WASD map movement,
  keys 1-5 for speed.
- **Balance**: France, Britain and Poland start less ready; democracies sit out a Phoney War;
  the German AI attacks more readily.

### 1.2 "Allied Nations"

- **United States** (119 focuses), **United Kingdom** (133) and **France** (102) get large new
  focus trees with political alternatives and full industry, army, navy, air and science branches.
- **Intelligence Agency**: found an agency and run covert operations (steal blueprints, sabotage,
  propaganda, unrest, infiltrate a general staff, stage a coup) from the Intel tab.
- **Lend-Lease**: ship a standing share of war production to a country at war.
- **Puppet system**: subjects have autonomy and four levels with different tribute; tighten or
  loosen control, levy manpower, raise colonial divisions, invest, annex or free them; release
  nations whose homelands you hold; as a subject, seek autonomy or declare independence.
- **Army rework**: a Recruit tab with muster point, new-army formation and a visible training
  queue; rename armies; detach or transfer single divisions.
- **Quality of life**: select whole stacks, Shift-click and Shift-drag to mass-select, group
  orders, right-click a foreign country to open its diplomacy page.
- **Automation**: auto-build (Balanced / Civilian / Military) and auto-trade; a Trade tab with
  per-good import and export bans. Trade agreements now raise trade openness.

### 1.1.1

- Anschluss and Sudetenland: the historical timetable now binds only the AI, the Sudeten
  crisis resolves in two weeks, and the player is told when a demand is delivered and accepted.
- National modifiers for every major power (for example Rampant Corruption and an Inept
  Officer Corps for China), with focuses and decisions that remove the handicaps.

### 1.1 "Götterdämmerung"

- **Germany reworked**: a 263-focus tree in eight sections (foreign policy, party and state,
  a four-way opposition path, economy, army, air force, navy, secret weapons).
- **Hungary** (90 focuses) and **Austria** (75 focuses) get their own trees, including a
  restored Dual Monarchy and an Austria that can defy or accept the Anschluss.
- **Special Projects**: fifteen secret programmes, from radar networks to the atomic bomb,
  researched one at a time in a new Projects tab.
- **Hourly clock**: time advances hour by hour and all game speeds are slower.
- **New main menu** with country selection and update notes; section buttons for large trees.
- Focus trees can now be written in a compact text format (`js/focus_gd.js`).

### 1.0

Initial release.

## What is in it

- **Map**: 477 provinces and 73 playable countries with 1936 borders, drawn from Natural Earth data.
- **Economy**: 22 goods, 28 building types with production methods, national markets with price
  formation, world trade and tariffs, pop needs and standard of living, taxes, budget, debt,
  state and private construction queues.
- **Politics**: eight interest groups with clout and approval, legitimacy, 13 law categories,
  law debates, elections, ideology support, coups and civil wars.
- **Focus trees**: unique trees for Germany, the United States, the United Kingdom, France, Hungary, Austria, the Soviet Union, the United States, the United
  Kingdom, France, Italy, Japan, China, Poland, Spain and Turkey, each with historical and
  alternative paths; a generic tree with four political paths for everyone else.
- **Military**: seven division types, equipment made by your own war industry, historical and
  promoted generals with traits, terrain, forts, supply and encirclement, air and naval power,
  strategic bombing, blockade, naval invasions.
- **Diplomacy**: opinion, pacts, guarantees, factions, subjects, diplomatic plays that end in a
  climb-down or a war, capitulation and peace settlements.
- **Events and decisions**: a historical timeline (Spanish Civil War, Marco Polo Bridge, Munich,
  the Molotov–Ribbentrop Pact and more), around twenty random events, and about thirty decisions
  including formable nations.
- **AI**: runs every other country, with an optional historical mode. Your own armies can be left
  on Auto.

## Controls

Drag to pan, wheel or pinch to zoom. Click an army counter to select it, right-click a province
to march (or select the province and press "Move here"). Space pauses, `+`/`-` change speed.

## Development

- `node test/sim.js 6` runs a six-year all-AI simulation headlessly and validates content.
- `tools/buildmap.js` regenerates `data/map.js` from `data/provinces.js`
  (`npm i world-atlas d3-delaunay` first).

Balance is rough: the AI plays a recognisable but loose version of history.
Map data: Natural Earth, public domain.

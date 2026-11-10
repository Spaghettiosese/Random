# Iron Ledger 1936

An original grand strategy game that starts on 1 January 1936. It combines a wartime layer
(focus trees, divisions, generals, fronts, capitulation) with a peacetime layer (a market economy of
pops, goods and production methods, interest groups, laws and diplomatic plays).

Open `index.html` in a browser. No build step, no server.

## What is in it

- **Map**: 477 provinces and 73 playable countries with 1936 borders, drawn from Natural Earth data.
- **Economy**: 22 goods, 28 building types with production methods, national markets with price
  formation, world trade and tariffs, pop needs and standard of living, taxes, budget, debt,
  state and private construction queues.
- **Politics**: eight interest groups with clout and approval, legitimacy, 13 law categories,
  law debates, elections, ideology support, coups and civil wars.
- **Focus trees**: unique trees for Germany, the Soviet Union, the United States, the United
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

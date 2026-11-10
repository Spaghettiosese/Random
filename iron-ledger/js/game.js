// Main simulation loop.
'use strict';
const hashTag = t => { let h = 0; for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) % 997; return h; };
function gameTick() {
  G.day++; const cs = alive(), dt = dateObj(G.day), first = dt.getUTCDate() === 1;
  for (const c of cs) { politicsDaily(c); focusDaily(c); }
  militaryDaily(); playDaily(); eventsDaily();
  for (const c of cs) { if (!c.exists) continue; const h = hashTag(c.tag); if ((G.day + h) % 2 === 0) aiArmies(c.tag); if (c.ai && !c.capitulated && (G.day + h) % 7 === 0) aiWeekly(c); }
  if (G.day % 7 === 0) { economyTick(false); for (const c of alive()) { researchTick(c); militaryWeekly(c); } }
  if (first) { diplomacyMonthly(); for (const c of alive()) { politicsMonthly(c); monthlyPops(c); if (c.ai && !c.capitulated) aiMonthly(c); eventsMonthly(c); }
    if (dt.getUTCMonth() === 0) yearly(); }
  if (G.day % 30 === 0) for (const c of alive()) checkCapitulation(c.tag);
}
function yearly() {
  const rank = alive().sort((a, b) => score(b) - score(a)); G.stats.rank = rank.slice(0, 10).map(c => c.tag);
  logMsg(`A new year dawns: ${year()}. The leading powers are ${rank.slice(0, 3).map(c => c.name).join(', ')}.`, 'world');
}
const score = c => (c.stats.levels || 0) * 12 + countryStr(c.tag) * 2 + navalPower(c) * 4 + airPower(c) * 0.4;
function switchPlayer(tag) { if (G.C[G.player]) C(G.player).ai = true; G.player = tag; C(tag).ai = false; for (const a of armiesOf(tag)) a.auto = true; }

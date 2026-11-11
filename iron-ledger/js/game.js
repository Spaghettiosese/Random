// Main simulation loop.
'use strict';
const hashTag = t => { let h = 0; for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) % 997; return h; };
function hourTick() { G.hour = ((G.hour || 0) + 1) % 24; militaryHourly(); if (G.hour === 0) dayTick(); }
function gameTick() { for (let i = 0; i < 24; i++) hourTick(); } // one full day (used by the headless test)
function dayTick() {
  G.day++; const cs = alive(), dt = dateObj(G.day), first = dt.getUTCDate() === 1;
  for (const c of cs) { politicsDaily(c); focusDaily(c); }
  playDaily(); eventsDaily(); ordersTick(); invasionsTick();
  for (const c of cs) { if (!c.exists) continue; const h = hashTag(c.tag); if ((G.day + h) % 2 === 0) aiArmies(c.tag); if (c.ai && !c.capitulated && (G.day + h) % 7 === 0) { aiWeekly(c); if ((G.day + h) % 21 === 0) aiInvasions(c); } }
  if (G.day % 7 === 0) { economyTick(false); occupationTick(); clashTick(); { const pl = C(G.player); if (pl && pl.exists && !pl.ai) autoBuild(pl); } for (const c of alive()) { researchTick(c); militaryWeekly(c); projectTick(c); lendLeaseTick(c); intelTick(c); supportWeekly(c); } }
  if (first) { diplomacyMonthly(); subjectsMonthly(); embargoMonthly(); { const pl = C(G.player); if (pl && pl.exists && !pl.ai) autoTrade(pl); } for (const c of alive()) { politicsMonthly(c); monthlyPops(c); legacyMonthly(c); bopMonthly(c); if (c.ai && !c.capitulated) { aiMonthly(c); aiCabinet(c); aiClash(c); aiAir(c); } eventsMonthly(c); }
    if (dt.getUTCMonth() === 0) yearly(); }
  if (G.day % 30 === 0) for (const c of alive()) checkCapitulation(c.tag);
}
function yearly() {
  const rank = alive().sort((a, b) => score(b) - score(a)); G.stats.rank = rank.slice(0, 10).map(c => c.tag);
  logMsg(`A new year dawns: ${year()}. The leading powers are ${rank.slice(0, 3).map(c => c.name).join(', ')}.`, 'world');
  const pl = C(G.player); if (pl && pl.exists && !pl.ai && G.news !== false) { const l = legacyOf(pl), y0 = G.day - 366, ev = l.chron.filter(e => e.d >= y0).slice(-8); UIH.popup({ title: `${year() - 1}: The Year in Review`, icon: '📖', desc: `<div class="newsline">${pl.name} · rank ${rank.indexOf(pl) + 1} of ${rank.length}</div>${ev.length ? ev.map(e => `<div>• ${e.text}</div>`).join('') : '<div class="dim">A quiet year. The chroniclers found little to write.</div>'}<br><b>The verdict so far:</b> ${verdict(pl)}.`, options: [{ name: 'Turn the page.' }] }); }
}
const score = c => (c.stats.levels || 0) * 12 + countryStr(c.tag) * 2 + navalPower(c) * 4 + airPower(c) * 0.4;
function switchPlayer(tag) { if (G.C[G.player]) C(G.player).ai = true; G.player = tag; C(tag).ai = false; for (const a of armiesOf(tag)) a.auto = true; }

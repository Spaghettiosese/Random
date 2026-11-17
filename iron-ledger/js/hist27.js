// 2.7 historical course. In historical games the great powers open the crises of the 1930s (the Sudetenland, Memel,
// Danzig, Albania, Bessarabia) through their focus trees and the historical schedule, not through the generic AI's
// opportunistic plays over claims: an AI Germany that demanded Danzig in June 1939 fought Poland in July, before its
// "Danzig or War" focus could fire, and the focus (which needs Poland to exist) then locked "Strike in the West" and
// "War in the East" for the rest of the game.
'use strict';
const HIST_NO_PLAY = ['GER', 'ITA', 'JAP', 'SOV'];
{ const _ad = aiDiplomacy; aiDiplomacy = function (c) { if (!G.historical || !c.ai || !HIST_NO_PLAY.includes(c.tag) || year() >= 1946) return _ad(c);
  const sp = startPlay; startPlay = function (a, ...r) { if (a === c.tag) { c.infl += 40; return null; } return sp(a, ...r); };
  try { return _ad(c); } finally { startPlay = sp; } }; }
// A focus that only opens a crisis with a country already defeated by another road is spent, not locked: Danzig
// counts as done once Poland has fallen, the Sudetenland and Bohemia once Czechoslovakia is gone, so the branches
// behind them stay open (for the player as well as the AI).
const SPENT_FOCUS = [['GER', 'g_danzig', 'POL'], ['GER', 'g_sudeten', 'CZE'], ['GER', 'g_czech', 'CZE'], ['GER', 'g_memel', 'LIT']];
function spentFocus() { for (const [t, id, vs] of SPENT_FOCUS) { const c = C(t); if (!c || !c.exists || !c.focus || c.focus.done[id] || c.focus.cur === id) continue;
  const v = C(vs); if (v && v.exists && !v.capitulated) continue; if (!focusTree(c).some(f => f.id === id)) continue;
  c.focus.done[id] = G.day; } }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.tag === 'GER' && c.exists) spentFocus(); }; }

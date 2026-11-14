// 2.0 industry: an army is only as strong as the factories behind it.
// Equipment readiness = stockpiles against a quarter of what the fielded divisions carry; it scales their fighting power.
'use strict';
function eqNeed(c) { const n = {}; for (const a of armiesOf(c.tag)) for (const d of a.divs) { const u = UNITS[d.t]; for (const g in u.eq) n[g] = (n[g] || 0) + u.eq[g] * 0.25; } return n; }
function eqFillOf(c) { const n = eqNeed(c); let w = 0, f = 0; for (const g in n) { if (!n[g]) continue; const wt = g === 'arms' ? 2 : g === 'tanks' ? 1.5 : 1; w += wt; f += Math.min(1, (c.stock[g] || 0) / n[g]) * wt; } return w ? f / w : 1; }
{ const _mw = militaryWeekly; militaryWeekly = function (c) { _mw(c); c.eqFill = eqFillOf(c); }; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (!armies.length) return r; const c = C(armies[0].owner), f = c.eqFill === undefined ? 1 : c.eqFill, k = 0.7 + 0.3 * f; r.atk *= k; r.tough *= k; return r; }; }

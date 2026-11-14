// 2.0 (late): spy networks and oil embargoes — two systems that used to be flat bonuses.
'use strict';
// ---------- spy networks: built in chosen countries over time ----------
const netSlots = c => 1 + intelOf(c).lvl;
const netOf = (c, t) => (c.net && c.net[t]) || 0;
function netWeekly(c) { c.net = c.net || {}; c.netTargets = (c.netTargets || []).filter(t => ok(t) && t !== c.tag).slice(0, netSlots(c));
  if (c.ai && intelOf(c).lvl && !c.netTargets.length) { const t = enemiesOf(c.tag)[0] || alive().filter(k => k.major && k.tag !== c.tag && !friendly(c.tag, k.tag)).sort((a, b) => opinion(c.tag, a.tag) - opinion(c.tag, b.tag))[0]?.tag; if (t) c.netTargets = [t]; }
  for (const t in c.net) if (!c.netTargets.includes(t)) c.net[t] = Math.max(0, c.net[t] - 1.5);
  for (const t of c.netTargets) { const T = C(t), gain = 0.6 + intelOf(c).lvl * 0.55, block = (T.intel ? T.intel.lvl * 0.5 : 0) + ({ no_police: 0, guard: 0.4, secret_police: 1.2 })[T.laws.security] + (hasSpirit(T, 'i_counter') ? 1.5 : 0); c.net[t] = clamp(netOf(c, t) + gain - block, 0, 100); } }
{ const _oc = opChance; opChance = function (c, t, id) { return Math.min(95, _oc(c, t, id) * (1 + netOf(c, t.tag) / 150)); }; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (!armies.length || !eo) return r; const c = C(armies[0].owner); let best = 0; for (const t of eo) best = Math.max(best, netOf(c, t)); if (best >= 50) r.atk *= best >= 80 ? 1.08 : 1.04; return r; }; }
{ const _it = intelTick; intelTick = function (c) { _it(c); if (c.exists && !c.capitulated) netWeekly(c); }; }
function setNetTargets(c, list) { c.netTargets = list.slice(0, netSlots(c)); }
// ---------- oil embargoes: who sells oil decides who can fight ----------
const OIL_SELLERS = ['USA', 'SOV', 'HOL', 'ENG', 'VEN', 'PER', 'ROM', 'MEX'];
function oilEmbargoShare(c) { let tot = 0, cut = 0; for (const t of OIL_SELLERS) { if (!ok(t) || t === c.tag) continue; const k = C(t), w = sum(provsOf(t), p => p.res.oil || 0) + 1; tot += w; if (embargoing(k, c.tag) || atWar(t, c.tag)) cut += w; } return tot ? cut / tot : 0; }
{ const _ef = econFinish; econFinish = function (c, warm) { _ef(c, warm); if (!c.ful) return; const own = sum(provsOf(c.tag), p => (p.b.oilr || 0) + (p.b.synth || 0)), sh = oilEmbargoShare(c); c.oilCut = sh; if (sh > 0.05) c.ful.oil = Math.min(c.ful.oil, clamp(1 - sh * 0.9 + own * 0.04, 0.1, 1)); }; }

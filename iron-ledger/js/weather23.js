// 2.3 Weather and the state of the land.
//  - Weather: every air region has weather of its own each day, drawn from its climate and the season, lasting a few
//    days and carried east by the westerlies. The ground follows the weather: rain makes mud, snow lies and melts into
//    the spring thaw, hard frost makes the ground firm. Weather slows marches, blunts attacks, grounds aircraft, stops
//    landings in storms, and the cold and the heat wear down troops who are not ready for them.
//  - Province conditions: floods, scorched earth, devastation, partisans, epidemics, famine, the front line, refugees,
//    minefields, sieges and burning oil fields, each with effects on output, movement, combat, attrition and people.
'use strict';
// ======================= weather =======================
// [name, icon, { move: march time ×, atk: attack ±, air: air power ±, sea: blocks landings, cold/heat: wear }]
const WX = {
  clear: ['Clear', '☀️', {}], cloud: ['Overcast', '☁️', { air: -0.1 }], rain: ['Rain', '🌧️', { move: 1.15, atk: -0.08, air: -0.35 }],
  storm: ['Storms', '⛈️', { move: 1.3, atk: -0.15, air: -0.75, sea: 1 }], fog: ['Fog', '🌫️', { move: 1.08, atk: -0.12, air: -0.6 }],
  snow: ['Snowfall', '🌨️', { move: 1.25, atk: -0.1, air: -0.45 }], blizzard: ['Blizzard', '❄️', { move: 1.7, atk: -0.3, air: -0.9, sea: 1, cold: 2 }],
  heat: ['Heatwave', '🔥', { atk: -0.08, heat: 1 }], sand: ['Sandstorm', '🌪️', { move: 1.4, atk: -0.25, air: -0.8 }], monsoon: ['Monsoon Rains', '🌧️', { move: 1.35, atk: -0.12, air: -0.5 }]
};
const GROUND = { dry: ['Firm ground', '', {}], mud: ['Mud', '🟤', { move: 1.55, atk: -0.1 }], deep: ['Deep snow', '⛄', { move: 1.45, atk: -0.1 }], frozen: ['Frozen ground', '🧊', { move: 0.95 }], flood: ['Waterlogged', '💧', { move: 1.4, atk: -0.08 }] };
// the climate of each region: latitude, longitude, how continental, how dry, how wet in summer (terrain letters come
// straight from the province list: the regions are fixed before the game exists)
const PROV_RAW_TER = PROV_RAW.trim().split('\n').map(l => (l.split('|')[8] || 'p').trim());
const WXC = ZONES.map(z => { const ps = z.provs, lat = sum(ps, i => PLAT[i]) / ps.length, lon = sum(ps, i => PLON[i]) / ps.length, ter = t => ps.filter(i => (PROV_RAW_TER[i] || 'p') === t).length / ps.length;
  const coast = ps.filter(i => MAP.P[i] && NB[i] && NB[i].some(e => e.sea)).length / ps.length, A = Math.abs(lat), south = lat < 0;
  const inland = (lat > 38 && lon > 22 && lon < 135 && coast < 0.5) || (lat > 32 && lat < 60 && lon > -112 && lon < -82 && coast < 0.5) ? 1 : 0, maritime = lat > 40 && lat < 62 && lon > -12 && lon < 16 ? 1 : 0;
  const dry = Math.max(ter('d'), (lat > 15 && lat < 35 && lon > -18 && lon < 60 && ter('j') === 0) ? 0.6 : 0), mon = lat > -12 && lat < 30 && lon > 66 && lon < 132 ? 1 : 0;
  const mtn = ter('m'), base = 27.5 - 0.55 * Math.max(0, A - 14) + maritime * 3 - mtn * 5, half = 1.5 + 0.17 * A + inland * 6 - maritime * 2;
  // the region to the west, whose weather the westerlies bring
  let west = -1, bd = 1e9; for (const o of ZONES) { if (o === z) continue; let dx = z.x - o.x; if (dx < 0) dx += MAP.W; if (dx < 60 || dx > 520) continue; const d = dx + Math.abs(o.y - z.y) * 2.5; if (d < bd) { bd = d; west = o.id; } }
  return { lat, lon, A, south, base, half, coast, dry, mon, inland, mtn, jungle: ter('j'), west, westerly: A > 33 && A < 66 }; });
function wxTemp(z, day) { const k = WXC[z], m = dateObj(day).getUTCMonth() + dateObj(day).getUTCDate() / 31, ph = Math.cos(2 * Math.PI * (m - 6.6) / 12) * (k.south ? -1 : 1); return k.base + k.half * ph; }
const wxS = () => G.wx || (G.wx = { z: ZONES.map(() => ({ w: 'clear', t: 10, wet: 0, snow: 0, g: 'dry', d: 0 })) });
function wxDraw(zi, prev, westW) { const k = WXC[zi], s = wxS().z[zi], T = s.t, m = dateObj(G.day).getUTCMonth(), sum_ = k.south ? (m >= 11 || m <= 1) : (m >= 5 && m <= 7);
  // persistence: weather tends to last
  if (prev !== 'clear' && Math.random() < (prev === 'sand' || prev === 'storm' || prev === 'blizzard' ? 0.25 : 0.42)) return prev;
  // the westerlies carry fronts east
  if (k.westerly && westW && ['rain', 'storm', 'snow', 'blizzard'].includes(westW) && Math.random() < 0.25) return T < -1 ? (westW === 'storm' || westW === 'blizzard' ? (T < -8 ? 'blizzard' : 'snow') : 'snow') : (westW === 'snow' || westW === 'blizzard' ? 'rain' : westW);
  // monsoon
  if (k.mon && m >= 5 && m <= 8 && Math.random() < 0.55) return Math.random() < 0.15 ? 'storm' : 'monsoon';
  // deserts: heat, dust and almost no rain
  if (k.dry > 0.5) { const r = Math.random(), kh = m >= 2 && m <= 4 ? 0.07 : 0; if (T > 27 && Math.random() < 0.3) return 'heat'; if (r < 0.06 + kh) return 'sand'; if (r < 0.08 + kh && T > 2) return 'rain'; return 'clear'; }
  let wet = 0.19 + (k.coast > 0.5 ? 0.05 : 0) + (k.A < 12 ? 0.12 : 0) - k.dry * 0.25 + (k.jungle > 0.3 ? 0.1 : 0); if (k.mon && (m >= 10 || m <= 3)) wet = 0.07;
  if (k.A > 30 && k.A < 46 && k.lon > -10 && k.lon < 45 && sum_) wet = 0.06; // the dry Mediterranean summer
  if (k.inland && k.A > 44 && (m === 2 || m === 3 || m === 9 || m === 10)) wet += 0.18; // the autumn rains and the spring thaw
  const r = Math.random();
  if (r < wet) { if (T < -1) return T < -12 && Math.random() < 0.3 ? 'blizzard' : 'snow'; if (sum_ && T > 18 && Math.random() < 0.25) return 'storm'; if (!sum_ && k.coast > 0.4 && k.A > 40 && Math.random() < 0.2) return 'storm'; return 'rain'; }
  if (r < wet + 0.05 && (k.coast > 0.3 || k.mtn > 0.3) && !sum_) return 'fog';
  if (T > 33 && Math.random() < 0.2) return 'heat';
  return Math.random() < 0.35 ? 'cloud' : 'clear'; }
function wxDaily() { const S = wxS(), old = S.z.map(s => s.w);
  for (let i = 0; i < ZONES.length; i++) { const s = S.z[i], k = WXC[i]; s.t = wxTemp(i, G.day) + (Math.random() - 0.5) * 6 + (old[i] === 'clear' && s.t < 0 ? -2 : 0);
    s.w = wxDraw(i, old[i], k.west >= 0 ? old[k.west] : null);
    // the ground: rain soaks it, sun and wind dry it, snow lies until the thaw
    const mo = dateObj(G.day).getUTCMonth(), add = ({ rain: 1, storm: 1.5, monsoon: 2.2 }[s.w] || 0) * (k.inland && k.A > 44 && (mo === 9 || mo === 10 || mo === 2 || mo === 3) ? 1.9 : 1); if (s.t > 0) s.wet += add; if ((s.w === 'snow' || s.w === 'blizzard') && s.t <= 0) s.snow += s.w === 'blizzard' ? 2 : 1;
    s.snow = Math.min(15, s.snow); if (s.t > 1 && s.snow > 0) { const melt = Math.min(s.snow, 0.6 * s.t + 0.5); s.snow -= melt; s.wet += melt * 0.7; }
    s.wet = clamp(s.wet - (0.4 + Math.max(0, s.t) * 0.045 + (s.w === 'clear' || s.w === 'heat' ? 0.35 : 0)) * (k.dry > 0.5 ? 3 : 1), 0, 9);
    s.g = s.wet > 6 && k.mon ? 'flood' : s.snow > 4 ? 'deep' : s.wet > 3.5 && s.t > 0 && k.dry < 0.5 ? 'mud' : s.t < -6 && s.snow <= 4 ? 'frozen' : 'dry'; } }
const wxOf = pid => { const z = PZ[pid], s = G && G.wx ? G.wx.z[z] : null; return s || { w: 'clear', t: 15, g: 'dry', wet: 0, snow: 0 }; };
const wxEff = pid => { const s = wxOf(pid), a = WX[s.w][2], b = GROUND[s.g][2]; return { move: (a.move || 1) * (b.move || 1), atk: (a.atk || 0) + (b.atk || 0), air: a.air || 0, sea: !!a.sea, cold: a.cold || (s.t < -15 ? 1 : 0), heat: a.heat || (s.t > 36 ? 1 : 0) }; };
// the old seasonal weather of 1.4 is now read from the real weather: deep snow and blizzards are winter, mud is mud,
// the monsoon is the monsoon (asia.js keeps applying those three); the rest is applied here
weatherKey = function (pid) { if (!G || !G.wx) return 'clear'; const s = wxOf(pid); return s.g === 'deep' || s.w === 'blizzard' ? 'winter' : s.g === 'mud' || s.g === 'flood' ? 'mud' : s.w === 'monsoon' ? 'monsoon' : 'clear'; };
const wxRest = pid => { const s = wxOf(pid), a = WX[s.w][2], b = GROUND[s.g][2], legacy = weatherKey(pid);
  // what the legacy seasons do not cover: rain, storms, fog, snowfall, dust, heat and frozen ground
  const skipW = s.w === 'blizzard' || s.w === 'monsoon', skipG = s.g === 'deep' || s.g === 'mud' || s.g === 'flood';
  return { move: (skipW ? 1 : a.move || 1) * (skipG ? 1 : b.move || 1), atk: (skipW ? 0 : a.atk || 0) + (skipG || legacy !== 'clear' ? 0 : b.atk || 0) }; };
{ const _md = moveDays; moveDays = function (a, from, to, sea) { const d = _md(a, from, to, sea); if (sea || !G.wx) return d; return d * wxRest(to).move * pmEff(to).move; }; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (!armies.length || !p || !G.wx) return r; const pm = pmEff(p.id);
  if (attacking) { const c = C(armies[0].owner), e = wxRest(p.id), s = wxOf(p.id); let f = 1 + e.atk; if (s.w === 'heat' || s.w === 'sand') f = 1 + e.atk * (desertReady(c) ? 0.3 : 1); r.atk *= f * (1 + pm.atk); }
  else r.tough *= 1 + pm.def; return r; }; }
// aircraft fly less in bad weather; the air war in a stormy region matters less to the battle
{ const _ac = airCombat; airCombat = function (tag, pid) { const r = _ac(tag, pid); if (!G.wx) return r; const k = Math.max(0.05, 1 + wxEff(pid).air); r.casF *= k; r.supF = 1 + (r.supF - 1) * k; return r; }; }
// storms and blizzards stop landings and crossings into the region
{ const _so = seaOK; seaOK = function (tag, p) { if (G.wx && p && p.ctrl !== tag && atWar(tag, p.ctrl) && wxEff(p.id).sea) return false; return _so(tag, p); }; }
const desertReady = c => !!c && (c.spirits.some(s => /desert|afrika|sahara|camel/.test(s.id)) || ['ITA', 'EGY', 'SAU', 'IRQ', 'LBA', 'ENG'].includes(c.tag.slice(0, 3)));
// the cold and the heat wear down troops who are not ready for them; troops out of supply suffer worst
function wxAttrition() { for (const id in G.armies) { const a = G.armies[id], c = C(a.owner); if (!c || !a.divs.length) continue; const e = wxEff(a.loc), pm = pmEff(a.loc); let loss = 0;
    if (e.cold) loss += (winterReady(c) ? 0.002 : 0.009) * e.cold; if (e.heat) loss += desertReady(c) ? 0.001 : 0.004; loss += pm.attr * (frOurs(a.owner, P(a.loc)) && !a.oos ? 0.4 : 1);
    if (a.oos) loss *= 2; if (loss <= 0) continue; for (const d of a.divs) { d.str = Math.max(0.05, d.str - loss); d.org = Math.max(0, d.org - loss * 3); } c.casualties = (c.casualties || 0) + loss * a.divs.length * 2; } }

// ======================= province conditions =======================
// [name, icon, description, { out: output ±, move: march time ×, atk: attackers ±, def: defenders ±, attr: weekly attrition, pop: monthly population ±, unrest: weekly unrest + }]
const PMOD = {
  flooded: ['Flooded', '🌊', 'The dikes have been cut and the land is under water. Armies wade; the harvest is lost.', { out: -0.6, move: 2.6, atk: -0.45, attr: 0.006, pop: -0.002 }],
  scorched: ['Scorched Earth', '🔥', 'Everything of value was burnt before the enemy came: no food, no shelter, no rolling stock.', { out: -0.5, attr: 0.005, move: 1.1 }],
  devastated: ['Devastated', '🏚️', 'Shelling, bombing and street fighting have left little standing.', { out: -0.2, pop: -0.0005 }],
  partisans: ['Partisan Country', '🗡️', 'Ambushes, cut wires and blown bridges. Occupiers move slowly and lose men.', { attr: 0.004, move: 1.15, out: -0.1 }],
  epidemic: ['Epidemic', '🦠', 'Typhus, cholera or dysentery among soldiers and civilians alike.', { attr: 0.005, pop: -0.0015, out: -0.1 }],
  famine: ['Famine', '🍞', 'The granaries are empty. People flee to the cities or die on the roads.', { pop: -0.004, out: -0.25, unrest: 2 }],
  frontline: ['Front Line', '⚔', 'The enemy is across the river. Factories close and families leave.', { out: -0.15 }],
  refugees: ['Refugee Columns', '⛺', 'The roads are crowded with people fleeing the war.', { out: -0.05, move: 1.08 }],
  siege: ['Under Siege', '🏰', 'Surrounded: no supplies come in. The defenders weaken by the day.', { attr: 0.006, def: -0.1 }],
  mined: ['Minefields', '💣', 'Mines and wire across every approach.', { atk: -0.15, move: 1.2 }],
  oilfire: ['Burning Oil Fields', '🛢️', 'The wells were set alight and the refineries wrecked.', { out: -0.35 }],
  martial: ['Martial Law', '⛓', 'Curfews, hostages and checkpoints.', { out: 0.05, unrest: 1 }],
  dug: ['Fortified Zone', '🪖', 'Trenches, bunkers and anti-tank ditches dug by tens of thousands of civilians.', { def: 0.12, move: 1.05 }],
  bombed: ['Bombed Out', '💥', 'The city has been bombed night after night.', { out: -0.12, pop: -0.0005 }]
};
const pmS = p => p.pm || (p.pm = {});
function pmAdd(p, id, days, quiet) { if (!p || !PMOD[id]) return; const S = pmS(p); S[id] = Math.max(S[id] || 0, days ? G.day + days : 1e9); p._pe = null; if (!quiet) UIH.mapDirty(); }
const pmHas = (p, id) => !!(p.pm && p.pm[id] && p.pm[id] > G.day) || !!(p._pd && p._pd.includes(id));
function pmList(p) { const out = []; for (const id in p.pm || {}) if (p.pm[id] > G.day) out.push(id); for (const id of p._pd || []) if (!out.includes(id)) out.push(id); return out; }
// the summed effects, cached until the next weekly update
function pmEff(pid) { const p = G && G.P[pid]; if (!p) return { out: 0, move: 1, atk: 0, def: 0, attr: 0, pop: 0, unrest: 0 }; if (p._pe) return p._pe;
  const e = { out: 0, move: 1, atk: 0, def: 0, attr: 0, pop: 0, unrest: 0 }; for (const id of pmList(p)) { const m = PMOD[id][3]; e.out += m.out || 0; e.move *= m.move || 1; e.atk += m.atk || 0; e.def += m.def || 0; e.attr += m.attr || 0; e.pop += m.pop || 0; e.unrest += m.unrest || 0; }
  e.out = Math.max(-0.9, e.out); p.pout = 1 + e.out; return (p._pe = e); }
// the conditions that follow from the state of the war, recomputed every week
function pmWeekly() { const war = new Set(G.wars.flatMap(w => w.att.concat(w.def)));
  for (const p of G.P) { const d = [], o = p.owner, ct = p.ctrl;
    if (p.dmg > 0.35) d.push('devastated');
    if (p.scorched && G.day - p.scorched < 365) d.push('scorched');
    if ((p.unrest || 0) > 55 && ct !== o && atWar(o, ct)) d.push('partisans');
    if (war.has(ct) && NB[p.id].some(e => !e.sea && atWar(ct, P(e.to).ctrl))) { d.push('frontline'); const land = NB[p.id].filter(e => !e.sea); if (land.length >= 2 && land.every(e => atWar(ct, P(e.to).ctrl)) && armiesAt(p.id).some(a => a.owner === ct || friendly(ct, a.owner))) d.push('siege'); }
    else if (war.has(ct) && p.pop > 200 && NB[p.id].some(e => !e.sea && NB[e.to].some(f => !f.sea && atWar(ct, P(f.to).ctrl)))) d.push('refugees');
    if (typeof dzOf === 'function' && p._epi && G.day - p._epi < 60) d.push('epidemic');
    p._pd = d; p._pe = null; pmEff(p.id);
    // timed conditions expire
    if (p.pm) for (const id in p.pm) if (p.pm[id] <= G.day) delete p.pm[id]; } }
// population and unrest, once a month
function pmMonthly() { for (const p of G.P) { const e = pmEff(p.id); if (e.pop) p.pop = Math.max(1, p.pop * (1 + e.pop)); if (e.unrest && p.ctrl !== p.owner) p.unrest = Math.min(100, (p.unrest || 0) + e.unrest * 4); } }
// the economy reads p.pout (economy.js); the weekly and daily hooks
{ const _pd = playDaily; playDaily = function () { _pd(); wxDaily(); if (G.day % 7 === 2) { pmWeekly(); wxAttrition(); } if (dateObj(G.day).getUTCDate() === 2) pmMonthly(); }; }
// epidemics break out where armies crowd in heat, jungle and marsh, or among the hungry
{ const _pw = pmWeekly; pmWeekly = function () { for (const b of G.battles) { const p = P(b.prov), e = wxOf(p.id); if ((p.ter === 'j' || p.ter === 's' || e.t > 28 || pmHas(p, 'famine') || pmHas(p, 'flooded')) && Math.random() < 0.04) p._epi = G.day; } _pw(); }; }
// a landing due in a storm waits for the weather; no new landing sets out into one
{ const _it = invasionsTick; invasionsTick = function () { if (G.wx) for (const id in G.armies) { const a = G.armies[id]; if (!a.inv || a.inv.eta > G.day || !wxEff(a.inv.to).sea) continue; a.inv.eta = G.day + 1;
    if (a.owner === G.player && a.inv._wx !== G.day - 1) UIH.notify(`Storms over ${P(a.inv.to).name}: the landing waits for the weather.`, 'bad'); a.inv._wx = G.day; } _it(); }; }
{ const _ib = invasionBlock; invasionBlock = function (c, a, to) { if (G.wx && wxEff(to).sea) return `${WX[wxOf(to).w][0]} over the landing beaches`; return _ib(c, a, to); }; }

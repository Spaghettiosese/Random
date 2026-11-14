// 2.2 The War at Sea, and landings only by invasion.
// No army crosses the sea into enemy-held land by an ordinary march: a landing is a naval invasion (embarkation, days at
// sea, an assault at reduced strength, and command of the sea and the air), for every nation, player or AI.
// Merchant fleets carry each nation's trade; in war, enemy raiders and submarines sink them, escorts and convoys protect
// them, and shipyards replace them. Losses cut trade, and for island nations, supply and morale.
'use strict';
const noHostileSea = (t, p) => !atWar(t, p.ctrl);
const withNoSea = fn => function (...args) { const s = seaOK; seaOK = noHostileSea; try { return fn.apply(this, args); } finally { seaOK = s; } };
{ const _fp = findPath; findPath = withNoSea(_fp); }
{ const _mh = militaryHourly; militaryHourly = withNoSea(_mh); }
{ const _aa = aiArmies; aiArmies = withNoSea(_aa); }
// ---------- merchant fleets ----------
const SEA_TON0 = { ENG: 179, USA: 90, JAP: 56, NOR: 48, GER: 45, ITA: 34, FRA: 29, HOL: 29, GRE: 18, SWE: 16, SOV: 13, DEN: 12, CAN: 12, SPA: 9, AST: 5, BEL: 4, POR: 3, ARG: 4, BRA: 4, TUR: 2, FIN: 6, POL: 1, YUG: 4, ROM: 1, CHI: 3 };
const ISLAND = ['ENG', 'JAP', 'AST', 'NZL', 'IRE'];
const seaOf = c => c.sea || (c.sea = { ton0: SEA_TON0[c.tag] || Math.round(1 + ((c.stats && c.stats.ports) || 0) * 0.5), ton: SEA_TON0[c.tag] || Math.round(1 + ((c.stats && c.stats.ports) || 0) * 0.5), escort: 0, raid: 0, convoy: false, unres: false, lostM: 0, sunkM: 0, lostT: 0, sunkT: 0, hist: [] });
SPIRITS.shipping_losses = ['Shipping Losses', 'Ships that do not arrive: empty shelves, idle factories.', { tradecap: -0.05 }];
SPIRITS.convoys = ['Convoy System', 'Ships sail together under escort, slowly.', { tradecap: -0.05 }];
SPIRITS.fleet_tasks = ['Fleet on Trade Duties', 'Warships escorting convoys or hunting merchantmen are not with the battle fleet.', { navy: -0.1 }];
function seaMonthly() {
  const at = alive().filter(c => isAtWar(c.tag));
  for (const c of alive()) { const s = seaOf(c); s.lostM = 0; s.sunkM = 0; }
  for (const c of at) { const s = seaOf(c); if (s.ton <= 0.5) continue; let raid = 0; const raiders = [];
    for (const t of enemiesOf(c.tag)) { const e = C(t); if (!e || e.capitulated) continue; const es = seaOf(e); const r = navalPower(e) * es.raid * (es.unres ? 1.5 : 1) * (e.techs.m_nav2 ? 1.3 : 1); if (r > 0) { raid += r; raiders.push([e, r]); } }
    if (raid <= 0) continue; const esc = navalPower(c) * s.escort * (s.convoy ? 1.5 : 1) + airPower(c) * 0.01 * s.escort;
    const sunk = Math.min(s.ton * 0.15, s.ton * 0.06 * raid / (raid + esc * 1.5 + 40) * (s.convoy ? 0.6 : 1)); s.ton -= sunk; s.lostM += sunk; s.lostT += sunk;
    for (const [e, r] of raiders) { const es = seaOf(e); es.sunkM += sunk * r / raid; es.sunkT += sunk * r / raid; e.stock.ships = Math.max(0, e.stock.ships - e.stock.ships * es.raid * 0.012 * esc / (raid + esc + 1)); } }
  for (const c of alive()) { const s = seaOf(c), yards = sum(provsOf(c.tag), p => p.b.shipyard || 0);
    const liberty = c.tag === 'USA' && isAtWar('USA') && year() >= 1942 ? 6 : 0; s.ton = Math.min(s.ton0 * (liberty ? 2 : 1.15), s.ton + yards * 0.05 + liberty + (isAtWar(c.tag) ? 0 : Math.max(0, s.ton0 - s.ton) * 0.03));
    s.hist.push(+s.ton.toFixed(1)); if (s.hist.length > 60) s.hist.shift();
    const short = clamp(1 - s.ton / Math.max(1, s.ton0), 0, 1), isl = ISLAND.includes(c.tag); removeSpirit(c, 'shipping_losses'); removeSpirit(c, 'convoys'); removeSpirit(c, 'fleet_tasks');
    if (short > 0.08) { addSpirit(c, 'shipping_losses'); SPIRITS.shipping_losses[2] = { tradecap: -Math.min(0.35, short * 0.5), supply: isl ? -short * 0.2 : 0, stab: isl ? -Math.round(short * 10) : 0 }; }
    if (s.convoy && isAtWar(c.tag)) addSpirit(c, 'convoys');
    if (s.escort + s.raid > 0 && isAtWar(c.tag)) { addSpirit(c, 'fleet_tasks'); SPIRITS.fleet_tasks[2] = { navy: -(s.escort + s.raid) * 0.5 }; }
    if (s.unres && isAtWar(c.tag)) for (const k of alive()) if (k.major && !isAtWar(k.tag) && k.tag !== c.tag) addRel(k.tag, c.tag, k.tag === 'USA' ? -3 : -1);
    if (c.tag === G.player && s.lostM > 0.3) UIH.notify(`The war at sea: ${fmt(s.lostM * 100000)} tons of our shipping sunk this month.`, 'bad');
    if (c.ai) aiSea(c, s); }
}
function aiSea(c, s) { if (!isAtWar(c.tag)) { s.escort = 0; s.raid = 0; s.convoy = false; s.unres = false; return; }
  const foes = enemiesOf(c.tag).map(C).filter(Boolean), theirTrade = sum(foes, e => seaOf(e).ton), theirRaid = sum(foes, e => navalPower(e) * seaOf(e).raid);
  s.escort = theirRaid > 20 ? (s.ton > 40 ? 0.5 : 0.25) : 0; s.convoy = theirRaid > 40;
  s.raid = theirTrade > 30 && navalPower(c) > 30 ? (navalPower(c) < sum(foes, navalPower) ? 0.5 : 0.25) : 0;
  s.unres = s.raid > 0 && (c.ideology === 'fas' || c.ideology === 'com') && G.day > 1339 + 120; }
function seaSet(c, k, v) { const s = seaOf(c); if (k === 'escort' || k === 'raid') { const x = clamp(+v, 0, 0.75); if ((k === 'escort' ? x + s.raid : s.escort + x) > 1) return 'No more than the whole fleet'; s[k] = x; }
  else if (k === 'convoy') s.convoy = !s.convoy; else if (k === 'unres') { if (!s.unres && c.ideology === 'dem' && c.ws < 70) return 'Our people will not accept unrestricted submarine warfare (war support 70 needed)'; s.unres = !s.unres; } return ''; }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); seaMonthly(); }; }

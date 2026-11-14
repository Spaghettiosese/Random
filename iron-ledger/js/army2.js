// 2.0 Army: division templates from battalions, army groups under field marshals, experience ranks, reinforcement priority.
'use strict';
const BAT = {
  inf: { name: 'Infantry', icon: '🪖', atk: 1.2, def: 1.85, brk: 0.6, spd: 1, mp: 2.4, eq: { arms: 22, artillery: 1 }, days: 70, upkeep: 4.4 },
  art: { name: 'Artillery', icon: '💥', atk: 2.2, def: 0.7, brk: 0.3, spd: 1, mp: 1.5, eq: { artillery: 12, arms: 4 }, days: 80, upkeep: 5, tech: 'm_art1' },
  mtn: { name: 'Mountaineers', icon: '⛰️', atk: 1.2, def: 2.1, brk: 0.6, spd: 1, mp: 2.2, eq: { arms: 24, artillery: 2 }, days: 90, upkeep: 5.5, tech: 'm_mtn' },
  cav: { name: 'Cavalry', icon: '🐎', atk: 1, def: 1, brk: 1, spd: 1.6, mp: 1.6, eq: { arms: 16 }, days: 70, upkeep: 4.8 },
  mot: { name: 'Motorised', icon: '🚚', atk: 1.3, def: 1.8, brk: 1.3, spd: 2, mp: 2.4, eq: { arms: 20, autos: 8, artillery: 2 }, days: 80, upkeep: 6.8, oil: 0.2, tech: 'm_mot' },
  arm: { name: 'Tanks', icon: '🛡️', atk: 4, def: 1.4, brk: 5.5, spd: 2, mp: 1.6, eq: { tanks: 15, autos: 5, arms: 6 }, days: 120, upkeep: 12, oil: 0.6, tech: 'm_tank1' },
  eng: { name: 'Engineers', icon: '⛏️', atk: 0.3, def: 0.9, brk: 0.2, spd: 1, mp: 1, eq: { arms: 8, tools: 4 }, days: 60, upkeep: 3 },
  aa: { name: 'Anti-tank & AA', icon: '🎯', atk: 0.8, def: 1.2, brk: 0.4, spd: 1, mp: 1, eq: { artillery: 8 }, days: 60, upkeep: 3, tech: 'm_art2' }
};
const TPL_MAX = 12;
function tplStats(b) { const n = sum(Object.keys(b), k => b[k] || 0) || 1, u = { atk: 0, def: 0, brk: 0, mp: 0, eq: {}, days: 0, upkeep: 0, oil: 0, spd: 9, tech: null };
  for (const k in b) { const x = BAT[k], m = b[k] || 0; if (!m) continue; u.atk += x.atk * m; u.def += x.def * m; u.brk += x.brk * m; u.mp += x.mp * m; u.upkeep += x.upkeep * m; u.oil += (x.oil || 0) * m; u.days = Math.max(u.days, x.days); u.spd = Math.min(u.spd, x.spd); for (const g in x.eq) u.eq[g] = (u.eq[g] || 0) + x.eq[g] * m; if (x.tech && (!u.tech || TECHS[x.tech][2] > TECHS[u.tech][2])) u.tech = x.tech; }
  if (b.eng) u.def *= 1 + 0.04 * Math.min(2, b.eng); if (b.art) u.brk *= 1; if (n > 10) { const pen = 1 - (n - 10) * 0.04; u.atk *= pen; u.def *= pen; } // too wide: unwieldy
  const share = k => (b[k] || 0) / n; u.base = share('arm') >= 0.3 ? 'arm' : share('mot') >= 0.5 ? 'mot' : share('mtn') >= 0.5 ? 'mtn' : share('cav') >= 0.5 ? 'cav' : share('art') >= 0.3 ? 'hvy' : 'inf';
  for (const k of ['atk', 'def', 'brk', 'mp', 'upkeep', 'oil']) u[k] = Math.round(u[k] * 10) / 10; u.width = n; return u; }
function regTemplate(c, t) { const u = tplStats(t.b); UNITS[t.id] = Object.assign(u, { name: t.name, icon: BAT[u.base === 'hvy' ? 'art' : u.base] ? BAT[u.base === 'hvy' ? 'art' : u.base].icon : '🪖', tpl: c.tag }); }
function regAllTemplates() { if (!G) return; for (const t in G.C) for (const x of G.C[t].templates || []) regTemplate(G.C[t], x); }
{ const _ds = deserialize; deserialize = function (s) { const r = _ds(s); regAllTemplates(); return r; }; }
function saveTemplate(c, name, b, id) { const n = sum(Object.keys(b), k => b[k] || 0); if (n < 1) return 'A division needs at least one battalion'; if (n > 16) return 'At most 16 battalions';
  c.templates = c.templates || []; let t = id && c.templates.find(x => x.id === id); if (!t) { if (c.templates.length >= TPL_MAX) return `At most ${TPL_MAX} templates`; t = { id: `T_${c.tag}_${G.nid++}`, name: '', b: {} }; c.templates.push(t); }
  t.name = (name || 'Division').slice(0, 30); t.b = Object.assign({}, b); regTemplate(c, t); return ''; }
const DEFAULT_TPL = { 'Infantry Division': { inf: 7, art: 2 }, 'Panzer Division': { arm: 4, mot: 4, art: 1 } };
// experience ranks
const RANKS = [[0.15, 'Green'], [0.35, 'Trained'], [0.6, 'Regular'], [0.85, 'Veteran'], [2, 'Elite']];
const rankOf = xp => RANKS.find(r => (xp || 0) < r[0])[1];
// army groups under field marshals
const agOf = a => (C(a.owner).agroups || []).find(g => g.armies.includes(a.id));
function formGroup(c, list, name) { c.agroups = (c.agroups || []).map(g => ({ ...g, armies: g.armies.filter(i => !list.some(a => a.id === i)) })).filter(g => g.armies.length); const g = { id: G.nid++, name: name || `Army Group ${['North', 'Centre', 'South', 'East', 'West', 'A', 'B', 'C'][c.agroups.length % 8]}`, marshal: null, armies: list.map(a => a.id) }; c.agroups.push(g); return g; }
const marshalOf = (c, g) => g && g.marshal && c.gens.find(x => x.id === g.marshal);
function setMarshal(c, g, gid) { const m = c.gens.find(x => x.id === gid); if (!m) return 'No such general'; if (m.skill < 3) return 'A field marshal needs at least three stars'; for (const a of armiesOf(c.tag)) if (a.gen === gid) { a.gen = null; m.army = null; } for (const o of c.agroups || []) if (o.marshal === gid) o.marshal = null; g.marshal = gid; return ''; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (!armies.length) return r; const c = C(armies[0].owner); let b = 0;
  for (const a of armies) { const g = agOf(a), m = marshalOf(c, g); if (!m) continue; b += (m.skill * 0.025 + (attacking && (m.trait === 'off' || m.trait === 'panzer') ? 0.04 : 0) + (!attacking && m.trait === 'def' ? 0.05 : 0) + (m.trait === 'log' ? 0.02 : 0)) * a.divs.length; }
  const n = sum(armies, a => a.divs.length); if (n && b) r.atk *= 1 + b / n; return r; }; }
// marshals learn from their groups' battles; groups clean themselves up
{ const _mw = militaryWeekly; militaryWeekly = function (c) {
  const low = armiesOf(c.tag).filter(a => a.rprio === 'low'), saved = low.map(a => a.divs.map(d => d.str)); for (const a of low) for (const d of a.divs) d.str = 1; // low priority: skipped by reinforcement this week
  _mw(c); low.forEach((a, i) => a.divs.forEach((d, k) => { if (saved[i][k] !== undefined) d.str = Math.min(d.str, saved[i][k]); }));
  for (const a of armiesOf(c.tag)) if (a.rprio === 'high') for (const d of a.divs) { if (d.str >= 1 || c.manpower <= 0) continue; const u = UNITS[d.t], f = Math.min(0.06, 1 - d.str, c.manpower / u.mp); d.str += f; c.manpower -= f * u.mp; } // high priority: a second draft
  if (!c.agroups) return; c.agroups = c.agroups.map(g => ({ ...g, armies: g.armies.filter(i => G.armies[i] && G.armies[i].owner === c.tag) })).filter(g => g.armies.length);
  for (const g of c.agroups) { const m = marshalOf(c, g); if (!m) continue; if (g.armies.some(i => G.armies[i].battle)) { m.xp = (m.xp || 0) + 0.15; if (m.xp > m.skill * 3 + 3 && m.skill < 5) { m.skill++; m.xp = 0; if (c.tag === G.player) UIH.notify(`Field Marshal ${m.name} is promoted: ${'★'.repeat(m.skill)}.`, 'good'); } } } }; }
// AI: two templates, and a marshal for its largest group of armies
function aiArmy2(c) { if (!c.templates && (c.major || (c._ndiv || 0) > 25)) { c.templates = []; saveTemplate(c, `${c.adj} Infantry Division`, { inf: 7, art: c.techs.m_art1 ? 2 : 0 }); if (c.techs.m_tank1 && c.techs.m_mot) saveTemplate(c, `${c.adj} Armoured Division`, { arm: 4, mot: 4, art: 1 }); }
  if (c.major && !(c.agroups || []).length) { const l = armiesOf(c.tag).filter(a => !a.home && !a.garrison && a.divs.length >= 4).sort((x, y) => y.divs.length - x.divs.length).slice(0, 4); if (l.length >= 3) { const g = formGroup(c, l); const m = c.gens.filter(x => x.skill >= 3 && !x.army).sort((x, y) => y.skill - x.skill)[0]; if (m) setMarshal(c, g, m.id); } } }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.ai && c.exists && !c.capitulated) aiArmy2(c); }; }
// the AI recruits its own templates in place of the stock divisions
{ const _rc = recruit; recruit = function (c, type, n, loc) { if (c.ai && c.templates && c.templates.length) { const t = (type === 'arm' || type === 'mot') ? c.templates.find(x => UNITS[x.id] && UNITS[x.id].base === 'arm') : (type === 'inf' || type === 'hvy') ? c.templates.find(x => UNITS[x.id] && UNITS[x.id].base !== 'arm') : null; if (t && (!UNITS[t.id].tech || c.techs[UNITS[t.id].tech])) type = t.id; } return _rc(c, type, n, loc); }; }

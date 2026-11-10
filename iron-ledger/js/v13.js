// Eastern Front update (1.3) systems: focus-tree extension library, Cabinet, Occupation and Resistance,
// Offensive Orders, Legacy (the verdict of history), world news and reaction events.
'use strict';
// ---------- focus-tree extension library: brings every tree past 230 focuses ----------
const DOCTRINES = {
  land: ['Army Doctrine Review', 'The general staff argues about the next war.', [
    ['Mobile Warfare', 'tank .05', 'Armoured Spearheads', 'tank .05', 'Motorised Supply', 'supply .06', 'Mission Tactics', 'org .04', 'Deep Penetration', 'atk .03', 'Encirclement Battles', 'atk .03', 'Lightning Campaigns', 'org .04, atk .02'],
    ['Superior Firepower', 'atk .02', 'Integrated Artillery', 'atk .03', 'Shock and Fire', 'def .03', 'Air-Land Coordination', 'cas .12', 'Central Fire Control', 'atk .03', 'Mechanised Support', 'supply .05', 'Overwhelming Fire', 'atk .04'],
    ['Grand Battle Plan', 'entrench .06', 'Prepared Defences', 'def .03', 'Infantry Assault', 'atk .02', 'Lessons of the Trenches', 'entrench .06', 'Planning Staffs', 'org .04', 'Night Attacks', 'atk .03', 'The Set-Piece Offensive', 'def .04'],
    ['Mass Assault', 'manpower .04', 'A People\'s Army', 'train .08', 'Waves of Infantry', 'atk .02', 'Vast Reserves', 'manpower .05', 'War in the Rear', 'supply .05', 'Broad Fronts', 'org .04', 'Continuous Offensive', 'atk .03']]],
  air: ['Air Doctrine Review', 'What is an air force for?', [
    ['Strategic Destruction', 'bombing .12', 'Massed Bomber Formations', 'bombing .12', 'Escort Doctrine', 'air .04', 'Day and Night Offensive', 'bombing .15', 'Air Superiority First', 'air .05'],
    ['Battlefield Support', 'cas .12', 'Forward Air Controllers', 'cas .12', 'Dive Bombing Schools', 'cas .1', 'Combined Operations Staff', 'air .04', 'Interdiction', 'cas .15'],
    ['Operational Integrity', 'air .04', 'Dispersed Airfields', 'civdef .12', 'Fighter Sweeps', 'air .05', 'Ground Control', 'civdef .12', 'Mass Fighter Production', 'air .06']]],
  sea: ['Naval Doctrine Review', 'Battleships, carriers or submarines?', [
    ['Fleet in Being', 'navy .04', 'Battle Line Tactics', 'navy .05', 'Escort Screens', 'navy .04', 'Convoy Discipline', 'tradecap .03', 'Decisive Battle', 'navy .06'],
    ['Trade Interdiction', 'navy .04', 'Commerce Raiding', 'navy .04', 'Undersea Warfare', 'navy .05', 'Wolfpack Tactics', 'navy .05', 'Unrestricted Campaign', 'navy .06'],
    ['Base Strike', 'navy .04', 'Carrier Aviation', 'navy .05', 'Naval Air Arm', 'air .03', 'Fast Task Forces', 'navy .05', 'Strike from the Sea', 'navy .06']]]
};
const BASIC_LAW_BLOCK = (c, cat, law) => c.laws[cat] === law ? 'in force' : (cat === 'gov' && law === 'council' && c.ideology !== 'com') || (cat === 'econ' && law === 'command' && c.ideology !== 'com') || (cat === 'gov' && law === 'oneparty' && c.ideology === 'dem') || (cat === 'power' && law === 'universal' && c.ideology === 'fas') ? 'ideology' : '';
function extendTree(tag, tree) {
  if (tree.length >= 230 || tree._ext) return tree; tree._ext = true; const base = tag.slice(0, 3), d = COUNTRY_DEF[base] || { a: tag }; let x = Math.max(...tree.map(f => f.x)) + 3;
  const add = (id, name, fx_, y, pre, eff, desc, o = {}) => { const f = Object.assign({ id: 'x_' + id, name, x: fx_, y, pre: pre ? pre.split('|').map(p => 'x_' + p).join('|') : '', eff: typeof eff === 'string' ? fx(eff, desc) : eff, desc, days: 42, ai: 0.35 }, o); if (f.mutex) f.mutex = f.mutex.split(',').map(p => 'x_' + p).join(','); tree.push(f); return f; };
  // doctrines
  for (const k of ['land', 'air', 'sea']) { const D_ = DOCTRINES[k], n = D_[2].length; add(k, D_[0], x + Math.floor((n - 1) / 2), 0, '', 'pp 20; res 10', D_[1], k === 'land' ? { sec: 'Doctrine' } : {});
    D_[2].forEach((path, pi) => { for (let i = 0; i < path.length; i += 2) { const s = i / 2; add(`${k}${pi}_${s}`, path[i], x + pi, s + 1, s ? `${k}${pi}_${s - 1}` : k, `spirit ${path[i]}: ${path[i + 1]}`, `${d.a} doctrine: ${path[i].toLowerCase()}.`, s ? {} : { mutex: D_[2].map((_, j) => j === pi ? null : `${k}${j}_0`).filter(Boolean).join(',') }); } });
    x += n + 1; }
  // technology programmes
  let first = true;
  for (const cat of ['prod', 'mil', 'soc']) { const list = Object.keys(TECHS).filter(t => TECHS[t][1] === cat).sort((a, b) => TECHS[a][2] - TECHS[b][2]);
    list.forEach((t, i) => { const col = Math.floor(i / 7), row = i % 7; add('t_' + t, `${TECHS[t][0]} Programme`, x + col, row, row ? 't_' + list[i - 1] : '', { fn: c => { if (c.techs[t]) { for (const k in c.research) if (c.research[k]) c.research[k].prog += 15; } else if (year() >= TECHS[t][2] - 1) grantTech(c, t); else { c.resBank = (c.resBank || 0) + 40; for (const k in c.research) if (c.research[k]) c.research[k].prog += 20; } }, tip: `Gain <b>${TECHS[t][0]}</b> if the year is ${TECHS[t][2] - 1} or later; otherwise a large research bonus` }, `A state programme to master ${TECHS[t][0].toLowerCase()}.`, first ? { sec: 'Technology' } : {}); first = false; });
    x += Math.ceil(list.length / 7) + 1; }
  // legislation
  first = true;
  for (const cat in LAWS) { if (LAWS[cat].instant) continue; const laws = Object.keys(LAWS[cat].laws);
    laws.forEach((l, i) => add('l_' + l, LAWS[cat].laws[l][0], x, i, '', { law: l, pp: 20 }, `${LAWS[cat].name}: bring in ${LAWS[cat].laws[l][0].toLowerCase()} by national campaign rather than parliamentary debate.`, Object.assign({ ai: 0, mutex: laws.filter(o => o !== l).map(o => 'l_' + o).join(','), req: [c => !BASIC_LAW_BLOCK(c, cat, l), 'Not already in force, and compatible with our ideology'] }, first ? { sec: 'Legislation' } : {})) && (first = false));
    x += 1; }
  x += 1;
  // interest groups
  IG_IDS.forEach((g, i) => { const n = IGS[g][0];
    add('ig_' + g, `Court the ${n}`, x + i, 0, '', { ig: { [g]: { appr: 6 } }, pp: 10 }, `Dinners, honours and promises for the ${n.toLowerCase()}.`, i ? {} : { sec: 'Society' });
    add('ig_' + g + '_up', `Empower the ${n}`, x + i, 1, 'ig_' + g, { ig: { [g]: { appr: 4, clout: 0.25 } } }, `The ${n.toLowerCase()} gain a larger say in the state.`, { mutex: 'ig_' + g + '_dn' });
    add('ig_' + g + '_dn', `Curb the ${n}`, x + i, 2, 'ig_' + g, { ig: { [g]: { appr: -6, clout: -0.25 } }, pp: 40 }, `The ${n.toLowerCase()} are put in their place.`, { mutex: 'ig_' + g + '_up', ai: 0.1 }); });
  x += IG_IDS.length + 1;
  // great powers
  Object.keys(COUNTRY_DEF).filter(t => COUNTRY_DEF[t].maj && t !== base).forEach((m, i) => { const n = COUNTRY_DEF[m].n;
    add('gp_' + m, `Mission to ${n}`, x + i, 0, '', fx(`rel ${m} 15; trade ${m}`), `A delegation and a commercial treaty.`, Object.assign({ req: existsReq(m) }, i ? {} : { sec: 'Great Powers' }));
    add('gp_' + m + '_f', `Understanding with ${n}`, x + i, 1, 'gp_' + m, fx(`rel ${m} 30; nap ${m}`), `A quiet agreement to leave each other alone.`, { mutex: 'gp_' + m + '_d', req: existsReq(m), ai: 0.15 });
    add('gp_' + m + '_d', `Denounce ${n}`, x + i, 2, 'gp_' + m, fx(`rel ${m} -30; ws 3; tension 1`), `Speeches, boycotts and recalled ambassadors.`, { mutex: 'gp_' + m + '_f', ai: 0.05 }); });
  x += 9;
  // provinces
  const rows = PROV_RAW.trim().split('\n').map((l, i) => [i, l.split('|')]).filter(r => r[1][4] === base).sort((a, b) => (+b[1][9] || 1) - (+a[1][9] || 1)).slice(0, 12);
  rows.forEach(([pid, r], i) => { const res = (r[7].match(/[ciro]\d/g) || []).sort((a, b) => b[1] - a[1])[0], bt = res ? { c: 'coalm', i: 'ironm', o: 'oilr', r: 'rubberp' }[res[0]] : null;
    add('pr_' + pid, `Develop ${r[0]}`, x + i, 0, '', { fn: c => { const p = P(pid); if (p.owner !== c.tag) { c.pp += 20; return; } if (bt && canBuild(c, bt, p)) p.b[bt] = (p.b[bt] || 0) + 1; else p.b.urban = (p.b.urban || 0) + 1; p.b.tools = (p.b.tools || 0) + 1; p.b.railway = (p.b.railway || 0) + 1; }, tip: `${r[0]} gains ${bt ? BLD[bt].name : 'Service Districts'}, Tooling Workshops and a Railway` }, `Investment for ${r[0]} and its hinterland.`, i ? {} : { sec: 'Provinces' });
    add('pr_' + pid + '_f', `Fortify ${r[0]}`, x + i, 1, 'pr_' + pid, { fort: [r[0]] }, `Bunkers and batteries around ${r[0]}.`);
    add('pr_' + pid + '_u', `${r[0]} Institute`, x + i, 2, 'pr_' + pid, { fn: c => { const p = P(pid); if (p.owner === c.tag) p.b.university = (p.b.university || 0) + 1; else c.pp += 20; }, tip: `${r[0]} gains a University`, research: 10 }, `A technical college for ${r[0]}.`); });
  return tree;
}
for (const k in TREES) extendTree(k, TREES[k]);
{ const _gen = genericTree; genericTree = c => extendTree(c.tag, _gen(c)); }

// ---------- Cabinet ----------
const MINISTERS = {
  industry: ['Captain of Industry', 'pol', { build: 0.1 }], warind: ['War Industrialist', 'pol', { mil_out: 0.1 }], finance: ['Financial Wizard', 'pol', { tax: 0.08 }], figure: ['Popular Figurehead', 'pol', { stab: 6 }],
  schemer: ['Backroom Schemer', 'pol', { pp: 0.15 }], terror: ['Prince of Terror', 'pol', { rad: -0.15, stab: -2 }], diplomat: ['Smooth Diplomat', 'pol', { infl: 0.25 }], teacher: ['Education Reformer', 'pol', { research: 0.06, literacy: 0.3 }],
  agrarian: ['Agrarian Champion', 'pol', { farm_out: 0.1, rad: -0.04 }], trader: ['Trade Negotiator', 'pol', { tradecap: 0.1 }], herald: ['Propaganda Chief', 'pol', { ws: 8 }], reformer: ['Social Reformer', 'pol', { rad: -0.1 }],
  offence: ['Offensive Planner', 'mil', { atk: 0.05 }], defence: ['Defensive Planner', 'mil', { def: 0.06 }], organiser: ['Master Organiser', 'mil', { org: 0.08 }], logistics: ['Chief Quartermaster', 'mil', { supply: 0.15 }],
  drill: ['Drillmaster', 'mil', { train: 0.15 }], armour: ['Armour Theorist', 'mil', { tank: 0.12 }], airchief: ['Air Chief', 'mil', { air: 0.12 }], bomber: ['Bomber Advocate', 'mil', { bombing: 0.3 }],
  admiral: ['Naval Strategist', 'mil', { navy: 0.12 }], boffin: ['Scientific Adviser', 'mil', { proj: 0.2 }]
};
for (const id in MINISTERS) SPIRITS['min_' + id] = ['Cabinet: ' + MINISTERS[id][0], MINISTERS[id][1] === 'pol' ? 'A member of the cabinet.' : 'A member of the high command.', MINISTERS[id][2]];
const cabinetOf = c => c.cabinet || (c.cabinet = []);
function ministerBlock(c, id) { const cab = cabinetOf(c), m = MINISTERS[id]; if (cab.includes(id)) return 'in'; if (id === 'terror' && c.ideology === 'dem') return 'Unthinkable in a democracy'; if (cab.filter(x => MINISTERS[x][1] === m[1]).length >= 3) return `All three ${m[1] === 'pol' ? 'cabinet' : 'high command'} seats are filled`; if (c.pp < 80) return 'Requires 80 political power'; return ''; }
function appoint(c, id) { if (ministerBlock(c, id)) return false; c.pp -= 80; cabinetOf(c).push(id); addSpirit(c, 'min_' + id); return true; }
function dismiss(c, id) { const cab = cabinetOf(c), i = cab.indexOf(id); if (i < 0) return; cab.splice(i, 1); removeSpirit(c, 'min_' + id); }
function aiCabinet(c) { if (c.pp < 320 || Math.random() > 0.2) return; const opts = Object.keys(MINISTERS).filter(id => !ministerBlock(c, id)); if (opts.length) appoint(c, pick(opts)); }

// ---------- Occupation and Resistance ----------
const OCC = { lenient: ['Lenient Occupation', 1.5, 0.6, 'Low yield, slow resistance'], military: ['Military Administration', 2.5, 1.2, 'Balanced'], harsh: ['Harsh Requisitions', 4.5, 2.4, 'High yield, manpower levies, fast-growing resistance and devastation'] };
const occPolicy = c => c.occ || (c.ideology === 'dem' ? 'lenient' : c.ideology === 'fas' ? 'harsh' : 'military');
function occupationTick() {
  const gar = {}; for (const id in G.armies) { const a = G.armies[id]; gar[a.loc + '|' + a.owner] = (gar[a.loc + '|' + a.owner] || 0) + a.divs.length; }
  for (const c of alive()) c.occYield = 0;
  for (const p of G.P) {
    if (p.ctrl === p.owner || friendly(p.ctrl, p.owner)) { if (p.unrest) { p.unrest -= 8; if (p.unrest <= 0) delete p.unrest; } continue; }
    const o = C(p.ctrl), own = C(p.owner); if (!o || !o.exists || !own) continue; const pol = OCC[occPolicy(o)], g = gar[p.id + '|' + o.tag] || 0;
    p.unrest = clamp((p.unrest || 0) + pol[1] + (own.ws || 0) / 60 - g * 2.5 - (p.cores.includes(o.tag) ? 4 : 0) - (p.cores.includes(p.owner) ? 0 : 1.5), 0, 100);
    const y = p.pop / 1000 * pol[2] * (1 - p.unrest / 100) * 4 * (1 + p.dev * 0.5); o.money += y; o.occYield += y;
    if (occPolicy(o) === 'harsh') { o.manpower += p.pop * 0.00002; p.dmg = Math.min(0.5, p.dmg + 0.004); }
    if (p.unrest > 60) for (const a of armiesAt(p.id)) if (a.owner === o.tag) for (const d of a.divs) { d.org = Math.max(0.1, d.org - 0.08); d.str = Math.max(0.1, d.str - 0.01); }
    if (p.unrest >= 100 && !g && !NB[p.id].some(e => !e.sea && gar[e.to + '|' + o.tag])) {
      if (G.flags.prc_bases && p.owner !== 'PRC' && chineseSoil(p) && ok('PRC') && !C('PRC').capitulated && atWar('PRC', o.tag)) { p.owner = 'PRC'; p.ctrl = 'PRC'; p.unrest = 0; logMsg(`Communist partisans set up a base area at ${p.name}.`, 'info', [o.tag, 'PRC', 'CHI']); UIH.mapDirty(); }
      else if (own.exists && !own.capitulated && atWar(p.owner, o.tag)) { p.ctrl = p.owner; p.unrest = 30; logMsg(`An uprising liberates ${p.name} from ${o.name}.`, p.vp >= 8 ? 'world' : 'info', [o.tag, p.owner]); UIH.mapDirty(); }
      else { p.unrest = 70; p.dmg = Math.min(0.6, p.dmg + 0.1); if (o.tag === G.player) UIH.notify(`Partisans wreck factories and rail lines around ${p.name}.`, 'bad'); } }
  }
}
// ---------- Offensive Orders ----------
const STANCE = { agg: ['Aggressive', 0.75, 0.35], bal: ['Balanced', 1.15, 0.5], care: ['Careful', 1.7, 0.7] };
function setOrder(a, to, stance) { a.order = { to, st: stance || (a.order && a.order.st) || 'bal' }; a.auto = false; if (a.battle) leaveBattle(a); a.path = []; }
function ordersTick() {
  for (const id in G.armies) { const a = G.armies[id], o = a.order; if (!o) continue;
    if (a.loc === o.to) { delete a.order; if (a.owner === G.player) UIH.notify(`${a.name} has reached ${P(o.to).name}. Objective taken.`, 'good'); continue; }
    if (a.battle || a.path.length || !a.divs.length) continue; const st = STANCE[o.st] || STANCE.bal;
    if (sum(a.divs, d => d.org) / a.divs.length < st[2] || a.oos) continue;
    const path = findPath(a.owner, a.loc, o.to); if (!path) { delete a.order; if (a.owner === G.player) UIH.notify(`${a.name} can find no road to ${P(o.to).name}; the offensive is called off.`, 'bad'); continue; }
    const nx = P(path[0]); if (atWar(a.owner, nx.ctrl)) { const def = sum(armiesAt(nx.id).filter(x => atWar(a.owner, x.owner)), armyStr) * (1 + TERRAIN[nx.ter][1] + nx.fort * 0.12); let att = 0; for (const x of armiesAt(a.loc)) if (x.owner === a.owner && x.order && x.order.to === o.to) att += armyStr(x); for (const b of G.battles) if (b.prov === nx.id) att += sum(b.att, i => G.armies[i] && G.armies[i].loc !== a.loc ? armyStr(G.armies[i]) : 0); if (def > 0 && att / def < st[1]) continue; }
    a.path = [path[0]]; a.prog = 0; }
}
// ---------- Legacy: the verdict of history ----------
const LEGACY = {
  conq: ['Conquest', '⚔️', [['the Ambitious', { ws: 3 }], ['the Conqueror', { atk: 0.04, ws: 5 }], ['Scourge of Nations', { atk: 0.06, ws: 8, infamy: 0.2 }]]],
  peace: ['Peace', '🕊️', [['the Honest Broker', { infl: 0.1 }], ['the Peacemaker', { infl: 0.2, stab: 3 }], ['Conscience of the World', { infl: 0.35, stab: 5, infamy: -0.3 }]]],
  build: ['Works', '🏗️', [['the Builder', { build: 0.05 }], ['the Great Moderniser', { build: 0.08, output: 0.03 }], ['Architect of the Century', { build: 0.12, output: 0.05, invest: 0.15 }]]],
  reform: ['Reform', '📜', [['the Reformer', { rad: -0.05 }], ['the Lawgiver', { rad: -0.08, legit: 5 }], ['Founder of the Nation', { rad: -0.12, legit: 10, stab: 4 }]]],
  liber: ['Liberation', '🗽', [['Friend of Small Nations', { infl: 0.1 }], ['the Liberator', { infl: 0.15, ws: 5 }], ['Deliverer of Peoples', { infl: 0.3, ws: 8, legit: 6 }]]]
};
const LEG_STEPS = [25, 60, 120];
for (const k in LEGACY) LEGACY[k][2].forEach((t, i) => SPIRITS['leg_' + k + i] = ['Legacy: ' + t[0].replace(/^the /, 'The '), `History remembers this government for its ${LEGACY[k][0].toLowerCase()}.`, t[1]]);
const legacyOf = c => c.legacy || (c.legacy = { conq: 0, peace: 0, build: 0, reform: 0, liber: 0, lv: {}, chron: [] });
function chronicle(c, text) { const l = legacyOf(c); l.chron.push({ d: G.day, text }); if (l.chron.length > 60) l.chron.shift(); }
function legacyAdd(c, k, n, note) {
  if (!c || !c.exists || !G || G.day < 1) return; const l = legacyOf(c); l[k] += n; if (note) chronicle(c, note); const lv = l.lv[k] || 0;
  if (lv < 3 && l[k] >= LEG_STEPS[lv]) { if (lv) removeSpirit(c, 'leg_' + k + (lv - 1)); addSpirit(c, 'leg_' + k + lv); l.lv[k] = lv + 1; const t = LEGACY[k][2][lv][0]; chronicle(c, `History begins to call ${c.leader} “${t}”.`);
    if (c.tag === G.player) UIH.popup({ title: 'The Verdict of History', icon: LEGACY[k][1], desc: `Chroniclers have found a name for this government. For its record of <b>${LEGACY[k][0].toLowerCase()}</b>, ${c.leader} is coming to be known as <b>${t}</b>.<br><br>${modText(LEGACY[k][2][lv][1])}`, options: [{ name: 'Let them write it down.' }] }); }
}
function verdict(c) { const l = legacyOf(c), top = Object.keys(LEGACY).sort((a, b) => (l.lv[b] || 0) - (l.lv[a] || 0) || l[b] - l[a])[0], lv = l.lv[top] || 0; return lv ? `${c.leader}, ${LEGACY[top][2][lv - 1][0]}` : `${c.leader} — history has not yet made up its mind`; }
function legacyMonthly(c) { const l = legacyOf(c); if (!isAtWar(c.tag)) legacyAdd(c, 'peace', c.major ? 0.5 : 0.35); if (c.sol > (l.solRef || c.sol) + 1) { l.solRef = c.sol; legacyAdd(c, 'reform', 2, `Living standards rise to ${c.sol.toFixed(1)}.`); } else if (!l.solRef) l.solRef = c.sol; }
// hooks into the simulation
{ const _annex = annex; annex = function (a, tag, peaceful) { const n = provsOf(tag).length, nm = cname(tag), maj = C(a) && C(a).major; _annex(a, tag, peaceful); legacyAdd(C(a), 'conq', 4 + n * (peaceful ? 0.8 : 1.5), `${nm} is annexed.`); if (maj && n >= 2) worldNews(`${cname(a)} Annexes ${nm}`, `${nm} has ceased to exist as an independent state. Its territory passes to ${cname(a)}.`, '🗺️', [a]); };
  const _dw = declareWarInner; declareWarInner = function (a, b, goals, name, noCall, rt) { const w = _dw(a, b, goals, name, noCall, rt); if (w) { legacyAdd(C(a), 'conq', C(b).major ? 6 : 3, `War is declared on ${cname(b)}.`); if ((C(a).major || C(b).major) && !C(a).civilOf) worldNews(`${cname(a)} Declares War on ${cname(b)}`, `${cname(a)} is at war with ${cname(b)}.${w.att.length + w.def.length > 2 ? ` The ${w.name} now involves ${w.att.length + w.def.length} nations.` : ''}`, '⚔️', [a, b]); } return w; };
  const _rc = releaseCountry; releaseCountry = function (tag, from) { const r = _rc(tag, from); if (r) legacyAdd(C(from), 'liber', 10, `${cname(tag)} is restored.`); return r; };
  const _ap = addPact; addPact = function (t, a, b, days) { const had = hasPact(t, a, b); _ap(t, a, b, days); if (!had && t !== 'truce' && t !== 'access') { legacyAdd(C(a), 'peace', 1.5); legacyAdd(C(b), 'peace', 1); } };
  const _sl = setLaw; setLaw = function (c, l) { const was = c.laws[lawCat(l)]; _sl(c, l); if (was !== l && !LAWS[lawCat(l)].instant) legacyAdd(c, 'reform', 3, `${lawName(l)} becomes law.`); };
  const _wp = whitePeace; whitePeace = function (w) { const a = C(w.att[0]), b = C(w.def[0]); _wp(w); legacyAdd(a, 'peace', 6, 'A white peace is signed.'); legacyAdd(b, 'peace', 6, 'A white peace is signed.'); };
  const _cap = capitulate; capitulate = function (tag) { const c = C(tag), maj = c.major, occ = {}; for (const p of G.P) if (p.owner === tag && p.ctrl !== tag) occ[p.ctrl] = (occ[p.ctrl] || 0) + p.vp; const top = Object.keys(occ).sort((x, y) => occ[y] - occ[x])[0]; _cap(tag); if (top) legacyAdd(C(top), 'conq', maj ? 15 : 5, `${c.name} capitulates.`); if (maj) worldNews(`${c.name} Capitulates`, `The armies of ${c.name} have laid down their arms${top ? ` before ${cname(top)}` : ''}. The map of the world is being redrawn.`, '🏳️', [tag]); };
  const _cw = startCivilWar; startCivilWar = function (tag, ideo, frac, name, opt) { const r = _cw(tag, ideo, frac, name, opt); if (r) worldNews(`Civil War in ${cname(tag)}`, `${r.name} has taken up arms against the government of ${cname(tag)}. Foreign powers are already choosing sides.`, '🔥', [tag]); return r; };
  const _sp = startPlay; startPlay = function (a, b, goal, opt) { const pl = _sp(a, b, goal, opt); if (pl) crisisPrompt(pl); return pl; };
  const _fd = focusDaily; focusDaily = function (c) { const cur = c.focus.cur; _fd(c); if (cur && c.focus.done[cur] === G.day && FOCUS_REACT[cur]) FOCUS_REACT[cur](c); };
  SUBJ.release.do = (o, s) => { s.overlord = null; addRel(o.tag, s.tag, 40); logMsg(`${o.name} grants independence to ${s.name}.`, 'world'); legacyAdd(o, 'liber', 8, `${s.name} is granted independence.`); };
}
// ---------- world news and reaction events ----------
function worldNews(title, text, icon, skip = []) {
  if (!G || G.day < 1 || G.news === false) return; const pl = C(G.player); if (!pl || pl.ai || !pl.exists || skip.includes(G.player)) return;
  UIH.popup({ title, icon: icon || '📰', news: true, desc: `<div class="newsline">World News · ${dateStr()}</div>${text}`, options: [{ name: 'Noted.' }] });
}
// a major power presses a demand: other great powers (the player) may step in even without a treaty
function crisisPrompt(pl) {
  const k = C(G.player); if (!k || k.ai || !k.exists || !k.major || k.overlord || pl.a === k.tag || pl.b === k.tag || !C(pl.a).major) return; if (friendly(k.tag, pl.a) || friendly(k.tag, pl.b) || hasPact('guar', k.tag, pl.b) || hasPact('ally', k.tag, pl.b) || hasPact('ally', k.tag, pl.a) || atWar(k.tag, pl.a)) return;
  UIH.popup({ title: `Crisis: ${cname(pl.a)} and ${cname(pl.b)}`, icon: '⚖️', desc: `<div class="newsline">World News · ${dateStr()}</div>${cname(pl.a)} demands that ${cname(pl.b)} ${GOAL_TXT(pl.goal)}. We have no treaty with ${cname(pl.b)}, but our word would carry weight. In ${pl.dur} days they must yield or fight.`, options: [
    { name: 'This is not our quarrel.', tip: 'Stability +1' , fn: () => { k.stab = Math.min(100, k.stab + 1); } },
    { name: `Stand behind ${cname(pl.b)}.`, tip: `We join their side of the crisis. If ${cname(pl.a)} does not back down, we are at war. Relations with ${cname(pl.b)} +30.`, fn: () => { if (G.plays.includes(pl) && !pl.B.includes(k.tag)) { pl.B.push(k.tag); addRel(k.tag, pl.b, 30); addRel(k.tag, pl.a, -30); removeSpirit(k, 'appeasement'); logMsg(`${k.name} backs ${cname(pl.b)} in the crisis.`, 'world'); } } }] });
}
const FOCUS_REACT = {
  g_rhine: () => { queueEvent('rhineland_react', 'FRA', 1); queueEvent('rhineland_react', 'ENG', 2); worldNews('The Rhineland Remilitarised', 'German battalions have crossed the Rhine bridges into the demilitarised zone, in open breach of the Versailles and Locarno treaties. Paris and London must decide how to answer.', '🪖', ['FRA', 'ENG', 'GER']); },
  g_anschluss: () => { ['ENG', 'FRA', 'ITA'].forEach((t, i) => queueEvent('anschluss_react', t, 2 + i)); },
  g_pact: () => worldNews('Berlin and Moscow Sign a Pact', 'The two sworn enemies of European politics have signed a treaty of non-aggression. Chancelleries everywhere are asking what its secret clauses contain.', '🤝', ['GER', 'SOV']),
  s_pact: () => worldNews('Berlin and Moscow Sign a Pact', 'The two sworn enemies of European politics have signed a treaty of non-aggression. Chancelleries everywhere are asking what its secret clauses contain.', '🤝', ['GER', 'SOV']),
  g_czech: () => worldNews('The End of Czechoslovakia', 'The crisis over Bohemia and Moravia has reached its conclusion. The guarantees given at Munich are being read again, carefully.', '🏰', ['GER', 'CZE']),
  j_china: () => worldNews('War in China', 'Fighting near the old capital has become a full-scale Japanese invasion. The Chinese government vows to resist to the end.', '🌏', ['JAP', 'CHI']),
  u_lend: () => worldNews('The Arsenal of Democracy', 'The United States Congress has voted to lend or lease arms to any nation whose defence the President deems vital. American neutrality is now a matter of form.', '🏭', ['USA']),
  j_pearl: () => worldNews('War in the Pacific', 'Japanese forces have struck without warning across the Pacific. The war is now truly a world war.', '🌊', ['JAP', 'USA'])
};
Object.assign(EVENTS, {
  rhineland_react: { title: 'German Troops Enter the Rhineland', icon: '🪖', desc: c => `A few battalions have marched into the demilitarised zone. Our generals say Germany would withdraw at the first sign of resistance — and also that they cannot act without general mobilisation.${c.tag === 'ENG' ? ' Paris is looking to London.' : ''}`, trigger: c => ok('GER') && !atWar(c.tag, 'GER'), options: [
    { name: 'Lodge a formal protest.', eff: { stab: 1, rel: { GER: -10 } }, ai: 20 },
    { name: 'Mobilise, but do not cross the frontier.', eff: { ws: 6, rel: { GER: -20 }, tension: 2, money: -2 }, ai: 2 },
    { name: 'March! Throw them back across the Rhine.', eff: c => ({ rmspirit: ['appeasement'], ws: 10, fn: k => { if (k.tag === 'FRA') removeSpirit(k, 'political_paralysis'); declareWar(k.tag, 'GER', [{ by: k.tag, vs: 'GER', type: 'regime' }], 'Rhineland War'); }, tip: 'War with Germany, with regime change as our aim' }), ai: 0 }] },
  anschluss_react: { title: 'Austria Is No More', icon: '🦅', desc: 'German troops have crossed into Austria to cheering crowds. The treaties forbade this union; the question is whether anyone will say so.', trigger: c => !ok('AUT') && ok('GER') && !friendly(c.tag, 'GER') && !atWar(c.tag, 'GER'), options: [
    { name: 'Recognise the accomplished fact.', eff: { stab: 1 }, ai: 10 },
    { name: 'Condemn it and quicken rearmament.', eff: { ws: 6, rel: { GER: -20 }, tension: 2, build: { arms: 1 } }, ai: 3 },
    { name: 'Guarantee Czechoslovakia, the next on the list.', eff: { guarantee: ['CZE'], rel: { GER: -25 }, ws: 5 }, ai: 0 }] },
  spain_react: { title: 'Spain in Flames', icon: '🔥', desc: 'The Spanish generals have risen. Both sides are begging for arms, and both dictatorships are already sending them.', trigger: c => c.ideology === 'dem' && alive().some(k => k.civilOf === 'SPA'), options: [
    { name: 'Propose a Non-Intervention Agreement.', eff: { stab: 2, infl: 20 }, ai: 10 },
    { name: 'Arm the Republic.', eff: { fn: c => FNS.aidSpainRep[0](c), tip: 'Arms and aircraft for the Spanish Republic', tension: 1, ig: { union: { appr: 4 }, ind: { appr: -3 } } }, ai: 1 }] }
});
TIMELINE.push([[1936, 8, 2], 'spain_react', 'FRA'], [[1936, 8, 4], 'spain_react', 'ENG'], [[1936, 8, 6], 'spain_react', 'USA']);

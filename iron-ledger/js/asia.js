// Rising Sun update (1.4): Balance of Power, warlord unification, naval invasions, collaboration governments,
// seasons and weather, and focus trees for Japan, China, Communist China, the Philippines and Mongolia.
'use strict';
const PLAT = PROV_RAW.trim().split('\n').map(l => +l.split('|')[2]), PLON = PROV_RAW.trim().split('\n').map(l => +l.split('|')[3]);
const kmBetween = (a, b) => { const r = Math.PI / 180, dl = (PLAT[b] - PLAT[a]) * r, dn = (PLON[b] - PLON[a]) * r, h = Math.sin(dl / 2) ** 2 + Math.cos(PLAT[a] * r) * Math.cos(PLAT[b] * r) * Math.sin(dn / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
const CLIQUES = ['GXC', 'YUN', 'SHX', 'XSM', 'SIC'];
const chineseSoil = p => PROV_ISO[p.id] === 'China' || PROV_ISO[p.id] === 'Taiwan';

// ---------- seasons and weather ----------
const WEATHER = { clear: ['Clear', '☀️', 1, 1], winter: ['Deep Winter', '❄️', 0.8, 1.5], mud: ['Mud Season', '🟤', 0.9, 1.6], monsoon: ['Monsoon', '🌧️', 0.85, 1.5] };
function weatherKey(pid) {
  const m = dateObj(G.day).getUTCMonth(), lat = PLAT[pid], lon = PLON[pid], ter = P(pid).ter;
  if ((lat > 46 || (lat > 38 && ter === 'm')) && (m === 11 || m <= 1)) return 'winter'; if (lat < -42 && m >= 5 && m <= 7) return 'winter';
  if (lat > 46 && lon > 20 && lon < 140 && (m === 2 || m === 3 || m === 9 || m === 10)) return 'mud';
  if (lat > -12 && lat < 28 && lon > 68 && lon < 128 && m >= 5 && m <= 8 && 'jsfhp'.includes(ter)) return 'monsoon';
  return 'clear';
}
const winterReady = c => c.spirits.some(s => /winter|ski|white_camouflage|siberian/.test(s.id)) || ['FIN', 'SOV', 'MON', 'NOR', 'SWE', 'CAN'].includes(c.tag.slice(0, 3));
{ const _md = moveDays; moveDays = function (a, from, to, sea) { const d = _md(a, from, to, sea); if (sea) return d; const k = weatherKey(to); return k === 'clear' ? d : d * (k === 'winter' && winterReady(C(a.owner)) ? 1.15 : WEATHER[k][3]); };
  const _spw = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _spw(armies, attacking, p, eo); if (attacking && armies.length) { const k = weatherKey(p.id); if (k !== 'clear') { let f = WEATHER[k][2]; if (k === 'winter' && winterReady(C(armies[0].owner))) f = 0.95; r.atk *= f; } } return r; }; }

// ---------- balance of power ----------
// value runs from -100 (left side) to +100 (right side); each band applies a standing modifier
const BOP = {
  JAP: ['Army and Navy', 'Imperial Army', 'Imperial Navy', [['Army Dominant', { atk: 0.08, mil_out: 0.05, navy: -0.12, upkeep: 0.05 }], ['Army Ascendant', { atk: 0.04, navy: -0.04 }], ['Uneasy Balance', { upkeep: 0.06, research: -0.03 }], ['Navy Ascendant', { navy: 0.08, atk: -0.03 }], ['Navy Dominant', { navy: 0.16, air: 0.06, atk: -0.08 }]]],
  CHI: ['Centre and Provinces', 'Central Government', 'Regional Cliques', [['Iron Centralism', { tax: 0.15, pp: 0.15, stab: -5 }], ['Strong Centre', { tax: 0.08, pp: 0.08 }], ['Uneasy Truce', { tax: -0.05 }], ['Regional Power', { manpower: 0.06, tax: -0.1 }], ['Federation of Generals', { manpower: 0.12, def: 0.05, tax: -0.2, pp: -0.1 }]]],
  PRC: ['The Party Line', 'Yan\'an Faction', 'Moscow Faction', [['Mao Supreme', { def: 0.08, supply: 0.15, research: -0.05 }], ['Sinified Marxism', { def: 0.04, supply: 0.08 }], ['Collective Debate', { pp: -0.05 }], ['Orthodox Line', { mil_out: 0.08, research: 0.04 }], ['Moscow\'s Men', { mil_out: 0.15, research: 0.08, legit: -8 }]]],
  PHI: ['The Road to Independence', 'American Tutelage', 'Independence Now', [['Loyal Commonwealth', { invest: 0.3, build: 0.08, ws: -8 }], ['Gradualism', { invest: 0.15 }], ['Divided Opinion', { stab: -3 }], ['Impatient Nation', { ws: 6, manpower: 0.05 }], ['Independence Fever', { ws: 12, manpower: 0.1, invest: -0.2 }]]],
  MON: ['Party and Tradition', 'Revolutionary Party', 'Lamas and Princes', [['Party Supreme', { build: 0.12, research: 0.06, stab: -6, rad: 0.08 }], ['Party Ascendant', { build: 0.06, research: 0.03 }], ['Wary Coexistence', { pp: -0.05 }], ['Tradition Ascendant', { stab: 5, manpower: 0.05 }], ['The Old Ways', { stab: 10, manpower: 0.1, research: -0.08, build: -0.08 }]]]
};
for (const t in BOP) BOP[t][3].forEach((b, i) => SPIRITS[`bop_${t}_${i}`] = [`${BOP[t][0]}: ${b[0]}`, `The balance between the ${BOP[t][1]} and the ${BOP[t][2]}.`, b[1]]);
const bopDef = c => BOP[c.tag.slice(0, 3)];
const bopBand = v => v <= -60 ? 0 : v <= -20 ? 1 : v < 20 ? 2 : v < 60 ? 3 : 4;
function bopApply(c) { const d = bopDef(c); if (!d) return; if (c.bop === undefined) c.bop = { JAP: -15, CHI: 25, PRC: 5, PHI: -20, MON: -25 }[c.tag.slice(0, 3)] || 0; const t = c.tag.slice(0, 3), b = bopBand(c.bop); if (c.bopBand === b && hasSpirit(c, `bop_${t}_${b}`)) return; for (let i = 0; i < 5; i++) removeSpirit(c, `bop_${t}_${i}`); addSpirit(c, `bop_${t}_${b}`); if (c.bopBand !== undefined && c.bopBand !== b && c.tag === G.player) UIH.notify(`${d[0]}: ${d[3][b][0]}.`, 'info'); c.bopBand = b; }
function bopShift(c, n) { if (!bopDef(c)) return; bopApply(c); c.bop = clamp(c.bop + n, -100, 100); bopApply(c); }
function bopFavour(c, dir) { if (!bopDef(c) || c.pp < 30) return false; c.pp -= 30; bopShift(c, dir * 12); return true; }
function bopMonthly(c) { if (!bopDef(c)) return; bopApply(c); if (c.bop) c.bop -= Math.sign(c.bop) * Math.min(Math.abs(c.bop), 0.4); if (c.ai && Math.random() < 0.1) bopShift(c, rint(-4, 4)); bopApply(c); }

// ---------- warlords and unification ----------
function cliquePressure(c, tag, force) {
  const k = C(tag); if (!k || !k.exists) { c.pp += 30; return; }
  if (k.overlord !== c.tag) { if (!atWar(c.tag, tag) && !friendly(c.tag, tag)) startPlay(c.tag, tag, { type: 'puppet' }, { days: 20 }); return; }
  k.autonomy = Math.max(0, autonomyOf(k) - (force ? 35 : 25)); addRel(c.tag, tag, force ? -15 : 5); bopShift(c, -6);
  if (k.ai && (k.autonomy < 25 || (force && countryStr(c.tag) > countryStr(tag) * 3))) { annex(c.tag, tag, true); logMsg(`${k.name} is absorbed into ${c.name}.`, 'world'); }
}
function integrateCliques(c) { for (const t of CLIQUES) { const k = C(t); if (k.exists && k.overlord === c.tag && k.ai && autonomyOf(k) < 50) annex(c.tag, t, true); } }
function bribeWarlord(c) {
  const cand = CLIQUES.map(C).filter(k => k.exists && k.ai && k.overlord && !friendly(c.tag, k.tag)).sort((a, b) => autonomyOf(b) - autonomyOf(a))[0]; if (!cand || c.money < 0) { c.infl += 20; return; }
  c.money -= Math.max(2000, c.budget.income * 3); const o = cand.overlord; cand.overlord = null; for (const w of G.wars) { w.att = w.att.filter(t => t !== cand.tag); w.def = w.def.filter(t => t !== cand.tag); } G._wc = null; cand.capitulated = false; restoreControl(); addPact('nap', c.tag, cand.tag, 365 * 5); addRel(c.tag, cand.tag, 40);
  logMsg(`${cand.name} breaks with ${cname(o)} and comes to terms with ${c.name}.`, 'world');
}
// ---------- collaboration governments ----------
const COLLAB_NAME = { CHI: 'Reorganised China', PHI: 'Second Philippine Republic', HOL: 'Indonesia', ENG: 'State of Burma', RAJ: 'Free India', SOV: 'Russian Liberation Committee', FRA: 'French State', POL: 'Polish Regency', USA: 'American Provisional Authority' };
const collabProvs = (c, e, iso) => G.P.filter(p => p.owner === e && p.ctrl === c.tag && (!iso || iso.includes(PROV_ISO[p.id])));
const collabTargets = c => enemiesOf(c.tag).filter(e => { const ps = collabProvs(c, e); return ps.length >= 2 || (ps.length === 1 && ps[0].vp >= 10); });
function createCollab(c, e, name, iso) {
  const E = C(e), ps = collabProvs(c, e, iso); if (!E || !ps.length || !atWar(c.tag, e)) return null; let n = 0, tag; do { tag = e.slice(0, 3) + 'C' + (n || ''); n++; } while (G.C[tag] && G.C[tag].exists);
  const r = G.C[tag] = JSON.parse(JSON.stringify(E, (k, v) => k[0] === '_' ? undefined : v));
  Object.assign(r, { tag, name: name || COLLAB_NAME[e.slice(0, 3)] || `${E.adj} National Government`, color: shade(E.color, C(c.tag).color), ai: true, exists: true, capitulated: false, focus: { cur: null, prog: 0, done: {} }, gens: [], queue: [], pq: [], enact: null, overlord: null, rel: {}, money: 0, invPool: 0, training: [], flags: {}, spirits: [], cabinet: [], lend: {}, legacy: undefined, intel: undefined, proj: undefined, collabOf: e, autonomy: 20, warExh: 0, casualties: 0, infamy: 0, manpower: 50 });
  for (const k in r.stock) r.stock[k] = 0; ps.sort((a, b) => b.vp - a.vp); r.capital = ps[0].id; for (const o of alive()) if (o.tag !== tag) { r.rel[o.tag] = 0; o.rel[tag] = 0; }
  for (const p of ps) { p.owner = tag; p.ctrl = tag; if (!p.cores.includes(tag)) p.cores.push(tag); delete p.unrest; }
  setIdeology(r, c.ideology, true); r.stab = 45; r.ws = 50; makeSubject(c.tag, tag); r.autonomy = 20; spawnDivisions(r, 'mil', Math.max(2, ps.length), r.capital); r.stock.arms = 200;
  logMsg(`${c.name} installs a collaboration government: ${r.name}.`, 'world'); worldNews(`${r.name} Proclaimed`, `In territory occupied by ${c.name}, a new government claims to speak for ${E.name}. ${E.name} calls it a puppet show.`, '🎭', [c.tag]); legacyAdd(c, 'conq', 5, `${r.name} is set up.`); UIH.mapDirty(); return r;
}
// ---------- naval invasions ----------
// distance by sea, following the sea lanes between ports (not a straight line over land)
const _seaD = {};
function seaDist(from, to) {
  let d = _seaD[from]; if (!d) { d = _seaD[from] = {}; d[from] = 0; const open = [from]; while (open.length) { let bi = 0; for (let i = 1; i < open.length; i++) if (d[open[i]] < d[open[bi]]) bi = i; const u = open.splice(bi, 1)[0]; if (d[u] > 6000) continue; for (const e of NB[u]) { if (!e.sea) continue; const nd = d[u] + Math.max(e.sea, 150); if (d[e.to] === undefined || nd < d[e.to]) { if (d[e.to] === undefined) open.push(e.to); d[e.to] = nd; } } } }
  if (d[to] !== undefined) return d[to]; let best = Infinity; for (const e of NB[to]) if (!e.sea && P(e.to).coastal && d[e.to] !== undefined) best = Math.min(best, d[e.to] + 250); return best;
}
function invasionBlock(c, a, to) {
  const p = P(to), f = P(a.loc); if (!atWar(c.tag, p.ctrl)) return 'Not enemy territory'; if (!p.coastal) return 'The target has no coast'; if (!f.coastal) return 'The army must start in a coastal province'; if (a.battle) return 'The army is in battle';
  const km = seaDist(a.loc, to); if (km > 3800) return km === Infinity ? 'No sea route' : 'Out of range (3,800 km by sea)'; if (!seaOK(c.tag, p)) return 'Requires naval superiority over the defender'; return '';
}
const invasionDays = (from, to) => Math.ceil(6 + Math.min(4000, seaDist(from, to)) / 320);
function launchInvasion(a, to) { const c = C(a.owner); if (invasionBlock(c, a, to)) return false; a.inv = { to, eta: G.day + invasionDays(a.loc, to) }; a.path = []; a.auto = false; delete a.order; return true; }
{ const _om = orderMove; orderMove = function (a, to) { if (a.inv) { if (C(a.owner).ai) return false; delete a.inv; } return _om(a, to); }; }
function invasionsTick() {
  const due = {}; for (const id in G.armies) { const a = G.armies[id]; if (a.inv && a.inv.eta <= G.day) (due[a.owner + '|' + a.inv.to] = due[a.owner + '|' + a.inv.to] || []).push(a); }
  for (const k in due) { const list = due[k], tag = list[0].owner, to = list[0].inv.to, p = P(to), c = C(tag); list.forEach(a => { delete a.inv; if (c.ai) a.auto = true; });
    if (!atWar(tag, p.ctrl)) { if (friendly(tag, p.ctrl) || p.ctrl === tag) list.forEach(a => { a.loc = to; }); continue; }
    if (!seaOK(tag, p)) { if (tag === G.player) UIH.notify(`The invasion of ${p.name} is called off: the enemy fleet commands the sea.`, 'bad'); continue; }
    const defs = armiesAt(to).filter(x => atWar(tag, x.owner)), att = sum(list, armyStr) * 0.55, def = sum(defs, armyStr) * (1 + TERRAIN[p.ter][1] + p.fort * 0.12);
    if (!defs.length || att > def) { for (const d of defs) retreat(d, tag); for (const a of list) { a.loc = to; a.dug = 0; for (const dv of a.divs) { dv.org *= 0.5; dv.str *= defs.length ? 0.85 : 0.97; } } occupy(p, tag); logMsg(`${c.adj} troops land at ${p.name}.`, p.vp >= 5 ? 'world' : 'info', [tag, p.owner]); if (tag === G.player) UIH.notify(`The landing at ${p.name} succeeds.`, 'good'); }
    else { for (const a of list) for (const dv of a.divs) { dv.str *= 0.72; dv.org = 0.15; } c.warExh = Math.min(100, c.warExh + 2); if (tag === G.player || p.ctrl === G.player) UIH.notify(`The ${c.adj} landing at ${p.name} is thrown back into the sea.`, tag === G.player ? 'bad' : 'good'); } }
}
function aiInvasions(c) {
  if (!c.major && navalPower(c) < 40) return; const foes = enemiesOf(c.tag); if (!foes.length || Math.random() > 0.45) return;
  const idle = armiesOf(c.tag).filter(a => a.auto && !a.home && !a.garrison && !a.battle && !a.path.length && !a.inv && a.divs.length >= 3 && P(a.loc).coastal && !NB[a.loc].some(e => !e.sea && atWar(c.tag, P(e.to).ctrl)) && sum(a.divs, d => d.org) / a.divs.length > 0.6); if (!idle.length) return;
  let best = null, bs = 0; const a = pick(idle);
  for (const p of G.P) { if (!p.coastal || !foes.includes(p.ctrl) || NB[p.id].some(e => !e.sea && (P(e.to).ctrl === c.tag))) continue; if (kmBetween(a.loc, p.id) > 2600 || seaDist(a.loc, p.id) > 2600 || invasionBlock(c, a, p.id)) continue;
    const def = sum(armiesAt(p.id).filter(x => atWar(c.tag, x.owner)), armyStr) * (1 + TERRAIN[p.ter][1] + p.fort * 0.12); if (armyStr(a) * 0.55 < def * 1.2) continue; const s = p.vp + (p.claims.includes(c.tag) ? 6 : 0) + (def === 0 ? 3 : 0) - seaDist(a.loc, p.id) / 700 + Math.random() * 2; if (s > bs) { bs = s; best = p; } }
  if (best) launchInvasion(a, best.id);
}

// ---------- focus functions ----------
const stirUnrest = (owners, n) => G.P.forEach(p => { if (p.ctrl !== p.owner && owners(p) && !friendly(p.ctrl, p.owner)) p.unrest = Math.min(100, (p.unrest || 0) + n); });
const holds = (c, n) => PN(n).ctrl === c.tag;
Object.assign(FNS, {
  leaderTojo: [setLeader('Hideki Tojo', 'Imperial Rule Assistance'), 'General Tojo forms a government'],
  dropClaimsChina: [c => { G.P.forEach(p => { if (chineseSoil(p)) p.claims = p.claims.filter(t => t !== c.tag); }); claimCache(); }, 'We renounce our claims in China'],
  manAutonomy: [() => { if (ok('MAN')) C('MAN').autonomy = Math.min(100, autonomyOf(C('MAN')) + 30); }, 'Manchukuo gains 30 autonomy'],
  joinAxisJ: [c => { if (factionOf('GER')) joinFaction(c.tag, 'GER'); else addRel(c.tag, 'GER', 40); }, 'Join the German faction if it exists'],
  chinaWar: [c => { if (ok('CHI') && !atWar(c.tag, 'CHI')) declareWar(c.tag, 'CHI', [{ by: c.tag, vs: 'CHI', type: 'take', provs: ['Peiping', 'Tianjin', 'Shanghai', 'Nanjing', 'Kalgan', 'Jinan', 'Qingdao'].map(n => PNAME[n]) }], 'Second Sino-Japanese War'); }, 'War with China'],
  collabCHI: [c => createCollab(c, 'CHI'), 'Occupied China becomes a collaboration government under our control'],
  collabSOV: [c => createCollab(c, 'SOV', 'Far Eastern Republic'), 'Occupied Soviet territory becomes a client republic'],
  collabPHI: [c => createCollab(c, 'PHI') || createCollab(c, 'USA', 'Second Philippine Republic', ['Philippines']), 'The occupied Philippines become a client republic'],
  collabHOL: [c => createCollab(c, 'HOL', 'Indonesia', ['Indonesia']), 'The occupied Indies become a client state'],
  collabBurma: [c => { createCollab(c, 'ENG', 'State of Burma', ['Myanmar']); createCollab(c, 'RAJ', 'Free India'); }, 'Occupied Burma and India become client states'],
  calmUnrest: [c => G.P.forEach(p => { if (p.ctrl === c.tag && p.unrest) p.unrest = Math.max(0, p.unrest - 25); }), 'Unrest falls by 25 in every province we occupy'],
  bribeWarlord: [c => bribeWarlord(c), 'Pay the most independent Chinese warlord to abandon his overlord and sign a truce with us'],
  chinaPeace: [c => { const w = G.wars.find(x => (x.att[0] === c.tag && x.def.includes('CHI')) || (x.def[0] === c.tag && x.att.includes('CHI'))); if (!w || !ok('CHI') || !C('CHI').ai || !holds(c, 'Nanjing') || !holds(c, 'Peiping')) { c.infl += 20; return; } G.P.forEach(p => { if (p.owner === 'CHI' && p.ctrl === c.tag && p.claims.includes(c.tag)) transferProv(p, c.tag); }); whitePeace(w); }, 'If we hold Nanjing and Peiping, China accepts peace and cedes the provinces we claim and occupy'],
  indochina: [c => { if (!ok('FRA')) return; startPlay(c.tag, 'FRA', { type: 'take', provs: ['Hanoi', 'Hue', 'Saigon', 'Phnom Penh', 'Vientiane'].map(n => PNAME[n]).filter(i => P(i).owner === 'FRA') }, { force: C('FRA').capitulated || isAtWar('FRA') ? 'concede' : null, days: 15 }); }, 'Demand French Indochina; France yields if it is already at war'],
  inviteSIA: [c => { if (!factionOf(c.tag)) createFaction(c.tag, 'Greater East Asia Co-Prosperity Sphere'); inviteAll(c, ['SIA'], () => true); }, 'Siam joins our sphere'],
  sphere: [c => { if (!factionOf(c.tag)) createFaction(c.tag, 'Greater East Asia Co-Prosperity Sphere'); inviteAll(c, alive().filter(k => k.overlord === c.tag).map(k => k.tag), () => true); }, 'Found the Co-Prosperity Sphere if we lead no faction'],
  pearl: [c => pearl(c), 'War with the United States, the United Kingdom and the Netherlands. The American Pacific Fleet is crippled.'],
  manBuild: [() => giveBuild('MAN', { steel: 2, coalm: 2, arms: 1, railway: 2 }), 'Manchukuo gains steel mills, coal mines, an arms factory and railways'],
  southRes: [c => { let n = 0; ['Palembang', 'Balikpapan', 'Medan', 'Brunei'].forEach(x => { const p = PN(x); if (p.ctrl === c.tag) { n++; if (p.owner === c.tag) p.b.oilr = (p.b.oilr || 0) + 2; } }); if (n) { removeSpirit(c, 'oil_embargo'); c.stock.ships += 5; } }, 'With the southern oilfields in our hands, the Oil Embargo no longer bites'],
  unitedFront: [c => { if (ok('PRC')) { addRel('CHI', 'PRC', 40); const w = G.wars.find(x => x.def.includes(c.tag) || x.att.includes(c.tag)); if (w && !atWar(c.tag, 'PRC')) joinWar(w, 'PRC', w.def.includes(c.tag) ? 'def' : 'att'); } }, 'Truce with the Communists; they join our war against the invader'],
  cliqueGXC: [c => cliquePressure(c, 'GXC'), 'Guangxi loses 25 autonomy; below 25 it is absorbed'], cliqueYUN: [c => cliquePressure(c, 'YUN'), 'Yunnan loses 25 autonomy; below 25 it is absorbed'],
  cliqueSHX: [c => cliquePressure(c, 'SHX'), 'Shanxi loses 25 autonomy; below 25 it is absorbed'], cliqueXSM: [c => cliquePressure(c, 'XSM'), 'The Ma lands lose 25 autonomy; below 25 they are absorbed'],
  cliqueSIC: [c => cliquePressure(c, 'SIC'), 'Sichuan loses 25 autonomy; below 25 it is absorbed'], forceGXC: [c => cliquePressure(c, 'GXC', true), 'Guangxi loses 35 autonomy, and is absorbed outright if we are three times its strength'],
  integrateAll: [c => integrateCliques(c), 'Every clique with autonomy below 50 is absorbed into the national government'],
  playSIKTIB: [c => ['SIK', 'TIB'].forEach(t => ok(t) && !friendly(c.tag, t) && startPlay(c.tag, t, { type: 'puppet' }, { days: 25 })), 'Demand the submission of Sinkiang and Tibet'],
  moveCapital: [c => { const p = PN('Chongqing'); if (p.owner !== c.tag && ok('SIC') && C('SIC').overlord === c.tag && C('SIC').ai) annex(c.tag, 'SIC', true); if (p.owner === c.tag) { c.capital = p.id; p.vp = 25; p.b.arms = (p.b.arms || 0) + 2; p.b.steel = (p.b.steel || 0) + 1; p.fort = 3; } }, 'Sichuan is brought under the centre; the capital moves to Chongqing with its arsenals'],
  stirJapan: [() => stirUnrest(p => chineseSoil(p), 20), 'Unrest +20 in every occupied Chinese province'],
  inlandBuild: [c => ['Chongqing', 'Chengdu', 'Kunming', "Xi'an", 'Changsha'].forEach(n => { const p = PN(n); if (p.owner === c.tag) { p.b.arms = (p.b.arms || 0) + 1; p.b.tools = (p.b.tools || 0) + 1; } }), 'Arsenals and workshops in every inland city we hold'],
  federalChina: [c => CLIQUES.forEach(t => { if (ok(t) && C(t).overlord === c.tag) { C(t).autonomy = Math.min(84, autonomyOf(C(t)) + 5); addRel(c.tag, t, 40); C(t).stab = Math.min(100, C(t).stab + 10); } }), 'The cliques are reconciled to a federal China'],
  peaceWithJapan: [c => { const w = G.wars.find(x => (x.att.includes('JAP') && x.def[0] === c.tag) || (x.def.includes('JAP') && x.att[0] === c.tag)); if (w && C('JAP').ai) whitePeace(w); if (ok('JAP')) addPact('nap', c.tag, 'JAP', 365 * 5); }, 'Peace and a non-aggression pact with Japan'],
  joinSphere: [c => { if (ok('JAP') && factionOf('JAP')) joinFaction(c.tag, 'JAP'); else if (ok('JAP')) addPact('ally', c.tag, 'JAP'); }, 'Join Japan\'s faction'],
  mergePRC: [c => { if (ok('PRC') && C('PRC').ai && !atWar(c.tag, 'PRC')) annex(c.tag, 'PRC', true); }, 'The Communists merge into our government'],
  leaderZhang: [setLeader('Zhang Guotao', 'CCP'), 'Zhang Guotao takes the Party'],
  stirCHI: [() => { if (ok('CHI')) { C('CHI').stab = Math.max(0, C('CHI').stab - 5); shiftSupport(C('CHI'), { com: 5 }); } }, 'Nationalist stability -5, communist support there +5%'],
  joinChinaWar: [c => { if (!ok('CHI')) return; const w = G.wars.find(x => x.def.includes('CHI') || x.att.includes('CHI')); if (w && !atWar(c.tag, 'CHI')) joinWar(w, c.tag, w.def.includes('CHI') ? 'def' : 'att'); }, 'Join China\'s war against the invader'],
  baseAreas: [() => { G.flags.prc_bases = G.day; }, 'From now on, uprisings in occupied China raise our flag, not Chongqing\'s'],
  growBases: [c => { let n = 0; G.P.forEach(p => { if (n < 3 && chineseSoil(p) && p.ctrl !== p.owner && atWar(c.tag, p.ctrl) && (p.unrest || 0) > 50 && !armiesAt(p.id).some(a => a.owner === p.ctrl) && NB[p.id].some(e => !e.sea && P(e.to).ctrl === c.tag)) { p.owner = c.tag; p.ctrl = c.tag; delete p.unrest; n++; } }); c.manpower += 200; UIH.mapDirty(); }, 'Up to three ungarrisoned, restless occupied provinces next to our territory come over to us; manpower +200K'],
  proclaimPRC: [c => { c.name = 'People\'s Republic of China'; c.adj = 'Chinese'; provsOf(c.tag).forEach(p => { if (!p.cores.includes(c.tag)) p.cores.push(c.tag); }); UIH.mapDirty(); }, 'We become the People\'s Republic of China'],
  phIndep: [c => { if (!c.overlord) { c.pp += 40; return; } if (autonomyOf(c) >= 60) { const o = c.overlord; c.overlord = null; addRel(c.tag, o, 10); logMsg(`${c.name} takes its independence ahead of schedule.`, 'world'); } else c.autonomy = Math.min(100, autonomyOf(c) + 25); }, 'Independence at once if our autonomy is 60 or more; otherwise autonomy +25'],
  phJapan: [c => { if (c.overlord) { c.autonomy = Math.min(100, autonomyOf(c) + 20); return; } if (ok('JAP')) { addPact('nap', c.tag, 'JAP', 3650); if (factionOf('JAP') && C('JAP').ai) joinFaction(c.tag, 'JAP'); } }, 'If independent: a pact with Japan and a seat in its sphere. If still a subject: autonomy +20'],
  usGarrison: [c => { if (ok('USA') && c.overlord === 'USA') { const a = newArmy(C('USA'), c.capital); a.garrison = true; for (let i = 0; i < 2; i++) a.divs.push({ t: 'inf', str: 1, org: 1, xp: 0 }); } }, 'Two American divisions garrison Manila'],
  joinUSA: [c => joinTo(c, 'USA'), 'Join the American faction, or ally with the United States'],
  phFree: [c => { if (c.overlord) { const o = c.overlord; c.overlord = null; addRel(c.tag, o, 40); logMsg(`${c.name} becomes a fully independent republic.`, 'world'); } }, 'Full independence, with our former overlord\'s blessing'],
  phIron: [addRes('Manila', 'iron', 2), 'Iron and chromite are found in Luzon'],
  selfUnrest: [c => stirUnrest(p => p.owner === c.tag, 25), 'Unrest +25 in every one of our provinces under enemy occupation'],
  leaderChoi: [setLeader('Khorloogiin Choibalsan', 'MPRP'), 'Choibalsan is Marshal and Premier'],
  leaderBogd: [setLeader('The Ninth Bogd', 'Council of Lamas'), 'A new Bogd Khan is enthroned'],
  monIndep: [c => { if (!c.overlord) { c.pp += 40; return; } if (autonomyOf(c) >= 50) { const o = c.overlord; c.overlord = null; addPact('nap', c.tag, o, 3650); logMsg(`${c.name} asserts its full independence from ${cname(o)}.`, 'world'); } else c.autonomy = Math.min(100, autonomyOf(c) + 25); }, 'Independence if our autonomy is 50 or more; otherwise autonomy +25'],
  monAutonomy: [c => { if (c.overlord) c.autonomy = Math.min(100, autonomyOf(c) + 20); }, 'Autonomy +20'],
  monJoinSovWar: [c => { const w = G.wars.find(x => (x.att.includes('SOV') && x.def.includes('JAP')) || (x.def.includes('SOV') && x.att.includes('JAP'))); if (w) joinWar(w, c.tag, w.att.includes('SOV') ? 'att' : 'def'); }, 'Join the Soviet war against Japan'],
  monCoal: [addRes('Ulan Bator', 'coal', 2), 'Coal seams are opened near the capital']
});
Object.assign(REQF, {
  gerFasWar: [() => ok('GER') && C('GER').ideology === 'fas' && isAtWar('GER'), 'Fascist Germany is at war'],
  holdNanjing: [c => holds(c, 'Nanjing'), 'We control Nanjing'], holdVlad: [c => holds(c, 'Vladivostok'), 'We control Vladivostok'], holdManila: [c => holds(c, 'Manila'), 'We control Manila'], holdBatavia: [c => holds(c, 'Batavia'), 'We control Batavia'],
  holdRangoon: [c => holds(c, 'Rangoon'), 'We control Rangoon'], holdOil: [c => ['Palembang', 'Balikpapan', 'Medan', 'Brunei'].some(n => holds(c, n)), 'We control an oilfield in the Indies or Borneo'],
  prcPeace: [c => ok('PRC') && !isAtWar(c.tag), 'Communist China exists and we are at peace'], chiPeace: [c => ok('CHI') && !atWar(c.tag, 'JAP'), 'China exists and we are not fighting Japan'],
  peaceWithGER: [c => ok('GER') && !atWar(c.tag, 'GER'), 'At peace with Germany'], engJapWar: [() => ok('ENG') && atWar('ENG', 'JAP'), 'The United Kingdom is at war with Japan'],
  japDone: [c => !ok('JAP') || (!atWar(c.tag, 'JAP') && !atWar('CHI', 'JAP')), 'Neither we nor Nanjing are at war with Japan'], sovJapWar: [() => ok('SOV') && atWar('SOV', 'JAP'), 'The Soviet Union is at war with Japan'],
  pearlTime: [c => year() >= 1941 || (hasSpirit(c, 'oil_embargo') && year() >= 1940), 'Year 1941, or 1940 under the Oil Embargo'], chinaTime: [() => ok('CHI') && year() >= 1937, 'Year 1937 or later']
});
{ const _fx = fx; fx = function (str, desc) { const m = (str || '').match(/(?:^|;)\s*bop\s+(-?[\d.]+)\s*(?=;|$)/); if (!m) return _fx(str, desc); const e = _fx(str.replace(m[0], ''), desc), n = +m[1], old = e.fn; e.fn = c => { if (old) old(c); bopShift(c, n); }; e.tip = (e.tip ? e.tip + '<br>' : '') + `Balance of power shifts ${Math.abs(n)} towards the ${n < 0 ? 'left' : 'right'} side`; return e; }; }

// The Asian trees live in js/tree_*.js (1.5).

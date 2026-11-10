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

TREES.JAP = parseTree('j_', `
feb26|The February Incident|5|0||stab -3; pp 60|Fourteen hundred soldiers occupy central Tokyo in the snow, and are told by the Emperor to go home.|ai 6; sec Politics
kodo|The Imperial Way|2|1|feb26|spirit spiritual_mobilisation; ws 8; ig army 5 .2; bop -20|Spirit over steel; the Army leads the nation.|mx tosei,purge,front; ai 1
tosei|The Control Faction|5|1|feb26|spirit total_war_planning; build arms 2, steel 2; bop -10|A planned economy for total war.|mx kodo,purge,front; ai 6
purge|Purge the Militarists|8|1|feb26|setIdeo dem; rmspirit militarism; stab -12; rel USA 30, ENG 30, CHI 20|The Diet reasserts civilian rule.|mx kodo,tosei,front; ai 0
front|The People's Front|11|1|feb26|ideo com 12; stab -8|Tenant unions and factory cells come out of hiding.|mx kodo,tosei,purge; ai 0
sermon|Yamato Spirit|1|2|kodo|ws 5; spirit Yamato Spirit: org .06, def .03|An army that believes it cannot lose.|
northroad|Northern Road Doctrine|2|2|kodo|claim Vladivostok, Khabarovsk, Chita; bop -10|The real enemy is in Siberia.|
directrule|Direct Imperial Rule|3|2|kodo|law autocracy; legit 8; pp 60|No cabinet between the throne and the people.|
natdef|National Defence State|4|2|tosei|spirit Planned War Economy: mil_out .08, build .05|Every yen and every ton accounted for.|
planning|Cabinet Planning Board|5|2|tosei|build construction 1, tools 2; res 15|Bureaucrats in uniform draw up five-year plans.|
mobilise|National Mobilisation Law|6|2|tosei|law partial; spirit State Mobilisation: mil_out .1, needs -.05|The state may requisition anything and anyone.|req war
cabinet|A Party Cabinet|8|2|purge|law universal, protected; legit 8|Ministers answerable to the Diet again.|
peoples|People's Front Government|11|2|front|setIdeo com; stab -8|Red flags in the Ginza.|
polity|Clarify the National Polity|2|3|sermon|directrule|ideo fas 6; stab 5; rad -.05|Dangerous thoughts are a police matter.|
assist|Imperial Rule Assistance|5|3|natdef|planning|mobilise|law oneparty; pp 80; spirit One Party Under Heaven: pp .15, stab 4|All parties dissolve into one association.|
civilian|Civilian Control|7|3|cabinet|ig army -8 -.3; spirit Civil Supremacy: pp .1, upkeep -.1; bop 10|Service ministers need no longer be serving officers.|
shidehara|Conciliation Diplomacy|8|3|cabinet|nap CHI; rel CHI 40, USA 20; fn dropClaimsChina|Trade and treaties instead of garrisons.|
labour|Taisho Democracy Restored|9|3|cabinet|law regulated; ig union 6; rad -.08|Unions and tenant leagues are legal again.|
peerage|Abolish the Peerage|10|3|peoples|ig land -10 -.5; law council|Counts and barons become citizens.|
throne|The Question of the Throne|11|3|peoples|stab -6; legit 5; pp 60|A symbol, or nothing at all.|
neworder|New Order in East Asia|4|4|assist|infl 50; tension 3|Japan, Manchukuo and China under one roof.|
razor|The Razor's Cabinet|5|4|assist|fn leaderTojo; ws 10; spirit Soldier-Premier: atk .04, pp .1; bop -15|A general holds the premiership, the war ministry and the general staff at once.|
manchuria|Autonomy for Manchuria|7|4|shidehara|rel CHI 30; fn manAutonomy|A face-saving formula for a seized province.|
treaties|Return to the Treaties|8|4|shidehara|civilian|rel USA 40, ENG 40; trade USA, ENG; tension -4|Back to Washington and London.|
socialist|Socialist Asia|11|4|peerage|throne|fn joinComintern; rel PRC 40|Workers of the East, unite.|
pact|Pacific Pact|8|5|treaties|fn joinAllies|An ocean kept peaceful by its largest navies.|req tension 30
hakko|Eight Corners, One Roof|17|0||infl 30; ws 3|A slogan from the first emperor, repurposed.|ai 6; sec Asia Policy
china|The China Incident|15|1|hakko|claim Peiping, Tianjin, Shanghai, Nanjing, Kalgan, Jinan, Qingdao; fn chinaWar; units inf 8; spirit Continental Offensive [540]: atk .1, supply .1|Shots at the Marco Polo Bridge.|req chinaTime; ai 8; ideo fas
north|Strike North|18|1|hakko|claim Vladivostok, Khabarovsk, Chita, Okha, Ulan Bator; bop -25|The Army's war: Siberia and the Bolsheviks.|mx south; ai 0; ideo fas
south|Strike South|20|1|hakko|claim Saigon, Hanoi, Hue, Batavia, Surabaya, Palembang, Balikpapan, Medan, Singapore, Kuala Lumpur, Manila, Rangoon, Hong Kong, Kuching, Brunei; build shipyard 2; bop 25|The Navy's war: oil, rubber and the southern resource area.|mx north; ai 6; ideo fas; date 1939-9
axis|Join the Axis|22|1|hakko|fn joinAxisJ|Berlin, Rome, Tokyo.|req gerFasWar; ai 3; ideo fas; date 1940-9
mengjiang|The Mongol Borderlands|13|2|china|claim Kalgan, Hohhot; units cav 2|A prince, a flag and a Japanese adviser.|
wang|The Reorganised Government|14|2|china|fn collabCHI|A former premier agrees to head a rival China.|req holdNanjing
pacify|Pacification Campaigns|15|2|china|fn calmUnrest; spirit Garrison Armies: supply .05|Blockhouses and sweeps along the railways.|req atwar CHI
ichigo|Continental Corridor|16|2|china|spirit Operation Number One [540]: atk .08, supply .1|A land route from Korea to Indochina.|req atwar CHI
warlords|Buy the Warlords|14|3|wang|mengjiang|fn bribeWarlord|Silver bullets are cheaper than lead ones.|
chinapeace|Peace Through Nanjing|15|3|wang|fn chinaPeace|An end to a war nobody planned.|
kantoku|Kwantung Special Manoeuvres|18|2|north|units inf 6, arm 1; bop -8|Seven hundred thousand men for an exercise.|
nonagg|Neutrality Pact with Moscow|19|2|south|nap SOV|Secure the north before turning south.|req ex SOV; ai 4; date 1941-4
indo|Occupy Indochina|20|2|south|fn indochina|Close the roads into China; open the road south.|req ex FRA; ai 5; ideo fas; date 1940-7
thai|The Thai Alliance|21|2|south|rel SIA 30; fn inviteSIA|The only independent state in the region picks a side.|date 1941-6
panmongol|A Pan-Mongol State|17|3|kantoku|claim Ulan Bator, Chita|From Lake Baikal to the Great Wall.|
northwar|The Northern Expedition|18|3|kantoku|war SOV|Ripe persimmons fall by themselves; green ones must be shaken.|req ex SOV; ideo fas
pearl|The Decisive Strike|20|3|indo|fn pearl; spirit rising_sun [240]|Climb Mount Niitaka.|req pearlTime; ai 7; ideo fas
sphere|Co-Prosperity Sphere|21|3|thai|indo|fn sphere; spirit asia_for_asians|Asia for the Asians, under Tokyo.|
siberia|A Far Eastern Republic|18|4|northwar|fn collabSOV|A buffer state, as in 1920.|req holdVlad
manila|A Philippine Republic|19|4|pearl|fn collabPHI|Independence, granted by the occupier.|req holdManila
southern|The Southern Operation|20|4|pearl|units inf 6; spirit Centrifugal Offensive [365]: atk .1, navy .1|A hundred days to take an empire.|req war
indies|Liberate the Indies|21|4|pearl|fn collabHOL|Three centuries of Dutch rule end in a week.|req holdBatavia
burma|Burma and Free India|22|4|sphere|fn collabBurma|The road to Delhi.|req holdRangoon
perimeter|Absolute Defence Perimeter|20|5|southern|fort Tokyo, Fukuoka, Taihoku; spirit Island Fortresses: def .08, entrench .1|Every atoll a fortress.|
conference|Greater East Asia Conference|21|5|manila|indies|burma|infl 80; fn calmUnrest; spirit Asian Solidarity: manpower .06|Six heads of government in one photograph.|
homeland|Battle for the Homeland|20|6|perimeter|units mil 15; spirit The Hundred Million: caplimit .2, def .05|Bamboo spears on the beaches.|req majorwar
zaibatsu|Zaibatsu Partnership|26|0||build steel 2, engines 1, autos 1; ig ind 4|Four family combines own most of what matters.|ai 3; sec Economy
manind|Manchurian Industrial Plan|24|1|zaibatsu|fn manBuild; trade MAN|A planned economy on a blank slate.|
yawata|The Great Steelworks|25|1|zaibatsu|build steel 3|Half the nation's steel from one town.|
synfuel|Synthetic Fuel|26|1|zaibatsu|tech p_synthetic; build synth 2|A drop of oil is a drop of blood.|
merchant|Merchant Marine|27|1|zaibatsu|build shipyard 1, port 1; spirit Great Merchant Fleet: tradecap .1|Six million tons under the sun flag.|
silk|From Silk to Steel|28|1|zaibatsu|build textile 2, tools 2; money 6|The export that paid for the battleships.|
heavy|Manchurian Heavy Industries|24|2|manind|build engines 2, autos 1, tankp 1|A new combine moves to the mainland.|
metals|Light Metals|25|2|yawata|build aircraftp 2, power 1|Bauxite in, airframes out.|
reserve|Strategic Stockpiles|26|2|synfuel|spirit Oil Reserve: supply .1|Two years of fuel, if nothing goes wrong.|
tankers|Tanker Programme|27|2|merchant|spirit Tanker Fleet: tradecap .06, navy .03|Oil must cross three thousand miles of sea.|
yen|The Yen Bloc|28|2|silk|trade MAN, SIA; spirit Yen Bloc: tradecap .08, tax .04|One currency for the empire.|
power|Electric Power Control|26|3|metals|reserve|build power 3; tech p_hydro|Every generator under one state company.|
munitions|Munitions Ministry|26|4|power|heavy|tankers|spirit Munitions Ministry: mil_out .12|Aircraft above all.|req war
resources|Southern Resources|27|4|tankers|yen|fn southRes|What the embargo denied, the fleet has taken.|req holdOil
armylaw|Army Expansion Law|33|0||spirit army_reform; units inf 4|Seventeen divisions become fifty.|ai 2; sec Army
kwantung|The Kwantung Army|31|1|armylaw|units inf 4, cav 1; bop -8|An army that makes its own foreign policy.|
spirit|Infantry Spirit|33|1|armylaw|spirit Night Infantry: atk .05, org .04|The bayonet decides.|
tanks|Tank Regiments|35|1|armylaw|tech m_tank1; build tankp 1; units arm 1|Light tanks for an infantry army.|
jungle|Jungle Warfare School|32|2|spirit|kwantung|tech m_mtn; units mtn 2; spirit Jungle Training: supply .1|Read this alone, and the war can be won.|
infiltrate|Bold Infiltration|33|2|spirit|spirit Infiltration Tactics: atk .04|Around the flank, through the swamp, at night.|
guns|Mountain Guns|34|2|spirit|tanks|tech m_art1; equip artillery 200|Artillery a mule can carry.|
medium|Medium Tank|35|2|tanks|tech m_tank2; equip tanks 120|Good enough for China.|
bicycles|Bicycle Infantry|32|3|jungle|units inf 4; spirit Bicycle Columns: supply .08, atk .02|Six hundred miles down a peninsula in seventy days.|
tiger|Lightning in the Jungle|33|3|infiltrate|jungle|spirit Driving Charge [365]: atk .08|Bluff, speed and thirty thousand men.|req war
expedition|China Expeditionary Army|34|3|guns|units inf 6; fn calmUnrest|A million men to hold the railways.|
garrisons|Island Garrisons|35|3|medium|guns|fort Taihoku, Dairen; units inf 3|Every rock in the mandates gets a battalion.|
shortwar|Short War Doctrine|33|4|tiger|expedition|bicycles|tech m_doc1, m_doc2; spirit Decisive Battle on Land: atk .05, supply -.05|Win in six months or not at all.|
circle|Third Replenishment Plan|40|0||build shipyard 2; equip ships 30; bop 8|Quality to offset American quantity.|ai 2; sec Navy
treaties2|Leave the Naval Treaties|38|1|circle|rel USA -15, ENG -15; equip ships 30; tension 2|No more ratios.|
kido|Mobile Strike Force|40|1|circle|tech m_nav1; equip ships 30; spirit Carrier Striking Force: navy .12; bop 8|Six carriers sailing as one.|
giants|Super-Battleships|42|1|circle|equip ships 50; spirit Largest Guns Afloat: navy .06|Eighteen-inch guns behind a wall of secrecy.|
torpedo|Oxygen Torpedo|38|2|treaties2|spirit Long Lance: navy .08|Twice the range of anyone else's.|
night|Night Battle Training|39|2|treaties2|kido|spirit Night Fighting: navy .06|Lookouts chosen for their eyes.|
fighter|Carrier Fighter|40|2|kido|equip aircraft 250; spirit Agile Fighters: air .12|Nothing in the Pacific can turn with it.|
isubs|Fleet Submarines|41|2|kido|giants|tech m_nav2; equip ships 20|Boats built to scout for the battle line.|
landing|Naval Landing Forces|42|2|giants|units inf 3; spirit Landing Forces: navy .05, atk .02|Sailors with rifles and steel helmets.|
kessen|Decisive Fleet Battle|40|3|fighter|night|torpedo|spirit Kantai Kessen: navy .1|One great battle near home waters.|
escort|Escort Command|41|3|isubs|spirit Convoy Escorts of the Empire: tradecap .08|An afterthought that should not have been.|
mandates|Mandate Bases|42|3|landing|fort Taihoku; spirit Unsinkable Carriers: navy .05, air .03|Airstrips on coral.|
combinedfleet|The Combined Fleet|40|4|kessen|escort|mandates|equip ships 40; spirit Combined Fleet: navy .08; bop 10|The finest navy in the world, for about a year.|
airarms|Two Air Arms|46|0||build aircraftp 2; tech m_air1; equip aircraft 150|The Army and the Navy each build their own.|ai 2; sec Air
navalair|Land-Based Naval Bombers|45|1|airarms|tech m_air2; equip aircraft 200; spirit Long-Range Naval Air: navy .06, bombing .15|Torpedo bombers with a thousand-mile reach.|
armyair|Army Aviation|47|1|airarms|tech m_cas; equip aircraft 200|Light bombers over China.|
elite|Elite Pilot Training|45|2|navalair|spirit Elite Aircrew: air .1|A hundred graduates a year, each a master.|
masspilots|Mass Pilot Training|46|2|navalair|armyair|mp 80; spirit Pilot Reserve: air .06|Too late is better than never.|
homeair|Home Air Defence|47|2|armyair|spirit Air Defence Sectors: civdef .25|Wooden cities under a wide sky.|
special|Special Attack Units|46|3|elite|masspilots|homeair|spirit Divine Wind: navy .12, air -.05|A weapon of desperation.|req majorwar
riken|Institute of Physical Research|49|0||build university 2; res 25; spirit Research Institute: research .05, proj .1|A private foundation with a cyclotron.|ai 2; sec Science
locators|Radio Locators|49|1|riken|tech m_radar; proj 30|An antenna invented here and ignored here.|
nuclear|Nuclear Research|50|1|riken|res 20; proj 40|Two rival projects, one per service.|date 1941-1
rocket|Rocket Interceptors|49|2|locators|tech m_air3|Plans carried from Europe by submarine.|date 1944-1
balloons|Balloon Bombs|50|2|nuclear|spirit Stratospheric Balloons: bombing .1|Paper, lacquer and the jet stream.|
`);

TREES.CHI = parseTree('c_', `
tutelage|Political Tutelage|5|0||pp 50; stab 3|The party governs until the people are ready, says the party.|ai 5; sec Politics
chiang|The Generalissimo|3|1|tutelage|pp 80; legit 6; bop -15|One leader, one party, one doctrine.|mx democracy,wang,left; ai 6
democracy|Constitutional Government|7|1|tutelage|ideo dem 12; bop 5|The third stage of the founder's plan.|mx chiang,wang,left; ai 0
wang|The Peace Faction|10|1|tutelage|ideo fas 8; rel JAP 30|A war with Japan cannot be won; why fight it?|mx chiang,democracy,left; ai 0
left|The Left Kuomintang|12|1|tutelage|ideo com 10|The founder's widow speaks for the party he founded.|mx chiang,democracy,wang; ai 0
whampoa|Whampoa Loyalists|1|2|chiang|ig army 6; generals Hu Zongnan/3/def, Tang Enbo/3/off|The Generalissimo's students command his best divisions.|
newlife|New Life Movement|2|2|chiang|rmspirit corruption; spirit new_life_movement|Button your collar; do not spit.|
blue|The Blue Shirts|3|2|chiang|law secret_police; fn intelBoost; ideo fas 4|A secret society inside the party.|
machine|The Party Machine|4|2|chiang|pp 60; spirit Party Machine: pp .1, tax .05|Two brothers control every appointment.|
league|The Democratic League|7|2|democracy|setIdeo dem; stab -4|Professors and small parties find a voice.|
peacegov|A Government of Peace|10|2|wang|setIdeo fas; stab -8|Peace, anti-communism, national reconstruction.|
threepol|Three Great Policies|12|2|left|setIdeo com; rel SOV 40, PRC 40|Alliance with Russia, with the Communists, with the workers and peasants.|
profiteers|Punish the Profiteers|2|3|newlife|stab -3; spirit Clean Government: tax .1|A few examples are made.|
united|The United Front|3|3|blue|machine|nap PRC; ws 10; fn unitedFront|Chinese do not fight Chinese.|mx bandit; ai 6
bandit|Final Encirclement|4|3|machine|war PRC|A disease of the heart must be cured first.|mx united; req prcPeace; ai 0
assembly|National Assembly|6|3|league|law universal; legit 10|Four hundred million electors.|
tiller|Land to the Tiller|7|3|league|spirit land_reform; ig land -8 -.3, rural 8; rmspirit corruption|The founder's third principle.|
federal|A Federal China|8|3|league|fn federalChina; bop 20; spirit Federal Compact: stab 6, manpower .08|United provinces rather than a unitary state.|
anticom|Exterminate the Reds|9|3|peacegov|war PRC|The one point on which Tokyo and Nanjing agree.|req prcPeace
peace|Peace with Japan|10|3|peacegov|fn peaceWithJapan|An armistice on the enemy's terms.|
panasia|Pan-Asianism|11|3|peacegov|fn joinSphere|Yellow races together.|
merge|Merge with Yan'an|12|3|threepol|fn mergePRC|Two parties born of the same revolution.|
leader|Leader of All China|3|4|united|bandit|profiteers|legit 10; stab 6; bop -15; rmspirit warlord_era; spirit fragile_unity|The warlords bow, for the moment.|ai 5
democracies|Ally of the Democracies|7|4|assembly|tiller|federal|rel USA 40, ENG 30; trade USA|A republic among republics.|
onechina|One China|15|0||infl 30; bop -5|Five flags still fly south of the Great Wall.|ai 3; sec Unification
guangxi|The Guangxi Question|13|1|onechina|fn cliqueGXC|Two generals who have rebelled three times already.|
yunnan|The Yunnan Question|14|1|onechina|fn cliqueYUN|A mountain kingdom with its own currency.|
shanxi|The Shanxi Question|15|1|onechina|fn cliqueSHX|The Model Governor has ruled since 1911.|
ma|The Ma Question|16|1|onechina|fn cliqueXSM|Three families of Muslim generals hold the north-west.|
sichuan|The Sichuan Question|17|1|onechina|fn cliqueSIC|Seventy million people and a dozen feuding commanders.|
west|The Western Marches|18|1|onechina|core Urumqi, Kashgar, Lhasa, Chamdo; fn playSIKTIB|The Republic of Five Races.|req peace
revolt|Suppress the Southern Revolt|13|2|guangxi|fn forceGXC|Their air force defects before a shot is fired.|
road|The Yunnan Road|14|2|yunnan|infra 2; spirit burma_road|A back door to the sea.|
model|The Model Province|15|2|shanxi|build coalm 2, steel 1|Narrow-gauge railways keep outsiders out.|
muslims|Loyal Muslim Cavalry|16|2|ma|units cav 3|Horsemen who hate the Communists more than they distrust us.|
ricebowl|Rice Bowl of the West|17|2|sichuan|build farm 3|The province that can feed a government in exile.|
highway|The Qinghai Road|18|2|west|infra 2|A motor road to the roof of the world.|
central|Central Army Everywhere|15|3|revolt|road|model|muslims|ricebowl|fn integrateAll; bop -20|Every division takes its orders from the capital.|
northeast|Recover the Northeast|15|4|central|core Mukden, Hsinking, Harbin, Qiqihar, Hailar, Chengde, Dairen; ws 10|The eighteenth of September will be answered.|
taiwan|Retrocession|15|5|northeast|claim Taihoku; core Taihoku|Fifty years is long enough.|req war
prepare|Prepare for the Inevitable|22|0||ws 5; fort Nanjing, Shanghai|Buy time, build divisions, pray for another year.|ai 5; sec War of Resistance
german|Sino-German Cooperation|20|1|prepare|equip arms 250, artillery 50; build arms 1; generals Alexander von Falkenhausen/4/def; units inf 4; rmspirit inept_officers|German advisers, German rifles, German helmets.|req peaceWithGER; ai 4
volunteers|Soviet Volunteer Group|21|1|prepare|equip aircraft 200, arms 150; rel SOV 30|Stalin's falcons over the Yangtze.|req atwar JAP; ai 4
resist|War of Resistance|22|1|prepare|spirit war_of_resistance; ws 20; units mil 12; law requirement|The last critical moment has come.|req atwar JAP; ai 10
avg|American Volunteer Group|23|1|prepare|equip aircraft 150; rel USA 30|Shark mouths on borrowed fighters.|req atwar JAP
line|The Shanghai–Nanjing Line|20|2|german|fort Nanjing, Shanghai, Hangzhou|Pillboxes between the lake and the river.|
space|Trade Space for Time|21|2|resist|spirit Space for Time: caplimit .15, supply .05|Give up the coast; keep the army.|
capital|The Wartime Capital|22|2|resist|fn moveCapital|Beyond the gorges, beyond their reach.|req atwar JAP; ai 6
river|Hold the Yellow River|23|2|resist|fort Zhengzhou, Xi'an|The last line before the north-west.|
behind|Behind Enemy Lines|21|3|space|fn stirJapan|Every occupied county has a second government.|
burma|The Burma Road|22|3|capital|spirit burma_road; rel ENG 20, USA 20|A lifeline through the mountains.|
hump|Over the Hump|23|3|avg|equip aircraft 150; spirit Air Bridge: supply .1|Transports over the Himalayas.|
xforce|The Army in India|22|4|burma|units inf 4; spirit American-Trained Divisions: atk .05, org .05|Chinese soldiers, American rations and rifles.|
allies|Join the Allies|23|4|hump|burma|fn joinAllies|One of the Four Policemen.|req engJapWar; ai 6
counter|General Counter-Offensive|21|5|xforce|behind|spirit Counter-Offensive [540]: atk .12|After eight years, forward.|req atwar JAP
cairo|The Four Policemen|22|5|allies|xforce|infl 80; legit 8; core Taihoku|A seat beside the great powers.|
reconstruction|National Reconstruction|29|0||build construction 1; infra 2|A decade of roads, schools and deficits.|ai 3; sec Economy
fabi|Currency Reform|27|1|reconstruction|money 8; spirit Legal Tender: tax .1|Silver is nationalised; paper becomes money.|
rural|Rural Reconstruction|28|1|reconstruction|build farm 4, textile 2; rad -.05|Model counties and mass education.|
nrc|National Resources Commission|29|1|reconstruction|build steel 2, coalm 2, tools 1|State industry planned by engineers.|
rail|The Canton–Hankow Line|30|1|reconstruction|infra 4|The last gap in the north-south railway is closed.|
arsenal|The Great Arsenal|31|1|reconstruction|build arms 2, artyf 1|Rifles of a German pattern.|
coops|Industrial Cooperatives|28|2|rural|fabi|build tools 2, textile 2; spirit Work Together: output .04|Small workshops that can be carried on a man's back.|
tungsten|Tungsten for Arms|29|2|nrc|trade GER, USA; money 6; spirit Strategic Ores: tradecap .06|Half the world's supply.|
inland|Move Industry Inland|30|2|rail|arsenal|fn inlandBuild; spirit Inland Arsenals: civdef .4|Machines carried upriver by hand.|
university|The Associated University|29|3|tungsten|coops|build university 2; res 25|Three universities walk a thousand miles and reopen.|
plan|Three-Year Plan|30|3|inland|tungsten|build steel 2, power 2, chem 1|Heavy industry in the far interior.|
reorg|Reorganise the Army|35|0||spirit army_reform; pp 30|Sixty divisions to be made real instead of nominal.|ai 2; sec Army
trained|German-Trained Divisions|33|1|reorg|units inf 6, hvy 2; tech m_art1|Eight divisions as good as any in Asia.|
academy|Central Military Academy|34|1|reorg|rmspirit inept_officers; generals Du Yuming/3/panzer|Promotion by examination.|
conscript|Conscription Law|35|1|reorg|law extensive; mp 500|Every household owes a son.|
corps|Peace Preservation Corps|36|1|reorg|units mil 12|Provincial troops by another name.|
airforce|Air Force Commission|37|1|reorg|build aircraftp 1; tech m_air1; equip aircraft 150|Bought with public subscriptions for the leader's birthday.|
mechanised|The Mechanised Division|34|2|academy|trained|tech m_tank1; units arm 1, mot 1|China's only armoured formation.|
zones|War Zone System|35|2|conscript|spirit War Zones: supply .1, org .04|Each front lives off its own provinces.|
daretodie|Dare-to-Die Corps|36|2|corps|spirit Dare to Die: def .06, org .04|Big swords against tanks.|
magnet|Magnetic Warfare|35|3|zones|daretodie|tech m_doc1; spirit Lure and Encircle: def .08|Draw them in, then close behind them.|
`);

TREES.PRC = parseTree('r_', `
yanan|The Yan'an Way|4|0||stab 5; pp 50|Caves in the loess hills, at the end of a six-thousand-mile retreat.|ai 5; sec Party
mao|Mao Zedong Thought|2|1|yanan|legit 8; bop -20; spirit Sinified Marxism: stab 5, org .05|Marxism must take a Chinese form.|mx students,zhang; ai 6
students|The Returned Students|5|1|yanan|rel SOV 40; bop 20; equip arms 300|Twenty-eight and a half Bolsheviks, fresh from Moscow.|mx mao,zhang; ai 1
zhang|A Rival Central Committee|7|1|yanan|stab -8; units inf 3; fn leaderZhang|The commander of the larger army thinks he should lead.|mx mao,students; ai 0
rectify|Rectification|1|2|mao|pp 80; rad -.1; bop -15|Cure the sickness to save the patient.|
massline|The Mass Line|2|2|mao|ig rural 8 .2; mp 150|From the masses, to the masses.|
selfrely|Self-Reliance|3|2|mao|build farm 2, textile 1, arms 1; spirit Wasteland Reclaimed: farm_out .15, output .05|A brigade turns a barren valley into farmland.|
line|The Comintern Line|5|2|students|fn joinComintern|Everything through the united front, says Moscow.|
cells|City Cells|6|2|students|fn stirCHI; spirit Urban Underground: infl .1|The proletariat is in Shanghai, not in the hills.|
westroute|The Western Route|7|2|zhang|claim Urumqi, Lanzhou; units cav 2|Towards Sinkiang and Soviet supplies.|
newdem|New Democracy|2|3|rectify|massline|selfrely|ideo com 6; stab 5; spirit New Democracy: legit 8, rad -.1|A bloc of four classes, for now.|
advisers|Soviet Advisers|5|3|line|cells|equip artillery 100, arms 300; tech m_art1; bop 10|A German with a Russian name plans the battles.|
northwest|North-West Federation|7|3|westroute|claim Lanzhou, Xining; ws 8|A soviet among the Muslim clans.|
congress|The Seventh Congress|3|4|newdem|advisers|pp 100; legit 10|A million members and one chairman.|
enemy|Which Enemy First?|13|0||pp 30|Chiang, or the Japanese?|ai 5; sec Revolution
front|The United Front|11|1|enemy|nap CHI; ws 10; fn joinChinaWar; rel CHI 30|Resist Japan and save the nation.|mx overthrow; ai 6
overthrow|Overthrow Chiang|15|1|enemy|war CHI|The civil war never ended.|mx front; req chiPeace; ai 0
eighth|Eighth Route Army|10|2|front|units inf 4; equip arms 300|Red soldiers in Nationalist caps.|
fourth|New Fourth Army|11|2|front|units inf 3, mil 4|Guerrillas of the south, gathered into one army.|
observers|The Observer Mission|12|2|front|rel USA 30; equip arms 200|American officers are impressed by what they see.|req atwar JAP
landwar|Land Revolution|15|2|overthrow|ig land -10 -.5, rural 8; mp 300|Burn the deeds; divide the fields.|
hundred|Hundred Regiments|10|3|eighth|fn stirJapan; spirit Hundred Regiments Offensive [365]: atk .1|Every railway in north China is cut in a night.|req atwar JAP
coalition|On Coalition Government|11|3|fourth|observers|infl 50; fn stirCHI|An offer the Generalissimo cannot accept.|
liberation|War of Liberation|13|4|coalition|hundred|landwar|war CHI; spirit Liberation War [720]: atk .1, manpower .1|Millet plus rifles.|req japDone; ai 4
northeastr|Race to the Northeast|13|5|liberation|claim Mukden, Harbin, Hsinking; units inf 4|Whoever holds Manchuria's factories wins.|
campaigns|Three Decisive Campaigns|14|5|liberation|spirit Three Campaigns [540]: atk .12|A million and a half enemy soldiers in five months.|req atwar CHI
yangtze|Cross the Yangtze|13|6|northeastr|campaigns|ws 15; units inf 6|Carry the revolution through to the end.|req atwar CHI
proclaim|The People's Republic|13|7|yangtze|fn proclaimPRC; stab 15; legit 15|The Chinese people have stood up.|req own Nanjing, Peiping
lean|Lean to One Side|12|8|proclaim|fn joinComintern; rel SOV 50; trade SOV|There is no third road.|mx ownroad
westr|Peaceful Liberation of the West|13|8|proclaim|claim Lhasa, Chamdo, Urumqi, Kashgar; fn playSIKTIB|The old frontiers of the empire.|
ownroad|An Independent Road|14|8|proclaim|spirit Neither Bloc: infl .2, stab 5|Neither Washington nor Moscow.|mx lean
border|Border Region Government|20|0||build admin 1, farm 2; stab 3|A state the size of a province, recognised by nobody.|ai 3; sec Base Areas
shaanxi|The Home Base|18|1|border|build farm 2, textile 1; mp 100|A million and a half people and very little rain.|
lines|Behind Japanese Lines|19|1|border|fn stirJapan; fn baseAreas|The enemy holds the towns and the railways. The rest is ours.|req atwar JAP; ai 6
rent|Rent Reduction|20|1|border|ig rural 6; rad -.08; mp 150|A quarter off every rent.|
thirds|The Three-Thirds System|21|1|border|legit 6; stab 4; infl 20|One-third Communists, one-third progressives, one-third the rest.|
college|Resistance University|22|1|border|build university 1; res 20; generals Liu Bocheng/4/trick, Nie Rongzhen/3/mtn|Lectures on a hillside, rifles for desks.|
production|Great Production Campaign|19|2|shaanxi|rent|build farm 3, tools 1, arms 1|The chairman grows his own tobacco.|
tunnels|Tunnel Warfare|20|2|lines|rent|spirit Tunnel Villages: def .1, entrench .1|A second village under the first.|
militia|People's Militia|21|2|thirds|rent|units mil 10; spirit Every Village a Fortress: manpower .1|Home-made mines and spears.|
yellowcliff|The Hidden Arsenal|22|2|college|build arms 2; equip arms 300|A rifle factory in a gorge.|
liberated|Liberated Areas|20|3|production|tunnels|militia|fn growBases; pp 50|A hundred million people behind the front.|
redarmy|The People's Army|26|0||spirit army_reform; units inf 2|An army the people do not fear.|ai 2; sec Red Army
sixteen|Sixteen Characters|24|1|redarmy|spirit Guerrilla Maxims: def .08, supply .1|The enemy advances, we retreat; the enemy camps, we harass.|
mobile|Mobile Warfare|26|1|redarmy|tech m_doc1; spirit Concentrate Superior Force: atk .06|Ten against one in every battle.|
rules|Three Rules, Eight Points|28|1|redarmy|rad -.05; spirit Army of the People: org .06, manpower .05|Do not take a needle or thread from the people.|
sparrow|Sparrow Warfare|24|2|sixteen|spirit Harassment Squads: def .04|Three men, one shot, gone.|
captured|Our Arsenal Is the Enemy|25|2|sixteen|mobile|equip arms 400, artillery 60|Supplied by the transport corps of our opponents.|
regular|Regularisation|26|2|mobile|units inf 6; tech m_art1|Guerrilla bands become regiments.|
cavalry|Cavalry Brigades|27|2|mobile|rules|units cav 3|For the open country of the north.|
political|Political Work|28|2|rules|spirit Party Branch in Every Company: org .05, ws 6|The party commands the gun.|
field|Field Armies|26|3|regular|captured|units inf 8, hvy 2; generals Chen Yi/4/off, Su Yu/5/brilliant|Five great armies, each half a million strong.|
pla|People's Liberation Army|26|4|field|political|sparrow|spirit Liberation Army: atk .05, def .05, org .05|A new name for a new kind of war.|
`);

TREES.PHI = parseTree('ph_', `
commonwealth|The Commonwealth|4|0||pp 50; stab 4|Ten years of self-government under the American flag.|sec Commonwealth
justice|Social Justice|2|1|commonwealth|ig rural 6, union 4; rad -.08; bop 5|Justice for the man behind the plough.|mx sakdal,unions; ai 6
sakdal|The Sakdal Rising|6|1|commonwealth|ideo fas 12; stab -6; bop 25|"To accuse": peasants who want independence now and help from Tokyo.|mx justice,unions; ai 0
unions|Peasant Unions|8|1|commonwealth|ideo com 12; stab -4|Central Luzon's tenants organise.|mx justice,sakdal; ai 0
language|A National Language|1|2|justice|stab 4; spirit National Language: legit 5, literacy .3|One tongue among eighty.|
suffrage|Women's Suffrage|2|2|justice|law universal; legit 6|Decided by a plebiscite of women.|
tenancy|Rice Share Tenancy Act|3|2|justice|ig rural 5, land -4; spirit land_reform|Half the crop to the man who grows it.|
ganap|The Ganap Party|6|2|sakdal|setIdeo fas; stab -6|Complete independence, by any ally.|
army|A People's Army|8|2|unions|setIdeo com; stab -6; units mil 8|Squadrons of a hundred, armed with what they can find.|
capital|A New Capital|1|3|language|build urban 2, admin 1|A planned city named for the President.|
partyless|Partyless Democracy|2|3|suffrage|tenancy|pp 80; ideo aut 6; spirit Coalition Rule: pp .1|Opposition is a luxury a new nation cannot afford.|mx opposition
opposition|A Loyal Opposition|3|3|suffrage|tenancy|ideo dem 6; stab 4|Two parties, one constitution.|mx partyless
asians|Asia for the Asians|6|3|ganap|rel JAP 40; fn phJapan|A friend across the Luzon Strait.|
league|The Patriotic League|7|3|ganap|units mil 6|Bamboo-hatted auxiliaries.|
haciendas|Break the Haciendas|8|3|army|ig land -10 -.5, rural 8; build farm 3|The sugar barons' land is divided.|
soviet|The Luzon Councils|9|3|army|fn joinComintern|A red republic in the rice bowl.|
term|Amend the Term Limit|2|4|partyless|opposition|pp 60; legit 5|Eight years, in two terms of four.|
road|The Ten-Year Road|12|0||infl 20; bop 5|Independence is promised for the fourth of July, 1946.|ai 2; sec Independence
now|Independence Now|10|1|road|fn phIndep; bop 20|Better a government run like hell by Filipinos.|mx permanent; ai 0
permanent|Permanent Commonwealth|14|1|road|rel USA 40; trade USA; bop -25; spirit American Protection: def .05, invest .2|Why leave the safest harbour in the Pacific?|mx now; ai 3
neutral|Neutralisation Treaty|10|2|now|nap JAP; rel JAP 20; spirit armed_neutrality|The Switzerland of the Orient.|req sovereign
malay|Malay Brotherhood|11|2|now|rel SIA 30; infl 30; claim Jesselton|An old sultan's lease on North Borneo.|
bases|Military Bases Agreement|13|2|permanent|fn usGarrison; fort Manila; rel USA 20|Ninety-nine years, twenty-three sites.|
parity|Parity Rights|14|2|permanent|money 10; ig ind 5; spirit American Capital: invest .3, pp -.05|Americans may mine and build as citizens do.|
voice|Voice of Small Nations|11|3|malay|neutral|infl 60; legit 6|A delegate who speaks for the colonised.|
return|I Shall Return|13|3|bases|units inf 4; equip arms 400, aircraft 100|A promise made from Australia.|req war
alliance|Mutual Defence Treaty|14|3|parity|bases|fn joinUSA|An attack on one is an attack on both.|
exile|Government in Washington|12|4|return|voice|spirit Government in Exile: caplimit .2|The Commonwealth continues on borrowed desks.|req war
republic|The Third Republic|12|5|exile|alliance|voice|fn phFree; stab 10; legit 10|The flag goes up alone.|date 1945-1
sugar|Beyond Sugar|18|0||build plantation 2, textile 1|Free entry to the American market ends with independence.|ai 3; sec Economy
nepa|Buy Filipino|17|1|sugar|build textile 2, tools 1; spirit Economic Protectionism: invest .15|A national association for home industry.|
gold|Mountain Gold|18|1|sugar|money 8; build ironm 1; fn phIron|A gold rush in the pine forests.|
hemp|Manila Hemp|19|1|sugar|build ranch 2; trade USA, JAP|Every navy's ropes come from Davao.|
promise|Land of Promise|20|1|sugar|build farm 3, logging 2; mp 60|Settlers for the empty south.|
state|State University|17|2|nepa|build university 1; res 20|Scholars of the nation.|
ndc|National Development Company|18|2|nepa|gold|build steel 1, power 1, construction 1|The state builds what capital will not.|
dam|The First Great Dam|19|2|hemp|gold|tech p_hydro; build power 2|Light for the capital from a mountain lake.|
railroad|The Manila Railroad|18|3|ndc|dam|infra 3|North to the gulf, south to the volcano.|
defence|National Defense Act|24|0||law limited; mp 80; spirit army_reform|The Assembly's first law.|ai 3; sec Army
adviser|The Military Adviser|22|1|defence|generals Vicente Lim/3/def, Basilio Valdes/2/log; spirit Field Marshal's Plan: org .06, train .1|A retired American general designs an army and a uniform.|
citizen|Citizen Army|24|1|defence|units inf 4; spirit Reserve Divisions: manpower .1|Forty thousand trainees a year.|
scouts|The Scouts|26|1|defence|units inf 2; equip arms 200; spirit Scout Regiments: atk .04|The best soldiers in the islands.|
academy|Military Academy|22|2|adviser|fn xpAll; pp 20|Cadets in the mountain air.|
mosquito|Mosquito Fleet|23|2|adviser|citizen|equip ships 5; spirit Torpedo Boats: navy .05|Fast boats for seven thousand islands.|
aircorps|Army Air Corps|24|2|citizen|build aircraftp 1; tech m_air1; equip aircraft 80|A handful of trainers and a great deal of hope.|
beaches|Beach Defence|25|2|citizen|scouts|fort Manila, Cebu|Stop them at the waterline.|
peninsula|The Peninsula Fortress|25|3|beaches|fort Manila; spirit Last Stand Plan: caplimit .2, def .06|Hold the bay until the fleet arrives.|
guerrillas|Guerrilla Resistance|24|3|aircorps|mosquito|academy|fn selfUnrest; spirit Island Guerrillas: def .05, supply .1|Every island has its colonel.|
`);

TREES.MON = parseTree('m_', `
khural|The Little Khural|3|0||pp 50|A parliament of herdsmen, watched by advisers.|sec Party
choibalsan|The Marshal's Ascent|1|1|khural|pp 80; rel SOV 20; bop -20|Moscow has chosen its man.|mx genden,bogd; ai 6
genden|The Premier's Defiance|3|1|khural|rel SOV -20; stab 5; bop 15; ig devout 5|He broke the General Secretary's pipe, they say.|mx choibalsan,bogd; ai 1
bogd|Find the Ninth Incarnation|6|1|khural|ideo aut 12; ig devout 8|The search was forbidden in 1924.|mx choibalsan,genden; ai 0
monasteries|Close the Monasteries|0|2|choibalsan|ig devout -10 -.5; mp 80; rad .05; bop -15|Seven hundred of them, emptied in two years.|
collectives|Herding Collectives|1|2|choibalsan|law command; build ranch 2; rad .04|The first attempt ended in revolt.|
script|A New Alphabet|2|2|choibalsan|spirit New Alphabet: literacy .6, research .04|The old vertical script is retired.|
rich|Get Rich!|3|2|genden|law interventionism; ig rural 6; spirit Private Herds: farm_out .15, rad -.05|A slogan borrowed from a purged Bolshevik.|
faith|Socialism and the Faith|4|2|genden|ig devout 8; stab 6; spirit Tolerance of the Faith: stab 4, legit 5|The Buddha and Lenin both stood for the poor.|
khanate|Restore the Khanate|6|2|bogd|setIdeo aut; law theocracy; fn leaderBogd; legit 12|A living Buddha on the throne again.|
princes|Banner Princes|7|2|bogd|ig land 8 .3; units cav 3|The old nobility saddles up.|
marshal|Marshal of the Republic|1|3|monasteries|collectives|script|fn leaderChoi; legit 8; spirit Soviet Model: build .1, pp .1|Premier, minister of war and commander-in-chief.|
independent|Truly Independent|3|3|rich|faith|fn monIndep; bop 20|A friend of Moscow, not its province.|
panmongol|All the Mongols|4|3|faith|claim Hohhot, Kalgan, Hailar; ws 8|More Mongols live outside the republic than in it.|
tokyo|Friends in the East|6|3|khanate|rel JAP 40; nap JAP|Tokyo also has uses for a Mongol prince.|
between|Between Bear and Dragon|11|0||infl 30|Two neighbours, and neither thinks we exist.|ai 2; sec Foreign Policy
protocol|Mutual Assistance Protocol|9|1|between|rel SOV 30; units inf 2; fort Ulan Bator|A Soviet corps moves in, by invitation.|ai 5
guards|Border Guards|10|1|between|fort Ulan Bator; units cav 2|Five thousand kilometres of frontier.|
tuva|Brothers in Tuva|11|1|between|infl 20; rel SOV 10; mp 30|The only other state that recognises us.|
inner|The Inner Mongolian Question|12|1|between|claim Hohhot, Kalgan, Hailar; rel CHI -20|South of the Gobi the banners await.|
khalkha|Battle on the Khalkha|9|2|protocol|guards|rel JAP -20; spirit Victory at the Khalkha: def .08, ws 8|A river nobody had heard of.|date 1939-5
recognition|Seek Recognition|11|2|tuva|rel USA 15, ENG 15, CHI 10; infl 40|A vice-president visits by aeroplane.|
greater|Greater Mongolia|12|2|inner|ws 8; fn pressClaims|One state for one people.|req sovereign
ride|Ride with the Red Army|10|3|khalkha|fn monJoinSovWar; units cav 3|Across the Gobi and the Khingan range.|req sovJapWar
plebiscite|Independence Plebiscite|11|3|recognition|legit 10; fn monAutonomy|One hundred per cent in favour, exactly.|
seat|A Seat Among Nations|11|4|plebiscite|ride|infl 60; legit 8|The veto delays it; it comes anyway.|
herds|Twenty-Five Million Head|16|0||build ranch 3|Thirty animals for every person.|ai 3; sec Economy
vets|Veterinary Service|15|1|herds|spirit Healthy Herds: farm_out .15|Inoculation against the cattle plague.|
wool|Wool for the Red Army|16|1|herds|build textile 2; trade SOV; money 5|Greatcoats, felt boots and half a million horses.|
coal|The First Mine|17|1|herds|build coalm 2; fn monCoal|Heat for the capital's first power station.|
hay|Haymaking Stations|15|2|vets|build farm 2; spirit Winter Fodder: growth .3, farm_out .05|A defence against the white death of the steppe.|
combine|The Industrial Combine|16|2|wool|coal|build tools 1, power 1, furniture 1|Tannery, boot factory and wool-washing plant on one site.|
railway|Railway to the Border|17|2|coal|infra 3|The first tracks in the country.|
city|Build the Capital|16|3|combine|railway|build urban 2, admin 1, university 1|Felt tents give way to brick.|
pra|People's Revolutionary Army|21|0||spirit army_reform; units cav 2|Eight cavalry divisions and an armoured brigade.|ai 2; sec Army
saddle|A Nation on Horseback|20|1|pra|units cav 4; spirit Born in the Saddle: org .06, supply .1|Every herdsman is a trooper.|
equipment|Soviet Equipment|21|1|pra|equip arms 300, artillery 60; tech m_art1|Rifles, guns and instructors.|
armoured|Armoured Car Brigade|22|1|pra|tech m_mot, m_tank1; units mot 1|Wheels suit the steppe better than tracks.|
officers|Officers' School|20|2|saddle|generals Jamyangiin Lhagvasuren/3/cav; fn xpAll|Cadets trained in the Soviet academies.|
steppe|Steppe Defence|21|2|equipment|saddle|spirit Deep Steppe: def .08, caplimit .15|There is always further to retreat.|
squadron|Air Squadron|22|2|armoured|equip aircraft 60; tech m_air1|Biplanes that also carry the mail.|
`);
for (const k of ['JAP', 'CHI', 'PRC', 'PHI', 'MON']) extendTree(k, TREES[k]);

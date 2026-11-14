// 2.0 Subjects and occupation governments.
//  - Subjects have a status (Protectorate, Dominion, Puppet, Collaboration Government, Military Governorate,
//    Reichskommissariat) with its own tribute, levies, autonomy ceiling and independence drive.
//  - Occupation governments are set up from occupied land: a Military Governor, a Commissariat, or a Collaboration
//    Government. Each can take over newly conquered land of the same nation automatically.
//  - Peace deals: reparations, demilitarisation, partition, commissariats and collaboration governments.
'use strict';
const SUBJ_TYPE = {
  protect: { name: 'Protectorate', tribute: 0.02, levy: 0.05, cap: 100, drive: 0.6, tip: 'Light obligations. We defend them; they follow our foreign policy.' },
  dominion: { name: 'Dominion', tribute: 0.04, levy: 0.1, cap: 95, drive: 0.5, tip: 'Self-governing, loyal in war.' },
  puppet: { name: 'Puppet', tribute: 0.1, levy: 0.15, cap: 85, drive: 1, tip: 'A government that answers to us.' },
  collab: { name: 'Collaboration Government', tribute: 0.12, levy: 0.2, cap: 70, drive: 1.2, tip: 'A native government set up in occupied land. Calms resistance and raises its own troops; its legitimacy grows with time.' },
  milgov: { name: 'Military Governorate', tribute: 0.2, levy: 0.1, cap: 30, drive: 0.4, tip: 'Occupied land under a military governor. Orderly, with modest yields, until a final settlement.' },
  rk: { name: 'Reichskommissariat', tribute: 0.3, levy: 0.25, cap: 15, drive: 1.6, tip: 'Direct rule by a commissioner. The highest yields and the fiercest resistance.' }
};
const subjType = s => SUBJ_TYPE[s.stype] ? s.stype : (s.collabOf ? 'collab' : subjLevel(s) >= 2 ? 'dominion' : 'puppet');
// tribute and levies follow the status
tributeRate = function (s) { const t = SUBJ_TYPE[subjType(s)]; return Math.min(t.tribute, 0.3) * (1 - autonomyOf(s) / 200); };
const COMMISSARIAT = { GER: ['Reichskommissariat', 'Reichskommissar'], ITA: ['Governorate', 'Governor'], JAP: ['Military Administration', 'Administrator'], SOV: ['People\'s Commissariat', 'Commissar'] };
const REGION_NAME = { SOV: ['Ostland', 'Ukraine', 'Moskowien', 'Kaukasus'], POL: ['Generalgouvernement'], FRA: ['Frankreich'], HOL: ['Niederlande'], NOR: ['Norwegen'], BEL: ['Belgien-Nordfrankreich'], ENG: ['Großbritannien'], YUG: ['Serbien'], GRE: ['Griechenland'], CZE: ['Böhmen und Mähren'], DEN: ['Dänemark'], CHI: ['North China'], USA: ['Amerika'] };
function regimeName(c, e, kind) {
  const E = C(e), base = e.slice(0, 3);
  if (kind === 'collab') return (!['ENG', 'RAJ', 'USA', 'SOV'].includes(base) && COLLAB_NAME[base]) || `${E.adj} State`;
  if (kind === 'rk') { const pre = (COMMISSARIAT[c.tag.slice(0, 3)] || ['Commissariat'])[0], used = Object.values(G.C).filter(k => k.exists && k.stype === 'rk').map(k => k.name), r = ((c.tag.slice(0, 3) === 'GER' && REGION_NAME[base]) || [E.name]).find(n => !used.includes(`${pre} ${n}`)) || E.name; return c.tag.slice(0, 3) === 'GER' ? `${pre} ${r}` : `${pre} of ${r}`; }
  return `Military Government of ${E.name}`;
}
// set up an occupation government over the enemy land we hold (or a filter of it)
function createRegime(c, e, kind, opt = {}) {
  const E = C(e); if (!E || !atWar(c.tag, e) && !opt.peace) return null; let ps = G.P.filter(p => p.owner === e && p.ctrl === c.tag && (!opt.iso || opt.iso.includes(PROV_ISO[p.id])));
  if (opt.provs) ps = opt.provs.map(P); if (!ps.length) return null; let n = 0, tag; do { tag = e.slice(0, 3) + (kind === 'collab' ? 'C' : kind === 'rk' ? 'K' : 'M') + (n || ''); n++; } while (G.C[tag] && G.C[tag].exists);
  const skip = new Set(['parties', 'leader', 'party', 'bop', 'bopBand', 'emb', 'embTier', 'airPlan', 'airAuto', 'doc', 'civDead', 'civBy', 'milDead', 'pows', 'wounded', 'coupRisk', 'ltrait', 'inOffice', 'lage', 'cabinet', 'legacy', 'intel', 'proj', 'lend', 'regimes', 'occ', 'axp']);
  const r = G.C[tag] = JSON.parse(JSON.stringify(E, function (k, v) { return k[0] === '_' || (this === E && skip.has(k)) ? undefined : v; }));
  Object.assign(r, { tag, name: opt.name || regimeName(c, e, kind), color: shade(E.color, c.color), ai: true, exists: true, capitulated: false, focus: { cur: null, prog: 0, done: {} }, gens: [], queue: [], pq: [], enact: null, overlord: null, rel: {}, money: 0, invPool: 0, training: [], flags: {}, spirits: [], cabinet: [], collabOf: e, warExh: 0, casualties: 0, infamy: 0, manpower: 30, stype: kind, legitC: kind === 'collab' ? 20 : 0, cores: undefined });
  for (const k in r.stock) r.stock[k] = 0; ps.sort((a, b) => b.vp - a.vp); r.capital = ps[0].id; for (const o of alive()) if (o.tag !== tag) { r.rel[o.tag] = 0; o.rel[tag] = 0; }
  for (const p of ps) { p.owner = tag; p.ctrl = tag; if (kind === 'collab' && !p.cores.includes(tag)) p.cores.push(tag); p.unrest = Math.max(0, (p.unrest || 0) * (kind === 'collab' ? 0.4 : kind === 'milgov' ? 0.7 : 1.2)); }
  const ideo = kind === 'collab' ? (c.ideology === 'dem' ? 'dem' : c.ideology === 'com' ? 'com' : c.ideology) : c.ideology; setIdeology(r, ideo, true);
  const k = (COMMISSARIAT[c.tag.slice(0, 3)] || ['', 'Commissioner'])[1]; r.leader = kind === 'collab' ? personName(r) : kind === 'rk' ? `${k} ${personName(c).split(' ').pop()}` : `General ${personName(c).split(' ').pop()}`; r.party = kind === 'collab' ? `${E.adj} National Council` : kind === 'rk' ? 'Civil Administration' : 'Military Administration'; r.parties = undefined;
  r.stab = kind === 'collab' ? 40 : 55; r.ws = 50; makeSubject(c.tag, tag); r.autonomy = { collab: 25, milgov: 5, rk: 0 }[kind]; r.stype = kind;
  if (kind === 'collab') { spawnDivisions(r, 'mil', Math.max(2, Math.round(ps.length * 1.2)), r.capital); r.stock.arms = 300; }
  (c.regimes = c.regimes || {})[e] = { tag, auto: opt.auto !== false }; G._wc = null;
  logMsg(`${c.name} sets up the ${r.name} in occupied ${E.name}.`, 'world', [c.tag, e]); if (typeof worldNews === 'function') worldNews(`${r.name}`, `${c.name} has placed occupied ${E.name} under a new administration: ${SUBJ_TYPE[kind].name.toLowerCase()}.`, kind === 'rk' ? '🦅' : kind === 'collab' ? '🎭' : '🪖', [c.tag]);
  legacyAdd(c, 'conq', 4, `${r.name} is set up.`); UIH.mapDirty(); return r;
}
createCollab = function (c, e, name, iso) { return createRegime(c, e, 'collab', { name, iso }); };
// newly conquered land passes to the regime set up for that nation
function regimesWeekly() {
  for (const c of alive()) { if (!c.regimes) continue; for (const e in c.regimes) { const g = c.regimes[e], r = C(g.tag); if (!r || !r.exists || r.overlord !== c.tag) { delete c.regimes[e]; continue; } if (!g.auto) continue;
      const fam = e === 'CHI' ? ['CHI', 'GXC', 'YUN', 'SHX', 'XSM', 'SIC'] : [e];
      for (const p of G.P) if (fam.includes(p.owner) && p.ctrl === c.tag && atWar(c.tag, p.owner) && !armiesAt(p.id).some(a => a.owner === p.owner)) { p.owner = g.tag; p.ctrl = g.tag; if (r.stype === 'collab' && !p.cores.includes(g.tag)) p.cores.push(g.tag); }
      if (r.stype === 'collab') { r.legitC = Math.min(100, (r.legitC || 0) + 0.4 + (r.stab > 50 ? 0.3 : 0)); if (r.legitC > 60 && autonomyOf(r) < 40) r.autonomy += 0.2; } } }
  UIH.mapDirty();
}
// when the war is won, the regime keeps the land it administers, and an annexed nation's land goes to it
{ const _an = annex; annex = function (a, tag, peaceful) { const A = C(a), g = A && A.regimes && A.regimes[tag], r = g && C(g.tag); _an(a, tag, peaceful); if (r && r.exists && r.overlord === a) { let n = 0; for (const p of G.P) if (p.owner === a && (p.orig === tag || p.cores.includes(tag)) && p.id !== A.capital) { p.owner = g.tag; p.ctrl = g.tag; n++; } if (n) logMsg(`The ${r.name} takes over the administration of ${n} provinces.`, 'world', [a]); UIH.mapDirty(); } }; }

// independence drive: grows with a weak or losing overlord, a strong subject, mistreatment and resistance
function libertyDrive(s) { const o = C(s.overlord); if (!o) return 0; const t = SUBJ_TYPE[subjType(s)], so = countryStr(s.tag), oo = Math.max(1, countryStr(o.tag));
  let d = 20 + (so / oo) * 120 + autonomyOf(s) * 0.3 - opinion(s.tag, o.tag) * 0.25 + (o.capitulated ? 50 : 0) + (isAtWar(o.tag) && o.warExh > 50 ? 15 : 0) + (s.ideology !== o.ideology ? 15 : 0) - (armiesOf(o.tag).some(a => P(a.loc).owner === s.tag) ? 15 : 0);
  if (s.stype === 'collab') d -= (s.legitC || 0) * 0.2; return clamp(d * t.drive, 0, 100); }
{ const _sm = subjectsMonthly; subjectsMonthly = function () { _sm(); regimesWeekly();
  for (const s of alive()) { if (!s.overlord) continue; const o = C(s.overlord), t = SUBJ_TYPE[subjType(s)]; if (!o || !o.exists) continue; s.autonomy = Math.min(t.cap, autonomyOf(s)); s.liberty = libertyDrive(s);
    // levies: a share of the subject's manpower joins the overlord's pool each month
    const lv = s.manpower * t.levy * 0.25; s.manpower -= lv; o.manpower += lv; s.levied = (s.levied || 0) + lv;
    if (s.ai && s.liberty > 85 && isAtWar(o.tag) && o.warExh > 40 && !isAtWar(s.tag) && Math.random() < 0.08 && s.stype !== 'milgov' && s.stype !== 'rk') declareIndependence(s);
    if ((s.stype === 'rk' || s.stype === 'milgov') && Math.random() < 0.02) { for (const p of provsOf(s.tag)) p.unrest = Math.min(100, (p.unrest || 0) + (s.stype === 'rk' ? 3 : 1)); } } }; }
SUBJ.status = { name: 'Change Status', cost: 50, tip: 'Pick the subject\'s status: obligations, autonomy ceiling and independence drive change with it.', can: () => '', do: () => { } };
SUBJ.loyal = { name: 'Install a Loyal Government', cost: 80, tip: 'Their government is replaced by one of our ideology. Autonomy -10, their stability -10.', can: (o, s) => s.ideology === o.ideology ? 'They already share our ideology' : '', do: (o, s) => { setIdeology(s, o.ideology, true); s.autonomy = Math.max(0, autonomyOf(s) - 10); s.stab = Math.max(0, s.stab - 10); } };
SUBJ.garrison = { name: 'Station a Garrison', cost: 30, tip: 'Two of our divisions garrison their capital: independence drive falls, unrest falls.', can: (o, s) => o.manpower > 30 ? '' : 'We have no men to spare', do: (o, s) => { let a = armiesAt(s.capital).find(x => x.owner === o.tag && x.garrison); if (!a) { a = newArmy(o, s.capital); a.garrison = true; a.auto = false; a.name = `${s.adj} Garrison`; } for (let i = 0; i < 2; i++) a.divs.push({ t: 'inf', str: 1, org: 1, xp: 0 }); o.manpower -= 24; for (const p of provsOf(s.tag)) p.unrest = Math.max(0, (p.unrest || 0) - 15); } };
SUBJ.resources = { name: 'Demand Resources', cost: 30, tip: 'A shipment of their stockpiles and a payment equal to a month of their income. Relations -10, independence drive up.', can: (o, s) => (s.budget.income || 0) > 0 ? '' : 'They have nothing to give', do: (o, s) => { const m = Math.max(100, s.budget.income * 4); s.money -= m; o.money += m; for (const g of ['oil', 'steel', 'coal', 'rubber']) if (s.stock[g] > 0) { o.stock[g] = (o.stock[g] || 0) + s.stock[g] * 0.5; s.stock[g] *= 0.5; } addRel(s.tag, o.tag, -10); } };
function setSubjType(o, s, k) { if (s.overlord !== o.tag || !SUBJ_TYPE[k]) return 'Not our subject'; if (o.pp < 50) return 'Needs 50 political power'; o.pp -= 50; s.stype = k; s.autonomy = Math.min(SUBJ_TYPE[k].cap, autonomyOf(s)); if (k === 'rk') { s.autonomy = 0; for (const p of provsOf(s.tag)) p.unrest = Math.min(100, (p.unrest || 0) + 15); } logMsg(`${s.name} becomes a ${SUBJ_TYPE[k].name.toLowerCase()} of ${o.name}.`, 'info', [o.tag, s.tag]); return ''; }

// peace deals: more choices when the war is won
SPIRITS.war_reparations = ['War Reparations', 'A share of our income goes to the victors.', { tax: -0.15 }];
SPIRITS.demilitarised = ['Demilitarised', 'The peace treaty limits our armed forces.', { mil_out: -0.5, manpower: -0.5 }];
{ const _pe = peace; peace = function (w, winSide) { const win = w[winSide].slice(), lose = (winSide === 'att' ? w.def : w.att).slice(), occ = {}; for (const L of lose) for (const p of G.P) if (p.owner === L && win.includes(p.ctrl)) (occ[L] = occ[L] || []).push([p.id, p.ctrl]);
  const _pp = UIH.popup; UIH.popup = p => { if (/^Peace with /.test(p.title || '') && p.options.length >= 4) { const L = lose.find(t => p.title === `Peace with ${cname(t)}`), T = C(G.player), [annexO, puppetO, regimeO, lenientO] = p.options; if (L) { const k = C(L);
      p.options = [annexO, puppetO,
        { name: `Set up a ${COMMISSARIAT[T.tag.slice(0, 3)] ? COMMISSARIAT[T.tag.slice(0, 3)][0] : 'Commissariat'}`, tip: 'Their land becomes a directly ruled subject: the highest yields and the fiercest resistance. Infamy +' + (k.major ? 20 : 8), fn: () => { T.infamy += k.major ? 20 : 8; puppetO.fn(); if (k.exists && k.overlord === T.tag) { k.stype = 'rk'; k.autonomy = 0; k.name = regimeName(T, L, 'rk'); setIdeology(k, T.ideology, true); } } },
        { name: 'Install a collaboration government', tip: 'A native government that answers to us. Infamy +' + (k.major ? 8 : 3), fn: () => { T.infamy += k.major ? 8 : 3; puppetO.fn(); if (k.exists && k.overlord === T.tag) { k.stype = 'collab'; k.legitC = 30; k.autonomy = 25; } } },
        { name: 'Partition: keep what our armies hold', tip: 'Every victor keeps the provinces it occupies; the rest stays independent.', fn: () => { for (const [id, t] of occ[L] || []) if (P(id).owner === L && C(t).exists && P(id).id !== k.capital) transferProv(P(id), t); lenientO.fn(); } },
        { name: 'War reparations', tip: 'They keep their land but pay 15% of their taxes for five years. Relations +10.', fn: () => { lenientO.fn(); if (k.exists) { addSpirit(k, 'war_reparations', 1825); (G.repar = G.repar || []).push({ from: L, to: T.tag, until: G.day + 1825 }); } } },
        { name: 'Demilitarise them', tip: 'Their army is disbanded and kept small for five years.', fn: () => { lenientO.fn(); if (k.exists) { for (const a of armiesOf(L).slice()) disbandArmy(a); addSpirit(k, 'demilitarised', 1825); } } },
        regimeO, lenientO]; } }
    _pp(p); };
  try { _pe(w, winSide); } finally { UIH.popup = _pp; } }; }
{ const _ef = econFinish; econFinish = function (c) { _ef(c); if (!G.repar) return; for (const r of G.repar) if (r.from === c.tag && G.day < r.until && ok(r.to)) { const v = Math.max(0, (c.budget.tax || c.budget.income || 0) * 0.15 / 4); c.money -= v; C(r.to).money += v; } }; }

// China is too big to swallow in a season
SPIRITS.vast_china = ['A Vast Interior', 'China can trade space for time almost without end.', { caplimit: 0.22, def: 0.08, manpower: 0.15 }];
SPIRITS.china_quagmire = ['The China Quagmire', 'A million men are tied down guarding railways in a country that will not surrender.', { supply: -0.1, atk: -0.05, upkeep: 0.06 }];
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { const w = _dw(a, b, ...r); if (w) for (const [x, y] of [[a, b], [b, a]]) if (x.slice(0, 3) === 'CHI' && C(x).exists && y.slice(0, 3) === 'JAP') addSpirit(C(x), 'vast_china'); return w; }; }
{ const _pm2 = politicsMonthly; politicsMonthly = function (c) { _pm2(c); if (c.tag !== 'JAP') return; const n = G.P.filter(p => p.ctrl === 'JAP' && PROV_ISO[p.id] === 'China').length, q = n > 12 && ok('CHI') && atWar('JAP', 'CHI'); if (q && !hasSpirit(c, 'china_quagmire')) addSpirit(c, 'china_quagmire'); else if (!q && hasSpirit(c, 'china_quagmire')) removeSpirit(c, 'china_quagmire'); }; }
// China fights on from the interior: no surrender while the government holds part of it with an army in the field
{ const _cc = checkCapitulation, INTERIOR = ['Chongqing', 'Chengdu', 'Kunming', 'Guiyang', "Xi'an", 'Lanzhou', 'Changsha', 'Nanning'];
  checkCapitulation = function (tag) { if (tag === 'CHI' && C('CHI').exists && sum(armiesOf('CHI'), a => a.divs.length) >= 10 && INTERIOR.some(n => { const p = PN(n); return p && (p.ctrl === 'CHI' || (friendly('CHI', p.ctrl) && !atWar('CHI', p.ctrl))); })) return; return _cc(tag); }; }

// ---------- peace with provisional governments ----------
// one nation, one government: when a nation with a regime set up for it is beaten, its remaining land joins the regime;
// allies hand over the land of that nation they hold, if they are on good terms
function regimeFor(t) { for (const c of alive()) if (c.regimes && c.regimes[t] && ok(c.regimes[t].tag) && C(c.regimes[t].tag).overlord === c.tag) return [c, C(c.regimes[t].tag)]; return null; }
function handOver(from, to, t) { let n = 0; for (const p of G.P) if (p.owner === from.tag && (p.orig === t || (p.cores.includes(t) && !p.cores.includes(from.tag))) && p.id !== from.capital) { p.owner = to.tag; p.ctrl = to.tag; if (to.stype === 'collab' && !p.cores.includes(to.tag)) p.cores.push(to.tag); n++; } return n; }
function uniteUnderRegime(t, quiet) { const r = regimeFor(t); if (!r) return false; const [o, g] = r, L = C(t); let n = 0;
  if (L && L.exists) { for (const p of G.P) if (p.owner === t) { p.owner = g.tag; p.ctrl = g.tag; if (g.stype === 'collab' && !p.cores.includes(g.tag)) p.cores.push(g.tag); n++; } if (L.capital !== undefined && P(L.capital).owner === g.tag) g.capital = L.capital; eliminate(t); }
  for (const a of alive()) if (a.tag !== o.tag && a.tag !== g.tag && friendly(a.tag, o.tag) && a.ai && opinion(a.tag, o.tag) >= 0) n += handOver(a, g, t);
  if (g.stype === 'collab' && L) { g.name = g.name.replace(/^Reorganised National Government of /, '').length > 3 ? g.name : g.name; } if (!quiet) logMsg(`${g.name} now governs all of ${cname(t)} (${n} provinces handed over).`, 'world', [o.tag]); UIH.mapDirty(); return true; }
function occupationZones(win, L) { const k = C(L); if (!k || !k.exists) return; const by = {}; for (const p of G.P) if (p.owner === L && win.includes(p.ctrl)) (by[p.ctrl] = by[p.ctrl] || []).push(p.id);
  for (const t in by) { const W = C(t); if (!W.exists || W.capitulated) continue; createRegime(W, L, 'milgov', { provs: by[t], peace: true, name: `${W.adj} Zone of ${k.name}` }); }
  if (provsOf(L).length) { const rest = provsOf(L); const top = Object.keys(by).sort((a, b) => by[b].length - by[a].length)[0]; if (top) createRegime(C(top), L, 'milgov', { provs: rest.map(p => p.id), peace: true, name: `${C(top).adj} Zone of ${k.name} (II)` }); }
  if (k.exists && !provsOf(L).length) eliminate(L); logMsg(`${k.name} is divided into occupation zones.`, 'world'); }
{ const _pe = peace; peace = function (w, winSide) { const win = w[winSide].slice(), lose = (winSide === 'att' ? w.def : w.att).slice(), zoneSnap = {}; for (const L of lose) zoneSnap[L] = G.P.filter(p => p.owner === L && win.includes(p.ctrl)).map(p => [p.id, p.ctrl]);
  const _pp = UIH.popup; UIH.popup = p => { const L = lose.find(t => p.title === `Peace with ${cname(t)}`); if (L && p.options.length >= 4) { const reg = regimeFor(L), lenient = p.options[p.options.length - 1];
      p.options.splice(2, 0, { name: 'Divide it into occupation zones', tip: 'Every victor governs the part its armies hold as a military zone; the country ceases to exist.', fn: () => { for (const [id, t] of zoneSnap[L]) if (P(id).owner === L) P(id).ctrl = t; occupationZones(win, L); } });
      if (reg) p.options.unshift({ name: `Unite all of ${cname(L)} under the ${reg[1].name}`, tip: 'The rest of the country, and the land our allies hold, passes to the government we set up. No second government survives.', fn: () => uniteUnderRegime(L) }); }
    _pp(p); };
  try { _pe(w, winSide); } finally { UIH.popup = _pp; }
  // AI victors, and players who were not asked: never leave two governments of one nation
  for (const L of lose) { const r = regimeFor(L); if (r && C(L).exists && !(r[0].tag === G.player && !r[0].ai)) uniteUnderRegime(L, false); } }; }
// diplomacy: ask an ally for the land it holds of a nation we govern through a regime
DIPLO.askLand = { name: 'Request Occupied Land', cost: 25, can: (a, b) => friendly(a, b) && !!C(a).regimes && Object.keys(C(a).regimes).some(t => G.P.some(p => (p.owner === b || p.ctrl === b) && (p.orig === t || p.owner === t))), ai: (a, b) => opinion(b, a) >= -10, do: (a, b) => { const A = C(a); let n = 0; for (const t in A.regimes || {}) { const g = C(A.regimes[t].tag); if (!g || !g.exists) continue; n += handOver(C(b), g, t); for (const p of G.P) if (p.owner === t && p.ctrl === b) { p.ctrl = a; n++; } } addRel(b, a, -5); logMsg(`${cname(b)} hands ${n} provinces over to ${C(a).name}'s administration.`, 'info', [a, b]); UIH.mapDirty(); }, tip: 'Ask an ally to hand over the land it holds of a nation we govern through an occupation government. They agree if their opinion of us is above -10.' };
// wartime occupation: allies pass the land they hold to the government set up for that nation; AI powers holding enemy land
// that nobody governs set up their own military zone
{ const _rw = regimesWeekly; regimesWeekly = function () { _rw();
  for (const c of alive()) { if (!c.regimes) continue; for (const e in c.regimes) { const g = C(c.regimes[e].tag); if (!g || !g.exists || !c.regimes[e].auto) continue;
      for (const p of G.P) if (p.owner === e && p.ctrl !== c.tag && p.ctrl !== g.tag && friendly(c.tag, p.ctrl) && C(p.ctrl).ai && opinion(p.ctrl, c.tag) >= 0 && atWar(c.tag, e)) { p.owner = g.tag; p.ctrl = g.tag; if (g.stype === 'collab' && !p.cores.includes(g.tag)) p.cores.push(g.tag); } } }
  if (dateObj(G.day).getUTCDate() !== 1) return;
  for (const c of alive()) { if (!c.ai || !c.major || c.capitulated || c.overlord) continue; for (const e of enemiesOf(c.tag)) { if (regimeFor(e) || /[CKM]\d*$/.test(e.slice(3))) continue; const held = G.P.filter(p => p.owner === e && p.ctrl === c.tag && !p.cores.includes(c.tag) && !p.claims.includes(c.tag));
      if (held.length >= 4 && Math.random() < 0.25) { const capHeld = held.some(p => p.id === C(e).capital), share = held.length / Math.max(1, G.P.filter(p => p.owner === e && p.cores.includes(e)).length); createRegime(c, e, c.ideology === 'fas' && ['SOV', 'POL'].includes(e.slice(0, 3)) ? 'rk' : c.ideology === 'dem' || !(capHeld || share > 0.3) ? 'milgov' : 'collab', { provs: held.map(p => p.id) }); } } } }; }

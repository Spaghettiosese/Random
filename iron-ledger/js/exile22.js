// 2.2 Governments in exile, expeditionary forces and volunteers, and arms designers and licences.
'use strict';
// ======================= governments in exile =======================
// When a nation fighting beside allies capitulates, its government escapes to the strongest ally still fighting. Part of
// its army and fleet escape too and fight on under the host as Free forces. In exile the government keeps a legitimacy
// that the resistance at home and liberated land raise and time erodes; it broadcasts, recruits, charters out its merchant
// fleet and hands over its gold. When its capital is free again it returns, and its Free forces with it.
const exiles = () => G.exiles || (G.exiles = {});
function exileHostFor(tag) { const en = enemiesOf(tag); return alive().filter(o => o.tag !== tag && !o.capitulated && friendly(tag, o.tag) && en.some(e => atWar(o.tag, e)) && G.P.some(p => p.ctrl === o.tag)).sort((a, b) => (b.major - a.major) || countryStr(b.tag) - countryStr(a.tag))[0]; }
{ const _cap = capitulate; capitulate = function (tag) { const c = C(tag); let ex = null;
  if (c && !c.capitulated && !c.overlord && !c.collabOf && !/\d$/.test(tag) && isAtWar(tag) && !G.wars.some(w => w.civil && (w.att.includes(tag) || w.def.includes(tag)))) { const h = exileHostFor(tag); if (h) ex = { host: h.tag, divs: sum(armiesOf(tag), a => a.divs.length), ships: c.stock.ships || 0 }; }
  _cap(tag); if (ex) formExile(c, ex); }; }
function formExile(c, ex) { const h = C(ex.host), evac = ex.divs ? clamp(Math.round(ex.divs * 0.15), 1, 8) : 0;
  if (evac) { const a = newArmy(h, h.capital); a.name = `Free ${c.adj} Forces`; a.exileOf = c.tag; a.auto = true; for (let i = 0; i < evac; i++) a.divs.push({ t: 'inf', str: 0.7, org: 0.6, xp: 0.2 }); }
  h.stock.ships = (h.stock.ships || 0) + ex.ships * 0.4;
  exiles()[c.tag] = { host: ex.host, legit: c.ideology === 'dem' ? 65 : 50, funds: 20, since: G.day, raised: evac, fleet: false, gold: false };
  logMsg(`The ${c.adj} government escapes to ${h.name} and fights on in exile${evac ? `, with ${evac} division${evac > 1 ? 's' : ''} and part of the fleet` : ''}.`, 'world', [c.tag, ex.host]);
  if (c.tag === G.player) UIH.popup({ title: 'The Government in Exile', icon: '🏛', desc: `Our country is occupied, but the government has escaped to ${h.name}. ${evac} division${evac === 1 ? '' : 's'} came with us and fight on beside our hosts as Free ${c.adj} Forces. From the Nation tab we can broadcast to the resistance at home, raise new units, charter our merchant ships and hand over our gold. When our capital is liberated, we go home.`, options: [{ name: 'We fight on.' }] }); }
const EXILE_ACT = { broadcast: ['Broadcast to the Nation', 6, 'The nightly broadcast from abroad: resistance at home +8, legitimacy +2.'], raise: ['Raise Free Forces', 12, 'Refugees, escaped soldiers and colonial volunteers form a new division under our host.'],
  recognise: ['Seek Recognition', 8, 'Envoys to every allied capital: legitimacy +6, relations with our hosts\' allies +10.'], fleet: ['Charter the Merchant Fleet', 0, 'Our merchant ships sail for our hosts: their trade and shipping grow; we earn funds every month.'], gold: ['Hand Over the Gold', 0, 'The national gold reserve, saved from the invader, to our hosts: their treasury grows; legitimacy +4.'] };
function exileAct(c, a) { const ex = exiles()[c.tag], d = EXILE_ACT[a]; if (!ex) return 'We are not in exile'; const h = C(ex.host); if (!h || !h.exists) return 'Our host is gone';
  if (d[1] && ex.funds < d[1]) return `Needs ${d[1]} exile funds`; if (a === 'fleet' && ex.fleet) return 'Already chartered'; if (a === 'gold' && ex.gold) return 'Already handed over'; ex.funds -= d[1];
  if (a === 'broadcast') { const r = (G.res = G.res || {})[c.tag] || (G.res[c.tag] = { str: 0, com: 0.3, sup: {}, rep: 0 }); r.str = Math.min(100, r.str + 8); ex.legit = Math.min(100, ex.legit + 2); }
  else if (a === 'raise') { const n = armiesOf(h.tag).find(x => x.exileOf === c.tag) || Object.assign(newArmy(h, h.capital), { name: `Free ${c.adj} Forces`, exileOf: c.tag, auto: true }); n.divs.push({ t: 'inf', str: 0.6, org: 0.5, xp: 0.1 }); ex.raised++; }
  else if (a === 'recognise') { ex.legit = Math.min(100, ex.legit + 6); for (const k of alive()) if (friendly(k.tag, h.tag)) addRel(k.tag, c.tag, 10); }
  else if (a === 'fleet') { ex.fleet = true; if (typeof seaOf === 'function') { const s = seaOf(c), hs = seaOf(h); hs.ton += s.ton * 0.7; hs.ton0 += s.ton * 0.7; s.ton *= 0.3; } addRel(h.tag, c.tag, 15); }
  else if (a === 'gold') { ex.gold = true; h.money += 20 * Math.max(200, (c.budget && c.budget.income) || 200); ex.legit = Math.min(100, ex.legit + 4); addRel(h.tag, c.tag, 20); } return ''; }
function exileMonthly() { const E = exiles();
  for (const t of Object.keys(E)) { const ex = E[t], X = C(t); if (!X || !X.exists || !X.capitulated) { delete E[t]; continue; }
    let h = C(ex.host); if (!h || !h.exists || h.capitulated) { const nh = exileHostFor(t); if (!nh) { logMsg(`The ${X.adj} government in exile is dissolved.`, 'world', [t]); delete E[t]; continue; } ex.host = nh.tag; h = nh; logMsg(`The ${X.adj} government in exile moves to ${nh.name}.`, 'world', [t]); }
    const core = G.P.filter(p => p.owner === t && p.cores.includes(t)), freeV = sum(core, p => p.ctrl === t || (friendly(ex.host, p.ctrl) && !atWar(t, p.ctrl)) ? p.vp : 0), totV = sum(core, p => p.vp) || 1, r = G.res && G.res[t];
    ex.legit = clamp(ex.legit - 0.3 + (r ? r.str / 150 : 0) + freeV / totV * 3, 0, 100); ex.funds += 2 + ex.legit / 25 + (ex.fleet ? 2 : 0);
    const cap = P(X.capital), near = cap ? [cap.id, ...NB[cap.id].filter(e => !e.sea).map(e => e.to)] : [], near2 = [...new Set(near.flatMap(id => [id, ...NB[id].filter(e => !e.sea).map(e => e.to)]))], safe = cap && !near2.some(id => armiesAt(id).some(x => atWar(t, x.owner) || atWar(ex.host, x.owner)));
    if (cap && isAtWar(t) && G.day - ex.since > 90 && freeV / totV >= 0.75 && safe && (cap.ctrl === t || (friendly(ex.host, cap.ctrl) && !atWar(t, cap.ctrl)))) { exileReturn(t); continue; }
    if (X.ai || t !== G.player) { if (ex.funds >= 6 && r) exileAct(X, 'broadcast'); if (ex.funds >= 12 && ex.legit > 40) exileAct(X, 'raise'); if (!ex.fleet) exileAct(X, 'fleet'); if (!ex.gold && G.day - ex.since > 60) exileAct(X, 'gold'); } } }
function exileReturn(t) { const ex = exiles()[t], X = C(t); X.capitulated = false;
  for (const p of G.P) if (p.owner === t && p.ctrl !== t && !atWar(t, p.ctrl) && (friendly(ex.host, p.ctrl) || p.ctrl === ex.host)) p.ctrl = t;
  for (const a of Object.values(G.armies)) if (a.exileOf === t) { a.owner = t; a.name = `${X.adj} Liberation Army`; delete a.exileOf; }
  X.stab = Math.round(30 + ex.legit / 2); X.ws = Math.max(X.ws, 50); G._wc = null;
  const r = G.res && G.res[t]; if (ex.legit < 30 && r && r.com > 0.6 && X.ideology !== 'com') { setIdeology(X, 'com', true); logMsg(`The ${X.adj} resistance, not the government in exile, takes power in the liberated capital.`, 'world', [t]); }
  else logMsg(`The ${X.adj} government returns from exile to a liberated capital.`, 'world', [t, ex.host]);
  if (t === G.player) UIH.popup({ title: 'Home Again', icon: '🏛', desc: `Our capital is free. The government has returned after ${Math.round((G.day - ex.since) / 30)} months in exile, and the Free ${X.adj} Forces come home with it.`, options: [{ name: 'Long live the nation!' }] });
  delete exiles()[t]; UIH.mapDirty(); }
// ======================= expeditionary forces and volunteers =======================
// An army can be lent to an ally fighting a common enemy (an expeditionary force) or, if we are at peace with its
// enemies, to a nation at war (volunteers, at most three divisions). It fights under their command; we keep the
// friendship and the experience, and can recall it at any time; it comes home when the war ends.
const expTargets = c => alive().filter(k => k.tag !== c.tag && !k.capitulated && isAtWar(k.tag) && !atWar(c.tag, k.tag) && (friendly(c.tag, k.tag) || opinion(k.tag, c.tag) > 10) && G.P.some(p => p.ctrl === k.tag));
function expKind(c, to) { return enemiesOf(to).some(e => atWar(c.tag, e)) ? 'exp' : enemiesOf(to).every(e => !atWar(c.tag, e)) ? 'vol' : null; }
function sendExpedition(c, a, to) { const k = C(to); if (!a || a.owner !== c.tag || a.battle || a.inv) return 'That army cannot be sent now'; if (!k || !expTargets(c).includes(k)) return 'They cannot receive our troops';
  const kind = expKind(c, to); if (!kind) return 'Not possible'; if (kind === 'vol' && a.divs.length > 3) return 'Volunteer corps are limited to three divisions';
  if (sum(armiesOf(c.tag).filter(x => !x.expFrom), x => x.divs.length) - a.divs.length < 2) return 'We must keep at least two divisions at home';
  a.expFrom = c.tag; a.expKind = kind; a.owner = to; a.auto = true; a.path = []; a.loc = k.capital; a.name = kind === 'vol' ? `${c.adj} Volunteer Legion` : `${c.adj} Expeditionary Force`; a.gen = null;
  if (kind === 'vol') { G.tension = Math.min(100, G.tension + 1); for (const e of enemiesOf(to)) addRel(e, c.tag, -15); }
  logMsg(`${c.name} sends ${a.divs.length} division${a.divs.length > 1 ? 's' : ''} ${kind === 'vol' ? 'of volunteers' : 'as an expeditionary force'} to ${k.name}.`, 'world', [c.tag, to]); return ''; }
function recallExpedition(a) { const c = C(a.expFrom); if (!c || !c.exists) { delete a.expFrom; return; } a.owner = c.tag; a.loc = c.capital; a.path = []; a.name = `${c.adj} ${a.expKind === 'vol' ? 'Volunteers, returned' : 'Veterans'}`; delete a.expFrom; delete a.expKind; if (a.battle) leaveBattle(a); }
function expMonthly() { for (const a of Object.values(G.armies)) { if (!a.expFrom) continue; const c = C(a.expFrom), k = C(a.owner);
    if (!c || !c.exists || c.capitulated || !k || !k.exists || k.capitulated || !isAtWar(k.tag) || atWar(c.tag, k.tag)) { recallExpedition(a); continue; }
    addRel(k.tag, c.tag, 2); c.axp = (c.axp || 0) + a.divs.length * 0.3; }
  for (const c of alive()) { if (!c.ai || c.capitulated || !isAtWar(c.tag) || c.major || Math.random() > 0.06) continue; const f = factionOf(c.tag); if (!f || f.leader === c.tag) continue;
    const threatened = G.P.some(p => p.ctrl === c.tag && NB[p.id].some(e => !e.sea && atWar(c.tag, P(e.to).ctrl))); if (threatened) continue;
    const tot = sum(armiesOf(c.tag), x => x.divs.length), a = armiesOf(c.tag).filter(x => !x.battle && !x.inv && !x.expFrom && x.divs.length >= 2 && x.divs.length <= Math.max(2, tot * 0.34)).sort((x, y) => y.divs.length - x.divs.length)[0]; if (a && expTargets(c).some(k => k.tag === f.leader)) sendExpedition(c, a, f.leader); } }
// ======================= arms designers and licences =======================
const FIRMS = {
  GER: { land: [['Krupp', { atk: 0.03, def: 0.02 }], ['Rheinmetall-Borsig', { mil_out: 0.05 }]], armour: [['Daimler-Benz', { atk: 0.05 }], ['Henschel', { def: 0.03, org: 0.03 }]], air: [['Messerschmitt', { air: 0.08 }], ['Junkers', { bombing: 0.1, air: 0.03 }]], naval: [['Blohm & Voss', { navy: 0.08 }], ['Germaniawerft', { navy: 0.05, supply: 0.02 }]] },
  ENG: { land: [['Vickers-Armstrongs', { atk: 0.03, def: 0.03 }], ['Royal Ordnance', { mil_out: 0.05 }]], armour: [['Vauxhall', { def: 0.04 }], ['Nuffield', { atk: 0.04 }]], air: [['Supermarine', { air: 0.08 }], ['Avro', { bombing: 0.12 }]], naval: [['Harland & Wolff', { navy: 0.08 }], ['Vickers Shipbuilding', { navy: 0.06 }]] },
  USA: { land: [['Springfield Armory', { atk: 0.03, def: 0.03 }], ['General Motors', { mil_out: 0.06 }]], armour: [['Chrysler', { mil_out: 0.04, atk: 0.02 }], ['Ford', { mil_out: 0.05 }]], air: [['Boeing', { bombing: 0.12 }], ['North American Aviation', { air: 0.08 }]], naval: [['Newport News', { navy: 0.08 }], ['Electric Boat', { navy: 0.06 }]] },
  SOV: { land: [['Tula Arsenal', { def: 0.04 }], ['Grabin Bureau', { atk: 0.04 }]], armour: [['Kharkov Plant', { atk: 0.05 }], ['Kirov Plant', { def: 0.04, org: 0.02 }]], air: [['Tupolev', { bombing: 0.1 }], ['Ilyushin', { atk: 0.03, air: 0.04 }]], naval: [['Baltic Yard', { navy: 0.06 }]] },
  FRA: { land: [['Schneider-Creusot', { atk: 0.02, def: 0.04 }], ['MAS Saint-Étienne', { mil_out: 0.04 }]], armour: [['Renault', { def: 0.04 }], ['Somua', { atk: 0.04 }]], air: [['Dewoitine', { air: 0.07 }], ['Bloch', { bombing: 0.08 }]], naval: [['Chantiers de Penhoët', { navy: 0.07 }]] },
  ITA: { land: [['Ansaldo', { atk: 0.03 }], ['Breda', { def: 0.03 }]], armour: [['Fiat-Ansaldo', { atk: 0.04 }]], air: [['Macchi', { air: 0.07 }], ['Savoia-Marchetti', { bombing: 0.08 }]], naval: [['OTO', { navy: 0.07 }], ['CRDA', { navy: 0.05 }]] },
  JAP: { land: [['Kokura Arsenal', { atk: 0.03, def: 0.02 }]], armour: [['Mitsubishi Heavy Industries', { atk: 0.04 }]], air: [['Mitsubishi', { air: 0.08 }], ['Nakajima', { air: 0.06, bombing: 0.04 }]], naval: [['Kure Naval Arsenal', { navy: 0.09 }], ['Kawasaki', { navy: 0.06 }]] },
  CZE: { land: [['Škoda', { atk: 0.04, def: 0.02 }]], armour: [['ČKD', { atk: 0.04 }]] }, SWE: { land: [['Bofors', { def: 0.05 }]], air: [['Saab', { air: 0.05 }]] }, SWI: { land: [['Oerlikon', { def: 0.04 }]] },
  BEL: { land: [['FN Herstal', { mil_out: 0.04 }]] }, HOL: { air: [['Fokker', { air: 0.05 }]] }, POL: { air: [['PZL', { air: 0.05 }]] }, HUN: { land: [['Weiss Manfréd', { mil_out: 0.04 }]] }
};
const FIRM_CAT = { land: 'Infantry and artillery', armour: 'Armour', air: 'Aircraft', naval: 'Warships' };
const firmSlug = (t, n) => 'fm_' + t + '_' + n.toLowerCase().replace(/[^a-z]+/g, '_');
for (const t in FIRMS) for (const cat in FIRMS[t]) for (const [n, m] of FIRMS[t][cat]) { SPIRITS[firmSlug(t, n)] = [`${n}`, `${FIRM_CAT[cat]} designed by ${n}.`, m]; SPIRITS[firmSlug(t, n) + '_lic'] = [`${n} (licence)`, `${FIRM_CAT[cat]} built under licence from ${n}.`, Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v / 2]))]; }
const firmsOf = c => c.firms || (c.firms = {});
function firmChoices(c, cat) { const own = ((FIRMS[c.tag] || {})[cat] || []).map(f => ({ t: c.tag, n: f[0], m: f[1], lic: false })); const lic = []; for (const t in FIRMS) if (t !== c.tag && ok(t)) for (const f of (FIRMS[t][cat] || [])) lic.push({ t, n: f[0], m: f[1], lic: true }); return own.concat(lic); }
function hireFirm(c, cat, t, n) { const f = firmChoices(c, cat).find(x => x.t === t && x.n === n); if (!f) return 'Unknown firm'; const F = firmsOf(c);
  if (f.lic) { const cost = 8 * Math.max(200, (c.budget && c.budget.income) || 200); if (atWar(c.tag, t)) return 'We are at war with them'; if (opinion(t, c.tag) < 10) return `${cname(t)} will not sell us a licence (opinion 10 needed)`; if (c.money < cost) return `A licence costs ${fmt(cost)}`; c.money -= cost; C(t).money += cost * 0.5; }
  else { if (c.pp < 50) return 'Needs 50 political power'; c.pp -= 50; }
  if (F[cat]) removeSpirit(c, F[cat]); F[cat] = firmSlug(t, n) + (f.lic ? '_lic' : ''); addSpirit(c, F[cat]); return ''; }
function aiFirms(c) { const F = firmsOf(c); for (const cat in FIRM_CAT) { if (F[cat]) continue; const ch = firmChoices(c, cat); const own = ch.find(x => !x.lic); if (own) { if (c.pp >= 80) hireFirm(c, cat, own.t, own.n); continue; }
    if (cat === 'land' && c.money > 20 * Math.max(200, (c.budget && c.budget.income) || 200)) { const lic = ch.filter(x => x.lic && opinion(x.t, c.tag) >= 10 && !atWar(c.tag, x.t)).sort((a, b) => opinion(b.t, c.tag) - opinion(a.t, c.tag))[0]; if (lic) hireFirm(c, cat, lic.t, lic.n); } } }
// ---------- hooks ----------
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); exileMonthly(); expMonthly(); }; }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.ai && c.exists && !c.capitulated && Math.random() < 0.25) aiFirms(c); }; }

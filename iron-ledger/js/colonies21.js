// 2.1 Colonies. The provinces a colonial power rules outside its homeland are grouped into colonies, each with its own
// nationalism, development and administration. Colonies pay, levy troops and supply resources; nationalism grows with
// education, harsh rule and the empire's defeats, and at the end of the road a colony rises for its independence, unless
// it has been given self-government in time. Enemies can stir it up.
'use strict';
const COL_REGION = { Senegal: 'French West Africa', Mali: 'French West Africa', Mauritania: 'French West Africa', Niger: 'French West Africa', Guinea: 'French West Africa', "Côte d'Ivoire": 'French West Africa', 'Burkina Faso': 'French West Africa', Benin: 'French West Africa', Togo: 'French West Africa',
  Congo: 'French Equatorial Africa', Gabon: 'French Equatorial Africa', Chad: 'French Equatorial Africa', 'Central African Rep.': 'French Equatorial Africa', Cameroon: 'French Equatorial Africa',
  Vietnam: 'Indochina', Laos: 'Indochina', Cambodia: 'Indochina', Kenya: 'British East Africa', Uganda: 'British East Africa', Tanzania: 'British East Africa', Zambia: 'The Rhodesias', Zimbabwe: 'The Rhodesias', Malawi: 'The Rhodesias',
  Malaysia: 'British Malaya', Singapore: 'British Malaya', Brunei: 'British Malaya', Kuwait: 'The Gulf', Bahrain: 'The Gulf', Qatar: 'The Gulf', 'United Arab Emirates': 'The Gulf', Oman: 'The Gulf', Yemen: 'Aden',
  Syria: 'The Levant', Lebanon: 'The Levant', Israel: 'Palestine', Palestine: 'Palestine', Jordan: 'Palestine', Sudan: 'Sudan', 'S. Sudan': 'Sudan', Jamaica: 'The West Indies', Bahamas: 'The West Indies', 'Trinidad and Tobago': 'The West Indies', Belize: 'The West Indies', Guyana: 'The West Indies',
  Botswana: 'The High Commission Territories', Lesotho: 'The High Commission Territories', eSwatini: 'The High Commission Territories', 'South Korea': 'Korea', 'North Korea': 'Korea', Indonesia: 'The East Indies', 'Solomon Is.': 'The Pacific Islands', Vanuatu: 'The Pacific Islands', Fiji: 'The Pacific Islands', 'New Caledonia': 'The Pacific Islands',
  Rwanda: 'Ruanda-Urundi', Burundi: 'Ruanda-Urundi', 'Dem. Rep. Congo': 'The Belgian Congo', Somaliland: 'Somaliland', Somalia: 'Somalia', Myanmar: 'Burma', 'Sri Lanka': 'Ceylon', 'N. Cyprus': 'Cyprus', Gambia: 'The Gambia', 'W. Sahara': 'Spanish Sahara', 'Eq. Guinea': 'Spanish Guinea' };
const COL_SKIP = new Set(['France', 'Turkey', 'China', 'Falkland Is.']);
const COL_NAT0 = { Indochina: 38, 'The East Indies': 42, Korea: 48, Burma: 45, Algeria: 30, Morocco: 32, Tunisia: 35, 'The Levant': 52, Palestine: 48, Libya: 35, Cyprus: 30, Ceylon: 32, 'British Malaya': 20, Sudan: 25, 'Hong Kong': 15, Malta: 15, 'The Gulf': 10, 'The Pacific Islands': 5 };
const COL_ADM = { direct: ['Direct Rule', 'Governors and a separate law for natives. Full taxes; nationalism grows.', { tax: 1.2, nat: 0.25 }], indirect: ['Indirect Rule', 'Rule through chiefs, sultans and princes. Lower taxes; nationalism grows slowly.', { tax: 0.8, nat: -0.1 }],
  settler: ['Settler Colony', 'Land for settlers from home: manpower and loyal militia, deep native resentment.', { tax: 1, nat: 0.4, mp: 1 }], develop: ['Development', 'Schools, roads and clinics: development grows by itself; nationalism grows with education.', { tax: 0.7, nat: 0.12, dev: 1 }] };
let COL_UNIT = null;
const colUnit = p => { if (!COL_UNIT) COL_UNIT = PROV_RAW.trim().split('\n').map(l => l.split('|')[1]); return COL_UNIT[p.id]; };
const isColonyProv = p => COLONIAL.includes(p.owner) && !p.cores.includes(p.owner) && !COL_SKIP.has(colUnit(p)) && C(p.owner);
const colRegion = p => COL_REGION[colUnit(p)] || colUnit(p);
function coloniesOf(tag) { const out = {}; for (const p of G.P) if (p.owner === tag && isColonyProv(p)) { const r = colRegion(p), k = tag + ':' + r; (out[k] = out[k] || { key: k, region: r, owner: tag, provs: [] }).provs.push(p); } return Object.values(out); }
function colState(k) { G.col = G.col || {}; if (!G.col[k]) { const r = k.split(':')[1], o = C(k.split(':')[0]); G.col[k] = { nat: COL_NAT0[r] !== undefined ? COL_NAT0[r] : 15, dev: 1, adm: o && o.ideology === 'fas' ? 'direct' : ['ENG', 'HOL'].includes(o && o.tag) ? 'indirect' : 'direct', agit: 0 }; } return G.col[k]; }
// ---------- monthly ----------
function colMonthly(c) { const cols = coloniesOf(c.tag); if (!cols.length) { c.colIncome = 0; return; } let inc = 0; const gar = {}; for (const a of armiesOf(c.tag)) gar[a.loc] = (gar[a.loc] || 0) + a.divs.length;
  for (const col of cols) { const s = colState(col.key), A = COL_ADM[s.adm] || COL_ADM.direct, pop = sum(col.provs, p => p.pop), lawN = c.laws.colonial === 'exploit' ? 0.15 : c.laws.colonial === 'selfrule' ? -0.25 : 0;
    const losing = isAtWar(c.tag) && (c.warExh > 40 || capInfo(c.tag).prog > 0.25), troops = Math.min(0.6, sum(col.provs, p => gar[p.id] || 0) * 0.15);
    s.nat = clamp(s.nat + (0.25 + s.dev * 0.08 + A[2].nat + lawN + (losing ? 0.6 : 0) + s.agit / 10 - troops) * (s.rep > G.day ? 1.5 : 1), 0, 100); s.agit = Math.max(0, s.agit - 1);
    if (A[2].dev && s.dev < 5) s.dev = Math.min(5, s.dev + 0.03);
    const v = pop * 0.03 * (1 + s.dev * 0.25) * A[2].tax * (1 - s.nat / 150); inc += v; if (A[2].mp) c.manpower += pop * 0.0002;
    for (const p of col.provs) if (s.nat > 50) p.unrest = Math.max(p.unrest || 0, (s.nat - 50) * 1.2);
    if (s.nat >= 75 && Math.random() < 0.1) { c.stab = Math.max(0, c.stab - 1); if (c.tag === G.player) UIH.notify(`Strikes and demonstrations in ${col.region}: nationalism is at ${Math.round(s.nat)}.`, 'bad'); }
    if (s.nat >= 90 && (isAtWar(c.tag) || c.capitulated || c.stab < 35) && Math.random() < 0.15) colRevolt(c, col, s); }
  c.money += inc; c.colIncome = inc; if (c.ai) aiColonies(c, cols); }
function colRevolt(c, col, s) { const asia = ['Indochina', 'Korea', 'The East Indies', 'Burma', 'British Malaya'].includes(col.region), ideo = asia && Math.random() < 0.5 ? 'com' : Math.random() < 0.6 ? 'dem' : 'aut';
  const r = secede(c, col.provs.map(p => p.name), col.region.replace(/^The /, ''), ideo, `hsl(${(col.region.length * 47) % 360},45%,45%)`, true); if (!r) return; for (const p of col.provs) if (p.owner === r.tag && !p.cores.includes(r.tag)) p.cores.push(r.tag);
  delete G.col[col.key]; logMsg(`${col.region} rises against ${c.name} and declares its independence!`, 'world', [c.tag]); }
function colGrant(c, col) { const r = secede(c, col.provs.map(p => p.name), col.region.replace(/^The /, ''), c.ideology === 'com' ? 'com' : 'dem', `hsl(${(col.region.length * 47) % 360},40%,50%)`, false); if (!r) return 'Nothing to release';
  makeSubject(c.tag, r.tag); r.stype = 'dominion'; r.autonomy = 70; delete G.col[col.key]; c.infl += 20; c.legitBonus = (c.legitBonus || 0) + 2; for (const k of coloniesOf(c.tag)) colState(k.key).nat = Math.max(0, colState(k.key).nat - 5);
  logMsg(`${c.name} grants self-government to ${col.region}, which becomes a dominion.`, 'world', [c.tag]); return ''; }
const COL_ACT = {
  invest: ['Invest', 'money', 'Roads, ports and schools: development +1 (output and taxes rise; so, slowly, does nationalism). Costs six weeks of income.'],
  troops: ['Raise Colonial Troops', 'pp', 'Two infantry divisions raised in the colony (30 political power). Nationalism +5. Once every six months.'],
  reform: ['Reforms', 'pp', 'Native councils, a voice in the budget: nationalism -15 (40 political power). Once a year.'],
  repress: ['Repression', 'pp', 'Arrest the nationalist leaders: nationalism -8 now, but it grows half again as fast for a year (20 political power). Infamy +1.'],
  grant: ['Grant Self-Government', null, 'The colony becomes a self-governing dominion under our crown: loyal, paying a little tribute, never to rise against us. Influence +20; nationalism in other colonies -5.'],
  stir: ['Stir Up Revolt', 'infl', 'Agents, money and broadcasts: nationalism in their colony grows faster for months (25 influence).']
};
function colAct(c, key, a) { const [tag, region] = key.split(':'), col = coloniesOf(tag).find(x => x.key === key), s = col && colState(key); if (!col) return 'No such colony'; const mine = tag === c.tag;
  if (a === 'stir') { if (mine) return 'Our own colony?'; if (c.infl < 25) return 'Needs 25 influence'; if (!atWar(c.tag, tag) && opinion(c.tag, tag) > -20) return 'Only against an enemy or a rival'; c.infl -= 25; s.agit = Math.min(30, s.agit + 10); addRel(tag, c.tag, -10); return ''; }
  if (!mine) return 'Not our colony';
  if (a === 'invest') { const cost = 6 * Math.max(200, c.budget.income || 200); if (c.money < cost) return 'Not enough money'; if (s.dev >= 5) return 'Already fully developed'; c.money -= cost; s.dev = Math.min(5, s.dev + 1); freeBuild(c, 'railway', 1, col.provs.slice().sort((x, y) => y.pop - x.pop)[0].id); return ''; }
  if (a === 'troops') { if (c.pp < 30) return 'Needs 30 political power'; if (s.lev && G.day - s.lev < 180) return `Again in ${180 - (G.day - s.lev)} days`; const host = col.provs.filter(p => p.ctrl === c.tag).sort((x, y) => y.pop - x.pop)[0]; if (!host) return 'We control none of it'; c.pp -= 30; spawnDivisions(c, 'inf', 2, host.id); s.lev = G.day; s.nat = Math.min(100, s.nat + 5); return ''; }
  if (a === 'reform') { if (c.pp < 40) return 'Needs 40 political power'; if (s.ref && G.day - s.ref < 365) return `Again in ${365 - (G.day - s.ref)} days`; c.pp -= 40; s.nat = Math.max(0, s.nat - 15); s.ref = G.day; return ''; }
  if (a === 'repress') { if (c.pp < 20) return 'Needs 20 political power'; c.pp -= 20; s.nat = Math.max(0, s.nat - 8); s.rep = G.day + 365; c.infamy += 1; return ''; }
  if (a === 'grant') return colGrant(c, col); return 'Unknown'; }
function setColAdm(c, key, v) { const s = colState(key); if (!COL_ADM[v] || s.adm === v) return ''; if (c.pp < 15) return 'Changing a colony\'s administration costs 15 political power'; c.pp -= 15; s.adm = v; return ''; }
function aiColonies(c, cols) { for (const col of cols) { const s = colState(col.key);
    if (s.nat > 70) { if (c.ideology === 'fas') colAct(c, col.key, 'repress'); else if (c.ideology === 'dem' && s.nat > 85 && !isAtWar(c.tag) && Math.random() < 0.3) colAct(c, col.key, 'grant'); else colAct(c, col.key, 'reform'); }
    if (isAtWar(c.tag) && Math.random() < 0.15) colAct(c, col.key, 'troops'); if (Math.random() < 0.04 && c.money > 30 * Math.max(200, c.budget.income || 200)) colAct(c, col.key, 'invest'); }
  if (isAtWar(c.tag) && c.infl > 50 && Math.random() < 0.1) for (const e of enemiesOf(c.tag)) { const ec = coloniesOf(e).sort((a, b) => colState(b.key).nat - colState(a.key).nat)[0]; if (ec) { colAct(c, ec.key, 'stir'); break; } } }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.exists && COLONIAL.includes(c.tag)) colMonthly(c); else if (c.ai && c.exists && isAtWar(c.tag) && c.infl > 60 && Math.random() < 0.05) aiColonies(c, []); }; }
// a defeated empire's colonies sense their chance
{ const _cap = capitulate; capitulate = function (tag) { _cap(tag); if (COLONIAL.includes(tag)) for (const col of coloniesOf(tag)) { const s = colState(col.key); s.nat = Math.min(100, s.nat + 15); } }; }

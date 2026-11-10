// Core state, helpers, modifiers and the effect language shared by focuses, decisions and events.
'use strict';
let G = null;
const NB = [];        // province neighbours: [{to, sea}]
const PNAME = {};     // province name -> id
const UIH = { notify() { }, popup() { }, refresh() { }, mapDirty() { } }; // UI hooks (replaced by the UI layer)
const rnd = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const sum = (arr, f) => { let s = 0; for (const x of arr) s += f ? f(x) : x; return s; };
const C = t => G.C[t];
const P = id => G.P[id];
const PN = n => { if (PNAME[n] === undefined) throw new Error('Unknown province ' + n); return G.P[PNAME[n]]; };
const DAY0 = Date.UTC(START_YEAR, 0, 1);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateObj = d => new Date(DAY0 + d * 864e5);
const dateStr = d => { const t = dateObj(d === undefined ? G.day : d); return t.getUTCDate() + ' ' + MONTHS[t.getUTCMonth()] + ' ' + t.getUTCFullYear(); };
const dayOf = (y, m, d) => Math.round((Date.UTC(y, m - 1, d) - DAY0) / 864e5);
const year = () => dateObj(G.day).getUTCFullYear();
const fmt = n => { const a = Math.abs(n); return a >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : a >= 1e6 ? (n / 1e6).toFixed(a >= 1e7 ? 1 : 2) + 'M' : a >= 1e4 ? (n / 1e3).toFixed(a >= 1e5 ? 0 : 1) + 'K' : a >= 100 ? Math.round(n) + '' : a >= 10 ? n.toFixed(1).replace(/\.0$/, '') : n.toFixed(2).replace(/\.?0+$/, ''); };
const pct = (x, d = 0) => (x >= 0 ? '+' : '') + (x * 100).toFixed(d) + '%';
const alive = () => Object.values(G.C).filter(c => c.exists);
const provsOf = t => G.P.filter(p => p.owner === t);
const heldBy = t => G.P.filter(p => p.owner === t && p.ctrl === t);

function initStatic() {
  if (NB.length) return;
  MAP.P.forEach((_, i) => NB.push([]));
  MAP.adj.forEach(([a, b]) => { NB[a].push({ to: b, sea: 0 }); NB[b].push({ to: a, sea: 0 }); });
  MAP.sea.forEach(([a, b, d]) => { NB[a].push({ to: b, sea: d }); NB[b].push({ to: a, sea: d }); });
  PROV_RAW.trim().split('\n').forEach((l, i) => PNAME[l.split('|')[0]] = i);
}

// ---------- modifiers ----------
function dirty(c) { c._m = null; }
function M(c, key) {
  if (!c._m) {
    const m = {}; const add = e => { for (const k in e) m[k] = (m[k] || 0) + e[k]; };
    for (const cat in LAWS) { const l = LAWS[cat].laws[c.laws[cat]]; if (l) add(l[1]); }
    for (const t in c.techs) if (TECHS[t]) add(TECHS[t][3]);
    for (const s of c.spirits) add(s.eff || {});
    c._m = m;
  }
  return c._m[key] || 0;
}
function addSpirit(c, id, days) {
  const d = SPIRITS[id]; if (!d) throw new Error('Unknown spirit ' + id);
  removeSpirit(c, id); c.spirits.push({ id, name: d[0], desc: d[1], eff: d[2], until: days ? G.day + days : 0 }); dirty(c);
}
function removeSpirit(c, id) { const n = c.spirits.length; c.spirits = c.spirits.filter(s => s.id !== id); if (c.spirits.length !== n) dirty(c); }
const hasSpirit = (c, id) => c.spirits.some(s => s.id === id);
const MOD_NAME = { pp: 'Political power/day', stab: 'Stability', ws: 'War support', tax: 'Tax efficiency', build: 'Construction speed', output: 'Industrial output', mil_out: 'War industry output', res_out: 'Extraction output', farm_out: 'Farm output', research: 'Research speed', atk: 'Army attack', def: 'Army defence', org: 'Organisation', train: 'Training speed', manpower: 'Manpower', conscr: 'Conscriptable population', supply: 'Supply', air: 'Air power', navy: 'Naval power', tradecap: 'Trade openness', legit: 'Legitimacy', rad: 'Radicalism', needs: 'Consumer demand', infl: 'Influence gain', invest: 'Private investment', literacy: 'Literacy growth', tank: 'Armour effectiveness', entrench: 'Entrenchment', upkeep: 'Army upkeep', caplimit: 'Will to fight on', proj: 'Special project speed', welfare: 'Welfare spending', infra: 'Infrastructure', bombing: 'Strategic bombing', cas: 'Close air support', civdef: 'Bombing protection', drift_dem: 'Democratic drift', drift_fas: 'Fascist drift', drift_com: 'Communist drift', drift_aut: 'Authoritarian drift', sway: 'Diplomatic sway', growth: 'Population growth', infamy: 'Infamy from aggression' };
const MOD_ABS = { pp: 1, stab: 1, ws: 1, legit: 1, welfare: 1, drift_dem: 1, drift_fas: 1, drift_com: 1, drift_aut: 1 };
const MOD_BAD = { rad: 1, upkeep: 1, needs: 0, infamy: 1 };
function modText(eff) {
  return Object.keys(eff).map(k => { const v = eff[k], good = MOD_BAD[k] ? v < 0 : v > 0; const val = k === 'conscr' ? (v * 100).toFixed(1) + '%' : MOD_ABS[k] ? (v > 0 ? '+' : '') + (+v.toFixed(2)) : pct(v);
    return `<span class="${good ? 'pos' : 'neg'}">${MOD_NAME[k] || k}: ${val}</span>`; }).join('<br>');
}

// ---------- log ----------
function logMsg(text, kind = 'info', tags = []) {
  G.log.push({ d: G.day, text, kind }); if (G.log.length > 250) G.log.shift();
  if (kind === 'world' || tags.includes(G.player)) UIH.notify(text, kind);
}
const cname = t => { const c = G.C[t]; return c ? c.name : t; };

// ---------- effect language ----------
// eff keys: pp stab ws money infl manpower rad legit tension research units equip build infra fort spirit rmspirit ideo setIdeo law tech
//           claim core rel ally nap guarantee faction join play war annex puppet transfer release event news flag cflag ig general fn
function applyEff(c, e, ctx = {}) {
  if (!e) return;
  for (const k in e) {
    const v = e[k];
    switch (k) {
      case 'pp': c.pp = Math.max(0, c.pp + v); break;
      case 'stab': c.stab = clamp(c.stab + v, 0, 100); break;
      case 'ws': c.ws = clamp(c.ws + v, 0, 100); break;
      case 'money': c.money += v * Math.max(200, c.budget.income || 200); break; // in weeks of income
      case 'infl': c.infl = Math.max(0, c.infl + v); break;
      case 'manpower': c.manpower += v; break;
      case 'rad': c.rad = clamp(c.rad + v, 0, 1); break;
      case 'legit': c.legitBonus = (c.legitBonus || 0) + v; break;
      case 'tension': G.tension = clamp(G.tension + v, 0, 100); break;
      case 'research': for (const cat in c.research) if (c.research[cat]) c.research[cat].prog += v; c.resBank = (c.resBank || 0) + v; break;
      case 'units': for (const t in v) spawnDivisions(c, t, v[t], ctx.prov); break;
      case 'equip': for (const g in v) c.stock[g] = (c.stock[g] || 0) + v[g]; break;
      case 'build': for (const t in v) freeBuild(c, t, v[t], ctx.prov); break;
      case 'infra': freeBuild(c, 'railway', v); break;
      case 'fort': (Array.isArray(v) ? v : [v]).forEach(n => { const p = typeof n === 'string' ? PN(n) : null; if (p) p.fort = Math.min(5, p.fort + 2); else borderProvs(c.tag).slice(0, 6).forEach(q => q.fort = Math.min(5, q.fort + n)); }); break;
      case 'spirit': (Array.isArray(v) ? v : [v]).forEach(s => typeof s === 'string' ? addSpirit(c, s) : addSpirit(c, s[0], s[1])); break;
      case 'rmspirit': (Array.isArray(v) ? v : [v]).forEach(s => removeSpirit(c, s)); break;
      case 'ideo': shiftSupport(c, v); break;
      case 'setIdeo': setIdeology(c, v); break;
      case 'law': (Array.isArray(v) ? v : [v]).forEach(l => setLaw(c, l)); break;
      case 'tech': (Array.isArray(v) ? v : [v]).forEach(t => grantTech(c, t)); break;
      case 'claim': provList(v).forEach(p => { if (!p.claims.includes(c.tag) && p.owner !== c.tag) p.claims.push(c.tag); }); break;
      case 'core': provList(v).forEach(p => { if (!p.cores.includes(c.tag)) p.cores.push(c.tag); }); break;
      case 'rel': for (const t in v) if (G.C[t]) addRel(c.tag, t, v[t]); break;
      case 'ally': if (ok(v)) addPact('ally', c.tag, v); break;
      case 'nap': if (ok(v)) addPact('nap', c.tag, v, 365 * 5); break;
      case 'guarantee': (Array.isArray(v) ? v : [v]).forEach(t => ok(t) && addPact('guar', c.tag, t)); break;
      case 'faction': createFaction(c.tag, v); break;
      case 'join': if (ok(v)) joinFaction(c.tag, v); break;
      case 'invite': (Array.isArray(v) ? v : [v]).forEach(t => ok(t) && !C(t).overlord && joinFaction(t, c.tag)); break;
      case 'play': if (ok(v.vs)) startPlay(c.tag, v.vs, { type: v.type || 'take', provs: v.provs ? provList(v.provs).filter(p => p.owner === v.vs).map(p => p.id) : [] }, v); break;
      case 'war': if (ok(v)) declareWar(c.tag, v, [{ by: c.tag, vs: v, type: 'conquer' }]); break;
      case 'annex': (Array.isArray(v) ? v : [v]).forEach(t => ok(t) && annex(c.tag, t, true)); break;
      case 'puppet': (Array.isArray(v) ? v : [v]).forEach(t => ok(t) && makeSubject(c.tag, t)); break;
      case 'free': (Array.isArray(v) ? v : [v]).forEach(t => { if (G.C[t] && C(t).overlord === c.tag) { C(t).overlord = null; logMsg(`${cname(t)} gains full independence from ${c.name}.`, 'world'); } }); break;
      case 'independence': if (c.overlord) { const o = c.overlord; c.overlord = null; addRel(c.tag, o, v || 0); logMsg(`${c.name} declares full independence from ${cname(o)}.`, 'world'); } break;
      case 'transfer': provList(v.provs).forEach(p => { if (G.C[v.to] && C(v.to).exists) transferProv(p, v.to); }); break;
      case 'take': provList(v).forEach(p => transferProv(p, c.tag)); break;
      case 'event': fireEvent(v, c.tag); break;
      case 'eventFor': if (ok(v[0])) queueEvent(v[1], v[0], v[2] || 1); break;
      case 'news': logMsg(v.replace('$C', c.name), 'world'); break;
      case 'flag': G.flags[v] = G.day; break;
      case 'cflag': c.flags[v] = G.day; break;
      case 'ig': for (const g in v) { const o = c.ig[g]; if (v[g].appr) o.mods.push({ v: v[g].appr, until: G.day + 720 }); if (v[g].clout) o.base = Math.max(1, o.base * (1 + v[g].clout)); } break;
      case 'general': c.gens.push({ id: G.nid++, name: v[0], skill: v[1], trait: v[2], xp: 0 }); break;
      case 'civilwar': startCivilWar(c.tag, v.ideo, v.frac || 0.45, v.name, v); break;
      case 'tip': break;
      case 'fn': v(c, ctx); break;
      default: throw new Error('Unknown effect ' + k);
    }
  }
}
const ok = t => G.C[t] && G.C[t].exists;
function provList(v) {
  if (typeof v === 'string') return G.C[v] ? provsOf(v) : [PN(v)];
  const out = []; v.forEach(x => { if (typeof x === 'number') out.push(P(x)); else if (G.C[x]) out.push(...provsOf(x)); else out.push(PN(x)); }); return out;
}
const sgn = v => (v > 0 ? '+' : '') + v;
function effText(e, c) {
  if (!e) return ''; const L = [];
  const names = v => (Array.isArray(v) ? v : [v]).map(x => typeof x === 'number' ? P(x).name : G.C[x] ? cname(x) : x).join(', ');
  for (const k in e) {
    const v = e[k];
    switch (k) {
      case 'pp': L.push(`Political power ${sgn(v)}`); break; case 'stab': L.push(`Stability ${sgn(v)}%`); break; case 'ws': L.push(`War support ${sgn(v)}%`); break;
      case 'money': L.push(`Treasury ${sgn(v)} weeks of income`); break; case 'infl': L.push(`Influence ${sgn(v)}`); break; case 'manpower': L.push(`Manpower ${sgn(v)}K`); break;
      case 'rad': L.push(`Radicals ${sgn(Math.round(v * 100))}%`); break; case 'legit': L.push(`Legitimacy ${sgn(v)}`); break; case 'tension': L.push(`World tension ${sgn(v)}`); break;
      case 'research': L.push(`Research progress +${v} in every field`); break;
      case 'units': L.push('Raise ' + Object.keys(v).map(t => `${v[t]} ${UNITS[t].name}`).join(', ') + ' divisions'); break;
      case 'equip': L.push('Stockpile: ' + Object.keys(v).map(g => `+${v[g]} ${GOODS[g][0]}`).join(', ')); break;
      case 'build': L.push('Build ' + Object.keys(v).map(t => `${v[t]} ${BLD[t].name}`).join(', ')); break;
      case 'infra': L.push(`Build ${v} Railways`); break; case 'fort': L.push('Fortify ' + (typeof v === 'number' ? 'the borders' : names(v))); break;
      case 'spirit': (Array.isArray(v) ? v : [v]).forEach(s => { const id = typeof s === 'string' ? s : s[0], d = SPIRITS[id]; L.push(`Gain <b>${d[0]}</b>${typeof s === 'string' ? '' : ` for ${s[1]} days`}:<div class="sub">${modText(d[2])}</div>`); }); break;
      case 'rmspirit': (Array.isArray(v) ? v : [v]).forEach(s => L.push(`Remove <b>${SPIRITS[s][0]}</b>`)); break;
      case 'ideo': L.push('Popular support: ' + Object.keys(v).map(i => `${IDEO[i][0]} ${sgn(v[i])}%`).join(', ')); break;
      case 'setIdeo': L.push(`Government becomes <b>${IDEO[v][0]}</b>`); break;
      case 'law': (Array.isArray(v) ? v : [v]).forEach(l => L.push(`Enact <b>${lawName(l)}</b>`)); break;
      case 'tech': L.push('Gain technology: ' + (Array.isArray(v) ? v : [v]).map(t => TECHS[t][0]).join(', ')); break;
      case 'claim': L.push('Gain claims on ' + names(v)); break; case 'core': L.push('Gain cores on ' + names(v)); break;
      case 'rel': L.push('Relations: ' + Object.keys(v).map(t => `${cname(t)} ${sgn(v[t])}`).join(', ')); break;
      case 'ally': L.push(`Alliance with ${cname(v)}`); break; case 'nap': L.push(`Non-aggression pact with ${cname(v)}`); break; case 'guarantee': L.push(`Guarantee the independence of ${names(v)}`); break;
      case 'faction': L.push(`Found the faction <b>${v}</b>`); break; case 'join': L.push(`Join the faction of ${cname(v)}`); break; case 'invite': L.push(`Bring ${names(v)} into our faction`); break;
      case 'play': L.push(`Open a diplomatic play against ${cname(v.vs)}: ${({ take: 'demand ' + (v.provs ? names(v.provs) : 'territory'), annex: 'annexation', puppet: 'subjugation', regime: 'regime change' })[v.type || 'take']}`); break;
      case 'war': L.push(`<span class="neg">Declare war on ${cname(v)}</span>`); break; case 'annex': L.push(`Annex ${names(v)}`); break; case 'puppet': L.push(`${names(v)} becomes our subject`); break;
      case 'free': L.push(`Grant independence to ${names(v)}`); break; case 'independence': L.push('Become fully independent'); break;
      case 'transfer': L.push(`${names(v.provs)} goes to ${cname(v.to)}`); break; case 'take': L.push(`Gain ${names(v)}`); break;
      case 'ig': for (const g in v) L.push(`${IGS[g][0]}: ${v[g].appr ? 'approval ' + sgn(v[g].appr) + ' ' : ''}${v[g].clout ? 'clout ' + pct(v[g].clout) : ''}`); break;
      case 'general': L.push(`Gain general ${v[0]} (skill ${v[1]})`); break;
      case 'civilwar': L.push(`<span class="neg">Civil war: ${v.name} rises up</span>`); break;
      case 'tip': L.push(v); break;
    }
  }
  return L.join('<br>');
}
const lawName = l => { for (const cat in LAWS) if (LAWS[cat].laws[l]) return LAWS[cat].laws[l][0]; return l; };
const lawCat = l => { for (const cat in LAWS) if (LAWS[cat].laws[l]) return cat; throw new Error('Unknown law ' + l); };
function setLaw(c, l) { c.laws[lawCat(l)] = l; dirty(c); }
function grantTech(c, t) { if (!TECHS[t]) throw new Error('Unknown tech ' + t); c.techs[t] = 1; for (const cat in c.research) if (c.research[cat] && c.research[cat].id === t) c.research[cat] = null; upgradePMs(c); dirty(c); }
function upgradePMs(c) { for (const b in BLD) { const pms = BLD[b].pms; if (b === 'synth' || b === 'power') { if (c.pm[b] === undefined) c.pm[b] = 0; continue; } let best = 0; pms.forEach((pm, i) => { if (!pm[1] || c.techs[pm[1]]) best = i; }); if (c.pmAuto !== false || c.pm[b] === undefined) c.pm[b] = Math.max(c.pm[b] || 0, best); } }

// ---------- new game ----------
const EXTRA_TECH = { SOV: ['m_tank1', 'm_mot', 'm_art1', 'p_assembly', 'p_electrification'], ITA: ['m_tank1', 'm_art1', 'm_air1', 'p_electrification'], POL: ['m_tank1', 'm_art1'], JAP: ['m_nav1'], USA: ['p_tractors', 'm_nav1'], GER: ['p_precision'], ENG: ['m_nav1'], CHI: ['m_art1'], HUN: ['m_art1'], ROM: ['m_art1'], YUG: ['m_art1'], TUR: ['m_art1'], BRA: ['m_art1'], ARG: ['m_art1'] };
function newGame(player) {
  initStatic();
  G = { v: 2, day: 0, hour: 0, speed: 2, paused: true, player, P: [], C: {}, armies: {}, nid: 1, wars: [], plays: [], factions: [], battles: [], pacts: [], flags: {}, tension: 8, log: [], fired: {}, evq: [], wp: {}, stats: {} };
  PROV_RAW.trim().split('\n').forEach((l, id) => {
    const f = l.split('|'), res = { coal: 0, iron: 0, oil: 0, rubber: 0 }; (f[7].match(/[ciro]\d/g) || []).forEach(x => res[{ c: 'coal', i: 'iron', o: 'oil', r: 'rubber' }[x[0]]] = +x[1]);
    G.P.push({ id, name: f[0], owner: f[4], ctrl: f[4], orig: f[4], pop: Math.round(+f[5] * 1000), dev: +f[6], res, ter: f[8] || 'p', vp: +f[9] || 1, b: {}, coastal: MAP.P[id].c, cores: [f[4]], claims: [], dmg: 0, fort: 0 });
  });
  for (const tag in COUNTRY_DEF) {
    const d = COUNTRY_DEF[tag], preset = d.l || d.i;
    const c = G.C[tag] = { tag, name: d.n, adj: d.a, color: d.c, major: !!d.maj, exists: true, ai: tag !== player, ideology: d.i, sup: Object.assign({ dem: 10, fas: 10, com: 10, aut: 10 }, d.sup || { [d.i]: 64, dem: d.i === 'dem' ? 64 : 14, aut: d.i === 'aut' ? 64 : 12 }), leader: d.ld, party: d.p, capital: PNAME[d.cap], overlord: d.ov || null,
      pp: 50, infl: 30, stab: d.stab || 55, ws: d.ws || (d.i === 'dem' ? 25 : 45), rad: 0.1, legit: 50, money: 0, taxLevel: 2, milProd: 1, laws: Object.assign({}, LAW_PRESET[preset], ['USA', 'ENG', 'CAN', 'AST', 'NZL', 'SAF', 'IRE', 'RAJ'].includes(tag) ? { conscription: 'volunteer' } : {}, d.law || {}), enact: null, ig: {}, nextElection: dayOf(1936 + rint(0, 3), rint(1, 12), 1),
      spirits: [], techs: {}, research: { prod: null, mil: null, soc: null }, focus: { cur: null, prog: 0, done: {} }, dcd: {}, flags: {}, market: {}, ful: {}, pm: {}, act: {}, queue: [], pq: [], invPool: 0, gdp: 0, w: 0.3, sol: 10, lit: d.lit,
      manpower: 0, stock: { arms: 0, artillery: 0, tanks: 0, aircraft: d.air || 0, ships: d.navy || 0, autos: 0 }, milNeed: {}, training: [], gens: [], np: d.np || 'west', rel: {}, infamy: 0, budget: { income: 0 }, capitulated: false, warExh: 0, casualties: 0, bt: {} };
    let s = 0; for (const k in c.sup) s += c.sup[k]; for (const k in c.sup) c.sup[k] = c.sup[k] * 100 / s;
    const lim = [1900, 1927, 1931, 1935][d.t]; for (const t in TECHS) if (TECHS[t][2] <= lim) c.techs[t] = 1; (EXTRA_TECH[tag] || []).forEach(t => c.techs[t] = 1);
    upgradePMs(c); for (const b in BLD) c.act[b] = 1; for (const g of GOOD_IDS) { c.market[g] = { s: 0, d: 0, p: GOODS[g][1], imp: 0, exp: 0 }; c.ful[g] = 1; }
    initIGs(c, preset);
    (d.sp || []).forEach(s2 => addSpirit(c, s2));
    (d.g || []).forEach(g => c.gens.push({ id: G.nid++, name: g[0], skill: g[1], trait: g[2], xp: 0 }));
  }
  if (!G.C[player]) throw new Error('Unknown country ' + player);
  for (const c of alive()) if (!provsOf(c.tag).length) c.exists = false;
  generateBuildings();
  for (const c of alive()) setupArmies(c);
  initDiplomacy();
  for (let i = 0; i < 8; i++) economyTick(true);
  for (const c of alive()) { c.money = c.budget.income * 8; c.manpower = maxManpower(c) * 0.5; politicsMonthly(c); c.stab = COUNTRY_DEF[c.tag].stab || c.stab; }
  setupScenario();
  return G;
}
function initIGs(c, preset) {
  const b = { ind: 12, land: 14, union: 10, army: 10, intel: 8, pb: 12, rural: 22, devout: 12 }, L = c.lit;
  b.intel += 7 * L; b.union += 9 * L; b.ind += 9 * L; b.rural -= 10 * L; b.land -= 6 * L; b.devout -= 4 * L;
  if (c.ideology === 'fas') { b.army += 8; b.pb += 6; } if (c.ideology === 'com') { b.union += 22; b.intel += 5; b.land = 2; b.ind = 2; b.devout = 3; }
  if (preset === 'trad') { b.land += 12; b.devout += 10; b.union = 3; } if (preset === 'mon') { b.land += 5; b.army += 3; }
  const gov = preset === 'mon' || preset === 'trad' ? ['land', 'army', 'devout'] : IDEO_GOV[c.ideology];
  for (const g of IG_IDS) c.ig[g] = { base: b[g], clout: b[g], appr: 0, gov: gov.includes(g), mods: [] };
}
function generateBuildings() {
  const share = [0.06, 0.2, 0.38, 0.55, 0.7, 0.82];
  for (const p of G.P) {
    const c = C(p.owner), L = Math.max(1, Math.round(p.pop * 0.3 / EMP * share[p.dev])), w = {}, b = p.b; let used = 0;
    const put = (t, n) => { n = Math.round(n); if (n > 0) { b[t] = (b[t] || 0) + n; used += n; } };
    for (const r in p.res) if (p.res[r]) put({ coal: 'coalm', iron: 'ironm', oil: 'oilr', rubber: 'rubberp' }[r], Math.min(p.res[r] * (1.5 + p.dev), Math.max(1, L * 0.3), p.res[r] * 8));
    const tropical = 'j'.includes(p.ter) || Math.abs(MAP.P[p.id].y - MAP.H * 0.55) < MAP.H * 0.13;
    w.farm = p.dev >= 3 ? 14 : 30; w.ranch = 9; w.logging = p.ter === 'f' ? 9 : 4; w.plantation = tropical ? 14 : 4; w.textile = 9 + p.dev; w.furniture = 5 + p.dev * 0.5; w.urban = 9 + p.dev * 2.5;
    if (p.dev >= 2) { w.power = 4; w.tools = 5; } if (p.dev >= 3) { w.steel = 7; w.chem = 3.5; } if (p.dev >= 4) { w.engines = 3.5; w.autos = c.tag === 'USA' ? 4 : 1.5; }
    if (p.ter === 'd') { w.farm *= 0.4; w.logging = 0; } if (p.ter === 'u') { w.farm = 2; w.ranch = 1; w.logging = 0; w.urban *= 1.6; }
    let tw = 0; for (const k in w) tw += w[k]; const rest = Math.max(0, L - used);
    for (const k in w) put(k, rest * w[k] / tw);
    b.railway = Math.max(p.dev >= 1 ? 1 : 0, Math.ceil((used - 4 - p.dev * 2) / 8)); if (!b.railway) delete b.railway;
    if (p.coastal && (p.dev >= 1 || p.vp >= 4)) b.port = 1 + (p.dev >= 4 ? 1 : 0);
    if (p.dev >= 4) b.university = 1;
  }
  for (const c of alive()) {
    const d = COUNTRY_DEF[c.tag], ps = heldBy(c.tag).sort((a, b) => b.dev * 10 + b.vp - a.dev * 10 - a.vp), cap = P(c.capital), pop = sum(ps, p => p.pop);
    cap.b.admin = Math.max(1, Math.round(pop / 9000)); cap.b.university = (cap.b.university || 0) + (c.lit > 0.8 ? 1 + Math.round(pop / 30000) : 0); if (!cap.b.university) delete cap.b.university;
    cap.b.construction = Math.max(1, Math.round(sum(ps, p => sum(Object.values(p.b))) / 28));
    const mil = d.mil || [pop > 6000 ? 1 : 0, 0, 0, 0, 0], types = ['arms', 'artyf', 'tankp', 'aircraftp', 'shipyard'];
    mil.forEach((n, i) => { for (let k = 0; k < n; k++) { const cand = types[i] === 'shipyard' ? ps.filter(p => p.coastal) : ps; const p = cand[k % Math.min(cand.length, 4)]; if (p) p.b[types[i]] = (p.b[types[i]] || 0) + 1; } });
  }
}
function freeBuild(c, type, n, prov) {
  for (let i = 0; i < n; i++) { const p = prov !== undefined && P(prov).owner === c.tag ? P(prov) : bestProvFor(c, type); if (!p) return; p.b[type] = (p.b[type] || 0) + 1; }
}
// ---------- save / load ----------
const SAVE_KEY = 'ironledger_save';
function serialize() { return JSON.stringify(G, (k, v) => k[0] === '_' ? undefined : v); }
function deserialize(s) { initStatic(); G = JSON.parse(s); return G; }

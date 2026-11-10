// Market economy: buildings, production methods, pops' needs, prices, world trade, budget, construction.
'use strict';
const priceOf = (base, d, s) => base * clamp(1 + 0.75 * (d - s) / Math.max(1, Math.min(d, s)), 0.25, 1.75);
const provLevels = p => { let n = 0; for (const t in p.b) n += p.b[t]; return n; };
const infraCap = (p, c) => (8 + p.dev * 5 + (p.b.railway || 0) * 8 + (p.b.port ? 3 : 0)) * (1 + M(c, 'infra'));
const ruralCap = p => 4 + Math.floor(p.pop / 450);
const resCap = (p, r) => p.res[r] * 8;
const RES_OF = { coalm: 'coal', ironm: 'iron', oilr: 'oil', rubberp: 'rubber' };
function tariffOf(c) { return { free: 0.03, protectionism: 0.15, autarky: 0.3 }[c.laws.trade]; }
function canBuild(c, type, p) {
  const d = BLD[type]; if (d.tech && !c.techs[d.tech]) return false; if (d.coastal && !p.coastal) return false;
  if (d.res) return (p.b[type] || 0) < resCap(p, d.res);
  if (d.cat === 'rural') { let n = 0; for (const t of ['farm', 'ranch', 'plantation', 'logging']) n += p.b[t] || 0; return n < ruralCap(p); }
  return true;
}
function bestProvFor(c, type) {
  let best = null, bs = -1e9;
  for (const p of G.P) { if (p.owner !== c.tag || p.ctrl !== c.tag || !canBuild(c, type, p)) continue;
    const lv = provLevels(p), cap = p.pop * 0.3 / EMP, s = (cap - lv) * 0.5 + p.dev * 3 + (infraCap(p, c) - lv) * 0.4 + (p.cores.includes(c.tag) ? 6 : 0) + (p.id === c.capital ? 2 : 0) - p.dmg * 10 + (type === 'railway' ? (lv - infraCap(p, c)) * 2 : 0);
    if (s > bs) { bs = s; best = p; } }
  return best;
}
function economyTick(warm) {
  const cs = alive();
  for (const c of cs) econSupplyDemand(c);
  worldTrade(cs);
  for (const c of cs) econFinish(c, warm);
}
function econSupplyDemand(c) {
  const mk = c.market, bt = c.bt = {}; for (const g of GOOD_IDS) { mk[g].s = 0; mk[g].d = 0; mk[g].imp = 0; mk[g].exp = 0; }
  const outAll = (1 + M(c, 'output')) * (0.85 + 0.3 * c.stab / 100), st = c.stats = { pop: 0, wf: 0, emp: 0, peas: 0, levels: 0, bureau: 0, innov: 0, cpts: 0, ports: 0, corePop: 0, subsVal: 0 };
  const cActive = c.queue.length || c.pq.length ? 1 : 0;
  for (const p of G.P) {
    if (p.owner !== c.tag) continue; st.pop += p.pop; st.corePop += p.cores.includes(c.tag) ? p.pop : p.pop * 0.25; if (p.ctrl !== c.tag) continue;
    const wf = p.pop * 0.3 * (1 - p.dmg * 0.5), lv = provLevels(p), staff = lv ? Math.min(1, wf / EMP / lv) : 1, ic = infraCap(p, c), im = lv > ic ? Math.max(0.5, ic / lv) : 1, coreF = p.cores.includes(c.tag) ? 1 : 0.7;
    st.wf += wf; st.levels += lv; let used = 0;
    for (const t in p.b) {
      const def = BLD[t], pm = def.pms[c.pm[t] || 0], l = p.b[t]; let th = l * staff * im * (1 - p.dmg) * coreF;
      if (def.cat === 'gov') { used += l * staff * EMP; const o = bt[t] || (bt[t] = { lv: 0, th: 0 }); o.lv += l;
        if (t === 'admin') st.bureau += th * 10; else if (t === 'university') st.innov += th * 3; else if (t === 'port') st.ports += th;
        else if (t === 'construction') { st.cpts += th * CONSTR_PTS[c.pm[t] || 0]; th *= cActive; }
        o.th += th; for (const g in pm[2]) mk[g].d += pm[2][g] * th; continue; }
      let f = 1; for (const g in pm[2]) f = Math.min(f, 0.25 + 0.75 * c.ful[g]);
      th *= f * (def.cat === 'military' ? c.milProd : c.act[t]); used += l * staff * EMP * (def.cat === 'military' ? c.milProd : c.act[t]);
      const om = outAll * (1 + (def.cat === 'military' ? M(c, 'mil_out') : def.cat === 'mine' ? M(c, 'res_out') : def.cat === 'rural' ? M(c, 'farm_out') : 0));
      const o = bt[t] || (bt[t] = { lv: 0, th: 0, om }); o.lv += l; o.th += th; o.om = om;
      for (const g in pm[2]) mk[g].d += pm[2][g] * th; for (const g in pm[3]) mk[g].s += pm[3][g] * th * om;
    }
    const peas = Math.max(0, wf - used); st.emp += used; st.peas += peas;
    for (const g in SUBSIST) mk[g].s += SUBSIST[g] * peas / 1000 * (1 - p.dmg) * (0.8 + 0.4 * p.dev / 5);
  }
  st.empPop = Math.min(st.pop, st.emp / 0.3 + (c._ndiv || 0) * 40); st.peasPop = st.pop - st.empPop;
  const nf = (1 + M(c, 'needs')) * st.empPop / 1000;
  for (const g in NEEDS) mk[g].d += (NEEDS[g][0] + NEEDS[g][1] * c.w) * nf;
  for (const g in PEAS_NEED) mk[g].d += PEAS_NEED[g] * st.peasPop / 1000;
  // armed forces
  const need = c.milNeed = militaryNeeds(c);
  for (const g of MIL_GOODS) mk[g].d += Math.max(mk[g].s, need[g] || 0);
  mk.autos.d += need.autos || 0; mk.oil.d += need.oil || 0; mk.coal.d += (c.stock.ships || 0) * 0.02;
}
function worldTrade(cs) {
  const gs = G.wp; let gS, gD;
  for (const g of GOOD_IDS) {
    let W = 0, O = 0; gS = 0; gD = 0;
    for (const c of cs) { const m = c.market[g], o = clamp(0.55 + M(c, 'tradecap') + Math.min(0.2, c.stats.ports * 0.01) - (c.blockade || 0), 0.03, 1); c._open = o; gS += m.s; gD += m.d;
      const net = m.s - m.d; m._w = net < 0 ? -net * o : 0; m._o = net > 0 ? net * o * 0.9 : 0; W += m._w; O += m._o; }
    const T = Math.min(W, O);
    for (const c of cs) { const m = c.market[g]; m.imp = W > 0 ? m._w * T / W : 0; m.exp = O > 0 ? m._o * T / O : 0; }
    gs[g] = { p: priceOf(GOODS[g][1], gD, gS), s: gS, d: gD, t: T };
  }
}
function econFinish(c, warm) {
  const mk = c.market, st = c.stats, B = c.budget = { income: 0, tax: 0, tariff: 0, tribute: 0, state: 0, gov: 0, army: 0, procure: 0, constr: 0, welfare: 0, interest: 0, expense: 0 };
  let tariffs = 0, cons = 0, consF = 0;
  for (const g of GOOD_IDS) { const m = mk[g], S = m.s + m.imp, D = m.d + m.exp; m.p = 0.5 * m.p + 0.5 * priceOf(GOODS[g][1], D, S); c.ful[g] = D > 0 ? clamp(S / D, 0, 1) : 1; tariffs += m.imp * G.wp[g].p * tariffOf(c); }
  for (const g in NEEDS) { const v = NEEDS[g][0] + NEEDS[g][1] * 0.5; cons += v; consF += v * c.ful[g]; }
  // building finances
  let wages = 0, profits = 0, va = 0, govW = 0, govCost = 0; const wl = 0.6 + 0.8 * c.w, minW = 230 * wl;
  for (const t in c.bt) { const o = c.bt[t], def = BLD[t], pm = def.pms[c.pm[t] || 0]; let cost = 0, rev = 0; for (const g in pm[2]) cost += pm[2][g] * o.th * mk[g].p * c.ful[g];
    if (def.cat === 'gov') { const w = o.lv * (t === 'railway' || t === 'port' ? 60 : 220) * wl * (t === 'construction' && !(c.queue.length || c.pq.length) ? 0.15 : 1); govW += w; wages += w; if (t === 'construction') B.constr += (cost + w) * (c.queue.length || !c.pq.length ? 1 - ({ laissez: 0.6, interventionism: 0.35, corporatist: 0.25, traditionalism: 0.3, command: 0 })[c.laws.econ] * (c.pq.length ? 1 : 0) : 0.1); else govCost += cost + w; o.va = 0; o.profit = -cost - w; continue; }
    for (const g in pm[3]) rev += pm[3][g] * o.th * o.om * mk[g].p;
    const v = rev - cost, w = Math.max(minW * o.th, 0.6 * v); o.va = v; o.wage = w; o.profit = v - w; o.rev = rev; va += v; wages += w; profits += v - w;
    if (def.cat !== 'military') { const perLv = o.th > 0.01 ? v / o.th : 0; c.act[t] = clamp(c.act[t] + (perLv < minW * 0.75 ? -0.04 : 0.05), 0.35, 1); }
  }
  let subs = 0; for (const g in SUBSIST) subs += SUBSIST[g] * st.peas / 1000 * mk[g].p; st.subsVal = subs;
  // military
  const nDiv = c._ndiv || 0; let armyPay = 0, procure = 0;
  for (const id in G.armies) { const a = G.armies[id]; if (a.owner === c.tag) for (const d of a.divs) armyPay += UNITS[d.t].upkeep * wl * (1 + M(c, 'upkeep')); }
  armyPay += (c.stock.ships * 0.6 + c.stock.aircraft * 0.12) * wl;
  if (!warm) { for (const g of MIL_GOODS) { const got = Math.max(0, mk[g].s + mk[g].imp - mk[g].exp); c.stock[g] += got; procure += got * mk[g].p; }
    const ga = (c.milNeed.autos || 0) * c.ful.autos; c.stock.autos += ga; procure += ga * mk.autos.p; procure += (c.milNeed.oil || 0) * c.ful.oil * mk.oil.p;
  } else for (const g of MIL_GOODS) procure += mk[g].s * mk[g].p;
  // budget
  const bneed = st.pop / 2500 + st.levels / 12 + 3, teff = clamp(0.45 + 0.55 * st.bureau / bneed, 0.45, 1.05) * (1 + M(c, 'tax')), rate = TAX_RATE[c.taxLevel];
  B.tax = rate * teff * (wages + armyPay + subs * 0.35) + rate * 0.5 * teff * Math.max(0, profits); B.tariff = tariffs;
  const command = c.laws.econ === 'command'; if (command) B.state = Math.max(0, profits) * 0.45;
  if (c.overlord && C(c.overlord).exists) { B.tribute = -B.tax * 0.1; C(c.overlord).money += B.tax * 0.1; C(c.overlord)._trib = (C(c.overlord)._trib || 0) + B.tax * 0.1; }
  if (c._trib) { B.tribute += c._trib; c._trib = 0; }
  B.welfare = M(c, 'welfare') * st.pop / 1000 * 26 * wl; B.gov = Math.min(govCost, Math.max(B.tax * 0.35, 20)); B.army = armyPay; B.procure = procure * 0.6;
  B.interest = c.money < 0 ? -c.money * 0.0012 : 0;
  B.income = B.tax + B.tariff + B.state + Math.max(0, B.tribute); B.expense = B.gov + B.army + B.procure + B.constr + B.welfare + B.interest + Math.max(0, -B.tribute);
  B.net = B.income - B.expense;
  // pops
  const eS = st.pop ? st.empPop / st.pop : 0, subTax = rate * teff * subs * 0.35, dispo = wages + armyPay + (command ? 0.25 : 0.6) * Math.max(0, profits) + B.welfare * eS - (B.tax - subTax), pk = st.empPop / 1000 || 1; let A = 0, Bc = 0, PB = 0;
  for (const g in PEAS_NEED) PB += PEAS_NEED[g] * mk[g].p; const pr = clamp((subs - subTax + B.welfare * (1 - eS)) / Math.max(1, PB * st.peasPop / 1000), 0, 1.2);
  for (const g in NEEDS) { A += NEEDS[g][0] * mk[g].p; Bc += NEEDS[g][1] * mk[g].p; }
  const wT = clamp((dispo * 0.92 / pk - A) / Bc, 0, 1); c.w += (wT - c.w) * (warm ? 0.35 : 0.08);
  const ff = cons ? consF / cons : 1; c.solPrev = c.sol; c.solM = clamp(7 + 20 * c.w - 9 * (1 - ff) - (dispo * 0.92 / pk < A ? 3 * (1 - dispo * 0.92 / pk / A) : 0), 1, 30); c.solP = clamp(2 + 5 * pr - 4 * (1 - c.ful.grain), 1, 10); c.sol = c.solM * eS + c.solP * (1 - eS);
  c.gdp = (va + subs + govW + armyPay) * 52; c.unemp = 0;
  if (warm) return;
  c.money += B.net;
  const lim = Math.max(8000, B.income * 70);
  if (c.money < -lim) { addSpirit(c, 'bankruptcy', 540); c.money = -lim * 0.25; c.stab = Math.max(0, c.stab - 12); logMsg(`${c.name} has defaulted on its debts!`, c.major ? 'world' : 'info', [c.tag]); }
  const inv = Math.max(0, profits) * 0.3 * (1 + M(c, 'invest')); if (inv > 0 && !command) c.invPool = Math.min(c.invPool + inv, 4000 + B.income * 8);
  construct(c);
  if (!command && c.pq.length < 2 && c.invPool > 1500 && st.cpts > 0) { const o = buildOptions(c, true)[0]; if (o && o.score > 0) c.pq.push({ prov: o.prov, type: o.type, prog: 0 }); }
  for (const p of G.P) if (p.owner === c.tag && p.dmg > 0) p.dmg = Math.max(0, p.dmg - 0.015);
}
function construct(c) {
  let pts = c.stats.cpts * (1 + M(c, 'build')); if (pts <= 0) return;
  const econ = c.laws.econ; let ps = c.pq.length ? ({ laissez: 0.6, interventionism: 0.35, corporatist: 0.25, traditionalism: 0.3, command: 0 })[econ] : 0;
  if (!c.queue.length && c.pq.length) ps = 1; const ppts = Math.min(pts * ps, c.invPool / 55);
  const run = (q, amount, priv) => { while (amount > 0.01 && q.length) { const it = q[0], p = P(it.prov), cost = BLD[it.type].cost;
      if (p.owner !== c.tag || p.ctrl !== c.tag || !canBuild(c, it.type, p)) { q.shift(); continue; }
      const u = Math.min(amount, cost - it.prog); it.prog += u; amount -= u; if (priv) c.invPool -= u * 55;
      if (it.prog >= cost - 0.01) { p.b[it.type] = (p.b[it.type] || 0) + 1; q.shift(); if (c.tag === G.player && !priv) UIH.notify(`${BLD[it.type].name} completed in ${p.name}.`, 'build'); } } };
  run(c.pq, ppts, true); run(c.queue, pts - ppts, false);
}
// Rank what would be most profitable / most needed to build.
function buildOptions(c, privateOnly) {
  const out = [], mk = c.market, minW = 230 * (0.6 + 0.8 * c.w);
  for (const t of BLD_IDS) { const def = BLD[t]; if (def.cat === 'gov' || def.cat === 'military') continue; if (def.tech && !c.techs[def.tech]) continue;
    const pm = def.pms[c.pm[t] || 0]; let rev = 0, cost = 0, short = 0, n = 0; for (const g in pm[3]) { rev += pm[3][g] * mk[g].p; short += mk[g].p / GOODS[g][1]; n++; } for (const g in pm[2]) cost += pm[2][g] * mk[g].p * (2 - c.ful[g]);
    if (!n || (c.act[t] || 1) < 0.9) continue; const margin = rev - cost - minW, score = margin / def.cost * (short / n) ** 2; if (score <= 0) continue;
    const p = bestProvFor(c, t); if (!p) continue; if (provLevels(p) >= p.pop * 0.3 / EMP) continue;
    out.push({ type: t, prov: p.id, score, margin }); }
  return out.sort((a, b) => b.score - a.score);
}
function queueBuild(c, type, provId) {
  const p = P(provId); if (p.owner !== c.tag || p.ctrl !== c.tag || !canBuild(c, type, p)) return false;
  c.queue.push({ prov: provId, type, prog: 0 }); return true;
}
function monthlyPops(c) {
  const g = 0.0008 + (c.sol - 10) * 0.00004 + M(c, 'growth') * 0.001;
  for (const p of G.P) if (p.owner === c.tag) p.pop = Math.max(1, Math.round(p.pop * (1 + g - p.dmg * 0.002)));
  const le = LAWS.edu.laws[c.laws.edu][1].literacy || 0; c.lit = clamp(c.lit + (le * 0.0012 + (M(c, 'literacy') - le) * 0.001) * (1 - c.lit), 0.02, 0.995);
}
// ---------- research ----------
function researchTick(c) {
  const inn = c.innov = (2 + c.stats.innov + c.lit * 4 + Math.sqrt(c.gdp / 52) * 0.02) * (1 + M(c, 'research')) * (0.5 + 0.5 * c.lit);
  const cats = Object.keys(c.research), active = cats.filter(k => c.research[k]); if (!active.length) { c.resBank = Math.min(60, (c.resBank || 0) + inn * 0.3); return; }
  for (const k of active) { const r = c.research[k], ahead = Math.max(0, TECHS[r.id][2] - year()); r.prog += inn / active.length / (1 + ahead * 1.5);
    if (r.prog >= techCost(r.id)) { c.research[k] = null; grantTech(c, r.id); if (c.tag === G.player) UIH.notify(`Research complete: ${TECHS[r.id][0]}.`, 'tech'); } }
}
const techAvailable = (c, cat) => Object.keys(TECHS).filter(t => TECHS[t][1] === cat && !c.techs[t]).sort((a, b) => TECHS[a][2] - TECHS[b][2]);
function startResearch(c, id) { const cat = TECHS[id][1]; if (c.techs[id]) return; c.research[cat] = { id, prog: Math.min(c.resBank || 0, 40) }; c.resBank = 0; }

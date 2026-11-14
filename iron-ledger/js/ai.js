// AI: national management, diplomacy and army command. Player armies set to "auto" use the same commander.
'use strict';
function aiFocus(c) {
  if (c.focus.cur) return; const tree = focusTree(c), av = tree.filter(f => focusState(c, f) === 'available'); if (!av.length) return;
  const top = Object.keys(c.sup).sort((a, b) => c.sup[b] - c.sup[a])[0]; let tot = 0;
  const ws = av.map(f => { let w = f.ai === undefined ? 1 : f.ai; if (!G.historical && w === 0) w = 0.6; if (f.aiIdeo) w *= f.aiIdeo === c.ideology ? 1.5 : f.aiIdeo === top ? 0.5 : (G.historical ? 0 : 0.05); if (f.id[0] === 'n' && f.id === 'n_stab') w = 3; tot += w; return w; });
  if (G.historical) { const mx = Math.max(...ws); if (mx >= 5) for (let i = 0; i < ws.length; i++) { if (ws[i] < 5) { tot -= ws[i]; ws[i] = 0; } } }
  if (tot <= 0) return; let r = Math.random() * tot; for (let i = 0; i < av.length; i++) { r -= ws[i]; if (r <= 0) { startFocus(c, av[i].id); return; } }
}
function aiResearch(c) { for (const cat in c.research) if (!c.research[cat]) { const av = techAvailable(c, cat); if (av.length) startResearch(c, Math.random() < 0.75 ? av[0] : av[Math.min(av.length - 1, 1)]); } }
function aiThreat(c) { // 0..1 sense of danger
  if (isAtWar(c.tag)) return 1; let t = G.tension / 140; if (G.plays.some(p => p.b === c.tag || p.a === c.tag)) t += 0.5; if (c.ideology === 'fas') t += 0.3; if (c.major) t += 0.1;
  return clamp(t, 0, 1);
}
function aiEconomy(c) {
  const B = c.budget, war = isAtWar(c.tag), thr = aiThreat(c), lim = Math.max(3000, B.income * 70);
  if (c.money < -lim * 0.35 || (B.net < -B.income * 0.25 && c.money < B.income * 6)) { if (c.taxLevel < 4) c.taxLevel++; }
  else if (c.money > B.income * 30 && B.net > 0 && c.taxLevel > 0) c.taxLevel--;
  // war industry throttle
  const idle = !war && thr < 0.35; let over = true; for (const g of ['arms', 'artillery']) if ((c.milNeed[g] || 0) > 0.5) over = false;
  if (war) c.milProd = 1; else if (B.net < 0 && c.money < B.income * 5) c.milProd = Math.max(idle ? 0.2 : 0.4, c.milProd - 0.1); else if (c.money > B.income * 10 || (B.net > 0 && thr > 0.4)) c.milProd = Math.min(idle && over ? 0.5 : 1, c.milProd + 0.1);
  if (c.money < -lim * 0.1 || (B.net < 0 && c.money < B.income * 3)) return;
  if (c.queue.length >= (c.money > B.income * 25 ? 4 : 2)) return;
  const st = c.stats, lv = st.levels || 1; let type = null, prov = null;
  const milShare = sum(['arms', 'artyf', 'tankp', 'aircraftp', 'shipyard'], t => (c.bt[t] || {}).lv || 0) / lv, wantMil = war ? 0.2 : 0.03 + thr * 0.1;
  const infraBad = heldBy(c.tag).filter(p => provLevels(p) > infraCap(p, c) + 1).sort((a, b) => provLevels(b) - infraCap(b, c) - provLevels(a) + infraCap(a, c))[0];
  const r = Math.random();
  if (st.cpts < Math.max(5, lv * 0.07) && r < 0.4 && c.money > B.income * 4 && B.net > 0) type = 'construction';
  else if (milShare < wantMil && r < 0.75) { const need = c.milNeed; type = (need.arms || 0) > 1 || !c.bt.arms ? 'arms' : (need.artillery || 0) > 0.5 ? 'artyf' : c.techs.m_tank1 && (need.tanks || 0) > 0.3 ? 'tankp' : pick(['aircraftp', 'arms', 'artyf', c.techs.m_tank1 ? 'tankp' : 'arms', heldBy(c.tag).some(p => p.coastal) && c.major ? 'shipyard' : 'aircraftp']); }
  else if (infraBad && r < 0.85) { type = 'railway'; prov = infraBad.id; }
  else if (st.bureau < st.pop / 2500 + lv / 12 + 3 && r < 0.9) type = 'admin';
  else if (r > 0.93 && c.lit > 0.5) type = 'university';
  else { const o = buildOptions(c)[0]; if (o) { type = o.type; prov = o.prov; } }
  if (!type) return; if (prov === null) { const p = bestProvFor(c, type); if (!p) return; prov = p.id; } queueBuild(c, type, prov);
}
function aiLaws(c) {
  const war = isAtWar(c.tag), order = ['civilian', 'early', 'partial', 'war_econ', 'total'], co = ['volunteer', 'limited', 'extensive', 'requirement', 'all_adults'];
  const want = war ? (c.warExh > 30 ? 4 : 3) : aiThreat(c) > 0.6 ? 2 : aiThreat(c) > 0.3 ? 1 : 0, cur = order.indexOf(c.laws.mobil);
  if (want > cur) { for (let i = want; i > cur; i--) if (!lawAllowed(c, 'mobil', order[i])) { startLaw(c, 'mobil', order[i]); break; } }
  else if (want < cur - 1 && !war && c.pp >= 100) startLaw(c, 'mobil', order[cur - 1]);
  const mp = c.manpower, cw = co.indexOf(c.laws.conscription), wantC = war ? (mp < Math.max(40, maxManpower(c) * 0.15) ? Math.min(4, cw + 1) : cw) : aiThreat(c) > 0.4 ? Math.max(cw, 1) : cw;
  if (wantC > cw && !lawAllowed(c, 'conscription', co[wantC])) startLaw(c, 'conscription', co[wantC]);
  if (!c.enact && c.pp > 150 && Math.random() < 0.06) { // occasional reform favoured by the governing coalition
    let best = null, bs = 0; for (const cat in LAWS) { if (LAWS[cat].instant) continue; for (const l in LAWS[cat].laws) { if (lawAllowed(c, cat, l)) continue; const cur2 = (LAWS[cat].laws[c.laws[cat]] || [0, 0, {}])[2], nw = LAWS[cat].laws[l][2]; let s = 0; for (const g of IG_IDS) if (c.ig[g].gov) s += ((nw[g] || 0) - (cur2[g] || 0)) * c.ig[g].clout; if (cat === 'gov' || (cat === 'power' && c.ideology !== 'dem') || ['traditionalism', 'no_schools', 'land_tax', 'no_police', 'per_capita', 'no_welfare', 'no_rights'].includes(l)) continue; if (cat === 'power') s -= 30; if (s > bs && lawChance(c, cat, l) > 35) { bs = s; best = [cat, l]; } } }
    if (best) startLaw(c, best[0], best[1]); }
}
function aiRecruit(c) {
  const war = isAtWar(c.tag), thr = aiThreat(c), n = c._ndiv || 0, B = c.budget; if (c.training.length >= (war ? 8 : 3)) return;
  const target = Math.max(2, Math.round((c.stats.corePop / 2200) * (0.5 + thr * 1.6) * (c.major ? 1.25 : 1) * (c.major && c.ideology === 'fas' ? 1.5 : 1) * (c.ideology === 'dem' && !war ? 0.6 : 1)) + (war ? 6 : 0));
  if (n >= (war ? Math.max(target * 1.5, c.stats.corePop / 700) : target)) return; if (B.army > B.income * (war ? 0.7 : 0.3 + thr * 0.2) && !war) return; if (c.manpower < 30) return;
  const eqOK = g => (c.stock[g] || 0) > 30 || (c.market[g] && c.market[g].s > 5);
  let t = 'inf'; const r = Math.random();
  if (c.techs.m_tank1 && eqOK('tanks') && r < 0.15) t = 'arm'; else if (c.techs.m_mot && eqOK('autos') && c.stock.autos > 40 && r < 0.25) t = 'mot'; else if (c.techs.m_art1 && eqOK('artillery') && r < 0.5) t = 'hvy'; else if (c.techs.m_mtn && r < 0.58) t = 'mtn'; else if (!eqOK('arms') && war) t = 'mil';
  recruit(c, t, war ? 2 : 1);
}
function aiGenerals(c) { const free = c.gens.filter(g => !g.army || !G.armies[g.army] || G.armies[g.army].gen !== g.id); for (const g of free) g.army = null; if (!free.length) return; free.sort((a, b) => b.skill - a.skill);
  for (const a of armiesOf(c.tag).sort((x, y) => y.divs.length - x.divs.length)) if (!a.gen && free.length) assignGeneral(a, free.shift()); }
function aiDiplomacy(c) {
  if (c.overlord || c.capitulated) return; const f = factionOf(c.tag), thr = aiThreat(c);
  // seek shelter
  if (!f && !c.major && c.infl >= 40 && Math.random() < 0.25 && !hasSpirit(c, 'armed_neutrality') && (isAtWar(c.tag) || G.plays.some(p => p.b === c.tag))) {
    const ls = G.factions.map(x => x.leader).filter(l => ok(l) && C(l).ideology === c.ideology || (ok(l) && enemiesOf(c.tag).some(e => atWar(l, e)))).sort((a, b) => opinion(b, c.tag) - opinion(a, c.tag)); if (ls[0]) diploAction('joinf', c.tag, ls[0]); }
  if (f && f.leader === c.tag && c.infl >= 60 && Math.random() < 0.3) { const cand = alive().filter(k => !k.major && !factionOf(k.tag) && !k.overlord && k.ideology === c.ideology && DIPLO.invite.can(c.tag, k.tag)).sort((a, b) => opinion(b.tag, c.tag) - opinion(a.tag, c.tag))[0]; if (cand) diploAction('invite', c.tag, cand.tag); }
  if (c.infl > 60 && Math.random() < 0.3) { const fr = alive().filter(k => k.tag !== c.tag && k.ideology === c.ideology && !atWar(c.tag, k.tag) && (c.rel[k.tag] || 0) < 50 && !(c._claims || {})[k.tag]); if (fr.length) { const k = pick(fr); diploAction('improve', c.tag, k.tag); if (opinion(k.tag, c.tag) > 15 && !hasPact('trade', c.tag, k.tag) && Math.random() < 0.3) diploAction('trade', c.tag, k.tag); } }
  // opportunistic plays over claims
  if (isAtWar(c.tag) || c.ideology === 'dem' || G.plays.some(p => p.a === c.tag) || c.infl < 40) return;
  const agg = { fas: 0.1, com: 0.05, aut: 0.03 }[c.ideology] * (G.historical && c.major ? 0.25 : 1) * (0.5 + G.tension / 60); if (Math.random() > agg) return;
  const tg = {}; for (const p of G.P) if ((p.claims.includes(c.tag) || (p.cores.includes(c.tag) && p.orig !== p.owner)) && p.owner !== c.tag && ok(p.owner)) (tg[p.owner] = tg[p.owner] || []).push(p.id);
  for (const t of Object.keys(tg)) { if (canPlay(c.tag, t)) continue; let their = countryStr(t) + 1; for (const k of alive()) if (k.tag !== t && (friendly(k.tag, t) || hasPact('guar', k.tag, t) || hasPact('ally', k.tag, t)) && !hasSpirit(k, 'appeasement') && !hasSpirit(k, 'isolationism')) their += countryStr(k.tag);
    let mine = countryStr(c.tag); for (const k of alive()) if (k.tag !== c.tag && friendly(k.tag, c.tag)) mine += countryStr(k.tag) * 0.5;
    if (mine > their * 1.8) { c.infl -= 40; startPlay(c.tag, t, { type: 'take', provs: tg[t] }); return; } }
}
function aiDecisions(c) { for (const id in DECISIONS) { const d = DECISIONS[id]; if (!d.ai || Math.random() > d.ai * 0.5 || (d.aiIf && !d.aiIf(c))) continue; if (decisionState(c, id) === '' && c.pp > d.cost + 60) { takeDecision(c, id); return; } } }
function aiMonthly(c) { aiFocus(c); aiResearch(c); aiProjects(c); aiIntel(c); aiLend(c); aiLaws(c); aiDiplomacy(c); aiDecisions(c); aiGenerals(c);
  if (c.ig && c.legit < 30 && c.pp > 60) { const out = IG_IDS.filter(g => !c.ig[g].gov && c.ig[g].appr > -3).sort((a, b) => c.ig[b].clout - c.ig[a].clout)[0]; if (out && IG_IDS.filter(g => c.ig[g].gov).length < 3) toggleGov(c, out); } }
function aiWeekly(c) { aiEconomy(c); aiRecruit(c); }

// ---------- army command ----------
function aiArmies(tag) {
  const c = C(tag), mine = armiesOf(tag).filter(a => a.auto && a.divs.length); if (!mine.length) return;
  const foes = enemiesOf(tag).filter(t => !C(t).capitulated || heldBy(t).length);
  if (!foes.length) return aiPeaceDeploy(c, mine);
  const hostile = p => atWar(tag, p.ctrl), strAt = {}, friendAt = {};
  for (const id in G.armies) { const a = G.armies[id]; if (atWar(tag, a.owner)) strAt[a.loc] = (strAt[a.loc] || 0) + armyStr(a); else if (a.owner === tag || friendly(tag, a.owner)) friendAt[a.loc] = (friendAt[a.loc] || 0) + armyStr(a); }
  // front provinces we (or friends) hold next to the enemy
  const fronts = [], seaC = {};
  for (const p of G.P) { if (!(p.ctrl === tag || friendly(tag, p.ctrl))) continue; let need = 0, any = false;
    for (const e of NB[p.id]) { const q = P(e.to); if (!hostile(q)) continue; if (e.sea) { if (seaC[q.ctrl] === undefined) seaC[q.ctrl] = seaOK(tag, q); if (!seaC[q.ctrl] || e.sea > 1500) continue; need += 2; } else need += 10 + (strAt[q.id] || 0); any = true; }
    if (any) fronts.push({ id: p.id, need: need * (p.ctrl === tag ? 1 : 0.5) + p.vp * 2 - (friendAt[p.id] || 0) * 0.6, x: MAP.P[p.id].x, y: MAP.P[p.id].y }); }
  const capThreat = NB[c.capital].some(e => hostile(P(e.to)) && !e.sea) && P(c.capital).ctrl === tag;
  let capGuard = armiesAt(c.capital).some(a => a.owner === tag);
  // the Phoney War: democracies do not open offensives in the first months unless their own soil is invaded
  const phoney = c.ideology === 'dem' && !G.P.some(p => p.owner === tag && p.cores.includes(tag) && p.ctrl !== tag) && G.wars.some(w => (w.att.includes(tag) || w.def.includes(tag)) && G.day - w.start < 300);
  for (const a of mine) {
    if (a.order) continue;
    if (a.battle) { const b = G.battles.find(x => x.id === a.battle); if (b && b.days > 6 && b.bal < 0.4 && sum(a.divs, d => d.org) / a.divs.length < 0.3) { a.path = []; } continue; }
    if (a.path.length && G.day - (a._t || 0) < 25) continue;
    const org = sum(a.divs, d => d.org) / a.divs.length, here = P(a.loc), my = armyStr(a) * (0.4 + 0.6 * org);
    if (capThreat && a.loc === c.capital && !armiesAt(c.capital).some(x => x !== a && x.owner === tag && !x.path.length)) continue;
    // attack options
    let best = null, bs = 0;
    if (org > 0.5 && !a.oos) for (const e of NB[a.loc]) { const q = P(e.to); if (!hostile(q)) continue; if (e.sea && (!seaOK(tag, q) || e.sea > 1500)) continue;
      const def = (strAt[q.id] || 0) * (1 + TERRAIN[q.ter][1] + q.fort * 0.12) * (e.sea ? 1.5 : 1); let att = my; for (const x of armiesAt(a.loc)) if (x !== a && (x.owner === tag || friendly(tag, x.owner)) && (x.path[0] === q.id || x.auto)) att += armyStr(x) * 0.8;
      for (const b of G.battles) if (b.prov === q.id) att += sum(b.att, i => G.armies[i] && G.armies[i].loc !== a.loc ? armyStr(G.armies[i]) : 0);
      const ratio = att / Math.max(1, def); if (def > 0 && ratio < (phoney ? 3.2 : c.major && c.ideology === 'fas' ? 0.95 : c.ws > 60 ? 1.15 : 1.35)) continue; if (phoney && def === 0 && !q.cores.includes(tag) && C(q.owner).major) continue;
      let fn2 = 0; for (const e2 of NB[q.id]) if (!e2.sea && (P(e2.to).ctrl === tag || friendly(tag, P(e2.to).ctrl))) fn2++; if (fn2 < 2 && !e.sea && q.vp < 10 && Math.random() < (c.major && c.ideology === 'fas' ? 0.4 : 0.8)) continue;
      const s = q.vp + fn2 * 2 + (def === 0 ? 6 : 0) + Math.min(4, ratio) + (q.cores.includes(tag) ? 4 : 0) + (q.id === C(q.owner).capital ? 6 : 0) + Math.random() * 2; if (s > bs) { bs = s; best = q.id; } }
    if (best !== null && (!a.home || P(best).cores.includes(tag))) { a.path = [best]; a.prog = 0; a._t = G.day; continue; }
    if (a.home) { if (!here.cores.includes(tag) && P(c.capital).ctrl === tag) orderMove(a, c.capital); const hf = fronts.filter(f => P(f.id).cores.includes(tag) && P(f.id).ctrl === tag && NB[f.id].some(e => !e.sea && hostile(P(e.to)))); if (hf.length && !hf.some(f => f.id === a.loc)) { hf.sort((x, y) => y.need - x.need); orderMove(a, hf[0].id); a._t = G.day; } continue; }
    // otherwise go where the front needs us
    const isFront = fronts.some(f => f.id === a.loc); if (isFront && Math.random() < 0.8) continue; if (!fronts.length) continue;
    const ax = MAP.P[a.loc].x, ay = MAP.P[a.loc].y; let tgt = null, ts = -1e9;
    for (const f of fronts) { const d = Math.hypot(f.x - ax, f.y - ay); const s = f.need - d * 0.06 + Math.random() * 6; if (s > ts) { ts = s; tgt = f; } }
    if (tgt && tgt.id !== a.loc) { if (orderMove(a, tgt.id)) { a._t = G.day; tgt.need -= armyStr(a) * 0.6; } }
  }
}
function aiPeaceDeploy(c, mine) {
  if ((G.day + c.capital) % 20 > 1) return; const tag = c.tag, spots = [{ id: c.capital, w: 30 }];
  for (const p of G.P) { if (p.ctrl !== tag) continue; let w = 0; for (const e of NB[p.id]) { const q = P(e.to); if (e.sea || q.ctrl === tag || friendly(tag, q.ctrl)) continue; const o = opinion(tag, q.ctrl); w += (o < -20 ? 14 : o < 10 ? 5 : 1) + ((c._claims || {})[q.ctrl] || (C(q.ctrl)._claims || {})[tag] ? 10 : 0); } if (w) spots.push({ id: p.id, w: w + p.vp }); }
  spots.sort((a, b) => b.w - a.w); const use = spots.slice(0, Math.max(1, Math.min(spots.length, mine.filter(a => !a.garrison).length))), taken = {};
  for (const a of mine) { if (a.garrison || a.path.length) { taken[a.loc] = 1; continue; } }
  for (const a of mine) { if (a.garrison || a.path.length) continue; if (use.some(s => s.id === a.loc) && !taken[a.loc]) { taken[a.loc] = 1; continue; }
    const s = use.find(x => !taken[x.id]); if (s && s.id !== a.loc) { if (orderMove(a, s.id)) taken[s.id] = 1; } }
}

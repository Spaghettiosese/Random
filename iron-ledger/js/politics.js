// Politics: interest groups, legitimacy, laws, elections, ideology and civil wars.
'use strict';
const ALT_LEADERS = {
  GER: { dem: ['Konrad Adenauer', 'Zentrum'], com: ['Ernst Thälmann', 'KPD'], aut: ['Wilhelm III', 'DNVP'], fas: ['Adolf Hitler', 'NSDAP'] },
  SOV: { dem: ['Alexander Kerensky', 'Constituent Assembly'], fas: ['Konstantin Rodzaevsky', 'All-Russian Fascists'], aut: ['Vladimir Kirillovich', 'Zemsky Sobor'], com: ['Joseph Stalin', 'VKP(b)'] },
  USA: { fas: ['William Dudley Pelley', 'Silver Legion'], com: ['Earl Browder', 'CPUSA'], aut: ['Douglas MacArthur', 'Emergency Government'], dem: ['Franklin D. Roosevelt', 'Democratic Party'] },
  ENG: { fas: ['Oswald Mosley', 'BUF'], com: ['Harry Pollitt', 'CPGB'], aut: ['Edward VIII', 'King\'s Party'], dem: ['Winston Churchill', 'Conservative Party'] },
  FRA: { fas: ['Jacques Doriot', 'PPF'], com: ['Maurice Thorez', 'PCF'], aut: ['Philippe Pétain', 'État Français'], dem: ['Léon Blum', 'Popular Front'] },
  ITA: { dem: ['Alcide De Gasperi', 'Christian Democracy'], com: ['Palmiro Togliatti', 'PCI'], aut: ['Victor Emmanuel III', 'Royal Government'], fas: ['Benito Mussolini', 'PNF'] },
  JAP: { dem: ['Saitō Takao', 'Rikken Minseitō'], com: ['Sanzō Nosaka', 'JCP'], aut: ['Fumimaro Konoe', 'Imperial Court'], fas: ['Hideki Tojo', 'Imperial Rule Assistance'] },
  CHI: { dem: ['Sun Fo', 'Democratic League'], com: ['Mao Zedong', 'CCP'], fas: ['Wang Jingwei', 'Reorganised KMT'], aut: ['Chiang Kai-shek', 'Kuomintang'] },
  SPA: { fas: ['Francisco Franco', 'Falange'], com: ['José Díaz', 'PCE'], aut: ['Alfonso Carlos', 'Carlist Communion'], dem: ['Manuel Azaña', 'Popular Front'] },
  POL: { dem: ['Władysław Sikorski', 'Front Morges'], fas: ['Bolesław Piasecki', 'ONR-Falanga'], com: ['Bolesław Bierut', 'KPP'] },
  HUN: { fas: ['Ferenc Szálasi', 'Arrow Cross'], dem: ['Zoltán Tildy', 'Smallholders'], com: ['Mátyás Rákosi', 'KMP'] },
  ROM: { fas: ['Corneliu Codreanu', 'Iron Guard'], dem: ['Iuliu Maniu', 'National Peasants'], com: ['Gheorghe Gheorghiu-Dej', 'PCR'] },
  YUG: { com: ['Josip Broz Tito', 'KPJ'], fas: ['Ante Pavelić', 'Ustaše'], dem: ['Vladko Maček', 'Peasant Party'] },
  BRA: { fas: ['Plínio Salgado', 'Integralists'], com: ['Luís Carlos Prestes', 'PCB'], dem: ['Armando de Sales', 'Constitutionalists'] },
  ARG: { fas: ['Juan Perón', 'GOU'], dem: ['Roberto Ortiz', 'Radical Civic Union'] },
  TUR: { dem: ['Celâl Bayar', 'Democrat Party'], fas: ['Nihal Atsız', 'Pan-Turanists'] },
  AUT: { fas: ['Arthur Seyss-Inquart', 'DNSAP'], dem: ['Karl Renner', 'SDAPÖ'], aut: ['Otto von Habsburg', 'Legitimists'] },
  RAJ: { dem: ['Jawaharlal Nehru', 'Indian National Congress'], fas: ['Subhas Chandra Bose', 'Forward Bloc'], com: ['P. C. Joshi', 'CPI'] },
  MEX: { dem: ['Juan Almazán', 'PRUN'], fas: ['Salvador Abascal', 'Sinarquistas'], com: ['Vicente Lombardo', 'CTM'] }
};
const GEN_PARTY = { dem: 'Democratic Coalition', fas: 'National Front', com: 'Communist Party', aut: 'National Union' };
const IG_IDEO = { ind: { dem: 0.6, aut: 0.3, fas: 0.1 }, land: { aut: 0.7, fas: 0.2, dem: 0.1 }, union: { com: 0.45, dem: 0.55 }, army: { aut: 0.5, fas: 0.4, dem: 0.1 }, intel: { dem: 0.75, com: 0.25 }, pb: { dem: 0.4, fas: 0.35, aut: 0.25 }, rural: { aut: 0.4, dem: 0.4, com: 0.1, fas: 0.1 }, devout: { aut: 0.7, dem: 0.2, fas: 0.1 } };
const hasElections = c => (c.laws.power === 'universal' || c.laws.power === 'census') && c.laws.gov !== 'oneparty' && c.laws.gov !== 'council' && c.laws.gov !== 'theocracy';

function politicsDaily(c) {
  c.pp += Math.max(0.15, 0.55 + c.legit / 180 + M(c, 'pp')); if (c.pp > 2000) c.pp = 2000;
  c.infl = Math.min(400, c.infl + (0.25 + (c.major ? 0.25 : 0)) * (1 + M(c, 'infl')));
}
function igApproval(c, g) {
  const o = c.ig[g]; let a = 0;
  for (const cat in LAWS) { const l = LAWS[cat].laws[c.laws[cat]]; a += (l[2][g] || 0) * 1.6; }
  a += o.gov ? 3 : -1; a += (c.sol - 11) * 0.35; o.mods = o.mods.filter(m => m.until > G.day); for (const m of o.mods) a += m.v;
  if (g === 'army') a += c.ws > 60 ? 2 : 0; if (g === 'union' || g === 'rural') a -= c.rad * 8;
  return clamp(a, -20, 20);
}
function politicsMonthly(c) {
  const st = c.stats, indS = st.wf ? st.emp / st.wf : 0.2, peasS = 1 - indS, atW = isAtWar(c.tag) ? 1 : 0; let tot = 0;
  const f = { ind: 0.5 + 1.8 * indS, land: (0.5 + peasS) * (c.laws.econ === 'traditionalism' ? 1.3 : 1) * (c.laws.power === 'universal' ? 0.7 : 1), union: (0.4 + 2.2 * indS) * (c.laws.labor === 'no_rights' ? 0.7 : 1.1) * (c.laws.power === 'universal' ? 1.2 : 1),
    army: (1 + 0.6 * atW + c.ws / 200) * (c.laws.power === 'autocracy' ? 1.25 : 1), intel: 0.4 + 1.1 * c.lit, pb: 0.8 + 0.5 * indS, rural: (0.4 + 1.3 * peasS) * (c.laws.power === 'universal' ? 1.2 : 1), devout: 1.5 - 0.9 * c.lit };
  for (const g of IG_IDS) { const o = c.ig[g]; o.clout += (o.base * f[g] - o.clout) * 0.25; tot += o.clout; }
  let gc = 0, ng = 0, happy = 0; for (const g of IG_IDS) { const o = c.ig[g]; o.share = o.clout * 100 / tot; o.appr = igApproval(c, g); if (o.gov) { gc += o.share; ng++; happy += o.appr; } }
  if (!ng) { c.ig.army.gov = true; }
  c.legitBonus = (c.legitBonus || 0) * 0.97;
  const base = { monarchy: 14, theocracy: 14, oneparty: 16, council: 14, presidential: 8, parliamentary: 6 }[c.laws.gov] + (c.laws.power === 'autocracy' ? 8 : 0);
  c.legit = clamp(8 + base + gc * 0.6 - 9 * Math.max(0, ng - 3) + M(c, 'legit') + c.sup[c.ideology] * 0.15 + happy * 0.6 + c.legitBonus, 0, 100);
  // radicals
  const drop = (c.solPrevM === undefined ? 0 : c.solPrevM - c.sol); c.solPrevM = c.sol;
  let rt = 0.05 + Math.max(0, 9 - c.sol) * 0.02 + Math.max(0, drop) * 0.06 + c.warExh * 0.004 + (TAX_RATE[c.taxLevel] - 0.18) * 0.5 + (100 - c.legit) * 0.0012;
  rt = clamp(rt * (1 + M(c, 'rad')), 0, 1); c.rad += (rt - c.rad) * 0.15;
  const stT = clamp(30 + c.legit * 0.25 + (c.sol - 9) * 0.9 - c.rad * 70 + M(c, 'stab') - c.warExh * 0.35 + (c.capitulated ? -20 : 0), 0, 100); c.stab += (stT - c.stab) * 0.12;
  const defWar = G.wars.some(w => w.def.includes(c.tag));
  const wsT = clamp(({ fas: 58, com: 52, aut: 42, dem: 26 })[c.ideology] + G.tension * 0.35 + (defWar ? 35 : atW ? 12 : 0) + M(c, 'ws') - c.warExh * 0.5, 0, 100); c.ws += (wsT - c.ws) * 0.12;
  c.warExh = Math.max(0, c.warExh - (atW ? 0 : 2));
  // ideology drift
  const dr = { dem: M(c, 'drift_dem'), fas: M(c, 'drift_fas'), com: M(c, 'drift_com'), aut: M(c, 'drift_aut') }; dr[c.ideology] += 0.25 + (c.stab - 50) * 0.006;
  if (c.rad > 0.3) { dr.com += (c.rad - 0.3) * 2; dr.fas += (c.rad - 0.3) * 1.5; } shiftSupport(c, dr);
  if (c.enact) lawProgress(c);
  if (hasElections(c) && G.day >= c.nextElection) election(c);
  else if (!hasElections(c)) { const top = Object.keys(c.sup).sort((a, b) => c.sup[b] - c.sup[a])[0]; if (top !== c.ideology && c.sup[top] > 52 && !c.flags.crisis) { c.flags.crisis = G.day; queueEvent('ideology_crisis', c.tag, 5, { ideo: top }); } }
  if (c.flags.crisis && G.day - c.flags.crisis > 540) delete c.flags.crisis;
  // unrest
  if (c.stab < 22 && c.rad > 0.35 && !isAtWar(c.tag) && Math.random() < 0.08 && !c.flags.uprising) { c.flags.uprising = G.day; queueEvent('uprising', c.tag, 3); }
  for (const s of c.spirits.slice()) if (s.until && s.until <= G.day) removeSpirit(c, s.id);
}
function shiftSupport(c, v) {
  for (const k in v) { if (!v[k]) continue; const d = Math.min(v[k], 100 - c.sup[k]); const others = Object.keys(c.sup).filter(x => x !== k), ot = sum(others, x => c.sup[x]) || 1;
    c.sup[k] += d; for (const x of others) c.sup[x] = Math.max(0, c.sup[x] - d * c.sup[x] / ot); }
  let t = 0; for (const k in c.sup) t += c.sup[k]; for (const k in c.sup) c.sup[k] *= 100 / t;
}
function setIdeology(c, ideo, quiet) {
  if (c.ideology === ideo) return; const old = c.ideology; c.ideology = ideo;
  const pr = LAW_PRESET[ideo]; for (const cat of ['gov', 'power', 'econ', 'speech', 'security']) c.laws[cat] = pr[cat]; if (ideo !== 'dem') c.laws.labor = pr.labor;
  if (COUNTRY_DEF[c.tag] && COUNTRY_DEF[c.tag].law && COUNTRY_DEF[c.tag].law.gov === 'monarchy' && (ideo === 'dem' || ideo === 'aut')) c.laws.gov = 'monarchy';
  for (const g of IG_IDS) c.ig[g].gov = IDEO_GOV[ideo].includes(g);
  const alt = (ALT_LEADERS[c.tag.slice(0, 3)] || {})[ideo]; if (alt) { c.leader = alt[0]; c.party = alt[1]; } else { c.party = GEN_PARTY[ideo]; c.leader = pick(NAMEPOOL[c.np]) + ' ' + pick(['Government', 'Cabinet', 'Council']); }
  if (c.sup[ideo] < 56) shiftSupport(c, { [ideo]: 56 - c.sup[ideo] });
  c.enact = null; dirty(c); recalcRelations(c.tag);
  const f = factionOf(c.tag); if (f && f.leader !== c.tag && C(f.leader).ideology !== ideo && !isAtWar(c.tag)) leaveFaction(c.tag);
  if (!quiet) logMsg(`${c.name}: a ${IDEO[ideo][0].toLowerCase()} government under ${c.leader} takes power.`, 'world', [c.tag]);
  UIH.mapDirty();
}
// ---------- laws ----------
function lawAllowed(c, cat, law) {
  if (c.laws[cat] === law) return 'Already in force';
  const x = LAWS[cat].laws[law][3];
  if (LAWS[cat].instant) { if (x.war && !isAtWar(c.tag)) return 'Requires being at war'; const need = (x.ws || 0) - (c.ideology === 'fas' || c.ideology === 'com' ? 20 : 0); if (c.ws < need) return `Requires ${need}% war support`; if (c.pp < 100) return 'Requires 100 political power'; return ''; }
  if (c.enact) return 'Another law is being debated'; if (c.pp < 50) return 'Requires 50 political power';
  if (cat === 'gov' && law === 'council' && c.ideology !== 'com') return 'Requires a communist government';
  if (cat === 'econ' && law === 'command' && c.ideology !== 'com') return 'Requires a communist government';
  if (cat === 'gov' && law === 'oneparty' && c.ideology === 'dem') return 'Unthinkable under a democratic government';
  if (cat === 'power' && law === 'universal' && (c.ideology === 'fas')) return 'Unthinkable under a fascist government';
  return '';
}
function lawChance(c, cat, law) {
  const cur = LAWS[cat].laws[c.laws[cat]][2], nw = LAWS[cat].laws[law][2]; let ch = 28 + c.legit * 0.25;
  for (const g of IG_IDS) { const o = c.ig[g], d = (nw[g] || 0) - (cur[g] || 0); ch += d * (o.share || o.clout) * (o.gov ? 0.75 : 0.22); }
  return clamp(ch + (c.enact && c.enact.law === law ? c.enact.bonus : 0), 3, 97);
}
function startLaw(c, cat, law) {
  if (lawAllowed(c, cat, law)) return false;
  if (LAWS[cat].instant) { c.pp -= 100; setLaw(c, law); if (c.tag === G.player) UIH.notify(`${lawName(law)} is now in force.`, 'law'); return true; }
  c.pp -= 50; c.enact = { cat, law, prog: 0, bonus: 0 }; return true;
}
function lawProgress(c) {
  const e = c.enact; e.prog += 25 * (0.6 + c.legit / 120);
  if (e.prog < 100) return;
  const ch = lawChance(c, e.cat, e.law);
  if (Math.random() * 100 < ch) { const cur = LAWS[e.cat].laws[c.laws[e.cat]][2], nw = LAWS[e.cat].laws[e.law][2];
    for (const g of IG_IDS) { const d = (nw[g] || 0) - (cur[g] || 0); if (d) c.ig[g].mods.push({ v: d * 2, until: G.day + 540 }); }
    setLaw(c, e.law); c.enact = null; logMsg(`${c.name} enacts ${lawName(e.law)}.`, c.major ? 'world' : 'info', [c.tag]);
    if (e.cat === 'gov' || e.cat === 'power') reviewIdeology(c);
  } else { e.prog = 45; e.bonus += 12; if (c.tag === G.player) UIH.notify(`The debate over ${lawName(e.law)} stalls. Supporters regroup (+12% chance).`, 'law'); c.stab = Math.max(0, c.stab - 1); }
}
function reviewIdeology(c) {
  if (c.ideology !== 'dem' && hasElections(c) && c.laws.speech !== 'outlawed') setIdeology(c, 'dem');
  else if (c.ideology === 'dem' && !hasElections(c)) setIdeology(c, 'aut');
}
function toggleGov(c, g) {
  if (c.pp < 25) return false; const o = c.ig[g]; if (o.gov && IG_IDS.filter(x => c.ig[x].gov).length <= 1) return false;
  c.pp -= 25; o.gov = !o.gov; o.mods.push({ v: o.gov ? 2 : -4, until: G.day + 360 }); politicsMonthly(c); return true;
}
function election(c) {
  c.nextElection = G.day + 365 * 4 + rint(-20, 20);
  const votes = {}, ide = { dem: 0, fas: 0, com: 0, aut: 0 }; let tot = 0;
  for (const g of IG_IDS) { const o = c.ig[g]; votes[g] = o.clout * Math.max(0.2, 1 + o.appr / 14) * rnd(0.85, 1.15); tot += votes[g]; }
  for (const g of IG_IDS) { votes[g] = votes[g] * 100 / tot; for (const i in IG_IDEO[g]) ide[i] += votes[g] * IG_IDEO[g][i]; }
  for (const i in ide) ide[i] = ide[i] * 0.4 + c.sup[i] * 0.6;
  const order = IG_IDS.slice().sort((a, b) => votes[b] - votes[a]); let acc = 0; const gov = [];
  for (const g of order) { if (acc > 50 || gov.length >= 3) break; if (gov.length && (c.ig[g].appr < -6)) continue; gov.push(g); acc += votes[g]; }
  for (const g of IG_IDS) c.ig[g].gov = gov.includes(g);
  const win = Object.keys(ide).sort((a, b) => ide[b] - ide[a])[0];
  shiftSupport(c, { [win]: 4 });
  const txt = `${IGS[gov[0]][0]} lead the new government (${gov.map(g => IGS[g][0]).join(', ')}).`;
  if (win !== c.ideology && ide[win] > (win === 'dem' ? 40 : 50)) { logMsg(`Election in ${c.name}: the ${IDEO[win][0].toLowerCase()} opposition wins. ${txt}`, 'world', [c.tag]); setIdeology(c, win, true); if (win !== 'dem') { c.laws.power = LAW_PRESET[win].power; dirty(c); } }
  else logMsg(`Election in ${c.name}: ${txt}`, c.major ? 'world' : 'info', [c.tag]);
  if (c.tag === G.player) UIH.popup({ title: `Election in ${c.name}`, icon: '🗳️', desc: `The votes are counted.<br><br>${IG_IDS.map(g => `${IGS[g][1]} ${IGS[g][0]}: <b>${votes[g].toFixed(1)}%</b>`).join('<br>')}<br><br>${txt}`, options: [{ name: 'The people have spoken.' }] });
  politicsMonthly2(c);
}
function politicsMonthly2(c) { let tot = 0; for (const g of IG_IDS) tot += c.ig[g].clout; for (const g of IG_IDS) { c.ig[g].share = c.ig[g].clout * 100 / tot; c.ig[g].appr = igApproval(c, g); } }
// ---------- civil war ----------
function startCivilWar(tag, ideo, frac, name, opt = {}) {
  const c = C(tag); let n = 1; while (G.C[tag.slice(0, 3) + n]) n++; const rt = tag.slice(0, 3) + n;
  const ps = heldBy(tag).filter(p => p.id !== c.capital); if (ps.length < 1) return null;
  // revolt spreads from the province furthest from the capital
  const cap = MAP.P[c.capital]; ps.sort((a, b) => Math.hypot(MAP.P[b.id].x - cap.x, MAP.P[b.id].y - cap.y) - Math.hypot(MAP.P[a.id].x - cap.x, MAP.P[a.id].y - cap.y));
  let seedP = opt.seed ? PN(opt.seed) : ps[0]; if (seedP.owner !== tag) seedP = ps[0];
  const want = Math.max(1, Math.round((ps.length + 1) * frac)), got = new Set([seedP.id]), fr = [seedP.id];
  while (got.size < want && fr.length) { const x = fr.shift(); for (const e of NB[x]) { const q = P(e.to); if (got.size < want && q.owner === tag && q.ctrl === tag && q.id !== c.capital && !got.has(q.id)) { got.add(q.id); fr.push(q.id); } } }
  for (const p of ps) { if (got.size >= want) break; got.add(p.id); }
  const r = G.C[rt] = JSON.parse(JSON.stringify(c, (k, v) => k[0] === '_' ? undefined : v));
  Object.assign(r, { tag: rt, name: name || `${IDEO[ideo][0]} ${c.name}`, color: shade(c.color, ideo === 'com' ? '#c0392b' : ideo === 'fas' ? '#3a2a1a' : ideo === 'dem' ? '#3d7fd9' : '#888888'), ai: true, ideology: c.ideology, focus: { cur: null, prog: 0, done: Object.assign({}, c.focus.done) }, gens: [], queue: [], pq: [], enact: null, overlord: null, rel: {}, money: c.money * frac, invPool: 0, training: [], civilOf: tag, flags: {} });
  c.money *= (1 - frac); r.capital = seedP.id; for (const o of alive()) { if (o.tag !== rt) { r.rel[o.tag] = 0; o.rel[rt] = 0; } }
  for (const id of got) { const p = P(id); p.owner = rt; p.ctrl = rt; if (!p.cores.includes(rt)) p.cores.push(rt); }
  for (const p of provsOf(tag)) if (!p.cores.includes(rt)) p.cores.push(rt); for (const id of got) if (!P(id).cores.includes(tag)) P(id).cores.push(tag);
  // army splits
  const mine = Object.values(G.armies).filter(a => a.owner === tag);
  for (const a of mine) { if (got.has(a.loc) || Math.random() < frac * 0.5) { a.owner = rt; a.gen = null; a.path = []; if (!got.has(a.loc)) a.loc = r.capital; } else if (got.has(a.loc)) a.loc = c.capital; }
  for (const g of c.gens.slice()) if (Math.random() < frac && !g.army) { c.gens.splice(c.gens.indexOf(g), 1); r.gens.push(g); }
  for (const g of c.gens) if (g.army && (!G.armies[g.army] || G.armies[g.army].owner !== tag)) g.army = null;
  (opt.gens || []).forEach(g => r.gens.push({ id: G.nid++, name: g[0], skill: g[1], trait: g[2], xp: 0 }));
  for (const k in r.stock) { r.stock[k] = c.stock[k] * frac; c.stock[k] *= (1 - frac); }
  r.manpower = c.manpower * frac; c.manpower *= 1 - frac;
  setIdeology(r, ideo, true); r.sup = { dem: 5, fas: 5, com: 5, aut: 5 }; r.sup[ideo] = 85; r.stab = 55; r.ws = 80; c.ws = Math.max(c.ws, 70);
  spawnDivisions(r, 'mil', Math.max(2, Math.round(got.size * 1.2)), r.capital);
  const w = declareWar(rt, tag, [{ by: rt, vs: tag, type: 'annex' }, { by: tag, vs: rt, type: 'annex' }], `${c.adj} Civil War`, true); if (w) w.civil = true;
  logMsg(`Civil war erupts in ${c.name}! ${r.name} takes up arms.`, 'world'); UIH.mapDirty(); return r;
}
function shade(a, b) { const h = x => [1, 3, 5].map(i => parseInt(x.substr(i, 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(v * 0.55 + B[i] * 0.45).toString(16).padStart(2, '0')).join(''); }

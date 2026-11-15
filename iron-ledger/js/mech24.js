// 2.4 Five new mechanics.
//  1. Supply lines: armies draw supply from the capital, ports and supply depots along railways and roads. The further
//     from a source, the weaker they fight and the slower they recover; deep in enemy country they waste away. Railways
//     of another gauge (the Russian broad gauge) are useless until converted, a few provinces at a time.
//  2. Mobilisation and reserves: trained reservists wait at home. Alert, partial and general mobilisation call them up
//     after two or three weeks, cost output and alarm the neighbours; demobilisation sends them home.
//  3. Crowns and dynasties: monarchs with traits, ages, heirs and the prestige of the crown; royal tours and royal
//     weddings; deaths, successions and regencies; the abdication crisis of 1936; crowns in exile.
//  4. Arms control and international law: the naval treaties, the pledge not to bomb cities and the Geneva Conventions;
//     signing, denouncing, breaching; disarmament conferences.
//  5. Prestige and the great power ranking: every nation's standing from industry, armies, fleets and prestige; the
//     eight great powers get an extra envoy and more influence, and losing that rank shakes a nation.
'use strict';
// ======================= 1. supply lines =======================
const BROAD = new Set(['SOV', 'MON']);
const gaugeOfTag = t => (BROAD.has((t || '').slice(0, 3)) ? 'r' : 's');
const gaugeOfProv = p => p.gauge || (BROAD.has((p.orig || p.owner || '').slice(0, 3)) ? 'r' : 's');
const railFor = (p, t) => (p.b.railway || 0) > 0 && (gaugeOfProv(p) === gaugeOfTag(t) || p.gconv === t);
const supSources = c => { const s = new Set([c.capital]); for (const id of c.depots || []) if (P(id).ctrl === c.tag || friendly(c.tag, P(id).ctrl)) s.add(id);
  for (const p of G.P) if ((p.ctrl === c.tag || (friendly(c.tag, p.ctrl) && !atWar(c.tag, p.ctrl))) && ((p.b.port && p.coastal && !(c.blockade > 0.3)) || (p.cores.includes(c.tag) && p.owner === c.tag && railFor(p, c.tag)))) s.add(p.id); return s; };
function supDist(c) { const S = supSources(c), dist = new Map(), heap = [];
  const push = (d, id) => { heap.push([d, id]); let i = heap.length - 1; while (i > 0) { const j = (i - 1) >> 1; if (heap[j][0] <= heap[i][0]) break; [heap[i], heap[j]] = [heap[j], heap[i]]; i = j; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[i], heap[m]] = [heap[m], heap[i]]; i = m; } } return top; };
  for (const id of S) { dist.set(id, 0); push(0, id); }
  while (heap.length) { const [d, x] = pop(); if (d > (dist.get(x) ?? 1e9)) continue; if (d > 14) continue;
    for (const e of NB[x]) { if (e.sea) continue; const q = P(e.to); if (!(q.ctrl === c.tag || friendly(c.tag, q.ctrl))) continue; const w = typeof wxOf === 'function' && G.wx ? wxOf(q.id) : null, rough = 'mjs'.includes(q.ter) ? 0.5 : 0, wet = w && (w.g === 'mud' || w.g === 'deep' || w.g === 'flood') ? 0.6 : 0;
      const step = railFor(q, c.tag) ? 0.35 + wet * 0.3 : 1 + rough + wet, nd = d + step; if (nd < (dist.get(q.id) ?? 1e9)) { dist.set(q.id, nd); push(nd, q.id); } } }
  return dist; }
const SUP_LV = [['Supplied', 1, ''], ['Stretched', 0.9, 'Attack and defence -10%, slower recovery'], ['Strained', 0.75, 'Attack and defence -25%; the divisions waste away'], ['Starving', 0.6, 'Attack and defence -40%; heavy losses every week']];
const supLevel = d => (d === undefined ? 3 : d <= 3 ? 0 : d <= 6 ? 1 : d <= 10 ? 2 : 3);
function supplyWeekly(c) { const war = isAtWar(c.tag), mine = armiesOf(c.tag); if (!war) { for (const a of mine) a.sl = 0; c._sd = null; return; }
  const D = supDist(c); c._sd = D; for (const a of mine) { if (a.oos) { a.sl = 0; continue; } /* cut off entirely: the old out-of-supply rule applies instead */ const lv = supLevel(D.get(a.loc)); a.sl = lv; if (lv >= 2) for (const d of a.divs) { d.str = Math.max(0.1, d.str - (lv === 2 ? 0.01 : 0.025)); d.org = Math.min(d.org, SUP_LV[lv][1]); } }
  // the gauge: engineers convert two railway provinces a fortnight, working out from usable track
  if ((G.day >> 3) % 2 === 0) { let n = 0; for (const p of G.P) { if (n >= 2) break; if (p.ctrl !== c.tag || !(p.b.railway > 0) || railFor(p, c.tag)) continue; if (NB[p.id].some(e => !e.sea && (P(e.to).ctrl === c.tag || friendly(c.tag, P(e.to).ctrl)) && railFor(P(e.to), c.tag))) { p.gconv = c.tag; n++; } } }
  // the AI builds depots where its armies starve
  if (c.ai && (c.depots || []).length < depotCap(c) && c.money > 4 * wkInc(c)) { const starving = mine.filter(a => a.sl >= 2 && P(a.loc).ctrl === c.tag); if (starving.length) { const at = starving.sort((x, y) => y.divs.length - x.divs.length)[0].loc, back = NB[at].map(e => e.to).filter(id => P(id).ctrl === c.tag).sort((x, y) => (D.get(x) || 99) - (D.get(y) || 99))[0]; buildDepot(c, back !== undefined ? back : at); } } }
const depotCap = c => 2 + Math.floor(G.P.filter(p => p.ctrl === c.tag).length / 25);
function buildDepot(c, id) { const p = P(id); c.depots = (c.depots || []).filter(x => P(x).ctrl === c.tag); if (!p || p.ctrl !== c.tag) return 'Only in a province we hold'; if (c.depots.includes(id)) return 'Already a depot'; if (c.depots.length >= depotCap(c)) return `At most ${depotCap(c)} depots`;
  const cost = 2 * wkInc(c); if (c.money < cost) return 'Needs two weeks of income'; c.money -= cost; c.depots.push(id); if (c.tag === G.player) UIH.notify(`A supply depot opens at ${p.name}.`, 'good'); UIH.mapDirty(); return ''; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (!armies.length) return r; let n = 0, f = 0; for (const a of armies) { n += a.divs.length; f += a.divs.length * SUP_LV[a.sl || 0][1]; } if (n) { const k = f / n; r.atk *= k; r.tough *= k; } return r; }; }
// ======================= 2. mobilisation and reserves =======================
const MOB = [['Peacetime', 'The army at its peacetime strength.', 0], ['Alert', 'Leave cancelled, units at readiness. Organisation recovers faster. Costs a little; the neighbours notice.', 0.1], ['Partial Mobilisation', 'Half the reservists called up within two weeks. Output -3%; world tension rises.', 0.2], ['General Mobilisation', 'Every reservist called up within three weeks. Output -8%, stability -2; the neighbours are alarmed.', 0.35]];
SPIRITS.mob_alert = ['Alert', 'The army stands at readiness.', { org: 0.05 }]; SPIRITS.mob_partial = ['Partial Mobilisation', 'Reservists in uniform; factories short of hands.', { output: -0.03, org: 0.05 }]; SPIRITS.mob_general = ['General Mobilisation', 'The whole nation in arms.', { output: -0.08, stab: -2, org: 0.05 }];
const CONSC_F = { volunteer: 0.3, limited: 0.6, extensive: 0.9, requirement: 1.1, all_adults: 1.3 };
const mobOf = c => c.mob || (c.mob = { st: 0, res: Math.round(mobCap(c) * 0.6), next: null });
const mobCap = c => Math.round(((c.stats && c.stats.corePop) || 2000) / 2500 * (CONSC_F[c.laws.conscription] || 0.6));
function mobSet(c, st) { const M0 = mobOf(c); if (st === M0.st && !M0.next) return ''; if (st < 0 || st > 3) return 'No such stage';
  if (st > M0.st) { const days = st === 3 ? 21 : st === 2 ? 14 : 3; M0.next = { st, day: G.day + days }; G.tension = clamp(G.tension + (st === 3 ? 4 : st === 2 ? 2 : 0.5), 0, 100);
    for (const k of alive()) if (k.tag !== c.tag && (NB[k.capital] || []).length && G.P.some(p => p.owner === k.tag && NB[p.id].some(e => !e.sea && P(e.to).owner === c.tag))) { if (typeof omAdd === 'function') omAdd(k.tag, c.tag, 'mobilised', st === 3 ? -15 : -6, 365); if (k.ai && st >= 2 && opinion(k.tag, c.tag) < 0 && !mobOf(k).next && mobOf(k).st < st - 1 && !isAtWar(k.tag)) mobSet(k, st - 1); }
    if (st >= 2) logMsg(`${c.name} orders ${MOB[st][0].toLowerCase()}.`, c.major && st === 3 ? 'world' : 'info', [c.tag]); return ''; }
  // standing down: called-up reservists go home
  M0.next = null; for (const a of armiesOf(c.tag)) { if (!a.reserve || a.battle) continue; const keep = st === 2 ? Math.ceil(a.divs.length / 2) : 0; const go = a.divs.length - keep; M0.res += go * 0.9; a.divs.splice(0, go); if (!a.divs.length) removeArmy(a); }
  M0.st = st; mobSpirits(c); return ''; }
function mobSpirits(c) { const st = mobOf(c).st; for (const [k, s] of [['mob_alert', 1], ['mob_partial', 2], ['mob_general', 3]]) { if (st === s && !hasSpirit(c, k)) addSpirit(c, k); else if (st !== s && hasSpirit(c, k)) removeSpirit(c, k); } }
function mobDaily(c) { const M0 = mobOf(c); if (M0.next && G.day >= M0.next.day) { const st = M0.next.st; M0.next = null; const share = st === 3 ? 1 : st === 2 ? 0.5 : 0, n = Math.floor(M0.res * share - (st === 3 && M0.st === 2 ? 0 : 0));
    if (n > 0) { const at = c.capital; M0.res -= n; const before = new Set(armiesOf(c.tag).map(a => a.id)); spawnDivisions(c, 'inf', n, at, 0.8); for (const a of armiesOf(c.tag)) if (!before.has(a.id)) { a.reserve = true; a.name = `${c.adj} Reserve Army`; } if (c.tag === G.player) UIH.notify(`${n} reserve divisions have reported for duty.`, 'good'); }
    M0.st = st; mobSpirits(c); }
  if (dateObj(G.day).getUTCDate() === 1) { const cap = mobCap(c); if (M0.st <= 1 && M0.res < cap) M0.res = Math.min(cap, M0.res + Math.max(0.3, cap / 36)); if (M0.st >= 1) c.money -= MOB[M0.st][2] * wkInc(c);
    if (c.ai) { const war = isAtWar(c.tag), crisis = G.plays.some(p => p.a === c.tag || p.b === c.tag || (p.A || []).includes(c.tag) || (p.B || []).includes(c.tag)); const direct = G.plays.some(p => p.a === c.tag || p.b === c.tag), front = war && enemiesOf(c.tag).some(e => C(e).major || G.P.some(p => p.owner === c.tag && NB[p.id].some(x => !x.sea && P(x.to).ctrl === e))), want = front ? 3 : war || direct ? 2 : (crisis && c.major) || (G.tension > 75 && c.major) ? 1 : 0; if (want > M0.st && !M0.next) mobSet(c, want); else if (want < M0.st && !war && !crisis && Math.random() < 0.15) mobSet(c, want); } } }
// ======================= 3. crowns and dynasties =======================
const CROWN_TRAIT = { beloved: ['Beloved', { stab: 3 }], constitutional: ['Constitutional', { legit: 5 }], soldier: ['Soldier King', { org: 0.03, ws: 2 }], meddler: ['Meddler', { legit: -4, pp: 0.1 }], cautious: ['Cautious', { stab: 2, ws: -2 }], playboy: ['Playboy', { legit: -3, stab: -1 }], reformer: ['Reformer', { research: 0.02, stab: -1 }], ironwill: ['Iron Will', { ws: 4 }], old: ['Aged', { stab: 1, research: -0.01 }], regency: ['Regency', { legit: -5 }], puppet: ['Puppet Emperor', { legit: -8 }], sacred: ['Sacred', { stab: 4, ws: 3 }], founder: ['Founder', { legit: 5, stab: 2 }], autocrat: ['Autocrat', { pp: 0.1, stab: -1 }], dutiful: ['Dutiful', { stab: 2, legit: 2 }], nationalist: ['Nationalist', { ws: 3 }], theocrat: ['Theocrat', { stab: 2, research: -0.02 }] };
for (const k in CROWN_TRAIT) SPIRITS['crown_' + k] = ['Crown: ' + CROWN_TRAIT[k][0], 'The character of the monarch.', CROWN_TRAIT[k][1]];
// [name, born, trait, house, heir, heir born]
const CROWNS = { ENG: ['Edward VIII', 1894, 'playboy', 'Windsor', 'Albert, Duke of York', 1895], ITA: ['Victor Emmanuel III', 1869, 'cautious', 'Savoy', 'Umberto', 1904], JAP: ['Hirohito', 1901, 'sacred', 'Yamato', 'Akihito', 1933], BEL: ['Leopold III', 1901, 'soldier', 'Saxe-Coburg', 'Baudouin', 1930], HOL: ['Wilhelmina', 1880, 'ironwill', 'Orange-Nassau', 'Juliana', 1909], NOR: ['Haakon VII', 1872, 'constitutional', 'Glücksburg', 'Olav', 1903], DEN: ['Christian X', 1870, 'beloved', 'Glücksburg', 'Frederik', 1899], SWE: ['Gustaf V', 1858, 'old', 'Bernadotte', 'Gustaf Adolf', 1882], YUG: ['Peter II', 1923, 'regency', 'Karađorđević', null, 0], ROM: ['Carol II', 1893, 'meddler', 'Hohenzollern', 'Michael', 1921], BUL: ['Boris III', 1894, 'cautious', 'Saxe-Coburg', null, 0], GRE: ['George II', 1890, 'constitutional', 'Glücksburg', 'Paul', 1901], ALB: ['Zog I', 1895, 'autocrat', 'Zogu', null, 0], EGY: ['Farouk', 1920, 'playboy', 'Muhammad Ali', null, 0], IRQ: ['Ghazi', 1912, 'nationalist', 'Hashemite', 'Faisal', 1935], SAU: ['Ibn Saud', 1875, 'founder', 'Saud', 'Saud', 1902], PER: ['Reza Shah', 1878, 'autocrat', 'Pahlavi', 'Mohammad Reza', 1919], AFG: ['Zahir Shah', 1914, 'cautious', 'Barakzai', null, 0], NEP: ['Tribhuvan', 1906, 'cautious', 'Shah', 'Mahendra', 1920], SIA: ['Ananda Mahidol', 1925, 'regency', 'Chakri', 'Bhumibol', 1927], ETH: ['Haile Selassie', 1892, 'reformer', 'Solomonic', 'Asfa Wossen', 1916], LUX: ['Charlotte', 1896, 'beloved', 'Nassau-Weilburg', 'Jean', 1921], MAN: ['Puyi', 1906, 'puppet', 'Aisin-Gioro', null, 0], YEM: ['Yahya', 1869, 'theocrat', 'Hamid ad-Din', 'Ahmad', 1891] };
const crownOf = c => { if (c.crown !== undefined) return c.crown; const d = CROWNS[c.tag.slice(0, 3)]; c.crown = d ? { name: d[0], born: d[1], trait: d[2], house: d[3], heir: d[4], heirBorn: d[5], pres: 60, wed: [], exile: false } : null; if (c.crown) crownSpirit(c); return c.crown; };
function crownSpirit(c) { const K = c.crown; for (const k in CROWN_TRAIT) if (hasSpirit(c, 'crown_' + k) && (!K || K.trait !== k)) removeSpirit(c, 'crown_' + k); if (K && !hasSpirit(c, 'crown_' + K.trait)) addSpirit(c, 'crown_' + K.trait); }
const HEIR_TRAIT = { 'Albert, Duke of York': 'dutiful', Umberto: 'cautious', Akihito: 'constitutional', Baudouin: 'constitutional', Juliana: 'beloved', Olav: 'soldier', Frederik: 'constitutional', 'Gustaf Adolf': 'reformer', Michael: 'soldier', Paul: 'constitutional', Faisal: 'regency', Saud: 'autocrat', 'Mohammad Reza': 'reformer', Mahendra: 'autocrat', Bhumibol: 'constitutional', 'Asfa Wossen': 'cautious', Jean: 'soldier', Ahmad: 'theocrat' };
function crownSucceed(c, why) { const K = crownOf(c); if (!K) return; const old = K.name; if (!K.heir) { K.name = `${K.name.split(' ')[0]}'s successor`; K.born = year() - 30; K.trait = 'regency'; } else { const age = year() - K.heirBorn; K.name = K.heir === 'Albert, Duke of York' ? 'George VI' : K.heir === 'Michael' ? 'Michael I' : K.heir === 'Faisal' ? 'Faisal II' : K.heir; K.born = K.heirBorn; K.trait = age < 18 ? 'regency' : HEIR_TRAIT[K.heir] || 'constitutional'; }
  K.heir = K.name === 'George VI' ? 'Elizabeth' : null; K.heirBorn = K.name === 'George VI' ? 1926 : 0; K.pres = Math.max(30, K.pres - 10); crownSpirit(c); logMsg(`${c.name}: ${old} ${why}; ${K.name} succeeds.`, c.major ? 'world' : 'info', [c.tag]); }
function crownsMonthly() { for (const c of alive()) { const K = crownOf(c); if (!K) continue; const age = year() - K.born;
    K.pres = clamp(K.pres + (50 - K.pres) * 0.02 + (c.capitulated ? -1 : 0) + (isAtWar(c.tag) && capInfo(c.tag).prog < 0.05 ? 0.2 : 0), 0, 100);
    const mon = c.laws.gov === 'monarchy' || ['ENG', 'BEL', 'HOL', 'NOR', 'DEN', 'SWE', 'LUX', 'JAP', 'ITA', 'EGY', 'IRQ', 'SAU', 'GRE', 'YUG', 'ROM', 'BUL', 'ALB', 'AFG', 'NEP', 'SIA', 'ETH', 'PER', 'YEM', 'MAN'].includes(c.tag.slice(0, 3));
    if (mon && dateObj(G.day).getUTCMonth() % 3 === 0) { c.stab = clamp(c.stab + (K.pres - 50) / 100, 0, 100); }
    // history's successions
    if (G.historical) { const y = year(), m = dateObj(G.day).getUTCMonth() + 1, t = c.tag.slice(0, 3), when = (yy, mm) => y > yy || (y === yy && m >= mm);
      if (t === 'ENG' && K.name === 'Edward VIII' && when(1936, 12)) { crownSucceed(c, 'abdicates to marry Wallis Simpson'); continue; }
      if (t === 'IRQ' && K.name === 'Ghazi' && when(1939, 4)) { crownSucceed(c, 'dies in a car crash'); continue; }
      if (t === 'ROM' && K.name === 'Carol II' && when(1940, 9)) { crownSucceed(c, 'abdicates and flees with Magda Lupescu'); continue; }
      if (t === 'PER' && K.name === 'Reza Shah' && when(1941, 9) && (atWar('PER', 'ENG') || atWar('PER', 'SOV') || C('PER').capitulated)) { crownSucceed(c, 'abdicates under Allied occupation'); continue; }
      if (t === 'BUL' && K.name === 'Boris III' && when(1943, 8)) { K.heir = 'Simeon II'; K.heirBorn = 1937; crownSucceed(c, 'dies after a stormy visit to Hitler'); continue; }
      if (t === 'BUL' && K.name === 'Boris III' && !K.heir && when(1937, 6)) { K.heir = 'Simeon II'; K.heirBorn = 1937; }
      if (t === 'ALB' && !K.heir && when(1939, 4)) { K.heir = 'Leka'; K.heirBorn = 1939; } }
    // old monarchs die
    if (age > 62 && Math.random() < (age - 60) * 0.0012) crownSucceed(c, 'dies');
    if (K.trait === 'regency' && K.born && year() - K.born >= 18) { K.trait = HEIR_TRAIT[K.name] || 'constitutional'; crownSpirit(c); logMsg(`${c.name}: ${K.name} comes of age and the regency ends.`, 'info', [c.tag]); }
    if (c.capitulated && !K.exile && c.exile) { K.exile = true; K.pres = Math.min(100, K.pres + 10); } if (!c.capitulated && K.exile) K.exile = false; } }
function crownAct(c, a, t) { const K = crownOf(c); if (!K) return 'We have no crown';
  if (a === 'tour') { if (c.pp < 20) return 'Needs 20 political power'; c.pp -= 20; K.pres = Math.min(100, K.pres + 8); c.stab = Math.min(100, c.stab + 2); return ''; }
  if (a === 'wed') { const T = C(t), KT = T && crownOf(T); if (!KT) return 'They have no crown'; if (c.infl < 40) return 'Needs 40 influence'; if (K.wed.includes(t)) return 'Already joined by marriage'; if (opinion(t, c.tag) < 0) return 'They will not consider it';
    c.infl -= 40; K.wed.push(t); KT.wed.push(c.tag); if (typeof omAdd === 'function') { omAdd(t, c.tag, 'royal', 25, 7300); omAdd(c.tag, t, 'royal', 25, 7300); } if (typeof trustAdd === 'function') { trustAdd(t, c.tag, 10); trustAdd(c.tag, t, 10); } K.pres = Math.min(100, K.pres + 5); KT.pres = Math.min(100, KT.pres + 5);
    logMsg(`A royal wedding joins the houses of ${K.house} and ${KT.house}: ${c.name} and ${T.name}.`, 'world', [c.tag, t]); return ''; }
  if (a === 'abdicate') { if (!K.heir) return 'There is no heir'; if (c.pp < 50) return 'Needs 50 political power'; c.pp -= 50; crownSucceed(c, 'abdicates'); return ''; }
  return 'Unknown'; }
// ======================= 4. arms control and international law =======================
const ILAW = { naval: ['The London Naval Treaty', 'Limits on battleships and cruisers: shipbuilding -15% for the signatories; tension falls while they keep it.', ['ENG', 'USA', 'FRA'], { navy: -0.03 }],
  agna: ['The Anglo-German Naval Agreement', 'Germany\'s fleet limited to 35% of Britain\'s: German shipbuilding -15%, British opinion of Germany +10.', ['GER'], { navy: -0.03 }],
  bombing: ['The Pledge on Bombing', 'No bombing of cities from the air. Signatories who send strategic bombers breach it.', [], {}],
  geneva: ['The Geneva Conventions', 'Prisoners of war fed, housed and inspected: legitimacy +3 while kept. Prisoner labour or worse breaches them.', ['ENG', 'USA', 'FRA', 'GER', 'ITA', 'POL', 'BEL', 'HOL', 'NOR', 'DEN', 'SWE', 'SWI', 'CZE', 'HUN', 'ROM', 'YUG', 'GRE', 'BUL', 'TUR', 'CAN', 'AST', 'NZL', 'SAF', 'RAJ', 'CHI', 'SPA', 'POR', 'FIN', 'BRA', 'MEX'], { legit: 3 }] };
for (const k in ILAW) SPIRITS['ilaw_' + k] = [ILAW[k][0], ILAW[k][1], ILAW[k][3]];
const ilawS = () => { if (!G.ilaw) { G.ilaw = {}; for (const k in ILAW) G.ilaw[k] = { m: ILAW[k][2].slice(), out: {}, log: [] }; } return G.ilaw; };
const ilawIn = (k, t) => ilawS()[k].m.includes(t);
function ilawJoin(c, k) { const L = ilawS()[k]; if (!L || L.m.includes(c.tag)) return 'Already a signatory'; L.m.push(c.tag); delete L.out[c.tag]; addSpirit(c, 'ilaw_' + k); for (const m of L.m) if (m !== c.tag && typeof omAdd === 'function') omAdd(m, c.tag, 'treaty', 10, 1825); G.tension = Math.max(0, G.tension - 1); logMsg(`${c.name} signs ${ILAW[k][0].replace(/^The /, 'the ')}.`, 'info', [c.tag]); return ''; }
function ilawLeave(c, k, breach) { const L = ilawS()[k]; if (!L || !L.m.includes(c.tag)) return 'Not a signatory'; L.m = L.m.filter(t => t !== c.tag); L.out[c.tag] = G.day; removeSpirit(c, 'ilaw_' + k); c.infamy += breach ? 6 : 3; G.tension = clamp(G.tension + (breach ? 2 : 1), 0, 100);
  for (const m of L.m) { if (typeof omAdd === 'function') omAdd(m, c.tag, breach ? 'broke' : 'treaty', breach ? -20 : -10, 1825); if (breach && typeof trustAdd === 'function') trustAdd(m, c.tag, -10); }
  L.log.unshift(`${dateStr()}: ${c.name} ${breach ? 'breaches' : 'denounces'} ${ILAW[k][0].replace(/^The /, 'the ')}`); L.log = L.log.slice(0, 8); logMsg(`${c.name} ${breach ? 'breaches' : 'denounces'} ${ILAW[k][0].replace(/^The /, 'the ')}.`, c.major ? 'world' : 'info', [c.tag]); if (typeof prestigeAdd === 'function') prestigeAdd(c.tag, -4); return ''; }
function ilawMonthly() { const L = ilawS(); for (const k in L) for (const t of L[k].m.slice()) { const c = C(t); if (!c || !c.exists) { L[k].m = L[k].m.filter(x => x !== t); continue; } if (!hasSpirit(c, 'ilaw_' + k)) addSpirit(c, 'ilaw_' + k); }
  // breaches: strategic bombing by a pledged power, harsh treatment of prisoners by a signatory
  for (const t of L.bombing.m.slice()) { const c = C(t); if (isAtWar(t) && airPlanOf(c).some(x => x.m === 'bomb')) ilawLeave(c, 'bombing', true); }
  for (const t of L.geneva.m.slice()) { const c = C(t); if (c.pw && c.pw.pol && c.pw.pol !== 'geneva' && Object.keys(c.pw.held || {}).length) ilawLeave(c, 'geneva', true); }
  // in September 1939 the powers answer Roosevelt's appeal and promise not to bomb cities
  if (!G.flags.bombPledge && G.wars.some(w => w.ww) || (!G.flags.bombPledge && G.day >= mjDay(1939, 9))) { G.flags.bombPledge = G.day; for (const t of ['ENG', 'FRA', 'GER', 'POL', 'ITA', 'USA']) if (ok(t) && !ilawIn('bombing', t)) ilawJoin(C(t), 'bombing'); }
  // history: Japan leaves the naval treaties in 1936 (it is not a signatory here); Hitler denounces the naval agreement in April 1939
  if (G.historical && G.day >= mjDay(1939, 4) + 27 && ok('GER') && C('GER').ai && ilawIn('agna', 'GER')) ilawLeave(C('GER'), 'agna', false);
  if (G.historical && G.day >= mjDay(1938, 6) && !G.flags.escalator && ilawIn('naval', 'ENG')) { G.flags.escalator = G.day; logMsg('The escalator clause: the naval powers raise their battleship limit to 45,000 tons because of Japan.', 'info'); }
  for (const c of alive()) { if (!c.ai) continue; if (ilawIn('naval', c.tag) && isAtWar(c.tag) && Math.random() < 0.2) ilawLeave(c, 'naval', false); if (ilawIn('bombing', c.tag) && isAtWar(c.tag) && enemiesOf(c.tag).some(e => L.bombing.out[e] && G.day - L.bombing.out[e] < 400) && Math.random() < 0.3) ilawLeave(c, 'bombing', false); } }
function conference(c) { if (!c.major) return 'Only a great power can call one'; if (c.infl < 100) return 'Needs 100 influence'; if (isAtWar(c.tag)) return 'Not in war'; c.infl -= 100; const majors = alive().filter(k => k.major && k.tag !== c.tag && !isAtWar(k.tag)), yes = majors.filter(k => opinion(k.tag, c.tag) > 0 && G.tension < 70 && k.ideology !== 'fas');
  if (yes.length >= 3) { G.tension = Math.max(0, G.tension - 8); for (const k of yes.concat([c])) { if (!ilawIn('bombing', k.tag)) ilawJoin(k, 'bombing'); if (typeof omAdd === 'function') for (const j of yes) if (j !== k) omAdd(j.tag, k.tag, 'treaty', 10, 1095); } if (typeof prestigeAdd === 'function') prestigeAdd(c.tag, 6); logMsg(`The disarmament conference called by ${c.name} ends with an agreement: ${yes.map(k => k.name).join(', ')} pledge restraint.`, 'world', [c.tag]); return ''; }
  if (typeof prestigeAdd === 'function') prestigeAdd(c.tag, -3); logMsg(`The disarmament conference called by ${c.name} breaks up without agreement.`, 'world', [c.tag]); return ''; }
// ======================= 5. prestige and the ranking =======================
const prestOf = c => (c.prest === undefined ? (c.prest = c.major ? 70 : 40) : c.prest);
function prestigeAdd(t, v) { const c = C(t); if (!c) return; c.prest = clamp(prestOf(c) + v, 0, 150); }
SPIRITS.gp_great = ['A Great Power', 'One of the eight powers that decide the affairs of the world.', { infl: 0.1, stab: 2 }]; SPIRITS.gp_regional = ['A Regional Power', 'A power that counts in its own part of the world.', { infl: 0.05 }];
const IND_B = ['steel', 'tools', 'chem', 'arms', 'artyf', 'tankp', 'aircraftp', 'engines', 'autos', 'synth', 'shipyard', 'oilr', 'power'];
function rankMonthly() { const L = alive().filter(c => !c.capitulated && !c.overlord && provsOf(c.tag).length); for (const c of alive()) if (c.overlord) { c.gpStatus = 'minor'; c.gpRank = 0; removeSpirit(c, 'gp_great'); removeSpirit(c, 'gp_regional'); }
  const indL = {}; for (const p of G.P) if (p.ctrl && p.owner === p.ctrl) { let n = 0; for (const b of IND_B) n += p.b[b] || 0; if (n) indL[p.ctrl] = (indL[p.ctrl] || 0) + n; }
  const ind = c => (indL[c.tag] || 0) + Math.sqrt(Math.max(0, c.gdp || 0)) / 40, army = c => sum(armiesOf(c.tag), a => sum(a.divs, d => d.str * (1 + d.xp * 0.3))), navy = c => (typeof navalPower === 'function' ? navalPower(c) : 0);
  const mx = f => Math.max(1, ...L.map(f)); const mi = mx(ind), ma = mx(army), mn = mx(navy), mp = mx(prestOf);
  for (const c of L) { c.gpScore = Math.round(100 * (0.4 * ind(c) / mi + 0.3 * army(c) / ma + 0.15 * navy(c) / mn + 0.15 * prestOf(c) / mp)); c.prest = prestOf(c) + (50 - prestOf(c)) * 0.02; }
  L.sort((a, b) => b.gpScore - a.gpScore); L.forEach((c, i) => { const was = c.gpRank, st = i < 8 ? 'great' : i < 16 ? 'regional' : 'minor'; c.gpRank = i + 1;
    if (c.gpStatus && c.gpStatus !== st) { if (c.gpStatus === 'great') { c.stab = Math.max(0, c.stab - 5); c.legit = Math.max(0, c.legit - 5); logMsg(`${c.name} is no longer counted among the great powers.`, 'world', [c.tag]); } else if (st === 'great') logMsg(`${c.name} is now counted among the great powers.`, 'world', [c.tag]); }
    c.gpStatus = st; for (const [k, s] of [['gp_great', 'great'], ['gp_regional', 'regional']]) { if (st === s && !hasSpirit(c, k)) addSpirit(c, k); else if (st !== s && hasSpirit(c, k)) removeSpirit(c, k); } void was; }); }
// victories and defeats move prestige
{ const _cp = capitulate; capitulate = function (tag) { const L = C(tag), win = L ? enemiesOf(tag) : []; _cp(tag); if (!L) return; prestigeAdd(tag, L.major ? -45 : -20); for (const t of win) prestigeAdd(t, L.major ? 20 : 6); }; }
// an extra envoy for the great powers
{ const _es = envoySlots; envoySlots = c => _es(c) + (c.gpStatus === 'great' ? 1 : 0); }
// ======================= the hooks =======================
{ const _pd = playDaily; playDaily = function () { _pd(); for (const c of alive()) mobDaily(c); }; }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); try { crownsMonthly(); ilawMonthly(); rankMonthly(); } catch (e) { if (typeof console !== 'undefined') console.warn('mech24', e); } }; }
{ const _mw = militaryWeekly; militaryWeekly = function (c) { _mw(c); try { supplyWeekly(c); } catch (e) { if (typeof console !== 'undefined') console.warn('supply', e); } }; }
// regimes, rebels and new nations start with their own crown, reserves, envoys and standing, not their parent's
const FRESH24 = ['crown', 'mob', 'envoys', 'depots', 'gpRank', 'gpScore', 'gpStatus', 'prest', 'regs', 'street', 'coal', 'pt', 'ca', 'rj', 'appr', 'pressK', 'envoyX'];
function fresh24(c) { if (!c) return; for (const k of FRESH24) delete c[k]; c.crown = null; for (const s of ['gp_great', 'gp_regional', 'mob_alert', 'mob_partial', 'mob_general']) removeSpirit(c, s); for (const k in CROWN_TRAIT) removeSpirit(c, 'crown_' + k); }
{ const _cr = createRegime; createRegime = function (c, e, kind, opt) { const r = _cr(c, e, kind, opt); if (r) fresh24(r); return r; }; }
{ const _sc = startCivilWar; startCivilWar = function (tag, ...r) { const before = new Set(Object.keys(G.C)); const res = _sc(tag, ...r); for (const t of Object.keys(G.C)) if (!before.has(t) || (G.C[t].civilOf === tag && G.C[t]._fresh24 !== 1)) { fresh24(G.C[t]); G.C[t]._fresh24 = 1; } return res; }; }
{ const _nn = newNation; newNation = function (...a) { const r = _nn(...a); fresh24(r); return r; }; }
// the ranking and the law exist from the first day
{ const _ng = newGame; newGame = function (...a) { const r = _ng(...a); try { ilawS(); rankMonthly(); } catch (e) { if (typeof console !== 'undefined') console.warn(e); } return r; }; }

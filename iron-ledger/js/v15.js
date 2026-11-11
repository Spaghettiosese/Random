// 1.5 systems: border conflicts, embargoes, support companies and army experience, air missions, game rules.
'use strict';

// ---------- border conflicts: fighting short of war ----------
SPIRITS.clash_victor = ['Victory on the Frontier', 'The army won a border conflict.', { org: 0.04, ws: 3 }];
SPIRITS.clash_loser = ['Humiliation on the Frontier', 'The army lost a border conflict.', { stab: -3, pp: -0.05 }];
function clashBorder(a, b) { const out = []; for (const p of G.P) if (p.ctrl === b) for (const e of NB[p.id]) if (!e.sea && P(e.to).ctrl === a) { out.push([e.to, p.id]); } return out; }
function clashBlock(a, b) { if (!ok(a) || !ok(b) || a === b) return 'No such nation'; if (atWar(a, b)) return 'Already at war'; if (friendly(a, b)) return 'They are a friend'; if (hasPact('truce', a, b)) return 'A truce is in force'; if ((G.clashes || []).some(c => (c.a === a && c.b === b) || (c.a === b && c.b === a))) return 'A conflict is already under way'; if (!clashBorder(a, b).length) return 'No common land border'; return ''; }
function startClash(a, b, free) {
  if (clashBlock(a, b)) return false; const A = C(a); if (!free) { if (A.pp < 40) return false; A.pp -= 40; }
  const bd = clashBorder(a, b), claimed = bd.find(x => P(x[1]).claims.includes(a) || P(x[1]).cores.includes(a)) || pick(bd);
  (G.clashes = G.clashes || []).push({ a, b, from: claimed[0], prov: claimed[1], end: G.day + 42, sa: 0, sb: 0 }); addRel(a, b, -20); G.tension = Math.min(100, G.tension + 1);
  logMsg(`Border conflict: ${A.adj} and ${C(b).adj} troops clash near ${P(claimed[1]).name}.`, 'world', [a, b]); if (b === G.player) UIH.notify(`${A.name} has provoked a border conflict near ${P(claimed[1]).name}. Move armies to the frontier.`, 'bad'); return true;
}
function clashSide(x, y) { const set = new Set(clashBorder(x, y).map(e => e[0])); let s = 0; const arm = []; for (const a of armiesOf(x)) if (set.has(a.loc)) { s += armyStr(a); arm.push(a); } return [s, arm]; }
function clashTick() {
  if (!G.clashes || !G.clashes.length) return;
  for (const k of G.clashes.slice()) { const done = () => G.clashes.splice(G.clashes.indexOf(k), 1); if (!ok(k.a) || !ok(k.b) || atWar(k.a, k.b)) { done(); continue; }
    const [sa, aa] = clashSide(k.a, k.b), [sb, ab] = clashSide(k.b, k.a), fa = sa * (1 + M(C(k.a), 'atk')) * (0.8 + Math.random() * 0.4), fb = sb * (1 + M(C(k.b), 'def')) * 1.1 * (0.8 + Math.random() * 0.4), tot = fa + fb + 0.01;
    k.sa += fa / tot; k.sb += fb / tot; for (const a of aa.concat(ab)) for (const d of a.divs) { d.str = Math.max(0.3, d.str - 0.012); d.org = Math.max(0.3, d.org * 0.93); d.xp = Math.min(1, (d.xp || 0) + 0.02); }
    if (G.day < k.end) continue; done(); const r = k.sa / Math.max(0.01, k.sa + k.sb), w = r > 0.56 ? k.a : r < 0.44 ? k.b : null, l = w === k.a ? k.b : k.a, p = P(k.prov);
    addPact('truce', k.a, k.b, 240);
    if (!w) { logMsg(`The border conflict near ${p.name} ends in stalemate.`, 'world', [k.a, k.b]); for (const t of [k.a, k.b]) C(t).axp = (C(t).axp || 0) + 15; if (k.a === G.player || k.b === G.player) UIH.popup({ title: 'Stalemate on the Frontier', icon: '⚔️', desc: `After six weeks of shelling near ${p.name}, both sides agree to a ceasefire on the existing line.`, options: [{ name: 'So be it', tip: 'Army experience +15' }] }); continue; }
    const W = C(w), L = C(l); W.pp += 50; W.ws = Math.min(100, W.ws + 3); W.axp = (W.axp || 0) + 35; addSpirit(W, 'clash_victor', 365); L.stab = Math.max(0, L.stab - 4); L.pp = Math.max(0, L.pp - 30); L.axp = (L.axp || 0) + 20; addSpirit(L, 'clash_loser', 240); legacyAdd(W, 'conq', 3, `Won the border conflict at ${p.name}.`);
    let took = ''; const prize = w === k.a ? p : P(k.from); if ((w === k.a ? r : 1 - r) > 0.64 && (prize.claims.includes(w) || prize.cores.includes(w)) && prize.id !== L.capital && prize.owner === l) { transferProv(prize, w); took = ` ${prize.name} is ceded.`; UIH.mapDirty(); }
    logMsg(`${W.name} wins the border conflict near ${p.name}.${took}`, 'world', [w, l]);
    if (w === G.player || l === G.player) UIH.popup({ title: w === G.player ? 'Victory on the Frontier' : 'Defeat on the Frontier', icon: '⚔️', desc: `${W.name} has the better of six weeks' fighting near ${p.name}.${took} A truce is signed.`, options: [{ name: w === G.player ? 'A useful lesson for them' : 'We will remember this', tip: w === G.player ? 'Political power +50, army experience +35' : 'Stability -4, army experience +20' }] });
  }
}
function aiClash(c) { if (G.historical && !['JAP', 'SOV', 'MAN', 'MON'].includes(c.tag)) return; if (c.overlord && c.tag !== 'MAN' && c.tag !== 'MON') return; if (false || isAtWar(c.tag) || !['fas', 'com'].includes(c.ideology) || Math.random() > 0.03) return; const cand = alive().filter(t => !clashBlock(c.tag, t.tag) && clashSide(c.tag, t.tag)[0] > 0 && (!G.historical || ['JAP', 'SOV', 'MAN', 'MON'].includes(t.tag)) && (G.historical || G.P.some(p => p.owner === t.tag && p.claims.includes(c.tag))) && countryStr(t.tag) < countryStr(c.tag) * 2.5); if (cand.length) startClash(c.tag, pick(cand).tag, true); }

// ---------- embargoes ----------
[0.05, 0.12, 0.22].forEach((v, i) => SPIRITS['embargoed_' + (i + 1)] = [['Trade Restrictions', 'Embargoed', 'Under Blockade by Treaty'][i], 'Foreign powers refuse to trade with us.', { tradecap: -v, output: -v / 8, infl: -v / 2 }]);
const embargoing = (c, t) => !!(c.emb && c.emb[t]);
function embargoBlock(c, t) { if (!ok(t) || t === c.tag) return 'No such nation'; if (friendly(c.tag, t)) return 'They are a friend'; if (c.overlord) return 'Subjects have no trade policy of their own'; return ''; }
function setEmbargo(c, t, on, free) {
  if (on) { if (embargoBlock(c, t) || embargoing(c, t)) return false; if (!free && c === C(G.player) && !c.ai) { if (c.infl < 25) return false; c.infl -= 25; } (c.emb = c.emb || {})[t] = G.day; removePact('trade', c.tag, t); addRel(c.tag, t, -25); logMsg(`${c.name} places an embargo on ${cname(t)}.`, c.major ? 'world' : 'info', [c.tag, t]); if (t === G.player) UIH.notify(`${c.name} has embargoed us.`, 'bad'); }
  else { if (!embargoing(c, t)) return false; delete c.emb[t]; addRel(c.tag, t, 10); logMsg(`${c.name} lifts its embargo on ${cname(t)}.`, 'info', [c.tag, t]); }
  embargoApply(C(t)); return true;
}
function embargoWeight(t) { let tot = 0, w = 0; for (const c of alive()) { if (c.tag === t.tag) continue; tot += c.gdp || 0; if (embargoing(c, t.tag)) w += c.gdp || 0; } return tot ? w / tot : 0; }
function embargoApply(t) { if (!t || !t.exists) return; const w = embargoWeight(t), tier = w > 0.33 ? 3 : w > 0.14 ? 2 : w > 0.03 ? 1 : 0; if (t.embTier === tier && (!tier || hasSpirit(t, 'embargoed_' + tier))) return; for (let i = 1; i <= 3; i++) removeSpirit(t, 'embargoed_' + i); if (tier) addSpirit(t, 'embargoed_' + tier); if (t.tag === G.player && tier > (t.embTier || 0)) UIH.notify(`Foreign embargoes are biting: ${SPIRITS['embargoed_' + tier][0]}.`, 'bad'); t.embTier = tier; }
function embargoMonthly() {
  for (const c of alive()) { if (c.emb) for (const t in c.emb) if (!ok(t) || friendly(c.tag, t)) delete c.emb[t];
    if (!c.ai || c.overlord || c.capitulated) continue;
    if (c.ideology === 'dem' && (c.major || c.gdp > 2e6)) for (const t of alive()) { if (t.tag === c.tag || friendly(c.tag, t.tag) || atWar(c.tag, t.tag)) continue; const bad = t.infamy > 45 && isAtWar(t.tag) && t.ideology !== 'dem';
      if (bad && !embargoing(c, t.tag) && Math.random() < 0.25) setEmbargo(c, t.tag, true); else if (embargoing(c, t.tag) && t.infamy < 20 && !isAtWar(t.tag) && Math.random() < 0.3) setEmbargo(c, t.tag, false); }
    if (c.emb) for (const t in c.emb) if (atWar(c.tag, t)) { /* war supersedes; keep */ } }
  for (const c of alive()) embargoApply(c);
}

// ---------- support companies and army experience ----------
const SUPPORT = { art: ['Artillery battalion', '+8% attack; +4% when defending', '💥'], eng: ['Engineer company', '+10% when defending', '⛏️'], rec: ['Reconnaissance company', 'Marches 12% faster', '🐎'], hosp: ['Field hospital', 'Divisions recover strength every week, even in the line', '⛑️'], sig: ['Signal company', 'Divisions recover organisation faster', '📡'] };
const SUP_COST = 20, SUP_MAX = 3;
function supportBlock(c, a, k) { if (!SUPPORT[k]) return 'Unknown'; if ((a.sup || []).includes(k)) return 'Already attached'; if ((a.sup || []).length >= SUP_MAX) return `An army can hold ${SUP_MAX} support companies`; if ((c.axp || 0) < SUP_COST) return `Needs ${SUP_COST} army experience`; return ''; }
function addSupport(a, k) { const c = C(a.owner); if (supportBlock(c, a, k)) return false; c.axp -= SUP_COST; (a.sup = a.sup || []).push(k); return true; }
function removeSupport(a, k) { if (a.sup) a.sup = a.sup.filter(x => x !== k); }
function supportWeekly(c) {
  const arm = armiesOf(c.tag); let fight = 0; for (const a of arm) { if (a.battle) fight++; if (!a.sup) continue; for (const d of a.divs) { if (a.sup.includes('hosp')) d.str = Math.min(1, d.str + (a.battle ? 0.008 : 0.02)); if (a.sup.includes('sig') && !a.battle) d.org = Math.min(1, d.org + 0.04); } }
  c.axp = Math.min(500, (c.axp || 0) + 0.4 + fight * 1.5 + M(c, 'train') * 2);
  if (c.ai && c.axp >= SUP_COST + 10) { const a = arm.filter(x => !x.garrison && (x.sup || []).length < SUP_MAX && x.divs.length >= 3).sort((x, y) => y.divs.length - x.divs.length)[0]; if (a) { const k = ['art', 'eng', 'hosp', 'rec', 'sig'].find(s => !(a.sup || []).includes(s)); if (k) addSupport(a, k); } }
}
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); let n = 0, b = 0; for (const a of armies) { n += a.divs.length; if (!a.sup) continue; let f = 0; if (a.sup.includes('art')) f += attacking ? 0.08 : 0.04; if (!attacking && a.sup.includes('eng')) f += 0.1; b += f * a.divs.length; } if (n && b) r.atk *= 1 + b / n; if (attacking && armies.length) { const cs = M(C(armies[0].owner), 'cas'); if (cs > 0) r.atk *= 1 + cs * 0.3; } return r; };
  const _md = moveDays; moveDays = function (a, from, to, sea) { const d = _md(a, from, to, sea); return !sea && a.sup && a.sup.includes('rec') ? d * 0.88 : d; }; }

// ---------- air missions ----------
const AIRM = { sup: ['Air Superiority', { air: 0.15 }, 'Fighters sweep the front. The default.'], cas: ['Ground Support', { cas: 0.3, air: -0.03 }, 'Dive bombers work with the army: attacks on land are up to 9% stronger.'], strat: ['Strategic Bombing', { bombing: 0.25, air: -0.06 }, 'Bombers go for factories and railways.'], naval: ['Naval Strike', { navy: 0.08, air: -0.05 }, 'Torpedo bombers and patrol aircraft work with the fleet.'], home: ['Home Defence', { civdef: 0.35, air: 0.05, bombing: -0.2 }, 'Interceptors are held back to guard the cities.'] };
for (const k in AIRM) SPIRITS['airm_' + k] = ['Air Mission: ' + AIRM[k][0], AIRM[k][2], AIRM[k][1]];
function airApply(c) { const k = AIRM[c.airMission] ? c.airMission : null; for (const m in AIRM) if (m !== k) removeSpirit(c, 'airm_' + m); if (k && !hasSpirit(c, 'airm_' + k)) addSpirit(c, 'airm_' + k); }
function setAirMission(c, k) { if (!AIRM[k] || c.airMission === k) return false; if (!c.ai) { if (c.pp < 15) return false; c.pp -= 15; } c.airMission = k; airApply(c); return true; }
function aiAir(c) { if (airPower(c) < 150) return; const war = isAtWar(c.tag), want = !war ? 'sup' : c.warExh > 45 ? 'home' : ['JAP', 'ENG', 'USA', 'ITA'].includes(c.tag) && navalPower(c) > 150 ? 'naval' : c.ideology === 'fas' || c.ideology === 'com' ? 'cas' : c.major ? 'strat' : 'sup'; if (c.airMission !== want && Math.random() < 0.5) setAirMission(c, want); }

// ---------- game rules ----------
const RULE_DIFF = { easy: ['Recruit', { output: 0.1, atk: 0.08, def: 0.08, pp: 0.15, stab: 5 }], normal: ['Regular', null], hard: ['Veteran', { output: -0.06, atk: -0.05, def: -0.05, pp: -0.1 }], brutal: ['Field Marshal', { output: -0.12, atk: -0.1, def: -0.1, pp: -0.2, stab: -5 }] };
for (const k in RULE_DIFF) if (RULE_DIFF[k][1]) SPIRITS['rule_' + k] = ['Difficulty: ' + RULE_DIFF[k][0], 'A game rule chosen at the start.', RULE_DIFF[k][1]];
SPIRITS.rule_buff = ['Strengthened', 'A game rule: this nation was strengthened at the start.', { atk: 0.1, def: 0.1, mil_out: 0.15, output: 0.05, manpower: 0.05 }];
SPIRITS.rule_nerf = ['Weakened', 'A game rule: this nation was weakened at the start.', { atk: -0.1, def: -0.1, mil_out: -0.12, output: -0.05 }];
const RULE_TAGS = ['GER', 'ITA', 'JAP', 'SOV', 'ENG', 'FRA', 'USA', 'CHI'];
const RULE_OPT = { fog: ['Quiet world', 'No world-news popups'], rich: ['Full treasuries', 'Every nation starts with double its treasury'] };
function applyRules(r) {
  G.rules = r = r || { diff: 'normal', str: {}, opt: {} }; const pl = C(G.player);
  if (RULE_DIFF[r.diff] && RULE_DIFF[r.diff][1]) addSpirit(pl, 'rule_' + r.diff);
  for (const t in r.str || {}) if (ok(t) && r.str[t]) addSpirit(C(t), r.str[t] > 0 ? 'rule_buff' : 'rule_nerf');
  if (r.opt && r.opt.fog) G.news = false; if (r.opt && r.opt.rich) for (const c of alive()) c.money *= 2;
}

// The Kwantung Army garrisons Manchukuo from the first day.
SPIRITS.kwantung_shield = ['Kwantung Garrison', 'A Japanese field army stands behind the Manchukuoan state.', { caplimit: 0.3, def: 0.05 }];
{ const _ss = setupScenario; setupScenario = function (...a) { const r = _ss(...a); if (ok('MAN') && ok('JAP') && C('MAN').overlord === 'JAP') { addSpirit(C('MAN'), 'kwantung_shield'); for (const n of ['Chengde', 'Mukden']) { const p = PN(n); p.fort = Math.max(p.fort || 0, 2); const g = newArmy(C('JAP'), p.id); g.garrison = true; g.auto = false; g.name = 'Kwantung Garrison, ' + n; for (let i = 0; i < 4; i++) g.divs.push({ t: 'inf', str: 1, org: 1, xp: 0.2 }); } } return r; }; }

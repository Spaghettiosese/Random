// 2.4 Factions 3.0.
//  - Ranks: the leader, core members, members and associates. Associates trade and research with the faction but are
//    not called to its wars; core members are called to its offensives too.
//  - Contribution: divisions at war against the faction's enemies, arms sent to members and economic weight. It decides
//    ranks and the weight of each vote.
//  - Cohesion: shared victories, common enemies and summits hold a faction together; defeats, refused calls to arms,
//    quarrels and ideological differences pull it apart. Below 20 members begin to leave; at 0 it breaks up.
//  - Goals and policies: the leader sets the faction's purpose (collective security, a crusade against Bolshevism, the
//    New Order, world revolution, co-prosperity, armed neutrality, containment) and its policies (shared research, a
//    common market, joint command, standardised arms). Changing them costs cohesion.
//  - The council: members propose and vote on admitting a nation, expelling a member, a joint war and a new leader.
//  - Calls to arms are answered or refused; a stronger member can challenge the leader.
'use strict';
const F_RANK = { leader: ['Leader', '★'], core: ['Core member', '◆'], member: ['Member', '●'], assoc: ['Associate', '○'] };
const F_GOAL = {
  collective: ['Collective Security', 'An attack on one is an attack on all. Members defend each other and welcome democracies.', { def: 0.05, stab: 2 }, ['dem']],
  crusade: ['Crusade against Bolshevism', 'The faction exists to destroy Communism.', { atk: 0.04, ws: 5 }, ['fas', 'aut']],
  neworder: ['The New Order', 'Europe and the world remade by force.', { mil_out: 0.05, ws: 5 }, ['fas']],
  revolution: ['World Revolution', 'The workers of every land, under the leadership of the first socialist state.', { manpower: 0.04, drift_com: 0.03 }, ['com']],
  coprosperity: ['Co-Prosperity', 'An economic and military sphere under one leading nation.', { output: 0.03, tradecap: 0.05 }, ['fas', 'aut']],
  neutral: ['Armed Neutrality', 'A league of neutrals that wants only to be left alone.', { def: 0.08, ws: -4 }, ['dem', 'aut']],
  containment: ['Containment', 'Stop the aggressor before the next war: members stand together against one power.', { def: 0.04, infl: 0.1 }, ['dem', 'aut', 'com']]
};
const F_POL = {
  research: ['Shared Research', 'Scientists exchange papers and prototypes: research +4% for every other member, up to +12%.', 6],
  market: ['Common Market', 'Preferential trade inside the faction: output +2%, trade capacity +5%.', 5],
  command: ['Joint Command', 'Combined staffs: +6% attack in battles fought beside another member.', 8],
  arms: ['Standardised Arms', 'One rifle, one shell: the richest members pass surplus equipment to the poorest each month.', 5]
};
for (const k in F_GOAL) SPIRITS['fg_' + k] = [F_GOAL[k][0], F_GOAL[k][1], F_GOAL[k][2]];
SPIRITS.fp_market = ['Common Market', 'Preferential trade inside the faction.', { output: 0.02, tradecap: 0.05 }];
const fx24 = f => { if (!f) return f; if (!f.id) f.id = G.nid++; if (!f.rank) f.rank = {}; if (!f.contrib) f.contrib = {}; if (f.coh === undefined) f.coh = 60; if (!f.pol) f.pol = {}; if (!f.votes) f.votes = []; if (f.founded === undefined) f.founded = G.day;
  if (!f.ideo) f.ideo = C(f.leader) ? C(f.leader).ideology : 'dem'; if (f.goal === undefined) f.goal = defaultGoal(f); for (const m of f.members) if (!f.rank[m]) f.rank[m] = m === f.leader ? 'leader' : 'member'; f.rank[f.leader] = 'leader'; return f; };
const defaultGoal = f => { const L = f.leader; if (L === 'SOV' || f.ideo === 'com') return 'revolution'; if (L === 'JAP') return 'coprosperity'; if (f.ideo === 'fas') return L === 'GER' ? 'neworder' : 'crusade'; if (f.ideo === 'dem') return 'collective'; return 'neutral'; };
const facs = () => (G.factions || []).map(fx24);
const fRankOf = (f, t) => (fx24(f).rank[t] || 'member');
const voters = f => f.members.filter(m => ok(m) && fRankOf(f, m) !== 'assoc' && !C(m).capitulated);
const fStr = t => countryStr(t) || 1;
// ---------- membership ----------
{ const _cf = createFaction; createFaction = function (leader, name, goal) { const own = factionOf(leader); if (own && own.leader !== leader) return; _cf(leader, name); const f = factionOf(leader); if (f) { fx24(f); if (goal && F_GOAL[goal]) f.goal = goal; fApplyMods(f); } }; }
{ const _jf = joinFaction; joinFaction = function (t, lm, rank) { const r = _jf(t, lm); const f = factionOf(t); if (r && f) { fx24(f); f.rank[t] = rank || (C(t).major ? 'core' : 'member'); f.contrib[t] = f.contrib[t] || 0; f.coh = clamp(f.coh + 2, 0, 100); fApplyMods(f); } return r; }; }
{ const _lf = leaveFaction; leaveFaction = function (t) { const f = factionOf(t); _lf(t); removeSpirit(C(t), 'fp_market'); for (const k in F_GOAL) removeSpirit(C(t), 'fg_' + k); if (f) { delete f.rank[t]; delete f.contrib[t]; if (f.members.length) { f.rank[f.leader] = 'leader'; f.coh = clamp(f.coh - 5, 0, 100); } } }; }
function fApplyMods(f) { for (const m of f.members) { const c = C(m); if (!c || !c.exists) continue; for (const k in F_GOAL) { const want = f.goal === k; if (want && !hasSpirit(c, 'fg_' + k)) addSpirit(c, 'fg_' + k); else if (!want && hasSpirit(c, 'fg_' + k)) removeSpirit(c, 'fg_' + k); }
    const mk = !!f.pol.market && fRankOf(f, m) !== undefined; if (mk && !hasSpirit(c, 'fp_market')) addSpirit(c, 'fp_market'); else if (!mk && hasSpirit(c, 'fp_market')) removeSpirit(c, 'fp_market'); } }
// ---------- contribution, ranks, cohesion: every month ----------
function factionsMonthly() { for (const f of facs()) { if (!f.members.some(ok)) continue; const foes = new Set(f.members.flatMap(m => enemiesOf(m)));
    // contribution
    for (const m of f.members) { if (!ok(m)) continue; const c = C(m); let s = (f.contrib[m] || 0) * 0.85;
      if (foes.size) s += sum(armiesOf(m).filter(a => a.battle || NB[a.loc].some(e => !e.sea && foes.has(P(e.to).ctrl))), a => a.divs.length) * 0.6;
      s += Object.entries(c.lend || {}).filter(([t, v]) => v > 0 && f.members.includes(t)).length * 8 + (c.gdp || 0) / 2e9; f.contrib[m] = s; }
    const tot = sum(f.members.filter(ok), m => f.contrib[m] || 0) || 1;
    // ranks follow contribution: a fifth of the faction's effort makes a core member
    for (const m of f.members) { if (!ok(m) || m === f.leader) continue; const sh = (f.contrib[m] || 0) / tot, r = f.rank[m]; if (r === 'member' && sh > 0.2 && G.day - f.founded > 180) { f.rank[m] = 'core'; if (m === G.player) UIH.notify(`We are now a core member of the ${f.name}.`, 'good'); } else if (r === 'core' && sh < 0.06 && !C(m).major) f.rank[m] = 'member'; }
    // cohesion
    const ideos = new Set(f.members.filter(ok).map(m => C(m).ideology)), atWarAll = f.members.filter(ok).some(m => isAtWar(m));
    let d = 0.8 - (ideos.size - 1) * 0.7 + (foes.size ? 0.4 : 0) - f.members.filter(m => ok(m) && C(m).capitulated).length * 0.8 + (atWarAll && capInfo(f.leader).prog > 0.25 ? -1.5 : 0);
    if (f.goal && F_GOAL[f.goal] && !F_GOAL[f.goal][3].includes(C(f.leader).ideology)) d -= 1;
    f.coh = clamp(f.coh + d + (f._dc || 0), 0, 100); f._dc = 0;
    // a faction falling apart
    if (f.coh < 20) for (const m of f.members.slice()) { if (m === f.leader || m === G.player || !ok(m) || isAtWar(m)) continue; if (opinion(m, f.leader) < 30 && Math.random() < 0.06) { leaveFaction(m); logMsg(`${cname(m)} leaves the ${f.name}: the alliance is coming apart.`, 'world', [m, f.leader]); } }
    if (f.coh <= 0 && f.members.length > 1 && !atWarAll) { logMsg(`The ${f.name} is dissolved.`, 'world'); for (const m of f.members.slice()) if (m !== f.leader) leaveFaction(m); }
    // a stronger member may challenge the leader
    const top = f.members.filter(m => ok(m) && m !== f.leader && !C(m).overlord).sort((a, b) => fStr(b) - fStr(a))[0];
    if (top && fStr(top) > fStr(f.leader) * 1.5 && f.coh < 70 && C(top).ai && !f.votes.some(v => v.kind === 'leader') && Math.random() < 0.08 && !(G.historical && G.day < mjDay(1942, 1))) fPropose(f, top, 'leader', top);
    fVotesTick(f); fPolicies(f); fApplyMods(f); } }
// ---------- policies ----------
function fPolicies(f) { if (f.pol.arms) { const ms = f.members.filter(m => ok(m) && !C(m).capitulated).map(C); if (ms.length > 1) { const rich = ms.slice().sort((a, b) => (b.stock.arms || 0) - (a.stock.arms || 0))[0], poor = ms.slice().sort((a, b) => (a.stock.arms || 0) - (b.stock.arms || 0))[0];
      if (rich !== poor && (rich.stock.arms || 0) > 600) for (const g of ['arms', 'artillery']) { const v = (rich.stock[g] || 0) * 0.04; rich.stock[g] -= v; poor.stock[g] = (poor.stock[g] || 0) + v; } } } }
// shared research: every other member speeds our research a little, and a technology a member already has comes faster
{ const _rt = researchTick; researchTick = function (c) { const f = G.factions && G.factions.length ? factionOf(c.tag) : null; if (!f || !fx24(f).pol.research) return _rt(c);
  const before = {}; for (const k in c.research) if (c.research[k]) before[k] = [c.research[k].id, c.research[k].prog]; _rt(c); const n = f.members.filter(m => ok(m) && m !== c.tag).length, base = Math.min(0.12, 0.04 * n);
  for (const k in before) { const r = c.research[k]; if (!r || r.id !== before[k][0]) continue; const known = f.members.some(m => m !== c.tag && ok(m) && C(m).techs[r.id]); r.prog += (r.prog - before[k][1]) * (base + (known ? 0.25 : 0)); } }; }
{ const _sp = sidePower; sidePower = function (armies, attacking, p, eo) { const r = _sp(armies, attacking, p, eo); if (!armies.length || !G.factions || !G.factions.length) return r; const owners = [...new Set(armies.map(a => a.owner))]; if (owners.length < 2) return r;
  const f = factionOf(owners[0]); if (f && fx24(f).pol.command && owners.some(o => o !== owners[0] && factionOf(o) === f)) { r.atk *= 1.06; } return r; }; }
function fSetGoal(f, g, by) { if (!F_GOAL[g] || f.goal === g) return ''; if (by !== f.leader) return 'Only the leader sets the goal'; f.goal = g; f.coh = clamp(f.coh - 8, 0, 100); fApplyMods(f); logMsg(`The ${f.name} adopts a new purpose: ${F_GOAL[g][0]}.`, 'info', f.members); return ''; }
function fSetPol(f, k, on, by) { if (!F_POL[k]) return 'Unknown policy'; if (by !== f.leader) return 'Only the leader sets policy'; if (!!f.pol[k] === !!on) return ''; f.pol[k] = !!on; f.coh = clamp(f.coh - F_POL[k][2], 0, 100); fApplyMods(f); return ''; }
// ---------- the council ----------
const F_VOTE = { admit: 'Admit', expel: 'Expel', war: 'Joint war on', leader: 'New leader:' };
function fPropose(f, by, kind, target) { fx24(f); if (f.votes.some(v => v.kind === kind && v.target === target)) return 'Already before the council'; if (fRankOf(f, by) === 'assoc' && kind !== 'admit') return 'Associates cannot propose';
  if (kind === 'expel' && (target === f.leader || !f.members.includes(target))) return 'Not a member that can be expelled'; if (kind === 'war' && (f.members.includes(target) || !ok(target))) return 'Not a valid target';
  if (kind === 'leader' && (!f.members.includes(target) || target === f.leader)) return 'Not a valid candidate';
  const v = { id: G.nid++, kind, target, by, day: G.day, ends: G.day + 30, yes: {}, no: {} }; f.votes.push(v); v.yes[by] = 1;
  logMsg(`${cname(by)} asks the ${f.name}: ${F_VOTE[kind]} ${cname(target)}?`, 'info', f.members); if (f.members.includes(G.player) && by !== G.player && fRankOf(f, G.player) !== 'assoc') UIH.notify(`The ${f.name} votes: ${F_VOTE[kind]} ${cname(target)}? Cast our vote in the Factions tab.`, 'info'); return ''; }
function fWeight(f, m) { const tot = sum(f.members.filter(ok), x => f.contrib[x] || 0) || 1; return (m === f.leader ? 2 : 1) * (1 + 3 * (f.contrib[m] || 0) / tot) * (fRankOf(f, m) === 'core' ? 1.3 : 1); }
function fAiVote(f, v, m) { const c = C(m), T = C(v.target); if (!T) return false; let s = 0;
  if (v.kind === 'admit') { s = opinion(m, v.target) / 3 + (T.ideology === c.ideology ? 15 : -10) + (enemiesOf(v.target).some(e => !f.members.some(x => atWar(x, e))) ? -80 : 0) - Math.max(0, capDist(m, v.target) - 3000) / 100 + (fStr(v.target) > fStr(m) * 2 ? -5 : 5) + (f.goal === 'containment' && f.target === v.target ? -100 : 0); }
  else if (v.kind === 'expel') { s = -opinion(m, v.target) / 3 - 10 + (f._refused && f._refused[v.target] ? 25 : 0) - (isAtWar(v.target) ? 20 : 0); }
  else if (v.kind === 'war') { const mine = sum(f.members.filter(ok), x => fStr(x)), theirs = fStr(v.target) + sum(alive().filter(k => friendly(k.tag, v.target)), k => fStr(k.tag)); s = (mine / theirs - 1.2) * 30 - opinion(m, v.target) / 4 + (c.ws - 50) / 3 + (c.ideology === 'dem' ? -25 : 10) + (atWar(m, v.target) ? 50 : 0); }
  else if (v.kind === 'leader') { s = (fStr(v.target) / fStr(f.leader) - 1) * 30 + (opinion(m, v.target) - opinion(m, f.leader)) / 4 + (m === v.target ? 100 : m === f.leader ? -100 : 0); }
  return s > 0; }
function fVotesTick(f) { for (const v of f.votes.slice()) { for (const m of voters(f)) if (v.yes[m] === undefined && v.no[m] === undefined && m !== G.player) (fAiVote(f, v, m) ? v.yes : v.no)[m] = 1;
    const pend = voters(f).filter(m => v.yes[m] === undefined && v.no[m] === undefined); if (pend.length && G.day < v.ends) continue;
    const y = sum(Object.keys(v.yes).filter(m => f.members.includes(m)), m => fWeight(f, m)), n = sum(Object.keys(v.no).filter(m => f.members.includes(m)), m => fWeight(f, m)), pass = y > n;
    f.votes.splice(f.votes.indexOf(v), 1); logMsg(`The ${f.name} ${pass ? 'agrees' : 'refuses'}: ${F_VOTE[v.kind]} ${cname(v.target)} (${Math.round(y)}–${Math.round(n)}).`, 'info', f.members);
    if (!pass) { if (v.kind === 'leader' || v.kind === 'expel') f._dc = (f._dc || 0) - 4; continue; }
    if (v.kind === 'admit' && ok(v.target) && !factionOf(v.target)) joinFaction(v.target, f.leader, v.rank || 'member');
    else if (v.kind === 'expel' && f.members.includes(v.target)) { leaveFaction(v.target); addRel(v.target, f.leader, -30); logMsg(`${cname(v.target)} is expelled from the ${f.name}.`, 'world'); }
    else if (v.kind === 'war' && ok(v.target)) { const w = declareWar(f.leader, v.target, [{ by: f.leader, vs: v.target, type: 'take', provs: [] }]); if (w) f._dc = (f._dc || 0) + 3; }
    else if (v.kind === 'leader' && f.members.includes(v.target)) { const old = f.leader; f.leader = v.target; f.rank[v.target] = 'leader'; f.rank[old] = 'core'; logMsg(`${cname(v.target)} takes the leadership of the ${f.name} from ${cname(old)}.`, 'world', f.members); } } }
function fCastVote(f, vid, m, yes) { const v = f.votes.find(x => x.id === vid); if (!v) return 'The vote is over'; if (fRankOf(f, m) === 'assoc') return 'Associates do not vote'; delete v.yes[m]; delete v.no[m]; (yes ? v.yes : v.no)[m] = 1; return ''; }
// ---------- calls to arms: associates choose, members may refuse ----------
function fAnswer(f, m, w, side, attacked) { const c = C(m); if (!c || !c.exists || c.capitulated || w.att.includes(m) || w.def.includes(m)) return;
  const join = () => { joinWar(w, m, side); f._dc = (f._dc || 0) + 1; if (typeof trustAdd === 'function') trustAdd(attacked, m, 8); };
  const refuse = () => { f._dc = (f._dc || 0) - 8; (f._refused = f._refused || {})[m] = G.day; addRel(attacked, m, -25); if (typeof trustAdd === 'function') trustAdd(attacked, m, -20); logMsg(`${c.name} refuses the ${f.name}'s call to arms.`, 'info', f.members); };
  if (m === G.player && !c.ai) { UIH.popup({ title: 'A call to arms', icon: '📯', desc: `${cname(attacked)} is at war (${w.name}) and calls on the ${f.name}. We are ${F_RANK[fRankOf(f, m)][0].toLowerCase()}s of the faction.`, options: [{ name: 'Answer the call', fn: join }, { name: 'Stay out of it', tip: 'Cohesion -8, their opinion -25, their trust in us -20; the council may expel us', fn: refuse }] }); return; }
  const want = (fRankOf(f, m) === 'assoc' ? -15 : 10) + opinion(m, attacked) / 3 + (c.ws - 50) / 2 + (hasSpirit(c, 'armed_neutrality') ? -40 : 0) + (f.goal === 'neutral' && side === 'att' ? -40 : 0);
  if (want > 0) join(); else refuse(); }
{ const _dw = declareWarInner; declareWarInner = function (a, b, goals, name, noCall, realTarget) { if (noCall || !G.factions || !G.factions.length) return _dw(a, b, goals, name, noCall, realTarget);
  const fa = factionOf(a), fb = factionOf(b), held = [];
  // associates are never called; on the attacking side only the leader and core members are called automatically
  for (const [f, att] of [[fb, false], [fa, true]]) { if (!f) continue; fx24(f); const out = f.members.filter(m => m !== (att ? a : b) && ok(m) && (fRankOf(f, m) === 'assoc' || (att && fRankOf(f, m) === 'member') || (m === G.player && !C(m).ai && m !== f.leader))); if (!out.length) continue; held.push([f, out, att]); f.members = f.members.filter(m => !out.includes(m)); }
  let w; try { w = _dw(a, b, goals, name, noCall, realTarget); } finally { for (const [f, out] of held) f.members.push(...out); }
  if (w) for (const [f, out, att] of held) { const side = w.att.includes(att ? a : b) ? 'att' : 'def'; for (const m of out) if (!atWar(m, att ? b : a) && !friendly(m, att ? b : a)) fAnswer(f, m, w, side, att ? a : b); }
  return w; }; }
// ---------- AI: which faction to seek, and when to leave ----------
function fAppeal(c, f) { const L = C(f.leader); if (!L || !L.exists || f.members.some(m => atWar(m, c.tag))) return -999; let s = opinion(c.tag, f.leader) / 2 + (L.ideology === c.ideology ? 20 : -15) + (F_GOAL[f.goal] && F_GOAL[f.goal][3].includes(c.ideology) ? 10 : -5) + (f.coh - 50) / 5;
  const thr = enemiesOf(c.tag).concat(alive().filter(k => (c._claims || {})[k.tag] === undefined && (k._claims || {})[c.tag]).map(k => k.tag)); if (thr.some(t => f.members.some(m => atWar(m, t) || opinion(m, t) < -40))) s += 30;
  if (thr.some(t => f.members.includes(t))) s -= 100; const near = Math.min(...f.members.filter(ok).map(m => capDist(c.tag, m))); s -= Math.max(0, near - 1500) / 60; if (enemiesOf(c.tag).some(e => !f.members.some(x => atWar(x, e)))) s -= 100; return s; }
function aiFactions24(c) { if (!c.ai || c.overlord || c.capitulated) return; const f = factionOf(c.tag);
  if (f) { fx24(f); if (f.leader !== c.tag && f.coh < 25 && fAppeal(c, f) < -10 && !isAtWar(c.tag) && Math.random() < 0.15) { leaveFaction(c.tag); logMsg(`${c.name} leaves the ${f.name}.`, 'world', [c.tag, f.leader]); }
    if (f.leader === c.tag) { const want = defaultGoal(f); if (f.goal !== want && Math.random() < 0.05) fSetGoal(f, want, c.tag); if (!f.pol.market && f.members.length > 2 && f.coh > 50 && Math.random() < 0.1) fSetPol(f, 'market', true, c.tag); if (!f.pol.research && f.members.length > 2 && f.coh > 60 && Math.random() < 0.08) fSetPol(f, 'research', true, c.tag); if (!f.pol.command && isAtWar(c.tag) && f.coh > 50 && Math.random() < 0.08) fSetPol(f, 'command', true, c.tag); }
    return; }
  if (hasSpirit(c, 'armed_neutrality') || (G.historical && typeof histFactionOK === 'function' && c.major)) return;
  if (Math.random() > 0.12) return; const best = facs().filter(x => x.members.some(ok)).map(x => [x, fAppeal(c, x)]).sort((a, b) => b[1] - a[1])[0];
  if (best && best[1] > 25) { const F0 = best[0]; if (G.historical && typeof histFactionOK === 'function' && !histFactionOK(c.tag, F0.leader)) return; if (!F0.votes.some(v => v.kind === 'admit' && v.target === c.tag)) { F0.votes.push({ id: G.nid++, kind: 'admit', target: c.tag, by: c.tag, day: G.day, ends: G.day + 30, yes: {}, no: {}, rank: best[1] > 45 ? 'member' : 'assoc' }); } } }
{ const _am = aiMonthly; aiMonthly = function (c) { _am(c); try { aiFactions24(c); } catch (e) { if (typeof console !== 'undefined') console.warn('factions24', e); } }; }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); factionsMonthly(); }; }
// summits strengthen a faction (mech22b), and every enemy that falls helps
{ const _cp = capitulate; capitulate = function (tag) { const ff = G.factions ? facs().filter(f => f.members.some(m => ok(m) && atWar(m, tag))) : []; _cp(tag); for (const f of ff) f._dc = (f._dc || 0) + 4; const own = factionOf(tag); if (own) own._dc = (own._dc || 0) - 6; }; }
// the player: found a faction, apply to join, ask to be an associate
function fFound(c, name, goal) { if (factionOf(c.tag)) return 'We already belong to a faction'; if (c.overlord) return 'A subject cannot found a faction'; if (c.infl < 50) return 'Needs 50 influence'; c.infl -= 50; createFaction(c.tag, (name || `${c.adj} Pact`).slice(0, 40), goal); return ''; }
function fApply(c, f, rank) { if (factionOf(c.tag)) return 'Leave our faction first'; if (c.overlord) return 'A subject cannot join a faction'; if (f.members.some(m => atWar(m, c.tag))) return 'We are at war with a member'; if (f.votes.some(v => v.kind === 'admit' && v.target === c.tag)) return 'Our application is before the council';
  f.votes.push({ id: G.nid++, kind: 'admit', target: c.tag, by: c.tag, day: G.day, ends: G.day + 30, yes: {}, no: {}, rank: rank || 'member' }); logMsg(`${c.name} applies to join the ${f.name}${rank === 'assoc' ? ' as an associate' : ''}.`, 'info', f.members); return ''; }

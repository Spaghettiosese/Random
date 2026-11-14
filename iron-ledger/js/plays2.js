// 2.1 Diplomatic plays 2.0. A demand is now a crisis in three phases (the demand, the manoeuvring, the brink) in which
// both sides mobilise, court the powers that have not taken sides, raise or cut their demands, offer compromises and call
// for mediation. Mobilisation and stakes change the balance the final reckoning is decided on.
'use strict';
const PLAY_PHASE = [['The Demand', 'The demand has been delivered. Allies and guarantors decide whether to take sides.'], ['Manoeuvring', 'Both sides mobilise, court the other powers and bargain.'], ['The Brink', 'The last days. Mobilisation and new supporters still count; whoever blinks first loses.']];
const playPhase = pl => { const t = G.day - pl.day; return t < 8 ? 0 : t < pl.dur - 10 ? 1 : 2; };
const playLeft = pl => Math.max(0, pl.dur - (G.day - pl.day));
const playSide = (pl, t) => pl.A.includes(t) ? 'A' : pl.B.includes(t) ? 'B' : null;
const playEsc = (pl, s) => (pl.esc && pl.esc[s]) || 0;
function playLog(pl, txt) { (pl.log = pl.log || []).push([G.day, txt]); if (pl.log.length > 40) pl.log.shift(); }
function playName(pl) { return pl.name || (pl.name = `${C(pl.a).adj}–${C(pl.b).adj} Crisis`); }
// mobilisation and stakes weigh on the balance: playStrength reads a multiplier set on each side's list every day
function playMults(pl) { pl.A.mult = (1 + 0.15 * playEsc(pl, 'A')) * (1 - 0.06 * (pl.stakes || 0)); pl.B.mult = (1 + 0.15 * playEsc(pl, 'B')) * (1 + 0.08 * (pl.stakes || 0)) * (1 - 0.12 * (pl.cut || 0)); }
{ const _ps = playStrength; playStrength = list => _ps(list) * (list.mult || 1); }
// what would happen if the crisis were decided today (mirrors the resolution in playDaily)
function playOdds(pl) { playMults(pl); const R = playStrength(pl.A) / Math.max(1, playStrength(pl.B)), B = C(pl.b), backed = pl.B.some(x => x !== pl.b && C(x).major);
  let y; if (pl.goal.type === 'annex') y = R > 6 && !backed && B.ws < 45 ? 0.9 : 0.04; else { const need = (backed ? 2.6 : 1.5) * (0.7 + B.ws / 160); y = clamp((R / need - 0.75) * 2, 0.03, 0.95); }
  if (B.flags.resist && pl.goal.type !== 'regime') y = 0.03; const back = (1 - y) * (R < 0.55 ? 0.85 : R < 0.8 ? 0.35 : 0.05); return { R, y, back, war: Math.max(0, 1 - y - back) }; }
// ---------- actions ----------
const PLAY_ACT = {
  mob: ['Mobilise', 'pp', 25, 'Call up the reserves: our side counts 15% stronger at the reckoning (up to three times). World tension +1, war support +3.'],
  sway: ['Court', 'infl', 30, 'Send an envoy: they may take our side, depending on what they think of us, their ideology and their quarrels with the other side.'],
  raise: ['Raise the stakes', 'pp', 15, 'Add every other province of theirs we claim to the demand. Their resolve stiffens; infamy +3 a province.'],
  cut: ['Moderate the demand', 'pp', 10, 'Drop half of what we ask for: they are likelier to yield.'],
  offer: ['Offer a compromise', 'pp', 20, 'Cede half of what they demand now, and end the crisis, if they accept.'],
  mediate: ['Ask for mediation', 'infl', 40, 'A neutral great power is asked to mediate: ten more days, tension -2, and if it comes to war the mediator may impose a compromise instead.'],
  back: ['Back down', null, 0, 'Withdraw the demand. Stability -10, political power -50, and a year\'s truce.'],
  yield: ['Yield', null, 0, 'Accept the demand now.'],
  join: ['Take a side', 'infl', 20, 'Declare for one side. If the crisis ends in war, we fight in it.']
};
function playAct(c, pl, act, arg) { const d = PLAY_ACT[act], s = playSide(pl, c.tag); if (!G.plays.includes(pl)) return 'The crisis is over';
  if (d[1] && c[d[1]] < d[2]) return `Needs ${d[2]} ${d[1] === 'pp' ? 'political power' : 'influence'}`; const A = C(pl.a), B = C(pl.b), pay = () => { if (d[1]) c[d[1]] -= d[2]; };
  if (act === 'join') { if (s) return 'We are already involved'; if (arg !== 'A' && arg !== 'B') return 'Choose a side'; if (atWar(c.tag, arg === 'A' ? pl.a : pl.b)) return 'We are at war with them'; pay(); pl[arg].push(c.tag); playLog(pl, `${c.name} declares for ${cname(arg === 'A' ? pl.a : pl.b)}.`); logMsg(`${c.name} backs ${cname(arg === 'A' ? pl.a : pl.b)} in the ${playName(pl)}.`, c.major ? 'world' : 'info', [pl.a, pl.b]); return ''; }
  if (!s) return 'We are not a party to this crisis';
  if (act === 'mob') { pl.esc = pl.esc || {}; if (playEsc(pl, s) >= 3) return 'Already fully mobilised'; pay(); pl.esc[s] = playEsc(pl, s) + 1; G.tension = Math.min(100, G.tension + 1); c.ws = Math.min(100, c.ws + 3); playLog(pl, `${c.name} mobilises (${['', 'partial', 'general', 'total'][pl.esc[s]]} mobilisation).`); if (pl.esc[s] >= 2) logMsg(`${c.name} mobilises in the ${playName(pl)}.`, 'world', [pl.a, pl.b]); return ''; }
  if (act === 'sway') { const k = C(arg); if (!k || !ok(arg) || playSide(pl, arg)) return 'Not possible'; pl.swayed = pl.swayed || {}; if (pl.swayed[c.tag + arg]) return 'We have already sent an envoy to them'; pay(); pl.swayed[c.tag + arg] = 1;
    const other = s === 'A' ? pl.b : pl.a, ch = clamp(0.15 + (opinion(arg, c.tag) - opinion(arg, other)) / 120 + (k.ideology === c.ideology ? 0.15 : 0) + ((k._claims || {})[other] ? 0.25 : 0) + (atWar(arg, other) ? 0.5 : 0) - (friendly(arg, other) ? 0.6 : 0) - (k.major ? 0.1 : 0) - (hasSpirit(k, 'isolationism') ? 0.4 : 0), 0.02, 0.9);
    if (Math.random() < ch) { pl[s].push(arg); playLog(pl, `${k.name} is won over and declares for ${cname(s === 'A' ? pl.a : pl.b)}.`); logMsg(`${k.name} backs ${cname(s === 'A' ? pl.a : pl.b)} in the ${playName(pl)}.`, k.major ? 'world' : 'info', [pl.a, pl.b]); return ''; }
    addRel(arg, c.tag, -3); playLog(pl, `${k.name} turns away ${c.adj} envoys.`); return `${k.name} will not take our side (chance was ${Math.round(ch * 100)}%).`; }
  if (act === 'raise') { if (s !== 'A' || c.tag !== pl.a) return 'Only the demanding power can'; if (pl.goal.type !== 'take') return 'Only a demand for land can grow'; const more = G.P.filter(p => p.owner === pl.b && (p.claims.includes(pl.a) || p.cores.includes(pl.a)) && !pl.goal.provs.includes(p.id)).map(p => p.id); if (!more.length) return 'We claim nothing else of theirs'; pay(); pl.goal.provs.push(...more); pl.stakes = (pl.stakes || 0) + 1; c.infamy += 3 * more.length; playLog(pl, `${c.name} now also demands ${more.map(i => P(i).name).join(', ')}.`); return ''; }
  if (act === 'cut') { if (s !== 'A' || c.tag !== pl.a) return 'Only the demanding power can'; if (pl.goal.type !== 'take' || pl.goal.provs.length < 2) return 'There is nothing to drop'; pay(); const keep = Math.ceil(pl.goal.provs.length / 2); const gone = pl.goal.provs.splice(keep); pl.cut = (pl.cut || 0) + 1; playLog(pl, `${c.name} drops its demand for ${gone.map(i => P(i).name).join(', ')}.`); return ''; }
  if (act === 'offer') { if (c.tag !== pl.b) return 'Only the country under pressure can'; if (pl.goal.type !== 'take') return 'Nothing to divide: they want more than land'; pay(); const half = pl.goal.provs.slice(0, Math.max(1, Math.floor(pl.goal.provs.length / 2))), o = playOdds(pl);
    const acc = A.ai ? (o.y < 0.6 || pl.goal.provs.length === 1 && o.y < 0.8) && Math.random() < 0.8 : null;
    if (acc === null) { UIH.popup({ title: 'A Compromise Is Offered', icon: '🤝', days: 10, def: 0, desc: `${B.name} offers to cede ${half.map(i => P(i).name).join(', ')} now and end the crisis.`, options: [{ name: 'Accept.', fn: () => playSettle(pl, half) }, { name: 'Refuse: all or nothing.', fn: () => playLog(pl, `${A.name} refuses the compromise.`) }] }); return ''; }
    if (acc) { playSettle(pl, half); return ''; } playLog(pl, `${A.name} refuses ${B.adj} offer of ${half.map(i => P(i).name).join(', ')}.`); return `${A.name} refuses the compromise.`; }
  if (act === 'mediate') { if (pl.mediator) return `${cname(pl.mediator)} is already mediating`; const m = alive().filter(k => k.major && !playSide(pl, k.tag) && !atWar(k.tag, pl.a) && !atWar(k.tag, pl.b) && !isAtWar(k.tag)).sort((x, y) => (opinion(y.tag, pl.a) + opinion(y.tag, pl.b)) - (opinion(x.tag, pl.a) + opinion(x.tag, pl.b)))[0]; if (!m) return 'No great power is free to mediate'; pay(); pl.mediator = m.tag; pl.dur += 10; G.tension = Math.max(0, G.tension - 2); playLog(pl, `${m.name} agrees to mediate. The deadline is extended by ten days.`); logMsg(`${m.name} mediates in the ${playName(pl)}.`, 'world', [pl.a, pl.b]); return ''; }
  if (act === 'back') { if (c.tag !== pl.a) return 'Only the demanding power can'; G.plays.splice(G.plays.indexOf(pl), 1); logMsg(`${A.name} backs down. The ${playName(pl)} passes.`, 'world'); A.stab = Math.max(0, A.stab - 10); A.pp = Math.max(0, A.pp - 50); addPact('truce', pl.a, pl.b, 365); return ''; }
  if (act === 'yield') { if (c.tag !== pl.b) return 'Only the country under pressure can'; G.plays.splice(G.plays.indexOf(pl), 1); logMsg(`${B.name} yields and agrees to ${GOAL_TXT(pl.goal)}.`, 'world'); applyGoal(pl.a, pl.b, pl.goal); addPact('truce', pl.a, pl.b, 730); return ''; }
  return 'Unknown action'; }
function playSettle(pl, provs) { if (!G.plays.includes(pl)) return; G.plays.splice(G.plays.indexOf(pl), 1); applyGoal(pl.a, pl.b, { type: 'take', provs: provs.filter(i => P(i).owner === pl.b) }); addPact('truce', pl.a, pl.b, 730); G.tension = Math.max(0, G.tension - 2);
  logMsg(`The ${playName(pl)} is settled: ${cname(pl.b)} cedes ${provs.map(i => P(i).name).join(', ')}.`, 'world', [pl.a, pl.b]); }
// ---------- the daily turn: phases, AI moves, mediation at the brink ----------
{ const _pd = playDaily; playDaily = function () {
  for (const pl of G.plays) { playMults(pl); const t = G.day - pl.day; if (t === 0 && !pl.log) { playLog(pl, `${cname(pl.a)} demands that ${cname(pl.b)} ${GOAL_TXT(pl.goal)}.`);
      if (pl.b === G.player && !C(pl.b).ai && !pl.force) UIH.popup({ title: 'A Demand', icon: '📜', days: 7, def: 1, desc: `${cname(pl.a)} demands that we ${GOAL_TXT(pl.goal)}. We have ${pl.dur} days before we must answer: time to mobilise, find friends, offer a compromise or ask for mediation.`, options: [{ name: 'Open the crisis screen.', fn: () => { UI.playOpen = pl.id; } }, { name: 'Later.' }] }); }
    if (t === 8) { pl._b8 = [pl.A.length, pl.B.length]; }
    if (t > 8 && t % 5 === 0 && t < pl.dur) playAI(pl); }
  // mediation: if this would end in war, the mediator may impose half the demand instead
  for (const pl of G.plays.slice()) if (pl.mediator && G.day - pl.day >= pl.dur && pl.goal.type === 'take' && pl.goal.provs.length > 1 && !pl.force && pl.a !== G.player && pl.b !== G.player) { const o = playOdds(pl); if (o.war > 0.5 && Math.random() < 0.6) { playSettle(pl, pl.goal.provs.slice(0, Math.ceil(pl.goal.provs.length / 2))); logMsg(`${cname(pl.mediator)} brokers the compromise.`, 'world'); } }
  const before = G.plays.map(p => [p, p.A.length, p.B.length]); _pd();
  for (const [p, a, b] of before) if (G.plays.includes(p)) { for (const t of p.A.slice(a)) playLog(p, `${cname(t)} declares for ${cname(p.a)}.`); for (const t of p.B.slice(b)) playLog(p, `${cname(t)} declares for ${cname(p.b)}.`); } }; }
function playAI(pl) { const A = C(pl.a), B = C(pl.b), o = playOdds(pl);
  if (A.ai && A.exists) { if (o.y < 0.5 && o.R > 0.8 && playEsc(pl, 'A') < 3 && A.pp >= 40 && Math.random() < 0.5) playAct(A, pl, 'mob');
    else if (o.R < 0.7 && pl.goal.type === 'take' && pl.goal.provs.length > 1 && !(pl.cut >= 1) && Math.random() < 0.5) playAct(A, pl, 'cut');
    if (A.infl >= 60 && Math.random() < 0.4) { const n = alive().filter(k => !playSide(pl, k.tag) && !k.overlord && !(pl.noBack || []).includes(k.tag) && (k.major ? !G.historical : NB[k.capital].some(e => P(e.to).owner === pl.b)) && opinion(k.tag, pl.a) > 10)[0]; if (n) playAct(A, pl, 'sway', n.tag); } }
  if (B.ai && B.exists && G.plays.includes(pl)) { if (o.y > 0.3 && playEsc(pl, 'B') < 3 && B.pp >= 40 && Math.random() < 0.6) playAct(B, pl, 'mob');
    if (B.infl >= 60 && Math.random() < 0.5) { const n = alive().filter(k => !playSide(pl, k.tag) && !k.overlord && !(pl.noBack || []).includes(k.tag) && (k.major ? !G.historical : NB[k.capital].some(e => P(e.to).owner === pl.a)) && opinion(k.tag, pl.b) > opinion(k.tag, pl.a))[0]; if (n) playAct(B, pl, 'sway', n.tag); }
    if (G.plays.includes(pl) && o.y > 0.75 && pl.goal.type === 'take' && pl.goal.provs.length > 1 && B.pp >= 30 && Math.random() < 0.35) playAct(B, pl, 'offer');
    if (G.plays.includes(pl) && !pl.mediator && o.war > 0.6 && B.infl >= 60 && Math.random() < 0.3) playAct(B, pl, 'mediate'); }
  // other AI great powers lean in on behalf of friends
  if (!G.historical) for (const k of alive()) { if (!k.ai || !k.major || playSide(pl, k.tag) || (pl.noBack || []).includes(k.tag) || k.infl < 50 || Math.random() > 0.08) continue; const da = opinion(k.tag, pl.a), db = opinion(k.tag, pl.b); if (Math.abs(da - db) > 60 && !isAtWar(k.tag)) playAct(k, pl, 'join', da > db ? 'A' : 'B'); }
}

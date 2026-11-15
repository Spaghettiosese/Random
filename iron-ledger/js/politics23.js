// 2.3 Politics 3.0.
//  - Parliaments: seats follow the parties' support; a government needs a coalition with a majority. Minority
//    governments struggle to pass laws and can lose a vote of confidence.
//  - Approval: what the people think of the government, from stability, jobs and prices, war weariness and victories.
//    It decides elections, confidence votes and, in dictatorships, how safe the regime is.
//  - Scandals: bribes, spies, bank crashes and affairs. Sack the minister, ride it out, or blame the opposition.
//  - The street: party militias of the fascists and communists grow with radicalism; they fight in the streets, and
//    a strong militia makes a coup likelier. They can be banned.
//  - Regional movements: Slovaks, Croats, Ukrainians, Catalans, Quebec, Korea, Indochina... Grant autonomy, make
//    concessions or repress; a movement at full strength rises.
//  - The press: free, guided or censored, with its own costs and benefits.
'use strict';
// ======================= parliament =======================
const SEATS = 400;
const hasParl = c => typeof hasElections === 'function' && hasElections(c);
function seatsOf(c) { const ps = partiesOf(c).filter(p => !p.banned), sh = ps.map(p => Math.max(0, partyPop(c, p))), tot = sum(sh, x => x) || 1; const raw = sh.map(x => x / tot * SEATS); const s = raw.map(Math.floor);
  let left = SEATS - sum(s, x => x); raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { s[i]++; left--; } }); const o = {}; ps.forEach((p, i) => { o[p.id] = s[i]; }); return o; }
const coalOf = c => { const r = rulingParty(c); if (!c.coal || !r || !c.coal.includes(r.id)) c.coal = r ? [r.id] : []; c.coal = c.coal.filter(id => partiesOf(c).some(p => p.id === id && !p.banned)); return c.coal; };
function coalSeats(c) { const s = seatsOf(c); return sum(coalOf(c), id => s[id] || 0); }
const majority = c => !hasParl(c) || coalSeats(c) > SEATS / 2;
// parties that will sit together: same ideology first, then the neighbours on the spectrum
const COAL_FIT = { dem: { dem: 1, aut: 0.6, com: 0.3, fas: 0.05 }, aut: { aut: 1, dem: 0.5, fas: 0.6, com: 0 }, fas: { fas: 1, aut: 0.7, dem: 0.1, com: 0 }, com: { com: 1, dem: 0.4, aut: 0, fas: 0 } };
function formCoalition(c, quiet) { const r = rulingParty(c); if (!r) return; const s = seatsOf(c); c.coal = [r.id]; let n = s[r.id] || 0;
  const cand = partiesOf(c).filter(p => p !== r && !p.banned && (COAL_FIT[r.ideo] || {})[p.ideo] > 0.25).sort((a, b) => (COAL_FIT[r.ideo][b.ideo] * (s[b.id] || 0)) - (COAL_FIT[r.ideo][a.ideo] * (s[a.id] || 0)));
  for (const p of cand) { if (n > SEATS / 2) break; c.coal.push(p.id); n += s[p.id] || 0; }
  if (!quiet && c.tag === G.player) UIH.notify(`${c.party} governs ${n > SEATS / 2 ? 'with a majority' : 'as a minority'}: ${n} of ${SEATS} seats.`, n > SEATS / 2 ? 'good' : 'bad'); }
// laws pass more easily with a majority in parliament, and often fail without one
{ const _lc = lawChance; lawChance = function (c, cat, law) { const v = _lc(c, cat, law); return hasParl(c) ? clamp(v + (majority(c) ? 8 : -15), 3, 97) : v; }; }
// ======================= approval =======================
function approvalTarget(c) { const e = c.ec || {}, unemp = e.unemp || 0.06, infl = e.infl || 2; let a = 50 + (c.stab - 50) * 0.45 - Math.max(0, unemp - 0.05) * 150 - Math.max(0, infl - 4) * 1.2 - (c.warExh || 0) * 0.3 + (c.legit - 50) * 0.15;
  if (isAtWar(c.tag)) { const lose = capInfo(c.tag).prog; a += lose > 0.15 ? -12 : (G.P.some(p => p.ctrl === c.tag && p.owner !== c.tag && atWar(c.tag, p.owner)) ? 6 : 0); if (G.day - (c._warStart || G.day) < 120) a += 6; }
  a += c.pressK === 'censored' ? 6 : c.pressK === 'guided' ? 3 : 0; a += c._scandalHit || 0; return clamp(a, 3, 97); }
function approvalMonthly(c) { if (c.appr === undefined) c.appr = approvalTarget(c); c.appr = clamp(c.appr * 0.75 + approvalTarget(c) * 0.25, 0, 100); c._scandalHit = (c._scandalHit || 0) * 0.8;
  if (isAtWar(c.tag) && c._warStart === undefined) c._warStart = G.day; if (!isAtWar(c.tag)) delete c._warStart; }
// elections reward a popular government; a confidence vote can bring an unpopular minority down
{ const _el = election; election = function (c) { const r = rulingParty(c); if (r && c.appr !== undefined) r.w = clamp(r.w * (1 + (c.appr - 50) / 160), 0.2, 2.2); _el(c); formCoalition(c); }; }
function confidenceMonthly(c) { if (!hasParl(c) || majority(c) || isAtWar(c.tag) && c.appr > 30) return; const risk = (50 - (c.appr || 50)) / 600 + 0.01; if (Math.random() > risk) return;
  const r = rulingParty(c), s = seatsOf(c), alt = partiesOf(c).filter(p => p !== r && !p.banned && p.ideo === c.ideology).sort((a, b) => (s[b.id] || 0) - (s[a.id] || 0))[0];
  logMsg(`${c.name}: the government of ${c.leader} loses a vote of confidence.`, c.major ? 'world' : 'info', [c.tag]); c.stab = Math.max(0, c.stab - 4);
  if (alt) { takeOffice(c, alt, 'forms a new government'); formCoalition(c); } else { c.nextElection = G.day + 45; if (c.tag === G.player) UIH.notify('The government has fallen: new elections in six weeks.', 'bad'); } }
// ======================= scandals =======================
const SCANDALS = [
  ['The Contracts Affair', 'A minister took money from an arms firm for a contract the army did not want.'], ['The Spy in the Ministry', 'A clerk in the war ministry has been selling secrets, and his superiors protected him.'],
  ['The Bank Crash', 'A bank close to the government collapses, taking the savings of a hundred thousand families with it.'], ['The Minister\'s Affair', 'A cabinet minister\'s private life is on every front page.'],
  ['The Bonds Swindle', 'A financier sold worthless bonds with the help of friends in the cabinet.'], ['The Police Cover-up', 'The police killed a striker and the ministry hid it.'],
  ['The Land Grant Scandal', 'Public land was sold cheaply to the families of deputies.'], ['The Forged Letters', 'Letters published to discredit the opposition turn out to be forgeries made in a ministry.']];
function scandalMonthly(c) { const free = (c.pressK || 'free') === 'free', p = 0.012 * (free ? 1.6 : c.pressK === 'censored' ? 0.3 : 0.8) * (hasSpirit(c, 'corruption') || c.ltrait === 'corrupt' ? 2 : 1) * (c.legit < 40 ? 1.5 : 1); if (Math.random() > p) return;
  const s = pick(SCANDALS); c._scandalHit = (c._scandalHit || 0) - 10; c.legit = Math.max(0, c.legit - 2);
  if (c.tag === G.player) UIH.popup({ title: s[0], icon: '📰', desc: `${s[1]}<br><br>The press wants a head. The opposition wants the government's.`, options: [
    { name: 'Sack the minister', tip: '25 political power; approval recovers', fn: () => { c.pp = Math.max(0, c.pp - 25); c._scandalHit += 7; } },
    { name: 'Ride it out', tip: 'Legitimacy -2; approval falls further', fn: () => { c.legit = Math.max(0, c.legit - 2); c._scandalHit -= 4; } },
    { name: 'Blame the opposition', tip: 'Approval +3; radicalism +2%; stability -2', fn: () => { c._scandalHit += 3; c.rad = Math.min(1, c.rad + 0.02); c.stab = Math.max(0, c.stab - 2); } }] });
  else { if (c.pp > 60) { c.pp -= 25; c._scandalHit += 7; } if (c.major) logMsg(`${c.name}: ${s[0]}. ${s[1]}`, 'info', [c.tag]); } }
// ======================= the street =======================
const STREET_NAME = { fas: ['Blackshirts', 'Storm Troops', 'Legion', 'Iron Guard', 'Shirts'], com: ['Red Front', 'Workers\' Militia', 'Red Guards', 'Defence Leagues'] };
const streetOf = c => c.street || (c.street = { fas: 0, com: 0 });
function streetMonthly(c) { const S = streetOf(c), sec = c.laws && c.laws.security, police = sec === 'secret_police' ? 0.5 : sec === 'guard' || sec === 'national_guard' ? 0.75 : 1;
  for (const i of ['fas', 'com']) { if (c.ideology === i) { S[i] = Math.max(0, S[i] - 2); continue; } const banned = partiesOf(c).some(p => p.ideo === i && p.banned);
    const grow = (c.sup[i] / 25) * (0.6 + c.rad * 2) * police * (banned ? 0.7 : 1) - 0.8 - (S._ban && G.day - S._ban < 365 ? 1.5 : 0); S[i] = clamp(S[i] + grow, 0, 100); }
  const top = Math.max(S.fas, S.com); if (top > 40 && Math.random() < (top - 35) / 200) { c.stab = Math.max(0, c.stab - 2); const k = S.fas > S.com ? 'fas' : 'com';
    if (c.tag === G.player) UIH.notify(`Street fighting in ${P(c.capital).name}: the ${STREET_NAME[k][0]} clash with the police and their enemies.`, 'bad'); } }
{ const _cr = coupRisk; coupRisk = function (c) { let r = _cr(c); const S = c.street; if (S) r += Math.max(0, Math.max(S.fas, S.com) - 50) * 0.3; if (!hasParl(c) && c.appr !== undefined) r += Math.max(0, 35 - c.appr) * 0.25; return r; }; }
function banMilitias(c) { if (c.pp < 40) return 'Needs 40 political power'; const S = streetOf(c); c.pp -= 40; S.fas *= 0.4; S.com *= 0.4; S._ban = G.day; c.legit = Math.max(0, c.legit - 2); c.rad = Math.min(1, c.rad + 0.02); return ''; }
// ======================= regional movements =======================
// [name, provinces, what they want]
const REGIONS = {
  CZE: [['Slovak Autonomists', ['Bratislava', 'Banská Bystrica', 'Košice'], 'Hlinka\'s party wants Slovakia governed from Bratislava.'], ['Sudeten German Party', ['Karlsbad', 'Reichenberg'], 'Henlein\'s movement looks to Berlin.']],
  YUG: [['Croatian Peasant Party', ['Zagreb', 'Split', 'Osijek'], 'Maček wants a Croatia that governs itself.'], ['Macedonian Revolutionaries', ['Skopje', 'Bitola'], 'IMRO gunmen in the hills of the south.']],
  POL: [['Ukrainian Nationalists', ['Lwów', 'Stanisławów', 'Tarnopol', 'Łuck', 'Równe'], 'The OUN wants a Ukrainian state, and the moderates want schools in their own language.']],
  SPA: [['Catalan Nationalists', ['Barcelona', 'Lleida'], 'The Generalitat wants its statute back, or more.'], ['Basque Nationalists', ['Bilbao'], 'The PNV wants Euzkadi.']],
  ENG: [['Arab Revolt in Palestine', ['Jerusalem', 'Nablus'], 'The Arab Higher Committee demands an end to Jewish immigration and independence.'], ['Burmese Nationalists', ['Rangoon', 'Mandalay'], 'The Thakins want Burma for the Burmese.'], ['Ulster Unionists and Republicans', ['Belfast'], 'Two communities, two flags, one province.']],
  FRA: [['Vietnamese Nationalists', ['Hanoi', 'Hue', 'Saigon', 'Haiphong'], 'Nationalists and Communists want independence from France.'], ['Algerian Nationalists', ['Algiers', 'Oran', 'Constantine'], 'Messali Hadj\'s movement wants Algeria free.'], ['Syrian National Bloc', ['Damascus', 'Aleppo', 'Homs'], 'The treaty of 1936 promised independence; Paris never ratified it.']],
  HOL: [['Indonesian Nationalists', ['Batavia', 'Surabaya', 'Bandung', 'Semarang'], 'Sukarno and Hatta want Indonesia free.']],
  CAN: [['Quebec Nationalists', ['Quebec', 'Montreal'], 'French Canada will not be conscripted for Britain\'s wars.']],
  JAP: [['Korean Independence Movement', ['Keijo', 'Heijo', 'Fusan', 'Kanko'], 'The Provisional Government in exile and the guerrillas of the north.'], ['Taiwanese Autonomy', ['Taihoku'], 'Petitions for a Formosan parliament.']],
  ROM: [['Hungarian Minority', ['Cluj', 'Oradea'], 'Transylvania\'s Hungarians look to Budapest.']],
  TUR: [['Kurdish Rebels', ['Diyarbakır', 'Van'], 'The mountains of the east have risen before, at Dersim.']],
  ITA: [['South Tyrolean Germans', ['Bolzano'], 'Italianisation is resented in the German valleys.']],
  IRQ: [['Kurdish Tribes', ['Mosul', 'Kirkuk'], 'Barzani\'s fighters in the north.']],
  PER: [['Azerbaijani Autonomists', ['Tabriz'], 'Tabriz looks north, to Soviet Baku.']],
  BEL: [['Flemish Nationalists', ['Antwerp', 'Ghent'], 'The VNV wants Flanders for the Flemings.']],
  SOV: [['Ukrainian Nationalists', ['Kiev', 'Zhitomir', 'Vinnitsa'], 'Underground nationalists remember the famine.'], ['Caucasian Nationalists', ['Tiflis', 'Baku', 'Yerevan'], 'Georgians, Armenians and Azeris dream of the republics of 1918.']],
  USA: [['Puerto Rican Nationalists', ['San Juan'], 'Albizu Campos\' Nationalists want independence.']],
  CHI: [['Inner Mongolian Autonomists', ['Kalgan'], 'Prince Demchugdongrub courts the Japanese.']],
  RAJ: [['The Muslim League', ['Lahore', 'Karachi', 'Dacca', 'Peshawar'], 'Jinnah\'s League demands Pakistan.']]
};
const regsOf = c => { const def = REGIONS[c.tag.slice(0, 3)]; if (!def) return []; if (!c.regs || c.regs.length !== def.length) c.regs = def.map((d, i) => (c.regs && c.regs[i]) || { s: 20 + Math.floor(Math.random() * 25), st: 'none', rep: 0 }); return c.regs; };
const regProvs = (c, i) => REGIONS[c.tag.slice(0, 3)][i][1].map(n => PN(n)).filter(p => p && p.owner === c.tag);
function regionsMonthly(c) { const R = regsOf(c); R.forEach((r, i) => { const ps = regProvs(c, i); if (!ps.length) { r.s = Math.max(0, r.s - 2); return; }
    const un = sum(ps, p => p.unrest || 0) / ps.length, lose = isAtWar(c.tag) && capInfo(c.tag).prog > 0.1;
    r.s = clamp(r.s + (0.4 + un / 60 + (c.stab < 40 ? 0.8 : 0) + (lose ? 1.6 : 0) + (c.ideology === 'dem' ? 0.3 : 0)) * (r.st === 'autonomy' ? 0.35 : 1) - (r.st === 'autonomy' ? 0.3 : 0) + (r.rep > 0 ? 0.25 : 0), 0, 100);
    if (r.s >= 100) { r.s = 60; c.stab = Math.max(0, c.stab - 5); for (const p of ps) { p.unrest = Math.max(p.unrest || 0, 75); pmAdd(p, 'martial', 180, true); }
      logMsg(`The ${REGIONS[c.tag.slice(0, 3)][i][0]} rise against ${c.name}: martial law in ${ps.map(p => p.name).slice(0, 3).join(', ')}.`, c.major ? 'world' : 'info', [c.tag]); }
    // the AI answers a strong movement
    if (c.ai && r.s > 65 && Math.random() < 0.15) regionAct(c, i, c.ideology === 'dem' && r.st !== 'autonomy' ? 'autonomy' : c.pp > 60 ? 'repress' : 'concede'); }); }
function regionAct(c, i, k) { const r = regsOf(c)[i], name = REGIONS[c.tag.slice(0, 3)][i][0], ps = regProvs(c, i); if (!r) return 'No such movement';
  if (k === 'autonomy') { if (r.st === 'autonomy') return 'Already autonomous'; if (c.pp < 40) return 'Needs 40 political power'; c.pp -= 40; r.st = 'autonomy'; r.s = Math.max(0, r.s - 30); c.stab = Math.min(100, c.stab + 2); c.legit = Math.max(0, c.legit - 1); logMsg(`${c.name} grants autonomy to the ${name}.`, 'info', [c.tag]); }
  else if (k === 'concede') { if (c.pp < 15) return 'Needs 15 political power'; c.pp -= 15; r.s = Math.max(0, r.s - 10); }
  else if (k === 'repress') { if (r.st === 'autonomy') return 'Revoke their autonomy first'; if (c.pp < 25) return 'Needs 25 political power'; c.pp -= 25; r.s = Math.max(0, r.s - 25); r.rep++; c.legit = Math.max(0, c.legit - 3); for (const p of ps) p.unrest = Math.min(100, (p.unrest || 0) + 20); }
  else if (k === 'revoke') { if (r.st !== 'autonomy') return 'They have no autonomy'; r.st = 'none'; r.s = Math.min(100, r.s + 20); c.stab = Math.max(0, c.stab - 3); }
  return ''; }
// ======================= the press =======================
const PRESS = { free: ['Free Press', 'Newspapers say what they like. Scandals come out; the public trusts what it reads.', { legit: 5, research: 0.03 }], guided: ['Guided Press', 'Editors are reminded of their patriotic duty.', { stab: 2 }], censored: ['Censorship', 'Nothing is printed that the ministry has not read.', { stab: 4, ws: 5, legit: -6, research: -0.03 }] };
for (const k in PRESS) SPIRITS['press_' + k] = [PRESS[k][0], PRESS[k][1], PRESS[k][2]];
function setPress(c, k, free) { if (!PRESS[k] || c.pressK === k) return ''; if (!free && c.pp < 30) return 'Needs 30 political power'; if (!free) c.pp -= 30; for (const x in PRESS) removeSpirit(c, 'press_' + x); c.pressK = k; addSpirit(c, 'press_' + k); return ''; }
const pressDefault = c => c.ideology === 'dem' ? 'free' : c.ideology === 'aut' ? 'guided' : 'censored';
// ======================= the monthly round =======================
function politics23Monthly(c) { if (!c.exists || c.capitulated) return; if (!c.pressK) setPress(c, pressDefault(c), true);
  if (c.ai && c.pressK !== pressDefault(c) && Math.random() < 0.1) setPress(c, pressDefault(c), true);
  approvalMonthly(c); if (hasParl(c)) { if (!c.coal) formCoalition(c, true); confidenceMonthly(c); } scandalMonthly(c); streetMonthly(c); regionsMonthly(c);
  if (c.ai && Math.max(streetOf(c).fas, streetOf(c).com) > 65 && c.pp > 80 && Math.random() < 0.2) banMilitias(c); }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); try { politics23Monthly(c); } catch (e) { if (typeof console !== 'undefined') console.warn('politics23', c.tag, e); } }; }
// a change of government re-forms the coalition
{ const _to = takeOffice; takeOffice = function (c, p, how) { const r = _to(c, p, how); if (hasParl(c)) formCoalition(c, true); return r; }; }

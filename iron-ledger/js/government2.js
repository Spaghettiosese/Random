// 2.0 Government: forms of government, regime transitions, six new law categories, and the Government Programme.
'use strict';
// ---------- new law categories ----------
Object.assign(LAWS, {
  women: { name: 'Women\'s Rights', laws: {
    no_vote: ['Men Only', {}, { devout: 1, land: 1, intel: -1 }, {}],
    suffrage: ['Women\'s Suffrage', { legit: 3 }, { intel: 1, union: 1, devout: -1 }, {}],
    equality: ['Women in Every Trade', { output: 0.04, manpower: 0.04 }, { union: 1, intel: 1, devout: -2, land: -1 }, {}] } },
  church: { name: 'Church and State', laws: {
    state_church: ['State Church', { stab: 3, legit: 4 }, { devout: 2, intel: -1 }, {}],
    concordat: ['Concordat', { stab: 2 }, { devout: 1 }, {}],
    separation: ['Separation of Church and State', { research: 0.03 }, { intel: 1, devout: -1 }, {}],
    atheism: ['State Atheism', { research: 0.04, stab: -4 }, { devout: -3, intel: 1, union: 1 }, {}] } },
  citizen: { name: 'Citizenship', laws: {
    ethnic: ['Ethnic Citizenship', { ws: 4, stab: -2 }, { pb: 1, army: 1, intel: -1 }, {}],
    civic: ['Civic Nationality', { legit: 3 }, { intel: 1 }, {}],
    open_door: ['Open Borders', { growth: 0.1, output: 0.02 }, { ind: 1, pb: -1 }, {}] } },
  emerg: { name: 'Emergency Powers', laws: {
    normal_gov: ['Ordinary Government', {}, { intel: 1 }, {}],
    decree: ['Rule by Decree', { pp: 0.15, legit: -5 }, { army: 1, intel: -2 }, {}],
    martial: ['Martial Law', { stab: 6, pp: 0.1, output: -0.05, legit: -8 }, { army: 2, intel: -2, union: -2 }, {}] } },
  colonial: { name: 'Colonial Policy', laws: {
    exploit: ['Colonial Exploitation', { tax: 0.06, rad: 0.03 }, { ind: 1, land: 1, intel: -1 }, {}],
    assimilate: ['Assimilation', { legit: 2 }, { pb: 1 }, {}],
    selfrule: ['Colonial Self-Rule', { infl: 0.1, tax: -0.03 }, { intel: 2, ind: -1 }, {}] } },
  service: { name: 'Military Service', laws: {
    svc_short: ['One-Year Service', { train: -0.1, manpower: -0.03 }, { union: 1, rural: 1, army: -1 }, {}],
    svc_std: ['Two-Year Service', {}, {}, {}],
    svc_long: ['Three-Year Service', { train: 0.15, org: 0.03, output: -0.02 }, { army: 2, union: -1, rural: -1 }, {}] } }
});
const SUFFRAGE = ['USA', 'ENG', 'CAN', 'AST', 'NZL', 'SAF', 'IRE', 'GER', 'AUT', 'POL', 'CZE', 'SWE', 'NOR', 'DEN', 'FIN', 'HOL', 'LUX', 'EST', 'LAT', 'LIT', 'TUR', 'SPA', 'URU', 'BRA', 'CUB', 'ECU', 'PHI', 'MON'];
const COLONIAL = ['ENG', 'FRA', 'HOL', 'BEL', 'POR', 'ITA', 'JAP', 'SPA', 'USA'];
function newLawDefaults(c) { const t = c.tag.slice(0, 3), i = c.ideology, L = c.laws;
  L.women = L.women || (['SOV', 'PRC', 'MON'].includes(t) ? 'equality' : SUFFRAGE.includes(t) ? 'suffrage' : 'no_vote');
  L.church = L.church || (i === 'com' ? 'atheism' : ['ITA', 'GER', 'POL', 'AUT', 'IRE', 'POR', 'LIT'].includes(t) ? 'concordat' : ['ENG', 'SWE', 'NOR', 'DEN', 'GRE', 'SAU', 'YEM', 'TIB', 'AFG', 'PER', 'ETH'].includes(t) ? 'state_church' : 'separation');
  L.citizen = L.citizen || (i === 'fas' ? 'ethnic' : ['USA', 'CAN', 'ARG', 'BRA', 'AST'].includes(t) ? 'open_door' : 'civic');
  L.emerg = L.emerg || (i === 'dem' ? 'normal_gov' : 'decree'); L.colonial = L.colonial || (COLONIAL.includes(t) ? 'exploit' : 'assimilate');
  L.service = L.service || (['FRA', 'GER', 'SOV', 'JAP', 'ITA', 'POL', 'ROM'].includes(t) ? 'svc_long' : ['USA', 'ENG', 'CAN', 'AST', 'NZL', 'IRE'].includes(t) ? 'svc_short' : 'svc_std'); }
// ---------- forms of government ----------
const GOV_FORM = {
  dem: { parl_rep: ['Parliamentary Republic', { stab: 4, legit: 3 }, 'Cabinets answer to the chamber; they rise and fall with it.'], const_mon: ['Constitutional Monarchy', { legit: 6, stab: 2 }, 'The Crown reigns; ministers rule.'], pres_rep: ['Presidential Republic', { pp: 0.1, stab: -1 }, 'A strong executive, elected directly.'], direct: ['Direct Democracy', { legit: 8, pp: -0.1, stab: 3 }, 'Referendums decide the great questions.'] },
  aut: { abs_mon: ['Royal Autocracy', { legit: 8, research: -0.03 }, 'The King governs through ministers of his choosing.'], junta: ['Military Junta', { org: 0.04, legit: -6, ws: 4 }, 'Colonels in the ministries.'], dictator: ['Personal Dictatorship', { pp: 0.15, legit: -3 }, 'One man, his family and his friends.'], technocracy: ['Technocratic Regime', { research: 0.05, output: 0.03, legit: -2 }, 'Engineers and economists instead of politicians.'], theocratic: ['Clerical State', { stab: 5, legit: 5, research: -0.05 }, 'Altar and throne, or altar alone.'] },
  fas: { party_state: ['Party State', { pp: 0.12, stab: 3 }, 'The Party is the state.'], corporatist: ['Corporatist State', { output: 0.04, mil_out: 0.04 }, 'Employers and workers bound into corporations.'], military_fas: ['Militarist Regime', { atk: 0.04, ws: 6, output: -0.03 }, 'The army sets policy; the party cheers.'], royal_fas: ['Royal Dictatorship', { legit: 6, pp: 0.05 }, 'A crowned head over a movement in uniform.'] },
  com: { vanguard: ['Vanguard Party State', { pp: 0.1, stab: 3 }, 'The Party leads the class.'], council_rep: ['Council Republic', { build: 0.06, legit: 4, pp: -0.05 }, 'Soviets in every factory and village.'], personal_com: ['Cult of Personality', { pp: 0.2, stab: 4, research: -0.03 }, 'The Leader is always right.'], federation: ['Federation of Soviet Republics', { manpower: 0.05, legit: 3 }, 'Nations bound by a common revolution.'] }
};
for (const i in GOV_FORM) for (const k in GOV_FORM[i]) SPIRITS['form_' + k] = [GOV_FORM[i][k][0], GOV_FORM[i][k][2], GOV_FORM[i][k][1]];
const FORM_OF = { SOV: 'personal_com', ITA: 'royal_fas', JAP: 'military_fas', SPA1: 'military_fas', POL: 'junta', HUN: 'dictator', ROM: 'abs_mon', YUG: 'abs_mon', BUL: 'abs_mon', GRE: 'dictator', SWI: 'direct', USA: 'pres_rep', FRA: 'parl_rep', ENG: 'const_mon', HOL: 'const_mon', BEL: 'const_mon', SWE: 'const_mon', NOR: 'const_mon', DEN: 'const_mon', CHI: 'dictator', TUR: 'dictator', POR: 'corporatist', AUT: 'corporatist', BRA: 'dictator', SAU: 'theocratic', TIB: 'theocratic', PRC: 'vanguard', MON: 'vanguard', GER: 'party_state', MAN: 'royal_fas', SIA: 'technocracy', LAT: 'dictator', EST: 'dictator', LIT: 'dictator' };
function defaultForm(c) { const F = GOV_FORM[c.ideology], t = FORM_OF[c.tag] || FORM_OF[c.tag.slice(0, 3)]; if (t && F[t]) return t; const mon = c.laws.gov === 'monarchy'; return c.ideology === 'dem' ? (mon ? 'const_mon' : 'parl_rep') : c.ideology === 'aut' ? (mon ? 'abs_mon' : 'dictator') : c.ideology === 'fas' ? (mon ? 'royal_fas' : 'party_state') : 'vanguard'; }
function applyForm(c, f) { for (const i in GOV_FORM) for (const k in GOV_FORM[i]) removeSpirit(c, 'form_' + k); c.form = GOV_FORM[c.ideology][f] ? f : defaultForm(c); addSpirit(c, 'form_' + c.form);
  if (c.form === 'const_mon' || c.form === 'abs_mon' || c.form === 'royal_fas') c.laws.gov = 'monarchy'; else if (c.laws.gov === 'monarchy' && c.ideology === 'dem') c.laws.gov = c.form === 'pres_rep' ? 'presidential' : 'parliamentary'; else if (c.form === 'theocratic') c.laws.gov = 'theocracy'; c._m = null; }
function startReform(c, f) { if (!GOV_FORM[c.ideology][f] || f === c.form) return 'Not a form our government can take'; if (c.reform) return 'A constitutional reform is already under way'; if (c.pp < 100) return 'Needs 100 political power'; c.pp -= 100; c.legit = Math.max(0, c.legit - 5); c.reform = { to: f, until: G.day + 120 }; logMsg(`${c.name} begins a constitutional reform: ${GOV_FORM[c.ideology][f][0]}.`, c.major ? 'world' : 'info', [c.tag]); return ''; }
// ---------- regime transitions ----------
const TRANSITION = {
  decree: { name: 'Suspend the Constitution', from: ['dem'], to: 'aut', cost: 120, req: c => c.stab < 45 || c.warExh > 40 || c.sup.aut + c.sup.fas > 45, reqT: 'Stability below 45, war exhaustion above 40, or authoritarian and fascist support above 45%', tip: 'Parliament is sent home. Legitimacy -15, the Intelligentsia furious; coups become less likely.', eff: c => { c.legit = Math.max(0, c.legit - 15); c.laws.emerg = 'decree'; } },
  elections: { name: 'Call Free Elections', from: ['aut', 'fas'], to: 'dem', cost: 100, req: c => c.sup.dem >= 35, reqT: 'Democratic support 35% or more', tip: 'The regime hands power to an elected government. Legitimacy +10, stability -5; the army sulks.', eff: c => { c.legit = Math.min(100, c.legit + 10); c.stab = Math.max(0, c.stab - 5); c.laws.emerg = 'normal_gov'; c.nextElection = G.day + 30; } },
  march: { name: 'March on the Capital', from: ['aut', 'dem'], to: 'fas', cost: 120, req: c => c.sup.fas >= 35 && c.ig.army.appr > -5, reqT: 'Fascist support 35% or more and an army that is not hostile', tip: 'The movement takes power in the streets. Stability -10; democrats may fight.', eff: c => { c.stab = Math.max(0, c.stab - 10); if (c.sup.dem > 35 && Math.random() < 0.5) startCivilWar(c.tag, 'dem', 0.3, `${c.adj} Republicans`); } },
  revolution: { name: 'The Revolution', from: ['aut', 'dem', 'fas'], to: 'com', cost: 150, req: c => c.sup.com >= 40, reqT: 'Communist support 40% or more', tip: 'Councils seize the factories and the barracks. Stability -15; if the army is hostile, civil war.', eff: c => { c.stab = Math.max(0, c.stab - 15); if (c.ig.army.appr < 0 && Math.random() < 0.6) startCivilWar(c.tag, c.sup.fas > c.sup.aut ? 'fas' : 'aut', 0.35, `${c.adj} Whites`); } },
  order: { name: 'The Generals Restore Order', from: ['fas', 'com', 'dem'], to: 'aut', cost: 120, req: c => c.ig.army.appr >= 0 && c.sup.aut >= 25, reqT: 'Authoritarian support 25% or more and a loyal army', tip: 'A junta of generals takes over to save the nation from itself. Stability -8.', eff: c => { c.stab = Math.max(0, c.stab - 8); } }
};
function transitionBlock(c, k) { const t = TRANSITION[k]; if (!t.from.includes(c.ideology)) return 'Not from our present government'; if (!t.req(c)) return t.reqT; if (c.pp < t.cost) return `Needs ${t.cost} political power`; if (isAtWar(c.tag) && k !== 'decree') return 'Not in wartime'; return ''; }
function doTransition(c, k) { const why = transitionBlock(c, k); if (why) return why; const t = TRANSITION[k]; c.pp -= t.cost; const old = IDEO[c.ideology][0]; setIdeology(c, t.to); t.eff(c); applyForm(c, defaultForm(c)); c.prog = null;
  logMsg(`${c.name}: ${t.name}. The ${old.toLowerCase()} government gives way to ${c.leader}.`, 'world', [c.tag]); if (typeof worldNews === 'function') worldNews(`${t.name} in ${c.name}`, `${c.name} has a new ${IDEO[c.ideology][0].toLowerCase()} government under ${c.leader}.`, '🏛️', [c.tag]); return ''; }
// ---------- the Government Programme: every government makes two pledges for its term ----------
const PLEDGE = {
  rearm: ['Rearm the Nation', 'Twenty per cent more divisions', c => sum(armiesOf(c.tag), a => a.divs.length), (c, b, v) => v >= Math.max(b + 3, b * 1.2)],
  prosper: ['Prosperity for All', 'Standard of living up by one', c => c.sol, (c, b, v) => v >= b + 1],
  order: ['Law and Order', 'Stability at 60% or more', c => c.stab, (c, b, v) => v >= 60],
  expand: ['National Greatness', 'Two more provinces', c => provsOf(c.tag).length, (c, b, v) => v >= b + 2],
  reform: ['A Reforming Government', 'Two laws passed', c => c.lawsPassed || 0, (c, b, v) => v >= b + 2],
  peace: ['Peace in Our Time', 'No war during the term', c => (isAtWar(c.tag) ? 1 : 0), (c, b, v) => !c._warInTerm],
  build: ['Build the Nation', 'Twelve per cent more industry', c => c.stats.levels || 0, (c, b, v) => v >= b * 1.12],
  unity: ['National Unity', 'Radicalism below 6%', c => c.rad, (c, b, v) => v < 0.06]
};
function announceProgramme(c, keys) { c.prog = { start: G.day, end: G.day + 730, p: keys.slice(0, 2).map(k => ({ k, b: PLEDGE[k][2](c) })) }; c._warInTerm = isAtWar(c.tag); }
function aiProgramme(c) { const fit = { fas: ['rearm', 'expand', 'order', 'build'], com: ['build', 'rearm', 'unity', 'prosper'], aut: ['order', 'build', 'rearm', 'unity'], dem: ['prosper', 'peace', 'reform', 'build'] }[c.ideology] || Object.keys(PLEDGE); const a = pick(fit); let b = pick(fit); while (b === a) b = pick(Object.keys(PLEDGE)); announceProgramme(c, [a, b]); }
function judgeProgramme(c) { const pr = c.prog; if (!pr) return; const rp = typeof rulingParty === 'function' ? rulingParty(c) : null, res = pr.p.map(x => PLEDGE[x.k][3](c, x.b, PLEDGE[x.k][2](c)));
  res.forEach(ok_ => { if (ok_) { c.legit = Math.min(100, c.legit + 6); c.pp += 50; if (rp) rp.w = Math.min(2, rp.w + 0.2); } else { c.legit = Math.max(0, c.legit - 6); c.stab = Math.max(0, c.stab - 3); if (rp) rp.w = Math.max(0.2, rp.w - 0.15); } });
  const txt = pr.p.map((x, i) => `${PLEDGE[x.k][0]}: ${res[i] ? 'kept' : 'broken'}`).join(' · '); logMsg(`${c.name}'s programme is judged — ${txt}.`, 'info', [c.tag]);
  if (c.tag === G.player && !c.ai) UIH.popup({ title: 'The Programme Is Judged', icon: '📜', desc: `Two years ago the government made two promises.<br><br>${pr.p.map((x, i) => `${res[i] ? '✅' : '❌'} <b>${PLEDGE[x.k][0]}</b> — ${PLEDGE[x.k][1]}`).join('<br>')}<br><br>Each promise kept: legitimacy +6, political power +50, the governing party gains ground. Each broken: legitimacy -6, stability -3.`, options: [{ name: 'And now, a new programme.' }] });
  c.prog = null; c.progDue = G.day + 30; }
// ---------- monthly upkeep and hooks ----------
function government2Monthly(c) { const L = c.laws; if (!L.women) newLawDefaults(c); if (!c.form || !GOV_FORM[c.ideology][c.form]) applyForm(c, defaultForm(c)); else if (!hasSpirit(c, 'form_' + c.form)) applyForm(c, c.form);
  if (c.reform && G.day >= c.reform.until) { const f = c.reform.to; c.reform = null; if (GOV_FORM[c.ideology][f]) { applyForm(c, f); c.legit = Math.min(100, c.legit + 8); logMsg(`${c.name} is now a ${GOV_FORM[c.ideology][f][0].toLowerCase()}.`, c.major ? 'world' : 'info', [c.tag]); } }
  if (isAtWar(c.tag)) c._warInTerm = true;
  if (c.prog && G.day >= c.prog.end) judgeProgramme(c);
  if (!c.prog && (c.ai || G.day >= (c.progDue || 0) + 30)) aiProgramme(c);
  if (c.ai && !c.capitulated && !(G.historical && c.major) && Math.random() < 0.01) { const k = Object.keys(TRANSITION).find(k => !transitionBlock(c, k) && (k !== 'decree' || c.stab < 30)); if (k) doTransition(c, k); } }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.exists) government2Monthly(c); }; }
{ const _sl = setLaw; setLaw = function (c, l) { const cat = lawCat(l), was = c.laws[cat]; _sl(c, l); if (was !== l && !LAWS[cat].instant) c.lawsPassed = (c.lawsPassed || 0) + 1; }; }
{ const _si = setIdeology; setIdeology = function (c, ideo, quiet) { const had = c.ideology; _si(c, ideo, quiet); if (had !== ideo && c.laws) { if (!c.laws.women) newLawDefaults(c); if (ideo === 'com') c.laws.church = 'atheism'; if (ideo === 'fas') c.laws.citizen = 'ethnic'; c.laws.emerg = ideo === 'dem' ? 'normal_gov' : 'decree'; applyForm(c, defaultForm(c)); c.reform = null; } }; }
{ const _ng = newGame; newGame = function (...a) { const r = _ng(...a); for (const t in G.C) { const c = G.C[t]; if (!c.laws) continue; newLawDefaults(c); if (c.exists) { applyForm(c, defaultForm(c)); aiProgramme(c); } } const pl = C(G.player); if (pl) { pl.prog = null; pl.progDue = 0; } return r; }; }
{ const _ds = deserialize; deserialize = function (s) { const r = _ds(s); for (const t in G.C) if (G.C[t].laws && !G.C[t].laws.women) newLawDefaults(G.C[t]); return r; }; }
// who may pass which of the new laws
{ const _la = lawAllowed; lawAllowed = function (c, cat, law) { const r = _la(c, cat, law); if (r) return r; const i = c.ideology;
  if (law === 'atheism' && i !== 'com') return 'Requires a communist government'; if (law === 'state_church' && i === 'com') return 'Unthinkable under communism';
  if (law === 'ethnic' && (i === 'dem' || i === 'com')) return 'Unthinkable under a ' + IDEO[i][0].toLowerCase() + ' government'; if (law === 'martial' && !isAtWar(c.tag) && c.stab >= 35) return 'Requires war or stability below 35';
  if (law === 'decree' && i === 'dem' && !isAtWar(c.tag)) return 'A democracy rules by decree only in wartime'; if (law === 'no_vote' && i === 'com') return 'Unthinkable under communism';
  if (cat === 'colonial' && !COLONIAL.includes(c.tag.slice(0, 3))) return 'We have no colonies'; return ''; }; }

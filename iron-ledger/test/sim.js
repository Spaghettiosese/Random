// Headless simulation: node test/sim.js [years] [player]
const fs = require('fs'), vm = require('vm'), path = require('path');
const files = ['data/provinces.js', 'data/map.js', 'data/countries.js', 'js/defs.js', 'js/core.js', 'js/economy.js', 'js/politics.js', 'js/military.js', 'js/diplomacy.js', 'js/focus.js', 'js/content.js', 'js/focus_gd.js', 'js/projects.js', 'js/allied.js', 'js/systems.js', 'js/eastern.js', 'js/v13.js', 'js/asia.js', 'js/asia_tools.js', 'js/v15.js', 'js/tree_jap.js', 'js/tree_chi.js', 'js/tree_prc.js', 'js/tree_phi.js', 'js/tree_mon.js', 'js/tree_man.js', 'js/v16.js', 'js/v17.js', 'js/v20.js', 'js/ai.js', 'js/game.js'];
const src = files.map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n;\n') + '\n;globalThis.API = { PN, newGame, gameTick, G: () => G, C, alive, provsOf, armiesOf, dateStr, UIH, countryStr, fmt, navalPower, airPower, serialize, deserialize, focusTree, TREES, genericTree, effText, DECISIONS, EVENTS, SPIRITS, TECHS, BLD, applyEff };';
vm.runInThisContext(src, { filename: 'bundle.js' });
const A = globalThis.API, years = +(process.argv[2] || 5), world = [];
A.UIH.popup = p => { if (p.options && p.options[0].fn) p.options[0].fn(); };
A.UIH.notify = (t, k) => { if (k === 'world') world.push(t); };
const t0 = Date.now(); A.newGame(process.argv[3] || 'SWI'); A.G().historical = true; A.C(A.G().player).ai = true;
// validate content references
for (const k in A.TREES) for (const f of A.TREES[k]) { A.effText(f.eff, A.C(k)); for (const p of (f.pre || '').split(/[|,]/)) if (p && !A.TREES[k].find(x => x.id === p)) throw new Error(k + ' focus ' + f.id + ' bad prereq ' + p); for (const p of (f.mutex || '').split(',')) if (p && !A.TREES[k].find(x => x.id === p)) throw new Error(k + ' bad mutex ' + p); }
for (const c of A.alive()) for (const f of A.focusTree(c)) A.effText(f.eff, c);
for (const k in A.TREES) for (const f of A.TREES[k]) for (const key of ['claim', 'core', 'fort']) { const v = f.eff[key]; if (Array.isArray(v)) v.forEach(n => { if (typeof n === 'string' && !A.C(n)) A.PN(n); }); }
console.log('focus counts', Object.keys(A.TREES).map(k => k + ' ' + A.TREES[k].length).join(', '));
for (const k in A.DECISIONS) A.effText(A.DECISIONS[k].eff, A.C('GER'));
console.log('init ms', Date.now() - t0);
const rep = () => { const G = A.G(); console.log('\n== ' + A.dateStr() + '  tension ' + G.tension.toFixed(0) + '  wars ' + G.wars.map(w => w.name + ' [' + w.att.join(',') + ' v ' + w.def.join(',') + ']').join('; '));
  for (const t of ['GER', 'SOV', 'USA', 'ENG', 'FRA', 'ITA', 'JAP', 'CHI', 'POL', 'BRA', 'SIA']) { const c = A.C(t); if (!c.exists) { console.log(t, 'GONE'); continue; }
    console.log(t, c.ideology, 'prov', A.provsOf(t).length, 'gdp', A.fmt(c.gdp), 'sol', c.sol.toFixed(1), 'w', c.w.toFixed(2), 'stab', c.stab.toFixed(0), 'ws', c.ws.toFixed(0), 'leg', c.legit.toFixed(0), 'rad', c.rad.toFixed(2), '$', A.fmt(c.money), 'net', A.fmt(c.budget.net), 'inc', A.fmt(c.budget.income), 'tax', c.taxLevel, 'div', c._ndiv, 'mp', A.fmt(c.manpower), 'arms', A.fmt(c.stock.arms), 'air', A.fmt(c.stock.aircraft), 'nav', A.fmt(c.stock.ships), 'lv', c.stats.levels, 'pp', c.pp.toFixed(0), c.capitulated ? 'CAPITULATED' : '', 'foc', Object.keys(c.focus.done).length, 'act', Object.values(c.act).reduce((a,b)=>a+b,0).toFixed(1), 'peas%', (100*c.stats.peas/c.stats.wf).toFixed(0)); } };
rep();
try { for (let d = 1; d <= years * 365; d++) { A.gameTick(); if (d % 365 === 0) rep(); } } catch (e) { console.log('CRASH', e.stack); }
console.log('\nWORLD LOG\n' + world.join('\n'));
const s = A.serialize(); A.deserialize(s); A.gameTick(); console.log('\nsave size', s.length, 'total ms', Date.now() - t0);
if (process.env.BUDGET) for (const t of process.env.BUDGET.split(',')) { const c = A.C(t); console.log(t, JSON.stringify(c.budget, (k, v) => typeof v === 'number' ? Math.round(v) : v), 'milProd', c.milProd, 'queue', c.queue.length, 'pq', c.pq.length, 'inv', Math.round(c.invPool), 'cpts', Math.round(c.stats.cpts)); }
if (process.env.FOC) for (const t of process.env.FOC.split(',')) { const c = A.C(t); console.log(t, c.ideology, 'bop', c.bop, Object.keys(c.focus.done).filter(k => !k.startsWith('x_')).map(k => k + '@' + (1936 + c.focus.done[k] / 365).toFixed(1)).join(' ')); }
if (process.env.FOC) { const c = A.C('JAP'); console.log('day', A.G().day, 'cur', c.focus.cur, 'n', Object.keys(c.focus.done).length, ['j_south','j_indo','j_pearl','j_kodo','j_tosei','j_north'].map(k => k + ':' + focusState(c, focusById(c, k)) + ':' + JSON.stringify(focusById(c, k).ai)).join(' '), Object.keys(c.focus.done).slice(-8).map(k => k + '@' + c.focus.done[k]).join(' ')); }

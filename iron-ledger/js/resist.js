// 2.1 Resistance and partisans. Every occupied nation has a resistance movement that grows with unrest, harsh rule,
// mountains and forests, and foreign help; it sabotages the occupier, raises partisan armies, and is split between
// royalists and communists, a split that may decide the country's future after liberation.
'use strict';
const RES_TERR = { m: 1, h: 0.6, f: 0.7, j: 0.8, s: 0.5 };
const resOf = t => (G.res = G.res || {})[t];
function resLands(t) { const X = C(t); return G.P.filter(p => p.cores.includes(t) && p.ctrl !== t && !(X && X.exists && friendly(t, p.ctrl) && !atWar(t, p.ctrl)) && p.ctrl !== (X && X.overlord)); }
function resMonthly() { G.res = G.res || {};
  const tags = new Set(); for (const p of G.P) for (const t of p.cores) if (p.ctrl !== t && G.C[t] && !/[CKMS]\d*$/.test(t.slice(3)) && !(G.C[t].exists && friendly(t, p.ctrl) && !atWar(t, p.ctrl))) tags.add(t);
  for (const t of Object.keys(G.res)) if (!tags.has(t)) { const r = G.res[t]; r.str -= 6; if (r.str <= 0) delete G.res[t]; }
  for (const t of tags) { const L = resLands(t); if (!L.length) continue; const X = C(t), r = G.res[t] || (G.res[t] = { str: 5, com: X && X.sup ? clamp(X.sup.com / 100 + 0.1, 0.05, 0.9) : 0.3, sup: {}, rep: 0 });
    const occ = [...new Set(L.map(p => p.ctrl))], harsh = occ.some(o => occPolicy(C(o)) === 'harsh' || (C(o).admin && C(o).admin[t] === 'exploit')) ? 1.5 : 0, un = sum(L, p => p.unrest || 0) / L.length, ter = sum(L, p => RES_TERR[p.ter] || 0) / L.length;
    const gar = L.filter(p => armiesAt(p.id).some(a => a.owner === p.ctrl)).length / L.length, aid = sum(Object.keys(r.sup), k => r.sup[k]) / 25;
    let g = un / 25 + harsh + ter * 2.5 + aid + (X && X.exists ? 0.8 : 0) - gar * 2.5; if (r.rep > G.day) g *= 1.5; r.str = clamp(r.str + g, 0, 100); for (const k in r.sup) { r.sup[k] *= 0.85; if (r.sup[k] < 1) delete r.sup[k]; }
    if (X && X.sup) r.com = clamp(r.com + (X.sup.com / 100 - r.com) * 0.03, 0.02, 0.98);
    // sabotage
    for (const p of L) if (!armiesAt(p.id).some(a => a.owner === p.ctrl)) { p.unrest = Math.min(100, (p.unrest || 0) + r.str / 40); if (r.str > 40) p.dmg = Math.min(0.4, (p.dmg || 0) + 0.004 * r.str / 50); }
    for (const o of occ) { const k = C(o); k._partisan = Math.max(k._partisan || 0, r.str); }
    // partisan armies: the government in exile, still at war, raises them in the hills
    if (r.str >= 55 && X && X.exists && Math.random() < 0.3) { const host = L.filter(p => RES_TERR[p.ter] && atWar(t, p.ctrl) && !armiesAt(p.id).some(a => a.owner === p.ctrl)).sort((a, b) => (RES_TERR[b.ter] || 0) - (RES_TERR[a.ter] || 0))[0];
      if (host) { const a = newArmy(X, host.id); a.name = r.com > 0.5 ? `${X.adj} People's Liberation Army` : `${X.adj} Home Army`; a.auto = true; a.partisan = t; const n = Math.max(2, Math.round(r.str / 15)); for (let i = 0; i < n; i++) a.divs.push({ t: 'mil', str: 0.8, org: 0.9, xp: 0.2 }); host.ctrl = t; host.unrest = 0; r.str -= 25; r.raised = (r.raised || 0) + n;
        logMsg(`Partisans rise at ${host.name}: the ${a.name} takes the field.`, 'world', [t, ...occ]); if (occ.includes(G.player)) UIH.notify(`Partisans have liberated ${host.name}.`, 'bad'); UIH.mapDirty(); } } }
  for (const c of alive()) { const v = c._partisan || 0; c._partisan = 0; removeSpirit(c, 'partisan_war'); if (v > 25) { addSpirit(c, 'partisan_war'); SPIRITS.partisan_war[2] = { supply: -v / 400, output: -v / 1000, stab: -Math.round(v / 25) }; } }
  // after liberation: a communist resistance may turn on the restored government
  for (const t in G.res) { const r = G.res[t], X = C(t); if (!X || !X.exists || X.capitulated || X.ideology === 'com' || r.civil) continue; if (resLands(t).length === 0 && r.com > 0.6 && r.str > 30 && !isAtWar(t)) { r.civil = true; startCivilWar(t, 'com', 0.3, `${X.adj} People's Liberation Army`); } }
}
SPIRITS.partisan_war = ['Partisan War', 'Behind our lines, railways are cut and depots burn.', { supply: -0.05 }];
// ---------- actions ----------
const RES_ACT = {
  sweep: ['Anti-Partisan Sweep', 25, 'pp', 'Divisions comb the hills: resistance -20, but civilians die and unrest spreads.', (c, t, r) => { if (!resLands(t).some(p => p.ctrl === c.tag && armiesAt(p.id).some(a => a.owner === c.tag))) return 'Needs our troops in their land'; r.str = Math.max(0, r.str - 20); for (const p of resLands(t)) if (p.ctrl === c.tag) { p.unrest = Math.min(100, (p.unrest || 0) + 8); if (typeof civDeath === 'function') civDeath(p, p.pop * 0.0004, null, 'occupation'); } }],
  reprisal: ['Reprisals', 10, 'pp', 'Hostages are shot for every attack: resistance -12 now, but it grows half again as fast for six months. Infamy +2.', (c, t, r) => { r.str = Math.max(0, r.str - 12); r.rep = G.day + 180; c.infamy += 2; }],
  amnesty: ['Amnesty', 30, 'pp', 'Partisans who hand in their weapons go home: resistance -6, unrest -15, and the royalists gain ground.', (c, t, r) => { r.str = Math.max(0, r.str - 6); r.com = Math.max(0.02, r.com - 0.08); for (const p of resLands(t)) if (p.ctrl === c.tag) p.unrest = Math.max(0, (p.unrest || 0) - 15); }],
  supply: ['Supply the Resistance', 20, 'infl', 'Air drops of rifles and radios: resistance grows faster for months. Our ideology gains ground within it. Costs 150 rifles too.', (c, t, r) => { if ((c.stock.arms || 0) < 150) return 'Needs 150 rifles in stock'; c.stock.arms -= 150; r.sup[c.tag] = (r.sup[c.tag] || 0) + 30; r.com = clamp(r.com + (c.ideology === 'com' ? 0.1 : -0.08), 0.02, 0.98); addRel(t, c.tag, 10); }],
  rise: ['Call the Nation to Arms', 40, 'pp', 'The government in exile calls for a general rising: if the resistance is strong enough, partisan armies rise at once.', (c, t, r) => { if (r.str < 40) return 'The resistance is not yet strong enough (40)'; r.str = Math.min(100, r.str + 20); }]
};
function resAct(c, t, a) { const r = resOf(t), d = RES_ACT[a]; if (!r) return 'No resistance there'; if (c[d[2]] < d[1]) return 'Not enough ' + (d[2] === 'pp' ? 'political power' : 'influence'); const why = d[4](c, t, r); if (why) return why; c[d[2]] -= d[1]; return ''; }
function resRole(c, t) { if (c.tag === t) return 'gov'; if (resLands(t).some(p => p.ctrl === c.tag || (C(p.ctrl) && C(p.ctrl).overlord === c.tag))) return 'occ'; if (resLands(t).some(p => atWar(c.tag, p.ctrl))) return 'sup'; return null; }
// AI: occupiers sweep, enemies of the occupier supply
function aiResist(c) { if (!G.res) return; for (const t in G.res) { const r = G.res[t], role = resRole(c, t); if (!role) continue;
  if (role === 'occ' && r.str > 45 && Math.random() < 0.3) resAct(c, t, c.ideology === 'fas' && Math.random() < 0.5 ? 'reprisal' : 'sweep');
  else if (role === 'sup' && c.major && Math.random() < 0.2) resAct(c, t, 'supply'); else if (role === 'gov' && r.str >= 45 && Math.random() < 0.3) resAct(c, t, 'rise'); } }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); resMonthly(); }; }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.ai && c.exists && !c.capitulated) aiResist(c); }; }
// trees: help or harm a resistance
Object.assign(XTOK, { resist: v => { const [t, n] = v.trim().split(' '); return [c => { const r = resOf(t) || ((G.res = G.res || {})[t] = { str: 0, com: 0.3, sup: {}, rep: 0 }); r.str = clamp(r.str + +n, 0, 100); }, `${COUNTRY_DEF[t] ? COUNTRY_DEF[t].n : t} resistance ${+n > 0 ? '+' : ''}${n}`]; } });

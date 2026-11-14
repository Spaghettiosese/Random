// 2.1 Occupation 2.0. Each occupied country gets its own occupation laws (administration, economy, labour, policing and
// recruitment) and a compliance level that grows over years of quiet rule and collapses under terror. Compliance raises
// what the land yields and calms it; harsh laws yield more now and feed the resistance.
'use strict';
const OCC2 = {
  adm: ['Administration', { mil: ['Military Command', 'The army governs. Neutral.', { un: 0, y: 1, comp: 0, pp: 0 }], civ: ['Civil Commissioner', 'A commissioner and his staff squeeze more out of the land. Costs political power.', { un: 0.6, y: 1.25, comp: -0.1, pp: 0.5 }], loc: ['Local Collaborators', 'Their own officials run the land in our name: calmer, and more compliant, but they keep a share.', { un: -1.5, y: 0.85, comp: 0.6, pp: 0 }] }],
  eco: ['Economy', { light: ['Light Extraction', 'Buy what we need at fair prices.', { un: -1, y: 0.6, comp: 0.3 }], req: ['Requisitions', 'Quotas of grain, coal and metal.', { un: 0, y: 1, comp: 0 }], plunder: ['Total Plunder', 'Strip factories and granaries, and carry off their stocks of arms. Hunger follows.', { un: 2.5, y: 1.8, comp: -0.7, loot: 1 }] }],
  lab: ['Labour', { none: ['No Labour Service', 'Their workers stay at home.', { un: 0, out: 0, comp: 0 }], vol: ['Volunteer Workers', 'Recruit workers with wages: a little extra output at home.', { un: 0.3, out: 0.3, comp: 0 }], forced: ['Forced Labour', 'Deport workers to our factories: much more output at home; deep hatred and a growing resistance.', { un: 2, out: 1, comp: -0.6, res: 0.6 }] }],
  pol: ['Policing', { gar: ['Garrison Only', 'Only our troops keep order.', { un: 0, gar: 0, comp: 0 }], aux: ['Auxiliary Police', 'Recruit local policemen: each province counts as half a division of garrison.', { un: -0.5, gar: 0.5, comp: 0.2 }], terror: ['Terror', 'Hostages, reprisals and the secret police: unrest falls now, resistance grows faster, infamy rises.', { un: -3, gar: 0.3, comp: -0.8, res: 0.8, inf: 0.05 }] }],
  rec: ['Recruitment', { none: ['No Recruitment', 'We do not arm them.', { un: 0, comp: 0 }], legion: ['Volunteer Legions', 'Raise a legion of local volunteers every three months once compliance reaches 40.', { un: 0.4, comp: -0.1, legion: 1 }], conscript: ['Conscription', 'Draft their young men into labour and auxiliary units: manpower for us, uproar for them.', { un: 2, comp: -0.5, mp: 1 }] }]
};
const OCC2_AI = { fas: { adm: 'civ', eco: 'plunder', lab: 'forced', pol: 'terror', rec: 'legion' }, com: { adm: 'mil', eco: 'req', lab: 'forced', pol: 'aux', rec: 'none' }, dem: { adm: 'mil', eco: 'light', lab: 'none', pol: 'aux', rec: 'none' }, aut: { adm: 'mil', eco: 'req', lab: 'vol', pol: 'aux', rec: 'none' } };
// territories: the land of another nation we hold in war, by owner
function occLands(o) { const out = {}; for (const p of G.P) if (p.ctrl === o && p.owner !== o && !friendly(o, p.owner) && C(p.owner)) (out[p.owner] = out[p.owner] || []).push(p); return out; }
function occLaw(o, t) { const c = C(o), m = c.occ2 || (c.occ2 = {}); if (!m[t]) { const d = OCC2_AI[c.ideology] || OCC2_AI.aut; const pol = occPolicy(c); m[t] = { adm: 'mil', eco: pol === 'harsh' ? 'plunder' : pol === 'lenient' ? 'light' : 'req', lab: 'none', pol: 'gar', rec: 'none', comp: 5 }; if (c.ai) Object.assign(m[t], d); } return m[t]; }
const occEff = (L, k) => OCC2[k][1][L[k]][2];
function setOccLaw(c, t, k, v) { const L = occLaw(c.tag, t); if (!OCC2[k] || !OCC2[k][1][v] || L[k] === v) return ''; if (c.pp < 10) return 'Changing an occupation law costs 10 political power'; c.pp -= 10; L[k] = v; L.comp = Math.max(0, L.comp - 3); return ''; }
function garNeed(ps) { return sum(ps, p => Math.max(0.5, (p.unrest || 0) / 25)); }
function garHave(o, ps, L) { const gar = new Set(ps.map(p => p.id)); return sum(Object.values(G.armies).filter(a => a.owner === o && gar.has(a.loc)), a => a.divs.length) + ps.length * occEff(L, 'pol').gar; }
// weekly, after the old occupation tick: per-territory laws on top of the national policy
{ const _ot = occupationTick; occupationTick = function () { _ot();
  for (const o of alive()) { const lands = occLands(o.tag), ts = Object.keys(lands); o.occLabour = 0; if (!ts.length) { if (o.occ2) for (const t in o.occ2) if (!ok(t) || !G.P.some(p => p.owner === t && p.ctrl === o.tag)) delete o.occ2[t]; continue; }
    for (const t of ts) { const ps = lands[t], L = occLaw(o.tag, t), e = k => occEff(L, k), cover = clamp(garHave(o.tag, ps, L) / Math.max(1, garNeed(ps)), 0, 2), r = typeof resOf === 'function' ? resOf(t) : null;
      const un = e('adm').un + e('eco').un + e('lab').un + e('pol').un + e('rec').un - L.comp / 30 + (cover < 0.5 ? 2 : cover < 1 ? 0.8 : -0.6);
      const ym = e('adm').y * e('eco').y * (0.55 + L.comp / 100); let extra = 0;
      for (const p of ps) { p.unrest = clamp((p.unrest || 0) + un, 0, 100); const base = p.pop / 1000 * OCC[occPolicy(o)][2] * (1 - p.unrest / 100) * 4 * (1 + p.dev * 0.5); extra += base * (ym - 1);
        if (e('eco').loot && p.b && (p.b.arms || p.b.artyf || p.b.tankp)) { o.stock.arms = (o.stock.arms || 0) + 3 * (p.b.arms || 0); o.stock.artillery = (o.stock.artillery || 0) + (p.b.artyf || 0); p.dmg = Math.min(0.6, (p.dmg || 0) + 0.003); } }
      o.money += extra; o.occYield = (o.occYield || 0) + extra; if (e('adm').pp) o.pp = Math.max(0, o.pp - e('adm').pp);
      const pop = sum(ps, p => p.pop); o.occLabour += pop * e('lab').out; if (e('rec').mp) o.manpower += pop * 0.00004; if (e('pol').inf) o.infamy += e('pol').inf * ps.length / 5;
      L.comp = clamp(L.comp + 0.35 + e('adm').comp + e('eco').comp + e('lab').comp + e('pol').comp + e('rec').comp - (r ? r.str / 120 : 0) + (cover >= 1 ? 0.15 : -0.2), 0, 100);
      if (r) r.str = clamp(r.str + (e('lab').res || 0) + (e('pol').res || 0) - L.comp / 250, 0, 100); L.cover = cover;
      // volunteer legions
      if (e('rec').legion && L.comp >= 40 && (!L.legDay || G.day - L.legDay >= 90) && pop > 1500) { const host = ps.slice().sort((a, b) => b.pop - a.pop)[0]; const a = newArmy(o, host.id); a.name = `${C(t).adj} Legion`; a.auto = true; for (let i = 0; i < 2; i++) a.divs.push({ t: 'inf', str: 0.7, org: 0.6, xp: 0.1 }); L.legDay = G.day; L.comp -= 4; L.legions = (L.legions || 0) + 2; logMsg(`${o.name} raises the ${a.name} from volunteers in occupied ${cname(t)}.`, 'info', [o.tag, t]); }
    }
    // forced and volunteer labour work in our factories
    removeSpirit(o, 'occ_labour'); if (o.occLabour > 400) { SPIRITS.occ_labour[2] = { output: Math.min(0.08, o.occLabour / 200000), stab: o.occLabour > 8000 ? -1 : 0 }; addSpirit(o, 'occ_labour'); }
    if (o.ai && Math.random() < 0.1) for (const t of ts) { const L = occLaw(o.tag, t); if (L.comp >= 45 && L.pol === 'terror') L.pol = 'aux'; if (L.cover < 0.6 && L.eco === 'plunder' && o.ideology !== 'fas') L.eco = 'req'; if (G.day - (L.since || (L.since = G.day)) > 540 && L.comp < 8 && o.ideology === 'fas' && L.adm === 'civ') { L.adm = 'loc'; L.eco = 'req'; } } } }; }
SPIRITS.occ_labour = ['Foreign Labour', 'Workers from occupied lands fill our factories.', { output: 0.02 }];

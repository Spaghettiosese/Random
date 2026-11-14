// 2.1 The Second United Front as a real faction. Loaded before the Chinese trees, which capture these functions.
'use strict';
// The Second United Front: the Nationalists, the Communists and the provincial cliques, one faction against Japan.
const UF_MEMBERS = ['PRC', 'GXC', 'YUN', 'SHX', 'XSM', 'SIC'];
function formUnitedFront(quiet) {
  if (!ok('CHI') || C('CHI').overlord || C('CHI').capitulated) return; let f = factionOf('CHI');
  if (!f) { createFaction('CHI', 'United Front'); f = factionOf('CHI'); } else if (f.leader !== 'CHI') return;
  for (const t of UF_MEMBERS) { const k = C(t); if (!ok(t) || k.overlord || k.capitulated || atWar(t, 'CHI') || f.members.includes(t)) continue; const o = factionOf(t); if (o && o.leader === t && o.members.length > 1) continue; joinFaction(t, 'CHI'); addRel(t, 'CHI', 20); }
  G.flags.unitedFront = G.day;
}
{ const u = FNS.unitedFront[0]; FNS.unitedFront[0] = c => { u(c); formUnitedFront(); }; FNS.unitedFront[1] = 'The Communists and the cliques join the United Front, our faction against Japan'; }
{ const j = FNS.joinChinaWar[0]; FNS.joinChinaWar[0] = c => { j(c); if (ok('CHI') && !atWar(c.tag, 'CHI')) { if (!factionOf('CHI')) formUnitedFront(); else if (factionOf('CHI').leader === 'CHI') joinFaction(c.tag, 'CHI'); } }; FNS.joinChinaWar[1] = 'Join the United Front and China\'s war against the invader'; }

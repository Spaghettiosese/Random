// 2.1 interface: every faction in the world, who leads it, who is in it and what it can field.
'use strict';
function factionsCard(c) {
  const F = (G.factions || []).filter(f => f.members.some(ok)), mine = factionOf(c.tag);
  const divs = t => sum(armiesOf(t), a => a.divs.length), stat = ms => ({ d: sum(ms, divs), n: Math.round(sum(ms, t => navalPower(C(t)))), g: sum(ms, t => C(t).gdp || 0) });
  const loners = alive().filter(k => k.major && !factionOf(k.tag));
  const row = f => { const ms = f.members.filter(ok).concat(alive().filter(k => k.overlord && f.members.includes(k.overlord) && !f.members.includes(k.tag)).map(k => k.tag)), s = stat(ms), war = ms.some(t => isAtWar(t));
    return `<div class="card sub${f === mine ? ' hl' : ''}"><div class="row sp"><b>${f.name}</b><span class="dim">${war ? '⚔️ at war · ' : ''}${ms.length} member${ms.length > 1 ? 's' : ''} · ${s.d} divisions · navy ${s.n} · GDP ${fmt(s.g)}</span></div>
      <div class="row wrap">${ms.map(t => `<span class="pill" data-a="diploSel" data-t="${t}" style="cursor:pointer">${flag(t, 1)} ${cname(t)}${t === f.leader ? ' ★' : ''}${C(t).overlord ? ' <span class="dim">(subject)</span>' : ''}</span>`).join('')}</div></div>`; };
  return `<div class="card"><div class="row sp"><b>🏳 Factions of the world</b><span class="dim">${mine ? `we belong to the ${mine.name}` : 'we belong to no faction'}</span></div>
    ${F.length ? F.sort((a, b) => stat(b.members).d - stat(a.members).d).map(row).join('') : '<div class="dim">No factions have formed yet.</div>'}
    ${loners.length ? `<div class="dim">Great powers outside any faction: ${loners.map(k => `<span data-a="diploSel" data-t="${k.tag}" style="cursor:pointer">${flag(k.tag, 1)} ${k.name}</span>`).join(', ')}</div>` : ''}
    <div class="dim">★ leads the faction. Click a nation to inspect it. The Factions map mode colours the world by alliance.</div></div>`;
}
{ const _dip = PANELS.diplomacy; PANELS.diplomacy = function (c) { const h = _dip(c); return UI.diploSel && UI.diploSel !== c.tag ? h + factionsCard(c) : factionsCard(c) + h; }; }

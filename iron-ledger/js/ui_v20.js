// 2.0 interface: the wars you are in, as circles at the bottom right; click one for the war overview.
'use strict';
const sideName = (w, s) => { const L = w[s][0], f = factionOf(L); return f ? f.name : `${cname(L)} and allies`; };
const mFmt = k => fmt(Math.max(0, k) * 1000);
function renderWarBubbles() {
  let el = $('warbubbles'); if (!el) { el = document.createElement('div'); el.id = 'warbubbles'; $('mapwrap').appendChild(el); } if (!G) return; const pl = G.player;
  const mine = G.wars.filter(w => w.att.includes(pl) || w.def.includes(pl)); if (!mine.length) { el.innerHTML = ''; return; }
  el.innerHTML = mine.map(w => { const us = w.att.includes(pl) ? 'att' : 'def', them = us === 'att' ? 'def' : 'att', sc = warScore(w), my = us === 'att' ? sc.att : sc.def, th = us === 'att' ? sc.def : sc.att, bal = clamp(0.5 + (my - th) * 1.5, 0.03, 0.97), foe = C(w[them][0]);
    return `<button class="wb" data-a="warOpen" data-i="${w.id}"${tip(`<b>${w.name}</b><br>We hold ${Math.round(my * 100)}% of their victory points; they hold ${Math.round(th * 100)}% of ours.<br>Click for the war overview.`)} style="--bal:${Math.round(bal * 100)}%"><span class="wbin" style="background:${foe.color}"><b>${(foe.tag || '').slice(0, 3)}</b></span><span class="wbl">${w.name.replace(/ War$/, '').slice(0, 18)}</span></button>`; }).join('');
}
function warWindow(w) {
  const pl = G.player, col = s => { const list = w[s].filter(t => G.C[t]), tot = Math.max(1, sum(list, t => (w.part || {})[t] || 0));
    const rows = list.map(t => { const c = C(t), ci = capInfo(t), part = ((w.part || {})[t] || 0) / tot, divs = sum(armiesOf(t), a => a.divs.length), men = fielded(t), loss = (w.loss || {})[t] || 0, civ = (w.civ || {})[t] || 0;
      const tp = `<b>${c.name}</b> is ${Math.round(ci.prog * 100)}% of the way to capitulation. It holds ${Math.round(ci.held * 100)}% of its victory points and will capitulate at ${Math.round((1 - ci.lim) * 100)}% or less.${c.capitulated ? '<br><span class="neg">Capitulated.</span>' : ''}<br>Military losses in this war: ${mFmt(loss)} · civilians: ${mFmt(civ)}<br>Manpower in reserve: ${mFmt(c.manpower)}${hasSpirit(c, 'manpower_crisis') ? ' <span class="neg">(crisis)</span>' : ''}`;
      return `<tr class="${t === pl ? 'me' : ''}${c.capitulated ? ' capd' : ''}"${tip(tp)}><td>${cn(t)}</td><td class="r">${Math.round(part * 100)}%</td><td><span class="capbar"><i style="width:${Math.round(ci.prog * 100)}%"></i></span></td><td class="r">${divs}</td><td class="r">${mFmt(men)}</td><td class="r neg">${mFmt(loss)}</td><td class="r dim">${mFmt(civ)}</td></tr>`; }).join('');
    const T = k => sum(list, t => ((w[k] || {})[t] || 0));
    return `<div class="wside"><div class="wsh"><b>${sideName(w, s)}</b><span class="dim">${sum(list, t => sum(armiesOf(t), a => a.divs.length))} div · ${mFmt(sum(list, fielded))} fielded · ${mFmt(T('loss'))} lost</span></div><table class="wt"><tr><th>Nation</th><th class="r"${tip('Share of the fighting this side has done')}>Part</th><th${tip('Progress towards capitulation')}>Surrender</th><th class="r">Div</th><th class="r">Fielded</th><th class="r">Losses</th><th class="r">Civilians</th></tr>${rows}</table></div>`; };
  const sc = warScore(w), us = w.att.includes(pl) ? 'att' : w.def.includes(pl) ? 'def' : null, fa = sum(w.att, t => G.C[t] ? fielded(t) : 0), fd = sum(w.def, t => G.C[t] ? fielded(t) : 0), la = sum(w.att, t => (w.loss || {})[t] || 0), ld = sum(w.def, t => (w.loss || {})[t] || 0);
  const goals = (w.goals || []).map(g => `<li>${cname(g.by)}: ${cname(g.vs)} — ${GOAL_TXT(g)}</li>`).join('');
  const lead = us && w[us][0] === pl, foe = us ? w[us === 'att' ? 'def' : 'att'][0] : null;
  return `<div class="warwin"><div class="row sp"><h2>⚔ ${w.name}</h2><span class="dim">since ${dateStr(w.start)} · ${G.day - w.start} days</span>${btn('✕', 'warClose', '', 'sm')}</div>
    <div class="wtop"><div><span class="dim">Fielded manpower</span> <b>${mFmt(fa)}</b><br><span class="dim">Losses</span> <b class="neg">${mFmt(la)}</b></div>
      <div class="wbar"${tip(`Victory points occupied: ${cname(w.att[0])}'s side holds ${Math.round(sc.att * 100)}% of the enemy's, ${cname(w.def[0])}'s side ${Math.round(sc.def * 100)}%`)}><i class="a" style="width:${clamp(50 + (sc.att - sc.def) * 60, 3, 97)}%"></i></div>
      <div class="r"><span class="dim">Fielded manpower</span> <b>${mFmt(fd)}</b><br><span class="dim">Losses</span> <b class="neg">${mFmt(ld)}</b></div></div>
    <div class="wcols">${col('att')}${col('def')}</div>
    ${goals ? `<div class="dim">War goals:</div><ul class="wgoals">${goals}</ul>` : ''}
    <div class="row">${lead && foe ? btn('Offer white peace', 'warPeace', `data-t="${foe}"`, 'sm', 'They accept if they are losing or exhausted. 20 influence.') : ''}<span class="dim">Hover a nation for its capitulation status. Civilian deaths come from battles, bombing and occupation.</span></div></div>`;
}
Object.assign(ACT, {
  warOpen(d) { UI.warOpen = +d.i; renderWarWin(); }, warClose() { UI.warOpen = null; renderWarWin(); },
  warPeace(d) { const r = diploAction('peace', G.player, d.t); toast(r || `${cname(d.t)} accepts a white peace.`, r ? 'bad' : 'good'); UI.warOpen = null; renderAll(); renderWarWin(); }
});
function renderWarWin() { let el = $('warwinwrap'); if (!el) { el = document.createElement('div'); el.id = 'warwinwrap'; document.body.appendChild(el); } const w = UI.warOpen != null && G && G.wars.find(x => x.id === UI.warOpen); if (!w) { el.hidden = true; el.innerHTML = ''; UI.warOpen = null; return; } el.hidden = false; el.innerHTML = warWindow(w); }
{ const _rt = renderTop; renderTop = function () { _rt(); renderWarBubbles(); if (UI.warOpen != null && (G.day !== UI._wwDay)) { UI._wwDay = G.day; renderWarWin(); } }; }
// the top bar's manpower now warns, and the nation screen counts the dead
{ const _cp = PANELS.country; PANELS.country = function (c) { const pop = c.stats.pop || 1; return _cp(c) + `<h3>The cost of war</h3><div class="kv"><span>Soldiers killed</span><span class="neg">${mFmt(c.milDead || 0)}</span><span>Prisoners held by the enemy</span><span>${mFmt(c.pows || 0)}</span><span${tip('A share of the wounded return to the manpower pool every week')}>Wounded recovering</span><span>${mFmt(c.wounded || 0)}</span><span>Civilians killed</span><span class="neg">${mFmt(c.civDead || 0)} <span class="dim">(${((c.civDead || 0) / pop * 100).toFixed(2)}% of the population)</span></span>${c.civBy ? `<span class="dim">— by cause</span><span class="dim">${Object.keys(c.civBy).map(k => `${k} ${mFmt(c.civBy[k])}`).join(' · ')}</span>` : ''}</div>`; }; }

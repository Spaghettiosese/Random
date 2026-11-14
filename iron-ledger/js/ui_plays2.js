// 2.1 interface: the crisis screen for diplomatic plays, crisis bubbles beside the war bubbles, and a crisis list.
'use strict';
function playScreen(pl) {
  const c = me(), s = playSide(pl, c.tag), ph = playPhase(pl), o = playOdds(pl), left = playLeft(pl), A = C(pl.a), B = C(pl.b);
  const side = (k, list) => { const st = playStrength(list); return `<div class="pcol"><h3>${k === 'A' ? 'Demanding' : 'Resisting'}: ${cn(k === 'A' ? pl.a : pl.b)}</h3>
    <div class="row sp"><span>Mobilisation</span><span>${[0, 1, 2].map(i => `<i class="pip${playEsc(pl, k) > i ? ' on' : ''}"></i>`).join('')} <span class="dim">${['none', 'partial', 'general', 'total'][playEsc(pl, k)]}</span></span></div>
    <div class="row sp"><span>Weight at the reckoning</span><span class="num">${fmt(st)}</span></div>
    ${list.map(t => `<div class="row sp"><span data-a="diploSel" data-t="${t}" style="cursor:pointer">${flag(t, 1)} ${cname(t)}${t === (k === 'A' ? pl.a : pl.b) ? '' : ' <span class="dim">backer</span>'}</span><span class="dim">${sum(armiesOf(t), a => a.divs.length)} div · war support ${Math.round(C(t).ws)}%</span></div>`).join('')}</div>`; };
  const pct = v => Math.round(v * 100);
  const neutrals = alive().filter(k => !playSide(pl, k.tag) && !k.overlord && k.tag !== c.tag && (k.major || NB[k.capital].some(e => [pl.a, pl.b].includes(P(e.to).owner)))).sort((x, y) => y.major - x.major || countryStr(y.tag) - countryStr(x.tag)).slice(0, 12);
  const lean = k => { const d = opinion(k.tag, pl.a) - opinion(k.tag, pl.b); return d > 25 ? `leans to ${cname(pl.a)}` : d < -25 ? `leans to ${cname(pl.b)}` : 'undecided'; };
  const act = (a, arg, label, dis) => { const d = PLAY_ACT[a]; return btn(label || d[0], 'playAct', `data-p="${pl.id}" data-k="${a}" data-x="${arg || ''}"`, 'sm' + (a === 'back' || a === 'yield' ? '' : ''), d[3] + (d[1] ? ` Costs ${d[2]} ${d[1] === 'pp' ? 'political power' : 'influence'}.` : ''), dis || (d[1] && c[d[1]] < d[2])); };
  let acts = '';
  if (!s) acts = `<div class="row">${act('join', 'A', `Back ${cname(pl.a)}`)}${act('join', 'B', `Back ${cname(pl.b)}`)}</div>`;
  else { acts = `<div class="row wrap">${act('mob', '', 'Mobilise', playEsc(pl, s) >= 3)}${!pl.mediator ? act('mediate') : ''}
      ${c.tag === pl.a && pl.goal.type === 'take' ? act('raise') + act('cut', '', '', pl.goal.provs.length < 2) + act('back') : ''}
      ${c.tag === pl.b ? (pl.goal.type === 'take' ? act('offer', '', '', pl.goal.provs.length < 1) : '') + act('yield', '', `Yield: ${GOAL_TXT(pl.goal)}`) : ''}</div>`; }
  return `<div class="warwin playwin"><div class="row sp"><h2>📜 The ${playName(pl)}</h2>${btn('✕', 'playClose', '', 'sm')}</div>
    <div class="dim">${cn(pl.a)} demands that ${cn(pl.b)} <b>${GOAL_TXT(pl.goal)}</b>${pl.stakes ? ' <span class="neg">(stakes raised)</span>' : ''}${pl.cut ? ' <span class="pos">(demand moderated)</span>' : ''}${pl.mediator ? ` · mediated by ${cn(pl.mediator)}` : ''}</div>
    <div class="pphase">${PLAY_PHASE.map((p, i) => `<span class="${i === ph ? 'on' : i < ph ? 'past' : ''}">${i + 1}. ${p[0]}</span>`).join('')}<span class="num">${left} days left</span></div>
    <div class="dim">${PLAY_PHASE[ph][1]}</div>
    <div class="wcols">${side('A', pl.A)}${side('B', pl.B)}</div>
    <h3>If it were decided today</h3>
    <div class="podds"><span class="pseg" style="width:${pct(o.y)}%;background:#4a8a5a"></span><span class="pseg" style="width:${pct(o.war)}%;background:#a0423a"></span><span class="pseg" style="width:${pct(o.back)}%;background:#7a7a8a"></span></div>
    <div class="row sp dim"><span>🕊 ${cname(pl.b)} yields ${pct(o.y)}%</span><span>⚔ war ${pct(o.war)}%</span><span>↩ ${cname(pl.a)} backs down ${pct(o.back)}%</span><span>balance ${o.R.toFixed(2)} : 1</span></div>
    ${acts}
    ${s ? `<h3>The other powers</h3><div class="dim">An envoy can win a power to our side; each can be courted once in this crisis.</div>${neutrals.map(k => `<div class="row sp"><span>${cn(k.tag)} <span class="dim">${lean(k)}</span></span>${pl.swayed && pl.swayed[c.tag + k.tag] ? '<span class="dim">envoy sent</span>' : act('sway', k.tag, 'Court')}</div>`).join('') || '<div class="dim">Every power has taken a side.</div>'}` : ''}
    <h3>Chronicle</h3><div class="plog">${(pl.log || []).slice().reverse().map(([d, t]) => `<div><span class="dim">${dateStrOf ? dateStrOf(d) : d}</span> ${t}</div>`).join('')}</div></div>`;
}
const dateStrOf = d => { const k = G.day; try { G.day = d; return dateStr(); } finally { G.day = k; } };
function renderPlayWin() { let el = $('playwrap'); if (!el) { el = document.createElement('div'); el.id = 'playwrap'; document.body.appendChild(el); }
  const pl = UI.playOpen != null && G && G.plays.find(x => x.id === UI.playOpen); if (!pl) { el.hidden = true; el.innerHTML = ''; UI.playOpen = null; return; } el.hidden = false; el.innerHTML = playScreen(pl); }
{ const _rt = renderTop; renderTop = function () { _rt(); playBubbles(); if (UI.playOpen != null && (G.day !== UI._pwDay || !$('playwrap') || $('playwrap').hidden)) { UI._pwDay = G.day; renderPlayWin(); } else if (UI.playOpen == null && $('playwrap') && !$('playwrap').hidden) renderPlayWin(); }; }
function playBubbles() { const el = $('warbubbles'); if (!el || !G) return; el.querySelectorAll('.pb').forEach(x => x.remove()); const pl = G.player;
  for (const p of G.plays) { const mine = playSide(p, pl), foe = C(mine === 'A' ? p.b : p.a); if (!foe) continue;
    el.insertAdjacentHTML('beforeend', `<button class="wb pb${mine ? '' : ' far'}" data-a="playOpen" data-i="${p.id}"${tip(`<b>${playName(p)}</b><br>${cname(p.a)} demands that ${cname(p.b)} ${GOAL_TXT(p.goal)}.<br>${playLeft(p)} days left. Click for the crisis screen.`)} style="--bal:50%"><span class="wbin" style="background:${foe.color}"><b>📜</b></span><span class="wbl">${playName(p).replace(/ Crisis$/, '').slice(0, 18)}</span></button>`); } }
Object.assign(ACT, {
  playOpen(d) { UI.playOpen = +d.i; renderPlayWin(); },
  playClose() { UI.playOpen = null; renderPlayWin(); },
  playAct(d) { const pl = G.plays.find(x => x.id === +d.p); if (!pl) return; const e = playAct(me(), pl, d.k, d.x); if (e) UIH.notify(e, 'bad'); if (!G.plays.includes(pl)) UI.playOpen = null; renderAll(); renderPlayWin(); }
});
// the Diplomacy tab lists every crisis with a button to open it
{ const _dip = PANELS.diplomacy; PANELS.diplomacy = function (c) { const h = _dip(c); if (!G.plays.length) return h;
  return `<div class="card"><div class="row sp"><b>📜 Crises</b><span class="dim">${G.plays.length} under way</span></div>${G.plays.map(p => { const o = playOdds(p); return `<div class="row sp"><span>${cn(p.a)} → ${cn(p.b)} <span class="dim">${GOAL_TXT(p.goal)} · ${PLAY_PHASE[playPhase(p)][0]} · ${playLeft(p)}d · war ${Math.round(o.war * 100)}%</span></span>${btn('Open', 'playOpen', `data-i="${p.id}"`, 'sm')}</div>`; }).join('')}</div>` + h.replace(/<h3>Diplomatic plays<\/h3>[\s\S]*?(?=<h3>|$)/, ''); }; }
// popups that start crises for us offer the screen
{ const _sp = startPlay; startPlay = function (a, b, goal, opt) { const pl = _sp(a, b, goal, opt); if (pl && a === G.player && !C(a).ai) UI.playOpen = pl.id; return pl; }; }

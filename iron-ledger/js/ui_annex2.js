// 2.0 interface: the annexed-territories card and release window.
'use strict';
{ const _dip = PANELS.diplomacy; PANELS.diplomacy = function (c) { let h = _dip(c); const by = annexedNations(c), ks = Object.keys(by); if (!ks.length) return h;
  const card = `<h3>Annexed territories</h3><div class="dim">Land taken from nations that no longer exist. Choose how each is governed, or give it back.</div>` + ks.map(t => { const ps = by[t], un = Math.round(sum(ps, p => p.unrest || 0) / ps.length), a = adminOf(c, t);
    return `<div class="card"><div class="row sp"><span>${cn(t)} <span class="dim">· ${ps.length} provinces · ${fmt(sum(ps, p => p.pop) * 1000)} people · unrest <span class="${un > 60 ? 'neg' : ''}">${un}</span></span></span>${btn('Release…', 'annexOpen', `data-t="${t}"`, 'sm')}</div>
      <div class="row"><span class="dim">Administration</span>${Object.keys(ADMIN).map(k => btn(ADMIN[k][0], 'adminSet', `data-t="${t}" data-k="${k}"`, 'sm' + (a === k ? ' on' : ''), ADMIN[k][1])).join('')}</div>${a === 'integrate' ? `<div class="dim">Integration ${Math.round(100 * sum(ps, p => Math.min(1, p.integ || 0)) / ps.length)}%</div>` : ''}</div>`; }).join('');
  const i = h.indexOf('<h3'); return i < 0 ? h + card : h.slice(0, i) + card + h.slice(i); }; }
function annexWindow(t) { const c = me(), ps = (annexedNations(c)[t] || []).sort((a, b) => b.vp - a.vp), k = C(t), o = UI.rel || (UI.rel = { t, status: 'puppet', keep: 'none', keepIds: [], ideo: 'ours', leader: personName(k), laws: c.ideology });
  if (!ps.length) return ''; const sel = (ch, cur, opts) => `<select data-ch="${ch}">${opts.map(([v, l]) => `<option value="${v}"${v === cur ? ' selected' : ''}>${l}</option>`).join('')}</select>`;
  return `<div class="warwin"><div class="row sp"><h2>🗺 ${k.name}</h2>${btn('✕', 'annexClose', '', 'sm')}</div><div class="dim">${ps.length} provinces in our hands. Decide what becomes of them.</div>
    <div class="kv"><span>Release as</span><span>${sel('relStatus', o.status, [['free', 'A free nation'], ...Object.keys(SUBJ_TYPE).map(s => [s, SUBJ_TYPE[s].name])])}</span>
      <span>Territory</span><span>${sel('relKeep', o.keep, [['none', 'Release all of it'], ['cores', 'Keep what we claim'], ['list', 'Choose province by province']])}</span>
      <span>Government</span><span>${sel('relIdeo', o.ideo, [['ours', `Like ours (${IDEO[c.ideology][0]})`], ...Object.keys(IDEO).map(i => [i, IDEO[i][0]])])}</span>
      <span>Head of government</span><span><input data-ch="relLeader" value="${esc(o.leader)}" maxlength="40"></span>
      <span>Laws</span><span>${sel('relLaws', o.laws, Object.keys(LAW_PRESET).filter(i => IDEO[i]).map(i => [i, `${IDEO[i][0]} laws`]))}</span></div>
    ${o.keep === 'list' ? `<div class="dim">Ticked provinces stay ours.</div><div class="msggrid">${ps.map(p => `<label class="row"><input type="checkbox" data-ch="relPick" data-i="${p.id}"${o.keepIds.includes(p.id) ? ' checked' : ''}> ${p.name} <span class="dim">${p.vp} VP</span></label>`).join('')}</div>` : ''}
    <div class="row">${btn(`Release ${k.name}`, 'relGo', '', 'pri')}<span class="dim">${o.status === 'free' ? 'Relations +40, infamy -6.' : `${SUBJ_TYPE[o.status].tip}`}</span></div></div>`; }
function renderAnnexWin() { let el = $('annexwrap'); if (!el) { el = document.createElement('div'); el.id = 'annexwrap'; el.className = 'confwrap'; document.body.appendChild(el); } const t = UI.annexT; if (!G || !t || !(annexedNations(me())[t] || []).length) { el.hidden = true; el.innerHTML = ''; return; } el.hidden = false; el.innerHTML = annexWindow(t); }
Object.assign(ACT, {
  adminSet(d) { const c = me(); (c.admin = c.admin || {})[d.t] = d.k; renderPanel(); },
  annexOpen(d) { UI.annexT = d.t; UI.rel = null; renderAnnexWin(); }, annexClose() { UI.annexT = null; renderAnnexWin(); },
  relGo() { const r = releaseAnnexed(me(), UI.annexT, UI.rel); toast(r || `${cname(UI.annexT)} is released.`, r ? 'bad' : 'good'); if (!r) UI.annexT = null; renderAnnexWin(); renderAll(); }
});
Object.assign(CHG, { relStatus(el) { UI.rel.status = el.value; renderAnnexWin(); }, relKeep(el) { UI.rel.keep = el.value; renderAnnexWin(); }, relIdeo(el) { UI.rel.ideo = el.value; if (el.value !== 'ours') UI.rel.laws = el.value; renderAnnexWin(); }, relLeader(el) { UI.rel.leader = el.value; }, relLaws(el) { UI.rel.laws = el.value; },
  relPick(el) { const id = +el.dataset.i, l = UI.rel.keepIds, i = l.indexOf(id); if (el.checked && i < 0) l.push(id); else if (!el.checked && i >= 0) l.splice(i, 1); } });
{ const _rt = renderTop; renderTop = function () { _rt(); if (G && G.annexOpen) { UI.annexT = G.annexOpen; G.annexOpen = null; UI.rel = null; renderAnnexWin(); } }; }

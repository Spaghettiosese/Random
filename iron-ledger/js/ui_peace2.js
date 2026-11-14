// 2.0 interface: the peace conference window.
'use strict';
function confWindow() {
  const cf = G.conf, pl = C(G.player), spent = confSpent(cf), left = Math.round((cf.points - spent) * 10) / 10, allies = cf.win.filter(t => t !== pl.tag && C(t).exists);
  const groups = cf.lose.map(L => { const rows = cf.provs.filter(x => x.owner === L).sort((a, b) => P(b.id).vp - P(a.id).vp); const reg = pl.regimes && pl.regimes[L] && ok(pl.regimes[L].tag) ? C(pl.regimes[L].tag) : null;
    const opt = x => { const p = P(x.id); if (x.act === 'ai') return `<span class="dim">→ ${cname(x.to)} (their claim)</span>`; const can = { keep: 1, take: 1, regime: !!reg, ally: allies.length > 0, release: p.orig !== p.owner && G.C[p.orig] && !G.C[p.orig].exists };
      return `<select data-ch="confAct" data-i="${x.id}">${Object.keys(CONF_ACT).filter(k => can[k]).map(k => `<option value="${k}"${x.act === k ? ' selected' : ''}>${k === 'regime' ? `To ${reg.name}` : k === 'release' ? `Release ${cname(p.orig)}` : CONF_ACT[k][0]}${k !== 'keep' ? ` (${confCost(p, k)})` : ''}</option>`).join('')}</select>${x.act === 'ally' ? `<select data-ch="confAlly" data-i="${x.id}">${allies.map(t => `<option value="${t}"${x.to === t ? ' selected' : ''}>${cname(t)}</option>`).join('')}</select>` : ''}`; };
    const tr = rows.map(x => { const p = P(x.id); return `<tr><td>${p.name}${p.id === C(L).capital ? ' ★' : ''}</td><td class="r">${p.vp}</td><td>${p.ctrl === L ? '<span class="dim">their own</span>' : cn(p.ctrl)}</td><td>${opt(x)}</td></tr>`; }).join('');
    return `<div class="wside"><div class="wsh"><b>${cn(L)}</b><span class="dim">${rows.length} provinces</span></div><div class="row"><span class="dim">Terms</span><select data-ch="confTerm" data-t="${L}">${Object.keys(CONF_TERMS).map(k => `<option value="${k}"${cf.terms[L] === k ? ' selected' : ''}>${CONF_TERMS[k][0]}</option>`).join('')}</select><span class="dim"${tip('Puppet, collaboration government and occupation zones cost a share of the land they cover; the others a flat price.')}>?</span></div>
      <div class="dim">${btn('Annex all we hold', 'confBulk', `data-t="${L}" data-k="take"`, 'sm')}${reg ? btn(`All we hold to ${reg.name}`, 'confBulk', `data-t="${L}" data-k="regime"`, 'sm') : ''}${btn('Clear', 'confBulk', `data-t="${L}" data-k="keep"`, 'sm')}</div>
      <table class="wt"><tr><th>Province</th><th class="r">VP</th><th>Held by</th><th>Decision</th></tr>${tr}</table></div>`; }).join('');
  return `<div class="warwin confwin"><div class="row sp"><h2>🕊 Peace Conference</h2><span class="${left < 0 ? 'neg' : 'pos'}"${tip('Points come from our share of the fighting in this war. Every province and every term has a price.')}>Points: <b>${left}</b> of ${cf.points}</span></div>
    <div class="dim">The defeated: ${cf.lose.map(cname).join(', ')}. Our allies at the table: ${allies.map(cname).join(', ') || 'none'}. Allies first take the occupied land they claim; anything left unassigned stays with its owner.</div>
    <div class="wcols">${groups}</div><div class="row">${btn('Conclude the peace', 'confEnd', '', 'pri', left < 0 ? 'Too many points spent' : 'Sign the treaty', left < 0)}</div></div>`;
}
function renderConf() { let el = $('confwrap'); if (!el) { el = document.createElement('div'); el.id = 'confwrap'; el.className = 'confwrap'; document.body.appendChild(el); } if (!G || !G.conf) { el.hidden = true; el.innerHTML = ''; return; } el.hidden = false; const sc = el.querySelector('.confwin'), top = sc ? sc.scrollTop : 0; el.innerHTML = confWindow(); const n = el.querySelector('.confwin'); if (n) n.scrollTop = top; }
Object.assign(CHG, {
  confAct(el) { const x = G.conf.provs.find(q => q.id === +el.dataset.i); if (!x) return; x.act = el.value; x.to = el.value === 'ally' ? G.conf.win.find(t => t !== G.player) : null; renderConf(); },
  confAlly(el) { const x = G.conf.provs.find(q => q.id === +el.dataset.i); if (x) x.to = el.value; renderConf(); },
  confTerm(el) { G.conf.terms[el.dataset.t] = el.value; renderConf(); }
});
Object.assign(ACT, {
  confBulk(d) { const pl = G.player; for (const x of G.conf.provs) if (x.owner === d.t && x.act !== 'ai' && (d.k === 'keep' || P(x.id).ctrl === pl)) { x.act = d.k; x.to = null; } renderConf(); },
  confEnd() { const r = concludeConference(); if (r) toast(r, 'bad'); else toast('The treaty is signed.', 'good'); renderConf(); renderAll(); }
});
{ const _rt = renderTop; renderTop = function () { _rt(); const el = $('confwrap'); if (G && G.conf && (!el || el.hidden)) renderConf(); }; }

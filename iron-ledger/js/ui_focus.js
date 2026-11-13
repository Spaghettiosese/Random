// Focus tree view (1.6). Each node shows what it is, what it costs and whether you can take it; hovering shows what it does;
// selecting shows the route to it and what lies beyond; a plan queues focuses so the tree runs without stopping the clock.
'use strict';
const FCW = 150, FCH = 100, FNW = 136, FNH = 80;
const fpos = f => [14 + f.x * FCW, 14 + f.y * FCH];
const fmap = tree => tree._map || (tree._map = Object.fromEntries(tree.map(f => [f.id, f])));
function focusRoute(c, tree, f) {
  const need = new Set(), m = fmap(tree), visit = n => { if (!n || c.focus.done[n.id] || need.has(n.id)) return; need.add(n.id); if (!n.pre) return; let best = null, bc = 1e9; for (const g of n.pre.split('|')) { const ids = g.split(','), cnt = ids.filter(i => !c.focus.done[i]).length; if (cnt < bc) { bc = cnt; best = ids; } } best.forEach(i => visit(m[i])); };
  visit(f); return need;
}
function focusBeyond(tree, f) { // what this focus opens up
  if (!tree._kids) { tree._kids = {}; for (const x of tree) if (x.pre) for (const p of x.pre.split(/[|,]/)) (tree._kids[p] = tree._kids[p] || []).push(x); }
  const seen = new Set(), q = [f]; while (q.length) { const n = q.shift(); for (const k of tree._kids[n.id] || []) if (!seen.has(k)) { seen.add(k); q.push(k); } } return [...seen];
}
const reqParts = f => !f.req ? [] : (f.req.parts || [f.req]);
function focusTip(c, f) { return `<b>${f.name}</b> <span class="dim">${FOCUS_KIND[f.kind][1]} · ${focusCost(c, f)} political power · ${f.days} days</span><br><i>${f.desc}</i><br>${effText(f.eff, c)}${f.choices ? '<br><b>Then choose:</b> ' + f.choices.map(ch => ch.label).join(' <span class="dim">or</span> ') : ''}${reqParts(f).length ? '<br>' + reqParts(f).map(r => `<span class="${r[0](c) ? 'pos' : 'neg'}">${r[0](c) ? '✓' : '✗'} ${r[1]}</span>`).join('<br>') : ''}`; }
function focusSections(c, tree) { const out = []; let cur = null; for (const f of tree) { if (f.sec || !cur) { cur = { name: f.sec || 'National', first: f, n: 0, done: 0 }; out.push(cur); } cur.n++; if (c.focus.done[f.id]) cur.done++; } return out; }
PANELS.focus = function (c) {
  const tree = focusTree(c), m = fmap(tree), cur = c.focus.cur ? m[c.focus.cur] : null, sel = m[UI.focusSel] || cur || tree.find(f => focusState(c, f) === 'available') || tree[0];
  const st = focusState(c, sel), route = focusRoute(c, tree, sel), queue = (c.focus.queue = (c.focus.queue || []).filter(q => m[q] && !c.focus.done[q] && q !== c.focus.cur));
  const mx = Math.max(...tree.map(f => f.x)), my = Math.max(...tree.map(f => f.y)), ppd = Math.max(0.15, 0.55 + c.legit / 180 + M(c, 'pp'));
  // connectors: elbows, so they run between rows instead of through nodes
  let lines = ''; for (const f of tree) { if (!f.pre) continue; const [x2, y2] = fpos(f), any = f.pre.includes('|'); for (const pid of f.pre.split(/[|,]/)) { const pf = m[pid]; if (!pf) continue; const [x1, y1] = fpos(pf), a = x1 + FNW / 2, b = x2 + FNW / 2, midY = y2 - 10, done = c.focus.done[pid] && c.focus.done[f.id], rt = route.has(f.id) && (route.has(pid) || c.focus.done[pid]);
      lines += `<path d="M${a} ${y1 + FNH}V${midY}H${b}V${y2}" class="${done ? 'ld' : rt ? 'lr' : ''}"${any ? ' stroke-dasharray="5 4"' : ''}/>`; } }
  for (const f of tree) if (f.mutex && f.x < Math.min(...f.mutex.split(',').map(i => m[i] ? m[i].x : 1e9))) { const o = f.mutex.split(',').map(i => m[i]).filter(Boolean).sort((a, b) => b.x - a.x)[0]; if (o && o.y === f.y) { const [x1, y1] = fpos(f), [x2] = fpos(o); lines += `<path d="M${x1 + FNW} ${y1 + FNH / 2}H${x2}" class="lx"/>`; } }
  const nodes = tree.map(f => { const [x, y] = fpos(f), s = focusState(c, f), parts = reqParts(f), bad = parts.filter(r => !r[0](c)).length, poor = s === 'available' && c.pp < focusCost(c, f), qi = queue.indexOf(f.id);
    return `<div class="fn2 ${s}${poor ? ' poor' : ''}${f.id === sel.id ? ' sel' : ''}${route.has(f.id) && f.id !== sel.id ? ' route' : ''}${UI.focusKind && UI.focusKind !== f.kind ? ' faded' : ''}" style="left:${x}px;top:${y}px" data-a="focusSel" data-f="${f.id}" id="fn_${f.id}"${tip(focusTip(c, f))}>
      <span class="fi">${s === 'done' ? '✓' : FOCUS_KIND[f.kind][0]}</span><span class="fnm">${f.name}</span>
      <span class="ff">${s === 'done' ? (f.choices && c.focus.pick && c.focus.pick[f.id] !== undefined ? esc(f.choices[c.focus.pick[f.id]].label.slice(0, 22)) : 'done') : `${focusCost(c, f)}★ · ${f.days}d${f.choices ? ' · ⚖' : ''}${parts.length ? ` · <b class="${bad ? 'neg' : 'pos'}">${bad ? '✗' + bad : '✓'}</b>` : ''}${qi >= 0 ? ` · <b class="warn">#${qi + 1}</b>` : ''}`}</span>
      ${s === 'active' ? `<i class="fp" style="width:${Math.round(c.focus.prog / f.days * 100)}%"></i>` : ''}</div>`; }).join('');
  // the selected focus
  const blk = focusBlock(c, sel), beyond = focusBeyond(tree, sel), big = beyond.filter(f => f.tier >= 2).sort((a, b) => b.tier - a.tier || a.y - b.y).slice(0, 6), rl = [...route].map(i => m[i]), rDays = sum(rl, f => f.days), rCost = sum(rl, f => focusCost(c, f)), switching = cur && cur.id !== sel.id;
  const parts = reqParts(sel).map(r => { const okk = r[0](c), pr = r.prog ? r.prog(c) : ''; return `<div class="${okk ? 'pos' : 'neg'}">${okk ? '✓' : '✗'} ${r[1]}${pr && !okk ? ` <span class="dim">(${pr})</span>` : ''}</div>`; }).join('');
  const card = `<div class="card hl fcard"><div class="row sp"><h4><span class="fi">${FOCUS_KIND[sel.kind][0]}</span> ${sel.name}</h4><span class="row"><span class="pill">${FOCUS_KIND[sel.kind][1]}</span><span class="pill${c.pp < focusCost(c, sel) && st !== 'done' ? ' neg' : ''}">${focusCost(c, sel)} ★ political power</span><span class="pill">${sel.days} days</span></span></div>
    <i class="dim">${sel.desc}</i><div>${effText(sel.eff, c)}</div>
    ${sel.choices ? `<div class="fchoice"><b>⚖ When it completes you choose:</b>${sel.choices.map((ch, i) => `<div class="${c.focus.pick && c.focus.pick[sel.id] === i ? 'pos' : ''}"><b>${ch.label}</b> <span class="dim">— ${effText(ch.eff, c).replace(/<br>/g, '; ')}</span></div>`).join('')}</div>` : ''}
    ${parts}${sel.ideo ? `<div class="${c.ideology === sel.ideo ? 'pos' : 'neg'}">${c.ideology === sel.ideo ? '✓' : '✗'} Requires a ${IDEO[sel.ideo][0].toLowerCase()} government</div>` : ''}
    ${sel.mutex ? `<div class="neg">⛔ Closes for good: ${sel.mutex.split(',').map(i => m[i] ? m[i].name : '').filter(Boolean).join(', ')}</div>` : ''}
    ${beyond.length ? `<div class="dim">Opens ${beyond.length} further focus${beyond.length > 1 ? 'es' : ''}${big.length ? ': ' + big.map(f => `<a data-a="focusSel" data-f="${f.id}" data-jump="1">${FOCUS_KIND[f.kind][0]} ${f.name}</a>`).join(', ') : ''}${beyond.length > big.length ? '…' : ''}</div>` : ''}
    ${st !== 'done' && rl.length > 1 ? `<div class="dim">Route from here: ${rl.length} focuses · ${rDays} days · ${rCost} ★</div>` : ''}
    <div class="row">${st === 'done' ? '<span class="pos">Completed</span>' : st === 'active' ? `<span class="warn">In progress — ${sel.days - c.focus.prog} days left</span>` : btn(switching ? 'Switch to this focus' : 'Begin focus', 'focusStart', `data-f="${sel.id}"`, 'pri', blk || (switching ? `Progress on ${cur.name} is lost; half its cost (${Math.round((c.focus.paid || 0) / 2)} ★) is returned` : ''), !!blk)}
      ${st !== 'done' && st !== 'active' && st !== 'blocked' ? (queue.includes(sel.id) ? btn('Remove from plan', 'focusUnq', `data-f="${sel.id}"`, 'sm') : btn(rl.length > 1 ? `Plan this route (${rl.length})` : 'Add to plan', 'focusQ', `data-f="${sel.id}"`, 'sm', 'Planned focuses start by themselves, in order, as soon as each can be afforded and its requirements are met')) : ''}
      ${blk && st !== 'done' && st !== 'active' ? `<span class="neg">${blk}</span>` : ''}</div></div>`;
  const secs = focusSections(c, tree), nDone = Object.keys(c.focus.done).filter(i => m[i]).length, kinds = [...new Set(tree.map(f => f.kind))];
  return `<div class="fhead"><div class="row sp"><span>${cur ? `<b>${FOCUS_KIND[cur.kind][0]} ${cur.name}</b>` : `<span class="warn">No focus in progress${queue.length ? ` — the plan is waiting. ${m[queue[0]].name}: ${focusWhy(c, m[queue[0]])}` : ''}</span>`}</span><span${tip('Political power pays for focuses, laws, ministers and decisions. You cannot afford everything.')}>★ <b>${Math.floor(c.pp)}</b> <span class="dim">+${ppd.toFixed(2)}/day</span> · ${nDone}/${tree.length} done</span></div>
      ${cur ? `<div class="row">${bar(c.focus.prog / cur.days)}<span class="num">${cur.days - c.focus.prog} days</span>${btn('Show', 'focusSel', `data-f="${cur.id}" data-jump="1"`, 'sm')}</div>` : ''}
      ${queue.length ? `<div class="row"><span class="dim">Plan</span>${queue.map((q, i) => `<span class="pill" data-a="focusSel" data-f="${q}" data-jump="1" style="cursor:pointer">${i + 1}. ${m[q].name} <a data-a="focusUnq" data-f="${q}">✕</a></span>`).join('')}${btn('Clear', 'focusUnq', 'data-f=""', 'sm')}</div>` : ''}</div>
    ${card}
    <div class="row ftools"><span class="dim">Go to</span>${secs.map(s => btn(`${s.name} <span class="dim">${s.done}/${s.n}</span>`, 'focusSel', `data-f="${s.first.id}" data-jump="1"`, 'sm')).join('')}</div>
    <div class="row ftools"><span class="dim">Highlight</span>${kinds.map(k => btn(`${FOCUS_KIND[k][0]} ${FOCUS_KIND[k][1]}`, 'focusKind', `data-k="${k}"`, 'sm' + (UI.focusKind === k ? ' on' : ''))).join('')}<span class="dim">★ = political power · ⚖ = a choice · ✗ = unmet requirement · drag to pan</span></div>
    <div class="tree"><div style="position:relative;width:${(mx + 1) * FCW + 28}px;height:${(my + 1) * FCH + 28}px"><svg class="flines" width="${(mx + 1) * FCW + 28}" height="${(my + 1) * FCH + 28}">${lines}</svg>${nodes}</div></div>`;
};
function focusJumpTo(id) { const t = document.querySelector('#panel .tree'), n = document.getElementById('fn_' + id); if (!t || !n) return; t.scrollLeft = Math.max(0, n.offsetLeft - t.clientWidth / 2 + FNW / 2); t.scrollTop = Math.max(0, n.offsetTop - t.clientHeight / 2 + FNH / 2); }
{ const _rp = renderPanel; renderPanel = function () { const had = !!document.querySelector('#panel .tree'); _rp(); if (UI.tab !== 'focus') return; const c = me();
    if (UI.focusJump || !had) { const tree = focusTree(c), id = UI.focusJump || c.focus.cur || UI.focusSel || (tree.find(f => focusState(c, f) === 'available') || tree[0]).id; UI.focusJump = null; focusJumpTo(id); } }; }
Object.assign(ACT, {
  focusSel(d) { UI.focusSel = d.f; if (d.jump) UI.focusJump = d.f; renderPanel(); },
  focusKind(d) { UI.focusKind = UI.focusKind === d.k ? null : d.k; renderPanel(); },
  focusStart(d) { const c = me(), f = focusById(c, d.f); if (!f) return; const why = focusBlock(c, f); if (why && !(c.focus.cur && focusState(c, f) === 'available')) { toast(why, 'bad'); return; } if (startFocus(c, d.f)) toast(`National focus: ${f.name}.`, 'focus'); else toast('Not enough political power.', 'bad'); renderAll(); },
  focusQ(d) { const c = me(), tree = focusTree(c), f = focusById(c, d.f); if (!f) return; const ids = [...focusRoute(c, tree, f)].map(i => fmap(tree)[i]).sort((a, b) => a.y - b.y).map(x => x.id); c.focus.queue = (c.focus.queue || []).concat(ids.filter(i => i !== c.focus.cur && !(c.focus.queue || []).includes(i))).slice(0, 12); renderPanel(); },
  focusUnq(d, el, ev) { if (ev) ev.stopPropagation(); const c = me(); c.focus.queue = d.f ? (c.focus.queue || []).filter(q => q !== d.f) : []; renderPanel(); }
});
// drag the tree to pan it
{ let drag = null; document.addEventListener('mousedown', e => { const t = e.target.closest && e.target.closest('#panel .tree'); if (!t || e.button !== 0) return; drag = { t, x: e.clientX, y: e.clientY, sl: t.scrollLeft, st: t.scrollTop, moved: false }; });
  document.addEventListener('mousemove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (!drag.moved && Math.hypot(dx, dy) < 5) return; drag.moved = true; UI.lastPanel = performance.now() + 1e7; drag.t.scrollLeft = drag.sl - dx; drag.t.scrollTop = drag.st - dy; e.preventDefault(); });
  document.addEventListener('mouseup', () => { if (!drag) return; const moved = drag.moved; drag = null; if (moved) { UI.lastPanel = performance.now(); const stop = ev => { ev.stopPropagation(); ev.preventDefault(); document.removeEventListener('click', stop, true); }; document.addEventListener('click', stop, true); setTimeout(() => document.removeEventListener('click', stop, true), 50); } }); }

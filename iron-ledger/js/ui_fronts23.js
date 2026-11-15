// 2.3 interface: the Fronts tab (fronts, battle plans, planning), drawing fronts, objectives and fallback lines on the map,
// the front lines and arrows of the battle plans, and provinces taken a piece at a time.
'use strict';
const frCol = f => FR_COLORS[(f.col || 0) % FR_COLORS.length];
const frIdle = c => armiesOf(c.tag).filter(a => !frontOf(a) && !a.battle && a.divs.length && !a.recruits && !a.order && !a.inv && !a.expFrom);
const frDivs = f => sum(frArmies(f), a => a.divs.length);
let FRC = { k: -1, m: {} };
const frPairsC = f => { const k = G.day * 24 + (G.hour || 0); if (FRC.k !== k) FRC = { k, m: {} }; return FRC.m[f.id] || (FRC.m[f.id] = frontPairs(f)); };
function frSummary(f) { const pairs = frPairsC(f), line = new Set(pairs.map(x => x[0])), theirs = new Set(pairs.map(x => x[1])), en = sum([...theirs], id => sum(armiesAt(id).filter(a => atWar(f.owner, a.owner)), a => a.divs.length));
  return { line: line.size, en, divs: frDivs(f) }; }
function frontCard(c, f) {
  const s = frSummary(f), A = frArmies(f), col = frCol(f), war = ok(f.enemy) && atWar(c.tag, f.enemy), sel = selArmies(), selOff = sel.filter(a => frontOf(a) !== f), dr = UI.frDraw && UI.frDraw.id === f.id ? UI.frDraw.k : null;
  const cover = s.line ? s.divs / s.line : 0, gs = (c.agroups || []).filter(g => g.armies.some(i => G.armies[i]));
  const ord = Object.keys(FR_ORDER).map(k => btn(FR_ORDER[k][0], 'frOrder', `data-f="${f.id}" data-o="${k}"`, 'sm' + (f.order === k ? ' on' : ''), FR_ORDER[k][1] + (k === 'attack' && !war ? '<br><span class="warn">We are not at war with them: the armies deploy and wait.</span>' : '') + (k === 'fallback' && !f.fallback.length ? '<br><span class="warn">Draw a fallback line first.</span>' : ''), k === 'fallback' && !f.fallback.length)).join('');
  const sta = Object.keys(FR_STANCE).map(k => btn(FR_STANCE[k][0], 'frStance', `data-f="${f.id}" data-s="${k}"`, 'sm' + (f.stance === k ? ' on' : ''), `${FR_STANCE[k][3]}<br><span class="dim">Attacks at odds of ${FR_STANCE[k][1]}:1 or better, with organisation above ${Math.round(FR_STANCE[k][2] * 100)}%.</span>`)).join('');
  const draw = (k, label, tp, n) => btn(`${label}${n ? ` (${n})` : ''}`, 'frDraw', `data-f="${f.id}" data-k="${k}"`, 'sm' + (dr === k ? ' on' : ''), tp);
  return `<div class="card frcard" style="border-left:4px solid ${col}">
    <div class="row sp"><input class="frname" data-ch="frName" data-f="${f.id}" value="${esc(f.name)}" maxlength="32" aria-label="Front name"><span class="row">${btn('Find', 'frFind', `data-f="${f.id}"`, 'sm')}${btn('✕', 'frDel', `data-f="${f.id}"`, 'sm', 'Dissolve the front. Its armies stay where they are.')}</span></div>
    <div class="dim">${cn(f.enemy)}${war ? ' <span class="neg">⚔ at war</span>' : ' · at peace: the front deploys on the border'}${f.only.length ? ` · sector of ${f.only.length} provinces` : ' · the whole border'}</div>
    <div class="row sp"><span>${A.length} arm${A.length === 1 ? 'y' : 'ies'} · <b>${s.divs}</b> div</span><span${tip('Our provinces on the line, and divisions per province. Below one division a province the line is thin and easy to break.')}>${s.line} provinces · <span class="${cover < 1 && s.line ? 'neg' : cover < 2 ? 'warn' : 'pos'}">${cover.toFixed(1)}</span>/prov</span><span class="dim"${tip('Enemy divisions in the provinces facing the line')}>facing ${s.en} div</span></div>
    <div class="row"><span class="dim" style="width:52px">Order</span>${ord}</div>
    <div class="row"><span class="dim" style="width:52px">Stance</span>${sta}</div>
    <div class="row"${tip('While the front holds, the staff plans its offensive: up to +25% attack when the battle plan is executed, spent as the attack goes on. A planned defence holds up to 10% better.')}><span class="dim" style="width:52px">Planning</span>${bar(f.plan || 0, 'g')}<span class="num">${Math.round((f.plan || 0) * 100)}%</span><span class="dim">${f.order === 'attack' ? `+${Math.round((f.plan || 0) * 25)}% attack` : `+${Math.round((f.plan || 0) * 10)}% defence`}</span></div>
    <div class="row"><span class="dim" style="width:52px">Plan</span>${draw('sector', '🖊 Sector', 'Paint our border provinces on the map to limit the front to a stretch of the border. As the sector advances, the ground it takes joins it.', f.only.length)}${draw('target', '🎯 Objectives', 'Click enemy provinces on the map: the offensive drives towards them, and the line masses opposite. Up to four.', f.targets.length)}${draw('fallback', '↩ Fallback line', 'Paint our provinces on the map: on the order to fall back, the armies withdraw to them and hold.', f.fallback.length)}${f.only.length || f.targets.length || f.fallback.length ? btn('Clear', 'frClear', `data-f="${f.id}"`, 'sm', 'Clear the sector, objectives and fallback line') : ''}</div>
    ${f.targets.length ? `<div class="row"><span class="dim" style="width:52px">Objectives</span>${f.targets.map(id => `<span class="pill" data-a="goProv" data-p="${id}" style="cursor:pointer;border-color:${col}">🎯 ${P(id).name}</span>`).join(' ')}</div>` : ''}
    <div class="row">${btn(`Assign selected${selOff.length ? ` (${selOff.length})` : ''}`, 'frAssign', `data-f="${f.id}" data-w="sel"`, 'sm', 'Put the selected armies on this front', !selOff.length)}${btn('Assign idle armies', 'frAssign', `data-f="${f.id}" data-w="idle"`, 'sm', 'Every army without a front, an order or a battle', !frIdle(c).length)}${gs.length ? `<select data-ch="frGroup" data-f="${f.id}" aria-label="Assign an army group"><option value="">Army group…</option>${gs.map(g => `<option value="${g.id}">${esc(g.name)}</option>`).join('')}</select>` : ''}${A.length ? btn('Select', 'frSel', `data-f="${f.id}"`, 'sm', 'Select the armies of this front') : ''}</div>
    ${A.length ? `<div class="frarmies">${A.map(a => `<span class="pill" data-a="armySel" data-i="${a.id}" style="cursor:pointer"${tip(`${esc(a.name)}: ${a.divs.length} div, org ${Math.round(frOrg(a) * 100)}%${a.fpost !== undefined ? `<br>Post: ${P(a.fpost).name}` : ''}${a.battle ? '<br><span class="neg">In battle</span>' : ''}`)}>${a.battle ? '⚔ ' : ''}${esc(a.name)} · ${a.divs.length}</span>`).join(' ')}</div>` : '<div class="dim">No armies yet. Select armies and assign them, or assign the idle ones.</div>'}
  </div>`; }
function frontsPanel(c) {
  const F = frontsOf(c.tag), cands = frontCandidates(c.tag), en = enemiesOf(c.tag).filter(t => ok(t)), vs = cands.includes(UI.frVs) ? UI.frVs : (en.find(t => cands.includes(t)) || cands[0]);
  const noFront = en.filter(t => cands.includes(t) && !F.some(f => f.enemy === t));
  let h = `<div class="card"><div class="row sp"><b>⚔ Fronts and battle plans</b><span class="dim">${F.length} front${F.length === 1 ? '' : 's'} · ${sum(F, frDivs)} of ${sum(armiesOf(c.tag), a => a.divs.length)} divisions</span></div>
    <div class="dim">A front holds a border with one enemy. Give it armies and an order; draw its sector, objectives and fallback line on the map. The armies spread along the line by threat and, on the order to attack, strike where the odds suit the stance and drive towards the objectives. A front that holds plans its offensive.</div>
    ${cands.length ? `<div class="row"><span class="dim">New front against</span><select data-ch="frVs">${cands.map(t => `<option value="${t}"${t === vs ? ' selected' : ''}>${cname(t)}${atWar(c.tag, t) ? ' ⚔' : ''}</option>`).join('')}</select>${btn('Create', 'frNew', '', 'sm pri')}${noFront.length ? btn(`A front for every war (${noFront.length})`, 'frNewAll', '', 'sm', noFront.map(cname).join(', ')) : ''}</div>` : '<div class="dim">We share no land border with anyone we could face.</div>'}
    ${frIdle(c).length ? `<div class="dim">${frIdle(c).length} armies have no front, order or battle.</div>` : ''}</div>`;
  h += F.map(f => frontCard(c, f)).join('');
  return h; }
// the Military tab: a Fronts sub-tab, and a front card for the selected armies
{ const _mil = PANELS.military; PANELS.military = function (c) {
  let h = _mil(c); const F = frontsOf(c.tag); h = h.replace('</div>', btn(`Fronts${F.length ? ` (${F.length})` : ''}`, 'sub', 'data-k="military" data-v="fronts"', UI.sub.military === 'fronts' ? 'on' : '') + '</div>');
  if (UI.sub.military === 'fronts') return h.slice(0, h.indexOf('</div>') + 6) + frontsPanel(c);
  const sel = selArmies(); if (!sel.length) return h;
  const on = sel.filter(a => frontOf(a)), cands = frontCandidates(c.tag), fsel = F.find(f => f.id === +UI.frPick) || frontOf(on[0]) || F[0];
  const card = `<div class="card"><div class="row sp"><b>🛡 Front</b>${on.length ? `<span class="dim">${on.length} of ${sel.length} on ${[...new Set(on.map(a => frontOf(a).name))].slice(0, 2).map(esc).join(', ')}</span>` : ''}</div>
    <div class="row">${F.length ? `<select data-ch="frPick" aria-label="Front">${F.map(f => `<option value="${f.id}"${fsel && f.id === fsel.id ? ' selected' : ''}>${esc(f.name)}</option>`).join('')}</select>${btn('Assign', 'frAssign', `data-f="${fsel ? fsel.id : ''}" data-w="sel"`, 'sm')}` : ''}${cands.length ? btn(`New front: ${cname(cands.includes(UI.frVs) ? UI.frVs : (enemiesOf(c.tag).find(t => cands.includes(t)) || cands[0]))}`, 'frNew', 'data-sel="1"', 'sm', 'Create a front against this nation with the selected armies. Choose another nation in the Fronts tab.') : ''}${on.length ? btn('Leave front', 'frLeave', '', 'sm') : ''}${btn('Fronts tab', 'sub', 'data-k="military" data-v="fronts"', 'sm')}</div></div>`;
  const k = '<div class="card"><div class="row sp"><b>⚑ Offensive orders'; const i = h.indexOf(k); if (i >= 0) return h.slice(0, i) + card + h.slice(i);
  const j = h.indexOf('</div>') + 6; return h.slice(0, j) + card + h.slice(j); }; }
{ const _ac = armyCard; armyCard = function (c, a) { const h = _ac(c, a), f = frontOf(a); if (!f) return h;
  return h.replace('<div class="row">', `<div class="pos" style="color:${frCol(f)}">🛡 ${esc(f.name)} · ${FR_ORDER[f.order][0].toLowerCase()}${a.fpost !== undefined ? ` · post: ${P(a.fpost).name}` : ''}</div><div class="row">`); }; }
// moving an army by hand takes it off its front
{ const _mv = uiMoveArmy; uiMoveArmy = function (id) { const off = selArmies().filter(a => frontOf(a)); if (off.length) { for (const a of off) frontRelease(a); toast(`${off.length > 1 ? off.length + ' armies leave' : off[0].name + ' leaves'} the front to march on your orders.`, 'mil'); } return _mv(id); }; }
Object.assign(ACT, {
  frNew(d) { const c = me(), cands = frontCandidates(c.tag), vs = cands.includes(UI.frVs) ? UI.frVs : (enemiesOf(c.tag).find(t => cands.includes(t)) || cands[0]); if (!vs) return; const f = frontNew(c.tag, vs);
    if (d.sel) frontAssign(f, selArmies()); UI.frPick = f.id; toast(`${f.name} formed${f.armies.length ? ` with ${f.armies.length} arm${f.armies.length > 1 ? 'ies' : 'y'}` : ''}.`, 'mil'); MV.dirty = true; renderAll(); },
  frNewAll() { const c = me(), cands = frontCandidates(c.tag); let n = 0; for (const t of enemiesOf(c.tag)) if (cands.includes(t) && !frontsOf(c.tag).some(f => f.enemy === t)) { frontNew(c.tag, t); n++; } toast(`${n} front${n === 1 ? '' : 's'} formed.`, 'mil'); MV.dirty = true; renderAll(); },
  frDel(d) { const f = fronts()[+d.f]; if (!f) return; if (UI.frDraw && UI.frDraw.id === f.id) frDrawEnd(); frontDelete(f); MV.dirty = true; renderAll(); },
  frOrder(d) { const f = fronts()[+d.f]; if (!f) return; f.order = d.o; const war = atWar(f.owner, f.enemy);
    toast(d.o === 'attack' ? (war ? `${f.name}: the battle plan is executed${f.plan > 0.2 ? ` with ${Math.round(f.plan * 25)}% planning` : ''}.` : `${f.name} deploys and waits for war.`) : d.o === 'fallback' ? `${f.name} falls back to its fallback line.` : `${f.name} holds the line.`, 'mil'); MV.dirty = true; renderAll(); },
  frStance(d) { const f = fronts()[+d.f]; if (f) f.stance = d.s; renderPanel(); },
  frAssign(d) { const c = me(), f = fronts()[+d.f]; if (!f) return; const list = d.w === 'idle' ? frIdle(c) : selArmies(); if (!list.length) return; frontAssign(f, list);
    toast(`${list.length} arm${list.length > 1 ? 'ies' : 'y'} join${list.length > 1 ? '' : 's'} the ${esc(f.name)}.`, 'mil'); frontDaily(f); MV.dirty = true; renderAll(); },
  frLeave() { const l = selArmies().filter(a => frontOf(a)); for (const a of l) frontRelease(a); toast(`${l.length} arm${l.length > 1 ? 'ies' : 'y'} leave${l.length > 1 ? '' : 's'} the front.`, 'mil'); MV.dirty = true; renderAll(); },
  frSel(d) { const f = fronts()[+d.f]; if (!f) return; setSelection(frArmies(f)); UI.sub.military = 'armies'; MV.dirty = true; renderAll(); },
  frFind(d) { const f = fronts()[+d.f]; if (!f) return; const pr = frPairsC(f); const id = pr.length ? pr[pr.length >> 1][0] : (frArmies(f)[0] || {}).loc; if (id !== undefined) mapCenter(id, 0.6); MV.dirty = true; },
  frClear(d) { const f = fronts()[+d.f]; if (!f) return; f.only = []; f.targets = []; f.fallback = []; if (f.order === 'fallback') f.order = 'hold'; MV.dirty = true; renderAll(); },
  frDraw(d) { const f = fronts()[+d.f]; if (!f) return; if (UI.frDraw && UI.frDraw.id === f.id && UI.frDraw.k === d.k) return frDrawEnd(); UI.frDraw = { id: f.id, k: d.k }; frBanner(); MV.dirty = true; renderPanel(); },
  frDrawDone() { frDrawEnd(); }
});
Object.assign(CHG, {
  frVs(el) { UI.frVs = el.value; },
  frPick(el) { UI.frPick = +el.value; renderPanel(); },
  frName(el) { const f = fronts()[+el.dataset.f]; if (f) f.name = el.value.slice(0, 32) || f.name; MV.dirty = true; },
  frGroup(el) { const c = me(), f = fronts()[+el.dataset.f], g = (c.agroups || []).find(x => x.id === +el.value); if (!f || !g) return; const list = g.armies.map(i => G.armies[i]).filter(a => a && a.owner === c.tag); frontAssign(f, list); toast(`${esc(g.name)} takes over the ${esc(f.name)}.`, 'mil'); MV.dirty = true; renderAll(); }
});
// ---------- drawing on the map ----------
const FR_DRAW_TEXT = { sector: 'Paint our border provinces to mark the sector. Drag to paint; click a painted province to remove it.', target: 'Click enemy provinces to set the objectives of the offensive (up to four). Click one again to remove it.', fallback: 'Paint our provinces to draw the fallback line. Drag to paint; click a painted province to remove it.' };
function frBanner() { const host = $('mapwrap'); if (!host) return; let el = $('frdraw'); const d = UI.frDraw, f = d && fronts()[d.id];
  if (!f) { if (el) el.remove(); return; } if (!el) { el = document.createElement('div'); el.id = 'frdraw'; host.appendChild(el); }
  el.style.borderColor = frCol(f); el.innerHTML = `<b style="color:${frCol(f)}">${esc(f.name)}</b> · ${FR_DRAW_TEXT[d.k]} <button class="sm pri" data-a="frDrawDone">Done</button>`; }
function frDrawEnd() { UI.frDraw = null; frBanner(); MV.dirty = true; if (typeof renderPanel === 'function') renderPanel(); }
let FR_PAINT = null;
function frPaint(id, first) { const d = UI.frDraw, f = d && fronts()[d.id]; if (!f || id === null || id === undefined) return; const p = P(id);
  const list = d.k === 'sector' ? f.only : d.k === 'target' ? f.targets : f.fallback, okp = d.k === 'target' ? !frOurs(f.owner, p) && !!p.ctrl && (frTheirs(f, p) || atWar(f.owner, p.ctrl)) : frOurs(f.owner, p);
  if (first) FR_PAINT = { add: !list.includes(id), seen: new Set() }; if (!FR_PAINT || FR_PAINT.seen.has(id)) return; FR_PAINT.seen.add(id);
  if (!okp && FR_PAINT.add) { if (first) toast(d.k === 'target' ? 'Objectives must be held by the enemy.' : 'Only our own provinces can be painted.', 'bad'); return; }
  if (d.k === 'target' && !first) return; // objectives are clicked, not painted
  const i = list.indexOf(id); if (FR_PAINT.add && i < 0) { if (d.k === 'target' && list.length >= 4) { toast('Four objectives are the most one battle plan can have.', 'bad'); return; } list.push(id); } else if (!FR_PAINT.add && i >= 0) list.splice(i, 1);
  if (d.k === 'fallback' && !f.fallback.length && f.order === 'fallback') f.order = 'hold'; MV.dirty = true; }
function frInstall() { const cv = $('map'); if (!cv || frInstall.done) return; frInstall.done = true; const host = cv.parentElement; let on = false;
  const at = e => { const r = cv.getBoundingClientRect(); return provAt(MV.x + (e.clientX - r.left) / MV.s, MV.y + (e.clientY - r.top) / MV.s); };
  host.addEventListener('pointerdown', e => { if (!UI.frDraw || e.target !== cv || (e.pointerType === 'mouse' && e.button !== 0)) return; e.stopPropagation(); e.preventDefault(); on = true; try { cv.setPointerCapture(e.pointerId); } catch (x) { /* fine */ } frPaint(at(e), true); }, true);
  host.addEventListener('pointermove', e => { if (!UI.frDraw || !on) return; e.stopPropagation(); frPaint(at(e), false); }, true);
  const up = e => { if (!on) return; on = false; e.stopPropagation(); FR_PAINT = null; renderPanel(); }; host.addEventListener('pointerup', up, true); host.addEventListener('pointercancel', up, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && UI.frDraw) frDrawEnd(); }); }
{ const _mi = mapInit; mapInit = function () { _mi(); frInstall(); }; }
// ---------- on the map: provinces taken in part, front lines, objectives, fallback lines ----------
let FR_SEGS = null;
function frSegs() { if (FR_SEGS) return FR_SEGS; if (!SEGS) buildSegs(); FR_SEGS = new Map(); for (const s of SEGS) { const k = Math.min(s[0], s[1]) + '|' + Math.max(s[0], s[1]); (FR_SEGS.get(k) || FR_SEGS.set(k, []).get(k)).push(s); } return FR_SEGS; }
function frArrow(ctx, x0, y0, x1, y1, col, w) { const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (L < 1) return; const nx = -dy / L, ny = dx / L, bend = Math.min(60, L * 0.18), cx = (x0 + x1) / 2 + nx * bend, cy = (y0 + y1) / 2 + ny * bend;
  const tx = x1 - cx, ty = y1 - cy, tl = Math.hypot(tx, ty) || 1, ux = tx / tl, uy = ty / tl, hl = w * 3.2, bx = x1 - ux * hl, by = y1 - uy * hl;
  ctx.lineCap = 'round'; for (const [c2, ww] of [['rgba(0,0,0,0.6)', w + 2.5 / MV.s], [col, w]]) { ctx.strokeStyle = c2; ctx.lineWidth = ww; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, bx, by); ctx.stroke(); }
  ctx.fillStyle = col; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1.5 / MV.s; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(bx + uy * hl * 0.75, by - ux * hl * 0.75); ctx.lineTo(bx - uy * hl * 0.75, by + ux * hl * 0.75); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.lineCap = 'butt'; }
function frDrawCq(ctx, vx0, vy0, vx1, vy1) {
  for (const p of G.P) { const q = p.cq; if (!q || q.v < 0.02) continue; const b = PBOX[p.id]; if (b[2] < vx0 || b[0] > vx1 || b[3] < vy0 || b[1] > vy1) continue; if (typeof provSeen === 'function' && !provSeen(p.id) && !cqSide(p, G.player)) continue;
    const m = MAP.P[p.id], f = MAP.P[q.from !== undefined ? q.from : p.id]; let dx = m.x - f.x, dy = m.y - f.y; if (Math.abs(dx) > MAP.W / 2) dx -= Math.sign(dx) * MAP.W; let L = Math.hypot(dx, dy); if (L < 1) { dx = 1; dy = 0; L = 1; } const ux = dx / L, uy = dy / L;
    let lo = 1e9, hi = -1e9; for (const r of m.poly) for (let k = 0; k < r.length; k += 2) { const t = r[k] * ux + r[k + 1] * uy; if (t < lo) lo = t; if (t > hi) hi = t; } const cut = lo + (hi - lo) * q.v, big = (b[2] - b[0]) + (b[3] - b[1]) + 50;
    const px = -uy, py = ux, s0 = m.x * px + m.y * py, pt = (t, s) => [ux * t + px * (s0 + s), uy * t + py * (s0 + s)], A = pt(lo - 5, -big), B = pt(cut, -big), Cc = pt(cut, big), D = pt(lo - 5, big);
    ctx.save(); ctx.clip(PPATH[p.id]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(Cc[0], Cc[1]); ctx.lineTo(D[0], D[1]); ctx.closePath();
    ctx.globalAlpha = 0.78; ctx.fillStyle = (C(q.t) || {}).color || '#888'; ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 3 / MV.s; ctx.beginPath(); const st = 10 / MV.s; for (let s = -big; s < big; s += st) { const a = pt(lo - 5, s), z = pt(cut, s + (cut - lo)); ctx.moveTo(a[0], a[1]); ctx.lineTo(z[0], z[1]); } ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.setLineDash([5 / MV.s, 3 / MV.s]); ctx.lineWidth = 2 / MV.s; ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(Cc[0], Cc[1]); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); } }
function frDrawFronts(ctx) { const pl = G.player, F = frontsOf(pl); if (!F.length) return; const SG = frSegs(), dr = UI.frDraw;
  for (const f of F) { const col = frCol(f), pairs = frPairsC(f), sel = selArmies().some(a => frontOf(a) === f), drawing = dr && dr.id === f.id;
    // the line itself
    for (const [c2, w] of [['rgba(0,0,0,0.75)', Math.max(9 / MV.s, 4.5)], [col, Math.max(5.5 / MV.s, 2.8)]]) { ctx.strokeStyle = c2; ctx.lineWidth = w * (sel || drawing ? 1.25 : 1); ctx.beginPath(); for (const [a, b] of pairs) { const l = SG.get(Math.min(a, b) + '|' + Math.max(a, b)); if (l) for (const s of l) strokeSeg(ctx, s); } ctx.stroke(); }
    // sector, fallback line
    if (drawing && f.only.length) { ctx.globalAlpha = 0.28; ctx.fillStyle = col; for (const id of f.only) ctx.fill(PPATH[id]); ctx.globalAlpha = 1; }
    if (f.fallback.length) { ctx.strokeStyle = col; ctx.lineWidth = Math.max(2.5 / MV.s, 1.5); ctx.setLineDash([6 / MV.s, 4 / MV.s]); for (const id of f.fallback) ctx.stroke(PPATH[id]); ctx.setLineDash([]); if (drawing || f.order === 'fallback') { ctx.globalAlpha = 0.18; ctx.fillStyle = col; for (const id of f.fallback) ctx.fill(PPATH[id]); ctx.globalAlpha = 1; } }
    // objectives: an arrow from the nearest stretch of the line
    if (f.targets.length) { const ours = [...new Set(pairs.map(x => x[0]))].concat(frArmies(f).map(a => a.loc)); for (const t of f.targets) { if (!ours.length) break; let best = ours[0], bd = 1e9; for (const id of ours) { const d = frDist(id, t); if (d < bd) { bd = d; best = id; } }
      const a = MAP.P[best], b = MAP.P[t]; frArrow(ctx, a.x, a.y, b.x, b.y, f.order === 'attack' ? col : 'rgba(230,230,230,0.85)', Math.max(5 / MV.s, 2.5)); ctx.strokeStyle = col; ctx.lineWidth = 2.5 / MV.s; ctx.stroke(PPATH[t]); } } } }
{ const _ow = mapWorldOverlay; mapWorldOverlay = function (ctx) { _ow(ctx); if (!G) return; const vx0 = MV.x, vy0 = MV.y, vx1 = MV.x + MV.w / MV.s, vy1 = MV.y + MV.h / MV.s;
  try { frDrawCq(ctx, vx0, vy0, vx1, vy1); frDrawFronts(ctx); } catch (e) { console.warn(e); } }; }
// ---------- the province box ----------
{ const _rp = renderProv; renderProv = function () { _rp(); if (SEL.prov === null) return; const p = P(SEL.prov), el = $('provinfo'); if (!el) return; let add = '';
  if (p.cq && p.cq.v >= 0.02) add += `<div class="row"${tip('Part of this province has been taken. Its defenders have lost that much ground and fight with less of it. What is taken is kept while the attackers stand next to it, and the next attack starts from there.')}><span>⚔ <b>${Math.round(p.cq.v * 100)}%</b> taken by ${cn(p.cq.t)}</span>${bar(p.cq.v, 'r')}</div>`;
  const F = frontsOf(G.player).filter(f => frPairsC(f).some(x => x[0] === p.id || x[1] === p.id) || f.targets.includes(p.id)); if (F.length) add += `<div class="dim">${F.map(f => `<span style="color:${frCol(f)}">🛡 ${esc(f.name)}${f.targets.includes(p.id) ? ' · objective' : ''}</span>`).join(' · ')}</div>`;
  if (add) el.insertAdjacentHTML('beforeend', add); }; }
// the panel is redrawn often; the banner follows the drawing state
{ const _ra = renderAll; renderAll = function () { _ra(); if (UI.frDraw && !fronts()[UI.frDraw.id]) UI.frDraw = null; frBanner(); }; }

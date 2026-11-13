// Map rendering and interaction (canvas).
'use strict';
const MV = { x: 3300, y: 500, s: 0.35, mode: 'political', dirty: true, hits: [], labels: null };
const SEL = { prov: null, army: null };
const PPATH = [], PBOX = [], PAREA = [], INNER = [];
const MODES = [['political', 'Political'], ['ideology', 'Ideology'], ['diplo', 'Diplomacy'], ['faction', 'Factions'], ['terrain', 'Terrain'], ['pop', 'Population'], ['dev', 'Industry'], ['res', 'Resources'], ['sol', 'Living Standards'], ['cores', 'Cores & Claims']];
let mapCv, mapCx, hitCx;
function mapInit() {
  mapCv = document.getElementById('map'); mapCx = mapCv.getContext('2d'); hitCx = document.createElement('canvas').getContext('2d');
  MAP.P.forEach((p, i) => { const path = new Path2D(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, ar = 0;
    for (const r of p.poly) { for (let k = 0; k < r.length; k += 2) { const x = r[k], y = r[k + 1]; k ? path.lineTo(x, y) : path.moveTo(x, y); if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; const j = (k + 2) % r.length; ar += x * r[j + 1] - r[j] * y; } path.closePath(); }
    PPATH[i] = path; PBOX[i] = [x0, y0, x1, y1]; PAREA[i] = Math.abs(ar / 2); });
  for (const [a, b] of MAP.inner) { const set = new Set(); for (const r of MAP.P[b].poly) for (let k = 0; k < r.length; k += 2) set.add(r[k] + ',' + r[k + 1]); const segs = [];
    for (const r of MAP.P[a].poly) for (let k = 0; k < r.length; k += 2) { const j = (k + 2) % r.length; if (set.has(r[k] + ',' + r[k + 1]) && set.has(r[j] + ',' + r[j + 1])) segs.push(r[k], r[k + 1], r[j], r[j + 1]); }
    if (segs.length) INNER.push([a, b, segs]); }
  const el = document.getElementById('mapmodes'); el.innerHTML = MODES.map(m => `<button data-mode="${m[0]}">${m[1]}</button>`).join('');
  el.onclick = e => { const m = e.target.dataset.mode; if (m) { MV.mode = m; MV.dirty = true; mapModeButtons(); } }; mapModeButtons();
  // Left-drag draws a selection box; right- or middle-drag (or one finger) pans; a right-click without dragging gives orders.
  let drag = null, moved = false, pinch = null, box = null; const pts = new Map();
  mapCv.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });
  mapCv.addEventListener('pointerdown', e => { mapCv.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); moved = false; MV.box = null;
    box = e.pointerType === 'mouse' && e.button === 0 ? [e.clientX, e.clientY] : null; drag = box ? null : [e.clientX, e.clientY, MV.x, MV.y];
    if (pts.size === 2) { box = null; const [a, b] = [...pts.values()]; pinch = [Math.hypot(a[0] - b[0], a[1] - b[1]), MV.s]; } });
  mapCv.addEventListener('pointermove', e => { if (!pts.has(e.pointerId)) { mapHover(e); return; } pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2 && pinch) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); zoomAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, pinch[1] * d / pinch[0] / MV.s); moved = true; return; }
    if (box) { const r = mapCv.getBoundingClientRect(); if (Math.abs(e.clientX - box[0]) + Math.abs(e.clientY - box[1]) > 6) { MV.box = [box[0] - r.left, box[1] - r.top, e.clientX - r.left, e.clientY - r.top]; moved = true; MV.dirty = true; } return; }
    if (!drag) return; const dx = e.clientX - drag[0], dy = e.clientY - drag[1]; if (Math.abs(dx) + Math.abs(dy) > 5) moved = true; if (moved) { MV.x = drag[2] - dx / MV.s; MV.y = drag[3] - dy / MV.s; clampView(); MV.dirty = true; } });
  const up = e => { const had = pts.has(e.pointerId); pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
    if (box && MV.box) { const bx = MV.box; box = null; MV.box = null; drag = null; MV.dirty = true; uiBoxSelect(bx, e.shiftKey); return; } box = null;
    if (had && !moved && e.type === 'pointerup') mapClick(e, e.button === 2); drag = null; };
  mapCv.addEventListener('pointerup', up); mapCv.addEventListener('pointercancel', up);
  mapCv.addEventListener('contextmenu', e => e.preventDefault());
  mapCv.addEventListener('wheel', e => { e.preventDefault(); zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.18 : 1 / 1.18); }, { passive: false });
  new ResizeObserver(() => { mapResize(); }).observe(mapCv.parentElement); mapResize();
}
function mapModeButtons() { document.querySelectorAll('#mapmodes button').forEach(b => b.classList.toggle('on', b.dataset.mode === MV.mode)); }
function mapResize() { const r = mapCv.parentElement.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); mapCv.width = Math.max(50, r.width * d); mapCv.height = Math.max(50, r.height * d); MV.w = r.width; MV.h = r.height; MV.dpr = d; clampView(); MV.dirty = true; }
function clampView() { const mn = Math.max(MV.w / MAP.W, MV.h / MAP.H * 0.6); MV.s = clamp(MV.s, mn, 4); MV.x = clamp(MV.x, 0, Math.max(0, MAP.W - MV.w / MV.s)); MV.y = clamp(MV.y, -100, Math.max(-100, MAP.H - MV.h / MV.s + 100)); }
function zoomAt(cx, cy, f) { const r = mapCv.getBoundingClientRect(), mx = cx - r.left, my = cy - r.top, wx = MV.x + mx / MV.s, wy = MV.y + my / MV.s; MV.s = clamp(MV.s * f, 0.05, 4); clampView(); MV.x = wx - mx / MV.s; MV.y = wy - my / MV.s; clampView(); MV.dirty = true; }
function mapCenter(id, zoom) { const p = MAP.P[id]; if (zoom) MV.s = Math.max(MV.s, zoom); clampView(); MV.x = p.x - MV.w / MV.s / 2; MV.y = p.y - MV.h / MV.s / 2; clampView(); MV.dirty = true; }
function provAt(wx, wy) { for (let i = 0; i < PBOX.length; i++) { const b = PBOX[i]; if (wx < b[0] || wx > b[2] || wy < b[1] || wy > b[3]) continue; if (hitCx.isPointInPath(PPATH[i], wx, wy)) return i; } return null; }
function mapClick(e, right) {
  const r = mapCv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
  if (!right) for (const h of MV.hits) if (mx >= h[0] && mx <= h[0] + h[2] && my >= h[1] && my <= h[1] + h[3]) { uiSelectArmies(h[4], h[5]); return; }
  const id = provAt(MV.x + mx / MV.s, MV.y + my / MV.s);
  if (right) { if (id !== null && SEL.army && G.armies[SEL.army]) uiMoveArmy(id); return; }
  uiSelectProv(id);
}
let hoverId = null;
function mapHover(e) { const r = mapCv.getBoundingClientRect(), id = provAt(MV.x + (e.clientX - r.left) / MV.s, MV.y + (e.clientY - r.top) / MV.s); if (id !== hoverId) { hoverId = id; const h = document.getElementById('hint'); if (h && G) h.textContent = id === null ? '' : `${P(id).name} — ${cname(P(id).owner)}${P(id).ctrl !== P(id).owner ? ' (held by ' + cname(P(id).ctrl) + ')' : ''}`; } }
const hex = c => [1, 3, 5].map(i => parseInt(c.substr(i, 2), 16));
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
const ramp = (t, a = '#22303c', b = '#e0b04a') => mix(a, b, clamp(t, 0, 1));
const TER_COL = { p: '#7a9a5a', f: '#3f6f45', h: '#9a8a5a', m: '#8a7f78', d: '#d3bd7a', j: '#2f7f5a', u: '#a0a0a8', s: '#5a7f7a' };
function provColor(p) {
  const pl = G.player, c = C(p.ctrl) || C(p.owner);
  switch (MV.mode) {
    case 'political': return c.color;
    case 'ideology': return IDEO[c.ideology][1];
    case 'terrain': return TER_COL[p.ter];
    case 'pop': return ramp(Math.log10(p.pop + 1) / 4.9);
    case 'dev': return ramp(provLevels(p) / 45, '#22303c', '#e07a4a');
    case 'sol': return ramp((C(p.owner).sol - 3) / 20, '#5a2a2a', '#7fd08a');
    case 'res': { const r = p.res; if (!r.coal && !r.iron && !r.oil && !r.rubber) return '#2a3540'; const top = Object.keys(r).sort((a, b) => r[b] - r[a])[0]; return mix('#2a3540', { coal: '#b0b0b0', iron: '#d07050', oil: '#b060d0', rubber: '#50c090' }[top], 0.35 + r[top] * 0.13); }
    case 'faction': { const f = factionOf(p.owner); if (!f) return '#3a4650'; return C(f.leader).color; }
    case 'cores': return p.cores.includes(pl) ? (p.owner === pl ? '#4f9f5f' : '#e0b04a') : p.claims.includes(pl) ? '#d0d060' : p.owner === pl ? '#7f8f6f' : '#2a3540';
    case 'diplo': { const t = p.owner; if (t === pl) return '#4f9f5f'; if (atWar(pl, t)) return '#c0392b'; if (friendly(pl, t)) return C(t).overlord === pl ? '#7fd0b0' : '#3d7fd9'; const o = opinion(t, pl); return o >= 0 ? mix('#4a5560', '#7fb0e0', o / 100) : mix('#4a5560', '#d08060', -o / 100); }
  }
  return '#444';
}
function computeLabels() {
  const acc = {}; for (const p of G.P) { const c = C(p.owner); if (!c || !c.exists) continue; const cap = MAP.P[c.capital], m = MAP.P[p.id]; if (Math.hypot(m.x - cap.x, m.y - cap.y) > 1400 && p.id !== c.capital) continue; const a = acc[p.owner] || (acc[p.owner] = [0, 0, 0]); const w = PAREA[p.id] + 50; a[0] += m.x * w; a[1] += m.y * w; a[2] += w; }
  MV.labels = Object.keys(acc).map(t => ({ t, x: acc[t][0] / acc[t][2], y: acc[t][1] / acc[t][2], size: Math.sqrt(acc[t][2]) }));
}
function mapDraw() {
  if (!G || !mapCx) return; MV.dirty = false; const ctx = mapCx, s = MV.s * MV.dpr; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#17242f'; ctx.fillRect(0, 0, mapCv.width, mapCv.height);
  ctx.setTransform(s, 0, 0, s, -MV.x * s, -MV.y * s); const vx0 = MV.x, vy0 = MV.y, vx1 = MV.x + MV.w / MV.s, vy1 = MV.y + MV.h / MV.s, vis = [];
  for (let i = 0; i < PBOX.length; i++) { const b = PBOX[i]; if (b[2] < vx0 || b[0] > vx1 || b[3] < vy0 || b[1] > vy1) continue; vis.push(i); }
  ctx.lineJoin = 'round';
  for (const i of vis) { const p = G.P[i]; ctx.fillStyle = provColor(p); ctx.fill(PPATH[i]);
    if (p.ctrl !== p.owner && MV.mode === 'political') { ctx.save(); ctx.clip(PPATH[i]); ctx.strokeStyle = C(p.owner).color; ctx.lineWidth = 5 / MV.s; ctx.beginPath(); const b = PBOX[i], st = 14 / MV.s; for (let x = b[0] - (b[3] - b[1]); x < b[2]; x += st) { ctx.moveTo(x, b[1]); ctx.lineTo(x + (b[3] - b[1]), b[3]); } ctx.stroke(); ctx.restore(); }
    if (p.dmg > 0.15) { ctx.fillStyle = `rgba(0,0,0,${p.dmg * 0.5})`; ctx.fill(PPATH[i]); } }
  ctx.strokeStyle = 'rgba(0,0,0,0.28)'; ctx.lineWidth = 0.8 / MV.s; if (MV.s > 0.18) for (const i of vis) ctx.stroke(PPATH[i]);
  // national borders
  ctx.strokeStyle = 'rgba(10,12,16,0.9)'; ctx.lineWidth = Math.max(1.6 / MV.s, 1.2); ctx.beginPath();
  for (const [a, b, pts] of MAP.borders) { if (G.P[a].owner === G.P[b].owner && G.P[a].ctrl === G.P[b].ctrl) continue; ctx.moveTo(pts[0], pts[1]); for (let k = 2; k < pts.length; k += 2) ctx.lineTo(pts[k], pts[k + 1]); }
  for (const [a, b, sg] of INNER) { if (G.P[a].owner === G.P[b].owner && G.P[a].ctrl === G.P[b].ctrl) continue; for (let k = 0; k < sg.length; k += 4) { ctx.moveTo(sg[k], sg[k + 1]); ctx.lineTo(sg[k + 2], sg[k + 3]); } }
  ctx.stroke();
  if (SEL.prov !== null) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5 / MV.s; ctx.stroke(PPATH[SEL.prov]); }
  // screen-space overlays
  ctx.setTransform(MV.dpr, 0, 0, MV.dpr, 0, 0); const X = wx => (wx - MV.x) * MV.s, Y = wy => (wy - MV.y) * MV.s;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (MV.s > 0.3) for (const i of vis) { const p = G.P[i], m = MAP.P[i], cap = C(p.owner).capital === i; if (!cap && p.vp < 5 && MV.s < 0.9) continue; const x = X(m.x), y = Y(m.y);
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x, y, cap ? 3.5 : 2.2, 0, 7); ctx.fill(); if (cap) { ctx.strokeStyle = '#f0d070'; ctx.lineWidth = 1.5; ctx.stroke(); }
    if (MV.s > 0.55) { ctx.font = `${cap ? 600 : 500} 11px Barlow, sans-serif`; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.65)'; ctx.strokeText(p.name, x, y + 11); ctx.fillStyle = '#eee'; ctx.fillText(p.name, x, y + 11); }
    if (p.fort > 0 && MV.s > 0.5) { ctx.fillStyle = '#ddd'; ctx.font = '10px sans-serif'; ctx.fillText('▲'.repeat(Math.min(3, Math.ceil(p.fort / 2))), x, y - 9); } }
  if (!MV.labels || MV.labelDay !== G.day >> 3) { computeLabels(); MV.labelDay = G.day >> 3; }
  if (MV.s < 1.2) for (const l of MV.labels) { const c = C(l.t); if (!c.exists) continue; const fs = l.size * MV.s * 0.2; if (fs < 9 || fs > 46) continue; const x = X(l.x), y = Y(l.y); if (x < -100 || y < -30 || x > MV.w + 100 || y > MV.h + 30) continue;
    ctx.font = `600 ${Math.min(34, fs)}px "Barlow Condensed", "Arial Narrow", sans-serif`; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.5)'; const nm = c.name.toUpperCase(); ctx.strokeText(nm, x, y); ctx.fillStyle = 'rgba(255,255,255,0.86)'; ctx.fillText(nm, x, y); }
  // movement path of the selection
  const sa = G.armies[SEL.army]; if (sa && sa.path.length) { ctx.strokeStyle = '#fff'; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(MAP.P[sa.loc].x), Y(MAP.P[sa.loc].y)); for (const id of sa.path) ctx.lineTo(X(MAP.P[id].x), Y(MAP.P[id].y)); ctx.stroke(); ctx.setLineDash([]); }
  // armies
  MV.hits = []; const by = {}, pl = G.player, far = MV.s < 0.32;
  for (const id in G.armies) { const a = G.armies[id]; if (far && a.owner !== pl && !atWar(pl, a.owner)) continue; const b = PBOX[a.loc]; if (b[2] < vx0 || b[0] > vx1 || b[3] < vy0 || b[1] > vy1) continue; const k = a.loc + '|' + a.owner; (by[k] || (by[k] = [])).push(a); }
  const slot = {}; ctx.font = '600 11px Barlow, sans-serif';
  for (const k in by) { const list = by[k], a0 = list[0], m = MAP.P[a0.loc], n = slot[a0.loc] = (slot[a0.loc] || 0) + 1, w = far ? 18 : 30, h = far ? 11 : 16, x = X(m.x) - w / 2 + (n - 1) * (w + 2) - 0, y = Y(m.y) - h - 5;
    const divs = sum(list, a => a.divs.length), c = C(a0.owner), sel = list.some(a => a.id === SEL.army || (SEL.multi && SEL.multi.includes(a.id))), org = sum(list, a => sum(a.divs, d => d.org)) / Math.max(1, divs), str = sum(list, a => sum(a.divs, d => d.str)) / Math.max(1, divs);
    ctx.fillStyle = a0.owner === pl ? '#f4ecd0' : atWar(pl, a0.owner) ? '#f0b0a0' : '#c8ccd0'; ctx.fillRect(x, y, w, h); ctx.fillStyle = c.color; ctx.fillRect(x, y, 6, h);
    ctx.fillStyle = '#3a9a4a'; ctx.fillRect(x + 6, y + h - 2.5, (w - 6) * org, 2.5); ctx.fillStyle = '#c08030'; ctx.fillRect(x + 6, y, (w - 6) * str, 1.5);
    ctx.strokeStyle = sel ? '#fff' : '#000'; ctx.lineWidth = sel ? 2.5 : 1; ctx.strokeRect(x, y, w, h); ctx.fillStyle = '#111'; if (!far) ctx.fillText(divs + (list.some(a => a.path.length) ? '›' : '') + (list.some(a => a.oos) ? '!' : ''), x + 6 + (w - 6) / 2, y + h / 2);
    MV.hits.push([x, y, w, h, a0.loc, a0.owner]); }
  if (MV.box) { const b = MV.box; ctx.strokeStyle = '#fff'; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.5; ctx.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]); ctx.setLineDash([]); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(b[0], b[1], b[2] - b[0], b[3] - b[1]); }
  for (const b of G.battles) { const m = MAP.P[b.prov], x = X(m.x), y = Y(m.y) + 14; if (x < 0 || y < 0 || x > MV.w || y > MV.h) continue; ctx.fillStyle = '#000b'; ctx.fillRect(x - 17, y - 5, 34, 9); ctx.fillStyle = '#d04030'; ctx.fillRect(x - 16, y - 4, 32, 7); ctx.fillStyle = '#40a050'; ctx.fillRect(x - 16, y - 4, 32 * b.bal, 7); ctx.font = '13px sans-serif'; ctx.fillText('⚔', x, y - 12); }
}

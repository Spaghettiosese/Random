// 2.3 interface: the weather map mode (weather, ground and temperature, with symbols over each region), the
// Conditions map mode (floods, scorched earth, partisans, sieges...), and both in the province box.
'use strict';
const WX_COL = { clear: '#5d7f52', cloud: '#6f7d84', rain: '#4a6f95', storm: '#3a4f8a', fog: '#9aa3a8', snow: '#d9e6ef', blizzard: '#f4f9ff', heat: '#d08a3a', sand: '#c9a86a', monsoon: '#2f5f8f' };
const GR_COL = { mud: '#6b4a2b', deep: '#eef4fa', frozen: '#a9c7d8', flood: '#2f6f9f' };
MODES.push(['conditions', 'Conditions']);
{ const _pc = provColor; provColor = function (p) {
  if (MV.mode === 'weather' && G.wx) { const s = wxOf(p.id); let c = WX_COL[s.w]; if (s.g !== 'dry') c = mix(c, GR_COL[s.g], s.g === 'deep' || s.g === 'flood' ? 0.65 : 0.5); return c; }
  if (MV.mode === 'conditions') { const l = pmList(p); if (p.cq && p.cq.v > 0.02) l.push('_cq'); if (!l.length) return p.owner === G.player ? '#3b4a3f' : '#2a3540';
    const pri = ['flooded', 'siege', 'scorched', 'famine', 'epidemic', 'partisans', 'oilfire', '_cq', 'devastated', 'bombed', 'mined', 'dug', 'martial', 'frontline', 'refugees'], top = pri.find(x => l.includes(x)) || l[0];
    return { flooded: '#2f6f9f', siege: '#b03a2e', scorched: '#d0602a', famine: '#9a7a2a', epidemic: '#6a9a3a', partisans: '#7a3a6a', oilfire: '#3a2a2a', _cq: '#d08a3a', devastated: '#5a4a44', bombed: '#7a4a3a', mined: '#8a8a3a', dug: '#5a6a4a', martial: '#5a5a6a', frontline: '#8a5a3a', refugees: '#9a8a6a' }[top] || '#555'; }
  return _pc(p); }; }
// symbols over each region in the weather mode, and over each troubled province in the conditions mode
{ const _ow = mapWorldOverlay; mapWorldOverlay = function (ctx) { _ow(ctx); if (!G) return;
  if (MV.mode === 'weather' && G.wx) { ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const fs = Math.max(14, Math.min(26, 20 * MV.s)) / MV.s;
    for (let z = 0; z < ZONES.length; z++) { const s = G.wx.z[z], Z = ZONES[z]; if (Z.x < MV.x - 50 || Z.x > MV.x + MV.w / MV.s + 50 || Z.y < MV.y - 50 || Z.y > MV.y + MV.h / MV.s + 50) continue;
      ctx.font = `${fs}px sans-serif`; ctx.fillText(WX[s.w][1] || '·', Z.x, Z.y); if (MV.s > 0.45) { ctx.font = `600 ${fs * 0.5}px Barlow, sans-serif`; ctx.lineWidth = 3 / MV.s; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; const t = `${Math.round(s.t)}°${s.g !== 'dry' ? ' ' + GROUND[s.g][1] : ''}`; ctx.strokeText(t, Z.x, Z.y + fs * 0.8); ctx.fillStyle = '#fff'; ctx.fillText(t, Z.x, Z.y + fs * 0.8); } } }
  if (MV.mode === 'conditions' && MV.s > 0.3) { ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${13 / MV.s}px sans-serif`;
    for (const p of G.P) { const l = pmList(p).filter(x => x !== 'frontline' && x !== 'refugees'); if (!l.length) continue; const m = MAP.P[p.id]; if (m.x < MV.x || m.x > MV.x + MV.w / MV.s || m.y < MV.y || m.y > MV.y + MV.h / MV.s) continue; ctx.fillText(l.slice(0, 3).map(x => PMOD[x][1]).join(''), m.x, m.y - 12 / MV.s); } } }; }
// the province box: weather and conditions
const wxPct = v => `${v > 0 ? '+' : ''}${Math.round(v * 100)}%`;
function wxLine(p) { const s = wxOf(p.id), e = wxEff(p.id), w = WX[s.w], g = GROUND[s.g], fx = [];
  if (Math.abs(e.move - 1) > 0.01) fx.push(`marches ${wxPct(e.move - 1)}`); if (e.atk) fx.push(`attacks ${wxPct(e.atk)}`); if (e.air) fx.push(`air ${wxPct(e.air)}`); if (e.sea) fx.push('no landings'); if (e.cold) fx.push('frostbite for troops not ready for winter'); if (e.heat) fx.push('heat exhaustion');
  return `<div class="row sp"${tip(`<b>Weather in the ${zoneName(PZ[p.id])} region</b><br>${w[0]}${s.g !== 'dry' ? `, ${g[0].toLowerCase()}` : ''}, ${Math.round(s.t)}°C.<br>${fx.length ? fx.join('<br>') : 'No effect on operations.'}<br><span class="dim">Weather changes daily and drifts east with the westerlies; rain makes mud, snow lies until the thaw.</span>`)}><span>${w[1]} <b>${w[0]}</b>${s.g !== 'dry' ? ` · ${g[1]} ${g[0]}` : ''} · ${Math.round(s.t)}°C</span><span class="dim">${fx.slice(0, 2).join(', ')}</span></div>`; }
function pmLine(p) { const l = pmList(p); if (!l.length) return ''; const e = pmEff(p.id);
  return `<div class="row">${l.map(id => { const m = PMOD[id], x = m[3], t = []; if (x.out) t.push(`output ${wxPct(x.out)}`); if (x.move && x.move !== 1) t.push(`marches ${wxPct(x.move - 1)}`); if (x.atk) t.push(`attackers ${wxPct(x.atk)}`); if (x.def) t.push(`defenders ${wxPct(x.def)}`); if (x.attr) t.push(`troops lose ${(x.attr * 100).toFixed(1)}% a week`); if (x.pop) t.push(`population ${(x.pop * 100).toFixed(2)}% a month`); if (x.unrest) t.push('unrest rises');
    const until = p.pm && p.pm[id] && p.pm[id] < 1e8 ? `<br><span class="dim">Until ${dateStr(p.pm[id])}</span>` : ''; return `<span class="pill"${tip(`<b>${m[1]} ${m[0]}</b><br>${m[2]}<br>${t.join('<br>')}${until}`)}>${m[1]} ${m[0]}</span>`; }).join(' ')}</div>${e.out ? `<div class="dim">Output here ${wxPct(e.out)}</div>` : ''}`; }
{ const _rp = renderProv; renderProv = function () { _rp(); if (SEL.prov === null || !G.wx) return; const p = P(SEL.prov), el = $('provinfo'); if (!el) return; el.insertAdjacentHTML('beforeend', wxLine(p) + pmLine(p)); }; }

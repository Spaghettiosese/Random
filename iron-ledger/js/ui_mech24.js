// 2.4 interface: the Supply map mode, supply depots and the gauge in the province box, supply in the army card;
// mobilisation on the Military tab; the crown on the Nation tab.
'use strict';
MODES.push(['supply', 'Supply']);
let SUPC = { k: -1, d: null };
const supMap = () => { const k = G.day * 24 + (G.hour || 0); if (SUPC.k !== k) { const c = me(); SUPC = { k, d: c ? supDist(c) : new Map() }; } return SUPC.d; };
{ const _pc = provColor; provColor = function (p) { if (MV.mode !== 'supply') return _pc(p); const c = me(); if (!(p.ctrl === c.tag || friendly(c.tag, p.ctrl))) return atWar(c.tag, p.ctrl) ? '#4a2a2a' : '#2a3540'; const d = supMap().get(p.id);
  return d === undefined ? '#6a2a2a' : ['#3f8f55', '#9a9a3a', '#b0703a', '#a03a3a'][supLevel(d)]; }; }
{ const _ow = mapWorldOverlay; mapWorldOverlay = function (ctx) { _ow(ctx); if (!G || (MV.mode !== 'supply' && MV.s < 0.5)) return; const c = me(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${16 / MV.s}px sans-serif`;
  for (const id of c.depots || []) { const m = MAP.P[id]; ctx.fillText('📦', m.x, m.y + 14 / MV.s); }
  if (MV.mode === 'supply' && MV.s > 0.4) { ctx.font = `${11 / MV.s}px sans-serif`; for (const p of G.P) { if (!(p.b.railway > 0) || !(p.ctrl === c.tag || friendly(c.tag, p.ctrl))) continue; const m = MAP.P[p.id]; ctx.fillStyle = railFor(p, c.tag) ? '#ddd' : '#f08060'; ctx.fillText(railFor(p, c.tag) ? '═' : '≠', m.x + 12 / MV.s, m.y - 10 / MV.s); } } }; }
{ const _rp = renderProv; renderProv = function () { _rp(); if (SEL.prov === null) return; const p = P(SEL.prov), el = $('provinfo'), c = me(); if (!el) return; let add = '';
  if (p.b.railway > 0) { const g = gaugeOfProv(p), us = railFor(p, c.tag); add += `<div class="row sp"${tip('Railways carry supply far faster than roads. A railway of another gauge (the Russian broad gauge) is of no use to us until our engineers convert it, two provinces a fortnight, working out from our own track.')}><span>🛤 Railway · ${g === 'r' ? 'broad gauge' : 'standard gauge'}</span><span class="${us ? 'pos' : 'neg'}">${us ? 'usable by us' : p.ctrl === c.tag ? 'being converted' : 'not our gauge'}</span></div>`; }
  if ((p.ctrl === c.tag || friendly(c.tag, p.ctrl)) && isAtWar(c.tag)) { const d = supMap().get(p.id), lv = supLevel(d); add += `<div class="row sp"${tip(SUP_LV.map((x, i) => `${i === lv ? '<b>' : ''}${x[0]}: ${x[2] || 'full strength'}${i === lv ? '</b>' : ''}`).join('<br>') + '<br><span class="dim">Supply comes from the capital, ports, our railway hubs and our depots.</span>')}><span>📦 Supply: <b>${SUP_LV[lv][0]}</b></span><span class="dim">${d === undefined ? 'out of reach' : d.toFixed(1) + ' steps from a source'}</span></div>`; }
  if (p.ctrl === c.tag && isAtWar(c.tag)) { const has = (c.depots || []).includes(p.id); add += `<div class="row">${has ? '<span class="pill">📦 Supply depot</span>' : btn('Build a supply depot', 'depot', `data-p="${p.id}"`, 'sm', `A source of supply for armies nearby. Two weeks of income; at most ${depotCap(c)}.`, (c.depots || []).length >= depotCap(c) || c.money < 2 * wkInc(c))}</div>`; }
  if (add) el.insertAdjacentHTML('beforeend', add); }; }
{ const _ac = armyCard; armyCard = function (c, a) { const h = _ac(c, a); if (!a.sl) return h; return h.replace('<div class="row">', `<div class="${a.sl >= 2 ? 'neg' : 'warn'}">📦 Supply ${SUP_LV[a.sl][0].toLowerCase()}: ${SUP_LV[a.sl][2]}</div><div class="row">`); }; }
// mobilisation on the Military tab
function mobCard(c) { const M0 = mobOf(c), cap = mobCap(c), called = sum(armiesOf(c.tag).filter(a => a.reserve), a => a.divs.length);
  return `<div class="card"><div class="row sp"><b>🎺 Mobilisation</b><span class="dim">${MOB[M0.st][0]}${M0.next ? ` → ${MOB[M0.next.st][0]} on ${dateStr(M0.next.day)}` : ''}</span></div>
    <div class="row sp"><span${tip('Trained reservists at home. The pool refills slowly in peace, faster under stricter conscription laws.')}>Reservists</span>${bar(M0.res / Math.max(1, cap), 'g')}<span class="num">${Math.floor(M0.res)} / ${cap} divisions</span></div>
    ${called ? `<div class="dim">${called} reserve divisions are in uniform.</div>` : ''}
    <div class="row">${MOB.map((m, i) => btn(m[0], 'mobSet', `data-s="${i}"`, 'sm' + (M0.st === i ? ' on' : ''), `${m[1]}${m[2] ? `<br>Costs ${m[2]} weeks of income a month.` : ''}${i < M0.st ? '<br><span class="dim">Standing down sends the reservists home.</span>' : ''}`)).join('')}</div></div>`; }
{ const _mil = PANELS.military; PANELS.military = function (c) { const h = _mil(c); if ((UI.sub.military || 'overview') !== 'overview') return h; const k = mobCard(c), i = h.indexOf('<h3>Equipment</h3>'); return i < 0 ? h + k : h.slice(0, i) + k + h.slice(i); }; }
// the crown on the Nation tab
function crownCard(c) { const K = crownOf(c); if (!K) return ''; const age = year() - K.born, mons = alive().filter(k => k.tag !== c.tag && crownOf(k) && !K.wed.includes(k.tag) && !atWar(c.tag, k.tag));
  return `<div class="card"><div class="row sp"><b>👑 ${K.name}</b><span class="dim">House of ${K.house} · aged ${age}${K.exile ? ' · in exile' : ''}</span></div>
    <div class="row sp"><span${tip(modText(CROWN_TRAIT[K.trait][1]))}>${CROWN_TRAIT[K.trait][0]}</span><span class="dim">${K.heir ? `heir: ${K.heir}${K.heirBorn ? `, aged ${year() - K.heirBorn}` : ''}` : 'no heir'}</span></div>
    <div class="row sp"><span${tip('The standing of the crown: royal tours and weddings raise it, defeats lower it. In a monarchy it steadies the nation, or unsettles it.')}>Prestige of the crown</span>${bar(K.pres / 100, K.pres < 35 ? 'r' : 'g')}<span class="num">${Math.round(K.pres)}</span></div>
    ${K.wed.length ? `<div class="dim">Joined by marriage to ${K.wed.map(cname).join(', ')}.</div>` : ''}
    <div class="row">${btn('A royal tour', 'crownAct', 'data-k="tour"', 'sm', 'Prestige +8, stability +2. 20 political power.', c.pp < 20)}${mons.length ? `<select id="wedT" aria-label="Royal house">${mons.map(k => `<option value="${k.tag}">${crownOf(k).house} of ${k.name}</option>`).join('')}</select>${btn('A royal wedding', 'crownWed', '', 'sm', 'Opinion +25 both ways for twenty years, trust +10, prestige +5. 40 influence; they must not dislike us.', c.infl < 40)}` : ''}${K.heir ? btn('Abdicate', 'crownAct', 'data-k="abdicate"', 'sm', `${K.name} gives way to ${K.heir}. 50 political power.`, c.pp < 50) : ''}</div></div>`; }
{ const _co = PANELS.country; PANELS.country = function (c) { const h = _co(c), k = crownCard(c); if (!k) return h; const i = h.indexOf('<h3>National spirits'); return i < 0 ? h + k : h.slice(0, i) + k + h.slice(i); }; }
Object.assign(ACT, {
  depot(d) { const e = buildDepot(me(), +d.p); if (e) toast(e, 'bad'); SUPC.k = -1; MV.dirty = true; renderAll(); },
  mobSet(d) { const e = mobSet(me(), +d.s); if (e) toast(e, 'bad'); renderAll(); },
  crownAct(d) { const e = crownAct(me(), d.k); if (e) toast(e, 'bad'); renderAll(); },
  crownWed() { const t = $('wedT') && $('wedT').value; const e = crownAct(me(), 'wed', t); if (e) toast(e, 'bad'); renderAll(); }
});

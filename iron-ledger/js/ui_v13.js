// 1.3 interface: outliner, Wars screen, cabinet, offensive orders, occupation, legacy, world-news styling, hotkeys.
'use strict';
TABS.splice(TABS.findIndex(t => t[0] === 'military') + 1, 0, ['wars', '🔥', 'Wars']);
NEW_TREES.SOV = NEW_TREES.CZE = NEW_TREES.FIN = NEW_TREES.ROM = 1; delete NEW_TREES.USA; delete NEW_TREES.ENG; delete NEW_TREES.FRA;
UPDATES.unshift(['1.3', 'Eastern Front', 'The third major update.', [
  ['Soviet Union, Czechoslovakia, Finland, Romania', 'Four new focus trees. The Soviet tree covers the purge or its alternatives, the western border, the Great Patriotic War, the Five-Year Plans, and the Red Army, fleet, air force and science. Czechoslovakia can stand and fight behind its forts; Finland has its Winter War; Romania its king, its Guard and its oil.'],
  ['Every tree now has 230+ focuses', 'All national trees gain new sections: three doctrine trees with exclusive paths, a programme for every technology, national campaigns for every law, interest-group politics, relations with each great power, and development of your own provinces.'],
  ['New feature: Cabinet', 'Appoint up to three ministers and three members of the high command from the Politics tab. Each gives a standing bonus.'],
  ['New feature: Occupation and Resistance', 'Occupied provinces now pay requisitions and breed unrest. Choose a lenient, military or harsh occupation policy; garrison provinces or face sabotage and uprisings.'],
  ['New feature: Offensive Orders', 'Give selected armies an objective and a stance (Aggressive, Balanced, Careful). They fight their way there on their own, pausing to recover. Ctrl+right-click a province, or use the Orders card.'],
  ['New and unique: The Verdict of History', 'Everything you do is recorded in five ledgers — conquest, peace, works, reform, liberation. As they fill, your leader earns a name (“the Builder”, “the Conqueror”…) with lasting effects, and each January you get the Year in Review.'],
  ['World news and reaction events', 'Major events now arrive as news: wars between great powers, capitulations, annexations, civil wars. Some demand an answer — France and Britain decide what to do when the Rhineland is remilitarised or Austria annexed, and any great power may step into another\'s crisis.'],
  ['Wars screen', 'A new Wars tab lists every war in the world, who is on which side, and how it is going. The top bar always shows whether you are at war.'],
  ['Interface rework', 'An outliner on the right shows your focus, research, project, construction, wars and battles at a glance, with alerts for anything idle. Drag with the left mouse button to box-select armies; drag with the right button (or WASD/arrow keys) to move the map; keys 1–5 set game speed.'],
  ['Balance', 'France, Britain and Poland start less ready for war, and the democracies sit out a Phoney War before attacking. Countries that resolve to resist no longer yield to ultimatums.']]]);
function uiBoxSelect(b, add) {
  const x0 = Math.min(b[0], b[2]), x1 = Math.max(b[0], b[2]), y0 = Math.min(b[1], b[3]), y1 = Math.max(b[1], b[3]); if (x1 - x0 < 6 && y1 - y0 < 6) return;
  let list = armiesOf(G.player).filter(a => { const m = MAP.P[a.loc], x = (m.x - MV.x) * MV.s, y = (m.y - MV.y) * MV.s; return x >= x0 && x <= x1 && y >= y0 - 20 && y <= y1 + 6; });
  if (add) { const cur = selArmies(); list.forEach(a => cur.includes(a) || cur.push(a)); list = cur; }
  setSelection(list); if (list.length) { UI.tab = 'military'; if (UI.sub.military === 'recruit' || UI.sub.military === 'generals') UI.sub.military = 'armies'; } renderAll();
}
{ const _mc = mapClick; mapClick = function (e, right) { if (right && e.ctrlKey && selArmies().length) { const r = mapCv.getBoundingClientRect(), id = provAt(MV.x + (e.clientX - r.left) / MV.s, MV.y + (e.clientY - r.top) / MV.s); if (id !== null) ACT.orderTo({ p: id }); return; } _mc(e, right); }; }
// ---------- outliner ----------
function renderOutliner() {
  let el = $('outliner'); if (!el) { el = document.createElement('div'); el.id = 'outliner'; $('mapwrap').appendChild(el); } if (!G) return; const c = me(); if (!c) return;
  if (UI.outHide) { el.className = 'min'; el.innerHTML = btn('☰ Outliner', 'outToggle', '', 'sm'); return; } el.className = '';
  const row = (label, val, tab, cls = '') => `<div class="orow ${cls}" data-a="tab" data-t="${tab}" data-keep="1"><span>${label}</span>${val}</div>`, f = c.focus.cur ? focusById(c, c.focus.cur) : null, pj = c.proj || {}, al = [];
  if (!f) al.push(['🎯', 'No national focus', 'focus']); if (Object.keys(c.research).some(k => !c.research[k] && techAvailable(c, k).length)) al.push(['🔬', 'Idle research', 'research']); if (!pj.cur && Object.keys(PROJECTS).some(id => projectState(c, id) === 'available')) al.push(['🧪', 'No special project', 'projects']);
  if (c.money < 0 && c.budget.net < 0) al.push(['💰', 'Treasury in deficit', 'economy']); if (!c.queue.length && (c.autoBuild || 'off') === 'off') al.push(['🏗️', 'Nothing being built', 'build']); const oos = armiesOf(c.tag).filter(a => a.oos).length; if (oos) al.push(['📦', `${oos} arm${oos > 1 ? 'ies' : 'y'} out of supply`, 'military']);
  const hot = G.P.filter(p => p.ctrl === c.tag && p.owner !== c.tag && (p.unrest || 0) > 60).length; if (hot) al.push(['🔥', `Unrest in ${hot} occupied province${hot > 1 ? 's' : ''}`, 'military']);
  const wars = G.wars.filter(w => w.att.includes(c.tag) || w.def.includes(c.tag)), bats = G.battles.filter(b => b.att.some(i => G.armies[i] && G.armies[i].owner === c.tag) || armiesAt(b.prov).some(a => a.owner === c.tag));
  let h = `<div class="row sp"><b class="otitle">${wars.length ? '<span class="neg">AT WAR</span>' : 'At peace'}</b>${btn('–', 'outToggle', '', 'sm', 'Hide the outliner')}</div>`;
  if (al.length) h += `<div class="alerts">${al.map(a => `<span class="alert" data-a="tab" data-t="${a[2]}" data-keep="1"${tip(a[1])}>${a[0]}</span>`).join('')}</div>`;
  h += row(f ? `🎯 ${f.name}` : '🎯 <span class="warn">Choose a focus</span>', f ? bar(c.focus.prog / f.days) : '', 'focus');
  for (const k in c.research) { const r = c.research[k]; if (r) h += row(`🔬 ${TECHS[r.id][0]}`, bar(r.prog / techCost(r.id)), 'research'); }
  if (pj.cur) h += row(`🧪 ${PROJECTS[pj.cur][0]}`, bar(pj.prog / PROJECTS[pj.cur][3]), 'projects');
  if (c.enact) h += row(`⚖️ ${lawName(c.enact.law)}`, bar(c.enact.prog / 100), 'politics');
  c.queue.slice(0, 3).forEach(it => { h += row(`🏗️ ${BLD[it.type].name} <span class="dim">${P(it.prov).name}</span>`, bar(it.prog / BLD[it.type].cost), 'build'); });
  if (c.training.length) h += row(`🪖 ${c.training.length} division${c.training.length > 1 ? 's' : ''} in training`, '', 'military');
  for (const w of wars) { const s = warScore(w), mine = w.att.includes(c.tag) ? s.att - s.def : s.def - s.att; h += row(`⚔️ ${w.name}`, `<span class="${mine >= 0 ? 'pos' : 'neg'} num">${mine >= 0 ? '+' : ''}${(mine * 100).toFixed(0)}%</span>`, 'wars'); }
  for (const p of G.plays) if (p.a === c.tag || p.b === c.tag || p.A.includes(c.tag) || p.B.includes(c.tag)) h += row(`📜 Crisis: ${cname(p.a)} v ${cname(p.b)}`, `<span class="dim num">${Math.max(0, p.dur - (G.day - p.day))}d</span>`, 'diplomacy');
  bats.slice(0, 5).forEach(b => { const atk = b.att.some(i => G.armies[i] && G.armies[i].owner === c.tag); h += `<div class="orow" data-a="goProv" data-p="${b.prov}"><span>💥 ${P(b.prov).name}</span>${bar(atk ? b.bal : 1 - b.bal, (atk ? b.bal : 1 - b.bal) >= 0.5 ? 'g' : 'r')}</div>`; });
  const ord = armiesOf(c.tag).filter(a => a.order).length; if (ord) h += row(`⚑ ${ord} arm${ord > 1 ? 'ies' : 'y'} under orders`, '', 'military');
  el.innerHTML = h;
}
// ---------- wars screen ----------
PANELS.wars = function (c) {
  const mine = w => w.att.includes(c.tag) || w.def.includes(c.tag), list = G.wars.slice().sort((a, b) => mine(b) - mine(a) || b.att.length + b.def.length - a.att.length - a.def.length);
  const side = (tags, w) => tags.map(t => { const k = C(t); return `<span class="pill${t === c.tag ? ' me' : ''}${k.capitulated ? ' gone' : ''}" data-a="diploSel" data-t="${t}" style="cursor:pointer"${tip(`${k.name}${k.capitulated ? ' — capitulated' : ''}<br>${k._ndiv || 0} divisions · war exhaustion ${k.warExh.toFixed(0)}`)}>${flag(t, 1)} ${k.name}</span>`; }).join(' ');
  let h = `<div class="card ${list.some(mine) ? 'hl' : ''}"><b>${list.some(mine) ? `<span class="neg">${c.name} is at war</span>` : `${c.name} is at peace`}</b><span class="dim">${list.some(mine) ? `Enemies: ${enemiesOf(c.tag).map(cname).join(', ')}` : 'No nation is at war with us.'} World tension ${G.tension.toFixed(0)}%.</span></div>`;
  if (G.plays.length) h += '<h3>Crises</h3>' + G.plays.map(p => `<div class="card">${cn(p.a)} demands that ${cn(p.b)} ${GOAL_TXT(p.goal)}<div class="dim">${p.A.map(cname).join(', ')} against ${p.B.map(cname).join(', ')} · ${Math.max(0, p.dur - (G.day - p.day))} days left</div></div>`).join('');
  h += `<h3>Wars of the world (${list.length})</h3>` + (list.map(w => { const s = warScore(w), days = G.day - w.start, im = mine(w), casA = sum(w.att, t => C(t).casualties), casD = sum(w.def, t => C(t).casualties);
    return `<div class="card${im ? ' hl' : ''}"><div class="row sp"><h4>${w.name}</h4><span class="dim">since ${dateStr(w.start)} · ${days < 60 ? days + ' days' : (days / 30).toFixed(0) + ' months'}</span></div>
      <div class="warsides"><div><div class="dim">Attackers</div>${side(w.att, w)}</div><div><div class="dim">Defenders</div>${side(w.def, w)}</div></div>
      <div class="row"><span class="num">${(s.att * 100).toFixed(0)}%</span><span class="tug"><i style="width:${clamp(50 + (s.att - s.def) * 50, 3, 97)}%"></i></span><span class="num">${(s.def * 100).toFixed(0)}%</span></div><div class="dim">Share of the enemy's territory each side holds. Casualties so far: ${fmt(casA * 1000)} / ${fmt(casD * 1000)}.</div>
      ${w.goals.filter(g => G.C[g.by] && G.C[g.vs]).slice(0, 4).map(g => `<div class="dim">• ${cname(g.by)} wants ${cname(g.vs)} to ${GOAL_TXT(g)}</div>`).join('')}</div>`; }).join('') || '<div class="dim">The world is at peace. It will not last.</div>');
  return h;
};
// ---------- cabinet ----------
{ const _pol = PANELS.politics; PANELS.politics = function (c) {
  const cab = cabinetOf(c), seat = role => { const mine = cab.filter(id => MINISTERS[id][1] === role), free = Object.keys(MINISTERS).filter(id => MINISTERS[id][1] === role && !cab.includes(id));
    return `<h4>${role === 'pol' ? 'Ministers' : 'High command'} (${mine.length}/3)</h4>` + mine.map(id => `<div class="row sp"><span${tip(modText(MINISTERS[id][2]))}>✦ ${MINISTERS[id][0]}</span>${btn('Dismiss', 'dismiss', `data-m="${id}"`, 'sm')}</div>`).join('') + `<div class="row">${free.map(id => { const why = ministerBlock(c, id); return btn(MINISTERS[id][0], 'appoint', `data-m="${id}"`, 'sm', `${modText(MINISTERS[id][2])}<br><span class="dim">80 political power</span>${why ? `<br><span class="neg">${why}</span>` : ''}`, !!why); }).join('')}</div>`; };
  return _pol(c) + `<h3>Cabinet</h3><div class="dim">Appoint up to three ministers and three members of the high command. Each costs 80 political power and gives a standing bonus.</div>${seat('pol')}${seat('mil')}`; }; }
// ---------- military: orders and occupation ----------
{ const _mil = PANELS.military; PANELS.military = function (c) {
  let h = _mil(c); const sel = selArmies();
  if (sel.length) { const st = (sel[0].order && sel[0].order.st) || UI.stance || 'bal', tgt = SEL.prov !== null && sel.some(a => a.loc !== SEL.prov) ? SEL.prov : null, ords = sel.filter(a => a.order);
    const card = `<div class="card"><div class="row sp"><b>⚑ Offensive orders</b>${ords.length ? btn('Cancel orders', 'orderCancel', '', 'sm') : ''}</div><div class="row"><span class="dim">Stance</span>${Object.keys(STANCE).map(k => btn(STANCE[k][0], 'stance', `data-s="${k}"`, 'sm' + (st === k ? ' on' : ''), { agg: 'Attacks at poor odds and with tired troops. Fast and costly.', bal: 'Attacks when the odds are fair.', care: 'Waits for clear superiority and rested troops.' }[k])).join('')}</div>
      ${tgt !== null ? btn(`Advance on ${P(tgt).name}`, 'orderTo', `data-p="${tgt}"`, 'pri sm', 'The selected armies fight their way to this province on their own') : '<span class="dim">Select a province and press Advance, or Ctrl+right-click it on the map.</span>'}
      ${ords.length ? `<div class="dim">${ords.slice(0, 4).map(a => `${esc(a.name)} → ${P(a.order.to).name}`).join(' · ')}${ords.length > 4 ? '…' : ''}</div>` : ''}</div>`;
    h = h.replace('</div>', '</div>' + card); }
  if (UI.sub.military === 'overview') { const n = G.P.filter(p => p.ctrl === c.tag && p.owner !== c.tag && !friendly(c.tag, p.owner)).length, pol = occPolicy(c);
    h = h.replace('<h3>Equipment</h3>', `<h3>Occupation policy</h3><div class="row">${Object.keys(OCC).map(k => btn(OCC[k][0], 'occ', `data-k="${k}"`, 'sm' + (pol === k ? ' on' : ''), OCC[k][3])).join('')}</div><div class="dim">${n ? `${n} occupied province${n > 1 ? 's' : ''} yield${n > 1 ? '' : 's'} ${fmt(c.occYield || 0)} a week. Garrison them: unrest above 60 means sabotage, and at 100 an ungarrisoned province rises.` : 'We occupy no foreign territory.'}</div><h3>Equipment</h3>`); }
  return h; }; }
// ---------- legacy on the nation page ----------
{ const _co = PANELS.country; PANELS.country = function (c) {
  const l = legacyOf(c), led = `<h3>The verdict of history</h3><div class="card"><b>${verdict(c)}</b>${Object.keys(LEGACY).map(k => { const lv = l.lv[k] || 0, next = LEG_STEPS[lv]; return `<div class="row"${tip(`<b>${LEGACY[k][0]}</b><br>${LEGACY[k][2].map((t, i) => `${i < lv ? '✔' : '·'} ${LEG_STEPS[i]}: ${t[0]}`).join('<br>')}`)}><span style="width:112px">${LEGACY[k][1]} ${LEGACY[k][0]}</span>${bar(next ? l[k] / next : 1, lv ? 'g' : '')}<span class="num dim">${l[k].toFixed(0)}${next ? '/' + next : ''}</span></div>`; }).join('')}
    <div class="dim">${l.chron.slice(-4).reverse().map(e => `${dateStr(e.d)}: ${e.text}`).join('<br>') || 'The chronicle is still blank.'}</div></div>`;
  return _co(c).replace('<h3>National spirits', led + '<h3>National spirits'); }; }
{ const _rp = renderProv; renderProv = function () { _rp(); renderOutliner(); if (SEL.prov === null) return; const p = P(SEL.prov), el = $('provinfo'), b = G.battles.find(x => x.prov === p.id); let add = '';
  if (p.unrest) add += `<div class="row"><span class="${p.unrest > 60 ? 'neg' : 'warn'}"${tip('Resistance to occupation. Garrison divisions bring it down; harsh policies drive it up.')}>Unrest</span>${bar(p.unrest / 100, p.unrest > 60 ? 'r' : '')}<span class="num">${p.unrest.toFixed(0)}</span></div>`;
  if (b) { const att = b.att.map(i => G.armies[i]).filter(Boolean), def = armiesAt(p.id).filter(a => att.length && atWar(att[0].owner, a.owner)); add += `<div class="card"><b>💥 Battle, day ${Math.max(1, Math.round(b.days))}</b><div class="row"><span>${att.length ? cn(att[0].owner) : ''} ${sum(att, a => a.divs.length)} div</span><span class="tug"><i style="width:${clamp(b.bal * 100, 3, 97)}%"></i></span><span>${sum(def, a => a.divs.length)} div ${def.length ? cn(def[0].owner) : ''}</span></div></div>`; }
  if (add) el.insertAdjacentHTML('beforeend', add); }; }
{ const _rt = renderTop; renderTop = function () { _rt(); const c = me(), war = isAtWar(c.tag), w = $('topbar').querySelector('.who'); if (w) w.insertAdjacentHTML('afterend', `<span class="warchip ${war ? 'war' : ''}" data-a="tab" data-t="wars" data-keep="1"${tip(war ? 'At war with ' + enemiesOf(c.tag).map(cname).join(', ') : 'We are at peace. Click for the wars of the world.')}>${war ? '⚔ AT WAR' : '🕊 PEACE'}</span>`); }; }
{ const _sp = showPopup; showPopup = function () { _sp(); const d = $('modal').querySelector('.dialog'); if (d && UI.popups[0] && UI.popups[0].news) d.classList.add('news'); }; }
Object.assign(ACT, {
  outToggle() { UI.outHide = !UI.outHide; renderOutliner(); },
  goProv(d) { SEL.prov = +d.p; mapCenter(+d.p, 0.6); renderAll(); },
  appoint(d) { if (appoint(me(), d.m)) toast(`${MINISTERS[d.m][0]} joins the government.`, 'good'); renderAll(); },
  dismiss(d) { dismiss(me(), d.m); renderAll(); },
  stance(d) { UI.stance = d.s; selArmies().forEach(a => { if (a.order) a.order.st = d.s; }); renderPanel(); },
  orderTo(d) { const l = selArmies(), id = +d.p; if (!l.length) return; let n = 0; for (const a of l) if (a.loc !== id) { setOrder(a, id, UI.stance || 'bal'); n++; } if (n) toast(`${n} arm${n > 1 ? 'ies' : 'y'} ordered to advance on ${P(id).name} (${STANCE[UI.stance || 'bal'][0].toLowerCase()}).`, 'mil'); renderAll(); },
  orderCancel() { selArmies().forEach(a => { delete a.order; }); renderAll(); },
  occ(d) { me().occ = d.k; renderPanel(); },
  menu() { UIH.popup({ title: 'Iron Ledger 1936', icon: '☰', desc: `Version ${VERSION}. Historical AI is <b>${G.historical ? 'on' : 'off'}</b>; world news popups are <b>${G.news === false ? 'off' : 'on'}</b>. The game autosaves every six months in this browser.`, options: [{ name: 'Resume' }, { name: 'Save game', fn: () => saveGame() }, { name: 'Load saved game', fn: () => ACT.loadGame() }, { name: `Turn world news popups ${G.news === false ? 'on' : 'off'}`, fn: () => { G.news = G.news === false; } }, { name: `Turn historical AI ${G.historical ? 'off' : 'on'}`, fn: () => { G.historical = !G.historical; } }, { name: 'Quit to the main menu', fn: () => { G.paused = true; MENU.screen = 'main'; startScreen(); } }] }); }
});
document.addEventListener('keydown', e => { if (!G || !UI.started || !$('start').hidden || UI.popups.length || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key >= '1' && e.key <= '5') { G.speed = +e.key; renderTop(); } const step = 90 / MV.s, k = e.key.toLowerCase();
  if (k === 'w' || k === 'arrowup') MV.y -= step; else if (k === 's' || k === 'arrowdown') MV.y += step; else if (k === 'a' || k === 'arrowleft') MV.x -= step; else if (k === 'd' || k === 'arrowright') MV.x += step; else return; clampView(); MV.dirty = true; });

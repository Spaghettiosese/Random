// User interface: top bar, panels, popups and the main loop.
'use strict';
const UI = { tab: null, sub: { economy: 'budget', military: 'overview' }, focusSel: null, diploSel: null, popups: [], lawOpen: null, started: false, acc: 0, last: 0, lastPanel: 0 };
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tip = h => h ? ` data-tip="${esc(h)}"` : '';
const flag = (t, sm) => `<span class="flag${sm ? ' sm' : ''}" style="background:${(G.C[t] || {}).color || '#888'}"></span>`;
const cn = t => `${flag(t, 1)} ${cname(t)}`;
const btn = (label, a, data = '', cls = '', tp = '', dis = false) => `<button class="${cls}" data-a="${a}" ${data}${tip(tp)}${dis ? ' disabled' : ''}>${label}</button>`;
const bar = (v, cls = '') => `<span class="bar ${cls}"><i style="width:${clamp(v * 100, 0, 100)}%"></i></span>`;
const me = () => C(G.player);
const SPEED_MS = [0, 420, 180, 70, 25, 8]; // milliseconds per game hour
const TABS = [['country', '🏛️', 'Nation'], ['politics', '⚖️', 'Politics'], ['economy', '💰', 'Economy'], ['build', '🏗️', 'Build'], ['focus', '🎯', 'Focus'], ['decisions', '📜', 'Decide'], ['research', '🔬', 'Research'], ['projects', '🧪', 'Projects'], ['military', '⚔️', 'Military'], ['diplomacy', '🌐', 'Diplo'], ['log', '📰', 'News']];

// ---------- start screen ----------
function boot() {
  $('start').hidden = true; claimCache(); warCache();
  UIH.notify = toast; UIH.popup = p => { UI.popups.push(p); showPopup(); }; UIH.mapDirty = () => { MV.dirty = true; MV.labels = null; }; UIH.refresh = renderPanel;
  if (!UI.started) { mapInit(); UI.started = true; requestAnimationFrame(loop); }
  $('tabs').innerHTML = TABS.map(t => `<button data-a="tab" data-t="${t[0]}"${tip(t[2])}>${t[1]}<small>${t[2]}</small></button>`).join('');
  SEL.prov = null; SEL.army = null; UI.tab = 'country'; mapCenter(me().capital, 0.55); renderAll();
}
function loop(ts) {
  requestAnimationFrame(loop); if (!G) return; const dt = Math.min(500, ts - (UI.last || ts)); UI.last = ts; let ticked = false;
  if (!G.paused && !UI.popups.length && G.speed > 0) { UI.acc += dt; const ms = SPEED_MS[G.speed]; let n = 0; while (UI.acc >= ms && n < 8) { UI.acc -= ms; n++; try { hourTick(); } catch (e) { console.error(e); G.paused = true; toast('Simulation error: ' + e.message, 'bad'); break; } ticked = true; if (UI.popups.length) break; } if (UI.acc > ms * 8) UI.acc = 0;
    if (ticked && G.hour === 0 && dateObj(G.day).getUTCDate() === 1 && dateObj(G.day).getUTCMonth() % 6 === 0 && UI.saved !== G.day) { UI.saved = G.day; saveGame(true); } }
  if (ticked) { if (ts - (UI.lastTop || 0) > 110) { renderTop(); UI.lastTop = ts; MV.dirty = true; } if (ts - UI.lastPanel > 700 && !document.querySelector('#panel select:focus')) { renderPanel(); renderProv(); UI.lastPanel = ts; } }
  if (MV.dirty) mapDraw();
}
function renderAll() { renderTop(); renderPanel(); renderProv(); MV.dirty = true; }
function toast(text, kind = 'info') { const t = $('toasts'); if (!t) return; const d = document.createElement('div'); d.className = 'toast ' + kind; d.innerHTML = text; t.prepend(d); while (t.children.length > 6) t.lastChild.remove(); setTimeout(() => d.remove(), 9000); }
function showPopup() {
  const m = $('modal'); if (!UI.popups.length) { m.hidden = true; return; } const p = UI.popups[0]; m.hidden = false;
  m.innerHTML = `<div class="dialog"><div class="row"><span class="ico">${p.icon || '📜'}</span><h2>${p.title}</h2></div><div>${p.desc}</div><div class="opts">${p.options.map((o, i) => `<button data-a="popup" data-i="${i}"${tip(o.tip)}>${o.name}${o.tip ? `<div class="dim sub">${o.tip}</div>` : ''}</button>`).join('')}</div></div>`;
}
// ---------- top bar ----------
function renderTop() {
  const c = me(), B = c.budget, f = c.focus.cur ? focusById(c, c.focus.cur) : null, mp = maxManpower(c);
  const r = (ico, val, tp, cls = '') => `<span${tip(tp)} class="${cls}">${ico} <b>${val}</b></span>`;
  $('topbar').innerHTML = `<div class="who" data-a="tab" data-t="country">${flag(c.tag)}${c.name}</div><div class="res">
    ${r('🏛️', Math.floor(c.pp), `<b>Political power</b><br>Spent on laws, decisions and government reshuffles.<br>Daily gain: ${(Math.max(0.15, 0.55 + c.legit / 180 + M(c, 'pp'))).toFixed(2)}`)}
    ${r('🤝', Math.floor(c.infl), '<b>Influence</b><br>Spent on diplomatic actions and plays.')}
    ${r('⚖️', c.stab.toFixed(0) + '%', '<b>Stability</b><br>Driven by legitimacy, living standards and radicals. Low stability cuts output and invites coups.', c.stab < 30 ? 'neg' : '')}
    ${r('🔥', c.ws.toFixed(0) + '%', '<b>War support</b><br>Needed for conscription and mobilisation laws; raises the will to fight on.')}
    ${r('👥', fmt(c.manpower * 1000), `<b>Manpower</b><br>Available recruits. Conscriptable population: ${fmt(mp * 1000)}`)}
    ${r('💰', fmt(c.money), `<b>Treasury</b><br>Weekly balance: ${fmt(B.net || 0)}<br>Income ${fmt(B.income || 0)} · Expenses ${fmt(B.expense || 0)}`, c.money < 0 ? 'neg' : '')}
    <span class="${(B.net || 0) < 0 ? 'neg' : 'pos'}">${(B.net || 0) >= 0 ? '+' : ''}${fmt(B.net || 0)}/wk</span>
    ${r('🪖', c._ndiv || 0, '<b>Divisions</b> in the field')}
    ${r('🌡️', G.tension.toFixed(0) + '%', '<b>World tension</b><br>Rises with aggression. Democracies need tension to act.', G.tension > 60 ? 'warn' : '')}
    <span data-a="tab" data-t="focus" style="cursor:pointer" class="${f ? '' : 'warn'}">🎯 ${f ? `${f.name} <span class="dim">${c.focus.prog}/${f.days}</span>` : 'No national focus!'}</span></div>
    <div id="clock"><span class="date"><span class="hour">${String(G.hour || 0).padStart(2, '0')}:00</span> ${dateStr()}</span>${btn(G.paused ? '▶' : '⏸', 'pause', '', G.paused ? 'pri' : '', 'Pause / resume (Space)')}${btn('−', 'speed', 'data-d="-1"', 'sm')}<span class="num"${tip('Game speed')}>${'▮'.repeat(G.speed)}${'▯'.repeat(5 - G.speed)}</span>${btn('+', 'speed', 'data-d="1"', 'sm')}${btn('☰', 'menu', '', '', 'Save, load and options')}</div>`;
  const pj = c.proj || {}; const dots = { projects: !pj.cur && Object.keys(PROJECTS).some(id => projectState(c, id) === 'available'), focus: !c.focus.cur && focusTree(c).some(x => focusState(c, x) === 'available'), research: Object.keys(c.research).some(k => !c.research[k] && techAvailable(c, k).length), build: !c.queue.length && c.money > 0, politics: !c.enact && c.pp > 300 };
  document.querySelectorAll('#tabs button').forEach(b => { b.classList.toggle('on', b.dataset.t === UI.tab); let d = b.querySelector('.dot'); if (dots[b.dataset.t] && !d) b.insertAdjacentHTML('beforeend', '<span class="dot"></span>'); else if (!dots[b.dataset.t] && d) d.remove(); });
}
// ---------- panels ----------
function renderPanel() {
  const p = $('panel'); if (!UI.tab) { p.hidden = true; return; } p.hidden = false; const st = p.scrollTop, tr = p.querySelector('.tree'), ts = tr ? [tr.scrollLeft, tr.scrollTop] : null;
  p.classList.toggle('wide', UI.tab === 'focus');
  p.innerHTML = `<div class="row"><h2>${TABS.find(t => t[0] === UI.tab)[2] === 'Diplo' ? 'Diplomacy' : ({ country: me().name, build: 'Construction', decisions: 'Decisions', projects: 'Special Projects', log: 'World News', focus: 'National Focus' })[UI.tab] || TABS.find(t => t[0] === UI.tab)[2]}</h2>${btn('✕', 'tab', `data-t="${UI.tab}"`, 'close sm')}</div>` + PANELS[UI.tab](me());
  p.scrollTop = st; const tr2 = p.querySelector('.tree'); if (tr2 && ts) { tr2.scrollLeft = ts[0]; tr2.scrollTop = ts[1]; }
}
const supBar = c => `<div class="pie"${tip(Object.keys(IDEO).map(i => `${IDEO[i][0]}: ${c.sup[i].toFixed(0)}%`).join('<br>'))}>${Object.keys(IDEO).map(i => `<i style="width:${c.sup[i]}%;background:${IDEO[i][1]}"></i>`).join('')}</div>`;
const spiritChips = c => c.spirits.map(s => `<span class="spirit"${tip(`<b>${s.name}</b><br><i>${s.desc}</i><br>${modText(s.eff)}${s.until ? `<br><span class="dim">Until ${dateStr(s.until)}</span>` : ''}`)}>✦ ${s.name}</span>`).join(' ') || '<span class="dim">None</span>';
function countryCard(c) {
  const f = factionOf(c.tag), subs = alive().filter(k => k.overlord === c.tag), wars = G.wars.filter(w => w.att.includes(c.tag) || w.def.includes(c.tag));
  return `<div class="card"><div class="row">${flag(c.tag)}<h4>${c.name}</h4><span class="pill" style="background:${IDEO[c.ideology][1]}">${IDEO[c.ideology][0]}</span>${c.major ? '<span class="pill">Major power</span>' : ''}${c.capitulated ? '<span class="pill neg">Capitulated</span>' : ''}</div>
    <div>${c.leader} · <span class="dim">${c.party}</span></div><div class="dim">${LAWS.gov.laws[c.laws.gov][0]}, ${LAWS.power.laws[c.laws.power][0]}, ${LAWS.econ.laws[c.laws.econ][0]}</div>${supBar(c)}
    <div class="kv"><span>Population</span><span>${fmt(c.stats.pop * 1000)}</span><span>GDP (annual)</span><span>${fmt(c.gdp * 1000)}</span><span>Standard of living</span><span>${c.sol.toFixed(1)}</span><span>Literacy</span><span>${(c.lit * 100).toFixed(0)}%</span><span>Stability / War support</span><span>${c.stab.toFixed(0)}% / ${c.ws.toFixed(0)}%</span><span>Divisions · Aircraft · Warships</span><span>${c._ndiv || 0} · ${fmt(c.stock.aircraft)} · ${fmt(c.stock.ships)}</span><span>Infamy</span><span>${c.infamy.toFixed(0)}</span></div>
    ${c.overlord ? `<div>Subject of ${cn(c.overlord)}</div>` : ''}${subs.length ? `<div>Subjects: ${subs.map(s => cn(s.tag)).join(', ')}</div>` : ''}${f ? `<div>Faction: <b>${f.name}</b> <span class="dim">(${f.members.map(cname).join(', ')})</span></div>` : ''}
    ${wars.map(w => { const s = warScore(w); return `<div class="neg">⚔ ${w.name}: ${w.att.slice(0, 4).map(cname).join(', ')}${w.att.length > 4 ? '…' : ''} vs ${w.def.slice(0, 4).map(cname).join(', ')}${w.def.length > 4 ? '…' : ''} <span class="dim">(occupied ${(s.att * 100).toFixed(0)}% / ${(s.def * 100).toFixed(0)}%)</span></div>`; }).join('')}</div>`;
}
const PANELS = {
  country(c) {
    const rank = alive().sort((a, b) => score(b) - score(a));
    return countryCard(c) + `<h3>National spirits</h3><div class="row">${spiritChips(c)}</div>
      <h3>Great powers</h3><table><tr><th>#</th><th>Nation</th><th class="r">Industry</th><th class="r">Army</th><th class="r">Fleet</th></tr>${rank.slice(0, 10).map((k, i) => `<tr class="click" data-a="diploSel" data-t="${k.tag}"><td>${i + 1}</td><td>${cn(k.tag)}</td><td class="r">${k.stats.levels || 0}</td><td class="r">${k._ndiv || 0}</td><td class="r">${fmt(k.stock.ships)}</td></tr>`).join('')}</table>
      <h3>How to play</h3><div class="dim">Pick a <b>Focus</b>, keep <b>Research</b> busy, queue <b>Construction</b>, and watch the budget. Click an army counter to select it, then right-click a province (or use “Move here”) to march. Armies on <b>Auto</b> are run by your general staff.</div>`;
  },
  politics(c) {
    const e = c.enact; let h = `<div class="kv"><span${tip('Clout of the governing interest groups, the form of government and popular support.')}>Legitimacy</span><span>${c.legit.toFixed(0)} ${bar(c.legit / 100)}</span><span${tip('Radicals grow when living standards fall or taxes bite, and drag down stability.')}>Radicals</span><span>${(c.rad * 100).toFixed(0)}%</span>${hasElections(c) ? `<span>Next election</span><span>${dateStr(c.nextElection)}</span>` : ''}</div>${supBar(c)}
      <h3>Interest groups</h3><table><tr><th>Group</th><th class="r">Clout</th><th>Approval</th><th></th></tr>${IG_IDS.map(g => { const o = c.ig[g]; return `<tr><td>${IGS[g][1]} ${IGS[g][0]}</td><td class="r">${(o.share || 0).toFixed(0)}%</td><td class="${o.appr > 2 ? 'pos' : o.appr < -2 ? 'neg' : ''}">${o.appr > 0 ? '+' : ''}${o.appr.toFixed(0)} ${o.appr > 5 ? 'Loyal' : o.appr < -8 ? 'Angry' : o.appr < -3 ? 'Unhappy' : ''}</td><td class="r">${btn(o.gov ? 'In government' : 'Opposition', 'gov', `data-g="${g}"`, 'sm' + (o.gov ? ' on' : ''), 'Reshuffle the government: 25 political power')}</td></tr>`; }).join('')}</table>`;
    if (e) h += `<div class="card hl"><div class="row sp"><b>Debating: ${lawName(e.law)}</b>${btn('Withdraw', 'lawCancel', '', 'sm')}</div><div class="row">${bar(e.prog / 100)}<span>${lawChance(c, e.cat, e.law).toFixed(0)}% to pass</span></div></div>`;
    h += '<h3>Laws</h3>';
    for (const cat in LAWS) { const L = LAWS[cat], cur = L.laws[c.laws[cat]], open = UI.lawOpen === cat;
      h += `<div class="card"><div class="row sp" data-a="lawOpen" data-c="${cat}" style="cursor:pointer"><span><span class="dim">${L.name}:</span> <b${tip(modText(cur[1]) || 'No effects')}>${cur[0]}</b></span><span>${open ? '▾' : '▸'}</span></div>`;
      if (open) for (const l in L.laws) { if (l === c.laws[cat]) continue; const d = L.laws[l], why = lawAllowed(c, cat, l), st = IG_IDS.filter(g => d[2][g]).map(g => `<span class="${d[2][g] > 0 ? 'pos' : 'neg'}">${IGS[g][1]}${d[2][g] > 0 ? '+' : ''}${d[2][g]}</span>`).join(' ');
        h += `<div class="row sp"><span${tip(`<b>${d[0]}</b><br>${modText(d[1]) || 'No direct effects'}${st ? '<br>Interest groups: ' + st : ''}`)}>${d[0]} <span class="dim">${L.instant ? '' : lawChance(c, cat, l).toFixed(0) + '%'}</span></span>${btn(L.instant ? 'Enact (100 🏛️)' : 'Propose (50 🏛️)', 'law', `data-c="${cat}" data-l="${l}"`, 'sm', why, !!why)}</div>`; }
      h += '</div>'; }
    return h;
  },
  economy(c) {
    const s = UI.sub.economy, B = c.budget, st = c.stats; let h = `<div class="subtabs">${[['budget', 'Budget'], ['market', 'Market'], ['industry', 'Industry']].map(x => btn(x[1], 'sub', `data-k="economy" data-v="${x[0]}"`, s === x[0] ? 'on' : '')).join('')}</div>`;
    if (s === 'budget') {
      const line = (n, v, tp) => `<span${tip(tp)}>${n}</span><span class="${v < 0 ? 'neg' : ''}">${fmt(v)}</span>`;
      h += `<div class="kv"><span>GDP (annual)</span><span>${fmt(c.gdp * 1000)}</span><span>GDP per head</span><span>${(c.gdp / Math.max(1, st.pop)).toFixed(0)}</span><span${tip('Wage earners and their families')}>Living standard, towns</span><span>${(c.solM || 0).toFixed(1)}</span><span${tip('Subsistence farmers')}>Living standard, countryside</span><span>${(c.solP || 0).toFixed(1)}</span><span>Workforce in industry</span><span>${st.wf ? (100 * st.emp / st.wf).toFixed(0) : 0}%</span><span>Investment pool</span><span>${fmt(c.invPool)}</span></div>
        <h3>Weekly budget</h3><div class="kv">${line('Taxes', B.tax, 'Income and profit taxes, scaled by tax efficiency (government offices).')}${line('Tariffs', B.tariff)}${line('State enterprises', B.state)}${line('Tribute', B.tribute)}<b>Income</b><b>${fmt(B.income)}</b>
        ${line('Administration', -B.gov, 'Wages of offices, universities, railways and ports.')}${line('Army pay', -B.army)}${line('Arms procurement', -B.procure, 'The state buys the whole output of the war industries.')}${line('Construction', -B.constr)}${line('Welfare', -B.welfare)}${line('Interest', -B.interest)}<b>Balance</b><b class="${B.net < 0 ? 'neg' : 'pos'}">${fmt(B.net)}</b></div>
        <h3>Tax level</h3><div class="row">${TAX_NAME.map((n, i) => btn(n, 'tax', `data-i="${i}"`, 'sm' + (c.taxLevel === i ? ' on' : ''), `${(TAX_RATE[i] * 100).toFixed(0)}% — higher taxes breed radicals`)).join('')}</div>
        <h3>War industry output</h3><div class="row">${[0.25, 0.5, 0.75, 1].map(v => btn(v * 100 + '%', 'milprod', `data-v="${v}"`, 'sm' + (Math.abs(c.milProd - v) < 0.13 ? ' on' : ''), 'Throttle arms factories to save money in peacetime')).join('')}</div>`;
    } else if (s === 'market') {
      h += `<table><tr><th>Good</th><th class="r">Price</th><th class="r">Supply</th><th class="r">Demand</th><th class="r">Trade</th><th class="r">World</th></tr>${GOOD_IDS.map(g => { const m = c.market[g], r = m.p / GOODS[g][1], net = m.imp - m.exp; return `<tr><td>${GOOD_ICON[g]} ${GOODS[g][0]}</td><td class="r ${r > 1.25 ? 'neg' : r < 0.75 ? 'pos' : ''}"${tip(`Base price ${GOODS[g][1]}`)}>${m.p.toFixed(0)} <span class="dim">${pct(r - 1)}</span></td><td class="r">${fmt(m.s)}</td><td class="r">${fmt(m.d)}</td><td class="r ${net > 0.5 ? 'warn' : ''}">${net > 0.5 ? '▼' + fmt(net) : net < -0.5 ? '▲' + fmt(-net) : '–'}</td><td class="r dim">${G.wp[g] ? G.wp[g].p.toFixed(0) : ''}</td></tr>`; }).join('')}</table><div class="dim">▼ imports, ▲ exports. Expensive goods are in shortage: build what makes them, or open trade. Trade policy: <b>${LAWS.trade.laws[c.laws.trade][0]}</b>${c.blockade ? ' · <span class="neg">Blockaded!</span>' : ''}</div>`;
    } else {
      h += `<table><tr><th>Building</th><th class="r">Levels</th><th class="r">Use</th><th class="r">Profit/wk</th><th>Method</th></tr>${BLD_IDS.filter(t => c.bt[t]).map(t => { const o = c.bt[t], d = BLD[t], pms = d.pms.map((pm, i) => ({ pm, i })).filter(x => !x.pm[1] || c.techs[x.pm[1]] || t === 'synth');
        return `<tr><td${tip(`<b>${d.name}</b><br>${pmText(d.pms[c.pm[t] || 0])}`)}>${d.name}</td><td class="r">${o.lv}</td><td class="r">${(100 * o.th / Math.max(0.01, o.lv)).toFixed(0)}%</td><td class="r ${o.profit < 0 ? 'neg' : ''}">${fmt(o.profit || 0)}</td><td>${pms.length > 1 ? `<select id="pm_${t}" data-ch="pm" data-t="${t}">${pms.map(x => `<option value="${x.i}"${(c.pm[t] || 0) === x.i ? ' selected' : ''}>${x.pm[0]}</option>`).join('')}</select>` : `<span class="dim">${pms[0].pm[0]}</span>`}</td></tr>`; }).join('')}</table>`;
    }
    return h;
  },
  build(c) {
    const sp = SEL.prov !== null && P(SEL.prov).owner === c.tag && P(SEL.prov).ctrl === c.tag ? P(SEL.prov) : null, rec = buildOptions(c).slice(0, 5);
    const q = (list, priv) => list.map((it, i) => `<div class="row sp"><span>${BLD[it.type].name} <span class="dim">in ${P(it.prov).name}</span></span><span class="row">${bar(it.prog / BLD[it.type].cost)}${priv ? '' : btn('✕', 'unqueue', `data-i="${i}"`, 'sm')}</span></div>`).join('') || '<span class="dim">Empty</span>';
    let h = `<div class="kv"><span${tip('From Construction Sectors. Shared between the state queue and private investors.')}>Construction points / week</span><span>${(c.stats.cpts * (1 + M(c, 'build'))).toFixed(0)}</span></div><h3>State queue</h3>${q(c.queue)}<h3>Private investors</h3>${q(c.pq, true)}
      <h3>Most profitable</h3>${rec.map(o => `<div class="row sp"><span>${BLD[o.type].name} <span class="dim">in ${P(o.prov).name}</span></span>${btn('Build', 'build', `data-t="${o.type}" data-p="${o.prov}"`, 'sm')}</div>`).join('') || '<span class="dim">Nothing stands out.</span>'}
      <h3>All buildings ${sp ? `<span class="dim" style="text-transform:none">— site: ${sp.name}</span>` : ''}</h3><div class="dim">Select one of your provinces on the map to build there, or let the planners choose the site.</div>`;
    for (const cat in CAT_NAME) { h += `<h4>${CAT_NAME[cat]}</h4>`; for (const t of BLD_IDS) { const d = BLD[t]; if (d.cat !== cat || (d.tech && !c.techs[d.tech])) continue; const okHere = sp && canBuild(c, t, sp);
        h += `<div class="row sp"><span${tip(`<b>${d.name}</b> — ${d.cost} construction<br>${pmText(d.pms[c.pm[t] || 0])}${d.res ? '<br>Needs ' + d.res + ' deposits' : ''}${d.coastal ? '<br>Coastal only' : ''}${t === 'railway' ? '<br>+8 infrastructure; faster movement' : t === 'admin' ? '<br>+10 bureaucracy (tax efficiency)' : t === 'university' ? '<br>+3 innovation' : t === 'construction' ? `<br>+${CONSTR_PTS[c.pm[t] || 0]} construction points` : ''}`)}>${d.name} <span class="dim">${(c.bt[t] || {}).lv || 0}</span></span><span class="row">${btn('Auto-site', 'build', `data-t="${t}"`, 'sm', '', !bestProvFor(c, t))}${sp ? btn('Here', 'build', `data-t="${t}" data-p="${sp.id}"`, 'sm', okHere ? '' : 'Cannot be built in ' + sp.name, !okHere) : ''}</span></div>`; } }
    return h;
  },
  focus(c) {
    const tree = focusTree(c), cur = c.focus.cur ? focusById(c, c.focus.cur) : null, sel = tree.find(f => f.id === UI.focusSel) || cur || tree.find(f => focusState(c, f) === 'available') || tree[0];
    const W = 146, H = 72, mx = Math.max(...tree.map(f => f.x)), my = Math.max(...tree.map(f => f.y)), pos = f => [(f.x + 1) * W - W + 12, f.y * H + 12]; let lines = '';
    for (const f of tree) { if (!f.pre) continue; const [x2, y2] = pos(f); for (const pid of f.pre.split(/[|,]/)) { const pf = tree.find(x => x.id === pid); if (!pf) continue; const [x1, y1] = pos(pf); lines += `<path d="M${x1 + 66} ${y1 + 54} C${x1 + 66} ${y1 + 66},${x2 + 66} ${y2 - 12},${x2 + 66} ${y2}" stroke="${f.pre.includes('|') ? '#8a6f30' : '#5a6a78'}" stroke-dasharray="${f.pre.includes('|') ? '4 3' : ''}" fill="none" stroke-width="1.5"/>`; } }
    const st = focusState(c, sel), stTxt = { done: 'Completed', active: 'In progress', blocked: 'Blocked by a mutually exclusive focus', locked: 'Requires earlier focuses', unmet: 'Requirements not met', available: 'Available' }[st];
    return `${cur ? `<div class="row"><b>${cur.name}</b>${bar(c.focus.prog / cur.days)}<span class="num">${cur.days - c.focus.prog} days</span></div>` : '<div class="warn">No focus selected — pick one below.</div>'}
      <div class="card hl"><div class="row sp"><h4>${sel.name}</h4><span class="pill">${stTxt}</span></div><i class="dim">${sel.desc}</i><div>${effText(sel.eff, c)}</div>
      ${sel.req ? `<div class="${sel.req[0](c) ? 'pos' : 'neg'}">Requires: ${sel.req[1]}</div>` : ''}${sel.ideo ? `<div class="${c.ideology === sel.ideo ? 'pos' : 'neg'}">Requires a ${IDEO[sel.ideo][0].toLowerCase()} government</div>` : ''}${sel.mutex ? `<div class="dim">Excludes: ${sel.mutex.split(',').map(m => (tree.find(x => x.id === m) || {}).name).join(', ')}</div>` : ''}
      <div class="row"><span class="dim">${sel.days} days</span>${btn(cur && cur.id !== sel.id ? 'Switch to this focus' : 'Begin focus', 'focusStart', `data-f="${sel.id}"`, 'pri', cur && cur.id !== sel.id ? 'Progress on the current focus is lost' : '', st !== 'available')}</div></div>
      ${tree.some(f => f.sec) ? `<div class="row"><span class="dim">Jump to</span>${tree.filter(f => f.sec).map(f => btn(f.sec, 'focusSec', `data-x="${f.x}" data-f="${f.id}"`, 'sm')).join('')}<span class="dim">${Object.keys(c.focus.done).length} / ${tree.length} completed</span></div>` : ''}
      <div class="tree"><div style="position:relative;width:${(mx + 1) * W + 24}px;height:${(my + 1) * H + 24}px"><svg width="${(mx + 1) * W + 24}" height="${(my + 1) * H + 24}" style="position:absolute;inset:0">${lines}</svg>${tree.map(f => { const [x, y] = pos(f); return `<div class="fnode ${focusState(c, f)}${f.id === sel.id ? ' sel' : ''}" style="left:${x}px;top:${y}px" data-a="focusSel" data-f="${f.id}">${f.name}</div>`; }).join('')}</div></div>`;
  },
  decisions(c) {
    const cats = {}; for (const id in DECISIONS) { const s = decisionState(c, id); if (s === null) continue; (cats[DECISIONS[id].cat] = cats[DECISIONS[id].cat] || []).push([id, s]); }
    return Object.keys(cats).map(k => `<h3>${k}</h3>` + cats[k].map(([id, s]) => { const d = DECISIONS[id]; return `<div class="card"><div class="row sp"><b>${d.name}</b>${btn(`${d.cost} 🏛️`, 'decide', `data-d="${id}"`, 'sm pri', s, !!s)}</div><span class="dim">${d.desc}</span><div>${effText(d.eff, c)}</div>${s ? `<div class="neg">${s}</div>` : ''}</div>`; }).join('')).join('');
  },
  research(c) {
    let h = `<div class="kv"><span${tip('From universities, literacy and the size of the economy. Shared between active projects.')}>Innovation / week</span><span>${(c.innov || 0).toFixed(1)}</span></div>`;
    for (const cat in TECH_CAT) { const r = c.research[cat], av = techAvailable(c, cat);
      h += `<h3>${TECH_CAT[cat]}</h3>${r ? `<div class="card hl"><div class="row sp"><b>${TECHS[r.id][0]}</b><span class="dim">${TECHS[r.id][2]}</span></div><div class="row">${bar(r.prog / techCost(r.id))}<span class="num">${(100 * r.prog / techCost(r.id)).toFixed(0)}%</span></div></div>` : av.length ? '<div class="warn">Idle — choose a project.</div>' : '<div class="dim">Everything researched.</div>'}
        <div class="row">${av.filter(t => !r || t !== r.id).slice(0, 8).map(t => btn(`${TECHS[t][0]} <span class="dim">${TECHS[t][2]}</span>`, 'research', `data-t="${t}"`, 'sm', `<b>${TECHS[t][0]}</b> (${TECHS[t][2]})<br>${modText(TECHS[t][3])}${TECHS[t][4] ? '<br>Unlocks: ' + TECHS[t][4] : ''}<br><span class="dim">Cost ${techCost(t)}${TECHS[t][2] > year() ? ' · ahead of its time: slower' : ''}</span>`)).join('')}</div>`; }
    return h + `<h3>Known technologies</h3><div class="dim">${Object.keys(c.techs).filter(t => TECHS[t]).map(t => TECHS[t][0]).join(' · ')}</div>`;
  },
  military(c) {
    const s = UI.sub.military, mine = armiesOf(c.tag), a = G.armies[SEL.army] && G.armies[SEL.army].owner === c.tag ? G.armies[SEL.army] : null;
    let h = `<div class="subtabs">${[['overview', 'Forces'], ['armies', `Armies (${mine.length})`], ['generals', 'Generals']].map(x => btn(x[1], 'sub', `data-k="military" data-v="${x[0]}"`, s === x[0] ? 'on' : '')).join('')}</div>`;
    if (a) h += armyCard(c, a);
    if (s === 'overview') {
      const eq = ['arms', 'artillery', 'tanks', 'autos', 'aircraft', 'ships'];
      h += `<div class="kv"><span>Divisions</span><span>${c._ndiv || 0}</span><span>Manpower available</span><span>${fmt(c.manpower * 1000)}</span><span>Casualties</span><span>${fmt(c.casualties * 1000)}</span><span${tip('Aircraft × technology. Decides air superiority in battles and enables bombing.')}>Air power</span><span>${fmt(airPower(c))}</span><span${tip('Warships × technology. Needed for naval invasions; superior enemy fleets blockade trade.')}>Naval power</span><span>${fmt(navalPower(c))}</span><span>War exhaustion</span><span>${c.warExh.toFixed(0)}</span></div>
        <h3>Equipment</h3><table><tr><th>Type</th><th class="r">Stockpile</th><th class="r">Made/wk</th><th class="r">Needed/wk</th></tr>${eq.map(g => `<tr><td>${GOOD_ICON[g]} ${GOODS[g][0]}</td><td class="r">${fmt(c.stock[g] || 0)}</td><td class="r">${fmt(c.market[g].s)}</td><td class="r">${fmt(c.milNeed[g] || 0)}</td></tr>`).join('')}</table>
        <h3>Raise divisions</h3>${UNIT_IDS.map(u => { const d = UNITS[u], lock = d.tech && !c.techs[d.tech]; return `<div class="row sp"><span${tip(`<b>${d.name}</b><br>Attack ${d.atk} · Defence ${d.def} · Breakthrough ${d.brk} · Speed ${d.spd}<br>Needs: ${Object.keys(d.eq).map(g => d.eq[g] + ' ' + GOODS[g][0]).join(', ')}<br>Manpower ${d.mp}K · ${d.days} days${d.oil ? '<br>Burns oil' : ''}`)}>${d.icon} ${d.name}</span><span class="row">${lock ? `<span class="dim">Needs ${TECHS[d.tech][0]}</span>` : btn('+1', 'recruit', `data-u="${u}" data-n="1"`, 'sm', '', c.manpower < d.mp) + btn('+5', 'recruit', `data-u="${u}" data-n="5"`, 'sm', '', c.manpower < d.mp * 5)}</span></div>`; }).join('')}
        <h3>In training (${c.training.length})</h3><div class="dim">${Object.entries(c.training.reduce((o, t) => (o[t.t] = (o[t.t] || 0) + 1, o), {})).map(([t, n]) => `${n} ${UNITS[t].name}`).join(', ') || 'None'}</div>
        <div class="row">${btn('All armies: Auto', 'autoAll', 'data-v="1"', 'sm')}${btn('All armies: Manual', 'autoAll', 'data-v="0"', 'sm')}</div>`;
    } else if (s === 'armies') {
      h += `<table><tr><th>Army</th><th>At</th><th class="r">Div</th><th>Org</th><th></th></tr>${mine.map(x => { const g = genOf(x), org = sum(x.divs, d => d.org) / Math.max(1, x.divs.length); return `<tr class="click" data-a="armySel" data-i="${x.id}"><td>${x.id === SEL.army ? '▶ ' : ''}${x.name}${g ? `<div class="dim">${g.name} ${'★'.repeat(g.skill)}</div>` : ''}</td><td>${P(x.loc).name}${x.path.length ? ` → ${P(x.path[x.path.length - 1]).name}` : ''}${x.battle ? ' ⚔' : ''}${x.oos ? ' <span class="neg">no supply</span>' : ''}</td><td class="r">${x.divs.length}</td><td>${bar(org, 'g')}</td><td>${x.auto ? '<span class="pill">Auto</span>' : ''}</td></tr>`; }).join('')}</table>`;
    } else {
      h += `${btn('Promote a new general (40 🏛️)', 'hire', '', '', '', c.pp < 40)}<table><tr><th>General</th><th>Skill</th><th>Trait</th><th>Command</th></tr>${c.gens.map(g => `<tr><td>${g.name}</td><td class="warn">${'★'.repeat(g.skill)}</td><td${tip(TRAITS[g.trait][1])}>${TRAITS[g.trait][0]}</td><td>${g.army && G.armies[g.army] ? G.armies[g.army].name : a ? btn('Assign', 'assign', `data-g="${g.id}"`, 'sm') : '<span class="dim">Unassigned</span>'}</td></tr>`).join('')}</table><div class="dim">Select an army to assign an unemployed general to it.</div>`;
    }
    return h;
  },
  diplomacy(c) {
    const t = UI.diploSel && ok(UI.diploSel) && UI.diploSel !== c.tag ? UI.diploSel : null; let h = '';
    if (G.plays.length) h += '<h3>Diplomatic plays</h3>' + G.plays.map(p => `<div class="card hl">${cn(p.a)} demands that ${cn(p.b)} ${GOAL_TXT(p.goal)}<div class="dim">${p.A.map(cname).join(', ')} vs ${p.B.map(cname).join(', ')} · resolves in ${Math.max(0, p.dur - (G.day - p.day))} days</div></div>`).join('');
    if (t) { const k = C(t), o = opinion(t, c.tag), pacts = G.pacts.filter(p => (p.a === t && p.b === c.tag) || (p.a === c.tag && p.b === t)), why = canPlay(c.tag, t), claims = G.P.filter(p => p.owner === t && (p.claims.includes(c.tag) || p.cores.includes(c.tag))), sp = SEL.prov !== null && P(SEL.prov).owner === t ? P(SEL.prov) : null;
      const pb = (label, type, provs, tp) => btn(label, 'play', `data-t="${t}" data-g="${type}" data-p="${(provs || []).join(',')}"`, 'sm', why || tp, !!why);
      h += countryCard(k) + `<div class="kv"><span>Their opinion of us</span><span class="${o < 0 ? 'neg' : 'pos'}">${o.toFixed(0)}</span><span>Our opinion of them</span><span>${opinion(c.tag, t).toFixed(0)}</span></div>
        <div class="row">${pacts.map(p => `<span class="pill">${{ ally: 'Alliance', nap: 'Non-aggression', trade: 'Trade', access: 'Access', guar: p.a === c.tag ? 'We guarantee' : 'They guarantee us', truce: 'Truce' }[p.t]}${p.until ? ' until ' + dateStr(p.until) : ''}</span>`).join('')}${atWar(c.tag, t) ? '<span class="pill neg">At war</span>' : ''}</div>
        <h3>Actions <span class="dim" style="text-transform:none">(${Math.floor(c.infl)} 🤝)</span></h3><div class="row">${Object.keys(DIPLO).filter(id => DIPLO[id].can(c.tag, t)).map(id => btn(`${DIPLO[id].name} <span class="dim">${DIPLO[id].cost}</span>`, 'diplo', `data-id="${id}" data-t="${t}"`, 'sm', DIPLO[id].tip, c.infl < DIPLO[id].cost)).join('')}</div>
        <h3>Diplomatic play <span class="dim" style="text-transform:none">(40 🤝)</span></h3><div class="dim">Press a demand. Others may take sides; after a few weeks they yield, or it is war.${why ? ` <span class="neg">${why}</span>` : ''}</div><div class="row">${claims.length ? pb('Demand our claims', 'take', claims.map(p => p.id), claims.map(p => p.name).join(', ')) : ''}${sp ? pb('Demand ' + sp.name, 'take', [sp.id], 'The province selected on the map') : ''}${pb('Subjugate', 'puppet', [], 'They become our subject')}${pb('Annex', 'annex', [], 'Total annexation: heavy infamy')}${pb('Regime change', 'regime', [], 'Install a government of our ideology')}</div>${btn('← All nations', 'diploSel', 'data-t=""', 'sm')}`; }
    const list = alive().filter(k => k.tag !== c.tag).sort((a, b) => (b.major - a.major) || a.name.localeCompare(b.name));
    h += `<h3>Nations</h3><table><tr><th>Nation</th><th class="r">Opinion</th><th>Status</th></tr>${list.map(k => { const o = opinion(k.tag, c.tag), f = factionOf(k.tag); return `<tr class="click" data-a="diploSel" data-t="${k.tag}"><td>${cn(k.tag)}</td><td class="r ${o < -20 ? 'neg' : o > 20 ? 'pos' : ''}">${o.toFixed(0)}</td><td>${atWar(c.tag, k.tag) ? '<span class="pill neg">War</span>' : ''}${k.overlord === c.tag ? '<span class="pill">Subject</span>' : c.overlord === k.tag ? '<span class="pill">Overlord</span>' : ''}${hasPact('ally', c.tag, k.tag) ? '<span class="pill">Ally</span>' : ''}${f ? `<span class="pill">${f.name}</span>` : ''}</td></tr>`; }).join('')}</table>`;
    return h;
  },
  projects(c) {
    const pr = c.proj || (c.proj = { cur: null, prog: 0, done: {} }), cur = pr.cur ? PROJECTS[pr.cur] : null, rate = projRate(c);
    let h = `<div class="dim">Secret programmes that lie beyond ordinary research. One runs at a time; universities, literacy and certain national focuses speed the work.</div><div class="kv"><span>Project work / week</span><span>${rate.toFixed(1)}</span><span${tip('Accumulates while no project is running, and is spent on the next one.')}>Banked progress</span><span>${(c.projPts || 0).toFixed(0)}</span></div>`;
    h += cur ? `<div class="card hl"><div class="row sp"><b>${cur[1]} ${cur[0]}</b><span class="dim">${(100 * pr.prog / cur[3]).toFixed(0)}%</span></div>${bar(pr.prog / cur[3])}<i class="dim">${cur[4]}</i></div>` : '<div class="warn">No project under way — choose one.</div>';
    const grp = { available: [], locked: [], done: [], obsolete: [] }; for (const id in PROJECTS) { const st = projectState(c, id); if (st !== 'active') grp[st].push(id); }
    const card = (id, st) => { const p = PROJECTS[id]; return `<div class="card"><div class="row sp"><b>${p[1]} ${p[0]}</b>${st === 'available' ? btn(cur ? 'Switch' : 'Begin', 'project', `data-p="${id}"`, 'sm pri', cur ? 'Progress on the current project is lost' : '') : `<span class="pill">${{ locked: 'Locked', done: 'Completed', obsolete: 'Already known' }[st]}</span>`}</div><i class="dim">${p[4]}</i><div>${effText(p[5], c)}</div><div class="dim">Work ${p[3]}${p[6] > year() ? ` · ahead of its time until ${p[6]}` : ''}${st === 'locked' ? ' · needs ' + p[2].filter(t => !c.techs[t]).map(t => TECHS[t][0]).join(', ') + (id === 'bomb' && !c.techs.p_atomic ? '' : '') : ''}</div></div>`; };
    for (const k of ['available', 'locked', 'done']) if (grp[k].length) h += `<h3>${{ available: 'Available', locked: 'Locked', done: 'Completed' }[k]}</h3>` + grp[k].map(id => card(id, k)).join('');
    return h;
  },
  log() { return G.log.slice().reverse().slice(0, 120).map(l => `<div class="${l.kind === 'world' ? '' : 'dim'}"><span class="dim num">${dateStr(l.d)}</span> ${l.text}</div>`).join(''); }
};
const pmText = pm => `${pm[0]}: ${Object.keys(pm[2]).map(g => pm[2][g] + ' ' + GOODS[g][0]).join(' + ') || 'labour'} → ${Object.keys(pm[3]).map(g => pm[3][g] + ' ' + GOODS[g][0]).join(' + ') || 'services to the state'}`;
function armyCard(c, a) {
  const g = genOf(a), cnt = a.divs.reduce((o, d) => (o[d.t] = (o[d.t] || 0) + 1, o), {}), org = sum(a.divs, d => d.org) / a.divs.length, str = sum(a.divs, d => d.str) / a.divs.length, others = armiesAt(a.loc).filter(x => x.owner === c.tag && x !== a), free = c.gens.filter(x => !x.army || !G.armies[x.army]);
  return `<div class="card hl"><div class="row sp"><h4>${a.name}</h4>${btn('✕', 'armySel', 'data-i="0"', 'sm')}</div><div>${g ? `${g.name} <span class="warn">${'★'.repeat(g.skill)}</span> <span class="dim"${tip(TRAITS[g.trait][1])}>${TRAITS[g.trait][0]}</span>` : '<span class="dim">No general</span>'} ${free.length ? `<select id="gensel" data-ch="assignSel"><option value="">Assign general…</option>${free.map(x => `<option value="${x.id}">${x.name} ${'★'.repeat(x.skill)} ${TRAITS[x.trait][0]}</option>`).join('')}</select>` : ''}</div>
    <div>${Object.keys(cnt).map(t => `${UNITS[t].icon} ${cnt[t]} ${UNITS[t].name}`).join(' · ')}</div><div class="row"><span class="dim">Strength</span>${bar(str)}<span class="dim">Organisation</span>${bar(org, 'g')}</div>
    <div>At <b>${P(a.loc).name}</b>${a.path.length ? ` → ${P(a.path[a.path.length - 1]).name}` : ''}${a.battle ? ' · <span class="neg">in battle</span>' : ''}${a.oos ? ' · <span class="neg">out of supply</span>' : ''}</div>
    <div class="row">${btn(a.auto ? 'Auto: on' : 'Auto: off', 'armyAuto', '', 'sm' + (a.auto ? ' on' : ''), 'On Auto the general staff moves and attacks with this army')}${btn('Halt', 'armyStop', '', 'sm')}${btn('Split', 'armySplit', '', 'sm', '', a.divs.length < 2)}${others.length ? btn('Merge here', 'armyMerge', '', 'sm') : ''}${btn('Find', 'armyFind', '', 'sm')}${btn('Disband', 'armyDisband', '', 'sm', 'Men and equipment return to the pool')}</div>
    <div class="dim">Right-click a province to march there, or select a province and press “Move here”.</div></div>`;
}
function renderProv() {
  const el = $('provinfo'); if (SEL.prov === null) { el.hidden = true; return; } el.hidden = false; const p = P(SEL.prov), c = me(), own = C(p.owner), arm = armiesAt(p.id), sa = G.armies[SEL.army];
  const res = Object.keys(p.res).filter(r => p.res[r]).map(r => `${GOOD_ICON[r]}${p.res[r]}`).join(' '), lv = provLevels(p), b = Object.keys(p.b).map(t => `${BLD[t].name} ${p.b[t]}`).join(' · ');
  el.innerHTML = `<div class="row sp"><h4>${p.name}</h4>${btn('✕', 'provClose', '', 'sm')}</div><div data-a="diploSel" data-t="${p.owner}" style="cursor:pointer">${cn(p.owner)}${p.ctrl !== p.owner ? ` <span class="neg">occupied by ${cname(p.ctrl)}</span>` : ''}</div>
    <div class="kv"><span>Terrain</span><span>${TERRAIN[p.ter][0]}${p.fort ? ` · Fort ${p.fort}` : ''}</span><span>Population</span><span>${fmt(p.pop * 1000)}</span><span>Victory points</span><span>${p.vp}</span><span${tip('Building levels versus infrastructure. Overloaded provinces lose output; build railways.')}>Industry / infrastructure</span><span class="${lv > infraCap(p, own) ? 'neg' : ''}">${lv} / ${infraCap(p, own).toFixed(0)}</span>${res ? `<span>Deposits</span><span>${res}</span>` : ''}${p.dmg > 0.02 ? `<span>Devastation</span><span class="neg">${(p.dmg * 100).toFixed(0)}%</span>` : ''}</div>
    ${p.cores.length || p.claims.length ? `<div class="dim">Cores: ${p.cores.map(cname).join(', ') || '—'}${p.claims.length ? ' · Claims: ' + p.claims.map(cname).join(', ') : ''}</div>` : ''}<div class="dim">${b || 'No buildings'}</div>
    ${arm.length ? '<div>' + arm.map(a => `<div class="row sp"><span>${flag(a.owner, 1)} ${a.name} <span class="dim">${a.divs.length} div</span></span>${a.owner === c.tag ? btn('Select', 'armySel', `data-i="${a.id}"`, 'sm' + (a.id === SEL.army ? ' on' : '')) : ''}</div>`).join('') + '</div>' : ''}
    <div class="row">${sa && sa.owner === c.tag && sa.loc !== p.id ? btn(`Move ${sa.name} here`, 'moveHere', '', 'pri sm') : ''}${p.owner === c.tag ? btn('Build here', 'tab', 'data-t="build" data-keep="1"', 'sm') : ''}</div>`;
}
// ---------- selection hooks used by the map ----------
function uiSelectProv(id) { SEL.prov = id; renderProv(); if (UI.tab === 'build' || UI.tab === 'diplomacy') renderPanel(); MV.dirty = true; }
function uiSelectArmies(loc, owner) {
  SEL.prov = loc; if (owner === G.player) { const list = armiesAt(loc).filter(a => a.owner === owner), i = list.findIndex(a => a.id === SEL.army); SEL.army = list[(i + 1) % list.length].id; UI.tab = 'military'; } renderAll();
}
function uiMoveArmy(id) { const a = G.armies[SEL.army]; if (!a || a.owner !== G.player) return; if (orderMove(a, id)) { a.auto = false; toast(`${a.name} marches for ${P(id).name}.`, 'mil'); } else toast(`${a.name} cannot reach ${P(id).name}. Is it neutral ground, or do we lack naval superiority?`, 'bad'); renderAll(); }
// ---------- actions ----------
const ACT = {
  startGame() { newGame(MENU.tag); G.historical = MENU.hist; boot(); UIH.popup({ title: `${me().name}, 1 January 1936`, icon: '🗺️', desc: `You lead <b>${me().name}</b>. The game starts paused.<br><br>• Choose a <b>national focus</b>, three <b>research</b> fields and a <b>special project</b>.<br>• Queue <b>construction</b> and check your <b>budget</b> — goods in shortage are expensive.<br>• <b>Politics</b>: pass laws with the backing of interest groups.<br>• <b>Military</b>: raise divisions, appoint generals. Armies on Auto are led by your staff; click a counter and right-click a province to take command yourself.<br>• <b>Diplomacy</b>: press demands through diplomatic plays, or find friends before others do.<br><br>Press <b>Space</b> or ▶ to let time run.`, options: [{ name: 'To work.' }] }); },
  loadGame() { try { const s = localStorage.getItem(SAVE_KEY); if (!s) return toast('No saved game found.', 'bad'); deserialize(s); G.paused = true; UI.popups = []; showPopup(); boot(); toast('Game loaded.'); } catch (e) { toast('Could not load the saved game.', 'bad'); } },
  tab(d) { UI.tab = UI.tab === d.t && !d.keep ? null : d.t; renderAll(); },
  sub(d) { UI.sub[d.k] = d.v; renderPanel(); },
  pause() { G.paused = !G.paused; renderTop(); },
  speed(d) { G.speed = clamp(G.speed + +d.d, 1, 5); renderTop(); },
  popup(d) { const p = UI.popups.shift(), o = p.options[+d.i]; showPopup(); if (o.fn) o.fn(); renderAll(); showPopup(); },
  menu() { UIH.popup({ title: 'Iron Ledger 1936', icon: '☰', desc: `Version ${VERSION}. Historical AI is <b>${G.historical ? 'on' : 'off'}</b>. The game autosaves every six months in this browser.`, options: [{ name: 'Resume' }, { name: 'Save game', fn: () => saveGame() }, { name: 'Load saved game', fn: () => ACT.loadGame() }, { name: `Turn historical AI ${G.historical ? 'off' : 'on'}`, fn: () => { G.historical = !G.historical; } }, { name: 'Quit to the main menu', fn: () => { G.paused = true; MENU.screen = 'main'; startScreen(); } }] }); },
  gov(d) { if (!toggleGov(me(), d.g)) toast('Needs 25 political power, and a government needs at least one group.', 'bad'); renderAll(); },
  lawOpen(d) { UI.lawOpen = UI.lawOpen === d.c ? null : d.c; renderPanel(); },
  law(d) { startLaw(me(), d.c, d.l); renderAll(); },
  lawCancel() { me().enact = null; renderPanel(); },
  tax(d) { me().taxLevel = +d.i; renderPanel(); },
  milprod(d) { me().milProd = +d.v; renderPanel(); },
  build(d) { const c = me(), p = d.p !== undefined ? +d.p : (bestProvFor(c, d.t) || {}).id; if (p === undefined || !queueBuild(c, d.t, p)) toast('Cannot build that there.', 'bad'); else toast(`${BLD[d.t].name} queued in ${P(p).name}.`, 'build'); renderAll(); },
  unqueue(d) { me().queue.splice(+d.i, 1); renderPanel(); },
  focusSel(d) { UI.focusSel = d.f; renderPanel(); },
  focusSec(d) { UI.focusSel = d.f; renderPanel(); const t = document.querySelector('#panel .tree'); if (t) { t.scrollLeft = Math.max(0, +d.x * 146 - t.clientWidth / 2 + 80); t.scrollTop = 0; } },
  project(d) { const c = me(); if (c.proj) c.proj.cur = null; if (startProject(c, d.p)) toast(`Special project: ${PROJECTS[d.p][0]}.`, 'tech'); renderAll(); },
  focusStart(d) { const c = me(); c.focus.cur = null; if (startFocus(c, d.f)) toast(`National focus: ${focusById(c, d.f).name}.`, 'focus'); renderAll(); },
  decide(d) { takeDecision(me(), d.d); renderAll(); },
  research(d) { startResearch(me(), d.t); renderAll(); },
  recruit(d) { const n = recruit(me(), d.u, +d.n); toast(n ? `${n} ${UNITS[d.u].name} division${n > 1 ? 's' : ''} begin training.` : 'Not enough manpower.', n ? 'mil' : 'bad'); renderAll(); },
  autoAll(d) { armiesOf(G.player).forEach(a => a.auto = d.v === '1'); renderPanel(); },
  armySel(d) { SEL.army = +d.i || null; const a = G.armies[SEL.army]; if (a) { SEL.prov = a.loc; UI.tab = 'military'; } renderAll(); },
  armyAuto() { const a = G.armies[SEL.army]; if (a) a.auto = !a.auto; renderPanel(); },
  armyStop() { const a = G.armies[SEL.army]; if (a) { if (a.battle) leaveBattle(a); a.path = []; a.auto = false; } renderAll(); },
  armySplit() { const a = G.armies[SEL.army]; if (a) splitArmy(a); renderAll(); },
  armyMerge() { const a = G.armies[SEL.army]; if (a) for (const x of armiesAt(a.loc)) if (x.owner === a.owner && x !== a) mergeArmies(a, x); renderAll(); },
  armyFind() { const a = G.armies[SEL.army]; if (a) mapCenter(a.loc, 0.6); },
  armyDisband() { const a = G.armies[SEL.army]; if (a) { disbandArmy(a); SEL.army = null; } renderAll(); },
  hire() { const g = hireGeneral(me()); if (g) toast(`${g.name} is promoted to general.`, 'mil'); renderAll(); },
  assign(d) { const a = G.armies[SEL.army], g = me().gens.find(x => x.id === +d.g); if (a && g) assignGeneral(a, g); renderAll(); },
  moveHere() { if (SEL.prov !== null) uiMoveArmy(SEL.prov); },
  provClose() { SEL.prov = null; renderProv(); MV.dirty = true; },
  diploSel(d) { UI.diploSel = d.t || null; if (d.t && d.t !== G.player) { UI.tab = 'diplomacy'; const p = $('panel'); renderAll(); p.scrollTop = 0; } else renderAll(); },
  diplo(d) { const r = diploAction(d.id, G.player, d.t); toast(r || `${DIPLO[d.id].name}: ${cname(d.t)} agrees.`, r ? 'bad' : 'good'); renderAll(); },
  play(d) { const c = me(), why = canPlay(c.tag, d.t); if (why) return toast(why, 'bad'); const goal = { type: d.g, provs: d.p ? d.p.split(',').map(Number) : [] }; if (startPlay(c.tag, d.t, goal)) c.infl -= 40; renderAll(); }
};
Object.assign(ACT, MENU_ACT);
const CHG = { hist(el) { MENU.hist = el.checked; }, pm(el) { me().pm[el.dataset.t] = +el.value; me().pmAuto = false; }, assignSel(el) { const a = G.armies[SEL.army], g = me().gens.find(x => x.id === +el.value); if (a && g) assignGeneral(a, g); renderPanel(); } };
function saveGame(quiet) { try { localStorage.setItem(SAVE_KEY, serialize()); if (!quiet) toast('Game saved in this browser.', 'good'); } catch (e) { if (!quiet) toast('Saving is not available here.', 'bad'); } }
document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (!el || el.disabled) return; const f = ACT[el.dataset.a]; if (f) { $('tip').hidden = true; f(el.dataset, el); } });
document.addEventListener('change', e => { const el = e.target.closest('[data-ch]'); if (el && CHG[el.dataset.ch]) CHG[el.dataset.ch](el); });
document.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip]'), t = $('tip'); if (!el) { t.hidden = true; return; } t.innerHTML = el.dataset.tip; t.hidden = false; const r = el.getBoundingClientRect(), w = t.offsetWidth, h = t.offsetHeight; t.style.left = clamp(r.left, 4, innerWidth - w - 4) + 'px'; t.style.top = (r.bottom + h + 8 > innerHeight ? Math.max(4, r.top - h - 6) : r.bottom + 6) + 'px'; });
document.addEventListener('keydown', e => { if (!G || !UI.started || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return; if (e.code === 'Space') { e.preventDefault(); if (!UI.popups.length) ACT.pause(); } else if (e.key === '+' || e.key === '=') ACT.speed({ d: 1 }); else if (e.key === '-') ACT.speed({ d: -1 }); else if (e.key === 'Escape') { SEL.army = null; SEL.prov = null; renderAll(); } });
(function () {
  const hot = window.claude && window.claude.hot; try { if (hot && hot.snapshot) hot.snapshot(() => ({ save: G && UI.started ? serialize() : null })); } catch (e) { }
  const begin = d => { if (d && d.save) { try { deserialize(d.save); G.paused = true; boot(); return; } catch (e) { } } startScreen(); };
  if (hot && hot.ready) hot.ready(begin); else begin((hot && hot.data) || {});
})();

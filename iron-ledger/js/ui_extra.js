// 1.2 interface: multi-selection, reworked Military panel (recruitment, division management),
// subject management, automation controls and right-click diplomacy. Loaded after ui.js.
'use strict';
SEL.multi = [];
const selArmies = () => { const ids = [SEL.army, ...SEL.multi].filter((v, i, a) => v && a.indexOf(v) === i); return ids.map(i => G.armies[i]).filter(a => a && a.owner === G.player); };
function setSelection(list) { SEL.army = list.length ? list[0].id : null; SEL.multi = list.slice(1).map(a => a.id); }
function mapClick(e, right) {
  const r = mapCv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
  if (!right) for (const h of MV.hits) if (mx >= h[0] && mx <= h[0] + h[2] && my >= h[1] && my <= h[1] + h[3]) { uiSelectArmies(h[4], h[5], e.shiftKey); return; }
  const id = provAt(MV.x + mx / MV.s, MV.y + my / MV.s);
  if (right) { if (id === null) return; if (selArmies().length) uiMoveArmy(id); else if (P(id).owner !== G.player) { SEL.prov = id; ACT.diploSel({ t: P(id).owner }); } else uiSelectProv(id); return; }
  uiSelectProv(id);
}
function uiSelectArmies(loc, owner, add) {
  SEL.prov = loc; if (owner === G.player) { const list = armiesAt(loc).filter(a => a.owner === owner); if (add) { const cur = selArmies(); list.forEach(a => cur.includes(a) || cur.push(a)); setSelection(cur); } else setSelection(list); UI.tab = 'military'; if (UI.sub.military === 'recruit') UI.sub.military = 'armies'; } renderAll();
}
function uiBoxSelect(b) {
  const x0 = Math.min(b[0], b[2]), x1 = Math.max(b[0], b[2]), y0 = Math.min(b[1], b[3]), y1 = Math.max(b[1], b[3]); if (x1 - x0 < 6 && y1 - y0 < 6) return;
  const list = armiesOf(G.player).filter(a => { const m = MAP.P[a.loc], x = (m.x - MV.x) * MV.s, y = (m.y - MV.y) * MV.s; return x >= x0 && x <= x1 && y >= y0 - 20 && y <= y1 + 6; });
  setSelection(list); if (list.length) { UI.tab = 'military'; if (UI.sub.military === 'recruit') UI.sub.military = 'armies'; toast(`${list.length} arm${list.length > 1 ? 'ies' : 'y'} selected.`, 'mil'); } renderAll();
}
function uiMoveArmy(id) {
  const list = selArmies(); if (!list.length) return; let okN = 0; for (const a of list) if (a.loc !== id && orderMove(a, id)) { a.auto = false; okN++; }
  if (okN) toast(list.length > 1 ? `${okN} of ${list.length} armies march for ${P(id).name}.` : `${list[0].name} marches for ${P(id).name}.`, 'mil'); else toast(`Cannot reach ${P(id).name}. Is it neutral ground, or do we lack naval superiority?`, 'bad'); renderAll();
}
function armyCard(c, a) {
  const g = genOf(a), others = armiesAt(a.loc).filter(x => x.owner === c.tag && x !== a), free = c.gens.filter(x => !x.army || !G.armies[x.army]), org = sum(a.divs, d => d.org) / a.divs.length, str = sum(a.divs, d => d.str) / a.divs.length;
  return `<div class="card hl"><div class="row sp"><input id="armyname" data-ch="armyName" value="${esc(a.name)}" maxlength="40" aria-label="Army name">${btn('✕', 'armySel', 'data-i="0"', 'sm')}</div>
    <div>${g ? `${g.name} <span class="warn">${'★'.repeat(g.skill)}</span> <span class="dim"${tip(TRAITS[g.trait][1])}>${TRAITS[g.trait][0]}</span>` : '<span class="dim">No general</span>'} ${free.length ? `<select id="gensel" data-ch="assignSel"><option value="">Assign general…</option>${free.map(x => `<option value="${x.id}">${x.name} ${'★'.repeat(x.skill)} ${TRAITS[x.trait][0]}</option>`).join('')}</select>` : ''}</div>
    <div class="row"><span class="dim">Strength</span>${bar(str)}<span class="dim">Organisation</span>${bar(org, 'g')}</div>
    <div>At <b>${P(a.loc).name}</b>${a.path.length ? ` → ${P(a.path[a.path.length - 1]).name}` : ''}${a.battle ? ' · <span class="neg">in battle</span>' : ''}${a.oos ? ' · <span class="neg">out of supply</span>' : ''}</div>
    <div class="row">${btn(a.auto ? 'Auto: on' : 'Auto: off', 'armyAuto', '', 'sm' + (a.auto ? ' on' : ''), 'On Auto the general staff moves and attacks with this army')}${btn('Halt', 'armyStop', '', 'sm')}${btn('Split in two', 'armySplit', '', 'sm', '', a.divs.length < 2)}${others.length ? btn('Merge all here', 'armyMerge', '', 'sm') : ''}${btn('Find', 'armyFind', '', 'sm')}${btn('Disband', 'armyDisband', '', 'sm', 'Men and equipment return to the pool')}</div>
    <table><tr><th>Division</th><th>Strength</th><th>Org</th><th></th></tr>${a.divs.map((d, i) => `<tr><td>${UNITS[d.t].icon} ${UNITS[d.t].name}${d.xp > 0.3 ? ' <span class="warn"' + tip('Veteran') + '>✦</span>' : ''}</td><td>${bar(d.str)}</td><td>${bar(d.org, 'g')}</td><td class="r">${a.divs.length > 1 ? btn('Detach', 'divDetach', `data-i="${i}"`, 'sm', 'Form a new army from this division') : ''}${others.length ? btn('→', 'divMove', `data-i="${i}"`, 'sm', `Transfer to ${others[0].name}`) : ''}</td></tr>`).join('')}</table>
    <div class="dim">Right-click a province to march. Shift-drag on the map selects every army in a box; Shift-click adds a stack.</div></div>`;
}
function groupCard(c, list) {
  const divs = sum(list, a => a.divs.length), same = list.every(a => a.loc === list[0].loc);
  return `<div class="card hl"><div class="row sp"><h4>${list.length} armies selected</h4>${btn('✕', 'armySel', 'data-i="0"', 'sm')}</div><div>${divs} divisions · ${[...new Set(list.map(a => P(a.loc).name))].slice(0, 5).join(', ')}${new Set(list.map(a => a.loc)).size > 5 ? '…' : ''}</div>
    <div class="row">${btn('Auto: on', 'grpAuto', 'data-v="1"', 'sm')}${btn('Auto: off', 'grpAuto', 'data-v="0"', 'sm')}${btn('Halt', 'grpHalt', '', 'sm')}${same ? btn('Merge into one', 'grpMerge', '', 'sm') : ''}</div>
    <div>${list.map(a => `<span class="pill" data-a="armySel" data-i="${a.id}" style="cursor:pointer">${a.name} · ${a.divs.length}</span>`).join(' ')}</div><div class="dim">Right-click a province and they all march there.</div></div>`;
}
PANELS.military = function (c) {
  const s = UI.sub.military, mine = armiesOf(c.tag), sel = selArmies();
  let h = `<div class="subtabs">${[['overview', 'Forces'], ['recruit', 'Recruit'], ['armies', `Armies (${mine.length})`], ['generals', 'Generals']].map(x => btn(x[1], 'sub', `data-k="military" data-v="${x[0]}"`, s === x[0] ? 'on' : '')).join('')}</div>`;
  if (sel.length > 1) h += groupCard(c, sel); else if (sel.length === 1) h += armyCard(c, sel[0]);
  if (s === 'overview') {
    const eq = ['arms', 'artillery', 'tanks', 'autos', 'aircraft', 'ships'];
    h += `<div class="kv"><span>Divisions</span><span>${c._ndiv || 0}</span><span>Manpower available</span><span>${fmt(c.manpower * 1000)}</span><span>Casualties</span><span>${fmt(c.casualties * 1000)}</span><span${tip('Aircraft × technology. Decides air superiority in battles and enables bombing.')}>Air power</span><span>${fmt(airPower(c))}</span><span${tip('Warships × technology. Needed for naval invasions; superior enemy fleets blockade trade.')}>Naval power</span><span>${fmt(navalPower(c))}</span><span>War exhaustion</span><span>${c.warExh.toFixed(0)}</span></div>
      <h3>Equipment</h3><table><tr><th>Type</th><th class="r">Stockpile</th><th class="r">Made/wk</th><th class="r">Needed/wk</th></tr>${eq.map(g => `<tr><td>${GOOD_ICON[g]} ${GOODS[g][0]}</td><td class="r">${fmt(c.stock[g] || 0)}</td><td class="r">${fmt(c.market[g].s)}</td><td class="r">${fmt(c.milNeed[g] || 0)}</td></tr>`).join('')}</table>
      ${Object.keys(c.lend || {}).length ? `<div>Lend-Lease out: ${Object.keys(c.lend).map(x => `${cn(x)} ${(c.lend[x] * 100).toFixed(0)}%`).join(', ')} <span class="dim">(${fmt(c.lendOut || 0)}/wk)</span></div>` : ''}${(c.lendIn || 0) > 5 ? `<div class="pos">Lend-Lease received: about ${fmt(c.lendIn)} of equipment a week</div>` : ''}
      <div class="row">${btn(`Raise new divisions (${c.training.length} in training)`, 'sub', 'data-k="military" data-v="recruit"', 'pri')}</div>`;
  } else if (s === 'recruit') {
    const mp = maxManpower(c), dep = c.deployTo !== undefined && c.deployTo !== null && P(c.deployTo).ctrl === c.tag ? c.deployTo : c.capital, sp = SEL.prov !== null && P(SEL.prov).ctrl === c.tag && P(SEL.prov).owner === c.tag ? SEL.prov : null;
    h += `<div class="kv"><span${tip('Recruits you can call up now. It refills towards the limit set by your conscription law and core population.')}>Manpower available</span><span>${fmt(c.manpower * 1000)}</span><span>Conscriptable population</span><span>${fmt(mp * 1000)}</span><span>Conscription law</span><span>${LAWS.conscription.laws[c.laws.conscription][0]} ${btn('Change', 'goLaw', 'data-c="conscription"', 'sm')}</span></div>
      <h3>Deployment</h3><div class="row"><span>New divisions muster at <b>${P(dep).name}</b></span>${dep !== c.capital ? btn('Use capital', 'deploy', 'data-p=""', 'sm') : ''}${sp !== null && sp !== dep ? btn(`Use ${P(sp).name}`, 'deploy', `data-p="${sp}"`, 'sm') : ''}</div><div class="dim">Select one of your provinces on the map to muster there instead.</div>
      <div class="row">${btn('Join existing armies', 'recruitNew', 'data-v="0"', 'sm' + (c.recruitNew ? '' : ' on'), 'Recruits fill up armies already standing at the muster point')}${btn('Form new armies', 'recruitNew', 'data-v="1"', 'sm' + (c.recruitNew ? ' on' : ''), 'Recruits gather in fresh armies of up to eight divisions, on manual control')}</div>
      <h3>Raise divisions</h3><table><tr><th>Type</th><th class="r">Atk/Def</th><th class="r">Men</th><th class="r">Days</th><th></th></tr>${UNIT_IDS.map(u => { const d = UNITS[u], lock = d.tech && !c.techs[d.tech], short = Object.keys(d.eq).filter(g => (c.stock[g] || 0) < d.eq[g]);
        return `<tr><td${tip(`<b>${d.name}</b><br>Attack ${d.atk} · Defence ${d.def} · Breakthrough ${d.brk} · Speed ${d.spd}<br>Equipment: ${Object.keys(d.eq).map(g => `<span class="${(c.stock[g] || 0) < d.eq[g] ? 'neg' : 'pos'}">${d.eq[g]} ${GOODS[g][0]}</span>`).join(', ')}${d.oil ? '<br>Burns oil' : ''}<br><span class="dim">New divisions arrive at 30% strength and fill up from the stockpile.</span>`)}>${d.icon} ${d.name}${short.length && !lock ? ' <span class="warn"' + tip('Stockpile is short of ' + short.map(g => GOODS[g][0]).join(', ') + '; the division will take longer to reach full strength') + '>⚠</span>' : ''}</td><td class="r">${d.atk}/${d.def}</td><td class="r">${d.mp}K</td><td class="r">${Math.round(d.days / (1 + M(c, 'train')))}</td><td class="r">${lock ? `<span class="dim">Needs ${TECHS[d.tech][0]}</span>` : [1, 5, 10].map(n => btn('+' + n, 'recruit', `data-u="${u}" data-n="${n}"`, 'sm', '', c.manpower < d.mp * n)).join('')}</td></tr>`; }).join('')}</table>
      <h3>In training (${c.training.length})</h3>${c.training.length ? btn('Cancel all', 'trainCancel', 'data-i="-1"', 'sm') : '<span class="dim">Nothing in training.</span>'}${c.training.slice(0, 40).map((t, i) => `<div class="row sp"><span>${UNITS[t.t].icon} ${UNITS[t.t].name}</span><span class="row">${bar(1 - t.days / (t.total || UNITS[t.t].days))}<span class="num dim">${Math.max(0, t.days)}d</span>${btn('✕', 'trainCancel', `data-i="${i}"`, 'sm', 'Cancel; the men return to the pool')}</span></div>`).join('')}`;
  } else if (s === 'armies') {
    h += `<div class="row">${btn('Select all', 'selAll', 'data-m="all"', 'sm')}${btn('Select idle', 'selAll', 'data-m="idle"', 'sm', 'Armies that are not moving or fighting')}${btn('All Auto', 'autoAll', 'data-v="1"', 'sm')}${btn('All Manual', 'autoAll', 'data-v="0"', 'sm')}</div><div class="dim">Click an army to select it; Shift-click to add it to the selection.</div>
      <table><tr><th>Army</th><th>At</th><th class="r">Div</th><th>Org</th><th></th></tr>${mine.map(x => { const g = genOf(x), org = sum(x.divs, d => d.org) / Math.max(1, x.divs.length); return `<tr class="click" data-a="armySel" data-i="${x.id}"><td>${sel.includes(x) ? '▶ ' : ''}${esc(x.name)}${g ? `<div class="dim">${g.name} ${'★'.repeat(g.skill)}</div>` : ''}</td><td>${P(x.loc).name}${x.path.length ? ` → ${P(x.path[x.path.length - 1]).name}` : ''}${x.battle ? ' ⚔' : ''}${x.oos ? ' <span class="neg">no supply</span>' : ''}</td><td class="r">${x.divs.length}</td><td>${bar(org, 'g')}</td><td>${x.auto ? '<span class="pill">Auto</span>' : ''}</td></tr>`; }).join('')}</table>`;
  } else {
    const a = sel.length === 1 ? sel[0] : null;
    h += `${btn('Promote a new general (40 🏛️)', 'hire', '', '', '', c.pp < 40)}<table><tr><th>General</th><th>Skill</th><th>Trait</th><th>Command</th></tr>${c.gens.map(g => `<tr><td>${g.name}</td><td class="warn">${'★'.repeat(g.skill)}</td><td${tip(TRAITS[g.trait][1])}>${TRAITS[g.trait][0]}</td><td>${g.army && G.armies[g.army] ? esc(G.armies[g.army].name) : a ? btn('Assign', 'assign', `data-g="${g.id}"`, 'sm') : '<span class="dim">Unassigned</span>'}</td></tr>`).join('')}</table><div class="dim">Select a single army to assign an unemployed general to it.</div>`;
  }
  return h;
};
// subjects, releasable nations and automation are added around the original panels
const _diplo = PANELS.diplomacy, _build = PANELS.build, _econ = PANELS.economy, _country = PANELS.country;
function subjectBlock(c, k) {
  if (k.overlord === c.tag) { const a = autonomyOf(k), lv = subjLevel(k);
    return `<h3>Our subject</h3><div class="card"><div class="row sp"><b>${SUBJ_LEVEL[lv][0]}</b><span>Tribute ${(SUBJ_LEVEL[lv][1] * 100).toFixed(0)}% of their taxes</span></div><div class="row"><span class="dim"${tip('Below 25: Integrated Puppet, can be annexed. 25–60: Puppet. 60–85: Dominion. Above 85: may leave peacefully. Autonomy drifts upward over time, faster when we are at war or defeated.')}>Autonomy</span>${bar(a / 100)}<span class="num">${a.toFixed(0)}</span></div>
      <div class="row">${Object.keys(SUBJ).map(id => { const why = SUBJ[id].can(c, k) || (c.pp < SUBJ[id].cost ? `Requires ${SUBJ[id].cost} political power` : ''); return btn(`${SUBJ[id].name}${SUBJ[id].cost ? ` <span class="dim">${SUBJ[id].cost}🏛️</span>` : ''}`, 'subj', `data-id="${id}" data-t="${k.tag}"`, 'sm', SUBJ[id].tip + (why ? `<br><span class="neg">${why}</span>` : ''), !!why); }).join('')}</div></div>`; }
  if (c.overlord === k.tag) { const a = autonomyOf(c);
    return `<h3>Our overlord</h3><div class="card"><div class="row sp"><b>We are their ${SUBJ_LEVEL[subjLevel(c)][0]}</b><span>Tribute ${(tributeRate(c) * 100).toFixed(0)}%</span></div><div class="row"><span class="dim">Autonomy</span>${bar(a / 100)}<span class="num">${a.toFixed(0)}</span></div>
      <div class="row">${btn('Seek autonomy <span class="dim">50🏛️</span>', 'seekAut', '', 'sm', 'Autonomy +10', c.pp < 50)}${btn(a >= 85 ? 'Take our independence' : 'Declare independence', 'indep', '', 'sm' + (a >= 85 ? ' pri' : ''), a >= 85 ? 'At 85 autonomy we may leave in peace' : '<span class="neg">Below 85 autonomy this means war with our overlord</span>')}</div></div>`; }
  return '';
}
PANELS.diplomacy = function (c) {
  let h = _diplo(c); const t = UI.diploSel && ok(UI.diploSel) && UI.diploSel !== c.tag ? C(UI.diploSel) : null;
  if (t) { const sb = subjectBlock(c, t); if (sb) h = h.replace('<h3>Actions', sb + '<h3>Actions'); }
  else { const subs = subjectsOf(c.tag), rel = releasable(c); let top = '';
    if (subs.length) top += '<h3>Our subjects</h3>' + subs.map(k => `<div class="row sp click" data-a="diploSel" data-t="${k.tag}" style="cursor:pointer"><span>${cn(k.tag)} <span class="dim">${SUBJ_LEVEL[subjLevel(k)][0]}</span></span><span class="row">${bar(autonomyOf(k) / 100)}<span class="num dim">${autonomyOf(k).toFixed(0)}</span></span></div>`).join('');
    if (rel.length) top += '<h3>Release a nation</h3><div class="dim">Countries whose homelands we hold can be set up again as our puppets.</div>' + rel.map(x => `<div class="row sp"><span>${flag(x, 1)} ${G.C[x].name} <span class="dim">${G.P.filter(p => p.owner === c.tag && p.orig === x).length} provinces</span></span>${btn('Release as puppet', 'releaseP', `data-t="${x}"`, 'sm', 'They become our subject at autonomy 40 with a government of our ideology. Infamy -4.')}</div>`).join('');
    h = top + h; }
  return h;
};
PANELS.build = function (c) { return `<div class="card"><div class="row sp"><b>Auto-build</b><span class="dim">Planners keep two projects queued</span></div><div class="row">${Object.keys(AUTO_BUILD).map(m => btn(AUTO_BUILD[m], 'autoBuild', `data-m="${m}"`, 'sm' + ((c.autoBuild || 'off') === m ? ' on' : ''), { off: 'You choose every project', balanced: 'A mix of profitable industry, infrastructure and war industry', civ: 'Profitable civilian industry and infrastructure only', mil: 'Mostly arms, artillery, tank and aircraft works' }[m])).join('')}</div></div>` + _build(c); };
PANELS.economy = function (c) {
  if (UI.sub.economy !== 'trade') return _econ(c).replace('</div>', btn('Trade', 'sub', 'data-k="economy" data-v="trade"', '') + '</div>');
  const pacts = G.pacts.filter(p => p.t === 'trade' && (p.a === c.tag || p.b === c.tag)).map(p => p.a === c.tag ? p.b : p.a), pol = c.tpol || {};
  return `<div class="subtabs">${[['budget', 'Budget'], ['market', 'Market'], ['industry', 'Industry'], ['trade', 'Trade']].map(x => btn(x[1], 'sub', `data-k="economy" data-v="${x[0]}"`, x[0] === 'trade' ? 'on' : '')).join('')}</div>
    <div class="dim">Goods flow automatically: shortages are imported and surpluses exported through the world market, limited by your trade openness.</div>
    <div class="kv"><span${tip('Share of any shortage or surplus that can cross the border. Raised by Free Trade, ports and trade agreements (+3% each, up to +20%); cut by Autarky and blockade.')}>Trade openness</span><span>${((c._open || 0) * 100).toFixed(0)}%</span><span>Trade policy</span><span>${LAWS.trade.laws[c.laws.trade][0]} ${btn('Change', 'goLaw', 'data-c="trade"', 'sm')}</span><span>Tariff income / week</span><span>${fmt(c.budget.tariff || 0)}</span></div>
    <div class="card"><div class="row sp"><b>Auto-trade</b>${btn(c.autoTrade ? 'On' : 'Off', 'autoTrade', '', 'sm' + (c.autoTrade ? ' on' : ''))}</div><span class="dim">Each month your diplomats sign a trade agreement with the largest willing economy (20 influence each).</span></div>
    <h3>Trade agreements (${pacts.length})</h3><div>${pacts.map(cn).join(', ') || '<span class="dim">None</span>'}</div>
    <h3>Goods</h3><table><tr><th>Good</th><th class="r">Imports</th><th class="r">Exports</th><th>Policy</th></tr>${GOOD_IDS.map(g => { const m = c.market[g]; return `<tr><td>${GOOD_ICON[g]} ${GOODS[g][0]}</td><td class="r ${m.imp > 0.5 ? 'warn' : 'dim'}">${fmt(m.imp)}</td><td class="r ${m.exp > 0.5 ? 'pos' : 'dim'}">${fmt(m.exp)}</td><td><select id="tp_${g}" data-ch="tpol" data-g="${g}"><option value="">Free</option><option value="noexp"${pol[g] === 'noexp' ? ' selected' : ''}>No exports</option><option value="noimp"${pol[g] === 'noimp' ? ' selected' : ''}>No imports</option></select></td></tr>`; }).join('')}</table>`;
};
PANELS.country = function (c) { let h = _country(c); if (c.overlord) h = h.replace('<h3>National spirits', subjectBlock(c, C(c.overlord)) + '<h3>National spirits'); return h; };
Object.assign(ACT, {
  armySel(d, el, e) { const id = +d.i || null, a = G.armies[id]; if (!a) { SEL.army = null; SEL.multi = []; } else if (e && e.shiftKey) { const cur = selArmies(); const i = cur.indexOf(a); if (i >= 0) cur.splice(i, 1); else cur.push(a); setSelection(cur); } else { setSelection([a]); SEL.prov = a.loc; UI.tab = 'military'; } renderAll(); },
  selAll(d) { setSelection(armiesOf(G.player).filter(a => d.m === 'all' || (!a.path.length && !a.battle))); renderAll(); },
  grpAuto(d) { selArmies().forEach(a => a.auto = d.v === '1'); renderAll(); },
  grpHalt() { selArmies().forEach(a => { if (a.battle) leaveBattle(a); a.path = []; a.auto = false; }); renderAll(); },
  grpMerge() { const l = selArmies(); for (const x of l.slice(1)) mergeArmies(l[0], x); setSelection([l[0]]); renderAll(); },
  armyDisband() { const l = selArmies(); if (l.length === 1) { disbandArmy(l[0]); setSelection([]); } renderAll(); },
  divDetach(d) { const a = selArmies()[0]; if (!a || a.divs.length < 2) return; const n = newArmy(C(a.owner), a.loc); n.auto = false; n.divs.push(a.divs.splice(+d.i, 1)[0]); renderAll(); },
  divMove(d) { const a = selArmies()[0]; if (!a) return; const o = armiesAt(a.loc).find(x => x.owner === a.owner && x !== a); if (!o) return; o.divs.push(a.divs.splice(+d.i, 1)[0]); if (!a.divs.length) { removeArmy(a); setSelection([o]); } renderAll(); },
  recruit(d) { const c = me(), n = recruit(c, d.u, +d.n, c.deployTo === null ? undefined : c.deployTo); toast(n ? `${n} ${UNITS[d.u].name} division${n > 1 ? 's' : ''} begin training.` : 'Not enough manpower. Raise conscription or wait for the pool to refill.', n ? 'mil' : 'bad'); renderAll(); },
  trainCancel(d) { const c = me(); if (+d.i < 0) while (c.training.length) cancelTraining(c, 0); else cancelTraining(c, +d.i); renderAll(); },
  deploy(d) { me().deployTo = d.p === '' ? null : +d.p; renderPanel(); },
  recruitNew(d) { me().recruitNew = d.v === '1'; renderPanel(); },
  goLaw(d) { UI.tab = 'politics'; UI.lawOpen = d.c; renderAll(); const el = document.querySelector(`#panel [data-a="lawOpen"][data-c="${d.c}"]`); if (el) el.scrollIntoView({ block: 'center' }); },
  subj(d) { const r = subjAction(d.id, me(), C(d.t)); if (r) toast(r, 'bad'); else toast(`${SUBJ[d.id].name}: ${cname(d.t)}.`, 'good'); if (!ok(d.t)) UI.diploSel = null; renderAll(); },
  seekAut() { if (seekAutonomy(me())) toast('Our autonomy grows.', 'good'); renderAll(); },
  indep() { declareIndependence(me()); renderAll(); },
  releaseP(d) { if (releasePuppet(me(), d.t)) { toast(`${cname(d.t)} is restored as our puppet.`, 'good'); UI.diploSel = d.t; } renderAll(); },
  autoBuild(d) { me().autoBuild = d.m; if (d.m !== 'off') autoBuild(me()); renderAll(); },
  autoTrade() { const c = me(); c.autoTrade = !c.autoTrade; if (c.autoTrade) autoTrade(c); renderAll(); }
});
Object.assign(CHG, {
  armyName(el) { const a = selArmies()[0]; if (a && el.value.trim()) a.name = el.value.trim().slice(0, 40); },
  tpol(el) { const c = me(); (c.tpol || (c.tpol = {}))[el.dataset.g] = el.value || undefined; }
});

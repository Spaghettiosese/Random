// Rising Sun (1.4) interface: balance of power, weather, naval invasions, collaboration governments, warlords.
'use strict';
for (const t in NEW_TREES) delete NEW_TREES[t]; NEW_TREES.JAP = NEW_TREES.CHI = NEW_TREES.PRC = NEW_TREES.PHI = NEW_TREES.MON = 1;
UPDATES.unshift(['1.4', 'Rising Sun', 'The fourth major update: Asia rebuilt from the ground up.', [
  ['Japan, China, Communist China, the Philippines, Mongolia', 'Five new focus trees, each over 230 focuses. Japan chooses between the Imperial Way, the Control Faction, a civilian purge or a people\'s front, then between striking north or south. China must unify its warlords before, or while, fighting for its life. The Communists build base areas behind the lines and wait for their moment. The Philippines walks the ten-year road to independence; Mongolia balances the Party, the lamas and two giant neighbours.'],
  ['A new map of China', 'China no longer starts united. Guangxi, Yunnan, Shanxi, Sichuan and the Ma lands are warlord cliques: Chinese subjects with their own armies, generals and very high autonomy.'],
  ['New feature: Balance of Power', 'Five nations have an internal rivalry shown as a bar on the Politics tab: Army against Navy in Japan, the Centre against the Cliques in China, Yan\'an against Moscow, Tutelage against Independence, the Party against Tradition. Focuses push the bar; you can spend political power to push it; each band of the bar carries its own bonuses and costs.'],
  ['New feature: Warlords and Unification', 'China\'s Unification branch wears each clique\'s autonomy down and finally absorbs them, or reconciles them in a federal China. Japan can buy a warlord out of the war altogether.'],
  ['New feature: Naval Invasions', 'Select armies in a coastal province, pick an enemy coastal province within 3,800 km by sea and press Naval invasion. The landing needs naval superiority and fights at a heavy penalty. The AI uses it too, so garrison your coast.'],
  ['New feature: Collaboration Governments', 'At war and holding enemy land? Set up a collaboration government from the Diplomacy tab. It takes over the provinces you occupy, calms them, raises its own militia, and fights as your subject.'],
  ['New feature: Seasons and Weather', 'Deep winter in the north, spring and autumn mud in Russia, the summer monsoon across South and South-East Asia. Bad weather slows marches and blunts attacks; nations used to the cold suffer less. See it on the new Weather map mode.'],
  ['Also', 'Occupied China can rise for the Communists once their base areas are founded. Japan\'s historical timetable (China 1937, Indochina 1940, the southern strike 1941) is followed by the AI only. Authoritarian AI governments no longer vote themselves out of power.']
]]);

// ---------- weather: map mode and province box ----------
MODES.push(['weather', 'Weather']);
{ const _pc = provColor; provColor = function (p) { if (MV.mode !== 'weather') return _pc(p); return { clear: '#3f5a45', winter: '#cfe0ea', mud: '#7a5a3a', monsoon: '#3a6f9a' }[weatherKey(p.id)]; };
  const _rp = renderProv; renderProv = function () { _rp(); if (SEL.prov === null) return; const p = P(SEL.prov), el = $('provinfo'), k = weatherKey(p.id), w = WEATHER[k], c = me(), sel = selArmies().filter(a => a.loc !== p.id); let add = '';
    if (k !== 'clear') add += `<div${tip(`Marches take ${Math.round((w[3] - 1) * 100)}% longer and attacks are ${Math.round((1 - w[2]) * 100)}% weaker. Nations used to the cold suffer far less in winter.`)}>${w[1]} <b>${w[0]}</b></div>`;
    const at = Object.values(G.armies).filter(a => a.inv && a.inv.to === p.id && (a.owner === c.tag || friendly(a.owner, c.tag))); if (at.length) add += `<div class="warn">⚓ ${at.length} ${at.length > 1 ? 'armies' : 'army'} at sea, landing in ${Math.max(0, at[0].inv.eta - G.day)} days</div>`;
    if (sel.length && atWar(c.tag, p.ctrl) && p.coastal && !NB[p.id].some(e => !e.sea && sel.some(a => a.loc === e.to))) { const why = sel.map(a => invasionBlock(c, a, p.id)).find(x => x) || ''; add += `<div class="row">${btn(`⚓ Naval invasion (${why ? '—' : invasionDays(sel[0].loc, p.id) + ' days'})`, 'invade', `data-p="${p.id}"`, 'pri sm', why || 'The selected armies embark and assault this province from the sea. Amphibious attacks fight at 55% strength.', !!why)}</div>`; }
    if (add) el.insertAdjacentHTML('beforeend', add); }; }
ACT.invade = d => { let n = 0; for (const a of selArmies()) if (launchInvasion(a, +d.p)) n++; UIH.notify(n ? `${n} ${n > 1 ? 'armies embark' : 'army embarks'} for ${P(+d.p).name}.` : 'The invasion could not be launched.', n ? 'good' : 'bad'); renderAll(); };
{ const _ac = armyCard; armyCard = function (c, a) { const h = _ac(c, a); return a.inv ? h.replace('<div class="row">', `<div class="warn">⚓ At sea, bound for <b>${P(a.inv.to).name}</b>; landing in ${Math.max(0, a.inv.eta - G.day)} days. ${btn('Recall', 'invCancel', `data-i="${a.id}"`, 'sm')}</div><div class="row">`) : h; }; }
ACT.invCancel = d => { const a = G.armies[+d.i]; if (a) delete a.inv; renderAll(); };

// ---------- balance of power ----------
{ const _pol = PANELS.politics; PANELS.politics = function (c) {
  const d = bopDef(c); if (!d) return _pol(c); bopApply(c); const b = bopBand(c.bop), pos = (c.bop + 100) / 2;
  const h = `<div class="card"><div class="row sp"><b>⚖ ${d[0]}</b><span class="pill"${tip(modText(d[3][b][1]))}>${d[3][b][0]}</span></div>
    <div class="row sp"><span>${d[1]}</span><span>${d[2]}</span></div>
    <div class="bop"><i style="left:20%"></i><i style="left:40%"></i><i style="left:60%"></i><i style="left:80%"></i><b style="left:${pos}%"></b></div>
    <div class="row sp">${btn(`← Favour the ${d[1]}`, 'bop', 'data-d="-1"', 'sm', '30 political power: the balance moves 12 points left', c.pp < 30)}${btn(`Favour the ${d[2]} →`, 'bop', 'data-d="1"', 'sm', '30 political power: the balance moves 12 points right', c.pp < 30)}</div><div class="dim">${d[3].map((x, i) => `<span${tip(modText(x[1]))}>${i === b ? '<b>' + x[0] + '</b>' : x[0]}</span>`).join(' · ')}</div></div>`;
  const base = _pol(c), i = base.indexOf('<h3'); return i < 0 ? h + base : base.slice(0, i) + h + base.slice(i); }; }
ACT.bop = d => { bopFavour(me(), +d.d); renderAll(); };

// ---------- collaboration governments and warlords ----------
{ const _dip = PANELS.diplomacy; PANELS.diplomacy = function (c) {
  let h = _dip(c), add = ''; const tg = collabTargets(c);
  if (tg.length) add += `<div class="card"><b>🎭 Collaboration governments</b><div class="dim">Hand the enemy provinces you occupy to a government of your choosing. It becomes your subject, calms the occupied land and raises its own troops.</div>${tg.map(e => `<div class="row sp"><span>${cn(e)} <span class="dim">${collabProvs(c, e).length} provinces occupied</span></span>${btn(`Install ${COLLAB_NAME[e.slice(0, 3)] || C(e).adj + ' National Government'}`, 'collab', `data-t="${e}"`, 'sm', '75 political power', c.pp < 75)}</div>`).join('')}</div>`;
  const cl = CLIQUES.map(C).filter(k => k.exists);
  if (cl.length && ['CHI', 'JAP', 'PRC'].includes(c.tag.slice(0, 3))) add += `<div class="card"><b>🏯 The warlords of China</b><table><tr><th>Clique</th><th>Overlord</th><th class="r">Autonomy</th><th class="r">Divisions</th></tr>${cl.map(k => `<tr data-a="diploSel" data-t="${k.tag}" style="cursor:pointer"><td>${cn(k.tag)}</td><td>${k.overlord ? cname(k.overlord) : '<span class="dim">independent</span>'}</td><td class="r">${k.overlord ? Math.round(autonomyOf(k)) : '—'}</td><td class="r">${sum(armiesOf(k.tag), a => a.divs.length)}</td></tr>`).join('')}</table><div class="dim">${c.tag.slice(0, 3) === 'CHI' ? 'The Unification focuses lower a clique\'s autonomy by 25 each; below 25 it is absorbed.' : 'A clique that loses its overlord fights for itself.'}</div></div>`;
  if (!add) return h; const i = h.indexOf('<h3'); return i < 0 ? h + add : h.slice(0, i) + add + h.slice(i); }; }
ACT.collab = d => { const c = me(); if (c.pp < 75) return; if (createCollab(c, d.t)) c.pp -= 75; renderAll(); };

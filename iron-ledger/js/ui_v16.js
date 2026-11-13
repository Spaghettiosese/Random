// 1.6 interface: doctrine, battle reports, map fixes, update notes.
'use strict';
for (const t in NEW_TREES) delete NEW_TREES[t];
UPDATES.unshift(['1.6', 'Reckoning', 'The game was reviewed harshly (4 out of 10; focus trees 3 out of 10) and rebuilt where it scored worst.', [
  ['Focuses now cost something', 'Every focus has a price in political power (10 to 60 ★) and a length that fits its weight (21 to 63 days). Political power also pays for laws, ministers and decisions, so you can no longer do everything. Switching focus returns half the price.'],
  ['The filler is gone', 'About 240 generated focuses per nation (doctrine rows, “X Programme”, “Court the Y”, “Develop Z”) have been deleted. Trees now show only focuses written for that nation. The older European trees are therefore shorter than before; the six Asian trees keep their 230+ hand-written focuses.'],
  ['Requirements you play towards', 'Germany needs divisions before it can march into the Rhineland, Austria or Poland; Japan needs a fleet before it strikes south. Historical dates still bind the AI, but a human may only move early once world tension is high enough. Each requirement shows live progress.'],
  ['Choices', 'Thirty-nine key focuses now end in a decision: bluff into the Rhineland with three battalions or march with nineteen divisions; guns before butter or full shops; strike the fleet at anchor or the oil tanks.'],
  ['A tree you can read', 'Nodes show an icon for what they are, their price, their length, a ⚖ when they end in a choice and ✗ when a requirement is unmet. Hover for the full effect. Select a focus to see the route to it, what it closes for good and what it opens. Drag to pan; the view opens on your current focus.'],
  ['Plan ahead', 'Add a focus, or a whole route, to your plan. Planned focuses start by themselves as soon as each can be afforded, so the clock no longer stops every month.'],
  ['Dispatches: the end of event spam', 'World news and reports are headlines above the map and never pause the game. Decisions wait in a tray with a deadline; if you do not answer, the cabinet does. Only ultimatums, calls to arms and peace terms interrupt. One happening makes one headline, far-away crises are news rather than questions, and notes about other people\'s wars are off by default. Tune it under News → Message settings.'],
  ['New system: Doctrine', 'Army, air and naval doctrine are bought with army experience on the Military tab. One school per service; abandoning it costs most of what you spent. Experience comes from battles, border conflicts and peacetime manoeuvres, and is shared with support companies.'],
  ['Battle reports', 'Select a battle to see why it is going the way it is: air, terrain, forts, entrenchment, generals, weather, supply and support for each side. Your battles are listed on the Military tab.'],
  ['Wars end', 'When a coalition\'s leader capitulates and only its subjects and minor allies remain, they ask for terms. AI wars frozen for a year and a half are settled by armistice. Stacked bonuses now have diminishing returns past 30%.'],
  ['Fixes', 'Starting a focus you cannot take no longer wipes the one in progress. The map can centre on capitals near its edge (Tokyo, Wellington). Country names are placed on the mainland, not between a nation and its islands. Foreign unit counters hide when zoomed out.']
]]);

// ---------- doctrine and manoeuvres on the Military tab ----------
{ const _mil = PANELS.military; PANELS.military = function (c) {
  let h = _mil(c); h = h.replace('</div>', btn('Doctrine', 'sub', 'data-k="military" data-v="doctrine"', UI.sub.military === 'doctrine' ? 'on' : '') + '</div>');
  if (UI.sub.military === 'doctrine') { const ex = exerciseBlock(c); let d = `<div class="row sp"><span>🎖 <b>${Math.floor(c.axp || 0)}</b> army experience <span class="dim">— from battles, border conflicts and manoeuvres</span></span>${btn(`Hold manoeuvres (${fmt(exerciseCost(c))})`, 'exercise', '', 'sm', ex || 'The army trains in the field: experience for money and tired troops. Once every 90 days, in peacetime.', !!ex)}</div>`;
    for (const k in DOCTRINES) { const cur = docOf(c, k); d += `<h3>${DOC_NAME[k]} doctrine</h3>${cur ? `<div class="row sp"><span>School: <b>${DOCTRINES[k][2][cur.p][0]}</b> <span class="dim">${cur.n}/${docSteps(k, cur.p)}</span></span>${btn('Abandon', 'docDrop', `data-k="${k}"`, 'sm', 'All its steps are lost; a little experience is returned')}</div>` : `<div class="dim">${DOCTRINES[k][1]} Choose one school.</div>`}`;
      DOCTRINES[k][2].forEach((path, pi) => { if (cur && cur.p !== pi) return; const n = cur ? cur.n : 0, why = docBlock(c, k, pi), steps = docSteps(k, pi);
        d += `<div class="card${cur ? ' hl' : ''}"><div class="row sp"><b>${path[0]}</b>${n < steps ? btn(`${n ? 'Next step' : 'Adopt'}: ${path[n * 2]} (${docCost(n)} 🎖)`, 'docAdopt', `data-k="${k}" data-p="${pi}"`, 'sm' + (why ? '' : ' pri'), `${modText(kvs(path[n * 2 + 1]))}${why ? '<br><span class="neg">' + why + '</span>' : ''}`, !!why) : '<span class="pos">Complete</span>'}</div><div class="dim">${DOC_BLURB[k][pi]}</div>
          <div class="docrow">${Array.from({ length: steps }, (_, s) => `<span class="docstep${s < n ? ' on' : ''}"${tip(`<b>${path[s * 2]}</b><br>${modText(kvs(path[s * 2 + 1]))}<br><span class="dim">${docCost(s)} army experience</span>`)}>${s + 1}</span>`).join('')}</div></div>`; }); }
    h = h.slice(0, h.indexOf('</div>') + 6) + d; }
  if ((UI.sub.military || 'overview') === 'overview') { const mine = G.battles.map(b => { const att = b.att.map(i => G.armies[i]).filter(Boolean), def = armiesAt(b.prov).filter(a => att.length && atWar(att[0].owner, a.owner)); return { b, att, def, side: att.some(a => a.owner === c.tag) ? 'att' : def.some(a => a.owner === c.tag) ? 'def' : null }; }).filter(x => x.side);
    h += `<h3>Our battles</h3>` + (mine.length ? mine.map(x => `<div class="row sp battlerow" data-a="goProv" data-p="${x.b.prov}"><span>${x.side === 'att' ? '⚔ Attacking' : '🛡 Defending'} <b>${P(x.b.prov).name}</b> <span class="dim">day ${Math.max(1, Math.round(x.b.days))}</span></span><span class="tug"><i style="width:${clamp(x.b.bal * 100, 3, 97)}%"></i></span></div>`).join('') : '<div class="dim">None. Click a battle on the map to see its report.</div>'); }
  return h; }; }
Object.assign(ACT, { docAdopt(d) { adoptDoctrine(me(), d.k, +d.p); renderAll(); }, docDrop(d) { abandonDoctrine(me(), d.k); renderAll(); }, exercise() { if (armyExercise(me())) toast('The army takes the field for manoeuvres.', 'good'); renderAll(); } });

// ---------- battle report: why a battle is going the way it is ----------
function battleFactors(armies, attacking, p, foes) {
  if (!armies.length) return []; const out = [], c = C(armies[0].owner), add = (label, v) => { if (Math.abs(v) >= 0.02) out.push([label, v]); };
  let air = 0, eair = 0; for (const o of new Set(armies.map(a => a.owner))) air += airPower(C(o)); for (const o of new Set(foes.map(a => a.owner))) eair += airPower(C(o)); add('Air power', clamp((air - eair) / Math.max(50, air + eair), -1, 1) * 0.18);
  add(attacking ? 'National attack' : 'National defence', M(c, attacking ? 'atk' : 'def'));
  const g = armies.map(genOf).filter(Boolean).sort((a, b) => b.skill - a.skill)[0]; if (g) add(`${g.name} (${TRAITS[g.trait][0]})`, g.skill * 0.05);
  if (armies.some(a => a.oos)) add('Out of supply', -0.5);
  const n = sum(armies, a => a.divs.length), sup = sum(armies, a => ((a.sup || []).includes('art') ? (attacking ? 0.08 : 0.04) : 0) * a.divs.length + (!attacking && (a.sup || []).includes('eng') ? 0.1 : 0) * a.divs.length) / Math.max(1, n); add('Support companies', sup);
  if (attacking) { const k = weatherKey(p.id); if (k !== 'clear') add(WEATHER[k][0], (k === 'winter' && winterReady(c) ? 0.95 : WEATHER[k][2]) - 1); if (armies.some(a => (NB[a.loc].find(e => e.to === p.id) || {}).sea)) add('Attack across water', -0.5); add('Ground-attack aircraft', Math.max(0, M(c, 'cas')) * 0.3); if (armies.some(a => a.divs.some(d => d.t === 'arm')) && 'mjsu'.includes(p.ter)) add('Armour in bad terrain', -0.4); }
  else { add(`${TERRAIN[p.ter][0]} terrain`, TERRAIN[p.ter][1]); add(`Fort level ${p.fort}`, p.fort * 0.12); const dug = Math.max(...armies.map(a => a.dug || 0)); add('Dug in', Math.min(10, dug) * 0.02 * (1 + M(c, 'entrench') * 4)); }
  const org = sum(armies, a => sum(a.divs, d => d.org)) / Math.max(1, n); if (org < 0.5) add('Exhausted troops', -(0.7 * (1 - org)));
  return out;
}
{ const _rp = renderProv; renderProv = function () { _rp(); if (SEL.prov === null) return; const p = P(SEL.prov), b = G.battles.find(x => x.prov === p.id); if (!b) return; const att = b.att.map(i => G.armies[i]).filter(Boolean), def = armiesAt(p.id).filter(a => att.length && atWar(att[0].owner, a.owner)); if (!att.length || !def.length) return;
  const chips = l => l.length ? l.map(f => `<span class="fchip ${f[1] > 0 ? 'pos' : 'neg'}">${f[1] > 0 ? '+' : ''}${Math.round(f[1] * 100)}% ${f[0]}</span>`).join('') : '<span class="dim">no advantages</span>';
  $('provinfo').insertAdjacentHTML('beforeend', `<div class="card breport"><b>Battle report</b><div><span class="dim">Attacker — ${cname(att[0].owner)}:</span> ${chips(battleFactors(att, true, p, def))}</div><div><span class="dim">Defender — ${cname(def[0].owner)}:</span> ${chips(battleFactors(def, false, p, att))}</div><div class="dim">Up to 12 divisions fight at once on each side; the rest wait in reserve.</div></div>`); }; }

// ---------- map: names on the mainland, capitals near the edge can be centred ----------
computeLabels = function () {
  const acc = {}, seen = new Set();
  for (const c of alive()) { const cap = P(c.capital); if (!cap || cap.owner !== c.tag) continue; const q = [c.capital]; seen.add(c.capital); const a = acc[c.tag] = [0, 0, 0];
    while (q.length) { const id = q.pop(), m = MAP.P[id], w = PAREA[id] + 50; a[0] += m.x * w; a[1] += m.y * w; a[2] += w; for (const e of NB[id]) if (!e.sea && !seen.has(e.to) && P(e.to).owner === c.tag && Math.hypot(MAP.P[e.to].x - MAP.P[c.capital].x, MAP.P[e.to].y - MAP.P[c.capital].y) < 1500) { seen.add(e.to); q.push(e.to); } } }
  MV.labels = Object.keys(acc).map(t => ({ t, x: acc[t][0] / acc[t][2], y: acc[t][1] / acc[t][2], size: Math.sqrt(acc[t][2]) }));
};
clampView = function () { const mn = Math.max(MV.w / MAP.W, MV.h / MAP.H * 0.6); MV.s = clamp(MV.s, mn, 4); const vw = MV.w / MV.s, over = vw * 0.4; MV.x = clamp(MV.x, -over, Math.max(-over, MAP.W - vw + over)); MV.y = clamp(MV.y, -100, Math.max(-100, MAP.H - MV.h / MV.s + 100)); };

// ---------- menu: message settings; game rules: unambiguous names ----------
{ const _menu = ACT.menu; ACT.menu = function (...a) { const _p = UIH.popup; UIH.popup = p => { p.modal = true; p.options.splice(1, 0, { name: 'Message settings', fn: () => ACT.messages() }); _p(p); }; try { _menu.apply(this, a); } finally { UIH.popup = _p; } }; }
const RULE_NAME = { GER: 'Germany', ITA: 'Italy', JAP: 'Japan', SOV: 'USSR', ENG: 'Britain', FRA: 'France', USA: 'USA', CHI: 'China' };
{ const _ss = startScreen; startScreen = function (...a) { const r = _ss(...a); document.querySelectorAll('#start [data-a=ruleStr]').forEach(b => { const t = b.dataset.t, s = MENU.rules.str[t]; b.textContent = RULE_NAME[t] + (s > 0 ? ' ▲' : s < 0 ? ' ▼' : ''); }); return r; }; }

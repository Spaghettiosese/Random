// Main menu: title screen, country selection, update notes and help.
'use strict';
const MENU = { screen: 'main', tag: 'GER', hist: true };
const BLURB = {
  GER: 'Rearm, expand, and gamble on a short war — or topple the regime and choose between Kaiser, republic, generals and revolution.', SOV: 'Industrialise at breakneck speed. Purge the army, or trust it.', USA: 'End the Depression and decide when isolation ends.',
  ENG: 'Hold an empire together while the dictators rise.', FRA: 'A paralysed republic behind the Maginot Line.', ITA: 'A new Roman empire, or a turn against Berlin.', JAP: 'Army or Navy: strike north, or strike south.', CHI: 'Unite the warlords and survive the coming invasion.',
  HUN: 'A kingdom without a king. Revise Trianon with Berlin, crown a Habsburg, or find a third way.', AUT: 'A small state in the shadow of a large one. Resist, submit, or restore the Dual Monarchy.', POL: 'Between two giants with long memories.', SPA: 'A country about to tear itself in two.', TUR: 'The young republic guards the Straits.'
};
const NEW_TREES = { USA: 1, ENG: 1, FRA: 1 };
const UPDATES = [
  ['1.2', 'Allied Nations', 'The second major update: the democracies get their due.', [
    ['United States reworked', 'A 119-focus tree: the New Deal and its rivals, isolation or intervention, Lend-Lease and the road to war, the production miracle, and separate army, navy, air corps and science branches.'],
    ['United Kingdom reworked', 'A 133-focus tree: appeasement or defiance, the abdication, a Labour or Blackshirt Britain, the Empire and India, the Grand Alliance, and full branches for industry, army, Royal Navy, RAF and science.'],
    ['France reworked', 'A 102-focus tree: the Popular Front, the National Bloc or the Leagues, the Little Entente, the Maginot Line against de Gaulle\'s armoured corps, fighting on from Algiers, and the Empire.'],
    ['New feature: Intelligence Agency', 'Found an agency and run covert operations from the new Intel tab: steal blueprints, sabotage industry, spread propaganda, incite unrest, infiltrate an enemy general staff, or stage a coup. The AI spies on you too.'],
    ['New feature: Lend-Lease', 'Set a standing share of your war production to ship to a country at war, from its Diplomacy page. Blockades sink part of each shipment.'],
    ['Puppet system', 'Subjects now have an autonomy score and four levels, from Integrated Puppet to Associated State, each paying a different tribute. As overlord you can tighten or loosen control, levy manpower, raise colonial divisions, invest, annex or free them. As a subject you can seek autonomy or declare independence. Nations whose homelands you hold can be released as puppets.'],
    ['Army rework', 'A new Recruit tab: raise divisions one, five or ten at a time, choose where they muster, form new armies from recruits, and see or cancel every division in training. Armies can be renamed, and single divisions detached or transferred.'],
    ['Mass selection', 'Click a counter to select the whole stack, Shift-click to add stacks, Shift-drag to box-select, or use Select all / Select idle. Right-click moves everything selected.'],
    ['Right-click diplomacy', 'With no army selected, right-click any foreign country on the map to open its diplomacy page.'],
    ['Auto-build and auto-trade', 'Let planners keep your construction queue filled (Balanced, Civilian or Military), and let diplomats sign trade agreements for you. A new Trade tab shows what each good imports and exports and lets you ban either. Trade agreements now raise trade openness.'],
    ['Smaller changes', 'Britain, the Dominions and India can now be strengthened through the British tree; Ethiopia can be restored.']]],
  ['1.1.1', 'Götterdämmerung hotfix', 'Fixes and national modifiers.', [
    ['Anschluss and Sudetenland', 'The historical timetable now binds only the AI: as a player you can take these focuses as soon as their other requirements are met. The Sudeten crisis resolves in two weeks, and you are told when a demand is delivered and when it is accepted.'],
    ['National modifiers', 'Every major power starts with strengths and handicaps. China suffers Rampant Corruption and an Inept Officer Corps; Italy has Industrial Weakness; France fights by Methodical Battle; the United States has a Constabulary Army but is an Industrial Giant; and more. Focuses and two new decisions remove the handicaps.'],
    ['Country selection', 'National modifiers are shown before you start.']]],
  ['1.1', 'Götterdämmerung', 'The first major update.', [
    ['Germany reworked', 'A new national focus tree with more than 260 focuses in eight sections: foreign policy, party and state, a four-way opposition path (Kaiser, generals, republic, council republic), economy, army, air force, navy and secret weapons.'],
    ['Hungary', 'A 90-focus tree: the Regent\'s balancing act, the Vienna Awards, a Habsburg restoration and the Dual Monarchy, a democratic opening, Hungarism, and a second council republic.'],
    ['Austria', 'A 75-focus tree: defy the Anschluss or accept it (and continue as Germany), bring Otto home, restore Red Vienna, and build an Alpine fortress.'],
    ['New feature: Special Projects', 'Fifteen secret programmes — radar networks, code-breaking, jet fighters, ballistic missiles, the atomic pile and the bomb — researched one at a time in a new Projects tab. Focuses and universities speed them up.'],
    ['Hourly clock', 'Time now advances hour by hour. Armies march and battles are fought through the day, and all five game speeds are slower and easier to follow.'],
    ['New main menu', 'A title screen, a country selection screen with details for every nation, and these update notes.'],
    ['Focus tree navigation', 'Large trees have section buttons that jump straight to a branch.']]],
  ['1.0', 'Release', 'The original game.', [
    ['World of 1936', '754 provinces, 73 countries, a market economy, interest-group politics, focus trees, armies and generals, diplomatic plays, events and decisions.']]]
];
function menuBackdrop() {
  const cv = document.getElementById('menubg'); if (!cv) return; const w = cv.width = Math.min(1800, innerWidth * 1.2), h = cv.height = Math.min(1100, innerHeight * 1.2), ctx = cv.getContext('2d');
  const rows = PROV_RAW.trim().split('\n').map(l => l.split('|')), s = Math.max(w / 2300, h / 1250), ox = 3650, oy = 620;
  ctx.fillStyle = '#121b24'; ctx.fillRect(0, 0, w, h); ctx.setTransform(s, 0, 0, s, -ox * s, -oy * s); ctx.lineJoin = 'round';
  MAP.P.forEach((p, i) => { const col = (COUNTRY_DEF[rows[i][4]] || {}).c || '#555'; ctx.beginPath(); for (const r of p.poly) { for (let k = 0; k < r.length; k += 2) k ? ctx.lineTo(r[k], r[k + 1]) : ctx.moveTo(r[k], r[k + 1]); ctx.closePath(); } ctx.fillStyle = col; ctx.globalAlpha = 0.42; ctx.fill(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#0a0f14'; ctx.lineWidth = 1.2 / s; ctx.stroke(); });
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
}
function countryFacts(t) { const rows = PROV_RAW.trim().split('\n').map(l => l.split('|')).filter(f => f[4] === t), d = COUNTRY_DEF[t]; return { provs: rows.length, pop: rows.reduce((a, f) => a + +f[5], 0), divs: Object.values(d.army || {}).reduce((a, b) => a + b, 0), ind: rows.reduce((a, f) => a + +f[6] * +f[5], 0) }; }
function startScreen() {
  initStatic(); const el = document.getElementById('start'); el.hidden = false; let save = null; try { save = localStorage.getItem(SAVE_KEY); } catch (e) { }
  const shell = inner => `<canvas id="menubg"></canvas><div class="menuveil"></div>${inner}<div class="menuver">Version ${VERSION} · Map data: Natural Earth</div>`;
  if (MENU.screen === 'main') {
    el.innerHTML = shell(`<div class="menumain"><div class="logo"><div class="eyebrow">A grand strategy game</div><h1>Iron <span>Ledger</span></h1><div class="year">1936</div></div>
      <nav class="menubtns"><button class="pri" data-a="menuGo" data-s="select">New Game</button>${save ? '<button data-a="loadGame">Continue</button>' : ''}<button data-a="menuGo" data-s="updates">Updates <span class="badge">1.2</span></button><button data-a="menuGo" data-s="help">How to Play</button></nav>
      <div class="menunews" data-a="menuGo" data-s="updates"><div class="eyebrow">Latest update</div><b>Allied Nations</b><span>Large new focus trees for the United States, the United Kingdom and France, an Intelligence Agency, and Lend-Lease.</span></div></div>`);
  } else if (MENU.screen === 'select') {
    const majors = Object.keys(COUNTRY_DEF).filter(t => COUNTRY_DEF[t].maj), minors = Object.keys(COUNTRY_DEF).filter(t => !COUNTRY_DEF[t].maj).sort((a, b) => (NEW_TREES[b] || 0) - (NEW_TREES[a] || 0) || COUNTRY_DEF[a].n.localeCompare(COUNTRY_DEF[b].n));
    const d = COUNTRY_DEF[MENU.tag], f = countryFacts(MENU.tag), tree = TREES[MENU.tag], n = tree ? tree.length : 31;
    const item = t => `<button class="pickrow${t === MENU.tag ? ' on' : ''}" data-a="pick" data-t="${t}"><span class="flag" style="background:${COUNTRY_DEF[t].c}"></span><span>${COUNTRY_DEF[t].n}</span>${NEW_TREES[t] ? '<span class="badge">New tree</span>' : ''}</button>`;
    el.innerHTML = shell(`<div class="menusel"><div class="sellist"><div class="row sp"><h2>Choose your nation</h2><button data-a="menuGo" data-s="main">← Back</button></div><h3>Major powers</h3><div class="pickgrid">${majors.map(item).join('')}</div><h3>Other nations</h3><div class="pickgrid">${minors.map(item).join('')}</div></div>
      <div class="seldetail"><div class="bigflag" style="background:${d.c}"></div><h2>${d.n}</h2><div><span class="pill" style="background:${IDEO[d.i][1]}">${IDEO[d.i][0]}</span> ${d.maj ? '<span class="pill">Major power</span>' : ''}${d.ov ? `<span class="pill">Subject of ${COUNTRY_DEF[d.ov].n}</span>` : ''}</div>
        <div>${d.ld} <span class="dim">· ${d.p}</span></div><p>${BLURB[MENU.tag] || 'Chart your own course through the gathering storm.'}</p>
        <div class="kv"><span>Provinces</span><span>${f.provs}</span><span>Population</span><span>${f.pop.toFixed(1)}M</span><span>Divisions</span><span>${f.divs}</span><span>Literacy</span><span>${(d.lit * 100).toFixed(0)}%</span><span>National focus tree</span><span>${n} focuses${tree ? ' · unique' : ' · generic'}</span></div>
        ${d.sp ? `<div class="row">${d.sp.map(s => `<span class="spirit"${tip(`<b>${SPIRITS[s][0]}</b><br><i>${SPIRITS[s][1]}</i><br>${modText(SPIRITS[s][2])}`)}>✦ ${SPIRITS[s][0]}</span>`).join('')}</div>` : ''}
        ${d.g ? `<div class="dim">Generals: ${d.g.slice(0, 4).map(g => g[0]).join(', ')}${d.g.length > 4 ? '…' : ''}</div>` : ''}
        <label class="row"><input type="checkbox" id="hist" data-ch="hist"${MENU.hist ? ' checked' : ''}> <span>Historical AI <span class="dim">— other nations follow history's timetable</span></span></label>
        <button class="pri play" data-a="startGame">Play as ${d.n}</button></div></div>`);
  } else if (MENU.screen === 'updates') {
    el.innerHTML = shell(`<div class="menudoc"><div class="row sp"><h2>Updates</h2><button data-a="menuGo" data-s="main">← Back</button></div>${UPDATES.map(u => `<section><div class="eyebrow">Version ${u[0]}</div><h2 class="upd">${u[1]}</h2><p class="dim">${u[2]}</p>${u[3].map(x => `<div class="updrow"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</section>`).join('')}</div>`);
  } else {
    el.innerHTML = shell(`<div class="menudoc"><div class="row sp"><h2>How to Play</h2><button data-a="menuGo" data-s="main">← Back</button></div>
      ${[['The clock', 'Time runs hour by hour. Space pauses; + and − change speed. The game pauses itself for events.'], ['National focus', 'Pick one focus at a time. Large trees have section buttons. Dashed lines mean “any one of these”; struck-out focuses are excluded by a choice you made.'], ['Economy', 'Buildings turn goods into other goods. A good that costs far more than its base price is in shortage: build what makes it, or open trade. Keep the weekly balance positive.'], ['Politics', 'Interest groups in government give legitimacy. Laws pass more easily when the governing groups like them.'], ['Military', 'Raise divisions in Military → Recruit; they need manpower (set by your conscription law) and draw equipment from the stockpile your war industry fills. Click an army counter to select the stack, or Shift-drag a box, then right-click a province to march. Armies set to Auto are run by your staff.'], ['Subjects', 'Open a subject in Diplomacy to manage its autonomy. Right-click any foreign country on the map to open its page.'], ['Automation', 'Auto-build is at the top of the Build tab; auto-trade is in Economy → Trade.'], ['Diplomacy', 'A diplomatic play presses a demand. Other countries take sides; after a few weeks the target yields or fights.'], ['Special Projects', 'Choose one secret programme at a time in the Projects tab. Universities and certain focuses speed the work.'], ['Intelligence', 'Found an agency with political power, then spend influence on operations against a chosen country. Higher agency levels raise your odds and let you run more at once.'], ['Lend-Lease', 'Open a country at war in Diplomacy and choose a share of your war production to send every week.']].map(x => `<div class="updrow"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>`);
  }
  menuBackdrop();
}
const MENU_ACT = {
  menuGo(d) { MENU.screen = d.s; startScreen(); },
  pick(d) { MENU.tag = d.t; const sc = document.querySelector('.sellist'), st = sc ? sc.scrollTop : 0; startScreen(); const s2 = document.querySelector('.sellist'); if (s2) s2.scrollTop = st; }
};

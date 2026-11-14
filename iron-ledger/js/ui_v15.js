// 1.5 interface: game rules on the setup screen, border conflicts, embargoes, support companies, air missions.
'use strict';
for (const t in NEW_TREES) delete NEW_TREES[t]; NEW_TREES.JAP = NEW_TREES.CHI = NEW_TREES.PRC = NEW_TREES.PHI = NEW_TREES.MON = NEW_TREES.MAN = 1;
Object.assign(BLURB, { JAP: 'Four roads out of the February snow: the Imperial Way, the Control Faction, a civilian purge or a people\'s front. Then north, or south.', CHI: 'Survive Xi\'an, bring five warlords to heel one by one, and fight the War of Resistance.', PRC: 'From the caves of Yan\'an: build base areas behind the lines, choose your enemy, and march on Peking.', PHI: 'Ten years to independence — or sooner, or never. Seven thousand islands to defend.', MON: 'The Marshal, the defiant premier, the living Buddha or the scholar: four Mongolias between two giants.', MAN: 'An emperor without power. Serve Tokyo well, restore the Qing, return to China, or raise the red banner in the forest.' });
UPDATES.unshift(['1.5', 'Dragon and Sun', 'Asia done properly: six trees written by hand, and five new systems.', [
  ['Six trees rebuilt by hand', 'Japan, China, Communist China, the Philippines and Mongolia are rewritten from nothing, and Manchukuo gets its first tree. Every one is over 230 focuses with no generic filler: every focus is specific to that nation. Each political road now runs fifteen to twenty-five focuses deep.'],
  ['Japan', 'The Imperial Way, the Control Faction, the civilian purge and the people\'s front are each a full road. The China Incident, the northern and southern strikes and the Axis each have their own branch, alongside economy, army, navy, air and science.'],
  ['China and Communist China', 'China starts with the Xi\'an Incident, deals with each warlord through his own branch, and has new Diplomacy and Culture sections. The Communists gain the Hidden Front, the Peoples of the Frontier and Party-building.'],
  ['The Philippines, Mongolia, Manchukuo', 'The Philippines can seek statehood, follow the Sakdals or the peasant unions. Mongolia has four rulers to choose from and a section for its provinces and its faith. Manchukuo can serve Tokyo, restore the Qing, return to China or go red — and may find the great oilfield.'],
  ['New feature: Border Conflicts', 'Fight without declaring war. Provoke a conflict from the Diplomacy tab (or through focuses): armies on the frontier fight for six weeks, the winner gains prestige and experience, and may take a claimed border province. The AI does it too.'],
  ['New feature: Embargoes', 'Embargo a nation from the Diplomacy tab. The more of the world economy that embargoes a country, the harder its trade and output are hit. Democracies embargo aggressors on their own.'],
  ['New feature: Support Companies and Army Experience', 'Armies earn experience from training, battles and border conflicts. Spend it on up to three support companies per army: artillery, engineers, reconnaissance, a field hospital or signals.'],
  ['New feature: Air Missions', 'Give the air force a mission from the Military tab: air superiority, ground support, strategic bombing, naval strike or home defence.'],
  ['New feature: Game Rules', 'On the nation screen choose a difficulty and strengthen or weaken any of eight powers before the game begins.'],
  ['Also', 'Focus prerequisites can now be alternatives of groups. Balance of Power comes to Manchukuo (Court against Garrison). New effect commands let focuses change autonomy, rename the state, move the capital, start border conflicts and sign separate peaces.']
]]);

// ---------- game rules on the nation screen ----------
MENU.rules = { diff: 'normal', str: {}, opt: {} };
{ const _ss = startScreen; startScreen = function (...a) { const r = _ss(...a); if (MENU.screen !== 'select') return r; const b = document.querySelector('#start .seldetail .play'); if (!b) return r; const R = MENU.rules;
  b.insertAdjacentHTML('beforebegin', `<div class="rules"><div class="eyebrow">Game rules</div><div class="row"><span class="dim">Difficulty</span>${Object.keys(RULE_DIFF).map(k => `<button class="sm${R.diff === k ? ' on' : ''}" data-a="ruleDiff" data-k="${k}">${RULE_DIFF[k][0]}</button>`).join('')}</div>
    <div class="row"><span class="dim">Strengthen or weaken</span>${RULE_TAGS.map(t => `<button class="sm${R.str[t] ? ' on' : ''}" data-a="ruleStr" data-t="${t}" title="Click to cycle: normal, stronger, weaker">${COUNTRY_DEF[t].n.split(' ')[0]}${R.str[t] > 0 ? ' ▲' : R.str[t] < 0 ? ' ▼' : ''}</button>`).join('')}</div>
    <div class="row">${Object.keys(RULE_OPT).map(k => `<button class="sm${R.opt[k] ? ' on' : ''}" data-a="ruleOpt" data-k="${k}" title="${RULE_OPT[k][1]}">${RULE_OPT[k][0]}</button>`).join('')}</div></div>`); return r; }; }
Object.assign(ACT, { ruleDiff(d) { MENU.rules.diff = d.k; startScreen(); }, ruleStr(d) { const s = MENU.rules.str; s[d.t] = s[d.t] > 0 ? -1 : s[d.t] < 0 ? 0 : 1; startScreen(); }, ruleOpt(d) { MENU.rules.opt[d.k] = !MENU.rules.opt[d.k]; startScreen(); } });

// ---------- diplomacy: border conflicts and embargoes ----------
DIPLO.clash = { name: 'Provoke Border Conflict', cost: 40, can: (a, b) => !clashBlock(a, b), ai: () => true, do: (a, b) => { startClash(a, b, true); }, tip: 'Six weeks of fighting on the frontier without a declaration of war. The winner gains political power and army experience, and may take a claimed border province. Mass armies on the border first.' };
DIPLO.embargo = { name: 'Embargo', cost: 25, can: (a, b) => !embargoBlock(C(a), b) && !embargoing(C(a), b) && !atWar(a, b), ai: () => true, do: (a, b) => { setEmbargo(C(a), b, true, true); }, tip: 'Stop trading with them. The larger the share of the world economy that embargoes a nation, the worse its trade and output suffer. Relations -25.' };
DIPLO.unembargo = { name: 'Lift Embargo', cost: 5, can: (a, b) => embargoing(C(a), b), ai: () => true, do: (a, b) => { setEmbargo(C(a), b, false); }, tip: 'Resume trade. Relations +10.' };
{ const _w = PANELS.wars; PANELS.wars = function (c) {
  let h = _w(c); const cl = G.clashes || [];
  h += `<h3>Border conflicts</h3>` + (cl.length ? cl.map(k => { const r = k.sa / Math.max(0.01, k.sa + k.sb), mine = k.a === c.tag || k.b === c.tag; return `<div class="card${mine ? ' hl' : ''}"><div class="row sp"><span>${cn(k.a)} <span class="dim">against</span> ${cn(k.b)}</span><span class="dim">${Math.max(0, k.end - G.day)} days left</span></div><div class="dim">Near ${P(k.prov).name}</div>${bar(k.sa + k.sb ? r : 0.5)}</div>`; }).join('') : '<div class="dim">None. Provoke one from the Diplomacy tab.</div>');
  const em = []; for (const x of alive()) if (x.emb) for (const t in x.emb) if (ok(t)) em.push([x.tag, t]);
  h += `<h3>Embargoes</h3>` + (em.length ? `<table>${em.slice(0, 30).map(e => `<tr><td>${cn(e[0])}</td><td class="dim">embargoes</td><td>${cn(e[1])}</td></tr>`).join('')}</table>` : '<div class="dim">No embargoes are in force.</div>');
  if (c.embTier) h += `<div class="warn">We are under embargo: ${SPIRITS['embargoed_' + c.embTier][0]} (${Math.round(embargoWeight(c) * 100)}% of the world economy).</div>`; return h; }; }

// ---------- military: support companies, experience, air missions ----------
{ const _ac = armyCard; armyCard = function (c, a) { const h = _ac(c, a), sup = a.sup || [];
  const card = `<div class="card"><div class="row sp"><b>Support companies (${sup.length}/${SUP_MAX})</b><span${tip('Earned by training, in battle and in border conflicts')}>🎖 ${Math.floor(c.axp || 0)} army experience</span></div>
    <div class="row">${sup.map(k => `<span class="pill"${tip(SUPPORT[k][1])}>${SUPPORT[k][2]} ${SUPPORT[k][0]} <a data-a="supDel" data-k="${k}" data-i="${a.id}" style="cursor:pointer">✕</a></span>`).join('') || '<span class="dim">None attached.</span>'}</div>
    <div class="row">${Object.keys(SUPPORT).filter(k => !sup.includes(k)).map(k => { const why = supportBlock(c, a, k); return btn(`${SUPPORT[k][2]} ${SUPPORT[k][0]}`, 'supAdd', `data-k="${k}" data-i="${a.id}"`, 'sm', `${SUPPORT[k][1]}<br><span class="dim">${SUP_COST} army experience</span>${why ? '<br><span class="neg">' + why + '</span>' : ''}`, !!why); }).join('')}</div></div>`;
  return h + card; };
 }
Object.assign(ACT, { supAdd(d) { const a = G.armies[+d.i]; if (a && a.owner === G.player) addSupport(a, d.k); renderAll(); }, supDel(d) { const a = G.armies[+d.i]; if (a && a.owner === G.player) removeSupport(a, d.k); renderAll(); }, airm(d) { setAirMission(me(), d.k); renderAll(); } });

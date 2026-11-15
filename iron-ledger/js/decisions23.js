// 2.3 Unique decisions for every nation: an engine that reads decisions written as text, new effects that act on
// provinces (floods, scorched earth, minefields, fortified zones, evacuations, famine relief) and the urgent decisions
// the AI takes when the moment comes (the Yellow River dikes when the Japanese reach Zhengzhou, Moscow's defence lines...).
'use strict';
// ---------- effects on provinces ----------
const dProvs = v => csv(v).map(n => PN(n)).filter(Boolean);
const dDays = v => { const m = String(v).trim().match(/^(\d+)\s+(.*)$/); return m ? [+m[1], m[2]] : [365, String(v).trim()]; };
const dMonths = d => d >= 9000 ? 'for good' : d >= 60 ? `for ${Math.round(d / 30)} months` : `for ${d} days`;
function dFlood(c, ps, days) { for (const p of ps) { pmAdd(p, 'flooded', days, true); p.dmg = Math.max(p.dmg, 0.4); delete p.cq; civDeath(p, p.pop * 0.012, warOf(c.tag, p.ctrl), 'flood');
    for (const a of armiesAt(p.id)) for (const d of a.divs) { d.str *= 0.86; d.org = Math.min(d.org, 0.2); }
    for (const b of G.battles.filter(x => x.prov === p.id)) { for (const i of b.att) { const a = G.armies[i]; if (a) { a.path = []; a.prog = 0; a.battle = 0; } } G.battles.splice(G.battles.indexOf(b), 1); }
    for (const e of NB[p.id]) if (!e.sea) pmAdd(P(e.to), 'refugees', Math.min(days, 240), true); }
  UIH.mapDirty(); }
function dBurn(c, ps, days) { for (const p of ps) { if (p.ctrl !== c.tag) continue; for (const t in p.b) if (['steel', 'tools', 'chem', 'arms', 'artyf', 'tankp', 'aircraftp', 'engines', 'autos', 'coalm', 'ironm', 'oilr', 'power', 'railway', 'synth'].includes(t)) { p.b[t] = Math.floor(p.b[t] * 0.5); if (!p.b[t]) delete p.b[t]; }
    p.scorched = G.day; p.dmg = Math.max(p.dmg, 0.5); pmAdd(p, 'scorched', days, true); } UIH.mapDirty(); }
function dEvac(c, ps) { let n = 0; for (const p of ps) { if (p.ctrl !== c.tag || p.owner !== c.tag || typeof evLevels !== 'function' || !evLevels(p)) continue; const to = evSafeProv(c); if (!to || to.id === p.id) continue; const bld = {};
    for (const t of EV_TYPES) if (p.b[t]) { const k = Math.ceil(p.b[t] * 0.9); bld[t] = k; p.b[t] -= k; if (!p.b[t]) delete p.b[t]; } evQ().push({ owner: c.tag, from: p.id, to: to.id, bld, arrive: G.day + 50 }); n++; }
  if (n && c.tag === G.player) UIH.notify(`The factories of ${n} province${n > 1 ? 's' : ''} are on the trains to the interior. They will work again in about seven weeks.`, 'good'); }
Object.assign(XTOK, {
  flood: v => { const [d, l] = dDays(v); return [c => dFlood(c, dProvs(l), d), `🌊 The waters cover ${csv(l).join(', ')} ${dMonths(d)}: armies there are swept away and none can advance through; the people drown or flee`]; },
  pmod: v => { const i = v.indexOf(' '), id = v.slice(0, i), [d, l] = dDays(v.slice(i + 1)); return [c => dProvs(l).forEach(p => pmAdd(p, id, d)), `${PMOD[id][1]} ${PMOD[id][0]} at ${csv(l).join(', ')} ${dMonths(d)}`]; },
  burn: v => { const [d, l] = dDays(v); return [c => dBurn(c, dProvs(l), d), `🔥 Scorched earth at ${csv(l).join(', ')}: half the industry destroyed, nothing left for an invader ${dMonths(d)}`]; },
  mines: v => { const [d, l] = dDays(v); return [c => dProvs(l).forEach(p => { if (p.ctrl === c.tag) pmAdd(p, 'mined', d); }), `💣 Minefields at ${csv(l).join(', ')} ${dMonths(d)} (attackers -15%)`]; },
  dig: v => { const [d, l] = dDays(v); return [c => dProvs(l).forEach(p => { if (p.ctrl === c.tag) { pmAdd(p, 'dug', d); p.fort = Math.min(10, p.fort + 1); } }), `🪖 Fortified zones at ${csv(l).join(', ')} ${dMonths(d)} (defenders +12%, forts +1)`]; },
  relief: v => [c => dProvs(v).forEach(p => { if (p.pm) delete p.pm.famine; p._pe = null; }), `Famine relief for ${csv(v).join(', ')}`],
  famine: v => { const [d, l] = dDays(v); return [c => dProvs(l).forEach(p => pmAdd(p, 'famine', d)), `🍞 Famine at ${csv(l).join(', ')} ${dMonths(d)}`]; },
  martial: v => { const [d, l] = dDays(v); return [c => dProvs(l).forEach(p => pmAdd(p, 'martial', d)), `⛓ Martial law at ${csv(l).join(', ')} ${dMonths(d)}`]; },
  oilfire: v => { const [d, l] = dDays(v); return [c => dProvs(l).forEach(p => { if (p.ctrl === c.tag) { pmAdd(p, 'oilfire', d); if (p.b.oilr) p.b.oilr = Math.floor(p.b.oilr / 2); } }), `🛢️ The oil fields of ${csv(l).join(', ')} are set alight ${dMonths(d)}`]; },
  evacp: v => [c => dEvac(c, dProvs(v)), `The factories of ${csv(v).join(', ')} are carried to the interior (about 70% arrive)`],
  spawn: v => { const m = v.trim().match(/^(\w+) (\d+) (.*)$/); return [c => { const p = PN(m[3]); spawnDivisions(c, m[1], +m[2], p && (p.ctrl === c.tag) ? p.id : c.capital); }, `${m[2]} ${UNITS[m[1]] ? UNITS[m[1]].name : m[1]} division${+m[2] > 1 ? 's' : ''} raised at ${m[3]}`]; },
  heal: v => [c => { for (const a of armiesOf(c.tag)) for (const d of a.divs) d.org = Math.min(1, d.org + +v / 100); }, `All our divisions recover ${v}% organisation`],
  setflag: v => [c => { c.flags[v.trim()] = G.day; }, '']
});
// ---------- requirements ----------
const dEnemyNear = (c, p) => !!p && (atWar(c.tag, p.ctrl) || NB[p.id].some(e => !e.sea && (atWar(c.tag, P(e.to).ctrl) || armiesAt(e.to).some(a => atWar(c.tag, a.owner)))) || armiesAt(p.id).some(a => atWar(c.tag, a.owner)));
Object.assign(REQX, {
  near: v => [c => csv(v).some(n => dEnemyNear(c, PN(n))), `The enemy is at ${csv(v).join(' or ')}`],
  lost: v => [c => csv(v).some(n => { const p = PN(n); return p && atWar(c.tag, p.ctrl); }), `The enemy holds ${csv(v).join(' or ')}`],
  safe: v => [c => csv(v).every(n => { const p = PN(n); return p && !atWar(c.tag, p.ctrl); }), `We still hold ${csv(v).join(', ')}`],
  before: v => { const [y, m] = v.split('-').map(Number); return [() => G.day < mjDay(y, m || 1), `Before ${['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m || 1]} ${y}`]; },
  cf: v => [c => !!c.flags[v], ''],
  ncf: v => [c => !c.flags[v], ''],
  hist: () => [() => !!G.historical, 'Historical course'],
  major: () => [c => !!c.major, 'A great power'],
  pp: v => [c => c.pp >= +v, `${v} political power`]
});
// ---------- the text format ----------
// "# TAG,TAG | Category" starts a block; then "id | Name | cost | effects | description | options".
// options: once; cd N (days); ai N (0..1, how keen the AI is); urgent (the AI takes it as soon as it is possible);
// req ... (requirements to take it); vis ... (shown only when); aiif ... (the AI only takes it when); date Y-M; until Y-M
const UNIQUE_DEC = {};
function autoDecisions(text) { let tags = null, cat = null;
  for (const raw of text.trim().split('\n')) { const line = raw.trim(); if (!line) continue;
    if (line.startsWith('#')) { const [t, k] = line.slice(1).split('|').map(s => s.trim()); tags = csv(t); cat = k || COUNTRY_DEF[tags[0]].n; continue; }
    const f = line.split('|').map(s => s.trim()); if (f.length !== 6) throw new Error('Bad decision line: ' + line); const [id0, name, cost, eff, desc, opts] = f, id = 'u_' + tags[0].toLowerCase() + '_' + id0;
    if (DECISIONS[id]) throw new Error('Duplicate decision ' + id); const x = { cd: 99999, ai: 0.05 }; let req = null, vis = null, aiif = null; const myTags = tags.slice();
    for (let t of opts.split(';')) { t = t.trim(); if (!t) continue; const i = t.indexOf(' '), k = i < 0 ? t : t.slice(0, i), v = i < 0 ? '' : t.slice(i + 1).trim();
      if (k === 'once') x.once = true; else if (k === 'cd') x.cd = +v; else if (k === 'ai') x.ai = +v; else if (k === 'urgent') x.urgent = true;
      else if (k === 'req') req = req ? both(req, parseReq(v)) : parseReq(v); else if (k === 'vis') vis = vis ? both(vis, parseReq(v)) : parseReq(v); else if (k === 'aiif') aiif = parseReq(v);
      else if (k === 'date') { const [y, m] = v.split('-').map(Number); const r = dateReq(y, m); req = req ? both(req, r) : r; }
      else if (k === 'until') { const r = REQX.before(v); vis = vis ? both(vis, r) : r; }
      else throw new Error('Unknown decision option ' + t + ' in ' + id); }
    if (x.once) x.cd = 99999; const e = fx(eff, desc);
    DECISIONS[id] = D(name, cat, +cost, desc, e, Object.assign(x, { tags: myTags, unique: true,
      visible: c => myTags.includes(c.tag.slice(0, 3)) && (!vis || vis[0](c)),
      avail: c => req && !req[0](c) ? 'Requires: ' + req[1].split('; ').filter(Boolean).join('; ') : '',
      aiIf: aiif ? c => aiif[0](c) : null }));
    UNIQUE_DEC[id] = 1; } }
// the AI takes its urgent decisions within the week, without keeping a reserve of political power
function aiUrgentDecisions() { for (const c of alive()) { if (!c.ai) continue; for (const id in UNIQUE_DEC) { const d = DECISIONS[id]; if (!d.urgent || !d.tags.includes(c.tag.slice(0, 3))) continue; if (d.aiIf && !d.aiIf(c)) continue; if (decisionState(c, id) === '') takeDecision(c, id); } } }
{ const _pd = playDaily; playDaily = function () { _pd(); if (G.day % 7 === 4) aiUrgentDecisions(); }; }
// the historical moment: important decisions are announced to the world
{ const _td = takeDecision; takeDecision = function (c, id) { const r = _td(c, id); if (r && UNIQUE_DEC[id] && !c.major) logMsg(`${c.name}: ${DECISIONS[id].name}.`, 'info', [c.tag]); return r; }; }

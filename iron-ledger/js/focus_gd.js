// Götterdämmerung update: a compact focus-tree language and the German, Hungarian and Austrian trees.
// Line format:  id | Name | x | y | prerequisites | effects | description | options
//   prerequisites: "a,b" = all, "a|b" = any.   effects and options are ';'-separated tokens (see fx / parseTree).
'use strict';
const slug = s => 'f_' + s.toLowerCase().replace(/[^a-z0-9]+/g, '_');
const csv = v => v.split(',').map(s => s.trim()).filter(Boolean);
const kvs = v => { const o = {}; csv(v).forEach(p => { const i = p.lastIndexOf(' '); o[p.slice(0, i).trim()] = +p.slice(i + 1); }); return o; };
const joinTo = (c, t) => { if (!ok(t)) return; if (factionOf(t)) joinFaction(c.tag, t); else addPact('ally', c.tag, t); };
const inviteAll = (c, list, test) => list.forEach(t => { if (ok(t) && C(t).ai && !C(t).overlord && !factionOf(t) && !atWar(c.tag, t) && (!test || test(C(t)))) joinFaction(t, c.tag); });
const setLeader = (name, party) => c => { c.leader = name; if (party) c.party = party; };
const softPlay = (vs, type, provs, opt) => c => { if (ok(vs) && !atWar(c.tag, vs) && !friendly(c.tag, vs)) startPlay(c.tag, vs, { type, provs: (provs || []).map(n => PNAME[n]).filter(i => P(i).owner === vs) }, opt || {}); };
const addRes = (prov, r, n) => c => { const p = PN(prov); p.res[r] = Math.min(6, p.res[r] + n); };
const FNS = {
  inviteItaly: [c => { if (ok('ITA') && C('ITA').ideology === 'fas' && C('ITA').ai) joinFaction('ITA', c.tag); }, 'Fascist Italy is invited to the Axis'],
  tripartite: [c => inviteAll(c, ['JAP', 'HUN', 'ROM', 'BUL'], k => k.ideology !== 'dem' && k.ideology !== 'com'), 'Japan, Hungary, Romania and Bulgaria may join our faction'],
  anschluss: [c => { const a = C('AUT'); if (!a.exists) return; if (!a.ai || a.flags.resist || alive().some(k => k.major && k.tag !== c.tag && hasPact('guar', k.tag, 'AUT'))) startPlay(c.tag, 'AUT', { type: 'annex' }); else { annex(c.tag, 'AUT', true); provsOf(c.tag).filter(p => p.orig === 'AUT').forEach(p => p.cores.push(c.tag)); } }, 'Austria is united with the Reich. If Austria resists or is guaranteed, this opens a diplomatic play instead.'],
  sudeten: [c => softPlay('CZE', 'take', ['Karlsbad', 'Reichenberg'], { days: 16, noBackHist: ['FRA', 'ENG', 'ROM', 'YUG', 'SOV', 'POL'], force: G.historical && C('CZE').ai && !alive().some(k => !k.ai && k.tag !== c.tag && (hasPact('guar', k.tag, 'CZE') || friendly(k.tag, 'CZE'))) ? 'concede' : undefined })(c), 'Open a two-week diplomatic play against Czechoslovakia for the Sudetenland. Prague yields unless a great power stands behind it.'],
  germanCzech: [c => germanCzech(c), 'Occupy Bohemia and Moravia if the West stands aside; otherwise open a play for annexation'],
  memel: [c => softPlay('LIT', 'take', ['Memel'], { force: 'concede', days: 12 })(c), 'Lithuania is forced to cede Memel'],
  mrEvent: [() => queueEvent('mr_pact_sov', 'SOV', 2), 'The Soviet Union gains claims in its sphere of influence'],
  ostmarkBoost: [c => { c.manpower += 120; c.pp += 30; }, ''],
  danzig: [c => softPlay('POL', 'take', ['Danzig', 'Poznań', 'Katowice'], { force: 'resist', days: 20 })(c), 'Demand Danzig, Posen and Upper Silesia. Poland will refuse.'],
  west: [c => lowCountries(c), 'Declare war on the Low Countries and France'],
  weser: [c => ['DEN', 'NOR'].forEach(t => { if (ok(t) && !atWar(c.tag, t) && !friendly(c.tag, t)) declareWar(c.tag, t, [{ by: c.tag, vs: t, type: 'puppet' }]); }), 'Declare war on Denmark and Norway'],
  marita: [c => ['YUG', 'GRE'].forEach(t => { if (ok(t) && !atWar(c.tag, t) && !friendly(c.tag, t)) declareWar(c.tag, t, [{ by: c.tag, vs: t, type: 'puppet' }]); }), 'Declare war on Yugoslavia and Greece'],
  atlanticWall: [c => G.P.forEach(p => { if (p.ctrl === c.tag && p.coastal && ['France', 'Belgium', 'Netherlands', 'Denmark', 'Norway'].some(n => PROV_ISO[p.id] === n)) p.fort = Math.min(5, p.fort + 2); }), 'Fortify every coast we hold from Norway to the Bay of Biscay'],
  inviteSpain: [c => alive().forEach(k => { if (k.tag.startsWith('SPA') && k.ideology === 'fas' && k.ai && !isAtWar(k.tag) && !factionOf(k.tag)) joinFaction(k.tag, c.tag); }), 'A fascist Spain may join our faction'],
  aidIraq: [c => aidTo('IRQ', { arms: 200, aircraft: 40 })(c), 'Ship arms and aircraft to Iraq'],
  rajUnrest: [() => { if (ok('RAJ')) { C('RAJ').stab = Math.max(0, C('RAJ').stab - 10); shiftSupport(C('RAJ'), { fas: 5 }); } }, 'Stability in British India falls'],
  inviteFIN: [c => inviteAll(c, ['FIN'], k => isAtWar('FIN') || (k.rel.SOV || 0) < 0), 'Finland may join our faction'],
  viennaAward: [c => { if (!ok('HUN')) return; ['Košice', 'Uzhhorod'].forEach(n => { const p = PN(n); if (p.owner === c.tag) transferProv(p, 'HUN'); }); const p = PN('Cluj'); if (!p.claims.includes('HUN')) p.claims.push('HUN'); addRel(c.tag, 'HUN', 30); inviteAll(c, ['HUN'], k => k.ideology !== 'dem'); }, 'Hungary receives Upper Hungary if we hold it, a claim on Transylvania, and an invitation to our faction'],
  coreAustria: [c => provsOf(c.tag).filter(p => p.orig === 'AUT' && !p.cores.includes(c.tag)).forEach(p => p.cores.push(c.tag)), 'Former Austrian provinces become core territory'],
  condor: [c => { const t = spainSide('fas')(c) || spainSide('aut')(c); if (t) { aidTo(() => t, { arms: 300, artillery: 50, aircraft: 150, tanks: 30 })(c); spawnDivisions(t, 'inf', 2, t.capital); } }, 'Aircraft, tanks and "volunteers" for the Spanish Nationalists'],
  civilWarNazi: [c => startCivilWar(c.tag, 'fas', 0.45, 'National Socialist Germany', { seed: 'Munich' }), 'Civil war: the Party and its loyalists rise against the new government'],
  leaderW2: [setLeader('Wilhelm II', 'DNVP'), 'Wilhelm II returns from exile at Doorn'],
  leaderW3: [setLeader('Wilhelm III', 'DNVP'), 'Crown Prince Wilhelm is crowned'],
  inviteCentral: [c => inviteAll(c, ['AUT', 'HUN', 'BUL', 'TUR'], k => k.ideology !== 'com'), 'Austria, Hungary, Bulgaria and Turkey are invited'],
  playPuppetPOL: [softPlay('POL', 'puppet', null, { days: 30 }), 'Open a play to make Poland a client kingdom'],
  playDanzigSoft: [softPlay('POL', 'take', ['Danzig'], { days: 30 }), 'Open a play for the return of Danzig alone'],
  factionBulwark: [c => { if (!factionOf(c.tag)) createFaction(c.tag, 'Anti-Bolshevik League'); inviteAll(c, ['POL', 'FIN', 'ROM', 'HUN', 'EST', 'LAT', 'LIT'], k => k.ideology !== 'com'); }, 'Found the Anti-Bolshevik League with our eastern neighbours'],
  dropClaimsFrance: [c => G.P.forEach(p => { if (p.owner === 'FRA') p.claims = p.claims.filter(t => t !== c.tag); }), 'We renounce all claims on France'],
  inviteEU: [c => inviteAll(c, ['FRA', 'BEL', 'HOL', 'LUX', 'DEN', 'CZE', 'AUT', 'SWI', 'NOR', 'SWE'], k => k.ideology === 'dem' && !hasSpirit(k, 'armed_neutrality')), 'The democracies of Europe are invited'],
  joinAllies: [c => joinTo(c, 'ENG'), 'Join the faction of the United Kingdom, or ally with it'],
  joinAxis: [c => { if (ok('GER') && C('GER').ideology === 'fas') joinTo(c, 'GER'); else if (ok('ITA') && C('ITA').ideology === 'fas') joinTo(c, 'ITA'); }, 'Join the faction of fascist Germany (or Italy)'],
  joinComintern: [c => joinTo(c, 'SOV'), 'Join the faction of the Soviet Union'],
  exportRev: [() => ['FRA', 'BEL', 'HOL', 'POL', 'CZE', 'AUT'].forEach(t => ok(t) && shiftSupport(C(t), { com: 8 })), 'Communist support rises in our neighbours'],
  exportRevCZE: [() => ['CZE', 'ROM', 'YUG', 'AUT'].forEach(t => ok(t) && shiftSupport(C(t), { com: 7 })), 'Communist support rises in our neighbours'],
  internat: [c => { if (!factionOf(c.tag)) createFaction(c.tag, 'Spartacist International'); inviteAll(c, alive().map(k => k.tag), k => k.ideology === 'com' && !k.major); }, 'Found our own International if we stand alone'],
  playHUN_CZE: [c => { let got = false; ['Košice', 'Uzhhorod'].forEach(n => { const p = PN(n); if (p.owner === 'GER' && friendly(c.tag, 'GER')) { transferProv(p, c.tag); got = true; } }); if (!got) softPlay('CZE', 'take', ['Košice', 'Uzhhorod'], { noBackHist: ['FRA', 'ENG', 'SOV'] })(c); }, 'Receive Upper Hungary from our German ally, or open a play against Czechoslovakia'],
  playCluj: [softPlay('ROM', 'take', ['Cluj'], { days: 25 }), 'Open a play against Romania for Northern Transylvania'],
  leaderOtto: [setLeader('Otto von Habsburg', 'Legitimists'), 'Otto von Habsburg takes the throne'],
  unionAustria: [c => unionWith(c, 'AUT'), 'Austria joins us in a restored Dual Monarchy (if it is willing: AI Austria agrees unless fascist, communist or already bound to another power)'],
  unionHungary: [c => unionWith(c, 'HUN'), 'Hungary joins us in a restored Dual Monarchy (if it is willing: AI Hungary agrees unless fascist, communist or already bound to another power)'],
  inviteDanube: [c => inviteAll(c, ['CZE', 'YUG', 'ROM', 'POL', 'AUT', 'HUN'], k => opinion(k.tag, c.tag) > 0), 'Friendly Danubian states are invited'],
  inviteNeighbours: [c => inviteAll(c, ['CZE', 'YUG', 'ROM', 'AUT'], k => k.ideology === 'dem' || opinion(k.tag, c.tag) > 20), 'Our neighbours are invited'],
  guarFromITA: [c => { if (ok('ITA') && C('ITA').ai && !friendly('ITA', 'GER')) addPact('guar', 'ITA', c.tag); else addRel(c.tag, 'ITA', 15); }, 'Italy guarantees our independence unless it is bound to Germany'],
  guarFromWest: [c => { let n = 0; if (ok('FRA') && C('FRA').ai && !hasSpirit(C('FRA'), 'political_paralysis')) { addPact('guar', 'FRA', c.tag); n++; } if (ok('ENG') && C('ENG').ai && !hasSpirit(C('ENG'), 'appeasement')) { addPact('guar', 'ENG', c.tag); n++; } if (!n) c.infl += 30; }, 'France and Britain guarantee us, if they have shaken off paralysis and appeasement'],
  pressClaims: [c => { const tg = {}; for (const p of G.P) if (p.claims.includes(c.tag) && p.owner !== c.tag && ok(p.owner) && !friendly(c.tag, p.owner)) (tg[p.owner] = tg[p.owner] || []).push(p.id); const t = Object.keys(tg).sort((a, b) => countryStr(a) - countryStr(b))[0]; if (t && !atWar(c.tag, t)) startPlay(c.tag, t, { type: 'take', provs: tg[t] }); }, 'Open a diplomatic play against the weakest holder of our claims'],
  zalaOil: [addRes('Budapest', 'oil', 2), 'Oil is found in Zala county'],
  erzRes: [addRes('Innsbruck', 'iron', 2), 'The Erzberg yields more ore'],
  oilRes: [addRes('Vienna', 'oil', 2), 'Oil is struck at Zistersdorf'],
  acceptAnschluss: [c => { if (!ok('GER')) return; const pl = c.tag === G.player && !c.ai; annex('GER', c.tag, true); provsOf('GER').filter(p => p.orig === 'AUT').forEach(p => p.cores.includes('GER') || p.cores.push('GER')); if (pl) { switchPlayer('GER'); UIH.popup({ title: 'One Reich', icon: '🦅', desc: 'Austria is no more. You now lead the German Reich.', options: [{ name: 'So be it.' }] }); } }, 'Germany annexes Austria. If you are playing Austria, you continue as Germany.']
};
function unionWith(c, t) {
  const k = C(t); if (!k || !k.exists) return; const willing = k.ai && !k.overlord && !isAtWar(t) && k.ideology !== 'fas' && k.ideology !== 'com' && (!factionOf(t) || factionOf(t) === factionOf(c.tag));
  if (!willing) { addRel(c.tag, t, 20); if (c.tag === G.player) UIH.notify(`${k.name} declines the union.`, 'bad'); return; }
  annex(c.tag, t, true); provsOf(c.tag).forEach(p => { if (p.orig === t && !p.cores.includes(c.tag)) p.cores.push(c.tag); });
  c.name = 'Austria-Hungary'; c.adj = 'Austro-Hungarian'; c.color = '#d8d0b0'; addSpirit(c, 'great_power_union'); logMsg('The Dual Monarchy is restored: Austria-Hungary returns to the map of Europe.', 'world'); UIH.mapDirty();
}
const PROV_ISO = PROV_RAW.trim().split('\n').map(l => l.split('|')[1]);
const REQF = {
  polandDown: [c => !ok('POL') || C('POL').capitulated || !atWar(c.tag, 'POL'), 'Poland is defeated or at peace'],
  franceDown: [c => !ok('FRA') || C('FRA').capitulated, 'France is defeated'],
  enemyOnSoil: [c => G.P.some(p => p.owner === c.tag && p.cores.includes(c.tag) && p.ctrl !== c.tag), 'Enemy troops on our core territory'],
  spainCW: [() => alive().some(k => k.civilOf === 'SPA'), 'Civil war in Spain'],
  gerSovWar: [() => ok('GER') && atWar('GER', 'SOV'), 'Germany is at war with the Soviet Union'],
  majorwar: [c => enemiesOf(c.tag).some(t => C(t).major), 'At war with a major power'],
  sovereign: [c => !c.overlord, 'Not a subject']
};
// requirements you can play towards: each shows live progress in the focus card
const ndivs = c => sum(armiesOf(c.tag), a => a.divs.length);
const REQX = {
  divs: v => { const r = [c => ndivs(c) >= +v, `At least ${v} divisions`]; r.prog = c => `${ndivs(c)}/${v}`; return r; },
  stab: v => { const r = [c => c.stab >= +v, `Stability ${v}% or more`]; r.prog = c => `${Math.round(c.stab)}/${v}%`; return r; },
  ws: v => { const r = [c => c.ws >= +v, `War support ${v}% or more`]; r.prog = c => `${Math.round(c.ws)}/${v}%`; return r; },
  year: v => [() => year() >= +v, 'Year ' + v + ' or later'],
  hold: v => { const l = csv(v); return [c => l.every(n => PN(n).ctrl === c.tag), 'We control ' + l.join(', ')]; },
  notwar: v => [c => !ok(v) || !atWar(c.tag, v), `Not at war with ${COUNTRY_DEF[v].n}`],
  gone: v => [() => !ok(v) || C(v).capitulated, `${COUNTRY_DEF[v].n} is defeated or gone`],
  rel: v => { const [t, n] = v.split(' '); const r = [c => !ok(t) || opinion(t, c.tag) >= +n, `${COUNTRY_DEF[t].n}'s opinion of us at least ${n}`]; r.prog = c => ok(t) ? `${Math.round(opinion(t, c.tag))}/${n}` : ''; return r; },
  sup: v => { const [i, n] = v.split(' '); const r = [c => c.sup[i] >= +n, `${IDEO[i][0]} support ${n}% or more`]; r.prog = c => `${Math.round(c.sup[i])}/${n}%`; return r; },
  air: v => { const r = [c => airPower(c) >= +v, `Air power ${v} or more`]; r.prog = c => `${Math.round(airPower(c))}/${v}`; return r; },
  navy: v => { const r = [c => navalPower(c) >= +v, `Naval power ${v} or more`]; r.prog = c => `${Math.round(navalPower(c))}/${v}`; return r; },
  tech: v => [c => !!c.techs[v], `${TECHS[v][0]} researched`],
  bld: v => { const [t, n] = v.split(' '); const r = [c => ((c.bt[t] || {}).lv || 0) >= +n, `At least ${n} ${BLD[t].name}`]; r.prog = c => `${(c.bt[t] || {}).lv || 0}/${n}`; return r; }
};
function parseReq(str) {
  const parts = str.split('&').map(s => s.trim()).filter(Boolean).map(tok => { const i = tok.indexOf(' '), k = i < 0 ? tok : tok.slice(0, i), v = i < 0 ? '' : tok.slice(i + 1).trim();
    if (k === 'war') return warReq; if (k === 'peace') return peaceReq; if (k === 'ex') return existsReq(v); if (k === 'atwar') return atWarWith(v); if (k === 'tension') return tensionReq(+v);
    if (k === 'own') { const l = csv(v); return [c => l.every(n => PN(n).owner === c.tag), 'We own ' + l.join(', ')]; }
    if (k === 'flag') return [() => !!G.flags[v], 'Flag: ' + v]; if (REQX[k]) return REQX[k](v); if (REQF[k]) return REQF[k]; throw new Error('Unknown requirement ' + tok); });
  return parts.reduce((a, b) => both(a, b));
}
function fx(str, desc) {
  const e = {}, fns = [], tips = [], sp = [];
  for (let tok of (str || '').split(';')) { tok = tok.trim(); if (!tok) continue; const i = tok.indexOf(' '), k = i < 0 ? tok : tok.slice(0, i), v = i < 0 ? '' : tok.slice(i + 1).trim();
    switch (k) {
      case 'pp': case 'stab': case 'ws': case 'infl': case 'money': case 'tension': case 'rad': case 'legit': case 'infra': e[k] = +v; break;
      case 'mp': e.manpower = +v; break; case 'res': e.research = +v; break;
      case 'build': case 'units': case 'equip': case 'rel': case 'ideo': e[k] = kvs(v); break;
      case 'tech': case 'claim': case 'core': case 'law': case 'rmspirit': case 'guarantee': e[k] = csv(v); break;
      case 'fort': e.fort = isNaN(+v) ? csv(v) : +v; break;
      case 'allies': { const l = csv(v); fns.push(c => l.forEach(t => ok(t) && !atWar(c.tag, t) && addPact('ally', c.tag, t))); tips.push('Alliances with ' + l.map(t => COUNTRY_DEF[t].n).join(', ')); break; }
      case 'join': case 'war': case 'setIdeo': case 'flag': case 'cflag': case 'faction': case 'news': case 'ally': e[k] = v; break;
      case 'nap': csv(v).forEach(t => { fns.push(c => ok(t) && addPact('nap', c.tag, t, 365 * 5)); tips.push('Non-aggression pact with ' + COUNTRY_DEF[t].n); }); break;
      case 'trade': { const l = csv(v); fns.push(c => l.forEach(t => ok(t) && !atWar(c.tag, t) && addPact('trade', c.tag, t))); tips.push('Trade agreements with ' + l.map(t => COUNTRY_DEF[t].n).join(', ')); break; }
      case 'generals': { const l = csv(v).map(g => g.split('/')); fns.push(c => l.forEach(g => c.gens.push({ id: G.nid++, name: g[0], skill: +g[1], trait: g[2], xp: 0 }))); tips.push('Gain ' + l.map(g => `${g[0]} (skill ${g[1]})`).join(', ')); break; }
      case 'proj': fns.push(c => { c.projPts = (c.projPts || 0) + +v; }); tips.push(`Special project progress +${v}`); break;
      case 'ig': { const o = e.ig || (e.ig = {}); csv(v).forEach(p => { const a = p.split(/\s+/); o[a[0]] = { appr: +a[1] || 0 }; if (a[2]) o[a[0]].clout = +a[2]; }); break; }
      case 'spirit': { const m = v.match(/^(.*?)(?:\s*\[(\d+)\])?\s*:\s*(.*)$/); if (!m) { const t = v.match(/^(\S+)\s*\[(\d+)\]$/); sp.push(t ? [t[1], +t[2]] : v); break; } const id = slug(m[1]); SPIRITS[id] = [m[1], desc || '', kvs(m[3])]; sp.push(m[2] ? [id, +m[2]] : id); break; }
      case 'fn': if (!FNS[v]) throw new Error('Unknown focus function ' + v); fns.push(FNS[v][0]); tips.push(FNS[v][1]); break;
      default: throw new Error('Unknown effect token "' + tok + '"');
    } }
  if (sp.length) e.spirit = sp; if (tips.length) e.tip = tips.join('<br>'); if (fns.length) e.fn = c => fns.forEach(f => f(c));
  return e;
}
function parseTree(prefix, text) {
  const out = [], seen = {}, pos = {}, pf = s => s.split(/([|,])/).map(x => x === '|' || x === ',' ? x : prefix + x.trim()).join('');
  for (const line of text.trim().split('\n')) { if (!line.trim() || line.trim().startsWith('#')) continue; const f = line.split('|').map(s => s.trim());
    // prerequisites may themselves contain '|', so the fixed columns are taken from both ends
    const n = f.length, id = prefix + f[0], name = f[1], x = +f[2], y = +f[3], opts = f[n - 1], desc = f[n - 2], eff = f[n - 3], pre = f.slice(4, n - 3).join('|');
    if (n < 8 || isNaN(x) || isNaN(y)) throw new Error('Bad focus line: ' + line); if (seen[id]) throw new Error('Duplicate focus ' + id); seen[id] = 1; if (pos[x + ',' + y]) throw new Error(`Focus ${id} overlaps ${pos[x + ',' + y]}`); pos[x + ',' + y] = id;
    const cp = eff.split('??'), o = { id, name, x, y, pre: pre ? pf(pre) : '', eff: fx(cp[0], desc), desc };
    // "base effects ?? Label => effects // Label => effects": the player chooses when the focus completes
    if (cp[1]) o.choices = cp.slice(1).join('??').split('//').map(t => { const k = t.indexOf('=>'); if (k < 0) throw new Error('Bad choice in ' + id + ': ' + t); return { label: t.slice(0, k).trim(), eff: fx(t.slice(k + 2), desc) }; });
    for (let t of opts.split(';')) { t = t.trim(); if (!t) continue; const i = t.indexOf(' '), k = i < 0 ? t : t.slice(0, i), v = i < 0 ? '' : t.slice(i + 1).trim();
      if (k === 'mx') o.mutex = pf(v); else if (k === 'ai') o.ai = +v; else if (k === 'days') o.days = +v; else if (k === 'cost') o.cost = +v; else if (k === 'kind') o.kind = v; else if (k === 'ideo') o.ideo = v; else if (k === 'sec') o.sec = v; else if (k === 'aiIdeo') o.aiIdeo = v;
      else if (k === 'date') { const [yy, mm] = v.split('-').map(Number); o.req = o.req ? both(o.req, dateReq(yy, mm)) : dateReq(yy, mm); }
      else if (k === 'req') { const r = parseReq(v); o.req = o.req ? both(o.req, r) : r; } else throw new Error('Unknown focus option ' + t); }
    out.push(o); }
  for (const f of out) for (const p of (f.pre + ',' + (f.mutex || '')).split(/[|,]/)) if (p && !seen[p]) throw new Error(`Focus ${f.id} refers to unknown ${p}`);
  return out;
}

TREES.GER = parseTree('g_', `
rhine|Remilitarise the Rhineland|6|0||ws 5; stab 5; tension 4; fort Essen, Frankfurt; news German troops march into the demilitarised Rhineland. ?? Send three battalions and bluff => pp 30; stab 3 // March in with nineteen divisions => ws 6; tension 3; rel FRA -15, ENG -10|Tear up Locarno and station troops on the Rhine.|mx oppose; ai 9; sec Foreign Policy; req divs 40
axis|Rome–Berlin Axis|2|1|rhine|faction Axis; rel ITA 40; fn inviteItaly|A vertical line around which Europe may revolve.|date 1936-10; ai 3; ideo fas
hung|Court Hungary|0|2|axis|rel HUN 40; trade HUN|Budapest shares our dislike of the peace treaties.|ideo fas
anti|Anti-Comintern Pact|2|2|axis|rel JAP 40, HUN 20, ROM 10; infl 30|A common front against Bolshevism.|ai 3; ideo fas
roma|Romanian Oil Treaty|0|3|hung|rel ROM 30; trade ROM; spirit Ploiești Oil: output .02, supply .05|Grain and oil for machines and arms.|ideo fas
japan|Embrace Japan|1|3|anti|rel JAP 30, CHI -30; infl 20|Tokyo is the stronger horse in Asia.|mx china; ai 3; ideo fas
china|Sino-German Cooperation|3|3|anti|rel CHI 40, JAP -20; trade CHI; money 4|Tungsten for rifles: the old China trade continues.|mx japan; ai 1
bulg|Tsar Boris's Friendship|0|4|roma|rel BUL 40; trade BUL|A quiet, careful friend in Sofia.|ideo fas
tri|Tripartite Pact|1|4|japan|fn tripartite|Three empires divide the world between them.|req war; ai 3; ideo fas
stahl|Pact of Steel|2|4|axis|rel ITA 30; spirit Steel Pact: mil_out .05, atk .02|Bound to Rome in blood and iron.|ideo fas
vienna|Vienna Awards|0|5|bulg|fn viennaAward|Berlin redraws the Danube basin and collects the gratitude.|ideo fas
balkan|Balkan Economic Hegemony|0|6|vienna|trade YUG, GRE, TUR; infl 40; spirit Balkan Trade Bloc: tradecap .1|The whole south-east sells to us and buys from us.|
anschluss|Anschluss|6|1|rhine|fn anschluss; tension 5 ?? Hold a plebiscite afterwards => legit 8; stab 4 // Annex by decree => pp 60; tension 3; stab -2|One people, one Reich.|req ex AUT & divs 50; date 1938-2; ai 6; ideo fas
ostmark|Integrate the Ostmark|7|2|anschluss|fn coreAustria; build steel 1, arms 1|Austrian gold, iron and divisions join the Reich's ledger.|req own Vienna
sudeten|Demand the Sudetenland|6|2|anschluss|fn sudeten ?? Offer a four-power conference => rel ENG 10, FRA 10; tension -3; pp 30 // Mobilise openly => ws 6; tension 4; units inf 4|Three million Germans live under Czech rule.|req ex CZE & divs 58; date 1938-8; ai 6; ideo fas
czech|Fate of Czechoslovakia|6|3|sudeten|fn germanCzech ?? A protectorate run from Prague castle => build arms 2; stab -2 // Share the spoils with Hungary and Poland => rel HUN 30, POL 20; infl 40|The rump state cannot be allowed to survive.|req ex CZE; date 1939-2; ai 6; ideo fas
skoda|Seize the Škoda Works|7|3|czech|build arms 2, artyf 2, tankp 1; equip tanks 120, artillery 150|One of Europe's great arsenals changes hands intact.|req own Prague
memel|Memel Ultimatum|4|4|czech|fn memel|The Memelland returns home.|req ex LIT; ai 5; ideo fas
slovak|Slovak Client State|5|4|czech|pp 40; mp 60; units inf 2|Bratislava governs itself, as long as it asks Berlin first.|
pact|Molotov–Ribbentrop Pact|8|4|czech|nap SOV; flag mr_pact; fn mrEvent ?? Offer Moscow the Baltic and Bessarabia => rel SOV 25; trade SOV; money 10 // Offer eastern Poland and no more => rel SOV 5; tension 2; pp 40|A pact with the old enemy buys a free hand in the west.|req ex SOV; date 1939-6; ai 6; ideo fas
credit|German–Soviet Credit Agreement|9|5|pact|trade SOV; spirit Soviet Raw Materials [720]: output .04, mil_out .04|Grain, oil and manganese roll west across the demarcation line.|
danzig|Danzig or War|6|5|memel|pact|claim Danzig, Poznań, Katowice, Łódź; fn danzig|The Free City and the Corridor, or else.|req ex POL & divs 72; date 1939-6; ai 8; ideo fas
weser|Operation in the North|4|6|danzig|fn weser|Secure the ore route and the Atlantic flank before the British do.|req polandDown; date 1940-3; ai 4; ideo fas
west|Strike in the West|6|6|danzig|spirit blitzkrieg [420]; claim Metz; fn west ?? The sickle cut through the Ardennes => spirit Sickle Cut [200]: atk .15, supply -.06 // The broad right wing => spirit Broad Front Advance [300]: atk .06, def .04|Through the Ardennes, to the sea.|req polandDown & divs 85; ai 8; ideo fas
marita|Balkan Campaign|8|6|danzig|fn marita|The southern flank must be cleared before any march east.|req franceDown; date 1941-3; ai 3; ideo fas
finland|Brothers in Arms|11|6|danzig|rel FIN 40; fn inviteFIN|Helsinki has its own account to settle with Moscow.|ideo fas
ore|Secure Swedish Ore|3|7|weser|rel SWE 20; trade SWE; spirit Swedish Iron Ore: mil_out .04|Ten million tons a year through Narvik and Luleå.|
norbase|Norwegian Bases|4|7|weser|build shipyard 1, port 1; fort Narvik, Oslo|Fjords for the fleet, airfields over the North Sea.|req own Oslo
vichy|Armistice at Compiègne|6|7|west|pp 80; stab 5; spirit Victory in the West [540]: ws 15, legit 8|The railway carriage of 1918 is rolled out once more.|req franceDown
africa|Afrika Korps|8|7|marita|units arm 1, mot 2; spirit Desert Expeditionary Corps: supply .1|A blocking force for Tripoli that has other ideas.|req war
barb|War in the East|10|7|west|ws 10; spirit blitzkrieg [300]; claim Minsk, Kiev, Odessa, Riga, Tallinn, Kaunas; war SOV|The world will hold its breath.|req ex SOV & franceDown; date 1941-3; ai 5; ideo fas
atlantic|Atlantic Wall|5|8|vichy|fn atlanticWall|Concrete from the North Cape to the Pyrenees.|req war
sealion|Operation Sea Lion|6|8|vichy|claim London; units inf 4; spirit Invasion Barges [365]: navy .15|Barges gather in the Channel ports.|req atwar ENG
felix|Operation Felix|7|8|vichy|fn inviteSpain|Gibraltar is the cork in the Mediterranean bottle.|ideo fas
ostland|Commissariat Ostland|9|8|barb|core Riga, Tallinn, Kaunas, Minsk; mp 100|A civil administration for the Baltic and White Russia.|req own Riga, Minsk
ukraine|Commissariat Ukraine|10|8|barb|core Kiev, Odessa; build farm 4|The black earth is to feed the Reich.|req own Kiev
kaukasus|Commissariat Caucasus|11|8|barb|build oilr 3; spirit Caucasus Oil: output .03, supply .1|The oil of Baku decides the war.|req own Baku
total|Total War|6|9|vichy|barb|law total; ws 10; spirit Total War: mil_out .15, needs -.1|Shorter and more radical than anything we can yet imagine.|req majorwar
moskau|Fall of Moscow|10|9|ukraine|ostland|pp 100; ws 10; spirit Kremlin Captured [720]: ws 10, atk .05|The red star comes down from the Spassky tower.|req own Moscow
fortress|Fortress Europe|6|10|total|fort 2; spirit Continental Fortress: def .08, entrench .1|If we cannot win, we can refuse to lose.|req majorwar
volks|Volkssturm|5|11|fortress|units mil 12|Boys and grandfathers with armbands and anti-tank tubes.|req enemyOnSoil
redoubt|Alpine Redoubt|7|11|fortress|fort Munich, Innsbruck; spirit Mountain Citadel: def .05, caplimit .1|A last stronghold among the peaks.|req enemyOnSoil
spain|Condor Legion|10|1|rhine|fn condor; tension 2|Spain will be our proving ground.|req spainCW; ai 5; ideo fas
spain2|Lessons of Spain|10|2|spain|res 15; spirit Lessons of Spain: air .08, cas .15|What worked over Guernica and what did not.|
orient|Orient Policy|12|1|rhine|infl 30; rel TUR 20, PER 20, IRQ 20|Every enemy of the British Empire is a friend worth cultivating.|
turkey|Treaty with Turkey|12|2|orient|nap TUR; trade TUR|Chrome ore and a quiet Bosphorus.|
iraq|The Golden Square|13|2|orient|rel IRQ 40; fn aidIraq|Baghdad's colonels look for a patron.|
india|Free India Legion|12|3|turkey|units inf 1; fn rajUnrest|The enemy of my enemy.|req atwar ENG
iran|Persian Friendship|13|3|iraq|rel PER 40; trade PER|Engineers and locomotives for the Shah.|
party|Party Congress|16|0||pp 60; stab 3; ideo fas 4|A cathedral of light over Nuremberg.|sec Party and State; ideo fas
propaganda|Ministry of Propaganda|15|1|party|spirit People's Receiver: stab 4, ws 4|A radio in every parlour, tuned to one station.|
gleich|Gleichschaltung|16|1|party|pp 50; spirit Coordinated State: pp .15, rad -.05 ?? Break the veterans' leagues => ig army -8; pp 60 // Co-opt them into the Party => ig army 8; stab 3|Every club, union and choir is brought into line.|
youth|State Youth|17|1|party|spirit Youth Service: manpower .05, train .05|Membership is no longer voluntary.|
olympia|Olympic Showcase|14|2|propaganda|infl 40; stab 2|The world comes to Berlin and is shown what it wishes to see.|
film|Newsreel Empire|15|2|propaganda|infl 20; ws 3|Every cinema programme opens with the weekly review.|
kdf|Strength Through Joy|16|2|gleich|rad -.05; stab 3|Cruises and concerts for the working man.|
daf|Labour Front|17|2|gleich|law state_unions; ig union -3; spirit Labour Front: output .03|One union, appointed from above.|
labour|Reich Labour Service|18|2|youth|infra 2; mp 100|Six months with a spade for every young man.|
kirchen|Church Struggle|14|3|olympia|ig devout -6; pp 60; ideo fas 4|The pulpit will not be allowed to contradict the Party.|mx concordat
concordat|Honour the Concordat|15|3|film|ig devout 5; stab 3|Leave the bishops their schools and they will leave us the state.|mx kirchen
winter|Winter Relief|16|3|kdf|rad -.04; money -1|Collection tins rattle on every corner.|
partyarmy|The Party's Army|18|3|labour|units mot 2; ig army -5; pp 40|A second armed force, loyal to one man.|mx wehrprim
wehrprim|Primacy of the Wehrmacht|19|3|labour|ig army 6 .1; spirit Sole Bearer of Arms: org .05|The army alone carries the nation's weapons.|mx partyarmy
plebiscite|Plebiscite of Approval|15|4|concordat|kirchen|ideo fas 6; legit 8|Ninety-nine per cent. Nobody asks about the hundredth.|
gau|Gau Administration|16|4|winter|build admin 2; spirit Regional Governors: tax .05|Forty-odd satraps answer to the centre.|
police|Unified Police|17|4|daf|law secret_police; rad -.05|Every constable now reports to one desk in Berlin.|
okw|Create the OKW|18|4|partyarmy|wehrprim|pp 50; spirit Supreme Command: org .05, pp .05; generals Wilhelm Keitel/2/politic|The war ministry is abolished; command passes upward.|
succession|Question of Succession|15|5|plebiscite|pp 60; stab 4|A name in a sealed envelope.|
reichsgau|Reichsgau Reform|16|5|gau|build admin 1; legit 5|New provinces drawn for new territories.|
decrees|Emergency Decrees|17|5|police|stab 5; legit -5; spirit Emergency Powers [720]: pp .2, rad -.1|The exception becomes the rule.|
hq|Field Headquarters|18|5|okw|spirit Forward Command Post: atk .03, def .03|The leader moves to a bunker in the forest.|req war
affair|Blomberg–Fritsch Affair|19|5|okw|pp 80; ig army -4; stab -2|Two scandals remove two inconvenient generals.|
oppose|Oppose Hitler|27|0||setIdeo aut; fn civilWarNazi|The generals move against the regime. The Party will not go quietly.|mx rhine; ai 0; sec Opposition
beck|Beck's Shadow Cabinet|27|1|oppose|pp 80; stab 5; generals Ludwig Beck/4/def|A government in waiting since the first conspiracies.|
dissolve|Dissolve the Party Formations|26|2|beck|ideo fas -15; stab 4; rad -.05|Uniforms are handed in, offices padlocked.|
reconcile|Reconcile with the Army|28|2|beck|ig army 8 .1; units inf 3|Regiments that wavered are welcomed back.|
kaiser|Restore the Kaiser|22|3|dissolve|reconcile|law monarchy; stab 8; rel ENG 20, HOL 20; spirit kaiserreich|The Hohenzollerns return to Berlin.|mx junta,republic,red; ai 0
wil2|Return of Wilhelm II|21|4|kaiser|legit 10; ig land 6; rel ENG -10; fn leaderW2|The old Emperor leaves his woodpile at Doorn.|mx wil3
wil3|Crown Wilhelm III|23|4|kaiser|fn leaderW3; rel ENG 15; stab 4|A new reign for a new age.|mx wil2
absol|Royal Prerogative|21|5|wil2|wil3|law autocracy; pp 80|The Kaiser appoints, the Kaiser dismisses.|mx constit
constit|Constitutional Monarchy|23|5|wil2|wil3|law census, protected; ideo dem 15|The crown reigns; parliament governs.|mx absol
junker|Junker Estates|20|6|absol|ig land 6 .2; build farm 3|East of the Elbe the old order still stands.|
guards|Prussian Guards|21|6|absol|units inf 3, cav 1; spirit Guards Tradition: org .05, def .04|The First Foot Guards parade again at Potsdam.|
reichstag|Reichstag Restored|23|6|constit|stab 6; legit 8; ideo dem 8|The burnt chamber is rebuilt and filled.|
bismarck|Bismarckian Welfare|24|6|constit|law pensions; rad -.08|Insurance against sickness, accident and age: the old recipe.|
hochsee|High Seas Fleet Reborn|20|7|junker|guards|equip ships 40; build shipyard 2; spirit Imperial Navy: navy .1|Tirpitz's dream, laid down a second time.|
weltpol|Weltpolitik|22|7|junker|guards|reichstag|bismarck|infl 50; build shipyard 1|Germany demands her seat at every table.|
colonies|Demand the Colonies|21|8|weltpol|claim Windhoek, Dar es Salaam, Yaoundé, Lomé, Rabaul, Lae; tension 3|What was taken at Versailles is asked for back.|
mittel|Mitteleuropa|22|8|weltpol|faction Central Powers; fn inviteCentral|An old alliance under new management.|
habs|Back the Habsburgs|23|8|weltpol|rel AUT 40, HUN 40; guarantee AUT|A friendly dynasty on the Danube suits Berlin well.|
revanche|Alsace-Lorraine|20|9|colonies|claim Metz; ws 8|The Reichsland was ours for half a century.|mx angl
angl|Anglo-German Friendship|21|9|colonies|rel ENG 40; nap ENG|Cousins should not quarrel.|mx revanche
brest|Brest-Litovsk Redux|22|9|mittel|claim Riga, Tallinn, Kaunas, Minsk, Kiev; ws 5|In 1918 the east was ours to order.|
bagdad|Berlin–Baghdad Railway|23|9|habs|rel TUR 40, IRQ 20; trade TUR; infra 3|Sleeper cars from the Spree to the Tigris.|
emperors|League of Emperors|24|9|habs|rel JAP 30, ITA 20; infl 30|Thrones recognise one another.|
sun|A Place in the Sun|21|10|revanche|angl|spirit Imperial Fervour [730]: ws 15, atk .05|We demand no more than the others already have.|req tension 40
duchy|United Baltic Duchy|22|10|brest|core Riga, Tallinn; pp 60|A Hohenzollern prince for the Baltic Germans.|req own Riga
polking|Kingdom of Poland|23|10|brest|fn playPuppetPOL|Warsaw may keep a king, of our choosing.|
junta|The Generals' Government|27|3|dissolve|reconcile|pp 100; spirit Military Government: pp .15, org .05, legit -5|Soldiers do not make good ministers, but they keep order.|mx kaiser,republic,red; ai 0
honour|Restore the Army's Honour|26|4|junta|ig army 6 .2; spirit Unpolitical Soldier: atk .04|An oath to the state, not to a man.|
sound|Sound Money|28|4|junta|money 8; spirit Balanced Books: tax .08, invest .2|The bills are counted and the printing press stopped.|
revision|Peaceful Revision|27|5|honour|sound|rel ENG 25, FRA 10; infl 50; claim Danzig, Memel|The treaty can be amended by negotiation.|
corridor|Corridor Negotiations|26|6|revision|fn playDanzigSoft|An extraterritorial road and a German city.|mx eastpact
eastpact|Eastern Locarno|28|6|revision|nap POL, SOV; rel POL 30; stab 3|Guaranteed borders in the east as in the west.|mx corridor
heirs|Hindenburg's Heirs|27|7|corridor|eastpact|law autocracy; pp 80; legit 6|A president above the parties, with a general's bearing.|
bulwark|Bulwark Against Bolshevism|26|8|heirs|rel POL 20, FIN 20, ROM 20; spirit Eastern Watch: def .05; fn factionBulwark|A cordon from the Arctic to the Black Sea.|mx mediator
mediator|The Armed Mediator|28|8|heirs|spirit armed_neutrality|Strong enough that no one dares, calm enough that no one needs to.|mx bulwark
republic|Reforge the Republic|31|3|dissolve|reconcile|setIdeo dem; rmspirit versailles; rel ENG 30, FRA 30, USA 20|Weimar failed. The next republic must not.|mx kaiser,junta,red; ai 0
basic|A New Basic Law|31|4|republic|legit 10; stab 6; law universal, protected|Human dignity shall be inviolable.|
extremes|Ban the Extremes|30|5|basic|ideo fas -10, com -6; rad -.05|A democracy able to defend itself.|
federal|Federal States|32|5|basic|build admin 2; spirit Federalism: tax .05, stab 3|Power is divided so it cannot be seized whole.|
press|Free Press Charter|33|5|basic|ig intel 6; spirit Open Debate: research .05|Newspapers reopen under their old mastheads.|
codet|Co-Determination|29|6|extremes|law protections; ig union 6|Workers sit on the supervisory board.|
market|Social Market Economy|30|6|extremes|law interventionism; spirit Social Market: invest .25, output .04, rad -.05|Prosperity for all, through competition with a conscience.|
dmark|Currency Reform|31|6|federal|money 10; spirit Hard Currency: tax .06|Forty new marks a head, and full shop windows overnight.|
league|Rejoin the League|32|6|federal|infl 60; rel ENG 15, FRA 15; tension -3|Germany returns to Geneva.|
vigil|Democratic Vigilance|29|7|codet|law guard; rad -.06; stab 3|An office for the protection of the constitution.|
recon|Franco-German Reconciliation|31|7|dmark|league|rel FRA 50; nap FRA; fn dropClaimsFrance|The hereditary enmity is buried at Verdun.|
locarno|Eastern Guarantees|33|7|league|guarantee POL, CZE; rel POL 30, CZE 30|Our word, this time, is worth something.|
credit2|American Credit|30|8|market|rel USA 40; trade USA; money 12|Dollars prime the pump.|
coal|Coal and Steel Community|31|8|recon|trade FRA, BEL, HOL, LUX; spirit Coal and Steel Community: output .05, tradecap .1|War becomes materially impossible.|
contain|Contain the Dictators|33|8|locarno|ws 10; spirit Democratic Resolve: ws 8, def .03|Never again alone, never again silent.|req tension 30
miracle|Economic Miracle|30|9|credit2|build autos 2, engines 1, urban 3; spirit Wirtschaftswunder [1460]: output .08, invest .3|Refrigerators, motor scooters and holidays in Italy.|
euunion|Union of European Democracies|31|9|coal|faction European Union; fn inviteEU|From the Atlantic to the Oder, one community.|mx allies
allies|Join the Western Powers|32|9|recon|fn joinAllies|Germany's place is among the democracies.|mx euunion
edc|European Defence Community|31|10|euunion|allies|units inf 4; spirit Common Army: def .06, org .05|Citizens in uniform under a common command.|
red|Free Thälmann|35|3|dissolve|reconcile|setIdeo com; rel SOV 40; stab -6|The prison gates open and the red flags come out.|mx kaiser,junta,republic; ai 0
council|Council Republic|35|4|red|law council; ig union 6 .3; pp 60|All power to the councils, twenty years late.|
plan|German Five-Year Plan|35|5|council|law command; build steel 2, tools 2, power 2|The combines belong to the people now.|
expro|Expropriate the Junkers|36|5|council|ig land -10 -.4; build farm 3; rad -.05|Junker land into peasant hands.|
moscow|The Moscow Line|35|6|plan|expro|fn joinComintern|The fatherland of all workers leads; we follow.|mx luxem
luxem|Luxemburg's Path|36|6|plan|expro|law protected; spirit Council Democracy: stab 6, rad -.1, research .05|Freedom is always the freedom of the one who thinks differently.|mx moscow
rotfront|Red Front Fighters|35|7|moscow|luxem|units mil 8, inf 2; spirit Proletarian Hundreds: manpower .08|The clenched fist returns to the streets, this time in government.|
rhinesov|Revolution to the Rhine|36|7|moscow|luxem|claim Metz, Brussels, Amsterdam; fn exportRev|The Rhine has never stopped an idea.|
intern|Congress of the International|35|8|rotfront|rhinesov|infl 60; fn internat|Delegates from forty countries meet in Berlin.|
four|Four Year Plan|41|0||spirit four_year_plan; tech p_synthetic; build arms 2 ?? Guns before butter => build arms 2; rad .04; spirit Guns Before Butter: mil_out .08, needs -.05 // Keep the shops full => stab 4; build textile 2, furniture 1|The economy must be fit for war within four years.|ai 3; sec Economy
autobahn|Reichsautobahn|39|1|four|infra 4; build construction 1|Ribbons of concrete across the country.|
mefo|MEFO Bills|41|1|four|money 14; spirit Hidden Deficit [1095]: tax -.05, mil_out .08 ?? Redeem them on schedule => money -8; legit 4 // Roll them over and print more => money 12; rad .03; stab -2|Rearmament on a credit card nobody is meant to see.|
reichswerke|State Steel Works|43|1|four|build steel 3, ironm 2|If private industry will not smelt low-grade ore, the state will.|
autarky|Autarky Programme|45|1|four|build synth 2, coalm 2|Rubber and fuel from coal: independence from the world market.|
erzeug|Battle for Production|37|2|autobahn|build farm 4; tech p_fert, p_tractors|Every hectare under the plough.|
volkswagen|The People's Car|38|2|autobahn|build autos 2, engines 1|Five marks a week buys a savings stamp towards a car.|
todt|Construction Corps|39|2|autobahn|build construction 2; spirit Engineering Corps: build .1|One organisation for every great building site.|
newplan|New Plan Trade|40|2|mefo|trade HUN, ROM, YUG, BUL; spirit Bilateral Clearing: tradecap .1|Buy only from those who buy from us.|
price|Price Commissioner|41|2|mefo|spirit Fixed Prices: rad -.03, needs -.03|Wages and prices frozen by decree.|
salz|Salzgitter Ore|43|2|reichswerke|build ironm 3, steel 1|Poor ore, but ours.|
ruhr|Ruhr Expansion|44|2|reichswerke|build coalm 3, steel 2, power 1|The forge of the continent adds new furnaces.|
buna|Synthetic Rubber|45|2|autarky|build synth 2; spirit Rubber from Coal: mil_out .03|Tyres from coal and limestone.|
leuna|Coal Liquefaction|46|2|autarky|build synth 2, chem 1|A drop of petrol from a lump of lignite.|
timber|Scandinavian Timber and Ore|37|3|erzeug|trade SWE, FIN, NOR; build logging 2|The northern trade is worth more than colonies.|
motor|Motorise the Nation|38|3|volkswagen|build autos 1; equip autos 150; tech m_mot|Tax breaks for every lorry.|
westwall|Westwall|39|3|todt|fort Essen, Frankfurt, Stuttgart|Dragon's teeth from Cleves to Basel.|
silesia|Silesian Industry|40|3|newplan|build coalm 2, steel 1, power 1|A second Ruhr, out of range of western bombers.|
chemical|Chemical Giants|41|3|price|build chem 3; tech p_petro|Dyes, drugs, explosives and fertiliser from one combine.|
electro|Electrical Industry|42|3|reichswerke|build power 3, tools 2; tech p_electrification|Turbines, cables and valves.|
machine|Machine-Tool Supremacy|43|3|salz|build tools 3; tech p_precision|The machines that make the machines.|
alu|Light Metals|44|3|ruhr|build aircraftp 1, power 1|Aluminium is electricity made solid.|
hydro|Hydrogenation Plants|45|3|buna|leuna|build synth 2|Twelve plants, four million tons a year: on paper.|
fuel|Strategic Fuel Reserve|46|3|leuna|build oilr 1; spirit Fuel Depots: supply .1|Underground tanks for the first weeks of a war.|
farms|Hereditary Farms|37|4|timber|ig rural 5, land 3; build farm 2, ranch 2|The farm may not be sold or split.|
rail|Reichsbahn Programme|39|4|motor|westwall|infra 5; tech p_rail|Rolling stock for a continental timetable.|
linz|Linz Steelworks|40|4|silesia|build steel 2, power 2|Styrian ore and Danube barges.|req own Vienna
protector|Protectorate Industry|41|4|chemical|build arms 2, tools 2, engines 1|Bohemian workshops under new management.|req own Prague
society|Research Society|42|4|electro|build university 2; res 30|Institutes for physics, chemistry and metals research.|
techuni|Technical Universities|43|4|machine|build university 2; spirit Engineers' Republic: research .05|A diploma in engineering is a title of nobility.|
speer|Armaments Ministry|41|5|protector|society|techuni|linz|rail|spirit Armaments Miracle: mil_out .12, output .03|An architect is handed the war economy and told to perform one.|req war
ration|Rationalisation|40|6|speer|build tools 2; spirit Flow Production: output .05|One factory, one product.|
standard|Standardised Designs|41|6|speer|spirit Frozen Designs: mil_out .06, upkeep -.05|No more modifications on the assembly line.|
disperse|Disperse the Factories|42|6|speer|spirit Dispersed Industry: civdef .4|No single raid should stop a whole programme.|
hands|Mobilise Every Hand|40|7|ration|mp 200; spirit Total Labour Draft: output .04, rad .03|The last reserves of the home front.|
board|Central Planning Board|41|7|standard|ration|build construction 2; spirit Central Planning: build .08, mil_out .05|Steel is allotted by committee, weekly.|
under|Underground Factories|42|7|disperse|build arms 2, aircraftp 2; spirit Tunnel Works: civdef .3|Assembly halls in salt mines and railway tunnels.|
preserve|Preserve the Nation's Substance|41|8|board|pp 50; stab 3|What is left must still be there when it is over.|
heer|Wehrmacht Expansion|51|0||spirit army_reform; units inf 4; mp 200|Thirty-six divisions is only the beginning.|ai 2; sec Heer
staff|General Staff Reborn|49|1|heer|generals Franz Halder/3/log; spirit War Academy: org .04|The Truppenamt drops its disguise.|
conscript|Reintroduce Conscription|51|1|heer|law extensive; mp 300|Every class of young men will serve.|
panzer|Panzerwaffe|53|1|heer|tech m_tank1, m_mot; build tankp 1; units arm 1 ?? Concentrate the tanks in their own divisions => units arm 2; spirit Armoured Divisions: tank .08 // Parcel them out to the infantry => units inf 3; spirit Infantry Tanks: def .04|A mailed fist for the army.|req bld tankp 1
auftrag|Auftragstaktik|48|2|staff|spirit Mission Command: org .08, atk .03|Tell a subordinate what to achieve, never how.|
academy|Staff Rides|49|2|staff|generals Walther von Reichenau/3/off|Every campaign is fought on the map before it is fought on the ground.|
mg|Universal Machine Gun|50|2|conscript|equip arms 400; spirit Belt-Fed Squads: def .04|One weapon as light gun and heavy gun alike.|
arty|Artillery Modernisation|51|2|conscript|tech m_art1; equip artillery 200; build artyf 1|New howitzers on split trails.|
gebirgs|Mountain Troops|52|2|conscript|tech m_mtn; units mtn 2|Edelweiss on the cap.|
guderian|Achtung – Panzer!|53|2|panzer|spirit manoeuvre_doctrine|Tanks concentrated, never dispersed.|
pz3|Medium Tank Programme|54|2|panzer|tech m_tank2; build tankp 1|A three-man turret and a radio in every vehicle.|
motinf|Motorise the Infantry|55|2|panzer|units mot 2; equip autos 200|Riflemen who keep pace with the tanks.|
signals|Signals and Ciphers|48|3|auftrag|tech m_radio; spirit Cipher Machines: def .03, infl .1|Rotors and plugboards for every headquarters.|
logist|Quartermaster General|49|3|academy|tech m_log; spirit Supply Columns: supply .15|Amateurs discuss tactics.|
pioneer|Assault Pioneers|50|3|mg|spirit Storm Engineers: atk .03, entrench .05|Flamethrowers, charges and rubber boats.|
heavyart|Heavy Artillery|51|3|arty|equip artillery 250; build artyf 1|Siege guns for the fortresses of the west.|
jaeger|Light Divisions|52|3|gebirgs|units mtn 1, inf 2|Infantry for bad country.|
blitz|Lightning War Doctrine|53|3|guderian|tech m_doc1, m_doc2; spirit Schwerpunkt: tank .1, org .05|Find the weak point and pour everything through it.|
sturm|Assault Guns|54|3|pz3|equip tanks 150; spirit Armoured Infantry Support: atk .03|A gun on tracks for the infantry.|
halftrack|Armoured Carriers|55|3|motinf|equip autos 150; tech m_log|Half tracks, half wheels.|
winterkit|Winter Equipment|49|4|logist|spirit Winter Kit: supply .1, def .03|Fur caps and low-temperature grease.|req atwar SOV
ersatz|Replacement Army|50|4|pioneer|mp 300; spirit Training Depots: train .15|Each field division keeps a battalion at home.|
nebel|Rocket Launchers|51|4|heavyart|tech m_art2|Six barrels and a howl.|
fallsch|Paratroopers|52|4|jaeger|units mtn 2; spirit Airborne Arm: atk .02|Infantry delivered from the sky.|
combined|Combined Arms School|53|4|blitz|res 25; spirit Battle Groups: atk .04, def .03|Tanks, guns and riflemen under one colonel.|
tiger|Heavy Tank Programme|54|4|sturm|tech m_tank3; units arm 1|Fifty-six tons and an eighty-eight.|req war
pzgren|Panzergrenadiers|55|4|halftrack|units mot 3|The infantry of the armoured divisions.|
pak|Anti-Tank Guns|50|5|ersatz|nebel|equip artillery 200; spirit Gun Lines: def .05|Long barrels dug in on the reverse slope.|
elite|Guards Panzer Corps|53|5|combined|units arm 2; generals Hasso von Manteuffel/4/panzer|The pick of men and machines.|
panther|Next-Generation Medium|54|5|tiger|build tankp 2; spirit Sloped Armour: tank .1|An answer to the tanks met in the east.|req majorwar
pzfaust|Infantry Anti-Tank Weapons|50|6|pak|equip arms 300; spirit Tank Hunters: def .04|A tube, a warhead and a steady nerve.|req war
stg|Assault Rifle|51|6|pak|tech m_smg, m_assault|An intermediate cartridge changes the rifle squad.|req majorwar
ostheer|Eastern Army Staff|52|6|combined|generals Gotthard Heinrici/4/def; spirit Elastic Defence: def .04|Giving ground to keep an army.|req atwar SOV
sickle|Sickle Cut|53|6|elite|spirit Operational Surprise [365]: atk .1|The main blow where nobody expects armour.|req atwar FRA
volksgren|People's Grenadiers|50|7|pzfaust|stg|units inf 8|Divisions rebuilt from clerks, sailors and convalescents.|req majorwar
luft|Unveil the Luftwaffe|59|0||build aircraftp 2; tech m_air1; equip aircraft 150|The flying clubs take off their civilian clothes.|ai 2; sec Luftwaffe
fighter|Fighter Arm|57|1|luft|equip aircraft 200; spirit Fighter Wings: air .08|Monoplanes with enclosed cockpits.|
stuka|Dive Bombers|58|1|luft|tech m_cas; spirit Flying Artillery: cas .25|A siren on the undercarriage.|
bomber|Bomber Arm|59|1|luft|equip aircraft 200; tech m_air2|Twin engines and a glazed nose.|
flak|Flak Arm|60|1|luft|spirit Flak Belt: civdef .25, def .02|Guns that can shoot at aircraft or at tanks.|
transport|Air Transport Fleet|61|1|luft|equip aircraft 80; spirit Corrugated Workhorses: supply .08|Three engines and room for seventeen.|
experten|Flying Schools|57|2|fighter|mp 50; spirit Trained Aircrew: air .06|Glider clubs feed the academies.|
contract|Fighter Contract|58|2|fighter|build aircraftp 1; equip aircraft 250|One airframe wins the competition and the order book.|
ural|Strategic Bomber Project|59|2|bomber|spirit Long-Range Bombers: bombing .4|Four engines to reach the far side of the mountains.|mx schnell
schnell|Fast Medium Bombers|60|2|bomber|equip aircraft 300; spirit Tactical Air Fleet: cas .1|A bomber no fighter can catch, this year.|mx ural
radar|Early-Warning Radar|61|2|flak|tech m_radar|Aerials on the islands of the North Sea.|
airland|Air-Landing Division|62|2|transport|units mtn 2|Infantry trained to step out of a transport under fire.|
aces|Aces and Experts|57|3|experten|spirit Veteran Pilots: air .06|Finger-four formations learned the hard way.|
cas|Close Support Doctrine|58|3|stuka|spirit air_doctrine|Liaison officers ride with the leading tanks.|
maritime|Maritime Strike Wing|60|3|ural|schnell|spirit Torpedo Bombers: navy .06|Aircraft against shipping.|
night|Night Fighters|61|3|radar|spirit Night Hunting: civdef .2, air .04|Searchlights, ground control and patience.|req war
jet|Jet Propulsion|58|4|cas|aces|tech m_air3|A turbine in place of a propeller.|date 1941-6
v1|Flying Bomb|59|4|maritime|spirit Pilotless Aircraft: bombing .3|A pulse-jet and a gyroscope.|req war
defline|Air Defence Line|61|4|night|spirit Radar Boxes: civdef .2|A belt of boxes, each with its own fighter.|
swallow|Jet Fighter Wings|58|5|jet|equip aircraft 300; spirit Turbine Fighters: air .12|A hundred miles an hour faster than anything else aloft.|
amerika|Intercontinental Bomber|59|5|v1|res 20; spirit Transatlantic Range: bombing .3|Six engines for the far shore.|req atwar USA
reichsv|Defence of the Reich|61|5|defline|equip aircraft 400; spirit Home Air Fleet: air .08|Every fighter home to guard the factories.|req majorwar
marine|Rebuild the Kriegsmarine|66|0||build shipyard 2; equip ships 15|The treaty's tonnage limits were always a suggestion.|ai 2; sec Kriegsmarine
agna|Anglo-German Naval Agreement|65|1|marine|rel ENG 20; equip ships 10|Thirty-five per cent of the Royal Navy, with London's blessing.|mx repud
repud|Repudiate the Naval Limits|67|1|marine|rel ENG -20; build shipyard 2; tension 2|We will build what we please.|mx agna
planz|Plan Z|65|2|agna|repud|equip ships 40; build shipyard 2|A balanced fleet by 1948.|mx uboat
uboat|U-Boat Priority|67|2|agna|repud|tech m_nav2; equip ships 25; spirit Wolfpacks: navy .12|Three hundred boats would strangle Britain.|mx planz
pocket|Pocket Battleships|64|3|planz|equip ships 25|Faster than anything stronger, stronger than anything faster.|
carrier|Aircraft Carrier|65|3|planz|tech m_nav1; equip ships 20|A flight deck for the North Atlantic.|
raiders|Merchant Raiders|66|3|planz|uboat|spirit Disguised Cruisers: navy .05, tradecap .03|Freighters with hidden guns on every ocean.|
type7|Mass-Produced Submarines|67|3|uboat|equip ships 40|One design, welded in sections.|
milch|Supply Submarines|68|3|uboat|spirit Ocean Tankers: navy .06|Fuel and torpedoes delivered in mid-Atlantic.|
bism|Battleship Programme|64|4|pocket|equip ships 40|Forty thousand tons to tie down a whole fleet.|
sboat|Fast Attack Craft|65|4|carrier|raiders|spirit Channel Flotillas: navy .04|Diesel boats that own the narrow seas at night.|
bdienst|Naval Signals Intelligence|66|4|raiders|spirit Reading the Convoys: navy .08|The enemy's convoy code is an open book.|
mines|Mine Warfare|67|4|type7|spirit Mine Barrages: navy .04, def .02|Magnetic mines in every estuary.|
elektro|Electric Boats|68|4|milch|type7|spirit True Submarines: navy .15|A boat that never needs to surface.|req majorwar
baltic|Baltic Supremacy|64|5|bism|fort Königsberg, Stettin; spirit Training Sea: navy .06|The ore route and the training grounds stay safe.|
marines|Naval Infantry|65|5|sboat|units inf 2; spirit Landing Flotillas: navy .05|Ferries with ramps and guns.|
bases|Atlantic Bases|66|5|bdienst|build shipyard 2, port 2; spirit Biscay Pens: navy .08|Concrete pens on the Bay of Biscay.|req own Nantes
arctic|Arctic Bases|67|5|mines|spirit Northern Flank: navy .05|From Narvik against the Murmansk run.|req own Narvik
tonnage|Tonnage War|67|6|elektro|arctic|bases|spirit Tonnage War [720]: navy .15|Sink them faster than they can build.|req atwar ENG
hwa|Army Ordnance Office|71|0||build university 1; res 20; spirit Weapons Office: proj .15|Every strange idea in the Reich crosses one desk.|ai 2; sec Secret Weapons
peene|Baltic Rocket Centre|70|1|hwa|spirit Rocket Centre: proj .2|A test stand on a sandy island.|
proving|Proving Grounds|71|1|hwa|build tools 1; spirit Trials Units: proj .1|Prototypes are broken here so they do not break at the front.|
uran|Uranium Club|72|1|hwa|res 30; spirit Nuclear Physics Circle: proj .1, research .03|A handful of physicists and a letter to the war ministry.|date 1939-9
a4|Ballistic Rocket Programme|70|2|peene|proj 40; spirit Long-Range Rockets: bombing .2|Thirteen tons to the edge of space.|req war
horten|Flying Wing|71|2|proving|proj 30; spirit Tailless Designs: air .05|An aircraft that is nothing but wing.|
heavywater|Heavy Water|72|2|uran|proj 60; res 20|A hydroelectric plant in Norway makes something rare.|req own Oslo
guided|Guided Missiles|70|3|a4|spirit Radio Guidance: civdef .2, proj .1|A rocket that can be steered onto a bomber stream.|
maus|Super-Heavy Designs|71|3|proving|units arm 1; spirit Land Battleships: tank .05|A hundred and eighty tons of ambition.|
pile|Reactor Experiments|72|3|uran|tech p_atomic|Cubes of uranium hung in a tank.|date 1942-1
nightsight|Night Sights|73|3|proving|proj 30; spirit Infrared Optics: atk .02|Seeing by a light nobody else can see.|
bombe|The Bomb|72|4|pile|tech p_bomb|A weapon that makes every other project irrelevant.|date 1944-6
zuse|Program-Controlled Computer|73|4|nightsight|spirit Relay Calculators: research .06|Two thousand relays and a punched film.|
`);

TREES.HUN = parseTree('h_', `
regency|The Regency Question|9|0||pp 60; stab 4|A kingdom without a king, ruled by an admiral without a fleet.|sec Politics
horthy|Strengthen the Regent|2|1|regency|pp 60; legit 8; ideo aut 6 ?? Lean on Rome => rel ITA 20 // Lean on Berlin => rel GER 20|The Regent's powers are widened; parliament may no longer impeach him.|mx habs,demo,arrow,kun; aiIdeo aut; ai 4
gombos|Gömbös's Legacy|1|2|horthy|rel GER 20, ITA 20; ideo fas 4|The late premier coined the word "axis". His friends remember.|
bethlen|Bethlen's Counsel|3|2|horthy|rel ENG 20; stab 4; ideo dem 3|The old count advises caution and an open door to London.|
rome|Rome Protocols|1|3|gombos|trade ITA, AUT; rel ITA 20, AUT 20|Wheat for Italian arms, with Vienna as go-between.|
dynasty|A Horthy Dynasty|3|3|bethlen|legit 10; pp 40|The Regent's son is named Vice-Regent.|
berlin|Berlin Alignment|0|4|rome|fn joinAxis|Revision runs through Berlin.|mx teleki; req ex GER; ai 4
teleki|Teleki's Balancing Act|2|4|rome|bethlen|rel ENG 15; spirit Guarded Sovereignty: def .08, stab 4 ?? Armed neutrality => spirit armed_neutrality // Tie ourselves to the Axis => rel GER 20; ws 4|Take what Germany offers and promise as little as possible.|mx berlin; ai 1
vienna1|First Vienna Award|0|5|berlin|claim Košice, Uzhhorod; fn playHUN_CZE|Upper Hungary and Ruthenia come back by arbitration.|
tripart|Sign the Tripartite Pact|1|5|berlin|equip arms 300; rel GER 30; spirit Axis Arms Deliveries: mil_out .06|A signature in Vienna, and German rifles in return.|
kallay|Feelers to the West|2|5|teleki|rel ENG 20, USA 20; infl 30 ?? Secret talks with London => rel ENG 20; rel GER -15 // Keep faith with Berlin => rel GER 15; stab 2|Discreet meetings in Istanbul and Lisbon.|
stcrown|Lands of the Holy Crown|3|5|dynasty|claim Bratislava, Košice, Uzhhorod, Cluj, Timișoara, Zagreb; ws 8|Everything, back.|
vienna2|Second Vienna Award|0|6|vienna1|fn playCluj|Northern Transylvania and the Szekler land.|
crusade|March East|1|6|tripart|units inf 4, mot 1; ws 8|The Second Army entrains for the Don.|req gerSovWar
swing|The Swing Policy|2|6|kallay|stab 5; rel ENG 20; spirit Double Game: caplimit .1|Fight in the east as little as possible, and wait.|
crownking|Elect a King|3|6|stcrown|legit 12; stab 5; spirit Crowned Kingdom: legit 8, stab 3|The throne is filled at last.|
south|Reclaim the South|0|7|vienna2|claim Zagreb, Timișoara; ws 5|The Bácska, the Banat and the road to the sea.|
habs|Call Otto Home|7|1|regency|fn leaderOtto; legit 10; rel AUT 40, GER -20|The legitimate heir has been waiting in Belgium since he was a child.|mx horthy,demo,arrow,kun; ai 0
legitim|Legitimist Officers|6|2|habs|ig army 5; units inf 2|Many colonels still wear the old decorations.|
crown|Coronation in Buda|7|2|habs|stab 8; law monarchy; spirit Apostolic King: legit 10|Saint Stephen's crown is set on a Habsburg head once more.|
magnates|Magnates' Compact|8|2|habs|ig land 6 .2; pp 40|The great families rally to the dynasty.|
italyg|Guarantee from Rome|5|3|legitim|rel ITA 30; fn guarFromITA|The Duce prefers a Habsburg to a German on the Danube.|ai 0
vienna|Vienna and Budapest|7|3|crown|rel AUT 50; ally AUT|Two capitals, one house.|
westg|Western Sympathy|9|3|magnates|rel ENG 25, FRA 25; infl 30|London and Paris see a counterweight to Berlin.|
union|Restore the Dual Monarchy|7|4|vienna|fn unionAustria|The Compromise of 1867, signed a second time.|req ex AUT
ausgleich|A New Compromise|6|5|union|stab 6; spirit Dual Parliament: legit 6, tax .05|Delegations meet alternately in each capital.|req own Vienna
bohemia|The Bohemian Crown|7|5|union|claim Prague, Brno, Karlsbad, Reichenberg, Bratislava, Košice|Saint Wenceslas's crown was the third jewel.|
croatia|The Triune Kingdom|8|5|union|claim Zagreb, Ljubljana, Sarajevo|The South Slavs of the old realm.|
galicia|Galicia and Lodomeria|6|6|bohemia|claim Kraków, Lwów|The Carpathian arc, complete.|
danubefed|Danubian Federation|7|6|bohemia|croatia|faction Danubian League; fn inviteDanube; spirit Federal Crown Lands: rad -.08, stab 4|A commonwealth of nations under one crown.|
transyl|Transylvania Returns|8|6|croatia|claim Cluj, Timișoara, Czernowitz|Beyond the forest.|
kuk|Imperial and Royal Army|7|7|danubefed|units inf 4, mtn 2; spirit Common Army: org .06, def .04|Eleven languages of command.|
adriatic|Return to the Adriatic|8|7|transyl|danubefed|build shipyard 1, port 1; equip ships 10|The admiral finally has a sea.|req own Zagreb
demo|Liberal Opening|12|1|regency|ideo dem 14; law protected|Censorship is lifted and the opposition press returns.|mx horthy,habs,arrow,kun; aiIdeo dem; ai 0
small|Smallholders' Government|12|2|demo|setIdeo dem; ig rural 6|The party of the village takes office.|
land|The Great Land Reform|11|3|small|spirit land_reform; ig land -8 -.3, rural 8|Three million beggars become three million owners.|
secret|Secret Ballot|12|3|small|law universal; legit 8|The open vote in the countryside is abolished.|
socdem|Social Democratic Pact|13|3|small|law regulated; ig union 5|The unions are brought inside the tent.|
karolyi|Károlyi's Vision|11|4|land|rel CZE 30, ROM 30, YUG 30; nap ROM, CZE|Reconciliation with the successor states.|
repub|Proclaim the Republic|12|4|secret|law parliamentary; stab 4; legit 5|The empty throne is put into storage.|mx kingdom
kingdom|Kingdom Without a Regent|13|4|secret|legit 8; pp 40|The forms are kept; the substance is parliamentary.|mx repub
danubec|Danube Confederation|11|5|karolyi|faction Danube Confederation; fn inviteNeighbours|Kossuth's old dream of a league of small nations.|
allies|Western Alignment|12|5|repub|kingdom|fn joinAllies; rel ENG 30, FRA 30|Hungary chooses its side early.|mx neutral
neutral|Hungarian Neutrality|13|5|repub|kingdom|spirit armed_neutrality|A Switzerland on the Danube.|mx allies
minority|Minority Statute|11|6|danubec|stab 4; rad -.05; rel ROM 20, CZE 20, YUG 20|Schools and courts in every mother tongue.|
welfare|Village Welfare|12|6|allies|neutral|law pensions; rad -.06|Doctors and pensions reach the puszta.|
arrow|Hungarism|16|1|regency|ideo fas 14; ws 5|A retired major preaches a national socialism of his own invention.|mx horthy,habs,demo,kun; aiIdeo fas; ai 0
szalasi|Szálasi Takes Power|16|2|arrow|setIdeo fas; stab -5|The green shirts march on the Castle.|
greater|Carpathian-Danubian Fatherland|15|3|szalasi|claim Bratislava, Košice, Uzhhorod, Cluj, Timișoara, Zagreb, Belgrade; ws 10|A realm from the Carpathians to the Adriatic.|
workstate|The Work State|16|3|szalasi|law corporatist; build arms 1, steel 1|Corporations in place of classes.|
militia|Party Militia|17|3|szalasi|units mil 6, inf 2|Armed party men in every district.|
third|A Third Way|15|4|greater|rel GER -10; spirit Hungarist Zeal: ws 8, atk .04|Neither Berlin's satellite nor anyone else's.|mx axis
axis|Blood Alliance|16|4|workstate|fn joinAxis|Tied to the Reich for victory or ruin.|mx third; req ex GER
turan|Turanian Brotherhood|17|4|militia|rel FIN 20, TUR 20, JAP 30, BUL 20; infl 40|Kinship claimed from Helsinki to Tokyo.|
conquer|War of Restoration|16|5|axis|third|spirit Restoration Fever [540]: atk .08, ws 10; fn pressClaims|The borders of the thousand-year kingdom, by force.|
kun|The Councils Return|19|1|regency|ideo com 14|The hundred and thirty-three days of 1919 are remembered differently in the factories.|mx horthy,habs,demo,arrow; aiIdeo com; ai 0
rev|Second Council Republic|19|2|kun|setIdeo com; stab -6|Red flags over the Parliament on the Danube.|
redarmy|Hungarian Red Army|18|3|rev|units mil 8, inf 2|Workers' battalions from Csepel and Újpest.|
tillers|Land to the Tillers|19|3|rev|ig land -10 -.5, rural 6; build farm 3|The mistake of 1919 is not repeated: the peasants get the land.|
iron|Country of Iron and Steel|20|3|rev|law command; build steel 2, coalm 1, tools 1|Heavy industry first, whatever the ore deposits say.|
moscow|Under Moscow's Wing|19|4|tillers|redarmy|fn joinComintern|Protection has its price.|mx national
national|National Communism|20|4|iron|claim Košice, Cluj; spirit Own Road to Socialism: stab 5, legit 5|Red, but Hungarian.|mx moscow
redslovak|Slovak Council Republic|19|5|moscow|national|claim Bratislava, Košice; fn exportRevCZE|In 1919 it lasted three weeks.|
gyor|The Győr Programme|24|0||build arms 2, artyf 1, steel 1; money -2|A billion pengő for rearmament, announced in a provincial town.|sec Economy
wheat|Wheat Exports|22|1|gyor|build farm 4; trade GER, ITA|The Great Plain feeds Central Europe.|
csepel|Csepel Works|23|1|gyor|build arms 1, engines 1, aircraftp 1|An island of chimneys in the Danube.|
bauxite|Bauxite of Transdanubia|24|1|gyor|build ironm 2, aircraftp 1|Europe's richest aluminium ore.|
zala|Zala Oilfields|25|1|gyor|fn zalaOil; build oilr 2|American drillers strike oil in the south-west.|
tisza|Tisza Irrigation|22|2|wheat|build farm 3; tech p_fert|Canals for the dry side of the river.|
ganz|Electrify the Railways|23|2|csepel|infra 3; build power 1; tech p_electrification|A Hungarian invention pulls the Vienna express.|
polytech|Technical University|24|2|bauxite|build university 2; res 25|The school that produced a generation of physicists.|
refine|Refineries|25|2|zala|build chem 2; tech p_petro|Crude becomes petrol within sight of the wells.|
engines|Engine Works|23|3|ganz|build engines 2, tankp 1; tech m_tank1|Railcars today, armoured cars tomorrow.|
bank|National Industrial Bank|24|3|polytech|spirit Directed Credit: invest .3, build .05|Credit steered toward the chimneys.|
billion|One Billion Pengő|24|4|bank|engines|refine|build arms 2, tools 1, construction 1; spirit Rearmament Loan: mil_out .1|A capital levy on the rich pays for the guns.|
bled|The Bled Agreement|30|0||rel YUG 15, ROM 15, CZE 15; law limited; mp 150; spirit army_reform|The Little Entente concedes our right to rearm.|sec Honvédség
ludovika|Ludovika Academy|28|1|bled|generals Géza Lakatos/3/def, Ferenc Szombathelyi/3/log|Officers for an army five times the treaty size.|
huba|The Huba Plan|30|1|bled|units inf 4; equip arms 300|Twenty-five brigades by 1940.|
airforce|Royal Hungarian Air Force|32|1|bled|build aircraftp 1; tech m_air1; equip aircraft 120|The secret "weather service" is renamed.|
artillery|Artillery Reform|28|2|ludovika|tech m_art1; equip artillery 150; build artyf 1|New guns from Diósgyőr.|
hussar|Hussar Tradition|29|2|huba|units cav 2; spirit Light Cavalry Spirit: org .04|The word itself is Hungarian.|
border|Border Guard|30|2|huba|fort 1; units mtn 1|Blockhouses on every pass.|
rapid|Rapid Corps|31|2|huba|tech m_mot, m_tank1; units mot 1, arm 1|Cavalry, cyclists and tanks under one command.|
fighters|Fighter Licences|32|2|airforce|equip aircraft 150; spirit Licensed Fighters: air .08|Italian designs, Hungarian factories.|
carpath|Carpathian Brigades|29|3|hussar|tech m_mtn; units mtn 2|Riflemen for the high ridges.|
arpad|The Árpád Line|30|3|border|fort Debrecen, Budapest; spirit Valley Blocks: entrench .1|Small forts that close the valleys instead of crowning the peaks.|
toldi|Light Tank Licence|31|3|rapid|equip tanks 120; build tankp 1|A Swedish design built under licence.|
flotilla|Danube Flotilla|32|3|fighters|equip ships 6; spirit River Monitors: def .02|Gunboats on the great river.|
mobile|Mobile Defence|30|4|arpad|toldi|carpath|spirit Elastic Honvéd: def .06, org .05|Hold the passes, counter-attack in the plain.|
turant|Domestic Medium Tank|31|4|toldi|tech m_tank2; equip tanks 100|Named for the steppe homeland.|
`);

TREES.AUT = parseTree('a_', `
state|The Corporate State|8|0||pp 60; stab 4 ?? The Fatherland Front alone => pp 40; ideo aut 4 // Talk to the Socialists => ig union 6; stab 2|A republic that has abolished its parties and is not sure what it has become.|sec Politics
front|Fatherland Front Supreme|2|1|state|pp 60; ideo aut 8; legit 6|One movement for all loyal Austrians.|mx ostmark,habs,red; aiIdeo aut; ai 3
heim|Absorb the Heimwehr|1|2|front|units mil 4, inf 1; ig army 4|The private armies are folded into the state.|
church|Catholic Austria|3|2|front|ig devout 6; stab 4|The encyclicals as a constitution.|
july|The July Agreement|0|3|heim|rel GER 25; stab -2; pp 40|Berlin recognises our sovereignty; we admit to being a German state.|mx defy; ai 3
defy|Red-White-Red Until Death|2|3|heim|church|ws 15; cflag resist; spirit Will to Independence: ws 10, caplimit .15, def .05 ?? Mobilise on the Brenner => units mtn 2; ws 6 // Appeal to Mussolini => rel ITA 25|There will be no surrender by telephone.|mx july; ai 0
rome|Rome Protocols|3|3|church|rel ITA 30, HUN 20; trade ITA, HUN|Italy has divisions on the Brenner. They face north, for now.|
seyss|A Nationalist in Cabinet|0|4|july|ideo fas 10; rel GER 20|The interior ministry is the price of quiet.|
westa|Appeal to London and Paris|1|4|defy|rel ENG 25, FRA 25; fn guarFromWest|Austria's independence was written into their treaties.|
pleb|The Plebiscite|2|4|defy|legit 12; stab 6; ideo aut 6; cflag resist ?? Hold it this Sunday => legit 6; tension 2 // Postpone it => stab 2; pp 30|For a free and German, independent and social, Christian and united Austria.|
stresa|Italian Guarantee|3|4|rome|fn guarFromITA|The Duce once moved troops for us. Perhaps again.|ai 0
mobil|General Mobilisation|1|5|westa|pleb|law extensive; mp 100; units inf 3|The classes of 1915 are called to the colours.|req tension 15
little|Understanding with Prague|2|5|pleb|stresa|rel CZE 30, YUG 20; ally CZE|Two small states with the same neighbour.|mx neutral
neutral|Alpine Neutrality|3|5|pleb|stresa|spirit armed_neutrality|The Swiss solution.|mx little
estates|Republic of Estates|2|6|little|neutral|stab 6; spirit Settled Corporate Order: pp .1, legit 6|The experiment outlives its emergencies.|
ostmark|The German Path|6|1|state|ideo fas 14; rel GER 30|Many Austrians have wanted union since 1918.|mx front,habs,red; aiIdeo fas; ai 0
party|Legalise the Party|6|2|ostmark|setIdeo fas; stab -5|The banned movement walks out of the cellars.|
legion|The Legion Returns|5|3|party|units inf 3; ig army -3|Exiles trained in Bavaria march home.|
anschl|Home into the Reich|6|3|party|fn acceptAnschluss|Union, by invitation.|mx own; req ex GER
own|An Austrian Reich|7|3|party|claim Bratislava, Ljubljana, Brno; rel GER -15, ITA 20; spirit Vienna First: ws 8, legit 4|German, but governed from Vienna.|mx anschl
junior|Junior Partner|7|4|own|fn joinAxis|Allied to Berlin, not absorbed by it.|
bulwark|Alpine Bulwark|7|5|junior|fort Innsbruck, Vienna; units mtn 2|The mountains are our best divisions.|
habs|The Legitimist Cause|10|1|state|ideo aut 6; ig land 5, devout 4|Fifteen hundred towns have made Otto an honorary citizen.|mx front,ostmark,red; ai 0
otto|Otto Returns to Vienna|10|2|habs|fn leaderOtto; law monarchy; legit 12; rel GER -30; cflag resist|The Habsburg Law is repealed and the heir comes home.|
imperial|Imperial Guards|9|3|otto|units inf 2, cav 1; spirit Guard Regiments: org .05|White tunics on the Ringstrasse.|
crown|Crown and Constitution|10|3|otto|stab 6; law census|A monarch who has read the books on democracy.|
hofburg|Hofburg Diplomacy|11|3|otto|infl 50; rel ENG 20, FRA 20, ITA 20|The oldest foreign office in Europe reopens.|
budapest|Budapest and Vienna|10|4|crown|rel HUN 50; ally HUN|The other half of the monarchy also lacks a king.|
protect|Guarantee of the Powers|11|4|hofburg|fn guarFromWest|A Habsburg is a problem; a German Vienna is a catastrophe.|
dual|Restore the Dual Monarchy|10|5|budapest|fn unionHungary|Imperial and Royal, once again.|req ex HUN
bohem|Bohemian Crown Lands|9|6|dual|claim Prague, Brno, Karlsbad, Reichenberg|Prague was a Habsburg city for four centuries.|
illyria|The Illyrian Kingdom|10|6|dual|claim Ljubljana, Zagreb, Sarajevo|The South Slav lands.|
galic|Galician Inheritance|11|6|dual|claim Kraków, Lwów, Czernowitz|The far north-east of the old realm.|
kuk|Imperial and Royal Army|9|7|bohem|units inf 4, mtn 2; spirit Common Army: org .06, def .04|One army, many peoples.|
federal|United States of Greater Austria|10|7|bohem|illyria|galic|faction Danubian League; fn inviteDanube; spirit Federal Crown Lands: rad -.08, stab 4|The plan drawn up for an archduke who was shot at Sarajevo.|
outlet|An Adriatic Outlet|11|7|illyria|build shipyard 1, port 1; equip ships 8|A navy needs a coast.|req own Ljubljana
red|Red Vienna Returns|14|1|state|ideo dem 10, com 4; ig union 6|The municipal tenements still carry bullet scars from February 1934.|mx front,ostmark,habs; aiIdeo dem; ai 0
amnesty|Amnesty for February|14|2|red|rad -.08; stab 3; ig union 5|The prisoners of the civil war go free.|
renner|Renner's Republic|13|3|amnesty|setIdeo dem; law universal|The first chancellor of the first republic founds a second.|mx soviet
soviet|Austro-Marxist Revolution|16|3|amnesty|setIdeo com; stab -6|This time the Schutzbund does not wait to be attacked.|mx renner
consti|Constitution of 1920 Restored|12|4|renner|law parliamentary, protected; legit 10|Kelsen's text, with every comma back in place.|
housing|Municipal Housing|13|4|renner|law pensions; build urban 2; rad -.06|Sixty thousand flats, paid for by a tax on luxury.|
schutz|Republican Schutzbund|14|4|renner|units mil 4, inf 2; cflag resist|A militia sworn to the constitution.|
councils|Councils of Vienna|16|4|soviet|law council; ig union 6 .3|The district councils take over the ministries.|
redmil|Workers' Army|17|4|soviet|units mil 6, inf 2|The arsenal workers arm themselves.|
swiss|The Swiss Model|13|5|housing|consti|rel SWI 30; spirit armed_neutrality|Neutral, armed and rich.|mx west
west|Democratic Solidarity|14|5|schutz|housing|fn joinAllies; rel CZE 30, FRA 20|A small democracy cannot afford to stand alone.|mx swiss
moscow|Call on Moscow|16|5|councils|fn joinComintern|A red island needs a mainland.|mx third
third|The Vienna International|17|5|councils|infl 50; spirit Two-and-a-Half: stab 4, research .05|Between reform and Moscow there was once a third option.|mx moscow
danube|Danubian Economic Union|13|6|swiss|west|trade CZE, HUN, YUG, ROM; spirit Danubian Customs Union: tradecap .12, output .03|The old empire's market, without the empire.|
recover|Overcome the Crisis|21|0||money 6; rad -.04; build construction 1|The collapse of one Viennese bank shook the whole world.|sec Economy
schilling|The Alpine Dollar|20|1|recover|spirit Hard Schilling: tax .08, invest .15|A currency harder than the country behind it.|
erz|Erzberg Iron|21|1|recover|build ironm 3; fn erzRes|A mountain made of ore, quarried in terraces.|
works|Public Works|22|1|recover|infra 3; build construction 1|Roads over the passes.|
bank|Rescue the Creditanstalt|20|2|schilling|money 8; spirit Sound Banks: invest .2|The state swallows the losses.|
linz|Linz Steelworks|21|2|erz|build steel 3, tools 1|Blast furnaces on the Danube.|
hydro|White Coal|22|2|works|tech p_hydro; build power 3|The glaciers pay the electricity bill.|
road|High Alpine Road|23|2|works|infra 2; spirit Alpine Tourism: tradecap .05, stab 2|A toll road to the foot of the highest peak.|
school|The Vienna School|20|3|bank|build university 2; res 25|Economists, physicists and philosophers in the same coffee house.|
steyr|Steyr Arms|21|3|linz|build arms 2, engines 1; equip arms 200|Rifles, bicycles and motor cars from one valley.|
oil|Zistersdorf Oil|22|3|hydro|build oilr 2; fn oilRes|A modest field north of the capital.|
shipping|Danube Shipping|23|3|road|trade HUN, ROM, YUG; infl 20|Paddle steamers to the Black Sea.|
base|Alpine Industrial Base|21|4|steyr|school|oil|build chem 1, power 1, tools 2; spirit Alpine Industry: output .05|A small country that makes its own steel, power and guns.|
jansa|The Jansa Plan|27|0||law limited; mp 80; spirit army_reform; fort Vienna, Innsbruck|Hold the line of the Traun and wait for the world to notice.|sec Bundesheer
academy|Theresian Academy|25|1|jansa|generals Alfred Jansa/4/def, Sigismund Schilhawsky/2/old|The oldest military academy in the world.|
expand|Expand the Bundesheer|27|1|jansa|units inf 4; equip arms 250|Seven divisions become eight, then more.|
fast|The Fast Division|29|1|jansa|tech m_mot, m_tank1; units mot 1|Cavalry, motorcycles and a tank battalion.|
airreg|Air Regiments|25|2|academy|build aircraftp 1; tech m_air1; equip aircraft 100|Italian biplanes with red-white-red triangles.|
alpine|Alpine Jäger|26|2|expand|tech m_mtn; units mtn 3|Men who grew up on skis.|
guns|Böhler Guns|27|2|expand|tech m_art1; equip artillery 150; build artyf 1|A light gun that half of Europe buys.|
blocks|Border Blocks|28|2|expand|fort 2; spirit Prepared Demolitions: entrench .12|Every bridge is chambered for explosives.|
tankettes|Armoured Cars|29|2|fast|equip tanks 80; build tankp 1|Eight-wheeled cars with a driver at each end.|
fortress|Alpine Fortress|27|3|alpine|blocks|fort Innsbruck; spirit Alpine Citadel: def .1, caplimit .15|If the plains fall, the mountains fight on.|
militia|Front Militia|28|3|blocks|units mil 6|Part-time soldiers for the second line.|
delay|Delay and Defend|27|4|fortress|guns|spirit Fighting Withdrawal: def .06, org .05|Trade ground for time, and time for allies.|
`);

// Tools for the hand-written Asian trees (1.5): extra effect commands, extra requirements and an auto-layout tree builder.
'use strict';
BOP.MAN = ['Court and Garrison', 'Imperial Court', 'Kwantung Army', [['The Emperor Rules', { legit: 10, stab: 6, pp: 0.1, mil_out: -0.05 }], ['A Court with a Voice', { legit: 5, stab: 3 }], ['Rule by Advisers', { pp: -0.05 }], ['Garrison State', { mil_out: 0.08, build: 0.05, legit: -5 }], ['The Army\'s Colony', { mil_out: 0.15, build: 0.1, legit: -12, stab: -5 }]]];
BOP.MAN[3].forEach((b, i) => SPIRITS[`bop_MAN_${i}`] = [`${BOP.MAN[0]}: ${b[0]}`, `The balance between the ${BOP.MAN[1]} and the ${BOP.MAN[2]}.`, b[1]]);
{ const _ba = bopApply; bopApply = function (c) { if (c.bop === undefined && c.tag.slice(0, 3) === 'MAN') c.bop = 45; return _ba(c); }; }

// leave every war against `tag` with a truce (a separate peace)
function separatePeace(c, tag) {
  for (const w of G.wars.slice()) { const ca = w.att.includes(c.tag), cd = w.def.includes(c.tag), ta = w.att.includes(tag), td = w.def.includes(tag); if (!((ca && td) || (cd && ta))) continue;
    const mine = ca ? w.att : w.def, theirs = ca ? w.def : w.att; if (mine[0] === c.tag && theirs[0] === tag) { whitePeace(w); continue; }
    if (mine[0] === c.tag) { if (theirs.length === 1) { whitePeace(w); continue; } w[ca ? 'def' : 'att'] = theirs.filter(t => t !== tag); } else w[ca ? 'att' : 'def'] = mine.filter(t => t !== c.tag); }
  c.capitulated = false; G._wc = null; addPact('truce', c.tag, tag, 720); restoreControl(); for (const w of G.wars.slice()) checkWarEnd(w);
}
function sideWith(c, tag) { if (!ok(tag)) return; for (const w of G.wars) { const a = w.att.includes(tag), d = w.def.includes(tag); if (!a && !d) continue; if (w.att.includes(c.tag) || w.def.includes(c.tag)) continue; if ((a ? w.def : w.att).some(t => friendly(c.tag, t))) continue; joinWar(w, c.tag, a ? 'att' : 'def'); } }
function goFree(c, warm) { if (!c.overlord) { c.pp += 40; return; } const o = c.overlord; c.overlord = null; c.autonomy = 100; addRel(c.tag, o, warm || 0); for (const w of G.wars) { if (w.att[0] !== c.tag && w.def[0] !== c.tag) { w.att = w.att.filter(t => t !== c.tag); w.def = w.def.filter(t => t !== c.tag); } } G._wc = null; c.capitulated = false; restoreControl(); logMsg(`${c.name} throws off the tutelage of ${cname(o)}.`, 'world'); UIH.mapDirty(); }

// extra effect commands: each returns [function, tooltip]
const pl = l => csv(l).map(n => PNAME[n]).filter(i => i !== undefined);
const XTOK = {
  bop: v => [c => bopShift(c, +v), `Balance of power shifts ${Math.abs(+v)} towards the ${+v < 0 ? 'left' : 'right'} side`],
  auto: v => [c => { if (c.overlord) c.autonomy = clamp(autonomyOf(c) + +v, 0, 100); else c.pp += 15; }, `Our autonomy ${+v > 0 ? '+' : ''}${v}`],
  sub: v => { const [t, n] = v.split(' '); return [c => { if (ok(t) && C(t).overlord === c.tag) C(t).autonomy = clamp(autonomyOf(C(t)) + +n, 0, 100); }, `${COUNTRY_DEF[t].n}: autonomy ${+n > 0 ? '+' : ''}${n}`]; },
  demand: v => { const i = v.indexOf(' '), t = v.slice(0, i), rest = v.slice(i + 1).trim(), type = rest.split(' ')[0], provs = type === 'take' ? csv(rest.slice(5)) : []; return [softPlay(t, type, provs, { days: 20 }), `Demand that ${COUNTRY_DEF[t].n} ${type === 'take' ? 'cede ' + provs.join(', ') : type === 'puppet' ? 'become our subject' : 'be annexed'}`]; },
  leader: v => { const [n, p] = v.split('/'); return [setLeader(n.trim(), p && p.trim()), `${n.trim()} takes power`]; },
  collab: v => { const [t, n, iso] = v.split('/').map(s => s.trim()); return [c => createCollab(c, t, n || undefined, iso ? [iso] : undefined), `Land we occupy from ${COUNTRY_DEF[t].n} becomes a collaboration government`]; },
  calm: () => FNS.calmUnrest,
  stir: v => [c => stirUnrest(p => p.owner === c.tag || p.cores.includes(c.tag), +v), `Unrest +${v} in every enemy-occupied province that is ours by right`],
  clash: v => [c => startClash(c.tag, v.trim(), true), `A border conflict with ${COUNTRY_DEF[v.trim()].n}, short of war`],
  free: v => [c => goFree(c, +v || 0), 'We become fully independent'],
  rename: v => { const [n, a] = v.split('/').map(s => s.trim()); return [c => { c.name = n; if (a) c.adj = a; UIH.mapDirty(); }, `We are henceforth known as ${n}`]; },
  capital: v => [c => { const p = PN(v.trim()); if (p.owner === c.tag) { c.capital = p.id; p.vp = Math.max(p.vp, 20); } }, `The capital moves to ${v.trim()}`],
  dep: v => { const m = v.trim().match(/^(.*) (\w+) (\d+)$/); return [addRes(m[1], m[2], +m[3]), `New ${GOODS[m[2]] ? GOODS[m[2]].name || m[2] : m[2]} deposits at ${m[1]}`]; },
  embargo: v => [c => setEmbargo(c, v.trim(), true), `We embargo ${COUNTRY_DEF[v.trim()].n}`],
  absorb: v => [c => csv(v).forEach(t => { if (ok(t) && C(t).ai && C(t).overlord === c.tag) annex(c.tag, t, true); }), `Our subjects among ${csv(v).map(t => COUNTRY_DEF[t].n).join(', ')} are integrated`],
  invite: v => [c => { if (!factionOf(c.tag)) return; inviteAll(c, csv(v), () => true); }, `Invite ${csv(v).map(t => COUNTRY_DEF[t].n).join(', ')} into our faction`],
  mkfaction: v => [c => { if (!factionOf(c.tag) && !c.overlord) createFaction(c.tag, v.trim()); }, `Found the ${v.trim()} if we belong to no faction`],
  axp: v => [c => { c.axp = (c.axp || 0) + +v; }, `Army experience +${v}`],
  sepeace: v => [c => csv(v).forEach(t => { if (ok(t) && atWar(c.tag, t) && C(t).ai) separatePeace(c, t); }), `A separate peace with ${csv(v).map(t => COUNTRY_DEF[t].n).join(', ')} (if they are not player-led)`],
  sidewith: v => [c => sideWith(c, v.trim()), `We join the wars of ${COUNTRY_DEF[v.trim()].n}`],
  jointo: v => [c => joinTo(c, v.trim()), `Join the faction of ${COUNTRY_DEF[v.trim()].n}, or ally with it`],
  xp: () => FNS.xpAll,
  airm: v => [c => { c.airMission = v.trim(); airApply(c); }, `Air force mission: ${v.trim()}`],
  vp: v => { const m = v.trim().match(/^(.*) (\d+)$/); return [() => { PN(m[1]).vp += +m[2]; }, `${m[1]} gains ${m[2]} victory points`]; },
  popgrow: v => [c => provsOf(c.tag).forEach(p => { p.pop *= 1 + +v / 100; }), `Population +${v}%`],
  warlord: () => FNS.bribeWarlord
};
{ const _fx = fx; fx = function (str, desc) {
  const keep = [], mine = []; for (let t of (str || '').split(';')) { t = t.trim(); if (!t) continue; const i = t.indexOf(' '), k = i < 0 ? t : t.slice(0, i); if (XTOK[k]) mine.push(XTOK[k](i < 0 ? '' : t.slice(i + 1))); else keep.push(t); }
  const e = _fx(keep.join('; '), desc); if (!mine.length) return e; const old = e.fn; e.fn = c => { if (old) old(c); for (const m of mine) m[0](c); }; e.tip = [e.tip].concat(mine.map(m => m[1])).filter(Boolean).join('<br>'); return e; }; }
// extra requirements
{ const _pr = parseReq; parseReq = function (str) {
  const mine = [], rest = []; for (const tok of str.split('&').map(s => s.trim()).filter(Boolean)) { const i = tok.indexOf(' '), k = i < 0 ? tok : tok.slice(0, i), v = i < 0 ? '' : tok.slice(i + 1).trim();
    if (k === 'hold') { const l = csv(v); mine.push([c => l.every(n => PN(n).ctrl === c.tag), 'We control ' + l.join(', ')]); }
    else if (k === 'subject') mine.push([c => !!c.overlord, 'We are a subject']);
    else if (k === 'year') mine.push([() => year() >= +v, 'Year ' + v + ' or later']);
    else if (k === 'bopl') mine.push([c => (c.bop || 0) <= -+v, `Balance of power at least ${v} to the left`]);
    else if (k === 'bopr') mine.push([c => (c.bop || 0) >= +v, `Balance of power at least ${v} to the right`]);
    else if (k === 'notwar') mine.push([c => !ok(v) || !atWar(c.tag, v), `Not at war with ${COUNTRY_DEF[v].n}`]);
    else if (k === 'gone') mine.push([() => !ok(v) || C(v).capitulated, `${COUNTRY_DEF[v].n} is defeated or gone`]);
    else if (k === 'lord') mine.push([c => c.overlord === v, `Subject of ${COUNTRY_DEF[v].n}`]);
    else if (k === 'ideo') mine.push([c => c.ideology === v, `Our government is ${IDEO[v][0].toLowerCase()}`]);
    else if (k === 'stab') mine.push([c => c.stab >= +v, `Stability ${v}% or more`]);
    else if (k === 'divs') mine.push([c => (c._ndiv || sum(armiesOf(c.tag), a => a.divs.length)) >= +v, `${v} divisions or more`]);
    else if (k === 'warwith') mine.push([() => { const [a, b] = csv(v); return ok(a) && ok(b) && atWar(a, b); }, `${csv(v).map(t => COUNTRY_DEF[t].n).join(' and ')} are at war`]);
    else rest.push(tok); }
  const all = (rest.length ? [_pr(rest.join(' & '))] : []).concat(mine); return all.reduce((a, b) => both(a, b)); }; }

// Auto-layout builder. Lines: "# Section", "## lane break", or "id | Name | prereqs | effects | description | options".
function autoTree(prefix, text) {
  const items = [], byId = {}; let sec = null, lane = 0, secNo = -1;
  for (const raw of text.trim().split('\n')) { const line = raw.trim(); if (!line) continue;
    if (line.startsWith('##')) { lane++; continue; } if (line.startsWith('#')) { sec = line.slice(1).trim(); secNo++; lane++; continue; }
    const f = line.split('|').map(s => s.trim()), n = f.length; if (n < 6) throw new Error('Bad focus line: ' + line);
    const it = { id: f[0], name: f[1], pre: f.slice(2, n - 3).join('|'), eff: f[n - 3], desc: f[n - 2], opts: f[n - 1], lane, secNo, sec }; sec = null;
    if (byId[it.id]) throw new Error('Duplicate focus ' + prefix + it.id); byId[it.id] = it; items.push(it); }
  const parents = it => it.pre ? it.pre.split(/[|,]/).map(s => s.trim()).filter(Boolean) : [];
  const depth = it => { if (it.y !== undefined) return it.y; it.y = 0; let d = 0; for (const p of parents(it)) { if (!byId[p]) throw new Error(`Focus ${prefix + it.id} refers to unknown ${p}`); d = Math.max(d, depth(byId[p]) + 1); } return it.y = d; };
  items.forEach(depth);
  let x0 = 0, lastSec = 0; const lanes = [...new Set(items.map(i => i.lane))];
  for (const L of lanes) { const li = items.filter(i => i.lane === L); if (li[0].secNo !== lastSec) { x0 += 1; lastSec = li[0].secNo; } let maxX = x0;
    const ys = [...new Set(li.map(i => i.y))].sort((a, b) => a - b);
    for (const y of ys) { const row = li.filter(i => i.y === y); row.forEach((it, k) => { const ps = parents(it).map(p => byId[p]).filter(p => p.lane === L && p.x !== undefined); it.want = ps.length ? sum(ps, p => p.x) / ps.length : x0 + k; });
      row.sort((a, b) => a.want - b.want); let last = x0 - 1; for (const it of row) { it.x = Math.max(Math.round(it.want), last + 1); last = it.x; maxX = Math.max(maxX, it.x); } }
    x0 = maxX + 2; }
  return parseTree(prefix, items.map(it => [it.id, it.name, it.x, it.y, it.pre, it.eff, it.desc, it.opts + (it.sec ? (it.opts ? '; ' : '') + 'sec ' + it.sec : '')].join('|')).join('\n'));
}

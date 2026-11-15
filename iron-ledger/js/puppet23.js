// 2.3 Puppets and partitions. The AI no longer turns every beaten nation into a puppet:
//  - At the peace, AI victors annex the borderlands they hold (more for fascist and communist powers, little for
//    democracies), take the colonies they occupy, and in historical games take what was taken in history (the Polish
//    corridor and Upper Silesia, Alsace-Lorraine, eastern Poland, Bessarabia, Dalmatia...). Only the rest becomes a
//    puppet, an occupation government, or is given back. Small remainders are annexed outright.
//  - Overlords keep working on their subjects: they absorb the districts they claim, swallow tiny puppets, and
//    democracies let loyal dominions go.
//  - The player can annex border districts from a subject.
'use strict';
// how much of a beaten nation (by victory points) an AI victor annexes beyond its claims
function aiAppetite(T, L, w) { let a = { fas: 0.42, com: 0.38, aut: 0.22, dem: 0.05 }[T.ideology]; if (a === undefined) a = 0.2; if (w.att[0] === T.tag) a += 0.08; if (C(L).major) a *= 0.6; if ((T.infamy || 0) > 60) a *= 0.7; return clamp(a, 0, 0.6); }
// what was annexed in history, applied when the taker holds the land at the peace
const HIST_ANNEX = {
  GER: { POL: ['Danzig', 'Bydgoszcz', 'Toruń', 'Poznań', 'Gniezno', 'Kalisz', 'Łódź', 'Katowice', 'Płock', 'Częstochowa'], FRA: ['Metz', 'Strasbourg', 'Mulhouse'], LUX: ['Luxembourg', 'Esch'], CZE: ['Karlsbad', 'Reichenberg', 'Ostrava'], YUG: ['Ljubljana'], LIT: ['Memel'] },
  SOV: { POL: ['Wilno', 'Grodno', 'Białystok', 'Lida', 'Baranowicze', 'Pinsk', 'Brest-Litovsk', 'Równe', 'Łuck', 'Lwów', 'Tarnopol', 'Stanisławów'], FIN: ['Viipuri', 'Sortavala', 'Petsamo'], ROM: ['Chișinău', 'Bălți', 'Cetatea Albă', 'Czernowitz'], JAP: ['Toyohara'] },
  ITA: { FRA: ['Nice', 'Ajaccio'], YUG: ['Split', 'Dubrovnik', 'Cetinje'], GRE: ['Corfu', 'Ioannina'] },
  HUN: { CZE: ['Košice', 'Uzhhorod'], ROM: ['Cluj', 'Oradea'], YUG: ['Novi Sad', 'Osijek'] },
  BUL: { YUG: ['Skopje', 'Bitola'], GRE: ['Kavala', 'Alexandroupoli'], ROM: ['Dobrich'] },
  JAP: { ENG: ['Hong Kong'], CHI: [] },
  POL: { CZE: ['Ostrava'], LIT: ['Kaunas'] }
};
const regimeTagOf = (T, L) => { const r = C(T) && C(T).regimes && C(T).regimes[L]; return r && ok(r.tag) ? r.tag : null; };
// split a beaten nation among its AI conquerors
function aiPartition(w, win, lose) { const log = [];
  for (const L of lose) { const c = C(L); if (!c || !c.exists) continue;
    const all = G.P.filter(p => p.owner === L || win.some(T => regimeTagOf(T, L) === p.owner)), tot = sum(all, p => p.vp + 1) || 1;
    for (const T of win) { const K = C(T); if (!K || !K.exists || !K.ai || K.capitulated || K.overlord) continue; const reg = regimeTagOf(T, L);
      const pool = new Set(all.filter(p => (p.owner === L && p.ctrl === T) || (reg && p.owner === reg)).map(p => p.id)); if (!pool.size) continue;
      const take = new Set(), want = aiAppetite(K, L, w) * tot; let got = 0;
      const add = p => { if (take.has(p.id) || p.id === c.capital) return; take.add(p.id); got += p.vp + 1; };
      // what history took, then the colonies, then the borderlands nearest to us
      if (G.historical) for (const n of ((HIST_ANNEX[T.slice(0, 3)] || {})[L.slice(0, 3)] || [])) { const p = PN(n); if (p && pool.has(p.id)) add(p); }
      for (const id of pool) { const p = P(id); if (!p.cores.includes(L) && (!reg || !p.cores.includes(reg))) add(p); }
      const ours = q => q.owner === T || take.has(q.id), front = [...pool].filter(id => !take.has(id) && NB[id].some(e => !e.sea && ours(P(e.to))));
      while (got < want && front.length) { front.sort((a, b) => P(b).vp - P(a).vp || P(b).pop - P(a).pop); const id = front.shift(); const p = P(id); if (got + p.vp + 1 > want * 1.25 && got > 0) break; add(p);
        for (const e of NB[id]) if (!e.sea && pool.has(e.to) && !take.has(e.to) && !front.includes(e.to)) front.push(e.to); }
      if (!take.size) continue;
      for (const id of take) { const p = P(id); transferProv(p, T); if (!p.cores.includes(T) && K.ideology !== 'dem') K.infamy = (K.infamy || 0) + 0.3 + p.vp * 0.06; }
      log.push(`${K.name} annexes ${take.size} province${take.size > 1 ? 's' : ''} of ${c.name} (${[...take].slice(0, 4).map(id => P(id).name).join(', ')}${take.size > 4 ? '…' : ''})`); } }
  for (const m of log) logMsg(m + '.', 'world'); return log.length; }
// what becomes of the rest: tiny remainders are annexed, the rest follows the old rules (puppet, regime change, leniency)
function aiPeaceFate(w, L, top, frac, limited) { const T = C(top), c = C(L); if (!T || !T.ai || !c || !c.exists || w.civil) return null; const n = provsOf(L).length;
  if (limited && frac < 0.85) return 'lenient';
  if (n <= 2 && T.ideology !== 'dem') return 'annex';
  if (n <= 5 && (T.ideology === 'fas' || T.ideology === 'com') && !c.major && Math.random() < 0.6) return 'annex';
  if (T.ideology === 'dem') return c.ideology !== 'dem' ? 'regime' : 'lenient';
  if (T.ideology === 'aut' && !c.major && n <= 8) return Math.random() < 0.5 ? 'annex' : 'puppet';
  return null; }
// the AI partition runs before the peace when no player sits at the table
{ const _pe = peace; peace = function (w, winSide) { const win = w[winSide].slice(), lose = (winSide === 'att' ? w.def : w.att).slice(), pl = C(G.player);
  const conf = pl && !pl.ai && pl.exists && win.includes(pl.tag) && !w.civil;
  if (!conf && !G.confTerms && !w.civil) { try { aiPartition(w, win, lose); } catch (e) { if (typeof console !== 'undefined') console.warn('partition', e); } }
  return _pe(w, winSide); }; }
// ---------- overlords and their subjects ----------
{ const _ms = makeSubject; makeSubject = function (a, t) { const r = _ms(a, t); const c = C(t); if (c && c.overlord === a) c.subSince = G.day; return r; }; }
function aiSubjectsMonthly() { for (const O of alive()) { if (!O.ai || O.capitulated) continue;
    for (const S of alive()) { if (S.overlord !== O.tag || S.tag === G.player) continue; const ps = provsOf(S.tag), age = G.day - (S.subSince || 0), aut = autonomyOf(S), st = S.stype || '';
      // districts the overlord claims or calls its own are absorbed one by one
      if (O.ideology !== 'dem' && Math.random() < 0.06) { const p = ps.filter(q => q.id !== S.capital && (q.cores.includes(O.tag) || q.claims.includes(O.tag)) && NB[q.id].some(e => !e.sea && P(e.to).owner === O.tag))[0];
        if (p) { transferProv(p, O.tag); if (O.major) logMsg(`${O.name} annexes ${p.name} from its subject ${S.name}.`, 'info', [O.tag, S.tag]); continue; } }
      // a tiny puppet is swallowed whole
      if (ps.length <= 3 && aut < 40 && age > 730 && O.ideology !== 'dem' && !isAtWar(S.tag) && Math.random() < 0.03 && !['collab'].includes(st)) { annex(O.tag, S.tag, true); continue; }
      // democracies let a loyal dominion go
      if (O.ideology === 'dem' && aut > 85 && age > 1825 && !isAtWar(O.tag) && Math.random() < 0.02) { S.overlord = null; S.autonomy = 100; addRel(S.tag, O.tag, 30); logMsg(`${O.name} recognises the full independence of ${S.name}.`, 'world', [O.tag, S.tag]); } } } }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); aiSubjectsMonthly(); }; }
// ---------- the player: annex border districts of a subject ----------
function subBorderProvs(a, b) { return provsOf(b).filter(p => p.id !== C(b).capital && NB[p.id].some(e => !e.sea && P(e.to).owner === a)).sort((x, y) => (y.cores.includes(a) || y.claims.includes(a) ? 100 : 0) + y.vp - ((x.cores.includes(a) || x.claims.includes(a) ? 100 : 0) + x.vp)); }
DIPLO.takeLand = { name: 'Annex Border Districts', cost: 40, can: (a, b) => C(b).overlord === a && subBorderProvs(a, b).length > 0 && provsOf(b).length > 1,
  ai: () => true,
  do: (a, b) => { const S = C(b), A = C(a), l = subBorderProvs(a, b).slice(0, 2); for (const p of l) { transferProv(p, a); if (!p.cores.includes(a) && !p.claims.includes(a)) A.infamy = (A.infamy || 0) + 1 + p.vp * 0.1; }
    S.autonomy = Math.min(100, autonomyOf(S) + 15); addRel(b, a, -20); logMsg(`${A.name} annexes ${l.map(p => p.name).join(' and ')} from its subject ${S.name}.`, 'info', [a, b]); UIH.mapDirty(); },
  tip: 'Take the two districts of the subject that border us (those we claim first). Its autonomy rises by 15 and it resents us.' };

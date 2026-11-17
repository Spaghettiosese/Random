// 2.8 Siam: the bamboo that bends with the wind. A small kingdom between the British and French empires and a rising
// Japan keeps its independence by leaning towards whoever is strongest and straightening when the wind turns: the
// lean (bend, from -100 towards the Allies to +100 towards Japan), the credibility of its neutrality, the cultural
// mandates of the Leader's state (twelve of them), and the Free Thai movement that waits for the moment to rise.
'use strict';
const thOf = c => c.sm || (c.sm = { bend: 10, cred: 45, mand: 0, seri: 0 });
SPIRITS.sm_bend_jap = ['Leaning East', 'Bangkok bends towards Tokyo: Japanese goodwill and credit, British and American suspicion.', { tradecap: -0.04, stab: 1 }];
SPIRITS.sm_bend_all = ['Leaning West', 'Bangkok bends towards London and Washington: their goodwill, and Tokyo\'s displeasure.', { tradecap: 0.04, research: 0.02 }];
SPIRITS.sm_neutral = ['A Credible Neutral', 'Every power believes Siam means its neutrality, and none wants to be the one to break it.', { def: 0.05, stab: 2 }];
SPIRITS.sm_mandates = ['The Twelve Mandates', 'One name, one language, one dress, one Leader.', { ws: 3, stab: 2, research: -0.02 }];
SPIRITS.sm_seri = ['The Free Thai', 'An underground with its own wireless sets, its own airfields and the Regent at its head.', { def: 0.04 }];
function thMonthly(c) { const S = thOf(c), jap = ok('JAP'), jw = jap && isAtWar('JAP'), ger = ok('GER') && capInfo('GER').prog > 0.15, jl = jap && capInfo('JAP').prog > 0.05;
  // the wind: Japan's victories pull the bamboo east, its defeats push it back
  S.bend = clamp(S.bend + (jw && !jl ? 0.4 : 0) - (jl ? 1.2 : 0) - (ger ? 0.4 : 0) + (c.flags.th_passage ? 0.5 : 0) - (c.ideology === 'dem' ? 0.4 : 0), -100, 100);
  S.cred = clamp(S.cred + (Math.abs(S.bend) < 25 ? 0.6 : -0.4) - (isAtWar(c.tag) ? 1 : 0), 0, 100);
  if (c.flags.th_passage) S.seri = clamp(S.seri + 0.6 + (jl ? 1.2 : 0) + (c.ideology === 'dem' ? 0.5 : 0), 0, 100);
  for (const k of ['sm_bend_jap', 'sm_bend_all', 'sm_neutral', 'sm_mandates', 'sm_seri']) removeSpirit(c, k);
  if (S.bend >= 40) addSpirit(c, 'sm_bend_jap'); else if (S.bend <= -40) addSpirit(c, 'sm_bend_all'); if (S.cred >= 70 && !isAtWar(c.tag)) addSpirit(c, 'sm_neutral'); if (S.mand >= 12) addSpirit(c, 'sm_mandates'); if (S.seri >= 40) addSpirit(c, 'sm_seri');
  if (jap) { addRel('SIA', 'JAP', S.bend > 30 ? 1 : S.bend < -30 ? -1 : 0); for (const t of ['ENG', 'USA']) if (ok(t)) addRel('SIA', t, S.bend < -30 ? 1 : S.bend > 30 ? -1 : 0); } }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.exists && c.tag === 'SIA' && !c.capitulated) thMonthly(c); }; }
// whoever holds Indochina (the French State, France, or anyone else)
const indoHolder = () => { const p = PN('Luang Prabang'); return p ? p.owner : null; };
const SM_LOST = ['Luang Prabang', 'Vientiane', 'Phnom Penh'];
Object.assign(XTOK, {
  smbend: v => [c => { const S = thOf(c); S.bend = clamp(S.bend + +v, -100, 100); }, +v > 0 ? `The bamboo bends towards Japan (${v})` : `The bamboo bends towards the Allies (${-v})`],
  smcred: v => [c => { const S = thOf(c); S.cred = clamp(S.cred + +v, 0, 100); }, `Credibility of our neutrality ${+v > 0 ? '+' : ''}${v}`],
  smmand: v => [c => { const S = thOf(c); S.mand = clamp(S.mand + +v, 0, 12); }, `${v} more of the Leader's cultural mandates`],
  smseri: v => [c => { const S = thOf(c); S.seri = clamp(S.seri + +v, 0, 100); }, `The Free Thai movement ${+v > 0 ? '+' : ''}${v}`]
});
Object.assign(REQX, {
  mand: v => [c => thOf(c).mand >= +v, `At least ${v} cultural mandates`], seri: v => [c => thOf(c).seri >= +v, `The Free Thai at least ${v}`],
  cred: v => [c => thOf(c).cred >= +v, `Credibility of our neutrality at least ${v}`], bendmax: v => [c => thOf(c).bend <= +v, `The bamboo leans no further than ${v} towards Japan`]
});
Object.assign(FNS, {
  francoDemand: [c => { const t = indoHolder(); if (!t || t === c.tag || !ok(t)) return; startPlay(c.tag, t, { type: 'take', provs: ['Luang Prabang'].map(n => PNAME[n]).filter(i => i !== undefined && P(i).owner === t) }, { days: 30 }); }, 'Demand the right bank of the Mekong back from whoever governs Indochina'],
  francoThai: [c => { const t = indoHolder(); if (!t || t === c.tag || !ok(t) || atWar(c.tag, t)) return; declareWar(c.tag, t, [{ by: c.tag, vs: t, type: 'take', provs: SM_LOST.map(n => PNAME[n]).filter(i => i !== undefined && P(i).owner === t) }], 'Franco-Thai War', true); }, 'War with the French in Indochina for the lost provinces (Luang Prabang, Vientiane, Phnom Penh)'],
  tokyoConv: [c => { const t = indoHolder(); if (!t || t === c.tag) return; for (const w of G.wars.slice()) if ((w.att.includes(c.tag) && w.def.includes(t)) || (w.def.includes(c.tag) && w.att.includes(t))) { G.wars.splice(G.wars.indexOf(w), 1); G._wc = null; }
    const p = PN('Luang Prabang'); if (p && p.owner === t) { transferProv(p, c.tag); p.ctrl = c.tag; if (!p.cores.includes(c.tag)) p.cores.push(c.tag); } if (ok('JAP')) addRel(c.tag, 'JAP', 20); restoreControl(); logMsg('The Tokyo Convention: under Japanese mediation the French cede the right bank of the Mekong to Thailand.', 'world', [c.tag, t]); }, 'Japan mediates: peace with the French, and the right bank of the Mekong comes home'],
  japPassage: [c => { if (!ok('JAP')) return; addPact('access', 'JAP', c.tag); c.flags.th_passage = G.day; addRel(c.tag, 'JAP', 20); for (const t of ['ENG', 'USA']) if (ok(t)) addRel(c.tag, t, -20); logMsg('Thailand grants the Japanese army passage to Malaya and Burma.', 'world', [c.tag, 'JAP']); }, 'The Japanese army may cross Thailand; Japan respects our independence'],
  resistJapan: [c => { if (!ok('JAP')) return; if (!atWar(c.tag, 'JAP')) declareWar('JAP', c.tag, [{ by: 'JAP', vs: c.tag, type: 'puppet' }], 'Japanese Invasion of Thailand', true); if (ok('ENG') && !factionOf(c.tag)) { const f = factionOf('ENG'); if (f) joinFaction(c.tag, 'ENG'); } for (const t of ['ENG', 'USA']) if (ok(t)) addRel(c.tag, t, 30); }, 'We fight the Japanese invasion, and ask the Allies to stand with us'],
  matador: [c => { if (ok('ENG')) { addPact('access', 'ENG', c.tag); addRel(c.tag, 'ENG', 15); } if (ok('JAP')) addRel(c.tag, 'JAP', -40); }, 'British troops may enter the south first, to hold the beaches against Japan'],
  shanStates: [c => { const p = PN('Lashio'); if (p && ok('JAP') && (p.ctrl === 'JAP' || friendly('JAP', p.ctrl)) && p.owner !== c.tag) { transferProv(p, c.tag); p.ctrl = c.tag; logMsg('The Phayap Army takes over the Shan states of Kengtung and Möng Pan from the Japanese.', 'world', [c.tag]); } else claimCache(); }, 'The Shan states (Lashio) pass to us from Japan, if Japan holds them'],
  malayStates: [c => { for (const n of ['Kota Bharu', 'Penang']) { const p = PN(n); if (p && ok('JAP') && (p.ctrl === 'JAP' || friendly('JAP', p.ctrl)) && p.owner !== c.tag) { transferProv(p, c.tag); p.ctrl = c.tag; } } logMsg('Japan hands four Malay states to Thailand.', 'world', [c.tag, 'JAP']); }, 'Kelantan and Kedah (Kota Bharu, Penang) pass to us from Japan, if Japan holds them'],
  seriRise: [c => { const S = thOf(c); if (ok('JAP')) { const f = factionOf(c.tag); if (f && f.leader === 'JAP') leaveFaction(c.tag); for (const w of G.wars.slice()) if ((w.att.includes(c.tag) && w.def.some(t => ['ENG', 'USA'].includes(t))) || (w.def.includes(c.tag) && w.att.some(t => ['ENG', 'USA'].includes(t)))) { const side = w.att.includes(c.tag) ? 'att' : 'def'; w[side] = w[side].filter(t => t !== c.tag); G._wc = null; }
      G.pacts = G.pacts.filter(p => !(p.t === 'access' && ((p.a === 'JAP' && p.b === c.tag) || (p.b === 'JAP' && p.a === c.tag)))); if (!atWar(c.tag, 'JAP')) declareWar(c.tag, 'JAP', [{ by: c.tag, vs: 'JAP', type: 'take', provs: [] }], 'Free Thai Rising', true); }
    S.bend = -60; for (const t of ['ENG', 'USA']) if (ok(t)) addRel(c.tag, t, 40); logMsg('The Free Thai rise: Thailand declares its declaration of war on the Allies void, and turns on the Japanese.', 'world', [c.tag, 'JAP']); }, 'The Free Thai rise: the alliance with Japan is void, the war with the Allies ends, and Thailand fights Japan']
});

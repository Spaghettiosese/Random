// 2.7 Puppet states that appear on the map as the war redraws it. Each is carved out of land its master has conquered
// or already rules, the moment the master holds what it needs: Italian East Africa when Ethiopia falls, the Protectorate
// of Bohemia and Moravia and the Slovak State when Czechoslovakia does, Mengjiang when Japan reaches the Mongol
// marches, the State of Burma, Azad Hind, the Empire of Vietnam, the Finnish Democratic Republic, the Polish Committee
// of National Liberation, the Emirate of Cyrenaica... A player master decides when; the AI waits for history's date in
// a historical game. Each is a subject with its own status, leader, spirit and (for some) a mechanic of its own.
'use strict';
SUBJ_TYPE.colony = { name: 'Colonial Government', tribute: 0.15, levy: 0.2, cap: 45, drive: 0.7, tip: 'A colony with a government of its own under a viceroy or a governor: it raises and pays for its own troops, and pays tribute.' };
// [id/tag, name, adjective, colour, masters, the region, at least how many of it, the key provinces, date, status, autonomy, ideology ('' = the master's), leader, party, spirits, text]
const DYNP = [
  ['AOI', 'Italian East Africa', 'Italian East African', '#4f7f4f', ['ITA'], ['Addis Ababa', 'Harar', 'Gondar', 'Dessie', 'Jimma', 'Asmara', 'Keren', 'Massawa', 'Mogadishu', 'Berbera', 'Djibouti'], 6, ['Addis Ababa', 'Asmara'], [1936, 6], 'colony', 25, '', 'Rodolfo Graziani', 'Viceroyalty', ['aoi_isolated', 'aoi_patriots'],
    'Ethiopia, Eritrea and Somaliland under one Viceroy at Addis Ababa: the empire Rome waited forty years for, a thousand miles from the nearest Italian port.'],
  ['BOH', 'Protectorate of Bohemia and Moravia', 'Bohemian', '#7f6f9f', ['GER'], ['Prague', 'Pilsen', 'Brno', 'Budějovice', 'Olomouc', 'Ostrava', 'Karlsbad', 'Reichenberg'], 5, ['Prague'], [1939, 3], 'protect', 15, 'aut', 'Emil Hácha', 'National Partnership', ['boh_skoda'],
    'The Czech lands under a Reich Protector at the Hradčany: an autonomous government in name, the Škoda works in fact.'],
  ['SLK', 'Slovak Republic', 'Slovak', '#3f5f9f', ['GER', 'HUN', 'POL'], ['Bratislava', 'Banská Bystrica', 'Košice'], 2, ['Bratislava'], [1939, 3], 'protect', 45, 'fas', 'Jozef Tiso', 'Hlinka\'s Slovak People\'s Party', ['slk_clerical'],
    'A priest at the head of the first Slovak state in a thousand years, under a treaty of protection with the Reich.'],
  ['MEN', 'Mengjiang', 'Mongol', '#c8a060', ['JAP', 'MAN'], ['Kalgan', 'Hohhot', 'Datong', 'Baotou'], 3, ['Kalgan'], [1939, 9], 'puppet', 25, 'aut', 'Demchugdongrub', 'Mongolian Military Government', ['men_banners'],
    'Prince De\'s United Autonomous Government of the Mongol borderlands, with a Japanese adviser at every desk.'],
  ['BRM', 'State of Burma', 'Burmese', '#d0a040', ['JAP'], ['Rangoon', 'Mandalay', 'Moulmein', 'Myitkyina', 'Lashio', 'Akyab', 'Toungoo'], 4, ['Rangoon'], [1943, 8], 'puppet', 35, 'aut', 'Ba Maw', 'Dobama Sinyetha', ['brm_bna'],
    'Independence, of a sort, from Tokyo: Ba Maw as Adipadi, and Aung San\'s Burma National Army.'],
  ['AZH', 'Azad Hind', 'Indian', '#e08a30', ['JAP'], ['Imphal', 'Kohima', 'Chittagong', 'Dacca', 'Calcutta', 'Gauhati', 'Cuttack'], 2, [], [1943, 10], 'puppet', 40, 'aut', 'Subhas Chandra Bose', 'Indian Independence League', ['azh_ina'],
    'The Provisional Government of Free India follows the Indian National Army over the border: "Chalo Delhi!"'],
  ['VNM', 'Empire of Vietnam', 'Vietnamese', '#c84030', ['JAP'], ['Hanoi', 'Haiphong', 'Hue', 'Vinh', 'Nha Trang', 'Saigon', 'Lang Son'], 4, ['Hue'], [1945, 3], 'puppet', 35, 'aut', 'Bảo Đại', 'Imperial Government', ['vnm_famine'],
    'The Emperor in Hue proclaims Vietnam independent of France, two days after the Japanese disarmed the French.'],
  ['CAM', 'Kingdom of Kampuchea', 'Cambodian', '#5f7fc0', ['JAP', 'SIA'], ['Phnom Penh'], 1, ['Phnom Penh'], [1945, 3], 'puppet', 40, 'aut', 'Norodom Sihanouk', 'The Crown', [], 'The young King Sihanouk takes the name Kampuchea and the throne\'s independence back from France.'],
  ['LAO', 'Kingdom of Luang Prabang', 'Lao', '#4fa0a0', ['JAP', 'SIA'], ['Luang Prabang', 'Vientiane'], 1, ['Luang Prabang'], [1945, 4], 'puppet', 40, 'aut', 'Sisavang Vong', 'The Crown', [], 'King Sisavang Vong, a French loyalist, is obliged by the Japanese to declare himself free.'],
  ['FDR', 'Finnish Democratic Republic', 'Finnish', '#c0404a', ['SOV'], ['Viipuri', 'Sortavala', 'Joensuu', 'Kuopio', 'Helsinki', 'Tampere', 'Turku', 'Oulu', 'Vaasa', 'Rovaniemi', 'Petsamo'], 1, [], [1939, 12], 'puppet', 20, 'com', 'Otto Kuusinen', 'Communist Party of Finland', ['fdr_terijoki'],
    'The People\'s Government of Terijoki, proclaimed in the first village the Red Army takes, asks Moscow for help against the "White Guard" in Helsinki.'],
  ['PKN', 'Polish Committee of National Liberation', 'Polish', '#c05060', ['SOV'], ['Lublin', 'Warsaw', 'Kraków', 'Łódź', 'Radom', 'Kielce', 'Siedlce', 'Zamość', 'Rzeszów', 'Tarnów', 'Częstochowa', 'Poznań', 'Białystok', 'Łomża'], 3, ['Lublin'], [1944, 7], 'puppet', 25, 'com', 'Bolesław Bierut', 'Polish Workers\' Party', ['pkn_lublin'],
    'The Lublin Committee: a government of Poland made in Moscow, governing what the Red Army has taken.'],
  ['AZP', 'Azerbaijan People\'s Government', 'Azerbaijani', '#5fa060', ['SOV'], ['Tabriz'], 1, ['Tabriz'], [1945, 12], 'puppet', 30, 'com', 'Jafar Pishevari', 'Azerbaijan Democratic Party', [], 'In the north of Iran, behind the Red Army, a People\'s Government with its own fedayeen and Azeri schoolbooks.'],
  ['CYR', 'Emirate of Cyrenaica', 'Cyrenaican', '#6f9f6f', ['ENG', 'AST', 'RAJ', 'SAF', 'NZL', 'CAN'], ['Benghazi', 'Derna', 'Tobruk', 'Bardia', 'El Agheila', 'Kufra'], 4, ['Benghazi'], [1946, 6], 'protect', 55, 'aut', 'Idris al-Senussi', 'The Senussi Order', ['cyr_senussi'],
    'The Senussi Emir comes home from Cairo, under British protection, to the land his order fought for against Italy for thirty years.'],
  ['MNT', 'Kingdom of Montenegro', 'Montenegrin', '#7f5f3f', ['ITA'], ['Cetinje'], 1, ['Cetinje'], [1941, 7], 'protect', 25, 'aut', 'Sekula Drljević', 'Governorate', [],
    'Rome restores a kingdom no Petrović will accept; within a week the mountains are in revolt.'],
  ['HEL', 'Hellenic State', 'Greek', '#5f8fbf', ['GER', 'ITA', 'BUL'], ['Athens', 'Patras', 'Larissa', 'Ioannina', 'Corfu', 'Heraklion'], 3, ['Athens'], [1941, 4], 'collab', 20, '', 'Georgios Tsolakoglou', 'Government of Athens', ['hel_famine'],
    'The general who signed the surrender governs in Athens for three masters at once.'],
  ['SRB', 'Government of National Salvation', 'Serbian', '#8f4f4f', ['GER'], ['Belgrade', 'Niš', 'Kragujevac', 'Novi Sad'], 2, ['Belgrade'], [1941, 8], 'collab', 15, 'aut', 'Milan Nedić', 'Government of National Salvation', [],
    'A general of the old army governs rump Serbia for the German military commander, to save what can be saved.'],
  ['NDH', 'Independent State of Croatia', 'Croatian', '#7a2a2a', ['GER', 'ITA'], ['Zagreb', 'Split', 'Osijek', 'Sarajevo', 'Banja Luka', 'Mostar', 'Dubrovnik'], 4, ['Zagreb'], [1941, 4], 'protect', 35, 'fas', 'Ante Pavelić', 'Ustaše', ['ndh_terror'],
    'Proclaimed by the Ustaše in Zagreb as the German columns arrive; Italy takes the coast, and the country is at war with half its people from the first day.']
];
SPIRITS.aoi_isolated = ['Cut Off from Italy', 'With Egypt and the Sudan in British hands, nothing reaches the colony but what it makes itself.', { mil_out: -0.25, supply: -0.2 }];
SPIRITS.aoi_patriots = ['The Arbegnoch', 'The Ethiopian patriots hold the mountains and ambush every convoy.', { stab: -6 }];
SPIRITS.boh_skoda = ['The Škoda Works for the Reich', 'Pilsen and Brno turn out guns for the Wehrmacht; the Czech workers are fed better than most, and sabotage carefully.', { mil_out: 0.1, stab: -3 }];
SPIRITS.slk_clerical = ['The Clerical State', 'Catholic, authoritarian and grateful to Berlin.', { stab: 4, legit: 3 }];
SPIRITS.men_banners = ['The Mongol Banners', 'Cavalry of the old banners, and a Japanese garrison behind them.', { manpower: 0.05, stab: -2 }];
SPIRITS.brm_bna = ['The Burma National Army', 'Aung San\'s army fights for Japan, and waits for the moment to change sides.', { manpower: 0.04, legit: 3 }];
SPIRITS.azh_ina = ['The Indian National Army', 'Forty thousand prisoners of Singapore who chose to fight for Netaji.', { ws: 10, manpower: 0.05 }];
SPIRITS.vnm_famine = ['The Famine of 1945', 'Rice requisitioned for Japan and the north cut off by bombing: two million dead.', { stab: -8, output: -0.1 }];
SPIRITS.fdr_terijoki = ['The Terijoki Government', 'Recognised by one state in the world, which happens to be the one that made it.', { legit: -15 }];
SPIRITS.pkn_lublin = ['The Lublin Manifesto', 'Land to the peasants, and the NKVD to the Home Army.', { stab: -4, legit: -5 }];
SPIRITS.cyr_senussi = ['The Senussi', 'An order of Sufi brotherhoods that ran a desert state before the Italians came.', { stab: 5, legit: 5 }];
SPIRITS.hel_famine = ['The Great Famine', 'Athens starves in the winter of 1941: forty thousand dead in the city alone.', { stab: -6, output: -0.08 }];
SPIRITS.ndh_terror = ['The Ustaša Terror', 'Camps and massacres drive the Serbs of Bosnia and Croatia into the woods with the Chetniks and the Partisans.', { stab: -6, legit: -8 }];
const dynps = () => G.dynp || (G.dynp = {});
const dynThe = d => (['AOI', 'MEN', 'AZH'].includes(d[0]) ? '' : 'the ') + d[1];
const dynDef = id => DYNP.find(d => d[0] === id);
const dynFam = (d, t) => d[4].includes(t.slice(0, 3));
// the land of the region the master (or its subjects) can give to the new state
function dynLand(d, t) { return d[5].map(n => PN(n)).filter(p => p && (p.owner === t || (C(p.owner) && C(p.owner).overlord === t && C(p.owner).collabOf)) && (p.ctrl === p.owner || p.ctrl === t || (friendly(t, p.ctrl) && !atWar(t, p.ctrl)))); }
function dynCan(c, d) { if (dynps()[d[0]]) return 'Already proclaimed'; if (!dynFam(d, c.tag) || c.capitulated || c.overlord) return 'Not ours to proclaim'; if (G.C[d[0]] && G.C[d[0]].exists) return 'It exists already';
  const land = dynLand(d, c.tag); if (land.length < d[6]) return `We must hold ${d[6]} of ${d[5].join(', ')} (we hold ${land.length})`; for (const k of d[7]) { const p = PN(k); if (!p || !land.includes(p)) return `We must hold ${k}`; }
  if (d[0] === 'AOI' && ok('ETH')) return 'Ethiopia must first be conquered'; if (d[0] === 'FDR' && !(ok('FIN') && atWar(c.tag, 'FIN'))) return 'Only in a war with Finland';
  if (['VNM', 'CAM', 'LAO'].includes(d[0]) && ok('VIC') && !G.flags.indoCoup && c.tag === 'JAP' && land.some(p => p.owner === 'VIC')) return 'Indochina is still governed by the French';
  return ''; }
function dynProclaim(c, id) { const d = dynDef(id), why = dynCan(c, d); if (why) return why; const land = dynLand(d, c.tag), key = d[7].length ? PN(d[7][0]) : land.sort((a, b) => b.vp - a.vp)[0], ps = [key, ...land.filter(p => p !== key)];
  for (const p of ps) if (p.owner !== c.tag) { const o = C(p.owner); p.owner = c.tag; p.ctrl = c.tag; if (o && !provsOf(o.tag).length) eliminate(o.tag, c.tag); }
  const r = newNation(c.tag, d[0], d[1], d[2], d[3], ps, d[11] || c.ideology); freshState(r, { pp: 25, infl: 5, manpower: 10 + ps.length * 6, money: 2 * wkInc(c) }); makeSubject(c.tag, d[0]); Object.assign(r, { stype: d[9], autonomy: d[10], leader: d[12], party: d[13], stab: 50, legitC: d[9] === 'collab' ? 25 : undefined, puppetOf: c.tag, dynp: id });
  for (const s of d[14]) addSpirit(r, s); for (const a of armiesOf(d[0])) a.auto = true; dynps()[id] = { day: G.day, by: c.tag }; G._wc = null; claimCache(); UIH.mapDirty();
  logMsg(`${c.name} proclaims ${dynThe(d)}.`, 'world', [c.tag, d[0]]); if (typeof worldNews === 'function' && (c.major || c.tag === G.player)) worldNews(d[1], d[15], '🏛', [c.tag]); return ''; }
// the AI proclaims on history's date in a historical game, at once otherwise
function dynMonthly() { for (const d of DYNP) { if (dynps()[d[0]]) continue; for (const t of d[4]) { const c = C(t); if (!c || !c.exists || !c.ai || c.capitulated) continue; if (G.historical && G.day < mjDay(d[8][0], d[8][1])) continue; if (!G.historical && Math.random() > 0.35) continue; if (!dynCan(c, d)) { dynProclaim(c, d[0]); break; } } } }
function dynPuppetCheck(t) { for (const d of DYNP) { if (dynps()[d[0]] || !dynFam(d, t)) continue; const c = C(t); if (c && c.ai && !dynCan(c, d)) dynProclaim(c, d[0]); } }
// Italian East Africa: cut off when the way through Suez is closed; the Viceroy changes in 1937
function aoiMonthly() { const a = G.C.AOI; if (!a || !a.exists) return; const it = C('ITA'), sz = PN('Suez') || PN('Port Said'), cut = !it || !it.exists || !sz || atWar('ITA', sz.ctrl) || atWar('AOI', sz.ctrl);
  if (cut) addSpirit(a, 'aoi_isolated'); else removeSpirit(a, 'aoi_isolated'); if (a.leader === 'Rodolfo Graziani' && G.day >= mjDay(1937, 12)) { a.leader = 'Duke of Aosta'; a.stab = Math.min(100, a.stab + 6); logMsg('The Duke of Aosta replaces Graziani as Viceroy of Italian East Africa: an Anglophile prince who means to govern, not to hang.', 'info', ['ITA', 'AOI']); }
  if (ok('ETH') || G.res && G.res.ETH && G.res.ETH.str > 30) addSpirit(a, 'aoi_patriots'); }
{ const _dm = diplomacyMonthly; diplomacyMonthly = function () { _dm(); dynMonthly(); aoiMonthly(); }; }
// decisions for a player master: one for every puppet state, in a category of their own
for (const d of DYNP) DECISIONS['dynp_' + d[0]] = D(`Proclaim ${dynThe(d)}`, 'Puppet States', 50, d[15], { fn: c => { const r = dynProclaim(c, d[0]); if (r && c.tag === G.player) UIH.notify(r, 'bad'); }, tip: `A new ${SUBJ_TYPE[d[9]].name.toLowerCase()} under ${d[12]}, from ${d[5].slice(0, 6).join(', ')}${d[5].length > 6 ? '…' : ''}. It raises its own troops, pays tribute and joins our wars.` },
  { once: true, visible: c => dynFam(d, c.tag) && !dynps()[d[0]] && dynLand(d, c.tag).length > 0, avail: c => dynCan(c, d), ai: 0 });
// a puppet state does not take the generic road to full sovereignty while its master keeps it on a short leash
{ const _gt = genericTree; genericTree = function (c) { const t = _gt(c); const f = t.find(x => x.id === 'n_indep'); if (f) f.req = f.req ? both(f.req, [k => !k.dynp || autonomyOf(k) >= 60, 'Our masters would allow it']) : [k => !k.dynp || autonomyOf(k) >= 60, 'Our masters would allow it']; return t; }; }
// Japan's coup in Indochina opens the way to the three kingdoms
if (typeof FNS !== 'undefined') FNS.indoCoup = [c => { G.flags.indoCoup = G.day; }, 'Japan ends French rule in Indochina'];

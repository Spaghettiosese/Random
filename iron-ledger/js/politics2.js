// 2.0 Politics: named parties with leaders, leader traits, succession, boosting and banning parties, elections that
// change who governs, and coups d'état.
'use strict';
const FIRST = {
  west: ['Albert', 'Arthur', 'Charles', 'Edmund', 'Émile', 'Ernst', 'Frederick', 'Georges', 'Gustav', 'Hans', 'Henri', 'Hugh', 'Jan', 'Johann', 'Karl', 'Léon', 'Lucien', 'Otto', 'Paul', 'Pierre', 'Robert', 'Walter', 'Willem', 'Margaret', 'Clara'],
  east: ['Aleksander', 'Bogdan', 'Dimitar', 'Ferenc', 'Gheorghe', 'Ion', 'István', 'Józef', 'Konstantin', 'Ladislav', 'Mihai', 'Milan', 'Nikola', 'Pavel', 'Stanisław', 'Tadeusz', 'Václav', 'Vasily', 'Zoltán', 'Anna'],
  latin: ['Alberto', 'Carlos', 'Diego', 'Eduardo', 'Felipe', 'Francisco', 'Getúlio', 'Ignacio', 'Joaquín', 'Jorge', 'José', 'Juan', 'Luis', 'Manuel', 'Miguel', 'Pedro', 'Rafael', 'Ramón', 'Ricardo', 'Eva'],
  asia: ['Akira', 'Bao', 'Chen', 'Daisuke', 'Hideo', 'Hiroshi', 'Jun', 'Kenji', 'Kiyoshi', 'Lin', 'Ming', 'Pridi', 'Plaek', 'Sun', 'Tadashi', 'Wei', 'Yasuo', 'Zhi'],
  mid: ['Abdul', 'Ahmad', 'Ali', 'Fuad', 'Hasan', 'Hussein', 'Ibrahim', 'Ismail', 'Kemal', 'Mahmud', 'Mustafa', 'Nuri', 'Omar', 'Rashid', 'Reza', 'Said', 'Yusuf'],
  afr: ['Abebe', 'Ahmadu', 'Desta', 'Haile', 'Kwame', 'Lij', 'Makonnen', 'Nnamdi', 'Ras', 'Samuel', 'Tafari', 'Tekle', 'Yohannes']
};
const PARTY_NAMES = {
  dem: ['{N} Liberal Party', 'Social Democratic Party', 'Radical Party', 'Christian Democratic Union', 'Progressive Party', 'National Liberal Party', 'Party of Labour', 'Republican Union', 'Democratic Alliance', 'Agrarian Union'],
  fas: ['{A} National Front', 'National Legion', 'Iron Phalanx', 'Movement of National Rebirth', '{A} National Socialist Party', 'Patriotic Guard', 'Party of National Unity', 'Blue Shirt League', 'Arrow and Sword'],
  com: ['Communist Party of {N}', '{A} Workers\' Party', 'Revolutionary Socialist Party', 'Party of Labour and Peasants', 'Red Front', 'Left Socialist Union'],
  aut: ['{A} Conservative Party', 'National Union', 'Royalist League', 'Party of Order', 'Fatherland Front', 'Officers\' Association', 'Union of the Crown', 'National Concentration']
};
const LEADER_TRAITS = {
  charisma: ['Charismatic Orator', { legit: 6, ws: 3 }], tech: ['Technocrat', { output: 0.04, research: 0.03 }], hawk: ['Warhawk', { ws: 8, atk: 0.03, stab: -2 }],
  reform: ['Reformer', { pp: 0.1, rad: -0.03 }], corrupt: ['Corrupt', { tax: -0.06, pp: 0.08 }], oldguard: ['Old Guard', { stab: 6, research: -0.03 }],
  populist: ['Populist', { stab: 4, tax: -0.03, legit: 3 }], schemer: ['Schemer', { pp: 0.12, legit: -4 }], soldier: ['Former General', { org: 0.04, ws: 4 }],
  peace: ['Man of Peace', { stab: 5, ws: -6, infl: 0.15 }], banker: ['Banker', { tax: 0.06, invest: 0.15 }], zealot: ['Zealot', { ws: 6, rad: 0.04, stab: -3 }]
};
for (const k in LEADER_TRAITS) SPIRITS['ldr_' + k] = [LEADER_TRAITS[k][0], 'A trait of the head of government.', LEADER_TRAITS[k][1]];
const IDEO_TRAIT = { dem: ['reform', 'tech', 'banker', 'peace', 'charisma', 'populist', 'corrupt'], fas: ['hawk', 'charisma', 'zealot', 'schemer', 'soldier', 'populist'], com: ['zealot', 'tech', 'schemer', 'hawk', 'reform'], aut: ['oldguard', 'soldier', 'banker', 'schemer', 'corrupt', 'hawk'] };
// names by culture, so a Dubliner is not called Gustav
const CULT = {
  ger: [['Hans', 'Karl', 'Friedrich', 'Wilhelm', 'Otto', 'Heinrich', 'Ernst', 'Walter', 'Ludwig', 'Hermann', 'Kurt', 'Gustav', 'Franz', 'Josef', 'Rudolf'], ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Wagner', 'Becker', 'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Brandt', 'Lange', 'Huber', 'Gruber', 'Bauer']],
  fra: [['Jean', 'Pierre', 'Louis', 'Henri', 'Paul', 'André', 'Georges', 'Marcel', 'Léon', 'Édouard', 'Lucien', 'Maurice', 'Camille'], ['Martin', 'Bernard', 'Dubois', 'Durand', 'Lefèvre', 'Moreau', 'Laurent', 'Girard', 'Fournier', 'Mercier', 'Blanc', 'Rousseau', 'Vincent', 'Janssens', 'Peeters']],
  eng: [['John', 'William', 'Arthur', 'George', 'Thomas', 'Henry', 'Edward', 'Frederick', 'Harold', 'Robert', 'James', 'Margaret', 'Ellen'], ['Smith', 'Jones', 'Taylor', 'Brown', 'Wilson', 'Evans', 'Hughes', 'Walker', 'Wright', 'Thompson', 'Hall', 'Green', 'Baldwin', 'Morrison', 'Fraser']],
  iri: [['Seán', 'Patrick', 'Michael', 'Liam', 'Eoin', 'Thomas', 'Kevin', 'Richard', 'Máire'], ['Murphy', 'Kelly', "O'Brien", 'Ryan', 'Walsh', "O'Sullivan", 'Byrne', 'Lynch', 'MacEntee', 'Costello', 'Mulcahy']],
  ita: [['Giuseppe', 'Giovanni', 'Antonio', 'Mario', 'Luigi', 'Carlo', 'Francesco', 'Vittorio', 'Alessandro', 'Dino', 'Italo', 'Achille'], ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Conti', 'De Luca']],
  ibe: [['José', 'Manuel', 'Francisco', 'Antonio', 'Juan', 'Luis', 'Carlos', 'Miguel', 'Rafael', 'Jorge', 'Alfonso', 'Getúlio', 'Ramón'], ['García', 'Fernández', 'González', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Silva', 'Santos', 'Costa', 'Ferreira', 'Herrera', 'Vargas']],
  nor: [['Lars', 'Erik', 'Olaf', 'Nils', 'Per', 'Johan', 'Karl', 'Gustaf', 'Hjalmar', 'Väinö', 'Pieter', 'Hendrik', 'Willem'], ['Hansen', 'Johansson', 'Nielsen', 'Larsen', 'Andersson', 'Lindqvist', 'Berg', 'Virtanen', 'Korhonen', 'de Vries', 'Jansen', 'Bakker', 'Visser']],
  slv: [['Józef', 'Jan', 'Václav', 'Milan', 'Petar', 'Stjepan', 'Dimitar', 'Aleksandr', 'Ivan', 'Nikolai', 'Vladimir', 'Mykola', 'Antanas', 'Kārlis', 'Konstantin'], ['Nowak', 'Kowalski', 'Novák', 'Horák', 'Petrović', 'Jovanović', 'Horvat', 'Ivanov', 'Popov', 'Petrov', 'Smirnov', 'Kuznetsov', 'Kazlauskas', 'Ozols', 'Tamm']],
  rom: [['Ion', 'Gheorghe', 'Constantin', 'Nicolae', 'Iuliu', 'Octavian', 'Armand', 'Corneliu', 'Alexandru', 'Mihail'], ['Popescu', 'Ionescu', 'Dumitrescu', 'Stan', 'Constantinescu', 'Brătianu', 'Maniu', 'Codreanu', 'Antonescu', 'Gafencu', 'Mironescu']],
  hun: [['István', 'László', 'Ferenc', 'Gyula', 'Miklós', 'Ion', 'Gheorghe', 'Constantin', 'Nicolae', 'Iuliu'], ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Popescu', 'Ionescu', 'Dumitrescu', 'Stan', 'Constantinescu']],
  grk: [['Georgios', 'Ioannis', 'Konstantinos', 'Dimitrios', 'Nikolaos', 'Ahmet', 'Mehmet', 'Mustafa', 'İsmet', 'Celal', 'Ali'], ['Papadopoulos', 'Pappas', 'Vlachos', 'Angelopoulos', 'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Aydın', 'Hoxha', 'Kola']],
  ara: [['Muhammad', 'Ahmad', 'Ali', 'Hasan', 'Husayn', 'Abdullah', 'Faisal', 'Nuri', 'Rashid', 'Mahmud', 'Reza', 'Hashem', 'Mohammad'], ['al-Said', 'al-Gaylani', 'Pasha', 'al-Hashimi', 'Mahir', 'Sidqi', 'Foroughi', 'Mansur', 'Daoud', 'Zahir', 'Khan']],
  chi: [['Wei', 'Jian', 'Zhi', 'Guo', 'Ming', 'Xiao', 'De', 'Zong', 'Hong', 'Bai', 'Jing', 'Fu'], ['Li', 'Wang', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou', 'Xu', 'Sun', 'Ma', 'Song', 'Feng']],
  jap: [['Hiroshi', 'Takeshi', 'Kenji', 'Shigeru', 'Ichiro', 'Kiichi', 'Fumimaro', 'Koki', 'Yonai', 'Tetsuzan', 'Kantaro', 'Mitsumasa'], ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Hayashi', 'Inoue']],
  sea: [['Manuel', 'Sergio', 'José', 'Pridi', 'Plaek', 'Phraya', 'Thawan', 'Elpidio', 'Claro', 'Quintín'], ['Quezon', 'Osmeña', 'Roxas', 'Laurel', 'Recto', 'Phanomyong', 'Phibunsongkhram', 'Thamrong', 'Aphaiwong', 'Pramoj']],
  tib: [['Tenzin', 'Thubten', 'Lobsang', 'Sonam', 'Choibalsan', 'Damdin', 'Bat', 'Dorj', 'Genden'], ['Gyatso', 'Rinpoche', 'Tsarong', 'Lhalu', 'Shakabpa', 'Khorloogiin', 'Ochir', 'Batbayar', 'Tserendorj']],
  ind: [['Jawaharlal', 'Vallabhbhai', 'Subhas', 'Rajendra', 'Muhammad', 'Abul', 'Chakravarti', 'Sardar', 'Maulana', 'Bhimrao'], ['Nehru', 'Patel', 'Bose', 'Prasad', 'Jinnah', 'Azad', 'Rajagopalachari', 'Singh', 'Ambedkar', 'Rana', 'Shumsher']],
  afr: [['Haile', 'Tekle', 'Ras', 'Lij', 'Makonnen', 'Edwin', 'Charles', 'Samuel', 'Jan', 'Barry'], ['Selassie', 'Hawariat', 'Desta', 'Wolde', 'Barclay', 'King', 'Tubman', 'Smuts', 'Hertzog', 'Malan']]
};
const CULT_OF = { GER: 'ger', AUT: 'ger', SWI: 'ger', LUX: 'fra', FRA: 'fra', BEL: 'fra', ENG: 'eng', USA: 'eng', CAN: 'eng', AST: 'eng', NZL: 'eng', IRE: 'iri', ITA: 'ita', SPA: 'ibe', POR: 'ibe', HOL: 'nor', DEN: 'nor', NOR: 'nor', SWE: 'nor', FIN: 'nor', POL: 'slv', CZE: 'slv', YUG: 'slv', BUL: 'slv', SOV: 'slv', EST: 'slv', LAT: 'slv', LIT: 'slv', HUN: 'hun', ROM: 'rom', GRE: 'grk', TUR: 'grk', ALB: 'grk', PER: 'ara', IRQ: 'ara', SAU: 'ara', YEM: 'ara', EGY: 'ara', AFG: 'ara', CHI: 'chi', GXC: 'chi', YUN: 'chi', SHX: 'chi', XSM: 'chi', SIC: 'chi', PRC: 'chi', MAN: 'chi', SIK: 'chi', JAP: 'jap', PHI: 'sea', SIA: 'sea', TIB: 'tib', MON: 'tib', NEP: 'ind', RAJ: 'ind', ETH: 'afr', LIB: 'afr', SAF: 'afr' };
const cultOf = c => CULT[CULT_OF[c.tag.slice(0, 3)]] || (c.np === 'latin' ? CULT.ibe : c.np === 'asia' ? CULT.chi : c.np === 'mid' ? CULT.ara : c.np === 'afr' ? CULT.afr : c.np === 'east' ? CULT.slv : CULT.eng);
const personName = c => { const k = cultOf(c), taken = new Set((c.parties || []).map(p => p.leader).concat([c.leader])); let n = ''; for (let i = 0; i < 10; i++) { n = `${pick(k[0])} ${pick(k[1])}`; if (!taken.has(n)) break; } return n; };
function partyName(c, ideo, used) { for (let i = 0; i < 12; i++) { const n = pick(PARTY_NAMES[ideo]).replace('{N}', c.name).replace('{A}', c.adj); if (!used.has(n)) { used.add(n); return n; } } return `${c.adj} ${IDEO[ideo][0]} Party`; }
function makeParties(c) {
  const used = new Set(), list = []; let id = 0;
  for (const i of ['dem', 'fas', 'com', 'aut']) { const n = i === 'dem' ? 2 : 1; for (let k = 0; k < n; k++) { const gov = i === c.ideology && k === 0;
      list.push({ id: id++, ideo: i, name: gov && c.party ? c.party : partyName(c, i, used), leader: gov && c.leader && !/(Government|Cabinet|Council)$/.test(c.leader) ? c.leader : (c.parties = list, personName(c)), w: k === 0 ? 1 : 0.6, trait: pick(IDEO_TRAIT[i]), banned: false }); } }
  return list;
}
const partiesOf = c => c.parties || (c.parties = makeParties(c));
const rulingParty = c => partiesOf(c).find(p => p.name === c.party) || partiesOf(c).find(p => p.ideo === c.ideology);
const partyPop = (c, p) => { const same = partiesOf(c).filter(x => x.ideo === p.ideo && !x.banned), tw = sum(same, x => x.w) || 1; return p.banned ? 0 : c.sup[p.ideo] * p.w / tw; };
function setLeaderTrait(c, t) { for (const k in LEADER_TRAITS) removeSpirit(c, 'ldr_' + k); if (t) addSpirit(c, 'ldr_' + t); c.ltrait = t; }
function takeOffice(c, p, how) { const was = c.leader; c.party = p.name; c.leader = p.leader; c.inOffice = G.day; c.lage = c.lage && was === c.leader ? c.lage : rint(45, 68); setLeaderTrait(c, p.trait); if (how) logMsg(`${c.name}: ${c.leader} (${p.name}) ${how}.`, c.major ? 'world' : 'info', [c.tag]); }
// setIdeology hands power to the strongest party of the new ideology, with its own leader
{ const _si = setIdeology; setIdeology = function (c, ideo, quiet) { const had = c.ideology; _si(c, ideo, quiet); if (had === ideo || !c.parties) return; const ps = partiesOf(c).filter(p => p.ideo === ideo).sort((a, b) => b.w - a.w), alt = (ALT_LEADERS[c.tag.slice(0, 3)] || {})[ideo];
  const p = ps[0]; if (!p) return; if (alt) { p.leader = alt[0]; p.name = alt[1]; } p.banned = false; takeOffice(c, p); }; }
// elections now return a party, not only an ideology
{ const _el = election; election = function (c) { const id0 = c.ideology, p0 = rulingParty(c); _el(c); if (c.ideology !== id0) return; const ps = partiesOf(c).filter(p => p.ideo === c.ideology && !p.banned); if (ps.length < 2) return;
  const score = p => p.w * rnd(0.7, 1.3) * (p === p0 ? (G.day - (c.inOffice || 0) > 365 * 8 ? 0.7 : 1.05) : 1); const win = ps.sort((a, b) => score(b) - score(a))[0];
  if (win !== p0) { takeOffice(c, win, 'wins the election and forms a government'); win.w += 0.2; if (p0) p0.w = Math.max(0.3, p0.w - 0.15); } }; }
// monthly: party weights drift, leaders age and die, new leaders replace old in opposition, coups are plotted
function coupRisk(c) { if (c.capitulated || !G.P[c.capital] || P(c.capital).ctrl !== c.tag) return 0; const army = c.ig.army;
  const plot = Math.max(0, -army.appr) * 0.7 + Math.max(0, 45 - c.stab) * 0.45 + c.rad * 25 + Math.max(0, 40 - c.legit) * 0.3 + (c.warExh > 50 ? (c.warExh - 50) * 0.3 : 0);
  const gov = { dem: c.legit > 60 ? 0.15 : 0.45, aut: 1, fas: 0.55, com: 0.45 }[c.ideology] || 1, guard = (c.laws.security === 'secret_police' ? 0.5 : c.laws.security === 'guard' ? 0.8 : 1) * (c.coupGuard > G.day ? 0.3 : 1);
  return clamp(plot * ((army.share || 10) / 12) * gov * guard, 0, 60); }
function stageCoup(c, by, foreign) {
  const ideo = by || (c.ig.army.appr < -5 ? (c.sup.fas > c.sup.aut ? 'fas' : 'aut') : c.sup.com > 20 ? 'com' : 'aut'); if (ideo === c.ideology && !foreign) return;
  const odds = clamp(0.35 + coupRisk(c) / 120 + (foreign ? 0.1 : 0) - (c.laws.security === 'secret_police' ? 0.2 : 0), 0.08, 0.85), won = Math.random() < odds, pl = c.tag === G.player && !c.ai;
  if (won) { const old = c.leader; if (ideo === c.ideology) { const p = partiesOf(c).filter(x => x.ideo === ideo && x !== rulingParty(c))[0] || rulingParty(c); p.leader = personName(c); takeOffice(c, p); } else setIdeology(c, ideo);
    c.stab = Math.max(0, c.stab - 15); c.legit = Math.max(0, c.legit - 15); armyMood(c, 8); logMsg(`Coup d'état in ${c.name}! ${old} is overthrown; ${c.leader} takes power.`, 'world', [c.tag]);
    if (pl) UIH.popup({ modal: true, title: 'Coup d\'état', icon: '🪖', desc: `Before dawn, troops occupied the ministries and the radio station. ${old} has been arrested. <b>${c.leader}</b> now governs ${c.name} with a ${IDEO[c.ideology][0].toLowerCase()} government.<br><br>You continue as the new regime.`, options: [{ name: 'Long live the new order.' }] });
    if (c.sup[IDEO_INV[ideo] || 'dem'] > 38 && Math.random() < 0.4) startCivilWar(c.tag, c.sup.dem > c.sup.com ? 'dem' : 'com', 0.35, `${c.adj} Loyalists`); }
  else { c.stab = Math.max(0, c.stab - 5); c.legit = Math.min(100, c.legit + 6); armyMood(c, -6); c.coupGuard = G.day + 365; logMsg(`A coup attempt in ${c.name} fails. The plotters are shot.`, 'world', [c.tag]);
    if (pl) UIH.notify('A coup attempt has failed. The plotters have been arrested and shot; the army is purged.', 'good'); if (Math.random() < 0.3 && c.sup[ideo] > 30) startCivilWar(c.tag, ideo, 0.3, `${c.adj} Junta`); }
}
const armyMood = (c, v) => { c.ig.army.mods.push({ v, until: G.day + 540 }); c.ig.army.appr += v; };
const IDEO_INV = { fas: 'com', com: 'fas', aut: 'dem', dem: 'aut' };
function politics2Monthly(c) {
  const ps = partiesOf(c); for (const p of ps) { if (p.banned) continue; p.w = clamp(p.w + rnd(-0.04, 0.04), 0.2, 2); }
  if (c.ltrait === undefined) { const r = rulingParty(c); if (r) { c.inOffice = 0; c.lage = rint(45, 68); setLeaderTrait(c, r.trait); } }
  if (dateObj(G.day).getUTCMonth() === 0) { c.lage = (c.lage || 55) + 1; for (const p of ps) if (p !== rulingParty(c) && Math.random() < 0.12) { p.leader = personName(c); p.trait = pick(IDEO_TRAIT[p.ideo]); } }
  if ((c.lage || 55) > 64 && Math.random() < ((c.lage - 63) * 0.0005)) { const r = rulingParty(c), old = c.leader; if (r && !ALT_LEADERS_FIXED(c, old)) { r.leader = personName(c); r.trait = pick(IDEO_TRAIT[r.ideo]); c.lage = rint(48, 66); takeOffice(c, r, `succeeds the late ${old}`); } }
  for (const p of ps) if (p.banned && c.sup[p.ideo] > 25 && Math.random() < 0.05) { c.rad = Math.min(1, c.rad + 0.03); c.stab = Math.max(0, c.stab - 2); }
  const risk = coupRisk(c); c.coupRisk = risk; if (risk > 12 && Math.random() < risk / 1100 && !(G.historical && c.major && c.ai && G.day < 365 * 4)) stageCoup(c);
}
const ALT_LEADERS_FIXED = (c, name) => G.historical && c.ai && COUNTRY_DEF[c.tag] && COUNTRY_DEF[c.tag].ld === name && G.day < 365 * 9; // history's leaders live out the war // keep the historical cast for the first years
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.exists) politics2Monthly(c); }; }
// player actions
function boostParty(c, p, foreign) { const by = foreign || c; if ((foreign ? by.infl : by.pp) < 25 || p.banned) return 'Not enough ' + (foreign ? 'influence' : 'political power'); if (foreign) by.infl -= 25; else by.pp -= 25; shiftSupport(c, { [p.ideo]: foreign ? 2.5 : 3 }); p.w = Math.min(2, p.w + 0.15); if (foreign) addRel(by.tag, c.tag, -4); return ''; }
function banParty(c, p) { if (p === rulingParty(c)) return 'You cannot ban the governing party'; if (c.pp < 60) return 'Needs 60 political power'; if (c.laws.speech === 'protected' && !p.banned) return 'Free speech is protected by law. Change the speech law first.'; c.pp -= 60; p.banned = !p.banned; if (p.banned) { c.stab = Math.max(0, c.stab - 3); shiftSupport(c, { [c.ideology]: c.sup[p.ideo] * 0.3 }); } return ''; }
function counterCoup(c, how) { if (how === 'purge') { if (c.pp < 50) return 'Needs 50 political power'; c.pp -= 50; armyMood(c, -8); c.coupGuard = G.day + 240; addSpirit(c, 'officer_purge', 365); }
  else if (how === 'pay') { const cost = Math.round(Math.max(500, (c.budget.income || 0) * 1.5)); if (c.money < cost) return 'The treasury cannot afford it'; c.money -= cost; armyMood(c, 10); }
  else if (how === 'martial') { if (c.pp < 40) return 'Needs 40 political power'; c.pp -= 40; addSpirit(c, 'martial_law', 180); c.coupGuard = G.day + 180; } return ''; }

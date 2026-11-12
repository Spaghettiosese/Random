/* HEARTLINE: HOME (DLC) — system glue and the shared spine.
   Nine parts, about twelve years: The Ring, The Wedding, Two Keys, News, Small Hours, Sparks, School Days,
   Ten Years, Home. The partner is the ending you carried over (G.flags.route); a Squad ending can turn into a
   late romance in Part One or stay a found family that adopts. Per-partner scenes live in dlc_routes.js and are
   reached with ['callf', 'dlc_<scene>_', 'route']. '@p' in a script means the partner.
   Family stats (G.fam): home (household harmony) and the child's brave / kind / curious. */
(() => {
  const H = 'hikari', R = 'rei', M = 'mira', K = 'kaede', SO = 'sora', TE = 'tetsu', A = 'aya', B = 'bit', RI = 'rin', KY = 'kyouya', SH = 'shiori', NA = 'natsuki', SA = 'saeki';
  const KD = 'kid', K2 = 'kid2', P = '@p', OB = 'oba', FU = 'fujita', DA = 'daichi';
  const PARTNERS = [H, R, M, SO, K];
  const WHO = Game.WHO;
  Object.assign(WHO, {
    kid: { n: '{kid}', c: '#ffc48a', p: 1180, dyn: 1 }, kid2: { n: '{kid2}', c: '#9fe0ff', p: 1320, dyn: 1 },
    oba: { n: 'Mr. Oba', c: '#c8b090', p: 190 }, ren: { n: 'Ren', c: '#8fb0d0', p: 270 }, fujita: { n: 'Ms. Fujita', c: '#a0d8b0', p: 640 },
    daichi: { n: 'Daichi', c: '#ff9a5a', p: 240 }, mei: { n: 'Mei', c: '#7fd0ff', p: 820 }, cadet: { n: 'Cadet Team Two', c: '#ffd88a', p: 1180 }
  });
  const sq = G => G.flags.route === 'squad', ns = G => !sq(G), is = id => G => G.flags.route === id;
  const pName = G => sq(G) ? 'the squad' : WHO[G.flags.route].n;
  const girl = (G, k = 'kid') => G.flags[k + 'g'] !== 'boy';
  const MOM = { hikari: 'Mama', rei: 'Mom', mira: 'Mama', sora: 'Mom', kaede: 'Ma', squad: 'Aunt Hikari' };

  // ---------- tokens ----------
  const TOK = {
    kid: G => G.flags.kid || 'the baby', kid2: G => G.flags.kid2 || 'the baby',
    kidS: G => girl(G) ? 'she' : 'he', KidS: G => girl(G) ? 'She' : 'He', kidO: G => girl(G) ? 'her' : 'him', kidP: G => girl(G) ? 'her' : 'his', KidP: G => girl(G) ? 'Her' : 'His',
    kidC: G => girl(G) ? 'daughter' : 'son', kidK: G => girl(G) ? 'girl' : 'boy',
    kid2S: G => girl(G, 'kid2') ? 'she' : 'he', kid2O: G => girl(G, 'kid2') ? 'her' : 'him', kid2C: G => girl(G, 'kid2') ? 'daughter' : 'son', Kid2S: G => girl(G, 'kid2') ? 'She' : 'He', kidSib: G => girl(G) ? 'sister' : 'brother', kid2K: G => girl(G, 'kid2') ? 'sister' : 'brother',
    p: pName, mom: G => MOM[G.flags.route] || 'Mom',
    bestA: G => WHO[G.flags.best_a] ? WHO[G.flags.best_a].n : 'Tetsu', bestB: G => WHO[G.flags.best_b] ? WHO[G.flags.best_b].n : 'Rin',
    best: G => WHO[G.flags.best] ? WHO[G.flags.best].n : 'Tetsu'
  };
  STORY.token = (G, k) => { const f = TOK[k]; return f && G && G.flags && G.flags.dlc ? f(G) : null; };
  const NAMES = {
    hikari: { girl: ['Natsumi', 'Raika', 'Hinata'], boy: ['Raiden', 'Natsuo', 'Kaito'] }, rei: { girl: ['Shizuku', 'Yoru', 'Ame'], boy: ['Shion', 'Kurou', 'Ren'] },
    mira: { girl: ['Iyo', 'Hana', 'Emi'], boy: ['Yuu', 'Kei', 'Asahi'] }, sora: { girl: ['Kanade', 'Uta', 'Hoshi'], boy: ['Kanata', 'Ritsu', 'Sei'] },
    kaede: { girl: ['Ayumi', 'Nagi', 'Momiji'], boy: ['Ayumu', 'Shun', 'Nagi'] }, squad: { girl: ['Mio', 'Kazuha', 'Tsubasa'], boy: ['Kazuo', 'Daichi', 'Tsubasa'] },
    two: { girl: ['Sakura', 'Rin', 'Mei'], boy: ['Tomo', 'Haru', 'Kyou'] }
  };
  STORY.kidNames = (G, key) => { const g = G.flags[key + 'g'] === 'boy' ? 'boy' : 'girl'; return (key === 'kid2' ? NAMES.two : NAMES[G.flags.route] || NAMES.squad)[g]; };
  STORY.famLabels = { home: ['🏠', 'Home', 'Household harmony'], brave: ['🦁', 'Brave', '{kid}'], kind: ['🌱', 'Kind', '{kid}'], curious: ['🔭', 'Curious', '{kid}'] };
  // the child's look for the CGs (gender, second child); remembered for the gallery
  let lastLook = '';
  window.HL_KID = () => {
    const G = Game.G;
    if (G && G.flags && G.flags.dlc) { const l = { route: G.flags.route, g: G.flags.kidg || 'girl', g2: G.flags.kid2 ? (G.flags.kid2g || 'boy') : null }, s = JSON.stringify(l); if (s !== lastLook) { lastLook = s; try { localStorage.setItem('hl_dlc_look', s); } catch (e) { } } return l; }
    try { return JSON.parse(localStorage.getItem('hl_dlc_look')) || {}; } catch (e) { return {}; }
  };
  STORY.onKid = () => { if (window.HomeArt) HomeArt.refresh(); };
  // the child walks on when they speak (not on the radio, not over a CG) and leaves with the scene
  STORY.onSay = (G, who, text, api) => {
    if (!G.flags.dlc || (who !== 'kid' && who !== 'kid2')) return;
    const radio = /^\(radio\)/.test(text || ''), cg = document.querySelector('#cg').classList.contains('on');
    const there = who === 'kid' ? (G.flags.route === 'squad' ? !!G.flags.kid : (G.dlcPart || 0) >= 6) : (G.dlcPart || 0) >= 9;
    if (radio || cg || !there) { if (G.vis.chars[who]) api.hideChar(who); return; }
    api.showChar(who, /!/.test(text) ? 'happy' : /\?$/.test(text) ? 'surprised' : 'smile', G.vis.chars[who] ? null : 'default', G.vis.chars[who] ? null : who === 'kid' ? 'rr' : 'll');
  };
  STORY.onBg = (G, api) => { if (G.flags.dlc) ['kid', 'kid2'].forEach(k => { if (G.vis.chars[k]) api.hideChar(k); }); };
  const top = G => { const t = Object.assign({ brave: 0, kind: 0, curious: 0 }, G.fam); return ['curious', 'kind', 'brave'].reduce((m, k) => t[k] > t[m] ? k : m, 'brave'); };
  STORY.dlcTop = top;
  STORY.dlcInit = (G, carry, meta) => {
    G.fam = { home: 0, brave: 0, kind: 0, curious: 0 };
    ['oba', 'ren', 'fujita', 'daichi', 'mei', 'cadet', 'natsuki', 'shiori', 'rin', 'saeki', 'aya', 'tetsu', 'kaede', 'sora', 'kyouya'].forEach(k => { if (G.known[k] === undefined) G.known[k] = 1; });
    PARTNERS.forEach(k => { if (G.known[k] === undefined) G.known[k] = 1; });
    if (!carry) {
      PARTNERS.forEach(k => { G.aff[k] = Math.max(G.aff[k], 12); }); if (G.flags.route !== 'squad') G.aff[G.flags.route] = 32;
      Object.assign(G.aff, { tetsu: 14, rin: 12, natsuki: 10, shiori: 8 });
      G.flags.good = meta.ach && meta.ach.goodend ? 1 : 0; G.flags.kyouya_free = G.flags.good; G.flags.truepath = meta.endings && meta.endings.true ? 1 : 0; G.flags.shiori_free = 1; G.flags.concert = 'A';
      G.tells = { hikari_count: 'Counts out loud when frightened.', rei_scarf: 'Touches the end of her scarf before she says something true.', rei_still: 'Goes very still when she is about to lose control.', mira_tidy: 'Tidies when she is hurting.', kaede_heel: 'Taps her heel when she wants to run.', sora_stage: 'The stage smile never reaches her eyes.', tetsu_polite: 'Gets quieter and more polite the angrier he is.', rin_hum: 'Hums the note of whoever is nearest.', shiori_cuffs: 'Adjusts her cuffs before an order she dislikes.' };
      const ng = meta.ngCarry && meta.ngCarry.heroes; Object.keys(G.heroes).forEach(k => { const h = ng && ng[k]; if (h) Object.assign(G.heroes[k], { lvl: h.lvl, xp: h.xp, sp: h.sp, st: h.st, perks: h.perks || [] }); else { G.heroes[k].lvl = 6; Object.keys(G.heroes[k].st).forEach(s => { G.heroes[k].st[s] += 2; }); } });
    }
    G.roster = ['hikari', 'rei', 'kaede', 'tetsu', 'sora', 'rin', 'natsuki', 'shiori'];
    Object.keys(G.heroes).forEach(k => { G.heroes[k].hurt = 0; G.heroes[k].fat = 0; });
    G.morale = 80; G.credits = Math.max(G.credits, 3000);
    if (window.HomeArt) HomeArt.refresh();
  };

  // ---------- endings, achievements, credits ----------
  STORY.endings = {
    dlc_hikari: 'Home: Thunder at the Dinner Table (Hikari)', dlc_rei: 'Home: A Lamp Left On (Rei)', dlc_mira: 'Home: Shared Weight (Mira)', dlc_sora: 'Home: The Off-Key Lullaby (Sora)',
    dlc_kaede: 'Home: Walking Pace (Kaede)', dlc_squad: 'Home: Nine Signatures (Squad)', dlc_full: 'Home: Full House', dlc_handler: 'Home: Second-Generation Handler'
  };
  Object.assign(STORY.ach = STORY.ach || {}, {
    dlc_ring: ['Forty-One Days', 'Ask the question (Heartline: Home)'], dlc_wed: ['I Do', 'Get married (or sign nine signatures)'], dlc_dance: ['Nobody Stepped on Anybody', 'Get an S on the first dance'],
    dlc_home: ['Two Keys', 'Survive the first year under one roof'], dlc_crib: ['Some Assembly Required', 'Build the crib without leftover screws'], dlc_baby: ['Small Hours', 'Get through the first year of nights'],
    dlc_spark: ['Spark', 'See your child\'s first Spark'], dlc_full: ['Full House', 'Raise two children'], dlc_end: ['Home', 'Finish Heartline: Home'], dlc_all: ['Every Kind of Home', 'Finish Heartline: Home with all six endings']
  });
  STORY.dlcCredits = ['#HEARTLINE: HOME', 'A Heartline Agency story', '', '#STARRING', '{name}, Handler, Spark-negative, father', '{p}', '{kid}', '', '#AND', 'Squad Zero, every one of them', 'Director Aya Takamine', 'Deputy Director Saeki', 'B.I.T.', 'Natsuki Amane, Aegis Rescue', 'Mr. Oba, who still has your apron', '', '#SPECIAL THANKS', 'The office door, which closes', 'Everyone who waited in a van', '', 'Thank you for staying.'];

  // ---------- helpers ----------
  const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
  const part = (n, name, sub) => [['hideall'], ['cgoff'], ['letterbox', 0], ['tint', null], ['fx', null], ['do', G => { G.chapT = `Home · Part ${n}: ${name}`; G.dlcPart = n; G.vis.pre = {}; G.vis.of = 'casual'; }], ['bg', 'black'], ['title', `PART ${NUM[n - 1]}${sub ? ' · ' + sub : ''}`, name], ['autosave']];
  const kcg = name => [['do', () => window.HomeArt && HomeArt.refresh()], ['cg', name]];
  // weekend picker: n rounds, each option once
  const weekend = (tag, n, acts, between) => { const out = []; for (let k = 0; k < n; k++) { if (k && between) out.push(['n', between[k - 1] || between[0]]); out.push(['choice', acts.map(a => ({ t: a.t, if: G => !G.flags[tag + a.id] && (!a.if || a.if(G)), then: [['set', tag + a.id], ...a.s] }))]); } return out; };
  STORY.dlcK = { part, kcg, weekend, sq, ns, is };
  const S = STORY.scripts;

  // ======================= START =======================
  S.dlc_start = [
    ['bg', 'black'], ['music', 'title'],
    ['if', G => G.flags.dlc_fresh, [['name']]],
    ['title', 'HEARTLINE AGENCY', 'Home'],
    ['bg', 'city_night'], ['music', 'night'], ['wear', 'casual'],
    ['call', 'dlc_recap'],
    ['if', sq, [['call', 'dlc_squad_pick']]],
    ['jump', 'dlc_p1']
  ];
  S.dlc_recap = [
    ['n', "A year. The light folded shut behind us a year ago, and the city went back to its ordinary emergencies: a cat in a drain, a bus with soft brakes, a man on a roof who only wants somebody to talk to."],
    ['if', G => G.flags.truepath, [['n', "Squad One came home with us. Daichi still asks what year it is every New Year's morning. Somebody tells him, and he says \"huh\" like it's news."]]],
    ['if', G => G.flags.good || G.flags.kyouya_free, [['n', "Kyouya Aoi runs a Friday group for Rift survivors in a community room that smells of floor polish. Afterward, ramen. Rin goes every week and eats her vegetables under protest."]],
      [['n', "Kyouya's name is still on the memorial wall. Rin goes on Fridays anyway. She brings two bowls of ramen and eats both, slowly, out loud, so he can hear."]]],
    ['if', G => G.flags.shiori_free, [['n', "Shiori Kagami runs Aegis Rescue now. Orange uniforms. She irons hers. She irons Natsuki's too, without asking, and Natsuki pretends not to notice."]]],
    ['n', "The license chips are in a glass case at the city museum. The Handler's office door at HALO closes all the way, with a click. I still notice the click."],
    ['callf', 'dlc_us_', 'route']
  ];
  // Squad ending: the person you were closest to says it first, or you choose the found family
  S.dlc_squad_pick = [
    ['do', G => { const c = PARTNERS.filter(k => G.known[k] !== undefined && G.aff[k] >= 8 && (k !== 'sora' || G.roster.includes('sora'))); G.flags.late_p = c.sort((a, b) => G.aff[b] - G.aff[a])[0] || ''; }],
    ['if', G => G.flags.late_p, [['callf', 'dlc_late_', 'late_p']]]
  ];

  // ======================= PART ONE: THE RING =======================
  S.dlc_p1 = [
    ['if', sq, [['jump', 'dlc_sq_p1']]],
    ...part(1, 'The Ring', 'SPRING'),
    ['bg', 'office'], ['music', 'hq'],
    ['if', G => G.flags.late, [['n', "Another year goes by, faster than the first. It turns out being two people as well as nine is mostly a question of scheduling. I'm good at scheduling."]]],
    ['t', "Forty-one days. That's how long the ring has been in my jacket pocket. I know because I wrote it down. Notebook Vol. 44 has a column for it now, between call times and who forgot to eat lunch."],
    ['show', B, 'happy', '', 'r'],
    ['say', B, "Handler. The security gate has scanned a small metal ring in your left pocket forty-one mornings in a row. On day one I flagged it as a threat. On day nine I reclassified it as a question."],
    ['me', "It isn't a threat."],
    ['say', B, "Questions are frequently threats. I have read the internet.", 'smug'],
    ['show', A, 'deadpan', 'cross', 'l'],
    ['say', A, "Is the drone discussing your pocket again?"],
    ['me', "It's discussing a ring."],
    ['say', A, "…Noted.", 'surprised'],
    ['n', "She takes her glasses off and cleans them, which is what she does when she isn't telling me something. Then she puts them back on and tells me anyway."],
    ['say', A, "I kept one in a desk drawer for three years, once. I was waiting for a quiet week. There are no quiet weeks in this job, Handler. There are only weeks.", 'tender'],
    ['say', A, "Take Friday off. That isn't advice. I've already put it in the system.", 'smile'],
    ['hide', A],
    ['show', TE, 'smile', 'cross', 'l'],
    ['say', TE, "If you want a second opinion on a load-bearing question, I'm free at lunch. I'm buying. Don't argue, it's structurally unsound."],
    ['choice', [
      { t: 'Ask B.I.T. to draw up a plan.', set: 'plan_bit', then: [['say', B, "Plan prepared. Two hundred and twelve pages. Page one is a weather forecast. Page two hundred and twelve is a list of hospitals, in case of fainting. Yours, statistically.", 'happy'], ['me', "Thank you. I'll read page one."], ['say', B, "Page one says rain after six. Bring an umbrella. That is the whole plan. The other two hundred and eleven pages are me being nervous.", 'sad']] },
      { t: 'Take Tetsu up on lunch.', set: 'plan_tetsu', then: [['bg', 'ramen'], ['say', TE, "Here's what I know about foundations. You don't pour concrete on a nice day. You pour on the day the ground's ready. It feels like nothing. It isn't nothing.", 'tender'], ['say', TE, "And buy a good box. Cheap ones squeak when you open them. You don't want a squeak in that moment.", 'smile'], ['aff', TE, 2]] },
      { t: "Don't plan it. You'll know.", set: 'plan_none', then: [['t', "I have planned every call for three years: the route, the backup, the backup's backup. I'd like one thing in my life to arrive without a timer on it."]] }
    ]],
    ['hideall'],
    ['callf', 'dlc_ring_', 'route'],
    ['ach', 'dlc_ring'],
    ['jump', 'dlc_p2']
  ];

  // ======================= PART TWO: THE WEDDING =======================
  const FAV = { hikari: 'memorial', rei: 'shrine', mira: 'rooftop', sora: 'beach', kaede: 'park' };
  const venue = (id, t) => ({ t, then: [['set', 'venue', id], ['if', G => FAV[G.flags.route] === id, [['callf', 'dlc_fav_', 'route'], ['fam', 'home', 1]], [['n', "{p} thinks about it for a full minute, then writes it on the first tab in pen. Pen means yes."]]]] });
  S.dlc_p2 = [
    ['if', sq, [['jump', 'dlc_sq_p2']]],
    ...part(2, 'The Wedding', 'AUTUMN'),
    ['bg', 'apartment'], ['music', 'daily'], ['tint', 'evening'],
    ['n', "There is a binder. It has tabs. {p} made the tabs; I bought the binder. Neither of us has opened it in a week, because opening it means deciding things, and we have both spent three years deciding things for a living."],
    ['callf', 'dlc_plan_', 'route'],
    ['n', "Tab one: where."],
    ['choice', [venue('memorial', "The memorial garden. Where the crossed-out names are."), venue('shrine', "The shrine on the hill, where the steps are too steep for anyone to hurry."), venue('rooftop', "The HALO rooftop. Where most of the important things already happened."), venue('beach', "The beach at Odaiba, in the off season, where nobody brings a camera."), venue('park', "Ueno Park, by the gate. Where the squad had the picnic.")]],
    ['n', "Tab two: who says the words."],
    ['choice', [
      { t: 'Director Takamine.', then: [['set', 'officiant', 'aya'], ['bg', 'office'], ['show', A, 'deadpan', 'cross', 'c'], ['say', A, "I'm extremely busy. — Yes. Obviously yes. I got ordained online last month, in case anyone asked. It took nine minutes. Noted.", 'flustered'], ['aff', A, 2]] },
      { t: 'Natsuki Amane.', if: G => G.known.natsuki !== undefined, then: [['set', 'officiant', 'natsuki'], ['bg', 'ramen'], ['show', NA, 'excited', 'cheer', 'c'], ['say', NA, "Me? Kid. I've officiated nothing and I want to officiate everything. I'll be loud. I'll cry. I'll get the names right, probably.", 'laugh'], ['aff', NA, 2]] },
      { t: 'Deputy Saeki.', then: [['set', 'officiant', 'saeki'], ['bg', 'office'], ['show', SA, 'deadpan', 'default', 'c'], ['say', SA, "Officiating a wedding is outside my job description. That's against policy. Anyway. I'll need the forms in triplicate and both of you on time.", 'smile']] },
      { t: 'B.I.T.', then: [['set', 'officiant', 'bit'], ['show', B, 'surprised', '', 'c'], ['say', B, "Me. I will need to download every wedding ever filmed. I have done that. I will also need a crying module. I have installed one. It works too well.", 'sad']] }
    ]],
    ['hideall'],
    ['do', G => { const c = [H, R, M, SO, K, RI].filter(k => k !== G.flags.route && G.known[k] !== undefined && (k !== 'sora' || G.roster.includes('sora'))).sort((a, b) => G.aff[b] - G.aff[a]); G.flags.best_a = c[0] || RI; G.flags.best_b = c[1] || H; }],
    ['n', "Tab three: who stands next to me."],
    ['choice', [
      { t: 'Tetsu. Of course Tetsu.', then: [['set', 'best', 'tetsu'], ['aff', TE, 3]] },
      { t: '{bestA}.', then: [['do', G => { G.flags.best = G.flags.best_a; G.aff[G.flags.best] += 3; }]] },
      { t: '{bestB}.', then: [['do', G => { G.flags.best = G.flags.best_b; G.aff[G.flags.best] += 3; }]] },
      { t: 'B.I.T. It has been next to me the whole time anyway.', then: [['set', 'best', 'bit']] }
    ]],
    ['callf', 'dlc_ask_', 'best'],
    ['n', "Tab four, the one we have been avoiding: the seating chart."],
    ['breach', { title: 'The Seating Chart', sub: 'Natsuki can\'t sit by the open bar. Saeki can\'t sit by a microphone. Kyouya and Shiori need a table with no glassware. B.I.T. needs an outlet.', len: 4, buf: 8, time: 30000, flag: 'seats' }],
    ['if', G => G.flags.seats > 0, [['n', "Every name finds a chair. It is the most satisfying puzzle I have ever solved, including the Board."], ['fam', 'home', 1]], [['n', "We give up at two in the morning and write OPEN SEATING across the top in marker. {p} says it's a statement. It's a surrender."]]],
    // the night before
    ['bg', 'konbini'], ['tint', 'night'], ['music', 'idol'],
    ['n', "The night before, Mr. Oba closes the konbini for one hour, which he has not done in nineteen years. The squad brings a karaoke machine. Tetsu has a song picked. He has had it picked for three years."],
    ['say', OB, "One hour. Then I'm reopening, because the man from the 4 a.m. delivery won't know what to do with himself."],
    ['show', TE, 'determined', 'fist', 'c'],
    ['say', TE, "Enka. Three verses. You're doing the harmony. Don't look at me like that. I've heard you hum on comms."],
    ['rhythm', { title: 'Karaoke: Tetsu\'s Song', sub: 'Three verses. Harmony. Mr. Oba is filming.', track: 'idol', bars: 6, flag: 'karaoke' }],
    ['if', G => ['S', 'A'].includes(G.flags.karaoke), [['say', TE, "…That was good. That was really good. I'm not crying. It's the fryer. The fryer is very close.", 'crysmile']], [['say', TE, "We were in two different keys and one of them was not a key. It was perfect. Don't change anything.", 'laugh']]],
    ['hideall'],
    ['callf', 'dlc_eve_', 'route'],
    // the day
    ['bg', 'black'], ['music', null], ['wear', 'formal'],
    ['title', 'THE DAY', 'Clear, 19°C, light wind'],
    ['callf', 'dlc_vbg_', 'venue'],
    ['music', 'romance'], ['fx', 'petals'],
    ['n', "The chairs are folding chairs. Tetsu set them out at six a.m. in rows so straight that Shiori, arriving at six-thirty, had nothing to straighten and had to sit down and be a guest."],
    ['if', G => G.flags.truepath, [['n', "Squad One sits in the front row in borrowed suits. Daichi has his program upside down and refuses to turn it around. Mei holds her old radio in her lap, switched off, like a handbag."]]],
    ['if', G => G.flags.good || G.flags.kyouya_free, [['n', "Kyouya brought flowers made of glass. He made them this morning. A gust knocks one off a chair and it bounces. He made them so they don't break. He looks at it for a long moment and smiles."]]],
    ['n', "Rin is humming the note of whoever's nearest. Today that's everyone. It comes out as a chord."],
    ['callf', 'dlc_off_', 'officiant'],
    ['callf', 'dlc_vow_', 'route'],
    ['hideall'],
    ['callf', 'dlc_close_', 'officiant'],
    ['sfx', 'chime'], ['fx', 'confetti'],
    ['n', "Somebody starts clapping. Then everybody. Tetsu whistles with two fingers and frightens a pigeon. B.I.T.'s crying module engages at a volume that sets off a car alarm in the parking lot."],
    // reception
    ['bg', 'hq_lobby'], ['music', 'victory'], ['fx', 'fireflies'], ['tint', 'evening'],
    ['n', "The reception is in the HALO lobby, because it's the only room we know that holds everyone and has a tested evacuation plan."],
    ['callf', 'dlc_best_', 'best'],
    ['show', B, 'happy', '', 'c'],
    ['say', B, "I have also prepared a speech. It is short. I was told it must be short. I cut it from four hours."],
    ['say', B, "When I was installed at HALO, my function was to count. Calls, minutes, injuries. The Handler taught me that the important number is how many come back. Today the number is all of them. That is my speech. The crying module is engaging again. Please ignore it.", 'sad'],
    ['hide', B],
    ['sfx', 'alarm'], ['flash', '#ff5a7a'],
    ['n', "And then, because it's us: every phone in the room buzzes at once. A gas main in Ochanomizu. A school bus on the Shuto expressway with a stuck accelerator. Three calls. Then six."],
    ['show', A, 'serious', 'cross', 'l'],
    ['say', A, "Night crew's on it. You're on leave. You're at your own wedding. You are not going to—"],
    ['n', "I'm already pulling the headset out of my jacket. I brought it. Of course I brought it. {p} is already kicking off the shoes."],
    ['say', A, "…Noted. Ten minutes. Then you come back and eat cake.", 'smile'],
    ['hideall'],
    ['do', (G, api) => { G.flags.dlc_tut = api.meta.stats.shifts ? 0 : 1; }],
    ['if', G => G.flags.dlc_tut, [['shift', { title: 'Reception · Formalwear Only', calls: 5, tiers: [1, 1], diff: .9, real: 240, music: 'action', tutorial: true }]], [['shift', { title: 'Reception · Formalwear Only', calls: 6, tiers: [1, 2], diff: 1, real: 150, music: 'action' }]]],
    ['bg', 'hq_lobby'], ['music', 'romance'], ['tint', 'evening'],
    ['n', "Grade {grade}. Everybody's back in nine minutes forty. Tetsu has a scorch mark on his suit sleeve and is prouder of it than of anything he owns. Kaede ran the bus down in heels and wants that on the record."],
    ['n', "The band is two people from Aegis Rescue and a speaker. The floor clears. It's time for the dance we have practiced exactly once, in a kitchen, mostly by arguing."],
    ['rhythm', { title: 'First Dance', sub: 'Slow. Count it out. Don\'t look at your feet.', track: 'romance', bars: 8, flag: 'dance' }],
    ['if', G => G.flags.dance === 'S', [['ach', 'dlc_dance'], ['n', "Nobody steps on anybody. We hit the spin at exactly the moment the music asks for it. The room goes quiet, the good kind of quiet, the kind you hear on comms after a call goes right."], ['fam', 'home', 2]],
      [['if', G => ['A', 'B'].includes(G.flags.dance), [['n', "One stepped-on toe, one spin that turns into a hug because neither of us commits to the spin. It's better than the version we practiced."], ['fam', 'home', 1]], [['n', "It's a disaster. It's a delightful disaster. By the second chorus we have given up on the steps and we're just swaying, laughing, holding on. Natsuki films all of it."]]]]],
    ['callf', 'dlc_night_', 'route'],
    ['ach', 'dlc_wed'],
    ['jump', 'dlc_p3']
  ];
  ['memorial', 'shrine', 'rooftop', 'beach', 'park'].forEach(v => { S['dlc_vbg_' + v] = [['bg', v], ['do', G => window.HomeArt && HomeArt.venue(G.flags.route, v)]]; });
  S.dlc_off_aya = [['show', A, 'tender', 'default', 'c'], ['say', A, "I've given four hundred briefings in this city. This is the first one where nobody is going to get hurt. Probably. Let's begin before something catches fire."], ['hide', A]];
  S.dlc_off_natsuki = [['show', NA, 'crysmile', 'cheer', 'c'], ['say', NA, "Okay! I wrote this on a napkin. The napkin says: love is a rescue that never ends, so pace yourselves. That's it. That's the whole napkin. I'm crying already. Begin!"], ['hide', NA]];
  S.dlc_off_saeki = [['show', SA, 'deadpan', 'default', 'c'], ['say', SA, "We are gathered here in accordance with the city's marriage ordinance, section four. I have read it. Nobody else has. Let's proceed before anyone notices how moved I am."], ['hide', SA]];
  S.dlc_off_bit = [['show', B, 'happy', '', 'c'], ['say', B, "Dearly beloved. That is how it starts. I have checked four thousand weddings. Ninety-one percent start that way. The other nine percent are on boats."], ['hide', B]];
  S.dlc_close_aya = [['show', A, 'smile', 'cross', 'c'], ['say', A, "By the authority of the internet, which I'm told is real, I pronounce you married. Go on. You may. — Noted.", 'crysmile']];
  S.dlc_close_natsuki = [['show', NA, 'sob', 'cheer', 'c'], ['say', NA, "Married! You're married! I pronounce it! KISS! Sorry. Sorry. You may kiss. Please kiss. I'm a mess.", 'crysmile']];
  S.dlc_close_saeki = [['show', SA, 'smile', 'default', 'c'], ['say', SA, "The forms are signed. The ordinance is satisfied. You're married. The kiss is technically optional. I'd recommend it.", 'fond']];
  S.dlc_close_bit = [['show', B, 'sad', '', 'c'], ['say', B, "I now pronounce you married. You may kiss. I will look away. I will not look away. I am recording it for the archive.", 'happy']];
  // best-person speeches
  S.dlc_ask_tetsu = [['show', TE, 'stunned', 'default', 'c'], ['say', TE, "Me. Best man. Okay. I'll — okay. I'm going to need a minute. I have three sisters, I've been to all their weddings, and nobody ever asked me to stand anywhere but the back, because I block the view.", 'crysmile'], ['hide', TE]];
  S.dlc_ask_bit = [['show', B, 'surprised', '', 'c'], ['say', B, "Best drone. I accept. I will hover at a respectful height. I will hold the rings in my cargo bay. I will not drop them. I have run the simulation nine thousand times.", 'happy'], ['hide', B]];
  S.dlc_ask_hikari = [['show', H, 'shocked', 'shy', 'c'], ['say', H, "Me? You want — okay. Okay! Yes. I'll write a speech. I'll write three speeches and pick one. It won't be too long. It'll be forty percent too long.", 'excited'], ['hide', H]];
  S.dlc_ask_rei = [['show', R, 'surprised', 'cross', 'c'], ['say', R, "You're asking me to stand next to you while people look at us. For an hour. …Fine. Yes. I'll wear something that isn't black. It will be a darker shade of black.", 'halfsmile'], ['hide', R]];
  S.dlc_ask_mira = [['show', M, 'tender', 'heart', 'c'], ['say', M, "Of course. I'll bring a first-aid kit, smelling salts and a spare tie. Somebody always faints. It's usually the groom. I'll be standing right behind you, medically.", 'smile'], ['hide', M]];
  S.dlc_ask_sora = [['show', SO, 'surprised', 'wave', 'c'], ['say', SO, "me? oh. okay. my manager's going to want it in the contract. i'm not telling my manager. i'll wear sunglasses. nobody will know it's me. everybody will know it's me.", 'fond'], ['hide', SO]];
  S.dlc_ask_kaede = [['show', K, 'smirk', 'hip', 'c'], ['say', K, "Best woman. Hell yes. I'll get the rings there before anyone knows they're missing. I'll get them there before they're missing. I'll time the vows. Kidding. Mostly.", 'laugh'], ['hide', K]];
  S.dlc_ask_rin = [['show', RI, 'awe', 'cheer', 'c'], ['say', RI, "Best person! I've been collecting wedding phrases for a year. \"Tie the knot.\" \"Cold feet.\" \"Something borrowed.\" I'll borrow your watch. Is that right? That sounds right.", 'delighted'], ['hide', RI]];
  S.dlc_best_tetsu = [['show', TE, 'nervous', 'default', 'c'], ['say', TE, "I don't do speeches. I do loads. So here's a load calculation. Three years ago the Handler sat in a van and carried nine people through every bad night this city had. That's a lot of weight for a guy with no Spark."], ['say', TE, "Tonight, somebody's carrying half of it. That's how good structures work. You split the load. I'm done. That's the speech. Someone take the microphone, I'm going to cry on it.", 'crysmile'], ['hide', TE]];
  S.dlc_best_bit = [['show', B, 'happy', '', 'c'], ['say', B, "As best drone, I held the rings. I did not drop them. I would like that noted. Director?"], ['show', A, 'smile', 'cross', 'l'], ['say', A, "Noted."], ['say', B, "Thank you. That is my speech.", 'happy'], ['hideall']];
  S.dlc_best_hikari = [['show', H, 'nervous', 'default', 'c'], ['say', H, "I picked the shortest speech. It's still long. Okay. When I met the Handler I tried to buy forty onigiri with a coupon that had expired. He let it go. He said, \"It's three a.m. Nobody's checking.\" That's him. He always knows when nobody's checking, and he does the right thing anyway."], ['say', H, "…That was one minute. I had nine more. I'm skipping to the end. To the two of you! Partners! No take-backs!", 'excited', 'cheer'], ['hide', H]];
  S.dlc_best_rei = [['show', R, 'guarded', 'cross', 'c'], ['say', R, "I don't like speeches. So I'll ask a question instead. Who here has been told where to stand by this man and lived because of it?"], ['n', "Every hand in the room goes up. Aya's. Natsuki's. B.I.T. raises a manipulator arm."], ['say', R, "That's the speech.", 'halfsmile'], ['hide', R]];
  S.dlc_best_mira = [['show', M, 'smile', 'heart', 'c'], ['say', M, "Medical report. Patient: the groom. Heart rate during the vows: one hundred and thirty. Normal for him during a level-four call: seventy-two. So I can tell you, clinically, this was the scariest thing he's ever done. And he didn't miss a word.", 'laugh'], ['hide', M]];
  S.dlc_best_sora = [['show', SO, 'singing', 'heart', 'c'], ['n', "Sora doesn't give a speech. She sings one verse of something nobody has heard before, a capella, slightly off-key in the way she only is when she isn't performing, and sits down."], ['say', SO, "that one's not for sale.", 'fond'], ['hide', SO]];
  S.dlc_best_kaede = [['show', K, 'smirk', 'point', 'c'], ['say', K, "Fastest speech in history. Ready? You two are a pain in the ass and I love you. Done. Four seconds. Somebody check the clock.", 'laugh'], ['show', B, 'happy', '', 'r'], ['say', B, "Three point eight seconds."], ['hideall']];
  S.dlc_best_rin = [['show', RI, 'excited', 'cheer', 'c'], ['say', RI, "I collected a phrase for this. \"Happily ever after.\" I looked it up. It's not a promise, it's a direction. You walk toward it. So: walk well. And eat your vegetables.", 'delighted'], ['hide', RI]];

  // ======================= PART THREE: TWO KEYS =======================
  S.dlc_p3 = [
    ...part(3, 'Two Keys', 'THE FIRST YEAR'),
    ['bg', 'station'], ['music', 'daily'], ['wear', 'casual'],
    ['if', ns, [['n', "We have two keys on two rings and three places to live, and only one of them can be home."]], [['n', "{kid} and I have one key between us and a one-room apartment. {KidS} sleeps on the futon. I sleep on the floor next to it, so the first thing {kidS} sees when {kidS} wakes up from a bad dream is somebody who stayed."]]],
    ['choice', [
      { t: "The apartment over Mr. Oba's konbini. Same stairs. Bigger rooms.", then: [['set', 'home', 'oba'], ['n', "Mr. Oba gives us the second-floor flat at the rent he charged the last tenant in 2009. He refuses to discuss it."], ['callf', 'dlc_homep_', 'route']] },
      { t: 'A narrow house in Koenji with a garden the size of a futon.', then: [['set', 'home', 'house'], ['n', "It has a garden the size of a futon, a bathtub that takes forty minutes to fill, and a neighbor's cat who already thinks the house is hers."], ['callf', 'dlc_homep_', 'route']] },
      { t: 'A flat two stations from HQ. Never late again.', then: [['set', 'home', 'flat'], ['n', "Eleven minutes door to door. It has a view of the HALO tower. That's either comforting or terrible, depending on the night."], ['callf', 'dlc_homep_', 'route']] }
    ]],
    ['bg', 'apartment'], ['music', 'victory'],
    ['title', 'MOVING DAY', 'Saturday, 8:00'],
    ['show', TE, 'determined', 'fist', 'l'],
    ['say', TE, "I've got the fridge. No — I've got it. I've carried a bus. Sorry, fridge. That was my elbow. Sorry."],
    ['if', is('kaede'), [['show', H, 'excited', 'cheer', 'r'], ['say', H, "I carried the sofa! By myself! It's upstairs! It might be in the wrong apartment. I'm going to check. Don't tell Kaede, she's on trip forty-two.", 'embarrassed']],
      [['show', K, 'smirk', 'hip', 'r'], ['say', K, "That's forty trips. Forty-one. Forty-two. Everything's upstairs. You're welcome. Where do you want the bed, and don't say \"wherever,\" I'll put it on the roof.", 'laugh']]],
    ['hideall'],
    ['show', RI, 'excited', 'cheer', 'c'],
    ['say', RI, "I labeled the boxes with phrases I'm collecting! This one says KITCHEN SINK. This one says EVERYTHING BUT. That one says ON THE HOUSE. I think it's for the roof.", 'delighted'],
    ['hide', RI],
    ['if', G => G.known.natsuki !== undefined, [['show', NA, 'excited', 'wave', 'c'], ['say', NA, "Twenty-two bento! For the movers! And nineteen extra because I can't count when I'm happy! Eat, eat! Is that a stove? Can I use the stove? Don't answer.", 'laugh'], ['hide', NA]]],
    ['show', B, 'happy', '', 'c'],
    ['say', B, "I am supervising. I have one function today and it is pointing. I am very good at pointing."],
    ['hide', B],
    ['n', "By six, everything is in. By seven, everyone is gone. The new place is very quiet. Then the front door swings open on its own and bumps the wall, gently, like it's saying hello."],
    ['t', "Of course it doesn't close."],
    ['choice', [
      { t: 'Fix it myself. Tonight.', then: [['n', "I spend two hours with a screwdriver and a video tutorial narrated by a very calm man in Hokkaido. At 1 a.m. it closes. Click."], ['fam', 'home', 1]] },
      { t: 'Call Tetsu.', then: [['n', "Tetsu arrives in eleven minutes with a toolbox and a thermos. He fixes it in forty seconds and stays two hours, because there's a thermos."], ['aff', TE, 2]] },
      { t: 'Leave it. "Doors break. It\'s a known property of doors."', then: [['n', "We leave it. It swings open every time the train passes. After a month we stop noticing. After two we'd miss it."], ['fam', 'home', 1]] }
    ]],
    ['bg', 'apartment'], ['music', 'daily'],
    ['n', "The first year is mostly weekends. Weekdays belong to the city."],
    ...weekend('w1_', 3, [
      { id: 'cook', t: 'Cook dinner together. Properly. From a recipe.', s: [['bg', 'apartment'], ['callf', 'dlc_cook_', 'route'], ['fam', 'home', 1]] },
      { id: 'oba', t: "Visit Mr. Oba's konbini. Work the register for an hour, for old times' sake.", s: [['bg', 'konbini'], ['tint', 'night'], ['say', OB, "Your apron's still on the hook. I never gave it to anyone else. Nobody else could find the receipt paper."], ['n', "I work the register from 11 to midnight. Nothing happens. A student buys instant noodles and a highlighter. A taxi driver buys gum. It's the most peaceful hour of my year."], ['if', ns, [['n', "{p} comes in at 11:40 pretending to be a customer and asks for a coupon that expired in 2019. I let it go. It's late. Nobody's checking."]]], ['tint', null], ['fam', 'home', 1]] },
      { id: 'game', t: 'Host a game night for the squad.', s: [['bg', 'apartment'], ['tint', 'night'], ['show', R, 'smug', 'cross', 'l'], ['show', K, 'angry', 'point', 'r'], ['say', K, "She's cheating. I can't prove it. The cards are in her shadow, I know they're in her shadow."], ['say', R, "Is it cheating if I didn't move my hands? I didn't move my hands.", 'smirk'], ['hideall'], ['show', TE, 'smile', 'cross', 'c'], ['n', "By midnight Tetsu has turned the game box into a shelf, because the box was 'structurally interesting.' The board game is now permanently on the wall. Nobody can play it again. Everybody agrees it's better this way."], ['hide', TE], ['tint', null], ['fam', 'home', 1]] },
      { id: 'date', t: 'A real date. No earpiece.', if: ns, s: [['callf', 'dlc_date_', 'route'], ['fam', 'home', 1]] },
      { id: 'zoo', t: 'Take {kid} to the zoo.', if: sq, s: [['bg', 'park'], ['n', "{kid} stands in front of the penguins for forty minutes. {KidS} doesn't say anything. On the way home, {kidS} says, very quietly, \"They all go in the water together.\" Then {kidS} holds my hand for the first time without being asked."], ['fam', 'kind', 1], ['fam', 'home', 1]] },
      { id: 'nothing', t: 'Do nothing. On purpose. All day.', s: [['bg', 'apartment'], ['n', "We do nothing. We don't check the news. I don't check the call board. At four in the afternoon somebody suggests a walk and we both decide, together, that it's a bad idea. It's the best day of the month."], ['fam', 'home', 2]] }
    ], ["Another week. Another Saturday.", "The weeks start to have a shape."]),
    ['callf', 'dlc_fight_', 'route'],
    ['ach', 'dlc_home'],
    ['jump', 'dlc_p4']
  ];

  // ======================= PART FOUR: NEWS =======================
  S.dlc_p4 = [
    ['if', sq, [['jump', 'dlc_sq_p4']]],
    ...part(4, 'News', 'THE SECOND YEAR'),
    ['callf', 'dlc_news_', 'route'],
    // telling the squad
    ['bg', 'hq_lobby'], ['music', 'daily'],
    ['n', "We tell the squad on a Tuesday, in the HQ kitchen, because it's where everyone ends up between calls."],
    ['show', TE, 'shocked', 'default', 'l'],
    ['say', TE, "A — okay. Okay. Congratulations. I'm very calm. I'm going to need to sit down. I'm going to build a crib. Don't buy a crib. I'm building it. Oak.", 'crysmile'],
    ['show', B, 'surprised', '', 'r'],
    ['say', B, "Calculating. The office will need a new seat at the table in approximately thirty-four weeks. I will begin ordering small helmets."],
    ['hideall'],
    ['show', RI, 'awe', 'cheer', 'c'],
    ['say', RI, "A baby! I've never met a baby who was born after me. Everyone was born before me, technically. This is the first time I'll be older than someone from the start.", 'delighted'],
    ['hide', RI],
    ['show', A, 'deadpan', 'cross', 'c'],
    ['say', A, "Noted."],
    ['n', "She takes her glasses off. She cleans them for a very long time."],
    ['say', A, "You'll take a year of leave. Not three months. A year. That isn't negotiable, it's policy, and I'm writing the policy right now.", 'tender'],
    ['me', "Who runs dispatch?"],
    ['say', A, "I did it before you. I was terrible at it. I'll be terrible at it again. Go home, Handler.", 'smile'],
    ['hide', A],
    ['n', "My last shift before leave falls on a Thursday. Of course it's busy. The city has never once let me leave quietly."],
    ['shift', { title: 'Last Shift Before Leave', calls: 8, tiers: [1, 2, 3], diff: 1.15, real: 190, music: 'hq' }],
    ['bg', 'office'], ['music', 'romance'],
    ['n', "Grade {grade}. I take the headset off and hang it on the hook by the door. The door closes behind me. Click."],
    // the crib
    ['bg', 'apartment'], ['music', 'daily'],
    ['n', "Tetsu's oak crib arrives in two hundred and twelve pieces, because Tetsu believes a man should build the thing his child sleeps in. The instructions are hand-drawn. They are beautiful. They are not clear."],
    ['breach', { title: 'The Crib (212 pieces)', sub: 'Tetsu\'s hand-drawn instructions. Step 4 is a drawing of a bonsai. Nobody knows why.', len: 5, buf: 8, time: 32000, flag: 'crib' }],
    ['if', G => G.flags.crib > 0, [['ach', 'dlc_crib'], ['n', "It's done at midnight. No leftover screws. It doesn't wobble. I put my hand on the rail and it feels like something that will hold."], ['fam', 'home', 1]], [['n', "There are four leftover screws and it leans slightly to the left. Tetsu comes over, looks at it, takes it apart, and rebuilds it in an hour without saying a word. Then he says, \"It was a hard set of drawings.\" It was not."], ['aff', TE, 1]]],
    ['jump', 'dlc_p5']
  ];

  // ======================= PART FIVE: SMALL HOURS =======================
  S.dlc_p5 = [
    ['if', sq, [['jump', 'dlc_sq_p5']]],
    ...part(5, 'Small Hours', 'THAT WINTER'),
    ['bg', 'medbay'], ['music', 'tension'], ['tint', 'night'],
    ['n', "03:12. The hospital. I've spent three years in a van outside other people's worst nights, listening, telling them where to go, waiting for the line to come back."],
    ['n', "Tonight a nurse holds the door open for me and says, \"Dad? You can come in.\" I've never once been allowed in."],
    ['callf', 'dlc_labor_', 'route'],
    ['music', 'romance'], ['tint', null], ['sfx', 'chime'],
    ['n', "06:40. A noise like a very small, very offended kettle."],
    ['choice', [
      { t: '"It\'s a girl."', then: [['set', 'kidg', 'girl']] },
      { t: '"It\'s a boy."', then: [['set', 'kidg', 'boy']] },
      { t: "I don't decide this. (Surprise me.)", then: [['do', G => { G.flags.kidg = Math.random() < .5 ? 'girl' : 'boy'; }], ['n', "It's a {kidK}."]] }
    ]],
    ['kidname', 'kid', 'Name your {kidC}'],
    ['callf', 'dlc_hold_', 'route'],
    // nights
    ['bg', 'apartment'], ['music', 'night'], ['tint', 'night'],
    ['title', 'NIGHT ELEVEN', '03:00'],
    ['n', "{kid} has opinions about sleep, and the opinion is no. The only thing that works is one specific song, sung one specific way, which is to say badly."],
    ['rhythm', { title: 'Lullaby', sub: 'Three in the morning. Keep it slow. Keep it steady. Don\'t stop or you start over.', track: 'night', bars: 6, flag: 'lullaby' }],
    ['if', G => ['S', 'A'].includes(G.flags.lullaby), [['n', "{KidS}'s asleep by the second verse. I keep singing to the end anyway. It feels rude to stop."], ['fam', 'home', 1]], [['n', "Six verses. Then a seventh I make up, about the night bus. {KidS} falls asleep in the middle of the night bus verse, out of what I can only describe as pity."]]],
    ['n', "There are a lot of nights. I start keeping notes. Notebook Vol. 46: feeds, hours slept, a column for small facial expressions that might be smiles."],
    ['choice', [
      { t: 'Read to {kidO} from the old notebooks. Call logs. Weather. The way Rei holds her scarf.', then: [['n', "{KidS} watches my mouth the whole time like the call logs are a thriller. Maybe they are."], ['fam', 'curious', 1]] },
      { t: 'Walk {kidO} around the block at four a.m., in the cold, so {kidS} can see the streetlights.', then: [['n', "{KidS} doesn't cry once outside. {KidS} stares at a delivery truck like it's a dragon and {kidS} is deciding whether to fight it."], ['fam', 'brave', 1]] },
      { t: "Hum, quietly, while {kidS} holds my finger.", then: [['n', "{KidS} holds on so hard my finger goes white. Every night. Like {kidS} is checking I'm still there."], ['fam', 'kind', 1]] }
    ]],
    ['callf', 'dlc_early_', 'route'],
    // first night out
    ['bg', 'city_night'], ['music', 'date'], ['tint', 'night'],
    ['n', "Month four. The squad offers to babysit so we can go out for dinner. All of them. At once. It's a terrible idea and we're too tired to say no."],
    ['if', is('kaede'), [['phone', B, { msgs: ['Minute 4: the infant is fine. Tetsu is not fine. He is holding the infant like a bomb that is also a kitten.', 'Minute 19: Hikari has changed a diaper. It is on backwards. She has apologized to the infant at length.', 'Minute 33: Rin sang to the infant. The infant sang back. Rin is now crying. The infant is not.', 'Minute 41: Shiori has made a laminated schedule. It has color codes. The infant ignored it. Shiori respects that.', 'Minute 58: all quiet. Everyone is asleep. The infant is awake and looking at me. I think we are friends. Please do not hurry home.'], replies: [{ t: 'Is everyone okay?', resp: ['Everyone is okay. I counted. Counting is my original function.'] }, { t: 'Put Tetsu on.', resp: ['Tetsu cannot come to the phone. The infant is asleep on his chest and he says he will not move until spring.'] }] }]],
      [['phone', B, { msgs: ['Minute 4: the infant is fine. Tetsu is not fine. He is holding the infant like a bomb that is also a kitten.', 'Minute 19: Kaede has timed a diaper change. Eleven seconds. She would like this submitted for a record.', 'Minute 33: Rin sang to the infant. The infant sang back. Rin is now crying. The infant is not.', 'Minute 41: Shiori has made a laminated schedule. It has color codes. The infant ignored it. Shiori respects that.', 'Minute 58: all quiet. Everyone is asleep. The infant is awake and looking at me. I think we are friends. Please do not hurry home.'], replies: [{ t: 'Is everyone okay?', resp: ['Everyone is okay. I counted. Counting is my original function.'] }, { t: 'Put Tetsu on.', resp: ['Tetsu cannot come to the phone. The infant is asleep on his chest and he says he will not move until spring.'] }] }]]],
    ['callf', 'dlc_out_', 'route'],
    ['ach', 'dlc_baby'],
    ['jump', 'dlc_p6']
  ];

  // ======================= PART SIX: SPARKS =======================
  const parkTeam = G => { const r = G.flags.route; return [r, TE, K, RI, H, SH].filter((v, i, a) => v && a.indexOf(v) === i && ['hikari', 'rei', 'kaede', 'tetsu', 'sora', 'rin', 'natsuki', 'shiori'].includes(v)).slice(0, 3); };
  S.dlc_p6 = [
    ...part(6, 'Sparks', 'FIVE YEARS OLD'),
    ['bg', 'park'], ['music', 'daily'],
    ['n', "Saturday at Ueno Park. {kid} is five and has opinions about everything: crows (good), pigeons (suspicious), the sandbox (a kingdom), me (useful, but slow)."],
    ['say', KD, "Dad. Do you have a Spark?"],
    ['me', "No."],
    ['say', KD, "Then what do you do at work?"],
    ['me', "I watch. Then I tell people where to go."],
    ['say', KD, "That's just being bossy."],
    ['choice', [
      { t: '"Yes. Professionally bossy."', then: [['say', KD, "Can I be professionally bossy?"], ['me', "You already are."], ['fam', 'curious', 1]] },
      { t: '"It\'s more like being the one who stays, so the others can go."', then: [['say', KD, "Like when you stay at the bottom of the slide so I don't fall off the end?"], ['me', "Exactly like that."], ['fam', 'kind', 1]] },
      { t: '"It\'s how you help when you can\'t fly."', then: [['say', KD, "I'm going to fly."], ['me', "Okay."], ['say', KD, "You can tell me where."], ['fam', 'brave', 1]] }
    ]],
    ['if', G => G.flags.truepath, [['n', "Every Rift in the city closed the morning Squad One came home. Every one but the small ones. Every few years, somewhere, a crack the width of a coin opens and something sharp climbs out."]], [['n', "The big Rifts are gone. The small ones never quite stopped. Every few months, somewhere, a crack the width of a coin opens and something sharp climbs out."]]],
    ['sfx', 'shatter'], ['shake', 2], ['music', 'tension'], ['tint', 'evening'],
    ['n', "Today it's the sandbox."],
    ['n', "A Glass Hound, small, the size of a fox, made of bottle-green shards, drops out of a crack in the air above the kingdom {kid} just built. Parents scream. Phones come out. The hound looks around like it's surprised to be here too."],
    ['if', ns, [['n', "My hand goes to my ear for a headset that isn't there. Then I remember who I married, and who's having a picnic thirty meters away, and that I don't need one."]], [['n', "My hand goes to my ear for a headset that isn't there. Then I remember who's having a picnic thirty meters away, and that I don't need one."]]],
    ['if', ns, [['show', P, 'determined', 'fist', 'l']]],
    ['show', TE, 'determined', 'fist', 'r'],
    ['say', TE, "On it. Handler. Call it like it's Tuesday."],
    ['hideall'],
    ['do', G => { G.flags.ros_bk = G.roster.slice(); G.roster = parkTeam(G); }],
    ['fight', { id: 'park', foe: 'hound', title: 'Park Day', sub: 'One small Glass Hound in the sandbox. Twelve parents filming.', bg: 'park', music: 'action', loseText: 'The hound bolts into the trees with half the sandbox kingdom in its jaws.', xp: 40 }],
    ['do', G => { G.roster = G.flags.ros_bk || G.roster; delete G.flags.ros_bk; }],
    ['bg', 'park'], ['music', 'mystery'],
    ['if', G => G.flags.f_park === 'win', [['n', "Done in under a minute. The hound breaks into sand. A father nearby asks if I'm 'with the heroes.' I say I'm with the kid in the sandbox."]], [['n', "It gets away, into the trees, and it takes the sandbox kingdom's main tower with it. Aegis Rescue finds it an hour later asleep under a vending machine."]]],
    ['n', "And then I turn around and {kid} is standing in the middle of the ruined sandbox, and something is happening."],
    ['callf', 'dlc_spark_', 'route'],
    // registration
    ['bg', 'hq_lobby'], ['music', 'hq'],
    ['title', 'SPARK REGISTRATION', 'HALO, Window 3'],
    ['if', is('kaede'), [['n', "Registration is a paper form now. No chip. No Board. The clerk at Window 3 stamps a card anyway and hands it to {kid}. It says SPARK: NONE. Underneath, in the Director's handwriting: *OBSERVER, FIRST CLASS.* It isn't a real rank. It is now."]],
      [['n', "Registration is a paper form now. No chip. No Board. A clerk at Window 3 stamps it and hands {kid} a paper license with {kidP} own name on it, spelled almost right."]]],
    ['show', A, 'smile', 'cross', 'c'],
    ['say', A, "I approved this form, you know. The paper one. Two hundred heroes on the committee and I made them fight about the font for a week."],
    ['say', KD, "Is this mine?"],
    ['say', A, "It's yours. Nobody can tell you what to do with it. Not even me. — Don't tell your father I said that.", 'smirk'],
    ['hide', A],
    ['n', "On the bus home {kid} holds the license in both hands like it might blow away."],
    ['choice', [
      { t: '"It means you can help people. When you\'re ready. Not before."', then: [['fam', 'kind', 1]] },
      { t: '"It means it\'s yours. You don\'t owe it to anyone."', then: [['fam', 'brave', 1]] },
      { t: '"We\'re going to learn how it works. Together. With a notebook."', then: [['say', KD, "Can I have my own notebook?"], ['me', "Vol. 1."], ['fam', 'curious', 1]] }
    ]],
    ['ach', 'dlc_spark'],
    ['jump', 'dlc_p7']
  ];

  // ======================= PART SEVEN: SCHOOL DAYS =======================
  S.dlc_p7 = [
    ...part(7, 'School Days', 'SEVEN YEARS OLD'),
    ['bg', 'office'], ['music', 'daily'],
    ['n', "Career Day, second grade. {kid} has asked me to come. {KidS} has asked me not to embarrass {kidO}. {KidS} has asked me both things in the same sentence."],
    ['say', FU, "And this is {kid}'s father, who works at HALO! What do you do there?"],
    ['me', "I'm a Handler."],
    ['n', "Twenty-six second graders look at me. A boy in the front row asks if I can shoot lightning. I say no. He asks if I can turn invisible. I say no. He asks what I *can* do. Ms. Fujita's face says she's wondering the same thing."],
    ['sfx', 'alarm'], ['flash', '#ff5a7a'],
    ['n', "Then the fire alarm goes off. A drill — Ms. Fujita forgot it was scheduled. Twenty-six seven-year-olds stand up at once. Two of them go under the desks. One goes toward the window. The hamster cage is open."],
    ['eye', { prompt: 'Twenty-six kids, one door, one window, one escaped hamster, one teacher frozen with the clipboard. You have five seconds. Who first?', time: 9000, opts: [
      { t: '"Window row, line up by the door. Desk kids, you\'re second. You by the window: you\'re my hamster spotter. Go."', ok: 1 },
      { t: '"Everybody hold the hand of the person next to you and follow Ms. Fujita."', ok: 1, timeout: 1 }
    ] }],
    ['n', "Fifty-one seconds. Everyone outside, in two lines. The hamster spotter has the hamster. Ms. Fujita checks her clipboard twice and then just stares at me."],
    ['say', FU, "…Can you come back next year?"],
    ['say', KD, "That's what you do?"],
    ['me', "That's what I do."],
    ['say', KD, "That's actually kind of cool. Don't tell anyone I said that."],
    ['n', "On the walk home there's a moment, at the crossing by the bakery."],
    ['if', is('kaede'), [['say', KD, "A kid in my class said I'm weird. Because my mom's the fastest person alive and I don't have anything."]], [['say', KD, "A kid in my class said my Spark is weird. And that I'm weird."]]],
    ['choice', [
      { t: '"Weird is good. Weird is how we found every hero I know."', then: [['say', KD, "Even Tetsu-ojisan?"], ['me', "Tetsu is the weirdest person I've ever met."], ['fam', 'brave', 1]] },
      { t: '"Maybe that kid is scared. Scared people say mean things first."', then: [['say', KD, "…He did look scared. Maybe I'll show him the hamster."], ['fam', 'kind', 1]] },
      { t: '"What exactly did he say? Write it down. We\'ll figure out what he meant."', then: [['n', "{KidS} writes it down in Vol. 1, very seriously, in pencil. We decide, together, that he meant he wanted to be friends but didn't know how. Later, that turns out to be true."], ['fam', 'curious', 1]] }
    ]],
    ['bg', 'apartment'], ['music', 'date'],
    ['n', "Weekends again. They're different now. They have a small person in them who has a vote, and uses it."],
    ...weekend('w2_', 3, [
      { id: 'aqua', t: 'The aquarium.', s: [['bg', 'aquarium'], ['music', 'romance'], ['n', "{kid} presses {kidP} face against the shark tank and refuses to leave until a shark looks back. One does, eventually. {KidS} names it Saeki."], ['if', ns, [['callf', 'dlc_a2_aqua_', 'route']]], ['fam', 'curious', 1]] },
      { id: 'fest', t: 'The summer festival, in yukata.', s: [['bg', 'festival'], ['fx', 'fireworks'], ['wear', 'yukata'], ['n', "Goldfish scooping. {kid} gets one on the first try and then, horrified, asks if it wants to go home. We let it go back. The stall man gives {kidO} a second fish anyway, for kindness."], ['if', ns, [['callf', 'dlc_a2_fest_', 'route']]], ['wear', 'casual'], ['fx', null], ['fam', 'kind', 1]] },
      { id: 'snow', t: 'The first snow day.', s: [['bg', 'snow_city'], ['fx', 'snow'], ['wear', 'winter'], ['n', "A snowball fight with the whole squad. {kid} takes on Kaede alone and loses gloriously and demands a rematch, and wins the rematch because Kaede 'slipped.' Kaede did not slip."], ['if', ns, [['callf', 'dlc_a2_snow_', 'route']]], ['wear', 'casual'], ['fx', null], ['fam', 'brave', 1]] },
      { id: 'beach', t: 'The beach, out of season.', s: [['bg', 'beach'], ['music', 'daily'], ['n', "Grey sky, cold sand, nobody else for a kilometer. {kid} builds a HALO tower out of sand with a working door. It doesn't close. {KidS} says that's on purpose."], ['if', ns, [['callf', 'dlc_a2_beach_', 'route']]], ['fam', 'home', 1]] },
      { id: 'ferris', t: 'The amusement park. The Ferris wheel.', s: [['bg', 'amusement'], ['music', 'romance'], ['n', "At the top of the Ferris wheel {kid} goes very quiet and looks out at the whole city, at all of it at once, the way I look at the call board."], ['say', KD, "Dad. Is that all of it?"], ['me', "That's all of it."], ['say', KD, "That's a lot of people to tell where to go."], ['if', ns, [['callf', 'dlc_a2_ferris_', 'route']]], ['fam', 'curious', 1]] }
    ], ["Another weekend.", "Another."]),
    ['callf', 'dlc_more_', 'route'],
    ['if', G => G.flags.more, [['if', sq, [['call', 'dlc_kid2_sq']], [['call', 'dlc_kid2']]]]],
    ['jump', 'dlc_p8']
  ];
  S.dlc_kid2 = [
    ['bg', 'medbay'], ['music', 'romance'],
    ['title', 'FOURTEEN MONTHS LATER', '05:20'],
    ['n', "The second time, I know where the vending machine is and which nurse brings extra blankets. The second time, {kid} sits in the waiting room with Tetsu, in pajamas, holding a drawing {kidS} made for the baby. It's a picture of the baby. It is a very unflattering picture."],
    ['choice', [
      { t: '"A girl."', then: [['set', 'kid2g', 'girl']] },
      { t: '"A boy."', then: [['set', 'kid2g', 'boy']] },
      { t: '(Surprise me.)', then: [['do', G => { G.flags.kid2g = Math.random() < .5 ? 'girl' : 'boy'; }], ['n', "It's a {kid2C}."]] }
    ]],
    ['kidname', 'kid2', 'Name your {kid2C}'],
    ['n', "{kid} is allowed in at seven. {KidS} looks at {kid2} for a long time, with the seriousness {kidS} usually saves for the shark tank."],
    ['say', KD, "Hi. I'm your big {kidSib}. I'll tell you where to go. Not in a bossy way. In a professional way."],
    ['n', "{kid2} grabs {kid}'s finger and holds on so hard it goes white."],
    ['say', KD, "Dad. {Kid2S}'s checking I'm still here."],
    ['me', "Yeah. You do that too."],
    ['set', 'twokids', 1], ['ach', 'dlc_full'], ['fam', 'home', 2]
  ];

  // ======================= PART EIGHT: TEN YEARS =======================
  S.dlc_p8 = [
    ...part(8, 'Ten Years', 'AN ANNIVERSARY'),
    ['bg', 'city_night'], ['music', 'night'],
    ['n', "Some things that happen in ten years, in no order:"],
    ['n', "Tetsu builds a house. With his hands. It takes four years and it has a room in it with a sign on the door that says FOR WHOEVER NEEDS IT. Someone always does."],
    ['if', G => G.flags.route !== 'kaede', [['n', "Kaede wins a marathon by walking the last kilometer, on purpose, waving. The video has eleven million views. The comments are all the same: why did she slow down. She never says."]]],
    ['if', G => G.flags.route !== 'sora' && G.roster.includes('sora'), [['n', "Sora releases an album with no singles and no music videos and no stage face on the cover. It's the best-selling record of the decade. She does one interview. She's in sweatpants."]]],
    ['if', G => G.flags.route !== 'rei', [['n', "Rei takes on an apprentice, a fourteen-year-old with shadows that won't sit still. She teaches them the thing nobody taught her: you can ask for help before it's too late. She makes the kid practice saying it out loud."]]],
    ['if', G => G.flags.route !== 'mira', [['n', "Mira opens a clinic for heroes. The sign on the front says: WE TREAT THE PEOPLE WHO TREAT EVERYONE ELSE. The waiting room is always full. Nobody waits long."]]],
    ['if', G => G.flags.route !== 'hikari', [['n', "Hikari and Natsuki take over Ramen Raijin on weekends. Natsuki cooks. It's terrible. Hikari makes it good again behind her back. Neither one has ever admitted anything."]]],
    ['n', "Rin finishes high school, twelve years late, at the top of her class. She gives the graduation speech. It's mostly phrases she's collected. It makes no sense and everybody cries."],
    ['n', "Aya Takamine retires. Her successor is Director Saeki. His first act is to take the old Handler's office door off its hinges, the one that never closed until he fixed it, and hang it in the lobby. The plaque says: DOORS BREAK."],
    ['n', "And: ten years."],
    ['callf', 'dlc_anniv_', 'route'],
    ['jump', 'dlc_p9']
  ];

  // ======================= PART NINE: HOME =======================
  S.dlc_p9 = [
    ...part(9, 'Home', 'TWELVE YEARS OLD'),
    ['bg', 'training'], ['music', 'hq'],
    ['n', "{kid} is twelve. HALO runs a Junior Corps now, on weekends: first aid, rope work, search patterns, how to read a city. {KidS} signed up without asking, then asked."],
    ['n', "Today is {kidP} first field exercise. A mock disaster at the old Shinagawa freight yard: dummies to find, a radio to run. The cadets carry radios. The radios connect to a dispatch van."],
    ['n', "Guess who's in the van."],
    ['bg', 'ops'], ['music', 'tension'], ['letterbox', 1],
    ['n', "09:40. The exercise is going fine. Then the ground moves."],
    ['sfx', 'shatter'], ['shake', 3], ['flash', '#ffffff'],
    ['n', "A real tremor. Magnitude five. Nothing in the city falls, but in the freight yard a stack of empty containers shifts and settles, and three cadets are on the wrong side of it. One of them is mine."],
    ['say', 'cadet', "(radio) …Handler? Handler, this is Cadet Team Two. Is anybody there?"],
    ['n', "It's {kid}'s voice. {KidS} says Handler. {KidS} doesn't say Dad. {KidS}'s doing it right."],
    ['me', "Team Two, Handler. I hear you. Count off for me."],
    ['say', KD, "(radio) Three of us. Nobody's hurt. Mika's ankle is — it's twisted. The way out is blocked. There's a gap, but it's small, and it's dark, and the containers are still kind of moving."],
    ['t', "Twelve years of this job, and I have never once had to choose whether to send my own child through a gap in the dark."],
    ['eye', { prompt: 'Three cadets, one twisted ankle, one narrow gap, containers still settling. Rescue is six minutes out. Your child is on the radio, waiting for you to tell them where to go.', time: 12000, opts: [
      { t: '"Stay where you are. Sit down, back to the wall, keep Mika talking. Rescue is six minutes out. You did everything right."', ok: 1, then: [['set', 'p9_call', 'stay']] },
      { t: '"Look at the gap with your light. Tell me what you see. Don\'t go in. Just look."', ok: 1, then: [['set', 'p9_call', 'look']] },
      { t: '"Wait for me."', ok: 0, timeout: 1, then: [['set', 'p9_call', 'wait']] }
    ] }],
    ['callf', 'dlc_p9t_', 'dlc_top'],
    ['sfx', 'confirm'], ['letterbox', 0],
    ['n', "Six minutes. Aegis Rescue, in orange. Shiori's team. Three cadets walk out under a lifted container. One limps. The other two hold her up."],
    ['bg', 'harbor'], ['music', 'romance'],
    ['n', "Afterward I sit on the van's back step for a long time with the headset in my hands. {kid} sits down next to me, still in the cadet vest, and leans on my shoulder, and doesn't say anything. Neither do I."],
    ['say', KD, "Is that what it's like? Every time? Waiting in the van?"],
    ['me', "Every time."],
    ['say', KD, "…That's way harder than going in."],
    ['me', "Yeah."],
    ['callf', 'dlc_wait_', 'route'],
    // dinner
    ['bg', 'apartment'], ['music', 'daily'], ['tint', 'evening'],
    ['n', "Dinner. The table is too small, as always. Everybody comes, as always: whoever's in town, whoever's on leave, whoever heard. The door doesn't close behind the last of them. Nobody minds."],
    ['if', G => G.flags.twokids, [['n', "{kid2} has decided the story of the freight yard belongs to {kid2O} now and is telling it to Tetsu, wrong, with sound effects. {kid} corrects every detail. Tetsu listens to both versions like they're the news."]]],
    ['callf', 'dlc_fin_', 'route'],
    ['jump', 'dlc_close']
  ];
  S.dlc_p9t_brave = [['say', KD, "(radio) …Copy. Handler — I can see through the gap. It's clear on the other side. I can carry Mika. I'm stronger than I look. You told me to look, so I looked. Can I go? I'll only go if you say."], ['me', "…Stay. Rescue's four minutes out. Carrying her is brave. Waiting with her is braver."], ['say', KD, "(radio) Copy. Staying. — It IS harder."]];
  S.dlc_p9t_kind = [['say', KD, "(radio) Copy. We're sitting down. Mika's scared. I'm telling her about the shark at the aquarium. The one named Saeki. She's laughing. Handler, she's laughing. Is that allowed?"], ['me', "That's the most allowed thing there is."]];
  S.dlc_p9t_curious = [['say', KD, "(radio) Copy. Handler — the container on the left isn't moving. The one on the right is. If rescue comes from the left, they won't have to lift the moving one. I wrote it down. I'm reading it to you."], ['me', "…Copy. Passing it on. That's good work, Team Two."], ['n', "I pass it on to Aegis. Shiori says, \"Who's on that radio?\" I tell her. She says, \"Noted.\" She learned that from Aya."]];
  S.dlc_close = [
    ['do', G => { const t = top(G); G.flags.dlc_top = t; }],
    ['cgoff'], ['hideall'],
    ['do', (G, api) => { const r = G.flags.route; api.meta.endings['dlc_' + r] = 1; if (G.flags.twokids) api.meta.endings.dlc_full = 1; if (G.flags.dlc_top === 'curious') api.meta.endings.dlc_handler = 1; const d = Object.assign({}, api.meta.dlcDone || {}); d[r] = 1; if (['hikari', 'rei', 'mira', 'sora', 'kaede', 'squad'].every(k => d[k])) api.unlock('dlc_all'); api.saveMeta(); }],
    ['bg', 'city_night'], ['music', 'title'], ['fx', 'stars'],
    ['n', "*Heartline: Home. Thank you for staying.*"],
    ['end']
  ];
  // keep the top trait current so 'callf … dlc_top' always resolves
  const _p9 = S.dlc_p9; _p9.splice(_p9.findIndex(c => c[0] === 'eye'), 0, ['do', G => { G.flags.dlc_top = top(G); }]);
})();

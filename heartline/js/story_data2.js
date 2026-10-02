/* HEARTLINE AGENCY — Arc Two data: codex, chapter titles, scene names, new heroes' profiles and chatter,
   arc-two dispatch calls and live events, phone texts, HeroNet posts and achievements. */
(() => {
  STORY.chapterTitles = ['Squad Zero', 'Glass Hearts', 'Fractures', 'Shattered City', 'Operation Heartline', 'Echo', 'The Board', 'Rogue', 'Winter of Glass', 'Prisoners', 'Broken Halo', 'Heartline'];

  // ---------- codex ----------
  const C = (cat, t, body) => ({ cat, t, body });
  STORY.codex = {
    c_hikari: C('Heroes', '⚡ Hikari Amane — Thunder Goddess', 'Electrokinetic. Nineteen. Raw output rivals S-rank heroes; her aim improves every week. Daughter of the rescue hero Natsuki Amane, who went into the Shibuya Rift twelve times. Counts things aloud when she is afraid.'),
    c_rei: C('Heroes', '🌑 Rei Kurogane — Nightveil', 'Umbrakinetic. Steps through any shadow within fifty meters. Worked alone after an accident with her old partner, Ren Ishida. Owns one black cat, Receipt, who owns her back.'),
    c_mira: C('Heroes', '✚ Mira Solace — Halo Nurse', 'HALO\'s medical officer. Heals by taking a wound into her own body, an ability engineered by the Board\'s Project SOLACE when she was nine. She chose to become a doctor anyway.'),
    c_kaede: C('Heroes', '🌪 Kaede Mori — Gale', 'Aerokinetic speedster. Top speed 340 km/h, a fact she will tell you unprompted. Hikari\'s academy rival and, eventually, her best friend.'),
    c_tetsu: C('Heroes', '🛡 Tetsu Oda — Bulwark', 'Ferrokinetic tank. Former construction worker. Sends half his pay home to his sisters. His bonsai, Kazuo, is forty years old.'),
    c_sora: C('Heroes', '🌌 Sora Hoshino — Stargazer', 'Gravikinetic idol hero, formerly STELLAR\'s top act. Can make a bus float. Broke her contract live in front of twelve million people.'),
    c_rin: C('Heroes', '🔔 Rin Aoi — Echo', 'Resonance Spark. Hears the note that glass, steel and bone are tuned to, and sings it back. Squad One\'s youngest member. Spent eight years inside the Shibuya Rift and came out seventeen.'),
    c_natsuki: C('Heroes', '🔥 Natsuki Amane — Salamander', 'Rescue specialist. Walks through fire. Went into the Shibuya Rift twelve times and carried out thirty-two people. Held in Board stasis for seven years. Terrible cook.'),
    c_shiori: C('Heroes', '🛡 Shiori Kagami — Aegis Prime', 'Hard-light shields and lances. Raised by the Board from age nine. Captain of Aegis, the Board\'s elite unit, until she cut her own chip out on live television. Secretly draws.'),
    c_aya: C('HALO', '🎖 Director Aya Takamine', 'Director of HALO. Former Handler of Squad One. Recruited a convenience-store clerk on a hunch. Owns exactly one disguise: an I ♥ NEO-TOKYO hoodie.'),
    c_bit: C('HALO', '🤖 B.I.T.', 'Battlefield Intelligence Terminal. HALO\'s support drone. Enjoys crime more than it admits. Keeps a file named *family*.'),
    c_kyouya: C('People', '💎 Kyouya Aoi — The Glazier', 'Squad One\'s Handler. Survived Shibuya because Natsuki Amane carried him out. Spent eight years trying to reopen the Rift to bring his squad home, and nearly shattered the city doing it.'),
    c_kuroda: C('The Board', '🕴 Chairman Genjirou Kuroda', 'Chair of the HALO Board for forty years. Spark-negative until a Rift opened in his village and gave him a voice that anyone with Rift glass in them must obey.'),
    c_saeki: C('The Board', '📎 Deputy Saeki', 'Acting Director during the Board takeover. Universally despised. Secretly Aya Takamine\'s inside man for six years. Fixed the door.'),
    notebook: C('World', '📓 The Notebook', 'HandlerZero\'s notebooks, volume 37 and counting. Not a diary. A record of what people do when they think nobody is watching. A tell is a small thing someone does without knowing: it is the most honest thing about them.'),
    halo: C('World', '◎ HALO Agency', 'Neo-Tokyo\'s largest hero agency. Licenses, trains and dispatches heroes. Answers, in theory, to the Board.'),
    sparks: C('World', '✦ Sparks', 'One person in ten thousand wakes up with a Spark: a superpower. Arc Two revealed the reason: Sparks are born from Rift light. The Board has known for decades.'),
    rifts: C('World', '◇ Rifts', 'Tears in the world, full of singing glass. Rift-beasts crawl out of them. Most of them were not accidents.'),
    handler: C('World', '🎧 Handlers', 'The people who run heroes: dispatch, tactics, a calm voice on comms. Most have no Spark. That turned out to matter a great deal.'),
    prism: C('World', '🔷 The Prism', 'A glass-worshipping cult that served the Glazier during Arc One. Mirror masks. Very dramatic.'),
    shibuya: C('History', '🏙 The Shibuya Rift', 'Eight years ago a Rift swallowed Shibuya. Squad One went in. Only their Handler came out. In the Board\'s files it is listed as *Harvest Site 7*.'),
    squadone: C('History', '① Squad One', 'Handlers Kyouya Aoi and Aya Takamine; heroes Rin Aoi, Daichi, Mei and Tomo; rescue support Natsuki Amane. Sent into Shibuya not to save anyone, but to collect Rift glass.'),
    board: C('The Board', '🏛 The HALO Board', 'Twelve seats. Owns HALO\'s charter, its funding, and every license chip ever made. For forty years nobody asked what it did in the evenings.'),
    command: C('The Board', '🗣 Absolute Command', 'Chairman Kuroda\'s power. Anyone carrying Rift glass, every Spark, every license chip, must obey his voice. It has never worked on the Handler.'),
    chips: C('The Board', '🔘 License Chips', 'Implanted in every licensed hero, officially for tracking. Cut from Rift glass. A leash for Kuroda\'s voice. Rin can shatter them with one note.'),
    harvest: C('The Board', '📁 Project Spark Harvest', 'Twenty years of deliberately opened Rifts. Rift light creates Sparks in one person out of ten thousand. The Board recorded everyone else as *acceptable input*.'),
    solace: C('The Board', '🩹 Project SOLACE', 'A Board program to engineer a medic who takes soldiers\' wounds into her own body. Its only surviving subject ran away at sixteen and became Mira Solace.'),
    aegis: C('The Board', '✴ Aegis', 'The Board\'s elite hero unit. Gold hard light and perfect obedience. Now a rescue unit. They wear orange.'),
    sectorzero: C('The Board', '🔒 Sector Zero', 'A Board black site four hundred meters under the harbor, where the things that are not written down are kept.'),
    engine: C('The Board', '⚙ The Ascension Engine', 'A machine that tunes Rift light to every human being in the city at once. It needed a tuning fork: the most Rift-saturated Spark alive.'),
    ascension: C('The Board', '☀ Ascension', 'Kuroda\'s dream: every citizen given a Spark in one dawn. One in ten thousand would have woken up. He called that freedom.'),
    glasssnow: C('Events', '❄ The Glass Winter', 'In the last week of August, glass snow fell on Neo-Tokyo. It chimed on the ground and never melted: the Ascension Engine, warming up.'),
    konbini: C('Events', '🏪 Konbini Dispatch', 'For three nights Squad Zero answered the city\'s calls from the stockroom of a 24-hour convenience store. Mr. Oba kept the pudding stocked.'),
    stellar: C('Events', '🎤 The Starlight Dome Broadcast', 'Sora Hoshino sang her own song to twelve million people while B.I.T. uploaded Project Harvest to every screen. The Board ended that night.')
  };
  // codex entries unlocked when a chapter starts
  STORY.codexAt = { 1: ['halo', 'handler', 'sparks', 'notebook', 'c_aya', 'c_bit'], 2: ['prism'], 3: ['rifts'], 5: ['shibuya', 'c_kyouya'] };

  // ---------- scene replay names ----------
  STORY.sceneNames = {
    promise_hikari: 'A Pinky Promise (Hikari)', promise_rei: 'Say My Name (Rei)', promise_mira: 'Sticky Note (Mira)', promise_sora: 'Unfinished Song (Sora)', promise_kaede: 'Hold (Kaede)', promise_squad: 'Midnight Roof (Squad)',
    eve_hikari: 'Four In, Four Out (Hikari)', eve_rei: 'Said Badly (Rei)', eve_mira: 'Not a Diagnosis (Mira)', eve_sora: 'The Last Verse (Sora)', eve_kaede: 'The Whole Race (Kaede)', eve_squad: 'Family, Part Two (Squad)',
    save_hikari: 'Into the Light (Hikari)', save_rei: 'Into the Light (Rei)', save_mira: 'Into the Light (Mira)', save_sora: 'Into the Light (Sora)', save_kaede: 'Into the Light (Kaede)', save_squad: 'Into the Light (Squad)',
    fin_hikari: 'Ending · Forever Partners', fin_rei: 'Ending · Out of the Shadows', fin_mira: 'Ending · Healing Hearts', fin_sora: 'Ending · Encore', fin_kaede: 'Ending · Slow Down', fin_squad: 'Ending · Found Family',
    end_hikari: 'Sunset Promise (Hikari)', end_rei: 'Twilight Confession (Rei)', end_mira: 'A Healer\'s Rooftop (Mira)',
    ev_bit: 'B.I.T.\'s Song', ev_rin_phone: 'The Genie Phone', ev_saeki_door: 'An Audit of Doors', ev_oba_pudding: 'Pudding for Fugitives', ev_shiori_note: 'A Sketch at the Gate', ev_snow_glass: 'Kazuo the Second', ev_natsuki_cook: 'Grey Curry', ev_shiori_sweets: 'Nineteen Puddings', ev_kyouya_letter: 'A Letter',
    ev_kaede_race: 'Race Day', ev_tetsu_door: 'The Door Budget', ev_sora_disguise: 'Sora in Disguise', ev_bit_glitch: 'B.I.T. Glitch', ev_squad_dinner: 'Squad Dinner'
  };

  // ---------- new heroes ----------
  Object.assign(STORY.profiles, {
    rin: { full: 'Rin Aoi', tag: '🔔 Resonance · Squad One', rows: [['Age', '17 (25 on paper)'], ['Codename', 'Echo'], ['Birthday', 'July 7']], bio: 'Squad One\'s youngest. Spent eight years inside the Shibuya Rift and came out the same afternoon, as far as she is concerned. Hears the note everything is tuned to, and hums it.', likes: 'Bubble tea, old idol songs, crêpes, phones with buttons, her brother' },
    natsuki: { full: 'Natsuki Amane', tag: '🔥 Thermal Immunity · Rescue', rows: [['Age', '45 (38, biologically)'], ['Codename', 'Salamander'], ['Birthday', 'May 3']], bio: 'Rescue specialist and Hikari\'s mother. Carried thirty-two people out of Shibuya. The Board kept her in stasis for seven years. Loud, warm, and furious about the price of ramen.', likes: 'Ramen, family photos, hard hats, embarrassing her daughter' },
    shiori: { full: 'Shiori Kagami', tag: '✴ Hard Light · Aegis Prime', rows: [['Age', '22'], ['Codename', 'Aegis Prime'], ['Birthday', 'January 16']], bio: 'Raised by the Board from the age of nine to lead its elite unit. Perfect discipline, perfect aim, and no idea what to order at a café. Adjusts her cuffs before an order she does not want to follow. Draws the city in secret.', likes: 'Sketchbooks, pudding (all nineteen kinds), rules that make sense' }
  });
  Object.assign(STORY.quips, {
    rin: { go: ['Echo, going. It\'s humming.', 'I hear it. Going.', 'Counting to a thousand.'], win: ['Shattered. Properly.', 'Perfect pitch.', 'Squad One style.'], lose: ['Off-key. Sorry.', 'I lost the note.', 'Ow. My ears.'] },
    natsuki: { go: ['Salamander, rolling.', 'Nobody gets left behind.', 'Hard hat on.'], win: ['Everybody out. Head count good.', 'That\'s how we did it in my day.', 'Still got it.'], lose: ['Stasis legs. Sorry, kid.', 'Tch. I\'m going back in.', 'Rusty. Very rusty.'] },
    shiori: { go: ['Aegis Prime, moving.', 'Shields up.', 'Understood.'], win: ['Objective secured.', 'Efficient.', '…That felt good. Is that allowed?'], lose: ['Unacceptable.', 'My error.', 'I will correct this.'] }
  });
  const baseSyn = STORY.synergy;
  STORY.synergy = (G, a, b) => {
    const k = [a, b].sort().join('|'), f = G.flags;
    switch (k) {
      case 'hikari|natsuki': return [.15, '+ Amane & Amane: same note, one octave apart'];
      case 'hikari|rin': return [.06, '+ Natsuki-senpai\'s girls'];
      case 'rin|sora': return [.08, '+ Harmony: two voices, one note'];
      case 'natsuki|tetsu': return [.07, '+ Rescue pros: nobody left in the rubble'];
      case 'rei|shiori': return f.restored ? [.1, '+ Shadow & Shield: grudging respect'] : [-.06, '− Rei and Shiori keep glaring at each other'];
      case 'hikari|shiori': return f.restored ? [.05, '+ Shiori caught her once. Hikari hasn\'t forgotten'] : [-.05, '− Hikari hasn\'t forgiven the monorail'];
      case 'kaede|natsuki': return [.05, '+ Natsuki can almost keep up with Kaede'];
      case 'mira|natsuki': return [.06, '+ Two people who run toward the wounded'];
      case 'rin|tetsu': return [.05, '+ Rin hums; Tetsu\'s steel rings in tune'];
      case 'kaede|shiori': return [.04, '+ Kaede keeps trying to race Shiori. Shiori keeps letting her win'];
    }
    return baseSyn(G, a, b);
  };
  Object.assign(STORY.items, {
    headphones: { n: 'Retro Headphones', p: 110, icon: '🎧', d: 'Big, clunky, eight years out of date. Somebody will love them.', love: 'rin', like: ['sora', 'kaede'] },
    frame: { n: 'Family Photo Frame', p: 90, icon: '🖼️', d: 'A silver frame with space for two photos.', love: 'natsuki', like: ['hikari', 'tetsu'] },
    pudding: { n: 'Deluxe Pudding Set', p: 60, icon: '🍮', d: 'Nineteen flavors. The konbini special.', love: 'shiori', like: ['hikari', 'sora', 'rin'] }
  });
  ['flower', 'tea'].forEach(k => { if (STORY.items[k]) STORY.items[k].like = (STORY.items[k].like || []).concat(k === 'flower' ? ['rin', 'natsuki', 'shiori'] : ['shiori', 'natsuki']); });
  const baseTrain = STORY.trainQuip, baseGift = STORY.giftLine;
  STORY.trainQuip = (h, sc) => {
    const lv = sc >= 7 ? 2 : sc >= 4 ? 1 : 0;
    const Q = { rin: ['I hit the wrong note and the target sneezed.', 'Found the rhythm. Nii-san would be proud.', 'Perfect pitch. Did you feel that?'], natsuki: ['Stasis knees. Don\'t laugh.', 'It\'s coming back. Slowly.', 'Ha. Tell Hikari her mom still has it.'], shiori: ['…Unacceptable. Again.', 'Within tolerance.', 'Flawless. …That was fun. Is that allowed?'] };
    return Q[h] ? Q[h][lv] : baseTrain(h, sc);
  };
  STORY.giftLine = (h, lv) => {
    const L = { rin: { 4: 'Headphones. Big ones. Like Squad One had. I\'m never taking them off.', 2: 'For me? Thank you, {name}.', 1: 'Oh. Thank you.' }, natsuki: { 4: 'A frame, for two photos. Me and Hikari. Kid, you\'re going to make me cry in the lobby.', 2: 'Aw. You\'re a sweetheart, Handler.', 1: 'Thanks, kid.' }, shiori: { 4: '…Nineteen. You bought all nineteen. I will eat them in order. With notes. Thank you.', 2: 'That is… kind. Thank you.', 1: 'Acknowledged. Thank you.' } };
    return L[h] ? L[h][lv] : baseGift(h, lv);
  };

  // ---------- phone texts (ch = earliest chapter; replies with `read` need that tell in the Notebook) ----------
  const P = STORY.phone;
  P.hikari.push({ ch: 3, msgs: ['It\'s 2 a.m. I\'m counting the ceiling tiles. There are 48.', '49 if you count the broken one.'], replies: [{ t: 'Count them with me. 1, 2, 3…', read: 'hikari_count', aff: 4, resp: ['…', '…four. five.', 'Okay. I think I can sleep now. Thank you for counting with me.'] }, { t: 'Go to sleep, Hikari.', aff: 1, resp: ['Okay. Fifty. Goodnight.'] }] });
  P.rei.push({ ch: 3, msgs: ['I am on the roof.', 'It is raining.', 'I have no reason to tell you this.'], replies: [{ t: 'You\'re about to tell me why.', read: 'rei_scarf', aff: 4, resp: ['…', 'I am standing here because it is the one place no one asks anything of me.', 'You did not ask. I am grateful.'] }, { t: 'Enjoy the rain.', aff: 2, resp: ['I am.'] }] });
  P.mira.push({ ch: 3, msgs: ['Done with the med bay. Everything is spotless.', 'I reorganized the entire drug cabinet. Twice.', 'It\'s fine. I\'m fine.'], replies: [{ t: 'Spotless is how I know you\'re not. Come up to the roof.', read: 'mira_tidy', aff: 4, resp: ['…', 'You\'re very annoying and very right.', 'Bringing tea.'] }, { t: 'Get some rest, doctor.', aff: 1, resp: ['Yes. Resting. Totally.'] }] });
  P.kaede.push({ ch: 4, msgs: ['not tapping my foot', 'for the record', 'im just standing here', 'its fine'], replies: [{ t: 'Come sit with me.', read: 'kaede_heel', aff: 4, resp: ['…', 'where', 'ok. coming. dont say anything.'] }, { t: 'Go for a run, then.', aff: 1, resp: ['lol obviously'] }] });
  P.sora.push({ ch: 4, msgs: ['hey', 'you know the song i hum when nobody is around?', 'i found out its a jingle for a cereal ad. i was 6.'], replies: [{ t: 'Hum it for me.', read: 'sora_stage', aff: 4, resp: ['lol no', '…okay one bar', '[voice message: 3 seconds of someone humming, flat, delighted]'] }, { t: 'That\'s adorable.', aff: 2, resp: ['dont tell anyone'] }] });
  P.rin = [
    { msgs: ['{name}. I figured out texting.', 'This is texting, right?', 'HELLO.'], replies: [{ t: 'You\'re texting. Welcome to the future.', aff: 2, resp: ['The future has so many small pictures.', '🔔🔔🔔'] }, { t: 'Go to sleep, Rin.', aff: 1, resp: ['The alarm is set. For seven. Not eight years.'] }] },
    { msgs: ['I can\'t sleep.', 'What if I wake up and it\'s another eight years.'], replies: [{ t: 'Then I\'ll be here. With two wrinkles.', aff: 3, resp: ['Okay.', 'Goodnight, Handler.'] }, { t: 'Want me to text you at seven?', aff: 3, resp: ['Yes please.', 'Thank you.'] }] },
    { ch: 6, msgs: ['I hummed at the radiator today.', 'It hummed back.', 'I think we\'re friends.'], replies: [{ t: 'Tell me what note it is.', read: 'rin_hum', aff: 3, resp: ['A. Slightly flat.', 'Like you when you\'re tired.', 'That was a joke. I am practicing jokes.'] }, { t: 'Say hi from me.', aff: 2, resp: ['It says hi.'] }] },
    { ch: 9, msgs: ['I broke everyone\'s chips today.', 'It hurt them.', 'I hate that it hurt them.'], replies: [{ t: 'It set them free. That\'s what they will remember.', aff: 3, resp: ['…okay.', 'I hope so.'] }, { t: 'You were so brave.', aff: 2, resp: ['I was frightened the whole time.', 'Is that what brave is?'] }] }
  ];
  P.natsuki = [
    { ch: 10, msgs: ['HANDLER', 'HOW DO I TURN OFF THE CAPITAL LETTERS', 'IS IT THIS BUTTON'], replies: [{ t: 'It\'s the arrow key. You\'ll get it.', aff: 2, resp: ['got it!!!!', 'oh no now it\'s all small'] }, { t: 'Goodnight, Natsuki.', aff: 1, resp: ['NIGHT KID'] }] },
    { ch: 10, msgs: ['Hikari fell asleep on my shoulder.', 'She\'s nineteen now.', 'I can\'t move my arm and I never want to.'], replies: [{ t: 'Then don\'t move.', aff: 3, resp: ['wasn\'t planning to', 'goodnight, Handler'] }, { t: 'Take a photo.', aff: 2, resp: ['already took 40'] }] }
  ];
  P.shiori = [
    { ch: 11, msgs: ['This is Kagami.', 'I am told texting at night is "normal."', 'Good evening.'], replies: [{ t: 'Good evening, Shiori.', aff: 2, resp: ['…', 'That was pleasant. I will do it again tomorrow.'] }, { t: '(Send a pudding emoji.)', aff: 2, resp: ['🍮', 'I have acquired emojis.'] }] },
    { ch: 11, msgs: ['I drew the roof tonight.', 'Everyone was on it.', 'I left a space for me. I did not know whether to fill it.'], replies: [{ t: 'Fill it. You belong there.', aff: 4, resp: ['……', 'Filled.'] }, { t: 'Send me the drawing?', aff: 2, resp: ['[a pencil sketch of the HALO rooftop, one figure drawn very small in the corner]'] }] },
    { ch: 11, msgs: ['I noticed that I adjust my cuffs before orders.', 'I have been doing it for thirteen years.', 'Did you also notice.'], replies: [{ t: 'Left, then right. Before every order you disliked.', read: 'shiori_cuffs', aff: 4, resp: ['……', 'No one has ever noticed.', 'Thank you.'] }, { t: 'Not until you said.', aff: 1, resp: ['Understood.'] }] }
  ];
  const add = (who, ...convos) => { P[who] = (P[who] || []).concat(convos); };
  add('hikari', { ch: 6, msgs: ['Rin says Mom used to hum when she was scared.', 'I do that too.', 'Is that genetic or just weird.'], replies: [{ t: 'It\'s hers. Now it\'s yours.', aff: 3, resp: ['…', 'Okay. I\'m humming right now.'] }, { t: 'Hum for me sometime.', aff: 2, resp: ['No.', '…maybe.'] }] },
    { ch: 10, until: 12, msgs: ['Mom snores.', 'Exactly like me.', 'I can\'t stop crying about it.'], replies: [{ t: 'Happy crying?', aff: 3, resp: ['The happiest.', 'Goodnight, {name} ⚡'] }, { t: 'Now you know where you got it.', aff: 2, resp: ['Don\'t.'] }] });
  add('rei', { ch: 7, msgs: ['I wore the dress.', 'Delete the memory.'], replies: [{ t: 'Never.', aff: 3, resp: ['…', 'Fine. Keep that one. Only that one.'] }, { t: 'Deleted.', aff: 1, resp: ['Liar.', 'Goodnight.'] }] },
    { ch: 9, msgs: ['It is quiet without the chip.', 'I did not know it was loud until it stopped.'], replies: [{ t: 'You\'re free now, Rei.', aff: 3, resp: ['Yes.', 'Stay on the line a little.'] }, { t: 'Enjoy the quiet.', aff: 2, resp: ['I am.'] }] });
  add('mira', { ch: 9, msgs: ['My back is warm tonight.', 'The glass is quiet.', 'I think it\'s because someone held my hands.'], replies: [{ t: 'Anytime. Every time.', aff: 4, resp: ['…', 'Goodnight, {name} 💕'] }, { t: 'Rest, doctor.', aff: 2, resp: ['Yes, Handler 🩺'] }] });
  add('kaede', { ch: 9, msgs: ['two seconds', 'i keep counting two seconds'], replies: [{ t: 'We\'re getting her back. You\'ll be early.', aff: 3, resp: ['yeah', 'yeah i will'] }, { t: 'Come run it out with me tomorrow.', aff: 2, resp: ['ur so slow tho', '…ok'] }] });
  add('sora', { ch: 11, msgs: ['12 million people', 'my hands are shaking', 'text me something boring'], replies: [{ t: 'Onigiri restocking procedure, step one…', aff: 3, resp: ['lol', 'ok better. goodnight 🌟'] }, { t: 'You\'re going to be incredible.', aff: 3, resp: ['…only because you\'re listening'] }] });
  add('tetsu', { ch: 8, msgs: ['Handler, I fixed the stockroom shelf.', 'Mr. Oba cried.', 'I think we are friends now.'], replies: [{ t: 'You make friends everywhere, Tetsu.', aff: 2, resp: ['It is my Spark. Secretly. 🌳'] }, { t: 'Goodnight, Tetsu.', aff: 1, resp: ['Goodnight. 🌳'] }] },
    { ch: 5, msgs: ['The man at the hardware store was rude to Rin today.', 'I said "please step back from the cart."', 'Twice.'], replies: [{ t: 'Tetsu. Say "please" again and I\'ll call it in.', read: 'tetsu_polite', aff: 4, resp: ['…', 'You noticed that too.', 'I\'m fine. I only said please twice.'] }, { t: 'Good for you.', aff: 2, resp: ['Thank you. 🙂'] }] });
  const baseFallback = STORY.phoneFallback;
  STORY.phoneFallback = (who, G) => {
    const F = { rin: ['goodnight, Handler 🔔', 'alarm set for 7. not 8 years'], natsuki: ['NIGHT KID', 'EAT SOMETHING'], shiori: ['Goodnight.', 'This is a normal text.'] };
    return F[who] ? { msgs: F[who], replies: [{ t: 'Goodnight. See you tomorrow.', aff: 1, resp: ['👋'] }] } : baseFallback(who, G);
  };

  // ---------- HeroNet ----------
  const baseFeed = STORY.feed;
  STORY.feed = G => {
    const c = G.chap || 1, all = [];
    if (c >= 12) all.push({ u: 'Aya Takamine', h: '@HALO_Director', a: '◎', c: '#ff5a5a', t: 'HALO is back. No chips. No Board. Heroes, and one very tired Handler.', l: 2400000 }, { u: 'Deputy Saeki', h: '@saeki_official', a: '📎', c: '#b58aff', t: 'I have been asked to "post something fun." Here is a photograph of a door. It closes now.', l: 880000 });
    if (c >= 11) all.push({ u: 'Sora ⭐', h: '@stargazer', a: '⭐', c: '#c9b6ff', t: 'I sang the truth. Thank you for listening. This song is for the person in the dispatch van.', l: 9100000 }, { u: 'Shiori Kagami', h: '@aegis_prime', a: '✴', c: '#f2c14e', t: 'I have made an account. I do not know what to post. Here is a pudding.', l: 450000 }, { u: 'NeoTokyo News', h: '@NTNews', a: '📰', c: '#444', t: 'BOARD IN CRISIS: Seven members resign after the Starlight Dome leak. A second sun has appeared over Board Tower.', l: 3300000 });
    if (c >= 9) all.push({ u: 'NeoTokyo News', h: '@NTNews', a: '📰', c: '#444', t: 'GLASS WINTER: August snow enters its fourth day. The Board has declared martial law; only Aegis may respond to calls.', l: 540000 }, { u: '???', h: '@konbini_heroes', a: '🏪', c: '#6fffb0', t: 'Glass snow on your car? Heater broken? Call the konbini. Ask for aisle four.', l: 120000 });
    if (c >= 8) all.push({ u: 'NeoTokyo News', h: '@NTNews', a: '📰', c: '#444', t: 'Unlicensed heroes are answering calls across the city at night. Board: "Do not engage."', l: 210000 }, { u: 'mr_oba_konbini', h: '@oba_nightshift', a: '🍮', c: '#ffb45a', t: 'Pudding sales are up 400%. I will not be answering further questions.', l: 34000 });
    if (c >= 7) all.push({ u: 'HALO Board', h: '@HALO_Board', a: '🏛', c: '#555', t: 'Leadership transition at HALO. Acting Director Saeki will ensure efficiency and compliance.', l: 2100 }, { u: 'Hikari ⚡', h: '@thundergoddess', a: '⚡', c: '#ffcf3f', t: 'the tiny food at the gala was so good. also we are innocent. also tiny sushi', l: 62000 });
    if (c >= 6) all.push({ u: 'Rin 🔔', h: '@echo_rin', a: '🔔', c: '#9ff0ff', t: 'hello internet. i am told this is where you post food. [photo of ramen]', l: 18000 + G.day * 300 }, { u: 'NeoTokyo News', h: '@NTNews', a: '📰', c: '#444', t: 'Squad Zero saves Sumida Festival from "micro-Rift." Board demands custody of Rift survivor.', l: 150000 });
    return all.concat(baseFeed(G)).slice(0, 12);
  };
  STORY.credits = ['#HEARTLINE AGENCY', 'A Hero Handler Romance', '', '#Starring', 'Hikari Amane — Thunder Goddess', 'Rei Kurogane — Nightveil', 'Mira Solace — Halo Nurse', 'Kaede Mori — Gale', 'Tetsu Oda — Bulwark', 'Sora Hoshino — Stargazer', 'Rin Aoi — Echo', 'Natsuki Amane — Salamander', 'Shiori Kagami — Aegis Prime', '', 'Kyouya Aoi — The Glazier', 'Director Aya Takamine', 'Deputy Saeki', 'Chairman Genjirou Kuroda', 'Mr. Oba, Night Manager', 'B.I.T.', '', '#And', '{name} — the Handler', '', '#Pixel Art', 'Drawn live with the Moonkai Pixel Engine', '', '#Music & Sound', 'Live WebAudio synthesis', '', '#Thank you for playing', 'Nobody gets left behind.'];

  // ---------- arc-two dispatch content ----------
  STORY.calls.push(
    { t: 'Heatstroke on the Marathon Route', d: 'Two hundred runners, thirty-eight degrees, and a race director who refuses to cancel.', r: '0 4 3 5 3', n: 2, tier: 2, ch: 6, until: 8 },
    { t: 'Festival Stall Fire', d: 'A takoyaki grill exploded. The whole row of stalls is going up.', r: '2 5 4 2 2', n: 2, tier: 2, ch: 6, until: 7, ev: 'fire' },
    { t: 'Lost Kid at the Festival', d: 'A five-year-old in a goldfish yukata. Ten thousand people. One extremely worried grandmother.', r: '0 1 3 5 3', tier: 1, ch: 6, until: 7 },
    { t: 'Rip Current — Shonan Beach', d: 'Four swimmers dragged out past the flags. The lifeguard is one of them.', r: '1 5 6 2 2', n: 2, tier: 3, ch: 6, until: 8 },
    { t: 'Echo Beast in the Subway', d: 'A glass creature that copies the sound of trains. Commuters keep boarding it.', r: '5 3 3 1 5', n: 2, tier: 3, ch: 6, ev: 'echo' },
    { t: 'Board Drone Malfunction', d: 'A Board surveillance drone is chasing a pigeon through a shopping arcade at 90 km/h.', r: '2 1 4 1 5', tier: 2, ch: 7, ev: 'hack' },
    { t: 'Protest at Board Tower', d: 'Ten thousand people want answers. Board security wants them gone. It is about to turn.', r: '2 4 2 8 3', n: 2, tier: 3, ch: 7, ev: 'crowd' },
    { t: 'Aegis Checkpoint Standoff', d: 'An Aegis checkpoint will not let an ambulance through without "authorization."', r: '3 3 2 6 5', n: 2, tier: 3, ch: 8, until: 10, ev: 'aegis' },
    { t: 'Glass Snow Pileup — Expressway', d: 'Forty cars slid on glass snow. The expressway is a sculpture garden now.', r: '4 6 3 3 3', n: 3, tier: 3, ch: 9, until: 10, ev: 'frost' },
    { t: 'Frozen Harbor Ferry', d: 'The morning ferry is frozen into the bay with 300 people aboard and no heat.', r: '3 7 4 5 3', n: 3, tier: 4, ch: 9, until: 10, ev: 'frost' },
    { t: 'Heater Fire — Old Town Apartments', d: 'Everyone plugged in a space heater at once. In August. The wiring disagreed.', r: '2 5 4 3 3', n: 2, tier: 2, ch: 9, until: 10, ev: 'fire' },
    { t: 'Rift Frost on the Monorail', d: 'Glass frost is creeping along the monorail rails. The morning train is due in ten minutes.', r: '3 4 5 2 6', n: 2, tier: 3, ch: 9, until: 11, ev: 'frost' },
    { t: 'Frozen Heroes — Akiba', d: 'A dozen licensed heroes froze mid-rescue when the Engine hummed. Their civilians are still in danger.', r: '5 6 4 5 4', n: 3, tier: 4, ch: 11, ev: 'command' },
    { t: 'Board Loyalist Barricade', d: 'The last Board loyalists have barricaded a hospital "for its protection." The patients disagree.', r: '6 4 3 6 4', n: 3, tier: 4, ch: 11, ev: 'aegis' },
    { t: 'Rift Rain — Rooftop Garden', d: 'Drops of Rift light are falling on a rooftop kindergarten.', r: '3 6 5 5 4', n: 2, tier: 3, ch: 11, ev: 'glassbloom' }
  );
  Object.assign(STORY.callEvents, {
    echo: { q: 'The glass creatures copy every attack thrown at them. They hum the same note, louder and louder.', o: [['int', 6, 'Change tactics every hit, never the same twice', 'They cannot copy what they have not seen. They shatter.', 'The pattern repeats. They copy it.'], ['cha', 6, 'Hum the counter-note and drown them out', 'The humming falters. The beasts fall apart.', 'Your hero loses the note.'], ['com', 7, 'Hit harder than they can copy', 'Too much for them to mirror. Glass everywhere.', 'They mirror it back. Ouch.']] },
    aegis: { q: 'Aegis troopers arrive in gold light: "This is a Board operation. Stand down."', o: [['cha', 6, 'Talk to them. Point at the civilians.', 'The troopers hesitate, then quietly help.', 'They order your heroes off the scene.'], ['mob', 6, 'Finish the rescue before they can stop you', 'Done and gone before Aegis finishes the sentence.', 'Aegis cuts them off.'], ['int', 6, 'Show them the Harvest files on your phone', 'One trooper reads it. Then another. They step aside.', 'They do not believe it.']] },
    frost: { q: 'The glass frost is climbing people\'s legs. It spreads fast in the cold.', o: [['vig', 7, 'Break people out by hand', 'Hands bleeding, but everyone is free.', 'The frost is too fast.'], ['int', 6, 'Find the frost\'s resonance point and crack it', 'One precise hit. The frost shatters like sugar glass.', 'Wrong spot. It thickens.'], ['cha', 6, 'Keep everyone calm and moving', 'Nobody panics. Nobody gets caught.', 'Panic spreads faster than frost.']] },
    command: { q: 'Kuroda\'s voice booms from every speaker: "Be still." The licensed heroes on scene freeze. Only yours move.', o: [['vig', 7, 'Carry the frozen heroes and the civilians out', 'Two trips. Everyone out, heroes included.', 'Too many to carry.'], ['cha', 7, 'Shout over the speakers and remind them who they are', 'One frozen hero blinks. Then moves. Then another.', 'The voice is too loud.'], ['int', 7, 'Cut the speaker lines', 'Silence. The heroes wake up confused but free.', 'Wrong cable.']] },
    festival: { q: 'Fireworks are turning to glass in the sky and falling on the crowd.', o: [['com', 6, 'Shoot the glass down before it lands', 'A shower of harmless sparkles.', 'Some of it gets through.'], ['cha', 6, 'Get everyone under the stalls', 'Ten thousand people hide under takoyaki awnings. Nobody is hurt.', 'Nobody can hear.']] }
  });

  // ---------- achievements ----------
  STORY.ach = {
    ch5: ['Operation Heartline', 'Clear Chapter 5'], ch6: ['Echo', 'Clear Chapter 6'], ch7: ['The Board', 'Clear Chapter 7'], ch8: ['Rogue', 'Clear Chapter 8'], ch9: ['Winter of Glass', 'Clear Chapter 9'], ch10: ['Prisoners', 'Clear Chapter 10'], ch11: ['Broken Halo', 'Clear Chapter 11'],
    arc1: ['End of Arc One', 'Close the Shibuya Rift'], rin_join: ['Eight Years Late', 'Recruit Rin Aoi'], unchained: ['Unchained', 'Break the license chips'], reunion: ['Out for Ramen, Back Soon', 'Bring Natsuki Amane home'],
    defect: ['Shield Turned', 'Shiori joins Squad Zero'], immune: ['No Spark, No Strings', 'Take the Chairman\'s microphone'], trueend: ['Everybody Comes Home', 'See the true ending'],
    route_kaede: ['Wind Heart', 'See Kaede\'s ending'], festival: ['Fireworks', 'Watch the festival fireworks with someone'],
    notebook: ['Volume 38', 'Log six tells in the Notebook'], tell_all: ['Everyone Gives Themselves Away', 'Log every hero\'s tell']
  };
})();

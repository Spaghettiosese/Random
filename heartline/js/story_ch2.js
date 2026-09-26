/* HEARTLINE AGENCY — Chapters 2 & 3, post-shift beats. */
Object.assign(STORY.scripts, (() => {
  const H = 'hikari', R = 'rei', M = 'mira', A = 'aya', B = 'bit', K = 'kaede', T = 'tetsu', SO = 'sora', GZ = 'glazier', KY = 'kyouya';
  const S = {};
  const good = G => G.last && ['S', 'A', 'B'].includes(G.last.grade);

  // ---------- Chapter 1 post-shift beats ----------
  S.ch1_after1 = [
    ['bg', 'ops'], ['music', 'hq'], ['show', M, 'smile', 'default', 'r'],
    ['say', M, "And that's a wrap on your first shift! Grade *{grade}*. Not bad for someone who was stocking onigiri two days ago."],
    ['show', H, 'happy', 'wave', 'l'],
    ['say', H, "{name}! That was SO fun! Having you on comms is like having a cheat code!"],
    ['say', R, "…You kept me waiting at the Akiba call for four minutes. Don't do it again.", 'cold', 'cross'],
    ['say', M, "Heroes who worked today are tired. Evenings are for recovering — and for getting to know them.", 'tender', 'shy'],
    ['hideall']
  ];
  S.ch1_after2 = [
    ['bg', 'ops'], ['music', 'mystery'], ['show', A, 'cold', 'cross', 'c'],
    ['if', G => G.flags.c1_spores > 0, [
      ['say', A, "The harbor vent is sealed. Clean work."],
      ['say', A, "…The spores were cut glass under the microscope. Someone *made* them.", 'think', 'think']
    ], [
      ['say', A, "The harbor spores spread three blocks before the fire department contained them.", 'cold'],
      ['say', A, "Under the microscope, they were cut glass. Manufactured. Keep your eyes open, Handler.", 'think', 'think']
    ]],
    ['hideall']
  ];

  // ======================= CHAPTER 2 =======================
  S.ch2 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 2', 'Glass Hearts'],
    ['chapter', 2, 'Ch.2 Glass Hearts', 'Mirror Mall Gala', 8],
    ['bg', 'hq_lobby'], ['music', 'hq'], ['fx', 'dust'],
    ['n', 'One week after the Harbor Incident.'],
    ['show', B, 'happy', '', 'l'],
    ['say', B, "Handler! Squad Zero is TRENDING! #ThunderAndShadow has 2.4 million posts! One is a drawing of you as a sad onigiri!"],
    ['me', "…Why am I an onigiri."],
    ['say', B, "You are the rice that holds the team together. It is a metaphor. It is very popular.", 'smug'],
    ['show', A, 'neutral', 'cross', 'r'],
    ['say', A, "Popularity means requests. Requests mean more calls than two heroes can answer."],
    ['say', A, "So Squad Zero is getting two transfers. Try not to break them.", 'smug'],
    ['hideall'],
    ['bg', 'training'], ['music', 'daily'],
    ['sfx', 'whoosh'], ['show', K, 'smug', 'hip', 'l'],
    ['say', K, "Yo. So THIS is the famous Squad Zero. Smaller than I thought."],
    ['know', K],
    ['say', K, "Kaede Mori. Codename *Gale*. Fastest hero in the academy class — which means faster than *her*.", 'smug', 'point'],
    ['show', H, 'surprised', 'default', 'r'],
    ['say', H, "K-Kaede?! What are YOU doing here?!"],
    ['say', K, "Transferred. Somebody has to keep up with the Thunder Goddess. Oh wait — nobody can. Except me.", 'smug', 'hip'],
    ['say', H, "She beat me at EVERYTHING at the academy. Races. Grades. Lunch lines. EVERYTHING.", 'pout', 'fist'],
    ['say', K, "I also beat you at not getting suspended.", 'cold', 'cross'],
    ['sfx', 'rumble'], ['shake', 5],
    ['show', T, 'sweat', 'shy', 'c'],
    ['say', T, "Ah — sorry. Sorry! The doorframes here are low. I, um. Dented it."],
    ['know', T],
    ['say', T, "Tetsu Oda. *Bulwark*. My skin turns to steel. I used to do construction, before the Spark.", 'smile', 'default'],
    ['say', T, "I brought pastries for the team. They're slightly crushed. I'm told I hug the box too hard.", 'sweat', 'shy'],
    ['choice', [
      { t: "“Kaede, speed like yours changes everything on the map. Glad you're here.”", aff: { kaede: 3 }, then: [['say', K, "…Finally, someone with taste.", 'smug', 'hip'], ['say', K, "Don't expect compliments back, though.", 'blush', 'cross']] },
      { t: "“Tetsu, thanks for the pastries. Crushed ones taste the same.”", aff: { tetsu: 3 }, then: [['say', T, "That's what I always say! You get it, Handler.", 'happy', 'default']] },
      { t: "“Kaede. Hikari's part of this team. Keep the rivalry out of the field.”", aff: { hikari: 2, kaede: -1 }, then: [['say', K, "Tch. Fine. *Boss*.", 'pout', 'cross'], ['say', H, "…Thanks, {name}.", 'tender', 'shy']] }
    ]],
    ['hideall'], ['recruit', K], ['recruit', T],
    ['show', B, 'happy', '', 'c'], ['sfx', 'beep'],
    ['say', B, "Roster updated! Four heroes means bigger calls — some need two or three heroes at once."],
    ['say', B, "Warning: Kaede + Hikari synergy is currently… negative. They keep racing each other to the scene. Beep.", 'sad'],
    ['hideall'],
    ['daycard'],
    ['shift', { title: 'Day 5 · New Blood', calls: 9, tiers: [1, 2], diff: 1.1 }],
    ['call', 'ch2_after5'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch2_day6'],
    ['shift', { title: 'Day 6 · Art Crimes', calls: 9, tiers: [1, 3], diff: 1.15, special: [{ at: 150, t: 'Prism Art Crime — Akiba Station', d: 'Masked figures are turning a train platform to glass. Civilians trapped behind the crystal!', r: '5 3 3 3 3', n: 3, tier: 3, dist: 'akiba', flag: 'c2_prism', ev: 'prism' }] }],
    ['call', 'ch2_after6'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch2_day7'],
    ['shift', { title: 'Day 7 · Star Guard', calls: 10, tiers: [1, 3], diff: 1.2, special: [{ at: 230, t: 'STELLAR Concert — Crowd Surge', d: "Sora Hoshino's charity concert. The crowd is surging toward the stage. Keep 20,000 fans safe.", r: '2 4 2 8 3', n: 3, tier: 3, dist: 'uptown', flag: 'c2_concert', ev: 'crowd' }] }],
    ['call', 'ch2_after7'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['jump', 'ch2_climax']
  ];
  S.ch2_after5 = [
    ['bg', 'ops'], ['music', 'daily'],
    ['show', K, 'smug', 'hip', 'l'], ['show', H, 'pout', 'fist', 'r'],
    ['say', K, "I got to the Riverside call forty seconds before you. Just saying."],
    ['say', H, "Because you were RUNNING ON THE ROOFS. There's a *path*, Kaede!", 'angry', 'fist'],
    ['show', T, 'smile', 'default', 'c'],
    ['say', T, "They do this a lot, don't they."],
    ['me', "Every second of every day."],
    ['say', T, "Hm. My little sisters were the same. They're best friends now. It took a flood and a stolen bicycle.", 'happy', 'default'],
    ['hideall']
  ];
  S.ch2_day6 = [
    ['bg', 'ops'], ['music', 'mystery'], ['tint', null],
    ['show', M, 'scared', 'default', 'r'],
    ['say', M, "{name}, look at the news feed. Something happened overnight."],
    ['n', 'On the main screen: the bronze statue in Ueno Park — turned entirely to glass. A perfect, gleaming replica. On its base, a painted symbol: a triangle splitting light into colors.'],
    ['say', M, "Eleven incidents like this since the harbor. The press is calling them *Prism*. People in glass masks, turning things to crystal.", 'sad'],
    ['sfx', 'glass'], ['flash', '#9ff'], ['music', null],
    ['cg', 'cg_glazier'], ['fx', 'glass'], ['know', GZ],
    ['n', 'The screen flickers. Every monitor in the room goes white — then shows a silhouette made of broken light.'],
    ['say', GZ, "Good morning, HALO. Good morning, Squad Zero. And good morning to the Handler with no Spark."],
    ['say', GZ, "Everything beautiful is fragile. I'm simply making that… visible."],
    ['say', GZ, "Enjoy your calls today. Some of them are mine."],
    ['cgoff'], ['fx', null], ['sfx', 'shatter'],
    ['show', A, 'determined', 'cross', 'l'],
    ['say', A, "…Trace it.", 'cold'],
    ['say', M, "Already tried. It bounced through sixty relays. Whoever this is, they know HALO's systems.", 'scared'],
    ['say', A, "Then we answer every call, and we answer them well. Handler — you're up.", 'determined', 'point'],
    ['hideall']
  ];
  S.ch2_after6 = [
    ['bg', 'ops'], ['music', 'mystery'],
    ['if', G => G.flags.c2_prism > 0, [
      ['show', T, 'smile', 'cross', 'c'],
      ['say', T, "We caught one of the masked ones at Akiba. He didn't fight. He just kept smiling."],
      ['say', T, "He said, “The Glazier sees your Handler.” Then his mask turned to sand.", 'sad', 'default']
    ], [
      ['show', K, 'pout', 'cross', 'c'],
      ['say', K, "They got away at Akiba. Walked into a *mirror* and just — gone. I was two seconds late. Two!", 'angry', 'fist'],
      ['say', K, "…That doesn't happen to me.", 'sad', 'default']
    ]],
    ['t', "The Glazier. A name for the voice. Someone who knows HALO from the inside."],
    ['hideall']
  ];
  S.ch2_day7 = [
    ['bg', 'hq_lobby'], ['music', 'daily'], ['tint', null],
    ['show', H, 'surprised', 'shy', 'l'],
    ['say', H, "{name}. {name}. {name}. Don't look. Don't look behind you. Okay LOOK."],
    ['sfx', 'chime'], ['fx', 'hearts'],
    ['show', SO, 'happy', 'wave', 'r'],
    ['say', SO, "Hiii~! Is this Squad Zero? I'm looking for the Handler with no Spark!"],
    ['know', SO],
    ['say', SO, "Sora Hoshino, from STELLAR Agency! Gravity-type, idol-type, very-tired-of-being-idol-type. Nice to meet you!", 'smile', 'hip'],
    ['say', H, "SHE'S SORA HOSHINO. SHE HAS FOUR PLATINUM SINGLES. SHE CAN MAKE A BUS FLOAT.", 'love', 'fist'],
    ['say', SO, "Aww. It was a small bus. More of a van.", 'blush', 'shy'],
    ['say', SO, "I'm doing a charity concert tonight and the Glazier sent a threat. My agency wants… the heroes everyone's talking about.", 'neutral', 'default'],
    ['say', SO, "And, um. Honestly? I wanted to meet the person who talked a trainee through a Tier-3 with a *puddle*.", 'smile', 'shy'],
    ['choice', [
      { t: "“We'll keep your fans safe. That's a promise.”", aff: { sora: 2 }, then: [['say', SO, "Promises from Handlers are serious business. I'm keeping it!", 'happy', 'wave']] },
      { t: "“You said you're tired of being idol-type. What did you mean?”", aff: { sora: 4 }, then: [['say', SO, "…Oh. You actually listened to that part.", 'surprised', 'default'], ['say', SO, "Nobody listens to that part.", 'tender', 'shy']] },
      { t: "“Hikari, breathe.”", aff: { hikari: 1, sora: 1 }, then: [['say', H, "I AM BREATHING. THIS IS WHAT MY BREATHING SOUNDS LIKE NOW.", 'love', 'fist'], ['say', SO, "Ehehe. You're cute.", 'laugh']] }
    ]],
    ['say', SO, "STELLAR is lending me to you for the day. Put me on the board — I can handle crowds better than anyone!", 'determined', 'fist'],
    ['recruit', SO], ['hideall']
  ];
  S.ch2_after7 = [
    ['bg', 'stage'], ['music', 'romance'], ['fx', 'hearts'],
    ['show', SO, 'smile', 'default', 'c'],
    ['if', G => G.flags.c2_concert > 0, [
      ['say', SO, "Twenty thousand people went home safe tonight. Because of your board. Because of you."],
      ['say', SO, "I sang the encore looking at the dispatch van. Did you notice? …You were probably busy.", 'blush', 'shy'],
      ['aff', SO, 2]
    ], [
      ['say', SO, "The crowd surge hurt some people tonight. The medics say it'll be okay, but…", 'sad', 'default'],
      ['say', SO, "My manager said, “At least the stream numbers were good.” …I hate that I'm used to that.", 'cry']
    ]],
    ['say', SO, "Hey, Handler. Can I stay on the board a few more days? The Glazier's gala threat is aimed at HALO, and… I want to help.", 'determined', 'fist'],
    ['hideall']
  ];

  S.ch2_climax = [
    ['autosave'], ['bg', 'ops'], ['music', 'tension'], ['tint', null], ['fx', null],
    ['n', 'Day 8. The Mirror Mall Gala — HALO\'s biggest charity night of the year.'],
    ['show', A, 'determined', 'cross', 'c'],
    ['say', A, "Six hundred guests. Half the City Safety Board. The Glazier promised to “make a masterpiece” tonight."],
    ['say', A, "Squad Zero is on site. You run it from the van. No heroics without your call. Understood?", 'cold', 'point'],
    ['hideall'],
    ['bg', 'mall'], ['music', 'mystery'], ['fx', 'dust'],
    ['n', 'The Mirror Mall. Eight floors of glass around a sunlit atrium. Tonight it glitters with chandeliers and cameras.'],
    ['sfx', 'glass'], ['shake', 8], ['flash', '#9ff'], ['music', 'action'], ['fx', 'glass'],
    ['n', 'Every exit door turns to crystal at once. Six hundred phones light up with the same message: *DON\'T MOVE. YOU\'RE PART OF THE ART NOW.*'],
    ['cg', 'cg_mall'], ['sfx', 'shatter'],
    ['say', GZ, "Welcome to my gallery. Tonight's piece is called *Everyone HALO Couldn't Save*."],
    ['say', GZ, "Handler. You'll understand, eventually. I sat in a van like yours once."],
    ['cgoff'],
    ['show', K, 'determined', 'fist', 'l'], ['show', H, 'determined', 'fist', 'r'],
    ['say', K, "He's right there on the mezzanine. I can reach him in two seconds."],
    ['say', H, "Kaede, NO — the floors are glass, he controls glass!", 'scared', 'shy'],
    ['eye', { prompt: 'Six hundred hostages, glass everywhere, and Kaede itching to run. What\'s the plan?', time: 10000, opts: [
      { t: "“Tetsu shields the crowd, Sora lifts the glass doors, Rei scouts the mirrors. Kaede — HOLD.”", ok: 1, set: 'm1', aff: { tetsu: 1, sora: 1 } },
      { t: "“Kaede, go! Grab him before he moves!”", aff: { kaede: 1 }, set: 'm_rush' },
      { t: "“Everyone stay put until backup arrives.”", timeout: 1 }
    ] }],
    ['if', G => G.flags.m1, [
      ['say', T, "Steel skin! Everybody behind me — I'm a wall now!", 'determined', 'cross'],
      ['n', 'Sora raises one hand. The crystal doors groan, then float off their hinges like soap bubbles. Guests stream out.'],
      ['say', K, "…Tch. Holding. HOLDING. You owe me, Handler.", 'pout', 'cross'],
      ['say', GZ, "Oh, well done. Then let's raise the stakes."]
    ], [
      ['say', K, "Finally! Watch this!", 'happy', 'point'], ['sfx', 'whoosh']
    ]],
    ['sfx', 'shatter'], ['shake', 12],
    ['n', 'The glass floor of the mezzanine dissolves. Kaede — already mid-dash toward the Glazier — drops through eight stories of open air.'],
    ['say', K, "—!!", 'scared', 'shy'],
    ['eye', { prompt: 'Kaede is falling. Only one hero can reach her. Who?', time: 7000, opts: [
      { t: "“HIKARI — lightning-step off the chandeliers!”", ok: 1, set: 'm2', aff: { hikari: 2, kaede: 2 } },
      { t: "“Sora — catch her with gravity!”", aff: { sora: 1 }, set: 'm2s' },
      { t: "“Tetsu, get under her!”", timeout: 1, aff: { tetsu: 1 } }
    ] }],
    ['letterbox', 1], ['speed', 1],
    ['if', G => G.flags.m2, [
      ['cg', 'cg_kaede_save'], ['sfx', 'thunder'], ['flash', '#fff'],
      ['n', 'A white-gold streak ricochets between three chandeliers. Hikari catches Kaede six meters above the fountain and lands in a spray of sparks.'],
      ['say', H, "Gotcha! …You're heavier than you look.", 'happy', 'fist'],
      ['say', K, "……You caught me.", 'surprised', 'shy'], ['set', 'hk_bond']
    ], [
      ['if', G => G.flags.m2s, [
        ['n', 'Sora strains — Kaede slows, slows, stops a meter above the floor. Then Sora\'s nose starts bleeding and they both drop the last meter.'],
        ['say', SO, "Ow. Ow. Gravity's heavier when you're scared.", 'sweat', 'shy']
      ], [
        ['n', 'Tetsu dives. Kaede hits steel instead of stone. Both of them crack the fountain in half.'],
        ['say', T, "…Are you okay? I'm okay. The fountain is not okay.", 'sweat', 'default']
      ]],
      ['say', H, "KAEDE! Are you hurt?!", 'scared', 'shy'], ['set', 'hk_bond']
    ]],
    ['cgoff'], ['speed', 0], ['letterbox', 0],
    ['show', GZ, 'cold', 'cross', 'c'],
    ['say', GZ, "Heroes catching heroes. How touching. That's exactly what they did eight years ago, too. Right up until they couldn't."],
    ['say', GZ, "Ask your Director about Shibuya, Handler. Ask her who sat in the van that night."],
    ['sfx', 'glass'], ['hide', GZ], ['fx', 'glass'],
    ['n', 'He steps backward into a mirror, and the mirror swallows him like water.'],
    ['bg', 'ops'], ['music', 'sad'], ['fx', null],
    ['do', G => { const sh = G.shifts.slice(-3), ok = sh.reduce((s, x) => s + x.ok, 0) / Math.max(1, sh.reduce((s, x) => s + x.total, 0)); G.score2 = Math.round(ok * 60 + (G.flags.m1 ? 20 : 0) + (G.flags.m2 ? 20 : 10)); }],
    ['show', A, 'cold', 'cross', 'c'],
    ['if', G => G.score2 >= 70, [
      ['say', A, "Zero casualties. Six hundred guests home. The Board is… impressed. Don't let it go to your head."]
    ], [
      ['say', A, "Fourteen injured. No deaths. The Board is asking why a Spark-less clerk runs my best squad.", 'cold'],
      ['say', A, "I told them to watch the footage. Do better, Handler.", 'neutral', 'point']
    ]],
    ['me', "He said to ask you about Shibuya. About who sat in the van."],
    ['say', A, "……", 'sad', 'default'],
    ['say', A, "Not tonight, {name}.", 'cold', 'cross'],
    ['hideall'],
    ['bg', 'rooftop'], ['tint', 'night'], ['music', 'romance'], ['fx', 'stars'],
    ['show', K, 'sad', 'default', 'l'], ['show', H, 'smile', 'default', 'r'],
    ['say', K, "At the academy, I trained until my legs bled because you were always *there*. Loud. Bright. Stupid powerful.", 'sad'],
    ['say', K, "I'm just fast. Fast isn't a Spark that saves people. It's a Spark that gets there first and watches.", 'cry'],
    ['say', H, "Fast is how you got to the mall before the doors sealed. Fast is how I had someone to catch.", 'tender', 'shy'],
    ['say', H, "Partners?", 'happy', 'wave'],
    ['say', K, "…Rivals. Who are partners. Sometimes. Shut up.", 'blush', 'cross'],
    ['aff', K, 2], ['aff', H, 1],
    ['show', SO, 'smile', 'shy', 'c'],
    ['say', SO, "Um. I called STELLAR. I told them I'm staying with Squad Zero — on loan, indefinitely. They were… loud about it.", 'sweat', 'shy'],
    ['say', SO, "So! Please take care of me, Handler!", 'happy', 'wave'],
    ['ach', 'ch2'], ['hideall'],
    ['recap'], ['jump', 'ch3']
  ];

  // ======================= CHAPTER 3 =======================
  S.ch3 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 3', 'Fractures'],
    ['chapter', 3, 'Ch.3 Fractures', 'Board Review', 12],
    ['bg', 'ops'], ['music', 'hq'],
    ['show', B, 'neutral', '', 'c'], ['sfx', 'beep'],
    ['say', B, "Good morning, Handler. Five heroes on the board today! Calls are up 40% since the gala."],
    ['say', B, "Also I have scheduled your dentist— ~bzzzt~ — dentist appointment. Beep.", 'surprised'],
    ['me', "…BIT? You glitched."],
    ['say', B, "I did not glitch. I have never glitched. Glitching is for toasters.", 'angry'],
    ['hideall'],
    ['daycard'],
    ['shift', { title: 'Day 9 · Full Board', calls: 10, tiers: [1, 3], diff: 1.25, special: [{ at: 180, t: 'Hostages — Old Town Bank', d: 'Three Prism members holding tellers inside the vault. Something about this call feels too clean.', r: '5 4 3 4 5', n: 3, tier: 3, dist: 'oldtown', flag: 'c3_trap1', ev: 'trap' }] }],
    ['call', 'ch3_after9'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch3_day10'],
    ['shift', { title: 'Day 10 · Under Review', calls: 11, tiers: [2, 3], diff: 1.3, special: [{ at: 140, t: 'Gas Leak — Industrial Park', d: 'Report of a toxic leak. The caller hung up before giving details.', r: '3 5 3 2 6', n: 2, tier: 3, dist: 'industrial', flag: 'c3_trap2', ev: 'trap' }] }],
    ['call', 'ch3_after10'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['shift', { title: 'Day 11 · Signal Hunt', calls: 11, tiers: [2, 3], diff: 1.3, special: [{ at: 200, t: 'Anonymous Tip — Riverside Warehouse', d: 'Someone says Prism is storing glass bombs here. BIT flagged it “low priority.” Why?', r: '4 3 5 2 6', n: 2, tier: 3, dist: 'riverside', flag: 'c3_tip', ev: 'warehouse' }] }],
    ['hub'], ['night'],
    ['call', 'ch3_day11'],
    ['jump', 'ch3_climax']
  ];
  S.ch3_after9 = [
    ['bg', 'medbay'], ['music', 'sad'],
    ['show', T, 'sad', 'default', 'l'], ['show', M, 'scared', 'default', 'r'],
    ['if', G => G.flags.c3_trap1 > 0, [
      ['say', T, "The bank hostages were mannequins. Glass mannequins. It was bait — the real Prism team was waiting on the roof."],
      ['say', T, "We got out because you read the room fast. But how did they know exactly who we'd send, and when?", 'think', 'think']
    ], [
      ['say', T, "The bank was a trap. They knew our entry point. They knew *everything*.", 'sad'],
      ['say', M, "Tetsu took a glass spike meant for Sora. Hold still — I'm almost done.", 'determined', 'shy'], ['sfx', 'heal']
    ]],
    ['say', M, "…There. Good as new.", 'smile'],
    ['t', "Mira's hands are shaking. She's pale — like the wound went somewhere else."],
    ['hideall']
  ];
  S.ch3_day10 = [
    ['bg', 'office'], ['music', 'mystery'], ['tint', null],
    ['show', A, 'cold', 'cross', 'c'],
    ['say', A, "Every Prism ambush this week happened exactly where we sent heroes. Our dispatch data is leaking."],
    ['say', A, "The Board has a suspect. The Spark-less outsider with access to every dispatch log.", 'cold', 'point'],
    ['me', "Me."],
    ['say', A, "You. You'll keep working — under review. In two days, the Board decides whether you keep your desk.", 'neutral', 'cross'],
    ['say', A, "…For what it's worth, I don't think it's you. I think it's someone who knows how HALO *thinks*.", 'sad', 'default'],
    ['hideall'],
    ['bg', 'ops'],
    ['show', R, 'cold', 'cross', 'l'],
    ['say', R, "I heard. The Board is full of cowards who've never stood in a shadow long enough to know what's in it."],
    ['say', R, "If they take your desk, I'm walking out with you. …Don't make it a big deal.", 'blush', 'cross'],
    ['aff', R, 1],
    ['show', K, 'smug', 'hip', 'r'],
    ['say', K, "Same. Also I'd just run in and steal the desk back.", 'smug', 'point'],
    ['hideall']
  ];
  S.ch3_after10 = [
    ['bg', 'medbay'], ['music', 'sad'], ['fx', null],
    ['n', "Evening. The med bay lights are low. Four heroes came back hurt today. Mira healed all of them."],
    ['sfx', 'heartbeat'], ['show', M, 'cry', 'default', 'c'],
    ['n', "She's on the floor beside bed three, curled around her own stomach. Where Tetsu's wound was."],
    ['say', M, "D-don't — don't call anyone. It passes. It always passes. I just take it for a while, that's all."],
    ['choice', [
      { t: 'Sit beside her and hold her hand until it passes.', aff: { mira: 3 }, then: [['n', "Twenty minutes. Her breathing slows. Her grip never loosens."], ['say', M, "…You're very bad at following instructions.", 'tender', 'shy']] },
      { t: "“You can't keep doing this alone. I'm changing the board — fewer injuries, more rest.”", aff: { mira: 2 }, set: 'mira_rule', then: [['say', M, "…You'd rebuild your whole strategy around my stomachache?", 'surprised'], ['me', "Around you."], ['say', M, "……", 'blush', 'shy']] }
    ]],
    ['hideall']
  ];
  S.ch3_day11 = [
    ['bg', 'apartment'], ['tint', 'night'], ['music', 'mystery'],
    ['n', "3 AM. Your apartment floor is covered in printouts — every leaked call, every ambush."],
    ['t', "The leaks don't come from the dispatch logs. They come from calls that were *routed* — sorted, prioritized, before I even saw them."],
    ['t', "There's only one thing that touches every call before I do."],
    ['eye', { prompt: 'Who routes every call before it reaches you?', time: 12000, opts: [
      { t: 'B.I.T.', ok: 1, set: 'suspect_bit' },
      { t: 'Director Takamine', set: 'suspect_aya' },
      { t: 'Mira, on operations support', timeout: 1, set: 'suspect_mira' }
    ] }],
    ['if', G => G.flags.suspect_bit, [['t', "BIT. It glitched on the first morning. It flagged the warehouse tip as low priority. It's been there since the harbor…"]],
      [['t', "No… that doesn't fit. Aya approved half those calls herself. Mira was in the med bay. Think."], ['t', "…BIT. It sorts every call first. It glitched this week. It's the only answer that fits."]]],
    ['t', "Tomorrow I test it. One shift, one fake priority tag. If Prism shows up… I'll know."],
    ['nextday'], ['daycard']
  ];

  S.ch3_climax = [
    ['autosave'],
    ['shift', { title: 'Day 12 · The Bait', calls: 10, tiers: [2, 3], diff: 1.3 }],
    ['bg', 'ops'], ['music', 'tension'],
    ['n', "17:04. The shift is over. The fake call you planted — “Squad Zero regroup at Riverside Pier 9” — went through only one system."],
    ['sfx', 'alarm'], ['shake', 5],
    ['show', M, 'scared', 'default', 'r'],
    ['say', M, "{name}! Riverside cameras — Prism just surrounded Pier 9! There's nobody there, but they came *ready*!"],
    ['show', B, 'surprised', '', 'l'],
    ['say', B, "That is statistically unlikely! Those coordinates were only in my routing buffer! Only I—"],
    ['say', B, "…only… I…", 'sad'],
    ['music', null], ['sfx', 'glass'], ['flash', '#f00'], ['shake', 10],
    ['cg', 'cg_bit'], ['fx', 'glass'],
    ['say', GZ, "Well done, Handler. You found my little window."],
    ['say', GZ, "A single shard from the harbor beast, lodged in your drone's core. It's been whispering to me ever since."],
    ['say', GZ, "Now — let's see how long your tower holds when every door opens at once."],
    ['sfx', 'alarm'], ['music', 'action'],
    ['n', "Every security door in HALO Tower slides open. On the cameras, glass-masked figures pour into the lobby."],
    ['eye', { prompt: 'BIT is infected, and it controls the tower. What do you do?', time: 11000, opts: [
      { t: "“BIT — it's me. Find the shard. Isolate it. I know you can fight it.”", ok: 1, set: 'bit_saved', aff: { mira: 1 } },
      { t: "“Mira — hard shutdown. Cut BIT's power.”", set: 'bit_shutdown' },
      { t: "“Rei, go into the server room and cut the shard out with your shadows!”", timeout: 1, set: 'bit_rei', aff: { rei: 1 } }
    ] }],
    ['if', G => G.flags.bit_saved, [
      ['say', B, "Hand— ~ler~ — I can see it. It's cold. It's shaped like a window.", 'sad'],
      ['say', B, "I am B.I.T. I handle schedules, data, and emotional support. I *reject* this input.", 'angry'],
      ['sfx', 'shatter'], ['flash', '#52e0ff'], ['cgoff'],
      ['n', "The red light in BIT's visor cracks — and turns blue again. Across the tower, every door slams shut."]
    ], [
      ['if', G => G.flags.bit_shutdown, [
        ['n', "Mira yanks the breaker. BIT's visor goes dark mid-word. The doors lock — but so do the elevators, the comms, and the lights."],
        ['cgoff'], ['say', M, "I'm sorry, BIT… I'm so sorry.", 'cry']
      ], [
        ['sfx', 'shadow'], ['n', "Rei vanishes into the floor. Seconds later, every screen flickers purple — and BIT's visor snaps back to blue, a sliver of black glass floating beside it."],
        ['cgoff'], ['set', 'bit_saved'], ['aff', R, 2]
      ]]
    ]],
    ['shift', { title: 'Day 12 · Tower Siege', start: 17, calls: 9, tiers: [2, 3], diff: 1.3, real: 240, special: [{ at: 60, t: 'Lobby Breach — Floor 1', d: 'Prism masks pouring through the main doors. Hold the lobby!', r: '8 6 3 2 3', n: 3, tier: 4, dist: 'uptown', flag: 'c3_lobby', ev: 'siege' }, { at: 260, t: 'Server Room — Floor 60', d: 'Someone is downloading HALO\'s sealed archives. Stop them!', r: '4 3 6 2 7', n: 2, tier: 4, dist: 'akiba', flag: 'c3_server' }] }],
    ['bg', 'office'], ['music', 'mystery'], ['fx', 'glass'],
    ['n', "Floor 80. The Director's office. The window wall has been turned to perfect, clear crystal. Someone is standing in front of it."],
    ['cg', 'cg_reveal'],
    ['say', GZ, "Hello, Aya."],
    ['show', A, 'surprised', 'default', 'l'],
    ['say', A, "…Kyouya."],
    ['know', KY],
    ['n', "White hair. A handler's coat, eight years out of date. A face that stopped aging the night everything broke."],
    ['say', KY, "Kyouya Aoi. Handler of Squad One. You can put it in your report, {name} — I'm sure Aya never did."],
    ['say', KY, "Five heroes. Shibuya Rift, eight years ago. The Board ordered them in. I sent them. Aya sat next to me."],
    ['say', KY, "They didn't die. I can hear them. They're still *inside*.", 'sad'],
    ['if', G => G.flags.c3_server > 0, [
      ['say', KY, "You stopped my download. Clever. It doesn't matter — I only needed to see one file.", 'smug']
    ], [
      ['say', KY, "And now I have the Rift schematics HALO sealed away. Thank you for the open door.", 'smug']
    ]],
    ['cgoff'], ['sfx', 'glass'],
    ['n', "He steps backward through the crystal window and falls, glittering, into the night."],
    ['hideall'],
    ['bg', 'office'], ['fx', null], ['music', 'sad'],
    ['show', A, 'sad', 'default', 'c'],
    ['say', A, "He was my partner. We ran Squad One together. He was the better Handler. Kinder. He learned every hero's favorite song."],
    ['say', A, "The Board ordered them into the Rift to stop it spreading. It worked. None of them came out. HALO called it a “heroic sacrifice” and sealed the files.", 'cry'],
    ['say', A, "Kyouya never stopped listening for them. I… stopped. I told myself that was being strong.", 'cry'],
    ['me', "The Shibuya Rift… that's the night Hikari's mother died."],
    ['say', A, "…Yes. She was a rescue worker. She carried out thirty-two people.", 'sad'],
    ['say', A, "The last person she carried out was Kyouya Aoi.", 'sad', 'cross'],
    ['t', "…Hikari."],
    ['show', B, 'sad', '', 'r'],
    ['if', G => G.flags.bit_saved, [['say', B, "Handler. I am sorry. I did not know I was a window. …Thank you for not closing me.", 'sad'], ['aff', M, 1]],
      [['n', "BIT's empty chassis sits on the desk. Mira has already started rebuilding it from backups. It will remember nothing of the last month."]]],
    ['hideall'],
    ['do', G => { G.goal = null; }],
    ['ach', 'ch3'],
    ['recap'], ['jump', 'ch4']
  ];
  return S;
})());

Object.assign(STORY.events, {
  ev_kaede_race: { day: 5, need: 'kaede', s: [
    ['bg', 'hq_lobby'], ['show', 'kaede', 'smug', 'point', 'l'], ['show', 'hikari', 'determined', 'fist', 'r'],
    ['say', 'kaede', "Race you to the vending machine. Loser buys."],
    ['say', 'hikari', "It's four meters away!", 'pout'],
    ['sfx', 'whoosh'], ['n', "Kaede wins. Hikari zaps the machine. Both drinks come out. Both of them claim victory."],
    ['aff', 'kaede', 1], ['aff', 'hikari', 1]
  ] },
  ev_tetsu_door: { day: 5, need: 'tetsu', s: [
    ['bg', 'hq_lobby'], ['sfx', 'rumble'], ['show', 'tetsu', 'sweat', 'shy', 'c'],
    ['say', 'tetsu', "Handler. Do we have a budget for doors? Asking for a friend. The friend is me."],
    ['do', G => { G.credits -= 40; }], ['n', "*Facility repairs: −¥40.*"], ['aff', 'tetsu', 1]
  ] },
  ev_sora_disguise: { day: 8, need: 'sora', s: [
    ['bg', 'cafe'], ['show', 'sora', 'smug', 'hip', 'c'],
    ['say', 'sora', "Disguise check! Sunglasses, hat, fake mustache. Totally anonymous, right?"],
    ['n', "Nineteen people are filming her."],
    ['choice', [{ t: "“Perfect. Nobody will ever know.”", aff: { sora: 2 }, then: [['say', 'sora', "I KNEW the mustache was the key.", 'laugh']] }, { t: "“…Sora, there's a line forming.”", aff: { sora: 1 }, then: [['say', 'sora', "Ah. Run?", 'sweat', 'shy'], ['sfx', 'whoosh']] }]]
  ] },
  ev_bit_glitch: { day: 9, s: [
    ['bg', 'ops'], ['show', 'bit', 'neutral', '', 'c'],
    ['say', 'bit', "Handler, your coffee is ready. ~Your coffee is ready.~ Your cof—fee is—"],
    ['say', 'bit', "…I have made you nine coffees. I don't know why. Beep?", 'sad'],
    ['t', "That's… not normal."]
  ] },
  ev_squad_dinner: { day: 13, need: 'sora', s: [
    ['bg', 'ramen'], ['music', 'daily'], ['show', 'tetsu', 'happy', 'default', 'l'], ['show', 'hikari', 'happy', 'wave', 'c'], ['show', 'sora', 'laugh', 'hip', 'r'],
    ['n', "Squad dinner at Ramen Raijin. Tetsu pays. Hikari eats six bowls. Sora signs the ceiling. Kaede and Rei argue about whether shadows count as a vegetable."],
    ['t', "For one hour, nobody talks about glass."],
    ['do', G => { G.roster.forEach(h => G.heroes[h].fat = Math.max(0, G.heroes[h].fat - 15)); }], ['n', "*Squad −15 Fatigue.*"]
  ] }
});

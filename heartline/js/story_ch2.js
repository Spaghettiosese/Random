/* HEARTLINE AGENCY — Chapters 2 & 3, post-shift beats. */
Object.assign(STORY.scripts, (() => {
  const H = 'hikari', R = 'rei', M = 'mira', A = 'aya', B = 'bit', K = 'kaede', T = 'tetsu', SO = 'sora', GZ = 'glazier', KY = 'kyouya';
  const S = {};
  const good = G => G.last && ['S', 'A', 'B'].includes(G.last.grade);

  // ---------- Chapter 1 post-shift beats ----------
  S.ch1_after1 = [
    ['bg', 'ops'], ['music', 'hq'], ['show', M, 'smile', 'default', 'r'],
    ['say', M, 'That\'s your first shift. Grade *{grade}*. Not bad for someone who was restocking onigiri forty-eight hours ago.'],
    ['show', H, 'happy', 'wave', 'l'],
    ['say', H, 'That was — I didn\'t know it could feel like that. You say the next thing, and I do the next thing. It\'s like having a map.'],
    ['say', R, 'You kept me on a train platform at Akiba for four minutes. With a shadow in each hand.', 'cold', 'cross'],
    ['say', M, 'The ones who worked today are going to be tired. Evenings are for recovering. And for getting to know each other, if you\'re up for it.', 'tender', 'shy'],
    ['hideall']
  ];
  S.ch1_after2 = [
    ['bg', 'ops'], ['music', 'mystery'], ['show', A, 'cold', 'cross', 'c'],
    ['if', G => G.flags.c1_spores > 0, [
      ['say', A, 'The harbor vent is sealed. Clean work.'],
      ['say', A, 'Under the microscope, the spores were cut glass. Someone made them.', 'think', 'think']
    ], [
      ['say', A, 'The harbor spores spread three blocks before the fire department contained them.', 'cold'],
      ['say', A, 'Under the microscope they were cut glass. Manufactured. Keep your eyes open, Handler.', 'think', 'think']
    ]],
    ['hideall']
  ];

  // ======================= CHAPTER 2 =======================
  S.ch2 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 2', 'Glass Hearts'],
    ['chapter', 2, 'Chapter 2 · Glass Hearts', 'Mirror Mall Gala', 8],
    ['bg', 'hq_lobby'], ['music', 'hq'], ['fx', 'dust'],
    ['n', 'One week after the Harbor Incident.'],
    ['show', B, 'happy', '', 'l'],
    ['say', B, 'Squad Zero is trending. The tag is #ThunderAndShadow. There are 2.4 million posts. One of them is a drawing of you as a sad onigiri.'],
    ['me', '…Why am I an onigiri.'],
    ['say', B, 'You are the rice that holds the team together. The artist was quite sincere about it.', 'smug'],
    ['show', A, 'neutral', 'cross', 'r'],
    ['say', A, 'Popularity means requests. Requests mean more calls than two heroes can answer.'],
    ['say', A, 'Two transfers are arriving this morning. Try not to break them.', 'wry'],
    ['hideall'],
    ['bg', 'training'], ['music', 'daily'],
    ['sfx', 'whoosh'], ['show', K, 'smug', 'hip', 'l'],
    ['say', K, 'Eleven minutes and forty seconds. That\'s how long it took you to get from the elevator to here. I timed it.'],
    ['know', K],
    ['say', K, 'Kaede Mori. Codename Gale. Fastest in my academy class, which means faster than *her*.', 'smug', 'point'],
    ['t', 'Her heel is tapping the floor, fast and constant. It has been going since I walked in.'],
    ['tell', K, 'heel', 'Taps her heel when she is waiting. When she is really hurt she goes quiet and slow, and that is the thing to be afraid of.'],
    ['show', H, 'surprised', 'default', 'r'],
    ['say', H, 'Kaede? What are *you* doing here?'],
    ['say', K, 'Transferred. Somebody needs to keep up with the Thunder Goddess. Well, nobody can. Except me.', 'smug', 'hip'],
    ['say', H, 'She beat me at everything at the academy. Races. Grades. The lunch line.', 'sulk', 'fist'],
    ['say', K, 'I also beat you at not getting suspended.', 'cold', 'cross'],
    ['sfx', 'rumble'], ['shake', 5],
    ['show', T, 'sweat', 'shy', 'c'],
    ['say', T, 'Sorry. Sorry — the doorframes here are low. I, uh. Dented it.'],
    ['know', T],
    ['say', T, 'Tetsu Oda. Codename Bulwark. My skin turns to steel. I did construction, before.', 'smile', 'default'],
    ['say', T, 'I brought pastries for the squad. They\'re slightly crushed. I\'m told I hold the box too tightly.', 'sweat', 'shy'],
    ['choice', [
      { t: '"Kaede, speed like yours changes everything on the map. Glad you\'re here."', aff: { kaede: 3 }, then: [['say', K, '…Finally, someone with taste.', 'smug', 'hip'], ['say', K, 'Don\'t expect compliments back.', 'blush', 'cross']] },
      { t: '"Tetsu, thank you for the pastries. Crushed ones taste the same."', aff: { tetsu: 3 }, then: [['say', T, 'That\'s exactly what I say. You get it.', 'happy', 'default']] },
      { t: '"Kaede. Hikari is part of this team. Keep the rivalry off the field."', aff: { hikari: 2, kaede: -1 }, then: [['say', K, 'Tch. Fine. Boss.', 'sulk', 'cross'], ['say', H, '…Thanks, {name}.', 'tender', 'shy']] }
    ]],
    ['hideall'], ['recruit', K], ['recruit', T],
    ['show', B, 'happy', '', 'c'], ['sfx', 'beep'],
    ['say', B, 'Roster updated. Four heroes means bigger calls. Some need two or three at once.'],
    ['say', B, 'Note: Kaede and Hikari have negative synergy. They keep racing each other to the scene.', 'sad'],
    ['hideall'],
    ['daycard'],
    ['shift', { title: 'Day 5 · New Blood', calls: 9, tiers: [1, 2], diff: 1.1 }],
    ['call', 'ch2_after5'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch2_day6'],
    ['shift', { title: 'Day 6 · Art Crimes', calls: 9, tiers: [1, 3], diff: 1.15, special: [{ at: 150, t: 'Prism Art Crime — Akiba Station', d: 'Masked figures are turning a train platform to glass. Civilians trapped behind the crystal.', r: '5 3 3 3 3', n: 3, tier: 3, dist: 'akiba', flag: 'c2_prism', ev: 'prism' }] }],
    ['call', 'ch2_after6'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch2_day7'],
    ['shift', { title: 'Day 7 · Star Guard', calls: 10, tiers: [1, 3], diff: 1.2, special: [{ at: 230, t: 'STELLAR Concert — Crowd Surge', d: 'Sora Hoshino\'s charity concert. The crowd is surging toward the stage. Twenty thousand people.', r: '2 4 2 8 3', n: 3, tier: 3, dist: 'uptown', flag: 'c2_concert', ev: 'crowd' }] }],
    ['call', 'ch2_after7'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['jump', 'ch2_climax']
  ];
  S.ch2_after5 = [
    ['bg', 'ops'], ['music', 'daily'],
    ['show', K, 'smug', 'hip', 'l'], ['show', H, 'sulk', 'fist', 'r'],
    ['say', K, 'I got to the Riverside call forty seconds before you. Just stating the number.'],
    ['say', H, 'Because you ran across the roofs. There is a *street*, Kaede.', 'angry', 'fist'],
    ['show', T, 'smile', 'default', 'c'],
    ['say', T, 'They do this a lot, don\'t they.'],
    ['me', 'Every minute of every day.'],
    ['say', T, 'Hm. My sisters were like that. They\'re best friends now. It took a flood and a stolen bicycle.', 'happy', 'default'],
    ['hideall']
  ];
  S.ch2_day6 = [
    ['bg', 'ops'], ['music', 'mystery'], ['tint', null],
    ['show', M, 'scared', 'default', 'r'],
    ['say', M, '{name}, look at the news feed. Something happened overnight.'],
    ['n', 'The main screen: the bronze statue in Ueno Park, turned entirely to glass. A perfect gleaming replica. On the base, a painted symbol: a triangle splitting light into colors.'],
    ['say', M, 'Eleven incidents like this since the harbor. The press is calling them Prism. People in glass masks, turning things to crystal.', 'tired'],
    ['sfx', 'glass'], ['flash', '#9ff'], ['music', null],
    ['cg', 'cg_glazier'], ['fx', 'glass'], ['know', GZ],
    ['n', 'The feed flickers. Every monitor in the room goes white, then shows a silhouette made of broken light.'],
    ['say', GZ, 'Good morning, HALO. Good morning, Squad Zero. And good morning to the Handler with no Spark.'],
    ['say', GZ, 'I\'m told this is where I introduce myself. I\'d rather you looked at the statue. It\'s lovely. Nobody will ever scratch it, or sell it, or forget it.'],
    ['say', GZ, 'That\'s all I\'m offering the city. Something that doesn\'t break.'],
    ['say', GZ, 'Some of your calls today are mine. Be kind to them.'],
    ['cgoff'], ['fx', null], ['sfx', 'shatter'],
    ['show', A, 'resolve', 'cross', 'l'],
    ['say', A, '…Trace it.', 'cold'],
    ['say', M, 'Already tried. It bounced through sixty relays. Whoever that is, they know HALO\'s systems.', 'scared'],
    ['say', A, 'Then we answer every call, and we answer them well. Handler, you\'re up.', 'resolve', 'point'],
    ['hideall']
  ];
  S.ch2_after6 = [
    ['bg', 'ops'], ['music', 'mystery'],
    ['if', G => G.flags.c2_prism > 0, [
      ['show', T, 'smile', 'cross', 'c'],
      ['say', T, 'We caught one of the masked ones at Akiba. He didn\'t fight. He just kept smiling.'],
      ['say', T, 'He said, "The Glazier sees your Handler." Then his mask turned to sand.', 'sad', 'default']
    ], [
      ['show', K, 'sulk', 'cross', 'c'],
      ['say', K, 'They got away at Akiba. Walked into a mirror. Gone. I was two seconds late. Two.', 'angry', 'fist'],
      ['say', K, '…That doesn\'t happen to me.', 'hurt', 'default']
    ]],
    ['t', 'The Glazier. A name for a voice. Somebody who knows how HALO works from the inside.'],
    ['hideall']
  ];
  S.ch2_day7 = [
    ['bg', 'hq_lobby'], ['music', 'daily'], ['tint', null],
    ['show', H, 'surprised', 'shy', 'l'],
    ['say', H, '{name}. Don\'t turn around. Don\'t look behind you. Okay look.'],
    ['sfx', 'chime'], ['fx', 'hearts'],
    ['show', SO, 'happy', 'wave', 'r'],
    ['say', SO, 'Hiii! Is this Squad Zero? I\'m looking for the Handler with no Spark!'],
    ['know', SO],
    ['say', SO, 'Sora Hoshino, STELLAR Agency. Gravity-type. Idol-type. Very tired. Nice to meet you!', 'smile', 'hip'],
    ['say', H, 'She\'s Sora Hoshino. She has four platinum singles. She once made a bus float.', 'love', 'fist'],
    ['say', SO, 'It was more of a van.', 'blush', 'shy'],
    ['say', SO, 'I\'m doing a charity concert tonight and the Glazier sent a threat. My agency wanted the heroes everyone\'s talking about.', 'neutral', 'default'],
    ['t', 'The smile hasn\'t moved her eyes once since she walked in. She is very good at it.'],
    ['say', SO, 'Sorry. That\'s the voice I use for rooms. Give me a second.', 'tired'],
    ['tell', SO, 'stage', 'Her stage smile never reaches her eyes. When she stops performing she hums, badly, out of tune.'],
    ['say', SO, 'Okay. Hi. I actually wanted to meet whoever talked a trainee through a Tier-3 with a puddle. That was good. I read the notebook.', 'smile', 'shy'],
    ['choice', [
      { t: '"We\'ll keep your fans safe. I promise."', aff: { sora: 2 }, then: [['say', SO, 'Handlers don\'t make promises lightly. Okay. I\'m writing that down.', 'happy', 'wave']] },
      { t: '"You said you were tired of being idol-type. What did you mean?"', aff: { sora: 4 }, then: [['say', SO, '…Oh. You listened to that part.', 'surprised', 'default'], ['say', SO, 'Nobody listens to that part.', 'tender', 'shy']] },
      { t: '"Hikari, breathe."', aff: { hikari: 1, sora: 1 }, then: [['say', H, 'I *am* breathing. This is what my breathing sounds like now.', 'love', 'fist'], ['say', SO, 'Mm. You\'re kind of nice.', 'laugh']] }
    ]],
    ['say', SO, 'STELLAR is lending me to you for the day. Put me on the board. I handle crowds better than anyone.', 'determined', 'fist'],
    ['recruit', SO], ['hideall']
  ];
  S.ch2_after7 = [
    ['bg', 'stage'], ['music', 'romance'], ['fx', 'hearts'],
    ['show', SO, 'smile', 'default', 'c'],
    ['if', G => G.flags.c2_concert > 0, [
      ['say', SO, 'Twenty thousand people went home safe. Because of your board.'],
      ['say', SO, 'I sang the encore looking at the dispatch van. Did you notice? …You were probably busy.', 'blush', 'shy'],
      ['aff', SO, 2]
    ], [
      ['say', SO, 'The crowd surge hurt some people tonight. The medics say they\'ll be fine, but—', 'sad', 'default'],
      ['say', SO, 'My manager said, "Well, the stream numbers were good." And the worst part is I wasn\'t surprised.', 'hurt']
    ]],
    ['say', SO, 'Can I stay on the board a few more days? The Glazier\'s gala threat is aimed at HALO. I want to help.', 'resolve', 'fist'],
    ['hideall']
  ];

  S.ch2_climax = [
    ['autosave'], ['bg', 'ops'], ['music', 'tension'], ['tint', null], ['fx', null],
    ['n', 'Day 8. The Mirror Mall Gala, HALO\'s biggest charity night of the year.'],
    ['show', A, 'resolve', 'cross', 'c'],
    ['say', A, 'Six hundred guests. Half the City Safety Board. The Glazier promised to "make a masterpiece" tonight.'],
    ['say', A, 'You run it from the van. No heroics without your call. Understood?', 'cold', 'point'],
    ['hideall'],
    ['bg', 'mall'], ['music', 'mystery'], ['fx', 'dust'],
    ['n', 'The Mirror Mall: eight floors of glass around a sunlit atrium. Tonight there are chandeliers and cameras.'],
    ['sfx', 'glass'], ['shake', 8], ['flash', '#9ff'], ['music', 'action'], ['fx', 'glass'],
    ['n', 'Every exit turns to crystal at once. Six hundred phones light up with the same message, in a very good font: *Please stay where you are. It won\'t take long, and nobody will be forgotten.*'],
    ['cg', 'cg_mall'], ['sfx', 'shatter'],
    ['say', GZ, 'Good evening. I\'m sorry about the doors. They will open when I have finished.'],
    ['say', GZ, 'You are the one in the van. Squad One\'s van smelled like cold coffee and wet umbrellas. I would know yours anywhere.'],
    ['t', 'I have never told anyone what my van smells like.'],
    ['cgoff'],
    ['show', K, 'determined', 'fist', 'l'], ['show', H, 'determined', 'fist', 'r'],
    ['say', K, 'He\'s on the mezzanine. I can reach him in two seconds.'],
    ['say', H, 'Kaede, no. The floors are glass. He controls glass.', 'scared', 'shy'],
    ['eye', { prompt: 'Six hundred hostages, glass everywhere, and Kaede ready to run. What\'s the plan?', time: 10000, opts: [
      { t: '"Tetsu shields the crowd, Sora lifts the doors, Rei scouts the mirrors. Kaede — hold."', ok: 1, set: 'm1', aff: { tetsu: 1, sora: 1 } },
      { t: '"Kaede, go. Grab him before he moves."', aff: { kaede: 1 }, set: 'm_rush' },
      { t: '"Everyone stay put until backup arrives."', timeout: 1 }
    ] }],
    ['if', G => G.flags.m1, [
      ['say', T, 'Right. Everybody behind me. I\'m a wall now.', 'determined', 'cross'],
      ['n', 'Sora raises one hand. The crystal doors groan, then float off their hinges like soap bubbles. Guests stream out.'],
      ['say', K, '…Tch. Holding. *Holding.* You owe me for this, Handler.', 'sulk', 'cross'],
      ['say', GZ, 'Well done. Let\'s raise the stakes.']
    ], [
      ['say', K, 'Finally.', 'smirk', 'point'], ['sfx', 'whoosh']
    ]],
    ['sfx', 'shatter'], ['shake', 12],
    ['n', 'The mezzanine floor dissolves. Kaede, already mid-dash toward the Glazier, drops through eight stories of open air.'],
    ['say', K, '—!', 'scared', 'shy'],
    ['eye', { prompt: 'Kaede is falling. Only one hero can reach her. Who?', time: 7000, opts: [
      { t: '"Hikari — lightning-step off the chandeliers!"', ok: 1, set: 'm2', aff: { hikari: 2, kaede: 2 } },
      { t: '"Sora — catch her with gravity!"', aff: { sora: 1 }, set: 'm2s' },
      { t: '"Tetsu, get under her!"', timeout: 1, aff: { tetsu: 1 } }
    ] }],
    ['letterbox', 1], ['speed', 1],
    ['if', G => G.flags.m2, [
      ['cg', 'cg_kaede_save'], ['sfx', 'thunder'], ['flash', '#fff'],
      ['n', 'A white-gold streak ricochets between three chandeliers. Hikari catches Kaede six meters above the fountain and lands in a spray of sparks.'],
      ['say', H, 'Got you. …You\'re heavier than you look.', 'happy', 'fist'],
      ['say', K, '……You caught me.', 'stunned', 'shy'], ['set', 'hk_bond']
    ], [
      ['if', G => G.flags.m2s, [
        ['n', 'Sora strains. Kaede slows, slows, stops a meter above the floor. Then Sora\'s nose starts to bleed and they both drop the last meter.'],
        ['say', SO, 'Ow. Gravity is heavier when you\'re scared.', 'sweat', 'shy']
      ], [
        ['n', 'Tetsu dives. Kaede hits steel instead of stone. Both of them crack the fountain in half.'],
        ['say', T, '…Are you okay? I\'m okay. The fountain is not okay.', 'sweat', 'default']
      ]],
      ['say', H, 'Kaede! Are you hurt?', 'scared', 'shy'], ['set', 'hk_bond']
    ]],
    ['cgoff'], ['speed', 0], ['letterbox', 0],
    ['show', GZ, 'cold', 'cross', 'c'],
    ['say', GZ, 'Heroes catching heroes. That is what they did eight years ago, too. Right up until they couldn\'t.'],
    ['say', GZ, 'Let us see how much of you the floor will hold.'],
    ['hide', GZ], ['sfx', 'glass'], ['shake', 10], ['fx', 'glass'],
    ['n', 'Every pane in the atrium stands up off its frame and turns, all at once, the way a flock turns.'],
    ['t', 'He controls glass. The board is on my screen and it shows me his next move before he makes it. He is showing me his hand because he does not think it will matter.'],
    ['fight', { id: 'gz', foe: 'glazier', team: [H, K, T, SO], title: 'The Mirror Mall', sub: 'Six hundred guests behind the glass', bg: 'mall', music: 'boss',
      loseText: 'Frost to the knees, glass in the walls. Nobody is dead, and that is only because he has decided it should be so.' }],
    ['show', GZ, 'cold', 'cross', 'c'],
    ['if', G => G.flags.f_gz === 'win', [
      ['n', 'A hairline crack runs from the top of the mirror mask down to the chin. He touches it with two fingers, delicately, as if checking a cup.'],
      ['say', GZ, 'Good. That is good. Squad One could not have done that.']
    ], [
      ['say', GZ, 'You are not ready. I am sorry. I will let them all go, because I had decided to.', 'sad']
    ]],
    ['say', GZ, 'Ask your Director about Shibuya, Handler. Ask her who sat in the van that night.'],
    ['sfx', 'glass'], ['hide', GZ], ['fx', 'glass'],
    ['n', 'He steps backward into a mirror and the mirror takes him in like water.'],
    ['bg', 'ops'], ['music', 'sad'], ['fx', null],
    ['do', G => { const sh = G.shifts.slice(-3), ok = sh.reduce((s, x) => s + x.ok, 0) / Math.max(1, sh.reduce((s, x) => s + x.total, 0)); G.score2 = Math.round(ok * 60 + (G.flags.m1 ? 20 : 0) + (G.flags.m2 ? 20 : 10)); }],
    ['show', A, 'cold', 'cross', 'c'],
    ['if', G => G.score2 >= 70, [
      ['say', A, 'Zero casualties. Six hundred guests home. The Board is impressed. Don\'t let it go to your head.']
    ], [
      ['say', A, 'Fourteen injured, no deaths. The Board is asking why a Spark-less clerk runs my best squad.', 'cold'],
      ['say', A, 'I told them to watch the footage. Do better, Handler.', 'neutral', 'point']
    ]],
    ['me', 'He told me to ask about Shibuya. About who sat in the van.'],
    ['say', A, '……', 'sad', 'default'],
    ['t', 'She reaches up and takes off her glasses. She begins to clean them.'],
    ['say', A, 'Not tonight, {name}.', 'cold', 'cross'],
    ['hideall'],
    ['bg', 'rooftop'], ['tint', 'night'], ['music', 'romance'], ['fx', 'stars'],
    ['show', K, 'sad', 'default', 'l'], ['show', H, 'smile', 'default', 'r'],
    ['say', K, 'At the academy I trained until my legs bled because you were always there. Loud. Bright. Stupidly powerful.', 'sad'],
    ['say', K, 'I\'m fast. Fast isn\'t a Spark that saves people. It\'s a Spark that gets there first and watches.', 'hurt'],
    ['say', H, 'Fast is how you reached the mall before the doors sealed. Fast is how I had someone to catch.', 'tender', 'shy'],
    ['say', H, 'So — partners?', 'happy', 'wave'],
    ['say', K, '…Rivals. Who are partners. Sometimes. Shut up.', 'blush', 'cross'],
    ['aff', K, 2], ['aff', H, 1],
    ['show', SO, 'smile', 'shy', 'c'],
    ['say', SO, 'Um. I called STELLAR. I told them I\'m staying with Squad Zero. On loan, indefinitely. They were, uh, loud.', 'sweat', 'shy'],
    ['say', SO, 'So please take care of me.', 'happy', 'wave'],
    ['ach', 'ch2'], ['hideall'],
    ['recap'], ['jump', 'ch3']
  ];

  // ======================= CHAPTER 3 =======================
  S.ch3 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 3', 'Fractures'],
    ['chapter', 3, 'Chapter 3 · Fractures', 'Board Review', 12],
    ['bg', 'ops'], ['music', 'hq'],
    ['show', B, 'neutral', '', 'c'], ['sfx', 'beep'],
    ['say', B, 'Good morning, Handler. Five heroes on the board today. Calls are up forty percent since the gala.'],
    ['say', B, 'I have also scheduled your dentist— ~bzzzt~ —dentist appointment.', 'surprised'],
    ['me', '…B.I.T., you glitched.'],
    ['say', B, 'I did not glitch. I have never glitched. Glitching is for toasters.', 'angry'],
    ['hideall'],
    ['daycard'],
    ['shift', { title: 'Day 9 · Full Board', calls: 10, tiers: [1, 3], diff: 1.25, special: [{ at: 180, t: 'Hostages — Old Town Bank', d: 'Three Prism members holding tellers inside the vault. Something about this call is too clean.', r: '5 4 3 4 5', n: 3, tier: 3, dist: 'oldtown', flag: 'c3_trap1', ev: 'trap' }] }],
    ['call', 'ch3_after9'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch3_day10'],
    ['shift', { title: 'Day 10 · Under Review', calls: 11, tiers: [2, 3], diff: 1.3, special: [{ at: 140, t: 'Gas Leak — Industrial Park', d: 'A report of a toxic leak. The caller hung up before giving details.', r: '3 5 3 2 6', n: 2, tier: 3, dist: 'industrial', flag: 'c3_trap2', ev: 'trap' }] }],
    ['call', 'ch3_after10'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['shift', { title: 'Day 11 · Signal Hunt', calls: 11, tiers: [2, 3], diff: 1.3, special: [{ at: 200, t: 'Anonymous Tip — Riverside Warehouse', d: 'Someone says Prism is storing glass bombs here. B.I.T. marked it low priority. Why?', r: '4 3 5 2 6', n: 2, tier: 3, dist: 'riverside', flag: 'c3_tip', ev: 'warehouse' }] }],
    ['hub'], ['night'],
    ['call', 'ch3_day11'],
    ['jump', 'ch3_climax']
  ];
  S.ch3_after9 = [
    ['bg', 'medbay'], ['music', 'sad'],
    ['show', T, 'sad', 'default', 'l'], ['show', M, 'scared', 'default', 'r'],
    ['if', G => G.flags.c3_trap1 > 0, [
      ['say', T, 'The bank hostages were mannequins. Glass mannequins. It was bait. The real team was waiting on the roof.'],
      ['say', T, 'We got out because you read the room quickly. But how did they know who we\'d send? They were at the right door.', 'sad']
    ], [
      ['say', T, 'The bank was a trap. They knew our entry point. They knew *everything*.', 'sad'],
      ['say', M, 'Tetsu took a glass spike meant for Sora. Hold still — I\'m almost done.', 'determined', 'point']
    ]],
    ['say', M, '…There. Good as new.', 'smile'],
    ['t', 'Her hands are shaking. She\'s pale. It looks as though the wound went somewhere else.'],
    ['hideall']
  ];
  S.ch3_day10 = [
    ['bg', 'office'], ['music', 'mystery'], ['tint', null],
    ['show', A, 'cold', 'cross', 'c'],
    ['say', A, 'Every Prism ambush this week happened exactly where we sent heroes. Our dispatch data is leaking.'],
    ['say', A, 'The Board has a suspect. The Spark-less outsider with access to every dispatch log.', 'cold'],
    ['me', 'Me.'],
    ['say', A, 'You. You keep working, under review. In two days the Board decides whether you keep your desk.'],
    ['say', A, '…For what it\'s worth, I don\'t think it\'s you. I think it\'s someone who knows how HALO thinks.', 'tired'],
    ['hideall'],
    ['bg', 'ops'],
    ['show', R, 'cold', 'cross', 'l'],
    ['say', R, 'I heard. The Board is full of people who have never stood in a shadow long enough to know what one looks like.'],
    ['say', R, 'If they take your desk, I\'m leaving with you. Don\'t make it a thing.', 'blush', 'cross'],
    ['aff', R, 1],
    ['show', K, 'smug', 'hip', 'r'],
    ['say', K, 'Same. Though I\'d run in and steal the desk back.', 'smirk', 'point'],
    ['hideall']
  ];
  S.ch3_after10 = [
    ['bg', 'medbay'], ['music', 'sad'], ['fx', null],
    ['n', 'Evening. The med bay lights are low. Four heroes came back hurt today, and Mira healed every one of them.'],
    ['sfx', 'heartbeat'], ['show', M, 'cry', 'default', 'c'],
    ['n', 'She is on the floor beside bed three, curled around her own stomach. The place where Tetsu\'s wound was.'],
    ['say', M, 'Don\'t — please don\'t call anyone. It passes. It always passes. I just have it for a while, that\'s all.'],
    ['t', 'She is not looking at me. She is straightening the corner of the blanket on the bed beside her. Again. Again.'],
    ['tell', M, 'tidy', 'Tidies things when something hurts. The tidier the room, the worse the day.'],
    ['choice', [
      { t: 'Sit beside her and hold her hand until it passes.', aff: { mira: 3 }, then: [['n', 'Twenty minutes. Her breathing slows. Her grip never loosens.'], ['say', M, '…You didn\'t say anything.', 'tender'], ['me', 'You didn\'t need me to.']] },
      { t: '"You can\'t keep doing this alone. I\'m changing the board — fewer injuries, more rest."', aff: { mira: 2 }, set: 'mira_rule', then: [['say', M, '…You\'d rebuild your whole dispatch system for that? For me?', 'stunned'], ['me', 'I\'d rebuild it for anyone. You\'re just the one who didn\'t ask.']] }
    ]],
    ['hideall']
  ];
  S.ch3_day11 = [
    ['bg', 'apartment'], ['tint', 'night'], ['music', 'mystery'],
    ['n', '3 a.m. My apartment floor is covered in printouts: every leaked call, every ambush.'],
    ['t', 'The leaks don\'t come from the dispatch logs. They come from calls that were *routed*, sorted before they reached me.'],
    ['t', 'There is exactly one thing that touches every call before I do.'],
    ['eye', { prompt: 'Who routes every call before it reaches you?', time: 12000, opts: [
      { t: 'B.I.T.', ok: 1, set: 'suspect_bit' },
      { t: 'Director Takamine', set: 'suspect_aya' },
      { t: 'Mira, on operations support', timeout: 1, set: 'suspect_mira' }
    ] }],
    ['if', G => G.flags.suspect_bit, [['t', 'B.I.T. It glitched on Monday. It marked the warehouse tip low priority. It has been there since the harbor.']],
    [['t', 'No. Aya approved half those calls herself. Mira was in the med bay. Think.'], ['t', '…B.I.T. It sorts every call first. It glitched this week. It is the only one who could.']]],
    ['t', 'Tomorrow I test it. One shift, one fake priority tag. If Prism shows up, I\'ll know.'],
    ['nextday'], ['daycard']
  ];

  S.ch3_climax = [
    ['autosave'],
    ['shift', { title: 'Day 12 · The Bait', calls: 10, tiers: [2, 3], diff: 1.3 }],
    ['bg', 'ops'], ['music', 'tension'],
    ['n', '17:04. The shift is over. The fake call I planted — "Squad Zero regroup at Riverside Pier 9" — went through B.I.T. and nobody else.'],
    ['sfx', 'alarm'], ['shake', 5],
    ['show', M, 'scared', 'default', 'r'],
    ['say', M, 'Riverside cameras show Prism surrounding Pier 9. There\'s nobody there. They went to the exact spot you made up.'],
    ['show', B, 'surprised', '', 'l'],
    ['say', B, 'That is statistically unlikely. Those coordinates only existed in my routing buffer. Only I could—'],
    ['say', B, '…only. I.', 'sad'],
    ['music', null], ['sfx', 'glass'], ['flash', '#f00'], ['shake', 10],
    ['cg', 'cg_bit'], ['fx', 'glass'],
    ['say', GZ, 'Well done, Handler. You found my little window.'],
    ['say', GZ, 'A single shard from the harbor beast, lodged in your drone\'s core. It has been whispering to me since the first day.'],
    ['say', GZ, 'Now let\'s see how long your tower holds when every door in it opens at once.'],
    ['sfx', 'alarm'], ['music', 'action'],
    ['n', 'Every security door in HALO Tower slides open. On the cameras, glass-masked figures pour in through the lobby.'],
    ['eye', { prompt: 'B.I.T. is infected and it controls the tower. What do you do?', time: 11000, opts: [
      { t: '"B.I.T. — it\'s me. Find the shard. Isolate it. I know you can fight it."', ok: 1, set: 'bit_saved', aff: { mira: 1 } },
      { t: '"Mira — hard shutdown. Cut B.I.T.\'s power."', set: 'bit_shutdown' },
      { t: '"Rei, go into the server room and cut the shard out with your shadows."', timeout: 1, set: 'bit_rei', aff: { rei: 1 } }
    ] }],
    ['if', G => G.flags.bit_saved, [
      ['say', B, 'Han— ~dler~ —I can see it. It\'s cold. It\'s shaped like a window.', 'sad'],
      ['say', B, 'I am B.I.T. I handle schedules, data, and emotional support. I *reject* this input.', 'angry'],
      ['sfx', 'shatter'], ['flash', '#52e0ff'], ['cgoff'],
      ['n', 'The red light in B.I.T.\'s visor cracks and turns blue again. All across the tower, the doors slam shut.']
    ], [
      ['if', G => G.flags.bit_shutdown, [
        ['n', 'Mira pulls the breaker. B.I.T.\'s visor goes dark mid-word. The doors lock, but so do the elevators, and the lobby goes silent.'],
        ['cgoff'], ['say', M, 'I\'m sorry, B.I.T. I\'m so sorry.', 'cry']
      ], [
        ['sfx', 'shadow'], ['n', 'Rei vanishes into the floor. Seconds later every screen flickers purple, and B.I.T.\'s visor snaps back to blue. A sliver of black glass floats beside it.'],
        ['cgoff'], ['set', 'bit_saved'], ['aff', R, 2]
      ]]
    ]],
    ['shift', { title: 'Day 12 · Tower Siege', start: 17, calls: 9, tiers: [2, 3], diff: 1.3, real: 240, special: [{ at: 60, t: 'Lobby Breach — Floor 1', d: 'Prism masks pouring through the main doors. Hold the lobby.', r: '8 6 3 2 3', n: 3, tier: 4, dist: 'uptown', flag: 'c3_lobby', ev: 'siege' }, { at: 260, t: 'Server Room — Floor 60', d: 'Someone is downloading HALO\'s sealed archives. Stop them.', r: '4 3 6 2 7', n: 2, tier: 4, dist: 'akiba', flag: 'c3_server' }] }],
    ['bg', 'office'], ['music', 'mystery'], ['fx', 'glass'],
    ['n', 'Floor 80. The Director\'s office. The window wall has been turned to perfectly clear crystal. Someone is standing in front of it.'],
    ['cg', 'cg_reveal'],
    ['say', GZ, 'Hello, Aya.'],
    ['show', A, 'surprised', 'default', 'l'],
    ['say', A, '…Kyouya.'],
    ['know', KY],
    ['n', 'White hair. A Handler\'s coat, eight years out of date. A face that stopped aging the night everything else did.'],
    ['say', KY, 'Kyouya Aoi. Handler of Squad One. You can put it in your report, {name}. I\'m sure Aya will help.'],
    ['say', KY, 'Five heroes. The Shibuya Rift, eight years ago. The Board ordered them in. I sent them. Aya held the line.'],
    ['say', KY, 'They didn\'t die. I can hear them. They\'re still *inside*.', 'sad'],
    ['if', G => G.flags.c3_server > 0, [
      ['say', KY, 'You stopped my download. Clever. It doesn\'t matter. I only needed to see one file.', 'smirk']
    ], [
      ['say', KY, 'And now I have the Rift schematics HALO sealed away. Thank you for leaving the door open.', 'smile']
    ]],
    ['cgoff'], ['sfx', 'glass'],
    ['n', 'He steps backward through the crystal window and falls, glittering, into the night.'],
    ['hideall'],
    ['bg', 'office'], ['fx', null], ['music', 'sad'],
    ['show', A, 'sad', 'default', 'c'],
    ['say', A, 'He was my partner. We ran Squad One together. He was the better Handler. Kinder. He learned their favorite songs.'],
    ['say', A, 'The Board ordered them into the Rift to stop it spreading. It worked. None of them came out. I was in the van on the radio. I said "copy."'],
    ['say', A, 'Kyouya never stopped listening for them. I stopped. I told myself that was being strong.', 'tired'],
    ['me', 'Shibuya. That was the night Hikari\'s mother died.'],
    ['say', A, '…Yes. She was a rescue worker. She carried out thirty-two people.', 'sad'],
    ['say', A, 'The last person she carried out was Kyouya Aoi.', 'sad', 'cross'],
    ['t', '…Hikari.'],
    ['show', B, 'sad', '', 'r'],
    ['if', G => G.flags.bit_saved, [['say', B, 'Handler. I am sorry. I did not know I was a window. …Thank you for not closing me.', 'sad'], ['aff', M, 1]],
    [['n', 'B.I.T.\'s empty chassis sits on the desk. Mira has already started rebuilding it from backups. It will remember nothing of the last month.']]],
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
    ['say', 'kaede', 'Race you to the vending machine. Loser buys.'],
    ['say', 'hikari', 'It\'s four meters away.', 'sulk'],
    ['sfx', 'whoosh'], ['n', 'Kaede wins. Hikari zaps the machine. Both drinks come out. Both of them claim victory.'],
    ['t', 'Kaede\'s heel was tapping before the race. It stopped about the moment she won.'],
    ['tell', 'kaede', 'heel', 'Taps her heel when she\'s waiting. When she is really hurt she goes quiet and slow, and that is the thing to be afraid of.'],
    ['aff', 'kaede', 1], ['aff', 'hikari', 1]
  ] },
  ev_tetsu_door: { day: 5, need: 'tetsu', s: [
    ['bg', 'hq_lobby'], ['sfx', 'rumble'], ['show', 'tetsu', 'sweat', 'shy', 'c'],
    ['say', 'tetsu', 'Handler. Is there a budget for doors? Asking for a friend. The friend is me.'],
    ['do', G => { G.credits -= 40; }], ['n', '*Facility repairs: −¥40.*'], ['aff', 'tetsu', 1]
  ] },
  ev_sora_disguise: { day: 8, need: 'sora', s: [
    ['bg', 'cafe'], ['show', 'sora', 'smug', 'hip', 'c'],
    ['say', 'sora', 'Disguise check. Sunglasses, hat, fake mustache. Totally anonymous.'],
    ['n', 'Nineteen people are filming her.'],
    ['choice', [{ t: '"Perfect. Nobody will ever know."', aff: { sora: 2 }, then: [['say', 'sora', 'I knew the mustache was the key.', 'laugh']] }, { t: '"…Sora, there\'s a line out the door."', aff: { sora: 1 }, then: [['say', 'sora', 'Mm. I\'ve been standing here for ten minutes pretending not to notice. That\'s my whole job, actually.', 'tired']] }]]
  ] },
  ev_bit_glitch: { day: 9, s: [
    ['bg', 'ops'], ['show', 'bit', 'neutral', '', 'c'],
    ['say', 'bit', 'Handler, your coffee is ready. ~Your coffee is ready.~ Your cof—fee is—'],
    ['say', 'bit', '…I have made you nine coffees. I do not know why.', 'sad'],
    ['t', 'That is not normal.']
  ] },
  ev_squad_dinner: { day: 13, need: 'sora', s: [
    ['bg', 'ramen'], ['music', 'daily'], ['show', 'tetsu', 'happy', 'default', 'l'], ['show', 'hikari', 'happy', 'wave', 'c'], ['show', 'sora', 'laugh', 'hip', 'r'],
    ['n', 'Squad dinner at Ramen Raijin. Tetsu pays. Hikari eats six bowls. Sora signs the ceiling. Kaede and Rei race to the last gyoza, and Rei wins by not moving at all.'],
    ['t', 'For one hour, nobody mentions glass.'],
    ['do', G => { G.roster.forEach(h => G.heroes[h].fat = Math.max(0, G.heroes[h].fat - 15)); }], ['n', '*Squad −15 Fatigue.*']
  ] }
});

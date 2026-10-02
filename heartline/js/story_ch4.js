/* HEARTLINE AGENCY — Chapter 4, Final Chapter, endings, and hang-out scenes. */
Object.assign(STORY.scripts, (() => {
  const H = 'hikari', R = 'rei', M = 'mira', A = 'aya', B = 'bit', K = 'kaede', T = 'tetsu', SO = 'sora', GZ = 'glazier', KY = 'kyouya', RI = 'rin', KU = 'kuroda';
  const S = {};

  // ======================= CHAPTER 4 =======================
  S.ch4 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 4', 'Shattered City'],
    ['chapter', 4, 'Chapter 4 · Shattered City', 'the Grand Rift', 16],
    ['bg', 'glass_city'], ['music', 'mystery'], ['fx', 'glass'],
    ['n', 'Three days after the tower siege, a new Rift opened in Shibuya at 4:12 a.m. By sunrise, six city blocks were glass.'],
    ['n', 'By the second day there were four more.'],
    ['bg', 'ops'], ['fx', null], ['music', 'tension'],
    ['show', A, 'resolve', 'cross', 'c'],
    ['say', A, 'He\'s using the sealed schematics. Every small Rift he opens tunes the big one, Shibuya, the way you tune a bell.'],
    ['say', A, 'The Board has dropped its investigation into you, by the way. Recovered logs cleared you. They would like you to know they were "always confident."', 'wry'],
    ['me', 'Of course they were.'],
    ['say', A, 'There\'s a citywide curfew and every agency is stretched thin. From now on our shifts are going to be long.', 'cold', 'point'],
    ['hideall'],
    ['show', SO, 'sad', 'default', 'c'], ['sfx', 'phone'],
    ['say', SO, '{name}. STELLAR called. They\'re pulling me out of the city. "Our talent is too valuable to risk."'],
    ['say', SO, 'Talent. Like a product line. They\'ve already booked my flight.', 'hurt'],
    ['choice', [
      { t: '"You\'re not a product. You\'re one of us. Stay. I\'ll fight STELLAR myself."', aff: { sora: 4 }, set: 'sora_stay', then: [['say', SO, 'You\'d fight my agency? With what? A clipboard?', 'stunned'], ['me', 'A very aggressive clipboard.'], ['say', SO, '…Okay. I\'m staying. They can sue me. I have better lawyers than they think.', 'fond', 'shy']] },
      { t: '"It\'s your choice, Sora. Whatever you decide, I\'m proud of you."', aff: { sora: 2 }, then: [['say', SO, '…Then I\'m going to go and think. Just for a little. I\'ll come back, okay? I\'m going to come back.', 'hurt'], ['recruit', SO, 0]] }
    ]],
    ['hideall'],
    ['daycard'],
    ['shift', { title: 'Day 13 · Curfew', calls: 11, tiers: [2, 3], diff: 1.4, special: [{ at: 170, t: 'Glass Bloom — Shibuya Edge', d: 'A Rift is opening in a crowded street. Glass is spreading outward like frost.', r: '5 6 4 5 5', n: 3, tier: 4, dist: 'shibuya', flag: 'c4_bloom', ev: 'glassbloom' }] }],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch4_day14'],
    ['shift', { title: 'Day 14 · Fault Lines', calls: 12, tiers: [2, 4], diff: 1.45 }],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch4_day15'],
    ['shift', { title: 'Day 15 · Shadow Hours', calls: 12, tiers: [2, 4], diff: 1.5, special: [{ at: 210, t: 'Shadow Surge — Riverside', d: 'Rei\'s shadows are out of control at a Rift site. She\'s asking for backup. Her voice is shaking.', r: '3 6 3 7 5', n: 2, tier: 4, dist: 'riverside', flag: 'c4_rei', ev: 'shadowsurge' }] }],
    ['call', 'ch4_after15'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['jump', 'ch4_climax']
  ];
  S.ch4_day14 = [
    ['bg', 'training'], ['music', 'sad'], ['tint', null],
    ['n', 'Early morning. The training room is dark except for one flickering light, and a girl sitting under it with a sealed HALO file on her knees.'],
    ['show', H, 'sad', 'default', 'c'],
    ['say', H, 'Mira gave it to me. The Shibuya file. She said I had a right to know.'],
    ['say', H, 'My mom went in twelve times. The last person she carried out was him. Kyouya Aoi. She saved the man who is breaking the city.', 'hurt'],
    ['say', H, '…Did you know?', 'sad', 'shy'],
    ['choice', [
      { t: '"I found out three days ago. I should have told you. I\'m sorry."', aff: { hikari: 3 }, set: 'h_honest', then: [['say', H, '…Yeah. You should have.', 'sulk', 'cross'], ['say', H, 'But you\'re telling me now, looking at me. Mom always said that part counts.', 'tender']] },
      { t: '"It wasn\'t my secret. It was yours to find."', aff: { hikari: 1 }, then: [['say', H, '…Maybe. It still feels like the floor fell out.', 'sad']] }
    ]],
    ['say', H, 'Part of me wants to hate him. But she carried him out. She didn\'t carry people she thought were garbage.', 'resolve', 'fist'],
    ['say', H, 'When we find him I want to talk to him. Before anybody throws a punch. Including me.', 'resolve', 'default'],
    ['set', 'h_forgive'],
    ['hideall']
  ];
  S.ch4_day15 = [
    ['bg', 'hq_lobby'], ['music', 'mystery'],
    ['show', R, 'scared', 'cross', 'c'],
    ['say', R, 'The shadows are loud today. Louder than the harbor. Louder than three years ago.'],
    ['say', R, 'Every Rift he opens makes them louder. As if they were being called.', 'sad'],
    ['say', R, 'If it happens out there, pull everyone back. Even me. Especially me.', 'determined', 'point'],
    ['me', 'I heard you the first time, Rei. The answer is still no.'],
    ['say', R, '……Stubborn.', 'blush', 'cross'],
    ['hideall']
  ];
  S.ch4_after15 = [
    ['bg', 'glass_city'], ['music', 'sad'], ['fx', 'shadow'],
    ['if', G => G.flags.c4_rei > 0, [
      ['show', R, 'cry', 'shy', 'c'],
      ['n', 'They got to her in time. The team stood around her in a circle and just kept talking, about ramen, about cats, about nothing, until the shadows went quiet.'],
      ['say', R, 'Nobody ran. Three years ago everyone ran.', 'cry'],
      ['say', R, '…You built a squad that doesn\'t run, {name}.', 'tender', 'shy'], ['aff', R, 3], ['set', 'rei_calm']
    ], [
      ['show', R, 'sad', 'default', 'c'],
      ['n', 'By the time the team arrived, Rei had forced the shadows back alone. Both of her hands are bandaged.'],
      ['say', R, 'I told you to pull back. You didn\'t have to see that.', 'cold', 'cross'],
      ['me', 'I\'m not going anywhere, Rei.'],
      ['say', R, '……I know. That\'s what frightens me.', 'sad', 'shy'], ['aff', R, 1]
    ]],
    ['hideall']
  ];
  S.ch4_climax = [
    ['autosave'],
    ['shift', { title: 'Day 16 · Evacuation', calls: 11, tiers: [2, 4], diff: 1.5, real: 300, special: [{ at: 200, t: 'Field Hospital — Shibuya Crossing', d: 'Mira\'s field hospital is treating 200 evacuees near the Rift. Glass is creeping toward the tents.', r: '4 7 3 5 5', n: 3, tier: 4, dist: 'shibuya', flag: 'c4_hosp', ev: 'glassbloom' }] }],
    ['bg', 'glass_city'], ['music', 'tension'], ['fx', 'glass'],
    ['n', '17:30. Shibuya Crossing. Mira\'s field hospital is the last lit place in a city of crystal.'],
    ['show', M, 'determined', 'shy', 'r'],
    ['say', M, '(comms) Last evacuees are loading. Tell the squad they can come and eat. I made onigiri. Don\'t read anything into the shape.', 'smile'],
    ['sfx', 'glass'], ['shake', 10], ['music', 'action'],
    ['show', GZ, 'cold', 'point', 'l'],
    ['say', GZ, 'Mira Solace. The healer who takes the wound into herself.'],
    ['say', GZ, 'Inside the Rift human bodies come apart. I need someone who can hold them together while I bring my squad home.', 'sad'],
    ['say', M, '…You\'re not going to hurt anyone else, Kyouya. I won\'t let you.', 'determined', 'fist'],
    ['eye', { prompt: 'Kyouya is reaching for Mira. The squad is thirty seconds out. What do you do?', time: 9000, opts: [
      { t: '"Kaede — full speed. Tag Mira with a tracker. Don\'t engage."', ok: 1, set: 'tracker', aff: { kaede: 2 } },
      { t: '"Tetsu, grab him. Don\'t let go."', set: 'grab', aff: { tetsu: 1 } },
      { t: '"Mira — run."', timeout: 1 }
    ] }],
    ['if', G => G.flags.tracker, [
      ['sfx', 'whoosh'], ['n', 'A green blur. Kaede brushes past Mira\'s sleeve so fast the Glazier doesn\'t even turn his head. A tiny HALO beacon blinks on Mira\'s collar.'],
      ['say', K, '(comms) Tag\'s on. She\'s a lighthouse now.', 'smirk']
    ], [
      ['n', 'Tetsu hits him like a freight train. The Glazier turns to glass, a decoy, and shatters. The real one is already behind Mira.']
    ]],
    ['show', H, 'determined', 'fist', 'c'],
    ['say', H, 'Kyouya Aoi! My mom carried you out of that Rift! Her name was Natsuki Amane!', 'angry'],
    ['say', GZ, '……', 'sad'],
    ['say', GZ, 'You have her eyes. She told me to *live*. I have been trying to do it properly ever since.', 'sad', 'default'],
    ['say', GZ, 'I\'m sorry, Hikari. Tomorrow night, everyone comes home.', 'cold', 'point'],
    ['sfx', 'glass'], ['flash', '#9ff'], ['hide', M], ['hide', GZ],
    ['n', 'The crossing flashes white. When it clears the hospital is empty. Mira is gone.'],
    ['bg', 'office'], ['music', 'sad'], ['fx', null],
    ['show', A, 'resolve', 'cross', 'c'],
    ['if', G => G.flags.tracker, [
      ['say', A, 'Kaede\'s tracker is live. Mira is inside the Shibuya Rift, and she\'s alive.']
    ], [
      ['say', A, 'We have no signal. But there is only one place he would take her. The Shibuya Rift.']
    ]],
    ['say', A, 'Tomorrow night the Rift peaks. He will open it fully. If he does, the glass won\'t stop at Shibuya.', 'cold'],
    ['say', A, 'Eight years ago I let the Board send a squad in and I never went after them. I am not doing that again.', 'resolve', 'point'],
    ['say', A, '*Operation Heartline.* Every agency in the city holds the streets. Squad Zero goes in. And you run it.', 'resolve', 'cross'],
    ['ach', 'ch4'], ['hideall'],
    ['recap'], ['jump', 'ch5']
  ];

  // ======================= CHAPTER 5 (Arc One finale) =======================
  S.ch5 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 5', 'Operation Heartline'],
    ['chapter', 5, 'Chapter 5 · Operation Heartline', 'Operation Heartline', 18],
    ['bg', 'rooftop'], ['tint', 'evening'], ['music', 'romance'], ['fx', 'petals'],
    ['n', 'The night before Operation Heartline. Somebody has dragged a grill onto the HALO Tower roof. Nobody asked permission.'],
    ['if', G => !G.roster.includes('sora'), [
      ['sfx', 'chime'], ['show', SO, 'sweat', 'shy', 'r'],
      ['say', SO, 'Um. Hi. I got to the airport and then I got back in the taxi. Is there room on the board for one more?'],
      ['me', 'There was never not room.'],
      ['say', SO, '…Okay. Okay, good.', 'hurt'], ['recruit', SO], ['aff', SO, 2], ['hide', SO]
    ]],
    ['show', T, 'happy', 'default', 'l'],
    ['say', T, 'Grill\'s hot. I brought enough meat for thirty people. So, enough for Hikari.'],
    ['show', H, 'happy', 'wave', 'c'],
    ['say', H, 'Hey. …That\'s accurate. But hey.'],
    ['show', K, 'smug', 'hip', 'r'],
    ['say', K, 'Last one to the grill does the dishes. Starting now.'], ['sfx', 'whoosh'],
    ['hideall'],
    ['show', R, 'smile', 'cross', 'l'], ['show', SO, 'laugh', 'hip', 'r'],
    ['say', SO, 'Rei, smile for the squad photo!'],
    ['say', R, 'I am smiling.', 'smile'],
    ['say', SO, 'That\'s your smile? Oh no. Oh, that\'s adorable.', 'love'],
    ['hideall'],
    ['show', A, 'tender', 'default', 'c'],
    ['say', A, '…I brought drinks. Non-alcoholic. Mostly.'],
    ['say', A, '{name}. I told you once that attached Handlers make bad decisions.', 'sad'],
    ['say', A, 'I lied. The attached ones make *hard* decisions. That is the job. Thank you for proving it.', 'smile'],
    ['show', B, 'happy', '', 'r'],
    ['say', B, 'I have prepared a playlist for the barbecue. It is ninety minutes of my own voice saying "beep" at different pitches. It is a tribute.', 'happy'],
    ['hideall'],
    ['hub'],
    ['bg', 'rooftop'], ['tint', 'night'], ['music', 'romance'], ['fx', 'stars'],
    ['n', 'Midnight. The grill is cold. The squad has scattered to rest. There is someone I want to see before tomorrow.'],
    ['choice', [
      { t: 'Find Hikari.', if: G => G.aff.hikari >= 10, then: [['set', 'route', 'hikari']] },
      { t: 'Find Rei.', if: G => G.aff.rei >= 10, then: [['set', 'route', 'rei']] },
      { t: 'Find Mira. In the only way you can: at her empty desk.', if: G => G.aff.mira >= 10, then: [['set', 'route', 'mira']] },
      { t: 'Find Sora.', if: G => G.aff.sora >= 10 && G.roster.includes('sora'), then: [['set', 'route', 'sora']] },
      { t: 'Find Kaede.', if: G => G.aff.kaede >= 10, then: [['set', 'route', 'kaede']] },
      { t: 'Stay on the roof with whoever is left. The whole squad matters.', then: [['set', 'route', 'squad']] }
    ]],
    ['jumpf', 'promise_', 'route']
  ];
  // Midnight before Operation Heartline: a promise, not a confession (those come in Chapter 12).
  const toOp = [['nextday'], ['daycard'], ['jump', 'ch5_op']];
  S.promise_hikari = [
    ['show', H, 'tender', 'shy', 'c'],
    ['say', H, 'You came to find me. …I was hoping you would.'],
    ['say', H, 'Tomorrow I\'m going to look at the man my mom saved. I\'m scared I\'ll hate him. I\'m scared I won\'t.', 'sad'],
    ['t', 'She is whispering numbers. "Eleven. Twelve. Thirteen." She has been doing it since I sat down.'],
    ['say', H, 'When I\'m scared I think about your voice on comms. It\'s so level. As if you already know I\'ll make it.', 'blush'],
    ['say', H, 'So promise me something. We both come home tomorrow. No heroic sacrifices. Not you, not me.', 'determined', 'point'],
    ['choice', [
      { t: 'Count with her. "Fourteen. Fifteen." Quietly, until she stops.', read: 'hikari_count', aff: { hikari: 5 }, set: 'promise', then: [['say', H, '…You noticed that. Everybody else tells me to stop.', 'stunned'], ['say', H, 'You counted *with* me. Okay. I\'m okay. I\'m — okay.', 'crysmile']] },
      { t: 'Hook your pinky around hers. "Promise."', aff: { hikari: 3 }, set: 'promise' },
      { t: '"I\'ll bring you home even if I have to carry you."', aff: { hikari: 3 } }
    ]],
    ['say', H, '…Okay. There\'s something I want to tell you. After. When it\'s over. Remind me?', 'fond', 'shy'],
    ...toOp
  ];
  S.promise_rei = [
    ['sfx', 'shadow'], ['show', R, 'neutral', 'cross', 'c'],
    ['say', R, 'I felt you coming. Your shadow walks differently when you are nervous.'],
    ['say', R, 'Tomorrow the Rift will pull on the shadows harder than anything. If I lose control in there—', 'sad', 'default'],
    ['say', R, '…If I lose control, say my name. Not my codename. Mine. I think I would hear it through anything.', 'tender', 'shy'],
    ['t', 'Her hand has found the end of her scarf. She is not going to let go of it until I answer.'],
    ['choice', [
      { t: 'Wait. Don\'t say anything. Let her finish what she\'s holding.', read: 'rei_scarf', aff: { rei: 5 }, set: 'promise', then: [['say', R, '…There is more. I wanted to say it tonight and I can\'t.', 'tight'], ['say', R, 'Thank you for not making me.', 'tender', 'shy']] },
      { t: '"Rei." Say it now, so she remembers how it sounds.', aff: { rei: 3 }, set: 'promise' },
      { t: '"I won\'t let you lose control."', aff: { rei: 2 } }
    ]],
    ['say', R, '…Yes. Like that. There is more I want to say. It can wait until we are both alive to hear it.', 'blush', 'cross'],
    ...toOp
  ];
  S.promise_mira = [
    ['bg', 'medbay'], ['music', 'sad'],
    ['n', 'The med bay. Her mug is still on the desk. Stuck to my chair is a sticky note in her handwriting: *EAT SOMETHING. — M.*'],
    ['t', 'She left this before the field hospital. She was still looking after me.'],
    ['t', 'The whole room is perfectly tidy. Every chart squared. Every drawer closed. That is not a good sign, in her.'],
    ['show', B, 'sad', '', 'c'],
    ['say', B, 'Handler. Mira asked me to save a message for you "only if things got bad." I have decided things are bad.'],
    ['n', '*"Hi. If you\'re hearing this, I did something reckless, which is your job, not mine. Please sleep. Please eat. And please come and get me. I\'d like to have that date. Medically. — Mira."*'],
    ['choice', [
      { t: 'Open every drawer. Mess up the desk a little. She\'d hate it. She\'d know someone had been here.', read: 'mira_tidy', aff: { mira: 5 }, set: 'promise' },
      { t: '"I\'m coming, Mira. I promise."', aff: { mira: 3 }, set: 'promise' },
      { t: 'Eat the onigiri she left. Every bite.', aff: { mira: 3 } }
    ]],
    ['hide', B],
    ...toOp
  ];
  S.promise_sora = [
    ['bg', 'stage'], ['music', 'romance'], ['fx', 'hearts'],
    ['show', SO, 'smile', 'default', 'c'],
    ['say', SO, 'An empty arena. My favorite kind. No cameras, no manager. One audience member.'],
    ['say', SO, 'I\'m writing a song. Not for streams. It\'s about someone who listens to the part nobody listens to.', 'blush', 'shy'],
    ['n', 'She sings the first verse. Her voice fills twenty thousand empty seats, and somehow it\'s only for me. Then she stops mid-line.'],
    ['say', SO, 'The rest isn\'t finished. I\'ll finish it after tomorrow. Promise you\'ll be here for all of it?', 'tender'],
    ['choice', [
      { t: 'Hum the next line, badly, off-key. Same as she does when nobody\'s listening.', read: 'sora_stage', aff: { sora: 5 }, set: 'promise', then: [['say', SO, 'That was *terrible*.', 'laugh'], ['say', SO, '…Do it again.', 'fond']] },
      { t: '"Front row. Every time."', aff: { sora: 3 }, set: 'promise' },
      { t: 'Applaud. Loudly. For a very long time.', aff: { sora: 3 } }
    ]],
    ['say', SO, 'Then let\'s win tomorrow. I want an encore.', 'happy', 'wave'],
    ...toOp
  ];
  S.promise_kaede = [
    ['bg', 'glass_city'], ['music', 'romance'], ['fx', 'glass'],
    ['show', K, 'neutral', 'hip', 'c'],
    ['say', K, 'Took you long enough. I have run around the city eleven times waiting.'],
    ['say', K, 'At the mall, when I fell, the only thing I thought was, "He told me to hold. And I didn\'t."', 'sad'],
    ['t', 'Her heel isn\'t tapping. She has been standing in place for a full minute. That is when to worry.'],
    ['say', K, 'So tomorrow, when you say hold, I hold. Even if every muscle in my body is screaming *run*. Deal?', 'determined', 'point'],
    ['choice', [
      { t: '"Sit down, Kaede." She never sits. Sit next to her anyway.', read: 'kaede_heel', aff: { kaede: 5 }, set: 'promise', then: [['say', K, '…You noticed I wasn\'t tapping.', 'stunned'], ['say', K, 'Stop being good at that.', 'blush', 'cross']] },
      { t: '"Deal. And when I say run, you run."', aff: { kaede: 3 }, set: 'promise' },
      { t: '"Race you to the finish line."', aff: { kaede: 2 } }
    ]],
    ['say', K, '…After this, you and me need to talk. Slowly. Don\'t get used to it.', 'blush', 'cross'],
    ...toOp
  ];
  S.promise_squad = [
    ['show', T, 'smile', 'default', 'l'], ['show', B, 'happy', '', 'r'],
    ['say', T, 'Couldn\'t sleep either, Handler?'],
    ['n', 'One by one they drift back up. Hikari with a blanket, Rei out of a shadow, Kaede on the fence, Sora humming. Nobody says why.'],
    ['say', T, 'My sisters used to say home isn\'t a place. It\'s the people who come back up to the roof at midnight.', 'tender'],
    ['say', B, 'I have recorded this moment. File name: *family*.', 'happy'],
    ['do', G => { ['hikari', 'rei', 'kaede', 'sora', 'tetsu'].forEach(h => { G.aff[h] = (G.aff[h] || 0) + 1; }); }],
    ...toOp
  ];
  S.ch5_op = [
    ['autosave'],
    ['bg', 'ops'], ['music', 'tension'],
    ['show', A, 'resolve', 'cross', 'c'],
    ['say', A, 'Operation Heartline. Every agency holds the streets while the Rift peaks. You dispatch all of them.'],
    ['say', A, 'At seventeen hundred, Squad Zero goes in. Make the city hold until then.', 'resolve', 'point'],
    ['hideall'],
    ['shift', { title: 'Day 18 · OPERATION HEARTLINE', calls: 13, tiers: [2, 4], diff: 1.55, real: 360, special: [{ at: 90, t: 'Glass Tide — Harbor', d: 'A wave of crystal rolling in from the bay. The seawall needs everyone strong.', r: '6 7 3 3 4', n: 3, tier: 4, dist: 'harbor', flag: 'f_tide', ev: 'glassbloom' }, { at: 240, t: 'Rift Pulse — Old Town Shelter', d: '400 people in a shelter. The ceiling is turning to glass.', r: '4 6 4 7 5', n: 3, tier: 4, dist: 'oldtown', flag: 'f_shelter', ev: 'crowd' }, { at: 360, t: 'Last Call — Shibuya Perimeter', d: 'The final Prism cell is guarding the Rift entrance. Clear the way.', r: '8 5 5 3 5', n: 3, tier: 4, dist: 'shibuya', flag: 'f_gate', ev: 'siege' }] }],
    ['jump', 'finale']
  ];

  S.finale = [
    ['bg', 'ops'], ['music', 'mystery'],
    ['do', G => { const sh = G.shifts.slice(-1)[0] || { ok: 0, total: 1 }; G.flags.city = sh.ok / Math.max(1, sh.total) >= .6 ? 1 : 0; G.hope = (G.flags.bit_saved ? 1 : 0) + (G.flags.hk_bond ? 1 : 0) + (G.flags.h_forgive ? 1 : 0) + (G.flags.rei_calm ? 1 : 0) + (G.flags.tracker ? 1 : 0) + (G.flags.sora_stay ? 1 : 0) + G.flags.city; }],
    ['if', G => G.flags.city, [['n', '17:00. Every district reports in. The city is bruised, glittering, and holding.']], [['n', '17:00. Three districts have gone dark. The agencies are exhausted. There is no more time. The Rift is peaking.']]],
    ['bg', 'glass_city'], ['music', 'action'], ['fx', 'glass'],
    ['show', A, 'resolve', 'cross', 'c'],
    ['say', A, '(comms) Squad Zero, you\'re go. {name}, they\'re yours.'],
    ['hideall'],
    ['bg', 'rift', 'shatter'], ['fx', 'glass'], ['letterbox', 1], ['light', 'rift'],
    ['cg', 'cg_final'], ['sfx', 'thunder'], ['shake', 10],
    ['n', 'Inside the Shibuya Rift the sky is a cathedral of broken light. Buildings float upside down. Glass bridges spiral off into nothing.'],
    ['n', 'And somewhere at the center there is a heartbeat on my screen. Mira\'s.'],
    ['cgoff'], ['letterbox', 0],
    ['sfx', 'roar'], ['shake', 8],
    ['eye', { prompt: 'Glass guardians pour off the bridges, a dozen of them. Formation?', time: 9000, opts: [
      { t: '"Tetsu front. Rei and Kaede flank. Sora pins them. Hikari, finish on my mark."', ok: 1, set: 'f1', aff: { tetsu: 1 } },
      { t: '"Everyone hit the biggest one. Now."' },
      { t: '"Fall back to the entrance."', timeout: 1 }
    ] }],
    ['if', G => G.flags.f1, [
      ['show', T, 'determined', 'cross', 'l'], ['say', T, 'Steel skin. Come on, then.'],
      ['show', SO, 'determined', 'point', 'r'], ['cutin', SO, 'Gravity — DOWN!', 'furious'], ['sfx', 'boom'], ['impact'],
      ['show', H, 'angry', 'fist', 'c'], ['say', H, 'Now?'], ['me', 'Now.'],
      ['cutin', H, 'THUNDER GODDESS — FULL VOLTAGE!', 'furious'], ['sfx', 'thunder'], ['flash', '#fff'], ['n', 'Twelve guardians shatter in the same heartbeat.'], ['hideall']
    ], [
      ['sfx', 'boom'], ['shake', 12], ['n', 'It works, barely. Tetsu takes a spike through the shoulder that would have killed anyone else. Kaede\'s ankle cracks. They keep moving.'],
      ['do', G => { G.hope = Math.max(0, G.hope - 1); }]
    ]],
    ['bg', 'rift'], ['music', 'sad'],
    ['n', 'The center. A platform of perfect glass. Mira hangs inside a crystal column, eyes closed, hands glowing, holding the Rift together with her own body.'],
    ['n', 'Around her, faintly, five shapes flicker in the glass. Shadows of people. A squad.'],
    ['show', KY, 'sad', 'default', 'c'],
    ['say', KY, 'Do you hear them, Handler? Squad One. Eight years I have listened. Tonight I open the door all the way and they walk home.'],
    ['say', KY, 'The city is the price. HALO paid it with them. It can pay it back.', 'cold', 'point'],
    ['choice', [
      { t: '"Your squad is gone, Kyouya. Let them go."', then: [['say', KY, '…You sound like the Board.', 'angry', 'cross']] },
      { t: '"What would they want? Ask them. Really ask."', then: [['do', G => { G.hope++; }], ['say', KY, '……', 'sad']] },
      { t: '"Hikari. Talk to him."', if: G => G.flags.h_forgive, then: [['do', G => { G.hope += 2; }], ['show', H, 'determined', 'default', 'l'],
        ['say', H, 'My mom went back in twelve times. She didn\'t carry you out so you could break the world she died for.'],
        ['say', H, 'She carried you out because she thought you were worth it. So prove her right, Kyouya. Come home.', 'cry'],
        ['say', KY, '…Natsuki said the same thing. "Live, kid. Prove me right."', 'cry']] }
    ]],
    ['if', G => G.hope >= 5, [
      ['music', 'romance'], ['fx', 'hearts'],
      ['n', 'The five shapes in the glass turn toward Kyouya. For a moment their voices come through the comms, faint and warm and impossible.'],
      ['n', '*"Kyouya. Stop listening for us. Start living for us."*'],
      ['say', KY, '…Daichi. Mei. Tomo. Everyone. I\'m sorry. I\'m so sorry I didn\'t come sooner.', 'cry'],
      ['say', KY, 'Handler. I can\'t close it from out here. It has to be pushed from both sides. I\'ll push. Your squad pulls.', 'determined', 'point'],
      ['set', 'good']
    ], [
      ['say', KY, 'No. *No.* I\'m so close—', 'angry', 'fist'], ['sfx', 'shatter'], ['crack'], ['shake', 14],
      ['n', 'The Rift screams. Mira\'s column cracks. The whole sky begins to fold inward.'],
      ['say', KY, '…It\'s collapsing. It will take the city with it unless someone holds the door from the inside.', 'sad', 'default'],
      ['say', KY, 'Get your healer out, Handler. This one is mine. Tell Aya I finally went after them.', 'tender', 'default']
    ]],
    ['hide', KY],
    ['sfx', 'heal'], ['n', 'Mira\'s column shatters. She falls, and Tetsu catches her.'],
    ['show', M, 'tender', 'shy', 'c'],
    ['say', M, '(weakly) …Told you everyone ends up in my med bay eventually. You\'re late, {name}.'],
    ['hide', M],
    ['n', 'The squad pulls. Lightning, shadow, gravity, wind, steel. The Rift begins to close.'],
    ['jump', 'arc1_end']
  ];

  // End of Arc One: the Rift closes, a girl falls out of it, and the Board speaks for the first time.
  S.arc1_end = [
    ['bg', 'glass_city', 'flash'], ['fx', 'glass'], ['music', null], ['light', null],
    ['n', 'The Rift folds shut with a sound like a bell. For one second, Shibuya is completely silent.'],
    ['if', G => G.flags.good, [
      ['music', 'sad'], ['show', KY, 'tender', 'default', 'c'],
      ['n', 'Kyouya Aoi walks out of the light on his own two feet. He is carrying someone.'],
      ['say', KY, 'They said goodbye. All of them, properly, this time. All except one. She would not let go of my hand.'],
      ['hide', KY]
    ], [
      ['music', 'sad'],
      ['n', 'Kyouya Aoi does not come out. Aya stands at the edge of the crossing for a long time, very still.'],
      ['sfx', 'glass'], ['n', 'Then the air cracks one last time and something falls out of the closing seam. Someone.']
    ]],
    ['cg', 'cg_rin'], ['sfx', 'chime'], ['music', 'mystery'],
    ['n', 'A girl. White hair full of glass dust. A HALO jacket with the old winged logo, the one retired eight years ago. Eyes two different colors: cyan and rose.'],
    ['say', RI, '…Is it over? Did we close it? Natsuki-senpai said to count to a thousand and not look back.', 'confused'],
    ['say', RI, 'What day is it?', 'scared'],
    ['cgoff'],
    ['show', RI, 'scared', 'shy', 'c'],
    ['me', 'It has been eight years since Shibuya.'],
    ['say', RI, 'Eight. No. It has been an afternoon. I was only in there for an afternoon.', 'shocked'],
    ['if', G => G.flags.good, [
      ['show', KY, 'crysmile', 'default', 'l'],
      ['say', KY, 'Rin. It\'s all right. It\'s me. I just got old while you were gone.'],
      ['say', RI, '…Nii-san? Your hair. You have a wrinkle. You look like Dad.', 'cry'],
      ['say', KY, 'I know. I know. Come here.', 'cry'],
      ['n', 'Kyouya Aoi, the Glazier, the man who nearly shattered a city, holds his little sister in the middle of Shibuya Crossing and cries like a kid.'],
      ['hide', KY]
    ], [
      ['say', RI, 'Where is my brother? He was right behind me. He pushed me through. He said—', 'cry'],
      ['say', RI, 'He said, "Tell Aya I finally went after them."', 'sob'],
      ['show', A, 'sad', 'default', 'r'],
      ['say', A, '…Of course he did. That idiot. That wonderful idiot.', 'cry'],
      ['hide', A]
    ]],
    ['know', RI],
    ['sfx', 'car'],
    ['n', 'Headlights. A dozen black vans roll into the crossing without sirens or markings. Men in grey armor step out. Every one wears a silver pin: a halo with a crack through it.'],
    ['show', A, 'angry', 'cross', 'r'],
    ['say', A, 'Board Security. What are you doing on my operation?'],
    ['sfx', 'phone'], ['n', 'Every speaker in every van crackles at once. An old man\'s voice, calm, dry, patient, like a teacher who has never once been disobeyed.'],
    ['say', KU, 'Director Takamine. Congratulations on your little miracle. The Board will take custody of the Rift-touched girl now.'],
    ['say', A, 'She is seventeen and she just walked out of hell. She is going to my med bay.', 'furious'],
    ['say', KU, 'Kneel.'],
    ['sfx', 'heartbeat'], ['shake', 6], ['filter', 'mono'], ['zoom', 1.12, 50, 45, 1200],
    ['n', 'Every hero on the crossing drops to one knee. Hikari. Rei. Tetsu. Kaede. Sora. Their faces are shocked. Their bodies simply obey.'],
    ['n', 'Aya\'s knees hit the glass. So do the Board guards\'. So do Rin\'s.'],
    ['t', '…Everyone\'s except mine.'],
    ['n', 'I am the only person still standing in Shibuya Crossing.'],
    ['say', KU, '……How interesting.'],
    ['filter', null], ['zoom', 1],
    ['say', KU, 'Keep the girl, Director. For now. The Board convenes on the first of the month. Bring your Handler.'],
    ['n', 'The vans leave. The heroes gasp, stagger, stand. Nobody can explain what just happened.'],
    ['hideall'],
    ['show', H, 'scared', 'shy', 'c'],
    ['say', H, '{name}. Why couldn\'t I move? Why could you?'],
    ['t', 'I don\'t know. And I don\'t like it.'],
    ['hideall'], ['codex', 'rin'], ['codex', 'board'], ['codex', 'command'], ['codex', 'squadone'],
    ['ach', 'arc1'], ['journal', 'Operation Heartline. The Shibuya Rift is closed. A girl walked out of it. An old man told everyone to kneel. I didn\'t.'],
    ['recap'],
    ['bg', 'black'], ['music', null], ['fx', null],
    ['title', 'END OF ARC ONE', 'The Glazier'],
    ['jump', 'ch6']
  ];

  // ======================= NEW HANG OUTS =======================
  S.hang_hikari_4 = [
    ['bg', 'training'], ['tint', 'night'], ['music', 'night'],
    ['show', H, 'determined', 'fist', 'c'],
    ['say', H, 'Midnight training. I\'m practicing not blowing things up. Can you hold this target? It\'s probably safe.'],
    ['sfx', 'zap'], ['n', 'Tiny sparks walk across her fingertips, slow and precise. The target doesn\'t even singe.'],
    ['say', H, 'See? Control. I\'ve done it every night since the harbor. Since what you said about aiming.', 'happy'],
    ['choice', [{ t: '"You\'ve gotten very good, Hikari."', aff: { hikari: 3 } }, { t: '"Show me again. Slower."', aff: { hikari: 4 }, then: [['say', H, '…You just like watching me do it.', 'wry'], ['say', H, 'I don\'t mind.', 'blush', 'shy']] }]],
    ['do', G => { G.heroes.hikari.st.int++; }], ['n', '*Hikari Intellect +1.*']
  ];
  S.hang_hikari_5 = [
    ['bg', 'park'], ['music', 'romance'], ['fx', 'petals'],
    ['show', H, 'tender', 'default', 'c'],
    ['n', 'A small memorial in the corner of the park. Sunflowers. A photo of a woman in a hard hat, grinning exactly like Hikari.'],
    ['say', H, 'Hi, Mom. This is {name}. He\'s the one I told you about. The one with the notebook.', 'blush', 'shy'],
    ['say', H, 'I used to come here to apologize for being late. Now I come to tell her who I got to this week.', 'smile'],
    ['choice', [{ t: '"Nice to meet you, Mrs. Amane. Your daughter is the bravest person I know."', aff: { hikari: 5 } }, { t: 'Put a sunflower beside hers.', aff: { hikari: 4 } }]],
    ['say', H, '…She would have liked you. She liked people who noticed things.', 'fond', 'shy']
  ];
  S.hang_rei_4 = [
    ['bg', 'hq_lobby'], ['tint', 'night'], ['music', 'sad'],
    ['n', 'An empty rec room on floor 33. Someone is playing piano, clumsy, careful, stubborn.'],
    ['show', R, 'stunned', 'shy', 'c'],
    ['say', R, '……You weren\'t supposed to hear that.'],
    ['say', R, 'My mother taught me before my Spark. After it, the shadows kept pressing the keys. I stopped.', 'sad', 'default'],
    ['choice', [{ t: '"Play it again. I\'ll turn the lights up so there aren\'t any shadows."', aff: { rei: 4 }, then: [['n', 'She plays. The shadows stay still. Her hands shake only a little.']] }, { t: 'Sit beside her on the bench.', aff: { rei: 3 } }]],
    ['say', R, '…It\'s a lullaby. It\'s embarrassing. Forget it by tomorrow.', 'blush', 'cross'],
    ['do', G => { G.heroes.rei.st.cha++; }], ['n', '*Rei Charisma +1.*']
  ];
  S.hang_rei_5 = [
    ['bg', 'alley'], ['music', 'romance'],
    ['show', R, 'tender', 'shy', 'c'],
    ['say', R, 'Ren wrote back. My old partner. He teaches middle school now. He has a daughter. He named her Rei.'],
    ['say', R, 'He said, "Stop punishing yourself for a night I already forgave."', 'cry'],
    ['say', R, 'I don\'t know how to do that. But I think I would like to learn. With someone nearby.', 'fond', 'shy'],
    ['choice', [{ t: '"I\'ll be nearby. Always."', aff: { rei: 5 } }, { t: 'Pet Receipt, who has climbed into your lap.', aff: { rei: 4 } }]]
  ];
  S.hang_mira_4 = [
    ['bg', 'medbay'], ['music', 'romance'],
    ['show', M, 'smile', 'default', 'c'],
    ['say', M, 'First-aid lesson. If you\'re going to run a board full of reckless heroes, you\'re going to learn to wrap a bandage.'],
    ['n', 'Her hands guide mine. Around, over, tuck. Around, over, tuck. She doesn\'t let go when the bandage is done.'],
    ['choice', [{ t: '"…You can let go now."', aff: { mira: 2 }, then: [['say', M, 'I know. I\'m choosing not to.', 'wry']] }, { t: 'Say nothing. Don\'t let go either.', aff: { mira: 4 } }]],
    ['say', M, '…Your pulse is a hundred and ten. An observation. Purely medical.', 'blush', 'shy']
  ];
  S.hang_mira_5 = [
    ['bg', 'park'], ['music', 'romance'], ['fx', 'petals'],
    ['show', M, 'tender', 'default', 'c'],
    ['say', M, 'A whole day off. I don\'t know what to do with my hands. Should I be healing a squirrel?'],
    ['n', 'We spend the afternoon doing nothing useful. By three she has fallen asleep on my shoulder.'],
    ['say', M, '(sleepily) …This is the first time I\'ve rested without feeling guilty. Stay a little longer?', 'fond', 'shy'],
    ['choice', [{ t: '"As long as you want."', aff: { mira: 5 } }, { t: 'Carefully put your jacket over her.', aff: { mira: 4 } }]]
  ];
  S.hang_kaede_1 = [
    ['bg', 'rooftop'], ['tint', 'noon'], ['music', 'daily'],
    ['show', K, 'smug', 'hip', 'c'],
    ['say', K, 'Race to the top of the tower. You take the elevator. I take the stairs. Eighty floors. Go.'],
    ['sfx', 'whoosh'], ['n', 'When the elevator doors open on the roof she is lying on her back, eating a popsicle.'],
    ['choice', [{ t: '"Show-off."', aff: { kaede: 2 }, then: [['say', K, 'Correct.', 'smug']] }, { t: '"That was genuinely amazing."', aff: { kaede: 3 }, then: [['say', K, '…Well. Yeah. Obviously.', 'blush', 'cross']] }]],
    ['do', G => { G.heroes.kaede.st.vig++; }], ['n', '*Kaede Vigor +1.*']
  ];
  S.hang_kaede_2 = [
    ['bg', 'city_night'], ['tint', 'evening'], ['music', 'night'],
    ['show', K, 'sad', 'default', 'c'],
    ['say', K, 'You know what everyone says about me? "Kaede\'s fast." That\'s the whole review.'],
    ['say', K, 'Hikari throws lightning. Rei walks through walls. I get there. And then I stand there.', 'sad', 'cross'],
    ['choice', [{ t: '"Getting there is half of every rescue. I\'ve watched you save people seconds before it was too late."', aff: { kaede: 4 } }, { t: '"Then let\'s train your Charisma. You\'d make a great negotiator."', aff: { kaede: 3 }, then: [['do', G => { G.heroes.kaede.st.cha++; }], ['n', '*Kaede Charisma +1.*']] }]],
    ['say', K, '…Thanks, Handler. You\'re kind of good at this.', 'blush', 'shy']
  ];
  S.hang_kaede_3 = [
    ['bg', 'park'], ['music', 'romance'],
    ['show', K, 'tender', 'default', 'c'],
    ['say', K, 'At the academy I ran every night until my legs bled. Not to win. So nobody would notice I was scared.'],
    ['say', K, 'You notice everything. It\'s really annoying. …I like it.', 'blush', 'cross'],
    ['choice', [{ t: '"You don\'t have to run from me."', aff: { kaede: 5 } }, { t: '"Walk with me instead."', aff: { kaede: 4 } }]],
    ['say', K, '…Walking is slow. Okay. Just this once.', 'fond', 'shy']
  ];
  S.hang_kaede_x = [['bg', 'hq_lobby'], ['show', K, 'smug', 'point', 'c'], ['say', K, 'Timed you reading that report. Four minutes. I would have done it in forty seconds.'], ['aff', K, 1]];
  S.hang_sora_1 = [
    ['bg', 'arcade'], ['music', 'daily'], ['fx', 'sparks'],
    ['show', SO, 'happy', 'wave', 'c'],
    ['say', SO, 'I have never been to an arcade. My manager said they\'re "off-brand." What\'s this one? A dance game? Oh, I\'m going to destroy this.'],
    ['n', 'She gets a perfect score. Then she floats a prize out of the claw machine with gravity. Then she apologizes to the claw machine.'],
    ['choice', [{ t: '"That was the most fun I\'ve had in weeks."', aff: { sora: 3 } }, { t: 'Win her a plush the normal way (after eleven tries).', aff: { sora: 4 }, then: [['say', SO, 'You spent eleven hundred yen on a three-hundred-yen plush. For me. I\'m keeping it forever.', 'fond', 'shy']] }]],
    ['do', G => { G.heroes.sora.st.mob++; }], ['n', '*Sora Mobility +1.*']
  ];
  S.hang_sora_2 = [
    ['bg', 'rooftop'], ['tint', 'night'], ['music', 'romance'], ['fx', 'stars'],
    ['show', SO, 'tender', 'default', 'c'],
    ['say', SO, 'Can I sing something? Not for a stream. Just to see what it sounds like when nobody is counting.'],
    ['n', 'She sings quietly, off-key on purpose on the high note, and laughs halfway through.'],
    ['choice', [{ t: '"That\'s my favorite song of yours now."', aff: { sora: 4 } }, { t: 'Hum the next verse back, badly.', aff: { sora: 3 }, then: [['say', SO, 'You\'re terrible. Do it again.', 'laugh']] }]]
  ];
  S.hang_sora_3 = [
    ['bg', 'stage'], ['music', 'sad'],
    ['show', SO, 'sad', 'default', 'c'],
    ['say', SO, 'My real name is Hoshino Sorako. STELLAR changed it when I was eleven. They changed my hair color, my laugh, my birthday.'],
    ['say', SO, 'Sometimes I don\'t know which parts are me. Except here. With the squad. With you.', 'hurt'],
    ['choice', [{ t: '"Then let\'s find out together which parts are you. Starting with your real birthday."', aff: { sora: 5 } }, { t: '"Sorako. That\'s a good name."', aff: { sora: 4 }, then: [['say', SO, '……Say it again?', 'fond', 'shy']] }]]
  ];
  S.hang_sora_x = [['bg', 'cafe'], ['show', SO, 'smile', 'hip', 'c'], ['say', SO, 'Coffee break. I ordered you something with seven syrups. It\'s an idol thing.'], ['aff', SO, 1]];
  S.hang_tetsu_1 = [
    ['bg', 'apartment'], ['tint', 'evening'], ['music', 'night'],
    ['show', T, 'smile', 'default', 'c'],
    ['say', T, 'This is Kazuo. He\'s a juniper bonsai. Forty years old. I\'m very careful with him.'],
    ['n', 'Tetsu trims a single leaf with tweezers, holding his breath. His steel-strong hands do not shake at all.'],
    ['choice', [{ t: '"He\'s beautiful, Tetsu."', aff: { tetsu: 3 } }, { t: '"Can you teach me?"', aff: { tetsu: 4 }, then: [['say', T, 'Really? Okay. First rule: patience. Second rule: keep Hikari away from him.', 'happy']] }]],
    ['t', 'He is very polite when he talks about the people who have hurt Kazuo before. Quieter, each time. The more polite he gets, the angrier he is.'],
    ['tell', T, 'polite', 'Gets quieter and more polite the angrier he is. When Tetsu says "please," be ready.'],
    ['do', G => { G.heroes.tetsu.st.int++; }], ['n', '*Tetsu Intellect +1.*']
  ];
  S.hang_tetsu_2 = [
    ['bg', 'ramen'], ['music', 'daily'],
    ['show', T, 'tender', 'default', 'c'],
    ['say', T, 'I send half my pay home. Both my sisters are at university now. First in our family.'],
    ['say', T, 'When the Spark came I was scared it meant I\'d turn into a weapon. Now I think of it as being a very good wall for people to stand behind.', 'smile'],
    ['choice', [{ t: '"You\'re the best wall I know."', aff: { tetsu: 4 } }, { t: '"Your sisters must be proud."', aff: { tetsu: 3 } }]],
    ['do', G => { G.heroes.tetsu.st.cha++; }], ['n', '*Tetsu Charisma +1.*']
  ];
  S.hang_tetsu_x = [['bg', 'training'], ['show', T, 'happy', 'default', 'c'], ['say', T, 'Want to spot me? I\'m lifting the training room door. It came off again.'], ['aff', T, 1]];
  return S;
})());

/* HEARTLINE AGENCY — Chapter 4, Final Chapter, endings, and hang-out scenes. */
Object.assign(STORY.scripts, (() => {
  const H = 'hikari', R = 'rei', M = 'mira', A = 'aya', B = 'bit', K = 'kaede', T = 'tetsu', SO = 'sora', GZ = 'glazier', KY = 'kyouya';
  const S = {};

  // ======================= CHAPTER 4 =======================
  S.ch4 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 4', 'Shattered City'],
    ['chapter', 4, 'Ch.4 Shattered City', 'the Grand Rift', 16],
    ['bg', 'glass_city'], ['music', 'mystery'], ['fx', 'glass'],
    ['n', "Three days after the tower siege, Shibuya's first new Rift opened at 4:12 AM. By sunrise, six city blocks were glass."],
    ['n', "By the second day, there were four more."],
    ['bg', 'ops'], ['fx', null], ['music', 'tension'],
    ['show', A, 'determined', 'cross', 'c'],
    ['say', A, "He's using the sealed schematics. Every small Rift he opens is tuning the big one — Shibuya — like tuning a bell."],
    ['say', A, "The Board has dropped its investigation into you, by the way. Recovered logs cleared you. They'd like you to know they were “always confident.”", 'smug'],
    ['me', "Of course they were."],
    ['say', A, "Curfew is citywide. Every hero agency is stretched. From now on, our shifts are going to be… long.", 'cold', 'point'],
    ['hideall'],
    ['show', SO, 'sad', 'default', 'c'], ['sfx', 'phone'],
    ['say', SO, "{name}… STELLAR called. They're pulling me out of the city. “Our talent is too valuable to risk.”"],
    ['say', SO, "Talent. Like I'm a product line. They've already booked my flight.", 'cry'],
    ['choice', [
      { t: "“You're not a product. You're one of us. Stay — I'll fight STELLAR myself if I have to.”", aff: { sora: 4 }, set: 'sora_stay', then: [['say', SO, "…You'd fight my *agency*? With what, a clipboard?", 'surprised'], ['me', "With a very aggressive clipboard."], ['say', SO, "Ehehe… Okay. I'm staying. They can sue me.", 'love', 'shy']] },
      { t: "“It's your choice, Sora. Whatever you choose, I'm proud of you.”", aff: { sora: 2 }, then: [['say', SO, "…Then I choose to go and think. Just for a little while. I'll come back, okay? I promise I'll come back.", 'cry'], ['recruit', SO, 0]] }
    ]],
    ['hideall'],
    ['daycard'],
    ['shift', { title: 'Day 13 · Curfew', calls: 11, tiers: [2, 3], diff: 1.4, special: [{ at: 170, t: 'Glass Bloom — Shibuya Edge', d: 'A Rift is opening in a crowded street. Glass is spreading outward like frost.', r: '5 6 4 5 5', n: 3, tier: 4, dist: 'shibuya', flag: 'c4_bloom', ev: 'glassbloom' }] }],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch4_day14'],
    ['shift', { title: 'Day 14 · Fault Lines', calls: 12, tiers: [2, 4], diff: 1.45 }],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch4_day15'],
    ['shift', { title: 'Day 15 · Shadow Hours', calls: 12, tiers: [2, 4], diff: 1.5, special: [{ at: 210, t: 'Shadow Surge — Riverside', d: "Rei's shadows are out of control at a Rift site. She's asking for backup. Her voice is shaking.", r: '3 6 3 7 5', n: 2, tier: 4, dist: 'riverside', flag: 'c4_rei', ev: 'shadowsurge' }] }],
    ['call', 'ch4_after15'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['jump', 'ch4_climax']
  ];
  S.ch4_day14 = [
    ['bg', 'training'], ['music', 'sad'], ['tint', null],
    ['n', "Early morning. The training room is dark except for one flickering light — and a girl sitting under it with a sealed HALO file on her knees."],
    ['show', H, 'sad', 'default', 'c'],
    ['say', H, "Mira gave it to me. The Shibuya file. She said I had the right to know."],
    ['say', H, "My mom went in twelve times. The last person she carried out was him. Kyouya Aoi. She saved the man who's breaking the city.", 'cry'],
    ['say', H, "…Did you know?", 'sad', 'shy'],
    ['choice', [
      { t: "“I found out three days ago. I should have told you. I'm sorry.”", aff: { hikari: 3 }, set: 'h_honest', then: [['say', H, "…Yeah. You should've.", 'pout', 'cross'], ['say', H, "But you're telling me now, looking right at me. Mom always said that's what counts.", 'tender']] },
      { t: "“It wasn't my secret to tell. It was yours to find.”", aff: { hikari: 1 }, then: [['say', H, "…Maybe. It still feels like the floor fell out.", 'sad']] }
    ]],
    ['say', H, "Part of me wants to hate him. But she thought he was worth carrying. She didn't carry people she thought were garbage.", 'determined', 'fist'],
    ['say', H, "When we find him… I want to talk to him. Before anyone throws a punch. Even me.", 'determined', 'default'],
    ['set', 'h_forgive'],
    ['hideall']
  ];
  S.ch4_day15 = [
    ['bg', 'hq_lobby'], ['music', 'mystery'],
    ['show', R, 'scared', 'cross', 'c'],
    ['say', R, "The shadows are loud today. Louder than the harbor. Louder than… three years ago."],
    ['say', R, "Every Rift he opens makes them louder. It's like they're being *called*.", 'sad'],
    ['say', R, "If it happens out there — pull everyone back. Even me. Especially me.", 'determined', 'point'],
    ['me', "I heard you the first time, Rei. The answer's still no."],
    ['say', R, "……Stubborn.", 'blush', 'cross'],
    ['hideall']
  ];
  S.ch4_after15 = [
    ['bg', 'glass_city'], ['music', 'sad'], ['fx', 'shadow'],
    ['if', G => G.flags.c4_rei > 0, [
      ['show', R, 'cry', 'shy', 'c'],
      ['n', "They got to her in time. The team stood around her in a circle and just kept *talking* — about ramen, about cats, about nothing — until the shadows went quiet."],
      ['say', R, "Nobody ran. Three years ago, everyone ran.", 'cry'],
      ['say', R, "…You built a squad that doesn't run, {name}.", 'tender', 'shy'], ['aff', R, 3], ['set', 'rei_calm']
    ], [
      ['show', R, 'sad', 'default', 'c'],
      ['n', "By the time the team arrived, Rei had forced the shadows back alone. Both of her hands are bandaged."],
      ['say', R, "I told you. Pull back. You didn't have to see that.", 'cold', 'cross'],
      ['me', "I'm not going anywhere, Rei."],
      ['say', R, "……I know. That's what scares me.", 'sad', 'shy'], ['aff', R, 1]
    ]],
    ['hideall']
  ];
  S.ch4_climax = [
    ['autosave'],
    ['shift', { title: 'Day 16 · Evacuation', calls: 11, tiers: [2, 4], diff: 1.5, real: 300, special: [{ at: 200, t: 'Field Hospital — Shibuya Crossing', d: "Mira's field hospital is treating 200 evacuees near the Rift. Glass is creeping toward the tents.", r: '4 7 3 5 5', n: 3, tier: 4, dist: 'shibuya', flag: 'c4_hosp', ev: 'glassbloom' }] }],
    ['bg', 'glass_city'], ['music', 'tension'], ['fx', 'glass'],
    ['n', "17:30. Shibuya Crossing. Mira's field hospital is the last lit place in a city of crystal."],
    ['show', M, 'determined', 'shy', 'r'],
    ['say', M, "(comms) Last evacuees loading now, {name}. Tell the squad they can come get a snack. I made onigiri. Shaped like you.", 'smile'],
    ['sfx', 'glass'], ['shake', 10], ['music', 'action'],
    ['show', GZ, 'cold', 'point', 'l'],
    ['say', GZ, "Mira Solace. The healer who takes the wound into herself."],
    ['say', GZ, "Inside the Rift, human bodies break. I need someone who can hold them together while I bring my squad home.", 'sad'],
    ['say', M, "…You're not going to hurt anyone else, Kyouya. I won't let you.", 'determined', 'fist'],
    ['eye', { prompt: 'Kyouya is reaching for Mira. The squad is thirty seconds out. What do you do?', time: 9000, opts: [
      { t: "“Kaede — full speed. Tag Mira with a tracker. Don't engage!”", ok: 1, set: 'tracker', aff: { kaede: 2 } },
      { t: "“Tetsu, grab him! Don't let go!”", set: 'grab', aff: { tetsu: 1 } },
      { t: "“Mira — run!”", timeout: 1 }
    ] }],
    ['if', G => G.flags.tracker, [
      ['sfx', 'whoosh'], ['n', "A green blur. Kaede brushes past Mira's sleeve so fast the Glazier doesn't even turn his head. A tiny HALO beacon blinks on Mira's collar."],
      ['say', K, "(comms) Tag's on! She's a walking lighthouse now!", 'smug']
    ], [
      ['n', "Tetsu hits him like a freight train. The Glazier turns to glass — a decoy — and shatters. The real one is already behind Mira."]
    ]],
    ['show', H, 'determined', 'fist', 'c'],
    ['say', H, "Kyouya Aoi! My mom carried you out of that Rift! Her name was Natsuki Amane!", 'angry'],
    ['say', GZ, "……", 'sad'],
    ['say', GZ, "You have her eyes. She told me to *live*. I've been trying to do it right ever since.", 'sad', 'default'],
    ['say', GZ, "I'm sorry, Hikari. Tomorrow night, everyone comes home.", 'cold', 'point'],
    ['sfx', 'glass'], ['flash', '#9ff'], ['hide', M], ['hide', GZ],
    ['n', "The crossing flashes white. When it clears, the hospital is empty. Mira is gone."],
    ['bg', 'office'], ['music', 'sad'], ['fx', null],
    ['show', A, 'determined', 'cross', 'c'],
    ['if', G => G.flags.tracker, [
      ['say', A, "Kaede's tracker is live. Mira's inside the Shibuya Rift — and she's alive."]
    ], [
      ['say', A, "We have no signal. But there's only one place he'd take her. The Shibuya Rift."]
    ]],
    ['say', A, "Tomorrow night the Rift peaks. He'll open it fully. If he does, the glass won't stop at Shibuya.", 'cold'],
    ['say', A, "Eight years ago, I let the Board send a squad in and I never went after them. I'm not doing that again.", 'determined', 'point'],
    ['say', A, "*Operation Heartline*. Every agency in the city holds the streets. Squad Zero goes in. And you — you run it.", 'determined', 'cross'],
    ['ach', 'ch4'], ['hideall'],
    ['jump', 'ch5']
  ];

  // ======================= FINAL CHAPTER =======================
  S.ch5 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'FINAL CHAPTER', 'Heartline'],
    ['chapter', 5, 'Final · Heartline', 'Operation Heartline', 18],
    ['bg', 'rooftop'], ['tint', 'evening'], ['music', 'romance'], ['fx', 'petals'],
    ['n', "The night before Operation Heartline. Someone dragged a grill onto the HALO Tower roof. Nobody asked permission."],
    ['if', G => !G.roster.includes('sora'), [
      ['sfx', 'chime'], ['show', SO, 'sweat', 'shy', 'r'],
      ['say', SO, "Um. Hi. I got to the airport and then I got back in the taxi. Is there room on the board for one more?"],
      ['me', "There was never not room."],
      ['say', SO, "…Ehehe. Okay. Okay, good.", 'cry'], ['recruit', SO], ['aff', SO, 2], ['hide', SO]
    ]],
    ['show', T, 'happy', 'default', 'l'],
    ['say', T, "Grill's hot! I brought enough meat for thirty people. So, enough for Hikari."],
    ['show', H, 'happy', 'wave', 'c'],
    ['say', H, "HEY. …Accurate, but HEY."],
    ['show', K, 'smug', 'hip', 'r'],
    ['say', K, "Last one to the grill does the dishes. Starting… now."], ['sfx', 'whoosh'],
    ['hideall'],
    ['show', R, 'smile', 'cross', 'l'], ['show', SO, 'laugh', 'hip', 'r'],
    ['say', SO, "Rei, smile for the squad photo!"],
    ['say', R, "I am smiling.", 'smile'],
    ['say', SO, "That's your smiling face? Oh no. Oh, that's adorable.", 'love'],
    ['hideall'],
    ['show', A, 'tender', 'default', 'c'],
    ['say', A, "…I brought drinks. Non-alcoholic. Mostly."],
    ['say', A, "{name}. I said once that Handlers who get attached make bad decisions.", 'sad'],
    ['say', A, "I was wrong. The good ones get attached, and make hard ones. Thank you for proving it.", 'smile'],
    ['show', B, 'happy', '', 'r'],
    ['say', B, "I have prepared a playlist for the barbecue. It is ninety minutes of beeping. It is a tribute.", 'happy'],
    ['hideall'],
    ['hub'],
    ['bg', 'rooftop'], ['tint', 'night'], ['music', 'romance'], ['fx', 'stars'],
    ['n', "Midnight. The grill is cold. The squad has scattered to rest. There's someone you want to see before tomorrow."],
    ['choice', [
      { t: 'Find Hikari.', if: G => G.aff.hikari >= 10, then: [['set', 'route', 'hikari']] },
      { t: 'Find Rei.', if: G => G.aff.rei >= 10, then: [['set', 'route', 'rei']] },
      { t: 'Find Mira… in the only way you can — at her empty desk.', if: G => G.aff.mira >= 10, then: [['set', 'route', 'mira']] },
      { t: 'Find Sora.', if: G => G.aff.sora >= 10 && G.roster.includes('sora'), then: [['set', 'route', 'sora']] },
      { t: 'Find Kaede.', if: G => G.aff.kaede >= 10, then: [['set', 'route', 'kaede']] },
      { t: 'Stay on the roof with whoever is left. The whole squad matters.', then: [['set', 'route', 'squad']] }
    ]],
    ['jumpf', 'eve_', 'route']
  ];
  const toOp = [['nextday'], ['daycard'], ['jump', 'ch5_op']];
  S.eve_hikari = [
    ['show', H, 'tender', 'shy', 'c'],
    ['say', H, "You came to find me. …I was hoping you would."],
    ['say', H, "Tomorrow I'm going to look the man my mom saved in the eye. I'm scared I'll hate him. I'm scared I won't.", 'sad'],
    ['say', H, "But when I'm scared, I think about your voice on comms. Calm. Like you already know I'll make it.", 'blush'],
    ['say', H, "{name}… I like you. Not partner-like. Like-like. Ramen-alone-at-night like. Okay I said it I'm going to go explode now—", 'love', 'shy'],
    ['choice', [{ t: "“Don't explode. I like you too, Hikari.”", aff: { hikari: 5 } }, { t: 'Take her hand instead of answering.', aff: { hikari: 4 } }]],
    ['say', H, "…Then we're both coming home tomorrow. That's an order, Handler.", 'love', 'wave'],
    ...toOp
  ];
  S.eve_rei = [
    ['sfx', 'shadow'], ['show', R, 'neutral', 'cross', 'c'],
    ['say', R, "I felt you coming. Your shadow walks differently when you're nervous."],
    ['say', R, "Tomorrow, the Rift will pull on the shadows harder than anything. If I lose control in there…", 'sad', 'default'],
    ['say', R, "…I wrote to Jun. My old partner. I told him about you. I told him I'm not alone anymore.", 'tender', 'shy'],
    ['say', R, "I've never said this to anyone, so I'm going to say it badly. I love you, {name}. Don't make it a big deal.", 'blush', 'cross'],
    ['choice', [{ t: "“It's a huge deal. I love you too, Rei.”", aff: { rei: 5 } }, { t: "“Say it badly again. I want to remember it.”", aff: { rei: 4 } }]],
    ['say', R, "…Idiot. …Mine, though.", 'love', 'shy'],
    ...toOp
  ];
  S.eve_mira = [
    ['bg', 'medbay'], ['music', 'sad'],
    ['n', "The med bay. Her mug is still on the desk. There's a sticky note on your chair in her handwriting: *EAT SOMETHING. — M.*"],
    ['t', "She left this before the field hospital. She was still taking care of me."],
    ['show', B, 'sad', '', 'c'],
    ['say', B, "Handler. Mira asked me to save a message for you, “only if things got bad.” I have decided things are bad."],
    ['n', "*“Hi. If you're hearing this, I did something reckless, which is your job, not mine. Please sleep. Please eat. And please… come get me. I'd like to have that date. Medically. — Mira.”*"],
    ['choice', [{ t: "“I'm coming, Mira. I promise.”", aff: { mira: 5 } }, { t: 'Eat the onigiri she left. Every bite.', aff: { mira: 4 } }]],
    ['hide', B],
    ...toOp
  ];
  S.eve_sora = [
    ['bg', 'stage'], ['music', 'romance'], ['fx', 'hearts'],
    ['show', SO, 'smile', 'default', 'c'],
    ['say', SO, "An empty arena. My favorite kind. No cameras. No manager. Just one audience member."],
    ['say', SO, "I wrote a song. It's not for streams. It's about a person who listens to the part nobody listens to.", 'blush', 'shy'],
    ['n', "She sings. Her voice fills twenty thousand empty seats — and somehow it's only for you."],
    ['say', SO, "…That's you. The song. If that wasn't obvious. I'm in love with you, Handler. Is that allowed?", 'love', 'shy'],
    ['choice', [{ t: "“It's allowed. I'm in love with you too, Sora.”", aff: { sora: 5 } }, { t: 'Applaud. Loudly. For a very long time.', aff: { sora: 4 } }]],
    ['say', SO, "Ehehe… Then let's win tomorrow. I want an encore.", 'happy', 'wave'],
    ...toOp
  ];
  S.eve_kaede = [
    ['bg', 'glass_city'], ['music', 'romance'], ['fx', 'glass'],
    ['show', K, 'neutral', 'hip', 'c'],
    ['say', K, "Took you long enough. I've run around the city eleven times waiting."],
    ['say', K, "At the mall, when I fell… the only thing I thought was, “He told me to hold, and I didn't.”", 'sad'],
    ['say', K, "You're the first person who ever made me want to *wait*. Do you know how weird that is for me?", 'blush', 'cross'],
    ['say', K, "So. I like you. A lot. That's it. That's the whole race.", 'love', 'shy'],
    ['choice', [{ t: "“You win. I like you too, Kaede.”", aff: { kaede: 5 } }, { t: "“Race you to saying it again.”", aff: { kaede: 4 } }]],
    ['say', K, "…Cheater. Okay. Tomorrow, I hold when you say hold. And after that, you're buying sneakers.", 'happy', 'point'],
    ...toOp
  ];
  S.eve_squad = [
    ['show', T, 'smile', 'default', 'l'], ['show', B, 'happy', '', 'r'],
    ['say', T, "Couldn't sleep either, Handler?"],
    ['n', "One by one they drift back up — Hikari with a blanket, Rei out of a shadow, Kaede on the fence, Sora humming. Nobody says why."],
    ['say', T, "My sisters used to say home isn't a place. It's the people who come back up to the roof at midnight.", 'tender'],
    ['say', B, "I have recorded this moment. File name: *family*. Beep.", 'happy'],
    ...toOp
  ];
  S.ch5_op = [
    ['autosave'],
    ['bg', 'ops'], ['music', 'tension'],
    ['show', A, 'determined', 'cross', 'c'],
    ['say', A, "Operation Heartline. Every agency holds the streets while the Rift peaks. You dispatch them all."],
    ['say', A, "At 17:00, Squad Zero goes in. Make the city hold until then.", 'determined', 'point'],
    ['hideall'],
    ['shift', { title: 'Day 18 · OPERATION HEARTLINE', calls: 13, tiers: [2, 4], diff: 1.55, real: 360, special: [{ at: 90, t: 'Glass Tide — Harbor', d: 'A wave of crystal rolling in from the bay. The seawall needs everyone strong.', r: '6 7 3 3 4', n: 3, tier: 4, dist: 'harbor', flag: 'f_tide', ev: 'glassbloom' }, { at: 240, t: 'Rift Pulse — Old Town Shelter', d: '400 people in a shelter. The ceiling is turning to glass.', r: '4 6 4 7 5', n: 3, tier: 4, dist: 'oldtown', flag: 'f_shelter', ev: 'crowd' }, { at: 360, t: 'Last Call — Shibuya Perimeter', d: 'The final Prism cell is guarding the Rift entrance. Clear the way.', r: '8 5 5 3 5', n: 3, tier: 4, dist: 'shibuya', flag: 'f_gate', ev: 'siege' }] }],
    ['jump', 'finale']
  ];

  S.finale = [
    ['bg', 'ops'], ['music', 'mystery'],
    ['do', G => { const sh = G.shifts.slice(-1)[0] || { ok: 0, total: 1 }; G.flags.city = sh.ok / Math.max(1, sh.total) >= .6 ? 1 : 0; G.hope = (G.flags.bit_saved ? 1 : 0) + (G.flags.hk_bond ? 1 : 0) + (G.flags.h_forgive ? 1 : 0) + (G.flags.rei_calm ? 1 : 0) + (G.flags.tracker ? 1 : 0) + (G.flags.sora_stay ? 1 : 0) + G.flags.city; }],
    ['if', G => G.flags.city, [['n', "17:00. Every district reports in. The city is bruised, glittering, and *holding*."]], [['n', "17:00. Three districts have gone dark. The agencies are exhausted. There's no more time — the Rift is peaking."]]],
    ['bg', 'glass_city'], ['music', 'action'], ['fx', 'glass'],
    ['show', A, 'determined', 'cross', 'c'],
    ['say', A, "(comms) Squad Zero, you're go. {name}, they're yours."],
    ['hideall'],
    ['bg', 'rift'], ['fx', 'glass'], ['letterbox', 1],
    ['cg', 'cg_final'], ['sfx', 'thunder'], ['shake', 10],
    ['n', "Inside the Shibuya Rift, the sky is a cathedral of broken light. Buildings float upside down. Glass bridges spiral into nothing."],
    ['n', "And somewhere at the center, a heartbeat — Mira's — on your screen."],
    ['cgoff'], ['letterbox', 0],
    ['sfx', 'roar'], ['shake', 8],
    ['eye', { prompt: 'Glass guardians pour out of the bridges — a dozen of them. Formation?', time: 9000, opts: [
      { t: '“Tetsu front. Rei and Kaede flank. Sora pins them. Hikari — finish on my mark.”', ok: 1, set: 'f1', aff: { tetsu: 1 } },
      { t: '“Everyone hit the biggest one, now!”' },
      { t: '“Fall back to the entrance!”', timeout: 1 }
    ] }],
    ['if', G => G.flags.f1, [
      ['show', T, 'determined', 'cross', 'l'], ['say', T, "Steel skin! Come on, then!"],
      ['show', SO, 'determined', 'point', 'r'], ['say', SO, "Gravity — DOWN!"], ['sfx', 'boom'], ['shake', 10],
      ['show', H, 'angry', 'fist', 'c'], ['say', H, "NOW, {name}?!"], ['me', "NOW!"],
      ['sfx', 'thunder'], ['flash', '#fff'], ['n', "Twelve guardians shatter in the same heartbeat."], ['hideall']
    ], [
      ['sfx', 'boom'], ['shake', 12], ['n', "It works — barely. Tetsu takes a spike through the shoulder that would have killed anyone else. Kaede's ankle cracks. They keep moving."],
      ['do', G => { G.hope = Math.max(0, G.hope - 1); }]
    ]],
    ['bg', 'rift'], ['music', 'sad'],
    ['n', "The center. A platform of perfect glass. Mira hangs inside a crystal column, eyes closed, hands glowing — holding the Rift together with her own body."],
    ['n', "Around her, faintly, five shapes flicker in the glass. Shadows of people. A squad."],
    ['show', KY, 'sad', 'default', 'c'],
    ['say', KY, "Do you hear them, Handler? Squad One. Eight years I've listened. Tonight I open the door all the way, and they walk home."],
    ['say', KY, "The city is the price. HALO paid it with them. It can pay it back.", 'cold', 'point'],
    ['choice', [
      { t: "“Your squad is gone, Kyouya. Let them go.”", then: [['say', KY, "…You sound like the Board.", 'angry', 'cross']] },
      { t: "“What would they want? Ask them. Really ask.”", then: [['do', G => { G.hope++; }], ['say', KY, "……", 'sad']] },
      { t: "“Hikari. Talk to him.”", if: G => G.flags.h_forgive, then: [['do', G => { G.hope += 2; }], ['show', H, 'determined', 'default', 'l'],
        ['say', H, "My mom went back in twelve times. She didn't carry you out so you could break the world she died for."],
        ['say', H, "She carried you out because she thought you were *worth it*. So prove her right, Kyouya. Come home.", 'cry'],
        ['say', KY, "…Natsuki said the same thing. “Live, kid. Prove me right.”", 'cry']] }
    ]],
    ['if', G => G.hope >= 5, [
      ['music', 'romance'], ['fx', 'hearts'],
      ['n', "The five shapes in the glass turn toward Kyouya. For a moment, their voices come through the comms — faint, warm, impossible."],
      ['n', "*“Kyouya. Stop listening for us. Start living for us.”*"],
      ['say', KY, "…Rin. Daichi. Everyone. I— I'm sorry. I'm so sorry I didn't come sooner.", 'cry'],
      ['say', KY, "Handler. I can't close it from out here — it has to be pushed from both sides. I'll push. Your squad pulls.", 'determined', 'point'],
      ['set', 'good']
    ], [
      ['say', KY, "No. NO. I'm so close—", 'angry', 'fist'], ['sfx', 'shatter'], ['shake', 14],
      ['n', "The Rift screams. Mira's column cracks. The whole sky begins to fold inward."],
      ['say', KY, "…It's collapsing. It'll take the city with it unless someone holds the door from inside.", 'sad', 'default'],
      ['say', KY, "Get your healer out, Handler. This one's mine. Tell Aya… I finally went after them.", 'tender', 'default']
    ]],
    ['hide', KY],
    ['sfx', 'heal'], ['n', "Mira's column shatters. She falls — and Tetsu catches her."],
    ['show', M, 'tender', 'shy', 'c'],
    ['say', M, "(weakly) …Told you everyone ends up in my med bay eventually. You're late, {name}."],
    ['hide', M],
    ['n', "The squad pulls. Lightning, shadow, gravity, wind, steel. The Rift begins to close — and drags one of them with it."],
    ['jumpf', 'save_', 'route']
  ];
  const afterSave = [['jump', 'epilogue']];
  const saveScene = (who, line1, line2) => [
    ['sfx', 'shatter'], ['shake', 12],
    ['n', `The closing Rift pulls ${who === 'squad' ? 'Tetsu' : '*her*'} backward into the light. The comms go silent.`],
    ['eye', { prompt: 'No Spark. No powers. Just you, and the place where she disappeared.', time: 8000, opts: [{ t: 'Walk into the Rift.', ok: 1 }, { t: 'Run into the Rift.', ok: 1, timeout: 1 }] }],
    ['bg', 'white'], ['music', 'romance'], ['fx', 'glass'],
    ['n', "Inside, there is no up or down. Only light, and the sound of your own heartbeat, and — very faintly — hers."],
    ['n', "You don't need a Spark to find her. You've been reading her every move for weeks."],
    ...(who === 'squad' ? [['show', T, 'tender', 'default', 'c']] : [['show', who, 'cry', 'shy', 'c']]),
    ['say', who === 'squad' ? T : who, line1],
    ['me', "I'm the Handler. I don't leave anyone behind."],
    ['say', who === 'squad' ? T : who, line2, 'love'],
    ['hideall'], ...afterSave
  ];
  S.save_hikari = saveScene(H, "{name}?! You don't have powers! You can't be in here!", "…Genius Convenience Store Guy. Always knowing where to aim.");
  S.save_rei = saveScene(R, "…You walked into a place made of nothing. For me.", "Then take my hand. I'll find the way out through the shadows — you just don't let go.");
  S.save_mira = saveScene(M, "I told you to eat and sleep. Not to walk into a Rift, {name}.", "…Come here. I've got you. For once, somebody's got *me*.");
  S.save_sora = saveScene(SO, "Handler?! This isn't a stage you can just walk onto!", "…You came to the one show that has no audience. Okay. Encore's over. Let's go home.");
  S.save_kaede = saveScene(K, "You told me to hold. I held. And then it took me anyway…", "…You came slow. On foot. For me. Okay. That's the fastest anyone's ever reached me.");
  S.save_squad = saveScene('squad', "Handler? You shouldn't be here. I'm steel, I'd have been fine.", "…My sisters were right. Home is whoever comes back for you.");

  S.epilogue = [
    ['bg', 'white'], ['sfx', 'shatter'], ['flash', '#fff'],
    ['if', G => G.flags.good, [
      ['n', "You come out of the light together. And behind you — a second set of footsteps."],
      ['bg', 'glass_city'], ['fx', 'glass'], ['show', KY, 'tender', 'default', 'c'],
      ['say', KY, "They said goodbye. Properly, this time. …I'm going to turn myself in to Aya. And then I'm going to learn how to live."],
      ['say', KY, "Handler. Thank you for not leaving anyone behind. Even me.", 'smile'],
      ['ach', 'goodend'], ['hide', KY]
    ], [
      ['n', "You come out of the light together. Behind you, the Rift folds shut with a sound like a bell — and Kyouya Aoi is not with you."],
      ['n', "Aya stands at the edge of the crossing for a long time. Then she says, very quietly, “Welcome home, Squad One.”"]
    ]],
    ['bg', 'hq_lobby'], ['music', 'victory'], ['fx', 'petals'], ['letterbox', 0],
    ['title', 'THREE MONTHS LATER', 'Heartline'],
    ['n', "The glass in Shibuya melted into sand by spring. Kids build castles out of it now."],
    ['n', "HALO has a new Board. Its first order: the Shibuya files, unsealed. Squad One's names are on the lobby wall."],
    ['show', A, 'smile', 'cross', 'l'],
    ['say', A, "Squad Zero. S-rank. The first squad in HALO history run by a Handler with no Spark."],
    ['say', A, "Don't let it go to your head, {name}. …Too late, I see.", 'smug'],
    ['show', B, 'happy', '', 'r'],
    ['say', B, "Handler! Calls are coming in! Also, your dental appointment is today. For real this time.", 'happy'],
    ['hideall'],
    ['jumpf', 'fin_', 'route']
  ];
  const fin = (who, cg, lines) => [['bg', 'park'], ['music', 'romance'], ['fx', 'petals'], ['cg', cg], ...lines, ['cgoff'], ['ach', who === 'squad' ? 'fin_squad' : 'route_' + who], ['end']];
  S.fin_hikari = fin('hikari', 'cg_end_hikari', [
    ['say', H, "Ramen Raijin, table for two! I booked it under “Thunder Goddess and Genius.”"],
    ['say', H, "Mom's memorial got new flowers today. Sunflowers. I told her about you. I told her everything.", 'tender'],
    ['say', H, "Partners on the board. Partners off the board. Forever, okay? No take-backs.", 'love'],
    ['n', "*Hikari & {name} — the loudest, brightest, most over-caffeinated couple in HALO history.*"]
  ]);
  S.fin_rei = fin('rei', 'cg_end_rei', [
    ['say', R, "Kuro had kittens. Four. They're all black. I named one after you. …It's the clumsy one."],
    ['say', R, "Jun came to visit. He hugged me. I didn't flinch. The shadows didn't either.", 'tender'],
    ['say', R, "I don't need to work alone anymore. I have a squad. And I have you. …That's a big deal. You're allowed to make it one.", 'love'],
    ['n', "*Rei & {name} — quiet, stubborn, and never, ever alone again.*"]
  ]);
  S.fin_mira = fin('mira', 'cg_end_mira', [
    ['say', M, "One strawberry mille-feuille for me. One for you. And I'm not taking any wounds today. Doctor's orders."],
    ['say', M, "You rebuilt the whole dispatch system so I'd heal less. HALO's injury rate dropped 40%. You know what they're calling it?", 'smile'],
    ['say', M, "The Solace Protocol. …You named it after me, you ridiculous man. It's a date. Every Saturday. Medically.", 'love'],
    ['n', "*Mira & {name} — who finally learned to take care of each other.*"]
  ]);
  S.fin_sora = fin('sora', 'cg_end_sora', [
    ['say', SO, "New agency, new contract: STELLAR doesn't own me anymore. I sing what I want now."],
    ['say', SO, "Tonight's first song is the one from the empty arena. Twenty thousand people are going to hear it.", 'smile'],
    ['say', SO, "But I'll be looking at the dispatch van the whole time. Like always. My favorite audience of one.", 'love'],
    ['n', "*Sora & {name} — an idol, a Handler, and a love song the whole city knows by heart.*"]
  ]);
  S.fin_kaede = fin('kaede', 'cg_end_kaede', [
    ['say', K, "Race you to the park gate. Loser buys sneakers."],
    ['say', K, "…Or. We could walk. Slowly. Together. I've gotten weirdly good at slow.", 'blush'],
    ['say', K, "Don't tell Hikari. Actually, tell her. She owes me a race.", 'love'],
    ['n', "*Kaede & {name} — the fastest hero in Neo-Tokyo, who learned the best things are worth waiting for.*"]
  ]);
  S.fin_squad = fin('squad', 'cg_end_squad', [
    ['n', "A picnic in Ueno Park. Tetsu brought a bonsai. Hikari brought eleven bento. Rei brought Kuro's kittens. Kaede ran for ice. Sora brought a guitar. Mira brought a first-aid kit, just in case."],
    ['say', H, "Squad photo! Everybody say “Handler!”"],
    ['n', "*Squad Zero — six heroes, one drone, and a clerk with no Spark. Family.*"]
  ]);

  // ======================= NEW HANG OUTS =======================
  S.hang_hikari_4 = [
    ['bg', 'training'], ['tint', 'night'], ['music', 'night'],
    ['show', H, 'determined', 'fist', 'c'],
    ['say', H, "Midnight training! I'm practicing *not* blowing things up. Hold this target? It's… probably safe."],
    ['sfx', 'zap'], ['n', "Tiny sparks dance across her fingertips — slow, precise, beautiful. The target doesn't even singe."],
    ['say', H, "See?! Control! I've been practicing every night since the harbor. Because of what you said.", 'happy'],
    ['choice', [{ t: "“You've gotten incredible, Hikari.”", aff: { hikari: 3 } }, { t: "“Show me again. Slower.”", aff: { hikari: 4 }, then: [['say', H, "…You just like watching me, huh?", 'smug'], ['say', H, "Hehe. I don't mind.", 'blush', 'shy']] }]],
    ['do', G => { G.heroes.hikari.st.int++; }], ['n', "*Hikari Intellect +1.*"]
  ];
  S.hang_hikari_5 = [
    ['bg', 'park'], ['music', 'romance'], ['fx', 'petals'],
    ['show', H, 'tender', 'default', 'c'],
    ['n', "A small memorial in the corner of the park. Sunflowers. A photo of a woman in a hard hat, grinning exactly like Hikari."],
    ['say', H, "Hi, Mom. This is {name}. He's the one I told you about. The genius. …The cute genius.", 'blush', 'shy'],
    ['say', H, "I used to come here and apologize for being too late. Now I come here to tell her who I saved this week.", 'smile'],
    ['choice', [{ t: "“Nice to meet you, Mrs. Amane. Your daughter's the bravest person I know.”", aff: { hikari: 5 } }, { t: 'Place a sunflower next to hers.', aff: { hikari: 4 } }]],
    ['say', H, "…She would've liked you. She liked people who noticed things.", 'love', 'shy']
  ];
  S.hang_rei_4 = [
    ['bg', 'hq_lobby'], ['tint', 'night'], ['music', 'sad'],
    ['n', "An empty rec room on floor 33. Someone is playing piano — clumsy, careful, stubborn."],
    ['show', R, 'surprised', 'shy', 'c'],
    ['say', R, "……You weren't supposed to hear that."],
    ['say', R, "My mother taught me before my Spark. After it, the shadows kept pressing the keys. I stopped.", 'sad', 'default'],
    ['choice', [{ t: "“Play it again. I'll turn the lights up so there's no shadows.”", aff: { rei: 4 }, then: [['n', "She plays. The shadows stay still. Her hands shake only a little."]] }, { t: 'Sit beside her on the bench.', aff: { rei: 3 } }]],
    ['say', R, "…It's a lullaby. It's embarrassing. Forget it by tomorrow.", 'blush', 'cross'],
    ['do', G => { G.heroes.rei.st.cha++; }], ['n', "*Rei Charisma +1.*"]
  ];
  S.hang_rei_5 = [
    ['bg', 'alley'], ['music', 'romance'],
    ['show', R, 'tender', 'shy', 'c'],
    ['say', R, "Jun wrote back. My old partner. He's a teacher now. He has a kid. He named her Rei."],
    ['say', R, "He said, “Stop punishing yourself for a night I've already forgiven.”", 'cry'],
    ['say', R, "I don't know how to do that. But I think… I'd like to learn. With you nearby.", 'love', 'shy'],
    ['choice', [{ t: "“I'll be nearby. Always.”", aff: { rei: 5 } }, { t: "Pet Kuro, who has climbed onto your lap.", aff: { rei: 4 } }]]
  ];
  S.hang_mira_4 = [
    ['bg', 'medbay'], ['music', 'romance'],
    ['show', M, 'smile', 'default', 'c'],
    ['say', M, "First-aid lesson! If you're going to run a board full of reckless heroes, you're learning to wrap a bandage."],
    ['n', "Her hands guide yours. Around, over, tuck. Around, over, tuck. She doesn't let go when the bandage is done."],
    ['choice', [{ t: "“…You can let go now.”", aff: { mira: 2 }, then: [['say', M, "I know. I'm choosing not to.", 'smug']] }, { t: 'Don\'t say anything. Don\'t let go either.', aff: { mira: 4 } }]],
    ['say', M, "…Your pulse is 110. Just an observation. Purely medical.", 'blush', 'shy']
  ];
  S.hang_mira_5 = [
    ['bg', 'park'], ['music', 'romance'], ['fx', 'petals'],
    ['show', M, 'tender', 'default', 'c'],
    ['say', M, "A whole day off. I don't know what to do with my hands. Should I be healing a squirrel?"],
    ['n', "You spend the afternoon doing absolutely nothing useful. She falls asleep on your shoulder by three."],
    ['say', M, "(sleepily) …This is the first time I've rested without feeling guilty. Stay a little longer?", 'love', 'shy'],
    ['choice', [{ t: "“As long as you want.”", aff: { mira: 5 } }, { t: 'Carefully put your jacket over her.', aff: { mira: 4 } }]]
  ];
  S.hang_kaede_1 = [
    ['bg', 'rooftop'], ['tint', 'noon'], ['music', 'daily'],
    ['show', K, 'smug', 'hip', 'c'],
    ['say', K, "Race to the top of the tower. You take the elevator. I take the stairs. Eighty floors. Go!"],
    ['sfx', 'whoosh'], ['n', "When the elevator doors open on the roof, she's lying on her back eating a popsicle."],
    ['choice', [{ t: "“Show-off.”", aff: { kaede: 2 }, then: [['say', K, "Correct.", 'smug']] }, { t: "“That was genuinely amazing.”", aff: { kaede: 3 }, then: [['say', K, "…W-well. Yeah. Obviously.", 'blush', 'cross']] }]],
    ['do', G => { G.heroes.kaede.st.vig++; }], ['n', "*Kaede Vigor +1.*"]
  ];
  S.hang_kaede_2 = [
    ['bg', 'city_night'], ['tint', 'evening'], ['music', 'night'],
    ['show', K, 'sad', 'default', 'c'],
    ['say', K, "You know what everyone says about me? “Kaede's fast.” That's it. That's the whole review."],
    ['say', K, "Hikari throws lightning. Rei walks through walls. I… get there. And then I stand there.", 'sad', 'cross'],
    ['choice', [{ t: "“Getting there is half of every rescue. I've watched you save people seconds before it was too late.”", aff: { kaede: 4 } }, { t: "“Then let's train your Charisma. You'd be a great negotiator.”", aff: { kaede: 3 }, then: [['do', G => { G.heroes.kaede.st.cha++; }], ['n', "*Kaede Charisma +1.*"]] }]],
    ['say', K, "…Thanks, Handler. You're kinda good at this.", 'blush', 'shy']
  ];
  S.hang_kaede_3 = [
    ['bg', 'park'], ['music', 'romance'],
    ['show', K, 'tender', 'default', 'c'],
    ['say', K, "At the academy I ran every night until my legs bled. Not to win. So nobody would notice I was scared."],
    ['say', K, "You notice everything. It's really annoying. …I like it.", 'blush', 'cross'],
    ['choice', [{ t: "“You don't have to run from me.”", aff: { kaede: 5 } }, { t: "“Walk with me instead.”", aff: { kaede: 4 } }]],
    ['say', K, "…Walking's slow. Okay. Just this once.", 'love', 'shy']
  ];
  S.hang_kaede_x = [['bg', 'hq_lobby'], ['show', K, 'smug', 'point', 'c'], ['say', K, "Handler! Timed you reading that report. Four minutes. I could've read it in forty seconds."], ['aff', K, 1]];
  S.hang_sora_1 = [
    ['bg', 'arcade'], ['music', 'daily'], ['fx', 'sparks'],
    ['show', SO, 'happy', 'wave', 'c'],
    ['say', SO, "I've never been to an arcade! My manager said they're “off-brand.” What's this one? Dance game? Oh, I'm going to *destroy* this."],
    ['n', "She gets a perfect score. Then she floats the claw machine prize out with gravity. Then she apologizes to the claw machine."],
    ['choice', [{ t: "“That was the most fun I've had in weeks.”", aff: { sora: 3 } }, { t: 'Win her a plush the normal way (after 11 tries).', aff: { sora: 4 }, then: [['say', SO, "You spent ¥1,100 on a ¥300 plush. For me. I'm keeping it forever.", 'love', 'shy']] }]],
    ['do', G => { G.heroes.sora.st.mob++; }], ['n', "*Sora Mobility +1.*"]
  ];
  S.hang_sora_2 = [
    ['bg', 'rooftop'], ['tint', 'night'], ['music', 'romance'], ['fx', 'stars'],
    ['show', SO, 'tender', 'default', 'c'],
    ['say', SO, "Can I sing something? Not for a stream. Just… to see what it sounds like when nobody's counting."],
    ['n', "She sings quietly, off-key on purpose on the high note, and laughs halfway through."],
    ['choice', [{ t: "“That's my favorite song of yours now.”", aff: { sora: 4 } }, { t: 'Hum the next verse back, badly.', aff: { sora: 3 }, then: [['say', SO, "Ehehe! You're terrible! Do it again!", 'laugh']] }]]
  ];
  S.hang_sora_3 = [
    ['bg', 'stage'], ['music', 'sad'],
    ['show', SO, 'sad', 'default', 'c'],
    ['say', SO, "My real name is Hoshino Sorako. STELLAR changed it when I was eleven. They changed my hair color, my laugh, my birthday."],
    ['say', SO, "Sometimes I don't know which parts are me. …Except here. With the squad. With you.", 'cry'],
    ['choice', [{ t: "“Then let's find out together which parts are you. Starting with your real birthday.”", aff: { sora: 5 } }, { t: "“Sorako. That's a good name.”", aff: { sora: 4 }, then: [['say', SO, "……Say it again?", 'love', 'shy']] }]]
  ];
  S.hang_sora_x = [['bg', 'cafe'], ['show', SO, 'smile', 'hip', 'c'], ['say', SO, "Coffee break! I ordered you something with seven syrups. It's an idol thing."], ['aff', SO, 1]];
  S.hang_tetsu_1 = [
    ['bg', 'apartment'], ['tint', 'evening'], ['music', 'night'],
    ['show', T, 'smile', 'default', 'c'],
    ['say', T, "This is Kazuo. He's a juniper bonsai. He's forty years old. I'm very careful with him."],
    ['n', "Tetsu trims a single leaf with tweezers, holding his breath. His steel-strong hands don't shake at all."],
    ['choice', [{ t: "“He's beautiful, Tetsu.”", aff: { tetsu: 3 } }, { t: "“Can you teach me?”", aff: { tetsu: 4 }, then: [['say', T, "Really? Okay. First rule: patience. Second rule: don't let Hikari near him.", 'happy']] }]],
    ['do', G => { G.heroes.tetsu.st.int++; }], ['n', "*Tetsu Intellect +1.*"]
  ];
  S.hang_tetsu_2 = [
    ['bg', 'ramen'], ['music', 'daily'],
    ['show', T, 'tender', 'default', 'c'],
    ['say', T, "I send half my pay home. My sisters are both in university now. The first in our family."],
    ['say', T, "When the Spark came, I was scared it meant I'd become a weapon. Now I just think of it as being a very good wall for people to hide behind.", 'smile'],
    ['choice', [{ t: "“You're the best wall I know.”", aff: { tetsu: 4 } }, { t: "“Your sisters must be proud.”", aff: { tetsu: 3 } }]],
    ['do', G => { G.heroes.tetsu.st.cha++; }], ['n', "*Tetsu Charisma +1.*"]
  ];
  S.hang_tetsu_x = [['bg', 'training'], ['show', T, 'happy', 'default', 'c'], ['say', T, "Want to spot me? I'm lifting the training room door. It came off again."], ['aff', T, 1]];
  return S;
})());

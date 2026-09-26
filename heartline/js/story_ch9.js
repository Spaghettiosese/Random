/* HEARTLINE AGENCY — Arc Two, part two: Chapter 9 (Winter of Glass), Chapter 10 (Prisoners),
   Chapter 11 (Broken Halo), Chapter 12 (Heartline), confessions, endings, and new hang-outs. */
Object.assign(STORY.scripts, (() => {
  const H = 'hikari', R = 'rei', M = 'mira', A = 'aya', B = 'bit', K = 'kaede', T = 'tetsu', SO = 'sora', KY = 'kyouya', RI = 'rin', KU = 'kuroda', SA = 'saeki', SH = 'shiori', NA = 'natsuki';
  const S = {};
  const day = (label, shift, after) => [['daycard'], ...(label ? [['call', label]] : []), ['shift', shift], ...(after ? [['call', after]] : []), ['hub'], ['night'], ['nextday']];
  // bring a late recruit up to the squad's level so they're useful straight away
  const catchUp = (id, st) => ['do', G => { const r = G.roster.filter(x => x !== id), avg = r.length ? Math.round(r.reduce((s, x) => s + G.heroes[x].lvl, 0) / r.length) : 1, h = G.heroes[id]; if (h.lvl < avg) { h.sp += avg - h.lvl; h.lvl = avg; } if (st) Object.keys(st).forEach(k => { h.st[k] = Math.max(h.st[k], st[k]); }); }];

  // ======================= CHAPTER 9 · WINTER OF GLASS =======================
  S.ch9 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 9', 'Winter of Glass'],
    ['chapter', 9, 'Chapter 9 · Winter of Glass', 'the thaw', 32],
    ['set', 'hubbg', 'shrine'],
    ['bg', 'snow_city'], ['fx', 'snow'], ['music', 'snow'], ['light', 'cold'],
    ['n', "Day 29. The glass snow has been falling for thirty hours. Neo-Tokyo in August looks like a Christmas card somebody dropped."],
    ['n', "The Board calls it an “atmospheric Rift event.” Martial law. Curfew. Aegis on every corner. Only Board-licensed heroes may answer calls."],
    ['bg', 'shrine', 'wipe'],
    ['cg', 'cg_snowsquad'], ['wait', 2200],
    ['n', "At the hilltop shrine, the old priest gives Squad Zero his storehouse, a kerosene heater, and eight coats from the lost-and-found."],
    ['cgoff'], ['wear', 'winter'],
    ['show', K, 'excited', 'cheer', 'l'],
    ['say', K, "Snow! Real snow! Okay, glass snow, but — SNOWBALL FIGHT—"],
    ['show', T, 'sweat', 'default', 'r'], ['say', T, "Kaede. The snowballs are made of glass."],
    ['say', K, "…Snowball fight cancelled.", 'pout'],
    ['hideall'],
    ['sfx', 'heartbeat'], ['music', 'sad'],
    ['n', "Behind you, a soft sound. Mira is sitting in the snow. Her coat sleeve is dark and wet."],
    ['show', M, 'scared', 'shy', 'c'],
    ['say', M, "It's fine. It's fine, it's just — they're all opening. Every wound I ever took. Tetsu's shoulder. Hikari's wrist. Rei's ribs."],
    ['say', M, "The snow is singing the Board's note, and my body… remembers.", 'sob'],
    ['show', RI, 'shocked', 'default', 'l'],
    ['say', RI, "Mira… you have Rift glass inside you. Not a chip. A lot of it. All along your spine."],
    ['say', M, "……I know.", 'sad'],
    ['say', M, "I was nine. The Board called it Project SOLACE. They wanted a medic who could take a soldier's wounds into her own body. A spare body. That was me.", 'cry'],
    ['say', M, "I ran away at sixteen. I became a doctor so I could choose who I bleed for. I never told anyone. Not even Aya.", 'sob'],
    ['choice', [
      { t: "Take her cold hands in yours. “You chose. That's what makes it yours.”", aff: { mira: 4 }, set: 'mira_accept', then: [['say', M, "…You're warm. How are you always warm?", 'crysmile']] },
      { t: "“We'll make them pay for every scar.”", aff: { mira: 2 }, then: [['say', M, "…I don't want them to pay. I want them to stop. That's different, {name}.", 'sad']] },
      { t: "“Why didn't you tell us?”", then: [['say', M, "Because then you'd look at me the way you're looking at me right now.", 'cry']] }
    ]],
    ['hideall'], ['codex', 'solace'],
    ...day(null, { title: 'Day 29 · Whiteout', calls: 11, tiers: [2, 4], diff: 1.65, music: 'snow' }, 'ch9_after29'),
    ...day('ch9_day30', { title: 'Day 30 · Curfew Calls', calls: 12, tiers: [3, 4], diff: 1.7, music: 'snow', special: [{ at: 210, t: 'Frozen Fountain — Ueno Park', d: 'Children playing in the park fountain when the glass snow started. The water froze around them.', r: '3 6 4 6 4', n: 2, tier: 3, dist: 'park', flag: 'c9_fountain', ev: 'frost' }] }, 'ch9_after30'),
    ['daycard'], ['call', 'ch9_day31'],
    ['shift', { title: 'Day 31 · Frozen Rails', calls: 11, tiers: [3, 4], diff: 1.7, music: 'boss', special: [{ at: 200, t: 'Frozen Monorail — Akiba Loop', d: 'A monorail is stuck on an iced span with 300 commuters. Aegis won\'t respond without Board authorization.', r: '5 6 6 4 5', n: 3, tier: 4, dist: 'akiba', flag: 'c9_rail', ev: 'frost' }] }],
    ['jump', 'ch9_capture']
  ];
  S.ch9_after29 = [
    ['bg', 'shrine'], ['tint', 'night'], ['music', 'mystery'], ['fx', 'snow'],
    ['show', RI, 'think', 'default', 'c'], ['show', M, 'serious', 'default', 'r'],
    ['say', M, "Rin and I compared notes. License chips are cut from Rift glass. The same glass as the snow. The same glass as… me."],
    ['say', RI, "Which means they have a note. And anything with a note, I can break.", 'serious'],
    ['say', M, "If Rin shatters the chips, Kuroda's voice can't move anyone. But it'll hurt. And legally, you'll never be heroes again.", 'sad'],
    ['show', H, 'determined', 'fist', 'l'],
    ['say', H, "Legally, we're thieves already! Break mine first! Right now!"],
    ['show', T, 'serious', 'cross', 'r'], ['say', T, "Let's sleep on it. Decisions made in the cold are made by the cold. My sisters taught me that."],
    ['hideall'], ['codex', 'chips']
  ];
  S.ch9_day30 = [
    ['bg', 'shrine'], ['tint', null], ['music', 'sad'], ['fx', 'snow'],
    ['n', "Morning. Hikari is sweeping glass snow off the shrine steps with a broom much too small for the job. She's humming."],
    ['show', H, 'smile', 'default', 'c'],
    ['say', H, "Mom used to hum this when she was scared. So I hum it when I'm scared. It's really working. I'm totally not scared."],
    ['t', "*AMANE, NATSUKI — STATUS: RECOVERED. TRANSFERRED TO SECTOR ZERO.* I've carried that line for five days."],
    ['eye', { prompt: 'Hikari deserves the truth. It might break her. It might give her something to fight for. Now?', time: 10000, opts: [
      { t: 'Tell her. All of it. The archive, the file, the word “recovered.”', ok: 1, set: 'told_hikari', aff: { hikari: 3 } },
      { t: "Not yet. Not until you know it's real.", aff: { hikari: -1 }, timeout: 1 }
    ] }],
    ['if', G => G.flags.told_hikari, [
      ['say', H, "……Recovered.", 'shocked'],
      ['say', H, "She came out. Seven years ago. And they— they put her somewhere, and they never told me, and I've been yelling at a *rock* in a garden every Sunday—", 'sob'],
      ['n', "The broom snaps in her hands. Lightning crawls across the snow. Then it goes out, and she's just a girl crying on the steps."],
      ['say', H, "…Thank you for telling me. Promise me we'll find her. Promise me, {name}.", 'determined', 'fist'],
      ['me', "I promise."]
    ], [
      ['say', H, "{name}? You've got your “Handler is thinking about something terrible” face.", 'confused'],
      ['me', "…It's nothing. Just the snow."],
      ['say', H, "Liar. …That's okay. Tell me when you're ready.", 'tender']
    ]],
    ['hideall']
  ];
  S.ch9_after30 = [
    ['bg', 'shrine'], ['tint', 'night'], ['music', 'night'], ['fx', 'snow'],
    ['sfx', 'phone'], ['n', "A message from a number you don't know. A photograph of a file page, and three lines."],
    ['if', G => G.flags.shiori_doubt || G.flags.shiori_trust, [
      ['n', "*I read Project Harvest. I asked the Chairman if the chips were leashes. He smiled and said: “Kneel.” I knelt. I have never hated anything more. — S.K.*"],
      ['set', 'shiori_turn']
    ], [
      ['n', "*You are a thief and a liar. The Chairman has told me so. Stay out of the city. — S.K.*"]
    ]]
  ];
  S.ch9_day31 = [
    ['bg', 'shrine'], ['music', 'daily'], ['fx', 'snow'],
    ['show', K, 'determined', 'point', 'l'], ['show', H, 'excited', 'fist', 'r'],
    ['say', K, "Race to the bottom of the stairs, Amane. Loser does the dishes. For a week."],
    ['say', H, "Deal! You're going DOWN, Mori!"],
    ['sfx', 'whoosh'], ['n', "They both slip on the glass snow on the first step and slide down all two hundred stairs on their backs, screaming. It's a tie."],
    ['hideall']
  ];
  S.ch9_capture = [
    ['bg', 'snow_city'], ['tint', 'night'], ['fx', 'snow'], ['music', 'boss'], ['light', 'cold'],
    ['if', G => G.flags.c9_rail > 0, [
      ['n', "The Akiba monorail. Three hundred commuters walked off that iced span tonight because Hikari Amane stood on the rail and *held the train with her lightning*, like a magnet."]
    ], [
      ['n', "The Akiba monorail. Half the cars are off the span. The other half are held on by one thing: Hikari Amane, standing on the rail, gripping the train with her lightning like a magnet."]
    ]],
    ['show', H, 'determined', 'fist', 'c'],
    ['say', H, "(comms) Last car's clear! Ha! Did you SEE that?! I'm a magnet! I'm a HUMAN MAGNET—"],
    ['sfx', 'heartbeat'], ['filter', 'mono'],
    ['n', "Every Board speaker in Akiba crackles at once."],
    ['say', KU, "Hikari Amane. *Stop.*"],
    ['sfx', 'shatter'], ['flash', '#fff'], ['shake', 12],
    ['n', "Her lightning goes out like a snuffed candle. Her Spark — gone, mid-air, forty meters above the street."],
    ['say', H, "{name}—?", 'scared'],
    ['hide', H], ['filter', null],
    ['eye', { prompt: 'She is falling. Kaede is two blocks away. Rei is on the wrong side of the span. There is no good call.', time: 6000, opts: [
      { t: "“KAEDE! GO!”", ok: 1, set: 'c9_kaede', aff: { kaede: 1 } },
      { t: "“Rei — shadow-step to her!”", set: 'c9_rei' },
      { t: 'Scream her name.', timeout: 1 }
    ] }],
    ['sfx', 'zap'], ['flash', '#f2c14e'],
    ['n', "A wash of golden hard light. Someone catches her ten meters above the ground — someone in a white coat, with navy hair."],
    ['show', SH, 'serious', 'default', 'c'],
    ['say', SH, "…I have her."],
    ['say', KU, "Well done, Aegis Prime. Bring the girl to Sector Zero. Her mother has been lonely.", 'smile'],
    ['if', G => G.flags.shiori_turn, [
      ['say', SH, "(on your comms, very quietly) Handler. I'll keep her alive. That's all I can promise tonight. I'm sorry.", 'sad'],
      ['set', 'shiori_promise']
    ], [
      ['say', SH, "Understood, Chairman.", 'cold']
    ]],
    ['hide', SH],
    ['n', "Golden light. Then nothing. Then only snow, and Kaede arriving two seconds too late, screaming at the empty sky."],
    ['recruit', H, 0], ['set', 'away_hikari'],
    ['bg', 'shrine'], ['music', 'sad'], ['tint', 'night'], ['light', null],
    ['show', K, 'sob', 'shy', 'c'],
    ['say', K, "Two seconds. I was TWO SECONDS away. I'm the fastest hero in the city and I was two seconds away—"],
    ['choice', [
      { t: 'Hold her while she cries. Say nothing.', aff: { kaede: 3 } },
      { t: "“It's not your fault. It's his. And we're going to go get her.”", aff: { kaede: 2 }, then: [['say', K, "…Yeah. Yeah. And when we do, I'm running the whole way.", 'determined', 'fist']] }
    ]],
    ['hideall'],
    ['nextday'], ['daycard'],
    ['jump', 'ch9_climax']
  ];
  S.ch9_climax = [
    ['bg', 'shrine'], ['fx', 'snow'], ['music', 'mystery'],
    ['show', RI, 'determined', 'fist', 'c'],
    ['say', RI, "I can hear Hikari's chip. It's faint. Under the harbor. Deep. Somewhere the snow can't reach."],
    ['say', RI, "And there's another note down there, right beside hers. One I know. One I'd know anywhere.", 'cry'],
    ['say', RI, "…It's Natsuki-senpai.", 'sob'],
    ['n', "Nobody speaks. The kerosene heater ticks."],
    ['show', T, 'determined', 'cross', 'l'],
    ['say', T, "Then we go get them. But not with leashes on. Rin — break my chip."],
    ['show', R, 'serious', 'cross', 'r'], ['say', R, "Mine next."],
    ['hideall'], ['music', 'sad'], ['letterbox', 1],
    ['n', "One by one. Rin puts her palm on the back of each neck, finds the note, and sings it — so softly it's almost a lullaby."],
    ['cutin', T, "…Huh. That's it? I've had worse splinters.", 'relieved'],
    ['cutin', R, "……It's quiet. It's so quiet.", 'crysmile'],
    ['cutin', K, "Ow ow ow OW— okay. Okay. I'm free. Let's GO.", 'determined'],
    ['cutin', SO, "No more strings. On any stage. Ever.", 'crysmile'],
    ['n', "Mira goes last. Rin can't touch the glass along her spine. But she breaks the chip, and Mira laughs for the first time in days."],
    ['letterbox', 0], ['set', 'chips_free'], ['ach', 'unchained'],
    ['sfx', 'phone'], ['n', "Your phone rings. Unknown number. You know the voice before he speaks."],
    ['show', SA, 'deadpan', 'default', 'c'],
    ['say', SA, "Handler. If you want Hikari Amane back, you'll need a key to Sector Zero."],
    ['say', SA, "I'm the key. Station. Midnight. Come alone. Bring a scarf; I'm told it's cold.", 'smirk'],
    ['hideall'], ['codex', 'sectorzero'],
    ['journal', "Hikari was taken. Kuroda switched off her Spark forty meters up. Rin broke our chips. We're free, and we're going to the harbor."],
    ['recap'], ['jump', 'ch10']
  ];

  // ======================= CHAPTER 10 · PRISONERS =======================
  S.ch10 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 10', 'Prisoners'],
    ['chapter', 10, 'Chapter 10 · Prisoners', 'Sector Zero', 34],
    ['bg', 'station'], ['tint', 'night'], ['fx', 'snow'], ['music', 'board'],
    ['n', "Day 33, 00:00. The last train left hours ago. Deputy Saeki is sitting on a bench under a flickering light, wearing an extremely expensive scarf."],
    ['show', SA, 'deadpan', 'default', 'c'], ['outfit', SA, 'formal'],
    ['say', SA, "You're punctual. Takamine said you would be. She says a lot of annoying things about you."],
    ['say', SA, "Six years ago, Aya Takamine asked me to become the most hated man in HALO, so the Board would trust me. I said yes. I'm very, very good at being hated.", 'smirk'],
    ['say', SA, "I muted the archive alarm. I broke your office door. I gave Aegis Prime your file. And now I'm going to get you into Sector Zero.", 'serious'],
    ['choice', [
      { t: "“Why? What's in it for you?”", then: [['say', SA, "My younger brother was one of the Board's “acceptable inputs.” Harvest Site 4. He was eleven.", 'cold'], ['say', SA, "I don't want revenge, Handler. I want the paperwork to finally say what happened.", 'sad']] },
      { t: "“Thank you. For all of it.”", aff: { saeki: 3 }, then: [['say', SA, "Don't. I'll have to be unpleasant to you in public again someday, and gratitude makes it awkward.", 'deadpan']] }
    ]],
    ['say', SA, "Listen carefully. Tomorrow night, the Chairman calibrates his *Ascension Engine* at Sector Zero. The glass snow is its warm-up.", 'serious'],
    ['say', SA, "The Engine needs a tuning fork: the most Rift-saturated Spark alive. For seven years, that's been Natsuki Amane. Now he has her daughter too.", 'cold'],
    ['say', SA, "Mother and daughter. Same note, one octave apart. With both of them, he can tune the Engine to every human being in the city.", 'serious'],
    ['me', "And then?"],
    ['say', SA, "And then every person in Neo-Tokyo gets a Spark or dies trying. He calls it Ascension. I call it the largest Harvest in history.", 'cold'],
    ['hideall'], ['codex', 'engine'], ['codex', 'saeki'],
    ['bg', 'shrine'], ['tint', null], ['music', 'hq'],
    ['show', B, 'excited', '', 'c'],
    ['say', B, "HEIST BRIEFING! I have made a slideshow. It has transitions. Please hold your applause until the end.", 'happy'],
    ['n', "Slide one: Kaede, runner. Slide two: Rei, through the vents by shadow. Slide three: Tetsu, *the door*. Slide four: Sora floats the elevator. Slide five: Rin listens for the cells."],
    ['n', "Slide six: Mira, medic on standby. Slide seven: B.I.T., hacking. Slide eight is just a drawing of you, with a headset, looking handsome. B.I.T. refuses to explain."],
    ['show', R, 'smirk', 'cross', 'l'], ['say', R, "…It's a good drawing."],
    ['hideall'],
    ...day(null, { title: 'Day 33 · Last Quiet Night', calls: 11, tiers: [3, 4], diff: 1.7, music: 'snow' }, 'ch10_after33'),
    ['daycard'], ['call', 'ch10_day34'],
    ['shift', { title: 'Day 34 · SECTOR ZERO', start: 21, calls: 8, tiers: [3, 4], diff: 1.75, real: 320, music: 'boss', noExtra: 1, special: [{ at: 50, t: 'Harbor Gate — Sector Zero', d: 'The outer gate. Two Aegis patrols and a very bored guard dog.', r: '5 3 6 3 5', n: 2, tier: 3, dist: 'harbor', flag: 'bs_gate', ev: 'aegis' }, { at: 170, t: 'Power Relay — Industrial', d: 'Cut the Sector Zero backup power from the substation. Quietly.', r: '2 4 3 1 8', n: 2, tier: 4, dist: 'industrial', flag: 'bs_power', ev: 'hack' }, { at: 300, t: 'Cell Block Breach', d: 'Get the squad into the cell block before the Engine calibration begins.', r: '6 6 5 3 6', n: 3, tier: 4, dist: 'harbor', flag: 'bs_cells', ev: 'trap' }] }],
    ['jump', 'ch10_heist']
  ];
  S.ch10_after33 = [
    ['bg', 'shrine'], ['tint', 'night'], ['fx', 'snow'], ['music', 'night'],
    ['show', K, 'sad', 'default', 'c'],
    ['say', K, "Can't sleep. Every time I close my eyes, I'm two seconds late."],
    ['say', K, "Tomorrow, I want the cell block run. The fastest part. The part where if I'm slow, she stays in there.", 'determined'],
    ['choice', [
      { t: "“It's yours. Nobody else could do it.”", aff: { kaede: 3 }, set: 'kaede_run', then: [['say', K, "…Thanks, Handler. I won't be late twice.", 'determined', 'fist']] },
      { t: "“You don't have to prove anything.”", aff: { kaede: 1 }, then: [['say', K, "I know. That's why I want to do it anyway.", 'smile']] }
    ]],
    ['hideall']
  ];
  S.ch10_day34 = [
    ['bg', 'ops'], ['music', 'tension'],
    ['show', B, 'happy', '', 'r'],
    ['say', B, "Incoming encrypted call. Caller ID says: “your former boss, who is VERY bored under house arrest.”"],
    ['show', A, 'smirk', 'cross', 'c'], ['outfit', A, 'casual'],
    ['say', A, "{name}. I can't be there. I've been watching daytime television for nine days and I've developed opinions about a cooking show."],
    ['say', A, "Bring them home. All of them. That's not an order. It's the only thing I've ever wanted from this job.", 'tender'],
    ['hideall']
  ];
  S.ch10_heist = [
    ['bg', 'blacksite', 'shatter'], ['music', 'boss'], ['light', 'alarm'], ['fx', null],
    ['n', "23:40. Sector Zero. Four hundred meters under the harbor, where the Board keeps the things it doesn't want written down."],
    ['if', G => G.flags.bs_gate > 0 && G.flags.bs_power > 0, [['n', "The gate was quiet. The power relay went down clean. The corridors are dark, lit only by red emergency strips."]], [['n', "Nothing went clean. Alarms are howling. Every door you pass is slamming into lockdown."]]],
    ['show', B, 'excited', '', 'c'], ['say', B, "Handler. Final door. Board override, twelve layers. I believe in you. I believe in me more. Beep."], ['hide', B],
    ['breach', { title: 'Sector Zero · Inner Door', sub: 'The last door between you and the cells. The Engine calibration starts in minutes.', len: 4, buf: 7, time: 28000, flag: 'bs_door' }],
    ['if', G => G.flags.bs_door > 0, [['sfx', 'confirm'], ['n', "The inner door rolls open. Nobody upstairs noticed."]], [['sfx', 'alarm'], ['n', "The door gives — because Tetsu tears it off its track. Everyone upstairs noticed."], ['morale', -3]]],
    ['bg', 'blacksite'], ['music', 'sad'], ['light', 'deep'],
    ['cg', 'cg_blacksite'],
    ['n', "Cell 7. Hikari sits on the floor with her knees pulled up. Her hair is loose. There's a silver collar around her neck, humming the Board's note."],
    ['cgoff'],
    ['if', G => G.flags.kaede_run, [['show', K, 'determined', 'fist', 'l'], ['say', K, "(comms) Cell seven, door's open, I've got her! I'm not late! I'm NOT LATE!", 'crysmile']]],
    ['show', H, 'crysmile', 'shy', 'c'],
    ['say', H, "…You came. Of course you came. I knew your voice was going to be the first thing I heard."],
    ['say', H, "{name}, she's here. Mom is here. They showed me. They wanted me to *see*.", 'sob'],
    ['recruit', H], ['do', G => { delete G.flags.away_hikari; }], ['aff', H, 3],
    ['hide', H], ['hide', K],
    ['if', G => G.flags.good, [
      ['n', "Cell 9. A man with white hair and a thousand-yard stare looks up from a book he's been reading for the fourth time."],
      ['show', KY, 'surprised', 'default', 'c'],
      ['say', KY, "…Handler. Of all the people I expected to come for me, you were in last place. Behind the pizza man."],
      ['show', RI, 'crysmile', 'cheer', 'r'], ['say', RI, "NII-SAN!"],
      ['say', KY, "Rin? …Rin, you're free. You're here. Oh, thank god.", 'cry'],
      ['hide', KY], ['hide', RI], ['set', 'kyouya_free']
    ]],
    ['bg', 'lab', 'wipe'], ['light', 'rift'], ['music', 'mystery'], ['fx', 'dust'],
    ['n', "The core of Sector Zero. A chamber shaped like a tuning fork. At the center, a glass pod, frosted from the inside. A label, typed on an old machine:"],
    ['n', "*SUBJECT 01 — AMANE, NATSUKI. RECOVERED YEAR +1. STASIS. DO NOT WAKE.*"],
    ['show', H, 'shocked', 'default', 'c'],
    ['say', H, "……Mom."],
    ['eye', { prompt: 'The pod is wired into the Engine. Wake her wrong, and the Engine may wake with her. How?', time: 10000, opts: [
      { t: "“Rin. Find the pod's note. Sing it open, gently.”", ok: 1, set: 'pod_gentle', aff: { rin: 2 } },
      { t: "“B.I.T., hack the stasis controls.”", set: 'pod_hack' },
      { t: "“Tetsu, rip it open!”", timeout: 1 }
    ] }],
    ['sfx', 'chime'], ['flash', '#fff'], ['fx', 'sparks'],
    ['n', "The frost clears from the glass. Inside: a woman in an orange rescue jacket, a HALO hard hat still clipped to her belt. Golden hair. Hikari's face, fifteen years older."],
    ['cg', 'cg_natsuki'], ['filter', 'flashback'], ['music', 'romance'],
    ['n', "*Eight years ago. Shibuya. Her twelfth trip into the glass. A kid on her back. “Count to a thousand, Rinrin. Don't look back.”*"],
    ['n', "*She turned around for the thirteenth trip. The Rift closed on her like a hand.*"],
    ['filter', null], ['cgoff'],
    ['show', NA, 'confused', 'default', 'r'], ['know', NA],
    ['say', NA, "…Ugh. Did I win? Did we close it? Why does my mouth taste like a freezer?"],
    ['say', NA, "……Who's the tall girl with my hair crying at me?", 'surprised'],
    ['say', H, "Mom. Mom, it's me. It's Hikari. I got tall. I got *loud*. You said I'd be louder than you—", 'sob'],
    ['say', NA, "Hikari? My Hikari? You were ELEVEN— you were eleven this morning—", 'cry'],
    ['n', "Natsuki Amane climbs out of seven years of stasis and falls into her daughter's arms, and neither of them can stand, so they sit on the floor of the Board's secret prison and hold on."],
    ['ach', 'reunion'], ['codex', 'natsuki'],
    ['hideall'], ['music', 'boss'], ['light', 'dark'], ['fx', null],
    ['sfx', 'door'], ['n', "Slow applause from the doorway."],
    ['show', KU, 'smile', 'default', 'c'],
    ['say', KU, "How moving. Truly. I did so want them to have a reunion before the calibration. Family resonance is very useful."],
    ['say', KU, "Squad Zero. *Kneel.*", 'ominous'],
    ['sfx', 'heartbeat'], ['shake', 4],
    ['n', "Nothing happens. Rei stays standing. Tetsu stays standing. Sora, Kaede, Rin — standing, every one of them, their broken chips silent in their necks."],
    ['say', KU, "……Ah. The girl broke your chips. Clever.", 'cold'],
    ['say', KU, "Natsuki Amane. Your chip is intact, I believe. *Attack them.*", 'ominous'],
    ['show', NA, 'scared', 'fist', 'r'],
    ['sfx', 'boom'], ['fx', 'embers'], ['n', "Natsuki's hands ignite. Heat washes across the room. Her face is screaming no; her body steps toward her daughter."],
    ['show', H, 'determined', 'default', 'l'],
    ['say', H, "Mom. It's okay. I know it's not you.", 'crysmile'],
    ['cutin', RI, "Natsuki-senpai — hold still! This one's for you!", 'determined'],
    ['sfx', 'glass'], ['flash', '#9ff'],
    ['n', "Rin's note splits the air. Natsuki's chip shatters. The fire in her hands goes out, and she drops to her knees, gasping, *free*."],
    ['say', NA, "…I heard you, Rinrin. You counted all the way to a thousand, didn't you?", 'crysmile'],
    ['hide', NA], ['hide', H], ['fx', null],
    ['say', KU, "Then I'll speak to the one person in this room I *can't* command.", 'think'],
    ['n', "Kuroda turns to you. Two old eyes. Something in them almost like envy."],
    ['eye', { prompt: "The Chairman is unarmed. His voice can't touch you. Aegis boots are coming down the corridor. What do you do?", time: 9000, opts: [
      { t: "Walk straight up to him. Look him in the eye. “Your voice doesn't work on me.”", ok: 1, set: 'faced_kuroda' },
      { t: "“Everyone, fall back! Now!”", set: 'bs_retreat' },
      { t: 'Freeze.', timeout: 1 }
    ] }],
    ['if', G => G.flags.faced_kuroda, [
      ['say', KU, "No. It doesn't. You're the only free man I've met in forty years.", 'tender'],
      ['say', KU, "I was like you once, you know. Powerless. Then a Rift gave me a voice. I've spent my whole life trying to give it to everyone else.", 'sad'],
      ['me', "You gave people voices by taking their choices."],
      ['say', KU, "……Perhaps. Then I'll build a world where it doesn't matter. Goodnight, Handler.", 'cold']
    ]],
    ['sfx', 'alarm'], ['n', "Aegis troopers flood the corridor. Kuroda steps back through them like a man leaving a dinner party early."],
    ['show', SA, 'determined', 'point', 'c'],
    ['say', SA, "(comms) Handler. Blast door B is manual. Someone has to hold the lever while the rest of you run. I've volunteered. Mostly because I'm already here."],
    ['me', "Saeki, no—"],
    ['say', SA, "Go. Somebody has to do the paperwork. …Tell Takamine I fixed the door.", 'smile'],
    ['sfx', 'boom'], ['shake', 10], ['n', "The blast door slams down between you and him. The last thing you see is Deputy Saeki straightening his scarf."],
    ['hideall'], ['set', 'saeki_caught'],
    ['jump', 'ch10_after']
  ];
  S.ch10_after = [
    ['nextday'],
    ['bg', 'shrine'], ['tint', null], ['music', 'romance'], ['fx', 'snow'], ['light', null],
    ['n', "Day 35. Dawn at the shrine. The glass snow is still falling, but softer, as if the Engine lost its place in the song."],
    ['show', NA, 'happy', 'wave', 'c'], ['outfit', NA, 'casual'],
    ['say', NA, "So YOU'RE the Handler! The one my daughter won't stop talking about! Stand still, I want to look at you."],
    ['say', NA, "…No Spark at all? Good. The best Handlers never have one. They have to *listen* instead.", 'smirk'],
    ['show', H, 'embarrassed', 'shy', 'l'], ['say', H, "MOM. Stop. Please. I'm begging you."],
    ['say', NA, "She says you're “calm on comms.” She said it eleven times in the car. I counted.", 'tease'],
    ['say', H, "MOOOOM!", 'flustered'],
    ['say', NA, "Seven years I missed. I'm not missing anything else. Salamander — Natsuki Amane, rescue specialist — reporting for duty, Handler. If you'll have an old lady.", 'determined', 'fist'],
    ['choice', [
      { t: "“Welcome to Squad Zero, Salamander.”", aff: { natsuki: 3, hikari: 2 } },
      { t: "“Hikari gets a say too.”", aff: { hikari: 3, natsuki: 2 }, then: [['say', H, "…Are you kidding? Welcome to the squad, Mom. I'm the senpai now.", 'smug']] }
    ]],
    ['recruit', NA], catchUp(NA, { com: 4, vig: 8, mob: 6, cha: 7, int: 5 }),
    ['hideall'],
    ['sfx', 'car'], ['show', A, 'smirk', 'cross', 'c'], ['outfit', A, 'hero'],
    ['say', A, "Somebody unlocked my house arrest at 00:14 last night. From inside the Board's own network. With a note that said *“I fixed the door.”*"],
    ['say', A, "…Saeki. That idiot. That magnificent, unbearable idiot.", 'cry'],
    ['say', A, "Natsuki Amane. Alive. …You look exactly the same, you jerk.", 'crysmile'],
    ['show', NA, 'laugh', 'wave', 'r'], ['say', NA, "Aya-chan! You got OLD! You got WRINKLES! You're the DIRECTOR?!"],
    ['say', A, "Was. Am. It's complicated. We're getting him back — Saeki. And then we're telling the whole city what the Board is.", 'determined', 'point'],
    ['hideall'], ['do', G => { delete G.flags.aya_out; }], ['ach', 'ch10'],
    ...day(null, { title: 'Day 35 · The Soft Snow', calls: 11, tiers: [3, 4], diff: 1.7, music: 'snow' }, null),
    ['recap'], ['jump', 'ch11']
  ];

  // ======================= CHAPTER 11 · BROKEN HALO =======================
  S.ch11 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null],
    ['title', 'CHAPTER 11', 'Broken Halo'],
    ['chapter', 11, 'Chapter 11 · Broken Halo', 'the Starlight Dome concert', 38],
    ['bg', 'shrine'], ['music', 'hq'], ['fx', 'snow'],
    ['show', A, 'determined', 'cross', 'c'],
    ['say', A, "We have the Harvest files. We have Natsuki Amane, alive, as proof. What we don't have is a microphone big enough."],
    ['show', SO, 'smug', 'point', 'r'],
    ['say', SO, "I have a microphone big enough."],
    ['say', SO, "STELLAR's Starlight Dome concert. Day 38. Twelve million viewers. I'm the headliner, and they can't cancel me without a riot. I've checked. I have *very* intense fans.", 'smirk'],
    ['say', SO, "I'll sing my own song — the one from the empty arena. And while I'm singing, B.I.T. uploads every page of Project Harvest to every screen in the Dome and every phone watching.", 'determined', 'fist'],
    ['show', B, 'excited', '', 'l'], ['say', B, "I have always wanted to be a music video. Beep.", 'happy'],
    ['say', A, "Kuroda will know. He'll send Aegis. He'll be on every screen himself if he has to.", 'serious'],
    ['say', SO, "Good. Let him watch.", 'cold'],
    ['hideall'], ['codex', 'stellar'],
    ...day(null, { title: 'Day 36 · The Long Thaw', calls: 12, tiers: [3, 4], diff: 1.72, music: 'snow' }, 'ch11_after36'),
    ...day('ch11_day37', { title: 'Day 37 · Rehearsal', calls: 12, tiers: [3, 4], diff: 1.75, special: [{ at: 230, t: 'Sabotage at the Starlight Dome', d: 'Someone is cutting stage cables at the Dome. Find them before the lighting rig falls on the rehearsal.', r: '3 4 5 3 7', n: 2, tier: 4, dist: 'akiba', flag: 'c11_dome', ev: 'hack' }] }, 'ch11_after37'),
    ['daycard'],
    ['shift', { title: 'Day 38 · Doors Open', calls: 9, tiers: [3, 4], diff: 1.72, real: 260, special: [{ at: 150, t: 'Crowd Crush — Dome Gate 4', d: 'Eighty thousand fans, one gate, and a Board “security check” slowing everything to a crawl.', r: '2 6 4 8 4', n: 2, tier: 4, dist: 'akiba', flag: 'c11_gate', ev: 'crowd' }] }],
    ['jump', 'ch11_concert']
  ];
  S.ch11_after36 = [
    ['bg', 'shrine'], ['tint', 'night'], ['music', 'night'], ['fx', 'snow'],
    ['show', NA, 'tender', 'default', 'c'], ['outfit', NA, 'winter'],
    ['say', NA, "Handler. Walk with me."],
    ['say', NA, "My daughter told me everything. The konbini. The rooftop. How you talked her through a Rift-beast with nothing but a radio and a notebook.", 'smile'],
    ['say', NA, "I missed seven years of her. You didn't miss a day of the part that mattered. Thank you.", 'crysmile'],
    ['choice', [
      { t: "“She did it herself. I just told her where to aim.”", aff: { natsuki: 3, hikari: 1 }, then: [['say', NA, "Ha! That's what Handlers always say. Kyouya used to say that.", 'laugh']] },
      { t: "“She never stopped talking about you. Not once.”", aff: { natsuki: 3 }, then: [['say', NA, "…Don't. You'll make an old lady cry in the snow.", 'cry']] }
    ]],
    ['hideall']
  ];
  S.ch11_day37 = [
    ['bg', 'shrine'], ['music', 'mystery'], ['fx', 'snow'],
    ['n', "Morning. A figure climbs the two hundred shrine steps alone, hands raised, a white coat folded over one arm."],
    ['show', SH, 'serious', 'default', 'c'],
    ['say', SH, "Shiori Kagami. Unarmed. Alone. If this is a trap, I've made a very embarrassing mistake."],
    ['show', R, 'glare', 'cross', 'l'], ['say', R, "Give me one reason not to drop you through the floor."],
    ['say', SH, "Deputy Saeki sent me every page of Project Harvest the night he was captured. I read it four times.", 'cold'],
    ['say', SH, "Aegis will be at the Dome tomorrow. The Chairman's orders are to stop the broadcast “by any means.” I've never refused an order. My body won't let me.", 'sad'],
    ['if', G => G.flags.shiori_turn || G.flags.shiori_trust, [
      ['say', SH, "…Your echo girl. Rin. I'm told she can break chips.", 'serious'],
      ['show', RI, 'determined', 'fist', 'r'], ['say', RI, "I can. It'll hurt."],
      ['say', SH, "I was raised by the Board. I know how to hurt. Do it.", 'determined'],
      ['sfx', 'glass'], ['flash', '#f2c14e'], ['shake', 4],
      ['n', "Rin sings. Aegis Prime does not make a sound. When it's over, she stands up, flexes her hands, and smiles for the first time any of you have seen."],
      ['say', SH, "…So this is what it feels like. To want to do something, and then do it.", 'crysmile'],
      ['set', 'shiori_free']
    ], [
      ['say', SH, "I'm not asking for help. I'm telling you where to be. What I do tomorrow is mine to figure out.", 'cold'],
      ['n', "She leaves the way she came. Rei watches her go for a long time."]
    ]],
    ['say', R, "…Kagami. For the record. You fight well. For an attack dog.", 'smirk'],
    ['say', SH, "For a shadow, you talk too much.", 'smirk'],
    ['hideall'], ['aff', SH, 2]
  ];
  S.ch11_after37 = [
    ['bg', 'dome'], ['tint', 'night'], ['music', 'romance'], ['light', 'stage'],
    ['show', SO, 'tender', 'default', 'c'], ['outfit', SO, 'formal'],
    ['say', SO, "The empty Dome. Tomorrow there'll be eighty thousand people in these seats and twelve million watching at home."],
    ['say', SO, "I've performed here nine times. Every single time, I sang what STELLAR told me to. Tomorrow I sing the truth. It's so much scarier.", 'scared'],
    ['choice', [
      { t: "“I'll be in the dispatch van. Listening to the part nobody listens to.”", aff: { sora: 3 }, then: [['say', SO, "…That's the line from the song. You remembered it.", 'love']] },
      { t: "“You were never STELLAR's. You were always Sora.”", aff: { sora: 2 }, then: [['say', SO, "Say that into my ear-monitor tomorrow when I'm about to throw up.", 'crysmile']] }
    ]],
    ['hideall']
  ];
  S.ch11_concert = [
    ['bg', 'dome', 'iris'], ['tint', 'night'], ['music', null], ['light', 'stage'], ['vfx', 'bokeh'], ['wear', 'formal'],
    ['n', "20:00. The Starlight Dome. Eighty thousand glow sticks. The lights go down. Twelve million screens go dark at once."],
    ['show', SO, 'determined', 'default', 'c'],
    ['say', SO, "(ear-monitor) Handler? Are you there?"],
    ['me', "Front row. Every time."],
    ['say', SO, "…Okay. Let's make it sparkle.", 'smile'],
    ['hide', SO],
    ['cg', 'cg_broadcast'], ['sfx', 'chime'],
    ['rhythm', { track: 'idol', bars: 12, title: '🎤 LIVE · STARLIGHT DOME', sub: 'Sora sings. Every note you hit keeps the crowd with her while B.I.T. uploads the files. Hit D F J K on the beat!', flag: 'concert' }],
    ['cgoff'], ['vfx', null],
    ['if', G => ['S', 'A', 'B'].includes(G.flags.concert), [
      ['n', "Behind Sora, the Dome's screens flicker — and then fill with the Board's own documents. *PROJECT SPARK HARVEST.* Yield estimates. *Acceptable input.* Squad One's collection order. Natsuki Amane's stasis log."],
      ['n', "Eighty thousand people go silent. Twelve million phones start recording."],
      ['set', 'broadcast_ok']
    ], [
      ['n', "The upload stutters. Only some pages get through, glitching on the Dome screens. But it's enough. People start asking. Then shouting."]
    ]],
    ['sfx', 'boom'], ['shake', 10], ['music', 'boss'],
    ['n', "Every screen in the Dome cuts to one face."],
    ['show', KU, 'cold', 'default', 'c'],
    ['say', KU, "Citizens. What you are seeing is a forgery by fugitives. Please remain calm. Aegis — *end them.*"],
    ['hide', KU],
    ['n', "Aegis troopers drop from the rigging in gold light. Forty of them. Aimed at the stage. Aimed at Sora."],
    ['show', SH, 'cold', 'point', 'c'],
    ['if', G => G.flags.shiori_free, [
      ['say', SH, "Aegis. Stand down. That's an order from your captain — not from a voice in your neck.", 'determined']
    ], [
      ['sfx', 'glass'], ['n', "Shiori Kagami raises a hand to the back of her own neck — and digs out her chip with a blade of hard light. She doesn't even flinch."],
      ['say', SH, "Aegis. Stand down. …That's an order from me. Not from him.", 'furious']
    ]],
    ['n', "Forty troopers hesitate. Then, one by one, their gold light goes out — and they turn around to face the Board's screens instead."],
    ['cutin', SH, 'Aegis Prime stands with Squad Zero.', 'determined'],
    ['recruit', SH], catchUp(SH, { com: 7, vig: 6, mob: 5, cha: 5, int: 5 }), ['ach', 'defect'], ['codex', 'shiori'],
    ['hideall'],
    ['show', A, 'determined', 'point', 'c'],
    ['say', A, "(on stage, on every screen) I'm Aya Takamine, Director of HALO. Everything you just saw is true. HALO does not belong to the Board. It belongs to *you*."],
    ['say', A, "And one more thing. Chairman — give me back my deputy.", 'furious'],
    ['hide', A],
    ['show', KU, 'ominous', 'default', 'c'],
    ['say', KU, "……Very well. If the city will not climb, I'll lift it.", 'ominous'],
    ['say', KU, "Let us skip to the end.", 'cold'],
    ['hideall'], ['wear', null],
    ['bg', 'ascension', 'shatter'], ['light', 'rift'], ['fx', 'glass'], ['music', 'finale'],
    ['cg', 'cg_ascension'], ['sfx', 'thunder'], ['shake', 14], ['crack'],
    ['n', "Above Board Tower, the sky splits open. Not a door this time. A *sun*. A sphere of Rift light, turning slowly, humming the Board's note loud enough to rattle teeth across the city."],
    ['show', RI, 'scared', 'shy', 'c'],
    ['say', RI, "That's the Engine. Fully tuned. When it opens all the way, at dawn after next, the light will reach every street in Neo-Tokyo.", 'sob'],
    ['say', RI, "One in ten thousand wakes up with a Spark. Everyone else… doesn't wake up.", 'shocked'],
    ['cgoff'], ['hideall'], ['codex', 'ascension'],
    ['journal', "Sora sang. The city saw everything. Shiori came over to our side. And Kuroda opened a sun above his tower. Dawn after next, it opens all the way."],
    ['recap'], ['jump', 'ch12']
  ];

  // ======================= CHAPTER 12 · HEARTLINE =======================
  S.ch12 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['light', null], ['nextday'],
    ['title', 'FINAL CHAPTER', 'Heartline'],
    ['chapter', 12, 'Chapter 12 · Heartline', 'Ascension', 40],
    ['set', 'hubbg', 'hq_lobby'], ['set', 'restored'],
    ['bg', 'hq_lobby'], ['music', 'hq'],
    ['n', "Day 39. HALO Tower. The Board's banners have been torn down. Somebody has taped a crayon drawing of Squad Zero over the old Board seal in the lobby."],
    ['show', A, 'determined', 'cross', 'c'],
    ['say', A, "The Board is finished. Seven of the twelve members have resigned or run. Every agency in the city has broken with them."],
    ['say', A, "But Kuroda is in that tower with the Engine and the last of his loyalists, and at dawn tomorrow, it opens.", 'serious'],
    ['say', A, "Every licensed hero in this city still has a chip. When the Engine opens, his voice will be *everywhere*. Every hero but ours will freeze.", 'cold'],
    ['say', A, "So: Operation Heartline. One more time. Every agency holds the streets as long as it can. Squad Zero goes up the tower.", 'determined', 'point'],
    ['say', A, "And you, {name} — you walk into the one room in Neo-Tokyo where his voice is loudest. Because it can't touch you.", 'tender'],
    ['me', "No pressure."],
    ['say', A, "…I'd go myself. I can't. You're the only one who can.", 'sad'],
    ['hideall'],
    ['daycard'],
    ['shift', { title: 'Day 39 · Eve of Ascension', calls: 12, tiers: [3, 4], diff: 1.75, music: 'finale' }],
    ['bg', 'rooftop'], ['tint', 'evening'], ['music', 'romance'], ['fx', 'petals'],
    ['n', "Evening. The HALO Tower roof. Someone has dragged the grill up here again. Nobody asked permission. Again."],
    ['show', NA, 'laugh', 'wave', 'l'], ['show', T, 'happy', 'default', 'r'],
    ['say', NA, "Tetsu! Big guy! You grill like my late husband! That's a compliment! He was a terrible cook!"],
    ['say', T, "…Thank you, Natsuki-san?", 'confused'],
    ['hideall'],
    ['show', SH, 'embarrassed', 'shy', 'l'], ['show', SO, 'excited', 'heart', 'r'],
    ['say', SO, "Shiori, have you ever had a marshmallow?"],
    ['say', SH, "The Board said sugar degrades performance.", 'deadpan'],
    ['sfx', 'chime'], ['n', "Shiori eats one marshmallow. Then six. Then she stops making eye contact with anyone."],
    ['hideall'],
    ['if', G => G.flags.kyouya_free || G.flags.good, [
      ['show', KY, 'tender', 'default', 'l'], ['show', RI, 'happy', 'cheer', 'r'],
      ['say', KY, "Handler. Aya's letting me help at the Rift site tomorrow. The Engine's resonance is Rift resonance. I know it better than anyone alive."],
      ['say', RI, "Squad One, back on shift! Nii-san, you have to salute. It's cringe now. Do it anyway.", 'laugh'],
      ['hideall']
    ]],
    ['show', A, 'smile', 'default', 'c'],
    ['say', A, "Nine heroes, one drone, and a clerk with no Spark. …When I recruited you, I thought I was hiring a Handler. I was hiring a family.", 'tender'],
    ['show', B, 'happy', '', 'r'],
    ['say', B, "I have updated the file named *family*. It is very large now. Beep.", 'happy'],
    ['hideall'],
    ['hub'],
    ['bg', 'rooftop'], ['tint', 'night'], ['music', 'romance'], ['fx', 'stars'],
    ['n', "Midnight. The Ascension sun hangs over the city like a second moon. The squad has scattered to rest. There's someone you want to see before dawn."],
    ['choice', [
      { t: 'Find Hikari.', if: G => G.aff.hikari >= 10, then: [['set', 'route', 'hikari']] },
      { t: 'Find Rei.', if: G => G.aff.rei >= 10, then: [['set', 'route', 'rei']] },
      { t: 'Find Mira.', if: G => G.aff.mira >= 10, then: [['set', 'route', 'mira']] },
      { t: 'Find Sora.', if: G => G.aff.sora >= 10 && G.roster.includes('sora'), then: [['set', 'route', 'sora']] },
      { t: 'Find Kaede.', if: G => G.aff.kaede >= 10, then: [['set', 'route', 'kaede']] },
      { t: 'Stay on the roof with whoever is left. The whole squad matters.', then: [['set', 'route', 'squad']] }
    ]],
    ['jumpf', 'eve_', 'route']
  ];
  const toOp = [['nextday'], ['daycard'], ['jump', 'ch12_op']];
  S.eve_hikari = [
    ['show', H, 'tender', 'shy', 'c'],
    ['say', H, "You came to find me. …I was hoping you would. Mom's asleep. She snores exactly like me. It's horrifying."],
    ['say', H, "Remember the night before Operation Heartline? I said there was something I wanted to tell you, after. It's after. Well — it's almost after.", 'blush'],
    ['say', H, "When I'm scared, I think about your voice on comms. Calm. Like you already know I'll make it. And every time, I did.", 'tender'],
    ['say', H, "{name}… I like you. Not partner-like. Like-like. Ramen-alone-at-midnight like. Okay I said it I'm going to go explode now—", 'love', 'shy'],
    ['choice', [{ t: "“Don't explode. I like you too, Hikari.”", aff: { hikari: 5 } }, { t: 'Take her hand instead of answering.', aff: { hikari: 4 } }]],
    ['say', H, "…Then we're both coming home tomorrow. Pinky promise. That's an order, Handler.", 'love', 'wave'],
    ...toOp
  ];
  S.eve_rei = [
    ['sfx', 'shadow'], ['show', R, 'neutral', 'cross', 'c'],
    ['say', R, "I felt you coming. Your shadow walks differently when you're nervous."],
    ['say', R, "That sun up there throws no shadows. None. Tomorrow I'll be fighting in the one place my power can't reach.", 'sad', 'default'],
    ['say', R, "…I wrote to Jun. My old partner. I told him about you. I told him I'm not alone anymore.", 'tender', 'shy'],
    ['say', R, "I've never said this to anyone, so I'm going to say it badly. I love you, {name}. Don't make it a big deal.", 'blush', 'cross'],
    ['choice', [{ t: "“It's a huge deal. I love you too, Rei.”", aff: { rei: 5 } }, { t: "“Say it badly again. I want to remember it.”", aff: { rei: 4 } }]],
    ['say', R, "…Idiot. …Mine, though. If I get lost up there, say my name. You know how.", 'love', 'shy'],
    ...toOp
  ];
  S.eve_mira = [
    ['bg', 'medbay'], ['music', 'romance'], ['fx', null],
    ['show', M, 'tender', 'default', 'c'],
    ['say', M, "You found me. I'm restocking. Fourteen trauma kits, nine for Tetsu, because Tetsu."],
    ['say', M, "My whole life, the Board decided whose pain I carried. Tomorrow I'll carry whoever needs me — because I choose to.", 'determined'],
    ['say', M, "And there's one more thing I'm choosing. I think I've been choosing it since you ate that terrible konbini sandwich in front of me.", 'blush', 'shy'],
    ['say', M, "I love you, {name}. That's not a diagnosis. That's just true.", 'love'],
    ['choice', [{ t: "“I love you too, Mira. Let me carry something for you, for once.”", aff: { mira: 5 } }, { t: "Kiss her forehead. “Doctor's orders.”", aff: { mira: 4 } }]],
    ['say', M, "…You're warm. You're always warm. Come home tomorrow, so I can keep you that way.", 'love', 'heart'],
    ...toOp
  ];
  S.eve_sora = [
    ['bg', 'stage'], ['music', 'romance'], ['fx', 'hearts'],
    ['show', SO, 'smile', 'default', 'c'],
    ['say', SO, "An empty arena. My favorite kind. No cameras. No manager. Just one audience member."],
    ['say', SO, "Twelve million people heard my song last night. But I held the last verse back. It's not for them.", 'blush', 'shy'],
    ['n', "She sings the last verse. It's about a person in a dispatch van who listens to the part nobody listens to. It's about you. It always was."],
    ['say', SO, "…That's you. The song. If that wasn't obvious. I'm in love with you, Handler. Is that allowed?", 'love', 'shy'],
    ['choice', [{ t: "“It's allowed. I'm in love with you too, Sora.”", aff: { sora: 5 } }, { t: 'Applaud. Loudly. For a very long time.', aff: { sora: 4 } }]],
    ['say', SO, "Ehehe… Then let's win tomorrow. I want an encore.", 'happy', 'wave'],
    ...toOp
  ];
  S.eve_kaede = [
    ['bg', 'snow_city'], ['music', 'romance'], ['fx', 'snow'],
    ['show', K, 'neutral', 'hip', 'c'],
    ['say', K, "Took you long enough. I've run around the city eleven times waiting. The glass snow is finally melting. Did you notice?"],
    ['say', K, "At the monorail, when I was two seconds late… the only thing I thought was, “I want to be two seconds early for *him*. Every time. Forever.”", 'sad'],
    ['say', K, "You're the first person who ever made me want to *wait*. Do you know how weird that is for me?", 'blush', 'cross'],
    ['say', K, "So. I like you. A lot. That's it. That's the whole race.", 'love', 'shy'],
    ['choice', [{ t: "“You win. I like you too, Kaede.”", aff: { kaede: 5 } }, { t: "“Race you to saying it again.”", aff: { kaede: 4 } }]],
    ['say', K, "…Cheater. Okay. Tomorrow, I hold when you say hold. And after that, you're buying sneakers.", 'happy', 'point'],
    ...toOp
  ];
  S.eve_squad = [
    ['show', T, 'smile', 'default', 'l'], ['show', B, 'happy', '', 'r'],
    ['say', T, "Couldn't sleep either, Handler?"],
    ['n', "One by one they drift back up — Hikari and her mother sharing a blanket, Rei out of a shadow, Kaede on the fence, Sora humming, Rin counting stars, Shiori pretending she isn't eating the last marshmallows."],
    ['say', T, "My sisters used to say home isn't a place. It's the people who come back up to the roof at midnight.", 'tender'],
    ['say', B, "I have recorded this moment. File name: *family, part two*. Beep.", 'happy'],
    ['do', G => { Object.keys(G.aff).forEach(h => { if (G.known[h] !== undefined && h !== 'aya') G.aff[h] += 2; }); }],
    ...toOp
  ];
  S.ch12_op = [
    ['autosave'],
    ['bg', 'ops'], ['music', 'tension'], ['light', null],
    ['show', A, 'determined', 'cross', 'c'],
    ['say', A, "04:30. Every agency is on the streets. When the Engine opens, the licensed heroes will start freezing district by district. Make every minute count."],
    ['say', A, "Squad Zero, you're the only ones it can't stop. The city is yours until the tower.", 'determined', 'point'],
    ['hideall'],
    ['shift', { title: 'Day 40 · OPERATION HEARTLINE: ASCENSION', start: 5, calls: 14, tiers: [3, 4], diff: 1.8, real: 380, music: 'finale', special: [
      { at: 80, t: 'Frozen Heroes — Shibuya Crossing', d: 'Thirty licensed heroes froze mid-rescue when the Engine hummed. Civilians are trapped under a half-lifted bus.', r: '7 7 4 5 4', n: 3, tier: 4, dist: 'shibuya', flag: 'z_frozen', ev: 'command' },
      { at: 220, t: 'Rift Rain — Riverside Hospital', d: 'Drops of Rift light falling like rain on the hospital roof. Every patient needs to be underground.', r: '4 7 5 6 6', n: 3, tier: 4, dist: 'riverside', flag: 'z_hosp', ev: 'glassbloom' },
      { at: 360, t: 'Aegis Loyalists — Board Tower Plaza', d: 'The last Board loyalists hold the tower doors. Break through.', r: '8 6 6 4 6', n: 3, tier: 4, dist: 'uptown', flag: 'z_doors', ev: 'aegis' }] }],
    ['jump', 'ch12_final']
  ];
  S.ch12_final = [
    ['bg', 'ops'], ['music', 'mystery'],
    ['do', G => {
      const sh = G.shifts.slice(-1)[0] || { ok: 0, total: 1 }; G.flags.city2 = sh.ok / Math.max(1, sh.total) >= .6 ? 1 : 0;
      G.hope2 = ['c6_fest', 'archive', 'bs_door', 'z_doors'].filter(k => G.flags[k] > 0).length + ['shiori_free', 'mira_accept', 'told_hikari', 'good', 'broadcast_ok', 'faced_kuroda', 'city2'].filter(k => G.flags[k]).length;
      G.flags.truepath = G.hope2 >= 7 && (G.flags.ngp || G.hope2 >= 10) ? 1 : 0;
    }],
    ['if', G => G.flags.city2, [['n', "06:10. Every district reports in. Heroes are frozen on every corner — and around them, the city is *holding*. Firefighters, nurses, konbini clerks, carrying each other."]], [['n', "06:10. Half the districts are dark. Frozen heroes stand like statues in the streets. There's no time left. The Engine is opening."]]],
    ['bg', 'ascension', 'shatter'], ['music', 'boss'], ['light', 'rift'], ['fx', 'glass'],
    ['n', "Board Tower. Floor 100. The Engine hangs above an open roof, a turning sun of Rift light. Below it, one old man in a grey suit, speaking into a microphone connected to every chip in the city."],
    ['cg', 'cg_chairman'], ['sfx', 'heartbeat'],
    ['say', KU, "Citizens of Neo-Tokyo. In a moment, you will all be given what I was given. A voice. Please — *be still.*"],
    ['n', "Across the city, every licensed hero stops moving. Every one. Except nine."],
    ['cgoff'],
    ['show', KU, 'cold', 'default', 'c'],
    ['say', KU, "Squad Zero. Chipless, lawless, and loyal to a clerk. You understand that I'm saving this city."],
    ['show', H, 'furious', 'fist', 'l'], ['show', NA, 'determined', 'fist', 'r'],
    ['say', H, "You froze my mom for SEVEN YEARS!"],
    ['say', NA, "And you did it with a Board-issue freezer. Rude.", 'glare'],
    ['hideall'],
    ['eye', { prompt: 'The last Aegis loyalists and Engine-born glass guardians fill the roof. Kuroda is at the center. Formation?', time: 9000, opts: [
      { t: "“Shiori and Tetsu — shields. Rei and Kaede — flank. Sora, pin the guardians. Rin — find the Engine's note. Hikari, Natsuki — on my mark.”", ok: 1, set: 'z_form', aff: { shiori: 1, tetsu: 1 } },
      { t: "“Everyone at Kuroda, now!”" },
      { t: "“Hold position!”", timeout: 1 }
    ] }],
    ['if', G => G.flags.z_form, [
      ['cutin', SH, 'Aegis — FULL WALL!', 'determined'], ['cutin', T, 'Steel skin! Nobody gets past!', 'determined'],
      ['cutin', SO, 'Gravity — DOWN!', 'furious'], ['sfx', 'boom'], ['impact'],
      ['cutin', K, "Two seconds EARLY this time!", 'smirk'], ['cutin', R, 'Nightveil.', 'cold'],
      ['n', "Twenty guardians shatter in the same heartbeat. The loyalists drop their weapons one by one."]
    ], [
      ['sfx', 'boom'], ['shake', 12], ['n', "It works — barely. Tetsu takes a hit that cracks the steel of his arm. Shiori's shield splinters. They keep moving."],
      ['do', G => { G.hope2 = Math.max(0, G.hope2 - 1); }]
    ]],
    ['music', 'finale'],
    ['show', RI, 'determined', 'fist', 'c'],
    ['say', RI, "I found the note! The Engine is tuned to Natsuki-senpai and Hikari. Mother and daughter. If they sing it back — *louder* — it'll shatter!"],
    ['split', [[H, 'furious'], [NA, 'furious']]], ['sfx', 'thunder'],
    ['say', H, "Mom! Same note! On three!"], ['say', NA, "Kid, I taught you to count! ONE—"],
    ['split', null], ['cutin', H, 'AMANE — DOUBLE — THUNDER!', 'furious'], ['flash', '#fff'], ['impact'], ['crack'],
    ['n', "Lightning and fire hit the Engine in the same instant, in the same key. The sun above the tower rings like a bell struck by a hammer — and cracks."],
    ['hideall'],
    ['show', KU, 'shocked', 'default', 'c'],
    ['say', KU, "No— be still. BE STILL. *KNEEL!*", 'furious'],
    ['n', "Nine heroes. None of them kneel. And one Handler walks across the roof toward him, one step at a time, through a voice that has never once been disobeyed."],
    ['eye', { prompt: 'Kuroda is shouting commands that slide off you like rain. You are face to face. What do you say?', time: 11000, opts: [
      { t: "“You gave people voices by taking away their choices. I'm giving them back.” Take the microphone.", ok: 1, set: 'z_mic' },
      { t: "“It's over, Kuroda. Step away from the Engine.”", set: 'z_calm' },
      { t: 'Say nothing. Just keep walking.', timeout: 1 }
    ] }],
    ['if', G => G.flags.z_mic, [
      ['n', "You take the microphone out of his hand. It's connected to every chip in the city. You say one word into it."],
      ['me', "*Move.*"],
      ['n', "Across Neo-Tokyo, a million frozen heroes take a breath at the same time. Your voice has no power in it at all. They move anyway. Because they want to."],
      ['do', G => { G.hope2++; }], ['ach', 'immune']
    ], [
      ['n', "Kuroda stares at you for a long moment. Then he lowers the microphone. His hand is shaking."]
    ]],
    ['say', KU, "……Forty years. I only wanted everyone to be *free*. The way I was, before the Rift. The way you are.", 'sad'],
    ['me', "Then you should have let them choose."],
    ['say', KU, "…Yes. I suppose I should have.", 'sad'],
    ['hide', KU], ['codex', 'kuroda'],
    ['sfx', 'shatter'], ['shake', 16], ['crack'], ['music', 'sad'],
    ['n', "The Engine collapses. The sun above the tower folds in on itself — and becomes what it always was underneath. A Rift. The biggest one the city has ever seen, pulling everything toward it."],
    ['if', G => G.flags.kyouya_free || G.flags.good, [
      ['show', KY, 'determined', 'point', 'c'],
      ['say', KY, "(comms) It has to be pushed closed from both sides. I've done this before. Your squad pulls — I'll hold the door. And this time, I'm walking out.", 'smile'],
      ['hide', KY]
    ]],
    ['n', "The squad pulls. Lightning, shadow, gravity, wind, steel, fire, sound, and gold. The Rift begins to close — and drags one of them with it."],
    ['jumpf', 'save_', 'route']
  ];
  const saveScene = (who, line1, line2) => [
    ['sfx', 'shatter'], ['shake', 12],
    ['n', `The closing Rift pulls ${who === 'squad' ? 'Tetsu' : '*her*'} backward into the light. The comms go silent.`],
    ['eye', { prompt: 'No Spark. No powers. Just you, and the place where she disappeared.', time: 8000, opts: [{ t: 'Walk into the Rift.', ok: 1 }, { t: 'Run into the Rift.', ok: 1, timeout: 1 }] }],
    ['bg', 'white'], ['music', 'romance'], ['fx', 'glass'], ['light', null],
    ['n', "Inside, there is no up or down. Only light, and the sound of your own heartbeat, and — very faintly — hers."],
    ['n', "You don't need a Spark to find her. You've been reading her every move for forty days."],
    ...(who === 'squad' ? [['show', T, 'tender', 'default', 'c']] : [['show', who, 'cry', 'shy', 'c']]),
    ['say', who === 'squad' ? T : who, line1],
    ['me', "I'm the Handler. I don't leave anyone behind."],
    ['say', who === 'squad' ? T : who, line2, 'love'],
    ['hideall'],
    ['if', G => G.flags.truepath, [['jump', 'true_end']], [['jump', 'epilogue']]]
  ];
  S.save_hikari = saveScene(H, "{name}?! You don't have powers! You can't be in here!", "…Genius Convenience Store Guy. Always knowing where to aim.");
  S.save_rei = saveScene(R, "…You walked into a place made of nothing. For me.", "Then take my hand. I'll find the way out through the shadows — you just don't let go.");
  S.save_mira = saveScene(M, "I told you to eat and sleep. Not to walk into a Rift, {name}.", "…Come here. I've got you. For once, somebody's got *me*.");
  S.save_sora = saveScene(SO, "Handler?! This isn't a stage you can just walk onto!", "…You came to the one show that has no audience. Okay. Encore's over. Let's go home.");
  S.save_kaede = saveScene(K, "You told me to hold. I held. And then it took me anyway…", "…You came slow. On foot. For me. Okay. That's the fastest anyone's ever reached me.");
  S.save_squad = saveScene('squad', "Handler? You shouldn't be here. I'm steel, I'd have been fine.", "…My sisters were right. Home is whoever comes back for you.");

  S.true_end = [
    ['bg', 'white'], ['music', 'finale'], ['fx', 'glass'],
    ['n', "You turn to leave the light. And something stops you. A hum. Many hums. The same note Rin heard under the memorial, months ago."],
    ['show', RI, 'crysmile', 'cheer', 'c'],
    ['say', RI, "(from outside, faint) {name}— {name}, can you hear them? They're right there. All of Squad One. They've been in the glass all along, waiting for the door to open all the way!"],
    ['say', RI, "I can sing them a path. But they need a Handler. Someone to call them in, one by one, the way you call us.", 'determined'],
    ['eye', { prompt: 'Eight years of voices in the light. A squad that never came home. You have one chance to call them.', time: 12000, opts: [{ t: "“Squad One. This is Squad Zero's Handler. Follow my voice. Everybody comes home.”", ok: 1 }, { t: 'Call their names, one by one.', ok: 1, timeout: 1 }] }],
    ['hideall'], ['sfx', 'heal'], ['flash', '#fff'],
    ['n', "They come out of the light one after another. Daichi, laughing. Mei, still holding her radio. Tomo, who had been in the middle of a sneeze eight years ago and finishes it now, loudly."],
    ['if', G => !G.flags.good, [['n', "And last — white hair, a thousand-yard stare, holding the door until everyone else is through — Kyouya Aoi. He walks out on his own two feet."], ['set', 'good']]],
    ['bg', 'memorial'], ['music', 'romance'], ['fx', 'petals'], ['tint', null],
    ['cg', 'cg_truth'],
    ['n', "Every Rift the Board ever opened closes that morning, all at once, like a city exhaling. The glass snow melts into sand in the gutters. Somewhere, a kid builds a castle out of it."],
    ['n', "Squad One comes home eight years late. Aya Takamine meets them at the memorial garden with a bucket of paint and crosses out every one of their names."],
    ['cgoff'], ['ach', 'trueend'], ['ending', 'true'],
    ['jump', 'epilogue']
  ];
  S.epilogue = [
    ['bg', 'white'], ['sfx', 'shatter'], ['flash', '#fff'],
    ['n', "You come out of the light together. Behind you, the Rift folds shut with a sound like a bell."],
    ['bg', 'hq_lobby'], ['music', 'victory'], ['fx', 'petals'], ['letterbox', 0], ['light', null],
    ['title', 'THREE MONTHS LATER', 'Heartline'],
    ['n', "The glass snow melted into sand by autumn. HALO swept it into the memorial garden, where kids build castles out of it now."],
    ['n', "The Board is gone. License chips were pulled out of every hero in the city — Rin sang for eleven straight days. Heroes carry paper licenses now. Nobody can make them kneel."],
    ['n', "Genjirou Kuroda sits in a very ordinary cell. He asked for a window. He's said to watch the rain for hours, and never tells anyone to do anything."],
    ['show', A, 'smile', 'cross', 'l'],
    ['say', A, "Squad Zero. S-rank. The first squad in HALO history run by a Handler with no Spark — and the reason nobody in this city has to kneel again."],
    ['show', SA, 'deadpan', 'default', 'r'],
    ['say', SA, "Deputy Director Saeki, reinstated. For real, this time. I've already reorganized your filing system, Takamine.", 'smirk'],
    ['say', A, "…You fixed my door, too.", 'tender'],
    ['say', SA, "Doors break. It's a known property of doors.", 'smile'],
    ['hideall'],
    ['show', SH, 'smile', 'default', 'l'], ['show', NA, 'happy', 'wave', 'r'],
    ['say', SH, "Aegis is a rescue unit now. We wear orange. Natsuki-san insisted."],
    ['say', NA, "Orange is the color of *coming back*, Shiori-chan. Also, it hides ketchup.", 'laugh'],
    ['hideall'],
    ['show', RI, 'excited', 'cheer', 'c'],
    ['say', RI, "I enrolled in high school again! I'm the only student who remembers when phones had buttons. They think I'm a historian.", 'laugh'],
    ['if', G => G.flags.good || G.flags.kyouya_free, [['say', RI, "Nii-san runs a support group for Rift survivors. It meets on Fridays. After, we get ramen. Squad One tradition!", 'happy']]],
    ['show', B, 'happy', '', 'r'],
    ['say', B, "Handler! Calls are coming in! Also, your dental appointment is today. For real this time. I will be coming with you. For support.", 'happy'],
    ['hideall'],
    ['jumpf', 'fin_', 'route']
  ];
  const fin = (who, cg, lines) => [['bg', 'park'], ['music', 'romance'], ['fx', 'petals'], ['cg', cg], ...lines, ['cgoff'], ['ach', who === 'squad' ? 'fin_squad' : 'route_' + who], ['ending', who], ['end']];
  S.fin_hikari = fin('hikari', 'cg_end_hikari', [
    ['say', H, "Ramen Raijin, table for THREE! Mom's coming! She's already ordered for all of us! She ordered wrong!"],
    ['say', H, "We moved the sunflowers from the memorial to our balcony. Mom says she's “not dead enough” for a memorial. She's very proud of that joke.", 'tender'],
    ['say', H, "Partners on the board. Partners off the board. Forever, okay? No take-backs. …Mom says you have to ask her permission. Don't. She'll make it a whole thing.", 'love'],
    ['n', "*Hikari & {name} — the loudest, brightest, most over-caffeinated couple in HALO history. Supervised by one very loud mother-in-law.*"]
  ]);
  S.fin_rei = fin('rei', 'cg_end_rei', [
    ['say', R, "Kuro had kittens. Four. They're all black. I named one after you. …It's the clumsy one."],
    ['say', R, "Jun came to visit. He hugged me. I didn't flinch. The shadows didn't either. Shiori says I've gone soft. She's jealous.", 'tender'],
    ['say', R, "I don't need to work alone anymore. I have a squad. And I have you. …That's a big deal. You're allowed to make it one.", 'love'],
    ['n', "*Rei & {name} — quiet, stubborn, and never, ever alone again.*"]
  ]);
  S.fin_mira = fin('mira', 'cg_end_mira', [
    ['say', M, "One strawberry mille-feuille for me. One for you. And I'm not taking any wounds today. Doctor's orders."],
    ['say', M, "The SOLACE glass is out of my spine. Rin sang it out, a little every day. I'm just a doctor now. It's wonderful.", 'smile'],
    ['say', M, "You rebuilt dispatch so I'd heal less. They're calling it the Solace Protocol. …You named it after me, you ridiculous man. It's a date. Every Saturday. Medically.", 'love'],
    ['n', "*Mira & {name} — who finally learned to take care of each other.*"]
  ]);
  S.fin_sora = fin('sora', 'cg_end_sora', [
    ['say', SO, "New agency, new contract: STELLAR doesn't own me anymore. I sing what I want now."],
    ['say', SO, "My Dome song hit number one in thirty countries. The comments all say the same thing: “who is the song about.” I'll never tell.", 'smug'],
    ['say', SO, "But I'll be looking at the dispatch van the whole time. Like always. My favorite audience of one.", 'love'],
    ['n', "*Sora & {name} — an idol, a Handler, and a love song the whole world knows by heart.*"]
  ]);
  S.fin_kaede = fin('kaede', 'cg_end_kaede', [
    ['say', K, "Race you to the park gate. Loser buys sneakers."],
    ['say', K, "…Or. We could walk. Slowly. Together. I've gotten weirdly good at slow.", 'blush'],
    ['say', K, "Don't tell Hikari. Actually, tell her. She owes me a race. And her mom owes me a rematch. That lady is FAST.", 'love'],
    ['n', "*Kaede & {name} — the fastest hero in Neo-Tokyo, who learned the best things are worth waiting for.*"]
  ]);
  S.fin_squad = fin('squad', 'cg_end_squad', [
    ['n', "A picnic in Ueno Park. Tetsu brought a bonsai. Hikari and Natsuki brought twenty-two bento. Rei brought Kuro's kittens. Kaede ran for ice. Sora brought a guitar. Rin brought a hard hat. Shiori brought a sketchbook. Mira brought a first-aid kit, just in case."],
    ['say', H, "Squad photo! Everybody say “Handler!”"],
    ['n', "*Squad Zero — nine heroes, one drone, and a clerk with no Spark. Family.*"]
  ]);

  // ======================= NEW HANG OUTS =======================
  S.hang_natsuki_1 = [
    ['bg', 'ramen'], ['music', 'daily'],
    ['show', NA, 'excited', 'wave', 'c'],
    ['say', NA, "Seven years of stasis and the first thing I wanted was ramen. The SECOND thing I wanted was to find out who's been dating my daughter."],
    ['say', NA, "…I'm kidding! Mostly. Eat. You're too thin. Handlers are always too thin.", 'laugh'],
    ['choice', [
      { t: "“Tell me about Hikari when she was little.”", aff: { natsuki: 3 }, then: [['say', NA, "She tried to fight a thunderstorm when she was four. She stood in the yard and shouted at it. It shouted back. She won, in her opinion.", 'laugh']] },
      { t: "“What was Squad One like?”", aff: { natsuki: 2 }, then: [['say', NA, "Loud. Brave. Stupid. Kyouya was the only one of us who read the briefings. We loved him for it and never told him.", 'tender']] }
    ]]
  ];
  S.hang_natsuki_2 = [
    ['bg', 'memorial'], ['music', 'sad'], ['fx', 'petals'],
    ['show', NA, 'sad', 'default', 'c'],
    ['say', NA, "They put my name on a wall. I read it every morning. It's a strange thing, visiting yourself."],
    ['say', NA, "Hikari used to come here every Sunday and yell at it. She told me. I'm so sorry I made her do that.", 'cry'],
    ['choice', [
      { t: "“You came back. That's the only part she remembers now.”", aff: { natsuki: 3 }, then: [['say', NA, "…Kid. Handlers aren't supposed to make rescue heroes cry. It's in the rules.", 'crysmile']] },
      { t: 'Hand her a paint pen. “Cross it out.”', aff: { natsuki: 4 }, then: [['n', "She draws a big, cheerful X through her own name, and underneath it writes: *OUT FOR RAMEN. BACK SOON.*"]] }
    ]]
  ];
  S.hang_natsuki_x = [['bg', 'training'], ['show', NA, 'determined', 'fist', 'c'], ['say', NA, "Push-ups with me, Handler! Rescue heroes do three hundred before breakfast! …I'm on twelve. Stasis is terrible for your core."], ['aff', NA, 1]];
  S.hang_shiori_1 = [
    ['bg', 'cafe'], ['music', 'daily'],
    ['show', SH, 'embarrassed', 'shy', 'c'], ['outfit', SH, 'casual'],
    ['say', SH, "I have never been to a café. The Board scheduled my meals in fifteen-minute blocks. What does one… order?"],
    ['choice', [
      { t: 'Order her the most ridiculous parfait on the menu.', aff: { shiori: 3 }, then: [['n', "It arrives: forty centimeters tall, with sparklers. Shiori stares at it the way she stared at Squad Zero across the rooftop."], ['say', SH, "……I will conquer it.", 'determined']] },
      { t: "“Whatever you want. That's the whole point.”", aff: { shiori: 2 }, then: [['say', SH, "Whatever I want. …That's going to take practice.", 'smile']] }
    ]]
  ];
  S.hang_shiori_2 = [
    ['bg', 'park'], ['music', 'night'], ['tint', 'evening'],
    ['show', SH, 'tender', 'default', 'c'], ['outfit', SH, 'casual'],
    ['say', SH, "I draw. I never told anyone. The Board said art was “non-essential.” I drew the city from every rooftop I ever guarded."],
    ['n', "She hands you the sketchbook. Neo-Tokyo, page after page, in careful pencil. On the last page: seven tiny heroes in a konbini window."],
    ['say', SH, "…That was the night I realized I was on the wrong side. You all looked so happy. On cardboard. In a stockroom.", 'crysmile'],
    ['aff', SH, 3], ['do', G => { G.heroes.shiori.st.cha++; }], ['n', "*Shiori Charisma +1.*"]
  ];
  S.hang_shiori_x = [['bg', 'training'], ['show', SH, 'smirk', 'cross', 'c'], ['say', SH, "Spar with me, Handler. I'll hold back. …That was a joke. Natsuki-san says I'm supposed to make those now."], ['aff', SH, 1]];
  S.hang_generic = [['bg', 'hq_lobby'], ['n', "You spend a quiet evening together at HQ. Nothing happens, and it's exactly what you both needed."], ['do', G => { if (G.hangWho) G.aff[G.hangWho] = (G.aff[G.hangWho] || 0) + 1; }]];
  return S;
})());

Object.assign(STORY.events, {
  ev_snow_glass: { day: 29, ch: 9, until: 10, s: [
    ['bg', 'shrine'], ['fx', 'snow'], ['tint', 'night'],
    ['n', "Tetsu has built a snowman out of glass snow. It's two meters tall, perfectly clear, and it chimes when the wind blows."],
    ['show', 'tetsu', 'happy', 'default', 'c'], ['say', 'tetsu', "His name is Kazuo the Second. He's a bonsai's best friend."],
    ['n', "By morning, someone has put Kaede's scarf on him, Rei's cat hairclip, and a tiny HALO badge made of cardboard. Nobody admits to anything."],
    ['hide', 'tetsu'], ['do', G => { G.morale = Math.min(100, (G.morale || 60) + 5); }], ['n', "*Squad morale +5.*"]
  ] },
  ev_natsuki_cook: { day: 35, ch: 10, need: 'natsuki', s: [
    ['bg', 'hq_lobby'], ['show', 'natsuki', 'excited', 'wave', 'c'],
    ['say', 'natsuki', "Handler! I made curry for the squad! It's my famous recipe! It's… it's gone a bit grey. That's normal. Probably."],
    ['choice', [{ t: 'Eat it bravely.', then: [['n', "It is the worst curry you have ever eaten. Hikari, across the table, eats three bowls and cries with happiness. It's her mom's curry. It always tasted like this."], ['aff', 'hikari', 2]] }, { t: "“Let me help next time.”", then: [['say', 'natsuki', "Kid, I'd love that. Don't tell Hikari I can't cook. She thinks I'm a genius.", 'laugh']] }]],
    ['aff', 'natsuki', 1], ['hide', 'natsuki']
  ] },
  ev_shiori_sweets: { day: 38, ch: 11, need: 'shiori', s: [
    ['bg', 'konbini'], ['tint', 'night'],
    ['n', "You catch Shiori Kagami in the konbini at 2am, standing in front of the dessert fridge like it's a battlefield."],
    ['show', 'shiori', 'embarrassed', 'shy', 'c'], ['say', 'shiori', "There are nineteen kinds of pudding. How does anyone choose? How does anyone LIVE like this?"],
    ['n', "Mr. Oba sells her one of each. She eats them in order of calorie count, taking notes."],
    ['aff', 'shiori', 1], ['hide', 'shiori']
  ] },
  ev_kyouya_letter: { day: 22, ch: 6, need: 'rin', s: [
    ['bg', 'office'],
    ['n', "A letter on your desk, in careful, cramped handwriting."],
    ['n', "*Handler. They let me write one letter a week. This one's to you. Thank you for bringing my sister home. Tell Hikari I'm sorry. Tell Aya I'm sorry. Tell Rin to eat vegetables. — K.A.*"],
    ['if', G => G.flags.good, [['aff', 'rin', 1]], [['n', "It's dated eight years ago. Aya found it in his old desk and left it for you."]]]
  ] }
});

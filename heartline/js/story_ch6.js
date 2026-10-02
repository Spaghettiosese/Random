/* HEARTLINE AGENCY — Arc Two, part one: Chapter 6 (Echo), Chapter 7 (The Board), Chapter 8 (Rogue). */
Object.assign(STORY.scripts, (() => {
  const H = 'hikari', R = 'rei', M = 'mira', A = 'aya', B = 'bit', K = 'kaede', T = 'tetsu', SO = 'sora', KY = 'kyouya', RI = 'rin', KU = 'kuroda', SA = 'saeki', SH = 'shiori';
  const S = {};
  const day = (label, shift, after) => [['daycard'], ...(label ? [['call', label]] : []), ['shift', shift], ...(after ? [['call', after]] : []), ['hub'], ['night'], ['nextday']];

  // ======================= CHAPTER 6 · ECHO =======================
  S.ch6 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 6', 'Echo'],
    ['chapter', 6, 'Chapter 6 · Echo', 'the Summer Festival', 21],
    ['bg', 'medbay'], ['music', 'mystery'], ['fx', 'dust'],
    ['n', "Day 19. Three days after Operation Heartline. Summer arrived overnight, the Shibuya glass is melting into sand, and the med bay has a new patient."],
    ['show', RI, 'sleepy', 'default', 'c'],
    ['say', RI, "…It's still you. Good. I keep closing my eyes and then waiting to open them and find out it's another eight years."],
    ['t', "She is holding a metal spoon up in front of her face and moving her mouth into shapes. Smile. Not that smile. Smile."],
    ['show', M, 'tender', 'default', 'l'],
    ['say', M, "Your vitals are perfect, Rin. Better than perfect. Which is, medically speaking, extremely upsetting.", 'sweat'],
    ['say', RI, "Sorry. I'll try to be more broken.", 'tease'],
    ['show', H, 'excited', 'wave', 'r'],
    ['say', H, "Is she awake? I brought melon bread, and a phone charger, and a list of everything that happened in the last eight years. It's forty pages. I tried to make it shorter."],
    ['say', RI, "…You look exactly like Natsuki-senpai.", 'awe'],
    ['say', H, "……", 'stunned'],
    ['say', H, "She was my mom.", 'tender'],
    ['say', RI, "Was? No, she was right there. She carried me three blocks through the glass. She was laughing. She said, count to a thousand, Rinrin, and don't look back.", 'cry'],
    ['say', RI, "I counted to nine hundred and twelve. Then I looked back.", 'sob'],
    ['choice', [
      { t: "\"What did you see?\"", then: [['say', RI, "Light. Her hard hat, floating. And her hand, still pointing at the exit.", 'sad'], ['say', H, "…That is *so* her.", 'crysmile'], ['set', 'rin_saw']] },
      { t: "Give them a moment. Step outside.", aff: { hikari: 2, rin: 1 }, then: [['hide', H], ['hide', RI], ['n', "Through the door I hear Hikari laughing and crying at the same time, and Rin telling a long story about a hard hat."]] }
    ]],
    ['hideall'],
    ['bg', 'office'], ['music', 'hq'], ['fx', null],
    ['show', A, 'serious', 'cross', 'c'],
    ['say', A, "The Board wants Rin Aoi in a lab by Friday. Their paperwork calls her \"Rift-touched material.\""],
    ['say', A, "There is one law they can't get around. A licensed hero under an active Handler is agency personnel, untouchable without a full hearing.", 'wry'],
    ['say', A, "So as of this morning Rin Aoi is a Squad Zero trainee. Congratulations, {name}. Your newest recruit is eight years late.", 'wry'],
    ['me', "Does she know that?"],
    ['say', A, "She asked where to sign before I'd finished the sentence.", 'smile'],
    ['say', A, "One more thing. What happened at the crossing. The Chairman's voice.", 'serious'],
    ['say', A, "Every license chip in HALO has a Board failsafe. We were told it was for tracking. I am beginning to think we were told a lot of things.", 'cold'],
    ['say', A, "And you stayed standing. Keep that to yourself. Especially from the Board.", 'resolve', 'point'],
    ['recruit', RI], ['codex', 'chips'], ['ach', 'rin_join'],
    ['hideall'],
    ['bg', 'training'], ['music', 'daily'],
    ['show', RI, 'excited', 'cheer', 'c'],
    ['say', RI, "Trainee Rin Aoi, callsign Echo, reporting. Do we still salute? A girl in the elevator said \"that's valid\" about my jacket. I don't know if that was a compliment."],
    ['t', "She hums while she waits for an answer. A low note. It's the same note as the radiator."],
    ['tell', RI, 'hum', "Hums the note of whatever is nearest: a radiator, a person, a fear. If the hum changes, something nearby has changed."],
    ['show', K, 'smirk', 'hip', 'l'], ['say', K, "Oh, you're going to fit right in."],
    ['show', T, 'smile', 'default', 'r'], ['say', T, "Welcome to Squad Zero, Rin. We have snacks, a door budget, and a drone that sings."],
    ['say', RI, "My power is resonance. Everything has a note it's tuned to: glass, steel, bone. I hear it and hum it back. Softly, things float. Loudly…", 'think'],
    ['sfx', 'glass'], ['shake', 4], ['n', "Every window in the training room hums. A water glass on the bench collapses into a perfect ring of dust."],
    ['say', RI, "…Loudly, things don't.", 'sweat'],
    ['say', K, "Okay, I take it back. You're terrifying.", 'shocked'],
    ['hideall'],
    ...day(null, { title: 'Day 19 · Heat Advisory', calls: 11, tiers: [2, 3], diff: 1.5 }, 'ch6_after19'),
    ...day('ch6_day20', { title: 'Day 20 · Echoes', calls: 12, tiers: [2, 4], diff: 1.55, special: [{ at: 180, t: 'Humming Subway — Akiba Line', d: 'The whole Akiba line is ringing like a bell. Rin says something down there is singing back to her.', r: '3 4 3 2 6', n: 2, tier: 3, dist: 'akiba', flag: 'c6_hum', ev: 'echo' }] }, 'ch6_after20'),
    ['daycard'], ['call', 'ch6_day21'],
    ['shift', { title: 'Day 21 · Festival Prep', calls: 9, tiers: [2, 3], diff: 1.5, real: 260 }],
    ['jump', 'ch6_festival']
  ];
  S.ch6_after19 = [
    ['bg', 'hq_lobby'], ['tint', 'evening'], ['music', 'night'],
    ['show', RI, 'shocked', 'default', 'c'], ['outfit', RI, 'casual'],
    ["say", RI, "{name}. Phones don't have buttons any more. You just rub the glass. Like a genie."],
    ['say', RI, "And everyone takes photographs of their food. Is it evidence? Is the food in trouble?", 'confused'],
    ['me', "It's a long story. Mostly it's about ramen."],
    ['say', RI, "…Nii-san and I used to have ramen every Friday after shift. Squad One tradition.", 'tender'],
    ['say', RI, "I'm a little scared to go to sleep tonight. What if I wake up and it's another eight years?", 'sad', 'shy'],
    ['choice', [
      { t: "\"Then I'll still be here. Older, but here.\"", aff: { rin: 3 }, then: [['say', RI, "…With a wrinkle? Like Nii-san?", 'crysmile'], ['me', "Two wrinkles. At least."], ['say', RI, "Okay. I can sleep with two wrinkles.", 'happy']] },
      { t: "Set a phone alarm for her. \"It rings at seven a.m. Not in eight years.\"", aff: { rin: 2 }, then: [['say', RI, "You have to show me how to turn it off. Otherwise I'll just keep rubbing it.", 'laugh']] }
    ]],
    ['hide', RI], ['codex', 'rin']
  ];
  S.ch6_day20 = [
    ['bg', 'memorial'], ['music', 'sad'], ['fx', 'petals'], ['tint', null],
    ['n', "Morning. The HALO memorial garden. Hikari brought sunflowers. Rin brought a hard hat she found in the evidence locker."],
    ['show', H, 'tender', 'shy', 'l'], ['show', RI, 'sad', 'default', 'r'],
    ['say', H, "Mom's name is right there. Natsuki Amane. Salamander. I used to come here every week and yell at it."],
    ['say', RI, "She talked about you constantly. \"My kid's going to be louder than me.\" She was so proud of that.", 'crysmile'],
    ['say', H, "…Was I? Louder?", 'crysmile'],
    ['say', RI, "Hikari, the birds left when you arrived.", 'laugh'],
    ['n', "Rin stops laughing. She tilts her head, the way you do when someone starts a song in the next room."],
    ['say', RI, "…That's strange. The Rift is closed. I felt it close. So why is the ground still humming?", 'confused'],
    ['say', RI, "It's the same note. The Shibuya note. From underground, east of here. As if somebody is holding it open somewhere else.", 'serious'],
    ['hideall'], ['set', 'c6_note']
  ];
  S.ch6_after20 = [
    ['bg', 'ops'], ['music', 'mystery'],
    ['if', G => G.flags.c6_hum > 0, [
      ['show', RI, 'determined', 'fist', 'c'],
      ['say', RI, "The subway was singing back because something down there is tuned to the Rift. Mira found this in the tunnel wall."],
      ['show', M, 'think', 'default', 'r'],
      ['say', M, "A shard of Rift glass. Cut, polished, serial-numbered. B.I.T., what's the prefix?", 'serious'],
      ['show', B, 'sad', '', 'l'], ['say', B, "Prefix BRD-H7. That is a Board inventory code. I am not supposed to know that. I have already forgotten it.", 'sad']
    ], [
      ['show', RI, 'sad', 'default', 'c'],
      ['say', RI, "The humming stopped before we got there. As if someone switched it off because they knew I was coming.", 'sad'],
      ['say', RI, "I don't like this, {name}. It feels like being watched by a very quiet song."]
    ]],
    ['hideall']
  ];
  S.ch6_day21 = [
    ['bg', 'hq_lobby'], ['music', 'daily'],
    ['show', SO, 'excited', 'cheer', 'c'],
    ['say', SO, "Squad announcement. The Sumida Summer Festival is tonight. Yukata are mandatory. I've rented nine."],
    ['show', T, 'sweat', 'default', 'l'], ['say', T, "Do they come in… my size?"],
    ['say', SO, "I had yours custom-made, Tetsu. It has bonsai on it.", 'wink'],
    ['say', T, "……Sora. I'm going to cry.", 'crysmile'],
    ['show', R, 'cold', 'cross', 'r'], ['say', R, "I am not wearing a yukata."],
    ['say', SO, "Yours is black with small cats on it.", 'smug'],
    ['say', R, "……I will consider it.", 'blush'],
    ['hideall']
  ];
  S.ch6_festival = [
    ['bg', 'festival', 'iris'], ['tint', 'night'], ['music', 'festival'], ['fx', 'fireflies'], ['wear', 'yukata'],
    ['n', "The Sumida Summer Festival. Lantern light, takoyaki smoke, goldfish in paper bowls, and ten thousand people in summer yukata."],
    ['cg', 'cg_festival'], ['wait', 2200],
    ['n', "For one evening Squad Zero is just a group of twenty-somethings at a festival."],
    ['cgoff'],
    ['show', H, 'excited', 'cheer', 'l'], ['show', K, 'smirk', 'point', 'r'],
    ['say', H, "Goldfish scooping. Loser buys shaved ice for the whole squad."],
    ['say', K, "You're on, Amane. I have the fastest hands in the—", 'smug'],
    ['sfx', 'glass'], ['n', "Kaede's paper scoop tears instantly. Hikari's tears instantly. Rin, beside them, hums one soft note and six goldfish float gently into her bowl."],
    ['show', RI, 'happy', 'wave', 'c'], ['say', RI, "Is that allowed?"],
    ['say', H, "No.", 'furious'], ['say', K, "Absolutely not.", 'furious'],
    ['hideall'],
    ['show', T, 'happy', 'default', 'l'], ['show', R, 'blush', 'shy', 'r'],
    ['say', T, "Rei wore the cat yukata."],
    ['say', R, "It was clean. That is the only reason.", 'flustered'],
    ['hideall'],
    ['n', "The first fireworks start. The crowd surges toward the river. Somewhere in the crush I realize I'm standing next to someone."],
    ['choice', [
      { t: 'Hikari.', if: G => G.known.hikari !== undefined, then: [['set', 'fest', 'hikari'], ['aff', H, 3]] },
      { t: 'Rei.', then: [['set', 'fest', 'rei'], ['aff', R, 3]] },
      { t: 'Mira.', then: [['set', 'fest', 'mira'], ['aff', M, 3]] },
      { t: 'Sora.', if: G => G.roster.includes('sora'), then: [['set', 'fest', 'sora'], ['aff', SO, 3]] },
      { t: 'Kaede.', then: [['set', 'fest', 'kaede'], ['aff', K, 3]] }
    ]],
    ['fx', 'fireworks'], ['music', 'romance'], ['ach', 'festival'],
    ['if', G => G.flags.fest === 'hikari', [['cg', 'cg_fest_hikari'], ['say', H, "…It's so loud. I love it. Mom took me here every year. This is the first time I haven't felt sad about it.", 'tender'], ['say', H, "Thanks for standing next to me.", 'fond']]],
    ['if', G => G.flags.fest === 'rei', [['cg', 'cg_fest_rei'], ['say', R, "Fireworks are light thrown at the dark. I always found that a little arrogant.", 'halfsmile'], ['say', R, "…I think I like it, now.", 'blush']]],
    ['if', G => G.flags.fest === 'mira', [['cg', 'cg_fest_mira'], ['say', M, "No sirens. No wounds. Just color. I'd forgotten evenings could be like this.", 'tender'], ['say', M, "Stay a little longer? Doctor's orders.", 'fond']]],
    ['if', G => G.flags.fest === 'sora', [['cg', 'cg_fest_sora'], ['say', SO, "Nobody is looking at me. They're all looking up. It's the best feeling in the world.", 'awe'], ['say', SO, "…Except you. You're looking at me. That's allowed.", 'fond']]],
    ['if', G => G.flags.fest === 'kaede', [['cg', 'cg_fest_kaede'], ['say', K, "Four seconds to go up, one to disappear. That's rude.", 'pout'], ['say', K, "…Worth it, though. Right? Some things are.", 'blush']]],
    ['wait', 800], ['cgoff'],
    ['sfx', 'shatter'], ['shake', 10], ['music', 'tension'], ['fx', 'glass'],
    ['n', "A firework bursts and does not fade. The sparks freeze in the sky, turn to glass, and start to fall."],
    ['show', RI, 'scared', 'shy', 'c'],
    ['say', RI, "No, no, it's me, it's following me. The note. I can't stop hearing it.", 'sob'],
    ['n', "Over the river the air splits open. A Rift the size of a doorway. Glass creatures crawl out humming the same note as Rin."],
    ['eye', { prompt: 'Ten thousand civilians. A micro-Rift. A terrified trainee at its center. Call it.', time: 9000, opts: [
      { t: "\"Rin, look at me. Hum the opposite note. Everyone else: evacuate the bridge.\"", ok: 1, set: 'c6_calm', aff: { rin: 3 } },
      { t: "\"Everyone fight. Hit the creatures before they reach the crowd.\"", aff: { hikari: 1 } },
      { t: "\"Get Rin out of here. Now.\"", timeout: 1 }
    ] }],
    ['if', G => G.flags.c6_calm, [
      ['say', RI, "The opposite. Okay. Counter-note.", 'determined', 'fist'], ['sfx', 'chime'],
      ['n', "Rin sings one pure, low note. The glass creatures stagger like someone has pulled the floor out from under their song."]
    ], [
      ['n', "The squad engages. The creatures shatter, reform, keep humming. Rin is shaking too hard to help."]
    ]],
    ['hideall'], ['wear', null],
    ['shift', { title: 'Day 21 · Festival Night', start: 19, calls: 10, tiers: [2, 4], diff: 1.55, real: 280, music: 'action', special: [{ at: 60, t: 'Micro-Rift — Sumida River', d: 'The doorway Rift over the river is widening. Rin can hold the counter-note if someone guards her.', r: '6 5 3 4 6', n: 3, tier: 4, dist: 'riverside', flag: 'c6_fest', ev: 'echo' }, { at: 220, t: 'Stampede on the Festival Bridge', d: 'The crowd is panicking on a bridge built for a tenth of them.', r: '2 6 3 8 3', n: 2, tier: 3, dist: 'riverside', flag: 'c6_bridge', ev: 'crowd' }] }],
    ['jump', 'ch6_climax']
  ];
  S.ch6_climax = [
    ['bg', 'festival'], ['tint', 'night'], ['fx', 'embers'], ['music', 'sad'],
    ['if', G => G.flags.c6_fest > 0, [
      ['n', "23:40. The micro-Rift is gone. The river is full of floating paper lanterns and very confused goldfish. Nobody died."],
      ['show', RI, 'crysmile', 'default', 'c'], ['say', RI, "I held it. I actually held it. Did you see? I didn't break anything. Well. Much."]
    ], [
      ['n', "23:40. The micro-Rift collapsed on its own, eventually. The riverbank is glass for fifty meters. Forty people are in hospital. Nobody died, barely."],
      ['show', RI, 'sob', 'shy', 'c'], ['say', RI, "It's my fault. It came because of me. The Board is right. I'm a walking Rift."]
    ]],
    ['choice', [
      { t: "\"You're not a walking Rift. You're a hero who closed one.\"", aff: { rin: 3 }, then: [['say', RI, "…Say that again when I'm less snotty.", 'crysmile']] },
      { t: "\"Whatever you are, you're Squad Zero. We carry you.\"", aff: { rin: 2, tetsu: 1 }, then: [['show', T, 'tender', 'default', 'r'], ['say', T, "That's the rule. Nobody gets left in the glass. Not any more."]] }
    ]],
    ['hideall'],
    ['bg', 'medbay'], ['music', 'mystery'], ['tint', null], ['fx', null],
    ['show', M, 'serious', 'default', 'c'],
    ['say', M, "I ran Rin's scans again after the festival. {name}, her Spark is growing. Every time she's near Rift energy, it gets stronger."],
    ['say', M, "Rift exposure feeds Sparks. That isn't a theory any more. It's her blood work.", 'cold'],
    ['say', M, "Which means someone could make Sparks. On purpose. If they didn't care what it cost.", 'scared'],
    ['show', A, 'cold', 'cross', 'r'],
    ['say', A, "The Board sent the summons an hour ago. The hearing is tomorrow. They want Rin, the scans, and you."],
    ['say', A, "Wear a tie. And whatever you do, don't let them see you don't kneel.", 'serious', 'point'],
    ['hideall'], ['codex', 'sparks'], ['codex', 'rifts'],
    ['journal', "The summer festival. A Rift opened over the river because Rin was there. Mira says Rift light feeds Sparks. Someone has been using that."],
    ['recap'], ['jump', 'ch7']
  ];

  // ======================= CHAPTER 7 · THE BOARD =======================
  S.ch7 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 7', 'The Board'],
    ['chapter', 7, 'Chapter 7 · The Board', 'the Board Gala', 24],
    ['bg', 'boardroom'], ['music', 'board'], ['light', 'dark'],
    ['n', "Day 22. Board Tower, floor 100. A room so quiet you can hear the air conditioning think."],
    ['n', "Twelve chairs. Eleven are empty; the members attend by hologram, faces blurred. The twelfth is occupied."],
    ['cg', 'cg_board'], ['sfx', 'heartbeat'],
    ['say', KU, "Director Takamine. Handler {name}. Please, sit. You have had a difficult month."],
    ['cgoff'], ['know', KU],
    ['show', KU, 'smile', 'default', 'c'],
    ['say', KU, "I am Genjirou Kuroda. I chair this Board. I have chaired it for forty years. I was there when the first Rift opened, and I will be there when the last one closes."],
    ['show', A, 'cold', 'cross', 'l'],
    ['say', A, "Get to the point, Chairman. You want Rin Aoi."],
    ['say', KU, "I want *understanding*, Director. The girl spent eight years inside a Rift and came out stronger. That is not a tragedy. That is a door.", 'think'],
    ['say', KU, "Handler. You stood at the crossing when everyone else knelt. Stand for me now. Kneel.", 'ominous'],
    ['sfx', 'heartbeat'], ['shake', 5], ['filter', 'mono'],
    ['n', "Aya's chair scrapes. Her hand grips the table so hard her knuckles go white, and she stays seated, barely. Every hologram flickers down to one knee."],
    ['t', "Nothing. The word slides off me like rain off a window."],
    ['filter', null],
    ['say', KU, "Remarkable. A Spark-negative. Do you know how rare it is to meet a truly free man, Handler? I was one, once.", 'smile'],
    ['say', KU, "Then a Rift opened in my village, and I was given a voice. Forty years later I would like to give that gift to everyone.", 'tender'],
    ['me', "Everyone who survives it, you mean."],
    ['say', KU, "……Yes. That is exactly what I mean.", 'cold'],
    ['say', KU, "Director Takamine, for the unsanctioned recruitment of Board research material, you are relieved of command, effective immediately. Deputy Saeki will serve as acting Director.", 'serious'],
    ['show', SA, 'deadpan', 'default', 'r'], ['know', SA],
    ['say', SA, "Charmed. I have already reorganized your filing system, Takamine. It was a crime scene."],
    ['say', A, "……", 'furious'],
    ['say', KU, "The girl stays with Squad Zero, under Deputy Saeki's supervision. Handler, do give my regards to your heroes. They knelt beautifully.", 'smirk'],
    ['hideall'], ['light', null], ['codex', 'kuroda'], ['codex', 'saeki'], ['codex', 'board'], ['do', G => { G.flags.aya_out = 1; }],
    ['bg', 'hq_lobby'], ['music', 'hq'],
    ['show', SA, 'cold', 'point', 'c'],
    ['say', SA, "Squad Zero. New policies. One: shift quotas. You will hit your objectives or your credit allowance will reflect it."],
    ['say', SA, "Two: fraternization between Handlers and heroes is now against policy.", 'deadpan'],
    ['show', H, 'shocked', 'default', 'l'], ['say', H, "What? We have a squad hot pot every week."],
    ['say', SA, "Three: the hot pot is also against policy.", 'deadpan'],
    ['show', K, 'furious', 'fist', 'r'], ['say', K, "This guy is the worst."],
    ['say', SA, "Four. The Handler's office door is broken. It has been broken for six weeks. Someone should fix that. It would be terrible if people could simply walk in and out. Unobserved.", 'think'],
    ['n', "He walks away. Hikari and Kaede stare after him. I stare at my office door, which is indeed broken."],
    ['hideall'],
    ...day(null, { title: 'Day 22 · Quota', calls: 12, tiers: [2, 4], diff: 1.6 }, 'ch7_after22'),
    ...day(null, { title: 'Day 23 · Under Review', calls: 12, tiers: [2, 4], diff: 1.6, special: [{ at: 200, t: 'Board Drone Sweep — Uptown', d: 'Board surveillance drones are "inspecting" a hero rally. Someone is about to get hurt by a drone that will not stop recording.', r: '2 3 4 5 5', n: 2, tier: 3, dist: 'uptown', flag: 'c7_drones', ev: 'hack' }] }, 'ch7_ramen'),
    ['daycard'], ['call', 'ch7_prep'],
    ['shift', { title: 'Day 24 · Before the Gala', calls: 10, tiers: [2, 4], diff: 1.6, real: 280 }],
    ['jump', 'ch7_gala']
  ];
  S.ch7_after22 = [
    ['bg', 'apartment'], ['tint', 'night'], ['music', 'night'],
    ['sfx', 'phone'], ['n', "A text from an unknown number. No name. Just a photograph of a very ugly ramen bowl."],
    ['n', "*Ramen Ichiban. Tomorrow, 21:00. Come alone. Bring an appetite. — Your former boss.*"],
    ['t', "…Aya."]
  ];
  S.ch7_ramen = [
    ['bg', 'ramen'], ['tint', 'night'], ['music', 'mystery'],
    ['n', "Ramen Ichiban, 21:00. The only other customer wears sunglasses indoors, a baseball cap, and a hoodie that says *I ♥ NEO-TOKYO*."],
    ['show', A, 'smug', 'default', 'c'], ['outfit', A, 'casual'],
    ['say', A, "Don't laugh. It's the only disguise I own. B.I.T. gave it to me."],
    ['say', A, "Eight years ago the Board sealed the Shibuya files. Every Director since has been told they're irrelevant to operations.", 'serious'],
    ['say', A, "The originals are in the Board archive on floor 88. Tomorrow night the Board hosts its annual gala on floor 90. Every hero in the city will be there, including mine.", 'resolve'],
    ['say', A, "You're a Handler. You're invisible at a party full of heroes. You won't get a better chance.", 'wry'],
    ['choice', [
      { t: "\"I'll do it. For Rin. For Squad One.\"", aff: { aya: 3 }, set: 'aya_trust', then: [['say', A, "…Thank you. B.I.T. will be your lockpick. It loves crime. It won't admit that.", 'smile']] },
      { t: "\"Why not do it yourself?\"", then: [['say', A, "Because Saeki revoked my badge, my car, and my coffee mug. He's very thorough.", 'deadpan'], ['say', A, "…And because if I read those files myself, I'm not sure I'd stay calm.", 'sad']] }
    ]],
    ['say', A, "One more thing. Saeki said something to you. About a broken door.", 'think'],
    ['me', "He said someone should fix it."],
    ['say', A, "…Interesting. Don't fix it.", 'wry'],
    ['hideall'], ['outfit', A, 'hero']
  ];
  S.ch7_prep = [
    ['bg', 'hq_lobby'], ['music', 'daily'],
    ['show', SO, 'excited', 'heart', 'c'],
    ['say', SO, "Gala dress code: formal. I've prepared everyone's outfit. I prepared yours twice."],
    ['show', R, 'deadpan', 'cross', 'l'], ['say', R, "Why twice?"],
    ['say', SO, "The first one was too handsome. It would have distracted Operations.", 'smug'],
    ['show', RI, 'excited', 'cheer', 'r'], ['say', RI, "Will there be a chocolate fountain? Squad One's gala had a chocolate fountain. Nii-san fell in it."],
    ['hideall']
  ];
  S.ch7_gala = [
    ['bg', 'boardroom', 'iris'], ['tint', 'night'], ['music', 'board'], ['wear', 'formal'], ['vfx', 'bokeh'],
    ['n', "The Board Gala. Floor 90. Chandeliers made of polished Rift glass. A string quartet. Four hundred heroes in evening wear, pretending to be relaxed."],
    ['show', H, 'excited', 'cheer', 'l'], ['show', R, 'flustered', 'shy', 'r'],
    ['say', H, "{name}. There's a whole table of tiny food. Tiny sushi. Tiny cake. I'm going to eat all of it and become tiny."],
    ['say', R, "…Stop looking at me. It's a dress. I have worn clothing before.", 'flustered'],
    ['choice', [
      { t: "\"You look incredible, Rei.\"", aff: { rei: 3 }, then: [['say', R, "……I'm going to stand in a shadow now. For a while.", 'embarrassed']] },
      { t: "\"Hikari, save some tiny food for the other four hundred people.\"", aff: { hikari: 1 }, then: [['say', H, "No promises.", 'happy']] }
    ]],
    ['hideall'], ['vfx', null],
    ['n', "21:40. Kuroda is giving a toast. Every eye in the room is on him. I slip into the service corridor. B.I.T. hums quietly in my jacket."],
    ['bg', 'lab', 'wipe'], ['music', 'mystery'], ['light', 'deep'],
    ['show', B, 'excited', '', 'c'],
    ['say', B, "Floor 88. Archive door. Seventeen layers of Board encryption. I have never been this excited in my entire operational life.", 'happy'],
    ['hide', B],
    ['breach', { title: 'Board Archive · Floor 88', sub: 'B.I.T. is patching you into the archive lock. Spell the Board override sequence before security rotates.', len: 4, buf: 7, time: 30000, flag: 'archive' }],
    ['if', G => G.flags.archive > 0, [
      ['sfx', 'confirm'], ['n', "*ACCESS GRANTED.* The archive door slides open. Inside: one terminal, one folder, one word on the cover."]
    ], [
      ['sfx', 'alarm'], ['n', "*ACCESS DENIED.* An alarm starts, then stops abruptly, as if someone has muted it on purpose. The door clicks open anyway."],
      ['t', "…Someone just let me in."]
    ]],
    ['filter', 'flashback'], ['zoom', 1.15, 50, 40, 1600], ['blur', 3], ['music', 'sad'],
    ['n', "*PROJECT SPARK HARVEST.* Twenty years of reports. Rift openings, logged in advance. Dates. Locations. *Yield estimates.*"],
    ['n', "Rifts are not natural disasters. The Board has been opening them on purpose. Rift light creates Sparks, one survivor in ten thousand. The Board's term for the rest is \"acceptable input.\""],
    ['n', "Shibuya, eight years ago: *HARVEST SITE 7. Squad One deployed as collection team. Objective: recover Rift glass for license chip production.*"],
    ['t', "License chips. They're made from Rift glass. That is why Kuroda's voice works through them."],
    ['n', "And at the bottom of the Squad One file, a line in red: *AMANE, NATSUKI — STATUS: RECOVERED (Year +1). TRANSFERRED TO SECTOR ZERO. DO NOT DISCLOSE.*"],
    ['t', "……Recovered. Hikari's mother was *recovered*."],
    ['filter', null], ['zoom', 1], ['blur', 0], ['codex', 'harvest'], ['codex', 'shibuya'],
    ['sfx', 'door'], ['show', SA, 'deadpan', 'default', 'c'], ['light', null],
    ['say', SA, "Handler. The archive is off-limits. You're aware."],
    ['eye', { prompt: 'Deputy Saeki is standing in the only doorway. B.I.T. has the files. What do you do?', time: 8000, opts: [
      { t: "\"You left the door broken on purpose. Didn't you.\"", ok: 1, set: 'saeki_read', then: [['say', SA, "…Doors break. It's a known property of doors.", 'wry'], ['say', SA, "Security rotates in eleven minutes. I would walk faster. And Handler, I was never here.", 'deadpan']] },
      { t: "Bluff. \"Aya sent me. She'll have your job for this.\"", then: [['say', SA, "Takamine has no job to give anyone. That is rather the point.", 'cold'], ['say', SA, "…Eleven minutes. Go.", 'deadpan']] },
      { t: 'Run past him.', timeout: 1, then: [['n', "I duck past him. He doesn't even try to stop me. Behind me I hear him sigh: \"Eleven minutes, you idiot.\""]] }
    ] }],
    ['hideall'], ['wear', null],
    ['journal', "The Board opens Rifts on purpose. Project Spark Harvest. License chips are Rift glass. Hikari's mother was \"recovered\" and sent somewhere called Sector Zero."],
    ['jump', 'ch7_climax']
  ];
  S.ch7_climax = [
    ['nextday'], ['daycard'],
    ['bg', 'ops'], ['music', 'tension'],
    ['n', "Day 25. 08:02. Every screen in the ops room switches to the same broadcast at once."],
    ['show', KU, 'serious', 'default', 'c'],
    ['say', KU, "Citizens. Last night, classified Board research was stolen by operatives of HALO's Squad Zero. For the city's safety, their licenses are suspended."],
    ['say', KU, "The Board's elite unit, Aegis, will escort them in. Please do not interfere. Please remain calm. Please remember who protects you.", 'smile'],
    ['hide', KU],
    ['show', H, 'shocked', 'default', 'l'], ['show', K, 'furious', 'fist', 'r'],
    ['say', H, "Suspended? We didn't steal anything. …Did we?"],
    ['me', "We borrowed the truth. I'll explain on the way."],
    ['say', K, "On the way *where*?", 'shocked'],
    ['show', B, 'excited', '', 'c'], ['say', B, "Handler. I have hijacked elevator four. I have also hijacked the building's music. It is now playing a very tense song.", 'happy'],
    ['hideall'],
    ['shift', { title: 'Day 25 · Manhunt', calls: 11, tiers: [2, 4], diff: 1.65, music: 'boss', special: [{ at: 120, t: 'Aegis Checkpoint — Riverside', d: 'Aegis has sealed the river bridges. Civilians are stuck in the heat. Someone needs to open a lane.', r: '4 5 4 6 4', n: 2, tier: 3, dist: 'riverside', flag: 'c7_check', ev: 'aegis' }, { at: 300, t: 'HALO Tower Escape', d: 'Aegis is sweeping HALO Tower floor by floor. Get the squad and the files out.', r: '5 5 7 3 6', n: 3, tier: 4, dist: 'uptown', flag: 'c7_escape', ev: 'aegis' }] }],
    ['bg', 'street_night'], ['tint', 'night'], ['music', 'boss'], ['fx', 'rain'],
    ['n', "19:30. The squad regroups in a back alley behind the station. Rain. Sirens. Somewhere above, the hum of Board drones."],
    ['sfx', 'zap'], ['flash', '#f2c14e'],
    ['cg', 'cg_aegis'], ['sfx', 'boom'], ['impact'],
    ['n', "A figure drops from the rooftop in a wash of golden hard light. White coat. Navy hair. Eyes like struck matches."],
    ['cgoff'],
    ['show', SH, 'cold', 'point', 'c'], ['know', SH],
    ['say', SH, "Shiori Kagami, Aegis Prime. Squad Zero, you will come with me. I would prefer not to hurt anyone. I will not lose sleep if I do."],
    ['show', R, 'glare', 'cross', 'l'],
    ['say', R, "You're the Board's attack dog."],
    ['say', SH, "I am the Board's shield. The difference is that I don't bark.", 'cold'],
    ['eye', { prompt: 'Aegis Prime blocks the alley. Troopers on the roofs. The squad is exhausted. Your call.', time: 9000, opts: [
      { t: "\"Tetsu, wall. Rin, hum the drains. Everyone out through the sewer.\"", ok: 1, set: 'c7_out', aff: { tetsu: 1, rin: 1 } },
      { t: "\"Hikari, Rei — hit her together.\"", set: 'c7_fight' },
      { t: "\"…We surrender.\"", timeout: 1 }
    ] }],
    ['if', G => G.flags.c7_out, [
      ['show', T, 'determined', 'cross', 'r'], ['say', T, "Steel skin. Go, go."], ['sfx', 'glass'],
      ['n', "Rin hums. Every drain grate on the block rattles loose. The squad drops into the dark. Tetsu goes last, pulling the grate shut behind him with one hand."],
      ['say', SH, "…Clever. Next time I won't give you the second it took.", 'smirk']
    ], [
      ['n', "Hikari and Rei hit Aegis Prime together. Lightning and shadow meet a wall of gold light, and bounce."],
      ['say', SH, "Predictable.", 'cold'],
      ['n', "In the end it's Kaede who grabs everyone and runs, three trips, faster than Aegis can follow. She's throwing up in a bin afterward. She saved us all."],
      ['aff', K, 2]
    ]],
    ['hideall'], ['fx', null], ['codex', 'aegis'], ['codex', 'shiori'],
    ['journal', "The Board named us thieves on live TV. Aegis Prime, Shiori Kagami, nearly caught us in the rain. We are off the books now."],
    ['recap'], ['jump', 'ch8']
  ];

  // ======================= CHAPTER 8 · ROGUE =======================
  S.ch8 = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['nextday'],
    ['title', 'CHAPTER 8', 'Rogue'],
    ['chapter', 8, 'Chapter 8 · Rogue', 'nowhere to hide', 28],
    ['bg', 'konbini'], ['music', 'night'], ['tint', 'night'],
    ['n', "Day 26, 02:00. The only 24-hour convenience store in Neo-Tokyo that still has my employee badge on the corkboard."],
    ['n', "Night manager Oba looks up from his crossword at seven wanted heroes, one drone, and me, dripping on his floor."],
    ['n', "*Oba:* \"…The stockroom has a sofa and a microwave. Don't touch the pudding. The pudding is mine.\""],
    ['bg', 'konbini_hq', 'wipe'],
    ['cg', 'cg_konbini'], ['wait', 2200],
    ['n', "By sunrise the stockroom is Squad Zero's new headquarters. B.I.T. is wired into the police scanner. The city map is drawn in marker on a flattened instant-ramen box."],
    ['cgoff'],
    ['show', B, 'excited', '', 'c'],
    ['say', B, "HALO Dispatch has been handed to the Board. Response times are up forty percent. Calls are going unanswered. The city is leaking, Handler."],
    ['show', H, 'determined', 'fist', 'l'],
    ['say', H, "Then we answer them. License or no license. The people calling don't care what our badges say."],
    ['show', R, 'smirk', 'cross', 'r'],
    ['say', R, "Unlicensed heroics. Illegal, dangerous, and extremely stupid. …I'm in."],
    ['say', B, "Establishing Konbini Dispatch. Night shifts only. Our cover story is that we are very enthusiastic stock clerks.", 'happy'],
    ['hideall'], ['codex', 'konbini'], ['set', 'rogue'], ['set', 'hubbg', 'konbini_hq'], ['morale', -5],
    ...day(null, { title: 'Off the Books · Night 26', start: 18, calls: 11, tiers: [2, 4], diff: 1.6, music: 'night' }, 'ch8_after26'),
    ...day('ch8_day27', { title: 'Off the Books · Night 27', start: 18, calls: 11, tiers: [2, 4], diff: 1.65, music: 'night', special: [{ at: 160, t: 'Collapsed Footbridge — Old Town', d: 'A footbridge came down on a school trip. Aegis is already en route. So is the collapse.', r: '4 6 4 5 4', n: 3, tier: 4, dist: 'oldtown', flag: 'c8_bridge', ev: 'aegis' }] }, 'ch8_after27'),
    ['daycard'], ['call', 'ch8_day28'],
    ['shift', { title: 'Off the Books · Siege of Aisle Four', start: 18, calls: 11, tiers: [3, 4], diff: 1.7, music: 'boss', special: [{ at: 250, t: 'AEGIS RAID — Konbini HQ', d: 'Aegis has found the store. Mr. Oba is inside. So is the pudding.', r: '7 7 5 4 5', n: 3, tier: 4, dist: 'shibuya', flag: 'c8_raid', ev: 'aegis' }] }],
    ['jump', 'ch8_climax']
  ];
  S.ch8_after26 = [
    ['bg', 'konbini_hq'], ['music', 'night'], ['tint', 'night'],
    ['show', T, 'sweat', 'default', 'c'], ['outfit', T, 'casual'],
    ['say', T, "Handler, I tried to restock aisle four. I'm very sorry about the shelf."],
    ['show', K, 'laugh', 'hip', 'l'], ['outfit', K, 'casual'], ['say', K, "Forty delivery runs today. In disguise. Nobody recognized me. One lady tipped me a pear."],
    ['show', SO, 'smug', 'wave', 'r'], ['outfit', SO, 'casual'], ['say', SO, "I've been on the register. Sales are up three hundred percent. Mr. Oba wants to give me a raise."],
    ['n', "It's strange. We're fugitives, sleeping on cardboard in a stockroom, and the squad is laughing more than they have in weeks."],
    ['hideall']
  ];
  S.ch8_day27 = [
    ['bg', 'station'], ['music', 'mystery'], ['tint', 'dusk'],
    ['show', M, 'sweat', 'shy', 'c'], ['outfit', M, 'casual'],
    ['say', M, "{name}, can I tell you something odd? My hands have been cold all week. And yesterday a scar opened up on my arm."],
    ['say', M, "It's from a wound I took for Tetsu two months ago. It healed. I watched it heal. And now it's back.", 'scared'],
    ['me', "Since when?"],
    ['say', M, "Since the Board started running their new generators on floor 100. I don't know why I know that. I just feel it. Like a tide.", 'think'],
    ['say', M, "I'm fine. Totally. Please don't make that face. I'm the doctor, remember?", 'crysmile'],
    ['t', "Her mouth is smiling. Nothing else is. She has re-stacked the same three boxes of bandages while talking."],
    ['hide', M], ['set', 'mira_cold']
  ];
  S.ch8_after27 = [
    ['bg', 'street_night'], ['tint', 'night'], ['music', 'tension'], ['fx', 'rain'],
    ['if', G => G.flags.c8_bridge > 0, [
      ['n', "The footbridge call. When we got there, Aegis was already on site. For five tense minutes, heroes in gold and heroes in rain-soaked hoodies pulled schoolkids out of the rubble side by side."],
      ['show', SH, 'serious', 'default', 'c'],
      ['say', SH, "…Your Tetsu held the span for eleven minutes. That is not in his file."],
      ['me', "His file doesn't know him."],
      ['say', SH, "This changes nothing. Next time, I bring you in.", 'cold'],
      ['n', "She doesn't bring us in. She turns around and walks the other way, and her squad follows without asking why."],
      ['set', 'shiori_trust']
    ], [
      ['n', "The footbridge call. Aegis got there first. They pulled every child out, efficiently, silently, perfectly. They did not let our squad near the site."],
      ['show', SH, 'cold', 'cross', 'c'],
      ['say', SH, "You see? The city does not need you. It needs order."]
    ]],
    ['t', "Before she asks the next question she adjusts her cuffs. Both of them. Left, then right. She has done it before every line she didn't want to say."],
    ['tell', SH, 'cuffs', "Adjusts her cuffs, left then right, before an order or a sentence she doesn't want to carry out."],
    ['say', SH, "…Handler. A question. Off the record.", 'think'],
    ['say', SH, "When the Chairman speaks, my body moves. I have always called it loyalty. Is there another word for it?", 'serious'],
    ['choice', [
      { t: "\"Yes. It's called a leash. It's in your license chip.\"", aff: { shiori: 2 }, set: 'shiori_doubt', then: [['say', SH, "……Liar.", 'glare'], ['say', SH, "…Send me the file. So I can prove you are lying.", 'serious']] },
      { t: "\"Ask him. See what he says.\"", aff: { shiori: 1 }, then: [['say', SH, "I don't ask the Chairman things. …That is a strange sentence, now that I hear it aloud.", 'confused']] }
    ]],
    ['hideall'], ['fx', null]
  ];
  S.ch8_day28 = [
    ['bg', 'konbini_hq'], ['music', 'daily'],
    ['show', RI, 'think', 'default', 'c'], ['outfit', RI, 'casual'],
    ['say', RI, "I've been listening to the city at night. There's a new hum. Deeper than Shibuya. It's coming from Board Tower, floor 100."],
    ['say', RI, "It's getting louder every night. Like something tuning up for a concert.", 'scared'],
    ['show', R, 'serious', 'cross', 'l'], ['outfit', R, 'casual'],
    ['say', R, "And my shadows can't get near the tower. It is like walking into a wall of light."],
    ['hideall']
  ];
  S.ch8_climax = [
    ['bg', 'konbini', 'flash'], ['tint', 'night'], ['music', 'boss'], ['fx', 'sparks'],
    ['if', G => G.flags.c8_raid > 0, [
      ['n', "Aegis came through the front door at 23:10. Squad Zero was already gone through the back, with Mr. Oba, the police scanner, the ramen-box map, and the pudding."],
      ['n', "*Oba:* \"I have worked nights for thirty years. That was the best one.\""]
    ], [
      ['n', "Aegis came through the front door at 23:10. It was close. Tetsu held the stockroom door. Kaede made eleven trips. Mr. Oba threatened an Aegis trooper with a mop and won."],
      ['morale', -5]
    ]],
    ['bg', 'mountain', 'wipe'], ['music', 'sad'], ['fx', null],
    ['n', "03:00. The old road up to the hilltop shrine. Eight heroes, a drone, and a Handler, climbing in the dark with everything they own."],
    ['show', H, 'sleepy', 'default', 'c'],
    ['say', H, "{name}. When this is over I want a real bed. And a real bath. And a medal. A big one. Made of ramen.", 'sleepy'],
    ['n', "Hikari stops walking. She holds out her hand, palm up."],
    ['say', H, "…Hey. Is it… snowing?", 'confused'],
    ['sfx', 'chime'], ['fx', 'snow'], ['music', 'snow'], ['tint', 'night'],
    ['n', "It's the last week of August. And it is snowing on Neo-Tokyo."],
    ['n', "The flakes don't melt. They chime when they touch the ground. Every one of them is made of glass."],
    ['show', RI, 'scared', 'shy', 'l'],
    ['say', RI, "…That's the note. The tower note. It isn't tuning up any more. It's *playing*."],
    ['hideall'], ['codex', 'glasssnow'],
    ['journal', "Aegis raided the konbini. We got out. On the road to the shrine, it started snowing glass. In August."],
    ['recap'], ['jump', 'ch9']
  ];

  // ======================= RIN · HANG OUTS =======================
  S.hang_rin_1 = [
    ['bg', 'arcade'], ['music', 'daily'],
    ['show', RI, 'awe', 'default', 'c'],
    ['say', RI, "The arcade is still here. It's so much louder now. Why do the machines scream?"],
    ['say', RI, "Squad One used to come here after shift. Nii-san was terrible at every game. Natsuki-senpai held the high score on the punching machine for three years.", 'smile'],
    ['n', "We find the punching machine. The high-score board is eight years out of date. *AMANE N.* is still at the top."],
    ['choice', [
      { t: "\"Want to beat it?\"", aff: { rin: 3 }, then: [['sfx', 'punch'], ['shake', 5], ['n', "Rin hums at the punching bag. The bag flies off its hinges and through the back wall."], ['say', RI, "…Is that a new high score or a new crime?", 'sweat']] },
      { t: "\"Let's leave it. It's hers.\"", aff: { rin: 2 }, then: [['say', RI, "…Yes. Some things should stay where they are.", 'tender']] }
    ]]
  ];
  S.hang_rin_2 = [
    ['bg', 'rooftop'], ['tint', 'night'], ['music', 'night'], ['fx', 'stars'],
    ['show', RI, 'sad', 'default', 'c'],
    ['say', RI, "Everyone I went to school with is twenty-five now. Some are married. One of them is a dentist."],
    ['say', RI, "I looked up my best friend. She has a baby. I didn't message her. What would I say? \"Hi, I'm still seventeen, want to get crêpes?\"", 'crysmile'],
    ['choice', [
      { t: "\"Say exactly that. She'll cry, and then you'll get crêpes.\"", aff: { rin: 3 }, then: [['say', RI, "…You think?", 'stunned'], ['n', "Two days later Rin comes back from a café with frosting on her nose and red eyes. \"She named the baby Rin,\" she tells me. \"She said she never stopped waiting.\""]] },
      { t: "\"You have a new squad now. We'll get crêpes.\"", aff: { rin: 2 }, then: [['say', RI, "Squad crêpes. A tradition. I'm making it a tradition.", 'excited']] }
    ]]
  ];
  S.hang_rin_3 = [
    ['bg', 'stage'], ['music', 'romance'],
    ['show', RI, 'tender', 'default', 'c'],
    ['say', RI, "I haven't sung for fun since before Shibuya. Every note since then has been a weapon."],
    ['say', RI, "Can I try? A normal song. Badly. For you.", 'shy'],
    ['sfx', 'chime'], ['n', "She sings an old idol song from eight years ago, completely off-key. Nothing shatters. Nothing floats. It's just a girl, singing, laughing at herself."],
    ['say', RI, "…That's the first time it didn't hurt. Thank you for listening to the boring part.", 'fond'],
    ['aff', RI, 2], ['do', G => { G.heroes.rin.st.cha++; }], ['n', "*Rin Charisma +1.*"]
  ];
  S.hang_rin_x = [['bg', 'cafe'], ['show', RI, 'excited', 'cheer', 'c'], ['say', RI, "{name}. Did you know you can put bubbles in tea now? Eight years, and humanity invented chewy tea. I'm so proud of us."], ['aff', RI, 1]];
  return S;
})());

Object.assign(STORY.events, {
  ev_rin_phone: { day: 19, ch: 6, until: 8, need: 'rin', s: [
    ['bg', 'hq_lobby'], ['show', 'rin', 'shocked', 'default', 'c'], ['sfx', 'phone'],
    ['say', 'rin', "{name}. My new phone is talking to me. It says it's \"listening.\" Is it Board surveillance?"],
    ['choice', [{ t: "\"That's just the voice assistant.\"", then: [['say', 'rin', "…Hello, voice assistant. Please play Squad One's favorite song.", 'think'], ['n', "The phone plays a song called \"Squad One.\" It's a children's counting rhyme. Rin laughs so hard she has to sit down."]] }, { t: 'Take the phone and turn the mic off.', then: [['say', 'rin', "Thank you. I don't like things that listen without asking.", 'tender']] }]],
    ['aff', 'rin', 1], ['hide', 'rin']
  ] },
  ev_saeki_door: { day: 22, ch: 7, until: 7, s: [
    ['bg', 'office'], ['show', 'saeki', 'deadpan', 'default', 'c'],
    ['say', 'saeki', "Handler. I'm conducting an audit of broken doors. Yours is still broken. Excellent. Carry on."],
    ['n', "He leaves. On my desk there's a sticky note that wasn't there before: *Floor 88 security rotates at :40.*"],
    ['hide', 'saeki']
  ] },
  ev_oba_pudding: { day: 26, ch: 8, until: 8, s: [
    ['bg', 'konbini'], ['tint', 'night'],
    ['n', "Mr. Oba finds the squad crowded around the stockroom microwave at four a.m., eating instant ramen out of the same pot."],
    ['n', "*Oba:* \"…There's pudding in the back. Everyone gets one. Don't make it weird.\""],
    ['n', "Rei eats hers in silence. Then, very quietly, she thanks him. Oba nods as if he's been given a medal."],
    ['do', G => { G.morale = Math.min(100, (G.morale || 60) + 6); }], ['n', "*Squad morale +6.*"]
  ] },
  ev_shiori_note: { day: 27, ch: 8, until: 10, need: 'shiori', s: [
    ['bg', 'station'], ['tint', 'night'],
    ['n', "Taped to the ticket gate I pass every night: a folded sketch. The konbini, drawn in careful pencil. Seven tiny heroes in the window."],
    ['n', "On the back, in precise handwriting: *Aegis sweeps this district at 02:00. Be elsewhere. — S.K.*"],
    ['aff', 'shiori', 1], ['set', 'shiori_trust']
  ] }
});

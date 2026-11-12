/* HEARTLINE: HOME (DLC) — the Squad ending's track.
   No wedding: a child from the Board's Juvenile Wing (wristband J-41, "NO YIELD") picks the one quiet adult in the
   room. Part One is the key ring with nine keys, Part Two the court hearing and nine signatures, Part Four the
   question at dinner, Part Five the nights. From Part Six on it rejoins the shared spine. */
(() => {
  const H = 'hikari', R = 'rei', M = 'mira', K = 'kaede', SO = 'sora', TE = 'tetsu', A = 'aya', B = 'bit', RI = 'rin', SH = 'shiori', NA = 'natsuki', SA = 'saeki', KD = 'kid', K2 = 'kid2', OB = 'oba';
  const S = STORY.scripts, { kcg, part } = STORY.dlcK;
  const top = G => STORY.dlcTop(G), tw = G => G.flags.twokids;

  S.dlc_us_squad = [['n', "And me: a Handler with a squad, an office door that closes, and nobody waiting at home except a rice cooker. I set its timer every morning, for one."]];

  // ---------- Part One: Nine Keys ----------
  S.dlc_sq_p1 = [
    ...part(1, 'Nine Keys', 'SPRING'),
    ['bg', 'lab'], ['music', 'mystery'],
    ['n', "Sector Nine was the last Board facility on the list. It took a year to get the warrant. By the time HALO opens the doors there's nothing left but filing cabinets and a smell like a swimming pool."],
    ['show', A, 'serious', 'cross', 'l'],
    ['say', A, "Juvenile Wing. Spark Harvest kept a ward for children under six. The files say it was emptied before the raids. The files say a lot of things."],
    ['show', RI, 'confused', 'default', 'r'],
    ['say', RI, "Somebody's humming. Very small. Behind that wall."],
    ['hideall'],
    ['sfx', 'boom'], ['shake', 1],
    ['n', "Tetsu takes the wall out with one hand, politely, like he's opening a jar. Behind it: one bed, one lamp, a care drone on its last bar of battery, and a child."],
    ['n', "Four years old, about. A scar the size of a rice grain on the back of the neck, where a chip came out. A wristband: *J-41. NO YIELD.*"],
    ['show', H, 'tender', 'reach', 'c'],
    ['n', "Hikari crouches and holds out her hand. The child backs into the corner. Mira tries. Kaede tries, slowly, for Kaede. Every time a hero gets close, the child covers both ears."],
    ['hide', H],
    ['show', RI, 'sad', 'default', 'c'],
    ['say', RI, "Oh. It's us. We're loud. Every Spark has a note, and this one can hear all of them at once. I know what that's like. It's a room where everybody's talking."],
    ['hide', RI],
    ['t', "I'm standing by the door with a clipboard. I don't have a note."],
    ['n', "The child walks the whole length of the room, around Tetsu's boots, and sits down on the floor next to me. Doesn't look at me. Leans, very slightly, against my leg."],
    ['show', B, 'surprised', '', 'r'],
    ['say', B, "Handler. You appear to have been selected. I do not believe there is an appeals process."],
    ['hide', B],
    ['n', "The care drone's log has six lines. Feeding times. Lamp on, lamp off. And one line of description."],
    ['choice', [
      { t: 'The log says: a girl.', then: [['set', 'kidg', 'girl']] },
      { t: 'The log says: a boy.', then: [['set', 'kidg', 'boy']] }
    ]],
    ['show', RI, 'determined', 'default', 'c'],
    ['say', RI, "A number isn't a name. A number is an address. {KidS} needs a name."],
    ['hide', RI],
    ['kidname', 'kid', 'A name for {kidO}'],
    ['n', "{kid}. {KidS} tries it without any sound, just the shape of it, twice. Then {kidS} nods, once, like a contract."],
    ['bg', 'office'], ['music', 'hq'],
    ['show', A, 'deadpan', 'cross', 'c'],
    ['say', A, "Emergency foster placement. {KidS} needs somebody Spark-negative. Somebody quiet. I can think of exactly one person in this city."],
    ['me', "Director, I work nights. I live in one room. I have a rice cooker."],
    ['say', A, "I've already filled in the form.", 'smile'],
    ['n', "She takes her glasses off and cleans them."],
    ['say', A, "I sat in a van at Shibuya and lost a whole squad. I'd like, once, to sign a piece of paper that brings somebody in. Noted?", 'tender'],
    ['me', "…Noted."],
    ['hide', A],
    ['bg', 'hq_lobby'], ['music', 'daily'],
    ['n', "On the way out, the squad is waiting in the lobby. All of them. Tetsu is holding something in his fist like it might get away."],
    ['show', TE, 'nervous', 'default', 'c'],
    ['say', TE, "We had a meeting. It was short. Here."],
    ['n', "A key ring. Nine keys, each with a strip of colored tape: yellow, violet, pink, green, silver, and four more."],
    ['say', TE, "Our places. All of them. So you never have to knock. Any hour. With {kidO} or without. Mine's the big one. I got a bigger lock so the key would be easy to find.", 'crysmile'],
    ['hide', TE],
    ['show', K, 'smirk', 'hip', 'l'], ['show', R, 'halfsmile', 'cross', 'r'],
    ['say', K, "Mine's green. I'm never home. Use the couch. Don't touch the stopwatches."],
    ['say', R, "Mine comes with a cat. The cat will pretend to hate {kidO}. It won't be pretending. Give it a month."],
    ['hideall'],
    ['n', "{kid} holds the key ring the whole way home on the train, in both hands, counting the keys by touch. {KidS} gets to nine and starts again."],
    ['ach', 'dlc_ring'],
    ['jump', 'dlc_p2']
  ];

  // ---------- Part Two: Nine Signatures ----------
  S.dlc_sq_p2 = [
    ...part(2, 'Nine Signatures', 'AUTUMN, A YEAR LATER'),
    ['bg', 'office'], ['music', 'hq'], ['wear', 'formal'],
    ['n', "Family Court, Room 4. A year of foster placement. Forty-one home visits. One social worker, Ms. Ishii, who has eaten Natsuki's curry and lived to file a report on it."],
    ['n', "The judge has reading glasses on a chain and the voice of somebody who has heard everything twice. She reads the file for a long time."],
    ['n', "\"The applicant is single. He works nights, in emergency services. No Spark. One room. The child has significant needs.\" She looks at me over the glasses. \"Mr. {name}. Who supports this application?\""],
    ['n', "I turn around. The gallery is full."],
    ['show', TE, 'determined', 'default', 'c'],
    ['say', TE, "Tetsu Oda. Construction. I'll sign."],
    ['hide', TE],
    ['show', H, 'determined', 'fist', 'l'], ['show', R, 'guarded', 'cross', 'r'],
    ['say', H, "Hikari Amane! I'll sign. I'll sign twice, if it helps. Does it help?"],
    ['say', R, "Rei Kurogane. Do I have to give a reason? …The child likes my cat. The cat allows it. That has never happened."],
    ['hideall'],
    ['show', M, 'smile', 'heart', 'l'], ['show', K, 'smirk', 'hip', 'r'],
    ['say', M, "Dr. Mira Solace. I've done {kidP} check-ups. {KidS}'s gained four kilos and learned to argue. Medically, that's a home."],
    ['say', K, "Kaede Mori. I'd have signed faster, but there was a line."],
    ['hideall'],
    ['n', "Sora signs in sunglasses. Rin signs and adds a phrase she collected for the occasion: *for keeps.* Natsuki signs in orange marker, because it's the color of coming back."],
    ['show', SH, 'serious', 'default', 'c'],
    ['say', SH, "Shiori Kagami, Aegis Rescue. Procedurally, a character reference needs one signature. I have brought the form in nine copies, in case of loss."],
    ['show', B, 'happy', '', 'r'],
    ['say', B, "I would also like to sign."],
    ['n', "\"The drone may not sign,\" says the judge."],
    ['say', B, "Then I will hover supportively.", 'sad'],
    ['hideall'],
    ['n', "The judge takes her glasses off. She looks at {kid}, who is sitting very straight on a chair that's too big, holding a key ring."],
    ['n', "\"{kid}. Do you understand what we're deciding today?\""],
    ['say', KD, "He's the quiet one. I picked him first. They're just catching up."],
    ['n', "\"…So ordered.\""],
    ['sfx', 'chime'],
    ['bg', 'park'], ['music', 'romance'], ['fx', 'petals'],
    ['n', "There's a party in Ueno Park afterward, under an arch Tetsu built overnight out of scaffolding and about four hundred flowers. I say it isn't a wedding."],
    ['show', NA, 'laugh', 'cheer', 'c'],
    ['say', NA, "It's nine people promising to show up for the rest of their lives, kid. What exactly do you think a wedding is?"],
    ['hide', NA],
    ['n', "They want me to say something. To {kid}. In front of everyone."],
    ['choice', [
      { t: '"I\'ll always tell you where I am. That\'s my whole job. You get it for free."', then: [['fam', 'home', 2]] },
      { t: '"You can be loud here. You can be anything here. Nobody gets sent back."', then: [['fam', 'brave', 1], ['fam', 'home', 1]] },
      { t: '"I don\'t know how to do this. So we\'ll write it down as we go. Both of us."', then: [['fam', 'curious', 1], ['fam', 'home', 1]] }
    ]],
    ...kcg('cg_dlc_wed_squad'),
    ['n', "Nine signatures on a court form. Nine keys on a ring. {kid} in the middle of all of them, laughing, with both hands in the air."],
    ['cgoff'],
    ['n', "Somebody puts on music. {kid} wants to dance and doesn't know how. Neither do I. {KidS} stands on my shoes."],
    ['rhythm', { title: 'First Dance (on your shoes)', sub: 'Small steps. {kid} is steering.', track: 'romance', bars: 6, flag: 'dance' }],
    ['if', G => G.flags.dance === 'S', [['ach', 'dlc_dance'], ['n', "We don't fall over once. {kid} bows at the end, to the squad, like {kidS} planned it."], ['fam', 'home', 1]], [['n', "We fall over twice. The second time {kid} decides it was on purpose and does it a third time."]]],
    ['wear', 'casual'], ['fx', null],
    ['ach', 'dlc_wed'],
    ['jump', 'dlc_p3']
  ];

  S.dlc_homep_squad = [['n', "{kid} picks the room with the window. {KidS} doesn't say why. A month later I work it out: from that window, at night, you can see the lit floors of the HALO tower. {KidS} can see where I am."]];
  S.dlc_cook_squad = [['n', "{kid} and I make onigiri. {KidS} makes them square, \"so they stack.\" Tetsu sees a photo and has to go and stand in the hallway for a minute."]];
  S.dlc_fight_squad = [
    ['bg', 'apartment'], ['music', 'sad'], ['tint', 'night'],
    ['n', "Month nine. {kid} falls off the climbing frame at kindergarten and breaks a wrist. I was on a call. A bus in Kanda. I found out forty minutes later."],
    ['n', "After that I stop sleeping. I walk {kidO} to school and wait outside the fence. I hand off three shifts. I start a notebook that's just a list of things in the apartment with corners."],
    ['show', TE, 'smile', 'default', 'c'],
    ['say', TE, "Good evening, Handler. I hope I'm not disturbing you. May I come in? Thank you so much."],
    ['say', TE, "I wanted to let you know that I built a fence around the kindergarten playground. Steel. Three meters. I did it last night. The school has asked me to take it down. I told them no, very courteously."],
    ['me', "…You built a fence."],
    ['say', TE, "I did, sir. And then I stood there looking at it, and I thought: that's what he's doing. You can't dispatch a child's whole life. You taught us that. You let us walk into Rifts.", 'serious'],
    ['choice', [
      { t: '"You\'re right. Take the fence down. I\'ll take mine down too."', then: [['say', TE, "Thank you. I'll bring a wrench for yours.", 'crysmile'], ['fam', 'home', 2], ['aff', TE, 2]] },
      { t: '"{KidS} broke {kidP} wrist, Tetsu. I wasn\'t there."', then: [['say', TE, "No, sir. Nine other people were. Go and count the names on the cast.", 'tender'], ['n', "I count them after {kid}'s asleep. There are eleven. Mr. Oba signed it. So did the bus driver from Kanda."], ['fam', 'home', -1]] },
      { read: 'tetsu_polite', t: '"You called me \'sir.\' You\'re furious."', then: [['say', TE, "…I'm terrified. It comes out as manners. I carried {kidO} to the nurse myself and my hands shook the whole way. Steel hands. Shaking.", 'cry'], ['me', "Then we're both scared. That's two. Split the load."], ['fam', 'home', 2], ['aff', TE, 3]] }
    ]],
    ['n', "The fence comes down on Saturday. {kid} goes back up the climbing frame on Monday, with the cast on, to the top. I stay on the other side of the road. It's the hardest call I've ever run."],
    ['hide', TE], ['tint', null]
  ];

  // ---------- Part Four: The Question ----------
  S.dlc_sq_p4 = [
    ...part(4, 'The Question', 'THE SECOND YEAR'),
    ['bg', 'apartment'], ['music', 'night'], ['tint', 'evening'],
    ['n', "It comes at dinner, on a Wednesday, between the rice and the miso. {kid} asks it the way you'd ask what time the train leaves."],
    ['say', KD, "When do I go back?"],
    ['me', "Back where?"],
    ['say', KD, "The room. With the lamp. When you're finished."],
    ['choice', [
      { t: '"You don\'t go back. This is the room now. It has a worse lamp."', then: [['say', KD, "…It's a pretty bad lamp."], ['me', "We'll get a better one. You can pick."], ['fam', 'kind', 1]] },
      { t: 'Get the court paper. Show {kidO} the word. "Permanent."', then: [['me', "It means I can't give you back even if you ask me to."], ['say', KD, "What if I'm bad?"], ['me', "Then you're bad here."], ['fam', 'brave', 1]] },
      { t: 'Open the notebook. Write it down where {kidS} can see: "Vol. 45. {kid} stays."', then: [['n', "{KidS} can't read yet. {KidS} asks me to read it out. Then again. Then {kidS} draws a box around it in crayon, so it can't get out."], ['fam', 'curious', 1]] }
    ]],
    ['n', "{KidS} doesn't ask again. But {kidS} checks the notebook, some nights, when {kidS} thinks I'm asleep."],
    ['bg', 'park'], ['music', 'daily'], ['tint', null],
    ['n', "Kindergarten is loud. Not the children. The Sparks. Three kids in {kidP} class have one, and by ten each morning {kid} is under a table with both hands over {kidP} ears."],
    ['show', RI, 'determined', 'default', 'c'],
    ['say', RI, "Here's what I do. You pick one note. Yours. Any note. And you hum it on the inside, where nobody can hear. Then everyone else is just weather."],
    ['say', KD, "What's your note?"],
    ['say', RI, "It changes. Mine's always whoever's standing next to me. Yours should be yours. That's better. Don't do it my way.", 'tender'],
    ['hide', RI],
    ['n', "{kid} picks a note. I never find out which. But {kidS} comes out from under the table."],
    ['bg', 'apartment'], ['music', 'daily'],
    ['n', "{kid} wants a bunk bed. For one child. \"The top's for me. The bottom's for whoever needs it.\" Tetsu hears this and builds one out of oak, in a hundred and forty pieces, with hand-drawn instructions."],
    ['breach', { title: 'The Bunk Bed (140 pieces)', sub: 'Tetsu\'s instructions. Step 4 is a drawing of a bonsai. {kid} is holding the screws.', len: 5, buf: 8, time: 32000, flag: 'crib' }],
    ['if', G => G.flags.crib > 0, [['ach', 'dlc_crib'], ['n', "No leftover screws. {kid} climbs to the top bunk and announces that the bottom is open for business."], ['fam', 'home', 1]], [['n', "It leans. Tetsu comes over, takes it apart without a word, rebuilds it in an hour, and tells {kid} the two of us did most of it."], ['aff', TE, 1]]],
    ['bg', 'ops'], ['music', 'hq'], ['tint', 'night'],
    ['n', "The babysitter cancels on a Thursday. So {kid} comes to work: under the dispatch desk, in a blanket, with headphones and a juice box, where the heroes' notes are only voices on a radio."],
    ['do', (G, api) => { G.flags.dlc_tut = api.meta.stats.shifts ? 0 : 1; }],
    ['if', G => G.flags.dlc_tut, [['shift', { title: 'Night Shift, With Company', calls: 5, tiers: [1, 1], diff: .9, real: 240, music: 'hq', tutorial: true }]], [['shift', { title: 'Night Shift, With Company', calls: 7, tiers: [1, 2, 3], diff: 1.1, real: 180, music: 'hq' }]]],
    ['bg', 'ops'], ['music', 'night'], ['tint', 'night'],
    ['n', "Grade {grade}. At the end I look under the desk. {KidS}'s awake. {KidS} has one headphone off."],
    ['say', KD, "You told everybody where to go. And they all came back."],
    ['me', "That's the job."],
    ['say', KD, "…I want the bottom of the desk again tomorrow."],
    ['tint', null],
    ['jump', 'dlc_p5']
  ];

  // ---------- Part Five: Small Hours ----------
  S.dlc_sq_p5 = [
    ...part(5, 'Small Hours', 'THAT WINTER'),
    ['bg', 'apartment'], ['music', 'night'], ['tint', 'night'],
    ['n', "03:00. Most nights. {kid} wakes up screaming and doesn't know which room it is. Holding {kidO} doesn't work. The light doesn't work. What works, it turns out, is the radio."],
    ['n', "I put one HALO handset on {kidP} pillow and take the other to the kitchen."],
    ['me', "Handler to {kid}. All quiet in the kitchen. The fridge is humming. It's two degrees outside. Over."],
    ['say', KD, "(radio) …{kid} to Handler. …Over."],
    ['rhythm', { title: 'Night Watch', sub: 'Talk {kidO} down like a call. Slow. Steady. Don\'t stop transmitting.', track: 'night', bars: 6, flag: 'lullaby' }],
    ['if', G => ['S', 'A'].includes(G.flags.lullaby), [['n', "{KidS}'s asleep before I run out of things in the kitchen to describe. I keep the channel open till morning anyway."], ['fam', 'home', 1]], [['n', "I describe the whole kitchen, then the hallway, then the weather in six districts. Somewhere around Setagaya, {kidS} falls asleep."]]],
    ['n', "There are a lot of nights. I keep notes. Notebook Vol. 46: hours slept, what worked, a column for things that might have been smiles."],
    ['choice', [
      { t: 'Read {kidO} the old call logs. Weather. Times. The way Rei holds her scarf.', then: [['n', "{KidS} listens like it's an adventure serial. Maybe it is."], ['fam', 'curious', 1]] },
      { t: 'Walk {kidO} around the block at four a.m. to look at the streetlights.', then: [['n', "{KidS} stares down a delivery truck like it's a dragon and {kidS} is deciding whether to fight it."], ['fam', 'brave', 1]] },
      { t: 'Hum, quietly, with no note at all, while {kidS} holds my finger.', then: [['n', "{KidS} holds on until my finger goes white. Every night. Checking I'm still there."], ['fam', 'kind', 1]] }
    ]],
    ['n', "The squad sets up a rota. Each of them takes a night. {kid} is learning their notes, one at a time, like faces."],
    ...kcg('cg_dlc_baby_squad'),
    ['n', "Tetsu's night: he reads one page of a picture book about a bulldozer and falls asleep before {kid} does. {kid} puts the blanket over him."],
    ['cgoff'],
    ['bg', 'konbini'], ['tint', 'night'], ['music', 'daily'],
    ['n', "And then, in February, at the konbini, at the register where I used to stand:"],
    ['say', OB, "Well. And who's this, then?"],
    ['say', KD, "I'm {kid}. That's my dad. He's the quiet one."],
    ['n', "For a year and a half {kidS} has called me Handler, because everyone does. I drop an entire basket of onigiri. Mr. Oba rings them up anyway, at the 2009 price."],
    ['bg', 'city_night'], ['music', 'date'],
    ['n', "For my birthday the squad takes me out. One of them has to stay with {kid}. They draw straws. B.I.T. doesn't have hands and wins anyway."],
    ['phone', B, { msgs: ['Minute 6: the child is fine. The child has asked me forty questions. I have answered thirty-nine.', 'Minute 20: the fortieth question was "do you have a note." I do not know. I am checking.', 'Minute 34: the child says I have one. The child says it is a very small beep and it is "nice." I have never been called nice.', 'Minute 52: the child is asleep. I am hovering supportively. Please do not hurry home.'], replies: [{ t: 'Is everything okay?', resp: ['Everything is okay. I counted. Counting is my original function.'] }, { t: 'What was the fortieth answer?', resp: ['I said: yes, apparently I do. Thank you for noticing.'] }] }],
    ['tint', null],
    ['ach', 'dlc_baby'],
    ['jump', 'dlc_p6']
  ];

  S.dlc_spark_squad = [
    ['music', 'mystery'],
    ['n', "When the hound dropped, there was a toddler in the sandbox. {kid} grabbed Tetsu's hand as he ran past. And for one second, standing over the toddler, {kid} went grey. Steel-grey. Glass bounced off {kidP} back."],
    ['n', "Now {kidS}'s holding Rin's hand, and humming, and every shard of broken glass in the sandbox is rising in a slow ring around them, singing the same note."],
    ['bg', 'training'], ['music', 'hq'],
    ['n', "We test it at HQ that night. Rin's idea."],
    ...kcg('cg_dlc_spark_squad'),
    ['say', RI, "Hold my hand. Now hum. — There. That's mine. You're doing mine. Let go. …Gone. Now hold Tetsu's."],
    ['n', "Grey. Then Hikari's hand: a spark the size of a firefly jumps off {kidP} thumb. Then Kaede's, and {kid} is on the other side of the room looking surprised."],
    ['say', RI, "The wristband said NO YIELD. They tested {kidO} alone. In a room. With a lamp. Of course it read zero. {KidS}'s never had one alone. {KidS} only has one *with* somebody.", 'delighted'],
    ['cgoff'],
    ['say', KD, "So I don't have my own."],
    ['choice', [
      { t: '"You have everyone\'s. Nine of them. That\'s more than anybody."', then: [['say', KD, "Ten. B.I.T. has a note."], ['fam', 'kind', 1]] },
      { t: '"You have the rarest one there is. It only works when you aren\'t alone."', then: [['say', KD, "…Then I'm never doing it alone."], ['me', "That's the idea."], ['fam', 'brave', 1]] },
      { t: '"Let\'s find out how it works. Write it down. Vol. 1."', then: [['n', "Page one, in crayon: a hand holding a hand. Underneath, with Rin's help on the spelling: *BORROWED.*"], ['fam', 'curious', 1]] }
    ]],
    ['say', KD, "Dad. When I hold your hand, it's quiet. It's the only one that's quiet."],
    ['me', "Is that bad?"],
    ['say', KD, "No. It's where I rest."]
  ];
  S.dlc_more_squad = [
    ['bg', 'apartment'], ['tint', 'evening'], ['music', 'daily'],
    ['say', KD, "The bottom bunk's still empty."],
    ['n', "That same week, Shiori calls. Aegis Rescue has pulled a two-year-old out of a flooded house in Edogawa. No relatives they can find. The child won't let go of an orange sleeve."],
    ['show', SH, 'serious', 'default', 'c'],
    ['say', SH, "Procedurally, I'm supposed to call the ward office. I called you first. I'm aware that isn't procedure. Natsuki-san says procedure can wait ten minutes."],
    ['choice', [
      { t: '"Bring the form. All nine copies."', then: [['set', 'more', 1], ['say', SH, "I have already printed them. That was a joke. It was also true.", 'smile']] },
      { t: '"I can\'t do right by two. Find them somebody who can."', then: [['say', SH, "Understood. I'll find somebody good. I know what good looks like now.", 'tender'], ['n', "She does. A couple in Nerima, a baker and a bus driver. {kid} sends the bottom bunk's spare blanket. It gets a thank-you card in crayon."]] }
    ]],
    ['hide', SH], ['tint', null]
  ];
  S.dlc_kid2_sq = [
    ['bg', 'hq_lobby'], ['music', 'romance'],
    ['title', 'FOUR MONTHS LATER', 'Family Court, Room 4, again'],
    ['n', "Same judge. Same glasses on a chain. She looks at the gallery, which is full again, and says, \"I see we're all here,\" and reaches for her pen before anybody stands up."],
    ['choice', [
      { t: 'The file says: a girl.', then: [['set', 'kid2g', 'girl']] },
      { t: 'The file says: a boy.', then: [['set', 'kid2g', 'boy']] }
    ]],
    ['kidname', 'kid2', 'A name for {kid}\'s little {kid2K}'],
    ['n', "{kid2} is two and suspicious of everyone. {kid} walks up, very seriously, and holds out the key ring."],
    ['say', KD, "This is nine keys. I'll show you which is which. The big one's Tetsu. You get the bottom bunk. I'll tell you where things are. Not bossy. Professional."],
    ['n', "{kid2} takes hold of one of {kid}'s fingers and doesn't let go for the rest of the day."],
    ['say', KD, "Dad. {Kid2S}'s checking I'm still here."],
    ['me', "Yeah. You did that too."],
    ['set', 'twokids', 1], ['ach', 'dlc_full'], ['fam', 'home', 2]
  ];
  S.dlc_anniv_squad = [
    ['bg', 'konbini_hq'], ['music', 'romance'], ['tint', 'night'],
    ['n', "Ten years of Squad Zero. We hold it where it should be held: in the stockroom of Mr. Oba's konbini, on cardboard, around the folding table we planned a revolution on."],
    ['show', TE, 'proud', 'cross', 'l'],
    ['say', TE, "I'd like to propose a toast. To the Handler. Ten years. Nobody left behind. Including him. We checked."],
    ['show', A, 'smile', 'cross', 'r'],
    ['say', A, "I brought something. It's the key to the Handler's office. The door that never closed. The key never locked anything. I kept it for eleven years anyway."],
    ['say', A, "You've got nine keys on that ring. This makes ten. It doesn't open anything. I'd just like it to be with the others. Noted?", 'tender'],
    ['choice', [
      { t: '"Noted."', then: [['aff', A, 3]] },
      { read: 'tetsu_polite', t: 'Tetsu has gone very quiet and very polite. Hand him a napkin.', then: [['say', TE, "Thank you. That's very kind. I appreciate it enormously. Excuse me.", 'cry'], ['n', "He isn't angry. It turns out it works for every feeling he has too much of."], ['aff', TE, 3]] }
    ]],
    ['hideall'],
    ['n', "{kid} goes around the table collecting one story from everybody and writing them down. {KidS} gets to me last."],
    ['say', KD, "What's your story, Dad?"],
    ['me', "I was working a register. Somebody came in at three a.m. with an expired coupon."],
    ['say', KD, "That's not a story. That's just what happened."],
    ['me', "Those are the best ones."],
    ['tint', null]
  ];
  S.dlc_wait_squad = [['n', "They arrive in order of speed. Kaede. Rei's shadow, then Rei. Sora, out of the sky. Hikari, at a sprint, trailing sparks. Mira with her bag. Tetsu last, on foot, having run the whole way from Kita."], ['show', TE, 'crysmile', 'default', 'c'], ['say', TE, "Now you know, Handler. What you put us through. Every time you walked into the field with no Spark and a clipboard."], ['hide', TE]];
  S.dlc_fin_squad = [
    ['show', TE, 'laugh', 'cross', 'c'],
    ['say', TE, "I extended your table. It seats fourteen now. I didn't ask. I'm buying dinner to make up for it."],
    ['hide', TE],
    ['if', G => top(G) === 'brave', [['say', KD, "I'm going to be on a squad. I'll borrow from whoever's next to me. So I have to be good at standing next to people."]]],
    ['if', G => top(G) === 'kind', [['say', KD, "I want to find the other ones. The NO YIELD kids. There were forty of us before me. Somebody should go and look."]]],
    ['if', G => top(G) === 'curious', [['say', KD, "I'm going to be a Handler. I can hear everyone's note. I'll always know who's still out there."], ['say', RI, "That's the best use of ears I've ever heard of.", 'delighted']]],
    ...kcg('cg_dlc_fam_squad'),
    ['if', tw, [['n', "*Squad Zero: nine heroes, one drone, one Handler with no Spark, {kid} and {kid2}. Nine signatures. Ten keys. One family.*"]], [['n', "*Squad Zero: nine heroes, one drone, one Handler with no Spark, and {kid}. Nine signatures. Ten keys. One family.*"]]],
    ['cgoff']
  ];
})();

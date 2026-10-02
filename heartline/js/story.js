/* HEARTLINE AGENCY — story scripts & content. Prologue, Chapter 1, first routes, early hang-outs, random events.
   Voice rules live in docs/STORY_BIBLE.md. */
const STORY = (() => {
  const H = 'hikari', R = 'rei', M = 'mira', A = 'aya', B = 'bit';
  const S = {};

  // ======================= PROLOGUE =======================
  S.prologue = [
    ['music', null], ['bg', 'black', 'cut'],
    ['title', 'PROLOGUE', 'The Night Shift'],
    ['bg', 'city_night'], ['fx', 'stars'], ['music', 'night'],
    ['n', 'One in ten thousand people wakes up with a *Spark*. Everyone else gets a letter.'],
    ['t', 'Mine came when I was fourteen. Standard envelope, little cartoon lightning bolt on the front. The bolt is printed whether you pass or fail. I always thought that was a strange design decision.'],
    ['bg', 'konbini'], ['fx', null],
    ['t', '3:12 a.m. Aisle four restocked. Onigiri rotated, oldest to the front. The tiny TV above the register is muted on a hero broadcast, because I can follow a fight better without the commentators.'],
    ['t', 'Under the register there is a notebook. This is volume 37. I write down what the heroes do, and what I would have told them if anybody could hear me. Nobody can. Lately it is also a blog. Four thousand strangers read it, which I do not understand.'],
    ['t', 'Four thousand strangers do not pay rent.'],
    ['sfx', 'rumble'], ['shake', 3], ['wait', 900],
    ['t', '…That was not the refrigerator.'],
    ['sfx', 'glass'], ['shake', 12], ['flash', '#fff'], ['music', 'tension'],
    ['n', 'The front window comes in all at once. Glass rains across the magazine rack and the little basket of lighters.'],
    ['t', 'Outside, something the size of a delivery truck is dragging itself up the street. It is made of glass, and it *sings* — one high, thin note that I can feel in my fillings.'],
    ['t', 'A Rift-beast. Tier-3 at least. The nearest licensed hero is twenty minutes away. I know because I have the response-time map taped inside the notebook.'],
    ['bg', 'street_night', 'flash'], ['fx', 'rain'],
    ['sfx', 'zap'], ['show', H, 'nervous', 'fist', 'c'],
    ['say', H, 'Please stay inside! — No, don\'t stay inside, it\'s coming through the — go to the back. There\'s a stockroom. Go to the stockroom.'],
    ['t', 'A girl in a white cropped jacket, twin tails crackling with static. No license badge on the collar. A trainee, then. Or something worse than a trainee.'],
    ['sfx', 'zap'], ['flash', '#fff6a0'], ['shake', 5],
    ['say', H, 'Lightning Lance!', 'determined', 'fist'],
    ['n', 'The bolt hits the creature dead center and *bends*. It runs along the glass like water down a window and scatters into the sky.'],
    ['say', H, 'That… slid off. Why did it slide off? It never slid off in the simulator.', 'stunned', 'default'],
    ['sfx', 'roar'], ['shake', 8],
    ['say', H, 'Okay. Okay okay okay. One. Two. Three. Plan B. What is plan B. Four, five—', 'scared', 'shy'],
    ['t', 'She is counting out loud. That is what people do when they would like to be somewhere else.'],
    ['t', 'Glass is an insulator. Her current cannot get *into* it. But it rained all evening, a hydrant burst at the corner, and the thing is standing in six inches of standing water.'],
    ['eye', { prompt: 'She is about to throw everything at the monster. What does she need to hear?', time: 9000, opts: [
      { t: '"Don\'t hit it. Hit the water under it."', ok: 1, aff: { hikari: 3 }, set: 'p_smart' },
      { t: '"Hey! Glass-face! Over here!" (Throw something at it.)', aff: { hikari: 2 }, set: 'p_brave', then: [
        ['sfx', 'punch'], ['n', 'I throw a basket of canned coffee at its head. It turns. Very, very slowly.'],
        ['sfx', 'roar'], ['shake', 10], ['say', H, 'Are you out of your mind?!', 'surprised'],
        ['me', 'Maybe. Listen — hit the water, not the monster.'] ] },
      { t: '"Run! You can\'t beat that!"', aff: { hikari: -1 }, timeout: 1, then: [
        ['say', H, 'No. I\'m not — heroes don\'t just *leave*. I\'m suspended, I\'m not a coward.', 'determined', 'fist'],
        ['t', 'She is not going anywhere. Look again.'],
        ['me', 'Then hit the puddle it\'s standing in.'] ] }
    ] }],
    ['say', H, 'The puddle?', 'stunned', 'default'],
    ['say', H, 'Oh. Oh, it\'s a — the whole street is a conductor. Water is *right there*.', 'surprised'],
    ['say', H, 'Who even are you?', 'neutral'],
    ['letterbox', 1], ['speed', 1], ['music', 'action'],
    ['say', H, 'Okay. Okay. *Thunder Goddess Stomp!*', 'determined', 'fist'],
    ['cg', 'cg_strike'], ['sfx', 'thunder'], ['flash', '#fff'], ['shake', 14], ['wait', 1200],
    ['n', 'The current runs down her arm, through the pavement, into the flood. For one white second the whole block has no shadows at all.'],
    ['sfx', 'shatter'], ['fx', 'glass'],
    ['n', 'The creature lights up from the inside like a chandelier. Then it comes apart into a few thousand glittering pieces.'],
    ['cgoff'], ['speed', 0], ['letterbox', 0], ['music', 'daily'],
    ['show', H, 'delighted', 'wave', 'c'],
    ['say', H, 'We did it. Did you see — you saw. You *told* me. That was — I think I just did my first real one.'],
    ['me', 'You also blew out every streetlight on the block.'],
    ['say', H, 'That\'s a future problem. I\'ll feel bad about that tomorrow.', 'sweat', 'hip'],
    ['say', H, 'Also I named that move when I was fifteen and I\'m not allowed to change it. It\'s on a poster.', 'nervous'],
    ['know', H],
    ['say', H, 'I\'m Hikari. Hikari Amane. I\'m a trainee. Technically a *suspended* trainee, which is why I was out here without a license. Please don\'t tell anyone.', 'smile', 'hip'],
    ['say', H, 'What\'s your name?'],
    ['name'],
    ['say', H, '{name}. Okay. I\'ll remember that.', 'happy', 'wave'],
    ['sfx', 'car'], ['wait', 900],
    ['n', 'Headlights through the rain. A long black car stops at the curb and the rear door opens without anyone getting out.'],
    ['move', H, 'l'], ['emo', H, 'scared', 'shy'],
    ['show', A, 'cold', 'cross', 'r'],
    ['say', A, 'Hikari Amane. Unlicensed patrol. That makes three this month.'],
    ['say', H, 'Director Takamine. I can explain. There was a monster, and—', 'nervous', 'shy'],
    ['know', A],
    ['say', A, 'And you destroyed it. Yes. After it destroyed a convenience store.', 'wry'],
    ['say', A, 'I\'m not here for you, Amane.', 'neutral'],
    ['say', A, 'I\'m here for him.', 'smirk', 'point'],
    ['cg', 'cg_recruit'], ['music', 'mystery'],
    ['say', A, 'You read a Tier-3 in eleven seconds. No Spark. No training. I timed it from the camera feed across the street.'],
    ['say', A, 'And you\'re HandlerZero. Our analysts have been reading your notebook for two years. Quietly. Without paying you.'],
    ['me', '…You read the blog.'],
    ['say', A, 'I read everything. That\'s the job. Your breakdown of the Ginza collapse is better than our own report.'],
    ['cgoff'],
    ['say', A, 'HALO needs Handlers. The person in the ear who tells heroes where to stand, and brings them home. We don\'t have enough, and the ones we have don\'t listen.', 'neutral', 'cross'],
    ['say', A, 'I have a squad nobody wants. Two rookies with a great deal of power and no manners. One of them is standing next to you, dripping.'],
    ['say', H, 'I\'m right here.', 'unimpressed', 'fist'],
    ['say', A, 'Nine o\'clock, HALO Tower. Or go back to your onigiri. I\'m not going to ask twice, {name}.', 'neutral'],
    ['choice', [
      { t: '"I\'ll be there at eight-thirty."', aff: { aya: 1 }, then: [['say', A, 'Early is good. Don\'t be early and also wrong.', 'wry']] },
      { t: '"Is the pay better than the night shift?"', aff: { hikari: 1 }, then: [['say', A, 'Three point one times better. The dental is also very good.', 'wry'], ['say', H, 'The dental is *really* good.', 'delighted']] },
      { t: '"Why me? I\'m nobody."', aff: { hikari: 2 }, then: [['say', A, 'You noticed the puddle. Nobody else on that street did, including her. That\'s the answer.', 'neutral'], ['say', H, 'He\'s not nobody. He saved me about forty percent of a fight.', 'determined', 'fist']] }
    ]],
    ['hide', A], ['sfx', 'door'],
    ['n', 'The car door closes. The taillights go red, then blur, then are gone.'],
    ['move', H, 'c'],
    ['say', H, 'So, um. If you take the job — would you be *my* handler? Specifically. Not just the squad\'s.', 'nervous', 'shy'],
    ['say', H, 'You don\'t have to answer. I just wanted to say it before I thought of a reason not to.', 'lost'],
    ['hideall'], ['fx', 'rain'], ['music', 'night'],
    ['t', 'A handler. For heroes.'],
    ['t', 'For the first time in a long while, the notebook in my pocket feels like it weighs something. Not a bad weight.'],
    ['ach', 'prologue'],
    ['jump', 'ch1']
  ];

  // ======================= CHAPTER 1 =======================
  S.ch1 = [
    ['music', null], ['fx', null], ['bg', 'black'],
    ['title', 'CHAPTER 1', 'Squad Zero'], ['autosave'],
    ['bg', 'apartment'], ['music', 'night'], ['sfx', 'alarm'],
    ['t', '7:00 a.m. Three hours of sleep. My hands will not stay still.'],
    ['phone', H, { msgs: ['Good morning! This is Hikari. The Director gave me your number. She said it was okay. It is okay, right?', 'Also the HQ cafeteria has unlimited rice. I want you to know that before you decide anything. It matters to me that you know.', 'See you at nine. Don\'t be late. Not that you would be. You seem like someone who isn\'t.'] }],
    ['t', '…Unlimited rice. The perks of heroism.'],
    ['bg', 'hq_lobby'], ['music', 'hq'], ['fx', 'dust'],
    ['n', 'HALO Tower. Eighty floors of glass and steel, crowned by a ring of light you can see from anywhere in the city.'],
    ['sfx', 'beep'], ['show', B, 'surprised', '', 'c'],
    ['say', B, 'Unregistered civilian detected. Scanning. Scanning.'],
    ['say', B, 'Match found. {name}, Handler candidate, Squad Zero. Welcome to HALO.', 'happy'],
    ['say', B, 'I am B.I.T. I handle schedules, data, and emotional support. I deliver one joke per hour. That was the joke.', 'smug'],
    ['me', '…Does it count if you announce it?'],
    ['say', B, 'Announcing is where most of the comedy is.'],
    ['show', M, 'smile', 'default', 'r'], ['move', B, 'l'],
    ['say', M, 'B.I.T., you\'ve been doing that all morning. He hasn\'t even got a badge yet.'],
    ['know', M],
    ['say', M, 'Mira Solace. Medical officer, and ops support when ops runs out of people. If anyone gets hurt, they come to me.', 'happy'],
    ['say', M, 'If anyone forgets to eat, they *also* come to me. I\'m saying that now so it\'s not a surprise later.', 'wry', 'hip'],
    ['t', 'A warm voice, and a headset on her collar that keeps lighting up with calls she is politely not answering. Her smile reaches her eyes slightly before it reaches her mouth.'],
    ['choice', [
      { t: '"Nice to meet you. I\'ll try not to need your services."', aff: { mira: 1 }, then: [['say', M, 'Everyone says that. Everyone ends up in my med bay eventually. It\'s a very comfortable med bay.', 'smile']] },
      { t: '"Is it normal to be this nervous?"', aff: { mira: 2 }, then: [['say', M, 'Completely. Breathe in with me. Hold. Out.', 'fond', 'shy'], ['say', M, 'There. Your pulse dropped about eight beats. I could hear it, by the way. That\'s a thing I can do.', 'wry', 'hip']] },
      { t: '"You can heal people? That\'s a big Spark."', aff: { mira: 1 }, set: 'mira_cost', then: [['say', M, 'It\'s… useful. It has costs. We don\'t need to go through them on your first day.', 'guarded'], ['emo', M, 'smile']] }
    ]],
    ['say', M, 'The Director\'s waiting. Walk with me.', 'smile', 'wave'],
    ['hideall'],
    ['bg', 'office'], ['fx', null], ['music', 'mystery'],
    ['show', A, 'neutral', 'cross', 'c'],
    ['say', A, 'You came. Good. Sit.'],
    ['say', A, 'Squad Zero. Two members, both gifted, both a problem.', 'wry'],
    ['say', A, 'Hikari Amane, nineteen. Electrokinetic. Enormous output, almost no control. She has destroyed four training rooms.', 'neutral', 'think'],
    ['say', A, 'Rei Kurogane, twenty. Umbrakinetic — she moves through shadows and gives them orders. Flawless technique. Refuses to work with other people.'],
    ['say', A, 'She has been removed from three squads. Her last captain asked to be transferred to Antarctica.', 'cold', 'cross'],
    ['me', '…Did he get it?'],
    ['say', A, 'He sends postcards. He seems very happy.', 'wry'],
    ['say', A, 'In four days the City Safety Board holds Field Certification. Pass, and Squad Zero is a real squad. Fail, and it\'s dissolved. Amane loses her trainee status. Kurogane goes somewhere far from here.'],
    ['say', A, 'You have three days. Train them. Send them on small jobs. Make them a team.', 'resolve', 'point'],
    ['say', A, 'The manual says Handlers who get attached make bad decisions. That\'s true. It\'s also true that you will get attached. The only question is whether you admit it before something goes wrong.', 'tired', 'cross'],
    ['t', 'She takes her glasses off, cleans them on her sleeve, and puts them back on without looking at me.'],
    ['say', A, 'That\'s all. Training floor.'],
    ['hideall'],
    ['bg', 'training'], ['music', 'daily'],
    ['show', H, 'happy', 'wave', 'l'],
    ['say', H, 'You came. You actually came. Okay — hi. Welcome to Squad Zero. Current population: me, and—', 'delighted', 'hip'],
    ['music', 'mystery'], ['sfx', 'shadow'], ['fx', 'shadow'],
    ['cg', 'cg_shadow'], ['wait', 600],
    ['say', R, '…And me.'],
    ['n', 'A voice, quite close to my ear. The shadow under my own feet *shifts*, and a girl steps out of it as if it were a doorway.'],
    ['say', R, 'The clerk. The Director\'s newest experiment.'],
    ['know', R],
    ['say', R, 'Rei Kurogane. I don\'t need a handler or a squad. And I especially don\'t need—'],
    ['cgoff'], ['fx', null],
    ['show', R, 'cold', 'cross', 'r'],
    ['say', H, 'I\'m standing right here, Rei.', 'unimpressed', 'fist'],
    ['say', R, 'Yes. I was getting to that.', 'wry'],
    ['say', H, '{name}, tell her we\'re a team. Tell her.', 'sulk', 'fist'],
    ['choice', [
      { t: '"Rei, you move like a pro. I want to see what you can really do."', aff: { rei: 3, hikari: -1 }, then: [['say', R, 'Flattery. Predictable.', 'cold'], ['say', R, '…Accurate, though.', 'smile'], ['say', H, 'Wow. Okay.', 'hurt', 'fist']] },
      { t: '"Hikari took down a Tier-3 last night. Give her some credit."', aff: { hikari: 3, rei: -1 }, then: [['say', H, 'See? Yes. Thank you.', 'happy', 'fist'], ['say', R, 'With a civilian telling her where to aim. Very impressive.', 'cold']] },
      { t: '"You\'re both stuck with me for three days. Let\'s make them count."', aff: { hikari: 1, rei: 1 }, set: 'diplomat', then: [['say', R, '…Three days, then.', 'neutral'], ['say', H, 'Three days. We can do three days.', 'resolve', 'fist']] }
    ]],
    ['music', 'hq'], ['sfx', 'beep'], ['show', B, 'happy', '', 'c'],
    ['say', B, 'Orientation. I will keep this short, because I have been told I do not.'],
    ['bg', 'ops'],
    ['say', B, 'Every morning you run a Dispatch Shift, nine to five. Calls arrive from across Neo-Tokyo in real time.', 'neutral'],
    ['say', B, 'Each call needs certain stats: Combat, Vigor, Mobility, Charisma, Intellect. Send heroes whose numbers cover the shape of the job.'],
    ['say', B, 'Heroes travel, work, return, and rest. If nobody answers in time, the call is missed. People remember that.', 'sad'],
    ['say', B, 'Evenings are for everything else: Hang Out, Train, Rest, the shop, and spending skill points in the Dossier.', 'smug'],
    ['say', B, 'First shift starts now. I\'ll be on the line. I\'m not going to hold your hand. I don\'t have hands.', 'happy'],
    ['hideall'],
    ['chapter', 1, 'Chapter 1 · Squad Zero', 'Field Certification', 4],
    ['daycard'],
    ['shift', { title: 'Day 1 · Tutorial Shift', calls: 5, tiers: [1, 1], diff: .9, real: 240, tutorial: true }],
    ['call', 'ch1_after1'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch1_day2'],
    ['shift', { title: 'Day 2 · Rift Watch', calls: 7, tiers: [1, 2], diff: 1, special: [{ at: 200, t: 'Rift Spores — Harbor Vents', d: 'Glowing spores leaking from a harbor vent. Someone needs to seal it carefully.', r: '2 2 2 0 5', n: 2, tier: 2, dist: 'harbor', flag: 'c1_spores', ev: 'spores' }] }],
    ['call', 'ch1_after2'],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['call', 'ch1_day3'],
    ['shift', { title: 'Day 3 · Final Prep', calls: 8, tiers: [1, 2], diff: 1.05 }],
    ['hub'], ['night'], ['nextday'], ['daycard'],
    ['jump', 'ch1_climax']
  ];

  S.ch1_day2 = [
    ['bg', 'ops'], ['music', 'mystery'], ['fx', null], ['tint', null],
    ['show', M, 'think', 'think', 'r'],
    ['say', M, 'Morning. Sorry to drag you in early. Look at this.'],
    ['n', 'On the main screen a map of Neo-Tokyo, with red dots. Most of them cluster around the harbor.'],
    ['say', M, 'Rift readings. Small ones, but three times the usual rate, all within a few blocks of each other.', 'tired', 'default'],
    ['me', 'Rifts don\'t cluster. Not naturally.'],
    ['say', M, 'That\'s what I said. The Director said "noted." She says "noted" when she\'s worried, so now I\'m worried too.', 'wry'],
    ['show', H, 'delighted', 'wave', 'l'],
    ['say', H, 'Seven. There are seven dots in the harbor and two in Akiba. That\'s a lot, isn\'t it. I count things. It\'s kind of a problem.', 'nervous'],
    ['tell', H, 'count', 'Counts things out loud when she is frightened or thinking. Gets faster the worse it is.'],
    ['say', M, 'It\'s the first useful thing anyone\'s said all morning. Thank you, Hikari.', 'fond'],
    ['say', M, 'Be careful today, both of you. Please.', 'tender', 'shy'],
    ['hideall']
  ];

  S.ch1_day3 = [
    ['bg', 'training'], ['music', 'tension'], ['tint', null],
    ['sfx', 'zap'], ['shake', 6], ['show', H, 'angry', 'fist', 'l'], ['show', R, 'angry', 'cross', 'r'],
    ['say', H, 'You stepped right into my line of fire!'],
    ['say', R, 'You fired in a straight line at a target that was obviously going to move. Again.'],
    ['say', H, 'I was covering you!', 'sulk'],
    ['say', R, 'I didn\'t ask to be covered.', 'cold'],
    ['t', 'Morning drills. Five minutes in and they have scorched the ceiling and cracked the floor.'],
    ['t', 'Tomorrow is Certification. If they fight like this out there, it will not matter how good the dispatching is.'],
    ['choice', [
      { t: 'Step between them. "Enough. Hikari, call your shots. Rei, say where you\'re going."', aff: { hikari: 1, rei: 1 }, set: 'team_talk', then: [
        ['say', R, '…Say it out loud. Like a child.', 'cold'],
        ['me', 'Like a partner.'],
        ['say', R, '……Fine. Left flank. Next time.', 'tight', 'cross'],
        ['say', H, 'Then I\'ll aim right. Right? Right. I\'ll aim right.', 'resolve', 'fist'],
        ['do', G => { G.heroes.hikari.st.cha++; G.heroes.rei.st.cha++; }],
        ['n', '*Hikari and Rei: Charisma +1.*'] ] },
      { t: '"Hikari, Rei has a point. Watch how she moves."', aff: { rei: 2, hikari: -1 }, then: [
        ['say', H, '…Fine. I\'ll watch her stupid cool movement.', 'sulk', 'cross'],
        ['say', R, '…Thank you.', 'stunned', 'default'], ['t', 'Rei looks genuinely startled that someone agreed with her.'],
        ['do', G => { G.heroes.hikari.st.int++; }], ['n', '*Hikari Intellect +1.*'] ] },
      { t: '"Rei, she was trying to protect you. That counts for something."', aff: { hikari: 2, rei: -1 }, then: [
        ['say', R, '…Protect me.', 'stunned', 'default'], ['say', R, 'Nobody has tried that in a long time.', 'sad'],
        ['say', H, 'Well. Get used to it.', 'blush', 'shy'],
        ['t', 'Rei\'s hand has found the end of her scarf. She is rubbing it between two fingers without noticing.'],
        ['tell', R, 'scarf', 'Touches the end of her scarf right before she says something true.'],
        ['do', G => { G.heroes.rei.st.cha++; }], ['n', '*Rei Charisma +1.*'] ] }
    ]],
    ['hideall']
  ];

  // ======================= CLIMAX =======================
  S.ch1_climax = [
    ['autosave'], ['bg', 'ops'], ['music', 'tension'], ['tint', null], ['fx', null],
    ['n', 'Day 4. Certification Day. 08:57.'], ['sfx', 'alarm'], ['shake', 3],
    ['show', M, 'scared', 'default', 'r'],
    ['say', M, 'Certification is cancelled. We have a live Rift opening at Harbor District.'],
    ['show', A, 'resolve', 'cross', 'l'],
    ['say', A, 'Tier-4. Every senior squad in the city has been called to something else in the last ten minutes. All of them. The closest unit is—'],
    ['say', A, 'Squad Zero.', 'cold'],
    ['say', A, 'Congratulations, {name}. This is your Certification.', 'resolve', 'point'],
    ['say', M, 'I\'ll run support. You\'ll hear me on comms. …Bring them home, okay?', 'tender', 'shy'],
    ['hideall'],
    ['bg', 'harbor'], ['fx', 'embers'], ['music', 'action'], ['letterbox', 1],
    ['sfx', 'roar'], ['cg', 'cg_leviathan'], ['shake', 12], ['wait', 1400],
    ['n', 'It comes out of the bay like a cathedral built from knives: a glass serpent a hundred meters long, its core pulsing red.'],
    ['cgoff'], ['letterbox', 0],
    ['show', H, 'scared', 'shy', 'l'], ['show', R, 'determined', 'cross', 'r'],
    ['say', H, 'That\'s bigger than the one at the store. That\'s — one, two, three — that\'s a *lot* bigger than the store.'],
    ['say', R, 'You\'re counting again.', 'guarded'],
    ['say', H, 'It helps. Your hands are shaking too.', 'sulk', 'fist'],
    ['say', R, '……', 'sad', 'default'],
    ['t', 'They are both terrified, and they are both looking at me.'],
    ['eye', { prompt: 'Its shards re-form faster than they break. Opening move?', time: 10000, opts: [
      { t: '"Rei — bind it with shadows. Use the pier floodlights to make them darker."', ok: 1, set: 't1', aff: { rei: 2 } },
      { t: '"Hikari, hit it with everything. Now."', aff: { hikari: 1 } },
      { t: '"Both of you fall back. Wait for backup."', timeout: 1 }
    ] }],
    ['if', G => G.flags.t1, [
      ['say', R, 'More light, so the shadows are deeper. That is not stupid.', 'wry', 'point'],
      ['sfx', 'shadow'], ['fx', 'shadow'], ['shake', 6],
      ['n', 'Shadows peel off every crane and container, whipping across the water to coil around the serpent\'s body.']
    ], [
      ['say', H, 'Okay. Here goes.', 'resolve', 'fist'], ['sfx', 'zap'], ['flash', '#fff'],
      ['n', 'The blast glances off, just like last time. The serpent lashes back and the pier buckles under all of us.'], ['shake', 10], ['sfx', 'boom'],
      ['say', R, 'It\'s glass. Light bends through it, but it still casts a shadow. *Think*, Handler.', 'angry'],
      ['t', 'Shadows need light. The pier has floodlights.'],
      ['say', R, 'I\'ll hold it. Try not to make me regret that.', 'determined', 'point'], ['sfx', 'shadow'], ['fx', 'shadow']
    ]],
    ['say', R, 'It\'s too strong. I can\'t hold it long.', 'scared', 'point'],
    ['t', 'She isn\'t moving at all. Not her shoulders, not her hands. Her whole body has gone very still.'],
    ['tell', R, 'still', 'Goes completely still when she is afraid.'],
    ['say', M, '(comms) Rei\'s vitals are spiking. The core is exposed. You have a few seconds.', 'scared'],
    ['eye', { prompt: 'The red core is exposed. Who finishes it, and how?', time: 9000, opts: [
      { t: '"Hikari — the whole bay is salt water. Charge the harbor."', ok: 1, set: 't2', aff: { hikari: 2 } },
      { t: '"Rei, crush the core with your shadows."', aff: { rei: 1 } },
      { t: '"Mira — get them out of there."', aff: { mira: 1 }, timeout: 1 }
    ] }],
    ['if', G => G.flags.t2, [
      ['say', H, 'Salt water conducts even better than rain. I\'ve got it.', 'determined', 'fist']
    ], [
      ['say', R, 'I can\'t—', 'cry', 'default'],
      ['say', H, 'Then I will. The water, right? Same as the puddle.', 'resolve', 'fist'],
      ['t', 'She remembered the puddle. She actually did.']
    ]],
    ['say', H, 'Rei. One more second. One. Two—', 'determined', 'fist'],
    ['say', R, 'Don\'t miss, Hikari.', 'wry', 'point'],
    ['letterbox', 1], ['speed', 1],
    ['cg', 'cg_combo'], ['sfx', 'thunder'], ['flash', '#fff'], ['shake', 16], ['wait', 1400],
    ['n', 'Shadow and lightning, together. The bay turns into a sheet of white fire.'],
    ['sfx', 'shatter'], ['fx', 'glass'],
    ['n', 'The serpent sings one last note, high enough to hurt, and comes apart into a trillion bright pieces that fall like snow.'],
    ['cgoff'], ['speed', 0], ['letterbox', 0], ['music', 'victory'],
    ['do', G => {
      const sh = G.shifts.slice(-3), ok = sh.reduce((s, x) => s + x.ok, 0) / Math.max(1, sh.reduce((s, x) => s + x.total, 0));
      G.score = Math.round(ok * 50 + (G.flags.t1 ? 15 : 0) + (G.flags.t2 ? 15 : 0) + (G.flags.team_talk ? 5 : 0) + (G.flags.c1_spores > 0 ? 5 : 0) + Math.min(G.rep, 40) / 4);
      G.flags.hr_bond = 1;
    }],
    ['show', H, 'crysmile', 'default', 'l'], ['show', R, 'sad', 'default', 'r'],
    ['say', H, 'We did it. We actually — Rei, you called me Hikari.', 'delighted', 'wave'],
    ['say', R, 'I did not.', 'blush', 'cross'],
    ['say', H, 'You did. Before the last one. You said, "Don\'t miss, Hikari."', 'wry', 'hip'],
    ['say', R, '…Once. It won\'t happen again.', 'shy', 'cross'],
    ['bg', 'office'], ['fx', null], ['hideall'], ['music', 'hq'],
    ['show', A, 'neutral', 'cross', 'c'],
    ['if', G => G.score >= 75, [
      ['say', A, 'Zero civilian casualties. Minimal property damage. A Tier-4 neutralized by two rookies and a night clerk.'],
      ['say', A, 'Squad Zero is certified, effective immediately.', 'smile'],
      ['say', A, '…Good work, Handler.', 'fond'],
      ['ach', 'cert_s']
    ], [
      ['say', A, 'Messy. Expensive. The harbor authority is sending me an invoice the thickness of a phone book.', 'cold'],
      ['say', A, '…And effective. Squad Zero is provisionally certified.', 'smile'],
      ['say', A, 'Train harder, {name}. Next time I want it clean.', 'neutral', 'point']
    ]],
    ['ach', 'cert'],
    ['do', (G, api) => { if (G.eyes && G.eyes === G.eyesOk) api.unlock('eye'); }],
    ['say', A, 'One more thing. That Rift was not natural. Someone opened it, and pulled every senior squad away first.', 'cold', 'cross'],
    ['say', A, 'Get some rest tonight. You earned it.', 'tired'],
    ['hideall'],
    ['route']
  ];

  // ======================= FIRST ROUTES (rooftop) =======================
  S.end_hikari = [
    ['bg', 'rooftop'], ['tint', null], ['fx', 'petals'], ['music', 'romance'],
    ['n', 'Sunset. HALO Tower rooftop. The city below has gone the color of toast.'],
    ['show', H, 'smile', 'shy', 'c'],
    ['say', H, 'I figured you\'d be up here. You get a certain look near high places. Like you\'re reading the city.'],
    ['say', H, 'Can I tell you something embarrassing?', 'nervous'],
    ['say', H, 'When that thing came out of the water, I wanted to run. I was going to. I had a whole route planned.', 'sad'],
    ['say', H, 'And then your voice was in my ear. It was so *flat*. Not cold. Just — like you weren\'t even considering that I might not do it.', 'tender'],
    ['cg', 'cg_roof_hikari'], ['sfx', 'heart'],
    ['say', H, 'So I did it. Because you thought I could.'],
    ['choice', [
      { t: '"You did all of it yourself. I just pointed."', aff: { hikari: 2 }, then: [['say', H, 'You pointed at exactly the right place. Twice. That is not nothing.']] },
      { t: '"I\'ll keep believing that, as long as you\'ll let me."', aff: { hikari: 4 }, then: [['say', H, 'You can\'t just say that with a straight face. How are you doing that?'], ['say', H, '…Okay. Accepted. No take-backs.']] }
    ]],
    ['cgoff'], ['emo', H, 'blush', 'shy'],
    ['say', H, 'There\'s a ramen place downtown. Raijin. They do a thing with the broth that — you should try it. We should try it. Sometime.'],
    ['say', H, 'Just us. As, um. Colleagues. Who get ramen.', 'nervous'],
    ['say', H, 'Colleagues who get ramen alone, at night. That\'s a normal thing colleagues do.', 'lost', 'wave'],
    ['ach', 'route_hikari'], ['jump', 'ch1_end']
  ];
  S.end_rei = [
    ['bg', 'rooftop'], ['tint', 'night'], ['fx', 'stars'], ['music', 'romance'],
    ['n', 'Twilight. HALO Tower rooftop. The sun is gone and the shadows have taken the whole floor.'],
    ['sfx', 'shadow'], ['show', R, 'neutral', 'cross', 'c'],
    ['say', R, 'You found my spot. Of course you did. You notice things.'],
    ['say', R, 'Today, holding that thing, I felt the shadows start to slip. The way they slipped three years ago.', 'sad', 'default'],
    ['say', R, 'Three years ago I lost control in a training exercise. My partner spent two months in the med bay. That\'s why I work alone.', 'sad'],
    ['say', R, 'Today you said "hold it." In that voice. As if it were a fact. And I held it.', 'tender', 'shy'],
    ['cg', 'cg_roof_rei'], ['sfx', 'heart'],
    ['say', R, 'Nobody has trusted me with anything in a very long time.'],
    ['t', 'She is touching the end of her scarf.'],
    ['tell', R, 'scarf', 'Touches the end of her scarf right before she says something true.'],
    ['choice', [
      { t: '"Then get used to it. I\'m not going anywhere."', aff: { rei: 4 }, then: [['say', R, '……'], ['say', R, 'That is a dangerous thing to promise someone made of shadows.'], ['say', R, '…I\'m holding you to it.']] },
      { t: '"You earned it. Every second."', aff: { rei: 2 }, then: [['say', R, '…Perhaps I did.']] }
    ]],
    ['cgoff'], ['emo', R, 'blush', 'shy'],
    ['say', R, 'There\'s a cat that lives in the alley behind the tower. She doesn\'t like anyone.'],
    ['say', R, '…She might not dislike you. If you came with me tomorrow night. To find out.', 'embarrassed'],
    ['say', R, 'Don\'t read anything into that.', 'tight', 'cross'],
    ['t', 'I\'m reading a great deal into that.'],
    ['ach', 'route_rei'], ['jump', 'ch1_end']
  ];
  S.end_mira = [
    ['bg', 'rooftop'], ['tint', null], ['fx', 'hearts'], ['music', 'romance'],
    ['n', 'Sunset. HALO Tower rooftop. Someone has left two cups of tea on the ledge, one of them already half drunk.'],
    ['show', M, 'smile', 'default', 'c'],
    ['say', M, 'There you are. Doctor\'s orders: you\'re drinking that. You skipped lunch. I know, because I checked the cafeteria cameras.'],
    ['say', M, 'Rei has two cracked ribs and a bruised ego. She\'ll live. Hikari needed a sandwich. They\'re both fine.', 'happy'],
    ['say', M, 'You, though. Your heart was running at a hundred and sixty during that fight. I could hear it on the line.', 'tired'],
    ['say', M, 'I can fix everybody else\'s damage. I\'m very good at it. I have never once known what to do about the damage nobody shows me.', 'guarded', 'shy'],
    ['cg', 'cg_roof_mira'], ['sfx', 'heal'],
    ['say', M, 'So here\'s my request. When it hurts — and it will — tell me. Even if it\'s not the kind of hurt I can fix.'],
    ['choice', [
      { t: '"Only if you do the same."', aff: { mira: 4 }, then: [['say', M, '…That\'s not fair. You can\'t turn doctor\'s orders around on the doctor.'], ['say', M, '……Fine. Yes. I\'ll try.']] },
      { t: '"I will. Thank you, Mira."', aff: { mira: 2 }, then: [['say', M, 'Good. I\'ll be checking.']] }
    ]],
    ['cgoff'], ['emo', M, 'blush', 'shy'],
    ['say', M, 'Café Lumière does a strawberry mille-feuille I would commit crimes for.'],
    ['say', M, 'Saturday, two o\'clock. For your mental health. Strictly medical.', 'wry', 'hip'],
    ['say', M, '…It\'s a date. Medically.', 'fond', 'shy'],
    ['ach', 'route_mira'], ['jump', 'ch1_end']
  ];

  S.ch1_end = [
    ['hideall'], ['bg', 'black'], ['fx', null], ['tint', null], ['music', 'mystery'], ['wait', 800],
    ['cg', 'cg_glazier'], ['fx', 'glass'],
    ['n', 'Far across the city, on the top floor of an empty glass tower, someone watches the harbor sparkle.'],
    ['n', '"A Handler with no Spark. How interesting."'],
    ['n', '"Let\'s see how long his heroes last when the whole city has turned to glass."'],
    ['cgoff'], ['sfx', 'shatter'], ['flash', '#9ff'],
    ['ach', 'ch1'],
    ['recap'], ['jump', 'ch2']
  ];

  // ======================= HANG OUTS =======================
  S.hang_hikari_1 = [
    ['bg', 'ramen'], ['music', 'daily'], ['fx', null], ['tint', null],
    ['show', H, 'happy', 'wave', 'c'],
    ['say', H, 'This is Raijin. They give heroes a discount, which is lovely, and I feel sort of strange about it, so I always leave a big tip.'],
    ['n', 'Ten minutes later there are five empty bowls in front of Hikari.'],
    ['say', H, 'Sorry. Lightning burns a lot of calories. I looked it up. It\'s about as much as a marathon runner.', 'smile', 'hip'],
    ['choice', [
      { t: '"That\'s honestly impressive."', aff: { hikari: 3 }, then: [['say', H, 'Thank you. Nobody ever says that. They just say "oh my god, Hikari."', 'delighted', 'fist']] },
      { t: '"How are you alive?"', aff: { hikari: 1 }, then: [['say', H, 'High metabolism. And I don\'t sleep enough, which burns more.', 'wry']] },
      { t: 'Quietly push your bowl across the table.', aff: { hikari: 4 }, then: [['say', H, 'You\'re giving me your — no. I can\'t take your — I\'m taking it. Thank you.', 'delighted', 'shy']] }
    ]],
    ['say', H, 'Thanks for coming. Most people at HQ think I\'m a walking fire hazard.', 'smile', 'shy'],
    ['me', 'You are a walking fire hazard.'],
    ['say', H, 'That was rude!', 'sulk', 'fist'], ['say', H, '…Honestly it\'s kind of a relief when someone just says it.', 'happy']
  ];
  S.hang_hikari_2 = [
    ['bg', 'arcade'], ['music', 'action'], ['fx', 'sparks'], ['tint', null],
    ['show', H, 'determined', 'fist', 'c'],
    ['say', H, 'Best of three. Loser buys crepes. I will not lose to someone who works nights in a konbini.'],
    ['sfx', 'zap'], ['n', 'The machine flickers. Every time Hikari gets excited, the high-score board glitches.'],
    ['choice', [
      { t: 'Let her win (subtly).', aff: { hikari: 2 }, then: [['say', H, 'Yes! — wait. Did you let me win?', 'delighted', 'fist'], ['say', H, '…You did. That\'s annoying. And a bit nice, but mostly annoying.', 'sulk', 'shy']] },
      { t: 'Go all out and win.', aff: { hikari: 3 }, then: [['say', H, 'No. Again. Rematch. I want a rematch.', 'angry', 'fist'], ['say', H, '…That was actually fun. Most people hold back with me.', 'happy']] }
    ]],
    ['say', H, 'I used to come here by myself every day after the Agency turned me down the first time.', 'sad', 'default'],
    ['say', H, 'It\'s nice to have a player two.', 'tender', 'shy'],
    ['do', G => { G.heroes.hikari.st.cha++; }], ['n', '*Hikari Charisma +1.*']
  ];
  S.hang_hikari_3 = [
    ['bg', 'park'], ['music', 'romance'], ['fx', 'petals'], ['tint', null],
    ['show', H, 'smile', 'default', 'c'],
    ['say', H, 'My mother was a rescue worker. No Spark. Just a hard hat and very stubborn arms.'],
    ['say', H, 'When the Shibuya Rift opened eight years ago she went in eleven times. She carried out thirty-two people.', 'tender'],
    ['say', H, 'She didn\'t come out the twelfth time.', 'sad'],
    ['say', H, 'My Spark came three months later. Lightning. It felt like the universe saying "you\'re a bit late."', 'hurt'],
    ['choice', [
      { t: '"It isn\'t late. You\'re carrying people out now."', aff: { hikari: 4 }, then: [['say', H, '…Yeah. I am. With my stubborn arms.', 'tender', 'fist']] },
      { t: 'Say nothing. Just sit with her.', aff: { hikari: 3 }, then: [['n', 'We watch the petals come down for a long time. Eventually she leans her head on my shoulder.'], ['say', H, '…Thanks for not saying something wise.', 'tender', 'shy']] }
    ]],
    ['say', H, 'You\'re the first person I\'ve told that to. Please don\'t make it weird.', 'blush', 'shy'],
    ['do', G => { G.heroes.hikari.st.int++; G.heroes.hikari.st.vig++; }], ['n', '*Hikari feels steadier. Intellect +1, Vigor +1.*']
  ];
  S.hang_hikari_x = [
    ['bg', 'hq_lobby'], ['music', 'daily'], ['tint', null], ['show', H, 'happy', 'wave', 'c'],
    ['say', H, 'Do you want half of this? It\'s a Voltage MAX. No? More for me, then.'],
    ['n', 'We spend an hour talking about hero trading cards. She has strong opinions about holographic foil.'],
    ['aff', H, 1]
  ];

  S.hang_rei_1 = [
    ['bg', 'rooftop'], ['tint', 'noon'], ['music', 'night'], ['fx', null],
    ['show', R, 'cold', 'cross', 'c'],
    ['say', R, '…Why are you here.'],
    ['me', 'It\'s my break. It\'s a good spot.'],
    ['say', R, 'It is *my* good spot.', 'unimpressed'],
    ['n', 'We sit in silence for ten minutes. It isn\'t uncomfortable, which is surprising.'],
    ['t', 'Once, near the end, she rubs the tail of her scarf between two fingers and almost speaks. Then doesn\'t.'],
    ['tell', R, 'scarf', 'Touches the end of her scarf right before she says something true.'],
    ['choice', [
      { t: 'Keep sitting quietly.', aff: { rei: 3 }, then: [['say', R, '…You aren\'t going to ask about my trauma?', 'stunned', 'default'], ['me', 'No.'], ['say', R, '…Good.', 'smile']] },
      { t: '"Want half my sandwich?"', aff: { rei: 2 }, then: [['say', R, 'I\'m not hungry.', 'cold'], ['n', 'She takes half the sandwich.'], ['say', R, '…It\'s adequate. For a konbini sandwich.', 'tight']] },
      { t: '"Why do you really work alone?"', aff: { rei: -1 }, then: [['say', R, 'Next question. Or better: no questions.', 'angry', 'cross']] }
    ]]
  ];
  S.hang_rei_2 = [
    ['bg', 'alley'], ['tint', null], ['music', 'night'], ['fx', 'dust'],
    ['n', 'Rei ducks into the alley behind the tower with a small paper bag. I give it a minute, then follow.'],
    ['show', R, 'tender', 'shy', 'c'],
    ['say', R, 'Here, Receipt. Tuna. The good kind. Don\'t tell anyone I—'],
    ['say', R, '……', 'stunned', 'default'],
    ['say', R, 'How long have you been standing there.', 'angry', 'cross'],
    ['choice', [
      { t: '"Long enough to hear you call her Receipt."', aff: { rei: 2 }, then: [['say', R, 'She came with a torn paper receipt stuck to her paw. It was very specific. I didn\'t choose it.', 'tight', 'fist'], ['say', R, '…She is a good cat, though.', 'embarrassed']] },
      { t: 'Crouch down and offer the cat your hand.', aff: { rei: 4 }, then: [['n', 'The black cat sniffs my fingers, then pushes her whole head into my palm.'], ['say', R, '…She doesn\'t do that. Not even to me, the first month.', 'stunned'], ['say', R, 'Traitor.', 'halfsmile', 'shy']] }
    ]],
    ['say', R, 'Animals are easier. They don\'t flinch when the shadows move.', 'sad', 'default'],
    ['do', G => { G.heroes.rei.st.vig++; }], ['n', '*Rei Vigor +1.*']
  ];
  S.hang_rei_3 = [
    ['bg', 'medbay'], ['tint', null], ['music', 'sad'], ['fx', null],
    ['show', R, 'sad', 'default', 'c'],
    ['n', 'Rei is alone in the empty med bay, looking at bed number three.'],
    ['say', R, 'Three years ago my partner lay in that bed. His name was Ren Ishida. Because of me.'],
    ['say', R, 'The shadows got loud and I couldn\'t make them stop. They went for everything in reach, and he was in reach.', 'cry'],
    ['say', R, 'He forgave me. That was the worst part. I couldn\'t, so I made sure it could never happen again.', 'sad', 'cross'],
    ['me', 'By not having a partner.'],
    ['say', R, '…By not having anyone.', 'cry'],
    ['choice', [
      { t: '"Your control is the best I\'ve seen. You\'re not that girl anymore."', aff: { rei: 4 }, then: [['say', R, '…You really think so. You. The man with the notebook.', 'tender'], ['say', R, 'Then I\'ll try to think so too. Slowly.', 'halfsmile', 'shy']] },
      { t: '"If it happens again, we\'ll handle it. That\'s what a squad is for."', aff: { rei: 3 }, then: [['say', R, '…A squad.', 'stunned'], ['say', R, 'It sounds strange in your voice. Not bad. Just strange.', 'tender', 'shy']] }
    ]],
    ['do', G => { G.heroes.rei.st.cha += 2; }], ['n', '*Rei opens up. Charisma +2.*']
  ];
  S.hang_rei_x = [
    ['bg', 'training'], ['music', 'night'], ['tint', null], ['show', R, 'cold', 'cross', 'c'],
    ['say', R, 'You\'re staring. Take notes if you must. Stop staring.'],
    ['n', 'I take notes. She pretends not to notice me noticing the small, pleased line at the corner of her mouth.'],
    ['aff', R, 1]
  ];

  S.hang_mira_1 = [
    ['bg', 'medbay'], ['tint', null], ['music', 'romance'], ['fx', null],
    ['show', M, 'smile', 'default', 'c'],
    ['say', M, 'A visitor who isn\'t bleeding. How refreshing. Tea?'],
    ['n', 'Two cups of chamomile. The med bay smells like antiseptic and honey.'],
    ['choice', [
      { t: '"How do you stay so calm with all this going on?"', aff: { mira: 2 }, then: [['say', M, 'Practice. And chocolate in drawer three. Don\'t tell B.I.T.', 'wry', 'hip']] },
      { t: '"You look tired, Mira. Are you okay?"', aff: { mira: 4 }, then: [['say', M, '…', 'stunned'], ['say', M, 'People don\'t really ask me that. I\'m the one who asks.', 'blush', 'shy'], ['say', M, 'I\'m okay. A bit better now.', 'tender']] }
    ]],
    ['t', 'She has straightened the same stack of charts twice while talking. She is not looking at them.'],
    ['tell', M, 'tidy', 'Tidies things when something hurts. The tidier the room, the worse the day.'],
    ['say', M, 'Come back anytime. The kettle is always on.', 'happy', 'wave']
  ];
  S.hang_mira_2 = [
    ['bg', 'cafe'], ['tint', null], ['music', 'daily'], ['fx', null],
    ['show', M, 'delighted', 'shy', 'c'],
    ['say', M, 'The strawberry mille-feuille. Twelve layers. I have thought about this all week.'],
    ['n', 'Mira Solace, composed Medical Officer, is vibrating slightly with joy.'],
    ['choice', [
      { t: '"Want mine too?"', aff: { mira: 4 }, then: [['say', M, 'You would do that? For me?', 'stunned'], ['say', M, 'Marry me. Kidding. Mostly. Ahem.', 'embarrassed']] },
      { t: 'Take a photo of her happy face.', aff: { mira: 2 }, then: [['say', M, 'Delete that. {name}. Delete that immediately.', 'pout', 'fist'], ['say', M, '……Send it to me first, though.', 'shy']] }
    ]],
    ['say', M, 'Thank you. I don\'t get to just be a person very often.', 'tender', 'default'],
    ['do', G => { G.roster.forEach(h => G.heroes[h].fat = Math.max(0, G.heroes[h].fat - 20)); }], ['n', '*Mira\'s good mood spreads. Squad −20 Fatigue.*']
  ];
  S.hang_mira_3 = [
    ['bg', 'rooftop'], ['tint', 'evening'], ['music', 'sad'], ['fx', null],
    ['show', M, 'sad', 'default', 'c'],
    ['say', M, 'Can I tell you how my Spark actually works? The part that isn\'t in my file.'],
    ['say', M, 'When I heal someone I don\'t make the wound vanish. I take it. For a little while. It fades from me eventually.', 'guarded'],
    ['say', M, 'After the Shibuya Rift I healed forty people in one night. I couldn\'t walk for a week.', 'hurt'],
    ['me', 'Does the Director know?'],
    ['say', M, 'She\'s the only one. …And now you.', 'tender', 'shy'],
    ['choice', [
      { t: '"Then I\'ll make sure my heroes come back with as few wounds as possible."', aff: { mira: 4 }, then: [['say', M, '…That is the most romantic thing a Handler has ever said to me. And it\'s about logistics.', 'laugh'], ['say', M, 'I love it.', 'fond', 'shy']] },
      { t: 'Take her hand.', aff: { mira: 3 }, then: [['sfx', 'heal'], ['n', 'Her hand is cold. Slowly, it gets warmer.'], ['say', M, '…You\'re not a healer. That helped anyway.', 'blush', 'shy']] }
    ]]
  ];
  S.hang_mira_x = [
    ['bg', 'medbay'], ['music', 'romance'], ['tint', null], ['show', M, 'smile', 'default', 'c'],
    ['say', M, 'Blood pressure check. Sit. Arm. Now. …Hm. Healthy. Surprisingly.'],
    ['n', 'She keeps her fingers on my wrist a few seconds longer than the measurement needs.'],
    ['aff', M, 1]
  ];

  // ======================= RANDOM EVENTS =======================
  const events = {
    ev_bit: { day: 1, s: [
      ['bg', 'hq_lobby'], ['show', B, 'happy', '', 'c'], ['sfx', 'beep'],
      ['say', B, 'I have composed a motivational song for Squad Zero. The lyrics are "go, go, win." That is the entire chorus.'],
      ['choice', [{ t: '"…That\'s great, B.I.T."', then: [['say', B, 'I knew you would say that. Uploading to the speakers.', 'happy']] }, { t: '"Please never sing again."', then: [['say', B, 'Emotional damage logged. I will file a complaint with myself.', 'sad']] }]],
      ['hide', B]
    ] },
    ev_vending: { day: 1, s: [
      ['bg', 'hq_lobby'], ['show', H, 'sulk', 'point', 'c'],
      ['say', H, 'The vending machine ate my coins. I can fix this. I know exactly how much current it needs.'],
      ['choice', [
        { t: '"Hikari, no."', aff: { hikari: 1 }, then: [['say', H, '…Fine. Being responsible is the worst.', 'sulk', 'cross']] },
        { t: '"…Get me one too."', aff: { hikari: 2 }, then: [['sfx', 'zap'], ['flash', '#fff'], ['sfx', 'coin'], ['n', 'Forty-three drinks fall out. The machine briefly catches fire.'], ['say', H, 'That was not what I expected. That was a lot more than I expected.', 'stunned', 'fist'], ['do', G => { G.credits -= 50; }], ['n', '*The Agency docks ¥50 from your pay for "facility damage".*']] }
      ]]
    ] },
    ev_shadowprank: { day: 2, s: [
      ['bg', 'hq_lobby'], ['sfx', 'shadow'], ['show', R, 'smug', 'cross', 'c'],
      ['say', R, 'You flinched.'], ['me', 'You came out of my shadow. In an elevator.'],
      ['say', R, 'I needed a ride to floor forty. You were going to floor forty.', 'neutral'],
      ['say', R, '…Your heartbeat does something funny when you\'re startled.', 'halfsmile'], ['aff', R, 1]
    ] },
    ev_miracheck: { day: 2, s: [
      ['bg', 'hq_lobby'], ['show', M, 'pout', 'point', 'c'],
      ['say', M, '{name}. When did you last drink water.'],
      ['choice', [{ t: '"…Tuesday?"', aff: { mira: 1 }, then: [['say', M, 'It *is* Tuesday. That\'s not— sit down. Drink this.', 'angry', 'fist']] }, { t: '"Coffee counts, right?"', aff: { mira: 1 }, then: [['say', M, 'Coffee is a diuretic. Coffee is the enemy.', 'angry', 'fist']] }]],
      ['do', G => { G.energy = Math.min(100, G.energy + 15); }], ['n', '*Mira\'s care package restores 15 Energy.*']
    ] },
    ev_fans: { day: 2, s: [
      ['bg', 'city_night'], ['tint', 'noon'], ['show', H, 'surprised', 'default', 'l'], ['show', R, 'cold', 'cross', 'r'],
      ['n', 'A group of kids spots the squad outside HQ.'], ['say', H, 'They want autographs? From us?'],
      ['say', R, 'I don\'t do autographs.', 'cold'], ['n', 'A small girl holds up a drawing of Rei. It\'s quite bad. It has a lot of glitter.'],
      ['say', R, '……Where do I sign.', 'tight', 'shy'],
      ['do', G => { G.rep += 3; G.heroes.rei.st.cha++; }], ['n', '*Reputation +3. Rei Charisma +1.*']
    ] }
  };

  return { scripts: S, events };
})();

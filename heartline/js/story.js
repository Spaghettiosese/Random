/* HEARTLINE AGENCY — story scripts & content. */
const STORY = (() => {
  const H = 'hikari', R = 'rei', M = 'mira', A = 'aya', B = 'bit';
  const S = {};

  // ======================= PROLOGUE =======================
  S.prologue = [
    ['music', null], ['bg', 'black', 'cut'],
    ['title', 'PROLOGUE', 'Spark of a Handler'],
    ['bg', 'city_night'], ['fx', 'stars'], ['music', 'night'],
    ['n', 'In this world, one in ten thousand people wakes up with a *Spark*.'],
    ['n', 'Lightning in their fingertips. Shadows that listen. Wounds that close at a touch.'],
    ['n', 'The lucky ones become heroes — licensed, ranked, and plastered across every billboard in Neo-Tokyo.'],
    ['bg', 'konbini'], ['fx', null],
    ['n', 'The rest of us… work the night shift.'],
    ['t', '3:12 AM. Aisle four restocked. Onigiri rotated. Hero broadcast muted on the tiny TV above the register.'],
    ['t', 'I tested Spark-negative at fourteen. Everyone takes the test. Almost everyone fails it.'],
    ['t', 'But I never stopped watching. Every fight, every rescue, every mistake — I write it all down.'],
    ['n', 'On the counter sits a battered notebook. The cover reads: *HANDLER NOTES — VOL. 37*.'],
    ['t', 'Online, people call me "HandlerZero." Apparently my fight breakdowns are… popular.'],
    ['t', 'Not that popularity pays rent.'],
    ['sfx', 'rumble'], ['shake', 3], ['wait', 900],
    ['t', '…Huh?'],
    ['sfx', 'glass'], ['shake', 12], ['flash', '#fff'], ['music', 'tension'],
    ['n', 'The front window ^EXPLODES^ inward. Glass rains across the magazine rack.'],
    ['t', 'Outside, something enormous drags itself down the street — a body made of ~jagged, singing glass~.'],
    ['t', 'A Rift-beast. Tier-3, maybe. The nearest licensed hero is twenty minutes out.'],
    ['bg', 'street_night', 'flash'], ['fx', 'rain'],
    ['sfx', 'zap'], ['show', H, 'determined', 'fist', 'c'],
    ['say', H, 'Stay back, civilians! I-I got this! Probably!'],
    ['t', 'A girl in a white hero jacket, twin tails crackling with static. No license badge. A trainee?'],
    ['sfx', 'zap'], ['flash', '#fff6a0'], ['shake', 5],
    ['say', H, 'Haaaah! *Lightning Lance!*', 'angry', 'fist'],
    ['n', 'The bolt hits the creature dead-center — and *bends*. It skitters across the glass and scatters harmlessly into the sky.'],
    ['say', H, 'Wha—?! It just… slid off?!', 'surprised', 'default'],
    ['sfx', 'roar'], ['shake', 8],
    ['say', H, 'Okay. Okay okay okay. Plan B. What\'s Plan B…', 'scared', 'shy'],
    ['t', 'Glass is an insulator. Her lightning can\'t get *into* it. But…'],
    ['t', 'It\'s raining. The street is flooded. And that thing is standing right in the middle of it.'],
    ['eye', { prompt: 'Read the fight. What does she need to hear — right now?', time: 9000, opts: [
      { t: '"Don\'t hit the monster — hit the PUDDLE under it!"', ok: 1, aff: { hikari: 3 }, set: 'p_smart' },
      { t: '"Hey, glass-face! Over here!" (Draw its attention)', aff: { hikari: 2 }, set: 'p_brave', then: [
        ['sfx', 'punch'], ['n', 'I hurl a basket of canned coffee at its head. It turns. Very, very slowly.'],
        ['sfx', 'roar'], ['shake', 10], ['say', H, 'Are you CRAZY?!', 'surprised'],
        ['me', 'Probably! Listen — hit the water under it, not the monster!'] ] },
      { t: '"Run! You can\'t win this!"', aff: { hikari: -1 }, timeout: 1, then: [
        ['say', H, 'No way! Heroes don\'t run! Even suspended ones!', 'angry', 'fist'],
        ['t', 'Stupid. She\'s not leaving. Look again. Think.'],
        ['me', 'Fine — then hit the puddle it\'s standing in!'] ] }
    ] }],
    ['say', H, 'The puddle…? Oh. OH! Water conducts!', 'surprised', 'default'],
    ['say', H, 'You\'re a genius, Convenience Store Guy!', 'happy', 'fist'],
    ['letterbox', 1], ['speed', 1], ['music', 'action'],
    ['say', H, 'Full power…! ~THUNDER GODDESS STOMP!!~', 'angry', 'fist'],
    ['cg', 'cg_strike'], ['sfx', 'thunder'], ['flash', '#fff'], ['shake', 14], ['wait', 1200],
    ['n', 'Lightning pours into the flooded street. For one blinding second the whole block turns white.'],
    ['sfx', 'shatter'], ['fx', 'glass'],
    ['n', 'The creature lights up from within like a chandelier — and then *shatters* into a million glittering pieces.'],
    ['cgoff'], ['speed', 0], ['letterbox', 0], ['music', 'daily'],
    ['show', H, 'happy', 'wave', 'c'],
    ['say', H, 'We did it!! Did you see that?! Did you SEE that?!'],
    ['me', 'I saw it. …You also blew out every streetlight on the block.'],
    ['say', H, 'Ehehe… collateral damage is a future-me problem!', 'sweat', 'hip'],
    ['know', H],
    ['say', H, 'I\'m Hikari! Hikari Amane! Trainee hero! Well — technically *suspended* trainee hero…', 'smile', 'hip'],
    ['say', H, 'What\'s your name, Genius?', 'happy', 'default'],
    ['name'],
    ['say', H, '{name}! Got it! I\'m never forgetting that one.', 'happy', 'wave'],
    ['sfx', 'car'], ['wait', 900],
    ['n', 'Headlights cut through the rain. A long black car rolls to a stop, and the rear door opens.'],
    ['move', H, 'l'], ['emo', H, 'scared', 'shy'],
    ['show', A, 'cold', 'cross', 'r'],
    ['say', A, 'Hikari Amane. Unlicensed patrol. Third time this month.'],
    ['say', H, 'D-Director Takamine! I can explain! There was a monster, and I—', 'scared', 'shy'],
    ['know', A],
    ['say', A, 'Destroyed it. Yes. After it destroyed a convenience store.', 'cold'],
    ['say', A, 'But I\'m not here for you, Amane.', 'neutral'],
    ['say', A, 'I\'m here for *him*.', 'smug', 'point'],
    ['cg', 'cg_recruit'], ['music', 'mystery'],
    ['say', A, 'You read a Tier-3 Rift-beast in eleven seconds. No Spark. No training. No hesitation.'],
    ['say', A, '…And you\'re *HandlerZero*. Our analysts have been quietly stealing your notes for two years.'],
    ['me', '…You read my blog?'],
    ['say', A, 'I read everything. That\'s the job.'],
    ['cgoff'],
    ['say', A, 'The HALO Agency needs Handlers — people who train heroes, plan their missions, and bring them home alive.', 'neutral', 'cross'],
    ['say', A, 'I have a squad nobody wants. Two rookies with too much power and not enough sense.', 'cold'],
    ['say', A, 'One of them is standing right there, dripping on your shoes.', 'smug'],
    ['say', H, 'Hey!!', 'pout', 'fist'],
    ['say', A, 'Report to HALO Tower at nine. Or go back to stocking onigiri. Your choice, {name}.', 'neutral'],
    ['choice', [
      { t: '"I\'ll be there at 8:30."', aff: { aya: 1 }, then: [['say', A, 'Early. Good. Don\'t make me regret this.', 'smile']] },
      { t: '"…Does it pay better than the night shift?"', aff: { hikari: 1 }, then: [['say', A, 'Considerably. And the dental plan is excellent.', 'smug'], ['say', H, 'Ooh, the dental plan IS really good!', 'happy', 'wave']] },
      { t: '"Why me? I\'m nobody."', aff: { hikari: 2 }, then: [['say', A, 'Nobody noticed the puddle. You did. That\'s why.', 'neutral'], ['say', H, 'He\'s not nobody! He\'s Genius Convenience Store Guy!', 'angry', 'fist']] }
    ]],
    ['hide', A], ['sfx', 'door'],
    ['n', 'The car door closes. Taillights fade into the rain.'],
    ['move', H, 'c'],
    ['say', H, '{name}… if you join, does that mean you\'d be *my* handler?', 'blush', 'shy'],
    ['say', H, '…Hehe. Then you\'d better not be late, partner!', 'happy', 'wave'],
    ['hideall'], ['fx', 'rain'], ['music', 'night'],
    ['t', 'A handler. For heroes.'],
    ['t', 'For the first time in twelve years, the notebook in my pocket feels heavy — in a good way.'],
    ['ach', 'prologue'],
    ['jump', 'ch1']
  ];

  // ======================= CHAPTER 1 =======================
  S.ch1 = [
    ['music', null], ['fx', null], ['bg', 'black'],
    ['title', 'CHAPTER 1', 'Squad Zero'], ['autosave'],
    ['bg', 'apartment'], ['music', 'night'], ['sfx', 'alarm'],
    ['t', '7:00 AM. I slept three hours. My hands won\'t stop shaking.'],
    ['phone', H, { msgs: ['GOOD MORNING PARTNER!!! ⚡⚡⚡', 'the director gave me ur number. dont be mad', 'ALSO HQ has a cafeteria with UNLIMITED RICE', 'see u at 9!!! dont be late!!!!!!'] }],
    ['t', '…Unlimited rice. The perks of heroism.'],
    ['bg', 'hq_lobby'], ['music', 'hq'], ['fx', 'dust'],
    ['n', 'HALO Tower. Eighty floors of glass and steel, crowned by a ring of light visible from anywhere in the city.'],
    ['sfx', 'beep'], ['show', B, 'surprised', '', 'c'],
    ['say', B, 'BEEP! Unregistered civilian detected! Scanning… scanning…'],
    ['say', B, 'Match found! {name}, Handler-candidate, Squad Zero! Welcome to HALO!', 'happy'],
    ['say', B, 'I am B.I.T.! Brilliant Intelligent Tactical-assistant! I handle schedules, data, and emotional support!', 'happy'],
    ['me', '…Emotional support?'],
    ['say', B, 'Squad Zero requires a LOT of emotional support. …That was a joke. Mostly.', 'smug'],
    ['show', M, 'smile', 'default', 'r'], ['move', B, 'l'],
    ['say', M, 'BIT, stop scaring the new handler on his first day.'],
    ['know', M],
    ['say', M, 'Hello! I\'m Mira Solace — Medical Officer and Operations Support. If anyone gets hurt, they come to me.', 'happy'],
    ['say', M, '…And if anyone forgets to eat lunch, they ALSO come to me. That means you.', 'smug', 'hip'],
    ['t', 'She has a warm voice and a headset that keeps blinking with calls she\'s politely ignoring.'],
    ['choice', [
      { t: '"Nice to meet you, Mira. I\'ll try not to need your services."', aff: { mira: 1 }, then: [['say', M, 'Everyone says that. Everyone ends up in my med bay eventually.', 'smile']] },
      { t: '"Is it normal to be this nervous?"', aff: { mira: 2 }, then: [['say', M, 'Completely normal. Breathe with me. In… and out.', 'tender', 'shy'], ['say', M, 'See? Your heart rate just dropped eight beats. …I can hear those, by the way.', 'smug', 'hip']] },
      { t: '"You can heal people? That\'s an incredible Spark."', aff: { mira: 1 }, set: 'mira_cost', then: [['say', M, 'It\'s… useful. It has its costs. But let\'s not talk shop on your first day.', 'sad'], ['emo', M, 'smile']] }
    ]],
    ['say', M, 'The Director is waiting. Follow me!', 'happy', 'wave'],
    ['hideall'],
    ['bg', 'office'], ['fx', null], ['music', 'mystery'],
    ['show', A, 'neutral', 'cross', 'c'],
    ['say', A, 'You came. Good. Sit.'],
    ['say', A, 'Squad Zero. Two members. Both gifted. Both a disaster.', 'cold'],
    ['say', A, 'Hikari Amane, 19. Electrokinetic. Enormous output, zero control. Has destroyed four training rooms.', 'neutral', 'think'],
    ['say', A, 'Rei Kurogane, 20. Umbrakinetic — she moves through and commands shadows. Flawless technique. Refuses to work with anyone.', 'think'],
    ['say', A, 'She\'s been removed from three squads. Her last captain requested a transfer to Antarctica.', 'cold', 'cross'],
    ['me', '…Did he get it?'],
    ['say', A, 'He\'s very happy there.', 'smug'],
    ['say', A, 'In four days, the City Safety Board holds *Field Certification*.', 'neutral'],
    ['say', A, 'If Squad Zero fails, the squad is dissolved. Amane loses her trainee status. Kurogane goes… somewhere far away.', 'cold'],
    ['say', A, 'You have three days. Train them. Deploy them on small jobs. Make them a *team*.', 'determined', 'point'],
    ['say', A, 'And {name}? Handlers who get attached to their heroes make bad decisions.', 'cold', 'cross'],
    ['say', A, '…Try not to.', 'smile'],
    ['hideall'],
    ['bg', 'training'], ['music', 'daily'],
    ['show', H, 'happy', 'wave', 'l'],
    ['say', H, '{name}!!! You came! You actually came!'],
    ['say', H, 'Welcome to Squad Zero! Population: me! And—', 'smile', 'hip'],
    ['music', 'mystery'], ['sfx', 'shadow'], ['fx', 'shadow'],
    ['cg', 'cg_shadow'], ['wait', 600],
    ['say', R, '…And me.'],
    ['n', 'A voice right behind my ear. The shadow under my own feet ~rippled~ — and a girl stepped out of it.'],
    ['say', R, 'The convenience store clerk. The Director\'s newest experiment.'],
    ['know', R],
    ['say', R, 'Rei Kurogane. I don\'t need a handler. I don\'t need a squad. And I definitely don\'t need *her*.'],
    ['cgoff'], ['fx', null],
    ['show', R, 'cold', 'cross', 'r'],
    ['say', H, 'HEY! I\'m standing right here!', 'angry', 'fist'],
    ['say', R, 'Unfortunately.', 'smug'],
    ['say', H, 'Grrr…! {name}, tell her! Tell her we\'re a team!', 'pout', 'fist'],
    ['choice', [
      { t: '"Rei, you move like a pro. I want to see what you can really do."', aff: { rei: 3, hikari: -1 }, then: [['say', R, '…Flattery. Predictable.', 'cold'], ['say', R, '…But accurate.', 'smug'], ['say', H, 'Traitor!!', 'cry', 'fist']] },
      { t: '"Hikari took down a Tier-3 last night. Give her some credit."', aff: { hikari: 3, rei: -1 }, then: [['say', H, 'Yeah!! What he said!', 'happy', 'fist'], ['say', R, 'With a civilian telling her where to aim. Impressive.', 'cold']] },
      { t: '"You\'re both stuck with me for three days. Let\'s make them count."', aff: { hikari: 1, rei: 1 }, set: 'diplomat', then: [['say', R, '…Hmph. Three days, then.', 'neutral'], ['say', H, 'Three days! We\'re gonna crush it!', 'happy', 'fist']] }
    ]],
    ['music', 'hq'], ['sfx', 'beep'], ['show', B, 'happy', '', 'c'],
    ['say', B, 'BEEP! Tutorial time! Handler {name}, welcome to your new desk!'],
    ['bg', 'ops'],
    ['say', B, 'Every morning you run a *Dispatch Shift* from 09:00 to 17:00. Calls come in from all over Neo-Tokyo in real time.', 'neutral'],
    ['say', B, 'Each call needs certain stats — *Combat, Vigor, Mobility, Charisma, Intellect*. Send heroes whose stats cover the shape!', 'happy'],
    ['say', B, 'Heroes travel, work, return, then *rest*. If nobody answers a call in time… it\'s missed. Civilians get grumpy. Beep.', 'sad'],
    ['say', B, 'Evenings are yours: *Hang Out*, *Train* for XP, *Rest*, shop, and spend *skill points* in the Dossier.', 'smug'],
    ['say', B, 'Your first shift starts now! I\'ll hold your hand. Metaphorically. I don\'t have hands.', 'happy'],
    ['hideall'],
    ['chapter', 1, 'Ch.1 Squad Zero', 'Field Certification', 4],
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
    ['say', M, 'Morning, {name}. Sorry to pull you in early — look at this.'],
    ['n', 'On the main screen, a map of Neo-Tokyo blooms with red dots. Most of them cluster around the harbor.'],
    ['say', M, 'Rift readings. Small ones, but three times the normal rate. All near Harbor District.', 'sad', 'default'],
    ['me', 'Rifts don\'t cluster like that. Not naturally.'],
    ['say', M, '…That\'s exactly what I told the Director. She said "noted." She says "noted" when she\'s worried.', 'surprised'],
    ['show', H, 'happy', 'wave', 'l'],
    ['say', H, 'Good morniiing! What are we looking at? Ooh, red dots! Are those restaurants?'],
    ['say', M, 'They\'re interdimensional tears, Hikari.', 'smile'],
    ['say', H, '…Less fun than restaurants.', 'pout', 'default'],
    ['say', M, 'Just be careful out there today, okay? Both of you.', 'tender', 'shy'],
    ['hideall']
  ];

  S.ch1_day3 = [
    ['bg', 'training'], ['music', 'tension'], ['tint', null],
    ['sfx', 'zap'], ['shake', 6], ['show', H, 'angry', 'fist', 'l'], ['show', R, 'angry', 'cross', 'r'],
    ['say', H, 'You shadow-stepped RIGHT into my line of fire!'],
    ['say', R, 'You fired in a straight line at a target that was clearly going to move. Again.'],
    ['say', H, 'I was ~covering~ you!', 'pout'],
    ['say', R, 'I didn\'t ask to be covered.', 'cold'],
    ['t', 'Morning drills. Five minutes in, and they\'ve already scorched the ceiling and cracked the floor.'],
    ['t', 'Tomorrow is certification. If they fight like this out there…'],
    ['choice', [
      { t: 'Step between them. "Enough. Hikari — call your shots. Rei — tell her where you\'re going."', aff: { hikari: 1, rei: 1 }, set: 'team_talk', then: [
        ['say', R, '…Tell her. Out loud. Like a child.', 'cold'],
        ['me', 'Like a partner.'],
        ['say', R, '……Fine. Left flank. Next time.', 'shy', 'cross'],
        ['say', H, 'Then I\'ll aim right! …Right? Right.', 'happy', 'fist'],
        ['do', G => { G.heroes.hikari.st.cha++; G.heroes.rei.st.cha++; }],
        ['n', '*Hikari and Rei: Charisma +1.*'] ] },
      { t: '"Hikari, Rei has a point. Watch her movement."', aff: { rei: 2, hikari: -1 }, then: [
        ['say', H, '…Fine. Fiiine. I\'ll watch her stupid cool movement.', 'pout', 'cross'],
        ['say', R, '…Thank you.', 'surprised', 'default'], ['t', 'Rei looks genuinely startled that someone agreed with her.'],
        ['do', G => { G.heroes.hikari.st.int++; }], ['n', '*Hikari Intellect +1.*'] ] },
      { t: '"Rei, Hikari was trying to protect you. That counts for something."', aff: { hikari: 2, rei: -1 }, then: [
        ['say', R, '…Protect me.', 'surprised', 'default'], ['say', R, 'Nobody\'s tried that in a long time.', 'sad'],
        ['say', H, 'W-well, get used to it!', 'blush', 'shy'],
        ['do', G => { G.heroes.rei.st.cha++; }], ['n', '*Rei Charisma +1.*'] ] }
    ]],
    ['hideall']
  ];

  // ======================= CLIMAX =======================
  S.ch1_climax = [
    ['autosave'], ['bg', 'ops'], ['music', 'tension'], ['tint', null], ['fx', null],
    ['n', 'Day 4. Certification Day. 08:57 AM.'], ['sfx', 'alarm'], ['shake', 3],
    ['show', M, 'scared', 'default', 'r'],
    ['say', M, '{name}! The certification course is cancelled — we have a live Rift opening at Harbor District!'],
    ['show', A, 'determined', 'cross', 'l'],
    ['say', A, 'Tier-4. Every senior squad is committed across the city. Something is pulling them away. The closest unit is…'],
    ['say', A, '…Squad Zero.', 'cold'],
    ['say', A, 'Congratulations, {name}. *This* is your certification.', 'determined', 'point'],
    ['say', M, 'I\'ll run support from here. You\'ll hear me on comms. …Bring them home, okay?', 'tender', 'shy'],
    ['hideall'],
    ['bg', 'harbor'], ['fx', 'embers'], ['music', 'action'], ['letterbox', 1],
    ['sfx', 'roar'], ['cg', 'cg_leviathan'], ['shake', 12], ['wait', 1400],
    ['n', 'It rises out of the bay like a cathedral made of knives — a glass serpent, a hundred meters long, its core pulsing red.'],
    ['cgoff'], ['letterbox', 0],
    ['show', H, 'scared', 'shy', 'l'], ['show', R, 'determined', 'cross', 'r'],
    ['say', H, 'That\'s… that\'s WAY bigger than the one at the store…'],
    ['say', R, 'Your hands are shaking, Amane.', 'cold'],
    ['say', H, 'S-so are yours!', 'angry', 'fist'],
    ['say', R, '……', 'sad', 'default'],
    ['t', 'They\'re terrified. Both of them. And they\'re both looking at me.'],
    ['eye', { prompt: 'Its shards regenerate faster than they break. Opening move?', time: 10000, opts: [
      { t: '"Rei — bind it with shadows. Use the pier floodlights to make them darker."', ok: 1, set: 't1', aff: { rei: 2 } },
      { t: '"Hikari — hit it with everything, right now!"', aff: { hikari: 1 } },
      { t: '"Both of you, fall back. Wait for backup."', timeout: 1 }
    ] }],
    ['if', G => G.flags.t1, [
      ['say', R, 'More light, darker shadows. …Smart.', 'smug', 'point'],
      ['sfx', 'shadow'], ['fx', 'shadow'], ['shake', 6],
      ['n', 'Shadows peel off every crane and container, whipping across the water to coil around the serpent\'s body.']
    ], [
      ['say', H, 'O-okay! Here goes—!', 'determined', 'fist'], ['sfx', 'zap'], ['flash', '#fff'],
      ['n', 'The blast glances off, just like last time. The serpent lashes back, and the pier buckles.'], ['shake', 10], ['sfx', 'boom'],
      ['say', R, 'Tch. Think, Handler. It\'s glass. Light bends *through* it — but it still casts a shadow.', 'angry'],
      ['t', '…Right. Shadows need light. The pier floodlights.'],
      ['say', R, 'I\'ll hold it. Don\'t make me regret this.', 'determined', 'point'], ['sfx', 'shadow'], ['fx', 'shadow']
    ]],
    ['say', R, 'Nnh… it\'s too strong. I can\'t hold it long…!', 'scared', 'point'],
    ['say', M, '(comms) {name}, Rei\'s vitals are spiking! The core is exposed — you have seconds!', 'scared'],
    ['eye', { prompt: 'The red core is exposed. Who finishes it — and how?', time: 9000, opts: [
      { t: '"Hikari — the whole bay is salt water. Charge the HARBOR!"', ok: 1, set: 't2', aff: { hikari: 2 } },
      { t: '"Rei, crush the core with your shadows!"', aff: { rei: 1 } },
      { t: '"Mira — get them out of there!"', aff: { mira: 1 }, timeout: 1 }
    ] }],
    ['if', G => G.flags.t2, [
      ['say', H, 'Salt water conducts even better than rain! Leave it to me!!', 'happy', 'fist']
    ], [
      ['say', R, 'I… can\'t…!', 'cry', 'default'],
      ['say', H, 'Then I\'ll do it! The water, right?! Just like the puddle!', 'determined', 'fist'],
      ['t', 'She remembered. She actually remembered.']
    ]],
    ['say', H, 'Rei! Hold it ONE more second!', 'determined', 'fist'],
    ['say', R, '…Don\'t miss, *Hikari*.', 'smile', 'point'],
    ['letterbox', 1], ['speed', 1],
    ['cg', 'cg_combo'], ['sfx', 'thunder'], ['flash', '#fff'], ['shake', 16], ['wait', 1400],
    ['n', 'Shadow and lightning, together. The bay turns into a sheet of white fire.'],
    ['sfx', 'shatter'], ['fx', 'glass'],
    ['n', 'The serpent sings one last, impossibly high note — and bursts into a trillion glittering fragments that fall like snow.'],
    ['cgoff'], ['speed', 0], ['letterbox', 0], ['music', 'victory'],
    ['do', G => {
      const sh = G.shifts.slice(-3), ok = sh.reduce((s, x) => s + x.ok, 0) / Math.max(1, sh.reduce((s, x) => s + x.total, 0));
      G.score = Math.round(ok * 50 + (G.flags.t1 ? 15 : 0) + (G.flags.t2 ? 15 : 0) + (G.flags.team_talk ? 5 : 0) + (G.flags.c1_spores > 0 ? 5 : 0) + Math.min(G.rep, 40) / 4);
      G.flags.hr_bond = 1;
    }],
    ['show', H, 'cry', 'default', 'l'], ['show', R, 'sad', 'default', 'r'],
    ['say', H, 'We… we did it… WE DID IT!!', 'happy', 'wave'],
    ['say', H, 'Rei! You called me *Hikari*!', 'love', 'fist'],
    ['say', R, 'I did not.', 'blush', 'cross'],
    ['say', H, 'You totally did!', 'smug', 'hip'],
    ['say', R, '…Once. It won\'t happen again.', 'shy', 'cross'],
    ['bg', 'office'], ['fx', null], ['hideall'], ['music', 'hq'],
    ['show', A, 'neutral', 'cross', 'c'],
    ['if', G => G.score >= 75, [
      ['say', A, 'Zero civilian casualties. Minimal property damage. A Tier-4, neutralized by two rookies.'],
      ['say', A, 'Squad Zero is certified. Effective immediately.', 'smile'],
      ['say', A, '…Good work, Handler.', 'tender'],
      ['ach', 'cert_s']
    ], [
      ['say', A, 'Messy. Expensive. The harbor authority is sending me an invoice the size of a phone book.', 'cold'],
      ['say', A, '…And effective. Squad Zero is provisionally certified.', 'smile'],
      ['say', A, 'Train harder, {name}. Next time, I want it clean.', 'neutral', 'point']
    ]],
    ['ach', 'cert'],
    ['do', (G, api) => { if (G.eyes && G.eyes === G.eyesOk) api.unlock('eye'); }],
    ['say', A, 'One more thing. That Rift was not natural. Someone *opened* it — and pulled every senior squad away first.', 'cold', 'cross'],
    ['say', A, 'Get some rest tonight. You\'ve earned it.', 'smile'],
    ['hideall'],
    ['route']
  ];

  // ======================= ENDINGS (rooftop) =======================
  S.end_hikari = [
    ['bg', 'rooftop'], ['tint', null], ['fx', 'petals'], ['music', 'romance'],
    ['n', 'Sunset. HALO Tower rooftop. The city glows gold below us.'],
    ['show', H, 'smile', 'shy', 'c'],
    ['say', H, 'I knew I\'d find you up here. You like high places. You get this look, like you\'re reading the whole city.'],
    ['say', H, 'Hey, {name}… can I tell you something embarrassing?', 'blush'],
    ['say', H, 'When that thing came out of the water, I wanted to run. Like, really bad.', 'sad'],
    ['say', H, 'But then I heard your voice in my earpiece, and it was so calm. And I thought — if he believes I can do it…', 'tender'],
    ['cg', 'cg_roof_hikari'], ['sfx', 'heart'],
    ['say', H, '…then maybe I really can.'],
    ['choice', [
      { t: '"You did it all yourself, Hikari. I just pointed."', aff: { hikari: 2 }, then: [['say', H, 'Liar. You pointed at exactly the right place. Twice.']] },
      { t: '"I\'ll always believe in you. That\'s a promise."', aff: { hikari: 4 }, then: [['say', H, '…You can\'t just SAY stuff like that with a straight face!!'], ['say', H, '…Promise accepted. No take-backs.']] }
    ]],
    ['cgoff'], ['emo', H, 'love', 'shy'],
    ['say', H, 'Um. So. The cafeteria has unlimited rice, but there\'s this ramen place downtown that\'s WAY better…'],
    ['say', H, 'You should — I mean — we should go. Sometime. Just us. As, um. Partners!', 'shy'],
    ['say', H, '…Partners who get ramen. Alone. At night. Totally normal partner stuff!!', 'happy', 'wave'],
    ['ach', 'route_hikari'], ['jump', 'ch1_end']
  ];
  S.end_rei = [
    ['bg', 'rooftop'], ['tint', 'night'], ['fx', 'stars'], ['music', 'romance'],
    ['n', 'Twilight. HALO Tower rooftop. The sun is gone; the shadows are long.'],
    ['sfx', 'shadow'], ['show', R, 'neutral', 'cross', 'c'],
    ['say', R, 'You found my spot. …Of course you did. You notice things.'],
    ['say', R, 'Today, when I was holding it, I felt the shadows slipping. The same way they slipped three years ago.', 'sad', 'default'],
    ['say', R, 'Three years ago, I lost control, and my partner ended up in the hospital for two months. That\'s why I work alone.', 'sad'],
    ['say', R, 'But today, you said "hold it," like you knew I could. And I… held it.', 'tender', 'shy'],
    ['cg', 'cg_roof_rei'], ['sfx', 'heart'],
    ['say', R, 'Nobody has trusted me with anything in a very long time, {name}.'],
    ['choice', [
      { t: '"Then get used to it. I\'m not going anywhere."', aff: { rei: 4 }, then: [['say', R, '……'], ['say', R, 'That\'s a dangerous thing to promise a girl made of shadows.'], ['say', R, '…I\'m holding you to it.']] },
      { t: '"You earned it. Every second of it."', aff: { rei: 2 }, then: [['say', R, '…Hm. Maybe I did.']] }
    ]],
    ['cgoff'], ['emo', R, 'blush', 'shy'],
    ['say', R, 'There\'s a cat that lives in the alley behind the tower. She doesn\'t like anyone.'],
    ['say', R, '…She might like you. If you came with me tomorrow night. To check.', 'shy'],
    ['say', R, 'Don\'t read into it.', 'pout', 'cross'],
    ['t', 'I\'m absolutely reading into it.'],
    ['ach', 'route_rei'], ['jump', 'ch1_end']
  ];
  S.end_mira = [
    ['bg', 'rooftop'], ['tint', null], ['fx', 'hearts'], ['music', 'romance'],
    ['n', 'Sunset. HALO Tower rooftop. Someone has left two cups of tea on the ledge.'],
    ['show', M, 'smile', 'default', 'c'],
    ['say', M, 'There you are. Doctor\'s orders — you\'re drinking this. You skipped lunch. Again.'],
    ['say', M, 'I patched Rei up. Two cracked ribs and a bruised ego. She\'ll live. Hikari just needed a sandwich.', 'happy'],
    ['say', M, 'But you… your heart rate was 160 the whole fight. I was listening.', 'sad'],
    ['say', M, 'I can heal everyone\'s wounds except the ones they don\'t show me. I can\'t even heal my own.', 'sad', 'shy'],
    ['cg', 'cg_roof_mira'], ['sfx', 'heal'],
    ['say', M, 'So… promise me you\'ll show me. When it hurts. Even if it\'s not the kind of hurt I can fix.'],
    ['choice', [
      { t: '"Only if you promise the same thing."', aff: { mira: 4 }, then: [['say', M, '…That\'s not fair. You can\'t turn doctor\'s orders around on the doctor.'], ['say', M, '……Okay. I promise.']] },
      { t: '"I promise. Thank you, Mira."', aff: { mira: 2 }, then: [['say', M, 'Good. I\'ll be checking.']] }
    ]],
    ['cgoff'], ['emo', M, 'blush', 'shy'],
    ['say', M, 'Café Lumière makes a strawberry mille-feuille that I would commit crimes for.'],
    ['say', M, 'Saturday. Two o\'clock. …For your mental health, of course. Purely medical.', 'smug', 'hip'],
    ['say', M, '…It\'s a date. Medically.', 'love', 'shy'],
    ['ach', 'route_mira'], ['jump', 'ch1_end']
  ];

  S.ch1_end = [
    ['hideall'], ['bg', 'black'], ['fx', null], ['tint', null], ['music', 'mystery'], ['wait', 800],
    ['cg', 'cg_glazier'], ['fx', 'glass'],
    ['n', 'Far across the city, in the top floor of an empty glass tower, someone watches the harbor sparkle.'],
    ['say', null, '…'],
    ['n', '"A Handler with no Spark. How *interesting*."'],
    ['n', '"Let\'s see how long his little heroes last… when the whole city turns to glass."'],
    ['cgoff'], ['sfx', 'shatter'], ['flash', '#9ff'],
    ['ach', 'ch1'],
    ['recap'], ['jump', 'ch2']
  ];

  // ======================= HANG OUTS =======================
  S.hang_hikari_1 = [
    ['bg', 'ramen'], ['music', 'daily'], ['fx', null], ['tint', null],
    ['show', H, 'happy', 'wave', 'c'],
    ['say', H, 'Welcome to Ramen Raijin! Best ramen in Neo-Tokyo, and they give heroes a discount!'],
    ['n', 'Ten minutes later, there are five empty bowls in front of Hikari.'],
    ['say', H, 'Whaff? Lightning takesh a lot of caloriesh!', 'smug', 'hip'],
    ['choice', [
      { t: '"That\'s amazing. Honestly, I\'m impressed."', aff: { hikari: 3 }, then: [['say', H, 'Right?! Finally, someone who gets it!', 'happy', 'fist']] },
      { t: '"How are you not dead?"', aff: { hikari: 1 }, then: [['say', H, 'Metabolism of a god, baby!', 'laugh']] },
      { t: 'Silently push your bowl toward her.', aff: { hikari: 4 }, then: [['say', H, '…!! You\'re giving me your bowl?! You\'re the best handler in the whole world!!', 'love', 'shy']] }
    ]],
    ['say', H, 'Hey, {name}… thanks for hanging out. Most people at HQ think I\'m a walking fire hazard.', 'smile', 'shy'],
    ['me', 'You are a walking fire hazard.'],
    ['say', H, 'Hey!!', 'pout', 'fist'], ['say', H, '…Hehe. At least you say it to my face.', 'happy']
  ];
  S.hang_hikari_2 = [
    ['bg', 'arcade'], ['music', 'action'], ['fx', 'sparks'], ['tint', null],
    ['show', H, 'determined', 'fist', 'c'],
    ['say', H, 'Round three! Winner buys crepes! I\'m NOT losing to a guy who works nights at a konbini!'],
    ['sfx', 'zap'], ['n', 'The arcade machine flickers. Every time Hikari gets excited, the high score board glitches.'],
    ['choice', [
      { t: 'Let her win (subtly).', aff: { hikari: 2 }, then: [['say', H, 'YES! VICTORY! …Wait. Did you let me win?', 'happy', 'fist'], ['say', H, '…You did, didn\'t you. That\'s so annoying. And also kinda sweet.', 'pout', 'shy']] },
      { t: 'Go all out and crush her.', aff: { hikari: 3 }, then: [['say', H, 'NOOO! Again! Rematch! I demand a rematch!!', 'angry', 'fist'], ['say', H, '…That was really fun, though. Nobody ever plays for real with me.', 'happy']] }
    ]],
    ['say', H, 'You know, I used to come here alone every day after the Agency rejected me the first time.', 'sad', 'default'],
    ['say', H, 'It\'s nice to have a player two.', 'tender', 'shy'],
    ['do', G => { G.heroes.hikari.st.cha++; }], ['n', '*Hikari Charisma +1.*']
  ];
  S.hang_hikari_3 = [
    ['bg', 'park'], ['music', 'romance'], ['fx', 'petals'], ['tint', null],
    ['show', H, 'smile', 'default', 'c'],
    ['say', H, 'My mom was a rescue worker. No Spark. Just a hard hat and really stubborn arms.'],
    ['say', H, 'When the Shibuya Rift opened eight years ago, she went in eleven times. She carried out thirty-two people.', 'tender'],
    ['say', H, 'She didn\'t come out the twelfth time.', 'sad'],
    ['say', H, 'I got my Spark three months later. Lightning. Like the universe was saying "too late, kid."', 'cry'],
    ['choice', [
      { t: '"It\'s not too late. You\'re carrying people out now."', aff: { hikari: 4 }, then: [['say', H, '…Yeah. Yeah, I am. With my stupid, stubborn arms.', 'tender', 'fist']] },
      { t: 'Say nothing. Just sit with her.', aff: { hikari: 3 }, then: [['n', 'We watch the petals fall for a long time. Eventually, she leans her head on my shoulder.'], ['say', H, '…Thanks for not saying anything dumb.', 'tender', 'shy']] }
    ]],
    ['say', H, 'You\'re the first person I\'ve told. Don\'t make it weird, okay?', 'blush', 'shy'],
    ['do', G => { G.heroes.hikari.st.int++; G.heroes.hikari.st.vig++; }], ['n', '*Hikari feels steadier. Intellect +1, Vigor +1.*']
  ];
  S.hang_hikari_x = [
    ['bg', 'hq_lobby'], ['music', 'daily'], ['tint', null], ['show', H, 'happy', 'wave', 'c'],
    ['say', H, '{name}! Wanna split a Voltage MAX? No? More for me!'],
    ['n', 'We spend an hour talking about hero trading cards. She has strong opinions about holographic foil.'],
    ['aff', H, 1]
  ];

  S.hang_rei_1 = [
    ['bg', 'rooftop'], ['tint', 'noon'], ['music', 'night'], ['fx', null],
    ['show', R, 'cold', 'cross', 'c'],
    ['say', R, '…Why are you here.'],
    ['me', 'It\'s my break. This is a nice spot.'],
    ['say', R, 'It\'s *my* nice spot.', 'pout'],
    ['n', 'We sit in silence for ten minutes. It\'s not uncomfortable. Somehow.'],
    ['choice', [
      { t: 'Keep sitting quietly.', aff: { rei: 3 }, then: [['say', R, '…You\'re not going to ask me about my "trauma" or "feelings"?', 'surprised', 'default'], ['me', 'Nope.'], ['say', R, '…Good.', 'smile']] },
      { t: '"Want half my sandwich?"', aff: { rei: 2 }, then: [['say', R, 'I\'m not hungry.', 'cold'], ['n', 'She takes half the sandwich.'], ['say', R, '…It\'s fine. For a konbini sandwich.', 'shy']] },
      { t: '"So why do you really work alone?"', aff: { rei: -1 }, then: [['say', R, 'Next question. Or better: no questions.', 'angry', 'cross']] }
    ]]
  ];
  S.hang_rei_2 = [
    ['bg', 'alley'], ['tint', null], ['music', 'night'], ['fx', 'dust'],
    ['n', 'I spot Rei ducking into an alley behind the tower, carrying a small paper bag.'],
    ['show', R, 'tender', 'shy', 'c'],
    ['say', R, 'Here, Kuro. Tuna. The good kind. Don\'t tell anyone I— '],
    ['say', R, '……', 'surprised', 'default'],
    ['say', R, 'How long have you been standing there.', 'angry', 'cross'],
    ['choice', [
      { t: '"Long enough to hear you call her \'my little shadow princess.\'"', aff: { rei: 2 }, then: [['say', R, 'I will bury you in a shadow so deep that light forgets you exist.', 'pout', 'fist'], ['say', R, '…She IS a princess, though.', 'shy']] },
      { t: 'Crouch down and offer the cat your hand.', aff: { rei: 4 }, then: [['n', 'The black cat sniffs my fingers… then headbutts my palm.'], ['say', R, '…She doesn\'t do that for anyone. Not even me, the first month.', 'surprised'], ['say', R, 'Hmph. Traitor cat.', 'smile', 'shy']] }
    ]],
    ['say', R, 'Animals are easier. They don\'t flinch when the shadows move.', 'sad', 'default'],
    ['do', G => { G.heroes.rei.st.vig++; }], ['n', '*Rei Vigor +1.*']
  ];
  S.hang_rei_3 = [
    ['bg', 'medbay'], ['tint', null], ['music', 'sad'], ['fx', null],
    ['show', R, 'sad', 'default', 'c'],
    ['n', 'Rei is sitting alone in the empty med bay, staring at bed number three.'],
    ['say', R, 'Three years ago, my partner was lying in that bed. Because of me.'],
    ['say', R, 'The shadows got loud. I couldn\'t make them stop. They went for everything — including him.', 'cry'],
    ['say', R, 'He forgave me. That was the worst part. I couldn\'t forgive myself, so I made sure it could never happen again.', 'sad', 'cross'],
    ['me', 'By never having a partner.'],
    ['say', R, '…By never having anyone.', 'cry'],
    ['choice', [
      { t: '"Your control is the best I\'ve ever seen. You\'re not that girl anymore."', aff: { rei: 4 }, then: [['say', R, '…You really think so. You, the guy with the notebook.', 'tender'], ['say', R, 'Then… I\'ll try to believe it too.', 'smile', 'shy']] },
      { t: '"If it happens again, we\'ll handle it. Together. That\'s what a squad is for."', aff: { rei: 3 }, then: [['say', R, '…Together.', 'surprised'], ['say', R, 'That word sounds strange coming from your mouth. …Not bad. Just strange.', 'tender', 'shy']] }
    ]],
    ['do', G => { G.heroes.rei.st.cha += 2; }], ['n', '*Rei opens up. Charisma +2.*']
  ];
  S.hang_rei_x = [
    ['bg', 'training'], ['music', 'night'], ['tint', null], ['show', R, 'cold', 'cross', 'c'],
    ['say', R, 'You\'re staring. Take notes if you want, but stop staring.'],
    ['n', 'I take notes. She pretends not to notice me noticing her small, pleased smile.'],
    ['aff', R, 1]
  ];

  S.hang_mira_1 = [
    ['bg', 'medbay'], ['tint', null], ['music', 'romance'], ['fx', null],
    ['show', M, 'smile', 'default', 'c'],
    ['say', M, 'Oh! A visitor who isn\'t bleeding. How refreshing. Tea?'],
    ['n', 'She pours two cups of chamomile. The med bay smells like antiseptic and honey.'],
    ['choice', [
      { t: '"How do you stay so calm with all this chaos?"', aff: { mira: 2 }, then: [['say', M, 'Practice. And a secret stash of chocolate in drawer three. Don\'t tell BIT.', 'smug', 'hip']] },
      { t: '"You look tired, Mira. Are you okay?"', aff: { mira: 4 }, then: [['say', M, '…', 'surprised'], ['say', M, 'People don\'t usually ask me that. I\'m the one who asks.', 'blush', 'shy'], ['say', M, 'I\'m okay. Better, now.', 'tender']] }
    ]],
    ['say', M, 'Come back anytime, {name}. The tea\'s always hot.', 'happy', 'wave']
  ];
  S.hang_mira_2 = [
    ['bg', 'cafe'], ['tint', null], ['music', 'daily'], ['fx', null],
    ['show', M, 'love', 'shy', 'c'],
    ['say', M, 'The Strawberry Mille-feuille. Twelve layers. I have dreamed of this moment all week.'],
    ['n', 'Mira Solace, calm and composed Medical Officer, is vibrating with barely-contained joy.'],
    ['choice', [
      { t: '"Want mine too?"', aff: { mira: 4 }, then: [['say', M, 'You… you would do that? For me?', 'surprised'], ['say', M, 'Marry me. …Kidding! Kidding. Mostly. Ahem.', 'shy']] },
      { t: 'Take a photo of her happy face.', aff: { mira: 2 }, then: [['say', M, 'Delete that. {name}. Delete that right now.', 'pout', 'fist'], ['say', M, '……Send it to me first, though.', 'shy']] }
    ]],
    ['say', M, 'Thank you. I don\'t get to just… be a person very often.', 'tender', 'default'],
    ['do', G => { G.roster.forEach(h => G.heroes[h].fat = Math.max(0, G.heroes[h].fat - 20)); }], ['n', '*Mira\'s good mood spreads. Squad −20 Fatigue.*']
  ];
  S.hang_mira_3 = [
    ['bg', 'rooftop'], ['tint', 'evening'], ['music', 'sad'], ['fx', null],
    ['show', M, 'sad', 'default', 'c'],
    ['say', M, 'Can I tell you how my Spark works? The part that isn\'t in my file?'],
    ['say', M, 'When I heal someone, I don\'t make the wound disappear. I take it. Just for a little while. It fades from me, eventually.', 'sad'],
    ['say', M, 'After the Shibuya Rift, I healed forty people in one night. I couldn\'t walk for a week.', 'cry'],
    ['me', 'Does the Director know?'],
    ['say', M, 'She knows. She\'s the only one. …And now you.', 'tender', 'shy'],
    ['choice', [
      { t: '"Then I\'ll make sure my heroes come back with as few wounds as possible."', aff: { mira: 4 }, then: [['say', M, '…That\'s the most romantic thing a handler has ever said to me. And it\'s about logistics.', 'laugh'], ['say', M, 'I love it.', 'love', 'shy']] },
      { t: 'Take her hand.', aff: { mira: 3 }, then: [['sfx', 'heal'], ['n', 'Her hand is cold. Slowly, it gets warmer.'], ['say', M, '…You\'re not a healer. But that helped anyway.', 'blush', 'shy']] }
    ]]
  ];
  S.hang_mira_x = [
    ['bg', 'medbay'], ['music', 'romance'], ['tint', null], ['show', M, 'smile', 'default', 'c'],
    ['say', M, 'Blood pressure check! Sit. Arm. Now. …Hm. Healthy. Surprisingly.'],
    ['n', 'She keeps her hand on my wrist a few seconds longer than necessary.'],
    ['aff', M, 1]
  ];

  // ======================= RANDOM EVENTS =======================
  const events = {
    ev_bit: { day: 1, s: [
      ['bg', 'hq_lobby'], ['show', B, 'happy', '', 'c'], ['sfx', 'beep'],
      ['say', B, 'Handler! I have composed a motivational song for Squad Zero! ♪ Beep beep, fight the creep ♪'],
      ['choice', [{ t: '"…That\'s great, BIT."', then: [['say', B, 'I KNEW you would appreciate it! Uploading to all HQ speakers!', 'happy']] }, { t: '"Please never sing again."', then: [['say', B, 'Emotional damage registered. Filing a complaint with myself.', 'sad']] }]],
      ['hide', B]
    ] },
    ev_vending: { day: 1, s: [
      ['bg', 'hq_lobby'], ['show', H, 'pout', 'point', 'c'],
      ['say', H, '{name}! The vending machine ate my coins! Watch me zap it and get a free drink!'],
      ['choice', [
        { t: '"Hikari, no."', aff: { hikari: 1 }, then: [['say', H, '…Fine. Being responsible is so boring.', 'pout', 'cross']] },
        { t: '"…Get me one too."', aff: { hikari: 2 }, then: [['sfx', 'zap'], ['flash', '#fff'], ['sfx', 'coin'], ['n', 'Forty-three drinks fall out. The machine catches fire, briefly.'], ['say', H, 'Partners in crime!', 'happy', 'fist'], ['do', G => { G.credits -= 50; }], ['n', '*The Agency docks ¥50 from your pay for "facility damage".*']] }
      ]]
    ] },
    ev_shadowprank: { day: 2, s: [
      ['bg', 'hq_lobby'], ['sfx', 'shadow'], ['show', R, 'smug', 'cross', 'c'],
      ['say', R, 'You flinched.'], ['me', 'You came out of my SHADOW. In an ELEVATOR.'],
      ['say', R, 'I needed a ride to floor forty. You were going to floor forty.', 'neutral'],
      ['say', R, '…Your heartbeat is funny when you\'re startled.', 'smile'], ['aff', R, 1]
    ] },
    ev_miracheck: { day: 2, s: [
      ['bg', 'hq_lobby'], ['show', M, 'pout', 'point', 'c'],
      ['say', M, '{name}. When did you last drink water.'],
      ['choice', [{ t: '"…Tuesday?"', aff: { mira: 1 }, then: [['say', M, 'It IS Tuesday. That\'s not— sit down. Drink this. Now.', 'angry', 'fist']] }, { t: '"Coffee counts, right?"', aff: { mira: 1 }, then: [['say', M, 'Coffee is a diuretic, {name}. Coffee is the ENEMY.', 'angry', 'fist']] }]],
      ['do', G => { G.energy = Math.min(100, G.energy + 15); }], ['n', '*Mira\'s care package restores 15 Energy.*']
    ] },
    ev_fans: { day: 2, s: [
      ['bg', 'city_night'], ['tint', 'noon'], ['show', H, 'surprised', 'default', 'l'], ['show', R, 'cold', 'cross', 'r'],
      ['n', 'A group of kids spots the squad outside HQ.'], ['say', H, 'They want… autographs? From US?!'],
      ['say', R, 'I don\'t do autographs.', 'cold'], ['n', 'A small girl holds up a drawing of Rei. It\'s very bad. It has a lot of glitter.'],
      ['say', R, '……Where do I sign.', 'shy', 'shy'],
      ['do', G => { G.rep += 3; G.heroes.rei.st.cha++; }], ['n', '*Reputation +3. Rei Charisma +1.*']
    ] }
  };

  return { scripts: S, events };
})();

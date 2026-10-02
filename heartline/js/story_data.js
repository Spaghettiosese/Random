/* HEARTLINE AGENCY — game data: dispatch calls, events, quips, synergy, gifts, profiles, phone, feed. */
Object.assign(STORY, (() => {
  // Dispatch call templates. r = "Combat Vigor Mobility Charisma Intellect", n = heroes needed.
  const calls = [
    // tier 1
    { t: 'Cat Stuck on a Billboard', d: 'Forty meters up and furious about it. Gentle hands only.', r: '0 1 3 2 1', tier: 1 },
    { t: 'Rollerblade Purse Snatcher', d: 'Fast, rude, and wearing every piece of protective gear. Someone taught him safety first.', r: '2 1 4 0 0', tier: 1 },
    { t: 'Kindergarten Hero Day', d: 'Forty children. One question each. About forty-five follow-ups.', r: '0 3 0 5 1', tier: 1, ev: 'kids' },
    { t: 'Runaway Shopping Carts', d: 'Two hundred carts rolling down Akiba hill. Physics is winning.', r: '2 2 3 0 1', tier: 1 },
    { t: 'Lost Tourist Group', d: 'Thirty tourists, no map, one extremely confident guide walking the wrong way.', r: '0 1 1 3 3', tier: 1 },
    { t: 'Vending Machine Rampage', d: 'A machine has started dispensing hot soup at passers-by. Nobody ordered soup.', r: '3 1 1 0 2', tier: 1 },
    { t: 'Stuck Elevator — Uptown', d: 'Eight office workers between floors 41 and 42. One of them is singing. Not well.', r: '2 2 0 2 2', tier: 1 },
    { t: 'Noise Complaint: Karaoke Villain', d: 'A self-declared villain is holding a karaoke bar hostage with his singing.', r: '1 1 0 4 1', tier: 1, ev: 'karaoke' },
    { t: 'Escaped Zoo Penguin', d: 'A penguin has found the subway and has no intention of going back.', r: '0 1 4 1 2', tier: 1 },
    { t: 'Fender Bender Standoff', d: 'Two drivers, neither will move. Traffic backed up three kilometers.', r: '0 1 0 4 2', tier: 1 },
    { t: 'Fallen Scaffolding', d: 'Scaffolding came down on an empty street. Clear it before the morning rush.', r: '3 3 0 0 1', tier: 1 },
    { t: 'Smoke in the Library', d: 'Suspicious smoke in the rare-books room. Probably a toaster. Possibly not.', r: '1 2 2 0 3', tier: 1 },
    // tier 2
    { t: 'Convenience Store Robbery', d: 'Two masked robbers and one very tired clerk. I know exactly how that clerk feels.', r: '4 2 2 2 1', n: 2, tier: 2, ev: 'robbery' },
    { t: 'Rift Spore Cleanup', d: 'Glowing spores in a subway vent. Precision work.', r: '1 3 1 0 5', n: 2, tier: 2, ev: 'spores' },
    { t: 'Idol Concert Security', d: 'Eight thousand fans. One man in a penguin suit who has been standing very still.', r: '2 2 1 5 2', n: 2, tier: 2, ev: 'crowd' },
    { t: 'Tier-1 Rift-beast Sighting', d: 'A small glass creature wandering Ueno Park, very interested in the pigeons.', r: '5 3 2 0 2', n: 2, tier: 2 },
    { t: 'Bridge Jumper', d: 'Someone standing on the wrong side of the Riverside bridge railing. Talk before anything else.', r: '0 2 2 6 3', n: 1, tier: 2, ev: 'jumper' },
    { t: 'Hijacked Delivery Drones', d: 'Three hundred drones spelling something rude over Akiba. Someone broke into their firmware.', r: '1 1 3 1 6', n: 2, tier: 2, ev: 'hack' },
    { t: 'Motorcycle Gang Chase', d: 'The Night Wolves are racing through Old Town at 180 km/h. Somebody has a trophy to win.', r: '3 2 6 1 1', n: 2, tier: 2, ev: 'chase' },
    { t: 'Chemical Spill — Industrial', d: 'An overturned tanker leaking something green and bubbly. Nobody will tell us what.', r: '1 4 2 1 4', n: 2, tier: 2 },
    { t: 'Villain: Mr. Adhesive', d: 'He glued a bank shut. Also himself. Also three police officers.', r: '4 3 1 2 3', n: 2, tier: 2, ev: 'glue' },
    { t: 'Apartment Fire — Floor 12', d: 'Smoke pouring from a residential tower. Residents on the balconies, waving.', r: '2 5 4 1 1', n: 2, tier: 2, ev: 'fire' },
    { t: 'Prism Graffiti Crew', d: 'Masked vandals turning subway murals to glass. Catch at least one.', r: '3 1 4 1 2', n: 2, tier: 2 },
    { t: 'Collapsed Tunnel Rescue', d: 'Six workers trapped. Coordination matters more than strength.', r: '3 5 1 2 2', n: 2, tier: 2, ev: 'tunnel' },
    // tier 3
    { t: 'Runaway Maglev Car', d: 'No brakes, 300 km/h. Stop it without derailing it.', r: '4 3 6 0 5', n: 2, tier: 3, ev: 'train' },
    { t: 'Bank Heist — Hostages', d: 'Armed crew, twelve hostages, Uptown vault.', r: '5 3 3 5 4', n: 3, tier: 3, ev: 'robbery' },
    { t: 'Tier-2 Rift-beast', d: 'A glass creature the size of a bus working its way through the harbor warehouses.', r: '7 4 3 0 3', n: 2, tier: 3 },
    { t: 'Stadium Collapse Risk', d: 'Cracks in a packed stadium. Thirty thousand people need to leave without panicking.', r: '2 4 3 7 3', n: 3, tier: 3, ev: 'crowd' },
    { t: 'Rogue Spark: Teenager', d: 'A fifteen-year-old just manifested fire and cannot turn it off. She is more frightened than anyone.', r: '1 5 2 6 3', n: 2, tier: 3, ev: 'jumper' },
    { t: 'Prism Glass Bomb', d: 'A crystal device ticking inside the Akiba station lockers.', r: '2 2 3 1 8', n: 2, tier: 3, ev: 'bomb' },
    { t: 'Villain: The Tax Collector', d: 'Takes a percentage of other people\'s strength. Currently at thirty-eight percent.', r: '6 4 3 3 4', n: 3, tier: 3, ev: 'glue' },
    { t: 'Ferry Taking On Water', d: 'Two hundred passengers, a sinking ferry, cold water.', r: '3 6 5 3 2', n: 3, tier: 3, ev: 'fire' },
    // tier 4
    { t: 'Glass Colossus', d: 'A thirty-meter crystal giant, walking through Industrial. It is not stopping for anything.', r: '9 7 4 2 5', n: 3, tier: 4 },
    { t: 'Rift Breach — Residential', d: 'A Rift has opened inside an apartment complex. Eighty families.', r: '5 7 5 6 5', n: 3, tier: 4, ev: 'glassbloom' },
    { t: 'Prism Cell Stronghold', d: 'A fortified Prism hideout. Hostages, traps, and a great many mirrors.', r: '7 5 5 3 7', n: 3, tier: 4, ev: 'trap' },
    { t: 'Skytower Glassing', d: 'The top twenty floors of a skyscraper are turning to glass, with people still inside.', r: '4 6 7 5 6', n: 3, tier: 4, ev: 'glassbloom' }
  ];

  // Mid-mission live updates: [stat, threshold, option, win text, lose text]
  const callEvents = {
    kids: { q: 'A child asks, "Can you do a power for us?" Forty kids are staring.', o: [['cha', 4, 'Tell a story instead', 'The kids are rapt. One of them gives you a drawing.', 'The story runs long. Someone cries.'], ['com', 4, 'A small, safe demonstration', 'Tiny sparks. Gasps. Applause.', 'A beanbag chair is no more.'], ['int', 3, 'Teach the safety rules as a game', 'They chant the rules all the way home.', 'They are bored. Mutiny is brewing.']] },
    karaoke: { q: 'The karaoke villain challenges your hero to a sing-off. The hostages look hopeful.', o: [['cha', 5, 'Accept the sing-off', 'The crowd goes wild. The villain weeps and surrenders.', 'It is not good. Everyone suffers equally.'], ['mob', 4, 'Grab the microphone while he hits the high note', 'Mic secured. Villain cuffed mid-falsetto.', 'He dodges and keeps singing. Louder.']] },
    robbery: { q: 'The robbers panic and grab a hostage.', o: [['cha', 5, 'Talk them down', 'They lower the weapon. Hands up. It is over.', 'They get angrier. It escalates.'], ['mob', 6, 'Move before they can react', 'Too fast to see. Hostage safe.', 'Not fast enough. Someone is hurt.'], ['com', 6, 'Overpower them', 'Clean takedown.', 'The struggle wrecks the store.']] },
    spores: { q: 'The spores are drifting toward a school ventilation intake.', o: [['int', 5, 'Reroute the airflow at the control panel', 'Vents redirected. The school never knew.', 'Wrong valve. The spores spread.'], ['vig', 5, 'Seal the vent by hand', 'Sealed. Your hero is coughing glitter, but sealed.', 'Too many spores. Your hero has to pull back.']] },
    crowd: { q: 'Someone yells "Fire." There is no fire. The crowd starts to move all at once.', o: [['cha', 6, 'Grab a microphone and calm everyone down', 'The panic dies. People walk out in orderly lines.', 'Nobody can hear. The surge continues.'], ['vig', 6, 'Hold the barrier line', 'The barrier holds. Nobody is crushed.', 'The barrier buckles.'], ['int', 5, 'Open the side exits to spread the crowd', 'Pressure drops at once. Smart.', 'The side exits were locked.']] },
    jumper: { q: 'They look at your hero and say, "Why should I listen to you?"', o: [['cha', 6, 'Sit down and talk. Honestly.', 'Twenty minutes later they step back from the edge, still holding your hero\'s hand.', 'The words do not land. It gets harder.'], ['mob', 6, 'Stay close enough to grab them', 'They slip, and your hero catches them.', 'Too far away.']] },
    hack: { q: 'The drones begin to converge into one swarm over a crowded street.', o: [['int', 6, 'Trace the hacker\'s signal', 'Hacker found in a café. The drones drop gently.', 'The signal bounces. The swarm grows.'], ['mob', 5, 'Knock the lead drones out of the sky', 'Leaderless, the swarm scatters.', 'Drones everywhere.']] },
    chase: { q: 'The gang splits at a major intersection.', o: [['mob', 6, 'Chase the leader across the rooftops', 'Leader caught. The rest give up.', 'Lost him in traffic.'], ['int', 5, 'Predict where they regroup', 'Waiting for them at the gas station. Checkmate.', 'Wrong gas station.']] },
    glue: { q: 'The villain begins to monologue about his tragic backstory. It is very long.', o: [['cha', 5, 'Let him finish, then offer help', 'He is crying. He surrenders to "get his life together."', 'He uses the time to escape.'], ['com', 5, 'Interrupt with a punch', 'Monologue over. Villain down.', 'He dodges. Rude.'], ['int', 5, 'Find his weakness while he talks', 'Solvent spray. Villain unstuck and caught.', 'No weakness. Just a lot of glue.']] },
    fire: { q: 'A child is trapped behind a collapsed doorway.', o: [['vig', 6, 'Push through the heat', 'Your hero walks out carrying the child. Hair slightly singed.', 'The heat is too much. They have to retreat.'], ['mob', 6, 'Find another way around, fast', 'Through the window, around the ledge, in and out.', 'Every path is blocked.'], ['com', 6, 'Smash through the wall', 'A new door. Child saved.', 'The wall was load-bearing.']] },
    tunnel: { q: 'The tunnel groans. Another collapse is coming.', o: [['vig', 6, 'Hold the ceiling while the others dig', 'Steel nerves. Everyone gets out.', 'Too heavy. The team pulls back.'], ['int', 5, 'Calculate the safe route out', 'Straight line to safety. Textbook.', 'The route was wrong.']] },
    train: { q: 'The maglev is ninety seconds from the terminal. It will not stop in time.', o: [['int', 6, 'Hack the emergency track switch', 'Diverted to a siding. It coasts to a gentle stop.', 'Access denied.'], ['vig', 7, 'Stand on the track and brace', 'An incredible stop. Your hero is a legend on HeroNet.', 'Your hero is thrown. The train keeps going.'], ['mob', 7, 'Get aboard and pull the manual brake', 'Brake pulled. Sparks everywhere. Stopped.', 'Cannot catch it.']] },
    bomb: { q: 'The device has two crystal wires. One red, one clear.', o: [['int', 7, 'Analyze the crystal structure first', 'The clear wire was a decoy. Red cut. Safe.', 'The analysis takes too long.'], ['mob', 6, 'Grab it and run it to the river', 'Splash. A harmless crystal geyser.', 'It goes off early.']] },
    prism: { q: 'A Prism member raises a mirror. Civilians are frozen behind glass on the platform.', o: [['com', 6, 'Shatter the mirror before he uses it', 'Mirror broken. The glass cracks open.', 'He is faster. More glass spreads.'], ['int', 5, 'The glass is thin at the seams. Break it there', 'Civilians freed at the weak points.', 'No seams. Just glass.'], ['cha', 5, 'Keep the trapped civilians calm', 'Nobody panics. The rescue goes smoothly.', 'Panic spreads.']] },
    trap: { q: 'Something is wrong. The hostages are not moving. It is an ambush.', o: [['int', 6, 'Spot the trap and pull back at once', 'Out before it springs. Nobody hurt.', 'Too late. It springs.'], ['vig', 7, 'Take it and fight through', 'Battered, but victorious.', 'Overwhelmed.'], ['com', 7, 'Hit them before they hit us', 'Ambushers ambushed.', 'Outnumbered.']] },
    warehouse: { q: 'Inside the warehouse: crates of glass bombs, and a Prism courier running for the exit.', o: [['mob', 6, 'Catch the courier', 'Courier caught, with a notebook of HALO call codes.', 'He vanishes into a mirror.'], ['int', 6, 'Secure the bombs first', 'Every bomb disarmed. The notebook is left behind in the rush.', 'One bomb goes off. The warehouse is glass now.']] },
    siege: { q: 'The Prism masks are pushing forward in a wall of mirrors.', o: [['com', 8, 'Break their line head-on', 'The line shatters.', 'The line holds. Ours bends.'], ['vig', 8, 'Hold the ground no matter what', 'Not one step back.', 'Forced back.'], ['cha', 6, 'Rally the security guards to help', 'Suddenly it is thirty against twelve.', 'Nobody follows.']] },
    glassbloom: { q: 'The glass is spreading faster. People are trapped in the crystal frost.', o: [['vig', 7, 'Pull people out by hand', 'One by one. Everyone out.', 'The frost is too fast.'], ['int', 7, 'Find the Rift\'s core and disrupt it', 'Core cracked. The spreading stops.', 'Cannot find it.'], ['cha', 7, 'Organize the survivors to help each other', 'Neighbors pulling neighbors. Everyone out.', 'Chaos.']] },
    shadowsurge: { q: 'Rei\'s shadows are lashing out at everything. She is shouting for everyone to get back.', o: [['cha', 6, 'Stay. Talk to her. Don\'t leave.', 'Her breathing slows. The shadows fall still.', 'She cannot hear over the noise.'], ['vig', 7, 'Walk through the shadows to her', 'Bruised, but at her side. She grabs your hero\'s hand.', 'Thrown back.']] }
  };

  const quips = {
    hikari: { go: ['Going. One, two, three.', 'On my way. I\'ll count the blocks.', 'Okay. Okay okay. Going.'], win: ['That worked. That actually worked.', 'Did you see? Tell me you saw.', 'Next one. I can do the next one.'], lose: ['I\'m sorry. I\'m so sorry.', 'I aimed wrong. I\'ll aim right next time.', 'That was mine. I\'ll fix it.'] },
    rei: { go: ['Moving.', 'Stepping through.', 'Where, specifically?'], win: ['Done.', 'As expected.', 'It was adequate.'], lose: ['…That was mine to prevent.', 'Don\'t.', 'The shadow wasn\'t where I thought.'] },
    kaede: { go: ['Already there.', 'Clock\'s running.', 'Eleven seconds.'], win: ['New record.', 'Next.', 'Beat Hikari by forty.'], lose: ['…Slow.', 'Two seconds.', 'Don\'t say anything.'] },
    tetsu: { go: ['Heading out. Mind the doors.', 'I\'ll be the wall.', 'Understood. Should I bring snacks?'], win: ['Everyone\'s okay. That\'s the main thing.', 'Good work, everyone.', 'I only broke a little.'], lose: ['I\'m sorry, Handler.', 'I should have held longer.', 'That one\'s on me.'] },
    sora: { go: ['Showtime.', 'Gravity\'s on.', 'Okay. Stage voice.'], win: ['And that\'s the encore.', 'Crowd\'s safe.', 'That one I actually enjoyed.'], lose: ['(quietly) That wasn\'t the voice I use. Sorry.', 'Sorry. That was my fault.', 'Ow. Gravity\'s heavy today.'] }
  };

  function synergy(G, a, b) {
    const k = [a, b].sort().join('|'), f = G.flags;
    switch (k) {
      case 'hikari|rei': return f.hr_bond ? [.1, '+ Hikari & Rei: "Left flank." "Got it."'] : [-.08, '− Hikari & Rei argue on comms'];
      case 'hikari|kaede': return f.hk_bond ? [.12, '+ Rivals in perfect rhythm'] : [-.1, '− Kaede keeps racing Hikari'];
      case 'hikari|sora': return [.06, '+ Idol and superfan energy'];
      case 'kaede|rei': return [.05, '+ Speed and shadows: flankers'];
      case 'rei|tetsu': return [.06, '+ Tetsu is the only one Rei lets stand behind her'];
      case 'rei|sora': return f.sora_stay || G.chap >= 4 ? [.05, '+ Rei tolerates the cameras now'] : [-.05, '− Rei hates the cameras following Sora'];
      case 'kaede|sora': return [.04, '+ Kaede does Sora\'s crowd warm-ups'];
    }
    if (a === 'tetsu' || b === 'tetsu') return [.05, '+ Tetsu covers for everyone'];
    return null;
  }

  const items = {
    volt: { n: 'Voltage MAX', p: 60, icon: '⚡', d: 'Hikari\'s fuel of choice. Tastes like a battery.', love: 'hikari', like: ['kaede'] },
    cat: { n: 'Black Cat Keychain', p: 90, icon: '🐈‍⬛', d: 'A tiny, sleepy black cat. Suspiciously cute.', love: 'rei' },
    cake: { n: 'Strawberry Mille-feuille', p: 80, icon: '🍰', d: 'Twelve layers, from Café Lumière.', love: 'mira', like: ['sora'] },
    shoes: { n: 'Limited Sneakers', p: 140, icon: '👟', d: 'Ultralight racing sneakers. Sold out everywhere except here.', love: 'kaede' },
    plush: { n: 'Star Plushie', p: 70, icon: '⭐', d: 'A squishy star with a sleepy face.', love: 'sora', like: ['hikari'] },
    bonsai: { n: 'Bonsai Shears', p: 100, icon: '✂️', d: 'Professional grade. Very precise.', love: 'tetsu' },
    flower: { n: 'Sunflower Bouquet', p: 70, icon: '🌻', d: 'Bright and unfussy. Most people like flowers.', like: ['hikari', 'rei', 'mira', 'sora', 'kaede'] },
    tea: { n: 'Premium Matcha Set', p: 75, icon: '🍵', d: 'Calming. Bitter. Elegant.', like: ['rei', 'mira', 'tetsu'] },
    ramen: { n: 'Instant Ramen Mega-Pack', p: 30, icon: '🍜', d: 'Emergency rations. Twenty-four servings.', like: ['hikari', 'tetsu'] }
  };
  const profiles = {
    hikari: { full: 'Hikari Amane', tag: '⚡ Electrokinetic · Trainee', rows: [['Age', '19'], ['Codename', 'Thunder Goddess (self-given)'], ['Birthday', 'August 8']], bio: 'Earnest, loud, and always a little hungry. Raw output rivals S-rank heroes. Her aim is a work in progress. She counts things out loud when she is frightened.', likes: 'Energy drinks, ramen, hero manga, being useful' },
    rei: { full: 'Rei Kurogane', tag: '🌑 Umbrakinetic · Rookie Hero', rows: [['Age', '20'], ['Codename', 'Nightveil'], ['Birthday', 'November 30']], bio: 'Flawless technique. Can step through any shadow within fifty meters. Dry, careful, and unwilling to be thanked. Keeps a secret and her scarf close.', likes: 'Black cats, quiet rooftops, matcha, not being asked questions' },
    mira: { full: 'Mira Solace', tag: '✚ Restorative · Medical Officer', rows: [['Age', '24'], ['Codename', 'Halo Nurse'], ['Birthday', 'April 2']], bio: 'The warm center of HALO\'s operations floor. Heals almost any wound with a touch, by taking it into herself, and then tidies the room until it passes.', likes: 'Strawberry anything, tea, people who take care of themselves', role: 'Medical Officer', roleNote: 'Heals the squad every night · not deployable' },
    kaede: { full: 'Kaede Mori', tag: '🌪 Aerokinetic · Speedster', rows: [['Age', '19'], ['Codename', 'Gale'], ['Birthday', 'March 21']], bio: 'Hikari\'s academy rival, and the fastest hero in her class, a fact she will mention. Times everything. When she is actually hurt she goes quiet and slow.', likes: 'Sneakers, winning, energy drinks, and, secretly, being told to slow down' },
    tetsu: { full: 'Tetsu Oda', tag: '🛡 Ferrokinetic · Tank', rows: [['Age', '23'], ['Codename', 'Bulwark'], ['Birthday', 'October 10']], bio: 'Former construction worker whose skin turns to steel. Gentle, polite, wary of doorframes. Grows a bonsai named Kazuo. The angrier he is, the more polite he gets.', likes: 'Bonsai, matcha, ramen, his little sisters' },
    sora: { full: 'Sora Hoshino', tag: '🌌 Gravikinetic · Idol Hero', rows: [['Age', '20'], ['Codename', 'Stargazer'], ['Birthday', '??? (STELLAR changed it)']], bio: 'STELLAR Agency\'s top idol hero. Can make a bus float. Has a stage voice and a real one. Hums off-key when nobody is listening.', likes: 'Star plushies, sweets, arcades, singing when nobody is counting' }
  };
  function trainQuip(h, sc) {
    const lv = sc >= 7 ? 2 : sc >= 4 ? 1 : 0;
    const Q = {
      hikari: [['The target keeps moving. It keeps *moving*.'], ['I felt something click. One more time?'], ['That was clean. Was that clean? Tell me that was clean.']],
      rei: [['…Don\'t say anything.'], ['Adequate.'], ['…Flawless. As expected.']],
      kaede: [['The needle cheated.'], ['Not bad. Not my best.'], ['Too easy. Make it faster.']],
      tetsu: [['Sorry. I think I broke the pad.'], ['Getting steadier.'], ['Oh. That felt really good.']],
      sora: [['Off-beat. Ugh.'], ['Found the rhythm.'], ['Perfect. Idol training does pay off.']]
    };
    return (Q[h] || Q.hikari)[lv][0];
  }
  function giftLine(h, lv) {
    const L = {
      hikari: { 4: 'A Voltage MAX. You remembered. I\'m going to save it. …No, I\'m going to drink it.', 2: 'For me? Thanks, {name}.', 1: 'Oh. Um. Thanks. That\'s nice.' },
      rei: { 4: '…A cat. A small black cat. I\'m keeping it. Don\'t watch me clip it to my bag.', 2: '…Thank you. It\'s tasteful.', 1: '…Hm. Thank you, I suppose.' },
      mira: { 4: 'Is that from Café Lumière? {name}. You absolute saint.', 2: 'How thoughtful. You\'re kind, you know that?', 1: 'Aw. Thank you, {name}.' },
      kaede: { 4: 'No way. Those sold out in eleven seconds. …You\'re all right, Handler.', 2: 'Heh. Not bad taste.', 1: 'Oh. Uh. Thanks.' },
      tetsu: { 4: 'Oh. Oh, these are beautiful. Kazuo will be so well groomed. Thank you, Handler.', 2: 'That\'s really kind. Thank you.', 1: 'Thank you. I\'ll take good care of it.' },
      sora: { 4: 'A star plushie. It\'s so squishy. I\'m naming it after you.', 2: 'You\'re spoiling me.', 1: 'Thank you, Handler.' }
    };
    return (L[h] || L.hikari)[lv];
  }
  const phone = {
    hikari: [
      { msgs: ['{name}, are you awake? Sorry. It\'s 1 a.m. You work nights, so you might be. Are you at work?', 'I can\'t sleep. I keep replaying the store fight.', 'You were really good. Like, not just good. Calm. How do you do that?'], replies: [{ t: 'You were the good one. Go to sleep, Hikari.', aff: 2, resp: ['Okay. Okay. Goodnight. One, two, three.', 'Not sleeping yet. But goodnight.'] }, { t: 'Practice. And I write everything down.', aff: 1, resp: ['Can I read it?', '…No. That\'s private. Sorry. Forget I asked.'] }] },
      { msgs: ['Hey.', 'Do you think I\'m a good hero?', 'I mean really. You can say no. I\'ll be fine. (I won\'t be fine.)'], replies: [{ t: 'You run toward danger when everyone else runs away. That\'s a hero.', aff: 3, resp: ['…', 'Okay. I\'m not crying. You\'re crying.'] }, { t: 'You will be. We\'re working on it together.', aff: 2, resp: ['Together. I like that one.'] }] },
      { msgs: ['Kaede says hi.', 'Kaede did not say hi. I made her say hi.', 'She\'s throwing a pillow at me.'], replies: [{ t: 'Tell her hi back.', aff: 1, resp: ['She said "whatever" but she smiled. That\'s big for her.'] }, { t: 'Sounds like a sleepover.', aff: 2, resp: ['It\'s a war zone, {name}.'] }] },
      { msgs: ['I read the Shibuya file again.', 'I can\'t stop thinking about it.', 'Is it strange that I want to understand him?'], replies: [{ t: 'It isn\'t strange. It\'s brave.', aff: 3, resp: ['…Thanks.', 'Mom would have said the same thing, I think.'] }, { t: 'Call me if you want to talk. Any time.', aff: 3, resp: ['…Calling in five minutes.', 'Don\'t fall asleep on me.'] }] }
    ],
    rei: [
      { msgs: ['This is Kurogane.', 'The Director insisted I add you.', 'Do not send me stickers.'], replies: [{ t: '(Send a cat sticker.)', aff: 2, resp: ['…', 'Where did you find that.', 'Send the rest of the pack.'] }, { t: 'Understood. Goodnight, Rei.', aff: 1, resp: ['…Goodnight.'] }] },
      { msgs: ['Are you awake.', 'The shadows are loud tonight.', 'Tell me something boring.'], replies: [{ t: 'Onigiri restocking procedure, step one…', aff: 3, resp: ['…', 'Continue.', 'It\'s quiet now. Thank you, {name}.'] }, { t: 'Want me to call?', aff: 2, resp: ['No.', '…Perhaps. Only for a minute.'] }] },
      { msgs: ['Receipt followed me home.', 'She is on my bed.', 'I did not invite her. She is staying.'], replies: [{ t: 'Photo, please.', aff: 2, resp: ['[a black cat, judging the camera]', 'She says goodnight.'] }, { t: 'Sounds like she chose you.', aff: 3, resp: ['…', 'Things keep choosing me, lately.'] }] },
      { msgs: ['I played piano today. For the first time in years.', 'Do not make it a big deal.'], replies: [{ t: 'It\'s a big deal, Rei.', aff: 3, resp: ['…', 'I know. Goodnight.'] }, { t: 'Play for me sometime?', aff: 3, resp: ['…Perhaps. If you close your eyes.'] }] }
    ],
    mira: [
      { msgs: ['Medical Officer Solace here. 🩺', 'Did you eat dinner? A real dinner?', 'Be honest. I can always tell.'], replies: [{ t: '…It was a konbini sandwich.', aff: 2, resp: ['{name}.', 'I\'m bringing you a bento tomorrow. No arguments.'] }, { t: 'Yes, doctor. Vegetables and all.', aff: 1, resp: ['Hm. Suspicious. But good.'] }] },
      { msgs: ['Long day in the med bay.', 'Hikari sprained her wrist punching a door. Don\'t ask.', 'How are *you* holding up?'], replies: [{ t: 'Tired, but fine. How about you, Mira?', aff: 3, resp: ['Oh.', 'People don\'t ask me that.', '…I\'m tired too. Talking to you helps.'] }, { t: 'All good. Thanks for checking.', aff: 1, resp: ['Any time. It\'s my job. ☺️'] }] },
      { msgs: ['You changed the dispatch rules today.', 'Fewer injuries. More rest time.', 'Was that for me?'], replies: [{ t: 'For you.', aff: 4, resp: ['……', 'I\'m going to sleep now before I say something unprofessional.', 'Goodnight. 💕'] }, { t: 'For the whole squad. But mostly you.', aff: 3, resp: ['Mostly me. Okay. I\'ll take mostly.'] }] }
    ],
    kaede: [
      { msgs: ['yo', 'what was my time on the akiba call', 'be precise'], replies: [{ t: '4 minutes 12 seconds. Record.', aff: 3, resp: ['LET\'S GO', 'tell hikari', 'no wait dont', 'yes tell her'] }, { t: 'Go to sleep, Kaede.', aff: 1, resp: ['sleep is for slow people'] }] },
      { msgs: ['hikari caught me today', 'i didnt say thanks', 'how do you say thanks to someone you were rude to for 4 years'], replies: [{ t: 'Just say it. She\'ll understand.', aff: 3, resp: ['ugh fine', '…i said it', 'she cried. idiot. (i cried too dont tell)'] }, { t: 'Buy her ramen.', aff: 2, resp: ['genius', 'ok'] }] }
    ],
    tetsu: [
      { msgs: ['Good evening, Handler. 🙂', 'Kazuo (my bonsai) says goodnight.', 'He does not actually talk. But he would.'], replies: [{ t: 'Goodnight, Kazuo.', aff: 2, resp: ['He is very happy. 🌳'] }, { t: 'Goodnight, Tetsu. Good work today.', aff: 2, resp: ['Thank you. I only broke one door.'] }] },
      { msgs: ['My sister passed her exams.', 'Top of her class.', 'I cried in the training room. Hikari saw. She cried too.'], replies: [{ t: 'Congratulations. Tell her the whole squad is proud.', aff: 3, resp: ['I will. She says thank you.'] }, { t: 'That\'s wonderful, Tetsu.', aff: 2, resp: ['It is. Everything is wonderful today.'] }] }
    ],
    sora: [
      { msgs: ['Handler~! 🌟', 'Is this your number? I bribed B.I.T. with a firmware update.'], replies: [{ t: 'B.I.T. can be bribed?', aff: 2, resp: ['Everyone can be bribed, Handler~', '(with love)'] }, { t: 'Hi, Sora.', aff: 1, resp: ['Hiii! Goodnight! 🌙'] }] },
      { msgs: ['my manager left 14 voicemails', 'i didnt listen to any of them', 'is that bad'], replies: [{ t: 'It\'s healthy. You\'re allowed to rest.', aff: 3, resp: ['nobody tells me that', '…thank you. i needed that'] }, { t: 'Want me to listen to them for you?', aff: 2, resp: ['lol', 'you would do that?? ok maybe one'] }] },
      { msgs: ['im writing a song', 'its not for the fans. is that selfish'], replies: [{ t: 'It\'s not selfish. It\'s yours.', aff: 3, resp: ['…mine.', 'i like how that sounds'] }, { t: 'Can I hear it someday?', aff: 3, resp: ['…only you. someday.'] }] }
    ]
  };
  function phoneFallback(who) {
    const P = { hikari: ['Goodnight, Handler. I ate four onigiri in your honor.', 'That\'s a joke. It was three.'], rei: ['…Goodnight.', 'Sleep. That is an order.'], mira: ['Hydrate. Sleep. Repeat. 💧', 'Goodnight, {name} 🌙'], kaede: ['good shift today', 'night'], tetsu: ['Goodnight, Handler. 🌳'], sora: ['sweet dreams, Handler~ ⭐'] };
    return { msgs: P[who] || ['Goodnight.'], replies: [{ t: 'Goodnight. See you tomorrow.', aff: 1, resp: ['👋'] }] };
  }
  function feed(G) {
    const c = G.chap || 1, all = [];
    if (c >= 4) all.push({ u: 'NeoTokyo News', h: '@NTNews', a: '📰', c: '#444', t: 'CURFEW EXTENDED: Glass zones now cover 6% of Shibuya. HALO\'s Squad Zero leads the citywide response.', l: 88000 }, { u: 'Sora ⭐', h: '@stargazer', a: '⭐', c: '#c9b6ff', t: 'Whatever happens, I\'m with Squad Zero. Thank you for all the love 💫', l: 440000 });
    if (c >= 3) all.push({ u: '???', h: '@glass_and_mirrors', a: '◇', c: '#7ff', t: 'Every door opens eventually.', l: 13 }, { u: 'HALO Official', h: '@HALO_Agency', a: '◎', c: '#1f5fd6', t: 'HALO is cooperating fully with the Board review. Dispatch continues uninterrupted.', l: 5400 });
    if (c >= 2) all.push({ u: 'Kaede 🌪', h: '@gale_fast', a: '🌪', c: '#5ef0a0', t: 'new squad. new record. old rival. whatever.', l: 12000 }, { u: 'Tetsu', h: '@bulwark_bonsai', a: '🌳', c: '#e0a060', t: '[photo of a bonsai] Kazuo turned 40 today 🎉', l: 31000 }, { u: 'NeoTokyo News', h: '@NTNews', a: '📰', c: '#444', t: '"Prism" art crimes continue: Ueno Park statue turned to glass overnight.', l: 22000 });
    all.push({ u: 'Hikari ⚡', h: '@thundergoddess', a: '⚡', c: '#ffcf3f', t: 'my handler {name} read a Tier-3 in eleven seconds. I\'m not taking questions. (I\'m taking questions.)', l: 900 + G.day * 211 }, { u: 'B.I.T.', h: '@bit_official', a: '🤖', c: '#52e0ff', t: `Squad Zero has resolved ${G.calls || 0} calls. Handler caffeine intake: concerning.`, l: 4410 }, { u: 'HeroStan_2009', h: '@herostan', a: '🌟', c: '#ff7aa8', t: 'HandlerZero is at HALO now and honestly Squad Zero dispatch is the best thing on HeroNet', l: 2103 });
    return all;
  }
  const credits = ['#HEARTLINE AGENCY', 'A Hero Handler Romance', '', '#Starring', 'Hikari Amane — Thunder Goddess', 'Rei Kurogane — Nightveil', 'Mira Solace — Halo Nurse', 'Kaede Mori — Gale', 'Tetsu Oda — Bulwark', 'Sora Hoshino — Stargazer', 'Kyouya Aoi — The Glazier', 'Director Aya Takamine', 'B.I.T.', 'and {name} — Handler', '', '#In memory of', 'Squad One', 'Natsuki Amane', '', '#Art', 'Procedural pixel art with the Moonkai Pixel Engine', '', '#Music & Sound', 'Procedural WebAudio compositions', '', '#Engine', 'Heartline VN + Dispatch Engine — handmade', '', '#Thank you for playing', 'Squad Zero is always hiring.', '', '♥'];

  return { calls, callEvents, quips, synergy, items, profiles, trainQuip, giftLine, phone, phoneFallback, feed, credits };
})());

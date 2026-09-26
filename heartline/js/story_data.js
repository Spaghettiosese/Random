/* HEARTLINE AGENCY — game data: dispatch calls, events, quips, synergy, gifts, profiles, phone, feed. */
Object.assign(STORY, (() => {
  // Dispatch call templates. r = "Combat Vigor Mobility Charisma Intellect", n = heroes needed.
  const calls = [
    // tier 1
    { t: 'Cat Stuck on a Billboard', d: 'A very judgmental cat is 40 meters up. Gentle hands required.', r: '0 1 3 2 1', tier: 1 },
    { t: 'Rollerblade Purse Snatcher', d: "He's fast. He's rude. He's wearing knee pads.", r: '2 1 4 0 0', tier: 1 },
    { t: 'Kindergarten Hero Day', d: '40 children. 40 questions each. The hardest mission of all.', r: '0 3 0 5 1', tier: 1, ev: 'kids' },
    { t: 'Runaway Shopping Carts', d: 'Two hundred carts rolling down Akiba hill. Physics is winning.', r: '2 2 3 0 1', tier: 1 },
    { t: 'Lost Tourist Group', d: '30 tourists, zero maps, one very confident guide going the wrong way.', r: '0 1 1 3 3', tier: 1 },
    { t: 'Vending Machine Rampage', d: 'A vending machine has become sentient and is dispensing hot soup at people.', r: '3 1 1 0 2', tier: 1 },
    { t: 'Stuck Elevator — Uptown', d: 'Eight office workers stuck between floors 41 and 42. One of them is singing.', r: '2 2 0 2 2', tier: 1 },
    { t: 'Noise Complaint: Karaoke Villain', d: 'A self-declared villain is holding a karaoke bar hostage with bad singing.', r: '1 1 0 4 1', tier: 1, ev: 'karaoke' },
    { t: 'Escaped Zoo Penguin', d: "A penguin is loose in the subway and has 'no intention of going back.'", r: '0 1 4 1 2', tier: 1 },
    { t: 'Fender Bender Standoff', d: 'Two drivers refusing to move. Traffic backed up for 3 km.', r: '0 1 0 4 2', tier: 1 },
    { t: 'Fallen Scaffolding', d: 'Scaffolding collapsed on an empty street. Clear it before rush hour.', r: '3 3 0 0 1', tier: 1 },
    { t: 'Smoke in the Library', d: 'Suspicious smoke in the rare books room. Probably a toaster. Probably.', r: '1 2 2 0 3', tier: 1 },
    // tier 2
    { t: 'Convenience Store Robbery', d: "Two masked robbers. One very tired clerk. You know how that feels.", r: '4 2 2 2 1', n: 2, tier: 2, ev: 'robbery' },
    { t: 'Rift Spore Cleanup', d: 'Glowing spores in a subway vent. Precision work only.', r: '1 3 1 0 5', n: 2, tier: 2, ev: 'spores' },
    { t: 'Idol Concert Security', d: 'A crowd of 8,000. One suspicious guy in a penguin suit.', r: '2 2 1 5 2', n: 2, tier: 2, ev: 'crowd' },
    { t: 'Tier-1 Rift-beast Sighting', d: 'A small glass-type beast wandering through Ueno Park.', r: '5 3 2 0 2', n: 2, tier: 2 },
    { t: 'Bridge Jumper', d: "Someone standing on the edge of the Riverside bridge. Talk first.", r: '0 2 2 6 3', n: 1, tier: 2, ev: 'jumper' },
    { t: 'Hijacked Delivery Drone Swarm', d: '300 drones spelling rude words over Akiba. Someone hacked them.', r: '1 1 3 1 6', n: 2, tier: 2, ev: 'hack' },
    { t: 'Motorcycle Gang Chase', d: 'The “Night Wolves” are racing through Old Town at 180 km/h.', r: '3 2 6 1 1', n: 2, tier: 2, ev: 'chase' },
    { t: 'Chemical Spill — Industrial', d: 'An overturned tanker is leaking something green and bubbly.', r: '1 4 2 1 4', n: 2, tier: 2 },
    { t: 'Villain: Mr. Adhesive', d: 'Glued a bank shut. Also glued himself to it. Also the police.', r: '4 3 1 2 3', n: 2, tier: 2, ev: 'glue' },
    { t: 'Apartment Fire — Floor 12', d: 'Smoke pouring out of a residential tower. Residents on the balconies.', r: '2 5 4 1 1', n: 2, tier: 2, ev: 'fire' },
    { t: 'Prism Graffiti Crew', d: 'Masked vandals turning subway murals to glass. Catch at least one.', r: '3 1 4 1 2', n: 2, tier: 2 },
    { t: 'Collapsed Tunnel Rescue', d: 'Six workers trapped. Coordination beats raw power.', r: '3 5 1 2 2', n: 2, tier: 2, ev: 'tunnel' },
    // tier 3
    { t: 'Runaway Maglev Car', d: 'No brakes. 300 km/h. Stop it without derailing it.', r: '4 3 6 0 5', n: 2, tier: 3, ev: 'train' },
    { t: 'Bank Heist — Hostages', d: 'An armed crew holding twelve hostages in the Uptown vault.', r: '5 3 3 5 4', n: 3, tier: 3, ev: 'robbery' },
    { t: 'Tier-2 Rift-beast', d: 'A glass-bodied beast the size of a bus, rampaging through Harbor warehouses.', r: '7 4 3 0 3', n: 2, tier: 3 },
    { t: 'Stadium Collapse Risk', d: 'Cracks spreading through a packed stadium. Evacuate 30,000 people calmly.', r: '2 4 3 7 3', n: 3, tier: 3, ev: 'crowd' },
    { t: 'Rogue Spark: Pyrokinetic Teen', d: "A scared 15-year-old just manifested fire powers. She can't turn them off.", r: '1 5 2 6 3', n: 2, tier: 3, ev: 'jumper' },
    { t: 'Prism Glass Bomb', d: 'A crystal device ticking in the Akiba station lockers.', r: '2 2 3 1 8', n: 2, tier: 3, ev: 'bomb' },
    { t: 'Villain: The Tax Collector', d: "Can steal 'percentages' of people's strength. Currently at 38%.", r: '6 4 3 3 4', n: 3, tier: 3, ev: 'glue' },
    { t: 'Ferry Taking On Water', d: '200 passengers, a sinking ferry, and very cold water.', r: '3 6 5 3 2', n: 3, tier: 3, ev: 'fire' },
    // tier 4
    { t: 'Glass Colossus', d: 'A thirty-meter crystal giant walking through Industrial. It is not stopping.', r: '9 7 4 2 5', n: 3, tier: 4 },
    { t: 'Rift Breach — Residential', d: 'A Rift has opened inside an apartment complex. 80 families inside.', r: '5 7 5 6 5', n: 3, tier: 4, ev: 'glassbloom' },
    { t: 'Prism Cell Stronghold', d: 'A fortified Prism hideout. Hostages, traps, and a lot of mirrors.', r: '7 5 5 3 7', n: 3, tier: 4, ev: 'trap' },
    { t: 'Skytower Glassing', d: "The top 20 floors of a skyscraper are turning to glass — with people inside.", r: '4 6 7 5 6', n: 3, tier: 4, ev: 'glassbloom' }
  ];

  // Mid-mission live updates: [stat, threshold, option, win text, lose text]
  const callEvents = {
    kids: { q: 'A child asks, “Can you do a power for us?” Forty kids are staring expectantly.', o: [['cha', 4, 'Tell a heroic story instead', 'The kids are enraptured. One gives you a drawing.', 'The story is too long. Someone cries.'], ['com', 4, 'A small, SAFE demonstration', 'Tiny sparks! Gasps! Applause!', 'A beanbag chair is no more.'], ['int', 3, 'Teach them the hero safety rules as a game', 'They chant the rules all the way home.', "They're bored. Mutiny is brewing."]] },
    karaoke: { q: 'The karaoke villain challenges your hero to a sing-off. The hostages look hopeful.', o: [['cha', 5, 'Accept the sing-off', 'The crowd goes wild. The villain weeps and surrenders.', "It's… not good. Everyone suffers equally."], ['mob', 4, 'Grab the microphone while he hits the high note', 'Mic secured. Villain cuffed mid-falsetto.', 'He dodges and keeps singing. Louder.']] },
    robbery: { q: 'The robbers panic and grab a hostage!', o: [['cha', 5, 'Talk them down calmly', 'They lower the weapon. Hands up. It\'s over.', 'They get angrier. It escalates.'], ['mob', 6, 'Move before they can react', "Too fast to see. Hostage safe.", "Not fast enough. Someone gets hurt."], ['com', 6, 'Overpower them', 'Clean takedown.', 'The struggle wrecks the store.']] },
    spores: { q: 'The spores are drifting toward a school ventilation intake!', o: [['int', 5, 'Reroute the airflow at the control panel', 'Vents redirected. The school never knew.', 'Wrong valve. The spores spread.'], ['vig', 5, 'Physically seal the vent — whatever it takes', 'Sealed. Your hero is coughing glitter, but sealed.', "Too many spores. Your hero has to pull back."]] },
    crowd: { q: 'Someone yells “FIRE!” — there is no fire. The crowd starts to stampede.', o: [['cha', 6, 'Grab a mic and calm everyone down', 'The panic dies. People walk out in orderly lines.', "Nobody can hear. The surge continues."], ['vig', 6, 'Physically hold the barrier line', 'The barrier holds. Nobody is crushed.', 'The barrier buckles.'], ['int', 5, 'Open the side exits to spread the crowd', 'Pressure drops instantly. Smart.', 'The side exits were locked.']] },
    jumper: { q: 'They look at your hero and say, “Why should I listen to you?”', o: [['cha', 6, 'Sit down and just talk. Honestly.', 'Twenty minutes later, they step back from the edge. Holding your hero\'s hand.', "The words don't land. It gets harder."], ['mob', 6, 'Get close enough to grab them if they slip', 'They slip — and your hero catches them.', 'Too far away.']] },
    hack: { q: 'The drones start converging into one big swarm over a crowded street.', o: [['int', 6, 'Trace the hacker\'s signal', 'Hacker found in a café. The drones drop gently.', 'The signal bounces. The swarm grows.'], ['mob', 5, 'Knock the lead drones out of the sky', 'Leaderless, the swarm scatters.', 'Drones everywhere. Chaos.']] },
    chase: { q: 'The gang splits up at a major intersection!', o: [['mob', 6, 'Chase the leader across the rooftops', 'Leader caught. The rest give up.', 'Lost him in traffic.'], ['int', 5, 'Predict where they regroup', 'Waiting for them at the gas station. Checkmate.', 'Wrong gas station.']] },
    glue: { q: 'The villain monologues about his tragic backstory. It is very long.', o: [['cha', 5, 'Let him finish, then offer him help', "He's… crying? He surrenders to 'get his life together.'", 'He uses the time to escape.'], ['com', 5, 'Interrupt with a punch', 'Monologue over. Villain down.', 'He dodges. Rude.'], ['int', 5, 'Find his weakness while he talks', 'Solvent spray! Villain unstuck and caught.', 'No weakness found. Just a lot of glue.']] },
    fire: { q: 'A child is trapped behind a collapsed doorway!', o: [['vig', 6, 'Push through the heat', 'Your hero walks out carrying the child. Hair slightly singed.', 'The heat is too much. They have to retreat.'], ['mob', 6, 'Find another way around — fast', 'Through the window, around the ledge, in and out.', 'Every path is blocked.'], ['com', 6, 'Smash through the wall', 'A new door! Child saved.', 'The wall was load-bearing.']] },
    tunnel: { q: 'The tunnel groans. Another collapse is coming.', o: [['vig', 6, 'Hold the ceiling up while the others dig', 'Steel nerves. Everyone gets out.', 'Too heavy. The team has to pull back.'], ['int', 5, 'Calculate the safe route out', 'Straight line to safety. Textbook.', 'The route was wrong.']] },
    train: { q: 'The maglev is 90 seconds from the terminal. It will not stop in time.', o: [['int', 6, 'Hack the emergency track switch', 'Diverted to a siding. Coasts to a gentle stop.', 'Access denied.'], ['vig', 7, 'Stand on the track and brace', 'An incredible stop. Your hero is a legend on HeroNet.', 'Your hero gets thrown. The train keeps going.'], ['mob', 7, 'Get aboard and hit the manual brake', 'Brake pulled. Sparks everywhere. Stopped.', 'Can\'t catch it.']] },
    bomb: { q: 'The device has two crystal wires. One red, one clear.', o: [['int', 7, 'Analyze the crystal structure first', 'The clear wire was a decoy. Red cut. Safe.', 'The analysis takes too long.'], ['mob', 6, 'Grab it and run it to the river', 'SPLASH. A harmless crystal geyser.', 'It goes off early.']] },
    prism: { q: 'A Prism member raises a mirror. Civilians are frozen behind glass on the platform!', o: [['com', 6, 'Shatter the mirror before he uses it', 'Mirror broken. The glass cracks open.', "He's faster. More glass spreads."], ['int', 5, 'The glass is thin at the seams — break it there', 'Civilians freed at the weak points.', 'No seams. Just glass.'], ['cha', 5, 'Keep the trapped civilians calm', 'Nobody panics. Rescue goes smoothly.', 'Panic spreads.']] },
    trap: { q: "Something's wrong. The hostages aren't moving. It's an AMBUSH!", o: [['int', 6, 'Spot the trap and pull back instantly', 'Out before it springs. Nobody hurt.', "Too late — it springs."], ['vig', 7, 'Tank it and fight through', 'Battered, but victorious.', 'Overwhelmed.'], ['com', 7, 'Hit them before they hit us', 'Ambushers ambushed.', 'Outnumbered.']] },
    warehouse: { q: 'Inside the warehouse: crates of glass bombs, and a Prism courier running for the exit.', o: [['mob', 6, 'Catch the courier', 'Courier caught — with a notebook of HALO call codes.', 'He vanishes into a mirror.'], ['int', 6, 'Secure the bombs first', 'Every bomb disarmed. The notebook is left behind in the rush.', 'One bomb goes off. The warehouse is glass now.']] },
    siege: { q: 'The Prism masks are pushing forward in a wall of mirrors!', o: [['com', 8, 'Break their line head-on', 'The line shatters.', 'The line holds. Ours bends.'], ['vig', 8, 'Hold the ground no matter what', 'Not one step back.', 'Forced back.'], ['cha', 6, 'Rally the security guards to help', 'Suddenly it\'s thirty against twelve.', 'Nobody follows.']] },
    glassbloom: { q: 'The glass is spreading faster. People are trapped in the crystal frost!', o: [['vig', 7, 'Pull people out by hand', 'One by one. Everyone out.', 'The frost is too fast.'], ['int', 7, 'Find the Rift\'s core and disrupt it', 'Core cracked. The spreading stops.', "Can't find it."], ['cha', 7, 'Organize the survivors to help each other', "Neighbors pulling neighbors. It's beautiful.", 'Chaos.']] },
    shadowsurge: { q: "Rei's shadows are lashing out at everything. She's shouting for everyone to get back.", o: [['cha', 6, "Stay. Talk to her. Don't leave.", 'Her breathing slows. The shadows fall still.', 'She can\'t hear over the noise.'], ['vig', 7, "Walk through the shadows to her", 'Bruised, but at her side. She grabs your hero\'s hand.', 'Thrown back.']] }
  };

  const quips = {
    hikari: { go: ["On it!", "Thunder Goddess, deploying!", "Leave it to meee!", "Zap time!"], win: ["Nailed it!!", "Did you see that?!", "Easy peasy!"], lose: ["Ugh, sorry…", "I zapped the wrong thing…", "Next time!"] },
    rei: { go: ["Moving.", "…Fine.", "Stepping through."], win: ["Done.", "Obviously.", "Too easy."], lose: ["…Tch.", "That shouldn't have happened.", "Don't look at me like that."] },
    kaede: { go: ["Already there!", "Blink and you'll miss me!", "Go go go!"], win: ["Personal best!", "Faster than Hikari!", "Next!"], lose: ["I was… two seconds late.", "Not fast enough…", "Grr!"] },
    tetsu: { go: ["Heading out!", "I'll be the wall.", "Okay! Careful with doors."], win: ["Everyone's safe!", "Good work, team.", "Phew."], lose: ["I'm sorry, Handler.", "I'll hold better next time.", "…Ow."] },
    sora: { go: ["Showtime!", "Gravity, go!", "Let's make it sparkle!"], win: ["Encore!", "Crowd's safe!", "Ehehe~ perfect!"], lose: ["That wasn't my best performance…", "Sorry, everyone…", "Ow… gravity's heavy today."] }
  };

  function synergy(G, a, b) {
    const k = [a, b].sort().join('|'), f = G.flags;
    switch (k) {
      case 'hikari|rei': return f.hr_bond ? [.1, '+ Hikari & Rei: “Left flank!” “Got it!”'] : [-.08, '− Hikari & Rei bicker on comms'];
      case 'hikari|kaede': return f.hk_bond ? [.12, '+ Rivals in perfect rhythm'] : [-.1, '− Kaede keeps racing Hikari'];
      case 'hikari|sora': return [.06, '+ Idol & superfan energy'];
      case 'kaede|rei': return [.05, '+ Speed & shadows: flanking pros'];
      case 'rei|tetsu': return [.06, "+ Tetsu is the only one Rei lets stand behind her"];
      case 'rei|sora': return f.sora_stay || G.chap >= 4 ? [.05, '+ Rei tolerates the cameras now'] : [-.05, '− Rei hates the cameras following Sora'];
      case 'kaede|sora': return [.04, '+ Kaede does Sora\'s crowd warm-ups'];
    }
    if (a === 'tetsu' || b === 'tetsu') return [.05, '+ Tetsu covers for everyone'];
    return null;
  }

  const items = {
    volt: { n: 'Voltage MAX', p: 60, icon: '⚡', d: "Hikari's fuel of choice. Tastes like a battery.", love: 'hikari', like: ['kaede'] },
    cat: { n: 'Black Cat Keychain', p: 90, icon: '🐈‍⬛', d: 'A tiny sleepy black cat. Suspiciously cute.', love: 'rei' },
    cake: { n: 'Strawberry Mille-feuille', p: 80, icon: '🍰', d: 'Twelve layers of happiness from Café Lumière.', love: 'mira', like: ['sora'] },
    shoes: { n: 'Limited Sneakers', p: 140, icon: '👟', d: 'Hyper-light racing sneakers. Sold out everywhere. Except here.', love: 'kaede' },
    plush: { n: 'Star Plushie', p: 70, icon: '⭐', d: 'A squishy star with a sleepy face.', love: 'sora', like: ['hikari'] },
    bonsai: { n: 'Bonsai Shears', p: 100, icon: '✂️', d: 'Professional-grade. Very precise.', love: 'tetsu' },
    flower: { n: 'Sunflower Bouquet', p: 70, icon: '🌻', d: 'Bright and cheerful. Most people like flowers.', like: ['hikari', 'rei', 'mira', 'sora', 'kaede'] },
    tea: { n: 'Premium Matcha Set', p: 75, icon: '🍵', d: 'Calming. Bitter. Elegant.', like: ['rei', 'mira', 'tetsu'] },
    ramen: { n: 'Instant Ramen Mega-Pack', p: 30, icon: '🍜', d: 'Emergency rations. 24 servings.', like: ['hikari', 'tetsu'] }
  };
  const profiles = {
    hikari: { full: 'Hikari Amane', tag: '⚡ Electrokinetic · Trainee', rows: [['Age', '19'], ['Codename', 'Thunder Goddess (self-given)'], ['Birthday', 'August 8']], bio: 'Loud, brave, and perpetually hungry. Raw output rivals S-rank heroes. Her aim is… a work in progress.', likes: 'Energy drinks, ramen, hero manga, being called "reliable"' },
    rei: { full: 'Rei Kurogane', tag: '🌑 Umbrakinetic · Rookie Hero', rows: [['Age', '20'], ['Codename', 'Nightveil'], ['Birthday', 'November 30']], bio: 'Flawless technique and zero patience for people. Can step through any shadow within 50 meters. Keeps a secret she guards closely.', likes: 'Black cats, quiet rooftops, matcha, not being asked questions' },
    mira: { full: 'Mira Solace', tag: '✚ Restorative · Medical Officer', rows: [['Age', '24'], ['Codename', 'Halo Nurse'], ['Birthday', 'April 2']], bio: 'The gentle heart of HALO\'s operations floor. Heals almost any wound with a touch — by taking it into herself.', likes: 'Sweets (strawberry anything), tea, people who take care of themselves', role: 'Medical Officer', roleNote: 'Heals the squad every night · not deployable' },
    kaede: { full: 'Kaede Mori', tag: '🌪 Aerokinetic · Speedster', rows: [['Age', '19'], ['Codename', 'Gale'], ['Birthday', 'March 21']], bio: "Hikari's academy rival. The fastest hero in her class, and determined that everyone knows it. Hides a lot behind a smirk.", likes: 'Sneakers, winning, energy drinks, secretly: being told to slow down' },
    tetsu: { full: 'Tetsu Oda', tag: '🛡 Ferrokinetic · Tank', rows: [['Age', '23'], ['Codename', 'Bulwark'], ['Birthday', 'October 10']], bio: 'Former construction worker whose skin turns to steel. Gentle, polite, and terrified of doorframes. Grows bonsai.', likes: 'Bonsai, matcha, ramen, his little sisters' },
    sora: { full: 'Sora Hoshino', tag: '🌌 Gravikinetic · Idol Hero', rows: [['Age', '20'], ['Codename', 'Stargazer'], ['Birthday', '??? (STELLAR changed it)']], bio: "STELLAR Agency's top idol hero. Can make a bus float. Tired of being a product. Unusually good at making people feel seen.", likes: 'Star plushies, sweets, arcades, singing when nobody\'s counting' }
  };
  function trainQuip(h, sc) {
    const lv = sc >= 7 ? 2 : sc >= 4 ? 1 : 0;
    const Q = {
      hikari: [['Aaargh! The target keeps MOVING!'], ['Getting there! I felt something click!'], ['PERFECT! Did you see that?! I\'m amazing!!']],
      rei: [['…Don\'t say anything.'], ['Adequate.'], ['…Flawless. As expected.']],
      kaede: [["That wasn't fair, the needle cheated."], ['Not bad. Not my best.'], ['Too easy! Make it faster!']],
      tetsu: [['Sorry… I think I broke the pad.'], ['Getting steadier!'], ['Oh! That felt really good!']],
      sora: [['Off-beat… ugh.'], ['Found the rhythm!'], ['Perfect timing! Idol training pays off~']]
    };
    return (Q[h] || Q.hikari)[lv][0];
  }
  function giftLine(h, lv) {
    const L = {
      hikari: { 4: "VOLTAGE MAX?! You remembered!! I'm saving it forever!! …Okay, I'm drinking it.", 2: 'For me? Ehehe… thanks, {name}!', 1: "Oh! Um, thanks! That's… nice!" },
      rei: { 4: "…A cat. A little black cat. …I'm keeping it. Don't watch me put it on my bag.", 2: "…Thank you. It's tasteful.", 1: '…Hm. Thanks, I suppose.' },
      mira: { 4: "Is that from Café Lumière?! {name}, you absolute saint.", 2: "How thoughtful! You're sweet, you know that?", 1: 'Aww, thank you, {name}.' },
      kaede: { 4: "No way. NO WAY. These sold out in eleven seconds. …You're alright, Handler.", 2: 'Heh. Not bad taste.', 1: "Oh. Uh. Thanks." },
      tetsu: { 4: "Oh… oh, these are beautiful. Kazuo will be so well-groomed. Thank you, Handler.", 2: "That's really kind. Thank you!", 1: "Thank you! I'll take good care of it." },
      sora: { 4: "A star plushie!! It's so squishy! I'm naming it after you!", 2: "Ehehe~ you're spoiling me!", 1: 'Thank you, Handler!' }
    };
    return (L[h] || L.hikari)[lv];
  }
  const phone = {
    hikari: [
      { msgs: ['{name}!!! are u awake', 'i cant sleep i keep replaying the store fight', 'u were SO COOL. like movie cool'], replies: [{ t: 'You were the cool one. Goodnight, Hikari.', aff: 2, resp: ['!!!!!!', 'ok now i REALLY cant sleep ⚡'] }, { t: 'Go to sleep, Thunder Goddess.', aff: 1, resp: ['yes sir handler sir 🫡'] }] },
      { msgs: ['hey', 'do u think im a good hero', 'like. for real'], replies: [{ t: 'You run toward danger when everyone else runs away. That\'s a hero.', aff: 3, resp: ['…', 'ok im not crying ur crying'] }, { t: "You will be. We're working on it together.", aff: 2, resp: ['together!! i like that'] }] },
      { msgs: ['kaede says hi', 'kaede did NOT say hi', 'i made her say hi', 'shes throwing a pillow at me'], replies: [{ t: 'Tell her hi back.', aff: 1, resp: ['she said “whatever” but she smiled', 'HUGE progress'] }, { t: 'Sounds like a sleepover.', aff: 2, resp: ['its a WAR ZONE {name}'] }] },
      { msgs: ['i read the shibuya file again', 'cant stop thinking about it', 'is it weird that i want to understand him'], replies: [{ t: "It's not weird. It's brave.", aff: 3, resp: ['…thanks', 'mom would say the same thing i think'] }, { t: "Call me if you want to talk. Any time.", aff: 3, resp: ['…calling u in 5 min', 'dont fall asleep'] }] }
    ],
    rei: [
      { msgs: ['This is Kurogane.', 'The Director forced me to add you.', 'Do not send me stickers.'], replies: [{ t: '(Send a cat sticker.)', aff: 2, resp: ['…', 'Where did you get that sticker.', 'Send the rest of the pack.'] }, { t: 'Understood. Goodnight, Rei.', aff: 1, resp: ['…Goodnight.'] }] },
      { msgs: ['Are you awake.', 'The shadows are loud tonight.', 'Talk to me about something boring.'], replies: [{ t: 'Onigiri restocking procedure, step one…', aff: 3, resp: ['…', 'Continue.', "It's quiet now. Thank you, {name}."] }, { t: 'Want me to call?', aff: 2, resp: ['No.', '…Maybe. Just for a minute.'] }] },
      { msgs: ['Kuro followed me home.', 'She is on my bed.', 'I did not invite her. She is staying.'], replies: [{ t: 'Photo, please.', aff: 2, resp: ['[photo of a black cat judging the camera]', 'She says goodnight.'] }, { t: "Sounds like she chose you.", aff: 3, resp: ['…', 'Things keep choosing me lately.'] }] },
      { msgs: ['I played piano today. For the first time in years.', "Don't make it a big deal."], replies: [{ t: "It's a big deal, Rei.", aff: 3, resp: ['…', 'I know. Goodnight.'] }, { t: 'Play for me sometime?', aff: 3, resp: ['…Maybe. If you close your eyes.'] }] }
    ],
    mira: [
      { msgs: ['Medical Officer Solace here! 🩺', 'Did you eat dinner? Real dinner?', 'Be honest. I will know.'], replies: [{ t: "…It was a konbini sandwich.", aff: 2, resp: ['{name}!!!', "I'm bringing you a bento tomorrow. No arguments."] }, { t: 'Yes, doctor. Vegetables and everything.', aff: 1, resp: ['Hmm. Suspicious. But good!'] }] },
      { msgs: ['Long day in the med bay.', 'Hikari sprained her wrist punching a door. Don\'t ask.', 'How are YOU holding up?'], replies: [{ t: 'Tired, but good. How about you, Mira?', aff: 3, resp: ['Oh.', 'Nobody asks me that.', "…I'm tired too. But talking to you helps."] }, { t: 'All good! Thanks for checking.', aff: 1, resp: ["Anytime! That's my job ☺️"] }] },
      { msgs: ['You changed the dispatch rules today.', 'Fewer injuries. More rest time.', 'Was that… for me?'], replies: [{ t: 'For you.', aff: 4, resp: ['……', "I'm going to sleep now before I say something unprofessional.", 'Goodnight 💕'] }, { t: 'For the whole squad. But mostly you.', aff: 3, resp: ["Mostly me. Okay. I'll take mostly."] }] }
    ],
    kaede: [
      { msgs: ['yo', 'what was my time on the akiba call', 'be precise'], replies: [{ t: '4 minutes 12 seconds. New record.', aff: 3, resp: ['LET\'S GOOO', 'tell hikari', 'no wait dont', 'yes tell her'] }, { t: 'Go to sleep, Kaede.', aff: 1, resp: ['sleep is for slow people'] }] },
      { msgs: ['hikari caught me today', 'i didnt say thank you', 'how do u say thank you to someone u were rude to for 4 years'], replies: [{ t: 'Just say it. She\'ll understand.', aff: 3, resp: ['ugh fine', '…i said it', 'she cried. idiot. (i cried too dont tell)'] }, { t: 'Buy her ramen.', aff: 2, resp: ['genius', 'ok'] }] }
    ],
    tetsu: [
      { msgs: ['Good evening, Handler! 🙂', 'Kazuo (my bonsai) says goodnight.', 'He does not actually talk. But he would.'], replies: [{ t: 'Goodnight, Kazuo.', aff: 2, resp: ['He is very happy. 🌳'] }, { t: 'Goodnight, Tetsu. Good work today.', aff: 2, resp: ['Thank you! I only broke one door!'] }] },
      { msgs: ['My sister passed her exams!', 'Top of her class!', 'I cried in the training room. Hikari saw. She cried too.'], replies: [{ t: 'Congratulations! Tell her the whole squad is proud.', aff: 3, resp: ['I will!! She says thank you!!'] }, { t: "That's amazing, Tetsu.", aff: 2, resp: ['It is! Everything is amazing today!'] }] }
    ],
    sora: [
      { msgs: ['Handler~! 🌟', 'Is this your number? I bribed B.I.T. with a firmware update.'], replies: [{ t: "B.I.T. can be bribed?", aff: 2, resp: ['Everyone can be bribed, Handler~', '(with love)'] }, { t: 'Hi, Sora.', aff: 1, resp: ['Hiii! Goodnight! 🌙'] }] },
      { msgs: ['my manager left 14 voicemails', "i didn't listen to any of them", 'is that bad'], replies: [{ t: "It's healthy. You're allowed to rest.", aff: 3, resp: ['nobody ever tells me that', '…thank you. i needed that'] }, { t: 'Want me to listen to them for you?', aff: 2, resp: ['LOL', 'you would do that?? ok maybe one'] }] },
      { msgs: ["I'm writing a song.", "It's not for the fans. Is that selfish?"], replies: [{ t: "It's not selfish. It's yours.", aff: 3, resp: ['…mine.', 'i like how that sounds'] }, { t: 'Can I hear it someday?', aff: 3, resp: ['…only you. someday.'] }] }
    ]
  };
  function phoneFallback(who) {
    const P = { hikari: ['GOODNIGHT HANDLER ⚡⚡', 'i ate 4 onigiri in ur honor'], rei: ['…Goodnight.', 'Sleep. That is an order.'], mira: ['Hydrate. Sleep. Repeat. 💧', 'Goodnight, {name} 🌙'], kaede: ['yo. good shift today', 'night'], tetsu: ['Goodnight, Handler! 🌳'], sora: ['sweet dreams, Handler~ ⭐'] };
    return { msgs: P[who] || ['Goodnight!'], replies: [{ t: 'Goodnight. See you tomorrow.', aff: 1, resp: ['👋'] }] };
  }
  function feed(G) {
    const c = G.chap || 1, all = [];
    if (c >= 4) all.push({ u: 'NeoTokyo News', h: '@NTNews', a: '📰', c: '#444', t: 'CURFEW EXTENDED: Glass zones now cover 6% of Shibuya. HALO\'s Squad Zero leads citywide response.', l: 88000 }, { u: 'Sora ⭐', h: '@stargazer', a: '⭐', c: '#c9b6ff', t: 'Whatever happens: I\'m with Squad Zero. Thank you for all the love 💫', l: 440000 });
    if (c >= 3) all.push({ u: '???', h: '@glass_and_mirrors', a: '◇', c: '#7ff', t: 'Every door opens eventually.', l: 13 }, { u: 'HALO Official', h: '@HALO_Agency', a: '◎', c: '#1f5fd6', t: 'HALO is cooperating fully with the Board review. Dispatch continues uninterrupted.', l: 5400 });
    if (c >= 2) all.push({ u: 'Kaede 🌪', h: '@gale_fast', a: '🌪', c: '#5ef0a0', t: 'new squad. new record. old rival. whatever.', l: 12000 }, { u: 'Tetsu', h: '@bulwark_bonsai', a: '🌳', c: '#e0a060', t: '[photo of a bonsai] Kazuo turned 40 today 🎉', l: 31000 }, { u: 'NeoTokyo News', h: '@NTNews', a: '📰', c: '#444', t: '“Prism” art crimes continue: Ueno Park statue turned to glass overnight.', l: 22000 });
    all.push({ u: 'Hikari ⚡', h: '@thundergoddess', a: '⚡', c: '#ffcf3f', t: 'squad zero handler {name} is a GENIUS and i will not be taking questions', l: 900 + G.day * 211 }, { u: 'B.I.T.', h: '@bit_official', a: '🤖', c: '#52e0ff', t: `Beep! Squad Zero has resolved ${G.calls || 0} calls. Handler caffeine intake: concerning.`, l: 4410 }, { u: 'HeroStan_2009', h: '@herostan', a: '🌟', c: '#ff7aa8', t: 'HandlerZero is at HALO now and honestly squad zero dispatch is the best thing on HeroNet', l: 2103 });
    return all;
  }
  const credits = ['#HEARTLINE AGENCY', 'A Hero Handler Romance', '', '#Starring', 'Hikari Amane — Thunder Goddess', 'Rei Kurogane — Nightveil', 'Mira Solace — Halo Nurse', 'Kaede Mori — Gale', 'Tetsu Oda — Bulwark', 'Sora Hoshino — Stargazer', 'Kyouya Aoi — The Glazier', 'Director Aya Takamine', 'B.I.T.', 'and {name} — Handler', '', '#In memory of', 'Squad One', 'Natsuki Amane', '', '#Art', 'Procedural SVG anime sprites & backgrounds', '', '#Music & Sound', 'Procedural WebAudio compositions', '', '#Engine', 'Heartline VN + Dispatch Engine — handmade', '', '#Thank you for playing!', 'Squad Zero is always hiring.', '', '♥'];

  return { calls, callEvents, quips, synergy, items, profiles, trainQuip, giftLine, phone, phoneFallback, feed, credits };
})());

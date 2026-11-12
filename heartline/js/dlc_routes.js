/* HEARTLINE: HOME (DLC) — per-partner scenes, part one: Hikari and Rei.
   Labels are dlc_<scene>_<partner>; the shared spine reaches them with ['callf', 'dlc_<scene>_', 'route']. */
(() => {
  const H = 'hikari', R = 'rei', TE = 'tetsu', A = 'aya', B = 'bit', NA = 'natsuki', RI = 'rin', SH = 'shiori', KD = 'kid', K2 = 'kid2', REN = 'ren';
  const S = STORY.scripts, { kcg } = STORY.dlcK;
  const top = G => STORY.dlcTop(G), tw = G => G.flags.twokids;

  // ======================= HIKARI =======================
  S.dlc_us_hikari = [['n', "And Hikari and I: a year and eleven days. Every Sunday we eat at Ramen Raijin. Natsuki orders for us. She still orders wrong. Hikari still eats all of it, and then half of mine."]];
  S.dlc_late_hikari = [
    ['bg', 'rooftop'], ['music', 'romance'], ['tint', 'evening'],
    ['show', H, 'nervous', 'default', 'c'],
    ['say', H, "Can I say something? I practiced. I practiced on Tetsu's bonsai. He says Kazuo the Second is a very good listener."],
    ['say', H, "It isn't that I've waited a year. It's — okay. I've waited a year. Forty percent of a year. All of the year.", 'flustered'],
    ['say', H, "On the roof, at the end, you said the whole squad mattered. You were right. I don't want to be less of the squad. I just want to be the part of it you come home to.", 'love'],
    ['choice', [
      { t: 'Say yes.', then: [['set', 'route', H], ['set', 'late', 1], ['aff', H, 4], ['say', H, "Okay. Okay! I'm going to count to ten so I don't shout. One. Two. — I'm shouting. Sorry. I'm so happy. Sorry.", 'laugh']] },
      { t: '"I need to keep it the way it is. Family first."', then: [['say', H, "…Okay. Yeah. That's you. I knew that. I'm still glad I said it out loud.", 'crysmile'], ['n', "She stays on the roof with me until the lights come on across the city. We don't bring it up again. We don't need to."]] }
    ]],
    ['hideall'], ['tint', null]
  ];
  S.dlc_ring_hikari = [
    ['bg', 'ramen'], ['music', 'daily'], ['tint', 'evening'],
    ['n', "Ramen Raijin, Sunday, table three. Natsuki has seated us at table three every Sunday for a year because, she says, three is lucky. It isn't. She likes the view of the door."],
    ['show', NA, 'excited', 'wave', 'r'],
    ['say', NA, "Two specials, extra egg! I'll be in the back. Doing back things. Very far away. Not listening!", 'laugh'],
    ['hide', NA],
    ['n', "She is not in the back. She is behind the noren curtain. I can see her slippers."],
    ['if', G => G.flags.plan_bit, [['n', "At 6:02 it starts to rain. Page one was right."]]],
    ['show', H, 'nervous', 'default', 'c'],
    ['say', H, "Okay. So. I have to tell you something, and I practiced, and it's going to come out wrong anyway, so I'm just going to—"],
    ['t', "Her right hand is in her jacket pocket. She's counting under her breath. Twenty-nine. Thirty."],
    ['choice', [
      { read: 'hikari_count', t: '"You\'re counting. What number are you on?"', then: [['say', H, "Thirty-one. How do you always — okay. Thirty-one *days*. I've had it thirty-one days.", 'shocked'], ['aff', H, 2]] },
      { t: 'Put my box on the table first.', then: [['n', "I put the box on the table between the gyoza and the soy sauce. She stares at it like it's a live wire."], ['say', H, "…No. No, no, no. You can't. I was going to—", 'shocked']] },
      { t: 'Wait. Let her finish.', then: [['say', H, "I was going to do this at the memorial, and then I thought, Mom isn't dead, that's a weird place. So I picked here. Because here is where I found out she wasn't.", 'tender']] }
    ]],
    ['n', "She takes her hand out of her pocket. There's a ring box in it. Same shop as mine. The exact same box."],
    ['say', H, "…Did you go to the jeweler in Ginza? Second floor? The old man in the cardigan?", 'stunned'],
    ['me', "He said I was the second person this month to ask for a ring that won't conduct."],
    ['say', H, "I was the first person! That was me! He said, \"Lightning? Again?\" I thought he was just weird!", 'laugh'],
    ['cg', 'cg_dlc_ring_hikari'],
    ['n', "We open both boxes at the same time. Two rings, both non-conductive, both a little too big, because neither of us knew the other's size and both of us guessed generously."],
    ['say', H, "Partners. On the board and off it. I said no take-backs and I meant it. So — yes. Obviously yes. Is it yes for you? Say it out loud. I need data.", 'love'],
    ['me', "Yes."],
    ['say', H, "Okay. Okay.", 'crysmile'],
    ['sfx', 'glass'],
    ['n', "Behind the curtain, Natsuki drops an entire tray of bowls. Nobody is hurt. She comes out crying, with a dustpan, and hugs us both with the dustpan still in her hand."],
    ['cgoff'],
    ['show', NA, 'sob', 'cheer', 'r'],
    ['say', NA, "I wasn't listening! I heard everything! You have to ask my permission! Don't! I'll make it a whole thing! Yes!", 'crysmile'],
    ['hideall'], ['aff', H, 5], ['fam', 'home', 1], ['tint', null]
  ];
  S.dlc_plan_hikari = [['show', H, 'excited', 'point', 'c'], ['say', H, "I made a spreadsheet. Then I made a second spreadsheet to keep track of the first one. Also Mom wants to cater. We can't let Mom cater. I love her. She can't cater."], ['hide', H]];
  S.dlc_fav_hikari = [['show', H, 'tender', 'heart', 'c'], ['say', H, "The memorial. Where her name was. We cross it out every year now. I want to get married next to a name that's been crossed out. It's the happiest place I know."], ['hide', H]];
  S.dlc_eve_hikari = [['phone', H, { msgs: ["Are you awake? I can't sleep. I counted to four hundred.", "Mom's asleep on my couch. She came over to \"help me relax.\" She fell asleep in eleven minutes. She snores like a thunderstorm. I know where I get it from.", "Tomorrow. Partners."], replies: [{ t: "Count to five hundred. I'll stay on the line.", aff: 2, resp: ["Okay. You count too.", "…You fell asleep at two hundred and twelve. I heard you. Goodnight."] }, { t: 'No take-backs.', aff: 1, resp: ['No take-backs. ⚡'] }] }]];
  S.dlc_vow_hikari = [
    ['outfit', H, 'wedding'],
    ['n', "Hikari comes down the aisle on her mother's arm. Natsuki walks too fast, the way she walks into burning buildings. Hikari holds her back by the elbow and counts the steps under her breath."],
    ['show', H, 'nervous', 'shy', 'c'],
    ['say', H, "I wrote my vows. They were nine pages. Mom said one line. So. One line."],
    ['say', H, "I promise to tell you when I'm scared. Out loud. Before I get to ten. — That's it. That's the line. I cut the other nine pages. Your turn.", 'love'],
    ['choice', [
      { t: '"I promise to always know where you are, and only tell you where to go when you ask."', aff: { hikari: 2 }, then: [['say', H, "…You're going to make me count.", 'crysmile']] },
      { t: '"I promise to eat whatever your mother cooks. All of it. Forever."', then: [['say', H, "That's the most romantic thing anyone has ever said in this family.", 'laugh'], ['fam', 'home', 1]] },
      { read: 'hikari_count', t: '"When you count, I\'ll count with you. Every time. Out loud."', then: [['say', H, "…With me. Okay. Okay.", 'crysmile'], ['aff', H, 3], ['fam', 'home', 1]] }
    ]],
    ['cg', 'cg_dlc_wed_hikari'],
    ['n', "She laughs in the middle of the kiss, which is the most Hikari thing that could possibly happen, and somewhere above us a lightbulb pops from the static."],
    ['cgoff']
  ];
  S.dlc_night_hikari = [['bg', 'apartment'], ['tint', 'night'], ['show', H, 'sleepy', 'default', 'c'], ['say', H, "Mom took all the leftover cake. She said it's for the squad. The squad is her."], ['say', H, "Hey. We're married. I keep saying it to check it's still true. We're married. …Still true.", 'fond'], ['hide', H]];
  S.dlc_homep_hikari = [['show', H, 'excited', 'cheer', 'c'], ['if', G => G.flags.home === 'oba', [['say', H, "Over the konbini! Where we met! I can buy onigiri in my pajamas! That's the dream. That's my whole dream."]], [['if', G => G.flags.home === 'house', [['say', H, "A garden! I'll grow sunflowers. Mom's sunflowers, from the memorial. She says they've retired. They deserve a garden."]], [['say', H, "Eleven minutes from HQ! I'll never be late. I'm never late anyway. I'll be early-er."]]]]], ['hide', H]];
  S.dlc_cook_hikari = [['show', H, 'determined', 'fist', 'c'], ['say', H, "Mom's curry. The real recipe. I found it, in her handwriting. Step one says \"add a lot.\" Of *what*? It doesn't say!"], ['n', "We make the curry. It's grey. It tastes exactly like Natsuki's. Hikari eats three bowls and cries a little into the third one."], ['aff', H, 2], ['hide', H]];
  S.dlc_date_hikari = [['bg', 'arcade'], ['music', 'date'], ['show', H, 'determined', 'fist', 'c'], ['say', H, "The punching machine. I'm going to hit it at forty percent. Watch. Forty percent."], ['sfx', 'thunder'], ['shake', 1], ['n', "The score reads 999. The lights in the arcade flicker. The machine makes a sad noise and stops making any noise at all."], ['say', H, "…That was sixty. I'm sorry. We're paying for that. We're paying for that, right?", 'embarrassed'], ['n', "We pay for it. On the way home she holds my hand and keeps it at a very careful forty percent."], ['hide', H]];
  S.dlc_fight_hikari = [
    ['bg', 'apartment'], ['music', 'sad'], ['tint', 'night'],
    ['n', "Month eight. Hikari has taken every overtime call for six weeks. I find her at four a.m. asleep in the genkan in full uniform, one boot off, the other still laced."],
    ['show', H, 'tired', 'default', 'c'],
    ['say', H, "Sorry. Sorry. There was a call in Nerima and then another one and then a cat, and the cat was — it doesn't matter. I'm fine. I'm useful. I'm being useful."],
    ['me', "You've been home nine hours this week."],
    ['say', H, "If I'm not useful, then what am I? Mom was useful. Mom carried thirty-two people out. I'm just — I'm just keeping up.", 'hurt'],
    ['choice', [
      { t: '"You don\'t have to earn this. Coming home isn\'t a shift."', then: [['say', H, "…It isn't?", 'crysmile'], ['me', "It's the opposite of a shift."], ['fam', 'home', 2], ['aff', H, 2]] },
      { t: '"Then I\'ll take overtime too. We can see each other on calls."', then: [['say', H, "That's — that's the saddest joke you've ever made.", 'sad'], ['n', "She laughs and then she cries, and then we sit on the genkan floor together until the sun comes up, which is the actual answer."], ['fam', 'home', -1]] },
      { read: 'hikari_count', t: '"You\'re counting again. You\'ve been counting for six weeks."', then: [['say', H, "…Every call. I count to see if everybody comes out. I keep thinking if I stop, somebody won't. Mom went back in. She went back in and she didn't come out for seven years.", 'cry'], ['me', "You're not going back in alone. That's what I'm for."], ['fam', 'home', 2], ['aff', H, 3]] }
    ]],
    ['n', "She drops to four shifts a week. Natsuki hears about it and makes curry for everyone. It's grey. It helps."],
    ['hide', H], ['tint', null]
  ];
  S.dlc_news_hikari = [
    ['bg', 'apartment'], ['music', 'romance'],
    ['n', "I come home and there are six pregnancy tests lined up on the kitchen table like dominoes. Hikari is sitting in front of them with her hands folded."],
    ['show', H, 'nervous', 'shy', 'c'],
    ['say', H, "It isn't that I'm sure. It's — okay. I'm six tests sure. I bought one, and it said yes, and I thought, that's one opinion, so I bought five more, and they all agreed, and the man at the pharmacy said \"congratulations\" in a very tired voice."],
    ['say', H, "Also Mom knows. I didn't tell her. She saw the bag. She's on speakerphone right now. She's been on speakerphone for twenty minutes. Mom, say hi.", 'embarrassed'],
    ['say', NA, "(speakerphone) HI! CONGRATULATIONS! I'M NOT CRYING! I'M DRIVING!"],
    ['say', H, "She's not driving. She doesn't have a car.", 'laugh'],
    ['choice', [
      { t: 'Sit down next to her and count the tests out loud. Six.', then: [['say', H, "…Six. Yeah. Six.", 'crysmile'], ['aff', H, 2]] },
      { t: '"Natsuki. Hang up. Please."', then: [['say', NA, "(speakerphone) NEVER! — okay. Okay. I love you both. Goodbye!"], ['n', "She doesn't hang up. We can hear her singing to herself in the kitchen for another ten minutes."], ['fam', 'home', 1]] }
    ]],
    ['hide', H]
  ];
  S.dlc_labor_hikari = [['n', "Hikari counts out loud through every contraction. On every count of ten, every light in the maternity ward flickers. By midnight the hospital has switched to its backup generator and a technician is standing in the corridor looking personally betrayed."], ['n', "Natsuki stands in the hallway the whole time shouting encouragement like it's a rescue: \"Thirty-two people, kid! You can do one!\""]];
  S.dlc_hold_hikari = [
    ...kcg('cg_dlc_baby_hikari'),
    ['say', H, "Hi. Hi. I'm your — I'm Mama. I'm going to be very loud. Sorry in advance. Your grandma's louder.", 'crysmile'],
    ['n', "{kid}'s hair stands straight up off {kidP} head. It crackles. Hikari laughs so hard the lights flicker again."],
    ['cgoff'],
    ['show', NA, 'crysmile', 'heart', 'r'],
    ['say', NA, "Call me Natsuki. Or Captain. Not Grandma. Never Grandma. …Okay, Grandma. Just this once. Just for {kidO}."],
    ['hideall'], ['aff', H, 3]
  ];
  S.dlc_early_hikari = [['n', "Month two: every time {kid} cries, every light in the apartment flickers. Month three: we buy surge protectors. Month four: the microwave dies with dignity."], ['show', H, 'embarrassed', 'shy', 'c'], ['say', H, "That's my fault. Genetically. I'm so proud. I'm so sorry."], ['hide', H]];
  S.dlc_out_hikari = [['n', "At dinner Hikari checks her phone every four minutes, then falls asleep at the table before dessert with a breadstick in her hand. I carry her home. No Spark. Tetsu has been teaching me to lift with my legs."]];
  S.dlc_spark_hikari = [
    ['music', 'tension'],
    ['n', "{kid} is crying, the way you cry when you're five and a monster has stepped on your kingdom. And every lamp in the park switches on at two in the afternoon."],
    ['sfx', 'thunder'], ['flash', '#bff0ff'],
    ...kcg('cg_dlc_spark_hikari'),
    ['n', "Small bolts, thin as hair, jump from {kidP} fists to the swing chains, to the slide, to the lamp posts. Nobody's hurt. The swings are swinging by themselves."],
    ['say', H, "Hey. Hey. Look at me. We're going to count. Out loud. With me. One.", 'determined'],
    ['say', KD, "…One."],
    ['say', H, "Two. Three. — That's it. Four. Five.", 'tender'],
    ['n', "By ten, the lamps are off. {kid} is hiccupping. Hikari is holding {kidO} so tight {kidS} squeaks."],
    ['cgoff'],
    ['show', NA, 'awe', 'default', 'r'],
    ['say', NA, "She stood in the yard at four and shouted at a thunderstorm, you know. Hikari. And the storm shouted back. And she won, in her opinion.", 'laugh'],
    ['hideall'],
    ['bg', 'apartment'], ['tint', 'night'], ['music', 'night'],
    ['show', H, 'sad', 'default', 'c'],
    ['say', H, "Mom carried thirty-two people out of Shibuya and then she went back in. I've been proud of that my whole life. And I just realized I don't ever want {kidO} to go back in."],
    ['choice', [
      { t: '"Then we teach {kidO} to come back out. That\'s the part your mom taught you."', then: [['say', H, "…Coming back out. Yeah. That's the part.", 'crysmile'], ['fam', 'brave', 1]] },
      { t: '"{KidS} gets to decide. We just make sure {kidS} never decides alone."', then: [['say', H, "Partners. Even for {kidO}.", 'tender'], ['fam', 'kind', 1]] },
      { read: 'hikari_count', t: '"You counted with {kidO}. Nobody counted with you, at four."', then: [['say', H, "…No. Nobody did. Okay. Okay, I'm going to cry now. Sit here.", 'cry'], ['aff', H, 3], ['fam', 'home', 1]] }
    ]],
    ['hide', H], ['tint', null]
  ];
  S.dlc_a2_aqua_hikari = [['n', "Hikari reads every placard out loud. All of them. The jellyfish one twice."]];
  S.dlc_a2_fest_hikari = [['n', "Hikari wins the strength tester and gives the giant stuffed bear to {kid}, who gives it to Natsuki, who cries in front of the takoyaki stand."]];
  S.dlc_a2_snow_hikari = [['n', "Hikari builds a snowman that's a portrait of her mother. It's extremely accurate. Natsuki is offended and then takes forty photos of it."]];
  S.dlc_a2_beach_hikari = [['n', "Hikari tries to skip a stone and accidentally electrifies a wave. Several fish are briefly surprised. She apologizes to the ocean."]];
  S.dlc_a2_ferris_hikari = [['n', "At the top, Hikari counts the districts out loud. Twenty-three. She's been to a call in every one."]];
  S.dlc_more_hikari = [
    ['bg', 'apartment'], ['tint', 'evening'], ['show', H, 'nervous', 'default', 'c'],
    ['say', H, "I want to ask something big and I'm going to say it fast. Do you want another one? A sibling? I asked Mom and she said yes, but she's not the one who — you know. You get a vote. You get forty percent of the vote. Fifty. You get fifty."],
    ['choice', [
      { t: '"Yes."', then: [['set', 'more', 1], ['say', H, "Yes! Okay! I'm going to tell Mom. I'm not going to tell Mom. I'm telling Mom.", 'excited']] },
      { t: '"I think we\'re a complete set."', then: [['say', H, "Then it's the three of us. Four, with Mom. Five, with Mom's opinions.", 'laugh']] }
    ]],
    ['hide', H], ['tint', null]
  ];
  S.dlc_anniv_hikari = [
    ['bg', 'ramen'], ['music', 'romance'], ['tint', 'evening'],
    ['n', "Ten years. Ramen Raijin, table three. Natsuki seats us, orders wrong, and disappears into the back, actually into the back this time. Her hair has gone grey at the temples. She says it's static."],
    ['show', H, 'tender', 'default', 'c'],
    ['say', H, "Can I tell you something I figured out? It took me ten years, so be impressed."],
    ['say', H, "Every time I went in, you were the one outside. In the van. I always thought that was the easy part. And then {kid} had a fever last winter and you were on a call, and I sat by the bed all night with my phone, and I couldn't do anything, and I thought, oh. Oh, this is what he does. Every night.", 'sad'],
    ['choice', [
      { t: '"It\'s not so bad when you know they\'re coming back."', then: [['say', H, "You never knew that. Not once. You just acted like you did, on the radio, so we'd believe it.", 'crysmile']] },
      { read: 'hikari_count', t: '"I used to count, too. On the radio. Under my breath. I learned it from you."', then: [['say', H, "You — you *counted*? This whole time? For ten years?", 'stunned'], ['me', "Every call."], ['say', H, "…Okay. I'm going to need a minute. And a second bowl.", 'cry'], ['aff', H, 3]] }
    ]],
    ['say', H, "Ten years. Partners. Still no take-backs.", 'fond'],
    ['hide', H], ['tint', null]
  ];
  S.dlc_wait_hikari = [['show', H, 'scared', 'reach', 'c'], ['n', "Hikari arrives at a dead run, still in uniform, from a call across the city. She grabs {kid}, then me, then both of us at once."], ['say', H, "Now you know. What it's like when it's your person. I used to stand outside the memorial and yell at it. Waiting's just yelling with your mouth closed.", 'crysmile'], ['hide', H]];
  S.dlc_fin_hikari = [
    ['show', H, 'laugh', 'cheer', 'c'],
    ['say', H, "Everybody sit! Mom cooked! Everybody act surprised it's grey!"],
    ['hide', H],
    ['if', G => top(G) === 'brave', [['say', KD, "Grandma. I'm going to be a rescue hero. I'm going to carry out thirty-three people. One more than you."], ['say', NA, "Kid, I'll hold you to it. And then you come back out. That part's not optional."]]],
    ['if', G => top(G) === 'kind', [['say', KD, "I want to work at Aegis. With Shiori-san. The orange ones. The ones who stay with people until the ambulance comes."], ['say', NA, "Orange is the color of coming back, kid. Also it hides ketchup."]]],
    ['if', G => top(G) === 'curious', [['say', KD, "I'm going to be a Handler. Like Dad. I already have Vol. 7."], ['say', NA, "A Handler! In this family! Somebody who reads the briefings! Kyouya would be so proud.", 'crysmile']]],
    ...kcg('cg_dlc_fam_hikari'),
    ['n', "Natsuki takes the photo. She cuts off everyone's heads. Hikari frames it anyway."],
    ['if', tw, [['n', "*Hikari & {name}: partners, on the board and off it. Plus {kid}, plus {kid2}, plus one very loud grandmother.*"]], [['n', "*Hikari & {name}: partners, on the board and off it. Plus {kid}. Plus one very loud grandmother.*"]]],
    ['cgoff']
  ];

  // ======================= REI =======================
  S.dlc_us_rei = [['n', "And Rei and I: a year. She moved in over eight months, one box at a time, so slowly I didn't notice until her tea was in every cupboard. Receipt came with her. Receipt is fourteen and hates me a little less every day."]];
  S.dlc_late_rei = [
    ['bg', 'rooftop'], ['music', 'night'], ['tint', 'night'], ['fx', 'rain'],
    ['show', R, 'guarded', 'cross', 'c'],
    ['say', R, "I'm going to ask you something, and I'd like you to answer it like a call. Quickly. Without the face you're making now."],
    ['say', R, "Would you like to try being two people, instead of nine? Not instead. As well as.", 'blush'],
    ['choice', [
      { t: '"Yes."', then: [['set', 'route', R], ['set', 'late', 1], ['aff', R, 4], ['say', R, "…Good. That was fast. I'd like to sit here a while now and not talk about it.", 'halfsmile']] },
      { t: '"Nine is what I can do. I\'m sorry."', then: [['say', R, "Don't be. You answered quickly. That's all I asked.", 'tender'], ['n', "She leaves her umbrella with me, because I didn't bring one. She walks home in the rain and doesn't seem to mind."]] }
    ]],
    ['hideall'], ['fx', null], ['tint', null]
  ];
  S.dlc_ring_rei = [
    ['bg', 'rooftop'], ['music', 'night'], ['tint', 'night'], ['fx', 'rain'],
    ['n', "Every night at nine Rei goes up to the HQ roof to feed Receipt. Receipt is fourteen, half-blind, and still likes no one but Rei. I go up at 8:58."],
    ['show', R, 'surprised', 'cross', 'c'],
    ['say', R, "You're early. You're never early. Is something wrong?"],
    ['me', "It's raining."],
    ['say', R, "I'm aware it's raining. I'm standing in it.", 'deadpan'],
    ['n', "I put the umbrella over her, on her left. Her blind side. For three years she has stood on mine. Receipt walks out from under the water tank, looks at me with her one good eye, and climbs into my lap. She has never done that. Not once."],
    ['say', R, "…She's never done that.", 'stunned'],
    ['n', "I take the box out of my pocket. Rei goes very, very still. Under the umbrella, her shadow flickers at the edges, the way it does when she's holding something in."],
    ['say', R, "Is this a question? You haven't phrased it as a question."],
    ['choice', [
      { t: '"Will you marry me?"', then: [['say', R, "…Yes. I'd like that on the record. Yes.", 'blush']] },
      { read: 'rei_scarf', t: 'Wait. She\'s reaching for the end of her scarf.', then: [['n', "Her fingers find the end of her scarf. She holds it."], ['say', R, "Yes. I'm saying it before you ask, so it counts as mine.", 'tender'], ['aff', R, 2]] },
      { t: '"It\'s a question. Take as long as you want."', then: [['say', R, "I've had three years. I'm done taking long. Ask it properly."], ['me', "Will you marry me?"], ['say', R, "Yes.", 'halfsmile']] }
    ]],
    ['cg', 'cg_dlc_ring_rei'],
    ['n', "Her shadows, the ones she has held in for years, spill out across the whole roof all at once, climb the water tank and the antenna, and fold together over our heads into a second roof. The rain stops falling on us."],
    ['say', R, "That isn't control. I don't know what that is.", 'flustered'],
    ['me', "It's a yes."],
    ['say', R, "…It's a yes.", 'fond'],
    ['n', "Receipt sneezes. The ring is a plain band, dark, with nothing on it. She asked for nothing on it, two years ago, about something else entirely. I wrote it down."],
    ['cgoff'], ['hideall'], ['fx', null], ['tint', null], ['aff', R, 5], ['fam', 'home', 1]
  ];
  S.dlc_plan_rei = [['show', R, 'guarded', 'cross', 'c'], ['say', R, "I've made a list of people I can tolerate looking at me for an hour. It's short. You're on it twice."], ['say', R, "I want small. I want rain. I won't get rain. I'll get you. That's acceptable.", 'halfsmile'], ['hide', R]];
  S.dlc_fav_rei = [['show', R, 'halfsmile', 'default', 'c'], ['say', R, "The shrine. The steps are too steep for anyone to hurry. Good. For once I'd like nobody to hurry."], ['hide', R]];
  S.dlc_eve_rei = [['phone', R, { msgs: ['Are you awake.', 'That was a question. I left off the question mark because I knew you were.', 'Ren called. He\'s coming tomorrow. He asked if he could sit at the front. I said yes before I could think about it. I didn\'t flinch.', 'Go to sleep. That\'s an order. I\'m allowed to give them now.'], replies: [{ t: "I'm proud of you. About Ren.", aff: 2, resp: ["Don't make it a big deal.", "…It is a big deal. You're allowed to make it one. I said that once. I meant it."] }, { t: 'Yes, ma\'am.', aff: 1, resp: ["Don't.", '…Goodnight.'] }] }]];
  S.dlc_vow_rei = [
    ['outfit', R, 'wedding'],
    ['n', "In the front row sits Ren Ishida, who spent two months in hospital because of Rei's shadows when they were seventeen. His cane is across his knees. When she passes him she stops. He nods once. She keeps walking."],
    ['show', R, 'embarrassed', 'shy', 'c'],
    ['say', R, "Shiori picked the dress. I said I wouldn't wear white. She said it isn't white, it's \"pearl.\" I've been lied to by a professional."],
    ['say', R, "I don't like speeches. So my vows are questions. Will you let me cover your blind side? Will you tell me when I'm doing it too much? Will you stay, when I go quiet? …Those were my vows. You can answer all of them at once.", 'tender'],
    ['choice', [
      { t: '"Yes, yes, and yes."', aff: { rei: 2 }, then: [['say', R, "Efficient.", 'halfsmile']] },
      { read: 'rei_scarf', t: '"You reached for your scarf. You aren\'t wearing one. You meant every word."', then: [['say', R, "…I did. I still reach for it. Shiori said I'd need something to hold. She was right. I'm holding this instead.", 'crysmile'], ['n', "She takes my hand."], ['aff', R, 3], ['fam', 'home', 1]] },
      { t: '"One question back. Will you let me cover yours?"', then: [['say', R, "…Yes. Nobody's ever asked me that.", 'stunned'], ['fam', 'home', 1]] }
    ]],
    ['cg', 'cg_dlc_wed_rei'],
    ['n', "Her shadows lift every fallen petal off the ground and hold them in the air around us, very gently, like they're afraid of crushing them. Nobody gets hurt. Ren is the first one clapping."],
    ['cgoff']
  ];
  S.dlc_night_rei = [['bg', 'apartment'], ['tint', 'night'], ['show', R, 'tired', 'default', 'c'], ['say', R, "That was the longest anyone has ever looked at me. I survived. I'd like tea."], ['n', "She makes two cups without asking which I want, and pours a saucer of milk for Receipt, and sits down closer to me than she needs to."], ['hide', R]];
  S.dlc_homep_rei = [['show', R, 'halfsmile', 'cross', 'c'], ['if', G => G.flags.home === 'oba', [['say', R, "Over the konbini. We'll see the alley from the window. Receipt was born there. She'll want to visit. She'll pretend she doesn't."]], [['if', G => G.flags.home === 'house', [['say', R, "A garden. Receipt will murder something in it within a week and leave it on the step. It'll be a gift. Accept it graciously."]], [['say', R, "Near the tower. I can see the roof from the window. I'll pretend that isn't why I said yes."]]]]], ['hide', R]];
  S.dlc_cook_rei = [['n', "Rei cooks the way she fights: silently, exactly, with no wasted movement. She makes ochazuke with grilled salmon and the good tea. It's the best thing I've ever eaten. I tell her so. She says \"Don't,\" and puts more in my bowl."], ['aff', R, 2]];
  S.dlc_date_rei = [['bg', 'aquarium'], ['music', 'night'], ['show', R, 'tender', 'default', 'c'], ['n', "The aquarium's late hours, a Wednesday. Nobody else. Rei stands in front of the deep-sea tank, where everything glows a little because it's always dark down there."], ['say', R, "They make their own light. Down there nobody makes it for them."], ['n', "She takes my hand. In public. In an empty public, but still."], ['hide', R]];
  S.dlc_fight_rei = [
    ['bg', 'apartment'], ['music', 'sad'], ['tint', 'night'],
    ['n', "Month nine. Three nights a week Rei goes out on solo patrol and doesn't log it. She comes home at four with a bruise on her jaw and says it was nothing."],
    ['show', R, 'cold', 'cross', 'c'],
    ['say', R, "I work alone. I'm good at it. It's what I did before you, and it worked."],
    ['me', "It didn't work. It was penance."],
    ['say', R, "…Is that what you think? That I'm still paying for Ren?", 'glare'],
    ['choice', [
      { t: '"You don\'t have to protect me from you."', then: [['say', R, "…That's not fair. That's not fair, because it's true.", 'hurt'], ['fam', 'home', 2], ['aff', R, 2]] },
      { t: '"Fine. Then I\'ll stop asking."', then: [['n', "She goes still. The shadows in the corners of the room go still with her. She goes to bed without a word."], ['n', "The next night she doesn't go out. She sits on the end of the bed until I wake up. Then she says, \"Ask me again.\""], ['fam', 'home', -1]] },
      { read: 'rei_still', t: '"You went still just now. Something happened out there."', then: [['say', R, "…Tuesday. A man with a knife in Kabukicho. My shadows slipped. Just for a second. They nearly went through a girl standing behind him. Nearly.", 'scared'], ['say', R, "I've been going out to prove it won't happen again. I don't know how else to prove it.", 'cry'], ['me', "You don't prove it alone. You prove it with someone watching your blind side."], ['fam', 'home', 2], ['aff', R, 3]] }
    ]],
    ['n', "She logs every patrol after that. She takes Shiori with her twice a week. Shiori irons both their uniforms."],
    ['hide', R], ['tint', null]
  ];
  S.dlc_news_rei = [
    ['bg', 'apartment'], ['music', 'romance'],
    ['show', R, 'guarded', 'cross', 'c'],
    ['say', R, "How would you feel about a third person in the apartment."],
    ['me', "Receipt's already—"],
    ['say', R, "Not a cat.", 'flustered'],
    ['n', "There are four tests on the counter. Receipt is sitting on two of them."],
    ['say', R, "They agreed with each other. I'd like you to say something before I lose my nerve. I have one now, apparently. That's new.", 'nervous'],
    ['choice', [
      { t: 'Say nothing. Hold her.', then: [['n', "She lets me. For a long time. Then, into my shoulder: \"That counts as something.\""], ['aff', R, 2]] },
      { t: '"How do you feel?"', then: [['say', R, "Terrified. Happy. The second one is louder. I didn't know it could be.", 'crysmile'], ['fam', 'home', 1]] }
    ]],
    ['hide', R]
  ];
  S.dlc_labor_rei = [['n', "Rei doesn't make a sound for nine hours. Every shadow in the room gathers around the bed like a curtain, so thick the doctor can't see her own hands."], ['say', R, "Sorry. Sorry. I'm keeping it in."], ['me', "You don't have to."], ['n', "The shadows relax. They settle over everything like the dark in a room with the lights off, soft, quiet. The doctor works by feel. Rei breathes, finally, out loud."]];
  S.dlc_hold_rei = [
    ...kcg('cg_dlc_baby_rei'),
    ['say', R, "…So small. I could—", 'scared'],
    ['n', "She doesn't finish. She goes still. I put {kid} in her arms anyway."],
    ['say', R, "Oh.", 'stunned'],
    ['n', "Her shadows reach out from under the bed, and very carefully, tuck the corner of the blanket under {kidP} chin."],
    ['say', R, "…They did that on their own.", 'crysmile'],
    ['cgoff'],
    ['n', "Ren visits that afternoon with a terrible bunch of gas-station flowers. He leans his cane on the wall."],
    ['say', REN, "You're going to be good at this, Rei. You were always good at holding things. You just never believed it."],
    ['hideall'], ['aff', R, 3]
  ];
  S.dlc_early_rei = [['n', "{kid}'s shadow doesn't stay where it's supposed to. At month three it's under the crib while {kid} is on the changing table. Receipt watches it. Receipt hisses at nothing."], ['show', R, 'scared', 'default', 'c'], ['say', R, "Ah."], ['n', "That's all she says. She doesn't sleep that night. She sits by the crib with her hand on the rail and watches {kid}'s shadow the way she used to watch her own."], ['hide', R]];
  S.dlc_out_rei = [['n', "Rei doesn't check her phone once. She says she trusts the squad. At 9:41 I notice her shadow stretching across the restaurant floor in the direction of home. She sees me see it."], ['say', R, "It's not checking. It's… looking."]];
  S.dlc_spark_rei = [
    ['music', 'mystery'],
    ['n', "{kid}'s shadow has come loose. It's long and thin and it's dancing, by itself, across the sand. Before the hound landed, it pulled the three smallest kids out of the sandbox by their ankles. Nobody saw it happen except me."],
    ...kcg('cg_dlc_spark_rei'),
    ['n', "Now it won't come back. It's playing with one of Receipt's grandkittens, who came along in the picnic basket against everyone's advice."],
    ['say', KD, "It won't listen! Mom, it won't listen to me!"],
    ['n', "Rei is white. Rei is five years old in the training hall with a shadow that won't listen, and Ren is on the floor."],
    ['choice', [
      { t: '"Rei. Look at {kidO}. {KidS}\'s laughing."', then: [['n', "{kid} is crying and laughing at the same time, the way kids do. Rei sees the laughing half."]] },
      { read: 'rei_still', t: '"You\'re still. Breathe. It\'s not yours, and it\'s not out of control. It\'s playing."', then: [['n', "She breathes. Once. Twice."], ['aff', R, 2]] }
    ]],
    ['say', R, "Hey. Your shadow. It's yours. It listens if you ask it nicely. Ask it nicely.", 'tender'],
    ['say', KD, "…Please come back? You can play later."],
    ['n', "It comes back. It slides across the sand and tucks itself under {kidP} feet like a dog that's been called. The grandkitten looks betrayed."],
    ['say', R, "…Nobody told me that. Nobody ever told me I could ask.", 'cry'],
    ['cgoff'], ['hideall'],
    ['bg', 'apartment'], ['tint', 'night'], ['music', 'night'],
    ['show', R, 'guarded', 'cross', 'c'],
    ['say', R, "I was going to teach {kidO} control. Holding it in. That's all I know how to do."],
    ['choice', [
      { t: '"Teach {kidO} asking instead. You just did."', then: [['say', R, "Asking. All right. I'll have to learn it first.", 'halfsmile'], ['fam', 'kind', 1]] },
      { t: '"Teach both. Holding on when you have to. Asking when you can."', then: [['say', R, "Both. That's — more work. Fine.", 'smirk'], ['fam', 'brave', 1]] },
      { read: 'rei_scarf', t: 'Wait. She\'s holding the end of her scarf.', then: [['say', R, "When I was five, I wanted someone to be in the room who wasn't scared of me. I'd like to be that. For {kidO}. I'd like you to make sure I am.", 'crysmile'], ['aff', R, 3], ['fam', 'home', 1]] }
    ]],
    ['hide', R], ['tint', null]
  ];
  S.dlc_a2_aqua_rei = [['n', "Rei and {kid} stand by the deep-sea tank together for an hour, both very still, both in the dark, both grinning."]];
  S.dlc_a2_fest_rei = [['n', "Rei wins every prize at the shooting gallery and gives all of them to strangers' kids without a word, then walks away before anyone can thank her."]];
  S.dlc_a2_snow_rei = [['n', "Rei builds a snow cat. It looks exactly like Receipt. Including the expression."]];
  S.dlc_a2_beach_rei = [['n', "Rei holds an umbrella over {kid} all day. It doesn't rain. She holds it anyway."]];
  S.dlc_a2_ferris_rei = [['n', "At the top, Rei says, \"I used to watch the city alone from high places.\" A pause. \"This is better. Don't make it a big deal.\""]];
  S.dlc_more_rei = [
    ['bg', 'apartment'], ['tint', 'evening'], ['show', R, 'guarded', 'default', 'c'],
    ['say', R, "Question. Would you like another one. I'm asking because {kid} asked Receipt for a sibling, and Receipt is sixteen and has declined."],
    ['choice', [
      { t: '"Yes."', then: [['set', 'more', 1], ['say', R, "Good. I'd like that on the record.", 'halfsmile']] },
      { t: '"I think we\'re enough."', then: [['say', R, "We are. I wanted to hear you say it.", 'tender']] }
    ]],
    ['hide', R], ['tint', null]
  ];
  S.dlc_anniv_rei = [
    ['bg', 'rooftop'], ['music', 'night'], ['tint', 'night'], ['fx', 'rain'],
    ['n', "Ten years. The HQ roof, in the rain, at nine. Receipt died at nineteen, last spring, asleep in Rei's lap, purring. Her great-grandkitten lives under the water tank now and likes no one but {kid}."],
    ['show', R, 'tender', 'default', 'c'],
    ['say', R, "Can I ask you something I never asked? When I went quiet on comms. On a bad call. What was that like, on your side?"],
    ['choice', [
      { t: '"Like holding my breath until you breathed."', then: [['say', R, "…I'm sorry. I'm a little sorry.", 'sad']] },
      { read: 'rei_still', t: '"I could hear you go still. I knew what it meant. I used to talk anyway, so there\'d be something to come back to."', then: [['say', R, "That's why you always talked about the weather. On the worst calls. You'd tell me it was raining.", 'stunned'], ['me', "It was usually raining."], ['say', R, "…It was. I'd come back for the rain.", 'crysmile'], ['aff', R, 3]] }
    ]],
    ['say', R, "Ten years. I still don't like speeches. Here's one anyway. Thank you for staying on the line.", 'fond'],
    ['hide', R], ['fx', null], ['tint', null]
  ];
  S.dlc_wait_rei = [['n', "Rei's shadow reaches {kid} before she does. It wraps around {kidP} shoulders like a blanket. Then she's there."], ['show', R, 'hurt', 'default', 'c'], ['say', R, "Now you know what I used to put you through, every time I went silent on the line."], ['say', R, "Sorry. Don't make the face. I'm a little sorry.", 'crysmile'], ['hide', R]];
  S.dlc_fin_rei = [
    ['show', R, 'halfsmile', 'cross', 'c'],
    ['say', R, "Sit. Eat. Tea's in the pot. Ren, sit down, your knee. Tetsu, that's the cat's chair. — Everyone's here. Good."],
    ['hide', R],
    ['if', G => top(G) === 'brave', [['say', KD, "I'm going to work nights. Like Mom. Not alone, though. With a partner. I already asked Mika."]]],
    ['if', G => top(G) === 'kind', [['say', KD, "I want to teach the little ones whose shadows don't listen. Like Mom's apprentice. I'll tell them they can ask."]]],
    ['if', G => top(G) === 'curious', [['say', KD, "I want to be a Handler. I'll talk about the weather on the bad calls."], ['n', "Rei looks at me across the table. She doesn't say anything. Her shadow reaches under the table and holds my foot."]]],
    ...kcg('cg_dlc_fam_rei'),
    ['if', tw, [['n', "*Rei & {name}: a lamp left on in the window every night, for whoever's still out. Two small shadows that listen when they're asked.*"]], [['n', "*Rei & {name}: a lamp left on in the window every night, for whoever's still out.*"]]],
    ['cgoff']
  ];
})();

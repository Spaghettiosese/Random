/* HEARTLINE: HOME (DLC) — per-partner scenes, part two: Mira, Sora and Kaede. */
(() => {
  const M = 'mira', SO = 'sora', K = 'kaede', TE = 'tetsu', A = 'aya', B = 'bit', H = 'hikari', RI = 'rin', SH = 'shiori', KD = 'kid';
  const S = STORY.scripts, { kcg } = STORY.dlcK;
  const top = G => STORY.dlcTop(G), tw = G => G.flags.twokids;

  // ======================= MIRA =======================
  S.dlc_us_mira = [['n', "And Mira and I: a year of Saturdays, every one of them medically mandated. She hasn't moved a wound into herself in eleven months. She keeps count. So do I. We haven't told each other."]];
  S.dlc_late_mira = [
    ['bg', 'medbay'], ['music', 'romance'], ['tint', 'evening'],
    ['show', M, 'nervous', 'think', 'c'],
    ['say', M, "I've been taking care of you for a year. Medically. Your blood pressure's better. You eat lunch now, most days."],
    ['say', M, "I'd like to keep taking care of you. Unmedically. …That came out like a prescription. It's a confession. Do you need it in writing? I can put it in writing.", 'flustered'],
    ['choice', [
      { t: '"No need. Yes."', then: [['set', 'route', M], ['set', 'late', 1], ['aff', M, 4], ['say', M, "Oh. Good. Your pulse just went to a hundred and ten. That's the nicest thing a pulse has ever done for me.", 'crysmile']] },
      { t: '"I can\'t be one person\'s. Not yet. I\'m sorry."', then: [['say', M, "That's all right. That's an honest answer, and I'd rather have an honest one. Now sit down, I'm still taking your blood pressure.", 'tender'], ['n', "It's higher than she'd like. She writes it down and doesn't mention it."]] }
    ]],
    ['hideall'], ['tint', null]
  ];
  S.dlc_ring_mira = [
    ['bg', 'medbay'], ['music', 'night'], ['tint', 'night'],
    ['n', "22:40. The medbay, after a fourteen-hour shift. I bring dinner in a konbini bag: two bento, one strawberry mille-feuille. Mira is restocking a cabinet that is already full."],
    ['show', M, 'tired', 'default', 'c'],
    ['say', M, "Oh — hi. I'm almost done. I just want to get the gauze in order. And the tape. And the labels on the tape."],
    ['me', "How was today?"],
    ['say', M, "Fine — totally.", 'smile'],
    ['t', "The smile is mouth-only. The gauze was in order an hour ago. She has alphabetized the saline."],
    ['choice', [
      { read: 'mira_tidy', t: '"You\'re tidying."', then: [['say', M, "…A nine-year-old with burns. He'll be fine. He was so brave about it that I had to leave the room.", 'sad'], ['me', "Sit. Eat. I'll hold the tape."], ['aff', M, 2]] },
      { t: 'Take the tape out of her hands. "Dinner."', then: [['say', M, "That's assault on a medical professional. …Is that mille-feuille?", 'wry']] },
      { t: 'Start putting gauze away next to her.', then: [['n', "We put away gauze for ten minutes, side by side, without talking. It's what she needed. Then she stops on her own."]] }
    ]],
    ['n', "She sits on the edge of a bed. I sit on the stool where she's told me a hundred times to eat and sleep."],
    ['me', "I talked to Aya. I moved your Saturday shifts. All of them."],
    ['say', M, "All of this month's?", 'confused'],
    ['me', "All of them. Permanently. It's in the system."],
    ['n', "Then I put the box on the tray table, next to the blood pressure cuff."],
    ['say', M, "You — you're doing this *here*? At my work? Next to a defibrillator?", 'shocked'],
    ['me', "It seemed like the safest room in the city."],
    ['cg', 'cg_dlc_ring_mira'],
    ['n', "She laughs, then she cries, then she laughs at herself for crying, and then she picks up my wrist and takes my pulse."],
    ['say', M, "A hundred and thirty-four. You're terrified.", 'crysmile'],
    ['me', "Is that a yes?"],
    ['say', M, "It's a yes. It's every Saturday for the rest of my life. Medically and otherwise.", 'love'],
    ['n', "She keeps hold of my wrist the whole time. She says it's habit. It isn't."],
    ['cgoff'], ['hideall'], ['tint', null], ['aff', M, 5], ['fam', 'home', 1]
  ];
  S.dlc_plan_mira = [['show', M, 'smile', 'think', 'c'], ['say', M, "I've drawn up a schedule. Hair at seven. Ceremony at eleven. Fainting at eleven-oh-four. That's you. I've budgeted six minutes for it."], ['hide', M]];
  S.dlc_fav_mira = [['show', M, 'tender', 'default', 'c'], ['say', M, "The rooftop. I used to go up there to cry where nobody would ask me if I was fine. I'd like to give it a better memory."], ['hide', M]];
  S.dlc_eve_mira = [['phone', M, { msgs: ['Pre-op checklist.', '1. Have you eaten. 2. Have you had water. 3. Is the suit laid out. 4. Are you nervous.', 'Answer number four honestly.'], replies: [{ t: 'Yes, yes, yes. And yes.', aff: 2, resp: ['Good. Me too.', "It's the first time in my life I've been nervous about something good. I didn't know it would feel the same. It does."] }, { t: "I'm fine — totally.", aff: 1, resp: ["Don't you dare.", '…Okay, that was funny. Go to sleep.'] }] }]];
  S.dlc_vow_mira = [
    ['outfit', M, 'wedding'],
    ['n', "Mira walks down the aisle alone, by choice, and stops twice: once to fix Rin's collar, once to check that Tetsu has had water."],
    ['show', M, 'nervous', 'heart', 'c'],
    ['say', M, "I've spent my whole life taking other people's pain. I'm not going to promise to take yours. I'm going to promise something harder."],
    ['say', M, "I promise to let you take some of mine.", 'crysmile'],
    ['choice', [
      { t: '"Then I promise to ask. Every time. Even when you say you\'re fine."', aff: { mira: 2 }, then: [['say', M, "Especially then.", 'tender']] },
      { read: 'mira_tidy', t: '"I promise to notice when you start tidying."', then: [['say', M, "…You've always noticed. You were the first one who ever did.", 'cry'], ['aff', M, 3], ['fam', 'home', 1]] },
      { t: '"I promise to make you eat lunch. Sitting down."', then: [['say', M, "That's my line. You stole my line at my own wedding.", 'laugh'], ['fam', 'home', 1]] }
    ]],
    ['cg', 'cg_dlc_wed_mira'],
    ['n', "After the kiss she checks my pulse, in front of everyone. She announces the number. It gets a round of applause."],
    ['cgoff']
  ];
  S.dlc_night_mira = [['bg', 'apartment'], ['tint', 'night'], ['show', M, 'sleepy', 'default', 'c'], ['say', M, "Still elevated."], ['me', "It's been elevated since the vows."], ['say', M, "I know. I've been monitoring it. I'm going to monitor it for about fifty years.", 'fond'], ['hide', M]];
  S.dlc_homep_mira = [['show', M, 'smile', 'think', 'c'], ['if', G => G.flags.home === 'oba', [['say', M, "Over a konbini. Twenty-four-hour access to bandages, electrolytes and pudding. Clinically, it's ideal."]], [['if', G => G.flags.home === 'house', [['say', M, "A garden. I'll grow herbs. Medicinal ones. And strawberries. Also medicinal."]], [['say', M, "Eleven minutes from the medbay. Good. I mean that practically. I mean it a little badly, too."]]]]], ['hide', M]];
  S.dlc_cook_mira = [['n', "Mira cooks by dosage. Two hundred grams. Six minutes. Stir clockwise. One Saturday she makes a mille-feuille from scratch. It takes nine hours and three attempts and it's perfect, and she eats her half standing up, out of habit, until I pull out a chair."], ['aff', M, 2]];
  S.dlc_date_mira = [['bg', 'cafe'], ['music', 'date'], ['show', M, 'happy', 'default', 'c'], ['n', "Saturday. The café, then a movie. It's a hospital drama. That was a mistake, or a gift."], ['say', M, "That's not how you hold a scalpel. That's not where the liver is. Nobody's washed their hands in this entire hospital. — I'm sorry. I'm enjoying this so much.", 'laugh'], ['n', "She whispers corrections for two hours. A man in front of us turns around to complain and ends up asking her about his knee."], ['hide', M]];
  S.dlc_fight_mira = [
    ['bg', 'apartment'], ['music', 'sad'], ['tint', 'night'],
    ['n', "Month ten. Two a.m. The bathroom light is on. Mira is on the floor with her back against the tub, and her forearms are red to the elbow with burns that weren't there at dinner."],
    ['show', M, 'wince', 'default', 'c'],
    ['say', M, "I'm fine — totally. It arrives late. You know it arrives late. It'll be gone by morning."],
    ['me', "Whose is it?"],
    ['say', M, "…The nine-year-old's little sister. Same fire. She's six. I wasn't going to let a six-year-old feel that. I'd do it again.", 'hurt'],
    ['choice', [
      { t: '"Then next time, call me. I\'ll sit with you while it arrives."', then: [['say', M, "…You'd just sit there?", 'crysmile'], ['me', "I'm very good at sitting next to things I can't fix."], ['fam', 'home', 2], ['aff', M, 2]] },
      { t: '"You promised. Eleven months."', then: [['n', "She doesn't answer. She gets up, with her burned arms, and starts wiping down the sink."], ['n', "I take the cloth out of her hands and wipe the sink myself, badly, until she laughs at how badly. Then she lets me run the cold water over her arms."], ['fam', 'home', -1]] },
      { read: 'mira_tidy', t: '"You cleaned the kitchen twice tonight. I should have known then."', then: [['say', M, "You should have. I wanted you to. I can't ask. I've never been able to ask. So I tidy and I hope.", 'cry'], ['me', "Then I'll learn to read the kitchen."], ['fam', 'home', 2], ['aff', M, 3]] }
    ]],
    ['n', "We add a line to the Solace Protocol. It's one sentence: *The medic does not hurt alone.* Aya signs it without a word and has it laminated."],
    ['hide', M], ['tint', null]
  ];
  S.dlc_news_mira = [
    ['bg', 'office'], ['music', 'romance'],
    ['n', "A new entry appears in my calendar at 09:00, between a budget meeting and a fire drill. *Appointment: Dr. Solace. Re: a third person. Duration: about eighteen years.*"],
    ['bg', 'medbay'],
    ['show', M, 'nervous', 'think', 'c'],
    ['say', M, "I've known for nine days. I ran the bloodwork myself, twice, and then I had a colleague run it blind, because I don't trust my own objectivity on this one."],
    ['say', M, "I didn't know how to tell you without it sounding like a diagnosis. So I booked an appointment. That's worse, isn't it. That's much worse.", 'embarrassed'],
    ['choice', [
      { t: '"What\'s the prognosis, Doctor?"', then: [['say', M, "Excellent. The prognosis is excellent. The father is going to faint.", 'crysmile'], ['fam', 'home', 1]] },
      { t: 'Sit down on the stool before I fall on it.', then: [['say', M, "Head between your knees. Breathe. There you go. I budgeted for this.", 'laugh'], ['aff', M, 2]] }
    ]],
    ['hide', M]
  ];
  S.dlc_labor_mira = [['n', "Mira tries to run her own delivery. She corrects the IV placement. She asks for the chart. The obstetrician, who trained under her, says, \"Dr. Solace. Please. Be a patient.\""], ['say', M, "This one's mine. All of it. I'm not giving any of it to anyone. …Okay. I'd like to squeeze your hand until it breaks, though. Medically."]];
  S.dlc_hold_mira = [
    ...kcg('cg_dlc_baby_mira'),
    ['say', M, "Apgar nine. Nine! …Hi. I'm going to count your fingers. Ten. Toes. Ten. You're perfect. I'm not being objective. I don't care.", 'crysmile'],
    ['n', "She examines {kidO} for a full minute, professionally, and then her face just goes, and she's nobody's doctor at all."],
    ['cgoff'], ['aff', M, 3]
  ];
  S.dlc_early_mira = [['n', "{kid} doesn't flicker lights or float. Nothing happens. Mira checks, quietly, once a week, with a little test she doesn't think I notice: she lets {kidO} hold her finger when she has a paper cut."], ['show', M, 'guarded', 'default', 'c'], ['say', M, "Nothing yet. Maybe nothing ever. I'd be relieved. I think I'd be relieved. I don't know what I'd be."], ['hide', M]];
  S.dlc_out_mira = [['n', "Mira leaves the babysitters a three-page care sheet with a flowchart. At dinner she orders half a glass of wine. \"Medically,\" she says. By the second course she's laughing with her whole face."]];
  S.dlc_spark_mira = [
    ['music', 'tension'],
    ['n', "A boy from the sandbox fell running from the hound. His knee is open to the bone. {kid} is kneeling next to him with both hands on the knee, and the knee is closing."],
    ['show', M, 'scared', 'reach', 'c'],
    ['say', M, "No. No, no — {kid}, let go! Let *go*!"],
    ['hide', M],
    ...kcg('cg_dlc_spark_mira'),
    ['n', "The boy's knee is whole. He stops crying mid-breath, surprised. Mira has {kid} by the shoulders, checking {kidP} knees, waiting for the wound to come up on them, the way it would on her."],
    ['n', "It doesn't. Not there."],
    ['n', "My knee stings. I look down. A scrape, thin and shallow. Mira has the same one. So does the boy's mother, who was holding his hand. So does {kid}. Four small scrapes, in the same place, none of them worth a bandage."],
    ['say', KD, "I didn't want him to have all of it. So everybody got a little bit. Is that okay? Mama, is that okay?"],
    ['cgoff'],
    ['show', M, 'stunned', 'default', 'c'],
    ['say', M, "…It doesn't take. It shares. {KidS} split it between everyone who was touching. {KidS} can't do it alone. {KidS} can't even *try* to do it alone."],
    ['say', M, "Thirty years. I thought healing meant carrying it by yourself. And my {kidC} gets it right at five, in a sandbox.", 'cry'],
    ['hideall'],
    ['bg', 'apartment'], ['tint', 'night'], ['music', 'night'],
    ['show', M, 'tender', 'default', 'c'],
    ['say', M, "I was so afraid {kidS}'d get mine. I prayed for anything else. Lightning. Shadows. Nothing at all."],
    ['choice', [
      { t: '"{KidS} did get yours. The version you were supposed to have."', then: [['say', M, "…That's a terrible thing to say to someone at midnight. Come here.", 'crysmile'], ['fam', 'kind', 1]] },
      { t: '"Then we make sure there are always enough hands."', then: [['say', M, "A whole squad's worth. {KidS} has a whole squad's worth.", 'smile'], ['fam', 'brave', 1]] },
      { read: 'mira_tidy', t: '"You haven\'t tidied anything tonight."', then: [['say', M, "…No. I haven't. Look at that. The kitchen's a mess. I've never been so happy to see a dirty kitchen.", 'laugh'], ['aff', M, 3], ['fam', 'home', 1]] }
    ]],
    ['hide', M], ['tint', null]
  ];
  S.dlc_a2_aqua_mira = [['n', "Mira reads the jellyfish placard and says, clinically, \"No brain, no heart, and they're doing fine.\" Then she laughs at her own joke for ten minutes."]];
  S.dlc_a2_fest_mira = [['n', "Mira gives the second goldfish a name, a physical and a feeding schedule before we've left the stall."]];
  S.dlc_a2_snow_mira = [['n', "Mira wraps {kid} in so many layers {kidS} can't put {kidP} arms down. {KidS} wins anyway, by rolling."]];
  S.dlc_a2_beach_mira = [['n', "Mira lies on the cold sand with her eyes closed, and for three hours nobody in the world needs anything from her."]];
  S.dlc_a2_ferris_mira = [['n', "At the top Mira points out every hospital in the city. There are forty-one. She has worked in nine. She waves at one."]];
  S.dlc_more_mira = [
    ['bg', 'apartment'], ['tint', 'evening'], ['show', M, 'nervous', 'think', 'c'],
    ['say', M, "Medically, we'd want to decide this year. Emotionally — I'd like another one. I've wanted to say that for six months. I made a list of pros and cons. The cons column is empty. I checked it twice."],
    ['choice', [
      { t: '"Then let\'s fill in the pros."', then: [['set', 'more', 1], ['say', M, "I'll book the appointment. A real one, this time. Not in your calendar.", 'laugh']] },
      { t: '"I think my column says we\'re complete."', then: [['say', M, "Then that goes in the chart. Complete. I like that word. I never got to write it much.", 'tender']] }
    ]],
    ['hide', M], ['tint', null]
  ];
  S.dlc_anniv_mira = [
    ['bg', 'cafe'], ['music', 'romance'], ['tint', 'evening'],
    ['n', "Ten years. The café. Two strawberry mille-feuille. We work it out on a napkin: five hundred and twenty Saturdays. We've missed eleven. She can name every one and what the emergency was."],
    ['show', M, 'tender', 'default', 'c'],
    ['say', M, "I want to tell you something, as your physician. For years I patched up every hero who came through my door, and I knew exactly what had happened to each of them. I never once checked on the man who'd listened to it happen."],
    ['say', M, "You heard every one of those calls. Every scream on the line. You never came to the medbay. Not once. Where did you put it all?", 'sad'],
    ['choice', [
      { t: '"In the notebooks. Forty-six volumes."', then: [['say', M, "…I'd like to read them. All of them. Slowly. With you in the room.", 'crysmile'], ['fam', 'home', 1]] },
      { read: 'mira_tidy', t: '"Same place you did. I just tidy on paper."', then: [['say', M, "Oh. Oh, we're the same. We've been the same the whole time, and I had to marry you to diagnose it.", 'laugh'], ['aff', M, 3]] }
    ]],
    ['n', "She takes my wrist."],
    ['say', M, "Seventy-two. Resting. Look at that. It took ten years, but I got your heart rate down.", 'fond'],
    ['hide', M], ['tint', null]
  ];
  S.dlc_wait_mira = [['show', M, 'serious', 'default', 'c'], ['n', "Mira comes straight from the clinic. She checks Mika's ankle. She checks {kid}. Then she takes my wrist."], ['say', M, "A hundred and forty. Sit. Breathe. — Now you know what my waiting room feels like. Every day, somebody's whole person is on the other side of a door.", 'tender'], ['hide', M]];
  S.dlc_fin_mira = [
    ['show', M, 'happy', 'heart', 'c'],
    ['say', M, "Everyone washes their hands. Everyone sits. Tetsu, you're getting vegetables, don't look at me like that."],
    ['hide', M],
    ['if', G => top(G) === 'brave', [['say', KD, "I'm going to ride with Aegis. The ambulances. I'll be the one who holds hands in the back."]]],
    ['if', G => top(G) === 'kind', [['say', KD, "I'm going to work at Mama's clinic. But I need a team. I can't do mine alone. Mama says that's the whole point of it."]]],
    ['if', G => top(G) === 'curious', [['say', KD, "I'm going to be a Handler. I'll know who needs hands and where the hands are. Somebody has to know where the hands are."], ['n', "Mira looks at me over the rice. \"That's the most accurate description of your job anyone's ever given,\" she says."]]],
    ...kcg('cg_dlc_fam_mira'),
    ['if', tw, [['n', "*Mira & {name}: shared weight, carried together. Four pairs of hands at the table, and room for more.*"]], [['n', "*Mira & {name}: shared weight, carried together.*"]]],
    ['cgoff']
  ];

  // ======================= SORA =======================
  S.dlc_us_sora = [['n', "And Sora and I: a year in the magazines as \"Stargazer's Mystery Man.\" Nobody has a photograph. B.I.T. scrubs every one. She texts me at three a.m. in lowercase. I answer in full sentences. She says that's my stage voice."]];
  S.dlc_late_sora = [
    ['bg', 'apartment'], ['music', 'night'], ['tint', 'night'],
    ['phone', SO, { msgs: ['are you awake', 'i wrote a song', "it's about you. it's been about you for a year", "i won't put it out unless you say i can", "that's a question by the way"], replies: [{ t: 'Put it out. And come over.', resp: ['oh', 'okay', "i'm outside. i've been outside for twenty minutes"] }, { t: "It's a beautiful question. I can't answer it the way you want.", resp: ['yeah', "i thought maybe. it's okay", "it's still a good song. i'm keeping the song"] }] }],
    ['choice', [
      { t: 'Open the door.', then: [['set', 'route', SO], ['set', 'late', 1], ['aff', SO, 4], ['show', SO, 'shy', 'default', 'c'], ['say', SO, "hi. i'm in pajamas. this is the real me. it's worse than the poster.", 'fond'], ['hide', SO]] },
      { t: 'Leave it closed. Family first.', then: [['n', "I text her that the whole squad wants to hear it. She plays it for all of us on Friday, in the HQ kitchen, on Tetsu's guitar. Nobody asks who it's about."]] }
    ]],
    ['tint', null]
  ];
  S.dlc_ring_sora = [
    ['bg', 'dome'], ['music', 'night'], ['tint', 'night'],
    ['n', "The Dome, forty minutes after the last encore. Fifty thousand people have gone home. The crew is coiling cable. There's confetti in drifts on the floor."],
    ['show', SO, 'happy', 'wave', 'c'],
    ['say', SO, "Hiii~! Thank you for coming tonight! — sorry. it takes a while to come off. give me a second."],
    ['n', "She shakes her hands out like they're wet. Her shoulders drop five centimeters. Her voice comes down an octave."],
    ['say', SO, "okay. there. sit in A-one. front row. i want to sing you one with nobody else in the building.", 'tired'],
    ['n', "I sit in A-1. She sings the Dome song, the one the whole world knows, alone, with no track. Halfway through the second verse she stops."],
    ['say', SO, "no. wait. i'm doing it as her. i don't want to do this as her.", 'sad'],
    ['n', "She climbs down off the stage, floats the last meter, and sits on the edge with her legs hanging over, in a hoodie, with stage glitter still on one cheek."],
    ['choice', [
      { read: 'sora_stage', t: '"That one\'s real. The smile. It got to your eyes."', then: [['say', SO, "it did? i can't tell from inside. i've never been able to tell. you have to tell me.", 'stunned'], ['me', "I'll tell you. Every time."], ['aff', SO, 2]] },
      { t: 'Climb up and sit next to her.', then: [['n', "I've never been on a stage. From up here, fifty thousand empty seats look like the city at night from the van."]] },
      { t: '"I like the one who hums off-key better."', then: [['say', SO, "everybody else paid nine thousand yen for the other one.", 'wry']] }
    ]],
    ['n', "I take the box out. I don't kneel. There's nowhere to kneel that isn't confetti."],
    ['cg', 'cg_dlc_ring_sora'],
    ['say', SO, "…oh.", 'stunned'],
    ['say', SO, "you're asking the hoodie one. not the poster. you waited till i came down.", 'crysmile'],
    ['me', "I've only ever been asking the hoodie one."],
    ['say', SO, "yes. she says yes. the poster doesn't get a vote.", 'love'],
    ['n', "She's twenty centimeters off the stage and doesn't notice. I hold her hand so she doesn't drift."],
    ['cgoff'], ['hideall'], ['tint', null], ['aff', SO, 5], ['fam', 'home', 1]
  ];
  S.dlc_plan_sora = [['show', SO, 'deadpan', 'default', 'c'], ['say', SO, "no press. no drones. no magazine deal. they offered eighty million yen for the photos."], ['me', "Eighty—"], ['say', SO, "no.", 'smirk'], ['hide', SO]];
  S.dlc_fav_sora = [['show', SO, 'tender', 'default', 'c'], ['say', SO, "the beach. in november. nobody goes. i want to get married where nobody's watching except the people i want watching."], ['hide', SO]];
  S.dlc_eve_sora = [['phone', SO, { msgs: ['are you awake', 'i tried to write vows. they came out as a song. everything comes out as a song', 'is it okay if my vows are four lines', "they're off-key. on purpose"], replies: [{ t: 'Off-key is my favorite key.', aff: 2, resp: ["that's the corniest thing you've ever said", 'say it again tomorrow'] }, { t: 'Go to sleep, Stargazer.', aff: 1, resp: ['make me', '…okay that worked. goodnight'] }] }]];
  S.dlc_vow_sora = [
    ['outfit', SO, 'wedding'],
    ['n', "Sora doesn't walk down the aisle so much as forget to touch it. By the third row her feet are a hand's width off the ground. Kaede reaches up and tugs her back down by the hem."],
    ['show', SO, 'nervous', 'shy', 'c'],
    ['say', SO, "i wrote four lines. i'm going to sing them. badly. that's the vow. that you get the bad version. nobody else gets the bad version."],
    ['n', "She sings four lines. They are, objectively, a little flat. Rin starts to harmonize out of reflex and Tetsu puts a hand gently over her mouth."],
    ['choice', [
      { t: '"I promise to always be the one in the van."', aff: { sora: 2 }, then: [['say', SO, "my favorite seat in the house.", 'fond']] },
      { read: 'sora_stage', t: '"I promise to tell you which smile it is. Every day."', then: [['say', SO, "…which one is it now?", 'crysmile'], ['me', "The real one."], ['say', SO, "okay. good. i thought so. i wasn't sure.", 'love'], ['aff', SO, 3], ['fam', 'home', 1]] },
      { t: '"I promise never to sing in public."', then: [['say', SO, "that's the kindest thing you could do for my career.", 'laugh'], ['fam', 'home', 1]] }
    ]],
    ['cg', 'cg_dlc_wed_sora'],
    ['n', "When I kiss her we both leave the ground. Not far. Tetsu holds my ankle, just in case, and looks politely at the horizon."],
    ['cgoff']
  ];
  S.dlc_night_sora = [['bg', 'apartment'], ['tint', 'night'], ['show', SO, 'sleepy', 'default', 'c'], ['say', SO, "no cameras. not one. b.i.t. shot down two drones with a napkin launcher. it was the most romantic thing anyone's ever done for me."], ['say', SO, "also you. you're second.", 'fond'], ['hide', SO]];
  S.dlc_homep_sora = [['show', SO, 'smirk', 'default', 'c'], ['if', G => G.flags.home === 'oba', [['say', SO, "over a konbini. no photographer on earth would look for me over a konbini. it's perfect. i'm going to buy pudding at four a.m. in a face mask."]], [['if', G => G.flags.home === 'house', [['say', SO, "a garden. i'll sit in it in huge sunglasses like a retired actress with a secret."]], [['say', SO, "near hq. the van parks right there. i can see my favorite seat from the window."]]]]], ['hide', SO]];
  S.dlc_cook_sora = [['n', "Sora can't cook. She can, however, sing to the rice cooker, and claims it helps. The rice comes out perfect. I can't disprove it. We eat it with konbini curry and call it a recipe."], ['aff', SO, 2]];
  S.dlc_date_sora = [['bg', 'arcade'], ['music', 'idol'], ['show', SO, 'smirk', 'default', 'c'], ['n', "A karaoke box in Shimokitazawa. Sora in a cap, a mask and my jacket. She picks her own biggest hit and sings it as badly as she possibly can. The machine gives her forty-one points."], ['say', SO, "forty-one. i've never been so proud of anything.", 'laugh'], ['n', "The waiter recognizes her anyway, when he brings the fries. He doesn't say a word. She sings him one verse properly, quietly, as a tip. He has to sit down in the corridor."], ['hide', SO]];
  S.dlc_fight_sora = [
    ['bg', 'apartment'], ['music', 'sad'], ['tint', 'night'],
    ['n', "Month seven. A world tour. Nine months, thirty-one cities. The offer has been on the kitchen table for a week under a fruit bowl."],
    ['show', SO, 'smile', 'default', 'c'],
    ['say', SO, "i'm turning it down! it's fine. i want to be here. with you. it's an easy choice, honestly~"],
    ['t', "The smile doesn't reach her eyes, and the \"honestly\" came out in the stage voice. She hasn't used the stage voice on me in two years."],
    ['choice', [
      { t: '"Don\'t pick me instead of you. Pick both. We\'ll make both work."', then: [['say', SO, "…both.", 'stunned'], ['say', SO, "stellar told me for six years what i had to give up. i didn't notice i'd started doing it to myself.", 'cry'], ['fam', 'home', 2], ['aff', SO, 2]] },
      { t: '"Then go. I\'ll be fine."', then: [['say', SO, "that's *your* stage voice.", 'hurt'], ['n', "She's right. We stand in the kitchen, each wearing the wrong face, until one of us laughs. It's her. Then we sit down and actually read the offer."], ['fam', 'home', -1]] },
      { read: 'sora_stage', t: '"That\'s the stage smile. You want this tour."', then: [['say', SO, "…i want it so much. i wrote the setlist in my head on the train. and then i felt like a traitor.", 'cry'], ['me', "Wanting two things isn't treason."], ['fam', 'home', 2], ['aff', SO, 3]] }
    ]],
    ['n', "She does eighteen cities, not thirty-one. B.I.T. and I fly out for two legs. In Lisbon she spots the hired van outside the arena and sings the whole show looking at the parking lot."],
    ['hide', SO], ['tint', null]
  ];
  S.dlc_news_sora = [
    ['bg', 'apartment'], ['music', 'romance'], ['tint', 'night'],
    ['phone', SO, { msgs: ['are you awake', 'so. um', 'how do you feel about lullabies', "can you come home. i'm on the bathroom floor and i'm floating a little", "it's good floating"], replies: [{ t: 'Running.', resp: ["don't run. you'll trip. you always trip", 'okay run a little'] }, { t: 'How high?', resp: ['like a fist', 'i keep bumping the towel rail'] }] }],
    ['show', SO, 'crysmile', 'shy', 'c'],
    ['n', "She's sitting cross-legged in the air, a fist above the bath mat, holding a test in both hands like a microphone."],
    ['say', SO, "i can't get down. every time i think about it i go up again."],
    ['choice', [
      { t: 'Take her hand and pull her down, gently.', then: [['say', SO, "you're going to be doing that for nine months, you know.", 'fond'], ['aff', SO, 2]] },
      { t: '"Stay up there. I\'ll come to you."', then: [['n', "I stand on the edge of the bath. It's undignified. It's the right call."], ['fam', 'home', 1]] }
    ]],
    ['hide', SO], ['tint', null]
  ];
  S.dlc_labor_sora = [['n', "Sora keeps leaving the bed. Two nurses hold her down by the ankles, kindly, in shifts. She sings through every contraction, and by five in the morning the entire ward is humming the same four bars without knowing why."], ['say', SO, "this is the worst gig i've ever played. don't quote me. …okay, quote me."]];
  S.dlc_hold_sora = [
    ...kcg('cg_dlc_baby_sora'),
    ['say', SO, "hi. i'm your mom. i'm kind of famous. that isn't going to matter to you at all, is it. good.", 'crysmile'],
    ['n', "{kid} is howling. Sora hums, the way she hums when she's off the clock, wandering half a step under the note. {kid} stops at once and stares at her."],
    ['say', SO, "…oh no. {kidS} likes the bad version.", 'laugh'],
    ['cgoff'], ['aff', SO, 3]
  ];
  S.dlc_early_sora = [['n', "Month two. I go in at dawn and the crib is empty. {kid} is asleep on the ceiling, in the corner, like a balloon the morning after a party."], ['show', SO, 'embarrassed', 'shy', 'c'], ['say', SO, "that's mine. sorry. i mean — that's mine! look at {kidO} go."], ['n', "Tetsu installs a net. He tests it with his own body weight. It's the safest net in Tokyo."], ['hide', SO]];
  S.dlc_out_sora = [['n', "Sora wears the cap and the mask. A girl at the next table asks for an autograph anyway, apologizing. Sora signs the napkin: *a mom on her night off.* The girl reads it and cries a little and leaves us alone for the rest of dinner."]];
  S.dlc_spark_sora = [
    ['music', 'mystery'],
    ['n', "{kid} is a meter and a half above the sandbox, turning slowly, laughing, arms out. And twelve parents are filming."],
    ...kcg('cg_dlc_spark_sora'),
    ['say', KD, "Dad! Dad, look! I'm doing the ceiling thing outside!"],
    ['n', "Sora catches {kidO} by the ankle and reels {kidO} in. By the time we're home the video has four million views and a headline: STARGAZER'S SECRET CHILD? IS THIS THE MYSTERY MAN?"],
    ['cgoff'],
    ['bg', 'apartment'], ['tint', 'night'], ['music', 'sad'],
    ['show', SO, 'cold', 'default', 'c'],
    ['say', SO, "six years they sold every piece of me. my blood type. my breakfast. i swore they'd never get {kidO}."],
    ['choice', [
      { t: '"Then say that. Yourself. In your own voice, before they write it for you."', then: [['fam', 'brave', 1]] },
      { t: '"We could disappear for a while. The squad would cover."', then: [['say', SO, "hiding's still letting them pick where i stand. no. i've got a better idea.", 'determined'], ['fam', 'kind', 1]] },
      { read: 'sora_stage', t: '"Don\'t go out there as her. Go as you."', then: [['say', SO, "…as me. in sweatpants. god. they won't know what to do.", 'smirk'], ['aff', SO, 3], ['fam', 'home', 1]] }
    ]],
    ['bg', 'stage'], ['music', 'romance'], ['tint', null],
    ['n', "She holds a press conference the next morning. No makeup. A hoodie. No \"Hiii~.\" She reads one sentence off her phone in the flat, tired, funny voice nobody outside the squad has ever heard."],
    ['say', SO, "this is my kid. {kidS}'s not content. you can have the songs, you've always had the songs. you don't get {kidO}. thanks for coming.", 'serious'],
    ['n', "It's eleven seconds long. It becomes the most-watched thing she's ever done. The next week three other idols say the same sentence about their own kids."],
    ['hide', SO]
  ];
  S.dlc_a2_aqua_sora = [['n', "Sora hums at the whale shark. It turns around. She takes full credit."]];
  S.dlc_a2_fest_sora = [['n', "Sora goes in disguise. Everybody knows. Nobody says a thing. The takoyaki man gives her a free tray and a very slow wink."]];
  S.dlc_a2_snow_sora = [['n', "Sora lets {kid} tow her across the frozen pond by a scarf, like a balloon on a string."]];
  S.dlc_a2_beach_sora = [['n', "Sora writes a whole song in the wet sand and lets the tide take it before anyone can hear it. She says some of them are just for the sea."]];
  S.dlc_a2_ferris_sora = [['n', "At the top, Sora sings one line out the window. It's flat. Far below, a car alarm goes off in harmony."]];
  S.dlc_more_sora = [
    ['bg', 'apartment'], ['tint', 'evening'], ['show', SO, 'shy', 'default', 'c'],
    ['say', SO, "i want another one. i want a band. a small one. a duo. no — a trio. with us it's a quartet. is a quartet too many."],
    ['choice', [
      { t: '"A quartet\'s a classic."', then: [['set', 'more', 1], ['say', SO, "okay. okay! i'm floating. hold my sleeve.", 'love']] },
      { t: '"I like the trio."', then: [['say', SO, "trios are harder to break up. good call.", 'fond']] }
    ]],
    ['hide', SO], ['tint', null]
  ];
  S.dlc_anniv_sora = [
    ['bg', 'street_night'], ['music', 'night'], ['tint', 'night'],
    ['n', "Ten years. She doesn't want a restaurant. She wants the dispatch van, parked behind HQ, with the heater on and two konbini puddings."],
    ['show', SO, 'tender', 'default', 'c'],
    ['say', SO, "every show for ten years, i've looked for the van. you're always out there. three hours. i never asked what you do in here the whole time."],
    ['choice', [
      { t: '"I listen. The sound comes through the wall of the arena. I know every show by its bass line."', then: [['say', SO, "…you've never seen a single one. you've only heard them through a wall.", 'stunned'], ['me', "I've seen the one that matters. The pajamas tour."], ['say', SO, "limited run. one seat.", 'crysmile']] },
      { read: 'sora_stage', t: '"I wait for the walk back. When the face comes off. That\'s the part I came for."', then: [['say', SO, "the walk from the stage door to the van. that's the only part i never had to rehearse.", 'cry'], ['aff', SO, 3]] }
    ]],
    ['say', SO, "ten years. still my favorite audience. you still don't clap.", 'fond'],
    ['hide', SO], ['tint', null]
  ];
  S.dlc_wait_sora = [['n', "Sora comes down out of the sky. She flew the whole way, which she never does, because of the photographs. She lands in her socks."], ['show', SO, 'scared', 'reach', 'c'], ['say', SO, "now you know what it's like. the whole show, looking for one face.", 'crysmile'], ['hide', SO]];
  S.dlc_fin_sora = [
    ['show', SO, 'happy', 'wave', 'c'],
    ['say', SO, "i sang to the rice. it's perfect. nobody's allowed to say it's a coincidence."],
    ['hide', SO],
    ['if', G => top(G) === 'brave', [['say', KD, "I'm going to do high-rise rescue. The window-washer stuff. I'm not scared of up. Up is where I live."]]],
    ['if', G => top(G) === 'kind', [['say', KD, "I want to do what Mom did at the press thing. For other kids. Tell people they're not content."]]],
    ['if', G => top(G) === 'curious', [['say', KD, "I'm going to be a Handler. I'll park outside Mom's shows and run the city from there."], ['say', SO, "two vans. i'm going to have to look at two vans. i'll go cross-eyed.", 'laugh']]],
    ...kcg('cg_dlc_fam_sora'),
    ['if', tw, [['n', "*Sora & {name}: an idol, a Handler, and a quartet that only plays at home, off-key, on purpose.*"]], [['n', "*Sora & {name}: an idol, a Handler, and a lullaby sung off-key on purpose.*"]]],
    ['cgoff']
  ];

  // ======================= KAEDE =======================
  S.dlc_us_kaede = [['n', "And Kaede and I: a year of walking. She still runs to work. She walks home with me. She says the walk home is the only thing she's ever done slowly on purpose, and she's getting good at it."]];
  S.dlc_late_kaede = [
    ['bg', 'park'], ['music', 'romance'], ['tint', 'evening'],
    ['show', K, 'nervous', 'hip', 'c'],
    ['say', K, "I'm saying this fast, because if I say it slow I'll chicken out. I like you. I've liked you since the stopwatch thing. Don't make the face."],
    ['say', K, "I'm going to walk away now. Slowly. So you can catch up. If you want to. No pressure. Some pressure.", 'flustered'],
    ['choice', [
      { t: 'Catch up.', then: [['set', 'route', K], ['set', 'late', 1], ['aff', K, 4], ['n', "She's made it four steps. Four very slow steps. Her heel isn't tapping."], ['say', K, "…Took you long enough. Three point one seconds. I counted.", 'crysmile']] },
      { t: 'Let her go. Family first.', then: [['n', "She gets to the gate, turns around, and gives me a thumbs-up that takes real effort. The next morning she beats me to HQ by two hours and has left coffee on my desk. We're fine. She makes sure of it."]] }
    ]],
    ['hideall'], ['tint', null]
  ];
  S.dlc_ring_kaede = [
    ['bg', 'park'], ['music', 'daily'], ['tint', 'evening'],
    ['n', "Ueno Park, six in the evening. Kaede wants to race to the gate. Loser buys sneakers. I have lost this race two hundred and six times. I own a lot of sneakers that aren't mine."],
    ['show', K, 'smirk', 'hip', 'c'],
    ['say', K, "I'll give you a head start. Ninety seconds. That's generous. That's insultingly generous. Go."],
    ['n', "I jog. Badly. She waits the full ninety, because she's honest about a clock. Then there's a gust of wind and a green blur and she's gone."],
    ['hide', K],
    ['t', "What she doesn't know: I was here at five. The box is already at the gate, on the ground, on the finish line. Fast heroes arrive first and have to watch. I wanted her to arrive first, once, and find something good."],
    ['n', "It takes me four minutes to get there. She's standing at the gate, not moving, looking down."],
    ['show', K, 'stunned', 'shy', 'c'],
    ['cg', 'cg_dlc_ring_kaede'],
    ['say', K, "I got here first."],
    ['me', "You always do."],
    ['say', K, "I got here first and I had to *wait.* Four minutes. I didn't touch it. I just stood here. Do you know what four minutes is, to me? It's a week.", 'crysmile'],
    ['choice', [
      { read: 'kaede_heel', t: '"Your heel isn\'t tapping."', then: [['say', K, "…Huh. It's not. I didn't want to be anywhere else. That's never happened.", 'stunned'], ['aff', K, 2]] },
      { t: '"What did you think about, for four minutes?"', then: [['say', K, "Everything. One thing. You, jogging. You run like a filing cabinet falling down stairs.", 'laugh']] },
      { t: 'Pick up the box and open it.', then: [['n', "I'm out of breath. I open it anyway."]] }
    ]],
    ['say', K, "Yes. Fast answer. Fastest answer I've ever given. — No, wait. Ask me. I want to hear the question slow.", 'love'],
    ['me', "Will you marry me?"],
    ['say', K, "……Yes.", 'fond'],
    ['n', "She leaves a pause in it on purpose. It's the longest pause I've ever heard her make. She buys the sneakers anyway. She says a bet's a bet."],
    ['cgoff'], ['hideall'], ['tint', null], ['aff', K, 5], ['fam', 'home', 1]
  ];
  S.dlc_plan_kaede = [['show', K, 'excited', 'point', 'c'], ['say', K, "Short ceremony. Thirty minutes. Twenty. Fifteen. — No. Wait. Long. I want it long. I want to stand still next to you for a really long time. Is that weird? That's weird. Write it down."], ['hide', K]];
  S.dlc_fav_kaede = [['show', K, 'fond', 'hip', 'c'], ['say', K, "The park gate. The finish line. The one time I got somewhere first and it was good."], ['hide', K]];
  S.dlc_eve_kaede = [['phone', K, { msgs: ['cant sleep. ran to yokohama and back', 'ok thats a lie i ran to shinagawa', '1h02 round trip. personal worst. kept stopping to look at stuff', 'is that what happy is? stopping to look at stuff?'], replies: [{ t: "Yes. That's what it is.", aff: 2, resp: ['huh', 'ok. see you tomorrow. ill be the one standing still'] }, { t: 'Go to bed, Gale.', aff: 1, resp: ['race you there', 'i win. obviously. night'] }] }]];
  S.dlc_vow_kaede = [
    ['outfit', K, 'wedding'],
    ['n', "Kaede comes down the aisle at a walk. An actual walk. It's the slowest anyone here has ever seen her move, and Hikari has her phone out to time it. Fifty-eight seconds."],
    ['show', K, 'nervous', 'shy', 'c'],
    ['say', K, "I'm not good at this. I'm good at being first. So here's the vow."],
    ['say', K, "I promise to get there second. With you. Every time. …Except cake. I'm getting to the cake first. That's not negotiable.", 'smirk'],
    ['choice', [
      { t: '"I promise to always be worth waiting four minutes for."', aff: { kaede: 2 }, then: [['say', K, "Five. I'd do five. Don't tell anyone.", 'fond']] },
      { read: 'kaede_heel', t: '"I promise to notice when your heel starts tapping, and ask where you want to run."', then: [['say', K, "…And then run with me? You can't run.", 'crysmile'], ['me', "I'll walk very fast."], ['aff', K, 3], ['fam', 'home', 1]] },
      { t: '"I promise to lose every race and buy every pair of sneakers."', then: [['say', K, "That's not a vow. That's just a fact.", 'laugh'], ['fam', 'home', 1]] }
    ]],
    ['cg', 'cg_dlc_wed_kaede'],
    ['n', "She kisses me before the officiant finishes the sentence. Of course she does. Then she goes back and waits for the sentence to end, and does it again, properly, at the right time."],
    ['cgoff']
  ];
  S.dlc_night_kaede = [['bg', 'apartment'], ['tint', 'night'], ['show', K, 'sleepy', 'default', 'c'], ['say', K, "I ran that bus down in a wedding dress. Personal best, for a dress."], ['say', K, "I'm tired. I'm never tired. I think I'm just… done going places, today. I'm already where I was going.", 'fond'], ['hide', K]];
  S.dlc_homep_kaede = [['show', K, 'smirk', 'hip', 'c'], ['if', G => G.flags.home === 'oba', [['say', K, "Over the konbini. Six seconds to the ice-cream freezer. I timed it. Four, if Mr. Oba leaves the door open."]], [['if', G => G.flags.home === 'house', [['say', K, "Koenji. I can run the canal every morning. Then walk it back with you. Best of both."]], [['say', K, "Two stations out. I can beat the train. I've beaten the train. The driver waves now."]]]]], ['hide', K]];
  S.dlc_cook_kaede = [['n', "Kaede cooks fast. Everything at once, on high. The smoke alarm goes twice. What comes out is fried rice that is somehow exactly right. \"Speed's a technique,\" she says, fanning the alarm with a dish towel."], ['aff', K, 2]];
  S.dlc_date_kaede = [['bg', 'street_night'], ['music', 'date'], ['tint', 'evening'], ['show', K, 'happy', 'default', 'c'], ['n', "The date is a walk. That's all of it. Nine kilometers across the city at my pace, stopping at anything she points at."], ['say', K, "There's a taiyaki shop here. Has this always been here? I've passed this corner four hundred times. I was doing eighty."], ['n', "She buys six. She eats them one at a time. She reads the whole menu on the wall, out loud, like it's a novel."], ['hide', K], ['tint', null]];
  S.dlc_fight_kaede = [
    ['bg', 'apartment'], ['music', 'sad'], ['tint', 'night'],
    ['n', "Month six. In one week Kaede has suggested we move to Osaka, adopt a greyhound, take up rock climbing and quit HALO to open a shoe store. Tonight she has the lease forms for Osaka printed out."],
    ['show', K, 'excited', 'point', 'c'],
    ['say', K, "It's a great city! Good food, flat, you can run the river — we could be there by the first. I already called a mover. He does same-day."],
    ['t', "Her heel is going against the floor so fast the cups on the shelf are ringing."],
    ['choice', [
      { t: '"Slow down. What are you running from?"', then: [['say', K, "I'm not — I don't —", 'hurt'], ['n', "The heel stops. When Kaede goes slow, it scares everybody. It scares me now."], ['say', K, "…Monday. Pile-up on the Wangan. I got there first. Forty seconds before anyone. There was a guy in a car and I couldn't get the door. I just stood there. Again.", 'cry'], ['fam', 'home', 2], ['aff', K, 2]] },
      { t: '"Okay. Osaka. Let\'s go."', then: [['n', "We get as far as Shin-Osaka station. She stands on the platform for a long minute, not moving. Then she buys two tickets home and tells me about the Wangan pile-up somewhere around Nagoya."], ['fam', 'home', -1]] },
      { read: 'kaede_heel', t: '"Your heel\'s been going for a week. Since Monday."', then: [['say', K, "…You clocked it to the day.", 'stunned'], ['say', K, "Wangan. Monday. I was first. There was a guy in a car and I couldn't open the door. I held his hand through the window till Tetsu came. Forty seconds. That's so long. You have no idea how long that is.", 'cry'], ['me', "You held his hand. That's not standing there."], ['fam', 'home', 2], ['aff', K, 3]] }
    ]],
    ['n', "The man from the car sends a card. It's addressed to \"the green one who stayed.\" She puts it on the fridge. We don't move to Osaka. We do get a second pair of running shoes for me."],
    ['hide', K], ['tint', null]
  ];
  S.dlc_news_kaede = [
    ['bg', 'apartment'], ['music', 'romance'],
    ['n', "06:10. Kaede's morning ten kilometers takes her twenty-two minutes. Today she's back in nine. She walked back. I can tell from the window: she's walking."],
    ['show', K, 'stunned', 'default', 'c'],
    ['say', K, "I stopped at two K. I just stopped. I stood on the canal path, and my legs said no. Not tired. Just — no."],
    ['say', K, "So I went to the pharmacy. Ran there. Bought the test. Walked back. I'm going slow for two.", 'crysmile'],
    ['choice', [
      { t: '"How slow?"', then: [['say', K, "Like, nine-minute kilometers. Like a *person.* It's awful. It's the best thing that's ever happened to me.", 'laugh'], ['fam', 'home', 1]] },
      { t: 'Hand her my slow, terrible running shoes.', then: [['say', K, "…Are you offering to pace me? You? I'm going to cry on a shoe.", 'cry'], ['aff', K, 2]] }
    ]],
    ['hide', K]
  ];
  S.dlc_labor_kaede = [['n', "It takes forty minutes. Start to finish. The midwife says it's the fastest first labor she's seen in thirty years. Kaede, between breaths, says, \"Obviously.\""], ['n', "I almost miss it. I'm coming from HQ on foot, because the trains are stopped, running like a filing cabinet falling down stairs. I get there with ninety seconds to spare. Kaede says she held on for me. I believe her."]];
  S.dlc_hold_kaede = [
    ...kcg('cg_dlc_baby_kaede'),
    ['say', K, "…{KidS}'s so slow.", 'stunned'],
    ['say', K, "Everything about {kidO}. The blinking. The breathing. Look at that yawn. That yawn took four seconds. I could watch this for a year.", 'crysmile'],
    ['n', "She does. She doesn't look up for an hour. I've never seen her still for an hour."],
    ['cgoff'], ['aff', K, 3]
  ];
  S.dlc_early_kaede = [['n', "Kaede waits for {kid} to be fast. At four months {kidS} isn't. At eight months {kidS} isn't. At a year, {kid} takes a first step: one, very careful, looking at everything on the way."], ['show', K, 'crysmile', 'default', 'c'], ['say', K, "That's — okay. That's fine. That's good. I don't know why I'm crying. Shut up. Nobody look at me."], ['hide', K]];
  S.dlc_out_kaede = [['n', "Kaede times the appetizers. Then she stops timing. By dessert the stopwatch is face-down next to the salt. We leave it on the table. She never goes back for it."]];
  S.dlc_spark_kaede = [
    ['music', 'mystery'],
    ['n', "Nothing is happening. No lightning, no shadows. {kid} is standing in the sand with a notebook, writing."],
    ...kcg('cg_dlc_spark_kaede'),
    ['say', KD, "The air got wobbly over the castle. Like on a hot road. So I told Mika and Jun and the little one to come see my bug. There wasn't a bug. I just wanted them out of the sandbox."],
    ['n', "I check the time on the nearest parent's video. {kid} moved the three other kids out of the sandbox eleven seconds before the crack opened. Before Kaede felt it. Before anyone."],
    ['cgoff'],
    ['show', K, 'stunned', 'default', 'c'],
    ['say', K, "{KidS} saw it first. Before me. I'm the fastest thing in this city and my {kidC} beat me by eleven seconds standing still."],
    ['n', "At registration the next week the clerk at Window 3 runs the test twice. No Spark. None at all. Spark-negative, like {kidP} father."],
    ['hideall'],
    ['bg', 'apartment'], ['tint', 'night'], ['music', 'night'],
    ['show', K, 'sad', 'default', 'c'],
    ['say', K, "I was scared {kidS}'d be fast. Fast kids get there first. And then they stand there and watch."],
    ['say', K, "{KidS}'s not fast. {KidS}'s you. {KidS} gets there *before* first. {KidS} just looks.", 'crysmile'],
    ['choice', [
      { t: '"{KidS} got your eyes, though. You notice everything. You just do it at two hundred an hour."', then: [['say', K, "…I do notice stuff. Nobody ever says that. They just say fast.", 'fond'], ['fam', 'curious', 1]] },
      { t: '"{KidS}\'ll need someone fast to send. One day."', then: [['say', K, "I'm going to be so old. I'm going to be the oldest fast person alive. Fine. Deal.", 'laugh'], ['fam', 'brave', 1]] },
      { read: 'kaede_heel', t: '"You haven\'t tapped once since the park."', then: [['say', K, "No. I keep wanting to stand where {kidS}'s standing and see what {kidS} sees. It takes forever. I love it.", 'crysmile'], ['aff', K, 3], ['fam', 'home', 1]] }
    ]],
    ['hide', K], ['tint', null]
  ];
  S.dlc_a2_aqua_kaede = [['n', "Kaede races the sailfish along the length of the tank. The sailfish wins. Kaede demands a rematch. The sailfish declines."]];
  S.dlc_a2_fest_kaede = [['n', "Kaede challenges {kid} to a walking race between the stalls. {kid} wins. Walking races are {kidP} best event."]];
  S.dlc_a2_snow_kaede = [['n', "Kaede makes a snow angel instead of a snow sprint. It takes her four tries to lie still long enough."]];
  S.dlc_a2_beach_kaede = [['n', "Kaede walks the whole beach end to end with {kid} and picks up every shell {kidS} points at. There are a great many shells."]];
  S.dlc_a2_ferris_kaede = [['n', "At the top, Kaede says, \"I can run to any of those places in ten minutes.\" Then: \"I'd rather stay up here. It's so slow from here.\""]];
  S.dlc_more_kaede = [
    ['bg', 'apartment'], ['tint', 'evening'], ['show', K, 'excited', 'hip', 'c'],
    ['say', K, "Another one? Yes. Yeah. Done. Fast answer. — No, hang on. You get a slow answer for this."],
    ['n', "She thinks about it for one entire minute, by the clock on the stove. Her heel doesn't move."],
    ['say', K, "What do you want?", 'fond'],
    ['choice', [
      { t: '"Yes."', then: [['set', 'more', 1], ['say', K, "Then yes. Slow yes. Same as the fast one. I just wanted to check.", 'love']] },
      { t: '"I like our pace as it is."', then: [['say', K, "Yeah. Me too. That's what the minute said.", 'tender']] }
    ]],
    ['hide', K], ['tint', null]
  ];
  S.dlc_anniv_kaede = [
    ['bg', 'park'], ['music', 'romance'], ['tint', 'evening'],
    ['n', "Ten years. The park gate. We walk the loop ten times, one lap a year. It takes three hours. She has never once suggested running it."],
    ['show', K, 'tender', 'default', 'c'],
    ['say', K, "Lap seven I figured something out. I always got there first. You always got there last. Van, traffic, on foot. I never asked what last is like."],
    ['choice', [
      { t: '"Last is when you find out how it went. First is when you can still change it. I always envied first."', then: [['say', K, "I always envied last. By the time you got there, somebody'd already made it okay.", 'crysmile'], ['say', K, "…We're idiots. We could've swapped notes ten years ago.", 'laugh']] },
      { read: 'kaede_heel', t: '"Last is listening to your heel tap on comms and knowing you\'re already gone."', then: [['say', K, "You could *hear* that? Over the radio?", 'stunned'], ['me', "Every time. It's how I knew you were all right."], ['say', K, "…I'm never taking these shoes off.", 'cry'], ['aff', K, 3]] }
    ]],
    ['say', K, "Ten years. Race you to the gate. — Kidding. Walk me there.", 'fond'],
    ['hide', K], ['tint', null]
  ];
  S.dlc_wait_kaede = [['show', K, 'hurt', 'default', 'c'], ['n', "Kaede is already there. She's been there for two minutes. She's standing at the fence, outside the tape, with her fists closed, not moving."], ['say', K, "I got here in four minutes. Then I stood at the fence. Because you'd said *stay.* To {kidO}. So I figured it went for me too."], ['say', K, "It's the worst. It's the actual worst. How the hell did you do this for twelve years?", 'crysmile'], ['hide', K]];
  S.dlc_fin_kaede = [
    ['show', K, 'laugh', 'hip', 'c'],
    ['say', K, "Food's ready! It took eleven minutes! I'm not saying it's a record. It's a record."],
    ['hide', K],
    ['if', G => top(G) === 'brave', [['say', KD, "I don't need a Spark to go in. Dad went into a Rift without one. I looked it up. It's in Vol. 37."]]],
    ['if', G => top(G) === 'kind', [['say', KD, "I'm going to be the one who stays with people. The one who holds the hand through the window. Ma told me about the man in the car."]]],
    ['if', G => top(G) === 'curious', [['say', KD, "I'm going to be a Handler. Ma's going to be my fastest hero. I've already told her where to go."], ['say', K, "{KidS} told me to go to the store for milk. I did it in forty seconds. Best call I ever ran.", 'laugh']]],
    ...kcg('cg_dlc_fam_kaede'),
    ['if', tw, [['n', "*Kaede & {name}: the fastest hero in Neo-Tokyo, at walking pace, with two kids who set it.*"]], [['n', "*Kaede & {name}: the fastest hero in Neo-Tokyo, at walking pace.*"]]],
    ['cgoff']
  ];
})();

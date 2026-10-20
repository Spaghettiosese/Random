/* After Story — Mira: "Strawberry Saturdays" */
(() => {
  const { ep, reg } = STORY.dlc, M = 'mira', HA = 'hana', RE = 'ren', RI = 'rin', T = 'tetsu', K = 'kaede';

  ep('mira', 1, 'Vows', 'dlc_chapel', 'romance', 'petals', [
    ['n', "Two years after the Solace Protocol. HALO's medbay garden has been turned into a chapel: white chairs, pink peonies, and a very large cake that Mira refuses to let anyone near."],
    ['show', M, 'tender', 'shy', 'c'],
    ['say', M, "Strawberry mille-feuille. Seven layers. I did the cream myself at four a.m. Dr. Ito tried to taste-test and I confiscated his fork.", 'smile'],
    ['say', M, "I'm not nervous. My pulse is eighty-eight. Resting is sixty-two. I'm… mildly nervous.", 'flustered'],
    ['choice', [
      { t: "Take her pulse yourself. “Eighty-eight. You're allowed.”", aff: { mira: 2 }, set: 'dl_m1', then: [['say', M, "You're holding my wrist like a doctor. That's… unfairly attractive.", 'blush']] },
      { t: "“What does the nurse say?”", set: 'dl_m1', then: [['say', M, "The nurse says: eat something, drink water, and marry the man. Doctor's orders.", 'laugh']] },
      { t: "“I'm at a hundred and ten, so you're doing better than me.”", set: 'dl_m1', then: [['say', M, "That is a concerning number. Sit. Breathe. I'll fix you. I'm very good at that.", 'tender']] }
    ]],
    ['hide', M], ['bg', 'dlc_chapel', 'wipe'],
    ['cg', 'cg_dlc_mira_wedding'],
    ['n', "Rin sings from the front pew, a quiet ballad in her echo voice. It's the same song that drew the SOLACE glass out of Mira's spine. A few of the ex-patients in the crowd start to cry."],
    ['say', M, "I used to take every wound into myself because I thought that was what love was. Pain as proof.", 'sad'],
    ['say', M, "You taught me love is the opposite. It's two people holding the same cup so nobody spills.", 'tender'],
    ['say', M, "I promise to heal you, and to let you heal me back. Every Saturday, medically.", 'love'],
    ['n', "The crowd laughs through the tears. Tetsu cries openly into a handkerchief embroidered with a tiny bonsai."],
    ['sfx', 'heal'], ['fx', 'petals'],
    ['n', "When she kisses you, a soft pink glow ripples out from the two of you across the whole garden, mending a thousand little scratches. Nobody is wounded. Everyone feels lighter."],
    ['say', RI, "That's the Solace. It's finally… just a hug.", 'crysmile'],
    ['cgoff']
  ]);

  ep('mira', 2, 'First Years', 'dlc_nursery', 'daily', 'dust', [
    ['n', "Year two. The nursery is the brightest room in the apartment: pale pink walls, a mobile of felt strawberries, and a doctor who's attempting to read a pediatric manual and cradle a baby simultaneously."],
    ['cg', 'cg_dlc_mira_home'], ['wait', 1200],
    ['n', "Hana is four months old. Mira has been awake for thirty-one hours. She is, medically speaking, a mess. Spiritually, she has never been better."],
    ['say', M, "Chapter nine says: put baby down drowsy but awake. Chapter ten says: never put baby down. They are in direct contradiction.", 'confused'],
    ['me', "I take Hana. Mira stares at me, then at her own empty arms, and starts to laugh until she's crying."],
    ['say', M, "I've treated war wounds, burn units, glass in the lungs. I have never been this scared of anything as small as a person.", 'crysmile'],
    ['bg', 'dlc_home_night', 'fade'], ['music', 'night'],
    ['show', M, 'sad', 'default', 'c'],
    ['say', M, "When she cries I feel it. Like my old Spark. Like a hook behind my ribs. I'm scared I'll start taking her pain too, and I'll break her heart doing it.", 'sad'],
    ['choice', [
      { t: "“You don't have to take it. You can just hold it. Next to her.”", aff: { mira: 3 }, set: 'dl_m2', then: [['say', M, "…Hold it next to her. That's… that's actually the whole thing, isn't it?", 'crysmile']] },
      { t: "“We'll do it together. Shifts. Tea. Pudding.”", set: 'dl_m2', then: [['say', M, "A rotation. I love a good rotation. You're hired.", 'smile']] },
      { t: "Quietly start the lullaby Rin taught you.", set: 'dl_m2', then: [['say', M, "…That song brought me back to life once. Now it's putting my daughter to sleep. Okay. I'm fine. I'm fine.", 'cry']] }
    ]],
    ['n', "Hana quiets. A soft pink light drifts from Mira's palm to the little one's cheek. Not a wound, not a cure. Just warmth."],
    ['say', M, "Oh. That's new. That's mine. That's just for her.", 'tender']
  ]);

  ep('mira', 3, 'Family Day', 'dlc_park_family', 'date', 'petals', [
    ['n', "Spring. A picnic under the cherry trees. Hana is six. Ren is three. Mira packed a first-aid kit, a spare first-aid kit, and—at long last—a very large strawberry cake."],
    ['show', HA, 'happy', 'default', 'l'], ['show', RE, 'neutral', 'default', 'r'],
    ['say', HA, "Dr. Hana is open for appointments! Today we are treating: one teddy bear, one dinosaur, and Dad.", 'excited'],
    ['say', RE, "I'm not sick.", 'pout'],
    ['say', HA, "Everybody is a little bit sick. It's in the manual.", 'smile'],
    ['n', "Hana pulls a toy stethoscope from her backpack. It looks suspiciously like Mira's old one, resized to a six-year-old."],
    ['show', M, 'smile', 'default', 'c'],
    ['say', M, "Dr. Hana, please be gentle with the patient. He's a Handler. They're fragile.", 'tease'],
    ['choice', [
      { t: "“Dr. Hana, what's my diagnosis?”", aff: { mira: 2 }, set: 'dl_m3', then: [['say', HA, "You are… very tired. And very loved. Treatment: cake and a nap.", 'happy'], ['say', M, "…That's the best diagnosis I've ever heard.", 'love']] },
      { t: "Hold out your arm to let Hana “take your pulse.”", set: 'dl_m3', then: [['say', HA, "Your heart is going fast. Is that normal? Mama, is it normal?", 'surprised'], ['say', M, "…It's very normal when Mama's in the room.", 'blush']] },
      { t: "Help Ren build a bandage fort for the teddy bear.", set: 'dl_m3', then: [['say', RE, "Fort! Teddy is safe!", 'happy']] }
    ]],
    ['n', "Ren trips on a root. A tiny scrape. He looks at his knee, then at his mother, and doesn't cry. He puts out his hand, the way Mira taught him: palms up, ready."],
    ['say', M, "That's my brave boy. Let Mama see. Look at that. A tiny little scratch. Bandage and a kiss.", 'tender'],
    ['n', "A bandage with a strawberry on it. A kiss on the knee. No wound taken. No pain borrowed. Just care, given freely, like it should be."],
    ['hideall'],
    ['cg', 'cg_dlc_mira_family'], ['wait', 1600],
    ['say', M, "Saturday. Every Saturday. Doctor's orders.", 'love'],
    ['cgoff']
  ]);

  ep('mira', 4, 'The Porch', 'dlc_porch', 'night', 'fireflies', [
    ['n', "Years later. Spring has turned to summer. The kids are asleep. A tray of strawberry mille-feuille sits on the porch table, two forks, one plate."],
    ['cg', 'cg_dlc_mira_night'], ['music', 'romance'],
    ['say', M, "Come eat. It's the leftover from Hana's school play. She played a cherry blossom. She was the best cherry blossom I've ever seen.", 'smile'],
    ['say', M, "I used to say I healed because that was the only thing I was good at. I'm not so sure anymore.", 'tender'],
    ['say', M, "I think I was good at love. I just had the wrong word for it.", 'tender'],
    ['choice', [
      { t: "“You were never just a healer. You were always the one who stayed.”", aff: { mira: 3 }, set: 'dl_m4', then: [['say', M, "…And you stayed with me. Even when I told you not to. Even when I bled on your shirt.", 'crysmile']] },
      { t: "Feed her the last bite of cake. “Doctor's orders.”", set: 'dl_m4', then: [['say', M, "That's my line. …It's a good line.", 'laugh']] },
      { t: "“Next Saturday: just us. No kids. Rin's babysitting.”", set: 'dl_m4', then: [['say', M, "Oh no. Rin babysitting means the kids will be singing in echo for a week. …Yes. Yes. Absolutely yes.", 'excited']] }
    ]],
    ['say', M, "I have no more wounds to take. No more scars to hide. I'm just a woman on a porch with the man she loves and a very good cake.", 'love'],
    ['sfx', 'heal'], ['fx', 'hearts'],
    ['n', "A soft pink glow settles over the porch, warm and quiet and entirely unneeded. She didn't even try. It's just who she is now."],
    ['say', M, "Happy anniversary, my love. The cake's on me. The rest of my life, too.", 'love'],
    ['n', "Two forks. One plate. Saturday, forever."]
  ]);
  reg('mira');
})();

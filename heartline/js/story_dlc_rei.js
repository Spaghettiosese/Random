/* After Story — Rei: "The Long Night, Shared" */
(() => {
  const { ep, reg } = STORY.dlc, R = 'rei', TS = 'tsukiko', AK = 'akira', SH = 'shiori', HI = 'hikari', T = 'tetsu';

  ep('rei', 1, 'Vows', 'dlc_garden', 'romance', 'fireflies', [
    ['n', "Rei insisted on a night wedding. “Light is loud,” she said. “Dark is where I learned to be quiet. I'd like to be quiet with you.”"],
    ['n', "So the garden behind HALO is lit by nothing but moonlight, fireflies, and about two hundred lanterns that Rei made out of her own shadow. They glow violet."],
    ['show', R, 'shy', 'shy', 'c'],
    ['say', R, "My brother's in the third row. He's crying silently. He learned that from me. I'm so sorry for him.", 'deadpan'],
    ['say', R, "Shiori says I'm too calm. I am not calm. I've checked the lanterns four times. Two of them were crooked.", 'flustered'],
    ['choice', [
      { t: "“Crooked lanterns are the best ones. Leave them.”", aff: { rei: 2 }, set: 'dl_r1', then: [['say', R, "…Leave them crooked. Imperfect on purpose. Hm. I like that. I'm using that in my vows.", 'tender']] },
      { t: "Straighten the two lanterns together, quietly, like old times.", set: 'dl_r1', then: [['say', R, "Left a little. Left. There. …We always did work better in the dark, didn't we.", 'smile']] },
      { t: "“Rei. Breathe.” Offer her your hand until the shadows around her feet stop shivering.", set: 'dl_r1', then: [['say', R, "They're not scared. They're excited. I've never had excited shadows before.", 'blush']] }
    ]],
    ['hide', R], ['bg', 'dlc_garden', 'wipe'],
    ['cg', 'cg_dlc_rei_wedding'],
    ['n', "Nobody in the crowd makes a sound as Rei walks down the aisle. The black cats are the exception. Kuro and three of her descendants sit in the aisle, entirely unsupervised, and meow at appropriate moments."],
    ['say', R, "I don't make promises I can't keep. I've only ever made four. I kept all of them. This is the fifth.", 'tender'],
    ['say', R, "I promise to leave the light on. Always. Even when I forget I'm afraid of the dark.", 'tender'],
    ['say', R, "And I promise that wherever the shadows end, you'll still be standing in the light I never thought I'd get to touch.", 'love'],
    ['sfx', 'heart'], ['fx', 'stars'],
    ['n', "When she kisses you, the lanterns lift into the air all at once and spread across the sky. The shadows have never looked so happy."],
    ['say', SH, "…She's really smiling. I've been her rival for ten years and I have never seen that smile. I hate it. I love it.", 'embarrassed'],
    ['cgoff']
  ]);

  ep('rei', 2, 'First Years', 'dlc_home_day', 'daily', 'dust', [
    ['n', "Year two. The apartment has two cats, a mountain of laundry, and a very small person who has opinions about the dark."],
    ['cg', 'cg_dlc_rei_home'], ['wait', 1200],
    ['n', "Rei hasn't moved in forty minutes. Tsukiko is asleep on her chest. Kuro is asleep on Tsukiko. The shadows pool around them like a sleepy tide."],
    ['say', R, "Don't speak. Don't cough. Don't think loudly. She just stopped crying. I've never seen anything so fragile and so terrifying.", 'scared'],
    ['me', "I whisper-ask whether she wants tea."],
    ['say', R, "…Please. Hot. Not too sweet. And if you move her, I'll end you. Gently.", 'deadpan'],
    ['bg', 'dlc_home_night', 'fade'], ['music', 'night'],
    ['n', "Night. Rei is awake. Of course she's awake. She's standing at the crib with her shadows, shaping little animals on the wall to keep Tsukiko giggling."],
    ['show', R, 'sad', 'default', 'c'],
    ['say', R, "I was alone for so long. I didn't think I'd know how to be someone's home. What if I'm cold?", 'sad'],
    ['choice', [
      { t: "“You made a whole night sky out of lanterns. You're the warmest person I know.”", aff: { rei: 3 }, set: 'dl_r2', then: [['say', R, "…Say that again. Quietly. I want to remember it.", 'blush']] },
      { t: "“Tsukiko's laughing at a shadow rabbit. That's not a cold kid. That's a kid who's safe.”", set: 'dl_r2', then: [['say', R, "A rabbit. I made her a rabbit. I didn't even decide to. My hands just did it.", 'crysmile']] },
      { t: "Stand beside her. Say nothing. Let the shadow rabbit become a shadow family of three.", set: 'dl_r2', then: [['say', R, "…Thank you for not saying anything. That was the right answer.", 'tender']] }
    ]],
    ['n', "The shadow rabbit hops across the wall. Tsukiko giggles, a small, perfect sound. The shadows around the room hum with it."],
    ['say', R, "They're purring. My shadows are purring. I'm going to need an explanation from the Board.", 'confused']
  ]);

  ep('rei', 3, 'Family Day', 'dlc_park_family', 'date', 'stars', [
    ['n', "Summer night. A picnic on the hill overlooking the city. Tsukiko is six. Akira is three. Rei brought a thermos, four blankets, and a telescope the size of a small tree."],
    ['show', TS, 'neutral', 'default', 'l'], ['show', AK, 'happy', 'default', 'r'],
    ['say', TS, "Mama says stars are light that already left before we saw it. So we're looking at the past. I think that's a bit sad. Also a bit cool.", 'think'],
    ['say', AK, "Cat! Cat! Cat is a star!", 'excited'],
    ['n', "A small shadow-cat, made of pure dusk, trots over Akira's blanket and settles in his lap. Tsukiko is the only person in Neo-Tokyo who can summon one on command. She's six. She summoned it to share her sandwich."],
    ['show', R, 'smile', 'default', 'c'],
    ['say', R, "Tsukiko. Is that cat eating the sandwich?", 'deadpan'],
    ['say', TS, "No. It's… looking at the sandwich. Very closely.", 'neutral'],
    ['choice', [
      { t: "“Let him look. He's earned it. Great shadow work today.”", aff: { rei: 2 }, set: 'dl_r3', then: [['say', TS, "Thank you, Dad. I'm going to make him a hat next.", 'happy']] },
      { t: "Hand Akira your sandwich. “Trade: you take mine, the cat keeps hers.”", set: 'dl_r3', then: [['say', AK, "Mine!", 'happy'], ['say', R, "…He gets the negotiation skills from you. I'm so proud I could cry. I won't, but I could.", 'tender']] },
      { t: "“Ask the cat if it has any other requests.”", set: 'dl_r3', then: [['say', TS, "It wants a fish. And a vacation. And a bigger blanket.", 'smile'], ['say', R, "Demanding. Like a certain someone.", 'tease']] }
    ]],
    ['hideall'],
    ['cg', 'cg_dlc_rei_family'], ['wait', 1600],
    ['n', "A shooting star crosses the sky. Tsukiko wishes out loud, which is against her own rules. Akira makes up a wish in baby-talk. Rei's wish is the quietest, and the longest."],
    ['say', R, "I made a wish. I won't say it. It's already coming true.", 'love'],
    ['cgoff']
  ]);

  ep('rei', 4, 'The Porch', 'dlc_porch', 'night', 'fireflies', [
    ['n', "Years later. The kids are asleep. The city lights are low. Rei is on the porch swing with a mug and a cat that has gotten very, very fat."],
    ['cg', 'cg_dlc_rei_night'], ['music', 'romance'],
    ['say', R, "Come sit. I saved you the warm half.", 'smile'],
    ['say', R, "Do you remember the first time we stood on a rooftop and I said I don't do relationships? I thought it meant I'd be alone.", 'tender'],
    ['say', R, "It meant I hadn't met the right kind of quiet yet.", 'tender'],
    ['n', "Behind the glass door, a hallway nightlight glows in the shape of a small cat. Tsukiko's. It's the only light left on."],
    ['choice', [
      { t: "“I used to be afraid of the dark too. Then I met you.”", aff: { rei: 3 }, set: 'dl_r4', then: [['say', R, "…That's very good. Don't tell Hikari. She'll use it in a speech.", 'blush']] },
      { t: "“You know what I miss? The shadow-lantern wedding. Best night of my life.”", set: 'dl_r4', then: [['say', R, "I can make them again. Anniversary. Don't ask me to explain how.", 'love']] },
      { t: "Lean your head on her shoulder. She doesn't say anything. The cat purrs.", set: 'dl_r4', then: [['say', R, "…Mm. Good. This is the whole point.", 'tender']] }
    ]],
    ['say', R, "I thought I was a weapon. Turns out I was a lighthouse that didn't know it. Thank you for coming into port.", 'love'],
    ['sfx', 'heart'], ['fx', 'hearts'],
    ['n', "The shadows around the porch lift gently, then settle. For the first time in her life, Rei's night has no edges. It's just warm."],
    ['say', R, "Go to sleep, Handler. I'll keep the dark company a little longer.", 'smile'],
    ['n', "You don't leave. She doesn't ask you to."]
  ]);
  reg('rei');
})();

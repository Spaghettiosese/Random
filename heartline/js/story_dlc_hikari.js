/* After Story — Hikari: "Sunflowers & Sparks" */
(() => {
  const { ep, reg } = STORY.dlc, H = 'hikari', NA = 'natsuki', RA = 'raika', SOU = 'sou', K = 'kaede', T = 'tetsu', A = 'aya', R = 'rei', M = 'mira', SO = 'sora';
  const ME = t => ['me', t];

  ep('hikari', 1, 'Vows', 'dlc_garden', 'romance', 'petals', [
    ['n', "Two years after the Dome. HALO's rooftop garden has never had this many sunflowers, mostly because Hikari ordered four hundred and the florist panicked."],
    ['show', NA, 'happy', 'wave', 'l'], ['show', H, 'flustered', 'shy', 'r'],
    ['say', NA, "Sweetheart, breathe. You've fought a Glass Leviathan. This is just a hundred and twenty people watching you cry."],
    ['say', H, "That's WORSE, Mom! The Leviathan didn't have a camera crew! Sora brought a camera crew!", 'scared'],
    ['say', H, "I wrote vows. They're eleven pages. Page seven is a drawing of ramen. I can't read page seven. I'll cry on the noodles.", 'sweat'],
    ['say', NA, "I'll leave you two. I have a seat in the front row to ruin with my sobbing.", 'tease'], ['hide', NA],
    ['n', "She grips your sleeve with both hands. Tiny sparks jump between her fingers and the fabric. Pop-pop-pop."],
    ['choice', [
      { t: "Take her hands. “Say what's true. Skip the ramen — I already know about the ramen.”", aff: { hikari: 2 }, set: 'dl_h1', then: [
        ['say', H, "…True. Okay. True is easy. True is just you. You're my favorite person. That's the whole page.", 'tender']] },
      { t: "“Eleven pages? Read me page seven. Right now. I'll be your practice audience.”", set: 'dl_h1', then: [
        ['say', H, "“Page seven: a bowl of ramen, with a heart in the steam, and a stick figure that's you, losing a chopsticks fight.” …Okay that's very stupid. I love it.", 'laugh']] },
      { t: "“One sentence. You already said it on the rooftop.”", set: 'dl_h1', then: [
        ['say', H, "“Partners on the board, partners off the board.” …Yeah. Yeah, that's the sentence.", 'love']] }
    ]],
    ['hide', H], ['bg', 'dlc_garden', 'wipe'],
    ['cg', 'cg_dlc_hikari_wedding'], ['music', 'romance'],
    ['n', "Director Takamine officiates, in a suit that's slightly too red. Tetsu holds the rings in a bonsai pot. Kaede's already crying and denying it."],
    ['say', A, "By the power vested in me by the City, the HALO Board, and one extremely loud rescue hero in the third row—", 'smug'],
    ['say', NA, "I HEARD THAT. I'M NOT CRYING. THAT'S SUNFLOWER POLLEN."],
    ['say', H, "I promise to share my last dumpling. Even the good one. ESPECIALLY the good one.", 'happy'],
    ['say', H, "I promise to stop when you say stop. I promise to start again when you say go. And I promise… partners on the board, partners off the board, partners all the way home.", 'tender'],
    ['n', "Your vows are shorter. Hers are louder. Somewhere in the middle, the sunflowers all turn toward the two of you."],
    ['sfx', 'heart'], ['flash', '#ffe9a0'], ['fx', 'sparks'],
    ['n', "When she kisses you, every sunflower lantern in the garden lights up at once. Nobody planned that. Sora's camera crew absolutely did not plan that."],
    ['say', K, "SHE LIT THE WHOLE GARDEN. I CAN'T SEE. I'M FINE. I'M CRYING. I'M FINE.", 'furious'],
    ['cgoff'],
    ['show', H, 'happy', 'cheer', 'c'],
    ['say', H, "Mrs. Amane! …Wait, is it Mrs. Amane? Or do we pick a new name? We could be the Raijins!", 'excited'],
    ['n', "Married four minutes. Already arguing about a name. It's going to be a very good marriage."]
  ]);

  ep('hikari', 2, 'First Years', 'dlc_home_day', 'daily', 'dust', [
    ['n', "Year two. The apartment smells like toast, formula, and burnt ozone. The three are not unrelated."],
    ['cg', 'cg_dlc_hikari_home'], ['wait', 1200],
    ['n', "Hikari is making breakfast, one-handed, while a four-month-old Raika dozes on her shoulder. The toaster has been replaced three times. Today it's doing fine. Because Hikari's hair is standing straight up."],
    ['say', H, "Don't move. Don't breathe. Don't… anything. She's finally sleeping. The sparks only come out when she's mad or hungry or happy, and she's all three.", 'sweat'],
    ['me', "I take the toast out. It's charcoal. It's still, somehow, perfect."],
    ['cgoff'],
    ['show', NA, 'surprised', 'default', 'l'], ['show', H, 'sleepy', 'default', 'r'],
    ['say', NA, "I brought pudding! And a fire extinguisher! And a second fire extinguisher!"],
    ['say', H, "Mom, you can't bring pudding to a baby.", 'deadpan'],
    ['say', NA, "It's not for the baby. It's for the mother. Rescue hero rule: feed the one holding the baby.", 'smile'],
    ['say', H, "…Okay, that's actually a good rule.", 'tender'],
    ['hide', NA],
    ['n', "Night. The apartment lights are off, except the ones Raika is making. A soft yellow pulse from the crib, in rhythm with her sleepy breathing."],
    ['bg', 'dlc_home_night', 'fade'], ['music', 'night'],
    ['show', H, 'sad', 'shy', 'c'],
    ['say', H, "What if she gets my sparks and one day she can't control them? I couldn't, at first. I zapped the whole school bus once. I was nine.", 'sad'],
    ['say', H, "I don't want her scared of herself like I was.", 'cry'],
    ['choice', [
      { t: "“Then she'll have a mom who's already been there. And a dad who'll learn every trick.”", aff: { hikari: 3 }, set: 'dl_h2', then: [
        ['say', H, "…You'd learn how to ground a lightning bolt? For her?", 'crysmile'], ['me', "“I'd learn to ground a thunderstorm for you. She's easy.”"], ['say', H, "Oh, that's so corny. I'm keeping it forever.", 'love']] },
      { t: "“Her first hero training is tomorrow: how to be a baby. Mostly sleeping.”", set: 'dl_h2', then: [
        ['say', H, "Hahaha— shh— shh— okay. Okay. She's sleeping. You're an idiot. Thank you.", 'laugh']] },
      { t: "Say nothing. Hold her until the shaking stops.", set: 'dl_h2', then: [
        ['say', H, "…You're so warm. How are you always warm?", 'tender']] }
    ]],
    ['n', "Hikari hums. Loudly. Off-key. It's the worst lullaby in Neo-Tokyo. Raika's sparks slow, then settle into a soft glow like a nightlight."],
    ['say', H, "Hey. She likes it. She LIKES it. I'm gonna be a lullaby legend.", 'excited'],
    ['n', "You don't have the heart to tell her that Raika is mostly asleep because she's given up."]
  ]);

  ep('hikari', 3, 'Family Day', 'dlc_park_family', 'festival', 'fireworks', [
    ['n', "Summer. Raika is six and Sou is three. The Tanabata Festival is in full swing, and Hikari is already losing a fight with a cotton-candy machine."],
    ['show', RA, 'excited', 'cheer', 'l'], ['show', SOU, 'neutral', 'default', 'r'],
    ['say', RA, "Dad! Dad! Watch! I can make the lanterns blink! Mom says I can only do it if nobody's looking!", 'excited'],
    ['say', SOU, "…Everyone is looking.", 'deadpan'],
    ['say', RA, "Sou, you're not helping!", 'angry'],
    ['n', "The string of paper lanterns above the food stalls flickers. Then every single one goes out. Then all of them flare gold. Somewhere, a vendor yells."],
    ['show', H, 'surprised', 'default', 'c'],
    ['say', H, "RAIKA AMANE. What did we say about 'a little spark'?", 'angry'],
    ['say', RA, "…That a little spark is a little spark?", 'sad'],
    ['choice', [
      { t: "Crouch down. “That was an amazing control. Now let's try it with a lot less lantern.”", aff: { hikari: 2 }, set: 'dl_h3', then: [
        ['say', RA, "Really?! You're not mad?", 'surprised'], ['say', H, "I'm a LITTLE mad. But I'm also really, really proud. Don't tell her I said both.", 'tender']] },
      { t: "Laugh. “Your mom did the exact same thing at your age. Maybe worse.”", set: 'dl_h3', then: [
        ['say', H, "THAT WAS A BUS! A BUS IS DIFFERENT FROM A LANTERN! …Okay a little different.", 'embarrassed'], ['say', RA, "Mom zapped a BUS?!", 'excited']] },
      { t: "Offer to run lantern-safety training together, whole family, tomorrow.", set: 'dl_h3', then: [
        ['say', H, "Family hero training! Oh, we're doing it! I'm making shirts!", 'excited']] }
    ]],
    ['say', SOU, "Mommy. The sparkler lady is crying.", 'neutral'],
    ['n', "Little Sou has quietly walked to the dropped-ticket booth and is holding an ancient woman's hand. She's pointing at her lost purse. He's already got it in his other hand."],
    ['say', H, "…Our youngest is the real hero, isn't he.", 'crysmile'],
    ['hideall'],
    ['cg', 'cg_dlc_hikari_family'], ['fx', 'fireworks'], ['wait', 1600],
    ['n', "The fireworks go up. Raika squeals, Sou salutes, Hikari tries to count the colors and gives up at nine. You stand between all three, the loudest, warmest, strangest family in Neo-Tokyo."],
    ['say', H, "Ramen after? Ramen Raijin has a family menu now. It has a picture of me on it.", 'happy'],
    ['cgoff']
  ]);

  ep('hikari', 4, 'The Porch', 'dlc_porch', 'night', 'fireflies', [
    ['n', "Years later. The sunflowers on the balcony have outgrown their pots. The kids are asleep. For the first time all week, the apartment is quiet."],
    ['cg', 'cg_dlc_hikari_night'], ['music', 'romance'],
    ['say', H, "Hey. Are you awake? Of course you're awake. You never sleep before me. It's, like, a rule.", 'tender'],
    ['say', H, "Remember when you were a night clerk? Writing fight breakdowns for heroes nobody read?", 'smile'],
    ['say', H, "I read one. The very first week. Every single hero in HALO reads them now. Did you know that?", 'tender'],
    ['n', "The Handler's Breakdowns were published last year. Hikari still keeps the first printing on the bookshelf, next to her trophy."],
    ['say', H, "I'm so loud. I know I'm loud. I was scared you'd get tired of it. That you'd want quiet.", 'sad'],
    ['choice', [
      { t: "“Quiet is when you're away. I'd take thunder every day.”", aff: { hikari: 3 }, set: 'dl_h4', then: [['say', H, "…Okay. Okay, I'm crying again. This is a feature, not a bug.", 'crysmile']] },
      { t: "“The kids are loud. I'm louder inside. I'm just better at hiding it.”", set: 'dl_h4', then: [['say', H, "Ha! Yeah. Yeah, you really are. I can hear you. All the time.", 'love']] },
      { t: "“Ask me again in the morning when Sou wakes up at five.”", set: 'dl_h4', then: [['say', H, "Hahaha! He gets that from me, I swear!", 'laugh']] }
    ]],
    ['say', H, "I never told you what my wish was at the Tanabata. When I was little. Before the Rift, before Mom, before HALO.", 'tender'],
    ['say', H, "I wished for someone to stay. Just… stay. That's the whole thing.", 'tender'],
    ['me', "“I'm not going anywhere.”"],
    ['say', H, "I know. It took me a little while to believe it. But I know. Partners on the board. Partners off the board.", 'love'],
    ['sfx', 'heart'], ['fx', 'hearts'],
    ['n', "Behind the glass door, a small voice calls out “Moooom?” and a very small spark lights the hallway. Hikari groans, grins, and gets up."],
    ['say', H, "Duty calls. Race you to the kids' room? Loser makes the pancakes.", 'excited'],
    ['n', "You lose. You make the pancakes. They're the best you've ever had. That's the secret: they're all hers."]
  ]);
  reg('hikari');
})();

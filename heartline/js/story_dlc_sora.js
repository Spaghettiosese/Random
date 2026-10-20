/* After Story — Sora: "Encore, Forever" */
(() => {
  const { ep, reg } = STORY.dlc, SO = 'sora', HO = 'hoshi', KA = 'kai', K = 'kaede', HI = 'hikari', B = 'bit';

  ep('sora', 1, 'Vows', 'dlc_garden', 'idol', 'stars', [
    ['n', "Two years after the Dome. Sora Hoshino, number-one idol in thirty countries, is getting married on HALO's rooftop at midnight with no stage, no lighting rig, and no contract. Just a hundred glowsticks."],
    ['show', SO, 'flustered', 'shy', 'c'],
    ['say', SO, "I've performed for twelve million people. My knees have never shaken like this.", 'sweat'],
    ['say', SO, "The fans found out. They're outside. They promised to stay quiet. They're not being quiet. I can hear them. They're holding up lightsticks.", 'embarrassed'],
    ['choice', [
      { t: "“Let them. They've loved you for years. Share it.”", aff: { sora: 2 }, set: 'dl_s1', then: [['say', SO, "…Okay. For one song. One. Then it's just us.", 'tender']] },
      { t: "“You're allowed to be small tonight. Just for me.”", set: 'dl_s1', then: [['say', SO, "Small. I can do small. I haven't been small since I was nine, in my room, singing to the stars.", 'crysmile']] },
      { t: "“Want me to throw a wedding-crasher a shoe?”", set: 'dl_s1', then: [['say', SO, "Pfft— no. No shoes. Though if Kaede's heckling again…", 'laugh']] }
    ]],
    ['hide', SO], ['bg', 'dlc_garden', 'wipe'],
    ['cg', 'cg_dlc_sora_wedding'],
    ['n', "A hundred glowsticks lift into the air without anyone touching them. Gravity itself is helping. Sora's Spark nudges them upward, a slow, shimmering constellation."],
    ['say', SO, "Everyone knows my songs. Not everyone knows I wrote my first one for a night-shift clerk who answered the phone at two a.m.", 'tender'],
    ['say', SO, "I promise to sing you awake. I promise to sing you to sleep. I promise to stop the whole concert if you ever look away from the stage and need me.", 'love'],
    ['say', SO, "My favorite audience of one. Forever. Encore.", 'happy'],
    ['sfx', 'heart'], ['fx', 'stars'],
    ['n', "When she kisses you, every petal on the rooftop floats upward, defying gravity, and hangs in the air like snow that forgot to fall."],
    ['say', B, "Beep. Wedding vitals: hearts at 142 BPM. Both of them. This is statistically impossible. Congratulations.", 'happy'],
    ['cgoff']
  ]);

  ep('sora', 2, 'First Years', 'dlc_home_day', 'daily', 'dust', [
    ['n', "Year two. The living room has been turned into a recording nook. A guitar leans on the couch, a microphone hangs from a cord, and a three-month-old Hoshi dozes in a bassinet shaped like a crescent moon."],
    ['cg', 'cg_dlc_sora_home'], ['wait', 1200],
    ['n', "Sora hums into the mic, softly, to a baby who is asleep. She isn't recording. She's just singing. The most beautiful voice in thirty countries and the audience is a sleeping infant."],
    ['say', SO, "STELLAR wants a comeback tour. Eighty cities. A hundred and ten shows. They sent a very nice basket.", 'deadpan'],
    ['say', SO, "I told them no. It was the hardest thing I've ever said. And the easiest.", 'tender'],
    ['bg', 'dlc_home_night', 'fade'], ['music', 'night'],
    ['show', SO, 'sad', 'default', 'c'],
    ['say', SO, "Is it selfish? To want the stage and the nursery? To want millions and also one person?", 'sad'],
    ['choice', [
      { t: "“You don't have to choose. You can do shorter tours. Hoshi can come with us.”", aff: { sora: 3 }, set: 'dl_s2', then: [['say', SO, "A tour with a baby on the bus. Oh no. Oh, that's perfect. Overnight lullaby concerts. I'm writing that down.", 'excited']] },
      { t: "“Whatever you pick, I'm in the front row.”", set: 'dl_s2', then: [['say', SO, "…You always are. That's the problem. I want to sing to you AND for you AND about you.", 'crysmile']] },
      { t: "“Sing to her. Not for the charts. Just for tonight.”", set: 'dl_s2', then: [['say', SO, "…Okay. A small one. A very small one.", 'tender']] }
    ]],
    ['n', "She sings a lullaby she's never released. Soft. Barely louder than a heartbeat. Hoshi's fingers curl around hers. Somewhere in the corner of the room, a very small glowing star floats up from the crib and settles in Sora's hair."],
    ['say', SO, "…Her first gravity trick. She made a star. She made a STAR. I'm going to need a minute.", 'cry']
  ]);

  ep('sora', 3, 'Family Day', 'dlc_park_family', 'idol', 'confetti', [
    ['n', "Summer. Hoshi is six. Kai is three. The backyard has been transformed into a stage: a crate for a podium, a hose for a microphone, and a very serious audience of two stuffed bears."],
    ['show', HO, 'excited', 'cheer', 'l'], ['show', KA, 'sleepy', 'default', 'r'],
    ['say', HO, "Ladies and gentlemen! Hoshi Hoshino! Number one idol! In the whole entire backyard!", 'excited'],
    ['say', KA, "Hoshi's loud.", 'deadpan'],
    ['say', HO, "That's called projection, Kai.", 'angry'],
    ['show', SO, 'laugh', 'default', 'c'],
    ['say', SO, "Okay, okay. Who wants a real concert? With real lights? Mama's been practicing.", 'smug'],
    ['choice', [
      { t: "“Mom's headlining. I'm in charge of snacks and bears.”", aff: { sora: 2 }, set: 'dl_s3', then: [['say', SO, "My roadie. My manager. My husband. Every idol's dream.", 'love']] },
      { t: "Hold the hose-microphone for Hoshi. “Sound check, one two.”", set: 'dl_s3', then: [['say', HO, "ONE TWO. ONE TWO! DAD IS THE BEST ROADIE!", 'excited']] },
      { t: "Put Kai on your shoulders so he can see the whole stage.", set: 'dl_s3', then: [['say', KA, "…I can see the moon.", 'happy']] }
    ]],
    ['n', "Sora steps onto the crate. A single note. Then two. Then the whole yard hums with it. The grass shivers. The neighbors, all eleven of them, have gathered at the fence."],
    ['hideall'],
    ['cg', 'cg_dlc_sora_family'], ['wait', 1600],
    ['n', "It's the smallest stage in the world and the biggest crowd she's ever sung for. Hoshi sings backup, wildly off-key. Kai claps on the wrong beats. You cry."],
    ['say', SO, "Thank you, Neo-Tokyo! This one's for my favorite audience of FOUR!", 'happy'],
    ['cgoff']
  ]);

  ep('sora', 4, 'The Porch', 'dlc_porch', 'night', 'stars', [
    ['n', "Years later. A late-night walk home from a sold-out show. The kids are with Hikari for the weekend. For once it's just the two of you and a nearly empty street."],
    ['cg', 'cg_dlc_sora_night'], ['music', 'romance'],
    ['say', SO, "Fans keep asking who the Dome song is about. Reporters, too. A guy on a morning show offered me a whole sports car.", 'smug'],
    ['say', SO, "I told him: it's about a man who took a night-shift job to listen to a girl he'd never met. I didn't tell him your name.", 'tender'],
    ['say', SO, "Do you want me to? I could say it on stage. Tomorrow. Twelve million people.", 'tease'],
    ['choice', [
      { t: "“Tell them. I'll be in the van, red as a tomato.”", aff: { sora: 3 }, set: 'dl_s4', then: [['say', SO, "I knew you'd say that. That's why I'm going to say it. Gravity will help me find your name.", 'laugh']] },
      { t: "“Keep it a secret. Let them wonder. It's ours.”", set: 'dl_s4', then: [['say', SO, "…Ours. Yeah. Ours. A song nobody gets to solve.", 'tender']] },
      { t: "“Sing it for me. Right here. No audience.”", set: 'dl_s4', then: [['say', SO, "…Okay. Very quiet. Very close.", 'blush']] }
    ]],
    ['n', "She sings it, softly, under a sky with no clouds. The streetlights flicker in time. A gravity-drawn constellation rises from the pavement, brightening with every note."],
    ['say', SO, "I used to think I was a product. A face. A voice for sale. You taught me I'm just a person with a good song.", 'love'],
    ['say', SO, "And you're just a person with a good listener's heart. We're so lucky. So absurdly lucky.", 'crysmile'],
    ['sfx', 'heart'], ['fx', 'hearts'],
    ['n', "The last note hangs in the air. Time, for a moment, really does slow. She leans in and the whole city seems to lean with her."],
    ['say', SO, "Encore?", 'wink'],
    ['n', "You say yes. You'll always say yes."]
  ]);
  reg('sora');
})();

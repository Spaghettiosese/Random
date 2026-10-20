/* After Story — Kaede: "Slow Lane" */
(() => {
  const { ep, reg } = STORY.dlc, K = 'kaede', HY = 'hayate', MO = 'momo', T = 'tetsu', HI = 'hikari', R = 'rei';

  ep('kaede', 1, 'Vows', 'dlc_garden', 'festival', 'petals', [
    ['n', "Kaede insisted on a finish-line aisle. Banners, a stopwatch, and a ribbon tape across the end of the park track. HALO's Sports Day has never looked so formal."],
    ['show', K, 'excited', 'cheer', 'c'],
    ['say', K, "Okay. Okay okay okay. I've run the Shibuya Rift circuit in under four minutes and I'm about to be late for my own wedding because I can't find my second shoe.", 'sweat'],
    ['say', K, "I can run a thousand miles in a minute but I can't walk down an aisle without tripping. This is a design flaw.", 'flustered'],
    ['choice', [
      { t: "“Don't walk. Jog. Everybody here would cheer louder.”", aff: { kaede: 2 }, set: 'dl_k1', then: [['say', K, "A JOG. Yes. The Mori Jog! Slow. Like three-quarter speed. I can do that. I think.", 'excited']] },
      { t: "Find the second shoe. It was on her head the whole time.", set: 'dl_k1', then: [['say', K, "…I'm wearing it as a hat. I'm wearing the shoe as a hat. Don't say anything.", 'embarrassed']] },
      { t: "“I'll be right at the end. Take as long as you need. I'm not going anywhere.”", set: 'dl_k1', then: [['say', K, "…No rushing. No racing. Just walking toward you. Okay. That's the best finish line I've ever heard of.", 'tender']] }
    ]],
    ['hide', K], ['bg', 'dlc_garden', 'wipe'],
    ['cg', 'cg_dlc_kaede_wedding'],
    ['n', "The whole squad lines the track. Tetsu holds the tape. Hikari holds the stopwatch. Rei holds a sign that says SLOW in violet block letters."],
    ['say', K, "I promise to slow down. Not all the time. Just when it matters. Just when you're next to me.", 'tender'],
    ['say', K, "I promise to catch every ball you throw. To drop none of the ones that matter. And to let you win a race. Once. It'll be tragic.", 'smirk'],
    ['say', K, "And I promise that wherever the track goes, you're the finish line I want to run to, forever.", 'love'],
    ['sfx', 'heart'], ['fx', 'confetti'],
    ['n', "She breaks the tape together with you. A breeze she didn't mean to make sweeps up every petal on the track and swirls it into a spiral of gold and green."],
    ['say', HI, "THAT WAS A TIE. I'm calling it. WE ALL SAW. IT WAS A TIE.", 'excited'],
    ['cgoff']
  ]);

  ep('kaede', 2, 'First Years', 'dlc_home_day', 'daily', 'dust', [
    ['n', "Year two. The apartment is a blur. Literally. A tiny breeze whips through the kitchen, the laundry room, the hallway, and back. Kaede is trying to do everything at once with a three-month-old Hayate on her hip."],
    ['cg', 'cg_dlc_kaede_home'], ['wait', 1200],
    ['say', K, "Breakfast! Diaper! Laundry! Dishes! Bottle! I have four hands! I should have four hands!", 'excited'],
    ['n', "Hayate giggles. A very tiny breeze tickles the curtains. He's a speedster too. He crawled at four months. Out the window."],
    ['me', "I catch him at the second-story sill. Gently. Both of us breathing very hard."],
    ['say', K, "…Okay. New rule. Slow. Slow is the new fast. Everything is slow. I am a snail. A beautiful snail.", 'sweat'],
    ['bg', 'dlc_home_night', 'fade'], ['music', 'night'],
    ['show', K, 'sad', 'default', 'c'],
    ['say', K, "All my life I was told I'm too fast. For classmates, for the squad, for relationships. I thought it meant I'd miss things.", 'sad'],
    ['say', K, "I miss everything now, anyway. His first smile. His first step. I was on a call. I was in Kyoto.", 'cry'],
    ['choice', [
      { t: "“You were in Kyoto because a bridge was falling. Hayate gets a hero for a mom. That's a first-step story.”", aff: { kaede: 3 }, set: 'dl_k2', then: [['say', K, "…Yeah. Yeah, he'll brag about it at school. 'My mom caught a bridge.'", 'crysmile']] },
      { t: "“His second first step is tomorrow. I'll text you the countdown.”", set: 'dl_k2', then: [['say', K, "A countdown. A real countdown. I'll be in the room.", 'determined']] },
      { t: "Sit beside her on the floor. Watch Hayate sleep, at normal speed.", set: 'dl_k2', then: [['say', K, "…It's so quiet. It's so slow. It's the best minute I've ever had.", 'tender']] }
    ]],
    ['n', "For one whole hour, Kaede doesn't move. The breeze in the apartment settles. The curtains hang straight for the first time in months."],
    ['say', K, "I think this is what everyone means by peace.", 'relieved']
  ]);

  ep('kaede', 3, 'Family Day', 'dlc_park_family', 'festival', 'leaves', [
    ['n', "Autumn. School Sports Day. Hayate is six and entered in every single event. Momo is three and entered in exactly one: sitting, with a juice box, near the finish line."],
    ['show', HY, 'excited', 'cheer', 'l'], ['show', MO, 'happy', 'default', 'r'],
    ['say', HY, "Mom! Dad! Watch! I'm gonna win the relay! I'm gonna win EVERYTHING!", 'excited'],
    ['say', MO, "Hayate go fast!", 'happy'],
    ['show', K, 'smirk', 'hip', 'c'],
    ['say', K, "Slow start. Smooth turn. Then BOOM. That's the Mori way.", 'smug'],
    ['n', "The relay starts. Hayate rockets off the line, takes the baton, and then—at the third turn—he stops. A kid from another team has fallen. He crouches. He reaches out."],
    ['choice', [
      { t: "Cheer for him anyway. “That's winning, Hayate!”", aff: { kaede: 2 }, set: 'dl_k3', then: [['say', K, "THAT'S MY BOY! HE'S SLOWING DOWN TO HELP! LOOK AT HIM GO! …Slowly!", 'excited']] },
      { t: "Hold your breath. Let him choose.", set: 'dl_k3', then: [['say', K, "…He's going to help. I know it. Okay, I don't know it. I want it. Please.", 'sad']] },
      { t: "Whisper to Kaede: “Whose kid does that remind you of?”", set: 'dl_k3', then: [['say', K, "…Shut up. Mine. Ours. Okay, yes, mine.", 'blush']] }
    ]],
    ['n', "Hayate helps the other kid up. They finish last, together, hands linked. The crowd erupts louder than it did for the winner."],
    ['say', HY, "I came in last, Mom! I'm so sorry! I—", 'sad'],
    ['say', K, "Last? Baby. You just won the only race that matters. Come here.", 'tender'],
    ['hideall'],
    ['cg', 'cg_dlc_kaede_family'], ['wait', 1600],
    ['say', K, "Everyone! Group hug! Slow hug! Super slow! SLOWEST HUG IN THE WORLD!", 'laugh'],
    ['cgoff']
  ]);

  ep('kaede', 4, 'The Porch', 'dlc_porch', 'night', 'leaves', [
    ['n', "Years later. The kids are asleep. Kaede is on the porch in her old sneakers, which are now faded, battered, and held together by tape and nostalgia."],
    ['cg', 'cg_dlc_kaede_night'], ['music', 'romance'],
    ['say', K, "Race you to the park gate. Loser buys sneakers.", 'smirk'],
    ['say', K, "…I'm joking. I'm so tired. I've never been this happy and this tired at the same time.", 'relieved'],
    ['say', K, "Do you know what I learned? The fastest I ever went wasn't in a race. It was the Thursday you said yes.", 'tender'],
    ['choice', [
      { t: "“I didn't say yes. You tripped over my shoelace and I caught you.”", aff: { kaede: 3 }, set: 'dl_k4', then: [['say', K, "A speedster tripping over a shoelace. A legend. I'm telling the kids it was a dramatic roll.", 'laugh']] },
      { t: "“You taught me to run. I taught you to walk. Fair trade.”", set: 'dl_k4', then: [['say', K, "Best deal I ever made. I'd take it again. Slowly.", 'love']] },
      { t: "Hold out your hand. “Walk with me. Just to the gate.”", set: 'dl_k4', then: [['say', K, "To the gate. At a walk. …Okay. Okay, I can do this.", 'tender']] }
    ]],
    ['n', "You walk. It takes eleven minutes. For a woman who can cross the city in four seconds, it's the longest and best walk of her life."],
    ['say', K, "Look at that. The moon's right there. It was always right there. I was just too fast to see it.", 'awe'],
    ['sfx', 'heart'], ['fx', 'hearts'],
    ['n', "At the park gate she stops. No sprint. No bet. She puts her forehead against yours and just stays."],
    ['say', K, "Finish line.", 'love'],
    ['n', "You'll tell her it was a tie. She'll insist she won. It's the best argument you'll ever lose."]
  ]);
  reg('kaede');
})();

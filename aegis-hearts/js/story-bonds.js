'use strict';
// Bond scenes: three per heroine, played from the Lounge.
AH.compile(String.raw`
// =================== AKARI ===================
# bond_akari_1
@call tired
@bg lounge
@music daily
@sfx fire
> There's a smell of burning in the lounge. It is coming from the microwave. The microwave is not switched on.
@show akari shock down center
a shock down: I didn't do it! Okay, I did it. I was just warming up my lunch by hand, and I got excited thinking about training, and—
y: Is that... was that a bento?
a sad down: It was. Now it's charcoal with a pickled plum in it.
> I buy two curry breads from the machine and hand her one. She looks at it like I've given her a medal.
a sparkle fists: You're a lifesaver! Literally my job, and you beat me to it!
> We sit. She eats the way she fights — everything at once.
y: Can I ask you something? Why a hero? With output like yours, you could have gone into energy, research, anything.
a smile chest: Oh, that's easy. First Rift. I was six. Our whole street was dark and there was this *thing* at the end of it.
a smile down: And then there was a lady in gold standing in front of us. Daybreak. She lit up the entire road. I remember thinking, "it's morning, she made it morning".
a shy chest: She retired years ago. But I still want to be that. For some kid on some dark street. I want to be the one who makes it morning.
?
* "You already were. Monday, at the crossing." -> ba1_a
* "Then let's make sure you can aim the sunrise." -> ba1_b
# ba1_a
y: You already were. There was a kid behind me at the crossing. I heard the mother. You were standing in front.
a surprised down: ...I didn't even think about that. I was just yelling at the monster.
a shy chest: Huh. I made it morning. A little bit. ...Thanks, {name}.
@aff akari 8
@jump ba1_end
# ba1_b
y: Then let's make sure you can aim the sunrise. I don't think Daybreak hit many hospitals.
a laugh fists: ONE hospital! One WING! Empty!
a grin fists: But yeah. Deal. You point, I shine.
@aff akari 5
@jump ba1_end
# ba1_end
a happy wave: Same time tomorrow? I'll bring lunch! Pre-cooked! By someone else!
@jump slot_end

# bond_akari_2
@call tired
@bg training 2
@music sad
> The training hall should be empty at this hour. It isn't. There's one light on, and the sound of someone hitting a target again and again.
@show akari serious power center
a serious power: Tighter. Tighter! Come on—
@sfx fire
@flash #ff8a2a
> The flame leaves her hand as a line and ends as a fireball. The target, the wall behind it and a section of the ceiling all glow orange.
a sad down: ...Still too big.
y: Akari. It's past ten.
a surprised down: {name}! I was just... a little extra. For Friday.
> She puts her hands behind her back. Not fast enough. They're red and blistered to the wrist.
y: Show me.
a sad down: It's nothing. It happens when I try to hold it in. Fire doesn't like being squeezed.
> I get the first aid kit off the wall. She lets me wrap them, which I suspect is unusual.
a sad chest: ...Do you know why the fifth Handler quit?
a sad chest: It was a rescue drill. I flared wide, and Rei was on my left. She got a shield up, so it was only her sleeve. But she looked at me like I was the Rift.
a cry chest: I don't *want* to be the scary part of the fight, {name}. I just want to be warm.
?
* "You stopped when I called, on Monday. You can be trusted with it." -> ba2_a
* "Then stop squeezing. Let me aim, and you just burn." -> ba2_b
# ba2_a
y: On Monday you had every reason to throw everything you had. I said "tight" and you gave me a wire. First time, to a stranger.
y: That isn't somebody who can't be trusted with fire. That's somebody who's been going without a Handler.
a blush chest: ...You really think so?
a smile chest: Okay. Then I'll trust the me that you see. She sounds way cooler than the one I've got.
@aff akari 8
@jump ba2_end
# ba2_b
y: Then stop trying to squeeze it. That's my half. I'll pick the direction and the moment. You just be as bright as you are.
a surprised down: I'm... allowed to do that?
a happy fists: That's so much easier! Why did nobody say that eleven Handlers ago?!
@aff akari 6
@jump ba2_end
# ba2_end
a shy chest: Hey. Thanks for the bandages. You're kind of bad at it. They're all lumpy.
a smile wave: I'm keeping them on anyway.
@jump slot_end

# bond_akari_3
@call tired
@bg rooftop
@music tender
@show akari smile down center
a smile wave: Over here! I wanted to show you before training!
> She's sitting on the low wall by the water tank, legs swinging, hands unwrapped. Healed, more or less.
a grin fists: Okay. Watch. No — watch *properly*, the way you do.
@sfx fire
> She holds her finger up. A flame the size of a birthday candle sits on the tip of it. It doesn't flicker.
a smile chest: Twenty-two seconds is my record. I get there by thinking about your voice. "Tight. On my call." Like that.
y: That's incredible control, Akari.
a blush chest: Ehehe. Also, um. Mio says when a hero and a Handler sync up this well, there's a word for it.
y: A word?
a shy chest: "Partners." It goes on the registry and everything. It means the hero only takes calls from that one Handler.
a blush chest: I've never had one. I never wanted one, with the other eleven. But...
?
* "Partners. I'd be honoured." -> ba3_a
* "Only if I get to pick your finishing move's name." -> ba3_b
# ba3_a
y: Partners. I'd be honoured, Akari.
a sparkle fists: REALLY?! I was so sure you'd say you needed to "think about the paperwork"!
a shy chest: ...Partner. Hehe. Partner partner partner. Okay, I'll stop. No I won't.
@aff akari 10
@jump slot_end
# ba3_b
y: Only if I get a veto on the finishing move names. "Mega Sun Punch Deluxe" doesn't make it to Friday.
a shock down: But "Deluxe" is the best part!
a laugh fists: Fine! FINE! You name it! That's what partners are for!
@aff akari 8
@jump slot_end

// =================== REI ===================
# bond_rei_1
@call tired
@bg office
@music daily
> There's a knock at my office door. Exactly three raps, evenly spaced.
@show rei cool crossed center
r cool crossed: Handler. I have reviewed your comm logs from this week. I have notes.
> She puts a document on my desk. It's stapled. It has an index.
y: ...This is fourteen pages.
r serious crossed: Page three: you call Hinata's name before mine in eighty percent of sequences. Page six: your "on my mark" comes in at inconsistent intervals. Page nine—
y: You timed my intervals?
r cool crossed: Naturally. I am a Shirayuki. My grandmother sealed the Second Rift. My mother held the northern line for nine years. My sister is ranked third in the country.
r neutral down: We do not rely on calls. We are expected to be flawless without them.
> She says it like a weather report. Her hands are folded so tightly that the knuckles have gone white.
?
* "These are good notes. Help me fix them." -> br1_a
* "That sounds exhausting, Shirayuki." -> br1_b
# br1_a
y: These are good. Really. Page six especially, I had no idea I was doing that. Go through them with me?
r surprised down: You... want the criticism?
y: You watched me closely enough to write fourteen pages. I watch people for a living. It's sort of a compliment.
r blush chest: It was not intended as... I will get a second chair.
@aff rei 8
@jump br1_end
# br1_b
y: Flawless, alone, every time? That sounds exhausting.
r serious crossed: It is the standard.
r neutral down: ...It is also exhausting. That is not on any of the fourteen pages.
@aff rei 6
@jump br1_end
# br1_end
> We work through the document until the light in the window changes. She corrects my timing. I make tea in the office kettle.
r smile chest: This tea is mediocre. I will bring better leaves next time.
> (That's "next time", from somebody who told me she'd stopped learning Handlers' names.)
@jump slot_end

# bond_rei_2
@call tired
@bg lounge
@music sad
> The lounge is quiet. Rei's standing in front of the vending machine. She isn't buying anything. She's just standing there.
@show rei sad down center
> There's a coin in her hand. The whole front of the machine is coated in a thin sheet of frost.
y: Shirayuki?
r surprised down: !
@sfx ice
r serious crossed: I was choosing. The machine malfunctioned. It is unrelated to me.
y: It's frozen solid.
r sad down: ...It is slightly related to me.
> I sit down on the sofa. After a long moment she sits too, at the far end, very straight.
r sad chest: It happens when I cannot decide. When there is no correct answer. Milk tea or green. It is absurd.
r sad chest: My first Certification, two years ago. A hostage scenario, with two valid approaches. I could not determine which was optimal.
r cry chest: So I froze. Literally. The whole arena. My teammates were inside it. They were unharmed, but they asked not to be put with me again.
r sad down: A Shirayuki does not fail a Trial. So officially I "deferred". My sister has not rung me since.
?
* "Then I'll decide. That's what the earpiece is for." -> br2_a
* Buy both teas and hand her one. -> br2_b
# br2_a
y: Then don't decide. When there are two right answers and no time, I'll pick. I might pick wrong. But you won't be standing there alone with it.
r surprised down: You would take on the error yourself?
y: That's the job. You get to be good. I'll be the one who's sometimes wrong.
r blush chest: ...That is the first description of a Handler I have found persuasive.
@aff rei 8
@jump br2_end
# br2_b
@sfx coin
> I knock the frost off the coin slot and buy one of each. I hold both out.
y: There. No wrong answer. Take whichever, I'll have the other.
r surprised down: That is... not a solution to the general case.
r shy chest: ...Milk tea. Thank you. It is warm.
@aff rei 7
@jump br2_end
# br2_end
> The frost on the machine has started to bead and run.
r smile chest: {name}. On Friday. If I hesitate...
y: I'll call it. Before you have time to.
r smile chest: Then I will listen. You have my word, and a Shirayuki's word is... no. *My* word. Just mine.
@jump slot_end

# bond_rei_3
@call tired
@bg rooftop 2
@music night
> The message said: "Roof. 21:00. Bring a coat. — S.R." No index this time.
@show rei neutral crossed center
r neutral crossed: You are four minutes early. Good.
y: What are we doing up here?
r cool crossed: A demonstration. I have been practising something that is not in the Shirayuki curriculum.
@sfx ice
@flash #d6f4ff
> She lifts one hand. The air above the roof goes soft and white, and it starts to snow. Only here. Only on this rooftop, in a slow, quiet circle around the two of us.
y: ...Rei, this is—
r blush chest: Inefficient. Tactically worthless. My grandmother would be appalled.
r smile chest: I wanted to make something that was not for hitting anything. I did not know whether I could.
> A flake lands on my sleeve. It's perfect. It doesn't melt.
r shy chest: I also wished to say something. I have rehearsed it. Please do not interrupt, or I will lose my place.
r blush chest: You called my name first on Wednesday. I checked the log. I found that I had been waiting for it.
?
* "I'll keep calling it. As long as you'll answer." -> br3_a
* "You said it was inefficient. I think it's the best thing I've seen all week." -> br3_b
# br3_a
y: Then I'll keep calling it. For as long as you want to answer.
r surprised down: ...That was not in my rehearsal. I have no prepared response.
r shy chest: I will improvise. "Yes." Is that acceptable?
@aff rei 10
@jump slot_end
# br3_b
y: I've watched ten thousand hours of heroes. This is the best thing I've seen any of them do.
r blush crossed: You are exaggerating. Do not stop.
r smile chest: ...Next time I will make it snow for longer.
@aff rei 8
@jump slot_end

// =================== MIO ===================
# bond_mio_1
@call tired
@bg lounge
@music daily
> The lounge looks empty. One corner of the sofa is a bit darker than it ought to be, though, and it's making small button-mashing noises.
y: Mio?
@sfx shadow
@show mio surprised down center
m surprised down: !! ...how. I was in full stealth. Nobody finds me in full stealth.
y: The shadow was humming a boss theme.
m blush chest: ...
> My phone buzzes. "ok that one's on me"
> She's holding a handheld console. Two-player co-op. One player slot is flashing "WAITING".
y: Is that Starfall Raiders? The co-op one?
m surprised down: You know it?
y: I've watched a lot of people play it. Never actually played it myself.
m smug hip: ...Sit. I'll carry you. Don't touch the red barrels.
> I immediately touch a red barrel.
m shock down: WHY.
?
* "Tell me what to do. You call it, I'll follow." -> bm1_a
* "Sorry! I panicked!" -> bm1_b
# bm1_a
y: Okay, okay. Tell me what to do. You call it, I'll follow. I hear that works.
m surprised down: ...I call it?
m smile chest: Left. Jump. Now shoot. No — *other* left. ...Good. That was good.
> She talks me through three whole stages. Out loud, in full sentences. I don't mention it, in case it stops.
@aff mio 8
@jump bm1_end
# bm1_b
y: Sorry! I panicked!
m laugh fists: Pfff— "I panicked". You tell three superheroes what to do at a class three, and a barrel beats you.
m smile chest: ...It's okay. I'll carry. I'm used to carrying.
@aff mio 6
@jump bm1_end
# bm1_end
m shy chest: ...That was fun. People don't usually stay. They can't find me, so they leave.
m smile chest: You can have the player two slot. If you want. It doesn't expire.
@jump slot_end

# bond_mio_2
@call tired
@bg command
@music sad
> I need a file from the command room. The lights are on low. And one of the big monitors is running old footage that isn't in any archive I've ever seen.
@show mio sad down center
> It's a missing-child bulletin. Nine years old. A small girl in a cat-ear hood. Three days missing, found unharmed.
y: Mio... is that you?
m sad down: ...yeah.
m sad chest: That's when my Spark woke up. I was hiding from some kids at school. I leaned on a shadow, and it wasn't a wall any more.
m sad chest: It's quiet in there. No up or down. I could hear everyone outside, like through water. Teachers. My mum.
m cry chest: I shouted for three days. Nobody could hear me. And then one day I fell back out behind the gym, and the first thing someone said was, "oh, were you gone?"
> She pulls the hood strings tight.
m sad down: So I hide first now. If it's my choice, it doesn't count as disappearing. That's the theory.
?
* "I'd notice. In about four seconds." -> bm2_a
* "You don't have to come out. Just leave the channel open." -> bm2_b
# bm2_a
y: I'd notice. I noticed you behind a plant on day one. I notice when you're in the ceiling. I'd know you were gone in about four seconds.
m surprised down: ...four seconds?
y: I watch things. It's all I've got. And you're on the list of things I'm watching now.
m blush chest: ...That's a creepy thing to say. Say it again some time.
@aff mio 8
@jump bm2_end
# bm2_b
y: You don't have to come out. Hide as much as you like. Just leave the channel open, so I can always hear you from in there.
m surprised down: ...You'd talk to a shadow?
y: I talk to videos. A shadow's a step up.
m laugh fists: Pff. Okay. That's fair.
@aff mio 7
@jump bm2_end
# bm2_end
> She switches the bulletin off. The screen goes back to the city map and its quiet blinking lights.
m shy chest: Handler. If I ever go in and it's three days again...
y: I'll be yelling at the wall the whole time. With a megaphone. It'll be embarrassing for everyone.
m smile chest: ...Okay. Then I think I can blink a bit further on Friday.
@jump slot_end

# bond_mio_3
@call tired
@bg rooftop 1
@music tender
> My phone buzzes. "roof. no shadows this time. promise. dont laugh"
@show mio shy chest center
> She's standing right in the middle of the roof, in the last of the sunlight. No railing shadow, no water tank shadow. Just her, hood down, headphones around her neck.
m shy chest: ...I've been standing here for six minutes. In the open. Where a satellite could see me.
y: How is it?
m blush chest: Horrible. My knees are doing something weird.
m smile chest: But I wanted to try it. Being somewhere on purpose. Being... findable.
> She takes two steps and gets a careful hold on the end of my sleeve. Just the cuff.
m shy chest: Anchor. So I don't blink away by reflex. Don't make it weird.
?
* Stay still. Let her hold on. -> bm3_a
* "Player two's not going anywhere." -> bm3_b
# bm3_a
> I don't move. The sun goes down by inches. Her knees stop doing the weird thing.
m smile chest: ...You're good at this. Standing there. Most people fill it up with words.
m blush chest: I can hear myself think when you're around. And it's not scary thoughts. That's new.
@aff mio 10
@jump slot_end
# bm3_b
y: Player two's not going anywhere. Slot doesn't expire, remember?
m surprised down: ...you remembered that.
m shy chest: Yeah. Okay. Then player one isn't going anywhere either.
@aff mio 8
@jump slot_end
`);

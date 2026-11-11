'use strict';
// Script format:  # label   @command args   > narration   id [expr [pose]]: line   ? prompt   * choice -> label
// Speakers: a = Akari, r = Rei, m = Mio, t = Director Sakaki, y = you, [Name] = anyone else.
AH.compile(String.raw`
# prologue
@chapter Prologue
@call simOff
@music stop
@bg black
@card PROLOGUE | The Sky Tears | Kisaragi City · 6:42 PM
@music night
@bg city_sunset
> Twelve years ago, the sky over Kisaragi City cracked open for the first time.
> Things came out of the cracks. Not long after, so did the people who could fight them.
> We call the cracks *Rifts*. We call the power *Spark*. We call the people who have it heroes.
> And we call people like me "bystanders". Usually with a megaphone, while telling us to move back.
@call name
y: Forty-one applications. Forty-one "we regret to inform you"s.
> (That's me. {name}. Twenty-four. As of five o'clock this afternoon, formerly employed.)
> (The logistics company was very nice about it. They gave me a box for my desk things. I did not have enough desk things to fill the box.)
y: ...At least the walk home is free.
> The evening crowd flows around me. Up on the big screen over the crossing, a recruitment ad for the hero agencies is playing again.
[Billboard]: "AEGIS — the shield of Kisaragi. Because someone has to stand in front."
> (AEGIS. The top agency in the city. I know every hero on their roster.)
> (Not because I'm a fan. Okay — not *only* because I'm a fan.)
> (I watch the fights. Frame by frame, over and over. Where the hero stood. Where they should have stood. The half second where the beast's guard opened and nobody moved.)
> (It's a useless hobby. You can't put "yells at videos" on a resume. I checked.)
? The ad loops again. A hero in white smiles down at the street.
* "Must be nice, having a Spark." -> pro_a1
* "They left their flank open in that clip, you know." -> pro_a2

# pro_a1
y: Must be nice. Wake up one day, and you can lift a bus.
> (No Spark ever woke up in me. I checked that too. Every birthday until I was nineteen.)
@jump pro_b

# pro_b
> I shift the half-empty box under my arm and wait for the light to change.
@music stop
@sfx rumble
@shake 0.8
> ...The light does not change.
> The light goes *out*.
@bg city_night - keep
y: Huh? A blackout? But the sun was still—
@sfx alarm
[Siren]: "RIFT WARNING. RIFT WARNING. THIS IS NOT A DRILL. PROCEED TO THE NEAREST SHELTER."
> Every phone on the street goes off at once. Every head tilts up.
@sfx rumble
@shake 1.2
@flash #ff2a6a
@music tension
@cg rift
> The sky over the crossing splits like a seam giving way.
> Red light pours through. Then a shape, hauling itself out of the tear one claw at a time, bigger than the buildings it's climbing over.
[Crowd]: "Run! RUN!"
> (A Rift. A real one. Right here. Class three at least — look at the size of that thing.)
> (Move, {name}. Shelter is two blocks back. You know the drill, you've heard it a thousand times.)
> People stream past me. Somebody's shoulder clips my box and my three desk things scatter across the road.
> And I just stand there, like an idiot, doing the only thing I've ever been good at.
> (Watching.)
@cg off
@bg city_attack
> The beast drops into the street. The asphalt buckles. A delivery van slides sideways into a lamp post.
> There's a kid's voice somewhere behind me. A mother shouting a name. Nobody in a cape. Nobody in white.
y: Where are the heroes? There's an AEGIS patrol route right through this ward, there should be—
[???]: HEEEEY! UGLY!
@sfx fire
@flash #ffb040
@show akari angry fists center
> A streak of orange lands between the beast and the crowd, skidding, one hand on the ground, hair blazing like a fuse.
a angry fists: Pick on somebody your own size! Or — okay, nobody is your own size! Pick on *me!*
> (...I don't know her.)
> (I know every licensed hero in this city, and I do not know her. No registry number on the jacket. A *trainee* armband.)
y: A trainee? They sent a trainee against a class three?!
a grin power: Don't worry, everybody! Solar Flare is on the scene! I've totally got this!
@sfx fire
@flash #ff8a2a
@shake 0.4
> She throws fire. A lot of fire. A truly irresponsible amount of fire.
> It washes over the beast's back, lights up half the block... and the thing doesn't even slow down.
@sfx impact
@shake 0.7
a shock down: Wha— that was my big one!
> The claw comes down. She barely rolls clear. The second swipe sends her skidding into a bus stop.
@sfx impact
@shake 0.5
@hide akari
> (She's strong. That output is ridiculous for a trainee. But she's just throwing it at the biggest part of the target.)
> (Its back is armour. Every Rift beast with those spines is armoured on top. You can't burn through that, you have to—)
> (Wait.)
@music stop
@sfx scan
@cg insight
> The noise of the street drops away. It always does, when I look properly.
> (It rears up before every swing. Every time. Same tell.)
> (And when it rears... there. Under the jaw. The plates pull apart.)
@sfx lock
> (*A seam.*)
> (It's open for half a second. She'd have to already be moving. She'd have to be told *before* it rears.)
> (She can't see it from where she is. Nobody can see it from there. Only from here.)
? The beast turns toward the trainee. She's getting up slowly.
* Shout to her. -> pro_shout
* Run toward her. -> pro_run

# pro_a2
y: Flank's wide open in that clip. If the beast had turned left instead of right, that's a hospital visit.
> A man next to me gives me a look. I get that look a lot.
> (It's true, though.)
@jump pro_b

# pro_shout
@cg off
@bg city_attack
@music battle
y: HEY! SOLAR FLARE!
@show akari surprised down center
a surprised down: Huh?! Civilian?! You have to get out of—
y: UNDER THE JAW! When it rears up, the plates open! Don't hit the back — wait for it to rear, then go LOW!
@jump pro_fight

# pro_run
@cg off
@bg city_attack
@music battle
> My legs are moving before the rest of me agrees to it.
@sfx step
@show akari shock down center
a shock down: What are you DOING?! Get back, it's dangerous!
y: I know it's dangerous! Listen — under the jaw! When it rears up, the plates open! Stop hitting the back!
@jump pro_fight

# pro_fight
a surprised down: Under the... how do you even know that?!
y: I watch a lot of videos!
a shock down: THAT'S YOUR ANSWER?!
@sfx rumble
@shake 0.6
> The beast lowers its head and starts to wind up. Same tell. Same rhythm.
y: It's going to rear. Three seconds. Don't throw everything — one shot, tight, straight up. Can you do tight?
a pout down: I... tight isn't really my...
y: Two seconds! You've got this. On my call!
> She stares at me for one more heartbeat. Then something in her face sets. She plants her feet.
a serious power: ...On your call.
@sfx rumble
@shake 0.4
> The beast rears. The plates under its jaw slide apart, and the red light inside shows through.
?
* "NOW!" -> pro_now

# pro_now
y: NOW!
@hidebox
@sfx fire
@flash #ffffff
@cg firstlight
@shake 0.8
> She doesn't throw the fire this time. She *aims* it.
> One line of white-gold light, thin as a wire, straight up through the seam.
@sfx impact
@shake 1
@flash #ffe080
> The beast comes apart from the inside like a lantern catching.
> For a second the whole street is lit the colour of morning.
a grin power: I... I did it. I DID IT! Did you see?! One shot!!
> She turns around, grinning so wide it takes up most of her face, a little flame still dancing in her palm.
> (I've watched ten thousand hours of heroes. Not one of them ever looked back at me.)
@cg off
@music tender
@bg city_night
@show akari happy wave center
a happy wave: You! Video guy! That was *amazing!* "Go low", "on my call" — you sounded just like a real Handler!
y: A what?
a smile down: A Handler! The person in a hero's ear. They see the whole fight, so the hero only has to see what's in front of her.
a grin fists: I've never had one. I'm kind of... between Handlers. For a while. Like, eleven Handlers.
y: Eleven?
a pout down: They keep saying things like "liability" and "property damage" and "Akari, that was a *hospital*".
a shock down: It was an EMPTY wing of the hospital!
> (...I'm starting to understand the eleven.)
a smile chest: I'm Hinata Akari! Trainee, AEGIS Agency, Unit 7. Hero name Solar Flare. And you are?
y: {name}. Unemployed, logistics. Hero name... no.
a laugh fists: Ahaha! Okay, {name}-no! Nice to meet you!
[???]: Trainee Hinata.
@sfx step
@music tension
> The voice isn't loud. It doesn't need to be. Akari goes rigid like someone's put ice down her collar.
@show akari shock down left
@show touko serious crossed right
t serious crossed: Unauthorised engagement with a class three. No backup. No Handler. In a populated crossing.
a shock down: D-Director Sakaki! I can explain! There was a kid, and the patrol was six minutes out, and I was *right there*, so—
t cool crossed: And yet. No casualties. Minimal damage. One clean shot through a jaw seam that our own analysts did not flag until the after-action replay.
> Her eyes move from Akari to me. Red, behind thin glasses. I feel like a document being read.
t cool hip: That was not your idea, Hinata.
a sad down: ...No, ma'am.
t neutral hip: You. The one with the empty box.
y: Me?
t neutral think: Sakaki Touko. Director of Operations, AEGIS. I was watching from the tower feed. You called the seam four seconds before our system did.
t neutral think: No Spark. No training. I ran your face while I was walking over. A logistics temp. Contract ended today.
y: You ran my— is that legal?
t smile hip: I am the one who decides that, in this ward.
> (...Right.)
t serious crossed: I will be brief. I have a unit of three trainees. Enormous output. Nobody can make them work. Eleven Handlers have quit.
a pout down: It's really more like nine and two transfers...
t cool crossed: Their Certification Trial is in one week. If they fail, Unit 7 is dissolved and all three lose their provisional licences. Permanently.
a sad down: ...
t neutral think: I need someone who can see what you just saw, and say it out loud at the right second. I do not especially care whether that someone has a Spark.
t smile hip: I am offering you a job, {name}. Handler, Unit 7. It pays better than logistics. The hours are appalling.
? Five minutes ago I was unemployed.
* "I'll do it." -> pro_yes
* "I'm just a guy who watches videos..." -> pro_doubt

# pro_yes
y: I'll do it.
a sparkle fists: REALLY?!
t smile hip: No questions about hazard pay? Insurance? Whether the previous eleven survived?
y: ...Did they?
t cool crossed: Physically.
@jump pro_end

# pro_doubt
y: I'm just a guy who watches videos. I've never done anything like that before in my life.
t neutral think: Correct. And the first time you did, it worked. I find that more interesting than a certificate.
a smile chest: {name}. Hey.
a smile chest: When you yelled... it was the first time in a fight I wasn't scared I'd hit the wrong thing. I just listened. It was *easy*.
a happy fists: So I vote yes! I know I don't get a vote! I vote anyway!
y: ...Okay. I'll do it.
@aff akari 3
@jump pro_end

# pro_end
t smile hip: Good. Eight o'clock tomorrow, the tower. Hinata will meet you in the lobby. Do not let her "show you a shortcut".
a pout down: The shortcut is FINE, it's just technically a ventilation shaft—
t cool crossed: Hinata. Incident report. On my desk. Tonight.
a shock down: Yes ma'am!!
@hide touko
@music tender
@show akari smile down center
> The Director walks back toward a black car I hadn't noticed. Sirens are arriving now, late, the way they do.
a smile chest: Hey, {name}?
y: Yeah?
a shy chest: Thanks. For not running. Everyone runs. That's sort of the point of us.
a grin wave: See you tomorrow, *Handler!*
@hide akari
> She jogs off backwards, waving, and almost trips over what's left of my box.
> (A hero looked back at me today.)
> (I think my useless hobby just became a job.)
@music stop
@fade out
@bg black
@fade in
@jump ch1
`);

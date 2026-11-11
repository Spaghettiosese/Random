'use strict';
AH.compile(String.raw`
# ch1
@chapter Chapter 1 — Unit 7
@call simOff
@card CHAPTER 1 | Unit 7 | Five days until the Certification Trial
@music daily
@bg lobby 0
> AEGIS Tower. Sixty floors of glass, with a ring of blue light around the top that you can see from anywhere in the city.
> I've walked past it a thousand times. I have never once been on this side of the doors.
y: (Visitor pass. Shirt ironed. Box left at home. Okay. You can do this.)
[???]: {name}-NOOO!
@sfx step
@show akari happy wave center
a happy wave: You came! You actually came! I told them you'd come! I bet Mio a pudding!
y: Morning, Akari. It's just {name}, by the way.
a grin fists: Too late, it's in my phone. Come on, come on, everyone's waiting! Well. "Waiting". They're here, physically!
@hidebox
@music stop
@sfx chime
@cg unit7
@music title
> She pulls me around the reception desk, and there they are.
> Three trainees. Three provisional licences. One week.
a happy wave: Unit 7, assemble! Sort of!
@cg off
@bg lobby 0
@music daily
@show akari smile down center
@show rei cool crossed left
r cool crossed: So this is the twelfth.
y: The twelfth?
r cool crossed: Handler. I have stopped learning their names. It saves time.
a pout down: Rei! Be nice! He's the one from the crossing!
r neutral crossed: I read the report. A civilian shouted and you happened to hit something. Statistically, that will occur now and then.
r serious crossed: Shirayuki Rei. Hero name Frostbite. I do not require handling. I require people to stay out of my lines of fire.
> (Shirayuki. As in *the* Shirayukis? Three generations of top-ten heroes?)
> (Her stance is perfect. Textbook. ...She's also standing exactly as far from the other two as the room allows.)
@show mio surprised down right
> And behind a potted plant, there's a hood with cat ears on it.
y: ...Hello?
m surprised down: !!
@sfx shadow
@hide mio
> The hood sinks into its own shadow and is gone. My phone buzzes.
[Phone]: "hi. im mio. kurose mio. hero name umbra. sorry. i dont do talking before noon. or after. nice to meet u"
y: Did she just text me from inside a shadow? How does she have my number?
a smile down: Oh, Mio has everybody's number. It's fine! She's really nice once she stops being a puddle!
@show mio shy chest right
m shy chest: ...puddle is a strong word...
@sfx step
@hide akari
@hide rei
@hide mio
@show touko neutral hip center
t neutral hip: Good. You have met. Nobody is on fire. That is already better than the eleventh.
t serious crossed: I will say this once, to all four of you.
@show touko serious crossed center
t serious crossed: Friday evening. The Certification Trial. A live exercise in front of the licensing board, scored as a unit.
t cool crossed: Hinata has the highest raw output of her year and cannot hit a wall on purpose.
t cool crossed: Shirayuki has flawless control and has never once completed a team exercise, because she freezes her own teammates out of her way.
t cool crossed: Kurose could end most fights in four seconds and has spent every graded exercise so far hiding in the ceiling.
t neutral think: Individually, you are the three most gifted trainees I have. As a unit, you are last. By a distance.
> Nobody says anything. Akari looks at her shoes. Rei looks at the window. I assume Mio is looking at something, somewhere.
t smile hip: {name}. You have five days. Train them. Talk to them. Deploy them when the board lights up. I do not care how you do it.
t smile hip: Make them a unit. If you can, there's a permanent contract in it for you. If you can't — well. You have experience job-hunting.
y: ...No pressure, then.
t cool crossed: A great deal of pressure. That is the job.
@hide touko
@show akari smile down center
a smile chest: She likes you! That was her nice voice!
y: That was the *nice* voice?
a grin fists: So! Handler! What do we do first?
> (Three heroes. Fifteen time slots. One Trial.)
> (Training hall to build them up. Lounge to actually get to know them. Command room when there's work. My office when I'm falling over.)
> (Okay, {name}. Watch closely. It's the only thing you've ever been good at.)
@call simOn
@jump slot_end

# hub
@call hub

# slot_end
@call advance

// ---------- repeatable activities ----------
# act_train
@call train
@jump slot_end

# act_mission
@call mission

# mission_after
@if v.win && v.who=='akari' -> ma_a
@if v.win && v.who=='rei' -> ma_r
@if v.win && v.who=='mio' -> ma_m
@if v.who=='akari' -> ml_a
@if v.who=='rei' -> ml_r
m sad down: ...it saw me. They're not supposed to *see* me.
y: You got out clean, and the cordon held. That counts. We'll read it better next time.
m shy chest: ...next time. okay.
@jump slot_end
# ma_a
a happy wave: Mission clear! And look — the street's still there! All of it!
y: Zero property damage. I'm putting that in the report in capital letters.
a grin fists: Put a little flame next to it!
@jump slot_end
# ma_r
r smile chest: Sealed. No injuries, no collateral.
y: You waited for my call on that last one.
r cool crossed: It was the correct call. I would have made it myself half a second later.
r blush chest: ...Half a second can matter. I am aware.
@jump slot_end
# ma_m
m smug hip: Target down. No one even knew I was there. Stealth run, S rank.
y: I knew you were there.
m blush chest: ...You don't count. You always know.
@jump slot_end
# ml_a
a sad down: I got impatient. I threw the big one when it was guarding, didn't I.
y: A little. You pulled back when I said to, though. Eleven Handlers ago, would you have?
a smile chest: ...No. Okay. Next time I wait for it.
@jump slot_end
# ml_r
r serious crossed: Unacceptable. I misjudged the timing.
y: *We* misjudged it. I was the one calling.
r surprised down: ...You are taking the blame?
r cool crossed: Illogical. But noted.
@jump slot_end

# act_paper
@bg office
@call paper
> Incident forms. Damage estimates. A request, in triplicate, for the training hall's fire suppression system to be "upgraded, again".
> (Nobody makes videos about this part of hero work. I find I don't mind it.)
@jump slot_end

# act_rest
@bg office
@call rest
> I put my head down on the desk for "five minutes".
> ...
> (That was not five minutes. I feel a lot better, though.)
@jump slot_end

# act_gift
@bg lounge
@call gift
@if v.who=='akari' -> gift_a
@if v.who=='rei' -> gift_r
@show mio surprised down center
m surprised down: The limited melon soda? They restocked?!
m smile chest: ...you remembered which one. Thanks, Handler.
@aff mio 6
@jump hub
# gift_a
@show akari sparkle fists center
a sparkle fists: Curry bread! *Hot* curry bread! You're the best Handler in the whole tower!
a laugh wave: I mean, I can heat it myself, but it's the thought!
@aff akari 6
@jump hub
# gift_r
@show rei surprised down center
r surprised down: Milk tea? For me?
r blush chest: I did not ask for... The unsweetened one. How did you know?
r shy chest: Thank you. I will drink it. Carefully.
@aff rei 6
@jump hub

# act_chat
@bg lounge
@call tired
@if v.who=='akari' -> chat_a
@if v.who=='rei' -> chat_r
@show mio smile down center
m smile chest: Co-op? I saved the hard stage for when you had time.
> We play until the lounge lights dim. She only disappears into the sofa cushions once.
@aff mio 3
@jump slot_end
# chat_a
@show akari happy wave center
a happy wave: {name}! Sit, sit! I was just thinking up finishing-move names. Tell me which ones are bad!
> All of them are bad. I tell her which ones are the *least* bad. She writes those down.
@aff akari 3
@jump slot_end
# chat_r
@show rei smile chest center
r smile chest: I have prepared tea. Two cups. ...It seemed efficient.
> We go over the week's footage together. She points out my mistakes. I point out hers. Neither of us minds.
@aff rei 3
@jump slot_end

// ---------- Day 3: first deployment ----------
# ev_deploy
@call simOn
@bg command
@music tension
@sfx alarm
> Wednesday. I'm two sips into a coffee when every screen in the command room turns red.
@show touko serious crossed center
t serious crossed: Breach in the Minato warehouse district. Class two, moving toward the residential line.
t serious crossed: Units 1 through 4 are across the river. Unit 5 is on medical stand-down.
y: Then who's closest?
t cool hip: You are.
y: They're trainees. They can't deploy without—
t smile hip: Without a Handler on comms and my signature. They have both. Congratulations on your first live operation, {name}.
@hide touko
@show akari grin fists center
@show rei serious crossed left
@show mio surprised down right
a grin fists: A REAL ONE! Finally! Let me at it!
r serious crossed: Stay out of my lane, Hinata. I will not thaw you out a second time.
m sad down: ...there's going to be a lot of people looking, isn't there...
> (Three of them, pulling in three directions. And one of me, with a headset.)
? What do I tell them?
* "Akari hits, Rei holds, Mio finishes. Nobody moves until I call it." -> dep_plan
* "I trust you. All three of you. Trust me back." -> dep_trust

# dep_plan
y: Akari hits. Rei holds the line. Mio finishes. And nobody — *nobody* — moves until I call it. Clear?
a happy fists: Clear!
r cool crossed: ...A defined role. Acceptable.
m smile chest: ...I like having a job. okay.
@set h.rei.aff += 2
@set h.akari.ctl += 2
@jump dep_go

# dep_trust
y: I trust you. All three of you. I've watched you train for two days and I'd put you up against anyone in this building.
y: So trust me back. Just for one fight.
a shy chest: ...{name}...
r surprised down: You have known us for two days.
m blush chest: ...nobody's said that to us before. as a set.
@set h.akari.aff += 2
@set h.mio.aff += 2
@set h.mio.hrt += 2
@jump dep_go

# dep_go
@hidebox
@music battle
@bg city_attack
@sfx rumble
@shake 0.6
> The warehouse district. Smoke over the rooftops. A hound-shaped thing the size of a truck, pacing in front of the tear it crawled out of.
> I'm on a rooftop across the street, headset on, heart going like a drum.
y: Unit 7, this is Handler. I have eyes on. On my mark...
@flash #ffffff
@cg battle
> They move. For the first time since I've met them, they move in the same direction.
> Ice across the road to pin it. A flicker of shadow behind its head. And fire, one line, right where I told her.
a grin fists: LOW AND TIGHT, right, Handler?!
r serious power: Hinata, left side is clear. ...I am *telling* you it is clear. Go.
m smug power: ...Behind you, ugly.
> (Look at them.)
> (It's not over, though. It's adapting. Read it. Call it.)
@cg off
@hidebox
@call tutorialBattle
@bg city_sunset 1
@music tender
@show akari happy wave center
@show rei smile chest left
@show mio smile chest right
a happy wave: WE DID IT! A real one! As a TEAM! Rei said "go" to me! Out loud!
r blush crossed: I said it once. It was tactically necessary.
m smile chest: ...She said "nice blink" to me too. I heard it.
r pout crossed: I did not think the channel was open.
> They're scuffed, sooty, and one of Akari's sleeves is a bit frozen. All three of them are grinning. Even Rei, when she thinks nobody's checking.
y: That was good work. All of you. I mean it.
a laugh fists: Hear that?! "Good work!" Frame it! Put it on the wall!
@hide rei
@hide mio
@hide akari
@show touko smile hip center
t smile hip: Clean. Faster than Unit 4's last class two, if you'd like to be smug about it.
y: Maybe a little.
t neutral think: Don't. The Trial is not a hound in a car park. The board will be looking for a reason to fail them.
t smile hip: But. For the first time, I'm not certain they'll find one. Carry on, Handler.
@call simOn
@jump slot_end

// ---------- Day 5 morning ----------
# ev_friday
@call simOn
@bg office
@music sad
> Friday. I get in early. The Director is already in my office, standing by the window with two coffees.
@show touko neutral hip center
t neutral hip: One of these is yours. I guessed at the sugar.
y: Thanks. ...You didn't come up here to bring me coffee.
t sigh crossed: No. The board met last night. Two of the five have already decided.
t serious crossed: "Unit 7 is a waste of three licences and a training hall." Their words. They want the unit dissolved whatever happens tonight.
y: Whatever happens? Then what's the Trial *for?*
t cool crossed: For the other three. Who can still be shown something they cannot argue with.
> She turns from the window. For once she doesn't look like she's reading me. She just looks tired.
t neutral think: I was a Handler once, you know. Before the desk. My unit was a "waste of licences" too.
t smile think: One of them is ranked third in the country now. I still have the complaint letters.
?
* "They're going to pass. I've seen what they can do." -> fri_a
* "Why did you really pick me?" -> fri_b

# fri_a
y: They're going to pass. I've watched them all week. I know what I've seen.
t smile hip: Yes. That's the thing about you. You *look* at them. You'd be surprised how rare it is.
@jump fri_end

# fri_b
y: Why did you really pick me? There must have been a hundred qualified people.
t smile hip: A hundred qualified people looked at those three and saw problems to manage.
t neutral think: You stood in a street with a monster in it and looked at a girl you'd never met, and saw where she could win. I wanted that. It can't be taught.
@jump fri_end

# fri_end
t serious crossed: Tonight, seven o'clock, the Trial ground. Use the day well.
t smile hip: And {name}. Whatever the board decides — you did what eleven people couldn't. I wanted to say so before, not after.
@hide touko
> She leaves the second coffee on my desk. It has exactly the right amount of sugar.
> (One afternoon left. Then it's up to them.)
@jump slot_end

// ---------- finale ----------
# finale
@call simOn
@call best
@music stop
@fade out
@bg black
@fade in
@card CHAPTER 1 · FINALE | The Certification Trial | Friday · 7:00 PM
@bg rooftop 2
@music tension
> The Trial ground is the roof of the AEGIS annex. Floodlights. A scoring gantry. Five silhouettes behind glass, with tablets.
@show akari serious fists center
@show rei serious crossed left
@show mio sad down right
a serious fists: Okay. Okay okay okay. I'm calm. I'm so calm. Is it hot? I'm making it hot, aren't I. Sorry.
r serious crossed: Simulated class two, holographic. Three scoring phases. We have rehearsed every one.
m sad down: ...five of them. watching. with clipboards.
y: Hey. All three of you. Look at me, not at the glass.
? One thing to say before it starts.
* "Same as Wednesday. You already know how to do this." -> fin_a
* "Forget the board. Fight for each other." -> fin_b

# fin_a
y: Same as Wednesday. You've already done this for real. Tonight's just the version with paperwork.
a grin fists: Ha! Yeah. Paperwork can't even bite!
r smile chest: A fair assessment.
@jump fin_go

# fin_b
y: Forget the board. They're not who you're out there for. Look left, look right. *That's* who.
m shy chest: ...yeah. okay. for them.
r blush crossed: ...That is sentimental. And not incorrect.
a happy fists: UNIT 7!
@jump fin_go

# fin_go
[Examiner]: "Unit 7. Certification Trial. Begin on the tone."
@sfx lock
> The hologram flickers up in the middle of the roof. Blocky. Predictable. They take it apart in ninety seconds.
> I can see the tablets behind the glass. Two of the silhouettes aren't even writing.
[Examiner]: "Phase one complete. Phase two will—"
@music stop
@sfx rumble
@shake 1.2
> The floodlights go out.
> All of them. And then every window in the ward.
y: ...No. Not here. Not *now*—
@sfx alarm
@flash #ff2a6a
@cg rift
@music battle
> The sky above the annex tears open, wider than the one over the crossing. Much wider.
> What comes through it has to turn sideways to fit.
[Examiner]: "That is not part of the exercise! All trainees evacuate! Repeat, EVACUATE—"
@cg off
@bg city_attack
@show touko serious crossed center
t serious crossed: Handler. Class four. Units 1 and 2 are nine minutes out. The shelters under this building are full.
t serious crossed: I can't order trainees to hold against that. I won't.
@hide touko
@show akari serious fists center
@show rei serious power left
@show mio serious down right
a serious fists: You don't have to order us.
r serious power: Nine minutes. There are four hundred people under this roof.
m serious down: ...I'm not hiding from this one.
> They aren't looking at the glass any more. Or at the thing in the sky. All three of them are looking at me.
a smile chest: {name}. Call it.
> (Class four. I've only ever seen one on video. I watched that video sixty times.)
> (So look. Properly. It's the only thing you've ever been good at.)
@sfx scan
@cg insight
> (There. It guards before it charges. And after every charge... *a seam.*)
@sfx lock
y: Unit 7, this is Handler. On my mark.
@cg off
@hidebox
@call finaleBattle
@call best
@bg city_night
@music tender
@flash #ffffff
> The Gatekeeper folds in on itself and the tear seals behind it with a sound like a held breath let go.
> Then the floodlights come back. One at a time, the windows of the ward come back too.
@show akari laugh fists center
@show rei happy chest left
@show mio happy chest right
a laugh fists: WE BEAT A CLASS FOUR! US! THE WORST UNIT IN THE BUILDING!
r happy chest: Formerly the worst. I would like the record corrected.
m happy chest: ...I didn't hide. Did you see? I didn't hide once.
y: I saw. I saw all of it.
@hide akari
@hide rei
@hide mio
@show touko smile hip center
t smile hip: The board has voted. Five to nothing. Apparently it's hard to fail a unit that has just saved your life.
@if s.rep >= 75 -> fin_rank_s
@if s.rep >= 50 -> fin_rank_a
t neutral think: Rating *C*. The paperwork side wants work, Handler. But they are licensed. As of tonight, Unit 7 is a real unit.
@jump fin_after
# fin_rank_s
t smile think: Rating *A*. The highest a first-week unit has ever been given. I checked. Twice.
@jump fin_after
# fin_rank_a
t smile think: Rating *B*. For a unit that was last in the building on Monday, I'd call that absurd.
@jump fin_after

# fin_after
@sfx fanfare
t smile hip: And you. Permanent contract. It's on your desk. Read the hazard clause this time.
y: I'll read it twice.
t neutral hip: One more thing. That was the second class three-or-above this week, in a ward that sees one a year.
t serious crossed: Something is opening those doors on purpose. Chapter two of this job starts Monday. Get some sleep.
@hide touko
> She goes back toward the gantry and the five people with tablets, who have a lot of forms to fill in.
> And somebody tugs my sleeve.
@fade out
@music stop
@if v.best=='rei' -> end_rei
@if v.best=='mio' -> end_mio
@jump end_akari

# end_akari
@bg rooftop 1
@fade in
@music tender
@show akari smile chest center
a smile chest: Up here. Quick, before the others eat all the celebration food and come looking.
> The far side of the roof faces west. The sun's almost down, and the whole city's gone the colour of her hair.
a smile down: I used to come up here after every Handler quit. Eleven times. I'd sit right there and think, "maybe I'm just not the kind of fire anybody can use".
y: Akari...
a shy chest: And then some guy with an empty box yells at me in the middle of a street, and it's the easiest thing I've ever done.
@hidebox
@cg rooftop:akari
> She holds out her hand. A flame sits in her palm. Small. Steady. Barely bigger than a candle.
a: See? Tight. I've been practising. I wanted you to be the first to see it.
a: I don't burn the things I care about any more. I figured out how. It's when I know you're watching.
y: I'm always watching. It's pretty much my whole thing.
a: Ahaha. Yeah. I know.
a: So keep doing it, okay? Next week. And the one after. And... for a really long time after that.
a: That's an order from your hero. *Partner.*
@jump end_common

# end_rei
@bg rooftop 1
@fade in
@music tender
@show rei neutral crossed center
r neutral crossed: You may stand here. There is room.
> The far side of the roof faces west. She's at the railing with her arms folded, hair lifting a little in the wind, pointedly not looking at me.
r cool crossed: I have prepared an evaluation of your first week as Handler. It is fourteen pages.
y: Of course it is.
r blush chest: Thirteen of them are criticism. I will send those on Monday.
@hidebox
@cg rooftop:rei
> She unfolds her arms. In her cupped hands something is turning slowly in the last of the light — one snowflake, the size of a coin, every arm of it perfect.
r: The last page says only this. All my life I have been told to be flawless, alone. This week someone asked me to be good, *with* people.
r: It was considerably harder. I found that I prefer it.
r: Please hold out your hand. It will not melt. I have made quite sure of that.
y: It's beautiful, Shirayuki.
r: ...Rei.
r: You may call me Rei. I have decided. Do not make me say it a third time.
@jump end_common

# end_mio
@bg rooftop 1
@fade in
@music tender
> The far side of the roof faces west. There's nobody here. Just long evening shadows, and the wind.
y: ...Mio?
@sfx shadow
@show mio shy chest center
m shy chest: ...found me again.
y: You pulled my sleeve. That's sort of a hint.
m smile chest: Could've been anyone. You still said my name.
> She steps the rest of the way out of the shadow of the water tank. On purpose, into the light. I've never seen her do that when she didn't have to.
@hidebox
@cg rooftop:mio
m: When I was little, I fell into my own shadow for three days. Nobody noticed. I used to think that was the scariest part of my Spark.
m: Turns out I got it backwards. It's scarier to be seen. Five people with clipboards. A whole class four, looking right at me.
m: But I kept hearing you in the earpiece. "Mio, I've got you. Go." And I thought — okay. Somebody knows exactly where I am.
m: So I'm going to say this out loud. With my mouth. No texting.
m: I like it when you look at me, {name}. Just you is fine, for now. Keep doing it.
y: I'm not going anywhere.
m: ...Good. Me neither. That's kind of new for me.
@jump end_common

# end_common
> The sun goes down behind Kisaragi City. Somewhere below, the others are shouting for us, and something that sounds a lot like Akari has found the cake.
> A week ago I had a box and nowhere to carry it.
> (A hero looked back at me. And then two more did.)
> (I think I'll keep watching.)
@hidebox
@wait 2.5
@fade out
@cg off
@bg black
@call simOff
@fade in
@music title
@card END OF DEMO | To Be Continued | Thank you for playing AEGIS HEARTS\nChapter 2 — "Who Opens the Doors?"
@call toTitle
@end
`);

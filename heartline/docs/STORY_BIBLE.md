# Heartline Agency — story bible (rewrite)

The plot skeleton stays (12 chapters, Shibuya, Project Spark Harvest, the Board's "Kneel", 7 endings). What changes is the telling:
specific over generic, subtext over announcement, jokes that come from who is speaking, and a smaller, truer set of beats.

## House rules for every line
- No "Ehehe", no stage-laugh text, no all-caps shouting except once per chapter at most, no "Beep" more than once per BIT scene, no running "Convenience Store Guy / Genius" nicknames.
- Characters say what they would actually say. A confession is a logistics problem ("I moved the shift so you can sleep") before it is a speech.
- People interrupt, trail off, answer a different question, change the subject. Silence is a line (`'…'` is allowed, `'……'` is a held beat).
- Specific nouns: numbers, brand names of nothing in particular, times of day, the temperature of tea.
- Max one joke per beat, and it should reveal a person.
- The Handler (player) is dry, observant, bad at small talk. His lines are short. His `t` thoughts are factual first, feelings second.
- Exposition is delivered as an argument, a task, or a mistake, never as a lecture.

## Premise (kept)
One in ten thousand wake with a Spark. The Handler is Spark-negative: a night-clerk who keeps notebooks of fights (Vol. 37) and a blog (HandlerZero). HALO Agency hires him to run Squad Zero from the earpiece.
**Theme:** the one who stays behind. Heroes go; handlers wait on the radio. Aya sat in the van at Shibuya. Kyouya sat in a van. The Handler sits in a van. What does it cost to stay, and who carries the staying?
**Motif:** being carried vs. carrying. Hikari's mother carried people out. Tetsu carries everyone. Mira carries everyone's wounds. Rin was carried out and never got to say thanks.

## My twists
1. **The Notebook.** Every hero has *tells* the Handler learns by watching: small involuntary behaviours. A learned tell is logged in the Notebook (journal tab) and unlocks a *Read* in later scenes ("📓" lines) and in Fights. Characters notice that you notice — it's how trust is built.
2. **Two faces.** Sora has a stage face and a real one; Rin practises expressions; Rei's whole face works at one tenth volume; Kaede's smile always has a fang in it; Mira's smile reaches her eyes before her mouth. The art matches (pxface.js).
3. **The door.** HALO's Handler office has a door that doesn't close. Everyone has a theory. Saeki says "Doors break. It's a known property of doors." In the finale you fix it (or don't).
4. **The cat.** An alley cat behind the tower that likes no one. Rei calls it "Receipt". Running payoff through Rei's route.
5. **Chairman's "Kneel"** works on every license chip. The Handler has no chip. The player is the one thing the Board can't give an order to — and that is a flaw as much as a gift: *you also can't be promised anything by a chip*.

## Cast voices and tells

**Hikari Amane (19), Thunder Goddess.** Earnest, over-explains, corrects herself mid-sentence ("It isn't that I'm scared. It's — okay, I'm forty percent scared."). Counts things aloud when frightened. Goes quiet and exact when truly angry. Bad liar: volunteers extra detail. Wants to be *useful*, not famous. Mother: Natsuki Amane, rescue hero, carried 32 people out of Shibuya, then went back in. TELL: talks faster and counts when scared; volunteers detail when lying.

**Rei Kurogane (20), Nightveil.** Complete formal sentences, dry, literal sarcasm. Asks questions instead of stating. Hates compliments, shows care by logistics (tea, covering your blind side). Lost control of her shadows 3 years ago: partner Ren Ishida hospitalised for two months. Works alone as penance. Cat, rain, black tea. Laughs rarely, through her nose. TELL: touches the end of her scarf before telling the truth; goes completely still when afraid.

**Mira Solace (23), Halo Nurse.** Warm, wry; talks in schedules and dosages; dark humour about wounds; deflects with tasks. Her power moves a wound into her, as pain that arrives later. Nobody asked what she needs because she never says. TELL: tidies when hurting; "I'm fine — totally" with a mouth-only smile.

**Kaede Mori (20), Gale.** Fast talker, blunt, competitive about trivia; trash talk by the stopwatch; swears mildly. Fast heroes arrive first and watch — she got there first once and couldn't help. TELL: heel taps; when she's really hurt she goes quiet and *slow*, and everyone is frightened by that.

**Sora Hoshino (21), Stargazer.** Stage voice (polished soundbites, "Hiii~") vs real voice (flat, funny, tired). Texts at 3 a.m. in lowercase. Her agency treats her as inventory. TELL: hums off-key when not performing; the stage smile never moves her eyes.

**Tetsu Oda (27), Bulwark.** Ex-construction: load, tolerance, cure time, shear. Pays for everything, polite when angry. Three younger sisters. Steel skin means nothing touches him, so he has never decided what he's allowed to feel. TELL: gets quieter and more polite the angrier he is.

**Rin Aoi (17 in body, 8 years out of time), Echo.** Literal, curious, collects phrases and tries them on aloud, sometimes wrongly. Hears everything. Practises faces in the mirror. TELL: hums the note of whoever's nearest.

**Kyouya Aoi, the Glazier.** Gentle, ruined, polite; talks about Squad One in the present tense. Wants to keep everyone by making them unbreakable.

**Aya Takamine (35), Director.** Dry, tired, precise. Says "noted" when worried. TELL: takes off her glasses to clean them when she isn't telling you something.

**Natsuki Amane.** Hikari's mother. Practical, warm, blunt. "Live, kid. Prove me right."

**Shiori Kagami (22), Aegis Prime.** Procedural speech, perfect posture, obeys the chip. Straightens things. TELL: adjusts her cuffs before an order she dislikes.

**Chairman Genjirou Kuroda.** Teacher's voice, never raised. The worst thing he says is always kind.

**Deputy Saeki.** Deadpan bureaucrat who sabotages by obeying. "That's against policy. Anyway."

**B.I.T.** Deadpan literalism with a sincere core. Fewer "Beep"s.

## Engine contract (do not break)
Labels used by engine/systems: `prologue, ch1..ch12, chN_dayX, chN_afterX, chN_climax, finale, arc1_end, end_*, promise_*, eve_*, fin_*, save_*, true_end, epilogue, hang_<hero>_<n|x>, hang_generic`, events in `STORY.events`, `STORY.calls/callEvents/quips/synergy/phone/phoneFallback/feed/giftLine/trainQuip/profiles/items/codex/credits/chapterTitles/sceneNames/ach`.
Flags read by systems/dispatch: `c1_spores c2_prism c2_concert c3_trap1 c3_server c4_rei c6_hum c8_bridge c8_raid …` (set by `special.flag` in shift configs), `rogue restored hubbg`, `route`, `promise`, `good`, `city`, plus `aff` thresholds and hero ids. Keep script ops exactly as in engine.js `step()`.

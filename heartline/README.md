# HEARTLINE AGENCY

*A superpower-agency anime dating sim with Dispatch-style hero management. 12 chapters in two arcs, 40 in-game days, 7 endings. Roughly 6–8 hours for one playthrough.*

You're a Spark-negative night-shift clerk who spends his free time writing fight breakdowns of hero battles. After you talk a rookie hero through a Rift-beast attack outside your convenience store, the Director of the **HALO Agency** recruits you as a **Handler**. Your job is to train, deploy and keep alive **Squad Zero**, a team of gifted misfits. Then the Rift closes, a girl who vanished eight years ago falls out of it, an old man on the HALO Board tells every hero in the city to kneel — and you're the only one who doesn't.

Everything is procedural: the art is hand-built SVG and the music and sound effects are synthesized live with WebAudio. There are no image or audio files and no build step.

## Play

Open `heartline/index.html` in a browser (it works straight from disk), or serve the folder:

```bash
npx serve heartline      # or: python3 -m http.server -d heartline 8000
```

Headphones recommended.

| Key | Action |
| --- | --- |
| Click / Space / Enter | Advance text (click while typing to finish the line) |
| Backspace / PageUp / mouse-wheel up | Roll back one line |
| Hold Ctrl, or S | Skip |
| A | Auto mode |
| H | Hide UI |
| L | Backlog |
| 1–4 | Pick a choice |
| F5 / F9 | Quick save / quick load |
| Esc | Menu |
| D F J K | Rhythm lanes (stage minigame) |
| Gamepad | A advance, B back, X auto, Y log, Start menu |
| Touch | Tap advance, swipe up log, swipe down rollback, long-press hide UI |

## Story

**Arc One — The Glazier**
1. **Squad Zero**: two rookies who can't stand each other, a tutorial shift, and Field Certification.
2. **Glass Hearts**: new recruits, the Prism cult, Sora's concert, the Mirror Mall hostage crisis.
3. **Fractures**: leaked dispatch data, a mole, the tower siege, and the Glazier revealed.
4. **Shattered City**: citywide Rifts, Hikari's past, Rei's shadows, Mira's kidnapping.
5. **Operation Heartline**: the Shibuya Rift closes — and something falls out of it.

**Arc Two — The Board**

6. **Echo**: Rin Aoi, eight years late and still seventeen. A summer festival. A Rift that follows her.
7. **The Board**: Chairman Kuroda, Absolute Command, the Board Gala, and Project Spark Harvest.
8. **Rogue**: licenses revoked, dispatch from a konbini stockroom, and Aegis Prime on your trail.
9. **Winter of Glass**: glass snow in August, Mira's secret, license chips that are leashes — and a capture.
10. **Prisoners**: a heist on Sector Zero under the harbor, and someone who was never really lost.
11. **Broken Halo**: a concert broadcast to twelve million people, a defection, and a second sun.
12. **Heartline**: one more Operation Heartline, a confession, and the one room only you can walk into.

**Endings**: romance endings for Hikari, Rei, Mira, Sora or Kaede, a Squad ending, and a **true ending** that brings everyone home (unlocked by the choices you make across Arc Two; easier on New Game+).

## Cast

- **Hikari Amane (Thunder Goddess)**: electrokinetic, loud, brave, always hungry.
- **Rei Kurogane (Nightveil)**: umbrakinetic lone wolf with flawless technique.
- **Mira Solace (Halo Nurse)**: HALO's medic, who heals by taking wounds into herself.
- **Kaede Mori (Gale)**: speedster, Hikari's rival.
- **Tetsu Oda (Bulwark)**: steel-skinned gentle giant who grows bonsai.
- **Sora Hoshino (Stargazer)**: gravity-powered idol who's tired of being a product.
- **Rin Aoi (Echo)**: resonance Spark from the lost Squad One. *(Arc Two)*
- **Natsuki Amane (Salamander)**: rescue hero. *(Arc Two)*
- **Shiori Kagami (Aegis Prime)**: captain of the Board's elite unit. *(Arc Two)*
- **Kyouya Aoi (The Glazier)**, **Director Aya Takamine**, **Deputy Saeki**, **Chairman Genjirou Kuroda**, Mr. Oba the night manager, and **B.I.T.** the drone.

## How it plays

Each story day has three parts:

1. **Dispatch shift (real time).** Calls pop up across a city map with countdown timers. Each call needs certain stats (Combat, Vigor, Mobility, Charisma, Intellect). Build a team whose combined stats fill the red outline on the call's pentagon, and dispatch. Heroes travel, work the scene, return and rest. Some calls pause for live decisions or a hacking minigame. Handler skills, weather, morale, perks, gear and pair bonds all change the odds.
2. **Evening.** Two time slots for Hang Out, Date, Train, Rest, Squad Dinner or a konbini Night Shift. The Dossier, HQ upgrades, Shop, HeroNet and Handler Notes are free.
3. **Night.** Texts from whoever you're closest to, with reply choices.

## Features

**Story & structure**
1. 12 chapters in two arcs, plus a prologue
2. 40 in-game days, each with a shift, an evening and a night
3. 7 endings: five romances, a Squad ending, and a true ending
4. Route chosen by who you go to find on the last night, gated by affection
5. Confession scenes for all five romance routes, plus a squad scene
6. A separate "promise" scene for each route at the end of Arc One
7. An "Into the Light" rescue scene for each route at the finale
8. Rooftop sunset scenes that close Chapter 1 with your closest heroine
9. A hope system in each arc finale, built from choices made across the arc
10. Two outcomes for Kyouya in Arc One that change Arc Two scenes
11. A true ending that depends on eleven Arc Two decisions and results
12. Story-critical priority calls whose success or failure changes later scenes
13. Handler's Eye: timed tactical decisions with heartbeat audio, a countdown bar and an analysis-mode filter
14. Name entry
15. Chapter goals with an on-screen day countdown
16. 18 random evening events, gated by chapter
17. Chapter recap screens: shift grades, bond changes, credits, new achievements
18. Three new deployable heroes join in Arc Two: Rin, Natsuki and Shiori
19. Heroes leave and rejoin the roster as the story demands (Sora's contract, Hikari's capture)
20. Squad Zero goes "off the books" for three chapters: HQ upgrades locked, night shifts, a konbini base
21. The hub moves with the story: HALO lobby, konbini stockroom, a snowbound shrine
22. A heist chapter with a three-phase night shift and a breach puzzle
23. A concert chapter whose climax is a rhythm game
24. Absolute Command: a villain whose voice controls every hero except you, used in the story and in dispatch events
25. Seasonal arcs: summer festival, glass snow in August, winter coats, then spring

**Visual novel engine**
26. Typewriter text with a different voice-blip pitch per character
27. Text markup: *emphasis* in the speaker's color, ~shaking~ words, ^big^ impact text
28. Colored nameplates, and "???" until a character introduces themselves
29. Separate styles for narration and inner monologue
30. Choices with optional ♥ hints
31. Rollback: step back through lines with Backspace, PageUp, the wheel, gamepad B or a swipe
32. Read tracking with a NEW tag on unread lines
33. Skip that stops at unread text (configurable)
34. Auto mode with adjustable delay
35. Backlog
36. Hide-UI mode
37. 18 save slots across three pages, plus auto and quick slots
38. Save thumbnails that redraw the saved scene and characters
39. Automatic save descriptions (chapter, day, last line)
40. Autosave at chapter starts, shifts and free time, with an on-screen indicator
41. Continue loads the most recent save
42. Older saves are migrated automatically when loaded
43. Chapter select: replay any reached chapter with the squad you had at that point
44. Scene replay for hang-outs, promises, confessions, rescues, endings and events, without touching your saves
45. Settings: text speed, text size, box opacity, auto delay, music, SFX, voice blips, hints, reduced motion, parallax, skip-unread, wheel behavior, fullscreen
46. Pause menu with rollback, save, load, codex and character shortcuts
47. Gamepad support
48. Touch gestures
49. Keyboard shortcuts for everything
50. Difficulty select (Story, Handler, Veteran) that changes call requirements and timers
51. New Game+: heroes keep levels, stats and perks, bonus credits, and an easier true ending
52. Animated title screen: splash ring and logo reveal
53. Title screen that changes with your progress (background, line-up, badge)
54. Play time and lifetime statistics
55. Floating ♥ / 💔 affection pop-ups

**Extras**
56. CG gallery with a full-screen viewer and lazy-loaded thumbnails
57. Character viewer: every met character, expression, pose and outfit
58. Music room with all 17 tracks
59. Codex with 33 entries in six categories, unlocked by the story
60. Nemesis files added to the codex on first sighting
61. Records screen with lifetime stats and an endings checklist
62. Photo album of every date, across all playthroughs
63. 65 achievements with toast notifications

**Character art (procedural SVG)**
64. 13 fully drawn characters plus B.I.T.
65. Strand-built anime hair with gradient locks, shadow cores, light edges and an "angel ring" shine
66. Layered eyes with gradient irises, highlights and lid shapes
67. Heterochromia (Rin)
68. Special eye types: hearts, stars, swirls, teary, blank, shadowed, closed-happy
69. 40 expressions
70. 16 manpu effects: three blush levels, anger vein, sweat, tears, tear beads, sparkles, hearts, gloom lines, steam, question marks, music notes, dizzy spirals
71. 12 arm poses with articulated hands
72. Outfit system: hero, casual, formal, winter and yukata
73. Scene-wide outfit changes (festival yukata, gala formalwear, winter coats)
74. Hang-outs automatically use casual or winter clothes for the season
75. Male and older body types, glasses, beards and a rescue hard hat
76. Bangs cast shadows onto the face
77. Rim lighting, and scene lighting that tints sprites (night, dusk, cold, deep, glass, rift, alarm, dark, stage)
78. Idle breathing, random blinking and mouth flaps while talking
79. Non-speakers dim; characters slide between five stage positions and hop on emotion changes
80. B.I.T. with its own screen-face expressions

**Backgrounds, CGs & effects**
81. 35 illustrated backgrounds, from the konbini to a boardroom on floor 100 and a sun made of Rift light
82. 48 CG illustrations
83. Festival, winter-illumination and Ferris-wheel CGs for each romance
84. Animated details: stars, antenna lights, lanterns, fireworks, drifting clouds
85. Mouse parallax on backgrounds and sprites
86. Slow Ken Burns camera drift
87. Time-of-day tints
88. Transitions: fade, cut, flash, iris, wipe, heart and blur
89. A glass-shatter transition
90. Camera zoom and pan
91. Screen filters: flashback, dream, mono, noir, glitch
92. Background blur (depth of field)
93. Overlay effects: bokeh, rain on the lens, god rays
94. Screen crack effect
95. Impact frames
96. Character cut-ins for big moments
97. Split-screen face-offs
98. Anime speed lines
99. Letterbox bars
100. Screen shake and colored flashes
101. 15 particle types: rain, petals, glass, snow, embers, sparks, fireflies, fireworks, hearts, confetti, bubbles, leaves, stars, dust, shadow
102. Chapter title cards, day cards and a sleep transition
103. Polaroid photo cards at the end of dates
104. Scrolling end credits

**Audio (live WebAudio synthesis)**
105. 17 generative music tracks, with melodies generated from each track's chords
106. Seven new themes: idol stage, date night, summer festival, glass winter, the Board, boss battle, finale
107. A pentatonic mode for the festival theme
108. Crossfades between tracks
109. 38 synthesized sound effects
110. Reverb bus and compressor
111. Rhythm-game notes charted from, and synced to, the live music clock
112. Melodic hit sounds that play the song as you hit the notes

**Dispatch**
113. Real-time shifts on an animated city map with eight districts
114. Call pins with countdown rings, moving hero tokens and route lines
115. Pin icons for nemesis, chain and breach calls
116. Five-stat requirement pentagon with live success odds
117. Hero states: ready, en route, on scene, returning, resting, injured
118. 51 call templates across four tiers, gated by chapter
119. 15 new Arc Two calls: heatwaves, festival fires, Board drones, glass-snow pileups, frozen heroes
120. 24 kinds of mid-mission live decisions, with odds shown for your team
121. Breach calls that open a hacking minigame mid-mission
122. Priority story calls
123. Escalation: a failed call can come back harder and need more heroes
124. Six multi-step incident chains (a zoo escape, a bank job, a stalker, a blackout, Rift echoes, a whiteout)
125. Chain completion bonuses
126. Five recurring nemeses with their own taunts, who escape twice and are captured on the third defeat
127. Two random shift objectives per shift, tracked live on the map
128. Objective rewards in credits and reputation
129. Success streaks with a credit multiplier and a live streak badge
130. Handler skills: Overwatch (+15% on a call)
131. Handler skills: Rally (all resting heroes ready)
132. Handler skills: Rush (everyone en route arrives now)
133. Handler skills: Coffee Run (squad-wide fatigue relief)
134. Handler skills unlock by chapter; the Comms Array adds an extra Overwatch charge
135. Radio log of everything happening on the map
136. Weather: clear, breezy, rain, storm, snow, heatwave and glass fog, each changing travel, rest or specific heroes
137. Animated weather overlays on the dispatch map
138. Storms add an extra call
139. Morale shown in the dispatch bar and affecting every call
140. Hero moods shown on roster cards
141. Boosted stats from perks, gear and weather highlighted on roster cards
142. Call tags: nemesis, chain step, escalated, breach, Overwatch bonus
143. Pair synergies that change with the story (rivals bicker until they bond)
144. Pair bonds that level up as heroes clear calls together
145. Injuries, with injury chance reduced by perks, gear and the Med Bay
146. Fatigue that lowers odds and slows recovery
147. Gift drops from grateful civilians
148. Civilians-helped counter
149. Night shifts and dawn shifts with their own clocks
150. Compact roster layout for large squads
151. Pause and 1x / 2x / 3x speed
152. Guided tutorial shift
153. Hero chatter bubbles
154. Shift report with grade, objectives, best streak, civilians, morale change, gift drops, bond level-ups, nemeses and chains
155. XP, levels and skill points

**Heroes & agency**
156. Eight deployable heroes, plus Mira as the squad's medic
157. Perk trees: pick one of two perks at levels 3, 6 and 9 (48 perks in total)
158. Perks that change travel, rest, injury, XP, credits, teammates' stats and success odds
159. Perk alerts in the hub and on Dossier tabs
160. Gear: ten items, one slot per hero, bought in the Shop and equipped in the Dossier
161. Chapter-gated gear, up to a Rift-Core Amplifier
162. HQ upgrade: Med Bay (fewer injuries)
163. HQ upgrade: Garage (faster travel)
164. HQ upgrade: Training Hall (more training XP, wider zones)
165. HQ upgrade: Comms Array (longer call timers)
166. HQ upgrade: Cafeteria (morning energy and fatigue relief)
167. HQ upgrade: Drone Bay (bonus success on every call)
168. HQ upgrade: Rec Lounge (daily morale, extra ♥ from hang-outs)
169. Three levels per HQ upgrade
170. Squad morale, raised by good shifts, dinners, rest and hang-outs
171. Daily moods for each hero that change odds and dates
172. Late recruits catch up to the squad's level
173. Dossier with profile, radar chart, skills, perks, gear, bond perks and gifts
174. Bond perks: Trust at ♥12 and Heartline at ♥22 boost heroes on calls
175. Skill points to raise stats
176. Energy for evening activities
177. Animated time bar with a sun and moon marker
178. Rest to recover energy and fatigue
179. HeroNet social feed that changes with each chapter
180. B.I.T.'s context-sensitive tips
181. Handler Notes: an automatic journal of shifts, dates, training, upgrades and perks
182. Case files for nemeses and incident chains
183. Pair-bond overview
184. Konbini Night Shift side job for extra credits

**Training & minigames**
185. Five training drills, one per stat
186. Sparring and Endurance: timing-needle strikes
187. Agility Course: reflex targets that shrink over time
188. Breach Sim: a code-sequence hacking puzzle on a 5×5 grid, always solvable
189. Stage Practice: a four-lane rhythm game with combos, judgements and grades
190. Great drill results can permanently raise a stat
191. Training Hall upgrades widen zones and boost XP
192. Breach puzzles unlock story doors

**Dating & bonds**
193. Dates with any romance hero at Friend (♥8) or higher
194. Twelve date locations that unlock by chapter or season
195. Location thumbnails, costs and CG markers
196. Each hero loves, likes or dislikes each location, revealed once you're close (♥14)
197. Conversation topics with per-hero preferences and reactions (50 unique lines)
198. Flirting that lands differently depending on how close you are
199. Moods change how dates go
200. A photo at the end of every date, added to your album
201. Hang-outs: affection-gated scenes for nine characters
202. Affection tiers from Stranger to Heartline ♥, with heart meters
203. Likes revealed in the Dossier as you get closer
204. Birthdays: gifts count double, with a hub banner
205. Squad dinners with character vignettes
206. Shop with twelve gifts, including three for the new heroes
207. Gift preferences: loved, liked or neutral
208. Late-night texts from whoever you spent the most time with
209. Chapter-gated text conversations with typing indicators and reply choices

**Controls & accessibility**
210. Fixed 16:9 stage that scales to any window
211. Reduced-motion mode
212. Adjustable text size and text-box opacity

The list keeps going in the small things: B.I.T.'s file named *family*, a pudding economy, and a door that someone keeps not fixing.

## Files

```
heartline/
  index.html          layout / DOM layers
  style.css           UI, animations, effects
  js/chars.js         character sprites: hair, eyes, 40 expressions, poses, outfits
  js/art.js           backgrounds, CGs, B.I.T.
  js/art2.js          Arc Two backgrounds and CGs
  js/audio.js         music sequencer, SFX synth, rhythm sync
  js/story.js         prologue, Chapter 1, hang-outs, events
  js/story_ch2.js     Chapters 2–3
  js/story_ch4.js     Chapters 4–5 (end of Arc One)
  js/story_ch6.js     Chapters 6–8
  js/story_ch9.js     Chapters 9–12, confessions, endings
  js/story_data.js    calls, live events, gifts, profiles, texts, feed
  js/story_data2.js   Arc Two data, codex, achievements
  js/systems.js       perks, gear, HQ, morale, weather, nemeses, chains, minigames, dates
  js/dispatch.js      real-time dispatch shifts
  js/engine.js        VN runner, UI, hub, saves, extras
```

Story scripts are plain JS arrays, for example `['say', 'hikari', 'Text!', 'happy', 'wave']`.

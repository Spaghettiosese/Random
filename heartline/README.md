# HEARTLINE AGENCY

*A superpower-agency anime dating sim with Dispatch-style hero management. Prologue + 5 chapters, multiple endings. About 2 to 3 hours to finish.*

You're a Spark-negative night-shift clerk who spends his free time writing fight breakdowns of hero battles. After you talk a rookie hero through a Rift-beast attack outside your convenience store, the Director of the **HALO Agency** recruits you as a **Handler**. Your job: train, deploy, and keep alive **Squad Zero**, two gifted rookies who can't stand each other. Certification is in three days.

All the art is procedural SVG and all the music and SFX are synthesized live with WebAudio. There are no image or audio files and no build step.

## Play

Open `heartline/index.html` in a browser (it works straight from disk), or serve the folder:

```bash
npx serve heartline      # or: python3 -m http.server -d heartline 8000
```

Headphones recommended.

| Key | Action |
| --- | --- |
| Click / Space / Enter | Advance text (click while typing to finish the line) |
| Hold Ctrl | Skip |
| A / S | Toggle auto / skip mode |
| H | Hide UI (view the art) |
| L or mouse-wheel up | Backlog |
| 1–4 | Pick a choice |
| F5 / F9 | Quick save / quick load |
| Esc | Menu |

## Cast

- **Hikari Amane (Thunder Goddess)**: an electrokinetic trainee. Loud, brave, always hungry.
- **Rei Kurogane (Nightveil)**: an umbrakinetic rookie with flawless technique who works alone.
- **Mira Solace**: HALO's medical officer. She heals by taking the wound into herself.
- **Kaede Mori (Gale)**: a speedster and Hikari's academy rival. *(Chapter 2)*
- **Tetsu Oda (Bulwark)**: a gentle giant with steel skin who grows bonsai. *(Chapter 2)*
- **Sora Hoshino (Stargazer)**: a gravity-powered idol hero who's tired of being a product. *(Chapter 2)*
- **Kyouya Aoi (The Glazier)**: a former HALO Handler who is turning the city to glass.
- **Director Aya Takamine** and **B.I.T.**, the drone.

## How it plays

Each story day has three parts:

1. **Dispatch shift (09:00 to 17:00, real time).** Calls pop up across a city map with countdown timers. Each call needs certain stats: **Combat, Vigor, Mobility, Charisma and Intellect**. Pick heroes whose combined stats fill the red outline on the call's pentagon chart, then hit DISPATCH.
   - Heroes travel to the call (Mobility), work it, come back, and **rest** (Vigor). Unanswered calls expire.
   - Some calls pause mid-mission for a **live update** that asks you for a decision, with the odds shown for your team.
   - Pairs of heroes have **synergy**: rivals bicker until they bond, and some pairs work especially well together.
   - Failed calls can **injure** a hero for the rest of the shift.
   - At the end you get a **shift report** with an S to D grade, credits, reputation and XP. Level-ups give **skill points**.
   - You can pause or run at 1x, 2x or 3x speed.
2. **Evening.** Two time slots for Hang Out (affection-gated scenes), Train (a timing minigame that earns XP) or Rest. Shop, Dossier (spend skill points, give gifts) and HeroNet are free.
3. **Night.** Texts from whoever you're closest to, with reply choices.

Story choices use timed **Handler's Eye** decisions. Chapter climaxes, and the final ending, depend on your shift results, your calls and the bonds you've built.

## Structure

- **Prologue, "Spark of a Handler"**: the konbini attack and the recruitment.
- **Chapter 1, "Squad Zero"**: a tutorial shift, then Field Certification and the Glass Leviathan. Ends on a rooftop scene with your closest heroine.
- **Chapter 2, "Glass Hearts"**: new recruits, the Prism cult, Sora's concert, and the Mirror Mall hostage crisis.
- **Chapter 3, "Fractures"**: leaked dispatch data, the hunt for the mole, the tower siege, and the Glazier revealed.
- **Chapter 4, "Shattered City"**: citywide Rifts, Hikari's past, Rei's shadows, and Mira's kidnapping.
- **Final Chapter, "Heartline"**: the eve-of-battle confession, Operation Heartline, and the Shibuya Rift.
- **Endings**: romance epilogues for Hikari, Rei, Mira, Sora or Kaede, or a Squad ending. There is also a good or normal outcome for Kyouya, depending on your earlier choices.

## Features

**Visual novel core**
1. Typewriter text with a different voice-blip pitch for each character
2. Text markup: *emphasis* in the speaker's color, ~shaking~ words, ^big^ impact text
3. Nameplates colored per speaker, plus "???" until a character introduces themselves
4. Separate styles for narration and inner monologue
5. Choices that change affection, with optional ♥ hints
6. **Handler's Eye**: timed tactical choices with a countdown bar, heartbeat SFX and an analysis-mode visual filter
7. Branching sub-scenes and conditional scenes (`if` blocks)
8. Name entry
9. Auto mode with adjustable delay
10. Skip mode (toggle, or hold Ctrl)
11. Backlog (also opens with mouse-wheel up)
12. Hide-UI mode for viewing the art
13. Six save slots, with background thumbnails and descriptions
14. Quick save and quick load (F5/F9)
15. Autosave at chapter starts and at each free-time block
16. "Continue" loads your most recent save
17. Settings: text speed, auto delay, music and SFX volume, voice blips, hints, reduced motion, fullscreen
18. Pause menu
19. Keyboard shortcuts for everything

**Anime art (procedural SVG)**
20. Five characters built from layered vector parts (hair, face, eyes, outfit, arms)
21. 19 emotions (happy, sad, angry, pout, shy, smug, cry, scared, love, …)
22. 9 arm poses (wave, hands on hips, crossed arms, fist pump, point, shy, think, …)
23. Anime eyes with gradient irises, highlights, and lid shapes for each emotion
24. Emotes: blush lines, anger vein, sweat drop, tears, sparkles, hearts
25. Idle breathing animation
26. Random blinking
27. Mouth flaps while the character is talking
28. Non-speakers dim; characters slide in/out and move between five stage positions
29. A hop animation when a character's emotion changes
30. B.I.T. the floating drone, with its own screen-face expressions
31. 16 procedural backgrounds: city night, konbini, street, apartment, HQ, office, training room, ops room, café, ramen shop, arcade, alley, med bay, park, rooftop, harbor
32. Background details: twinkling stars, blinking antenna lights, drifting clouds, swaying lanterns
33. Slow Ken Burns camera drift on backgrounds
34. Time-of-day color tints (morning, noon, evening, night)

**Cutscenes & effects**
35. 9 special CG scenes: lightning strike, recruitment, shadow entrance, Glass Leviathan, combo attack, three rooftop endings, villain teaser
36. Animated lightning bolts, creeping shadow tendrils, a crystalline monster rising from the sea
37. Anime speed-lines
38. Cinematic letterbox bars
39. Screen shake and colored flashes
40. Particle weather: rain, sakura petals, glass shards, embers, sparks, shadow motes, hearts, dust, stars
41. Chapter title cards
42. Day cards with a calendar animation
43. A sleep transition
44. Scrolling end credits

**Audio (live WebAudio synthesis)**
45. 10 generative music tracks (title, daily, HQ, night lo-fi, tension, action, romance, mystery, sad, victory), with melodies generated from each track's chord progression
46. Crossfades between tracks
47. About 35 synthesized SFX: thunder, shattering glass, roars, shadows, sirens, phone buzz, heartbeat, UI sounds, …
48. Reverb bus and compressor

**Agency sim**
49. Daily planner with an animated time bar and a sun/moon marker
50. Energy system
51. Hero stats: Power, Control, Teamwork, Morale, Fatigue
52. **Training minigame**: a timing needle whose strike zone gets wider with Control and narrower with Fatigue, over 3 rounds, with PERFECT/GOOD/MISS grading
53. Stat-gain bars animated on the results screen, plus a reaction line from the hero
54. **Mission board**: a pool of 9 missions (tiers 1–3) that unlock by day
55. Solo or squad deployment, with the success chance shown before you commit
56. Animated dispatch: a city map with a route line, a moving unit icon, and a live field log
57. Mission results with a stamp and an S/A/B/C rank, and credits and reputation rewards
58. Hang Outs: 3 affection-gated scenes for each heroine, plus a fallback scene
59. Rest action
60. Shop with 7 gifts
61. Gift preferences: loved, liked, or neutral
62. Dossiers with profiles, a stat radar chart, affection hearts and tiers, and "likes" that unlock as you get closer
63. HeroNet social feed that changes each day
64. Late-night phone chats with typing indicators and reply choices; the heroine you spent the most time with that day texts you
65. Random HQ events that can trigger between actions
66. B.I.T. gives context-sensitive tips
67. The Certification score combines stats, teamwork, tactical calls and reputation, and changes the Director's verdict
68. The route is chosen by highest affection

**Dispatch & progression (added)**
75. Real-time dispatch shifts on an animated city map, with call pins, countdown rings and moving hero tokens
76. Five-stat requirement pentagon, with a live success % as you build a team
77. Hero state machine: ready, en route, on scene, returning, resting, injured
78. 36 call templates across 4 tiers, and 19 mid-mission live-update events
79. Pair synergies that evolve with the story
80. Story-critical priority calls whose outcome changes the plot
81. Shift report card with grades, XP, level-ups and skill points
82. Speed controls (pause, 1x, 2x, 3x) and a guided tutorial shift
83. Roster growth from 2 to 5 heroes, with hero chatter bubbles
84. Five chapters, 18 days, 6 romance routes and 2 ending outcomes

**Meta**
69. 19 achievements, shown as toasts
70. CG gallery with a full-screen viewer
71. A "Chapter 1 Cleared" badge on the title screen
72. Animated title screen: splash ring, logo reveal, character line-up
73. Floating +♥ / 💔 affection pop-ups
74. A fixed 16:9 stage that scales to any window

## Files

```
heartline/
  index.html      layout / DOM layers
  style.css       UI, animations, effects
  js/art.js       procedural characters, backgrounds, CGs
  js/audio.js     music sequencer + SFX synth
  js/story.js     all scripts, dialogue, missions, items, phone chats
  js/engine.js    VN runner, UI, hub/sim systems, save/load
```

Story scripts are plain JS arrays, for example `['say', 'hikari', 'Text!', 'happy', 'wave']`, so writing Chapter 2 means adding more arrays to `story.js`.

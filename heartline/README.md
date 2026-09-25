# HEARTLINE AGENCY

*A superpower-agency anime dating sim. Tech demo: Prologue + Chapter 1.*

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

- **Hikari Amane**: electrokinetic trainee. Loud, brave, always hungry, zero aim.
- **Rei Kurogane**: umbrakinetic rookie. Flawless technique, refuses to work with anyone.
- **Mira Solace**: HALO's medical officer. Heals everyone except herself.
- **Director Aya Takamine**: the Director. Reads everything, trusts no one.
- **B.I.T.**: tactical drone assistant who also offers "emotional support".

## Structure

1. **Prologue, "Spark of a Handler"**: the konbini attack, your first Handler's Eye call, and the recruitment.
2. **Chapter 1, "Squad Zero"**: meet HQ and the squad, then three free-time days (Morning / Afternoon / Evening), each ending with late-night phone texts.
3. **Certification Day**: a Tier-4 Glass Leviathan attacks the harbor. Your stats, bonds, and tactical calls decide the outcome.
4. **Rooftop ending**: a romance scene with whoever you're closest to (Hikari, Rei, or Mira), then a teaser for Chapter 2.

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

# MOONKAI

> **Also in this repo:** [`heartline/`](heartline/): *Heartline Agency*, an anime superpower-agency dating-sim tech demo (Prologue + Chapter 1). Open `heartline/index.html` in a browser.

*A Saint Joseph School horror story.* A first-person, low-poly, PS1-style horror game that runs in the browser (three.js, no build step).

Carlos is in 7th grade at Saint Joseph School. His best friend Eric is a grade below him. It starts as a normal week: dumb jokes in homeroom, "Monday Surprise" at lunch, one-on-one basketball in the gym, a parent picking you up after school. But each day Eric gets a little weirder, until one night Carlos dreams that Eric is possessed by **Moonkai**, a giant, fat moon-monkey demon.

## Play

The game uses ES modules, so it needs to be served over HTTP. Opening `index.html` straight from disk won't work.

```bash
npx serve .          # or: python3 -m http.server 8000
```

Then open the printed URL (e.g. http://localhost:3000). Headphones recommended.

| Control | Action |
| --- | --- |
| Mouse | Look (click the game to capture the mouse) |
| W A S D / arrows | Move |
| Shift | Run (limited stamina) |
| E or left click | Interact / advance dialogue |
| Hold + release left mouse | Shoot a basketball (let go inside the green zone) |
| Space | Jump (boss fight) |
| F | Flashlight (at night) |
| J | Journal (notes and red-thread pieces) |
| 1 / 2 / 3 | Pick a dialogue choice |
| Esc | Pause |

## Story structure

| Chapter | Setting | What happens |
| --- | --- | --- |
| **Monday** | Homeroom 7B, hallway, cafeteria, gym, pickup, car, home | Funny intro: Ms. Rosebrook's train problem, Jaden's "banana", Eric "saving" your seat, a first-to-3 basketball game, Mom's car ride, Dad's monkey jokes |
| **Tuesday** | School (overcast), home at night | Eric hasn't slept and draws the same monkey forty times. The ball rolls into the dark equipment room (first jumpscare). Eric's red-string necklace goes missing. Late-night texts, and something is sitting on the neighbor's roof |
| **Wednesday** | School (flickering), dusk pickup, home | "HE IS HUNGRY" on the chalkboard, a ring of banana peels in the cafeteria, a basketball that never comes down. Eric watches from the roof. Eric doesn't come home |
| **The Dream** | Moonkai's red sky | Moonkai possesses Eric, followed by a chase to the door |
| **Thursday 3:33 AM** | Saint Joseph at night | Flashlight exploration, a chase down the hallway, then the **boss fight in the gym** |

### Twist and endings

Moonkai never wanted Eric. It came for Carlos, the kid who stares at the moon every night. Eric offered himself instead. Moonkai can't eat a friendship, so it tries to make Carlos afraid of Eric first. The dream, the weirdness and the whispers are all bait. Eric's Lola's **red thread** (a promise tied in knots) is the one thing it can't chew.

* **Bad ending, "Hungry":** give in and finish Eric off.
* **Good ending, "Dawn":** reach for Eric and run.
* **True ending, "The Red Thread":** find all **5 red thread pieces** hidden across the week, then tie them around both your wrists.

Seven journal pages fill in the lore. Chapters unlock as you reach them (Title → Chapters), so you can go back for missed thread pieces. Collected pieces carry over.

### Boss: Moonkai

Grab basketballs from the racks (3 at a time). When Moonkai **roars**, the crescent on its forehead glows, and that's your window to hit it. Jump its ground-slam shockwaves (Space), dodge the banana barrages, and get off the red circles before the moonbeams land. In phase 2 it turns the gym lights off (use F), and in phase 3 the moonbeams start.

## Eric's face

Settings → **Eric's face** lets you load a photo from your computer and line the eyes and mouth up with the green guides. The photo goes on Eric's low-poly head, and the game also uses it for his "tired", "sick" and "possessed" versions and for the jumpscares. The photo **stays in that browser only** (localStorage). It is never uploaded, and it is not part of this repository. **Use default face** removes it.

## Tech notes

* `js/engine.js`: renderer (low internal resolution + vertex snapping for the PS1 wobble), input, first-person controller, AABB collision, interactables/triggers, NPCs, and a task system that every cutscene `await` runs through
* `js/world.js`: procedural levels (school, house, car ride, dream) built from boxes and canvas-generated textures
* `js/characters.js`: low-poly humans with painted canvas faces, Eric's face stages, Moonkai, jumpscare art
* `js/story.js`: the whole script (chapters, dialogue, choices, endings, save data)
* `js/ball.js` and `js/boss.js`: basketball physics/shooting and the boss fight
* `js/audio.js`: every sound (bell, drums, screeches, music box, ambience) is synthesized with the Web Audio API. Optional text-to-speech voice acting is in Settings
* `vendor/three.module.min.js`: three.js r160 (MIT), vendored so the game works offline

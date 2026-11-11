# AEGIS HEARTS — Prologue & Chapter 1 demo

An anime visual novel / dating sim set in a superpower agency. You are an ordinary
man with no powers and one useless hobby: watching hero fights frame by frame. That
hobby gets you hired as the **Handler** of Unit 7, three gifted trainee heroes nobody
else could train. You have five days before their Certification Trial.

Open `index.html` in a browser. There is no build step and there are no asset files:
the art, animation, music and sound are all generated in code.

## What is in the demo

- **Prologue** and **Chapter 1**, about 540 lines of dialogue with choices.
- **Three heroines**, each with a three-part bond route and her own ending scene:
  Hinata Akari (Solar Flare), Shirayuki Rei (Frostbite) and Kurose Mio (Umbra).
- **Portraits** with 19 expressions and 9 poses, blinking, lip movement and reactions.
- **8 animated event CGs**, kept in a gallery once you have seen them.
- **Day planner**: five days, three time slots a day, with energy, funds and a unit rating.
  - Training Hall: stat drills with a timing call.
  - Lounge: bond scenes, chats and vending-machine gifts.
  - Command Room: missions fought as short call-based battles.
  - Your Office: paperwork or rest.
- **8 music tracks** and about 30 sound effects, synthesised with WebAudio.
- Save/load (6 slots plus autosave), backlog, auto and skip modes, config, fullscreen.

## Controls

| Input | Action |
| --- | --- |
| Click, Space, Enter | Advance text |
| Ctrl (hold) | Skip |
| A | Toggle auto mode |
| L, or mouse wheel up | Backlog |
| H | Hide the text box |
| Esc | Config |

## Moonkai Pixel Engine

`js/moonkai-pixel.js` is the runtime core of the Moonkai Pixel Engine, vendored from
`pixel/app.js` and `pixel/character.js` in the `Spaghettiosese/moonkai` repository with
the editor UI removed. The game uses it in two ways:

- The rigged, animated full-body sprites (hub, training, battles, the "First Deployment"
  CG) are drawn by the engine's `drawCharacter` with a character sheet per hero.
- The portraits are painted with the engine's method: cel-shaded pieces with an outline,
  then the frame is snapped to the character's palette.

## Files

| File | Contents |
| --- | --- |
| `js/moonkai-pixel.js` | Vendored pixel engine runtime |
| `js/art-char.js` | Character definitions and the portrait painter |
| `js/art-bg.js` | Backgrounds, rift beasts and CGs |
| `js/audio.js` | Music sequencer and sound effects |
| `js/engine.js` | Script compiler and runner, stage, text box, saves, menus |
| `js/sim.js` | Day planner, training, battles, title screen |
| `js/story-*.js` | The script |

The script format is plain text, one line per step:

```
# label
@bg lounge
@show akari happy wave center
a happy wave: A line for Akari, with an expression and a pose.
> Narration.
? A prompt
* A choice -> another_label
```

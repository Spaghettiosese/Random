# DIALTONE

*December 31, 1999. 11:38 PM.* Your parents are at a party, the storm is rolling in, and nobody's using the phone line.

A small browser game (three.js, no build step). It opens with a walk through the rain into your house. Then you sit down at a beige 1999 PC and use it with your real mouse and keyboard. The 3D keyboard on the desk shows every key you press: the matching keycap goes down, with a synthesized click for each press and release.

## Play

```bash
cd Random && python3 -m http.server 8000   # serve the repo root (the game uses ../vendor/three)
# open http://localhost:8000/dialtone/
```

Headphones recommended. Space skips the intro.

## On the computer (NiteOS 98)
- **NetVoyager**: dial up with a real modem handshake, then browse. Pages load top to bottom at 56k. Try JumpStation (search, news), Kevin's GeoVillages homepage (the guestbook saves), y2kbunker.net, The Gerbil Groove, and Weather.net. You can type any address.
- **DOOMED**: a raycaster shooter you download from JumpStation's front page. It has a shotgun, imps, doors, pickups and an exit switch. Cheats: `IDDQD`, `IDKFA`. Level 2 is... familiar.
- **TubePlayer**: three "videos": a demoscene intro with chiptune, a skateboard fail, and a Y2K news report read aloud by speech synthesis.
- **Snake 2000** and **KeyStorm** (a typing shooter; try to beat 64 WPM).
- **NiteChat**: your buddy d4rkst4r messages you all night and replies to you.
- **Notepad** holds your New Year's resolutions, and your edits are saved.

## The twist
The clock in the taskbar runs about 3x real time toward midnight. You can skip ahead with *Start → Sync clock* or the button on y2kbunker.net. The TV in the living room counts down too. At midnight, something happens.

Controls: the mouse over the monitor is the PC mouse. Scroll outside the screen (or use the buttons) to switch between desk and screen view. Right-drag looks around. Esc closes a window.

## DIALTONE 2026 (`modern.html`)
Same room, current day: a gaming PC with a flat monitor, RGB tower and LED strip, and no scripted events. The desktop ("nova") is a game library:
- **Duty Calls: Modern Ops**: wave-survival shooter (click the screen to capture the mouse; Esc releases it, Esc again closes the game)
- **Blockcraft**: voxel mining and building
- **Brickverse**: a lava tower obby with a blocky avatar
- **KeyShop**: spend coins you earn in the games on 7 keyboards. Each one swaps the 3D keyboard on the desk and changes its sound (membrane, clicky, thocky, typewriter).
- The classics: KeyStorm, DOOMED, Snake 2000 and Clips.

# Heartline Agency — Pixel Remake Spec (shared by all art agents)

Game: `/home/user/random/heartline/` (VN dating sim, zero-build browser game). Read `heartline/js/chars.js` (the `CH` table has each character's colours, hair, eyes, outfits — match those designs) and `heartline/README.md` (cast).
Reference for the pipeline/style: `/home/user/random/pixel-studio/hikari_source.html` (+ `hikari_preview.png`). Hikari's bust is the quality bar: clean 1px dark-plum outline, 3-4 tone cel shading with hue-shifted shadows, big expressive eyes with highlights, properly proportioned anatomy.
Moonkai Pixel Studio lives at `/home/user/moonkai/pixel/` (the engine this remake is built on: palettes in `palettes.js`, its Character Builder `character.js` has proportion presets — anime = 6.5 heads, tall = 7). Match its "Anime Essentials" look.

## Pipeline (all agents)
Vector-draw (Canvas Path2D) at 4x → downsample → quantize to a per-asset palette → split fill / line-art → PNG data URLs, exactly like `hikari_source.html` (`toPix`/`build`). Work in `/home/user/random/pixel-studio/src/<your-name>/` (HTML sources) and write a small Node+Playwright runner there that opens your source in headless Chromium (playwright is a global npm module: `NODE_PATH=$(npm root -g) node run.js`; `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'` — find the real path with ls; never run `playwright install`) and writes the output JS file. ALWAYS view your PNG previews (Read tool) and iterate until it looks professional: correct proportions, no mangled shapes, clean silhouettes. Keep generated data compact (limited palette => small PNGs; <40KB per bust frame, <35KB per CG frame).
Do NOT edit any file in `heartline/` except your own output files under `heartline/js/px/`. Do not git commit. Deterministic output (seeded RNG).

## Asset formats (output into `/home/user/random/heartline/js/px/`)
1. **Busts** (VN sprites), 160x192 px, transparent bg, bust-up framing like Hikari. File `bust_<id>.js`:
   `(window.PIXEL=window.PIXEL||{}).<id> = { open:[8 frames], openTalk:[8], happy:[8], happyTalk:[8], shy:[8], shyTalk:[8], sad:[8], sadTalk:[8], angry:[8], angryTalk:[8], surprised:[8], surprisedTalk:[8] };`
   each frame = `data:image/png;base64,...`. 8-frame idle loop = breathing bob + hair/clothing sway + blink on one frame (open/shy/sad/angry/surprised blink; `happy` has closed-smile eyes). `*Talk` = same with mouth flapping alternate frames. Sets: open=neutral, happy=cheerful closed-eye smile, shy=blush+averted/wavering eyes+small mouth, sad=drooped brows/teary, angry=brows down/eyes sharp, surprised=wide eyes/open mouth. Frame play rate is 140ms/frame.
2. **CGs** (event illustrations), 480x270 px, fully opaque. File `cg_<group>.js`:
   `(window.PXCG=window.PXCG||{})['<cg_name>'] = { w:480, h:270, fps:6, frames:[6 PNG data URLs] };` A CG is a *composed illustration* (not a bust pasted on a background): foreground/midground/background layers, deliberate camera angle, dramatic lighting, characters drawn in correct anatomy (full figures or 3/4 shots as the composition needs), and a looping animation across the frames (hair/clothes sway, breathing, blinking, twinkling lights, drifting petals/snow/steam/embers, fireworks, gentle camera drift). Vignette + colour grading. Make each CG clearly distinct and emotionally readable.
3. **Backgrounds**: 480x270, file `bg.js` style: `(window.PXBG=window.PXBG||{})['<bg_name>'] = { w:480, h:270, fps:4, frames:[4 PNG data URLs] };` with subtle animation.

## Cast specifics
- **Protagonist ("Haru", default name)**: male, 23-25, short messy dark-brown hair, warm brown eyes, slim-athletic. Handler uniform = navy jacket `#23305a` with white trim + small gold HALO pin over a white shirt, black slacks. Casual = grey hoodie/jeans. Wedding = dark navy tuxedo with a white boutonniere. In "years later" scenes (age ~31) add a hint of stubble and tired-happy eyes. Keep his design consistent between all CGs: his face is usually shown in 3/4 or profile, kind and a bit awkward.
- All adults 22+; everything is wholesome (romance, hugs, kisses on cheek/forehead at most). Kids are cute, fully clothed, family-friendly.
- **Heroines**: use the colours/hair/eyes from `CH` in chars.js. (Hikari: golden twin-tails, ahoge, blue eyes, lightning motif. Rei: dark hair, violet accents, quiet, shadows. Mira: pink hair, teal accents, nurse/healer. Sora: idol, lilac/silver hair, star motifs. Kaede: green, sporty, speedster.) Check chars.js to confirm.
- **Kids (DLC)**, each family has two: elder ~6 and younger ~3, mixing mother's hair colour with father's brown hair details:
  hikari: Raika (girl, blonde twin-tails + tiny ahoge, loud) & Sou (boy, 3, brown hair, calm);
  rei: Tsukiko (girl, black hair violet tips, serious, tiny shadow-cat companion) & Akira (boy, 3);
  mira: Hana (girl, soft pink hair, gentle, carries a toy stethoscope) & Ren (boy, 3, pink with teal streak);
  sora: Hoshi (girl, silver-lilac hair, loves singing) & Kai (boy, 3, dark hair, star pyjamas);
  kaede: Hayate (boy, 6, green spiky hair, always mid-sprint) & Momo (girl, 3, green-brown pigtails).

## CG manifest per heroine g ∈ {hikari, rei, mira, sora, kaede}
Remakes of existing CGs (see `heartline/js/art.js` / `art2.js` for the current compositions + `CG_NAMES`; keep the same scene idea but redo as proper pixel illustrations):
- `cg_roof_<g>` (sunset/twilight rooftop promise; for kaede make it a rooftop too), `cg_fest_<g>` (summer festival fireworks, yukata, couple), `cg_snow_<g>` (winter illumination/snowfall, coats), `cg_ferris_<g>` (Ferris wheel at dusk, couple), `cg_end_<g>` (the ending: heroine + Haru, warm, in the ending location in the game: park for hikari/kaede, rooftop for rei/mira/sora).
NEW DLC "Heartline: After" CGs (married life + kids), 4 per heroine, named `cg_dlc_<g>_wedding`, `cg_dlc_<g>_home`, `cg_dlc_<g>_family`, `cg_dlc_<g>_night`:
- wedding: the ceremony / first kiss on the cheek or vows, in a setting that reflects her — hikari: sunflower outdoor wedding, her mother Natsuki loudly sobbing in front row, golden light; rei: moonlit garden, shadow-lanterns, brother Jun and black cats among guests; mira: white-and-pink chapel garden, Rin singing, coworkers cheering, petals; sora: rooftop under stars with fans' glowsticks as lanterns, gravity-floating petals; kaede: finish-line aisle in the park, wind-blown petals, squad cheering, ribbon tape.
- home: first years — a cosy morning with a newborn / toddler at home, signature personality (hikari: chaotic loud kitchen, sparks making toast; rei: quiet study, cat on lap, baby asleep on her, shadow-mobile; mira: sunny nursery, gentle feeding/cradle, herbal tea; sora: living room with baby, her humming lullaby into a mic, guitar; kaede: apartment mid-morning, she's carrying baby while juggling chores at speed, motion blur).
- family: the whole family (couple + two kids ~6 and ~3) at a happy outing (hikari: festival-ground; rei: night-sky picnic; mira: spring picnic with strawberry cake; sora: backyard concert; kaede: sports day relay).
- night: quiet intimate evening years later — couple on porch/balcony/couch, kids asleep inside visible through window or a family photo wall; tender, lit by warm lamps/moon.
Total per heroine: 9 CGs (5 remakes + 4 DLC), each 6 animated frames. Output to `cg_<g>.js`.

## Self-check before reporting
Write a contact-sheet HTML + Playwright screenshot of everything you made at 2-3x, Read it, fix any anatomy/proportion or ugly issues. Final report: list of files, sizes, ids exposed, and known weaknesses (brief).

## CG DIRECTION (mandatory — user feedback)
CGs must read as real illustrated *moments*, not portraits. NEVER stage the characters as two people facing the camera/viewer. Rules:
- Characters are **doing something** (an action/gesture tied to the story beat): walking down the aisle, handing over a ring, pointing at fireworks, blowing out a candle, riding the gondola and leaning on the glass, reaching for a snowflake, carrying a sleeping baby, cooking, racing, tying a scarf, lifting a child onto shoulders, etc.
- **Show Haru from behind, over-the-shoulder, or in profile / 3/4-back** in most CGs (his face visible only in profile or hidden). The heroine may face him (so we see her expression over his shoulder) or be in profile — but she should rarely look into the lens. A heroine looking straight at the camera is allowed for at most ONE CG per heroine (the `cg_end_<g>` finale).
- Use cinematic camera: low/high angles, wide establishing shots with small figures, foreground silhouettes (leaves, railings, lanterns, heads of the crowd), depth-of-field-style layering, rim light and cast shadows. Vary the framing between a heroine's CGs (wide, medium, close-detail on hands/feet/kids).
- Full anatomy: hands, feet, clothes folds, correct proportions; kids interact with the adults (hand-holding, riding shoulders, hugging legs).
- Animate meaningfully: hair, cloth, breathing, lights, particles; subtle camera drift.

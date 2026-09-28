/* HEARTLINE AGENCY — pixel cast, drawn for the Moonkai Pixel Engine.
   Every character is painted from scratch in pixel space: cel-shaded hair locks, new costumes, 40 pixel
   expressions with animated manpu, 12 poses with their own two-arm rigs, head tilt and body language,
   and a signature idle loop per character (Hikari's static crackle, Rei's shadow wisps, Sora's orbiting
   stars...). Frames: 12-frame idle, 4-frame talk, 1-frame blink. Sprite grid 176 x 316 over the
   400 x 720 stage box (0.44 px per unit), supersampled 4x and snapped to each frame's palette. */
const PixelCast = (() => {
  const W = 176, H = 316, S = .44, K = 4, PADX = 0;
  const TAU = Math.PI * 2;
  const { shade, ramp, mix } = PX;

  // ---------- drawing context ----------
  // All drawing goes through g.*, which records every colour so each frame snaps to exactly its palette.
  function G(x, LN) {
    const used = new Set([LN]);
    const col = c => { used.add(c); return c; };
    const g = {
      x, LN, used, lines: new Set([LN]),
      fill(d, c, lw = 2.2, lc) { const p = typeof d === 'string' ? new Path2D(d) : d; x.fillStyle = col(c); x.fill(p); if (lw) { x.strokeStyle = col(lc || LN); x.lineWidth = lw; x.stroke(p); } return p; },
      solid(d, c) { const p = typeof d === 'string' ? new Path2D(d) : d; x.fillStyle = col(c); x.fill(p); return p; },
      line(d, c, lw = 2) { x.strokeStyle = col(c); x.lineWidth = lw; x.stroke(typeof d === 'string' ? new Path2D(d) : d); },
      ell(cx, cy, rx, ry, c, lw = 0, lc, rot = 0) { x.beginPath(); x.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), rot, 0, TAU); x.fillStyle = col(c); x.fill(); if (lw) { x.strokeStyle = col(lc || LN); x.lineWidth = lw; x.stroke(); } },
      ring(cx, cy, rx, ry, c, lw) { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, TAU); x.strokeStyle = col(c); x.lineWidth = lw; x.stroke(); },
      rect(a, b, w, h, c, lw = 0) { x.fillStyle = col(c); x.fillRect(a, b, w, h); if (lw) { x.strokeStyle = col(LN); x.lineWidth = lw; x.strokeRect(a, b, w, h); } },
      poly(pts, c, lw = 2.2, lc) { return g.fill('M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z', c, lw, lc); },
      mir(fn) { x.save(); x.translate(400, 0); x.scale(-1, 1); fn(); x.restore(); },
      save() { x.save(); }, restore() { x.restore(); },
      tr(a, b) { x.translate(a, b); }, rot(deg, cx = 0, cy = 0) { x.translate(cx, cy); x.rotate(deg * Math.PI / 180); x.translate(-cx, -cy); }, sc(a, b = a) { x.scale(a, b); },
      clip(d) { x.clip(typeof d === 'string' ? new Path2D(d) : d); },
      alpha(a) { x.globalAlpha = a; },
      markLine(c) { g.lines.add(c); used.add(c); },
      text(t, px, py, sz, c) { x.font = `900 ${sz}px sans-serif`; x.textAlign = 'center'; x.lineWidth = 3; x.strokeStyle = col(LN); x.strokeText(t, px, py); x.fillStyle = col(c); x.fillText(t, px, py); }
    };
    return g;
  }
  const f1 = n => n.toFixed(1);
  const bez = (a, b, c, d, t) => { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; };
  const bezd = (a, b, c, d, t) => { const u = 1 - t; return [3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]), 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1])]; };
  // tapered ribbon along a cubic: prof 'taper' | 'leaf' | 'blunt' | 'flat'
  function ribbon(p, w, prof = 'taper', wm = 1, off = 0) {
    const [a, b, c, d] = p, N = 16, A = [], B = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, q = bez(a, b, c, d, t), dv = bezd(a, b, c, d, t), l = Math.hypot(dv[0], dv[1]) || 1, nx = -dv[1] / l, ny = dv[0] / l;
      const k = prof === 'leaf' ? Math.pow(Math.sin(Math.PI * Math.pow(t, .6)), .75) : prof === 'blunt' ? Math.min(1, .5 + t * 2) : prof === 'flat' ? 1 : Math.pow(1 - t, .8) * .92 + .08 * (1 - t);
      const hw = w / 2 * k * wm, cx = q[0] + nx * off * w / 2 * k, cy = q[1] + ny * off * w / 2 * k;
      A.push(f1(cx + nx * hw) + ',' + f1(cy + ny * hw)); B.push(f1(cx - nx * hw) + ',' + f1(cy - ny * hw));
    }
    return 'M' + A.join(' L') + ' L' + B.reverse().join(' L') + 'Z';
  }

  // ---------- body plans ----------
  const BODY = {
    f: { sh: [[124, 264], [276, 264]], torso: 'M186,226 C162,234 136,240 122,254 C110,266 108,290 112,318 C116,350 128,382 138,408 C142,432 136,456 134,480 L266,480 C264,456 258,432 262,408 C272,382 284,350 288,318 C292,290 290,266 278,254 C264,240 238,234 214,226Z', neck: [187, 213], kx: 1, arm: [30, 24, 19] },
    m: { sh: [[108, 262], [292, 262]], torso: 'M184,224 C156,232 124,236 106,250 C92,262 90,292 94,326 C98,370 114,406 126,438 C128,470 126,478 124,488 L276,488 C274,478 272,470 274,438 C286,406 302,370 306,326 C310,292 308,262 294,250 C276,236 244,232 216,224Z', neck: [182, 218], kx: 1.2, arm: [36, 29, 23] },
    b: { sh: [[92, 266], [308, 266]], torso: 'M180,222 C148,230 110,234 90,250 C74,264 72,296 76,332 C82,378 100,414 114,446 C116,474 114,482 112,492 L288,492 C286,482 284,474 286,446 C300,414 318,378 324,332 C328,296 326,264 310,250 C290,234 252,230 220,222Z', neck: [178, 222], kx: 1.38, arm: [44, 36, 28] }
  };
  const HEAD_F = 'M143,112 C143,70 168,50 200,50 C232,50 257,70 257,112 C257,148 246,174 223,193 Q200,208 177,193 C154,174 143,148 143,112Z';
  const HEAD_M = 'M141,108 C141,68 166,46 200,46 C234,46 259,68 259,108 C259,148 250,176 228,196 Q200,212 172,196 C150,176 141,148 141,108Z';
  const HEAD_O = 'M143,106 C143,66 168,46 200,46 C232,46 257,66 257,106 C257,150 250,180 228,200 Q200,214 172,200 C150,180 143,150 143,106Z';

  // ---------- poses: explicit elbow/wrist per side (female frame; x scales for broader builds) ----------
  // hand: open | fist | point | wave | clasp | chin | palm | reach | hipfist | under
  const POSES = {
    default: { L: [[118, 370], [114, 466], 'open'], R: [[284, 372], [292, 466], 'open'], tilt: 0 },
    hip: { L: [[80, 354], [134, 438], 'hipfist'], R: [[282, 372], [288, 470], 'open'], tilt: -3, lean: -3 },
    hips: { L: [[78, 350], [134, 436], 'hipfist'], R: [[322, 350], [266, 436], 'hipfist'], tilt: 0, chest: 1 },
    wave: { L: [[118, 372], [118, 470], 'open'], R: [[334, 214], [344, 122], 'wave'], tilt: 5, waveArm: 1 },
    cross: { L: [[122, 368], [236, 352], 'under'], R: [[280, 364], [166, 338], 'fist'], tilt: -2, front: 1 },
    shy: { L: [[130, 374], [190, 432], 'clasp'], R: [[270, 374], [212, 434], 'clasp'], tilt: 7, lift: 5 },
    fist: { L: [[80, 354], [134, 438], 'hipfist'], R: [[326, 346], [292, 262], 'fist'], tilt: -2, lean: 2, pump: 1 },
    point: { L: [[118, 370], [116, 468], 'open'], R: [[330, 300], [396, 262], 'point'], tilt: -4, lean: 4 },
    think: { L: [[128, 376], [238, 380], 'under'], R: [[270, 368], [226, 236], 'chin'], tilt: 8 },
    heart: { L: [[128, 380], [180, 318], 'palm'], R: [[284, 372], [290, 468], 'open'], tilt: 5 },
    cheer: { L: [[74, 196], [82, 100], 'fist'], R: [[326, 196], [318, 100], 'fist'], tilt: -4, cheer: 1 },
    reach: { L: [[118, 370], [116, 468], 'open'], R: [[300, 326], [256, 296], 'reach'], tilt: 4, lean: 3 }
  };

  // ---------- expressions: e eyes (or [left,right]), b brows, m mouth, fx manpu, look, body language ----------
  const EMO = {
    neutral: { e: 'open', b: 'normal', m: 'small' }, smile: { e: 'open', b: 'normal', m: 'smile' },
    happy: { e: 'happy', b: 'raised', m: 'grin', fx: ['sparkle', 'blushlite'], bob: 1 }, laugh: { e: 'happy', b: 'raised', m: 'laugh', fx: ['sparkle'], bob: 2, tilt: -4 },
    excited: { e: 'star', b: 'raised', m: 'laugh', fx: ['sparkle', 'blushlite'], hop: 1 }, awe: { e: 'star', b: 'raised', m: 'o', fx: ['sparkle'], tilt: -3 },
    sad: { e: 'sad', b: 'sad', m: 'frown', tilt: 4, droop: 3 }, cry: { e: 'closed', b: 'sad', m: 'wavy', fx: ['tears', 'blushlite'], tilt: 5, droop: 4, sob: 1 },
    sob: { e: 'closed', b: 'sad', m: 'sob', fx: ['tears2', 'blushlite'], droop: 6, sob: 2 }, crysmile: { e: 'teary', b: 'sad', m: 'smile', fx: ['tearbead', 'blushlite'], tilt: 4 },
    angry: { e: 'determined', b: 'angry', m: 'shout', fx: ['anger'], lean: 3, shake: 1 }, furious: { e: 'glare', b: 'angry', m: 'teeth', fx: ['anger', 'steam'], shake: 2, lean: 4 },
    pout: { e: 'narrow', b: 'angry', m: 'pout', fx: ['blushlite', 'anger'], tilt: -6 }, surprised: { e: 'wide', b: 'raised', m: 'o', jolt: 1 },
    shocked: { e: 'blank', b: 'raised', m: 'triangle', fx: ['exclaim', 'sweat'], jolt: 2 }, scared: { e: 'wide', b: 'sad', m: 'wavy', fx: ['sweat'], shake: 1, droop: 3 },
    shy: { e: 'soft', b: 'sad', m: 'wavy', fx: ['blush'], look: -3, tilt: 6 }, blush: { e: 'open', b: 'sad', m: 'smile', fx: ['blush'], look: 3, tilt: 4 },
    flustered: { e: 'wide', b: 'worried', m: 'wavy', fx: ['blushfull', 'sweats', 'steam'], shake: 1 }, embarrassed: { e: 'soft', b: 'worried', m: 'tiny', fx: ['blushfull'], look: 4, tilt: 7 },
    love: { e: 'heart', b: 'sad', m: 'grin', fx: ['blush', 'heart'], tilt: 5, bob: 1 }, smug: { e: 'narrow', b: 'smug', m: 'cat', tilt: -5 },
    smirk: { e: 'narrow', b: 'normal', m: 'smirk', tilt: -3 }, cold: { e: 'narrow', b: 'normal', m: 'flat' },
    glare: { e: 'glare', b: 'angry', m: 'flat', fx: ['gloomlite'], lean: 2 }, determined: { e: 'determined', b: 'angry', m: 'flat', lean: 1 },
    serious: { e: 'open', b: 'angry', m: 'flat' }, think: { e: 'open', b: 'smug', m: 'flat', look: 4, tilt: 5 },
    confused: { e: 'open', b: 'worried', m: 'tiny', fx: ['question'], look: -3, tilt: -8 }, tender: { e: 'soft', b: 'sad', m: 'smile', fx: ['blushlite'], tilt: 4 },
    sleepy: { e: 'sleepy', b: 'relaxed', m: 'tiny', fx: ['zzz'], tilt: 8, sway: 1 }, wink: { e: ['open', 'happy'], b: 'raised', m: 'grin', fx: ['sparkle'], tilt: -5 },
    tease: { e: ['open', 'happy'], b: 'smug', m: 'tongue', tilt: -6 }, gloomy: { e: 'sad', b: 'sad', m: 'wavy', fx: ['gloom'], droop: 7, tilt: 3 },
    dizzy: { e: 'swirl', b: 'worried', m: 'wavy', fx: ['dizzy'], sway: 2 }, sweat: { e: 'open', b: 'sad', m: 'smile', fx: ['sweat'], tilt: -3 },
    relieved: { e: 'closed', b: 'relaxed', m: 'smile', fx: ['sweat'], droop: 2 }, deadpan: { e: 'flat', b: 'normal', m: 'flat' },
    ominous: { e: 'shadow', b: 'angry', m: 'smirk', lean: 2, tilt: 3 }, singing: { e: 'closed', b: 'raised', m: 'sing', fx: ['notes'], sway: 1, tilt: -4 }
  };
  const OPEN_M = { grin: 1, laugh: 1, open: 1, sing: 1, o: 1, triangle: 1, shout: 1, sob: 1, teeth: 1 };

  // ---------- the cast ----------
  // Palette per character: skin ramp, hair ramp (+ line), eye ramp, and named costume colours.
  const SK = (base) => { const r = ramp(base, 4, 9); return { skin: base, skinS: r[2], skinD: r[3], skinH: r[0] }; };
  const HR = (base, s, h, l) => ({ hair: base, hairS: s, hairH: h, hairL: l });
  const EY = (e, d, l, dd) => ({ eye: e, eyeD: d, eyeL: l, eyeP: dd || shade(d, -1, 12) });

  const CAST = {};

  // --- Hikari Amane, Thunder Goddess ---
  CAST.hikari = Object.assign(SK('#ffe8dc'), HR('#ffd65c', '#e39a2e', '#fff6cc', '#9a5a18'), EY('#3ea4ff', '#1b46a8', '#bff0ff'), {
    body: 'f', line: '#3a1f2e', blush: '#ff9aa6',
    col: { jacket: '#f8f8ff', jacketS: '#cfd2ee', trim: '#ffc21a', trimS: '#d98a10', suit: '#2f5be0', suitS: '#1d3a9e', skirt: '#232846', skirtS: '#151830', sock: '#232846', glove: '#2f5be0' },
    sleeve: 'short', hand: 'glove',
    back(g, c, a) {
      // long twin tails from high ties, swinging on the idle loop
      const sw = a.sway * 10, sw2 = a.sway2 * 7;
      for (const s of [-1, 1]) {
        const X = x => 200 + (x - 200) * s, bx = s * sw, bx2 = s * sw2 + sw * .4;
        const locks = [
          [[X(146), 70], [X(92), 96], [X(64) + bx * .5, 250], [X(76) + bx, 420], 46, 'taper'],
          [[X(144), 74], [X(106), 130], [X(96) + bx * .6, 300], [X(112) + bx2, 470], 36, 'taper'],
          [[X(140), 72], [X(74), 110], [X(40) + bx * .7, 260], [X(46) + bx, 400], 28, 'taper'],
          [[X(146), 80], [X(122), 170], [X(128) + bx2 * .5, 350], [X(104) + bx2, 520], 24, 'taper']
        ];
        for (const [p0, p1, p2, p3, w, pr] of locks) hairLock(g, c, [p0, p1, p2, p3], w, pr, s);
        // electric crackle in the tails
        if (a.spark) { const k = a.frame % 3; const y0 = 230 + k * 70; g.line(`M${X(78) + bx * .7},${y0} l${-10 * s},14 l${12 * s},6 l${-12 * s},16`, '#fff27a', 3); g.line(`M${X(78) + bx * .7},${y0} l${-10 * s},14 l${12 * s},6 l${-12 * s},16`, '#ffffff', 1.2); }
      }
      g.fill('M150,84 C146,150 154,200 164,236 L236,236 C246,200 254,150 250,84Z', c.hairS, 0);
    },
    outfit(g, c, o) {
      const C = c.col;
      // legs: navy skirt, thigh socks with lightning stripes
      g.fill('M140,556 L196,556 L194,720 L144,720Z', c.skin); g.fill('M260,556 L204,556 L206,720 L256,720Z', c.skin);
      g.fill('M142,610 L196,610 L194,720 L146,720Z', C.sock); g.fill('M258,610 L204,610 L206,720 L254,720Z', C.sock);
      g.line('M144,622 L195,622 M256,622 L205,622', C.trim, 3);
      g.fill('M136,470 L264,470 C276,512 286,546 292,580 L108,580 C114,546 124,512 136,470Z', C.skirt);
      g.solid('M200,476 L214,576 L186,576Z', C.skirtS); g.solid('M160,476 L148,576 L130,576 L146,476Z', C.skirtS); g.solid('M240,476 L252,576 L270,576 L254,476Z', C.skirtS);
      g.line('M110,578 L290,578', C.trim, 3);
      // blue bodysuit + emblem
      g.fill(BODY.f.torso, C.suit); g.solid('M262,408 C272,382 284,350 288,318 C292,290 290,266 278,254 L262,262 C272,300 266,360 246,420 Z', C.suitS);
      g.poly([[206, 296], [186, 332], [200, 332], [190, 366], [218, 322], [204, 322], [214, 296]], C.trim, 1.8);
      // belt
      g.fill('M134,462 L266,462 L268,482 L132,482Z', '#262a40', 1.8); g.fill('M188,460 L212,460 L212,484 L188,484Z', C.trim, 1.8); g.poly([[202, 464], [194, 473], [200, 473], [196, 481], [206, 470], [200, 470]], '#fff7b0', 0);
      // cropped white jacket with gold trim and high collar
      const jk = 'M186,226 C162,234 136,240 122,254 C110,266 108,290 112,318 C116,350 126,378 134,396 L176,400 C172,350 168,296 180,244Z';
      g.fill(jk, C.jacket); g.save(); g.x.translate(400, 0); g.x.scale(-1, 1); g.fill(jk, C.jacket); g.restore();
      g.solid('M122,254 C110,266 108,290 112,318 C116,346 124,372 132,392 L144,388 C132,350 126,300 132,262Z', C.jacketS);
      g.solid('M278,254 C290,266 292,290 288,318 C284,346 276,372 268,392 L256,388 C268,350 274,300 268,262Z', C.jacketS);
      g.line('M180,244 C168,296 172,350 176,400 M220,244 C232,296 228,350 224,400', C.trim, 4); g.line('M134,396 L176,400 M266,396 L224,400', C.trim, 4);
      g.fill('M170,204 C178,222 222,222 230,204 L240,236 C220,256 180,256 160,236Z', C.jacket, 2); g.line('M162,236 C180,252 220,252 238,236', C.trim, 3);
      g.line('M178,212 L184,238 M222,212 L216,238', C.jacketS, 2);
    },
    front(g, c, a) {
      const s = a.sway * 3;
      const side = (sg) => { const X = x => 200 + (x - 200) * sg; hairLock(g, c, [[X(148), 92], [X(136), 140], [X(136) + s * sg, 190], [X(148) + s * sg, 238]], 22, 'taper', sg); };
      side(-1); side(1);
      cap(g, c);
      const bangs = [[[196, 46], [166, 52], [142, 76], [138, 116], 26], [[204, 46], [234, 52], [258, 76], [262, 116], 26], [[198, 46], [178, 62], [160, 92], [150, 128], 32],
        [[206, 46], [228, 62], [244, 94], [250, 128], 32], [[200, 46], [190, 68], [182, 96], [176, 124], 30], [[204, 46], [212, 70], [220, 98], [224, 120], 30], [[202, 46], [200, 72], [198, 100], [200, 132], 24]];
      bangs.forEach(([p0, p1, p2, p3, w]) => hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      angelRing(g, c);
      // ahoge bounces
      const ah = a.bob2 * 6;
      hairLock(g, c, [[204, 44], [202, 14 + ah], [232 + ah, 2], [240 + ah, 22 + ah * .5]], 10, 'leaf', 1);
      // scrunchies + lightning clip
      for (const sg of [-1, 1]) { const X = 200 + 58 * sg; g.ell(X, 72, 10, 12, C_BLUE, 2); g.line(`M${X - 4 * sg},66 q${5 * sg},6 0,12`, '#8ab4ff', 1.6); }
      g.poly([[258, 84], [248, 102], [256, 102], [250, 116], [266, 96], [258, 96], [264, 84]], '#fff27a', 1.8, '#2a4fd6');
    },
    anim: { spark: 1, bounce: 1 }
  });
  const C_BLUE = '#2f5be0';

  // ---------- shared hair helpers ----------
  function hairLock(g, c, p, w, prof = 'taper', side = 1) {
    g.fill(ribbon(p, w, prof), c.hair, 1.6, c.hairL); g.markLine(c.hairL);
    if (w > 12) { g.solid(ribbon(p, w, prof, .42, .55 * side), c.hairS); g.solid(ribbon(p, w, prof, .16, -.6 * side), c.hairH); }
  }
  function cap(g, c, d) {
    g.fill(d || 'M138,130 C128,62 164,34 200,34 C236,34 272,62 262,130 C250,98 230,82 200,82 C170,82 150,98 138,130Z', c.hair, 1.8, c.hairL);
    g.solid('M150,70 C166,46 186,40 200,40 C188,50 176,62 168,80Z', c.hairH);
  }
  function angelRing(g, c, y0 = 84) {
    let top = [], bot = []; for (let x = 150, i = 0; x <= 250; x += 8, i++) { const y = y0 - Math.sin((x - 150) / 100 * Math.PI) * 18; top.push(`${x},${f1(y - 3)}`); bot.unshift(`${x},${f1(y + (i % 2 ? 7 : 3))}`); }
    g.solid('M' + top.join(' L') + ' L' + bot.join(' L') + 'Z', c.hairH);
  }

  // ---------- face ----------
  function eye(g, c, cx, cy, flip, type, look, t) {
    const x = g.x, m = c.body !== 'f', LN = c.line;
    g.save(); g.tr(cx, cy); g.sc(flip ? -1 : 1, 1); const ix = look * (flip ? -1 : 1);
    const lash = (lw = m ? 3.4 : 4) => { g.line('M-16,0 C-13,-12 5,-16 17,-8', LN, lw); if (!m) g.line('M15,-8 L22,-12 M16,-6 L22,-6', LN, 2); };
    const low = () => g.line('M-6,11 Q2,12.5 10,8', LN, 1.4);
    const lid = (d, ln) => { g.solid(d, c.skin); g.line(ln, LN, m ? 3.4 : 4); };
    const WH = 'M-15,-1 C-13,-11 6,-14 16,-7 C18,2 12,10.5 1,11.5 C-9,11.5 -15,6 -15,-1Z';
    if (type === 'happy') { g.line('M-14,4 Q1,-10 16,2', LN, 3.6); if (!m) g.line('M15,2 L21,-2', LN, 2); g.restore(); return; }
    if (type === 'closed') { g.line('M-14,-1 Q1,9 16,-2', LN, 3.4); if (!m) g.line('M14,0 L20,3 M8,4 L10,8', LN, 1.6); g.restore(); return; }
    if (type === 'flat') { g.line('M-15,0 L17,-1', LN, 3.4); g.line('M-10,7 L12,7', LN, 1.4); g.restore(); return; }
    if (type === 'sleepy') { g.solid('M-15,2 C-10,6 8,6 16,2 C12,9 -8,11 -15,2Z', '#ffffff'); g.solid('M-6,4 C-4,8 6,8 8,4Z', c.eyeD); g.line('M-15,2 C-6,5 8,5 17,1', LN, 3.4); g.restore(); return; }
    // open-family eyes
    const big = { wide: [7, 8.5], glare: [7, 8], blank: [0, 0], swirl: [0, 0] }[type] || (m ? [8, 10] : [9.5, 11.5]);
    g.solid(WH, '#ffffff');
    g.save(); g.clip(WH);
    g.solid('M-17,-14 L19,-14 L19,-4 C8,-8 -8,-8 -17,-2Z', '#d4cbe8');
    if (type === 'swirl') { g.line('M1,1 m-2,0 a2,2 0 1 1 4,0 a4,4 0 1 1 -8,0 a6,6 0 1 1 12,0 a8,8 0 1 1 -16,0', c.eyeD, 1.8); }
    else if (type === 'blank') { g.ell(ix, 2, 1.8, 1.8, LN); }
    else {
      const [rx, ry] = big;
      g.ell(ix, 1, rx, ry, c.eye); g.solid(`M${ix - rx - 1},${1 - ry - 1} L${ix + rx + 1},${1 - ry - 1} L${ix + rx + 1},${f1(1 - ry * .15)} C${ix + rx * .4},${f1(1 - ry * .45)} ${ix - rx * .4},${f1(1 - ry * .45)} ${ix - rx - 1},${f1(1 - ry * .15)}Z`, c.eyeD);
      g.solid(`M${ix - rx * .8},${f1(1 + ry * .45)} Q${ix},${f1(1 + ry * 1.1)} ${ix + rx * .8},${f1(1 + ry * .45)} Q${ix},${f1(1 + ry * .75)} ${ix - rx * .8},${f1(1 + ry * .45)}Z`, c.eyeL);
      g.ring(ix, 1, rx, ry, c.eyeD, 1.4);
      if (type === 'star') { star(g, ix, 2, 6.5, '#fff7b0', 1.2, c.eyeD); g.ell(ix + 5, 7, 1.4, 1.4, '#ffffff'); }
      else if (type === 'heart') { g.fill(heartD(ix, 2, 5.4), '#ff4f7e', 1.2, '#ffffff'); g.ell(ix - 2, -1, 1.3, 1.3, '#ffffff'); }
      else {
        g.ell(ix, 2, rx * .42, ry * .5, c.eyeP);
        if (type !== 'shadow') { g.ell(ix - 3.6, -4.6, rx * .34, ry * .32, '#ffffff', 0, 0, -.35); g.ell(ix + 4, 5.5, 1.5, 1.5, '#ffffff'); if (t !== undefined && !m) g.ell(ix + 3.4, -5.6, 1, 1, '#ffffff'); }
        else { g.alpha(1); g.solid('M-20,-20 L24,-20 L24,20 L-20,20Z', c.hairS); g.ell(ix, 2, 2.2, 2.2, c.eyeL); }
        if (type === 'teary') { g.solid('M-15,5 Q1,14 16,4 L16,12 L-15,12Z', '#bfe8ff'); g.ell(-6, -2, 1.4, 1.4, '#ffffff'); g.ell(7, 6, 1.8, 1.8, '#ffffff'); }
      }
    }
    g.restore();
    if (type === 'narrow') lid('M-18,-22 L24,-22 L24,-5 C10,-4 -8,-2 -18,0Z', 'M-16,0 C-6,-3 8,-5 18,-6');
    else if (type === 'glare') lid('M-18,-22 L24,-22 L24,-9 L-18,1Z', 'M-16,1 L19,-8');
    else if (type === 'determined') lid('M-18,-22 L24,-22 L24,-12 L-18,0Z', 'M-16,0 L19,-11');
    else if (type === 'sad') lid('M-18,-22 L24,-22 L24,-4 C10,-8 -6,-11 -18,-9Z', 'M-16,-9 C-6,-11 10,-8 19,-4');
    else if (type === 'soft') { g.solid('M-18,9 C-8,5 8,4 20,7 L20,16 L-18,16Z', c.skin); g.line('M-12,8 Q2,4 15,7', LN, 1.4); lash(); }
    else if (type === 'wide') { lash(3); g.line('M-12,12 Q2,14 12,10', LN, 1.4); }
    else lash();
    if (!['narrow', 'glare', 'determined', 'sad', 'soft'].includes(type)) low();
    g.restore();
  }
  function brow(g, c, cx, cy, flip, type) {
    const D = { normal: 'M-13,-24 Q3,-29 18,-24', raised: 'M-13,-32 Q3,-37 18,-31', angry: 'M-13,-19 Q3,-24 18,-30', sad: 'M-13,-31 Q3,-29 18,-21', relaxed: 'M-13,-23 Q3,-26 18,-22' };
    g.save(); g.tr(cx, cy - 4); g.sc(flip ? -1.2 : 1.2, 1.2); g.line(D[type] || D.normal, c.hairL, c.body === 'f' ? 2.6 : 4); g.restore();
  }
  const MOUTH = {
    small: (g, c) => g.line('M194,180 Q200,183 206,180', c.line, 2.2),
    tiny: (g, c) => g.line('M197,180 L203,180', c.line, 2.2),
    smile: (g, c) => { g.line('M190,177 Q200,186 210,177', c.line, 2.4); },
    grin: (g, c) => { g.fill('M189,175 Q200,178 211,175 Q209,190 200,191 Q191,190 189,175Z', '#9c3448', 2); g.solid('M191,176 L209,176 L208,180 L192,180Z', '#ffffff'); g.solid('M194,186 Q200,181 206,186 Q200,190 194,186Z', '#ff8e9c'); },
    laugh: (g, c) => { g.fill('M186,172 Q200,176 214,172 Q212,195 200,196 Q188,195 186,172Z', '#9c3448', 2); g.solid('M188,173 L212,173 L211,179 L189,179Z', '#ffffff'); g.solid('M192,189 Q200,182 208,189 Q200,195 192,189Z', '#ff8e9c'); },
    open: (g, c) => g.fill('M193,176 Q200,178 207,176 Q206,186 200,187 Q194,186 193,176Z', '#9c3448', 2),
    sing: (g, c) => { g.ell(200, 181, 5.5, 5, '#9c3448', 2, c.line); g.solid('M196,183 Q200,180 204,183 Z', '#ff8e9c'); },
    o: (g, c) => g.ell(200, 181, 4.2, 5.2, '#9c3448', 2, c.line),
    triangle: (g, c) => g.fill('M192,186 L200,172 L208,186Z', '#9c3448', 2),
    frown: (g, c) => g.line('M193,182 Q200,176 207,182', c.line, 2.4),
    flat: (g, c) => g.line('M194,180 L206,180', c.line, 2.4),
    cat: (g, c) => g.line('M190,177 q5,5 10,0 q5,5 10,0', c.line, 2.2),
    smirk: (g, c) => g.line('M192,181 Q202,183 209,174', c.line, 2.4),
    wavy: (g, c) => g.line('M189,179 q2.75,-3 5.5,0 t5.5,0 t5.5,0 t5.5,0', c.line, 2),
    shout: (g, c) => { g.fill('M188,171 Q200,168 212,171 Q211,193 200,194 Q189,193 188,171Z', '#9c3448', 2); g.solid('M193,187 Q200,181 207,187 Q200,192 193,187Z', '#ff8e9c'); },
    teeth: (g, c) => { g.fill('M188,172 L212,172 L212,184 L188,184Z', '#ffffff', 2); g.line('M188,178 L212,178 M194,172 L194,184 M200,172 L200,184 M206,172 L206,184', c.line, 1.2); },
    sob: (g, c) => { g.fill('M186,176 Q200,169 214,176 Q213,194 200,192 Q187,194 186,176Z', '#9c3448', 2); g.solid('M192,187 Q200,182 208,187 Q200,191 192,187Z', '#ff8e9c'); },
    tongue: (g, c) => { g.line('M190,177 Q200,185 210,177', c.line, 2.4); g.fill('M197,181 Q197,190 202,190 Q207,190 206,180', '#ff8e9c', 1.6); },
    pout: (g, c) => { g.line('M195,180 Q200,176 205,180', c.line, 2.2); g.line('M197,184 Q200,185 203,184', '#d98a92', 1.8); }
  };
  const TALK = { small: 'open', tiny: 'open', smile: 'grin', frown: 'open', flat: 'open', cat: 'grin', smirk: 'open', wavy: 'o', pout: 'o', tongue: 'grin', grin: 'open', laugh: 'grin', open: 'small', sing: 'o', o: 'small', triangle: 'small', shout: 'open', teeth: 'shout', sob: 'open' };
  function star(g, cx, cy, r, col, lw = 1.4, lc) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * rr) + ',' + f1(cy + Math.sin(a) * rr); } g.fill(d + 'Z', col, lw, lc); }
  const heartD = (x, y, r) => `M${x},${y + r * .9} C${x - r * 1.6},${y - r * .2} ${x - r * .9},${y - r * 1.5} ${x},${y - r * .5} C${x + r * .9},${y - r * 1.5} ${x + r * 1.6},${y - r * .2} ${x},${y + r * .9}Z`;

  // manpu effects, animated by phase t (0..1)
  function manpu(g, c, k, t, pass) {
    const LN = c.line, tw = Math.sin(t * TAU), bob = Math.round(Math.sin(t * TAU) * 3), lo = pass === 'under';
    if (k.startsWith('blush')) {
      if (!lo) return;
      const b = c.blush || '#ff9aa6';
      if (k === 'blushfull') { g.solid('M150,152 Q200,170 250,152 L252,170 Q200,186 148,170Z', b); for (let i = 0; i < 7; i++) g.line(`M${156 + i * 14},170 l5,-9`, '#e0527a', 1.6); return; }
      g.ell(166, 164, k === 'blush' ? 15 : 12, 5, b); g.ell(234, 164, k === 'blush' ? 15 : 12, 5, b);
      if (k === 'blush') for (const X of [156, 164, 172, 226, 234, 242]) g.line(`M${X},168 l4,-7`, '#e0527a', 1.5);
      return;
    }
    if (lo) return;
    switch (k) {
      case 'anger': { const s = 1 + (tw > 0 ? .18 : 0); g.save(); g.tr(252, 64); g.sc(s); g.line('M-7,-8 Q0,-2 7,-8 M-7,8 Q0,2 7,8 M-9,-6 Q-3,0 -9,6 M9,-6 Q3,0 9,6', '#e0283a', 3.4); g.restore(); break; }
      case 'sweat': g.fill(`M264,${96 + bob} Q254,${112 + bob} 264,${119 + bob} Q274,${112 + bob} 264,${96 + bob}Z`, '#d4f0ff', 2, '#4d9fd6'); g.markLine('#4d9fd6'); break;
      case 'sweats': [[266, 90, 1], [138, 102, .7], [278, 124, .6]].forEach(([X, Y, s]) => g.fill(`M${X},${Y + bob} q${-8 * s},${14 * s} 0,${19 * s} q${8 * s},${-5 * s} 0,${-19 * s}Z`, '#d4f0ff', 1.8, '#4d9fd6')); break;
      case 'tears': { const d = (t * 3 % 1) * 30; g.line(`M166,152 Q162,${170 + d * .3} 167,${186 + d}`, '#9fdcff', 4); g.line(`M234,152 Q238,${170 + d * .3} 233,${186 + d}`, '#9fdcff', 4); break; }
      case 'tears2': { const d = Math.round(t * 4) % 2 * 6; g.fill(`M154,148 L168,148 L172,${224 + d} Q162,${236 + d} 152,${224 + d}Z`, '#9fdcff', 1.6, '#4d9fd6'); g.fill(`M232,148 L246,148 L248,${224 + d} Q238,${236 + d} 228,${224 + d}Z`, '#9fdcff', 1.6, '#4d9fd6'); break; }
      case 'tearbead': g.fill(`M150,${152 + bob} Q144,${163 + bob} 150,${168 + bob} Q156,${163 + bob} 150,${152 + bob}Z`, '#d4f0ff', 1.6, '#4d9fd6'); break;
      case 'sparkle': { const s1 = tw > 0 ? 1 : .6, s2 = tw > 0 ? .6 : 1; star4(g, 294, 60, 12 * s1, '#fff6a8'); star4(g, 110, 92, 8 * s2, '#fff6a8'); break; }
      case 'heart': { const s = 1 + (tw > 0 ? .15 : 0); g.fill(heartD(294, 62 + bob, 11 * s), '#ff4f7e', 2); g.fill(heartD(112, 90 - bob, 7), '#ff8fb0', 1.6); break; }
      case 'gloom': for (const X of [156, 170, 184, 216, 230, 244]) g.line(`M${X},86 V${120 + (X % 3) * 6 + bob}`, '#5a3a8a', 2.6); break;
      case 'gloomlite': g.solid('M146,98 L254,98 L254,110 L146,110Z', '#3a2a5a'); break;
      case 'steam': { const u = -Math.round(t * 2) * 5; [[262, 42], [128, 52]].forEach(([X, Y], i) => g.fill(`M${X},${Y + u} q-8,-8 0,-14 q8,-6 14,2 q6,-4 10,4 q4,10 -6,12 q-8,6 -18,-4z`, '#ffffff', 2)); break; }
      case 'question': g.text('?', 276, 78 + bob, 40, '#ffd24a'); break;
      case 'exclaim': g.text('!', 278, 78 + (tw > 0 ? -3 : 0), 44, '#ff4f6a'); break;
      case 'notes': g.text('♪', 280, 80 + bob, 32, '#b58aff'); g.text('♫', 116, 98 - bob, 26, '#ff8fb8'); break;
      case 'zzz': g.text('Z', 270, 88 + bob, 24, '#9aa4ff'); g.text('z', 290, 64 + bob, 18, '#9aa4ff'); break;
      case 'dizzy': { for (let i = 0; i < 3; i++) { const a = t * TAU + i * TAU / 3; star(g, 200 + Math.cos(a) * 52, 44 + Math.sin(a) * 12, 7, '#ffd24a', 1.6, LN); } break; }
    }
  }
  function star4(g, cx, cy, r, col) { g.fill(`M${cx},${cy - r} L${cx + r * .28},${cy - r * .28} L${cx + r},${cy} L${cx + r * .28},${cy + r * .28} L${cx},${cy + r} L${cx - r * .28},${cy + r * .28} L${cx - r},${cy} L${cx - r * .28},${cy - r * .28}Z`, col, 1.6, '#e8a826'); }

  // ---------- arms ----------
  function tube(a, b, w0, w1) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    return `M${f1(a[0] + nx * w0 / 2)},${f1(a[1] + ny * w0 / 2)} L${f1(b[0] + nx * w1 / 2)},${f1(b[1] + ny * w1 / 2)} L${f1(b[0] - nx * w1 / 2)},${f1(b[1] - ny * w1 / 2)} L${f1(a[0] - nx * w0 / 2)},${f1(a[1] - ny * w0 / 2)}Z`;
  }
  function hand(g, c, type, col, sz) {
    const LN = c.line, fg = (x1, y1, x2, y2, w = 6) => { g.line(`M${x1},${y1} L${x2},${y2}`, LN, w + 2.4); g.line(`M${x1},${y1} L${x2},${y2}`, col, w); };
    g.save(); g.sc(sz);
    switch (type) {
      case 'fist': case 'hipfist': case 'under':
        g.fill('M-12,-2 C-14,11 -12,23 0,24 C12,23 14,11 12,-2Z', col, 2); g.line('M-8,16 q3,3 6,0 q3,3 6,0', LN, 1.2); if (type === 'fist') g.line('M-12,6 Q-4,10 4,6', LN, 1.2); break;
      case 'point': fg(2, 14, 3, 40); g.fill('M-12,-2 C-14,10 -12,21 0,22 C12,21 14,10 12,-2Z', col, 2); g.line('M-7,15 q3,3 6,0', LN, 1.2); break;
      case 'wave': case 'reach': fg(-7, 14, -13, 32); fg(-2, 16, -3, 37); fg(3, 16, 5, 37); fg(7, 14, 13, 31); fg(-10, 4, -20, 12); g.ell(0, 9, 11, 11, col, 2, LN); break;
      case 'chin': fg(-4, 14, -8, 34, 5.5); g.fill('M-12,-2 C-14,10 -12,20 0,21 C12,20 14,10 12,-2Z', col, 2); break;
      case 'clasp': case 'palm': g.fill('M-10,-2 C-12,9 -12,20 -7,28 C-3,33 6,33 9,26 C12,17 12,7 10,-2Z', col, 2); g.line('M-3,18 L-3,30 M2,18 L2,31 M6,17 L7,28', LN, 1.1); break;
      default: g.fill('M-10,-2 C-12,9 -12,20 -7,28 C-3,33 6,33 9,26 C12,17 12,7 10,-2Z', col, 2); g.fill('M-10,6 C-17,10 -17,18 -11,21 C-9,17 -9,13 -8,9', col, 1.8); g.line('M-3,18 L-4,29 M2,18 L2,30 M6,17 L7,28', LN, 1.1);
    }
    g.restore();
  }
  function arm(g, c, side, spec, st) {
    const B = BODY[c.body], kx = B.kx, [sx, sy] = B.sh[side === 'L' ? 0 : 1];
    const X = x => 200 + (x - 200) * kx;
    let [[ex, ey], [wx, wy], ht] = spec;
    ex = X(ex); wx = X(wx); ey += st.lift; wy += st.lift;
    if (st.waveArm && side === 'R') { const a = Math.sin(st.t * TAU * 2) * .28, dx = wx - ex, dy = wy - ey; wx = ex + dx * Math.cos(a) - dy * Math.sin(a); wy = ey + dx * Math.sin(a) + dy * Math.cos(a); }
    if (st.cheer) { const b = Math.round(Math.sin(st.t * TAU * 2 + (side === 'L' ? 0 : 1.5)) * 6); ey += b; wy += b * 1.6; }
    if (st.pump && side === 'R') { const b = Math.round(Math.sin(st.t * TAU) * 4); wy += b; }
    const s = [sx, sy + st.lift * .6], e = [ex, ey], w = [wx, wy], [a0, a1, a2] = B.arm, o = st.outfit;
    const sl = o.sleeve || 'long', skin = c.skin, sc = o.sleeveC || '#888', scS = o.sleeveS || shade(sc, -1, 12);
    const up = tube(s, e, a0, a1), lo = tube(e, w, a1, a2);
    const upC = sl === 'none' ? skin : sc, loC = sl === 'long' ? sc : skin;
    // silhouette with outline, then fill, then cel shade strip
    g.fill(up, upC, 3); g.ell(e[0], e[1], a1 / 2, a1 / 2, sl === 'long' ? sc : sl === 'short' ? skin : skin, 3);
    g.fill(lo, loC, 3); g.ell(s[0], s[1], a0 / 2 + 1, a0 / 2 + 1, upC, 0);
    g.solid(up, upC); g.solid(lo, loC); g.ell(e[0], e[1], a1 / 2 - 1.5, a1 / 2 - 1.5, sl === 'long' ? sc : skin);
    const sh2 = (a, b, w0, w1, col) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * (side === 'L' ? 1 : -1), ny = dx / l * (side === 'L' ? 1 : -1); g.solid(tube([a[0] - nx * w0 * .28, a[1] - ny * w0 * .28], [b[0] - nx * w1 * .28, b[1] - ny * w1 * .28], w0 * .38, w1 * .38), col); };
    sh2(s, e, a0, a1, sl === 'none' ? c.skinS : scS); sh2(e, w, a1, a2, sl === 'long' ? scS : c.skinS);
    if (sl === 'short') { const m = [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2]; g.fill(tube(s, [s[0] + (m[0] - s[0]) * 1.25, s[1] + (m[1] - s[1]) * 1.25], a0 + 5, a0 + 3), sc, 2.6); if (o.cuff) g.line(tube([s[0] + (m[0] - s[0]) * 1.1, s[1] + (m[1] - s[1]) * 1.1], [s[0] + (m[0] - s[0]) * 1.25, s[1] + (m[1] - s[1]) * 1.25], a0 + 5, a0 + 3), o.cuff, 3); }
    // cuff
    const ang = Math.atan2(w[1] - e[1], w[0] - e[0]) - Math.PI / 2;
    g.save(); g.tr(w[0], w[1]); g.x.rotate(ang);
    if (o.cuff && sl === 'long') g.fill('M-13,-9 L13,-9 L12,1 L-12,1Z', o.cuff, 2);
    if (o.glove) { g.fill('M-11,-10 L11,-10 L11,2 L-11,2Z', o.glove, 2); }
    const hs = ht === 'reach' ? 1.7 : c.body === 'b' ? 1.35 : c.body === 'm' ? 1.12 : 1;
    let hc = o.glove || skin; if (ht === 'hipfist') g.x.rotate(side === 'L' ? .6 : -.6);
    hand(g, c, ht, hc, hs);
    g.restore();
  }

  // ---------- generic outfits (casual / formal / winter / yukata / suit), per-character colours ----------
  const OUTFITS = {
    hikari: { casual: { style: 'tee', col: '#ffd54a', col2: '#3a5ba8', legs: 'shorts', jacket: '#f4f6ff', print: 'bolt' }, formal: { style: 'dress', col: '#ffcf3f' }, winter: { style: 'coat', col: '#f4f6ff', col2: '#2b4fd6', mitten: '#2b4fd6' }, yukata: { style: 'yukata', col: '#2b4fd6', col2: '#ffc21a', col3: '#fff27a' } },
    rei: { casual: { style: 'cardigan', col: '#3a3050', col2: '#1d1a2b', col3: '#f0ecf8', legs: 'skirt', socks: '#1d1a2b' }, formal: { style: 'dress', col: '#4b2e7c' }, winter: { style: 'coat', col: '#1d1a2b', col2: '#a978ff', mitten: '#a978ff' }, yukata: { style: 'yukata', col: '#1d1a2b', col2: '#b99bff', col3: '#a978ff' } },
    mira: { casual: { style: 'blouse', col: '#fff4f8', col2: '#6fd1c4', legs: 'skirt' }, formal: { style: 'dress', col: '#ffb3cf' }, winter: { style: 'coat', col: '#fbfdff', col2: '#26c6a6', mitten: '#26c6a6' }, yukata: { style: 'yukata', col: '#ffe6ef', col2: '#26c6a6', col3: '#ff8fb8' } },
    kaede: { casual: { style: 'hoodie', col: '#2fbf7a', col2: '#1c1f24', legs: 'shorts' }, formal: { style: 'dress', col: '#1f8a58' }, winter: { style: 'coat', col: '#2fbf7a', col2: '#f4f7f5', mitten: '#f4f7f5' }, yukata: { style: 'yukata', col: '#dcffea', col2: '#1c1f24', col3: '#2fbf7a' } },
    sora: { casual: { style: 'blouse', col: '#ece6ff', col2: '#2b2f6b', legs: 'skirt', socks: '#ffffff' }, formal: { style: 'dress', col: '#2b2f6b', stars: 1 }, winter: { style: 'coat', col: '#ddd8f7', col2: '#ff6fae', mitten: '#ff6fae' }, yukata: { style: 'yukata', col: '#2b2f6b', col2: '#ff6fae', col3: '#ffd54a' } },
    tetsu: { casual: { style: 'tee', col: '#4a5240', col2: '#2a2b30', jacket: '#8a6a4a' }, formal: { style: 'suit' }, winter: { style: 'coat', col: '#6f7684', col2: '#ff8a2a' }, yukata: { style: 'yukata', col: '#3a4a6a', col2: '#1c1f2a', col3: '#9fb4d9' } },
    aya: { formal: { style: 'dress', col: '#c42a36' }, winter: { style: 'coat', col: '#23222c', col2: '#c42a36' }, casual: { style: 'cardigan', col: '#6a2a36', col2: '#23222c', col3: '#f4f4f8' } },
    kyouya: { formal: { style: 'suit' }, casual: { style: 'hoodie', col: '#dfe8ee', col2: '#15161c' }, winter: { style: 'coat', col: '#dfe8ee', col2: '#7ff6ff' } },
    rin: { casual: { style: 'hoodie', col: '#ff9ad8', col2: '#2e3a52', legs: 'shorts' }, winter: { style: 'coat', col: '#e6f2ff', col2: '#5fe6ff', mitten: '#5fe6ff' }, yukata: { style: 'yukata', col: '#e6f2ff', col2: '#5fe6ff', col3: '#ff7ae0' } },
    shiori: { casual: { style: 'cardigan', col: '#233056', col2: '#1c2440', col3: '#f4f5fa' }, formal: { style: 'dress', col: '#f4f5fa' }, winter: { style: 'coat', col: '#f4f5fa', col2: '#f2c14e', mitten: '#233056' }, yukata: { style: 'yukata', col: '#233056', col2: '#f2c14e', col3: '#f4f5fa' } },
    natsuki: { casual: { style: 'tee', col: '#ff8a3a', col2: '#3a3f52', legs: 'shorts' }, winter: { style: 'coat', col: '#ff8a3a', col2: '#fff4dc', mitten: '#3a3f52' }, formal: { style: 'dress', col: '#d8582a' }, yukata: { style: 'yukata', col: '#ffd566', col2: '#d8582a', col3: '#fff4dc' } },
    saeki: { formal: { style: 'suit' }, winter: { style: 'coat', col: '#2a2436', col2: '#b58aff' } },
    kuroda: { formal: { style: 'suit' }, winter: { style: 'coat', col: '#3a3d46', col2: '#b8bcc8' } }
  };
  function garment(g, c, o) {
    const B = BODY[c.body], male = c.body !== 'f', T = B.torso, col = o.col || '#555', [cH, , cS, cD] = ramp(col, 7, 12), col2 = o.col2 || '#2a2b36', col3 = o.col3 || '#ffffff';
    const X = x => 200 + (x - 200) * B.kx;
    const legs = y => { g.fill(`M${X(142)},${y} L196,${y} L194,720 L${X(146)},720Z`, c.skin); g.fill(`M${X(258)},${y} L204,${y} L206,720 L${X(254)},720Z`, c.skin); };
    const shadeR = () => g.solid(`M${X(278)},254 C${X(292)},268 ${X(292)},296 ${X(288)},324 C${X(284)},356 ${X(272)},388 ${X(262)},412 L${X(246)},420 C${X(262)},370 ${X(270)},310 ${X(262)},262Z`, cS);
    const lower = () => {
      if (o.legs === 'shorts') { legs(560); g.fill(`M${X(132)},472 L${X(268)},472 L${X(274)},566 L204,566 L200,546 L196,566 L${X(126)},566Z`, col2); g.line(`M${X(152)},500 L${X(150)},560`, shade(col2, -1, 12), 1.6); }
      else if (o.legs === 'skirt') { legs(570); if (o.socks) { g.fill(`M${X(144)},636 L196,636 L194,720 L${X(146)},720Z`, o.socks); g.fill(`M${X(256)},636 L204,636 L206,720 L${X(254)},720Z`, o.socks); } g.fill(`M${X(134)},462 L${X(266)},462 C${X(280)},516 ${X(290)},556 ${X(296)},592 L${X(104)},592 C${X(110)},556 ${X(120)},516 ${X(134)},462Z`, col2); g.line(`M${X(162)},476 L${X(146)},588 M200,476 L200,590 M${X(238)},476 L${X(254)},588`, shade(col2, -1, 14), 1.6); }
      else { g.fill(male ? `M${X(124)},466 L${X(276)},466 L${X(282)},720 L206,720 L200,580 L194,720 L${X(118)},720Z` : 'M132,476 L268,476 L274,720 L204,720 L200,570 L196,720 L126,720Z', col2); g.line('M200,486 L200,572', shade(col2, -1, 14), 1.6); }
    };
    const out = { sleeve: 'long', sleeveC: col, sleeveS: cS, cuff: cD, glove: null };
    switch (o.style) {
      case 'tee': case 'hoodie':
        lower(); g.fill(T, col); shadeR(); g.line(`M${X(134)},478 L${X(266)},478`, cD, 3);
        if (o.style === 'tee') { g.line('M174,230 Q200,252 226,230', cD, 3.4); out.sleeve = 'short'; out.cuff = cD; }
        else { g.fill('M156,226 C162,194 238,194 244,226 C240,254 160,254 156,226Z', cH, 2); g.solid('M170,226 C176,208 224,208 230,226 C224,242 176,242 170,226Z', cS); g.line('M190,250 L186,300 M210,250 L214,300', '#f4f4f4', 2); g.fill(`M${X(152)},392 L${X(248)},392 L${X(260)},452 L${X(140)},452Z`, cH, 1.8); }
        if (o.print === 'bolt') g.poly([[206, 296], [188, 330], [200, 330], [192, 360], [216, 322], [204, 322], [212, 296]], C_BLUE, 1.6);
        if (o.jacket) { const [jH, , jS] = ramp(o.jacket, 6, 12); const pn = `M188,228 C${X(160)},236 ${X(130)},240 ${X(114)},254 C${X(100)},266 ${X(98)},292 ${X(102)},322 C${X(106)},356 ${X(126)},388 ${X(138)},414 C${X(144)},440 ${X(134)},470 ${X(130)},510 L${X(128)},540 L172,538 L174,420 C176,360 170,300 178,250Z`; g.fill(pn, o.jacket, 2); g.save(); g.x.translate(400, 0); g.x.scale(-1, 1); g.fill(pn, o.jacket, 2); g.solid(`M${X(114)},254 C${X(100)},266 ${X(98)},292 ${X(102)},322 C${X(106)},350 ${X(118)},378 ${X(128)},398 L${X(142)},392 C${X(128)},350 ${X(124)},300 ${X(128)},262Z`, jS); g.restore(); out.sleeve = 'long'; out.sleeveC = o.jacket; out.sleeveS = jS; out.cuff = jS; }
        break;
      case 'cardigan':
        lower(); g.fill(T, col3); g.solid('M180,224 L168,248 L196,244Z', '#ffffff');
        { const pn = `M188,228 C${X(160)},236 ${X(130)},240 ${X(114)},254 C${X(100)},266 ${X(98)},292 ${X(102)},322 C${X(106)},356 ${X(126)},388 ${X(138)},414 C${X(144)},440 ${X(134)},470 ${X(132)},490 L176,490 L176,420 C178,360 172,300 180,250Z`; g.fill(pn, col, 2); g.save(); g.x.translate(400, 0); g.x.scale(-1, 1); g.fill(pn, col, 2); g.restore(); }
        shadeR(); [300, 350, 400, 450].forEach(y => g.ell(172, y, 3.4, 3.4, cH, 1.2)); break;
      case 'blouse':
        lower(); g.fill(T, col); shadeR();
        g.fill('M188,226 C168,234 160,256 180,260 C194,262 198,246 200,236Z', '#ffffff', 1.6); g.fill('M212,226 C232,234 240,256 220,260 C206,262 202,246 200,236Z', '#ffffff', 1.6);
        g.fill('M200,246 C186,234 172,240 178,254 C182,262 194,258 200,252 C206,258 218,262 222,254 C228,240 214,234 200,246Z', col2, 1.6); g.ell(200, 250, 4.4, 4.4, col2, 1.4);
        out.cuff = '#ffffff'; break;
      case 'dress':
        if (male) return garment(g, c, { style: 'suit' });
        g.fill(T, c.skin); g.line('M170,246 Q184,252 196,248 M230,246 Q216,252 204,248', c.skinS, 1.8);
        g.fill('M112,300 C140,286 176,300 200,306 C224,300 260,286 288,300 C300,340 290,380 272,414 L262,440 C300,520 320,620 330,720 L70,720 C80,620 100,520 138,440 L128,414 C110,380 100,340 112,300Z', col);
        g.solid('M288,300 C300,340 290,380 272,414 L262,440 C300,520 320,620 330,720 L284,720 C272,600 254,500 242,440 C262,392 282,346 276,304Z', cS);
        g.line('M160,460 Q150,580 136,700 M200,470 L200,700 M240,460 Q250,580 264,700', cD, 1.8); g.line('M122,306 C150,296 180,310 200,314', cH, 2.6);
        g.line('M178,238 Q200,262 222,238', '#ffd54a', 2); g.ell(200, 262, 5.4, 5.4, o.stars ? '#ffd54a' : '#ffffff', 1.4);
        if (o.stars) [[150, 480], [240, 520], [180, 600], [260, 650], [130, 660], [220, 440]].forEach(([a, b]) => star(g, a, b, 7, '#ffd54a', 1.4));
        out.sleeve = 'none'; out.cuff = '#ffd54a'; break;
      case 'suit': {
        g.fill(male ? `M${X(124)},466 L${X(276)},466 L${X(282)},720 L206,720 L200,580 L194,720 L${X(118)},720Z` : 'M132,476 L268,476 L274,720 L204,720 L200,570 L196,720 L126,720Z', '#15151c');
        g.fill(T, '#1c1c26'); g.solid(`M${X(294)},250 C${X(308)},262 ${X(310)},292 ${X(306)},326 C${X(302)},370 ${X(286)},406 ${X(274)},438 L${X(252)},440 C${X(270)},380 ${X(284)},320 ${X(276)},258Z`, '#0e0e14');
        g.fill('M186,222 L214,222 L226,234 L200,368 L174,234Z', '#f4f4f8', 1.8); g.fill('M190,244 L200,250 L210,244 L206,330 L200,340 L194,330Z', o.tie || '#8a1e2a', 1.6);
        const lp = `M176,232 L${X(142)},300 L${X(164)},318 L${X(154)},334 L192,390 L198,366Z`; g.fill(lp, '#26263a', 1.8); g.save(); g.x.translate(400, 0); g.x.scale(-1, 1); g.fill(lp, '#26263a', 1.8); g.restore();
        out.sleeveC = '#1c1c26'; out.sleeveS = '#0e0e14'; out.cuff = '#f4f4f8'; break;
      }
      case 'coat':
        g.fill(T.replace(/L(\d+),4(80|88|92) L(\d+),4(80|88|92)/, ''), col); g.fill(`M${X(126)},430 L${X(274)},430 L${X(290)},720 L${X(110)},720Z`, col); shadeR(); g.solid(`M${X(274)},430 L${X(290)},720 L${X(250)},720 L${X(240)},430Z`, cS);
        g.line('M200,250 L200,720', cD, 2); [300, 360, 420, 480, 560].forEach(y => { g.ell(186, y, 4.4, 4.4, cD); g.ell(214, y, 4.4, 4.4, cD); });
        g.fill(`M${X(136)},418 L${X(264)},418 L${X(264)},436 L${X(136)},436Z`, cD, 1.6);
        for (let i = 0; i < 9; i++) g.ell(156 + i * 11, 232 + Math.sin(i / 8 * Math.PI) * 14, 9.5, 9.5, '#f6f4f0', 1.2);
        g.fill('M160,222 C180,248 220,248 240,222 L248,240 C228,272 172,272 152,240Z', col2); g.fill('M216,250 C232,290 238,340 232,400 L214,402 C218,346 210,300 198,262Z', col2); g.line('M216,398 l0,12 M222,398 l1,12 M228,398 l2,12', col2, 3);
        out.cuff = '#f6f4f0'; out.glove = o.mitten || null; break;
      case 'yukata': {
        g.fill(T.replace(/L(\d+),4(80|88|92) L(\d+),4(80|88|92)/, ''), col); g.fill(`M${X(126)},430 L${X(274)},430 L${X(284)},720 L${X(116)},720Z`, col); shadeR();
        [[150, 300], [244, 284], [182, 380], [262, 440], [140, 490], [226, 520], [170, 600], [252, 640], [134, 690], [210, 700]].forEach(([a, b]) => { for (let k = 0; k < 5; k++) g.ell(a + Math.cos(k * 1.256) * 5, b + Math.sin(k * 1.256) * 5, 3.8, 3.8, col3); g.ell(a, b, 2.4, 2.4, '#ffffff'); });
        g.line('M178,226 L206,330', '#f6f2ea', 7); g.line('M222,226 L196,318', cD, 7); g.line('M176,228 L204,334', c.line, 1.6);
        g.fill(male ? `M${X(120)},400 L${X(280)},400 L${X(282)},440 L${X(118)},440Z` : 'M126,396 L274,396 L276,452 L124,452Z', col2, 2); g.line(male ? `M${X(120)},420 L${X(280)},420` : 'M126,424 L274,424', col3, 3.4); g.line('M200,452 L200,720', cD, 1.8);
        out.cuff = col; break;
      }
      default: return null;
    }
    return out;
  }

  // ---------- one frame ----------
  function drawChar(x, id, st) {
    const c = CAST[id]; if (!c) return null;
    const g = G(x, c.line); g.markLine(c.hairL);
    const e = EMO[st.emo] || EMO.neutral, P = POSES[st.pose] || POSES.default, B = BODY[c.body];
    const t = st.t, sw = Math.sin(t * TAU), cw = Math.cos(t * TAU);
    const an = c.anim || {};
    const a = { t, sway: sw * (an.hair || 1), sway2: Math.sin(t * TAU - 1) * (an.hair || 1), bob2: Math.sin(t * TAU * 2), frame: st.frame, spark: an.spark };
    // body language: tilt, droop, lean, jolt, bounce
    let tilt = (P.tilt || 0) + (e.tilt || 0), dy = (e.droop || 0), dx = (P.lean || 0) + (e.lean || 0);
    if (e.sway) tilt += sw * 3 * e.sway;
    tilt += cw * (an.headSway || .8);
    if (e.shake) { const m = [[1, 0], [-1, 1], [0, -1], [-1, 0], [1, 1], [0, 0]][st.frame % 6]; dx += m[0] * 2.4 * e.shake; dy += m[1] * 2.4 * e.shake; }
    if (e.jolt) dy -= 5 * e.jolt * Math.max(0, cw);
    if (e.bob) dy -= Math.round(Math.abs(sw) * 3 * e.bob);
    if (e.hop) dy -= Math.round(Math.abs(Math.sin(t * TAU * 2)) * 9);
    if (P.cheer) dy -= Math.round(Math.abs(Math.sin(t * TAU * 2)) * 5);
    if (an.float) dy += Math.round(sw * 7);
    const st2 = { t, frame: st.frame, lift: (P.lift || 0) * -1, waveArm: P.waveArm, cheer: P.cheer, pump: P.pump, outfit: null };
    const breath = st.breath ? 2.2 * (an.breath || 1) : 0;
    x.save(); x.translate(dx, dy);
    // outfit resolution
    const of = st.of && st.of !== 'hero' && OUTFITS[id] && OUTFITS[id][st.of];
    // layers
    const headRot = () => { x.translate(200, 222); x.rotate(tilt * Math.PI / 180); x.translate(-200, -222 - breath); };
    if (c.aura) c.aura(g, c, a, 'back');
    x.save(); headRot(); c.back && c.back(g, c, a, of); x.restore();
    // body
    x.save(); x.translate(0, breath * .5);
    let o = of ? garment(g, c, of) : null;
    if (!o) { c.outfit(g, c, a); const C = c.col || {}; o = { sleeve: c.sleeve || 'long', sleeveC: c.sleeveC || C.jacket || C.suit, sleeveS: c.sleeveS || C.jacketS || C.suitS, cuff: c.cuffC || C.trim, glove: c.hand === 'glove' ? (C.glove || C_BLUE) : c.hand && c.hand !== 'skin' ? c.hand : null }; }
    st2.outfit = o;
    // neck
    const [n0, n1] = B.neck;
    g.fill(`M${n0},172 L${n0},240 Q200,248 ${n1},240 L${n1},172Z`, c.skin, 2.2); g.solid(`M${n0},190 Q200,214 ${n1},190 L${n1},210 Q200,228 ${n0},210Z`, c.skinS);
    if (c.collar) c.collar(g, c, a, of);
    x.restore();
    // head
    x.save(); headRot();
    const head = c.body === 'f' ? HEAD_F : c.old ? HEAD_O : HEAD_M;
    g.ell(140, 146, 7, 12, c.skin, 2); g.ell(260, 146, 7, 12, c.skin, 2);
    g.fill(head, c.skin, 2.4);
    g.solid(c.body === 'f' ? 'M257,112 C257,146 246,172 223,192 L226,182 C244,164 252,140 252,112Z' : 'M259,108 C259,148 250,176 228,196 L231,184 C249,164 254,138 254,108Z', c.skinS);
    // bang shadow on forehead
    g.solid(c.bangShadow || 'M146,98 L146,118 Q160,126 172,116 Q186,128 200,118 Q214,128 228,116 Q240,126 254,118 L254,98Z', c.skinS);
    if (c.faceExtra) c.faceExtra(g, c, a);
    const look = e.look || 0, ET = Array.isArray(e.e) ? e.e : [e.e, e.e];
    const eyL = st.blink && !['happy', 'closed', 'flat', 'sleepy'].includes(ET[0]) ? 'closed' : ET[0], eyR = st.blink && !['happy', 'closed', 'flat', 'sleepy'].includes(ET[1]) ? 'closed' : ET[1];
    (e.fx || []).forEach(k => manpu(g, c, k, t, 'under'));
    const ey = c.eyeY || 142;
    eye(g, c, 174, ey, true, eyL, look, t); eye(g, Object.assign({}, c, c.eye2 ? { eye: c.eye2, eyeD: c.eyeD2, eyeL: c.eyeL2, eyeP: shade(c.eyeD2, -1, 12) } : {}), 226, ey, false, eyR, look, t);
    // nose + mouth
    g.line('M201,160 l-2,5', c.skinD, 2);
    let m = e.m; if (st.talk) m = TALK[m] || 'open';
    (MOUTH[m] || MOUTH.small)(g, c);
    if (c.facial) c.facial(g, c, a);
    c.front(g, c, a, of);
    const bl = e.b === 'smug' ? 'normal' : e.b === 'worried' ? 'sad' : e.b, br = e.b === 'smug' ? 'raised' : e.b === 'worried' ? 'normal' : e.b;
    brow(g, c, 174, ey, true, bl); brow(g, c, 226, ey, false, br);
    if (c.glasses) c.glasses(g, c, a);
    x.restore();
    // arms
    x.save(); x.translate(0, breath * .5);
    arm(g, c, 'L', P.L, st2); arm(g, c, 'R', P.R, st2);
    x.restore();
    // head accessories that sit in front of arms (none) + front fx
    x.save(); headRot(); (e.fx || []).forEach(k => manpu(g, c, k, t, 'over')); x.restore();
    if (c.aura) c.aura(g, c, a, 'front');
    x.restore();
    return g;
  }

  // ---------- building frame sets ----------
  const NI = 12, NT = 4;
  function frameSpec(i, n) { return { t: i / n, frame: i, breath: i >= n * .25 && i < n * .75 }; }
  // draw -> collect the frame's colours -> snap to exactly that palette
  const render = (id, st, b = { W, H, s: S, ox: 0, oy: 0 }) => hiPaint(b, ctx => drawChar(ctx, id, st));
  let hc = null, hx = null;
  const snappers = new Map();
  // Paint on the 4x canvas, then snap to exactly the colours drawn. draw() returns one drawing context or several
  // (a CG pass merges the palettes of every character and effect in it). b.bare skips the outline.
  function hiPaint(b, draw) {
    const w = b.W * K, h = b.H * K;
    if (!hc) { hc = PX.mk(w, h); hx = hc.getContext('2d', { willReadFrequently: true }); }
    if (hc.width !== w || hc.height !== h) { hc.width = w; hc.height = h; }
    hx.setTransform(1, 0, 0, 1, 0, 0); hx.clearRect(0, 0, w, h); hx.globalAlpha = 1;
    hx.setTransform(K * b.s, 0, 0, K * b.s, -b.ox * K * b.s, -b.oy * K * b.s); hx.lineJoin = 'round'; hx.lineCap = 'round';
    const gs = [].concat(draw(hx) || []).filter(Boolean); if (!gs.length) return null;
    const used = new Set(), lines = new Set(); gs.forEach(g => { g.used.forEach(c => used.add(c)); g.lines.forEach(c => lines.add(c)); });
    const pal = [...used], key = pal.join('') + '|' + [...lines].join('');
    let sn = snappers.get(key); if (!sn) { sn = PX.makeSnapper(pal, [...lines]); snappers.set(key, sn); if (snappers.size > 200) snappers.delete(snappers.keys().next().value); }
    const d = hx.getImageData(0, 0, w, h).data;
    const a = PX.snap(d, b.W, b.H, K, sn, b.snap);
    return b.bare ? a : PX.outline(a, b.W, b.H, gs[0].LN);
  }

  const keyOf = (id, emo, pose, of) => `c|${id}|${EMO[emo] ? emo : 'neutral'}|${POSES[pose] ? pose : 'default'}|${of && OUTFITS[id] && OUTFITS[id][of] ? of : 'hero'}`;
  function build(id, emo, pose, of) {
    return async (early) => {
      const url = a => PX.toURL(a, W, H), st = (o) => Object.assign({ emo, pose, of }, o);
      const idle = [], talk = [];
      for (let i = 0; i < NI; i++) { idle.push(url(render(id, st(frameSpec(i, NI))))); if (i === 0) early(idle[0]); if (i % 3 === 2) await yieldNow(); }
      for (let i = 0; i < NT; i++) talk.push(url(render(id, st(Object.assign(frameSpec(i * 3, NI), { talk: i % 2 === 0 }))))), await yieldNow();
      const blink = [url(render(id, st(Object.assign(frameSpec(0, NI), { blink: 1 }))))];
      return { seq: { idle, talk, blink }, fd: { idle: 150, talk: 120 }, w: W, h: H };
    };
  }
  const yieldNow = () => new Promise(r => setTimeout(r, 0));
  const last = {};
  function sprite(id, emo = 'neutral', pose = 'default', portrait = false, of = 'hero', pri = 3) {
    if (!CAST[id]) return null;
    const k = keyOf(id, emo, pose, of);
    PX.request(k, build(id, emo, pose, of), pri);
    const { src, tmp } = PX.srcFor(k, last[id]); last[id] = k;
    const vb = portrait ? '122 34 156 172' : '0 0 400 720';
    return `<svg class="csvg pixelart" viewBox="${vb}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg"><image class="pxa" data-k="${k}"${tmp ? ' data-tmp="1"' : ''} href="${src}" x="0" y="0" width="400" height="720" preserveAspectRatio="none"/></svg>`;
  }
  const prewarm = (id, emo, pose, of) => CAST[id] && PX.request(keyOf(id, emo, pose, of), build(id, emo, pose, of), 0);

  // Export a sprite's frames as a Moonkai Pixel Studio project (open it with File > Open in pixel/index.html).
  function exportPxs(id, emo, pose, of) {
    const st = o => Object.assign({ emo, pose, of }, o), frames = [];
    for (let i = 0; i < NI; i++) frames.push(render(id, st(frameSpec(i, NI))));
    for (let i = 0; i < NT; i++) frames.push(render(id, st(Object.assign(frameSpec(i * 3, NI), { talk: i % 2 === 0 }))));
    frames.push(render(id, st(Object.assign(frameSpec(0, NI), { blink: 1 }))));
    const cv = PX.mk(W, H), cx = cv.getContext('2d'), url = a => { cx.clearRect(0, 0, W, H); cx.putImageData(new ImageData(a, W, H), 0, 0); return cv.toDataURL(); };
    const seen = new Map(); frames[0].forEach((v, i) => { if (i % 4 === 3 && v) { const k = PX.toHex([frames[0][i - 3], frames[0][i - 2], frames[0][i - 1]]); seen.set(k, (seen.get(k) || 0) + 1); } });
    const blank = url(new Uint8ClampedArray(W * H * 4)), name = id[0].toUpperCase() + id.slice(1);
    const proj = { app: 'moonkai-pixel', v: 1, w: W, h: H, fps: 7, frames: frames.length, palette: [...seen].sort((a, b) => b[1] - a[1]).slice(0, 64).map(e => e[0]), palName: 'Heartline · ' + name,
      layers: [{ name: 'Background', visible: true, opacity: 1, locked: false, guide: false, cels: frames.map(() => blank) }, { name: `${name} · ${emo} · ${pose}`, visible: true, opacity: 1, locked: false, guide: false, cels: frames.map(url) }] };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(proj)], { type: 'application/json' })); a.download = `${id}-${emo}-${pose}-${of || 'hero'}.pxs.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    return proj;
  }

  return { CAST, EMO, POSES, OUTFITS, sprite, exportPxs, prewarm, render, drawChar, keyOf, W, H, S, K, G, ribbon, hairLock, cap, angelRing, star, star4, heartD, garment, hiPaint };
})();

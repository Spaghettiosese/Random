/* HEARTLINE AGENCY — pixel cast, part two: Squad Zero, the Board, the Glazier and the Aoi siblings.
   Each character: new hair, hero costume, face details and a signature idle loop (see PixelCast in pxchars.js). */
(() => {
  const { CAST, hairLock, cap, angelRing, star, star4, heartD, ribbon } = PixelCast;
  const { shade, ramp } = PX;
  const TAU = Math.PI * 2;
  const SK = base => { const r = ramp(base, 4, 9); return { skin: base, skinS: r[2], skinD: r[3], skinH: r[0] }; };
  const HR = (hair, hairS, hairH, hairL) => ({ hair, hairS, hairH, hairL });
  const EY = (eye, eyeD, eyeL) => ({ eye, eyeD, eyeL, eyeP: shade(eyeD, -1, 12) });
  const TORSO_F = 'M186,226 C162,234 136,240 122,254 C110,266 108,290 112,318 C116,350 128,382 138,408 C142,432 136,456 134,480 L266,480 C264,456 258,432 262,408 C272,382 284,350 288,318 C292,290 290,266 278,254 C264,240 238,234 214,226Z';
  const TORSO_M = 'M184,224 C156,232 124,236 106,250 C92,262 90,292 94,326 C98,370 114,406 126,438 C128,470 126,478 124,488 L276,488 C274,478 272,470 274,438 C286,406 302,370 306,326 C310,292 308,262 294,250 C276,236 244,232 216,224Z';
  const TORSO_B = 'M180,222 C148,230 110,234 90,250 C74,264 72,296 76,332 C82,378 100,414 114,446 C116,474 114,482 112,492 L288,492 C286,482 284,474 286,446 C300,414 318,378 324,332 C328,296 326,264 310,250 C290,234 252,230 220,222Z';
  const SH_F = 'M278,254 C290,266 292,290 288,318 C284,350 272,382 262,408 L246,414 C262,366 270,306 262,262Z';
  const SH_M = 'M294,250 C308,262 310,292 306,326 C302,370 286,406 274,438 L252,440 C270,380 284,320 276,258Z';
  const SH_B = 'M310,250 C326,264 328,296 324,332 C318,378 300,414 286,446 L260,448 C280,386 298,322 290,258Z';
  const legsF = (g, c, y = 560) => { g.fill(`M140,${y} L196,${y} L194,720 L144,720Z`, c.skin); g.fill(`M260,${y} L204,${y} L206,720 L256,720Z`, c.skin); };
  // shared: a straight-bang fringe of blunt locks
  const fringe = (g, c, tips, top = 44, w = 26, prof = 'blunt') => tips.forEach(([x, y]) => hairLock(g, c, [[200 + (x - 200) * .25, top], [200 + (x - 200) * .6, top + 16], [x, y - 32], [x, y]], w, prof, x < 200 ? -1 : 1));

  // --- Rei Kurogane, Nightveil ---
  CAST.rei = Object.assign(SK('#fbeae6'), HR('#352a52', '#16101f', '#8f7ccc', '#08060d'), EY('#b27bff', '#3a1670', '#f0dcff'), {
    body: 'f', line: '#1c0f24', blush: '#f79ab0', sleeve: 'long', sleeveC: '#1b1826', sleeveS: '#0c0b12', cuffC: '#a978ff', hand: '#141220',
    anim: { hair: .6, headSway: .5 },
    back(g, c, a) {
      const s = a.sway * 8;
      g.fill(`M140,80 C116,130 104,220 100,330 C96,450 ${92 + s * .5},560 ${86 + s},700 L${314 + s},700 C${308 + s * .5},560 304,450 300,330 C296,220 284,130 260,80Z`, c.hair, 1.8, c.hairL);
      [[150, 70, 118, 64], [176, 64, 150, 60], [224, 64, 250, 60], [250, 70, 282, 64]].forEach(([x0, y0, x1, w]) => hairLock(g, c, [[x0, y0], [x1 - 6, 220], [x1 + s * .4, 460], [x1 + s, 700]], w, 'taper', x0 < 200 ? -1 : 1));
      g.line(`M250,110 C272,220 278,440 ${292 + s},660`, '#6d58a8', 2.6);
    },
    aura(g, c, a, layer) {
      // shadow wisps curling up from the ground
      if (layer !== 'back') return;
      for (let i = 0; i < 5; i++) {
        const ph = (a.t + i / 5) % 1, x0 = [96, 140, 250, 300, 190][i], y0 = 720 - ph * 260, w = 26 * (1 - ph) + 6, dx = Math.sin(ph * 6 + i) * 18;
        g.alpha(1); g.fill(`M${x0 + dx},${y0 - w * 2} C${x0 + dx + w},${y0 - w} ${x0 + w * .6},${y0 + w} ${x0},${y0 + w * 1.4} C${x0 - w * .6},${y0 + w} ${x0 + dx - w},${y0 - w} ${x0 + dx},${y0 - w * 2}Z`, i % 2 ? '#2a1446' : '#140a24', 1.6, '#5a2e9a');
      }
      g.markLine('#5a2e9a');
    },
    outfit(g, c, a) {
      // black tights, asymmetric skirt with violet lining, bodysuit with glowing circuits, one-shoulder scarf
      g.fill('M140,560 L196,560 L194,720 L144,720Z', '#221c33'); g.fill('M260,560 L204,560 L206,720 L256,720Z', '#221c33'); g.line('M146,640 L194,640 M254,640 L206,640', '#a978ff', 2.6);
      g.fill('M134,466 L266,466 C284,520 298,560 306,610 L200,580 L96,600 C104,556 118,512 134,466Z', '#4b2e7c'); g.fill('M134,466 L266,466 C278,510 286,540 290,572 L200,560 L112,576 C118,540 124,508 134,466Z', '#1b1826');
      g.fill(TORSO_F, '#1b1826'); g.solid(SH_F, '#0c0b12');
      g.line('M130,300 L152,334 L152,452 M270,300 L248,334 L248,452 M152,396 L248,396', '#b58aff', 3); g.line('M130,300 L152,334 L152,452 M270,300 L248,334 L248,452 M152,396 L248,396', '#efe2ff', 1.2);
      g.fill('M134,462 L266,462 L268,482 L132,482Z', '#2a2540', 1.8); g.ell(200, 472, 8, 8, '#a978ff', 1.8);
      g.fill('M178,198 L222,198 L226,236 C212,242 188,242 174,236Z', '#1b1826', 2); g.line('M176,214 L224,214', '#a978ff', 2);
    },
    collar(g, c, a) {
      const f = Math.sin(a.t * TAU) * 8;
      g.fill('M152,222 C176,252 224,252 248,222 L258,244 C234,286 166,286 142,244Z', '#4b2e7c'); g.solid('M248,222 L258,244 C242,272 214,282 196,280 C222,268 240,250 248,222Z', '#301a55');
      g.fill(`M222,258 C250,300 ${266 + f * .3},380 ${256 + f},470 L${234 + f},476 C${240 + f * .5},392 228,322 206,266Z`, '#4b2e7c'); g.solid(`M246,300 C258,350 ${262 + f * .3},410 ${254 + f},468 L${242 + f},470 C${248 + f * .5},410 246,350 238,306Z`, '#301a55');
      g.line(`M${238 + f},478 l-2,12 M${244 + f},477 l0,12 M${250 + f},476 l2,11`, '#4b2e7c', 2.6);
    },
    front(g, c, a) {
      const s = a.sway * 3;
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; hairLock(g, c, [[X(142), 88], [X(138), 150], [X(136) + s, 220], [X(140) + s, 300]], 30, 'blunt', sg); hairLock(g, c, [[X(152), 92], [X(150), 140], [X(150), 190], [X(152) + s, 232]], 18, 'blunt', sg); }
      cap(g, c);
      fringe(g, c, [[148, 120], [165, 123], [182, 120], [200, 123], [218, 120], [235, 123], [252, 120]]);
      angelRing(g, c, 80);
      g.save(); g.rot(-28, 254, 82); g.fill('M240,79 L270,79 L270,85 L240,85Z', '#a978ff', 1.6); g.restore();
      g.save(); g.rot(22, 254, 82); g.fill('M240,79 L270,79 L270,85 L240,85Z', '#7a52c0', 1.6); g.restore();
    }
  });

  // --- Mira Solace, Halo Nurse ---
  CAST.mira = Object.assign(SK('#fff0e9'), HR('#ffcfe0', '#e88fb2', '#fff6fa', '#a8467a'), EY('#22c3a3', '#0b5a55', '#c8fff0'), {
    body: 'f', line: '#3a1f2e', blush: '#ff8fb0', sleeve: 'long', sleeveC: '#fbfdff', sleeveS: '#d6e0ec', cuffC: '#26c6a6', hand: 'skin',
    anim: { hair: .8 },
    back(g, c, a) {
      const s = a.sway * 7;
      [[[150, 76], [110, 150], [96 + s * .4, 280], [112 + s, 380], 60], [[250, 76], [290, 150], [304 + s * .4, 280], [288 + s, 380], 60], [[170, 70], [130, 160], [120, 290], [140 + s, 400], 50], [[230, 70], [270, 160], [280, 290], [262 + s, 400], 50]]
        .forEach(([p0, p1, p2, p3, w], i) => hairLock(g, c, [p0, p1, p2, p3], w, 'taper', i % 2 ? 1 : -1));
      // wave curls at the ends
      for (const [x, y] of [[112, 382], [288, 382], [140, 402], [262, 402]]) g.fill(`M${x + s - 14},${y - 6} q14,-10 26,6 q-10,14 -24,6Z`, c.hair, 1.4, c.hairL);
    },
    aura(g, c, a, layer) {
      if (layer === 'back') return;
      // floating healer's crosses, glowing on and off
      for (let i = 0; i < 4; i++) {
        const ph = (a.t + i / 4) % 1, x0 = [78, 322, 110, 300][i], y0 = 420 - ph * 200, s = ph < .8 ? 7 : 5;
        g.fill(`M${x0 - s / 3},${y0 - s} h${s * .66} v${s * .66} h${s * .66} v${s * .66} h${-s * .66} v${s * .66} h${-s * .66} v${-s * .66} h${-s * .66} v${-s * .66} h${s * .66}Z`, ph < .5 ? '#7ff0da' : '#c8fff0', 1.4, '#138a78');
      }
      g.markLine('#138a78');
    },
    outfit(g, c, a) {
      legsF(g, c, 570); g.fill('M144,610 L196,610 L194,720 L146,720Z', '#fbfdff'); g.fill('M256,610 L204,610 L206,720 L254,720Z', '#fbfdff'); g.line('M146,618 L195,618 M254,618 L205,618', '#26c6a6', 3);
      g.fill('M130,440 L270,440 C284,500 294,550 300,600 L100,600 C106,550 116,500 130,440Z', '#fbfdff'); g.solid('M270,440 C284,500 294,550 300,600 L262,600 C258,540 250,490 240,440Z', '#d6e0ec');
      g.line('M102,596 L298,596', '#26c6a6', 4); g.line('M168,456 L156,592 M232,456 L244,592', '#d6e0ec', 2);
      g.fill(TORSO_F, '#fbfdff'); g.solid(SH_F, '#d6e0ec');
      g.fill('M200,300 m-8,-18 h16 v10 h10 v16 h-10 v10 h-16 v-10 h-10 v-16 h10Z', '#26c6a6', 1.8);
      g.fill('M132,430 L268,430 L270,452 L130,452Z', '#ff9ac0', 1.8); g.fill('M196,432 C184,444 180,470 188,486 L200,452 L212,486 C220,470 216,444 204,432Z', '#ff9ac0', 1.6);
      g.line('M200,238 L200,280', '#d6e0ec', 2); g.fill('M172,226 L200,258 L228,226 L236,240 L200,274 L164,240Z', '#26c6a6', 1.8);
    },
    front(g, c, a) {
      const s = a.sway * 4;
      hairLock(g, c, [[146, 90], [138, 150], [140, 200], [150 + s, 246]], 26, 'taper', -1);
      // side braid over the right shoulder
      for (let i = 0; i < 6; i++) { const y = 150 + i * 28, x = 262 + Math.sin(i * .6) * 4 + s * i / 6; g.fill(`M${x - 13},${y} C${x - 14},${y + 20} ${x + 10},${y + 26} ${x + 13},${y + 8} C${x + 12},${y - 8} ${x - 12},${y - 10} ${x - 13},${y}Z`, c.hair, 1.6, c.hairL); g.solid(`M${x - 2},${y + 2} C${x},${y + 16} ${x + 10},${y + 18} ${x + 10},${y + 6}Z`, c.hairS); }
      g.fill(`M${262 + s},322 l-8,12 l16,0Z`, '#26c6a6', 1.4);
      cap(g, c);
      [[[198, 44], [170, 54], [146, 80], [142, 118], 30], [[204, 44], [232, 54], [256, 80], [258, 118], 30], [[200, 44], [182, 64], [166, 94], [160, 126], 34], [[202, 44], [220, 64], [236, 94], [240, 126], 34], [[201, 46], [196, 70], [196, 100], [202, 126], 26]]
        .forEach(([p0, p1, p2, p3, w]) => hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      angelRing(g, c, 82);
      // nurse cap with teal cross + halo ring above
      g.fill('M168,50 C180,36 220,36 232,50 L226,64 C212,58 188,58 174,64Z', '#fbfdff', 1.8); g.fill('M196,42 h8 v4 h4 v6 h-4 v4 h-8 v-4 h-4 v-6 h4Z', '#26c6a6', 1.2);
      const gl = Math.sin(a.t * TAU) > 0;
      g.ring(200, 18, 44, 9, gl ? '#fff3a0' : '#ffe066', 5); g.ring(200, 18, 44, 9, '#fffbe0', 1.6);
    }
  });

  // --- Kaede Mori, Gale ---
  CAST.kaede = Object.assign(SK('#fde6d8'), HR('#56d493', '#1f8a58', '#dcffea', '#0f5034'), EY('#ffb13b', '#7a3a00', '#ffe6a0'), {
    body: 'f', line: '#20182a', blush: '#ff9aa6', sleeve: 'long', sleeveC: '#f4f7f5', sleeveS: '#c5d4cc', cuffC: '#2fbf7a', hand: '#1c1f24',
    anim: { hair: 1.6, headSway: 1 },
    back(g, c, a) {
      // high ponytail whipping in the wind
      const s = a.sway * 16, s2 = a.sway2 * 12;
      hairLock(g, c, [[222, 50], [290 + s * .3, 30], [330 + s, 140], [314 + s2, 300]], 54, 'taper', 1);
      hairLock(g, c, [[226, 54], [300, 60], [352 + s, 170], [346 + s2 * 1.2, 250]], 30, 'taper', 1);
      hairLock(g, c, [[220, 52], [270, 80], [300 + s * .7, 200], [276 + s2, 330]], 26, 'taper', -1);
      g.fill('M152,86 C150,130 156,176 166,210 L234,210 C244,176 250,130 248,86Z', c.hairS, 0);
    },
    aura(g, c, a, layer) {
      if (layer !== 'front') return;
      // wind streaks and a leaf riding them
      for (let i = 0; i < 4; i++) { const ph = (a.t * 2 + i / 4) % 1, y = [150, 330, 470, 250][i], x = -60 + ph * 520; g.line(`M${x},${y} q30,-8 70,0`, '#e8fff2', 2.6); }
      const ph = a.t, lx = 360 - ph * 340, ly = 200 + Math.sin(ph * TAU * 2) * 30; g.fill(`M${lx},${ly} q10,-12 22,-2 q-10,12 -22,2Z`, '#2fbf7a', 1.4, '#0f5034');
    },
    outfit(g, c, a) {
      legsF(g, c, 560);
      g.fill('M132,468 L268,468 L274,566 L204,566 L200,548 L196,566 L126,566Z', '#1f8a58'); g.line('M132,472 L126,562 M268,472 L274,562', '#f4f7f5', 3);
      g.fill(TORSO_F, '#1c1f24'); g.line('M150,300 Q200,320 250,300', '#2fbf7a', 2.4);
      // track jacket, half zipped, sleeves with white stripes
      const pn = 'M188,228 C160,236 132,240 118,254 C104,266 102,292 106,322 C110,356 128,388 138,414 C144,440 136,466 134,488 L184,490 L186,330 C186,300 182,262 188,240Z';
      g.fill(pn, '#2fbf7a', 2); g.mir(() => g.fill(pn, '#2fbf7a', 2));
      g.solid('M278,254 C290,266 292,290 288,318 C284,350 272,382 262,408 L250,412 C264,366 272,306 264,262Z', '#1f8a58');
      g.line('M186,330 L186,488 M214,330 L214,488', '#f4f7f5', 2.4); g.fill('M196,328 L204,328 L204,342 L196,342Z', '#dfe4ea', 1.4);
      g.fill('M164,222 C176,240 224,240 236,222 L242,238 C224,258 176,258 158,238Z', '#2fbf7a', 2); g.line('M160,238 C178,252 222,252 240,238', '#f4f7f5', 2.4);
    },
    front(g, c, a) {
      const s = a.sway * 4;
      cap(g, c);
      // short choppy bangs blown sideways
      [[[196, 44], [168, 52], [144, 74], [140, 110], 28], [[206, 44], [236, 50], [258, 74], [262, 106], 28], [[200, 46], [178, 62], [158 + s, 90], [150 + s, 122], 30], [[206, 46], [222, 62], [236 + s, 88], [246 + s, 118], 30], [[200, 46], [190, 70], [186 + s, 96], [182 + s, 118], 26], [[204, 46], [212, 70], [218 + s, 94], [226 + s, 112], 22]]
        .forEach(([p0, p1, p2, p3, w]) => hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; hairLock(g, c, [[X(148), 96], [X(144), 130], [X(146), 160], [X(152) + s, 186]], 18, 'taper', sg); }
      // white headband with tails flying behind
      g.fill('M142,78 C160,58 240,58 258,78 L256,90 C238,72 162,72 144,90Z', '#f4f7f5', 1.8);
      const f = a.sway * 10; g.fill(`M256,80 C280,76 ${300 + f},64 ${326 + f},72 L${320 + f},82 C${300 + f},80 282,88 258,92Z`, '#f4f7f5', 1.6); g.fill(`M256,86 C276,92 ${294 + f},96 ${314 + f},110 L${304 + f},116 C${288 + f},104 272,100 256,96Z`, '#dfe8e2', 1.6);
    }
  });

  // --- Sora Hoshino, Stargazer ---
  CAST.sora = Object.assign(SK('#fff0ec'), HR('#e2dcfa', '#9a90cc', '#ffffff', '#4e467e'), EY('#ff6fae', '#7a1044', '#ffd6ea'), {
    body: 'f', line: '#2a1f40', blush: '#ffa0c0', sleeve: 'none', cuffC: '#ff6fae', hand: '#ffffff',
    anim: { hair: 1, float: 1 },
    back(g, c, a) {
      const s = a.sway * 10;
      // long hair lifted by her own gravity field
      [[[148, 80], [100, 170], [92 + s, 330], [70 + s * 1.2, 470], 54], [[252, 80], [300, 170], [308 - s, 330], [330 - s * 1.2, 470], 54], [[170, 76], [130, 200], [128, 360], [110 + s, 520], 44], [[230, 76], [270, 200], [272, 360], [290 - s, 520], 44]]
        .forEach(([p0, p1, p2, p3, w], i) => hairLock(g, c, [p0, p1, p2, p3], w, 'taper', i % 2 ? 1 : -1));
      // twin buns
      for (const X of [150, 250]) { g.ell(X, 56, 24, 22, c.hair, 1.8, c.hairL); g.ell(X + 4, 60, 13, 12, c.hairS); g.ell(X - 6, 50, 8, 6, c.hairH); }
    },
    aura(g, c, a, layer) {
      // three stars orbiting her; in front on the near half of the orbit
      for (let i = 0; i < 3; i++) {
        const an = a.t * TAU + i * TAU / 3, near = Math.sin(an) > 0; if ((layer === 'front') !== near) continue;
        star(g, 200 + Math.cos(an) * 150, 330 + Math.sin(an) * 40, near ? 11 : 7, i === 1 ? '#ff9ad8' : '#fff27a', 1.6);
      }
    },
    outfit(g, c, a) {
      legsF(g, c, 580); g.fill('M144,630 L196,630 L194,720 L146,720Z', '#ffffff'); g.fill('M256,630 L204,630 L206,720 L254,720Z', '#ffffff'); g.line('M146,636 L195,636 M254,636 L205,636', '#ff6fae', 3);
      // layered idol skirt
      g.fill('M130,452 L270,452 C292,500 306,544 316,592 L84,592 C94,544 108,500 130,452Z', '#2b2f6b'); g.fill('M136,452 L264,452 C282,492 292,524 298,560 L102,560 C108,524 118,492 136,452Z', '#ffffff');
      for (let i = 0; i < 9; i++) g.fill(`M${100 + i * 22},560 q11,14 22,0`, '#ffffff', 1.4); g.line('M102,556 L298,556', '#ff6fae', 2.4);
      g.fill(TORSO_F.replace('C142,432 136,456 134,480 L266,480 C264,456 258,432', 'C142,432 136,446 134,458 L266,458 C264,446 258,432'), '#ffffff'); g.solid(SH_F, '#dcdcf0');
      g.fill('M134,250 L266,250 L262,300 C230,290 170,290 138,300Z', '#2b2f6b', 1.8); // off-shoulder band
      g.fill('M200,300 C186,284 162,288 170,306 C176,318 194,310 200,304 C206,310 224,318 230,306 C238,288 214,284 200,300Z', '#ff6fae', 1.8); g.ell(200, 302, 6, 6, '#ffd54a', 1.4);
      star(g, 200, 380, 12, '#ffd54a', 1.6);
      g.fill('M130,440 L270,440 L270,456 L130,456Z', '#ff6fae', 1.6);
    },
    collar(g, c) { g.fill('M178,212 L222,212 L222,226 L178,226Z', '#2b2f6b', 1.6); star(g, 200, 222, 6, '#ffd54a', 1.2); },
    front(g, c, a) {
      const s = a.sway * 4;
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; hairLock(g, c, [[X(146), 92], [X(136), 160], [X(138) - s * sg, 230], [X(150) - s * sg, 300]], 22, 'taper', sg); }
      cap(g, c);
      [[[196, 44], [168, 54], [146, 78], [140, 116], 28], [[204, 44], [232, 54], [254, 78], [260, 116], 28], [[199, 46], [184, 64], [168, 94], [162, 128], 32], [[203, 46], [218, 64], [232, 94], [238, 128], 32], [[201, 46], [200, 72], [200, 100], [200, 124], 24]]
        .forEach(([p0, p1, p2, p3, w]) => hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      angelRing(g, c, 84);
      star(g, 150, 84, 9, '#ffd54a', 1.6); star(g, 252, 90, 7, '#ff9ad8', 1.6);
    }
  });

  // --- Tetsu Oda, Bulwark ---
  CAST.tetsu = Object.assign(SK('#f3d2bc'), HR('#7a4e2c', '#3a2414', '#c89a6a', '#24150a'), EY('#c98a3a', '#4a2a0a', '#ffd9a0'), {
    body: 'b', line: '#24150a', sleeve: 'none', cuffC: '#ff8a2a', hand: '#6a707c', eyeY: 140,
    anim: { hair: .3, breath: 1.6, headSway: .4 },
    bangShadow: 'M146,96 L146,104 Q200,114 254,104 L254,96Z',
    back(g, c) { g.fill('M144,90 C138,120 142,150 150,170 L250,170 C258,150 262,120 256,90Z', c.hairS, 0); },
    aura(g, c, a, layer) {
      if (layer !== 'front') return;
      // a steel glint sweeping across the shoulder plates
      const ph = a.t, x0 = 70 + ph * 280; if (ph < .55) g.line(`M${x0},250 l18,-18 M${x0 + 8},254 l10,-10`, '#ffffff', 3);
    },
    outfit(g, c, a) {
      g.fill('M118,470 L282,470 L290,720 L206,720 L200,590 L194,720 L110,720Z', '#2a2b30'); g.line('M200,480 L200,590', '#16171a', 2); g.fill('M112,650 L190,650 L192,700 L112,700Z', '#4a4e58', 1.8); g.fill('M288,650 L210,650 L208,700 L288,700Z', '#4a4e58', 1.8);
      g.fill(TORSO_B, '#3a3d46'); g.solid(SH_B, '#24262c');
      // armoured vest: chest plate with rivets and orange stripe
      g.fill('M130,262 L270,262 L276,420 C240,440 160,440 124,420Z', '#5a5f6a', 2.2); g.solid('M240,262 L270,262 L276,420 C262,428 250,432 236,434Z', '#44474f');
      g.line('M124,340 L276,340', '#ff8a2a', 6); g.line('M124,340 L276,340', '#ffb070', 1.4);
      [[140, 280], [260, 280], [140, 400], [260, 400], [200, 420]].forEach(([x, y]) => g.ell(x, y, 4, 4, '#b8bcc8', 1.4));
      g.fill('M112,474 L288,474 L290,500 L110,500Z', '#1d1e22', 2); g.fill('M186,472 L214,472 L214,502 L186,502Z', '#ff8a2a', 1.8);
      // shoulder plates
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; g.fill(`M${X(76)},262 C${X(80)},236 ${X(110)},226 ${X(140)},236 L${X(136)},286 C${X(112)},290 ${X(88)},284 ${X(76)},262Z`, '#6a707c', 2.2); g.line(`M${X(86)},258 C${X(100)},246 ${X(118)},242 ${X(132)},248`, '#b8bcc8', 2); }
    },
    collar(g, c) { g.fill('M170,214 L230,214 L236,236 L164,236Z', '#24262c', 2); },
    facial(g, c) { g.line('M178,196 q22,10 44,0', c.skinS, 2); for (let i = 0; i < 8; i++) g.ell(176 + i * 7, 192 + (i % 2) * 3, 1.2, 1.2, c.skinD); },
    front(g, c, a) {
      g.fill('M140,112 C132,56 166,38 200,38 C234,38 268,56 260,112 C254,90 238,76 200,76 C162,76 146,90 140,112Z', c.hair, 2, c.hairL);
      // short spikes
      [[150, 64, 132, 40], [172, 48, 162, 18], [196, 42, 196, 12], [222, 46, 236, 18], [246, 60, 268, 40], [160, 84, 138, 78], [240, 84, 262, 78]].forEach(([x, y, tx, ty], i) => g.fill(`M${x - 14},${y + 12} L${tx},${ty} L${x + 14},${y + 6}Z`, i % 2 ? c.hair : c.hairS, 1.8, c.hairL));
      g.solid('M160,60 C176,48 198,46 212,48 C196,54 180,62 170,72Z', c.hairH);
      // sideburns
      g.fill('M142,104 L150,104 L152,150 L144,146Z', c.hair, 1.4, c.hairL); g.fill('M258,104 L250,104 L248,150 L256,146Z', c.hair, 1.4, c.hairL);
      // bandage on the cheek
      g.fill('M230,166 l18,-6 l3,8 l-18,6Z', '#fff4e0', 1.4); g.line('M236,166 l4,6 M242,164 l4,6', '#d9b98a', 1);
    }
  });

  // --- Kyouya Aoi, The Glazier ---
  CAST.kyouya = Object.assign(SK('#f7ece8'), HR('#eef4f8', '#8fcfe6', '#ffffff', '#3c5566'), EY('#5fe6ff', '#0a4a66', '#e0fcff'), {
    body: 'm', line: '#16202a', sleeve: 'long', sleeveC: '#eef2f6', sleeveS: '#b8c6d4', cuffC: '#5fe6ff', hand: '#15161c',
    anim: { hair: .7 },
    back(g, c, a) { const s = a.sway * 5; g.fill(`M140,80 C126,130 128,190 ${136 + s},244 L${264 + s},244 C272,190 274,130 260,80Z`, c.hairS, 1.8, c.hairL); },
    aura(g, c, a, layer) {
      // glass shards orbit him, catching the light
      for (let i = 0; i < 6; i++) {
        const an = a.t * TAU * .5 + i * TAU / 6, near = Math.sin(an) > 0; if ((layer === 'front') !== near) continue;
        const x = 200 + Math.cos(an) * 170, y = 300 + Math.sin(an) * 50 - (i % 2) * 90, h = near ? 26 : 16, glint = (a.frame + i) % 6 === 0;
        g.fill(`M${x},${y - h} L${x + h * .4},${y} L${x},${y + h * .5} L${x - h * .4},${y}Z`, glint ? '#ffffff' : '#9ff6ff', 1.6, '#2a6a8a');
      }
      g.markLine('#2a6a8a');
    },
    outfit(g, c, a) {
      g.fill('M124,466 L276,466 L282,720 L206,720 L200,580 L194,720 L118,720Z', '#15161c');
      g.fill(TORSO_M, '#15161c'); g.line('M200,240 L200,470', '#2a2d38', 2);
      // long white coat, open, with glass shoulder spikes
      const pn = 'M186,226 C156,232 118,236 98,250 C84,262 84,292 88,326 C92,372 110,410 124,440 C128,520 118,620 104,720 L170,720 C172,600 172,480 176,400 C178,330 172,280 180,240Z';
      g.fill(pn, '#eef2f6', 2); g.mir(() => { g.fill(pn, '#eef2f6', 2); g.solid('M98,250 C84,262 84,292 88,326 C92,372 108,408 120,436 C124,520 114,620 100,720 L128,720 C140,600 146,480 140,420 C124,370 108,310 112,260Z', '#b8c6d4'); });
      g.line('M180,240 C172,280 178,330 176,400 C172,480 172,600 170,720 M220,240 C228,280 222,330 224,400 C228,480 228,600 230,720', '#5fe6ff', 2.6);
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; g.fill(`M${X(96)},254 L${X(62)},220 L${X(104)},238 L${X(80)},196 L${X(124)},234 L${X(128)},262Z`, '#9ff6ff', 1.8, '#2a6a8a'); }
    },
    collar(g, c) { g.fill('M162,216 C176,238 224,238 238,216 L246,236 C226,262 174,262 154,236Z', '#eef2f6', 2); g.line('M158,236 C176,254 224,254 242,236', '#5fe6ff', 2); },
    front(g, c, a) {
      const s = a.sway * 3;
      g.fill('M138,122 C128,58 164,34 200,34 C236,34 272,58 262,122 C252,92 232,78 200,78 C168,78 148,92 138,122Z', c.hair, 2, c.hairL);
      // messy fringe falling over his right eye
      [[[196, 40], [160, 50], [140, 84], [142, 126], 30], [[204, 40], [238, 50], [262, 84], [260, 124], 30], [[200, 42], [196, 70], [200 + s, 110], [212 + s, 150], 36], [[206, 42], [226, 70], [238 + s, 110], [248 + s, 158], 40], [[196, 42], [176, 70], [168, 98], [168, 120], 24]]
        .forEach(([p0, p1, p2, p3, w]) => PixelCast.hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      angelRing(g, c, 80);
    }
  });

  // --- Rin Aoi, Echo ---
  CAST.rin = Object.assign(SK('#f7eef4'), HR('#e6f2ff', '#86b8e6', '#ffffff', '#3c5a7a'), EY('#5fe6ff', '#0a4a66', '#e0fcff'), {
    eye2: '#ff7ae0', eyeD2: '#6a1060', eyeL2: '#ffe0f6', body: 'f', line: '#1c2438', blush: '#ffa6d0', sleeve: 'long', sleeveC: '#2e3a52', sleeveS: '#1d2638', cuffC: '#ff9ad8', hand: 'skin',
    anim: { hair: .9 },
    back(g, c, a) { const s = a.sway * 5; g.fill(`M146,90 C132,130 132,180 ${140 + s},226 L${260 + s},226 C268,180 268,130 254,90Z`, c.hairS, 1.8, c.hairL); },
    aura(g, c, a, layer) {
      if (layer !== 'front') return;
      // resonance: rings pulse out from her headphones; every few frames her outline echoes
      const r = 20 + a.t * 60; for (const X of [136, 264]) { g.ring(X, 140, r * .5, r, a.t < .5 ? '#9ff0ff' : '#ff9ad8', 2.4); }
      if (a.frame % 4 === 1) { g.alpha(.55); g.line('M120,300 L96,300 M112,380 L84,380 M288,340 L316,340 M292,420 L318,420', '#9ff0ff', 3); g.alpha(1); }
    },
    outfit(g, c, a) {
      legsF(g, c, 570); g.fill('M144,640 L196,640 L194,720 L146,720Z', '#2e3a52'); g.fill('M256,640 L204,640 L206,720 L254,720Z', '#2e3a52');
      g.fill('M132,466 L268,466 C282,516 292,552 298,590 L102,590 C108,552 118,516 132,466Z', '#3e4c68'); g.line('M160,478 L146,586 M200,478 L200,588 M240,478 L254,586', '#1d2638', 2);
      // oversized hoodie jacket with pink drawstrings, over a white tee
      g.fill(TORSO_F, '#f4f6fa'); g.fill('M188,228 C160,236 130,240 114,254 C100,266 98,292 102,322 C106,356 124,390 132,420 C134,444 130,470 128,500 L178,500 L178,300 C178,270 182,244 190,232Z', '#2e3a52', 2);
      g.mir(() => { g.fill('M188,228 C160,236 130,240 114,254 C100,266 98,292 102,322 C106,356 124,390 132,420 C134,444 130,470 128,500 L178,500 L178,300 C178,270 182,244 190,232Z', '#2e3a52', 2); g.solid('M114,254 C100,266 98,292 102,322 C106,350 120,380 128,404 L140,398 C126,350 120,300 124,262Z', '#1d2638'); });
      g.line('M186,250 L182,320 M214,250 L218,320', '#ff9ad8', 2.4); g.ell(182, 324, 3, 3, '#ff9ad8', 1); g.ell(218, 324, 3, 3, '#ff9ad8', 1);
      g.fill('M156,440 L244,440 L244,460 L156,460Z', '#3e4c68', 1.6);
    },
    collar(g, c) { g.fill('M150,224 C164,196 236,196 250,224 C246,252 154,252 150,224Z', '#3e4c68', 2); g.solid('M166,224 C176,210 224,210 234,224 C226,238 174,238 166,224Z', '#1d2638'); },
    front(g, c, a) {
      const s = a.sway * 3;
      // bob with long front locks
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; PixelCast.hairLock(g, c, [[X(144), 94], [X(136), 150], [X(138) + s, 220], [X(152) + s, 280]], 26, 'taper', sg); }
      cap(g, c);
      [[[196, 44], [168, 54], [146, 80], [142, 116], 30], [[204, 44], [232, 54], [254, 80], [258, 116], 30], [[198, 46], [182, 66], [172, 96], [170, 130], 30], [[202, 46], [220, 66], [228, 96], [232, 126], 30], [[200, 46], [200, 74], [196, 100], [194, 122], 22]]
        .forEach(([p0, p1, p2, p3, w]) => PixelCast.hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      angelRing(g, c, 84);
      // headphones: band over the head, cyan/pink cups
      g.line('M138,120 C132,50 268,50 262,120', '#2a3048', 8); g.line('M138,120 C132,50 268,50 262,120', '#5fe6ff', 3);
      g.fill('M124,118 C124,104 146,104 146,118 L146,158 C146,172 124,172 124,158Z', '#5fe6ff', 2); g.fill('M254,118 C254,104 276,104 276,118 L276,158 C276,172 254,172 254,158Z', '#ff7ae0', 2);
      g.ell(135, 138, 5, 9, '#ffffff'); g.ell(265, 138, 5, 9, '#ffffff');
    }
  });

  // --- Shiori Kagami, Aegis Prime ---
  CAST.shiori = Object.assign(SK('#fbe8de'), HR('#263462', '#0b1024', '#8aa0d8', '#050812'), EY('#f2c14e', '#6a4a00', '#fff0b0'), {
    body: 'f', line: '#10142a', sleeve: 'long', sleeveC: '#f4f5fa', sleeveS: '#c9cfe0', cuffC: '#e0b84a', hand: '#e8eaf2',
    anim: { hair: .6, headSway: .4 },
    back(g, c, a) {
      // navy cape, fluttering
      const f = a.sway * 12;
      g.fill(`M120,256 C100,380 ${92 + f * .5},560 ${76 + f},720 L${324 + f},720 C${308 + f * .5},560 300,380 280,256Z`, '#233056', 2); g.solid(`M280,256 C300,380 ${308 + f * .5},560 ${324 + f},720 L${280 + f},720 C${270 + f * .5},560 262,400 250,262Z`, '#141c38');
      g.line(`M${80 + f},716 L${320 + f},716`, '#f2c14e', 4);
      g.fill('M146,86 C136,130 140,180 150,214 L250,214 C260,180 264,130 254,86Z', c.hair, 1.8, c.hairL);
    },
    aura(g, c, a, layer) {
      if (layer !== 'front') return;
      // Aegis hexes flicker on
      for (let i = 0; i < 3; i++) { const on = (a.frame + i * 4) % 12 < 3; if (!on) continue; const x = [92, 316, 300][i], y = [300, 250, 420][i]; let d = ''; for (let k = 0; k < 6; k++) { const an = k * TAU / 6; d += (k ? 'L' : 'M') + (x + Math.cos(an) * 14).toFixed(1) + ',' + (y + Math.sin(an) * 14).toFixed(1); } g.fill(d + 'Z', '#fff4c0', 2, '#f2c14e'); }
    },
    outfit(g, c, a) {
      g.fill('M132,476 L268,476 L274,720 L204,720 L200,570 L196,720 L126,720Z', '#f4f5fa'); g.line('M140,480 L134,716 M260,480 L266,716', '#e0b84a', 3);
      g.fill(TORSO_F, '#f4f5fa'); g.solid(SH_F, '#c9cfe0');
      // armoured officer jacket: gold trim, breastplate, aegis badge
      g.fill('M140,280 L260,280 L256,380 C230,396 170,396 144,380Z', '#e8ecf6', 2); g.line('M200,240 L200,470', '#e0b84a', 3);
      g.line('M168,240 L168,470 M232,240 L232,470', '#c9cfe0', 1.6);
      let d = ''; for (let k = 0; k < 6; k++) { const an = k * TAU / 6 + TAU / 12; d += (k ? 'L' : 'M') + (200 + Math.cos(an) * 18).toFixed(1) + ',' + (330 + Math.sin(an) * 18).toFixed(1); } g.fill(d + 'Z', '#f2c14e', 2); g.fill('M200,318 L208,330 L200,342 L192,330Z', '#233056', 1.2);
      g.fill('M132,452 L268,452 L270,474 L130,474Z', '#233056', 1.8); g.fill('M190,450 L210,450 L210,476 L190,476Z', '#f2c14e', 1.6);
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; g.fill(`M${X(112)},256 C${X(120)},238 ${X(150)},232 ${X(172)},238 L${X(168)},262 L${X(116)},270Z`, '#f2c14e', 2); for (let k = 0; k < 4; k++) g.line(`M${X(120 + k * 12)},266 l0,14`, '#e0b84a', 2); }
    },
    collar(g, c) { g.fill('M170,204 L230,204 L236,236 C214,248 186,248 164,236Z', '#f4f5fa', 2); g.line('M168,232 C186,242 214,242 232,232', '#e0b84a', 2.4); },
    front(g, c, a) {
      const s = a.sway * 3;
      cap(g, c);
      fringe(g, c, [[150, 118], [168, 124], [186, 120], [204, 124], [222, 120], [240, 124], [254, 116]], 44, 26, 'taper');
      angelRing(g, c, 80);
      // low ponytail over her right shoulder
      PixelCast.hairLock(g, c, [[250, 170], [276, 220], [272 + s, 320], [258 + s, 420]], 38, 'taper', 1);
      g.fill('M250,196 l16,-6 l6,14 l-16,6Z', '#f2c14e', 1.6);
      PixelCast.hairLock(g, c, [[148, 96], [140, 140], [142, 180], [150 + s, 214]], 20, 'taper', -1);
    }
  });

  // --- Chairman Genjirou Kuroda ---
  CAST.kuroda = Object.assign(SK('#f0d8c8'), HR('#a4aab2', '#5a6068', '#e2e6ea', '#2a2e34'), EY('#7a7a8c', '#20202a', '#c8c8d8'), {
    body: 'm', old: true, line: '#1a1418', sleeve: 'long', sleeveC: '#1a1a22', sleeveS: '#0c0c10', cuffC: '#f4f4f8', hand: 'skin', eyeY: 144,
    anim: { hair: 0, headSway: .15, breath: .6 },
    bangShadow: 'M146,86 L146,92 L254,92 L254,86Z',
    back() { },
    aura(g, c, a, layer) { if (layer === 'front' && a.frame % 12 === 4) star4(g, 246, 300, 10, '#fff6c0'); },
    outfit(g, c, a) {
      g.fill('M124,466 L276,466 L282,720 L206,720 L200,580 L194,720 L118,720Z', '#14141a');
      g.fill(TORSO_M, '#1a1a22'); g.solid(SH_M, '#0c0c10');
      g.fill('M186,222 L214,222 L226,234 L200,368 L174,234Z', '#f4f4f8', 1.8); g.fill('M192,244 L200,250 L208,244 L205,330 L200,338 L195,330Z', '#5a1020', 1.6);
      const lp = 'M176,232 L130,300 L158,318 L146,334 L192,390 L198,366Z'; g.fill(lp, '#26263a', 1.8); g.mir(() => g.fill(lp, '#26263a', 1.8));
      g.ell(246, 300, 6, 6, '#e0b84a', 1.6); // HALO board pin
      g.line('M150,420 L170,420 M230,420 L250,420', '#0c0c10', 2);
    },
    facial(g, c) {
      g.line('M160,120 q10,-4 20,0 M220,120 q10,-4 20,0', c.skinD, 1.6); g.line('M176,168 q-8,14 2,24 M224,168 q8,14 -2,24', c.skinS, 2);
      // moustache and short beard
      g.fill('M178,172 C188,164 212,164 222,172 C214,178 206,176 200,172 C194,176 186,178 178,172Z', '#a4aab2', 1.6, '#2a2e34');
      g.fill('M176,190 C186,214 214,214 224,190 C214,202 186,202 176,190Z', '#a4aab2', 1.4, '#2a2e34');
    },
    front(g, c, a) {
      // slicked-back grey hair with a receding line
      g.fill('M140,112 C134,58 166,36 200,36 C234,36 266,58 260,112 C254,84 244,70 226,64 C210,72 190,72 174,64 C156,70 146,84 140,112Z', c.hair, 2, c.hairL);
      g.line('M160,52 C180,44 220,44 240,52 M150,70 C170,58 230,58 250,70', c.hairS, 2); g.line('M168,46 C186,40 214,40 232,46', c.hairH, 2);
      g.fill('M140,100 L150,100 L152,146 L142,140Z', c.hair, 1.4, c.hairL); g.fill('M260,100 L250,100 L248,146 L258,140Z', c.hair, 1.4, c.hairL);
    }
  });

  // --- Deputy Saeki ---
  CAST.saeki = Object.assign(SK('#fbe6dc'), HR('#23232e', '#08080c', '#6c6c86', '#040406'), EY('#a878e8', '#3a1670', '#e8d8ff'), {
    body: 'm', line: '#140c1a', sleeve: 'long', sleeveC: '#f2f2f6', sleeveS: '#c8c8d4', cuffC: '#15151c', hand: 'skin',
    anim: { hair: .3, headSway: .3 },
    back(g, c) { g.fill('M144,90 C136,130 140,170 150,196 L250,196 C260,170 264,130 256,90Z', c.hairS, 0); },
    outfit(g, c, a) {
      g.fill('M124,466 L276,466 L282,720 L206,720 L200,580 L194,720 L118,720Z', '#e6e6ee'); g.line('M200,480 L200,580', '#c8c8d4', 2);
      g.fill(TORSO_M, '#f2f2f6'); g.solid(SH_M, '#c8c8d4');
      g.fill('M186,222 L214,222 L226,234 L200,368 L174,234Z', '#15151c', 1.8); g.fill('M193,244 L200,250 L207,244 L204,330 L200,338 L196,330Z', '#8a5ad8', 1.6);
      const lp = 'M176,232 L130,300 L158,318 L146,334 L192,390 L198,366Z'; g.fill(lp, '#dcdce6', 1.8); g.mir(() => g.fill(lp, '#dcdce6', 1.8));
      g.fill('M232,316 l18,-4 l2,8 l-18,4Z', '#8a5ad8', 1.2); g.line('M150,300 L150,312', '#b58aff', 2); // pen in the pocket
    },
    glasses(g, c, a) {
      g.line('M150,128 L194,128 M206,128 L250,128 M194,128 Q200,124 206,128', '#b8bcc8', 2.2); g.line('M150,128 Q152,152 172,152 Q192,152 194,128 M206,128 Q208,152 228,152 Q248,152 250,128', '#8c90a0', 1.4);
      // glare sweeping across the lenses
      const ph = a.t * 2 % 1; if (ph < .45) { const x = 150 + ph / .45 * 100; g.line(`M${x},150 l12,-22`, '#ffffff', 5); }
    },
    front(g, c, a) {
      g.fill('M138,120 C128,58 164,36 200,36 C236,36 272,58 262,120 C256,96 240,80 214,76 C190,84 160,92 138,120Z', c.hair, 2, c.hairL);
      PixelCast.hairLock(g, c, [[214, 44], [180, 56], [158, 80], [150, 116]], 44, 'leaf', -1);
      PixelCast.hairLock(g, c, [[220, 46], [244, 56], [258, 80], [260, 112]], 30, 'leaf', 1);
      g.line('M214,48 C230,58 240,70 246,84', c.hairH, 2.4); angelRing(g, c, 78);
    }
  });

  // --- Natsuki Amane, Salamander ---
  CAST.natsuki = Object.assign(SK('#fde6d8'), HR('#ffd566', '#e3862c', '#fff6d2', '#a3501c'), EY('#3aa6ff', '#123b8c', '#c0f0ff'), {
    body: 'f', line: '#2a1418', blush: '#ff9a8a', sleeve: 'long', sleeveC: '#ff7a2a', sleeveS: '#d45a14', cuffC: '#dfe4ea', hand: '#3a3f52',
    anim: { hair: .8 },
    back(g, c, a) { const s = a.sway * 4; g.fill(`M146,86 C132,130 134,176 ${142 + s},206 L${258 + s},206 C266,176 268,130 254,86Z`, c.hairS, 1.8, c.hairL); },
    aura(g, c, a, layer) {
      if (layer !== 'front') return;
      // embers rising around her
      for (let i = 0; i < 7; i++) { const ph = (a.t + i / 7) % 1, x = [90, 310, 130, 280, 70, 330, 200][i] + Math.sin(ph * 9 + i) * 10, y = 600 - ph * 420, r = 5 * (1 - ph) + 2; g.ell(x, y, r, r, ph < .5 ? '#ffd54a' : '#ff6a2a', 1.4, '#8a2a0a'); }
      g.markLine('#8a2a0a');
    },
    outfit(g, c, a) {
      g.fill('M132,476 L268,476 L274,720 L204,720 L200,570 L196,720 L126,720Z', '#3a3f52'); g.fill('M130,620 L196,620 L196,640 L130,640Z', '#dfe4ea', 1.4); g.fill('M270,620 L204,620 L204,640 L270,640Z', '#dfe4ea', 1.4);
      g.fill(TORSO_F, '#ff7a2a'); g.solid(SH_F, '#d45a14');
      // rescue jacket: reflective bands, zip, radio clip
      g.fill('M116,392 L284,392 L282,414 L118,414Z', '#dfe4ea', 1.6); g.line('M118,403 L282,403', '#ffe066', 2); g.fill('M112,300 L150,300 L150,320 L112,320Z', '#dfe4ea', 1.4);
      g.line('M200,238 L200,470', '#8a3a10', 2.4); g.fill('M226,280 l20,0 l0,34 l-20,0Z', '#2a2d38', 1.8); g.line('M242,280 l0,-14', '#2a2d38', 2.4);
      g.fill('M132,452 L268,452 L270,476 L130,476Z', '#2a2d38', 1.8); g.fill('M190,450 L210,450 L210,478 L190,478Z', '#ffd54a', 1.6);
    },
    collar(g, c) { g.fill('M158,216 C176,240 224,240 242,216 L248,238 C226,262 174,262 152,238Z', '#ff7a2a', 2); g.line('M156,236 C176,252 224,252 244,236', '#dfe4ea', 2.4); },
    front(g, c, a) {
      const f = a.frame % 2;
      cap(g, c);
      // short bob whose tips flicker like flames
      [[[196, 44], [164, 52], [140, 80], [136, 130], 30], [[204, 44], [236, 52], [260, 80], [264, 130], 30], [[198, 46], [176, 62], [160, 92], [152, 126], 32], [[204, 46], [226, 62], [242, 92], [248, 126], 32], [[201, 46], [194, 70], [192, 98], [190, 122], 26]]
        .forEach(([p0, p1, p2, p3, w]) => PixelCast.hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; PixelCast.hairLock(g, c, [[X(142), 100], [X(132), 150], [X(136), 190], [X(148), 214]], 26, 'taper', sg); g.fill(`M${X(140)},206 l${-6 * sg},${16 + f * 6} l${10 * sg},-8 l${4 * sg},${14 - f * 4} l${6 * sg},-20Z`, '#ff8a2a', 1.4, c.hairL); }
      angelRing(g, c, 84);
      g.fill('M232,70 l14,-4 l4,10 l-14,4Z', '#ff6a2a', 1.4); // flame clip
    }
  });

  // --- Director Aya Takamine ---
  CAST.aya = Object.assign(SK('#fbe5da'), HR('#c42e3a', '#6a0f1e', '#ff9a9a', '#420610'), EY('#e6a03a', '#6a2a0a', '#ffe7a8'), {
    body: 'f', line: '#2a0c14', blush: '#f58a9a', sleeve: 'long', sleeveC: '#23222c', sleeveS: '#131218', cuffC: '#f4f4f8', hand: 'skin',
    anim: { hair: .7, headSway: .5 },
    back(g, c, a) {
      const s = a.sway * 8;
      [[[150, 80], [110, 160], [104 + s * .4, 300], [118 + s, 420], 56], [[250, 80], [294, 160], [300 + s * .4, 300], [284 + s, 420], 56], [[176, 70], [140, 200], [140, 340], [160 + s, 450], 44], [[226, 70], [262, 200], [262, 340], [244 + s, 450], 44]]
        .forEach(([p0, p1, p2, p3, w], i) => hairLock(g, c, [p0, p1, p2, p3], w, 'taper', i % 2 ? 1 : -1));
    },
    aura(g, c, a, layer) { },
    outfit(g, c, a) {
      legsF(g, c, 560); g.fill('M140,560 L196,560 L194,720 L144,720Z', '#3a2a30'); g.fill('M260,560 L204,560 L206,720 L256,720Z', '#3a2a30');
      g.fill('M130,460 L270,460 L276,600 L124,600Z', '#23222c'); g.line('M200,520 L200,600', '#131218', 2);
      g.fill(TORSO_F, '#f4f4f8'); g.fill('M190,236 L210,236 L206,300 L200,308 L194,300Z', '#c42a36', 1.6);
      const pn = 'M186,226 C162,234 136,240 122,254 C110,266 108,290 112,318 C116,350 128,382 138,408 C142,432 136,456 132,500 L180,500 L182,380 C182,320 176,270 188,236Z';
      g.fill(pn, '#23222c', 2); g.mir(() => { g.fill(pn, '#23222c', 2); g.solid('M122,254 C110,266 108,290 112,318 C116,350 126,378 134,400 L148,396 C132,350 126,300 132,262Z', '#131218'); });
      g.fill('M184,290 L170,262 L188,244Z', '#35343f', 1.4); g.fill('M216,290 L230,262 L212,244Z', '#35343f', 1.4);
      g.ell(236, 320, 5, 5, '#e0b84a', 1.4); // HALO pin
    },
    glasses(g, c, a) {
      g.line('M152,124 L196,124 L196,150 L152,150Z M204,124 L248,124 L248,150 L204,150Z M196,134 L204,134', '#2a1418', 2.4);
      if (a.frame % 12 === 7) g.line('M160,146 l12,-18 M212,146 l12,-18', '#ffffff', 3);
    },
    front(g, c, a) {
      const s = a.sway * 3;
      cap(g, c);
      // deep side-swept bang
      PixelCast.hairLock(g, c, [[226, 44], [180, 50], [150, 84], [144, 134]], 60, 'leaf', -1);
      [[[210, 44], [238, 52], [256, 78], [262, 118], 30], [[216, 46], [228, 70], [238, 98], [242, 124], 26], [[196, 46], [180, 70], [170 + s, 110], [170 + s, 150], 30]]
        .forEach(([p0, p1, p2, p3, w]) => PixelCast.hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; PixelCast.hairLock(g, c, [[X(146), 98], [X(138), 160], [X(140) + s, 220], [X(150) + s, 270]], 24, 'taper', sg); }
      angelRing(g, c, 80);
    }
  });
})();

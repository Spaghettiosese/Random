/* HEARTLINE AGENCY — pixel cast, part two: Squad Zero, the Board, the Glazier and the Aoi siblings.
   Redrawn on the anime rig in pxchars.js: same hair, eyes and costume themes, new drawings, each with a
   signature idle loop. */
(() => {
  const { CAST, ANAT, hairLock, cap, fringe, angelRing, star, star4, cel, clipY, wearTorso, wearLegs, skirt, shorts, mirror, garment } = PixelCast;
  const { shade, ramp } = PX;
  const TAU = Math.PI * 2;
  const SK = base => { const r = ramp(base, 4, 10); return { skin: base, skinS: r[2], skinD: r[3], skinH: r[0] }; };
  const HR = (hair, hairS, hairH, hairL) => ({ hair, hairS, hairH, hairL });
  const EY = (eye, eyeD, eyeL) => ({ eye, eyeD, eyeL, eyeP: shade(eyeD, -1, 12) });
  const f1 = n => n.toFixed(1);
  // open jacket panels on the torso down to y1, leaving a front gap
  const panels = (g, A, col, sh, y1, gap = 16, top = 236) => { g.save(); g.clip(A.torso); clipY(g, 0, y1); mirror(g, () => cel(g, `M-80,${top} L${200 - gap},${top} L${200 - gap},${y1 + 2} L-80,${y1 + 2}Z`, col, sh)); g.restore(); const [a, b] = A.span(Math.min(y1, 560)); if (y1 < 560) g.line(`M${f1(a)},${y1} L${f1(200 - gap)},${y1} M${f1(200 + gap)},${y1} L${f1(b)},${y1}`, g.LN, 2.4); };
  const sideLocks = (g, c, x0, y0, y1, w, s = 0) => { for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; hairLock(g, c, [[X(x0), y0], [X(x0 - 10), y0 + (y1 - y0) * .35], [X(x0 - 8) + s * sg, y0 + (y1 - y0) * .7], [X(x0 + 2) + s * sg, y1]], w, 'taper', sg); } };

  // --- Rei Kurogane, Nightveil: waist-length violet-black hime cut, shadow bodysuit, purple scarf ---
  CAST.rei = Object.assign(SK('#fbeae6'), HR('#352a52', '#16101f', '#8f7ccc', '#08060d'), EY('#b27bff', '#3a1670', '#f0dcff'), {
    body: 'f', line: '#1c0f24', blush: '#f79ab0', anim: { hair: .6, headSway: .5 },
    hero: { sleeve: 'long', sleeveC: '#1b1826', sleeveS: '#0c0b12', cuff: '#a978ff', glove: '#141220' },
    back(g, c, a) {
      const s = a.sway * 9;
      cel(g, `M138,96 C118,160 108,260 104,380 C100,500 ${96 + s * .5},610 ${92 + s},720 L${308 + s},720 C${304 + s * .5},610 300,500 296,380 C292,260 282,160 262,96Z`, c.hair, c.hairS, 2, c.hairL, [-12, -4]);
      [[150, 80, 120, 56], [176, 72, 150, 50], [224, 72, 250, 50], [250, 80, 282, 56]].forEach(([x0, y0, x1, w]) => hairLock(g, c, [[x0, y0], [x1 - 6, 260], [x1 + s * .4, 500], [x1 + s, 720]], w, 'taper', x0 < 200 ? -1 : 1));
    },
    aura(g, c, a, layer) {
      if (layer !== 'back') return;
      for (let i = 0; i < 5; i++) { const ph = (a.t + i / 5) % 1, x0 = [80, 130, 262, 316, 196][i], y0 = 740 - ph * 280, w = 26 * (1 - ph) + 6, dx = Math.sin(ph * 6 + i) * 18;
        g.fill(`M${x0 + dx},${y0 - w * 2} C${x0 + dx + w},${y0 - w} ${x0 + w * .6},${y0 + w} ${x0},${y0 + w * 1.4} C${x0 - w * .6},${y0 + w} ${x0 + dx - w},${y0 - w} ${x0 + dx},${y0 - w * 2}Z`, i % 2 ? '#2a1446' : '#140a24', 1.6, '#5a2e9a'); }
      g.markLine('#5a2e9a');
    },
    outfit(g, c, A) {
      wearLegs(g, A, '#231d35', '#141020'); A.legs.forEach(l => { g.save(); g.clip(l); g.line('M0,660 L400,660', '#a978ff', 2.6); g.restore(); });
      wearTorso(g, A, '#1b1826', '#0c0b12');
      g.line('M156,300 L174,336 L174,450 M244,300 L226,336 L226,450 M174,400 L226,400', '#b58aff', 3.2); g.line('M156,300 L174,336 L174,450 M244,300 L226,336 L226,450 M174,400 L226,400', '#efe2ff', 1.2);
      skirt(g, A, '#1b1826', '#0c0b12', 470, 596, 28, 4); g.fill('M232,474 L270,474 C290,530 300,580 306,626 L262,600Z', '#4b2e7c', 2);
      g.fill('M158,462 L242,462 L244,480 L156,480Z', '#2a2540', 2); g.ell(200, 471, 8, 8, '#a978ff', 1.8);
    },
    collar(g, c, a) {
      const f = Math.sin(a.t * TAU) * 9;
      cel(g, 'M160,250 C180,278 220,278 240,250 L250,272 C226,310 174,310 150,272Z', '#4b2e7c', '#301a55');
      cel(g, `M222,290 C248,330 ${262 + f * .3},400 ${254 + f},490 L${234 + f},494 C${240 + f * .5},410 228,350 206,298Z`, '#4b2e7c', '#301a55');
      g.line(`M${238 + f},496 l-2,12 M${244 + f},495 l0,12 M${250 + f},494 l2,11`, '#4b2e7c', 2.6);
    },
    front(g, c, a) {
      const s = a.sway * 3;
      sideLocks(g, c, 146, 100, 320, 30, s); sideLocks(g, c, 156, 104, 250, 18, s);
      cap(g, c);
      fringe(g, c, [[146, 134, 26], [163, 138, 26], [181, 134, 26], [200, 138, 26], [219, 134, 26], [237, 138, 26], [254, 134, 26]], [200, 40], 'blunt');
      angelRing(g, c, 86);
      g.save(); g.rot(-28, 254, 88); g.fill('M240,85 L270,85 L270,91 L240,91Z', '#a978ff', 1.6); g.restore();
      g.save(); g.rot(22, 254, 88); g.fill('M240,85 L270,85 L270,91 L240,91Z', '#7a52c0', 1.6); g.restore();
    }
  });

  // --- Mira Solace, Halo Nurse: soft pink waves, side braid, nurse cap with halo ---
  CAST.mira = Object.assign(SK('#fff0e9'), HR('#ffcfe0', '#e88fb2', '#fff6fa', '#a8467a'), EY('#22c3a3', '#0b5a55', '#c8fff0'), {
    body: 'f', line: '#3a1f2e', blush: '#ff8fb0', anim: { hair: .8 },
    hero: { sleeve: 'long', sleeveC: '#fbfdff', sleeveS: '#d6e0ec', cuff: '#26c6a6' },
    back(g, c, a) {
      const s = a.sway * 8;
      g.fill('M142,96 C132,150 136,200 150,236 L250,236 C264,200 268,150 258,96Z', c.hairS, 0);
      [[[150, 80], [106, 170], [94 + s * .4, 330], [112 + s, 450], 60], [[250, 80], [294, 170], [306 + s * .4, 330], [288 + s, 450], 60], [[170, 74], [128, 190], [118, 350], [138 + s, 480], 48], [[230, 74], [272, 190], [282, 350], [262 + s, 480], 48]]
        .forEach(([p0, p1, p2, p3, w], i) => hairLock(g, c, [p0, p1, p2, p3], w, 'taper', i % 2 ? 1 : -1));
      for (const [x, y] of [[112, 452], [288, 452], [138, 482], [262, 482]]) g.fill(`M${x + s - 14},${y - 6} q14,-12 28,6 q-12,14 -26,6Z`, c.hair, 1.6, c.hairL);
    },
    aura(g, c, a, layer) {
      if (layer === 'back') return;
      for (let i = 0; i < 4; i++) { const ph = (a.t + i / 4) % 1, x0 = [66, 334, 96, 312][i], y0 = 460 - ph * 220, s = ph < .8 ? 7 : 5;
        g.fill(`M${x0 - s / 3},${y0 - s} h${s * .66} v${s * .66} h${s * .66} v${s * .66} h${-s * .66} v${s * .66} h${-s * .66} v${-s * .66} h${-s * .66} v${-s * .66} h${s * .66}Z`, ph < .5 ? '#7ff0da' : '#c8fff0', 1.4, '#138a78'); }
      g.markLine('#138a78');
    },
    outfit(g, c, A) {
      wearLegs(g, A, c.skin, c.skinS); wearLegs(g, A, '#fbfdff', '#d6e0ec', 640); A.legs.forEach(l => { g.save(); g.clip(l); g.line('M0,648 L400,648', '#26c6a6', 3); g.restore(); });
      wearTorso(g, A, '#fbfdff', '#d6e0ec');
      skirt(g, A, '#fbfdff', '#d6e0ec', 452, 628, 30, 5, '#26c6a6');
      g.fill('M200,370 m-9,-20 h18 v11 h11 v18 h-11 v11 h-18 v-11 h-11 v-18 h11Z', '#26c6a6', 1.8);
      const [a0, b0] = A.span(440); g.fill(`M${a0 - 2},428 L${b0 + 2},428 L${b0 + 2},450 L${a0 - 2},450Z`, '#ff9ac0', 2);
      g.fill('M196,432 C182,446 178,474 186,492 L200,454 L214,492 C222,474 218,446 204,432Z', '#ff9ac0', 1.8);
      g.fill('M174,248 L200,286 L226,248 L236,262 L200,304 L164,262Z', '#26c6a6', 2);
    },
    front(g, c, a) {
      const s = a.sway * 4;
      hairLock(g, c, [[146, 100], [134, 160], [136, 220], [148 + s, 270]], 28, 'taper', -1);
      for (let i = 0; i < 7; i++) { const y = 178 + i * 30, x = 264 + Math.sin(i * .6) * 4 + s * i / 7; g.fill(`M${x - 13},${y} C${x - 14},${y + 20} ${x + 10},${y + 27} ${x + 13},${y + 8} C${x + 12},${y - 8} ${x - 12},${y - 10} ${x - 13},${y}Z`, c.hair, 1.6, c.hairL); g.solid(`M${x - 2},${y + 2} C${x},${y + 16} ${x + 10},${y + 18} ${x + 10},${y + 6}Z`, c.hairS); }
      g.fill(`M${264 + s},390 l-8,12 l16,0Z`, '#26c6a6', 1.4);
      cap(g, c);
      fringe(g, c, [[142, 128, 30], [160, 142, 34], [182, 134, 32], [202, 142, 28], [222, 134, 32], [242, 142, 34], [258, 128, 30]]);
      angelRing(g, c, 88);
      cel(g, 'M168,56 C180,40 220,40 232,56 L226,72 C212,66 188,66 174,72Z', '#fbfdff', '#d6e0ec'); g.fill('M196,48 h8 v4 h4 v6 h-4 v4 h-8 v-4 h-4 v-6 h4Z', '#26c6a6', 1.2);
      const gl = Math.sin(a.t * TAU) > 0; g.ring(200, 18, 46, 10, gl ? '#fff3a0' : '#ffe066', 5); g.ring(200, 18, 46, 10, '#fffbe0', 1.6);
    }
  });

  // --- Kaede Mori, Gale: green high ponytail, headband, open track jacket and shorts ---
  CAST.kaede = Object.assign(SK('#fde6d8'), HR('#56d493', '#1f8a58', '#dcffea', '#0f5034'), EY('#ffb13b', '#7a3a00', '#ffe6a0'), {
    body: 'f', line: '#20182a', blush: '#ff9aa6', anim: { hair: 1.6, headSway: 1 },
    hero: { sleeve: 'long', sleeveC: '#2fbf7a', sleeveS: '#1f8a58', cuff: '#f4f7f5', glove: '#1c1f24' },
    back(g, c, a) {
      const s = a.sway * 16, s2 = a.sway2 * 12;
      hairLock(g, c, [[224, 52], [292 + s * .3, 30], [334 + s, 150], [318 + s2, 330]], 54, 'taper', 1);
      hairLock(g, c, [[228, 56], [302, 62], [354 + s, 180], [348 + s2 * 1.2, 270]], 30, 'taper', 1);
      hairLock(g, c, [[222, 54], [272, 84], [302 + s * .7, 210], [280 + s2, 360]], 26, 'taper', -1);
      g.fill('M146,96 C138,150 142,190 154,216 L246,216 C258,190 262,150 254,96Z', c.hairS, 0);
    },
    aura(g, c, a, layer) {
      if (layer !== 'front') return;
      for (let i = 0; i < 4; i++) { const ph = (a.t * 2 + i / 4) % 1, y = [170, 360, 520, 280][i], x = -60 + ph * 520; g.line(`M${x},${y} q30,-8 70,0`, '#e8fff2', 2.6); }
      const lx = 360 - a.t * 340, ly = 220 + Math.sin(a.t * TAU * 2) * 30; g.fill(`M${lx},${ly} q10,-12 22,-2 q-10,12 -22,2Z`, '#2fbf7a', 1.4, '#0f5034');
    },
    outfit(g, c, A) {
      wearLegs(g, A, c.skin, c.skinS);
      shorts(g, A, '#1f8a58', '#146a42', 606); A.legs.forEach((l, i) => { const X = i ? 262 : 138; g.line(`M${X},512 L${X + (i ? 4 : -4)},602`, '#f4f7f5', 3); });
      wearTorso(g, A, '#1c1f24', '#0e1012', 0, 500); g.line('M166,350 Q200,366 234,350', '#2fbf7a', 2.4);
      panels(g, A, '#2fbf7a', '#1f8a58', 500, 20);
      g.line('M180,300 L180,500 M220,300 L220,500', '#f4f7f5', 2.4); g.fill('M196,352 L204,352 L204,366 L196,366Z', '#dfe4ea', 1.4);
      cel(g, 'M166,246 C176,264 224,264 234,246 L242,264 C224,286 176,286 158,264Z', '#2fbf7a', '#1f8a58'); g.line('M160,264 C178,278 222,278 240,264', '#f4f7f5', 2.4);
    },
    front(g, c, a) {
      const s = a.sway * 4;
      cap(g, c);
      fringe(g, c, [[140, 118, 28], [156 + s, 134, 30], [176 + s, 124, 30], [196 + s, 132, 26], [218 + s, 122, 30], [240 + s, 130, 30], [260, 114, 28]]);
      sideLocks(g, c, 148, 104, 200, 18, s);
      cel(g, 'M140,86 C160,64 240,64 260,86 L258,100 C238,80 162,80 142,100Z', '#f4f7f5', '#cdd8d2');
      const f = a.sway * 10; g.fill(`M258,88 C282,84 ${302 + f},72 ${328 + f},80 L${322 + f},90 C${302 + f},88 284,96 260,100Z`, '#f4f7f5', 1.6); g.fill(`M258,94 C278,100 ${296 + f},104 ${316 + f},118 L${306 + f},124 C${290 + f},112 274,108 258,104Z`, '#dfe8e2', 1.6);
    }
  });

  // --- Sora Hoshino, Stargazer: lavender-white hair with star buns, idol dress, opera gloves; floats ---
  CAST.sora = Object.assign(SK('#fff0ec'), HR('#e2dcfa', '#9a90cc', '#ffffff', '#4e467e'), EY('#ff6fae', '#7a1044', '#ffd6ea'), {
    body: 'f', line: '#2a1f40', blush: '#ffa0c0', anim: { hair: 1, float: 1 },
    hero: { sleeve: 'none', gauntlet: '#ffffff', glove: '#ffffff', band: '#ff6fae' },
    back(g, c, a) {
      const s = a.sway * 10;
      [[[148, 84], [100, 190], [90 + s, 370], [70 + s * 1.2, 520], 54], [[252, 84], [300, 190], [310 - s, 370], [330 - s * 1.2, 520], 54], [[170, 80], [130, 220], [126, 400], [110 + s, 580], 44], [[230, 80], [270, 220], [274, 400], [290 - s, 580], 44]]
        .forEach(([p0, p1, p2, p3, w], i) => hairLock(g, c, [p0, p1, p2, p3], w, 'taper', i % 2 ? 1 : -1));
      for (const X of [148, 252]) { g.ell(X, 58, 26, 24, c.hair, 2, c.hairL); g.ell(X + 5, 63, 14, 13, c.hairS); g.ell(X - 7, 51, 9, 6, c.hairH); }
    },
    aura(g, c, a, layer) {
      for (let i = 0; i < 3; i++) { const an = a.t * TAU + i * TAU / 3, near = Math.sin(an) > 0; if ((layer === 'front') !== near) continue; star(g, 200 + Math.cos(an) * 160, 380 + Math.sin(an) * 44, near ? 12 : 8, i === 1 ? '#ff9ad8' : '#fff27a', 1.6); }
    },
    outfit(g, c, A) {
      wearLegs(g, A, c.skin, c.skinS); wearLegs(g, A, '#ffffff', '#dcdcf0', 640); A.legs.forEach(l => { g.save(); g.clip(l); g.line('M0,648 L400,648', '#ff6fae', 3); g.restore(); });
      wearTorso(g, A, c.skin, c.skinS, 0, 318);
      g.save(); g.clip(A.torso); clipY(g, 312, 480); cel(g, A.torso, '#ffffff', '#dcdcf0'); g.restore();
      const [a0, b0] = A.span(318); g.fill(`M${a0 - 3},306 L${b0 + 3},306 L${b0 + 1},330 L${a0 - 1},330Z`, '#2b2f6b', 2);
      g.fill('M200,332 C186,318 164,322 172,340 C178,352 194,344 200,338 C206,344 222,352 228,340 C236,322 214,318 200,332Z', '#ff6fae', 1.8); g.ell(200, 334, 6, 6, '#ffd54a', 1.4);
      star(g, 200, 408, 12, '#ffd54a', 1.6);
      skirt(g, A, '#2b2f6b', '#1a1c48', 450, 612, 40, 6); skirt(g, A, '#ffffff', '#dcdcf0', 450, 584, 30, 8, '#ff6fae');
      g.fill(`M${A.span(446)[0] - 2},436 L${A.span(446)[1] + 2},436 L${A.span(456)[1] + 2},456 L${A.span(456)[0] - 2},456Z`, '#ff6fae', 1.8);
    },
    collar(g, c) { g.fill('M184,240 L216,240 L216,254 L184,254Z', '#2b2f6b', 1.6); star(g, 200, 256, 6, '#ffd54a', 1.2); },
    front(g, c, a) {
      const s = a.sway * 4;
      sideLocks(g, c, 146, 100, 300, 24, -s);
      cap(g, c);
      fringe(g, c, [[142, 126, 28], [160, 140, 32], [180, 132, 30], [200, 138, 26], [220, 132, 30], [240, 140, 32], [258, 126, 28]]);
      angelRing(g, c, 90);
      star(g, 148, 90, 9, '#ffd54a', 1.6); star(g, 254, 96, 7, '#ff9ad8', 1.6);
    }
  });

  // --- Tetsu Oda, Bulwark: big gentle guy, brown spikes, armoured vest, steel gauntlets ---
  CAST.tetsu = Object.assign(SK('#f3d2bc'), HR('#7a4e2c', '#3a2414', '#c89a6a', '#24150a'), EY('#c98a3a', '#4a2a0a', '#ffd9a0'), {
    body: 'b', line: '#24150a', anim: { hair: .3, breath: 1.6, headSway: .4 },
    hero: { sleeve: 'none', gauntlet: '#6a707c', glove: '#6a707c' },
    bangShadow: 'M146,98 L146,106 Q200,116 254,106 L254,98Z',
    back(g, c) { g.fill('M144,96 C138,126 142,156 150,176 L250,176 C258,156 262,126 256,96Z', c.hairS, 0); },
    aura(g, c, a, layer) { if (layer === 'front' && a.t < .55) { const x0 = 60 + a.t * 520; g.line(`M${x0},280 l18,-18 M${x0 + 8},284 l10,-10`, '#ffffff', 3); } },
    outfit(g, c, A) {
      wearLegs(g, A, '#2a2b30', '#16171a'); g.save(); clipY(g, 470, 999); cel(g, A.torso, '#2a2b30', '#16171a'); g.restore();
      wearTorso(g, A, '#3a3d46', '#24262c', 0, 470);
      g.save(); g.clip(A.torso); clipY(g, 286, 452); cel(g, 'M60,286 L340,286 L340,452 L60,452Z', '#5a5f6a', '#44474f'); g.restore(); g.line(`M${A.span(452)[0]},452 L${A.span(452)[1]},452`, g.LN, 2.4);
      g.line('M100,370 L300,370', '#ff8a2a', 7); g.line('M100,370 L300,370', '#ffb070', 1.6);
      [[140, 306], [260, 306], [140, 432], [260, 432]].forEach(([x, y]) => g.ell(x, y, 4, 4, '#b8bcc8', 1.4));
      const [a, b] = A.span(476); g.fill(`M${a},466 L${b},466 L${b},490 L${a},490Z`, '#1d1e22', 2); g.fill('M186,464 L214,464 L214,492 L186,492Z', '#ff8a2a', 1.8);
    },
    collar(g, c) { cel(g, 'M172,246 L228,246 L236,272 L164,272Z', '#24262c', '#16171a'); },
    overArms(g, c) { mirror(g, () => { cel(g, 'M62,300 C64,272 94,256 128,262 L138,300 C114,314 84,318 62,300Z', '#6a707c', '#4a4e58'); g.line('M72,294 C86,278 104,272 124,274', '#b8bcc8', 2); }); },
    facial(g, c) { g.line('M180,212 q20,10 40,0', c.skinS, 2); for (let i = 0; i < 8; i++) g.ell(178 + i * 6, 210 + (i % 2) * 3, 1.3, 1.3, c.skinD); },
    front(g, c, a) {
      cel(g, 'M138,122 C130,58 164,36 200,36 C236,36 270,58 262,122 C254,96 238,82 200,82 C162,82 146,96 138,122Z', c.hair, c.hairS, 2, c.hairL);
      [[150, 70, 130, 42], [172, 54, 160, 18], [196, 48, 196, 10], [222, 52, 238, 18], [248, 68, 272, 42], [158, 92, 134, 86], [242, 92, 266, 86], [184, 84, 176, 108], [214, 84, 222, 108]]
        .forEach(([x, y, tx, ty], i) => g.fill(`M${x - 15},${y + 12} L${tx},${ty} L${x + 15},${y + 6}Z`, i % 2 ? c.hair : c.hairS, 1.8, c.hairL));
      g.solid('M160,66 C176,52 198,50 212,52 C196,58 180,66 170,78Z', c.hairH);
      g.fill('M140,110 L150,110 L152,160 L142,156Z', c.hair, 1.4, c.hairL); g.fill('M260,110 L250,110 L248,160 L258,156Z', c.hair, 1.4, c.hairL);
      g.fill('M230,184 l18,-6 l3,8 l-18,6Z', '#fff4e0', 1.4); g.line('M236,184 l4,6 M242,182 l4,6', '#d9b98a', 1);
    }
  });

  // --- Kyouya Aoi, The Glazier: silver-cyan hair over one eye, long white coat, glass pauldrons ---
  CAST.kyouya = Object.assign(SK('#f7ece8'), HR('#eef4f8', '#8fcfe6', '#ffffff', '#3c5566'), EY('#5fe6ff', '#0a4a66', '#e0fcff'), {
    body: 'm', line: '#16202a', anim: { hair: .7 },
    hero: { sleeve: 'long', sleeveC: '#eef2f6', sleeveS: '#b8c6d4', cuff: '#5fe6ff', glove: '#15161c' },
    back(g, c, a) { const s = a.sway * 5; cel(g, `M140,86 C124,140 126,200 ${134 + s},256 L${266 + s},256 C274,200 276,140 260,86Z`, c.hairS, c.hairL, 1.8, c.hairL); },
    aura(g, c, a, layer) {
      for (let i = 0; i < 6; i++) { const an = a.t * TAU * .5 + i * TAU / 6, near = Math.sin(an) > 0; if ((layer === 'front') !== near) continue;
        const x = 200 + Math.cos(an) * 176, y = 340 + Math.sin(an) * 50 - (i % 2) * 90, h = near ? 26 : 16, glint = (a.frame + i) % 6 === 0;
        g.fill(`M${x},${y - h} L${x + h * .4},${y} L${x},${y + h * .5} L${x - h * .4},${y}Z`, glint ? '#ffffff' : '#9ff6ff', 1.6, '#2a6a8a'); }
      g.markLine('#2a6a8a');
    },
    outfit(g, c, A) {
      wearLegs(g, A, '#15161c', '#0a0a0e'); wearTorso(g, A, '#15161c', '#0a0a0e'); g.line('M200,270 L200,500', '#2a2d38', 2);
      panels(g, A, '#eef2f6', '#b8c6d4', 600, 18);
      mirror(g, () => cel(g, 'M138,520 C132,580 126,650 120,720 L188,720 C188,650 186,580 184,520Z', '#eef2f6', '#b8c6d4'));
      g.line('M182,270 L182,600 M218,270 L218,600', '#5fe6ff', 2.6);
      cel(g, 'M164,244 C178,266 222,266 236,244 L244,264 C224,290 176,290 156,264Z', '#eef2f6', '#b8c6d4'); g.line('M160,264 C178,282 222,282 240,264', '#5fe6ff', 2);
    },
    overArms(g) { for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; g.fill(`M${X(100)},290 L${X(62)},250 L${X(106)},272 L${X(82)},226 L${X(128)},266 L${X(134)},300Z`, '#9ff6ff', 1.8, '#2a6a8a'); } },
    front(g, c, a) {
      const s = a.sway * 3;
      cap(g, c, 'M132,146 C120,70 160,30 200,30 C240,30 280,70 268,146 C258,110 236,92 200,92 C164,92 142,110 132,146Z');
      [[[196, 40], [160, 50], [140, 88], [142, 130], 30], [[204, 40], [238, 50], [262, 88], [260, 128], 30], [[200, 42], [198, 76], [204 + s, 118], [214 + s, 168], 38], [[206, 42], [228, 76], [240 + s, 118], [250 + s, 172], 42], [[196, 42], [176, 74], [168, 104], [168, 130], 24]]
        .forEach(([p0, p1, p2, p3, w]) => hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      angelRing(g, c, 86);
    }
  });

  // --- Rin Aoi, Echo: pale blue bob with long front locks, heterochromia, headphones, hoodie jacket ---
  CAST.rin = Object.assign(SK('#f7eef4'), HR('#e6f2ff', '#86b8e6', '#ffffff', '#3c5a7a'), EY('#5fe6ff', '#0a4a66', '#e0fcff'), {
    eye2: '#ff7ae0', eyeD2: '#6a1060', eyeL2: '#ffe0f6', body: 'f', line: '#1c2438', blush: '#ffa6d0', anim: { hair: .9 },
    hero: { sleeve: 'long', sleeveC: '#2e3a52', sleeveS: '#1d2638', cuff: '#ff9ad8' },
    back(g, c, a) { const s = a.sway * 5; cel(g, `M144,94 C130,140 132,196 ${140 + s},236 L${260 + s},236 C268,196 270,140 256,94Z`, c.hairS, shade(c.hairS, -1, 10), 1.8, c.hairL); },
    aura(g, c, a, layer) {
      if (layer !== 'front') return;
      const r = 20 + a.t * 60; for (const X of [132, 268]) g.ring(X, 160, r * .5, r, a.t < .5 ? '#9ff0ff' : '#ff9ad8', 2.4);
      if (a.frame % 4 === 1) g.line('M110,340 L84,340 M104,420 L76,420 M290,380 L318,380 M296,460 L322,460', '#9ff0ff', 3);
    },
    outfit(g, c, A) {
      wearLegs(g, A, c.skin, c.skinS); wearLegs(g, A, '#2e3a52', '#1d2638', 664);
      wearTorso(g, A, '#f4f6fa', '#cfd6e6', 0, 490);
      skirt(g, A, '#3e4c68', '#2a354c', 474, 600, 24, 6);
      panels(g, A, '#2e3a52', '#1d2638', 506, 22);
      g.line('M184,276 L180,352 M216,276 L220,352', '#ff9ad8', 2.4); g.ell(180, 356, 3.2, 3.2, '#ff9ad8', 1); g.ell(220, 356, 3.2, 3.2, '#ff9ad8', 1);
    },
    collar(g, c) { mirror(g, () => cel(g, 'M186,256 C172,254 150,262 142,280 C156,290 172,288 184,276Z', '#3e4c68', '#2a354c')); },
    front(g, c, a) {
      const s = a.sway * 3;
      sideLocks(g, c, 146, 100, 300, 28, s);
      cap(g, c);
      fringe(g, c, [[142, 124, 30], [162, 140, 32], [182, 132, 30], [200, 140, 24], [220, 132, 30], [240, 140, 32], [258, 124, 30]]);
      angelRing(g, c, 90);
      g.line('M136,130 C130,54 270,54 264,130', '#2a3048', 9); g.line('M136,130 C130,54 270,54 264,130', '#5fe6ff', 3.4);
      cel(g, 'M120,128 C120,112 144,112 144,128 L144,172 C144,188 120,188 120,172Z', '#5fe6ff', '#2aa8c8'); cel(g, 'M256,128 C256,112 280,112 280,128 L280,172 C280,188 256,188 256,172Z', '#ff7ae0', '#c048a8');
      g.ell(132, 150, 5, 10, '#ffffff'); g.ell(268, 150, 5, 10, '#ffffff');
    }
  });

  // --- Shiori Kagami, Aegis Prime: navy hair, low side ponytail, white-and-gold armoured uniform, cape ---
  CAST.shiori = Object.assign(SK('#fbe8de'), HR('#263462', '#0b1024', '#8aa0d8', '#050812'), EY('#f2c14e', '#6a4a00', '#fff0b0'), {
    body: 'f', line: '#10142a', anim: { hair: .6, headSway: .4 },
    hero: { sleeve: 'long', sleeveC: '#f4f5fa', sleeveS: '#c9cfe0', cuff: '#e0b84a', glove: '#e8eaf2' },
    aura(g, c, a, layer) {
      if (layer === 'back') { if (!a.hero) return; const f = a.sway * 12; cel(g, `M128,290 C104,420 ${94 + f * .5},580 ${76 + f},720 L${324 + f},720 C${306 + f * .5},580 296,420 272,290Z`, '#233056', '#141c38'); g.line(`M${80 + f},714 L${320 + f},714`, '#f2c14e', 4); return; }
      for (let i = 0; i < 3; i++) { if ((a.frame + i * 4) % 12 >= 3) continue; const x = [80, 322, 306][i], y = [320, 270, 460][i]; let d = ''; for (let k = 0; k < 6; k++) { const an = k * TAU / 6; d += (k ? 'L' : 'M') + f1(x + Math.cos(an) * 14) + ',' + f1(y + Math.sin(an) * 14); } g.fill(d + 'Z', '#fff4c0', 2, '#f2c14e'); }
    },
    back(g, c) { g.fill('M146,96 C136,146 140,196 150,226 L250,226 C260,196 264,146 254,96Z', c.hair, 1.8, c.hairL); },
    outfit(g, c, A) {
      wearLegs(g, A, '#f4f5fa', '#c9cfe0'); g.save(); clipY(g, 470, 999); cel(g, A.torso, '#f4f5fa', '#c9cfe0'); g.restore();
      A.legs.forEach((l, i) => g.line(i ? 'M262,520 L254,720' : 'M138,520 L146,720', '#e0b84a', 3));
      wearTorso(g, A, '#f4f5fa', '#c9cfe0', 0, 470);
      g.save(); g.clip(A.torso); cel(g, 'M140,300 L260,300 L256,400 C230,414 170,414 144,400Z', '#e8ecf6', '#c9cfe0'); g.restore();
      g.line('M200,270 L200,470', '#e0b84a', 3); g.line('M172,286 L172,470 M228,286 L228,470', '#c9cfe0', 1.6);
      let d = ''; for (let k = 0; k < 6; k++) { const an = k * TAU / 6 + TAU / 12; d += (k ? 'L' : 'M') + f1(200 + Math.cos(an) * 18) + ',' + f1(356 + Math.sin(an) * 18); } g.fill(d + 'Z', '#f2c14e', 2); g.fill('M200,344 L208,356 L200,368 L192,356Z', '#233056', 1.2);
      const [a, b] = A.span(458); g.fill(`M${a - 2},448 L${b + 2},448 L${b + 2},470 L${a - 2},470Z`, '#233056', 2); g.fill('M190,446 L210,446 L210,472 L190,472Z', '#f2c14e', 1.6);
    },
    collar(g, c) { cel(g, 'M172,232 L228,232 L236,268 C214,280 186,280 164,268Z', '#f4f5fa', '#c9cfe0'); g.line('M168,264 C186,276 214,276 232,264', '#e0b84a', 2.4); },
    overArms(g) { mirror(g, () => { cel(g, 'M96,292 C104,270 136,262 160,270 L156,294 L100,304Z', '#f2c14e', '#c8962a'); for (let k = 0; k < 4; k++) g.line(`M${106 + k * 13},300 l0,16`, '#e0b84a', 2); }); },
    front(g, c, a) {
      const s = a.sway * 3;
      cap(g, c);
      fringe(g, c, [[148, 130, 26], [166, 138, 28], [186, 132, 28], [204, 138, 28], [222, 132, 28], [240, 138, 28], [256, 128, 26]], [200, 40], 'taper');
      angelRing(g, c, 86);
      hairLock(g, c, [[252, 196], [280, 250], [276 + s, 360], [262 + s, 470]], 40, 'taper', 1);
      g.fill('M250,222 l16,-6 l6,14 l-16,6Z', '#f2c14e', 1.6);
      hairLock(g, c, [[148, 102], [140, 150], [142, 196], [150 + s, 232]], 20, 'taper', -1);
    }
  });

  // --- Chairman Genjirou Kuroda: slicked grey hair, moustache and beard, black suit, HALO pin ---
  CAST.kuroda = Object.assign(SK('#f0d8c8'), HR('#a4aab2', '#5a6068', '#e2e6ea', '#2a2e34'), EY('#7a7a8c', '#20202a', '#c8c8d8'), {
    body: 'm', old: true, line: '#1a1418', eyeDY: 2, anim: { hair: 0, headSway: .15, breath: .6 },
    bangShadow: 'M146,88 L146,94 L254,94 L254,88Z',
    back() { },
    aura(g, c, a, layer) { if (layer === 'front' && a.frame % 12 === 4) star4(g, 250, 346, 10, '#fff6c0'); },
    outfit(g, c, A) { const o = garment(g, c, A, { style: 'suit', tie: '#5a1020' }); g.ell(250, 346, 6, 6, '#e0b84a', 1.6); return o; },
    facial(g, c) {
      g.line('M160,132 q10,-4 20,0 M220,132 q10,-4 20,0', c.skinD, 1.6); g.line('M174,186 q-8,14 2,26 M226,186 q8,14 -2,26', c.skinS, 2);
      g.fill('M176,194 C188,184 212,184 224,194 C214,200 206,198 200,194 C194,198 186,200 176,194Z', '#a4aab2', 1.6, '#2a2e34');
      g.fill('M174,212 C186,240 214,240 226,212 C214,226 186,226 174,212Z', '#a4aab2', 1.4, '#2a2e34');
    },
    front(g, c) {
      cel(g, 'M138,120 C132,62 166,38 200,38 C234,38 268,62 262,120 C256,90 244,76 226,70 C210,78 190,78 174,70 C156,76 144,90 138,120Z', c.hair, c.hairS, 2, c.hairL);
      g.line('M160,56 C180,48 220,48 240,56 M150,74 C170,62 230,62 250,74', c.hairS, 2); g.line('M168,50 C186,44 214,44 232,50', c.hairH, 2);
      g.fill('M138,108 L148,108 L150,156 L140,150Z', c.hair, 1.4, c.hairL); g.fill('M262,108 L252,108 L250,156 L260,150Z', c.hair, 1.4, c.hairL);
    }
  });

  // --- Deputy Saeki: neat black side part, rimless glasses with a travelling glare, white suit ---
  CAST.saeki = Object.assign(SK('#fbe6dc'), HR('#23232e', '#08080c', '#6c6c86', '#040406'), EY('#a878e8', '#3a1670', '#e8d8ff'), {
    body: 'm', line: '#140c1a', anim: { hair: .3, headSway: .3 },
    back(g, c) { g.fill('M144,96 C136,136 140,176 150,204 L250,204 C260,176 264,136 256,96Z', c.hairS, 0); },
    outfit(g, c, A) {
      wearLegs(g, A, '#e6e6ee', '#c8c8d4'); g.save(); clipY(g, 468, 999); cel(g, A.torso, '#e6e6ee', '#c8c8d4'); g.restore();
      wearTorso(g, A, '#15151c', '#08080c', 0, 480); g.fill('M194,286 L200,292 L206,286 L204,392 L200,402 L196,392Z', '#8a5ad8', 1.8);
      panels(g, A, '#f2f2f6', '#c8c8d4', 488, 16); mirror(g, () => g.fill('M184,272 L156,330 L176,344 L168,358 L196,420 L196,298Z', '#dcdce6', 1.8));
      g.fill('M236,348 l18,-4 l2,8 l-18,4Z', '#8a5ad8', 1.2);
      return { sleeve: 'long', sleeveC: '#f2f2f6', sleeveS: '#c8c8d4', cuff: '#15151c' };
    },
    glasses(g, c, a) {
      g.line('M148,146 L194,146 M206,146 L252,146 M194,146 Q200,142 206,146', '#b8bcc8', 2.2); g.line('M148,146 Q150,176 172,176 Q192,176 194,146 M206,146 Q208,176 228,176 Q250,176 252,146', '#8c90a0', 1.4);
      const ph = a.t * 2 % 1; if (ph < .45) { const x = 150 + ph / .45 * 100; g.line(`M${x},174 l12,-24`, '#ffffff', 5); }
    },
    front(g, c) {
      cel(g, 'M136,128 C126,62 162,36 200,36 C238,36 274,62 264,128 C258,102 242,86 216,82 C190,90 160,100 136,128Z', c.hair, c.hairS, 2, c.hairL);
      hairLock(g, c, [[214, 48], [180, 60], [156, 88], [148, 128]], 46, 'leaf', -1);
      hairLock(g, c, [[220, 50], [244, 60], [258, 88], [260, 122]], 30, 'leaf', 1);
      g.line('M214,52 C230,62 240,76 246,90', c.hairH, 2.4); angelRing(g, c, 84);
    }
  });

  // --- Natsuki Amane, Salamander: short blonde bob with flame-tipped ends, orange rescue jacket ---
  CAST.natsuki = Object.assign(SK('#fde6d8'), HR('#ffd566', '#e3862c', '#fff6d2', '#a3501c'), EY('#3aa6ff', '#123b8c', '#c0f0ff'), {
    body: 'f', line: '#2a1418', blush: '#ff9a8a', anim: { hair: .8 },
    hero: { sleeve: 'long', sleeveC: '#ff7a2a', sleeveS: '#d45a14', cuff: '#dfe4ea', glove: '#3a3f52', band: '#dfe4ea' },
    back(g, c, a) { const s = a.sway * 4; cel(g, `M146,92 C132,136 134,180 ${142 + s},212 L${258 + s},212 C266,180 268,136 254,92Z`, c.hairS, shade(c.hairS, -1, 10), 1.8, c.hairL); },
    aura(g, c, a, layer) {
      if (layer !== 'front') return;
      for (let i = 0; i < 7; i++) { const ph = (a.t + i / 7) % 1, x = [86, 314, 122, 284, 64, 336, 200][i] + Math.sin(ph * 9 + i) * 10, y = 640 - ph * 440, r = 5 * (1 - ph) + 2; g.ell(x, y, r, r, ph < .5 ? '#ffd54a' : '#ff6a2a', 1.4, '#8a2a0a'); }
      g.markLine('#8a2a0a');
    },
    outfit(g, c, A) {
      wearLegs(g, A, '#3a3f52', '#252838'); g.save(); clipY(g, 470, 999); cel(g, A.torso, '#3a3f52', '#252838'); g.restore();
      A.legs.forEach(l => { g.save(); g.clip(l); g.fill('M0,640 L400,640 L400,660 L0,660Z', '#dfe4ea', 0); g.restore(); });
      wearTorso(g, A, '#ff7a2a', '#d45a14', 0, 474);
      const [a0, b0] = A.span(420); g.fill(`M${a0 - 2},410 L${b0 + 2},410 L${b0 + 2},430 L${a0 - 2},430Z`, '#dfe4ea', 1.8); g.line(`M${a0},420 L${b0},420`, '#ffe066', 2);
      g.line('M200,272 L200,474', '#8a3a10', 2.4); g.fill('M226,318 l20,0 l0,34 l-20,0Z', '#2a2d38', 1.8); g.line('M242,318 l0,-14', '#2a2d38', 2.4);
      const [a, b] = A.span(460); g.fill(`M${a - 2},452 L${b + 2},452 L${b + 2},474 L${a - 2},474Z`, '#2a2d38', 2); g.fill('M190,450 L210,450 L210,476 L190,476Z', '#ffd54a', 1.6);
    },
    collar(g, c) { cel(g, 'M160,242 C178,266 222,266 240,242 L248,264 C226,290 174,290 152,264Z', '#ff7a2a', '#d45a14'); g.line('M156,262 C176,278 224,278 244,262', '#dfe4ea', 2.4); },
    front(g, c, a) {
      const f = a.frame % 2;
      cap(g, c);
      fringe(g, c, [[140, 132, 30], [160, 140, 32], [180, 132, 30], [200, 138, 26], [220, 132, 30], [240, 140, 32], [260, 132, 30]]);
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; hairLock(g, c, [[X(142), 104], [X(130), 160], [X(134), 206], [X(148), 232]], 28, 'taper', sg); g.fill(`M${X(140)},224 l${-6 * sg},${16 + f * 6} l${10 * sg},-8 l${4 * sg},${14 - f * 4} l${6 * sg},-20Z`, '#ff8a2a', 1.4, c.hairL); }
      angelRing(g, c, 90);
      g.fill('M232,78 l14,-4 l4,10 l-14,4Z', '#ff6a2a', 1.4);
    }
  });

  // --- Director Aya Takamine: long red hair with a deep side-swept bang, glasses, black suit ---
  CAST.aya = Object.assign(SK('#fbe5da'), HR('#c42e3a', '#6a0f1e', '#ff9a9a', '#420610'), EY('#e6a03a', '#6a2a0a', '#ffe7a8'), {
    body: 'f', line: '#2a0c14', blush: '#f58a9a', anim: { hair: .7, headSway: .5 },
    hero: { sleeve: 'long', sleeveC: '#23222c', sleeveS: '#131218', cuff: '#f4f4f8' },
    back(g, c, a) {
      const s = a.sway * 8;
      [[[150, 84], [108, 180], [102 + s * .4, 340], [116 + s, 480], 58], [[250, 84], [294, 180], [300 + s * .4, 340], [284 + s, 480], 58], [[176, 76], [140, 220], [140, 380], [160 + s, 510], 46], [[226, 76], [262, 220], [262, 380], [244 + s, 510], 46]]
        .forEach(([p0, p1, p2, p3, w], i) => hairLock(g, c, [p0, p1, p2, p3], w, 'taper', i % 2 ? 1 : -1));
    },
    outfit(g, c, A) {
      wearLegs(g, A, '#4a3038', '#2e1c22');
      wearTorso(g, A, '#f4f4f8', '#cfcfd8', 0, 470); g.fill('M192,276 L208,276 L204,352 L200,360 L196,352Z', '#c42a36', 1.6);
      skirt(g, A, '#23222c', '#131218', 462, 626, 4, 1);
      panels(g, A, '#23222c', '#131218', 486, 18); mirror(g, () => g.fill('M186,270 L160,322 L178,334 L172,346 L196,400 L196,290Z', '#35343f', 1.6));
      g.ell(240, 356, 5, 5, '#e0b84a', 1.4);
    },
    glasses(g, c, a) { g.line('M150,142 L196,142 L196,174 L150,174Z M204,142 L250,142 L250,174 L204,174Z M196,154 L204,154', '#2a1418', 2.4); if (a.frame % 12 === 7) g.line('M158,170 l12,-22 M210,170 l12,-22', '#ffffff', 3); },
    front(g, c, a) {
      const s = a.sway * 3;
      cap(g, c);
      hairLock(g, c, [[228, 42], [180, 50], [150, 88], [144, 146]], 62, 'leaf', -1);
      [[[212, 42], [240, 52], [258, 82], [262, 128], 30], [[218, 46], [230, 74], [240, 104], [244, 134], 26], [[196, 46], [180, 74], [170 + s, 118], [170 + s, 162], 30]]
        .forEach(([p0, p1, p2, p3, w]) => hairLock(g, c, [p0, p1, p2, p3], w, 'leaf', p3[0] < 200 ? -1 : 1));
      sideLocks(g, c, 148, 104, 300, 24, s);
      angelRing(g, c, 86);
    }
  });
})();

// Colours used by the CG views: the back of each hero costume, and the legs when sitting.
(() => {
  const C = PixelCast.CAST, set = (id, backC, legC) => Object.assign(C[id], { backC, legC });
  set('hikari', '#f8f8ff', '#232846'); set('rei', '#1b1826', '#231d35'); set('mira', '#fbfdff', '#fbfdff'); set('kaede', '#2fbf7a');
  set('sora', '#ffffff', '#ffffff'); set('tetsu', '#3a3d46', '#2a2b30'); ['tetsu', 'kyouya', 'kuroda', 'saeki', 'natsuki', 'rin'].forEach(k => C[k].shortHair = 1); set('kyouya', '#eef2f6', '#15161c'); set('rin', '#2e3a52', '#2e3a52');
  set('shiori', '#233056', '#f4f5fa'); set('kuroda', '#1c1c26', '#16161e'); set('saeki', '#f2f2f6', '#e6e6ee'); set('natsuki', '#ff7a2a', '#3a3f52'); set('aya', '#23222c', '#4a3038');
  C.hikari.backAcc = g => { for (const sg of [-1, 1]) g.ell(200 + 60 * sg, 80, 10, 13, '#2f5be0', 2); };
})();

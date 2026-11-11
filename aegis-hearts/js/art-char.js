'use strict';
// Character portraits. Painted through the Moonkai Pixel Engine pipeline:
// every body part is a set of Path2D pieces, cel-shaded with an offset fill,
// outlined, and the finished frame is snapped to the character's palette.
(function () {
  const { poly, ell, shadeHex, TAU } = MoonkaiPixel.kit;
  // Capsule as one closed outline (the engine's multi-subpath cap leaves pinholes at large sizes).
  const cap = (a, b, r) => { const p = new Path2D(), g = Math.atan2(b[1] - a[1], b[0] - a[0]);
    p.arc(a[0], a[1], r, g + Math.PI / 2, g + Math.PI * 1.5); p.arc(b[0], b[1], r, g - Math.PI / 2, g + Math.PI / 2); p.closePath(); return p; };
  const path = f => { const p = new Path2D(); f(p); return p; };
  const W = 220, H = 340, CX = 110, HY = 82, RX = 37, RY = 39;

  const CHARS = {
    akari: { name: 'Akari', full: 'Hinata Akari', alias: 'SOLAR FLARE', color: '#ff7a3c', tag: '#f0622a',
      skin: '#ffe0c8', hair: '#ff7a3c', eyes: '#f2a61c', jacket: '#f6f2ec', shirt: '#2b2f4a', accent: '#ff4f3a', skirt: '#2b2f4a', outline: '#2a1620', fx: 'fire',
      chibi: { heads: 5, build: 'slim', frame: 'feminine', hairStyle: 'ponytail', sleeves: 'short', bottomStyle: 'shorts', wings: 'none', headgear: 'none', weapon: 'none', cape: false,
        skin: '#ffe0c8', hair: '#ff7a3c', eyes: '#f2a61c', top: '#f6f2ec', bottom: '#2b2f4a', boots: '#ff4f3a', accent: '#ff4f3a', outline: '#2a1620' } },
    rei: { name: 'Rei', full: 'Shirayuki Rei', alias: 'FROSTBITE', color: '#7ad0f0', tag: '#3d8fd6',
      skin: '#fbe8e0', hair: '#c4d8f2', eyes: '#3f86e6', jacket: '#34446e', shirt: '#f4f6fc', accent: '#7ad0f0', skirt: '#e6ecf8', outline: '#1c1f38', fx: 'ice',
      chibi: { heads: 5, build: 'slim', frame: 'feminine', hairStyle: 'long', sleeves: 'long', bottomStyle: 'skirt', wings: 'none', headgear: 'none', weapon: 'none', cape: false,
        skin: '#fbe8e0', hair: '#c4d8f2', eyes: '#3f86e6', top: '#34446e', bottom: '#e6ecf8', boots: '#34446e', accent: '#7ad0f0', outline: '#1c1f38' } },
    mio: { name: 'Mio', full: 'Kurose Mio', alias: 'UMBRA', color: '#b07aff', tag: '#8a58e0',
      skin: '#fde6d8', hair: '#6c4cae', eyes: '#e45aa6', jacket: '#2c2640', shirt: '#2c2640', accent: '#b07aff', skirt: '#463c66', outline: '#150f22', fx: 'shadow',
      chibi: { heads: 5, build: 'slim', frame: 'feminine', hairStyle: 'bob', sleeves: 'long', bottomStyle: 'shorts', wings: 'none', headgear: 'catears', weapon: 'none', cape: false,
        skin: '#fde6d8', hair: '#6c4cae', eyes: '#e45aa6', top: '#2c2640', bottom: '#463c66', boots: '#2c2640', accent: '#b07aff', outline: '#150f22' } },
    touko: { name: 'Director Sakaki', full: 'Sakaki Touko', alias: 'DIRECTOR', color: '#e0546a',
      skin: '#f8dcca', hair: '#2e2740', eyes: '#c2384c', jacket: '#24212f', shirt: '#f2f0f4', accent: '#c2384c', skirt: '#24212f', outline: '#0e0b16', fx: 'none',
      chibi: { heads: 6.5, build: 'slim', frame: 'feminine', hairStyle: 'long', sleeves: 'long', bottomStyle: 'pants', wings: 'none', headgear: 'none', weapon: 'none', cape: true,
        skin: '#f8dcca', hair: '#2e2740', eyes: '#c2384c', top: '#24212f', bottom: '#24212f', boots: '#15131c', accent: '#c2384c', outline: '#0e0b16' } },
  };
  // The player's chibi (never shown as a portrait).
  const YOU_CHIBI = { heads: 5, build: 'normal', frame: 'masculine', hairStyle: 'short', sleeves: 'long', bottomStyle: 'pants', wings: 'none', headgear: 'none', weapon: 'none', cape: false,
    skin: '#f5d0b0', hair: '#3a3448', eyes: '#3a4a6a', top: '#3d4a6e', bottom: '#2a2c3e', boots: '#1c1a26', accent: '#58d6ff', outline: '#12101c' };

  // eye: open | wide | half | happy | closed | squeeze     brow: flat | up | angry | sad
  // mouth: smile | open | grin | flat | frown | o | cat | pout | wavy
  const EXPR = {
    neutral:  { eye: 'open', brow: 'flat', mouth: 'smile' },
    smile:    { eye: 'open', brow: 'up', mouth: 'smile', blush: 1 },
    happy:    { eye: 'happy', brow: 'up', mouth: 'open', blush: 1 },
    grin:     { eye: 'open', brow: 'up', mouth: 'grin' },
    laugh:    { eye: 'squeeze', brow: 'up', mouth: 'grin', blush: 1 },
    blush:    { eye: 'half', brow: 'sad', mouth: 'wavy', blush: 2, look: 1 },
    shy:      { eye: 'closed', brow: 'sad', mouth: 'smile', blush: 2 },
    angry:    { eye: 'open', brow: 'angry', mouth: 'frown', vein: true },
    pout:     { eye: 'half', brow: 'angry', mouth: 'pout', blush: 1 },
    sad:      { eye: 'half', brow: 'sad', mouth: 'frown' },
    cry:      { eye: 'closed', brow: 'sad', mouth: 'wavy', tears: true },
    surprised:{ eye: 'wide', brow: 'up', mouth: 'o' },
    shock:    { eye: 'wide', brow: 'sad', mouth: 'open', sweat: true },
    smug:     { eye: 'half', brow: 'flat', mouth: 'cat' },
    serious:  { eye: 'open', brow: 'angry', mouth: 'flat' },
    cool:     { eye: 'half', brow: 'flat', mouth: 'flat' },
    sigh:     { eye: 'closed', brow: 'flat', mouth: 'flat', sweat: true },
    sparkle:  { eye: 'wide', brow: 'up', mouth: 'open', stars: true, blush: 1 },
    sleepy:   { eye: 'half', brow: 'sad', mouth: 'o' },
  };

  function render(id, exprName, pose, blink, talk, scale) {
    const c = CHARS[id], e = EXPR[exprName] || EXPR.neutral, s = scale || 1;
    const cv = document.createElement('canvas'); cv.width = Math.round(W * s); cv.height = Math.round(H * s);
    const X = cv.getContext('2d'), T = document.createElement('canvas'); T.width = cv.width; T.height = cv.height;
    const Tx = T.getContext('2d');
    X.scale(s, s); Tx.scale(s, s);
    const used = new Set(['#ffffff', c.outline]);
    const sh = (hex, a = 13) => { const v = shadeHex(hex, -1, a); used.add(v); return v; };
    const hi = (hex, a = 12) => { const v = shadeHex(hex, 1, a); used.add(v); return v; };
    const u = (...cs) => { cs.forEach(k => used.add(k)); return cs[0]; };
    const OL = c.outline;
    // The engine's cel painter: shade everywhere, base shifted toward the light, outline behind.
    const paint = (pieces, base, shade, o = {}) => {
      u(base, shade || base); const so = o.so || [-2, -2];
      Tx.save(); Tx.setTransform(1, 0, 0, 1, 0, 0); Tx.clearRect(0, 0, T.width, T.height); Tx.restore();
      Tx.fillStyle = shade || base; for (const p of pieces) Tx.fill(p);
      Tx.globalCompositeOperation = 'source-atop'; Tx.fillStyle = base;
      Tx.save(); Tx.translate(so[0], so[1]); for (const p of pieces) Tx.fill(p); Tx.restore();
      if (o.outline !== false) { Tx.globalCompositeOperation = 'destination-over'; Tx.strokeStyle = o.ol || OL; Tx.lineWidth = o.lw || 2.2; Tx.lineJoin = 'round'; for (const p of pieces) Tx.stroke(p); }
      Tx.globalCompositeOperation = 'source-over';
      X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(T, 0, 0); X.restore();
    };
    const inside = (clipP, fn) => { X.save(); X.clip(clipP); fn(); X.restore(); };
    const line = (pts, col, w = 2, close = false) => { u(col); X.strokeStyle = col; X.lineWidth = w; X.lineCap = 'round'; X.lineJoin = 'round'; X.beginPath();
      pts.forEach((q, i) => { if (!i) X.moveTo(q[0], q[1]); else if (q.length === 4) X.quadraticCurveTo(q[0], q[1], q[2], q[3]); else X.lineTo(q[0], q[1]); }); if (close) X.closePath(); X.stroke(); };
    const fill = (p, col) => { u(col); X.fillStyle = col; X.fill(p); };

    const skin = c.skin, skinS = sh(skin, 9), hair = c.hair, hairS = sh(hair, 14), hairD = sh(hairS, 10), hairL = hi(hair, 13);
    const jk = c.jacket, jkS = sh(jk, 12), acc = c.accent, accS = sh(acc, 12), sk = c.skirt, skS = sh(sk, 12), st = c.shirt, stS = sh(st, 10);
    const cx = CX, hy = HY;

    // ---------------- hair behind the body ----------------
    if (id === 'akari') {
      // high side ponytail with a ribbon
      paint([path(p => { p.moveTo(cx + 22, hy - 34); p.bezierCurveTo(cx + 70, hy - 66, cx + 104, hy - 20, cx + 88, hy + 40);
        p.bezierCurveTo(cx + 84, hy + 66, cx + 70, hy + 86, cx + 56, hy + 96); p.bezierCurveTo(cx + 66, hy + 60, cx + 62, hy + 20, cx + 40, hy - 6); p.closePath(); })], hair, hairS);
      line([[cx + 62, hy - 30], [cx + 84, hy - 6, cx + 78, hy + 48]], hairL, 2.5);
      paint([ell([cx, hy - 2], RX + 7, RY + 7)], hairS, hairD);
    } else if (id === 'rei') {
      paint([path(p => { p.moveTo(cx - RX - 8, hy - 10); p.bezierCurveTo(cx - RX - 12, hy - 60, cx + RX + 12, hy - 60, cx + RX + 8, hy - 10);
        p.lineTo(cx + RX + 22, hy + 150); p.lineTo(cx + RX + 6, hy + 196); p.lineTo(cx + 30, hy + 178); p.lineTo(cx - 30, hy + 178); p.lineTo(cx - RX - 6, hy + 196); p.lineTo(cx - RX - 22, hy + 150); p.closePath(); })], hairS, hairD);
    } else if (id === 'mio') {
      // hood resting on the shoulders + bob
      paint([ell([cx, hy + 58], 50, 22)], jk, jkS);
      paint([path(p => { p.moveTo(cx - RX - 9, hy - 6); p.bezierCurveTo(cx - RX - 12, hy - 58, cx + RX + 12, hy - 58, cx + RX + 9, hy - 6);
        p.bezierCurveTo(cx + RX + 14, hy + 30, cx + RX + 4, hy + 52, cx + 22, hy + 50); p.lineTo(cx - 22, hy + 50); p.bezierCurveTo(cx - RX - 4, hy + 52, cx - RX - 14, hy + 30, cx - RX - 9, hy - 6); })], hairS, hairD);
    } else {
      paint([path(p => { p.moveTo(cx - RX - 7, hy - 10); p.bezierCurveTo(cx - RX - 10, hy - 58, cx + RX + 10, hy - 58, cx + RX + 7, hy - 10);
        p.bezierCurveTo(cx + RX + 26, hy + 40, cx + RX + 6, hy + 80, cx + RX + 24, hy + 124); p.bezierCurveTo(cx + RX + 6, hy + 132, cx + 30, hy + 120, cx + 24, hy + 100);
        p.lineTo(cx - 24, hy + 100); p.bezierCurveTo(cx - 30, hy + 120, cx - RX - 6, hy + 132, cx - RX - 24, hy + 124); p.bezierCurveTo(cx - RX - 6, hy + 80, cx - RX - 26, hy + 40, cx - RX - 7, hy - 10); })], hairS, hairD);
    }

    // ---------------- body ----------------
    const baggy = id === 'mio', wide = id === 'touko';
    const shx = 43, shy = hy + 70, wst = baggy ? 36 : 27, hip = baggy ? 42 : 37;
    const torso = path(p => { p.moveTo(cx - 12, hy + 56); p.lineTo(cx - shx, shy - 2); p.quadraticCurveTo(cx - shx - 4, shy + 14, cx - 37, hy + 104);
      p.lineTo(cx - wst, hy + 152); p.lineTo(cx - hip, hy + 196); p.lineTo(cx - hip - 4, H + 6); p.lineTo(cx + hip + 4, H + 6); p.lineTo(cx + hip, hy + 196); p.lineTo(cx + wst, hy + 152);
      p.lineTo(cx + 37, hy + 104); p.quadraticCurveTo(cx + shx + 4, shy + 14, cx + shx, shy - 2); p.lineTo(cx + 12, hy + 56); p.closePath(); });

    // arm targets: [shoulder, elbow, hand] in screen space, side -1 = left of screen
    const S = d => [cx + d * 41, shy + 4];
    const down = d => [S(d), [cx + d * 49, hy + 128], [cx + d * 47, hy + 184]];
    const ARMS = {
      down: [down(-1), down(1)],
      hip: [down(-1), [S(1), [cx + 66, hy + 122], [cx + 34, hy + 156]]],
      raise: [down(-1), [S(1), [cx + 64, hy + 100], [cx + 70, hy + 42]]],
      wave: [down(-1), [S(1), [cx + 66, hy + 96], [cx + 80, hy + 40]]],
      chest: [[S(-1), [cx - 48, hy + 126], [cx - 8, hy + 102]], down(1)],
      think: [down(-1), [S(1), [cx + 46, hy + 124], [cx + 20, hy + 62]]],
      power: [down(-1), [S(1), [cx + 62, hy + 104], [cx + 86, hy + 62]]],
      crossed: [[S(-1), [cx - 47, hy + 122], [cx + 20, hy + 118]], [S(1), [cx + 47, hy + 124], [cx - 22, hy + 132]]],
      fists: [[S(-1), [cx - 54, hy + 118], [cx - 34, hy + 78]], [S(1), [cx + 54, hy + 118], [cx + 34, hy + 78]]],
    };
    const arms = ARMS[pose] || ARMS.down;
    const drawArm = (A, front) => {
      const r = baggy ? 11 : 9;
      const pieces = [cap(A[0], A[1], r), cap(A[1], A[2], r - 1)];
      if (id === 'akari') { // short sleeves: bare arm, sleeve on the upper arm, wristband
        paint([cap(A[0], A[1], r - 2), cap(A[1], A[2], r - 2.5)], skin, skinS);
        paint([cap(A[0], [A[0][0] + (A[1][0] - A[0][0]) * .6, A[0][1] + (A[1][1] - A[0][1]) * .6], r + .5)], jk, jkS);
        const m = [A[1][0] + (A[2][0] - A[1][0]) * .7, A[1][1] + (A[2][1] - A[1][1]) * .7], m2 = [A[1][0] + (A[2][0] - A[1][0]) * .84, A[1][1] + (A[2][1] - A[1][1]) * .84]; paint([cap(m, m2, r - 2)], acc, accS, { lw: 1.6 });
      } else {
        paint(pieces, jk, jkS);
        const m = [A[1][0] + (A[2][0] - A[1][0]) * .72, A[1][1] + (A[2][1] - A[1][1]) * .72], m2 = [A[1][0] + (A[2][0] - A[1][0]) * .86, A[1][1] + (A[2][1] - A[1][1]) * .86];
        paint([cap(m, m2, r - .5)], acc, accS, { lw: 1.6 });
      }
      paint([ell(A[2], 7.5, 7.5)], skin, skinS);
      if (front && (pose === 'wave')) for (let k = -1; k <= 2; k++) paint([cap(A[2], [A[2][0] + k * 3.4 - 1, A[2][1] - 12 + Math.abs(k - .5) * 1.5], 2)], skin, skinS, { lw: 1.5 });
    };
    const behind = pose === 'crossed' ? [1] : pose === 'down' || pose === 'hip' ? [0, 1] : pose === 'chest' ? [1] : [0];
    const infront = [0, 1].filter(k => !behind.includes(k));
    if (wide) paint([path(p => { p.moveTo(cx - 14, hy + 54); p.lineTo(cx - 58, shy + 2); p.lineTo(cx - 66, hy + 210); p.lineTo(cx - 40, hy + 214); p.lineTo(cx + 40, hy + 214); p.lineTo(cx + 66, hy + 210); p.lineTo(cx + 58, shy + 2); p.lineTo(cx + 14, hy + 54); p.closePath(); })], jkS, sh(jkS, 8));
    for (const k of behind) drawArm(arms[k], false);

    // neck
    paint([path(p => { p.rect(cx - 8, hy + 34, 16, 30); })], skinS, skinS);
    paint([torso], jk, jkS, { so: [-3, -2] });
    if (!baggy) {
      // shirt V, lapels, skirt
      const open = id === 'akari' ? 20 : 11, vy = id === 'akari' ? hy + 150 : hy + 118;
      const vee = path(p => { p.moveTo(cx - 12, hy + 55); p.lineTo(cx + 12, hy + 55); p.lineTo(cx + open, hy + 84); p.lineTo(cx + (id === 'akari' ? 16 : 0), vy); p.lineTo(cx - (id === 'akari' ? 16 : 0), vy); p.lineTo(cx - open, hy + 84); p.closePath(); });
      paint([vee], st, stS, { lw: 1.8 });
      inside(vee, () => { fill(path(p => p.ellipse(cx, hy + 58, 13, 7, 0, 0, TAU)), skin); fill(path(p => p.ellipse(cx + 2, hy + 61, 12, 5, 0, 0, TAU)), skinS); fill(path(p => p.ellipse(cx, hy + 57, 12, 5, 0, 0, TAU)), skin); });
      if (id !== 'akari') {
        paint([poly([[cx - 13, hy + 54], [cx - 22, hy + 70], [cx - 3, hy + 84], [cx - 1, hy + 66]]), poly([[cx + 13, hy + 54], [cx + 22, hy + 70], [cx + 3, hy + 84], [cx + 1, hy + 66]])], '#ffffff', u('#d8dcec'), { lw: 1.6 });
        // tie / ribbon
        if (id === 'rei') paint([poly([[cx, hy + 70], [cx - 13, hy + 63], [cx - 13, hy + 79]]), poly([[cx, hy + 70], [cx + 13, hy + 63], [cx + 13, hy + 79]]), ell([cx, hy + 70], 3.5, 3.5), poly([[cx - 2, hy + 73], [cx - 7, hy + 92], [cx - 1, hy + 88]]), poly([[cx + 2, hy + 73], [cx + 7, hy + 92], [cx + 1, hy + 88]])], acc, accS, { lw: 1.6 });
        else paint([poly([[cx - 4, hy + 68], [cx + 4, hy + 68], [cx + 3, hy + 74], [cx + 6, hy + 108], [cx, hy + 116], [cx - 6, hy + 108], [cx - 3, hy + 74]])], acc, accS, { lw: 1.6 });
        // lapels
        paint([poly([[cx - 14, hy + 56], [cx - 30, hy + 66], [cx - 22, hy + 96], [cx - 3, hy + 122], [cx - 12, hy + 86]]), poly([[cx + 14, hy + 56], [cx + 30, hy + 66], [cx + 22, hy + 96], [cx + 3, hy + 122], [cx + 12, hy + 86]])], hi(jk, 6), jk, { lw: 1.6 });
        for (const by of [134, 148]) paint([ell([cx + 6, hy + by], 2.2, 2.2)], u('#ffd766'), u('#c89a2e'), { lw: 1.2 });
      } else {
        // open jacket edges, flame emblem, choker
        line([[cx - 13, hy + 56], [cx - 21, hy + 86], [cx - 17, hy + 150]], acc, 3); line([[cx + 13, hy + 56], [cx + 21, hy + 86], [cx + 17, hy + 150]], acc, 3);
        paint([path(p => { p.moveTo(cx, hy + 96); p.quadraticCurveTo(cx + 9, hy + 106, cx + 5, hy + 116); p.quadraticCurveTo(cx, hy + 122, cx - 5, hy + 116); p.quadraticCurveTo(cx - 8, hy + 108, cx - 3, hy + 104); p.quadraticCurveTo(cx - 1, hy + 108, cx + 1, hy + 106); p.closePath(); })], acc, u('#ffb03a'), { lw: 1.2, so: [0, -4] });
        paint([path(p => p.rect(cx - 8, hy + 48, 16, 4))], acc, accS, { lw: 1.4 });
      }
      // emblem on the chest
      paint([poly([[cx - 27, hy + 100], [cx - 20, hy + 100], [cx - 20, hy + 107], [cx - 23.5, hy + 111], [cx - 27, hy + 107]])], u('#ffd766'), u('#c89a2e'), { lw: 1.2 });
      // skirt
      const skirt = path(p => { p.moveTo(cx - wst - 2, hy + 156); p.lineTo(cx + wst + 2, hy + 156); p.lineTo(cx + 58, H + 6); p.lineTo(cx - 58, H + 6); p.closePath(); });
      paint([skirt], sk, skS, { so: [-3, 0] });
      inside(skirt, () => { for (let k = -4; k <= 4; k++) line([[cx + k * 8 + 3, hy + 160], [cx + k * 13 + 5, H + 6]], skS, 2); });
      paint([path(p => p.rect(cx - wst - 3, hy + 150, wst * 2 + 6, 8))], acc, accS, { lw: 1.6 });
      paint([path(p => p.rect(cx - 5, hy + 149, 10, 10))], u('#ffd766'), u('#c89a2e'), { lw: 1.4 });
    } else {
      // hoodie: zip, pocket, drawstrings, cat print
      line([[cx, hy + 62], [cx, hy + 200]], acc, 2);
      paint([path(p => { p.moveTo(cx - 28, hy + 150); p.lineTo(cx + 28, hy + 150); p.lineTo(cx + 34, hy + 186); p.lineTo(cx - 34, hy + 186); p.closePath(); })], hi(jk, 5), jk, { lw: 1.6 });
      line([[cx - 9, hy + 62], [cx - 11, hy + 100]], '#ffffff', 2); line([[cx + 9, hy + 62], [cx + 11, hy + 100]], '#ffffff', 2);
      paint([ell([cx - 11, hy + 102], 2.4, 3), ell([cx + 11, hy + 102], 2.4, 3)], acc, accS, { lw: 1.2 });
      paint([poly([[cx + 16, hy + 108], [cx + 18, hy + 101], [cx + 22, hy + 106], [cx + 26, hy + 106], [cx + 30, hy + 101], [cx + 32, hy + 108], [cx + 30, hy + 116], [cx + 18, hy + 116]])], acc, accS, { lw: 1.2 });
      paint([path(p => { p.moveTo(cx - 13, hy + 54); p.quadraticCurveTo(cx, hy + 70, cx + 13, hy + 54); p.lineTo(cx + 20, hy + 60); p.quadraticCurveTo(cx, hy + 82, cx - 20, hy + 60); p.closePath(); })], hi(jk, 5), jk, { lw: 1.6 });
      const skirt = path(p => { p.moveTo(cx - hip - 2, hy + 200); p.lineTo(cx + hip + 2, hy + 200); p.lineTo(cx + 54, H + 6); p.lineTo(cx - 54, H + 6); p.closePath(); });
      paint([skirt], sk, skS); inside(skirt, () => { for (let k = -4; k <= 4; k++) line([[cx + k * 9, hy + 202], [cx + k * 12, H + 6]], skS, 2); });
      paint([path(p => p.rect(cx - hip - 4, hy + 194, hip * 2 + 8, 8))], acc, accS, { lw: 1.6 });
    }
    for (const k of infront) drawArm(arms[k], true);

    // elemental effect for the power pose
    if (pose === 'power' && c.fx !== 'none') {
      const h = arms[1][2], ox = h[0] + 2, oy = h[1] - 22;
      if (c.fx === 'fire') {
        paint([path(p => { p.moveTo(ox, oy - 28); p.bezierCurveTo(ox + 22, oy - 6, ox + 18, oy + 16, ox, oy + 16); p.bezierCurveTo(ox - 20, oy + 16, ox - 20, oy - 4, ox - 8, oy - 14); p.quadraticCurveTo(ox - 6, oy - 4, ox - 1, oy - 8); p.quadraticCurveTo(ox + 4, oy - 16, ox, oy - 28); })], u('#ff8a2a'), u('#ff4a2a'), { ol: '#b02a1a', so: [0, -5] });
        paint([path(p => { p.moveTo(ox, oy - 10); p.bezierCurveTo(ox + 10, oy, ox + 9, oy + 12, ox, oy + 12); p.bezierCurveTo(ox - 9, oy + 12, ox - 9, oy + 2, ox, oy - 10); })], u('#fff2a0'), u('#ffd24a'), { outline: false, so: [0, -3] });
      } else if (c.fx === 'ice') {
        for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + (k - 1) * .7, L = k === 1 ? 30 : 20, bx = ox + (k - 1) * 9, by = oy + 12;
          paint([poly([[bx - 6, by], [bx + Math.cos(a) * L, by + Math.sin(a) * L], [bx + 6, by], [bx, by + 6]])], u('#d6f4ff'), u('#7ad0f0'), { ol: '#2f7fc0' }); }
        line([[ox - 2, oy + 6], [ox, oy - 12]], '#ffffff', 1.5);
      } else {
        paint([ell([ox, oy], 16, 16)], u('#2a1848'), u('#140a26'), { ol: '#b07aff', lw: 3 });
        paint([ell([ox - 4, oy - 4], 5, 5)], u('#b07aff'), u('#7a48d8'), { outline: false });
        for (let k = 0; k < 5; k++) { const a = k * 1.3 + .4; paint([ell([ox + Math.cos(a) * 24, oy + Math.sin(a) * 24], 2.5, 2.5)], '#b07aff', '#7a48d8', { outline: false }); }
      }
    }

    // ---------------- head ----------------
    const face = path(p => { p.moveTo(cx - RX, hy - 8); p.bezierCurveTo(cx - RX, hy - RY - 12, cx + RX, hy - RY - 12, cx + RX, hy - 8);
      p.bezierCurveTo(cx + RX, hy + 18, cx + RX - 9, hy + 34, cx + 7, hy + 44); p.quadraticCurveTo(cx, hy + 48, cx - 7, hy + 44); p.bezierCurveTo(cx - RX + 9, hy + 34, cx - RX, hy + 18, cx - RX, hy - 8); });
    paint([ell([cx - RX + 1, hy + 10], 5, 8), ell([cx + RX - 1, hy + 10], 5, 8)], skin, skinS);
    paint([face], skin, skinS, { so: [-2, -3] });
    // soft shadow the bangs cast on the forehead
    inside(face, () => fill(path(p => p.rect(cx - RX, hy - RY - 12, RX * 2, RY - 2)), skinS));

    const touko = id === 'touko';
    const EY = hy + 10, EX = 17, ew = 9, ehBase = touko ? 8 : 10;
    const look = e.look || 0, eyeD = sh(c.eyes, 22), eyeL = hi(c.eyes, 16), lash = u(sh(OL, 0));
    const eyeMode = blink && (e.eye === 'open' || e.eye === 'wide' || e.eye === 'half') ? 'blink' : e.eye;
    for (const d of [-1, 1]) {
      const ex = cx + d * EX;
      if (eyeMode === 'happy') { line([[ex - 8, EY + 3], [ex, EY - 8, ex + 8, EY + 3]], lash, 2.8); continue; }
      if (eyeMode === 'closed' || eyeMode === 'blink') { line([[ex - 8, EY + 2], [ex, EY + 8, ex + 8, EY + 2]], lash, 2.6); line([[ex + d * 8, EY + 2], [ex + d * 11, EY]], lash, 2); continue; }
      if (eyeMode === 'squeeze') { line([[ex - d * 7, EY + 1], [ex + d * 7, EY - 5]], lash, 2.6); line([[ex - d * 7, EY + 1], [ex + d * 7, EY + 6]], lash, 2.6); continue; }
      const k = eyeMode === 'wide' ? 1.14 : eyeMode === 'half' ? .66 : 1, eh = ehBase * k, top = EY - eh + (eyeMode === 'half' ? 3 : 0);
      const shape = path(p => { p.moveTo(ex - ew, EY - 1); p.bezierCurveTo(ex - ew, top - 2, ex + ew, top - 2, ex + ew, EY - 1); p.bezierCurveTo(ex + ew, EY + eh + 2, ex - ew, EY + eh + 2, ex - ew, EY - 1); });
      fill(shape, '#ffffff');
      inside(shape, () => {
        fill(path(p => p.rect(ex - ew, top - 3, ew * 2, 5)), u('#d9d6ea'));
        const ix = ex + look * 2, iy = EY + (eyeMode === 'half' ? 3 : 1), ir = eyeMode === 'wide' ? 6 : 7;
        fill(ell([ix, iy], ir, ehBase - .5), c.eyes);
        inside(path(p => p.rect(ix - 9, iy - 12, 18, 11)), () => fill(ell([ix, iy], ir, ehBase - .5), eyeD));
        fill(ell([ix, iy + 5], ir - 2.5, 3.2), eyeL);
        fill(ell([ix, iy], 2.6, 4), u('#1a1024'));
        fill(ell([ix - 3, iy - 4.5], 2.7, 2.7), '#ffffff'); fill(ell([ix + 3, iy + 4], 1.3, 1.3), '#ffffff');
        if (e.stars) { fill(poly([[ix + 2, iy - 2], [ix + 3.3, iy + .8], [ix + 6, iy + 2], [ix + 3.3, iy + 3.2], [ix + 2, iy + 6], [ix + .7, iy + 3.2], [ix - 2, iy + 2], [ix + .7, iy + .8]]), '#ffffff'); }
      });
      // upper lash with an outer wing, thin lower line
      line([[ex - ew - 1, EY - 1], [ex - ew, top - 3, ex, top - 3.5], [ex + ew, top - 3, ex + ew + 1, EY - 1]], lash, 3);
      line([[ex + d * (ew + 1), EY - 2], [ex + d * (ew + 5), EY - 6]], lash, 2.2);
      line([[ex - 4, EY + eh + .5], [ex + 4, EY + eh + .5]], u(sh(skinS, 16)), 1.4);
    }
    // brows
    const browC = sh(hairS, 14);
    for (const d of [-1, 1]) {
      const ex = cx + d * EX, by = hy - (touko ? 6 : 8) - (e.brow === 'up' ? 3 : 0) + (e.eye === 'wide' ? -2 : 0);
      const inner = e.brow === 'angry' ? 5 : e.brow === 'sad' ? -3 : 0, outer = e.brow === 'angry' ? -3 : e.brow === 'sad' ? 3 : 1;
      line([[ex - d * 8, by + inner], [ex, by + (inner + outer) / 2 - 2, ex + d * 9, by + outer]], browC, 2.2);
    }
    // nose
    line([[cx + 1, hy + 23], [cx + 2.5, hy + 25]], u(sh(skinS, 14)), 1.6);
    // blush
    if (e.blush) { const bc = u('#ffab9e'); for (const d of [-1, 1]) { fill(ell([cx + d * 22, hy + 24], 8, 3.6), bc);
      if (e.blush > 1) for (let k = -1; k <= 1; k++) line([[cx + d * 22 + k * 4 - 1.5, hy + 26.5], [cx + d * 22 + k * 4 + 1.5, hy + 21.5]], u('#ff6f7c'), 1.3); } }
    // mouth
    const mx = cx, my = hy + 34, mD = u('#7a2338'), mT = u('#f08a94'), mL = u(sh(skinS, 26));
    const openMouth = (w, h, teeth) => { const m = path(p => { p.moveTo(mx - w, my - 1); p.lineTo(mx + w, my - 1); p.quadraticCurveTo(mx + w * .8, my + h, mx, my + h); p.quadraticCurveTo(mx - w * .8, my + h, mx - w, my - 1); });
      fill(m, mD); inside(m, () => { fill(ell([mx, my + h + 1], w * .7, h * .45), mT); if (teeth) fill(path(p => p.rect(mx - w, my - 2, w * 2, 3.4)), '#ffffff'); }); line([[mx - w, my - 1], [mx + w, my - 1], [mx + w * .8, my + h, mx, my + h], [mx - w * .8, my + h, mx - w, my - 1]], mD, 1.4); };
    let mouth = e.mouth;
    if (talk) mouth = ({ smile: 'talkS', flat: 'talkO', frown: 'talkO', cat: 'talkS', pout: 'talkO', wavy: 'talkO', o: 'flat', open: 'smile', grin: 'smile' })[mouth];
    if (mouth === 'smile') line([[mx - 6, my], [mx, my + 4.5, mx + 6, my]], mL, 2);
    else if (mouth === 'flat') line([[mx - 4, my + 1], [mx + 4, my + 1]], mL, 2);
    else if (mouth === 'frown') line([[mx - 5, my + 3], [mx, my - 1, mx + 5, my + 3]], mL, 2);
    else if (mouth === 'pout') line([[mx - 4, my + 2], [mx - 1, my - 1, mx + 3, my + 2]], mL, 2);
    else if (mouth === 'wavy') line([[mx - 7, my + 1], [mx - 4, my - 2, mx - 1, my + 1], [mx + 2, my + 4, mx + 4, my + 1], [mx + 6, my - 1, mx + 7, my + 1]], mL, 1.8);
    else if (mouth === 'cat') line([[mx - 7, my - 1], [mx - 4, my + 4, mx, my], [mx + 4, my + 4, mx + 7, my - 1]], mL, 2);
    else if (mouth === 'o') { fill(ell([mx, my + 1], 3, 4), mD); }
    else if (mouth === 'open') openMouth(7, 9, false);
    else if (mouth === 'grin') openMouth(9, 8, true);
    else if (mouth === 'talkS') openMouth(5.5, 6, false);
    else if (mouth === 'talkO') { fill(ell([mx, my + 1.5], 3.6, 3.4), mD); }

    if (touko) { // glasses + beauty mark
      for (const d of [-1, 1]) { X.strokeStyle = u('#d8dcec'); X.lineWidth = 1.8; X.beginPath(); X.roundRect(cx + d * EX - 12, EY - 9, 24, 17, 4); X.stroke(); }
      line([[cx - 5, EY - 2], [cx + 5, EY - 2]], '#d8dcec', 1.8); fill(ell([cx + 15, hy + 30], 1.2, 1.2), u('#3a2030'));
    }

    // ---------------- hair in front ----------------
    const T0 = hy - RY - 11; // skull top
    const bangs = pts => path(p => { p.moveTo(cx - RX - 6, hy + 4); p.bezierCurveTo(cx - RX - 10, T0 - 6, cx + RX + 10, T0 - 6, cx + RX + 6, hy + 4); pts.forEach(q => p.lineTo(cx + q[0], hy + q[1])); p.closePath(); });
    let fringe;
    if (id === 'akari') {
      fringe = bangs([[38, -6], [32, 4], [27, -12], [19, 3], [12, -15], [5, 1], [-3, -16], [-11, 2], [-20, -13], [-27, 6], [-33, -8], [-39, 14]]);
      paint([fringe], hair, hairS);
      paint([path(p => { p.moveTo(cx - RX - 5, hy - 6); p.quadraticCurveTo(cx - RX - 12, hy + 26, cx - RX + 2, hy + 44); p.quadraticCurveTo(cx - RX + 2, hy + 20, cx - RX + 8, hy - 4); p.closePath(); }),
        path(p => { p.moveTo(cx + RX + 5, hy - 6); p.quadraticCurveTo(cx + RX + 12, hy + 22, cx + RX, hy + 38); p.quadraticCurveTo(cx + RX - 2, hy + 18, cx + RX - 8, hy - 4); p.closePath(); })], hair, hairS);
      // ahoge
      paint([path(p => { p.moveTo(cx - 4, T0 + 2); p.quadraticCurveTo(cx - 2, T0 - 22, cx + 16, T0 - 16); p.quadraticCurveTo(cx + 4, T0 - 12, cx + 4, T0 + 2); p.closePath(); })], hair, hairS);
      // ribbon at the ponytail base
      paint([poly([[cx + 30, hy - 40], [cx + 44, hy - 54], [cx + 46, hy - 36]]), poly([[cx + 30, hy - 40], [cx + 22, hy - 56], [cx + 16, hy - 42]]), ell([cx + 30, hy - 40], 4, 4)], acc, accS, { lw: 1.6 });
    } else if (id === 'rei') {
      fringe = bangs([[38, 8], [30, 2], [25, 4], [22, -1], [14, 1], [10, 3], [6, -1], [-2, 2], [-6, 0], [-14, 3], [-18, 0], [-26, 3], [-30, 2], [-38, 8]]);
      paint([fringe], hair, hairS);
      // long straight side locks
      paint([path(p => { p.moveTo(cx - RX - 6, hy - 4); p.lineTo(cx - RX - 9, hy + 96); p.lineTo(cx - RX + 2, hy + 106); p.lineTo(cx - RX + 7, hy + 96); p.lineTo(cx - RX + 9, hy - 2); p.closePath(); }),
        path(p => { p.moveTo(cx + RX + 6, hy - 4); p.lineTo(cx + RX + 9, hy + 96); p.lineTo(cx + RX - 2, hy + 106); p.lineTo(cx + RX - 7, hy + 96); p.lineTo(cx + RX - 9, hy - 2); p.closePath(); })], hair, hairS);
      // snowflake pin
      const px = cx + 29, py = hy - 22; for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; line([[px - Math.cos(a) * 6, py - Math.sin(a) * 6], [px + Math.cos(a) * 6, py + Math.sin(a) * 6]], u('#3f86e6'), 2.4); }
      for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; line([[px - Math.cos(a) * 5, py - Math.sin(a) * 5], [px + Math.cos(a) * 5, py + Math.sin(a) * 5]], '#ffffff', 1.2); }
    } else if (id === 'mio') {
      fringe = bangs([[39, 22], [33, 12], [30, 16], [24, 0], [17, 6], [9, -6], [3, 12], [-3, -8], [-11, 5], [-18, -4], [-25, 8], [-31, 2], [-39, 22]]);
      paint([fringe], hair, hairS);
      paint([path(p => { p.moveTo(cx - RX - 7, hy - 2); p.quadraticCurveTo(cx - RX - 13, hy + 34, cx - RX + 8, hy + 46); p.quadraticCurveTo(cx - RX + 1, hy + 24, cx - RX + 8, hy); p.closePath(); }),
        path(p => { p.moveTo(cx + RX + 7, hy - 2); p.quadraticCurveTo(cx + RX + 13, hy + 34, cx + RX - 8, hy + 46); p.quadraticCurveTo(cx + RX - 1, hy + 24, cx + RX - 8, hy); p.closePath(); })], hair, hairS);
      // cat-ear headphones
      paint([path(p => { p.moveTo(cx - RX - 6, hy - 6); p.bezierCurveTo(cx - RX - 6, T0 - 14, cx + RX + 6, T0 - 14, cx + RX + 6, hy - 6); p.lineTo(cx + RX, hy - 6); p.bezierCurveTo(cx + RX, T0 - 6, cx - RX, T0 - 6, cx - RX, hy - 6); p.closePath(); })], u('#3a3350'), u('#241f36'), { lw: 1.8 });
      paint([poly([[cx - 34, T0 + 8], [cx - 30, T0 - 20], [cx - 12, T0 - 2]]), poly([[cx + 34, T0 + 8], [cx + 30, T0 - 20], [cx + 12, T0 - 2]])], '#3a3350', '#241f36');
      paint([poly([[cx - 30, T0 + 2], [cx - 28, T0 - 11], [cx - 19, T0 - 2]]), poly([[cx + 30, T0 + 2], [cx + 28, T0 - 11], [cx + 19, T0 - 2]])], acc, accS, { outline: false });
      paint([ell([cx - RX - 5, hy + 6], 8, 13), ell([cx + RX + 5, hy + 6], 8, 13)], '#3a3350', '#241f36');
      paint([ell([cx - RX - 6, hy + 6], 3.5, 7), ell([cx + RX + 6, hy + 6], 3.5, 7)], acc, accS, { outline: false });
    } else {
      // side-parted, swept fringe
      fringe = bangs([[39, 26], [34, 8], [28, -6], [16, -18], [2, -24], [-8, -22], [-4, -10], [-12, 2], [-22, 10], [-30, 14], [-34, 26], [-40, 30]]);
      paint([fringe], hair, hairS);
    }
    // highlight band across the fringe
    inside(fringe, () => { const y = T0 + 22; X.strokeStyle = hairL; X.lineWidth = 3.4; X.lineCap = 'round'; X.beginPath();
      for (let k = -5; k <= 5; k++) { const x = cx + k * 7; X.moveTo(x - 2.4, y - Math.abs(k) * .5 + (k % 2 ? 2 : 0)); X.lineTo(x + 2.4, y - Math.abs(k) * .5 + (k % 2 ? 0 : 2)); } X.stroke(); });

    // ---------------- extras ----------------
    if (e.sweat) paint([path(p => { p.moveTo(cx + 40, hy - 26); p.quadraticCurveTo(cx + 48, hy - 12, cx + 40, hy - 8); p.quadraticCurveTo(cx + 32, hy - 12, cx + 40, hy - 26); })], u('#c8ecff'), u('#7ab8ee'), { ol: '#3f76c0', lw: 1.6 });
    if (e.vein) { const vx = cx + 34, vy = hy - 36, r = u('#e8303a'); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) line([[vx + a * 2.5, vy + b * 7], [vx + a * 2.5, vy + b * 2.5, vx + a * 7, vy + b * 2.5]], r, 2.4); }
    if (e.tears) for (const d of [-1, 1]) paint([path(p => { const x = cx + d * 24, y = EY + 8; p.moveTo(x, y); p.quadraticCurveTo(x + 5, y + 10, x, y + 13); p.quadraticCurveTo(x - 5, y + 10, x, y); })], u('#c8ecff'), u('#7ab8ee'), { ol: '#3f76c0', lw: 1.4 });

    X.setTransform(1, 0, 0, 1, 0, 0);
    MoonkaiPixel.snap(X, cv.width, cv.height, [...used], 120);
    return cv;
  }

  const cache = new Map();
  function portrait(id, expr = 'neutral', pose = 'down', blink = false, talk = false, scale = 1) {
    const key = [id, expr, pose, blink ? 1 : 0, talk ? 1 : 0, scale].join('|');
    if (!cache.has(key)) cache.set(key, render(id, expr, pose, blink, talk, scale));
    return cache.get(key);
  }
  // Small face crop used by HUD cards and the backlog.
  function faceIcon(id, expr = 'smile') {
    const p = portrait(id, expr), cv = document.createElement('canvas'); cv.width = 96; cv.height = 96;
    cv.getContext('2d').drawImage(p, CX - 48, HY - 52, 96, 96, 0, 0, 96, 96); return cv;
  }
  window.AHChars = { CHARS, EXPR, YOU_CHIBI, portrait, faceIcon, W, H };
})();

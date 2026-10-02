/* HEARTLINE AGENCY — pixel cast, drawn for the Moonkai Pixel Engine.
   Anime proportions (about 6 heads tall): a large round head with big low-set eyes and a small chin, a slender
   neck, sloped shoulders, a narrow waist, flared hips, long legs, curved limbs with small jointed hands.
   Every character is painted from scratch in pixel space with cel shading lit from the upper left: layered
   hair clumps, costumes cut to the body profile, 40 pixel expressions with animated manpu, 12 poses with
   their own two-arm rigs, head tilt and body language, and a signature idle loop per character.
   Frames: 12-frame idle, 4-frame talk, 1-frame blink. Sprite grid 176 x 316 over the 400 x 720 stage box
   (0.44 px per unit: head to just above the knee), supersampled 4x and snapped to each frame's palette. */
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

  // ---------- anime anatomy (about 6 heads tall; the frame runs from the top of the head to just above the knee) ----------
  // Torso and legs are built from width profiles (y, half-width) so every garment can follow the same body.
  const catmull = pts => { let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`; } return d; };
  function makeAnat(o) {
    const P = o.prof, hw = y => { if (y <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (y <= P[i][0]) { const [y0, w0] = P[i - 1], [y1, w1] = P[i]; return w0 + (w1 - w0) * (y - y0) / (y1 - y0); } return P[P.length - 1][1]; };
    const L = P.map(([y, w]) => [200 - w, y]), R = P.map(([y, w]) => [200 + w, y]).reverse();
    const torso = catmull(L) + ` L200,${o.crotch} ` + catmull(R).replace(/^M/, 'L') + 'Z';
    const leg = s => { const X = x => 200 + (x - 200) * s, t = o.thigh, y0 = P[P.length - 2][0];
      return catmull([[X(200 - hw(y0)), y0], [X(200 - t[0]), 626], [X(200 - t[1]), 720]]) + ` L${X(200 - t[2])},720 L${X(200 - t[3])},630 L${X(199)},${o.crotch}Z`; };
    return Object.assign(o, { hw, torso, legs: [leg(1), leg(-1)], span: y => [200 - hw(y), 200 + hw(y)] });
  }
  const ANAT = {
    f: makeAnat({ prof: [[262, 13], [270, 46], [282, 68], [298, 76], [322, 68], [350, 62], [376, 52], [404, 42], [436, 38], [470, 50], [502, 66], [530, 72], [548, 68]], crotch: 566, thigh: [66, 54, 12, 8],
      sh: [[136, 300], [264, 300]], kx: 1, arm: [31, 25, 17], hand: 1, neck: [189, 211], head: 'f', eye: [[173, 162], [227, 162], 1.3, 1.34], mouth: [200, 202, .85], chest: 1 }),
    m: makeAnat({ prof: [[260, 15], [268, 54], [280, 84], [298, 96], [328, 88], [364, 78], [402, 66], [440, 58], [480, 58], [520, 62], [556, 60]], crotch: 574, thigh: [60, 52, 12, 8],
      sh: [[116, 300], [284, 300]], kx: 1.16, arm: [37, 30, 21], hand: 1.14, neck: [185, 215], head: 'm', eye: [[174, 158], [226, 158], 1.12, 1.08], mouth: [200, 204, .95] }),
    b: makeAnat({ prof: [[258, 18], [266, 66], [278, 102], [296, 116], [330, 110], [368, 100], [404, 88], [442, 80], [480, 78], [520, 74], [556, 70]], crotch: 574, thigh: [70, 62, 14, 10],
      sh: [[98, 302], [302, 302]], kx: 1.4, arm: [48, 40, 28], hand: 1.3, neck: [180, 220], head: 'm', eye: [[174, 158], [226, 158], 1.08, 1.02], mouth: [200, 206, 1] })
  };
  const HEAD = {
    f: 'M142,128 C142,80 168,52 200,52 C232,52 258,80 258,128 C258,158 252,182 238,200 C226,214 212,222 200,226 C188,222 174,214 162,200 C148,182 142,158 142,128Z',
    m: 'M140,124 C140,76 166,50 200,50 C234,50 260,76 260,124 C260,156 256,184 244,204 C232,220 216,228 200,230 C184,228 168,220 156,204 C144,184 140,156 140,124Z',
    o: 'M141,122 C141,74 166,50 200,50 C234,50 259,74 259,122 C259,160 254,190 240,208 C228,222 214,230 200,231 C186,230 172,222 160,208 C146,190 141,160 141,122Z'
  };
  // cel fill: shadow colour first, then the base shifted toward the light (upper left); leaves a crisp shade band
  function cel(g, d, base, sh, lw = 2.4, lc, off = [-9, -5]) {
    const p = typeof d === 'string' ? new Path2D(d) : d;
    g.solid(p, sh || shade(base, -1, 13)); g.save(); g.clip(p); g.tr(off[0], off[1]); g.solid(p, base); g.restore();
    if (lw) g.line(p, lc || g.LN, lw);
    return p;
  }
  const clipY = (g, y0, y1) => g.clip(`M-200,${y0} L600,${y0} L600,${y1} L-200,${y1}Z`);
  // clothing on the torso between two heights, with a hem line
  function wearTorso(g, A, base, sh, y0 = 0, y1 = 999, lw = 2.4) {
    g.save(); clipY(g, y0, y1); cel(g, A.torso, base, sh, lw); g.restore();
    if (y1 < A.crotch) { const [a, b] = A.span(y1); g.line(`M${f1(a)},${y1} L${f1(b)},${y1}`, g.LN, lw); }
  }
  function wearLegs(g, A, base, sh, y0 = 0, lw = 2.4) { A.legs.forEach(l => { g.save(); clipY(g, y0, 800); cel(g, l, base, sh, lw); g.restore(); if (y0 > 560) { g.save(); g.clip(l); g.line(`M0,${y0} L400,${y0}`, g.LN, lw); g.restore(); } }); }
  function skirt(g, A, base, sh, y0, y1, flare = 24, pleats = 6, hem) {
    const [a0, b0] = A.span(y0), [a1, b1] = A.span(y1).map((v, i) => v + (i ? flare : -flare)), n = pleats * 2;
    let d = `M${f1(a0 - 2)},${y0} L${f1(b0 + 2)},${y0} L${f1(b1)},${y1}`;
    for (let i = n; i >= 0; i--) { const x = a1 + (b1 - a1) * i / n; d += ` L${f1(x)},${y1 + (i % 2 ? 6 : 0)}`; }
    d += 'Z'; cel(g, d, base, sh);
    for (let i = 1; i < pleats; i++) { const t = i / pleats; g.line(`M${f1(a0 + (b0 - a0) * t)},${y0 + 6} L${f1(a1 + (b1 - a1) * t)},${y1}`, sh, 2); }
    if (hem) g.line(`M${f1(a1)},${y1 - 4} L${f1(b1)},${y1 - 4}`, hem, 3.4);
  }
  function shorts(g, A, base, sh, y1 = 600) { g.save(); clipY(g, 0, y1); A.legs.forEach(l => cel(g, l, base, sh)); g.restore(); const [a, b] = A.span(480); g.save(); clipY(g, 470, y1); cel(g, A.torso, base, sh); g.restore(); A.legs.forEach(l => { g.save(); g.clip(l); g.line(`M0,${y1} L400,${y1}`, g.LN, 2.4); g.restore(); }); }
  const mirror = (g, fn) => { fn(); g.mir(fn); };

  // ---------- arms: a curved limb through shoulder, rounded elbow and wrist ----------
  function limbPts(s, e, w, n = 22) {
    const d1 = [e[0] - s[0], e[1] - s[1]], d2 = [w[0] - e[0], w[1] - e[1]], l1 = Math.hypot(...d1) || 1, l2 = Math.hypot(...d2) || 1, r = Math.min(16, l1 / 3, l2 / 3);
    const a = [e[0] - d1[0] / l1 * r, e[1] - d1[1] / l1 * r], b = [e[0] + d2[0] / l2 * r, e[1] + d2[1] / l2 * r], out = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n; let p;
      if (u < .45) { const k = u / .45; p = [s[0] + (a[0] - s[0]) * k, s[1] + (a[1] - s[1]) * k]; }
      else if (u < .55) { const k = (u - .45) / .1, m = 1 - k; p = [m * m * a[0] + 2 * m * k * e[0] + k * k * b[0], m * m * a[1] + 2 * m * k * e[1] + k * k * b[1]]; }
      else { const k = (u - .55) / .45; p = [b[0] + (w[0] - b[0]) * k, b[1] + (w[1] - b[1]) * k]; }
      out.push(p);
    }
    return out;
  }
  // outline of the limb between u0 and u1, widths [shoulder, elbow, wrist] (+pad for sleeves)
  function limbPath(pts, ws, u0 = 0, u1 = 1, pad = 0) {
    const n = pts.length - 1, Lp = [], Rp = [];
    const wAt = u => { if (u < .5) { const k = u / .5; return ws[0] + (ws[1] - ws[0]) * k + Math.sin(k * Math.PI) * ws[0] * .12; } const k = (u - .5) / .5; return ws[1] + (ws[2] - ws[1]) * k + Math.sin(Math.min(1, k * 1.6) * Math.PI) * ws[1] * .1; };
    for (let i = Math.round(u0 * n); i <= Math.round(u1 * n); i++) {
      const p = pts[i], q = pts[Math.min(n, i + 1)], o = pts[Math.max(0, i - 1)], dx = q[0] - o[0], dy = q[1] - o[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, hw = wAt(i / n) / 2 + pad;
      Lp.push([p[0] + nx * hw, p[1] + ny * hw]); Rp.push([p[0] - nx * hw, p[1] - ny * hw]);
    }
    const all = [...Lp, ...Rp.reverse()];
    return 'M' + all.map(p => f1(p[0]) + ',' + f1(p[1])).join(' L') + 'Z';
  }
  // hands in wrist space (+y runs along the forearm)
  function hand(g, c, type, col, sz) {
    const LN = c.line, sh = shade(col, -1, 12), fg = (d, w = 7) => { g.line(d, LN, w + 2.6); g.line(d, col, w); };
    g.save(); g.sc(sz);
    switch (type) {
      case 'fist': case 'hipfist': case 'under':
        cel(g, 'M-11,-1 C-13,9 -13,21 -8,27 C-2,31 8,31 11,25 C14,17 13,7 11,-1Z', col, sh, 2.2, LN, [-3, -2]); g.line('M-9,20 q3,4 6,1 q3,4 6,1 q3,3 5,0', LN, 1.2); if (type === 'fist') g.line('M-12,8 Q-6,13 0,10', LN, 1.4); break;
      case 'point': fg('M-3,22 L-4,50', 6.4); cel(g, 'M-11,-1 C-13,9 -12,20 -8,25 C-2,29 8,29 11,23 C14,15 13,6 11,-1Z', col, sh, 2.2, LN, [-3, -2]); g.line('M-8,18 q3,4 6,1', LN, 1.2); break;
      case 'wave': case 'reach': fg('M-7,18 L-12,40', 6); fg('M-2,20 L-3,46', 6); fg('M3,20 L6,45', 6); fg('M7,17 L13,38', 5.4); fg('M-9,6 L-19,16', 6); cel(g, 'M-10,-1 C-13,8 -12,20 -6,24 C0,27 8,25 11,18 C13,10 12,4 10,-1Z', col, sh, 2.2, LN, [-3, -2]); break;
      case 'chin': fg('M-5,20 L-8,44', 6); cel(g, 'M-11,-1 C-13,9 -12,20 -8,24 C-2,28 8,28 11,22 C14,15 13,6 11,-1Z', col, sh, 2.2, LN, [-3, -2]); break;
      case 'palm': cel(g, 'M-9,-1 C-11,14 -10,32 -5,44 C-1,49 6,47 8,41 C10,29 11,13 9,-1Z', col, sh, 2.2, LN, [-3, -2]); g.line('M-3,26 L-3,44 M2,26 L3,45', LN, 1.1); fg('M-9,8 L-15,20', 5.4); break;
      default: cel(g, 'M-9,-1 C-11,10 -10,22 -6,30 C-3,35 4,36 8,31 C11,24 11,12 9,-1Z', col, sh, 2.2, LN, [-3, -2]); g.fill('M-6,27 C-7,35 -4,43 0,45 C3,45 6,39 6,31', col, 2, LN); g.fill('M-9,9 C-15,15 -15,23 -10,27 C-8,23 -8,17 -6,13Z', col, 1.8, LN); g.line('M1,31 L2,42', LN, 1);
    }
    g.restore();
  }
  // o: { sleeve: 'long'|'short'|'none'|'puff', sleeveC, sleeveS, cuff, glove (whole hand), gauntlet (forearm) }
  function arm(g, c, A, side, spec, st) {
    const X = x => 200 + (x - 200) * A.kx, s0 = A.sh[side === 'L' ? 0 : 1];
    let [[ex, ey], [wx, wy], ht] = spec; ex = X(ex); wx = X(wx); ey += st.lift; wy += st.lift;
    if (st.waveArm && side === 'R') { const a = Math.sin(st.t * TAU * 2) * .3, dx = wx - ex, dy = wy - ey; wx = ex + dx * Math.cos(a) - dy * Math.sin(a); wy = ey + dx * Math.sin(a) + dy * Math.cos(a); }
    if (st.cheer) { const b = Math.round(Math.sin(st.t * TAU * 2 + (side === 'L' ? 0 : 1.5)) * 6); ey += b; wy += b * 1.6; }
    if (st.pump && side === 'R') wy += Math.round(Math.sin(st.t * TAU) * 5);
    const s = [s0[0], s0[1] + st.lift * .6], pts = limbPts(s, [ex, ey], [wx, wy]), o = st.outfit, ws = A.arm;
    const skin = c.skin, sc = o.sleeveC || '#888', scS = o.sleeveS || shade(sc, -1, 13), sl = o.sleeve || 'long';
    cel(g, limbPath(pts, ws), skin, c.skinS, 2.4, c.line, [side === 'L' ? -4 : -6, -3]);
    if (sl === 'long') { cel(g, limbPath(pts, ws, 0, .94, 2.5), sc, scS, 2.4, c.line, [-5, -3]); g.line(limbPath(pts, ws, .5, .52, 2.5), scS, 1.6); }
    else if (sl === 'short' || sl === 'puff') cel(g, limbPath(pts, ws, 0, sl === 'puff' ? .3 : .38, sl === 'puff' ? 7 : 4), sc, scS, 2.4, c.line, [-5, -3]);
    if (o.gauntlet) cel(g, limbPath(pts, ws, .56, .96, 3), o.gauntlet, shade(o.gauntlet, -1, 14), 2.4, c.line, [-4, -3]);
    if (o.cuff && sl !== 'none') { const u = sl === 'long' ? .88 : sl === 'puff' ? .26 : .33; g.fill(limbPath(pts, ws, u, u + .06, 3), o.cuff, 2); }
    if (o.band) g.fill(limbPath(pts, ws, .86, .94, 2), o.band, 2);
    const w = pts[pts.length - 1], q = pts[pts.length - 3], ang = Math.atan2(w[1] - q[1], w[0] - q[0]) - Math.PI / 2;
    g.save(); g.tr(w[0], w[1]); g.x.rotate(ang); if (ht === 'hipfist') g.x.rotate(side === 'L' ? .5 : -.5);
    hand(g, c, ht, o.glove || skin, (ht === 'reach' ? 1.55 : 1) * A.hand);
    g.restore();
  }

  // ---------- poses: explicit elbow / wrist per side in the female frame (x widens for broader builds) ----------
  // hand: open | fist | point | wave | clasp | chin | palm | reach | hipfist | under
  const POSES = {
    default: { L: [[124, 452], [118, 580], 'open'], R: [[276, 452], [282, 578], 'open'] },
    hip: { L: [[66, 420], [150, 484], 'hipfist'], R: [[278, 452], [284, 580], 'open'], tilt: -3, lean: -3 },
    hips: { L: [[64, 420], [150, 484], 'hipfist'], R: [[336, 420], [250, 484], 'hipfist'], chest: 1 },
    wave: { L: [[124, 454], [120, 580], 'open'], R: [[326, 196], [340, 76], 'wave'], tilt: 5, waveArm: 1 },
    cross: { L: [[112, 414], [226, 432], 'under'], R: [[288, 410], [176, 414], 'fist'], tilt: -2 },
    shy: { L: [[130, 452], [194, 556], 'clasp'], R: [[270, 452], [206, 558], 'clasp'], tilt: 7, lift: 6 },
    fist: { L: [[66, 420], [150, 484], 'hipfist'], R: [[318, 414], [322, 300], 'fist'], tilt: -2, lean: 2, pump: 1 },
    point: { L: [[124, 452], [118, 580], 'open'], R: [[318, 398], [388, 446], 'point'], tilt: -4, lean: 4 },
    think: { L: [[128, 438], [236, 452], 'under'], R: [[286, 396], [228, 272], 'chin'], tilt: 8 },
    heart: { L: [[134, 444], [188, 380], 'palm'], R: [[278, 452], [284, 580], 'open'], tilt: 5 },
    cheer: { L: [[86, 204], [96, 86], 'fist'], R: [[314, 204], [304, 86], 'fist'], tilt: -4, cheer: 1 },
    reach: { L: [[124, 452], [118, 580], 'open'], R: [[292, 404], [250, 366], 'reach'], tilt: 4, lean: 3 }
  };

  // ---------- hair helpers ----------
  function hairLock(g, c, p, w, prof = 'taper', side = 1) {
    g.fill(ribbon(p, w, prof), c.hair, 1.8, c.hairL); g.markLine(c.hairL);
    if (w > 12) { g.solid(ribbon(p, w, prof, .4, .58 * side), c.hairS); g.solid(ribbon(p, w, prof, .14, -.62 * side), c.hairH); }
    if (w > 22) g.line(`M${f1(p[0][0])},${f1(p[0][1])} C${f1(p[1][0])},${f1(p[1][1])} ${f1(p[2][0])},${f1(p[2][1])} ${f1((p[2][0] + p[3][0]) / 2)},${f1((p[2][1] + p[3][1]) / 2)}`, c.hairS, 1.6);
  }
  // skull cap with volume; bangs are drawn over it
  function cap(g, c, d) {
    const p = d || 'M132,150 C118,72 158,28 200,28 C242,28 282,72 268,150 C258,112 236,94 200,94 C164,94 142,112 132,150Z';
    cel(g, p, c.hair, c.hairS, 2, c.hairL, [-10, -6]); g.markLine(c.hairL);
    g.solid('M152,62 C168,42 186,36 200,36 C186,48 174,60 166,80Z', c.hairH);
  }
  // clumped anime fringe: tips [[x, y, width], ...] fanning from the crown
  function fringe(g, c, tips, crown = [200, 40], prof = 'leaf') {
    tips.forEach(([x, y, w]) => { const s = x < crown[0] ? -1 : 1; hairLock(g, c, [[crown[0] + (x - crown[0]) * .2, crown[1]], [crown[0] + (x - crown[0]) * .55, crown[1] + 26], [x - s * 4, y - 36], [x, y]], w, prof, s); });
  }
  function angelRing(g, c, y0 = 90) {
    let top = [], bot = []; for (let x = 150, i = 0; x <= 250; x += 8, i++) { const y = y0 - Math.sin((x - 150) / 100 * Math.PI) * 20; top.push(`${x},${f1(y - 3)}`); bot.unshift(`${x},${f1(y + (i % 2 ? 7 : 3))}`); }
    g.solid('M' + top.join(' L') + ' L' + bot.join(' L') + 'Z', c.hairH);
  }

  // ---------- the cast ----------
  const SK = base => { const r = ramp(base, 4, 10); return { skin: base, skinS: r[2], skinD: r[3], skinH: r[0] }; };
  const HR = (hair, hairS, hairH, hairL) => ({ hair, hairS, hairH, hairL });
  const EY = (e, d, l, dd) => ({ eye: e, eyeD: d, eyeL: l, eyeP: dd || shade(d, -1, 12) });
  const CAST = {};
  const C_BLUE = '#2f5be0';

  // --- Hikari Amane, Thunder Goddess: long blonde twin tails, cropped white hero jacket, lightning everywhere ---
  CAST.hikari = Object.assign(SK('#ffe9de'), HR('#ffd65c', '#e39a2e', '#fff6cc', '#9a5a18'), EY('#3ea4ff', '#1b46a8', '#bff0ff'), {
    body: 'f', line: '#3a1f2e', blush: '#ff9aa6',
    hero: { sleeve: 'puff', sleeveC: '#f8f8ff', sleeveS: '#cfd2ee', cuff: '#ffc21a', glove: C_BLUE, band: '#ffc21a' },
    anim: { spark: 1 },
    back(g, c, a) {
      const sw = a.sway * 12, sw2 = a.sway2 * 8;
      g.fill('M142,96 C132,150 136,196 150,226 L250,226 C264,196 268,150 258,96Z', c.hairS, 0);
      for (const s of [-1, 1]) {
        const X = x => 200 + (x - 200) * s, bx = s * sw, bx2 = s * sw2 + sw * .4;
        [[[X(142), 82], [X(80), 96], [X(50) + bx * .5, 270], [X(62) + bx, 500], 40], [[X(142), 86], [X(92), 130], [X(76) + bx * .6, 330], [X(92) + bx2, 560], 28],
          [[X(140), 84], [X(64), 110], [X(34) + bx * .7, 280], [X(40) + bx, 440], 22]]
          .forEach(([p0, p1, p2, p3, w]) => hairLock(g, c, [p0, p1, p2, p3], w, 'taper', s));
        if (a.spark) { const k = a.frame % 3, y0 = 280 + k * 80, X0 = X(80) + bx * .7; g.line(`M${X0},${y0} l${-10 * s},16 l${12 * s},6 l${-12 * s},18`, '#fff27a', 3.4); g.line(`M${X0},${y0} l${-10 * s},16 l${12 * s},6 l${-12 * s},18`, '#ffffff', 1.3); }
      }
    },
    outfit(g, c, A, a) {
      wearLegs(g, A, c.skin, c.skinS);
      wearLegs(g, A, '#232846', '#151830', 640); A.legs.forEach(l => { g.save(); g.clip(l); g.line('M0,652 L400,652', '#ffc21a', 4); g.restore(); });
      wearTorso(g, A, C_BLUE, '#1d3a9e');
      g.line('M154,376 Q176,394 194,384 M246,376 Q224,394 206,384', '#1d3a9e', 2);
      g.poly([[206, 398], [188, 430], [200, 430], [192, 462], [216, 424], [204, 424], [212, 398]], '#ffc21a', 1.8);
      skirt(g, A, '#232846', '#151830', 486, 612, 26, 7, '#ffc21a');
      g.fill('M156,474 L244,474 L246,494 L154,494Z', '#262a40', 2); g.fill('M190,470 L210,470 L210,498 L190,498Z', '#ffc21a', 1.8);
      // cropped white jacket, open front, gold trim
      g.save(); g.clip(A.torso); clipY(g, 0, 420);
      const pn = 'M-40,240 L188,240 C180,300 182,360 186,424 L-40,424Z';
      mirror(g, () => cel(g, pn, '#f8f8ff', '#cfd2ee', 2.4));
      g.restore();
      mirror(g, () => { g.line('M188,272 C180,320 182,370 186,420', '#ffc21a', 4.4); const [a0] = A.span(420); g.line(`M${a0},420 L186,420`, '#ffc21a', 4.4); });
      g.fill('M178,236 C184,254 216,254 222,236 L232,270 C216,284 184,284 168,270Z', '#f8f8ff', 2.2); g.line('M170,270 C184,280 216,280 230,270', '#ffc21a', 3);
    },
    front(g, c, a) {
      const s = a.sway * 3;
      for (const sg of [-1, 1]) { const X = x => 200 + (x - 200) * sg; hairLock(g, c, [[X(146), 104], [X(134), 160], [X(134) + s * sg, 212], [X(146) + s * sg, 262]], 24, 'taper', sg); }
      cap(g, c);
      fringe(g, c, [[140, 124, 26], [158, 138, 30], [176, 130, 30], [194, 140, 28], [212, 132, 30], [232, 138, 30], [254, 124, 26], [262, 146, 18], [138, 148, 18]]);
      angelRing(g, c);
      const ah = a.bob2 * 6; hairLock(g, c, [[204, 32], [202, 4 + ah], [232 + ah, -6], [240 + ah, 14 + ah * .5]], 11, 'leaf', 1);
      for (const sg of [-1, 1]) { const X = 200 + 60 * sg; g.ell(X, 80, 10, 13, C_BLUE, 2); g.line(`M${X - 4 * sg},74 q${5 * sg},6 0,12`, '#8ab4ff', 1.6); }
      g.poly([[256, 92], [246, 110], [254, 110], [248, 124], [264, 104], [256, 104], [262, 92]], '#fff27a', 1.8, '#2a4fd6');
    }
  });

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
    ominous: { e: 'shadow', b: 'angry', m: 'smirk', lean: 2, tilt: 3 }, singing: { e: 'closed', b: 'raised', m: 'sing', fx: ['notes'], sway: 1, tilt: -4 },
    // quieter, truer faces
    tired: { e: 'lidded', b: 'relaxed', m: 'tiny', droop: 2, tilt: 3 }, wry: { e: 'narrow', b: 'smug', m: 'halfsmile', tilt: -3 },
    proud: { e: 'smileeye', b: 'raised', m: 'smile', lean: -1 }, guarded: { e: 'lidded', b: 'angry', m: 'flat', look: -4, tilt: -2 },
    wince: { e: 'closed', b: 'sad', m: 'teeth', jolt: 1, shake: 1 }, lost: { e: 'soft', b: 'sad', m: 'tiny', look: -4, droop: 2 },
    delighted: { e: 'smileeye', b: 'raised', m: 'grin', fx: ['blushlite'], bob: 1 }, unimpressed: { e: 'lidded', b: 'normal', m: 'flat' },
    fond: { e: 'smileeye', b: 'sad', m: 'gentle', fx: ['blushlite'], tilt: 3 }, scheming: { e: 'narrow', b: 'smug', m: 'smirkfang', tilt: -4, lean: 1 },
    numb: { e: 'dots', b: 'normal', m: 'flat' }, sulk: { e: 'lidded', b: 'sad', m: 'pout', look: 4, tilt: 6 },
    nervous: { e: 'soft', b: 'worried', m: 'bite', fx: ['blushlite'], look: 3, tilt: 4 }, resolve: { e: 'open', b: 'angry', m: 'tight', lean: 1 },
    stunned: { e: 'wide', b: 'raised', m: 'hmm', jolt: 1 }, hurt: { e: 'sad', b: 'sad', m: 'tight', droop: 3, look: -3 }
  };
  // how this particular face wears an emotion: component swaps (face.map), whole overrides (face.emo), softened or amplified body language
  const BL = ['tilt', 'droop', 'lean', 'shake', 'jolt', 'bob', 'hop', 'sway'];
  function emoFor(c, name) {
    const base = EMO[name] || EMO.neutral, F = c.face; if (!F) return base;
    let e = Object.assign({}, base);
    if (F.map) for (const k of ['e', 'm', 'b']) { const mp = F.map[k]; if (!mp) continue; const v = e[k]; e[k] = Array.isArray(v) ? v.map(z => mp[z] || z) : (mp[v] || v); }
    if (F.emo && F.emo[name]) e = Object.assign(e, F.emo[name]);
    if (F.noFx) e.fx = (e.fx || []).filter(k => !F.noFx.includes(k));
    if (F.bl && F.bl !== 1) for (const k of BL) if (e[k]) e[k] = e[k] * F.bl;
    return e;
  }
  // head shapes: the jaw, cheek and chin silhouette (the hair stays put)
  const HEADV = {
    round: { f: 'M141,128 C141,80 168,52 200,52 C232,52 259,80 259,128 C262,164 250,194 234,208 C222,220 210,226 200,227 C190,226 178,220 166,208 C150,194 138,164 141,128Z', m: 'M139,124 C139,76 166,50 200,50 C234,50 261,76 261,124 C263,162 256,192 242,208 C230,222 214,229 200,230 C186,229 170,222 158,208 C144,192 137,162 139,124Z' },
    pointed: { f: 'M143,128 C143,80 168,52 200,52 C232,52 257,80 257,128 C257,158 248,184 232,206 C222,222 208,233 200,238 C192,233 178,222 168,206 C152,184 143,158 143,128Z', m: 'M141,124 C141,76 166,50 200,50 C234,50 259,76 259,124 C259,156 252,186 238,208 C226,224 210,234 200,238 C190,234 174,224 162,208 C148,186 141,156 141,124Z' },
    heart: { f: 'M141,128 C141,80 168,52 200,52 C232,52 259,80 259,128 C261,156 250,182 234,204 C222,220 209,228 200,232 C191,228 178,220 166,204 C150,182 139,156 141,128Z', m: 'M139,124 C139,76 166,50 200,50 C234,50 261,76 261,124 C263,154 254,184 240,206 C228,222 212,230 200,234 C188,230 172,222 160,206 C146,184 137,154 139,124Z' },
    oval: { f: 'M144,128 C144,80 168,52 200,52 C232,52 256,80 256,128 C256,160 250,186 236,206 C224,220 210,228 200,230 C190,228 176,220 164,206 C150,186 144,160 144,128Z', m: 'M142,124 C142,76 166,50 200,50 C234,50 258,76 258,124 C258,158 254,188 242,208 C230,222 214,230 200,232 C186,230 170,222 158,208 C146,188 142,158 142,124Z' },
    square: { f: 'M141,128 C141,80 168,52 200,52 C232,52 259,80 259,128 C261,160 256,190 246,208 C236,222 218,228 200,228 C182,228 164,222 154,208 C144,190 139,160 141,128Z', m: 'M137,124 C137,76 166,50 200,50 C234,50 263,76 263,124 C265,164 260,196 250,212 C238,228 218,233 200,233 C182,233 162,228 150,212 C140,196 135,164 137,124Z' },
    long: { f: 'M144,128 C144,80 168,52 200,52 C232,52 256,80 256,128 C256,162 250,192 236,212 C224,226 210,234 200,238 C190,234 176,226 164,212 C150,192 144,162 144,128Z', m: 'M142,124 C142,76 166,50 200,50 C234,50 258,76 258,124 C258,160 254,194 242,216 C230,230 214,238 200,241 C186,238 170,230 158,216 C146,194 142,160 142,124Z' }
  };
  const headD = (c, A) => (c.face && c.face.head && !c.old && HEADV[c.face.head] && HEADV[c.face.head][A.head === 'f' ? 'f' : 'm']) || HEAD[c.old ? 'o' : A.head];
  const NOSE = { std: 'M201,184 l-2,4', button: 'M199,186 q2,2.4 4,0', point: 'M201,182 l-3,7 l3,1', hook: 'M202,181 l-2,7 q-2,2 -5,0', none: '' };
  const OPEN_M = { grin: 1, laugh: 1, open: 1, sing: 1, o: 1, triangle: 1, shout: 1, sob: 1, teeth: 1 };

  // ---------- face ----------
  // Every character carries a face spec (c.face, see pxface.js): eye shape / tilt / lashes / pupils / highlights, brows,
  // mouth habits, head shape, cheeks, marks and a personal map of how each emotion is actually worn on their face.
  const EYE0 = {};
  function eye(g, c, cx, cy, flip, type, look, t) {
    const x = g.x, m = c.body !== 'f', LN = c.line, F = (c.face && c.face.eye) || EYE0, lwm = F.lw || 1, lw0 = (m ? 3.4 : 4) * lwm;
    g.save(); g.tr(cx, cy); g.sc(flip ? -1 : 1, 1); if (F.rot) g.rot(F.rot); const ix = look * (flip ? -1 : 1);
    const lash = (lw = lw0) => {
      g.line('M-16,0 C-13,-12 5,-16 17,-8', LN, lw); if (m) { if (F.lash === 'sharp') g.line('M15,-8 L22,-12', LN, 2.2); return; }
      const k = F.lash || 'doll';
      if (k === 'doll') g.line('M15,-8 L22,-12 M16,-6 L22,-6', LN, 2);
      else if (k === 'sharp') g.line('M15,-8 L28,-17 M17,-5 L26,-8', LN, 2.4);
      else if (k === 'heavy') { g.line('M15,-8 L23,-12 M16,-6 L23,-5 M11,-11 L17,-17', LN, 2.6); g.line('M-15,-1 L-19,1', LN, 2); }
      else if (k === 'flare') g.line('M15,-8 L25,-14 M17,-5 L27,-5 M11,-11 L15,-19 M5,-13 L7,-20', LN, 2.2);
      else if (k === 'soft') g.line('M15,-8 L19,-10', LN, 1.6);
    };
    const low = () => { if (F.low === 'none') return; g.line('M-6,11 Q2,12.5 10,8', LN, 1.4); if (F.low === 'lash') g.line('M-9,10 l-2,3 M-3,12 l-1,3.5 M4,12 l0,3.5 M10,8.5 l2,3', LN, 1.4); };
    const bags = () => { if (F.bag) g.line('M-12,16 Q0,19.5 13,14', c.skinD, 1.8); };
    const lid = (d, ln) => { g.solid(d, c.skin); g.line(ln, LN, lw0); };
    const WH = 'M-15,-1 C-13,-11 6,-14 16,-7 C18,2 12,10.5 1,11.5 C-9,11.5 -15,6 -15,-1Z';
    if (type === 'happy') { g.line('M-14,4 Q1,-10 16,2', LN, 3.6 * lwm); if (!m) g.line('M15,2 L21,-2', LN, 2); g.restore(); return; }
    if (type === 'closed') { g.line('M-14,-1 Q1,9 16,-2', LN, 3.4 * lwm); if (!m) g.line('M14,0 L20,3 M8,4 L10,8', LN, 1.6); bags(); g.restore(); return; }
    if (type === 'flat') { g.line('M-15,0 L17,-1', LN, 3.4 * lwm); g.line('M-10,7 L12,7', LN, 1.4); bags(); g.restore(); return; }
    if (type === 'dots') { g.ell(0, 2, 3, 3.6, LN); g.restore(); return; }
    if (type === 'sleepy') { g.solid('M-15,2 C-10,6 8,6 16,2 C12,9 -8,11 -15,2Z', '#ffffff'); g.solid('M-6,4 C-4,8 6,8 8,4Z', c.eyeD); g.line('M-15,2 C-6,5 8,5 17,1', LN, 3.4 * lwm); bags(); g.restore(); return; }
    // open-family eyes
    const ir = F.ir || [1, 1], big = ({ wide: [7, 8.5], glare: [7, 8], blank: [0, 0], swirl: [0, 0] }[type] || (m ? [8, 10] : [9.5, 11.5])).map((v, i) => v * ir[i]);
    g.solid(WH, '#ffffff');
    g.save(); g.clip(WH);
    g.solid('M-17,-14 L19,-14 L19,-4 C8,-8 -8,-8 -17,-2Z', '#d4cbe8');
    if (type === 'swirl') { g.line('M1,1 m-2,0 a2,2 0 1 1 4,0 a4,4 0 1 1 -8,0 a6,6 0 1 1 12,0 a8,8 0 1 1 -16,0', c.eyeD, 1.8); }
    else if (type === 'blank') { g.ell(ix, 2, 1.8, 1.8, LN); }
    else {
      const [rx, ry] = big, hl = F.hl || 'twin', pu = F.pupil || 'round';
      g.ell(ix, 1, rx, ry, c.eye); g.solid(`M${ix - rx - 1},${1 - ry - 1} L${ix + rx + 1},${1 - ry - 1} L${ix + rx + 1},${f1(1 - ry * .15)} C${ix + rx * .4},${f1(1 - ry * .45)} ${ix - rx * .4},${f1(1 - ry * .45)} ${ix - rx - 1},${f1(1 - ry * .15)}Z`, c.eyeD);
      g.solid(`M${ix - rx * .8},${f1(1 + ry * .45)} Q${ix},${f1(1 + ry * 1.1)} ${ix + rx * .8},${f1(1 + ry * .45)} Q${ix},${f1(1 + ry * .75)} ${ix - rx * .8},${f1(1 + ry * .45)}Z`, c.eyeL);
      g.ring(ix, 1, rx, ry, c.eyeD, 1.4);
      if (type === 'star') { star(g, ix, 2, 6.5 * Math.min(ir[0], 1.15), '#fff7b0', 1.2, c.eyeD); g.ell(ix + 5, 7, 1.4, 1.4, '#ffffff'); }
      else if (type === 'heart') { g.fill(heartD(ix, 2, 5.4), '#ff4f7e', 1.2, '#ffffff'); g.ell(ix - 2, -1, 1.3, 1.3, '#ffffff'); }
      else {
        if (pu === 'slit') g.ell(ix, 1.5, rx * .17, ry * .88, c.eyeP);
        else if (pu === 'ring') { g.ell(ix, 2, rx * .4, ry * .46, c.eyeP); g.ring(ix, 2, rx * .64, ry * .68, c.eyeD, 1.3); }
        else if (pu === 'dot') g.ell(ix, 2, rx * .27, ry * .33, c.eyeP);
        else g.ell(ix, 2, rx * .42, ry * .5, c.eyeP);
        if (type !== 'shadow') {
          if (hl === 'star') { star4(g, ix - 3.4, -3.4, rx * .46, '#ffffff'); g.ell(ix + 4, 5.5, 1.3, 1.3, '#ffffff'); }
          else if (hl === 'hex') { let d = ''; for (let k = 0; k < 6; k++) { const an = k * TAU / 6; d += (k ? 'L' : 'M') + f1(ix - 3.4 + Math.cos(an) * rx * .36) + ',' + f1(-4 + Math.sin(an) * rx * .36); } g.solid(d + 'Z', '#ffffff'); }
          else if (hl === 'one') g.ell(ix - 3, -3.8, rx * .4, ry * .36, '#ffffff', 0, 0, -.35);
          else if (hl === 'cat') { g.ell(ix - 3, -2, rx * .17, ry * .5, '#ffffff'); g.ell(ix + 4, 5.5, 1.2, 1.2, '#ffffff'); }
          else if (hl === 'none') { /* flat, unlit eye */ }
          else { g.ell(ix - 3.6, -4.6, rx * .34, ry * .32, '#ffffff', 0, 0, -.35); g.ell(ix + 4, 5.5, 1.5, 1.5, '#ffffff'); if (t !== undefined && !m) g.ell(ix + 3.4, -5.6, 1, 1, '#ffffff'); }
        }
        else { g.alpha(1); g.solid('M-20,-20 L24,-20 L24,20 L-20,20Z', c.hairS); g.ell(ix, 2, 2.2, 2.2, c.eyeL); }
        if (type === 'teary') { g.solid('M-15,5 Q1,14 16,4 L16,12 L-15,12Z', '#bfe8ff'); g.ell(-6, -2, 1.4, 1.4, '#ffffff'); g.ell(7, 6, 1.8, 1.8, '#ffffff'); }
      }
    }
    g.restore();
    const ld = F.lid || 0, Y = ld * 5;
    if (type === 'narrow') lid('M-18,-22 L24,-22 L24,-5 C10,-4 -8,-2 -18,0Z', 'M-16,0 C-6,-3 8,-5 18,-6');
    else if (type === 'lidded') lid('M-18,-22 L24,-22 L24,-3 C10,-2 -8,-1 -18,1Z', 'M-16,1 C-6,-2 8,-3 19,-3');
    else if (type === 'glare') lid('M-18,-22 L24,-22 L24,-9 L-18,1Z', 'M-16,1 L19,-8');
    else if (type === 'determined') lid('M-18,-22 L24,-22 L24,-12 L-18,0Z', 'M-16,0 L19,-11');
    else if (type === 'sad') lid('M-18,-22 L24,-22 L24,-4 C10,-8 -6,-11 -18,-9Z', 'M-16,-9 C-6,-11 10,-8 19,-4');
    else if (type === 'soft') { g.solid('M-18,9 C-8,5 8,4 20,7 L20,16 L-18,16Z', c.skin); g.line('M-12,8 Q2,4 15,7', LN, 1.4); lash(); }
    else if (type === 'smileeye') { g.solid('M-18,11 C-8,1 8,0 20,6 L20,18 L-18,18Z', c.skin); g.line('M-13,10 C-4,3 8,3 17,6', LN, 1.5); lash(); }
    else if (type === 'wide') { lash(3); g.line('M-12,12 Q2,14 12,10', LN, 1.4); }
    else if (ld && (type === 'open' || type === 'star')) { lid(`M-18,-22 L24,-22 L24,${-8 + Y} C10,${-9 + Y} -8,${-9 + Y} -18,${-6 + Y}Z`, `M-16,${-6 + Y} C-6,${-9 + Y} 10,${-9 + Y} 19,${-8 + Y}`); if (!m) g.line('M16,' + (-8 + Y) + ' L22,' + (-12 + Y), LN, 2); }
    else lash();
    if (!['narrow', 'glare', 'determined', 'sad', 'soft', 'lidded', 'smileeye'].includes(type)) low();
    bags();
    g.restore();
  }
  const BROWS = {
    arch: { normal: 'M-13,-24 Q3,-29 18,-24', raised: 'M-13,-32 Q3,-37 18,-31', angry: 'M-13,-19 Q3,-24 18,-30', sad: 'M-13,-31 Q3,-29 18,-21', relaxed: 'M-13,-23 Q3,-26 18,-22' },
    flat: { normal: 'M-13,-25 Q3,-26 18,-24', raised: 'M-13,-33 Q3,-35 18,-32', angry: 'M-13,-20 Q3,-24 18,-31', sad: 'M-13,-30 Q3,-28 18,-22', relaxed: 'M-13,-24 Q3,-25 18,-23' },
    soft: { normal: 'M-12,-23 Q3,-28 17,-24', raised: 'M-12,-30 Q3,-36 17,-30', angry: 'M-12,-21 Q3,-25 17,-28', sad: 'M-12,-30 Q3,-30 17,-20', relaxed: 'M-12,-22 Q3,-26 17,-22' },
    angular: { normal: 'M-14,-22 L3,-29 L18,-24', raised: 'M-14,-30 L3,-38 L18,-31', angry: 'M-14,-18 L3,-24 L18,-31', sad: 'M-14,-32 L3,-29 L18,-19', relaxed: 'M-14,-22 L3,-27 L18,-22' }
  };
  function brow(g, c, cx, cy, flip, type) {
    const F = (c.face && c.face.brow) || EYE0, D = BROWS[F.shape || 'arch'] || BROWS.arch, k = F.len || 1;
    g.save(); g.tr(cx + (F.dx || 0) * (flip ? -1 : 1), cy - 4 + (F.y || 0) + (flip ? (F.dyL || 0) : (F.dyR || 0))); if (F.rot) g.rot(F.rot * (flip ? -1 : 1)); g.sc((flip ? -1.2 : 1.2) * k, 1.2);
    g.line(D[type] || D.normal, c.hairL, (c.body === 'f' ? 2.6 : 4) * (F.th || 1)); g.restore();
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
    pout: (g, c) => { g.line('M195,180 Q200,176 205,180', c.line, 2.2); g.line('M197,184 Q200,185 203,184', '#d98a92', 1.8); },
    // habits that make each face their own
    halfsmile: (g, c) => g.line('M193,181 Q200,182 205,179 Q209,177 211,173', c.line, 2.3),
    gentle: (g, c) => { g.line('M191,177 Q200,185 209,177', c.line, 2.3); g.line('M189,175 l-2,-2 M211,175 l2,-2', c.skinD, 1.5); },
    fang: (g, c) => { g.fill('M189,175 Q200,179 211,175 Q209,188 200,189 Q191,188 189,175Z', '#9c3448', 2); g.solid('M191,176 L209,176 L208,179 L192,179Z', '#ffffff'); g.fill('M192,177 l5,0 l-2.5,7Z', '#ffffff', 1.4); g.solid('M194,186 Q200,181 206,186 Q200,190 194,186Z', '#ff8e9c'); },
    grinwide: (g, c) => { g.fill('M183,172 Q200,177 217,172 Q215,197 200,198 Q185,197 183,172Z', '#9c3448', 2); g.solid('M185,173 L215,173 L214,180 L186,180Z', '#ffffff'); g.line('M200,173 L200,180', c.line, 1.1); g.solid('M191,190 Q200,182 209,190 Q200,196 191,190Z', '#ff8e9c'); },
    smallopen: (g, c) => g.fill('M195,177 Q200,179 205,177 Q204,184 200,185 Q196,184 195,177Z', '#9c3448', 1.8),
    bite: (g, c) => { g.line('M193,180 Q200,182 207,180', c.line, 2.2); g.fill('M196,180 l3,5 l3,-5Z', '#ffffff', 1.4); },
    tight: (g, c) => { g.line('M193,180 L207,180', c.line, 2.4); g.line('M193,180 l-1.5,-2 M207,180 l1.5,-2', c.line, 1.8); },
    hmm: (g, c) => g.line('M196,181 Q200,178 204,181 Q200,184 196,181', c.line, 2),
    smirkfang: (g, c) => { g.line('M192,181 Q202,183 210,174', c.line, 2.4); g.fill('M203,181 l4,-3 l0.5,6Z', '#ffffff', 1.3); }
  };
  const TALK = { small: 'open', tiny: 'open', smile: 'grin', frown: 'open', flat: 'open', cat: 'grin', smirk: 'open', wavy: 'o', pout: 'o', tongue: 'grin', grin: 'open', laugh: 'grin', open: 'small', sing: 'o', o: 'small', triangle: 'small', shout: 'open', teeth: 'shout', sob: 'open', halfsmile: 'small', gentle: 'open', fang: 'grin', grinwide: 'laugh', smallopen: 'open', bite: 'open', tight: 'open', hmm: 'smallopen', smirkfang: 'fang' };
  function star(g, cx, cy, r, col, lw = 1.4, lc) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * rr) + ',' + f1(cy + Math.sin(a) * rr); } g.fill(d + 'Z', col, lw, lc); }
  const heartD = (x, y, r) => `M${x},${y + r * .9} C${x - r * 1.6},${y - r * .2} ${x - r * .9},${y - r * 1.5} ${x},${y - r * .5} C${x + r * .9},${y - r * 1.5} ${x + r * 1.6},${y - r * .2} ${x},${y + r * .9}Z`;

  // manpu effects, animated by phase t (0..1)
  function manpu(g, c, k, t, pass) {
    const LN = c.line, tw = Math.sin(t * TAU), bob = Math.round(Math.sin(t * TAU) * 3), lo = pass === 'under';
    if (k.startsWith('blush')) {
      if (!lo) return;
      const b = c.blush || '#ff9aa6';
      if (k === 'blushfull') { g.ell(163, 165, 19, 8.5, b); g.ell(237, 165, 19, 8.5, b); g.ell(200, 160, 11, 4.5, b); for (const X of [150, 159, 168, 232, 241, 250]) g.line(`M${X},170 l5,-9`, '#e0527a', 1.6); return; }
      g.ell(166, 164, k === 'blush' ? 15 : 12, 5, b); g.ell(234, 164, k === 'blush' ? 15 : 12, 5, b);
      if (k === 'blush' && !(c.face && c.face.cheek === 'soft')) for (const X of [156, 164, 172, 226, 234, 242]) g.line(`M${X},168 l4,-7`, '#e0527a', 1.5);
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

  // ---------- everyday outfits (casual / formal / winter / yukata / suit), tailored to the anatomy ----------
  const OUTFITS = {
    hikari: { casual: { style: 'tee', col: '#ffd54a', col2: '#3a5ba8', legs: 'shorts', jacket: '#f4f6ff', print: 'bolt' }, formal: { style: 'dress', col: '#ffcf3f' }, winter: { style: 'coat', col: '#f4f6ff', col2: '#2b4fd6', mitten: '#2b4fd6' }, yukata: { style: 'yukata', col: '#2b4fd6', col2: '#ffc21a', col3: '#fff27a' } },
    rei: { casual: { style: 'cardigan', col: '#3a3050', col2: '#1d1a2b', col3: '#f0ecf8', legs: 'skirt', socks: '#1d1a2b' }, formal: { style: 'dress', col: '#4b2e7c' }, winter: { style: 'coat', col: '#1d1a2b', col2: '#a978ff', mitten: '#a978ff' }, yukata: { style: 'yukata', col: '#1d1a2b', col2: '#b99bff', col3: '#a978ff' } },
    mira: { casual: { style: 'blouse', col: '#fff4f8', col2: '#6fd1c4', legs: 'skirt' }, formal: { style: 'dress', col: '#ffb3cf' }, winter: { style: 'coat', col: '#fbfdff', col2: '#26c6a6', mitten: '#26c6a6' }, yukata: { style: 'yukata', col: '#ffe6ef', col2: '#26c6a6', col3: '#ff8fb8' } },
    kaede: { casual: { style: 'hoodie', col: '#2fbf7a', col2: '#1c1f24', legs: 'shorts' }, formal: { style: 'dress', col: '#1f8a58' }, winter: { style: 'coat', col: '#2fbf7a', col2: '#f4f7f5', mitten: '#f4f7f5' }, yukata: { style: 'yukata', col: '#dcffea', col2: '#1c1f24', col3: '#2fbf7a' } },
    sora: { casual: { style: 'blouse', col: '#ece6ff', col2: '#2b2f6b', legs: 'skirt', socks: '#ffffff' }, formal: { style: 'dress', col: '#2b2f6b', stars: 1 }, winter: { style: 'coat', col: '#ddd8f7', col2: '#ff6fae', mitten: '#ff6fae' }, yukata: { style: 'yukata', col: '#2b2f6b', col2: '#ff6fae', col3: '#ffd54a' } },
    tetsu: { casual: { style: 'tee', col: '#4a5240', col2: '#2a2b30', jacket: '#8a6a4a' }, formal: { style: 'suit' }, winter: { style: 'coat', col: '#6f7684', col2: '#ff8a2a' }, yukata: { style: 'yukata', col: '#3a4a6a', col2: '#1c1f2a', col3: '#9fb4d9' } },
    aya: { formal: { style: 'dress', col: '#c42a36' }, winter: { style: 'coat', col: '#23222c', col2: '#c42a36' }, casual: { style: 'cardigan', col: '#6a2a36', col2: '#23222c', col3: '#f4f4f8', legs: 'skirt' } },
    kyouya: { formal: { style: 'suit' }, casual: { style: 'hoodie', col: '#dfe8ee', col2: '#15161c' }, winter: { style: 'coat', col: '#dfe8ee', col2: '#7ff6ff' } },
    rin: { casual: { style: 'hoodie', col: '#ff9ad8', col2: '#2e3a52', legs: 'shorts' }, winter: { style: 'coat', col: '#e6f2ff', col2: '#5fe6ff', mitten: '#5fe6ff' }, yukata: { style: 'yukata', col: '#e6f2ff', col2: '#5fe6ff', col3: '#ff7ae0' } },
    shiori: { casual: { style: 'cardigan', col: '#233056', col2: '#1c2440', col3: '#f4f5fa', legs: 'skirt' }, formal: { style: 'dress', col: '#f4f5fa' }, winter: { style: 'coat', col: '#f4f5fa', col2: '#f2c14e', mitten: '#233056' }, yukata: { style: 'yukata', col: '#233056', col2: '#f2c14e', col3: '#f4f5fa' } },
    natsuki: { casual: { style: 'tee', col: '#ff8a3a', col2: '#3a3f52', legs: 'shorts' }, winter: { style: 'coat', col: '#ff8a3a', col2: '#fff4dc', mitten: '#3a3f52' }, formal: { style: 'dress', col: '#d8582a' }, yukata: { style: 'yukata', col: '#ffd566', col2: '#d8582a', col3: '#fff4dc' } },
    saeki: { formal: { style: 'suit' }, winter: { style: 'coat', col: '#2a2436', col2: '#b58aff' } },
    kuroda: { formal: { style: 'suit' }, winter: { style: 'coat', col: '#3a3d46', col2: '#b8bcc8' } }
  };
  function garment(g, c, A, o) {
    const male = c.body !== 'f', col = o.col || '#555', [cH, , cS, cD] = ramp(col, 7, 13), col2 = o.col2 || '#2a2b36', c2S = shade(col2, -1, 13), col3 = o.col3 || '#ffffff';
    const out = { sleeve: 'long', sleeveC: col, sleeveS: cS, cuff: cD };
    const pants = (pc, ps) => { wearLegs(g, A, pc, ps); g.save(); clipY(g, 468, 999); cel(g, A.torso, pc, ps); g.restore(); g.line(`M200,${A.crotch - 60} L200,${A.crotch}`, ps, 2); };
    const lower = () => {
      if (o.legs === 'shorts') { wearLegs(g, A, c.skin, c.skinS); shorts(g, A, col2, c2S, 604); }
      else if (o.legs === 'skirt') { wearLegs(g, A, c.skin, c.skinS); if (o.socks) wearLegs(g, A, o.socks, shade(o.socks, -1, 12), 650); skirt(g, A, col2, c2S, 470, 614, 24, 6); }
      else pants(col2, c2S);
    };
    const panels = (pc, ps, y1, gap = 14) => { g.save(); g.clip(A.torso); clipY(g, 0, y1); const pn = `M-60,250 L${200 - gap},250 L${200 - gap},${y1 + 2} L-60,${y1 + 2}Z`; mirror(g, () => cel(g, pn, pc, ps)); g.restore(); const [a, b] = A.span(y1); g.line(`M${f1(a)},${y1} L${f1(b)},${y1}`, g.LN, 2.4); };
    switch (o.style) {
      case 'tee': case 'hoodie':
        lower(); wearTorso(g, A, col, cS, 0, o.legs === 'skirt' ? 486 : 506);
        if (o.style === 'tee') { g.line('M180,278 Q200,296 220,278', cD, 3.4); out.sleeve = 'short'; }
        else { g.fill('M160,274 C166,244 234,244 240,274 C236,300 164,300 160,274Z', cH, 2.2); g.solid('M174,274 C180,260 220,260 226,274 C220,288 180,288 174,274Z', cS); g.line('M190,296 L186,346 M210,296 L214,346', '#f4f4f4', 2.2); const [a, b] = A.span(456); g.fill(`M${a + 18},440 L${b - 18},440 L${b - 8},490 L${a + 8},490Z`, cH, 2); }
        if (o.print === 'bolt') g.poly([[206, 390], [188, 422], [200, 422], [192, 452], [216, 416], [204, 416], [212, 390]], C_BLUE, 1.8);
        if (o.jacket) { const [jH, , jS] = ramp(o.jacket, 6, 13); panels(o.jacket, jS, 500, 24); out.sleeve = 'long'; out.sleeveC = o.jacket; out.sleeveS = jS; out.cuff = jS; }
        break;
      case 'cardigan':
        lower(); wearTorso(g, A, col3, shade(col3, -1, 10), 0, 490); g.fill('M186,272 L176,296 L198,292Z', '#ffffff', 1.6); g.fill('M214,272 L224,296 L202,292Z', '#ffffff', 1.6);
        panels(col, cS, 494, 22); [340, 390, 440].forEach(y => g.ell(176, y, 3.6, 3.6, cH, 1.4)); break;
      case 'blouse':
        lower(); wearTorso(g, A, col, cS, 0, 488);
        mirror(g, () => g.fill('M188,272 C170,280 162,300 180,306 C194,308 198,292 200,282Z', '#ffffff', 1.8));
        g.fill('M200,296 C186,284 172,290 178,304 C182,312 194,308 200,302 C206,308 218,312 222,304 C228,290 214,284 200,296Z', col2, 1.8); g.ell(200, 300, 4.6, 4.6, col2, 1.4);
        out.cuff = '#ffffff'; break;
      case 'dress': {
        if (male) return garment(g, c, A, { style: 'suit' });
        wearLegs(g, A, c.skin, c.skinS); wearTorso(g, A, c.skin, c.skinS, 0, 340);
        g.save(); g.clip(A.torso); clipY(g, 330, 470); cel(g, A.torso, col, cS); g.restore();
        g.fill(`M150,330 C176,320 190,336 200,340 C210,336 224,320 250,330`, col, 0); g.line('M148,332 C174,322 190,338 200,342 C210,338 226,322 252,332', g.LN, 2.4);
        skirt(g, A, col, cS, 456, 720, 70, 5);
        g.line('M176,276 Q200,300 224,276', '#ffd54a', 2.2); g.ell(200, 302, 5.6, 5.6, o.stars ? '#ffd54a' : '#ffffff', 1.6);
        if (o.stars) [[160, 540], [240, 580], [190, 660], [262, 690], [130, 680], [226, 500]].forEach(([a, b]) => star(g, a, b, 8, '#ffd54a', 1.4));
        out.sleeve = 'none'; out.cuff = null; break;
      }
      case 'suit': {
        pants('#16161e', '#0a0a10'); wearTorso(g, A, '#f4f4f8', '#cfcfd8', 0, 480);
        g.fill('M193,286 L200,292 L207,286 L205,390 L200,400 L195,390Z', o.tie || '#8a1e2a', 1.8);
        panels('#1c1c26', '#0e0e14', 486, 16);
        mirror(g, () => g.fill('M184,274 L158,330 L176,344 L168,358 L196,420 L196,300Z', '#26263a', 1.8));
        out.sleeveC = '#1c1c26'; out.sleeveS = '#0e0e14'; out.cuff = '#f4f4f8'; break;
      }
      case 'coat': {
        pants(male ? '#2a2b36' : '#3a3444', '#1c1a24');
        wearTorso(g, A, col, cS); skirt(g, A, col, cS, 470, 720, 20, 3);
        g.line('M200,290 L200,720', cD, 2); [340, 400, 460, 540, 620].forEach(y => { g.ell(186, y, 4.4, 4.4, cD); g.ell(214, y, 4.4, 4.4, cD); });
        g.fill(`M${A.span(462)[0]},456 L${A.span(462)[1]},456 L${A.span(470)[1]},474 L${A.span(470)[0]},474Z`, cD, 2);
        for (let i = 0; i < 9; i++) g.ell(154 + i * 11.5, 276 + Math.sin(i / 8 * Math.PI) * 16, 10, 10, '#f6f4f0', 1.4);
        g.fill('M162,266 C182,294 218,294 238,266 L246,286 C226,318 174,318 154,286Z', col2, 2); g.fill('M216,300 C232,340 236,390 230,450 L212,452 C216,396 208,350 198,312Z', col2, 2);
        out.cuff = '#f6f4f0'; out.glove = o.mitten || null; break;
      }
      case 'yukata': {
        wearTorso(g, A, col, cS); skirt(g, A, col, cS, 470, 720, 8, 2);
        [[160, 350], [244, 330], [184, 430], [258, 500], [150, 560], [230, 600], [176, 660], [250, 690]].forEach(([a, b]) => { for (let k = 0; k < 5; k++) g.ell(a + Math.cos(k * 1.256) * 5, b + Math.sin(k * 1.256) * 5, 4, 4, col3); g.ell(a, b, 2.6, 2.6, '#ffffff'); });
        g.line('M182,272 L208,372', '#f6f2ea', 8); g.line('M218,272 L196,360', cD, 8); g.line('M180,274 L206,376', c.line, 1.8);
        const [a, b] = A.span(440); g.fill(`M${a - 4},424 L${b + 4},424 L${b + 6},470 L${a - 6},470Z`, col2, 2.2); g.line(`M${a - 4},446 L${b + 4},446`, col3, 3.4);
        g.line('M200,470 L200,720', cD, 2); out.cuff = col; break;
      }
      default: return null;
    }
    return out;
  }

  // sitting, seen from the front: thighs foreshortened toward the viewer, knees together, shins hanging
  function sitLegs(g, c, A, of) {
    const col = of ? (of.legs === 'skirt' || of.legs === 'shorts' || of.style === 'dress' ? c.skin : of.col2 || '#2a2b36') : c.legC || c.skin, sh = shade(col, -1, 13);
    mirror(g, () => { cel(g, 'M150,610 L154,740 L186,740 L194,612Z', col, sh); cel(g, 'M134,540 C126,574 132,606 150,618 C168,628 190,622 197,604 L199,548Z', col, sh); });
  }

  // ---------- one frame ----------
  function drawChar(x, id, st) {
    const c = CAST[id]; if (!c) return null;
    const g = G(x, c.line); g.markLine(c.hairL);
    const A = ANAT[c.body], e = emoFor(c, st.emo), P = POSES[st.pose] || POSES.default, FC = c.face || {};
    const t = st.t, sw = Math.sin(t * TAU), cw = Math.cos(t * TAU), an = c.anim || {};
    const wind = st.wind || 1, a = { t, sway: sw * (an.hair || 1) * wind, sway2: Math.sin(t * TAU - 1) * (an.hair || 1) * wind, bob2: Math.sin(t * TAU * 2), frame: st.frame, spark: an.spark, hero: !(st.of && st.of !== 'hero' && OUTFITS[id] && OUTFITS[id][st.of]) };
    // body language: tilt, droop, lean, jolt, bounce, hop, shake, float
    let tilt = (P.tilt || 0) + (e.tilt || 0), dy = (e.droop || 0), dx = (P.lean || 0) + (e.lean || 0);
    if (e.sway) tilt += sw * 3 * e.sway;
    tilt += cw * (an.headSway || .8);
    if (e.shake) { const m = PX.motion('shake', st.frame, 6); dx += m[0] * 2.4 * e.shake; dy += m[1] * 2.4 * e.shake; }
    if (e.jolt) dy -= 5 * e.jolt * Math.max(0, cw);
    if (e.bob) dy -= Math.round(Math.abs(sw) * 3 * e.bob);
    if (e.hop) dy -= Math.round(Math.abs(Math.sin(t * TAU * 2)) * 9);
    if (P.cheer) dy -= Math.round(Math.abs(Math.sin(t * TAU * 2)) * 5);
    if (an.float) dy += Math.round(sw * 7);
    const breath = st.breath ? 2.4 * (an.breath || 1) : 0;
    const st2 = { t, frame: st.frame, lift: -(P.lift || 0), waveArm: P.waveArm, cheer: P.cheer, pump: P.pump, outfit: null };
    const of = st.of && st.of !== 'hero' && OUTFITS[id] && OUTFITS[id][st.of];
    const headRot = () => { x.translate(200, 244); x.rotate(tilt * Math.PI / 180); x.translate(-200, -244 - breath); };
    x.save(); x.translate(dx, dy);
    if (c.aura) c.aura(g, c, a, 'back');
    if (st.view !== 'back') { x.save(); headRot(); c.back && c.back(g, c, a, of); x.restore(); }
    // body
    x.save(); x.translate(0, breath * .5);
    const [n0, n1] = A.neck;
    cel(g, `M${n0},176 L${n0},286 Q200,294 ${n1},286 L${n1},176Z`, c.skin, c.skinS, 2.2, c.line, [-5, -2]);
    g.solid(`M${n0},206 Q200,236 ${n1},206 L${n1},226 Q200,248 ${n0},226Z`, c.skinS);
    if (A.chest) g.line('M172,296 Q184,302 194,298 M228,296 Q216,302 206,298', c.skinS, 1.6);
    const back = st.view === 'back';
    if (st.sit && !back) sitLegs(g, c, A, of);
    if (st.sit) { g.save(); clipY(g, -999, 572); }
    let o = of ? garment(g, c, A, of) : null;
    if (!o) o = c.outfit(g, c, A, a) || c.hero;
    if (st.sit) g.restore();
    if (back) { const bc = o.sleeveC || c.backC || c.skin; wearTorso(g, A, bc, shade(bc, -1, 13), 0, c.backY || 470); }
    else if (c.collar && !of) c.collar(g, c, a);
    st2.outfit = o;
    x.restore();
    if (back) {
      // seen from behind: arms, then the back of the head and all the hair over the shoulders
      x.save(); x.translate(0, breath * .5); arm(g, c, A, 'L', P.L, st2); arm(g, c, A, 'R', P.R, st2); x.restore();
      x.save(); headRot();
      g.ell(141, 160, 7, 13, c.skin, 2.2); g.ell(259, 160, 7, 13, c.skin, 2.2);
      cel(g, headD(c, A), c.hair, c.hairS, 2.4, c.hairL, [-8, -5]);
      c.back && c.back(g, c, a, of);
      const nape = c.shortHair ? 214 : 262, mass = `M132,150 C118,70 160,28 200,28 C240,28 282,70 268,150 C272,196 262,236 ${248 + a.sway * 3},${nape} L${152 + a.sway * 3},${nape} C138,236 128,196 132,150Z`;
      cel(g, mass, c.hair, c.hairS, 2.2, c.hairL, [-10, -6]); g.markLine(c.hairL);
      for (let k = 0; k < 7; k++) { const x0 = 150 + k * 17; g.line(`M${200 + (x0 - 200) * .3},40 C${x0},100 ${x0 + (x0 - 200) * .1},170 ${x0 + a.sway * 3 + (x0 - 200) * .12},${nape - 6}`, c.hairS, 2); }
      g.solid('M150,74 C170,48 190,40 200,40 C188,54 176,68 170,90Z', c.hairH); angelRing(g, c, 92);
      if (c.backAcc) c.backAcc(g, c, a);
      x.restore();
      if (c.aura) c.aura(g, c, a, 'front');
      x.restore();
      return g;
    }
    // head
    x.save(); headRot();
    const FE = FC.eye || {}, ex = [[A.eye[0][0] - (FE.gap || 0), A.eye[0][1] + (FE.y || 0)], [A.eye[1][0] + (FE.gap || 0), A.eye[1][1] + (FE.y || 0)], A.eye[2] * (FE.w || 1), A.eye[3] * (FE.h || 1)];
    g.ell(141, 160, 7, 13, c.skin, 2.2); g.ell(259, 160, 7, 13, c.skin, 2.2); g.line('M140,154 q3,6 0,12 M260,154 q-3,6 0,12', c.skinS, 1.6);
    cel(g, headD(c, A), c.skin, c.skinS, 2.6, c.line, [-8, -5]);
    g.solid(c.bangShadow || 'M146,100 L146,140 Q160,148 172,138 Q186,150 200,140 Q214,150 228,138 Q240,148 254,140 L254,100Z', c.skinS);
    if (c.faceExtra) c.faceExtra(g, c, a);
    const look = e.look || 0, ET = Array.isArray(e.e) ? e.e : [e.e, e.e], shut = ['happy', 'closed', 'flat', 'sleepy', 'dots'];
    const eyL = st.blink && !shut.includes(ET[0]) ? 'closed' : ET[0], eyR = st.blink && !shut.includes(ET[1]) ? 'closed' : ET[1];
    g.save(); g.tr(0, 20); (e.fx || []).forEach(k => manpu(g, c, k, t, 'under')); g.restore();
    const c2 = c.eye2 ? Object.assign({}, c, { eye: c.eye2, eyeD: c.eyeD2, eyeL: c.eyeL2, eyeP: shade(c.eyeD2, -1, 12) }) : c;
    const tn = st.turn || 0;
    [[ex[0], true, eyL, c, -1], [ex[1], false, eyR, c2, 1]].forEach(([[px, py], flip, ty, cc, sd]) => { g.save(); g.tr(px + tn * 13, py + (c.eyeDY || 0)); g.sc(ex[2] * (1 - Math.max(0, tn * sd) * .28), ex[3]); eye(g, cc, 0, 0, flip, ty, look + tn * 3, t); g.restore(); });
    g.save(); g.tr(tn * 16, 0);
    if (NOSE[FC.nose || 'std']) g.line(NOSE[FC.nose || 'std'], c.skinD, 2);
    let m = e.m; if (st.talk) m = TALK[m] || 'open';
    const [mx0, my0, ms0] = A.mouth, FM = FC.mouth || {}, mx = mx0 + (FM.dx || 0), my = my0 + (FM.y || 0), ms = ms0 * (FM.s || 1); g.save(); g.tr(mx, my); g.sc(ms); g.tr(-200, -180); (MOUTH[m] || MOUTH.small)(g, c); g.restore();
    if (FC.marks) FC.marks(g, c, a, e);
    if (c.facial) c.facial(g, c, a);
    g.restore();
    g.save(); g.tr(tn * 6, 0); c.front(g, c, a, of); g.restore();
    const bl = e.b === 'smug' ? 'normal' : e.b === 'worried' ? 'sad' : e.b, br = e.b === 'smug' ? 'raised' : e.b === 'worried' ? 'normal' : e.b;
    brow(g, c, ex[0][0] + tn * 13, ex[0][1] - 8, true, bl); brow(g, c, ex[1][0] + tn * 13, ex[1][1] - 8, false, br);
    if (c.glasses) c.glasses(g, c, a);
    x.restore();
    // arms
    x.save(); x.translate(0, breath * .5);
    arm(g, c, A, 'L', P.L, st2); arm(g, c, A, 'R', P.R, st2);
    if (c.overArms && !of) c.overArms(g, c, a);
    x.restore();
    x.save(); headRot(); g.tr(0, 20); (e.fx || []).forEach(k => manpu(g, c, k, t, 'over')); x.restore();
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
    const vb = portrait ? '100 20 200 220' : '0 0 400 720';
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

  return { CAST, EMO, POSES, OUTFITS, ANAT, garment, sprite, exportPxs, cel, clipY, wearTorso, wearLegs, skirt, shorts, mirror, fringe, limbPath, limbPts, prewarm, render, drawChar, keyOf, W, H, S, K, G, ribbon, hairLock, cap, angelRing, star, star4, heartD, garment, hiPaint };
})();

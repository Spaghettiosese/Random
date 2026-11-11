'use strict';
// Backgrounds and event CGs. Everything is drawn in code on a 640x360 pixel stage.
// Static layers are cached; each scene then adds its moving parts every frame.
(function () {
  const SW = 640, SH = 360, TAU = Math.PI * 2;
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const mk = (w = SW, h = SH) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x]; };
  const vgrad = (x, y0, y1, stops) => { const g = x.createLinearGradient(0, y0, 0, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; };
  const R = (x, c, a, b, w, h) => { x.fillStyle = c; x.fillRect(Math.round(a), Math.round(b), Math.round(w), Math.round(h)); };
  // Banded gradient: looks like pixel art instead of a smooth photo gradient.
  function bands(x, y0, y1, stops, n = 14) {
    const [c, cx] = mk(1, n); cx.fillStyle = vgrad(cx, 0, n, stops); cx.fillRect(0, 0, 1, n);
    const d = cx.getImageData(0, 0, 1, n).data, h = (y1 - y0) / n;
    for (let i = 0; i < n; i++) { x.fillStyle = `rgb(${d[i * 4]},${d[i * 4 + 1]},${d[i * 4 + 2]})`; x.fillRect(0, Math.floor(y0 + i * h), SW, Math.ceil(h) + 1); }
  }
  const cache = new Map();
  const cached = (key, fn) => { if (!cache.has(key)) { const [c, x] = mk(); fn(x); cache.set(key, c); } return cache.get(key); };

  // ---------------- sky + city ----------------
  const SKY = {
    day: { sky: ['#3f8fe0', '#74b8f0', '#b8e0f8', '#e8f6fc'], far: '#8fb0d8', mid: '#6788b8', near: '#40557f', win: '#cfe8ff', lit: .1, cloud: '#ffffff', sun: ['#fff8d8', 520, 60] },
    sunset: { sky: ['#3a2a6a', '#8a3a7a', '#e8605a', '#ffb060', '#ffe090'], far: '#a0507a', mid: '#6a3564', near: '#3a2048', win: '#ffd890', lit: .35, cloud: '#ffb0a0', sun: ['#fff0b0', 430, 200] },
    night: { sky: ['#0a0a24', '#141840', '#26306a', '#3c4a8a'], far: '#1c2452', mid: '#141a3c', near: '#0a0e24', win: '#ffe6a0', lit: .5, cloud: '#2a3470', stars: 1, moon: [500, 62] },
    attack: { sky: ['#1a0612', '#4a0a20', '#8a1a2a', '#c8482a'], far: '#3a0e22', mid: '#24081a', near: '#12040e', win: '#ff9a50', lit: .25, cloud: '#5a1424', stars: 0 },
  };
  function skyline(x, r, baseY, minH, maxH, col, win, lit, wMin = 18, wMax = 44) {
    let px = -10;
    while (px < SW + 10) {
      const w = wMin + r() * (wMax - wMin) | 0, h = minH + r() * (maxH - minH) | 0;
      R(x, col, px, baseY - h, w, h + 4);
      if (r() < .35) R(x, col, px + w * .3, baseY - h - 6 - r() * 8, 3, 14);
      if (r() < .3) R(x, col, px + 4, baseY - h - 4, w - 8, 4);
      if (win) for (let wy = baseY - h + 5; wy < baseY - 4; wy += 7) for (let wx = px + 3; wx < px + w - 4; wx += 6) if (r() < lit) R(x, win, wx, wy, 3, 4);
      px += w + (r() < .25 ? 4 : 0);
    }
  }
  function tower(x, cx, baseY, s) {
    // AEGIS tower: the landmark you can see from everywhere in the city
    R(x, s.mid, cx - 13, baseY - 150, 26, 154); R(x, s.near, cx - 9, baseY - 176, 18, 30); R(x, s.near, cx - 2, baseY - 206, 4, 32);
    R(x, s.win, cx - 11, baseY - 150, 2, 150); R(x, s.win, cx + 9, baseY - 150, 2, 150);
    for (let y = baseY - 144; y < baseY - 8; y += 9) R(x, s.win, cx - 7, y, 14, 3);
    x.strokeStyle = '#58d6ff'; x.lineWidth = 3; x.beginPath(); x.ellipse(cx, baseY - 160, 26, 7, 0, 0, TAU); x.stroke();
  }
  function cityStatic(kind, horizon) {
    return cached('city' + kind + horizon, x => {
      const s = SKY[kind], r = rng(7);
      bands(x, 0, horizon + 10, s.sky, 18);
      if (s.stars) for (let i = 0; i < 90; i++) R(x, r() < .2 ? '#ffffff' : '#9aa8e8', r() * SW, r() * horizon * .8, 1, 1);
      if (s.moon) { x.fillStyle = '#fff6d8'; x.beginPath(); x.arc(s.moon[0], s.moon[1], 22, 0, TAU); x.fill(); x.fillStyle = '#e6dcb0'; x.beginPath(); x.arc(s.moon[0] + 6, s.moon[1] - 4, 5, 0, TAU); x.arc(s.moon[0] - 8, s.moon[1] + 7, 3, 0, TAU); x.fill(); }
      if (s.sun) { x.fillStyle = s.sun[0]; x.globalAlpha = .35; x.beginPath(); x.arc(s.sun[1], s.sun[2], 44, 0, TAU); x.fill(); x.globalAlpha = 1; x.beginPath(); x.arc(s.sun[1], s.sun[2], 26, 0, TAU); x.fill(); }
      skyline(x, r, horizon, 30, 80, s.far, null, 0, 14, 30);
      tower(x, 318, horizon, s);
      skyline(x, r, horizon + 6, 20, 110, s.mid, s.win, s.lit * .6);
      skyline(x, r, horizon + 16, 14, 66, s.near, s.win, s.lit, 30, 70);
    });
  }
  const clouds = (x, t, col, y0, n = 5, sp = 5) => { x.fillStyle = col; for (let i = 0; i < n; i++) { const cx = ((i * 173 + t * sp * (1 + i % 3 * .3)) % (SW + 160)) - 80, cy = y0 + (i * 37) % 70, w = 50 + (i * 29) % 40;
    x.fillRect(cx | 0, cy, w, 6); x.fillRect((cx | 0) + 8, cy - 5, w - 22, 5); x.fillRect((cx | 0) + 14, cy + 6, w - 30, 3); } };
  function cityAnim(x, t, kind, horizon) {
    const s = SKY[kind];
    if (s.stars) for (let i = 0; i < 14; i++) { const a = Math.sin(t * 2 + i * 1.7); if (a > .3) R(x, '#ffffff', (i * 97) % SW, (i * 53) % (horizon * .7), 2, 2); }
    x.globalAlpha = kind === 'day' ? .9 : .5; clouds(x, t, s.cloud, 30); x.globalAlpha = 1;
    // beacon on the tower
    const b = .5 + .5 * Math.sin(t * 3); x.globalAlpha = b; R(x, '#ff5a6a', 316, horizon - 210, 4, 4); x.globalAlpha = b * .3; R(x, '#ff5a6a', 312, horizon - 214, 12, 12); x.globalAlpha = 1;
  }
  function riftSky(x, t, cx = 330, cy = 70, sc = 1) {
    // a tear in the sky, pulsing
    const p = .7 + .3 * Math.sin(t * 4);
    x.save(); x.translate(cx, cy); x.scale(sc, sc);
    for (const [c, k] of [['#ff2a6a', 1.5], ['#ff9ad0', 1], ['#ffffff', .45]]) { x.fillStyle = c; x.globalAlpha = k === 1.5 ? .35 * p : 1; x.beginPath();
      const pts = [[-90, -6], [-50, -14], [-30, -4], [-8, -22], [10, -8], [40, -18], [86, -2], [44, 6], [16, 20], [-4, 6], [-34, 14], [-56, 4]];
      pts.forEach((q, i) => { const X0 = q[0] * (k === 1.5 ? 1.12 : 1), Y0 = q[1] * k * (1 + .08 * Math.sin(t * 6 + i)); i ? x.lineTo(X0, Y0) : x.moveTo(X0, Y0); }); x.closePath(); x.fill(); }
    x.restore(); x.globalAlpha = 1;
  }
  const embers = (x, t, n = 40, col = '#ffb040') => { for (let i = 0; i < n; i++) { const life = (t * (.25 + (i % 5) * .06) + i * .137) % 1, ex = (i * 71 + Math.sin(t + i) * 14) % SW, ey = SH - life * (SH + 20);
    x.globalAlpha = 1 - life; R(x, i % 3 ? col : '#ff5a2a', ex, ey, i % 4 ? 2 : 3, i % 4 ? 2 : 3); } x.globalAlpha = 1; };
  const smoke = (x, t, cx, base) => { for (let i = 0; i < 9; i++) { const l = (t * .12 + i / 9) % 1, r = 8 + l * 26; x.globalAlpha = .55 * (1 - l); x.fillStyle = '#1a0a14'; x.beginPath(); x.arc(cx + Math.sin(l * 5 + i) * 14 + l * 30, base - l * 150, r, 0, TAU); x.fill(); } x.globalAlpha = 1; };

  function street(x, kind) {
    // foreground: guard rail + road, so characters have somewhere to stand
    const s = SKY[kind]; R(x, s.near, 0, 300, SW, 60); R(x, '#00000040', 0, 300, SW, 3);
    R(x, s.mid, 0, 276, SW, 4); for (let i = 0; i < SW; i += 32) R(x, s.mid, i + 10, 280, 4, 22);
    R(x, s.mid, 0, 322, SW, 2);
    for (let i = 0; i < SW; i += 70) R(x, kind === 'day' ? '#e8f0ff' : s.win, i + 12, 340, 34, 3);
  }

  // ---------------- interiors ----------------
  const TOD = ['day', 'sunset', 'night'];
  function windowView(x, wx, wy, w, h, tod, seed = 3) {
    const s = SKY[TOD[tod]], r = rng(seed);
    x.save(); x.beginPath(); x.rect(wx, wy, w, h); x.clip();
    const n = 8; for (let i = 0; i < n; i++) { const [c, cx] = mk(1, n); cx.fillStyle = vgrad(cx, 0, n, s.sky); cx.fillRect(0, 0, 1, n); const d = cx.getImageData(0, i, 1, 1).data; R(x, `rgb(${d[0]},${d[1]},${d[2]})`, wx, wy + i * h / n, w, h / n + 1); }
    if (s.stars) for (let i = 0; i < 16; i++) R(x, '#ffffff', wx + r() * w, wy + r() * h * .6, 1, 1);
    let px = wx - 4; while (px < wx + w) { const bw = 10 + r() * 16 | 0, bh = h * (.2 + r() * .4) | 0; R(x, s.mid, px, wy + h - bh, bw, bh); for (let yy = wy + h - bh + 3; yy < wy + h - 2; yy += 6) for (let xx = px + 2; xx < px + bw - 3; xx += 5) if (r() < s.lit) R(x, s.win, xx, yy, 2, 3); px += bw + 1; }
    x.restore();
  }
  const tint = (x, tod) => { if (tod === 1) { x.fillStyle = '#ff7a3018'; x.fillRect(0, 0, SW, SH); } if (tod === 2) { x.fillStyle = '#0a103858'; x.fillRect(0, 0, SW, SH); } };
  const plant = (x, px, py) => { R(x, '#d8d0c8', px - 8, py - 16, 16, 16); R(x, '#b0a8a0', px - 8, py - 4, 16, 4); x.fillStyle = '#3a9a5a'; for (let i = -3; i <= 3; i++) { x.beginPath(); x.ellipse(px + i * 5, py - 30 - (3 - Math.abs(i)) * 6, 4, 16, i * .25, 0, TAU); x.fill(); } x.fillStyle = '#2a7a48'; for (let i = -2; i <= 2; i++) { x.beginPath(); x.ellipse(px + i * 6 + 2, py - 24, 3, 10, i * .3, 0, TAU); x.fill(); } };
  const emblem = (x, cx, cy, s, col = '#58d6ff') => { x.fillStyle = col; x.beginPath(); x.moveTo(cx, cy - 14 * s); x.lineTo(cx + 12 * s, cy - 8 * s); x.lineTo(cx + 10 * s, cy + 6 * s); x.lineTo(cx, cy + 15 * s); x.lineTo(cx - 10 * s, cy + 6 * s); x.lineTo(cx - 12 * s, cy - 8 * s); x.closePath(); x.fill();
    x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(cx, cy - 7 * s); x.lineTo(cx + 2.4 * s, cy - 2 * s); x.lineTo(cx + 7 * s, cy - 1 * s); x.lineTo(cx + 3 * s, cy + 2.5 * s); x.lineTo(cx + 4.5 * s, cy + 8 * s); x.lineTo(cx, cy + 5 * s); x.lineTo(cx - 4.5 * s, cy + 8 * s); x.lineTo(cx - 3 * s, cy + 2.5 * s); x.lineTo(cx - 7 * s, cy - 1 * s); x.lineTo(cx - 2.4 * s, cy - 2 * s); x.closePath(); x.fill(); };

  const INT = {
    lobby(x, tod) {
      bands(x, 0, 250, ['#dfe6f4', '#c6d0e6', '#aab6d4'], 8);
      for (let i = 0; i < 4; i++) { const wx = 24 + i * 156; R(x, '#5a6890', wx - 4, 26, 132, 200); windowView(x, wx, 30, 124, 192, tod, 3 + i); R(x, '#5a6890', wx + 60, 30, 4, 192); R(x, '#5a6890', wx, 120, 124, 3); x.fillStyle = '#ffffff22'; x.beginPath(); x.moveTo(wx + 10, 30); x.lineTo(wx + 40, 30); x.lineTo(wx + 10, 110); x.closePath(); x.fill(); }
      for (const px of [146, 302, 458]) { R(x, '#eef2fa', px - 4, 0, 30, 250); R(x, '#c2cce2', px + 20, 0, 6, 250); }
      bands(x, 250, 360, ['#7c88ac', '#59648a', '#3c4466'], 6);
      for (let i = -8; i < 18; i++) { x.strokeStyle = '#ffffff18'; x.lineWidth = 1; x.beginPath(); x.moveTo(320 + (i * 40 - 180) * .5, 250); x.lineTo(i * 80 - 300, 360); x.stroke(); }
      for (const y of [262, 282, 314]) R(x, '#ffffff14', 0, y, SW, 1);
      // reception desk + logo wall
      R(x, '#2c3458', 236, 214, 168, 50); R(x, '#58d6ff', 236, 214, 168, 3); R(x, '#3a4470', 244, 226, 152, 30); emblem(x, 320, 240, .8);
      R(x, '#2c3458', 262, 60, 116, 46); R(x, '#58d6ff', 262, 104, 116, 2); emblem(x, 284, 83, 1.1);
      x.fillStyle = '#ffffff'; x.font = 'bold 15px monospace'; x.fillText('AEGIS', 304, 81); x.fillStyle = '#9ab0e0'; x.font = '8px monospace'; x.fillText('HERO AGENCY', 304, 94);
      plant(x, 40, 268); plant(x, 600, 268); tint(x, tod);
    },
    office(x, tod) {
      bands(x, 0, 240, ['#e8dccc', '#dccdb8', '#c8b69c'], 6); R(x, '#8a6a4c', 0, 236, SW, 8);
      R(x, '#6a5038', 360, 40, 220, 150); windowView(x, 368, 48, 204, 134, tod, 11);
      for (let y = 48; y < 182; y += 9) R(x, '#f4ece0', 368, y, 204, tod === 2 ? 6 : 2);
      R(x, '#6a5038', 468, 48, 4, 134);
      // shelf, poster, board
      R(x, '#7a5a3e', 40, 50, 150, 150); for (let s = 0; s < 3; s++) { R(x, '#5a4028', 46, 58 + s * 48, 138, 40); const r = rng(20 + s); let bx = 50; while (bx < 174) { const bw = 5 + r() * 6 | 0, bh = 22 + r() * 14 | 0; R(x, ['#e0546a', '#58a6e0', '#f0c050', '#6ac08a', '#b07aff', '#f4f0e8'][r() * 6 | 0], bx, 98 + s * 48 - bh, bw, bh); bx += bw + 1; } }
      R(x, '#2c3458', 226, 60, 100, 76); R(x, '#f4f6fc', 230, 64, 92, 68); emblem(x, 276, 92, 1.2, '#e0546a'); R(x, '#2c3458', 244, 116, 64, 4); R(x, '#8a94b8', 252, 124, 48, 3);
      bands(x, 244, 360, ['#a8845c', '#8a6a48', '#6a5036'], 5);
      // desk
      R(x, '#5a4030', 140, 262, 380, 14); R(x, '#4a3426', 150, 276, 360, 84); R(x, '#3a281c', 150, 276, 360, 4); R(x, '#5a4030', 330, 290, 80, 40); R(x, '#d8c080', 364, 306, 12, 4);
      R(x, '#22263a', 250, 198, 110, 60); R(x, '#22263a', 296, 256, 18, 8); R(x, '#f0c050', 420, 244, 30, 18); R(x, '#f4f0e8', 424, 240, 22, 6);
      R(x, '#f4f0e8', 166, 250, 44, 12); R(x, '#e0e4f0', 170, 246, 44, 6); plant(x, 606, 250); tint(x, tod);
    },
    training(x, tod) {
      bands(x, 0, 230, ['#161c36', '#1e2748', '#28345e'], 7);
      for (let i = 0; i < 9; i++) { const px = i * 76 - 14; R(x, '#313f72', px, 24, 68, 196); R(x, '#26325c', px + 4, 28, 60, 188); R(x, '#58d6ff', px, 220, 68, 2); R(x, '#3a4a84', px + 12, 44, 44, 4); R(x, '#3a4a84', px + 12, 190, 44, 4); }
      for (const lx of [100, 320, 540]) { R(x, '#dff6ff', lx - 40, 6, 80, 6); x.fillStyle = '#58d6ff14'; x.beginPath(); x.moveTo(lx - 40, 12); x.lineTo(lx + 40, 12); x.lineTo(lx + 110, 230); x.lineTo(lx - 110, 230); x.closePath(); x.fill(); }
      bands(x, 230, 360, ['#2a3560', '#1e2748', '#141a34'], 6);
      x.strokeStyle = '#58d6ff55'; x.lineWidth = 1; for (let i = -10; i <= 26; i++) { x.beginPath(); x.moveTo(320 + (i - 8) * 22, 230); x.lineTo(320 + (i - 8) * 80, 360); x.stroke(); }
      for (const y of [240, 256, 280, 316]) R(x, '#58d6ff40', 0, y, SW, 1);
      x.strokeStyle = '#ffd766'; x.lineWidth = 2; x.beginPath(); x.ellipse(320, 304, 190, 34, 0, 0, TAU); x.stroke();
      emblem(x, 320, 100, 1.6, '#3a4a84'); tint(x, tod === 2 ? 2 : 0);
    },
    lounge(x, tod) {
      bands(x, 0, 240, ['#f6e4d4', '#f0d6c2', '#e6c4ac'], 6); R(x, '#c89878', 0, 150, SW, 4); R(x, '#ead0b8', 0, 154, SW, 86);
      R(x, '#8a6048', 60, 36, 190, 104); windowView(x, 66, 42, 178, 92, tod, 31); R(x, '#8a6048', 152, 42, 4, 92);
      // vending machines
      R(x, '#e0546a', 470, 70, 62, 176); R(x, '#fff0f0', 476, 78, 50, 78); for (let r0 = 0; r0 < 3; r0++) for (let c0 = 0; c0 < 4; c0++) R(x, ['#58d6ff', '#ffd766', '#6ac08a', '#ff9a50'][(r0 + c0) % 4], 480 + c0 * 12, 84 + r0 * 24, 7, 16);
      R(x, '#22263a', 476, 164, 50, 22); R(x, '#22263a', 484, 204, 34, 24); R(x, '#3a6ad0', 540, 70, 62, 176); R(x, '#e8f2ff', 546, 78, 50, 78); for (let r0 = 0; r0 < 3; r0++) for (let c0 = 0; c0 < 4; c0++) R(x, ['#f4f0e8', '#ff9ab0', '#b07aff', '#6ac08a'][(r0 * 2 + c0) % 4], 550 + c0 * 12, 84 + r0 * 24, 7, 16); R(x, '#22263a', 554, 204, 34, 24);
      bands(x, 244, 360, ['#b88868', '#a07454', '#805a40'], 5);
      for (let i = 0; i < SW; i += 40) R(x, '#00000014', i, 244, 1, 116);
      // sofa + table
      R(x, '#4a6ab0', 70, 190, 260, 60); R(x, '#5a7cc8', 78, 180, 244, 44); R(x, '#3a5494', 70, 236, 260, 22); R(x, '#5a7cc8', 60, 204, 22, 54); R(x, '#5a7cc8', 318, 204, 22, 54);
      R(x, '#ffd766', 110, 196, 34, 26); R(x, '#ff9ab0', 262, 196, 34, 26);
      R(x, '#7a5a40', 150, 268, 140, 8); R(x, '#5a4030', 160, 276, 6, 30); R(x, '#5a4030', 274, 276, 6, 30); R(x, '#f4f0e8', 196, 258, 12, 10); R(x, '#e0546a', 226, 260, 24, 8);
      plant(x, 400, 250); R(x, '#f4f0e8', 330, 60, 60, 44); R(x, '#ff9ab0', 336, 66, 48, 20); R(x, '#8a94b8', 336, 92, 40, 3); tint(x, tod);
    },
    command(x) {
      bands(x, 0, 360, ['#060a1c', '#0c1430', '#121c40'], 8);
      R(x, '#0e1838', 60, 24, 520, 190); R(x, '#58d6ff', 60, 24, 520, 2); R(x, '#58d6ff', 60, 212, 520, 2);
      x.strokeStyle = '#58d6ff30'; x.lineWidth = 1; for (let i = 0; i < 14; i++) { x.beginPath(); x.moveTo(60 + i * 40, 26); x.lineTo(60 + i * 40, 212); x.stroke(); } for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(60, 26 + i * 37); x.lineTo(580, 26 + i * 37); x.stroke(); }
      // city map blobs
      const r = rng(99); x.fillStyle = '#2a5a9a'; for (let i = 0; i < 26; i++) { const bx = 90 + r() * 440, by = 44 + r() * 140; x.fillRect(bx | 0, by | 0, 14 + r() * 40 | 0, 8 + r() * 22 | 0); }
      x.fillStyle = '#3a7ac8'; for (let i = 0; i < 20; i++) { const bx = 90 + r() * 440, by = 44 + r() * 140; x.fillRect(bx | 0, by | 0, 6 + r() * 16 | 0, 4 + r() * 10 | 0); }
      for (const [px, w] of [[10, 44], [586, 44]]) { R(x, '#0e1838', px, 60, w, 120); R(x, '#58d6ff', px, 60, w, 2); for (let i = 0; i < 9; i++) R(x, i % 3 ? '#3a7ac8' : '#ffd766', px + 6, 70 + i * 12, 10 + (i * 7) % 24, 3); }
      R(x, '#1a2450', 0, 250, SW, 110); R(x, '#58d6ff', 0, 250, SW, 2);
      for (let i = 0; i < 5; i++) { const px = 30 + i * 124; R(x, '#0e1838', px, 262, 96, 50); R(x, '#26386c', px + 4, 266, 88, 30); for (let k = 0; k < 6; k++) R(x, ['#58d6ff', '#ff5a6a', '#ffd766'][k % 3], px + 8 + k * 14, 302, 8, 4); }
    },
    rooftop(x, tod) {
      x.drawImage(cityStatic(TOD[tod], 236), 0, 0);
      const s = SKY[TOD[tod]];
      const fl = tod === 0 ? ['#b8c0d0', '#98a2b8'] : tod === 1 ? ['#a86a70', '#7a4a5e'] : ['#2c345c', '#1e2444'];
      R(x, fl[0], 0, 270, SW, 90); R(x, fl[1], 0, 270, SW, 4); for (let i = 0; i < SW; i += 64) R(x, fl[1], i, 274, 1, 86); for (const y of [300, 334]) R(x, fl[1], 0, y, SW, 1);
      // railing
      R(x, s.near, 0, 214, SW, 5); R(x, s.near, 0, 240, SW, 3); for (let i = 0; i < SW; i += 26) R(x, s.near, i + 6, 214, 3, 58);
      // water tank + vent
      R(x, s.near, 520, 150, 80, 90); R(x, s.mid, 526, 156, 68, 78); R(x, s.near, 530, 236, 6, 36); R(x, s.near, 584, 236, 6, 36); R(x, s.near, 514, 144, 92, 8);
      R(x, s.near, 30, 232, 60, 40); R(x, s.mid, 36, 238, 48, 6); R(x, s.mid, 36, 250, 48, 6);
    },
  };

  // ---------------- public background table ----------------
  const BG = {
    black: (x) => R(x, '#05050c', 0, 0, SW, SH),
    white: (x) => R(x, '#f8f8ff', 0, 0, SW, SH),
  };
  for (const k of ['day', 'sunset', 'night', 'attack']) BG['city_' + k] = (x, t) => {
    x.drawImage(cached('street' + k, c => { c.drawImage(cityStatic(k, 262), 0, 0); street(c, k); }), 0, 0); cityAnim(x, t, k, 262);
    if (k === 'attack') { riftSky(x, t); smoke(x, t, 120, 250); smoke(x, t + 3, 520, 240); embers(x, t); }
  };
  for (const k of Object.keys(INT)) for (let tod = 0; tod < 3; tod++) BG[k + '@' + tod] = (x, t) => {
    x.drawImage(cached(k + tod, c => INT[k](c, tod)), 0, 0);
    if (k === 'rooftop') cityAnim(x, t, TOD[tod], 236);
    if (k === 'lobby') { const b = Math.floor(t * 2) % 8; R(x, '#58d6ff', 268 + b * 13, 100, 8, 2); }
    if (k === 'office') { R(x, '#58d6ff', 254, 202, 102, 52); for (let i = 0; i < 6; i++) R(x, '#e8fbff', 258, 206 + i * 8, 20 + ((i * 37 + Math.floor(t * 2) * 13) % 70), 3); if (tod === 2) { x.fillStyle = '#58d6ff14'; x.fillRect(200, 150, 210, 130); } }
    if (k === 'training') for (let i = 0; i < 3; i++) { const tx = 130 + i * 190, ty = 130 + Math.sin(t * 1.5 + i * 2) * 10; x.strokeStyle = ['#ff5a6a', '#ffd766', '#58d6ff'][i]; x.lineWidth = 2; for (const r of [20, 12, 4]) { x.beginPath(); x.arc(tx, ty, r, 0, TAU); x.stroke(); } }
    if (k === 'lounge') { x.globalAlpha = .5 + .5 * Math.sin(t * 5) * (Math.sin(t * .7) > .9 ? 1 : 0); R(x, '#ffffff', 476, 78, 50, 3); x.globalAlpha = 1; }
    if (k === 'command') { const sx = 60 + (t * 60) % 520; x.fillStyle = '#58d6ff'; x.globalAlpha = .5; x.fillRect(sx, 26, 2, 186); x.globalAlpha = 1;
      for (let i = 0; i < 7; i++) { const px = 110 + (i * 149) % 420, py = 50 + (i * 67) % 130, p = (t * 1.2 + i * .37) % 1; x.strokeStyle = i % 3 ? '#ffd766' : '#ff5a6a'; x.globalAlpha = 1 - p; x.lineWidth = 1.5; x.beginPath(); x.arc(px, py, 2 + p * 12, 0, TAU); x.stroke(); x.globalAlpha = 1; R(x, i % 3 ? '#ffd766' : '#ff5a6a', px - 1, py - 1, 3, 3); } }
  };

  // ---------------- rift beasts ----------------
  function beast(x, cx, cy, s, t, hurt = 0) {
    x.save(); x.translate(cx, cy); x.scale(s, s);
    const w = Math.sin(t * 2) * 2;
    x.fillStyle = hurt > 0 ? '#ffffff' : '#0c0414'; x.beginPath();
    const pts = [[-70, 60], [-78, 10], [-60, -30], [-66, -64 + w], [-44, -44], [-30, -84 + w], [-14, -50], [6, -96 - w], [20, -52], [44, -80 + w], [50, -40], [74, -52], [70, -6], [84, 30], [70, 60]];
    pts.forEach((q, i) => i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1])); x.closePath(); x.fill();
    x.strokeStyle = '#ff2a6a'; x.lineWidth = 2; x.stroke();
    if (hurt <= 0) {
      const g = .6 + .4 * Math.sin(t * 5);
      x.fillStyle = '#ff2a6a'; x.globalAlpha = .35 * g; x.beginPath(); x.ellipse(-24, -8, 18, 12, .3, 0, TAU); x.ellipse(28, -8, 18, 12, -.3, 0, TAU); x.fill(); x.globalAlpha = 1;
      x.fillStyle = '#ff9ad0'; x.beginPath(); x.moveTo(-38, -14); x.lineTo(-10, -4); x.lineTo(-16, 4); x.lineTo(-36, -2); x.closePath(); x.moveTo(42, -14); x.lineTo(14, -4); x.lineTo(20, 4); x.lineTo(40, -2); x.closePath(); x.fill();
      x.fillStyle = '#ffffff'; x.fillRect(-26, -8, 5, 4); x.fillRect(24, -8, 5, 4);
      x.strokeStyle = '#ff2a6a'; x.lineWidth = 2; x.beginPath(); x.moveTo(-30, 26); for (let i = 0; i <= 8; i++) x.lineTo(-30 + i * 7.5, 26 + (i % 2 ? 9 : 0) + Math.sin(t * 3) * 1.5); x.stroke();
      x.strokeStyle = '#ff2a6a80'; x.beginPath(); x.moveTo(-60, 50); x.lineTo(-50, 30); x.lineTo(-58, 14); x.moveTo(60, 50); x.lineTo(54, 26); x.lineTo(64, 12); x.stroke();
    }
    x.restore();
  }

  // ---------------- CGs ----------------
  const P = (id, e, pose, sc, blink) => AHChars.portrait(id, e, pose, blink, false, sc);
  const blinkAt = (t, o = 0) => ((t + o) % 4.2) < .14;
  function speedLines(x, t, cx, cy, col, n = 46) {
    x.fillStyle = col; for (let i = 0; i < n; i++) { const a = i / n * TAU + Math.floor(t * 12) * .37, r0 = 150 + ((i * 53) % 60), w = .012 + (i % 3) * .006;
      x.beginPath(); x.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); x.lineTo(cx + Math.cos(a - w) * 700, cy + Math.sin(a - w) * 700); x.lineTo(cx + Math.cos(a + w) * 700, cy + Math.sin(a + w) * 700); x.fill(); }
  }
  const motes = (x, t, col, n = 34) => { for (let i = 0; i < n; i++) { const l = (t * (.05 + (i % 4) * .02) + i * .21) % 1, px = (i * 89 + Math.sin(t * .6 + i) * 30 + l * 60) % SW, py = SH - l * SH * 1.1 + Math.sin(t + i) * 6;
    x.globalAlpha = Math.sin(l * Math.PI) * .9; R(x, col, px, py, i % 5 ? 2 : 3, i % 5 ? 2 : 3); } x.globalAlpha = 1; };
  const letterbox = x => { R(x, '#05050c', 0, 0, SW, 22); R(x, '#05050c', 0, SH - 22, SW, 22); };
  function sprite(x, id, anim, t, px, py, size, flip, opts) {
    const o = Object.assign({ size }, id === 'you' ? AHChars.YOU_CHIBI : AHChars.CHARS[id].chibi, opts || {}), sh = MoonkaiPixel.sheet(o, anim), f = sh.frames[Math.floor(t * sh.fps) % sh.n];
    x.save(); x.translate(Math.round(px), Math.round(py)); if (flip) x.scale(-1, 1); x.drawImage(f, -f.width / 2, -f.height); x.restore();
  }

  const CG = {
    // Prologue: the sky tears open over the evening commute.
    rift(x, t) {
      x.drawImage(cityStatic('attack', 262), 0, 0); cityAnim(x, t, 'attack', 262);
      const z = Math.min(1, t / 3); riftSky(x, t, 320, 80, .4 + z * 1.1);
      x.globalAlpha = Math.min(1, t / 2); beast(x, 320, 250 - z * 20, 1.5, t); x.globalAlpha = 1;
      x.drawImage(cached('cgfront', c => { R(c, '#12040e', 0, 300, SW, 60); const r = rng(5); skyline(c, r, 316, 30, 90, '#0a020a', '#ff9a50', .15, 40, 90); }), 0, 0);
      smoke(x, t, 90, 280); smoke(x, t + 2, 560, 290); embers(x, t); letterbox(x);
    },
    // Prologue: your eye picks out the weak point.
    insight(x, t) {
      R(x, '#06081a', 0, 0, SW, SH); x.globalAlpha = .5; beast(x, 320, 210, 1.9, t); x.globalAlpha = 1;
      x.fillStyle = '#58d6ff10'; for (let y = (t * 40) % 8; y < SH; y += 8) x.fillRect(0, y, SW, 2);
      const lock = Math.min(1, t / 1.6), rr = 120 - lock * 84, tx = 320 + (1 - lock) * Math.sin(t * 9) * 40, ty = 250 + (1 - lock) * Math.cos(t * 7) * 30;
      x.strokeStyle = lock >= 1 ? '#ffd766' : '#58d6ff'; x.lineWidth = 2; x.beginPath(); x.arc(tx, ty, rr, 0, TAU); x.stroke(); x.beginPath(); x.arc(tx, ty, rr * .55, t * 2, t * 2 + 4.5); x.stroke();
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + t * (lock >= 1 ? 0 : 1); x.beginPath(); x.moveTo(tx + Math.cos(a) * (rr + 6), ty + Math.sin(a) * (rr + 6)); x.lineTo(tx + Math.cos(a) * (rr + 22), ty + Math.sin(a) * (rr + 22)); x.stroke(); }
      if (lock >= 1) { x.fillStyle = '#ffd766'; x.globalAlpha = .5 + .5 * Math.sin(t * 10); x.beginPath(); x.arc(tx, ty, 9, 0, TAU); x.fill(); x.globalAlpha = 1; }
      x.strokeStyle = '#58d6ff60'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, ty); x.lineTo(SW, ty); x.moveTo(tx, 0); x.lineTo(tx, SH); x.stroke();
      for (let i = 0; i < 7; i++) { R(x, '#58d6ff', 20, 40 + i * 12, 30 + ((i * 41 + Math.floor(t * 8) * 17) % 70), 3); R(x, '#58d6ff', 520, 250 + i * 10, 20 + ((i * 29 + Math.floor(t * 6) * 23) % 90), 3); }
      letterbox(x);
    },
    // Prologue: Solar Flare's finishing blow.
    firstlight(x, t) {
      bands(x, 0, SH, ['#2a0610', '#7a1420', '#e85a2a', '#ffc050'], 12);
      speedLines(x, t, 430, 150, '#ffe08040');
      x.globalAlpha = .9; beast(x, 110, 250, 1.3, t, t % 1.2 < .12 ? 1 : 0); x.globalAlpha = 1;
      const bob = Math.sin(t * 2.2) * 3; x.fillStyle = '#ffb04030'; x.beginPath(); x.arc(450, 170, 150 + Math.sin(t * 6) * 8, 0, TAU); x.fill();
      const p = P('akari', 'grin', 'power', 2, blinkAt(t)); x.drawImage(p, 250, 2 + bob);
      for (let i = 0; i < 12; i++) { const l = (t * 1.4 + i / 12) % 1, a = i * 2.4; x.globalAlpha = 1 - l; R(x, i % 2 ? '#fff2a0' : '#ff8a2a', 598 + Math.cos(a) * l * 60, 84 + bob - l * 70 + Math.sin(a) * 10, 4, 4); } x.globalAlpha = 1;
      embers(x, t, 50); letterbox(x);
    },
    // Chapter 1: meet Unit 7.
    unit7(x, t) {
      BG['lobby@0'](x, t); x.fillStyle = '#0a103860'; x.fillRect(0, 0, SW, SH);
      for (const [lx, c] of [[150, '#7ad0f030'], [320, '#ff7a3c30'], [490, '#b07aff30']]) { x.fillStyle = c; x.beginPath(); x.moveTo(lx - 20, 0); x.lineTo(lx + 20, 0); x.lineTo(lx + 90, SH); x.lineTo(lx - 90, SH); x.closePath(); x.fill(); }
      const b = k => Math.round(Math.sin(t * 1.8 + k) * 2);
      x.drawImage(P('rei', 'cool', 'crossed', 1.3, blinkAt(t, 1)), 150 - 143, 36 + b(1)); x.drawImage(P('mio', 'smug', 'hip', 1.3, blinkAt(t, 2.3)), 490 - 143, 44 + b(2));
      x.drawImage(P('akari', 'happy', 'wave', 1.45, false), 320 - 160, 14 + b(0));
      motes(x, t, '#ffffff', 26); letterbox(x);
    },
    // Chapter 1: first deployment, drawn with Moonkai engine sprites.
    battle(x, t) {
      x.drawImage(cityStatic('attack', 250), 0, 0); cityAnim(x, t, 'attack', 250); riftSky(x, t, 470, 60, .9);
      R(x, '#1a0a16', 0, 290, SW, 70); R(x, '#3a1424', 0, 290, SW, 3); for (let i = 0; i < SW; i += 80) R(x, '#3a1424', i + ((t * 60) % 80) - 80, 330, 40, 3);
      beast(x, 500, 262, 1.25, t, t % 1.6 < .07 ? 1 : 0);
      const fire = '#ff8a2a';
      sprite(x, 'rei', 'jump', t * .7, 150, 250, 160); sprite(x, 'mio', 'kick', t * .8 + .3, 250, 300, 160); sprite(x, 'akari', 'attack', t * .9, 350, 296, 176);
      for (let i = 0; i < 6; i++) { const l = (t * 1.5 + i / 6) % 1; x.globalAlpha = 1 - l; R(x, '#d6f4ff', 190 + l * 240, 170 + i * 9 + l * 40, 10, 3); R(x, '#b07aff', 300 + l * 150, 262 - i * 4, 6, 6); } x.globalAlpha = 1;
      speedLines(x, t, 480, 220, '#ffffff18', 30); embers(x, t, 30); letterbox(x);
    },
    // Chapter 1 ending: the rooftop, with whoever you grew closest to.
    rooftop(x, t, id = 'akari') {
      x.drawImage(cityStatic('sunset', 250), 0, 0); cityAnim(x, t, 'sunset', 250);
      R(x, '#3a2048', 0, 236, SW, 5); for (let i = 0; i < SW; i += 30) R(x, '#3a2048', i + 8, 236, 3, 70); R(x, '#7a4a5e', 0, 300, SW, 60);
      x.fillStyle = '#ffe09030'; x.beginPath(); x.arc(430, 200, 130 + Math.sin(t) * 6, 0, TAU); x.fill();
      const ex = { akari: ['smile', 'chest'], rei: ['shy', 'chest'], mio: ['blush', 'chest'] }[id] || ['smile', 'down'];
      const bob = Math.round(Math.sin(t * 1.6) * 2), bl = blinkAt(t);
      x.drawImage(P(id, ex[0], ex[1], 1.9, bl), 320 - 209, 6 + bob);
      x.fillStyle = '#ff9a5024'; x.fillRect(0, 0, SW, SH);
      x.fillStyle = '#fff6d0'; for (let i = 0; i < 5; i++) { x.globalAlpha = .12 + .05 * Math.sin(t * 2 + i); x.beginPath(); x.arc(430 - i * 70, 200 - i * 34, 10 + i * 9, 0, TAU); x.fill(); } x.globalAlpha = 1;
      motes(x, t, '#ffe8b0', 40); letterbox(x);
    },
    // Title screen backdrop.
    title(x, t) {
      x.drawImage(cityStatic('night', 262), 0, 0); cityAnim(x, t, 'night', 262);
      x.fillStyle = '#58d6ff'; for (let i = 0; i < 3; i++) { x.globalAlpha = .07; x.beginPath(); const a = Math.sin(t * .4 + i * 2) * .5; x.moveTo(318, 60); x.lineTo(318 + Math.sin(a - .08) * 600, 60 - Math.cos(a - .08) * 600); x.lineTo(318 + Math.sin(a + .08) * 600, 60 - Math.cos(a + .08) * 600); x.fill(); } x.globalAlpha = 1;
      R(x, '#0a0e24', 0, 300, SW, 60);
      const b = k => Math.round(Math.sin(t * 1.6 + k) * 2);
      x.drawImage(P('rei', 'cool', 'crossed', 1.2, blinkAt(t, 1.2)), 340 - 132, 70 + b(1)); x.drawImage(P('mio', 'smug', 'down', 1.2, blinkAt(t, 2.6)), 580 - 132, 82 + b(2));
      x.drawImage(P('akari', 'grin', 'fists', 1.35, blinkAt(t)), 452 - 148, 44 + b(0));
      x.fillStyle = vgrad(x, 0, SH, ['#0a0e2400', '#0a0e2400', '#0a0e24c0']); x.fillRect(0, 0, SW, SH);
      const g = x.createLinearGradient(0, 0, 330, 0); g.addColorStop(0, '#0a0e24e0'); g.addColorStop(1, '#0a0e2400'); x.fillStyle = g; x.fillRect(0, 0, 330, SH);
      motes(x, t, '#9ad8ff', 30);
    },
  };

  window.AHArt = { SW, SH, BG, CG, beast, sprite, emblem, motes, embers, speedLines, R,
    drawBg(x, name, t, tod) { const f = BG[name] || BG[name + '@' + (tod || 0)] || BG.black; f(x, t); },
    CG_LIST: [['rift', 'The Sky Tears'], ['insight', "Handler's Eye"], ['firstlight', 'First Light'], ['unit7', 'Unit 7'], ['battle', 'First Deployment'], ['rooftop:akari', 'Rooftop — Akari'], ['rooftop:rei', 'Rooftop — Rei'], ['rooftop:mio', 'Rooftop — Mio']] };
})();

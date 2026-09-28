/* HEARTLINE AGENCY — pixel CGs.
   48 event illustrations painted as staged VN scenes on a 400 x 225 grid (1600 x 900 design units).
   Scenes are staged rather than lined up facing the camera: over-the-shoulder and back shots, characters
   sitting on ledges, benches, steps and gondola seats, 3/4 head turns, afterimages and mirror doubles,
   hands held in the foreground, and props painted in front (railings, umbrellas, tables, flames, bars,
   lanterns, a camera viewfinder). Each character gets the scene's key light and a rim light, and the camera
   drifts slowly. Eight frames per CG animate hair in the wind, blinks, particles, fire, fireworks and light. */
const PixelCG = (() => {
  const W = 400, H = 225, S = .25, K = PixelCast.K, NF = 8, TAU = Math.PI * 2;
  const { G, drawChar, star, star4, heartD, cel } = PixelCast;
  const rng = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };

  // ---------- dithered fills (Studio dither patterns), aligned to the pixel grid ----------
  const pats = new Map();
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function dith(g, d, col, dens) {
    const key = col + dens; let p = pats.get(key);
    if (!p) { const c = PX.mk(4 * K, 4 * K), x = c.getContext('2d'); x.fillStyle = col; for (let i = 0; i < 16; i++) if (BAY[i] / 16 < dens) x.fillRect((i % 4) * K, (i >> 2) * K, K, K); p = { c }; pats.set(key, p); }
    const pat = g.x.createPattern(p.c, 'repeat'); pat.setTransform(g.x.getTransform().inverse());
    g.used.add(col); g.x.fillStyle = pat; g.x.fill(typeof d === 'string' ? new Path2D(d) : d);
  }
  const circ = (cx, cy, r, ry = r) => { const p = new Path2D(); p.ellipse(cx, cy, r, ry, 0, 0, TAU); return p; };

  // ---------- effects: (g, t, i) ----------
  const FX = {
    rays: (cx, cy, col, n = 14, dens = .35) => (g, t) => { for (let k = 0; k < n; k++) { const a = (k / n + t / n) * TAU, b = a + TAU / n / 2; dith(g, `M${cx},${cy} L${cx + Math.cos(a) * 2000},${cy + Math.sin(a) * 2000} L${cx + Math.cos(b) * 2000},${cy + Math.sin(b) * 2000}Z`, col, dens); } },
    glow: (cx, cy, r, col, ry) => (g, t) => { const p = 1 + Math.sin(t * TAU) * .06; [[1, .2], [.72, .45], [.45, .75]].forEach(([k, d]) => dith(g, circ(cx, cy, r * k * p, (ry || r) * k * p), col, d)); },
    stars: (n, seed = 3, h = 450) => (g, t, i) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = r() * 1600, y = r() * h, on = (k + i) % 5; g.rect(x, y, on ? 5 : 9, on ? 5 : 9, on ? '#ffffff' : '#fff6c0'); } },
    moon: (x, y, r) => g => { dith(g, circ(x, y, r * 1.8), '#e8e0ff', .25); g.ell(x, y, r, r, '#fff8e0'); g.ell(x + r * .3, y - r * .2, r * .8, r * .8, '#f0e6c8'); },
    fireworks: list => (g, t, i) => list.forEach(([x, y, r, col, ph]) => { const q = (t + ph) % 1, rr = r * (.2 + q * .9), n = 16; for (let k = 0; k < n; k++) { const a = k / n * TAU; const d = q < .75 ? 1 : 0; if (!d && k % 2) continue; g.rect(x + Math.cos(a) * rr - 5, y + Math.sin(a) * rr * .9 - 5, 10, 10, k % 3 ? col : '#ffffff'); g.rect(x + Math.cos(a) * rr * .7 - 3, y + Math.sin(a) * rr * .6 - 3, 6, 6, col); } }),
    rain: (n, seed = 7, col = '#9fc4ff') => (g, t) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = r() * 1700, y = ((r() + t * 2) % 1) * 1000 - 60; g.line(`M${x},${y} l-14,48`, col, 5); } },
    snow: (n, seed = 9) => (g, t) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = r() * 1600 + Math.sin((t + k) * TAU) * 16, y = ((r() + t) % 1) * 960 - 30, s = r() < .3 ? 14 : 8; g.rect(x, y, s, s, '#ffffff'); } },
    petals: (n, col = '#ffb3cf', seed = 5) => (g, t) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = ((r() - t * .6 + 1) % 1) * 1700 - 50, y = ((r() + t * .8) % 1) * 960 - 30; g.ell(x, y, 12, 7, col, 2, '#b0527a', (k + t * 6)); } g.markLine('#b0527a'); },
    leaves: (n, seed = 6) => (g, t) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = ((r() + t) % 1) * 1700 - 50, y = r() * 800 + Math.sin((t * 2 + k) * TAU) * 20; g.fill(`M${x},${y} q14,-16 30,-2 q-14,16 -30,2Z`, k % 2 ? '#2fbf7a' : '#9be86a', 2, '#0f5034'); } },
    embers: (n, seed = 4) => (g, t) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = r() * 1600 + Math.sin((t + k) * 5) * 20, y = ((r() - t + 1) % 1) * 900, s = 6 + r() * 8; g.rect(x, y, s, s, k % 3 ? '#ff8a2a' : '#ffe066'); } },
    confetti: (n, seed = 8) => (g, t) => { const r = rng(seed), C = ['#ff5d85', '#ffd54a', '#5ef0a0', '#59b8ff', '#c9a0ff']; for (let k = 0; k < n; k++) { const x = r() * 1600 + Math.sin((t + k) * TAU) * 30, y = ((r() + t) % 1) * 960 - 30; g.save(); g.rot((k * 40 + t * 360) % 360, x, y); g.rect(x - 8, y - 4, 16, 8, C[k % 5]); g.restore(); } },
    sparkles: (n, col = '#fff6a8', seed = 2) => (g, t, i) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = r() * 1600, y = r() * 800, big = (k + i) % 3 === 0; star4(g, x, y, big ? 22 : 12, col); } },
    hearts: (n, seed = 12) => (g, t) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = r() * 1600, y = ((r() - t * .5 + 1) % 1) * 900; g.fill(heartD(x, y, 14 + (k % 3) * 5), k % 2 ? '#ff8fb0' : '#ff4f7e', 2); } },
    fireflies: (n, col = '#d8b8ff', seed = 13) => (g, t, i) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = r() * 1600 + Math.sin((t + k) * TAU) * 30, y = 300 + r() * 500 + Math.cos((t + k) * TAU) * 20; if ((k + i) % 4) { g.rect(x - 5, y - 5, 10, 10, col); dith(g, circ(x, y, 22), col, .25); } } },
    speed: (cx, cy, col = '#ffffff', n = 40) => (g, t, i) => { const r = rng(21 + i); for (let k = 0; k < n; k++) { const a = r() * TAU, r0 = 420 + r() * 300; g.line(`M${cx + Math.cos(a) * r0},${cy + Math.sin(a) * r0} L${cx + Math.cos(a) * 1900},${cy + Math.sin(a) * 1900}`, col, 4 + r() * 8); } },
    streaks: (col = '#e8fff2', n = 16) => (g, t, i) => { const r = rng(31 + i); for (let k = 0; k < n; k++) { const y = r() * 900, x = r() * 1600; g.line(`M${x},${y} l${260 + r() * 300},0`, col, 5); } },
    spot: (x, col = '#fff6e0', dens = .3) => g => dith(g, `M${x - 60},-20 L${x + 60},-20 L${x + 330},920 L${x - 330},920Z`, col, dens),
    crowd: (y = 780) => (g, t, i) => { const r = rng(40); for (let k = 0; k < 34; k++) { const x = k * 50 + r() * 20, h = 60 + r() * 50; g.fill(`M${x - 24},900 L${x - 24},${y + 120 - h} C${x - 24},${y + 90 - h} ${x + 24},${y + 90 - h} ${x + 24},${y + 120 - h} L${x + 24},900Z`, '#0c0616', 0); const c = ['#ff5d85', '#59b8ff', '#ffd54a', '#5ef0a0'][k % 4], sw = Math.sin((t * 2 + k * .3) * TAU) * 30; g.line(`M${x},${y + 100 - h} l${sw},-90`, c, 9); } },
    rings: (cx, cy, col) => (g, t) => { for (let k = 0; k < 4; k++) { const q = (t + k / 4) % 1, rr = 120 + q * 900; g.ring(cx, cy, rr, rr * .55, col, 10 * (1 - q) + 3); } },
    sun: (cx, cy, r) => (g, t) => { FX.rays(cx, cy, '#ffd9f4', 18, .3)(g, t); dith(g, circ(cx, cy, r * 1.6), '#ffe0f0', .35); g.ell(cx, cy, r, r, '#fff6fb'); g.ell(cx, cy, r * .8, r * .8, '#ffffff'); },
    burst: (cx, cy) => (g, t) => { FX.rays(cx, cy, '#e8fcff', 20, .4)(g, t); dith(g, circ(cx, cy, 420, 360), '#ffffff', .4); dith(g, circ(cx, cy, 260, 220), '#ffffff', .7); },
    // outlined (mid-pass) effects
    bolts: (n, seed = 3) => (g, t, i) => { const r = rng(seed + i); for (let k = 0; k < n; k++) { let x = 500 + k * 260 + r() * 120, y = -20, d = `M${x},${y}`; while (y < 820) { y += 60 + r() * 80; x += (r() - .5) * 180; d += ` L${x | 0},${y | 0}`; } g.line(d, '#2a4fd6', 22 - k * 3); g.line(d, '#fff27a', 13 - k * 2); g.line(d, '#ffffff', 5); } },
    shards: (n, seed = 11) => (g, t, i) => { const r = rng(seed); for (let k = 0; k < n; k++) { const x = r() * 1600, y = ((r() + t * .7) % 1) * 1000 - 50, h = 30 + r() * 50; PixelMon.shard(g, x, y, h, h * .3, r() * 180 + t * 90, PixelMon.GLASS[k % 3], (k + i) % 4 === 0); } },
    tendrils: () => (g, t) => { for (let k = 0; k < 9; k++) { const w = Math.sin((t + k / 9) * TAU) * 40; g.fill(`M${420 + k * 90},900 C${300 + k * 110 + w},${600 - k * 20} ${700 + k * 40 - w},${500 - k * 30} ${780 + k * 30 + w},${300 + (k % 3) * 60} C${740 + k * 36},${520 - k * 30} ${330 + k * 110},${620} ${470 + k * 90},900Z`, k % 2 ? '#2a1446' : '#140a24', 3, '#7a4ec0'); } g.markLine('#7a4ec0'); },
    hexwall: () => (g, t, i) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 16; x++) { const cx = x * 110 + (y % 2) * 55, cy = y * 96 + 40, on = (x + y + i) % 7 === 0; let d = ''; for (let k = 0; k < 6; k++) { const a = k * TAU / 6 + TAU / 12; d += (k ? 'L' : 'M') + (cx + Math.cos(a) * 52).toFixed(1) + ',' + (cy + Math.sin(a) * 52).toFixed(1); } if (on) g.fill(d + 'Z', '#fff4c0', 4, '#f2c14e'); else g.line(d + 'Z', '#f2c14e', 4); } },
    bars: () => g => { for (let k = 0; k < 9; k++) { const x = 60 + k * 190; g.fill(`M${x},0 L${x + 34},0 L${x + 34},900 L${x},900Z`, '#2a2d38', 4, '#0c0c12'); g.line(`M${x + 8},0 L${x + 8},900`, '#5a5f6a', 4); } g.fill('M0,120 L1600,120 L1600,150 L0,150Z', '#2a2d38', 4, '#0c0c12'); },
    gondola: col => g => { const fr = `M0,0 L1600,0 L1600,900 L0,900Z M180,120 Q800,40 1420,120 L1440,760 Q800,820 160,760Z`; const p = new Path2D(fr); g.x.fillStyle = col; g.used.add(col); g.x.fill(p, 'evenodd'); g.line('M180,120 Q800,40 1420,120 L1440,760 Q800,820 160,760Z', '#1c1426', 10); g.fill('M120,770 L1480,770 L1500,900 L100,900Z', PX.shade(col, -1, 14), 6, '#1c1426'); }
  };


  // extra effects
  Object.assign(FX, {
    shoot: () => (g, t) => { const q = (t * 1.5) % 1; if (q > .5) return; const x = 1400 - q * 1600, y = 60 + q * 300; g.line(`M${x},${y} l160,-40`, '#ffffff', 6); g.line(`M${x + 60},${y - 15} l100,-25`, '#e8e0ff', 3); },
    birds: () => (g, t) => { for (let k = 0; k < 4; k++) { const x = ((t + k * .23) % 1) * 1800 - 100, y = 180 + k * 40 + Math.sin((t * 3 + k) * TAU) * 12, f = Math.sin((t * 8 + k) * TAU) > 0 ? -8 : 6; g.line(`M${x - 14},${y + f} L${x},${y} L${x + 14},${y + f}`, '#2a1426', 4); } },
    sunDisc: (x, y, r, col) => (g, t) => { dith(g, circ(x, y, r * 2.2), col, .2); dith(g, circ(x, y, r * 1.5), col, .45); g.ell(x, y, r, r, '#fff4d0'); },
    zap: (x0, y0, x1, y1, seed = 5) => (g, t, i) => { const r = rng(seed + i); let d = `M${x0},${y0}`; for (let k = 1; k <= 8; k++) { const q = k / 8; d += ` L${(x0 + (x1 - x0) * q + (r() - .5) * 70) | 0},${(y0 + (y1 - y0) * q + (r() - .5) * 70) | 0}`; } g.line(d, '#2a4fd6', 20); g.line(d, '#fff27a', 11); g.line(d, '#ffffff', 4); },
    windows: () => g => { dith(g, 'M0,0 L1600,0 L1600,900 L0,900Z', '#ffe8c0', .08); for (let k = 0; k < 4; k++) dith(g, `M${200 + k * 340},0 L${320 + k * 340},0 L${120 + k * 340},900 L${0 + k * 340},900Z`, '#fff4e0', .3); }
  });

  // ---------- props painted in front of or behind the cast (outlined) ----------
  const PR = {
    ledge: (y = 780, col = '#7a6a80') => g => { cel(g, `M-20,${y} L1620,${y} L1620,${y + 40} L-20,${y + 40}Z`, PX.shade(col, 1, 8), col); cel(g, `M-20,${y + 40} L1620,${y + 40} L1620,920 L-20,920Z`, col, PX.shade(col, -1, 14)); for (let k = 0; k < 9; k++) g.line(`M${k * 200 + 60},${y + 44} l0,${920 - y}`, PX.shade(col, -1, 14), 3); },
    railing: (y = 760, col = '#3a3448') => g => { g.fill(`M-20,${y} L1620,${y} L1620,${y + 22} L-20,${y + 22}Z`, col, 4); for (let k = 0; k < 17; k++) g.fill(`M${k * 100 - 6},${y + 22} l14,0 l0,${900 - y} l-14,0Z`, col, 3); g.line(`M-20,${y + 5} L1620,${y + 5}`, PX.shade(col, 1, 18), 3); },
    umbrella: (x, y, col = '#8a1e2a') => (g, t) => { const d = `M${x - 330},${y + 120} Q${x},${y - 150} ${x + 330},${y + 120} ` + [...Array(6)].map((_, k) => `Q${x + 275 - k * 110},${y + 80} ${x + 220 - k * 110},${y + 120}`).join(' ') + 'Z'; cel(g, d, col, PX.shade(col, -1, 14), 4); for (let k = 1; k < 6; k++) g.line(`M${x},${y - 60} L${x - 330 + k * 110},${y + 118}`, PX.shade(col, -1, 18), 3); g.line(`M${x},${y - 60} L${x},${y + 520}`, '#2a2024', 8); for (let k = 0; k < 6; k++) { const q = ((t * 2 + k / 6) % 1); g.line(`M${x - 330 + k * 120 + 20},${y + 124 + q * 60} l0,26`, '#bfe0ff', 5); } },
    table: (y = 660, col = '#8a5a3a') => (g, t) => { cel(g, `M200,${y} L1400,${y} L1500,${y + 60} L100,${y + 60}Z`, PX.shade(col, 1, 10), col); cel(g, `M100,${y + 60} L1500,${y + 60} L1500,920 L100,920Z`, col, PX.shade(col, -1, 14));
      for (const cx of [620, 1000]) { cel(g, `M${cx - 50},${y - 70} L${cx + 50},${y - 70} L${cx + 40},${y + 20} L${cx - 40},${y + 20}Z`, '#fff8f0', '#d8ccc0', 3); g.ell(cx, y - 70, 50, 12, '#6a3a1a', 3); g.fill(`M${cx + 50},${y - 50} q34,6 0,40`, 'rgba(0,0,0,0)', 0); g.line(`M${cx + 48},${y - 50} q34,6 -2,40`, '#fff8f0', 8); g.line(`M${cx + 48},${y - 50} q34,6 -2,40`, '#2a1a24', 2);
        const u = (t * 2) % 1; dith(g, `M${cx - 20},${y - 90 - u * 40} q20,-40 0,-80 q-20,-40 0,-80 l14,0 q-20,40 0,80 q20,40 0,80Z`, '#ffffff', .5); } },
    bench: (y = 700, col = '#8a5a3a', back = true) => g => { if (back) for (let k = 0; k < 3; k++) cel(g, `M300,${y - 260 + k * 60} L1300,${y - 260 + k * 60} L1300,${y - 224 + k * 60} L300,${y - 224 + k * 60}Z`, col, PX.shade(col, -1, 14), 3); },
    benchSeat: (y = 700, col = '#8a5a3a') => g => { cel(g, `M260,${y} L1340,${y} L1360,${y + 50} L240,${y + 50}Z`, PX.shade(col, 1, 8), col, 3); g.fill(`M300,${y + 50} l30,0 l0,200 l-30,0Z`, '#2a2024', 3); g.fill(`M1270,${y + 50} l30,0 l0,200 l-30,0Z`, '#2a2024', 3); },
    steps: (y = 640, col = '#9a8a80') => g => { for (let k = 0; k < 4; k++) cel(g, `M-20,${y + k * 70} L1620,${y + k * 70} L1620,${y + k * 70 + 70} L-20,${y + k * 70 + 70}Z`, k % 2 ? col : PX.shade(col, 1, 6), PX.shade(col, -1, 12), 3); },
    hands: (x, y, c1, c2) => g => { const L = '#2a1a24';
      g.save(); g.tr(x - 60, y); g.rot(-70); cel(g, 'M-60,-40 L120,-50 L120,50 L-60,40Z', '#ffffff', '#d8d8e8', 3, L); g.restore();
      g.save(); g.tr(x + 90, y + 40); g.rot(250); cel(g, 'M-60,-44 L120,-54 L120,54 L-60,44Z', '#2a3050', '#1a1e36', 3, L); g.restore();
      cel(g, `M${x - 110},${y - 30} C${x - 60},${y - 90} ${x + 40},${y - 80} ${x + 90},${y - 30} C${x + 110},${y + 10} ${x + 60},${y + 60} ${x},${y + 60} C${x - 60},${y + 60} ${x - 120},${y + 20} ${x - 110},${y - 30}Z`, c1, PX.shade(c1, -1, 12), 3, L);
      for (let k = 0; k < 4; k++) cel(g, `M${x - 70 + k * 40},${y - 10} C${x - 74 + k * 40},${y + 50} ${x - 40 + k * 40},${y + 90} ${x - 30 + k * 40},${y + 40}Z`, c2, PX.shade(c2, -1, 12), 3, L);
      cel(g, `M${x + 70},${y - 50} C${x + 120},${y - 70} ${x + 150},${y - 20} ${x + 110},${y + 10}Z`, c2, PX.shade(c2, -1, 12), 3, L); },
    monitors: () => (g, t, i) => { for (let k = 0; k < 5; k++) { const x = 40 + k * 320; cel(g, `M${x},640 L${x + 280},640 L${x + 280},860 L${x},860Z`, '#1a1e2a', '#0e1018', 4); g.fill(`M${x + 20},660 L${x + 260},660 L${x + 260},840 L${x + 20},840Z`, (i + k) % 2 ? '#5a0010' : '#a01028', 2); g.text('!', x + 140, 790, 110, '#ffd24a'); } },
    cracks: (cx, cy, seed = 3, n = 14) => (g, t, i) => { const r = rng(seed); for (let k = 0; k < n; k++) { let x = cx, y = cy, d = `M${x},${y}`, a = k / n * TAU + r() * .3; for (let s = 0; s < 6; s++) { x += Math.cos(a) * (60 + r() * 90); y += Math.sin(a) * (60 + r() * 90); a += (r() - .5) * .7; d += ` L${x | 0},${y | 0}`; } g.line(d, '#0e1a3a', 7); g.line(d, (k + i) % 5 ? '#e8ffff' : '#9ff6ff', 3); } },
    flames: () => (g, t, i) => { for (let k = 0; k < 16; k++) { const x = k * 105 - 20, h = 140 + ((k * 37 + i * 53) % 90), side = k < 5 || k > 10; if (!side && k % 2) continue; const w = 60, yb = 920; cel(g, `M${x - w},${yb} C${x - w},${yb - h * .5} ${x - 10},${yb - h * .6} ${x + (i % 2 ? 8 : -8)},${yb - h - (side ? 160 : 0)} C${x + 14},${yb - h * .6} ${x + w},${yb - h * .5} ${x + w},${yb}Z`, '#ff8a2a', '#d8401a', 3, '#6a1a0a'); g.fill(`M${x - 24},${yb} C${x - 20},${yb - h * .3} ${x},${yb - h * .45} ${x + 2},${yb - h * .6 - (side ? 80 : 0)} C${x + 8},${yb - h * .4} ${x + 24},${yb - h * .3} ${x + 24},${yb}Z`, '#ffe066', 0); } },
    sparkler: (x, y) => (g, t, i) => { g.line(`M${x},${y} l40,-120`, '#6a6a70', 5); const r = rng(9 + i), cx = x + 40, cy = y - 124; for (let k = 0; k < 18; k++) { const a = r() * TAU, l = 20 + r() * 70; g.line(`M${cx},${cy} l${Math.cos(a) * l},${Math.sin(a) * l}`, k % 3 ? '#ffe066' : '#ffffff', 3); } g.ell(cx, cy, 10, 10, '#ffffff'); },
    lanterns: () => (g, t) => { for (let k = 0; k < 6; k++) { const x = 60 + k * 300, sw = Math.sin((t + k * .2) * TAU) * 10, y = 70 + (k % 2) * 30; g.line(`M${x},0 L${x + sw},${y - 40}`, '#2a1a1a', 3); cel(g, `M${x + sw - 42},${y} C${x + sw - 50},${y - 60} ${x + sw + 50},${y - 60} ${x + sw + 42},${y} C${x + sw + 50},${y + 60} ${x + sw - 50},${y + 60} ${x + sw - 42},${y}Z`, '#ff5a3a', '#c0301a', 3, '#3a0a0a'); g.fill(`M${x + sw - 30},${y - 50} l60,0 l0,8 l-60,0Z M${x + sw - 30},${y + 42} l60,0 l0,8 l-60,0Z`, '#2a1a1a', 0); } },
    goldfish: (x, y) => (g, t) => { cel(g, `M${x - 60},${y} C${x - 70},${y + 90} ${x + 70},${y + 90} ${x + 60},${y} C${x + 40},${y - 30} ${x - 40},${y - 30} ${x - 60},${y}Z`, '#bfe8ff', '#8ac8f0', 3); g.line(`M${x},${y - 20} l0,-60`, '#ff5a8a', 5); const fx = x + Math.sin(t * TAU) * 20; g.fill(`M${fx - 18},${y + 40} q18,-14 30,0 l14,-10 l0,20 l-14,-10 q-12,14 -30,0Z`, '#ff6a2a', 2); },
    scarf: (x, y, col = '#c42a36') => (g, t) => { const w = Math.sin(t * TAU) * 16; cel(g, `M${x},${y} C${x - 200},${y + 30 + w} ${x - 480},${y - 10 - w} ${x - 760},${y + 40 + w} L${x - 760},${y + 110 + w} C${x - 480},${y + 60 - w} ${x - 200},${y + 100 + w} ${x},${y + 70}Z`, col, PX.shade(col, -1, 14)); for (let k = 1; k < 6; k++) g.line(`M${x - k * 130},${y + 40} l0,50`, PX.shade(col, 1, 14), 3); },
    breath: (x, y) => (g, t) => { const q = t % 1; dith(g, circ(x + q * 60, y - q * 40, 30 + q * 50, 20 + q * 30), '#ffffff', .5 - q * .35); },
    snowball: () => (g, t) => { const q = t % 1, x = 380 + q * 900, y = 360 - Math.sin(q * Math.PI) * 180; g.ell(x, y, 26, 26, '#ffffff', 3, '#6a7aa0'); for (let k = 1; k < 4; k++) g.rect(x - k * 40, y + k * 6, 8, 8, '#ffffff'); },
    pier: () => g => { cel(g, 'M-20,760 L1620,760 L1620,920 L-20,920Z', '#3a2a24', '#22160f'); for (let k = 0; k < 20; k++) g.line(`M${k * 90},760 l-30,160`, '#1a100a', 3); },
    boardTable: () => g => { cel(g, 'M690,520 L910,520 L1500,920 L100,920Z', '#3a2a24', '#22160f'); g.line('M690,520 L910,520', '#8a6a4a', 4); for (let k = 0; k < 4; k++) { const q = (k + 1) / 5, y = 520 + q * 400, xl = 690 - q * 590, xr = 910 + q * 590; g.fill(`M${xl - 60 - q * 60},${y - 150 - q * 150} q${40 + q * 40},-${60 + q * 60} ${80 + q * 80},0 l0,${150 + q * 150} l-${80 + q * 80},0Z`, '#0c0a12', 3); g.fill(`M${xr - 20 - q * 20},${y - 150 - q * 150} q${40 + q * 40},-${60 + q * 60} ${80 + q * 80},0 l0,${150 + q * 150} l-${80 + q * 80},0Z`, '#0c0a12', 3); } },
    lowTable: () => (g, t) => { cel(g, 'M260,700 L1340,700 L1400,760 L200,760Z', '#b88a5a', '#8a5a3a'); cel(g, 'M200,760 L1400,760 L1400,920 L200,920Z', '#8a5a3a', '#5a3a22'); for (const x of [420, 640, 860, 1080, 1260]) { cel(g, `M${x - 44},650 L${x + 44},650 L${x + 34},710 L${x - 34},710Z`, '#ffffff', '#d8d0c8', 3); g.ell(x, 650, 44, 10, '#e8b85a', 3); dith(g, `M${x - 10},${640 - (t * 60) % 60} q14,-30 0,-60 l10,0 q14,30 0,60Z`, '#ffffff', .5); } },
    photo: () => (g, t, i) => { const p = new Path2D('M0,0 L1600,0 L1600,900 L0,900Z M60,50 L1540,50 L1540,780 L60,780Z'); g.x.fillStyle = '#fbf8f1'; g.used.add('#fbf8f1'); g.x.fill(p, 'evenodd'); g.line('M60,50 L1540,50 L1540,780 L60,780Z', '#c8c0b0', 4); g.text('SQUAD ZERO · SPRING', 800, 856, 50, '#3a2a3a'); if (i === 0) { g.x.fillStyle = '#ffffff'; g.x.fillRect(60, 50, 1480, 730); } },
    viewfinder: () => (g, t, i) => { const c = '#ffffff'; [[80, 60, 1, 1], [1520, 60, -1, 1], [80, 840, 1, -1], [1520, 840, -1, -1]].forEach(([x, y, a, b]) => g.line(`M${x},${y + 90 * b} L${x},${y} L${x + 90 * a},${y}`, c, 8)); if (i % 2) g.ell(150, 130, 16, 16, '#ff2a4a'); g.text('REC', 230, 146, 44, c); g.text('LIVE · 12,004,381', 1320, 146, 40, c); g.text(`00:4${i}:1${i}`, 1340, 820, 44, c); g.line('M760,450 l80,0 M800,410 l0,80', c, 4); },
    shadowPool: () => (g, t) => { const p = Math.sin(t * TAU) * 20; g.ell(800, 800, 520 + p, 110, '#140a24', 4, '#5a2e9a'); g.ell(800, 800, 380 + p, 70, '#0a0514', 0); g.markLine('#5a2e9a'); },
    window: () => g => { const p = new Path2D('M0,0 L1600,0 L1600,900 L0,900Z M90,70 Q800,10 1510,70 L1530,830 L70,830Z'); g.x.fillStyle = '#e0c8e8'; g.used.add('#e0c8e8'); g.x.fill(p, 'evenodd'); g.line('M90,70 Q800,10 1510,70 L1530,830 L70,830Z', '#3a2440', 10); cel(g, 'M0,830 L1600,830 L1600,900 L0,900Z', '#c8a8d8', '#a888b8', 4); },
    gondolaSeat: col => g => { cel(g, 'M300,380 L1300,380 L1320,900 L280,900Z', col, PX.shade(col, -1, 14), 4); for (let k = 1; k < 6; k++) g.line(`M${160 + k * 213},430 L${150 + k * 216},750`, PX.shade(col, -1, 20), 3); }
  };

  // ---------- placing the cast ----------
  // o: of, rot, flip, view ('back'), sit, turn (-1..1), wind, clip (CG y), ghost { col, mode: 'solid'|'dither' },
  //    light { col, amt }, rim { col, side: l|r|t|b }, ph (phase offset), bf (blink frame, -1 = never)
  const ch = (id, emo, pose, x, y, sc, o = {}) => Object.assign({ id, emo, pose, x, y, sc }, o);
  const mon = (kind, x, y, sc, o = {}) => Object.assign({ id: kind, x, y, sc, emo: '', pose: '' }, o);
  function drawCast(x, c, t, i, k) {
    x.save();
    if (c.clip) { x.beginPath(); x.rect(-4000, -4000, 9000, 4000 + c.clip); x.clip(); }
    x.translate(c.x, c.y); if (c.rot) x.rotate(c.rot * Math.PI / 180); x.scale(c.flip ? -c.sc : c.sc, c.sc); x.translate(-200, 0);
    let g;
    if (c.id === 'bit') { g = G(x, '#1c1830'); x.translate(100, 0); PixelMon.drawBit(g, c.emo, t); }
    else if (PixelMon.MON[c.id]) { g = G(x, '#0e1a3a'); x.translate(-100, 0); PixelMon.MON[c.id](g, t, i); }
    else { const bf = c.bf !== undefined ? c.bf : (k * 3 + 5) % NF; g = drawChar(x, c.id, { emo: c.emo, pose: c.pose, of: c.of, t: (t + (c.ph || 0)) % 1, frame: i, breath: i >= 2 && i < 6, view: c.view, sit: c.sit, turn: c.turn, wind: c.wind, blink: i === bf }); }
    x.restore();
    if (c.ghost) { x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-atop'; if (c.ghost.mode === 'dither') { x.setTransform(K * S, 0, 0, K * S, 0, 0); dith(g, 'M0,0 L1600,0 L1600,900 L0,900Z', c.ghost.col, .5); } else { x.fillStyle = c.ghost.col; g.used.add(c.ghost.col); x.fillRect(0, 0, 9999, 9999); } x.restore(); }
    return g;
  }
  // scene light: tint toward the key colour, then a 1px rim on the edges that face the light
  function light(a, L, R) {
    if (L) { const c = PX.hexToRgb(L.col); for (let p = 0; p < a.length; p += 4) if (a[p + 3]) for (let j = 0; j < 3; j++) a[p + j] += (c[j] - a[p + j]) * L.amt; }
    if (R) {
      const c = PX.hexToRgb(R.col), src = a.slice(), [dx, dy] = { l: [-1, 0], r: [1, 0], t: [0, -1], b: [0, 1] }[R.side || 'l'];
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const p = (y * W + x) * 4; if (!src[p + 3]) continue; const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= W || Y >= H || !src[(Y * W + X) * 4 + 3]) { const q = (y * W + x + dx + dy * W) * 4; const inner = src[((y - dy) * W + x - dx) * 4 + 3]; if (inner) { a[p] = c[0]; a[p + 1] = c[1]; a[p + 2] = c[2]; } } }
    }
    return a;
  }

  // ---------- the 48 scenes ----------
  // spec: bg, pan (px of camera drift), tone { col, amt } for the background, back (lit fx behind), mid (props and
  // cast, in order), front (particles), tint (css overlay), glitch
  const warm = { col: '#ffb070', amt: .12 }, dusk = { col: '#b060a0', amt: .12 }, night = { col: '#3a3a8a', amt: .14 }, cold = { col: '#6a8ab8', amt: .12 };
  const C = {
    // Hikari's first strike: mid-air dive, lightning jumps from her fist into the Rift Hound
    cg_strike: { bg: 'street_night', pan: 6, tone: { col: '#0a0820', amt: .35 }, back: [FX.glow(1160, 460, 300, '#ff3355')],
      mid: [mon('hound', 1200, 190, 1.0, { flip: 1, rim: { col: '#ff7a8a', side: 'l' } }), FX.zap(700, 330, 1080, 470), ch('hikari', 'angry', 'reach', 500, 90, 1.75, { rot: -24, wind: 2.6, light: { col: '#9fdcff', amt: .1 }, rim: { col: '#fff27a', side: 'r' } })],
      front: [FX.speed(1160, 460), FX.sparkles(6)] },
    // The Director under a red umbrella in the rain, holding out her hand from a low angle
    cg_recruit: { bg: 'street_night', pan: 4, tone: { col: '#0a0818', amt: .4 }, back: [FX.spot(820, '#fff6e0', .22)],
      mid: [PR.umbrella(820, -40), ch('aya', 'smug', 'reach', 820, 60, 2.9, { turn: -.25, light: { col: '#ffd9a0', amt: .08 }, rim: { col: '#ffe6b0', side: 't' } })], front: [FX.rain(80)] },
    // Rei rises out of a pool of her own shadow
    cg_shadow: { bg: 'training', tone: { col: '#05000f', amt: .55 }, back: [FX.glow(800, 820, 700, '#2a1446', 260)],
      mid: [FX.tendrils(), PR.shadowPool(), ch('rei', 'smug', 'cross', 800, 80, 2.0, { clip: 790, turn: .25, light: { col: '#6a3aa8', amt: .16 }, rim: { col: '#c9a0ff', side: 'b' } })], tint: 'radial-gradient(circle at 50% 70%,transparent 35%,rgba(5,0,15,.75) 75%)' },
    // Over the shoulders of Hikari and Rei on the pier as the Leviathan breaks the surface
    cg_leviathan: { bg: 'harbor', pan: 5, tone: { col: '#1a0008', amt: .3 }, back: [FX.glow(800, 380, 540, '#ff2050', 300)],
      mid: [mon('leviathan', 800, 10, 1.45, { rim: { col: '#ff6a8a', side: 't' } }), PR.pier(), ch('hikari', 'determined', 'fist', 560, 380, 1.05, { view: 'back', wind: 2, rim: { col: '#ff6a8a', side: 't' } }), ch('rei', 'cold', 'default', 1050, 400, 1.02, { view: 'back', wind: 2, rim: { col: '#ff6a8a', side: 't' } })],
      front: [FX.shards(16), FX.rain(40)] },
    // Back to back: shadow on one side, lightning on the other
    cg_combo: { bg: 'harbor', tone: { col: '#0a0414', amt: .5 }, back: [FX.rays(800, 380, '#b58aff', 12, .22)],
      mid: [mon('leviathan', 800, 200, .95), FX.tendrils(), ch('rei', 'determined', 'point', 560, 110, 1.7, { flip: 1, turn: .45, rot: -4, rim: { col: '#c9a0ff', side: 'l' } }), ch('hikari', 'angry', 'fist', 1040, 100, 1.72, { turn: .45, rot: 4, rim: { col: '#fff27a', side: 'r' } }), FX.bolts(2, 9)],
      front: [FX.speed(800, 400)] },
    // Hikari sitting on the rooftop ledge, facing the sunset, twin tails in the wind
    cg_roof_hikari: { bg: 'rooftop', pan: 4, back: [FX.sunDisc(1120, 560, 90, '#ffb070'), FX.birds()],
      mid: [ch('hikari', 'love', 'shy', 760, -4, 1.4, { view: 'back', sit: 1, wind: 2.6, rim: { col: '#ffd08a', side: 'r' }, light: warm }), PR.ledge(782)], front: [FX.petals(8, '#ffd0a0')], tint: 'linear-gradient(0deg,rgba(255,120,80,.18),transparent)' },
    // Rei leaning on the railing at dusk, glancing away
    cg_roof_rei: { bg: 'rooftop', tone: { col: '#140a30', amt: .35 }, back: [FX.stars(50, 17, 380), FX.moon(1300, 150, 60)],
      mid: [ch('rei', 'tender', 'default', 820, -40, 2.55, { turn: .5, light: night, rim: { col: '#e0d0ff', side: 'r' } }), PR.railing(740)], front: [FX.fireflies(14)] },
    // Mira holding your hand, blushing
    cg_roof_mira: { bg: 'rooftop', tone: { col: '#3a1830', amt: .2 }, back: [FX.glow(800, 300, 600, '#ffc0d8', 340)],
      mid: [ch('mira', 'blush', 'default', 800, -60, 2.5, { turn: -.3, light: { col: '#ffb0c8', amt: .08 }, rim: { col: '#fff0f6', side: 'l' } }), PR.hands(820, 700, '#fff0e9', '#f3d2bc')], front: [FX.hearts(9)] },
    // The Glazier looms over Hikari
    cg_glazier: { bg: 'black', back: [FX.glow(800, 420, 520, '#1a4a6a', 360)],
      mid: [mon('glazier', 820, 30, 1.35, { rim: { col: '#9ff6ff', side: 't' } }), ch('hikari', 'scared', 'default', 330, 520, .9, { view: 'back', rim: { col: '#9ff6ff', side: 'r' } })], front: [FX.shards(14, 23)] },
    // A hall of cracked mirrors, one Kyouya in every glass
    cg_mall: { bg: 'mall', pan: 3,
      mid: [ch('kyouya', 'smug', 'point', 180, 220, 1.0, { flip: 1, ghost: { col: '#9ff6ff', mode: 'dither' } }), ch('kyouya', 'smug', 'think', 1420, 220, 1.0, { ghost: { col: '#9ff6ff', mode: 'dither' } }),
        ch('kyouya', 'smirk', 'point', 400, 110, 1.5, { flip: 1, turn: .4, ghost: { col: '#bff6ff', mode: 'dither' } }), ch('kyouya', 'cold', 'cross', 1200, 110, 1.5, { turn: -.4, ghost: { col: '#bff6ff', mode: 'dither' } }),
        PR.cracks(1180, 260, 4, 8), ch('kyouya', 'smug', 'point', 800, 40, 2.0, { turn: -.2, rim: { col: '#e8ffff', side: 't' } })], front: [FX.sparkles(8, '#bff6ff')], tint: 'radial-gradient(circle at 50% 40%,transparent,rgba(0,40,60,.5))' },
    // Kaede's dash: afterimages, a falling Hikari, hands about to meet
    cg_kaede_save: { bg: 'glass_city', tone: { col: '#0a1a20', amt: .3 },
      mid: [ch('kaede', 'determined', 'reach', 200, 200, 1.5, { rot: -16, ghost: { col: '#9be8c0', mode: 'solid' } }), ch('kaede', 'determined', 'reach', 350, 180, 1.55, { rot: -16, ghost: { col: '#5ef0a0', mode: 'dither' } }),
        ch('kaede', 'determined', 'reach', 520, 160, 1.6, { rot: -16, wind: 3, rim: { col: '#e8fff2', side: 'l' } }), ch('hikari', 'surprised', 'reach', 1080, 40, 1.55, { flip: 1, rot: 38, wind: 3 })], front: [FX.streaks(), FX.leaves(6)] },
    // B.I.T. taken over, alarms on every monitor
    cg_bit: { bg: 'ops', back: [FX.rays(800, 380, '#ff3355', 16, .3)], mid: [ch('bit', 'angry', '', 800, 90, 3.0), PR.monitors()], front: [FX.speed(800, 400, '#ff8a9a')], tint: 'rgba(160,0,30,.35)', glitch: 1 },
    // Kyouya unmasked, the world cracking around him
    cg_reveal: { bg: 'rift', back: [FX.rays(800, 260, '#9ff6ff', 14, .3)], mid: [PR.cracks(1200, 260, 7, 9), ch('kyouya', 'sad', 'default', 760, -90, 2.9, { turn: .35, light: cold, rim: { col: '#9ff6ff', side: 'l' } })], front: [FX.shards(10, 31)] },
    // Operation Heartline: the squad from behind, facing the Rift
    cg_final: { bg: 'rift', pan: 5, back: [FX.rays(800, 280, '#ffd9f4', 16, .35), FX.glow(800, 280, 400, '#ffffff', 300)],
      mid: [['tetsu', 230, 'hips'], ['rei', 500, 'default'], ['sora', 1100, 'cheer'], ['kaede', 1370, 'fist'], ['hikari', 800, 'fist']].map(([id, x, p], k) => ch(id, 'determined', p, x, id === 'hikari' ? 250 : 300, id === 'hikari' ? 1.25 : 1.12, { view: 'back', wind: 2, ph: k * .2, rim: { col: '#ffe8ff', side: 't' } })),
      front: [FX.speed(800, 300), FX.sparkles(6)] },
    // Sora floating above the rooftop, reaching down to you
    cg_roof_sora: { bg: 'rooftop', tone: { col: '#140a30', amt: .3 }, back: [FX.stars(60, 29, 420)], mid: [ch('sora', 'love', 'reach', 800, 0, 1.9, { wind: 2.2, rot: -6, light: night, rim: { col: '#ffd6ea', side: 't' } }), PR.ledge(820, '#4a4060')], front: [FX.sparkles(8, '#ffd6ea')] },
    // Endings
    cg_end_hikari: { bg: 'park', pan: 4, mid: [ch('hikari', 'laugh', 'cheer', 800, 30, 2.05, { of: 'casual', turn: .2, wind: 1.8, light: warm, rim: { col: '#fff6d0', side: 'l' } })], front: [FX.petals(22)] },
    cg_end_rei: { bg: 'rooftop', tone: { col: '#0a0620', amt: .45 }, back: [FX.stars(80, 41, 480), FX.moon(360, 170, 70), FX.shoot()], mid: [ch('rei', 'smile', 'wave', 760, 150, 1.45, { of: 'casual', view: 'back', rim: { col: '#e0d8ff', side: 't' } }), PR.railing(700)], front: [FX.fireflies(8)] },
    cg_end_mira: { bg: 'cafe', back: [FX.windows()], mid: [ch('mira', 'laugh', 'heart', 800, 30, 1.8, { of: 'casual', sit: 1, turn: -.25, light: warm, rim: { col: '#fff4d0', side: 'l' } }), PR.table(640)], front: [FX.sparkles(4, '#fff0c0')] },
    cg_end_sora: { bg: 'stage', back: [FX.crowd(560), FX.spot(420, '#ffd6ea'), FX.spot(1180, '#d6e8ff')], mid: [ch('sora', 'happy', 'cheer', 800, 140, 1.8, { of: 'formal', view: 'back', rim: { col: '#fff0f8', side: 't' } })], front: [FX.confetti(40)] },
    cg_end_kaede: { bg: 'park', mid: [PR.bench(640), ch('kaede', 'tender', 'shy', 800, -20, 1.45, { of: 'casual', sit: 1, turn: .3, light: warm, wind: 1.4 }), PR.benchSeat(790)], front: [FX.leaves(10, 44)] },
    cg_end_squad: { bg: 'park', mid: [...['tetsu', 'kaede', 'rei', 'sora', 'mira'].map((id, k) => ch(id, ['smile', 'laugh', 'smile', 'excited', 'tender'][k], ['cross', 'hip', 'cross', 'cheer', 'heart'][k], [220, 460, 1140, 1380, 660][k], [140, 150, 150, 150, 160][k], 1.22, { turn: [-.2, .3, -.4, .2, .1][k], ph: k * .13 })), ch('hikari', 'happy', 'wave', 900, 110, 1.4, { turn: -.2 }), PR.photo()] },
    // Arc Two
    cg_rin: { bg: 'rift', back: [FX.burst(800, 260)], mid: [ch('rin', 'confused', 'reach', 800, 40, 1.85, { rot: 28, wind: 3, rim: { col: '#ffffff', side: 't' } })], front: [FX.sparkles(10, '#e8fcff', 7), FX.shards(8, 5)] },
    cg_natsuki: { bg: 'glass_city', tone: { col: '#2a0a00', amt: .4 }, back: [FX.glow(800, 700, 700, '#ff8a2a', 300)], mid: [ch('natsuki', 'determined', 'reach', 800, 30, 2.0, { wind: 2, light: { col: '#ff8a3a', amt: .14 }, rim: { col: '#ffe066', side: 'b' } }), PR.flames()], front: [FX.embers(36)] },
    cg_board: { bg: 'boardroom', tone: { col: '#000000', amt: .45 }, back: [FX.spot(800, '#cfd6e6', .2)], mid: [ch('kuroda', 'ominous', 'think', 800, 150, 1.15, { sit: 1, rim: { col: '#cfd6e6', side: 't' } }), PR.boardTable()], tint: 'linear-gradient(0deg,rgba(0,0,0,.5),transparent 50%)' },
    cg_konbini: { bg: 'konbini_hq', mid: [...[['tetsu', 'smile', 'cross', 260], ['kaede', 'smirk', 'hip', 510], ['rei', 'cold', 'cross', 1090], ['sora', 'happy', 'wave', 1340], ['hikari', 'excited', 'cheer', 800]].map(([id, e, p, x], k) => ch(id, e, p, x, id === 'hikari' ? 170 : 230, id === 'hikari' ? 1.15 : 1.05, { of: 'casual', sit: 1, turn: (800 - x) / 900, ph: k * .2 })), PR.lowTable()] },
    cg_aegis: { bg: 'ascension', back: [FX.hexwall()], mid: [ch('shiori', 'cold', 'point', 820, -20, 2.35, { turn: -.3, wind: 1.8, rim: { col: '#fff4c0', side: 'r' } })], front: [FX.streaks('#fff4c0', 10)] },
    cg_blacksite: { bg: 'blacksite', tone: { col: '#0a1020', amt: .4 }, back: [FX.spot(800, '#cfe0ff', .22)], mid: [ch('hikari', 'sad', 'shy', 800, 190, 1.55, { sit: 1, turn: .2, light: cold, rim: { col: '#cfe0ff', side: 't' } }), FX.bars()] },
    cg_broadcast: { bg: 'dome', back: [FX.spot(300, '#ffd6ea'), FX.spot(1300, '#d6e8ff'), FX.rays(800, 200, '#ff9ad8', 12, .2)], mid: [ch('sora', 'singing', 'heart', 800, 20, 2.05, { of: 'formal', turn: .15, rim: { col: '#ffe0f0', side: 't' } }), FX.crowd(), PR.viewfinder()] },
    cg_ascension: { bg: 'ascension', back: [FX.sun(800, 250, 150)], mid: [...['kaede', 'rei', 'hikari', 'sora', 'tetsu'].map((id, k) => ch(id, 'determined', 'default', 520 + k * 140, 560, .62, { view: 'back', wind: 2, rim: { col: '#ffe0f0', side: 't' } })), PR.ledge(840, '#3a2a4a')], front: [FX.sparkles(12, '#ffe0f0', 19)] },
    cg_chairman: { bg: 'ascension', tone: { col: '#200010', amt: .4 }, back: [FX.rings(800, 300, '#ff3a6a')], mid: [ch('kuroda', 'ominous', 'point', 800, -300, 3.6, { light: { col: '#ff3a6a', amt: .1 }, rim: { col: '#ff8aa8', side: 'b' } })] },
    cg_truth: { bg: 'memorial', back: [FX.glow(800, 300, 700, '#fff0d0', 360)], mid: [ch('kyouya', 'crysmile', 'default', 900, 40, 1.9, { turn: -.35, light: warm }), ch('rin', 'love', 'reach', 700, 140, 1.8, { view: 'back', light: warm, rim: { col: '#fff4d0', side: 't' } }), ch('aya', 'tender', 'heart', 1380, 150, 1.45, { turn: -.45, light: warm })], front: [FX.petals(14, '#ffe0c0', 51)] },
    cg_festival: { bg: 'festival', pan: 4, back: [FX.fireworks([[300, 170, 190, '#ff5d85', 0], [800, 110, 230, '#ffd54a', .35], [1300, 180, 180, '#5ef0a0', .7]])],
      mid: [['kaede', 260], ['rei', 1060], ['sora', 1330], ['mira', 530], ['hikari', 800]].map(([id, x], k) => ch(id, 'happy', id === 'hikari' ? 'cheer' : id === 'sora' ? 'wave' : 'default', x, 300, 1.2, { of: 'yukata', view: 'back', ph: k * .2, rim: { col: '#ffe6a0', side: 't' } })) },
    cg_snowsquad: { bg: 'snow_city', mid: [ch('kaede', 'smirk', 'point', 330, 130, 1.3, { of: 'winter', turn: .5 }), ch('tetsu', 'laugh', 'cross', 620, 150, 1.25, { of: 'winter', turn: .3 }), ch('mira', 'tender', 'heart', 1360, 170, 1.2, { of: 'winter', turn: -.4 }), ch('rin', 'awe', 'cheer', 1110, 170, 1.2, { of: 'winter', turn: -.3 }), ch('hikari', 'shocked', 'shy', 880, 110, 1.35, { of: 'winter', turn: -.4 }), PR.snowball()], front: [FX.snow(80)] }
  };
  // Route CGs: one festival night, one snowfall and one Ferris-wheel ride per heroine, each staged differently
  const ROUTE = {
    hikari: { fest: [ch('hikari', 'excited', 'fist', 800, -30, 2.4, { of: 'yukata', turn: .3, light: { col: '#ffd54a', amt: .08 } }), PR.sparkler(1010, 560)], col: '#ffd54a',
      snow: [ch('hikari', 'tease', 'cheer', 800, 10, 2.1, { of: 'winter', turn: .2, wind: 1.4 })], ferris: [ch('hikari', 'laugh', 'point', 800, 10, 2.25, { of: 'casual', sit: 1, turn: .55 })], gc: '#ffe6a0' },
    rei: { fest: [ch('rei', 'blush', 'shy', 800, -30, 2.4, { of: 'yukata', turn: -.55, light: { col: '#ff8a5a', amt: .08 } }), PR.lanterns()], col: '#b99bff',
      snow: [ch('rei', 'tender', 'heart', 860, -30, 2.4, { of: 'winter', turn: -.4 }), PR.scarf(900, 520)], ferris: [ch('rei', 'shy', 'cross', 800, 10, 2.25, { of: 'casual', sit: 1, turn: -.65 })], gc: '#d8c8ff' },
    mira: { fest: [ch('mira', 'tender', 'heart', 800, -30, 2.4, { of: 'yukata', turn: .25 }), PR.goldfish(1080, 640)], col: '#ff8fb8',
      snow: [ch('mira', 'blush', 'think', 800, -40, 2.5, { of: 'winter', turn: -.3 }), PR.breath(880, 520)], ferris: [ch('mira', 'love', 'heart', 800, 10, 2.25, { of: 'casual', sit: 1, turn: .15 })], gc: '#ffd0e0' },
    sora: { fest: [PR.steps(640), ch('sora', 'happy', 'wave', 800, 60, 1.75, { of: 'yukata', sit: 1, turn: -.2 })], col: '#ff6fae',
      snow: [ch('sora', 'awe', 'cheer', 800, 30, 2.0, { of: 'winter', rot: 10, wind: 3 })], ferris: [ch('sora', 'singing', 'wave', 800, 10, 2.25, { of: 'casual', sit: 1, turn: -.4 })], gc: '#e0d8ff' },
    kaede: { fest: [ch('kaede', 'embarrassed', 'default', 800, 170, 1.6, { of: 'yukata', view: 'back', wind: 1.4, rim: { col: '#dcffea', side: 't' } })], col: '#5ef0a0',
      snow: [PR.bench(620, '#6a5a50'), ch('kaede', 'smirk', 'hip', 800, -20, 1.45, { of: 'winter', sit: 1, turn: .3 }), PR.benchSeat(790, '#6a5a50')], ferris: [ch('kaede', 'flustered', 'shy', 800, 10, 2.25, { of: 'casual', sit: 1, turn: .35 })], gc: '#c8f5dc' }
  };
  Object.keys(ROUTE).forEach((id, n) => {
    const R = ROUTE[id];
    C['cg_fest_' + id] = { bg: 'festival', tone: { col: '#0a0620', amt: .25 }, pan: 3, back: [FX.fireworks([[380, 160, 200, R.col, 0], [1240, 140, 180, '#ffffff', .5], [820, 90, 130, R.col, .25]])], mid: R.fest, front: [FX.sparkles(4, R.col, 60 + n)], tint: 'linear-gradient(0deg,rgba(255,120,80,.15),transparent)' };
    C['cg_snow_' + id] = { bg: 'snow_city', back: [FX.glow(800, 420, 560, '#e0ecff', 320)], mid: R.snow, front: [FX.snow(70, 70 + n)], tint: 'linear-gradient(0deg,rgba(180,200,255,.2),transparent)' };
    C['cg_ferris_' + id] = { bg: 'amusement', tone: { col: '#140a30', amt: .35 }, mid: [PR.gondolaSeat(R.gc), ...R.ferris, PR.window()], front: [FX.sparkles(3, '#ffffff', 80 + n)] };
  });

  // ---------- painting ----------
  const B = { W, H, s: S, ox: 0, oy: 0 };
  const run = (x, list, t, i, LN = '#1c1426') => list.map(fn => { const g = G(x, LN); fn(g, t, i); return g; });
  function frame(spec, bgA, t, i) {
    // background with camera drift and tone
    const pan = Math.round(Math.sin(t * TAU) * (spec.pan || 0) / 2), out = new Uint8ClampedArray(bgA.length);
    const u = new Uint32Array(bgA.buffer.slice(0)), o32 = new Uint32Array(out.buffer);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) o32[y * W + x] = u[y * W + Math.min(W - 1, Math.max(0, x + pan))];
    if (spec.tone) { const c = PX.hexToRgb(spec.tone.col); for (let p = 0; p < out.length; p += 4) for (let j = 0; j < 3; j++) out[p + j] += (c[j] - out[p + j]) * spec.tone.amt; }
    const lay = a => { if (!a) return; for (let p = 0; p < a.length; p += 4) if (a[p + 3]) { out[p] = a[p]; out[p + 1] = a[p + 1]; out[p + 2] = a[p + 2]; } };
    if (spec.back) lay(PixelCast.hiPaint(Object.assign({ bare: 1 }, B), x => run(x, spec.back, t, i)));
    // mid: consecutive props share a pass; each character gets its own pass so it can take its own light
    let props = [], k = 0;
    const flush = () => { if (props.length) { const ps = props; lay(PixelCast.hiPaint(B, x => run(x, ps, t, i))); props = []; } };
    for (const m of spec.mid || []) {
      if (typeof m === 'function') { props.push(m); continue; }
      flush(); const idx = k++;
      const a = PixelCast.hiPaint(B, x => drawCast(x, m, t, i, idx));
      if (a && (m.light || m.rim)) light(a, m.light, m.rim);
      lay(a);
    }
    flush();
    if (spec.front) lay(PixelCast.hiPaint(Object.assign({ bare: 1 }, B), x => run(x, spec.front, t, i)));
    if (spec.glitch) glitch(out, i);
    return out;
  }
  // System Breach: shifted scanline slices, a different tear every frame
  function glitch(a, i) {
    const r = rng(100 + i), u = new Uint32Array(a.buffer);
    for (let k = 0; k < 5; k++) { const y0 = r() * H | 0, h = 2 + r() * 10 | 0, dx = (r() - .5) * 30 | 0; for (let y = y0; y < Math.min(H, y0 + h); y++) { const row = u.slice(y * W, y * W + W); for (let x = 0; x < W; x++) u[y * W + x] = row[(x - dx + W) % W]; } }
  }
  function build(name) {
    const spec = C[name];
    return async early => {
      const bgA = await PixelBG.still(spec.bg), idle = [];
      for (let i = 0; i < NF; i++) { idle.push(PX.toURL(frame(spec, bgA, i / NF, i), W, H)); if (!i) early(idle[0]); await new Promise(r => setTimeout(r, 0)); }
      return { seq: { idle }, fd: { idle: 170 } };
    };
  }
  function markup(name, pri = 2) {
    const n = C[name] ? name : 'cg_strike', k = 'g|' + n, spec = C[n];
    PX.request(k, build(n), pri); const { src } = PX.srcFor(k);
    return `<div class="cgscene pxcg"><img class="pxa pxcgimg" data-k="${k}"${src ? ` src="${src}"` : ''} alt="">${spec.tint ? `<div class="cgtint" style="background:${spec.tint}"></div>` : ''}</div>`;
  }
  return { markup, specs: C, FX, PR, frame };
})();

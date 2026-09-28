/* HEARTLINE AGENCY — pixel CGs.
   48 event illustrations recomposed as animated pixel scenes on a 400 x 225 grid (1600 x 900 design units):
   the pixel background, a dithered light pass (rays, glows, fireworks, spotlights), an outlined pass with
   the cast and monsters in CG-only framings (close-ups, dutch angles, mirrored doubles, gondola windows)
   and a front pass of weather and particles. Six frames per CG, so hair, auras and effects keep moving. */
const PixelCG = (() => {
  const W = 400, H = 225, S = .25, K = PixelCast.K, NF = 6, TAU = Math.PI * 2;
  const { G, drawChar, star, star4, heartD } = PixelCast;
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

  // ---------- placing the cast and monsters in a CG ----------
  const ch = (id, emo, pose, x, y, sc, o = {}) => Object.assign({ id, emo, pose, x, y, sc }, o);
  function drawCast(x, c, t, i) {
    x.save(); x.translate(c.x, c.y); if (c.rot) x.rotate(c.rot * Math.PI / 180); x.scale(c.flip ? -c.sc : c.sc, c.sc); x.translate(-200, 0);
    if (c.alpha) x.globalAlpha = c.alpha;
    let g;
    if (c.id === 'bit') { g = G(x, '#1c1830'); x.translate(100, 0); PixelMon.drawBit(g, c.emo, t); }
    else if (PixelMon.MON[c.id]) { g = G(x, '#0e1a3a'); x.translate(-100, 0); PixelMon.MON[c.id](g, t, i); }
    else g = drawChar(x, c.id, { emo: c.emo, pose: c.pose, of: c.of, t: (t + (c.ph || 0)) % 1, frame: i, breath: i >= 2 && i < 5 });
    x.globalAlpha = 1; x.restore();
    return g;
  }
  const SOLO = (id, emo, pose, of, o) => ch(id, emo, pose, 800, 30, 2.05, Object.assign({ of }, o));
  const CLOSE = (id, emo, pose, of, o) => ch(id, emo, pose, 800, -44, 2.75, Object.assign({ of }, o));
  const LINE5 = (ids, emos, poses, of, big = 2) => ids.map((id, k) => ch(id, emos[k], poses[k], [230, 510, 800, 1090, 1370][k], k === big ? 70 : 130, k === big ? 1.5 : 1.3, { of, ph: k * .17, z: k === big ? 1 : 0 })).sort((a, b) => a.z - b.z);
  const mon = (kind, x, y, sc, o = {}) => Object.assign({ id: kind, x, y, sc, emo: '', pose: '' }, o);

  // ---------- the 48 CGs ----------
  const C = {
    cg_strike: { bg: 'street_night', back: [FX.glow(1160, 460, 300, '#ff3355')], cast: [mon('hound', 1180, 170, 1.05, { flip: 1 }), ch('hikari', 'angry', 'fist', 470, 70, 1.95, { rot: -9 })], over: [FX.bolts(3)], front: [FX.speed(1160, 460), FX.sparkles(6)] },
    cg_recruit: { bg: 'street_night', back: [FX.spot(800, '#fff6e0', .28)], cast: [ch('aya', 'smug', 'point', 820, -110, 3.0)], front: [FX.rain(70)], tint: 'linear-gradient(transparent 40%,rgba(10,0,20,.55))' },
    cg_shadow: { bg: 'training', back: [FX.glow(800, 820, 700, '#2a1446', 260)], cast: [ch('rei', 'smug', 'cross', 800, 70, 2.1)], pre: [FX.tendrils()], tint: 'radial-gradient(circle at 50% 70%,transparent 35%,rgba(5,0,15,.8) 75%)' },
    cg_leviathan: { bg: 'harbor', back: [FX.glow(800, 420, 520, '#ff2050', 300)], cast: [mon('leviathan', 800, 40, 1.55)], front: [FX.shards(18), FX.rain(40)], tint: 'linear-gradient(0deg,rgba(60,0,10,.6),transparent 60%)' },
    cg_combo: { bg: 'harbor', back: [FX.rays(800, 380, '#b58aff', 12, .22)], cast: [mon('leviathan', 800, 190, 1.0), ch('rei', 'determined', 'point', 360, 130, 1.75, { rot: 4 }), ch('hikari', 'angry', 'fist', 1240, 120, 1.75, { flip: 1, rot: -4 })], pre: [FX.tendrils()], over: [FX.bolts(2, 9)], front: [FX.speed(800, 400)] },
    cg_roof_hikari: { bg: 'rooftop', back: [FX.glow(800, 640, 560, '#ffb070', 300)], cast: [CLOSE('hikari', 'love', 'shy')], front: [FX.sparkles(5, '#fff0c0'), FX.petals(10, '#ffd0a0')], tint: 'linear-gradient(0deg,rgba(255,120,80,.22),transparent)' },
    cg_roof_rei: { bg: 'rooftop', back: [FX.stars(50, 17, 380), FX.moon(1300, 150, 60)], cast: [CLOSE('rei', 'tender', 'heart')], front: [FX.fireflies(14)], tint: 'rgba(40,10,80,.35)' },
    cg_roof_mira: { bg: 'rooftop', back: [FX.glow(800, 300, 600, '#ffc0d8', 340)], cast: [CLOSE('mira', 'blush', 'heart')], front: [FX.hearts(9)], tint: 'linear-gradient(0deg,rgba(255,150,190,.2),transparent)' },
    cg_glazier: { bg: 'black', back: [FX.glow(800, 420, 520, '#1a4a6a', 360)], cast: [mon('glazier', 800, 90, 1.2)], front: [FX.shards(14, 23)] },
    cg_mall: { bg: 'mall', pre: [g => { g.fill('M60,40 L520,60 L520,880 L60,900Z', '#bfeaf2', 6, '#5a8a9a'); g.fill('M1540,40 L1080,60 L1080,880 L1540,900Z', '#bfeaf2', 6, '#5a8a9a'); }], cast: [ch('kyouya', 'smug', 'point', 300, 90, 1.7, { flip: 1, alpha: .5 }), ch('kyouya', 'smug', 'point', 1300, 90, 1.7, { flip: 1, alpha: .5 }), ch('kyouya', 'smug', 'point', 800, 30, 2.05)], front: [FX.sparkles(8, '#bff6ff')], tint: 'radial-gradient(circle at 50% 40%,transparent,rgba(0,40,60,.55))' },
    cg_kaede_save: { bg: 'glass_city', cast: [ch('kaede', 'surprised', 'shy', 470, 220, 1.6, { rot: -20 }), ch('hikari', 'determined', 'point', 1150, 60, 1.9, { flip: 1 })], front: [FX.streaks(), FX.leaves(6)] },
    cg_bit: { bg: 'ops', back: [FX.rays(800, 420, '#ff3355', 16, .3)], cast: [ch('bit', 'angry', '', 800, 140, 3.2)], front: [FX.speed(800, 440, '#ff8a9a')], tint: 'rgba(160,0,30,.4)', glitch: 1 },
    cg_reveal: { bg: 'rift', back: [FX.rays(800, 260, '#9ff6ff', 14, .3)], cast: [CLOSE('kyouya', 'sad', 'default')], front: [FX.shards(10, 31)], tint: 'linear-gradient(0deg,rgba(40,0,60,.45),transparent)' },
    cg_final: { bg: 'rift', back: [FX.rays(800, 300, '#ffd9f4', 16, .35)], cast: LINE5(['tetsu', 'rei', 'hikari', 'sora', 'kaede'], ['determined', 'cold', 'determined', 'determined', 'smirk'], ['hips', 'cross', 'fist', 'cheer', 'point']), front: [FX.speed(800, 360), FX.sparkles(6)] },
    cg_roof_sora: { bg: 'rooftop', back: [FX.stars(60, 29, 420)], cast: [CLOSE('sora', 'love', 'wave')], front: [FX.sparkles(8, '#ffd6ea')], tint: 'linear-gradient(0deg,rgba(180,140,255,.28),transparent)' },
    cg_end_hikari: { bg: 'park', cast: [ch('hikari', 'happy', 'wave', 800, 10, 2.3, { of: 'casual' })], front: [FX.petals(18)] },
    cg_end_rei: { bg: 'rooftop', back: [FX.stars(70, 41, 460), FX.moon(360, 170, 70)], cast: [ch('rei', 'smile', 'heart', 800, 10, 2.3, { of: 'casual' })], front: [FX.fireflies(10)], tint: 'rgba(20,10,60,.4)' },
    cg_end_mira: { bg: 'cafe', back: [FX.glow(800, 380, 520, '#ffe0b0', 320)], cast: [ch('mira', 'laugh', 'wave', 800, 10, 2.3, { of: 'casual' })], front: [FX.sparkles(6, '#fff0c0')] },
    cg_end_sora: { bg: 'stage', back: [FX.spot(420, '#ffd6ea'), FX.spot(1180, '#d6e8ff'), FX.spot(800, '#fff6e0', .4)], cast: [ch('sora', 'happy', 'cheer', 800, 30, 2.1, { of: 'formal' })], front: [FX.confetti(40)] },
    cg_end_kaede: { bg: 'park', cast: [ch('kaede', 'tender', 'shy', 800, 10, 2.3, { of: 'casual' })], front: [FX.leaves(10, 44)], tint: 'linear-gradient(0deg,rgba(94,240,160,.18),transparent)' },
    cg_end_squad: { bg: 'park', cast: ['tetsu', 'kaede', 'hikari', 'rei', 'sora', 'mira'].map((id, k) => ch(id, ['smile', 'laugh', 'happy', 'smile', 'excited', 'tender'][k], ['cross', 'hip', 'wave', 'cross', 'cheer', 'heart'][k], 170 + k * 252, k === 2 ? 60 : 110, k === 2 ? 1.45 : 1.3, { ph: k * .13, z: k === 2 })).sort((a, b) => a.z - b.z), front: [FX.confetti(30, 3)] },
    cg_rin: { bg: 'rift', back: [FX.burst(800, 300)], cast: [ch('rin', 'confused', 'shy', 800, 40, 2.1, { rot: 7 })], front: [FX.sparkles(10, '#e8fcff', 7)] },
    cg_natsuki: { bg: 'glass_city', back: [FX.glow(800, 700, 700, '#ff8a2a', 300)], cast: [ch('natsuki', 'determined', 'fist', 800, 30, 2.1)], front: [FX.embers(30)], tint: 'radial-gradient(circle,transparent 40%,rgba(40,20,0,.6))' },
    cg_board: { bg: 'boardroom', cast: [ch('kuroda', 'ominous', 'think', 800, 0, 2.35)], tint: 'linear-gradient(0deg,rgba(0,0,0,.65),transparent 50%)' },
    cg_konbini: { bg: 'konbini_hq', cast: LINE5(['tetsu', 'kaede', 'hikari', 'rei', 'sora'], ['smile', 'smirk', 'determined', 'cold', 'happy'], ['cross', 'hip', 'fist', 'think', 'wave'], 'casual') },
    cg_aegis: { bg: 'ascension', back: [FX.hexwall()], cast: [ch('shiori', 'cold', 'point', 800, 20, 2.1)], front: [FX.streaks('#fff4c0', 10)] },
    cg_blacksite: { bg: 'blacksite', back: [FX.spot(800, '#cfe0ff', .22)], cast: [ch('hikari', 'sad', 'shy', 800, 40, 2.1)], over: [FX.bars()], tint: 'rgba(20,30,60,.3)' },
    cg_broadcast: { bg: 'dome', back: [FX.spot(300, '#ffd6ea'), FX.spot(1300, '#d6e8ff'), FX.rays(800, 200, '#ff9ad8', 12, .2)], cast: [ch('sora', 'singing', 'heart', 800, 20, 2.05, { of: 'formal' })], front: [FX.crowd()], tint: 'linear-gradient(0deg,rgba(255,111,174,.18),transparent)' },
    cg_ascension: { bg: 'ascension', back: [FX.sun(800, 250, 150)], front: [FX.sparkles(12, '#ffe0f0', 19)] },
    cg_chairman: { bg: 'ascension', back: [FX.rings(800, 260, '#ff3a6a')], cast: [ch('kuroda', 'ominous', 'point', 800, 20, 2.2)], tint: 'rgba(80,0,40,.3)' },
    cg_truth: { bg: 'memorial', back: [FX.glow(800, 300, 700, '#fff0d0', 360)], cast: [ch('rin', 'love', 'cheer', 330, 110, 1.55, { ph: .3 }), ch('aya', 'tender', 'shy', 1270, 110, 1.55, { ph: .6 }), ch('kyouya', 'crysmile', 'default', 800, 60, 1.75)], front: [FX.petals(14, '#ffe0c0', 51)], tint: 'linear-gradient(0deg,rgba(255,220,180,.3),transparent)' },
    cg_festival: { bg: 'festival', back: [FX.fireworks([[300, 170, 170, '#ff5d85', 0], [800, 110, 200, '#ffd54a', .35], [1300, 180, 160, '#5ef0a0', .7]])], cast: LINE5(['kaede', 'hikari', 'rei', 'sora', 'mira'], ['smirk', 'excited', 'tender', 'happy', 'smile'], ['hip', 'cheer', 'shy', 'wave', 'heart'], 'yukata', 1) },
    cg_snowsquad: { bg: 'snow_city', cast: LINE5(['tetsu', 'rin', 'hikari', 'mira', 'rei'], ['smile', 'awe', 'happy', 'tender', 'blush'], ['cross', 'cheer', 'wave', 'heart', 'shy'], 'winter'), front: [FX.snow(80)] }
  };
  const FEST = { hikari: ['excited', 'cheer', '#ffd54a'], rei: ['blush', 'shy', '#b99bff'], mira: ['tender', 'heart', '#ff8fb8'], sora: ['happy', 'wave', '#ff6fae'], kaede: ['embarrassed', 'hip', '#5ef0a0'] };
  const SNOW = { hikari: ['happy', 'wave'], rei: ['tender', 'heart'], mira: ['blush', 'shy'], sora: ['awe', 'cheer'], kaede: ['smirk', 'think'] };
  const FERRIS = { hikari: ['laugh', 'default', '#ffe6a0'], rei: ['shy', 'cross', '#d8c8ff'], mira: ['love', 'heart', '#ffd0e0'], sora: ['singing', 'wave', '#e0d8ff'], kaede: ['flustered', 'shy', '#c8f5dc'] };
  Object.keys(FEST).forEach((id, n) => {
    const [e1, p1, col] = FEST[id];
    C['cg_fest_' + id] = { bg: 'festival', back: [FX.fireworks([[380, 160, 190, col, 0], [1240, 140, 170, '#ffffff', .5], [820, 90, 120, col, .25]])], cast: [CLOSE(id, e1, p1, 'yukata')], front: [FX.sparkles(4, col, 60 + n)], tint: 'linear-gradient(0deg,rgba(255,120,80,.18),transparent)' };
    const [e2, p2] = SNOW[id];
    C['cg_snow_' + id] = { bg: 'snow_city', back: [FX.glow(800, 420, 560, '#e0ecff', 320)], cast: [ch(id, e2, p2, 800, -20, 2.5, { of: 'winter' })], front: [FX.snow(70, 70 + n)], tint: 'linear-gradient(0deg,rgba(180,200,255,.22),transparent)' };
    const [e3, p3, gc] = FERRIS[id];
    C['cg_ferris_' + id] = { bg: 'amusement', cast: [ch(id, e3, p3, 800, -20, 2.7, { of: 'casual' })], over: [FX.gondola(gc)], front: [FX.sparkles(3, '#ffffff', 80 + n)], tint: 'rgba(255,120,160,.12)' };
  });

  // ---------- painting ----------
  const B = { W, H, s: S, ox: 0, oy: 0 };
  const run = (x, list, t, i, LN = '#1c1426') => list.map(fn => { const g = G(x, LN); fn(g, t, i); return g; });
  function frame(spec, bgA, t, i) {
    const out = bgA.slice();
    const lay = (a) => { if (!a) return; for (let p = 0; p < a.length; p += 4) if (a[p + 3]) { out[p] = a[p]; out[p + 1] = a[p + 1]; out[p + 2] = a[p + 2]; } };
    if (spec.back) lay(PixelCast.hiPaint(Object.assign({ bare: 1 }, B), x => run(x, spec.back, t, i)));
    const mid = [...(spec.pre || []), ...(spec.cast || []), ...(spec.over || [])];
    if (mid.length) lay(PixelCast.hiPaint(B, x => mid.map(m => typeof m === 'function' ? run(x, [m], t, i)[0] : drawCast(x, m, t, i))));
    if (spec.front) lay(PixelCast.hiPaint(Object.assign({ bare: 1 }, B), x => run(x, spec.front, t, i)));
    if (spec.glitch) glitch(out, i);
    return out;
  }
  // System Breach: shifted scanline slices and an RGB split, a different tear every frame
  function glitch(a, i) {
    const r = rng(100 + i), u = new Uint32Array(a.buffer);
    for (let k = 0; k < 5; k++) { const y0 = r() * H | 0, h = 2 + r() * 10 | 0, dx = (r() - .5) * 30 | 0; for (let y = y0; y < Math.min(H, y0 + h); y++) { const row = u.slice(y * W, y * W + W); for (let x = 0; x < W; x++) u[y * W + x] = row[(x - dx + W) % W]; } }
  }
  function build(name) {
    const spec = C[name];
    return async early => {
      const bgA = await PixelBG.still(spec.bg), idle = [];
      for (let i = 0; i < NF; i++) { idle.push(PX.toURL(frame(spec, bgA, i / NF, i), W, H)); if (!i) early(idle[0]); await new Promise(r => setTimeout(r, 0)); }
      return { seq: { idle }, fd: { idle: 180 } };
    };
  }
  function markup(name, pri = 2) {
    const n = C[name] ? name : 'cg_strike', k = 'g|' + n, spec = C[n];
    PX.request(k, build(n), pri); const { src } = PX.srcFor(k);
    return `<div class="cgscene pxcg"><img class="pxa pxcgimg" data-k="${k}"${src ? ` src="${src}"` : ''} alt="">${spec.tint ? `<div class="cgtint" style="background:${spec.tint}"></div>` : ''}</div>`;
  }
  return { markup, specs: C, FX, frame };
})();

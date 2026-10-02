/* HEARTLINE AGENCY — pixel art for Standoffs, painted by the Moonkai Pixel Engine.
   Everything the fight screen shows that is not a character or monster sprite is made here:
   - icons (elements, skills, statuses, enemy moves) drawn as vector shapes, then snapped to a 16 x 16 palette grid with an outline;
   - attack, guard, parry, heal, bind, rally and stagger effects: 8-frame sprites on a 120 x 120 grid, palette-snapped like the CGs;
   - a 5 x 7 bitmap font for damage numbers, banners and cut-ins;
   - HP and Poise bars, floor tiles, shadows and the speed-line strip behind a Skill cut-in.
   All frames go through the engine's cache (PX.request), so looping overlays use the same animator as the cast. */
const PixelFight = (() => {
  const TAU = Math.PI * 2, { G, star4 } = PixelCast, LN = '#1c1426';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), ease = q => 1 - (1 - q) * (1 - q), yieldNow = () => new Promise(r => setTimeout(r, 0));
  const rng = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };

  // ---------- 5 x 7 bitmap font ----------
  const FONT = {
    A: '01110 10001 10001 11111 10001 10001 10001', B: '11110 10001 10001 11110 10001 10001 11110', C: '01110 10001 10000 10000 10000 10001 01110', D: '11110 10001 10001 10001 10001 10001 11110',
    E: '11111 10000 10000 11110 10000 10000 11111', F: '11111 10000 10000 11110 10000 10000 10000', G: '01110 10001 10000 10111 10001 10001 01110', H: '10001 10001 10001 11111 10001 10001 10001',
    I: '01110 00100 00100 00100 00100 00100 01110', J: '00111 00010 00010 00010 00010 10010 01100', K: '10001 10010 10100 11000 10100 10010 10001', L: '10000 10000 10000 10000 10000 10000 11111',
    M: '10001 11011 10101 10101 10001 10001 10001', N: '10001 11001 10101 10011 10001 10001 10001', O: '01110 10001 10001 10001 10001 10001 01110', P: '11110 10001 10001 11110 10000 10000 10000',
    Q: '01110 10001 10001 10001 10101 10010 01101', R: '11110 10001 10001 11110 10100 10010 10001', S: '01111 10000 10000 01110 00001 00001 11110', T: '11111 00100 00100 00100 00100 00100 00100',
    U: '10001 10001 10001 10001 10001 10001 01110', V: '10001 10001 10001 10001 10001 01010 00100', W: '10001 10001 10001 10101 10101 11011 10001', X: '10001 10001 01010 00100 01010 10001 10001',
    Y: '10001 10001 01010 00100 00100 00100 00100', Z: '11111 00001 00010 00100 01000 10000 11111',
    0: '01110 10001 10011 10101 11001 10001 01110', 1: '00100 01100 00100 00100 00100 00100 01110', 2: '01110 10001 00001 00010 00100 01000 11111', 3: '11110 00001 00001 01110 00001 00001 11110',
    4: '00010 00110 01010 10010 11111 00010 00010', 5: '11111 10000 11110 00001 00001 10001 01110', 6: '00110 01000 10000 11110 10001 10001 01110', 7: '11111 00001 00010 00100 01000 01000 01000',
    8: '01110 10001 10001 01110 10001 10001 01110', 9: '01110 10001 10001 01111 00001 00010 01100',
    '-': '00000 00000 00000 11111 00000 00000 00000', '+': '00000 00100 00100 11111 00100 00100 00000', '!': '00100 00100 00100 00100 00100 00000 00100', '?': '01110 10001 00001 00010 00100 00000 00100',
    '.': '00000 00000 00000 00000 00000 01100 01100', ':': '00000 01100 01100 00000 01100 01100 00000', '/': '00001 00010 00010 00100 01000 01000 10000', "'": '00100 00100 01000 00000 00000 00000 00000',
    '%': '11001 11010 00010 00100 01000 01011 10011', '*': '00100 10101 01110 11111 01110 10101 00100', ' ': '00000 00000 00000 00000 00000 00000 00000'
  };
  const glyph = ch => (FONT[ch] || FONT['?']).split(' ');
  const textCache = new Map();
  // Draws at 1x (so the browser scales it with nearest-neighbour) and returns { src, w, h } in font pixels.
  function text(str, o = {}) {
    str = String(str).toUpperCase(); const top = o.top || '#ffffff', bot = o.bot || top, out = o.out || LN, sh = o.shadow === undefined ? '#00000066' : o.shadow, key = [str, top, bot, out, sh].join('|');
    if (textCache.has(key)) return textCache.get(key);
    const n = [...str].length, w = n * 6 - 1 + 4, h = 7 + 4, c = PX.mk(w, h), x = c.getContext('2d'), px = (gx, gy, col) => { x.fillStyle = col; x.fillRect(gx, gy, 1, 1); };
    const cells = []; [...str].forEach((ch, i) => glyph(ch).forEach((row, ry) => [...row].forEach((v, rx) => { if (v === '1') cells.push([2 + i * 6 + rx, 2 + ry]); })));
    if (sh) cells.forEach(([gx, gy]) => px(gx + 1, gy + 1, sh));
    cells.forEach(([gx, gy]) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) px(gx + dx, gy + dy, out); });
    cells.forEach(([gx, gy]) => px(gx, gy, gy - 2 < 3 ? top : bot));
    const r = { src: c.toDataURL(), w, h }; textCache.set(key, r); return r;
  }
  const textImg = (str, scale = 3, o = {}) => { const t = text(str, o); return `<img class="ptx" src="${t.src}" width="${t.w * scale}" height="${t.h * scale}" alt="${String(str).replace(/"/g, '')}">`; };

  // ---------- icons: vector shapes -> 16 x 16 palette-snapped sprites ----------
  const ring = (g, cx, cy, r, c, lw) => g.ring(cx, cy, r, r, c, lw);
  const starP = (cx, cy, r0, r1, n = 5) => { let d = ''; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? r0 : r1; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1); } return d + 'Z'; };
  const ICONS = {
    bolt: [['#ffe066', '#f0a020'], (g, [a, b]) => { g.solid('M62,2 L18,56 L44,56 L32,98 L84,36 L56,36Z', a); g.solid('M62,2 L44,34 L56,36 L32,98 L40,60Z', b); }],
    moon: [['#c9a8ff', '#7a52d8'], (g, [a, b]) => { g.solid('M62,4 A46,46 0 1 0 96,68 A38,38 0 1 1 62,4Z', a); g.solid('M62,4 A38,38 0 0 1 90,56 A30,30 0 0 0 62,4Z', b); }],
    wind: [['#8affc0', '#2fbf7a'], (g, [a, b]) => { g.line('M6,32 L58,32 Q82,32 82,18 Q82,8 72,8', a, 12); g.line('M6,54 L78,54 Q96,54 96,66 Q96,78 84,78', b, 12); g.line('M6,76 L46,76', a, 12); }],
    steel: [['#e4ebf6', '#7d8aa0'], (g, [a, b]) => { g.solid('M50,4 L88,26 L88,74 L50,96 L12,74 L12,26Z', a); g.solid('M50,4 L88,26 L88,74 L50,96Z', b); g.ell(50, 50, 18, 18, '#2c3448'); g.ell(50, 50, 10, 10, '#566078'); }],
    note: [['#ff8ad0', '#c0408a'], (g, [a, b]) => { g.ell(30, 76, 20, 15, a); g.solid('M42,70 L42,10 L88,26 L88,42 L56,32 L56,76Z', b); }],
    flame: [['#ff9a3a', '#ffe066'], (g, [a, b]) => { g.solid('M50,2 C60,26 88,40 86,68 C84,90 66,98 50,98 C34,98 16,90 14,68 C14,48 30,40 34,24 C40,34 44,34 50,2Z', a); g.solid('M50,50 C58,64 68,70 64,84 C62,94 38,94 36,84 C34,70 44,64 50,50Z', b); }],
    spark: [['#fff4b0', '#ffcf40'], (g, [a, b]) => { g.solid('M50,2 L62,38 L98,50 L62,62 L50,98 L38,62 L2,50 L38,38Z', a); g.solid('M50,22 L56,44 L78,50 L56,56 L50,78 L44,56 L22,50 L44,44Z', b); }],
    bell: [['#ffe28a', '#d09a20'], (g, [a, b]) => { g.solid('M50,6 C30,6 24,26 24,46 C24,68 10,72 10,82 H90 C90,72 76,68 76,46 C76,26 70,6 50,6Z', a); g.solid('M50,6 C70,6 76,26 76,46 C76,68 90,72 90,82 H50Z', b); g.ell(50, 90, 11, 8, b); }],
    shield: [['#7fd8ff', '#2a78d0'], (g, [a, b]) => { g.solid('M50,4 L90,18 L86,56 Q80,82 50,96 Q20,82 14,56 L10,18Z', a); g.solid('M50,4 L90,18 L86,56 Q80,82 50,96Z', b); g.solid('M50,18 L74,26 L72,52 Q68,70 50,80Z', '#dff6ff'); }],
    radar: [['#6fffd0', '#1f9a78'], (g, [a, b]) => { ring(g, 50, 50, 38, a, 10); ring(g, 50, 50, 20, b, 8); g.line('M50,50 L84,20', a, 10); g.ell(50, 50, 8, 8, a); }],
    cross: [['#6fff9f', '#20b060'], (g, [a, b]) => { g.solid('M36,6 H64 V36 H94 V64 H64 V94 H36 V64 H6 V36 H36Z', a); g.solid('M50,6 H64 V36 H94 V64 H50Z', b); }],
    chain: [['#ffd24a', '#a8741a'], (g, [a, b]) => { ring(g, 34, 34, 22, a, 13); ring(g, 66, 66, 22, b, 13); g.line('M46,46 L54,54', a, 13); }],
    book: [['#ffd24a', '#a06a20'], (g, [a, b]) => { g.solid('M10,8 H84 V92 H10Z', a); g.solid('M10,8 H28 V92 H10Z', b); g.line('M40,30 H70', '#fff6d8', 8); g.line('M40,50 H70', '#fff6d8', 8); g.line('M40,70 H60', '#fff6d8', 8); }],
    star: [['#ffe066', '#f0a020'], (g, [a, b]) => { g.solid(starP(50, 54, 20, 50), a); g.solid(starP(50, 54, 10, 26), b); }],
    diamond: [['#ffd24a', '#fff3b0'], (g, [a, b]) => { g.solid('M50,2 L94,50 L50,98 L6,50Z', a); g.solid('M50,2 L94,50 L50,50Z', b); }],
    frozen: [['#bff4ff', '#6fb8ff'], (g, [a, b]) => { g.line('M50,6 V94', a, 10); g.line('M12,28 L88,72', a, 10); g.line('M12,72 L88,28', a, 10); g.ell(50, 50, 14, 14, b); }],
    zz: [['#aab4ff', '#6a74d8'], (g, [a, b]) => { g.line('M12,14 H58 L16,56 H60', a, 11); g.line('M56,50 H92 L62,88 H94', b, 10); }],
    ghost: [['#e6e6ff', '#9a9ad0'], (g, [a, b]) => { g.solid('M50,6 C26,6 14,26 14,48 V94 L30,80 L50,94 L70,80 L86,94 V48 C86,26 74,6 50,6Z', a); g.solid('M50,6 C74,6 86,26 86,48 V94 L70,80 L50,94Z', b); g.ell(36, 44, 7, 9, '#2a2646'); g.ell(64, 44, 7, 9, '#2a2646'); }],
    hourglass: [['#ffd24a', '#ff9a3a'], (g, [a, b]) => { g.solid('M16,6 H84 L56,50 L84,94 H16 L44,50Z', a); g.solid('M30,94 H70 L50,64Z', b); }],
    wave: [['#7fd8ff', '#2a78d0'], (g, [a, b]) => { g.line('M2,34 Q18,10 34,34 T66,34 T98,34', a, 13); g.line('M2,68 Q18,44 34,68 T66,68 T98,68', b, 13); }],
    claw: [['#ff7a96', '#c02a4a'], (g, [a, b]) => { g.line('M22,6 L44,94', a, 14); g.line('M44,6 L66,94', b, 14); g.line('M66,6 L88,94', a, 14); }],
    heavy: [['#ff4560', '#a01028'], (g, [a, b]) => { g.solid('M50,2 L92,26 L92,74 L50,98 L8,74 L8,26Z', a); g.solid('M50,2 L92,26 L92,74 L50,98Z', b); g.line('M50,24 V58', '#fff4f4', 13); g.ell(50, 76, 8, 8, '#fff4f4'); }],
    spiral: [['#ffd24a', '#ff9a3a'], (g, [a, b]) => { g.line('M50,50 m-4,0 a4,4 0 1 1 8,0 a12,12 0 1 1 -24,0 a22,22 0 1 1 44,0 a32,32 0 1 1 -64,0', a, 10); g.ell(50, 50, 7, 7, b); }],
    mirror: [['#bff4ff', '#6fb8ff'], (g, [a, b]) => { g.solid('M22,4 H78 Q94,4 94,20 V80 Q94,96 78,96 H22 Q6,96 6,80 V20 Q6,4 22,4Z', b); g.solid('M22,12 H78 Q86,12 86,20 V80 Q86,88 78,88 H22 Q14,88 14,80 V20 Q14,12 22,12Z', a); g.line('M24,72 L60,28', '#ffffff', 9); g.line('M44,82 L72,50', '#ffffff', 6); }],
    megaphone: [['#ffd24a', '#c08a20'], (g, [a, b]) => { g.solid('M6,38 H32 L82,8 V92 L32,62 H6Z', a); g.solid('M32,38 L82,8 V92 L32,62Z', b); g.solid('M12,62 H30 L38,96 H22Z', b); }],
    sword: [['#e4ebf6', '#ffd24a'], (g, [a, b]) => { g.line('M20,80 L82,18', a, 15); g.line('M10,50 L50,90', b, 13); g.line('M78,22 L90,10', b, 13); }],
    ring: [['#ffe28a', '#fff6c8'], (g, [a, b]) => { ring(g, 50, 50, 40, a, 10); ring(g, 50, 50, 22, b, 9); g.ell(50, 50, 7, 7, a); }],
    heart: [['#ff6a96', '#c02a5a'], (g, [a, b]) => { g.solid('M50,92 C6,58 6,22 30,12 C42,8 50,16 50,26 C50,16 58,8 70,12 C94,22 94,58 50,92Z', a); g.solid('M50,92 C94,58 94,22 70,12 C58,8 50,16 50,26Z', b); }]
  };
  const iconCache = new Map(), IB = { W: 16, H: 16, s: .14, ox: -7.2, oy: -7.2 };
  function iconURL(name, pal) {
    const def = ICONS[name]; if (!def) return '';
    const colors = pal || def[0], key = name + colors.join(''); if (iconCache.has(key)) return iconCache.get(key);
    const a = PixelCast.hiPaint(IB, x => { const g = G(x, LN); def[1](g, colors); return g; }); const src = a ? PX.toURL(a, 16, 16) : '';
    iconCache.set(key, src); return src;
  }
  const icon = (name, scale = 2, cls = '', pal) => `<img class="pic ${cls}" src="${iconURL(name, pal)}" width="${16 * scale}" height="${16 * scale}" alt="">`;
  const ELEM = { lightning: ['bolt', 'Lightning'], shadow: ['moon', 'Shadow'], wind: ['wind', 'Wind'], steel: ['steel', 'Steel'], sound: ['note', 'Sound'], fire: ['flame', 'Fire'], light: ['spark', 'Hard-light'] };
  const SKILL_ICON = { hikari: 'bolt', rei: 'moon', kaede: 'wind', tetsu: 'steel', sora: 'note', rin: 'bell', natsuki: 'flame', shiori: 'spark' };
  const MOVE_ICON = { single: 'claw', sweep: 'wave', charge: 'spiral', shield: 'shield', mirror: 'mirror', bind: 'frozen', stag: 'star' };

  // ---------- bars (1x pixel art, stretched with nearest-neighbour) ----------
  const barCache = new Map();
  function barImg(kind) {
    if (barCache.has(kind)) return barCache.get(kind);
    const P = { frame: ['#1c1426', '#2a2146', '#3a2f5e'], hp: ['#6fe08a', '#3fb862', '#2a8848'], foe: ['#ff8a6a', '#ff3355', '#b01838'], poise: ['#bff4ff', '#6fd8ff', '#3a8ac8'], pip: ['#bff4ff', '#6fd8ff', '#3a8ac8'] }, c = PX.mk(32, 8), x = c.getContext('2d'), px = (a, b, col) => { x.fillStyle = col; x.fillRect(a, b, 1, 1); };
    if (kind === 'frame') { for (let i = 0; i < 32; i++) for (let j = 0; j < 8; j++) px(i, j, j === 0 || j === 7 || i === 0 || i === 31 ? P.frame[0] : j === 1 ? P.frame[2] : P.frame[1]); }
    else { const [h, m, d] = P[kind]; for (let i = 0; i < 32; i++) for (let j = 1; j < 7; j++) px(i, j, j === 1 ? h : j >= 5 ? d : m); for (let i = 3; i < 32; i += 4) for (let j = 1; j < 7; j++) if (j !== 1) px(i, j, d); }
    const u = c.toDataURL(); barCache.set(kind, u); return u;
  }

  // ---------- effects: 120 x 120 px, 8 frames, drawn in 600 x 600 design units ----------
  const FB = { W: 120, H: 120, s: .2, ox: 0, oy: 0 };
  const PAL = { lightning: ['#fff27a', '#2a4fd6', '#ffffff'], shadow: ['#c9a0ff', '#2a1446', '#7a52d8'], wind: ['#9ff0c0', '#1f8a5a', '#e8fff2'], steel: ['#e8eef8', '#4a5668', '#ffffff'], sound: ['#ffb3de', '#a02a78', '#ffffff'],
    fire: ['#ffb040', '#c02a10', '#ffe888'], light: ['#fff4c0', '#c89a20', '#ffffff'], guard: ['#8fe0ff', '#2a78d0', '#ffffff'], heal: ['#8affb0', '#1f9a58', '#e8fff2'], foe: ['#ff6a8a', '#7a0820', '#ffd0da'], glass: ['#bff4ff', '#2a4c9a', '#ffffff'], kneel: ['#ff7a96', '#5a0820', '#ffd24a'] };
  const crescent = (g, x0, y0, x1, y1, bulge, w, a, b) => {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    g.solid(`M${x0},${y0} Q${mx + nx * bulge},${my + ny * bulge} ${x1},${y1} Q${mx + nx * (bulge - w)},${my + ny * (bulge - w)} ${x0},${y0}Z`, a);
    g.line(`M${x0 + (x1 - x0) * .08},${y0 + (y1 - y0) * .08} Q${mx + nx * (bulge - w * .3)},${my + ny * (bulge - w * .3)} ${x1 - (x1 - x0) * .08},${y1 - (y1 - y0) * .08}`, b, 5);
  };
  const jag = (g, x0, y0, x1, y1, r, wA, cA, wB, cB) => { let d = `M${x0},${y0}`; for (let k = 1; k <= 7; k++) { const q = k / 7; d += ` L${(x0 + (x1 - x0) * q + (k < 7 ? (r() - .5) * 90 : 0)) | 0},${(y0 + (y1 - y0) * q + (k < 7 ? (r() - .5) * 40 : 0)) | 0}`; } g.line(d, cA, wA); g.line(d, cB, wB); return d; };
  const FXS = {
    // two or three crossing cuts that grow, then fade into a spark
    slash: (g, q, i, [a, b, c]) => { for (let k = 0; k < 3; k++) { const p = clamp(q * 2.4 - k * .5, 0, 1); if (p <= 0) continue; const fade = q > .7 ? 1 - (q - .7) / .3 : 1, ang = (-40 + k * 40) * Math.PI / 180, L = 270 * ease(p), cx = 300 + (k - 1) * 24, cy = 300 + (k - 1) * 14; if (fade <= 0) continue;
      crescent(g, cx - Math.cos(ang) * L, cy - Math.sin(ang) * L, cx + Math.cos(ang) * L, cy + Math.sin(ang) * L, 110, Math.max(16, 110 * fade * (1 - p * .35)), a, c); }
      if (q > .2 && q < .9) { star4(g, 300, 300, 120 * (1 - Math.abs(q - .5) * 1.6), c); } },
    bolt: (g, q, i, [a, b, c]) => { const r = rng(7 + i), fade = q > .65 ? 1 - (q - .65) / .35 : 1; if (q < .3) g.ell(300, 330, 150 * (1 - q * 3), 150 * (1 - q * 3), c);
      jag(g, 300 + (r() - .5) * 60, -20, 300, 340, r, 76 * fade, b, 42 * fade, a); if (q > .15) { jag(g, 300, 260, 100 + r() * 60, 500, r, 40 * fade, b, 20 * fade, a); jag(g, 300, 260, 500 - r() * 60, 500, r, 40 * fade, b, 20 * fade, a); } g.line('M300,-20 L300,320', c, 14 * fade);
      if (q > .2) ring(g, 300, 420, 40 + q * 200, a, Math.max(8, 30 * (1 - q))); },
    bind: (g, q, i, [a, b, c]) => { const sq = ease(q); for (let k = 0; k < 7; k++) { const ang = k / 7 * TAU + q * 2.2, r0 = 260 * (1 - sq * .55), x0 = 300 + Math.cos(ang) * r0, y0 = 540 - sq * 90 + Math.sin(ang) * 50, x1 = 300 + Math.cos(ang + 1.4) * 70 * (1 - sq * .4), y1 = 520 - sq * 330 + k * 10;
        g.line(`M${x0},${y0} Q${300 + Math.cos(ang + .7) * 190 * (1 - sq * .5)},${(y0 + y1) / 2 + 40} ${x1},${y1}`, b, 64 * (1 - q * .3)); g.line(`M${x0},${y0} Q${300 + Math.cos(ang + .7) * 190 * (1 - sq * .5)},${(y0 + y1) / 2 + 40} ${x1},${y1}`, a, 30 * (1 - q * .3)); }
      g.ell(300, 260, 54 * sq, 54 * sq, c, 0); },
    gale: (g, q, i, [a, b, c]) => { for (let k = 0; k < 4; k++) { const p = clamp(q * 1.7 - k * .18, 0, 1); if (p <= 0) continue; const y = 170 + k * 80, x0 = -40 + ease(p) * 700 - 260, fade = p > .8 ? 1 - (p - .8) * 5 : 1; g.line(`M${x0},${y + 30} Q${x0 + 120},${y - 50} ${x0 + 260},${y}`, b, 40 * fade); g.line(`M${x0 + 10},${y + 26} Q${x0 + 120},${y - 44} ${x0 + 250},${y}`, a, 22 * fade); }
      for (let k = 0; k < 5; k++) { const x = ((q * 1.2 + k * .23) % 1) * 640 - 20, y = 180 + k * 70 + Math.sin((q + k) * 6) * 24; g.fill(`M${x},${y} q14,-16 30,-2 q-14,16 -30,2Z`, k % 2 ? a : c, 0); } },
    guard: (g, q, i, [a, b, c]) => { const sc = .55 + ease(q) * .45, fade = q > .6 ? 1 - (q - .6) / .4 : 1, pts = r => [0, 1, 2, 3, 4, 5].map(k => [300 + Math.cos(k * TAU / 6 + TAU / 12) * r, 300 + Math.sin(k * TAU / 6 + TAU / 12) * r]);
      if (q < .25) g.ell(300, 300, 180, 180, c); g.poly(pts(230 * sc), b, 0); g.poly(pts(210 * sc), a, 0);
      for (let k = 0; k < 6; k++) { const [x, y] = pts(210 * sc)[k]; g.line(`M300,300 L${x},${y}`, c, 7 * fade); } g.poly(pts(112 * sc), b, 0); g.poly(pts(96 * sc), c, 0); },
    parry: (g, q, i, [a, b, c]) => { const L = 90 + ease(q) * 230, fade = q > .6 ? 1 - (q - .6) / .4 : 1; for (let k = 0; k < 8; k++) { const ang = k * TAU / 8 + .2, w = (k % 2 ? 22 : 36) * fade; g.solid(`M${300 + Math.cos(ang - .09) * 30},${300 + Math.sin(ang - .09) * 30} L${300 + Math.cos(ang) * L * (k % 2 ? .7 : 1)},${300 + Math.sin(ang) * L * (k % 2 ? .7 : 1)} L${300 + Math.cos(ang + .09) * 30},${300 + Math.sin(ang + .09) * 30}Z`, k % 2 ? a : c); }
      ring(g, 300, 300, 40 + q * 200, a, 20 * fade + 2); if (q < .5) g.ell(300, 300, 70 * (1 - q * 1.6), 70 * (1 - q * 1.6), c); },
    heal: (g, q, i, [a, b, c]) => { for (let k = 0; k < 6; k++) { const p = (q * 1.1 + k / 6) % 1, x = 120 + (k % 3) * 170 + Math.sin((p + k) * 6) * 22, y = 560 - p * 520, s = 40 - p * 12 + (k % 2) * 10; g.solid(`M${x - s * .38},${y - s} H${x + s * .38} V${y - s * .38} H${x + s} V${y + s * .38} H${x + s * .38} V${y + s} H${x - s * .38} V${y + s * .38} H${x - s} V${y - s * .38} H${x - s * .38}Z`, k % 2 ? a : c); if ((k + i) % 2) star4(g, x + 40, y - 34, 14, c); } },
    rally: (g, q, i, [a, b, c]) => { for (let k = 0; k < 3; k++) { const p = (q + k / 3) % 1; ring(g, 300, 330, 60 + p * 250, k % 2 ? a : c, 16 * (1 - p) + 2); }
      for (let k = 0; k < 4; k++) { const p = clamp(q * 1.3 - k * .1, 0, 1), x = 130 + k * 115, y = 460 - ease(p) * 300 + Math.sin(k * 2 + q * 8) * 18, s = 30; if (p <= 0) continue; g.ell(x, y, s * .8, s * .6, k % 2 ? a : c); g.solid(`M${x + s * .6},${y} V${y - s * 2} L${x + s * 1.5},${y - s * 1.5} V${y - s * 1.1} L${x + s * .9},${y - s * 1.35} V${y}Z`, k % 2 ? c : a); } },
    stagger: (g, q) => { for (let k = 0; k < 3; k++) { const ang = q * TAU + k * TAU / 3, x = 300 + Math.cos(ang) * 150, y = 300 + Math.sin(ang) * 46; if (Math.sin(ang) > -.9) star4(g, x, y, 54, k % 2 ? '#fff6a8' : '#ffd24a'); } },
    impact: (g, q, i, [a, b, c]) => { const L = 60 + ease(q) * 190, fade = q > .55 ? 1 - (q - .55) / .45 : 1; if (q < .45) g.ell(300, 300, 120 * (1 - q * 1.6) + 20, 120 * (1 - q * 1.6) + 20, c);
      for (let k = 0; k < 7; k++) { const ang = k * TAU / 7 + .4, l = L * (.6 + (k % 3) * .2), w = 24 * fade; g.solid(`M${300 + Math.cos(ang - .14) * 40},${300 + Math.sin(ang - .14) * 40} L${300 + Math.cos(ang) * l},${300 + Math.sin(ang) * l} L${300 + Math.cos(ang + .14) * 40},${300 + Math.sin(ang + .14) * 40}Z`, k % 2 ? a : c); } },
    mirror: (g, q, i, [a, b, c]) => { const fade = q > .6 ? 1 - (q - .6) / .4 : 1; g.solid('M150,60 H450 L480,540 H120Z', b); g.solid('M170,84 H430 L452,516 H148Z', a); g.line(`M${190 + q * 80},470 L${380 + q * 60},120`, c, 26 * fade); g.line(`M${260 + q * 80},500 L${420 + q * 40},300`, c, 14 * fade); },
    kneel: (g, q, i, [a, b, c]) => { for (let k = 0; k < 3; k++) { const x = 160 + k * 140, p = ease(clamp(q * 1.5 - k * .12, 0, 1)); for (let j = 0; j < 7; j++) { const y = -40 + p * 470 - j * 62; if (y < -30) continue; ring(g, x + (j % 2 ? 12 : -12), y, 22, j % 2 ? a : c, 12); } }
      ring(g, 300, 540, 60 + ease(q) * 150, a, 14); },
    charge: (g, q, i, [a, b, c]) => { const r = rng(5); for (let k = 0; k < 14; k++) { const ang = r() * TAU, d0 = 280 + r() * 60, p = ease(clamp(q * 1.2 - r() * .2, 0, 1)), d = d0 * (1 - p) + 30; g.ell(300 + Math.cos(ang) * d, 300 + Math.sin(ang) * d * .8, 18 * (1 - p * .5), 18 * (1 - p * .5), k % 2 ? a : c); } g.ell(300, 300, 20 + ease(q) * 70, 20 + ease(q) * 70, q > .7 ? c : a); },
    kneeled: (g, q, i, [a, b, c]) => { for (let k = 0; k < 3; k++) { const x = 170 + k * 130; for (let j = 0; j < 6; j++) ring(g, x + (j % 2 ? 10 : -10) + Math.sin(q * TAU + j + k) * 5, 24 + j * 64 + Math.sin((q + k / 3) * TAU) * 5, 20, j % 2 ? a : c, 11); } ring(g, 300, 560, 130 + Math.sin(q * TAU) * 10, a, 14); },
    nova: (g, q, i, [a, b, c]) => { const R = 30 + ease(q) * 250; ring(g, 300, 300, R, a, 44 * (1 - q) + 8); ring(g, 300, 300, R * .72, c, 20 * (1 - q) + 4); if (q < .6) star4(g, 300, 300, 200 * (1 - q), c); }
  };
  const LOOPS = { stagger: 1, shield: 1, mirror: 1, kneeled: 1 };
  const fxKey = (kind, pal) => `fx|${kind}|${pal}`;
  function request(kind, pal = 'lightning', pri = 0) {
    const key = fxKey(kind, pal), fn = FXS[kind === 'shield' ? 'guard' : kind], P = PAL[pal] || PAL.lightning;
    PX.request(key, async early => {
      const frames = [], N = 8, loop = LOOPS[kind];
      for (let i = 0; i < N; i++) {
        const q = loop ? i / N : i / (N - 1);
        const a = PixelCast.hiPaint(FB, x => { const g = G(x, LN); fn(g, q, i, P); return g; }) || new Uint8ClampedArray(120 * 120 * 4);
        frames.push(PX.toURL(a, 120, 120)); if (!i) early(frames[0]); if (i % 3 === 2) await yieldNow();
      }
      return { seq: { idle: frames }, fd: { idle: loop ? 120 : 60 } };
    }, pri);
    return key;
  }
  // PX.whenReady also fires on the first early frame; wait for the whole sequence instead
  const onReady = (key, fn, tries = 0) => { const e = PX.cache.get(key); if (e && e.st === 'ok') return fn(e); if (e && e.st === 'err' || tries > 400) return; setTimeout(() => onReady(key, fn, tries + 1), 30); };
  // one-shot effect centred at (cx, cy) inside host; resolves when the last frame has been shown
  function play(host, kind, o = {}) {
    if (!host) return Promise.resolve();
    const key = request(kind, o.pal || 'lightning', 3), size = o.size || 150, img = document.createElement('img'), ms = o.ms || 62;
    img.className = 'pfx'; img.width = size; img.height = size; img.style.left = ((o.cx === undefined ? 50 : o.cx) - size / 2) + 'px'; img.style.top = ((o.cy === undefined ? 50 : o.cy) - size / 2) + 'px'; if (o.flip) img.style.transform = 'scaleX(-1)';
    host.appendChild(img);
    return new Promise(res => onReady(key, e => {
      const fr = e.seq.idle; let i = 0; img.src = fr[0];
      const iv = setInterval(() => { i++; if (i >= fr.length) { clearInterval(iv); img.remove(); res(); } else img.src = fr[i]; }, ms);
    }));
  }
  // looping overlay (stagger stars, hardened shell, kneel chains) animated by the engine's own tick
  function loopImg(kind, pal, size, cls = '') {
    const key = request(kind, pal, 2), { src, tmp } = PX.srcFor(key);
    return `<img class="pxa pfx loop ${cls}" data-k="${key}"${tmp ? ' data-tmp="1"' : ''} src="${src}" width="${size}" height="${size}" alt="">`;
  }

  // ---------- floor, shadow, cut-in strip ----------
  const stat = new Map();
  function once(key, w, h, draw, b) {
    if (stat.has(key)) return stat.get(key);
    const a = PixelCast.hiPaint(Object.assign({ W: w, H: h, ox: 0, oy: 0 }, b), x => { const g = G(x, LN); draw(g); return g; }); const u = a ? PX.toURL(a, w, h) : ''; stat.set(key, u); return u;
  }
  const floorURL = (col = '#5a4a8a') => once('floor|' + col, 200, 40, g => {
    g.solid('M0,40 L0,8 L200,8 L200,40Z', col); for (let k = 0; k < 12; k++) g.line(`M${100 + (k - 5.5) * 12},8 L${100 + (k - 5.5) * 38},40`, '#00000044', 1.2); for (let k = 1; k < 4; k++) g.line(`M0,${8 + k * k * 2.2} H200`, '#00000044', 1.2);
    g.line('M0,8 H200', '#ffffff55', 1.4);
  }, { s: 1, snap: undefined });
  const shadowURL = () => once('shadow', 40, 10, g => { g.ell(20, 5, 17, 3.4, '#000000'); }, { s: 1 });
  const cutBgURL = (col) => once('cut|' + col, 200, 30, g => {
    const r = rng(11); g.solid('M0,0 H200 V30 H0Z', '#1a1030'); g.solid('M0,6 H200 V24 H0Z', col); g.solid('M0,6 H200 V10 H0Z', '#ffffff55');
    for (let k = 0; k < 26; k++) g.line(`M${r() * 200},${r() * 30} h${20 + r() * 60}`, '#ffffffcc', 1);
  }, { s: 1 });

  // draw the first frames of everything a fight needs so the first hit does not stall
  function warm(pals) { ['slash', 'impact'].forEach(k => pals.forEach(p => request(k, p, 0))); ['guard', 'parry', 'heal', 'stagger'].forEach(k => request(k, k === 'heal' ? 'heal' : k === 'stagger' ? 'light' : 'guard', 0)); }
  return { onReady, FONT, text, textImg, icon, iconURL, ICONS, ELEM, SKILL_ICON, MOVE_ICON, barImg, PAL, request, play, loopImg, floorURL, shadowURL, cutBgURL, warm, FXS };
})();

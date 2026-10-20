const SCENES = {};
// ============ NEW DLC BACKGROUNDS ============
SCENES.dlc_chapel = f => {
  const r = rng(301);
  // walls
  vgrad(0, 170, ['#6a5a78', '#9a8294', '#d8b8a0', '#f0d4b0']);
  // ceiling vault
  poly([[0, 0], [480, 0], [480, 12], [340, 52], [140, 52], [0, 12]], '#4a3e5e');
  poly([[0, 12], [140, 52], [140, 170], [0, 200]], '#7e6a86');
  poly([[480, 12], [340, 52], [340, 170], [480, 200]], '#7e6a86');
  for (let i = 0; i < 5; i++) { const x = 70 + i * 85; rect(x, 0, 3, 52 - Math.abs(2 - i) * 6, '#3a2f4c'); }
  rect(0, 0, 480, 4, '#32283f');
  // back wall
  rect(140, 52, 200, 118, '#cdb094'); for (let y = 54; y < 168; y += 9) for (let x = 140 + ((y / 9 | 0) % 2) * 8; x < 340; x += 16) rect(x, y, 15, 1, '#b99a82', .6);
  // columns
  for (const x of [128, 340]) { rect(x, 48, 12, 124, '#e9d6bd'); rect(x + 9, 48, 3, 124, '#b89c88'); rect(x - 2, 46, 16, 5, '#f4e4cc'); rect(x - 2, 166, 16, 6, '#f4e4cc'); }
  // stained glass arch
  const cx = 240, top = 20, bot = 138, hw = 38;
  ell(cx, top + hw, hw + 4, hw + 4, '#f2e2c8'); rect(cx - hw - 4, top + hw, hw * 2 + 8, bot - top - hw + 4, '#f2e2c8');
  const glass = (x, y) => { // x,y inside arch -> colour
    const dx = x - cx, dy = y - (top + hw);
    const rose = dx * dx + dy * dy < 22 * 22 && y < top + hw + 4;
    const pal = ['#d8406a', '#3a6ad8', '#f0c43c', '#40b898', '#9a54c8', '#f08a50'];
    if (rose) { const a = Math.atan2(dy, dx); const k = Math.floor((a + 3.1416) / 6.2832 * 8); const rad = Math.hypot(dx, dy); return rad < 6 ? '#fff0a8' : pal[(k + (rad > 14 ? 3 : 0)) % 6]; }
    const gx = Math.floor((x - (cx - hw)) / 10), gy = Math.floor((y - top) / 12); return pal[(gx * 2 + gy * 3 + ((gx + gy) % 2)) % 6];
  };
  for (let y = top; y < bot; y++) for (let x = cx - hw; x < cx + hw; x++) { const dx = x - cx, dy = y - (top + hw); if (y < top + hw && dx * dx + dy * dy > hw * hw) continue; const g = glass(x, y); const sh = ((x * 7 + y * 3 + f * 5) % 23 === 0) ? .35 : 0; px(x, y, g); if (sh) px(x, y, '#fff', sh); }
  // leading
  for (let x = cx - hw; x <= cx + hw; x += 10) rect(x, top + hw - 2, 1, bot - top - hw + 2, '#2a2038', .85);
  for (let y = top + hw + 8; y < bot; y += 12) rect(cx - hw, y, hw * 2, 1, '#2a2038', .85);
  for (let a = 0; a < 8; a++) { const an = a * Math.PI / 4; line(cx, top + hw, cx + Math.cos(an) * 22, top + hw + Math.sin(an) * 22, '#2a2038'); }
  for (let rr = 6; rr <= 22; rr += 8) for (let a = 0; a < 40; a++) { const an = a / 40 * 6.283; px(cx + Math.cos(an) * rr, top + hw + Math.sin(an) * rr, '#2a2038'); }
  rect(cx, top + 2, 1, bot - top, '#2a2038', .85);
  // altar & cross under window
  rect(200, 140, 80, 5, '#f0e6d6'); rect(204, 145, 72, 25, '#e6d7c4'); rect(204, 145, 72, 2, '#fff');
  rect(238, 120, 4, 20, '#f2c85a'); rect(232, 126, 16, 3, '#f2c85a');
  // candles flicker
  for (const x of [210, 262]) { rect(x, 132, 3, 8, '#fff4dc'); const fl = [0, 1, 0, 1][f]; px(x + 1, 130 - fl, '#ffd25a'); px(x + 1, 129 - fl, '#ff9a3c', .8); glow(x + 1, 130, 7, '#ffcf70', .35, 3); }
  // floor
  poly([[0, 200], [140, 170], [340, 170], [480, 200], [480, 270], [0, 270]], '#b69a86');
  rect(0, 200, 480, 70, '#b69a86');
  for (let y = 172; y < 270; y += 1) { const t = (y - 170) / 100; const hw2 = 22 + t * 140; for (let x = 240 - hw2; x < 240 + hw2; x++) { const k = Math.floor(x / (6 + t * 10)) + Math.floor(y / (4 + t * 8)); if (k % 2 === 0 && (x + y) % 2 === 0) continue; } }
  vgrad(170, 270, ['#c9ac92', '#b89c88', '#a98f82'], 0, 480);
  for (let y = 172; y < 270; y += 5 + ((y - 170) / 14 | 0)) rect(0, y, 480, 1, '#9a8074', .35);
  // aisle carpet
  poly([[222, 170], [258, 170], [330, 270], [150, 270]], '#8e3a54'); poly([[222, 170], [258, 170], [262, 175], [218, 175]], '#a44a64');
  line(224, 170, 154, 270, '#d4a85a'); line(256, 170, 326, 270, '#d4a85a');
  // pews (left & right), perspective rows
  for (const side of [-1, 1]) for (let k = 0; k < 4; k++) { const y = 176 + k * 18 + k * k * 2, t = (y - 170) / 100; const xin = 240 + side * (30 + t * 130), xout = 240 + side * (110 + t * 220); const x0 = Math.min(xin, xout), x1 = Math.max(xin, xout); const h = 7 + t * 20; rect(x0, y - h, x1 - x0, h, '#6a4a44'); rect(x0, y - h, x1 - x0, 2, '#8a6458'); rect(x0, y, x1 - x0, 2 + t * 4, '#4e3436'); }
  // light shafts
  for (let k = 0; k < 3; k++) { const o = (k - 1) * 22 + (f % 2 ? 1 : 0); poly([[cx - 20 + o * .3, top + 30], [cx + 20 + o * .3, top + 30], [cx + 70 + o * 2.4, 270], [cx - 70 + o * 2.4, 270]], '#ffe6b8', .045); }
  // colored light on floor
  const lp = ['#d8406a', '#3a6ad8', '#f0c43c', '#9a54c8']; for (let i = 0; i < 9; i++) { const x = 150 + ((i * 53) % 180), y = 215 + ((i * 29) % 45); ell(x, y, 12 + i % 3 * 3, 3, lp[i % 4], .16); }
  // dust motes
  const rr = rng(5); for (let i = 0; i < 34; i++) { const x = 160 + rr() * 160, y0 = 40 + rr() * 200, ph = rr(); const y = y0 + Math.sin((f + ph * 4) / 4 * 6.283) * 2, xx = x + Math.cos((f + ph * 4) / 4 * 6.283) * 1.5; px(xx, y, '#fff6d8', .8); }
  glow(cx, 78, 90, '#ffe6b8', .22, 6);
  calm('#b69a86', .25, 190); vignette(.35, '#2a1830');
};
SCENES.dlc_garden = f => {
  const r = rng(311);
  vgrad(0, 150, ['#1c1c4a', '#4a2c6a', '#b8587a', '#f0a070']);
  S.stars(r, f, 60, 0, 80);
  // distant hills / trees
  for (let x = 0; x < 480; x += 3) { const h = 112 + Math.sin(x / 31) * 8 + Math.sin(x / 11) * 3; rect(x, h, 3, 160, '#2c2550'); }
  for (let i = 0; i < 14; i++) { const x = i * 36 + r() * 10, y = 120 + r() * 8; ell(x, y, 20 + r() * 8, 22 + r() * 6, '#232044'); }
  rect(0, 130, 480, 140, '#1e2a3e');
  // lawn
  vgrad(130, 270, ['#27384a', '#2f4a4a', '#3c5a52', '#44625a']);
  // hedges both sides
  for (const side of [0, 1]) { const x0 = side ? 400 : 0; rect(x0, 96, 80, 110, '#1c3a38'); for (let i = 0; i < 40; i++) { px(x0 + r() * 80, 96 + r() * 110, '#2a5648'); } rect(x0, 96, 80, 3, '#2c5a4c'); }
  // flowers on hedges
  for (let i = 0; i < 40; i++) { const x = (i % 2 ? 400 : 0) + r() * 78, y = 100 + r() * 100; px(x, y, ['#ffb0c8', '#fff0f4', '#ffd8e8'][i % 3]); }
  // arch with flowers
  for (const x of [186, 288]) rect(x, 70, 6, 136, '#e8dcd0');
  ell(240, 74, 55, 40, '#e8dcd0'); ell(240, 78, 49, 38, '#2c2a52'); rect(190, 78, 98, 130, '#2c2a52');
  for (let y = 78; y < 206; y++) { const t = (y - 78) / 128; for (let x = 192; x < 286; x++) { const dx = (x - 240) / 49, dy = (y - 78) / 38; } }
  // re-open arch showing sunset sky through
  vgrad(78, 205, ['#b8587a', '#e0806e', '#f0a070', '#c07a6a'], 192, 286);
  ell(240, 74, 47, 34, '#b8587a'); vgrad(40, 80, ['#6a3a74', '#b8587a'], 193, 287);
  for (let i = 0; i < 46; i++) { const a = Math.PI + i / 45 * Math.PI, x = 240 + Math.cos(a) * 52, y = 76 + Math.sin(a) * 38; ell(x, y, 3, 3, ['#ffd0e0', '#fff', '#ffb0c8', '#7ab07a'][i % 4]); }
  for (const x of [188, 290]) for (let y = 84; y < 200; y += 7) { px(x + (y % 3), y, ['#ffd0e0', '#7ab07a', '#fff'][(y / 7 | 0) % 3]); px(x + 3 - (y % 3), y + 1, '#7ab07a'); }
  // white chairs rows (silhouetted, low contrast)
  for (const side of [-1, 1]) for (let k = 0; k < 5; k++) { const y = 150 + k * 14, x = 240 + side * (62 + k * 22); for (let j = 0; j < 2; j++) { const xx = x + side * j * 11; rect(xx - 4, y - 8 - k, 8, 9 + k, '#d6c8d8', .75); rect(xx - 4, y + 1, 8, 2, '#8a7a96', .75); } }
  // aisle path
  poly([[228, 150], [252, 150], [330, 270], [150, 270]], '#6a5e68'); poly([[228, 150], [252, 150], [258, 160], [222, 160]], '#7c6e78');
  for (let k = 0; k < 8; k++) ell(240 + (k % 2 - .5) * 30 * (k / 4), 160 + k * 13, 3 + k, 1 + k * .3, '#ffd0e0', .5);
  // string lights: 3 catenaries
  const sl = (x0, y0, x1, y1, sag, off, col) => { const n = 22; for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag; px(x, y, '#2a2030'); if (i % 2 === ((f + off) % 2 === 0 ? 0 : 1) && i % 2 === 0 || i % 2 === 1) { const on = (i + f + off) % 4 !== 0; if (on) { glow(x, y + 2, 5, col, .5, 3); px(x, y + 1, '#fff4c8'); px(x, y + 2, '#ffd070'); } } } };
  sl(0, 40, 240, 46, 22, 0, '#ffd070'); sl(240, 46, 480, 40, 22, 1, '#ffd070'); sl(0, 20, 480, 24, 36, 2, '#ffb070'); sl(-10, 80, 190, 66, 14, 3, '#ffe0a0'); sl(290, 66, 490, 80, 14, 1, '#ffe0a0');
  // lanterns near path
  for (const x of [128, 352]) { rect(x, 180, 2, 30, '#2a2030'); rect(x - 3, 172, 8, 9, '#ffd89a'); glow(x + 1, 176, 14, '#ffc060', .5, 4); }
  // fireflies
  const rr = rng(9); for (let i = 0; i < 14; i++) { const x = rr() * 480, y = 110 + rr() * 120, ph = rr(); const on = (Math.floor(f + ph * 4) % 4) < 3; if (on) { px(x + sine(f, ph) * 3, y + sine(f, ph + .25) * 2, '#f4ffa0'); } }
  calm('#33483f', .3, 185); vignette(.3, '#10102a');
};
SCENES.dlc_home_day = f => {
  const r = rng(321);
  rect(0, 0, 480, 270, '#f0e0c8'); vgrad(0, 190, ['#f6ead6', '#f0dcc0']);
  // wall panel / accent
  rect(0, 0, 480, 190, '#f2e4cc'); for (let x = 0; x < 480; x += 24) rect(x, 0, 1, 190, '#e8d6bc', .6);
  // floor wood
  vgrad(190, 270, ['#c89a6a', '#b88a5c', '#a87c52']); for (let y = 192; y < 270; y += 8) rect(0, y, 480, 1, '#9a7048', .5); for (let y = 190; y < 270; y += 8) for (let x = ((y / 8 | 0) % 2) * 30; x < 480; x += 60) rect(x, y, 1, 8, '#9a7048', .4);
  rect(0, 186, 480, 5, '#fff6e6'); rect(0, 190, 480, 1, '#d8c4a4');
  // big window with morning light
  const wx = 150, wy = 28, ww = 130, wh = 112;
  rect(wx - 4, wy - 4, ww + 8, wh + 8, '#fffaf0'); vgrad(wy, wy + wh, ['#8ecaf0', '#b8e0f8', '#e0f4ff'], wx, wx + ww);
  const dr = f; S.cloud(wx + 40 + dr * 1.5 * (f > 2 ? 1 : 1), wy + 28, 40, '#fff', '#f4faff', '#d8ecf8'); S.cloud(wx + 100 - dr, wy + 52, 28, '#fff', '#f4faff', '#d8ecf8');
  // tree outside
  ell(wx + 20, wy + 90, 26, 24, '#6aa860'); ell(wx + 30, wy + 80, 18, 16, '#80bc6a'); rect(wx + 18, wy + 96, 5, 20, '#7a5a3a');
  // skyline roofs
  for (let i = 0; i < 6; i++) rect(wx + 60 + i * 14, wy + 86 - (i * 7 % 18), 13, 40, ['#a8b8cc', '#98a8c0'][i % 2]);
  rect(wx + ww / 2 - 1, wy, 3, wh, '#fffaf0'); rect(wx, wy + 56, ww, 3, '#fffaf0');
  // curtains sway
  const sw = [0, 1, 2, 1][f];
  for (const side of [0, 1]) { const x0 = side ? wx + ww + 4 - 22 : wx - 4; for (let x = 0; x < 26; x++) { const sh = Math.sin(x / 4 + (side ? 1 : 0)) * .5 + .5; const w2 = Math.floor(2 + x * 0 + sw * (side ? -1 : 1) * (x / 26) * .8); rect(x0 + x, wy - 8, 1, wh + 24 + (x % 4 === 0 ? 2 : 0), sh > .5 ? '#e8a8a0' : '#d89290'); } }
  rect(wx - 14, wy - 12, ww + 28, 4, '#8a6a4a');
  // sun beam on floor
  poly([[wx, wy + wh], [wx + ww, wy + wh], [wx + ww + 120, 270], [wx - 20, 270]], '#fff4c0', .13 + (f % 2) * .02);
  // shelves left with books/plants
  rect(14, 70, 100, 3, '#8a6a4a'); rect(14, 112, 100, 3, '#8a6a4a');
  for (let i = 0; i < 14; i++) rect(18 + i * 6.5, 52 + (i % 3) * 2, 5, 18 - (i % 3) * 2, ['#d86a6a', '#6a9ad8', '#e8c860', '#7ab890', '#b08ad0'][i % 5]);
  ell(30, 100, 8, 9, '#5a9a5a'); rect(24, 104, 12, 8, '#c8704a'); rect(70, 98, 20, 14, '#fff6e6'); rect(72, 100, 16, 10, '#f0b8c0'); // photo frame
  rect(50, 120, 60, 40, '#fff6e6'); // wall art
  rect(52, 122, 56, 36, '#e8b8a0'); ell(80, 148, 22, 12, '#f0d080'); ell(80, 130, 8, 8, '#f8f0e0'); 
  // open kitchen right: counter + cabinets
  rect(320, 30, 160, 64, '#f8f0e4'); for (let i = 0; i < 4; i++) { rect(322 + i * 40, 32, 36, 60, '#fff8ec'); rect(354 + i * 40 - 30, 62, 2, 8, '#b09a80'); }
  rect(320, 94, 160, 4, '#d8c6a8');
  rect(320, 98, 160, 80, '#e8d4b4'); rect(320, 140, 160, 2, '#c8b494'); for (let i = 0; i < 4; i++) rect(322 + i * 40, 100, 36, 38, '#f2e2c4');
  rect(320, 134, 160, 8, '#fff6e8'); rect(320, 134, 160, 2, '#fff');
  // counter items
  rect(344, 118, 16, 16, '#f2f2f2'); rect(346, 122, 12, 3, '#c8d0d8'); // kettle
  px(352, 112 - 0, '#fff', .0); 
  for (let k = 0; k < 3; k++) { const y = 108 - k * 7 - (f * 2) % 8, x = 352 + Math.sin((y + f) / 4) * 2; px(x, y, '#fff', .7 - k * .2); px(x + 1, y, '#fff', .5 - k * .15); }
  rect(380, 124, 12, 10, '#e06a5a'); rect(382, 120, 8, 5, '#f0d060'); ell(430, 128, 9, 6, '#fff'); ell(430, 128, 6, 4, '#f0a850');
  rect(400, 100, 4, 20, '#6a4a3a'); rect(396, 116, 12, 3, '#6a4a3a');
  // plant on counter
  for (let k = 0; k < 5; k++) line(462, 134, 456 + k * 5, 112 - (k % 2) * 4, '#4a9a50'); rect(458, 128, 10, 6, '#d08a5a');
  // island / table + sofa
  rect(190, 186, 120, 50, '#c8a070'); rect(188, 184, 124, 6, '#e8c898'); rect(194, 236, 6, 30, '#a07a50'); rect(300, 236, 6, 30, '#a07a50');
  rect(214, 172, 18, 12, '#fff'); rect(216, 170, 14, 3, '#7ab0d8'); rect(262, 176, 24, 8, '#f8f0e8'); ell(274, 176, 8, 3, '#f0b060');
  // sofa left foreground (low contrast)
  rect(0, 176, 100, 40, '#9aa8c0'); rect(0, 200, 110, 30, '#aab6cc'); rect(0, 172, 100, 10, '#8896b0'); rect(10, 190, 36, 16, '#e8b0b8'); rect(52, 192, 30, 14, '#f0d890');
  // rug
  ell(250, 255, 130, 14, '#d88a7a', .55); ell(250, 255, 100, 9, '#e8a898', .5);
  // dust
  const rr = rng(2); for (let i = 0; i < 18; i++) px(wx + rr() * 160 + Math.sin((f + rr() * 4) / 4 * 6.28) * 2, 60 + rr() * 150 + (f % 2), '#fff', .7);
  glow(wx + 65, wy + 40, 100, '#fff6c8', .16, 5);
  calm('#c8a070', .22, 200); vignette(.18, '#8a5a40');
};
SCENES.dlc_home_night = f => {
  const r = rng(331);
  rect(0, 0, 480, 270, '#3a2e48'); vgrad(0, 190, ['#2c2440', '#463858', '#5a4062']);
  vgrad(190, 270, ['#5a4048', '#4a3440', '#3e2c38']); for (let y = 192; y < 270; y += 8) rect(0, y, 480, 1, '#32222c', .5);
  rect(0, 186, 480, 5, '#7a6068');
  // window with rain (left-center)
  const wx = 150, wy = 28, ww = 130, wh = 112;
  rect(wx - 4, wy - 4, ww + 8, wh + 8, '#8a7a88'); vgrad(wy, wy + wh, ['#101830', '#1c2650', '#2a2c5a'], wx, wx + ww);
  const rr = rng(40); for (let i = 0; i < 70; i++) { const x = wx + rr() * ww, y = wy + 40 + rr() * 72; px(x, y, '#ffd890', .6); }
  const rq = rng(41); for (let i = 0; i < 6; i++) { const x = wx + 6 + rq() * (ww - 12), w = 10 + rq() * 12, h = 20 + rq() * 40; rect(x, wy + wh - h, w, h, '#1a2040', .9); for (let j = 0; j < 8; j++) px(x + rq() * w, wy + wh - h + rq() * h, '#ffd070'); }
  // rain streaks on glass
  { const ra = rng(50); const step = 28, P = step * 4; for (let i = 0; i < 46; i++) { const x = wx + ra() * ww, y0 = ra() * P; const y = wy + ((y0 + f * step) % P) % (wh - 8); const yy = wy + ((y0 + f * step) % wh); for (let k = 0; k < 6; k++) px(x - k * .25, yy + k, '#a8c4ff', .55 - k * .06); } }
  // drips on glass
  for (let i = 0; i < 8; i++) { const x = wx + 10 + i * 15 + (i * 7 % 5), y = wy + 10 + (i * 31 % 80) + f * 2; px(x, y, '#c8d8ff', .6); px(x, y + 1, '#c8d8ff', .35); }
  rect(wx + ww / 2 - 1, wy, 3, wh, '#8a7a88'); rect(wx, wy + 56, ww, 3, '#8a7a88');
  // curtains
  for (const side of [0, 1]) { const x0 = side ? wx + ww - 18 : wx - 8; for (let x = 0; x < 26; x++) rect(x0 + x, wy - 8, 1, wh + 24, (Math.sin(x / 4) > 0) ? '#6a4a68' : '#583a58'); }
  rect(wx - 14, wy - 12, ww + 28, 4, '#4a3240');
  // warm lamp pools
  const lampX = 80; rect(lampX - 1, 100, 3, 80, '#2a1c24'); poly([[lampX - 18, 96], [lampX + 18, 96], [lampX + 10, 78], [lampX - 10, 78]], '#f8d890'); rect(lampX - 8, 176, 18, 6, '#2a1c24');
  const fl = [0, 1, 0, 0][f];
  glow(lampX, 92, 80 + fl * 2, '#ffc870', .6, 7); glow(lampX, 92, 36, '#ffe4a0', .6, 4);
  // shelves with books (dim)
  rect(14, 130, 50, 3, '#4a3240'); for (let i = 0; i < 8; i++) rect(16 + i * 6, 116 + (i % 3), 5, 14 - (i % 3), ['#9a4a5a', '#4a6a9a', '#b89a4a', '#4a8a6a'][i % 4]);
  // kitchen right (dim, under-cabinet light)
  rect(330, 30, 150, 62, '#4e4058'); for (let i = 0; i < 4; i++) rect(332 + i * 37, 32, 33, 58, '#5a4a64');
  rect(330, 92, 150, 4, '#2c2234'); poly([[330, 96], [480, 96], [480, 140], [330, 140]], '#ffd890', .17 + fl * .03);
  rect(330, 96, 150, 80, '#54445a'); rect(330, 136, 150, 8, '#6a586e'); rect(330, 136, 150, 2, '#8a7690');
  rect(352, 120, 12, 14, '#c8c8d4'); for (let k = 0; k < 2; k++) px(358 + Math.sin(f + k) * 1.5, 116 - k * 4 - f % 2, '#fff', .5);
  ell(430, 130, 8, 5, '#d0b090'); rect(396, 122, 10, 12, '#e8d8c0');
  // glowing fridge-like light
  rect(450, 30, 30, 120, '#6a6a7a', .0);
  // table + sofa
  rect(190, 186, 120, 50, '#6a4e52'); rect(188, 184, 124, 6, '#8a6a68'); rect(194, 236, 6, 30, '#4a3438'); rect(300, 236, 6, 30, '#4a3438');
  rect(228, 168, 12, 16, '#e0d4d8'); rect(230, 164, 8, 4, '#f8c870'); glow(234, 166, 16, '#ffc870', .5, 3); // candle/mug
  rect(0, 176, 110, 42, '#46506a'); rect(0, 200, 116, 30, '#505a74'); rect(0, 172, 110, 10, '#3a4460'); rect(12, 190, 36, 16, '#a06a78'); rect(54, 192, 30, 14, '#b89860');
  ell(250, 255, 130, 14, '#6a3a4a', .6);
  // glow wash on floor
  ell(130, 232, 100, 18, '#ffc870', .12);
  // rain sound ripples: light flicker on wall from TV? subtle blue wash
  tint('#1a1840', .1);
  calm('#3e2c38', .3, 195); vignette(.4, '#100818');
};
SCENES.dlc_nursery = f => {
  const r = rng(341);
  rect(0, 0, 480, 270, '#f8e4e0'); vgrad(0, 180, ['#fbe9e4', '#f8dcd8']);
  // wall stripes soft + clouds decal
  for (let x = 0; x < 480; x += 32) rect(x, 0, 16, 180, '#f4d8d8', .5);
  rect(0, 150, 480, 36, '#f0d0c8'); rect(0, 148, 480, 3, '#fff4ee');
  vgrad(186, 270, ['#d8b890', '#c8a47c', '#bc9870']); for (let y = 188; y < 270; y += 8) rect(0, y, 480, 1, '#a88060', .45);
  rect(0, 182, 480, 5, '#fff8f0');
  // window right with sunlight, sheer curtains
  const wx = 330, wy = 30, ww = 96, wh = 100;
  rect(wx - 4, wy - 4, ww + 8, wh + 8, '#fffaf4'); vgrad(wy, wy + wh, ['#9ad4f0', '#c8eaf8', '#f0faff'], wx, wx + ww);
  S.cloud(wx + 30 + [0, 1, 2, 1][f], wy + 30, 36, '#fff', '#f8fcff', '#dcecf8'); ell(wx + 70, wy + 92, 30, 20, '#8cc880'); ell(wx + 20, wy + 96, 28, 22, '#78b86e');
  rect(wx + ww / 2 - 1, wy, 2, wh, '#fffaf4');
  for (const side of [0, 1]) { const x0 = side ? wx + ww - 14 : wx - 6; for (let x = 0; x < 20; x++) rect(x0 + x, wy - 6, 1, wh + 16, ((x + f) % 5 < 3) ? '#fff' : '#fdf0f0', .75); }
  rect(wx - 12, wy - 10, ww + 24, 3, '#c8a07c');
  poly([[wx, wy + wh], [wx + ww, wy + wh], [wx + ww + 40, 270], [wx - 90, 270]], '#fff4c0', .12 + (f % 2) * .02);
  // mobile hanging (animated)
  const mx = 210; rect(mx, 0, 1, 40, '#c8a07c'); rect(mx - 28, 40, 58, 2, '#e8c090'); 
  for (let i = 0; i < 5; i++) { const x = mx - 24 + i * 12 + Math.round(Math.sin((f / 4 + i * .2) * 6.283) * 1.5); line(x, 42, x, 56 + (i % 3) * 5, '#d8b898'); const y = 58 + (i % 3) * 5; const col = ['#f8b0c0', '#a8d8f0', '#f8e078', '#b8e0b0', '#d8b0f0'][i]; if (i % 2) { ell(x, y + 2, 4, 4, col); px(x, y, '#fff'); } else { poly([[x, y - 2], [x + 3, y + 3], [x - 3, y + 3]], col); } }
  // crib centre-left
  rect(60, 96, 100, 6, '#f8f0e6'); rect(56, 90, 6, 100, '#f0e4d4'); rect(156, 90, 6, 100, '#f0e4d4');
  for (let x = 66; x < 156; x += 7) rect(x, 102, 2, 70, '#f4eadc');
  rect(60, 170, 100, 8, '#f0e4d4'); rect(64, 134, 92, 36, '#f8d0d8'); rect(64, 134, 92, 3, '#fff'); for (let i = 0; i < 6; i++) { ell(76 + i * 15, 152 + (i % 2) * 8, 3, 3, '#fff', .6); } rect(70, 120, 24, 16, '#fff4f0'); ell(82, 126, 8, 5, '#fff');
  rect(56, 190, 6, 4, '#c8a07c'); rect(156, 190, 6, 4, '#c8a07c');
  // toy shelf + rocking chair
  rect(250, 100, 60, 3, '#d8b890'); rect(250, 130, 60, 3, '#d8b890'); rect(250, 160, 60, 3, '#d8b890'); rect(250, 100, 3, 62, '#d8b890'); rect(307, 100, 3, 62, '#d8b890');
  ell(262, 92, 8, 8, '#e8a888'); rect(258, 98, 8, 2, '#e8a888'); rect(276, 84, 14, 16, '#f8d070'); rect(294, 88, 10, 12, '#88c0e8');
  rect(256, 120, 10, 10, '#f87a88'); rect(270, 116, 14, 14, '#88d0a8'); rect(290, 118, 12, 12, '#f8c868'); ell(272, 150, 10, 9, '#f8f0e8'); ell(264, 142, 3, 4, '#f8f0e8'); ell(280, 142, 3, 4, '#f8f0e8');
  rect(256, 140, 10, 20, '#c8a0e0', .0);
  // rocking chair (animated rock)
  const rk = [0, 1, 0, -1][f];
  rect(395 + rk, 150, 52, 6, '#c8946a'); rect(395 + rk, 150, 8, 40, '#d8a47a'); rect(440 + rk, 156, 6, 32, '#d8a47a'); rect(398 + rk, 176, 48, 8, '#f0c8d0'); rect(400 + rk, 130, 30, 46, '#f0c8d0'); rect(402 + rk, 132, 26, 40, '#f8d8de');
  line(390, 200, 450, 200, '#b8845a'); line(392, 202, 448, 202, '#b8845a');
  // balloons / bunting
  for (let i = 0; i < 12; i++) { const x = 20 + i * 40, y = 12 + Math.sin(i * .9) * 4; poly([[x, y], [x + 14, y], [x + 7, y + 14]], ['#f8b0c0', '#a8d8f0', '#f8e078', '#b8e0b0'][i % 4]); } line(10, 10, 470, 10, '#c8a07c');
  // rug (calm foreground)
  ell(210, 248, 150, 18, '#f0b8c0', .65); ell(210, 248, 120, 12, '#f8d0d4', .65); ell(210, 248, 70, 6, '#fff0f0', .5);
  // toy blocks
  rect(60, 236, 10, 10, '#f8c868'); rect(72, 238, 8, 8, '#88c0e8'); rect(66, 228, 8, 8, '#f87a88');
  for (let i = 0; i < 16; i++) px(wx + 10 + r() * 80 + Math.sin((f + r() * 4) / 4 * 6.28) * 2, 60 + r() * 140, '#fff', .8);
  glow(wx + 48, wy + 50, 90, '#fff2c0', .16, 5);
  calm('#d0aa86', .2, 205); vignette(.15, '#a8706a');
};
SCENES.dlc_schoolgate = f => {
  const r = rng(351);
  vgrad(0, 150, ['#7cc4f4', '#a8dcf8', '#d8f0fc', '#fbe4ec']);
  S.cloud(90 + [0, 2, 3, 2][f], 36, 70, '#fff', '#f4fafe', '#d4e8f8'); S.cloud(350 - [0, 1, 2, 1][f], 56, 90, '#fff', '#f4fafe', '#d4e8f8'); S.cloud(230 + [0, 1, 1, 0][f], 22, 40, '#fff', '#f4fafe', '#d4e8f8');
  // school building far
  rect(120, 70, 240, 74, '#e8e4ee'); rect(120, 66, 240, 5, '#a8a4c0'); rect(200, 40, 80, 30, '#dcd8e8'); rect(200, 36, 80, 5, '#9a96b8'); ell(240, 52, 9, 9, '#fff'); line(240, 52, 240, 46, '#2a2840'); line(240, 52, 244, 54, '#2a2840');
  for (let y = 78; y < 136; y += 18) for (let x = 130; x < 350; x += 20) { rect(x, y, 14, 12, '#7aa8d0'); rect(x, y, 14, 3, '#a8ccec'); }
  rect(120, 144, 240, 4, '#bcb8cc');
  // ground
  vgrad(148, 270, ['#9ac07a', '#8cb470', '#b8b098', '#cac2ae']); rect(0, 168, 480, 102, '#c8c0aa'); vgrad(168, 270, ['#d4ccb8', '#c8c0aa', '#bcb4a2']);
  // fence + gate pillars
  rect(0, 138, 480, 3, '#4a5068'); for (let x = 0; x < 480; x += 8) if (x < 160 || x > 320) rect(x, 128, 2, 44, '#4a5068'); rect(0, 134, 160, 2, '#4a5068'); rect(320, 134, 160, 2, '#4a5068');
  for (const x of [150, 320]) { rect(x, 100, 14, 78, '#d8d4dc'); rect(x - 2, 96, 18, 6, '#eceaf0'); rect(x + 10, 100, 4, 78, '#b0acbc'); rect(x + 2, 112, 10, 10, '#4a5068'); }
  rect(166, 150, 152, 3, '#4a5068', .8);
  text('HEARTLINE', 187, 120, '#4a5068', 1); text('ACADEMY', 191, 128, '#4a5068', 1);
  // cherry trees both sides, big, framing
  const pk = ['#fbb8cc', '#f48ab0', '#ffd8e4', '#ffeef2'];
  const tr = rng(77); S.sakura(34, 200, 1.9, '#5a3a40', pk, tr, f); S.sakura(440, 204, 2.0, '#5a3a40', pk, tr, f); S.sakura(110, 160, 1.0, '#6a4a4a', pk, tr, f); S.sakura(390, 162, 1.05, '#6a4a4a', pk, tr, f);
  // path with petals
  poly([[210, 170], [270, 170], [360, 270], [120, 270]], '#d8d0c0'); poly([[226, 170], [254, 170], [262, 180], [218, 180]], '#e2dac8');
  const rp = rng(8); for (let i = 0; i < 70; i++) { const y = 175 + rp() * 95, hw = 30 + (y - 170) * .85, x = 240 + (rp() - .5) * 2 * hw; px(x, y, rp() < .5 ? '#fbb8cc' : '#ffd8e4'); px(x + 1, y, '#fbb8cc', .6); }
  // falling petals
  S.petals(rng(90), f, 70, ['#fbb8cc', '#ffd0dc', '#fff0f4', '#f48ab0'], 17, 0, 270, 8);
  glow(380, 30, 80, '#fff4d0', .22, 5);
  calm('#cac2ae', .22, 195); vignette(.15, '#b87a8a');
};
SCENES.dlc_park_family = f => {
  const r = rng(361);
  vgrad(0, 130, ['#5cb8f4', '#8ed0f8', '#c4e8fc']);
  S.cloud(80 + [0, 2, 3, 2][f], 34, 80, '#fff', '#f6fbff', '#d4e8f8'); S.cloud(330 - [0, 1, 2, 1][f], 50, 100, '#fff', '#f6fbff', '#d4e8f8'); S.cloud(440 + [0, 1, 1, 0][f], 24, 50, '#fff', '#f6fbff', '#d4e8f8');
  ell(410, 30, 14, 14, '#fffbd0'); glow(410, 30, 50, '#fffbd0', .3, 4);
  // far hills + treeline
  for (let x = 0; x < 480; x++) rect(x, 100 + Math.sin(x / 50) * 8 + Math.sin(x / 17) * 2, 1, 80, '#7cc08a');
  for (let i = 0; i < 26; i++) { const x = i * 20 + r() * 8; ell(x, 108 + Math.sin(x / 50) * 8, 14 + r() * 6, 14 + r() * 6, i % 2 ? '#4a9a62' : '#58a86c'); }
  // big picnic hill with tree at the right
  for (let x = 0; x < 480; x++) { const y = 150 + Math.sin(x / 70 + 1) * 10 - Math.max(0, 40 - Math.abs(x - 360) / 3) * .9; rect(x, y, 1, 270 - y, '#8ed068'); }
  vgrad(150, 270, ['#9ad870', '#8ccc66', '#7cbc5c', '#72b058']);
  for (let x = 0; x < 480; x++) { const y = 150 + Math.sin(x / 70 + 1) * 10 - Math.max(0, 40 - Math.abs(x - 360) / 3) * .9; px(x, y, '#c4ee98'); }
  // big tree on hill
  rect(358, 80, 8, 52, '#6a4a38'); rect(364, 80, 3, 52, '#523a2c'); for (const [dx, dy, rr] of [[0, 62, 36], [-28, 80, 26], [30, 78, 28], [-10, 44, 26], [16, 48, 24]]) ell(362 + dx, dy, rr, rr * .85, '#3f9858'); for (const [dx, dy, rr] of [[-6, 56, 20], [20, 66, 16], [-22, 72, 14]]) ell(362 + dx, dy, rr, rr * .8, '#58b46a'); 
  for (let i = 0; i < 40; i++) px(335 + r() * 55, 42 + r() * 55, '#82d08a');
  // tree shadow
  ell(366, 140, 54, 9, '#5aa050', .6);
  // path winding
  poly([[100, 270], [160, 270], [190, 214], [210, 180], [224, 150], [216, 150], [190, 180], [160, 214]], '#e6d6a8');
  for (let y = 152; y < 270; y += 4) { const t = (y - 150) / 120; }
  // picnic blanket on hill (centre-right, midground)
  poly([[290, 190], [380, 190], [396, 206], [276, 206]], '#e8506a'); for (let i = 0; i < 6; i++) { poly([[290 + i * 15, 190], [297 + i * 15, 190], [290 + i * 16, 206], [283 + i * 16, 206]], '#fff', .85); }
  rect(305, 182, 12, 8, '#a8764a'); rect(307, 184, 8, 3, '#e8d8a0'); ell(345, 187, 6, 3, '#fff'); ell(345, 186, 3, 2, '#e8506a'); rect(330, 183, 4, 6, '#88d0e8');
  // flowers scattered (calm)
  for (let i = 0; i < 60; i++) { const x = r() * 480, y = 158 + r() * 108; if (y > 188 && y < 210 && x > 270 && x < 400) continue; px(x, y, ['#fff', '#ffe060', '#ffa0c0', '#c8a0f0'][i % 4]); if (i % 3 === 0) px(x + 1, y, '#8ec468'); }
  // kite in sky animated
  const kx = 120 + [0, 3, 5, 3][f], ky = 60 + [0, -2, 0, 2][f]; poly([[kx, ky - 10], [kx + 8, ky], [kx, ky + 10], [kx - 8, ky]], '#ff6a8a'); poly([[kx, ky - 10], [kx + 8, ky], [kx, ky]], '#ffd060'); line(kx, ky + 10, 140, 150, '#fff', .8); for (let i = 1; i < 4; i++) rect(kx - 3 + i * -1, ky + 12 + i * 5, 3, 2, ['#ffd060', '#6ad0f0', '#ff6a8a'][i - 1]);
  // birds
  for (let i = 0; i < 4; i++) { const x = 200 + i * 22 + [0, 2, 4, 2][f], y = 50 + (i % 2) * 8; px(x, y, '#35405a'); px(x - 1, y - (f + i) % 2, '#35405a'); px(x + 1, y - (f + i) % 2, '#35405a'); }
  S.petals(rng(91), f, 20, ['#ffd0dc', '#fff'], 17, 0, 270, 8);
  calm('#78b45c', .18, 205); vignette(.1, '#2a6a4a');
};
SCENES.dlc_porch = f => {
  const r = rng(371);
  vgrad(0, 150, ['#0a0e2c', '#141c48', '#26285a', '#4a3a6a']);
  S.stars(r, f, 90, 0, 100);
  // moon
  ell(380, 52, 22, 22, '#fff6dc'); ell(372, 46, 5, 5, '#ecdcb8'); ell(388, 60, 4, 4, '#ecdcb8'); ell(390, 42, 3, 3, '#ecdcb8'); glow(380, 52, 70, '#cfd8ff', .4, 6); ell(371, 48, 22, 22, '#fff6dc', 0);
  S.cloud(300 + [0, 2, 3, 2][f], 60, 70, '#4a4a7a', '#3a3a6a', '#2c2c58'); S.cloud(90 + [0, 1, 2, 1][f], 84, 90, '#44447a', '#36366a', '#2a2a58');
  // distant city lights
  S.skyline(rng(88), f, 160, 0, 20, 70, '#1a1840', '#ffd070', .26, '#ff9aa8');
  S.skyline(rng(89), f, 178, 0, 14, 44, '#10102c', '#ffe4a0', .3);
  // river / far glow
  rect(0, 150, 480, 40, '#0e0e28'); for (let i = 0; i < 70; i++) { const x = r() * 480, y = 152 + r() * 36; if ((f + i) % 3) px(x, y, ['#ffd070', '#ff9aa8', '#9ad0ff'][i % 3], .5); }
  // tree silhouette left
  rect(30, 70, 10, 120, '#0a0a1e'); for (const [dx, dy, rr] of [[0, 60, 40], [-30, 80, 28], [34, 78, 30], [8, 36, 28]]) ell(35 + dx, dy, rr, rr * .85, '#0a0a1e'); for (let i = 0; i < 30; i++) px(0 + r() * 90, 40 + r() * 70, '#1c2a40');
  // porch: railing across, floor boards
  rect(0, 190, 480, 80, '#3a2a3c'); vgrad(196, 270, ['#46334a', '#3a2a3c', '#32243a']); for (let y = 198; y < 270; y += 9) rect(0, y, 480, 1, '#22182a', .6); for (let y = 198; y < 270; y += 9) for (let x = (y / 9 | 0) % 2 * 36; x < 480; x += 72) rect(x, y, 1, 9, '#22182a', .5);
  rect(0, 176, 480, 5, '#64506a'); rect(0, 181, 480, 2, '#2a1c2e'); for (let x = 6; x < 480; x += 22) { rect(x, 183, 5, 9, '#54405a'); } rect(0, 190, 480, 2, '#2a1c2e');
  for (let x = 0; x < 480; x += 60) { rect(x, 120, 7, 60, '#64506a'); rect(x - 1, 118, 9, 4, '#7a6280'); }
  // house wall on right with warm window
  rect(380, 0, 100, 190, '#3e2c48'); for (let y = 6; y < 190; y += 10) rect(380, y, 100, 1, '#2c1e38', .6);
  rect(392, 40, 66, 96, '#5a4260'); rect(396, 44, 58, 88, '#ffcf80'); vgrad(44, 132, ['#ffe0a0', '#ffc070'], 396, 454); rect(424, 44, 2, 88, '#5a4260'); rect(396, 86, 58, 2, '#5a4260');
  // inside: family photo wall + curtains + a kid's silhouette bed hint
  for (let i = 0; i < 4; i++) rect(400 + i * 13, 52 + (i % 2) * 6, 9, 11, ['#e87a8a', '#7aa8e8', '#e8c860', '#8ad0a8'][i]);
  rect(400, 96, 22, 26, '#a85a68'); rect(432, 100, 20, 22, '#6a8ab8'); // bed shapes
  rect(405, 90, 10, 6, '#ffe6c8'); 
  glow(425, 90, 60, '#ffc070', .4, 5); poly([[396, 132], [454, 132], [480, 190], [380, 190]], '#ffcf80', .14);
  // hanging porch lamp w/ flicker
  rect(372, 0, 2, 30, '#1c1424'); poly([[364, 40], [382, 40], [378, 30], [368, 30]], '#ffe0a0'); glow(373, 38, 40 + (f % 2) * 2, '#ffc060', .5, 5);
  // string lights along railing top
  for (let i = 0; i <= 30; i++) { const x = i * 16, y = 108 + Math.sin(i * Math.PI) * 0 + Math.sin(i / 30 * Math.PI * 4) * 6; px(x, y, '#1c1424'); if ((i + f) % 3 !== 0) { glow(x, y + 2, 5, '#ffd070', .5, 3); px(x, y + 2, '#fff4c8'); } }
  // plant pots
  rect(20, 160, 20, 20, '#8a5a4a'); for (let i = 0; i < 6; i++) line(30, 160, 20 + i * 4, 140 - (i % 2) * 6, '#2a6a4a'); rect(436, 154, 18, 22, '#8a5a4a'); for (let i = 0; i < 5; i++) line(445, 154, 436 + i * 4, 136 - (i % 2) * 5, '#2a6a4a');
  // fireflies
  for (let i = 0; i < 10; i++) { const x = 40 + r() * 340, y = 130 + r() * 90, ph = r(); if ((Math.floor(f + ph * 4)) % 4 < 3) px(x + sine(f, ph) * 3, y + sine(f, ph + .25) * 2, '#f4ffa0'); }
  // warm wash on porch floor
  ell(310, 235, 140, 20, '#ffc070', .08);
  calm('#32243a', .3, 205); vignette(.35, '#06061a');
};

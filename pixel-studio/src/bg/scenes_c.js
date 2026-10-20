// ============ REMAKES (rest) ============
SCENES.apartment = f => {
  const r = rng(601);
  vgrad(0, 200, ['#2a2248', '#3a2c5a', '#4a3868']); for (let x = 0; x < 480; x += 30) rect(x, 0, 1, 200, '#34284e', .5);
  vgrad(200, 270, ['#3a2c44', '#2e2236', '#281c30']); rect(0, 196, 480, 5, '#5a4468');
  // window right w/ city
  const wx = 290, wy = 20, ww = 160, wh = 120; rect(wx - 6, wy - 6, ww + 12, wh + 12, '#d8cce0'); vgrad(wy, wy + wh, ['#0a1030', '#1c2050', '#3a2c6a'], wx, wx + ww);
  S.stars(rng(602), f, 20, wy, wy + 40); { const q = rng(603); for (let i = 0; i < 9; i++) { const x = wx + 4 + q() * (ww - 18), w = 10 + q() * 16, h = 20 + q() * 60; rect(x, wy + wh - h, w, h, '#161a44'); for (let j = 0; j < 7; j++) if (q() < .8) px(x + 2 + q() * (w - 4), wy + wh - h + 3 + q() * (h - 5), ((f + j) % 5 ? '#ffd070' : '#161a44')); } }
  rect(wx + ww / 2 - 1, wy, 3, wh, '#d8cce0'); rect(wx, wy + 60, ww, 3, '#d8cce0'); glow(wx + 80, wy + 60, 100, '#6a78d8', .15, 4);
  // posters
  poly([[40, 30], [90, 24], [94, 82], [44, 88]], '#d85a88'); poly([[56, 40], [70, 40], [64, 56], [74, 56], [60, 76], [64, 60], [54, 60]], '#ffe060'); poly([[104, 36], [150, 34], [150, 86], [104, 88]], '#5a8ad8'); for (let k = 0; k < 4; k++) rect(112, 44 + k * 9, 30, 2, '#cfe0ff', .8);
  // desk + monitor
  rect(24, 140, 220, 6, '#6a4a48'); rect(30, 146, 5, 56, '#4a3240'); rect(232, 146, 5, 56, '#4a3240');
  rect(96, 100, 60, 38, '#1a1a30'); rect(99, 103, 54, 30, '#3ad0c8'); vgrad(103, 133, ['#6af0e0', '#2a9ab0'], 99, 153); for (let k = 0; k < 5; k++) rect(104, 108 + k * 5, 14 + (k * 9 + f * 5) % 24, 2, '#fff', .7); rect(122, 138, 12, 4, '#1a1a30'); glow(126, 118, 60, '#3ad0c8', .25, 5);
  rect(50, 134, 28, 6, '#f0e0c0'); rect(170, 128, 20, 12, '#d8d8e8'); 
  // bed right bottom
  rect(300, 176, 180, 50, '#46509a'); rect(300, 168, 180, 14, '#f0eaf8'); rect(300, 186, 180, 30, '#5a64b0'); rect(316, 160, 40, 12, '#fff'); rect(300, 226, 180, 6, '#2e2236');
  ell(250, 250, 120, 12, '#5a3a58', .6);
  calm('#2e2236', .3, 205); vignette(.3, '#0a0618');
};
SCENES.office = f => {
  const r = rng(611);
  rect(0, 0, 480, 270, '#2a2430'); 
  const wx = 60, wy = 24, ww = 360, wh = 150; rect(wx - 6, wy - 6, ww + 12, wh + 12, '#1a1620'); vgrad(wy, wy + wh, ['#78b8f0', '#a8d4f8', '#d8ecfc'], wx, wx + ww);
  S.cloud(150 + [0, 2, 3, 2][f], 60, 60, '#fff', '#f4faff', '#d0e4f6'); S.cloud(330 - [0, 1, 2, 1][f], 84, 70, '#fff', '#f4faff', '#d0e4f6');
  const q = rng(612); for (let i = 0; i < 14; i++) { const x = wx + 6 + i * 25 + q() * 6, w = 18 + q() * 10, h = 40 + q() * 80, col = ['#6a80a8', '#7a90b8', '#5a6e96'][i % 3]; rect(x, wy + wh - h, w, h, col); rect(x, wy + wh - h, w, 2, '#a8b8d4'); for (let j = 0; j < h / 8; j++) for (let k = 0; k < w / 5; k++) if (q() < .35) px(x + 2 + k * 5, wy + wh - h + 5 + j * 8, '#d8ecfc'); }
  for (let x = wx + 90; x < wx + ww; x += 90) rect(x, wy, 3, wh, '#1a1620'); rect(wx, wy + 76, ww, 3, '#1a1620');
  // flag
  rect(24, 100, 3, 150, '#8a8a98'); rect(27, 104, 28, 20, '#2a68d8'); for (let i = 0; i < 6; i++) px(41 + Math.cos(i) * 6, 114 + Math.sin(i) * 6, '#fff'); poly([[27, 104], [55 + [0, 1, 2, 1][f], 104], [55 + [0, 1, 2, 1][f], 124], [27, 124]], '#2a68d8', 0);
  // desk bottom
  vgrad(176, 270, ['#3a2e38', '#32282e', '#2a2228']); rect(0, 174, 480, 4, '#4a3a44'); rect(100, 200, 280, 70, '#46343a'); rect(100, 200, 280, 4, '#6a5058'); rect(120, 206, 20, 10, '#e8e0d0'); rect(330, 196, 10, 6, '#f0b0b0');
  poly([[wx, wy + wh], [wx + ww, wy + wh], [wx + ww + 60, 270], [wx - 60, 270]], '#fff6d0', .06);
  glow(240, 100, 200, '#cfe8ff', .12, 6);
  calm('#2a2228', .3, 205); vignette(.3, '#0a0610');
};
SCENES.cafe = f => {
  const r = rng(621);
  vgrad(0, 180, ['#f8ecd8', '#f2dfc0']); rect(0, 170, 480, 100, '#7a5236'); vgrad(170, 270, ['#8a5e3e', '#7a5236', '#6a4430']);
  rect(0, 150, 480, 26, '#5a3a28'); rect(0, 150, 480, 3, '#7a5236');
  for (let i = 0; i < 3; i++) { const cx = 80 + i * 160; ell(cx, 76, 52, 52, '#f0e4d0'); ell(cx, 76, 46, 46, '#9ad0f0'); vgrad(30, 122, ['#8ccaf0', '#cfeafc', '#fff4d8'], cx - 46, cx + 46); ell(cx, 76, 52, 52, '#9ad0f0', 0); for (let y = 30; y < 122; y++) for (let x = cx - 52; x < cx + 52; x++) { const d = Math.hypot(x - cx, y - 76); if (d > 46 && d < 52) px(x, y, '#6a4a34'); if (d > 52 && d < 54) px(x, y, '#4a3224', .6); if (d > 46) continue; } rect(cx - 1, 30, 2, 92, '#6a4a34'); rect(cx - 46, 75, 92, 2, '#6a4a34'); ell(cx + 22, 100 + [0, 1, 0, -1][f] * 0, 9, 9, '#6ac070'); ell(cx - 24, 52, 14, 5, '#fff', .8); 
    rect(cx - 1, 0, 1, 18, '#3a2a1e'); poly([[cx - 10, 32], [cx + 10, 32], [cx + 6, 20], [cx - 6, 20]], '#f8d890'); glow(cx, 30, 36 + (f % 2) * 2, '#ffc870', .45, 5); }
  // tables
  for (const x of [80, 240, 400]) { ell(x, 218, 38, 9, '#f2e8d8'); rect(x - 38, 217, 76, 3, '#d8c8b0'); rect(x - 2, 220, 4, 40, '#3a2a1e'); rect(x - 18, 258, 36, 3, '#3a2a1e'); rect(x + 12, 204, 8, 12, '#fff'); px(x + 14, 200 - (f % 3), '#fff', .6); px(x + 15, 197 - (f % 3), '#fff', .4); }
  glow(240, 120, 200, '#ffe8c0', .15, 6);
  calm('#6a4430', .3, 205); vignette(.2, '#2a1408');
};
SCENES.ramen = f => {
  const r = rng(631);
  vgrad(0, 160, ['#2a1410', '#3a1c14', '#4a2418']); 
  for (let i = 0; i < 7; i++) { const x = 40 + i * 66; rect(x, 0, 1, 14, '#1a0c08'); ell(x, 28, 12, 15, '#e8402a'); rect(x - 7, 12, 14, 3, '#2a0c08'); rect(x - 7, 40, 14, 3, '#2a0c08'); glow(x, 28, 34 + (i + f) % 2 * 2, '#ff6a3a', .45, 5); rect(x - 2, 20, 4, 16, '#ffe8c0', .5); }
  // menu boards
  for (let i = 0; i < 10; i++) { const x = 12 + i * 48; rect(x, 74, 36, 18, '#f4e8cc'); rect(x + 4, 79, 28, 2, '#8a2a1a'); rect(x + 4, 85, 20, 2, '#8a2a1a'); }
  // kitchen pass + steam
  rect(0, 108, 480, 6, '#2a1008'); rect(0, 114, 480, 36, '#2a1410', .8); for (let i = 0; i < 6; i++) { const x = 60 + i * 70; for (let k = 0; k < 6; k++) { const y = 112 - k * 7 - (f * 4) % 28 + 0, xx = x + Math.sin((y + f * 3) / 6) * 3; if (y > 60) px(xx, y, '#fff', .35 - k * .04), px(xx + 1, y, '#fff', .25); } }
  // counter
  vgrad(150, 270, ['#c88a52', '#b87a46', '#a86a3c']); rect(0, 148, 480, 6, '#6a3a20'); rect(0, 154, 480, 2, '#e0a878');
  for (const x of [130, 350]) { ell(x, 218, 44, 12, '#f0f0e8'); ell(x, 218, 36, 9, '#c0382a'); ell(x, 216, 30, 7, '#e8a850'); for (let k = 0; k < 5; k++) rect(x - 14 + k * 6, 214, 4, 1, '#fff2c0'); ell(x + 10, 214, 6, 3, '#f8f0e0'); for (let k = 0; k < 4; k++) px(x + Math.sin(f + k) * 4, 200 - k * 5 - f % 2, '#fff', .5 - k * .1); }
  calm('#a86a3c', .3, 205); vignette(.3, '#1a0804');
};
SCENES.alley = f => {
  const r = rng(641);
  vgrad(0, 200, ['#08060e', '#120e1e', '#1a1428']);
  poly([[0, 0], [150, 0], [150, 200], [0, 230]], '#16121e'); poly([[330, 0], [480, 0], [480, 230], [330, 200]], '#1a1624');
  rect(150, 0, 180, 200, '#0a0812'); for (const [x0, x1] of [[0, 150], [330, 480]]) for (let i = 0; i < 24; i++) { const x = x0 + r() * (x1 - x0), y = 10 + r() * 180; if (r() < .6) { rect(x, y, 6, 8, ['#a88850', '#8a7440', '#5a5a80'][i % 3], .7); } }
  rect(190, 40, 8, 160, '#1c1628'); rect(300, 70, 6, 130, '#1c1628'); // pipes
  // vending machine glow
  rect(210, 120, 44, 80, '#1c3a8a'); rect(214, 126, 36, 36, '#8ad0ff'); vgrad(126, 162, ['#cfeeff', '#6ab8f0'], 214, 250); for (let k = 0; k < 9; k++) rect(217 + (k % 3) * 11, 130 + (k / 3 | 0) * 11, 8, 8, ['#f06a6a', '#6af0a0', '#f0d060'][k % 3]); rect(214, 168, 36, 6, '#0a1a4a'); glow(232, 150, 80 + (f % 2) * 3, '#6ab8f0', .4, 6);
  // light from above, wet floor
  vgrad(200, 270, ['#16122a', '#100c1e', '#0a0814']); poly([[210, 200], [254, 200], [300, 270], [160, 270]], '#6ab8f0', .08);
  ell(232, 232, 70, 8, '#6ab8f0', .16);
  // cat
  rect(300, 188, 12, 10, '#0a0812'); ell(306, 186, 6, 5, '#0a0812'); poly([[301, 183], [303, 179], [305, 183]], '#0a0812'); poly([[307, 183], [309, 179], [311, 183]], '#0a0812'); const bl = f === 2; if (!bl) { px(303, 186, '#f0e040'); px(309, 186, '#f0e040'); } line(311, 196, 316 + [0, 1, 2, 1][f], 190, '#0a0812');
  S.fall(rng(642), f, 20, 40, 5, '#8aa0e0', .2, .4); 
  // steam from grate
  for (let k = 0; k < 6; k++) { const y = 250 - k * 9 - (f * 4) % 9, x = 90 + Math.sin(y / 5 + f) * 4; px(x, y, '#cfd8ff', .3); px(x + 1, y, '#cfd8ff', .2); }
  rect(70, 252, 36, 6, '#0a0812'); for (let k = 0; k < 6; k++) rect(72 + k * 6, 252, 1, 6, '#2a2438');
  calm('#0a0814', .3, 205); vignette(.4, '#000');
};
SCENES.medbay = f => {
  const r = rng(651);
  vgrad(0, 190, ['#e6f8f6', '#d0f0ee', '#c0e6e8']); for (let x = 0; x < 480; x += 60) rect(x, 0, 1, 190, '#b8dcdc', .6);
  vgrad(190, 270, ['#a8d8d8', '#9ccaca', '#90bebe']); rect(0, 186, 480, 5, '#fff');
  for (let x = 20; x < 480; x += 140) rect(x, 10, 80, 5, '#fff'); 
  // cross
  rect(386, 30, 14, 40, '#7ae0c8'); rect(373, 43, 40, 14, '#7ae0c8'); rect(386, 30, 14, 3, '#b8f4e4'); glow(393, 50, 50, '#b8f4e4', .2, 4);
  // monitor with ECG
  rect(46, 48, 110, 70, '#162a3a'); rect(50, 52, 102, 62, '#0c1c2a'); { let py = 84; for (let x = 0; x < 100; x++) { const p = ((x + f * 25) % 100); let y = 84; if (p > 40 && p < 44) y = 84 - (p - 40) * 8; else if (p >= 44 && p < 48) y = 52 + (p - 44) * 6 + 12; else if (p >= 48 && p < 52) y = 84 + (52 - p) * 2; else if (p > 70 && p < 78) y = 82 - Math.sin((p - 70) / 8 * 3.14) * 6; px(54 + x, y, '#7affc8'); px(54 + x, y + 1, '#7affc8', .4); } } text('72', 128, 56, '#7affc8', 1); glow(100, 84, 70, '#3ad0a8', .15, 4);
  // beds
  for (const x of [150, 290]) { rect(x, 148, 100, 12, '#fff'); rect(x, 160, 100, 3, '#d8e8e8'); rect(x + 4, 140, 24, 10, '#f4f8fa'); rect(x + 6, 163, 3, 24, '#9ab0b8'); rect(x + 91, 163, 3, 24, '#9ab0b8'); rect(x + 70, 148, 30, 12, '#bfe8f0', .9); }
  // iv drip
  rect(448, 80, 2, 108, '#9ab0b8'); rect(440, 80, 16, 2, '#9ab0b8'); rect(442, 84, 12, 16, '#d8f4f0'); rect(444, 90, 8, 8, '#7ac8e8'); px(448, 102 + f * 3, '#7ac8e8'); 
  // curtain
  for (let x = 0; x < 30; x++) rect(x, 0, 1, 190, Math.sin(x / 3 + [0, .5, 1, .5][f]) > 0 ? '#a8dcd8' : '#98ccc8');
  glow(240, 20, 200, '#fff', .18, 5);
  calm('#90bebe', .22, 205); vignette(.1, '#5a8a90');
};
SCENES.arcade = f => {
  const r = rng(661);
  vgrad(0, 270, ['#0c0618', '#140a28', '#0c0618']);
  // neon title
  const on = f !== 3; text('GAME ZONE', 142, 12, '#ff3ad8', 3, on ? 1 : .6); glow(240, 22, 120, '#ff3ad8', .3, 5);
  // cabinets
  const cc = ['#e83ad8', '#3ad8e8', '#e8c83a', '#3ae86a']; for (let i = 0; i < 8; i++) { const x = 14 + i * 58, col = cc[i % 4]; rect(x, 56, 44, 114, '#1a1030'); rect(x, 56, 44, 114, col, 0); rect(x, 56, 1, 114, col, .9); rect(x + 43, 56, 1, 114, col, .9); rect(x, 56, 44, 1, col, .9); rect(x + 4, 66, 36, 40, '#08061a'); vgrad(68, 104, [mix(col, '#000', .5), mix(col, '#000', .2)], x + 5, x + 39); // screen
    const sx = x + 8 + ((f * 7 + i * 5) % 22), sy = 74 + ((i * 11 + f * 4) % 20); rect(sx, sy, 5, 5, '#fff'); rect(x + 8 + (i * 3) % 20, 96, 12, 2, col); rect(x + 6, 112, 32, 14, '#2a1a4a'); px(x + 12, 118, '#ff5a5a'); px(x + 18, 118, '#5affff'); px(x + 28, 120, '#ffe45a'); glow(x + 22, 86, 40, col, .22 + (f + i) % 2 * .04, 4); text('PLAY', x + 12, 130, col, 1, .8); }
  // floor tiles + reflections
  vgrad(172, 270, ['#1c1030', '#140a24', '#0c0618']); for (let x = 0; x < 480; x += 40) rect(x, 172, 1, 98, '#2a1a4a', .6); for (const y of [186, 204, 228, 258]) rect(0, y, 480, 1, '#2a1a4a', .6);
  for (let i = 0; i < 8; i++) { const x = 14 + i * 58; rect(x + 10, 176, 24, 40, cc[i % 4], .06); }
  for (let i = 0; i < 30; i++) px(r() * 480, 215 + r() * 50, cc[i % 4], .3);
  calm('#0c0618', .3, 200); vignette(.3, '#000');
};
SCENES.mall = f => {
  const r = rng(671);
  vgrad(0, 90, ['#dff4ff', '#cce8fa', '#bfe0f4']); // skylight
  for (let x = 0; x < 480; x += 24) line(240 + (x - 240) * .6, 0, x, 90, '#9ac4e4', .8); for (let k = 0; k < 4; k++) { for (let x = 0; x < 480; x++) px(x, 14 + k * 20 + Math.sin(x / 70 * 1 + 1) * -3 * (1 - k * .2), '#a8cce8', .5); }
  S.cloud(180 + [0, 2, 3, 2][f], 36, 70, '#fff', '#f4faff', '#d8ecf8', 0); S.cloud(380 - [0, 1, 2, 1][f], 56, 60, '#fff', '#f4faff', '#d8ecf8');
  rect(0, 90, 480, 6, '#b8d0e4'); 
  // shop fronts
  for (let row = 0; row < 2; row++) for (let i = 0; i < 7; i++) { const x = 10 + i * 68, y = 100 + row * 50, col = ['#f4b8b8', '#f4e0a0', '#c8f0a8', '#a8e8f0', '#c8b8f4', '#f4a8d8', '#f4d0a0'][(i + row * 3) % 7]; rect(x, y, 60, 40, col); rect(x + 4, y + 10, 52, 28, '#fff', .5); rect(x + 6, y + 3, 48, 6, '#fff'); rect(x + 12, y + 5, 20, 2, col); for (let k = 0; k < 3; k++) rect(x + 10 + k * 16, y + 22, 10, 14, mix(col, '#fff', .3)); }
  rect(0, 140, 480, 4, '#c8d4e4'); rect(0, 148, 480, 2, '#fff');
  vgrad(200, 270, ['#ecd8d4', '#e0ccc8', '#d6c2be']); rect(0, 196, 480, 6, '#f8f0ee'); for (let x = 0; x < 480; x += 40) rect(x, 202, 1, 68, '#d0bcb8', .5); for (const y of [214, 234, 260]) rect(0, y, 480, 1, '#d0bcb8', .5);
  // plants/fountain
  ell(240, 232, 70, 9, '#a8d8f0', .8); ell(240, 232, 70, 9, '#d0ecfa', 0); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283 + f * .3; px(240 + Math.cos(a) * 20, 226 + Math.sin(a) * 2, '#fff', .8); } rect(236, 214, 8, 14, '#c8d8e8'); for (let k = 0; k < 5; k++) px(240 + (k - 2) * 3, 210 + Math.abs(k - 2) * 2 + f % 2, '#fff');
  glow(240, 50, 200, '#fff', .2, 5);
  calm('#e0ccc8', .2, 210); vignette(.08, '#7a8aa8');
};
SCENES.stage = f => {
  const r = rng(681);
  vgrad(0, 270, ['#0a0620', '#1a0c3a', '#2a1050']);
  // spotlight beams animated sweeping
  for (let i = 0; i < 6; i++) { const x0 = 40 + i * 80, sw = Math.round(Math.sin((f / 4 + i * .17) * 6.283) * 26); poly([[x0, 0], [x0 + 6, 0], [x0 + 6 + sw + 36, 190], [x0 + sw - 30, 190]], ['#ff5ad8', '#5ad8ff', '#ffe05a'][i % 3], .12); }
  text('STELLAR', 150, 48, '#e8d8ff', 6, .9); glow(240, 62, 150, '#a86aff', .25, 6);
  // stage platform
  rect(70, 170, 340, 6, '#ff5ac0'); rect(70, 176, 340, 18, '#1a0c3a'); rect(70, 170, 340, 1, '#ffd8f4'); 
  for (let i = 0; i < 12; i++) rect(80 + i * 28, 182, 14, 2, (i + f) % 2 ? '#ff5ac0' : '#5ad8ff');
  // crowd glowsticks
  vgrad(196, 270, ['#0c0620', '#080418']); const cr = rng(682); for (let i = 0; i < 160; i++) { const x = cr() * 480, y = 200 + cr() * 70, col = ['#ff5ad8', '#5ad8ff', '#ffe05a', '#7aff9a', '#fff'][i % 5]; const sw = ((i + f) % 4 < 2) ? 0 : 1; ell(x, y + 10, 5, 6, '#05020e'); rect(x + sw, y - 6, 1, 6, col); if (i % 3 === 0) px(x + sw, y - 7, '#fff'); }
  calm('#080418', .3, 205); vignette(.3, '#000');
};
SCENES.glass_city = f => {
  const r = rng(691);
  vgrad(0, 200, ['#061a20', '#0a2a30', '#104048']);
  S.stars(r, f, 50, 0, 90, ['#bff', '#dff']);
  S.skyline(rng(692), f, 230, 0, 30, 100, '#0c2a30', '#8aeaf0', .2);
  // crystal shards
  const sr = rng(693); for (let i = 0; i < 26; i++) { const x = sr() * 480, h = 24 + sr() * 90, w = 5 + sr() * 9, y = 250 - sr() * 20; const sh = (f + i) % 4 === 0; poly([[x, y], [x + w, y], [x + w / 2 + (sr() - .5) * 4, y - h]], sh ? '#d8ffff' : '#8aeaf0', .85); poly([[x + w / 2, y], [x + w, y], [x + w / 2 + 1, y - h]], '#4ab8c8', .8); glow(x + w / 2, y - h * .5, 14, '#8aeaf0', .15, 2); }
  rect(0, 246, 480, 24, '#06141a'); S.fall(rng(694), f, 30, 17, 1, '#cff', 0, .8);
  calm('#06141a', .3, 205); vignette(.3, '#000');
};
SCENES.rift = f => {
  const r = rng(701);
  vgrad(0, 270, ['#0a0418', '#2a0a48', '#5a1a78', '#2a0a48']);
  glow(240, 120, 150, '#d86aff', .6, 8); glow(240, 120, 70, '#fff0ff', .5, 5);
  const rr = 40 + [0, 2, 3, 2][f]; for (let a = 0; a < 300; a++) { const an = a / 300 * 6.283; px(240 + Math.cos(an) * rr * .8, 120 + Math.sin(an) * rr, '#fff'); px(240 + Math.cos(an) * (rr * .8 + 1), 120 + Math.sin(an) * (rr + 1), '#d8a0ff', .7); }
  const sr = rng(702); for (let i = 0; i < 32; i++) { const an = sr() * 6.283, d = 60 + sr() * 200, x = 240 + Math.cos(an) * d * 1.4, y = 120 + Math.sin(an) * d * .8, h = 14 + sr() * 36; const ex = x + Math.cos(an) * h * .5, ey = y + Math.sin(an) * h * .5; poly([[x - 3, y], [x + 3, y], [ex, ey]], '#c8a0ff', .9); line(x, y, 240 + (x - 240) * .6, 120 + (y - 120) * .6, '#d8a0ff', .0); }
  for (let i = 0; i < 18; i++) { const an = sr() * 6.283; for (let k = 40; k < 240; k += 4) if ((k + f * 6) % 12 < 3) px(240 + Math.cos(an) * k * 1.3, 120 + Math.sin(an) * k * .8, '#ffe0ff', .6); }
  // floating screens fragments
  for (let i = 0; i < 6; i++) { const x = 120 + i * 50 + Math.sin(f + i) * 3, y = 70 + (i * 37 % 100) + Math.cos(f + i) * 3; rect(x, y, 10, 18, '#0a0820'); rect(x, y, 10, 1, '#ff8aff'); px(x + 3, y + 6, '#8affff'); }
  rect(0, 240, 480, 30, '#0a0418'); calm('#0a0418', .3, 205); vignette(.3, '#000');
};
SCENES.beach = f => {
  const r = rng(711);
  vgrad(0, 120, ['#3a9cf0', '#6ab8f8', '#a8dcfc', '#d0eefc']);
  ell(400, 40, 20, 20, '#fffbd0'); glow(400, 40, 70, '#fffbd0', .35, 5);
  S.cloud(80 + [0, 2, 3, 2][f], 36, 100, '#fff', '#f6fbff', '#d4e8f8'); S.cloud(250 - [0, 1, 2, 1][f], 66, 80, '#fff', '#f6fbff', '#d4e8f8');
  for (let i = 0; i < 3; i++) { const x = 160 + i * 30 + [0, 2, 4, 2][f], y = 28 + i * 8; px(x, y, '#35405a'); px(x - 1, y - (f + i) % 2, '#35405a'); px(x + 1, y - (f + i) % 2, '#35405a'); }
  vgrad(118, 180, ['#1a8ad8', '#2aa8e8', '#58c8f0', '#8adcf4']);
  for (let y = 124; y < 176; y += 5) for (let k = 0; k < 9; k++) { const x = (k * 61 + y * 13 + f * 8) % 480; rect(x, y, 10 + k % 3 * 3, 1, '#fff', .35); }
  // waves foam
  for (let x = 0; x < 480; x++) { const y = 176 + Math.sin(x / 30 + f * 1.57) * 3; px(x, y, '#fff'); px(x, y + 1, '#fff', .6); px(x, y - 1, '#bff0ff', .6); }
  vgrad(180, 270, ['#f4dca0', '#ecd090', '#e4c484']); for (let i = 0; i < 80; i++) px(r() * 480, 182 + r() * 88, '#d0b070', .6);
  // umbrella
  line(90, 150, 90, 220, '#c8b8a8'); poly([[50, 160], [130, 160], [90, 132]], '#e83a4a'); poly([[70, 160], [90, 160], [90, 132]], '#fff'); poly([[110, 160], [130, 160], [90, 132]], '#fff'); poly([[90, 160], [110, 160], [90, 132]], '#e83a4a'); poly([[50, 160], [70, 160], [90, 132]], '#e83a4a');
  rect(340, 220, 40, 14, '#58d0f0'); rect(340, 220, 40, 2, '#a8e8fc');
  calm('#e4c484', .2, 215); vignette(.1, '#2a6a8a');
};
SCENES.aquarium = f => {
  const r = rng(721);
  vgrad(0, 270, ['#0a2a58', '#0a3a72', '#0a2a58', '#06183a']);
  // light rays
  for (let i = 0; i < 5; i++) poly([[60 + i * 90, 0], [80 + i * 90, 0], [110 + i * 90 + Math.round(Math.sin((f / 4 + i * .2) * 6.283) * 6), 210], [40 + i * 90, 210]], '#8ad8ff', .06);
  // jellyfish
  for (const [x, y, s] of [[90, 80, 1], [330, 60, 1.3], [420, 130, .8]]) { const yy = y + [0, -3, 0, 3][f]; ell(x, yy, 12 * s, 9 * s, '#e0a8f0', .85); rect(x - 12 * s, yy, 24 * s, 3, '#a070c0', .0); for (let k = -3; k <= 3; k++) { for (let j = 0; j < 16 * s; j++) px(x + k * 3 * s + Math.sin(j / 3 + f * 1.5 + k) * 1.5, yy + 6 + j, '#e0a8f0', .6 - j / 32); } glow(x, yy, 22 * s, '#e0a8f0', .2, 3); }
  // fish: swim right with wrap
  const fish = [[30, 140, '#ffd04a', 1], [150, 190, '#ff9a3a', 1], [270, 120, '#fff', 1.2], [380, 170, '#4ad0ff', 1], [210, 60, '#ff9a3a', .8], [60, 100, '#fff', .8]];
  fish.forEach(([x, y, col, s], i) => { const xx = (x + f * 12 * (i % 2 ? -1 : 1) + 480) % 480, d = i % 2 ? -1 : 1; ell(xx, y, 9 * s, 5 * s, col); poly([[xx - d * 8 * s, y], [xx - d * 14 * s, y - 5 * s], [xx - d * 14 * s, y + 5 * s]], col); px(xx + d * 5 * s, y - 1, '#000'); rect(xx - 3 * s, y - 2, 1, 5 * s, '#000', .2); });
  // bubbles
  S.fall(rng(722), f, 0, 1, 1, '#fff'); for (let i = 0; i < 24; i++) { const x = r() * 480, y0 = r() * 272; const y = 270 - ((y0 + f * 68) % 272); ell(x + Math.sin(y / 9) * 2, y, 1.5, 1.5, '#bfeaff', .6); }
  // floor sand + rocks
  vgrad(212, 270, ['#1a3a58', '#0e2640', '#081a30']); for (let i = 0; i < 10; i++) { const x = r() * 480; ell(x, 216, 16 + r() * 18, 6 + r() * 8, '#14304a'); }
  for (const x of [30, 440]) for (let k = 0; k < 6; k++) { const sw = Math.round(Math.sin((f + k) / 2) * 2); line(x + k * 3, 216, x + k * 3 + sw, 180 - k * 4, '#2aa070'); }
  for (let y = 0; y < 270; y += 2) for (let x = 0; x < 480; x += 2) if (bay(x, y) < .0) px(x, y, '#fff');
  calm('#081a30', .3, 205); vignette(.35, '#000');
};
SCENES.shrine = f => {
  const r = rng(731);
  vgrad(0, 150, ['#f8a070', '#fbc090', '#fde0b8', '#fff0d0']);
  S.cloud(110 + [0, 2, 3, 2][f], 40, 90, '#fff2e0', '#ffe0c0', '#f8c8a0'); S.cloud(380 - [0, 1, 2, 1][f], 62, 80, '#fff2e0', '#ffe0c0', '#f8c8a0');
  for (let x = 0; x < 480; x++) rect(x, 100 + Math.sin(x / 40) * 6, 1, 60, '#5a8a5a');
  for (let i = 0; i < 14; i++) { const x = i * 36 + r() * 10; ell(x, 112 + r() * 14, 22, 20 + r() * 6, i % 2 ? '#3a7a50' : '#2c6a42'); rect(x - 2, 124, 4, 30, '#4a2e2a'); }
  vgrad(150, 270, ['#e8d4b0', '#dcc8a4', '#cfba98']);
  // stairs
  for (let k = 0; k < 14; k++) { const y = 150 + k * 6, hw = 28 + k * 9; rect(240 - hw, y, hw * 2, 6, k % 2 ? '#b8a890' : '#c8b8a0'); rect(240 - hw, y, hw * 2, 1, '#e0d0b8'); }
  // torii
  rect(168, 50, 10, 110, '#d8341a'); rect(302, 50, 10, 110, '#d8341a'); rect(166, 50, 3, 110, '#f05a3a'); rect(150, 40, 180, 8, '#1a1418'); poly([[140, 34], [340, 34], [330, 44], [150, 44]], '#1a1418'); rect(160, 62, 160, 7, '#d8341a'); rect(228, 48, 24, 14, '#1a1418'); rect(168, 150, 10, 10, '#1a1418'); rect(302, 150, 10, 10, '#1a1418');
  // lanterns stone
  for (const x of [100, 372]) { rect(x, 170, 8, 30, '#8a8678'); rect(x - 4, 164, 16, 8, '#a8a498'); rect(x - 2, 156, 12, 8, '#8a8678'); rect(x + 2, 158, 4, 4, '#ffd890'); glow(x + 4, 160, 14, '#ffc070', .3, 3); }
  S.petals(rng(732), f, 24, ['#fff', '#ffd0b0', '#f8b090'], 17, 0, 270, 8);
  glow(240, 140, 180, '#fff0c0', .15, 5);
  calm('#cfba98', .2, 205); vignette(.15, '#a85a3a');
};
SCENES.station = f => {
  const r = rng(741);
  vgrad(0, 200, ['#dce4ee', '#e4eaf2', '#eef2f8']);
  for (let i = 0; i < 8; i++) rect(14 + i * 62, 14, 36, 4, '#fff');
  rect(0, 46, 480, 24, '#2a3a5a'); text('SHIBUYA', 150, 54, '#fff', 2); text('3', 262, 54, '#fff', 2); rect(300, 56, 10, 6, '#fff'); rect(0, 70, 480, 2, '#26b36b');
  // train
  const tx = [0, 3, 3, 0][f] * 0 + 0; rect(20, 78, 300, 88, '#e8edf4'); rect(20, 78, 300, 3, '#c8d0dc'); rect(20, 120, 300, 5, '#26b36b'); for (let i = 0; i < 5; i++) { rect(36 + i * 56, 88, 40, 28, '#4a6a88'); rect(36 + i * 56, 88, 40, 5, '#6a8aa8'); } rect(20, 160, 300, 8, '#98a4b8'); rect(120, 130, 3, 36, '#c8d0dc');
  // pillars + sign pole + clock
  rect(380, 80, 6, 130, '#4a5468'); rect(364, 76, 38, 20, '#14202e'); text('17:42', 368 + (f % 2) * 0, 82, '#7affc8', 1); if (f % 2) px(374, 84, '#14202e');
  // platform
  vgrad(176, 270, ['#a8b2c4', '#98a4b8', '#8c98ae']); rect(0, 172, 480, 6, '#f0d048'); for (let x = 0; x < 480; x += 8) rect(x, 173, 4, 4, '#2a2410', .5);
  for (let x = 0; x < 480; x += 60) rect(x, 200, 1, 70, '#8490a8', .5);
  glow(240, 30, 240, '#fff', .15, 5);
  calm('#8c98ae', .2, 210); vignette(.1, '#2a3a5a');
};
SCENES.konbini_hq = f => {
  const r = rng(751);
  vgrad(0, 270, ['#262a36', '#222632']); 
  for (let x = 40; x < 480; x += 160) rect(x, 10, 80, 3, '#d8e0ea');
  // shelf left
  rect(20, 96, 76, 86, '#3a4258'); for (let k = 0; k < 4; k++) { rect(20, 112 + k * 20, 76, 2, '#2a3044'); for (let i = 0; i < 9; i++) rect(24 + i * 8, 100 + k * 20 + (i % 2), 6, 12, ['#d84a6a', '#4ad8d8', '#e8c84a', '#6ad88a'][(i + k) % 4]); }
  // corkboard
  rect(130, 56, 150, 110, '#2a2030'); rect(134, 60, 142, 102, '#b88a4a'); text('SQUAD ZERO', 160, 50, '#ffd648', 1);
  for (const [x, y] of [[148, 76], [200, 70], [234, 100], [172, 114], [216, 138]]) { rect(x, y, 16, 14, '#fff'); px(x + 8, y - 1, '#e83a4a'); } line(156, 82, 208, 77, '#e83a4a'); line(208, 77, 242, 107, '#e83a4a'); line(156, 82, 180, 120, '#e83a4a'); line(180, 120, 224, 144, '#e83a4a'); line(242, 107, 224, 144, '#e83a4a'); 
  // window with city
  rect(320, 52, 120, 118, '#8a96a8'); vgrad(56, 166, ['#0a0e2a', '#161a40'], 324, 436); for (let i = 0; i < 16; i++) px(328 + r() * 104, 100 + r() * 60, (f + i) % 5 ? '#ffd070' : '#161a40'); rect(376, 56, 3, 110, '#8a96a8');
  // counter
  rect(130, 190, 220, 16, '#f0f2f6'); rect(130, 190, 220, 2, '#fff'); for (let i = 0; i < 3; i++) { rect(150 + i * 60, 178, 28, 12, '#2a6a8a'); rect(152 + i * 60, 180, 24, 7, '#6ad8e8'); }
  rect(0, 206, 480, 64, '#2a2e3c'); vgrad(206, 270, ['#2a2e3c', '#242836']); rect(0, 204, 480, 3, '#3a4050');
  glow(205, 110, 130, '#ffd890', .14, 5);
  calm('#242836', .3, 205); vignette(.3, '#000');
};
SCENES.boardroom = f => {
  const r = rng(761);
  vgrad(0, 270, ['#0c0c10', '#101014', '#0c0c10']);
  for (let i = 0; i < 4; i++) { const x = 40 + i * 100; rect(x, 30, 96, 120, '#0a1020'); rect(x, 30, 96, 120, '#fff', 0); const q = rng(762 + i); for (let k = 0; k < 120; k++) px(x + 3 + q() * 90, 34 + q() * 112, (k + f) % 7 ? '#ffd890' : '#0a1020'); rect(x + 95, 30, 4, 120, '#2a2a38'); }
  rect(36, 26, 4, 128, '#2a2a38'); rect(36, 150, 404, 4, '#2a2a38'); 
  // halo ring
  for (let a = 0; a < 200; a++) { const an = a / 200 * 6.283; px(240 + Math.cos(an) * 16, 50 + Math.sin(an) * 16, '#d8b45a'); } text('HALO', 226, 47, '#d8b45a', 1); glow(240, 50, 36, '#d8b45a', .2 + (f % 2) * .05, 4);
  // table in perspective
  poly([[130, 270], [350, 270], [296, 176], [184, 176]], '#3a2020'); poly([[184, 176], [296, 176], [286, 168], [194, 168]], '#5a3030'); line(184, 176, 130, 270, '#7a4a3a'); line(296, 176, 350, 270, '#7a4a3a'); 
  for (let k = 0; k < 6; k++) { const t = k / 5, y = 176 + t * 80, hw = 56 + t * 70; for (const s of [-1, 1]) rect(240 + s * (hw + 8) - 6, y - 8, 12, 14 + k * 2, '#1a1a22'); }
  poly([[190, 190], [290, 190], [310, 230], [170, 230]], '#fff', .04);
  calm('#0c0c10', .3, 205); vignette(.35, '#000');
};
SCENES.blacksite = f => {
  const r = rng(771);
  vgrad(0, 270, ['#080a0c', '#0c1014', '#0a0c10']);
  // concrete wall panels + vents
  for (let x = 0; x < 480; x += 60) { rect(x, 0, 1, 190, '#1a2024'); rect(x + 4, 20, 52, 70, '#12181c'); rect(x + 4, 110, 52, 60, '#12181c'); }
  for (let x = 30; x < 480; x += 120) for (let k = 0; k < 6; k++) rect(x, 36 + k * 5, 24, 2, '#05070a');
  // red warning lights
  for (const x of [60, 240, 420]) { rect(x - 6, 20, 12, 8, '#2a2428'); const on = (f + (x / 60 | 0)) % 2 === 0; ell(x, 24, 5, 3, on ? '#ff3a3a' : '#5a1818'); if (on) glow(x, 30, 50, '#ff3a3a', .35, 5); }
  // door center
  rect(190, 90, 100, 100, '#1c2228'); rect(196, 96, 88, 94, '#12181c'); rect(238, 96, 4, 94, '#0a0e12'); text('B-7', 226, 76, '#ff5a3a', 2); rect(296, 126, 8, 14, '#2a3238'); px(300, 130, (f % 2) ? '#ff3a3a' : '#3aff6a');
  rect(188, 88, 104, 3, '#e8c83a'); for (let x = 188; x < 292; x += 8) rect(x, 88, 4, 3, '#1a1a1a');
  vgrad(190, 270, ['#14181c', '#0e1216', '#0a0c10']); for (const y of [204, 226, 254]) rect(0, y, 480, 1, '#1a2024'); for (let x = 0; x < 480; x += 60) rect(x, 190, 1, 80, '#1a2024');
  ell(240, 230, 120, 10, '#ff3a3a', .05);
  calm('#0a0c10', .3, 205); vignette(.4, '#000');
};
SCENES.lab = f => {
  const r = rng(781);
  vgrad(0, 270, ['#041014', '#08202a', '#061418']);
  for (let i = 0; i < 5; i++) { const x = 30 + i * 100; rect(x - 12, 28, 40, 8, '#0a1a20'); rect(x - 12, 150, 40, 8, '#0a1a20'); rect(x - 4, 36, 24, 114, '#12606a', .85); for (let k = 0; k < 6; k++) { const bx = x - 2 + (k * 7 + i * 3) % 20, by = 148 - ((k * 31 + f * 14 + i * 9) % 110); px(bx, by, '#bff', .8); } rect(x - 4, 36, 3, 114, '#5ad8e0', .5); glow(x + 8, 92, 40, '#3ad0d8', .18, 3); }
  // glowing crystal centre
  glow(240, 120, 60, '#ff6ad8', .5, 6 ); for (let k = 0; k < 5; k++) { const h = 30 + (k * 13 % 20), x = 226 + k * 7; poly([[x, 150], [x + 6, 150], [x + 3, 150 - h - (f % 2) * 2]], k % 2 ? '#ffc0f0' : '#f090e0'); }
  vgrad(176, 270, ['#0a2028', '#08181e', '#051014']); rect(0, 172, 480, 4, '#16404a');
  for (let x = 0; x < 480; x += 60) rect(x, 176, 1, 94, '#0e2a32', .7);
  calm('#051014', .3, 205); vignette(.35, '#000');
};
SCENES.dome = f => {
  const r = rng(791);
  vgrad(0, 270, ['#0a0618', '#18082e', '#240c3e']);
  for (let a = 0; a < 200; a++) { const an = Math.PI + a / 200 * Math.PI; px(240 + Math.cos(an) * 280, 200 + Math.sin(an) * 190, '#6a4aa0'); px(240 + Math.cos(an) * 280, 201 + Math.sin(an) * 190, '#6a4aa0', .5); }
  for (let i = 0; i < 6; i++) { const x0 = 40 + i * 80, sw = Math.round(Math.sin((f / 4 + i * .2) * 6.283) * 18); poly([[x0, 0], [x0 + 5, 0], [x0 + sw + 30, 190], [x0 + sw - 24, 190]], ['#ff5ad8', '#5ad8ff', '#ffe05a'][i % 3], .1); }
  rect(150, 40, 180, 80, '#1a0a30'); rect(150, 40, 180, 80, '#ff6ad8', 0); for (let a = 0; a < 2; a++) { rect(150, 40 + a * 79, 180, 1, '#ff6ad8'); } rect(150, 40, 1, 80, '#ff6ad8'); rect(329, 40, 1, 80, '#ff6ad8'); text('LIVE', 204, 70, '#fff', 4, (f % 2) ? 1 : .85); glow(240, 80, 120, '#ff6ad8', .2, 5);
  rect(100, 166, 280, 4, '#5ad8ff'); rect(100, 170, 280, 12, '#14082a');
  vgrad(184, 270, ['#0c0620', '#080418']); const cr = rng(792); for (let i = 0; i < 220; i++) { const x = cr() * 480, y = 190 + cr() * 80, col = ['#ff5ad8', '#5ad8ff', '#ffe05a', '#7aff9a', '#fff'][i % 5]; if ((i + f) % 3) px(x, y, col, .8); }
  calm('#080418', .3, 205); vignette(.3, '#000');
};
SCENES.ascension = f => {
  const r = rng(801);
  vgrad(0, 270, ['#12041e', '#3a0c58', '#6a1a8a', '#2a0c48']);
  glow(240, 40, 160, '#ff8aff', .55, 8); glow(240, 40, 60, '#fff', .5, 5);
  const sr = rng(802); for (let i = 0; i < 30; i++) { const x = sr() * 480, y = sr() * 150, h = 16 + sr() * 50; poly([[x - 4, y + [0, 1, 0, -1][f]], [x + 4, y + [0, 1, 0, -1][f]], [x, y + h + [0, 1, 0, -1][f]]], '#e0c0ff', .85); }
  S.skyline(rng(803), f, 250, 0, 16, 60, '#1a0a30', '#ff9aff', .2);
  // tower
  poly([[232, 230], [248, 230], [242, 110], [238, 110]], '#e8503a'); for (let y = 120; y < 230; y += 8) line(236 - (y - 110) * .05, y, 244 + (y - 110) * .05, y + 8, '#ffb09a'); rect(236, 96, 8, 14, '#ff5a3a'); glow(240, 96, 20, '#ff5a3a', .4 + (f % 2) * .1, 3);
  rect(0, 250, 480, 20, '#0a0418'); calm('#0a0418', .3, 215); vignette(.3, '#000');
};
SCENES.memorial = f => {
  const r = rng(811);
  vgrad(0, 160, ['#c8e0fc', '#dcecfc', '#f4e8f4']);
  S.cloud(110 + [0, 2, 3, 2][f], 36, 90, '#fff', '#f8fcff', '#dce8f8'); S.cloud(360 - [0, 1, 2, 1][f], 56, 70, '#fff', '#f8fcff', '#dce8f8');
  vgrad(160, 270, ['#c0cca8', '#b4c29c', '#a8b890']);
  rect(130, 70, 220, 100, '#5a5e68'); rect(130, 70, 220, 3, '#7a7e88'); rect(134, 74, 212, 92, '#6a6e78'); text('SQUAD ONE', 192, 48, '#4a4e58', 2); text('WE REMEMBER', 192, 61, '#4a4e58', 1);
  for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) rect(142 + k * 66, 88 + i * 18, 50, 2, '#a8acb8');
  // candles + flowers
  for (let i = 0; i < 12; i++) { const x = 140 + i * 17; if (i % 3 === 1) { rect(x, 168, 4, 8, '#fff8e8'); px(x + 2, 166 - (f + i) % 2, '#ffc050'); px(x + 2, 165 - (f + i) % 2, '#ff8a3a', .6); glow(x + 2, 167, 8, '#ffc050', .3, 2); } else { px(x, 172, ['#ffd0e0', '#fff', '#ffe060'][i % 3]); px(x + 1, 173, '#7ac870'); px(x, 173, ['#ffd0e0', '#fff', '#ffe060'][i % 3]); } }
  const pk = ['#fbb8cc', '#f48ab0', '#ffd8e4']; S.sakura(70, 190, 1.4, '#5a3a40', pk, rng(812), f); S.sakura(412, 194, 1.5, '#5a3a40', pk, rng(813), f);
  S.petals(rng(814), f, 40, ['#fbb8cc', '#ffd0dc', '#fff0f4'], 17, 0, 270, 8);
  calm('#a8b890', .2, 205); vignette(.12, '#6a7a8a');
};
SCENES.mountain = f => {
  const r = rng(821);
  vgrad(0, 160, ['#2a3a7a', '#5a4a8a', '#c06a8a', '#f0907a', '#ffc090']);
  S.stars(r, f, 20, 0, 40); ell(330, 120, 22, 22, '#fff0b8'); glow(330, 120, 90, '#ffd890', .4, 6);
  for (const [bx, pk, col, shade] of [[100, 40, '#6a5a8a', '#5a4a7a'], [330, 70, '#5a4a7a', '#4a3a6a']]) { poly([[bx - 190, 180], [bx, pk], [bx + 190, 180]], col); poly([[bx, pk], [bx + 190, 180], [bx + 20, 180]], shade); poly([[bx - 14, pk + 22], [bx, pk], [bx + 14, pk + 22], [bx + 6, pk + 18], [bx, pk + 26], [bx - 6, pk + 18]], '#fff0f8'); }
  poly([[-100, 200], [120, 120], [340, 200]], '#4a3a6a'); poly([[200, 200], [400, 130], [600, 200]], '#3a2e5a');
  vgrad(170, 270, ['#2a2248', '#241c3e', '#1c1630']);
  // pines
  const tr = rng(822); for (let i = 0; i < 32; i++) { const x = tr() * 480, y = 190 + tr() * 70, s = .7 + tr() * .8; for (let k = 0; k < 3; k++) poly([[x - 9 * s + k, y - 24 * s + k * 9 * s], [x + 9 * s - k, y - 24 * s + k * 9 * s], [x, y - 40 * s + k * 9 * s]], '#16322e'); rect(x - 1, y - 6 * s, 2, 6 * s, '#2a1a1a'); }
  // cabin with chimney smoke
  rect(220, 206, 40, 28, '#6a4228'); poly([[212, 208], [268, 208], [240, 186]], '#3a2018'); rect(232, 218, 10, 16, '#2a1810'); rect(246, 212, 8, 8, '#ffd070'); glow(250, 216, 16, '#ffc060', .35, 3); rect(252, 188, 5, 12, '#3a2018');
  for (let k = 0; k < 5; k++) { const y = 186 - k * 6 - (f * 3) % 6, x = 254 + Math.sin((y + f) / 4) * 3 + k; px(x, y, '#e0d8f0', .5 - k * .08); px(x + 1, y, '#e0d8f0', .3); }
  calm('#1c1630', .3, 215); vignette(.3, '#0a0618');
};

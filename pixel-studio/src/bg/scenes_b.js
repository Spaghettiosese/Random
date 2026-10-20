// ============ REMAKES (priority) ============
const fenceDiamond = (y0, y1, col, a = .8) => { for (let x = -20; x < 500; x += 6) { line(x, y0, x + (y1 - y0), y1, col, a); line(x + (y1 - y0), y0, x, y1, col, a); } };
SCENES.rooftop = f => {
  const r = rng(401);
  vgrad(0, 160, ['#2a2058', '#5a2a78', '#b0407a', '#f0707a', '#ffb078', '#ffd890']);
  S.stars(r, f, 30, 0, 50);
  // sun
  glow(300, 132, 110, '#ffd890', .5, 7); ell(300, 132, 26, 26, '#fff0b0'); ell(300, 132, 19, 19, '#fffbe0');
  // clouds
  for (const [x, y, w, sp] of [[90, 40, 120, 2], [230, 62, 110, -2], [400, 86, 140, 2], [60, 110, 90, -1]]) { const dx = Math.round(Math.sin(f / 4 * 6.283) * 2 * (sp > 0 ? 1 : -1)); rect(x + dx - w / 2, y, w, 3, '#e0709a', .8); rect(x + dx - w / 2 + 10, y - 2, w - 24, 3, '#f0907a', .85); rect(x + dx - w / 2 + 20, y + 3, w - 30, 2, '#8a3a7a', .8); }
  // distant skyline
  S.skyline(rng(402), f, 172, 0, 18, 60, '#5a2a6a', '#ffd890', .06);
  S.skyline(rng(403), f, 176, 0, 14, 46, '#3a1c58', '#ffcf6a', .16, '#ffa0a8');
  // water tank + antenna on left
  rect(40, 120, 3, 40, '#2a1840'); rect(66, 120, 3, 40, '#2a1840'); ell(54, 112, 20, 8, '#2a1840'); rect(34, 112, 40, 8, '#2a1840'); poly([[34, 106], [74, 106], [54, 94]], '#2a1840'); rect(54, 70, 1, 24, '#2a1840'); px(54, 69 - (f % 2), '#ff4a5a'); glow(54, 70, 5, '#ff4a5a', .6, 3);
  // fence
  rect(0, 146, 480, 3, '#2a1c3a'); rect(0, 192, 480, 3, '#2a1c3a'); fenceDiamond(149, 192, '#1e1430', .75); for (let x = 0; x < 480; x += 60) rect(x, 144, 4, 52, '#2a1c3a');
  // floor
  vgrad(195, 270, ['#4a3050', '#3e2a48', '#362440']); for (let x = -40; x < 520; x += 70) line(240 + (x - 240) * .5, 195, x, 270, '#2e1e38', .7); rect(0, 218, 480, 1, '#2e1e38', .7); rect(0, 246, 480, 1, '#2e1e38', .7);
  poly([[250, 195], [350, 195], [420, 270], [160, 270]], '#ffb080', .07);
  // warm rim on floor, long shadows quiet
  calm('#3e2a48', .25, 210); vignette(.28, '#1a0c2c');
};
SCENES.park = f => {
  const r = rng(411);
  vgrad(0, 120, ['#5cb4f4', '#8cd0f8', '#c4e8fc']);
  S.cloud(70 + [0, 2, 3, 2][f], 30, 76, '#fff', '#f6fbff', '#d4e8f8'); S.cloud(240 - [0, 1, 2, 1][f], 52, 96, '#fff', '#f6fbff', '#d4e8f8'); S.cloud(400 + [0, 1, 1, 0][f], 26, 70, '#fff', '#f6fbff', '#d4e8f8');
  for (let x = 0; x < 480; x++) rect(x, 108 + Math.sin(x / 55) * 9 + Math.sin(x / 19) * 2, 1, 80, '#8ccc72');
  vgrad(120, 270, ['#9ad878', '#8ccc6a', '#7cbc5e', '#78b45a']);
  for (let i = 0; i < 12; i++) { const x = i * 42 + r() * 10, y = 124 + (r() - .5) * 8; ell(x, y, 16 + r() * 6, 14, i % 2 ? '#58a868' : '#4a9a5e'); }
  // sakura trees
  const pk = ['#fbb8cc', '#f48ab0', '#ffd8e4', '#ffeef2'], tr = rng(41);
  S.sakura(46, 178, 1.2, '#6a4a48', pk, tr, f); S.sakura(150, 150, .7, '#6a4a48', pk, tr, f); S.sakura(330, 154, .75, '#6a4a48', pk, tr, f); S.sakura(430, 188, 1.35, '#6a4a48', pk, tr, f);
  // path S curve
  poly([[190, 270], [300, 270], [270, 220], [250, 190], [250, 160], [236, 160], [232, 190], [210, 225]], '#ecdcb0');
  for (let y = 160; y < 270; y += 5) rect(0, y, 0, 0, '#000');
  // bench
  rect(330, 176, 36, 3, '#8a5a3a'); rect(330, 168, 36, 3, '#8a5a3a'); rect(332, 179, 2, 8, '#4a3a38'); rect(362, 179, 2, 8, '#4a3a38');
  // flowers
  for (let i = 0; i < 70; i++) { const x = r() * 480, y = 150 + r() * 120; px(x, y, ['#fff', '#ffe060', '#ffa0c0', '#c8a0f0'][i % 4]); }
  // lamp post
  rect(110, 130, 2, 52, '#3a4058'); ell(111, 128, 4, 4, '#fff6d0');
  S.petals(rng(92), f, 60, ['#fbb8cc', '#ffd0dc', '#fff0f4'], 17, 0, 270, 8);
  for (let i = 0; i < 3; i++) { const x = 60 + i * 150 + [0, 2, 4, 2][f], y = 40 + i * 9; px(x, y, '#35405a'); px(x - 1, y - (f + i) % 2, '#35405a'); px(x + 1, y - (f + i) % 2, '#35405a'); }
  calm('#78b45a', .2, 205); vignette(.08, '#2a6a4a');
};
const neonSign = (x, y, w, h, col, label, f, off = 0) => { const on = ((f + off) % 4) !== 3; rect(x, y, w, h, '#14102a'); rect(x, y, w, 1, col, on ? 1 : .4); rect(x, y + h - 1, w, 1, col, on ? 1 : .4); rect(x, y, 1, h, col, on ? 1 : .4); rect(x + w - 1, y, 1, h, col, on ? 1 : .4); text(label, x + Math.floor((w - tw(label)) / 2), y + Math.floor((h - 5) / 2), col, 1, on ? 1 : .5); if (on) glow(x + w / 2, y + h / 2, Math.max(w, h) * .8, col, .35, 4); };
SCENES.city_night = f => {
  const r = rng(421);
  vgrad(0, 200, ['#050a22', '#14103e', '#3a1c5a', '#7a3070']);
  S.stars(r, f, 110, 0, 110);
  ell(388, 46, 20, 20, '#fff6e0'); ell(382, 42, 4, 4, '#ecdcc0'); ell(394, 52, 3, 3, '#ecdcc0'); glow(388, 46, 70, '#d8d0ff', .4, 6);
  // ring halo floating
  ell(240, 80, 56, 11, '#7fe8ff', .0); for (let a = 0; a < 120; a++) { const an = a / 120 * 6.283; px(240 + Math.cos(an) * 56, 82 + Math.sin(an) * 11, '#7fe8ff', .8 - (f % 2) * .2); }
  S.skyline(rng(422), f, 205, 0, 40, 120, '#1c1642', '#ffcf6a', .2, '#ff8ab0');
  rect(226, 82, 28, 130, '#241c52'); rect(226, 82, 3, 130, '#3a2e6a'); for (let y = 90; y < 200; y += 6) rect(231, y, 20, 1, '#7fe8ff', .5 + ((y / 6 + f) % 4 === 0 ? .3 : 0));
  S.skyline(rng(423), f, 232, 0, 26, 80, '#0e0a24', '#ffe2a0', .25);
  rect(0, 232, 480, 38, '#07050e');
  neonSign(60, 190, 40, 14, '#ff3d8b', 'CAFE', f, 0); neonSign(380, 176, 46, 14, '#3dd8ff', 'BAR', f, 2);
  // moving traffic lights on bottom
  for (let i = 0; i < 9; i++) { const x = (i * 57 + f * 14) % 480; px(x, 236, '#ff5a5a'); px(x + 1, 236, '#ff5a5a', .5); px((i * 91 + 480 - f * 12) % 480, 240, '#fff2b0'); }
  calm('#0a0814', .3, 215); vignette(.3, '#000');
};
SCENES.street_night = f => {
  const r = rng(431);
  vgrad(0, 160, ['#04060f', '#141030', '#35184a']);
  S.stars(r, f, 40, 0, 60);
  S.skyline(rng(432), f, 176, 0, 30, 110, '#130f2a', '#ffcf6a', .18);
  // road wet
  vgrad(176, 270, ['#1a1630', '#120f24', '#0a0814']); rect(0, 176, 480, 2, '#2a2448');
  // konbini facade left
  rect(20, 88, 168, 92, '#1d2233'); rect(26, 100, 156, 66, '#bfe8ff'); vgrad(100, 166, ['#d8f2ff', '#a8d8f0'], 26, 182); for (let i = 0; i < 6; i++) rect(32 + i * 25, 130, 18, 30, '#7aa8c8', .6); rect(26, 100, 156, 66, '#fff', .12 + (f % 2) * .04);
  rect(20, 80, 168, 14, '#26b36b'); text('24H MART', 74, 84, '#fff', 1); rect(20, 78, 168, 2, '#1a8a52');
  glow(104, 150, 60, '#bfe8ff', .15, 4);
  // cracks on glass? keep
  // street lamp right with warm cone
  rect(380, 90, 3, 90, '#222'); line(381, 92, 405, 88, '#222'); ell(406, 90, 7, 3, '#ffe0a0'); poly([[398, 92], [414, 92], [440, 180], [372, 180]], '#ffd890', .09 + (f % 2) * .02); glow(406, 90, 18, '#ffd890', .4, 3);
  // puddle reflections
  ell(110, 214, 70, 6, '#bfe8ff', .12); ell(380, 226, 80, 8, '#ffd890', .1); for (let i = 0; i < 24; i++) { const x = 40 + ((i * 53 + f * 3) % 400), y = 190 + i * 3 % 70; rect(x, y, 8 + i % 5, 1, '#5a5a8a', .25); }
  // rain
  S.fall(rng(444), f, 90, 68, 9, '#9ab4ff', 0.6, .5);
  // ripples in puddles
  for (const [x, y] of [[100, 214], [150, 220], [380, 228]]) { const rr = 2 + f * 2; for (let a = 0; a < 20; a++) px(x + Math.cos(a / 20 * 6.283) * rr * 2, y + Math.sin(a / 20 * 6.283) * rr * .5, '#cfe0ff', .5 - f * .1); }
  calm('#0a0814', .3, 205); vignette(.35, '#000');
};
SCENES.konbini = f => {
  const r = rng(441);
  rect(0, 0, 480, 270, '#eef2f6'); vgrad(0, 120, ['#f4f7fa', '#e4eaf0']);
  for (let x = 20; x < 480; x += 110) { rect(x, 14, 90, 4, '#fff'); rect(x, 14, 90, 4, '#fff6c8', .6); } for (let x = 20; x < 480; x += 110) rect(x - 4, 8, 98, 14, '#fff', .15);
  // shelves left-centre
  rect(40, 70, 260, 110, '#c8ced8'); rect(40, 70, 260, 3, '#aab2c0');
  for (let row = 0; row < 4; row++) { const y = 76 + row * 26; rect(40, y + 22, 260, 3, '#aab2c0'); for (let x = 44; x < 296; x += 7) { const h = 12 + (x * 7 % 9); rect(x, y + 22 - h, 5, h, ['#f06a8a', '#6ab0f0', '#f0c850', '#6ad09a', '#a88af0', '#f08a50', '#5ad0d8'][(x / 7 + row * 3 | 0) % 7]); rect(x, y + 22 - h, 5, 2, '#fff', .35); } }
  // window right with rain
  rect(318, 52, 120, 118, '#8a96a8'); vgrad(56, 166, ['#0a0e2a', '#161a40'], 322, 434); for (let i = 0; i < 18; i++) px(326 + r() * 106, 90 + r() * 72, '#ffd070');
  S.fall(rng(445), f, 26, 40, 7, '#8aa0e0', .3, .7); 
  rect(322, 56, 112, 110, '#fff', 0); rect(374, 56, 3, 110, '#8a96a8');
  // floor
  vgrad(180, 270, ['#d8dee6', '#cdd4de', '#c4ccd8']); for (let x = 0; x < 480; x += 40) rect(x, 180, 1, 90, '#bcc4d0', .6); for (let y = 190; y < 270; y += 18) rect(0, y, 480, 1, '#bcc4d0', .5);
  rect(0, 178, 480, 3, '#2aa86a'); rect(0, 181, 480, 1, '#fff');
  // counter + register bottom right
  rect(380, 190, 100, 14, '#dde4ec'); rect(380, 190, 100, 2, '#fff'); rect(392, 170, 30, 20, '#2a3a4a'); rect(395, 173, 24, 12, '#5ad0a0'); text('24H', 399, 177, '#0a3a2a', 1, .9); if (f % 2) px(417, 175, '#fff');
  glow(160, 120, 140, '#fff', .3, 5);
  calm('#cdd4de', .2, 200); vignette(.08, '#4a5a78');
};
SCENES.hq_lobby = f => {
  const r = rng(451);
  vgrad(0, 180, ['#06102a', '#0c1a44', '#14306a']);
  // pillars with light strips
  for (let i = 0; i < 9; i++) { const x = i * 56 - 10; rect(x, 0, 30, 180, '#0a1638'); rect(x, 0, 2, 180, '#2a5aa8', .7); rect(x + 28, 0, 2, 180, '#05102a'); const lp = ((f + i) % 4 === 0) ? .9 : .5; rect(x + 14, 0, 2, 180, '#6ac8ff', lp); }
  // floor reflective
  vgrad(180, 270, ['#14306a', '#0e2250', '#0a1a40']); rect(0, 178, 480, 2, '#4aa8ff', .6);
  for (let x = -100; x < 600; x += 40) line(240 + (x - 240) * .4, 180, x, 270, '#2a5aa8', .4); for (const y of [192, 208, 230, 258]) rect(0, y, 480, 1, '#2a5aa8', .35);
  // central halo ring logo
  const cx = 240, cy = 92; for (let rr = 40; rr <= 44; rr++) for (let a = 0; a < 200; a++) { const an = a / 200 * 6.283; px(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr, '#8ae0ff', rr === 42 ? 1 : .7); } glow(cx, cy, 70, '#6ac8ff', .5, 6);
  text('HALO', cx - 16, cy - 3, '#e8fbff', 2);
  // holo panels
  for (const [x, flip] of [[40, 0], [388, 1]]) { rect(x, 50, 56, 28, '#14346a', .85); rect(x, 50, 56, 1, '#6ac8ff'); for (let k = 0; k < 4; k++) rect(x + 4, 56 + k * 5, 20 + (k * 11 + f * 3) % 22, 1, '#8ae0ff', .8); }
  // reception desk bottom center (low contrast)
  rect(160, 196, 160, 16, '#12285a'); rect(160, 196, 160, 2, '#5ac0ff', .8);
  // reflection of ring on floor
  ell(240, 190, 44, 6, '#6ac8ff', .12);
  // floating dust
  for (let i = 0; i < 24; i++) px(r() * 480, 20 + r() * 150 + (f * 2 + i) % 4, '#9ae0ff', .6);
  calm('#0e2250', .25, 200); vignette(.3, '#02081a');
};
SCENES.ops = f => {
  const r = rng(461);
  vgrad(0, 270, ['#070e1c', '#0a1428', '#0a1022']);
  // big central map screen
  rect(110, 22, 260, 124, '#12305a'); rect(114, 26, 252, 116, '#0a2244');
  for (let x = 114; x < 366; x += 14) rect(x, 26, 1, 116, '#1c4a7a', .6); for (let y = 26; y < 142; y += 14) rect(114, y, 252, 1, '#1c4a7a', .6);
  const mr = rng(462); for (let i = 0; i < 26; i++) rect(118 + mr() * 230, 30 + mr() * 100, 6 + mr() * 18, 4 + mr() * 14, '#2a5a98', .8);
  // sweep line + blip
  const sx = 114 + f * 63; rect(sx, 26, 2, 116, '#6ae8ff', .5); rect(sx - 4, 26, 4, 116, '#6ae8ff', .15);
  const bl = (f % 2); ell(300, 98, 5 + bl * 2, 5 + bl * 2, '#ff4a6a', .0); for (let a = 0; a < 24; a++) px(300 + Math.cos(a / 24 * 6.283) * (6 + bl * 2), 98 + Math.sin(a / 24 * 6.283) * (6 + bl * 2), '#ff5a7a'); px(300, 98, '#ff5a7a'); glow(300, 98, 18, '#ff4a6a', .4, 4);
  rect(110, 22, 260, 2, '#6ae8ff', .8); glow(240, 84, 170, '#2a78c8', .25, 6);
  // side panels
  for (const x of [16, 380]) { rect(x, 34, 84, 74, '#0f2a50'); rect(x, 34, 84, 2, '#6ae8ff', .8); for (let k = 0; k < 7; k++) rect(x + 6, 42 + k * 9, 14 + ((k * 23 + (f + k) * 9) % 54), 2, ['#6ae8ff', '#8ab8ff', '#7affc8'][k % 3], .85); }
  // console row bottom (calm, dark)
  for (let i = 0; i < 6; i++) { const x = 14 + i * 78; rect(x, 214, 66, 20, '#0e2040'); rect(x, 214, 66, 2, '#2a6aa8'); for (let k = 0; k < 5; k++) px(x + 8 + k * 11, 224, ((f + i + k) % 3 ? '#6ae8ff' : '#ff9a4a')); }
  vgrad(160, 214, ['#0a1428', '#0c1a34']); rect(0, 236, 480, 34, '#080e1c');
  for (let i = 0; i < 18; i++) px(r() * 480, 150 + r() * 60, '#4a8ac8', .4);
  calm('#080e1c', .3, 200); vignette(.3, '#000');
};
SCENES.training = f => {
  const r = rng(471);
  vgrad(0, 120, ['#0a1226', '#10203a', '#16284a']);
  // ceiling lights
  for (let i = 0; i < 8; i++) rect(14 + i * 60, 10, 38, 5, f % 2 === i % 2 ? '#d8f0ff' : '#c0e0ff'); rect(0, 18, 480, 1, '#2a3a5a');
  // sign
  rect(170, 54, 140, 26, '#ffd648'); rect(170, 54, 140, 2, '#fff0a0'); rect(170, 78, 140, 2, '#c89a20'); text('SQUAD ZERO', 190, 62, '#2a2208', 2);
  rect(0, 108, 480, 2, '#7a6428'); 
  // targets
  for (const x of [66, 414]) { rect(x - 2, 134, 5, 52, '#3a4258'); ell(x, 124, 15, 15, '#fff'); ell(x, 124, 11, 11, '#ee4a50'); ell(x, 124, 6, 6, '#fff'); ell(x, 124, 3, 3, '#ee4a50'); glow(x, 124, 26, '#ff6a6a', .2 + (f % 2) * .05, 3); }
  // training grid floor
  rect(0, 188, 480, 82, '#0c1e3a'); vgrad(188, 270, ['#1a3a68', '#10264a', '#0a1a36']); 
  for (let i = -14; i <= 14; i++) line(240 + i * 8, 190, 240 + i * 52, 270, '#4aa8ff', .45); for (let k = 0; k < 7; k++) { const y = 190 + Math.pow(k / 6, 1.7) * 80; rect(0, y, 480, 1, '#4aa8ff', .4); }
  const gl = (f * 20) % 80; rect(0, 190 + gl, 480, 1, '#8ae0ff', .5);
  rect(0, 188, 480, 1, '#8ae0ff', .8);
  // mats + equipment silhouette
  rect(130, 150, 220, 36, '#16284a', .0);
  calm('#0a1a36', .3, 205); vignette(.3, '#02060e');
};
SCENES.festival = f => {
  const r = rng(481);
  vgrad(0, 200, ['#07061c', '#1a1240', '#3a1a52', '#6a2a5a']);
  S.stars(r, f, 50, 0, 80);
  // fireworks (animated: grow/fade per frame)
  const fw = (x, y, rr, col, ph) => { const p = (f + ph) % 4; const rad = [3, rr * .5, rr * .85, rr][p], a = [1, 1, .8, .4][p]; for (let i = 0; i < 18; i++) { const an = i / 18 * 6.283, d = rad; px(x + Math.cos(an) * d, y + Math.sin(an) * d, col, a); if (p > 0) px(x + Math.cos(an) * d * .8, y + Math.sin(an) * d * .8 + p, col, a * .6); } if (p < 2) glow(x, y, rr * 1.2, col, .35, 4); };
  fw(110, 62, 42, '#ff5d85', 0); fw(350, 50, 50, '#ffd24a', 1); fw(240, 34, 32, '#52e0ff', 2); fw(430, 90, 28, '#c88aff', 3);
  S.skyline(rng(482), f, 150, 0, 20, 52, '#120a22', '#ffcf6a', .1);
  // lantern string
  for (const [y0, off] of [[104, 0], [118, 1]]) { for (let x = 0; x < 480; x += 2) px(x, y0 + Math.sin(x / 480 * Math.PI * 3) * 8, '#1a0f18'); for (let i = 0; i < 20; i++) { const x = 10 + i * 24, y = y0 + Math.sin(x / 480 * Math.PI * 3) * 8 + 2; const col = (i + off) % 3 ? '#ff5a3a' : '#fff0c0'; rect(x - 3, y, 7, 8, col); rect(x - 2, y - 1, 5, 1, '#2a1018'); rect(x - 2, y + 8, 5, 1, '#2a1018'); glow(x, y + 4, 12, col, .35 + ((f + i) % 4 === 0 ? .1 : 0), 3); } }
  // stalls
  for (let i = 0; i < 5; i++) { const x = 6 + i * 96; rect(x, 150, 88, 70, '#3a1a1a'); for (let k = 0; k < 8; k++) rect(x + k * 11, 138, 11, 14, k % 2 ? '#fff' : '#e8344a'); rect(x + 4, 168, 80, 28, '#e8b068'); rect(x + 4, 168, 80, 2, '#fff0c0'); glow(x + 44, 176, 36, '#ffc070', .4, 4); const lb = ['TAKO', 'KINGYO', 'KAKIGORI', 'RINGO', 'MASK'][i]; rect(x + 14, 154, 60, 10, '#fff6e0'); text(lb, x + 44 - tw(lb) / 2, 157, '#c02838'); rect(x + 14, 200, 60, 20, '#5a2a22'); for (let k = 0; k < 4; k++) px(x + 22 + k * 14, 186 + (k % 2) * 3, ['#ff6a6a', '#6ad0ff', '#ffe060', '#9aff9a'][k]); }
  rect(0, 220, 480, 50, '#1a0f18'); vgrad(220, 270, ['#241820', '#1a0f18']);
  // crowd silhouettes
  const cr = rng(483); for (let i = 0; i < 20; i++) { const x = cr() * 480, h = 14 + cr() * 8, sw = Math.round(Math.sin((f + i) / 4 * 6.283)); ell(x, 232 - h + sw * 0, 4, 4.5, '#0c0610'); rect(x - 5, 236 - h + 4, 10, h, '#0c0610'); }
  calm('#1a0f18', .35, 214); vignette(.3, '#000');
};
SCENES.amusement = f => {
  const r = rng(491);
  vgrad(0, 200, ['#3a2a6a', '#8a3a7a', '#e0607a', '#ff9a6a', '#ffcf7a']);
  S.stars(r, f, 14, 0, 40);
  ell(120, 168, 30, 30, '#fff0b8', .0);
  // roller coaster track far left
  for (let x = 0; x < 230; x++) { const y = 150 - Math.sin(x / 36) * 40 * (x < 150 ? 1 : .5) - Math.max(0, 40 - Math.abs(x - 90)) * .3; px(x, y, '#2a1840'); px(x, y + 1, '#2a1840'); } for (let x = 4; x < 230; x += 9) { const y = 150 - Math.sin(x / 36) * 40 * (x < 150 ? 1 : .5) - Math.max(0, 40 - Math.abs(x - 90)) * .3; rect(x, y, 1, 200 - y, '#2a1840', .85); }
  // coaster car moves
  const cx = 30 + f * 18; { const y = 150 - Math.sin(cx / 36) * 40 * (cx < 150 ? 1 : .5) - Math.max(0, 40 - Math.abs(cx - 90)) * .3; rect(cx - 5, y - 5, 10, 4, '#ff5a7a'); }
  // Ferris wheel
  const wx = 345, wy = 104, R = 78, ang = f * (Math.PI / 24);
  for (let a = 0; a < 360; a++) { const an = a / 360 * 6.283; px(wx + Math.cos(an) * R, wy + Math.sin(an) * R, '#2a1840'); px(wx + Math.cos(an) * (R - 1), wy + Math.sin(an) * (R - 1), '#2a1840', .5); }
  for (let i = 0; i < 12; i++) { const an = ang + i / 12 * 6.283; line(wx, wy, wx + Math.cos(an) * R, wy + Math.sin(an) * R, '#3a2250'); const gx = wx + Math.cos(an) * R, gy = wy + Math.sin(an) * R; rect(gx - 3, gy, 7, 6, ['#ffd060', '#ff7aa0', '#7ad0ff', '#b08aff'][i % 4]); rect(gx - 3, gy, 7, 1, '#fff', .6); }
  ell(wx, wy, 5, 5, '#ffd060'); line(wx, wy, wx - 26, 205, '#2a1840'); line(wx, wy, wx + 26, 205, '#2a1840'); line(wx - 3, wy, wx - 28, 205, '#2a1840'); line(wx + 3, wy, wx + 28, 205, '#2a1840');
  for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283 + ang; if ((i + f) % 2) px(wx + Math.cos(an) * R, wy + Math.sin(an) * R - 2, '#fff8c0'); }
  // far silhouettes
  S.skyline(rng(492), f, 205, 0, 8, 26, '#2a1840', '#ffd070', .08);
  rect(0, 205, 480, 65, '#2a1c3a'); vgrad(205, 270, ['#3a2646', '#2a1c3a', '#241830']);
  for (let x = 0; x < 480; x += 12) { px(x, 206, (x / 12 + f) % 3 ? '#ffd070' : '#ff7aa0'); px(x, 207, '#ffd070', .4); }
  S.stars(rng(5), f, 0, 0, 1);
  calm('#241830', .3, 210); vignette(.25, '#1a0c2c');
};
SCENES.snow_city = f => {
  const r = rng(501);
  vgrad(0, 190, ['#0a1236', '#14204e', '#223a6a', '#34508a']);
  S.stars(r, f, 70, 0, 80);
  S.skyline(rng(502), f, 214, 0, 40, 110, '#14204a', '#ffe08a', .24, '#ffffff');
  S.skyline(rng(503), f, 224, 0, 24, 70, '#0e1838', '#ffd070', .3);
  // snow ground
  for (let x = 0; x < 480; x++) { const y = 214 + Math.sin(x / 70) * 4; rect(x, y, 1, 60, '#e8f0ff'); } vgrad(214, 270, ['#f4f8ff', '#dce6fa', '#c8d6f2']);
  // christmas tree centre
  const tx = 240; poly([[tx, 38], [tx + 22, 94], [tx - 22, 94]], '#1c6a4a'); poly([[tx, 72], [tx + 34, 144], [tx - 34, 144]], '#1c6a4a'); poly([[tx, 110], [tx + 46, 200], [tx - 46, 200]], '#1c6a4a'); poly([[tx, 110], [tx + 46, 200], [tx, 200]], '#14583c');
  rect(tx - 5, 200, 10, 16, '#5a3a2a'); text('★', tx - 5, 24, '#ffe060', 3); glow(tx, 28, 22, '#ffe060', .5, 4);
  const lr = rng(504); for (let i = 0; i < 40; i++) { const y = 50 + lr() * 150, hw = (y - 40) * .25 + (y > 112 ? (y - 112) * .12 : 0); const x = tx + (lr() - .5) * 2 * Math.min(hw, 44); const col = ['#ff5a6a', '#ffe060', '#6ad0ff', '#fff'][i % 4]; if ((i + f) % 3) { px(x, y, col); px(x + 1, y, col, .5); } }
  // snow caps
  for (const [y, w] of [[94, 22], [144, 34], [196, 46]]) for (let k = -w; k < w; k += 3) px(tx + k, y - Math.abs(k) / w * 0 - 1, '#fff', .8);
  // light strings across
  for (let x = 0; x < 480; x += 2) px(x, 98 + Math.sin(x / 480 * Math.PI * 4) * 8 + (x > 100 ? 0 : 0), '#1a2030', .0);
  for (let i = 0; i < 40; i++) { const x = i * 12, y = 112 + Math.sin(x / 480 * Math.PI * 5) * 8; px(x, y, '#222a40'); if ((i + f) % 3) { glow(x, y + 1, 4, ['#ff5a6a', '#ffe060', '#6ad0ff', '#7affc8'][i % 4], .5, 2); px(x, y + 1, ['#ff5a6a', '#ffe060', '#6ad0ff', '#7affc8'][i % 4]); } }
  // snowfall: two layers
  S.fall(rng(505), f, 90, 17, 1, '#fff', 0, .9); S.fall(rng(506), f, 40, 34, 2, '#fff', 0, 1, 1);
  calm('#c8d6f2', .15, 220); vignette(.25, '#0a1030');
};
SCENES.harbor = f => {
  const r = rng(511);
  vgrad(0, 150, ['#1a0a1e', '#3a1228', '#7a1c34', '#b0344a', '#d86a5a']);
  S.stars(r, f, 24, 0, 40);
  for (const [x, y, w] of [[100, 54, 140], [320, 76, 130], [220, 36, 80]]) { rect(x - w / 2 + [0, 1, 2, 1][f], y, w, 3, '#5a1a38', .8); rect(x - w / 2 + 10 + [0, 1, 2, 1][f], y + 3, w - 30, 2, '#2a0c28', .7); }
  // sun glow at horizon
  glow(260, 156, 90, '#ff8a6a', .4, 6);
  // far skyline + cranes
  S.skyline(rng(512), f, 160, 0, 6, 28, '#1a0c20', '#ffd070', .1);
  for (const [x, h, flip] of [[70, 70, 1], [190, 82, 1], [380, 62, 0]]) { rect(x, 160 - h, 4, h, '#140818'); rect(x - 40 * (flip ? 0 : 1) - (flip ? 0 : 0), 160 - h, 76, 3, '#140818'); line(x + 2, 160 - h, x + 36, 160 - h + 20, '#140818'); rect(x + 34, 160 - h + 3, 2, 20, '#140818'); if (f % 2) px(x + 2, 158 - h, '#ff4a5a'); glow(x + 2, 158 - h, 5, '#ff4a5a', .4, 2); }
  // containers
  const cols = ['#4a4a7a', '#7a3a3a', '#6a7a3a', '#3a5a7a', '#7a5a2a']; for (let i = 0; i < 12; i++) { const x = 8 + i * 40 + (i % 3) * 4, row = i % 2; rect(x, 148 - row * 9, 34, 10, cols[i % 5]); rect(x, 148 - row * 9, 34, 1, '#fff', .15); for (let k = 3; k < 34; k += 4) rect(x + k, 148 - row * 9 + 1, 1, 9, '#000', .25); } rect(0, 158, 480, 6, '#140818');
  // water
  vgrad(162, 270, ['#5a2038', '#3a1a34', '#241228', '#1a0c20']);
  for (let i = 0; i < 30; i++) { const y = 166 + i * 3.3, w = 20 + i * 3, off = Math.sin(i * 1.3 + f * 1.57) * 6; rect(260 + off - w / 2, y, w, 1, '#ff8a6a', .55 - i * .015); }
  for (let y = 170; y < 270; y += 7) for (let k = 0; k < 6; k++) { const x = (k * 83 + y * 11 + f * 6) % 480; rect(x, y, 14, 1, '#6a3a5a', .5); }
  // pier lamps
  for (const x of [40, 440]) { rect(x, 134, 2, 28, '#140818'); ell(x + 1, 132, 4, 4, '#ffd890'); glow(x + 1, 132, 22, '#ffc070', .5, 4); line(x + 1, 160, x + 1, 200, '#ffc070', .0); }
  calm('#241228', .3, 205); vignette(.35, '#0a0410');
};

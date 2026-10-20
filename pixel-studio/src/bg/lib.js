// Pixel BG toolkit: native 480x270 buffer, seeded RNG, dithered gradients, glows, tiny font.
const W = 480, H = 270;
const L = (() => {
  const buf = new Uint32Array(W * H);
  const cc = {};
  const c = h => { if (typeof h === 'number') return h; if (cc[h]) return cc[h]; let s = h.replace('#', ''); if (s.length === 3) s = s.split('').map(x => x + x).join(''); const n = parseInt(s, 16); return cc[h] = (255 << 24) | ((n & 255) << 16) | (n & 0xff00) | (n >> 16); };
  const rgb = v => [v & 255, (v >> 8) & 255, (v >> 16) & 255];
  const mix = (a, b, t) => { a = c(a); b = c(b); const A = rgb(a), B = rgb(b); return (255 << 24) | (Math.round(A[2] + (B[2] - A[2]) * t) << 16) | (Math.round(A[1] + (B[1] - A[1]) * t) << 8) | Math.round(A[0] + (B[0] - A[0]) * t); };
  const rng = seed => { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const bay = (x, y) => (B4[(y & 3) * 4 + (x & 3)] + .5) / 16;
  const px = (x, y, col, a = 1) => {
    x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return; col = c(col);
    if (a >= 1) { buf[y * W + x] = col; return; } if (a <= 0) return;
    const d = buf[y * W + x]; const r = (d & 255) + ((col & 255) - (d & 255)) * a, g = ((d >> 8) & 255) + (((col >> 8) & 255) - ((d >> 8) & 255)) * a, b = ((d >> 16) & 255) + (((col >> 16) & 255) - ((d >> 16) & 255)) * a;
    buf[y * W + x] = (255 << 24) | (Math.round(b) << 16) | (Math.round(g) << 8) | Math.round(r);
  };
  const get = (x, y) => buf[(y | 0) * W + (x | 0)];
  const rect = (x, y, w, h, col, a = 1) => { x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h); col = c(col); for (let j = Math.max(0, y); j < Math.min(H, y + h); j++) for (let i = Math.max(0, x); i < Math.min(W, x + w); i++) px(i, j, col, a); };
  // dithered rect: pattern level 0..1 of col over existing
  const drect = (x, y, w, h, col, lvl) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (bay(i, j) < lvl) px(i, j, col); };
  const line = (x0, y0, x1, y1, col, a = 1) => { x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1); const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy; for (;;) { px(x0, y0, col, a); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } } };
  const ell = (cx, cy, rx, ry, col, a = 1) => { for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++) for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++) { const dx = (i + .5 - cx) / rx, dy = (j + .5 - cy) / ry; if (dx * dx + dy * dy <= 1) px(i, j, col, a); } };
  const poly = (pts, col, a = 1) => { let y0 = Infinity, y1 = -Infinity; pts.forEach(p => { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }); for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) { const xs = []; const yy = y + .5; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] <= yy && b[1] > yy) || (b[1] <= yy && a[1] > yy)) xs.push(a[0] + (yy - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); } xs.sort((p, q) => p - q); for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) px(x, y, col, a); } };
  // vertical dithered gradient over rows y0..y1 (exclusive), cols x0..x1
  const vgrad = (y0, y1, cols, x0 = 0, x1 = W) => { const n = cols.length - 1; for (let y = y0; y < y1; y++) { const t = (y - y0) / Math.max(1, y1 - y0 - 1) * n, k = Math.min(n - 1, Math.floor(t)), fr = t - k; for (let x = x0; x < x1; x++) px(x, y, bay(x, y) < fr ? cols[k + 1] : cols[k]); } };
  const hgrad = (x0, x1, cols, y0 = 0, y1 = H) => { const n = cols.length - 1; for (let x = x0; x < x1; x++) { const t = (x - x0) / Math.max(1, x1 - x0 - 1) * n, k = Math.min(n - 1, Math.floor(t)), fr = t - k; for (let y = y0; y < y1; y++) px(x, y, bay(x, y) < fr ? cols[k + 1] : cols[k]); } };
  // stepped radial glow (pixel-art banded)
  const glow = (cx, cy, r, col, a = .5, steps = 5, sy = 1) => { for (let s = steps; s >= 1; s--) ell(cx, cy, r * s / steps, r * s / steps * sy, col, a / steps * .5); };
  // dithered soft glow (smoother, dithered)
  const dglow = (cx, cy, r, col, a = .6, sy = 1) => { col = c(col); for (let j = Math.floor(cy - r * sy); j <= cy + r * sy; j++) for (let i = Math.floor(cx - r); i <= cx + r; i++) { const dx = (i - cx) / r, dy = (j - cy) / (r * sy), d = dx * dx + dy * dy; if (d < 1) { const v = (1 - d) * a; if (bay(i, j) < v * 1.2) px(i, j, col, Math.min(1, .35 + v * .5)); } } };
  const F = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110', 4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001110', '-': '000000111000000', '.': '000000000000010', ':': '000010000010000', '★': '010111111101101', '!': '010010010000010', ' ': '000000000000000', '·': '000000010000000' };
  const text = (s, x, y, col, sc = 1, a = 1) => { s = String(s).toUpperCase(); for (const ch of s) { const g = F[ch] || F[' ']; for (let k = 0; k < 15; k++) if (g[k] === '1') rect(x + (k % 3) * sc, y + Math.floor(k / 3) * sc, sc, sc, col, a); x += 4 * sc; } return x; };
  const tw = (s, sc = 1) => String(s).length * 4 * sc - sc;
  const clear = col => buf.fill(c(col));
  const vignette = (str = .35, col = '#000') => { col = c(col); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const dx = (x - W / 2) / (W / 2), dy = (y - H / 2) / (H / 2), d = (dx * dx + dy * dy * .8) / 2; let v = Math.max(0, d - .28) * str * 1.5; v = Math.round(v * 16) / 16; if (v > 0) px(x, y, col, Math.min(.6, v)); } };
  const calm = (col, str = .3, y0 = 170) => { for (let y = y0; y < H; y++) { const v = Math.round((y - y0) / (H - y0) * str * 12) / 12; if (v > 0) rect(0, y, W, 1, col, v); } };
  // tint whole frame
  const tint = (col, a) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(x, y, col, a); };
  const canvas = () => { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'); const id = g.createImageData(W, H); new Uint32Array(id.data.buffer).set(buf); g.putImageData(id, 0, 0); return cv.toDataURL('image/png'); };
  return { buf, c, mix, rng, bay, px, get, rect, drect, line, ell, poly, vgrad, hgrad, glow, dglow, text, tw, clear, vignette, calm, tint, canvas, rgb };
})();
const { c, mix, rng, bay, px, rect, drect, line, ell, poly, vgrad, hgrad, glow, dglow, text, tw, clear, vignette, calm, tint } = L;
// ---------- reusable scene parts ----------
const S = {};
const sine = (f, ph = 0) => Math.sin((f / 4 + ph) * Math.PI * 2);
// twinkling stars
S.stars = (r, f, n, y0, y1, cols = ['#fff', '#cfe0ff', '#ffe9c0']) => { for (let i = 0; i < n; i++) { const x = (r() * W) | 0, y = (y0 + r() * (y1 - y0)) | 0, col = cols[(r() * cols.length) | 0], ph = r(), big = r() < .15; const tw = (Math.floor(f + ph * 4) % 4); if (tw === 0) continue; px(x, y, col, tw === 2 ? 1 : .6); if (big && tw >= 2) { px(x - 1, y, col, .5); px(x + 1, y, col, .5); px(x, y - 1, col, .5); px(x, y + 1, col, .5); } } };
// clouds: array of [x,y,w] drifting
S.cloud = (x, y, w, hi, mid, lo) => { const h = Math.max(3, w * .18) | 0; ell(x, y, w / 2, h, mid); ell(x - w * .18, y - h * .6, w * .25, h * .9, hi); ell(x + w * .15, y - h * .8, w * .22, h, hi); rect(x - w / 2, y + h * .4, w, h * .6, lo, 0); ell(x + w * .05, y + h * .35, w * .42, h * .5, lo, .5); };
// skyline silhouette with lit windows; returns nothing. cols: base,[roof], win colour
S.skyline = (r, f, base, y, minH, maxH, col, win, density = .25, wcol2, seedoff = 0) => { let x = -4; while (x < W) { const w = 14 + (r() * 26 | 0), h = minH + (r() * (maxH - minH) | 0); rect(x, base - h, w, h + 2, col); if (r() < .3) rect(x + 3, base - h - 4, 2, 4, col); if (r() < .25) rect(x + w / 2 - 1, base - h - 7, 1, 7, col); for (let wy = base - h + 3; wy < base - 4; wy += 4) for (let wx = x + 2; wx < x + w - 2; wx += 3) { const q = r(); if (q < density) { const fl = r() < .03 ? (f % 2) : 0; if (!fl) px(wx, wy, q < density * .2 && wcol2 ? wcol2 : win); } } x += w + (r() * 3 | 0); } };
// cherry / round tree
S.sakura = (x, y, s, trunk, cols, r, f) => { rect(x - 2 * s, y - 38 * s, 4 * s, 38 * s, trunk); for (let i = 0; i < 9; i++) { const dx = (r() - .5) * 46 * s, dy = -44 * s - r() * 30 * s, rr = (12 + r() * 9) * s; ell(x + dx, y + dy, rr, rr * .8, cols[0]); } for (let i = 0; i < 22; i++) { const dx = (r() - .5) * 52 * s, dy = -46 * s - r() * 34 * s; ell(x + dx, y + dy, 5 * s, 4 * s, cols[1 + (r() * (cols.length - 1) | 0)]); } };
S.petals = (r, f, n, cols, step = 17, y0 = 0, y1 = H, sway = 6) => { cols = [].concat(cols); const P = step * 4, tiles = Math.ceil((y1 - y0) / P) + 1; for (let i = 0; i < n; i++) { const x0 = r() * W, ph = r() * P, col = cols[i % cols.length], ph2 = r() * 6.28; for (let t = 0; t < tiles; t++) { const y = y0 + t * P + ((ph + f * step) % P); if (y > y1) continue; const x = x0 + Math.sin(y / 23 + ph2) * sway + f * 1.5; px(x, y, col); px(x + 1, y, col, .7); } } };
// seamless falling particles (period 4 frames): n particles, step px/frame, tile rows P=4*step must divide-ish H: we use period=cyc
S.fall = (r, f, n, step, len, col, slant = 0, a = 1, big = 0) => { const P = step * 4, tiles = Math.ceil(H / P) + 1; for (let i = 0; i < n; i++) { const x0 = r() * W, y0 = r() * P; for (let t = 0; t < tiles; t++) { const y = t * P + ((y0 + f * step) % P) - P; const x = x0 + slant * (y / 8); for (let k = 0; k < len; k++) px(x + slant * k / len * 2, y + k, col, a * (.5 + k / len / 2)); if (big) px(x + 1, y, col, a * .7); } } };
// window with frame
S.win = (x, y, w, h, frame, glass) => { rect(x - 2, y - 2, w + 4, h + 4, frame); rect(x, y, w, h, glass); };
S.floorBoards = (y0, base, line_, r) => { rect(0, y0, W, H - y0, base); for (let y = y0; y < H; y += 7) rect(0, y, W, 1, line_, .5); };

// Shared bust pipeline: vector draw at 4x -> fill/line layers -> indexed palette frames.
const W = 160, H = 192, K = 4;

function Kit(F, L, P) {
  const fill = (p, c) => { F.fillStyle = c; F.fill(p); L.save(); L.globalCompositeOperation = 'destination-out'; L.fill(p); L.restore(); };
  const stroke = (p, c, w) => {
    if (c === P.line) { L.strokeStyle = '#000'; L.lineWidth = w; L.stroke(p); }
    else { F.strokeStyle = c; F.lineWidth = w; F.stroke(p); L.save(); L.globalCompositeOperation = 'destination-out'; L.lineWidth = w; L.stroke(p); L.restore(); }
  };
  const k = {
    P, F, L,
    path(d, c, sw = 1.1) { const p = new Path2D(d); if (c) fill(p, c); if (sw) stroke(p, P.line, sw); return p; },
    line(d, c, w) { stroke(new Path2D(d), c, w); },
    ell(cx, cy, rx, ry, c, sw = 0, rot = 0) { const p = new Path2D(); p.ellipse(cx, cy, rx, ry, rot, 0, 7); if (c) fill(p, c); if (sw) stroke(p, P.line, sw); },
    circ(cx, cy, r, c, sw = 0) { k.ell(cx, cy, r, r, c, sw); },
    clip(d, fn) { const p = typeof d === 'string' ? new Path2D(d) : d; F.save(); L.save(); F.clip(p); L.clip(p); fn(); F.restore(); L.restore(); },
    tf(tx, ty, s, fn) { F.save(); L.save(); F.translate(tx, ty); L.translate(tx, ty); if (s !== 1) { F.scale(s, s); L.scale(s, s); } fn(); F.restore(); L.restore(); },
  };
  return k;
}

// ---------- expression tables ----------
const EYE = {
  open: { w: 8, hT: 9, hB: 9, oy: 0, iy: 0, gx: 0, gy: 0, ir: 5.5, pup: 2.6 },
  shy: { w: 8, hT: 7.6, hB: 8.4, oy: .4, iy: 0, gx: -2.4, gy: 1.8, ir: 5.5, pup: 2.4 },
  sad: { w: 8, hT: 8.2, hB: 9, oy: 1.6, iy: -.6, gx: 0, gy: 1.2, ir: 6, pup: 2.2, tears: 1 },
  angry: { w: 8, hT: 5.6, hB: 7.6, oy: -2.2, iy: 3.4, gx: 0, gy: .6, ir: 5, pup: 2 },
  surprised: { w: 8.6, hT: 10.6, hB: 10.4, oy: 0, iy: 0, gx: 0, gy: 0, ir: 4.2, pup: 1.8 },
};
// brows: inner/outer end offsets from base brow y; arch = control offset
const BROW = {
  open: null, happy: null,
  shy: { i: -1.5, o: 1, a: -2.5 },
  sad: { i: -3, o: 2, a: -1 },
  angry: { i: 3.5, o: -2.5, a: 1 },
  surprised: { i: -6, o: -6, a: -9 },
};

// G: geometry. ex:[xl,xr] ey, hs (eye scale), mx,my,ms (mouth), by (brow y), cy (cheek y), cx (cheek dx), colours via P
function eyeShape(cx, yc, f, e, sc) {
  const w = e.w * sc, hT = e.hT * sc, hB = e.hB * sc;
  const ox = cx + f * w, oy = yc + e.oy, ix = cx - f * w, iy = yc + e.iy;
  return { ox, oy, ix, iy, top: `M${ox},${oy} C${ox},${oy - hT * 1.33} ${ix},${iy - hT * 1.33} ${ix},${iy}`, bot: `C${ix},${iy + hB * 1.33} ${ox},${oy + hB * 1.33} ${ox},${oy} Z`, w, hT };
}

function drawEye(k, G, i, ex, o) {
  const P = k.P, f = i === 0 ? -1 : 1, cx = G.ex[i], yc = G.ey, sc = G.hs || 1;
  const nm = o.expr;
  if (nm === 'happy') {
    const a = G.happyW || 7;
    k.line(`M${cx - a * sc},${yc + 2} Q${cx},${yc - 7 * sc} ${cx + a * sc},${yc + 2}`, P.line, 1.9);
    k.line(`M${cx + f * (a * sc - .5)},${yc + 1.2} l${f * 2.4},-1.4`, P.line, 1.1);
    return;
  }
  const e0 = EYE[nm === 'closed' ? 'open' : nm]; const e = o.gaze ? Object.assign({}, e0, { gx: e0.gx + o.gaze[0], gy: e0.gy + o.gaze[1] }) : e0;
  if (o.blink) {
    const s = eyeShape(cx, yc, f, e, sc);
    const dy = nm === 'angry' ? 0 : 1.8;
    k.line(`M${s.ox},${s.oy + 1} Q${cx},${yc + 4.8 + dy - 1.5} ${s.ix},${s.iy + 1}`, P.line, 1.7);
    k.line(`M${s.ox},${s.oy + 1} l${f * 2.8},-.9`, P.line, 1.1);
    if (nm === 'sad') k.ell(cx, yc + 6, 3.4, 1.1, P.tear, 0);
    return;
  }
  const s = eyeShape(cx, yc, f, e, sc);
  const shape = new Path2D(s.top + s.bot);
  const icx = cx + e.gx * sc, icy = yc + e.gy + .6, ir = e.ir * sc, iry = ir * 1.5;
  k.clip(shape, () => {
    k.ell(cx, yc, 12 * sc, 14 * sc, P.white);
    // lid shadow band
    k.ell(cx, yc - e.hT * sc - 1, 11 * sc, e.hT * .62 * sc + 1.6, P.whiteS);
    k.ell(icx, icy, ir, iry, P.irisD);
    k.ell(icx, icy + 1.7, ir, iry - 1.7, P.iris);
    if (!o.lod) k.ell(icx, icy + iry * .55, ir * .72, iry * .38, P.irisL);
    k.ell(icx, icy + .4, e.pup * sc, e.pup * 1.25 * sc, P.pupil);
    k.circ(icx - 2 * f * sc, icy - iry * .42, 1.8 * sc, P.white);
    if (!o.lod) k.circ(icx + 2.4 * f * sc, icy + iry * .55, 1 * sc, P.white);
    if (e.tears) { k.ell(cx, yc + e.hB * sc - .3, e.w * sc + 1, 2.2, P.tear); k.ell(cx - f * 2, yc + e.hB * sc - 1.2, 2, .8, P.white); }
  });
  // upper lash + flick
  const lash = new Path2D(s.top);
  k.line(s.top, P.line, 2);
  k.line(`M${s.ox},${s.oy - e.hT * sc * .55} l${f * 3.2},-2.2`, P.line, 1.25);
  if (nm === 'surprised') k.line(s.bot.replace(' Z', '').replace(/^C/, `M${s.ix},${s.iy} C`), P.line, .6);
}

function drawBrow(k, G, i, o) {
  const B = BROW[o.expr]; if (!B) return;
  const f = i === 0 ? -1 : 1, cx = G.ex[i], by = G.by, P = k.P;
  const ix = cx - f * 5.5, ox = cx + f * 9.5;
  const mid = (ix + ox) / 2;
  k.line(`M${ix},${by + B.i} Q${mid},${by + B.a + (B.i + B.o) / 2} ${ox},${by + B.o}`, P.brow, 2);
}

function drawMouth(k, G, o) {
  const P = k.P, nm = o.expr, op = o.open;
  k.tf(G.mx, G.my, G.ms || 1, () => {
    const mo = P.mouth, mi = P.mouthI;
    if (nm === 'open') {
      if (!op) k.path('M-5,0 Q0,5 5,0 Q0,2 -5,0Z', mo, .9);
      else { k.path('M-5.5,-.5 Q0,9.5 5.5,-.5 Q0,1.8 -5.5,-.5Z', mo, .9); k.clip('M-5.5,-.5 Q0,9.5 5.5,-.5 Q0,1.8 -5.5,-.5Z', () => k.ell(0, 6.2, 3, 2, mi)); }
    } else if (nm === 'happy') {
      if (!op) k.path('M-5,0 Q0,6 5,0Z', mo, .9);
      else { const d = 'M-6.5,-1 Q0,.5 6.5,-1 Q5.5,8.5 0,9 Q-5.5,8.5 -6.5,-1Z'; k.path(d, mo, .9); k.clip(d, () => { k.ell(0, 8, 3.4, 2.6, mi); k.path('M-5.6,-.7 L5.6,-.7 L5,1.2 L-5,1.2Z', P.white, 0); }); }
    } else if (nm === 'shy') {
      if (!op) k.line('M-3.6,1 q1.8,-1.8 3.6,0 q1.8,1.8 3.6,0', P.line, 1);
      else { k.ell(0, 2, 2, 2.5, mo, .8); k.ell(0, 3, 1.1, .9, mi); }
    } else if (nm === 'sad') {
      if (!op) { k.line('M-4,3 Q0,-1 4,3', P.line, 1.1); k.line('M-1.6,4.4 Q0,3.6 1.6,4.4', mo, .8); }
      else { k.path('M-4.5,3.5 Q0,-3 4.5,3.5 Q0,1.5 -4.5,3.5Z', mo, .9); k.ell(0, 2.6, 1.8, .8, mi); }
    } else if (nm === 'angry') {
      if (!op) { k.line('M-5,3 Q0,-1.6 5,3', P.line, 1.3); }
      else { const d = 'M-6,0 L6,0 L4.6,6.4 Q0,8.4 -4.6,6.4Z'; k.path(d, mo, .9); k.clip(d, () => { k.path('M-6,-.4 L6,-.4 L5.6,2 L-5.6,2Z', P.white, 0); k.ell(0, 7, 3, 2.2, mi); }); k.line('M-6,0 L6,0', P.line, .9); }
    } else if (nm === 'surprised') {
      if (!op) { k.ell(0, 3, 2.3, 3.2, mo, .9); k.ell(0, 4.2, 1.2, 1.2, mi); }
      else { k.ell(0, 4, 3.4, 4.6, mo, .9); k.ell(0, 6, 2.1, 1.8, mi); }
    }
  });
}

function drawFace(k, G, o) {
  const P = k.P, nm = o.expr;
  // blush
  const by = G.cy, bx = G.cx, bw = nm === 'shy' ? 1.35 : 1, bh = nm === 'shy' ? 1.35 : 1;
  [G.mx - bx, G.mx + bx].forEach((x, i) => {
    k.ell(x, by, (G.bw || 5) * bw, (G.bh || 2.4) * bh, P.blush);
    if (nm === 'shy') for (let j = 0; j < 3; j++) k.line(`M${x - 3.6 + j * 2.8},${by + 1.4} l1.6,-2.8`, P.blushD, .7);
  });
  drawEye(k, G, 0, 0, o); drawEye(k, G, 1, 0, o);
  if (G.nose) k.line(`M${G.mx},${G.nose} l0.4,1`, P.skinS, 1.2);
  drawMouth(k, G, o);
}
function drawFx(k, G, o, t) {
  const P = k.P, nm = o.expr;
  const drop = (x, y, s = 1) => { k.tf(x, y, s, () => k.path('M0,-4.5 C2.6,-1 3.4,1.2 0,3.2 C-3.4,1.2 -2.6,-1 0,-4.5Z', P.tear, .6)); k.circ(x - .8 * s, y + .6 * s, .6 * s, P.white); };
  if (nm === 'surprised') drop(G.fxx, G.fxy, 1.1);
  if (nm === 'shy') drop(G.fxx, G.fxy + 8, .9);
  if (nm === 'sad') {
    const f = o.tearPhase || 0;
    [0, 1].forEach(i => { const x = G.ex[i] + (i ? 3 : -3), y = G.ey + 10 + f * 1.5; k.path(`M${x},${y} C${x + 2},${y + 3} ${x + 2.4},${y + 5} ${x},${y + 6.4} C${x - 2.4},${y + 5} ${x - 2},${y + 3} ${x},${y}Z`, P.tear, .6); k.circ(x - .7, y + 4, .6, P.white); });
  }
  if (nm === 'angry') {
    const x = G.veinX, y = G.veinY;
    k.tf(x, y, 1, () => { k.line('M-3,-1.2 Q-1,-1 -1,-3.4 M3,-1.2 Q1,-1 1,-3.4 M-3,1.2 Q-1,1 -1,3.4 M3,1.2 Q1,1 1,3.4', P.vein, 1.5); });
  }
}

// ---------- rasteriser ----------
function rasterise(drawFn, pal) {
  // pal: object name->hex with .line first; returns indexed frame
  const names = Object.keys(pal), cols = names.map(n => { const h = pal[n]; return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; });
  const mk = () => { const c = document.createElement('canvas'); c.width = W * K; c.height = H * K; return c; };
  const cf = mk(), cl = mk(), F = cf.getContext('2d'), L = cl.getContext('2d');
  F.scale(K, K); L.scale(K, K);
  for (const c of [F, L]) { c.lineJoin = 'round'; c.lineCap = 'round'; }
  const kit = Kit(F, L, pal); kit.names = names;
  drawFn(kit);
  const down = c => { const m = document.createElement('canvas'); m.width = W * 2; m.height = H * 2; const mx = m.getContext('2d'); mx.imageSmoothingQuality = 'high'; mx.drawImage(c, 0, 0, W * 2, H * 2); const s = document.createElement('canvas'); s.width = W; s.height = H; const sx = s.getContext('2d'); sx.imageSmoothingQuality = 'high'; sx.drawImage(m, 0, 0, W, H); return sx.getImageData(0, 0, W, H).data; };
  const df = down(cf), dl = down(cl);
  const idx = new Uint8Array(W * H), isLine = new Uint8Array(W * H), op = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const a = df[i * 4 + 3];
    if (a > 110) {
      op[i] = 1;
      const r = df[i * 4], g = df[i * 4 + 1], b = df[i * 4 + 2]; let bi = 1, bd = 1e9;
      for (let j = 1; j < cols.length; j++) { const c = cols[j]; const q = (c[0] - r) ** 2 * .3 + (c[1] - g) ** 2 * .59 + (c[2] - b) ** 2 * .11; if (q < bd) { bd = q; bi = j; } }
      idx[i] = bi + 1;
    }
    if (dl[i * 4 + 3] > 120) { idx[i] = 1; op[i] = 1; }
  }
  const out = idx.slice();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (op[i]) continue;
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => { const X = x + a, Y = y + b; return X >= 0 && Y >= 0 && X < W && Y < H && op[Y * W + X]; })) out[i] = 1;
  }
  return out;
}
// note: palette index 0 = transparent, 1 = line (names[0]), others names[j] -> j+1

function toCanvas(idx, pal) {
  const names = Object.keys(pal), cols = names.map(n => { const h = pal[n]; return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; });
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); const im = x.createImageData(W, H);
  for (let i = 0; i < W * H; i++) { if (!idx[i]) continue; const cc = cols[idx[i] - 1]; im.data.set([cc[0], cc[1], cc[2], 255], i * 4); }
  x.putImageData(im, 0, 0); return c;
}
const b64 = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return btoa(s); };

const SETNAMES = ['open', 'happy', 'shy', 'sad', 'angry', 'surprised'];
// charDraw(kit, o) with o={expr, blink, open, sway, dy, i}
function buildBust(id, pal, charDraw) {
  const sets = {};
  const preview = {};
  for (const ex of SETNAMES) for (const talk of [0, 1]) {
    const key = ex + (talk ? 'Talk' : ''); sets[key] = [];
    for (let i = 0; i < 8; i++) {
      const ph = i / 8 * Math.PI * 2;
      const o = { expr: ex, i, blink: ex !== 'happy' && i === 6, open: !!(talk && i % 2 === 0), sway: Math.sin(ph) * 1.1, sway2: Math.sin(ph - .7), dy: [0, 0, 1, 1, 1, 1, 0, 0][i], tearPhase: i % 4 };
      const idx = rasterise(k => charDraw(k, o), pal);
      sets[key].push(b64(idx));
      if (i === 0 || i === 6) { preview[key + i] = toCanvas(idx, pal); }
    }
  }
  return { id, sets, pal: Object.values(pal), preview };
}

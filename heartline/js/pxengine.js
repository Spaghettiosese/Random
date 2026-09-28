/* HEARTLINE AGENCY — Moonkai Pixel Engine (runtime).
   The art pipeline of Moonkai Pixel Studio (Spaghettiosese/moonkai, pixel/), ported to run inside the game:
   hue-shifted anime shading ramps, supersampled drawing snapped to a fixed palette with line-art priority,
   the outline effect, the Breathe / Float / Bob / Sway / Shake motion presets and Scale2x smoothing.
   Characters, B.I.T., monsters and CGs are painted with it frame by frame (see pxchars.js, pxcg.js);
   the painted backgrounds are re-rasterised through it so the whole stage shares one pixel grid.
   Frames are cached; one animator drives every pixel sprite on screen. */
const PX = (() => {
  // ---------- colour (from Pixel Studio app.js) ----------
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  function hexToRgb(hex) { hex = hex.replace('#', ''); if (hex.length === 3) hex = [...hex].map(c => c + c).join(''); const n = parseInt(hex.slice(0, 6), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  const toHex = c => '#' + [c[0], c[1], c[2]].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
    if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; }
    return [h, s * 100, l * 100];
  }
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255); };
    return [f(0), f(8), f(4)];
  }
  // Anime shading: highlights drift toward warm yellow, shadows toward cool violet.
  function shadeColor(r, g, b, dir, amt, hueShift = true) {
    let [h, s, l] = rgbToHsl(r, g, b);
    l = clamp(l + dir * amt, 0, 100);
    if (hueShift) { const target = dir > 0 ? 55 : 255, d = ((target - h + 540) % 360) - 180; h += clamp(d, -amt * 1.2, amt * 1.2); s = clamp(s + (dir > 0 ? -amt * .25 : amt * .35), 0, 100); }
    return hslToRgb(h, s, l);
  }
  const shade = (hex, dir, amt) => { const c = hexToRgb(hex); return toHex(shadeColor(c[0], c[1], c[2], dir, amt, true)); };
  // 4-step cel ramp: light, base, shadow, deep shadow
  const ramp = (hex, a = 9, b = 13) => [shade(hex, 1, a), hex, shade(hex, -1, b), shade(hex, -1, b * 2)];
  const mix = (h1, h2, t) => { const a = hexToRgb(h1), b = hexToRgb(h2); return toHex(a.map((v, i) => v + (b[i] - v) * t)); };

  // ---------- canvases ----------
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  let hiC = null, hiX = null;
  function hiCanvas(w, h) {
    if (!hiC) { hiC = mk(w, h); hiX = hiC.getContext('2d', { willReadFrequently: true }); }
    if (hiC.width !== w || hiC.height !== h) { hiC.width = w; hiC.height = h; }
    hiX.setTransform(1, 0, 0, 1, 0, 0); hiX.clearRect(0, 0, w, h); hiX.globalAlpha = 1; hiX.globalCompositeOperation = 'source-over';
    return hiX;
  }

  // ---------- palette snap ----------
  // Every supersample is snapped to its nearest palette colour (Studio weighting .3/.59/.11), then each output
  // pixel takes a majority vote. Line colours win at a lower share so 1px line art survives the downsample.
  function makeSnapper(palHex, lineHex) {
    const pal = palHex.map(hexToRgb), memo = new Map(), lines = new Set((lineHex || []).map(h => palHex.indexOf(h)).filter(i => i >= 0));
    const near = (r, g, b) => {
      const k = (r >> 2) << 12 | (g >> 2) << 6 | (b >> 2); let v = memo.get(k); if (v !== undefined) return v;
      let bi = 0, bd = 1e12;
      for (let j = 0; j < pal.length; j++) { const c = pal[j], q = (c[0] - r) ** 2 * .3 + (c[1] - g) ** 2 * .59 + (c[2] - b) ** 2 * .11; if (q < bd) { bd = q; bi = j; } }
      memo.set(k, bi); return bi;
    };
    return { pal, near, lines };
  }
  function snap(src, W, H, K, sn, opt = {}) {
    const out = new Uint8ClampedArray(W * H * 4), cnt = new Uint16Array(sn.pal.length), SW = W * K, KK = K * K;
    const covMin = KK * (opt.cov || .42), lineMin = KK * (opt.line || .22), used = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let cov = 0, ln = 0, lnBest = -1, lnBestN = 0; used.length = 0;
      for (let j = 0; j < K; j++) { let o = ((y * K + j) * SW + x * K) * 4; for (let i = 0; i < K; i++, o += 4) {
        if (src[o + 3] < 128) continue; cov++;
        const idx = sn.near(src[o], src[o + 1], src[o + 2]); if (!cnt[idx]) used.push(idx); cnt[idx]++;
      } }
      if (!cov) continue;
      let best = -1, bn = 0;
      for (const i of used) { const n = cnt[i]; if (sn.lines.has(i)) { ln += n; if (n > lnBestN) { lnBestN = n; lnBest = i; } } else if (n > bn) { bn = n; best = i; } cnt[i] = 0; }
      let pick = -1;
      if (ln >= lineMin && (cov >= covMin || ln >= lineMin * 1.4)) pick = lnBest;
      else if (cov >= covMin) pick = best >= 0 ? best : lnBest;
      if (pick < 0) continue;
      const c = sn.pal[pick], o = (y * W + x) * 4; out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2]; out[o + 3] = 255;
    }
    return out;
  }
  // Outline effect (Studio fxOutline): paint empty pixels that touch the silhouette.
  function outline(a, W, H, hex) {
    const c = hexToRgb(hex), src = a.slice(), on = (x, y) => x >= 0 && y >= 0 && x < W && y < H && src[(y * W + x) * 4 + 3] > 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = (y * W + x) * 4; if (src[o + 3]) continue; if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) { a[o] = c[0]; a[o + 1] = c[1]; a[o + 2] = c[2]; a[o + 3] = 255; } }
    return a;
  }
  // Motion presets (Studio "Motion" panel) as pixel offsets for frame i of n.
  function motion(kind, i, n) {
    const t = i / n, s = Math.sin(Math.PI * 2 * t);
    if (kind === 'float') return [0, Math.round(s * 2)];
    if (kind === 'bob') return [0, s > .5 ? 1 : 0];
    if (kind === 'hop') return [0, -Math.round(Math.abs(Math.sin(Math.PI * t)) * 4)];
    if (kind === 'sway') return [Math.round(s * 1.5), 0];
    if (kind === 'shake') return [[1, 0], [-1, 1], [0, -1], [-1, 0], [1, 1], [0, 0]][i % 6];
    return [0, 0];
  }
  function shiftPx(a, W, H, dx, dy) {
    if (!dx && !dy) return a; const s = new Uint32Array(a.buffer), out = new Uint8ClampedArray(a.length), d = new Uint32Array(out.buffer);
    for (let y = 0; y < H; y++) { const sy = y - dy; if (sy < 0 || sy >= H) continue; for (let x = 0; x < W; x++) { const sx = x - dx; if (sx >= 0 && sx < W) d[y * W + x] = s[sy * W + sx]; } }
    return out;
  }
  // Breathe (Studio): everything above the given row sinks 1px while the rest stays planted.
  function breathe(a, W, H, row) {
    const s = new Uint32Array(a.buffer), out = new Uint8ClampedArray(a.length), d = new Uint32Array(out.buffer);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) d[y * W + x] = y > row ? s[y * W + x] : y >= 1 ? s[(y - 1) * W + x] : 0;
    return out;
  }
  // Scale2x (EPX) from Studio: rounds stair-steps for the "Smooth" pixel style.
  function scale2x(a, w, h) {
    const src = new Uint32Array(a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength)), out = new Uint32Array(w * h * 4), W = w * 2;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const P = src[y * w + x], A = y > 0 ? src[(y - 1) * w + x] : P, D = y < h - 1 ? src[(y + 1) * w + x] : P, C = x > 0 ? src[y * w + x - 1] : P, B = x < w - 1 ? src[y * w + x + 1] : P, o = (y * 2) * W + x * 2;
      out[o] = C === A && C !== D && A !== B ? A : P; out[o + 1] = A === B && A !== C && B !== D ? B : P;
      out[o + W] = D === C && D !== B && C !== A ? C : P; out[o + W + 1] = B === D && B !== A && D !== C ? D : P;
    }
    return new Uint8ClampedArray(out.buffer);
  }
  let outC = null;
  function toURL(a, W, H) {
    let w = W, h = H; if (window.PIXEL_SMOOTH) { a = scale2x(a, W, H); w *= 2; h *= 2; }
    if (!outC) outC = mk(w, h); outC.width = w; outC.height = h;
    outC.getContext('2d').putImageData(new ImageData(a, w, h), 0, 0);
    return outC.toDataURL('image/png');
  }

  // Paint a frame: draw(ctx) works in "design units"; unit->pixel scale is s, supersample K.
  // Returns snapped RGBA of W x H.
  function paint(W, H, K, s, draw, sn, opt = {}) {
    const x = hiCanvas(W * K, H * K);
    x.setTransform(K * s, 0, 0, K * s, -(opt.ox || 0) * K * s, -(opt.oy || 0) * K * s); x.lineJoin = 'round'; x.lineCap = 'round';
    draw(x);
    const d = x.getImageData(0, 0, W * K, H * K).data;
    let a = snap(d, W, H, K, sn, opt);
    if (opt.outline) a = outline(a, W, H, opt.outline);
    return a;
  }

  // ---------- SVG rasteriser for backgrounds ----------
  // Animated SVG parts are frozen at time t: animations are paused and delays shifted by -t,
  // with the needed @keyframes and class rules copied in from the game stylesheet.
  let cssRules = null;
  function gatherCss() {
    if (cssRules) return cssRules; cssRules = { cls: {}, kf: {} };
    for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch (e) { continue; } for (const r of rs) {
      if (r.type === 7) cssRules.kf[r.name] = r.cssText;
      else if (r.selectorText && /^\.[\w-]+$/.test(r.selectorText)) cssRules.cls[r.selectorText.slice(1)] = r.cssText;
    } }
    return cssRules;
  }
  function freezeSvg(svg, t, w, h, vb) {
    const R = gatherCss(), used = new Set(); svg.replace(/class="([^"]+)"/g, (_, c) => c.split(/\s+/).forEach(k => used.add(k)));
    let css = '';
    used.forEach(k => { const r = R.cls[k]; if (r) { css += r; const m = r.match(/animation:\s*([\w-]+)/); if (m && R.kf[m[1]]) css += R.kf[m[1]]; } });
    css += `*{animation-play-state:paused!important}svg [class]{animation-delay:${-t}s}`;
    svg = svg.replace(/animation-delay:\s*(-?[\d.]+)s/g, (_, v) => `animation-delay:${(+v - t).toFixed(3)}s`);
    return svg.replace(/<svg[^>]*>/, m => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="xMidYMid slice"><style>${css}</style>`) ;
  }
  const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  async function rasterSvg(svg, w, h) {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    try { const im = await loadImg(url); const c = mk(w, h), x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0, w, h); return x.getImageData(0, 0, w, h).data; }
    finally { URL.revokeObjectURL(url); }
  }
  // Median-cut palette extraction (Studio "Extract palette", grown for full scenes).
  function extractPalette(d, n) {
    const px = []; for (let i = 0; i < d.length; i += 4 * 3) if (d[i + 3] > 200) px.push([d[i], d[i + 1], d[i + 2]]);
    let boxes = [px];
    while (boxes.length < n) {
      let bi = -1, br = -1, bc = 0;
      boxes.forEach((b, i) => { if (b.length < 2) return; for (let c = 0; c < 3; c++) { let lo = 255, hi = 0; for (const p of b) { if (p[c] < lo) lo = p[c]; if (p[c] > hi) hi = p[c]; } const r = (hi - lo) * [.3, .59, .11][c] * Math.sqrt(b.length); if (r > br) { br = r; bi = i; bc = c; } } });
      if (bi < 0) break;
      const b = boxes[bi].sort((p, q) => p[bc] - q[bc]), m = b.length >> 1; boxes.splice(bi, 1, b.slice(0, m), b.slice(m));
    }
    return boxes.filter(b => b.length).map(b => toHex([0, 1, 2].map(c => b.reduce((s, p) => s + p[c], 0) / b.length)));
  }
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
  // Box-average K x K, then snap with ordered dithering between the two nearest palette colours.
  function snapDither(d, W, H, K, palHex, strength = .9) {
    const pal = palHex.map(hexToRgb), out = new Uint8ClampedArray(W * H * 4), SW = W * K, KK = K * K;
    const wd = (c, r, g, b) => (c[0] - r) ** 2 * .3 + (c[1] - g) ** 2 * .59 + (c[2] - b) ** 2 * .11;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let r = 0, g = 0, b = 0;
      for (let j = 0; j < K; j++) { let o = ((y * K + j) * SW + x * K) * 4; for (let i = 0; i < K; i++, o += 4) { r += d[o]; g += d[o + 1]; b += d[o + 2]; } }
      r /= KK; g /= KK; b /= KK;
      let i1 = 0, i2 = 0, d1 = 1e12, d2 = 1e12;
      for (let j = 0; j < pal.length; j++) { const q = wd(pal[j], r, g, b); if (q < d1) { d2 = d1; i2 = i1; d1 = q; i1 = j; } else if (q < d2) { d2 = q; i2 = j; } }
      const A = pal[i1], B = pal[i2], ab = wd(A, B[0], B[1], B[2]);
      let pick = i1;
      if (ab > 0 && ab < 2600) { const t = ((r - A[0]) * (B[0] - A[0]) * .3 + (g - A[1]) * (B[1] - A[1]) * .59 + (b - A[2]) * (B[2] - A[2]) * .11) / ab; if (t * strength > BAYER[(y & 3) * 4 + (x & 3)]) pick = i2; }
      const c = pal[pick], o = (y * W + x) * 4; out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2]; out[o + 3] = 255;
    }
    return out;
  }

  // ---------- cache + scheduler ----------
  // entry: { st: 'wait'|'ok', seq: {name: [url...]}, fd: {name: ms}, w, h, kind }
  const cache = new Map(), jobs = [], MAX = 260;
  let busy = false;
  function touch(k, e) { cache.delete(k); cache.set(k, e); }
  function evict() {
    if (cache.size <= MAX) return;
    for (const [k, e] of cache) { if (cache.size <= MAX * .85) break; if (e.st !== 'ok') continue; if (document.querySelector(`[data-k="${CSS.escape(k)}"]`)) continue; cache.delete(k); }
  }
  // job(k, build, pri): build() -> async generator-ish: returns Promise of {seq, fd, w, h}; first frame published early via e.first
  function request(k, build, pri = 0) {
    let e = cache.get(k);
    if (e) { if (e.st === 'wait' && pri > e.pri) { e.pri = pri; jobs.sort((a, b) => b.e.pri - a.e.pri); } return e; }
    e = { st: 'wait', pri, seq: null, first: null }; cache.set(k, e);
    jobs.push({ k, e, build }); jobs.sort((a, b) => b.e.pri - a.e.pri); pump();
    return e;
  }
  async function pump() {
    if (busy) return; busy = true;
    while (jobs.length) {
      const j = jobs.shift();
      try {
        const res = await j.build(first => { j.e.first = first; publish(j.k, j.e); });
        Object.assign(j.e, res, { st: 'ok' }); publish(j.k, j.e);
      } catch (err) { console.error('pixel build failed', j.k, err); j.e.st = 'err'; }
      evict();
      await new Promise(r => setTimeout(r, 0));
    }
    busy = false;
  }
  const listeners = new Map();
  function publish(k, e) {
    const src = e.seq ? e.seq[Object.keys(e.seq)[0]][0] : e.first;
    document.querySelectorAll(`[data-k="${CSS.escape(k)}"]`).forEach(el => {
      if (!el.getAttribute('href') && !el.getAttribute('src') || el.dataset.tmp) setSrc(el, src);
      delete el.dataset.tmp; el.classList.add('pxready');
      if (el.dataset.drop && el.parentNode) el.parentNode.querySelectorAll(':scope > ' + el.dataset.drop).forEach(n => n.remove());
    });
    (listeners.get(k) || []).forEach(fn => fn(e)); listeners.delete(k);
  }
  const whenReady = (k, fn) => { const e = cache.get(k); if (e && e.st === 'ok') return fn(e); if (!listeners.has(k)) listeners.set(k, []); listeners.get(k).push(fn); };
  const setSrc = (el, src) => { if (!src) return; if (el.tagName === 'IMG') { if (el.getAttribute('src') !== src) el.src = src; } else if (el.getAttribute('href') !== src) el.setAttribute('href', src); };
  // current href to put in fresh markup: the cached first frame, or a stand-in until the frames are painted
  function srcFor(k, fallbackKey) {
    const e = cache.get(k); if (e && e.st === 'ok') return { src: e.seq[Object.keys(e.seq)[0]][0], tmp: false };
    if (e && e.first) return { src: e.first, tmp: true };
    const f = fallbackKey && cache.get(fallbackKey); if (f && f.st === 'ok') return { src: f.seq[Object.keys(f.seq)[0]][0], tmp: true };
    return { src: '', tmp: true };
  }

  // ---------- animator ----------
  // data-k: cache key; the element picks a sequence: talk (inside .talking), blink (random, every few seconds), idle.
  const born = new WeakMap(), blinkAt = new WeakMap();
  function tick() {
    const now = performance.now();
    document.querySelectorAll('.pxa').forEach(el => {
      const e = cache.get(el.dataset.k); if (!e || e.st !== 'ok') return;
      if (!born.has(el)) born.set(el, now - Math.random() * 4000);
      const t = now - born.get(el), S = e.seq;
      let name = 'idle';
      if (S.talk && el.closest('.talking')) name = 'talk';
      else if (S.blink) { let b = blinkAt.get(el); if (b === undefined || b < now - 400) { b = now + 1800 + Math.random() * 3800; blinkAt.set(el, b); } if (now >= b && now < b + 150) name = 'blink'; }
      const seq = S[name] || S.idle || S[Object.keys(S)[0]], fd = (e.fd && e.fd[name]) || 160;
      let i = Math.floor(t / fd) % seq.length;
      if (name === 'blink') { const idle = S.idle; i = Math.floor(t / ((e.fd && e.fd.idle) || 160)) % idle.length; setSrc(el, seq[i % seq.length]); return; }
      setSrc(el, seq[i]);
    });
  }
  setInterval(tick, 50);

  return { clamp, hexToRgb, toHex, rgbToHsl, hslToRgb, shadeColor, shade, ramp, mix, mk, makeSnapper, snap, outline, motion, shiftPx, breathe, scale2x, toURL, paint,
    freezeSvg, rasterSvg, extractPalette, snapDither, request, srcFor, whenReady, cache, setSrc };
})();

/* HEARTLINE AGENCY — pixel backgrounds.
   The 35 painted backgrounds are re-rasterised through the Moonkai Pixel Engine onto a 400 x 225 grid:
   2x supersample, a 40-colour median-cut palette per scene (Studio "Extract palette") and 4x4 ordered
   dithering (Studio dither tool). Scenes with moving parts (stars, lanterns, clouds, fireworks, monitors)
   are frozen at eight moments of a 3-second loop, so they keep animating as pixel frames. */
const PixelBG = (() => {
  const W = 400, H = 225, SS = 2, VB = '0 0 1600 900';
  const ANIM = /class="[^"]*\b(twinkle|glowpulse|drift|sway|flick|blinkl|dash|fw|ping|spin|pulse|flame)\b/;
  const stills = new Map();
  const vector = name => (Art._h.BG[name] || Art._h.BG.black)();
  async function paintAt(svg, t, pal) {
    const hi = await PX.rasterSvg(PX.freezeSvg(svg, t, W * SS, H * SS, VB), W * SS, H * SS);
    if (!pal) pal = PX.extractPalette(hi, 40);
    return [PX.snapDither(hi, W, H, SS, pal, .85), pal];
  }
  function solid(svg) { const m = svg.match(/background:(#[0-9a-f]{3,6})/i); const c = PX.hexToRgb(m ? m[1] : '#05040a'), a = new Uint8ClampedArray(W * H * 4); for (let i = 0; i < a.length; i += 4) { a[i] = c[0]; a[i + 1] = c[1]; a[i + 2] = c[2]; a[i + 3] = 255; } return a; }
  function build(name, svg) {
    return async early => {
      const n = ANIM.test(svg) ? 8 : 1, idle = [];
      let [a, pal] = await paintAt(svg, 0); stills.set(name, a); idle.push(PX.toURL(a, W, H)); early(idle[0]);
      for (let i = 1; i < n; i++) idle.push(PX.toURL((await paintAt(svg, i * 3 / n, pal))[0], W, H));
      return { seq: { idle }, fd: { idle: 375 } };
    };
  }
  // markup for a stage/thumbnail background; the vector art shows only until the pixel frames are ready
  function markup(name, svg, pri = 3) {
    if (!/^\s*<svg/.test(svg)) return svg;
    const k = 'b|' + name; PX.request(k, build(name, svg), pri);
    const { src } = PX.srcFor(k);
    return `<div class="bgpx">${src ? '' : svg}<img class="pxa pxbg" data-k="${k}" data-drop="svg"${src ? ` src="${src}"` : ''} alt=""></div>`;
  }
  // frame 0 as RGBA, for compositing CGs
  async function still(name) {
    if (stills.has(name)) return stills.get(name);
    const svg = vector(name);
    const a = /^\s*<svg/.test(svg) ? (await paintAt(svg, 0))[0] : solid(svg);
    stills.set(name, a); if (stills.size > 24) stills.delete(stills.keys().next().value);
    return a;
  }
  const prewarm = name => { const svg = vector(name); if (/^\s*<svg/.test(svg)) PX.request('b|' + name, build(name, svg), 0); };
  return { markup, still, prewarm, W, H };
})();

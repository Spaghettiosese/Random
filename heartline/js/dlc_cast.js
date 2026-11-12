/* HEARTLINE: HOME (DLC) — art.
   A child drawn in the same pixel style as the cast (a bundled newborn, a five-year-old and a twelve-year-old,
   with the partner's hair and eyes), DLC props (ring box, cat, flower arch, family photo frame, notebook),
   wedding outfits, and 28 CGs: a proposal, a wedding, a newborn, a first Spark and a family portrait per partner.
   Every CG has a vector fallback for the classic art mode. The child's look is read from window.HL_KID at paint time. */
(() => {
  const TAU = Math.PI * 2;
  const P6 = ['hikari', 'rei', 'mira', 'sora', 'kaede', 'squad'], P5 = P6.slice(0, 5);
  const LOOK = {
    hikari: { hair: '#ffd65c', hairS: '#e39a2e', hairL: '#9a5a18', eye: '#3ea4ff', shirt: '#3a5ba8', pants: '#2a2f4a', blanket: '#ffe08a', skin: '#ffe9de' },
    rei: { hair: '#352a52', hairS: '#16101f', hairL: '#08060d', eye: '#b27bff', shirt: '#5a4a86', pants: '#1d1a2b', blanket: '#cbb8ff', skin: '#fbeae6' },
    mira: { hair: '#ffcfe0', hairS: '#e88fb2', hairL: '#a8467a', eye: '#22c3a3', shirt: '#6fd1c4', pants: '#3a4a5a', blanket: '#ffd6e4', skin: '#fff0e9' },
    sora: { hair: '#e2dcfa', hairS: '#9a90cc', hairL: '#4e467e', eye: '#ff6fae', shirt: '#ff9ac4', pants: '#2b2f6b', blanket: '#e8e2ff', skin: '#fff0ec' },
    kaede: { hair: '#56d493', hairS: '#1f8a58', hairL: '#0f5034', eye: '#ffb13b', shirt: '#2fbf7a', pants: '#1c1f24', blanket: '#c8f5dc', skin: '#fde6d8' },
    squad: { hair: '#6a4430', hairS: '#3a2418', hairL: '#1e120a', eye: '#4aa0ff', shirt: '#ff8a3a', pants: '#3a3f52', blanket: '#ffd8a8', skin: '#f6dccb' }
  };
  const look = () => Object.assign({ route: 'hikari', g: 'girl', g2: null }, (typeof window.HL_KID === 'function' ? window.HL_KID() : window.HL_KID) || {});
  const sh = (c, d, a) => (typeof PX !== 'undefined' ? PX.shade(c, d, a) : c);
  const LN = '#1c1426';

  // ---------- shape lists (shared by the pixel painter and the SVG fallback) ----------
  // each shape: { d, c, s (shade), lw, o (outline) } ; ellipses as { e: [cx, cy, rx, ry], ... }
  function kidShapes(o) {
    const L = LOOK[o.route] || LOOK.hikari, girl = o.g !== 'boy', tall = o.age === 'big' ? 1.5 : 1;
    const out = [], S = (d, c, s, lw = 4) => out.push({ d, c, s: s === undefined ? sh(c, -1, 13) : s, lw }), E = (cx, cy, rx, ry, c, lw = 4, s) => out.push({ e: [cx, cy, rx, ry], c, s: s === undefined ? sh(c, -1, 13) : s, lw });
    const yH = -330 * tall, yS = -555 * tall + (tall > 1 ? 40 : 0), y = yS - 100, back = o.view === 'back';
    // back hair
    if (girl) S(`M-112,${y} C-122,${y + (tall > 1 ? 210 : 130)} -70,${y + (tall > 1 ? 250 : 160)} -30,${y + (tall > 1 ? 200 : 120)} L30,${y + (tall > 1 ? 200 : 120)} C70,${y + (tall > 1 ? 250 : 160)} 122,${y + (tall > 1 ? 210 : 130)} 112,${y}Z`, L.hairS, sh(L.hairS, -1, 10));
    if (girl && tall === 1) { E(-122, y + 28, 34, 48, L.hair); E(122, y + 28, 34, 48, L.hair); E(-104, y + 2, 12, 12, '#ff5d85', 3); E(104, y + 2, 12, 12, '#ff5d85', 3); }
    // legs + shoes
    const leg = s => `M${s * 10},${yH - 10} L${s * 60},${yH - 10} L${s * 54},-24 L${s * 12},-24Z`;
    S(leg(-1), girl && tall === 1 ? L.skin : L.pants); S(leg(1), girl && tall === 1 ? L.skin : L.pants);
    if (girl && tall === 1) { S(`M-58,-110 L-10,-110 L-12,-24 L-54,-24Z`, '#ffffff'); S(`M10,-110 L58,-110 L54,-24 L12,-24Z`, '#ffffff'); }
    E(-36, -16, 40, 20, '#3a2a3a', 4); E(36, -16, 40, 20, '#3a2a3a', 4);
    // arms
    const armR = o.wave ? `M58,${yS + 6} L86,${yS + 8} L158,${yS - 150} L132,${yS - 164}Z` : o.hold ? `M60,${yS + 6} L86,${yS + 10} L70,${yH + 30} L40,${yH + 20}Z` : `M60,${yS + 6} L86,${yS + 10} L98,${yH - 20} L70,${yH - 16}Z`;
    const armL = o.hold ? `M-60,${yS + 6} L-86,${yS + 10} L-70,${yH + 30} L-40,${yH + 20}Z` : `M-60,${yS + 6} L-86,${yS + 10} L-98,${yH - 20} L-70,${yH - 16}Z`;
    S(armL, L.shirt); S(armR, L.shirt);
    // torso / dress
    S(`M-84,${yS + 18} Q-84,${yS} -60,${yS} L60,${yS} Q84,${yS} 84,${yS + 18} L76,${yH} L-76,${yH}Z`, L.shirt);
    if (girl) S(`M-76,${yH - 50} L76,${yH - 50} L108,${yH + (tall > 1 ? 120 : 80)} L-108,${yH + (tall > 1 ? 120 : 80)}Z`, sh(L.shirt, 1, 6));
    else S(`M-78,${yH - 14} L78,${yH - 14} L80,${yH + 40} L-80,${yH + 40}Z`, L.pants);
    S(`M-26,${yS} L0,${yS + 34} L26,${yS}Z`, '#ffffff', '#e0d8e8', 3);
    if (o.route === 'hikari' && !back) S(`M8,${yS + 60} L-14,${yS + 110} L2,${yS + 110} L-8,${yS + 156} L22,${yS + 96} L6,${yS + 96} L16,${yS + 60}Z`, '#ffd54a', '#e3a92e', 3);
    if (o.route === 'squad' && !back) E(0, yS + 100, 24, 24, '#fff4dc', 3);
    // hands
    const hy = o.hold ? yH + 24 : yH - 18;
    if (o.wave) E(146, yS - 168, 22, 22, L.skin, 4); else E(o.hold ? 50 : 84, hy, 20, 20, L.skin, 4);
    E(o.hold ? -50 : -84, hy, 20, 20, L.skin, 4);
    // neck + head
    S(`M-22,${yS - 4} L22,${yS - 4} L20,${yS - 22} L-20,${yS - 22}Z`, L.skin, undefined, 0);
    if (back) { E(0, y - 4, 112, 106, L.hair, 4, L.hairS); S(`M-60,${y - 80} Q0,${y - 110} 60,${y - 80}`, 'none', null, 5); return out; }
    E(-100, y + 20, 18, 24, L.skin); E(100, y + 20, 18, 24, L.skin);
    E(0, y, 102, 98, L.skin, 4, sh(L.skin, -1, 8));
    // fringe
    const fr = girl ? `M-110,${y + 14} C-116,${y - 92} -52,${y - 120} 0,${y - 118} C52,${y - 120} 116,${y - 92} 110,${y + 14} L96,${y - 4} L78,${y - 44} L56,${y - 12} L30,${y - 48} L4,${y - 16} L-24,${y - 50} L-50,${y - 14} L-76,${y - 46} L-96,${y - 2}Z`
      : `M-108,${y - 6} C-112,${y - 96} -52,${y - 124} 0,${y - 122} C52,${y - 124} 112,${y - 96} 108,${y - 6} L92,${y - 30} L70,${y - 52} L50,${y - 28} L26,${y - 58} L0,${y - 30} L-26,${y - 60} L-52,${y - 30} L-76,${y - 56} L-94,${y - 26}Z`;
    S(fr, L.hair, L.hairS);
    if (!girl) S(`M-26,${y - 112} L-6,${y - 162} L10,${y - 118} L30,${y - 146} L32,${y - 110}Z`, L.hair, L.hairS);
    // face
    const ex = [-40, 40], ey = y + 22, emo = o.emo || 'smile';
    ex.forEach(x => {
      if (emo === 'laugh') out.push({ d: `M${x - 18},${ey + 6} Q${x},${ey - 14} ${x + 18},${ey + 6}`, c: 'none', lw: 7, line: L.hairL });
      else if (emo === 'sleep') out.push({ d: `M${x - 18},${ey} Q${x},${ey + 16} ${x + 18},${ey}`, c: 'none', lw: 6, line: L.hairL });
      else { const big = emo === 'wow' ? 1.18 : 1; out.push({ e: [x, ey, 16 * big, 24 * big], c: L.eye, s: sh(L.eye, -1, 18), lw: 4, line: L.hairL }); out.push({ e: [x - 5, ey - 9, 6, 8], c: '#ffffff', lw: 0 }); }
    });
    out.push({ e: [-66, ey + 32, 16, 8], c: '#ffb0bc', lw: 0 }); out.push({ e: [66, ey + 32, 16, 8], c: '#ffb0bc', lw: 0 });
    if (emo === 'laugh') S(`M-22,${ey + 46} Q0,${ey + 84} 22,${ey + 46}Z`, '#c03a4a', '#902030', 4);
    else if (emo === 'wow') out.push({ e: [0, ey + 56, 11, 14], c: '#c03a4a', lw: 4 });
    else if (emo === 'sad') out.push({ d: `M-14,${ey + 58} Q0,${ey + 46} 14,${ey + 58}`, c: 'none', lw: 5, line: L.hairL });
    else out.push({ d: `M-14,${ey + 50} Q0,${ey + 62} 14,${ey + 50}`, c: 'none', lw: 5, line: L.hairL });
    return out;
  }
  function babyShapes(o) {
    const L = LOOK[o.route] || LOOK.hikari, out = [], S = (d, c, s, lw = 4) => out.push({ d, c, s: s === undefined ? sh(c, -1, 13) : s, lw }), E = (cx, cy, rx, ry, c, lw = 4, s) => out.push({ e: [cx, cy, rx, ry], c, s: s === undefined ? sh(c, -1, 12) : s, lw });
    S('M-170,-10 C-180,-120 -50,-160 40,-140 C150,-120 190,-40 170,20 C140,100 -110,110 -170,-10Z', L.blanket, sh(L.blanket, -1, 16));
    E(-44, -64, 64, 60, L.skin);
    S('M-104,-74 C-112,-130 -40,-150 10,-112 C-20,-124 -60,-118 -70,-92Z', L.hair, L.hairS, 3);
    S('M-120,-30 C-60,10 40,0 120,-60 C150,0 110,60 20,70 C-60,76 -120,40 -120,-30Z', sh(L.blanket, 1, 6), sh(L.blanket, -1, 10));
    [-68, -22].forEach(x => out.push({ d: `M${x - 13},${-62} Q${x},${-50} ${x + 13},${-62}`, c: 'none', lw: 5, line: L.hairL }));
    out.push({ e: [-88, -40, 12, 7], c: '#ffb0bc', lw: 0 }); out.push({ e: [-2, -40, 12, 7], c: '#ffb0bc', lw: 0 });
    out.push({ e: [-46, -30, 7, 5], c: '#e07a8a', lw: 0 });
    return out;
  }
  // ---------- painters ----------
  function paintPx(g, shapes, x, y, sc, flip, rot) {
    const cel = PixelCast.cel;
    g.save(); g.tr(x, y); if (rot) g.rot(rot); g.sc(flip ? -sc : sc, sc);
    for (const p of shapes) {
      const lc = p.line || LN; g.markLine(lc);
      const d = p.e ? (() => { const q = new Path2D(); q.ellipse(p.e[0], p.e[1], p.e[2], p.e[3], 0, 0, TAU); return q; })() : p.d;
      if (p.c === 'none') { g.line(d, lc, p.lw); continue; }
      if (p.s) cel(g, d, p.c, p.s, p.lw, lc, [-8, -5]); else { g.solid(d, p.c); if (p.lw) g.line(d, lc, p.lw); }
    }
    g.restore();
  }
  function svgShapes(shapes, x, y, sc, flip, rot) {
    return `<g transform="translate(${x},${y})${rot ? ` rotate(${rot})` : ''} scale(${flip ? -sc : sc},${sc})">${shapes.map(p => {
      const st = p.lw ? ` stroke="${p.line || LN}" stroke-width="${p.lw}" stroke-linecap="round" stroke-linejoin="round"` : '';
      return p.e ? `<ellipse cx="${p.e[0]}" cy="${p.e[1]}" rx="${p.e[2]}" ry="${p.e[3]}" fill="${p.c}"${st}/>` : `<path d="${p.d}" fill="${p.c}"${st}/>`;
    }).join('')}</g>`;
  }
  // a kid prop: o = { age: 'small'|'big', emo, view, wave, hold, which: 1|2 }
  const kidO = o => { const L = look(); return Object.assign({ route: L.route, g: o.which === 2 ? (L.g2 || 'boy') : L.g }, o); };
  const KID = (x, y, sc, o = {}) => (g, t, i) => { const L = look(); if (o.which === 2 && !L.g2) return; const bob = o.bob ? Math.round(Math.sin((t + (o.ph || 0)) * TAU) * o.bob) : 0; paintPx(g, kidShapes(kidO(o)), x, y + bob, sc, o.flip, o.rot); };
  const BABY = (x, y, sc, o = {}) => g => paintPx(g, babyShapes({ route: o.route || look().route }), x, y, sc, o.flip);
  const kidSvg = (x, y, sc, o = {}) => { const L = look(); if (o.which === 2 && !L.g2) return ''; return svgShapes(kidShapes(kidO(o)), x, y, sc, o.flip, o.rot); };
  const babySvg = (x, y, sc, o = {}) => svgShapes(babyShapes({ route: o.route || look().route }), x, y, sc);

  // ---------- the child as a stage sprite (same frame as the cast: 400 x 720 design units) ----------
  const EMOK = e => /laugh|excited|delighted|happy|cheer|proud/.test(e) ? 'laugh' : /sleep|tired/.test(e) ? 'sleep' : /surpris|shock|awe|scared|stunned/.test(e) ? 'wow' : /sad|cry|hurt|sob|gloomy/.test(e) ? 'sad' : 'smile';
  function kidSprite(id, emo, pose) {
    const L = look(), which = id === 'kid2' ? 2 : 1, G = (typeof Game !== 'undefined' && Game.G) || null, part = G ? G.dlcPart || 0 : 6;
    const age = which === 1 && part >= 9 ? 'big' : 'small', sc = which === 2 ? .5 : .62, fy = age === 'big' ? 793 : which === 2 ? 650 : 709;
    const o = { route: L.route, g: which === 2 ? (L.g2 || 'boy') : L.g, age, emo: EMOK(emo), wave: /wave|cheer/.test(pose), hold: /shy|heart/.test(pose) };
    if (window.PIXEL_ON !== false && typeof PixelCast !== 'undefined') {
      const k = `c|kid|${which}|${o.route}|${o.g}|${age}|${o.emo}|${o.wave ? 'w' : o.hold ? 'h' : 'd'}`;
      PX.request(k, async early => {
        const B = { W: 176, H: 316, s: .44, ox: 0, oy: 0 };
        const paint = (oo, dy = 0) => PX.toURL(PixelCast.hiPaint(B, x => { const g = PixelCast.G(x, LN); paintPx(g, kidShapes(oo), 200, fy + dy, sc); return g; }), 176, 316);
        const a = paint(o), b = paint(o, 4); early(a);
        return { seq: { idle: [a, a, b, b], talk: [paint(Object.assign({}, o, { emo: o.emo === 'laugh' ? 'smile' : 'laugh' })), a], blink: [paint(Object.assign({}, o, { emo: 'sleep' }))] }, fd: { idle: 320, talk: 150 }, w: 176, h: 316 };
      }, 3);
      const { src } = PX.srcFor(k);
      return `<svg class="csvg pixelart" viewBox="0 0 400 720" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg"><image class="pxa" data-k="${k}" href="${src || ''}" x="0" y="0" width="400" height="720" preserveAspectRatio="none"/></svg>`;
    }
    return `<svg class="csvg" viewBox="0 0 400 720" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">${svgShapes(kidShapes(o), 200, fy, sc)}</svg>`;
  }
  const _char = Art.char;
  Art.char = (id, emo, pose, portrait, of) => (id === 'kid' || id === 'kid2') ? kidSprite(id, emo || 'smile', pose || 'default') : _char(id, emo, pose, portrait, of);

  // ---------- props ----------
  const ringBox = (x, y, s = 1) => (g, t, i) => {
    const cel = PixelCast.cel; g.save(); g.tr(x, y); g.sc(s, s);
    cel(g, 'M-70,0 L70,0 L64,70 L-64,70Z', '#8a1e3a', '#5a0e22', 4, LN);
    cel(g, 'M-70,0 L70,0 L80,-90 L-60,-96Z', '#a82a4a', '#6a1430', 4, LN);
    g.solid('M-56,-6 L56,-6 L62,-78 L-48,-84Z', '#f2e6ea');
    g.ring(0, -8, 30, 30, '#e8c04a', 10); g.ring(0, -8, 30, 30, '#fff4b0', 3);
    g.fill('M-14,-42 L0,-60 L14,-42 L0,-30Z', '#dff8ff', 3, LN);
    if (i % 2) PixelCast.star4(g, 22, -68, 18, '#ffffff'); g.restore();
  };
  const cat = (x, y, s = 1, flip) => (g, t) => {
    const w = Math.sin(t * TAU) * 14; g.save(); g.tr(x, y); g.sc(flip ? -s : s, s);
    g.line(`M60,-30 C120,-40 ${130 + w},-120 ${90 + w},-170`, '#14101c', 18); g.markLine('#3a3050');
    g.fill('M-70,0 C-80,-90 -40,-140 0,-140 C40,-140 80,-90 70,0Z', '#14101c', 4, '#3a3050');
    g.fill('M-56,-150 C-60,-210 0,-232 40,-200 C70,-180 66,-140 50,-120 C10,-108 -40,-110 -56,-150Z', '#14101c', 4, '#3a3050');
    g.fill('M-50,-188 L-62,-246 L-20,-210Z', '#14101c', 4, '#3a3050'); g.fill('M30,-208 L52,-250 L60,-196Z', '#14101c', 4, '#3a3050');
    g.ell(-22, -168, 9, 11, '#ffd23a'); g.ell(20, -168, 9, 11, '#ffd23a'); g.rect(-24, -174, 4, 12, '#14101c'); g.rect(18, -174, 4, 12, '#14101c');
    g.restore();
  };
  const arch = (col = '#ffb3cf') => (g, t, i) => {
    const cel = PixelCast.cel;
    for (const x of [300, 1300]) cel(g, `M${x - 30},900 L${x + 30},900 L${x + 26},260 L${x - 26},260Z`, '#f6f0ea', '#d8ccc0', 4, LN);
    g.line('M300,270 C380,40 1220,40 1300,270', '#f6f0ea', 34); g.line('M300,270 C380,40 1220,40 1300,270', LN, 4); g.markLine(LN);
    for (let k = 0; k <= 22; k++) {
      const q = k / 22, u = 1 - q, bx = u * u * u * 300 + 3 * u * u * q * 380 + 3 * u * q * q * 1220 + q * q * q * 1300, by = u * u * u * 270 + 3 * u * u * q * 40 + 3 * u * q * q * 40 + q * q * q * 270;
      const c = [col, '#ffffff', '#ffe08a', col][k % 4]; g.ell(bx + ((k * 37) % 30) - 15, by + ((k * 53) % 24) - 12, 26, 22, c, 3, PX.shade(c, -1, 22));
      if (k % 3 === 0) g.fill(`M${bx},${by + 20} q-30,26 -10,46 q20,-10 10,-46Z`, '#5ab06a', 2, '#2a6a3a');
    }
  };
  const frame = text => (g, t, i) => {
    const p = new Path2D('M0,0 L1600,0 L1600,900 L0,900Z M60,50 L1540,50 L1540,780 L60,780Z'); g.x.fillStyle = '#fbf8f1'; g.used.add('#fbf8f1'); g.x.fill(p, 'evenodd');
    g.line('M60,50 L1540,50 L1540,780 L60,780Z', '#c8c0b0', 4); g.text(text, 800, 856, 46, '#3a2a3a');
  };
  const notebook = (x, y, s = 1) => g => { const cel = PixelCast.cel; g.save(); g.tr(x, y); g.sc(s, s); g.rot(-8); cel(g, 'M-80,-60 L80,-60 L80,60 L-80,60Z', '#3a5ba8', '#2a4280', 4, LN); g.solid('M-70,-50 L70,-50 L70,50 L-70,50Z', '#f8f4ea'); for (let k = 0; k < 4; k++) g.line(`M-56,${-30 + k * 22} L56,${-30 + k * 22}`, '#9aa8c8', 3); g.text('VOL.1', 0, 44, 22, '#3a5ba8'); g.restore(); };
  const futon = (x, y, col = '#ff8a3a') => g => { const cel = PixelCast.cel; cel(g, `M${x},${y} L${x + 640},${y} Q${x + 670},${y} ${x + 670},${y + 30} L${x + 670},${y + 90} L${x - 30},${y + 90} L${x - 30},${y + 30} Q${x - 30},${y} ${x},${y}Z`, '#f4f0e8', '#d8d0c4', 4, LN); };
  const quilt = (x, y, col = '#ff8a3a') => g => { const cel = PixelCast.cel; cel(g, `M${x},${y} Q${x + 180},${y - 60} ${x + 380},${y - 20} L${x + 390},${y + 80} L${x - 10},${y + 80}Z`, col, PX.shade(col, -1, 14), 4, LN); for (let k = 1; k < 4; k++) g.line(`M${x + k * 95},${y - 18} l6,96`, PX.shade(col, -1, 20), 3); };
  const lamp = (x, y) => (g, t) => { PixelCG.FX.glow(x, y, 220, '#ffe6b0', 160)(g, t); g.fill(`M${x - 40},${y + 40} L${x + 40},${y + 40} L${x + 24},${y - 20} L${x - 24},${y - 20}Z`, '#ffe6b0', 3, '#8a5a3a'); };

  // ---------- wedding outfits ----------
  const WED = { hikari: '#fffaf0', rei: '#f4f0fa', mira: '#fff6f8', sora: '#f6f4ff', kaede: '#f6fff8', natsuki: '#ffe8d0' };
  Object.entries(WED).forEach(([id, col]) => {
    if (typeof PixelCast !== 'undefined' && PixelCast.OUTFITS[id]) PixelCast.OUTFITS[id].wedding = { style: 'dress', col };
    if (typeof CharArt !== 'undefined' && CharArt.OUTFITS[id]) CharArt.OUTFITS[id].wedding = { style: 'dress', col };
  });

  // ---------- CG specs ----------
  if (typeof PixelCG === 'undefined') return;
  const C = PixelCG.specs, FX = PixelCG.FX, PR = PixelCG.PR;
  const ch = (id, emo, pose, x, y, sc, o = {}) => Object.assign({ id, emo, pose, x, y, sc }, o);
  const warm = { col: '#ffb070', amt: .07 }, cold = { col: '#7a8ad8', amt: .08 };
  const COL = { hikari: '#ffd54a', rei: '#b99bff', mira: '#ff8fb8', sora: '#ff6fae', kaede: '#5ef0a0', squad: '#ffb45a' };

  // Proposals
  C.cg_dlc_ring_hikari = { bg: 'ramen', back: [FX.windows()], mid: [ch('hikari', 'flustered', 'shy', 760, 40, 1.95, { of: 'casual', sit: 1, turn: .3, light: warm, rim: { col: '#fff0c0', side: 'l' } }), PR.table(700, '#a8703a'), ringBox(1080, 650, 1.1)], front: [FX.sparkles(5, '#fff6a8', 101)] };
  C.cg_dlc_ring_rei = { bg: 'rooftop', tone: { col: '#0a0a24', amt: .4 }, back: [FX.rain(70, 11)], mid: [ch('rei', 'blush', 'shy', 720, 60, 1.85, { of: 'casual', turn: -.35, light: cold, rim: { col: '#d8d0ff', side: 't' } }), PR.umbrella(760, 60, '#2a2440'), cat(1220, 860, 1.05, 1), ringBox(430, 900, 1.25)], front: [FX.rain(40, 13, '#c8d8ff')] };
  C.cg_dlc_ring_mira = { bg: 'medbay', tone: { col: '#101830', amt: .25 }, back: [lamp(1260, 300)], mid: [ch('mira', 'crysmile', 'heart', 800, 60, 1.85, { of: 'casual', sit: 1, turn: -.2, light: warm, rim: { col: '#fff0d0', side: 'r' } }), PR.table(720, '#8a8a9a'), ringBox(560, 670, 1)], front: [FX.sparkles(4, '#fff0c0', 103)] };
  C.cg_dlc_ring_sora = { bg: 'dome', tone: { col: '#0a0620', amt: .45 }, back: [FX.spot(800, '#ffd6ea', .22), FX.stars(40, 105, 400)], mid: [PR.ledge(800, '#3a2a4a'), ch('sora', 'love', 'heart', 800, 120, 1.6, { of: 'casual', sit: 1, turn: .1, rim: { col: '#ffe0f0', side: 't' } }), ringBox(1090, 770, .9)], front: [FX.confetti(18, 106)] };
  C.cg_dlc_ring_kaede = { bg: 'park', back: [FX.sunDisc(1300, 200, 90, '#ffd6a0')], mid: [ch('kaede', 'stunned', 'shy', 760, 20, 2.0, { of: 'casual', turn: .3, wind: 2.2, light: warm, rim: { col: '#fff0c0', side: 'r' } }), ringBox(1140, 820, 1.2)], front: [FX.leaves(12, 107)] };

  // Weddings (the background follows the venue picked in the story)
  const WEDS = {
    hikari: [ch('hikari', 'laugh', 'heart', 800, 30, 1.9, { of: 'wedding', turn: .15, wind: 1.6, light: warm, rim: { col: '#fff6d0', side: 'l' } })],
    rei: [ch('rei', 'tender', 'shy', 800, 30, 1.9, { of: 'wedding', turn: -.3, wind: 1.2, light: warm, rim: { col: '#e8e0ff', side: 't' } })],
    mira: [ch('mira', 'crysmile', 'heart', 800, 30, 1.9, { of: 'wedding', turn: .2, wind: 1.2, light: warm, rim: { col: '#fff0f4', side: 'r' } })],
    sora: [ch('sora', 'love', 'reach', 800, 0, 1.95, { of: 'wedding', turn: -.1, wind: 2.2, rot: -3, light: warm, rim: { col: '#ffe0f0', side: 't' } })],
    kaede: [ch('kaede', 'fond', 'cheer', 800, 30, 1.9, { of: 'wedding', turn: .3, wind: 2.4, light: warm, rim: { col: '#e8fff0', side: 'l' } })]
  };
  P5.forEach((id, n) => { C['cg_dlc_wed_' + id] = { bg: 'shrine', pan: 3, back: [arch(COL[id])], mid: WEDS[id], front: [FX.petals(26, '#ffd6e4', 110 + n), FX.sparkles(4, '#ffffff', 120 + n)], tint: 'linear-gradient(0deg,rgba(255,200,170,.18),transparent)' }; });
  C.cg_dlc_wed_squad = { bg: 'park', back: [arch('#ffb45a')], mid: [...[['tetsu', 'proud', 'cross', 300, 150], ['hikari', 'crysmile', 'cheer', 560, 170], ['rei', 'halfsmile', 'cross', 1060, 170], ['kaede', 'laugh', 'hip', 1300, 160]].map(([id, e, p, x, y], k) => ch(id, e, p, x, y, 1.15, { of: 'formal', turn: (800 - x) / 1000, ph: k * .2 })), ch('mira', 'tender', 'heart', 800, 210, 1.1, { of: 'formal' }), KID(800, 1070, .78, { route: 'squad', emo: 'laugh', wave: 1, bob: 6 })], front: [FX.confetti(30, 130)] };

  // Newborns
  P5.forEach((id, n) => { C['cg_dlc_baby_' + id] = { bg: 'medbay', tone: { col: '#ffe0c0', amt: .12 }, back: [FX.windows()], mid: [ch(id, ['tender', 'crysmile', 'sleepy', 'fond', 'stunned'][n], 'heart', 800, 70, 1.75, { of: 'casual', sit: 1, turn: [.2, -.25, .1, -.15, .25][n], light: warm, rim: { col: '#fff4e0', side: 'l' } }), BABY(830, 740, 1.05, { route: id })], front: [FX.sparkles(3, '#fff6e0', 140 + n)] }; });
  C.cg_dlc_baby_squad = { bg: 'apartment', tone: { col: '#0a1030', amt: .4 }, back: [lamp(300, 520)], mid: [ch('tetsu', 'sleepy', 'default', 1240, 150, 1.3, { of: 'casual', sit: 1, turn: -.4, light: { col: '#ffd8a0', amt: .1 } }), futon(330, 760), KID(380, 800, .62, { route: 'squad', emo: 'sleep', rot: 90 }), quilt(360, 770)], front: [FX.fireflies(6, '#ffe6b0', 150)] };

  // First Sparks (age five)
  C.cg_dlc_spark_hikari = { bg: 'park', tone: { col: '#101a40', amt: .25 }, back: [FX.glow(820, 560, 360, '#bff0ff', 300)], mid: [ch('hikari', 'awe', 'reach', 1240, 120, 1.3, { of: 'casual', turn: -.5 }), KID(760, 1060, .74, { route: 'hikari', emo: 'wow', wave: 1 }), FX.zap(868, 520, 940, 30, 5), FX.zap(868, 520, 560, 40, 9)], front: [FX.sparkles(10, '#fff27a', 160)] };
  C.cg_dlc_spark_rei = { bg: 'park', tone: { col: '#140a30', amt: .4 }, back: [FX.moon(1300, 150, 60)], mid: [ch('rei', 'surprised', 'shy', 360, 140, 1.3, { of: 'casual', turn: .5 }), PR.shadowPool(), KID(860, 1060, .74, { route: 'rei', emo: 'laugh' }), cat(1200, 870, .8, 1)], front: [FX.fireflies(10, '#b99bff', 161)] };
  C.cg_dlc_spark_mira = { bg: 'park', back: [FX.glow(800, 640, 420, '#c8fff0', 260)], mid: [ch('mira', 'scared', 'reach', 1220, 120, 1.3, { of: 'casual', turn: -.45 }), KID(700, 1060, .74, { route: 'mira', emo: 'sleep', hold: 1 })], front: [FX.hearts(6, 162), FX.sparkles(8, '#c8fff0', 163)] };
  C.cg_dlc_spark_sora = { bg: 'park', back: [FX.rings(800, 420, '#c9b6ff')], mid: [ch('sora', 'shocked', 'reach', 1220, 120, 1.3, { of: 'casual', turn: -.45 }), KID(760, 720, .74, { route: 'sora', emo: 'laugh', wave: 1, bob: 16 })], front: [FX.sparkles(10, '#e8e0ff', 164), FX.leaves(6, 165)] };
  C.cg_dlc_spark_kaede = { bg: 'park', back: [FX.sunDisc(1320, 180, 80, '#ffd6a0')], mid: [ch('kaede', 'fond', 'think', 1220, 110, 1.3, { of: 'casual', sit: 1, turn: -.45, light: warm }), KID(720, 1060, .74, { route: 'kaede', emo: 'smile', hold: 1 }), notebook(720, 840, .85)], front: [FX.leaves(10, 166)] };
  C.cg_dlc_spark_squad = { bg: 'training', back: [FX.rings(800, 450, '#ff9ad8'), FX.rings(800, 450, '#7ff6ff')], mid: [ch('rin', 'delighted', 'cheer', 1240, 130, 1.25, { turn: -.4 }), ch('tetsu', 'awe', 'cross', 340, 130, 1.25, { turn: .4 }), KID(800, 1060, .76, { route: 'squad', emo: 'wow', wave: 1 })], front: [FX.sparkles(12, '#ffffff', 167)] };

  // Family portraits (age twelve; a second child if there is one)
  const fam = (id, n) => ({ bg: n === 5 ? 'park' : 'apartment', tone: { col: '#ffe0c0', amt: .08 }, back: [], mid: [
    ...(id === 'squad' ? [['tetsu', 220], ['kaede', 450], ['rei', 1150], ['sora', 1380]].map(([h, x], k) => ch(h, 'smile', k % 2 ? 'hip' : 'cross', x, 140, 1.12, { turn: (800 - x) / 1000, ph: k * .2 })) : [ch(id, ['laugh', 'halfsmile', 'tender', 'happy', 'smirk'][n], ['cheer', 'cross', 'heart', 'wave', 'hip'][n], 1080, 110, 1.35, { of: 'casual', turn: -.3, light: warm })]),
    KID(id === 'squad' ? 800 : 560, 1160, .72, { route: id, age: 'big', emo: 'smile', wave: id !== 'squad' }), KID(id === 'squad' ? 1010 : 830, 1010, .52, { route: id, which: 2, emo: 'laugh', bob: 5 }), frame(id === 'squad' ? 'HOME · NINE SIGNATURES' : 'HOME · TWELVE YEARS')] });
  P6.forEach((id, n) => { C['cg_dlc_fam_' + id] = fam(id, n); });

  // ---------- vector fallbacks ----------
  const A = Art._h, big = A.big, bg = Art.bg, fx = s => `<svg class="cgfx" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  const ringSvg = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70,0 L70,0 L64,70 L-64,70Z" fill="#8a1e3a" stroke="${LN}" stroke-width="4"/><path d="M-70,0 L70,0 L80,-90 L-60,-96Z" fill="#a82a4a" stroke="${LN}" stroke-width="4"/><circle cx="0" cy="-8" r="30" fill="none" stroke="#e8c04a" stroke-width="10"/><path d="M-14,-42 L0,-60 L14,-42 L0,-30Z" fill="#dff8ff" stroke="${LN}" stroke-width="3"/></g>`;
  const VC = A.CG, vb = (name, html) => { VC[name] = html; };
  const one = (id, emo, pose, of, style = 'left:50%;bottom:-100%;height:200%;transform:translateX(-50%)') => big(id, emo, pose, style, of);
  P5.forEach(id => {
    const r = C['cg_dlc_ring_' + id], w = WEDS[id][0];
    vb('cg_dlc_ring_' + id, () => bg(r.bg) + one(id, r.mid.find(m => m.id === id).emo, r.mid.find(m => m.id === id).pose, 'casual') + fx(ringSvg(1120, 700, 1.2)));
    vb('cg_dlc_wed_' + id, () => bg(C['cg_dlc_wed_' + id].bg) + `<div class="cgtint" style="background:radial-gradient(circle at 50% 30%,rgba(255,240,230,.35),transparent 60%)"></div>` + one(id, w.emo, w.pose, 'wedding'));
    vb('cg_dlc_baby_' + id, () => bg('medbay') + one(id, 'tender', 'heart', 'casual', 'left:50%;bottom:-90%;height:190%;transform:translateX(-50%)') + fx(babySvg(830, 760, 1.1, { route: id })));
    vb('cg_dlc_spark_' + id, () => bg('park') + big(id, 'awe', 'reach', 'right:-6%;bottom:-60%;height:140%', 'casual') + fx(kidSvg(id === 'sora' ? 760 : 740, id === 'sora' ? 720 : 1060, .74, { route: id, emo: id === 'mira' ? 'sleep' : 'wow', wave: id !== 'mira' && id !== 'kaede', hold: id === 'mira' || id === 'kaede' })));
    vb('cg_dlc_fam_' + id, () => bg('apartment') + big(id, 'happy', 'wave', 'right:-4%;bottom:-62%;height:140%', 'casual') + fx(kidSvg(560, 1160, .72, { route: id, age: 'big', wave: 1 }) + kidSvg(830, 1010, .52, { route: id, which: 2, emo: 'laugh' })));
  });
  vb('cg_dlc_wed_squad', () => bg('park') + ['tetsu', 'hikari', 'mira', 'rei', 'kaede'].map((id, i) => big(id, 'happy', ['cross', 'cheer', 'heart', 'cross', 'hip'][i], `left:${-6 + i * 20}%;bottom:-62%;height:130%`, 'formal')).join('') + fx(kidSvg(800, 1070, .78, { route: 'squad', emo: 'laugh', wave: 1 })));
  vb('cg_dlc_baby_squad', () => bg('apartment') + `<div class="cgtint" style="background:rgba(10,16,48,.45)"></div>` + big('tetsu', 'tender', 'default', 'right:-4%;bottom:-62%;height:140%', 'casual') + fx(`<rect x="300" y="760" width="700" height="90" rx="30" fill="#f4f0e8" stroke="${LN}" stroke-width="4"/>` + kidSvg(380, 800, .62, { route: 'squad', emo: 'sleep', rot: 90 }) + `<path d="M360,770 Q540,710 740,750 L750,850 L350,850Z" fill="#ff8a3a" stroke="${LN}" stroke-width="4"/>`));
  vb('cg_dlc_spark_squad', () => bg('training') + big('rin', 'delighted', 'cheer', 'right:-4%;bottom:-62%;height:140%') + big('tetsu', 'awe', 'cross', 'left:-4%;bottom:-62%;height:140%') + fx(kidSvg(800, 1060, .76, { route: 'squad', emo: 'wow', wave: 1 })));
  vb('cg_dlc_fam_squad', () => bg('park') + ['tetsu', 'kaede', 'rei', 'sora'].map((id, i) => big(id, 'smile', i % 2 ? 'hip' : 'cross', `left:${[-6, 12, 58, 76][i]}%;bottom:-62%;height:130%`)).join('') + fx(kidSvg(800, 1160, .72, { route: 'squad', age: 'big' }) + kidSvg(1010, 1010, .52, { route: 'squad', which: 2, emo: 'laugh' })));

  // ---------- gallery names ----------
  const NM = { hikari: 'Hikari', rei: 'Rei', mira: 'Mira', sora: 'Sora', kaede: 'Kaede', squad: 'Squad' };
  const T5 = { ring: ['Ramen Raijin, Table Three', 'Under One Umbrella', 'Night Shift, Day Off', 'Audience of One', 'Finish Line'], wed: 'The Wedding', baby: 'Hello', spark: 'First Spark', fam: 'Home' };
  P5.forEach((id, n) => { Object.assign(Art.CG_NAMES, { ['cg_dlc_ring_' + id]: `${T5.ring[n]} (${NM[id]})`, ['cg_dlc_wed_' + id]: `The Wedding (${NM[id]})`, ['cg_dlc_baby_' + id]: `Hello, Small Person (${NM[id]})`, ['cg_dlc_spark_' + id]: `First Spark (${NM[id]})`, ['cg_dlc_fam_' + id]: `Home (${NM[id]})` }); });
  Object.assign(Art.CG_NAMES, { cg_dlc_wed_squad: 'Nine Signatures (Squad)', cg_dlc_baby_squad: 'First Night Home (Squad)', cg_dlc_spark_squad: 'Borrowed Light (Squad)', cg_dlc_fam_squad: 'Home (Squad)' });

  // the child's look changed: drop painted DLC CGs so they repaint
  let lastSig = null;
  window.HomeArt = {
    LOOK, kidShapes, babyShapes, kidSvg, babySvg,
    refresh() { const sig = JSON.stringify(look()); if (sig === lastSig) return; if (lastSig !== null && typeof PX !== 'undefined') [...PX.cache.keys()].forEach(k => { if (k.startsWith('g|cg_dlc_')) PX.cache.delete(k); }); lastSig = sig; },
    venue(route, bgName) { const s = C['cg_dlc_wed_' + route]; if (s && s.bg !== bgName && route !== 'squad') { s.bg = bgName; if (typeof PX !== 'undefined') PX.cache.delete('g|cg_dlc_wed_' + route); } }
  };
})();

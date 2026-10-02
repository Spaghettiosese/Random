/* HEARTLINE AGENCY — pixel B.I.T., Rift monsters and the Glazier, drawn for the Moonkai Pixel Engine.
   B.I.T.: 100 x 100 sprite (0.5 px/unit over a 200 x 200 box) with 10 screen faces, a float loop
   (Studio "Float" preset), thruster flicker and a blinking antenna.
   Monsters: the Rift Hound, the Glass Leviathan and the Glazier, 180 x 210 sprites over 600 x 700. */
const PixelMon = (() => {
  const TAU = Math.PI * 2, { shade } = PX, { G, star, star4, heartD } = PixelCast;
  const f1 = n => n.toFixed(1);

  // ---------- B.I.T. ----------
  const BIT_FACE = {
    happy: g => { g.line('M76,98 q10,-14 20,0 M104,98 q10,-14 20,0', '#52e0ff', 7); },
    surprised: g => { g.ring(86, 93, 9, 9, '#52e0ff', 6); g.ring(116, 93, 9, 9, '#52e0ff', 6); },
    angry: g => { g.line('M74,84 l20,10 l-20,10 M128,84 l-20,10 l20,10', '#ff5a7a', 6); },
    sad: g => { g.line('M76,96 q10,10 20,0 M104,96 q10,10 20,0', '#52e0ff', 6); g.line('M86,104 l0,10', '#9fdcff', 4); },
    smug: g => { g.rect(74, 92, 24, 7, '#52e0ff'); g.rect(104, 84, 22, 17, '#52e0ff'); },
    love: g => { g.fill(heartD(86, 94, 9), '#ff4f8b', 0); g.fill(heartD(116, 94, 9), '#ff4f8b', 0); },
    confused: g => { g.rect(76, 84, 16, 22, '#52e0ff'); g.line('M104,94 l20,0', '#52e0ff', 6); g.text('?', 138, 70, 26, '#ffd24a'); },
    sleepy: g => { g.line('M76,96 l20,0 M104,96 l20,0', '#52e0ff', 6); g.text('z', 140, 66, 20, '#9aa4ff'); },
    excited: g => { star(g, 86, 94, 11, '#52e0ff', 0); star(g, 116, 94, 11, '#52e0ff', 0); },
    think: g => { g.rect(78, 86, 14, 18, '#52e0ff'); g.rect(108, 90, 14, 12, '#52e0ff'); g.ell(140, 70, 4, 4, '#52e0ff'); g.ell(150, 58, 6, 6, '#52e0ff'); }
  };
  const BIT_ALIAS = { laugh: 'happy', smile: 'happy', shocked: 'surprised', scared: 'surprised', furious: 'angry', glare: 'angry', cry: 'sad', gloomy: 'sad', smirk: 'smug', tease: 'smug', blush: 'love', tender: 'love', awe: 'excited', sweat: 'confused', dizzy: 'confused', serious: 'think', determined: 'think' };
  function drawBit(g, emo, t, talk, blink) {
    const LN = '#1c1830', bob = Math.round(Math.sin(t * TAU) * 6), fl = (Math.floor(t * 16) % 2), ant = Math.floor(t * 4) % 2;
    g.save(); g.tr(0, bob);
    // thruster flame
    g.fill(`M84,150 L100,${184 + fl * 12} L116,150Z`, fl ? '#9ff6ff' : '#52e0ff', 1.6, '#1a6a8a'); g.fill(`M92,150 L100,${170 + fl * 6} L108,150Z`, '#ffffff', 0);
    // fins
    g.fill('M40,90 L4,68 L20,114Z', '#8fb4ff', 3, LN); g.fill('M160,90 L196,68 L180,114Z', '#8fb4ff', 3, LN); g.line('M30,86 L14,78 M170,86 L186,78', '#d8e6ff', 3);
    // body
    g.ell(100, 95, 62, 62, '#e8f0ff', 4, LN); g.solid('M150,60 C170,90 166,130 136,150 C150,120 154,90 150,60Z', '#b9d0f4'); g.ell(78, 58, 14, 9, '#ffffff', 0, 0, -.5);
    g.line('M40,112 Q100,140 160,112', '#52e0ff', 5);
    // screen
    g.fill('M54,94 C54,76 64,68 80,68 L120,68 C136,68 146,76 146,94 C146,112 136,120 120,120 L80,120 C64,120 54,112 54,94Z', '#0b1530', 3, LN);
    g.line('M60,80 L140,80', '#16244a', 2); g.line('M60,106 L140,106', '#16244a', 2);
    const F = BIT_FACE[emo] || BIT_FACE[BIT_ALIAS[emo]];
    if (blink) g.line('M76,96 l20,0 M104,96 l20,0', '#52e0ff', 5); else if (F) F(g); else { g.rect(78, 82, 16, 24, '#52e0ff'); g.rect(108, 82, 16, 24, '#52e0ff'); }
    if (talk) g.line('M86,112 l6,-4 l6,6 l6,-6 l6,4', '#52e0ff', 3);
    // antenna
    g.line('M100,33 L100,14', LN, 4); g.ell(100, 11, 7, 7, ant ? '#ff4f8b' : '#8a1a44', 2, LN);
    g.restore();
    return g;
  }
  const BW = 100, BH = 100, BS = .5;
  function bitFrames(emo) {
    return async early => {
      const b = { W: BW, H: BH, s: BS, ox: 0, oy: 0 }, url = a => PX.toURL(a, BW, BH), paint = o => PixelCast.hiPaint(b, x => drawBit(G(x, '#1c1830'), emo, o.t, o.talk, o.blink));
      const idle = [], talk = [];
      for (let i = 0; i < 8; i++) { idle.push(url(paint({ t: i / 8 }))); if (!i) early(idle[0]); }
      for (let i = 0; i < 4; i++) talk.push(url(paint({ t: i * 2 / 8, talk: i % 2 === 0 })));
      return { seq: { idle, talk, blink: [url(paint({ t: 0, blink: 1 }))] }, fd: { idle: 160, talk: 120 } };
    };
  }
  function bitSprite(emo = 'neutral', portrait = false, pri = 3) {
    const k = 'bit|' + emo; PX.request(k, bitFrames(emo), pri);
    const { src, tmp } = PX.srcFor(k, 'bit|neutral');
    return `<svg class="csvg bitsvg pixelart" viewBox="${portrait ? '20 20 160 160' : '-100 -300 400 720'}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg"><image class="pxa" data-k="${k}"${tmp ? ' data-tmp="1"' : ''} href="${src}" x="0" y="0" width="200" height="200" preserveAspectRatio="none"/></svg>`;
  }

  // ---------- monsters (600 x 700 box) ----------
  const GLASS = ['#e8ffff', '#9ff6ff', '#5ab8e6', '#2a4c9a', '#16244a'];
  function shard(g, x, y, h, w, a, col, glint) {
    g.save(); g.rot(a, x, y); g.fill(`M${x},${y - h} L${x + w},${y} L${x},${y + h * .3} L${x - w},${y}Z`, col, 2.4, '#0e1a3a'); if (glint) g.line(`M${x - w * .3},${y - h * .5} L${x},${y - h * .85}`, '#ffffff', 3); g.restore();
  }
  // Rift Hound: a crystalline wolf that runs on four glass legs; core in the chest
  function hound(g, t, frame) {
    const LN = '#0e1a3a', br = Math.sin(t * TAU) * 6, jaw = Math.max(0, Math.sin(t * TAU * 2)) * 16, pulse = Math.sin(t * TAU * 2) > 0;
    g.save(); g.tr(0, br * .5);
    // back legs + tail spikes
    g.fill('M430,420 L470,560 L440,640 L470,640 L500,560 L476,410Z', GLASS[2], 3, LN); g.fill('M160,420 L130,560 L160,640 L190,640 L176,560 L200,420Z', GLASS[2], 3, LN);
    for (let i = 0; i < 4; i++) shard(g, 470 + i * 26, 300 - i * 30, 60 - i * 6, 14, 40 + i * 8 + br, GLASS[1 + (i % 2)], (frame + i) % 4 === 0);
    // body
    g.fill('M150,330 C170,250 300,230 420,260 C500,280 520,360 480,430 C420,480 260,480 190,450 C150,430 140,380 150,330Z', GLASS[3], 3, LN);
    g.solid('M170,330 C200,280 300,270 400,290 C440,300 460,330 450,360 C380,330 260,330 170,360Z', GLASS[2]);
    for (let i = 0; i < 9; i++) shard(g, 190 + i * 32, 270 - (i % 3) * 12, 70 + (i % 3) * 24, 16, -20 + i * 5, GLASS[i % 2], (frame + i) % 5 === 0);
    // front legs
    g.fill('M190,430 L170,580 L140,650 L186,650 L214,580 L236,440Z', GLASS[2], 3, LN); g.fill('M300,440 L310,590 L290,650 L336,650 L346,590 L340,440Z', GLASS[1], 3, LN);
    // head
    g.save(); g.tr(0, -br * .4);
    g.fill('M60,300 C70,240 120,210 170,220 C210,228 230,260 226,300 C222,336 190,352 150,352 L96,350 C70,346 56,330 60,300Z', GLASS[2], 3, LN);
    g.fill(`M60,320 L150,330 L140,${360 + jaw} L70,${354 + jaw}Z`, GLASS[3], 3, LN);
    for (let i = 0; i < 5; i++) g.fill(`M${76 + i * 14},${320} l6,14 l6,-14Z`, '#ffffff', 1.4, LN);
    for (let i = 0; i < 4; i++) g.fill(`M${80 + i * 14},${354 + jaw} l6,-12 l6,12Z`, '#ffffff', 1.4, LN);
    g.fill('M110,262 L150,272 L112,284Z', '#ff3355', 2, '#5a0010'); g.ell(126, 272, 3, 3, '#ffe0e8');
    shard(g, 170, 210, 70, 16, 30, GLASS[0], frame % 3 === 0); shard(g, 196, 226, 56, 14, 50, GLASS[1], false);
    g.restore();
    // core
    g.ell(260, 380, pulse ? 34 : 26, pulse ? 34 : 26, '#ff2050', 3, '#5a0010'); g.ell(260, 380, pulse ? 18 : 12, pulse ? 18 : 12, '#ff9ab0'); g.ell(254, 372, 5, 5, '#ffffff');
    g.restore();
    g.markLine('#5a0010');
  }
  // Glass Leviathan: a serpent-whale rising out of the harbour, crown of shards, maw glowing
  function leviathan(g, t, frame) {
    const LN = '#0e1a3a', sw = Math.sin(t * TAU) * 10, maw = 20 + Math.max(0, Math.sin(t * TAU)) * 26, pulse = frame % 2 === 0;
    // coils behind
    g.fill(`M-20,640 C80,${520 + sw} 180,${560 - sw} 240,500 L300,560 C220,${620 + sw} 120,660 -20,700Z`, GLASS[3], 3, LN);
    g.fill(`M620,620 C520,${500 - sw} 440,${540 + sw} 380,470 L330,540 C420,${600 - sw} 500,640 620,690Z`, GLASS[3], 3, LN);
    for (let i = 0; i < 6; i++) shard(g, 40 + i * 40, 590 - i * 16 + sw * .3, 50, 12, -30, GLASS[1 + i % 2], (frame + i) % 4 === 0);
    // neck + body
    g.fill(`M180,700 C170,560 200,400 ${250 + sw * .3},300 L${370 + sw * .3},300 C410,420 430,560 420,700Z`, GLASS[2], 3, LN);
    g.solid(`M300,700 C300,560 330,420 ${350 + sw * .3},310 L${370 + sw * .3},300 C410,420 430,560 420,700Z`, GLASS[3]);
    for (let i = 0; i < 6; i++) g.line(`M${220 + i * 6},${660 - i * 70} q${60},-10 ${140 - i * 8},0`, GLASS[0], 3);
    // head
    g.save(); g.tr(sw * .3, 0);
    g.fill('M170,300 C150,210 200,140 300,130 C400,140 450,210 430,300 C420,340 380,360 300,360 C220,360 180,340 170,300Z', GLASS[2], 3.4, LN);
    g.fill(`M200,300 C230,${300 + maw} 370,${300 + maw} 400,300 L380,${320 + maw * 1.4} C340,${350 + maw * 1.5} 260,${350 + maw * 1.5} 220,${320 + maw * 1.4}Z`, '#3a0a1a', 3, LN);
    g.ell(300, 320 + maw * .8, 30, 10 + maw * .3, pulse ? '#ff2050' : '#ff6a8a');
    for (let i = 0; i < 7; i++) g.fill(`M${214 + i * 26},${302 + Math.sin(i / 6 * Math.PI) * maw * .6} l10,${18} l10,${-18}Z`, '#ffffff', 1.6, LN);
    // crown of shards
    for (let i = 0; i < 9; i++) shard(g, 190 + i * 28, 160 - Math.sin(i / 8 * Math.PI) * 40, 90 + Math.sin(i / 8 * Math.PI) * 60, 18, (i - 4) * 12, GLASS[i % 3], (frame + i) % 4 === 0);
    // eyes
    g.fill('M220,236 L276,252 L222,268Z', '#ff3355', 2.4, '#5a0010'); g.fill('M380,236 L324,252 L378,268Z', '#ff3355', 2.4, '#5a0010'); g.ell(244, 252, 4, 4, '#ffe0e8'); g.ell(356, 252, 4, 4, '#ffe0e8');
    g.restore();
    g.markLine('#5a0010');
  }
  // The Glazier: a tall silhouette in a coat of black glass, a cracked mirror mask, shards orbiting
  function glazier(g, t, frame) {
    const LN = '#05030a', f = Math.sin(t * TAU) * 8;
    g.fill(`M300,130 C240,130 220,200 232,250 C170,280 130,380 ${110 + f},700 L${490 + f},700 C470,380 430,280 368,250 C380,200 360,130 300,130Z`, '#0c0816', 3, '#7ff6ff');
    g.markLine('#7ff6ff');
    for (let i = 0; i < 6; i++) g.line(`M${250 + i * 22},${300 + (i % 2) * 30} L${220 + i * 30 + f * .3},700`, '#1c1430', 3);
    g.fill('M256,168 C256,140 344,140 344,168 L340,236 C330,262 270,262 260,236Z', '#e8ffff', 3, '#16244a');
    g.line('M300,150 L292,190 L310,214 L298,250 M292,190 L270,200 M310,214 L334,206', '#5ab8e6', 2.4);
    g.fill('M266,196 l26,6 l-26,5z M334,196 l-26,6 l26,5z', '#0e1a3a', 0); const gl = frame % 3 === 0; g.ell(279, 202, 3, 3, gl ? '#ff3355' : '#7ff6ff'); g.ell(321, 202, 3, 3, gl ? '#ff3355' : '#7ff6ff');
    for (let i = 0; i < 8; i++) { const an = t * TAU * .5 + i * TAU / 8; shard(g, 300 + Math.cos(an) * 230, 420 + Math.sin(an) * 70, 40, 12, an * 40, GLASS[i % 3], (frame + i) % 4 === 0); }
  }
  // The Rift Heart: a red crystal heart inside a cage of glass ribs, shards orbiting, the whole thing beating
  function heart(g, t, frame) {
    const LN = '#0e1a3a', beat = Math.pow(Math.max(0, Math.sin(t * TAU * 2)), 2), sc = 1 + beat * .07, cx = 300, cy = 330;
    // cage of ribs behind the heart
    for (let i = 0; i < 11; i++) { const a = -Math.PI * .96 + i * (Math.PI * 1.92 / 10), r0 = 150, r1 = 250 + (i % 3) * 36; shard(g, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * .9, r1 * .62, 18, a * 57.3 + 90, GLASS[2 + (i % 2)], (frame + i) % 5 === 0); }
    // floating base of shards
    for (let i = 0; i < 7; i++) shard(g, cx - 120 + i * 40, 560 + Math.sin((t + i / 7) * TAU) * 12 + (i % 2) * 24, 70 + (i % 3) * 18, 15, 180 + (i - 3) * 10, GLASS[1 + (i % 2)], (frame + i) % 4 === 0);
    // the heart
    g.save(); g.tr(cx, cy); g.sc(sc); g.tr(-cx, -cy); g.tr(cx, cy);
    g.fill('M0,150 C-170,30 -190,-100 -100,-150 C-50,-178 0,-140 0,-100 C0,-140 50,-178 100,-150 C190,-100 170,30 0,150Z', '#ff2050', 4, '#5a0010');
    g.solid('M0,150 C-170,30 -190,-100 -100,-150 C-50,-178 0,-140 0,-100 L0,150Z', '#ff5a7a');
    g.solid('M-110,-120 C-80,-140 -50,-132 -30,-112 C-60,-104 -84,-90 -104,-60 C-120,-80 -122,-104 -110,-120Z', '#ffc0cc');
    g.line('M-100,-130 L-30,-30 L0,60 M100,-130 L30,-30 L0,60 M-30,-30 L30,-30', '#ffd0da', 3);
    g.ell(0, 10, beat > .3 ? 40 : 30, beat > .3 ? 40 : 30, '#ffffff', 3, '#ff9ab0'); g.ell(0, 10, 16, 16, '#ff2050');
    g.restore();
    // orbiting shards
    for (let i = 0; i < 8; i++) { const a = t * TAU + i * TAU / 8, x = cx + Math.cos(a) * 250, y = cy + Math.sin(a) * 70 + 20, front = Math.sin(a) > 0; if (front) shard(g, x, y, 56, 14, a * 57.3, GLASS[i % 3], (frame + i) % 4 === 0); }
    g.markLine('#5a0010');
  }
  const MON = { hound, leviathan, glazier, heart };
  const MW = 180, MH = 210, MS = .3;
  function monFrames(kind) {
    return async early => {
      const b = { W: MW, H: MH, s: MS, ox: 0, oy: 0 }, url = a => PX.toURL(a, MW, MH), idle = [];
      for (let i = 0; i < 8; i++) { idle.push(url(PixelCast.hiPaint(b, x => { const g = G(x, '#0e1a3a'); MON[kind](g, i / 8, i); return g; }))); if (!i) early(idle[0]); }
      return { seq: { idle }, fd: { idle: 140 } };
    };
  }
  function monSprite(kind = 'hound', pri = 3) {
    const k = 'm|' + kind; PX.request(k, monFrames(kind), pri); const { src, tmp } = PX.srcFor(k);
    return `<svg viewBox="0 0 600 700" class="monster pixelart" xmlns="http://www.w3.org/2000/svg"><image class="pxa" data-k="${k}"${tmp ? ' data-tmp="1"' : ''} href="${src}" x="0" y="0" width="600" height="700" preserveAspectRatio="none"/></svg>`;
  }
  return { drawBit, bitSprite, MON, monSprite, shard, GLASS };
})();

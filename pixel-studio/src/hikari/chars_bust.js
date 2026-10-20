// Character bust definitions: hikari, raika, sou
const COMMON = { tear: '#bfe9ff', tearS: '#7cc4f0', vein: '#e5484d', white: '#ffffff', whiteS: '#dfe6ff', mouth: '#b8455a', mouthI: '#ff8a9a' };
const PAL_HIKARI = Object.assign({ line: '#3a2030', skin: '#ffe9dc', skinS: '#f2bfa8', blush: '#f7a0a8', blushD: '#ee7f92', hair: '#ffd966', hairS: '#e8a73a', hairD: '#bf7a2a', hairH: '#fff4c2', brow: '#7e4214',
  iris: '#3f8ef2', irisD: '#1c3f9e', irisL: '#8cc6ff', pupil: '#171a44', jacket: '#f7f5ff', jacketS: '#c6c2e6', trim: '#ffc62a', trimS: '#d9921c', blue: '#2f58d8', blueS: '#1f3a9e' }, COMMON);

function drawHikari(k, o) {
  const P = k.P, sw = o.sway;
  const G = { ex: [67, 93], ey: 90, hs: 1, mx: 80, my: 107, ms: 1, by: 79, cy: 102, cx: 20, bw: 5, bh: 2.4, nose: 100, fxx: 108, fxy: 80, veinX: 111, veinY: 74, happyW: 7 };
  if (o.expr === 'happy') G.my = 106;
  if (o.expr === 'shy') G.my = 107;
  const dy = o.dy;
  // --- twin tails + back hair (move with head)
  k.tf(0, dy, 1, () => {
    k.path(`M46,56 C22,70 ${12 + sw},110 ${16 + sw},150 C${18 + sw},170 ${14 + sw * 2},184 ${10 + sw * 2},200 L${40 + sw},200 C${34 + sw},170 38,140 40,118 C42,96 46,76 52,62 Z`, P.hair);
    k.path(`M114,56 C138,70 ${148 + sw},110 ${144 + sw},150 C${142 + sw},170 ${146 + sw * 2},184 ${150 + sw * 2},200 L${120 + sw},200 C${126 + sw},170 122,140 120,118 C118,96 114,76 108,62 Z`, P.hair);
    k.line(`M40,80 C26,110 ${24 + sw * .5},150 ${20 + sw},188`, P.hairS, 1.4); k.line(`M120,80 C134,110 ${136 + sw * .5},150 ${140 + sw},188`, P.hairS, 1.4);
    k.line(`M46,70 C34,100 30,140 ${30 + sw * .6},180`, P.hairH, 1); k.line(`M114,70 C126,100 130,140 ${130 + sw * .6},180`, P.hairH, 1);
    k.path('M50,84 C48,48 64,38 80,38 C96,38 112,48 110,84 C112,100 110,110 104,114 L56,114 C50,110 48,100 50,84 Z', P.hairS, 0);
  });
  // --- torso / jacket
  k.path('M30,150 C34,140 52,134 68,132 L92,132 C108,134 126,140 130,150 L136,196 L24,196 Z', P.jacket);
  k.path('M112,146 C124,150 130,160 134,196 L118,196 C118,172 116,158 112,146 Z', P.jacketS, 0);
  k.path('M48,146 C36,150 30,160 26,196 L42,196 C42,172 44,158 48,146 Z', P.jacketS, 0);
  k.line('M44,150 C42,166 42,180 42,192', P.line, 1); k.line('M116,150 C118,166 118,180 118,192', P.line, 1);
  k.path('M66,134 L94,134 L100,196 L60,196 Z', P.blue);
  k.path('M80,134 L94,134 L100,196 L84,196 Z', P.blueS, 0);
  k.line('M65,136 L59,196', P.trim, 2.2); k.line('M95,136 L101,196', P.trim, 2.2);
  k.path('M83,148 L73,166 L80,166 L75,182 L89,160 L82,160 L88,148 Z', P.trim, .9);
  // neck + collar
  k.path('M71,108 L89,108 L90,132 L70,132 Z', P.skin);
  k.path('M71,108 L89,108 L89,118 C84,122 76,122 71,118 Z', P.skinS, 0);
  k.path('M66,124 C72,128 88,128 94,124 L96,138 C88,142 72,142 64,138 Z', P.jacket);
  k.line('M65,137 C72,141 88,141 95,137', P.trim, 1.4);
  // --- head
  k.tf(0, dy, 1, () => {
    const face = 'M53,76 C53,100 60,112 70,117 C75,120 85,120 90,117 C100,112 107,100 107,76 C107,56 96,46 80,46 C64,46 53,56 53,76 Z';
    k.path(face, P.skin);
    // face shading (light from upper left)
    k.clip(face, () => { k.path('M107,70 C108,96 100,112 88,118 C98,108 101,92 99,70Z', P.skinS, 0); });
    drawFace(k, G, o);
    // fringe cast shadow on forehead
    const bangs = ['M52,64 C56,52 66,46 80,46 L66,84 L62,72 L58,86 Z', 'M64,56 C70,50 78,48 84,50 L78,88 L74,74 L70,86 Z', 'M80,50 C88,48 96,52 100,58 L92,86 L88,72 L84,84 Z', 'M96,56 C104,60 108,66 108,72 L102,88 L100,76 L96,84 Z'];
    k.clip(face, () => { k.tf(0, 3, 1, () => bangs.forEach(d => k.path(d, P.skinS, 0))); });
    // hair top + bangs
    k.path('M50,82 C46,52 60,36 80,36 C100,36 114,52 110,82 C104,70 96,62 80,62 C64,62 56,70 50,82 Z', P.hair, 0); k.line('M50,82 C46,52 60,36 80,36 C100,36 114,52 110,82', P.line, 1.1);
    bangs.forEach(d => k.path(d, P.hair));
    k.path('M52,70 C48,86 48,104 52,118 C54,104 56,92 58,84 Z', P.hair);
    k.path('M108,70 C112,86 112,104 108,118 C106,104 104,92 102,84 Z', P.hair);
    k.line('M60,52 C66,46 76,44 86,45', P.hairH, 2); k.line('M92,48 l4,2', P.hairH, 1.4);
    k.line('M70,60 L68,78', P.hairS, .9); k.line('M88,58 L86,76', P.hairS, .9);
    // ahoge
    const a = sw * .8;
    k.path(`M80,38 C78,28 ${84 + a * .4},22 ${92 + a},24 C${86 + a * .5},26 83,30 84,38 Z`, P.hair);
    // hair ties + clip
    [[48, 58], [112, 58]].forEach(([x, y]) => { k.path(`M${x - 5},${y} a5,6 0 1,0 10,0 a5,6 0 1,0 -10,0`, P.blue); k.circ(x - 1.5, y - 2.5, 1.2, P.white); });
    k.path('M99,64 L94,72 L98,72 L95,79 L103,69 L99,69 L102,64 Z', P.trim, .8);
    // brows & fx over hair
    drawBrow(k, G, 0, o); drawBrow(k, G, 1, o);
    drawFx(k, G, o);
  });
}

// ----------- kids -----------
function kidFace(k, G, o, faceD) {
  const P = k.P;
  k.path(faceD, P.skin);
  k.clip(faceD, () => { k.path(G.shade, P.skinS, 0); });
  drawFace(k, G, o);
}

const PAL_RAIKA = Object.assign({ line: '#3a2030', skin: '#ffeadf', skinS: '#f3c3ad', blush: '#f9a2aa', blushD: '#ee7f92', hair: '#ffd966', hairS: '#e8a73a', hairD: '#bf7a2a', hairH: '#fff4c2', brow: '#7e4214',
  iris: '#46a0f5', irisD: '#1f46a6', irisL: '#9bd2ff', pupil: '#171a44', jacket: '#f7f5ff', jacketS: '#c6c2e6', trim: '#ffc62a', trimS: '#d9921c', blue: '#2f58d8', blueS: '#1f3a9e' }, COMMON);

function drawRaika(k, o) {
  const P = k.P, sw = o.sway, dy = o.dy;
  const G = { ex: [62, 98], ey: 86, hs: 1.08, mx: 80, my: 103, ms: 1.15, by: 73, cy: 99, cx: 25, bw: 6, bh: 3, nose: 94, fxx: 116, fxy: 66, veinX: 106, veinY: 52, happyW: 7.5,
    shade: 'M118,70 C120,96 106,114 86,119 C104,110 111,94 108,70Z' };
  const face = 'M42,80 C42,52 58,40 80,40 C102,40 118,52 118,80 C118,102 104,118 80,119 C56,118 42,102 42,80 Z';
  // pigtails
  k.tf(0, dy, 1, () => {
    const t = (sx) => { const m = sx; const X = v => 80 + m * (v - 80);
      return `M${X(52)},44 C${X(26)},46 ${X(14 + (-sw) * m * -1)},78 ${X(16)},104 C${X(17)},120 ${X(24 + sw * m)},130 ${X(30 + sw * m * 1.4)},138 C${X(36)},128 ${X(34)},116 ${X(40)},104 C${X(44)},90 ${X(46)},70 ${X(54)},58 Z`; };
    k.path(t(1), P.hair); k.path(t(-1), P.hair);
    k.line(`M${38},60 C26,76 24,100 ${28 + sw * .4},128`, P.hairS, 1.3); k.line(`M${122},60 C134,76 136,100 ${132 + sw * .4},128`, P.hairS, 1.3);
    k.line('M30,66 C22,82 22,100 25,116', P.hairH, 1); k.line('M130,66 C138,82 138,100 135,116', P.hairH, 1);
    k.path('M44,86 C42,50 60,36 80,36 C100,36 118,50 116,86 L110,112 L50,112 Z', P.hairS, 0);
  });
  // body: small shoulders, white jacket over blue tee
  k.path('M40,196 C38,158 44,140 62,133 L98,133 C116,140 122,158 120,196 Z', P.jacket);
  k.path('M100,140 C112,146 118,160 120,196 L108,196 C108,172 106,152 100,140 Z', P.jacketS, 0);
  k.path('M60,134 L100,134 L104,196 L56,196 Z', P.blue);
  k.path('M82,134 L100,134 L104,196 L86,196 Z', P.blueS, 0);
  k.line('M60,136 L56,196', P.trim, 2); k.line('M100,136 L104,196', P.trim, 2);
  k.path('M82,152 L74,166 L80,166 L76,180 L88,162 L82,162 L87,152 Z', P.trim, .8);
  k.line('M44,160 C43,172 43,184 43,194', P.line, 1); k.line('M116,160 C117,172 117,184 117,194', P.line, 1);
  // neck
  k.path('M72,112 L88,112 L89,133 L71,133 Z', P.skin);
  k.path('M72,112 L88,112 L88,121 C84,124 76,124 72,121 Z', P.skinS, 0);
  k.path('M64,128 C72,133 88,133 96,128 L98,139 C88,144 72,144 62,139 Z', P.jacket);
  k.line('M63,138 C72,143 88,143 97,138', P.trim, 1.3);
  k.tf(0, dy, 1, () => {
    k.path(face, P.skin);
    k.clip(face, () => { k.path(G.shade, P.skinS, 0); });
    drawFace(k, G, o);
    const bangs = ['M44,70 C46,54 62,46 80,46 L70,76 L64,64 L58,80 L50,86 Z', 'M64,50 C72,46 84,46 92,48 L88,80 L82,66 L76,82 L72,66 Z', 'M84,48 C96,46 108,52 116,66 L110,86 L104,72 L98,82 L94,68 Z'];
    k.clip(face, () => { k.tf(0, 3, 1, () => bangs.forEach(d => k.path(d, P.skinS, 0))); });
    k.path('M42,84 C38,52 56,32 80,32 C104,32 122,52 118,84 C112,70 100,60 80,60 C60,60 48,70 42,84 Z', P.hair, 0); k.line('M42,84 C38,52 56,32 80,32 C104,32 122,52 118,84', P.line, 1.1);
    bangs.forEach(d => k.path(d, P.hair));
    k.path('M42,74 C38,92 38,108 42,122 C46,110 48,96 50,84 Z', P.hair);
    k.path('M118,74 C122,92 122,108 118,122 C114,110 112,96 110,84 Z', P.hair);
    k.line('M56,46 C64,40 74,38 86,39', P.hairH, 2); k.line('M96,42 l5,2', P.hairH, 1.3);
    k.line('M72,56 L70,70', P.hairS, .9); k.line('M92,54 L90,68', P.hairS, .9);
    const a = sw * .9;
    k.path(`M80,34 C78,26 ${83 + a * .4},20 ${90 + a},23 C${84 + a * .5},24 83,28 85,34 Z`, P.hair);
    [[42, 46], [118, 46]].forEach(([x, y]) => { k.path(`M${x - 5},${y} a5,6 0 1,0 10,0 a5,6 0 1,0 -10,0`, P.blue); k.circ(x - 1.5, y - 2.5, 1.2, P.white); });
    k.path('M101,52 L97,60 L101,60 L98,67 L106,57 L102,57 L105,52 Z', P.trim, .7);
    drawBrow(k, G, 0, o); drawBrow(k, G, 1, o);
    drawFx(k, G, o);
  });
}

const PAL_SOU = Object.assign({ line: '#33202a', skin: '#ffe6d6', skinS: '#f0bda6', blush: '#f7a39e', blushD: '#ea8084', hair: '#8f5f3e', hairS: '#6d4429', hairD: '#4a2c1b', hairH: '#c18a62', brow: '#4a2c1b',
  iris: '#a8703d', irisD: '#5e3519', irisL: '#e0a566', pupil: '#2a1810', sweater: '#9cc8f5', sweaterS: '#6c9bdd', sweaterD: '#4a74b8', trim: '#ffc62a', trimS: '#d9921c', collar: '#f7f5ff', collarS: '#c6c2e6' }, COMMON);

function drawSou(k, o) {
  const P = k.P, sw = o.sway, dy = o.dy;
  const G = { ex: [62, 98], ey: 90, hs: 1.12, mx: 80, my: 106, ms: 1.1, by: 77, cy: 102, cx: 26, bw: 6, bh: 3, nose: 98, fxx: 116, fxy: 70, veinX: 104, veinY: 58, happyW: 7.5,
    shade: 'M118,74 C120,98 106,116 86,120 C104,112 111,96 108,74Z' };
  const face = 'M41,84 C41,56 58,44 80,44 C102,44 119,56 119,84 C119,104 104,120 80,121 C56,120 41,104 41,84 Z';
  k.tf(0, dy, 1, () => { k.path('M42,88 C38,56 56,36 80,36 C104,36 122,56 118,88 L112,110 L48,110 Z', P.hairS, 0); });
  // sweater body (small narrow shoulders)
  k.path('M44,196 C42,160 46,142 64,135 L96,135 C114,142 118,160 116,196 Z', P.sweater);
  k.path('M98,142 C110,148 114,162 116,196 L104,196 C104,172 102,152 98,142 Z', P.sweaterS, 0);
  k.path('M62,136 C70,143 90,143 98,136 L94,128 L66,128 Z', P.skinS, 0);
  [[50, 168], [110, 168]].forEach(([x, y]) => k.line(`M${x},${y} q${x < 80 ? -2 : 2},12 ${x < 80 ? 0 : 0},26`, P.sweaterD, 1));
  k.line('M54,176 L106,176', P.sweaterD, 1.2); k.line('M52,184 L108,184', P.sweaterS, 1);
  k.path('M82,152 L74,164 L80,164 L76,176 L88,160 L82,160 L86,152 Z', P.trim, .8);
  // neck + round collar
  k.path('M72,114 L88,114 L89,135 L71,135 Z', P.skin);
  k.path('M72,114 L88,114 L88,123 C84,126 76,126 72,123 Z', P.skinS, 0);
  k.path('M62,132 C72,141 88,141 98,132 L100,141 C88,148 72,148 60,141 Z', P.collar);
  k.line('M61,140 C72,147 88,147 99,140', P.collarS, 1);
  k.tf(0, dy, 1, () => {
    k.path(face, P.skin);
    k.clip(face, () => { k.path(G.shade, P.skinS, 0); });
    drawFace(k, G, o);
    const bangs = ['M43,76 C44,56 60,46 80,46 L72,70 L64,62 L56,82 L48,90 Z', 'M70,48 C82,44 96,46 108,52 L102,74 L94,62 L86,78 L80,62 Z', 'M96,50 C110,52 118,64 118,82 L114,92 L108,78 L104,70 Z'];
    k.clip(face, () => { k.tf(0, 3, 1, () => bangs.forEach(d => k.path(d, P.skinS, 0))); });
    k.path('M40,88 C36,54 56,34 80,34 C104,34 124,54 120,88 C114,72 100,62 80,62 C60,62 46,72 40,88 Z', P.hair, 0); k.line('M40,88 C36,54 56,34 80,34 C104,34 124,54 120,88', P.line, 1.1);
    bangs.forEach(d => k.path(d, P.hair));
    k.path('M40,78 C36,94 38,108 44,118 C46,104 48,94 52,86 Z', P.hair);
    k.path('M120,78 C124,94 122,108 116,118 C114,104 112,94 108,86 Z', P.hair);
    k.line('M54,46 C62,40 76,38 88,40', P.hairH, 2); k.line('M96,44 l5,3', P.hairH, 1.3);
    k.line('M76,58 L72,72', P.hairS, .9); k.line('M94,56 L92,70', P.hairS, .9);
    // cowlick tuft
    const a = sw * .8;
    k.path(`M74,36 C72,28 ${78 + a * .3},22 ${86 + a},24 C${80 + a * .4},26 ${79},30 82,37 Z`, P.hair);
    k.path(`M86,35 C88,29 ${94 + a * .3},26 ${98 + a},28 C${94 + a * .4},30 ${92},33 ${92},37 Z`, P.hair);
    drawBrow(k, G, 0, o); drawBrow(k, G, 1, o);
    drawFx(k, G, o);
  });
}

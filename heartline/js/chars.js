/* HEARTLINE AGENCY — character sprites, VN art style.
   Realistic anime proportions, strand-built hair, detailed eyes, thin lineart, cel shading. */
const CharArt = (() => {
  const LN = '#4a2430';                  // lineart
  const f = n => n.toFixed(1);
  const mx = p => [400 - p[0], p[1]];

  // ---------- geometry helpers ----------
  const bez = (a, b, c, d, t) => { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; };
  const bezd = (a, b, c, d, t) => { const u = 1 - t; return [3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]), 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1])]; };
  // A lock of hair: a tapered ribbon along a cubic bezier.
  // prof: 'taper' (full at root → point), 'leaf' (thin root, swell, point), 'blunt' (swell then flat cut)
  function lockD(o) {
    const [a, b, c, d] = o.p, N = 20, Lp = [], Rp = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, p = bez(a, b, c, d, t), dv = bezd(a, b, c, d, t), len = Math.hypot(dv[0], dv[1]) || 1, nx = -dv[1] / len, ny = dv[0] / len;
      let k;
      if (o.prof === 'leaf') k = Math.pow(Math.sin(Math.PI * Math.pow(t, .55)), .8);
      else if (o.prof === 'blunt') k = Math.min(1, .35 + t * 2.2) * (1 - t * .15);
      else k = (o.end || 0) + (1 - (o.end || 0)) * Math.pow(1 - t, o.k || .85);
      const w = o.w / 2 * k;
      Lp.push(`${f(p[0] + nx * w)},${f(p[1] + ny * w)}`); Rp.push(`${f(p[0] - nx * w)},${f(p[1] - ny * w)}`);
    }
    return 'M' + Lp.join(' L') + ' L' + Rp.reverse().join(' L') + 'Z';
  }
  const L = (a, b, c, d, w, prof = 'taper', k, end) => ({ p: [a, b, c, d], w, prof, k, end });
  const mirrorLocks = arr => arr.map(o => Object.assign({}, o, { p: o.p.map(mx) }));
  function locks(arr, c, id) {
    return arr.map(o => `<path d="${lockD(o)}" fill="url(#hr-${id})" stroke="${c.hairL}" stroke-width="1.1" stroke-linejoin="round"/>`
      + `<path d="M${o.p[0]} C${o.p[1]} ${o.p[2]} ${o.p[3]}" fill="none" stroke="${c.hairS}" stroke-width="${o.w > 30 ? 1.3 : .9}" opacity=".45" stroke-dasharray="${o.w > 30 ? '0 12 400' : '0 6 400'}"/>`).join('');
  }
  const ring = c => {
    const y = x => 86 - Math.sin((x - 146) / 108 * Math.PI) * 19, top = [], bot = [];
    for (let i = 0, x = 146; x <= 254; x += 6, i++) { top.push(`${x},${f(y(x) - 4)}`); bot.unshift(`${x},${f(y(x) + (i % 2 ? 10 : 3) + (i % 4 === 1 ? 4 : 0))}`); }
    return `<path d="M${top.join(' L')} L${bot.join(' L')}Z" fill="${c.hairH}" opacity=".7"/><path d="M164,72 Q178,66 190,65" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
  };
  const cap = id => `<path d="M136,130 C128,62 164,34 200,34 C236,34 272,62 264,130 C250,98 230,82 200,82 C170,82 150,98 136,130Z" fill="url(#hr-${id})"/>`;
  const P = (d, fill, sw = 1.8, extra = '') => `<path d="${d}" fill="${fill}" stroke="${LN}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
  const sh = (d, col, op = 1) => `<path d="${d}" fill="${col}" opacity="${op}"/>`;
  const fold = (d, col, w = 1.3, op = .7) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
  const M = s => `<g transform="translate(400,0) scale(-1,1)">${s}</g>`;

  const TORSO = 'M188,226 C160,236 128,240 110,254 C96,266 94,292 98,322 C102,356 124,388 138,414 C144,440 132,470 128,510 L122,720 L278,720 L272,510 C268,470 256,440 262,414 C276,388 298,356 302,322 C306,292 304,266 290,254 C272,240 240,236 212,226 Z';
  const TORSO_SHADE = 'M290,254 C304,266 306,292 302,322 C298,356 276,388 262,414 C256,440 268,470 272,510 L278,720 L246,720 C250,600 252,520 246,470 C240,420 262,380 276,340 C286,310 288,280 280,258Z';
  const chest = col => fold('M146,318 Q170,344 196,332', col, 1.4, .55) + fold('M254,318 Q230,344 204,332', col, 1.4, .55);

  // ---------- characters ----------
  const CH = {
    hikari: {
      skin: '#fde9df', skinS: '#f1c0b0', eye: '#3aa6ff', eyeD: '#123b8c', eyeL: '#c0f0ff',
      hair: '#ffd566', hairS: '#e3982c', hairH: '#fff6d2', hairL: '#a3601c',
      sleeve: '#f7f8ff', sleeveS: '#d5d9f0', cuff: '#ffc21a', hand: '#2b4fd6',
      back(c, id) {
        const tail = [L([142, 74], [96, 84], [66, 190], [74, 330], 46), L([142, 76], [110, 120], [92, 260], [104, 420], 40), L([140, 74], [80, 100], [46, 240], [54, 390], 30),
          L([142, 78], [120, 150], [118, 320], [92, 470], 30), L([140, 80], [100, 140], [70, 330], [70, 520], 26), L([142, 80], [126, 190], [132, 360], [118, 545], 20)];
        return locks([...tail, ...mirrorLocks(tail)], c, id) + locks([L([164, 80], [140, 120], [134, 180], [144, 232], 50), L([236, 80], [260, 120], [266, 180], [256, 232], 50)], c, id);
      },
      body(c) {
        const jacket = 'M188,226 C160,236 128,240 110,254 C96,266 94,292 98,322 C102,356 124,388 138,414 C144,440 132,470 128,510 L124,560 L170,556 L172,420 C174,360 168,300 176,248 Z';
        return P(TORSO, '#2b4fd6') + sh(TORSO_SHADE, '#1a338f', .7) + chest('#16287a')
          + `<polygon points="206,280 188,312 200,312 192,342 216,304 203,304 212,280" fill="#ffd54a" stroke="${LN}" stroke-width="1.4"/>`
          + P('M134,468 L266,468 L268,488 L132,488Z', '#262a40', 1.5) + P('M188,466 L212,466 L212,490 L188,490Z', '#ffd54a', 1.5)
          + P('M126,556 L198,560 L194,720 L132,720Z', c.skin) + P('M274,556 L202,560 L206,720 L268,720Z', c.skin) + sh('M200,560 L206,720 L196,720Z', c.skinS, .8)
          + P(jacket, '#f7f8ff') + M(P(jacket, '#f7f8ff'))
          + sh('M110,254 C96,266 94,292 98,322 C102,356 120,386 132,406 L142,384 C122,352 112,300 120,262Z', '#dfe2f4') + sh('M290,254 C304,266 306,292 302,322 C298,356 280,386 268,406 C262,440 272,480 276,556 L254,556 C250,480 250,440 256,404 C270,376 284,340 286,300 C287,280 285,264 278,256Z', '#d2d6ee', .9)
          + fold('M176,248 C168,300 174,360 172,420 L168,556', '#ffc21a', 3.5, 1) + fold('M224,248 C232,300 226,360 228,420 L232,556', '#ffc21a', 3.5, 1)
          + fold('M150,420 Q156,480 150,540', '#c5cae6') + fold('M252,430 Q246,490 254,545', '#b8bee0') + fold('M128,300 Q140,330 136,370', '#c5cae6')
          + P('M174,206 C182,222 218,222 226,206 L234,236 C216,252 184,252 166,236 Z', '#f7f8ff', 1.6) + fold('M168,236 C184,250 216,250 232,236', '#ffc21a', 2.5, 1)
          + fold('M180,214 L186,238 M220,214 L214,238', '#cfd3ea', 1.2);
      },
      front(c, id) {
        const side = [L([146, 92], [132, 140], [132, 192], [146, 240], 22), L([152, 96], [142, 132], [146, 172], [156, 198], 16)];
        const bangs = [L([196, 44], [164, 50], [138, 76], [134, 112], 24, 'leaf'), L([204, 44], [236, 50], [262, 76], [266, 112], 24, 'leaf'),
          L([196, 44], [178, 60], [160, 90], [146, 126], 34, 'leaf'), L([208, 46], [232, 58], [248, 90], [254, 126], 34, 'leaf'),
          L([200, 44], [190, 64], [180, 94], [172, 122], 32, 'leaf'), L([206, 44], [214, 68], [222, 96], [224, 118], 32, 'leaf'), L([202, 44], [200, 70], [198, 98], [198, 130], 28, 'leaf')];
        const tie = `<ellipse cx="142" cy="76" rx="9" ry="12" fill="#2b4fd6" stroke="${LN}" stroke-width="1.4"/><path d="M137,70 q5,6 0,12" stroke="#5f82ff" stroke-width="1.5" fill="none"/>`;
        return cap(id) + locks([...side, ...mirrorLocks(side), ...bangs, L([204, 42], [204, 14], [236, 4], [240, 24], 9, 'leaf')], c, id) + ring(c) + tie + M(tie)
          + `<polygon points="258,82 248,100 255,100 249,114 264,94 257,94 263,82" fill="#fff26a" stroke="#2b4fd6" stroke-width="1.6"/>`;
      }
    },
    rei: {
      skin: '#fcebe6', skinS: '#e9c3bc', eye: '#b27bff', eyeD: '#3a1670', eyeL: '#f0dcff',
      hair: '#342a4e', hairS: '#15101f', hairH: '#8a78c4', hairL: '#08060d',
      sleeve: '#1b1826', sleeveS: '#0e0c14', cuff: '#a978ff', hand: '#121018',
      back(c, id) {
        const bk = [L([150, 70], [118, 220], [110, 460], [100, 700], 64, 'taper', .3, .55), L([176, 64], [150, 240], [150, 480], [146, 700], 60, 'taper', .3, .55),
          L([200, 62], [196, 260], [200, 500], [198, 700], 60, 'taper', .3, .55)];
        return `<path d="M140,80 C118,130 106,210 102,310 C98,430 94,570 88,700 L312,700 C306,570 302,430 298,310 C294,210 282,130 260,80Z" fill="url(#hr-${id})"/>`
          + locks([...bk, ...mirrorLocks(bk.slice(0, 2))], c, id) + fold('M250,110 C272,220 278,440 292,660', '#6d58a8', 2.5, .6);
      },
      body(c) {
        return P(TORSO, '#1b1826') + sh(TORSO_SHADE, '#0b0a11', .8) + chest('#3a3452')
          + `<g fill="none" stroke="#b58aff" stroke-width="2.2" filter="url(#glowP)"><path d="M130,300 L152,334 L152,452 M270,300 L248,334 L248,452 M152,396 L248,396"/></g>`
          + P('M134,468 L266,468 L268,486 L132,486Z', '#2a2540', 1.5) + `<circle cx="200" cy="477" r="7" fill="#a978ff" stroke="${LN}" stroke-width="1.4"/>`
          + fold('M162,560 L166,720 M238,560 L234,720', '#3a3452', 1.4) + fold('M200,500 L200,720', '#07060a', 2, .8)
          + P('M180,200 L220,200 L224,232 C210,238 190,238 176,232 Z', '#1b1826', 1.5) + fold('M178,214 L222,214', '#a978ff', 1.6, .9)
          + P('M154,224 C178,252 222,252 246,224 L256,244 C232,284 168,284 144,244 Z', '#4b2e7c') + sh('M246,224 L256,244 C240,270 214,280 196,278 C220,268 238,250 246,224Z', '#301a55')
          + fold('M160,242 C184,262 216,262 240,242', '#6b48a8', 1.4) + fold('M170,256 C190,268 212,268 232,256', '#2c1850', 1.2)
          + P('M224,258 C250,300 264,380 254,470 L232,474 C238,392 226,322 204,266Z', '#4b2e7c') + sh('M244,300 C256,350 258,410 252,468 L240,470 C246,410 244,350 236,306Z', '#301a55')
          + fold('M236,476 l-2,12 M242,475 l0,12 M248,474 l2,11', '#4b2e7c', 2.2, 1);
      },
      front(c, id) {
        const side = [L([142, 88], [138, 150], [136, 210], [138, 272], 30, 'taper', .2, .8), L([152, 92], [150, 140], [150, 190], [152, 226], 18, 'taper', .2, .7)];
        const tips = [[146, 118], [164, 121], [182, 118], [200, 121], [218, 118], [236, 121], [254, 118]];
        const bangs = tips.map(([x, y]) => L([200 + (x - 200) * .25, 40], [200 + (x - 200) * .6, 56], [x, 84], [x, y], 26, 'blunt'));
        return cap(id) + locks([...side, ...mirrorLocks(side), ...bangs], c, id) + ring(c)
          + `<g stroke="${LN}" stroke-width="1.4"><rect x="240" y="80" width="28" height="5" rx="2.5" fill="#a978ff" transform="rotate(-28 254 82)"/><rect x="240" y="80" width="28" height="5" rx="2.5" fill="#7a52c0" transform="rotate(22 254 82)"/></g>`;
      }
    },
    mira: {
      skin: '#fff0e9', skinS: '#f4cbbd', eye: '#22c3a3', eyeD: '#0b5a55', eyeL: '#c8fff0',
      hair: '#ffcfe0', hairS: '#e88fb2', hairH: '#fff6fa', hairL: '#b0527a',
      sleeve: '#fbfdff', sleeveS: '#dfe6f0', cuff: '#63c8bb', hand: '#fff0e9',
      back(c, id) {
        const bk = [L([150, 70], [88, 200], [142, 320], [102, 452], 58), L([176, 64], [120, 220], [162, 342], [130, 472], 52), L([200, 64], [190, 220], [210, 360], [196, 470], 50)];
        return `<path d="M136,86 C104,160 96,260 100,350 C104,400 112,430 120,450 L280,450 C288,430 296,400 300,350 C304,260 296,160 264,86Z" fill="url(#hr-${id})"/>`
          + locks([...bk, ...mirrorLocks(bk.slice(0, 2))], c, id);
      },
      body(c) {
        const coat = 'M188,232 C160,238 128,240 110,254 C96,266 94,292 98,322 C102,356 120,388 128,420 C124,520 116,620 110,720 L176,720 L180,420 C176,340 170,280 180,248Z';
        return P(TORSO, '#63c8bb') + sh(TORSO_SHADE, '#3c9a8f', .7) + chest('#2e8a80')
          + fold('M184,270 L184,420 M192,270 L192,440 M200,268 L200,440 M208,270 L208,440 M216,270 L216,420', '#4fb2a6', 1, .6)
          + P('M152,470 L248,470 L262,610 L138,610Z', '#3a3f5a') + fold('M176,480 L168,606 M224,480 L232,606', '#262a3e', 1.4)
          + P('M142,610 L196,610 L192,720 L146,720Z', c.skin) + P('M258,610 L204,610 L208,720 L254,720Z', c.skin)
          + P(coat, '#fbfdff') + M(P(coat, '#fbfdff'))
          + sh('M110,254 C96,266 94,292 98,322 C102,356 118,386 124,410 L134,390 C118,350 110,300 118,262Z', '#e6ecf4') + sh('M290,254 C304,266 306,292 302,322 C298,356 280,388 272,420 C276,520 284,620 290,720 L240,720 C232,600 228,480 226,420 C228,340 240,290 222,248Z', '#dde4ee', .95)
          + P('M180,248 L162,302 L178,330 L186,256Z', '#eef2f8', 1.4) + M(P('M180,248 L162,302 L178,330 L186,256Z', '#eef2f8', 1.4))
          + P('M130,470 L166,470 L166,500 L130,500Z', '#f4f7fb', 1.2) + `<rect x="152" y="460" width="3" height="18" fill="#26c6a6"/>`
          + fold('M140,540 Q146,600 136,680', '#cfd8e4') + fold('M258,520 Q252,600 264,690', '#c3cde0')
          + P('M180,196 L220,196 L224,232 C210,240 190,240 176,232Z', '#63c8bb', 1.5) + fold('M178,206 L222,206 M177,216 L223,216 M176,226 L224,226', '#3c9a8f', 1.1, .8)
          + fold('M188,236 L232,360 M212,236 L236,360', '#26c6a6', 1.6, 1) + P('M222,358 L250,358 L250,392 L222,392Z', '#fff', 1.3) + `<rect x="222" y="358" width="28" height="8" fill="#26c6a6"/><rect x="227" y="371" width="12" height="14" rx="2" fill="#ffcfe0"/><rect x="241" y="373" width="6" height="2" fill="#aab"/><rect x="241" y="378" width="6" height="2" fill="#aab"/>`;
      },
      front(c, id) {
        const side = [L([144, 96], [122, 170], [150, 240], [124, 330], 26), L([150, 100], [140, 180], [166, 250], [150, 300], 18)];
        const bangs = [L([210, 42], [176, 44], [142, 70], [134, 106], 24, 'leaf'), L([214, 42], [190, 56], [164, 86], [140, 118], 36, 'leaf'), L([218, 44], [200, 64], [180, 96], [168, 124], 32, 'leaf'),
          L([222, 44], [214, 70], [202, 100], [196, 126], 30, 'leaf'), L([226, 46], [232, 72], [232, 100], [228, 122], 28, 'leaf'), L([230, 48], [252, 64], [262, 92], [264, 120], 28, 'leaf')];
        return cap(id) + locks([...side, ...mirrorLocks(side), ...bangs], c, id) + ring(c)
          + `<path d="M130,140 C124,64 276,64 270,140" fill="none" stroke="#3b3f4f" stroke-width="5"/><path d="M134,120 C136,80 170,62 200,62" fill="none" stroke="#6a7084" stroke-width="1.5"/>`
          + `<ellipse cx="132" cy="146" rx="10" ry="14" fill="#3b3f4f" stroke="${LN}" stroke-width="1.4"/><circle cx="132" cy="146" r="4.5" fill="#26c6a6" class="blinkl"/>`
          + `<path d="M134,158 Q144,190 172,194" fill="none" stroke="#3b3f4f" stroke-width="2.6"/><rect x="170" y="190" width="10" height="7" rx="3" fill="#3b3f4f"/>`
          + `<path d="M252,90 h12 m-6,-6 v12" stroke="#26c6a6" stroke-width="4" stroke-linecap="round"/>`;
      }
    },
    aya: {
      skin: '#fbe5da', skinS: '#e6b5a3', eye: '#e6a03a', eyeD: '#6a2a0a', eyeL: '#ffe7a8',
      hair: '#c42e3a', hairS: '#6a0f1e', hairH: '#ff9a9a', hairL: '#420610', glasses: true,
      sleeve: '#23222c', sleeveS: '#131218', cuff: '#f4f4f8', hand: '#fbe5da',
      back(c, id) {
        return locks([L([236, 58], [310, 40], [332, 160], [318, 300], 50), L([238, 60], [296, 80], [312, 220], [300, 380], 40), L([240, 62], [326, 70], [352, 200], [342, 330], 30),
          L([234, 62], [280, 120], [292, 260], [268, 420], 26), L([164, 80], [140, 120], [138, 180], [148, 226], 46), L([236, 80], [258, 120], [262, 180], [252, 226], 46)], c, id);
      },
      body(c) {
        const lapel = P('M180,234 L150,300 L170,314 L160,328 L196,382 L200,362Z', '#2e2d38', 1.5);
        return P(TORSO, '#23222c') + sh(TORSO_SHADE, '#101016', .85) + chest('#3a3946')
          + P('M186,226 L214,226 L224,236 L200,362 L176,236Z', '#f6f6fa', 1.5) + sh('M214,226 L224,236 L200,362 L206,300Z', '#dcdce6')
          + P('M186,224 L174,246 L196,242Z', '#fff', 1.3) + P('M214,224 L226,246 L204,242Z', '#fff', 1.3)
          + P('M194,240 L207,240 L205,254 L196,254Z', '#c62030', 1.4) + P('M196,254 L205,254 L214,338 L203,362 L191,340Z', '#c62030', 1.4)
          + fold('M201,258 L206,338', '#ff5a64', 1.4, .8) + sh('M205,254 L214,338 L203,362 L207,300Z', '#8e1420', .8)
          + lapel + M(lapel) + `<circle cx="200" cy="420" r="4" fill="#111" stroke="#555"/><circle cx="200" cy="452" r="4" fill="#111" stroke="#555"/>`
          + `<circle cx="250" cy="296" r="6" fill="#ffd54a" stroke="${LN}" stroke-width="1.3"/>` + fold('M150,400 Q160,440 150,490', '#3a3946') + fold('M250,400 Q242,440 252,490', '#050508')
          + fold('M200,500 L200,720', '#0c0c10', 2, .9);
      },
      front(c, id) {
        const bangs = [L([192, 42], [232, 48], [262, 72], [268, 106], 24, 'leaf'), L([188, 42], [210, 56], [236, 86], [258, 118], 36, 'leaf'), L([184, 42], [196, 64], [212, 96], [222, 124], 32, 'leaf'),
          L([180, 42], [180, 68], [186, 98], [190, 126], 30, 'leaf'), L([176, 44], [164, 70], [160, 100], [164, 120], 28, 'leaf'), L([172, 46], [150, 62], [138, 90], [138, 120], 26, 'leaf')];
        return cap(id) + locks([L([144, 92], [128, 160], [134, 230], [128, 300], 24), L([256, 92], [266, 140], [262, 180], [254, 212], 18), ...bangs], c, id) + ring(c)
          + `<ellipse cx="238" cy="60" rx="7" ry="9" fill="#111" stroke="${LN}" stroke-width="1.3"/>`;
      }
    }
  };

  // ---------- arms ----------
  const ARMS = {
    idle: [[118, 262], [104, 378], [110, 480]], hip: [[118, 262], [64, 372], [132, 432]], cross: [[118, 262], [118, 372], [244, 350]],
    shy: [[118, 262], [124, 382], [184, 356]], wave: [[118, 262], [64, 214], [74, 122]], fist: [[118, 262], [58, 304], [88, 214]],
    point: [[118, 262], [66, 306], [12, 270]], think: [[118, 262], [118, 372], [182, 224]]
  };
  const POSES = {
    default: { l: 'idle', r: 'idle' }, hip: { l: 'hip', r: 'idle' }, hips: { l: 'hip', r: 'hip' }, wave: { l: 'idle', r: 'wave' },
    cross: { l: 'cross', r: 'cross' }, shy: { l: 'shy', r: 'shy' }, fist: { l: 'hip', r: 'fist' }, point: { l: 'idle', r: 'point' }, think: { l: 'cross', r: 'think' }
  };
  function tube(a, b, w0, w1) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
    return `M${f(a[0] + nx * w0 / 2)},${f(a[1] + ny * w0 / 2)} L${f(b[0] + nx * w1 / 2)},${f(b[1] + ny * w1 / 2)} L${f(b[0] - nx * w1 / 2)},${f(b[1] - ny * w1 / 2)} L${f(a[0] - nx * w0 / 2)},${f(a[1] - ny * w0 / 2)}Z`;
  }
  function arm(k, c) {
    const [s, e, w] = ARMS[k], up = tube(s, e, 38, 28), lo = tube(e, w, 28, 22);
    const ang = Math.atan2(w[1] - e[1], w[0] - e[0]) * 180 / Math.PI - 90;
    const fist = k === 'fist' || k === 'cross';
    const hand = fist
      ? `<path d="M-11,-2 C-13,10 -10,22 0,23 C10,22 13,10 11,-2Z" fill="${c.hand}" stroke="${LN}" stroke-width="1.6"/><path d="M-7,14 Q0,18 7,14 M-9,6 Q-3,9 2,6" fill="none" stroke="${LN}" stroke-width="1" opacity=".6"/>`
      : `<path d="M-9,-2 C-11,8 -10,20 -5,27 C-1,31 5,30 8,24 C11,16 10,6 9,-2Z" fill="${c.hand}" stroke="${LN}" stroke-width="1.6"/><path d="M-9,4 C-16,9 -15,16 -9,17" fill="${c.hand}" stroke="${LN}" stroke-width="1.4"/><path d="M-2,16 L-3,27 M3,16 L3,27" stroke="${LN}" stroke-width=".9" opacity=".5"/>`;
    const sil = `<path d="${up}"/><path d="${lo}"/><circle cx="${e[0]}" cy="${e[1]}" r="14"/><circle cx="${s[0]}" cy="${s[1]}" r="19"/>`;
    return `<g stroke="${LN}" stroke-width="3.6" stroke-linejoin="round" fill="${c.sleeve}">${sil}</g><g fill="${c.sleeve}">${sil}</g>`
      + `<path d="${tube([s[0] + 6, s[1]], [e[0] + 6, e[1]], 12, 8)}" fill="${c.sleeveS}" opacity=".85"/><path d="${tube([e[0] + 4, e[1]], [w[0] + 4, w[1]], 8, 6)}" fill="${c.sleeveS}" opacity=".85"/>`
      + fold(`M${e[0] - 8},${e[1] - 10} q8,6 14,0 M${e[0] - 6},${e[1] + 6} q7,5 12,-1`, c.sleeveS, 1.3, .9)
      + `<g transform="translate(${w[0]},${w[1]}) rotate(${f(ang)})"><rect x="-13" y="-8" width="26" height="9" rx="3" fill="${c.cuff}" stroke="${LN}" stroke-width="1.4"/>${hand}</g>`;
  }

  // ---------- face ----------
  const EMO = {
    neutral: { e: 'open', b: 'normal', m: 'small' }, smile: { e: 'open', b: 'normal', m: 'smile' },
    happy: { e: 'happy', b: 'raised', m: 'grin', fx: ['sparkle', 'blushlite'] }, sad: { e: 'sad', b: 'sad', m: 'frown' },
    angry: { e: 'determined', b: 'angry', m: 'shout', fx: ['anger'] }, pout: { e: 'narrow', b: 'angry', m: 'pout', fx: ['blushlite', 'anger'] },
    surprised: { e: 'wide', b: 'raised', m: 'o' }, shy: { e: 'soft', b: 'sad', m: 'wavy', fx: ['blush'], look: -3 },
    blush: { e: 'open', b: 'sad', m: 'smile', fx: ['blush'], look: 3 }, smug: { e: 'narrow', b: 'smug', m: 'cat' },
    determined: { e: 'determined', b: 'angry', m: 'flat' }, cry: { e: 'closed', b: 'sad', m: 'wavy', fx: ['tears', 'blushlite'] },
    scared: { e: 'wide', b: 'sad', m: 'wavy', fx: ['sweat'] }, think: { e: 'open', b: 'smug', m: 'flat', look: 4 },
    cold: { e: 'narrow', b: 'normal', m: 'flat' }, tender: { e: 'soft', b: 'sad', m: 'smile', fx: ['blushlite'] },
    love: { e: 'open', b: 'sad', m: 'grin', fx: ['blush', 'heart', 'sparkle'] }, laugh: { e: 'happy', b: 'raised', m: 'grin', fx: ['sparkle'] },
    sweat: { e: 'open', b: 'sad', m: 'smile', fx: ['sweat'] }
  };
  const EW = 'M-15,-1 C-12,-11 6,-15 16,-7 C18,2 12,10 1,11 C-9,11 -15,6 -15,-1Z';
  function eye(cx, cy, flip, type, c, id, look = 0) {
    const s = flip ? -1 : 1, ix = look * s;
    let g = `<g transform="translate(${cx},${cy}) scale(${s * 1.3},1.3)">`;
    const crease = `<path d="M-9,-15 Q4,-20 16,-13" fill="none" stroke="${c.skinS}" stroke-width="1.4" stroke-linecap="round"/>`;
    const wing = `<path d="M17,-8 L24,-11 L19,-4Z" fill="${LN}"/>`;
    if (type === 'happy') return g + `<path d="M-14,3 Q1,-10 16,1" fill="none" stroke="${LN}" stroke-width="2.6" stroke-linecap="round"/><path d="M15,1 L21,-2" stroke="${LN}" stroke-width="1.6"/><path d="M-8,6 Q2,9 10,5" fill="none" stroke="${c.skinS}" stroke-width="1.2"/></g>`;
    if (type === 'closed') return g + `<path d="M-14,-1 Q1,8 16,-2" fill="none" stroke="${LN}" stroke-width="2.5" stroke-linecap="round"/><path d="M14,0 L20,3 M9,3 L12,8 M2,4 L3,9" stroke="${LN}" stroke-width="1.2" stroke-linecap="round"/>${crease}</g>`;
    const wide = type === 'wide', rx = wide ? 7.5 : 9.5, ry = wide ? 9 : 11.5;
    g += `<g class="blink"><path d="${EW}" fill="#fff"/><g clip-path="url(#ec-${id})"><path d="${EW}" fill="url(#ew-${id})"/>`
      + `<ellipse cx="${ix}" cy="1" rx="${rx}" ry="${ry}" fill="url(#ir-${id})" stroke="${c.eyeD}" stroke-width="1.1"/>`
      + `<ellipse cx="${ix}" cy="2" rx="${wide ? 3 : 4.2}" ry="${wide ? 4 : 5.8}" fill="${c.eyeD}"/>`
      + `<path d="M${ix - 6.5},6 Q${ix},${wide ? 10 : 12} ${ix + 6.5},6" fill="none" stroke="${c.eyeL}" stroke-width="1.8" opacity=".85"/>`
      + `<path d="M-17,-16 L19,-16 L19,-6 C8,-11 -8,-10 -17,-2Z" fill="${c.eyeD}" opacity=".32"/>`
      + `<ellipse cx="${ix - 3.5}" cy="-4" rx="${wide ? 2.4 : 3}" ry="${wide ? 3 : 3.8}" fill="#fff"/><circle cx="${ix + 4}" cy="5" r="1.4" fill="#fff" opacity=".9"/></g>`;
    const lid = (skin, line) => `<path d="${skin}" fill="${c.skin}"/><path d="${line}" fill="none" stroke="${LN}" stroke-width="2.6" stroke-linecap="round"/>` + wing;
    if (type === 'narrow') g += lid('M-18,-22 L24,-22 L24,-5 C10,-4 -8,-2 -18,0Z', 'M-15,0 C-6,-3 8,-5 18,-6');
    else if (type === 'soft') g += `<path d="M-18,9 C-8,5 8,4 20,7 L20,16 L-18,16Z" fill="${c.skin}"/><path d="M-12,8 Q2,4 15,7" fill="none" stroke="${LN}" stroke-width="1.2" opacity=".7"/><path d="M-16,1 C-14,-10 4,-15 17,-8 L23,-10 C21,-8 20,-6 18,-3 C10,-11 -6,-10 -13,2 Z" fill="${LN}"/>`;
    else if (type === 'determined') g += lid('M-18,-22 L24,-22 L24,-11 L-18,1Z', 'M-15,1 L19,-10');
    else if (type === 'sad') g += lid('M-18,-22 L24,-22 L24,-3 C10,-8 -6,-11 -18,-8Z', 'M-15,-8 C-6,-11 10,-8 19,-3');
    else g += `<path d="M-16,1 C-14,-11 4,-17 17,-9 L24,-12 C21,-9 20,-7 18,-4 C10,-12 -6,-12 -13,2 Z" fill="${LN}"/><path d="M14,-10 L19,-15 M9,-12 L12,-17 M18,-7 L24,-8" stroke="${LN}" stroke-width="1.3" stroke-linecap="round"/><path d="M10,9 Q15,7 17,2" fill="none" stroke="${LN}" stroke-width="1.6" stroke-linecap="round"/>`;
    g += `<path d="M-9,10 Q2,13 12,8" fill="none" stroke="${LN}" stroke-width="1" opacity=".55"/>${type === 'open' || type === 'wide' ? crease : ''}</g>`;
    return g + '</g>';
  }
  function brow(cx, cy, flip, type, c) {
    const D = { normal: 'M-13,-24 Q3,-29 18,-24', raised: 'M-13,-31 Q3,-36 18,-30', angry: 'M-13,-19 Q3,-24 18,-29', sad: 'M-13,-30 Q3,-28 18,-21' };
    return `<path transform="translate(${cx},${cy - 4}) scale(${flip ? -1.25 : 1.25},1.25)" d="${D[type] || D.normal}" fill="none" stroke="${c.hairS}" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>`;
  }
  const MOUTH = {
    small: `<path d="M195,178 Q200,180 205,178" fill="none" stroke="${LN}" stroke-width="1.7" stroke-linecap="round"/>`,
    smile: `<path d="M192,176 Q200,183 208,176" fill="none" stroke="${LN}" stroke-width="1.8" stroke-linecap="round"/>`,
    grin: `<path d="M191,174 Q200,176 209,174 Q207,187 200,188 Q193,187 191,174Z" fill="#a8404c" stroke="${LN}" stroke-width="1.5"/><path d="M192,175 L208,175 L207,178 L193,178Z" fill="#fff"/><path d="M195,184 Q200,180 205,184 Q200,188 195,184Z" fill="#ff8e9c"/>`,
    o: `<ellipse cx="200" cy="180" rx="3.6" ry="4.6" fill="#a8404c" stroke="${LN}" stroke-width="1.5"/>`,
    frown: `<path d="M194,180 Q200,175 206,180" fill="none" stroke="${LN}" stroke-width="1.8" stroke-linecap="round"/>`,
    flat: `<path d="M195,178 L205,178" stroke="${LN}" stroke-width="1.8" stroke-linecap="round"/>`,
    cat: `<path d="M192,176 q4,4.5 8,0 q4,4.5 8,0" fill="none" stroke="${LN}" stroke-width="1.7" stroke-linecap="round"/>`,
    wavy: `<path d="M191,178 q2.25,-2.5 4.5,0 t4.5,0 t4.5,0 t4.5,0" fill="none" stroke="${LN}" stroke-width="1.6" stroke-linecap="round"/>`,
    shout: `<path d="M190,172 Q200,169 210,172 Q209,190 200,191 Q191,190 190,172Z" fill="#a8404c" stroke="${LN}" stroke-width="1.5"/><path d="M194,185 Q200,180 206,185 Q200,190 194,185Z" fill="#ff8e9c"/>`,
    pout: `<path d="M196,179 Q200,176 204,179" fill="none" stroke="${LN}" stroke-width="1.7" stroke-linecap="round"/><path d="M197,182 Q200,183.5 203,182" fill="none" stroke="#d98a92" stroke-width="1.3"/>`
  };
  const FX = {
    blush: `<ellipse cx="168" cy="163" rx="15" ry="6" fill="url(#bl)"/><ellipse cx="232" cy="163" rx="15" ry="6" fill="url(#bl)"/><g stroke="#e0527a" stroke-width="1.2" stroke-linecap="round" opacity=".8"><path d="M162,164 l3,-5 M168,164 l3,-5 M174,164 l3,-5 M222,164 l3,-5 M228,164 l3,-5 M234,164 l3,-5"/></g>`,
    blushlite: `<ellipse cx="168" cy="163" rx="14" ry="5" fill="url(#bl)" opacity=".6"/><ellipse cx="232" cy="163" rx="14" ry="5" fill="url(#bl)" opacity=".6"/>`,
    anger: `<g class="pulse" stroke="#e0283a" stroke-width="3" fill="none" stroke-linecap="round"><path d="M246,56 Q252,62 258,56 M246,72 Q252,66 258,72 M244,58 Q250,64 244,70 M260,58 Q254,64 260,70"/></g>`,
    sweat: `<path class="drip" d="M262,96 Q253,112 262,118 Q271,112 262,96Z" fill="#d4f0ff" stroke="#4d9fd6" stroke-width="1.6"/><path d="M259,108 q-1,4 2,6" stroke="#fff" stroke-width="1.5" fill="none"/>`,
    tears: `<g class="drip" stroke="#9fdcff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"><path d="M166,150 Q162,168 168,192"/><path d="M234,150 Q238,168 232,192"/></g>`,
    sparkle: `<g class="twinkle" fill="#fff6a8" stroke="#e8a826" stroke-width="1.2"><path d="M290,58 l4,11 l11,4 l-11,4 l-4,11 l-4,-11 l-11,-4 l11,-4z"/><path d="M112,92 l2.5,7 l7,2.5 l-7,2.5 l-2.5,7 l-2.5,-7 l-7,-2.5 l7,-2.5z"/></g>`,
    heart: `<path class="twinkle" d="M286,66 c-6,-10 -22,-4 -16,8 l16,14 l16,-14 c6,-12 -10,-18 -16,-8z" fill="#ff5d85" stroke="${LN}" stroke-width="1.5"/>`
  };

  function char(id, emo = 'neutral', pose = 'default', portrait = false) {
    const c = CH[id]; if (!c) return '';
    const e = EMO[emo] || EMO.neutral, p = POSES[pose] || POSES.default;
    const vb = portrait ? '118 28 164 182' : '0 0 400 720';
    let s = `<svg class="csvg" viewBox="${vb}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg"><defs>`
      + `<linearGradient id="ir-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.eyeD}"/><stop offset=".5" stop-color="${c.eye}"/><stop offset="1" stop-color="${c.eyeL}"/></linearGradient>`
      + `<linearGradient id="hr-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.hairH}"/><stop offset=".28" stop-color="${c.hair}"/><stop offset="1" stop-color="${c.hairS}"/></linearGradient>`
      + `<linearGradient id="ew-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a7aa8" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>`
      + `<radialGradient id="bl"><stop offset="0" stop-color="#ff6f94" stop-opacity=".7"/><stop offset="1" stop-color="#ff6f94" stop-opacity="0"/></radialGradient>`
      + `<clipPath id="ec-${id}"><path d="${EW}"/></clipPath>`
      + `<filter id="glowP"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g class="breathe">`;
    s += c.back(c, id);
    s += P('M186,176 L186,238 L214,238 L214,176Z', c.skin) + `<path d="M186,190 Q200,214 214,190 L214,206 Q200,226 186,206Z" fill="${c.skinS}"/>`;
    s += c.body(c);
    // head
    s += `<ellipse cx="138" cy="144" rx="6" ry="11" fill="${c.skin}" stroke="${LN}" stroke-width="1.6"/><ellipse cx="262" cy="144" rx="6" ry="11" fill="${c.skin}" stroke="${LN}" stroke-width="1.6"/>`;
    s += P('M139,112 C139,70 166,48 200,48 C234,48 261,70 261,112 C261,146 248,174 222,194 Q200,210 178,194 C152,174 139,146 139,112Z', c.skin, 2);
    s += sh('M139,106 Q200,134 261,106 L261,92 L139,92Z', c.skinS, .6) + sh('M261,112 C261,146 248,174 222,194 L224,184 C244,166 253,142 254,112Z', c.skinS, .5);
    s += `<path d="M202,158 l-2.5,5 l3,.8" fill="none" stroke="${c.skinS}" stroke-width="1.5" stroke-linecap="round"/><circle cx="198" cy="157" r="1.2" fill="#fff" opacity=".7"/>`;
    const look = e.look || 0;
    s += eye(173, 140, true, e.e, c, id, look) + eye(227, 140, false, e.e, c, id, look);
    (e.fx || []).forEach(k => { if (k.startsWith('blush')) s += FX[k]; });
    s += `<g class="mb">${MOUTH[e.m] || MOUTH.small}</g><g class="mt"><ellipse cx="200" cy="180" rx="4" ry="3.6" fill="#a8404c" stroke="${LN}" stroke-width="1.4"/></g>`;
    if (c.glasses) s += `<g fill="rgba(210,235,255,.14)" stroke="#2a1418" stroke-width="2"><rect x="155" y="122" width="42" height="30" rx="7"/><rect x="203" y="122" width="42" height="30" rx="7"/><path d="M197,134 Q200,131 203,134 M155,130 L140,128 M245,130 L260,128" fill="none"/></g><path d="M160,127 l12,-2" stroke="#fff" stroke-width="2" opacity=".6"/>`;
    const Ls = arm(p.l, c), Rs = M(arm(p.r, c));
    s += p.l === 'cross' ? Rs + Ls : Ls + Rs;
    s += c.front(c, id);
    const bl = e.b === 'smug' ? 'normal' : e.b, br = e.b === 'smug' ? 'raised' : e.b;
    s += brow(173, 140, true, bl, c) + brow(227, 140, false, br, c);
    (e.fx || []).forEach(k => { if (!k.startsWith('blush')) s += FX[k]; });
    return s + '</g></svg>';
  }
  return { char, CH };
})();

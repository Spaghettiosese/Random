/* HEARTLINE AGENCY — extra locations & cutscenes for chapters 5-12 and dates. */
(() => {
  const { svgWrap, grad, skyline, stars, rng, tree, shards, BG, CG, big } = Art._h;
  const bg = Art.bg;
  const lantern = (x, y, col, s = 1) => `<g class="sway" style="transform-origin:${x}px ${y - 30}px"><path d="M${x},${y - 30} v14" stroke="#222" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="${18 * s}" ry="${24 * s}" fill="${col}"/><ellipse cx="${x}" cy="${y}" rx="${40 * s}" ry="${46 * s}" fill="${col}" opacity=".25" filter="url(#bl20)"/><rect x="${x - 8 * s}" y="${y - 26 * s}" width="${16 * s}" height="5" fill="#222"/><rect x="${x - 8 * s}" y="${y + 21 * s}" width="${16 * s}" height="5" fill="#222"/><path d="M${x - 14 * s},${y} h${28 * s}" stroke="#0003"/></g>`;
  const firework = (x, y, r, col, delay) => `<g class="fw" style="animation-delay:${delay}s;transform-origin:${x}px ${y}px">${[...Array(16)].map((_, i) => { const a = i / 16 * 6.283; return `<path d="M${x + Math.cos(a) * r * .25},${y + Math.sin(a) * r * .25} L${x + Math.cos(a) * r},${y + Math.sin(a) * r}" stroke="${col}" stroke-width="3" stroke-linecap="round"/><circle cx="${x + Math.cos(a) * r}" cy="${y + Math.sin(a) * r}" r="4" fill="#fff"/>`; }).join('')}</g>`;
  const crowd = (r, y, n, col) => { let s = ''; for (let i = 0; i < n; i++) { const x = r() * 1600, h = 60 + r() * 40; s += `<ellipse cx="${x | 0}" cy="${(y - h) | 0}" rx="16" ry="18" fill="${col}"/><path d="M${(x - 30) | 0},${y + 40} Q${x | 0},${(y - h + 10) | 0} ${(x + 30) | 0},${y + 40}Z" fill="${col}"/>`; } return s; };

  Object.assign(BG, {
    festival() {
      const r = rng(101);
      let stalls = ''; for (let i = 0; i < 6; i++) { const x = 20 + i * 270; stalls += `<rect x="${x}" y="470" width="240" height="220" fill="#3a1a1a"/><rect x="${x + 10}" y="520" width="220" height="130" fill="#ffcf8a" opacity=".85"/><rect x="${x + 10}" y="520" width="220" height="130" fill="#ffae5a" opacity=".4" filter="url(#bl20)"/>${[...Array(8)].map((_, k) => `<path d="M${x + k * 30},440 L${x + k * 30 + 30},440 L${x + k * 30 + 30},488 Q${x + k * 30 + 15},500 ${x + k * 30},488Z" fill="${k % 2 ? '#fff' : '#d8282a'}"/>`).join('')}<rect x="${x + 60}" y="452" width="120" height="30" rx="4" fill="#fff4dc" stroke="#222" stroke-width="2"/><text x="${x + 120}" y="474" text-anchor="middle" font-size="20" font-weight="900" fill="#c33">${['たこ焼き', '金魚', 'かき氷', 'りんご飴', '射的', 'お面'][i]}</text>`; }
      return svgWrap(grad('fs', ['#07061c', '#1a1240', '#3a1a52']),
        `<rect width="1600" height="900" fill="url(#fs)"/>${stars(r, 60, 300)}${firework(360, 180, 120, '#ff5d85', 0)}${firework(1180, 150, 140, '#ffd24a', 1.1)}${firework(820, 110, 90, '#52e0ff', 2.2)}${firework(1450, 260, 80, '#b58aff', .6)}
        ${skyline(r, 480, 40, 140, '#120a22', '#ffcf6a', .1)}${stalls}
        <path d="M0,300 Q400,380 800,320 T1600,330" stroke="#222" stroke-width="3" fill="none"/>${[...Array(16)].map((_, i) => lantern(50 + i * 100, 340 + Math.sin(i * .8) * 26, i % 3 ? '#ff5a3a' : '#fff3d6', .9)).join('')}
        <rect y="690" width="1600" height="210" fill="#1a0f18"/>${crowd(r, 760, 22, '#0c0610')}`);
    },
    beach() {
      const r = rng(111);
      return svgWrap(grad('bs', ['#3aa6ff', '#9fdcff', '#e8f8ff']) + grad('sea', ['#1f8ad6', '#3fc6e0', '#8ff0e8']) + grad('sand', ['#ffe6b0', '#f2c98a']),
        `<rect width="1600" height="900" fill="url(#bs)"/><circle cx="1320" cy="140" r="70" fill="#fffbe0"/><circle cx="1320" cy="140" r="200" fill="#fff6c0" opacity=".35" filter="url(#bl20)"/>
        ${[...Array(5)].map(() => { const x = r() * 1600, y = 60 + r() * 180; return `<g class="drift"><ellipse cx="${x}" cy="${y}" rx="${90 + r() * 60}" ry="24" fill="#fff" opacity=".9"/><ellipse cx="${x + 40}" cy="${y - 14}" rx="50" ry="22" fill="#fff"/></g>`; }).join('')}
        <rect y="420" width="1600" height="220" fill="url(#sea)"/>${[...Array(26)].map(() => `<rect x="${r() * 1600}" y="${430 + r() * 200}" width="${40 + r() * 140}" height="3" fill="#fff" opacity="${(.2 + r() * .5).toFixed(2)}" class="glowpulse"/>`).join('')}
        <path d="M0,630 Q200,610 400,632 T800,628 T1200,634 T1600,626 L1600,900 L0,900Z" fill="url(#sand)"/><path d="M0,632 Q200,612 400,634 T800,630 T1200,636 T1600,628" stroke="#fff" stroke-width="8" fill="none" opacity=".8" class="dash"/>
        <path d="M300,560 v200" stroke="#6a4a2a" stroke-width="8"/><path d="M160,580 Q300,470 440,580Z" fill="#ff5d85"/><path d="M230,580 Q300,470 370,580Z" fill="#fff"/><rect x="980" y="760" width="220" height="70" rx="8" fill="#52e0ff" transform="rotate(-6 1090 795)"/><path d="M${r() * 800},200 q10,-10 20,0 q10,-10 20,0 M1000,240 q10,-10 20,0 q10,-10 20,0" stroke="#334" stroke-width="3" fill="none"/>`);
    },
    aquarium() {
      const r = rng(121);
      const fish = (x, y, s, col) => `<g class="drift" style="animation-duration:${14 + r() * 10}s"><ellipse cx="${x}" cy="${y}" rx="${26 * s}" ry="${11 * s}" fill="${col}"/><path d="M${x + 24 * s},${y} l${16 * s},-${10 * s} v${20 * s}z" fill="${col}"/><circle cx="${x - 14 * s}" cy="${y - 2 * s}" r="${2 * s}" fill="#001"/></g>`;
      const jelly = (x, y, s) => `<g class="bitfloat" style="animation-duration:${4 + r() * 3}s"><path d="M${x - 30 * s},${y} Q${x},${y - 50 * s} ${x + 30 * s},${y}Z" fill="#ffc6f0" opacity=".7"/><path d="M${x - 30 * s},${y} Q${x},${y - 50 * s} ${x + 30 * s},${y}Z" fill="#ff9ae8" opacity=".3" filter="url(#bl8)"/>${[...Array(5)].map((_, k) => `<path d="M${x - 20 * s + k * 10 * s},${y} q${6 * s},${30 * s} 0,${60 * s} q-${6 * s},${30 * s} 0,${50 * s}" stroke="#ffc6f0" stroke-width="2" fill="none" opacity=".6"/>`).join('')}</g>`;
      return svgWrap(grad('aq', ['#021a3a', '#05406a', '#0a6a8a']),
        `<rect width="1600" height="900" fill="url(#aq)"/>${[...Array(12)].map((_, i) => `<path d="M${i * 150},0 L${i * 150 + 200},900" stroke="#9ff6ff" stroke-width="${10 + (i % 3) * 8}" opacity=".06" filter="url(#bl8)"/>`).join('')}
        ${[...Array(10)].map(() => fish(r() * 1500, 120 + r() * 500, .8 + r() * 1.2, ['#ffb45a', '#52e0ff', '#fff', '#ffd24a'][(r() * 4) | 0])).join('')}${jelly(300, 260, 1.4)}${jelly(1250, 360, 1.1)}${jelly(820, 180, .8)}
        ${[...Array(40)].map(() => `<circle cx="${r() * 1600}" cy="${r() * 800}" r="${2 + r() * 5}" fill="none" stroke="#bff6ff" opacity=".5"/>`).join('')}
        <path d="M0,0 L1600,0 L1600,80 Q800,40 0,80Z M0,720 Q800,680 1600,720 L1600,900 L0,900Z" fill="#010812"/><path d="M0,80 Q800,40 1600,80" stroke="#3a7aa0" stroke-width="6" fill="none"/>
        <ellipse cx="800" cy="840" rx="600" ry="40" fill="#52e0ff" opacity=".1" filter="url(#bl20)"/>`);
    },
    amusement() {
      const r = rng(131);
      let wheel = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, x = 1100 + Math.cos(a) * 300, y = 380 + Math.sin(a) * 300; wheel += `<path d="M1100,380 L${x | 0},${y | 0}" stroke="#2a1a3a" stroke-width="4"/><g class="twinkle" style="animation-delay:${i * .1}s"><circle cx="${x | 0}" cy="${y | 0}" r="6" fill="${['#ffd24a', '#ff5d85', '#52e0ff'][i % 3]}"/></g><rect x="${(x - 18) | 0}" y="${(y + 4) | 0}" width="36" height="30" rx="8" fill="${['#ff8fb8', '#9fdcff', '#ffe680', '#b58aff'][i % 4]}" stroke="#2a1a3a" stroke-width="3"/>`; }
      return svgWrap(grad('am', ['#2a1a52', '#a5407a', '#ff9a5a', '#ffd8a0']),
        `<rect width="1600" height="900" fill="url(#am)"/>${stars(r, 30, 200)}<circle cx="1100" cy="380" r="300" fill="none" stroke="#2a1a3a" stroke-width="10"/><circle cx="1100" cy="380" r="290" fill="none" stroke="#ffd24a" stroke-width="2" stroke-dasharray="4 14" class="dash"/>${wheel}
        <path d="M1100,380 L980,860 M1100,380 L1220,860" stroke="#2a1a3a" stroke-width="16"/><circle cx="1100" cy="380" r="26" fill="#ffd24a" stroke="#2a1a3a" stroke-width="6"/>
        <path d="M0,560 C120,300 240,300 320,480 S480,700 560,420 S700,260 760,520" stroke="#2a1a3a" stroke-width="10" fill="none"/>${[...Array(12)].map((_, i) => `<path d="M${40 + i * 60},${500 + (i % 3) * 30} v400" stroke="#2a1a3a" stroke-width="5"/>`).join('')}
        <rect y="780" width="1600" height="120" fill="#1a0f22"/>${[...Array(30)].map(() => `<circle cx="${r() * 1600}" cy="${760 + r() * 30}" r="4" fill="#ffe680" class="twinkle"/>`).join('')}`);
    },
    shrine() {
      const r = rng(141);
      return svgWrap(grad('sh', ['#ff9a6a', '#ffcf9a', '#ffe8c8']),
        `<rect width="1600" height="900" fill="url(#sh)"/>${[...Array(10)].map((_, i) => tree(i * 180 + (i % 2) * 40, 520 + (i % 2) * 20, 1.4, '#2d5a3a', '#3a6e46')).join('')}
        <path d="M600,900 L720,420 L880,420 L1000,900Z" fill="#b8a898"/>${[...Array(10)].map((_, i) => `<path d="M${620 + i * 3},${880 - i * 46} L${980 - i * 3},${880 - i * 46}" stroke="#8a7a6a" stroke-width="4"/>`).join('')}
        <rect x="560" y="200" width="36" height="560" fill="#d8322a"/><rect x="1004" y="200" width="36" height="560" fill="#d8322a"/><path d="M480,170 Q800,130 1120,170 L1130,206 L470,206Z" fill="#1a1a1a"/><rect x="520" y="248" width="560" height="30" fill="#d8322a"/><rect x="760" y="206" width="80" height="44" fill="#1a1a1a"/>
        ${[420, 1180].map(x => `<rect x="${x - 24}" y="600" width="48" height="120" fill="#9a8a7a"/><rect x="${x - 40}" y="560" width="80" height="44" fill="#8a7a6a"/><rect x="${x - 16}" y="572" width="32" height="20" fill="#ffd8a0" class="glowpulse"/>`).join('')}
        ${[...Array(30)].map(() => `<ellipse cx="${r() * 1600}" cy="${r() * 700}" rx="5" ry="3" fill="#ffb3cc" opacity=".8" class="drift"/>`).join('')}`);
    },
    station() {
      return svgWrap(grad('stn', ['#cfd8e4', '#e8eef4']),
        `<rect width="1600" height="900" fill="url(#stn)"/>${[...Array(6)].map((_, i) => `<rect x="${i * 300 + 60}" y="40" width="200" height="14" rx="7" fill="#fff"/><rect x="${i * 300 + 40}" y="40" width="240" height="60" fill="#fff" opacity=".4" filter="url(#bl20)"/>`).join('')}
        <rect x="0" y="180" width="1600" height="60" fill="#2a3a5a"/><text x="800" y="222" text-anchor="middle" font-size="34" font-weight="900" fill="#fff" letter-spacing="6">渋谷 SHIBUYA · 3 ▸</text>
        <rect x="0" y="280" width="760" height="400" rx="30" fill="#dfe6ee" stroke="#8a96a6" stroke-width="6"/><rect x="0" y="330" width="760" height="18" fill="#2fbf7a"/>${[...Array(5)].map((_, i) => `<rect x="${40 + i * 140}" y="370" width="100" height="120" rx="10" fill="#1a2a3a"/><rect x="${40 + i * 140}" y="370" width="100" height="120" rx="10" fill="#9fdcff" opacity=".35"/>`).join('')}
        <rect y="680" width="1600" height="220" fill="#8a96a6"/><rect y="680" width="1600" height="30" fill="#ffd24a"/>${[...Array(40)].map((_, i) => `<rect x="${i * 40 + 8}" y="686" width="24" height="18" rx="4" fill="#e8b82a"/>`).join('')}
        <rect x="1100" y="360" width="16" height="320" fill="#555"/><rect x="1040" y="340" width="140" height="80" rx="8" fill="#1a2a3a"/><text x="1110" y="390" text-anchor="middle" font-size="22" fill="#6fffb0" font-family="monospace">17:42</text>`);
    },
    snow_city() {
      const r = rng(151);
      let tr = `<path d="M800,140 L960,620 L640,620Z" fill="#1f5a3a"/><path d="M800,140 L920,420 L680,420Z" fill="#2a6e46"/><rect x="780" y="620" width="40" height="70" fill="#4a2e2a"/>` + star1(800, 136);
      for (let i = 0; i < 40; i++) { const t = r(), y = 180 + t * 430, w = (y - 140) / 480 * 160; tr += `<circle cx="${(800 + (r() - .5) * 2 * w) | 0}" cy="${y | 0}" r="5" fill="${['#ffd24a', '#ff5d85', '#52e0ff', '#fff'][i % 4]}" class="twinkle" style="animation-delay:${(r() * 2).toFixed(1)}s"/>`; }
      function star1(x, y) { return `<polygon points="${[...Array(10)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 12 : 28; return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`; }).join(' ')}" fill="#ffe680" class="glowpulse"/>`; }
      return svgWrap(grad('sn', ['#0a1030', '#1a2a5a', '#3a4a7a']),
        `<rect width="1600" height="900" fill="url(#sn)"/>${stars(r, 80, 300)}${skyline(r, 700, 150, 420, '#141a38', '#ffd98a', .3)}${tr}
        <path d="M0,260 Q400,320 800,280 T1600,300" stroke="#222" stroke-width="2" fill="none"/>${[...Array(40)].map((_, i) => `<circle cx="${i * 40}" cy="${280 + Math.sin(i * .6) * 18}" r="5" fill="${['#ffd24a', '#ff5d85', '#52e0ff'][i % 3]}" class="twinkle" style="animation-delay:${i * .07}s"/>`).join('')}
        <path d="M0,690 Q400,660 800,690 T1600,680 L1600,900 L0,900Z" fill="#e8eef8"/><path d="M0,700 Q400,672 800,700 T1600,690 L1600,900 L0,900Z" fill="#fff" opacity=".6"/>`);
    },
    konbini_hq() {
      const r = rng(161);
      let board = ''; const pins = [[520, 260], [700, 220], [640, 380], [820, 330], [560, 470], [780, 470]]; pins.forEach((a, i) => pins.slice(i + 1).forEach(b => { if (r() < .5) board += `<path d="M${a[0]},${a[1]} L${b[0]},${b[1]}" stroke="#d8282a" stroke-width="2.5"/>`; }));
      pins.forEach(([x, y]) => { board += `<rect x="${x - 40}" y="${y - 30}" width="80" height="60" fill="#fff" transform="rotate(${((r() - .5) * 10) | 0} ${x} ${y})"/><circle cx="${x}" cy="${y - 26}" r="5" fill="#d8282a"/>`; });
      return svgWrap(grad('kh', ['#1a2230', '#2a3448']),
        `<rect width="1600" height="900" fill="url(#kh)"/>${[0, 1, 2].map(i => `<rect x="${140 + i * 420}" y="40" width="300" height="12" rx="6" fill="#dfe8f0" opacity=".6"/>`).join('')}
        <rect x="440" y="160" width="480" height="380" fill="#b8905a" stroke="#6a4a2a" stroke-width="10"/>${board}
        <rect x="1060" y="140" width="460" height="460" fill="#0b1030"/><rect x="1060" y="140" width="460" height="460" fill="none" stroke="#6a7686" stroke-width="12"/>${[...Array(6)].map((_, i) => `<rect x="${1090 + (i % 3) * 140}" y="${170 + ((i / 3) | 0) * 180}" width="110" height="140" fill="#fff" opacity=".85" transform="rotate(${((r() - .5) * 8) | 0} ${1145 + (i % 3) * 140} ${240 + ((i / 3) | 0) * 180})"/>`).join('')}
        <rect x="80" y="220" width="300" height="420" fill="#3a4658"/>${[...Array(4)].map((_, k) => `<rect x="80" y="${300 + k * 90}" width="300" height="8" fill="#56647a"/>${[...Array(7)].map((_, j) => `<rect x="${92 + j * 40}" y="${256 + k * 90}" width="30" height="44" rx="3" fill="hsl(${(r() * 360) | 0},55%,55%)"/>`).join('')}`).join('')}
        <rect y="640" width="1600" height="260" fill="#232a36"/><rect x="480" y="600" width="700" height="80" fill="#e8e8e8"/><rect x="480" y="600" width="700" height="12" fill="#26b36b"/>
        ${[560, 820, 1040].map(x => `<rect x="${x}" y="560" width="120" height="46" rx="4" fill="#111"/><rect x="${x + 8}" y="566" width="104" height="34" fill="#52e0ff" opacity=".6"/><rect x="${x - 30}" y="520" width="180" height="120" fill="#52e0ff" opacity=".1" filter="url(#bl20)"/>`).join('')}
        <text x="680" y="140" text-anchor="middle" font-size="30" font-weight="900" fill="#ffd24a" transform="rotate(-3 680 140)">SQUAD ZERO — OFF THE BOOKS</text>`);
    },
    boardroom() {
      const r = rng(171);
      return svgWrap(grad('br', ['#050508', '#12121c']),
        `<rect width="1600" height="900" fill="url(#br)"/><rect x="200" y="60" width="1200" height="420" fill="#0a1020"/><svg x="200" y="60" width="1200" height="420" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">${stars(r, 40, 300)}${skyline(r, 900, 200, 700, '#0e1224', '#ffcf6a', .18)}</svg>
        ${[0, 1, 2, 3, 4].map(i => `<rect x="${200 + i * 300}" y="60" width="10" height="420" fill="#050508"/>`).join('')}<circle cx="800" cy="170" r="70" fill="none" stroke="#c9a24a" stroke-width="8" opacity=".85"/><text x="800" y="182" text-anchor="middle" font-size="30" font-weight="900" fill="#c9a24a" letter-spacing="8">HALO</text>
        <path d="M800,520 L1500,900 L100,900Z" fill="#1c1418"/><path d="M800,520 L1440,900 L160,900Z" fill="#2a1c20"/><path d="M800,540 L1300,900" stroke="#fff" stroke-width="3" opacity=".08"/>
        ${[...Array(6)].map((_, i) => `<rect x="${240 + i * 40}" y="${560 + i * 55}" width="60" height="120" rx="10" fill="#0a0a10"/><rect x="${1300 - i * 40}" y="${560 + i * 55}" width="60" height="120" rx="10" fill="#0a0a10"/>`).join('')}`);
    },
    blacksite() {
      return svgWrap(grad('bk', ['#0a0a0c', '#1a1a20']),
        `<rect width="1600" height="900" fill="url(#bk)"/><path d="M0,0 L620,300 L980,300 L1600,0Z" fill="#141418"/><path d="M0,900 L620,560 L980,560 L1600,900Z" fill="#202026"/><rect x="620" y="300" width="360" height="260" fill="#0a0a0c"/>
        ${[...Array(5)].map((_, i) => { const t = i / 5, x = 620 * t, w = 60 - t * 40; return `<rect x="${x}" y="${300 * t + 60}" width="${w}" height="${(900 - 600 * t) - 200}" fill="#2a2a32"/>${[...Array(5)].map((_, k) => `<rect x="${x + k * w / 5}" y="${300 * t + 60}" width="3" height="${(900 - 600 * t) - 200}" fill="#6a6a78"/>`).join('')}`; }).join('')}
        ${[...Array(4)].map((_, i) => `<circle cx="${400 + i * 260}" cy="${80 + i * 50}" r="14" fill="#ff2233" class="blinkl"/><ellipse cx="${400 + i * 260}" cy="${80 + i * 50}" rx="160" ry="90" fill="#ff2233" opacity=".12" filter="url(#bl20)" class="glowpulse"/>`).join('')}
        ${[...Array(12)].map((_, i) => `<path d="M${i * 140},860 l60,0 l-40,40 l-60,0z" fill="${i % 2 ? '#ffd24a' : '#111'}"/>`).join('')}<text x="800" y="440" text-anchor="middle" font-size="40" font-weight="900" fill="#ff2233" opacity=".6" letter-spacing="10">SECTOR 0</text>`);
    },
    lab() {
      const r = rng(181);
      return svgWrap(grad('lb', ['#021014', '#06282e', '#0a3a40']) + '<radialGradient id="core2"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#ff7ae0"/><stop offset="1" stop-color="#ff7ae0" stop-opacity="0"/></radialGradient>',
        `<rect width="1600" height="900" fill="url(#lb)"/>${[...Array(5)].map((_, i) => { const x = 140 + i * 320; return `<rect x="${x}" y="200" width="140" height="420" rx="60" fill="#5fe6ff" opacity=".18" stroke="#9ff6ff" stroke-width="4"/>${[...Array(8)].map(() => `<circle cx="${x + 20 + r() * 100}" cy="${240 + r() * 360}" r="${2 + r() * 5}" fill="#bff6ff" opacity=".6" class="drift"/>`).join('')}<rect x="${x - 10}" y="180" width="160" height="30" fill="#2a3a40"/><rect x="${x - 10}" y="610" width="160" height="40" fill="#2a3a40"/>`; }).join('')}
        <circle cx="800" cy="400" r="160" fill="url(#core2)" class="pulse"/>${shards(r, 10, 700, 900, 300, 500, '#ffc6f0')}
        ${[...Array(10)].map((_, i) => `<path d="M${r() * 1600},900 C${r() * 1600},700 ${r() * 1600},600 800,${420 + r() * 40}" stroke="#1a2a30" stroke-width="${4 + r() * 6}" fill="none"/>`).join('')}<rect y="700" width="1600" height="200" fill="#020a0c" opacity=".7"/>`);
    },
    dome() {
      const r = rng(191);
      return svgWrap(grad('dm', ['#05020f', '#1a0830', '#2a0a3a']),
        `<rect width="1600" height="900" fill="url(#dm)"/><path d="M0,300 Q800,-40 1600,300" stroke="#3a2a5a" stroke-width="16" fill="none"/>${[...Array(9)].map((_, i) => `<path d="M${120 + i * 170},0 L${40 + i * 190},700 L${260 + i * 160},700Z" fill="hsl(${i * 40},100%,70%)" opacity=".09" class="glowpulse" style="animation-delay:${i * .25}s"/>`).join('')}
        <rect x="560" y="200" width="480" height="270" rx="10" fill="#0a0418" stroke="#ff6fae" stroke-width="6"/><text x="800" y="350" text-anchor="middle" font-size="64" font-weight="900" fill="#ffd6ea">★ LIVE ★</text>
        <rect x="200" y="470" width="1200" height="60" fill="#140a24"/><rect x="200" y="466" width="1200" height="8" fill="#52e0ff"/>
        ${[...Array(700)].map(() => { const y = 540 + r() * 360, x = r() * 1600; return `<circle cx="${x | 0}" cy="${y | 0}" r="${(2 + (y - 540) / 90).toFixed(1)}" fill="hsl(${[330, 190, 280, 50][(r() * 4) | 0]},100%,${60 + ((r() * 20) | 0)}%)" opacity=".85"${r() < .25 ? ' class="twinkle"' : ''}/>`; }).join('')}`);
    },
    ascension() {
      const r = rng(201);
      let tower = ''; for (let i = 0; i < 14; i++) { const y = 260 + i * 40, w = 20 + i * 12; tower += `<path d="M${800 - w},${y} L${800 + w},${y + 40} M${800 + w},${y} L${800 - w},${y + 40}" stroke="#ff5a3a" stroke-width="3" opacity=".9"/>`; }
      return svgWrap(grad('as', ['#1a0028', '#3a0a4a', '#0a0a2a']) + '<radialGradient id="rft"><stop offset="0" stop-color="#fff"/><stop offset=".2" stop-color="#ffb0f0"/><stop offset=".55" stop-color="#7a2ac0" stop-opacity=".6"/><stop offset="1" stop-color="#3a0a4a" stop-opacity="0"/></radialGradient>',
        `<rect width="1600" height="900" fill="url(#as)"/><ellipse cx="800" cy="130" rx="700" ry="200" fill="url(#rft)" class="glowpulse"/><path d="M200,120 Q500,40 800,130 T1400,110" stroke="#fff" stroke-width="5" fill="none" opacity=".9"/>${[...Array(14)].map(() => `<path d="M800,130 L${r() * 1600},${r() * 500}" stroke="#ff9ae8" stroke-width="1.5" opacity=".3"/>`).join('')}
        ${shards(r, 26, 0, 1600, 60, 500, '#e8ccff')}<path d="M760,260 L840,260 L900,820 L700,820Z" fill="none"/>${tower}<path d="M780,180 L820,180 L826,260 L774,260Z" fill="#ff5a3a"/>
        ${skyline(r, 820, 80, 320, '#0a0418', '#ff9ae8', .18)}<rect y="820" width="1600" height="80" fill="#05020a"/>`);
    },
    memorial() {
      const r = rng(211);
      return svgWrap(grad('mm', ['#cfe8ff', '#eaf4ff', '#fff6ee']),
        `<rect width="1600" height="900" fill="url(#mm)"/>${tree(180, 600, 1.8, '#ffc1d6', '#ff9dbf')}${tree(1420, 620, 1.6, '#ffd1e0', '#ffb3cc')}
        <rect x="360" y="220" width="880" height="420" fill="#4a4e58"/><rect x="380" y="240" width="840" height="380" fill="#5a5f6a"/>${[...Array(12)].map((_, i) => `<rect x="${420 + (i % 3) * 270}" y="${270 + ((i / 3) | 0) * 80}" width="${150 + r() * 60}" height="10" fill="#c9ced8" opacity=".85"/>`).join('')}
        <text x="800" y="210" text-anchor="middle" font-size="30" font-weight="900" fill="#4a4e58" letter-spacing="6">SQUAD ONE · WE REMEMBER</text>
        <rect y="640" width="1600" height="260" fill="#b8c8a8"/>${[...Array(18)].map(() => { const x = 420 + r() * 760; return `<path d="M${x},640 v-30" stroke="#3a6e46" stroke-width="3"/><circle cx="${x}" cy="605" r="10" fill="${['#ffd24a', '#fff', '#ff8fb8'][(r() * 3) | 0]}"/>`; }).join('')}
        ${[520, 800, 1080].map(x => `<rect x="${x - 8}" y="600" width="16" height="40" fill="#fff"/><ellipse cx="${x}" cy="592" rx="6" ry="10" fill="#ffb45a" class="glowpulse"/>`).join('')}`);
    },
    mountain() {
      const r = rng(221);
      return svgWrap(grad('mt', ['#2a3a7a', '#ff9a8a', '#ffd8a0']),
        `<rect width="1600" height="900" fill="url(#mt)"/><circle cx="1200" cy="420" r="90" fill="#fff2c8"/><circle cx="1200" cy="420" r="260" fill="#ffd08a" opacity=".3" filter="url(#bl20)"/>
        <path d="M0,520 L260,300 L480,480 L760,240 L1040,500 L1320,320 L1600,480 L1600,900 L0,900Z" fill="#5a4a7a"/><path d="M760,240 L700,300 L740,290 L760,320 L790,286 L820,300Z" fill="#fff" opacity=".9"/>
        <path d="M0,620 L300,460 L600,600 L900,440 L1200,610 L1600,500 L1600,900 L0,900Z" fill="#3a3a5a"/>${[...Array(26)].map(() => { const x = r() * 1600, y = 640 + r() * 160, s = .6 + r() * .8; return `<path d="M${x},${y - 120 * s} L${x + 40 * s},${y} L${x - 40 * s},${y}Z" fill="#1f3a2a"/>`; }).join('')}
        <rect x="1060" y="700" width="260" height="140" fill="#6a4a2a"/><path d="M1040,700 L1190,610 L1340,700Z" fill="#4a2e1a"/><rect x="1150" y="760" width="50" height="80" fill="#2a1a0a"/><rect x="1090" y="730" width="40" height="30" fill="#ffd98a" class="glowpulse"/>`);
    }
  });

  // ---------- cutscenes ----------
  const route = (id, bgn, of, emo, tint, pose = 'shy') => () => bg(bgn) + (tint ? `<div class="cgtint" style="background:${tint}"></div>` : '') + big(id, emo, pose, 'left:50%;bottom:-112%;height:210%;transform:translateX(-50%)', of);
  Object.assign(CG, {
    cg_rin: () => bg('rift') + `<div class="cgtint" style="background:radial-gradient(circle at 50% 40%,rgba(255,255,255,.7),transparent 50%)"></div>` + big('rin', 'confused', 'shy', 'left:50%;bottom:-70%;height:165%;transform:translateX(-50%)'),
    cg_natsuki: () => bg('glass_city') + `<div class="cgtint" style="background:rgba(120,80,20,.35);mix-blend-mode:multiply"></div>` + big('natsuki', 'determined', 'fist', 'left:50%;bottom:-62%;height:160%;transform:translateX(-50%)') + `<div class="cgtint" style="background:radial-gradient(circle,transparent 40%,rgba(40,20,0,.7))"></div>`,
    cg_board: () => bg('boardroom') + big('kuroda', 'ominous', 'think', 'left:50%;bottom:-70%;height:165%;transform:translateX(-50%)') + `<div class="cgtint" style="background:linear-gradient(0deg,rgba(0,0,0,.7),transparent 50%)"></div>`,
    cg_konbini: () => bg('konbini_hq') + ['tetsu', 'kaede', 'hikari', 'rei', 'sora'].map((id, i) => big(id, ['smile', 'smirk', 'determined', 'cold', 'happy'][i], ['cross', 'hip', 'fist', 'cross', 'wave'][i], `left:${-6 + i * 20}%;bottom:-62%;height:135%;z-index:${i === 2 ? 3 : 1}`, 'casual')).join(''),
    cg_aegis: () => bg('ascension') + big('shiori', 'cold', 'point', 'left:50%;bottom:-70%;height:165%;transform:translateX(-50%)') + `<div class="speedlines on"></div>`,
    cg_blacksite: () => bg('blacksite') + big('hikari', 'sad', 'shy', 'left:50%;bottom:-70%;height:165%;transform:translateX(-50%);filter:saturate(.6)') + `<div class="cgtint" style="background:repeating-linear-gradient(90deg,transparent 0 90px,#111 90px 104px)"></div>`,
    cg_broadcast: () => bg('dome') + big('sora', 'singing', 'cheer', 'left:50%;bottom:-62%;height:160%;transform:translateX(-50%)', 'formal') + `<div class="cgtint" style="background:linear-gradient(0deg,rgba(255,111,174,.2),transparent)"></div>`,
    cg_ascension: () => bg('ascension') + `<div class="cgtint" style="background:radial-gradient(circle at 50% 15%,rgba(255,180,240,.5),transparent 60%)"></div>`,
    cg_chairman: () => bg('ascension') + big('kuroda', 'ominous', 'point', 'left:50%;bottom:-62%;height:160%;transform:translateX(-50%)') + `<div class="cgtint" style="background:rgba(80,0,40,.35)"></div>`,
    cg_truth: () => bg('memorial') + ['rin', 'kyouya', 'aya'].map((id, i) => big(id, ['love', 'crysmile', 'tender'][i], ['cheer', 'default', 'shy'][i], `left:${[8, 34, 60][i]}%;bottom:-62%;height:140%`)).join('') + `<div class="cgtint" style="background:linear-gradient(0deg,rgba(255,220,180,.35),transparent)"></div>`,
    cg_festival: () => bg('festival') + ['kaede', 'hikari', 'rei', 'sora', 'mira'].map((id, i) => big(id, ['smirk', 'excited', 'tender', 'happy', 'smile'][i], ['hip', 'cheer', 'shy', 'wave', 'heart'][i], `left:${-6 + i * 20}%;bottom:-62%;height:135%;z-index:${i === 1 ? 3 : 1}`, 'yukata')).join(''),
    cg_snowsquad: () => bg('snow_city') + ['tetsu', 'rin', 'hikari', 'mira', 'rei'].map((id, i) => big(id, ['smile', 'awe', 'happy', 'tender', 'blush'][i], ['cross', 'cheer', 'wave', 'heart', 'shy'][i], `left:${-6 + i * 20}%;bottom:-62%;height:135%;z-index:${i === 2 ? 3 : 1}`, 'winter')).join('')
  });
  ['hikari', 'rei', 'mira', 'sora', 'kaede'].forEach(id => {
    CG['cg_fest_' + id] = route(id, 'festival', 'yukata', 'love', 'linear-gradient(0deg,rgba(255,120,80,.2),transparent)');
    CG['cg_snow_' + id] = route(id, 'snow_city', 'winter', 'tender', 'linear-gradient(0deg,rgba(180,200,255,.25),transparent)', 'heart');
    CG['cg_ferris_' + id] = route(id, 'amusement', 'casual', 'blush', 'rgba(255,120,160,.15)');
  });
  const N = Art.CG_NAMES, nm = { hikari: 'Hikari', rei: 'Rei', mira: 'Mira', sora: 'Sora', kaede: 'Kaede' };
  Object.assign(N, { cg_rin: 'The Girl from the Rift', cg_natsuki: 'Natsuki\'s Twelfth Trip', cg_board: 'The Chairman', cg_konbini: 'Off the Books', cg_aegis: 'Aegis', cg_blacksite: 'Sector Zero', cg_broadcast: 'The Broadcast', cg_ascension: 'Ascension', cg_chairman: 'Absolute Command', cg_truth: 'Squad One, Home', cg_festival: 'Summer Festival', cg_snowsquad: 'First Snow' });
  Object.keys(nm).forEach(id => Object.assign(N, { ['cg_fest_' + id]: `Fireworks (${nm[id]})`, ['cg_snow_' + id]: `Snowfall (${nm[id]})`, ['cg_ferris_' + id]: `Ferris Wheel (${nm[id]})` }));
})();

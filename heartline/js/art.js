/* HEARTLINE AGENCY — procedural anime art (characters, backgrounds, CGs). All SVG, no image files. */
const Art = (() => {
  const OL = '#2a1830';
  const mirror = s => `<g transform="translate(400,0) scale(-1,1)">${s}</g>`;
  const P = (d, fill, sw = 3, extra = '') => `<path d="${d}" fill="${fill}" stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
  const rng = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };

  // ---------- characters (see chars.js) ----------
  // Pixel-art sprites (from Moonkai Pixel Studio) replace the vector art when enabled.
  const CLOSED = ['happy', 'laugh', 'sleepy', 'crysmile', 'relieved', 'singing'];
  const pixelChar = (id, emo, portrait) => {
    const set = CLOSED.includes(emo) ? 'happy' : 'open', src = PIXEL[id][set][0];
    return portrait ? `<svg class="csvg" viewBox="40 26 80 90" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><image href="${src}" width="160" height="192" style="image-rendering:pixelated"/></svg>`
      : `<svg class="csvg pixelart" viewBox="0 0 400 720" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pxf" x1="0" y1="0" x2="0" y2="1"><stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="pxm"><rect x="0" y="-12" width="400" height="432" fill="url(#pxf)"/></mask></defs><image class="pxa" data-id="${id}" data-set="${set}" href="${src}" x="20" y="-12" width="360" height="432" mask="url(#pxm)" style="image-rendering:pixelated"/></svg>`;
  };
  // Pixel sprite animator: idle loop (breathing, hair sway, blink); talking loop while the character speaks.
  let pxTick = 0;
  setInterval(() => {
    pxTick++;
    document.querySelectorAll('#chars image.pxa, #cg image.pxa').forEach(im => {
      const talk = im.closest('.talking') ? 'Talk' : '', frames = PIXEL[im.dataset.id][im.dataset.set + talk], f = frames[pxTick % frames.length];
      if (im.getAttribute('href') !== f) im.setAttribute('href', f);
    });
  }, 140);
  const char = (id, emo = 'neutral', pose = 'default', portrait = false, of = 'hero') => id === 'bit' ? bit(emo, portrait)
    : typeof PIXEL !== 'undefined' && PIXEL[id] && window.PIXEL_ON !== false ? pixelChar(id, emo, portrait) : CharArt.char(id, emo, pose, portrait, of);
  const CH = CharArt.CH;

  function bit(emo, portrait) {
    const F = {
      happy: '<path d="M78,98 q10,-14 20,0 M104,98 q10,-14 20,0" stroke="#52e0ff" stroke-width="7" fill="none" stroke-linecap="round"/>',
      surprised: '<circle cx="86" cy="93" r="9" fill="none" stroke="#52e0ff" stroke-width="6"/><circle cx="116" cy="93" r="9" fill="none" stroke="#52e0ff" stroke-width="6"/>',
      angry: '<path d="M76,86 l18,10 l-18,10 M126,86 l-18,10 l18,10" stroke="#ff5a7a" stroke-width="6" fill="none" stroke-linecap="round"/>',
      sad: '<path d="M78,98 q10,10 20,0 M104,98 q10,10 20,0" stroke="#52e0ff" stroke-width="6" fill="none" stroke-linecap="round"/>',
      smug: '<rect x="76" y="94" width="22" height="6" rx="3" fill="#52e0ff"/><rect x="106" y="86" width="20" height="16" rx="6" fill="#52e0ff"/>'
    };
    const face = F[emo] || '<rect x="78" y="82" width="16" height="24" rx="8" fill="#52e0ff"/><rect x="108" y="82" width="16" height="24" rx="8" fill="#52e0ff"/>';
    return `<svg class="csvg bitsvg" viewBox="${portrait ? '20 20 160 160' : '-100 -300 400 720'}" preserveAspectRatio="xMidYMax meet"><defs><radialGradient id="bitg" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b9d4ff"/></radialGradient></defs>
      <g class="bitfloat"><path d="M86,150 L100,190 L114,150Z" fill="#52e0ff" opacity=".7" class="flame"/>
      <path d="M40,90 L6,70 L20,112Z M160,90 L194,70 L180,112Z" fill="#8fb4ff" stroke="${OL}" stroke-width="3"/>
      <circle cx="100" cy="95" r="62" fill="url(#bitg)" stroke="${OL}" stroke-width="4"/>
      <path d="M40,112 Q100,140 160,112" fill="none" stroke="#52e0ff" stroke-width="5"/>
      <rect x="54" y="68" width="92" height="52" rx="26" fill="#0b1530" stroke="${OL}" stroke-width="3"/>${face}
      <path d="M100,33 L100,14" stroke="${OL}" stroke-width="4"/><circle cx="100" cy="11" r="7" fill="#ff4f8b" class="blinkl"/></g></svg>`;
  }

  function monster(big) {
    const r = rng(big ? 7 : 3);
    let shards = '';
    for (let i = 0; i < 26; i++) {
      const x = 300 + (r() - .5) * 360, y = 160 + r() * 420, h = 60 + r() * 140, w = 20 + r() * 40, a = (r() - .5) * 60;
      shards += `<polygon points="${x},${y - h} ${x + w},${y} ${x},${y + h * .3} ${x - w},${y}" transform="rotate(${a.toFixed(0)} ${x} ${y})" fill="url(#gl)" stroke="#e8ffff" stroke-width="2" opacity="${(.55 + r() * .45).toFixed(2)}"/>`;
    }
    return `<svg viewBox="0 0 600 700" class="monster"><defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8ffff" stop-opacity=".95"/><stop offset=".5" stop-color="#6fd8ff" stop-opacity=".55"/><stop offset="1" stop-color="#2a4c9a" stop-opacity=".8"/></linearGradient>
      <radialGradient id="core"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#ff4060"/><stop offset="1" stop-color="#ff0040" stop-opacity="0"/></radialGradient>
      <filter id="mglow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g filter="url(#mglow)">${shards}<circle cx="300" cy="360" r="70" fill="url(#core)" class="pulse"/>
      <path d="M240,250 l40,14 l-40,8z M360,250 l-40,14 l40,8z" fill="#ff3355"/></g></svg>`;
  }

  // ---------- backgrounds (1600x900) ----------
  function skyline(r, y0, hMin, hMax, col, win, winP) {
    let s = '', x = -20;
    while (x < 1620) {
      const w = 50 + r() * 100, h = hMin + r() * (hMax - hMin), top = y0 - h;
      s += `<rect x="${x | 0}" y="${top | 0}" width="${w | 0}" height="${(h + 300) | 0}" fill="${col}"/>`;
      if (r() < .3) s += `<rect x="${(x + w * .3) | 0}" y="${(top - 22) | 0}" width="${(w * .4) | 0}" height="24" fill="${col}"/>`;
      if (win) for (let wy = top + 14; wy < y0 - 8; wy += 18) for (let wx = x + 9; wx < x + w - 12; wx += 15) if (r() < winP) s += `<rect x="${wx | 0}" y="${wy | 0}" width="7" height="9" fill="${win}" opacity="${(.35 + r() * .65).toFixed(2)}"/>`;
      if (r() < .18) s += `<rect x="${(x + w / 2) | 0}" y="${(top - 40) | 0}" width="3" height="40" fill="${col}"/><circle class="blinkl" cx="${(x + w / 2 + 1) | 0}" cy="${(top - 40) | 0}" r="4" fill="#ff4466"/>`;
      x += w + (r() * 8 | 0);
    }
    return s;
  }
  const stars = (r, n, h = 500) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${(r() * 1600) | 0}" cy="${(r() * h) | 0}" r="${(r() * 1.8 + .4).toFixed(1)}" fill="#fff" opacity="${(.3 + r() * .7).toFixed(2)}"${r() < .2 ? ' class="twinkle"' : ''}/>`; return s; };
  const grad = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const svgWrap = (defs, body) => `<svg class="bgsvg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs>${defs}<filter id="bl8"><feGaussianBlur stdDeviation="8"/></filter><filter id="bl20"><feGaussianBlur stdDeviation="20"/></filter></defs>${body}</svg>`;
  const tree = (x, y, s, c1, c2) => `<rect x="${x - 8 * s}" y="${y - 90 * s}" width="${16 * s}" height="${90 * s}" fill="#4a2e2a"/>` + [[0, -120, 70], [-50, -95, 50], [50, -95, 55], [-20, -160, 50], [30, -150, 45]].map(([dx, dy, rr], i) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${rr * s}" fill="${i % 2 ? c2 : c1}"/>`).join('');

  const BG = {
    black: () => `<div class="bgsolid" style="background:#05040a"></div>`,
    white: () => `<div class="bgsolid" style="background:#fff"></div>`,
    city_night() {
      const r = rng(11);
      return svgWrap(grad('s1', ['#050a22', '#1c1446', '#4d2160', '#8a3a6a']) + '<radialGradient id="mg"><stop offset="0" stop-color="#fff6d8" stop-opacity=".7"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>',
        `<rect width="1600" height="900" fill="url(#s1)"/>${stars(r, 160)}<circle cx="1260" cy="170" r="160" fill="url(#mg)"/><circle cx="1260" cy="170" r="58" fill="#fff7e2"/><circle cx="1240" cy="158" r="12" fill="#efe2c4"/>
        <ellipse cx="800" cy="120" rx="140" ry="140" fill="none" stroke="#7fe8ff" stroke-width="3" opacity=".4" transform="translate(-40 260) scale(1 .25)"/>
        ${skyline(r, 700, 150, 420, '#1d1540', '#ffcf6a', .22)}
        <rect x="770" y="220" width="60" height="480" fill="#241a4e"/><ellipse cx="800" cy="210" rx="90" ry="22" fill="none" stroke="#7fe8ff" stroke-width="6" class="glowpulse"/>
        ${skyline(r, 830, 60, 300, '#0e0a22', '#ffe2a0', .3)}<rect y="830" width="1600" height="70" fill="#07050e"/>
        <rect x="120" y="640" width="90" height="34" rx="6" fill="#ff3d8b" opacity=".85" filter="url(#bl8)"/><rect x="1300" y="610" width="120" height="30" rx="6" fill="#3dd8ff" opacity=".8" filter="url(#bl8)"/>`);
    },
    street_night() {
      const r = rng(21);
      return svgWrap(grad('s2', ['#04060f', '#141030', '#35184a']) + grad('rd', ['#1a1630', '#06050c']),
        `<rect width="1600" height="900" fill="url(#s2)"/>${skyline(r, 560, 180, 480, '#130f2a', '#ffcf6a', .18)}
        <rect y="560" width="1600" height="340" fill="url(#rd)"/>
        <rect x="60" y="300" width="560" height="270" fill="#1d2233"/><rect x="80" y="330" width="520" height="220" fill="#bfe8ff" opacity=".85"/><rect x="80" y="330" width="520" height="220" fill="#fff" opacity=".35" filter="url(#bl20)"/>
        <rect x="60" y="270" width="560" height="44" fill="#26b36b"/><text x="340" y="302" font-size="30" font-family="sans-serif" font-weight="900" fill="#fff" text-anchor="middle">24H MART</text>
        <g stroke="#fff" stroke-width="3" opacity=".8" fill="none"><path d="M150,540 l40,-90 l30,70 l40,-120 M420,520 l30,-60 l40,90 M300,330 l-20,60 l30,40 l-10,80 M190,450 l110,-20 l120,90"/></g>
        <rect x="1180" y="320" width="10" height="260" fill="#222"/><path d="M1185,320 q40,-30 80,0" stroke="#222" stroke-width="10" fill="none"/><ellipse cx="1265" cy="330" rx="140" ry="40" fill="#ffd98a" opacity=".25" filter="url(#bl20)"/>
        <ellipse cx="340" cy="720" rx="300" ry="30" fill="#bfe8ff" opacity=".18" filter="url(#bl8)"/><ellipse cx="1000" cy="760" rx="380" ry="40" fill="#7f9bd4" opacity=".12"/>
        ${[...Array(12)].map((_, i) => `<rect x="${i * 150 + 20}" y="${720 + (i % 3) * 30}" width="80" height="4" fill="#fff" opacity=".15"/>`).join('')}`);
    },
    konbini() {
      const r = rng(5); let shelves = '';
      for (let sy = 0; sy < 4; sy++) for (let i = 0; i < 26; i++) shelves += `<rect x="${140 + i * 36}" y="${250 + sy * 90 + (r() * 10 | 0)}" width="${26 + (r() * 6 | 0)}" height="${60 - (r() * 12 | 0)}" rx="3" fill="hsl(${(r() * 360) | 0},70%,${55 + (r() * 20 | 0)}%)"/>`;
      return svgWrap(grad('w1', ['#f4f7fb', '#dfe7ef']) + grad('fl', ['#cfd8e2', '#9fb0c0']),
        `<rect width="1600" height="900" fill="url(#w1)"/>${[0, 1, 2, 3].map(i => `<rect x="${100 + i * 380}" y="40" width="300" height="18" rx="9" fill="#fff"/><rect x="${100 + i * 380}" y="40" width="300" height="60" fill="#fff" opacity=".5" filter="url(#bl20)"/>`).join('')}
        <rect x="120" y="230" width="980" height="400" fill="#c2cbd6"/>${[0, 1, 2, 3].map(i => `<rect x="120" y="${320 + i * 90}" width="980" height="10" fill="#8795a6"/>`).join('')}${shelves}
        <rect x="1160" y="140" width="380" height="460" fill="#0b1030"/>${[...Array(30)].map(() => `<path d="M${1170 + r() * 360},${150 + r() * 400} l-6,26" stroke="#9fc4ff" stroke-width="2" opacity=".5"/>`).join('')}<rect x="1160" y="140" width="380" height="460" fill="none" stroke="#8795a6" stroke-width="12"/>
        <rect y="640" width="1600" height="260" fill="url(#fl)"/><rect x="0" y="690" width="1600" height="210" fill="#f2f2f2"/><rect y="690" width="1600" height="16" fill="#26b36b"/><rect x="980" y="600" width="170" height="92" rx="8" fill="#333b48"/><rect x="995" y="612" width="140" height="60" rx="4" fill="#5fe3a0" opacity=".7"/>`);
    },
    apartment() {
      const r = rng(9);
      return svgWrap(grad('ap', ['#1b1d3a', '#2a2452']) + grad('win', ['#0a0f2e', '#35204e']),
        `<rect width="1600" height="900" fill="url(#ap)"/><rect x="820" y="110" width="620" height="440" fill="url(#win)"/>
        <svg x="820" y="110" width="620" height="440" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">${stars(r, 60, 300)}${skyline(r, 900, 200, 600, '#141236', '#ffcf6a', .25)}</svg>
        <rect x="820" y="110" width="620" height="440" fill="none" stroke="#c9b8a8" stroke-width="16"/><rect x="1122" y="110" width="16" height="440" fill="#c9b8a8"/>
        <rect x="140" y="160" width="160" height="220" fill="#ff7aa8" opacity=".75" transform="rotate(-4 220 270)"/><rect x="330" y="190" width="140" height="190" fill="#6fb7ff" opacity=".7" transform="rotate(3 400 285)"/>
        <polygon points="220,210 200,260 214,260 204,300 236,248 222,248 232,210" fill="#fff26a"/>
        <rect x="60" y="560" width="700" height="30" fill="#5a3b2e"/><rect x="100" y="590" width="20" height="310" fill="#4a2e22"/><rect x="700" y="590" width="20" height="310" fill="#4a2e22"/>
        <rect x="300" y="420" width="260" height="150" rx="10" fill="#111"/><rect x="314" y="432" width="232" height="120" fill="#4fd8ff" opacity=".5"/><rect x="300" y="420" width="400" height="200" fill="#4fd8ff" opacity=".12" filter="url(#bl20)"/>
        <rect x="140" y="530" width="120" height="30" fill="#f3e6c8" transform="rotate(-6 200 545)"/>
        <rect x="900" y="640" width="700" height="260" fill="#39406e"/><rect x="900" y="620" width="700" height="40" rx="16" fill="#e8e3f4"/>`);
    },
    hq_lobby() {
      const r = rng(3);
      return svgWrap(grad('hq', ['#07102b', '#10275e', '#1a4b8f']) + grad('hf', ['#18305e', '#060c1e']) + '<radialGradient id="ring"><stop offset=".6" stop-color="#7fe8ff" stop-opacity="0"/><stop offset=".72" stop-color="#7fe8ff" stop-opacity=".9"/><stop offset=".8" stop-color="#7fe8ff" stop-opacity="0"/></radialGradient>',
        `<rect width="1600" height="900" fill="url(#hq)"/>${[...Array(9)].map((_, i) => `<rect x="${i * 200 - 20}" y="0" width="60" height="640" fill="#0a1636" opacity=".8"/><rect x="${i * 200 + 18}" y="0" width="4" height="640" fill="#7fe8ff" opacity=".35"/>`).join('')}
        <circle cx="800" cy="300" r="230" fill="url(#ring)" class="glowpulse"/><circle cx="800" cy="300" r="150" fill="none" stroke="#7fe8ff" stroke-width="2" opacity=".5" stroke-dasharray="12 10" class="spin"/>
        <text x="800" y="318" font-size="64" font-family="sans-serif" font-weight="900" letter-spacing="18" fill="#dff8ff" text-anchor="middle" opacity=".9">HALO</text>
        ${[[180, 220], [1250, 260]].map(([x, y]) => `<rect x="${x}" y="${y}" width="200" height="120" rx="8" fill="#7fe8ff" opacity=".12" stroke="#7fe8ff" stroke-opacity=".6"/>${[0, 1, 2, 3].map(k => `<rect x="${x + 16}" y="${y + 20 + k * 22}" width="${60 + r() * 110}" height="7" fill="#7fe8ff" opacity=".5"/>`).join('')}`).join('')}
        <rect y="640" width="1600" height="260" fill="url(#hf)"/><ellipse cx="800" cy="700" rx="600" ry="40" fill="#7fe8ff" opacity=".12" filter="url(#bl20)"/>
        ${[...Array(12)].map((_, i) => `<path d="M800,640 L${i * 160 - 80},900" stroke="#7fe8ff" stroke-opacity=".12"/>`).join('')}`);
    },
    office() {
      const r = rng(17);
      return svgWrap(grad('of', ['#6fb6ff', '#bfe3ff', '#ffe6d0']) + grad('ow', ['#2b2230', '#171219']),
        `<rect width="1600" height="900" fill="url(#ow)"/><rect x="150" y="80" width="1300" height="560" fill="url(#of)"/>
        <svg x="150" y="80" width="1300" height="560" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">${skyline(r, 900, 150, 700, '#7e93b8', '#dfeaff', .1)}${skyline(r, 900, 50, 400, '#5f7298', null, 0)}</svg>
        ${[0, 1, 2, 3].map(i => `<rect x="${150 + i * 325}" y="80" width="12" height="560" fill="#171219"/>`).join('')}<rect x="150" y="80" width="1300" height="560" fill="none" stroke="#171219" stroke-width="18"/>
        <rect x="140" y="640" width="1320" height="20" fill="#3a2e36"/><rect x="300" y="700" width="1000" height="200" fill="#3b2a2a"/><rect x="300" y="690" width="1000" height="24" fill="#5a3e3a"/>
        <rect x="60" y="200" width="16" height="500" fill="#999"/><path d="M76,210 L180,230 L180,330 L76,310Z" fill="#1f5fd6"/><circle cx="128" cy="270" r="22" fill="none" stroke="#fff" stroke-width="4"/>`);
    },
    training() {
      return svgWrap(grad('tr', ['#0a0c1a', '#161a36', '#0d1f3a']) + grad('tf', ['#0f2346', '#050912']),
        `<rect width="1600" height="900" fill="url(#tr)"/>${[...Array(8)].map((_, i) => `<rect x="${60 + i * 200}" y="40" width="120" height="12" rx="6" fill="#dff8ff" opacity=".8"/><rect x="${40 + i * 200}" y="40" width="160" height="60" fill="#9feaff" opacity=".18" filter="url(#bl20)"/>`).join('')}
        <rect x="560" y="140" width="480" height="80" rx="8" fill="#ffd54a"/><text x="800" y="196" text-anchor="middle" font-size="46" font-family="sans-serif" font-weight="900" fill="#1a1a2e" letter-spacing="10">SQUAD ZERO</text>
        <rect x="0" y="260" width="1600" height="12" fill="#ffd54a" opacity=".5"/>
        ${[260, 1340].map(x => `<rect x="${x - 14}" y="400" width="28" height="220" fill="#555"/><circle cx="${x}" cy="370" r="40" fill="#c33" stroke="#fff" stroke-width="8"/><circle cx="${x}" cy="370" r="14" fill="#fff"/>`).join('')}
        <rect y="580" width="1600" height="320" fill="url(#tf)"/>${[...Array(17)].map((_, i) => `<path d="M800,580 L${i * 120 - 160},900" stroke="#3dd8ff" stroke-opacity=".3"/>`).join('')}${[600, 640, 700, 780, 890].map(y => `<path d="M0,${y} L1600,${y}" stroke="#3dd8ff" stroke-opacity=".25"/>`).join('')}`);
    },
    ops() {
      const r = rng(8);
      let map = ''; for (let i = 0; i < 18; i++) map += `<rect x="${420 + r() * 700}" y="${120 + r() * 330}" width="${30 + r() * 80}" height="${20 + r() * 60}" fill="#1f6fa0" opacity=".45"/>`;
      return svgWrap(grad('op', ['#050a14', '#0b1628']),
        `<rect width="1600" height="900" fill="url(#op)"/><rect x="380" y="90" width="840" height="400" rx="10" fill="#0a2a44" stroke="#3dd8ff" stroke-width="4"/>${map}
        ${[...Array(14)].map((_, i) => `<path d="M${380 + i * 60},90 v400" stroke="#3dd8ff" stroke-opacity=".12"/>`).join('')}${[...Array(7)].map((_, i) => `<path d="M380,${90 + i * 60} h840" stroke="#3dd8ff" stroke-opacity=".12"/>`).join('')}
        <circle cx="1010" cy="380" r="16" fill="#ff3355" class="pulse"/><circle cx="1010" cy="380" r="40" fill="none" stroke="#ff3355" stroke-width="3" class="ping"/>
        ${[80, 1260].map(x => `<rect x="${x}" y="140" width="260" height="170" rx="6" fill="#0a2a44" stroke="#3dd8ff" stroke-opacity=".6"/>${[0, 1, 2, 3, 4].map(k => `<rect x="${x + 20}" y="${160 + k * 26}" width="${40 + r() * 180}" height="8" fill="#3dd8ff" opacity=".45"/>`).join('')}`).join('')}
        <rect y="620" width="1600" height="280" fill="#0b0f1a"/>${[...Array(6)].map((_, i) => `<rect x="${i * 280 + 20}" y="600" width="240" height="60" rx="6" fill="#16213a"/><rect x="${i * 280 + 40}" y="612" width="200" height="24" fill="#3dd8ff" opacity=".35"/>`).join('')}`);
    },
    cafe() {
      return svgWrap(grad('cf', ['#f8d7a8', '#e6a877']) + grad('cw', ['#bfe6ff', '#fff4dc']),
        `<rect width="1600" height="900" fill="url(#cf)"/>${[0, 1, 2].map(i => `<rect x="${140 + i * 460}" y="120" width="380" height="380" rx="190" fill="url(#cw)"/><path d="M${330 + i * 460},120 v380 M${140 + i * 460},320 h380" stroke="#8a5a3a" stroke-width="10"/><circle cx="${230 + i * 460}" cy="440" r="40" fill="#5fae6b"/>`).join('')}
        ${[300, 800, 1300].map(x => `<path d="M${x},0 v90" stroke="#3a2a22" stroke-width="3"/><path d="M${x - 40},120 q40,-50 80,0z" fill="#3a2a22"/><ellipse cx="${x}" cy="140" rx="90" ry="40" fill="#ffd98a" opacity=".5" filter="url(#bl20)"/>`).join('')}
        <rect y="560" width="1600" height="340" fill="#8a5a3a"/><rect y="560" width="1600" height="14" fill="#5a3a22"/>${[200, 700, 1200].map(x => `<ellipse cx="${x}" cy="680" rx="170" ry="30" fill="#f4e6d0"/><rect x="${x - 10}" y="690" width="20" height="210" fill="#4a3022"/><rect x="${x - 40}" y="640" width="30" height="36" rx="6" fill="#fff"/>`).join('')}`);
    },
    park() {
      const r = rng(4);
      return svgWrap(grad('pk', ['#6ac4ff', '#bfe9ff', '#fff2f6']),
        `<rect width="1600" height="900" fill="url(#pk)"/>${[...Array(6)].map(() => { const x = r() * 1600, y = 60 + r() * 200; return `<g class="drift" opacity=".9"><ellipse cx="${x}" cy="${y}" rx="${80 + r() * 60}" ry="26" fill="#fff"/><ellipse cx="${x + 40}" cy="${y - 16}" rx="50" ry="26" fill="#fff"/></g>`; }).join('')}
        <path d="M0,560 Q400,470 800,540 T1600,520 L1600,900 L0,900Z" fill="#8ed27a"/><path d="M0,640 Q500,580 900,640 T1600,620 L1600,900 L0,900Z" fill="#6cbf5e"/>
        <path d="M640,900 Q760,700 820,620 L900,620 Q880,720 1000,900Z" fill="#f2dfbe"/>
        ${tree(200, 640, 1.6, '#ffc1d6', '#ff9dbf')}${tree(1380, 660, 1.8, '#ffb3cc', '#ffd1e0')}${tree(520, 600, 1, '#ffc1d6', '#ffa6c6')}${tree(1120, 600, 1.1, '#ffd1e0', '#ff9dbf')}`);
    },
    rooftop() {
      const r = rng(12);
      return svgWrap(grad('rt', ['#2b1a52', '#a5407a', '#ff8a5a', '#ffd08a']) + '<radialGradient id="sun"><stop offset="0" stop-color="#fff6d0"/><stop offset=".3" stop-color="#ffc070"/><stop offset="1" stop-color="#ff7a50" stop-opacity="0"/></radialGradient>',
        `<rect width="1600" height="900" fill="url(#rt)"/>${stars(r, 30, 160)}<circle cx="800" cy="560" r="320" fill="url(#sun)"/><circle cx="800" cy="560" r="80" fill="#fff2c8"/>
        ${[...Array(5)].map((_, i) => `<ellipse class="drift" cx="${r() * 1600}" cy="${180 + i * 50}" rx="${160 + r() * 140}" ry="14" fill="#ffb08a" opacity=".45"/>`).join('')}
        ${skyline(r, 640, 60, 300, '#3a1e4a', '#ffd98a', .12)}<rect y="640" width="1600" height="260" fill="#2a1a33"/><rect y="640" width="1600" height="12" fill="#5a3a5a"/>
        <g stroke="#1a0f22" stroke-width="3" opacity=".85">${[...Array(41)].map((_, i) => `<path d="M${i * 40},480 L${i * 40 + 40},560 M${i * 40 + 40},480 L${i * 40},560"/>`).join('')}</g><rect y="474" width="1600" height="10" fill="#1a0f22"/><rect y="556" width="1600" height="8" fill="#1a0f22"/>
        ${[...Array(9)].map((_, i) => `<rect x="${i * 200}" y="470" width="10" height="170" fill="#1a0f22"/>`).join('')}`);
    },
    harbor() {
      const r = rng(31);
      return svgWrap(grad('hb', ['#12061a', '#3a0f2a', '#8a1f2a', '#ff6a3a']) + grad('wt', ['#3a1020', '#07030a']),
        `<rect width="1600" height="900" fill="url(#hb)"/>${[...Array(8)].map(() => `<ellipse cx="${r() * 1600}" cy="${100 + r() * 300}" rx="${200 + r() * 200}" ry="40" fill="#1a0610" opacity=".5" filter="url(#bl20)"/>`).join('')}
        ${[200, 520, 1280].map((x, i) => `<g fill="#0a0408"><rect x="${x}" y="${250 + i * 20}" width="18" height="${340 - i * 20}"/><rect x="${x - 40}" y="${250 + i * 20}" width="${220}" height="14"/><path d="M${x},${250 + i * 20} l40,-60 l10,0 l-30,60z"/><rect x="${x + 150}" y="${264 + i * 20}" width="3" height="80"/></g>`).join('')}
        ${skyline(r, 600, 30, 120, '#140610', '#ff9a5a', .2)}<rect y="600" width="1600" height="300" fill="url(#wt)"/>
        ${[...Array(20)].map(() => `<rect x="${r() * 1600}" y="${620 + r() * 260}" width="${40 + r() * 120}" height="3" fill="#ff6a3a" opacity="${(.1 + r() * .3).toFixed(2)}"/>`).join('')}
        ${[...Array(6)].map((_, i) => `<rect x="${60 + i * 110}" y="${540 - (i % 2) * 40}" width="100" height="${60 + (i % 2) * 40}" fill="${['#8a2a2a', '#2a5a8a', '#6a6a2a'][i % 3]}" stroke="#0a0408" stroke-width="3"/>`).join('')}`);
    },
    ramen() {
      return svgWrap(grad('rm', ['#3a1a14', '#6a2a1a']),
        `<rect width="1600" height="900" fill="url(#rm)"/>${[...Array(7)].map((_, i) => `<g class="sway" style="transform-origin:${150 + i * 220}px 60px"><path d="M${150 + i * 220},0 v70" stroke="#222" stroke-width="3"/><ellipse cx="${150 + i * 220}" cy="120" rx="44" ry="56" fill="#e8322a"/><ellipse cx="${150 + i * 220}" cy="120" rx="80" ry="90" fill="#ff6a3a" opacity=".3" filter="url(#bl20)"/><rect x="${136 + i * 220}" y="70" width="28" height="10" fill="#222"/><rect x="${136 + i * 220}" y="164" width="28" height="10" fill="#222"/></g>`).join('')}
        <rect x="0" y="260" width="1600" height="300" fill="#2a1410"/>${[...Array(10)].map((_, i) => `<rect x="${40 + i * 160}" y="290" width="120" height="70" fill="#f4e6c8"/><rect x="${55 + i * 160}" y="305" width="90" height="8" fill="#3a1a14"/><rect x="${55 + i * 160}" y="325" width="60" height="8" fill="#3a1a14"/>`).join('')}
        <ellipse cx="800" cy="480" rx="500" ry="70" fill="#fff" opacity=".08" filter="url(#bl20)"/>
        <rect y="600" width="1600" height="300" fill="#c8864a"/><rect y="600" width="1600" height="20" fill="#8a5a2a"/>${[400, 900].map(x => `<ellipse cx="${x}" cy="660" rx="110" ry="30" fill="#f4f0e8" stroke="#c33" stroke-width="6"/><ellipse cx="${x}" cy="655" rx="90" ry="20" fill="#e8b060"/>`).join('')}`);
    },
    alley() {
      const r = rng(41);
      return svgWrap(grad('al', ['#0a0a18', '#1a1430']),
        `<rect width="1600" height="900" fill="url(#al)"/><rect x="0" y="0" width="500" height="900" fill="#141024"/><rect x="1100" y="0" width="500" height="900" fill="#141024"/>
        ${[...Array(14)].map(() => `<rect x="${r() < .5 ? 40 + r() * 400 : 1140 + r() * 400}" y="${60 + r() * 500}" width="50" height="70" fill="#ffcf6a" opacity="${(.2 + r() * .5).toFixed(2)}"/>`).join('')}
        <path d="M500,0 L700,0 L760,640 L500,900Z M1100,0 L900,0 L840,640 L1100,900Z" fill="#1d1733"/><rect x="760" y="100" width="80" height="540" fill="#2a2248"/>
        <rect x="560" y="460" width="130" height="220" rx="6" fill="#2d5bd6"/><rect x="575" y="480" width="100" height="120" fill="#bfe8ff" opacity=".9"/><rect x="520" y="440" width="220" height="280" fill="#6fb7ff" opacity=".18" filter="url(#bl20)"/>
        <rect y="640" width="1600" height="260" fill="#0c0a16"/><ellipse cx="820" cy="760" rx="220" ry="26" fill="#6fb7ff" opacity=".2"/>
        <path d="M980,600 q14,-30 30,-12 q10,-18 18,4 q20,20 0,44 l-50,0z" fill="#0a0810"/><circle cx="998" cy="600" r="3" fill="#ffd54a"/><circle cx="1012" cy="600" r="3" fill="#ffd54a"/>`);
    },
    medbay() {
      return svgWrap(grad('md', ['#e8fbff', '#cfeff2']),
        `<rect width="1600" height="900" fill="url(#md)"/>${[0, 1, 2].map(i => `<rect x="${100 + i * 520}" y="60" width="400" height="14" rx="7" fill="#fff"/>`).join('')}
        <rect x="160" y="160" width="340" height="220" rx="12" fill="#10283a"/><path d="M180,280 h60 l20,-50 l24,90 l20,-60 l14,20 h160" fill="none" stroke="#5fffc0" stroke-width="5" class="dash"/>
        <path d="M1080,140 h60 v-60 h60 v60 h60 v60 h-60 v60 h-60 v-60 h-60z" fill="#26c6a6" opacity=".35"/>
        <rect y="600" width="1600" height="300" fill="#b6dfe2"/>${[520, 1050].map(x => `<rect x="${x}" y="520" width="380" height="90" rx="14" fill="#fff" stroke="#9cc" stroke-width="4"/><rect x="${x + 20}" y="500" width="110" height="40" rx="18" fill="#eef"/><rect x="${x + 20}" y="610" width="12" height="160" fill="#9cc"/><rect x="${x + 348}" y="610" width="12" height="160" fill="#9cc"/>`).join('')}
        <rect x="360" y="0" width="880" height="900" fill="#fff" opacity=".12"/>`);
    },
    arcade() {
      const r = rng(19);
      return svgWrap(grad('ar', ['#0a0418', '#1a0830']),
        `<rect width="1600" height="900" fill="url(#ar)"/>${[...Array(8)].map((_, i) => { const hue = [300, 190, 50, 140][i % 4]; return `<rect x="${40 + i * 200}" y="220" width="150" height="460" rx="12" fill="#1a1030" stroke="hsl(${hue},100%,60%)" stroke-width="4"/><rect x="${60 + i * 200}" y="260" width="110" height="120" fill="hsl(${hue},90%,45%)" opacity=".8" class="flick"/><rect x="${20 + i * 200}" y="200" width="190" height="220" fill="hsl(${hue},100%,60%)" opacity=".12" filter="url(#bl20)"/><circle cx="${90 + i * 200}" cy="430" r="10" fill="#ff3355"/><circle cx="${130 + i * 200}" cy="430" r="10" fill="#3dd8ff"/>`; }).join('')}
        <text x="800" y="140" font-size="90" font-family="sans-serif" font-weight="900" text-anchor="middle" fill="none" stroke="#ff3dd8" stroke-width="4" class="glowpulse">GAME ZONE</text>
        <rect y="680" width="1600" height="220" fill="#12081e"/>${[...Array(30)].map(() => `<rect x="${r() * 1600}" y="${700 + r() * 180}" width="18" height="18" fill="hsl(${(r() * 360) | 0},80%,50%)" opacity=".25"/>`).join('')}`);
    }
  };
  const shards = (r, n, x0, x1, y0, y1, col = '#9ff6ff') => { let o = ''; for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), h = 40 + r() * 160, w = 12 + r() * 30; o += `<polygon points="${x | 0},${(y - h) | 0} ${(x + w) | 0},${y | 0} ${x | 0},${(y + h * .25) | 0} ${(x - w) | 0},${y | 0}" fill="${col}" opacity="${(.35 + r() * .5).toFixed(2)}" stroke="#e8ffff" stroke-width="1.5"/>`; } return o; };
  Object.assign(BG, {
    mall() {
      const r = rng(51);
      return svgWrap(grad('ml', ['#dff4ff', '#bfe0f4', '#f4efe8']),
        `<rect width="1600" height="900" fill="url(#ml)"/>${[...Array(9)].map((_, i) => `<path d="M${i * 200},0 L800,-200" stroke="#9cc4dc" stroke-width="3"/>`).join('')}
        <path d="M0,120 Q800,-80 1600,120" fill="none" stroke="#8fb4cc" stroke-width="10"/>${[...Array(16)].map((_, i) => `<path d="M${i * 100},${120 - Math.sin(i / 15 * Math.PI) * 170} L${i * 100},380" stroke="#a9c9dc" stroke-width="4"/>`).join('')}
        ${[0, 1].map(k => `<rect x="0" y="${380 + k * 170}" width="1600" height="26" fill="#e8eef2"/><rect x="0" y="${406 + k * 170}" width="1600" height="8" fill="#b8c6d0"/>${[...Array(8)].map((_, i) => `<rect x="${40 + i * 200}" y="${414 + k * 170}" width="150" height="120" fill="hsl(${(i * 47 + k * 90) % 360},60%,${80 - k * 6}%)"/><rect x="${55 + i * 200}" y="${430 + k * 170}" width="120" height="16" fill="#fff" opacity=".8"/>`).join('')}`).join('')}
        <rect y="720" width="1600" height="180" fill="#e6e0d6"/><ellipse cx="800" cy="780" rx="260" ry="40" fill="#bfe8ff" opacity=".6"/>${shards(r, 14, 100, 1500, 600, 880)}
        <rect x="0" y="0" width="1600" height="900" fill="#fff" opacity=".12"/>`);
    },
    stage() {
      const r = rng(61);
      return svgWrap(grad('st', ['#0a0420', '#2a0a4a', '#4a1060']),
        `<rect width="1600" height="900" fill="url(#st)"/>${[...Array(7)].map((_, i) => `<path d="M${200 + i * 200},0 L${60 + i * 240},760 L${340 + i * 180},760Z" fill="hsl(${[300, 190, 50, 330, 260, 170, 20][i]},100%,70%)" opacity=".13" class="glowpulse" style="animation-delay:${i * .3}s"/>`).join('')}
        <rect x="200" y="560" width="1200" height="60" fill="#1a0a2a"/><rect x="200" y="556" width="1200" height="8" fill="#ff6fae"/>
        <text x="800" y="200" text-anchor="middle" font-size="120" font-family="sans-serif" font-weight="900" fill="none" stroke="#ffd6ea" stroke-width="4" opacity=".6">STELLAR ★</text>
        <rect y="620" width="1600" height="280" fill="#07030f"/>${[...Array(160)].map(() => `<circle cx="${r() * 1600}" cy="${660 + r() * 240}" r="${3 + r() * 5}" fill="hsl(${(r() * 360) | 0},100%,70%)" opacity=".8" class="twinkle"/>`).join('')}`);
    },
    glass_city() {
      const r = rng(71);
      return svgWrap(grad('gc', ['#03101a', '#0a2a3a', '#1a4a5a']),
        `<rect width="1600" height="900" fill="url(#gc)"/>${stars(r, 60, 300)}${skyline(r, 720, 150, 420, '#0b2230', '#7ff6ff', .12)}${shards(r, 26, 0, 1600, 400, 760)}
        ${skyline(r, 840, 60, 260, '#061620', '#9ff6ff', .15)}<rect y="840" width="1600" height="60" fill="#030a10"/>${shards(r, 12, 0, 1600, 800, 900, '#bff')}
        <rect width="1600" height="900" fill="#5fe6ff" opacity=".06"/>`);
    },
    rift() {
      const r = rng(81);
      let bld = ''; for (let i = 0; i < 14; i++) { const x = r() * 1600, y = 100 + r() * 500, w = 40 + r() * 80, h = 80 + r() * 200, a = (r() - .5) * 60; bld += `<g transform="rotate(${a | 0} ${x | 0} ${y | 0})" class="drift"><rect x="${x | 0}" y="${y | 0}" width="${w | 0}" height="${h | 0}" fill="#1a0a2a" stroke="#ff6fd8" stroke-width="2" opacity=".85"/>${[...Array(6)].map(() => `<rect x="${(x + 6 + r() * (w - 16)) | 0}" y="${(y + 6 + r() * (h - 16)) | 0}" width="6" height="8" fill="#9ff6ff"/>`).join('')}</g>`; }
      return svgWrap('<radialGradient id="rf" cx=".5" cy=".45"><stop offset="0" stop-color="#fff"/><stop offset=".08" stop-color="#ff9ae8"/><stop offset=".35" stop-color="#5a1a8a"/><stop offset="1" stop-color="#05020f"/></radialGradient>',
        `<rect width="1600" height="900" fill="url(#rf)"/>${[...Array(18)].map((_, i) => `<path d="M800,400 L${800 + Math.cos(i / 18 * 6.28) * 1400},${400 + Math.sin(i / 18 * 6.28) * 1400}" stroke="#ff9ae8" stroke-width="${1 + (i % 3)}" opacity=".35"/>`).join('')}
        ${bld}${shards(r, 30, 0, 1600, 0, 900, '#e8ccff')}<ellipse cx="800" cy="400" rx="140" ry="220" fill="none" stroke="#fff" stroke-width="6" class="glowpulse"/>`);
    }
  });
  function bg(name) { return (BG[name] || BG.black)(); }

  // ---------- CGs / special scenes ----------
  const big = (id, emo, pose, style, of) => `<div class="cgchar" style="${style}">${char(id, emo, pose, false, of)}</div>`;
  const bolts = n => { let s = ''; const r = rng(n); for (let k = 0; k < 3; k++) { let x = 700 + k * 120 + r() * 80, y = -20, d = `M${x},${y}`; while (y < 780) { y += 40 + r() * 60; x += (r() - .5) * 140; d += ` L${x | 0},${y | 0}`; } s += `<path d="${d}" stroke="#fff" stroke-width="${10 - k * 2}" fill="none" class="bolt" style="animation-delay:${k * .12}s"/><path d="${d}" stroke="#7fd8ff" stroke-width="${30 - k * 6}" fill="none" opacity=".4" filter="url(#bl8)" class="bolt" style="animation-delay:${k * .12}s"/>`; } return `<svg class="cgfx" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><filter id="bl8"><feGaussianBlur stdDeviation="8"/></filter></defs>${s}</svg>`; };
  const tendrils = () => `<svg class="cgfx" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${[...Array(9)].map((_, i) => `<path class="tendril" style="animation-delay:${i * .15}s" d="M${400 + i * 90},900 C${300 + i * 110},${600 - i * 20} ${700 + i * 40},${500 - i * 30} ${780 + i * 30},${220 + i * 30}" stroke="#3a1a6a" stroke-width="${26 - i}" fill="none" stroke-linecap="round" opacity=".9"/>`).join('')}</svg>`;
  const CG = {
    cg_strike: () => bg('street_night') + `<div class="cgmon" style="right:4%;bottom:6%;width:48%">${monster()}</div>` + bolts(3) + `<div class="cgflash"></div>` + big('hikari', 'angry', 'fist', 'left:-4%;bottom:-62%;height:160%;transform:rotate(-5deg)') + '<div class="speedlines on"></div>',
    cg_recruit: () => bg('street_night') + `<div class="beams"></div>` + big('aya', 'smug', 'point', 'left:50%;bottom:-70%;height:165%;transform:translateX(-50%);filter:drop-shadow(0 0 30px #000)') + `<div class="cgtint" style="background:linear-gradient(transparent 40%,rgba(10,0,20,.6))"></div>`,
    cg_shadow: () => bg('training') + `<div class="cgtint" style="background:radial-gradient(circle at 50% 80%,rgba(80,30,160,.3),rgba(5,0,15,.85) 70%)"></div>` + tendrils() + `<div class="shadowpool"></div>` + big('rei', 'smug', 'cross', 'left:50%;bottom:-70%;height:165%;transform:translateX(-50%)') + `<div class="cgtint" style="background:linear-gradient(0deg,rgba(20,0,40,.9),transparent 45%)"></div>`,
    cg_leviathan: () => bg('harbor') + `<div class="cgmon rise" style="left:10%;bottom:-5%;width:80%">${monster(true)}</div><div class="cgtint" style="background:linear-gradient(0deg,rgba(60,0,10,.7),transparent 60%)"></div>`,
    cg_combo: () => bg('harbor') + `<div class="cgmon" style="left:26%;bottom:0;width:50%">${monster(true)}</div>` + tendrils() + bolts(9) + `<div class="cgflash"></div>` + big('rei', 'determined', 'point', 'left:-8%;bottom:-62%;height:150%') + big('hikari', 'angry', 'fist', 'right:-8%;bottom:-62%;height:150%;transform:scaleX(-1)') + '<div class="speedlines on"></div>',
    cg_roof_hikari: () => bg('rooftop') + big('hikari', 'love', 'shy', 'left:50%;bottom:-112%;height:210%;transform:translateX(-50%)') + `<div class="cgtint" style="background:linear-gradient(0deg,rgba(255,120,80,.25),transparent)"></div>`,
    cg_roof_rei: () => bg('rooftop') + `<div class="cgtint" style="background:rgba(40,10,80,.45)"></div>` + big('rei', 'tender', 'shy', 'left:50%;bottom:-112%;height:210%;transform:translateX(-50%)'),
    cg_roof_mira: () => bg('rooftop') + big('mira', 'blush', 'shy', 'left:50%;bottom:-112%;height:210%;transform:translateX(-50%)') + `<div class="cgtint" style="background:linear-gradient(0deg,rgba(255,150,190,.25),transparent)"></div>`,
    cg_glazier: () => bg('black') + `<div class="glazier"><svg viewBox="0 0 400 600"><defs><linearGradient id="gz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ff"/><stop offset="1" stop-color="#206"/></linearGradient></defs><path d="M200,60 C150,60 130,120 140,170 C100,190 60,260 50,600 L350,600 C340,260 300,190 260,170 C270,120 250,60 200,60Z" fill="#05030a" stroke="url(#gz)" stroke-width="3"/><path d="M160,140 l30,8 l-30,6z M240,140 l-30,8 l30,6z" fill="#7ff"/>${[...Array(10)].map((_, i) => `<polygon points="${60 + i * 30},${320 + (i % 3) * 60} ${75 + i * 30},${290 + (i % 3) * 60} ${90 + i * 30},${330 + (i % 3) * 60}" fill="#9ff" opacity=".5" class="twinkle"/>`).join('')}</svg></div>`
  };
  const endCg = (id, bgn, tint) => () => bg(bgn) + (tint ? `<div class="cgtint" style="background:${tint}"></div>` : '') + big(id, 'love', 'shy', 'left:50%;bottom:-112%;height:210%;transform:translateX(-50%)');
  Object.assign(CG, {
    cg_mall: () => bg('mall') + `<div class="cgtint" style="background:radial-gradient(circle at 50% 40%,transparent,rgba(0,40,60,.6))"></div>` + big('kyouya', 'smug', 'point', 'left:50%;bottom:-70%;height:165%;transform:translateX(-50%)') + `<div class="cgtint" style="background:linear-gradient(0deg,rgba(95,230,255,.25),transparent 50%)"></div>`,
    cg_kaede_save: () => bg('glass_city') + `<div class="speedlines on"></div>` + big('kaede', 'surprised', 'shy', 'left:8%;bottom:-40%;height:140%;transform:rotate(-12deg)') + big('hikari', 'determined', 'point', 'right:4%;bottom:-62%;height:160%') + `<div class="cgflash"></div>`,
    cg_bit: () => bg('ops') + `<div class="cgtint" style="background:rgba(120,0,20,.55)"></div><div class="cgchar" style="left:50%;bottom:-6%;height:80%;transform:translateX(-50%);filter:hue-rotate(160deg) saturate(2) drop-shadow(0 0 30px red)">${bit('angry')}</div><div class="speedlines on" style="filter:hue-rotate(300deg)"></div>`,
    cg_reveal: () => bg('rift') + big('kyouya', 'sad', 'default', 'left:50%;bottom:-112%;height:210%;transform:translateX(-50%)') + `<div class="cgtint" style="background:linear-gradient(0deg,rgba(40,0,60,.5),transparent)"></div>`,
    cg_final: () => bg('rift') + ['tetsu', 'rei', 'hikari', 'sora', 'kaede'].map((id, i) => big(id, 'determined', i === 2 ? 'fist' : i % 2 ? 'cross' : 'hip', `left:${[-4, 14, 34, 54, 72][i]}%;bottom:-58%;height:${i === 2 ? 150 : 130}%;z-index:${i === 2 ? 3 : 1}`)).join('') + `<div class="speedlines on"></div>`,
    cg_roof_sora: endCg('sora', 'rooftop', 'linear-gradient(0deg,rgba(180,140,255,.3),transparent)'),
    cg_end_hikari: endCg('hikari', 'park'), cg_end_kaede: endCg('kaede', 'park', 'linear-gradient(0deg,rgba(94,240,160,.2),transparent)'), cg_end_rei: endCg('rei', 'rooftop', 'rgba(20,10,60,.5)'), cg_end_mira: endCg('mira', 'cafe'), cg_end_sora: endCg('sora', 'stage'),
    cg_end_squad: () => bg('park') + ['tetsu', 'kaede', 'hikari', 'rei', 'sora', 'mira'].map((id, i) => big(id, i === 3 ? 'smile' : 'happy', ['cross', 'hip', 'wave', 'cross', 'wave', 'shy'][i], `left:${-6 + i * 16}%;bottom:-62%;height:135%;z-index:${i === 2 ? 3 : 1}`)).join('')
  });
  const CG_NAMES = { cg_strike: 'Thunder Goddess Stomp', cg_recruit: 'The Director', cg_shadow: 'From the Shadows', cg_leviathan: 'Glass Leviathan', cg_combo: 'Shadow & Lightning', cg_roof_hikari: 'Sunset Promise (Hikari)', cg_roof_rei: 'Twilight Confession (Rei)', cg_roof_mira: 'A Healer\'s Wish (Mira)', cg_glazier: 'The Glazier', cg_mall: 'Hall of Mirrors', cg_kaede_save: 'Catch!', cg_bit: 'System Breach', cg_reveal: 'Kyouya', cg_final: 'Operation Heartline', cg_roof_sora: 'Gravity of Love (Sora)', cg_end_hikari: 'Forever Partners (Hikari)', cg_end_rei: 'Out of the Shadows (Rei)', cg_end_mira: 'Healing Hearts (Mira)', cg_end_sora: 'Encore (Sora)', cg_end_kaede: 'Slow Down (Kaede)', cg_end_squad: 'Squad Zero, Forever' };
  function cg(name) { return `<div class="cgscene">${(CG[name] || CG.cg_strike)()}</div>`; }

  return { char, bg, cg, CG_NAMES, CH, monster, bit, _h: { svgWrap, grad, skyline, stars, rng, tree, shards, BG, CG, big, bolts, tendrils } };
})();

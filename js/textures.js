import { THREE } from './engine.js';

// Procedural low-res textures (drawn on canvases, nearest-filtered for that PS1 crunch)
const cache = new Map();
export function canvasTex(key, w, h, draw, { nearest = true, repeat = true } = {}) {
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (nearest) { t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapNearestFilter; }
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  cache.set(key, t);
  return t;
}
function speckle(g, w, h, n, colors, size = 1) {
  for (let i = 0; i < n; i++) { g.fillStyle = colors[(Math.random() * colors.length) | 0]; g.fillRect((Math.random() * w) | 0, (Math.random() * h) | 0, size, size); }
}
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) * f) | 0, gg = Math.min(255, ((n >> 8) & 255) * f) | 0, b = Math.min(255, (n & 255) * f) | 0;
  return `rgb(${r},${gg},${b})`;
}

export const T = {
  tiles: (a = '#cfc8b6', b = '#8f9a8c') => canvasTex('tiles' + a + b, 32, 32, (g, w, h) => {
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) { g.fillStyle = (x + y) % 2 ? a : b; g.fillRect(x * 16, y * 16, 16, 16); }
    speckle(g, w, h, 120, ['#0001', '#fff2', '#0002']);
    g.fillStyle = '#0003'; g.fillRect(0, 0, 32, 1); g.fillRect(0, 0, 1, 32); g.fillRect(0, 16, 32, 1); g.fillRect(16, 0, 1, 32);
  }),
  block: (c = '#d9d0b8') => canvasTex('block' + c, 32, 32, (g, w, h) => {
    g.fillStyle = c; g.fillRect(0, 0, w, h);
    speckle(g, w, h, 160, ['#0001', '#fff1']);
    g.fillStyle = '#0002';
    for (let y = 0; y < 4; y++) { g.fillRect(0, y * 8, w, 1); const o = y % 2 ? 8 : 0; for (let x = 0; x < 2; x++) g.fillRect(o + x * 16, y * 8, 1, 8); }
  }),
  ceiling: () => canvasTex('ceil', 32, 32, (g, w, h) => {
    g.fillStyle = '#d8d6cc'; g.fillRect(0, 0, w, h); speckle(g, w, h, 200, ['#0002', '#0001']);
    g.fillStyle = '#9993'; g.fillRect(0, 0, w, 1); g.fillRect(0, 0, 1, h);
  }),
  wood: (c = '#7a4e2c') => canvasTex('wood' + c, 64, 64, (g, w, h) => {
    for (let i = 0; i < 8; i++) { g.fillStyle = shade(c, 0.8 + (i % 3) * 0.12); g.fillRect(0, i * 8, w, 8); g.fillStyle = '#0003'; g.fillRect(0, i * 8, w, 1); g.fillRect(((i * 23) % 64), i * 8, 1, 8); }
    for (let i = 0; i < 80; i++) { g.fillStyle = '#0001'; g.fillRect(Math.random() * w, Math.random() * h, 6 + Math.random() * 10, 1); }
  }),
  court: () => canvasTex('court', 256, 256, (g, w, h) => {
    for (let i = 0; i < 32; i++) { g.fillStyle = i % 2 ? '#c9965a' : '#bf8b50'; g.fillRect(0, i * 8, w, 8); }
    for (let i = 0; i < 400; i++) { g.fillStyle = '#0000000d'; g.fillRect(Math.random() * w, Math.random() * h, 10, 1); }
    g.strokeStyle = '#f4efe2'; g.lineWidth = 2;
    g.strokeRect(12, 12, w - 24, h - 24);
    g.beginPath(); g.moveTo(w / 2, 12); g.lineTo(w / 2, h - 12); g.stroke();
    g.beginPath(); g.arc(w / 2, h / 2, 26, 0, 7); g.stroke();
    g.fillStyle = '#7a2320'; g.beginPath(); g.arc(w / 2, h / 2, 12, 0, 7); g.fill();
    for (const side of [0, 1]) {
      const x = side ? w - 12 : 12, dir = side ? -1 : 1;
      g.fillStyle = '#7a232088'; g.fillRect(side ? x - 50 : x, h / 2 - 22, 50, 44);
      g.strokeRect(side ? x - 50 : x, h / 2 - 22, 50, 44);
      g.beginPath(); g.arc(x, h / 2, 90, -Math.PI / 2, Math.PI / 2, side === 1); g.stroke();
      g.beginPath(); g.arc(x + dir * 50, h / 2, 22, 0, 7); g.stroke();
    }
  }, { repeat: false }),
  lockers: (c = '#355d8a') => canvasTex('lock' + c, 64, 64, (g, w, h) => {
    g.fillStyle = c; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      g.fillStyle = '#0005'; g.fillRect(i * 16, 0, 1, h);
      g.fillStyle = '#0003'; for (let s = 0; s < 4; s++) g.fillRect(i * 16 + 4, 6 + s * 3, 8, 1);
      g.fillStyle = '#ccc'; g.fillRect(i * 16 + 12, 30, 2, 5);
    }
    speckle(g, w, h, 60, ['#fff2', '#0002']);
  }),
  wallpaper: () => canvasTex('wallp', 64, 64, (g, w, h) => {
    g.fillStyle = '#8d8f95'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 700; i++) { g.fillStyle = Math.random() < 0.5 ? '#6d6f78' : '#a9abb0'; g.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 1 + Math.random() * 2); }
    g.fillStyle = '#5a5c64';
    for (let i = 0; i < 12; i++) { const x = (i * 37) % 64, y = (i * 23) % 64; g.fillRect(x, y, 3, 8); g.fillRect(x - 2, y + 3, 7, 2); }
  }),
  plaster: (c = '#bfb6a4') => canvasTex('plast' + c, 32, 32, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); speckle(g, w, h, 180, ['#0001', '#fff1', '#0002']); }),
  rug: () => canvasTex('rug', 128, 128, (g, w, h) => {
    g.fillStyle = '#e5d9bf'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#7b1f1e'; g.fillRect(8, 8, w - 16, h - 16);
    g.fillStyle = '#e5d9bf';
    for (let y = 16; y < h - 16; y += 16) for (let x = 16; x < w - 16; x += 16) { g.fillRect(x + 5, y + 2, 6, 12); g.fillRect(x + 2, y + 5, 12, 6); g.fillStyle = '#b3423a'; g.fillRect(x + 6, y + 6, 4, 4); g.fillStyle = '#e5d9bf'; }
    g.strokeStyle = '#2b3f5c'; g.lineWidth = 3; g.strokeRect(12, 12, w - 24, h - 24);
    speckle(g, w, h, 500, ['#0002', '#fff1']);
  }, { repeat: false }),
  brick: () => canvasTex('brick', 64, 64, (g, w, h) => {
    g.fillStyle = '#7d8088'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) { g.fillStyle = shade('#8b3a2c', 0.8 + Math.random() * 0.35); g.fillRect(x * 16 + (y % 2 ? 8 : 0) + 1, y * 8 + 1, 14, 6); }
  }),
  grass: () => canvasTex('grass', 32, 32, (g, w, h) => { g.fillStyle = '#4c6b2f'; g.fillRect(0, 0, w, h); speckle(g, w, h, 300, ['#3b5725', '#5f833a', '#6c8f45']); }),
  asphalt: () => canvasTex('asph', 32, 32, (g, w, h) => { g.fillStyle = '#44454a'; g.fillRect(0, 0, w, h); speckle(g, w, h, 300, ['#35363a', '#55565c', '#2c2c30']); }),
  road: () => canvasTex('road', 32, 64, (g, w, h) => {
    g.fillStyle = '#3a3b40'; g.fillRect(0, 0, w, h); speckle(g, w, h, 300, ['#2f3034', '#4a4b50']);
    g.fillStyle = '#d9c35a'; g.fillRect(15, 0, 2, 28);
  }),
  chalk: (lines) => canvasTex('chalk' + lines.join('|'), 256, 96, (g, w, h) => {
    g.fillStyle = '#23372b'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, 400, ['#ffffff08', '#ffffff12']);
    g.fillStyle = '#e8ecdf'; g.font = '14px "Comic Sans MS", cursive'; g.textBaseline = 'top';
    lines.forEach((l, i) => { g.globalAlpha = 0.85; g.fillText(l, 12, 10 + i * 18); });
    g.globalAlpha = 1;
  }, { repeat: false }),
  sign: (text, bg = '#1d2d5c', fg = '#f2d45c', w = 128, h = 32, font = 16) => canvasTex('sign' + text + bg + fg + w, w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.font = `bold ${font}px "Courier New", monospace`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const lines = text.split('\n'); lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * (font + 2)));
  }, { repeat: false }),
  poster: (title, sub, bg, fg = '#fff') => canvasTex('post' + title + sub, 64, 96, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.font = 'bold 10px sans-serif'; g.textAlign = 'center';
    title.split('\n').forEach((l, i) => g.fillText(l, w / 2, 16 + i * 11));
    g.font = '8px sans-serif'; sub.split('\n').forEach((l, i) => g.fillText(l, w / 2, 70 + i * 9));
    g.strokeStyle = fg; g.strokeRect(4, 4, w - 8, h - 8);
  }, { repeat: false }),
  sky: (top, mid, bottom) => canvasTex('sky' + top + mid + bottom, 4, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(0.5, mid); gr.addColorStop(1, bottom);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }, { nearest: false, repeat: false }),
  moon: (red = false) => canvasTex('moon' + red, 64, 64, (g, w, h) => {
    const gr = g.createRadialGradient(28, 28, 4, 32, 32, 32);
    gr.addColorStop(0, red ? '#ffb08a' : '#fffbe8'); gr.addColorStop(1, red ? '#b8322a' : '#d9cfa8');
    g.fillStyle = gr; g.beginPath(); g.arc(32, 32, 31, 0, 7); g.fill();
    g.fillStyle = red ? '#7a1a1a55' : '#8a806055';
    [[20, 22, 7], [40, 30, 5], [30, 44, 8], [44, 46, 4], [16, 38, 4]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); });
  }, { nearest: false, repeat: false }),
  fur: () => canvasTex('fur', 32, 32, (g, w, h) => {
    g.fillStyle = '#3a2a24'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { g.fillStyle = ['#2a1c18', '#4b372e', '#1c1210'][i % 3]; g.fillRect(Math.random() * w, Math.random() * h, 1, 3 + Math.random() * 3); }
  }),
  fabric: (c) => canvasTex('fab' + c, 16, 16, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); speckle(g, w, h, 60, ['#0002', '#fff1']); }),
  note: () => canvasTex('note', 32, 40, (g, w, h) => {
    g.fillStyle = '#efe6cf'; g.fillRect(0, 0, w, h); g.fillStyle = '#7da2c9';
    for (let y = 6; y < h; y += 4) g.fillRect(0, y, w, 1);
    g.fillStyle = '#c33'; g.fillRect(5, 0, 1, h);
    g.fillStyle = '#333'; for (let y = 7; y < h - 4; y += 4) g.fillRect(8, y - 2, 6 + Math.random() * 18, 1);
  }, { repeat: false }),
  monkeyDrawing: () => canvasTex('mdraw', 64, 80, (g, w, h) => {
    g.fillStyle = '#efe6cf'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#222'; g.lineWidth = 1.5;
    g.beginPath(); g.ellipse(32, 52, 20, 22, 0, 0, 7); g.stroke();
    g.beginPath(); g.arc(32, 24, 12, 0, 7); g.stroke();
    g.beginPath(); g.arc(20, 20, 4, 0, 7); g.arc(44, 20, 4, 0, 7); g.stroke();
    g.fillStyle = '#c22'; g.fillRect(27, 21, 3, 3); g.fillRect(35, 21, 3, 3);
    g.strokeStyle = '#d4a017'; g.beginPath(); g.arc(32, 12, 5, 0.3, Math.PI - 0.3); g.stroke();
    g.fillStyle = '#222'; g.font = '7px sans-serif'; g.fillText('HE IS HUNGRY', 6, 77);
  }, { repeat: false }),
};

// Sky dome
export function skyDome(top, mid, bottom, radius = 180) {
  const geo = new THREE.SphereGeometry(radius, 16, 12);
  const m = new THREE.MeshBasicMaterial({ map: T.sky(top, mid, bottom), side: THREE.BackSide, fog: false, depthWrite: false });
  const mesh = new THREE.Mesh(geo, m);
  mesh.renderOrder = -10;
  return mesh;
}

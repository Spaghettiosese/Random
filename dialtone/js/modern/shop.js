import { A } from '../audio.js';

export const KEYBOARDS = [
  { id: 'stock', name: 'Office Membrane', price: 0, sound: 'soft', blurb: 'Came free with the PC. Mushy. Quiet. Sad.', style: { cap: 0x1d1f23, mod: 0x15171a, legend: '#cfd3d8', legendMod: '#9aa0a8', base: 0x111214, h: 0.7 } },
  { id: 'viper', name: 'Viper RGB 75%', price: 120, sound: 'click', blurb: 'Hot-swap red switches. Per-key rainbow wave.', style: { cap: 0x151518, mod: 0x151518, legend: '#ffffff', legendMod: '#ffffff', base: 0x0c0c0e, rgb: true, rough: 0.35 } },
  { id: 'retro', name: 'Retro 1999 Beige', price: 180, sound: 'blue', blurb: 'The keyboard from Dec 31, 1999. Loud and proud.', style: {} },
  { id: 'cream', name: 'Creamsicle Thock', price: 260, sound: 'thock', blurb: 'Gasket mount, lubed linears, deep marbly thock.', style: { cap: 0xf3ebdd, mod: 0x86b6cf, legend: '#4d5f6b', legendMod: '#ffffff', base: 0xe9dcc6, h: 1.25, rough: 0.7 } },
  { id: 'neon', name: 'Neon Runner', price: 340, sound: 'thock', blurb: 'Cyberpunk purple with hot-pink mods and glowing legends.', style: { cap: 0x24123f, mod: 0xff2d95, legend: '#39ffe6', legendMod: '#1a0f2e', base: 0x120a22, rgb: true } },
  { id: 'brass', name: 'Brass Typewriter', price: 420, sound: 'type', blurb: 'Round keys, brass frame, a bell on every Enter.', style: { cap: 0x141414, mod: 0x141414, legend: '#f2eadc', legendMod: '#f2eadc', base: 0x8a6a2a, round: true, h: 1.4, rough: 0.3 } },
  { id: 'ghost', name: 'Ghost Clear', price: 600, sound: 'blue', blurb: 'See-through caps with RGB bleeding through.', style: { cap: 0xffffff, mod: 0xdfe8ff, legend: '#223', legendMod: '#223', base: 0xdfe4ea, rgb: true, clear: true, rough: 0.15 } },
];
const hex = (n) => '#' + n.toString(16).padStart(6, '0');

export class KeyShop {
  constructor(os) { this.os = os; this.full = true; this.hover = -1; }
  draw(g, w, h) {
    const os = this.os, t = os.t;
    const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#0e1118'); bg.addColorStop(1, '#1b1428'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.font = 'bold 30px Arial'; g.fillText('KeyShop', 32, 52);
    g.fillStyle = '#8a93a6'; g.font = '14px Arial'; g.fillText('Earn coins by playing games. Buy a board, equip it, and it swaps on your real desk.', 32, 76);
    this.coin(g, w - 170, 34, 13); g.fillStyle = '#ffd24a'; g.font = 'bold 22px Arial'; g.fillText(os.coins, w - 150, 42);
    g.fillStyle = '#556'; g.font = '12px Arial'; g.fillText('press Esc to close', w - 150, 62);
    this.cards = [];
    KEYBOARDS.forEach((k, i) => {
      const cw = 212, ch = 196, x = 32 + (i % 4) * (cw + 14), y = 96 + Math.floor(i / 4) * (ch + 14);
      const own = os.owned.includes(k.id), eq = os.equipped === k.id, hov = this.hover === i;
      g.fillStyle = hov ? '#232a3a' : '#191e2a'; g.beginPath(); g.roundRect(x, y, cw, ch, 10); g.fill();
      if (eq) { g.strokeStyle = '#4ade80'; g.lineWidth = 2; g.stroke(); g.lineWidth = 1; }
      // mini keyboard preview
      const s = k.style, cap = hex(s.cap ?? 0xe0d8c3), mod = hex(s.mod ?? 0x9a968b), base = hex(s.base ?? 0xd6ceb8);
      g.fillStyle = base; g.beginPath(); g.roundRect(x + 14, y + 14, cw - 28, 74, 6); g.fill();
      for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) {
        const kx = x + 20 + c * 12.4, ky = y + 20 + r * 13;
        g.fillStyle = s.rgb ? `hsl(${(c * 20 + r * 10 + t * 90) % 360},90%,${s.clear ? 70 : 55}%)` : (c === 0 || c === 13 || r === 4 && (c < 3 || c > 10)) ? mod : cap;
        if (s.round) { g.beginPath(); g.arc(kx + 5, ky + 5, 5, 0, 7); g.fill(); } else g.fillRect(kx, ky, 10.5, 11);
        if (s.rgb && !s.clear) { g.fillStyle = cap; g.fillRect(kx + 1.5, ky + 1.5, 7.5, 8); }
      }
      g.fillStyle = '#fff'; g.font = 'bold 15px Arial'; g.fillText(k.name, x + 14, y + 110);
      g.fillStyle = '#8a93a6'; g.font = '12px Arial';
      const words = k.blurb.split(' '); let line = '', ly = y + 130;
      for (const wd of words) { if (g.measureText(line + wd).width > cw - 28) { g.fillText(line, x + 14, ly); line = ''; ly += 15; } line += wd + ' '; } g.fillText(line, x + 14, ly);
      g.fillStyle = '#6b7488'; g.font = '11px Arial'; g.fillText('sound: ' + { soft: 'membrane', click: 'clicky', blue: 'clicky blue', thock: 'thocky', type: 'typewriter' }[k.sound], x + 14, y + 168);
      const bx = x + cw - 96, by = y + ch - 38;
      const label = eq ? 'Equipped' : own ? 'Equip' : `Buy  ${k.price}`, can = own || os.coins >= k.price;
      g.fillStyle = eq ? '#1f3a2a' : own ? '#2563eb' : can ? '#f59e0b' : '#3a3f4a'; g.beginPath(); g.roundRect(bx, by, 84, 26, 6); g.fill();
      g.fillStyle = eq ? '#4ade80' : '#fff'; g.font = 'bold 12px Arial'; g.textAlign = 'center'; g.fillText(label, bx + 42, by + 17); g.textAlign = 'left';
      this.cards.push({ r: [x, y, cw, ch], b: [bx, by, 84, 26], k, own, can });
    });
    g.fillStyle = '#556'; g.font = '12px Arial'; g.fillText('Coins: Blockcraft +2 per 5 blocks · Brickverse +5 checkpoint, +50 finish · Duty Calls +10 per kill · KeyStorm +WPM', 32, h - 16);
  }
  coin(g, x, y, r) { g.fillStyle = '#f5b400'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(x, y, r * 0.72, 0, 7); g.fill(); g.fillStyle = '#c98a00'; g.font = `bold ${r}px Arial`; g.textAlign = 'center'; g.fillText('K', x, y + r * 0.38); g.textAlign = 'left'; }
  mouse(type, x, y) {
    const inR = (r) => x >= r[0] && y >= r[1] && x < r[0] + r[2] && y < r[1] + r[3];
    this.hover = (this.cards || []).findIndex(c => inR(c.r));
    if (type !== 'down') return;
    const c = (this.cards || []).find(c => inR(c.b)); if (!c) return;
    const os = this.os;
    if (!c.own) { if (!c.can) { A.beep(150, 0.12, 0.12, 'sawtooth'); return; } os.coins -= c.k.price; os.owned.push(c.k.id); A.pickup(); }
    os.equip(c.k.id);
  }
}

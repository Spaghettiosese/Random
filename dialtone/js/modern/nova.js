// "Nova" — the modern desktop OS on the gaming PC. 960x540 canvas.
import { A } from '../audio.js';
import { icon as retroIcon } from '../ui.js';
import { Blockcraft } from './blockcraft.js';
import { Brickverse } from './brickverse.js';
import { DutyCalls } from './dutycalls.js';
import { KeyShop, KEYBOARDS } from './shop.js';
import { Snake } from '../apps/snake.js';
import { Typer } from '../apps/typer.js';
import { Tube } from '../apps/tube.js';
import { Doom } from '../apps/doom.js';

const inside = (x, y, r) => x >= r[0] && y >= r[1] && x < r[0] + r[2] && y < r[1] + r[3];
const COVERS = {
  blockcraft(g, w, h) {
    g.fillStyle = '#7fc4ff'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 16) { const top = h * 0.55 + Math.round(Math.sin(x * 0.05) * 2) * 16; for (let y = top; y < h; y += 16) { g.fillStyle = y === top ? (x / 16 % 2 ? '#5fa83a' : '#4e9430') : y < top + 48 ? (x / 16 % 2 ? '#6b4a2e' : '#5a3d25') : '#7d7d80'; g.fillRect(x, y, 16, 16); } }
    g.fillStyle = '#6b4f2a'; g.fillRect(w * 0.7, h * 0.3, 14, h * 0.26); g.fillStyle = '#3f7a2e'; g.fillRect(w * 0.7 - 22, h * 0.12, 58, 34);
  },
  brickverse(g, w, h, t) {
    g.fillStyle = '#9fd4ff'; g.fillRect(0, 0, w, h);
    [['#e8384f', 20, 70], ['#fdd835', 80, 55], ['#3c8dff', 140, 40], ['#33c16b', 190, 60]].forEach(([c, x, y]) => { g.fillStyle = c; g.fillRect(x * w / 240, y * h / 140, 44, 16); g.fillStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 3; i++) g.fillRect(x * w / 240 + 5 + i * 13, y * h / 140 - 3, 8, 3); });
    g.fillStyle = '#ff4a1a'; g.fillRect(0, h - 22, w, 22);
    const cx = w * 0.45, cy = h * 0.3 - Math.abs(Math.sin(t * 3)) * 6; g.fillStyle = '#ffd23f'; g.fillRect(cx, cy, 20, 20); g.fillStyle = '#111'; g.fillRect(cx + 5, cy + 6, 3, 4); g.fillRect(cx + 12, cy + 6, 3, 4); g.fillStyle = '#1f6fd1'; g.fillRect(cx - 4, cy + 20, 28, 22);
  },
  duty(g, w, h) {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a1a10'); gr.addColorStop(0.6, '#d9803a'); gr.addColorStop(1, '#3a2a1a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffd08a'; g.beginPath(); g.arc(w * 0.7, h * 0.58, 22, 0, 7); g.fill();
    g.fillStyle = '#120c08'; g.fillRect(0, h * 0.72, w, h); g.beginPath(); g.moveTo(w * 0.22, h); g.lineTo(w * 0.26, h * 0.38); g.lineTo(w * 0.3, h * 0.3); g.lineTo(w * 0.36, h * 0.38); g.lineTo(w * 0.4, h); g.fill(); g.fillRect(w * 0.34, h * 0.44, 60, 7);
  },
  shop(g, w, h, t) { g.fillStyle = '#1b1428'; g.fillRect(0, 0, w, h); for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) { g.fillStyle = `hsl(${(c * 30 + r * 15 + t * 80) % 360},85%,58%)`; g.fillRect(18 + c * 23, 24 + r * 22, 19, 18); } },
  doom(g, w, h) { g.fillStyle = '#300'; g.fillRect(0, 0, w, h); g.save(); g.translate(w / 2 - 48, 10); g.scale(3, 3); retroIcon(g, 'doom', 0, 0); g.restore(); },
  typer(g, w, h) { g.fillStyle = '#05030f'; g.fillRect(0, 0, w, h); g.fillStyle = '#eef'; g.font = '16px monospace'; g.fillText('modem', 30, 40); g.fillStyle = '#fa0'; g.fillText('pix', 120, 70); g.fillStyle = '#eef'; g.fillText('el', 149, 70); g.fillStyle = '#6ff'; g.beginPath(); g.moveTo(w / 2, h - 30); g.lineTo(w / 2 - 12, h - 8); g.lineTo(w / 2 + 12, h - 8); g.fill(); },
  snake(g, w, h) { g.fillStyle = '#9bbc0f'; g.fillRect(0, 0, w, h); g.fillStyle = '#306230'; for (let i = 0; i < 8; i++) g.fillRect(40 + i * 14, 60, 12, 12); g.fillRect(152, 46, 12, 12); g.fillStyle = '#0f380f'; g.beginPath(); g.arc(200, 52, 6, 0, 7); g.fill(); },
  tube(g, w, h, t) { g.fillStyle = '#181818'; g.fillRect(0, 0, w, h); g.fillStyle = '#12b886'; g.beginPath(); g.roundRect(w / 2 - 34, h / 2 - 22, 68, 44, 12); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(w / 2 - 8, h / 2 - 12); g.lineTo(w / 2 + 14, h / 2); g.lineTo(w / 2 - 8, h / 2 + 12); g.fill(); },
};
const APPS = {
  duty: [DutyCalls, 'Duty Calls: Modern Ops', 'Wave-survival shooter'],
  blockcraft: [Blockcraft, 'Blockcraft', 'Mine and build a voxel world'],
  brickverse: [Brickverse, 'Brickverse', 'Lava Tower Obby'],
  shop: [KeyShop, 'KeyShop', 'Buy new keyboards'],
  typer: [Typer, 'KeyStorm', 'Typing shooter'],
  doom: [Doom, 'DOOMED Classic', 'The 1999 shareware'],
  snake: [Snake, 'Snake 2000', 'Retro arcade'],
  tube: [Tube, 'Clips', 'Old internet videos'],
};
const ORDER = Object.keys(APPS);
const WIN = [160, 22, 640, 456], CONTENT = [164, 50, 632, 424];

export class Nova {
  constructor(canvas) {
    this.c = canvas; this.g = canvas.getContext('2d'); this.W = canvas.width; this.H = canvas.height;
    this.state = 'off'; this.t = 0; this.bt = 0; this.mouse = { x: 480, y: 270 }; this.open = {}; this.focus = null; this.toasts = []; this.busy = false;
    let s = null; try { s = JSON.parse(localStorage.getItem('dt26')); } catch (e) {}
    this.coins = s?.coins ?? 150; this.owned = s?.owned ?? ['stock']; this.equipped = s?.equipped ?? 'stock';
  }
  get clock() { const d = new Date(); return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds(); }
  save() { try { localStorage.setItem('dt26', JSON.stringify({ coins: this.coins, owned: this.owned, equipped: this.equipped })); } catch (e) {} }
  earn(n, from) { if (n <= 0) return; this.coins += n; this.save(); this.toast(`+${n} coins  ·  ${from}`); }
  equip(id) { this.equipped = id; this.save(); const k = KEYBOARDS.find(k => k.id === id); this.onEquip && this.onEquip(k); this.toast(`Equipped ${k.name}`); }
  emit(name, data) { if (name === 'typer-score') this.earn(data, 'KeyStorm'); }
  toast(text) { this.toasts.push({ text, t: 2.8 }); if (this.toasts.length > 3) this.toasts.shift(); A.beep(1320, 0.06, 0.05, 'sine'); }
  boot() { this.state = 'boot'; this.bt = 0; }
  launch(id) {
    let app = this.open[id];
    if (!app) { const [Cls, title] = APPS[id]; app = new Cls(this); app.id = id; app.title = title; this.open[id] = app; }
    this.focus = app; A.beep(880, 0.04, 0.05, 'sine');
  }
  close(app) { app.close && app.close(); delete this.open[app.id]; if (this.focus === app) this.focus = null; this.onClose && this.onClose(); }
  get fullFocus() { return this.focus && this.focus.full; }
  update(dt) {
    this.t += dt;
    if (this.state === 'boot') { this.bt += dt; if (this.bt > 2.2) this.state = 'desk'; return; }
    if (this.state !== 'desk') return;
    if (this.focus) this.focus.update && this.focus.update(dt);
    this.toasts.forEach(t => (t.t -= dt)); this.toasts = this.toasts.filter(t => t.t > 0);
  }
  draw() {
    const g = this.g, W = this.W, H = this.H; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    if (this.state === 'off') { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); return; }
    if (this.state === 'boot') {
      g.fillStyle = '#05060a'; g.fillRect(0, 0, W, H); g.fillStyle = '#e8ecff'; g.font = '300 44px Arial'; g.textAlign = 'center'; g.fillText('nova', W / 2, H / 2 - 10);
      for (let i = 0; i < 5; i++) { const a = this.bt * 5 - i * 0.35; g.fillStyle = `rgba(200,210,255,${1 - i / 5})`; g.beginPath(); g.arc(W / 2 + Math.cos(a) * 16, H / 2 + 50 + Math.sin(a) * 16, 3, 0, 7); g.fill(); }
      g.textAlign = 'left'; return;
    }
    if (this.fullFocus) { this.focus.draw(g, W, H); this.drawToasts(g); this.drawCursor(g); return; }
    this.drawDesktop(g, W, H);
    if (this.focus) this.drawWin(g, this.focus);
    this.drawTaskbar(g, W, H); this.drawToasts(g); this.drawCursor(g);
  }
  drawDesktop(g, W, H) {
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#0b1020'); bg.addColorStop(1, '#1a0f2a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) { const x = W * (0.3 + 0.25 * i) + Math.sin(this.t * 0.3 + i * 2) * 80, y = H * 0.35 + Math.cos(this.t * 0.25 + i) * 50; const r = g.createRadialGradient(x, y, 10, x, y, 260); r.addColorStop(0, ['rgba(80,120,255,.35)', 'rgba(200,60,255,.28)', 'rgba(40,220,200,.25)'][i]); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, W, H); }
    const d = new Date(); g.fillStyle = '#fff'; g.font = '300 44px Arial'; g.fillText(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 40, 66);
    g.fillStyle = 'rgba(255,255,255,.6)'; g.font = '15px Arial'; g.fillText(d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) + '  ·  Library', 42, 90);
    this.tiles = [];
    ORDER.forEach((id, i) => {
      const tw = 208, th = 150, x = 40 + (i % 4) * (tw + 16), y = 112 + Math.floor(i / 4) * (th + 16), hov = inside(this.mouse.x, this.mouse.y, [x, y, tw, th]);
      g.save(); g.beginPath(); g.roundRect(x, y, tw, th, 12); g.clip(); g.translate(x, y); COVERS[id](g, tw, th - 38, this.t); g.restore();
      g.fillStyle = hov ? 'rgba(40,46,70,.95)' : 'rgba(20,24,38,.92)'; g.beginPath(); g.roundRect(x, y + th - 38, tw, 38, [0, 0, 12, 12]); g.fill();
      if (hov) { g.strokeStyle = 'rgba(160,180,255,.9)'; g.lineWidth = 2; g.beginPath(); g.roundRect(x, y, tw, th, 12); g.stroke(); g.lineWidth = 1; }
      g.fillStyle = '#fff'; g.font = 'bold 13px Arial'; g.fillText(APPS[id][1], x + 12, y + th - 21); g.fillStyle = '#8a93a6'; g.font = '11px Arial'; g.fillText(APPS[id][2], x + 12, y + th - 7);
      this.tiles.push([id, [x, y, tw, th]]);
    });
  }
  drawWin(g, app) {
    const [x, y, w, h] = WIN;
    g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x + 6, y + 8, w, h);
    g.fillStyle = '#1c2130'; g.beginPath(); g.roundRect(x, y, w, h, 10); g.fill();
    g.fillStyle = '#e6e9f2'; g.font = 'bold 12px Arial'; g.fillText(app.winTitle ? app.winTitle() : app.title, x + 14, y + 19);
    const hx = inside(this.mouse.x, this.mouse.y, [x + w - 40, y, 40, 28]); g.fillStyle = hx ? '#e5484d' : 'transparent'; g.fillRect(x + w - 40, y + 2, 38, 24);
    g.strokeStyle = '#fff'; g.beginPath(); g.moveTo(x + w - 25, y + 9); g.lineTo(x + w - 15, y + 19); g.moveTo(x + w - 15, y + 9); g.lineTo(x + w - 25, y + 19); g.stroke();
    g.save(); g.translate(CONTENT[0], CONTENT[1]); g.beginPath(); g.rect(0, 0, CONTENT[2], CONTENT[3]); g.clip(); app.draw(g, CONTENT[2], CONTENT[3]); g.restore();
  }
  drawTaskbar(g, W, H) {
    g.fillStyle = 'rgba(14,16,24,.85)'; g.fillRect(0, H - 44, W, 44);
    const n = ORDER.length, x0 = W / 2 - n * 22; this.bar = [];
    ORDER.forEach((id, i) => {
      const x = x0 + i * 44 + 4, y = H - 38; g.save(); g.beginPath(); g.roundRect(x, y, 34, 32, 7); g.clip(); g.translate(x, y); g.scale(34 / 208, 32 / 112); COVERS[id](g, 208, 112, this.t); g.restore();
      if (this.open[id]) { g.fillStyle = '#9ab0ff'; g.fillRect(x + 12, H - 4, 10, 2); }
      this.bar.push([id, [x, y, 34, 32]]);
    });
    const d = new Date(); g.fillStyle = '#e6e9f2'; g.font = '12px Arial'; g.textAlign = 'right';
    g.fillText(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), W - 14, H - 25); g.fillStyle = '#8a93a6'; g.fillText(d.toLocaleDateString(), W - 14, H - 10);
    g.fillStyle = '#ffd24a'; g.font = 'bold 13px Arial'; g.fillText(`${this.coins} coins`, W - 96, H - 17); g.textAlign = 'left';
    g.fillStyle = '#e6e9f2'; g.font = 'bold 13px Arial'; g.fillText('nova', 16, H - 17);
  }
  drawToasts(g) {
    this.toasts.forEach((t, i) => {
      const w = 230, x = this.W - w - 14, y = 14 + i * 42; g.globalAlpha = Math.min(1, t.t * 2);
      g.fillStyle = 'rgba(20,24,38,.94)'; g.beginPath(); g.roundRect(x, y, w, 34, 8); g.fill(); g.fillStyle = '#ffd24a'; g.beginPath(); g.arc(x + 18, y + 17, 7, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.font = '13px Arial'; g.fillText(t.text, x + 34, y + 22); g.globalAlpha = 1;
    });
  }
  drawCursor(g) {
    if (this.focus && this.focus.hideCursor && (this.fullFocus || inside(this.mouse.x, this.mouse.y, CONTENT))) return;
    const { x, y } = this.mouse; g.save(); g.translate(x, y); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 17); g.lineTo(4.5, 13); g.lineTo(8, 20); g.lineTo(10.5, 19); g.lineTo(7, 12); g.lineTo(12.5, 12); g.closePath();
    g.fillStyle = '#000'; g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 1.2; g.stroke(); g.restore();
  }
  mouseEv(type, x, y, btn = 0) {
    if (type !== 'look') { this.mouse.x = x; this.mouse.y = y; }
    if (this.state !== 'desk') return;
    const f = this.focus;
    if (f && f.full) { f.mouse && f.mouse(type, x, y, btn); return; }
    if (type === 'look') return;
    if (f) {
      if (type === 'down' && inside(x, y, [WIN[0] + WIN[2] - 40, WIN[1], 40, 28])) { this.close(f); return; }
      if (inside(x, y, CONTENT) || type !== 'down') { f.mouse && f.mouse(type, x - CONTENT[0], y - CONTENT[1], btn); if (type !== 'down' || inside(x, y, WIN)) return; }
      if (type === 'down' && inside(x, y, WIN)) return;
    }
    if (type !== 'down') return;
    const hit = [...(this.bar || []), ...(this.tiles || [])].find(([, r]) => inside(x, y, r));
    if (hit) this.launch(hit[0]); else if (f && y < this.H - 44) this.focus = null;
  }
  key(e, down) {
    if (this.state !== 'desk') return;
    if (down && e.code === 'Escape' && this.focus && !(this.focus.wantsEsc && this.focus.wantsEsc())) { this.close(this.focus); return; }
    if (this.focus) this.focus.key && this.focus.key(e, down);
  }
}

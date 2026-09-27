import { A } from './audio.js';
import { F, MONO, bevel, button, icon, inside } from './ui.js';
import { Browser } from './apps/browser.js';
import { Chat, ChatBot } from './apps/chat.js';
import { Tube } from './apps/tube.js';
import { Snake } from './apps/snake.js';
import { Typer } from './apps/typer.js';
import { Notepad } from './apps/notepad.js';
import { Doom } from './apps/doom.js';

const APPS = { browser: [Browser, 'NetVoyager'], chat: [Chat, 'NiteChat'], tube: [Tube, 'TubePlayer'], snake: [Snake, 'Snake 2000'], typer: [Typer, 'KeyStorm'], notepad: [Notepad, 'Notepad'], doom: [Doom, 'DOOMED'], trash: [null, 'Recycle Bin'] };
export const MIDNIGHT = 24 * 3600;
const WIN = [0, 0, 640, 452], CONTENT = [4, 24, 632, 424];

export class OS {
  constructor(canvas) {
    this.c = canvas; this.g = canvas.getContext('2d');
    this.state = 'off'; this.t = 0; this.bt = 0; this.mouse = { x: 320, y: 240 };
    this.clock = 23 * 3600 + 40 * 60; this.rate = 3;
    this.open = {}; this.focus = null; this.icons = ['browser', 'chat', 'tube', 'snake', 'typer', 'notepad', 'trash'];
    this.sel = null; this.last = { t: 0, id: null }; this.toasts = []; this.dl = null; this.online = false;
    this.startOpen = false; this.busy = false; this.glitch = 0; this.y2k = false; this.flags = {};
    this.chat = new ChatBot(this);
    try { if (localStorage.getItem('dt_doom')) this.installDoom(true); } catch (e) {}
  }
  emit(name, data) { this.chat.on(name, data); this.onEvent && this.onEvent(name, data); }
  boot(dirty = false) { this.state = 'post'; this.bt = 0; this.dirty = dirty; this.startOpen = false; }
  powerOff() { this.state = 'off'; this.online = false; for (const id in this.open) this.close(this.open[id], true); }
  installDoom(silent) {
    if (!this.icons.includes('doom')) this.icons.splice(6, 0, 'doom');
    try { localStorage.setItem('dt_doom', '1'); } catch (e) {}
    if (!silent) { this.toast('DOOMED installed! Double-click the icon on your desktop.'); this.emit('doom-installed'); }
  }
  launch(id) {
    if (id === 'trash') { this.toast('The Recycle Bin is empty. Unlike your conscience.'); return; }
    let app = this.open[id];
    if (!app) { const [Cls, title] = APPS[id]; app = new Cls(this); app.id = id; app.title = title; this.open[id] = app; this.emit('open-' + id); }
    app.min = false; this.focus = app; this.startOpen = false; this.busy = true; setTimeout(() => (this.busy = false), 600);
  }
  close(app, quiet) { app.close && app.close(); delete this.open[app.id]; if (this.focus === app) this.focus = null; if (!quiet) A.click(); }
  toast(text, onClick) { this.toasts.push({ text, t: 5, onClick }); if (this.toasts.length > 2) this.toasts.shift(); A.ding(); }
  download(file, kb, done) { this.dl = { file, kb, p: 0, done }; this.busy = true; }
  timeStr() {
    if (this.y2k) return '12:00 AM';
    const s = this.clock % 86400, h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
    return `${(h % 12) || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  }

  update(dt) {
    this.t += dt;
    if (this.state === 'post' || this.state === 'scandisk' || this.state === 'splash') {
      this.bt += dt; this.busy = true;
      if (this.state === 'post' && this.bt > 3) { this.state = this.dirty ? 'scandisk' : 'splash'; this.bt = 0; }
      if (this.state === 'scandisk' && this.bt > 2.8) { this.state = 'splash'; this.bt = 0; }
      if (this.state === 'splash' && this.bt > 2.6) { this.state = 'desk'; this.busy = false; A.beep(523, 0.15, 0.08, 'triangle'); A.beep(784, 0.3, 0.08, 'triangle', 0.15); A.beep(1046, 0.5, 0.06, 'triangle', 0.3); this.emit('desk'); }
      return;
    }
    if (this.state !== 'desk') return;
    const prev = this.clock;
    this.clock += dt * this.rate;
    if (prev < MIDNIGHT - 10 && this.clock >= MIDNIGHT - 10) this.emit('countdown');
    const left = Math.ceil(MIDNIGHT - this.clock);
    if (left > 0 && left <= 10 && left !== this.lastBeep) { this.lastBeep = left; A.beep(left === 1 ? 1320 : 1000, 0.12, 0.12, 'sine'); }
    for (const id in this.open) { const a = this.open[id]; if (a === this.focus || a.alwaysUpdate) a.update && a.update(dt); }
    this.chat.update(dt);
    this.toasts.forEach(t => (t.t -= dt)); this.toasts = this.toasts.filter(t => t.t > 0);
    if (this.dl) { this.dl.p += dt / 11; if (this.dl.p >= 1) { const d = this.dl; this.dl = null; this.busy = false; d.done(); } }
  }

  draw() {
    const g = this.g;
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    if (this.state === 'off') { g.fillStyle = '#000'; g.fillRect(0, 0, 640, 480); return; }
    if (this.state === 'post') return this.drawPost(g);
    if (this.state === 'scandisk') {
      g.fillStyle = '#0000a8'; g.fillRect(0, 0, 640, 480); g.fillStyle = '#fff'; g.font = MONO(14);
      ['Because NiteOS was not properly shut down, ScanDisk', 'will now check your drives for errors.', '', 'Checking drive C: ...  ' + Math.min(100, Math.floor(this.bt * 40)) + '%', '', '(Did the power just go out? Was it... Y2K?)'].forEach((l, i) => g.fillText(l, 40, 120 + i * 22));
      return;
    }
    if (this.state === 'splash') return this.drawSplash(g);
    if (this.state === 'shutdown') {
      g.fillStyle = '#000'; g.fillRect(0, 0, 640, 480); g.fillStyle = '#f80'; g.font = F(26, 'bold'); g.textAlign = 'center';
      g.fillText("It's now safe to turn off", 320, 220); g.fillText('your computer.', 320, 256);
      g.font = F(12); g.fillStyle = '#a60'; g.fillText('(press any key to restart)', 320, 320); g.textAlign = 'left'; return;
    }
    // desktop
    g.fillStyle = '#008080'; g.fillRect(0, 0, 640, 480);
    g.fillStyle = 'rgba(0,0,0,.18)'; g.font = F(46, 'bold italic'); g.textAlign = 'right';
    g.fillText(this.clock >= MIDNIGHT && !this.y2k ? 'HAPPY 2000!' : 'NiteOS 98', 620, 420); g.textAlign = 'left';
    this.icons.forEach((id, i) => {
      const x = 14 + Math.floor(i / 6) * 76, y = 10 + (i % 6) * 70, s = this.sel === id;
      icon(this.g, id, x + 18, y + 4);
      g.font = F(11); const label = APPS[id][1], w = g.measureText(label).width;
      if (s) { g.fillStyle = '#000080'; g.fillRect(x + 34 - w / 2 - 2, y + 40, w + 4, 14); }
      g.fillStyle = '#fff'; g.fillText(label, x + 34 - w / 2, y + 51);
    });
    if (this.focus && !this.focus.min) this.drawWin(g, this.focus);
    if (this.dl) this.drawDownload(g);
    this.drawTaskbar(g);
    if (this.startOpen) this.drawStart(g);
    this.toasts.forEach((t, i) => {
      const y = 380 - i * 58, x = 400;
      bevel(g, x, y, 232, 52, false, '#ffffe1'); icon(g, 'chat', x + 6, y + 10);
      g.fillStyle = '#000'; g.font = F(11, 'bold'); g.fillText(t.title || 'd4rkst4r says:', x + 44, y + 16);
      g.font = F(11); g.fillText(t.text.length > 34 ? t.text.slice(0, 33) + '…' : t.text, x + 44, y + 32);
      g.fillStyle = '#555'; g.fillText(t.onClick ? 'click to reply' : '', x + 44, y + 46);
    });
    if (this.clock >= MIDNIGHT - 10 && this.clock < MIDNIGHT) {
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, 0, 640, 480);
      g.fillStyle = '#fff'; g.font = F(160, 'bold'); g.textAlign = 'center';
      g.fillText(String(Math.ceil(MIDNIGHT - this.clock)), 320, 300); g.textAlign = 'left';
    }
    if (this.glitch > 0) {
      for (let i = 0; i < 30 * this.glitch; i++) {
        const sx = Math.random() * 600, sy = Math.random() * 460, w = 20 + Math.random() * 200, h = 2 + Math.random() * 30;
        g.drawImage(this.c, sx, sy, w, h, sx + (Math.random() - 0.5) * 80, sy + (Math.random() - 0.5) * 20, w, h);
      }
      g.fillStyle = '#fff'; g.font = MONO(14);
      for (let i = 0; i < 12 * this.glitch; i++) g.fillText(String.fromCharCode(0x2580 + Math.random() * 32), Math.random() * 640, Math.random() * 480);
      if (this.y2k) { g.fillStyle = '#0000a8'; g.fillRect(90, 180, 460, 90); g.fillStyle = '#fff'; g.font = MONO(14); g.fillText('FATAL: DATE ROLLOVER 12/31/99 -> 01/01/1900', 110, 215); g.fillText('A problem has occurred. The century is invalid.', 110, 245); }
    }
    this.drawCursor(g);
  }
  drawPost(g) {
    g.fillStyle = '#000'; g.fillRect(0, 0, 640, 480); g.font = MONO(13); g.fillStyle = '#bbb';
    const kb = Math.min(65536, Math.floor(this.bt * 40000 / 1024) * 1024);
    const lines = ['NiteBIOS v4.51PG, An Energy Star Ally', 'Copyright (C) 1984-99, Nite Software, Inc.', '', 'PENTIUM-II CPU at 400MHz', `Memory Test :  ${kb}K ${kb >= 65536 ? 'OK' : ''}`, '',
      this.bt > 1.8 ? 'Detecting IDE Primary Master  ... QUANTUM FIREBALL 6.4GB' : '', this.bt > 2.1 ? 'Detecting IDE Secondary Master... ATAPI CD-ROM 24X' : '', this.bt > 2.4 ? 'Modem found on COM2: 56K V.90 Voice/Fax' : ''];
    lines.forEach((l, i) => g.fillText(l, 20, 30 + i * 18));
    g.fillStyle = '#6cf'; g.font = F(22, 'bold italic'); g.fillText('NITE', 540, 40); g.font = MONO(11); g.fillStyle = '#9c6'; g.fillText('energy', 552, 56);
    g.fillStyle = '#bbb'; g.font = MONO(13); g.fillText('Press DEL to enter SETUP', 20, 460);
  }
  drawSplash(g) {
    const gr = g.createLinearGradient(0, 0, 0, 480); gr.addColorStop(0, '#0a1a4a'); gr.addColorStop(1, '#4a78c8'); g.fillStyle = gr; g.fillRect(0, 0, 640, 480);
    for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.ellipse((i * 97) % 640, 300 + Math.sin(i) * 60, 90, 20, 0, 0, 7); g.fill(); }
    g.save(); g.translate(250, 200); icon(g, 'start', 0, 0); g.scale(3, 3); icon(g, 'start', -1, -4); g.restore();
    g.fillStyle = '#fff'; g.font = F(40, 'bold italic'); g.fillText('NiteOS', 320, 238); g.font = F(22, 'bold'); g.fillStyle = '#fd0'; g.fillText('98', 470, 220);
    g.fillStyle = '#000'; g.fillRect(0, 440, 640, 40);
    const x = (this.bt * 300) % 800 - 160; const bg = g.createLinearGradient(x, 0, x + 160, 0); bg.addColorStop(0, 'rgba(60,120,255,0)'); bg.addColorStop(0.5, '#6af'); bg.addColorStop(1, 'rgba(60,120,255,0)');
    g.fillStyle = bg; g.fillRect(0, 452, 640, 10);
  }
  drawWin(g, app) {
    const [x, y, w, h] = WIN;
    bevel(g, x, y, w, h);
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#000080'); gr.addColorStop(1, '#1084d0');
    g.fillStyle = gr; g.fillRect(x + 3, y + 3, w - 6, 18);
    g.fillStyle = gr; g.fillRect(x + 3, y + 3, 20, 18); g.save(); g.translate(x + 5, y + 4); g.scale(0.5, 0.5); icon(g, app.id, 0, 0); g.restore();
    g.fillStyle = '#fff'; g.font = F(11, 'bold'); g.fillText(app.winTitle ? app.winTitle() : app.title, x + 26, y + 16);
    button(g, w - 42, 5, 16, 14, '_'); button(g, w - 22, 5, 16, 14, '×', false, F(12, 'bold'));
    g.save(); g.translate(CONTENT[0], CONTENT[1]); g.beginPath(); g.rect(0, 0, CONTENT[2], CONTENT[3]); g.clip();
    app.draw(g, CONTENT[2], CONTENT[3]); g.restore();
  }
  drawTaskbar(g) {
    bevel(g, 0, 452, 640, 28); g.fillStyle = '#fff'; g.fillRect(0, 453, 640, 1);
    button(g, 3, 455, 56, 22, '', this.startOpen); icon(g, 'start', 8, 459); g.fillStyle = '#000'; g.font = F(11, 'bold'); g.fillText('Start', 26, 470);
    Object.values(this.open).forEach((a, i) => {
      const x = 64 + i * 92, flash = a.id === 'chat' && this.chat.unread && Math.floor(this.t * 2) % 2;
      bevel(g, x, 455, 88, 22, this.focus === a && !a.min, flash ? '#000080' : '#c0c0c0');
      g.save(); g.translate(x + 4, 459); g.scale(0.45, 0.45); icon(g, a.id, 0, 0); g.restore();
      g.fillStyle = flash ? '#fff' : '#000'; g.font = F(11); g.fillText(a.title.slice(0, 11), x + 22, 470);
    });
    bevel(g, 548, 455, 89, 22, true);
    if (this.online) { g.fillStyle = Math.random() < 0.5 ? '#3f3' : '#060'; g.fillRect(554, 462, 6, 6); g.fillStyle = Math.random() < 0.5 ? '#3f3' : '#060'; g.fillRect(562, 462, 6, 6); }
    g.fillStyle = '#000'; g.font = F(11); g.textAlign = 'right'; g.fillText(this.timeStr(), 632, 470); g.textAlign = 'left';
  }
  startItems() { return [...this.icons.filter(i => i !== 'trash').map(i => [i, APPS[i][1]]), ['-'], ['sync', 'Sync clock (skip ahead)'], ['shutdown', 'Shut Down...']]; }
  drawStart(g) {
    const items = this.startItems(), h = items.length * 24 + 8, y0 = 452 - h;
    bevel(g, 2, y0, 190, h); g.fillStyle = '#000080'; g.fillRect(5, y0 + 3, 20, h - 6);
    g.save(); g.translate(20, y0 + h - 8); g.rotate(-Math.PI / 2); g.fillStyle = '#fff'; g.font = F(15, 'bold'); g.fillText('NiteOS 98', 0, 0); g.restore();
    items.forEach(([id, label], i) => {
      const y = y0 + 4 + i * 24;
      if (id === '-') { g.fillStyle = '#808080'; g.fillRect(30, y + 11, 156, 1); return; }
      const hov = inside(this.mouse.x, this.mouse.y, [28, y, 162, 24]);
      if (hov) { g.fillStyle = '#000080'; g.fillRect(28, y, 160, 24); }
      if (APPS[id]) { g.save(); g.translate(32, y + 4); g.scale(0.5, 0.5); icon(g, id, 0, 0); g.restore(); }
      g.fillStyle = hov ? '#fff' : '#000'; g.font = F(12); g.fillText(label, 54, y + 16);
    });
  }
  drawDownload(g) {
    const d = this.dl, x = 170, y = 150;
    bevel(g, x, y, 300, 130); g.fillStyle = '#000080'; g.fillRect(x + 3, y + 3, 294, 18);
    g.fillStyle = '#fff'; g.font = F(11, 'bold'); g.fillText(`${Math.floor(d.p * 100)}% of ${d.file} Completed`, x + 8, y + 16);
    g.fillStyle = '#000'; g.font = F(11); icon(g, 'zip', x + 10, y + 30);
    g.fillText(`Saving: ${d.file} from files.jumpstation.com`, x + 50, y + 44);
    bevel(g, x + 10, y + 70, 280, 16, true, '#fff');
    for (let i = 0; i < Math.floor(d.p * 26); i++) { g.fillStyle = '#000080'; g.fillRect(x + 13 + i * 10.6, y + 73, 9, 10); }
    const left = Math.ceil((1 - d.p) * d.kb / 4.8);
    g.fillStyle = '#000'; g.fillText(`Estimated time left: ${Math.floor(left / 60)} min ${left % 60} sec (${Math.floor(d.p * d.kb)} KB of ${d.kb} KB)`, x + 10, y + 104);
    g.fillText('Transfer rate: 4.8 KB/Sec   (56k modem, living the dream)', x + 10, y + 120);
  }
  drawCursor(g) {
    const { x, y } = this.mouse; if (this.focus && this.focus.hideCursor && !this.focus.min && y < 452) return;
    g.save(); g.translate(x, y); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 16); g.lineTo(4, 12); g.lineTo(7, 19); g.lineTo(9, 18); g.lineTo(6, 11); g.lineTo(11, 11); g.closePath();
    g.fillStyle = '#fff'; g.fill(); g.strokeStyle = '#000'; g.lineWidth = 1; g.stroke(); g.restore();
  }

  // ---------------- input ----------------
  mouseEv(type, x, y, btn = 0) {
    this.mouse.x = x; this.mouse.y = y;
    if (this.state === 'shutdown' && type === 'down') { this.boot(); return; }
    if (this.state !== 'desk') return;
    const f = this.focus && !this.focus.min ? this.focus : null;
    if (type === 'wheel') { f && f.mouse && f.mouse('wheel', x - CONTENT[0], y - CONTENT[1], btn); return; }
    if (type !== 'down') { if (f && f.mouse) f.mouse(type, x - CONTENT[0], y - CONTENT[1], btn); return; }
    if (this.startOpen) {
      const items = this.startItems(), h = items.length * 24 + 8, y0 = 452 - h;
      this.startOpen = false;
      if (inside(x, y, [2, y0, 190, h])) {
        const it = items[Math.floor((y - y0 - 4) / 24)];
        if (!it || it[0] === '-') return;
        A.click();
        if (it[0] === 'shutdown') { for (const id in this.open) this.close(this.open[id], true); this.state = 'shutdown'; return; }
        if (it[0] === 'sync') { if (this.clock < MIDNIGHT - 40) { this.clock = MIDNIGHT - 40; this.toast('Clock synced with atomic time server. 40 seconds to midnight!'); } return; }
        this.launch(it[0]); return;
      }
      if (inside(x, y, [3, 455, 56, 22])) return;
    }
    for (let i = this.toasts.length - 1; i >= 0; i--) {
      const t = this.toasts[i], ty = 380 - i * 58;
      if (inside(x, y, [400, ty, 232, 52])) { this.toasts.splice(i, 1); t.onClick && t.onClick(); return; }
    }
    if (y >= 452) {
      if (inside(x, y, [3, 455, 56, 22])) { this.startOpen = true; A.click(); return; }
      Object.values(this.open).forEach((a, i) => {
        if (inside(x, y, [64 + i * 92, 455, 88, 22])) { A.click(); if (this.focus === a && !a.min) { a.min = true; this.focus = null; } else { a.min = false; this.focus = a; if (a.id === 'chat') this.chat.unread = false; } }
      });
      return;
    }
    if (f) {
      if (inside(x, y, [618, 5, 16, 14])) { this.close(f); return; }
      if (inside(x, y, [598, 5, 16, 14])) { f.min = true; this.focus = null; A.click(); return; }
      if (inside(x, y, CONTENT)) f.mouse && f.mouse('down', x - CONTENT[0], y - CONTENT[1], btn);
      return;
    }
    const hit = this.icons.find((id, i) => inside(x, y, [14 + Math.floor(i / 6) * 76, 10 + (i % 6) * 70, 68, 58]));
    this.sel = hit || null;
    if (hit) { if (this.last.id === hit && this.t - this.last.t < 0.45) { this.launch(hit); this.last.id = null; } else this.last = { id: hit, t: this.t }; }
  }
  key(e, down) {
    if (this.state === 'shutdown' && down) { this.boot(); return; }
    if (this.state !== 'desk') return;
    if (down && e.code === 'Escape') {
      if (this.startOpen) { this.startOpen = false; return; }
      if (this.focus && !(this.focus.wantsEsc && this.focus.wantsEsc())) { this.close(this.focus); return; }
    }
    if (down && (e.code === 'MetaLeft' || e.code === 'MetaRight')) { this.startOpen = !this.startOpen; return; }
    if (this.focus && !this.focus.min) { this.focus.key && this.focus.key(e, down); return; }
    if (!down) return;
    const i = Math.max(0, this.icons.indexOf(this.sel));
    const mv = { ArrowDown: 1, ArrowUp: -1, ArrowRight: 6, ArrowLeft: -6 }[e.code];
    if (mv) this.sel = this.icons[Math.min(this.icons.length - 1, Math.max(0, (this.sel ? i + mv : 0)))];
    if (e.code === 'Enter' && this.sel) this.launch(this.sel);
  }
}

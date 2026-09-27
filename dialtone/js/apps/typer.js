import { A } from '../audio.js';
import { F, MONO } from '../ui.js';
const WORDS = 'modem pixel floppy dialup browser keyboard millennium cursor download upload chatroom password website hyperlink shareware joystick megabyte gigahertz pentium screensaver desktop printer scanner mouse pager walkman tamagotchi discman rollerblade dvd countdown fireworks midnight party century computer virus firewall server internet email inbox spam buddy homepage guestbook webring counter frames javascript applet gif bandwidth static busy signal bios reboot format defrag scandisk kilobyte baud cable dongle zip disk laser inkjet speaker subwoofer arcade cartridge polygon texture sprite shotgun demon portal'.split(' ');

export class Typer {
  constructor(os) { this.os = os; this.hideCursor = true; this.state = 'menu'; this.stars = Array.from({ length: 80 }, () => [Math.random() * 632, Math.random() * 424, Math.random() * 2 + 0.3]); this.reset(); }
  reset() { this.words = []; this.shots = []; this.parts = []; this.target = null; this.spawn = 0; this.score = 0; this.shield = 3; this.chars = 0; this.el = 0; this.combo = 1; this.shake = 0; }
  get wpm() { return this.el > 3 ? Math.round(this.chars / 5 / (this.el / 60)) : 0; }
  update(dt) {
    this.stars.forEach(s => { s[1] += s[2] * 30 * dt; if (s[1] > 424) s[1] = 0; });
    this.parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt; }); this.parts = this.parts.filter(p => p.l > 0);
    this.shots.forEach(s => (s.l -= dt)); this.shots = this.shots.filter(s => s.l > 0);
    this.shake = Math.max(0, this.shake - dt * 3);
    if (this.state !== 'play') return;
    this.el += dt; const lvl = 1 + Math.floor(this.el / 20);
    this.spawn -= dt;
    if (this.spawn < 0) {
      this.spawn = Math.max(0.9, 2.6 - lvl * 0.25);
      let t; do t = WORDS[Math.floor(Math.random() * WORDS.length)]; while (this.words.some(w => w.t[0] === t[0]));
      this.words.push({ t, n: 0, x: 40 + Math.random() * 480, y: -10, v: 14 + lvl * 4 + Math.random() * 8 });
    }
    for (const w of this.words) {
      w.y += w.v * dt;
      if (w.y > 380) {
        w.dead = true; this.shield--; this.shake = 1; A.boom(0.5); this.combo = 1;
        if (this.target === w) this.target = null;
        if (this.shield <= 0) { this.state = 'over'; this.os.emit('typer-score', this.wpm); }
      }
    }
    this.words = this.words.filter(w => !w.dead);
  }
  explode(x, y, c) { for (let i = 0; i < 24; i++) { const a = Math.random() * 7, s = 40 + Math.random() * 120; this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 0.6 + Math.random() * 0.4, c }); } }
  draw(g, w, h) {
    g.save(); if (this.shake) g.translate((Math.random() - 0.5) * 10 * this.shake, (Math.random() - 0.5) * 10 * this.shake);
    g.fillStyle = '#05030f'; g.fillRect(-10, -10, w + 20, h + 20);
    this.stars.forEach(s => { g.fillStyle = `rgba(200,210,255,${s[2] / 2.3})`; g.fillRect(s[0], s[1], s[2], s[2]); });
    g.strokeStyle = 'rgba(255,60,120,.35)'; g.beginPath(); g.moveTo(0, 380); g.lineTo(w, 380); g.stroke();
    const sx = w / 2, sy = h - 26;
    for (const s of this.shots) { g.strokeStyle = `rgba(120,255,255,${s.l * 8})`; g.lineWidth = 2; g.beginPath(); g.moveTo(sx, sy - 12); g.lineTo(s.x, s.y); g.stroke(); }
    g.lineWidth = 1;
    g.font = MONO(17);
    for (const wd of this.words) {
      const tw = g.measureText(wd.t).width;
      if (wd === this.target) { g.strokeStyle = '#f36'; g.strokeRect(wd.x - 5, wd.y - 16, tw + 10, 22); }
      g.fillStyle = '#fa0'; g.fillText(wd.t.slice(0, wd.n), wd.x, wd.y);
      g.fillStyle = '#eef'; g.fillText(wd.t.slice(wd.n), wd.x + g.measureText(wd.t.slice(0, wd.n)).width, wd.y);
    }
    this.parts.forEach(p => { g.fillStyle = p.c; g.globalAlpha = p.l; g.fillRect(p.x, p.y, 3, 3); }); g.globalAlpha = 1;
    g.fillStyle = '#6ff'; g.beginPath(); g.moveTo(sx, sy - 16); g.lineTo(sx - 14, sy + 10); g.lineTo(sx, sy + 4); g.lineTo(sx + 14, sy + 10); g.fill();
    g.restore();
    g.fillStyle = '#fff'; g.font = F(13, 'bold'); g.fillText(`SCORE ${this.score}`, 10, 20); g.fillText(`WPM ${this.wpm}`, 140, 20); g.fillText(`x${this.combo}`, 240, 20);
    g.fillText('SHIELD', w - 150, 20); for (let i = 0; i < 3; i++) { g.fillStyle = i < this.shield ? '#3f6' : '#333'; g.fillRect(w - 90 + i * 26, 9, 22, 12); }
    if (this.state !== 'play') {
      g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(w / 2 - 190, h / 2 - 80, 380, 150); g.textAlign = 'center';
      g.fillStyle = '#f36'; g.font = F(34, 'bold italic'); g.fillText('KEYSTORM', w / 2, h / 2 - 34);
      g.fillStyle = '#fff'; g.font = F(13);
      if (this.state === 'over') { g.fillText(`GAME OVER  -  ${this.score} pts  -  ${this.wpm} WPM`, w / 2, h / 2); g.fillText("d4rkst4r's record: 64 WPM", w / 2, h / 2 + 22); }
      else { g.fillText('Type the falling words before they hit your shield.', w / 2, h / 2); g.fillText('Watch your keyboard. Every key counts.', w / 2, h / 2 + 22); }
      g.fillStyle = '#6ff'; g.fillText('press ENTER to start', w / 2, h / 2 + 52); g.textAlign = 'left';
    }
  }
  key(e, down) {
    if (!down) return;
    if (this.state !== 'play') { if (e.code === 'Enter') { this.reset(); this.state = 'play'; } return; }
    const c = e.key.length === 1 ? e.key.toLowerCase() : null; if (!c || c === ' ') return;
    let t = this.target;
    if (!t) { t = this.words.filter(w => w.t[0] === c).sort((a, b) => b.y - a.y)[0]; if (t) { this.target = t; t.n = 0; } }
    if (t && t.t[t.n] === c) {
      t.n++; this.chars++;
      g_measureShot(this, t);
      A.beep(900 + t.n * 90, 0.03, 0.05, 'square');
      if (t.n >= t.t.length) {
        this.score += t.t.length * 10 * this.combo; this.combo = Math.min(8, this.combo + 1);
        this.explode(t.x + 30, t.y - 6, `hsl(${Math.random() * 360},90%,65%)`); A.boom(0.35);
        this.words = this.words.filter(w => w !== t); this.target = null;
      }
    } else { this.combo = 1; A.beep(110, 0.08, 0.1, 'sawtooth'); }
  }
}
function g_measureShot(game, t) { game.shots.push({ x: t.x + t.n * 10, y: t.y - 5, l: 0.12 }); }

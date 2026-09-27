import { A } from '../audio.js';
import { F } from '../ui.js';
const CS = 20, GW = 31, GH = 20;
export class Snake {
  constructor(os) { this.os = os; this.state = 'ready'; try { this.hi = +localStorage.getItem('dt_snake') || 0; } catch (e) { this.hi = 0; } this.reset(); }
  reset() { this.s = [[10, 10], [9, 10], [8, 10]]; this.dir = [1, 0]; this.nd = [1, 0]; this.acc = 0; this.score = 0; this.food(); }
  food() { do { this.f = [Math.floor(Math.random() * GW), Math.floor(Math.random() * GH)]; } while (this.s.some(p => p[0] === this.f[0] && p[1] === this.f[1])); }
  update(dt) {
    if (this.state !== 'play') return;
    this.acc += dt; const step = Math.max(0.05, 0.12 - this.score * 0.002);
    while (this.acc > step) {
      this.acc -= step; this.dir = this.nd;
      const h = [this.s[0][0] + this.dir[0], this.s[0][1] + this.dir[1]];
      if (h[0] < 0 || h[1] < 0 || h[0] >= GW || h[1] >= GH || this.s.some(p => p[0] === h[0] && p[1] === h[1])) {
        this.state = 'over'; A.beep(200, 0.3, 0.15, 'sawtooth'); A.beep(120, 0.4, 0.15, 'sawtooth', 0.2);
        if (this.score > this.hi) { this.hi = this.score; try { localStorage.setItem('dt_snake', this.hi); } catch (e) {} }
        return;
      }
      this.s.unshift(h);
      if (h[0] === this.f[0] && h[1] === this.f[1]) { this.score++; this.food(); A.beep(880, 0.05, 0.1); A.beep(1320, 0.06, 0.1, 'square', 0.05); } else this.s.pop();
    }
  }
  draw(g, w, h) {
    g.fillStyle = '#9bbc0f'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#0f380f'; g.font = F(14, 'bold'); g.fillText(`SCORE ${this.score}`, 8, 17); g.fillText(`HI ${this.hi}`, w - 70, 17);
    const ox = 6, oy = 22; g.fillStyle = '#8bac0f'; g.fillRect(ox, oy, GW * CS, GH * CS);
    g.fillStyle = '#306230'; this.s.forEach(([x, y], i) => g.fillRect(ox + x * CS + 1, oy + y * CS + 1, CS - 2, CS - 2));
    g.fillStyle = '#0f380f'; const [hx, hy] = this.s[0]; g.fillRect(ox + hx * CS + 6, oy + hy * CS + 6, 4, 4);
    g.beginPath(); g.arc(ox + this.f[0] * CS + 10, oy + this.f[1] * CS + 10, 7, 0, 7); g.fill();
    if (this.state !== 'play') {
      g.fillStyle = 'rgba(15,56,15,.85)'; g.fillRect(w / 2 - 150, h / 2 - 50, 300, 100);
      g.fillStyle = '#9bbc0f'; g.font = F(22, 'bold'); g.textAlign = 'center';
      g.fillText(this.state === 'over' ? 'GAME OVER' : 'SNAKE 2000', w / 2, h / 2 - 10);
      g.font = F(13); g.fillText('arrows / WASD  -  press SPACE', w / 2, h / 2 + 20); g.textAlign = 'left';
    }
  }
  key(e, down) {
    if (!down) return;
    if (e.code === 'Space' && this.state !== 'play') { this.reset(); this.state = 'play'; return; }
    const d = { ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1], ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0] }[e.code];
    if (d && (d[0] !== -this.dir[0] || d[1] !== -this.dir[1])) this.nd = d;
  }
}

import { A } from '../audio.js';
import { F, MONO, bevel, button, inside } from '../ui.js';

const plasmaC = document.createElement('canvas'); plasmaC.width = 80; plasmaC.height = 60;
const pg = plasmaC.getContext('2d'), pimg = pg.createImageData(80, 60);
const DEMO_TUNE = 'A4 C5 E5 A5 G5 E5 C5 E5 F4 A4 C5 F5 E5 C5 A4 C5 G4 B4 D5 G5 F5 D5 B4 D5 E4 G#4 B4 E5 D5 B4 G#4 B4';
const DEMO_BASS = 'A2 - A3 - A2 - A3 - F2 - F3 - F2 - F3 - G2 - G3 - G2 - G3 - E2 - E3 - E2 - E3';
const NEWS = [[0.5, 'Good evening. With just hours left in 1999, one question is on everyone\'s mind.'], [6.5, 'Is your toaster ready for the year 2000?'], [10.5, 'Experts say most household appliances do not know what year it is, and frankly, do not care.'], [17.5, 'Still, officials recommend flashlights, bottled water, and a positive attitude.'], [23.5, "And if your computer says it's 1900 at midnight, just turn it off and on again."], [29.5, 'Back to you, Tom.']];

export const VIDEOS = [
  { title: 'ASSEMBLY 99 - "Neon Dreams" 64k intro', file: 'neon_dreams.avi', views: '1,204', dur: 40,
    start() { this.stop = A.tune(DEMO_TUNE, 150, { vol: 0.05, bass: DEMO_BASS }); }, end() { this.stop && this.stop(); },
    draw(g, w, h, t) {
      const d = pimg.data;
      for (let y = 0; y < 60; y++) for (let x = 0; x < 80; x++) {
        const v = Math.sin(x / 8 + t) + Math.sin(y / 6 - t * 1.3) + Math.sin((x + y) / 10 + t * 0.7) + Math.sin(Math.hypot(x - 40, y - 30) / 5 - t * 2);
        const i = (y * 80 + x) * 4; d[i] = 128 + 127 * Math.sin(v * Math.PI); d[i + 1] = 40 + 40 * Math.sin(v * Math.PI + 2); d[i + 2] = 128 + 127 * Math.sin(v * Math.PI + 4); d[i + 3] = 255;
      }
      pg.putImageData(pimg, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(plasmaC, 0, 0, w, h);
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, w, h);
      const V = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      const P = V.map(([x, y, z]) => { let a = t * 0.9, b = t * 0.6; [x, z] = [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)]; [y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)]; const s = h * 0.35 / (z + 3.5); return [w / 2 + x * s * 1.6, h * 0.42 + y * s * 1.6]; });
      g.strokeStyle = '#fff'; g.lineWidth = 2; g.shadowColor = '#0ff'; g.shadowBlur = 12; g.beginPath(); E.forEach(([a, b]) => { g.moveTo(...P[a]); g.lineTo(...P[b]); }); g.stroke(); g.shadowBlur = 0; g.lineWidth = 1;
      const msg = '*** NITEFALL presents NEON DREAMS *** greetings to all the elite coders and 56k warriors *** happy new millennium *** see you at the party ***   ';
      g.font = F(Math.floor(h / 12), 'bold'); const cw = h / 16;
      for (let i = 0; i < msg.length; i++) { const x = w - ((t * 120) % (msg.length * cw + w)) + i * cw; if (x < -20 || x > w) continue; g.fillStyle = `hsl(${(i * 12 + t * 200) % 360},100%,70%)`; g.fillText(msg[i], x, h * 0.85 + Math.sin(t * 4 + i * 0.4) * h * 0.04); }
    } },
  { title: 'skateboard FAIL (OUCH!!!) funny', file: 'skate_fail.mpg', views: '48,211', dur: 14,
    events: [[5.9, () => { A.boom(0.8); A.hurt(); }], [6.6, () => crowd()], [11.0, () => A.boom(0.5)]],
    draw(g, w, h, t) {
      const replay = t > 9.5, tt = replay ? 4 + (t - 9.5) * 0.6 : t;
      g.fillStyle = '#8fb8de'; g.fillRect(0, 0, w, h); g.fillStyle = '#6a8a4a'; g.fillRect(0, h * 0.7, w, h * 0.3);
      g.fillStyle = '#999'; g.fillRect(0, h * 0.7, w, 4);
      const rx = w * 0.62; g.fillStyle = '#a0826a'; g.beginPath(); g.moveTo(rx - w * 0.15, h * 0.7); g.quadraticCurveTo(rx, h * 0.7, rx, h * 0.45); g.lineTo(rx + 8, h * 0.45); g.lineTo(rx + 8, h * 0.7); g.fill();
      let x, y, rot = 0, fallen = false;
      if (tt < 4) { x = w * 0.1 + tt / 4 * (rx - w * 0.2); y = h * 0.7; }
      else if (tt < 5.9) { const k = (tt - 4) / 1.9; x = rx - w * 0.1 + k * w * 0.25; y = h * 0.52 - Math.sin(k * Math.PI) * h * 0.25; rot = k * 5; }
      else { x = rx + w * 0.17; y = h * 0.72; rot = Math.PI / 2; fallen = true; }
      g.save(); g.translate(x, y); g.rotate(rot); g.strokeStyle = '#111'; g.lineWidth = 3; const s = h / 12;
      if (!fallen || true) { g.beginPath(); g.arc(0, -s * 3.2, s * 0.5, 0, 7); g.stroke(); g.beginPath(); g.moveTo(0, -s * 2.7); g.lineTo(0, -s * 1.3); g.moveTo(0, -s * 2.4); g.lineTo(-s, -s * (2 + Math.sin(tt * 8) * 0.3)); g.moveTo(0, -s * 2.4); g.lineTo(s, -s * 2.1); g.moveTo(0, -s * 1.3); g.lineTo(-s * 0.6, 0); g.moveTo(0, -s * 1.3); g.lineTo(s * 0.6, 0); g.stroke(); }
      g.restore();
      g.fillStyle = '#c33'; const bx = fallen ? rx + w * 0.3 + Math.min(1, tt - 5.9) * w * 0.1 : x; g.fillRect(bx - s, (fallen ? h * 0.72 : y) + 2, s * 2, 4);
      if (fallen) { g.fillStyle = '#fff'; g.font = F(h / 8, 'bold'); g.fillText('OHHHH!!', w * 0.15, h * 0.3); }
      if (replay) { g.fillStyle = '#f00'; g.font = F(h / 16, 'bold'); g.fillText('● INSTANT REPLAY', 10, h / 14); }
      g.fillStyle = '#fff'; g.font = MONO(h / 22); g.fillText('REC  12/24/99', w - h / 22 * 9, h - 10);
    } },
  { title: 'Channel 9 News: Is Your Toaster Y2K Ready?', file: 'y2k_news.rm', views: '3,017', dur: 34,
    events: NEWS.map(([t, s]) => [t, () => A.speak(s)]), end() { A.hush(); },
    draw(g, w, h, t) {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0b2a6a'); gr.addColorStop(1, '#061433'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(i * w / 8, 0, 2, h); }
      g.fillStyle = '#123'; g.fillRect(w * 0.6, h * 0.12, w * 0.33, h * 0.33); g.fillStyle = '#ffd400'; g.font = F(h / 9, 'bold'); g.fillText('Y2K?', w * 0.66, h * 0.26);
      g.fillStyle = '#ccc'; g.fillRect(w * 0.68, h * 0.3, w * 0.16, h * 0.1); g.fillStyle = '#333'; g.fillRect(w * 0.7, h * 0.29, w * 0.04, h * 0.02); g.fillRect(w * 0.77, h * 0.29, w * 0.04, h * 0.02);
      const cx = w * 0.35, cy = h * 0.42, s = h / 10;
      g.fillStyle = '#26324a'; g.beginPath(); g.moveTo(cx - s * 2.2, h * 0.8); g.lineTo(cx - s * 1.6, cy + s * 1.4); g.lineTo(cx + s * 1.6, cy + s * 1.4); g.lineTo(cx + s * 2.2, h * 0.8); g.fill();
      g.fillStyle = '#e8b890'; g.beginPath(); g.ellipse(cx, cy, s * 0.95, s * 1.2, 0, 0, 7); g.fill();
      g.fillStyle = '#5a3418'; g.beginPath(); g.ellipse(cx, cy - s * 0.6, s * 1.1, s * 0.8, 0, Math.PI, 0); g.fill(); g.fillRect(cx - s * 1.1, cy - s * 0.6, s * 0.35, s * 1.8); g.fillRect(cx + s * 0.75, cy - s * 0.6, s * 0.35, s * 1.8);
      g.fillStyle = '#222'; g.fillRect(cx - s * 0.45, cy - s * 0.1, s * 0.2, s * 0.12); g.fillRect(cx + s * 0.25, cy - s * 0.1, s * 0.2, s * 0.12);
      const line = NEWS.filter(n => n[0] <= t).pop(), talking = line && t - line[0] < line[1].length / 14;
      g.fillStyle = '#7a2020'; g.beginPath(); g.ellipse(cx, cy + s * 0.55, s * 0.3, talking ? s * (0.08 + 0.12 * Math.abs(Math.sin(t * 14))) : s * 0.04, 0, 0, 7); g.fill();
      g.fillStyle = '#4a3a2a'; g.fillRect(0, h * 0.78, w, h * 0.22);
      g.fillStyle = '#b00'; g.fillRect(0, h * 0.66, w * 0.55, h * 0.08); g.fillStyle = '#fff'; g.font = F(h / 20, 'bold'); g.fillText('DANA WHITFIELD  |  CHANNEL 9', 8, h * 0.715);
      if (line && talking) { g.font = F(h / 20); g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(0, h * 0.84, w, h * 0.1); g.fillStyle = '#ff0'; g.textAlign = 'center'; g.fillText(line[1].length > 60 ? line[1].slice(0, 58) + '…' : line[1], w / 2, h * 0.905); g.textAlign = 'left'; }
    } },
];
function crowd() { for (let i = 0; i < 5; i++) A.beep(180 + i * 40, 1.1, 0.04, 'sawtooth', i * 0.05); }

export class Tube {
  constructor(os) { this.os = os; this.v = null; this.alwaysUpdate = false; }
  winTitle() { return this.v ? `${this.v.file} - TubePlayer` : 'NiteTube - TubePlayer'; }
  play(v) { this.stopAudio(); this.v = v; this.t = 0; this.buf = 1.8; this.playing = true; this.fired = 0; }
  stopAudio() { if (this.v && this.v.end) this.v.end(); }
  close() { this.stopAudio(); }
  update(dt) {
    if (!this.v || !this.playing) return;
    if (this.buf > 0) { this.buf -= dt; if (this.buf <= 0 && this.v.start) this.v.start(); return; }
    const prev = this.t; this.t += dt;
    for (const [et, fn] of this.v.events || []) if (prev < et && this.t >= et) fn();
    if (this.t >= this.v.dur) { this.t = 0; this.stopAudio(); this.v.start && this.v.start(); }
  }
  toggle() { this.playing = !this.playing; if (this.buf > 0) return; if (this.playing) this.v.start && this.v.start(); else this.stopAudio(); }
  draw(g, w, h) {
    g.fillStyle = '#1a1a1a'; g.fillRect(0, 0, w, h);
    if (!this.v) {
      g.fillStyle = '#fff'; g.font = F(26, 'bold italic'); g.fillText('Nite', 16, 38); g.fillStyle = '#e22'; g.fillText('Tube', 72, 38);
      g.fillStyle = '#aaa'; g.font = F(12); g.fillText('The best videos on the Information Superhighway. Click to watch!', 150, 34);
      VIDEOS.forEach((v, i) => {
        const y = 60 + i * 118, hov = inside(this.os.mouse.x - 4, this.os.mouse.y - 24, [10, y, w - 20, 108]);
        g.fillStyle = hov ? '#333' : '#262626'; g.fillRect(10, y, w - 20, 108);
        g.save(); g.translate(16, y + 6); g.beginPath(); g.rect(0, 0, 128, 96); g.clip(); v.draw(g, 128, 96, 5 + this.os.t * 0.3); g.restore();
        g.fillStyle = '#6af'; g.font = F(15, 'bold'); g.fillText(v.title, 160, y + 30);
        g.fillStyle = '#999'; g.font = F(12); g.fillText(`${v.file}  •  ${v.views} views  •  0:${String(v.dur).padStart(2, '0')}`, 160, y + 52);
        g.fillText(i === 2 ? 'Requires RealPlayer G2 (you have it, relax)' : i === 1 ? 'my cousin eddie at the skate park lol' : 'Winner, ASSEMBLY 99 64k intro compo', 160, y + 72);
      });
      return;
    }
    const vh = h - 48, vw = Math.min(w, vh * 4 / 3), vx = (w - vw) / 2;
    g.fillStyle = '#000'; g.fillRect(0, 0, w, vh);
    g.save(); g.translate(vx, 0); g.beginPath(); g.rect(0, 0, vw, vh); g.clip(); this.v.draw(g, vw, vh, this.t);
    if (this.buf > 0) { g.fillStyle = 'rgba(0,0,0,.75)'; g.fillRect(0, 0, vw, vh); g.fillStyle = '#fff'; g.font = F(16, 'bold'); g.textAlign = 'center'; g.fillText(`Buffering... ${Math.floor((1 - this.buf / 1.8) * 100)}%`, vw / 2, vh / 2); g.font = F(11); g.fillText('(net congestion)', vw / 2, vh / 2 + 20); g.textAlign = 'left'; }
    g.restore();
    bevel(g, 0, vh, w, 48);
    button(g, 8, vh + 10, 34, 28, this.playing ? '❚❚' : '▶', false, F(12, 'bold')); button(g, 46, vh + 10, 34, 28, '■', false, F(12, 'bold'));
    bevel(g, 92, vh + 18, w - 200, 12, true, '#fff'); g.fillStyle = '#000080'; g.fillRect(94, vh + 20, (w - 204) * (this.t / this.v.dur), 8);
    g.fillStyle = '#000'; g.font = MONO(13); const f = (s) => `0:${String(Math.floor(s)).padStart(2, '0')}`; g.fillText(`${f(this.t)}/${f(this.v.dur)}`, w - 100, vh + 29);
  }
  mouse(type, x, y) {
    if (type !== 'down') return;
    if (!this.v) { VIDEOS.forEach((v, i) => { if (inside(x, y, [10, 60 + i * 118, 612, 108])) { A.click(); this.play(v); } }); return; }
    const vh = 424 - 48;
    if (inside(x, y, [8, vh + 10, 34, 28])) this.toggle();
    else if (inside(x, y, [46, vh + 10, 34, 28])) { this.stopAudio(); this.v = null; }
    else if (inside(x, y, [92, vh + 14, 432, 20])) { this.t = Math.max(0, (x - 94) / 428 * this.v.dur); }
    else if (y < vh) this.toggle();
  }
  key(e, down) {
    if (!down || !this.v) return;
    if (e.code === 'Space') this.toggle();
    if (e.code === 'Backspace') { this.stopAudio(); this.v = null; }
    if (e.code === 'ArrowRight') this.t = Math.min(this.v.dur - 0.1, this.t + 5);
    if (e.code === 'ArrowLeft') this.t = Math.max(0, this.t - 5);
  }
}

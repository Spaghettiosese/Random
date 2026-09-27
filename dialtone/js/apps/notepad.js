import { F, MONO, wrap, typed } from '../ui.js';
const DEFAULT = `NEW YEARS RESOLUTIONS 2000
==========================
1. beat DOOMED on nightmare
2. get 70 wpm in KeyStorm (beat d4rkst4r!!!)
3. finish my geovillages page
4. stop staying up til 3am on the computer
5. ...ok maybe 2am

p.s. if the world ends at midnight, whoever finds this: it was fun.
`;
export class Notepad {
  constructor(os) { this.os = os; try { this.text = localStorage.getItem('dt_note') ?? DEFAULT; } catch (e) { this.text = DEFAULT; } }
  winTitle() { return 'resolutions.txt - Notepad'; }
  save() { try { localStorage.setItem('dt_note', this.text); } catch (e) {} }
  draw(g, w, h) {
    g.fillStyle = '#c0c0c0'; g.fillRect(0, 0, w, 20); g.fillStyle = '#000'; g.font = F(11);
    ['File', 'Edit', 'Search', 'Help'].forEach((m, i) => g.fillText(m, 8 + i * 48, 14));
    g.fillStyle = '#fff'; g.fillRect(0, 20, w, h - 20);
    g.font = MONO(14); g.fillStyle = '#000';
    const lines = wrap(g, this.text, w - 24), maxRows = Math.floor((h - 30) / 17);
    const vis = lines.slice(Math.max(0, lines.length - maxRows));
    vis.forEach((l, i) => g.fillText(l, 8, 38 + i * 17));
    const last = vis[vis.length - 1] || '';
    if (Math.floor(this.os.t * 2) % 2 === 0) g.fillRect(8 + g.measureText(last).width + 1, 26 + (vis.length - 1) * 17, 2, 16);
  }
  key(e, down) {
    if (!down) return;
    if (e.code === 'Backspace') this.text = this.text.slice(0, -1);
    else if (e.code === 'Enter') this.text += '\n';
    else if (e.code === 'Tab') this.text += '    ';
    else { const c = typed(e); if (c) this.text += c; else return; }
    this.save();
  }
}

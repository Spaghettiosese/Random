// Tiny retro widget kit for drawing the OS into a 2D canvas.
export const F = (s = 11, w = '') => `${w} ${s}px Tahoma, Verdana, "DejaVu Sans", sans-serif`;
export const MONO = (s = 12) => `${s}px "Courier New", "DejaVu Sans Mono", monospace`;
export const inside = (x, y, r) => x >= r[0] && y >= r[1] && x < r[0] + r[2] && y < r[1] + r[3];

export function bevel(g, x, y, w, h, inset = false, fill = '#c0c0c0') {
  g.fillStyle = fill; g.fillRect(x, y, w, h);
  g.fillStyle = inset ? '#808080' : '#fff'; g.fillRect(x, y, w, 1); g.fillRect(x, y, 1, h);
  g.fillStyle = inset ? '#fff' : '#000'; g.fillRect(x, y + h - 1, w, 1); g.fillRect(x + w - 1, y, 1, h);
  if (!inset) { g.fillStyle = '#808080'; g.fillRect(x + 1, y + h - 2, w - 2, 1); g.fillRect(x + w - 2, y + 1, 1, h - 2); }
}
export function button(g, x, y, w, h, label, pressed = false, font = F(11)) {
  bevel(g, x, y, w, h, pressed);
  g.fillStyle = '#000'; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(label, x + w / 2 + (pressed ? 1 : 0), y + h / 2 + 1 + (pressed ? 1 : 0));
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
}
export function field(g, x, y, w, h, text, focused, t) {
  bevel(g, x, y, w, h, true, '#fff');
  g.save(); g.beginPath(); g.rect(x + 2, y, w - 4, h); g.clip();
  g.fillStyle = '#000'; g.font = F(12); g.textBaseline = 'middle';
  const tw = g.measureText(text).width, off = Math.min(0, w - 10 - tw);
  g.fillText(text, x + 4 + off, y + h / 2 + 1);
  if (focused && Math.floor(t * 2) % 2 === 0) g.fillRect(x + 5 + off + tw, y + 3, 1, h - 6);
  g.restore(); g.textBaseline = 'alphabetic';
}
export function wrap(g, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const test = line ? line + ' ' + word : word;
      if (g.measureText(test).width > maxW && line) { out.push(line); line = word; } else line = test;
    }
    out.push(line);
  }
  return out;
}
// printable char from a KeyboardEvent (null if not typing)
export const typed = (e) => (e.key.length === 1 && !e.ctrlKey && !e.metaKey ? e.key : null);

export function icon(g, kind, x, y) {
  g.save(); g.translate(x, y);
  const P = (c, ...r) => { g.fillStyle = c; g.fillRect(...r); };
  switch (kind) {
    case 'browser':
      g.fillStyle = '#1d5fd1'; g.beginPath(); g.arc(16, 16, 14, 0, 7); g.fill();
      g.fillStyle = '#3ab54a'; g.beginPath(); g.ellipse(11, 12, 6, 5, 0.4, 0, 7); g.ellipse(21, 21, 5, 6, -0.3, 0, 7); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(16, 16, 6, 14, 0, 0, 7); g.moveTo(2, 16); g.lineTo(30, 16); g.stroke();
      g.strokeStyle = '#fc0'; g.lineWidth = 2; g.beginPath(); g.arc(16, 16, 15, 3.6, 5.2); g.stroke(); break;
    case 'chat':
      g.fillStyle = '#ffd400'; g.beginPath(); g.ellipse(16, 14, 14, 11, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(8, 22); g.lineTo(4, 30); g.lineTo(14, 24); g.fill();
      P('#000', 10, 10, 3, 4); P('#000', 19, 10, 3, 4); g.strokeStyle = '#000'; g.lineWidth = 2; g.beginPath(); g.arc(16, 14, 6, 0.3, 2.8); g.stroke(); break;
    case 'tube':
      P('#333', 2, 6, 28, 22); P('#8cf', 4, 8, 24, 16); g.fillStyle = '#e22'; g.beginPath(); g.moveTo(12, 11); g.lineTo(22, 16); g.lineTo(12, 21); g.fill(); P('#555', 8, 28, 16, 2); break;
    case 'snake':
      P('#000', 2, 2, 28, 28); g.strokeStyle = '#3f3'; g.lineWidth = 4; g.beginPath(); g.moveTo(6, 24); g.lineTo(6, 16); g.lineTo(16, 16); g.lineTo(16, 8); g.lineTo(26, 8); g.stroke(); P('#f33', 24, 22, 4, 4); break;
    case 'typer':
      P('#222', 2, 18, 28, 12); for (let i = 0; i < 6; i++) P('#ddd', 4 + i * 4, 20, 3, 3); P('#ddd', 8, 25, 16, 3);
      g.fillStyle = '#ff0'; g.beginPath(); g.moveTo(18, 0); g.lineTo(10, 10); g.lineTo(16, 10); g.lineTo(12, 18); g.lineTo(22, 7); g.lineTo(16, 7); g.fill(); break;
    case 'notepad':
      P('#fff', 6, 2, 20, 28); P('#000', 6, 2, 20, 1); P('#000', 6, 29, 20, 1); P('#000', 6, 2, 1, 28); P('#000', 25, 2, 1, 28);
      for (let i = 0; i < 6; i++) P('#66c', 9, 7 + i * 4, 14, 1); P('#48f', 4, 2, 3, 28); break;
    case 'doom':
      P('#300', 2, 2, 28, 28); g.fillStyle = '#e40'; g.beginPath(); g.moveTo(2, 30); for (let i = 0; i <= 7; i++) g.lineTo(2 + i * 4, i % 2 ? 14 : 22); g.lineTo(30, 30); g.fill();
      g.fillStyle = '#fc0'; g.font = 'bold 20px Impact, Arial'; g.fillText('D', 10, 22); break;
    case 'trash':
      P('#999', 8, 8, 16, 22); P('#ccc', 6, 5, 20, 3); for (let i = 0; i < 3; i++) P('#666', 11 + i * 4, 11, 2, 16); break;
    case 'zip':
      P('#e8c84a', 4, 6, 24, 22); P('#b8942a', 4, 6, 24, 4); for (let i = 0; i < 5; i++) P(i % 2 ? '#333' : '#aaa', 15, 10 + i * 3, 3, 3); break;
    case 'start':
      P('#f33', 0, 0, 7, 7); P('#3c3', 8, 0, 7, 7); P('#36f', 0, 8, 7, 7); P('#fd0', 8, 8, 7, 7); break;
  }
  g.restore();
}

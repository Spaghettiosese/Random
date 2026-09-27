import { A } from '../audio.js';
import { F, MONO } from '../ui.js';

const RW = 320, RH = 168, HUD = 32;
const LEVELS = [
  { name: 'E1M1: HANGAR 99', floor: 'tile', ceil: 'ceil', map: [
    '########################',
    '#P.....#.....TTTTTTTTTT#',
    '#......#.....T........T#',
    '#..s...D.....T...i..h.T#',
    '#......#.....T........T#',
    '#......#.....TTTTDTTTTT#',
    '####D###...i...........#',
    '#......#...............#',
    '#..i...#####.....#######',
    '#......#...#.....#.....#',
    '#..h...#...#..i..D..i..#',
    '#......D...#.....#.....#',
    '#......#...#.....#..s..#',
    '##D#####...###D###.....#',
    '#..........#.....#######',
    '#..i....i..#..h..#RRRRR#',
    '#..........#.....D..i.X#',
    '#....s.....#..i..#RRRRR#',
    '########################'] },
  { name: 'E1M9: HOME', floor: 'home', ceil: 'home', dark: true, map: [
    'FFFFFFFFFFFFFFFFFFFFFF',
    'F....................F',
    'F.HHHHHHHHHHHHHHHHHH.F',
    'F.H..v..........C..H.F',
    'F.H................H.F',
    'F.H...i.........i..H.F',
    'F.H...c.........b..H.F',
    'F.H................H.F',
    'F.H.......i........H.F',
    'F.Ht...............H.F',
    'F.HHHHHHHHDHHHHHHHHH.F',
    'F....................F',
    'F....i.....s.........F',
    'F................i...F',
    'F....h...............F',
    'F.........P..........F',
    'FFFFFFFFFFFFFFFFFFFFFF'] },
];
const SOLID = '#TDXRHF';

function mk(fn) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); fn(g); return new Uint32Array(g.getImageData(0, 0, 64, 64).data.buffer.slice(0)); }
const nz = (g, n, a) => { for (let i = 0; i < n; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * a})`; g.fillRect(Math.random() * 64, Math.random() * 64, 2, 2); } };
const TEX = {
  '#': mk(g => { g.fillStyle = '#6d5a48'; g.fillRect(0, 0, 64, 64); for (let y = 0; y < 64; y += 16) for (let x = (y / 16 % 2) * 16; x < 80; x += 32) { g.fillStyle = `hsl(25,${20 + Math.random() * 10}%,${30 + Math.random() * 10}%)`; g.fillRect(x - 16 + 1, y + 1, 30, 14); } nz(g, 300, 0.4); }),
  T: mk(g => { g.fillStyle = '#5a6068'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#3a4048'; g.fillRect(0, 30, 64, 4); g.fillRect(30, 0, 4, 64); g.fillStyle = '#8a9098'; g.fillRect(4, 4, 22, 22); g.fillRect(38, 38, 22, 22); g.fillStyle = '#2f2'; g.fillRect(40, 8, 4, 4); g.fillStyle = '#f22'; g.fillRect(48, 8, 4, 4); nz(g, 200, 0.3); }),
  D: mk(g => { g.fillStyle = '#7a7060'; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 64; i += 8) { g.fillStyle = '#5a5040'; g.fillRect(0, i, 64, 2); } g.fillStyle = '#c8a020'; for (let i = -64; i < 64; i += 12) { g.beginPath(); g.moveTo(i, 58); g.lineTo(i + 6, 58); g.lineTo(i + 12, 64); g.lineTo(i + 6, 64); g.fill(); } g.fillStyle = '#222'; g.fillRect(0, 56, 64, 2); nz(g, 150, 0.3); }),
  X: mk(g => { g.fillStyle = '#4a4a4a'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#222'; g.fillRect(16, 16, 32, 32); g.fillStyle = '#f33'; g.fillRect(22, 22, 20, 8); g.fillStyle = '#3f3'; g.fillRect(22, 34, 20, 8); g.fillStyle = '#ff0'; g.font = 'bold 9px monospace'; g.fillText('EXIT', 21, 12); }),
  R: mk(g => { g.fillStyle = '#5a1a10'; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 40; i++) { g.fillStyle = `hsl(${5 + Math.random() * 15},60%,${15 + Math.random() * 20}%)`; g.beginPath(); g.arc(Math.random() * 64, Math.random() * 64, 3 + Math.random() * 8, 0, 7); g.fill(); } g.strokeStyle = '#f80'; g.beginPath(); g.moveTo(0, 40); g.lineTo(20, 36); g.lineTo(30, 44); g.lineTo(64, 38); g.stroke(); }),
  H: mk(g => { g.fillStyle = '#cfc2a0'; g.fillRect(0, 0, 64, 64); for (let x = 0; x < 64; x += 16) { g.fillStyle = 'rgba(120,80,60,.2)'; g.fillRect(x, 0, 6, 64); } g.fillStyle = '#e9e2d0'; g.fillRect(0, 58, 64, 6); nz(g, 150, 0.1); }),
  S: mk(g => { g.fillStyle = '#7f8c99'; g.fillRect(0, 0, 64, 64); for (let y = 0; y < 64; y += 8) { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, y + 7, 64, 1); } nz(g, 150, 0.2); }),
  F: mk(g => { g.fillStyle = '#16261a'; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 300; i++) { g.fillStyle = `hsl(${100 + Math.random() * 30},40%,${8 + Math.random() * 16}%)`; g.fillRect(Math.random() * 64, Math.random() * 64, 3, 3); } }),
  tile: mk(g => { g.fillStyle = '#4a4a50'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#3a3a40'; g.fillRect(0, 0, 32, 32); g.fillRect(32, 32, 32, 32); nz(g, 200, 0.3); }),
  ceil: mk(g => { g.fillStyle = '#2a2a2e'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#88a'; g.fillRect(24, 24, 16, 16); nz(g, 100, 0.3); }),
  wood: mk(g => { for (let i = 0; i < 4; i++) { g.fillStyle = `hsl(25,40%,${26 + Math.random() * 8}%)`; g.fillRect(0, i * 16, 64, 16); g.fillStyle = '#2a160a'; g.fillRect(0, i * 16, 64, 1); } nz(g, 200, 0.2); }),
  grass: mk(g => { g.fillStyle = '#1d2a17'; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 400; i++) { g.fillStyle = `hsl(${90 + Math.random() * 30},35%,${8 + Math.random() * 14}%)`; g.fillRect(Math.random() * 64, Math.random() * 64, 1, 3); } }),
  white: mk(g => { g.fillStyle = '#9c988e'; g.fillRect(0, 0, 64, 64); nz(g, 80, 0.1); }),
};
const spr = (fn) => mk(g => { g.clearRect(0, 0, 64, 64); fn(g); });
const imp = (f) => spr(g => {
  const legs = f % 2 ? [[24, 44, 20, 64], [38, 44, 44, 64]] : [[26, 44, 28, 64], [38, 44, 36, 64]];
  if (f === 3) { g.fillStyle = '#6a2a14'; g.beginPath(); g.ellipse(32, 58, 22, 6, 0, 0, 7); g.fill(); g.fillStyle = '#a00'; g.beginPath(); g.ellipse(30, 60, 26, 4, 0, 0, 7); g.fill(); return; }
  g.strokeStyle = '#5a3218'; g.lineWidth = 6; g.beginPath(); for (const [a, b, c, d] of legs) { g.moveTo(a, b); g.lineTo(c, d); } g.stroke();
  g.fillStyle = '#7a4a2a'; g.beginPath(); g.ellipse(32, 34, 12, 14, 0, 0, 7); g.fill();
  g.fillStyle = '#6a3a1a'; g.beginPath(); g.arc(32, 16, 8, 0, 7); g.fill();
  g.fillStyle = '#ddd'; for (const x of [22, 42]) { g.beginPath(); g.moveTo(x - 3, 24); g.lineTo(x, 16); g.lineTo(x + 3, 24); g.fill(); }
  g.fillStyle = '#f20'; g.fillRect(27, 14, 4, 3); g.fillRect(34, 14, 4, 3);
  g.strokeStyle = '#7a4a2a'; g.lineWidth = 5; g.beginPath();
  if (f === 2) { g.moveTo(22, 28); g.lineTo(16, 10); g.moveTo(42, 28); g.lineTo(48, 10); g.stroke(); g.fillStyle = '#fa0'; g.beginPath(); g.arc(32, 6, 6, 0, 7); g.fill(); }
  else { g.moveTo(22, 28); g.lineTo(14, 42); g.moveTo(42, 28); g.lineTo(50, 42); g.stroke(); }
});
const SPR = {
  imp: [imp(0), imp(1), imp(2), imp(3)],
  h: spr(g => { g.fillStyle = '#eee'; g.fillRect(20, 48, 24, 16); g.fillStyle = '#d00'; g.fillRect(29, 50, 6, 12); g.fillRect(24, 53, 16, 6); }),
  s: spr(g => { g.fillStyle = '#a82'; g.fillRect(20, 52, 24, 12); g.fillStyle = '#d33'; for (let i = 0; i < 4; i++) g.fillRect(22 + i * 6, 46, 4, 8); }),
  fire: spr(g => { const r = g.createRadialGradient(32, 32, 1, 32, 32, 12); r.addColorStop(0, '#fff'); r.addColorStop(0.4, '#fc0'); r.addColorStop(1, 'rgba(255,60,0,0)'); g.fillStyle = r; g.fillRect(16, 16, 32, 32); }),
  t: spr(g => { g.fillStyle = '#7a1c1c'; g.fillRect(28, 56, 8, 8); g.fillStyle = '#173a22'; g.beginPath(); g.moveTo(32, 4); g.lineTo(12, 58); g.lineTo(52, 58); g.fill(); for (let i = 0; i < 16; i++) { g.fillStyle = ['#f33', '#3f3', '#39f', '#fd3'][i % 4]; g.fillRect(20 + (i * 13) % 24, 16 + (i * 7) % 40, 3, 3); } g.fillStyle = '#fe0'; g.fillRect(29, 2, 6, 6); }),
  v: spr(g => { g.fillStyle = '#2b2018'; g.fillRect(16, 48, 32, 16); g.fillStyle = '#1b1b1d'; g.fillRect(18, 28, 28, 22); g.fillStyle = '#58a'; g.fillRect(21, 31, 22, 16); g.fillStyle = '#fff'; g.fillRect(30, 36, 4, 4); }),
  c: spr(g => { g.fillStyle = '#5c4a3a'; g.fillRect(4, 44, 56, 20); g.fillRect(4, 36, 56, 10); g.fillStyle = '#6c5a4a'; g.fillRect(2, 40, 8, 24); g.fillRect(54, 40, 8, 24); }),
  b: spr(g => { g.fillStyle = '#4a3222'; g.fillRect(6, 50, 52, 14); g.fillStyle = '#28406a'; g.fillRect(6, 46, 52, 8); g.fillStyle = '#eee'; g.fillRect(8, 42, 14, 6); }),
  C: spr(g => { g.fillStyle = '#6a5040'; g.fillRect(6, 46, 52, 4); g.fillRect(8, 50, 4, 14); g.fillRect(52, 50, 4, 14); g.fillStyle = '#d8cfb6'; g.fillRect(20, 26, 24, 20); g.fillStyle = '#300'; g.fillRect(23, 29, 18, 13); g.fillStyle = '#f40'; g.fillRect(25, 36, 14, 4); g.fillStyle = '#d8cfb6'; g.fillRect(22, 44, 20, 2); }),
};
const shade = (c, s) => { const r = (c & 255) * s, g = ((c >> 8) & 255) * s, b = ((c >> 16) & 255) * s; return 0xff000000 | (b > 255 ? 255 : b) << 16 | (g > 255 ? 255 : g) << 8 | (r > 255 ? 255 : r); };

export class Doom {
  constructor(os) {
    this.os = os; this.hideCursor = true; this.cv = document.createElement('canvas'); this.cv.width = RW; this.cv.height = RH + HUD;
    this.cx = this.cv.getContext('2d'); this.img = this.cx.createImageData(RW, RH); this.buf = new Uint32Array(this.img.data.buffer);
    this.z = new Float32Array(RW); this.keys = {}; this.cheat = ''; this.god = false;
    this.load(0);
  }
  winTitle() { return `DOOMED - ${LEVELS[this.lvl].name}`; }
  load(n) {
    const L = LEVELS[n]; this.lvl = n; this.map = L.map.map(r => r.split('')); this.things = []; this.shots = [];
    this.map.forEach((row, y) => row.forEach((c, x) => {
      if (c === 'P') { this.px = x + 0.5; this.py = y + 0.5; this.pa = n === 0 ? 0 : -Math.PI / 2; }
      else if (c === 'i') this.things.push({ k: 'imp', x: x + 0.5, y: y + 0.5, hp: 60, st: 'idle', cd: 1 + Math.random(), t: Math.random() * 3 });
      else if ('hs'.includes(c)) this.things.push({ k: c, x: x + 0.5, y: y + 0.5 });
      else if ('tvcbC'.includes(c)) this.things.push({ k: c, x: x + 0.5, y: y + 0.5, deco: true });
      else return;
      row[x] = '.';
    }));
    if (!this.hp || this.hp <= 0) { this.hp = 100; this.ammo = 20; }
    this.doors = {}; this.state = 'play'; this.msg = L.name; this.msgT = 3; this.time = 0; this.kills = 0; this.total = this.things.filter(t => t.k === 'imp').length;
    this.fireCd = 0; this.flash = 0; this.hurtT = 0; this.bob = 0; this.pump = 0;
    if (n === 1) this.os.emit('doom-level2');
  }
  solid(x, y) { const c = this.map[y | 0] && this.map[y | 0][x | 0]; return !c || (SOLID.includes(c) && !(c === 'D' && this.doors[(y | 0) + ',' + (x | 0)] >= 1)); }
  inHouse(x, y) { return this.lvl === 1 && x >= 3 && x < 19 && y >= 3 && y < 10; }
  los(x0, y0, x1, y1) { const d = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(d * 8); for (let i = 1; i < n; i++) if (this.solid(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n)) return false; return true; }
  move(o, dx, dy, r = 0.22) {
    if (!this.solid(o.x + dx + Math.sign(dx) * r, o.y) && !this.blocked(o, o.x + dx, o.y)) o.x += dx;
    if (!this.solid(o.x, o.y + dy + Math.sign(dy) * r) && !this.blocked(o, o.x, o.y + dy)) o.y += dy;
  }
  blocked(o, x, y) { return this.things.some(t => t !== o && (t.deco || (t.k === 'imp' && t.st !== 'dead')) && Math.hypot(t.x - x, t.y - y) < 0.45); }
  update(dt) {
    if (this.msgT > 0) this.msgT -= dt;
    if (this.state !== 'play') return;
    this.time += dt;
    const k = this.keys, me = { x: this.px, y: this.py };
    const fw = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0), st = (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0);
    this.pa += ((k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0)) * 2.6 * dt;
    const sp = (k.ShiftLeft || k.ShiftRight ? 5 : 3.2) * dt, ca = Math.cos(this.pa), sa = Math.sin(this.pa);
    this.move(me, (ca * fw - sa * st) * sp, (sa * fw + ca * st) * sp);
    this.px = me.x; this.py = me.y;
    if (fw || st) this.bob += dt * 9;
    if ((k.ControlLeft || k.ControlRight || k.Space || this.mouseFire) && this.fireCd <= 0) this.fire();
    this.fireCd -= dt; this.flash = Math.max(0, this.flash - dt * 8); this.hurtT = Math.max(0, this.hurtT - dt * 2);
    for (const key in this.doors) if (this.doors[key] < 1) this.doors[key] = Math.min(1, this.doors[key] + dt * 2);
    for (const t of this.things) {
      if (t.k === 'imp' && t.st !== 'dead') this.think(t, dt);
      else if (!t.deco && t.k !== 'imp' && Math.hypot(t.x - this.px, t.y - this.py) < 0.5) {
        if (t.k === 'h' && this.hp < 100) { this.hp = Math.min(100, this.hp + 25); t.gone = true; A.pickup(); this.say('Picked up a medikit.'); }
        if (t.k === 's') { this.ammo += 8; t.gone = true; A.pickup(); this.say('Picked up 8 shotgun shells.'); }
      }
      if (t.k === 'C' && Math.hypot(t.x - this.px, t.y - this.py) < 1.3) this.ending();
    }
    this.things = this.things.filter(t => !t.gone);
    for (const s of this.shots) {
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (this.solid(s.x, s.y)) s.dead = true;
      else if (Math.hypot(s.x - this.px, s.y - this.py) < 0.35) { s.dead = true; this.damage(8 + Math.random() * 10); }
    }
    this.shots = this.shots.filter(s => !s.dead);
  }
  think(t, dt) {
    t.t += dt; t.cd -= dt;
    const d = Math.hypot(this.px - t.x, this.py - t.y), sees = d < 14 && this.los(t.x, t.y, this.px, this.py);
    if (t.st === 'idle' && sees) { t.st = 'chase'; A.growl(); }
    if (t.st === 'pain') { t.pain -= dt; if (t.pain <= 0) t.st = 'chase'; return; }
    if (t.st !== 'chase') return;
    if (d > 1.1) { const s = 1.4 * dt; this.move(t, (this.px - t.x) / d * s, (this.py - t.y) / d * s, 0.25); }
    t.atk = Math.max(0, (t.atk || 0) - dt);
    if (t.cd <= 0 && sees) {
      t.cd = 1.6 + Math.random() * 1.5; t.atk = 0.4;
      if (d < 1.4) this.damage(6 + Math.random() * 6);
      else { const v = 5.5 / d; this.shots.push({ x: t.x, y: t.y, vx: (this.px - t.x) * v, vy: (this.py - t.y) * v }); A.fireball(); }
    }
  }
  damage(n) { if (this.god || this.state !== 'play') return; this.hp -= Math.round(n); this.hurtT = 1; A.hurt(); if (this.hp <= 0) { this.hp = 0; this.state = 'dead'; A.growl(); } }
  say(m) { this.msg = m; this.msgT = 2.5; }
  fire() {
    if (this.ammo <= 0) { this.say('Out of shells! Find ammo (or try IDKFA)'); this.fireCd = 0.5; return; }
    this.ammo--; this.fireCd = 0.85; this.flash = 1; this.pump = 1; A.shoot();
    const ca = Math.cos(this.pa), sa = Math.sin(this.pa);
    for (const t of this.things) {
      if (t.k !== 'imp' || t.st === 'dead') continue;
      const dx = t.x - this.px, dy = t.y - this.py, d = Math.hypot(dx, dy);
      const fwd = dx * ca + dy * sa, side = -dx * sa + dy * ca;
      if (fwd <= 0 || Math.abs(side / fwd) > 0.14 + 0.3 / d || !this.los(this.px, this.py, t.x, t.y)) continue;
      t.hp -= Math.max(10, 70 - d * 7) * (0.7 + Math.random() * 0.6);
      if (t.hp <= 0) { t.st = 'dead'; this.kills++; A.growl(); if (Math.random() < 0.4) this.things.push({ k: 's', x: t.x + 0.2, y: t.y }); }
      else { t.st = 'pain'; t.pain = 0.25; }
    }
  }
  use() {
    const x = this.px + Math.cos(this.pa) * 0.9, y = this.py + Math.sin(this.pa) * 0.9, c = this.map[y | 0][x | 0];
    if (c === 'D') { const key = (y | 0) + ',' + (x | 0); if (!(key in this.doors)) { this.doors[key] = 0; A.boom(0.3); A.beep(90, 0.4, 0.06, 'sawtooth'); } }
    if (c === 'X') { A.switchOn(); this.state = 'inter'; }
  }
  ending() {
    if (this.state === 'end') return;
    this.state = 'end'; this.endT = 0; A.thunder(1.5); this.os.emit('doom-end');
  }
  render() {
    const B = this.buf, L = LEVELS[this.lvl], dark = L.dark ? 0.75 : 1;
    const dx = Math.cos(this.pa), dy = Math.sin(this.pa), plx = -dy * 0.66, ply = dx * 0.66, H2 = RH / 2;
    const flash = 1 + this.flash * 0.5;
    for (let y = H2 + 1; y < RH; y++) {
      const rd = H2 / (y - H2), sx = rd * 2 * plx / RW, sy = rd * 2 * ply / RW;
      let fx = this.px + rd * (dx - plx), fy = this.py + rd * (dy - ply);
      const s = Math.min(1, 1.6 / (rd * 0.45 + 0.7)) * dark * flash, rowF = y * RW, rowC = (RH - y - 1) * RW;
      for (let x = 0; x < RW; x++) {
        const tx = (fx * 64) & 63, ty = (fy * 64) & 63, ti = ty * 64 + tx;
        let ft, ct;
        if (L.floor === 'home') { const ins = fx >= 3 && fx < 19 && fy >= 3 && fy < 10; ft = ins ? TEX.wood : TEX.grass; ct = ins ? TEX.white : null; }
        else { ft = TEX.tile; ct = TEX.ceil; }
        B[rowF + x] = shade(ft[ti], s);
        B[rowC + x] = ct ? shade(ct[ti], s) : (Math.random() < 0.004 ? 0xffb0a0a0 : 0xff000000 | ((20 + y / 6) << 16) | (8 << 8) | 4);
        fx += sx; fy += sy;
      }
    }
    for (let x = 0; x < RW; x++) {
      const cam = 2 * x / RW - 1, rx = dx + plx * cam, ry = dy + ply * cam;
      let mx = this.px | 0, my = this.py | 0;
      const ddx = Math.abs(1 / rx), ddy = Math.abs(1 / ry), stx = rx < 0 ? -1 : 1, sty = ry < 0 ? -1 : 1;
      let sdx = (rx < 0 ? this.px - mx : mx + 1 - this.px) * ddx, sdy = (ry < 0 ? this.py - my : my + 1 - this.py) * ddy, side = 0, c = null;
      for (let i = 0; i < 64; i++) {
        if (sdx < sdy) { sdx += ddx; mx += stx; side = 0; } else { sdy += ddy; my += sty; side = 1; }
        c = this.map[my] && this.map[my][mx];
        if (c === undefined) break;
        if (SOLID.includes(c) && !(c === 'D' && this.doors[my + ',' + mx] >= 1)) break;
      }
      const pd = side === 0 ? sdx - ddx : sdy - ddy; this.z[x] = pd;
      const lh = RH / pd; let wx = side === 0 ? this.py + pd * ry : this.px + pd * rx; wx -= Math.floor(wx);
      let tex = TEX[c] || TEX['#'];
      if (c === 'H' && !this.inHouse(this.px, this.py)) tex = TEX.S;
      const open = c === 'D' ? (this.doors[my + ',' + mx] || 0) : 0;
      const top = H2 - lh / 2 - open * lh, s = Math.min(1.2, 1.8 / (pd * 0.4 + 0.8)) * (side ? 0.75 : 1) * dark * flash;
      const tx = (wx * 64) | 0, y0 = Math.max(0, top | 0), y1 = Math.min(RH, (top + lh) | 0);
      for (let y = y0; y < y1; y++) B[y * RW + x] = shade(tex[(((y - top) / lh * 64) & 63) * 64 + tx], s);
    }
    const sprites = [...this.things, ...this.shots.map(s => ({ ...s, k: 'fire' }))].map(t => ({ t, d: (t.x - this.px) ** 2 + (t.y - this.py) ** 2 })).sort((a, b) => b.d - a.d);
    const inv = 1 / (plx * dy - dx * ply);
    for (const { t } of sprites) {
      const sx = t.x - this.px, sy = t.y - this.py, tX = inv * (dy * sx - dx * sy), tY = inv * (-ply * sx + plx * sy);
      if (tY <= 0.1) continue;
      const scx = (RW / 2) * (1 + tX / tY), sz = Math.abs(RH / tY) | 0;
      let img;
      if (t.k === 'imp') img = SPR.imp[t.st === 'dead' ? 3 : t.atk > 0 ? 2 : t.st === 'chase' ? (Math.floor(t.t * 4) % 2) : 0];
      else img = SPR[t.k];
      const x0 = (scx - sz / 2) | 0, y0 = (H2 - sz / 2) | 0, s = Math.min(1.2, 1.8 / (tY * 0.4 + 0.8)) * (t.k === 'fire' ? 1.6 : dark) * flash * (t.st === 'pain' ? 1.8 : 1);
      for (let x = Math.max(0, x0); x < Math.min(RW, x0 + sz); x++) {
        if (tY >= this.z[x]) continue;
        const u = (((x - x0) / sz) * 64) | 0;
        for (let y = Math.max(0, y0); y < Math.min(RH, y0 + sz); y++) {
          const c = img[(((y - y0) / sz * 64) | 0) * 64 + u];
          if (c >>> 24) B[y * RW + x] = shade(c, s);
        }
      }
    }
    this.cx.putImageData(this.img, 0, 0);
  }
  drawGun(g) {
    const bx = 160 + Math.sin(this.bob) * 8, by = RH - 6 + Math.abs(Math.cos(this.bob)) * 5 + this.pump * 10;
    if (this.flash > 0.3) { const r = g.createRadialGradient(bx, by - 72, 2, bx, by - 72, 30); r.addColorStop(0, '#fff'); r.addColorStop(0.4, '#fd4'); r.addColorStop(1, 'rgba(255,120,0,0)'); g.fillStyle = r; g.fillRect(bx - 40, by - 110, 80, 80); }
    g.fillStyle = '#2a2a2a'; g.fillRect(bx - 11, by - 74, 22, 62); g.fillStyle = '#4a4a4a'; g.fillRect(bx - 9, by - 74, 8, 62); g.fillRect(bx + 1, by - 74, 8, 62); g.fillStyle = '#111'; g.fillRect(bx - 7, by - 76, 4, 4); g.fillRect(bx + 3, by - 76, 4, 4);
    g.fillStyle = '#5a3a1a'; g.fillRect(bx - 12, by - 30 + this.pump * 8, 24, 16);
    g.fillStyle = '#c89070'; g.beginPath(); g.ellipse(bx + 6, by - 4, 22, 14, -0.3, 0, 7); g.fill();
    this.pump = Math.max(0, this.pump - 0.04);
  }
  drawHud(g) {
    const y = RH; g.fillStyle = '#5a5a5a'; g.fillRect(0, y, RW, HUD); g.fillStyle = '#3a3a3a'; g.fillRect(0, y, RW, 2);
    const box = (x, w, lab, val) => { g.fillStyle = '#2a2a2a'; g.fillRect(x, y + 3, w, HUD - 6); g.fillStyle = '#c00'; g.font = 'bold 16px Impact, Arial'; g.textAlign = 'center'; g.fillText(val, x + w / 2, y + 20); g.fillStyle = '#ccc'; g.font = '7px Arial'; g.fillText(lab, x + w / 2, y + 28); g.textAlign = 'left'; };
    box(4, 60, 'AMMO', this.ammo); box(68, 70, 'HEALTH', this.hp + '%');
    const fx = 150, hurt = 1 - this.hp / 100; g.fillStyle = '#2a2a2a'; g.fillRect(fx - 4, y + 2, 32, 28);
    g.fillStyle = `rgb(${200 - hurt * 40},${150 - hurt * 90},${110 - hurt * 80})`; g.beginPath(); g.ellipse(fx + 12, y + 16, 10, 12, 0, 0, 7); g.fill();
    const look = Math.floor(this.time / 1.5) % 3 - 1; g.fillStyle = '#000'; g.fillRect(fx + 6 + look * 2, y + 12, 3, 3); g.fillRect(fx + 15 + look * 2, y + 12, 3, 3);
    g.fillRect(fx + 8, y + 21, 8, this.god ? 3 : 1); if (this.god) { g.fillStyle = '#fd0'; g.fillRect(fx + 6, y + 11, 13, 1); }
    if (hurt > 0.4) { g.fillStyle = '#a00'; g.fillRect(fx + 4, y + 16, 3, 6); }
    box(186, 60, 'KILLS', `${this.kills}/${this.total}`); box(250, 66, 'ARMS', 'SG');
  }
  draw(g, w, h) {
    this.render();
    const c = this.cx;
    if (this.state === 'play') this.drawGun(c);
    if (this.hurtT > 0) { c.fillStyle = `rgba(255,0,0,${this.hurtT * 0.35})`; c.fillRect(0, 0, RW, RH); }
    if (this.god) { c.fillStyle = 'rgba(255,220,0,.06)'; c.fillRect(0, 0, RW, RH); }
    this.drawHud(c);
    c.font = '9px monospace'; c.fillStyle = '#f33';
    if (this.msgT > 0) c.fillText(this.msg, 4, 11);
    c.textAlign = 'center';
    if (this.state === 'dead') { c.fillStyle = 'rgba(120,0,0,.6)'; c.fillRect(0, 0, RW, RH); c.fillStyle = '#fff'; c.font = 'bold 20px Impact, Arial'; c.fillText('YOU DIED', 160, 80); c.font = '10px monospace'; c.fillText('press SPACE to restart the level', 160, 100); }
    if (this.state === 'inter') { c.fillStyle = '#300'; c.fillRect(0, 0, RW, RH); c.fillStyle = '#fc0'; c.font = 'bold 18px Impact, Arial'; c.fillText(`${LEVELS[this.lvl].name} FINISHED`, 160, 50); c.font = '11px monospace'; c.fillStyle = '#fff'; c.fillText(`KILLS  ${this.kills}/${this.total}`, 160, 80); c.fillText(`TIME   ${Math.floor(this.time / 60)}:${String(Math.floor(this.time % 60)).padStart(2, '0')}`, 160, 96); c.fillStyle = '#f66'; c.fillText('ENTERING: E1M9 - ???', 160, 130); c.fillStyle = '#aaa'; c.fillText('press ENTER', 160, 150); }
    if (this.state === 'end') {
      this.endT += 1 / 60; c.fillStyle = `rgba(0,0,0,${Math.min(0.92, this.endT / 2)})`; c.fillRect(0, 0, RW, RH + HUD);
      const s = this.os.clock % 86400, hh = Math.floor(s / 3600), mm = Math.floor(s / 60) % 60;
      const lines = ['You sit down at the computer.', 'On its screen, someone is playing DOOMED.', 'They are sitting at a computer', 'in a house that looks like yours.', '', `The clock on the wall says ${(hh % 12) || 12}:${String(mm).padStart(2, '0')}.`, '', "Don't turn around."];
      c.fillStyle = '#ddd'; c.font = '10px monospace';
      lines.forEach((l, i) => { if (this.endT > 1 + i * 0.8) c.fillText(l, 160, 40 + i * 15); });
      if (this.endT > 9) { c.fillStyle = '#777'; c.fillText('press ENTER to play again', 160, 190); }
    }
    c.textAlign = 'left';
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.imageSmoothingEnabled = false;
    const dh = w * (RH + HUD) / RW; g.drawImage(this.cv, 0, (h - dh) / 2, w, dh); g.imageSmoothingEnabled = true;
    if (this.state === 'play' && this.time < 6) { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, w, 22); g.fillStyle = '#fc6'; g.font = F(11, 'bold'); g.fillText('WASD/arrows move • ←/→ turn • CTRL/SPACE/click fire • E doors & switches • SHIFT run', 8, 15); }
  }
  key(e, down) {
    this.keys[e.code] = down;
    if (!down) return;
    if (this.state === 'dead' && e.code === 'Space') { this.hp = 100; this.ammo = Math.max(this.ammo, 20); this.load(this.lvl); return; }
    if (this.state === 'inter' && e.code === 'Enter') { this.load(1); return; }
    if (this.state === 'end' && e.code === 'Enter' && this.endT > 9) { this.hp = 100; this.load(0); return; }
    if (e.code === 'KeyE') this.use();
    if (e.key.length === 1) {
      this.cheat = (this.cheat + e.key.toLowerCase()).slice(-5);
      if (this.cheat === 'iddqd') { this.god = !this.god; this.say(this.god ? 'Degreelessness Mode On' : 'Degreelessness Mode Off'); A.pickup(); }
      if (this.cheat === 'idkfa') { this.ammo = 99; this.say('Very Happy Ammo Added'); A.pickup(); }
    }
  }
  mouse(type, x, y, btn) {
    if (type === 'down') { this.mouseFire = true; this.lastMx = x; }
    if (type === 'up') this.mouseFire = false;
    if (type === 'move' && this.mouseFire && this.lastMx != null) { this.pa += (x - this.lastMx) * 0.01; this.lastMx = x; }
  }
  close() { this.keys = {}; }
}

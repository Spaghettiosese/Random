import { THREE, gameRenderer, pixTex, Pad, blit, crosshair } from './g3d.js';
import { A } from '../audio.js';

const SX = 48, SY = 28, SZ = 48, SEA = 7;
// 1 grass 2 dirt 3 stone 4 log 5 leaves 6 sand 7 planks 8 water 9 glass
const NAMES = ['', 'Grass', 'Dirt', 'Stone', 'Log', 'Leaves', 'Sand', 'Planks', 'Water', 'Glass'];
const COL = { 2: ['#6b4a2e', '#5a3d25'], 3: ['#7d7d80', '#6a6a6e'], 6: ['#dccf94', '#cbbd80'], 7: ['#a8804a', '#8e6a3a'], 5: ['#3f7a2e', '#2f6222'] };
function noisy(a, b, extra) { return pixTex(16, (g, s) => { for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) { g.fillStyle = Math.random() < 0.5 ? a : b; g.fillRect(x, y, 1, 1); } extra && extra(g, s); }); }
function mats() {
  const L = (map, o = {}) => new THREE.MeshLambertMaterial({ map, ...o });
  const dirt = noisy(...COL[2]);
  const side = pixTex(16, (g, s) => { for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) { g.fillStyle = y < 3 + (x * 7 % 3) ? (Math.random() < 0.5 ? '#5fa83a' : '#4e9430') : (Math.random() < 0.5 ? COL[2][0] : COL[2][1]); g.fillRect(x, y, 1, 1); } });
  const top = noisy('#5fa83a', '#4e9430');
  const log = noisy('#6b4f2a', '#5a4020', (g) => { g.fillStyle = 'rgba(0,0,0,.25)'; for (let x = 0; x < 16; x += 4) g.fillRect(x, 0, 1, 16); });
  const logTop = pixTex(16, (g) => { g.fillStyle = '#a8804a'; g.fillRect(0, 0, 16, 16); g.strokeStyle = '#6b4f2a'; for (let r = 2; r < 8; r += 2) g.strokeRect(8 - r, 8 - r, r * 2, r * 2); });
  const planks = noisy(...COL[7], (g) => { g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 3; y < 16; y += 4) g.fillRect(0, y, 16, 1); });
  const glass = pixTex(16, (g) => { g.strokeStyle = '#cfefff'; g.strokeRect(0.5, 0.5, 15, 15); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(3, 3, 2, 5); });
  return {
    1: [L(side), L(side), L(top), L(dirt), L(side), L(side)], 2: L(dirt), 3: L(noisy(...COL[3])), 4: [L(log), L(log), L(logTop), L(logTop), L(log), L(log)],
    5: L(noisy(...COL[5]), { transparent: true, opacity: 0.95 }), 6: L(noisy(...COL[6])), 7: L(planks),
    8: new THREE.MeshLambertMaterial({ color: 0x2b6fd6, transparent: true, opacity: 0.6 }), 9: L(glass, { transparent: true }),
  };
}
export class Blockcraft {
  constructor(os) {
    this.os = os; this.full = true; this.hideCursor = true; this.pad = new Pad(); this.sel = 1; this.mined = 0;
    this.v = new Uint8Array(SX * SY * SZ);
    const sc = this.scene = new THREE.Scene(); sc.background = new THREE.Color(0x87c3ff); sc.fog = new THREE.Fog(0x87c3ff, 20, 60);
    this.cam = new THREE.PerspectiveCamera(70, 16 / 9, 0.05, 200);
    sc.add(new THREE.HemisphereLight(0xdfefff, 0x6a5a40, 1.1)); const sun = new THREE.DirectionalLight(0xfff1d6, 1.6); sun.position.set(30, 50, 20); sc.add(sun);
    const sunDisc = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: 0xfffbe0, fog: false })); sunDisc.position.set(60, 90, 40); sunDisc.lookAt(0, 0, 0); sc.add(sunDisc);
    for (let i = 0; i < 14; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(8 + Math.random() * 10, 1.5, 5 + Math.random() * 6), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false })); c.position.set(Math.random() * 120 - 36, 34, Math.random() * 120 - 36); sc.add(c); }
    this.M = mats(); this.meshes = {}; this.geo = new THREE.BoxGeometry(1, 1, 1);
    this.gen(); this.build();
    let bx = SX / 2, bz = SZ / 2, best = -1;
    for (let x = 8; x < SX - 8; x++) for (let z = 8; z < SZ - 8; z++) { const t = this.top(x, z), sc = t - Math.hypot(x - SX / 2, z - SZ / 2) * 0.2; if (t > SEA + 1 && sc > best) { best = sc; bx = x; bz = z; } }
    this.pos = new THREE.Vector3(bx + 0.5, this.top(bx, bz) + 0.1, bz + 0.5); this.vel = new THREE.Vector3();
    this.hl = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.01, 1.01, 1.01)), new THREE.LineBasicMaterial({ color: 0x000000 })); sc.add(this.hl);
  }
  idx(x, y, z) { return (y * SZ + z) * SX + x; }
  get(x, y, z) { return x < 0 || y < 0 || z < 0 || x >= SX || y >= SY || z >= SZ ? (y < 0 ? 3 : 0) : this.v[this.idx(x, y, z)]; }
  set(x, y, z, t) { if (x >= 0 && y >= 0 && z >= 0 && x < SX && y < SY && z < SZ) this.v[this.idx(x, y, z)] = t; }
  top(x, z) { for (let y = SY - 1; y >= 0; y--) if (this.get(x, y, z) && this.get(x, y, z) !== 8) return y + 1; return 1; }
  gen() {
    const ph = Array.from({ length: 6 }, () => Math.random() * 6.28);
    for (let x = 0; x < SX; x++) for (let z = 0; z < SZ; z++) {
      const h = Math.floor(8 + Math.sin(x / 7 + ph[0]) * 2.5 + Math.cos(z / 9 + ph[1]) * 2.5 + Math.sin((x + z) / 5 + ph[2]) * 1.2 + Math.sin(x / 3.1 + z / 4.3) * 0.6);
      for (let y = 0; y < h; y++) this.set(x, y, z, y < h - 3 ? 3 : y < h - 1 ? 2 : h <= SEA + 1 ? 6 : 1);
      for (let y = h; y <= SEA; y++) this.set(x, y, z, 8);
    }
    for (let i = 0; i < 16; i++) {
      const x = 3 + Math.floor(Math.random() * (SX - 6)), z = 3 + Math.floor(Math.random() * (SZ - 6)), y = this.top(x, z);
      if (this.get(x, y - 1, z) !== 1) continue;
      const th = 4 + Math.floor(Math.random() * 2);
      for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) for (let dy = th - 2; dy <= th + 1; dy++) if (Math.abs(dx) + Math.abs(dz) + Math.max(0, dy - th) < 4 && !this.get(x + dx, y + dy, z + dz)) this.set(x + dx, y + dy, z + dz, 5);
      for (let k = 0; k < th; k++) this.set(x, y + k, z, 4);
    }
  }
  build() {
    for (const k in this.meshes) { this.scene.remove(this.meshes[k]); this.meshes[k].dispose(); }
    const lists = {}, open = (x, y, z) => { const n = this.get(x, y, z); return !n || n === 8 || n === 5 || n === 9; };
    for (let y = 0; y < SY; y++) for (let z = 0; z < SZ; z++) for (let x = 0; x < SX; x++) {
      const t = this.v[this.idx(x, y, z)]; if (!t) continue;
      if (t === 8 ? this.get(x, y + 1, z) !== 8 : open(x + 1, y, z) || open(x - 1, y, z) || open(x, y + 1, z) || open(x, y - 1, z) || open(x, y, z + 1) || open(x, y, z - 1)) (lists[t] = lists[t] || []).push(x, y, z);
    }
    const m4 = new THREE.Matrix4();
    for (const t in lists) {
      const a = lists[t], im = new THREE.InstancedMesh(this.geo, this.M[t], a.length / 3);
      for (let i = 0; i < a.length; i += 3) im.setMatrixAt(i / 3, m4.makeTranslation(a[i] + 0.5, a[i + 1] + (t == 8 ? 0.4 : 0.5), a[i + 2] + 0.5));
      this.meshes[t] = im; this.scene.add(im);
    }
  }
  solid(x, y, z) { const t = this.get(Math.floor(x), Math.floor(y), Math.floor(z)); return t && t !== 8; }
  hitsAt(p) { for (const dx of [-0.3, 0.3]) for (const dz of [-0.3, 0.3]) for (const dy of [0, 0.9, 1.7]) if (this.solid(p.x + dx, p.y + dy, p.z + dz)) return true; return false; }
  pick() {
    const o = this.cam.position, d = new THREE.Vector3(); this.cam.getWorldDirection(d);
    let px = Math.floor(o.x), py = Math.floor(o.y), pz = Math.floor(o.z), prev = null;
    for (let s = 0; s < 60; s++) {
      const p = o.clone().addScaledVector(d, s * 0.1), c = [Math.floor(p.x), Math.floor(p.y), Math.floor(p.z)];
      if (c[0] !== px || c[1] !== py || c[2] !== pz || s === 0) { const t = this.get(...c); if (t && t !== 8) return { c, prev }; prev = c; [px, py, pz] = c; }
    }
    return null;
  }
  act(place) {
    const h = this.pick(); if (!h) return;
    if (place) {
      if (!h.prev) return; const [x, y, z] = h.prev, p = this.pos;
      if (x === Math.floor(p.x) && z === Math.floor(p.z) && (y === Math.floor(p.y) || y === Math.floor(p.y + 1))) return;
      this.set(x, y, z, this.sel); A.beep(300, 0.05, 0.15, 'triangle');
    } else {
      this.set(...h.c, 0); this.mined++; A.beep(160, 0.06, 0.25, 'square'); A.beep(90, 0.08, 0.2, 'triangle', 0.03);
      if (this.mined % 5 === 0) this.os.earn(2, 'Blockcraft');
    }
    this.build();
  }
  update(dt) {
    const P = this.pad; P.update(dt);
    const w = P.wish(new THREE.Vector3()), sp = P.keys.ShiftLeft ? 6.5 : 4.3, inWater = this.get(Math.floor(this.pos.x), Math.floor(this.pos.y + 0.5), Math.floor(this.pos.z)) === 8;
    this.vel.x = w.x * sp * (inWater ? 0.5 : 1); this.vel.z = w.z * sp * (inWater ? 0.5 : 1);
    this.vel.y -= (inWater ? 8 : 24) * dt; if (inWater) this.vel.y = Math.max(this.vel.y, -2);
    if (P.keys.Space && (this.ground || inWater)) { this.vel.y = inWater ? 4 : 8; this.ground = false; }
    this.ground = false;
    for (const ax of ['x', 'z', 'y']) {
      const old = this.pos[ax]; this.pos[ax] += this.vel[ax] * dt;
      if (this.hitsAt(this.pos)) { if (ax === 'y' && this.vel.y < 0) this.ground = true; this.pos[ax] = old; this.vel[ax] = 0; }
    }
    if (this.pos.y < -10) this.pos.set(SX / 2, 30, SZ / 2);
    if (P.btn[0] && !this.cool) { this.act(false); this.cool = 0.25; }
    if (P.btn[2] && !this.cool) { this.act(true); this.cool = 0.25; }
    this.cool = Math.max(0, (this.cool || 0) - dt) || 0;
    this.cam.position.set(this.pos.x, this.pos.y + 1.62, this.pos.z); this.cam.rotation.set(P.pitch, P.yaw, 0, 'YXZ');
    const h = this.pick(); this.hl.visible = !!h; if (h) this.hl.position.set(h.c[0] + 0.5, h.c[1] + 0.5, h.c[2] + 0.5);
  }
  draw(g, w, h) {
    gameRenderer().render(this.scene, this.cam); blit(g, w, h); crosshair(g, w, h);
    const n = 9, bw = 44, x0 = w / 2 - (n * bw) / 2;
    for (let i = 1; i <= n; i++) {
      const x = x0 + (i - 1) * bw; g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x, h - 54, bw - 4, bw - 4);
      g.fillStyle = { 1: '#5fa83a', 2: '#6b4a2e', 3: '#7d7d80', 4: '#6b4f2a', 5: '#3f7a2e', 6: '#dccf94', 7: '#a8804a', 8: '#2b6fd6', 9: '#cfefff' }[i]; g.fillRect(x + 8, h - 46, bw - 20, bw - 20);
      if (i === this.sel) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(x, h - 54, bw - 4, bw - 4); g.lineWidth = 1; }
    }
    g.fillStyle = '#fff'; g.font = 'bold 14px monospace'; g.textAlign = 'center'; g.fillText(NAMES[this.sel], w / 2, h - 62); g.textAlign = 'left';
    g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(8, 8, 420, 22); g.fillStyle = '#fff'; g.font = '12px monospace';
    g.fillText(`BLOCKCRAFT  WASD+Space  click=break  right-click/F=place  1-9 block  mined ${this.mined}`, 14, 23);
  }
  key(e, down) {
    this.pad.key(e, down);
    if (down && /^Digit[1-9]$/.test(e.code)) this.sel = +e.code[5];
    if (down && e.code === 'KeyF') this.act(true);
  }
  mouse(type, x, y, b) { this.pad.mouse(type, x, y, b); if (type === 'wheel') this.sel = ((this.sel - 1 + (b > 0 ? 1 : 8)) % 9) + 1; }
}

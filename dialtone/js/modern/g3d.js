// Shared bits for the 3D games that run *inside* the in-game PC.
import * as THREE from '../../../vendor/three.module.min.js';
export { THREE };
export const GW = 960, GH = 540;
let R = null;
export function gameRenderer() {
  if (!R) {
    const c = document.createElement('canvas'); c.width = GW; c.height = GH;
    R = new THREE.WebGLRenderer({ canvas: c, antialias: true, preserveDrawingBuffer: true });
    R.setSize(GW, GH, false); R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
    R.toneMapping = THREE.ACESFilmicToneMapping;
  }
  return R;
}
export function pixTex(size, fn) {
  const c = document.createElement('canvas'); c.width = c.height = size; fn(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapLinearFilter; t.colorSpace = THREE.SRGBColorSpace; return t;
}
// first/third person look + move input
export class Pad {
  constructor() { this.keys = {}; this.yaw = 0; this.pitch = 0; this.drag = null; this.btn = {}; }
  key(e, down) { this.keys[e.code] = down; }
  look(dx, dy) { this.yaw -= dx * 0.0025; this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch - dy * 0.0025)); }
  mouse(type, x, y, b = 0) {
    if (type === 'down') { this.btn[b] = true; this.drag = [x, y]; }
    if (type === 'up') { this.btn[b] = false; this.drag = null; }
    if (type === 'move' && this.drag) { this.look((x - this.drag[0]) * 2.2, (y - this.drag[1]) * 2.2); this.drag = [x, y]; }
    if (type === 'look') this.look(x, y);
  }
  update(dt) {
    const k = this.keys;
    this.yaw += ((k.ArrowLeft ? 1 : 0) - (k.ArrowRight ? 1 : 0)) * 2.4 * dt;
    this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch + ((k.ArrowUp ? 1 : 0) - (k.ArrowDown ? 1 : 0)) * 1.6 * dt));
  }
  // world-space wish direction on the xz plane
  wish(out) {
    const k = this.keys, f = (k.KeyW ? 1 : 0) - (k.KeyS ? 1 : 0), s = (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0);
    const sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
    out.set(-sy * f + cy * s, 0, -cy * f - sy * s); if (out.lengthSq() > 1) out.normalize(); return out;
  }
}
// axis-separated AABB vs boxes (THREE.Box3[]); pos = feet
export function collide(pos, vel, dt, boxes, r = 0.3, h = 1.8) {
  let ground = false; const b = new THREE.Box3();
  for (const ax of ['x', 'y', 'z']) {
    pos[ax] += vel[ax] * dt;
    const lift = ax === 'y' ? 0 : 0.03;
    b.min.set(pos.x - r, pos.y + lift, pos.z - r); b.max.set(pos.x + r, pos.y + h, pos.z + r);
    for (const o of boxes) {
      if (!b.intersectsBox(o) || (ax !== 'y' && !vel[ax])) continue;
      if (ax === 'y') { if (vel.y <= 0) { pos.y = o.max.y; ground = true; } else pos.y = o.min.y - h; vel.y = 0; }
      else { pos[ax] = vel[ax] > 0 ? o.min[ax] - r - 1e-3 : o.max[ax] + r + 1e-3; }
      b.min.set(pos.x - r, pos.y + lift, pos.z - r); b.max.set(pos.x + r, pos.y + h, pos.z + r);
    }
  }
  return ground;
}
export function blit(g, w, h) { g.drawImage(gameRenderer().domElement, 0, 0, w, h); }
export function crosshair(g, w, h, c = '#fff') { g.fillStyle = c; g.fillRect(w / 2 - 1, h / 2 - 8, 2, 16); g.fillRect(w / 2 - 8, h / 2 - 1, 16, 2); }

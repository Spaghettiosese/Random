import * as THREE from '../vendor/three.module.min.js';
import { Audio } from './audio.js';
export { THREE };

// ---------------------------------------------------------------------------
// Global game state
// ---------------------------------------------------------------------------
export const G = {
  renderer: null, scene: null, camera: null, clock: new THREE.Clock(),
  time: 0, dt: 0, paused: true, mode: 'title',
  colliders: [], interactables: [], triggers: [], npcs: [], tasks: [], updaters: [],
  levelRoot: null, level: null, runToken: 0,
  settings: { sens: 1, volume: 0.8, res: 270, invertY: false, tts: false, grain: true,
    face: null, faceZoom: 1, faceX: 0, faceY: 0 },
};

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const rand = (a, b) => a + Math.random() * (b - a);

// ---------------------------------------------------------------------------
// PS1-style materials: vertex snapping in clip space for that wobbly look
// ---------------------------------------------------------------------------
function psxPatch(m) {
  m.onBeforeCompile = s => {
    s.vertexShader = s.vertexShader
      .replace('void main() {', 'const vec2 PSX_GRID = vec2(170.0, 110.0);\nvoid main() {')
      .replace('#include <project_vertex>', `#include <project_vertex>
        if (gl_Position.w > 0.0) {
          vec4 psx = gl_Position; psx.xy = floor(psx.xy / psx.w * PSX_GRID + 0.5) / PSX_GRID * psx.w; gl_Position = psx;
        }`);
  };
  return m;
}
export function mat(opts = {}) {
  if (opts.flat === undefined) opts.flatShading = true; else { opts.flatShading = opts.flat; delete opts.flat; }
  return psxPatch(new THREE.MeshLambertMaterial(opts));
}
export function basic(opts = {}) { return psxPatch(new THREE.MeshBasicMaterial(opts)); }

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------
export function initRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  r.setPixelRatio(1);
  r.outputColorSpace = THREE.SRGBColorSpace;
  G.renderer = r;
  G.scene = new THREE.Scene();
  G.camera = new THREE.PerspectiveCamera(70, 16 / 9, 0.05, 400);
  G.camera.rotation.order = 'YXZ';
  G.scene.add(G.camera);
  // flashlight
  const fl = new THREE.SpotLight(0xfff1d0, 0, 22, 0.5, 0.55, 1.2);
  fl.position.set(0.15, -0.1, 0);
  fl.target.position.set(0, 0, -1);
  G.camera.add(fl); G.camera.add(fl.target);
  player.flashlight = fl;
  resize();
  window.addEventListener('resize', resize);
}
export function resize() {
  const a = window.innerWidth / window.innerHeight;
  const h = G.settings.res, w = Math.round(h * a);
  G.renderer.setSize(w, h, false);
  G.camera.aspect = a; G.camera.updateProjectionMatrix();
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
export const input = {
  keys: new Set(), pressed: new Set(), mdx: 0, mdy: 0, mouseDown: false, clicked: false, released: false, locked: false,
  down(c) { return this.keys.has(c); },
  hit(c) { return this.pressed.has(c); },
  endFrame() { this.pressed.clear(); this.mdx = this.mdy = 0; this.clicked = this.released = false; },
};
export function initInput(canvas) {
  addEventListener('keydown', e => {
    if (e.repeat) return;
    input.keys.add(e.code); input.pressed.add(e.code);
    if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
  });
  addEventListener('keyup', e => input.keys.delete(e.code));
  addEventListener('blur', () => input.keys.clear());
  addEventListener('mousemove', e => { if (input.locked) { input.mdx += e.movementX; input.mdy += e.movementY; } });
  addEventListener('mousedown', e => { if (e.button === 0) { input.mouseDown = true; input.clicked = true; } });
  addEventListener('mouseup', e => { if (e.button === 0) { input.mouseDown = false; input.released = true; } });
  document.addEventListener('pointerlockchange', () => { input.locked = document.pointerLockElement === canvas; });
}
export function lockPointer() {
  if (!G.renderer) return;
  const c = G.renderer.domElement;
  try { const p = c.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (e) { }
}
export function unlockPointer() { if (document.pointerLockElement) document.exitPointerLock(); }

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------
export const player = {
  pos: new THREE.Vector3(), yaw: 0, pitch: 0, vy: 0, grounded: true,
  enabled: false, canRun: true, canJump: false, canFlash: false, flashOn: false, flashlight: null,
  eye: 1.42, radius: 0.28, speed: 2.7, runSpeed: 4.8, stamina: 1, bob: 0, stepAcc: 0,
  hp: 100, maxHp: 100, invuln: 0, moveMult: 1, lookLimit: null, hardFloor: true,
};
export function placePlayer(x, z, yaw = 0, pitch = 0) {
  player.pos.set(x, 0, z); player.yaw = yaw; player.pitch = pitch; player.vy = 0;
  applyPlayerCam();
}
export function applyPlayerCam() {
  const c = G.camera;
  c.position.set(player.pos.x, player.pos.y + player.eye + Math.sin(player.bob) * 0.035, player.pos.z);
  c.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
}
export function setFlashlight(on) {
  player.flashOn = on;
  player.flashlight.intensity = on ? 30 : 0;
}
export function forwardVec() {
  return new THREE.Vector3(-Math.sin(player.yaw) * Math.cos(player.pitch), Math.sin(player.pitch), -Math.cos(player.yaw) * Math.cos(player.pitch));
}
export function yawTo(x, z, from = player.pos) { return Math.atan2(-(x - from.x), -(z - from.z)); }

function updatePlayer(dt) {
  if (!player.enabled) return;
  const s = G.settings.sens * 0.0022;
  player.yaw -= input.mdx * s;
  player.pitch -= input.mdy * s * (G.settings.invertY ? -1 : 1);
  player.pitch = clamp(player.pitch, -1.45, 1.45);

  let mx = 0, mz = 0;
  if (input.down('KeyW') || input.down('ArrowUp')) mz -= 1;
  if (input.down('KeyS') || input.down('ArrowDown')) mz += 1;
  if (input.down('KeyA') || input.down('ArrowLeft')) mx -= 1;
  if (input.down('KeyD') || input.down('ArrowRight')) mx += 1;
  const moving = mx || mz;
  const wantRun = player.canRun && moving && (input.down('ShiftLeft') || input.down('ShiftRight')) && player.stamina > 0.02;
  player.running = !!wantRun;
  if (wantRun) player.stamina = Math.max(0, player.stamina - dt / 5);
  else player.stamina = Math.min(1, player.stamina + dt / 7);
  const st = document.getElementById('stamina');
  st.classList.toggle('show', player.stamina < 0.99);
  st.firstElementChild.style.width = (player.stamina * 100) + '%';

  if (moving) {
    const len = Math.hypot(mx, mz); mx /= len; mz /= len;
    const sp = (wantRun ? player.runSpeed : player.speed) * player.moveMult;
    const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
    player.pos.x += (mx * cos + mz * sin) * sp * dt;
    player.pos.z += (-mx * sin + mz * cos) * sp * dt;
    player.bob += dt * sp * 3.2;
    player.stepAcc += sp * dt;
    if (player.stepAcc > (wantRun ? 1.3 : 1.0)) { player.stepAcc = 0; if (player.grounded) Audio.step(G.level?.hardFloor !== false); }
  }
  if (player.canJump && player.grounded && input.hit('Space')) { player.vy = 4.6; player.grounded = false; }
  player.vy -= 13 * dt; player.pos.y += player.vy * dt;
  if (player.pos.y <= 0) { if (!player.grounded && player.vy < -3) Audio.step(true); player.pos.y = 0; player.vy = 0; player.grounded = true; }
  collide(player.pos, player.radius);
  if (player.canFlash && input.hit('KeyF')) { setFlashlight(!player.flashOn); Audio.click(); }
  if (player.invuln > 0) player.invuln -= dt;
  applyPlayerCam();
}

// ---------------------------------------------------------------------------
// Collision (axis-aligned boxes on the XZ plane vs circles)
// ---------------------------------------------------------------------------
export function addCollider(x0, z0, x1, z1, tag) {
  const c = { x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1), off: false, tag };
  G.colliders.push(c); return c;
}
export function collide(p, r) {
  for (let pass = 0; pass < 2; pass++) for (const c of G.colliders) {
    if (c.off) continue;
    const cx = clamp(p.x, c.x0, c.x1), cz = clamp(p.z, c.z0, c.z1);
    const dx = p.x - cx, dz = p.z - cz, d2 = dx * dx + dz * dz;
    if (d2 >= r * r) continue;
    if (d2 > 1e-8) { const d = Math.sqrt(d2); p.x += dx / d * (r - d); p.z += dz / d * (r - d); }
    else {
      const l = p.x - c.x0, rr = c.x1 - p.x, t = p.z - c.z0, b = c.z1 - p.z, m = Math.min(l, rr, t, b);
      if (m === l) p.x = c.x0 - r; else if (m === rr) p.x = c.x1 + r; else if (m === t) p.z = c.z0 - r; else p.z = c.z1 + r;
    }
  }
}

// ---------------------------------------------------------------------------
// Tasks / timing — every await in the story goes through here, so a restart
// (which clears G.tasks) simply abandons the old story coroutine.
// ---------------------------------------------------------------------------
export function task(fn) { G.tasks.push(fn); }
export function wait(sec) {
  return new Promise(res => { let t = 0; task(dt => { t += dt; if (t >= sec) { res(); return true; } }); });
}
export function until(cond) {
  return new Promise(res => task(() => { if (cond()) { res(); return true; } }));
}
export function tween(dur, fn, e = ease) {
  return new Promise(res => {
    let t = 0; fn(0);
    task(dt => { t += dt; const k = Math.min(1, t / dur); fn(e(k)); if (k >= 1) { res(); return true; } });
  });
}
function runTasks(dt) {
  const list = G.tasks; G.tasks = [];
  const keep = [];
  for (const f of list) {
    let done = false;
    try { done = f(dt); } catch (e) { console.error(e); done = true; }
    if (!done) keep.push(f);
  }
  G.tasks = keep.concat(G.tasks);
}
export function onUpdate(fn) { G.updaters.push(fn); return () => { G.updaters = G.updaters.filter(f => f !== fn); }; }

// ---------------------------------------------------------------------------
// Camera moves for cutscenes
// ---------------------------------------------------------------------------
const tmpCam = new THREE.PerspectiveCamera();
export function camPose(pos, look) {
  tmpCam.position.copy(pos); tmpCam.lookAt(look);
  return { pos: pos.clone(), quat: tmpCam.quaternion.clone() };
}
export function camTo(pos, look, dur = 1.5) {
  const c = G.camera, p0 = c.position.clone(), q0 = c.quaternion.clone();
  const target = camPose(v3(pos), v3(look));
  if (dur <= 0) { c.position.copy(target.pos); c.quaternion.copy(target.quat); return Promise.resolve(); }
  return tween(dur, k => { c.position.lerpVectors(p0, target.pos, k); c.quaternion.slerpQuaternions(q0, target.quat, k); });
}
export function camToPlayer(dur = 1) {
  const c = G.camera, p0 = c.position.clone(), q0 = c.quaternion.clone();
  const eye = new THREE.Vector3(player.pos.x, player.pos.y + player.eye, player.pos.z);
  const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ'));
  return tween(dur, k => { c.position.lerpVectors(p0, eye, k); c.quaternion.slerpQuaternions(q0, q1, k); });
}
export function playerLookAt(x, y, z) {
  player.yaw = yawTo(x, z);
  const eyeY = player.pos.y + player.eye;
  player.pitch = Math.atan2(y - eyeY, Math.hypot(x - player.pos.x, z - player.pos.z));
}
export function v3(a) { return a.isVector3 ? a : new THREE.Vector3(a[0], a[1], a[2]); }
let shakeAmt = 0;
export function shake(a) { shakeAmt = Math.max(shakeAmt, a); }

// ---------------------------------------------------------------------------
// Interactables + triggers
// ---------------------------------------------------------------------------
const ray = new THREE.Raycaster();
let focused = null;
export function interact(obj, label, onUse, opts = {}) {
  const it = { obj, label, onUse, enabled: true, range: opts.range || 2.7, once: !!opts.once };
  obj.traverse(o => { o.userData.inter = it; });
  G.interactables.push(it);
  return it;
}
export function removeInteract(it) { if (it) { it.enabled = false; G.interactables = G.interactables.filter(i => i !== it); } }
function updateInteract() {
  const promptEl = document.getElementById('prompt');
  focused = null;
  if (player.enabled && G.interactables.length) {
    ray.setFromCamera({ x: 0, y: 0 }, G.camera);
    ray.far = 3.6;
    const objs = G.interactables.filter(i => i.enabled).map(i => i.obj);
    const hits = ray.intersectObjects(objs, true);
    for (const h of hits) {
      let o = h.object; while (o && !o.userData.inter) o = o.parent;
      const it = o && o.userData.inter;
      if (it && it.enabled && h.distance <= it.range) { focused = it; break; }
    }
  }
  const ch = document.getElementById('crosshair'); const show = player.enabled ? '' : 'none'; if (ch.style.display !== show) ch.style.display = show;
  const label = focused ? `[E] ${typeof focused.label === 'function' ? focused.label() : focused.label}` : '';
  if (promptEl.textContent !== label) promptEl.textContent = label;
  if (focused && (input.hit('KeyE') || (input.clicked && !G.holdingBall))) {
    const it = focused;
    if (it.once) removeInteract(it);
    it.onUse(it);
  }
}
export function trigger(x0, z0, x1, z1, fn, once = true) {
  const t = { x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1), fn, once, inside: false, enabled: true };
  G.triggers.push(t); return t;
}
function updateTriggers() {
  if (!player.enabled) return;
  const p = player.pos;
  for (const t of G.triggers) {
    if (!t.enabled) continue;
    const inside = p.x >= t.x0 && p.x <= t.x1 && p.z >= t.z0 && p.z <= t.z1;
    if (inside && !t.inside) { if (t.once) t.enabled = false; t.fn(t); }
    t.inside = inside;
  }
  G.triggers = G.triggers.filter(t => t.enabled);
}
export function triggerOnce(x0, z0, x1, z1) { return new Promise(res => trigger(x0, z0, x1, z1, res)); }

// ---------------------------------------------------------------------------
// NPCs
// ---------------------------------------------------------------------------
export function addNPC(human, x, z, yaw = 0) {
  const n = { h: human, pos: new THREE.Vector3(x, 0, z), yaw, target: null, speed: 1.4, onArrive: null,
    watch: false, watchTarget: null, collide: false, visible: true, extra: null, turnSpeed: 6 };
  human.group.position.copy(n.pos); human.group.rotation.y = yaw;
  G.levelRoot.add(human.group);
  G.npcs.push(n);
  n.walkTo = (tx, tz, speed) => new Promise(res => { n.target = new THREE.Vector3(tx, 0, tz); if (speed) n.speed = speed; n.onArrive = res; });
  n.face = (x2, z2) => { n.yaw = Math.atan2(x2 - n.pos.x, z2 - n.pos.z); };
  n.facePlayer = () => n.face(player.pos.x, player.pos.z);
  n.place = (x2, z2, y2) => { n.pos.set(x2, 0, z2); if (y2 !== undefined) n.yaw = y2; n.target = null; };
  n.remove = () => { G.npcs = G.npcs.filter(o => o !== n); human.group.removeFromParent(); };
  return n;
}
function angDiff(a, b) { let d = b - a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; }
function updateNPCs(dt) {
  for (const n of G.npcs) {
    let speed = 0;
    if (n.target) {
      const dx = n.target.x - n.pos.x, dz = n.target.z - n.pos.z, d = Math.hypot(dx, dz);
      if (d < 0.08) { n.target = null; const f = n.onArrive; n.onArrive = null; f && f(); }
      else {
        const step = Math.min(d, n.speed * dt);
        n.pos.x += dx / d * step; n.pos.z += dz / d * step; speed = n.speed;
        const want = Math.atan2(dx, dz);
        n.yaw += angDiff(n.yaw, want) * Math.min(1, dt * n.turnSpeed);
        if (n.collide) collide(n.pos, 0.3);
      }
    }
    n.h.group.position.set(n.pos.x, n.pos.y || 0, n.pos.z);
    n.h.group.rotation.y = n.yaw;
    n.h.group.visible = n.visible;
    // head tracking
    let headYaw = 0;
    const lookAt = n.watch ? (n.watchTarget || G.camera.position) : null;
    if (lookAt) {
      const a = Math.atan2(lookAt.x - n.pos.x, lookAt.z - n.pos.z);
      headYaw = clamp(angDiff(n.yaw, a), -1.1, 1.1);
    }
    n.h.update(dt, speed, headYaw);
    if (n.extra) n.extra(dt, n);
  }
}

// ---------------------------------------------------------------------------
// Level management
// ---------------------------------------------------------------------------
export function clearLevel() {
  if (G.levelRoot) {
    G.scene.remove(G.levelRoot);
    G.levelRoot.traverse(o => { if (o.geometry && !o.geometry.userData.keep) o.geometry.dispose(); });
  }
  G.levelRoot = new THREE.Group();
  G.scene.add(G.levelRoot);
  G.colliders = []; G.interactables = []; G.triggers = []; G.npcs = []; G.updaters = [];
  G.scene.fog = null;
  G.scene.background = new THREE.Color(0x000000);
  G.holdingBall = false;
  setFlashlight(false); player.canFlash = false;
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------
export function startLoop(afterUpdate) {
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(G.clock.getDelta(), 0.05);
    if (!G.paused) {
      G.time += dt; G.dt = dt;
      updatePlayer(dt);
      updateNPCs(dt);
      runTasks(dt);
      for (const f of G.updaters.slice()) { try { f(dt); } catch (e) { console.error(e); } }
      updateInteract();
      updateTriggers();
      afterUpdate && afterUpdate(dt);
    }
    let sx = 0, sy = 0;
    if (shakeAmt > 0.001) {
      sx = (Math.random() - 0.5) * shakeAmt; sy = (Math.random() - 0.5) * shakeAmt;
      G.camera.position.x += sx; G.camera.position.y += sy;
      if (!G.paused) shakeAmt *= Math.pow(0.02, dt);
    }
    G.renderer.render(G.scene, G.camera);
    G.camera.position.x -= sx; G.camera.position.y -= sy;
    input.endFrame();
  }
  frame();
}

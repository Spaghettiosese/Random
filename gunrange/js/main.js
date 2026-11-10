import * as THREE from '../../vendor/three.module.min.js';
import { Animator } from './anim.js';
import { GUNS, makeCasing, makeForearm } from './guns.js';
import { buildRange } from './range.js';
import { Sfx } from './audio.js';

const T = THREE, $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
const rnd = (a = 1) => (Math.random() * 2 - 1) * a;
const D2R = Math.PI / 180;

// ── renderer and scenes ──
const renderer = new T.WebGLRenderer({ canvas: $('view'), antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.autoClear = false;

const scene = new T.Scene();
const camera = new T.PerspectiveCamera(74, 1, .1, 800);
camera.rotation.order = 'YXZ';
const range = buildRange(scene);

// The gun lives in its own scene, drawn over the world so it never clips into walls.
const vmScene = new T.Scene();
const vmCam = new T.PerspectiveCamera(38, 1, .01, 10);
vmScene.add(new T.HemisphereLight(0xdcebff, 0x9a8a70, 2.2));
const vmSun = new T.DirectionalLight(0xfff2dc, 3); vmSun.position.set(-1.2, 2.2, 1.2); vmScene.add(vmSun);
const flashLight = new T.PointLight(0xffc070, 0, 3); vmScene.add(flashLight);
{ // Small procedural environment so the metal has something to reflect.
  const env = new T.Scene();
  env.add(new T.Mesh(new T.SphereGeometry(20, 16, 8), new T.MeshBasicMaterial({ color: 0xc4dcf5, side: T.BackSide })));
  const gr = new T.Mesh(new T.PlaneGeometry(60, 60), new T.MeshBasicMaterial({ color: 0x6b5f4a })); gr.rotation.x = -Math.PI / 2; gr.position.y = -2; env.add(gr);
  const s = new T.Mesh(new T.SphereGeometry(3, 8, 8), new T.MeshBasicMaterial({ color: 0xffffff })); s.position.set(-8, 12, 6); env.add(s);
  const roof = new T.Mesh(new T.PlaneGeometry(14, 10), new T.MeshBasicMaterial({ color: 0x2a2018, side: T.DoubleSide })); roof.rotation.x = Math.PI / 2; roof.position.set(0, 5, 4); env.add(roof);
  const pm = new T.PMREMGenerator(renderer);
  vmScene.environment = pm.fromScene(env, .03).texture;
  pm.dispose();
}
const swayNode = new T.Group(); vmScene.add(swayNode);
const arms = { lh: makeForearm(), rh: makeForearm() };
const ELBOW = { lh: new T.Vector3(-.3, -.52, -.08), rh: new T.Vector3(.36, -.46, .22) };
vmScene.add(arms.lh, arms.rh);

const sfx = new Sfx();

// ── weapons ──
const weapons = GUNS.map(def => {
  const model = def.build();
  const holder = new T.Group(); holder.add(model.root); holder.visible = false; swayNode.add(holder);
  return {
    def, model, holder, anim: new Animator(model.parts), ammo: def.mag,
    hip: new T.Vector3(...def.hip), adsPos: new T.Vector3(0, -def.sightY, def.adsZ),
    state: 'idle', lastShot: -9, slideLock: 0, slideLockV: 0, cylIdx: 0, cylAng: 0, wasEmpty: false, cancelReload: false,
  };
});
let cur = weapons[0], nextIdx = -1, lastIdx = 1;

// Muzzle flash: two crossed additive quads.
const flash = new T.Group(); vmScene.add(flash); flash.visible = false;
{
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(.25, 'rgba(255,205,110,.9)'); gr.addColorStop(.6, 'rgba(255,120,30,.3)'); gr.addColorStop(1, 'rgba(255,80,0,0)');
  g.fillStyle = gr; g.beginPath();
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, r = i % 2 ? 26 : 64; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); }
  g.fill();
  const fm = new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, blending: T.AdditiveBlending, depthWrite: false, depthTest: false, side: T.DoubleSide });
  const a = new T.Mesh(new T.PlaneGeometry(1, 1), fm), b = new T.Mesh(new T.PlaneGeometry(1.6, .5), fm), d = new T.Mesh(new T.PlaneGeometry(1.6, .5), fm);
  b.rotation.y = Math.PI / 2; d.rotation.set(0, Math.PI / 2, Math.PI / 2); b.position.z = d.position.z = -.5;
  flash.add(a, b, d);
}
let flashT = 0;

// Pools: casings, bullet holes, impact particles, tracers, smoke.
const casings = [];
const decals = [], DECAL_MAX = 220;
const holeGeo = new T.CircleGeometry(1, 10);
const holeMats = {
  paper: new T.MeshBasicMaterial({ color: 0x0a0a0a, polygonOffset: true, polygonOffsetFactor: -4 }),
  steel: new T.MeshBasicMaterial({ color: 0x6f747c, polygonOffset: true, polygonOffsetFactor: -4 }),
  other: new T.MeshBasicMaterial({ color: 0x1c1712, polygonOffset: true, polygonOffsetFactor: -4, transparent: true, opacity: .85 }),
};
const parts = [], partGeo = new T.BoxGeometry(1, 1, 1);
const partMats = { dirt: 0x9a7d55, steel: 0xffd27a, paper: 0xe9e2cf, wood: 0xa57c4f, concrete: 0xb5b3ac };
for (const k in partMats) partMats[k] = new T.MeshBasicMaterial({ color: partMats[k] });
const tracers = [], tracerGeo = new T.BoxGeometry(.012, .012, 1); tracerGeo.translate(0, 0, .5);
const smokes = [];
const smokeTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c);
})();

function loadBest() { try { return +(localStorage.getItem('gunrange.best') || 0); } catch (e) { return 0; } }
// ── state ──
const player = { pos: new T.Vector3(1.1, 0, 1.2), vel: new T.Vector3(), vy: 0, y: 0, yaw: 0, pitch: 0, ground: true };
const keys = {}, mouse = { l: false, r: false, dx: 0, dy: 0 };
const view = { ads: 0, sprint: 0, bob: 0, swayX: 0, swayY: 0, tX: 0, tY: 0, bloom: 0, land: 0, landV: 0, strafe: 0 };
const kick = { z: 0, zv: 0, p: 0, pv: 0, r: 0, rv: 0, y: 0, yv: 0, camP: 0, camPV: 0, camY: 0, camYV: 0 };
const stats = { score: 0, shots: 0, hits: 0 };
const drill = { on: false, t: 0, score: 0, hits: 0, best: loadBest(), spawn: 0 };
let running = false, time = 0, cooldown = 0, triggerUsed = false, stepT = 0, fovNow = 74;
const dbg = { freeze: null };

// ── HUD ──
const hud = {
  ammo: $('ammo'), mag: $('mag'), name: $('gun-name'), sub: $('gun-sub'), slots: $('slots'), score: $('score'), acc: $('acc'),
  cross: $('crosshair'), marker: $('hitmarker'), pops: $('pops'), scope: $('scope'), drill: $('drill'), msg: $('msg'), reloadHint: $('reload-hint'),
};
GUNS.forEach((g, i) => {
  const d = document.createElement('div'); d.className = 'slot'; d.innerHTML = `<b>${i + 1}</b><span>${g.name}</span>`; hud.slots.appendChild(d);
});
function refreshHud() {
  hud.ammo.textContent = cur.ammo; hud.mag.textContent = '/ ' + cur.def.mag;
  hud.ammo.classList.toggle('low', cur.ammo <= Math.ceil(cur.def.mag * .2));
  hud.name.textContent = cur.def.name; hud.sub.textContent = cur.def.sub;
  [...hud.slots.children].forEach((el, i) => el.classList.toggle('on', weapons[i] === cur));
  hud.score.textContent = stats.score;
  hud.acc.textContent = stats.shots ? Math.round(stats.hits / stats.shots * 100) + '%' : '--';
  hud.reloadHint.classList.toggle('hidden', !(cur.ammo === 0 && cur.state === 'idle'));
}
function pop(text, good) {
  const el = document.createElement('div'); el.className = 'pop' + (good ? ' good' : ''); el.textContent = text;
  el.style.left = 50 + rnd(3) + '%'; hud.pops.appendChild(el); setTimeout(() => el.remove(), 900);
}
let msgTimer = 0;
function message(html, secs = 3) { hud.msg.innerHTML = html; hud.msg.classList.remove('hidden'); msgTimer = secs; }

// ── weapon logic ──
function onEvent(name) {
  const w = cur, P = w.model.parts;
  switch (name) {
    case 'ammo': w.ammo = w.def.mag; if (!w.def.clips.reloadEmpty || !w.wasEmpty) w.slideLock = 0; if (w.model.rounds) w.model.rounds.visible = true; if (P.loader) P.loader.visible = false; break;
    case 'ammo1': w.ammo++; break;
    case 'slideRelease': w.slideLock = 0; break;
    case 'eject':
      if (w.model.rounds) w.model.rounds.visible = false;
      for (let i = 0; i < 6; i++) spawnCasing(w, [rnd(.25), -.6 - Math.random() * .5, .9 + rnd(.3)]);
      break;
    case 'loaderShow': P.loader.visible = true; return;
    case 'shellShow': P.shell.visible = true; return;
    case 'shellHide': P.shell.visible = false; return;
    case 'ejectShell': spawnCasing(w); return;
  }
  sfx.mech(name);
  refreshHud();
}
function play(name, onDone, o = {}) {
  cur.anim.play(cur.def.clips[name], { onEvent, onDone, ...o });
}
function setIdle() { cur.state = 'idle'; refreshHud(); }
function equip(i) {
  cur.holder.visible = false;
  lastIdx = weapons.indexOf(cur);
  cur = weapons[i]; cur.holder.visible = true; cur.state = 'draw'; nextIdx = -1;
  cur.anim.stop(0); cur.anim.update(0);
  cur.anim.play(cur.def.clips.draw, { blend: 0, onEvent, onDone: () => { if (cur.def.action === 'boltAction' && cur.needsBolt) cycle(); else setIdle(); } });
  refreshHud();
}
function switchTo(i) {
  if (i === weapons.indexOf(cur) && nextIdx < 0 || i < 0 || i >= weapons.length) return;
  if (cur.state === 'holster') { nextIdx = i; return; }
  if (cur.state === 'draw') { equip(i); return; }
  resetTransient();
  nextIdx = i; cur.state = 'holster';
  play('holster', () => equip(nextIdx));
}
function resetTransient() {
  const P = cur.model.parts;
  if (P.shell) P.shell.visible = false;
  if (P.loader) P.loader.visible = false;
  if (cur.model.rounds) cur.model.rounds.visible = cur.ammo > 0 || cur.state !== 'reload';
}
function cycle() { // pump or bolt after a shot
  cur.state = 'action'; cur.needsBolt = false;
  play(cur.def.action === 'pump' ? 'pump' : 'bolt', setIdle, { blend: .05 });
}
function reload() {
  const w = cur, d = w.def;
  if (w.state === 'inspect') { w.anim.stop(.1); w.state = 'idle'; }
  if (w.state !== 'idle' || w.ammo >= d.mag) return;
  w.state = 'reload'; w.wasEmpty = w.ammo === 0; w.cancelReload = false;
  hud.reloadHint.classList.add('hidden');
  if (d.type === 'shells') {
    const shell = () => {
      if (w.ammo < d.mag && !w.cancelReload) play('reloadShell', shell, { blend: 0 });
      else play('reloadEnd', () => { if (w.wasEmpty) cycle(); else setIdle(); }, { blend: 0 });
    };
    play('reloadStart', shell);
  } else {
    const clip = w.wasEmpty && d.clips.reloadEmpty ? 'reloadEmpty' : 'reload';
    play(clip, () => { if (d.action === 'boltAction' && (w.wasEmpty || w.needsBolt)) cycle(); else setIdle(); });
  }
}
function inspect() {
  if (cur.state !== 'idle' || mouse.r) return;
  cur.state = 'inspect';
  play('inspect', setIdle, { blend: .12 });
}
function spawnCasing(w, velOverride) {
  const c = makeCasing(w.def.casing);
  w.model.eject.getWorldPosition(c.position);
  c.quaternion.setFromEuler(new T.Euler(rnd(1), rnd(3), rnd(1)));
  vmScene.add(c);
  const v = velOverride || [1.3 + rnd(.35), 1.3 + rnd(.4), .25 + rnd(.3)];
  casings.push({ o: c, v: new T.Vector3(...v), spin: new T.Vector3(rnd(18), rnd(18), rnd(18)), life: 1.1 });
  sfx.shell(w.def.casing);
}

const ray = new T.Raycaster(), fwd = new T.Vector3(), right = new T.Vector3(), up = new T.Vector3(), dir = new T.Vector3(), tmp = new T.Vector3(), tmp2 = new T.Vector3();
function spreadDeg() {
  const d = cur.def, speed = Math.hypot(player.vel.x, player.vel.z);
  return d.spread[0] + (d.spread[1] - d.spread[0]) * view.ads + view.bloom * (1 - view.ads * .6) + speed * .25 * (1 - view.ads * .7) + (player.ground ? 0 : 2);
}
function fire() {
  const w = cur, d = w.def;
  w.ammo--; stats.shots++; cooldown = 60 / d.rpm; w.lastShot = time;
  sfx.shot(d.sound);
  camera.getWorldDirection(fwd); right.crossVectors(fwd, camera.up).normalize(); up.crossVectors(right, fwd);
  const s = Math.tan(spreadDeg() * D2R);
  let any = false, total = 0, best = null;
  for (let i = 0; i < d.pellets; i++) {
    const a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * s;
    dir.copy(fwd).addScaledVector(right, Math.cos(a) * r).addScaledVector(up, Math.sin(a) * r).normalize();
    ray.set(camera.position, dir); ray.far = 400;
    const hit = ray.intersectObjects(range.shootables, false)[0];
    const end = hit ? hit.point : tmp.copy(camera.position).addScaledVector(dir, 300);
    if (i < 3) addTracer(end);
    if (!hit) continue;
    const ud = hit.object.userData, res = ud.onHit ? ud.onHit(hit) : null;
    impact(hit, ud.surface, d);
    if (res) {
      if (res.ding) sfx.ding(res.ding, Math.min(.3, hit.distance / 340));
      if (res.score) { any = true; total += res.score; if (!best || res.score > best.score) best = res; if (res.target && drill.on && res.target.popper) { drill.hits++; drill.spawn = .25; } }
    }
    if (ud.surface === 'paper') sfx.mech('paper'); else if (ud.surface !== 'steel' && hit.distance < 30 && i === 0) sfx.mech('thud');
  }
  if (any) {
    stats.hits++; stats.score += total; if (drill.on) drill.score += total;
    pop('+' + total + (best.label ? '  ' + best.label : ''), best.good);
    hud.marker.classList.remove('show'); void hud.marker.offsetWidth; hud.marker.classList.add('show');
  }
  // Recoil: viewmodel springs, view punch, bloom.
  const k = d.kick, a = 1 - view.ads * .35;
  kick.zv += k.z * a; kick.pv += k.pitch * a * 1.0; kick.rv += rnd(k.roll) * a * 6; kick.yv += rnd(k.pitch) * .12 * a;
  kick.camPV += d.cam * 26; kick.camYV += rnd(d.cam) * 9;
  view.bloom = Math.min(3.5, view.bloom + d.bloom);
  // Muzzle flash and smoke.
  w.model.muzzle.getWorldPosition(flash.position); w.model.muzzle.getWorldQuaternion(flash.quaternion);
  const fs = d.pellets > 1 || d.scope ? .26 : d.id === 'revolver' ? .22 : .16;
  flash.scale.setScalar(fs * (.8 + Math.random() * .5)); flash.rotateZ(Math.random() * 6.28);
  flash.visible = !(d.scope && view.ads > .9); flashT = .05; flashLight.position.copy(flash.position); flashLight.intensity = 5;
  for (let i = 0; i < 3; i++) addSmoke(flash.position);
  // Per-action mechanics.
  if ((d.action === 'slide' || d.action === 'bolt') && w.ammo === 0) w.slideLock = 1;
  if (d.action === 'revolver') w.cylIdx++;
  if (d.action === 'slide' || d.action === 'bolt') spawnCasing(w);
  if (d.action === 'pump') cycle();
  if (d.action === 'boltAction') { if (w.ammo > 0) cycle(); else w.needsBolt = true; }
  refreshHud();
}
function tryFire() {
  const w = cur;
  if (cooldown > 0) return;
  if (w.state === 'reload' && w.def.type === 'shells') { w.cancelReload = true; return; }
  if (w.state === 'inspect') { w.anim.stop(.08); w.state = 'idle'; }
  if (w.state !== 'idle') return;
  if (!w.def.auto && triggerUsed) return;
  triggerUsed = true;
  if (w.ammo <= 0) { sfx.mech('dry'); cooldown = .25; reload(); return; }
  fire();
}

function addTracer(end) {
  let t = tracers.find(t => t.life <= 0);
  if (!t) { if (tracers.length > 20) return; t = { o: new T.Mesh(tracerGeo, new T.MeshBasicMaterial({ color: 0xffe9b0, transparent: true, blending: T.AdditiveBlending, depthWrite: false })), life: 0 }; scene.add(t.o); tracers.push(t); }
  // Start a little ahead of the muzzle, in world space.
  cur.model.muzzle.getWorldPosition(tmp2); tmp2.z -= .6; camera.localToWorld(tmp2);
  const len = tmp2.distanceTo(end);
  if (len < 3) return;
  t.o.position.copy(tmp2); t.o.lookAt(end); t.o.scale.set(1, 1, Math.min(len, 60)); t.o.visible = true; t.life = .07; t.o.material.opacity = .5;
}
function addSmoke(pos) {
  let s = smokes.find(s => s.life <= 0);
  if (!s) { if (smokes.length > 24) return; s = { o: new T.Sprite(new T.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, depthTest: false, color: 0xcfcfcf })), life: 0, v: new T.Vector3() }; vmScene.add(s.o); smokes.push(s); }
  s.o.position.copy(pos); s.o.position.x += rnd(.01); s.o.position.y += rnd(.01); s.o.scale.setScalar(.03); s.o.visible = true;
  s.v.set(rnd(.08), .1 + Math.random() * .12, -.25 - Math.random() * .3); s.life = s.max = .5 + Math.random() * .35;
}
const zAxis = new T.Vector3(0, 0, 1), nrm = new T.Vector3();
function impact(hit, surface, d) {
  const obj = hit.object, n = hit.face.normal;
  const size = (d.pellets > 1 ? .012 : d.scope ? .02 : d.id === 'revolver' ? .017 : .013) * (surface === 'steel' ? 1.8 : surface === 'paper' ? 1 : 1.5);
  const dec = decals.length >= DECAL_MAX ? decals.shift() : new T.Mesh(holeGeo, holeMats.other);
  dec.material = holeMats[surface] || holeMats.other;
  dec.position.copy(obj.worldToLocal(tmp.copy(hit.point))).addScaledVector(n, .012);
  dec.quaternion.setFromUnitVectors(zAxis, n); dec.scale.setScalar(size);
  obj.add(dec); decals.push(dec);
  nrm.copy(n).transformDirection(obj.matrixWorld);
  const count = surface === 'steel' ? 7 : 5, near = hit.distance < 60;
  for (let i = 0; i < count && near; i++) {
    let p = parts.find(p => p.life <= 0);
    if (!p) { if (parts.length > 90) break; p = { o: new T.Mesh(partGeo, partMats.dirt), v: new T.Vector3(), life: 0 }; scene.add(p.o); parts.push(p); }
    p.o.material = partMats[surface] || partMats.dirt; p.o.position.copy(hit.point); p.o.visible = true;
    const sc = (.012 + Math.random() * .02) * (1 + hit.distance * .03); p.o.scale.setScalar(sc);
    p.v.copy(nrm).multiplyScalar(1.5 + Math.random() * 2.5); p.v.x += rnd(1.6); p.v.y += rnd(1.6) + 1; p.v.z += rnd(1.6);
    p.life = .35 + Math.random() * .3;
  }
}

// ── drill ──
function startDrill() {
  drill.on = true; drill.t = 30; drill.score = 0; drill.hits = 0; drill.spawn = .4;
  for (const p of range.poppers) p.up = false;
  sfx.beep(660, .1); setTimeout(() => sfx.beep(990, .25), 180);
  message('<b>DRILL: 30 seconds</b><br>Knock down the red pop-ups. Further = more points.', 3);
}
function endDrill() {
  drill.on = false; for (const p of range.poppers) p.up = false;
  const isBest = drill.score > drill.best;
  if (isBest) { drill.best = drill.score; try { localStorage.setItem('gunrange.best', drill.best); } catch (e) {} }
  sfx.beep(440, .4);
  message(`<b>DRILL OVER</b><br>${drill.score} points &middot; ${drill.hits} pop-ups down${isBest ? '<br><span class="gold">New best!</span>' : `<br>Best: ${drill.best}`}`, 6);
  hud.drill.textContent = `B: 30s drill (best ${drill.best})`;
}
function updateDrill(dt) {
  if (!drill.on) return;
  drill.t -= dt; drill.spawn -= dt;
  const upNow = range.poppers.filter(p => p.up).length;
  if (upNow < 3 && drill.spawn <= 0) {
    const down = range.poppers.filter(p => !p.up && p.ang <= -1.49);
    if (down.length) { down[Math.floor(Math.random() * down.length)].up = true; drill.spawn = .35; }
  }
  hud.drill.textContent = `DRILL ${Math.max(0, drill.t).toFixed(1)}s  |  ${drill.score} pts`;
  if (drill.t <= 0) endDrill();
}

// ── input ──
addEventListener('keydown', e => {
  if (e.repeat) return;
  keys[e.code] = true;
  if (!running) return;
  if (e.code.startsWith('Digit')) switchTo(+e.code[5] - 1);
  if (e.code === 'KeyQ') switchTo(lastIdx);
  if (e.code === 'KeyR') reload();
  if (e.code === 'KeyF') inspect();
  if (e.code === 'KeyB' && !drill.on) startDrill();
  if (e.code === 'KeyT') { range.resetTargets(); for (const d of decals) d.removeFromParent(); decals.length = 0; stats.score = stats.shots = stats.hits = 0; refreshHud(); message('Targets and score reset', 1.5); }
  if (e.code === 'Space' && player.ground) { player.vy = 4.6; player.ground = false; view.landV -= .5; }
  if (['Space', 'Tab'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('mousedown', e => { if (!running) return; e.preventDefault(); if (e.button === 0) { mouse.l = true; triggerUsed = false; } if (e.button === 2) { mouse.r = true; if (cur.state === 'inspect') { cur.anim.stop(.1); cur.state = 'idle'; } } });
addEventListener('mouseup', e => { if (e.button === 0) mouse.l = false; if (e.button === 2) mouse.r = false; });
addEventListener('contextmenu', e => e.preventDefault());
addEventListener('mousemove', e => { if (!running) return; mouse.dx += e.movementX; mouse.dy += e.movementY; });
addEventListener('wheel', e => { if (!running) return; const i = weapons.indexOf(nextIdx >= 0 ? weapons[nextIdx] : cur); switchTo((i + (e.deltaY > 0 ? 1 : -1) + weapons.length) % weapons.length); });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; mouse.l = mouse.r = false; });
const canvas = $('view');
// Pointer lock is preferred; where the page is not allowed to take it (some embeds),
// fall back to plain mouse movement so the game is still playable.
let fallback = false;
function setRunning(on) {
  running = on;
  $('start').classList.toggle('hidden', on); $('hud').classList.toggle('hidden', !on);
  document.body.classList.toggle('playing', on);
  if (!on) { mouse.l = mouse.r = false; for (const k in keys) keys[k] = false; $('start-title').textContent = 'PAUSED'; $('start-btn').textContent = 'Click to resume'; }
}
function useFallback() { if (document.pointerLockElement === canvas) return; fallback = true; setRunning(true); }
function start() {
  sfx.init();
  if (fallback || !canvas.requestPointerLock) return useFallback();
  try { const r = canvas.requestPointerLock(); if (r && r.catch) r.catch(useFallback); } catch (e) { useFallback(); }
}
$('start').addEventListener('click', start);
document.addEventListener('pointerlockerror', useFallback);
document.addEventListener('pointerlockchange', () => { if (document.pointerLockElement === canvas) fallback = false; if (!fallback) setRunning(document.pointerLockElement === canvas); });
addEventListener('keydown', e => { if (fallback && running && (e.code === 'Escape' || e.code === 'KeyP')) setRunning(false); });
function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = vmCam.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); vmCam.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

// ── update ──
function spring(o, x, v, k, c, dt) { o[v] += (-k * o[x] - c * o[v]) * dt; o[x] += o[v] * dt; }

function update(dt) {
  time += dt;
  const w = cur, d = w.def, busy = w.state !== 'idle' && w.state !== 'action';
  const scoped = !!d.scope && view.ads > .88;

  // Look.
  const sens = .0022 * (fovNow / 74);
  player.yaw -= mouse.dx * sens; player.pitch = clamp(player.pitch - mouse.dy * sens, -1.5, 1.5);
  view.tX = clamp(view.tX + mouse.dx * .0009, -.09, .09); view.tY = clamp(view.tY + mouse.dy * .0009, -.07, .07);
  mouse.dx = mouse.dy = 0;
  view.tX = damp(view.tX, 0, 9, dt); view.tY = damp(view.tY, 0, 9, dt);
  view.swayX = damp(view.swayX, view.tX, 14, dt); view.swayY = damp(view.swayY, view.tY, 14, dt);

  // Move.
  const ix = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0), iz = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0);
  const wantAds = mouse.r && (w.state === 'idle' || (w.state === 'action' && !d.scope));
  const sprinting = keys.ShiftLeft && iz < 0 && !wantAds && !mouse.l && w.state === 'idle' && player.ground;
  const sp = sprinting ? 5.6 : wantAds ? 1.9 : 3.3, len = Math.hypot(ix, iz) || 1;
  const sy = Math.sin(player.yaw), cy = Math.cos(player.yaw);
  const tx = (ix * cy + iz * sy) / len * sp, tz = (-ix * sy + iz * cy) / len * sp;
  player.vel.x = damp(player.vel.x, tx, player.ground ? 12 : 2, dt); player.vel.z = damp(player.vel.z, tz, player.ground ? 12 : 2, dt);
  player.pos.x = clamp(player.pos.x + player.vel.x * dt, -8.4, 8.4); player.pos.z = clamp(player.pos.z + player.vel.z * dt, -.55, 5.2);
  if (!player.ground) {
    player.vy -= 13 * dt; player.y += player.vy * dt;
    if (player.y <= 0) { player.y = 0; player.ground = true; view.landV -= Math.min(1.6, -player.vy * .22); player.vy = 0; sfx.mech('step'); }
  }
  const speed = Math.hypot(player.vel.x, player.vel.z);
  view.bob += speed * dt * 1.9;
  if (player.ground && speed > 1) { stepT -= dt * speed; if (stepT <= 0) { stepT = 2.3; sfx.mech('step'); } }
  view.strafe = damp(view.strafe, ix * Math.min(1, speed / 3), 8, dt);

  view.ads = damp(view.ads, wantAds ? 1 : 0, d.scope ? 11 : 16, dt);
  view.sprint = damp(view.sprint, sprinting ? 1 : 0, 9, dt);
  view.bloom = damp(view.bloom, 0, 5, dt);
  spring(view, 'land', 'landV', 160, 16, dt);

  // Fire control.
  cooldown -= dt;
  if (mouse.l) tryFire();

  // Recoil springs.
  spring(kick, 'z', 'zv', 260, 22, dt); spring(kick, 'p', 'pv', 210, 19, dt); spring(kick, 'r', 'rv', 200, 16, dt); spring(kick, 'y', 'yv', 200, 18, dt);
  spring(kick, 'camP', 'camPV', 95, 15, dt); spring(kick, 'camY', 'camYV', 95, 15, dt);

  // Camera.
  const bobA = (1 - view.ads * .8) * Math.min(1, speed / 3.3);
  camera.position.set(player.pos.x, 1.66 + player.y + Math.sin(view.bob * 2) * .022 * bobA + view.land * .06, player.pos.z);
  camera.rotation.set(player.pitch + kick.camP, player.yaw + kick.camY, Math.sin(view.bob) * .004 * bobA - view.strafe * .012);
  const fovT = 74 + (d.adsFov - 74) * (d.scope ? (scoped ? 1 : view.ads * .25) : view.ads) + view.sprint * 4;
  fovNow = d.scope ? (scoped ? d.adsFov : damp(fovNow, fovT, 20, dt)) : fovT;
  if (camera.fov !== fovNow) { camera.fov = fovNow; camera.updateProjectionMatrix(); }

  // Per-gun procedural motion layered over clips.
  const A = w.anim, since = time - w.lastShot;
  if (d.action === 'slide') {
    const pulse = since < .028 ? since / .028 : Math.max(0, 1 - (since - .028) / .07);
    w.slideLockV = damp(w.slideLockV, w.slideLock, w.slideLock ? 80 : 45, dt);
    A.extra('slide')[2] = Math.max(pulse, w.slideLockV) * .044;
  } else if (d.action === 'bolt') {
    w.slideLockV = damp(w.slideLockV, w.slideLock, w.slideLock ? 80 : 45, dt);
    A.extra('bolt')[2] = Math.max(since < .025 ? since / .025 : Math.max(0, 1 - (since - .025) / .05), w.slideLockV) * .05;
  } else if (d.action === 'revolver') {
    w.cylAng = damp(w.cylAng, w.cylIdx * 60, 38, dt); A.extra('cyl')[5] = w.cylAng;
    A.extra('hammer')[3] = since < .05 ? 0 : since < .24 ? Math.min(1, (since - .05) / .16) * 32 * (cooldown > .1 ? 1 : 0) : 0;
  }
  if (dbg.freeze) A.pose(d.clips[dbg.freeze.clip], dbg.freeze.t); else A.update(dt);

  // Viewmodel placement: hip/ADS/sprint blend, sway, bob, recoil.
  const a = view.ads * view.ads * (3 - 2 * view.ads), s = view.sprint, h = w.holder, loose = 1 - a * .86;
  h.position.lerpVectors(w.hip, w.adsPos, a);
  h.position.x += -s * .05 - view.strafe * .008 * loose; h.position.y += -s * .05 + view.land * .05 * loose - Math.abs(player.pitch) * .012 * loose; h.position.z += s * .03 + kick.z * .012;
  h.rotation.set(
    kick.p * D2R * (1 - a * .45) - s * .3 + view.land * .12 * loose,
    d.hipYaw * D2R * (1 - a) + s * .75 + kick.y * D2R,
    s * .3 + kick.r * D2R * loose - view.strafe * .05 * loose - view.swayX * 1.4 * loose, 'YXZ');
  const breathe = Math.sin(time * 1.5), idleA = loose * (scoped ? 0 : 1);
  swayNode.position.set(
    Math.sin(view.bob) * .011 * bobA * (1 + s) + view.swayX * -.25 * loose,
    Math.sin(view.bob * 2) * -.008 * bobA * (1 + s) + breathe * .0025 * idleA + view.swayY * .2 * loose, 0);
  swayNode.rotation.set(view.swayY * -.7 * loose + breathe * .004 * idleA, view.swayX * .9 * loose + Math.sin(time * .9) * .003 * idleA, 0);
  w.holder.visible = !scoped; arms.lh.visible = arms.rh.visible = !scoped;
  hud.scope.classList.toggle('on', scoped);

  // Forearms follow the animated wrists.
  vmScene.updateMatrixWorld(true);
  for (const k of ['lh', 'rh']) {
    w.model.parts[k].userData.wrist.getWorldPosition(tmp);
    const arm = arms[k]; arm.position.copy(ELBOW[k]); arm.position.x += tmp.x * .25; arm.lookAt(tmp); arm.scale.z = arm.position.distanceTo(tmp);
  }

  // Effects.
  if (flashT > 0) { flashT -= dt; if (flashT <= 0) flash.visible = false; }
  flashLight.intensity = damp(flashLight.intensity, 0, 40, dt);
  for (let i = casings.length - 1; i >= 0; i--) {
    const c = casings[i]; c.life -= dt; c.v.y -= 7.5 * dt; c.o.position.addScaledVector(c.v, dt);
    c.o.rotation.x += c.spin.x * dt; c.o.rotation.y += c.spin.y * dt; c.o.rotation.z += c.spin.z * dt;
    if (c.life <= 0) { vmScene.remove(c.o); casings.splice(i, 1); }
  }
  for (const p of parts) if (p.life > 0) { p.life -= dt; p.v.y -= 9.8 * dt; p.o.position.addScaledVector(p.v, dt); if (p.life <= 0 || p.o.position.y < 0) { p.life = 0; p.o.visible = false; } }
  for (const t of tracers) if (t.life > 0) { t.life -= dt; t.o.material.opacity = Math.max(0, t.life / .07) * .5; if (t.life <= 0) t.o.visible = false; }
  for (const sm of smokes) if (sm.life > 0) {
    sm.life -= dt; const f = 1 - sm.life / sm.max; sm.o.position.addScaledVector(sm.v, dt); sm.v.multiplyScalar(1 - 2.5 * dt);
    sm.o.scale.setScalar(.03 + f * .13); sm.o.material.opacity = (1 - f) * .3; if (sm.life <= 0) sm.o.visible = false;
  }

  range.update(dt, time);
  updateDrill(dt);
  if (msgTimer > 0) { msgTimer -= dt; if (msgTimer <= 0) hud.msg.classList.add('hidden'); }

  // Crosshair follows the real spread.
  const gap = Math.tan(spreadDeg() * D2R) / Math.tan(fovNow * D2R / 2) * innerHeight / 2;
  hud.cross.style.setProperty('--gap', Math.max(4, gap).toFixed(1) + 'px');
  hud.cross.style.opacity = view.ads > .5 || view.sprint > .5 || busy && w.state !== 'reload' ? 0 : 1;
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(.033, (now - last) / 1000); last = now;
  if (running || dbg.run) update(dt);
  renderer.clear(); renderer.render(scene, camera);
  renderer.clearDepth(); renderer.render(vmScene, vmCam);
  requestAnimationFrame(frame);
}

hud.drill.textContent = `B: 30s drill${drill.best ? ` (best ${drill.best})` : ''}`;
cur.holder.visible = true; equip(0); refreshHud();
update(.016);
requestAnimationFrame(frame);

// Hooks for automated checks.
window.__range = { weapons, player, view, stats, dbg, drill, range, mouse, keys, switchTo, reload, inspect, equip, startDrill, update, get cur() { return cur; }, set trigger(v) { mouse.l = v; if (v) triggerUsed = false; } };

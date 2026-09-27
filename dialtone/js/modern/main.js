import * as THREE from '../../../vendor/three.module.min.js';
import { buildWorld } from '../world.js';
import { Keyboard3D } from '../keyboard3d.js';
import { A } from '../audio.js';
import { Nova } from './nova.js';
import { KEYBOARDS } from './shop.js';

const $ = (id) => document.getElementById(id);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const renderer = new THREE.WebGLRenderer({ canvas: $('c'), antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.02, 400);
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

const W = buildWorld(scene, renderer);
$('fade').style.opacity = 0;
W.calm = true; W.retro.forEach(o => (o.visible = false)); W.tree.visible = false; W.setLamp(true);
const std = (c, r = 0.5, e = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, ...e });
const box = (p, w, h, d, m, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; p.add(b); return b; };

// ---- gaming setup ----
const rgb = [];
const glowMat = (h) => { const m = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xff00ff, emissiveIntensity: 2.2 }); rgb.push([m, h]); return m; };
const mon = new THREE.Group(); mon.position.set(3.1, 0.75, -6.5); scene.add(mon);
const metal = std(0x1a1b1f, 0.35, { metalness: 0.7 });
box(mon, 0.28, 0.012, 0.2, metal, 0, 0.006, 0); box(mon, 0.05, 0.3, 0.03, metal, 0, 0.16, -0.05);
box(mon, 0.66, 0.39, 0.03, std(0x0d0e10, 0.3), 0, 0.33, 0);
box(mon, 0.6, 0.02, 0.005, glowMat(0), 0, 0.33, -0.018);
const osCanvas = document.createElement('canvas'); osCanvas.width = 960; osCanvas.height = 540;
const screenTex = new THREE.CanvasTexture(osCanvas); screenTex.colorSpace = THREE.SRGBColorSpace; screenTex.anisotropy = 8;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.36), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false, color: 0x000000 }));
screen.position.set(0, 0.335, 0.0155); mon.add(screen);
// tower with glass side + fans
const tower = new THREE.Group(); tower.position.set(3.78, 0.75, -6.45); scene.add(tower);
box(tower, 0.22, 0.46, 0.44, std(0x0c0d10, 0.4, { metalness: 0.5 }), 0, 0.23, 0);
const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x223, transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.2 }));
glass.rotation.y = -Math.PI / 2; glass.position.set(-0.111, 0.23, 0); tower.add(glass);
box(tower, 0.02, 0.05, 0.28, glowMat(0.3), 0, 0.28, -0.02); // GPU strip
box(tower, 0.12, 0.08, 0.2, std(0x2a2d33, 0.3, { metalness: 0.8 }), -0.02, 0.28, -0.02);
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.008, 8, 24), glowMat(i * 0.15)); ring.position.set(0, 0.1 + i * 0.12, 0.221); tower.add(ring);
  const hub = box(tower, 0.02, 0.02, 0.01, std(0x111111), 0, 0.1 + i * 0.12, 0.221); hub.userData.fan = true;
  const blades = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.012, 0.004), std(0x1a1a1a)); blades.position.copy(hub.position); blades.userData.spin = true; tower.add(blades);
}
const towerLight = new THREE.PointLight(0xff00ff, 0.7, 1.5, 2); towerLight.position.set(3.6, 1.0, -6.1); scene.add(towerLight);
// desk mat with rgb edge, led strip on wall, headphones
box(scene, 0.95, 0.004, 0.36, std(0x0f1014, 0.95), 3.15, 0.752, -6.0);
box(scene, 0.95, 0.005, 0.006, glowMat(0.6), 3.15, 0.753, -5.82);
box(scene, 1.5, 0.012, 0.012, glowMat(0.1), 3.1, 1.55, -6.84);
const wallLight = new THREE.PointLight(0xff00ff, 1.6, 3, 2); wallLight.position.set(3.1, 1.3, -6.75); scene.add(wallLight);
const hs = new THREE.Group(); hs.position.set(2.62, 0.75, -6.25); scene.add(hs);
box(hs, 0.1, 0.01, 0.1, metal, 0, 0.005, 0); box(hs, 0.012, 0.3, 0.012, metal, 0, 0.15, 0);
const band = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 20, Math.PI), std(0x18191d, 0.6)); band.position.set(0, 0.26, 0); hs.add(band);
for (const s of [-1, 1]) { const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16), glowMat(0.8)); cup.rotation.z = Math.PI / 2; cup.position.set(s * 0.08, 0.24, 0); hs.add(cup); }
W.mouse.material = std(0x141518, 0.35); W.mouse.scale.set(0.03, 0.017, 0.055);
W.tvOverride = (g, t) => {
  g.fillStyle = '#0d0f14'; g.fillRect(0, 0, 256, 192); g.fillStyle = '#1f2a1a'; g.fillRect(8, 8, 180, 110);
  for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#e05' : '#0af'; g.fillRect(20 + ((i * 40 + t * 30) % 160), 40 + Math.sin(t * 2 + i) * 30, 6, 10); }
  g.fillStyle = '#e22'; g.fillRect(12, 12, 30, 11); g.fillStyle = '#fff'; g.font = 'bold 9px Arial'; g.fillText('LIVE', 16, 21);
  g.fillStyle = '#fff'; g.font = 'bold 10px Arial'; g.fillText('GRAND FINALS  2 - 1', 12, 136); g.fillStyle = '#889'; g.font = '9px Arial';
  for (let i = 0; i < 9; i++) { g.fillStyle = `hsl(${i * 50},70%,65%)`; g.fillText(['gg', 'W', 'no way', 'CLUTCH', 'lol', '???', 'insane', 'pog', 'ez'][(i + Math.floor(t)) % 9], 196, 18 + i * 12); }
};

// ---- keyboard swap ----
function equip(def) {
  W.kb.dispose(); W.kb = new Keyboard3D(W.kbGroup, def.style); A.profile = def.sound;
}
const os = new Nova(osCanvas);
os.onEquip = equip;
equip(KEYBOARDS.find(k => k.id === os.equipped) || KEYBOARDS[0]);

// ---- flow ----
let state = 'title', it = 0, zoom = 0, zoomT = 0, power = 0;
const look = { yaw: 0, pitch: 0, drag: false, lx: 0, ly: 0 };
const START = [V(0.6, 1.62, -2.2), V(3.1, 1.0, -6.4)];
const SEAT = [V(3.1, 1.3, -5.3), V(3.1, 0.9, -6.3)], CLOSE = [V(3.1, 1.09, -5.93), V(3.1, 1.085, -6.5)];
function setView(z) { zoom = z; document.querySelectorAll('#view button').forEach(b => b.classList.toggle('on', +b.dataset.z === z)); }
document.querySelectorAll('#view button').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); setView(+b.dataset.z); }));
$('title').addEventListener('click', () => {
  A.init(); A.indoors(true); state = 'intro'; it = 0; $('title').style.opacity = 0; setTimeout(() => $('title').remove(), 1200);
});
const ease = (x) => x * x * (3 - 2 * x);

// ---- input ----
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), canvas = $('c');
function hit(e) {
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const h = ray.intersectObject(screen)[0]; return h ? [h.uv.x * 960, (1 - h.uv.y) * 540] : null;
}
const locked = () => document.pointerLockElement === canvas;
const wantsLock = () => os.focus && os.focus.full && os.focus.pad;
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('mousedown', e => {
  if (state !== 'seat') return;
  if (locked()) { os.mouseEv('down', 480, 270, e.button); return; }
  const p = hit(e);
  if (e.button === 2 && !(p && wantsLock())) { look.drag = true; look.lx = e.clientX; look.ly = e.clientY; return; }
  if (!p) return;
  A.beep(2400, 0.01, 0.04, 'square');
  if (wantsLock()) { setView(1); try { const r = canvas.requestPointerLock(); r && r.catch && r.catch(() => {}); } catch (err) {} }
  os.mouseEv('down', p[0], p[1], e.button);
});
addEventListener('mouseup', e => {
  if (e.button === 2) look.drag = false;
  if (state !== 'seat') return;
  if (locked()) { os.mouseEv('up', 480, 270, e.button); return; }
  const p = hit(e); os.mouseEv('up', p ? p[0] : os.mouse.x, p ? p[1] : os.mouse.y, e.button);
});
addEventListener('mousemove', e => {
  if (state !== 'seat') return;
  if (locked()) { os.mouseEv('look', e.movementX, e.movementY); return; }
  if (look.drag) { look.yaw = Math.max(-2.6, Math.min(2.6, look.yaw - (e.clientX - look.lx) * 0.004)); look.pitch = Math.max(-0.8, Math.min(0.8, look.pitch - (e.clientY - look.ly) * 0.004)); look.lx = e.clientX; look.ly = e.clientY; return; }
  const p = hit(e); canvas.style.cursor = p ? 'none' : 'default'; if (p) os.mouseEv('move', p[0], p[1]);
});
addEventListener('wheel', e => {
  if (state !== 'seat') return;
  const p = locked() ? [480, 270] : hit(e);
  if (p && os.focus) os.mouseEv('wheel', p[0], p[1], Math.sign(e.deltaY)); else setView(e.deltaY < 0 ? 1 : 0);
}, { passive: true });
addEventListener('keydown', e => {
  if (state === 'title') return;
  if (e.code !== 'F11' && e.code !== 'F12') e.preventDefault();
  W.kb.press(e.code, true); if (!e.repeat) A.key(e.code, true);
  if (state === 'seat') os.key(e, true);
});
addEventListener('keyup', e => { W.kb.press(e.code, false); if (state === 'title') return; A.key(e.code, false); if (state === 'seat') os.key(e, false); });
addEventListener('blur', () => { for (const k in W.kb.keys) W.kb.press(k, false); });
os.onClose = () => { if (locked()) document.exitPointerLock(); };

// ---- loop ----
const clock = new THREE.Clock(); let t = 0;
const P = V(0, 0, 0), L = V(0, 0, 0), col = new THREE.Color();
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, clock.getDelta()); t += dt;
  if (state === 'title') { camera.position.set(1.2 + Math.sin(t * 0.2) * 0.3, 1.6, -3); camera.lookAt(3.1, 1.0, -6.4); }
  else if (state === 'intro') {
    it += dt / 3.2; const u = ease(Math.min(1, it));
    P.lerpVectors(START[0], SEAT[0], u); L.lerpVectors(START[1], SEAT[1], u); camera.position.copy(P); camera.lookAt(L);
    if (it > 0.55 && os.state === 'off') { os.boot(); A.click(); A.hum(true); }
    if (it >= 1) { state = 'seat'; $('view').style.display = 'flex'; $('hint').style.opacity = 1; setTimeout(() => ($('hint').style.opacity = 0.35), 9000); }
  } else {
    zoomT += (zoom - zoomT) * Math.min(1, dt * 4);
    P.lerpVectors(SEAT[0], CLOSE[0], zoomT); L.lerpVectors(SEAT[1], CLOSE[1], zoomT);
    if (!look.drag) { look.yaw *= 1 - Math.min(1, dt * 3); look.pitch *= 1 - Math.min(1, dt * 3); }
    camera.position.copy(P); const dir = L.clone().sub(P), len = dir.length();
    dir.normalize().applyEuler(new THREE.Euler(look.pitch, look.yaw, 0, 'YXZ')); camera.lookAt(P.clone().addScaledVector(dir, len));
  }
  if (os.state !== 'off') power = Math.min(1, power + dt * 2);
  screen.material.color.setScalar(power);
  for (const [m, h] of rgb) m.emissive.setHSL((h + t * 0.08) % 1, 1, 0.5);
  col.setHSL((t * 0.08) % 1, 1, 0.5); wallLight.color.copy(col); towerLight.color.setHSL((t * 0.08 + 0.3) % 1, 1, 0.5);
  tower.children.forEach(c => { if (c.userData.spin) c.rotation.z += dt * 25; });
  os.update(dt); os.draw(); screenTex.needsUpdate = true;
  W.glow.intensity = power * 0.6; W.glow.color.setRGB(0.6, 0.7, 1);
  W.mouse.position.x = 3.5 + (os.mouse.x / 960 - 0.5) * 0.06; W.mouse.position.z = -6.0 + (os.mouse.y / 540 - 0.5) * 0.05;
  W.kb.update(dt, t); W.update(dt, t, 0, false);
  renderer.render(scene, camera);
}
loop();
window.__dt = { os, W, setView, go: () => { A.init(); state = 'seat'; os.boot(); $('title').remove(); } };

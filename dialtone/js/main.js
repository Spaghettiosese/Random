import * as THREE from '../../vendor/three.module.min.js';
import { buildWorld } from './world.js';
import { makeCRT, crtWarp } from './crt.js';
import { A } from './audio.js';
import { OS, MIDNIGHT } from './os.js';

const $ = (id) => document.getElementById(id);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const renderer = new THREE.WebGLRenderer({ canvas: $('c'), antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.02, 400);
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

const W = buildWorld(scene, renderer);
const osCanvas = document.createElement('canvas'); osCanvas.width = 640; osCanvas.height = 480;
const crt = makeCRT(osCanvas); W.screenMesh.material = crt.mat;
const os = new OS(osCanvas);

// ---------------- cutscene ----------------
const KEYS = [
  [0, V(0, 1.7, 21), V(0, 2.1, 0)],
  [3, V(0, 1.7, 13.5), V(0, 1.9, 0)],
  [6.2, V(0, 1.68, 2.3), V(0.1, 1.55, -1)],
  [8, V(0, 1.66, 2.0), V(0, 1.45, -3)],
  [9.6, V(-0.05, 1.66, 0.4), V(-2.2, 1.2, -5)],
  [11.2, V(0.35, 1.66, -1.3), V(1.6, 1.25, -6)],
  [13.2, V(2.15, 1.64, -3.4), V(3.1, 1.05, -6.3)],
  [15, V(3.0, 1.55, -4.75), V(3.1, 0.95, -6.3)],
  [16.6, V(3.1, 1.3, -5.3), V(3.1, 0.86, -6.25)],
];
const T_END = 16.6;
const posCurve = new THREE.CatmullRomCurve3(KEYS.map(k => k[1]), false, 'centripetal');
const lookCurve = new THREE.CatmullRomCurve3(KEYS.map(k => k[2]), false, 'centripetal');
const SUBS = [[0.6, 4.5, 'December 31st, 1999. 11:38 PM.'], [4.8, 8.2, "Mom and Dad are at the Hendersons' party. The whole street's gone quiet."], [8.6, 12, "The news says the world might end at midnight."], [12.3, 15.8, "Perfect. Nobody's using the phone line."], [16.2, 19, 'Time to get online.']];
function curveParam(t) {
  if (t >= T_END) return 1;
  let i = 0; while (KEYS[i + 1][0] <= t) i++;
  const u = (t - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]);
  return (i + u) / (KEYS.length - 1);
}
const walking = (t) => (t > 0.3 && t < 6.1) || (t > 8.6 && t < 15);

// ---------------- state ----------------
let state = 'title', ct = 0, zoom = 0, zoomT = 0, look = { yaw: 0, pitch: 0, drag: false, lx: 0, ly: 0 }, lastStep = 0, power = 0, powerTarget = 0;
const events = new Set(); const once = (k) => (events.has(k) ? false : (events.add(k), true));
const sub = (text) => { const s = $('sub'); if (text) { s.textContent = text; s.style.opacity = 1; } else s.style.opacity = 0; };
const SEAT = [V(3.1, 1.3, -5.3), V(3.1, 0.86, -6.25)], CLOSE = [V(3.1, 1.08, -5.73), V(3.1, 1.045, -6.3)];

function startGame() {
  A.init(); state = 'cut'; ct = 0;
  $('title').style.opacity = 0; setTimeout(() => $('title').remove(), 1300);
  $('fade').style.opacity = 0; document.body.classList.add('cine'); $('skip').style.display = 'block';
}
function skipCut() {
  if (state !== 'cut') return;
  ct = T_END; W.door.rotation.y = 1.7; W.setLamp(true); A.indoors(true);
  events.add('door'); events.add('lamp'); events.add('in');
}
function sitDown() {
  state = 'seat'; document.body.classList.remove('cine'); $('skip').style.display = 'none'; sub(null);
  $('view').style.display = 'flex';
  $('hint').innerHTML = 'mouse = the PC mouse &nbsp;·&nbsp; keyboard = the PC keyboard<br>scroll off-screen / buttons = zoom &nbsp;·&nbsp; right-drag = look around<br>ESC closes a window &nbsp;·&nbsp; midnight is coming';
  $('hint').style.opacity = 1; setTimeout(() => ($('hint').style.opacity = 0.35), 9000);
  setView(0);
}
function powerOn(dirty) {
  A.click(); W.pwrLed.material.color.setHex(0x22ff44); W.monLed.material.color.setHex(0x33ff55);
  setTimeout(() => { A.crtOn(); A.hum(true); powerTarget = 1; os.boot(dirty); }, 450);
}
function setView(z) { zoom = z; document.querySelectorAll('#view button').forEach(b => b.classList.toggle('on', +b.dataset.z === z)); }
document.querySelectorAll('#view button').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); setView(+b.dataset.z); }));
$('title').addEventListener('click', startGame);

// ---------------- Y2K ----------------
let y2kStage = 0, y2kT = 0;
function y2kUpdate(dt) {
  if (y2kStage === 0 && os.state === 'desk' && os.clock >= MIDNIGHT) { y2kStage = 1; y2kT = 0; os.y2k = true; os.glitch = 1; W.flash(); A.thunder(0.8); }
  if (!y2kStage || y2kStage > 4) return;
  y2kT += dt;
  if (y2kStage === 1) { crt.mat.uniforms.uGlitch.value = 0.4 + Math.random() * 0.6; if (y2kT > 2.2) { y2kStage = 2; blackout(); } }
  else if (y2kStage === 2 && y2kT > 5.5) { y2kStage = 3; W.fireworks(true); sub('...fireworks?'); setTimeout(() => sub(null), 3500); }
  else if (y2kStage === 3 && y2kT > 11) {
    y2kStage = 4; W.setPower(true); flicker(); os.y2k = false; os.glitch = 0; crt.mat.uniforms.uGlitch.value = 0; os.clock = Math.max(os.clock, MIDNIGHT + 30);
    setTimeout(() => { powerOn(true); }, 900);
    setTimeout(() => { os.emit('newyear'); }, 7000);
    setTimeout(() => W.fireworks(false), 60000);
    y2kStage = 5;
  }
}
function blackout() {
  W.setPower(false); powerTarget = 0; A.crtOff(); A.hum(false); os.powerOff(); crt.mat.uniforms.uGlitch.value = 0;
  W.pwrLed.material.color.setHex(0x0a200a); W.monLed.material.color.setHex(0x113311);
  sub('The power went out.');
  setTimeout(() => sub(null), 3000);
}
function flicker() { let n = 0; const iv = setInterval(() => { W.setLamp(n % 2 === 1 || n > 5); if (++n > 6) clearInterval(iv); }, 90); }
os.onEvent = (name) => {
  if (name === 'doom-end') { // "don't turn around"
    setTimeout(() => { W.flash(); A.thunder(0.7); W.setLamp(false); }, 5500);
    setTimeout(() => { lookBack = 1; }, 6500);
    setTimeout(() => { W.setLamp(true); }, 7600);
  }
};
let lookBack = 0;
W.onThunder = () => setTimeout(() => A.thunder(1.2 + Math.random()), 400 + Math.random() * 1600);
W.onPop = () => setTimeout(() => A.pop(), 300);

// ---------------- input ----------------
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function screenHit(e) {
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const h = ray.intersectObject(W.screenMesh)[0];
  if (!h) return null;
  const [u, v] = crtWarp(h.uv.x, h.uv.y);
  if (u < 0 || u > 1 || v < 0 || v > 1) return null;
  return [u * 640, (1 - v) * 480];
}
const canvas = $('c');
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('mousedown', e => {
  if (state !== 'seat') return;
  if (e.button === 2) { look.drag = true; look.lx = e.clientX; look.ly = e.clientY; return; }
  const p = screenHit(e); if (!p) return;
  A.beep(2200, 0.012, 0.05, 'square');
  os.mouseEv('down', p[0], p[1], e.button);
});
addEventListener('mouseup', e => {
  if (e.button === 2) { look.drag = false; return; }
  if (state !== 'seat') return;
  const p = screenHit(e); os.mouseEv('up', p ? p[0] : os.mouse.x, p ? p[1] : os.mouse.y, e.button);
});
addEventListener('mousemove', e => {
  if (state !== 'seat') return;
  if (look.drag) { look.yaw -= (e.clientX - look.lx) * 0.004; look.pitch -= (e.clientY - look.ly) * 0.004; look.yaw = Math.max(-2.6, Math.min(2.6, look.yaw)); look.pitch = Math.max(-0.8, Math.min(0.8, look.pitch)); look.lx = e.clientX; look.ly = e.clientY; return; }
  const p = screenHit(e);
  canvas.style.cursor = p ? 'none' : 'default';
  if (p) os.mouseEv('move', p[0], p[1]);
});
addEventListener('wheel', e => {
  if (state !== 'seat') return;
  const p = screenHit(e);
  if (p && os.focus && !os.focus.min) os.mouseEv('wheel', p[0], p[1], Math.sign(e.deltaY));
  else setView(e.deltaY < 0 ? 1 : 0);
}, { passive: true });
addEventListener('keydown', e => {
  if (state === 'title') { if (e.code === 'Enter' || e.code === 'Space') startGame(); return; }
  if (e.code !== 'F11' && e.code !== 'F12') e.preventDefault();
  W.kb.press(e.code, true);
  if (!e.repeat) A.key(e.code, true);
  if (state === 'cut') { if (e.code === 'Space' || e.code === 'Escape' || e.code === 'Enter') skipCut(); return; }
  if (state === 'seat') os.key(e, true);
});
addEventListener('keyup', e => {
  W.kb.press(e.code, false);
  if (state === 'title') return;
  A.key(e.code, false);
  if (state === 'seat') os.key(e, false);
});
addEventListener('blur', () => { for (const k in W.kb.keys) W.kb.press(k, false); });

// ---------------- loop ----------------
const glowC = document.createElement('canvas'); glowC.width = glowC.height = 1; const glowG = glowC.getContext('2d', { willReadFrequently: true });
const clock = new THREE.Clock(); let t = 0, frame = 0;
const tmpP = V(0, 0, 0), tmpL = V(0, 0, 0);
W.setPower(true);
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, clock.getDelta()); t += dt; frame++;
  if (state === 'title') {
    const a = t * 0.05;
    camera.position.set(Math.sin(a) * 4 + 1, 2.2, 22 + Math.cos(a) * 2); camera.lookAt(0, 2.2, 0);
  } else if (state === 'cut') {
    ct += dt;
    const u = curveParam(ct);
    posCurve.getPoint(u, tmpP); lookCurve.getPoint(u, tmpL);
    if (walking(ct)) {
      const ph = ct * 1.9 * Math.PI * 2; tmpP.y += Math.sin(ph) * 0.025; tmpP.x += Math.cos(ph / 2) * 0.012;
      const step = Math.floor(ct * 3.8); if (step !== lastStep) { lastStep = step; A.step(tmpP.z > 0.2); }
    }
    camera.position.copy(tmpP); camera.lookAt(tmpL);
    if (ct > 6.6 && once('door')) A.creak();
    if (ct > 6.6) W.door.rotation.y = Math.min(1.7, W.door.rotation.y + dt * 1.3);
    if (ct > 9 && once('in')) A.indoors(true);
    if (ct > 10.4 && once('lamp')) { A.switchOn(); W.setLamp(true); }
    const s = SUBS.find(s => ct >= s[0] && ct < s[1]); sub(s ? s[2] : null);
    if (ct >= T_END + 0.2 && once('power')) powerOn(false);
    if (ct >= T_END + 1.8) sitDown();
  } else {
    zoomT += (zoom - zoomT) * Math.min(1, dt * 4);
    tmpP.lerpVectors(SEAT[0], CLOSE[0], zoomT); tmpL.lerpVectors(SEAT[1], CLOSE[1], zoomT);
    if (!look.drag) { look.yaw *= 1 - Math.min(1, dt * 3); look.pitch *= 1 - Math.min(1, dt * 3); }
    let yaw = look.yaw, pitch = look.pitch;
    if (lookBack > 0) { lookBack = Math.max(0, lookBack - dt * 0.28); yaw += Math.sin(Math.min(1, (1 - lookBack) * 1.4) * Math.PI) * 2.4; }
    camera.position.copy(tmpP);
    const dir = tmpL.clone().sub(tmpP), len = dir.length();
    const e = new THREE.Euler(pitch, yaw, 0, 'YXZ'); dir.normalize().applyEuler(e);
    camera.lookAt(tmpP.clone().addScaledVector(dir, len));
    camera.position.y += Math.sin(t * 0.8) * 0.002;
  }
  // screen
  power += (powerTarget - power) * Math.min(1, dt * (powerTarget ? 2.2 : 6));
  crt.mat.uniforms.uPower.value = power; crt.mat.uniforms.uTime.value = t;
  os.update(dt); os.draw(); crt.map.needsUpdate = true;
  y2kUpdate(dt);
  if (frame % 8 === 0) {
    glowG.drawImage(osCanvas, 0, 0, 1, 1); const d = glowG.getImageData(0, 0, 1, 1).data;
    W.glow.color.setRGB(d[0] / 255 * 0.8 + 0.2, d[1] / 255 * 0.8 + 0.2, d[2] / 255 * 0.8 + 0.25);
    W.glow.intensity = power * (0.25 + (d[0] + d[1] + d[2]) / 765 * 1.2);
  }
  W.mouse.position.x = 3.5 + (os.mouse.x / 640 - 0.5) * 0.06; W.mouse.position.z = -6.0 + (os.mouse.y / 480 - 0.5) * 0.05;
  W.kb.update(dt);
  W.update(dt, t, os.clock, os.busy);
  renderer.render(scene, camera);
}
loop();
window.__dt = { os, W, setView, camera, osCanvas, go: () => { startGame(); skipCut(); ct = T_END + 2; } };

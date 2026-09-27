import * as THREE from '../../vendor/three.module.min.js';
import { Keyboard3D } from './keyboard3d.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const HOUSE = { x0: -5, x1: 5, z0: -7, z1: 0, h: 2.8 };

function canvasOf(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; }
function ctex(c, rx = 1, ry = 1) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; return t;
}
function speckle(g, w, h, n, a, s = 2) {
  for (let i = 0; i < n; i++) { const v = Math.random() < 0.5 ? 0 : 255; g.fillStyle = `rgba(${v},${v},${v},${Math.random() * a})`; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * s, 1 + Math.random() * s); }
}
const C = {
  wood: canvasOf(512, 512, (g, w, h) => {
    for (let i = 0; i < 8; i++) {
      const y = i * 64, s = rnd(-18, 18);
      g.fillStyle = `rgb(${110 + s},${70 + s * 0.7},${42 + s * 0.5})`; g.fillRect(0, y, w, 64);
      for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(45,22,8,${rnd(0.05, 0.22)})`; g.beginPath(); const yy = y + rnd(0, 64); g.moveTo(0, yy); g.bezierCurveTo(w * 0.3, yy + rnd(-5, 5), w * 0.6, yy + rnd(-5, 5), w, yy + rnd(-3, 3)); g.stroke(); }
      g.fillStyle = 'rgba(25,12,5,.8)'; g.fillRect(0, y, w, 2); g.fillRect(rnd(0, w), y, 2, 64);
    }
  }),
  wall: canvasOf(256, 256, (g, w, h) => {
    g.fillStyle = '#cfc2a0'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 32) { g.fillStyle = 'rgba(120,90,60,.10)'; g.fillRect(x, 0, 12, h); g.fillStyle = 'rgba(140,60,50,.10)'; g.fillRect(x + 20, 0, 2, h); }
    for (let y = 16; y < h; y += 32) for (let x = 26; x < w; x += 32) { g.fillStyle = 'rgba(130,70,60,.18)'; g.beginPath(); g.arc(x - 10, y, 3, 0, 7); g.fill(); }
    speckle(g, w, h, 3000, 0.06);
  }),
  siding: canvasOf(256, 256, (g, w, h) => {
    g.fillStyle = '#7f8c99'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 32) { const gr = g.createLinearGradient(0, y, 0, y + 32); gr.addColorStop(0, 'rgba(255,255,255,.08)'); gr.addColorStop(0.85, 'rgba(0,0,0,.05)'); gr.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = gr; g.fillRect(0, y, w, 32); }
    speckle(g, w, h, 2500, 0.08);
  }),
  roof: canvasOf(256, 256, (g, w, h) => {
    g.fillStyle = '#2d2b2e'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 21) for (let x = (y / 21 % 2) * 16 - 16; x < w; x += 32) { const s = rnd(-10, 10); g.fillStyle = `rgb(${50 + s},${47 + s},${52 + s})`; g.fillRect(x + 1, y + 1, 30, 19); g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(x, y + 18, 32, 3); }
    speckle(g, w, h, 4000, 0.2, 1);
  }),
  grass: canvasOf(256, 256, (g, w, h) => {
    g.fillStyle = '#1d2a17'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `hsla(${rnd(80, 115)},${rnd(25, 45)}%,${rnd(8, 22)}%,.8)`; g.fillRect(rnd(0, w), rnd(0, h), 1, rnd(2, 5)); }
  }),
  asphalt: canvasOf(256, 256, (g, w, h) => { g.fillStyle = '#1f2022'; g.fillRect(0, 0, w, h); speckle(g, w, h, 12000, 0.25, 1.5); }),
  concrete: canvasOf(256, 256, (g, w, h) => { g.fillStyle = '#6f6d69'; g.fillRect(0, 0, w, h); speckle(g, w, h, 8000, 0.12); g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, 0, w, 2); g.fillRect(0, 0, 2, h); }),
  rug: canvasOf(256, 256, (g, w, h) => {
    g.fillStyle = '#6b1e1e'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9a25a'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28);
    g.strokeStyle = '#1f2c4a'; g.lineWidth = 10; g.strokeRect(30, 30, w - 60, h - 60);
    g.fillStyle = '#c9a25a'; g.save(); g.translate(w / 2, h / 2); g.rotate(Math.PI / 4); g.fillRect(-40, -40, 80, 80); g.fillStyle = '#1f2c4a'; g.fillRect(-22, -22, 44, 44); g.restore();
    speckle(g, w, h, 6000, 0.15, 1);
  }),
};
const MATS = {};
function tm(name, rx, ry, opts = {}) { const t = ctex(C[name], rx, ry); return new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, ...opts }); }
const std = (color, roughness = 0.7, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });

function box(parent, w, h, d, m, x, y, z, shadow = true) {
  const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); me.position.set(x, y, z);
  me.castShadow = me.receiveShadow = shadow; parent.add(me); return me;
}
function cyl(parent, rt, rb, h, m, x, y, z, seg = 16) {
  const me = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); me.position.set(x, y, z);
  me.castShadow = me.receiveShadow = true; parent.add(me); return me;
}
function plane(parent, w, h, m, x, y, z, ry = 0, rx = 0) {
  const me = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); me.position.set(x, y, z); me.rotation.set(rx, ry, 0);
  me.receiveShadow = true; parent.add(me); return me;
}

export function buildWorld(scene, renderer) {
  const W = {};
  scene.background = new THREE.Color(0x05070d);
  scene.fog = new THREE.Fog(0x05070d, 18, 80);

  // soft environment for PBR reflections
  const envScene = new THREE.Scene(); envScene.background = new THREE.Color(0x0a0d16);
  const eb = (c, s, x, y, z, k) => { const m = new THREE.Mesh(new THREE.BoxGeometry(...s), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) })); m.position.set(x, y, z); envScene.add(m); };
  eb(0xffc07a, [2, 2, 0.1], 0, 3, -6, 1.5); eb(0x6a7cff, [4, 1, 0.1], -5, 2, 5, 0.8); eb(0xffffff, [3, 0.1, 3], 0, 6, 0, 0.4);
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(envScene, 0.04).texture;

  const hemi = new THREE.HemisphereLight(0x5068a0, 0x1a1410, 0.35); scene.add(hemi);
  const moon = new THREE.DirectionalLight(0x8fa6ff, 0.35); moon.position.set(-20, 30, -25); scene.add(moon);
  const moonDisc = new THREE.Mesh(new THREE.CircleGeometry(3, 32), new THREE.MeshBasicMaterial({ color: 0xdfe6ff, fog: false }));
  moonDisc.position.set(-40, 45, -90); moonDisc.lookAt(0, 0, 0); scene.add(moonDisc);
  { // stars
    const n = 700, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), e = rnd(0.15, 1.4), r = 150; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x8890a8, size: 0.6, fog: false })));
  }

  // ---------- ground & street ----------
  const ground = plane(scene, 300, 300, tm('grass', 75, 75, { roughness: 1 }), 0, 0, 0, 0, -Math.PI / 2);
  plane(scene, 300, 7, tm('asphalt', 75, 1.75, { roughness: 0.28, metalness: 0.1 }), 0, 0.01, 19, 0, -Math.PI / 2);
  for (let x = -60; x < 60; x += 6) plane(scene, 2.5, 0.12, std(0xb59a3a, 0.5), x, 0.015, 19, 0, -Math.PI / 2);
  plane(scene, 300, 2.2, tm('concrete', 150, 1, { roughness: 0.5 }), 0, 0.02, 14.5, 0, -Math.PI / 2);
  plane(scene, 1.3, 13.4, tm('concrete', 1, 10, { roughness: 0.45 }), 0, 0.02, 6.9, 0, -Math.PI / 2);
  box(scene, 2.4, 0.14, 1.4, tm('concrete', 2, 1), 0, 0.07, 0.7);

  // ---------- house shell ----------
  const T = 0.15, H = HOUSE.h;
  const ext = () => tm('siding', 1, 1), intr = () => tm('wall', 1, 1);
  const wall = (x0, x1, y0, y1, z0, z1, extFace) => {
    const w = x1 - x0, h = y1 - y0, d = z1 - z0;
    const len = w > d ? w : d;
    const mats = [0, 1, 2, 3, 4, 5].map(i => i === extFace ? ext() : intr());
    mats.forEach(m => m.map.repeat.set(len, h));
    const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
    me.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); me.castShadow = me.receiveShadow = true; scene.add(me); return me;
  };
  // front (ext +z = face 4) with door hole
  wall(-5, -0.5, 0, H, -T, 0, 4); wall(0.5, 5, 0, H, -T, 0, 4); wall(-0.5, 0.5, 2.1, H, -T, 0, 4);
  // back (ext -z = face 5) with window hole x 1.4..2.6, y .95..2.15
  wall(-5, 1.4, 0, H, -7, -7 + T, 5); wall(2.6, 5, 0, H, -7, -7 + T, 5);
  wall(1.4, 2.6, 0, 0.95, -7, -7 + T, 5); wall(1.4, 2.6, 2.15, H, -7, -7 + T, 5);
  wall(-5, -5 + T, 0, H, -7, 0, 1); wall(5 - T, 5, 0, H, -7, 0, 0);
  plane(scene, 10, 7, tm('wood', 8, 6, { roughness: 0.45 }), 0, 0.003, -3.5, 0, -Math.PI / 2);
  plane(scene, 10, 7, std(0xd8d2c4, 0.95), 0, H - 0.01, -3.5, 0, Math.PI / 2);
  // baseboards
  const bb = std(0xe9e2d0, 0.5);
  box(scene, 9.7, 0.1, 0.02, bb, 0, 0.05, -6.84); box(scene, 0.02, 0.1, 6.7, bb, -4.84, 0.05, -3.5); box(scene, 0.02, 0.1, 6.7, bb, 4.84, 0.05, -3.5);
  // roof
  const a = Math.atan2(1.7, 3.5), sl = Math.hypot(1.7, 3.5) + 0.6;
  const rf = box(scene, 10.8, 0.08, sl, tm('roof', 10, 5, { roughness: 0.8 }), 0, H + 0.85 + 0.12, -1.75 + 0.25); rf.rotation.x = a;
  const rb = box(scene, 10.8, 0.08, sl, tm('roof', 10, 5, { roughness: 0.8 }), 0, H + 0.85 + 0.12, -5.25 - 0.25); rb.rotation.x = -a;
  for (const s of [1, -1]) {
    const sh = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(-7 * s, 0), new THREE.Vector2(-3.5 * s, 1.7)]);
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({ color: 0x74808c, roughness: 0.9, side: THREE.DoubleSide }));
    m.rotation.y = -s * Math.PI / 2; m.position.set(5 * s, H, 0); scene.add(m);
  }
  // door
  const door = new THREE.Group(); door.position.set(-0.5, 0, -0.06); scene.add(door);
  const doorMat = std(0x4a2515, 0.5);
  box(door, 1.0, 2.1, 0.05, doorMat, 0.5, 1.05, 0);
  for (const [y, hh] of [[1.55, 0.7], [0.55, 0.7]]) for (const x of [0.28, 0.72]) box(door, 0.3, hh, 0.07, std(0x3e1f11, 0.45), x, y, 0);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), std(0xc9a646, 0.25, { metalness: 1 }));
  knob.position.set(0.88, 1.0, 0.06); door.add(knob); const k2 = knob.clone(); k2.position.z = -0.06; door.add(k2);
  const trim = std(0xe9e6de, 0.5);
  box(scene, 0.08, 2.2, 0.06, trim, -0.54, 1.1, 0.02); box(scene, 0.08, 2.2, 0.06, trim, 0.54, 1.1, 0.02); box(scene, 1.16, 0.08, 0.06, trim, 0, 2.16, 0.02);
  W.door = door;
  // front windows (exterior, dark glass)
  const glass = new THREE.MeshStandardMaterial({ color: 0x0b1018, roughness: 0.05, metalness: 0.2 });
  for (const x of [-2.8, 2.8]) {
    plane(scene, 1.3, 1.1, glass, x, 1.55, 0.005);
    box(scene, 1.45, 0.08, 0.08, trim, x, 2.12, 0.03); box(scene, 1.5, 0.08, 0.14, trim, x, 0.98, 0.05);
    box(scene, 0.06, 1.1, 0.06, trim, x, 1.55, 0.02); box(scene, 0.06, 1.1, 0.06, trim, x - 0.68, 1.55, 0.02); box(scene, 0.06, 1.1, 0.06, trim, x + 0.68, 1.55, 0.02);
    box(scene, 0.45, 1.3, 0.04, std(0x1f3326, 0.6), x - 0.95, 1.55, 0.03); box(scene, 0.45, 1.3, 0.04, std(0x1f3326, 0.6), x + 0.95, 1.55, 0.03);
  }
  // back window: real glass
  const wglass = new THREE.MeshStandardMaterial({ color: 0x223044, roughness: 0.02, metalness: 0.1, transparent: true, opacity: 0.18 });
  plane(scene, 1.2, 1.2, wglass, 2.0, 1.55, -6.93);
  box(scene, 1.3, 0.06, 0.2, trim, 2.0, 0.95, -6.87); box(scene, 1.3, 0.05, 0.16, trim, 2.0, 2.15, -6.9);
  box(scene, 0.05, 1.2, 0.16, trim, 1.4, 1.55, -6.9); box(scene, 0.05, 1.2, 0.16, trim, 2.6, 1.55, -6.9);
  box(scene, 0.03, 1.2, 0.04, trim, 2.0, 1.55, -6.93); box(scene, 1.2, 0.03, 0.04, trim, 2.0, 1.55, -6.93);
  const curtain = std(0x5a2230, 0.95);
  for (const x of [1.2, 2.8]) { const c = box(scene, 0.35, 1.7, 0.04, curtain, x, 1.45, -6.78); c.scale.x = 1; }
  box(scene, 1.9, 0.03, 0.03, std(0x777777, 0.3, { metalness: 1 }), 2.0, 2.32, -6.78);

  // porch light
  const glowMats = [];
  const gm = (c, e, k) => { const m = new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: k }); m.userData.on = k; glowMats.push(m); return m; };
  box(scene, 0.14, 0.22, 0.1, gm(0xffe0a0, 0xffc070, 3), 0.85, 2.3, 0.08, false);
  const porch = new THREE.SpotLight(0xffc27a, 12, 12, 1.1, 0.7, 2); porch.position.set(0.85, 2.4, 0.4); porch.target.position.set(0, 0, 2.5);
  scene.add(porch, porch.target);

  // ---------- street lamps ----------
  const lampMat = std(0x2a2c30, 0.4, { metalness: 0.8 });
  const street = [];
  for (const [x, sh] of [[4.5, true], [-14, false], [24, false]]) {
    cyl(scene, 0.07, 0.1, 5.2, lampMat, x, 2.6, 14);
    box(scene, 0.08, 0.08, 1.4, lampMat, x, 5.15, 14.65);
    box(scene, 0.35, 0.12, 0.5, gm(0xfff1c9, 0xffd9a0, 4), x, 5.05, 15.3, false);
    const sl = new THREE.SpotLight(0xffd29a, 90, 30, 0.95, 0.6, 2); sl.position.set(x, 4.95, 15.3); sl.target.position.set(x, 0, 15.5);
    if (sh) { sl.castShadow = true; sl.shadow.mapSize.set(1024, 1024); sl.shadow.bias = -0.0005; }
    scene.add(sl, sl.target); street.push(sl);
  }
  // mailbox, trees, car
  cyl(scene, 0.04, 0.04, 1.1, std(0x3a3a3a), 1.3, 0.55, 13.4); box(scene, 0.22, 0.24, 0.48, std(0x223a66, 0.35, { metalness: 0.6 }), 1.3, 1.2, 13.4);
  const trunk = std(0x3a2a1c, 0.9), leaf = std(0x16261a, 0.9, { flatShading: true });
  for (const [x, z, s] of [[-7, 6, 1.1], [8, 8, 1.3], [-9, -4, 1.5], [10, -9, 1.4], [-11, 10, 1.2], [13, 4, 1]]) {
    cyl(scene, 0.12 * s, 0.18 * s, 2.4 * s, trunk, x, 1.2 * s, z, 8);
    for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(0.9, 1.4) * s, 0), leaf); m.position.set(x + rnd(-0.5, 0.5), (2.6 + i * 0.7) * s, z + rnd(-0.5, 0.5)); m.castShadow = true; scene.add(m); }
  }
  { const car = new THREE.Group(); car.position.set(-6, 0, 17.3); scene.add(car);
    const paint = std(0x5b1016, 0.25, { metalness: 0.6 });
    box(car, 4.2, 0.65, 1.7, paint, 0, 0.62, 0); box(car, 2.2, 0.55, 1.5, paint, -0.2, 1.2, 0);
    box(car, 2.0, 0.45, 1.52, new THREE.MeshStandardMaterial({ color: 0x0a0d12, roughness: 0.05, metalness: 0.5 }), -0.2, 1.2, 0);
    for (const [x, z] of [[1.3, 0.8], [-1.3, 0.8], [1.3, -0.8], [-1.3, -0.8]]) { const w = cyl(car, 0.33, 0.33, 0.22, std(0x111111, 0.9), x, 0.33, z); w.rotation.x = Math.PI / 2; }
    box(car, 0.05, 0.12, 0.3, new THREE.MeshStandardMaterial({ color: 0x400000, emissive: 0x300000 }), -2.1, 0.75, 0.6, false);
  }
  // neighbour houses
  const neighbourWindows = [];
  const winMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffb866, emissiveIntensity: 1.6 });
  for (const [x, z, ry] of [[-16, 30, Math.PI], [0, 31, Math.PI], [16, 30, Math.PI], [-17, -3, 0], [17, -3, 0]]) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    box(g, 8, 3, 7, tm('siding', 8, 3), 0, 1.5, 0);
    const r1 = box(g, 8.6, 0.1, 4.4, tm('roof', 8, 4), 0, 3.9, 1.8); r1.rotation.x = 0.5;
    const r2 = box(g, 8.6, 0.1, 4.4, tm('roof', 8, 4), 0, 3.9, -1.8); r2.rotation.x = -0.5;
    for (const wx of [-2.5, 2.5]) if (Math.random() < 0.8) neighbourWindows.push(plane(g, 1.1, 0.9, winMat, wx, 1.6, 3.51));
  }

  // ---------- rain ----------
  const RN = 2000, rp = new Float32Array(RN * 6), rv = new Float32Array(RN);
  const spawn = (i, top) => {
    let x, z; do { x = rnd(-25, 25); z = rnd(-30, 30); } while (x > -5.6 && x < 5.6 && z > -7.6 && z < 0.6);
    const y = top ? rnd(14, 18) : rnd(0, 18);
    rp.set([x, y, z, x + 0.05, y + 0.4, z], i * 6); rv[i] = rnd(11, 15);
  };
  for (let i = 0; i < RN; i++) spawn(i, false);
  const rgeo = new THREE.BufferGeometry(); rgeo.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const rain = new THREE.LineSegments(rgeo, new THREE.LineBasicMaterial({ color: 0x9aaccc, transparent: true, opacity: 0.35 }));
  rain.frustumCulled = false; scene.add(rain);

  // ---------- interior ----------
  const hall = std(0xe9e2d0, 0.5);
  plane(scene, 3, 2, new THREE.MeshStandardMaterial({ map: ctex(C.rug), roughness: 1 }), 0, 0.006, -3.6, 0, -Math.PI / 2);
  box(scene, 0.08, 0.12, 0.01, hall, 0.8, 1.2, -0.155); // light switch
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xf2eee4, 0.3, { side: THREE.DoubleSide }));
  dome.rotation.x = Math.PI; dome.position.set(0, H - 0.01, -3.5); scene.add(dome);

  // desk
  const deskMat = tm('wood', 1, 1, { roughness: 0.35, color: 0x9a7a60 });
  box(scene, 1.6, 0.04, 1.0, deskMat, 3.1, 0.73, -6.4);
  for (const [x, z] of [[2.35, -6.85], [2.35, -5.95]]) box(scene, 0.05, 0.71, 0.05, std(0x3a3530, 0.4), x, 0.355, z);
  box(scene, 0.42, 0.71, 0.95, deskMat, 3.65, 0.355, -6.4);
  box(scene, 0.38, 0.2, 0.01, std(0x6a5040, 0.5), 3.65, 0.55, -5.92); box(scene, 0.1, 0.02, 0.02, std(0xaaaaaa, 0.3, { metalness: 1 }), 3.65, 0.55, -5.905);
  // monitor
  const beige = std(0xd8cfb6, 0.55);
  const mon = new THREE.Group(); mon.position.set(3.1, 0.75, -6.34); scene.add(mon); W.retro = [mon];
  box(mon, 0.28, 0.03, 0.24, beige, 0, 0.015, -0.05); box(mon, 0.12, 0.06, 0.12, beige, 0, 0.06, -0.05);
  box(mon, 0.52, 0.42, 0.26, beige, 0, 0.3, 0); box(mon, 0.38, 0.32, 0.24, beige, 0, 0.29, -0.23);
  plane(mon, 0.42, 0.325, std(0x14130f, 0.4), 0, 0.3, 0.1305);
  W.screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.39, 0.2925), new THREE.MeshBasicMaterial());
  W.screenMesh.position.set(0, 0.3, 0.131); mon.add(W.screenMesh);
  W.monLed = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.004), new THREE.MeshBasicMaterial({ color: 0x113311 })); W.monLed.position.set(0.22, 0.115, 0.131); mon.add(W.monLed);
  box(mon, 0.02, 0.012, 0.01, std(0xbbb39c, 0.5), 0.19, 0.115, 0.13);
  { const c = canvasOf(64, 64, (g) => { g.fillStyle = '#f2e35c'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#233'; g.font = 'bold 15px Comic Sans MS, cursive'; g.fillText('Y2K', 8, 22); g.fillText('??!', 14, 44); });
    const n = plane(mon, 0.06, 0.06, new THREE.MeshStandardMaterial({ map: ctex(c), roughness: 0.9 }), -0.235, 0.47, 0.1315); n.rotation.z = 0.12; }
  // tower
  const tower = new THREE.Group(); tower.position.set(3.72, 0.75, -6.45); scene.add(tower); W.retro.push(tower);
  box(tower, 0.2, 0.44, 0.44, beige, 0, 0.22, 0);
  box(tower, 0.15, 0.04, 0.005, std(0xcfc6ae, 0.4), 0, 0.37, 0.221); box(tower, 0.15, 0.005, 0.005, std(0x222222), 0, 0.3, 0.221);
  box(tower, 0.1, 0.004, 0.004, std(0x111111), 0, 0.25, 0.222);
  W.powerBtn = box(tower, 0.03, 0.03, 0.01, std(0xbdb49a, 0.5), 0, 0.12, 0.222);
  W.pwrLed = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.006, 0.004), new THREE.MeshBasicMaterial({ color: 0x0a200a })); W.pwrLed.position.set(-0.04, 0.08, 0.222); tower.add(W.pwrLed);
  W.hddLed = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.006, 0.004), new THREE.MeshBasicMaterial({ color: 0x200505 })); W.hddLed.position.set(0.04, 0.08, 0.222); tower.add(W.hddLed);
  // speakers
  for (const x of [2.72, 3.47]) { W.retro.push(box(scene, 0.1, 0.17, 0.1, beige, x, 0.835, -6.4)); const sp = cyl(scene, 0.03, 0.03, 0.005, std(0x222222, 0.8), x, 0.86, -6.349); sp.rotation.x = Math.PI / 2; W.retro.push(sp); }
  // keyboard & mouse
  W.kbGroup = new THREE.Group(); W.kbGroup.position.set(3.1, 0.75, -5.99); scene.add(W.kbGroup);
  W.kb = new Keyboard3D(W.kbGroup);
  box(scene, 0.22, 0.003, 0.18, std(0x1d2b52, 0.9), 3.5, 0.7515, -6.0);
  W.mouse = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), beige); W.mouse.scale.set(0.028, 0.016, 0.05);
  W.mouse.position.set(3.5, 0.755, -6.0); W.mouse.castShadow = true; scene.add(W.mouse);
  // desk clutter
  const mug = cyl(scene, 0.04, 0.035, 0.1, std(0x1f4f7a, 0.3), 2.6, 0.8, -6.05);
  cyl(scene, 0.033, 0.033, 0.12, std(0xb01818, 0.25, { metalness: 0.8 }), 3.78, 0.81, -6.08);
  for (let i = 0; i < 4; i++) { const f = box(scene, 0.09, 0.003, 0.09, std([0x222222, 0x1b3d7a, 0x7a1b1b, 0x222222][i], 0.5), 2.55 + i * 0.012, 0.753 + i * 0.003, -6.25 + i * 0.01); f.rotation.y = rnd(-0.3, 0.3); W.retro.push(f); }
  // desk lamp
  const lamp = new THREE.Group(); lamp.position.set(2.5, 0.75, -6.62); scene.add(lamp); W.lampGroup = lamp;
  const lampM = std(0x1a4d2e, 0.35, { metalness: 0.5 });
  cyl(lamp, 0.07, 0.08, 0.02, lampM, 0, 0.01, 0);
  const arm = cyl(lamp, 0.01, 0.01, 0.55, lampM, 0.02, 0.28, 0.06); arm.rotation.x = 0.35;
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.14, 20, 1, true), std(0x1a4d2e, 0.35, { metalness: 0.5, side: THREE.DoubleSide }));
  shade.position.set(0.05, 0.55, 0.2); shade.rotation.set(0.6, 0, -0.35); lamp.add(shade);
  W.bulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffd9a0, emissiveIntensity: 0 }));
  W.bulb.position.set(0.055, 0.51, 0.23); lamp.add(W.bulb);
  const deskLight = new THREE.SpotLight(0xffc98a, 0, 6, 1.0, 0.55, 2);
  deskLight.position.set(2.56, 1.24, -6.38); deskLight.target.position.set(3.1, 0.75, -6.0);
  deskLight.castShadow = true; deskLight.shadow.mapSize.set(1024, 1024); deskLight.shadow.bias = -0.0003; deskLight.shadow.camera.near = 0.05;
  scene.add(deskLight, deskLight.target);
  const deskFill = new THREE.PointLight(0xffb070, 0, 5, 2); deskFill.position.set(2.6, 1.3, -6.2); scene.add(deskFill);
  // monitor glow
  W.glow = new THREE.PointLight(0x7090ff, 0, 3, 2); W.glow.position.set(3.1, 1.05, -5.95); scene.add(W.glow);
  // chair
  const chair = new THREE.Group(); chair.position.set(3.1, 0, -5.25); scene.add(chair);
  const fabric = std(0x2b2f3a, 0.95);
  for (let i = 0; i < 5; i++) { const l = box(chair, 0.32, 0.03, 0.04, std(0x222222, 0.4), 0, 0.06, 0); l.rotation.y = i * 1.2566; l.position.set(Math.cos(i * 1.2566) * 0.16, 0.06, -Math.sin(i * 1.2566) * 0.16); }
  cyl(chair, 0.025, 0.025, 0.36, std(0x555555, 0.3, { metalness: 1 }), 0, 0.26, 0);
  box(chair, 0.48, 0.08, 0.46, fabric, 0, 0.47, 0); box(chair, 0.44, 0.55, 0.07, fabric, 0, 0.83, 0.23);
  // poster
  const poster = canvasOf(256, 360, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a0500'); gr.addColorStop(1, '#a52300'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffb400'; g.font = 'bold 58px Impact, sans-serif'; g.textAlign = 'center'; g.fillText('DOOMED', w / 2, 72);
    g.fillStyle = '#000'; g.beginPath(); g.moveTo(40, h); g.lineTo(128, 150); g.lineTo(216, h); g.fill();
    g.fillStyle = '#f33'; g.beginPath(); g.arc(108, 200, 6, 0, 7); g.arc(148, 200, 6, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.font = '14px Arial'; g.fillText('THEY KNOW WHERE YOU LIVE', w / 2, h - 16);
  });
  plane(scene, 0.5, 0.7, new THREE.MeshStandardMaterial({ map: ctex(poster), roughness: 0.6 }), 4.35, 1.7, -6.84);
  const poster2 = canvasOf(256, 180, (g, w, h) => { g.fillStyle = '#101830'; g.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { g.fillStyle = `hsl(${rnd(180, 320)},80%,60%)`; g.fillRect(rnd(0, w), rnd(0, h), 2, 2); } g.fillStyle = '#6ef'; g.font = 'bold 34px Arial'; g.fillText('THE NET', 40, 100); g.font = '13px Arial'; g.fillText('log on. tune in.', 70, 130); });
  plane(scene, 0.8, 0.56, new THREE.MeshStandardMaterial({ map: ctex(poster2), roughness: 0.6 }), 4.84, 1.7, -3.3, -Math.PI / 2);
  // bed & shelf
  box(scene, 1.0, 0.3, 2.0, std(0x4a3222, 0.6), 4.3, 0.15, -3.3); box(scene, 0.96, 0.18, 1.96, std(0xdedad0, 0.9), 4.3, 0.39, -3.3);
  box(scene, 0.98, 0.1, 1.4, std(0x28406a, 0.95), 4.3, 0.5, -3.0); box(scene, 0.6, 0.12, 0.35, std(0xf2f0ea, 0.95), 4.3, 0.53, -4.05);
  box(scene, 1.0, 0.8, 0.06, std(0x4a3222, 0.6), 4.3, 0.4, -4.33);
  const shelf = new THREE.Group(); shelf.position.set(4.62, 0, -5.35); scene.add(shelf);
  const sw = std(0x6d5038, 0.6);
  box(shelf, 0.36, 1.8, 0.02, sw, 0, 0.9, -0.45); box(shelf, 0.36, 1.8, 0.02, sw, 0, 0.9, 0.45); box(shelf, 0.02, 1.8, 0.9, sw, 0.17, 0.9, 0);
  for (let s = 0; s < 5; s++) {
    box(shelf, 0.36, 0.02, 0.9, sw, 0, 0.02 + s * 0.42, 0);
    if (s < 4) for (let z = -0.42; z < 0.4;) { const bw = rnd(0.025, 0.06), bh = rnd(0.2, 0.34); box(shelf, 0.25, bh, bw, std(new THREE.Color().setHSL(Math.random(), 0.45, 0.3), 0.8), -0.02, 0.03 + s * 0.42 + bh / 2, z + bw / 2, false); z += bw + 0.004; }
  }
  // wall clock
  const clockFace = canvasOf(128, 128, (g) => { g.fillStyle = '#f4f0e6'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.fillStyle = '#222'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillRect(64 + Math.sin(a) * 52 - 2, 64 - Math.cos(a) * 52 - 2, 4, 4); } });
  const clock = new THREE.Group(); clock.position.set(-0.4, 2.05, -6.84); scene.add(clock);
  cyl(clock, 0.17, 0.17, 0.04, std(0x2b1d12, 0.5), 0, 0, 0).rotation.x = Math.PI / 2;
  plane(clock, 0.3, 0.3, new THREE.MeshStandardMaterial({ map: ctex(clockFace), roughness: 0.5, transparent: true }), 0, 0, 0.021);
  const hand = (len, w) => { const g = new THREE.Group(); g.position.z = 0.025; const m = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.004), std(0x111111, 0.4)); m.position.y = len / 2 - 0.01; g.add(m); clock.add(g); return g; };
  const hH = hand(0.08, 0.012), mH = hand(0.12, 0.008);
  // TV corner
  box(scene, 1.0, 0.5, 0.45, std(0x2b2018, 0.5), -3, 0.25, -6.6);
  box(scene, 0.62, 0.48, 0.45, std(0x1b1b1d, 0.4), -3, 0.74, -6.6);
  box(scene, 0.42, 0.08, 0.3, std(0x1b1b1d, 0.4), -3, 0.54, -6.62 + 0.05).visible = false;
  const tvC = canvasOf(256, 192, () => {}); const tvT = ctex(tvC);
  const tvScreen = plane(scene, 0.5, 0.375, new THREE.MeshBasicMaterial({ map: tvT }), -3, 0.75, -6.374);
  box(scene, 0.44, 0.08, 0.3, std(0x151515, 0.4), -3, 0.54, -6.55);
  const vcr = canvasOf(64, 16, (g) => { g.fillStyle = '#000'; g.fillRect(0, 0, 64, 16); g.fillStyle = '#3f8'; g.font = 'bold 13px monospace'; g.fillText('12:00', 12, 13); });
  const vcrM = plane(scene, 0.08, 0.02, new THREE.MeshBasicMaterial({ map: ctex(vcr), transparent: true }), -2.87, 0.54, -6.399);
  const tvLight = new THREE.PointLight(0x88a0ff, 1.2, 5, 2); tvLight.position.set(-3, 0.9, -6.0); scene.add(tvLight);
  // couch
  const couch = new THREE.Group(); couch.position.set(-3, 0, -3.8); scene.add(couch);
  const cf = std(0x5c4a3a, 0.95);
  box(couch, 1.9, 0.42, 0.85, cf, 0, 0.21, 0); box(couch, 1.9, 0.5, 0.2, cf, 0, 0.6, 0.33);
  box(couch, 0.18, 0.6, 0.85, cf, -0.95, 0.3, 0); box(couch, 0.18, 0.6, 0.85, cf, 0.95, 0.3, 0);
  box(couch, 0.4, 0.3, 0.12, std(0x8a3a2a, 0.95), -0.55, 0.55, 0.2);
  // xmas tree
  const tree = new THREE.Group(); tree.position.set(-4.2, 0, -1.0); scene.add(tree); W.tree = tree;
  cyl(tree, 0.2, 0.25, 0.25, std(0x7a1c1c, 0.8), 0, 0.12, 0);
  for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.62 - i * 0.13, 0.6, 10), std(0x173a22, 0.9, { flatShading: true })); c.position.y = 0.55 + i * 0.35; c.castShadow = true; tree.add(c); }
  const bulbs = [];
  for (let i = 0; i < 36; i++) {
    const y = rnd(0.35, 1.7), r = (1.9 - y) * 0.36 + 0.04, a = rnd(0, 6.28);
    const col = [0xff3030, 0x30ff50, 0x3080ff, 0xffd030, 0xff40ff][i % 5];
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 4), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 2 }));
    m.position.set(Math.cos(a) * r, y, Math.sin(a) * r); tree.add(m); bulbs.push(m);
  }
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.07), new THREE.MeshStandardMaterial({ color: 0xffe070, emissive: 0xffd040, emissiveIntensity: 2 })); star.position.y = 1.95; tree.add(star);
  const treeLight = new THREE.PointLight(0xff9060, 0.8, 4, 2); treeLight.position.set(-4.0, 1.1, -1.0); scene.add(treeLight);

  // ---------- lightning & fireworks ----------
  const flashLight = new THREE.DirectionalLight(0xc8d4ff, 0); flashLight.position.set(5, 20, -30); scene.add(flashLight);
  const fwLight = new THREE.PointLight(0xffffff, 0, 30, 1.5); fwLight.position.set(1.5, 4, -10); scene.add(fwLight);
  const FW = 1200, fp = new Float32Array(FW * 3), fc = new Float32Array(FW * 3), fv = new Float32Array(FW * 3), fl = new Float32Array(FW), fbase = new Float32Array(FW * 3);
  const fgeo = new THREE.BufferGeometry(); fgeo.setAttribute('position', new THREE.BufferAttribute(fp, 3)); fgeo.setAttribute('color', new THREE.BufferAttribute(fc, 3));
  const fpts = new THREE.Points(fgeo, new THREE.PointsMaterial({ size: 1.1, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  fpts.frustumCulled = false; scene.add(fpts);
  let fwi = 0;
  const burstAt = (x, y, z) => {
    const col = new THREE.Color().setHSL(Math.random(), 1, 0.6);
    for (let i = 0; i < 100; i++) {
      const k = fwi++ % FW, u = rnd(-1, 1), th = rnd(0, 6.28), s = Math.sqrt(1 - u * u), sp = rnd(6, 9);
      fp.set([x, y, z], k * 3); fv.set([s * Math.cos(th) * sp, u * sp, s * Math.sin(th) * sp], k * 3); fl[k] = rnd(1.6, 2.4);
      fbase.set([col.r, col.g, col.b], k * 3);
    }
    fwLight.color.copy(col); fwLight.intensity = 70;
  };

  // ---------- state & update ----------
  let power = true, lampOn = false, lightningT = 8, flashV = 0, fwOn = false, fwT = 0;
  const tvDraw = (t, clockSec) => {
    const g = tvC.getContext('2d'), w = 256, h = 192;
    if (!power) { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); tvT.needsUpdate = true; return; }
    const after = clockSec < 12 * 3600;
    g.fillStyle = '#0a0d24'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 160; i++) { g.fillStyle = `hsl(${(i * 37) % 360},60%,${20 + (i % 5) * 6}%)`; g.fillRect((i * 53) % w, 120 + ((i * 17) % 70) + Math.sin(t * 6 + i) * 2, 4, 6); }
    if (!after) {
      const left = Math.max(0, 24 * 3600 - clockSec), by = 30 + Math.min(1, 1 - left / 60) * 50;
      g.fillStyle = '#555'; g.fillRect(126, 20, 4, 100);
      g.fillStyle = '#fff'; g.shadowColor = '#8cf'; g.shadowBlur = 20; g.beginPath(); g.arc(128, by, 14, 0, 7); g.fill(); g.shadowBlur = 0;
      g.fillStyle = '#fff'; g.font = 'bold 30px Arial'; g.textAlign = 'center';
      const m = Math.floor(left / 60), s = Math.floor(left % 60);
      g.fillText(left < 60 ? String(s) : `${m}:${String(s).padStart(2, '0')}`, 128, 110 + (left < 60 ? 20 : 0));
    } else {
      g.fillStyle = `hsl(${t * 90 % 360},90%,60%)`; g.font = 'bold 44px Impact, Arial'; g.textAlign = 'center'; g.fillText('2000', 128, 90);
      for (let i = 0; i < 40; i++) { g.fillStyle = `hsl(${i * 40},90%,60%)`; g.fillRect((i * 71 + t * 40) % w, (i * 29 + t * 90) % 120, 3, 3); }
    }
    g.fillStyle = '#b00'; g.fillRect(0, 168, w, 24); g.fillStyle = '#fff'; g.font = 'bold 13px Arial'; g.textAlign = 'left';
    g.fillText('LIVE  •  MILLENNIUM EVE  •  Y2K: EXPERTS "CAUTIOUSLY OPTIMISTIC"  •  ', 256 - (t * 50 % 700), 185);
    for (let y = 0; y < h; y += 2) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, y, w, 1); }
    tvT.needsUpdate = true;
  };
  let frame = 0;
  W.update = (dt, t, clockSec, busy) => {
    frame++;
    // rain
    for (let i = 0; i < RN; i++) {
      const o = i * 6, v = rv[i] * dt;
      rp[o + 1] -= v; rp[o + 4] -= v; rp[o] -= v * 0.05; rp[o + 3] -= v * 0.05;
      if (rp[o + 1] < 0) spawn(i, true);
    }
    rgeo.attributes.position.needsUpdate = true;
    // lightning
    lightningT -= dt;
    if (lightningT < 0 && !W.calm) { lightningT = rnd(14, 30); flashV = 1; W.onThunder && W.onThunder(); }
    flashV = Math.max(0, flashV - dt * 2.2);
    const fl2 = flashV * (0.6 + 0.4 * Math.sin(t * 70));
    flashLight.intensity = fl2 * 4; scene.background.setRGB(0.02 + fl2 * 0.25, 0.027 + fl2 * 0.27, 0.05 + fl2 * 0.35);
    // xmas / clock / tv / leds
    bulbs.forEach((b, i) => b.material.emissiveIntensity = power ? (Math.sin(t * 2 + i * 1.7) > 0 ? 2.5 : 0.2) : 0);
    star.material.emissiveIntensity = power ? 2 : 0;
    treeLight.intensity = power && W.tree.visible ? 0.6 + 0.3 * Math.sin(t * 2) : 0;
    const cs = clockSec % 43200;
    mH.rotation.z = -(cs % 3600) / 3600 * Math.PI * 2; hH.rotation.z = -cs / 43200 * Math.PI * 2;
    if (frame % 3 === 0) { if (W.tvOverride) { W.tvOverride(tvC.getContext('2d'), t); tvT.needsUpdate = true; } else tvDraw(t, clockSec); }
    tvLight.intensity = power ? 0.8 + Math.random() * 0.4 : 0;
    vcrM.visible = power && Math.sin(t * 3) > 0;
    W.hddLed.material.color.setHex(busy && Math.random() < 0.5 ? 0xff2a1a : 0x200505);
    // fireworks
    if (fwOn) { fwT -= dt; if (fwT < 0) { fwT = rnd(0.3, 1.1); burstAt(rnd(-30, -6), rnd(9, 20), rnd(-45, -30)); W.onPop && W.onPop(); } }
    for (let k = 0; k < FW; k++) {
      if (fl[k] <= 0) continue;
      fl[k] -= dt; const o = k * 3;
      fv[o + 1] -= 4 * dt; fv[o] *= 0.985; fv[o + 1] *= 0.985; fv[o + 2] *= 0.985;
      fp[o] += fv[o] * dt; fp[o + 1] += fv[o + 1] * dt; fp[o + 2] += fv[o + 2] * dt;
      const a = Math.max(0, Math.min(1, fl[k] / 1.2)) * (Math.random() < 0.9 ? 1 : 2);
      fc[o] = fbase[o] * a; fc[o + 1] = fbase[o + 1] * a; fc[o + 2] = fbase[o + 2] * a;
      if (fl[k] <= 0) { fc[o] = fc[o + 1] = fc[o + 2] = 0; }
    }
    fgeo.attributes.position.needsUpdate = fgeo.attributes.color.needsUpdate = true;
    fwLight.intensity *= Math.pow(0.02, dt);
  };
  const applyLamp = () => {
    const on = lampOn && power;
    deskLight.intensity = on ? 9 : 0; deskFill.intensity = on ? 0.9 : 0; W.bulb.material.emissiveIntensity = on ? 4 : 0;
  };
  W.setLamp = (v) => { lampOn = v; applyLamp(); };
  W.setPower = (v) => {
    power = v; applyLamp();
    porch.intensity = v ? 12 : 0; street.forEach(s => s.intensity = v ? 90 : 0);
    winMat.emissiveIntensity = v ? 1.6 : 0;
    glowMats.forEach(m => m.emissiveIntensity = v ? m.userData.on : 0);
  };
  W.flash = () => { flashV = 1; };
  W.fireworks = (v) => { fwOn = v; };
  W.burst = burstAt;
  W.isInside = (p) => p.x > -5 && p.x < 5 && p.z > -7 && p.z < -0.1;
  W.screenWorld = new THREE.Vector3(); W.screenMesh.getWorldPosition(W.screenWorld);
  return W;
}

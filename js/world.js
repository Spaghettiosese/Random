import { THREE, G, mat, basic, addCollider, clearLevel, onUpdate, player } from './engine.js';
import { T, skyDome, canvasTex } from './textures.js';
import { makeMoonkai } from './characters.js';

// ---------------------------------------------------------------------------
// Building helpers
// ---------------------------------------------------------------------------
const root = () => G.levelRoot;
export function put(obj, x = 0, y = 0, z = 0, parent) { obj.position.set(x, y, z); (parent || root()).add(obj); return obj; }

function boxGeo(w, h, d, tile) {
  const geo = new THREE.BoxGeometry(w, h, d);
  if (tile) {
    const uv = geo.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
      const k = f * 4 + i; uv.setXY(k, uv.getX(k) * dims[f][0] / tile, uv.getY(k) * dims[f][1] / tile);
    }
  }
  return geo;
}
// y is the bottom of the box
export function block(w, h, d, m, x, y, z, { collide = true, tile = 0, parent } = {}) {
  const mesh = new THREE.Mesh(boxGeo(w, h, d, tile), m);
  put(mesh, x, y + h / 2, z, parent);
  if (collide) mesh.userData.collider = addCollider(x - w / 2, z - d / 2, x + w / 2, z + d / 2);
  return mesh;
}
export function floor(x0, z0, x1, z1, y, m, tile = 1, down = false) {
  const w = x1 - x0, d = z1 - z0;
  const geo = new THREE.PlaneGeometry(w, d);
  if (tile) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / tile, uv.getY(i) * d / tile); }
  const mesh = new THREE.Mesh(geo, m);
  mesh.rotation.x = down ? Math.PI / 2 : -Math.PI / 2;
  put(mesh, (x0 + x1) / 2, y, (z0 + z1) / 2);
  return mesh;
}
export function panel(w, h, m, x, y, z, rotY = 0, parent) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  mesh.rotation.y = rotY; put(mesh, x, y, z, parent); return mesh;
}
// Rooms: walls with door/window gaps. doors: { n:[{c,w,y0,y1}], s, e, w }, skip: ['n',...]
export function room({ x0, z0, x1, z1, h = 3.2, floorM, wallM, ceilM, doors = {}, skip = [], tileF = 1, tileW = 1.6, tileC = 1.2, t = 0.2 }) {
  if (floorM) floor(x0, z0, x1, z1, 0, floorM, tileF);
  if (ceilM) floor(x0, z0, x1, z1, h, ceilM, tileC, true);
  const sides = {
    n: { a: x0, b: x1, fixed: z0, alongX: true }, s: { a: x0, b: x1, fixed: z1, alongX: true },
    w: { a: z0, b: z1, fixed: x0, alongX: false }, e: { a: z0, b: z1, fixed: x1, alongX: false },
  };
  const out = {};
  for (const k of Object.keys(sides)) {
    if (skip.includes(k)) continue;
    const s = sides[k];
    const gaps = (doors[k] || []).map(d => ({ a: d.c - d.w / 2, b: d.c + d.w / 2, y0: d.y0 || 0, y1: d.y1 || 2.3 })).sort((p, q) => p.a - q.a);
    let cur = s.a;
    const seg = (a, b, y0, y1) => {
      if (b - a < 0.01 || y1 - y0 < 0.01) return;
      const len = b - a, mid = (a + b) / 2;
      if (s.alongX) block(len, y1 - y0, t, wallM, mid, y0, s.fixed, { tile: tileW, collide: y0 < 1.5 });
      else block(t, y1 - y0, len, wallM, s.fixed, y0, mid, { tile: tileW, collide: y0 < 1.5 });
    };
    for (const gp of gaps) {
      seg(cur, gp.a, 0, h);
      seg(gp.a, gp.b, 0, gp.y0);       // sill
      seg(gp.a, gp.b, gp.y1, h);       // header
      cur = gp.b;
    }
    seg(cur, s.b, 0, h);
    out[k] = s;
  }
  return out;
}
export function pointLight(x, y, z, color = 0xffffff, intensity = 3, dist = 14) {
  const l = new THREE.PointLight(color, intensity, dist, 1.3); put(l, x, y, z); return l;
}
function lamp(x, y, z, w = 1.2, d = 0.4) { // fluorescent ceiling panel
  const m = basic({ color: 0xf4f6ee });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), m); put(mesh, x, y - 0.03, z);
  return mesh;
}
function glass(w, h, x, y, z, rotY = 0, color = 0x9fb8c8, opacity = 0.18) {
  const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide });
  return panel(w, h, m, x, y, z, rotY);
}
function frameAround(w, h, x, y, z, alongX, m) { // window frame (4 thin bars)
  const tk = 0.06;
  if (alongX) {
    block(w, tk, 0.24, m, x, y - h / 2 - tk, z, { collide: false }); block(w, tk, 0.24, m, x, y + h / 2, z, { collide: false });
    block(tk, h, 0.24, m, x, y - h / 2, z, { collide: false });
  } else {
    block(0.24, tk, w, m, x, y - h / 2 - tk, z, { collide: false }); block(0.24, tk, w, m, x, y + h / 2, z, { collide: false });
    block(0.24, h, tk, m, x, y - h / 2, z, { collide: false });
  }
}
function sign(tex, w, h, x, y, z, rotY = 0) { return panel(w, h, basic({ map: tex }), x, y, z, rotY); }

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
const M = {};
function mats() {
  Object.assign(M, {
    desk: mat({ color: '#b98d5a', map: T.wood('#b98d5a') }), metal: mat({ color: '#6c7178' }), chair: mat({ color: '#2f4f7a' }),
    table: mat({ color: '#d8d2c0' }), bench: mat({ color: '#4d6b8a' }), dark: mat({ color: '#1b1b1f' }), white: mat({ color: '#e9e6dd' }),
    orange: mat({ color: '#e0661e' }), red: mat({ color: '#9b2226' }), black: basic({ color: 0x050505 }), trunk: mat({ color: '#4a3526' }),
    leaves: mat({ color: '#3f6a2e' }), leavesDark: mat({ color: '#223a1c' }), couch: mat({ color: '#6b4a32', map: T.fabric('#6b4a32') }),
    woodDark: mat({ color: '#4a2f1d', map: T.wood('#4a2f1d') }), carBody: mat({ color: '#7d8a99' }), tire: mat({ color: '#111' }),
    chrome: mat({ color: '#c9ccd1' }), bed: mat({ color: '#2d4e7a', map: T.fabric('#2d4e7a') }), pillow: mat({ color: '#e8e3d6' }),
    fridge: mat({ color: '#dcdcd8' }), counter: mat({ color: '#6b6258' }), brass: mat({ color: '#9a7a3a' }), fur: mat({ color: '#2a1d18', map: T.fur() }),
  });
}
export function desk(x, z, rotY = 0) {
  const g = new THREE.Group(); put(g, x, 0, z); g.rotation.y = rotY;
  block(0.7, 0.05, 0.5, M.desk, 0, 0.7, 0, { collide: false, parent: g });
  for (const [a, b] of [[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]]) block(0.04, 0.7, 0.04, M.metal, a, 0, b, { collide: false, parent: g });
  block(0.42, 0.04, 0.4, M.chair, 0, 0.42, 0.45, { collide: false, parent: g });
  block(0.42, 0.4, 0.04, M.chair, 0, 0.46, 0.66, { collide: false, parent: g });
  for (const [a, b] of [[-0.18, 0.28], [0.18, 0.28], [-0.18, 0.62], [0.18, 0.62]]) block(0.03, 0.42, 0.03, M.metal, a, 0, b, { collide: false, parent: g });
  const c = Math.abs(Math.sin(rotY)) > 0.5;
  addCollider(x - (c ? 0.5 : 0.38), z - (c ? 0.38 : 0.5), x + (c ? 0.5 : 0.38), z + (c ? 0.38 : 0.5));
  return g;
}
export function tree(x, z, s = 1, dark = false) {
  block(0.3 * s, 2 * s, 0.3 * s, M.trunk, x, 0, z, { collide: true });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.6 * s, 3.2 * s, 6), dark ? M.leavesDark : M.leaves); put(cone, x, 3.2 * s, z);
  const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.2 * s, 2.4 * s, 6), dark ? M.leavesDark : M.leaves); put(cone2, x, 4.4 * s, z);
}
export function car(x, z, rotY = 0, color = '#7d8a99') {
  const g = new THREE.Group(); put(g, x, 0, z); g.rotation.y = rotY;
  const body = mat({ color });
  block(1.8, 0.7, 4.2, body, 0, 0.35, 0, { collide: false, parent: g });
  block(1.6, 0.6, 2.2, body, 0, 1.05, -0.2, { collide: false, parent: g });
  const win = basic({ color: 0x1c2630 });
  panel(1.5, 0.5, win, 0, 1.35, 0.91, 0, g).rotation.x = -0.3;
  panel(1.5, 0.5, win, 0, 1.35, -1.31, Math.PI, g).rotation.x = -0.3;
  for (const sx of [-1, 1]) { const p = panel(2.0, 0.45, win, sx * 0.81, 1.36, -0.2, sx * Math.PI / 2, g); }
  for (const [a, b] of [[-0.85, 1.3], [0.85, 1.3], [-0.85, -1.3], [0.85, -1.3]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 8), M.tire); w.rotation.z = Math.PI / 2; put(w, a, 0.34, b, g);
  }
  panel(0.3, 0.12, basic({ color: 0xfff2c0 }), -0.6, 0.6, 2.11, 0, g); panel(0.3, 0.12, basic({ color: 0xfff2c0 }), 0.6, 0.6, 2.11, 0, g);
  panel(0.3, 0.12, basic({ color: 0xaa1111 }), -0.6, 0.6, -2.11, Math.PI, g); panel(0.3, 0.12, basic({ color: 0xaa1111 }), 0.6, 0.6, -2.11, Math.PI, g);
  const c = Math.abs(Math.sin(rotY)) > 0.5;
  addCollider(x - (c ? 2.1 : 0.95), z - (c ? 0.95 : 2.1), x + (c ? 2.1 : 0.95), z + (c ? 0.95 : 2.1));
  return g;
}
export function hoop(x, z, facing) { // facing: +1 faces +x, -1 faces -x
  const g = new THREE.Group(); put(g, x, 0, z);
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.05, 1.8), M.white); put(board, 0, 3.4, 0, g);
  const sq = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.45), basic({ color: 0xc03030 })); sq.rotation.y = facing * Math.PI / 2; put(sq, facing * 0.03, 3.3, 0, g);
  const sq2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), basic({ color: 0xffffff })); sq2.rotation.y = facing * Math.PI / 2; put(sq2, facing * 0.035, 3.3, 0, g);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 4, 12), M.orange); rim.rotation.x = Math.PI / 2; put(rim, facing * 0.3, 3.05, 0, g);
  const net = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.15, 0.4, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.6 }));
  put(net, facing * 0.3, 2.83, 0, g);
  block(0.12, 3.9, 0.12, M.metal, -facing * 0.1, 0, 0, { collide: false, parent: g }).position.x = -facing * 0.05;
  return { group: g, rim: new THREE.Vector3(x + facing * 0.3, 3.05, z), boardX: x + facing * 0.03, net };
}
function couch(x, z, rotY, len = 2.2) {
  const g = new THREE.Group(); put(g, x, 0, z); g.rotation.y = rotY;
  block(len, 0.45, 0.9, M.couch, 0, 0, 0, { collide: false, parent: g });
  block(len, 0.5, 0.25, M.couch, 0, 0.45, -0.33, { collide: false, parent: g });
  block(0.22, 0.3, 0.9, M.couch, -len / 2 + 0.11, 0.45, 0, { collide: false, parent: g });
  block(0.22, 0.3, 0.9, M.couch, len / 2 - 0.11, 0.45, 0, { collide: false, parent: g });
  const c = Math.abs(Math.sin(rotY)) > 0.5;
  addCollider(x - (c ? 0.45 : len / 2), z - (c ? len / 2 : 0.45), x + (c ? 0.45 : len / 2), z + (c ? len / 2 : 0.45));
}
function lockerRow(x0, x1, z, dir) { // dir: +1 faces +z
  const m = mat({ map: T.lockers() });
  const len = x1 - x0;
  const geo = boxGeo(len, 2, 0.35, 1);
  const mesh = new THREE.Mesh(geo, m); put(mesh, (x0 + x1) / 2, 1, z + dir * 0.28);
  addCollider(x0, z + dir * 0.1, x1, z + dir * 0.46);
  return mesh;
}
export function makeBall(r = 0.12) {
  const tex = canvasTex('ball', 32, 32, (g) => { g.fillStyle = '#d2651e'; g.fillRect(0, 0, 32, 32); g.fillStyle = '#2a1204'; g.fillRect(0, 15, 32, 2); g.fillRect(15, 0, 2, 32); g.fillRect(7, 0, 1, 32); g.fillRect(24, 0, 1, 32); });
  return new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), mat({ map: tex }));
}
export function banana() {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 4, 6, Math.PI * 0.8), mat({ color: '#e8cf3a' }));
  g.add(m); return g;
}
export function bananaPeel(x, z, rot = 0) {
  const g = new THREE.Group(); put(g, x, 0.01, z); g.rotation.y = rot;
  const m = mat({ color: '#d6b92f' });
  for (let i = 0; i < 4; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.01, 0.16), m); p.rotation.y = i * Math.PI / 2; p.position.set(Math.sin(i * Math.PI / 2) * 0.07, 0, Math.cos(i * Math.PI / 2) * 0.07); g.add(p); }
  return g;
}
export function threadPiece(x, y, z) {
  const g = new THREE.Group(); put(g, x, y, z);
  const t = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 4, 10, Math.PI * 1.3), basic({ color: 0xff2222 }));
  g.add(t);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3030, transparent: true, opacity: 0.18, depthWrite: false }));
  g.add(glow);
  const l = new THREE.PointLight(0xff2020, 1.2, 3, 1.5); g.add(l);
  onUpdate(dt => { g.rotation.y += dt * 1.5; t.position.y = Math.sin(G.time * 2) * 0.04; glow.scale.setScalar(1 + Math.sin(G.time * 3) * 0.15); });
  return g;
}
export function notePaper(x, y, z, rotY = 0) {
  const m = panel(0.22, 0.28, basic({ map: T.note(), side: THREE.DoubleSide }), x, y, z, rotY);
  m.rotation.x = -Math.PI / 2; m.rotation.z = rotY;
  return m;
}

// ---------------------------------------------------------------------------
// Lighting presets
// ---------------------------------------------------------------------------
function lighting(kind) {
  const add = l => { root().add(l); return l; };
  const P = {
    day: { amb: [0xfff4e0, 1.25], hemi: [0xdfefff, 0x6a5a48, 0.9], fog: [0xcfd8e0, 30, 140], bg: 0xb9d3ea, sky: ['#6aa0d8', '#a8c8e6', '#e7eef2'] },
    overcast: { amb: [0xe6e8ec, 1.0], hemi: [0xc8d0dc, 0x4a4540, 0.7], fog: [0x9aa3ab, 20, 110], bg: 0x9aa3ab, sky: ['#6e7680', '#9aa3ab', '#b6bcc2'] },
    dim: { amb: [0xd8d4c8, 0.6], hemi: [0x8c9098, 0x302824, 0.45], fog: [0x5d5a58, 10, 70], bg: 0x4e4d52, sky: ['#3c3b44', '#6a5a5a', '#8a6a5a'] },
    dusk: { amb: [0xffc8a0, 0.55], hemi: [0xff9a6a, 0x2a1a2a, 0.5], fog: [0x6a3a3a, 14, 90], bg: 0x5a2e36, sky: ['#1d1a3a', '#8a3a4a', '#e0784a'] },
    evening: { amb: [0xffd9b0, 0.35], hemi: [0x6a5a7a, 0x201810, 0.3], fog: [0x100c10, 12, 60], bg: 0x0a0a14, sky: ['#05060f', '#141a33', '#2a2440'] },
    night: { amb: [0x6070a0, 0.28], hemi: [0x303a60, 0x080608, 0.25], fog: [0x020206, 4, 34], bg: 0x010103, sky: ['#000003', '#05060f', '#0b0c18'] },
    dream: { amb: [0xff6060, 0.35], hemi: [0xff3030, 0x100000, 0.4], fog: [0x2a0000, 6, 60], bg: 0x1a0000, sky: ['#000', '#3a0000', '#7a1010'] },
    dawn: { amb: [0xffe0c0, 1.0], hemi: [0xffd0a0, 0x4a3a40, 0.8], fog: [0xf0c8a0, 25, 140], bg: 0xf0c0a0, sky: ['#6a88c8', '#f0b0a0', '#ffd8a0'] },
  }[kind];
  add(new THREE.AmbientLight(P.amb[0], P.amb[1]));
  add(new THREE.HemisphereLight(P.hemi[0], P.hemi[1], P.hemi[2]));
  G.scene.fog = new THREE.Fog(P.fog[0], P.fog[1], P.fog[2]);
  G.scene.background = new THREE.Color(P.bg);
  return P;
}
function moon(x, y, z, size = 8, red = false) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(size, 20), new THREE.MeshBasicMaterial({ map: T.moon(red), fog: false, transparent: true }));
  put(m, x, y, z); m.lookAt(0, y * 0.3, 0);
  return m;
}

// ---------------------------------------------------------------------------
// SAINT JOSEPH SCHOOL
// ---------------------------------------------------------------------------
export function buildSchool(v = {}) {
  clearLevel(); mats();
  const time = v.time || 'day';
  const P = lighting(time);
  const night = time === 'night';
  const L = { name: 'school', hardFloor: true, doors: {}, lights: [], lamps: [], spots: {} };
  G.level = L;

  const wallM = mat({ map: T.block(night ? '#9a9486' : '#ddd3bb') });
  const floorM = mat({ map: T.tiles('#d9d2c0', '#7c8f86') });
  const ceilM = mat({ map: T.ceiling() });
  const trimM = mat({ color: '#6f2b2b' });

  // Hallway
  room({ x0: -30, z0: -3, x1: 30, z1: 3, h: 3.2, floorM, wallM, ceilM,
    doors: { n: [{ c: -6, w: 1.6 }, { c: 8, w: 1.6 }], s: [{ c: 4, w: 3 }], w: [{ c: 0, w: 3 }] }, skip: ['e'] });
  block(60, 0.12, 0.05, trimM, 0, 1.0, -2.88, { collide: false }); block(60, 0.12, 0.05, trimM, 0, 1.0, 2.88, { collide: false });
  lockerRow(-28, -7.2, -3, 1); lockerRow(-4.8, 6.8, -3, 1); lockerRow(9.2, 28, -3, 1);
  lockerRow(-28, 2.2, 3, -1); lockerRow(5.8, 28, 3, -1);
  for (let x = -24; x <= 24; x += 8) L.lamps.push(lamp(x, 3.2, 0, 1.6, 0.4));
  for (const x of [-18, 0, 18]) L.lights.push(pointLight(x, 2.8, 0, 0xf4f1e0, night ? 0 : 3.5, 16));
  sign(T.sign('SAINT JOSEPH SCHOOL\n~ Home of the Falcons ~', '#6f2b2b', '#f2d45c', 256, 48, 14), 3.2, 0.6, -29.88, 2.55, 0, Math.PI / 2);
  sign(T.sign('7B  Mr. Bautista', '#1d2d5c', '#fff', 128, 32, 13), 1.2, 0.3, -6, 2.55, -2.88, 0);
  sign(T.sign('6A  Ms. Reyes', '#1d2d5c', '#fff', 128, 32, 13), 1.2, 0.3, 8, 2.55, -2.88, 0);
  sign(T.sign('CAFETERIA', '#1d2d5c', '#fff', 128, 32, 14), 1.6, 0.4, 4, 2.6, 2.88, Math.PI);
  sign(T.sign('GYM →', '#1d2d5c', '#fff', 128, 32, 14), 1.2, 0.3, 22, 2.6, 2.88, Math.PI);
  sign(T.poster('BANANA\nDRIVE', 'bring bananas\nfor the needy!\n(not for Eric)', '#e8cf3a', '#3a2a00'), 0.6, 0.9, 3.9, 1.7, -2.4, 0);
  sign(T.poster('FALCONS\nBASKETBALL', 'tryouts friday\nall grades', '#1d2d5c', '#f2d45c'), 0.6, 0.9, -20, 1.7, 2.4, Math.PI);
  sign(T.poster('MOON\nQUIZ', 'friday!\nstudy phases', '#20202a', '#f3e7b8'), 0.6, 0.9, 16, 1.7, 2.4, Math.PI);
  // crucifix
  block(0.08, 0.6, 0.04, M.woodDark, -12, 2.1, -2.72, { collide: false }); block(0.36, 0.08, 0.04, M.woodDark, -12, 2.45, -2.72, { collide: false });
  // locked 6A door
  const doorM = mat({ color: '#5a3a22', map: T.wood('#5a3a22') });
  L.doors.sixA = block(1.6, 2.3, 0.08, doorM, 8, 0, -3, { collide: true });
  L.doors.sevenB = block(1.6, 2.3, 0.08, doorM, -6.75, 0, -3.85, { collide: false }); L.doors.sevenB.rotation.y = Math.PI / 2;
  // front doors (glass)
  const fd = block(0.1, 2.3, 3, mat({ color: '#8fa0a8', transparent: true, opacity: 0.5 }), -30, 0, 0, { collide: true });
  fd.userData.collider.off = true; fd.visible = false; L.doors.front = fd;

  // Classroom 7B
  room({ x0: -22, z0: -15, x1: -4, z1: -3, h: 3.2, floorM, wallM, ceilM, skip: ['s'],
    doors: { n: [{ c: -18, w: 2.4, y0: 1, y1: 2.5 }, { c: -13, w: 2.4, y0: 1, y1: 2.5 }, { c: -8, w: 2.4, y0: 1, y1: 2.5 }] } });
  for (const x of [-18, -13, -8]) { glass(2.4, 1.5, x, 1.75, -15, 0, night ? 0x10141c : 0xbcd8f0, night ? 0.6 : 0.35); frameAround(2.4, 1.5, x, 1.75, -15, true, M.white); }
  L.chalk = sign(T.chalk(v.chalk || ['Mon: fractions p.42', 'Moon phases quiz FRIDAY!', 'if a train leaves at 3pm...']), 4.4, 1.6, -21.88, 1.9, -9, Math.PI / 2);
  block(0.06, 1.8, 4.6, M.woodDark, -21.95, 1.0, -9, { collide: false });
  block(0.3, 0.05, 4.4, M.woodDark, -21.8, 1.0, -9, { collide: false });
  L.spots.desks = [];
  for (const x of [-16.5, -13.5, -10.5, -7.5]) for (const z of [-12.5, -10.5, -8.5, -6.5]) {
    desk(x, z, Math.PI / 2); L.spots.desks.push([x, z]);
  }
  block(1.6, 0.8, 0.8, M.desk, -19.5, 0, -9, {}); // teacher desk
  block(0.1, 0.6, 0.1, M.metal, -19.5, 0.8, -8.8, { collide: false });
  block(0.4, 0.05, 0.3, M.white, -19.3, 0.8, -9.3, { collide: false });
  sign(T.poster('SAINT\nJOSEPH', 'pray, learn,\nplay', '#6f2b2b', '#f2d45c'), 0.6, 0.9, -4.12, 1.8, -12, -Math.PI / 2);
  sign(T.poster('PHASES\nOF THE MOON', '( ) ) | ( (\n', '#15152a', '#f3e7b8'), 0.6, 0.9, -4.12, 1.8, -9, -Math.PI / 2);
  const clockTex = canvasTex('clock', 32, 32, g => { g.fillStyle = '#fff'; g.beginPath(); g.arc(16, 16, 15, 0, 7); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 2; g.stroke(); g.beginPath(); g.moveTo(16, 16); g.lineTo(16, 6); g.moveTo(16, 16); g.lineTo(23, 18); g.stroke(); }, { repeat: false });
  sign(clockTex, 0.4, 0.4, -21.85, 2.8, -12, Math.PI / 2);
  L.lamps.push(lamp(-16, 3.2, -9, 1.6, 0.5), lamp(-10, 3.2, -9, 1.6, 0.5));
  L.lights.push(pointLight(-13, 2.8, -9, 0xf4f1e0, night ? 0 : 4, 16));
  L.spots.carlosDesk = [-10.5, -8.5];
  L.spots.teacher = [-20.5, -10];

  // Cafeteria
  room({ x0: -6, z0: 3, x1: 16, z1: 19, h: 3.2, floorM: mat({ map: T.tiles('#e6dfcf', '#c0473f') }), wallM, ceilM, skip: ['n'],
    doors: { w: [{ c: 8, w: 3, y0: 1, y1: 2.5 }, { c: 14, w: 3, y0: 1, y1: 2.5 }] } });
  for (const z of [8, 14]) { glass(3, 1.5, -6, 1.75, z, Math.PI / 2, night ? 0x10141c : 0xbcd8f0, night ? 0.6 : 0.35); frameAround(3, 1.5, -6, 1.75, z, false, M.white); }
  for (const [x, z] of [[0, 8], [0, 13], [7, 8], [7, 13]]) {
    block(3.6, 0.06, 1.0, M.table, x, 0.72, z, { collide: false });
    block(0.1, 0.72, 0.8, M.metal, x - 1.4, 0, z, { collide: false }); block(0.1, 0.72, 0.8, M.metal, x + 1.4, 0, z, { collide: false });
    block(3.6, 0.45, 0.35, M.bench, x, 0, z - 0.85, { collide: false }); block(3.6, 0.45, 0.35, M.bench, x, 0, z + 0.85, { collide: false });
    addCollider(x - 1.8, z - 1.05, x + 1.8, z + 1.05);
  }
  L.spots.ericTable = [0, 8];
  block(10, 1.0, 0.8, mat({ color: '#9aa1a8' }), 8, 0, 16.5, {}); // serving counter
  block(10, 0.05, 1.0, M.chrome, 8, 1.0, 16.5, { collide: false });
  for (let i = 0; i < 5; i++) block(0.8, 0.12, 0.5, mat({ color: ['#b35a2a', '#d8c060', '#5a8a3a', '#8a5a3a', '#d8d0b0'][i] }), 4 + i * 2, 1.0, 16.5, { collide: false });
  sign(T.sign('TODAY: MONDAY SURPRISE', '#fff8e0', '#8a2a2a', 256, 32, 14), 3, 0.4, 8, 2.5, 18.88, Math.PI);
  block(0.9, 1.9, 0.8, mat({ color: '#a82a2a' }), 15.4, 0, 6, {}); // vending machine
  panel(0.6, 1.1, basic({ color: night ? 0x5a8aff : 0xcfe0ff }), 14.93, 1.2, 6, -Math.PI / 2);
  L.lamps.push(lamp(1, 3.2, 8), lamp(9, 3.2, 8), lamp(1, 3.2, 14), lamp(9, 3.2, 14));
  L.lights.push(pointLight(4, 2.8, 10, 0xfff4e0, night ? 0 : 4, 18));

  // Gym
  const gymWall = mat({ map: T.block(night ? '#8a8a90' : '#cfd3d8') });
  room({ x0: 30, z0: -13, x1: 56, z1: 13, h: 8, wallM: gymWall, ceilM: mat({ color: '#5a5d63' }), tileW: 2, doors: { w: [{ c: 0, w: 3, y1: 2.6 }], s: [{ c: 48, w: 1.6 }] } });
  const courtM = mat({ map: T.court() }); floor(30, -13, 56, 13, 0.001, courtM, 0);
  for (let i = 0; i < 4; i++) block(18, 0.5, 1.0, mat({ color: '#8a6a45', map: T.wood('#8a6a45') }), 43, i * 0.5, -12.5 + i * 1.0 - 0.0, { collide: i === 0 });
  addCollider(34, -13, 52, -9);
  L.hoopE = hoop(55.2, 0, -1); L.hoopW = hoop(30.8, 0, 1);
  sign(T.sign('FALCONS', '#6f2b2b', '#f2d45c', 128, 32, 20), 5, 1.2, 43, 6, 12.85, Math.PI);
  sign(T.sign('SAINT JOSEPH', '#1d2d5c', '#fff', 128, 32, 16), 5, 1.2, 43, 5.5, -12.85, 0);
  for (const [x, z] of [[36, -8], [50, -8], [36, 11], [50, 11]]) {
    block(1.4, 0.8, 0.5, M.metal, x, 0, z, {});
    for (let i = 0; i < 3; i++) { const b = makeBall(); put(b, x - 0.45 + i * 0.45, 0.95, z); }
  }
  L.racks = [[36, -8], [50, -8], [36, 11], [50, 11]];
  L.gymLamps = [];
  for (const x of [36, 43, 50]) for (const z of [-6, 6]) L.gymLamps.push(lamp(x, 8, z, 1.6, 1.2));
  L.gymLights = [pointLight(38, 7, 0, 0xfff2dc, night ? 0 : 7, 30), pointLight(50, 7, 0, 0xfff2dc, night ? 0 : 7, 30)];
  L.lamps.push(...L.gymLamps); L.lights.push(...L.gymLights);
  // gym double door (can slam shut)
  const gd = block(0.12, 2.6, 3, mat({ color: '#6a2020' }), 30, 0, 0, { collide: true });
  gd.userData.collider.off = true; gd.visible = false; L.doors.gym = gd;

  // Equipment room
  room({ x0: 44, z0: 13, x1: 52, z1: 19, h: 3, floorM: mat({ color: '#5a5550' }), wallM: gymWall, ceilM: mat({ color: '#3a3a3a' }), skip: ['n'] });
  for (let i = 0; i < 4; i++) block(1.2, 0.3, 0.6, mat({ color: ['#2a4a8a', '#8a2a2a', '#2a6a3a', '#6a5a2a'][i] }), 46 + (i % 2) * 1.4, Math.floor(i / 2) * 0.3, 18.3, { collide: i < 2 });
  block(0.6, 1.2, 1.8, M.metal, 51.4, 0, 16, {});
  L.equipLight = pointLight(48, 2.6, 16, 0xffe0a0, night ? 0 : 1.6, 8);
  L.spots.equip = [48, 16];

  // Outside: facade, loop, trees
  const brickM = mat({ map: T.brick() });
  const facadeDoor = { c: 0, w: 3.1 };
  room({ x0: -30.4, z0: -26, x1: -30.2, z1: 26, h: 7, wallM: brickM, tileW: 2.5, skip: ['n', 's', 'e'], doors: { w: [facadeDoor] } });
  for (const z of [-20, -12, -6, 6, 12, 20]) for (const y of [1.2, 4.2]) { panel(2, 1.4, basic({ color: night ? (Math.random() < 0.2 ? 0x3a3020 : 0x0a0c12) : 0x8fa8c0 }), -30.52, y + 0.7, z, -Math.PI / 2); }
  block(0.8, 0.4, 53, trimM, -30.5, 7, 0, { collide: false });
  sign(T.sign('SAINT JOSEPH SCHOOL', '#e8e2d0', '#6f2b2b', 256, 32, 18), 8, 1.0, -30.55, 5.5, 0, -Math.PI / 2);
  floor(-72, -28, -30, 28, 0, mat({ map: T.grass() }), 2);
  floor(-54, -22, -34, 22, 0.01, mat({ map: T.asphalt() }), 2);
  floor(-34, -22, -30.4, 22, 0.015, mat({ map: T.tiles('#a8a49c', '#9a968e') }), 1.5);
  for (let z = -20; z <= 20; z += 5) block(0.2, 0.15, 3, M.white, -44, 0, z, { collide: false }).position.y = 0.02;
  // flagpole + sign
  block(0.12, 8, 0.12, M.metal, -36, 0, -14, {});
  const flag = panel(1.6, 1.0, basic({ color: 0xc8d8f0, side: THREE.DoubleSide }), -35.2, 7.3, -14, 0);
  onUpdate(() => { flag.rotation.y = Math.sin(G.time * 2) * 0.25; });
  block(0.2, 2.2, 4, mat({ color: '#6f2b2b' }), -56, 0, 0, {});
  sign(T.sign('SAINT JOSEPH\nSCHOOL', '#6f2b2b', '#f2d45c', 128, 64, 16), 3.6, 1.8, -55.88, 1.2, 0, Math.PI / 2);
  // bench where Eric waits
  block(2, 0.45, 0.5, M.bench, -32.2, 0, -8, {});
  L.spots.bench = [-32.2, -8];
  for (let z = -24; z <= 24; z += 6) { tree(-60, z, 1 + (z % 4) * 0.05, night); tree(-67, z + 3, 1.2, night); }
  for (const x of [-50, -42, -36]) { tree(x, -25, 1, night); tree(x, 25, 1, night); }
  // playground + fence
  const swing = new THREE.Group(); put(swing, -62, 0, -18);
  block(0.1, 2.4, 0.1, M.metal, -1.2, 0, 0, { parent: swing, collide: false }); block(0.1, 2.4, 0.1, M.metal, 1.2, 0, 0, { parent: swing, collide: false });
  block(2.5, 0.1, 0.1, M.metal, 0, 2.4, 0, { parent: swing, collide: false });
  L.swings = [];
  for (const x of [-0.5, 0.5]) { const s = new THREE.Group(); put(s, x, 2.4, 0, swing); block(0.4, 0.05, 0.2, M.red, 0, -1.9, 0, { parent: s, collide: false }); block(0.02, 1.9, 0.02, M.dark, -0.18, -1.9, 0, { parent: s, collide: false }); block(0.02, 1.9, 0.02, M.dark, 0.18, -1.9, 0, { parent: s, collide: false }); L.swings.push(s); }
  const fenceM = new THREE.MeshBasicMaterial({ color: 0x777b80, wireframe: true });
  for (const [x0, z0, x1, z1] of [[-70, -26, -70, 26], [-70, -26, -30, -26], [-70, 26, -30, 26]]) {
    const len = Math.hypot(x1 - x0, z1 - z0), f = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.8, Math.round(len / 1.5), 2), fenceM);
    f.position.set((x0 + x1) / 2, 0.9, (z0 + z1) / 2); f.rotation.y = x0 === x1 ? Math.PI / 2 : 0; root().add(f);
    addCollider(Math.min(x0, x1) - 0.1, Math.min(z0, z1) - 0.1, Math.max(x0, x1) + 0.1, Math.max(z0, z1) + 0.1);
  }
  L.carSpot = [-40, 3];
  // street lamps (lit at dusk/night)
  L.streetLights = [];
  for (const z of [-15, 15]) {
    block(0.12, 5, 0.12, M.metal, -34.5, 0, z, {});
    const bulb = block(0.5, 0.2, 0.3, basic({ color: (time === 'dusk' || night) ? 0xffd890 : 0x888888 }), -34.8, 5, z, { collide: false });
    if (time === 'dusk' || night) L.streetLights.push(pointLight(-35, 4.6, z, 0xffc070, 8, 18));
  }
  root().add(skyDome(...P.sky));
  if (time === 'day' || time === 'overcast') L.moon = moon(-150, 70, -60, 7);
  if (time === 'dusk' || night || time === 'dim') L.moon = moon(-140, 40, 30, night ? 12 : 10, time === 'dusk' || night);

  // flicker
  L.flicker = v.flicker || 0;
  const base = L.lights.map(l => l.intensity);
  onUpdate(dt => {
    if (!L.flicker) return;
    const on = Math.random() > L.flicker * 0.08;
    L.lights.forEach((l, i) => { if (!l.userData.forceOff) l.intensity = on ? base[i] : base[i] * 0.1; });
    L.lamps.forEach(m => m.material.color.setHex(on ? 0xf4f6ee : 0x555555));
  });
  L.setLights = (on) => {
    L.lights.forEach((l, i) => { l.intensity = on ? (base[i] || 4) : 0; l.userData.forceOff = !on; });
    L.lamps.forEach(m => m.material.color.setHex(on ? 0xf4f6ee : 0x222222));
  };
  L.setGymLights = (k) => { L.gymLights.forEach(l => { l.intensity = 7 * k; }); L.gymLamps.forEach(m => m.material.color.setRGB(0.15 + 0.8 * k, 0.15 + 0.8 * k, 0.15 + 0.78 * k)); };
  if (night) { L.setLights(false); }
  return L;
}

// ---------------------------------------------------------------------------
// CARLOS'S HOUSE (inspired by the reference: wallpaper, chandelier, glass doors, red rug)
// ---------------------------------------------------------------------------
export function buildHome(v = {}) {
  clearLevel(); mats();
  const time = v.time || 'evening';
  const P = lighting(time === 'dream' ? 'dream' : time === 'dawn' ? 'dawn' : time === 'morning' ? 'overcast' : time === 'night' ? 'night' : 'evening');
  const L = { name: 'home', hardFloor: true, doors: {}, spots: {}, lights: [] };
  G.level = L;
  const wp = mat({ map: T.wallpaper() }), woodF = mat({ map: T.wood('#6a4428') }), ceil = mat({ map: T.wood('#3a2718') });
  // Living room
  room({ x0: -8, z0: -7, x1: 8, z1: 7, h: 3.2, floorM: woodF, wallM: wp, ceilM: ceil, tileF: 2, tileC: 2,
    doors: { n: [{ c: 0, w: 3.6, y1: 2.5 }], s: [{ c: -4, w: 1.6 }], e: [{ c: -4.5, w: 1.2 }] } });
  // glass double doors to the backyard
  const frameM = mat({ color: '#c9ccd6' });
  for (const x of [-0.9, 0.9]) { glass(1.75, 2.45, x, 1.25, -7, 0, 0x0a1020, 0.55); block(0.06, 2.5, 0.08, frameM, x, 0, -7, { collide: false }); }
  block(3.6, 0.08, 0.1, frameM, 0, 2.45, -7, { collide: false }); block(0.08, 2.5, 0.1, frameM, -1.8, 0, -7, { collide: false }); block(0.08, 2.5, 0.1, frameM, 1.8, 0, -7, { collide: false });
  addCollider(-1.8, -7.1, 1.8, -6.9);
  // big TV + dark window panel
  L.tv = panel(3.0, 1.7, basic({ color: 0x07080a }), -5.2, 1.7, -6.88, 0);
  block(3.1, 1.8, 0.05, M.dark, -5.2, 0.8, -6.93, { collide: false });
  panel(2.6, 1.9, basic({ color: 0x0c1018 }), 5.3, 1.6, -6.88, 0);
  // family photo on the wall
  const photo = canvasTex('famphoto', 32, 40, g => { g.fillStyle = '#e8e0cc'; g.fillRect(0, 0, 32, 40); g.fillStyle = '#6a8ab0'; g.fillRect(3, 3, 26, 26); g.fillStyle = '#d6a57c'; for (const x of [9, 16, 23]) { g.beginPath(); g.arc(x, 16, 3, 0, 7); g.fill(); } g.fillStyle = '#333'; g.fillRect(6, 32, 20, 2); }, { repeat: false });
  L.photo = sign(photo, 0.45, 0.56, -2.8, 1.9, -6.88, 0);
  // rug, couches, table, chandelier
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(8, 5.5), mat({ map: T.rug() })); rug.rotation.x = -Math.PI / 2; put(rug, 0, 0.01, 0);
  couch(-7.3, 0, Math.PI / 2, 3); couch(7.3, 1.6, -Math.PI / 2, 2.6); couch(0, 4.9, Math.PI, 3.2);
  block(1.8, 0.4, 1.0, M.woodDark, 0, 0, 0.6, {});
  const bowl = new THREE.Group(); put(bowl, 0, 0.42, 0.6); for (let i = 0; i < 3; i++) { const b = banana(); b.position.set(i * 0.1 - 0.1, 0.05, 0); b.rotation.x = Math.PI / 2; bowl.add(b); }
  L.bananas = bowl;
  const ch = new THREE.Group(); put(ch, 0, 3.2, 0);
  block(0.04, 0.6, 0.04, M.brass, 0, -0.6, 0, { parent: ch, collide: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 4, 10), M.brass); ring.rotation.x = Math.PI / 2; ring.position.y = -0.75; ch.add(ring);
  L.bulbs = [];
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; const b = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.18, 6), basic({ color: 0xfff6e0 })); b.position.set(Math.cos(a) * 0.55, -0.62, Math.sin(a) * 0.55); ch.add(b); L.bulbs.push(b); }
  L.chandelier = pointLight(0, 2.3, 0, 0xffe6c0, time === 'night' || time === 'dream' ? 0.6 : 4, 14);
  L.lights.push(L.chandelier);
  block(0.5, 0.9, 0.5, M.woodDark, -7.4, 0, -6.2, {}); // side table
  // Kitchen
  room({ x0: -8, z0: 7, x1: 0, z1: 14, h: 3.2, floorM: mat({ map: T.tiles('#e8e4dc', '#b8b0a4') }), wallM: mat({ map: T.plaster('#d8ccb0') }), ceilM: mat({ color: '#e6e0d4' }), skip: ['n'] });
  block(8, 0.9, 0.7, M.counter, -4, 0, 13.55, {}); block(8, 0.05, 0.75, M.white, -4, 0.9, 13.5, { collide: false });
  block(0.9, 1.9, 0.8, M.fridge, -0.6, 0, 12.2, {});
  block(0.8, 0.05, 0.6, M.dark, -6, 0.95, 13.5, { collide: false });
  L.pot = block(0.35, 0.3, 0.35, M.metal, -6, 0.97, 13.5, { collide: false });
  block(1.6, 0.75, 1.0, M.desk, -4, 0, 10.2, {});
  L.lights.push(pointLight(-4, 2.8, 10.5, 0xfff0d0, time === 'night' || time === 'dream' ? 0 : 3, 10));
  L.spots.dad = [-6, 12.9]; L.spots.kitchenTable = [-4, 10.2];
  // front door (decorative)
  block(1.1, 2.2, 0.08, mat({ color: '#5a3020', map: T.wood('#5a3020') }), 4, 0, 6.95, { collide: false });
  // Bedroom
  room({ x0: 8, z0: -7, x1: 15, z1: 0, h: 3.0, floorM: mat({ map: T.fabric('#5a6070') }), wallM: mat({ map: T.plaster('#6d86a0') }), ceilM: mat({ color: '#d8d8d0' }), skip: ['w'],
    doors: { n: [{ c: 11.5, w: 1.8, y0: 0.9, y1: 2.3 }] } });
  glass(1.8, 1.4, 11.5, 1.6, -7, 0, 0x101a2a, 0.3); frameAround(1.8, 1.4, 11.5, 1.6, -7, true, M.white);
  addCollider(10.6, -7.2, 12.4, -6.9);
  block(1.2, 0.5, 2.1, M.bed, 14.2, 0, -2.2, {}); block(1.1, 0.12, 0.4, M.pillow, 14.2, 0.5, -3.0, { collide: false });
  block(0.08, 1.0, 1.2, M.woodDark, 14.9, 0, -3.1, { collide: false });
  L.bed = block(1.2, 0.02, 2.1, M.bed, 14.2, 0.5, -2.2, { collide: false });
  block(1.2, 0.75, 0.6, M.desk, 9, 0, -6.4, {});
  L.lamp = pointLight(9.3, 1.4, -6.2, 0xffd9a0, time === 'dream' ? 0.4 : 1.5, 6);
  block(0.15, 0.4, 0.15, M.dark, 9.3, 0.75, -6.4, { collide: false });
  sign(T.poster('FALCONS', '#23\nCARLOS', '#6f2b2b', '#f2d45c'), 0.6, 0.9, 14.88, 1.8, -5.5, -Math.PI / 2);
  sign(T.poster('LEBRON', 'the GOAT', '#552583', '#fdb927'), 0.6, 0.9, 8.12, 1.8, -2.5, Math.PI / 2);
  L.backpack = block(0.35, 0.45, 0.2, mat({ color: '#2b4b7a' }), 10.2, 0, -1.0, { collide: false });
  L.phone = block(0.08, 0.01, 0.15, M.dark, 13.6, 0.9, -3.3, { collide: false });
  block(0.4, 0.9, 0.4, M.woodDark, 13.6, 0, -3.5, { collide: false });
  L.spots.bed = [13.4, -2.2]; L.spots.window = [11.5, -5.8];
  // Wall between living room & bedroom hallway is the living room east wall (door at z -4.5 w 1.2)
  // Bedroom south wall beyond living room: ensure closure from x 8..15 at z=0 is built (room 's').

  // Outside
  floor(-60, -60, 60, 60, -0.01, mat({ map: T.grass() }), 3);
  const houseM = mat({ color: time === 'night' || time === 'dream' ? '#3a3a44' : '#9a8a78' });
  const roofM = mat({ color: '#3a2a2a' });
  L.neighbor = new THREE.Group(); put(L.neighbor, 12, 0, -24);
  block(10, 4, 7, houseM, 0, 0, 0, { parent: L.neighbor, collide: false });
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 6, 3, 4, 1), roofM); roof.rotation.y = Math.PI / 4; roof.scale.set(1.2, 1, 0.8); roof.position.y = 5.5; L.neighbor.add(roof);
  panel(1.2, 1, basic({ color: 0x3a3020 }), -2, 2, 3.51, 0, L.neighbor);
  for (const [x, z] of [[-12, -18], [-4, -30], [26, -20], [30, -8], [-20, -8]]) tree(x, z, 1.3, time !== 'evening');
  block(20, 1.2, 0.1, M.woodDark, 0, 0, -14, { collide: false });
  root().add(skyDome(...P.sky));
  L.moon = moon(40, 45, -120, 12, time === 'night' || time === 'dream');
  return L;
}

// ---------------------------------------------------------------------------
// THE CAR RIDE HOME
// ---------------------------------------------------------------------------
export function buildCar(v = {}) {
  clearLevel(); mats();
  const P = lighting(v.time || 'day');
  const L = { name: 'car', hardFloor: false, spots: {} };
  G.level = L;
  // interior shell around the camera (camera sits in back right seat at 0,1.1,0.6)
  const inner = mat({ color: '#3a3a40' }), seat = mat({ color: '#4a3a30', map: T.fabric('#4a3a30') });
  const carG = new THREE.Group(); put(carG, 0, 0, 0); L.car = carG;
  block(1.8, 0.1, 4, inner, 0, 0.3, 0, { parent: carG, collide: false });
  block(1.8, 0.08, 3.2, inner, 0, 1.75, 0, { parent: carG, collide: false });
  block(0.7, 0.5, 0.6, seat, -0.45, 0.4, -0.7, { parent: carG, collide: false }); block(0.7, 0.8, 0.15, seat, -0.45, 0.8, -0.4, { parent: carG, collide: false });
  block(0.7, 0.5, 0.6, seat, 0.45, 0.4, -0.7, { parent: carG, collide: false }); block(0.7, 0.8, 0.15, seat, 0.45, 0.8, -0.4, { parent: carG, collide: false });
  block(0.18, 0.25, 0.12, seat, -0.45, 1.6, -0.38, { parent: carG, collide: false });
  block(1.6, 0.5, 0.6, seat, 0, 0.4, 0.8, { parent: carG, collide: false }); block(1.6, 0.7, 0.15, seat, 0, 0.8, 1.15, { parent: carG, collide: false });
  block(1.8, 0.5, 0.4, M.dark, 0, 0.8, -1.8, { parent: carG, collide: false }); // dash
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 4, 10), M.dark); wheel.position.set(-0.45, 1.2, -1.45); wheel.rotation.x = -0.4; carG.add(wheel);
  for (const [x, z, w] of [[-0.9, 0, 0.1], [0.9, 0, 0.1]]) { block(w, 0.8, 4, inner, x, 0.3, z, { parent: carG, collide: false }); block(w, 0.12, 4, inner, x, 1.65, z, { parent: carG, collide: false }); }
  for (const z of [-1.3, 0.1, 1.5]) for (const x of [-0.9, 0.9]) block(0.1, 0.6, 0.1, inner, x, 1.1, z, { parent: carG, collide: false });
  const mirror = block(0.25, 0.08, 0.02, M.dark, 0, 1.6, -1.55, { parent: carG, collide: false });
  // road + scenery scrolling past
  const roadTex = T.road().clone(); roadTex.needsUpdate = true; roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping; roadTex.repeat.set(1, 30);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(8, 240), mat({ map: roadTex })); road.rotation.x = -Math.PI / 2; put(road, 0.8, 0, 0);
  const grassTex = T.grass().clone(); grassTex.needsUpdate = true; grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping; grassTex.repeat.set(30, 60);
  const gr = new THREE.Mesh(new THREE.PlaneGeometry(120, 240), mat({ map: grassTex })); gr.rotation.x = -Math.PI / 2; put(gr, 0, -0.02, 0);
  const passing = [];
  for (let i = 0; i < 24; i++) {
    const g = new THREE.Group(); const side = i % 2 ? 1 : -1;
    put(g, side * (7 + Math.random() * 10), 0, -100 + i * 9, root());
    if (i % 5 === 0) { block(6, 3.5, 5, mat({ color: ['#9a8a78', '#7a8a9a', '#a07a6a'][i % 3] }), 0, 0, 0, { parent: g, collide: false }); }
    else { const t = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4, 6), (v.time === 'dusk' || v.time === 'night') ? M.leavesDark : M.leaves); t.position.y = 3; g.add(t); block(0.3, 1.5, 0.3, M.trunk, 0, 0, 0, { parent: g, collide: false }); }
    passing.push(g);
  }
  for (let i = 0; i < 8; i++) { const p = block(0.12, 5, 0.12, M.metal, -4, 0, -100 + i * 30, { collide: false }); passing.push(p); }
  L.speed = 14;
  onUpdate(dt => {
    roadTex.offset.y += dt * L.speed / 8; grassTex.offset.y += dt * L.speed / 4;
    for (const p of passing) { p.position.z += dt * L.speed; if (p.position.z > 100) p.position.z -= 216; }
    carG.position.y = Math.sin(G.time * 13) * 0.006;
  });
  root().add(skyDome(...P.sky));
  L.moon = moon(-60, 30, -140, v.time === 'dusk' ? 14 : 8, v.time === 'dusk' || v.time === 'night');
  L.spots.seat = [0.45, 0.6];
  L.spots.driver = [-0.45, -0.7];
  return L;
}

// ---------------------------------------------------------------------------
// THE DREAM — a piece of the gym floating in Moonkai's stomach-sky
// ---------------------------------------------------------------------------
export function buildDream() {
  clearLevel(); mats();
  const P = lighting('dream');
  const L = { name: 'dream', hardFloor: true, spots: {} };
  G.level = L;
  const courtM = mat({ map: T.court(), color: '#ff9a9a' });
  floor(-8, -8, 8, 8, 0, courtM, 0);
  block(16, 1, 16, mat({ color: '#3a0a0a' }), 0, -1.01, 0, { collide: false });
  // a long path of floating desks and tiles to the bedroom door
  for (let i = 0; i < 26; i++) {
    const z = -10 - i * 3;
    block(3, 0.5, 3, mat({ color: i % 2 ? '#5a1a1a' : '#3a0a10', map: T.tiles('#8a3a3a', '#3a1010') }), Math.sin(i * 0.5) * 2, -0.5, z, { collide: false });
    if (i % 3 === 0) desk(Math.sin(i * 0.5) * 2 + (i % 2 ? 1.6 : -1.6), z);
  }
  L.path = (z) => Math.sin(((-z - 10) / 3) * 0.5) * 2;
  // invisible walls: keep player on the platform + path
  L.bounds = (p) => {
    if (p.z > -8.5) { p.x = Math.max(-7.7, Math.min(7.7, p.x)); p.z = Math.min(7.7, p.z); }
    else { const cx = L.path(p.z); p.x = Math.max(cx - 1.4, Math.min(cx + 1.4, p.x)); p.z = Math.max(-88, p.z); }
  };
  onUpdate(() => { if (G.level === L) L.bounds(player.pos); });
  // the door home
  const door = block(1.2, 2.2, 0.1, mat({ color: '#6d86a0' }), L.path(-86), 0, -88, { collide: false });
  panel(1.3, 2.3, basic({ color: 0xffffff, transparent: true, opacity: 0.25 }), L.path(-86), 1.1, -87.9);
  L.doorPos = [L.path(-86), -87.5];
  L.doorLight = pointLight(L.path(-86), 2, -86, 0xaaccff, 3, 10);
  // floating debris
  for (let i = 0; i < 40; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.4 + Math.random(), 0.4 + Math.random(), 0.4 + Math.random()), mat({ color: ['#5a1a1a', '#2a0a0a', '#8a4a2a'][i % 3] }));
    put(m, (Math.random() - 0.5) * 60, -6 + Math.random() * 20, -Math.random() * 90 + 10);
    const sp = Math.random() * 0.5; onUpdate(dt => { m.rotation.x += dt * sp; m.rotation.y += dt * sp; });
  }
  root().add(skyDome(...P.sky));
  L.moon = moon(0, 40, -120, 26, true);
  L.moonkai = makeMoonkai(3.2); L.moonkai.group.visible = false; root().add(L.moonkai.group);
  onUpdate(dt => L.moonkai.update(dt));
  return L;
}

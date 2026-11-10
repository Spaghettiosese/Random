// The outdoor range: booth, lanes, backstop and every kind of target.
import * as THREE from '../../vendor/three.module.min.js';

const T = THREE;
const lam = (color, o = {}) => new T.MeshLambertMaterial({ color, ...o });

function noiseTex(base, vary, size = 128, rep = 1) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), img = g.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const n = (Math.random() - .5) * vary;
    img.data[i * 4] = base[0] + n; img.data[i * 4 + 1] = base[1] + n; img.data[i * 4 + 2] = base[2] + n * .7; img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); t.colorSpace = T.SRGBColorSpace;
  return t;
}
function bullseyeTex() {
  const s = 512, c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d');
  g.fillStyle = '#efe9d8'; g.fillRect(0, 0, s, s);
  const R = s * .45;
  for (let i = 1; i <= 10; i++) {
    const r = R * (11 - i) / 10;
    g.beginPath(); g.arc(s / 2, s / 2, r, 0, 7);
    g.fillStyle = i === 10 ? '#e2572b' : i >= 7 ? '#1d2733' : '#efe9d8'; g.fill();
    g.lineWidth = 2; g.strokeStyle = i >= 7 ? '#efe9d8' : '#1d2733'; g.stroke();
    if (i < 10) {
      g.fillStyle = i >= 7 ? '#efe9d8' : '#1d2733'; g.font = 'bold 15px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(i, s / 2, s / 2 - r + R / 20); g.fillText(i, s / 2 + r - R / 20, s / 2);
    }
  }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t;
}
function signTex(text, bg = '#f1c232', fg = '#1a1a1a') {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, 256, 128);
  g.strokeStyle = fg; g.lineWidth = 8; g.strokeRect(4, 4, 248, 120);
  g.fillStyle = fg; g.font = 'bold 76px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 128, 68);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}

export function buildRange(scene) {
  const shootables = [], updaters = [], targets = [];
  const mat = {
    wood: lam(0x8b6b45), woodDark: lam(0x5c4630), concrete: lam(0xa5a39c, { map: noiseTex([165, 163, 156], 26, 128, 6) }),
    metal: lam(0x4a4f57), roof: lam(0x6e3b30), white: lam(0xe8e4d8),
    steel: new T.MeshStandardMaterial({ color: 0xd8dade, metalness: .6, roughness: .45 }),
    steelRed: new T.MeshStandardMaterial({ color: 0xd4502a, metalness: .4, roughness: .5 }),
    steelYellow: new T.MeshStandardMaterial({ color: 0xe9b824, metalness: .4, roughness: .5 }),
  };
  const add = (geo, material, x, y, z, surface, o = {}) => {
    const mesh = new T.Mesh(geo, material); mesh.position.set(x, y, z);
    if (o.rx) mesh.rotation.x = o.rx; if (o.ry) mesh.rotation.y = o.ry; if (o.rz) mesh.rotation.z = o.rz;
    mesh.castShadow = !!o.cast; mesh.receiveShadow = o.receive !== false;
    (o.parent || scene).add(mesh);
    if (surface) { mesh.userData.surface = surface; shootables.push(mesh); }
    return mesh;
  };
  const box = (w, h, d, material, x, y, z, surface, o) => add(new T.BoxGeometry(w, h, d), material, x, y, z, surface, o);

  // Sky dome with a vertical gradient.
  const skyGeo = new T.SphereGeometry(500, 24, 16), col = [], cTop = new T.Color(0x3f7fd0), cHor = new T.Color(0xd5e6f2), cc = new T.Color();
  for (let i = 0; i < skyGeo.attributes.position.count; i++) {
    const h = Math.max(0, skyGeo.attributes.position.getY(i) / 500);
    cc.copy(cHor).lerp(cTop, Math.pow(h, .55)); col.push(cc.r, cc.g, cc.b);
  }
  skyGeo.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  const sky = new T.Mesh(skyGeo, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide, fog: false }));
  scene.add(sky);
  scene.fog = new T.Fog(0xcfe0ec, 90, 420);

  scene.add(new T.HemisphereLight(0xcfe4ff, 0x8a8a6a, 1.5), new T.AmbientLight(0xffffff, .7));
  const sun = new T.DirectionalLight(0xfff1d6, 2.1);
  sun.position.set(-22, 40, 14); sun.target.position.set(0, 0, -14);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 34, bottom: -20, near: 1, far: 110 });
  sun.shadow.bias = -.0006;
  scene.add(sun, sun.target);

  // Ground.
  const grass = add(new T.PlaneGeometry(600, 600), lam(0x6f8f4a, { map: noiseTex([112, 143, 74], 34, 128, 150) }), 0, 0, -100, 'dirt', { rx: -Math.PI / 2 });
  grass.receiveShadow = true;
  add(new T.PlaneGeometry(22, 116), lam(0xb9a47c, { map: noiseTex([185, 164, 124], 30, 128, 24) }), 0, .06, -57, 'dirt', { rx: -Math.PI / 2 });
  for (const d of [10, 25, 50, 75, 100]) {
    add(new T.PlaneGeometry(22, .12), lam(0xf2efe6), 0, .08, -d, null, { rx: -Math.PI / 2 });
    const sign = add(new T.PlaneGeometry(1.1, .55), new T.MeshBasicMaterial({ map: signTex(d + 'm') }), -11.6, 1.3, -d, null, { ry: .5 });
    sign.receiveShadow = false;
    box(.08, 1.3, .08, mat.woodDark, -11.6, .65, -d - .02, 'wood');
  }

  // Backstop and side berms.
  const dirt = lam(0x8a6f4c, { map: noiseTex([138, 111, 76], 36, 128, 10) });
  box(40, 9, 8, dirt, 0, 3, -118, 'dirt', { rx: .35 });
  for (const sx of [-1, 1]) box(5, 4, 122, dirt, sx * 14.5, 1, -57, 'dirt', { rz: sx * .45 });
  // Hills and trees for depth.
  for (let i = 0; i < 9; i++) {
    const hill = new T.Mesh(new T.SphereGeometry(60 + Math.random() * 50, 12, 8), lam(0x567a43, { fog: true }));
    hill.position.set(-260 + i * 65 + Math.random() * 20, -30, -260 - Math.random() * 60); hill.scale.y = .45 + Math.random() * .2; scene.add(hill);
  }
  const trunkG = new T.CylinderGeometry(.18, .26, 2.4, 6), leafG = new T.ConeGeometry(1.7, 5.5, 7), leafM = lam(0x2f5a34), trunkM = lam(0x4a3524);
  for (let i = 0; i < 46; i++) {
    const side = i % 2 ? 1 : -1, x = side * (20 + Math.random() * 26), z = 12 - Math.random() * 150, s = .8 + Math.random() * .8;
    const tr = new T.Mesh(trunkG, trunkM), lf = new T.Mesh(leafG, leafM);
    tr.position.set(x, 1.2 * s, z); lf.position.set(x, (2.2 + 2.6) * s, z); tr.scale.setScalar(s); lf.scale.setScalar(s);
    scene.add(tr, lf);
  }

  // Shooting booth.
  box(18, .2, 8.4, mat.concrete, 0, -.08, 1.8, 'concrete');
  box(18.6, .14, 9.4, mat.roof, 0, 3.25, 1.6, 'wood', { cast: true, rx: .05 });
  box(18, 3.2, .16, mat.wood, 0, 1.6, 5.9, 'wood', { cast: true });
  for (const x of [-8.9, -4.45, 0, 4.45, 8.9]) {
    box(.16, 3.2, .16, mat.woodDark, x, 1.6, -2.3, 'wood', { cast: true });
    box(.12, .12, 8.4, mat.woodDark, x, 3.1, 1.7, null);
  }
  box(18, .14, .18, mat.woodDark, 0, 3.05, -2.3, null);
  box(17.8, .07, .75, mat.wood, 0, 1.0, -1.25, 'wood', { cast: true });       // bench top
  box(17.8, .5, .05, mat.woodDark, 0, .7, -1.58, 'wood');
  for (let x = -8.6; x <= 8.61; x += 2.15) box(.09, 1, .6, mat.woodDark, x, .5, -1.25, 'wood');
  for (const x of [-6.45, -2.15, 2.15, 6.45]) box(.05, .42, .8, mat.wood, x, 1.24, -1.25, 'wood', { cast: true });
  for (const x of [-4.3, 0, 4.3]) {                                             // ammo boxes on the bench
    box(.3, .16, .2, lam(0x4d5a3c), x + .7, 1.115, -1.2, 'steel', { cast: true, ry: .3 });
    box(.2, .08, .12, lam(0xb8862f), x + 1.0, 1.075, -1.3, 'wood', { ry: -.2 });
  }

  // ── target helpers ──
  const bullTex = bullseyeTex(), paper = new T.MeshLambertMaterial({ map: bullTex });
  function bullseye(parent, x, y, z, size, mult) {
    const face = add(new T.BoxGeometry(size, size, .02), [mat.white, mat.white, mat.white, mat.white, paper, mat.woodDark], x, y, z, 'paper', { parent, cast: true });
    const R = size * .45;
    face.userData.onHit = hit => {
      const l = face.worldToLocal(hit.point.clone()), r = Math.hypot(l.x, l.y);
      if (r > R) return { score: 0 };
      const ring = Math.max(1, 10 - Math.floor(r / (R / 10)));
      return { score: ring * mult, label: ring === 10 ? 'BULLSEYE' : 'RING ' + ring, good: ring >= 9 };
    };
    return face;
  }
  function stand(x, z, h, parent = scene, w = .8) {
    for (const sx of [-1, 1]) box(.05, h, .05, mat.woodDark, x + sx * w / 2, h / 2, z + .03, 'wood', { parent, cast: true });
    box(w + .5, .05, .5, mat.woodDark, x, .03, z + .03, null, { parent });
  }
  // Paper targets.
  for (const [x, d, size] of [[-6.4, 7, .8], [-4.3, 12, .9], [-2.2, 20, 1], [6.4, 35, 1.2]]) {
    stand(x, -d, 1.6 + size / 2, scene, size * .8);
    bullseye(scene, x, 1.45, -d, size, d >= 30 ? 3 : d >= 20 ? 2 : 1);
  }
  // Moving target on a rail.
  box(9, .08, .08, mat.metal, 1.5, 2.55, -27, 'steel');
  for (const x of [-3, 6]) box(.1, 2.55, .1, mat.metal, x, 1.27, -27, 'steel', { cast: true });
  const cart = new T.Group(); cart.position.set(1.5, 0, -27); scene.add(cart);
  box(.04, 1.0, .04, mat.metal, 0, 2.05, 0, 'steel', { parent: cart });
  bullseye(cart, 0, 1.3, .0, .9, 4);
  updaters.push((dt, t) => { cart.position.x = 1.5 + Math.sin(t * .7) * 3.6; });

  // Falling steel plates. `up` plates drop when hit and stand back up after `reset` seconds.
  function plate(x, y, z, r, o) {
    const hinge = new T.Group(); hinge.position.set(x, y, z); scene.add(hinge);
    box(.05, .12, .03, mat.metal, 0, .04, 0, null, { parent: hinge });
    const disc = add(new T.CylinderGeometry(r, r, .016, 22), o.mat || mat.steel, 0, r + .1, 0, 'steel', { parent: hinge, rx: Math.PI / 2, cast: true });
    const t = { hinge, disc, up: !o.down, ang: o.down ? -1.5 : 0, timer: 0, reset: o.reset, popper: !!o.down, z };
    hinge.rotation.x = t.ang;
    disc.userData.onHit = () => {
      if (!t.up || t.ang < -.5) return { score: 0, ding: 1.25 };
      t.up = false; t.timer = t.reset;
      return { score: o.score, label: o.label || 'PLATE', ding: .6 / r * .25 + .6, target: t };
    };
    targets.push(t);
    return t;
  }
  // Plate rack at 15 m.
  box(4.4, .08, .12, mat.metal, 2.6, 1.15, -15, 'steel', { cast: true });
  for (const x of [.6, 4.6]) box(.1, 1.15, .1, mat.metal, x, .57, -15, 'steel', { cast: true });
  const rack = [];
  for (let i = 0; i < 6; i++) rack.push(plate(.9 + i * .68, 1.19, -15, .13, { score: 5, reset: 4, mat: i % 2 ? mat.steelYellow : mat.steel }));
  // Pop-up targets, used by the timed drill.
  const poppers = [];
  for (const [x, d, r] of [[-8, 14, .2], [-5.5, 28, .25], [-1, 34, .26], [3.2, 40, .3], [8.2, 22, .22], [-8.5, 42, .32], [0, 9, .16], [8.6, 46, .34], [-3.4, 46, .32], [5.2, 11, .17]]) {
    box(.5, .1, .3, mat.metal, x, .05, -d, 'steel');
    poppers.push(plate(x, .1, -d, r, { down: true, score: Math.round(d * 4 / 10) * 10, reset: 1e9, label: 'POP-UP', mat: mat.steelRed }));
  }
  // Long-range gongs: they swing when hit.
  for (const [x, d, r, score] of [[9.2, 50, .32, 30], [-7.5, 75, .42, 50], [2.5, 100, .55, 80]]) {
    const top = 2 * r + 1.5;
    box(2 * r + 1, .1, .1, mat.metal, x, top, -d, 'steel');
    for (const sx of [-1, 1]) box(.1, top, .1, mat.metal, x + sx * (r + .5), top / 2, -d, 'steel', { cast: true });
    const pivot = new T.Group(); pivot.position.set(x, top, -d); scene.add(pivot);
    for (const sx of [-1, 1]) box(.02, .5, .02, mat.metal, sx * r * .6, -.25, 0, null, { parent: pivot });
    const disc = add(new T.CylinderGeometry(r, r, .03, 24), mat.steelYellow, 0, -.45 - r, 0, 'steel', { parent: pivot, rx: Math.PI / 2, cast: true });
    const g = { ang: 0, vel: 0 };
    disc.userData.onHit = () => { g.vel -= 3.2; return { score, label: d + 'm GONG', ding: .25 / r + .2, far: d, good: true }; };
    updaters.push(dt => {
      g.vel += (-14 * Math.sin(g.ang) - 1.1 * g.vel) * dt; g.ang += g.vel * dt; pivot.rotation.x = g.ang;
    });
  }

  updaters.push(dt => {
    for (const t of targets) {
      if (!t.up && !t.popper) { t.timer -= dt; if (t.timer <= 0) t.up = true; }
      const goal = t.up ? 0 : -1.5;
      if (t.ang !== goal) {
        const sp = (t.up ? 5 : 11) * dt;
        t.ang = t.ang < goal ? Math.min(goal, t.ang + sp) : Math.max(goal, t.ang - sp);
        t.hinge.rotation.x = t.ang;
      }
    }
  });

  return {
    shootables, poppers, rack, sky,
    update(dt, t) { for (const u of updaters) u(dt, t); },
    resetTargets() { for (const t of targets) t.up = !t.popper; },
  };
}

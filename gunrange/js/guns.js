// The five guns: low-poly models built from primitives, stats, and hand-keyed clips.
// Gun space: barrel points down -Z, +Y up, +X right, origin at the top of the grip.
// Clip rotations (degrees): r.x+ muzzle up, r.y+ muzzle left, r.z+ top of gun rolls left.
import * as THREE from '../../vendor/three.module.min.js';
import { compile } from './anim.js';

const T = THREE;
const std = (color, metalness, roughness, o = {}) => new T.MeshStandardMaterial({ color, metalness, roughness, ...o });
export const m = {
  steel: std(0x464b54, .8, .38), black: std(0x202227, .35, .5), poly: std(0x2b2e34, .05, .7),
  stainless: std(0xc0c5cc, .95, .25), wood: std(0x8a5329, 0, .5), woodDark: std(0x55331b, 0, .6),
  brass: std(0xd9ad52, 1, .28), tan: std(0x91805d, .05, .8), olive: std(0x505943, .05, .8),
  glove: std(0x9a7650, 0, .8), knuckle: std(0x5d4630, 0, .7), sleeve: std(0x414f40, 0, .95),
  red: std(0xb5281f, .1, .55), hole: std(0x040404, 0, 1),
  lens: std(0x2a4a70, .3, .05, { transparent: true, opacity: .4 }),
  glass: std(0x9fc4d8, .1, .05, { transparent: true, opacity: .16 }),
  dot: new T.MeshBasicMaterial({ color: 0xff2a1a }),
};

export function B(parent, mat, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
  const o = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
  o.position.set(x, y, z); o.rotation.set(rx, ry, rz); parent.add(o); return o;
}
// Cylinder along an axis; rFront is the radius at the -Z (or -X / -Y) end.
export function C(parent, mat, r, len, x, y, z, axis = 'z', rFront = r, seg = 14) {
  const o = new T.Mesh(new T.CylinderGeometry(r, rFront, len, seg), mat);
  if (axis === 'z') o.rotation.x = Math.PI / 2;
  if (axis === 'x') o.rotation.z = -Math.PI / 2;
  o.position.set(x, y, z); parent.add(o); return o;
}
export function N(parent, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const o = new T.Group(); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); parent.add(o); return o;
}

// Right hand wrapped round a grip. Origin = top of the grip, tilted with it.
export function gripHand(parent, x, y, z, rx) {
  const h = N(parent, x, y, z, rx);
  B(h, m.glove, .056, .084, .068, .005, -.054, .016);          // palm
  B(h, m.glove, .052, .062, .026, -.003, -.064, -.03);         // fingers round the front
  B(h, m.knuckle, .054, .02, .012, -.003, -.04, -.044);        // knuckle pad
  B(h, m.glove, .015, .019, .062, -.026, -.014, -.006);        // thumb
  B(h, m.glove, .013, .015, .05, .024, -.014, -.03);           // trigger finger
  B(h, m.glove, .06, .054, .06, .008, -.078, .07, .3);         // heel of the hand
  B(h, m.sleeve, .066, .06, .03, .01, -.095, .1, .3);          // cuff
  h.userData.wrist = N(h, .01, -.1, .11);
  return h;
}
// Left hand as an open cup. Origin = centre of the palm, fingers on +X, thumb on -X.
export function cupHand(parent, x, y, z, rx = 0, ry = 0, rz = 0) {
  const h = N(parent, x, y, z, rx, ry, rz);
  h.scale.setScalar(.88);
  B(h, m.glove, .078, .028, .096, 0, -.014, 0);                // palm
  B(h, m.glove, .022, .056, .088, .042, .012, -.003);          // fingers
  B(h, m.knuckle, .012, .02, .08, .054, .03, -.003);
  B(h, m.glove, .018, .04, .036, -.042, .008, .022);           // thumb
  B(h, m.glove, .064, .042, .05, -.004, -.02, .066);           // heel
  B(h, m.sleeve, .07, .05, .03, -.006, -.024, .1);             // cuff
  h.userData.wrist = N(h, -.006, -.026, .115);
  return h;
}
export function casing(kind) {
  const g = new T.Group();
  if (kind === 'shell') {
    C(g, m.red, .0095, .044, 0, 0, -.008); C(g, m.brass, .0098, .014, 0, 0, .02);
  } else {
    const L = kind === 'rifle' ? .042 : kind === 'long' ? .05 : .02, r = kind === 'pistol' ? .0048 : .0055;
    C(g, m.brass, r, L, 0, 0, 0, 'z', kind === 'pistol' || kind === 'magnum' ? r : r * .7);
  }
  return g;
}

// ───────────────────────────── models ─────────────────────────────

export function buildPistol(o = {}) {
  const root = new T.Group(), P = { root };
  const len = o.len || 0, SM = o.slideMat || m.steel, FM = o.frameMat || m.poly, fz = -len / 2;
  B(root, FM, .030, .026, .165 + len, 0, 0, -.045 + fz);                // frame
  B(root, FM, .026, .012, .05, 0, -.017, -.1 - len);                    // accessory rail
  const grip = N(root, 0, -.008, .018, -.2);
  B(grip, o.gripMat || FM, .030, .1, .048, 0, -.05, 0);
  P.mag = N(grip);
  B(P.mag, m.steel, .022, .1, .034, 0, -.052, 0);
  B(P.mag, m.black, .031, .009, .052, 0, -.105, .001);
  if (o.magExt) { B(P.mag, m.steel, .024, o.magExt, .036, 0, -.109 - o.magExt / 2, .001); B(P.mag, m.black, .031, .009, .052, 0, -.112 - o.magExt, .001); }
  B(root, FM, .008, .005, .054, 0, -.047, -.04);                        // trigger guard
  B(root, FM, .008, .034, .005, 0, -.031, -.066);
  B(root, m.steel, .005, .022, .006, 0, -.026, -.034, .3);              // trigger
  const bx = o.supp ? .03 : o.comp ? .0 : 0;
  C(root, m.stainless, .0065, .18 + len + bx, 0, .029, -.047 + fz - bx / 2);  // barrel
  let mz = -.1375 - len;
  if (o.supp) { C(root, m.black, .0165, .15, 0, .029, mz - .09); mz -= .165; }
  if (o.comp) { B(root, m.black, .03, .034, .04, 0, .029, mz - .02); B(root, m.hole, .031, .006, .008, 0, .04, mz - .02); mz -= .04; }
  C(root, m.hole, .0042, .002, 0, .029, mz - .0005);
  const s = P.slide = N(root, 0, .029, -.04);
  B(s, SM, .031, .032, .19 + len, 0, 0, fz);
  B(s, m.hole, .0125, .0125, .036, .0098, .0102, -.012);                // ejection port
  B(s, m.stainless, .008, .008, .03, .0105, .0105, -.012);              // chamber hood
  B(s, m.black, .004, .007, .008, 0, .0195, -.086 - len);               // front sight
  B(s, m.black, .006, .007, .008, -.008, .0195, .086);                  // rear sight
  B(s, m.black, .006, .007, .008, .008, .0195, .086);
  for (let i = 0; i < 5; i++) for (const sx of [-1, 1]) B(s, m.black, .001, .024, .004, sx * .0156, 0, .05 + i * .008);
  if (o.ports) for (let i = 0; i < 3; i++) B(s, m.hole, .0315, .006, .012, 0, .008, -.05 - len - i * .02);
  P.rh = gripHand(root, 0, -.008, .018, -.2);
  P.lh = cupHand(root, -.02, -.078, 0, 0, 0, -.95);
  return { root, parts: P, muzzle: N(root, 0, .029, mz - .005), eject: N(root, .022, .046, -.05) };
}

export function buildRevolver(o = {}) {
  const root = new T.Group(), P = { root }, S = o.frame || m.stainless, len = o.len || .135, fz = -.0805 - len;
  B(root, S, .014, .008, .078, 0, .061, -.035);                          // top strap
  B(root, S, .018, .016, .078, 0, .006, -.032);                          // lower frame
  B(root, S, .02, .062, .022, 0, .034, .014);                            // recoil shield
  B(root, S, .018, .06, .014, 0, .034, -.076);                           // barrel shroud root
  C(root, S, .0095, len, 0, .046, fz + len / 2);                               // barrel
  C(root, m.hole, .0048, .002, 0, .046, fz - .0007);
  if (len > .05) B(root, S, .012, .016, len - .02, 0, .028, fz + len / 2 + .01);                          // under-lug
  B(root, S, .006, .006, len, 0, .058, fz + len / 2);                          // rib
  B(root, m.black, .004, .011, .016, 0, .066, fz + .0125);                    // front sight
  B(root, m.black, .016, .007, .012, 0, .067, .004);                     // rear sight
  B(root, S, .008, .005, .048, 0, -.032, -.022);                         // trigger guard
  B(root, S, .008, .032, .005, 0, -.017, -.045);
  B(root, S, .005, .02, .005, 0, -.014, -.016, .25);                     // trigger
  const grip = N(root, 0, 0, .022, -.32);
  B(grip, o.gripMat || m.wood, .027, .092, .04, 0, -.05, 0);
  B(grip, o.gripCap || m.woodDark, .029, .022, .046, 0, -.093, .002);
  C(grip, m.brass, .005, .029, 0, -.03, 0, 'x');                         // medallion
  P.hammer = N(root, 0, .034, .022);
  B(P.hammer, m.steel, .007, .024, .008, 0, .016, .004);
  B(P.hammer, m.steel, .011, .005, .013, 0, .028, .011);
  // Cylinder on a crane that swings out to the left.
  P.crane = N(root, -.014, .012, -.034);
  B(P.crane, S, .006, .02, .05, .003, .004, 0);
  P.cyl = N(P.crane, .014, .022, 0);
  C(P.cyl, S, .0215, .044, 0, 0, 0, 'z', .0215, 18);
  C(P.cyl, S, .003, .07, 0, 0, -.012);                                   // ejector rod
  const rounds = N(P.cyl);
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 2 + i * Math.PI / 3, x = Math.cos(a) * .0125, y = Math.sin(a) * .0125;
    C(P.cyl, m.hole, .0052, .001, x, y, -.0224);
    C(rounds, m.brass, .0058, .003, x, y, .0232);
    C(P.cyl, m.steel, .0045, .03, Math.cos(a + Math.PI / 6) * .0215, Math.sin(a + Math.PI / 6) * .0215, -.006);  // flutes
  }
  // Speedloader, only visible mid-reload. Rest pose = seated behind the open cylinder.
  P.loader = N(root, -.0325, .0302, .006);
  C(P.loader, m.black, .019, .012, 0, 0, .012);
  C(P.loader, m.black, .008, .018, 0, 0, .026);
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 2 + i * Math.PI / 3;
    C(P.loader, m.brass, .0052, .03, Math.cos(a) * .0125, Math.sin(a) * .0125, -.008);
  }
  P.loader.visible = false;
  P.rh = gripHand(root, 0, 0, .022, -.32);
  P.lh = cupHand(root, -.02, -.076, .004, 0, 0, -.95);
  return { root, parts: P, rounds, muzzle: N(root, 0, .046, fz - .005), eject: N(root, -.035, .03, .02) };
}

export function buildCarbine() {
  const root = new T.Group(), P = { root };
  B(root, m.poly, .034, .046, .17, 0, .004, -.03);                       // lower receiver
  B(root, m.steel, .034, .036, .22, 0, .045, -.045);                     // upper receiver
  B(root, m.black, .02, .006, .21, 0, .066, -.045);                      // top rail
  B(root, m.tan, .042, .046, .24, 0, .044, -.275);                       // handguard
  B(root, m.black, .02, .006, .24, 0, .07, -.275);
  for (let i = 0; i < 5; i++) for (const sx of [-1, 1]) B(root, m.hole, .002, .012, .028, sx * .0205, .05, -.19 - i * .042);
  C(root, m.steel, .008, .13, 0, .044, -.455);                           // barrel
  C(root, m.black, .0125, .055, 0, .044, -.535);                         // muzzle device
  C(root, m.hole, .005, .002, 0, .044, -.5632);
  B(root, m.black, .008, .03, .012, 0, .078, -.38);                      // front post
  C(root, m.black, .0135, .17, 0, .04, .12);                             // buffer tube
  B(root, m.tan, .036, .072, .1, 0, .024, .2);                           // stock
  B(root, m.black, .038, .1, .016, 0, .014, .256);
  const grip = N(root, 0, -.016, .035, -.3);
  B(grip, m.tan, .03, .088, .04, 0, -.046, 0);
  B(root, m.poly, .008, .005, .052, 0, -.036, -.012);                    // trigger guard
  B(root, m.steel, .005, .02, .005, 0, -.026, .0, .25);
  B(root, m.poly, .036, .03, .062, 0, -.022, -.068);                     // magwell
  P.mag = N(root, 0, -.02, -.068, .1);
  B(P.mag, m.steel, .025, .12, .05, 0, -.055, 0);
  B(P.mag, m.steel, .025, .07, .05, 0, -.135, -.01, .17);
  B(P.mag, m.black, .028, .008, .054, 0, -.171, -.016, .17);
  B(root, m.hole, .003, .018, .052, .0162, .05, -.04);                   // ejection port
  P.bolt = N(root, .017, .05, -.04);
  B(P.bolt, m.stainless, .003, .016, .052, 0, 0, 0);
  P.charge = N(root, -.022, .054, -.1);                                  // left-side charging handle
  B(P.charge, m.black, .012, .01, .022, 0, 0, 0);
  B(P.charge, m.black, .006, .006, .05, .003, 0, .03);
  // Red dot sight.
  B(root, m.black, .026, .012, .05, 0, .075, -.03);
  for (const sx of [-1, 1]) B(root, m.black, .004, .034, .036, sx * .018, .098, -.03);
  B(root, m.black, .04, .004, .036, 0, .116, -.03);
  B(root, m.glass, .032, .032, .001, 0, .098, -.04);
  const dot = new T.Mesh(new T.CircleGeometry(.0011, 10), m.dot); dot.position.set(0, .098, -.0392); root.add(dot);
  P.rh = gripHand(root, 0, -.016, .035, -.3);
  P.lh = cupHand(root, 0, .018, -.28);
  return { root, parts: P, muzzle: N(root, 0, .044, -.565), eject: N(root, .03, .052, -.04) };
}

export function buildShotgun(o = {}) {
  const root = new T.Group(), P = { root }, bl = o.barrel || .5, tl = bl - .1, W = o.wood || m.wood, WD = o.woodDark || m.woodDark, ST = o.metal || m.steel;
  B(root, ST, .036, .056, .2, 0, .03, -.03);                        // receiver
  B(root, m.hole, .02, .003, .075, 0, .0015, -.05);                      // loading port
  B(root, m.hole, .003, .02, .062, .0172, .04, -.045);                   // ejection port
  C(root, ST, .0105, bl, 0, .046, -.13 - bl / 2);                            // barrel
  C(root, m.hole, .0085, .002, 0, .046, -.1305 - bl);
  C(root, ST, .0105, tl, 0, .02, -.13 - tl / 2);                             // magazine tube
  C(root, m.black, .012, .02, 0, .02, -.135 - tl);
  B(root, m.black, .014, .045, .014, 0, .033, -.1 - tl);                      // barrel clamp
  C(root, m.brass, .0028, .006, 0, .058, -.12 - bl, 'y');
  if (o.shield) B(root, m.black, .03, .012, bl - .2, 0, .062, -.2 - (bl - .2) / 2);                     // bead
  B(root, W, .03, .042, .11, 0, .002, .105, -.3);                   // wrist of the stock
  B(root, W, .032, .085, .2, 0, -.03, .255, -.12);
  B(root, m.black, .034, .1, .016, 0, -.044, .358, -.12);
  B(root, m.steel, .008, .005, .05, 0, -.014, .01);                      // trigger guard
  B(root, m.steel, .005, .016, .005, 0, -.006, .012, .25);
  P.pump = N(root, 0, .02, -.3);
  B(P.pump, W, .046, .042, .15, 0, 0, 0);
  for (let i = 0; i < 7; i++) B(P.pump, WD, .048, .03, .004, 0, -.002, -.06 + i * .02);
  for (const sx of [-1, 1]) B(P.pump, m.steel, .003, .006, .15, sx * .014, .004, .14);
  P.shell = N(root, 0, -.012, -.05);
  P.shell.add(casing('shell')); P.shell.visible = false;
  P.rh = gripHand(root, 0, .012, .075, -.55);
  P.lh = cupHand(P.pump, 0, -.022, 0);
  return { root, parts: P, muzzle: N(root, 0, .046, -.135 - bl), eject: N(root, .03, .042, -.045) };
}

export function buildSniper(o = {}) {
  const root = new T.Group(), P = { root }, bl = o.barrel || .52, BD = o.body || m.olive, br = o.heavy ? 1.45 : 1;
  B(root, BD, .042, .048, .5, 0, .004, -.1);                        // chassis / fore-end
  B(root, BD, .034, .05, .1, 0, -.012, .1, -.45);                   // grip wrist
  B(root, BD, .04, .1, .22, 0, -.02, .28);                          // butt
  B(root, m.black, .03, .022, .14, 0, .042, .26);                        // cheek riser
  B(root, m.black, .042, .11, .018, 0, -.02, .396);
  C(root, m.steel, .0175, .23, 0, .042, -.02);                           // receiver
  C(root, m.steel, .012 * br, bl, 0, .042, -.13 - bl / 2, 'z', .0092 * br);                // barrel
  if (o.heavy) { B(root, m.black, .05, .03, .07, 0, .042, -.165 - bl); B(root, m.hole, .052, .012, .014, 0, .042, -.15 - bl); B(root, m.hole, .052, .012, .014, 0, .042, -.18 - bl); }
  else C(root, m.black, .014, .06, 0, .042, -.15 - bl);                            // brake
  C(root, m.hole, .005 * br, .002, 0, .042, -.1805 - bl - (o.heavy ? .02 : 0));
  if (o.bipod) for (const sx of [-1, 1]) B(root, m.black, .008, .008, .2, sx * .02, -.02, -.42, 0, sx * .06, 0);
  B(root, m.steel, .008, .005, .05, 0, -.024, .02);                      // trigger guard
  B(root, m.steel, .005, .016, .005, 0, -.014, .024, .25);
  // Scope.
  C(root, m.black, .0155, .27, 0, .094, -.04);
  C(root, m.black, .0155, .075, 0, .094, -.205, 'z', .025);
  C(root, m.black, .021, .065, 0, .094, .115, 'z', .0155);
  C(root, m.lens, .0235, .002, 0, .094, -.243, 'z', .0235, 20);
  C(root, m.lens, .0195, .002, 0, .094, .148, 'z', .0195, 20);
  C(root, m.black, .0095, .022, 0, .116, -.04, 'y');
  C(root, m.black, .0095, .022, .022, .094, -.04, 'x');
  for (const z of [-.105, .03]) B(root, m.steel, .014, .034, .016, 0, .07, z);
  P.mag = N(root, 0, -.02, -.035);
  B(P.mag, m.steel, .03, .055, .075, 0, -.024, 0);
  B(P.mag, m.black, .032, .008, .078, 0, -.054, 0);
  // Bolt: rotates up about the bore axis, then slides back.
  P.bolt = N(root, 0, .042, .075);
  C(P.bolt, m.stainless, .0085, .085, 0, 0, 0);
  C(P.bolt, m.steel, .012, .022, 0, 0, .05);                             // shroud
  B(P.bolt, m.stainless, .034, .007, .008, .026, -.006, .03, 0, 0, -.35);
  const knob = new T.Mesh(new T.SphereGeometry(.0105, 10, 8), m.black); knob.position.set(.045, -.013, .03); P.bolt.add(knob);
  P.rh = gripHand(root, 0, .004, .075, -.5);
  P.lh = cupHand(root, 0, -.022, -.24);
  return { root, parts: P, muzzle: N(root, 0, .042, -.185 - bl - (o.heavy ? .02 : 0)), eject: N(root, .03, .05, .0) };
}

// ───────────────────────────── clips ─────────────────────────────

export const drawClip = (dur, ev = []) => ({
  dur,
  tracks: { root: {
    p: [[0, .04, -.34, .1], [dur * .62, 0, .014, -.012], [dur * .82, 0, -.003, .002], [dur, 0, 0, 0]],
    r: [[0, -58, -14, 20], [dur * .62, 6, 1.5, -3], [dur * .82, -1, 0, .5], [dur, 0, 0, 0]],
  } },
  events: [[.01, 'cloth'], ...ev],
});
const holsterClip = { dur: .22, tracks: { root: {
  p: [[0, 0, 0, 0], [.08, 0, .008, 0], [.22, .04, -.34, .1]],
  r: [[0, 0, 0, 0], [.08, 3, 0, 0], [.22, -50, -12, 18]],
} }, events: [[.02, 'cloth']] };

export const LH_AWAY = [-.06, -.32, .08];   // left hand parked off-screen

export function pistolReload(empty) {
  const end = empty ? 1.9 : 1.65, hold = empty ? 1.56 : 1.3;
  const tr = {
    root: {
      p: [[0, 0, 0, 0], [.22, -.045, .07, .02], [.4, -.05, .062, .02], [1.02, -.045, .066, .02], [1.11, -.045, .082, .02], [1.24, -.045, .066, .02], [hold, -.04, .06, .02], [end, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.22, 32, 18, -48], [.34, 40, 19, -56], [.5, 30, 18, -46], [1.02, 29, 17, -45], [1.11, 34, 17, -47], [1.24, 29, 17, -45], [hold, 24, 13, -34], [end, 0, 0, 0]],
    },
    mag: {
      p: [[.3, 0, 0, 0], [.4, 0, -.06, 0], [.56, 0, -.36, .02], [.74, -.02, -.36, .03], [1.02, 0, -.04, 0], [1.1, 0, 0, 0]],
      r: [[.3, 0, 0, 0], [.56, -20, 0, 0], [.74, 0, 0, 12], [1.02, 0, 0, 0]],
    },
    lh: {
      p: [[.08, 0, 0, 0], [.32, ...LH_AWAY], [.74, -.01, -.4, .04], [1.02, .012, -.108, .016], [1.1, .012, -.07, .016], [1.26, .012, -.075, .016], [hold + .3, 0, 0, 0]],
      r: [[.08, 0, 0, 0], [.32, 0, 0, 30], [.74, 0, 0, 55], [1.26, 0, 0, 55], [hold + .3, 0, 0, 0]],
    },
  };
  const events = [[.3, 'magOut'], [1.09, 'magIn'], [1.1, 'ammo']];
  if (empty) {
    tr.root.p.splice(-2, 0, [1.42, -.045, .066, .02], [1.47, -.045, .058, .004]);
    tr.root.r.splice(-2, 0, [1.42, 29, 17, -45], [1.47, 23, 17, -44]);
    events.push([1.42, 'slideRelease']);
  }
  return { dur: end, tracks: tr, events };
}

export const pistolInspect = {
  dur: 3.5,
  tracks: {
    root: {
      p: [[0, 0, 0, 0], [.4, -.1, .075, .04], [1.15, -.105, .08, .04], [1.55, -.09, .05, .03], [2.2, -.095, .055, .03], [2.6, -.08, .05, 0], [2.95, -.08, .05, .004], [3.03, -.08, .046, -.008], [3.5, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.4, 16, 62, 22], [1.15, 22, 70, 28], [1.55, 12, 30, 80], [2.2, 17, 38, 90], [2.6, 12, 56, 12], [2.95, 13, 57, 13], [3.03, 9, 56, 12], [3.5, 0, 0, 0]],
    },
    lh: {
      p: [[.05, 0, 0, 0], [.35, ...LH_AWAY], [2.3, ...LH_AWAY], [2.62, .004, .125, .05], [2.86, .004, .125, .076], [3.0, -.03, .1, .1], [3.42, 0, 0, 0]],
      r: [[.05, 0, 0, 0], [.35, 0, 0, 30], [2.3, 0, 0, 0], [2.62, 0, 0, -36], [3.0, 0, 0, -30], [3.42, 0, 0, 0]],
    },
    slide: { p: [[2.64, 0, 0, 0], [2.86, 0, 0, .026], [2.93, 0, 0, .026], [2.96, 0, 0, 0]] },
  },
  events: [[.02, 'cloth'], [1.2, 'cloth'], [2.66, 'boltBack'], [2.95, 'slideRelease']],
};

export const revolverReload = {
  dur: 2.75,
  tracks: {
    root: {
      p: [[0, 0, 0, 0], [.28, -.05, .05, .03], [.62, -.055, .075, .03], [.72, -.055, .05, .03], [1.05, -.06, .03, .02], [1.6, -.06, .034, .02], [1.66, -.06, .026, .014], [2.0, -.05, .04, .02], [2.12, -.03, .04, .02], [2.75, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.28, 30, 16, 26], [.58, 68, 14, 22], [.76, 62, 14, 22], [1.05, -34, 50, 34], [1.6, -36, 50, 34], [1.66, -39, 50, 34], [2.0, 10, 20, 34], [2.12, 12, 14, -24], [2.3, 10, 12, 4], [2.75, 0, 0, 0]],
    },
    crane: { r: [[.14, 0, 0, 0], [.3, 0, 0, 86], [2.02, 0, 0, 86], [2.11, 0, 0, 0]] },
    cyl: { r: [[.14, 0, 0, 0], [.34, 0, 0, 40], [2.0, 0, 0, 40], [2.12, 0, 0, 60]] },
    lh: {
      p: [[.05, 0, 0, 0], [.3, -.03, .06, -.02], [.56, -.03, .1, -.06], [.64, -.03, .1, -.03], [.9, ...LH_AWAY], [1.1, -.05, -.3, .2], [1.48, -.02, .1, .075], [1.6, -.02, .1, .04], [1.9, -.06, -.3, .12], [2.3, -.04, -.2, .06], [2.7, 0, 0, 0]],
      r: [[.05, 0, 0, 0], [.3, 0, 0, 20], [.9, 0, 0, 30], [1.48, 30, 0, 40], [1.9, 0, 0, 30], [2.7, 0, 0, 0]],
    },
    loader: { p: [[0, .02, -.3, .2], [1.1, .02, -.3, .2], [1.46, 0, 0, .034], [1.6, 0, 0, 0], [2.75, 0, 0, 0]] },
  },
  events: [[.02, 'cloth'], [.18, 'cylOpen'], [.62, 'eject'], [1.05, 'loaderShow'], [1.6, 'ammo'], [1.6, 'shellIn'], [2.08, 'cylClose']],
};

export const revolverInspect = {
  dur: 4.2,
  tracks: {
    root: {
      p: [[0, 0, 0, 0], [.45, -.1, .07, .04], [1.0, -.1, .075, .04], [2.3, -.105, .08, .04], [2.42, -.085, .08, .04], [2.75, -.09, .05, .03], [3.5, -.095, .055, .03], [4.2, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.45, 18, 58, 20], [1.0, 22, 62, 30], [2.3, 24, 64, 32], [2.42, 22, 50, -6], [2.75, 12, 30, 80], [3.5, 17, 38, 90], [4.2, 0, 0, 0]],
    },
    crane: { r: [[.7, 0, 0, 0], [.86, 0, 0, 86], [2.32, 0, 0, 86], [2.41, 0, 0, 0]] },
    cyl: { r: [[.95, 0, 0, 0], [1.25, 0, 0, 420], [2.2, 0, 0, 1080]] },
    hammer: { r: [[2.8, 0, 0, 0], [3.0, 38, 0, 0], [3.3, 38, 0, 0], [3.42, 0, 0, 0]] },
    lh: { p: [[.05, 0, 0, 0], [.35, ...LH_AWAY], [3.6, ...LH_AWAY], [4.15, 0, 0, 0]], r: [[.05, 0, 0, 0], [.35, 0, 0, 30], [3.6, 0, 0, 30], [4.15, 0, 0, 0]] },
  },
  events: [[.02, 'cloth'], [.74, 'cylOpen'], [1.0, 'spin'], [2.38, 'cylClose'], [2.5, 'cloth'], [3.0, 'hammer'], [3.4, 'boltDown']],
};

export function carbineReload(empty, dz = .2, dy = -.185) {
  const end = empty ? 2.6 : 2.2, hold = empty ? 2.25 : 1.85;
  const tr = {
    root: {
      p: [[0, 0, 0, 0], [.28, -.02, .05, -.04], [.46, -.024, .046, -.04], [1.42, -.02, .05, -.04], [1.5, -.02, .064, -.04], [1.64, -.02, .05, -.04], [hold, -.018, .044, -.03], [end, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.28, 22, 14, -38], [.42, 18, 14, -44], [.6, 23, 14, -38], [1.42, 22, 13, -37], [1.5, 26, 13, -39], [1.64, 22, 13, -37], [hold, 18, 10, -28], [end, 0, 0, 0]],
    },
    mag: {
      p: [[.4, 0, 0, 0], [.48, 0, -.05, 0], [.72, .02, -.5, .04], [1.0, .02, -.5, .06], [1.36, 0, -.06, .012], [1.44, 0, -.03, 0], [1.5, 0, 0, 0]],
      r: [[.4, 0, 0, 0], [.72, -25, 0, 10], [1.0, 14, 0, 0], [1.36, 6, 0, 0], [1.5, 0, 0, 0]],
    },
    lh: {
      p: [[.05, 0, 0, 0], [.36, 0, dy, dz], [.48, 0, dy - .05, dz], [.72, .02, dy - .5, dz + .04], [1.0, .02, dy - .5, dz + .06], [1.36, 0, dy - .06, dz + .012], [1.44, 0, dy - .03, dz], [1.5, 0, dy, dz], [1.62, 0, dy - .005, dz]],
      r: [[.05, 0, 0, 0], [.36, 6, 0, 0], [.72, -20, 0, 10], [1.36, 6, 0, 0]],
    },
  };
  const events = [[.02, 'cloth'], [.42, 'magOut'], [1.48, 'magIn'], [1.5, 'ammo']];
  if (empty) {
    tr.lh.p.push([1.9, -.03, dy + .095, dz], [1.97, -.012, dy + .095, dz], [2.06, -.03, dy + .085, dz], [2.6, 0, 0, 0]);
    tr.lh.r.push([1.9, 0, 0, -60], [2.06, 0, 0, -60], [2.6, 0, 0, 0]);
    tr.root.p.splice(-2, 0, [1.97, -.02, .05, -.04], [2.03, -.012, .05, -.05]);
    tr.root.r.splice(-2, 0, [1.97, 22, 13, -37], [2.03, 20, 11, -33]);
    events.push([1.98, 'slideRelease']);
  } else {
    tr.lh.p.push([2.1, 0, 0, 0]); tr.lh.r.push([1.7, 4, 0, 0], [2.1, 0, 0, 0]);
  }
  return { dur: end, tracks: tr, events };
}

export const carbineInspect = (dz = .2, dy = -.185) => ({
  dur: 4.6,
  tracks: {
    root: {
      p: [[0, 0, 0, 0], [.5, -.03, .03, -.05], [1.3, -.035, .035, -.05], [1.8, -.02, .03, -.03], [2.6, -.022, .034, -.03], [3.0, -.02, .05, -.04], [3.7, -.02, .05, -.04], [3.78, -.02, .062, -.04], [3.9, -.02, .05, -.04], [4.6, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.5, 10, 40, 22], [1.3, 14, 46, 28], [1.8, 8, 12, 62], [2.6, 11, 15, 68], [3.0, 22, 14, -38], [3.7, 22, 13, -37], [3.78, 26, 13, -39], [3.9, 22, 13, -37], [4.6, 0, 0, 0]],
    },
    mag: { p: [[3.05, 0, 0, 0], [3.3, 0, -.09, 0], [3.6, 0, -.09, 0], [3.76, 0, 0, 0]], r: [[3.05, 0, 0, 0], [3.3, -8, 0, 0], [3.6, -8, 0, 0], [3.76, 0, 0, 0]] },
    lh: {
      p: [[2.65, 0, 0, 0], [3.0, 0, dy, dz], [3.3, 0, dy - .09, dz], [3.6, 0, dy - .09, dz], [3.76, 0, dy, dz], [3.95, 0, dy - .005, dz], [4.5, 0, 0, 0]],
      r: [[2.65, 0, 0, 0], [3.0, 6, 0, 0], [3.95, 6, 0, 0], [4.5, 0, 0, 0]],
    },
  },
  events: [[.02, 'cloth'], [1.35, 'cloth'], [2.65, 'cloth'], [3.08, 'magOut'], [3.74, 'magIn']],
});

export const SG_TILT_P = [-.03, .06, -.03];
export const SG_TILT_R = [14, 12, -62];
const sgHold = (a, b) => ({ p: [[a, ...SG_TILT_P], [b, ...SG_TILT_P]], r: [[a, ...SG_TILT_R], [b, ...SG_TILT_R]] });
export const SG_LH_DOWN_P = [.0, -.3, .3];
export const SG_LH_PORT = [0, -.042, .25];
export const shotgunClips = {
  pump: {
    dur: .5,
    tracks: {
      root: { p: [[0, 0, 0, 0], [.14, .004, -.006, .016], [.32, -.002, .004, -.01], [.5, 0, 0, 0]], r: [[0, 0, 0, 0], [.14, 4, -2, -5], [.32, -1.5, 1, 2], [.5, 0, 0, 0]] },
      pump: { p: [[.03, 0, 0, 0], [.14, 0, 0, .092], [.2, 0, 0, .092], [.32, 0, 0, 0]] },
    },
    events: [[.06, 'pump1'], [.12, 'ejectShell'], [.24, 'pump2']],
  },
  reloadStart: {
    dur: .42,
    tracks: {
      root: { p: [[0, 0, 0, 0], [.42, ...SG_TILT_P]], r: [[0, 0, 0, 0], [.42, ...SG_TILT_R]] },
      lh: { p: [[.04, 0, 0, 0], [.42, ...SG_LH_DOWN_P]], r: [[.04, 0, 0, 0], [.42, 0, 0, 20]] },
      shell: { p: [[0, 0, -.26, .05], [.42, 0, -.26, .05]] },
    },
    events: [[.02, 'cloth']],
  },
  reloadShell: {
    dur: .56,
    tracks: {
      root: {
        p: [[0, ...SG_TILT_P], [.3, ...SG_TILT_P], [.38, -.03, .066, -.042], [.56, ...SG_TILT_P]],
        r: [[0, ...SG_TILT_R], [.3, ...SG_TILT_R], [.38, 16, 12, -60], [.56, ...SG_TILT_R]],
      },
      shell: { p: [[0, 0, -.26, .05], [.26, 0, -.012, .012], [.31, 0, 0, 0], [.4, 0, .012, -.07], [.56, 0, .012, -.07]], r: [[0, 20, 0, 0], [.26, 8, 0, 0], [.31, 0, 0, 0]] },
      lh: {
        p: [[0, ...SG_LH_DOWN_P], [.26, 0, -.054, .262], [.31, ...SG_LH_PORT], [.4, 0, -.03, .2], [.56, ...SG_LH_DOWN_P]],
        r: [[0, 0, 0, 20], [.26, 0, 0, 0], [.4, 0, 0, 0], [.56, 0, 0, 20]],
      },
    },
    events: [[.0, 'shellShow'], [.34, 'shellIn'], [.38, 'ammo1'], [.4, 'shellHide']],
  },
  reloadEnd: {
    dur: .45,
    tracks: {
      root: { p: [[0, ...SG_TILT_P], [.45, 0, 0, 0]], r: [[0, ...SG_TILT_R], [.45, 0, 0, 0]] },
      lh: { p: [[0, ...SG_LH_DOWN_P], [.4, 0, 0, 0]], r: [[0, 0, 0, 20], [.4, 0, 0, 0]] },
    },
    events: [[.02, 'cloth']],
  },
  inspect: {
    dur: 4.0,
    tracks: {
      root: {
        p: [[0, 0, 0, 0], [.5, -.03, .03, -.05], [1.4, -.035, .035, -.05], [1.9, -.02, .03, -.03], [3.1, -.022, .034, -.03], [4.0, 0, 0, 0]],
        r: [[0, 0, 0, 0], [.5, 10, 38, 22], [1.4, 14, 44, 28], [1.9, 8, 12, 62], [3.1, 11, 15, 68], [4.0, 0, 0, 0]],
      },
      pump: { p: [[2.2, 0, 0, 0], [2.5, 0, 0, .05], [2.8, 0, 0, .05], [2.95, 0, 0, 0]] },
    },
    events: [[.02, 'cloth'], [1.45, 'cloth'], [2.24, 'pump1'], [2.84, 'pump2'], [3.2, 'cloth']],
  },
};

// Bolt cycle. The right hand leaves the grip, so it has its own track.
export const RH_KNOB = [.04, .07, .03];
export const sniperBolt = {
  dur: 1.05,
  tracks: {
    root: {
      p: [[0, 0, 0, 0], [.2, -.006, -.008, .006], [.42, -.006, -.012, .022], [.62, -.004, -.006, -.006], [.78, -.004, -.01, 0], [1.05, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.2, 3, -3, -9], [.42, 6, -4, -12], [.62, 2, -3, -9], [.78, 1, -2, -7], [1.05, 0, 0, 0]],
    },
    bolt: {
      p: [[.28, 0, 0, 0], [.42, 0, 0, .075], [.5, 0, 0, .075], [.62, 0, 0, 0]],
      r: [[.18, 0, 0, 0], [.28, 0, 0, 62], [.62, 0, 0, 62], [.72, 0, 0, 0]],
    },
    rh: {
      p: [[0, 0, 0, 0], [.18, ...RH_KNOB], [.28, .018, .105, .03], [.42, .018, .105, .105], [.5, .018, .105, .105], [.62, .018, .105, .03], [.72, ...RH_KNOB], [.98, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.18, 18, 0, -30], [.72, 18, 0, -30], [.98, 0, 0, 0]],
    },
  },
  events: [[.2, 'boltUp'], [.3, 'boltBack'], [.4, 'ejectShell'], [.52, 'boltFwd'], [.66, 'boltDown']],
};
export const sniperReload = {
  dur: 2.1,
  tracks: {
    root: {
      p: [[0, 0, 0, 0], [.3, -.02, .05, -.04], [1.3, -.02, .05, -.04], [1.38, -.02, .062, -.04], [1.52, -.02, .05, -.04], [2.1, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.3, 20, 12, -38], [.45, 17, 12, -43], [.62, 20, 12, -38], [1.3, 20, 12, -37], [1.38, 23, 12, -39], [1.52, 20, 12, -37], [2.1, 0, 0, 0]],
    },
    mag: {
      p: [[.42, 0, 0, 0], [.5, 0, -.04, 0], [.72, 0, -.45, .05], [.95, 0, -.45, .05], [1.3, 0, -.035, 0], [1.38, 0, 0, 0]],
      r: [[.42, 0, 0, 0], [.72, -20, 0, 0], [.95, 10, 0, 0], [1.3, 0, 0, 0]],
    },
    lh: {
      p: [[.05, 0, 0, 0], [.38, 0, -.07, .2], [.5, 0, -.11, .2], [.72, 0, -.52, .25], [.95, 0, -.52, .25], [1.3, 0, -.105, .2], [1.38, 0, -.07, .2], [1.52, 0, -.075, .2], [2.0, 0, 0, 0]],
      r: [[.05, 0, 0, 0], [.72, -20, 0, 0], [1.3, 0, 0, 0]],
    },
  },
  events: [[.02, 'cloth'], [.44, 'magOut'], [1.36, 'magIn'], [1.38, 'ammo']],
};
export const sniperInspect = {
  dur: 4.4,
  tracks: {
    root: {
      p: [[0, 0, 0, 0], [.55, -.03, .02, -.05], [1.5, -.035, .025, -.05], [2.0, -.02, .03, -.03], [3.4, -.022, .034, -.03], [4.4, 0, 0, 0]],
      r: [[0, 0, 0, 0], [.55, 10, 38, 22], [1.5, 13, 44, 27], [2.0, 8, 12, 56], [3.4, 11, 15, 62], [4.4, 0, 0, 0]],
    },
    bolt: {
      p: [[2.42, 0, 0, 0], [2.62, 0, 0, .06], [2.95, 0, 0, .06], [3.1, 0, 0, 0]],
      r: [[2.3, 0, 0, 0], [2.42, 0, 0, 62], [3.1, 0, 0, 62], [3.2, 0, 0, 0]],
    },
    rh: {
      p: [[2.05, 0, 0, 0], [2.3, ...RH_KNOB], [2.42, .018, .105, .03], [2.62, .018, .105, .09], [2.95, .018, .105, .09], [3.1, .018, .105, .03], [3.2, ...RH_KNOB], [3.5, 0, 0, 0]],
      r: [[2.05, 0, 0, 0], [2.3, 18, 0, -30], [3.2, 18, 0, -30], [3.5, 0, 0, 0]],
    },
  },
  events: [[.02, 'cloth'], [1.55, 'cloth'], [2.32, 'boltUp'], [2.46, 'boltBack'], [2.98, 'boltFwd'], [3.14, 'boltDown'], [3.5, 'cloth']],
};

export const cc = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, compile(v)]));
export const holster = holsterClip;

// spread in degrees; kick = viewmodel recoil; cam = view punch (radians).
export const GUNS = [
  {
    id: 'pistol', name: 'KESTREL 9', sub: '9mm semi-auto', build: buildPistol, sound: 'pistol', casing: 'pistol',
    mag: 15, rpm: 420, auto: false, pellets: 1, type: 'mag', action: 'slide',
    spread: [1.1, .22], bloom: .5, kick: { z: .9, pitch: 2.6, roll: .7 }, cam: .011,
    hip: [.095, -.08, -.42], hipYaw: 3, sightY: .0555, adsZ: -.42, adsFov: 58,
    clips: cc({ draw: drawClip(.42, [[.3, 'hammer']]), holster, reload: pistolReload(false), reloadEmpty: pistolReload(true), inspect: pistolInspect }),
  },
  {
    id: 'revolver', name: 'LONGHORN .357', sub: 'double-action revolver', build: buildRevolver, sound: 'revolver', casing: 'magnum',
    mag: 6, rpm: 170, auto: false, pellets: 1, type: 'revolver', action: 'revolver',
    spread: [1.3, .12], bloom: 1.6, kick: { z: 1.3, pitch: 7, roll: 1.4 }, cam: .034,
    hip: [.095, -.09, -.42], hipYaw: 3, sightY: .0735, adsZ: -.42, adsFov: 56,
    clips: cc({ draw: drawClip(.5, [[.36, 'hammer']]), holster, reload: revolverReload, inspect: revolverInspect }),
  },
  {
    id: 'carbine', name: 'VX-5 CARBINE', sub: '5.56 full-auto', build: buildCarbine, sound: 'carbine', casing: 'rifle',
    mag: 30, rpm: 720, auto: true, pellets: 1, type: 'mag', action: 'bolt',
    spread: [1.6, .1], bloom: .28, kick: { z: .8, pitch: 1.5, roll: .9 }, cam: .0085,
    hip: [.085, -.125, -.3], hipYaw: 2, sightY: .098, adsZ: -.28, adsFov: 50,
    clips: cc({ draw: drawClip(.55, [[.38, 'cloth']]), holster, reload: carbineReload(false), reloadEmpty: carbineReload(true), inspect: carbineInspect() }),
  },
  {
    id: 'shotgun', name: 'BRAWLER 12', sub: '12-gauge pump', build: buildShotgun, sound: 'shotgun', casing: 'shell',
    mag: 6, rpm: 75, auto: false, pellets: 9, type: 'shells', action: 'pump',
    spread: [3.4, 2.6], bloom: 0, kick: { z: 2.2, pitch: 6.5, roll: 1.6 }, cam: .042,
    hip: [.085, -.115, -.3], hipYaw: 2, sightY: .062, adsZ: -.28, adsFov: 58,
    clips: cc({ draw: drawClip(.6, [[.4, 'cloth']]), holster, ...shotgunClips }),
  },
  {
    id: 'sniper', name: 'SENTINEL .308', sub: 'bolt-action, 8x scope', build: buildSniper, sound: 'sniper', casing: 'long',
    mag: 5, rpm: 600, auto: false, pellets: 1, type: 'mag', action: 'boltAction', scope: true,
    spread: [3.2, 0], bloom: 0, kick: { z: 2.4, pitch: 5, roll: 1.2 }, cam: .03,
    hip: [.085, -.13, -.32], hipYaw: 2, sightY: .094, adsZ: -.22, adsFov: 9,
    clips: cc({ draw: drawClip(.7, [[.45, 'cloth']]), holster, reload: sniperReload, bolt: sniperBolt, inspect: sniperInspect }),
  },
];

export function makeCasing(kind) { return casing(kind); }

// Forearms are stretched each frame between a fixed elbow and the animated wrist.
export function makeForearm() {
  const g = new T.CylinderGeometry(.031, .046, 1, 8);
  g.rotateX(Math.PI / 2); g.translate(0, 0, .5);
  return new T.Mesh(g, m.sleeve);
}

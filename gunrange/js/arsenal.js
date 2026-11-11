// The full arsenal: the five original guns plus twenty more.
// Most new guns are variants of the original builders; SMGs, rifles and the auto shotgun
// share one parametric long-gun builder, and three have mechanisms of their own
// (break-action, lever-action, single-action).
import * as THREE from '../../vendor/three.module.min.js';
import {
  m, B, C, N, gripHand, cupHand, casing, GUNS as BASE, cc, holster, drawClip,
  buildPistol, buildRevolver, buildShotgun, buildSniper,
  pistolReload, pistolInspect, revolverReload, revolverInspect, carbineReload, carbineInspect,
  shotgunClips, sniperBolt, sniperReload, sniperInspect,
} from './guns.js';

const T = THREE;
const std = (color, metalness, roughness) => new T.MeshStandardMaterial({ color, metalness, roughness });
const x = {
  blued: std(0x232c3d, .85, .32), nickel: std(0xd9dce0, 1, .18), grey: std(0x5d636b, .1, .7),
  woodLight: std(0xb07a44, 0, .5), woodRed: std(0x7c3a20, 0, .5), rubber: std(0x18191b, 0, .9), green: std(0x3d4a35, .05, .8),
};

export const CATS = ['PISTOLS', 'REVOLVERS', 'SMGS', 'RIFLES', 'SHOTGUNS', 'SNIPERS'];

// ── parametric long gun (SMGs, rifles, LMG, DMR, auto shotgun) ──
function longSpec(o) {
  const rl = o.recvLen ?? .22, gl = o.guardLen ?? .24, rz = .065 - rl;
  const mag = { z: -.068, h: .17, w: .025, d: .05, tilt: .1, curve: .17, ...o.mag };
  const lhZ = o.lhZ ?? (rz - Math.max(gl, .1) * .5);
  // dz/dy: how far the support hand travels from its rest to reach the magazine.
  return { ...o, rl, gl, rz, mag, lhZ, dz: mag.z - lhZ, dy: -.013 - mag.h };
}
const SIGHT_Y = { dot: .098, holo: .103, scope: .1, irons: .09 };

function buildLong(sp) {
  const root = new T.Group(), P = { root }, { rl, gl, rz, mag } = sp;
  const R = sp.recv || m.steel, L = sp.lower || m.poly, G = sp.guard || m.poly, S = sp.stockMat || m.poly, GR = sp.gripMat || m.poly;
  const ll = Math.min(rl, .17), gw = sp.guardW || .042;
  B(root, L, .034, .046, ll, 0, .004, .055 - ll / 2);
  B(root, R, .034, .036, rl, 0, .045, .065 - rl / 2);
  B(root, m.black, .02, .006, rl - .01, 0, .066, .065 - rl / 2);
  if (gl > 0) {
    B(root, G, gw, .046, gl, 0, .044, rz - gl / 2);
    if (sp.rail !== false) B(root, m.black, .02, .006, gl, 0, .07, rz - gl / 2);
    for (let i = 0; i < Math.floor(gl / .045); i++) for (const sx of [-1, 1]) B(root, m.hole, .002, .012, .028, sx * (gw / 2 - .0005), .05, rz - .035 - i * .042);
  }
  const bl = sp.barrelLen ?? .13, bz = rz - gl, br = sp.barrelR || .008;
  C(root, m.steel, br, bl, 0, .044, bz - bl / 2);
  if (sp.gasTube) { C(root, m.steel, .0065, gl + .05, 0, .07, rz - (gl + .05) / 2); B(root, m.steel, .014, .034, .014, 0, .056, bz - .05); }
  let mz = bz - bl;
  if (sp.muzzle === 'supp') { C(root, m.black, .019, .17, 0, .044, mz - .07); mz -= .155; }
  else if (sp.muzzle !== 'none') { C(root, m.black, br + .0045, .055, 0, .044, mz - .02); mz -= .0475; }
  C(root, m.hole, br * .62, .002, 0, .044, mz - .0005);
  const st = sp.stock || 'tube';
  if (st === 'tube') { C(root, m.black, .0135, .17, 0, .04, .12); B(root, S, .036, .072, .1, 0, .024, .2); B(root, m.black, .038, .1, .016, 0, .014, .256); }
  else if (st === 'solid') { B(root, S, .034, .07, .2, 0, .022, .165); B(root, m.black, .036, .1, .016, 0, .012, .272); }
  else if (st === 'wood') { B(root, S, .032, .06, .1, 0, .022, .11, -.12); B(root, S, .032, .085, .16, 0, 0, .22, -.12); B(root, m.black, .034, .1, .014, 0, -.012, .305, -.12); }
  else if (st === 'fold') { for (const y of [.055, .02]) B(root, m.steel, .008, .008, .2, 0, y, .165); B(root, m.black, .03, .09, .012, 0, .03, .27); }
  else if (st === 'bullpup') { B(root, S, .04, .09, .26, 0, .018, .195); B(root, m.black, .042, .1, .016, 0, .014, .332); B(root, m.black, .03, .022, .12, 0, .074, .2); }
  const grip = N(root, 0, -.016, .035, -.3);
  B(grip, GR, .03, .088, .04, 0, -.046, 0);
  B(root, L, .008, .005, .052, 0, -.036, -.012);
  B(root, m.steel, .005, .02, .005, 0, -.026, 0, .25);
  // Magazine.
  if (!mag.box) B(root, st === 'bullpup' ? S : L, .036, .03, mag.d + .012, 0, -.022, mag.z);
  P.mag = N(root, 0, -.02, mag.z, mag.tilt);
  const MM = mag.mat || m.steel;
  if (mag.drum) {
    B(P.mag, MM, mag.w, .06, mag.d, 0, -.02, 0);
    C(P.mag, MM, .054, .05, 0, -.092, 0, 'x', .054, 20); C(P.mag, m.black, .02, .054, 0, -.092, 0, 'x');
  } else if (mag.box) {
    B(P.mag, MM, .078, .085, .1, 0, -.05, 0); B(P.mag, m.black, .08, .012, .102, 0, -.012, 0); B(P.mag, m.brass, .03, .012, .03, .0, .012, 0);
  } else if (mag.curve) {
    const h1 = mag.h * .58, h2 = mag.h * .48;
    B(P.mag, MM, mag.w, h1, mag.d, 0, -h1 / 2 + .005, 0);
    B(P.mag, MM, mag.w, h2, mag.d, 0, -h1 - h2 / 2 + .022, -mag.curve * h2 * .42, mag.curve);
    B(P.mag, m.black, mag.w + .003, .008, mag.d + .004, 0, -h1 - h2 + .024, -mag.curve * h2 * .9, mag.curve);
  } else {
    B(P.mag, MM, mag.w, mag.h, mag.d, 0, -mag.h / 2 + .005, 0);
    B(P.mag, m.black, mag.w + .003, .008, mag.d + .004, 0, -mag.h + .004, 0);
  }
  const pz = Math.min(rz + .115, .02);
  B(root, m.hole, .003, .018, .052, .0162, .05, pz);
  P.bolt = N(root, .017, .05, pz);
  B(P.bolt, m.stainless, .003, .016, .052, 0, 0, 0);
  // Sights.
  const oz = sp.opticZ ?? -.03;
  if (sp.optic === 'dot' || sp.optic === 'holo') {
    const big = sp.optic === 'holo', cy = big ? .103 : .098, hw = big ? .021 : .018, hh = big ? .042 : .034, len = big ? .055 : .036;
    B(root, m.black, .026, .012, len + .014, 0, .075, oz);
    for (const sx of [-1, 1]) B(root, m.black, .004, hh, len, sx * hw, cy, oz);
    B(root, m.black, hw * 2 + .004, .004, len, 0, cy + hh / 2 + .001, oz);
    B(root, m.glass, hw * 2 - .004, hh - .002, .001, 0, cy, oz - len / 2 + .008);
    const dot = new T.Mesh(big ? new T.RingGeometry(.0026, .0034, 20) : new T.CircleGeometry(.0011, 10), m.dot);
    dot.position.set(0, cy, oz - len / 2 + .0088); root.add(dot);
    if (big) { const d2 = new T.Mesh(new T.CircleGeometry(.0007, 8), m.dot); d2.position.copy(dot.position); root.add(d2); }
  } else if (sp.optic === 'scope') {
    C(root, m.black, .014, .2, 0, .1, oz);
    C(root, m.black, .014, .055, 0, .1, oz - .125, 'z', .021);
    C(root, m.black, .019, .05, 0, .1, oz + .12, 'z', .014);
    C(root, m.lens, .02, .002, 0, .1, oz - .153, 'z', .02, 20); C(root, m.lens, .018, .002, 0, .1, oz + .146, 'z', .018, 20);
    C(root, m.black, .008, .02, 0, .12, oz, 'y');
    for (const dz of [-.055, .055]) B(root, m.steel, .012, .026, .014, 0, .082, oz + dz);
  } else {
    for (const sx of [-1, 1]) B(root, m.black, .004, .02, .008, sx * .0065, .08, .03);
    B(root, m.black, .017, .006, .008, 0, .072, .03);
    const fz = gl > 0 ? bz + .018 : rz + .012;
    B(root, m.black, .003, .022, .006, 0, .079, fz);
    for (const sx of [-1, 1]) B(root, m.black, .003, .016, .01, sx * .008, .076, fz);
  }
  P.rh = gripHand(root, 0, -.016, .035, -.3);
  P.lh = cupHand(root, 0, .018, sp.lhZ);
  return { root, parts: P, muzzle: N(root, 0, .044, mz - .005), eject: N(root, .03, .052, pz) };
}
function longGun(def, spec) {
  const sp = longSpec(spec);
  return {
    type: 'mag', action: 'bolt', pellets: 1, casing: 'rifle', sound: 'carbine', auto: true,
    hip: [.085, -.125, -.3], hipYaw: 2, adsZ: -.28, adsFov: 50, sightY: SIGHT_Y[sp.optic || 'irons'],
    build: () => buildLong(sp),
    clips: cc({
      draw: drawClip(def.drawT || .55, [[.38, 'cloth']]), holster,
      reload: carbineReload(false, sp.dz, sp.dy), reloadEmpty: carbineReload(true, sp.dz, sp.dy), inspect: carbineInspect(sp.dz, sp.dy),
    }),
    ...def,
  };
}
const pistol = (def, opts) => ({
  type: 'mag', action: 'slide', pellets: 1, casing: 'pistol', sound: 'pistol', auto: false,
  hip: [.095, -.08, -.42], hipYaw: 3, sightY: .0555, adsZ: -.42, adsFov: 58,
  build: () => buildPistol(opts),
  clips: cc({ draw: drawClip(def.drawT || .42, [[.3, 'hammer']]), holster, reload: pistolReload(false), reloadEmpty: pistolReload(true), inspect: pistolInspect }),
  ...def,
});
// Single-action wrist flick that re-cocks the hammer.
const cockClip = {
  dur: .32,
  tracks: { root: {
    p: [[0, 0, 0, 0], [.1, 0, .007, .008], [.22, 0, -.002, -.004], [.32, 0, 0, 0]],
    r: [[0, 0, 0, 0], [.1, 8, -3, 10], [.22, -2, 1, -3], [.32, 0, 0, 0]],
  } },
  events: [[.11, 'hammer']],
};
const revolver = (def, opts) => ({
  type: 'revolver', action: 'revolver', pellets: 1, casing: 'magnum', sound: 'revolver', auto: false, mag: 6,
  hip: [.095, -.09, -.42], hipYaw: 3, sightY: .0735, adsZ: -.42, adsFov: 56,
  build: () => buildRevolver(opts),
  clips: cc({ draw: drawClip(.5, [[.36, 'hammer']]), holster, reload: revolverReload, inspect: revolverInspect, cock: cockClip }),
  ...def,
});

// ── break-action double barrel ──
function buildTwin() {
  const root = new T.Group(), P = { root };
  B(root, m.steel, .05, .05, .1, 0, .03, 0);                               // action
  B(root, m.stainless, .051, .012, .07, 0, .03, 0);
  B(root, m.wood, .03, .042, .11, 0, .002, .105, -.3);
  B(root, m.wood, .032, .085, .2, 0, -.03, .255, -.12);
  B(root, m.black, .034, .1, .016, 0, -.044, .358, -.12);
  B(root, m.steel, .008, .005, .06, 0, -.014, .015);
  for (const z of [.005, .025]) B(root, m.steel, .005, .016, .005, 0, -.006, z, .25);
  B(root, m.steel, .008, .006, .03, 0, .058, .04);                         // top lever
  const b = P.barrels = N(root, 0, .012, -.13);                            // hinge, ahead of the breech
  for (const sx of [-1, 1]) {
    C(b, x.blued, .0115, .6, sx * .0118, .03, -.22);
    C(b, m.hole, .0095, .002, sx * .0118, .03, -.5205);
    C(b, m.hole, .0095, .002, sx * .0118, .03, .0805);
  }
  B(b, x.blued, .008, .006, .6, 0, .042, -.22);                            // rib
  C(b, m.brass, .0028, .006, 0, .048, -.51, 'y');
  B(b, m.wood, .052, .032, .2, 0, .006, -.09);                             // forend
  B(b, m.steel, .03, .02, .05, 0, .008, .03);                              // hinge block
  P.shell = N(b, 0, .03, .092);
  for (const sx of [-1, 1]) { const c = casing('shell'); c.position.x = sx * .0118; P.shell.add(c); }
  P.shell.visible = false;
  P.rh = gripHand(root, 0, .012, .075, -.55);
  P.lh = cupHand(b, 0, -.032, -.09);
  return { root, parts: P, muzzle: N(b, 0, .03, -.525), eject: N(root, 0, .06, -.02) };
}
const TW_P = [0, .03, -.06], TW_R = [-8, 26, -18];
const twinClips = {
  reload: {
    dur: 2.35,
    tracks: {
      root: {
        p: [[0, 0, 0, 0], [.25, -.02, .03, -.02], [.5, ...TW_P], [1.42, ...TW_P], [1.48, -.02, .03, -.032], [1.78, -.02, .04, -.02], [1.9, -.01, .052, -.02], [2.35, 0, 0, 0]],
        r: [[0, 0, 0, 0], [.25, -6, 14, -24], [.4, -13, 14, -27], [.5, ...TW_R], [1.42, ...TW_R], [1.78, -6, 12, -20], [1.9, 9, 10, -13], [2.02, 3, 6, -8], [2.35, 0, 0, 0]],
      },
      barrels: { r: [[.2, 0, 0, 0], [.36, -32, 0, 0], [1.78, -32, 0, 0], [1.87, 0, 0, 0]] },
      shell: { p: [[0, 0, -.3, .32], [1.0, 0, -.3, .32], [1.3, 0, 0, .085], [1.45, 0, 0, 0]], r: [[1.0, 14, 0, 0], [1.3, 0, 0, 0]] },
      lh: {
        p: [[.5, 0, 0, 0], [.8, 0, -.3, .32], [1.0, 0, -.3, .34], [1.3, 0, -.012, .2], [1.45, 0, -.006, .17], [1.74, 0, 0, 0]],
        r: [[.5, 0, 0, 0], [.8, 0, 0, 20], [1.3, 0, 0, 0]],
      },
    },
    events: [[.02, 'cloth'], [.22, 'cylOpen'], [.44, 'eject'], [1.0, 'shellShow'], [1.42, 'shellIn'], [1.45, 'ammo'], [1.85, 'cylClose'], [2.0, 'shellHide']],
  },
  inspect: {
    dur: 4.4,
    tracks: {
      root: {
        p: [[0, 0, 0, 0], [.5, -.03, .03, -.05], [1.3, -.035, .035, -.05], [1.7, ...TW_P], [2.6, ...TW_P], [2.72, -.01, .05, -.02], [3.0, -.02, .03, -.03], [3.7, -.022, .034, -.03], [4.4, 0, 0, 0]],
        r: [[0, 0, 0, 0], [.5, 10, 38, 22], [1.3, 14, 44, 28], [1.7, ...TW_R], [2.6, ...TW_R], [2.72, 8, 10, -12], [3.0, 8, 12, 62], [3.7, 11, 15, 68], [4.4, 0, 0, 0]],
      },
      barrels: { r: [[1.6, 0, 0, 0], [1.78, -32, 0, 0], [2.58, -32, 0, 0], [2.68, 0, 0, 0]] },
    },
    events: [[.02, 'cloth'], [1.35, 'cloth'], [1.62, 'cylOpen'], [2.66, 'cylClose'], [2.9, 'cloth'], [3.75, 'cloth']],
  },
};

// ── lever action ──
function buildLever() {
  const root = new T.Group(), P = { root };
  B(root, m.brass, .034, .056, .18, 0, .03, -.03);                         // receiver
  B(root, m.hole, .02, .003, .06, 0, .0015, -.05);                         // loading gate
  B(root, m.hole, .018, .003, .05, 0, .0585, -.03);                        // top ejection
  C(root, x.blued, .0088, .5, 0, .046, -.37, 'z', .0088, 8);               // octagonal barrel
  C(root, m.hole, .0045, .002, 0, .046, -.6205);
  C(root, x.blued, .0078, .42, 0, .027, -.33);                             // magazine tube
  B(root, x.woodRed, .04, .04, .2, 0, .024, -.24);                         // forend
  for (const z of [-.345, -.5]) B(root, x.blued, .024, .05, .012, 0, .036, z);
  B(root, m.black, .012, .008, .006, 0, .059, -.13);                       // rear sight
  B(root, m.black, .003, .013, .012, 0, .0595, -.6);                       // front blade
  B(root, x.woodRed, .03, .042, .11, 0, .002, .105, -.3);
  B(root, x.woodRed, .032, .085, .2, 0, -.03, .255, -.12);
  B(root, m.brass, .034, .1, .012, 0, -.044, .356, -.12);
  B(root, m.steel, .005, .016, .005, 0, -.006, .012, .25);
  const lv = P.lever = N(root, 0, -.002, -.02);                            // pivots at the front
  B(lv, m.steel, .008, .005, .06, 0, -.012, .035);
  B(lv, m.steel, .008, .02, .005, 0, -.02, .066);
  B(lv, m.steel, .008, .005, .08, 0, -.03, .105);
  B(lv, m.steel, .008, .03, .005, 0, -.017, .145);
  P.shell = N(root, 0, -.012, -.05);
  P.shell.add(casing('rifle')); P.shell.visible = false;
  P.rh = gripHand(root, 0, .012, .075, -.55);
  P.lh = cupHand(root, 0, .002, -.3);
  return { root, parts: P, muzzle: N(root, 0, .046, -.625), eject: N(root, .005, .068, -.03) };
}
const RH_LEVER_P = [0, -.055, -.035];
const leverClips = {
  pump: {
    dur: .5,
    tracks: {
      root: { p: [[0, 0, 0, 0], [.14, .004, -.008, .01], [.3, -.002, .004, -.008], [.5, 0, 0, 0]], r: [[0, 0, 0, 0], [.14, 5, -2, -8], [.3, -1.5, 1, 3], [.5, 0, 0, 0]] },
      lever: { r: [[.02, 0, 0, 0], [.14, 58, 0, 0], [.2, 58, 0, 0], [.3, 0, 0, 0]] },
      rh: { p: [[.02, 0, 0, 0], [.14, ...RH_LEVER_P], [.2, ...RH_LEVER_P], [.3, 0, 0, 0]], r: [[.02, 0, 0, 0], [.14, 40, 0, 0], [.2, 40, 0, 0], [.3, 0, 0, 0]] },
    },
    events: [[.05, 'boltBack'], [.13, 'ejectShell'], [.24, 'boltFwd']],
  },
  reloadStart: shotgunClips.reloadStart, reloadShell: shotgunClips.reloadShell, reloadEnd: shotgunClips.reloadEnd,
  inspect: {
    dur: 4.0,
    tracks: {
      root: shotgunClips.inspect.tracks.root,
      lever: { r: [[2.2, 0, 0, 0], [2.5, 42, 0, 0], [2.8, 42, 0, 0], [2.95, 0, 0, 0]] },
      rh: { p: [[2.2, 0, 0, 0], [2.5, 0, -.04, -.025], [2.8, 0, -.04, -.025], [2.95, 0, 0, 0]], r: [[2.2, 0, 0, 0], [2.5, 29, 0, 0], [2.8, 29, 0, 0], [2.95, 0, 0, 0]] },
    },
    events: [[.02, 'cloth'], [1.45, 'cloth'], [2.24, 'boltBack'], [2.84, 'boltFwd'], [3.2, 'cloth']],
  },
};

const sgBase = { type: 'shells', action: 'pump', casing: 'shell', sound: 'shotgun', auto: false, hip: [.085, -.115, -.3], hipYaw: 2, sightY: .062, adsZ: -.28, adsFov: 58 };
const sniperBase = {
  type: 'mag', action: 'boltAction', scope: true, pellets: 1, casing: 'long', auto: false, rpm: 600, bloom: 0,
  hip: [.085, -.13, -.32], hipYaw: 2, sightY: .094, adsZ: -.22,
};

const EXTRA = [
  // ── pistols ──
  pistol({ id: 'viper', cat: 0, name: 'VIPER .45', sub: '.45 single-stack', mag: 8, rpm: 360, spread: [1.1, .2], bloom: .7, kick: { z: 1.1, pitch: 3.8, roll: .9 }, cam: .017 },
    { slideMat: m.stainless, len: .014, gripMat: m.wood }),
  pistol({ id: 'wasp', cat: 0, name: 'WASP MP', sub: '9mm machine pistol', mag: 24, rpm: 1000, auto: true, sound: 'smg', spread: [1.6, .5], bloom: .34, kick: { z: .7, pitch: 1.9, roll: 1.3 }, cam: .0085 },
    { magExt: .05, comp: true, frameMat: x.grey }),
  pistol({ id: 'marshal', cat: 0, name: 'MARSHAL .50', sub: '.50 magnum auto', mag: 7, rpm: 210, casing: 'magnum', sound: 'revolver', spread: [1.3, .15], bloom: 1.8, kick: { z: 1.7, pitch: 8.5, roll: 1.7 }, cam: .042, drawT: .5 },
    { len: .05, slideMat: x.nickel, frameMat: m.stainless, gripMat: x.rubber, ports: true }),
  pistol({ id: 'whisper', cat: 0, name: 'WHISPER 22', sub: 'suppressed .22', mag: 10, rpm: 480, sound: 'supp', noFlash: true, spread: [.9, .12], bloom: .3, kick: { z: .5, pitch: 1.3, roll: .4 }, cam: .005 },
    { supp: true, frameMat: m.tan }),

  // ── revolvers ──
  revolver({ id: 'stubby', cat: 1, name: 'STUBBY .38', sub: 'snub-nose revolver', rpm: 220, spread: [1.9, .5], bloom: 1.2, kick: { z: 1.1, pitch: 5.5, roll: 1.4 }, cam: .026 },
    { len: .05, frame: x.blued, gripMat: x.rubber, gripCap: x.rubber }),
  revolver({ id: 'judge', cat: 1, name: 'JUDGE .44', sub: '8-inch hunting revolver', rpm: 125, sound: 'heavy', spread: [1.2, .06], bloom: 2, kick: { z: 1.6, pitch: 10, roll: 1.8 }, cam: .048 },
    { len: .2, frame: x.blued, gripMat: x.woodRed }),
  revolver({ id: 'peacemaker', cat: 1, name: 'PEACEMAKER .45', sub: 'single-action', rpm: 600, singleAction: true, cycleClip: 'cock', spread: [1.4, .14], bloom: 1.2, kick: { z: 1.3, pitch: 7.5, roll: 1.5 }, cam: .034 },
    { len: .165, frame: x.nickel, gripMat: x.woodLight, gripCap: x.woodLight }),

  // ── SMGs ──
  longGun({ id: 'hornet', cat: 2, name: 'HORNET SMG', sub: '9mm, 900 rpm', mag: 30, rpm: 900, casing: 'pistol', sound: 'smg', spread: [1.7, .3], bloom: .22, kick: { z: .6, pitch: 1.1, roll: .9 }, cam: .0062, drawT: .46, adsFov: 56 },
    { recvLen: .2, guardLen: .1, barrelLen: .05, muzzle: 'none', stock: 'fold', optic: 'irons', mag: { h: .2, w: .022, d: .03, tilt: 0, curve: 0 }, rail: false }),
  longGun({ id: 'stinger', cat: 2, name: 'STINGER PDW', sub: 'suppressed, 1050 rpm', mag: 40, rpm: 1050, casing: 'pistol', sound: 'supp', noFlash: true, spread: [1.5, .25], bloom: .2, kick: { z: .5, pitch: .9, roll: .8 }, cam: .005, drawT: .46, adsFov: 54 },
    { recvLen: .2, guardLen: .12, barrelLen: .03, muzzle: 'supp', stock: 'tube', optic: 'holo', guard: m.tan, stockMat: m.tan, gripMat: m.tan, mag: { h: .16, w: .024, d: .04, curve: .12 } }),
  longGun({ id: 'thumper', cat: 2, name: 'THUMPER .45', sub: '50-round drum', mag: 50, rpm: 650, casing: 'pistol', sound: 'pistol', spread: [1.9, .4], bloom: .3, kick: { z: .9, pitch: 1.6, roll: 1.1 }, cam: .0095, reloadSpeed: .85 },
    { recvLen: .24, guardLen: .12, barrelLen: .14, stock: 'wood', optic: 'irons', guard: m.wood, stockMat: m.wood, gripMat: m.wood, lower: m.steel, rail: false, mag: { drum: true, h: .13, w: .026, d: .045, tilt: 0 } }),

  // ── rifles ──
  longGun({ id: 'kodiak', cat: 3, name: 'KODIAK 7.62', sub: '7.62 full-auto', mag: 30, rpm: 600, spread: [1.8, .14], bloom: .36, kick: { z: 1.0, pitch: 2.3, roll: 1.2 }, cam: .0135 },
    { recvLen: .24, guardLen: .16, barrelLen: .2, stock: 'wood', optic: 'irons', guard: x.woodRed, stockMat: x.woodRed, gripMat: x.woodRed, lower: m.steel, rail: false, gasTube: true, mag: { h: .2, w: .026, d: .055, curve: .42, tilt: .14 } }),
  longGun({ id: 'lancer', cat: 3, name: 'LANCER BR', sub: '.308 semi-auto', mag: 20, rpm: 380, auto: false, casing: 'long', sound: 'sniper', spread: [1.9, .05], bloom: .7, kick: { z: 1.3, pitch: 3.6, roll: 1.2 }, cam: .021, drawT: .62, adsFov: 44 },
    { recvLen: .26, guardLen: .3, barrelLen: .16, stock: 'solid', optic: 'holo', guard: x.grey, stockMat: x.grey, mag: { h: .12, w: .028, d: .06, curve: 0, tilt: .04 } }),
  longGun({ id: 'bullpup', cat: 3, name: 'BR-9 BULLPUP', sub: '5.56 bullpup, 800 rpm', mag: 30, rpm: 800, spread: [1.5, .1], bloom: .26, kick: { z: .75, pitch: 1.4, roll: .9 }, cam: .008 },
    { recvLen: .2, guardLen: .17, barrelLen: .1, stock: 'bullpup', optic: 'dot', guard: x.green, stockMat: x.green, gripMat: x.green, lhZ: -.2, mag: { z: .15, h: .15, curve: .15 } }),
  longGun({ id: 'hailstorm', cat: 3, name: 'HAILSTORM LMG', sub: '100-round belt box', mag: 100, rpm: 680, spread: [2.2, .2], bloom: .2, kick: { z: .9, pitch: 1.6, roll: 1.3 }, cam: .0092, drawT: .75, reloadSpeed: .6 },
    { recvLen: .28, guardLen: .26, barrelLen: .22, barrelR: .011, stock: 'solid', optic: 'dot', opticZ: -.06, mag: { box: true, z: -.1, h: .1, tilt: 0, mat: x.green } }),
  {
    id: 'rancher', cat: 3, name: 'RANCHER .30-30', sub: 'lever-action', build: buildLever, sound: 'revolver', casing: 'rifle',
    mag: 7, rpm: 110, auto: false, pellets: 1, type: 'shells', action: 'pump',
    spread: [1.4, .08], bloom: .6, kick: { z: 1.5, pitch: 5, roll: 1.2 }, cam: .028,
    hip: [.085, -.115, -.3], hipYaw: 2, sightY: .0665, adsZ: -.28, adsFov: 50,
    clips: cc({ draw: drawClip(.6, [[.4, 'cloth']]), holster, ...leverClips }),
  },

  // ── shotguns ──
  { ...sgBase, id: 'trench', cat: 4, name: 'TRENCH 12', sub: 'short-barrel pump', build: () => buildShotgun({ barrel: .36, shield: true, wood: m.woodDark, woodDark: m.black }),
    mag: 4, rpm: 80, pellets: 9, spread: [4.6, 3.8], bloom: 0, kick: { z: 2.4, pitch: 7.5, roll: 1.8 }, cam: .046,
    clips: cc({ draw: drawClip(.52, [[.36, 'cloth']]), holster, ...shotgunClips }) },
  { ...sgBase, id: 'twin', cat: 4, name: 'TWIN 12', sub: 'break-action double', build: buildTwin, type: 'mag', action: 'none', ejectSpent: true,
    mag: 2, rpm: 260, pellets: 10, spread: [3.8, 3], bloom: 0, kick: { z: 2.6, pitch: 8, roll: 2 }, cam: .05, sightY: .06,
    clips: cc({ draw: drawClip(.6, [[.4, 'cloth']]), holster, ...twinClips }) },
  longGun({ id: 'riot', cat: 4, name: 'RIOT A12', sub: 'mag-fed semi-auto 12ga', mag: 8, rpm: 280, auto: false, pellets: 8, casing: 'shell', sound: 'shotgun', spread: [3.8, 3], bloom: 0, kick: { z: 1.9, pitch: 5.2, roll: 1.5 }, cam: .033, drawT: .6, adsFov: 58 },
    { recvLen: .24, guardLen: .24, barrelLen: .14, barrelR: .0115, stock: 'solid', optic: 'irons', mag: { h: .13, w: .03, d: .065, tilt: 0, curve: 0, mat: m.black } }),

  // ── snipers ──
  { ...sniperBase, id: 'longbow', cat: 5, name: 'LONGBOW .50', sub: 'anti-materiel, 12x scope', build: () => buildSniper({ barrel: .66, heavy: true, body: m.tan, bipod: true }), sound: 'heavy',
    mag: 5, spread: [4, 0], kick: { z: 3.4, pitch: 7.5, roll: 1.8 }, cam: .052, adsFov: 6,
    clips: cc({ draw: drawClip(.85, [[.5, 'cloth']]), holster, reload: sniperReload, bolt: sniperBolt, inspect: sniperInspect }) },
  longGun({ id: 'marksman', cat: 5, name: 'MARKSMAN DMR', sub: 'semi-auto, 4x scope', mag: 10, rpm: 300, auto: false, scope: true, casing: 'long', sound: 'sniper', spread: [2.4, 0], bloom: .5, kick: { z: 1.4, pitch: 3.4, roll: 1.1 }, cam: .022, drawT: .65, adsFov: 17 },
    { recvLen: .26, guardLen: .3, barrelLen: .2, stock: 'solid', optic: 'scope', guard: m.tan, stockMat: m.tan, gripMat: m.tan, mag: { h: .11, w: .028, d: .06, curve: 0, tilt: .04 } }),
];

const BASE_CAT = { pistol: 0, revolver: 1, carbine: 3, shotgun: 4, sniper: 5 };
export const GUNS = [...BASE.map(g => ({ ...g, cat: BASE_CAT[g.id] })), ...EXTRA].sort((a, b) => a.cat - b.cat);

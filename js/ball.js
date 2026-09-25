import { THREE, G, input, player, onUpdate, wait, clamp, rand, shake } from './engine.js';
import { Audio } from './audio.js';
import { makeBall, put } from './world.js';
import { $ } from './ui.js';

const GRAV = 9.8, R = 0.12, RIM_R = 0.23;

// ---------------------------------------------------------------------------
// Ball physics shared by the basketball games and the boss fight
// ---------------------------------------------------------------------------
export function createBallSystem({ hoops = [], bounds, targets = [] }) {
  const sys = { balls: [], hoops, bounds, targets, onScore: null, onTarget: null };
  sys.spawn = (pos, vel, owner) => {
    const mesh = makeBall(R); put(mesh, pos.x, pos.y, pos.z);
    const b = { mesh, pos: pos.clone(), vel: vel.clone(), owner, age: 0, scored: false, hitTarget: false, dead: false };
    sys.balls.push(b); return b;
  };
  sys.clear = () => { sys.balls.forEach(b => b.mesh.removeFromParent()); sys.balls = []; };
  sys.remove = onUpdate(dt => {
    for (const b of sys.balls) {
      b.age += dt;
      const prevY = b.pos.y;
      b.vel.y -= GRAV * dt;
      b.pos.addScaledVector(b.vel, dt);
      // floor
      if (b.pos.y < R) { b.pos.y = R; if (b.vel.y < -1.2) Audio.bounce(clamp(-b.vel.y / 8, 0.2, 1)); b.vel.y = -b.vel.y * 0.62; b.vel.x *= 0.85; b.vel.z *= 0.85; }
      // walls
      const bd = sys.bounds;
      if (bd) {
        if (b.pos.x < bd.x0 + R) { b.pos.x = bd.x0 + R; b.vel.x = Math.abs(b.vel.x) * 0.6; }
        if (b.pos.x > bd.x1 - R) { b.pos.x = bd.x1 - R; b.vel.x = -Math.abs(b.vel.x) * 0.6; }
        if (b.pos.z < bd.z0 + R) { b.pos.z = bd.z0 + R; b.vel.z = Math.abs(b.vel.z) * 0.6; }
        if (b.pos.z > bd.z1 - R) { b.pos.z = bd.z1 - R; b.vel.z = -Math.abs(b.vel.z) * 0.6; }
        if (bd.ceil && b.pos.y > bd.ceil) { b.pos.y = bd.ceil; b.vel.y = -Math.abs(b.vel.y); }
      }
      for (const h of sys.hoops) {
        const dx = b.pos.x - h.rim.x, dz = b.pos.z - h.rim.z, hd = Math.hypot(dx, dz), dy = b.pos.y - h.rim.y;
        // backboard
        const bx = h.boardX, side = Math.sign(h.rim.x - bx);
        if (Math.abs(b.pos.z - h.rim.z) < 0.9 && b.pos.y > 2.85 && b.pos.y < 3.95 && (b.pos.x - bx) * side < R) {
          b.pos.x = bx + side * R; b.vel.x = Math.abs(b.vel.x) * side * 0.55; Audio.bounce(0.4);
        }
        // rim ring collision
        const ringD = Math.hypot(hd - RIM_R, dy);
        if (ringD < R + 0.01 && ringD > 1e-4) {
          const nx = (hd - RIM_R) / ringD * (hd > 1e-4 ? dx / hd : 0), nz = (hd - RIM_R) / ringD * (hd > 1e-4 ? dz / hd : 0), ny = dy / ringD;
          const vn = b.vel.x * nx + b.vel.y * ny + b.vel.z * nz;
          if (vn < 0) { b.vel.x -= 1.6 * vn * nx; b.vel.y -= 1.6 * vn * ny; b.vel.z -= 1.6 * vn * nz; Audio.rim(); }
          const push = R + 0.01 - ringD; b.pos.x += nx * push; b.pos.y += ny * push; b.pos.z += nz * push;
        }
        // scoring: passes down through the rim
        if (!b.scored && prevY >= h.rim.y && b.pos.y < h.rim.y && hd < RIM_R - 0.03) {
          b.scored = true; Audio.swish(); h.net && (h.net.scale.y = 1.4);
          sys.onScore && sys.onScore(b, h);
        }
        if (h.net) h.net.scale.y += (1 - h.net.scale.y) * 0.1;
      }
      for (const t of sys.targets) {
        if (b.hitTarget || !t.active()) continue;
        const tp = t.pos();
        if (b.pos.distanceTo(tp) < t.radius) { b.hitTarget = true; b.vel.multiplyScalar(-0.3); sys.onTarget && sys.onTarget(b, t); }
      }
      b.mesh.position.copy(b.pos);
      b.mesh.rotation.x += dt * 8; b.mesh.rotation.z += dt * 3;
      if (b.age > 6) b.dead = true;
    }
    sys.balls = sys.balls.filter(b => { if (b.dead) b.mesh.removeFromParent(); return !b.dead; });
  });
  return sys;
}

// Ballistic launch velocity that reaches `to` from `from` in T seconds
export function solveLaunch(from, to, T) {
  return new THREE.Vector3((to.x - from.x) / T, (to.y - from.y + 0.5 * GRAV * T * T) / T, (to.z - from.z) / T);
}

// ---------------------------------------------------------------------------
// Player shooting: hold mouse to charge (the meter swings back and forth),
// release in the green zone for a perfect shot.
// ---------------------------------------------------------------------------
export function createShooter(sys, { aimAt, sweet = 0.72, band = 0.08, returnBall = 1.6, onThrow } = {}) {
  const chargeEl = $('charge'), fill = chargeEl.querySelector('.fill'), sw = chargeEl.querySelector('.sweet');
  sw.style.left = ((sweet - band) * 100) + '%'; sw.style.width = (band * 200) + '%';
  const sh = { charging: false, t: 0, charge: 0, enabled: true, stats: { shots: 0, perfect: 0 } };
  G.holdingBall = true; $('hold-ball').classList.remove('hidden');
  sh.give = () => { G.holdingBall = true; $('hold-ball').classList.remove('hidden'); };
  sh.stop = () => { sh.enabled = false; chargeEl.classList.add('hidden'); $('hold-ball').classList.add('hidden'); G.holdingBall = false; remove(); };
  const remove = onUpdate(dt => {
    if (!sh.enabled || !player.enabled || !G.holdingBall) { chargeEl.classList.add('hidden'); sh.charging = false; return; }
    if (input.mouseDown && !sh.charging && input.clicked) { sh.charging = true; sh.t = 0; }
    if (sh.charging) {
      sh.t += dt;
      const p = (sh.t / 1.1) % 2; sh.charge = p < 1 ? p : 2 - p;
      chargeEl.classList.remove('hidden'); fill.style.width = (sh.charge * 100) + '%';
      if (!input.mouseDown) { sh.charging = false; chargeEl.classList.add('hidden'); throwBall(sh.charge); }
    }
  });
  function throwBall(charge) {
    const cam = G.camera;
    const from = cam.position.clone().add(new THREE.Vector3(0, -0.15, 0));
    const fwd = new THREE.Vector3(); cam.getWorldDirection(fwd);
    from.addScaledVector(fwd, 0.4);
    let vel = null, perfect = false;
    const target = aimAt && aimAt();
    if (target) {
      const to = target.pos.clone();
      const dir = to.clone().sub(from); const dist = dir.length();
      const ang = fwd.angleTo(dir.clone().normalize());
      if (ang < (target.cone || 0.35) && dist < (target.range || 11)) {
        const err = charge - sweet;
        perfect = Math.abs(err) < band;
        if (!perfect) {
          const flat = new THREE.Vector3(dir.x, 0, dir.z).normalize();
          const side = new THREE.Vector3(-flat.z, 0, flat.x);
          to.addScaledVector(flat, err * (target.errScale || 2.2)).addScaledVector(side, rand(-1, 1) * Math.abs(err) * 0.9);
        } else to.y += 0.06;
        vel = solveLaunch(from, to, (target.t0 || 0.8) + dist * (target.tk || 0.12));
      }
    }
    if (!vel) vel = fwd.clone().multiplyScalar(5 + charge * 9).add(new THREE.Vector3(0, 1.5 + charge * 2, 0));
    sys.spawn(from, vel, 'carlos');
    Audio.whoosh();
    sh.stats.shots++; if (perfect) sh.stats.perfect++;
    G.holdingBall = false; $('hold-ball').classList.add('hidden');
    onThrow && onThrow(perfect);
    if (returnBall) wait(returnBall).then(() => { if (sh.enabled) sh.give(); });
  }
  return sh;
}

// ---------------------------------------------------------------------------
// One-on-one "race to N" against Eric in the gym
// ---------------------------------------------------------------------------
export function basketball({ L, eric, target = 3, stopWhen, ericSkill = 0.5, lines }) {
  const hoop = L.hoopE;
  const sys = createBallSystem({ hoops: [hoop], bounds: { x0: 30.2, x1: 55.8, z0: -12.8, z1: 12.8, ceil: 7.8 } });
  const score = { carlos: 0, eric: 0 };
  const scoreEl = $('score');
  const draw = () => { scoreEl.textContent = `CARLOS ${score.carlos}  —  ${score.eric} ERIC`; };
  scoreEl.classList.remove('hidden'); draw();
  const shooter = createShooter(sys, { aimAt: () => ({ pos: hoop.rim }) });
  let running = true, resolveGame;
  const done = new Promise(r => { resolveGame = r; });
  const finish = (why) => { if (!running) return; running = false; shooter.stop(); scoreEl.classList.add('hidden'); setTimeout(() => sys.remove(), 3000); resolveGame({ ...score, why }); };
  sys.onScore = (b) => {
    if (!running) return;
    if (b.owner === 'carlos') { score.carlos++; lines && lines.carlosScores && lines.carlosScores(score); }
    else { score.eric++; lines && lines.ericScores && lines.ericScores(score); }
    draw();
    if (stopWhen && stopWhen(score)) return finish('stopped');
    if (score.carlos >= target || score.eric >= target) finish('done');
  };
  // Eric's AI: wander to a spot, shoot, repeat
  const spots = [[50.5, -2.5], [49, 2.5], [51.5, 3.5], [48.5, -1], [50, 0]];
  (async () => {
    await wait(2);
    let i = 0;
    while (running) {
      const [x, z] = spots[i++ % spots.length];
      await eric.walkTo(x, z, 2.2);
      if (!running) break;
      eric.face(hoop.rim.x, hoop.rim.z);
      eric.h.pose = () => { eric.h.arms.forEach(a => { a.rotation.x = -2.7; }); eric.h.legs.forEach(l => { l.rotation.x = 0; }); };
      await wait(0.45);
      if (!running) break;
      const from = new THREE.Vector3(eric.pos.x, 1.75, eric.pos.z);
      const to = hoop.rim.clone(); to.y += 0.08;
      if (Math.random() > ericSkill) { to.x += rand(-0.5, 0.5); to.z += rand(-0.45, 0.45); if (Math.random() < 0.5) to.x -= 0.4; }
      sys.spawn(from, solveLaunch(from, to, 1.25), 'eric'); Audio.whoosh();
      eric.h.pose = null;
      await wait(rand(2.4, 3.6));
    }
  })();
  return { done, sys, score, stop: finish };
}

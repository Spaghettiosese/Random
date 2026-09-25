import { THREE, G, player, onUpdate, wait, tween, clamp, rand, shake, interact, setFlashlight } from './engine.js';
import { Audio } from './audio.js';
import { makeMoonkai, makeEric } from './characters.js';
import { put, banana, bananaPeel } from './world.js';
import { createBallSystem, createShooter, solveLaunch } from './ball.js';
import { $, say, toast, hurtFlash } from './ui.js';

// ---------------------------------------------------------------------------
// FINAL BOSS — Moonkai in the Saint Joseph gym.
// Dodge slams (jump the shockwave!), bananas and moonbeams. When it roars,
// its crescent glows: hit it with a basketball.
// ---------------------------------------------------------------------------
export function runBoss(L, { onDeath }) {
  const MAXHP = 9;
  const mk = makeMoonkai(1.05);
  put(mk.group, 49, 0, 0);
  mk.group.rotation.y = -Math.PI / 2;
  // Eric trapped in the glowing belly orb
  const eric = makeEric(3);
  eric.group.scale.setScalar(0.42);
  eric.group.position.set(0, 1.6, 1.75);
  eric.pose = (dt, t) => { eric.body.rotation.x = 0.5; eric.arms.forEach(a => { a.rotation.x = -0.6 + Math.sin(t) * 0.1; }); eric.legs.forEach(l => { l.rotation.x = -1.2; }); eric.head.rotation.x = 0.3; };
  mk.body.add(eric.group);
  mk.orb.material.opacity = 0.35;

  const st = { hp: MAXHP, pos: new THREE.Vector3(49, 0, 0), yaw: -Math.PI / 2, vulnerable: false, alive: true, busy: false, dark: false, over: false };
  window.__boss = st;
  const bossBar = $('boss'); bossBar.classList.remove('hidden');
  const hpFill = bossBar.querySelector('.fill');
  const phpEl = $('hp'); phpEl.classList.remove('hidden');
  player.hp = player.maxHp = 100; player.canJump = true; player.canFlash = true;
  const drawHp = () => { hpFill.style.width = (st.hp / MAXHP * 100) + '%'; phpEl.firstElementChild.style.width = Math.max(0, player.hp) + '%'; };
  drawHp();

  const weak = { radius: 1.25, active: () => st.vulnerable, pos: () => mk.crescent.getWorldPosition(new THREE.Vector3()) };
  const sys = createBallSystem({ bounds: { x0: 30.2, x1: 55.8, z0: -12.8, z1: 12.8, ceil: 7.8 }, targets: [weak] });
  let shooter = null;
  const ballsLeft = { n: 0 };
  // ball racks: pick up 3 balls at a time
  for (const [x, z] of L.racks) {
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
    put(hit, x, 0.7, z);
    interact(hit, () => ballsLeft.n > 0 ? `Balls: ${ballsLeft.n}` : 'Grab basketballs', () => {
      ballsLeft.n = 3; Audio.pickup(); toast('3 basketballs. Hit the glowing crescent when it roars! (hold & release mouse)');
      if (!shooter) shooter = createShooter(sys, { aimAt: () => st.vulnerable ? { pos: weak.pos(), cone: 0.4, range: 22, t0: 0.5, tk: 0.035, errScale: 1.2 } : null, returnBall: 0, onThrow: () => { ballsLeft.n--; if (ballsLeft.n > 0) wait(0.35).then(() => shooter.give()); } , sweet: 0.7, band: 0.12 });
      else shooter.give();
    }, { range: 2.8 });
  }
  sys.onTarget = () => {
    if (!st.vulnerable || st.over) return;
    st.hp--; drawHp(); Audio.hit(); Audio.screech(); shake(0.3);
    st.vulnerable = false; mk.setGlow(0);
    mk.head.rotation.x = -0.4;
    if (st.hp <= 0) { st.over = true; }
  };

  const damage = (n) => {
    if (player.invuln > 0 || !st.alive || st.over) return;
    player.hp -= n; player.invuln = 0.8; drawHp(); hurtFlash(0.9); Audio.hurt(); shake(0.25);
    if (player.hp <= 0) { st.alive = false; cleanup(); onDeath(); }
  };
  const regen = onUpdate(dt => { if (st.alive && player.hp < 100) { player.hp = Math.min(100, player.hp + dt * 2.5); drawHp(); } });

  // movement + facing
  const moveUpd = onUpdate(dt => {
    mk.update(dt);
    const toP = new THREE.Vector3(player.pos.x - st.pos.x, 0, player.pos.z - st.pos.z);
    const want = Math.atan2(toP.x, toP.z);
    let d = want - st.yaw; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    if (!st.over) st.yaw += d * Math.min(1, dt * 2.5);
    mk.group.position.copy(st.pos); mk.group.rotation.y = st.yaw;
    // body contact
    if (toP.length() < 2.3 && !st.dark) { damage(10); player.pos.x += toP.x / toP.length() * 0.4; player.pos.z += toP.z / toP.length() * 0.4; }
    if (st.vulnerable) mk.setGlow(0.6 + Math.sin(G.time * 12) * 0.4);
    mk.head.rotation.x += ((st.vulnerable ? 0.55 : 0) - mk.head.rotation.x) * Math.min(1, dt * 4);
    mk.jaw.rotation.x += ((st.vulnerable ? 0.6 : 0.05) - mk.jaw.rotation.x) * Math.min(1, dt * 6);
    // heartbeat when close
    const dist = toP.length();
    if (dist < 7 && Math.floor(G.time * (dist < 4 ? 1.6 : 1.1)) !== st.lastBeat) { st.lastBeat = Math.floor(G.time * (dist < 4 ? 1.6 : 1.1)); Audio.heartbeat(0.3); }
  });
  const phase = () => st.hp > 6 ? 1 : st.hp > 3 ? 2 : 3;

  async function walk(sec) {
    mk.mode = 'walk';
    let t = 0;
    await new Promise(res => {
      const off = onUpdate(dt => {
        t += dt;
        const to = new THREE.Vector3(player.pos.x - st.pos.x, 0, player.pos.z - st.pos.z);
        const dist = to.length();
        if (dist > 5) st.pos.addScaledVector(to.normalize(), dt * (1.5 + phase() * 0.5));
        st.pos.x = clamp(st.pos.x, 33, 53); st.pos.z = clamp(st.pos.z, -7, 10);
        if (Math.floor(t * 2.2) !== Math.floor((t - dt) * 2.2)) { Audio.drum(0.35); shake(0.05); }
        if (t >= sec || st.over) { off(); res(); }
      });
    });
    mk.mode = 'idle';
  }
  async function slam() {
    mk.mode = 'slam';
    await tween(0.8, k => { mk.arms.forEach(a => { a.sh.rotation.x = -2.8 * k; }); mk.body.position.y = k * 0.3; });
    await tween(0.15, k => { mk.arms.forEach(a => { a.sh.rotation.x = -2.8 + 2.8 * k; }); mk.body.position.y = 0.3 - 0.3 * k; });
    Audio.slam(); shake(0.6);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 3, 32), new THREE.MeshBasicMaterial({ color: 0xff8a3a }));
    ring.rotation.x = Math.PI / 2; put(ring, st.pos.x, 0.15, st.pos.z);
    let r = 1.5, hitDone = false;
    await new Promise(res => {
      const off = onUpdate(dt => {
        r += dt * (8 + phase());
        ring.scale.set(r, r, 1);
        const pd = Math.hypot(player.pos.x - ring.position.x, player.pos.z - ring.position.z);
        if (!hitDone && Math.abs(pd - r) < 0.45 && player.pos.y < 0.35) { hitDone = true; damage(22); }
        if (r > 26) { ring.removeFromParent(); off(); res(); }
      });
    });
    mk.mode = 'idle';
  }
  async function barrage() {
    mk.mode = 'throw'; Audio.hoot();
    const n = 3 + phase() * 2;
    for (let i = 0; i < n && !st.over; i++) {
      const arm = mk.arms[i % 2];
      await tween(0.18, k => { arm.sh.rotation.x = -2.4 * k; });
      const from = arm.hand.getWorldPosition(new THREE.Vector3());
      const to = player.pos.clone(); to.y = 0.8;
      to.x += rand(-1, 1) * (i % 3 === 0 ? 0 : 1.2); to.z += rand(-1, 1) * (i % 3 === 0 ? 0 : 1.2);
      const T = 1.0;
      const vel = solveLaunch(from, to, T);
      const b = banana(); b.scale.setScalar(2.2); put(b, from.x, from.y, from.z);
      const p = from.clone();
      const off = onUpdate(dt => {
        vel.y -= 9.8 * dt; p.addScaledVector(vel, dt); b.position.copy(p); b.rotation.x += dt * 10; b.rotation.y += dt * 7;
        const dx = player.pos.x - p.x, dz = player.pos.z - p.z, dy = (player.pos.y + 0.8) - p.y;
        if (Math.hypot(dx, dz) < 0.65 && Math.abs(dy) < 0.9) { damage(12); b.removeFromParent(); off(); return; }
        if (p.y < 0.05) { b.removeFromParent(); off(); const peel = bananaPeel(p.x, p.z, Math.random() * 6); wait(6).then(() => peel.removeFromParent()); Audio.bounce(0.3); }
      });
      Audio.whoosh();
      await tween(0.15, k => { arm.sh.rotation.x = -2.4 * (1 - k); });
      await wait(0.2);
    }
    mk.mode = 'idle';
  }
  async function darkness() {
    st.dark = true; Audio.roar();
    await say('MOONKAI', 'LIGHTS OUT, LITTLE FRIEND.', { auto: 1.6 });
    await tween(0.6, k => L.setGymLights(1 - k * 0.97));
    if (!player.flashOn) toast('Press F for your flashlight', 2.5);
    // it creeps around in the dark
    const ang = Math.random() * Math.PI * 2;
    const tx = clamp(player.pos.x + Math.cos(ang) * 6, 33, 53), tz = clamp(player.pos.z + Math.sin(ang) * 6, -7, 10);
    const from = st.pos.clone();
    await tween(2.6, k => { st.pos.set(from.x + (tx - from.x) * k, 0, from.z + (tz - from.z) * k); });
    await wait(0.6);
    await tween(0.3, k => L.setGymLights(0.03 + k * 0.97));
    st.dark = false;
    await slam();
  }
  async function beams() {
    Audio.hoot();
    const marks = [];
    for (let i = 0; i < 4 && !st.over; i++) {
      const c = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.3, 16), new THREE.MeshBasicMaterial({ color: 0xff2020, side: THREE.DoubleSide, transparent: true, opacity: 0.8 }));
      c.rotation.x = -Math.PI / 2; put(c, player.pos.x, 0.03, player.pos.z);
      Audio.tone(900, 0.25, { type: 'square', vol: 0.06 });
      const mark = c;
      wait(1.1).then(() => {
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 16, 10, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
        put(beam, mark.position.x, 8, mark.position.z);
        Audio.noise(0.6, { vol: 0.5, freq: 4000, type: 'highpass', rev: 0.5 }); shake(0.15);
        if (Math.hypot(player.pos.x - mark.position.x, player.pos.z - mark.position.z) < 1.3) damage(20);
        tween(0.5, k => { beam.material.opacity = 0.85 * (1 - k); }).then(() => { beam.removeFromParent(); mark.removeFromParent(); });
      });
      marks.push(c);
      await wait(0.55);
    }
    await wait(1.2);
  }
  async function roar() {
    Audio.roar(); shake(0.3);
    st.vulnerable = true;
    toast(ballsLeft.n > 0 || G.holdingBall ? 'NOW! Hit the crescent!' : 'It\'s exposed! Grab basketballs from a rack!', 2);
    const t0 = G.time;
    await new Promise(res => { const off = onUpdate(() => { if (!st.vulnerable || G.time - t0 > 4.2 - phase() * 0.3) { off(); res(); } }); });
    st.vulnerable = false; mk.setGlow(0);
  }

  let taunted = { 2: false, 3: false };
  const TAUNTS = {
    2: ['MOONKAI', 'HE TASTES LIKE FEAR, CARLOS. SWEET, LIKE A GREEN BANANA.'],
    3: ['Eric?', 'C-Carlos... it\'s so dark in here... don\'t stop...'],
  };
  const done = (async () => {
    await wait(1);
    let n = 0;
    while (st.alive && !st.over) {
      const ph = phase();
      if (ph > 1 && !taunted[ph]) { taunted[ph] = true; Audio.roar(); await say(TAUNTS[ph][0], TAUNTS[ph][1], { auto: 2.6 }); }
      await walk(rand(1.6, 2.8) - ph * 0.3);
      if (st.over) break;
      const opts = ['slam', 'barrage'];
      if (ph >= 2) opts.push('darkness');
      if (ph >= 3) opts.push('beams', 'beams');
      const a = opts[Math.floor(Math.random() * opts.length)];
      if (a === 'slam') await slam(); else if (a === 'barrage') await barrage(); else if (a === 'darkness') await darkness(); else await beams();
      if (st.over) break;
      n++;
      if (n % 2 === 0 || Math.random() < 0.45) await roar();
    }
    cleanup();
    return 'win';
  })();

  function cleanup() {
    regen(); sys.clear(); sys.remove();
    if (shooter) shooter.stop();
    bossBar.classList.add('hidden'); phpEl.classList.add('hidden');
    player.canJump = false;
    L.setGymLights(1);
  }
  return { done, mk, st, eric, stopMoving: moveUpd };
}

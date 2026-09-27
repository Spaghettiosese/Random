import { THREE, gameRenderer, pixTex, Pad, collide, blit } from './g3d.js';
import { A } from '../audio.js';

const COLORS = [0xe8384f, 0xfdd835, 0x3c8dff, 0x33c16b, 0xff8a1f, 0xb266ff];
export class Brickverse {
  constructor(os) {
    this.os = os; this.full = true; this.hideCursor = true; this.pad = new Pad(); this.pad.pitch = -0.35;
    const sc = this.scene = new THREE.Scene(); sc.background = new THREE.Color(0x9fd4ff); sc.fog = new THREE.Fog(0x9fd4ff, 60, 160);
    this.cam = new THREE.PerspectiveCamera(65, 16 / 9, 0.1, 300);
    sc.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8); sun.position.set(20, 40, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, far: 150 }); sc.add(sun); this.sun = sun; sc.add(sun.target);
    const stud = pixTex(32, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 32, 32); g.fillStyle = 'rgba(0,0,0,.13)'; g.beginPath(); g.arc(17, 17, 8, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(15, 15, 8, 0, 7); g.fill(); });
    stud.wrapS = stud.wrapT = THREE.RepeatWrapping; stud.magFilter = THREE.LinearFilter; this.stud = stud;
    this.boxes = []; this.parts = [];
    const add = (w, h, d, x, y, z, color, kind = 'solid', extra = {}) => {
      const t = stud.clone(); t.needsUpdate = true; t.repeat.set(w / 2, d / 2);
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, map: t, roughness: 0.45, emissive: kind === 'lava' ? 0xff2200 : 0, emissiveIntensity: kind === 'lava' ? 0.6 : 0 }));
      m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; sc.add(m);
      const p = { m, kind, box: new THREE.Box3().setFromObject(m), base: m.position.clone(), ...extra }; this.parts.push(p); return p;
    };
    add(200, 1, 200, 0, -0.5, 0, 0x6f7a80).kind = 'lava-floor';
    this.parts[0].m.material.color.set(0x35393d);
    add(14, 1, 14, 0, 0.5, 0, 0x8a8f94); // spawn
    const spawnMark = add(4, 0.2, 4, 0, 1.1, 0, 0x2a7fff);
    let z = -6, y = 1, stage = 0;
    this.checks = [];
    for (let i = 0; i < 26; i++) {
      const c = COLORS[i % COLORS.length], r = Math.random();
      z -= 3.8 + Math.random() * 1.2; const x = Math.sin(i * 0.7) * 6; y += Math.random() < 0.5 ? 1 : 0.4;
      if (i % 7 === 6) { const cp = add(6, 1, 6, x, y, z, 0x33c16b, 'check'); cp.stage = ++stage; this.checks.push(cp); continue; }
      if (r < 0.2) add(3, 1, 3, x, y, z, c, 'move', { ax: 'x', amp: 4, sp: 1 + Math.random() });
      else if (r < 0.35) { add(5, 1, 3, x, y, z, c); add(1.5, 0.3, 1.5, x, y + 0.6, z, 0xff3300, 'lava'); }
      else if (r < 0.45) add(2, 1, 2, x, y, z, c, 'spin', { sp: 1.5 });
      else add(2.5 + Math.random() * 2, 1, 2.5, x, y, z, c);
    }
    z -= 7; this.win = add(8, 1, 8, 0, y, z, 0xffc400, 'win');
    const trophy = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.2, 1.4, 16), new THREE.MeshStandardMaterial({ color: 0xffd54a, metalness: 1, roughness: 0.25 })); trophy.position.set(0, y + 1.3, z); sc.add(trophy); this.trophy = trophy;
    // blocky avatar
    const av = this.av = new THREE.Group(); sc.add(av);
    const part = (w, h, d, c, x, y2) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 })); m.position.set(x, y2, 0); m.castShadow = true; av.add(m); return m; };
    part(1, 1, 0.5, 0x1f6fd1, 0, 1.5);
    const head = part(0.6, 0.6, 0.6, 0xffd23f, 0, 2.3);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: pixTex(32, (g) => { g.fillStyle = '#111'; g.fillRect(9, 10, 4, 6); g.fillRect(19, 10, 4, 6); g.lineWidth = 2; g.strokeStyle = '#111'; g.beginPath(); g.arc(16, 17, 7, 0.4, 2.7); g.stroke(); }), transparent: true }));
    face.position.set(0, 0, 0.301); head.add(face);
    this.armL = part(0.45, 1, 0.45, 0xffd23f, -0.73, 1.5); this.armR = part(0.45, 1, 0.45, 0xffd23f, 0.73, 1.5);
    this.legL = part(0.48, 1, 0.48, 0x3aa35a, -0.25, 0.5); this.legR = part(0.48, 1, 0.48, 0x3aa35a, 0.25, 0.5);
    [this.armL, this.armR, this.legL, this.legR].forEach(m => { m.geometry.translate(0, -0.45, 0); m.position.y += 0.45; });
    this.spawn = new THREE.Vector3(0, 1.3, 0); this.pos = this.spawn.clone(); this.vel = new THREE.Vector3(); this.face = 0;
    this.deaths = 0; this.stage = 0; this.t = 0; this.done = false; this.jumps = 0;
  }
  die() { this.deaths++; this.pos.copy(this.spawn); this.vel.set(0, 0, 0); A.beep(420, 0.08, 0.2, 'square'); A.beep(260, 0.18, 0.2, 'square', 0.07); this.msg = ['oof', 2]; }
  update(dt) {
    this.t += dt; const P = this.pad; P.update(dt);
    for (const p of this.parts) {
      const old = p.m.position.clone();
      if (p.kind === 'move') p.m.position[p.ax] = p.base[p.ax] + Math.sin(this.t * p.sp) * p.amp;
      if (p.kind === 'spin') p.m.rotation.y += dt * p.sp;
      p.delta = p.m.position.clone().sub(old); p.box.setFromObject(p.m);
    }
    this.trophy.rotation.y += dt * 2;
    const w = P.wish(new THREE.Vector3()), sp = 9;
    this.vel.x = w.x * sp; this.vel.z = w.z * sp; this.vel.y -= 38 * dt;
    if (P.keys.Space && this.ground) { this.vel.y = 13; A.beep(520, 0.05, 0.08, 'sine'); }
    const solids = this.parts.filter(p => p.kind !== 'lava' && p.kind !== 'lava-floor').map(p => p.box);
    this.ground = collide(this.pos, this.vel, dt, solids, 0.45, 2.6);
    const feet = new THREE.Box3(new THREE.Vector3(this.pos.x - 0.45, this.pos.y - 0.05, this.pos.z - 0.45), new THREE.Vector3(this.pos.x + 0.45, this.pos.y + 2.6, this.pos.z + 0.45));
    for (const p of this.parts) {
      if (!feet.intersectsBox(p.box)) continue;
      if (p.kind === 'lava' || p.kind === 'lava-floor') return this.die();
      if (p.kind === 'move' && this.ground) this.pos.add(p.delta);
      if (p.kind === 'check' && p.stage > this.stage) { this.stage = p.stage; this.spawn.set(p.m.position.x, p.m.position.y + 0.6, p.m.position.z); this.msg = [`Checkpoint ${p.stage}!`, 2]; A.ding(); this.os.earn(5, 'Brickverse'); }
      if (p.kind === 'win' && !this.done) { this.done = true; this.msg = ['YOU BEAT THE OBBY!', 5]; A.tune('C5 E5 G5 C6', 240, { vol: 0.06 })(); A.ding(); this.os.earn(50, 'Brickverse'); }
    }
    if (w.lengthSq() > 0) this.face = Math.atan2(w.x, w.z);
    this.av.position.copy(this.pos); this.av.rotation.y += ((this.face - this.av.rotation.y + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 12);
    const sw = w.lengthSq() > 0 && this.ground ? Math.sin(this.t * 12) * 0.8 : this.ground ? 0 : 0.5;
    this.legL.rotation.x = sw; this.legR.rotation.x = -sw; this.armL.rotation.x = -sw; this.armR.rotation.x = sw;
    const cd = 9, cp = Math.max(-1.2, Math.min(0.3, P.pitch));
    this.cam.position.set(this.pos.x + Math.sin(P.yaw) * Math.cos(cp) * cd, this.pos.y + 2 - Math.sin(cp) * cd, this.pos.z + Math.cos(P.yaw) * Math.cos(cp) * cd);
    this.cam.lookAt(this.pos.x, this.pos.y + 2, this.pos.z);
    this.sun.position.set(this.pos.x + 20, this.pos.y + 40, this.pos.z + 10); this.sun.target.position.copy(this.pos);
    if (this.msg) { this.msg[1] -= dt; if (this.msg[1] <= 0) this.msg = null; }
  }
  draw(g, w, h) {
    gameRenderer().render(this.scene, this.cam); blit(g, w, h);
    g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.roundRect(10, 10, 300, 58, 8); g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 17px Arial'; g.fillText('Brickverse  ·  Lava Tower Obby', 22, 34);
    g.font = '13px Arial'; g.fillText(`Stage ${this.stage}/3   Deaths ${this.deaths}   ${this.done ? '★ COMPLETE' : ''}`, 22, 56);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(w - 250, 10, 240, 22); g.fillStyle = '#fff'; g.font = '12px Arial'; g.fillText('WASD move · Space jump · drag/mouse to look', w - 243, 25);
    if (this.msg) { g.font = 'bold 44px Arial'; g.textAlign = 'center'; g.fillStyle = '#000'; g.fillText(this.msg[0], w / 2 + 2, h / 3 + 2); g.fillStyle = this.msg[0] === 'oof' ? '#ff5555' : '#ffe14a'; g.fillText(this.msg[0], w / 2, h / 3); g.textAlign = 'left'; }
  }
  key(e, down) { this.pad.key(e, down); if (down && e.code === 'KeyR') this.die(); }
  mouse(type, x, y, b) { this.pad.mouse(type, x, y, b); }
}

import { THREE, gameRenderer, pixTex, Pad, collide, blit } from './g3d.js';
import { A } from '../audio.js';

export class DutyCalls {
  constructor(os) {
    this.os = os; this.full = true; this.hideCursor = true; this.pad = new Pad();
    const sc = this.scene = new THREE.Scene(); sc.background = new THREE.Color(0xd9a36b); sc.fog = new THREE.Fog(0xc99a6b, 25, 90);
    this.cam = new THREE.PerspectiveCamera(72, 16 / 9, 0.03, 300); sc.add(this.cam);
    sc.add(new THREE.HemisphereLight(0xffd9b0, 0x4a3a2a, 1.0));
    const sun = new THREE.DirectionalLight(0xffb070, 2.4); sun.position.set(-30, 25, 20); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, far: 120 }); sc.add(sun);
    const sand = pixTex(64, (g) => { g.fillStyle = '#9c8466'; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? '60,45,30' : '200,180,150'},.25)`; g.fillRect(Math.random() * 64, Math.random() * 64, 2, 2); } });
    sand.wrapS = sand.wrapT = THREE.RepeatWrapping; sand.repeat.set(30, 30); sand.magFilter = THREE.LinearFilter;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshStandardMaterial({ map: sand, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; sc.add(ground);
    this.solids = []; this.cover = [];
    const crateTex = pixTex(64, (g) => { g.fillStyle = '#7a5a34'; g.fillRect(0, 0, 64, 64); g.strokeStyle = '#4a3418'; g.lineWidth = 5; g.strokeRect(3, 3, 58, 58); g.beginPath(); g.moveTo(3, 3); g.lineTo(61, 61); g.stroke(); });
    const add = (w, h, d, x, z, mat, y = h / 2) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; sc.add(m); this.solids.push(new THREE.Box3().setFromObject(m)); this.cover.push(m); return m; };
    const wall = new THREE.MeshStandardMaterial({ color: 0xa89478, roughness: 0.9 });
    add(80, 5, 1, 0, -40, wall); add(80, 5, 1, 0, 40, wall); add(1, 5, 80, -40, 0, wall); add(1, 5, 80, 40, 0, wall);
    const crate = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.8 }), cont = [0x2f5f8a, 0x8a3a2f, 0x3f6a3a].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.4 }));
    for (let i = 0; i < 26; i++) { const x = (Math.random() - 0.5) * 70, z = (Math.random() - 0.5) * 70; if (Math.hypot(x, z) < 6) continue; const s = 1.2 + Math.random() * 0.6; add(s, s, s, x, z, crate); if (Math.random() < 0.3) add(s * 0.9, s * 0.9, s * 0.9, x, z, crate, s + s * 0.45); }
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; const c = add(2.5, 2.6, 7, Math.cos(a) * 22, Math.sin(a) * 22, cont[i % 3]); c.rotation.y = a; this.solids[this.solids.length - 1].setFromObject(c); }
    // viewmodel
    const gun = this.gun = new THREE.Group(); this.cam.add(gun); gun.scale.setScalar(0.75); gun.position.set(0.22, -0.2, -0.45);
    const gm = new THREE.MeshStandardMaterial({ color: 0x222428, roughness: 0.45, metalness: 0.6 }), tan = new THREE.MeshStandardMaterial({ color: 0x6b5a3e, roughness: 0.8 });
    const gb = (w, h, d, x, y, z, m = gm) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); gun.add(b); return b; };
    gb(0.07, 0.09, 0.5, 0, 0, 0); gb(0.03, 0.03, 0.35, 0, 0.01, -0.4); gb(0.05, 0.14, 0.07, 0, -0.1, 0.05, tan); gb(0.05, 0.16, 0.06, 0, -0.1, -0.12); gb(0.06, 0.08, 0.2, 0, -0.01, 0.3, tan); gb(0.03, 0.04, 0.12, 0, 0.07, 0.0);
    this.flash = new THREE.PointLight(0xffb040, 0, 6); this.flash.position.set(0, 0.02, -0.65); gun.add(this.flash);
    this.flashM = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd070, transparent: true })); this.flashM.position.set(0, 0.02, -0.62); gun.add(this.flashM);
    this.pos = new THREE.Vector3(0, 0, 0); this.vel = new THREE.Vector3(); this.hp = 100; this.mag = 30; this.res = 180; this.reload = 0; this.cool = 0; this.recoil = 0;
    this.enemies = []; this.wave = 0; this.kills = 0; this.score = 0; this.hit = 0; this.hurt = 0; this.lastHurt = 9; this.feed = []; this.streak = 0; this.t = 0; this.dead = false;
    this.nextWave();
  }
  soldier() {
    const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: 0x5a5a3a, roughness: 0.8 }), skin = new THREE.MeshStandardMaterial({ color: 0xc09070 }), dark = new THREE.MeshStandardMaterial({ color: 0x2a2a22 });
    const b = (w, h, d, x, y, m, part) => { const s = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); s.position.set(x, y, 0); s.castShadow = true; s.userData.part = part; g.add(s); return s; };
    b(0.6, 0.75, 0.35, 0, 1.15, mat, 'body'); b(0.32, 0.34, 0.32, 0, 1.72, skin, 'head'); b(0.36, 0.14, 0.36, 0, 1.9, dark, 'head');
    const lL = b(0.24, 0.8, 0.26, -0.15, 0.4, mat, 'body'), lR = b(0.24, 0.8, 0.26, 0.15, 0.4, mat, 'body'); b(0.08, 0.1, 0.6, 0.25, 1.2, dark, 'body').position.z = 0.3;
    const a = Math.random() * Math.PI * 2; g.position.set(Math.cos(a) * 34, 0, Math.sin(a) * 34);
    this.scene.add(g); return { g, lL, lR, hp: 100, cd: 1.5 + Math.random() * 2, t: Math.random() * 5, strafe: Math.random() < 0.5 ? 1 : -1 };
  }
  nextWave() { this.wave++; for (let i = 0; i < 2 + this.wave * 2; i++) this.enemies.push(this.soldier()); this.banner = [`WAVE ${this.wave}`, 2.5]; }
  los(a, b) { const d = b.clone().sub(a), len = d.length(); const r = new THREE.Raycaster(a, d.normalize(), 0, len); return r.intersectObjects(this.cover, false).length === 0; }
  shoot() {
    if (this.reload > 0 || this.cool > 0) return;
    if (this.mag <= 0) { this.startReload(); return; }
    this.mag--; this.cool = 0.095; this.recoil = 1; this.flash.intensity = 6; this.flashM.visible = true;
    A.rifle();
    const spread = this.ads ? 0.004 : 0.02 + this.recoil * 0.01;
    const dir = new THREE.Vector3((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread, -1).applyQuaternion(this.cam.quaternion).normalize();
    const r = new THREE.Raycaster(this.cam.getWorldPosition(new THREE.Vector3()), dir, 0, 120);
    const hits = r.intersectObjects([...this.cover, ...this.enemies.map(e => e.g)], true);
    const h = hits[0]; if (!h || !h.object.userData.part) return;
    const e = this.enemies.find(e => e.g === h.object.parent), head = h.object.userData.part === 'head';
    e.hp -= head ? 100 : 34; this.hit = 0.15; this.hitHead = head; A.beep(head ? 1800 : 1200, 0.03, 0.12, 'square');
    if (e.hp <= 0) {
      this.kills++; this.streak++; this.score += head ? 150 : 100; this.os.earn(10, 'Duty Calls');
      this.feed.unshift([head ? 'You  ⌖  Ghost-7 (headshot)' : 'You  ⌖  Ghost-7', 4]);
      if (this.streak === 3) this.banner = ['UAV ONLINE', 2]; if (this.streak === 5) this.banner = ['AIRSTRIKE READY', 2]; if (this.streak === 7) this.banner = ['ATTACK CHOPPER INBOUND', 2];
      e.dying = 1; this.enemies = this.enemies.filter(x => x !== e); this.dyingList = (this.dyingList || []).concat(e);
      if (!this.enemies.length) setTimeout(() => this.nextWave(), 2500);
    }
  }
  startReload() { if (this.reload > 0 || this.res <= 0 || this.mag === 30) return; this.reload = 1.8; A.beep(600, 0.04, 0.1, 'square'); A.beep(400, 0.05, 0.12, 'square', 1.2); }
  update(dt) {
    const P = this.pad; this.t += dt;
    if (this.dead) { this.deadT -= dt; if (this.deadT <= 0) this.respawn(); return; }
    P.update(dt);
    const w = P.wish(new THREE.Vector3()), sp = P.keys.ShiftLeft && !this.ads ? 7 : this.ads ? 2.5 : 4.5;
    this.vel.x = w.x * sp; this.vel.z = w.z * sp; this.vel.y -= 20 * dt;
    if (P.keys.Space && this.ground) this.vel.y = 6.5;
    this.ground = collide(this.pos, this.vel, dt, this.solids, 0.35, 1.7) || this.pos.y <= 0;
    if (this.pos.y < 0) { this.pos.y = 0; this.vel.y = 0; }
    this.ads = !!P.btn[2] || !!P.keys.KeyQ;
    this.cam.fov += ((this.ads ? 45 : 72) - this.cam.fov) * Math.min(1, dt * 12); this.cam.updateProjectionMatrix();
    const bob = w.lengthSq() && this.ground ? Math.sin(this.t * (sp > 5 ? 14 : 10)) : 0;
    this.cam.position.set(this.pos.x, this.pos.y + 1.6 + bob * 0.03, this.pos.z);
    this.cam.rotation.set(P.pitch + this.recoil * 0.03, P.yaw, 0, 'YXZ');
    this.gun.position.set(this.ads ? 0 : 0.22, (this.ads ? -0.13 : -0.2) + bob * 0.01, -0.45 + this.recoil * 0.05);
    this.cool -= dt; this.recoil = Math.max(0, this.recoil - dt * 8); this.flash.intensity *= 0.5; this.flashM.visible = this.flash.intensity > 1; this.hit -= dt;
    if ((P.btn[0] || P.keys.ControlLeft) && !this.dead) this.shoot();
    if (this.reload > 0) { this.reload -= dt; this.gun.rotation.x = Math.sin(Math.min(1, (1.8 - this.reload) / 1.8) * Math.PI) * 0.5; if (this.reload <= 0) { const n = Math.min(30 - this.mag, this.res); this.mag += n; this.res -= n; this.gun.rotation.x = 0; } }
    const me = this.cam.position;
    for (const e of this.enemies) {
      e.t += dt; e.cd -= dt;
      const to = me.clone().sub(e.g.position); to.y = 0; const d = to.length(); to.normalize();
      const eye = e.g.position.clone(); eye.y = 1.7; const sees = d < 45 && this.los(eye, me);
      e.g.rotation.y = Math.atan2(to.x, to.z);
      let mv = new THREE.Vector3();
      if (!sees || d > 16) mv.copy(to); else mv.set(-to.z * e.strafe, 0, to.x * e.strafe).multiplyScalar(0.6);
      if (Math.random() < 0.005) e.strafe *= -1;
      const np = e.g.position.clone().addScaledVector(mv, dt * 3.2), bb = new THREE.Box3(new THREE.Vector3(np.x - 0.3, 0.1, np.z - 0.3), new THREE.Vector3(np.x + 0.3, 1.8, np.z + 0.3));
      if (!this.solids.some(s => s.intersectsBox(bb))) e.g.position.copy(np); else e.strafe *= -1;
      const sw = Math.sin(e.t * 9) * 0.6; e.lL.rotation.x = sw; e.lR.rotation.x = -sw;
      if (sees && e.cd <= 0) {
        e.cd = 0.9 + Math.random() * 1.2; A.beep(140, 0.05, 0.08, 'sawtooth');
        if (Math.random() < Math.max(0.12, 0.55 - d * 0.02)) { this.hp -= 12 + Math.random() * 8; this.hurt = 1; this.lastHurt = 0; A.hurt(); this.streak = 0; }
      }
    }
    for (const e of this.dyingList || []) { e.dying -= dt; e.g.rotation.x = Math.min(Math.PI / 2, e.g.rotation.x + dt * 5); if (e.dying <= 0) this.scene.remove(e.g); }
    this.dyingList = (this.dyingList || []).filter(e => e.dying > 0);
    this.hurt = Math.max(0, this.hurt - dt * 1.5); this.lastHurt += dt; if (this.lastHurt > 4) this.hp = Math.min(100, this.hp + dt * 25);
    if (this.hp <= 0) { this.dead = true; this.deadT = 3; A.growl(); }
    this.feed.forEach(f => (f[1] -= dt)); this.feed = this.feed.filter(f => f[1] > 0).slice(0, 5);
    if (this.banner) { this.banner[1] -= dt; if (this.banner[1] <= 0) this.banner = null; }
  }
  respawn() { this.dead = false; this.hp = 100; this.pos.set(0, 0, 0); this.mag = 30; this.res = Math.max(this.res, 90); this.streak = 0; }
  draw(g, w, h) {
    gameRenderer().render(this.scene, this.cam); blit(g, w, h);
    const dmg = Math.max(this.hurt, 1 - this.hp / 100) * 0.6;
    if (dmg > 0.02) { const r = g.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.8); r.addColorStop(0, 'rgba(160,0,0,0)'); r.addColorStop(1, `rgba(160,0,0,${dmg})`); g.fillStyle = r; g.fillRect(0, 0, w, h); }
    if (!this.ads) { const s = 10 + this.recoil * 12; g.fillStyle = '#fff'; g.fillRect(w / 2 - 1, h / 2 - s - 8, 2, 8); g.fillRect(w / 2 - 1, h / 2 + s, 2, 8); g.fillRect(w / 2 - s - 8, h / 2 - 1, 8, 2); g.fillRect(w / 2 + s, h / 2 - 1, 8, 2); }
    else { g.fillStyle = '#f33'; g.beginPath(); g.arc(w / 2, h / 2, 2.5, 0, 7); g.fill(); }
    if (this.hit > 0) { g.strokeStyle = this.hitHead ? '#f44' : '#fff'; g.lineWidth = 2; g.beginPath(); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.moveTo(w / 2 + a * 6, h / 2 + b * 6); g.lineTo(w / 2 + a * 13, h / 2 + b * 13); } g.stroke(); g.lineWidth = 1; }
    // minimap
    g.fillStyle = 'rgba(10,14,10,.6)'; g.fillRect(14, 14, 130, 130); g.strokeStyle = 'rgba(160,220,160,.6)'; g.strokeRect(14, 14, 130, 130);
    g.fillStyle = '#7f7'; g.save(); g.translate(79, 79); g.rotate(-this.pad.yaw); g.beginPath(); g.moveTo(0, -6); g.lineTo(4, 4); g.lineTo(-4, 4); g.fill(); g.restore();
    if (this.streak >= 3) for (const e of this.enemies) { const dx = (e.g.position.x - this.pos.x) * 1.6, dz = (e.g.position.z - this.pos.z) * 1.6; if (Math.abs(dx) < 62 && Math.abs(dz) < 62) { g.fillStyle = '#f44'; g.fillRect(79 + dx - 2, 79 + dz - 2, 4, 4); } }
    g.fillStyle = '#fff'; g.font = 'bold 11px Arial'; g.fillText(this.streak >= 3 ? 'UAV' : '', 20, 138);
    // ammo / score
    g.textAlign = 'right'; g.fillStyle = '#fff'; g.font = 'bold 34px Arial'; g.fillText(`${this.mag}`, w - 80, h - 26); g.font = '18px Arial'; g.fillStyle = '#ccc'; g.fillText(`/ ${this.res}`, w - 20, h - 28);
    g.font = 'bold 12px Arial'; g.fillText('M4-CUSTOM', w - 20, h - 64); if (this.mag === 0 && this.reload <= 0) { g.fillStyle = '#f55'; g.textAlign = 'center'; g.fillText('PRESS R TO RELOAD', w / 2, h / 2 + 48); }
    if (this.reload > 0) { g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText('RELOADING', w / 2, h / 2 + 48); }
    g.textAlign = 'left'; g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(14, h - 58, 220, 44); g.fillStyle = '#fff'; g.font = 'bold 15px Arial';
    g.fillText(`WAVE ${this.wave}   KILLS ${this.kills}`, 24, h - 38); g.font = '12px Arial'; g.fillText(`SCORE ${this.score}   STREAK ${this.streak}`, 24, h - 20);
    g.textAlign = 'right'; g.font = '13px Arial'; this.feed.forEach((f, i) => { g.fillStyle = `rgba(255,255,255,${Math.min(1, f[1])})`; g.fillText(f[0], w - 16, 30 + i * 18); }); g.textAlign = 'left';
    if (this.banner) { g.textAlign = 'center'; g.font = 'bold 36px Arial'; g.fillStyle = '#ffcf3a'; g.fillText(this.banner[0], w / 2, h * 0.28); g.textAlign = 'left'; }
    if (this.dead) { g.fillStyle = 'rgba(80,0,0,.6)'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = 'bold 40px Arial'; g.textAlign = 'center'; g.fillText('K.I.A.', w / 2, h / 2); g.font = '16px Arial'; g.fillText('respawning...', w / 2, h / 2 + 30); g.textAlign = 'left'; }
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(w / 2 - 250, h - 22, 500, 18); g.fillStyle = '#ddd'; g.font = '11px Arial'; g.textAlign = 'center';
    g.fillText('click the screen to capture mouse · WASD · Shift sprint · click fire · right-click/Q aim · R reload · Space jump', w / 2, h - 9); g.textAlign = 'left';
  }
  key(e, down) { this.pad.key(e, down); if (down && e.code === 'KeyR') this.startReload(); }
  mouse(type, x, y, b) { this.pad.mouse(type, x, y, b); }
}

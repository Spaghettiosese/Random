// Keyframe animation for viewmodel parts.
// Clips are offsets from each part's rest pose: p = metres, r = degrees (YXZ euler).
// Channels use monotone cubic interpolation: smooth through keys, no overshoot,
// so any overshoot/settle in a clip is authored on purpose.
import * as THREE from '../../vendor/three.module.min.js';

const D2R = Math.PI / 180;

function channel(keys, idx) {
  if (keys[0][0] > 0) keys = [[0, 0, 0, 0], ...keys];
  const n = keys.length;
  const ts = keys.map(k => k[0]), vs = keys.map(k => k[idx]);
  const m = new Array(n).fill(0);
  const h = [], d = [];
  for (let i = 0; i < n - 1; i++) { h[i] = ts[i + 1] - ts[i]; d[i] = (vs[i + 1] - vs[i]) / h[i]; }
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) continue;
    const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
    m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  return { ts, vs, m };
}

function sample(ch, t) {
  const { ts, vs, m } = ch, n = ts.length;
  if (t <= ts[0]) return vs[0];
  if (t >= ts[n - 1]) return vs[n - 1];
  let i = 0;
  while (ts[i + 1] < t) i++;
  const h = ts[i + 1] - ts[i], s = (t - ts[i]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * vs[i] + (s3 - 2 * s2 + s) * h * m[i]
       + (-2 * s3 + 3 * s2) * vs[i + 1] + (s3 - s2) * h * m[i + 1];
}

export function compile(def) {
  const tracks = {};
  for (const [name, tr] of Object.entries(def.tracks || {})) {
    tracks[name] = {
      p: tr.p ? [1, 2, 3].map(i => channel(tr.p, i)) : null,
      r: tr.r ? [1, 2, 3].map(i => channel(tr.r, i)) : null,
    };
  }
  return { dur: def.dur, tracks, events: (def.events || []).slice().sort((a, b) => a[0] - b[0]) };
}

const _e = new THREE.Euler(), _q = new THREE.Quaternion();

export class Animator {
  constructor(parts) {
    this.parts = Object.entries(parts).map(([name, obj]) => ({
      name, obj, rp: obj.position.clone(), rq: obj.quaternion.clone(),
      cur: new Float32Array(6), from: new Float32Array(6), ex: new Float32Array(6),
    }));
    this.byName = Object.fromEntries(this.parts.map(p => [p.name, p]));
    this.clip = null; this.t = 0; this.bt = 1; this.blend = 0.1; this.speed = 1;
    this.onEvent = null; this.onDone = null; this.evi = 0;
  }
  // Procedural offsets layered on top of clips (slide blowback, cylinder index...).
  extra(name) { return this.byName[name].ex; }
  _snap() { for (const p of this.parts) p.from.set(p.cur); this.bt = 0; }
  play(clip, o = {}) {
    this._snap();
    this.clip = clip; this.t = 0; this.evi = 0;
    this.blend = o.blend ?? 0.09; this.speed = o.speed ?? 1;
    this.onEvent = o.onEvent || null; this.onDone = o.onDone || null;
  }
  stop(blend = 0.16) {
    this._snap();
    this.clip = null; this.blend = blend; this.onDone = null; this.onEvent = null;
  }
  pose(clip, t) { this.clip = clip; this.t = t; this.bt = this.blend; this.evi = 1e9; this.onDone = null; this.update(0); }
  update(dt) {
    let finished = false;
    const clip = this.clip;
    if (clip) {
      this.t += dt * this.speed;
      while (this.evi < clip.events.length && clip.events[this.evi][0] <= this.t) {
        const ev = clip.events[this.evi++];
        if (this.onEvent) this.onEvent(ev[1]);
      }
      if (this.t >= clip.dur && this.evi < 1e9) { this.t = clip.dur; finished = true; }
    }
    this.bt += dt;
    let w = this.blend > 0 ? Math.min(1, this.bt / this.blend) : 1;
    w = w * w * (3 - 2 * w);
    for (const p of this.parts) {
      const tr = clip && clip.tracks[p.name];
      for (let i = 0; i < 6; i++) {
        let s = 0;
        if (tr) {
          const chs = i < 3 ? tr.p : tr.r;
          if (chs) s = sample(chs[i % 3], this.t);
        }
        p.cur[i] = p.from[i] + (s - p.from[i]) * w;
      }
      const c = p.cur, x = p.ex;
      p.obj.position.set(p.rp.x + c[0] + x[0], p.rp.y + c[1] + x[1], p.rp.z + c[2] + x[2]);
      _e.set((c[3] + x[3]) * D2R, (c[4] + x[4]) * D2R, (c[5] + x[5]) * D2R, 'YXZ');
      p.obj.quaternion.copy(p.rq).multiply(_q.setFromEuler(_e));
    }
    if (finished) {
      const cb = this.onDone;
      this._snap();
      this.clip = null; this.blend = 0.12; this.onDone = null; this.onEvent = null;
      if (cb) cb();
    }
  }
}

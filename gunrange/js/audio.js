// All sound is synthesised with WebAudio: no audio files.
const SHOTS = {
  //            gain  body Hz  length  thump Hz  tail
  pistol:   { g: .75, f: 5200, d: .16, th: 170, tail: .5 },
  revolver: { g: 1.0, f: 3800, d: .24, th: 120, tail: .8 },
  carbine:  { g: .8,  f: 6200, d: .14, th: 150, tail: .55 },
  shotgun:  { g: 1.1, f: 2600, d: .32, th: 85,  tail: .9 },
  sniper:   { g: 1.2, f: 4200, d: .36, th: 70,  tail: 1.4 },
  smg:      { g: .65, f: 5800, d: .11, th: 190, tail: .4 },
  supp:     { g: .3,  f: 1700, d: .09, th: 150, tail: .12 },
  heavy:    { g: 1.35, f: 3000, d: .44, th: 55, tail: 1.7 },
};
// Mechanical sounds: lists of [bandpass Hz, seconds, gain, delay].
const MECH = {
  magOut:   [[1500, .05, .35, 0], [700, .05, .2, .02]],
  magIn:    [[1100, .05, .45, 0], [2600, .03, .35, .035]],
  slide:    [[2400, .04, .4, 0], [1600, .06, .45, .07]],
  slideRelease: [[1800, .06, .55, 0]],
  boltUp:   [[2000, .04, .35, 0]],
  boltBack: [[1300, .07, .45, 0]],
  boltFwd:  [[1500, .07, .45, 0]],
  boltDown: [[2300, .04, .4, 0]],
  pump1:    [[900, .09, .6, 0], [1900, .04, .35, .03]],
  pump2:    [[1100, .08, .6, 0], [2300, .04, .4, .04]],
  shellIn:  [[1400, .05, .4, 0], [800, .05, .3, .04]],
  cylOpen:  [[2100, .04, .4, 0]],
  cylClose: [[1700, .05, .55, 0], [2800, .03, .3, .02]],
  eject:    [[3200, .05, .25, 0], [3600, .05, .2, .12], [3000, .05, .2, .2]],
  spin:     Array.from({ length: 14 }, (_, i) => [3400, .012, .16, i * .028 + i * i * .0022]),
  hammer:   [[2600, .025, .3, 0]],
  charge:   [[1500, .06, .45, 0], [1900, .05, .5, .16]],
  dry:      [[2600, .03, .35, 0]],
  cloth:    [[500, .14, .16, 0]],
  step:     [[180, .08, .22, 0]],
  paper:    [[900, .05, .3, 0]],
  thud:     [[260, .09, .4, 0]],
};

export class Sfx {
  constructor() { this.ctx = null; }
  init() {
    if (this.ctx) { this.ctx.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const ctx = this.ctx = new C();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 6; comp.release.value = .12;
    this.out = ctx.createGain(); this.out.gain.value = .6;
    this.out.connect(comp); comp.connect(ctx.destination);
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
  }
  _noise(type, f0, f1, q, dur, gain, delay = 0) {
    const ctx = this.ctx, t = ctx.currentTime + delay;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
    src.loopStart = Math.random(); src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + .002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.out);
    src.start(t, Math.random()); src.stop(t + dur + .05);
  }
  _tone(f0, f1, dur, gain, delay = 0, type = 'sine') {
    const ctx = this.ctx, t = ctx.currentTime + delay;
    const o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + dur + .05);
  }
  shot(kind) {
    if (!this.ctx) return;
    const s = SHOTS[kind];
    this._noise('lowpass', s.f, 500, .6, s.d, s.g);                 // body
    this._noise('highpass', 2500, 6000, .5, .035, s.g * .7);        // crack
    this._tone(s.th, s.th * .3, s.d * .8, s.g * .9);                // thump
    this._noise('bandpass', 700, 300, .8, s.tail, s.g * .16, .06);  // echo off the berm
    this._noise('lowpass', 900, 200, .5, s.tail * .7, s.g * .1, .22);
  }
  mech(name) {
    if (!this.ctx) return false;
    const m = MECH[name];
    if (!m) return false;
    for (const [f, d, g, dl] of m) this._noise('bandpass', f, f * .8, 3.5, d, g, dl);
    return true;
  }
  ding(pitch = 1, delay = 0) {
    if (!this.ctx) return;
    for (const [mult, g, d] of [[1, .3, .9], [2.71, .16, .55], [4.9, .1, .35], [7.3, .05, .2]])
      this._tone(780 * pitch * mult, 775 * pitch * mult, d, g, delay);
    this._noise('bandpass', 3000, 2500, 2, .03, .3, delay);
  }
  shell(kind) {
    if (!this.ctx) return;
    const f = kind === 'shell' ? 900 : 4200 + Math.random() * 900;
    this._tone(f, f * .97, .09, .05, .45 + Math.random() * .1, 'triangle');
    this._tone(f * 1.04, f, .07, .035, .6 + Math.random() * .1, 'triangle');
  }
  beep(f = 880, d = .12) { if (this.ctx) this._tone(f, f, d, .15, 0, 'square'); }
}

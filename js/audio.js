// All sound in the game is synthesized live with the Web Audio API.
let ctx = null, master, sfx, amb, verb, noiseBuf;
let ambient = null;
let volume = 0.8;

function makeImpulse(sec, decay) {
  const len = ctx.sampleRate * sec;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

export const Audio = {
  init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = volume; master.connect(ctx.destination);
    sfx = ctx.createGain(); sfx.connect(master);
    amb = ctx.createGain(); amb.gain.value = 0.7; amb.connect(master);
    verb = ctx.createConvolver(); verb.buffer = makeImpulse(2.4, 3);
    const vg = ctx.createGain(); vg.gain.value = 0.35; verb.connect(vg); vg.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  },
  resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); },
  setVolume(v) { volume = v; if (master) master.gain.value = v; },
  get ready() { return !!ctx; },

  // ---------- primitives ----------
  tone(freq, dur, { type = 'sine', vol = 0.3, at = 0, slide = null, attack = 0.005, rev = 0, dest = null } = {}) {
    if (!ctx) return;
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(1, slide), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || sfx);
    if (rev) { const r = ctx.createGain(); r.gain.value = rev; g.connect(r); r.connect(verb); }
    o.start(t); o.stop(t + dur + 0.05);
    return o;
  },
  noise(dur, { vol = 0.3, at = 0, freq = 1000, q = 1, type = 'lowpass', attack = 0.005, rev = 0, slide = null, dest = null } = {}) {
    if (!ctx) return;
    const t = ctx.currentTime + at;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (slide) f.frequency.exponentialRampToValueAtTime(slide, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || sfx);
    if (rev) { const r = ctx.createGain(); r.gain.value = rev; g.connect(r); r.connect(verb); }
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  },

  // ---------- sound effects ----------
  blip(pitch = 1) { this.tone(420 * pitch * (0.92 + Math.random() * 0.16), 0.05, { type: 'square', vol: 0.05 }); },
  step(hard = true) { this.noise(0.09, { vol: hard ? 0.12 : 0.07, freq: hard ? 900 : 500, q: 0.8, type: 'bandpass' }); },
  click() { this.tone(1400, 0.03, { type: 'square', vol: 0.06 }); },
  bell() {
    for (let i = 0; i < 26; i++) {
      this.tone(1850, 0.07, { type: 'square', vol: 0.07, at: i * 0.075, rev: 0.4 });
      this.tone(2310, 0.07, { type: 'square', vol: 0.04, at: i * 0.075 + 0.03 });
    }
  },
  bounce(v = 1) { this.tone(140, 0.18, { vol: 0.35 * v, slide: 60 }); this.noise(0.05, { vol: 0.15 * v, freq: 400 }); },
  swish() { this.noise(0.35, { vol: 0.2, freq: 3000, type: 'highpass', attack: 0.05, slide: 6000 }); },
  rim() { this.tone(520, 0.4, { type: 'triangle', vol: 0.2, rev: 0.3 }); this.tone(780, 0.3, { type: 'triangle', vol: 0.1 }); },
  pickup() { this.tone(660, 0.1, { type: 'triangle', vol: 0.15 }); this.tone(990, 0.2, { type: 'triangle', vol: 0.15, at: 0.08 }); },
  thread() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.6, { type: 'sine', vol: 0.12, at: i * 0.09, rev: 0.8 })); },
  door() { this.noise(0.5, { vol: 0.2, freq: 300, q: 4, type: 'bandpass', slide: 180 }); this.tone(90, 0.3, { vol: 0.25, at: 0.35, slide: 50 }); },
  creak() { this.tone(110, 1.2, { type: 'sawtooth', vol: 0.06, slide: 190, attack: 0.2, rev: 0.5 }); },
  slam() { this.noise(0.6, { vol: 0.6, freq: 250, rev: 0.6 }); this.tone(60, 0.5, { vol: 0.6, slide: 30 }); },
  locker() { this.noise(0.25, { vol: 0.35, freq: 1400, q: 3, type: 'bandpass', rev: 0.5 }); this.tone(220, 0.3, { type: 'square', vol: 0.05 }); },
  buzz(dur = 0.4) { this.tone(120, dur, { type: 'sawtooth', vol: 0.05 }); this.tone(240, dur, { type: 'square', vol: 0.02 }); },
  phone() { for (let i = 0; i < 2; i++) this.tone(180, 0.18, { type: 'square', vol: 0.08, at: i * 0.25 }); },
  laugh(n = 8) { for (let i = 0; i < n; i++) this.tone(500 + Math.random() * 500, 0.08, { type: 'triangle', vol: 0.05, at: i * 0.09 + Math.random() * 0.05, slide: 350 }); },
  chew() { for (let i = 0; i < 6; i++) this.noise(0.12, { vol: 0.2, freq: 600, q: 2, type: 'bandpass', at: i * 0.28, rev: 0.4 }); },
  heartbeat(v = 0.5) { this.tone(55, 0.15, { vol: v, slide: 40 }); this.tone(50, 0.15, { vol: v * 0.8, at: 0.22, slide: 38 }); },
  hurt() { this.noise(0.3, { vol: 0.5, freq: 500, slide: 150 }); this.tone(200, 0.3, { type: 'sawtooth', vol: 0.15, slide: 90 }); },
  whoosh() { this.noise(0.6, { vol: 0.3, freq: 300, slide: 2500, type: 'bandpass', q: 1.5, attack: 0.2 }); },
  hit() { this.tone(300, 0.2, { type: 'square', vol: 0.3, slide: 80 }); this.noise(0.3, { vol: 0.4, freq: 2000, rev: 0.6 }); },
  stinger() {
    this.noise(1.4, { vol: 0.9, freq: 3000, attack: 0.01, slide: 400, rev: 0.8 });
    [220, 233, 311, 330, 466].forEach(f => this.tone(f, 1.6, { type: 'sawtooth', vol: 0.18, slide: f * 0.5, rev: 0.6 }));
    this.tone(70, 1.5, { vol: 0.9, slide: 25 });
  },
  screech() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    const lfo = ctx.createOscillator(); lfo.frequency.value = 22;
    const lg = ctx.createGain(); lg.gain.value = 120; lfo.connect(lg); lg.connect(o.frequency);
    o.frequency.setValueAtTime(500, t);
    o.frequency.linearRampToValueAtTime(1500, t + 0.35);
    o.frequency.linearRampToValueAtTime(700, t + 1.2);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1300; f.Q.value = 2;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    o.connect(f); f.connect(g); g.connect(sfx); const r = ctx.createGain(); r.gain.value = 0.6; g.connect(r); r.connect(verb);
    o.start(t); lfo.start(t); o.stop(t + 1.4); lfo.stop(t + 1.4);
  },
  hoot() { // "ooh ooh AH AH"
    [[300, 0], [320, 0.25], [700, 0.5], [760, 0.72]].forEach(([f, a]) => this.tone(f, 0.22, { type: 'sawtooth', vol: 0.18, at: a, slide: f * 1.4, rev: 0.7 }));
  },
  roar() {
    this.noise(2.2, { vol: 0.8, freq: 180, q: 1, attack: 0.3, rev: 0.9, slide: 90 });
    [55, 58, 82].forEach(f => this.tone(f, 2.2, { type: 'sawtooth', vol: 0.3, attack: 0.3, slide: f * 0.7, rev: 0.5 }));
  },
  drum(v = 0.5, at = 0) { this.tone(95, 0.35, { vol: v, at, slide: 45, rev: 0.5 }); this.noise(0.08, { vol: v * 0.3, freq: 600, at }); },
  engineStart() { this.noise(1.2, { vol: 0.2, freq: 200, slide: 90 }); },

  // ---------- ambient beds ----------
  setAmbient(name) {
    if (!ctx) return;
    if (ambient) { ambient.stop(); ambient = null; }
    const nodes = [], timers = [];
    const out = ctx.createGain(); out.gain.value = 0.0001; out.connect(amb);
    out.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 2);
    const osc = (f, type, v, detune = 0) => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = detune;
      const g = ctx.createGain(); g.gain.value = v; o.connect(g); g.connect(out); o.start(); nodes.push(o); return o;
    };
    const noiseBed = (freq, v, type = 'lowpass', q = 0.7) => {
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      const g = ctx.createGain(); g.gain.value = v; s.connect(f); f.connect(g); g.connect(out); s.start(); nodes.push(s); return f;
    };
    const every = (ms, fn) => timers.push(setInterval(fn, ms));
    switch (name) {
      case 'school': // murmur of kids + fluorescent hum
        noiseBed(700, 0.05, 'bandpass', 0.6); osc(120, 'sine', 0.012);
        every(260, () => { if (Math.random() < 0.5) this.tone(250 + Math.random() * 350, 0.12, { type: 'triangle', vol: 0.012, dest: out }); });
        every(4000, () => { if (Math.random() < 0.3) this.laugh(4); });
        break;
      case 'school-quiet':
        osc(120, 'sine', 0.015); osc(60, 'sine', 0.02); noiseBed(300, 0.02);
        break;
      case 'outside':
        noiseBed(500, 0.04); // wind
        every(2500, () => { if (Math.random() < 0.4) [0, 0.12].forEach(a => this.tone(2200 + Math.random() * 800, 0.08, { type: 'sine', vol: 0.02, at: a, slide: 3000 })); });
        break;
      case 'dusk':
        noiseBed(350, 0.05); osc(55, 'sine', 0.03); osc(82.4, 'sine', 0.015, 7);
        every(6000, () => { if (Math.random() < 0.4) this.drum(0.08); });
        break;
      case 'home': { // quiet room tone + music box
        noiseBed(200, 0.015); osc(60, 'sine', 0.01);
        const mel = [659, 587, 523, 494, 523, 587, 659, 0, 659, 587, 523, 440, 494, 523, 494, 0];
        let i = 0; every(520, () => { const f = mel[i++ % mel.length]; if (f) this.tone(f, 0.9, { type: 'triangle', vol: 0.025, rev: 0.6 }); });
        break;
      }
      case 'home-night': {
        noiseBed(160, 0.02); osc(49, 'sine', 0.03); osc(73.4, 'sine', 0.012, -9);
        const mel = [659, 622, 523, 494, 466, 523, 0, 0];
        let i = 0; every(900, () => { const f = mel[i++ % mel.length]; if (f) this.tone(f, 1.4, { type: 'triangle', vol: 0.018, rev: 0.9 }); });
        break;
      }
      case 'car':
        { const f = noiseBed(160, 0.08); osc(38, 'sawtooth', 0.02); every(3000, () => { f.frequency.value = 140 + Math.random() * 60; }); }
        break;
      case 'night':
        osc(41.2, 'sine', 0.05); osc(43.6, 'sine', 0.04); noiseBed(250, 0.03);
        every(7000, () => { if (Math.random() < 0.5) this.creak(); });
        every(5200, () => { if (Math.random() < 0.3) this.drum(0.1); });
        break;
      case 'dream':
        osc(55, 'sawtooth', 0.02); osc(55.6, 'sawtooth', 0.02); osc(110, 'sine', 0.02); noiseBed(900, 0.02, 'bandpass', 3);
        { let b = 0; every(700, () => { this.drum(b % 4 === 0 ? 0.3 : 0.14); b++; }); }
        break;
      case 'chase':
        osc(55, 'sawtooth', 0.03); osc(58.3, 'sawtooth', 0.03);
        { let b = 0; every(230, () => { this.drum(b % 2 === 0 ? 0.35 : 0.18); if (b % 8 === 0) this.tone(880, 0.2, { type: 'square', vol: 0.02 }); b++; }); }
        break;
      case 'boss':
        osc(41.2, 'sawtooth', 0.04); osc(61.7, 'sawtooth', 0.02, 8);
        { let b = 0; const pat = [1, 0, 0.5, 0, 1, 0.5, 0, 0.5];
          every(190, () => { const v = pat[b % 8]; if (v) this.drum(0.3 * v); if (b % 32 === 0) this.tone(233, 2.5, { type: 'sawtooth', vol: 0.03, rev: 0.6 }); b++; }); }
        break;
      case 'dawn': {
        noiseBed(600, 0.02); const ch = [[262, 330, 392], [220, 262, 330], [175, 220, 262], [196, 247, 294]]; let i = 0;
        every(2600, () => { ch[i++ % 4].forEach(f => this.tone(f, 2.8, { type: 'triangle', vol: 0.03, attack: 0.6, rev: 0.7 })); });
        break;
      }
      default: break;
    }
    ambient = {
      stop() {
        timers.forEach(clearInterval);
        const t = ctx.currentTime;
        out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
        setTimeout(() => { nodes.forEach(n => { try { n.stop(); } catch (e) { } }); out.disconnect(); }, 1400);
      }
    };
  },
  stopAmbient() { if (ambient) { ambient.stop(); ambient = null; } },
};

// ---------- optional voice acting via speechSynthesis ----------
const VOICES = {
  Carlos: { pitch: 1.15, rate: 1.05 }, Eric: { pitch: 1.5, rate: 1.1 }, Mom: { pitch: 1.3, rate: 1 },
  Dad: { pitch: 0.8, rate: 0.95 }, 'Ms. Rosebrook': { pitch: 1.15, rate: 0.95 }, 'Sister Agnes': { pitch: 1.1, rate: 0.85 },
  'Miss Gloria': { pitch: 1.2, rate: 1 }, Jaden: { pitch: 1.3, rate: 1.1 }, MOONKAI: { pitch: 0.1, rate: 0.7 },
  '???': { pitch: 0.3, rate: 0.8 },
};
export function speak(name, text, enabled) {
  if (!enabled || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*_]/g, ''));
    const v = VOICES[name] || { pitch: 1, rate: 1 };
    u.pitch = v.pitch; u.rate = v.rate; u.volume = volume;
    speechSynthesis.speak(u);
  } catch (e) { /* speech not available */ }
}
export function stopSpeech() { try { speechSynthesis.cancel(); } catch (e) { } }

// All sound is synthesized with WebAudio: no asset files.
let ctx, master, noiseBuf, rainGain, rainFilt, humGain;

function gainNode(v) { const g = ctx.createGain(); g.gain.value = v; return g; }
function env(g, t, a, peak, dur) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dur);
}
function tone({ type = 'sine', f = 440, f2 = null, t = 0, dur = 0.1, vol = 0.2, attack = 0.002, dest = master }) {
  if (!ctx) return;
  const now = ctx.currentTime + t, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, now);
  if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(1, f2), now + attack + dur);
  env(g, now, attack, vol, dur);
  o.connect(g).connect(dest); o.start(now); o.stop(now + attack + dur + 0.05);
}
function burst({ f = 1000, f2 = null, q = 1, type = 'bandpass', t = 0, dur = 0.05, vol = 0.3, attack = 0.001, dest = master }) {
  if (!ctx) return;
  const now = ctx.currentTime + t, s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noiseBuf; s.playbackRate.value = 0.8 + Math.random() * 0.4;
  fl.type = type; fl.frequency.setValueAtTime(f, now); fl.Q.value = q;
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, now + attack + dur);
  env(g, now, attack, vol, dur);
  s.connect(fl).connect(g).connect(dest); s.start(now, Math.random()); s.stop(now + attack + dur + 0.05);
}

const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
function freq(n) { const m = n.match(/^([A-G]#?)(\d)$/); return m ? 440 * 2 ** ((NOTE[m[1]] + (m[2] - 4) * 12 - 9) / 12) : 0; }

export const A = {
  get ctx() { return ctx; },
  init() {
    if (ctx) { ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = gainNode(0.7);
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // rain bed
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    rainFilt = ctx.createBiquadFilter(); rainFilt.type = 'lowpass'; rainFilt.frequency.value = 2600;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 300;
    rainGain = gainNode(0.14);
    s.connect(hp).connect(rainFilt).connect(rainGain).connect(master); s.start();
    // CRT / PC hum
    humGain = gainNode(0);
    const h1 = ctx.createOscillator(); h1.frequency.value = 60; h1.connect(humGain);
    const h2 = ctx.createOscillator(); h2.type = 'sawtooth'; h2.frequency.value = 120;
    const hf = ctx.createBiquadFilter(); hf.type = 'lowpass'; hf.frequency.value = 300; h2.connect(hf).connect(humGain);
    const whine = ctx.createOscillator(); whine.frequency.value = 15600; const wg = gainNode(0.05); whine.connect(wg).connect(humGain);
    humGain.connect(master); h1.start(); h2.start(); whine.start();
  },
  indoors(v) {
    if (!ctx) return; const t = ctx.currentTime;
    rainFilt.frequency.setTargetAtTime(v ? 700 : 2600, t, 0.6);
    rainGain.gain.setTargetAtTime(v ? 0.08 : 0.14, t, 0.6);
  },
  hum(on) { if (ctx) humGain.gain.setTargetAtTime(on ? 0.025 : 0, ctx.currentTime, 0.2); },
  profile: 'click',
  key(code, down) {
    const P = A.profile;
    if (P === 'thock') { const r = 0.9 + Math.random() * 0.2, big = /Space|Enter|Shift|Backspace/.test(code);
      if (down) { tone({ f: (big ? 110 : 170) * r, f2: 55, dur: 0.06, vol: 0.5 }); burst({ f: (big ? 700 : 1100) * r, q: 1.5, dur: 0.03, vol: 0.45 }); }
      else burst({ f: 1600 * r, q: 2, dur: 0.012, vol: 0.12 }); return; }
    if (P === 'type') { const r = 0.9 + Math.random() * 0.2;
      if (down) { burst({ f: 2600 * r, q: 5, dur: 0.03, vol: 0.6 }); tone({ type: 'square', f: 90 * r, f2: 40, dur: 0.05, vol: 0.2 }); burst({ f: 5200, q: 12, t: 0.02, dur: 0.05, vol: 0.2 }); if (code === 'Enter') { tone({ type: 'sine', f: 2637, dur: 0.9, vol: 0.18, t: 0.05 }); tone({ type: 'sine', f: 5274, dur: 0.5, vol: 0.05, t: 0.05 }); } }
      else burst({ f: 1800, q: 3, dur: 0.02, vol: 0.15 }); return; }
    if (P === 'soft') { if (down) { burst({ f: 1400, q: 1, dur: 0.018, vol: 0.2 }); tone({ f: 200, f2: 90, dur: 0.03, vol: 0.12 }); } return; }
    if (P === 'blue' && down) burst({ f: 6500, q: 6, dur: 0.008, vol: 0.45 });
    const big = /Space|Enter|Shift|Backspace|Tab|Caps/.test(code), r = 0.85 + Math.random() * 0.3;
    if (down) {
      burst({ f: (big ? 1700 : 3300) * r, q: 1.4, dur: big ? 0.045 : 0.022, vol: big ? 0.55 : 0.5 });
      burst({ f: 7000 * r, q: 0.7, type: 'highpass', dur: 0.01, vol: 0.3 });
      tone({ f: (big ? 150 : 240) * r, f2: 70, dur: big ? 0.07 : 0.035, vol: big ? 0.45 : 0.28 });
      if (code === 'Space') burst({ f: 850, q: 8, t: 0.012, dur: 0.07, vol: 0.18 });
    } else {
      burst({ f: 4400 * r, q: 2, dur: 0.014, vol: 0.18 });
      tone({ f: 320 * r, f2: 140, dur: 0.025, vol: 0.1 });
    }
  },
  step(outdoor) {
    burst({ f: 260, type: 'lowpass', dur: 0.09, vol: 0.5 });
    if (outdoor) burst({ f: 2500, q: 0.8, t: 0.01, dur: 0.12, vol: 0.18 });
    else tone({ f: 90, f2: 60, dur: 0.06, vol: 0.2 });
  },
  creak() {
    if (!ctx) return; const now = ctx.currentTime, o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'sawtooth'; f.type = 'bandpass'; f.Q.value = 12; f.frequency.value = 1100;
    for (let i = 0; i < 14; i++) o.frequency.setValueAtTime(70 + Math.random() * 60 + i * 4, now + i * 0.1);
    env(g, now, 0.1, 0.5, 1.5); o.connect(f).connect(g).connect(master); o.start(now); o.stop(now + 1.7);
  },
  click() { burst({ f: 3000, q: 3, dur: 0.02, vol: 0.4 }); tone({ f: 500, f2: 200, dur: 0.02, vol: 0.2 }); },
  switchOn() { burst({ f: 2000, q: 2, dur: 0.03, vol: 0.6 }); tone({ f: 120, f2: 60, dur: 0.05, vol: 0.4 }); },
  thunder(dist = 1) {
    burst({ f: 3000, f2: 200, type: 'lowpass', dur: 0.4, vol: 0.5 / dist, attack: 0.01 });
    burst({ f: 180, type: 'lowpass', t: 0.05, dur: 3.5, vol: 1.1 / dist, attack: 0.3 });
    burst({ f: 90, type: 'lowpass', t: 0.6, dur: 2.5, vol: 0.9 / dist, attack: 0.2 });
  },
  crtOn() {
    tone({ f: 80, f2: 40, dur: 0.25, vol: 0.6 });
    burst({ f: 5000, q: 0.5, dur: 0.6, vol: 0.25, attack: 0.02 });
    tone({ f: 15600, dur: 1.2, vol: 0.04, attack: 0.05 });
  },
  crtOff() { tone({ f: 120, f2: 30, dur: 0.3, vol: 0.4 }); burst({ f: 6000, q: 0.5, dur: 0.15, vol: 0.2 }); },
  beep(f = 880, dur = 0.08, vol = 0.12, type = 'square', t = 0) { tone({ type, f, dur, vol, t }); },
  modem() {
    let t = 0;
    tone({ f: 350, dur: 1, vol: 0.1, t }); tone({ f: 440, dur: 1, vol: 0.1, t }); t += 1.1;
    const dtmf = { 5: [770, 1336], 0: [941, 1336], 1: [697, 1209], 9: [852, 1477] };
    for (const d of '5550199') { const [a, b] = dtmf[d]; tone({ f: a, dur: 0.09, vol: 0.12, t }); tone({ f: b, dur: 0.09, vol: 0.12, t }); t += 0.14; }
    t += 0.3;
    tone({ f: 2100, dur: 1.2, vol: 0.1, t }); t += 1.3;
    for (let i = 0; i < 10; i++) { tone({ type: 'square', f: i % 2 ? 1200 : 2400, dur: 0.08, vol: 0.05, t }); t += 0.1; }
    burst({ f: 1800, q: 0.6, dur: 1.2, vol: 0.18, t }); tone({ f: 980, f2: 1650, dur: 1.2, vol: 0.06, t });
    t += 1.3; burst({ f: 3000, q: 0.4, dur: 1.4, vol: 0.2, t, attack: 0.1 });
    return t + 1.4;
  },
  ding() { tone({ type: 'triangle', f: 1320, dur: 0.12, vol: 0.2 }); tone({ type: 'triangle', f: 1760, t: 0.1, dur: 0.25, vol: 0.2 }); },
  shoot() { burst({ f: 1400, f2: 120, type: 'lowpass', dur: 0.35, vol: 0.9 }); tone({ type: 'square', f: 90, f2: 40, dur: 0.15, vol: 0.3 }); },
  rifle() { burst({ f: 3000, f2: 250, type: 'lowpass', dur: 0.13, vol: 0.7 }); tone({ type: 'square', f: 140, f2: 50, dur: 0.05, vol: 0.2 }); },
  hurt() { tone({ type: 'sawtooth', f: 300, f2: 120, dur: 0.2, vol: 0.25 }); },
  pickup() { tone({ type: 'square', f: 660, dur: 0.05, vol: 0.1 }); tone({ type: 'square', f: 990, t: 0.06, dur: 0.08, vol: 0.1 }); },
  growl() { tone({ type: 'sawtooth', f: 110, f2: 60, dur: 0.5, vol: 0.2 }); burst({ f: 400, q: 2, dur: 0.4, vol: 0.2 }); },
  fireball() { burst({ f: 800, f2: 300, q: 1, dur: 0.4, vol: 0.25 }); },
  boom(v = 0.6) { burst({ f: 600, f2: 60, type: 'lowpass', dur: 0.6, vol: v }); },
  pop() {
    const d = 1 + Math.random() * 0.5;
    burst({ f: 900, f2: 80, type: 'lowpass', dur: 0.8, vol: 0.5 / d });
    for (let i = 0; i < 8; i++) burst({ f: 5000, q: 2, t: 0.3 + Math.random() * 0.8, dur: 0.02, vol: 0.12 / d });
  },
  // tiny sequencer: notes "C4 E4 - G4" ('-' = rest); returns stop()
  tune(seq, bpm = 140, { type = 'square', vol = 0.06, bass = null } = {}) {
    if (!ctx) return () => {};
    const notes = seq.trim().split(/\s+/), bn = bass ? bass.trim().split(/\s+/) : null, step = 60 / bpm / 2;
    let i = 0, next = ctx.currentTime + 0.05, alive = true;
    const iv = setInterval(() => {
      while (alive && next < ctx.currentTime + 0.2) {
        const t = next - ctx.currentTime, n = notes[i % notes.length];
        if (n !== '-') tone({ type, f: freq(n), dur: step * 0.8, vol, t });
        if (bn) { const b = bn[i % bn.length]; if (b !== '-') tone({ type: 'triangle', f: freq(b), dur: step * 0.9, vol: vol * 1.6, t }); }
        if (i % 4 === 0) burst({ f: 120, type: 'lowpass', dur: 0.08, vol: vol * 3, t });
        if (i % 4 === 2) burst({ f: 6000, type: 'highpass', dur: 0.03, vol: vol * 1.2, t });
        i++; next += step;
      }
    }, 50);
    return () => { alive = false; clearInterval(iv); };
  },
  speak(text, rate = 1.05) {
    try { const u = new SpeechSynthesisUtterance(text); u.rate = rate; u.pitch = 0.9; speechSynthesis.speak(u); } catch (e) {}
  },
  hush() { try { speechSynthesis.cancel(); } catch (e) {} },
};

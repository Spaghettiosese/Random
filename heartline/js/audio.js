/* HEARTLINE AGENCY — procedural WebAudio music + sfx. No audio files. */
const Sound = (() => {
  let ctx, master, mBus, sBus, rev, noiseBuf, cur = null, timer = null;
  const vol = { music: .55, sfx: .7, voice: true };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = .9;
    const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
    mBus = ctx.createGain(); sBus = ctx.createGain(); mBus.gain.value = vol.music; sBus.gain.value = vol.sfx;
    mBus.connect(master); sBus.connect(master);
    rev = ctx.createConvolver(); const len = ctx.sampleRate * 2.4, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    rev.buffer = b; const rg = ctx.createGain(); rg.gain.value = .32; rev.connect(rg); rg.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }
  function setVol(k, v) { vol[k] = v; if (!ctx) return; if (k === 'music') mBus.gain.value = v; if (k === 'sfx') sBus.gain.value = v; }

  // --- instruments ---
  function tone(t, f, dur, { type = 'sine', g = .2, a = .01, r = .2, dest, cut, det = 0, wet = 0, f2 } = {}) {
    const o = ctx.createOscillator(), e = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = det;
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    let n = o; if (cut) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = cut; o.connect(fl); n = fl; }
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + a); e.gain.setValueAtTime(g, t + Math.max(a, dur - r)); e.gain.exponentialRampToValueAtTime(.0001, t + dur + r);
    n.connect(e); e.connect(dest || sBus); if (wet) { const w = ctx.createGain(); w.gain.value = wet; e.connect(w); w.connect(rev); }
    o.start(t); o.stop(t + dur + r + .05); return e;
  }
  function noise(t, dur, { g = .2, type = 'highpass', f = 5000, q = 1, dest, a = .002, f2 } = {}) {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), e = ctx.createGain(); s.buffer = noiseBuf; s.loop = true;
    fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q; if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + a); e.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(fl); fl.connect(e); e.connect(dest || sBus); s.start(t); s.stop(t + dur + .05);
  }

  // --- music tracks ---
  const Q = { maj: [0, 4, 7, 11], min: [0, 3, 7, 10], dom: [0, 4, 7, 10], sus: [0, 5, 7, 12], dim: [0, 3, 6, 9] };
  const TR = {
    title: { bpm: 80, root: 62, prog: [[0, 'maj'], [9, 'min'], [5, 'maj'], [7, 'sus']], pad: 1, arp: 'up8', drums: 'none', mel: 'bell', seed: 3 },
    daily: { bpm: 112, root: 65, prog: [[0, 'maj'], [7, 'maj'], [9, 'min'], [5, 'maj']], pad: 1, arp: 'pop', drums: 'pop', mel: 'pluck', bass: 'oct', seed: 7 },
    hq: { bpm: 100, root: 60, prog: [[0, 'maj'], [5, 'maj'], [2, 'min'], [7, 'dom']], pad: 1, arp: 'up16', drums: 'soft', mel: 'square', bass: 'pulse', seed: 11 },
    night: { bpm: 76, root: 57, prog: [[5, 'maj'], [4, 'min'], [2, 'min'], [0, 'maj']], pad: 1, arp: 'lofi', drums: 'lofi', mel: 'keys', bass: 'root', seed: 5 },
    tension: { bpm: 132, root: 52, prog: [[0, 'min'], [0, 'min'], [8, 'maj'], [7, 'dom']], pad: 1, arp: 'up16', drums: 'drive', mel: null, bass: 'eighth', seed: 2 },
    action: { bpm: 150, root: 57, prog: [[0, 'min'], [8, 'maj'], [3, 'maj'], [10, 'maj']], pad: 1, arp: 'up16', drums: 'drive', mel: 'saw', bass: 'eighth', seed: 13 },
    romance: { bpm: 72, root: 64, prog: [[0, 'maj'], [4, 'min'], [9, 'min'], [5, 'maj'], [2, 'min'], [7, 'sus']], pad: 1, arp: 'up8', drums: 'none', mel: 'keys', bass: 'root', seed: 17 },
    mystery: { bpm: 90, root: 50, prog: [[0, 'min'], [1, 'maj'], [0, 'min'], [6, 'dim']], pad: 1, arp: 'up8', drums: 'soft', mel: 'bell', seed: 23 },
    sad: { bpm: 66, root: 57, prog: [[0, 'min'], [5, 'min'], [10, 'maj'], [3, 'maj']], pad: 1, arp: 'up8', drums: 'none', mel: 'keys', seed: 29 },
    victory: { bpm: 120, root: 67, prog: [[0, 'maj'], [5, 'maj'], [7, 'maj'], [0, 'maj']], pad: 1, arp: 'pop', drums: 'pop', mel: 'square', bass: 'oct', seed: 31 },
    idol: { bpm: 128, root: 64, prog: [[0, 'maj'], [7, 'maj'], [9, 'min'], [5, 'maj']], pad: 1, arp: 'pop', drums: 'drive', mel: 'saw', bass: 'oct', seed: 41 },
    date: { bpm: 96, root: 65, prog: [[0, 'maj'], [9, 'min'], [2, 'min'], [7, 'dom']], pad: 1, arp: 'lofi', drums: 'lofi', mel: 'pluck', bass: 'root', seed: 43 },
    festival: { bpm: 104, root: 62, prog: [[0, 'maj'], [5, 'maj'], [9, 'min'], [7, 'sus']], pad: 1, arp: 'pop', drums: 'pop', mel: 'bell', bass: 'oct', seed: 47, penta: 1 },
    snow: { bpm: 70, root: 69, prog: [[0, 'min'], [8, 'maj'], [3, 'maj'], [10, 'maj']], pad: 1, arp: 'up8', drums: 'none', mel: 'bell', bass: 'root', seed: 53 },
    boss: { bpm: 164, root: 50, prog: [[0, 'min'], [1, 'maj'], [0, 'min'], [10, 'maj'], [8, 'maj'], [7, 'dom']], pad: 1, arp: 'up16', drums: 'drive', mel: 'saw', bass: 'eighth', seed: 59 },
    board: { bpm: 84, root: 48, prog: [[0, 'min'], [6, 'dim'], [5, 'min'], [7, 'dom']], pad: 1, arp: 'up8', drums: 'soft', mel: 'keys', bass: 'pulse', seed: 61 },
    finale: { bpm: 140, root: 62, prog: [[0, 'maj'], [9, 'min'], [5, 'maj'], [7, 'maj'], [0, 'maj'], [4, 'min'], [5, 'maj'], [7, 'sus']], pad: 1, arp: 'up16', drums: 'drive', mel: 'saw', bass: 'oct', seed: 67 }
  };
  function genMelody(tr) {
    let s = tr.seed * 9301 + 49297; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const scale = tr.penta ? [0, 2, 4, 7, 9, 12, 14] : tr.prog.some(p => p[1] === 'min') && tr.prog[0][1] === 'min' ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
    const bars = tr.prog.length, notes = []; let last = 7;
    const phrase = [];
    for (let b = 0; b < bars; b++) {
      const [cr, q] = tr.prog[b], ct = Q[q].map(x => (x + cr) % 12);
      for (let st = 0; st < 16; st += 2) {
        if (r() < (st % 8 === 0 ? .85 : .5)) {
          let cand = []; for (let o = 0; o < 14; o++) { const deg = scale[o % 7] + 12 * Math.floor(o / 7); const strong = st % 4 === 0; if (!strong || ct.includes(deg % 12)) cand.push(o); }
          cand.sort((a, b2) => Math.abs(a - last) - Math.abs(b2 - last)); const o = cand[Math.min(cand.length - 1, (r() * 3) | 0)]; last = o;
          phrase.push({ st: b * 16 + st, m: scale[o % 7] + 12 * Math.floor(o / 7), len: r() < .3 ? 4 : 2 });
        }
      }
    }
    // A phrase then variation (repeat with last bar re-rolled up an octave on some notes)
    phrase.forEach(n => notes.push(n));
    phrase.forEach(n => notes.push({ st: n.st + bars * 16, m: n.st >= (bars - 1) * 16 && r() < .5 ? n.m + (r() < .5 ? 2 : -1) : n.m, len: n.len }));
    return notes;
  }
  function play(name) {
    init();
    if (cur && cur.name === name) return;
    stop(1.2);
    if (!name || !TR[name]) return;
    const tr = TR[name], g = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5); g.connect(mBus);
    const mel = tr.mel ? genMelody(tr) : [];
    const me = { name, tr, g, step: 0, next: ctx.currentTime + .1, t0: ctx.currentTime + .1, mel, loop: tr.prog.length * 32 };
    cur = me;
    timer = setInterval(() => sched(me), 25);
    me.timer = timer;
  }
  function stop(fade = .8) {
    if (!cur) return; const c = cur; cur = null; clearInterval(c.timer);
    try { c.g.gain.cancelScheduledValues(ctx.currentTime); c.g.gain.setValueAtTime(c.g.gain.value, ctx.currentTime); c.g.gain.linearRampToValueAtTime(0, ctx.currentTime + fade); } catch (e) { }
    setTimeout(() => c.g.disconnect(), fade * 1000 + 200);
  }
  function sched(me) {
    const tr = me.tr, spb = 60 / tr.bpm / 4;
    while (me.next < ctx.currentTime + .12) {
      const st = me.step, t = me.next, bar = Math.floor(st / 16) % tr.prog.length, s16 = st % 16;
      const [cr, q] = tr.prog[bar], ch = Q[q].map(x => tr.root + cr + x), d = me.g;
      if (tr.pad && s16 === 0) ch.forEach((m, i) => { tone(t, mtof(m), spb * 15, { type: 'sawtooth', g: .028, a: .5, r: .6, dest: d, cut: 1100, det: i % 2 ? 8 : -8, wet: .5 }); });
      // arps
      const A = tr.arp;
      if (A === 'up8' && s16 % 2 === 0) { const m = ch[(s16 / 2) % 4] + 12; tone(t, mtof(m), spb * 1.6, { type: 'triangle', g: .05, r: .3, dest: d, wet: .4 }); }
      if (A === 'up16') { const m = ch[s16 % 4] + (s16 >= 8 ? 24 : 12); tone(t, mtof(m), spb * .8, { type: 'square', g: .018, r: .08, dest: d, cut: 2400 }); }
      if (A === 'pop' && [0, 3, 6, 8, 10, 12, 14].includes(s16)) { const m = ch[[0, 2, 1, 3, 2, 1, 0][[0, 3, 6, 8, 10, 12, 14].indexOf(s16)]] + 12; tone(t, mtof(m), spb * 1.2, { type: 'triangle', g: .05, r: .12, dest: d, wet: .2 }); }
      if (A === 'lofi' && [0, 3, 6, 10].includes(s16)) ch.slice(0, 3).forEach(m => tone(t + Math.random() * .02, mtof(m + 12), spb * 2.5, { type: 'triangle', g: .03, r: .4, dest: d, cut: 1500, wet: .3 }));
      // bass
      const bm = tr.root + cr - 12;
      if (tr.bass === 'root' && s16 === 0) tone(t, mtof(bm), spb * 14, { type: 'sine', g: .16, r: .3, dest: d });
      if (tr.bass === 'oct' && s16 % 4 === 0) tone(t, mtof(bm + (s16 % 8 ? 12 : 0)), spb * 3, { type: 'triangle', g: .14, r: .1, dest: d });
      if (tr.bass === 'pulse' && s16 % 4 === 2) tone(t, mtof(bm), spb * 2, { type: 'sine', g: .16, r: .1, dest: d });
      if (tr.bass === 'eighth' && s16 % 2 === 0) tone(t, mtof(bm), spb * 1.5, { type: 'sawtooth', g: .07, r: .05, dest: d, cut: 500 });
      // drums
      const D = tr.drums;
      if (D !== 'none') {
        const kick = D === 'drive' ? s16 % 4 === 0 : D === 'lofi' ? [0, 7, 10].includes(s16) : [0, 8].includes(s16) || (D === 'pop' && s16 === 11);
        if (kick) tone(t, 140, .18, { type: 'sine', g: D === 'soft' ? .25 : .45, a: .002, r: .12, dest: d, f2: 40 });
        if ((D === 'pop' || D === 'drive' || D === 'lofi') && (s16 === 4 || s16 === 12)) noise(t, .16, { g: D === 'lofi' ? .07 : .13, type: 'bandpass', f: 1800, q: .8, dest: d });
        if (s16 % 2 === 0 && D !== 'soft') noise(t, .04, { g: D === 'lofi' ? .025 : .04, f: 8000, dest: d });
        if (D === 'soft' && s16 % 4 === 2) noise(t, .05, { g: .03, f: 9000, dest: d });
        if (D === 'drive' && s16 % 2 === 1) noise(t, .03, { g: .02, f: 10000, dest: d });
      }
      // melody
      const ms = st % me.loop;
      me.mel.forEach(n => {
        if (n.st === ms) {
          const f = mtof(tr.root + 12 + n.m), dur = spb * n.len * .95;
          if (tr.mel === 'bell') { tone(t, f, dur, { type: 'sine', g: .07, r: .6, dest: d, wet: .6 }); tone(t, f * 2.01, dur * .5, { type: 'sine', g: .02, r: .4, dest: d, wet: .6 }); }
          else if (tr.mel === 'keys') { tone(t, f, dur, { type: 'triangle', g: .07, r: .4, dest: d, wet: .5 }); tone(t, f * 2, dur * .6, { type: 'sine', g: .02, r: .3, dest: d }); }
          else if (tr.mel === 'pluck') tone(t, f, dur, { type: 'square', g: .035, r: .15, dest: d, cut: 3000, wet: .3 });
          else if (tr.mel === 'square') tone(t, f, dur, { type: 'square', g: .03, r: .1, dest: d, cut: 2600, wet: .2 });
          else if (tr.mel === 'saw') { tone(t, f, dur, { type: 'sawtooth', g: .03, r: .1, dest: d, cut: 3200, det: 6, wet: .3 }); tone(t, f, dur, { type: 'sawtooth', g: .03, r: .1, dest: d, cut: 3200, det: -6 }); }
        }
      });
      me.step++; me.next += spb;
    }
  }

  // --- sfx ---
  const SFX = {
    click: t => tone(t, 1200, .03, { type: 'square', g: .05, r: .03, cut: 4000 }),
    hover: t => tone(t, 1800, .02, { type: 'sine', g: .03, r: .03 }),
    confirm: t => { tone(t, 880, .06, { type: 'triangle', g: .12 }); tone(t + .06, 1320, .1, { type: 'triangle', g: .12, wet: .3 }); },
    cancel: t => { tone(t, 600, .06, { type: 'triangle', g: .1 }); tone(t + .06, 400, .1, { type: 'triangle', g: .1 }); },
    whoosh: t => noise(t, .4, { g: .25, type: 'bandpass', f: 400, f2: 3000, q: 2, a: .15 }),
    zap: t => { for (let i = 0; i < 6; i++) tone(t + i * .025, 300 + Math.random() * 2000, .05, { type: 'sawtooth', g: .08, r: .02 }); noise(t, .3, { g: .2, f: 3000 }); },
    thunder: t => { noise(t, .15, { g: .6, f: 2000 }); noise(t + .05, 2.2, { g: .7, type: 'lowpass', f: 900, f2: 60, a: .02 }); tone(t, 90, 1.5, { type: 'sine', g: .5, f2: 30 }); },
    boom: t => { noise(t, 1.2, { g: .6, type: 'lowpass', f: 600, f2: 50 }); tone(t, 120, .8, { type: 'sine', g: .6, f2: 30 }); },
    rumble: t => noise(t, 1.5, { g: .4, type: 'lowpass', f: 120, a: .4 }),
    glass: t => { noise(t, .5, { g: .4, f: 4000 }); for (let i = 0; i < 12; i++) tone(t + Math.random() * .4, 2000 + Math.random() * 4000, .08, { type: 'sine', g: .06, r: .2, wet: .5 }); },
    shatter: t => { noise(t, .9, { g: .5, f: 3000 }); for (let i = 0; i < 24; i++) tone(t + Math.random() * .9, 2500 + Math.random() * 5000, .06, { type: 'sine', g: .05, r: .3, wet: .7 }); },
    roar: t => { tone(t, 80, 1.4, { type: 'sawtooth', g: .25, a: .2, cut: 600, f2: 50 }); tone(t, 83, 1.4, { type: 'sawtooth', g: .2, a: .2, cut: 500, f2: 45 }); noise(t, 1.4, { g: .25, type: 'bandpass', f: 500, f2: 200, a: .3 }); },
    shadow: t => { tone(t, 200, .9, { type: 'sine', g: .3, a: .3, f2: 50, wet: .8 }); noise(t, .9, { g: .15, type: 'lowpass', f: 800, f2: 100, a: .3 }); },
    chime: t => [0, 4, 7, 12].forEach((m, i) => tone(t + i * .07, mtof(84 + m), .3, { type: 'sine', g: .1, r: .5, wet: .6 })),
    heart: t => { tone(t, mtof(76), .12, { type: 'sine', g: .15, wet: .5 }); tone(t + .1, mtof(83), .25, { type: 'sine', g: .15, r: .4, wet: .6 }); },
    heartdown: t => { tone(t, mtof(72), .12, { type: 'triangle', g: .12 }); tone(t + .12, mtof(67), .25, { type: 'triangle', g: .12, r: .3 }); },
    levelup: t => [0, 4, 7, 12, 16].forEach((m, i) => tone(t + i * .06, mtof(72 + m), .12, { type: 'square', g: .05, cut: 3000, wet: .3 })),
    success: t => { [0, 4, 7].forEach((m, i) => tone(t + i * .1, mtof(72 + m), .15, { type: 'square', g: .06, cut: 3000 })); [0, 4, 7, 12].forEach(m => tone(t + .35, mtof(72 + m), .6, { type: 'triangle', g: .07, r: .6, wet: .5 })); },
    fail: t => [0, -1, -2, -6].forEach((m, i) => tone(t + i * .18, mtof(67 + m), .2, { type: 'square', g: .05, cut: 1500 })),
    perfect: t => { tone(t, mtof(88), .08, { type: 'square', g: .06, cut: 5000 }); tone(t + .08, mtof(95), .2, { type: 'sine', g: .1, r: .3, wet: .6 }); },
    miss: t => tone(t, 180, .15, { type: 'sawtooth', g: .08, cut: 800, f2: 90 }),
    punch: t => { tone(t, 160, .1, { type: 'sine', g: .5, f2: 50 }); noise(t, .1, { g: .3, type: 'lowpass', f: 2000 }); },
    beep: t => { tone(t, 1400, .05, { type: 'square', g: .05, cut: 3000 }); tone(t + .08, 1900, .06, { type: 'square', g: .05, cut: 3000 }); },
    phone: t => { for (let i = 0; i < 3; i++) tone(t + i * .14, 180, .09, { type: 'square', g: .06, cut: 500 }); tone(t + .5, mtof(88), .1, { type: 'sine', g: .07 }); },
    msg: t => tone(t, mtof(86), .07, { type: 'sine', g: .08, r: .15, wet: .3 }),
    car: t => { noise(t, 1.6, { g: .2, type: 'lowpass', f: 300, f2: 120, a: .6 }); tone(t, 55, 1.6, { type: 'sawtooth', g: .05, a: .6, cut: 200 }); },
    door: t => { noise(t, .15, { g: .2, type: 'lowpass', f: 900 }); tone(t, 110, .15, { type: 'sine', g: .3 }); },
    alarm: t => { for (let i = 0; i < 4; i++) { tone(t + i * .25, 1760, .1, { type: 'square', g: .04, cut: 3000 }); tone(t + i * .25 + .12, 1760, .1, { type: 'square', g: .04, cut: 3000 }); } },
    siren: t => tone(t, 700, 1.6, { type: 'sawtooth', g: .05, cut: 1800, a: .1, f2: 1200 }),
    page: t => noise(t, .25, { g: .15, type: 'bandpass', f: 3000, f2: 1200, q: .7, a: .05 }),
    type: t => noise(t, .02, { g: .08, type: 'bandpass', f: 3500, q: 2 }),
    heal: t => [0, 7, 12, 19, 24].forEach((m, i) => tone(t + i * .09, mtof(79 + m), .4, { type: 'sine', g: .06, r: .6, wet: .8 })),
    coin: t => { tone(t, mtof(95), .05, { type: 'square', g: .05, cut: 5000 }); tone(t + .05, mtof(100), .2, { type: 'square', g: .05, cut: 5000, r: .2 }); },
    swoosh: t => noise(t, .25, { g: .12, type: 'bandpass', f: 1500, f2: 5000, q: 1.5, a: .08 }),
    heartbeat: t => { tone(t, 60, .12, { type: 'sine', g: .5 }); tone(t + .22, 55, .15, { type: 'sine', g: .4 }); },
    snore: t => noise(t, 1, { g: .08, type: 'bandpass', f: 300, q: 3, a: .5 }),
    shutter: t => { noise(t, .04, { g: .35, type: 'highpass', f: 3000 }); tone(t, 2400, .02, { type: 'square', g: .05 }); noise(t + .09, .05, { g: .25, type: 'bandpass', f: 1800 }); },
    hit: t => tone(t, 1600, .04, { type: 'triangle', g: .08, r: .05 })
  };
  function sfx(n) { init(); if (SFX[n]) SFX[n](ctx.currentTime + .005); }
  function blip(pitch) { if (!vol.voice) return; init(); const t = ctx.currentTime; tone(t, pitch * (0.92 + Math.random() * .16), .035, { type: 'square', g: .025, r: .02, cut: 2500 }); }

  // rhythm-game hooks: the live clock of the current track, a chart for any track, and a melodic hit sound
  function sync(name) { if (!ctx || !cur || cur.name !== name || ctx.state !== 'running') return null; return { now: () => ctx.currentTime, t0: cur.t0, spb: 60 / cur.tr.bpm / 4, mel: cur.mel, loop: cur.loop, root: cur.tr.root }; }
  function chart(name) { const tr = TR[name]; return tr && { spb: 60 / tr.bpm / 4, mel: tr.mel ? genMelody(tr) : [], loop: tr.prog.length * 32, root: tr.root }; }
  function note(m, dur = .2, type = 'triangle') { init(); tone(ctx.currentTime + .005, mtof(m), dur, { type, g: .07, r: .2, wet: .4 }); }

  return { init, play, stop, sfx, blip, setVol, vol, sync, chart, note, get current() { return cur && cur.name; } };
})();

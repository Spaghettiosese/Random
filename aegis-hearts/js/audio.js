'use strict';
// Music and sound, synthesised with WebAudio. No audio files.
(function () {
  let ac = null, master, musicBus, sfxBus, delay, noiseBuf;
  const vol = { music: .55, sfx: .7 };
  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ac = new AC(); master = ac.createGain(); master.gain.value = .9;
    const comp = ac.createDynamicsCompressor(); master.connect(comp); comp.connect(ac.destination);
    musicBus = ac.createGain(); sfxBus = ac.createGain(); musicBus.gain.value = vol.music * .5; sfxBus.gain.value = vol.sfx;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200; musicBus.connect(lp); lp.connect(master); sfxBus.connect(master);
    delay = ac.createDelay(1); delay.delayTime.value = .28; const fb = ac.createGain(); fb.gain.value = .28; const wet = ac.createGain(); wet.gain.value = .22;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(lp);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    if (pending) { const p = pending; pending = null; play(p); }
  }
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function tone(bus, type, midi, t, dur, g, o = {}) {
    const osc = ac.createOscillator(), env = ac.createGain(); osc.type = type; osc.frequency.setValueAtTime(hz(midi), t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(hz(midi + o.slide), t + dur);
    if (o.vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = 5.5; lg.gain.value = hz(midi) * .008; l.connect(lg); lg.connect(osc.frequency); l.start(t + .12); l.stop(t + dur + .1); }
    const a = o.a || .008; env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(g, t + a); env.gain.setValueAtTime(g * (o.sus || .7), t + Math.max(a, dur * .6)); env.gain.exponentialRampToValueAtTime(.0008, t + dur + (o.r || .08));
    osc.connect(env); env.connect(bus); if (o.echo) env.connect(delay); osc.start(t); osc.stop(t + dur + (o.r || .08) + .05);
  }
  function noise(bus, t, dur, g, f0 = 6000, f1, type = 'highpass') {
    const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; const f = ac.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const env = ac.createGain(); env.gain.setValueAtTime(g, t); env.gain.exponentialRampToValueAtTime(.0008, t + dur); s.connect(f); f.connect(env); env.connect(bus); s.start(t, Math.random()); s.stop(t + dur + .05);
  }

  // ---------------- music ----------------
  // lead: 8 eighth-notes per bar. 1-7 = scale degree, ' = octave up, , = octave down, - = hold, . = rest
  const MAJ = [0, 2, 4, 5, 7, 9, 11], MIN = [0, 2, 3, 5, 7, 8, 10];
  const TRACKS = {
    title: { bpm: 92, root: 60, scale: MAJ, prog: [3, 4, 2, 5, 3, 4, 0, 0], arp: 'up', bass: 'long', drums: 'soft', leadW: 'triangle',
      lead: ["5 - 6 5 3 - - .", "5 - 6 7 2' - - .", "5 - 3 5 7 - 5 -", "6 - - - 3 . 3 5", "6 - 1' 6 5 - 3 -", "2 - 5 7 2' - 1' 7", "1' - - - 5 - 3 -", "1 - - - . . . ."] },
    daily: { bpm: 122, root: 67, scale: MAJ, prog: [0, 4, 5, 3, 0, 4, 3, 4], arp: 'bounce', bass: 'walk', drums: 'pop', leadW: 'square',
      lead: ["3 . 3 5 . 3 2 1", "2 . 2 5 . 7, 2 .", "1 . 1 3 6 . 5 3", "4 . 6 5 4 . 3 2", "3 . 5 1' . 7 5 3", "2 . 5 7 . 5 2 .", "4 6 1' 6 4 . 6 4", "5 - 7 2' 5 - . ."] },
    tender: { bpm: 74, root: 65, scale: MAJ, prog: [0, 2, 3, 4, 5, 3, 1, 4], arp: 'up', bass: 'long', drums: 'none', leadW: 'triangle',
      lead: ["3 - - 5 - - 1' -", "7 - - 5 - 3 - -", "6 - - 1' - 6 - 4", "5 - - - 2 - 4 -", "3 - - 1' - - 6 -", "6 - 4 - 1 - 4 -", "4 - - 6 - 4 2 -", "2 - - - 5 - - ."] },
    tension: { bpm: 104, root: 57, scale: MIN, prog: [0, 0, 5, 6, 0, 0, 3, 4], arp: 'pulse', bass: 'pulse', drums: 'tick', leadW: 'sawtooth',
      lead: ["1 . . . 3 . 2 .", "1 . . . . . 7, .", "6, . . . 1 . 3 .", "2 . . . . . . .", "1 . . 5 . 3 . 2", "1 . . . . 7, 1 2", "4 . . 3 . . 1 .", "5 - - - . . . ."] },
    battle: { bpm: 152, root: 64, scale: MIN, prog: [0, 5, 2, 6, 0, 5, 3, 4], arp: 'bounce', bass: 'drive', drums: 'rock', leadW: 'square',
      lead: ["1' . 1' 7 1' . 5 .", "6 . 6 5 6 . 1' .", "7 . 7 5 3 . 5 7", "2' - 1' 7 5 - . .", "1' . 3' 2' 1' . 5 .", "6 . 1' 6 4 . 6 1'", "4 . 6 1' 4' - 3' 1'", "5' - 4' 2' 7 - 5 -"] },
    night: { bpm: 68, root: 62, scale: MAJ, prog: [0, 5, 3, 4], arp: 'slow', bass: 'long', drums: 'none', leadW: 'sine',
      lead: ["5 - - - 3 - - -", "1' - - - 6 - - -", "6 - - 4 - - 1 -", "2 - - - - - . ."] },
    training: { bpm: 138, root: 60, scale: MAJ, prog: [0, 3, 0, 4, 5, 3, 1, 4], arp: 'bounce', bass: 'drive', drums: 'pop', leadW: 'square',
      lead: ["1 3 5 . 1' . 5 .", "4 6 1' . 6 . 4 .", "3 5 1' . 3' . 1' .", "2 5 7 . 2' - . .", "6 . 1' 3' . 1' 6 .", "4 . 6 1' . 6 4 .", "2 4 6 . 4 6 2' .", "7 - 2' - 5' - . ."] },
    sad: { bpm: 66, root: 57, scale: MIN, prog: [0, 5, 2, 6, 3, 0, 5, 4], arp: 'slow', bass: 'long', drums: 'none', leadW: 'triangle',
      lead: ["5 - - 3 - - 1 -", "6 - - - 3 - - -", "5 - - 7 - - 3 -", "2 - - - - - . .", "4 - - 6 - - 1' -", "5 - - 3 - 1 - -", "6 - 1 - 3 - 6 -", "5 - - - . . . ."] },
  };
  let cur = null, pending = null, timer = null, step = 0, nextT = 0, songGain = null;
  const deg = (tr, d, oct = 0) => tr.root + tr.scale[((d % 7) + 7) % 7] + 12 * (Math.floor(d / 7) + oct);
  function parseLead(bar) { return bar.split(' ').map(tok => { if (tok === '.' || tok === '-') return tok; const d = +tok[0] - 1, up = (tok.match(/'/g) || []).length - (tok.match(/,/g) || []).length; return d + up * 7; }); }
  function schedule() {
    if (!ac || !cur) return;
    const tr = TRACKS[cur], spb = 60 / tr.bpm / 2; // eighth note
    while (nextT < ac.currentTime + .18) {
      const bar = Math.floor(step / 8) % tr.lead.length, s = step % 8, t = nextT, ch = tr.prog[bar % tr.prog.length], G = songGain;
      if (!tr._l) tr._l = tr.lead.map(parseLead);
      // lead
      const n = tr._l[bar][s];
      if (typeof n === 'number') { let len = 1; for (let k = s + 1; k < 8 && tr._l[bar][k] === '-'; k++) len++; tone(G, tr.leadW, deg(tr, n, 1), t, spb * len * .92, tr.leadW === 'square' ? .07 : tr.leadW === 'sawtooth' ? .06 : .16, { vib: len > 2, echo: true, a: .012 }); }
      // chord arpeggio
      const tri = [ch, ch + 2, ch + 4, ch + 7];
      if (tr.arp === 'up') tone(G, 'triangle', deg(tr, tri[s % 4]), t, spb * .9, .07, { echo: true });
      else if (tr.arp === 'bounce') { if (s % 2 === 1) for (const k of [0, 1, 2]) tone(G, 'square', deg(tr, tri[k]), t, spb * .45, .022); }
      else if (tr.arp === 'slow') { if (s % 2 === 0) tone(G, 'triangle', deg(tr, tri[(s / 2) % 4]), t, spb * 2.2, .08, { echo: true, a: .03 }); }
      else if (tr.arp === 'pulse') { if (s % 2 === 0) for (const k of [0, 2]) tone(G, 'square', deg(tr, tri[k]), t, spb * .3, .02); }
      // bass
      if (tr.bass === 'long') { if (s === 0) tone(G, 'triangle', deg(tr, ch, -2), t, spb * 7.5, .2, { a: .02 }); }
      else if (tr.bass === 'walk') { if (s % 2 === 0) tone(G, 'triangle', deg(tr, [ch, ch + 4, ch + 2, ch + 4][s / 2], -2), t, spb * 1.6, .2); }
      else if (tr.bass === 'pulse') tone(G, 'triangle', deg(tr, ch, -2), t, spb * .6, s % 4 === 0 ? .24 : .13);
      else if (tr.bass === 'drive') tone(G, 'triangle', deg(tr, s % 4 === 3 ? ch + 4 : ch, -2), t, spb * .7, .2);
      // drums
      const D = tr.drums;
      if (D === 'pop' || D === 'rock') { if (s === 0 || s === 4 || (D === 'rock' && s === 3)) { tone(G, 'sine', 48, t, .12, .5, { slide: -24 }); } if (s === 2 || s === 6) noise(G, t, .12, .16, 1800, 600, 'bandpass'); noise(G, t, .03, D === 'rock' ? .06 : .04); }
      else if (D === 'soft') { if (s === 0) tone(G, 'sine', 45, t, .14, .3, { slide: -20 }); if (s === 4) noise(G, t, .08, .05, 5000); }
      else if (D === 'tick') { noise(G, t, .02, s % 2 ? .03 : .07, 7000); if (s === 0) tone(G, 'sine', 40, t, .2, .45, { slide: -18 }); }
      nextT += spb; step++;
    }
  }
  function play(name) {
    if (!ac) { pending = name; return; }
    if (cur === name) return;
    stop(.5);
    if (!name || !TRACKS[name]) return;
    cur = name; step = 0; nextT = ac.currentTime + .15; songGain = ac.createGain(); songGain.gain.setValueAtTime(0, ac.currentTime); songGain.gain.linearRampToValueAtTime(1, ac.currentTime + .6); songGain.connect(musicBus);
    timer = setInterval(schedule, 40); schedule();
  }
  function stop(fade = .6) {
    pending = null; if (timer) clearInterval(timer); timer = null; cur = null;
    if (songGain && ac) { const g = songGain; g.gain.cancelScheduledValues(ac.currentTime); g.gain.setValueAtTime(g.gain.value, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + fade); setTimeout(() => g.disconnect(), fade * 1000 + 300); songGain = null; }
  }

  // ---------------- sound effects ----------------
  const SFX = {
    blip: t => tone(sfxBus, 'square', 84, t, .018, .035),
    blipLow: t => tone(sfxBus, 'square', 72, t, .018, .035),
    hover: t => tone(sfxBus, 'triangle', 88, t, .04, .1),
    click: t => { tone(sfxBus, 'square', 76, t, .04, .08); tone(sfxBus, 'square', 88, t + .04, .06, .08); },
    confirm: t => [76, 81, 88].forEach((m, i) => tone(sfxBus, 'triangle', m, t + i * .05, .12, .16, { echo: true })),
    cancel: t => { tone(sfxBus, 'square', 70, t, .06, .07); tone(sfxBus, 'square', 63, t + .06, .1, .07); },
    next: t => tone(sfxBus, 'triangle', 91, t, .05, .09),
    statup: t => [72, 76, 79, 84, 88].forEach((m, i) => tone(sfxBus, 'square', m, t + i * .055, .09, .07)),
    heart: t => { tone(sfxBus, 'triangle', 84, t, .14, .2, { echo: true }); tone(sfxBus, 'triangle', 91, t + .12, .3, .2, { echo: true, vib: true }); },
    chime: t => [88, 93, 96, 100].forEach((m, i) => tone(sfxBus, 'sine', m, t + i * .09, .5, .12, { echo: true })),
    whoosh: t => noise(sfxBus, t, .35, .25, 400, 5000, 'bandpass'),
    impact: t => { noise(sfxBus, t, .3, .5, 900, 80, 'lowpass'); tone(sfxBus, 'sine', 50, t, .3, .7, { slide: -30 }); },
    hit: t => { noise(sfxBus, t, .12, .35, 2400, 500, 'bandpass'); tone(sfxBus, 'square', 55, t, .08, .15, { slide: -12 }); },
    alarm: t => { for (let i = 0; i < 4; i++) { tone(sfxBus, 'sawtooth', 77, t + i * .32, .14, .09); tone(sfxBus, 'sawtooth', 72, t + i * .32 + .16, .14, .09); } },
    rumble: t => { noise(sfxBus, t, 1.6, .5, 160, 60, 'lowpass'); tone(sfxBus, 'sine', 36, t, 1.5, .5, { slide: -8 }); },
    fire: t => { noise(sfxBus, t, .5, .35, 500, 3000, 'bandpass'); tone(sfxBus, 'sawtooth', 52, t, .4, .12, { slide: 14 }); },
    ice: t => { [96, 103, 100, 108].forEach((m, i) => tone(sfxBus, 'sine', m, t + i * .04, .25, .1, { echo: true })); noise(sfxBus, t, .15, .12, 8000); },
    shadow: t => { tone(sfxBus, 'sine', 64, t, .4, .25, { slide: -24 }); tone(sfxBus, 'triangle', 76, t + .05, .35, .12, { slide: -19 }); },
    scan: t => { tone(sfxBus, 'sine', 72, t, .5, .12, { slide: 24 }); },
    lock: t => { tone(sfxBus, 'square', 96, t, .05, .1); tone(sfxBus, 'square', 96, t + .1, .05, .1); tone(sfxBus, 'square', 103, t + .2, .3, .1, { echo: true }); },
    fanfare: t => [[72, 0], [72, .12], [72, .24], [76, .36], [79, .6], [76, .78], [79, .9], [84, 1.05]].forEach(([m, d], i) => { tone(sfxBus, 'square', m, t + d, i === 7 ? .7 : .11, .09, { echo: true }); tone(sfxBus, 'triangle', m - 12, t + d, i === 7 ? .7 : .11, .14); }),
    fail: t => [67, 66, 65, 60].forEach((m, i) => tone(sfxBus, 'triangle', m, t + i * .18, i === 3 ? .6 : .16, .16)),
    coin: t => { tone(sfxBus, 'square', 95, t, .05, .08); tone(sfxBus, 'square', 100, t + .05, .2, .08); },
    day: t => [60, 67, 72, 76, 79].forEach((m, i) => tone(sfxBus, 'triangle', m, t + i * .08, .5, .12, { echo: true })),
    save: t => { tone(sfxBus, 'triangle', 79, t, .08, .14); tone(sfxBus, 'triangle', 86, t + .08, .2, .14, { echo: true }); },
    step: t => noise(sfxBus, t, .05, .1, 900, 300, 'bandpass'),
    sparkle: t => [100, 105, 108].forEach((m, i) => tone(sfxBus, 'sine', m, t + i * .05, .2, .07, { echo: true })),
  };
  let lastBlip = 0;
  function sfx(name) {
    if (!ac || !SFX[name]) return;
    if (name.startsWith('blip')) { if (ac.currentTime - lastBlip < .045) return; lastBlip = ac.currentTime; }
    SFX[name](ac.currentTime + .005);
  }
  function setVol(kind, v) { vol[kind] = v; if (!ac) return; if (kind === 'music') musicBus.gain.value = v * .5; else sfxBus.gain.value = v; }
  window.AHAudio = { init, play, stop, sfx, setVol, vol, get current() { return cur || pending; }, TRACKS };
})();

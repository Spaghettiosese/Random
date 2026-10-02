/* HEARTLINE AGENCY — faces.
   Every character has their own face on top of the shared anime rig (pxchars.js): eye shape, tilt, lashes, pupils and
   highlights; brow habits; where the mouth sits and what it does; head silhouette; cheeks and little marks; and a
   private map of how each emotion is actually worn. Rei's "laugh" is a held breath and a flush. Kaede's "smile" has a
   fang in it. Sora has a stage face and a real one. Two characters never pull the same expression. */
(() => {
  const { CAST, star, star4 } = PixelCast;
  const F = (id, spec) => { CAST[id].face = spec; };
  const hexD = (cx, cy, r) => { let d = ''; for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3 + Math.PI / 6; d += (k ? 'L' : 'M') + (cx + Math.cos(an) * r).toFixed(1) + ',' + (cy + Math.sin(an) * r).toFixed(1); } return d + 'Z'; };

  // Hikari: round, open, undefended. Mouth is always a little ajar because she is about to say something.
  F('hikari', {
    head: 'round', nose: 'button', cheek: 'stripe', bl: 1.35,
    eye: { w: 1.06, h: 1.1, ir: [1.1, 1.06], hl: 'twin', lash: 'doll', lw: .95, gap: -1 },
    brow: { shape: 'arch', th: 1.4, len: 1.05 }, mouth: { s: 1.12 },
    map: { m: { small: 'smallopen', tiny: 'smallopen', smile: 'grin', cat: 'grin' } },
    emo: {
      neutral: { e: 'open', b: 'raised', m: 'smallopen' },
      happy: { e: 'happy', m: 'grinwide', fx: ['sparkle', 'blushlite'], bob: 2 }, laugh: { e: 'happy', m: 'grinwide', tilt: -7, bob: 2 },
      sad: { e: 'sad', b: 'sad', m: 'wavy', droop: 4 }, nervous: { e: 'wide', b: 'worried', m: 'bite', fx: ['sweat'] },
      tired: { e: 'sleepy', b: 'sad', m: 'smallopen', droop: 4 }, determined: { e: 'determined', b: 'angry', m: 'grin', lean: 2 },
      proud: { e: 'star', b: 'raised', m: 'grinwide', fx: ['sparkle'] }, resolve: { e: 'determined', b: 'angry', m: 'grin', lean: 2 },
      lost: { e: 'wide', b: 'sad', m: 'smallopen', look: -4 }, hurt: { e: 'sad', b: 'sad', m: 'wavy', look: -3, droop: 4 }
    },
    marks(g, c) { g.save(); g.rot(-22, 238, 186); g.fill('M229,182 L247,182 L247,190 L229,190Z', '#f8dcae', 1.4); g.line('M235,182 L235,190 M241,182 L241,190', '#d9b078', 1.1); g.restore(); }
  });

  // Rei: narrow, low, very still. The whole face works at one tenth the volume of everyone else's.
  F('rei', {
    head: 'pointed', nose: 'none', cheek: 'soft', bl: .45, noFx: ['sparkle', 'heart'],
    eye: { w: 1.08, h: .8, rot: -7, ir: [.88, .95], pupil: 'ring', hl: 'one', lash: 'sharp', lw: 1.15, lid: .35, gap: 1 },
    brow: { shape: 'flat', th: .85, y: 3, len: 1.1, rot: -3 }, mouth: { s: .8, y: 1 },
    map: { m: { smile: 'halfsmile', grin: 'halfsmile', laugh: 'smallopen', cat: 'halfsmile', tongue: 'halfsmile', small: 'tiny' }, e: { star: 'open', heart: 'smileeye', happy: 'smileeye', wide: 'open', sad: 'soft' } },
    emo: {
      neutral: { e: 'open', b: 'flat', m: 'tiny' },
      happy: { e: 'smileeye', b: 'sad', m: 'halfsmile', fx: ['blushlite'], tilt: -2 }, laugh: { e: 'closed', b: 'relaxed', m: 'smallopen', fx: ['blushlite'], tilt: -3 },
      blush: { e: 'soft', b: 'sad', m: 'tight', look: 5, fx: ['blush'] }, embarrassed: { e: 'soft', b: 'worried', m: 'hmm', look: 6, fx: ['blushfull'], tilt: 3 },
      love: { e: 'smileeye', b: 'sad', m: 'halfsmile', fx: ['blush'] }, tender: { e: 'smileeye', b: 'sad', m: 'halfsmile', fx: ['blushlite'] },
      smile: { e: 'smileeye', b: 'normal', m: 'halfsmile' }, shy: { e: 'soft', b: 'sad', m: 'tight', look: -5, fx: ['blushlite'] },
      cry: { e: 'closed', b: 'sad', m: 'tight', fx: ['tearbead'], droop: 3 }, sad: { e: 'lidded', b: 'sad', m: 'tight', droop: 3 }
    },
    marks(g, c) { g.ell(157, 181, 1.9, 1.9, c.line); }
  });

  // Mira: tareme, soft, always a little tired. Her anger is quiet, and her smile reaches her eyes before her mouth.
  F('mira', {
    head: 'oval', nose: 'button', cheek: 'soft', bl: .85,
    eye: { w: 1.08, h: 1.08, rot: 6, ir: [1.05, 1.1], hl: 'twin', lash: 'soft', low: 'lash', lid: .35, bag: true, lw: .9 },
    brow: { shape: 'soft', th: .9, y: -1 }, mouth: { s: .95 },
    map: { m: { grin: 'gentle', smile: 'gentle', cat: 'gentle', smirk: 'halfsmile' } },
    emo: {
      neutral: { e: 'open', b: 'relaxed', m: 'tiny' }, smile: { e: 'smileeye', b: 'relaxed', m: 'gentle' }, happy: { e: 'smileeye', b: 'raised', m: 'gentle', fx: ['blushlite'] },
      tired: { e: 'lidded', b: 'sad', m: 'tiny', droop: 4 }, angry: { e: 'determined', b: 'angry', m: 'tight' }, furious: { e: 'glare', b: 'angry', m: 'tight', fx: ['gloomlite'] },
      laugh: { e: 'happy', b: 'relaxed', m: 'grin', tilt: -4 }, cold: { e: 'lidded', b: 'normal', m: 'tight' }
    },
    marks(g, c) { for (const [x, y] of [[176, 181], [184, 184], [190, 180], [210, 180], [216, 184], [224, 181]]) g.ell(x, y, 1.15, 1.15, c.skinD); }
  });

  // Kaede: cat eyes, one brow permanently up, a fang in every smile. Bored until something is a contest.
  F('kaede', {
    head: 'pointed', nose: 'point', cheek: 'stripe', bl: 1.2,
    eye: { w: 1.02, h: .92, rot: -5, ir: [1.02, 1], pupil: 'slit', hl: 'cat', lash: 'sharp', lw: 1.05 },
    brow: { shape: 'angular', th: 1.1, dyR: -3 }, mouth: { dx: 1 },
    map: { m: { smile: 'fang', grin: 'fang', laugh: 'grinwide', smirk: 'smirkfang', cat: 'smirkfang', small: 'hmm', tiny: 'hmm' } },
    emo: {
      neutral: { e: 'lidded', b: 'normal', m: 'hmm' }, smile: { e: 'narrow', b: 'smug', m: 'smirkfang' }, excited: { e: 'open', b: 'angry', m: 'grinwide', fx: ['blushlite'], hop: 1 },
      determined: { e: 'glare', b: 'angry', m: 'fang', lean: 2 }, happy: { e: 'happy', b: 'raised', m: 'fang', fx: ['blushlite'], bob: 1 },
      embarrassed: { e: 'soft', b: 'angry', m: 'pout', look: 6, fx: ['blushfull'], tilt: 6 }, tired: { e: 'lidded', b: 'normal', m: 'hmm', droop: 3 }
    },
    marks(g, c) { g.save(); g.rot(24, 162, 187); g.fill('M153,183 L171,183 L171,191 L153,191Z', '#f8dcae', 1.4); g.line('M160,183 L160,191 M165,183 L165,191', '#d9b078', 1.1); g.restore(); g.line('M233,178 l9,4 M234,184 l10,4', '#d8907a', 1.6); }
  });

  // Sora: huge lit eyes, flared lashes. A stage face (wide, flawless) and a real one (small, crooked, only seen off-camera).
  F('sora', {
    head: 'heart', nose: 'button', cheek: 'stripe', bl: 1.15,
    eye: { w: 1.1, h: 1.15, ir: [1.12, 1.12], hl: 'star', lash: 'flare', low: 'lash' },
    brow: { shape: 'soft', th: .8, y: -1 }, mouth: { s: .95 },
    map: { m: { small: 'smile', tiny: 'smile' } },
    emo: {
      neutral: { e: 'open', b: 'raised', m: 'smile' }, smile: { e: 'open', b: 'raised', m: 'grinwide' }, happy: { e: 'smileeye', b: 'raised', m: 'smallopen', fx: ['blushlite'] },
      tender: { e: 'soft', b: 'sad', m: 'halfsmile' }, tired: { e: 'lidded', b: 'relaxed', m: 'tiny', droop: 3 }, laugh: { e: 'closed', b: 'raised', m: 'grinwide', tilt: -6, bob: 2 },
      sad: { e: 'sad', b: 'sad', m: 'tight', droop: 3 }, wry: { e: 'narrow', b: 'smug', m: 'halfsmile' }, fond: { e: 'smileeye', b: 'sad', m: 'halfsmile', fx: ['blushlite'] }
    },
    marks(g, c) { star(g, 239, 183, 6.2, '#ffd54a', 1.2); g.ell(160, 182, 1.5, 1.5, c.line); }
  });

  // Tetsu: broad, gentle, slow. A face built to be leaned on.
  F('tetsu', {
    head: 'square', nose: 'std', cheek: 'soft', bl: .9,
    eye: { w: .95, h: .95, ir: [.95, 1], hl: 'twin', lw: 1 },
    brow: { shape: 'flat', th: 1.4, y: 1 }, mouth: { s: 1.05 },
    map: { m: { smile: 'gentle', smirk: 'gentle', cat: 'gentle', laugh: 'grin' } },
    emo: {
      neutral: { e: 'open', b: 'relaxed', m: 'tiny' }, smile: { e: 'smileeye', b: 'relaxed', m: 'gentle' }, happy: { e: 'smileeye', b: 'raised', m: 'grin' },
      sad: { e: 'sad', b: 'sad', m: 'tight', droop: 3 }, tired: { e: 'lidded', b: 'sad', m: 'tiny', droop: 3 }
    },
    marks(g, c) { g.line('M149,137 L158,174', c.skinH, 2.6); g.line('M151,148 l5,-1 M153,158 l5,-1', c.skinS, 1.2); }
  });

  // Kyouya: long, quiet, pale. Looks like someone politely waiting for a verdict.
  F('kyouya', {
    head: 'long', nose: 'point', cheek: 'soft', bl: .55,
    eye: { w: 1, h: .9, rot: 3, ir: [.9, 1.05], pupil: 'ring', hl: 'one', lw: .9, lid: .4, bag: true },
    brow: { shape: 'angular', th: .9, len: 1.05, rot: 2 }, mouth: { s: .85 },
    map: { m: { smile: 'halfsmile', grin: 'halfsmile', laugh: 'smallopen' } },
    emo: { neutral: { e: 'open', b: 'sad', m: 'tiny' }, sad: { e: 'lidded', b: 'sad', m: 'tight', droop: 4 } },
    marks(g, c) { g.line('M236,171 l7,8 l-3,7 l8,5 M237,176 l10,-3', '#8fe8ff', 1.5); }
  });

  // Rin: round, wide, nearly unlit eyes and a face that is still learning which expression goes with which feeling.
  F('rin', {
    head: 'round', nose: 'none', cheek: 'soft', bl: .8,
    eye: { w: 1.1, h: 1.18, ir: [1.25, 1.2], pupil: 'dot', hl: 'none', lash: 'soft', low: 'none' },
    brow: { shape: 'soft', th: .7, y: -2, len: .9 }, mouth: { s: .8, y: -1 },
    map: { m: { smile: 'tight', grin: 'tight', cat: 'hmm', laugh: 'smallopen', small: 'tiny' } },
    emo: {
      neutral: { e: 'open', b: 'raised', m: 'tiny', look: -2 }, smile: { e: 'open', b: 'normal', m: 'tight' }, happy: { e: 'smileeye', b: 'raised', m: 'smallopen', fx: ['blushlite'] },
      confused: { e: 'wide', b: 'worried', m: 'hmm', fx: ['question'], look: -3, tilt: -8 }, awe: { e: 'wide', b: 'raised', m: 'o', look: 2 }
    },
    marks(g, c) { g.line('M153,183 l5,0 M161,183 l3,0 M153,187 l3,0', '#5fe6ff', 1.6); }
  });

  // Shiori: precise. Her face has settings, and she knows which ones are for whom.
  F('shiori', {
    head: 'oval', nose: 'none', cheek: 'none', bl: .35, noFx: ['sparkle'],
    eye: { w: 1, h: .92, rot: -3, hl: 'hex', lash: 'sharp', lw: 1.1 },
    brow: { shape: 'angular', th: .9, len: .95, y: 1 }, mouth: { s: .82 },
    map: { m: { smile: 'tight', grin: 'tight', cat: 'tight', laugh: 'smallopen', small: 'tight', tiny: 'tight' } },
    emo: { neutral: { e: 'open', b: 'normal', m: 'tight' }, happy: { e: 'smileeye', b: 'raised', m: 'gentle', fx: ['blushlite'] }, tender: { e: 'soft', b: 'sad', m: 'gentle', fx: ['blushlite'] } },
    marks(g) { g.line(hexD(240, 185, 5.4), '#e0b84a', 1.7); }
  });

  // Chairman Kuroda: hooded, heavy brows, a smile that is one decision rather than a feeling.
  F('kuroda', {
    nose: 'hook', cheek: 'none', bl: .3, noFx: ['blushlite', 'blush', 'sparkle', 'heart'],
    eye: { w: .9, h: .85, rot: 4, ir: [.85, .9], pupil: 'dot', hl: 'none', lid: .8, bag: true },
    brow: { shape: 'flat', th: 1.6, y: 2, len: 1.1 }, mouth: { s: .9 },
    map: { m: { smile: 'halfsmile', grin: 'smirkfang', laugh: 'smirk', cat: 'smirk' } }
  });

  // Saeki: half-lidded behind the glass, polite to the point of weather.
  F('saeki', {
    head: 'oval', nose: 'none', cheek: 'none', bl: .5,
    eye: { w: .98, h: .86, rot: 2, hl: 'one', lid: .5, bag: true },
    brow: { shape: 'flat', th: .9, y: 1 }, mouth: { s: .85 },
    map: { m: { smile: 'tight', grin: 'halfsmile', laugh: 'smallopen', cat: 'halfsmile' } },
    emo: { neutral: { e: 'open', b: 'normal', m: 'tight' } },
    marks(g, c) { g.ell(216, 197, 1.4, 1.4, c.line); }
  });

  // Natsuki: Hikari's older sister. The same sunny bones, but squarer, braced for impact and wearing the day on her.
  F('natsuki', {
    head: 'square', nose: 'point', cheek: 'soft', bl: 1,
    eye: { w: 1.04, h: 1, rot: -4, hl: 'twin', lash: 'doll', lw: 1.05 },
    brow: { shape: 'arch', th: 1.5, len: 1.1, y: 1 }, mouth: { s: 1.1 },
    map: { m: { smile: 'gentle', grin: 'grinwide', cat: 'smirkfang' } },
    emo: { neutral: { e: 'open', b: 'normal', m: 'tiny' }, tired: { e: 'lidded', b: 'sad', m: 'tiny', droop: 4 } },
    marks(g, c) { g.ell(157, 187, 8, 3.8, '#c9b5a6'); g.line('M213,215 l9,4', '#d8907a', 1.6); }
  });

  // Aya: amber eyes behind glass, one brow with opinions.
  F('aya', {
    head: 'oval', nose: 'none', cheek: 'none', bl: .5,
    eye: { w: 1, h: .88, rot: -4, hl: 'one', lash: 'sharp', lid: .5, bag: true },
    brow: { shape: 'angular', th: 1, dyR: -4, y: 1 }, mouth: { s: .85 },
    map: { m: { smile: 'halfsmile', grin: 'smirkfang', laugh: 'halfsmile', cat: 'smirkfang' } },
    marks(g, c) { g.line('M146,168 l-6,2 M146,172 l-6,6', c.skinD, 1.2); }
  });
})();

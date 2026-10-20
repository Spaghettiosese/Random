/* HEARTLINE AGENCY — "After Story" DLC: married life and kids, one four-episode arc per heroine.
   Episodes: 1 Vows (wedding) · 2 First Years (newborn) · 3 Family Day (kids ~6 and ~3) · 4 The Porch (years later).
   Each heroine's scripts register as dlc_<who> and dlc_<who>_1 … _4 (story_dlc_*.js); the runtime in engine.js starts them from the title screen. */
STORY.dlc = (() => {
  const kids = { hikari: ['raika', 'sou'], rei: ['tsukiko', 'akira'], mira: ['hana', 'ren'], sora: ['hoshi', 'kai'], kaede: ['hayate', 'momo'] };
  const names = { hikari: 'Hikari', rei: 'Rei', mira: 'Mira', sora: 'Sora', kaede: 'Kaede' };
  const titles = { hikari: 'Sunflowers & Sparks', rei: 'The Long Night, Shared', mira: 'Strawberry Saturdays', sora: 'Encore, Forever', kaede: 'Slow Lane' };
  // episode wrapper: title card, scene dressing, then the lines
  const ep = (who, n, title, bg, music, fx, lines) => (STORY.scripts[`dlc_${who}_${n}`] = [
    ['music', null], ['bg', 'black'], ['fx', null], ['tint', null], ['hideall'], ['cgoff'],
    ['title', `AFTER STORY · EPISODE ${n}`, title],
    ['bg', bg, 'fade'], ['fx', fx], ['music', music],
    ...lines, ['hideall'], ['cgoff']
  ]);
  const N = { wedding: 'Vows', home: 'First Years', family: 'Family Day', night: 'The Porch' };
  Object.keys(kids).forEach(w => Object.entries(N).forEach(([k, n]) => { Art.CG_NAMES[`cg_dlc_${w}_${k}`] = `${n} (${names[w]})`; }));
  const reg = who => { STORY.scripts[`dlc_${who}`] = [1, 2, 3, 4].map(n => ['call', `dlc_${who}_${n}`]).concat([['aftend', who]]); };
  return { kids, names, titles, ep, reg };
})();

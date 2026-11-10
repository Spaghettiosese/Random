// Special Projects (Götterdämmerung update): secret weapons and breakthrough programmes.
// One project runs at a time. Progress comes from universities and from focuses that boost project work.
'use strict';
const VERSION = '1.3 “Eastern Front”';
// id: [name, icon, required techs, cost, description, effects, earliest year]
const PROJECTS = {
  radar_net: ['Radar Network', '📡', ['m_radio'], 120, 'A chain of stations that sees raiders long before they arrive.', { tech: 'm_radar', spirit: 'p_radar_net' }, 1937],
  codebreak: ['Code-Breaking Bureau', '🔐', ['m_radio', 's_stat'], 140, 'Mathematicians, card indexes and stolen cipher keys.', { spirit: 'p_codebreak' }, 1937],
  synth_fuel: ['Synthetic Fuel Process', '⚗️', ['p_petro'], 150, 'Petrol from coal, at a price.', { tech: 'p_synthetic', build: { synth: 2 } }, 1936],
  penicillin: ['Antibiotic Production', '💊', ['s_edu'], 160, 'A mould in a dish becomes a factory process.', { tech: 's_medicine', spirit: 'p_penicillin' }, 1939],
  assault_rifle: ['Assault Rifle', '🔫', ['m_smg'], 160, 'Automatic fire for every rifleman.', { tech: 'm_assault', equip: { arms: 400 } }, 1940],
  heavy_tank: ['Breakthrough Tank', '🛡️', ['m_tank2'], 200, 'Armour no field gun can pierce.', { tech: 'm_tank3', units: { arm: 2 } }, 1940],
  rocket_art: ['Rocket Artillery', '🎆', ['m_art1', 'p_precision'], 150, 'Cheap rails, terrifying salvos.', { tech: 'm_art2', equip: { artillery: 200 } }, 1939],
  computer: ['Computing Engine', '🧮', ['s_stat', 'p_precision'], 220, 'A machine that calculates firing tables overnight.', { tech: 's_computing' }, 1940],
  jet: ['Jet Fighter', '✈️', ['m_air1', 'p_precision'], 260, 'The propeller has reached its limit.', { tech: 'm_air3', equip: { aircraft: 250 } }, 1941],
  flying_wing: ['Long-Range Bomber', '🛩️', ['m_air2'], 220, 'A bomber that can cross an ocean and return.', { spirit: 'p_bomber' }, 1940],
  elektro_sub: ['Electric Submarine', '🌊', ['m_nav2'], 220, 'A hull shaped for the deep, with batteries to match.', { spirit: 'p_sub', equip: { ships: 20 } }, 1941],
  missile: ['Ballistic Missile', '🚀', ['m_art2', 'p_precision'], 300, 'A rocket that falls faster than sound. Unlocks the Missile Bombardment decision.', { spirit: 'p_missile' }, 1942],
  night_vision: ['Night-Fighting Equipment', '🌙', ['m_radar'], 180, 'Infrared lamps and sights for tanks and snipers.', { spirit: 'p_night' }, 1942],
  pile: ['Atomic Pile', '⚛️', ['p_petro', 's_edu'], 320, 'A self-sustaining chain reaction under a sports stadium.', { tech: 'p_atomic', research: 20 }, 1940],
  bomb: ['The Atomic Bomb', '☢️', ['p_atomic'], 480, 'Now we are all become something else. Unlocks the atomic bomb decision.', { tech: 'p_bomb' }, 1943]
};
Object.assign(SPIRITS, {
  p_radar_net: ['Radar Network', 'Early warning along every coast.', { civdef: 0.3, air: 0.1 }],
  p_codebreak: ['Code-Breaking Bureau', 'We read their orders before their generals do.', { def: 0.05, atk: 0.03, navy: 0.08, infl: 0.15 }],
  p_penicillin: ['Antibiotics', 'The wounded return to the line.', { manpower: 0.06 }],
  p_bomber: ['Intercontinental Bombers', 'No factory is out of reach.', { bombing: 0.6, air: 0.05 }],
  p_sub: ['Electric Submarines', 'Hunters that never surface.', { navy: 0.2 }],
  p_missile: ['Ballistic Missiles', 'There is no defence against them.', { bombing: 0.3, ws: 3 }],
  p_night: ['Night-Fighting Equipment', 'The dark belongs to us.', { atk: 0.05, def: 0.03 }]
});
const projRate = c => (0.6 + (c.stats.innov || 0) * 0.22 + c.lit * 1.2) * (1 + M(c, 'proj'));
function projectState(c, id) {
  const p = PROJECTS[id], pr = c.proj || (c.proj = { cur: null, prog: 0, done: {} });
  if (pr.done[id]) return 'done'; if (pr.cur === id) return 'active'; if (id === 'bomb' && !pr.done.pile && !c.techs.p_atomic) return 'locked';
  if (p[5].tech && [].concat(p[5].tech).every(t => c.techs[t]) && !p[5].spirit && !p[5].units && !p[5].build) return 'obsolete';
  if (!p[2].every(t => c.techs[t])) return 'locked'; return 'available';
}
function startProject(c, id) { if (projectState(c, id) !== 'available') return false; c.proj.cur = id; c.proj.prog = Math.min(c.projPts || 0, PROJECTS[id][3] * 0.5); c.projPts = 0; return true; }
function projectTick(c) {
  const pr = c.proj || (c.proj = { cur: null, prog: 0, done: {} }); if (!pr.cur) { c.projPts = Math.min(80, (c.projPts || 0) + projRate(c) * 0.25); return; }
  const p = PROJECTS[pr.cur]; if (c.projPts) { pr.prog += c.projPts; c.projPts = 0; }
  pr.prog += projRate(c) / (1 + Math.max(0, p[6] - year()) * 0.8);
  if (pr.prog < p[3]) return; pr.done[pr.cur] = G.day; const id = pr.cur; pr.cur = null; pr.prog = 0; applyEff(c, p[5]);
  logMsg(`${c.name} completes a special project: ${p[0]}.`, id === 'bomb' ? 'world' : 'info', []);
  if (c.tag === G.player) UIH.popup({ title: 'Project Complete', icon: p[1], desc: `<b>${p[0]}</b><br><i>${p[4]}</i><br><br>${effText(p[5], c)}`, options: [{ name: 'Excellent.' }] });
}
function aiProjects(c) { const pr = c.proj || (c.proj = { cur: null, prog: 0, done: {} }); if (pr.cur || (!c.major && c.lit < 0.8)) return; const av = Object.keys(PROJECTS).filter(id => projectState(c, id) === 'available' && PROJECTS[id][6] <= year() + 1).sort((a, b) => PROJECTS[a][3] - PROJECTS[b][3]); if (av.length) startProject(c, av[0]); }
DECISIONS.missile_strike = D('Missile Bombardment', 'Military', 60, 'Launch a salvo of ballistic missiles at an enemy city.', { fn: c => { const e = enemiesOf(c.tag).map(C).filter(k => !k.capitulated).sort((a, b) => countryStr(b.tag) - countryStr(a.tag))[0]; if (!e) return; const p = heldBy(e.tag).sort((a, b) => b.vp - a.vp)[0]; if (!p) return; p.dmg = Math.min(0.6, p.dmg + 0.15); e.ws = Math.max(0, e.ws - 4); e.warExh = Math.min(100, e.warExh + 4); logMsg(`${c.adj} missiles fall on ${p.name}.`, 'world'); }, tip: 'Devastates the greatest city of our strongest enemy and saps their will' }, { cd: 60, visible: c => !!(c.proj && c.proj.done.missile), avail: c => isAtWar(c.tag) ? '' : 'Requires being at war', ai: 0.5 });

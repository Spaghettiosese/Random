// 2.1 Nuclear weapons. After the Atomic Bomb is developed, production reactors turn out bombs one at a time. A bomb can
// strike any enemy-held province within reach of our bombers (or anywhere, with ballistic missiles); bombers can be shot
// down over a contested sky. The blast and the fallout kill, wreck industry and armies, and shock the nation struck: two
// cities lost and a war already going badly can bring a surrender. The world does not forget who used it first.
'use strict';
SPIRITS.nuclear_power = ['Atomic Power', 'We hold the most terrible weapon ever made.', { infl: 0.3, ws: 5 }];
SPIRITS.nuclear_shock = ['Nuclear Shock', 'A city has vanished in a flash. The people ask how much longer.', { ws: -12, stab: -8, output: -0.04 }];
SPIRITS.nuclear_pariah = ['Atomic Pariah', 'The world remembers who used the bomb.', { infl: -0.2, stab: -2 }];
const nukeRange = c => hasSpirit(c, 'p_missile') ? 1e9 : hasSpirit(c, 'p_bomber') ? 6000 : 2600;
function nukeReach(c, p) { let best = 1e9; for (const q of G.P) if ((q.ctrl === c.tag || (friendly(c.tag, q.ctrl) && !atWar(c.tag, q.ctrl))) && PLAT[q.id] !== undefined) { const d = kmBetween(q.id, p.id); if (d < best) best = d; if (best < 300) break; } return best; }
function nukeIntercept(c, p) { if (hasSpirit(c, 'p_missile')) return 0.03; const sup = typeof zoneSup === 'function' && PZ ? zoneSup(c.tag, PZ[p.id]) : 0.5; return clamp(0.5 * (1 - sup) - 0.03, 0.02, 0.45); }
function nukeTargets(c) { const R = nukeRange(c); return G.P.filter(p => atWar(c.tag, p.ctrl) && p.pop > 50).map(p => ({ p, km: nukeReach(c, p) })).filter(x => x.km <= R).sort((a, b) => (b.p.vp * 3 + b.p.pop / 400) - (a.p.vp * 3 + a.p.pop / 400)); }
function nukeWhy(c, p) { if (!(c.nukes > 0)) return 'We have no atomic bombs'; if (!atWar(c.tag, p.ctrl)) return 'Not held by an enemy'; const km = nukeReach(c, p); if (km > nukeRange(c)) return `Out of range: ${Math.round(km)} km from our nearest airfield (range ${nukeRange(c)} km)`; return ''; }
function dropNuke(c, p) {
  const why = nukeWhy(c, p); if (why) return why; c.nukes--; c.nukesUsed = (c.nukesUsed || 0) + 1; const T = C(p.ctrl), own = C(p.owner), w = warOf(c.tag, p.ctrl);
  if (Math.random() < nukeIntercept(c, p)) { logMsg(`A ${c.adj} bomber carrying an atomic bomb is shot down short of ${p.name}.`, 'world', [c.tag, p.ctrl]); return 'intercepted'; }
  const first = !G.flags.firstNuke; G.flags.firstNuke = G.flags.firstNuke || G.day + 1;
  // the blast
  const dead = Math.min(p.pop * (p.ter === 'u' ? 0.3 : 0.22), 100 + p.pop * 0.012); p.pop = Math.max(1, p.pop - dead); own.civDead = (own.civDead || 0) + dead; own._civM = (own._civM || 0) + dead; (own.civBy = own.civBy || {}).atomic = (own.civBy.atomic || 0) + dead; if (typeof wacc === 'function') wacc(w, 'civ', p.owner, dead);
  for (const k in p.b) p.b[k] = Math.floor(p.b[k] * 0.4); p.dmg = 0.9; p.fort = 0; p.fallout = G.day + 540; p.unrest = Math.max(p.unrest || 0, 40);
  for (const a of armiesAt(p.id)) for (const d of a.divs) { d.str *= 0.35; d.org = 0; }
  // the nation struck
  T.ws = Math.max(0, T.ws - 20); T.stab = Math.max(0, T.stab - 8); T.warExh = Math.min(100, T.warExh + 20); T.nuked = (T.nuked || 0) + 1; addSpirit(T, 'nuclear_shock', 365);
  // the world
  c.infamy += first ? 25 : 10; G.tension = Math.min(100, G.tension + (first ? 15 : 6)); addSpirit(c, 'nuclear_power');
  for (const k of alive()) if (k.tag !== c.tag && !friendly(k.tag, c.tag)) addRel(k.tag, c.tag, k.ideology === 'dem' ? -15 : -8);
  if (c.nukesUsed >= 3) addSpirit(c, 'nuclear_pariah');
  logMsg(`${first ? 'For the first time in history, an' : 'An'} atomic bomb falls on ${p.name}. ${fmt(dead * 1000)} ${own.adj} civilians are killed in a single moment.`, 'world', [c.tag, p.ctrl, p.owner]);
  if (p.ctrl === G.player || p.owner === G.player) UIH.popup({ title: `${p.name} Is Gone`, icon: '☢️', desc: `A single ${c.adj} bomb has destroyed ${p.name}. ${fmt(dead * 1000)} are dead, and the survivors are dying of something no doctor understands. The factories, the barracks and the railway yards are ashes.`, options: [{ name: 'We will never forget.' }] });
  // surrender: a beaten nation struck twice may give up
  if (T.ai && !T.capitulated && T.nuked >= 2 && (T.warExh > 55 || capInfo(T.tag).prog > 0.35 || T.ws < 25)) { logMsg(`${T.name} announces its surrender, citing "a new and most cruel bomb".`, 'world'); capitulate(T.tag); }
  else checkCapitulation(T.tag);
  UIH.mapDirty(); return '';
}
// production: reactors make bombs; fallout lingers
function nukeMonthly(c) { if (!c.techs.p_bomb) return; if (year() < 1944 && !(G.rules && G.rules.opt && G.rules.opt.earlynuke)) { if (c.ai) aiNukes(c); return; } const first = !c.nukeEver; c.nukeProg = (c.nukeProg || 0) + 6 + 5 * (c.reactors || 0) + ((c.gdp || 0) > 15e6 ? 4 : 0);
  if (c.nukeProg >= 100 && (c.nukes || 0) < 20) { c.nukeProg -= 100; c.nukes = (c.nukes || 0) + 1; c.nukeEver = true; if (first) { logMsg(`A blinding flash in the desert: ${c.name} has tested an atomic bomb.`, 'world'); G.tension = Math.min(100, G.tension + 5); } else if (c.tag === G.player) UIH.notify('Another atomic bomb is ready.', 'good'); }
  if (c.ai) aiNukes(c); }
function buildReactor(c) { if (!c.techs.p_atomic) return 'Requires Atomic Research'; if ((c.reactors || 0) >= 4) return 'Four reactors is the most we can run'; const cost = 8 * Math.max(200, c.budget.income || 200); if (c.pp < 50) return 'Needs 50 political power'; if (c.money < cost) return `Needs ${fmt(cost)} in the treasury`; c.pp -= 50; c.money -= cost; c.reactors = (c.reactors || 0) + 1; return ''; }
function aiNukes(c) { if (c.techs.p_atomic && (c.reactors || 0) < 2 && c.pp > 120 && Math.random() < 0.3) buildReactor(c); if (!(c.nukes > 0) || !isAtWar(c.tag)) return;
  const deterred = enemiesOf(c.tag).some(t => C(t).nukes > 0 || C(t).nukesUsed), losing = capInfo(c.tag).prog > 0.5, long = G.wars.some(w => (w.att.includes(c.tag) || w.def.includes(c.tag)) && G.day - w.start > 700);
  if (deterred && !losing) return; if (!long && !losing && c.warExh < 40) return; if (Math.random() > (c.ideology === 'fas' ? 0.55 : 0.35)) return;
  const t = nukeTargets(c).filter(x => C(x.p.ctrl).major || x.p.vp >= 10).find(x => nukeIntercept(c, x.p) < 0.3); if (t) dropNuke(c, t.p); }
{ const _pm = politicsMonthly; politicsMonthly = function (c) { _pm(c); if (c.exists && !c.capitulated) nukeMonthly(c); }; }
{ const _ot = occupationTick; occupationTick = function () { _ot(); for (const p of G.P) if (p.fallout) { if (p.fallout <= G.day) { delete p.fallout; continue; } p.dmg = Math.max(p.dmg, 0.5); p.pop *= 0.998; p.unrest = Math.min(100, (p.unrest || 0) + 1); } }; }
// the old one-click decision gives way to the arsenal
if (DECISIONS.atom_bomb) { DECISIONS.atom_bomb.visible = () => false; DECISIONS.atom_bomb.ai = 0; }

/* HEARTLINE AGENCY — agency systems: perks, gear, HQ upgrades, morale, pair bonds, weather, nemeses,
   call chains, shift objectives, Handler skills, minigames (breach / reflex / rhythm) and the date system. */
const Sys = (() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let api = null;
  const init = a => { api = a; };
  const rng = seed => { let s = (seed >>> 0) || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const shuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- perks: pick one of two at Lv 3 / 6 / 9 ----------
  const PK = (id, n, d, fx) => ({ id, n, d, fx });
  const PERK_LV = [3, 6, 9];
  const PERKS = {
    hikari: [[PK('overcharge', 'Overcharge', '+2 Combat on ★★★+ calls', { st: { com: 2 }, cond: 't3' }), PK('static', 'Static Step', 'Travels 35% faster', { travel: .65 })],
      [PK('storm', 'Stormcaller', '+15% success in rain, storms and snow', { chance: .15, cond: 'wet' }), PK('battery', 'Human Battery', 'Teammates get +1 Vigor', { team: { vig: 1 } })],
      [PK('goddess', 'Thunder Goddess', '+10% success on every call', { chance: .1 }), PK('never', 'Never Give Up', 'Can never be injured', { noinj: 1 })]],
    rei: [[PK('umbra', 'Umbral Step', 'Travels 40% faster on night shifts', { travel: .6, cond: 'night' }), PK('analyst', 'Cold Analysis', '+2 Intellect on ★★★+ calls', { st: { int: 2 }, cond: 't3' })],
      [PK('lone', 'Lone Wolf', '+15% success when sent alone', { chance: .15, cond: 'solo' }), PK('veil', 'Nightveil', 'Team injury chance halved', { inj: .5 })],
      [PK('eclipse', 'Total Eclipse', '+2 Combat and +2 Intellect on ★★★★ calls', { st: { com: 2, int: 2 }, cond: 't4' }), PK('borrowed', 'Borrowed Light', '+1 Charisma; +10% when teamed with Hikari', { st: { cha: 1 }, chance: .1, cond: 'with:hikari' })]],
    kaede: [[PK('tailwind', 'Tailwind', 'Travels 40% faster', { travel: .6 }), PK('lap', 'Victory Lap', 'Rests 35% faster', { rest: .65 })],
      [PK('relay', 'Relay Runner', 'Teammates get +1 Mobility', { team: { mob: 1 } }), PK('scout', 'Scout Ahead', '+10% on calls that need Mobility', { chance: .1, cond: 'need:mob' })],
      [PK('sonic', 'Sonic Boom', '+3 Combat on ★★★+ calls', { st: { com: 3 }, cond: 't3' }), PK('rival', 'Rival Fire', '+15% when teamed with Hikari', { chance: .15, cond: 'with:hikari' })]],
    tetsu: [[PK('wall', 'Human Wall', 'Team injury chance halved', { inj: .5 }), PK('lift', 'Heavy Lifter', '+2 Vigor on ★★+ calls', { st: { vig: 2 }, cond: 't2' })],
      [PK('bonsai', 'Bonsai Patience', 'Rests 40% faster', { rest: .6 }), PK('big', 'Big Brother', 'Teammates get +1 Combat', { team: { com: 1 } })],
      [PK('fortress', 'Fortress', 'His team can\'t be injured', { inj: 0 }), PK('gentle', 'Gentle Giant', '+2 Charisma; +10% on calls that need Charisma', { st: { cha: 2 }, chance: .1, cond: 'need:cha' })]],
    sora: [[PK('fanbase', 'Fanbase', '+2 Charisma on every call', { st: { cha: 2 } }), PK('orbit', 'Low Orbit', 'Travels 30% faster', { travel: .7 })],
      [PK('encore', 'Encore', '+25% credits from her calls', { cred: 1.25 }), PK('gravity', 'Gravity Well', '+2 Combat on ★★★+ calls', { st: { com: 2 }, cond: 't3' })],
      [PK('superstar', 'Superstar', 'Teammates get +1 Charisma and +1 Vigor', { team: { cha: 1, vig: 1 } }), PK('singular', 'Singularity', '+12% success on every call', { chance: .12 })]],
    rin: [[PK('sonar', 'Sonar', '+2 Intellect on every call', { st: { int: 2 } }), PK('echostep', 'Echo Step', 'Travels 30% faster', { travel: .7 })],
      [PK('resonance', 'Resonance', '+15% on ★★★+ calls', { chance: .15, cond: 't3' }), PK('harmony', 'Harmony', 'Teammates get +1 Intellect', { team: { int: 1 } })],
      [PK('shatter', 'Shatterpoint', '+3 Combat on ★★★★ calls', { st: { com: 3 }, cond: 't4' }), PK('sibling', 'Glass Sibling', '+10% success and rests 30% faster', { chance: .1, rest: .7 })]],
    natsuki: [[PK('firebreak', 'Firebreak', 'Team injury chance halved', { inj: .5 }), PK('responder', 'First Responder', 'Travels 35% faster', { travel: .65 })],
      [PK('carry', 'Fireman\'s Carry', '+2 Vigor on every call', { st: { vig: 2 } }), PK('calm', 'Calm Voice', '+2 Charisma on ★★+ calls', { st: { cha: 2 }, cond: 't2' })],
      [PK('salamander', 'Salamander', '+15% on ★★★★ calls', { chance: .15, cond: 't4' }), PK('squadone', 'Squad One', 'Teammates get +1 to every stat', { team: { com: 1, vig: 1, mob: 1, cha: 1, int: 1 } })]],
    shiori: [[PK('aegis', 'Aegis Wall', 'Team injury chance halved', { inj: .5 }), PK('lance', 'Hard-Light Lance', '+2 Combat on every call', { st: { com: 2 } })],
      [PK('command', 'Command Presence', 'Teammates get +1 Combat', { team: { com: 1 } }), PK('drill', 'Drill Sergeant', '+25% XP for her team', { xp: 1.25 })],
      [PK('prime', 'Aegis Prime', '+12% success on every call', { chance: .12 }), PK('redeem', 'Redemption', '+2 to every stat on priority calls', { st: { com: 2, vig: 2, mob: 2, cha: 2, int: 2 }, cond: 'special' })]]
  };
  const findPerk = (id, pid) => { for (const t of PERKS[id] || []) for (const p of t) if (p.id === pid) return p; return null; };
  const perksOf = (G, id) => ((G.heroes[id] && G.heroes[id].perks) || []).map(p => findPerk(id, p)).filter(Boolean);
  const perkDue = (G, id) => { const h = G.heroes[id]; if (!h || !PERKS[id]) return -1; const n = (h.perks || []).length; return n < 3 && h.lvl >= PERK_LV[n] ? n : -1; };

  // ---------- gear (one slot per hero) ----------
  const GEAR = {
    gloves: { n: 'Insulated Gloves', icon: '🧤', d: '+1 Combat', p: 180, st: { com: 1 } },
    shoes: { n: 'Carbon Sprint Shoes', icon: '👟', d: '+1 Mobility', p: 180, st: { mob: 1 } },
    earpiece: { n: 'Tactical Earpiece', icon: '🎧', d: '+1 Intellect', p: 180, st: { int: 1 } },
    mic: { n: 'Idol Headset Mic', icon: '🎤', d: '+1 Charisma', p: 180, st: { cha: 1 } },
    vest: { n: 'Weave-Kevlar Vest', icon: '🦺', d: '+1 Vigor · half injury chance', p: 240, st: { vig: 1 }, inj: .5 },
    thermos: { n: 'Bottomless Thermos', icon: '🥤', d: 'Rests 30% faster', p: 200, rest: .7 },
    charm: { n: 'Omamori Charm', icon: '🧧', d: '+6% success', p: 260, chance: .06 },
    visor: { n: 'HUD Visor', icon: '🥽', d: '+1 Intellect · +1 Mobility', p: 340, st: { int: 1, mob: 1 }, chap: 3 },
    cape: { n: 'Hero Cape', icon: '🦸', d: '+1 Charisma · +1 Combat', p: 340, st: { cha: 1, com: 1 }, chap: 4 },
    core: { n: 'Rift-Core Amplifier', icon: '💠', d: '+2 to the hero\'s best stat', p: 520, best: 2, chap: 7 }
  };
  const bestStat = h => Object.keys(h.st).reduce((b, k) => h.st[k] > h.st[b] ? k : b, 'com');

  // ---------- HQ upgrades ----------
  const HQ = {
    med: { n: 'Med Bay', icon: '🏥', d: l => `Injury chance −${l * 25}%` },
    garage: { n: 'Garage', icon: '🚓', d: l => `Travel time −${l * 12}%` },
    gym: { n: 'Training Hall', icon: '🥊', d: l => `Training XP +${l * 25}% · wider strike zones` },
    comms: { n: 'Comms Array', icon: '📡', d: l => `Call timers +${l * 10}%${l >= 2 ? ' · +1 Overwatch charge' : ''}` },
    cafe: { n: 'Cafeteria', icon: '🍱', d: l => `+${l * 10} energy and −${l * 10} fatigue every morning` },
    drone: { n: 'Drone Bay', icon: '🛸', d: l => `+${l * 3}% success on every call` },
    lounge: { n: 'Rec Lounge', icon: '🎮', d: l => `+${l * 4} morale every morning${l >= 2 ? ' · +1 ♥ from Hang Outs' : ''}` }
  };
  const HQCOST = [400, 800, 1400];
  const hq = (G, k) => (G.hq && G.hq[k]) || 0;

  // ---------- weather ----------
  const WEATHER = [
    { n: 'Clear', i: '☀️', d: 'No modifiers' },
    { n: 'Breezy', i: '🌤️', d: 'Kaede +2 Mobility', st: { kaede: { mob: 2 } } },
    { n: 'Rain', i: '🌧️', d: 'Travel +15% · Hikari +1 Combat', travel: 1.15, st: { hikari: { com: 1 } }, wet: 1 },
    { n: 'Storm', i: '⛈️', d: 'Travel +25% · one extra call · Hikari +2 Combat', travel: 1.25, calls: 1, st: { hikari: { com: 2 } }, wet: 1 },
    { n: 'Snow', i: '❄️', d: 'Travel +30% · Tetsu +1 Vigor', travel: 1.3, st: { tetsu: { vig: 1 } }, wet: 1 },
    { n: 'Heatwave', i: '🔥', d: 'Rest +20% · Natsuki +2 Vigor', rest: 1.2, st: { natsuki: { vig: 2 } } },
    { n: 'Glass Fog', i: '🌫️', d: 'Travel +20% · Rin +2 Intellect', travel: 1.2, st: { rin: { int: 2 } } }
  ];
  function rollWeather(G) {
    const c = G.chap || 0, r = rng(G.day * 31 + 7)();
    const pool = c >= 9 && c <= 10 ? [4, 4, 0, 4, 3] : c >= 6 && c <= 7 ? [5, 0, 5, 3, 1] : c >= 11 ? [6, 0, 3, 6, 2] : [0, 1, 2, 0, 1, 3, 0];
    return pool[(r * pool.length) | 0];
  }

  // ---------- nemeses ----------
  const NEMESES = {
    minute: { n: 'Mr. Minute', icon: '⏱️', ch: 2, d: 'A dapper thief who skips sixty seconds of everyone else\'s time.', r: '3 2 6 1 5', slots: 2, tier: 3,
      taunt: ['Tick-tock, Handler. You\'re already late.', 'I stole a minute from every clock in Akiba. Come and find it.', 'Punctuality is a virtue. Yours, not mine.'],
      flee: 'He tips his hat, and he\'s gone. Every clock in the district now runs a minute slow.', caught: 'Mr. Minute is in cuffs. Every clock in Neo-Tokyo ticks forward a minute. Somewhere, a commuter makes their train.' },
    velvet: { n: 'Velvet Riot', icon: '🎭', ch: 3, d: 'A masked agitator whose voice makes crowds do whatever she says.', r: '2 3 2 7 4', slots: 2, tier: 3,
      taunt: ['Darling, the crowd is MY instrument.', 'Riot, riot, pretty riot~', 'Your heroes are adorable. Can they out-talk ten thousand people?'],
      flee: 'The crowd surges between her and your heroes. By the time it clears, only her velvet mask is left.', caught: 'Velvet Riot\'s microphone is confiscated. The crowd blinks, mumbles apologies and goes home.' },
    kilowatt: { n: 'Kilowatt Kid', icon: '🔋', ch: 4, d: 'A teenage Spark who eats electricity and burps blackouts. Hikari has opinions.', r: '6 4 4 1 3', slots: 2, tier: 3,
      taunt: ['Nom nom. Your power grid tastes like PENNIES.', 'Tell Thunder Goddess I want a rematch!', 'Lights out, losers!'],
      flee: 'Half of Uptown goes dark. A distant, very satisfied burp echoes off the towers.', caught: 'The Kilowatt Kid is grounded, literally, with a copper cable and a juice box. Hikari offers him an internship.' },
    choir: { n: 'The Hollow Choir', icon: '🎶', ch: 6, d: 'Three singers who shatter glass, and bones, in perfect harmony.', r: '5 5 2 3 6', slots: 3, tier: 4,
      taunt: ['♪ La la la… can you hear the glass sing? ♪', 'We are three. You are… how many, Handler?', 'Your city is a wine glass. We know its note.'],
      flee: 'A final chord. Every window on the block cracks, and the Choir walks off through the sound.', caught: 'Three microphones, three cells, one very long silence. Rin says the Choir used to sing for Squad One.' },
    baron: { n: 'Frostbite Baron', icon: '🥶', ch: 9, d: 'A disgraced Board enforcer who freezes whatever he touches. Loves monologues.', r: '7 6 3 3 4', slots: 3, tier: 4,
      taunt: ['Winter is the Board\'s natural state, Handler.', 'I once froze a man mid-sentence. He\'s still at the museum.', 'Cold hands, colder heart. It\'s on my business card.'],
      flee: 'An ice wall slams down across the avenue. Behind it, a cape swishes dramatically out of sight.', caught: 'The Baron is carried off in a heated van, still monologuing. The snow over the harbor stops at once.' }
  };
  function nemesisCall(G, S, r) {
    const pool = Object.entries(NEMESES).filter(([k, v]) => (G.chap || 0) >= v.ch && ((G.nem && G.nem[k]) || 0) < 3);
    if (!pool.length || r() > .38) return null;
    const [k, v] = pool[(r() * pool.length) | 0];
    return { at: 90 + ((r() * 250) | 0), t: `NEMESIS: ${v.n}`, d: v.d, r: v.r, n: v.slots, tier: v.tier, nem: k };
  }

  // ---------- call chains ----------
  const CHAINS = [
    { id: 'zoo', n: 'The Great Zoo Escape', ch: 1, steps: [
      { t: 'Open Enclosures — Ueno Zoo', d: 'Someone left every gate open. The capybaras have already reached the ramen shop.', r: '0 2 3 2 2', tier: 1, dist: 'park' },
      { t: 'Elephant on the Tracks', d: 'Hanako the elephant is standing on the Yamanote line and refuses to be rushed.', r: '3 3 1 4 1', tier: 2, n: 2 },
      { t: 'Who Opened the Gates?', d: 'The footage shows a kid with animal-speech powers. He just wanted them to see the sea.', r: '0 2 2 5 3', tier: 2 }] },
    { id: 'bank', n: 'The Midnight Bank Job', ch: 2, steps: [
      { t: 'Silent Alarm — Mizuho Bank', d: 'A silent alarm and no visible intruders. The vault logs are being wiped as we speak.', r: '1 1 2 1 5', tier: 2, hack: 1, dist: 'uptown' },
      { t: 'Getaway Van on the Expressway', d: 'The crew is running east with the vault drives. Cut them off before the tunnel.', r: '3 2 6 0 2', tier: 2, n: 2 },
      { t: 'Standoff at the Harbor Depot', d: 'Cornered at the docks with a hostage. End it without anyone getting hurt.', r: '4 3 2 6 3', tier: 3, n: 2, dist: 'harbor' }] },
    { id: 'idol', n: 'Stalker at the Showcase', ch: 2, steps: [
      { t: 'Threat Letters — Idol Showcase', d: 'A rookie idol group is getting threats written in glass shards. Find the pattern.', r: '0 1 1 3 5', tier: 2, hack: 1 },
      { t: 'Break-in at the Dressing Room', d: 'The stalker got past security. The idols have barricaded themselves in.', r: '3 2 4 2 1', tier: 2, n: 2 },
      { t: 'The Show Must Go On', d: 'Stalker caught. Now 3,000 panicking fans need calming before the curtain.', r: '0 3 1 7 2', tier: 3, n: 2 }] },
    { id: 'blackout', n: 'Rolling Blackout', ch: 3, steps: [
      { t: 'Substation Sabotage', d: 'Substation 4 is dark. Someone cut the lines with surgical precision.', r: '1 2 2 0 5', tier: 2, hack: 1, dist: 'industrial' },
      { t: 'Hospital on Backup Power', d: 'Generators are failing at Riverside General. Forty patients on life support.', r: '2 5 3 2 3', tier: 3, n: 2, dist: 'riverside' },
      { t: 'The Saboteur Surfaces', d: 'A Spark-powered saboteur is heading for the next substation. Stop him.', r: '5 3 5 1 3', tier: 3, n: 2 }] },
    { id: 'echo', n: 'Rift Echoes', ch: 6, steps: [
      { t: 'Resonance Spike — Old Town', d: 'Rift readings where no Rift should be. The ground is humming.', r: '1 2 2 0 6', tier: 3, hack: 1, dist: 'oldtown' },
      { t: 'Echo Beasts', d: 'Glass creatures that copy whatever hits them. Hit them differently every time.', r: '6 4 4 0 5', tier: 3, n: 3 },
      { t: 'Seal the Micro-Rift', d: 'A tear the size of a door. Close it before it becomes a gate.', r: '5 6 3 2 6', tier: 4, n: 3 }] },
    { id: 'whiteout', n: 'Whiteout', ch: 9, steps: [
      { t: 'Stranded Bus — Mountain Road', d: 'A school bus is stuck in the snow above Old Town, and the heater just died.', r: '2 5 3 3 1', tier: 2, n: 2, dist: 'oldtown' },
      { t: 'Avalanche Warning', d: 'The slope above the bus is groaning. Get everyone out, quietly.', r: '3 5 4 3 4', tier: 3, n: 2, dist: 'oldtown' },
      { t: 'Frozen Harbor Crane', d: 'A crane operator is trapped in an iced-over cab sixty meters up.', r: '2 4 6 2 2', tier: 3, n: 2, dist: 'harbor' }] }
  ];
  function chainFor(G, r) {
    const pool = CHAINS.filter(c => (G.chap || 0) >= c.ch && !(G.chains && G.chains[c.id]));
    if (!pool.length || r() > .5) return null;
    return pool[(r() * pool.length) | 0];
  }

  // ---------- shift objectives ----------
  const OBJ = [
    { id: 'nomiss', t: 'Miss no calls', ok: S => S.miss === 0 },
    { id: 'streak', t: 'Reach a 4-call success streak', ok: S => S.best >= 4 },
    { id: 'hi', t: 'Resolve 2 calls of ★★★ or higher', ok: S => S.hiOk >= 2 },
    { id: 'noinj', t: 'Finish with no injuries', ok: S => S.inj === 0 },
    { id: 'solo', t: 'Resolve 3 calls with a single hero', ok: S => S.soloOk >= 3 },
    { id: 'fast', t: 'Dispatch 3 calls within 10 min of them coming in', ok: S => S.fast >= 3 },
    { id: 'noskill', t: 'Use no Handler skills', ok: S => S.skillsUsed === 0 },
    { id: 'hero', t: 'Send {h} on 3 successful calls', ok: (S, o) => (S.heroOk[o.h] || 0) >= 3 }
  ];
  function objectives(G, r) {
    const pick = shuffle(OBJ, r).slice(0, 2);
    return pick.map(o => { const x = { id: o.id, t: o.t, done: false }; if (o.id === 'hero') { x.h = G.roster[(r() * G.roster.length) | 0]; x.t = o.t.replace('{h}', api ? api.WHO[x.h].n : x.h); } return x; });
  }
  const objOk = (S, o) => OBJ.find(x => x.id === o.id).ok(S, o);

  // ---------- Handler skills ----------
  const SKILLS = {
    overwatch: { n: 'Overwatch', i: '🎯', d: '+15% success on the selected call', ch: 1 },
    rally: { n: 'Rally', i: '📣', d: 'All resting heroes are ready right now', ch: 2 },
    rush: { n: 'Rush', i: '⚡', d: 'Everyone en route arrives immediately', ch: 3 },
    coffee: { n: 'Coffee Run', i: '☕', d: 'The whole squad sheds 25 fatigue', ch: 4 }
  };
  const skillCharges = G => { const o = {}; Object.entries(SKILLS).forEach(([k, s]) => { if ((G.chap || 0) >= s.ch) o[k] = k === 'overwatch' ? 2 + (hq(G, 'comms') >= 2 ? 1 : 0) : 1; }); return o; };

  // ---------- dispatch modifiers ----------
  function condOk(c, call, team, S, G) {
    if (!c) return true;
    if (c[0] === 't') return call.tier >= +c[1];
    if (c === 'wet') return !!WEATHER[G.weather || 0].wet;
    if (c === 'solo') return team.length === 1;
    if (c === 'night') return ((S && S.cfg.start) || 9) >= 17;
    if (c === 'special') return !!call.special;
    if (c.startsWith('with:')) return team.includes(c.slice(5));
    if (c.startsWith('need:')) return call.req[c.slice(5)] > 0;
    return false;
  }
  function stat(G, S, id, k, call, team) {
    const h = G.heroes[id]; let v = h.st[k];
    const g = h.gear && GEAR[h.gear]; if (g) { v += (g.st && g.st[k]) || 0; if (g.best && k === bestStat(h)) v += g.best; }
    const w = WEATHER[G.weather || 0]; if (w.st && w.st[id]) v += w.st[id][k] || 0;
    perksOf(G, id).forEach(p => { if (p.fx.st && condOk(p.fx.cond, call, team, S, G)) v += p.fx.st[k] || 0; });
    team.forEach(o => { if (o !== id) perksOf(G, o).forEach(p => { if (p.fx.team) v += p.fx.team[k] || 0; }); });
    if ((G.aff[id] || 0) >= 12 && k === bestStat(h)) v += 1;
    return v;
  }
  const pairKey = (a, b) => [a, b].sort().join('|');
  const pairLv = (G, a, b) => Math.min(3, Math.floor(((G.pairs && G.pairs[pairKey(a, b)]) || 0) / 3));
  const MOOD = { cheer: ['😊', 'Cheerful', 'Extra ♥ from time together'], fired: ['🔥', 'Fired Up', '+5% success on calls'], tired: ['😪', 'Tired', '−5% success on calls'], moody: ['🌧️', 'Moody', 'Bad topics sting double'], calm: ['🍵', 'Calm', 'No effect'] };
  function bonus(G, S, call, team) {
    let v = 0; const notes = [];
    team.forEach(id => {
      perksOf(G, id).forEach(p => { if (p.fx.chance && condOk(p.fx.cond, call, team, S, G)) { v += p.fx.chance; notes.push(`+ ${api ? api.WHO[id].n : id}: ${p.n}`); } });
      const g = G.heroes[id].gear && GEAR[G.heroes[id].gear]; if (g && g.chance) v += g.chance;
      if ((G.aff[id] || 0) >= 22) { v += .05; notes.push(`+ ${api ? api.WHO[id].n : id} fights for you (♥ Heartline)`); }
      const m = G.mood && G.mood[id]; if (m === 'fired') v += .05; if (m === 'tired') v -= .05;
    });
    for (let i = 0; i < team.length; i++) for (let j = i + 1; j < team.length; j++) { const l = pairLv(G, team[i], team[j]); if (l) { v += l * .03; notes.push(`+ Bond Lv ${l}: ${api.WHO[team[i]].n} & ${api.WHO[team[j]].n}`); } }
    v += hq(G, 'drone') * .03 + ((G.morale === undefined ? 60 : G.morale) - 50) / 500;
    return [v, notes];
  }
  function travelMul(G, team, S) {
    let m = (1 - hq(G, 'garage') * .12) * (WEATHER[G.weather || 0].travel || 1), best = 1;
    team.forEach(id => { perksOf(G, id).forEach(p => { if (p.fx.travel && condOk(p.fx.cond, { tier: 0, req: {} }, team, S, G)) best = Math.min(best, p.fx.travel); }); });
    return m * best;
  }
  function restMul(G, id) {
    let m = WEATHER[G.weather || 0].rest || 1;
    perksOf(G, id).forEach(p => { if (p.fx.rest) m *= p.fx.rest; });
    const g = G.heroes[id].gear && GEAR[G.heroes[id].gear]; if (g && g.rest) m *= g.rest;
    return m;
  }
  function injMul(G, team, id) {
    if (perksOf(G, id).some(p => p.fx.noinj)) return 0;
    let m = 1 - hq(G, 'med') * .25;
    team.forEach(o => perksOf(G, o).forEach(p => { if (p.fx.inj !== undefined) m *= p.fx.inj; }));
    const g = G.heroes[id].gear && GEAR[G.heroes[id].gear]; if (g && g.inj) m *= g.inj;
    return m;
  }
  const xpMul = (G, team) => team.reduce((m, id) => m * perksOf(G, id).reduce((a, p) => a * (p.fx.xp || 1), 1), 1);
  const credMul = (G, team) => team.reduce((m, id) => m * perksOf(G, id).reduce((a, p) => a * (p.fx.cred || 1), 1), 1);
  const expMul = G => 1 + hq(G, 'comms') * .1;

  // ---------- morning routine ----------
  const BDAY = { hikari: 8, tetsu: 12, rei: 17, mira: 23, kaede: 29, sora: 34, rin: 41, natsuki: 45, shiori: 50 };
  function dayStart(G) {
    G.weather = rollWeather(G);
    const r = rng(G.day * 131 + 5), keys = Object.keys(MOOD); G.mood = {};
    Object.keys(G.heroes).concat(['mira']).forEach(h => { const x = r(); G.mood[h] = x < .45 ? 'calm' : keys[(r() * 4) | 0]; });
    const c = hq(G, 'cafe'), l = hq(G, 'lounge');
    if (c) { G.energy = clamp(G.energy + c * 10, 0, 100 + c * 10); Object.values(G.heroes).forEach(s => s.fat = clamp(s.fat - c * 10, 0, 100)); }
    G.morale = clamp((G.morale === undefined ? 60 : G.morale) + l * 4 + (G.morale < 50 ? 3 : 0), 0, 100);
    const b = Object.entries(BDAY).find(([, d]) => d === G.day); G.bday = b && G.known[b[0]] !== undefined ? b[0] : null;
  }
  function journal(G, line) { G.journal = (G.journal || []).concat([{ d: G.day, c: G.chapT, t: line }]).slice(-80); }

  // ---------- minigame helpers ----------
  function keyTrap(fn) { const k = e => { if (fn(e) !== false) { e.preventDefault(); e.stopPropagation(); } }; document.addEventListener('keydown', k, true); return () => document.removeEventListener('keydown', k, true); }

  // BREACH: pick codes along alternating row / column lines to spell the target sequence.
  function breach(host, o, done) {
    const CODES = ['1C', '55', 'BD', 'E9', '7A', 'FF'], N = o.n || 5, len = o.len || 3, buf = o.buf || 6, time = o.time || 22000, r = Math.random;
    if (Sys.auto) { const ok = r() < (o.autoP || .7); setTimeout(() => done(ok, ok && r() < .3), 30); return; }
    const grid = [...Array(N)].map(() => [...Array(N)].map(() => CODES[(r() * 5) | 0]));
    // walk a legal path so the target is always solvable
    let rr = 0, cc = (r() * N) | 0; const path = [[rr, cc]];
    for (let i = 1; i < len; i++) { if (i % 2) { let nr; do nr = (r() * N) | 0; while (nr === rr); rr = nr; } else { let nc; do nc = (r() * N) | 0; while (nc === cc); cc = nc; } path.push([rr, cc]); }
    const target = path.map(([a, b]) => grid[a][b]);
    let line = { row: 0 }, picked = [], used = {}, over = false, t0 = performance.now();
    host.innerHTML = `<div class="breach"><div class="brh"><b>⌨ BREACH PROTOCOL</b><span>Pick codes along the lit line. Lines alternate row → column → row. Spell the target in order.</span></div>
      <div class="brbody"><div class="brgrid" style="grid-template-columns:repeat(${N},1fr)">${grid.map((row, i) => row.map((c, j) => `<button class="brc" data-r="${i}" data-c="${j}">${c}</button>`).join('')).join('')}</div>
      <div class="brside"><label>TARGET</label><div class="brt">${target.map(c => `<i>${c}</i>`).join('')}</div><label>BUFFER</label><div class="brb">${[...Array(buf)].map(() => '<i></i>').join('')}</div><div class="brtime"><i></i></div><div class="brmsg"></div></div></div></div>`;
    const cells = [...host.querySelectorAll('.brc')];
    const paint = () => {
      cells.forEach(b => { const i = +b.dataset.r, j = +b.dataset.c; b.classList.toggle('live', !over && !used[i + ',' + j] && (line.row !== undefined ? i === line.row : j === line.col)); b.classList.toggle('used', !!used[i + ',' + j]); });
      host.querySelectorAll('.brb i').forEach((e, i) => { e.textContent = picked[i] || ''; });
      const m = match(); host.querySelectorAll('.brt i').forEach((e, i) => e.classList.toggle('ok', i < m));
    };
    const match = () => { let best = 0; for (let s = 0; s < picked.length; s++) { let k = 0; while (k < len && picked[s + k] === target[k]) k++; if (s + k === picked.length || k === len) best = Math.max(best, k); } return best; };
    const end = ok => { if (over) return; over = true; paint(); host.querySelector('.brmsg').innerHTML = ok ? '<b class="good">ACCESS GRANTED</b>' : '<b class="bad">BREACH FAILED</b>'; api.sfx(ok ? 'success' : 'fail'); setTimeout(() => done(ok, ok && picked.length === len), 900); };
    cells.forEach(b => b.onclick = () => {
      if (over) return; const i = +b.dataset.r, j = +b.dataset.c;
      if (used[i + ',' + j] || (line.row !== undefined ? i !== line.row : j !== line.col)) return api.sfx('miss');
      used[i + ',' + j] = 1; picked.push(grid[i][j]); api.sfx('beep'); line = line.row !== undefined ? { col: j } : { row: i };
      paint(); if (match() >= len) end(true); else if (picked.length >= buf) end(false);
    });
    const tick = () => { if (over || !host.isConnected) return; const f = 1 - (performance.now() - t0) / time; const e = host.querySelector('.brtime i'); if (e) e.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) return end(false); requestAnimationFrame(tick); };
    paint(); requestAnimationFrame(tick);
  }

  // REFLEX: targets pop up; click them before they vanish.
  function reflex(host, o, done) {
    const n = o.n || 8; let i = 0, hits = 0, perf = 0, over = false;
    if (Sys.auto) { setTimeout(() => done(Math.round(Math.random() * 3 + 5)), 30); return; }
    host.innerHTML = `<div class="reflex"><div class="rfh"><b>👟 AGILITY COURSE</b><span>Click each target before it closes. Faster clicks score PERFECT.</span></div><div class="rfarea" id="rfarea"></div><div class="rfscore">0 / ${n}</div></div>`;
    const area = host.querySelector('#rfarea');
    const next = () => {
      if (!host.isConnected) return;
      if (i >= n) { over = true; const sc = Math.round((hits + perf) / (n * 2) * 9); setTimeout(() => done(sc), 500); return; }
      const life = Math.max(560, (o.life || 1150) - i * 55), t = document.createElement('button'), born = performance.now();
      t.className = 'rft'; t.style.left = (6 + Math.random() * 84) + '%'; t.style.top = (8 + Math.random() * 74) + '%'; t.style.setProperty('--life', life + 'ms');
      let gone = false;
      t.onpointerdown = e => { e.stopPropagation(); if (gone) return; gone = true; const q = (performance.now() - born) / life; hits++; if (q < .45) { perf++; api.sfx('perfect'); t.classList.add('perf'); } else { api.sfx('punch'); t.classList.add('hit'); } host.querySelector('.rfscore').textContent = `${hits} / ${n}`; setTimeout(() => t.remove(), 220); i++; setTimeout(next, 260); };
      area.appendChild(t);
      setTimeout(() => { if (gone) return; gone = true; t.classList.add('miss'); api.sfx('miss'); setTimeout(() => t.remove(), 220); i++; setTimeout(next, 260); }, life);
    };
    setTimeout(next, 700);
  }

  // RHYTHM: four lanes charted from the live track's melody, so the notes land on the music.
  function rhythm(host, o, done) {
    const track = o.track || 'idol', bars = o.bars || 8, lead = 1.25;
    Sound.play(track);
    if (Sys.auto) { setTimeout(() => done({ score: 7, grade: 'A', acc: .85, combo: 20 }), 30); return; }
    const LANES = ['D', 'F', 'J', 'K'], W = 520, H = 420, JY = 360;
    host.innerHTML = `<div class="rhythm"><div class="rhh"><b>🎤 ${o.title || 'STAGE PRACTICE'}</b><span>Hit <kbd>D</kbd> <kbd>F</kbd> <kbd>J</kbd> <kbd>K</kbd> (or tap the lanes) as notes cross the line.</span></div>
      <div class="rhwrap"><canvas width="${W}" height="${H}"></canvas><div class="rhside"><div class="rhcombo"><b>0</b><small>COMBO</small></div><div class="rhjudge"></div><div class="rhacc">—</div></div></div></div>`;
    const cv = host.querySelector('canvas'), g = cv.getContext('2d');
    const sync = Sound.sync(track), ch = sync || Sound.chart(track);
    const clock = sync ? sync.now : () => performance.now() / 1000;
    const spb = ch.spb, now0 = clock();
    let s0, base;
    if (sync) { const stNow = (now0 - sync.t0) / spb; s0 = Math.ceil((stNow + lead / spb) / 16) * 16; base = sync.t0 + s0 * spb; } else { s0 = 0; base = now0 + 2; }
    const mel = ch.mel, ms = mel.map(n => n.m), lo = Math.min(...ms), hi = Math.max(...ms) + 1;
    const notes = [];
    for (let s = s0; s < s0 + bars * 16; s++) { const m = mel.find(n => n.st === s % ch.loop); if (m) notes.push({ t: base + (s - s0) * spb, lane: clamp(Math.floor((m.m - lo) / (hi - lo) * 4), 0, 3), m: m.m, hit: 0 }); }
    for (let i = 1; i < notes.length; i++) if (notes[i].t - notes[i - 1].t < spb * 1.9 && notes[i].lane === notes[i - 1].lane) notes[i].lane = (notes[i].lane + 2) % 4;
    const endT = base + bars * 16 * spb + .6;
    let combo = 0, maxc = 0, pf = 0, gd = 0, ms2 = 0, over = false, flashL = [0, 0, 0, 0];
    const judge = (txt, cls) => { const j = host.querySelector('.rhjudge'); j.textContent = txt; j.className = 'rhjudge ' + cls; void j.offsetWidth; j.classList.add('pop'); };
    const hitLane = L => {
      if (over) return; flashL[L] = 1; const t = clock();
      let best = null; notes.forEach(n => { if (!n.hit && n.lane === L && Math.abs(n.t - t) < .16 && (!best || Math.abs(n.t - t) < Math.abs(best.t - t))) best = n; });
      if (!best) return;
      const d = Math.abs(best.t - t); best.hit = d < .065 ? 2 : 1; if (best.hit === 2) pf++; else gd++;
      combo++; maxc = Math.max(maxc, combo); Sound.note((sync ? sync.root : ch.root) + 12 + best.m, .22, 'triangle'); judge(best.hit === 2 ? 'PERFECT' : 'GOOD', best.hit === 2 ? 'p' : 'g');
    };
    const untrap = keyTrap(e => { const L = LANES.indexOf(e.key.toUpperCase()); if (L < 0) return false; if (!e.repeat) hitLane(L); });
    cv.onpointerdown = e => { const r = cv.getBoundingClientRect(); hitLane(clamp(Math.floor((e.clientX - r.left) / r.width * 4), 0, 3)); };
    const lw = W / 4, COL = ['#ff5d9e', '#ffd24a', '#52e0ff', '#b99bff'];
    const draw = () => {
      if (!host.isConnected) { untrap(); return; }
      const t = clock(); g.clearRect(0, 0, W, H);
      for (let L = 0; L < 4; L++) { g.fillStyle = L % 2 ? '#ffffff08' : '#ffffff04'; g.fillRect(L * lw, 0, lw, H); if (flashL[L] > 0) { g.fillStyle = COL[L] + '44'; g.fillRect(L * lw, 0, lw, H); flashL[L] -= .12; } }
      g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, JY); g.lineTo(W, JY); g.stroke();
      g.font = 'bold 18px sans-serif'; g.textAlign = 'center'; for (let L = 0; L < 4; L++) { g.fillStyle = '#ffffff66'; g.fillText(LANES[L], L * lw + lw / 2, JY + 36); }
      notes.forEach(n => {
        if (!n.hit && t - n.t > .16) { n.hit = -1; ms2++; combo = 0; judge('MISS', 'm'); }
        if (n.hit) return; const y = JY - (n.t - t) / lead * JY; if (y < -20 || y > H + 20) return;
        g.fillStyle = COL[n.lane]; g.shadowColor = COL[n.lane]; g.shadowBlur = 14; g.beginPath(); g.roundRect ? g.roundRect(n.lane * lw + 12, y - 11, lw - 24, 22, 10) : g.rect(n.lane * lw + 12, y - 11, lw - 24, 22); g.fill(); g.shadowBlur = 0;
      });
      const doneN = notes.filter(n => n.hit).length, acc = doneN ? (pf + gd * .6) / doneN : 0;
      host.querySelector('.rhcombo b').textContent = combo; host.querySelector('.rhacc').textContent = doneN ? Math.round(acc * 100) + '%' : '—';
      if (t > endT && !over) {
        over = true; untrap(); const total = notes.length || 1, A = (pf + gd * .6) / total, grade = A >= .9 ? 'S' : A >= .78 ? 'A' : A >= .6 ? 'B' : 'C';
        judge(`GRADE ${grade}`, 'p'); api.sfx(grade === 'S' || grade === 'A' ? 'success' : 'confirm');
        setTimeout(() => done({ score: Math.round(A * 9), grade, acc: A, combo: maxc, pf, gd, ms: ms2 }), 1200); return;
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  // ---------- dates ----------
  const LOCS = {
    cafe: { n: 'Café Lumière', bg: 'cafe', cost: 40, ch: 1, icon: '☕', intro: 'Latte art, jazz on vinyl, and a window seat facing the rain-slick street.', moment: 'The barista draws a heart in the foam. It looks more like a bruised potato. You both lose it.' },
    arcade: { n: 'Neon Arcade', bg: 'arcade', cost: 30, ch: 1, icon: '🕹️', intro: 'Blinking cabinets, the smell of popcorn, and a crane game that has clearly never lost.', moment: '{w} goes for the crane game. Seven tries later, a lumpy plush Rift-beast drops into the chute. It is hideous. It is perfect.' },
    park: { n: 'Ueno Park', bg: 'park', cost: 0, ch: 1, icon: '🌳', fx: 'sakura', intro: 'Evening in the park. Lanterns in the trees, joggers, and a very confident crow.', moment: 'A gust of wind brings a flurry of petals down on you both. One lands squarely on {w}\'s nose.' },
    ramen: { n: 'Ramen Ichiban', bg: 'ramen', cost: 30, ch: 1, icon: '🍜', intro: 'Steam, noren curtains, and the best tonkotsu in Neo-Tokyo, allegedly.', moment: 'Two bowls. Extra chashu. The owner slides over a free egg and a very knowing look.' },
    rooftop: { n: 'HALO Rooftop', bg: 'rooftop', cost: 0, ch: 1, icon: '🌃', fx: 'stars', intro: 'Two cans from the vending machine, and the whole city spread out below.', moment: 'Far away, a hero streaks across the sky like a shooting star. {w} makes a wish and won\'t tell you what it was.' },
    mall: { n: 'Skyline Mall', bg: 'mall', cost: 60, ch: 2, icon: '🛍️', intro: 'Six floors of shops, a food court, and a photo booth with suspiciously strong filters.', moment: 'A photo booth. Four frames: normal, silly, sillier, and one where neither of you was ready.' },
    aquarium: { n: 'Tidal Aquarium', bg: 'aquarium', cost: 80, ch: 3, icon: '🐠', intro: 'Blue light and quiet water. The whole world slows down in here.', moment: 'A whale shark glides overhead in the blue dark. {w}\'s face is lit up like the water.' },
    amusement: { n: 'Starlight Land', bg: 'amusement', cost: 100, ch: 4, icon: '🎡', cg: 'cg_ferris_', intro: 'Roller coasters, cotton candy, and a Ferris wheel lit up like a crown.', moment: 'The Ferris wheel stops at the very top. The whole city spreads out below you like a circuit board of light.' },
    shrine: { n: 'Hilltop Shrine', bg: 'shrine', cost: 0, ch: 5, icon: '⛩️', intro: 'Two hundred stone steps, a sleepy fox statue, and wind chimes.', moment: 'You each draw a fortune. You get "Great Blessing." {w} gets "Future Uncertain," and ties it to the branch with great ceremony.' },
    beach: { n: 'Shonan Beach', bg: 'beach', cost: 60, ch: 6, icon: '🏖️', intro: 'Warm sand, cold drinks, and waves that keep trying to steal your sandals.', moment: 'The sunset turns the waves gold. Somebody\'s radio plays an old summer song, and neither of you says it\'s cheesy.' },
    festival: { n: 'Summer Festival', bg: 'festival', cost: 50, ch: 6, until: 8, icon: '🏮', fx: 'fireworks', cg: 'cg_fest_', of: 'yukata', intro: 'Lanterns, goldfish scooping, takoyaki stalls, and a crowd in summer yukata.', moment: 'The first firework blooms overhead. For a second everyone looks up, and you look at {w} instead.' },
    snow: { n: 'Winter Illumination', bg: 'snow_city', cost: 50, ch: 9, icon: '❄️', fx: 'snow', cg: 'cg_snow_', of: 'winter', intro: 'A million blue lights strung through the bare trees, and your breath fogging in the cold.', moment: 'Snow starts falling through the lights, soft as static. {w} catches a flake and holds it out to you.' }
  };
  const TOPICS = { work: 'Hero work', food: 'Favorite foods', hobbies: 'Hobbies', dreams: 'Dreams for the future', past: 'Growing up', city: 'The city at night', joke: 'Tell a terrible joke', flirt: 'Flirt a little', quiet: 'Say nothing. Just enjoy it.' };
  const DATE = {
    hikari: { love: ['ramen', 'amusement', 'festival', 'arcade', 'beach'], dislike: ['shrine'], tl: ['food', 'dreams'], tk: ['joke', 'hobbies'], td: ['past', 'work'],
      loc: { love: "WHOA! This place is AMAZING! You know me so well it's kinda scary!", like: 'Ooh, nice pick! I\'m in!', dislike: "Oh… it's, um, very… calm here. I'll try not to break anything." },
      t: { work: ["Nooo, no shop talk! I'm OFF duty! My brain is a no-lightning zone tonight!", 'pout'], food: ["Okay, ranking time. Ramen: S-tier. Melon bread: S-tier. Your konbini onigiri? …A-plus. Don't tell anyone I said that.", 'excited'], hobbies: ["Hero manga! The old ones, from my mom's collection. I've read *Blue Comet* like forty times.", 'happy'], dreams: ["I'm gonna be the hero people call when nobody else can help. The *last* call. The one that always picks up.", 'determined'], past: ["…Can we not? Tonight I just wanna be here. Not back there.", 'sad'], city: ["From up high the streets look like circuit boards. I always wanna zap 'em and see what lights up. Kidding! Mostly!", 'smile'], joke: ["Pfft— that's SO bad! Bahaha! Why am I laughing?! Worst joke ever!", 'laugh'], flirt: ["W-what?! Don't say stuff like that out of nowhere! My hair's gonna frizz!", 'flustered', "…Say that again. Slower. I wanna remember it.", 'love'], quiet: ["…It's nice. Just sitting. I usually can't sit still for more than four seconds.", 'tender'] },
      end: ["Today was the best. Top three. Top one. Okay, it's number one. Stop smiling!", "That was fun! Next time I'm picking the place, though!"] },
    rei: { love: ['aquarium', 'rooftop', 'snow', 'shrine'], dislike: ['mall', 'beach'], tl: ['city', 'quiet'], tk: ['hobbies', 'dreams', 'food'], td: ['joke', 'work'],
      loc: { love: "…You remembered. I didn't think anyone was listening.", like: 'Acceptable.', dislike: "Too many people. Stay close so I don't have to talk to any of them." },
      t: { work: ["You brought a clipboard to a date. I can tell. It's in your voice.", 'deadpan'], food: ["Matcha. Unsweetened. Anything else is a crime. …Hikari's melon bread is acceptable. Once a month.", 'smirk'], hobbies: ["I read old mysteries. I like knowing the ending was decided before I opened the book.", 'smile'], dreams: ["A quiet apartment. A black cat named Nothing. …Someone to come home to who doesn't ask why I'm late.", 'blush'], past: ["My mother played piano. I did too, before the shadows. …That's all you get tonight.", 'sad'], city: ["At night every building throws a shadow and I can feel them all at once. With you here it's… quieter.", 'tender'], joke: ["…No.", 'cold'], flirt: ["…Try that again when you've earned it.", 'glare', "…Idiot. …Don't stop.", 'flustered'], quiet: ["You're the only person who knows how to be silent with me. Do you know how rare that is?", 'tender'] },
      end: ["…I'd like to do this again. Soon. Don't make it weird.", 'That was… fine. Thank you for the evening.'] },
    mira: { love: ['cafe', 'aquarium', 'park', 'shrine'], dislike: ['arcade'], tl: ['past', 'hobbies'], tk: ['food', 'quiet', 'dreams'], td: ['work'],
      loc: { love: "Oh… this is perfect. I haven't been anywhere this lovely since medical school.", like: 'What a sweet idea. Thank you for inviting me.', dislike: "It's a little loud, isn't it? No, no, I'm fine! Let's make the best of it." },
      t: { work: ["No shop talk. Doctor's orders. I'm prescribing one night of not thinking about fatigue meters.", 'tease'], food: ["I bake when I'm stressed. So… I bake a lot. There's a strawberry tart in my fridge with your name on it. Literally, in icing.", 'happy'], hobbies: ["I press flowers. And crosswords! I'm frighteningly fast at crosswords. Ask Tetsu, he's still upset.", 'smile'], dreams: ["A small clinic by the sea. No sirens. People come in with scraped knees and leave with lollipops.", 'tender'], past: ["Tell me about *you* growing up instead. I hold other people's pain all day. I want to hold a happy memory for once.", 'smile'], city: ["Every light out there is someone awake. Someone worrying. I used to want to fix all of them.", 'think'], joke: ["Ahaha! That's awful! That's clinically awful! Tell me another!", 'laugh'], flirt: ["Ara. Flirting with your medical officer? That's in the handbook, you know. Page forty.", 'tease', "…You can't say things like that to me. I don't have a single defense against you.", 'love'], quiet: ["This is the most relaxed I've been in a year. Don't move. Doctor's orders.", 'sleepy'] },
      end: ["I'm keeping today. Like a pressed flower. Thank you, {name}.", "Thank you for getting me out of the med bay. I needed that."] },
    sora: { love: ['rooftop', 'aquarium', 'snow', 'amusement'], dislike: ['mall', 'festival'], tl: ['dreams', 'joke'], tk: ['food', 'city', 'hobbies'], td: ['work', 'past'],
      loc: { love: 'No cameras, no fans, just us? This is the best gift anyone\'s given me.', like: 'Cute pick! I\'m in disguise, so call me… Soraya.', dislike: 'Uh oh. Three people already recognized me. Hat down, sunglasses on. Walk fast.' },
      t: { work: ["Please don't ask me about promo schedules. I get enough of that from STELLAR's seventeen group chats.", 'gloomy'], food: ["Crêpes. Strawberry custard. My manager says they're 'off-brand.' I eat two out of spite.", 'smug'], hobbies: ["Stargazing! I know every constellation. I named my gravity move after one. Want me to show you Lyra?", 'excited'], dreams: ["I want to sing one song that's mine. Not written by a committee. Just… true.", 'tender'], past: ["I got scouted at twelve. I don't really remember being a kid. Just being *cute on camera*.", 'sad'], city: ["You can't see stars from here. Too much light. But if I float high enough… there they are.", 'awe'], joke: ["Ahahaha! That's so dumb! Do it again! I'm stealing it for my next variety show!", 'laugh'], flirt: ["Ehehe, careful! Idols aren't allowed to date. …Says my contract. Which I haven't read.", 'wink', "…Nobody's ever said that to *me*. Not Stargazer. Me. Say it again?", 'love'], quiet: ["It's nice when nobody's watching. …Well. You're watching. That's different.", 'blush'] },
      end: ["Best. Date. Ever. And I've been on *fake* ones for publicity, so I would know.", "Thanks for today! You're really easy to be around, you know?"] },
    kaede: { love: ['arcade', 'beach', 'amusement', 'ramen'], dislike: ['cafe', 'shrine'], tl: ['hobbies', 'joke'], tk: ['food', 'work'], td: ['quiet', 'past'],
      loc: { love: 'YES. Finally, somewhere with some *speed*. Race you to the entrance!', like: 'Not bad, Handler. Not bad at all.', dislike: "We're… sitting? The whole time? …Fine. I'll try. For you." },
      t: { work: ["Ask me my top speed. Go on. …It's 340 km/h. You didn't ask, but I'm telling you.", 'smug'], food: ["Energy drinks count as food. Don't look at me like that. Fine: gyoza. I could eat sixty.", 'smirk'], hobbies: ["Racing games. The real track's too slow, so I race ghosts. My own ghost, mostly. I always win.", 'excited'], dreams: ["Be the fastest hero in history. …And maybe learn how to stop running once in a while.", 'think'], past: ["Academy stuff? Hikari beat me once. ONCE. We don't talk about it.", 'pout'], city: ["I know every shortcut in Neo-Tokyo. There's an alley behind the ramen shop that saves 0.8 seconds. Life-changing.", 'smile'], joke: ["HA! That's terrible! My turn: why did the speedster fail the test? She finished before it started!", 'laugh'], flirt: ["Heh. Nice try, Handler. You'll have to be faster than that.", 'smirk', "…W-wait. Say it slower. For once in my life I don't want something to go fast.", 'flustered'], quiet: ["S-sitting still? For how long? …Okay. I can do this. …This is actually nice. Don't tell anyone.", 'embarrassed'] },
      end: ["Okay. I'll admit it. That was the best time I've ever had going slow.", "Not bad, Handler. I'll give it a seven. An eight. Don't push it."] }
  };
  const DATE_MIN = 8;
  const locPref = (w, l) => DATE[w].love.includes(l) ? 'love' : DATE[w].dislike.includes(l) ? 'dislike' : 'like';
  const topicPref = (G, w, t) => { const D = DATE[w]; if (t === 'flirt') return G.aff[w] >= 18 ? 'love' : G.aff[w] >= 11 ? 'like' : 'dislike'; return D.tl.includes(t) ? 'love' : D.tk.includes(t) ? 'like' : D.td.includes(t) ? 'dislike' : 'meh'; };
  const locsFor = G => Object.entries(LOCS).filter(([, l]) => (G.chap || 0) >= l.ch && (!l.until || G.chap <= l.until));
  const dateOutfit = (G, l) => l.of || ((G.chap >= 9 && G.chap <= 10) ? 'winter' : 'casual');

  function buildDate(cur, G0) {
    const { w, l, seed } = cur, L = LOCS[l], D = DATE[w], r = rng(seed), lp = locPref(w, l);
    const tops = shuffle(['work', 'food', 'hobbies', 'dreams', 'past', 'city', 'joke', 'flirt'], r);
    const rounds = [tops.slice(0, 3), tops.slice(3, 6), [tops[6], tops[7], 'quiet']];
    const S = [['bg', L.bg], ['fx', L.fx || null], ['music', 'date'], ['tint', l === 'rooftop' || l === 'snow' || l === 'festival' ? 'night' : 'evening'], ['wear', dateOutfit(G0, L)],
      ['n', L.intro], ['show', w, lp === 'love' ? 'excited' : lp === 'dislike' ? 'sweat' : 'smile', lp === 'love' ? 'cheer' : 'default', 'c'],
      ['say', w, D.loc[lp]], ['do', G => { G.date.s += lp === 'love' ? 3 : lp === 'like' ? 1 : -1; api.addAff(w, lp === 'love' ? 2 : lp === 'like' ? 1 : -1); }]];
    const PROMPT = ['What do you want to talk about?', 'The conversation drifts. Where do you steer it?', 'It\'s getting late. One more thing…'];
    rounds.forEach((opts, i) => {
      S.push(['t', PROMPT[i]]);
      S.push(['choice', opts.map(t => ({ t: TOPICS[t], then: [['do', G => {
        const p = topicPref(G, w, t), moody = G.mood && G.mood[w] === 'moody';
        G.date.s += { love: 3, like: 2, meh: 1, dislike: moody ? -2 : 0 }[p]; G.date.last = p;
        api.addAff(w, { love: 2, like: 1, meh: 0, dislike: moody ? -2 : -1 }[p]);
      }], ...topicLines(w, t)] }))]);
    });
    S.push(['n', L.moment.replace(/\{w\}/g, api.WHO[w].n)]);
    if (L.cg && Art.CG_NAMES[L.cg + w]) S.push(['cg', L.cg + w], ['wait', 2600], ['cgoff']);
    S.push(['if', G => G.date.s >= 9, [['emo', w, 'love', 'heart'], ['say', w, D.end[0]], ['do', G => { api.addAff(w, (G.mood && G.mood[w] === 'cheer') ? 2 : 1); G.date.great = 1; }]], [['emo', w, 'smile', 'wave'], ['say', w, D.end[1]]]]);
    S.push(['do', G => finishDate(G)], ['photo'], ['hideall'], ['wear', null], ['fx', null]);
    return S;
  }
  function topicLines(w, t) {
    const x = DATE[w].t[t];
    if (t === 'flirt') return [['if', G => G.aff[w] >= 11, [['say', w, x[2], x[3]]], [['say', w, x[0], x[1]]]]];
    return [['say', w, x[0], x[1]]];
  }
  function startDate(G, w, l) { G.date = { w, l, seed: (G.day * 977 + Object.keys(G.date || {}).length * 31 + (Math.random() * 1e6 | 0)) >>> 0, s: 0 }; return buildDate(G.date, G); }
  function finishDate(G) {
    const d = G.date, L = LOCS[d.l], ph = { w: d.w, l: d.l, day: d.day || G.day, e: d.great ? 'love' : 'happy', of: dateOutfit(G, L), great: !!d.great, cap: `${L.n} · Day ${G.day}` };
    G.album = (G.album || []).concat([ph]); G.dates = (G.dates || 0) + 1; G.morale = clamp((G.morale || 60) + 3, 0, 100);
    api.meta.album = api.meta.album || {}; api.meta.album[d.w + ':' + d.l] = ph; api.meta.stats.dates++; api.saveMeta();
    api.unlock('date1'); if (G.dates >= 10) api.unlock('dates10'); if (Object.keys(api.meta.album).length >= 10) api.unlock('album');
    journal(G, `Date with ${api.WHO[d.w].n} at ${L.n}.${d.great ? ' It went really well.' : ''}`);
  }
  const photoArt = ph => `${Art.bg(LOCS[ph.l].bg)}<div class="pch">${Art.char(ph.w, ph.e, ph.great ? 'heart' : 'wave', false, ph.of)}</div>`;
  function photoHtml(ph, big, lazy) {
    return `<div class="pol ${big ? 'big' : ''}"><div class="pimg" ${lazy ? `data-ph='${JSON.stringify(ph).replace(/'/g, '&#39;')}'>` : '>' + photoArt(ph)}</div><p>${ph.cap}${ph.great ? ' ♥' : ''}</p></div>`;
  }
  const fillLazy = root => root && root.querySelectorAll('.pimg[data-ph]').forEach((e, i) => setTimeout(() => { if (e.isConnected) { e.innerHTML = photoArt(JSON.parse(e.dataset.ph)); e.removeAttribute('data-ph'); } }, 30 + i * 45));

  // ---------- extra codex entries, achievements ----------
  const CODEX = {};
  Object.entries(NEMESES).forEach(([k, v]) => { CODEX['nem_' + k] = { cat: 'Nemeses', t: `${v.icon} ${v.n}`, body: `${v.d}<br><br><i>“${v.taunt[0]}”</i><br><br>${v.caught}` }; });
  const ACH = {
    date1: ['First Date', 'Go on a date'], dates10: ['Heartbreaker', 'Go on 10 dates'], album: ['Shutterbug', 'Collect 10 different date photos'],
    perk: ['Specialist', 'Choose a hero perk'], gear: ['Geared Up', 'Equip gear on 4 heroes'], hq1: ['Renovator', 'Buy an HQ upgrade'], hqmax: ['Home Base', 'Max out an HQ upgrade'],
    nemesis: ['Most Wanted', 'Capture a nemesis'], nemall: ['Clean Streets', 'Capture every nemesis'], chain: ['Chain Breaker', 'Complete an incident chain'],
    breach: ['Netrunner', 'Breach with a perfect sequence'], rhythm_s: ['Encore!', 'Get an S grade on stage'], streak10: ['On Fire', 'Resolve 10 calls in a row'],
    objectives: ['Overachiever', 'Complete both shift objectives'], morale: ['High Spirits', 'Reach 90 morale'], bond3: ['Partners', 'Reach Bond Lv 3 with a pair'],
    birthday: ['Many Happy Returns', 'Give a gift on a hero\'s birthday'], dinner: ['Family Dinner', 'Host a squad dinner'], sidejob: ['Old Habits', 'Work a konbini night shift'],
    skills: ['Handler Protocol', 'Use all four Handler skills'], escalate: ['Damage Control', 'Resolve an escalated call'], stat10: ['Maxed Out', 'Raise a stat to 10']
  };

  return { init, rng, shuffle, PERKS, PERK_LV, findPerk, perksOf, perkDue, GEAR, bestStat, HQ, HQCOST, hq, WEATHER, rollWeather, NEMESES, nemesisCall, CHAINS, chainFor,
    objectives, objOk, SKILLS, skillCharges, stat, bonus, pairKey, pairLv, travelMul, restMul, injMul, xpMul, credMul, expMul, MOOD, BDAY, dayStart, journal,
    breach, reflex, rhythm, LOCS, TOPICS, DATE, DATE_MIN, locPref, locsFor, startDate, buildDate, photoHtml, fillLazy, CODEX, ACH, auto: false };
})();

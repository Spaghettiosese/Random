// 2.3 balance: France breaks when Paris falls; China trades space for time and never gives in while it holds the interior.
'use strict';
// France: a centralised state whose will to fight collapsed with the fall of Paris. Once Paris is in enemy hands the
// government asks for an armistice when about a third of the country is lost, later if the nation is resolute (war
// support) and the cabinet is confident, sooner if the cabinet is in crisis.
function frBreak(c) { const F = c.fr ? c.fr.conf : 45; return clamp(0.3 + Math.max(0, c.ws - 40) / 320 + (F - 45) / 600 + (M(c, 'caplimit') || 0) * 0.5 - (hasSpirit(c, 'cabinet_crisis') ? 0.04 : 0), 0.24, 0.55); }
// China: no surrender while the government holds part of the interior, unless almost everything is gone
const CN_INTERIOR = ['Chongqing', 'Chengdu', 'Kunming', 'Guiyang', "Xi'an", 'Lanzhou', 'Changsha', 'Nanning', 'Hengyang', 'Yan\'an', 'Hanzhong', 'Guilin'];
const cnHoldsInterior = () => CN_INTERIOR.some(n => { const p = PN(n); return p && (p.ctrl === 'CHI' || (friendly('CHI', p.ctrl) && !atWar('CHI', p.ctrl))); });
{ const _cc = checkCapitulation; checkCapitulation = function (tag) { const c = C(tag); if (!c || !c.exists || c.capitulated || !isAtWar(tag)) return _cc(tag);
  if (tag === 'CHI' && cnHoldsInterior() && capInfo('CHI').prog < 0.9) return;
  if (tag === 'FRA') { const paris = PN('Paris'); if (paris && atWar('FRA', paris.ctrl) && capInfo('FRA').prog >= frBreak(c)) { logMsg('With Paris fallen and the armies broken, the French government asks for an armistice.', 'world', ['FRA']); return capitulate(tag); } }
  return _cc(tag); }; }
// the Chinese government moves inland when its capital falls: to Wuhan, then to Chongqing, as in 1937 and 1938
function cnRelocate() { const c = C('CHI'); if (!c || !c.exists || c.capitulated) return; const cap = P(c.capital); if (!cap || !atWar('CHI', cap.ctrl)) return;
  const held = n => { const p = PN(n); return p && p.ctrl === 'CHI' && p.owner === 'CHI' ? p : null; };
  const to = held('Chongqing') && (!held('Wuhan') || year() >= 1938) ? held('Chongqing') : held('Wuhan') || held('Chongqing') || CN_INTERIOR.map(held).find(Boolean) || G.P.filter(p => p.owner === 'CHI' && p.ctrl === 'CHI').sort((a, b) => b.vp - a.vp)[0];
  if (!to || to.id === c.capital) return; const from = cap.name; c.capital = to.id; logMsg(`With ${from} lost, the Chinese government moves to ${to.name} and fights on.`, 'world', ['CHI', 'JAP']); }
{ const _pd = playDaily; playDaily = function () { _pd(); if (G.day % 7 === 5) cnRelocate(); }; }
// The Phoney War on the German side: in historical games the German army stays on the defensive in the West until the
// tenth of May 1940, while it fights in Poland and Scandinavia; then Fall Gelb begins (majors22.js) and France breaks.
const WEST = ['FRA', 'BEL', 'HOL', 'LUX', 'ENG'];
{ const _aa = aiArmies; aiArmies = function (tag) { _aa(tag); const k = C(tag); if (!G.historical || tag !== 'GER' || !k || !k.ai || G.day >= mjDay(1940, 5) + 9) return;
  for (const a of armiesOf(tag)) { if (!a.auto || !a.path.length) continue; const q = P(a.path[0]); if (!atWar(tag, q.ctrl) || q.owner === 'GER' || q.cores.includes('GER')) continue; const o = C(q.owner);
    if (WEST.includes(q.owner) || (o && WEST.includes(o.overlord))) { if (a.battle) leaveBattle(a); a.path = []; a.prog = 0; } } }; }
// and the Allies sit behind the Maginot Line: no AI offensive into Germany before Fall Gelb (the Saar offensive of 1939
// went eight kilometres and came back)
{ const _aa = aiArmies; aiArmies = function (tag) { _aa(tag); const k = C(tag); if (!G.historical || G.flags.gelb || !k || !k.ai || !WEST.includes(tag.slice(0, 3)) || G.day < mjDay(1939, 1)) return;
  for (const a of armiesOf(tag)) { if (!a.auto || !a.path.length) continue; const q = P(a.path[0]); if (!atWar(tag, q.ctrl) || q.owner === tag || q.cores.includes(tag)) continue; if (q.owner === 'GER' || q.cores.includes('GER')) { if (a.battle) leaveBattle(a); a.path = []; a.prog = 0; } } }; }
// Fall Weiss: in historical games the war on Poland begins on the first of September 1939, whatever the focus tree's pace
{ const _pd = playDaily; playDaily = function () { _pd(); if (!G.historical || G.day < mjDay(1939, 9) || G.day > mjDay(1940, 6) || !ok('GER') || !ok('POL') || !C('GER').ai || atWar('GER', 'POL') || C('POL').overlord || G.flags.fallWeiss) return;
  G.flags.fallWeiss = G.day; G.plays = (G.plays || []).filter(pl => !(pl.a === 'GER' && pl.b === 'POL'));
  const goal = { by: 'GER', vs: 'POL', type: 'take', provs: ['Danzig', 'Poznań', 'Katowice', 'Bydgoszcz', 'Łódź'].map(n => PNAME[n]).filter(i => i !== undefined) };
  const w = declareWar('GER', 'POL', [goal], null, false); if (w) logMsg('Fall Weiss: the German army crosses the Polish border at dawn.', 'world', ['GER', 'POL']); }; }
// the first weeks of a blitzkrieg: in historical games the opening offensives against Poland (September 1939) and
// in the West (May and June 1940) break through far faster than later fighting
const BLITZ = () => { if (!G.historical) return null; const d = G.day; if (G.flags.fallWeiss && d < G.flags.fallWeiss + 42) return ['POL']; const s = G.flags.gelb; if (s && d < s + 56) return ['FRA', 'BEL', 'HOL', 'LUX', 'ENG']; return null; };
{ const _rb = resolveBattle; resolveBattle = function (b) { const B = BLITZ(), a0 = G.armies[b.att[0]]; if (B && a0 && a0.owner === 'GER' && G.battles.includes(b)) { const p = P(b.prov); if (B.includes(p.ctrl) || B.includes(p.owner)) b.push = (b.push || 0) + (B[0] === 'POL' ? 0.015 : 0.03); } return _rb(b); }; }
// Fall Gelb, 10 May 1940: in historical games the German AI waits for it to attack the Low Countries, then strikes them
// and France at once; for eight weeks it attacks in the West at odds it would otherwise refuse, and the French line
// opposite the Ardennes is caught unready
const GELB = () => mjDay(1940, 5) + 9;
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { if (G.historical && a === 'GER' && ['BEL', 'HOL', 'LUX'].includes(b) && C('GER') && C('GER').ai && G.day < GELB()) return null; return _dw(a, b, ...r); }; }
function aiAtkMul(tag, q) { if (!G.historical || tag !== 'GER' || !G.flags.gelb || G.day > G.flags.gelb + 56) return 1; return WEST.includes(q.ctrl) || WEST.includes(q.owner) ? 0.6 : 1; }
{ const _pd = playDaily; playDaily = function () { _pd(); if (!G.historical || G.flags.gelb || G.day < GELB() || !ok('GER') || !C('GER').ai || !ok('FRA') || !atWar('GER', 'FRA') || C('FRA').capitulated) return;
  G.flags.gelb = G.day; const g = C('GER'); lowCountries(g); if (!hasSpirit(g, 'blitzkrieg')) addSpirit(g, 'blitzkrieg', 150);
  // the Ardennes: the French divisions along the Meuse are reservists, spread thin, and not expecting armour
  for (const n of ['Sedan', 'Reims', 'Saint-Quentin', 'Lille', 'Amiens']) { const p = PN(n); if (!p) continue; for (const a of armiesAt(p.id)) if (a.owner === 'FRA') for (const d of a.divs) d.org = Math.min(d.org, 0.45); }
  logMsg('Fall Gelb: German armour pours through the Ardennes towards Sedan and the sea.', 'world', ['GER', 'FRA', 'BEL', 'HOL', 'LUX', 'ENG']); }; }
// Italian non-belligerence: in historical games an AI Italy stays out of the war against Poland, France and Britain
// until the tenth of June 1940, when France is falling; then it declares war on both
const ITA_ENTRY = () => mjDay(1940, 6) + 9, histIta = () => G.historical && C('ITA') && C('ITA').ai && G.day < ITA_ENTRY();
{ const _jw = joinWar; joinWar = function (w, t, side) { if (t === 'ITA' && histIta() && (side === 'att' ? w.def : w.att).some(x => ['FRA', 'ENG', 'POL'].includes(x.slice(0, 3)))) return; return _jw(w, t, side); }; }
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { if (a === 'ITA' && histIta() && ['FRA', 'ENG', 'POL'].includes(b.slice(0, 3))) return null; return _dw(a, b, ...r); }; }
{ const _pd = playDaily; playDaily = function () { _pd(); if (!G.historical || G.flags.itaEntry || G.day < ITA_ENTRY() || !ok('ITA') || !C('ITA').ai || C('ITA').ideology !== 'fas' || !ok('GER') || !ok('FRA') || C('FRA').capitulated || !atWar('GER', 'FRA') || atWar('ITA', 'FRA')) return;
  if (!G.flags.gelb || capInfo('FRA').prog < 0.08) return; G.flags.itaEntry = G.day; FNS.itaJoinWar[0](C('ITA')); if (atWar('ITA', 'FRA')) logMsg('Italy declares war on France and Britain. "The hand that held the dagger has struck it into the back of its neighbour."', 'world', ['ITA', 'FRA', 'ENG']); }; }
// the Balkans in their time: in historical games an AI Italy attacks Greece no earlier than 28 October 1940 (and
// Yugoslavia and Turkey not before then), and an AI Germany is drawn into wars against Greece, Yugoslavia or Turkey
// no earlier than April 1941 (Operation Marita)
const BALKAN = ['GRE', 'YUG', 'TUR'];
{ const _dw = declareWarInner; declareWarInner = function (a, b, ...r) { if (G.historical && C(a) && C(a).ai && BALKAN.includes(b.slice(0, 3)) && ((a === 'ITA' && G.day < mjDay(1940, 10) + 27) || (a === 'GER' && G.day < mjDay(1941, 4) + 5))) return null; return _dw(a, b, ...r); }; }
{ const _jw = joinWar; joinWar = function (w, t, side) { if (G.historical && t === 'GER' && C('GER') && C('GER').ai && G.day < mjDay(1941, 4) + 5 && (side === 'att' ? w.def : w.att).some(x => BALKAN.includes(x.slice(0, 3))) && !(side === 'att' ? w.def : w.att).some(x => atWar('GER', x))) return; return _jw(w, t, side); }; }
// 17 September 1939: in historical games the Soviet Union invades eastern Poland under the secret protocol
const SOV_POL = ['Wilno', 'Grodno', 'Białystok', 'Lida', 'Baranowicze', 'Pinsk', 'Brest-Litovsk', 'Równe', 'Łuck', 'Lwów', 'Tarnopol', 'Stanisławów'];
{ const _pd = playDaily; playDaily = function () { _pd(); if (!G.historical || G.flags.sovPol || G.day < mjDay(1939, 9) + 16 || G.day > mjDay(1940, 3) || !ok('SOV') || !ok('POL') || !C('SOV').ai || !atWar('GER', 'POL') || atWar('SOV', 'POL') || atWar('SOV', 'GER') || C('POL').capitulated) return;
  G.flags.sovPol = G.day; const w = declareWar('SOV', 'POL', [{ by: 'SOV', vs: 'POL', type: 'take', provs: SOV_POL.map(n => PNAME[n]).filter(i => i !== undefined) }], null, true);
  if (w) logMsg('The Red Army crosses the Polish frontier in the east "to protect the Ukrainian and Belorussian brothers".', 'world', ['SOV', 'POL']); }; }
// Poland breaks when Warsaw falls and the country is overrun, sooner once the Soviets attack too
{ const _cc = checkCapitulation; checkCapitulation = function (tag) { const c = C(tag); if (tag === 'POL' && c && c.exists && !c.capitulated && isAtWar('POL')) { const wa = PN('Warsaw'), pr = capInfo('POL').prog, sov = ok('SOV') && atWar('SOV', 'POL');
    if ((wa && atWar('POL', wa.ctrl) && pr >= 0.55) || (sov && pr >= 0.5)) return capitulate(tag); } return _cc(tag); }; }
// Sea Lion was never launched: in historical games the German AI does not invade the British Isles
const UK_HOME = ['London', 'Birmingham', 'Manchester', 'Cardiff', 'Glasgow', 'Belfast', 'Plymouth', 'Southampton', 'Norwich', 'Newcastle', 'Leeds', 'Edinburgh', 'Aberdeen', 'Inverness', 'Liverpool', 'Bristol', 'Dover', 'Kirkwall'];
const noSeaLion = (owner, p) => G.historical && owner === 'GER' && C('GER') && C('GER').ai && p && p.cores.includes('ENG') && UK_HOME.includes(p.name);
{ const _li = launchInvasion; launchInvasion = function (a, to) { if (a && noSeaLion(a.owner, P(to))) return false; return _li(a, to); }; }
{ const _aa = aiArmies; aiArmies = function (tag) { _aa(tag); if (tag !== 'GER' || !G.historical) return; for (const a of armiesOf(tag)) { if (!a.path.length) continue; const q = P(a.path[0]), e = NB[a.loc].find(x => x.to === q.id); if (e && e.sea && noSeaLion(tag, q)) { if (a.battle) leaveBattle(a); a.path = []; a.prog = 0; } } }; }
// the lesser Axis stayed out of the war in the West: in historical games an AI nation other than Germany and Italy does
// not join a war against Poland, France, Britain or the Low Countries before June 1940, and Germany's friends keep
// their armies out of the West until Fall Gelb as Germany does
const WEST_WAR = ['POL', 'FRA', 'ENG', 'BEL', 'HOL', 'LUX'];
{ const _jw = joinWar; joinWar = function (w, t, side) { const k = C(t); if (G.historical && k && k.ai && !['GER', 'ITA', 'SOV'].includes(t) && k.overlord !== 'GER' && G.day < mjDay(1940, 6) + 9 && !(side === 'att' ? w.att : w.def).some(x => WEST_WAR.includes(x.slice(0, 3)))
    && (side === 'att' ? w.def : w.att).some(x => WEST_WAR.includes(x.slice(0, 3)))) return; return _jw(w, t, side); }; }
{ const _aa = aiArmies; aiArmies = function (tag) { _aa(tag); const k = C(tag); if (!G.historical || G.flags.gelb || !k || !k.ai || tag === 'GER' || !ok('GER') || !friendly(tag, 'GER')) return;
  for (const a of armiesOf(tag)) { if (!a.path.length) continue; const q = P(a.path[0]), o = C(q.owner); if (!atWar(tag, q.ctrl) || q.owner === tag) continue; if (WEST.includes(q.owner) || (o && WEST.includes(o.overlord))) { if (a.battle) leaveBattle(a); a.path = []; a.prog = 0; } } }; }

// 2.1 fog of war, and other nations' focus trees.
// Foreign armies are seen only where we or our allies have eyes: our own and allied land and the provinces next to it,
// next to our armies, or everywhere a spy network of 50% or more watches that nation. Allies and subjects are always seen.
// Any nation's focus tree can be read, but never what they have done or are doing.
'use strict';
RULE_OPT.openmap = ['Open map', 'No fog of war: every army in the world is visible'];
const SIGHT = { g: null, day: -1, pl: null, set: null };
function sightSet() {
  if (SIGHT.g === G && SIGHT.day === G.day && SIGHT.pl === G.player && SIGHT.set) return SIGHT.set;
  const pl = G.player, s = new Set(), eyes = t => t === pl || friendly(pl, t);
  for (const p of G.P) if (eyes(p.ctrl)) { s.add(p.id); for (const e of NB[p.id]) if (!e.sea || e.sea < 250) s.add(e.to); }
  for (const id in G.armies) { const a = G.armies[id]; if (eyes(a.owner)) { s.add(a.loc); for (const e of NB[a.loc]) if (!e.sea) s.add(e.to); } }
  for (const b of G.battles) { const a0 = G.armies[b.att[0]]; if (a0 && eyes(a0.owner)) s.add(b.prov); }
  Object.assign(SIGHT, { g: G, day: G.day, pl, set: s }); return s;
}
const fogOff = () => !G || !G.player || (G.rules && G.rules.opt && G.rules.opt.openmap);
function armySeen(a) {
  if (fogOff()) return true; const pl = G.player; if (a.owner === pl || friendly(pl, a.owner)) return true;
  const c = C(pl); if (c && typeof netOf === 'function' && netOf(c, a.owner) >= 50) return true; return sightSet().has(a.loc);
}
const provSeen = id => fogOff() || sightSet().has(id);
// ---------- other nations' focus trees ----------
function focusGhost(t) { const k = C(t); const g = Object.create(k); g.focus = { cur: null, prog: 0, done: {}, queue: [], pick: {} }; return g; }
{ const _pf = PANELS.focus; PANELS.focus = function (c) {
  const v = UI.focusView && UI.focusView !== c.tag && ok(UI.focusView) ? UI.focusView : null;
  const pick = `<div class="row sp fview"><span class="dim">${v ? `Reading the focus tree of <b>${cn(v)}</b>. What they have done, and what they are doing now, is secret.` : 'Our own national focus tree.'}</span>
    <select data-ch="focusView"><option value="">Our own tree</option>${alive().filter(k => k.tag !== c.tag && !/\d$/.test(k.tag) && (TREES[k.tag] || k.major)).sort((a, b) => (b.major - a.major) || a.name.localeCompare(b.name)).map(k => `<option value="${k.tag}"${k.tag === v ? ' selected' : ''}>${k.name}${TREES[k.tag] ? ' · ' + TREES[k.tag].length : ''}</option>`).join('')}</select></div>`;
  if (!v) return pick + _pf(c);
  let h = _pf(focusGhost(v));
  // a foreign tree is for reading only: no buttons to start or plan, and no claim about their progress
  h = h.replace(/<button[^>]*data-a="(focusStart|focusQ|focusUnq)"[^>]*>[\s\S]*?<\/button>/g, '').replace(/<span class="warn">No focus in progress[\s\S]*?<\/span>/, '<span class="dim">Their progress is unknown.</span>');
  return pick + h; }; }
Object.assign(CHG, { focusView(el) { UI.focusView = el.value || null; UI.focusSel = null; UI.focusJump = null; renderPanel(); } });
{ const _rp = renderPanel; renderPanel = function () { _rp(); if (UI.tab === 'focus' && UI.focusView && UI.focusView !== G.player && ok(UI.focusView) && !UI._fvJumped) { const t = TREES[UI.focusView] || focusTree(C(UI.focusView)); if (t && t[0]) { UI._fvJumped = true; focusJumpTo(t[0].id); } } if (!UI.focusView) UI._fvJumped = false; }; }
// switching back to our own tree, or to the other tab, forgets the jump
{ const _fv = CHG.focusView; CHG.focusView = el => { UI._fvJumped = false; _fv(el); }; }

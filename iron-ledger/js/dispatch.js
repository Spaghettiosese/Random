// Dispatches (1.6): the message system. Nothing stops the clock unless it truly must.
//  - World news and reports are headlines in a ticker: they never pause the game.
//  - Decisions wait in a tray with a deadline; the cabinet decides if you do not. Only ultimatums, calls to arms and peace terms interrupt.
//  - Toasts are filtered by category and collapse when they repeat.
'use strict';
const MSG_CATS = {
  battle: ['Our battles', 1], prov: ['Provinces won and lost in our wars', 1], provw: ['Provinces changing hands in other wars', 0],
  war: ['Declarations of war', 1], cap: ['Capitulations, annexations and peace', 1], pact: ['Treaties between other nations', 0], law: ['Laws and elections abroad', 0],
  aid: ['Aid and volunteers abroad', 0], play: ['Crises and demands abroad', 1], own: ['Our own focuses, research and laws', 1], other: ['Everything else that concerns us', 1], world: ['Other world events', 0]
};
const MSG = (() => { let s = {}; try { s = JSON.parse(localStorage.getItem('ironledger_msgs') || '{}'); } catch (e) { } const o = { decide: 'tray', cats: {} }; for (const k in MSG_CATS) o.cats[k] = s.cats && k in s.cats ? s.cats[k] : MSG_CATS[k][1]; if (s.decide) o.decide = s.decide; return o; })();
const msgSave = () => { try { localStorage.setItem('ironledger_msgs', JSON.stringify(MSG)); } catch (e) { } };
function msgCat(text, kind, tags) {
  const pl = C(G.player), t = String(text).replace(/<[^>]+>/g, ''), mine = (tags || []).includes(G.player) || (pl && (t.includes(pl.name) || t.includes(pl.adj + ' ')));
  if (kind === 'focus' || kind === 'tech') return 'own';
  if (/breaks through|is repulsed|encircled and destroyed|land at|thrown back/.test(t)) return mine ? 'battle' : 'provw';
  if (/falls to|liberates|base area at/.test(t)) return mine ? 'prov' : 'provw';
  if (/declares war|joins the .* against|has become a world war/.test(t)) return 'war';
  if (/capitulates|annexes|is over\.|white peace|restored as|is absorbed|breaks away/.test(t)) return 'cap';
  if (/military aid|volunteers arrive/.test(t)) return mine ? 'other' : 'aid';
  if (/Diplomatic play|backs down|in the crisis|Border conflict|border conflict/.test(t)) return mine ? 'other' : 'play';
  if (/enacts|Election in|takes power/.test(t)) return mine ? 'own' : 'law';
  if (/sign a|signs |guarantees|joins the|becomes a subject|embargo/.test(t)) return mine ? 'other' : 'pact';
  return mine ? 'other' : 'world';
}
// ---------- toasts: filtered, and repeated ones collapse ----------
const _lastToast = {};
function notifyFiltered(text, kind, tags) {
  if (!G || !UI.started) return toast(text, kind); const cat = tags === undefined && kind !== 'world' ? 'other' : msgCat(text, kind, tags); if (!MSG.cats[cat]) return;
  const now = performance.now(), l = _lastToast[cat];
  if (l && now - l.t < 5000 && l.el.isConnected) { l.n++; l.t = now; l.el.innerHTML = `${text} <span class="dim">+${l.n - 1} more</span>`; return; }
  toast(text, kind); const el = $('toasts').firstChild; if (el) _lastToast[cat] = { el, n: 1, t: now };
}
// ---------- headlines ----------
const HEAD = { q: [], cur: null, open: false, t: 0 };
const GENERIC_NEWS = /Annexes|Declares War on|Capitulates$|^Civil War in|Proclaimed$/;
function feedPush(it) {
  G.feed = G.feed || []; const generic = it.generic, last = G.feed.slice(-6).reverse().find(f => G.day - f.d <= 10 && f.actors && it.actors && f.actors.some(a => it.actors.includes(a)));
  if (last) { // one happening, one headline
    if (generic && !last.generic) { last.text += `<br><span class="dim">${it.title}.</span>`; return null; }
    if (generic && last.generic && G.day - last.d <= 2 && last.actors[0] === it.actors[0]) { last.text += `<br><b>${it.title}.</b> ${it.text}`; last.more = (last.more || 0) + 1; if (HEAD.cur === last || HEAD.q.includes(last)) renderTicker(); return null; }
    if (!generic && last.generic && G.day - last.d <= 4) { Object.assign(last, { title: it.title, text: it.text + `<br><span class="dim">${last.title}.</span>`, icon: it.icon, generic: false }); if (HEAD.cur === last) renderTicker(); return null; }
  }
  it.d = G.day; G.feed.push(it); if (G.feed.length > 80) G.feed.shift(); return it;
}
function headline(it, quiet) { const f = feedPush(it); if (!f || quiet || G.news === false) return; HEAD.q.push(f); if (HEAD.q.length > 6) HEAD.q.shift(); if (!HEAD.cur) nextHeadline(); else renderTicker(); }
function nextHeadline() { HEAD.cur = HEAD.q.shift() || null; HEAD.open = false; HEAD.t = performance.now(); renderTicker(); }
function renderTicker() {
  let el = $('ticker'); if (!el) { el = document.createElement('div'); el.id = 'ticker'; $('mapwrap').appendChild(el); } const h = HEAD.cur; if (!h) { el.hidden = true; return; } el.hidden = false; el.className = HEAD.open ? 'open' : '';
  el.innerHTML = `<div class="thead" data-a="headOpen"><span class="ico">${h.icon || '📰'}</span><div class="tt"><div class="newsline">${h.report ? 'Report' : 'World news'} · ${dateStr(h.d)}${HEAD.q.length ? ` · ${HEAD.q.length} more` : ''}</div><b>${h.title}</b></div><button class="sm" data-a="headNext" aria-label="Dismiss">${HEAD.q.length ? '›' : '✕'}</button></div>${HEAD.open ? `<div class="tbody">${h.text}</div>` : ''}`;
}
setInterval(() => { if (HEAD.cur && !HEAD.open && performance.now() - HEAD.t > (HEAD.q.length ? 6000 : 11000)) nextHeadline(); }, 1000);
const nearUs = t => { const k = C(G.player), o = C(t); if (!k || !o || !o.exists) return false; return o.major || t === G.player || friendly(k.tag, t) || atWar(k.tag, t) || kmBetween(k.capital, o.capital) < 2600; };
worldNews = function (title, text, icon, skip = []) {
  if (!G || G.day < 1) return; const pl = C(G.player); if (!pl || pl.ai || !pl.exists) return; const generic = GENERIC_NEWS.test(title), mine = skip.includes(G.player);
  // the nations involved already know; small far-away events go to the News tab only
  const quiet = mine || (generic && !skip.some(nearUs)) || (generic && /Annexes/.test(title) && !skip.some(t => t === G.player) && skip.every(t => !C(t).major));
  headline({ title, text, icon: icon || '📰', actors: skip.slice(), generic }, quiet);
};
// ---------- the decision tray ----------
const TRAY = [];
const URGENT = /^An Ultimatum$|^They Refuse$|^A Call to Arms$|^Peace with |^The End$/;
let _inTick = false;
{ const _ht = hourTick; hourTick = function () { _inTick = true; try { _ht(); if (G.hour === 0) trayDaily(); } finally { _inTick = false; } }; }
function modalNow(p) { UI.popups.push(p); showPopup(); }
function routePopup(p) {
  if (!_inTick || p.modal || MSG.decide === 'modal' && p.options.length > 1 || URGENT.test(p.title || '')) return modalNow(p); // things the player asked for, and things that cannot wait
  if (p.options.length <= 1) { const o = p.options[0]; if (o && o.fn) { try { o.fn(); } catch (e) { console.error(e); } } headline({ title: p.title, text: p.desc + (o && o.tip ? `<div class="dim">${o.tip}</div>` : ''), icon: p.icon || '📜', report: true }); return; }
  const k = { p, until: G.day + (p.days || 30), def: Math.min(p.options.length - 1, p.def || 0), d: G.day }; TRAY.push(k);
  if (MSG.decide === 'pause') { G.paused = true; renderTop(); } toast(`<b>Decision:</b> ${p.title} <span class="dim">· ${k.until - G.day} days to answer</span>`, 'focus'); renderTray();
}
function trayDaily() {
  let ch = false; for (const k of TRAY.slice()) if (G.day >= k.until) { TRAY.splice(TRAY.indexOf(k), 1); const o = k.p.options[k.def]; try { if (o.fn) o.fn(); } catch (e) { console.error(e); } toast(`<b>${k.p.title}:</b> the cabinet decided for us — “${o.name}”`, 'info'); ch = true; }
  if (ch || TRAY.length) renderTray();
}
function renderTray() {
  let el = $('tray'); if (!el) { const col = document.createElement('div'); col.id = 'dispatch'; el = document.createElement('div'); el.id = 'tray'; const t = $('toasts'); t.parentNode.insertBefore(col, t); col.appendChild(el); col.appendChild(t); }
  el.innerHTML = TRAY.map((k, i) => { const left = k.until - G.day; return `<button class="tritem${left <= 5 ? ' soon' : ''}" data-a="trayOpen" data-i="${i}"${tip(`${k.p.options.length} options. If you do not answer in ${left} days the cabinet chooses “${k.p.options[k.def].name}”.`)}><span class="ico">${k.p.icon || '📜'}</span><span class="tt">${k.p.title}</span><span class="num">${left}d</span></button>`; }).join('');
}
Object.assign(ACT, {
  trayOpen(d) { const k = TRAY[+d.i]; if (!k) return; TRAY.splice(+d.i, 1); const p = Object.assign({}, k.p, { options: k.p.options.concat([{ name: 'Decide later', tip: `${k.until - G.day} days remain`, fn: () => { TRAY.push(k); renderTray(); } }]) }); UI.popups.unshift(p); showPopup(); renderTray(); },
  headOpen() { HEAD.open = !HEAD.open; HEAD.t = performance.now(); renderTicker(); }, headNext(d, el, ev) { if (ev) ev.stopPropagation(); nextHeadline(); },
  feedOpen(d) { const f = (G.feed || [])[+d.i]; if (!f) return; HEAD.cur = f; HEAD.open = true; HEAD.t = performance.now(); renderTicker(); },
  msgCat(d) { MSG.cats[d.k] = MSG.cats[d.k] ? 0 : 1; msgSave(); ACT.messages(); }, msgDecide(d) { MSG.decide = d.k; msgSave(); ACT.messages(); },
  messages() { UI.popups = UI.popups.filter(p => !p.msgs); UI.popups.unshift({ msgs: true, modal: true, title: 'Messages', icon: '✉️', desc: `<div class="dim">World news and reports never stop the clock: they appear as headlines above the map and are kept in the News tab.</div>
    <h4>When a decision arrives</h4><div class="row">${[['tray', 'Keep playing', 'It waits in the tray with a deadline'], ['pause', 'Pause the game', 'The clock stops; open it from the tray'], ['modal', 'Open it at once', 'The old behaviour']].map(x => btn(x[1], 'msgDecide', `data-k="${x[0]}"`, 'sm' + (MSG.decide === x[0] ? ' on' : ''), x[2])).join('')}</div>
    <h4>Show as pop-up notes</h4><div class="msggrid">${Object.keys(MSG_CATS).map(k => `<button class="sm${MSG.cats[k] ? ' on' : ''}" data-a="msgCat" data-k="${k}">${MSG.cats[k] ? '✓' : '·'} ${MSG_CATS[k][0]}</button>`).join('')}</div><div class="dim">Everything is always written to the News tab.</div>`, options: [{ name: 'Done' }] }); showPopup(); }
});
const installDispatch = () => { UIH.notify = notifyFiltered; UIH.popup = routePopup; };
installDispatch();
// crises far from home are news, not questions; and one aggressor asks only once a season
{ const _cp = crisisPrompt; crisisPrompt = function (pl) {
  const k = C(G.player); if (!k || k.ai || !k.exists || pl.a === k.tag || pl.b === k.tag) return _cp(pl); const last = (G.crisisAsked = G.crisisAsked || {})[pl.a] || -999;
  const stake = C(pl.b).major || kmBetween(k.capital, C(pl.b).capital) < 1500 || G.P.some(p => p.owner === pl.b && NB[p.id].some(e => !e.sea && P(e.to).owner === k.tag));
  if (!stake || G.day - last < 120) { if (C(pl.a).major) headline({ title: `${cname(pl.a)} Presses ${cname(pl.b)}`, text: `${cname(pl.a)} demands that ${cname(pl.b)} ${GOAL_TXT(pl.goal)}. They have ${pl.dur} days to yield or fight. You may still take a side from the Diplomacy tab.`, icon: '⚖️', actors: [pl.a, pl.b] }, !nearUs(pl.b)); return; }
  G.crisisAsked[pl.a] = G.day; return _cp(pl); }; }
// News tab: headlines first, then the full log
{ const _log = PANELS.log; PANELS.log = function (c) { const f = (G.feed || []).map((x, i) => [x, i]).reverse().slice(0, 25);
  return `<div class="row sp"><h3>Headlines</h3>${btn('✉ Message settings', 'messages', '', 'sm')}</div>${f.length ? f.map(([x, i]) => `<div class="feedrow" data-a="feedOpen" data-i="${i}"><span class="ico">${x.icon || '📰'}</span><span><b>${x.title}</b><div class="dim num">${dateStr(x.d)}${x.report ? ' · report' : ''}</div></span></div>`).join('') : '<div class="dim">No headlines yet.</div>'}<h3>Log</h3>` + _log(c); }; }
{ const _boot = boot; boot = function (...a) { const r = _boot(...a); installDispatch(); TRAY.length = 0; HEAD.q.length = 0; HEAD.cur = null; renderTicker(); renderTray(); return r; }; }

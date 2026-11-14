// 2.1 interface: each Balkan nation's own system on the Nation tab; ententes and resistance movements on the Diplomacy tab.
'use strict';
const pm = v => (v > 0 ? '+' : '') + v;
function balkanCard(c) {
  const t = c.tag;
  if (t === 'ROM') { const o = oilc(c), out = roOilOut(c);
    return `<div class="card"><div class="row sp"><b>🛢 The Oil Contracts</b><span class="dim">${fmt(out)} units a month from Ploiești</span></div>
      <div class="dim">Every great power wants our oil. Each contract pays differently, and every buyer grows fond of us. Oil kept at home fuels our own army (above 30%). Germany presses when it gets less than 35%.</div>
      ${Object.keys(RO_BUYERS).map(b => `<div class="row sp"><span${tip(RO_BUYERS[b][1])}>${b === 'home' ? '🇷🇴 ' + RO_BUYERS[b][0] : cn(b)}</span><span class="row">${bar(o[b] / 100, b === 'home' ? 'g' : '')}<span class="num">${o[b]}%</span>${b === 'home' ? '' : btn('−10', 'roOil', `data-b="${b}" data-d="-10"`, 'sm', '', !o[b]) + btn('+10', 'roOil', `data-b="${b}" data-d="10"`, 'sm', '', o.home < 10 || !ok(b) || atWar(b, t))}</span></div>`).join('')}
      <div class="row sp"><span${tip('Builds up while Germany gets less than 35% of our oil. At 60 Berlin delivers an ultimatum.')}>German pressure</span><span class="row">${bar((c.gerPress || 0) / 100, (c.gerPress || 0) > 40 ? 'r' : '')}<span class="num">${Math.round(c.gerPress || 0)}</span></span></div>
      <div class="dim">Sold last month: ${fmt(c.oilIncome || 0)}</div></div>`; }
  if (t === 'YUG') { const n = natOf(c), avg = sum(Object.keys(n), k => n[k]) / 5;
    return `<div class="card"><div class="row sp"><b>🧩 The Peoples of the Kingdom</b><span class="dim">average goodwill ${Math.round(avg)} ${avg > 58 ? '· Brotherhood and Unity' : avg < 38 ? '· the peoples pull apart' : ''}</span></div>
      <div class="dim">Goodwill below 25 brings unrest and radicalism to that people's lands. If the Croats fall below 15 in a war or a crisis, Croatia may break away. Civic citizenship slowly heals; ethnic citizenship divides.</div>
      ${Object.keys(NATS).map(k => `<div class="row sp"><span${tip(NATS[k][1].join(', '))}>${NATS[k][0]}</span><span class="row">${bar(n[k] / 100, n[k] < 25 ? 'r' : n[k] > 60 ? 'g' : '')}<span class="num">${Math.round(n[k])}</span>${k === 'serb' ? '' : btn('Concede', 'yugAct', `data-a2="concede" data-g="${k}"`, 'sm', YUG_ACT.concede[2] + ' 40 political power.', c.pp < 40)}${btn('Repress', 'yugAct', `data-a2="repress" data-g="${k}"`, 'sm', YUG_ACT.repress[2] + ' 20 political power.', c.pp < 20)}</span></div>`).join('')}
      <div class="row">${btn('Centralise in Belgrade', 'yugAct', 'data-a2="centralise" data-g="serb"', 'sm', YUG_ACT.centralise[2] + ' 30 political power.', c.pp < 30)}</div></div>`; }
  if (t === 'BUL') { const R = revOf(c);
    return `<div class="card"><div class="row sp"><b>🗺 The Lost Lands</b><span class="dim">claims lost in 1913 and 1919</span></div>
      <div class="dim">Each claim gathers progress from friendly relations with its owner, a great-power patron who dislikes the owner, our army's size and the owner's misfortunes. At 100 we demand the land, and an AI owner yields.</div>
      ${Object.keys(REV).map(k => { const r = R[k], own = revOwnerOf(k), done = r.done || own === t;
        return `<div class="card sub"><div class="row sp"><b>${REV[k][0]}</b><span class="dim">${REV[k][2].join(', ')} · held by ${own ? cn(own) : '—'}</span></div>
        <div class="row sp"><span>Progress</span><span class="row">${bar(r.p / 100, done ? 'g' : '')}<span class="num">${Math.round(r.p)}</span></span></div>
        ${done ? '<div class="dim">Recovered.</div>' : `<div class="row sp"><select data-ch="bgPatron" data-k="${k}"><option value="">Patron…</option>${PATRONS.filter(ok).map(p => `<option value="${p}"${r.patron === p ? ' selected' : ''}>${cname(p)}</option>`).join('')}</select>
          <span class="row">${Object.keys(REV_ACT).map(a => btn(REV_ACT[a][0], 'revAct', `data-k="${k}" data-a2="${a}"`, 'sm', `${REV_ACT[a][4]} Costs ${REV_ACT[a][1]} ${REV_ACT[a][2] === 'pp' ? 'political power' : 'influence'}.`, c[REV_ACT[a][2]] < REV_ACT[a][1])).join('')}</span></div>`}</div>`; }).join('')}</div>`; }
  if (t === 'GRE') { const f = fleetOf(c);
    return `<div class="card"><div class="row sp"><b>⚓ The Merchant Fleet</b><span class="dim">${fmt(f.ton * 10)} thousand tons · earned ${fmt(c.fleetIncome || 0)} last month</span></div>
      <div class="dim">Greek ships carry the world's cargo. Chartering to a power pays well and wins its friendship; a power at war pays more but loses our ships to submarines. Shipyards replace losses.</div>
      ${Object.keys(FLEET_BUY).map(b => `<div class="row sp"><span${tip(`Pays ${FLEET_BUY[b][1]} per ton a month`)}>${b === 'home' ? '🇬🇷 ' + FLEET_BUY[b][0] : cn(b)}${b !== 'home' && ok(b) && isAtWar(b) ? ' <span class="dim">(at war)</span>' : ''}</span><span class="row">${bar(f.ch[b] / 100, b === 'home' ? 'g' : '')}<span class="num">${f.ch[b]}%</span>${b === 'home' ? '' : btn('−10', 'grFleet', `data-b="${b}" data-d="-10"`, 'sm', '', !f.ch[b]) + btn('+10', 'grFleet', `data-b="${b}" data-d="10"`, 'sm', '', f.ch.home < 10 || !ok(b) || atWar(b, t))}</span></div>`).join('')}
      <div class="dim">The National Schism between Royalists and Venizelists is on the Politics tab.</div></div>`; }
  if (t === 'TUR') { const L = levOf(c), S = straitsOf(c), cd = c.turAidDay && G.day - c.turAidDay < 90 ? 90 - (G.day - c.turAidDay) : 0;
    return `<div class="card"><div class="row sp"><b>⚖️ Active Neutrality</b><span class="dim">${cd ? `next aid package in ${cd} days` : 'aid packages available'}</span></div>
      <div class="dim">Every bloc pays to keep Turkey friendly, and every package raises its leverage over us. A bloc at war that reaches 80 leverage calls in its debts: join its war, or lose its friendship and its aid.</div>
      ${Object.keys(BLOCS).map(b => `<div class="row sp"><span>${BLOCS[b][0]}</span><span class="row">${bar(L[b] / 100, L[b] >= 70 ? 'r' : '')}<span class="num">${Math.round(L[b])}</span>${btn(TUR_AID[b][0], 'turAid', `data-b="${b}"`, 'sm', `${TUR_AID[b][1]}; leverage +${TUR_AID[b][3]}`, !!cd || !ok(BLOCS[b][1]) || atWar(BLOCS[b][1], t))}</span></div>`).join('')}
      <h3>The Straits</h3><div class="dim">Montreux lets us decide whose warships pass. Open earns more transit fees and goodwill; closed angers a power and costs us its bloc's leverage. Each change costs 20 political power.</div>
      ${STRAIT_POW.filter(ok).map(p => `<div class="row sp"><span>${cn(p)}</span><select data-ch="trStrait" data-t="${p}">${['open', 'limited', 'closed'].map(v => `<option value="${v}"${S[p] === v ? ' selected' : ''}>${v}</option>`).join('')}</select></div>`).join('')}</div>`; }
  return '';
}
{ const _co = PANELS.country; PANELS.country = function (c) { const h = _co(c), k = balkanCard(c); if (!k) return h; const i = h.indexOf('<div class="card"'); return i < 0 ? h + k : h.slice(0, i) + k + h.slice(i); }; }
Object.assign(ACT, {
  roOil(d) { setOilShare(me(), d.b, +d.d); renderPanel(); },
  grFleet(d) { setCharter(me(), d.b, +d.d); renderPanel(); },
  yugAct(d) { const e = yugAct(me(), d.a2, d.g); if (e) UIH.notify(e, 'bad'); renderAll(); },
  revAct(d) { const e = revAct(me(), d.k, d.a2); if (e) UIH.notify(e, 'bad'); renderAll(); },
  turAid(d) { const e = turAid(me(), d.b); if (e) UIH.notify(e, 'bad'); else UIH.notify(`${TUR_AID[d.b][0]}: ${TUR_AID[d.b][1]}.`, 'good'); renderAll(); },
  entStr(d) { const c = me(), e = (G.ent || []).find(x => x.id === d.e); if (!e || c.infl < 25) return; c.infl -= 25; e.coh = Math.min(100, e.coh + 10); for (const m of e.members) if (m !== c.tag) addRel(c.tag, m, 8); renderAll(); },
  entLeave(d) { const e = (G.ent || []).find(x => x.id === d.e); if (!e) return; e.members = e.members.filter(t => t !== G.player); e.coh -= 15; logMsg(`${me().name} leaves the ${e.name}.`, 'world', e.members); renderAll(); },
  entJoin(d) { const c = me(), e = (G.ent || []).find(x => x.id === d.e); if (!e || c.infl < 40) return; const avg = sum(e.members, t => opinion(t, c.tag)) / e.members.length; if (avg < 15) { c.infl -= 10; UIH.notify(`The members of the ${e.name} decline (their opinion of us averages ${Math.round(avg)}; 15 needed).`, 'bad'); } else { c.infl -= 40; e.members.push(c.tag); e.coh = Math.max(0, e.coh - 5); logMsg(`${c.name} joins the ${e.name}.`, 'world', e.members); } renderAll(); },
  entFound() { const c = me(), nb = new Set(); for (const p of provsOf(c.tag)) for (const x of NB[p.id]) { const o = P(x.to).owner; if (o !== c.tag && ok(o) && !C(o).major && !C(o).overlord) nb.add(o); } const e = foundEntente(c, null, [...nb]); if (e) UIH.notify(e, 'bad'); renderAll(); },
  resAct(d) { const e = resAct(me(), d.t, d.a2); if (e) UIH.notify(e, 'bad'); else UIH.notify(`${RES_ACT[d.a2][0]}: done.`, 'good'); renderAll(); }
});
Object.assign(CHG, {
  bgPatron(el) { const r = revOf(me())[el.dataset.k]; r.patron = el.value || null; if (el.value) addRel(me().tag, el.value, 5); renderPanel(); },
  trStrait(el) { const e = setStrait(me(), el.dataset.t, el.value); if (e) UIH.notify(e, 'bad'); renderAll(); }
});
// ---------- Diplomacy: ententes and resistance movements ----------
function entCard(c) { const L = G.ent || []; if (!L.length && c.major) return '';
  return `<div class="card"><div class="row sp"><b>🤝 Regional ententes</b><span class="dim">small states that promise to stand together</span></div>
    <div class="dim">When a rival of the entente, or anyone once cohesion is 70 or more, attacks a member, the others are called to its side. Cohesion falls when members drift into different factions or quarrel.</div>
    ${L.map(e => { const mine = e.members.includes(c.tag);
      return `<div class="row sp"><span><b>${e.name}</b> <span class="dim">${e.members.map(t => flag(t, 1)).join(' ')}${e.rivals.length ? ' · against ' + e.rivals.map(cname).join(', ') : ''}</span></span><span class="row">${bar(e.coh / 100, e.coh >= 70 ? 'g' : e.coh < 25 ? 'r' : '')}<span class="num">${Math.round(e.coh)}</span>
        ${mine ? btn('Strengthen', 'entStr', `data-e="${e.id}"`, 'sm', '25 influence: cohesion +10, relations with members +8', c.infl < 25) + btn('Leave', 'entLeave', `data-e="${e.id}"`, 'sm') : !c.major && entOf(c.tag).length < 2 ? btn('Ask to join', 'entJoin', `data-e="${e.id}"`, 'sm', '40 influence. The members must think well of us (15).', c.infl < 40) : ''}</span></div>`; }).join('')}
    ${!c.major && entOf(c.tag).length < 2 ? `<div class="row">${btn('Found an entente with our neighbours', 'entFound', '', 'sm', '60 influence. Neighbouring small states that think well of us (15) join.', c.infl < 60)}</div>` : ''}</div>`; }
function resCard(c) { const L = Object.keys(G.res || {}).map(t => [t, resRole(c, t)]).filter(x => x[1]); if (!L.length) return '';
  const acts = { gov: ['rise'], occ: ['sweep', 'reprisal', 'amnesty'], sup: ['supply'] }, role = { gov: 'our own people', occ: 'in land we hold', sup: 'behind our enemy\'s lines' };
  return `<div class="card"><div class="row sp"><b>🔥 Resistance movements</b><span class="dim">${L.length} that concern us</span></div>
    <div class="dim">Occupied peoples resist: strength grows with unrest, harsh rule, mountains and forests, outside help and the hope of a government in exile, and falls where garrisons stand. Strong movements sabotage, liberate provinces and raise partisan armies. Their politics matter after the war.</div>
    ${L.map(([t, r]) => { const R = G.res[t];
      return `<div class="card sub"><div class="row sp"><b>${cn(t)}</b><span class="dim">${role[r]} · ${resLands(t).length} provinces occupied${R.raised ? ` · ${R.raised} partisan divisions raised` : ''}</span></div>
      <div class="row sp"><span>Strength</span><span class="row">${bar(R.str / 100, R.str >= 55 ? 'r' : '')}<span class="num">${Math.round(R.str)}</span></span></div>
      <div class="row sp"><span${tip('The share of the resistance that follows the communists rather than the government in exile.')}>Communist wing</span><span class="row">${bar(R.com, '')}<span class="num">${Math.round(R.com * 100)}%</span></span></div>
      ${Object.keys(R.sup || {}).length ? `<div class="dim">Supplied by ${Object.keys(R.sup).map(cname).join(', ')}</div>` : ''}
      <div class="row">${acts[r].map(a => btn(RES_ACT[a][0], 'resAct', `data-t="${t}" data-a2="${a}"`, 'sm', `${RES_ACT[a][3]} Costs ${RES_ACT[a][1]} ${RES_ACT[a][2] === 'pp' ? 'political power' : 'influence'}.`, c[RES_ACT[a][2]] < RES_ACT[a][1])).join('')}</div></div>`; }).join('')}</div>`; }
{ const _dip = PANELS.diplomacy; PANELS.diplomacy = function (c) { return _dip(c) + resCard(c) + entCard(c); }; }

// 2.1 interface: the colonial empire on the Nation tab, enemy colonies on the Diplomacy tab, the colony in the province box.
'use strict';
function colRow(c, col, mine) { const s = colState(col.key), pop = sum(col.provs, p => p.pop);
  const b = (a, dis) => btn(COL_ACT[a][0], 'colAct', `data-k="${col.key}" data-a2="${a}"`, 'sm', COL_ACT[a][2], dis);
  return `<div class="card sub"><div class="row sp"><b>${col.region}</b><span class="dim">${col.provs.length} province${col.provs.length > 1 ? 's' : ''} · ${mFmt(pop)} people${mine ? '' : ' · ' + cname(col.owner)}</span></div>
    <div class="row sp"><span${tip('Above 50 the colony grows restless; above 75 there are strikes; at 90, if we are at war, defeated or unstable, it rises.')}>Nationalism</span><span class="row">${bar(s.nat / 100, s.nat >= 75 ? 'r' : s.nat < 30 ? 'g' : '')}<span class="num">${Math.round(s.nat)}</span></span></div>
    ${mine ? `<div class="row sp"><span>Development</span><span>${[0, 1, 2, 3, 4].map(i => `<i class="pip${s.dev > i + 0.5 ? ' on' : ''}"></i>`).join('')}</span></div>
    <div class="row sp"><select data-ch="colAdm" data-k="${col.key}"${tip(Object.values(COL_ADM).map(a => `<b>${a[0]}</b>: ${a[1]}`).join('<br>'))}>${Object.keys(COL_ADM).map(v => `<option value="${v}"${s.adm === v ? ' selected' : ''}>${COL_ADM[v][0]}</option>`).join('')}</select>
      <span class="row wrap">${b('invest', s.dev >= 5)}${b('troops', c.pp < 30)}${b('reform', c.pp < 40)}${b('repress', c.pp < 20)}${b('grant')}</span></div>` : `<div class="row">${b('stir', c.infl < 25)}</div>`}</div>`; }
function empireCard(c) { if (!COLONIAL.includes(c.tag)) return ''; const cols = coloniesOf(c.tag).sort((a, b) => colState(b.key).nat - colState(a.key).nat); if (!cols.length) return '';
  const avg = sum(cols, x => colState(x.key).nat) / cols.length, show = UI.colAll ? cols : cols.slice(0, 6);
  return `<div class="card"><div class="row sp"><b>🌍 The Colonial Empire</b><span class="dim">${cols.length} colonies · ${mFmt(sum(cols, x => sum(x.provs, p => p.pop)))} people · ${fmt(c.colIncome || 0)} a month · average nationalism ${Math.round(avg)}</span></div>
    <div class="dim">Each colony pays taxes and can raise troops. Nationalism grows with development, harsh rule and the empire's defeats, and falls with reforms and garrisons. The Colonial Policy law (Politics) shapes it everywhere. A colony given self-government in time becomes a loyal dominion; one left too long rises.</div>
    ${show.map(x => colRow(c, x, true)).join('')}${cols.length > 6 ? `<div class="row">${btn(UI.colAll ? 'Show fewer' : `Show all ${cols.length} colonies`, 'colAll', '', 'sm')}</div>` : ''}</div>`; }
function enemyColCard(c) { const foes = [...new Set(enemiesOf(c.tag).concat(alive().filter(k => COLONIAL.includes(k.tag) && opinion(c.tag, k.tag) <= -20).map(k => k.tag)))].filter(t => COLONIAL.includes(t));
  const cols = foes.flatMap(coloniesOf).sort((a, b) => colState(b.key).nat - colState(a.key).nat).slice(0, 8); if (!cols.length) return '';
  return `<div class="card"><div class="row sp"><b>🌍 Our enemies' colonies</b><span class="dim">the most restless first</span></div><div class="dim">Stirring a colony up costs influence; a colony that rises takes land, men and taxes from its master.</div>${cols.map(x => colRow(c, x, false)).join('')}</div>`; }
{ const _co = PANELS.country; PANELS.country = function (c) { const h = _co(c), k = empireCard(c); if (!k) return h; const i = h.indexOf('<h3>'); return i < 0 ? h + k : h.slice(0, i) + k + h.slice(i); }; }
{ const _dip = PANELS.diplomacy; PANELS.diplomacy = function (c) { return _dip(c) + enemyColCard(c); }; }
Object.assign(ACT, { colAct(d) { const e = colAct(me(), d.k, d.a2); if (e) UIH.notify(e, 'bad'); else UIH.notify(`${COL_ACT[d.a2][0]}: done.`, 'good'); renderAll(); }, colAll() { UI.colAll = !UI.colAll; renderPanel(); } });
Object.assign(CHG, { colAdm(el) { const e = setColAdm(me(), el.dataset.k, el.value); if (e) UIH.notify(e, 'bad'); renderPanel(); } });
{ const _rp = renderProv; renderProv = function () { _rp(); if (SEL.prov === null || !G) return; const p = P(SEL.prov), el = $('provinfo'); if (!el || el.hidden || !isColonyProv(p)) return; const s = colState(p.owner + ':' + colRegion(p));
  el.insertAdjacentHTML('beforeend', `<div class="dim">🌍 Colony of ${cname(p.owner)}: ${colRegion(p)} · nationalism ${Math.round(s.nat)} · ${(COL_ADM[s.adm] || COL_ADM.direct)[0]}</div>`); }; }

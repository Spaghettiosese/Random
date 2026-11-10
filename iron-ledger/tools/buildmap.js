// Builds data/map.js from data/provinces.js + Natural Earth (world-atlas, public domain).
// Usage: npm i world-atlas d3-delaunay && node tools/buildmap.js
const fs = require('fs'), path = require('path');
const { Delaunay } = require('d3-delaunay');
const topo = require('world-atlas/countries-50m.json');
const RAW = require('../data/provinces.js');
const W = 8192, LON0 = -169.5;
const my = lat => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat * Math.PI / 180));
const YT = my(84), YB = my(-57), SC = W / 360, H = Math.round((YT - YB) * 180 / Math.PI * SC);
const px = lon => (((lon - LON0) % 360) + 360) % 360 * SC;
const py = lat => (YT - my(lat)) * 180 / Math.PI * SC;
const provs = RAW.trim().split('\n').map((l, id) => { const f = l.split('|'); return { id, name: f[0], iso: f[1], lat: +f[2], lon: +f[3], x: px(+f[3]), y: py(+f[2]) }; });
const byIso = {}; provs.forEach(p => (byIso[p.iso] = byIso[p.iso] || []).push(p));
// decode arcs
const tf = topo.transform;
let arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(d => { x += d[0]; y += d[1]; return [x * tf.scale[0] + tf.translate[0], y * tf.scale[1] + tf.translate[1]]; }); });
// project (unwrap so each arc stays continuous)
arcs = arcs.map(a => { let pts = a.map(q => [px(q[0]), py(q[1])]); const xs = pts.map(q => q[0]); if (Math.max(...xs) - Math.min(...xs) > W / 2) pts = pts.map(q => [q[0] < W / 2 ? q[0] + W : q[0], q[1]]); return pts; });
function dp(pts, tol) { if (pts.length < 3) return pts; const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1; const st = [[0, pts.length - 1]];
  while (st.length) { const [a, b] = st.pop(); let md = 0, mi = -1; const ax = pts[a][0], ay = pts[a][1], dx = pts[b][0] - ax, dy = pts[b][1] - ay, L = dx * dx + dy * dy || 1e-9;
    for (let i = a + 1; i < b; i++) { let t = ((pts[i][0] - ax) * dx + (pts[i][1] - ay) * dy) / L; t = Math.max(0, Math.min(1, t)); const d = Math.hypot(pts[i][0] - ax - t * dx, pts[i][1] - ay - t * dy); if (d > md) { md = d; mi = i; } }
    if (md > tol) { keep[mi] = 1; st.push([a, mi], [mi, b]); } }
  let out = pts.filter((_, i) => keep[i]);
  if (out.length < 4 && pts.length >= 4 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 1e-9) { const n = pts.length - 1; out = [pts[0], pts[Math.floor(n / 3)], pts[Math.floor(2 * n / 3)], pts[n]]; }
  return out; }
arcs = arcs.map(a => dp(a, 1.1));
const arcUse = arcs.map(() => []);
const geoms = topo.objects.countries.geometries;
function ringOf(idx) { let r = []; for (const i of idx) { const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; r = r.concat(r.length ? a.slice(1) : a); } return r; }
const area = r => { let s = 0; for (let i = 0; i < r.length - 1; i++) s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; return Math.abs(s / 2); };
const country = {};
geoms.forEach((g, gi) => { const name = g.properties.name; const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
  polys.forEach(p => p.forEach(r => r.forEach(i => arcUse[i < 0 ? ~i : i].push(name))));
  if (!byIso[name]) return;
  let rings = polys.map(p => ({ idx: p[0], pts: ringOf(p[0]) })).map(r => (r.a = area(r.pts), r)).sort((a, b) => b.a - a.a);
  rings = rings.filter((r, i) => i === 0 || r.a > 22);
  // normalise wrapped rings back into [0,W) when entirely beyond
  rings.forEach(r => { if (Math.min(...r.pts.map(q => q[0])) >= W) r.pts = r.pts.map(q => [q[0] - W, q[1]]); });
  country[name] = rings; });
for (const iso in byIso) if (!country[iso]) throw new Error('no geometry for ' + iso);
const inside = (p, a, b) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
function clip(subj, cell, c) { let out = subj; const n = cell.length - 1;
  for (let e = 0; e < n && out.length; e++) { const a = cell[e], b = cell[e + 1], sgn = Math.sign(inside(c, a, b)) || 1, inp = out; out = [];
    for (let i = 0; i < inp.length; i++) { const p = inp[i], q = inp[(i + 1) % inp.length], dpv = inside(p, a, b) * sgn, dq = inside(q, a, b) * sgn;
      if (dpv >= 0) out.push(p); if ((dpv >= 0) !== (dq >= 0)) { const t = dpv / (dpv - dq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); } } }
  return out; }
const isea = [];
const polyOut = provs.map(() => []), adj = new Set(), sea = new Map(), inner = [], coastal = new Uint8Array(provs.length);
const key = (a, b) => a < b ? a + ',' + b : b + ',' + a;
const nearest = (list, x, y) => { let b = null, bd = 1e18; for (const p of list) { let dx = Math.abs(p.x - x); if (dx > W / 2) dx = W - dx; const d = dx * dx + (p.y - y) ** 2; if (d < bd) { bd = d; b = p; } } return b; };
const hav = (a, b) => { const r = Math.PI / 180, dl = (b.lat - a.lat) * r, dn = (b.lon - a.lon) * r; const h = Math.sin(dl / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
for (const iso in byIso) { const seeds = byIso[iso], rings = country[iso];
  if (seeds.length === 1) { rings.forEach(r => polyOut[seeds[0].id].push(r.pts.slice(0, -1))); continue; }
  const del = Delaunay.from(seeds.map(s => [s.x, s.y])), vor = del.voronoi([-W, -H, 3 * W, 2 * H]);
  const touch = seeds.map(() => new Set());
  rings.forEach(r => { const ring = r.pts.slice(0, -1); const sh = ring[0][0] >= W * 0.97 && Math.max(...ring.map(q => q[0])) > W ? 0 : 0;
    // rings living past the right edge compare against seeds shifted by W
    const far = Math.min(...ring.map(q => q[0])) > W * 0.985 && iso !== 'Russia';
    seeds.forEach((s, i) => { let cell = vor.cellPolygon(i); if (!cell) return; let rr = ring;
      if (ring.every(q => del.find(q[0], q[1]) === i)) { polyOut[s.id].push(rr); return; }
      const c = clip(rr, cell, [s.x, s.y]); if (c.length >= 3 && area(c.concat([c[0]])) > 0.5) { polyOut[s.id].push(c); for (const j of del.neighbors(i)) { const t = seeds[j]; if (c.some(q => Math.abs(Math.hypot(q[0] - s.x, q[1] - s.y) - Math.hypot(q[0] - t.x, q[1] - t.y)) < 2e-3)) touch[i].add(j); } } }); });
  seeds.forEach((s, i) => { for (const j of del.neighbors(i)) if (j > i) { const land = touch[i].has(j) || touch[j].has(i);
      if (!polyOut[s.id].length || !polyOut[seeds[j].id].length) continue;
      if (land) { adj.add(key(s.id, seeds[j].id)); inner.push([s.id, seeds[j].id]); } else { const d = hav(s, seeds[j]); if (d < 1300) isea.push([s.id, seeds[j].id, Math.round(d)]); } } }); }
const empty = provs.filter(p => !polyOut[p.id].length); if (empty.length) console.log('EMPTY provinces:', empty.map(p => p.name).join(', '));
// borders between map units + coast
const borders = [];
arcs.forEach((a, ai) => { const u = arcUse[ai]; if (u.length === 1) { const l = byIso[u[0]]; if (l) for (let i = 0; i < a.length - 1; i++) coastal[nearest(l, ((a[i][0] + a[i + 1][0]) / 2) % W, (a[i][1] + a[i + 1][1]) / 2).id] = 1; return; }
  if (u.length !== 2 || !byIso[u[0]] || !byIso[u[1]]) return; let cur = null;
  for (let i = 0; i < a.length - 1; i++) { const mx = ((a[i][0] + a[i + 1][0]) / 2) % W, m2 = (a[i][1] + a[i + 1][1]) / 2; const pa = nearest(byIso[u[0]], mx, m2).id, pb = nearest(byIso[u[1]], mx, m2).id;
    if (!cur || cur[0] !== pa || cur[1] !== pb) { cur = [pa, pb, [Math.round(a[i][0]), Math.round(a[i][1])]]; borders.push(cur); } cur[2].push(Math.round(a[i + 1][0]), Math.round(a[i + 1][1])); adj.add(key(pa, pb)); } });
// components + automatic sea links
const nb = provs.map(() => []); adj.forEach(k => { const [a, b] = k.split(',').map(Number); nb[a].push(b); nb[b].push(a); });
const comp = new Int32Array(provs.length).fill(-1); let nc = 0;
provs.forEach(p => { if (comp[p.id] >= 0) return; const st = [p.id]; comp[p.id] = nc; while (st.length) { const x = st.pop(); for (const y of nb[x]) if (comp[y] < 0) { comp[y] = nc; st.push(y); } } nc++; });
provs.forEach(p => { if (!nb[p.id].length) coastal[p.id] = 1; });
isea.forEach(([a, b, d]) => { if (coastal[a] && coastal[b]) sea.set(key(a, b), d); });
const cp = provs.filter(p => coastal[p.id]); const best = {};
for (const a of cp) { let nn = null, nd = 1e9; for (const b of cp) { if (comp[a.id] === comp[b.id]) continue; const d = hav(a, b); if (d < nd) { nd = d; nn = b; } const ck = key(comp[a.id], comp[b.id]); if (!best[ck] || d < best[ck][2]) best[ck] = [a.id, b.id, d]; }
  if (nn && nd < 550) sea.set(key(a.id, nn.id), Math.round(nd)); }
for (const k in best) if (best[k][2] < 1500) sea.set(key(best[k][0], best[k][1]), Math.round(best[k][2]));
const byName = {}; provs.forEach(p => byName[p.name] = p);
const MANUAL = [['Palermo', 'Tunis'], ['Seville', 'Tetuan'], ['Copenhagen', 'Gothenburg'], ['Tallinn', 'Helsinki'], ['Marseille', 'Algiers'], ['Naples', 'Tripoli'], ['Athens', 'Benghazi'], ['Athens', 'Izmir'], ['Aden', 'Djibouti'], ['Aden', 'Berbera'],
  ['Honolulu', 'San Francisco'], ['Honolulu', 'Tokyo'], ['Honolulu', 'Manila'], ['Honolulu', 'Suva'], ['Recife', 'Dakar'], ['New York', 'Nantes'], ['Halifax', 'Belfast'], ['Boston', 'Lisbon'], ['St. John\'s', 'Reykjavik'], ['Reykjavik', 'Glasgow'], ['Reykjavik', 'Godthaab'], ['Godthaab', 'Labrador'],
  ['Bergen', 'Glasgow'], ['Copenhagen', 'Stettin'], ['Danzig', 'Stockholm'], ['Riga', 'Stockholm'], ['Königsberg', 'Stettin'], ['Vladivostok', 'Sapporo'], ['Fukuoka', 'Keijo'], ['Fukuoka', 'Shanghai'], ['Taihoku', 'Fuzhou'], ['Taihoku', 'Manila'], ['Fukuoka', 'Taihoku'], ['Dairen', 'Qingdao'], ['Dairen', 'Tianjin'], ['Hong Kong', 'Manila'], ['Saigon', 'Manila'], ['Singapore', 'Batavia'], ['Singapore', 'Kuching'], ['Darwin', 'Kupang'], ['Davao', 'Ambon'], ['Davao', 'Jesselton'], ['Rabaul', 'Tulagi'], ['Tulagi', 'Port Vila'], ['Port Vila', 'Nouméa'], ['Nouméa', 'Brisbane'], ['Suva', 'Auckland'], ['Suva', 'Port Vila'], ['Sydney', 'Auckland'], ['Colombo', 'Madras'], ['Bombay', 'Aden'], ['Bombay', 'Muscat'], ['Karachi', 'Muscat'], ['Colombo', 'Singapore'], ['Perth', 'Batavia'], ['Cape Town', 'Stanley'], ['Stanley', 'Punta Arenas'], ['Stanley', 'Comodoro Rivadavia'], ['Tananarive', 'Beira'], ['Tananarive', 'Dar es Salaam'], ['Miami', 'Havana'], ['Miami', 'Nassau'], ['Havana', 'Mérida'], ['Kingston', 'Havana'], ['Kingston', 'Port-au-Prince'], ['San Juan', 'Santo Domingo'], ['Port of Spain', 'Caracas'], ['Lisbon', 'Rabat'], ['Lisbon', 'Dakar'], ['Valletta', 'Palermo'], ['Valletta', 'Tripoli'], ['Nicosia', 'Beirut'], ['Nicosia', 'Adana'], ['Alexandria', 'Athens'], ['Cagliari', 'Tunis'], ['Barcelona', 'Cagliari'], ['Odessa', 'Istanbul'], ['Sevastopol', 'Constanța'], ['Sevastopol', 'Krasnodar'], ['Baku', 'Guryev'], ['Baku', 'Ashgabat'], ['Petropavlovsk', 'Sapporo'], ['Anchorage', 'Petropavlovsk'], ['Anchorage', 'Seattle'], ['Los Angeles', 'Honolulu'], ['Santa Isabel', 'Libreville'], ['Luanda', 'Salvador'], ['Cayenne', 'Belém'], ['Narvik', 'Murmansk'], ['Oslo', 'Copenhagen'], ['London', 'Amsterdam'], ['Tokyo', 'Petropavlovsk'], ['Toyohara', 'Sapporo'], ['Dublin', 'Cardiff'], ['Hong Kong', 'Taihoku'], ['Hong Kong', 'Saigon'], ['Rangoon', 'Calcutta'], ['Rangoon', 'Singapore'], ['Mogadishu', 'Colombo'], ['Jeddah', 'Aswan'], ['Port Moresby', 'Brisbane'], ['Port Moresby', 'Darwin']];
MANUAL.forEach(([a, b]) => { if (!byName[a] || !byName[b]) throw new Error('bad sea link ' + a + '/' + b); const k = key(byName[a].id, byName[b].id); if (!adj.has(k)) sea.set(k, Math.round(hav(byName[a], byName[b]))); });
// ensure everything is reachable
const nb2 = provs.map(() => []); adj.forEach(k => { const [a, b] = k.split(',').map(Number); nb2[a].push(b); nb2[b].push(a); }); sea.forEach((d, k) => { const [a, b] = k.split(',').map(Number); nb2[a].push(b); nb2[b].push(a); });
const seen = new Uint8Array(provs.length), st = [0]; seen[0] = 1; while (st.length) { const x = st.pop(); for (const y of nb2[x]) if (!seen[y]) { seen[y] = 1; st.push(y); } }
const un = provs.filter(p => !seen[p.id]); if (un.length) console.log('UNREACHABLE:', un.map(p => p.name).join(', '));
const out = { W, H, P: provs.map(p => ({ x: Math.round(p.x), y: Math.round(p.y), c: coastal[p.id], poly: polyOut[p.id].map(r => { const o = []; let lx, ly; r.forEach(q => { const x = Math.round(q[0]), y = Math.round(q[1]); if (x !== lx || y !== ly) o.push(x, y); lx = x; ly = y; }); return o; }).filter(o => o.length >= 6) })),
  borders, inner, adj: [...adj].map(k => k.split(',').map(Number)), sea: [...sea].map(([k, d]) => k.split(',').map(Number).concat(d)) };
fs.writeFileSync(path.join(__dirname, '../data/map.js'), '// Generated by tools/buildmap.js from Natural Earth (public domain). Do not edit.\nvar MAP = ' + JSON.stringify(out) + ';\nif (typeof module !== "undefined") module.exports = MAP;\n');
console.log('provinces', provs.length, 'adj', adj.size, 'sea', sea.size, 'borders', borders.length, 'components', nc, 'H', H, 'bytes', fs.statSync(path.join(__dirname, '../data/map.js')).size);

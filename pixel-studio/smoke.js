// Smoke test: node smoke.js <heroine> <outdir> [maxSteps]  (serves heartline/ on a local port)
const { chromium } = require('playwright'), http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'heartline'), who = process.argv[2] || 'hikari', out = process.argv[3] || '/tmp/smoke', max = +process.argv[4] || 120;
fs.mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const srv = http.createServer((q, r) => { const p = path.join(root, q.url.split('?')[0] === '/' ? 'index.html' : q.url.split('?')[0]); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(d); } }); }).listen(0, async () => {
  const port = srv.address().port;
  const exe = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium-'))[0];
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${exe}/chrome-linux/chrome`, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; pg.on('pageerror', e => errs.push('PAGEERR ' + e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await pg.goto(`http://localhost:${port}/`); await pg.waitForTimeout(800);
  await pg.mouse.click(640, 360); await pg.waitForTimeout(1500);
  await pg.screenshot({ path: `${out}/00_title.png` });
  await pg.click('#tafter'); await pg.waitForTimeout(400);
  const all = await pg.$('#afall'); if (all) await all.click(); await pg.waitForTimeout(500);
  await pg.screenshot({ path: `${out}/01_menu.png` });
  await pg.click(`.aft[data-k="${who}"]`); await pg.waitForTimeout(2500);
  let n = 0;
  for (let i = 0; i < max; i++) {
    const ch = await pg.$('#choices .choice'); if (ch) { await pg.screenshot({ path: `${out}/s${String(i).padStart(3, '0')}_choice.png` }); await ch.click(); }
    else { await pg.keyboard.press('Space'); }
    await pg.waitForTimeout(450);
    if (i % 3 === 0) await pg.screenshot({ path: `${out}/s${String(i).padStart(3, '0')}.png` });
    if (await pg.$('#title.on')) { n = i; break; }
  }
  console.log('finished at step', n, '\n' + errs.slice(0, 15).join('\n'));
  await b.close(); srv.close();
});

// Bundles heartline/ into one self-contained HTML file: node bundle.js <out.html>
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'heartline'), out = process.argv[2];
let h = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const esc = s => s.replace(/<\/script/gi, '<\\/script');
h = h.replace(/<script src="([^"]+)"><\/script>/g, (m, f) => { const p = path.join(root, f); return fs.existsSync(p) ? `<script>/* ${f} */\n${esc(fs.readFileSync(p, 'utf8'))}\n</script>` : ''; });
h = h.replace(/<link rel="stylesheet" href="style.css">/, () => `<style>\n${fs.readFileSync(path.join(root, 'style.css'), 'utf8')}\n</style>`);
fs.writeFileSync(out, h);
console.log(out, (h.length / 1e6).toFixed(2) + ' MB');

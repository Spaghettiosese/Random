"""Shrinks the PNG data URLs in heartline/js/px/*.js (RGBA -> indexed PNG). Usage: optimize_px.py <dir with *.js>"""
import re, sys, base64, io, glob
from PIL import Image
rx = re.compile(r'data:image/png;base64,([A-Za-z0-9+/=]+)')
def shrink(m):
    raw = base64.b64decode(m.group(1))
    im = Image.open(io.BytesIO(raw)).convert('RGBA')
    cols = im.getcolors(1 << 16)
    if cols is not None and len(cols) <= 256:
        pal = [c for _, c in cols]
        idx = {c: i for i, c in enumerate(pal)}
        out = Image.new('P', im.size)
        out.putdata([idx[p] for p in im.getdata()])
        flat = [v for c in pal for v in c[:3]]
        out.putpalette(flat + [0] * (768 - len(flat)))
        trans = bytes(c[3] for c in pal)
        buf = io.BytesIO(); out.save(buf, 'PNG', optimize=True, transparency=trans)
    else:
        q = im.quantize(256, method=Image.FASTOCTREE, dither=Image.NONE)
        buf = io.BytesIO(); q.save(buf, 'PNG', optimize=True)
    b = buf.getvalue()
    return 'data:image/png;base64,' + base64.b64encode(b if len(b) < len(raw) else raw).decode()
tot0 = tot1 = 0
for f in sorted(glob.glob(sys.argv[1] + '/*.js')):
    s = open(f).read(); n = rx.sub(shrink, s); tot0 += len(s); tot1 += len(n)
    open(f, 'w').write(n); print(f.split('/')[-1], len(s) // 1024, '->', len(n) // 1024, 'KB')
print('total', tot0 // 1048576, '->', tot1 // 1048576, 'MB')

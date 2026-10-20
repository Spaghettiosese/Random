import sys,os
from PIL import Image,ImageDraw
os.chdir(os.path.dirname(os.path.abspath(__file__)))
names=sys.argv[2:];sc=int(sys.argv[1]) if sys.argv[1].isdigit() else 1
# sheet.py <out> names... where first arg is out name
out=sys.argv[1];names=sys.argv[2:]
W,H=480,270
cols=2 if len(names)>1 else 1
rows=(len(names)+cols-1)//cols
sh=Image.new('RGB',(W*cols,H*rows))
for i,n in enumerate(names):
    f=f'out/q_{n}_0.png' if os.path.exists(f'out/q_{n}_0.png') else f'out/{n}_0.png'
    im=Image.open(f).convert('RGB');ImageDraw.Draw(im).text((3,3),n,fill=(255,255,0))
    sh.paste(im,((i%cols)*W,(i//cols)*H))
sh.save(out)

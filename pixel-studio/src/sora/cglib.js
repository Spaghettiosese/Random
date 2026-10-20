// CG pipeline: draw at K x on a single canvas, downsample, median-cut palette (shared by all frames), bayer dither.
const CW=480,CH=270,CK=2;
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function medianCut(samples,n){ // samples: array of [r,g,b,weight]
 let boxes=[samples];
 while(boxes.length<n){let bi=-1,bs=-1,bc=0;
  boxes.forEach((b,i)=>{if(b.length<2)return;let mn=[255,255,255],mx=[0,0,0],w=0;for(const s of b){for(let k=0;k<3;k++){if(s[k]<mn[k])mn[k]=s[k];if(s[k]>mx[k])mx[k]=s[k]}w+=s[3]}
   for(let k=0;k<3;k++){const r=(mx[k]-mn[k])*(k===1?1:k===0?.8:.6);const sc=r*Math.pow(w,.35);if(sc>bs){bs=sc;bi=i;bc=k}}});
  if(bi<0)break;const b=boxes[bi];b.sort((p,q)=>p[bc]-q[bc]);let tot=0;for(const s of b)tot+=s[3];let acc=0,cut=1;for(let i=0;i<b.length;i++){acc+=b[i][3];if(acc>=tot/2){cut=Math.max(1,Math.min(b.length-1,i+1));break}}
  boxes.splice(bi,1,b.slice(0,cut),b.slice(cut))}
 return boxes.map(b=>{let r=0,g=0,bl=0,w=0;for(const s of b){r+=s[0]*s[3];g+=s[1]*s[3];bl+=s[2]*s[3];w+=s[3]}return[Math.round(r/w),Math.round(g/w),Math.round(bl/w)]})}
function renderFrames(drawFn,nf,ncol,seed){
 const datas=[];
 for(let t=0;t<nf;t++){const c=mkCanvas(CW*CK,CH*CK);const x=c.getContext('2d');x.save();x.scale(CK,CK);x.lineJoin='round';x.lineCap='round';drawFn(x,t,nf);x.restore();datas.push(down(c,CW,CH,CK))}
 // histogram on 4-bit-ish quantization across frames
 const hist=new Map();
 for(const d of datas)for(let i=0;i<CW*CH;i+=1){const r=d[i*4]>>2,g=d[i*4+1]>>2,b=d[i*4+2]>>2;const k=(r<<12)|(g<<6)|b;hist.set(k,(hist.get(k)||0)+1)}
 const samples=[];for(const [k,v] of hist)samples.push([((k>>12)&63)*4+2,((k>>6)&63)*4+2,(k&63)*4+2,v]);
 const pal=medianCut(samples,ncol);
 const lut=new Map();
 const nearest=(r,g,b)=>{const key=((r>>2)<<12)|((g>>2)<<6)|(b>>2);let v=lut.get(key);if(v!==undefined)return v;let bi=0,bd=1e9;for(let j=0;j<pal.length;j++){const p=pal[j];const q=(p[0]-r)**2*.3+(p[1]-g)**2*.59+(p[2]-b)**2*.11;if(q<bd){bd=q;bi=j}}lut.set(key,bi);return bi};
 const frames=datas.map(d=>{const idx=new Uint8Array(CW*CH);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const i=y*CW+x;const o=(BAY[(y&3)*4+(x&3)]-7.5)*(seed&&seed.dither!==undefined?seed.dither:1.1);
   idx[i]=nearest(Math.max(0,Math.min(255,d[i*4]+o)),Math.max(0,Math.min(255,d[i*4+1]+o)),Math.max(0,Math.min(255,d[i*4+2]+o)))}return {idx,W:CW,H:CH,pal}});
 return frames}
function cgPack(frames){return frames.map(r=>packIdx({idx:r.idx,W:r.W,H:r.H,pal:r.pal}))}
// ---------- drawing helpers ----------
const TAU=Math.PI*2;
function lg(x,x0,y0,x1,y1,stops){const g=x.createLinearGradient(x0,y0,x1,y1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g}
function rg(x,cx,cy,r0,r1,stops){const g=x.createRadialGradient(cx,cy,r0,cx,cy,r1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g}
function poly(x,pts,fill,stroke,sw=1){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=sw;x.stroke()}}
function P2(x,d,fill,stroke,sw=1){const p=new Path2D(d);if(fill){x.fillStyle=fill;x.fill(p)}if(stroke){x.strokeStyle=stroke;x.lineWidth=sw;x.stroke(p)}return p}
function ell(x,cx,cy,rx,ry,fill,stroke,sw=1,rot=0){x.beginPath();x.ellipse(cx,cy,rx,ry,rot,0,TAU);if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=sw;x.stroke()}}
function circ(x,cx,cy,r,fill,stroke,sw=1){ell(x,cx,cy,r,r,fill,stroke,sw)}
function rect(x,a,b,w,h,fill){x.fillStyle=fill;x.fillRect(a,b,w,h)}
function lineP(x,pts,col,w,cap='round'){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.strokeStyle=col;x.lineWidth=w;x.lineCap=cap;x.stroke()}
function curveP(x,pts,col,w){// smooth through points
 x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;x.quadraticCurveTo(pts[i][0],pts[i][1],mx,my)}x.lineTo(pts[pts.length-1][0],pts[pts.length-1][1]);x.strokeStyle=col;x.lineWidth=w;x.stroke()}
function starP(x,cx,cy,r,fill,rot=0,stroke,sw){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+rot+i*Math.PI/5,rr=i%2?r*.42:r;pts.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr])}poly(x,pts,fill,stroke,sw)}
function glow(x,cx,cy,r,col,a=1){x.save();x.globalAlpha=a;x.fillStyle=rg(x,cx,cy,0,r,[[0,col],[1,col.replace(/[\d.]+\)$/,'0)')]]);x.fillRect(cx-r,cy-r,r*2,r*2);x.restore()}
// glow using rgba strings: glowC(x,cx,cy,r,[r,g,b],alpha)
function glowC(x,cx,cy,r,rgb,a){const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`);g.addColorStop(.5,`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a*.35})`);g.addColorStop(1,`rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2)}
function vignette(x,a=.45,col='10,6,30'){const g=x.createRadialGradient(CW/2,CH/2,CH*.45,CW/2,CH/2,CW*.62);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(1,`rgba(${col},${a})`);x.fillStyle=g;x.fillRect(0,0,CW,CH)}
function tint(x,col,a){x.save();x.globalAlpha=a;x.fillStyle=col;x.fillRect(0,0,CW,CH);x.restore()}
function mix(a,b,t){const A=hexRGB(a),B=hexRGB(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
const sinT=(t,n,ph=0)=>Math.sin((t/n+ph)*TAU);
const cosT=(t,n,ph=0)=>Math.cos((t/n+ph)*TAU);

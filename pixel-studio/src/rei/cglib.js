// ===== CG engine (page side) =====
const CW=480,CHH=270,K=4;
const LINE='#140c22';
let MAIN,X;
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function rng(seed){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
const TAU=Math.PI*2,D2R=Math.PI/180,sin=Math.sin,cos=Math.cos,abs=Math.abs,min=Math.min,max=Math.max;
const lerp=(a,b,t)=>a+(b-a)*t;
function hex(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mix(a,b,t){const A=hex(a),B=hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function begin(){MAIN=mk(CW*K,CHH*K);X=MAIN.getContext('2d');X.setTransform(K,0,0,K,0,0);X.lineJoin='round';X.lineCap='round';return X}
function finish(){const m=mk(CW*2,CHH*2),mx=m.getContext('2d');mx.imageSmoothingQuality='high';mx.drawImage(MAIN,0,0,CW*2,CHH*2);
 const s=mk(CW,CHH),sx=s.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(m,0,0,CW,CHH);return sx.getImageData(0,0,CW,CHH).data}
function b64(u8){let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s)}
// ---- primitives ----
function lg(x0,y0,x1,y1,stops){const g=X.createLinearGradient(x0,y0,x1,y1);stops.forEach(([t,c])=>g.addColorStop(t,c));return g}
function rg(x0,y0,r0,x1,y1,r1,stops){const g=X.createRadialGradient(x0,y0,r0,x1,y1,r1);stops.forEach(([t,c])=>g.addColorStop(t,c));return g}
function rect(x,y,w,h,f){X.fillStyle=f;X.fillRect(x,y,w,h)}
function sky(stops,y0=0,y1=CHH){rect(0,y0,CW,y1-y0,lg(0,y0,0,y1,stops))}
function glow(x,y,r,c,a=1,c2){X.save();X.globalAlpha=a;X.fillStyle=rg(x,y,0,x,y,r,[[0,c],[1,c2||c.slice(0,7)+'00']]);X.fillRect(x-r,y-r,r*2,r*2);X.restore()}
function disc(x,y,r,f){X.fillStyle=f;X.beginPath();X.arc(x,y,r,0,TAU);X.fill()}
function ell(x,y,rx,ry,f,rot=0){X.fillStyle=f;X.beginPath();X.ellipse(x,y,rx,ry,rot,0,TAU);X.fill()}
function poly(pts,f,stroke,w=1){X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.closePath();if(f){X.fillStyle=f;X.fill()}if(stroke){X.strokeStyle=stroke;X.lineWidth=w;X.stroke()}}
function P2(d,f,stroke,w=1){const p=new Path2D(d);if(f){X.fillStyle=f;X.fill(p)}if(stroke){X.strokeStyle=stroke;X.lineWidth=w;X.stroke(p)}return p}
function ln(pts,c,w=1){X.strokeStyle=c;X.lineWidth=w;X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.stroke()}
function vignette(a=.5,col='#0a0614'){X.save();X.fillStyle=rg(CW/2,CHH/2,CHH*.45,CW/2,CHH/2,CW*.62,[[0,col+'00'],[1,col+Math.round(a*255).toString(16).padStart(2,'0')]]);X.fillRect(0,0,CW,CHH);X.restore()}
function tint(c,a,mode='source-over'){X.save();X.globalCompositeOperation=mode;X.globalAlpha=a;X.fillStyle=c;X.fillRect(0,0,CW,CHH);X.restore()}
// ---- layers (lighting for figures) ----
function layer(fn,opt={}){const main=X,mainC=MAIN;const c=mk(CW*K,CHH*K);MAIN=c;X=c.getContext('2d');X.setTransform(K,0,0,K,0,0);X.lineJoin='round';X.lineCap='round';
 fn();const L=c;const lx=X;
 if(opt.rim){ // crescent rim light on side opposite to offset
  const [dx,dy,col,al=1]=opt.rim;const t=mk(CW*K,CHH*K),tx=t.getContext('2d');tx.drawImage(L,0,0);tx.globalCompositeOperation='destination-out';tx.drawImage(L,-dx*K,-dy*K);
  tx.globalCompositeOperation='source-in';tx.fillStyle=col;tx.fillRect(0,0,t.width,t.height);lx.setTransform(1,0,0,1,0,0);lx.globalAlpha=al;lx.globalCompositeOperation='source-atop';lx.drawImage(t,0,0);lx.globalAlpha=1;lx.setTransform(K,0,0,K,0,0)}
 if(opt.tint){lx.save();lx.globalCompositeOperation='source-atop';opt.tint.forEach(([f,a,m])=>{lx.globalAlpha=a;lx.globalCompositeOperation=m||'source-atop';lx.fillStyle=typeof f==='function'?f(lx):f;lx.fillRect(0,0,CW,CHH)});lx.restore()}
 MAIN=mainC;X=main;X.save();X.setTransform(1,0,0,1,0,0);if(opt.alpha!=null)X.globalAlpha=opt.alpha;X.drawImage(L,0,0);X.restore()}
// ---- shapes with shared outline ----
function Shape(){const p=new Path2D();return{p,
 poly(pts){let a=0;for(let i=0;i<pts.length;i++){const q=pts[(i+1)%pts.length];a+=pts[i][0]*q[1]-q[0]*pts[i][1]}if(a<0)pts=pts.slice().reverse();p.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)p.lineTo(pts[i][0],pts[i][1]);p.closePath()},
 circ(cx,cy,r){p.moveTo(cx+r,cy);p.arc(cx,cy,r,0,TAU)}}}
function limbShape(pts,ws){const S=Shape();for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,wa=ws[i]/2,wb=ws[i+1]/2;S.poly([[a[0]+nx*wa,a[1]+ny*wa],[b[0]+nx*wb,b[1]+ny*wb],[b[0]-nx*wb,b[1]-ny*wb],[a[0]-nx*wa,a[1]-ny*wa]])}
 pts.forEach((p,i)=>S.circ(p[0],p[1],ws[i]/2));return S.p}
function fillOutlined(p,fill,line=LINE,w=1.7){X.strokeStyle=line;X.lineWidth=w;X.stroke(p);X.fillStyle=fill;X.fill(p)}
function shade(p,col,pts,ws,side,amt=.3){X.save();X.clip(p);const sh=[];for(let i=0;i<pts.length;i++){const a=pts[max(0,i-1)],b=pts[min(pts.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;sh.push([pts[i][0]+(-dy/l)*side*ws[i]*(.5-amt/2+.02),pts[i][1]+(dx/l)*side*ws[i]*(.5-amt/2+.02)])}
 X.strokeStyle=col;X.lineWidth=ws[0]*amt*1.6;X.lineCap='butt';X.beginPath();sh.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1]));X.stroke();X.restore()}
function along(pts,ws,f){ // truncate chain to fraction f of its length
 let tot=0;const L=[];for(let i=0;i<pts.length-1;i++){const l=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);L.push(l);tot+=l}
 let rem=tot*f;const op=[pts[0]],ow=[ws[0]];for(let i=0;i<L.length;i++){if(rem>=L[i]-1e-6){op.push(pts[i+1]);ow.push(ws[i+1]);rem-=L[i]}else{const t=rem/L[i];op.push([lerp(pts[i][0],pts[i+1][0],t),lerp(pts[i][1],pts[i+1][1],t)]);ow.push(lerp(ws[i],ws[i+1],t));break}}
 return[op,ow]}
// ---- particles ----
function sparkle(x,y,r,c,a=1){X.save();X.globalAlpha=a;X.fillStyle=c;X.beginPath();X.moveTo(x,y-r);X.quadraticCurveTo(x,y,x+r,y);X.quadraticCurveTo(x,y,x,y+r);X.quadraticCurveTo(x,y,x-r,y);X.quadraticCurveTo(x,y,x,y-r);X.fill();X.restore()}
function petal(x,y,r,rot,c){X.save();X.translate(x,y);X.rotate(rot);X.fillStyle=c;X.beginPath();X.ellipse(0,0,r,r*.55,0,0,TAU);X.fill();X.restore()}

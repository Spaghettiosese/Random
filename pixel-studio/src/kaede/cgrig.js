// ===== CG rig: stylised anime figures at 480x270 =====
let x;const GR={mul:[1,1,1],add:[0,0,0]};
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const T=h=>{if(!h||h[0]!=='#')return h;const c=hx(h.length===4?'#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3]:h);const o=c.map((v,i)=>Math.max(0,Math.min(255,Math.round(v*GR.mul[i]+GR.add[i]))));return '#'+o.map(v=>v.toString(16).padStart(2,'0')).join('')};
const mix=(a,b,t)=>{const p=hx(a),q=hx(b);return '#'+p.map((v,i)=>Math.round(v+(q[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const LN='#2e1a2e';
const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
const smooth=(pts,closed=true)=>{const p=new Path2D(),n=pts.length;if(closed){let m=mid(pts[n-1],pts[0]);p.moveTo(m[0],m[1]);for(let i=0;i<n;i++){const q=pts[i],m2=mid(q,pts[(i+1)%n]);p.quadraticCurveTo(q[0],q[1],m2[0],m2[1])}p.closePath()}else{p.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n-1;i++){const m2=mid(pts[i],pts[i+1]);p.quadraticCurveTo(pts[i][0],pts[i][1],m2[0],m2[1])}p.lineTo(pts[n-1][0],pts[n-1][1])}return p};
const poly=pts=>{const p=new Path2D();p.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)p.lineTo(pts[i][0],pts[i][1]);p.closePath();return p};
const fillP=(p,c,sw=0,sc=LN)=>{x.fillStyle=T(c);x.fill(p);if(sw){x.strokeStyle=T(sc);x.lineWidth=sw;x.stroke(p)}};
// shaded fill: light from (lx,ly) direction (unit); d = shade thickness
let LIGHT=[-1,-.5];
const shade=(p,c,s,d=1.6,sw=.8,lt=LIGHT)=>{x.fillStyle=T(s);x.fill(p);x.save();x.clip(p);x.translate(lt[0]*d,lt[1]*d);x.fillStyle=T(c);x.fill(p);x.restore();if(sw){x.strokeStyle=T(LN);x.lineWidth=sw;x.stroke(p)}};
const L=(d,c,w)=>{x.strokeStyle=T(c);x.lineWidth=w;x.stroke(typeof d==='string'?new Path2D(d):d)};
const E=(cx,cy,rx,ry,c,rot=0,sw=0)=>{const p=new Path2D();p.ellipse(cx,cy,rx,ry,rot,0,7);fillP(p,c,sw);return p};
const R=(a,b,c,d,col,sw=0)=>fillP(poly([[a,b],[a+c,b],[a+c,b+d],[a,b+d]]),col,sw);
const pol=(pts,c,sw=.8,s)=>{const p=poly(pts);s?shade(p,c,s,1.4,sw):fillP(p,c,sw);return p};
const sm=(pts,c,sw=.8,s,d)=>{const p=smooth(pts);s?shade(p,c,s,d||1.5,sw):fillP(p,c,sw);return p};
const pt=(p,a,l)=>{const r=a*Math.PI/180;return [p[0]+Math.sin(r)*l,p[1]+Math.cos(r)*l]}; // angle from straight-down, +toward +x
const up=(p,a,l)=>{const r=a*Math.PI/180;return [p[0]+Math.sin(r)*l,p[1]-Math.cos(r)*l]}; // angle from straight-up
// tapered capsule between a and b
const capD=(a,b,wa,wb)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,p=new Path2D();p.moveTo(a[0]+nx*wa/2,a[1]+ny*wa/2);p.lineTo(b[0]+nx*wb/2,b[1]+ny*wb/2);p.arc(b[0],b[1],wb/2,Math.atan2(ny,nx),Math.atan2(-ny,-nx),false);p.lineTo(a[0]-nx*wa/2,a[1]-ny*wa/2);p.arc(a[0],a[1],wa/2,Math.atan2(-ny,-nx),Math.atan2(ny,nx),false);p.closePath();return p};
const cap=(a,b,wa,wb,c,s,sw=.8,d=1.3)=>{const p=capD(a,b,wa,wb);s?shade(p,c,s,d,sw):fillP(p,c,sw);return p};
// hair lock ribbon along bezier
const bz=(a,b,c,d,t)=>{const u=1-t;return [u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]};
const lockP=(a,b,c,d,w0,w1,prof)=>{const N=14,Lp=[],Rp=[];for(let i=0;i<=N;i++){const t=i/N,p=bz(a,b,c,d,t),q=bz(a,b,c,d,Math.min(1,t+.02)),q0=bz(a,b,c,d,Math.max(0,t-.02));let dx=q[0]-q0[0],dy=q[1]-q0[1];const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;let w=(w0+(w1-w0)*t)/2;if(prof==='leaf')w=w0/2*Math.sin(Math.PI*Math.pow(t,.6));Lp.push([p[0]-dy*w,p[1]+dx*w]);Rp.push([p[0]+dy*w,p[1]-dx*w])}const pp=new Path2D();pp.moveTo(...Lp[0]);Lp.forEach(q=>pp.lineTo(...q));Rp.reverse().forEach(q=>pp.lineTo(...q));pp.closePath();return pp};
const lock=(a,b,c,d,w0,w1,col,sc,sw=.8,prof)=>{const p=lockP(a,b,c,d,w0,w1,prof);shade(p,col,sc,Math.max(1,w0*.2),sw);return p};
// deterministic rng
let _s=7;const rnd=()=>(_s=(_s*1664525+1013904223)>>>0)/4294967296;const seed=n=>{_s=n>>>0};
const PHASE=()=>window.PH||0;
// ----- palettes -----
const SK={kaede:{c:'#ffe1d2',s:'#eeb4a0',d:'#d9917f'},haru:{c:'#f7d4ba',s:'#dba58a',d:'#bd8468'},kid:{c:'#ffdcc6',s:'#eeb095',d:'#d58f78'}};
const HR={kaede:{c:'#56d493',s:'#2a9c64',d:'#176b46',h:'#b4f5d0'},haru:{c:'#52392a',s:'#33231a',d:'#20140e',h:'#8a6648'},hayate:{c:'#56d493',s:'#2a9c64',d:'#176b46',h:'#b4f5d0',b:'#8a5a34'},momo:{c:'#86ae5e',s:'#4d7436',d:'#33541f',h:'#cfe8a4'},baby:{c:'#86ae5e',s:'#4d7436',d:'#33541f',h:'#cfe8a4'}};

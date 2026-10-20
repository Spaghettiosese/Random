// ===== CG engine (browser) =====
const CW=480,CHH=270,S=3;
let X, MAIN, mainCtx, layerC, layerCtx;
const TAU=Math.PI*2, LINE='#2b1a30';
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function initCG(){MAIN=mkCanvas(CW*S,CHH*S);mainCtx=MAIN.getContext('2d');mainCtx.scale(S,S);X=mainCtx;layerC=mkCanvas(CW*S,CHH*S);layerCtx=layerC.getContext('2d');layerCtx.scale(S,S);for(const c of [mainCtx,layerCtx]){c.lineJoin='round';c.lineCap='round'}}
function rng(seed){let s=seed>>>0;return ()=>(s=(s*1664525+1013904223)>>>0)/4294967296}
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sinp=(f,k=1,ph=0)=>Math.sin(TAU*(f/6*k+ph)); // loops over 6 frames when k integer
function hexrgb(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mix(a,b,t){const A=hexrgb(a),B=hexrgb(b);return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],t)).toString(16).padStart(2,'0')).join('')}
// ---- basic drawing
function rect(x,y,w,h,c){X.fillStyle=c;X.fillRect(x,y,w,h)}
function grad(x0,y0,x1,y1,stops){const g=X.createLinearGradient(x0,y0,x1,y1);stops.forEach(([t,c])=>g.addColorStop(t,c));return g}
function vgrad(y0,y1,stops,x=0,w=CW){X.fillStyle=grad(0,y0,0,y1,stops);X.fillRect(x,y0,w,y1-y0)}
function glow(x,y,r,c,a=1,c2){const g=X.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,c2||'rgba(0,0,0,0)');X.globalAlpha=a;X.fillStyle=g;X.fillRect(x-r,y-r,r*2,r*2);X.globalAlpha=1}
function glowc(x,y,r,rgb,a){const g=X.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);X.fillStyle=g;X.fillRect(x-r,y-r,r*2,r*2)}
function P2(d,fill,lw=0,stroke=LINE,alpha=1){const p=typeof d==='string'?new Path2D(d):d;X.globalAlpha=alpha;if(fill){X.fillStyle=fill;X.fill(p)}if(lw){X.strokeStyle=stroke;X.lineWidth=lw;X.stroke(p)}X.globalAlpha=1;return p}
function poly(pts,fill,lw=0,stroke=LINE,alpha=1){X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.closePath();X.globalAlpha=alpha;if(fill){X.fillStyle=fill;X.fill()}if(lw){X.strokeStyle=stroke;X.lineWidth=lw;X.stroke()}X.globalAlpha=1}
function circ(x,y,r,fill,lw=0,stroke=LINE,alpha=1){X.beginPath();X.arc(x,y,r,0,TAU);X.globalAlpha=alpha;if(fill){X.fillStyle=fill;X.fill()}if(lw){X.strokeStyle=stroke;X.lineWidth=lw;X.stroke()}X.globalAlpha=1}
function ell(x,y,rx,ry,fill,rot=0,alpha=1,lw=0){X.beginPath();X.ellipse(x,y,rx,ry,rot,0,TAU);X.globalAlpha=alpha;if(fill){X.fillStyle=fill;X.fill()}if(lw){X.strokeStyle=LINE;X.lineWidth=lw;X.stroke()}X.globalAlpha=1}
function ln(pts,c,w,alpha=1){X.beginPath();pts.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.strokeStyle=c;X.lineWidth=w;X.globalAlpha=alpha;X.stroke();X.globalAlpha=1}
function curve(d,c,w,alpha=1){X.globalAlpha=alpha;X.strokeStyle=c;X.lineWidth=w;X.stroke(new Path2D(d));X.globalAlpha=1}
// layer w/ tint: draws via fn into offscreen then composites
function layer(fn,tint){const prev=X;layerCtx.clearRect(0,0,CW,CHH);X=layerCtx;X.save();fn();X.restore();
  if(tint){X.globalCompositeOperation='source-atop';for(const t of [].concat(tint)){X.globalAlpha=t.a===undefined?1:t.a;X.fillStyle=t.g?t.g:t.c;X.fillRect(0,0,CW,CHH)}X.globalAlpha=1;X.globalCompositeOperation='source-over'}
  X=prev;X.drawImage(layerC,0,0,CW,CHH)}
// ---- limbs
function chain(segs,lw=1.1){ // segs: {p,q,w1,w2,c}
  const capPath=(s,g)=>{const [p,q]=[s.p,s.q],w1=s.w1+g,w2=s.w2+g,dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,a=Math.atan2(dy,dx);
    X.beginPath();X.moveTo(p[0]+nx*w1/2,p[1]+ny*w1/2);X.lineTo(q[0]+nx*w2/2,q[1]+ny*w2/2);X.arc(q[0],q[1],w2/2,a+Math.PI/2,a-Math.PI/2,true);X.lineTo(p[0]-nx*w1/2,p[1]-ny*w1/2);X.arc(p[0],p[1],w1/2,a-Math.PI/2,a-Math.PI*1.5,true);X.closePath()};
  X.fillStyle=LINE;for(const s of segs){capPath(s,lw*2);X.fill()}
  for(const s of segs){capPath(s,0);X.fillStyle=s.c;X.fill();const sc=s.sc||shadeOf(s.c);X.save();capPath(s,0);X.clip();X.fillStyle=sc;X.fillRect(0,0,CW,CHH);const w=Math.max(s.w1,s.w2);capPath({p:[s.p[0]+LIGHT[0]*w*.3,s.p[1]+LIGHT[1]*w*.3],q:[s.q[0]+LIGHT[0]*w*.3,s.q[1]+LIGHT[1]*w*.3],w1:s.w1*.8,w2:s.w2*.8},0);X.fillStyle=s.c;X.fill();X.restore()}
}
let LIGHT=[-.7,-.35];
function shadeOf(c){return mix(c,'#3a2a5a',.28)}
const dirv=(th)=>[Math.sin(th),Math.cos(th)];
const add=(p,v,l=1)=>[p[0]+v[0]*l,p[1]+v[1]*l];
// ---- figure rig
function rig(o){
 const h=o.h,a=o.lean||0,view=o.view||'f',hw=(view==='s'?.05:o.hw||(o.fem?.088:.11))*h,pw=(view==='s'?.03:.06)*h,T=.30*h;
 const hip=[o.x,o.y],sp=[Math.sin(a),-Math.cos(a)],sc=add(hip,sp,.265*h),neck=add(hip,sp,T),perp=[Math.cos(a),Math.sin(a)];
 const J={h,hip,sc,neck,view,hw,pw};
 J.SL=add(sc,perp,-hw);J.SR=add(sc,perp,hw);J.HL=[hip[0]-pw,hip[1]];J.HR=[hip[0]+pw,hip[1]];
 const arm=(S0,t)=>{const E=add(S0,dirv(t[0]),.165*h),W=add(E,dirv(t[1]),.15*h),Hd=add(W,dirv(t[1]),.04*h);return {S:S0,E,W,H:Hd}};
 J.aL=arm(J.SL,o.aL||[.12,.1]);J.aR=arm(J.SR,o.aR||[-.12,-.1]);
 const leg=(H0,t,f)=>{const K=add(H0,dirv(t[0]),.245*h),A=add(K,dirv(t[1]),.245*h);return {H:H0,K,A,f}};
 J.lL=leg(J.HL,o.lL||[.03,0],o.fL===undefined?-1:o.fL);J.lR=leg(J.HR,o.lR||[-.03,0],o.fR===undefined?1:o.fR);
 J.headC=add(neck,[Math.sin(a+(o.tilt||0)),-Math.cos(a+(o.tilt||0))],.096*h);J.hr=.088*h;
 return J}
function drawArm(J,A,o,front){const h=J.h,sl=o.sleeve||o.top,w=h*.05,bare=o.bareArm;
 chain([{p:A.S,q:A.E,w1:w*1.05,w2:w*.9,c:bare?o.skin:sl},{p:A.E,q:A.W,w1:w*.9,w2:w*.66,c:o.cuffless||bare?o.skin:(o.fore||sl)}],o.lw||1.1);
 if(o.cuff){const d=[A.W[0]-A.E[0],A.W[1]-A.E[1]],L=Math.hypot(...d)||1;circ(A.W[0],A.W[1],w*.4,o.cuff,.8)}
 const hs=o.handR||h*.027;circ(A.H[0],A.H[1],hs,o.skin,.9);}
function drawLeg(J,Lg,o){const h=J.h,w=h*.085;
 const kind=o.legs||'pants';const c=kind==='bare'||kind==='skirt'?o.skin:o.bottom;
 const lc=o.legc||c;
 chain([{p:Lg.H,q:Lg.K,w1:w*1.0,w2:w*.72,c:lc},{p:Lg.K,q:Lg.A,w1:w*.72,w2:w*.5,c:o.shinc||lc}],o.lw||1.1);
 const f=Lg.f,sh=o.shoe||'#3a2a3a',sx=J.view==='s'?f:f;
 // shoe: ankle to toe
 const A=Lg.A,toe=[A[0]+f*h*.085,A[1]+h*.028];
 X.beginPath();X.moveTo(A[0]-f*h*.02,A[1]-h*.015);X.lineTo(A[0]+f*h*.03,A[1]-h*.015);X.quadraticCurveTo(toe[0]+f*h*.01,toe[1]-h*.03,toe[0],toe[1]+h*.004);X.lineTo(A[0]-f*h*.035,A[1]+h*.03);X.closePath();X.fillStyle=sh;X.fill();X.strokeStyle=LINE;X.lineWidth=(o.lw||1.1);X.stroke();
}
function drawTorso(J,o){const h=J.h,{SL,SR,HL,HR,hip}=J,s=J.view==='s';const wst=(o.waist||.075)*h;
 if(s){const bx=o.fem?1:0;const dir=o.facing||1;
  const pts=[[SL[0]-.04*h,SL[1]-.005*h],[SR[0]+.04*h,SR[1]-.005*h],[hip[0]+.06*h*dir+wst*.2*dir,hip[1]-.1*h],[hip[0]+.05*h,hip[1]+.03*h],[hip[0]-.05*h,hip[1]+.03*h],[hip[0]-.06*h*dir,hip[1]-.1*h]];
  poly(pts,o.top,o.lw||1.1);
 } else {
  const m=[(SL[0]+SR[0])/2,(SL[1]+SR[1])/2];
  X.beginPath();X.moveTo(SL[0]-.012*h,SL[1]+.004*h);X.quadraticCurveTo(m[0],m[1]-.028*h,SR[0]+.012*h,SR[1]+.004*h);
  X.quadraticCurveTo(SR[0]+.01*h,SR[1]+.09*h,hip[0]+wst,hip[1]-.1*h);X.lineTo(HR[0]+.028*h,HR[1]+.02*h);X.lineTo(HL[0]-.028*h,HL[1]+.02*h);X.lineTo(hip[0]-wst,hip[1]-.1*h);X.quadraticCurveTo(SL[0]-.01*h,SL[1]+.09*h,SL[0]-.012*h,SL[1]+.004*h);X.closePath();
  X.fillStyle=o.top;X.fill();X.strokeStyle=LINE;X.lineWidth=o.lw||1.1;X.stroke();
  // shade right side
  X.save();X.clip();X.fillStyle=o.topS||'rgba(0,0,0,.15)';X.globalAlpha=o.topS?1:1;X.beginPath();X.moveTo(hip[0]+wst*.2,m[1]);X.lineTo(SR[0]+.03*h,SR[1]);X.lineTo(HR[0]+.04*h,HR[1]+.03*h);X.lineTo(hip[0]+wst*.2,HR[1]+.03*h);X.fill();X.restore();
 }
}
function skirt(J,o,sw=0){const h=J.h,hip=J.hip,L=(o.skirtLen||.2)*h,wd=(o.skirtW||.13)*h,fl=(o.flare||.4);
 const yb=hip[1]+L;const sx=sw*h*.02;
 X.beginPath();X.moveTo(hip[0]-.075*h,hip[1]-.09*h);X.lineTo(hip[0]+.075*h,hip[1]-.09*h);X.bezierCurveTo(hip[0]+.09*h,hip[1],hip[0]+wd*(1+fl)+sx,yb-.05*h,hip[0]+wd*(1+fl)+sx*1.5,yb);
 X.quadraticCurveTo(hip[0]+sx,yb+.018*h,hip[0]-wd*(1+fl)+sx*1.5,yb);X.bezierCurveTo(hip[0]-wd*(1+fl)+sx,yb-.05*h,hip[0]-.09*h,hip[1],hip[0]-.075*h,hip[1]-.09*h);X.closePath();
 X.fillStyle=o.bottom;X.fill();X.strokeStyle=LINE;X.lineWidth=o.lw||1.1;X.stroke();
 X.save();X.clip();X.fillStyle=o.bottomS||'rgba(0,0,0,.15)';X.fillRect(hip[0]+.02*h,hip[1]-.1*h,.3*h,L+.2*h);X.restore();
 if(o.hem){X.save();X.clip();X.fillStyle=o.hem;X.fillRect(hip[0]-wd*3,yb-.025*h,wd*6,.05*h);X.restore()}}
// ---- heads (unit radius) ; o: view 's'|'q'|'b'|'f', dir, tilt, hair:{...}, expr
function headDraw(cx,cy,r,o){
 const dir=o.dir||1,lw=(o.lw||1.0)/r;X.save();X.translate(cx,cy);X.rotate(o.tilt||0);X.scale(dir*r,r);X.lineWidth=lw;X.lineJoin='round';
 const sk=o.skin||'#fff0e9',skS=o.skinS||'#f4cbbd',v=o.view||'s',hr=o.hair||{},e=o.expr||{};
 const fill=(d,c,stroke=true)=>{const p=new Path2D(d);X.fillStyle=c;X.fill(p);if(stroke){X.strokeStyle=LINE;X.lineWidth=lw;X.stroke(p)}return p};
 hairBack(v,hr,o);
 if(v==='b'){ // back of head: skin visible just ears/neck
  fill('M-.8,.1 C-.8,.7 -.4,1 0,1 C.4,1 .8,.7 .8,.1Z',sk);ellp(-.92,.1,.14,.2,skS);ellp(.92,.1,.14,.2,skS);
 } else if(v==='s'){
  fill('M-.88,-.05 C-.88,-.78 -.4,-1.02 .1,-1.02 C.62,-1.02 .93,-.65 .94,-.2 L1.0,.1 L1.08,.2 L.96,.27 L.97,.42 L.92,.5 L.92,.66 C.82,.95 .5,1.07 .2,1.02 C-.1,.96 -.5,.78 -.78,.46 C-.88,.3 -.88,.12 -.88,-.05Z',sk);
  X.fillStyle=skS;X.globalAlpha=.55;X.beginPath();X.ellipse(-.1,.5,.62,.4,0,0,TAU);X.fill();X.globalAlpha=1;
  ellp(-.18,.14,.16,.22,skS);
 } else { // 3/4 toward +x
  fill('M-.9,-.1 C-.9,-.78 -.42,-1.02 .1,-1.02 C.66,-1.02 1,-.7 1,-.15 C1,.3 .95,.55 .72,.8 C.52,1.02 .3,1.08 .1,1.06 C-.2,1 -.6,.8 -.82,.45 C-.9,.3 -.9,.1 -.9,-.1Z',sk);
  X.fillStyle=skS;X.globalAlpha=.5;X.beginPath();X.ellipse(-.3,.5,.55,.4,0,0,TAU);X.fill();X.globalAlpha=1;
  ellp(-.82,.12,.14,.2,skS);
 }
 face(v,e,o,lw);
 hairFront(v,hr,o,lw);
 X.restore()}
function ellp(x,y,rx,ry,c){X.beginPath();X.ellipse(x,y,rx,ry,0,0,TAU);X.fillStyle=c;X.fill();X.strokeStyle=LINE;X.lineWidth=X.lineWidth*.8;X.stroke()}
function face(v,e,o,lw){
 if(v==='b')return;
 const ic=o.iris||'#22c3a3',blush=e.blush===undefined?.4:e.blush;
 const eyeP=v==='s'?[[.5,.02,.19,.26]]:[[.28,.05,.2,.27],[.74,.04,.15,.25]];
 const mouthP=v==='s'?[.82,.62]:[.5,.6];
 X.globalAlpha=blush;X.fillStyle='#f7a0a8';X.beginPath();X.ellipse(v==='s'?.5:.5,.36,v==='s'?.28:.3,.14,0,0,TAU);X.fill();X.globalAlpha=1;
 for(const [ex,ey,rx,ry] of eyeP){
  if(e.eye==='closed'||e.eye==='happy'){X.strokeStyle=LINE;X.lineWidth=lw*1.7;X.beginPath();if(e.eye==='happy'){X.moveTo(ex-rx,ey+.06);X.quadraticCurveTo(ex,ey-.34,ex+rx,ey+.06)}else{X.moveTo(ex-rx,ey-.02);X.quadraticCurveTo(ex,ey+.2,ex+rx,ey-.02)}X.stroke()}
  else{ const gy=(e.gy||0)*.08,gx=(e.gx||0)*.08;
   X.beginPath();X.ellipse(ex,ey,rx,ry,0,0,TAU);X.fillStyle='#fff';X.fill();
   X.save();X.clip();X.fillStyle=ic;X.beginPath();X.ellipse(ex+gx+rx*.12,ey+gy+.02,rx*.78,ry*.95,0,0,TAU);X.fill();
   X.fillStyle=o.irisD||'#0b5a55';X.beginPath();X.ellipse(ex+gx+rx*.12,ey+gy-.06,rx*.78,ry*.55,0,0,TAU);X.fill();X.fillStyle='#0a2b33';X.beginPath();X.ellipse(ex+gx+rx*.12,ey+gy+.02,rx*.36,ry*.5,0,0,TAU);X.fill();
   X.fillStyle='#fff';X.beginPath();X.arc(ex+gx-rx*.1,ey+gy-ry*.35,rx*.3,0,TAU);X.fill();X.restore();
   X.strokeStyle=LINE;X.lineWidth=lw*1.8;X.beginPath();X.moveTo(ex-rx,ey+.02);X.quadraticCurveTo(ex,ey-ry*1.5,ex+rx,ey+.02);X.stroke();
   if(e.lash!==false){X.lineWidth=lw*1.1;X.beginPath();X.moveTo(ex-rx,ey+.02);X.lineTo(ex-rx-.1,ey-.08);X.stroke()}}
  if(e.brow!==false){X.strokeStyle=o.browC||'#b0527a';X.lineWidth=lw*1.1;X.beginPath();const bt=e.browT||0;X.moveTo(ex-rx,ey-ry*1.35+bt*.08);X.quadraticCurveTo(ex,ey-ry*1.75,ex+rx,ey-ry*1.3-bt*.08);X.stroke()}
 }
 const [mx,my]=mouthP;
 if(e.mouth==='open'){fill2(`M${mx-.17},${my-.02} Q${mx},${my+.1} ${mx+.17},${my-.02} Q${mx+.12},${my+.24} ${mx},${my+.24} Q${mx-.12},${my+.24} ${mx-.17},${my-.02}Z`,'#b8455a',lw)}
 else if(e.mouth==='o'){fill2(`M${mx-.09},${my} a.09,.11 0 1,0 .18,0 a.09,.11 0 1,0 -.18,0`,'#b8455a',lw)}
 else{X.strokeStyle=e.mouthC||'#a8404f';X.lineWidth=lw*1.2;X.beginPath();X.moveTo(mx-.16,my);X.quadraticCurveTo(mx,my+(e.smile===undefined?.12:e.smile),mx+.16,my-.02);X.stroke()}
 if(v==='q'){X.strokeStyle='#e2b2a4';X.lineWidth=lw*.9;X.beginPath();X.moveTo(.58,.3);X.lineTo(.64,.38);X.stroke()}
}
function fill2(d,c,lw){const p=new Path2D(d);X.fillStyle=c;X.fill(p);X.strokeStyle=LINE;X.lineWidth=lw*.9;X.stroke(p)}
// hair styles
function hairBack(v,hr,o){const c=hr.col,cs=hr.colS||c,sw=(hr.sway||0),f=(p,col=c)=>{const q=new Path2D(p);X.fillStyle=col;X.fill(q);X.strokeStyle=LINE;X.stroke(q)};
 switch(hr.style){
  case 'long': { // Mira
   if(v==='b'){f(`M-1.08,-.1 C-1.1,-1 -.5,-1.2 0,-1.2 C.5,-1.2 1.1,-1 1.08,-.1 C1.2,1.6 ${1.2+sw},3.2 ${1.0+sw*1.3},${4.4} C.5,${4.6+sw*.2} -.5,${4.6-sw*.2} ${-1.0+sw*1.3},4.4 C${-1.2+sw},3.2 -1.2,1.6 -1.08,-.1Z`);
     X.strokeStyle=cs;X.lineWidth=X.lineWidth*1.1;for(const k of [-.5,0,.5]){X.beginPath();X.moveTo(k,.6);X.quadraticCurveTo(k*1.2+sw*.3,2.4,k*1.1+sw,4.2);X.stroke()}}
   else if(v==='s'){f(`M.2,-1.1 C-.7,-1.2 -1.35,-.6 -1.25,.5 C-1.3,1.6 ${-1.4+sw},3 ${-1.2+sw*1.3},4.2 C${-.9+sw},4.5 ${-.3+sw},4.4 ${-.1+sw},4.0 C-.2,2.6 -.4,1.4 -.4,.4Z`);
     X.strokeStyle=cs;X.beginPath();X.moveTo(-.9,.6);X.quadraticCurveTo(-1+sw*.3,2.2,-.9+sw,4.0);X.stroke();X.beginPath();X.moveTo(-.6,.7);X.quadraticCurveTo(-.7+sw*.3,2.3,-.5+sw,3.9);X.stroke()}
   else {f(`M-1.1,-.3 C-1.2,-1.1 -.5,-1.2 .1,-1.2 C.7,-1.2 1.15,-.8 1.1,-.2 C1.2,1.4 ${1.1+sw},3 ${.9+sw*1.2},4.2 L${-.9+sw*1.2},4.2 C${-1.2+sw},3 -1.2,1.4 -1.1,-.3Z`)}
   break}
  case 'haru': { if(v==='b'||v==='q'||v==='s'){const k=v==='b'?1:.9;f(`M${-1.05*k},-.1 C${-1.1*k},-1 -.5,-1.15 0,-1.15 C.5,-1.15 ${1.1*k},-1 ${1.05*k},-.1 C${1.05*k},.3 .9,.55 .8,.65 L-.8,.65 C${-.9*k},.55 ${-1.05*k},.3 ${-1.05*k},-.1Z`,c)} break}
  case 'bob': { // Hana
   f(`M-1.15,-.1 C-1.2,-1.1 -.5,-1.2 0,-1.2 C.5,-1.2 1.2,-1.1 1.15,-.1 C1.2,.6 ${1.15+sw*.5},1.4 ${1.05+sw},1.7 L${-1.05+sw},1.7 C${-1.15+sw*.5},1.4 -1.2,.6 -1.15,-.1Z`);break}
  case 'tuft': { f(`M-1.05,-.1 C-1.1,-1 -.5,-1.15 0,-1.15 C.5,-1.15 1.1,-1 1.05,-.1 C1,.3 .8,.5 .7,.55 L-.7,.55 C-.9,.5 -1.05,.3 -1.05,-.1Z`);break}
 }}
function hairFront(v,hr,o,lw){const c=hr.col,cs=hr.colS||c,ch=hr.colH||c,sw=hr.sway||0;
 const f=(p,col=c,st=true)=>{const q=new Path2D(p);X.fillStyle=col;X.fill(q);if(st){X.strokeStyle=LINE;X.lineWidth=lw;X.stroke(q)}};
 const hl=(d)=>{X.strokeStyle=ch;X.lineWidth=lw*1.6;X.stroke(new Path2D(d))};
 switch(hr.style){
  case 'long':
   if(v==='b'){ hl('M-.6,-.95 Q0,-1.15 .6,-.9'); X.strokeStyle=cs;X.lineWidth=lw;X.beginPath();X.moveTo(0,-1.1);X.lineTo(0,-.5);X.stroke(); if(hr.clip)clipPlus(.7,-.55,hr.clip)}
   else if(v==='s'){ f(`M-1.05,.1 C-1.15,-1 -.4,-1.12 .15,-1.1 C.75,-1.08 1.05,-.7 1.0,-.2 C.9,-.5 .6,-.62 .3,-.55 C.1,-.2 -.1,-.1 -.12,.2 C-.3,.1 -.4,-.2 -.45,-.5 C-.7,-.3 -.9,-.1 -1.05,.1Z`);
     f(`M-.1,.2 C-.2,.6 -.1,1.2 -.18,1.5 C-.4,1.2 -.55,.7 -.5,.2Z`,c);hl('M-.7,-.9 Q0,-1.15 .7,-.85');if(hr.clip)clipPlus(.1,-.78,hr.clip)}
   else { f(`M-1.1,.1 C-1.2,-1.1 -.3,-1.2 .2,-1.15 C.8,-1.1 1.12,-.7 1.05,-.1 C.9,-.5 .6,-.6 .5,-.6 C.5,-.3 .35,-.1 .3,.15 C.15,-.2 .05,-.45 -.1,-.55 C-.4,-.4 -.8,-.2 -1.1,.1Z`);
     f(`M-1.0,.1 C-1.2,.8 ${-1.15+sw},1.6 ${-1.0+sw},2.2 C-.8,1.6 -.7,.9 -.7,.3Z`);hl('M-.7,-.95 Q0,-1.18 .7,-.9');if(hr.clip)clipPlus(.78,-.62,hr.clip)}
   break;
  case 'haru':
   if(v==='b'){f(`M-1.1,-.2 C-1.2,-1.1 -.3,-1.25 .2,-1.2 C.8,-1.15 1.15,-.8 1.1,-.1 L1.0,.3 L.8,.55 L.6,.42 L.4,.7 L.2,.5 L0,.72 L-.2,.5 L-.4,.7 L-.6,.42 L-.8,.55 L-1,.3Z`);hl('M-.5,-.95 Q0,-1.1 .5,-.9');X.strokeStyle=cs;X.lineWidth=lw;X.beginPath();X.moveTo(-.6,.1);X.lineTo(-.5,.5);X.moveTo(.2,.1);X.lineTo(.3,.55);X.stroke()}
   else f(`M-1.05,.05 C-1.15,-1.05 -.3,-1.2 .2,-1.15 C.8,-1.1 1.1,-.75 1.05,-.15 L.95,-.35 L.82,-.55 L.7,-.38 L.5,-.62 L.34,-.4 L.12,-.6 L-.05,-.35 L-.3,-.5 C-.5,-.3 -.8,-.1 -.9,.35 L-.88,.55 C-1,.4 -1.05,.2 -1.05,.05Z`);
   if(v!=='b')hl('M-.6,-.95 Q0,-1.15 .6,-.9');
   break;
  case 'bob':
   f(`M-1.1,.1 C-1.2,-1.1 -.3,-1.2 .2,-1.15 C.8,-1.1 1.15,-.7 1.1,.1 L1.0,-.35 L.8,-.55 L.55,-.35 L.3,-.55 L.05,-.35 L-.2,-.55 L-.45,-.35 L-.7,-.5 L-.9,-.3Z`);hl('M-.6,-.95 Q0,-1.15 .6,-.9');
   if(v!=='b')f(`M-1.05,.1 C-1.1,.6 -1.05,1 -.95,1.3 C-.7,1 -.6,.5 -.65,.1Z`);
   clipPlus(.75,-.6,'#26c6a6');break;
  case 'tuft':
   f(`M-1.1,.05 C-1.2,-1.1 -.3,-1.2 .2,-1.15 C.8,-1.1 1.15,-.75 1.1,.05 L.95,-.3 L.78,-.55 L.55,-.35 L.3,-.6 L.05,-.35 L-.2,-.55 L-.45,-.3 L-.7,-.5 L-.9,-.25Z`);
   f(`M-.2,-1.05 C-.1,-1.4 .2,-1.5 .4,-1.4 C.2,-1.3 .15,-1.1 .2,-.95Z`);
   f(`M.1,-.95 C.15,-.7 .2,-.5 .25,-.35 L.05,-.55 L-.05,-.4 C-.1,-.6 -.05,-.8 .1,-.95Z`,'#26c6a6');
   break;
 }}
function clipPlus(x,y,c){X.fillStyle=c;X.strokeStyle=LINE;X.lineWidth=X.lineWidth*.8;const p=new Path2D(`M${x-.12},${y-.3} h.24 v.18 h.18 v.24 h-.18 v.18 h-.24 v-.18 h-.18 v-.24 h.18Z`);X.fill(p);X.stroke(p)}
// neck + full figure
function drawNeck(J,o){const n=J.neck,hc=J.headC,w=J.h*.04;chain([{p:[n[0],n[1]+J.h*.01],q:[hc[0],hc[1]+J.hr*.4],w1:w,w2:w*.9,c:o.skin}],o.lw||1)}
function figure(o){ // returns J ; o.head = headDraw opts
 const J=rig(o);o.lw=o.lw||Math.max(.8,o.h/130);
 const order=o.order||'default';
 const drawBackArm=()=>{drawArm(J,o.frontArm==='L'?J.aR:J.aL,o)};
 if(o.pre)o.pre(J);
 // back leg(s)
 if(o.legOrder==='RL'){drawLeg(J,J.lR,o);drawLeg(J,J.lL,o)}else{drawLeg(J,J.lL,o);drawLeg(J,J.lR,o)}
 if(o.legs==='skirt'||o.legs==='dress')skirt(J,o,o.skirtSway||0);
 if(o.back)o.back(J);
 drawArm(J,o.frontArm==='L'?J.aR:J.aL,o);
 drawNeck(J,o);
 drawTorso(J,o);
 if(o.torsoDeco)o.torsoDeco(J);
 if(o.legs==='dress'&&o.skirtTop)skirt(J,o,o.skirtSway||0);
 headDraw(J.headC[0],J.headC[1],J.hr,Object.assign({lw:o.lw},o.head));
 drawArm(J,o.frontArm==='L'?J.aL:J.aR,o);
 if(o.post)o.post(J);
 return J}
// ---- scenery helpers
function stars(seed,n,y0,y1,t,col='#fff'){const r=rng(seed);for(let i=0;i<n;i++){const x=r()*CW,y=y0+r()*(y1-y0),ph=r(),tw=.5+.5*Math.sin(TAU*(t/6+ph));X.globalAlpha=.35+.65*tw;X.fillStyle=col;X.fillRect(x|0,y|0,r()<.2?2:1,r()<.2?2:1)}X.globalAlpha=1}
function skyline(seed,y,minH,maxH,col,opts={}){const r=rng(seed);let x=opts.x0||-10;while(x<CW+10){const w=opts.minW?opts.minW+r()*(opts.maxW-opts.minW):12+r()*22,h=minH+r()*(maxH-minH);rect(x,y-h,w+1,h+200,col);if(opts.win){const wr=rng(seed+(x|0));for(let wy=y-h+4;wy<y-3;wy+=5)for(let wx=x+2;wx<x+w-2;wx+=4)if(wr()<opts.winP){X.fillStyle=wr()<.5?opts.win:opts.win2||opts.win;X.fillRect(wx,wy,2,2)}}x+=w}}
function vignette(a=.5,c='0,0,0'){const g=X.createRadialGradient(CW/2,CHH/2,CHH*.45,CW/2,CHH/2,CW*.62);g.addColorStop(0,`rgba(${c},0)`);g.addColorStop(1,`rgba(${c},${a})`);X.fillStyle=g;X.fillRect(0,0,CW,CHH)}
function tintAll(c,a,op='source-over'){X.globalCompositeOperation=op;X.globalAlpha=a;X.fillStyle=c;X.fillRect(0,0,CW,CHH);X.globalAlpha=1;X.globalCompositeOperation='source-over'}
// ---- post: downsample + quantize
function downsample(){const src=mainCtx.getImageData(0,0,CW*S,CHH*S).data,out=new Uint8ClampedArray(CW*CHH*4),W3=CW*S;
 for(let y=0;y<CHH;y++)for(let x=0;x<CW;x++){let r=0,g=0,b=0;for(let j=0;j<S;j++)for(let i=0;i<S;i++){const k=((y*S+j)*W3+x*S+i)*4;r+=src[k];g+=src[k+1];b+=src[k+2]}const o=(y*CW+x)*4;out[o]=r/(S*S);out[o+1]=g/(S*S);out[o+2]=b/(S*S);out[o+3]=255}return out}
function medianCut(px,n){let boxes=[px];while(boxes.length<n){let bi=0,bs=-1;boxes.forEach((b,i)=>{if(b.length<2)return;let mn=[255,255,255],mx=[0,0,0];for(const p of b)for(let c=0;c<3;c++){mn[c]=Math.min(mn[c],p[c]);mx[c]=Math.max(mx[c],p[c])}const rg=Math.max(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])*Math.sqrt(b.length);if(rg>bs){bs=rg;bi=i}});
  const b=boxes[bi];if(!b||b.length<2)break;let mn=[255,255,255],mx=[0,0,0];for(const p of b)for(let c=0;c<3;c++){mn[c]=Math.min(mn[c],p[c]);mx[c]=Math.max(mx[c],p[c])}
  const ch=[mx[0]-mn[0],(mx[1]-mn[1])*1.2,mx[2]-mn[2]].indexOf(Math.max(mx[0]-mn[0],(mx[1]-mn[1])*1.2,mx[2]-mn[2]));b.sort((p,q)=>p[ch]-q[ch]);const m=b.length>>1;boxes.splice(bi,1,b.slice(0,m),b.slice(m))}
 return boxes.map(b=>{let r=0,g=0,bl=0;for(const p of b){r+=p[0];g+=p[1];bl+=p[2]}return [r/b.length,g/b.length,bl/b.length].map(Math.round)})}
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function makePalette(frames,n){const s=[];for(const f of frames)for(let i=0;i<CW*CHH;i+=5){s.push([f[i*4],f[i*4+1],f[i*4+2]])}return medianCut(s,n)}
function quantFrame(d,pal,dith=3){const cache=new Int16Array(32768*2).fill(-1),out=new Uint8ClampedArray(CW*CHH*4);
 for(let y=0;y<CHH;y++)for(let x=0;x<CW;x++){const i=y*CW+x,o=i*4,t=(BAY[(y&3)*4+(x&3)]/16-.47)*dith;let r=clamp(d[o]+t,0,255),g=clamp(d[o+1]+t,0,255),b=clamp(d[o+2]+t,0,255);
  const key=((r>>3)<<10)|((g>>3)<<5)|(b>>3);let j=cache[key];if(j<0){let bd=1e9;pal.forEach((c,k)=>{const q=(c[0]-r)**2*.3+(c[1]-g)**2*.59+(c[2]-b)**2*.11;if(q<bd){bd=q;j=k}});cache[key]=j}
  const c=pal[j];out[o]=c[0];out[o+1]=c[1];out[o+2]=c[2];out[o+3]=255}return out}
async function renderCG(drawScene,opts={}){const raw=[];for(let f=0;f<6;f++){mainCtx.setTransform(S,0,0,S,0,0);X=mainCtx;mainCtx.clearRect(0,0,CW,CHH);X.save();drawScene(f);X.restore();X=mainCtx;raw.push(downsample())}
 const pal=makePalette(raw,opts.colors||44);return {w:CW,h:CHH,fps:6,frames:raw.map(d=>b64(quantFrame(d,pal,opts.dither===undefined?3:opts.dither)))}}
function b64(u8){let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)}

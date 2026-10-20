// Shared bust-drawing helper for cast_a (matches hikari_source.html pipeline/style)
const W=160,H=192,K=4;
let X=null,P=null;
const DEFP={line:'#3a2030',white:'#ffffff',tear:'#d4f0ff',vein:'#e8503a',sweat:'#9fd8ff',tongue:'#ff8e9c',mouthIn:'#8a2c3c',skinD:'#c99886'};
function path(d,fill,sw){if(sw===undefined)sw=1.15;const p=new Path2D(d);if(fill){X.fillStyle=fill;X.fill(p)}if(sw){X.strokeStyle=P.line;X.lineWidth=sw;X.stroke(p)}return p}
function line(d,c,w){X.strokeStyle=c;X.lineWidth=w;X.stroke(new Path2D(d))}
function dot(x,y,r,c){X.fillStyle=c;X.beginPath();X.arc(x,y,r,0,7);X.fill()}
function ell(cx,cy,rx,ry,c,rot,sw){X.beginPath();X.ellipse(cx,cy,rx,ry,rot||0,0,7);if(c){X.fillStyle=c;X.fill()}if(sw){X.strokeStyle=P.line;X.lineWidth=sw;X.stroke()}}
function poly(pts){return 'M'+pts.map(p=>p[0].toFixed(2)+','+p[1].toFixed(2)).join(' L')+'Z'}
// flat fill + crescent shade on lower-right, outline
function mass(d,fill,sh,dx,dy,sw){const p=new Path2D(d);X.fillStyle=fill;X.fill(p);if(sh){X.save();X.clip(p);X.fillStyle=sh;X.fill(p);X.translate(-(dx===undefined?3:dx),-(dy===undefined?2:dy));X.fillStyle=fill;X.fill(p);X.restore()}
 if(sw!==0){X.strokeStyle=P.line;X.lineWidth=sw||1.15;X.stroke(p)}}
function clipped(d,fn){X.save();X.clip(new Path2D(d));fn();X.restore()}
// tapered ribbon along a cubic bezier (hair locks)
const bez=(p,t)=>{const u=1-t;return[u*u*u*p[0][0]+3*u*u*t*p[1][0]+3*u*t*t*p[2][0]+t*t*t*p[3][0],u*u*u*p[0][1]+3*u*u*t*p[1][1]+3*u*t*t*p[2][1]+t*t*t*p[3][1]]};
const bezD=(p,t)=>{const u=1-t;return[3*u*u*(p[1][0]-p[0][0])+6*u*t*(p[2][0]-p[1][0])+3*t*t*(p[3][0]-p[2][0]),3*u*u*(p[1][1]-p[0][1])+6*u*t*(p[2][1]-p[1][1])+3*t*t*(p[3][1]-p[2][1])]};
const PROF=t=>(0.5+0.5*Math.sin(Math.min(1,t/.2)*Math.PI/2))*Math.pow(1-t,0.7);
const BLUNT=t=>(0.6+0.4*Math.sin(Math.min(1,t/.15)*Math.PI/2))*(1-Math.pow(t,3.2)*.85);
function ribbon(p,w,s0,s1,wf){wf=wf||PROF;const n=18,A=[],B=[];for(let i=0;i<=n;i++){const t=i/n,c=bez(p,t),d=bezD(p,t),l=Math.hypot(d[0],d[1])||1,nx=-d[1]/l,ny=d[0]/l,ww=w*wf(t);A.push([c[0]+nx*ww*s1,c[1]+ny*ww*s1]);B.push([c[0]+nx*ww*s0,c[1]+ny*ww*s0])}return poly([...A,...B.reverse()])}
// lock(points, halfwidth, {fill, sh, hi, wf, noline})
function lock(p,w,o){o=o||{};const d=ribbon(p,w,-1,1,o.wf);path(d,o.fill||P.hair,o.noline?0:1.1);
 if(o.sh!==false)path(ribbon(p,w,.2,1,o.wf),o.sh||P.hairS,0);
 if(o.hi)path(ribbon(p,w,-.62,-.28,t=>(o.wf||PROF)(t)*Math.min(1,t/.15)*Math.min(1,(1-t)/.3)),o.hi,0);
 if(!o.noline){X.strokeStyle=P.line;X.lineWidth=1.1;X.stroke(new Path2D(d))}}
function facePath(f){const t=f.top||46,hw=f.hw,jw=f.jw,jy=f.jawY,cy=f.chinY,cw=f.cw;
 return `M80,${t} C${80+hw*.62},${t} ${80+hw},${t+10} ${80+hw},${t+30} C${80+hw},${jy-14} ${80+jw+2},${jy-6} ${80+jw},${jy} C${80+jw-1},${cy-4} ${80+cw+6},${cy} ${80+cw},${cy} L${80-cw},${cy} C${80-cw-6},${cy} ${80-jw+1},${cy-4} ${80-jw},${jy} C${80-jw-2},${jy-6} ${80-hw},${jy-14} ${80-hw},${t+30} C${80-hw},${t+10} ${80-hw*.62},${t} 80,${t}Z`}
// ---------- expressions ----------
const EX={
 open:{brow:[0,0],eye:{}},
 happy:{happy:1,brow:[-2,-.6]},
 shy:{brow:[-1,-3],eye:{w:.94,h:.85,ir:.95,dy:1.8},blush:2},
 sad:{brow:[0,-4.2],eye:{h:.92,lid:[1.5,-1.2],tear:1},blush:0},
 angry:{brow:[2.5,4.5],eye:{h:.88,ir:.92,lid:[-1.5,1.6]},vein:1},
 surprised:{brow:[-5,-.5],eye:{w:1.08,h:1.22,ir:.7,pup:.6},sweat:1}
};
function drawEye(C,o,E,idx){const e=C.eye,f=idx?1:-1;let cx=e.cx[idx],cy=e.y;const w=e.w*(E.w||1),ty=e.ty*(E.h||1),by=e.by*(E.h||1);const tilt=e.tilt||0;
 const Ax=cx+f*w,Ay=cy-tilt,Bx=cx-f*w,By=cy+tilt*.3;
 const lash=e.lash||2;
 if(E.happy||o.blink){
  if(E.happy){line(`M${Bx+f*1},${cy+3} Q${cx},${cy-7} ${Ax-f*1},${cy+3}`,P.line,lash+.2);line(`M${Ax-f*1},${cy+3} l${f*2.4},-1.4`,P.line,1.1);return}
  line(`M${Bx},${By+1} Q${cx},${cy+4.5} ${Ax},${Ay+1}`,P.line,lash);line(`M${Ax},${Ay+1} l${f*2.8},-1.4`,P.line,1.1);return}
 const eyeD=`M${Ax},${Ay} C${Ax},${Ay-ty*1.33} ${Bx},${By-ty*1.33} ${Bx},${By} C${Bx},${By+by*1.33} ${Ax},${Ay+by*1.33} ${Ax},${Ay}Z`;
 const ep=new Path2D(eyeD);X.save();X.clip(ep);X.fillStyle=P.white;X.fill(ep);
 const col=e.cols[idx],dy=E.dy||0;
 const irx=e.ir*(E.ir||1),iry=(ty+by)*.5*1.02*(E.ir&&E.ir<.8?.82:1);const icx=cx+(o.lookx||0),icy=cy+(by-ty)*.35+dy;
 ell(icx,icy,irx,iry,col.d);
 X.save();X.beginPath();X.ellipse(icx,icy,irx,iry,0,0,7);X.clip();ell(icx,icy+iry*.28,irx*1.1,iry*.82,col.m);ell(icx,icy+iry*.72,irx*.7,iry*.38,col.l);
 // top shadow
 X.fillStyle=col.d;X.globalAlpha=.9;X.fillRect(icx-irx-1,icy-iry-1,irx*2+2,iry*.55);X.globalAlpha=1;X.restore();
 ell(icx,icy+.4,irx*.42*(E.pup||1),iry*.5*(E.pup||1),col.p);
 dot(icx-2.2*f,icy-iry*.45,1.8,P.white);dot(icx+2.3*f,icy+iry*.55,.95,P.white);
 if(E.tear){ell(cx,Ay+by*.78,w*.85,1.7,P.tear);}
 if(E.lid){const lo=E.lid[0],li=E.lid[1];X.fillStyle=P.skin;X.beginPath();X.moveTo(Ax+f*4,Ay+lo);X.lineTo(Bx-f*4,By+li);X.lineTo(Bx-f*4,cy-30);X.lineTo(Ax+f*4,cy-30);X.fill();}
 X.restore();
 if(E.lid){const lo=E.lid[0],li=E.lid[1];line(`M${Ax},${Ay+lo} Q${cx},${cy+(lo+li)/2-ty*.35} ${Bx},${By+li}`,P.line,lash)}
 else line(`M${Ax},${Ay} C${Ax},${Ay-ty*1.33} ${Bx},${By-ty*1.33} ${Bx},${By}`,P.line,lash);
 line(`M${Ax},${Ay+(E.lid?E.lid[0]:0)} l${f*3},${-1.6-tilt*.3}`,P.line,1.15);
 if(e.lash2)line(`M${Ax-f*1},${Ay-2} l${f*2.4},-3`,P.line,.9);
 line(`M${Ax-f*1},${Ay+by*.9} Q${cx},${cy+by*1.1} ${Bx+f*1},${By+by*.5}`,P.skinD,.7);
}
function drawBrow(C,o,E,idx){const b=C.brow,e=C.eye,f=idx?1:-1,[r,t]=E.brow;const cx=e.cx[idx];
 const ix=cx-f*b.in,ox=cx+f*b.out,iy=b.y+r+t*.7,oy=b.y+r-t*.3,my=(iy+oy)/2-(b.arch===undefined?1.4:b.arch)+(E.happy?-.8:0);
 line(`M${ix},${iy} Q${(ix+ox)/2},${my} ${ox},${oy}`,b.col||P.hairS,b.th);}
function drawMouth(C,o,E){const m=C.mouth,my=m.y,mw=m.w,x=80;const ex=o.expr,talk=o.talk&&(o.i%2===0);const lc=P.mouthD||P.line;
 const open=(w,h,teeth)=>{path(`M${x-w},${my} Q${x},${my+.8} ${x+w},${my} Q${x+w*.85},${my+h} ${x},${my+h} Q${x-w*.85},${my+h} ${x-w},${my}Z`,P.mouthIn,1.1);
  X.save();X.clip(new Path2D(`M${x-w},${my} Q${x},${my+.8} ${x+w},${my} Q${x+w*.85},${my+h} ${x},${my+h} Q${x-w*.85},${my+h} ${x-w},${my}Z`));if(teeth)X.fillRect(0,0,0,0),(X.fillStyle=P.white,X.fillRect(x-w,my-1,w*2,Math.min(2.2,h*.4)));ell(x,my+h,w*.55,h*.5,P.tongue);X.restore()};
 const oo=(rx,ry)=>{ell(x,my+ry*.4,rx,ry,P.mouthIn,0,1.1);ell(x,my+ry*.9,rx*.6,ry*.4,P.tongue)};
 if(ex==='open'){ if(talk)open(mw*.55,4.2,0); else line(`M${x-mw},${my} Q${x},${my+(m.d||2.2)} ${x+mw},${my}`,lc,1.3)}
 else if(ex==='happy'){ if(talk)open(mw*.9,6.5,1); else path(`M${x-mw*.85},${my-.5} Q${x},${my+6} ${x+mw*.85},${my-.5} Q${x},${my+1.5} ${x-mw*.85},${my-.5}Z`,P.mouthIn,1.1)}
 else if(ex==='shy'){ if(talk)oo(mw*.28,2.6); else line(`M${x-mw*.6},${my+.4} Q${x-mw*.3},${my-1} ${x},${my+.4} Q${x+mw*.3},${my+1.8} ${x+mw*.6},${my+.2}`,lc,1.2)}
 else if(ex==='sad'){ if(talk)oo(mw*.32,3.4); else line(`M${x-mw*.7},${my+1.8} Q${x},${my-2.2} ${x+mw*.7},${my+1.8}`,lc,1.3)}
 else if(ex==='angry'){ if(talk){path(`M${x-mw*.8},${my-1.5} L${x+mw*.8},${my-1.5} L${x+mw*.65},${my+3.8} L${x-mw*.65},${my+3.8}Z`,P.white,1.1);line(`M${x},${my-1.5} L${x},${my+3.8}`,P.line,.7)} else line(`M${x-mw*.8},${my+1.2} Q${x},${my-1} ${x+mw*.8},${my+1.2}`,lc,1.4)}
 else if(ex==='surprised'){ oo(talk?mw*.46:mw*.34,talk?5.2:4)}
}
function drawFx(C,o,E,bob){const e=C.eye,hw=C.face.hw;
 const by=C.blushY||(e.y+11);
 const bl=(E.blush===undefined?(o.expr==='happy'?1:0):E.blush);
 if(bl){X.globalAlpha=bl>1?.85:.6;const k=C.blushK||1;[[80-(hw-7),-1],[80+(hw-7),1]].forEach(([bx,f])=>ell(bx,by,(bl>1?6.5:5)*k,(bl>1?2.8:2.2)*k,P.blush));X.globalAlpha=1;
  if(bl>1){[[80-(hw-7),-1],[80+(hw-7),1]].forEach(([bx,f])=>{for(let k=-1;k<=1;k++)line(`M${bx+k*2.4-1},${by+1.4} l2,-3`,P.blushD||P.blush,.8)})}}
 if(E.tear&&o.i%4>=2){const tx=e.cx[1]+e.w*.5;dot(tx,e.y+13+(o.i%4-2)*2,1.3,P.tear);dot(tx,e.y+12+(o.i%4-2)*2,.8,P.tear)}
 if(E.vein){const vx=80+hw-9,vy=e.y-22;[[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]].forEach(([a,b])=>line(`M${vx+a*.8},${vy+b*.8} L${vx+a*3.2},${vy+b*3.2}`,P.vein,1.3))}
 if(E.sweat){const sx=80+hw-3,sy=e.y-26;path(`M${sx},${sy} Q${sx+3.5},${sy+5} ${sx},${sy+7} Q${sx-3.5},${sy+5} ${sx},${sy}Z`,P.sweat,.9)}
}
function drawChar(ctx,C,o){X=ctx;P=Object.assign({},DEFP,C.P);const E=Object.assign({},EX[o.expr]);E.eye=E.eye||{};const EE=Object.assign({},E.eye,{happy:E.happy});
 if(o.expr==='shy'){EE.dx=1;o.look=1;o.lookx=-(1.8+((o.i>>1)&1)*1.1)}
 X.save();X.scale(K,K);X.lineJoin='round';X.lineCap='round';
 const bob=o.bob||0;
 X.save();X.translate(0,bob);C.backHair(o);X.restore();
 C.body(o);
 X.save();X.translate(0,bob);
 const fp=facePath(C.face);
 if(C.ears){const ey=C.eye.y+4;[-1,1].forEach(f=>{ell(80+f*(C.face.hw+.5),ey,4.2,6.5,P.skin,0,1.1);ell(80+f*(C.face.hw+1),ey,1.8,3.8,P.skinS)})}
 // neck shadow
 if(C.neckShadow)C.neckShadow(o);
 mass(fp,P.skin,P.skinS,C.face.sx||4,C.face.sy||2.5);
 // fringe shadow on forehead
 if(C.fringe)clipped(fp,()=>{X.translate(.6,3.6);X.fillStyle=P.skinS;C.fringe(o).forEach(d=>X.fill(new Path2D(d)))});
 if(C.faceMarks)C.faceMarks(o);
 if(C.nose==='bridge'){line(`M81.5,${C.eye.y+1} L83,${C.eye.y+13} Q80,${C.eye.y+16} 77.2,${C.eye.y+14.2}`,P.skinD,.9)}else{line(`M80,${C.eye.y+11} l.5,1.2`,P.skinD,1.1)}
 drawEye(C,o,EE,0);drawEye(C,o,EE,1);drawBrow(C,o,E,0);drawBrow(C,o,E,1);
 drawFx(C,o,E);drawMouth(C,o,E);
 C.frontHair(o);
 if(C.acc)C.acc(o);
 X.restore();X.restore();
}
// ---------- pipeline (as hikari_source.html) ----------
function toPix(C,o){const c=document.createElement('canvas');c.width=W*K;c.height=H*K;drawChar(c.getContext('2d'),C,o);const m=document.createElement('canvas');m.width=W*2;m.height=H*2;const mx=m.getContext('2d');mx.imageSmoothingQuality='high';mx.drawImage(c,0,0,W*2,H*2);const s=document.createElement('canvas');s.width=W;s.height=H;const sx=s.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(m,0,0,W,H);return sx.getImageData(0,0,W,H).data}
function buildPal(C){const p=Object.assign({},DEFP,C.P);return Object.values(p).map(h=>hexRGB(h))}
function hexRGB(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function buildFrame(C,o){const PAL=buildPal(C),LI=PAL[0],d=toPix(C,o),out=new Uint8ClampedArray(W*H*4),op=i=>d[i*4+3]>110;const LB=C.lineBias||.55;
 for(let i=0;i<W*H;i++){if(!op(i))continue;const a=d[i*4+3]/255;const r=d[i*4]/a,g=d[i*4+1]/a,b=d[i*4+2]/a;let bi=0,bd=1e9;PAL.forEach((c,j)=>{let q=(c[0]-r)**2*.3+(c[1]-g)**2*.59+(c[2]-b)**2*.11;if(j===0)q*=LB;if(q<bd){bd=q;bi=j}});const c=PAL[bi];out.set([c[0],c[1],c[2],255],i*4)}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(op(i))continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const X2=x+a,Y=y+b;return X2>=0&&Y>=0&&X2<W&&Y<H&&op(Y*W+X2)}))out.set([...LI,255],i*4)}
 return out}
const toURL=a=>{const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').putImageData(new ImageData(a,W,H),0,0);return c.toDataURL()};
const SWAY=[0,.6,1.2,1.6,1.2,.6,0,-.5],BOB=[0,0,1,1,1,1,0,0];
function frameOpts(expr,talk,i){return{expr,talk,i,sway:SWAY[i],bob:BOB[i],blink:expr!=='happy'&&i===6}}
function buildSet(C,expr,talk){return[...Array(8)].map((_,i)=>buildFrame(C,frameOpts(expr,talk,i)))}
const EXPRS=['open','happy','shy','sad','angry','surprised'];
function buildAll(C){const R={};for(const e of EXPRS)for(const t of [0,1])R[e+(t?'Talk':'')]=buildSet(C,e,t).map(toURL);return R}
function sheet(C,scale){scale=scale||2;const cv=document.createElement('canvas');cv.width=W*scale*6;cv.height=H*scale*2;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#5a4a6e';x.fillRect(0,0,cv.width,cv.height);
 EXPRS.forEach((e,ci)=>[0,1].forEach(t=>{const a=buildFrame(C,frameOpts(e,t,t?0:2));const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').putImageData(new ImageData(a,W,H),0,0);x.drawImage(c,ci*W*scale,t*H*scale,W*scale,H*scale)}));return cv.toDataURL()}

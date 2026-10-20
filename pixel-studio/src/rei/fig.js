// ===== figure rig =====
const SKIN={skin:'#fde7de',skinS:'#e9bcb6'};
const dirv=a=>[sin(a*D2R),cos(a*D2R)];
function skel(p){
 const s=p.s,lean=(p.lean||0)*D2R,up=[sin(lean),-cos(lean)],r=[cos(lean),sin(lean)],male=!!p.male,turn=p.turn||0;
 const T=(male?2.0:1.9)*s,Pv=[p.x,p.y],N=[Pv[0]+up[0]*T,Pv[1]+up[1]*T];
 const Sw=(male?.82:.66)*s*(1-.42*abs(turn)),Hw=(male?.5:.56)*s*(1-.3*abs(turn)),off=turn*.1*s;
 const sd=.14*s;
 const SL=[N[0]-r[0]*Sw+r[0]*off,N[1]-r[1]*Sw+r[1]*off+sd],SR=[N[0]+r[0]*Sw+r[0]*off,N[1]+r[1]*Sw+r[1]*off+sd];
 const HL=[Pv[0]-r[0]*Hw*.55,Pv[1]-r[1]*Hw*.55],HR=[Pv[0]+r[0]*Hw*.55,Pv[1]+r[1]*Hw*.55];
 const arm=(root,a)=>{const d1=dirv(a[0]),d2=dirv(a[1]);const e=[root[0]+d1[0]*1.1*s,root[1]+d1[1]*1.1*s],w=[e[0]+d2[0]*1.0*s,e[1]+d2[1]*1.0*s],h=[w[0]+d2[0]*.3*s,w[1]+d2[1]*.3*s];return{root,e,w,h}};
 const leg=(root,a)=>{const d1=dirv(a[0]),d2=dirv(a[1]);const k=[root[0]+d1[0]*1.5*s,root[1]+d1[1]*1.5*s],an=[k[0]+d2[0]*1.5*s,k[1]+d2[1]*1.5*s];return{root,k,a:an}};
 const hh=p.hd||{},ha=lean+(hh.tilt||0)*D2R;const Hc=[N[0]+sin(ha)*.66*s+(hh.dx||0)*s,N[1]-cos(ha)*.66*s+(hh.dy||0)*s];
 return{P:Pv,N,up,r,SL,SR,HL,HR,Sw,Hw,aL:arm(SL,p.armL||[8,4]),aR:arm(SR,p.armR||[-8,-4]),lL:leg(HL,p.legL||[2,0]),lR:leg(HR,p.legR||[-2,0]),H:Hc,ha}}
function figure(p){
 const S=skel(p),s=p.s,sk=p.skin||SKIN.skin,skS=p.skinS||SKIN.skinS,male=!!p.male;
 const hd=Object.assign({yaw:0,pitch:0,tilt:0,expr:'calm',gaze:[0,0]},p.hd||{});const sgn=hd.yaw>=0?1:-1;
 const g={hx:S.H[0],hy:S.H[1],s,yaw:hd.yaw,sign:sgn,wind:p.wind||0,sway:p.sway||0,back:!!p.back,tilt:hd.tilt,tilt2:S.ha,p};
 const hairF=HAIR[p.hair];
 if(p.pre)p.pre(S,g);
 if(hairF&&!p.back)hairF.back(g);
 // arms behind
 const drawArm=(A,a,spec,side)=>{spec=spec||{};const wU=(male?.36:.3)*s*(spec.wide||1),wF=(male?.28:.23)*s*(spec.wide||1),pts=[A.root,A.e,A.w],ws=[wU,wU*.86,wF*.85];
  const full=[A.root,A.e,A.w,A.h],fw=[wU,wU*.86,wF*.85,wF*.55];
  const sh=limbShape(full,fw);fillOutlined(sh,sk);shade(sh,skS,full,fw,side,.28);
  // hand
  const dx=A.h[0]-A.w[0],dy=A.h[1]-A.w[1],l=Math.hypot(dx,dy)||1;const hand=spec.hand||'open';
  X.save();X.translate(A.w[0]+dx*.5,A.w[1]+dy*.5);X.rotate(Math.atan2(dy,dx));const hr=.17*s;
  const hp=new Path2D();hp.ellipse(hr*.3,0,hr*1.25,hr*.95,0,0,TAU);X.strokeStyle=LINE;X.lineWidth=1.5;X.stroke(hp);X.fillStyle=sk;X.fill(hp);
  if(hand==='point'){const f=new Path2D();f.moveTo(hr*1.2,-hr*.4);f.lineTo(hr*2.4,-hr*.2);f.lineTo(hr*2.4,hr*.15);f.lineTo(hr*1.2,hr*.3);f.closePath();X.stroke(f);X.fill(f)}
  if(hand==='pinky'){const f=new Path2D();f.moveTo(hr*1.0,hr*.3);f.lineTo(hr*2.2,hr*.0);f.lineTo(hr*2.2,hr*.3);f.lineTo(hr*1.0,hr*.7);f.closePath();X.stroke(f);X.fill(f)}
  X.restore();
  // sleeve
  const sl=spec.sleeve===undefined?p.sleeve:spec.sleeve;
  if(sl&&sl.cover>0){const [op,ow0]=along(pts,ws,sl.cover);const k=1.12*(sl.wide||1);const ow=ow0.map(w=>w*k);const sp=limbShape(op,ow);fillOutlined(sp,sl.col);shade(sp,sl.colS||mix(sl.col,'#000000',.3),op,ow,side,.34);
   if(sl.cuff){const e=op[op.length-1],q=op[op.length-2];const dx=e[0]-q[0],dy=e[1]-q[1],ll=Math.hypot(dx,dy)||1,nx=-dy/ll,ny=dx/ll,w=ow[ow.length-1]/2;X.strokeStyle=sl.cuff;X.lineWidth=max(1.1,.09*s);X.lineCap='butt';X.beginPath();X.moveTo(e[0]+nx*w,e[1]+ny*w);X.lineTo(e[0]-nx*w,e[1]-ny*w);X.stroke();X.lineCap='round'}}
 };
 const bL=(p.armLz||'f')==='b',bR=(p.armRz||'f')==='b';
 if(bL)drawArm(S.aL,0,p.armLs,-1);if(bR)drawArm(S.aR,0,p.armRs,1);
 // legs
 const drawLeg=(L,spec,side)=>{spec=spec||{};const wT=(male?.56:.5)*s,wS=(male?.34:.3)*s;const pts=[L.root,L.k,L.a],ws=[wT,wS*1.12,wS*.78];
  const sh=limbShape(pts,ws);fillOutlined(sh,spec.skin||sk);shade(sh,skS,pts,ws,side,.25);
  const cov=spec.cover===undefined?(p.legs?p.legs.cover:0):spec.cover,col=spec.col||(p.legs&&p.legs.col)||'#222';
  if(cov>0){const [op,ow0]=along(pts,ws,cov);const ow=ow0.map(w=>w*1.1);const sp=limbShape(op,ow);fillOutlined(sp,col);shade(sp,spec.colS||(p.legs&&p.legs.colS)||mix(col,'#000',.3),op,ow,side,.34)}
  // shoe
  const dir=spec.foot===undefined?(p.foot||1):spec.foot;const shoe=spec.shoe||p.shoe||'#1d1a2b';const a=L.a;
  const fw=(male?.95:.8)*s;X.save();X.translate(a[0],a[1]);const sp=new Path2D();const ex=dir*fw,h=.28*s;sp.moveTo(-dir*.16*s,-.18*s);sp.lineTo(dir*.12*s,-.2*s);sp.quadraticCurveTo(dir*.5*s,-.12*s,ex,h*.5);sp.lineTo(ex,h);sp.lineTo(-dir*.2*s,h);sp.closePath();
  X.strokeStyle=LINE;X.lineWidth=1.6;X.stroke(sp);X.fillStyle=shoe;X.fill(sp);X.fillStyle=spec.sole||'#efe9f5';X.fillRect(Math.min(-dir*.2*s,ex),h-.07*s,Math.abs(ex+dir*.2*s),.07*s);X.restore()};
 const legOrder=(p.legFront==='L')?['R','L']:['L','R'];
 legOrder.forEach(k=>k==='L'?drawLeg(S.lL,p.legLs,-1):drawLeg(S.lR,p.legRs,1));
 // neck
 const nk=limbShape([S.N,[S.N[0]+(S.H[0]-S.N[0])*.7,S.N[1]+(S.H[1]-S.N[1])*.7]],[.32*s,.3*s]);fillOutlined(nk,sk);
 // torso
 const tt=p.torso||{col:'#444',colS:'#222',hem:0};const up=S.up,r=S.r,T=(male?2.0:1.9)*s;
 const loc=(u,v)=>[S.P[0]+r[0]*u*s+up[0]*v*s,S.P[1]+r[1]*u*s+up[1]*v*s];
 const wst=male?.52:.4,tv=T/s,turn=p.turn||0,tf=1-.42*abs(turn),sw=(male?.82:.66)*tf,hw=((male?.5:.56))*(1-.3*abs(turn));
 const sh0=turn*.1;
 const pts=[loc(-.2,tv),loc(-sw+sh0,tv-.16),loc(-sw*.92+sh0,tv-.7),loc(-wst*tf-.0,tv*.46),loc(-hw-.04,0),loc(-hw-.06-(tt.flare||0),-(tt.hem||0)),loc(hw+.06+(tt.flare||0),-(tt.hem||0)),loc(hw+.04,0),loc(wst*tf,tv*.46),loc(sw*.92+sh0,tv-.7),loc(sw+sh0,tv-.16),loc(.2,tv)];
 const tsh=Shape();tsh.poly(pts);fillOutlined(tsh.p,tt.col);
 X.save();X.clip(tsh.p);const sd=(p.shadeSide||1);const sp=[loc(sd*.1,tv),loc(sd*sw*1.3,tv),loc(sd*(hw+.5),-(tt.hem||0)-.5),loc(sd*.1,-(tt.hem||0)-.5)];poly(sp,tt.colS);X.restore();
 if(p.deco)p.deco(S,{loc,tv,sw,hw,wst,tt,g});
 // skirt
 if(p.skirt){const k=p.skirt,len=k.len||1.5,fl=k.flare||.9,wave=(k.wave||0),top=loc(0,.35*1)[1];const yb=S.P[1]+len*s,sx=S.P[0]+(k.dx||0)*s;
  const wv=(i,n)=>sin(i*1.6+wave*TAU)*.12*s*(k.amp||1)+ (k.sway||0)*s*.2;
  const top0=S.P[1]-.35*s;const wl=sx-(wst*tf+.1)*s,wr=sx+(wst*tf+.1)*s;
  const n=8;const L=[],R=[];
  const bot=[];for(let i=0;i<=n;i++){const t=i/n;bot.push([sx-fl*s+2*fl*s*t+(k.sway||0)*s*.3,yb+sin(t*7+wave*TAU)*.07*s*(k.amp||1)-abs(t-.5)*.1*s*0])}
  const sk2=new Path2D();sk2.moveTo(wl,top0);sk2.lineTo(wr,top0);sk2.lineTo(...bot[n]);for(let i=n-1;i>=0;i--)sk2.lineTo(...bot[i]);sk2.closePath();
  X.strokeStyle=LINE;X.lineWidth=1.6;X.stroke(sk2);X.fillStyle=k.col;X.fill(sk2);
  X.save();X.clip(sk2);X.fillStyle=k.colS;const sdd=(p.shadeSide||1);X.beginPath();X.moveTo(sx+sdd*.1*s,top0);X.lineTo(sx+sdd*fl*1.2*s,top0);X.lineTo(sx+sdd*fl*1.2*s,yb+s);X.lineTo(sx+sdd*fl*.4*s,yb+s);X.closePath();X.fill();
  for(let i=1;i<n;i++){const t=i/n;X.strokeStyle=k.colS;X.lineWidth=.8;X.beginPath();X.moveTo(lerp(wl,wr,t),top0);X.lineTo(bot[i][0],bot[i][1]);X.stroke()}
  if(k.hem){X.fillStyle=k.hem;X.beginPath();X.moveTo(bot[0][0],bot[0][1]-.18*s);for(let i=0;i<=n;i++)X.lineTo(bot[i][0],bot[i][1]-.18*s);for(let i=n;i>=0;i--)X.lineTo(bot[i][0],bot[i][1]+.3*s);X.fill()}
  X.restore();if(k.deco)k.deco({sx,top0,yb,fl,bot,wl,wr,n})}
 if(p.post)p.post(S,{loc,tv,g});
 // back view: hair mass on top of body
 if(hairF&&p.back)hairF.back(g);
 // head
 drawHead(S,hd,p,g,sk,skS);
 if(hairF)hairF.front(g);
 if(p.postHead)p.postHead(S,g);
 // front arms
 if(!bL)drawArm(S.aL,0,p.armLs,-1);if(!bR)drawArm(S.aR,0,p.armRs,1);
 return S}
// ===== head & face =====
function drawHead(S,hd,p,g,sk,skS){
 const s=p.s,hx=S.H[0],hy=S.H[1],yaw=hd.yaw,sgn=yaw>=0?1:-1,ay=abs(yaw),rx=.4*s,ry=.5*s;
 X.save();X.translate(hx,hy);X.rotate(hd.tilt*D2R*0+(S.ha-(p.lean||0)*D2R)*.0);X.translate(-hx,-hy);
 const top=hy-ry,cx=hx+yaw*.12*s,cy=hy+ry;
 const head=new Path2D(`M${hx},${top} C${hx+rx*.58},${top} ${hx+rx},${hy-.25*s} ${hx+rx},${hy+.1*s} C${hx+rx},${hy+.28*s} ${cx+.28*s},${hy+.45*s} ${cx+.05*s},${cy} L${cx-.05*s},${cy} C${cx-.28*s},${hy+.45*s} ${hx-rx},${hy+.28*s} ${hx-rx},${hy+.1*s} C${hx-rx},${hy-.25*s} ${hx-rx*.58},${top} ${hx},${top}Z`);
 X.strokeStyle=LINE;X.lineWidth=1.5;X.stroke(head);X.fillStyle=sk;X.fill(head);
 if(p.back){X.restore();return}
 // jaw shade
 X.save();X.clip(head);X.fillStyle=skS;X.globalAlpha=.55;X.beginPath();X.ellipse(hx-sgn*.0*s+(-sgn)*.1*s,hy+.55*s,.5*s,.2*s,0,0,TAU);X.fill();X.restore();
 if(ay>.5){ // nose bump + ear
  const ex=hx+sgn*rx*.98;const nb=new Path2D();nb.moveTo(ex,hy+.1*s);nb.lineTo(ex+sgn*.08*s*ay,hy+.2*s);nb.lineTo(ex,hy+.25*s);X.strokeStyle=LINE;X.lineWidth=1.2;X.stroke(nb);X.fillStyle=sk;X.fill(nb)}
 const pit=hd.pitch*.1*s,eyeY=hy+.1*s+pit,fx=hx+yaw*.24*s,sep=.19*s;
 const E=({calm:{o:.85,mb:0,m:'line'},soft:{o:.62,mb:.0,m:'smile'},happy:{o:0,mb:0,m:'open',arc:1},closed:{o:0,mb:0,m:'smile',arc:-1},sad:{o:.8,mb:-.6,m:'frown',br:-1},shy:{o:.62,mb:0,m:'tiny',br:.5,blush:1},surprised:{o:1.25,mb:0,m:'o',br:1.4},talk:{o:.85,mb:0,m:'talk'},smile:{o:.8,m:'smile'},angry:{o:.6,m:'frown',br:-1.6},sleep:{o:0,arc:-1,m:'tiny'}})[hd.expr]||{o:.85,m:'line'};
 const eo=hd.blink?0:E.o,arc=hd.blink&&!E.arc?-1:E.arc,fem=!p.male,ehh=(fem?.215:.17)*s,eww=(fem?.16:.13)*s;
 const ic=p.eye||'#6a4a3a',icD=p.eyeD||'#2a160e',gz=hd.gaze||[0,0];
 for(const i of [-1,1]){
  const near=(i===sgn&&ay>.001), shrink=near?1-.5*ay:1-.18*ay;
  if(ay>.88&&i===-sgn)continue;
  const ecx=fx+i*sep*(1-.4*ay)*(near?1:1),w=eww*shrink;
  if(arc||eo<.15){ // closed
   const up=arc===1?-1:1;X.strokeStyle=LINE;X.lineWidth=max(1.1,.07*s);X.beginPath();X.moveTo(ecx-w,eyeY+.02*s);X.quadraticCurveTo(ecx,eyeY+up*.1*s,ecx+w,eyeY+.02*s);X.stroke();
   if(fem){X.lineWidth=max(.9,.04*s);X.beginPath();X.moveTo(ecx+i*w,eyeY+.02*s);X.lineTo(ecx+i*(w+.05*s),eyeY-.03*s);X.stroke()}
  }else{
   const h=ehh*eo,ap=new Path2D();ap.moveTo(ecx-w,eyeY);ap.bezierCurveTo(ecx-w*.7,eyeY-h*1.3,ecx+w*.7,eyeY-h*1.3,ecx+w,eyeY);ap.bezierCurveTo(ecx+w*.7,eyeY+h*.9,ecx-w*.7,eyeY+h*.9,ecx-w,eyeY);
   X.fillStyle='#f6f1fb';X.fill(ap);X.save();X.clip(ap);
   const ir=w*.78,ix=ecx+gz[0]*w*.45,iy=eyeY+gz[1]*h*.3+h*.1;
   X.fillStyle=ic;X.beginPath();X.ellipse(ix,iy,ir,max(ir*1.2,h*.95),0,0,TAU);X.fill();X.fillStyle=icD;X.beginPath();X.ellipse(ix,iy-h*.3,ir,max(ir*.9,h*.7),0,0,TAU);X.fill();
   X.fillStyle='#fff';X.beginPath();X.arc(ix-ir*.3,iy-h*.35,max(.55,ir*.3),0,TAU);X.fill();X.restore();
   X.strokeStyle=LINE;X.lineWidth=max(1.1,.08*s);X.beginPath();X.moveTo(ecx-w,eyeY+.01*s);X.bezierCurveTo(ecx-w*.7,eyeY-h*1.35,ecx+w*.7,eyeY-h*1.35,ecx+w,eyeY);X.stroke();
   if(fem){X.lineWidth=max(.9,.045*s);X.beginPath();X.moveTo(ecx+i*w,eyeY);X.lineTo(ecx+i*(w+.06*s),eyeY-.045*s);X.stroke()}}
  // brow
  const bo=(E.br||0);const by=eyeY-.19*s-(eo>1?.05*s:0)-pit*.2;X.strokeStyle=p.browCol||p.hairCol||'#3a2a36';X.lineWidth=max(.9,.05*s);X.beginPath();X.moveTo(ecx-w*1.0,by+(i===-1?bo*.05*s:-bo*.05*s)*(bo<0?-1:1)*0+(bo<0?-bo*.06*s*(i===sgn||ay<.01?-1:-1)*0:0));
  const inner=[ecx-i*w*1.0,by-bo*.04*s*(bo>0?1:0)+(bo<0?-bo*.05*s:0)],outer=[ecx+i*w*1.0,by-(bo>0?bo*.03*s:0)+(bo<0?bo*.0:0)];
  X.beginPath();X.moveTo(inner[0],inner[1]);X.quadraticCurveTo((inner[0]+outer[0])/2,by-.03*s+(bo>0?-.02*s:0),outer[0],outer[1]+(bo<0?-bo*.0:0));X.stroke();
  if(!ay||!(near&&false)){}
  if((E.blush||hd.blush)&&s>=14){X.globalAlpha=.55;X.fillStyle='#f4a0b4';X.beginPath();X.ellipse(ecx+i*.02*s,eyeY+.17*s,.1*s*shrink,.05*s,0,0,TAU);X.fill();X.globalAlpha=1}
 }
 // nose/mouth
 const my=hy+.34*s+pit*.6,mx=fx+sgn*ay*.05*s,mw=.1*s;
 X.strokeStyle='#b24f66';X.lineWidth=max(.9,.05*s);X.fillStyle='#a8405a';
 const m=hd.mouth||E.m;
 if(m==='line'){X.beginPath();X.moveTo(mx-mw*.7,my);X.lineTo(mx+mw*.7,my+.005*s);X.stroke()}
 else if(m==='smile'){X.beginPath();X.moveTo(mx-mw,my-.01*s);X.quadraticCurveTo(mx,my+.07*s,mx+mw,my-.01*s);X.stroke()}
 else if(m==='tiny'){X.beginPath();X.moveTo(mx-mw*.5,my);X.lineTo(mx+mw*.5,my);X.stroke()}
 else if(m==='frown'){X.beginPath();X.moveTo(mx-mw*.8,my+.03*s);X.quadraticCurveTo(mx,my-.03*s,mx+mw*.8,my+.03*s);X.stroke()}
 else if(m==='open'){X.beginPath();X.moveTo(mx-mw*1.1,my-.02*s);X.quadraticCurveTo(mx,my+.05*s,mx+mw*1.1,my-.02*s);X.quadraticCurveTo(mx,my+.2*s,mx-mw*1.1,my-.02*s);X.fill()}
 else if(m==='o'){X.beginPath();X.ellipse(mx,my+.02*s,.055*s,.07*s,0,0,TAU);X.fill()}
 else if(m==='talk'){X.beginPath();X.ellipse(mx,my+.02*s,.07*s,.05*s+.03*s*(g.talk||0),0,0,TAU);X.fill()}
 if(ay<.6){X.strokeStyle=skS;X.lineWidth=max(.8,.04*s);X.beginPath();X.moveTo(fx+sgn*ay*.05*s,hy+.2*s+pit);X.lineTo(fx+sgn*ay*.05*s+.01*s,hy+.25*s+pit);X.stroke()}
 // ear
 if(p.ear!==false&&ay>.45){const ex=hx-sgn*lerp(.42,.04,(ay-.45)/.55)*s;const ep=new Path2D();ep.ellipse(ex,hy+.1*s,.07*s,.1*s,0,0,TAU);X.strokeStyle=LINE;X.lineWidth=1.2;X.stroke(ep);X.fillStyle=sk;X.fill(ep)}
 X.restore()}
// ===== hair styles =====
const HAIR={};
const RH={h:'#3d3366',s:'#2a2250',d:'#16102c',l:'#8e7ece',l2:'#c2b4f4'};
HAIR.rei={
 back(g){const {hx,hy,s,yaw,sway,wind}=g;const bx=hx-yaw*.1*s,w=.56*s,L=(g.p.hairLen||3.4)*s,wl=wind*s*.7+sway*s*.18;
  const top=hy-.12*s;
  const p=new Path2D(`M${bx-w*.95},${top} C${bx-w*1.25},${hy+.9*s} ${bx-w*1.1+wl*.5},${hy+L*.6} ${bx-w*.95+wl},${hy+L} L${bx+w*.95+wl},${hy+L} C${bx+w*1.1+wl*.5},${hy+L*.6} ${bx+w*1.25},${hy+.9*s} ${bx+w*.95},${top} Z`);
  fillOutlined(p,RH.s);X.save();X.clip(p);X.fillStyle=RH.d;X.globalAlpha=.55;X.fillRect(bx+(g.p.shadeSide||1)*.1*s,top,w*1.4,L+hy);X.globalAlpha=1;
  X.strokeStyle=RH.d;X.lineWidth=.9;for(let i=-3;i<=3;i++){X.beginPath();X.moveTo(bx+i*w*.3,top+.8*s);X.quadraticCurveTo(bx+i*w*.34+wl*.4,hy+L*.55,bx+i*w*.3+wl,hy+L);X.stroke()}
  X.strokeStyle=RH.l;X.lineWidth=max(.8,.05*s);X.globalAlpha=.7;X.beginPath();X.moveTo(bx-w*.55,top+1.2*s);X.quadraticCurveTo(bx-w*.62+wl*.4,hy+L*.5,bx-w*.55+wl,hy+L*.92);X.stroke();X.globalAlpha=1;X.restore()},
 front(g){const {hx,hy,s,yaw,sign,sway,wind,back}=g,ay=abs(yaw),rx=.4*s;
  const wl=wind*s*.4+sway*s*.1;
  const cap=new Path2D(`M${hx-rx*1.12},${hy+.15*s} C${hx-rx*1.2},${hy-.7*s} ${hx+rx*1.2},${hy-.7*s} ${hx+rx*1.12},${hy+.15*s} L${hx+rx*1.0},${hy-.12*s} L${hx-rx*1.0},${hy-.12*s}Z`);
  if(back){ // back view: full hair ball
   const bp=new Path2D(`M${hx-rx*1.15},${hy+.45*s} C${hx-rx*1.3},${hy-.75*s} ${hx+rx*1.3},${hy-.75*s} ${hx+rx*1.15},${hy+.45*s} C${hx+rx*.9},${hy+.62*s} ${hx-rx*.9},${hy+.62*s} ${hx-rx*1.15},${hy+.45*s}Z`);
   fillOutlined(bp,RH.h);X.strokeStyle=RH.l;X.lineWidth=max(.9,.06*s);X.beginPath();X.moveTo(hx-rx*.8,hy-.3*s);X.quadraticCurveTo(hx,hy-.55*s,hx+rx*.8,hy-.3*s);X.stroke();
   X.strokeStyle=RH.s;X.lineWidth=.8;X.beginPath();X.moveTo(hx,hy-.5*s);X.lineTo(hx,hy+.4*s);X.stroke();clip(g);return}
  // main skull hair (top) shifts slightly with yaw
  const sx=-sign*ay*.06*s;
  const top=new Path2D(`M${hx-rx*1.15+sx},${hy+.2*s} C${hx-rx*1.25+sx},${hy-.72*s} ${hx+rx*1.25+sx},${hy-.72*s} ${hx+rx*1.15+sx},${hy+.2*s} L${hx+rx*1.05+sx},${hy-.1*s} L${hx+rx*.55},${hy-.13*s} L${hx+rx*.5},${hy-.09*s} L${hx},${hy-.14*s} L${hx-rx*.5},${hy-.09*s} L${hx-rx*.55},${hy-.13*s} L${hx-rx*1.05+sx},${hy-.1*s}Z`);
  fillOutlined(top,RH.h,LINE,1.4);
  // bang strands
  X.strokeStyle=RH.s;X.lineWidth=.8;for(const k of [-.55,-.22,.12,.45]){X.beginPath();X.moveTo(hx+k*rx*1.8+sx*.5,hy-.5*s);X.lineTo(hx+k*rx*1.8*(1-ay*.3*sign*0)+sx*.2,hy-.12*s);X.stroke()}
  X.strokeStyle=RH.l;X.lineWidth=max(.9,.06*s);X.beginPath();X.moveTo(hx-rx*.8+sx,hy-.36*s);X.quadraticCurveTo(hx+sx,hy-.58*s,hx+rx*.75+sx,hy-.35*s);X.stroke();
  // side locks
  const lock=(side,vis)=>{const comp=side===sign?(1-ay*.93):(1-ay*.2);const lx=hx+side*rx*1.02*comp+ (side!==sign? -sign*ay*.0:0),w=.17*s*(side===sign?(1-.5*ay):1);const len=(g.p.lockLen||1.55)*s;const dw=wl*.6;
   const p=new Path2D(`M${lx-w*.5},${hy-.2*s} C${lx-w*.7},${hy+.4*s} ${lx-w*.7+dw*.3},${hy+len*.7} ${lx-w*.4+dw},${hy+len} L${lx+w*.6+dw},${hy+len} C${lx+w*.8+dw*.3},${hy+len*.7} ${lx+w*.8},${hy+.4*s} ${lx+w*.5},${hy-.2*s}Z`);
   fillOutlined(p,RH.h,LINE,1.3);X.strokeStyle=RH.l;X.lineWidth=max(.8,.04*s);X.beginPath();X.moveTo(lx-w*.1,hy+.1*s);X.lineTo(lx-w*.1+dw*.8,hy+len*.85);X.stroke()};
  if(!(ay>.88)||true){lock(-1);if(!(ay>.9&&sign>0))lock(1)}
  // clips
  if(!g.p.noClip){X.save();const cx=hx+(sign*ay>0?-1:1)*rx*.78*(1-ay*.2),cy=hy-.3*s;X.translate(cx,cy);for(const [rot,col] of [[-.5,'#a978ff'],[.5,'#6c44b8']]){X.rotate(rot);const w=.22*s,h=.05*s;const cp=new Path2D();cp.roundRect(-w/2,-h/2,w,h,h/2);X.strokeStyle=LINE;X.lineWidth=1;X.stroke(cp);X.fillStyle=col;X.fill(cp);X.rotate(-rot)}X.restore()}
  clip(g);function clip(){}}
};
const HR={h:'#4b3426',s:'#33221a',d:'#201410',l:'#7e5c46'};
HAIR.haru={
 back(g){const {hx,hy,s,back,wind,sway}=g;if(!back)return;const rx=.4*s;
  const p=new Path2D(`M${hx-rx*1.15},${hy+.35*s} C${hx-rx*1.3},${hy-.75*s} ${hx+rx*1.3},${hy-.75*s} ${hx+rx*1.15},${hy+.35*s} C${hx+rx*.9},${hy+.62*s} ${hx-rx*.9},${hy+.62*s} ${hx-rx*1.15},${hy+.35*s}Z`);
  fillOutlined(p,HR.h);X.strokeStyle=HR.l;X.lineWidth=max(.9,.06*s);X.beginPath();X.moveTo(hx-rx*.8,hy-.28*s);X.quadraticCurveTo(hx,hy-.52*s,hx+rx*.6,hy-.3*s);X.stroke();
  X.strokeStyle=HR.s;X.lineWidth=.9;for(let i=-3;i<=3;i++){X.beginPath();X.moveTo(hx+i*.1*s,hy-.4*s);X.lineTo(hx+i*.12*s+wind*s*.1,hy+.4*s)}
  for(const [a,b,c] of [[-.8,-.5,-.1],[-.3,-.62,.0],[.3,-.58,.1],[.75,-.4,.2]]){const tx=hx+a*rx*1.2+wind*s*.15,ty=hy+b*s;const t=new Path2D(`M${tx-.1*s},${ty+.1*s} L${tx+c*s*.5+wind*s*.2},${ty-.17*s} L${tx+.1*s},${ty+.1*s}Z`);fillOutlined(t,HR.h,LINE,1.1)}
  // nape
  X.fillStyle=HR.s;X.beginPath();X.moveTo(hx-rx*.7,hy+.42*s);X.lineTo(hx+rx*.7,hy+.42*s);X.lineTo(hx+rx*.45,hy+.62*s);X.lineTo(hx-rx*.45,hy+.62*s);X.fill()},
 front(g){const {hx,hy,s,yaw,sign,wind,sway,back}=g,ay=abs(yaw),rx=.4*s;if(back)return;const sx=-sign*ay*.07*s;
  const top=new Path2D(`M${hx-rx*1.12+sx},${hy+.22*s} C${hx-rx*1.3+sx},${hy-.78*s} ${hx+rx*1.3+sx},${hy-.78*s} ${hx+rx*1.12+sx},${hy+.22*s} L${hx+rx*1.0+sx},${hy-.02*s} L${hx+rx*.72},${hy-.2*s} L${hx+rx*.55},${hy-.04*s} L${hx+rx*.3},${hy-.2*s} L${hx+rx*.1},${hy-.05*s} L${hx-rx*.15},${hy-.22*s} L${hx-rx*.4},${hy-.04*s} L${hx-rx*.68},${hy-.18*s} L${hx-rx*.9+sx},${hy-.02*s}Z`);
  fillOutlined(top,HR.h,LINE,1.4);X.strokeStyle=HR.l;X.lineWidth=max(.9,.06*s);X.beginPath();X.moveTo(hx-rx*.7+sx,hy-.4*s);X.quadraticCurveTo(hx+sx,hy-.62*s,hx+rx*.7+sx,hy-.38*s);X.stroke();
  X.strokeStyle=HR.s;X.lineWidth=.8;for(const k of[-.5,-.1,.3]){X.beginPath();X.moveTo(hx+k*rx*1.8+sx*.5,hy-.55*s);X.lineTo(hx+k*rx*1.8*.9+sx*.2,hy-.18*s);X.stroke()}
  // tufts
  for(const [a,b,c] of [[-.5,-.62,-.2],[.1,-.68,.1],[.55,-.55,.3]]){const tx=hx+a*rx*1.2+sx,ty=hy+b*s;const t=new Path2D(`M${tx-.09*s},${ty+.08*s} L${tx+c*s*.45+wind*s*.2},${ty-.15*s} L${tx+.09*s},${ty+.08*s}Z`);fillOutlined(t,HR.h,LINE,1.1)}
  // sideburns
  for(const side of [-1,1]){if(side===sign&&ay>.8)continue;const lx=hx+side*rx*.98*(side===sign?(1-ay*.9):1);const p=new Path2D(`M${lx-.05*s},${hy-.05*s} L${lx+.07*s},${hy-.05*s} L${lx+.05*s},${hy+.25*s} L${lx-.03*s},${hy+.2*s}Z`);fillOutlined(p,HR.h,LINE,1)}}
};

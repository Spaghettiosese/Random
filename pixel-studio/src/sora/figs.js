// ---------- character kit ----------
const OL='#2a1c3c';
const HARU={skin:'#f6d3bc',skinS:'#dba88f',skinD:'#c48a74',hair:'#5c3d2c',hairS:'#3c2619',hairL:'#8a6045',eye:'#6e4020',
 jac:'#26345f',jacS:'#18213f',jacL:'#3c4f8a',trim:'#f4f4ff',trimS:'#c9c9e4',gold:'#ffd54a',shirt:'#f6f6ff',shirtS:'#c9cbe6',pants:'#1c1c28',pantsS:'#101018',shoe:'#15131c'};
const SORA={skin:'#fff0ec',skinS:'#f1c6bf',skinD:'#e1a5a5',hair:'#e4e0fa',hairS:'#b6add9',hairD:'#8c83c2',hairL:'#ffffff',eye:'#ff6fae',eyeD:'#b3307a',
 navy:'#2b2f6b',navyS:'#1b1d4a',navyL:'#4a50a0',pink:'#ff6fae',pinkS:'#c93f85',gold:'#ffd54a',cream:'#f3f0ff',creamS:'#cdc8ea',shoe:'#2b2f6b'};
// limb: stroked capsule polyline with cel shade. pts [[x,y],...]
function limb(x,pts,w,col,shade,o={}){const ol=o.ol||OL;
 lineP(x,pts,ol,w+1.7);lineP(x,pts,shade||col,w);
 if(shade){const lx=o.lx===undefined?-1:o.lx,ly=o.ly||0;const off=pts.map(p=>[p[0]+lx*w*.2,p[1]+ly*w*.2]);lineP(x,off,col,w*.62)}}
function shadeIn(x,path,fn){x.save();x.clip(path);fn();x.restore()}
// fill a shape with outline
function shape(x,d,col,o={}){const p=new Path2D(d);x.fillStyle=col;x.fill(p);if(o.shade){shadeIn(x,p,()=>{x.fillStyle=o.shade;x.fill(new Path2D(o.shadeD))})}x.strokeStyle=o.ol||OL;x.lineWidth=o.sw||1;x.stroke(p);return p}
function hand(x,p,r,skin,skinS,ang=0){ell(x,p[0],p[1],r,r*1.15,skin,OL,.9,ang)}
// -------- heads ----------
// profile head facing right if dir=1. hs=head height. o: {C: palette, who:'haru'|'sora', sway, expr, gaze}
function headProfile(x,cx,cy,hs,dir,o){const C=o.C,u=hs;x.save();x.translate(cx,cy);x.scale(dir,1);
 const who=o.who;
 if(who==='sora'){// back hair first
  const sw=o.sway||0;
  const tail=`M${-.1*u},${-.42*u} C${-.6*u},${-.35*u} ${(-.8+sw*.02)*u},${.5*u} ${(-.7+sw*.04)*u},${1.6*u} C${(-.5+sw*.04)*u},${1.7*u} ${(-.3+sw*.02)*u},${1.2*u} ${-.05*u},${.3*u}Z`;
  if(o.hairBackLen!==0){shape(x,tail,C.hairS,{sw:.9})}
 }
 // skin face
 const face=`M${.18*u},${-.34*u} C${.30*u},${-.28*u} ${.34*u},${-.16*u} ${.34*u},${-.08*u} L${.33*u},${-.02*u} C${.38*u},${.02*u} ${.44*u},${.07*u} ${.43*u},${.10*u} C${.40*u},${.12*u} ${.36*u},${.12*u} ${.35*u},${.14*u} C${.36*u},${.17*u} ${.35*u},${.19*u} ${.33*u},${.20*u} C${.35*u},${.24*u} ${.33*u},${.30*u} ${.28*u},${.36*u} C${.22*u},${.42*u} ${.12*u},${.42*u} ${.0},${.36*u} C${-.12*u},${.28*u} ${-.18*u},${.16*u} ${-.18*u},${-.1*u} L${-.1*u},${-.4*u}Z`;
 shape(x,face,C.skin,{sw:.9});
 // jaw shade
 x.save();x.clip(new Path2D(face));x.fillStyle=C.skinS;x.beginPath();x.moveTo(-.2*u,.1*u);x.quadraticCurveTo(.05*u,.18*u,.3*u,.44*u);x.lineTo(-.2*u,.5*u);x.fill();x.restore();
 // ear
 ell(x,-.06*u,.1*u,.055*u,.09*u,C.skin,OL,.7);
 // eye
 const ex=.22*u,ey=-.02*u;
 if(o.expr==='closed'||o.expr==='smile'){x.strokeStyle=OL;x.lineWidth=Math.max(.8,u*.045);x.beginPath();x.moveTo(ex-.07*u,ey);x.quadraticCurveTo(ex,ey+(o.expr==='smile'?-.07:.05)*u,ex+.06*u,ey);x.stroke()}
 else{ell(x,ex,ey,.055*u,.085*u,C.eye,null);ell(x,ex+.01*u,ey-.03*u,.05*u,.045*u,C.eyeD||OL,null);x.fillStyle='#fff';x.fillRect(ex-.03*u,ey-.045*u,Math.max(.8,.03*u),Math.max(.8,.03*u));
  x.strokeStyle=OL;x.lineWidth=Math.max(.9,u*.05);x.beginPath();x.moveTo(ex-.08*u,ey-.07*u);x.quadraticCurveTo(ex,ey-.12*u,ex+.08*u,ey-.06*u);x.stroke()}
 // brow
 x.strokeStyle=C.hairS;x.lineWidth=Math.max(.8,u*.04);x.beginPath();x.moveTo(ex-.08*u,ey-.15*u);x.lineTo(ex+.06*u,ey-.13*u);x.stroke();
 // mouth
 x.strokeStyle=C.mouth||'#b4505e';x.lineWidth=Math.max(.7,u*.035);x.beginPath();
 if(o.expr==='sing'||o.expr==='open'){x.fillStyle='#7c2442';x.beginPath();x.ellipse(.33*u,.23*u,.05*u,.06*u,0,0,TAU);x.fill()}
 else{x.moveTo(.3*u,.22*u);x.quadraticCurveTo(.34*u,.25*u+(o.expr==='smile'?.01*u:0),.36*u,.22*u);x.stroke()}
 if(o.blush){ell(x,.16*u,.15*u,.07*u,.035*u,'#ff9fae',null)}
 // hair
 if(who==='haru'){
  const hair=`M${-.28*u},${.06*u} C${-.4*u},${-.2*u} ${-.3*u},${-.5*u} ${0},${-.52*u} C${.2*u},${-.55*u} ${.36*u},${-.42*u} ${.36*u},${-.22*u} L${.33*u},${-.18*u} L${.28*u},${-.24*u} L${.24*u},${-.16*u} L${.16*u},${-.26*u} L${.1*u},${-.14*u} L${.0},${-.1*u} C${-.04*u},${-.04*u} ${-.1*u},${.02*u} ${-.12*u},${.18*u} L${-.16*u},${.16*u} L${-.2*u},${.26*u}Z`;
  shape(x,hair,C.hair,{sw:.9});
  x.save();x.clip(new Path2D(hair));x.fillStyle=C.hairS;x.beginPath();x.moveTo(-.4*u,0);x.lineTo(-.04*u,-.2*u);x.lineTo(-.05*u,.3*u);x.lineTo(-.4*u,.3*u);x.fill();
  x.strokeStyle=C.hairL;x.lineWidth=Math.max(.8,u*.05);x.beginPath();x.moveTo(.04*u,-.44*u);x.quadraticCurveTo(.22*u,-.44*u,.3*u,-.3*u);x.stroke();x.restore();
  // spike
  poly(x,[[.0,-.5*u],[-.06*u,-.62*u],[.1*u,-.52*u]],C.hair,OL,.8);
 } else if(who==='sora'){
  const hair=`M${-.3*u},${.1*u} C${-.46*u},${-.2*u} ${-.34*u},${-.54*u} ${0},${-.55*u} C${.22*u},${-.57*u} ${.37*u},${-.44*u} ${.35*u},${-.26*u} C${.3*u},${-.34*u} ${.2*u},${-.32*u} ${.14*u},${-.2*u} L${.08*u},${-.16*u} C${.0},${-.12*u} ${-.08*u},${-.08*u} ${-.1*u},${.1*u} C${-.1*u},${.3*u} ${-.14*u},${.5*u} ${-.18*u},${.7*u}Z`;
  shape(x,hair,C.hair,{sw:.9});
  x.save();x.clip(new Path2D(hair));x.fillStyle=C.hairS;x.beginPath();x.moveTo(-.5*u,0);x.lineTo(-.06*u,-.1*u);x.lineTo(-.1*u,.8*u);x.lineTo(-.5*u,.8*u);x.fill();
  x.strokeStyle='#fff';x.lineWidth=Math.max(.8,u*.05);x.beginPath();x.moveTo(.04*u,-.46*u);x.quadraticCurveTo(.2*u,-.44*u,.28*u,-.34*u);x.stroke();x.restore();
  // bun + ribbon
  circ(x,-.18*u,-.56*u,.16*u,C.hair,OL,.9);ell(x,-.16*u,-.54*u,.09*u,.07*u,C.hairS,null);
  poly(x,[[-.06*u,-.5*u],[.02*u,-.62*u],[.04*u,-.46*u]],C.pink,OL,.6);poly(x,[[-.06*u,-.5*u],[-.14*u,-.42*u],[-.02*u,-.4*u]],C.pink,OL,.6);
  starP(x,.2*u,-.4*u,.07*u,C.gold,0,OL,.5);
 }
 x.restore()}
// back-of-head. who haru: short hair; sora: hair + (long hair drawn separately)
function headBack(x,cx,cy,hs,o){const C=o.C,u=hs;x.save();x.translate(cx,cy);x.rotate(o.rot||0);
 if(o.who==='sora'){
  const sw=o.sway||0;
  // long hair mass first (behind neck? hair in front of shoulders)
  const len=o.len===undefined?2.3:o.len;
  const mass=`M${-.46*u},${-.1*u} C${-.6*u},${.6*u} ${(-.66+sw*.02)*u},${len*.7*u} ${(-.56+sw*.04)*u},${len*u} C${-.3*u},${(len+.12)*u} ${.3*u},${(len+.1)*u} ${(.56+sw*.04)*u},${len*u} C${(.66+sw*.02)*u},${len*.7*u} ${.6*u},${.6*u} ${.46*u},${-.1*u}Z`;
  shape(x,mass,C.hair,{sw:.9});
  x.save();x.clip(new Path2D(mass));x.fillStyle=C.hairS;x.beginPath();x.moveTo(.1*u,.2*u);x.lineTo(.7*u,.1*u);x.lineTo(.7*u,3*u);x.lineTo(.0,3*u);x.fill();
  x.strokeStyle=C.hairD;x.lineWidth=.8;for(const k of [-.3,-.05,.18,.34]){x.beginPath();x.moveTo(k*u,.2*u);x.quadraticCurveTo((k*1.1+sw*.01)*u,len*.5*u,(k*1.05+sw*.03)*u,len*u);x.stroke()}
  x.strokeStyle='#fff';x.lineWidth=Math.max(.8,u*.05);x.beginPath();x.moveTo(-.34*u,.3*u);x.quadraticCurveTo(-.4*u,len*.5*u,(-.36+sw*.03)*u,len*.9*u);x.stroke();x.restore();
  // skull
  const sk=`M${-.46*u},${-.05*u} C${-.5*u},${-.5*u} ${-.3*u},${-.58*u} 0,${-.58*u} C${.3*u},${-.58*u} ${.5*u},${-.5*u} ${.46*u},${-.05*u} C${.44*u},${.2*u} ${.2*u},${.3*u} 0,${.3*u} C${-.2*u},${.3*u} ${-.44*u},${.2*u} ${-.46*u},${-.05*u}Z`;
  shape(x,sk,C.hair,{sw:.9});
  x.save();x.clip(new Path2D(sk));x.fillStyle=C.hairS;x.beginPath();x.moveTo(-.1*u,-.1*u);x.quadraticCurveTo(.3*u,.1*u,.5*u,.2*u);x.lineTo(.5*u,.4*u);x.lineTo(-.1*u,.4*u);x.fill();
  x.strokeStyle='#fff';x.lineWidth=Math.max(.9,u*.06);x.beginPath();x.moveTo(-.3*u,-.38*u);x.quadraticCurveTo(0,-.5*u,.28*u,-.4*u);x.stroke();
  x.strokeStyle=C.hairD;x.lineWidth=.7;x.beginPath();x.moveTo(0,-.55*u);x.lineTo(0,.2*u);x.stroke();x.restore();
  // side bun
  circ(x,-.42*u,-.5*u,.17*u,C.hair,OL,.9);ell(x,-.4*u,-.46*u,.1*u,.08*u,C.hairS,null);
  poly(x,[[-.3*u,-.44*u],[-.18*u,-.58*u],[-.2*u,-.38*u]],C.pink,OL,.6);
  starP(x,.34*u,-.3*u,.07*u,C.gold,0,OL,.5);
 } else { // haru
  const sk=`M${-.43*u},${.05*u} C${-.5*u},${-.35*u} ${-.34*u},${-.56*u} 0,${-.56*u} C${.34*u},${-.56*u} ${.5*u},${-.35*u} ${.43*u},${.05*u} C${.42*u},${.2*u} ${.3*u},${.26*u} ${.2*u},${.3*u} L${.1*u},${.2*u} L${0},${.3*u} L${-.1*u},${.2*u} L${-.2*u},${.3*u} C${-.3*u},${.26*u} ${-.42*u},${.2*u} ${-.43*u},${.05*u}Z`;
  // ears
  ell(x,-.44*u,.05*u,.07*u,.1*u,C.skin,OL,.7);ell(x,.44*u,.05*u,.07*u,.1*u,C.skin,OL,.7);
  shape(x,sk,C.hair,{sw:.9});
  x.save();x.clip(new Path2D(sk));x.fillStyle=C.hairS;x.beginPath();x.moveTo(-.5*u,.02*u);x.quadraticCurveTo(0,-.15*u,.5*u,.02*u);x.lineTo(.5*u,.4*u);x.lineTo(-.5*u,.4*u);x.fill();
  x.strokeStyle=C.hairL;x.lineWidth=Math.max(.9,u*.06);x.beginPath();x.moveTo(-.28*u,-.36*u);x.quadraticCurveTo(0,-.5*u,.26*u,-.38*u);x.stroke();
  x.strokeStyle=C.hairS;x.lineWidth=.8;for(const k of [-.25,0,.22]){x.beginPath();x.moveTo(k*u,-.5*u);x.lineTo((k+.05)*u,.0);x.stroke()}x.restore();
  poly(x,[[-.12*u,-.54*u],[-.04*u,-.68*u],[.06*u,-.55*u]],C.hair,OL,.8);poly(x,[[.12*u,-.52*u],[.26*u,-.6*u],[.3*u,-.46*u]],C.hair,OL,.8);
 }
 x.restore()}
// 3/4 front-ish face. yaw (-1 left .. 1 right), gaze (-1..1) x, gazeY, expr: calm|smile|closed|open|sing|sad|cry
function headFace(x,cx,cy,hs,o){const C=o.C,u=hs,yaw=o.yaw||0,who=o.who;x.save();x.translate(cx,cy);x.rotate(o.rot||0);
 const sw=o.sway||0;
 if(who==='sora'){// back hair mass behind
  const len=o.len===undefined?2.2:o.len;
  shape(x,`M${-.5*u},${-.1*u} C${-.66*u},${.6*u} ${(-.7+sw*.02)*u},${len*.7*u} ${(-.6+sw*.04)*u},${len*u} L${(.6+sw*.04)*u},${len*u} C${(.7+sw*.02)*u},${len*.7*u} ${.66*u},${.6*u} ${.5*u},${-.1*u}Z`,C.hairS,{sw:.9});
  circ(x,(-.4+yaw*.05)*u,-.52*u,.17*u,C.hair,OL,.9);ell(x,(-.38+yaw*.05)*u,-.48*u,.1*u,.08*u,C.hairS,null);
 }
 const face=`M${-.4*u},${-.12*u} C${-.4*u},${-.45*u} ${-.2*u},${-.52*u} 0,${-.52*u} C${.2*u},${-.52*u} ${.4*u},${-.45*u} ${.4*u},${-.12*u} C${.4*u},${.12*u} ${.3*u},${.3*u} ${.14*u},${.4*u} C${.07*u},${.44*u} ${-.07*u},${.44*u} ${-.14*u},${.4*u} C${-.3*u},${.3*u} ${-.4*u},${.12*u} ${-.4*u},${-.12*u}Z`;
 shape(x,face,C.skin,{sw:.9});
 x.save();x.clip(new Path2D(face));x.fillStyle=C.skinS;x.beginPath();x.moveTo((yaw>=0?.1:-.1)*u,.3*u);x.quadraticCurveTo(0,.38*u,(yaw>=0?-.2:.2)*u,.2*u);x.lineTo((yaw>=0?-.5:.5)*u,.6*u);x.lineTo((yaw>=0?.5:-.5)*u,.6*u);x.fill();x.restore();
 const fx=yaw*.14*u;// feature center shift
 const ey=.03*u,sep=.19*u*(1-.2*Math.abs(yaw));
 const eyeAt=(ex,sc,side)=>{ // side -1 left +1 right
  const w=.1*u*sc;
  if(o.expr==='closed'||o.expr==='smile'||o.expr==='cry'&&0){x.strokeStyle=OL;x.lineWidth=Math.max(.9,u*.05);x.beginPath();x.moveTo(ex-w,ey);x.quadraticCurveTo(ex,ey+(o.expr==='smile'?-.09*u:.07*u),ex+w,ey);x.stroke();return}
  const gz=(o.gaze||0)*.03*u,gy=(o.gazeY||0)*.03*u;
  ell(x,ex,ey,w,.1*u,'#fff',null);
  ell(x,ex+gz,ey+gy,w*.78,.098*u,C.eye,null);ell(x,ex+gz,ey+gy-.03*u,w*.78,.06*u,C.eyeD||'#3a1c10',null);
  x.fillStyle='#fff';x.fillRect(ex+gz-w*.5,ey+gy-.06*u,Math.max(.9,.035*u),Math.max(.9,.035*u));
  x.strokeStyle=OL;x.lineWidth=Math.max(1,u*.06);x.beginPath();x.moveTo(ex-w*1.1,ey-.02*u);x.quadraticCurveTo(ex,ey-.14*u,ex+w*1.1,ey-.02*u);x.stroke();
  if(o.expr==='cry'){ell(x,ex,ey+.1*u,w*.8,.03*u,'#c6ecff',null)}};
 eyeAt(fx-sep,1-.18*Math.max(0,yaw),-1);eyeAt(fx+sep,1-.18*Math.max(0,-yaw),1);
 // brows
 x.strokeStyle=C.hairS;x.lineWidth=Math.max(.8,u*.04);
 const bsad=(o.expr==='sad'||o.expr==='cry');
 for(const s of [-1,1]){const bx=fx+s*sep;x.beginPath();x.moveTo(bx-.09*u,ey-.15*u+(bsad&&s<0?.02:0)*u);x.lineTo(bx+.09*u,ey-.17*u+(bsad&&s>0?.02:0)*u);x.stroke()}
 // nose
 x.strokeStyle=C.skinD;x.lineWidth=.8;x.beginPath();x.moveTo(fx,ey+.12*u);x.lineTo(fx+.02*u,ey+.17*u);x.stroke();
 // mouth
 const mx=fx,my=.25*u;
 if(o.expr==='sing'||o.expr==='open'){x.fillStyle='#7c2442';x.beginPath();x.ellipse(mx,my+.02*u,.07*u,.08*u,0,0,TAU);x.fill();ell(x,mx,my+.06*u,.04*u,.025*u,'#ff8a9a',null)}
 else{x.strokeStyle=C.mouth||'#b4505e';x.lineWidth=Math.max(.8,u*.04);x.beginPath();if(o.expr==='smile'||o.expr==='closed'&&o.smileM){x.moveTo(mx-.08*u,my-.01*u);x.quadraticCurveTo(mx,my+.07*u,mx+.08*u,my-.01*u)}else if(bsad){x.moveTo(mx-.05*u,my+.03*u);x.quadraticCurveTo(mx,my-.01*u,mx+.05*u,my+.03*u)}else{x.moveTo(mx-.06*u,my);x.quadraticCurveTo(mx,my+.04*u,mx+.06*u,my)}x.stroke()}
 if(o.blush){ell(x,fx-sep*1.05,.18*u,.09*u,.045*u,'#ff9fae',null);ell(x,fx+sep*1.05,.18*u,.09*u,.045*u,'#ff9fae',null)}
 // hair front
 if(who==='sora'){
  const hair=`M${-.46*u},${.05*u} C${-.54*u},${-.4*u} ${-.3*u},${-.6*u} 0,${-.6*u} C${.3*u},${-.6*u} ${.54*u},${-.4*u} ${.46*u},${.05*u} C${.44*u},${-.1*u} ${.38*u},${-.2*u} ${.3*u},${-.24*u} L${.24*u},${-.12*u} L${.17*u},${-.22*u} L${.1*u},${-.1*u} L${.04*u},${-.22*u} L${-.04*u},${-.1*u} L${-.1*u},${-.22*u} L${-.17*u},${-.1*u} L${-.24*u},${-.22*u} L${-.3*u},${-.12*u} L${-.36*u},${-.22*u} C${-.42*u},${-.14*u} ${-.46*u},${-.04*u} ${-.46*u},${.05*u}Z`;
  shape(x,hair,C.hair,{sw:.9});
  x.save();x.clip(new Path2D(hair));x.fillStyle=C.hairS;x.beginPath();x.moveTo(0,-.2*u);x.lineTo(.5*u,-.3*u);x.lineTo(.5*u,0);x.lineTo(0,.0);x.fill();x.strokeStyle='#fff';x.lineWidth=Math.max(.9,u*.05);x.beginPath();x.moveTo(-.3*u,-.42*u);x.quadraticCurveTo(0,-.56*u,.28*u,-.44*u);x.stroke();x.restore();
  // side locks
  for(const s of [-1,1]){shape(x,`M${s*.4*u},${-.2*u} C${s*.5*u},${.1*u} ${(s*.54+sw*.02)*u},${.6*u} ${(s*.5+sw*.03)*u},${1.0*u} C${s*.42*u},${.7*u} ${s*.38*u},${.3*u} ${s*.36*u},${.0}Z`,C.hair,{sw:.8})}
  poly(x,[[-.34*u,-.4*u],[-.2*u,-.52*u],[-.2*u,-.34*u]],C.pink,OL,.6);poly(x,[[-.34*u,-.4*u],[-.48*u,-.32*u],[-.36*u,-.26*u]],C.pink,OL,.6);
  starP(x,.3*u,-.34*u,.075*u,C.gold,0,OL,.5);
 } else {
  const hair=`M${-.44*u},${.02*u} C${-.52*u},${-.4*u} ${-.3*u},${-.6*u} 0,${-.6*u} C${.3*u},${-.6*u} ${.52*u},${-.4*u} ${.44*u},${.02*u} L${.38*u},${-.14*u} L${.3*u},${-.2*u} L${.22*u},${-.1*u} L${.14*u},${-.22*u} L${.04*u},${-.1*u} L${-.06*u},${-.24*u} L${-.14*u},${-.12*u} L${-.24*u},${-.22*u} L${-.32*u},${-.12*u} L${-.4*u},${-.16*u}Z`;
  shape(x,hair,C.hair,{sw:.9});x.save();x.clip(new Path2D(hair));x.strokeStyle=C.hairL;x.lineWidth=Math.max(.9,u*.05);x.beginPath();x.moveTo(-.3*u,-.42*u);x.quadraticCurveTo(0,-.55*u,.3*u,-.42*u);x.stroke();x.restore();
  poly(x,[[-.1*u,-.58*u],[-.02*u,-.7*u],[.08*u,-.58*u]],C.hair,OL,.8);
 }
 x.restore()}

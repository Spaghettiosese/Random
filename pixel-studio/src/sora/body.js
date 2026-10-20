// ---------- bodies ----------
function stand(cx,fy,H,o={}){const m=o.sex==='m',sh=(m?.135:.105)*H,hp=(m?.06:.07)*H,lean=o.lean||0;
 const J={H,sex:o.sex||'f'};
 J.hs=.143*H;J.neck=[cx+lean*.5,fy-.83*H];J.head=[cx+lean*.6,fy-.915*H];
 const sy=fy-.805*H;
 J.shL=[cx-sh+lean*.4,sy];J.shR=[cx+sh+lean*.4,sy];
 J.elL=[cx-sh-.01*H,fy-.62*H];J.elR=[cx+sh+.01*H,fy-.62*H];J.haL=[cx-sh-.015*H,fy-.45*H];J.haR=[cx+sh+.015*H,fy-.45*H];
 J.hip=[cx,fy-.52*H];J.hpL=[cx-hp,fy-.5*H];J.hpR=[cx+hp,fy-.5*H];
 J.knL=[cx-hp*.9,fy-.27*H];J.knR=[cx+hp*.9,fy-.27*H];J.anL=[cx-hp*.8,fy-.04*H];J.anR=[cx+hp*.8,fy-.04*H];
 J.toeL=[cx-hp*.8-.02*H,fy];J.toeR=[cx+hp*.8+.02*H,fy];J.fy=fy;return J}
function legsDraw(x,J,S){const H=J.H,w=(J.sex==='m'?.062:.052)*H;
 for(const s of ['L','R']){const hp=J['hp'+s],kn=J['kn'+s],an=J['an'+s],toe=J['toe'+s];
  const dir=Math.sign(toe[0]-an[0])||1;
  // shoe
  const col=S.legCol,sh=S.legShade;
  if(S.legs==='pants'){limb(x,[hp,kn,an],w,col,sh,{lx:-1})}
  else {limb(x,[hp,kn,an],w*(S.socks?.88:.8),S.skin,S.skinS,{lx:-1});if(S.socks)limb(x,[[kn[0],kn[1]+.05*H],an],w*.9,S.socks,S.socksS||S.socks)}
  const fw=.045*H;poly(x,[[an[0]-dir*.02*H,an[1]-.02*H],[an[0]+dir*.012*H,an[1]-.02*H],[toe[0]+dir*.03*H,toe[1]-.012*H],[toe[0]+dir*.03*H,toe[1]],[an[0]-dir*.028*H,toe[1]]],S.shoe,OL,.9)}}
function torsoPath(J,S){const H=J.H,m=J.sex==='m';const {shL,shR,hip,neck}=J;
 const cx=(shL[0]+shR[0])/2,sw=Math.max(.05*H,(shR[0]-shL[0])/2);
 const wy=shL[1]+(hip[1]-shL[1])*.55,wk=m?.8:.66,hk=m?.82:.88;
 const hem=S.hemY!==undefined?S.hemY:hip[1]+.05*H;const hk2=S.hemW||hk;
 const nx=.03*H;
 const tilt=(hip[0]-cx);
 const P=[[neck[0]-nx,neck[1]-.01*H],[shL[0]-.012*H,shL[1]-.005*H],[shL[0]-.02*H,shL[1]+.03*H],[cx-sw*wk+tilt*.5,wy],[hip[0]-sw*hk2,hem],[hip[0]+sw*hk2,hem],[cx+sw*wk+tilt*.5,wy],[shR[0]+.02*H,shR[1]+.03*H],[shR[0]+.012*H,shR[1]-.005*H],[neck[0]+nx,neck[1]-.01*H]];
 return P}
function pathFromPts(P,flareY){const d=[`M${P[0][0]},${P[0][1]}`];
 d.push(`Q${(P[0][0]+P[1][0])/2},${P[1][1]-1} ${P[1][0]},${P[1][1]}`);
 d.push(`L${P[2][0]},${P[2][1]}`);d.push(`Q${P[3][0]-1},${P[3][1]-4} ${P[3][0]},${P[3][1]}`);
 d.push(`Q${(P[3][0]+P[4][0])/2-2},${(P[3][1]+P[4][1])/2} ${P[4][0]},${P[4][1]}`);
 d.push(`L${P[5][0]},${P[5][1]}`);
 d.push(`Q${(P[5][0]+P[6][0])/2+2},${(P[5][1]+P[6][1])/2} ${P[6][0]},${P[6][1]}`);
 d.push(`Q${P[6][0]+1},${P[6][1]-4} ${P[7][0]},${P[7][1]}`);d.push(`L${P[8][0]},${P[8][1]}`);
 d.push(`Q${(P[8][0]+P[9][0])/2},${P[8][1]-1} ${P[9][0]},${P[9][1]}Z`);return d.join(' ')}
// draw one arm (sleeve + hand). side 'L'/'R'
function armDraw(x,J,S,side){const H=J.H,sh=J['sh'+side],el=J['el'+side],ha=J['ha'+side];
 const w=(J.sex==='m'?.05:.04)*H;
 const sl=S.sleeve||'long';// long | short | wide
 const lx=S.lx===undefined?-1:S.lx;
 if(sl==='wide'){ // kimono sleeve: wide hanging cloth
  const dx=(side==='L'?-1:1);
  limb(x,[sh,el],w*1.05,S.slCol||S.col,S.slColS||S.colS,{lx});
  const sx=el[0],sy=el[1];
  const d=`M${sh[0]},${sh[1]+.005*H} L${sx+dx*.05*H},${sy-.02*H} L${sx+dx*.05*H},${sy+.075*H} Q${sx},${sy+.1*H} ${sx-dx*.045*H},${sy+.07*H} L${sh[0]-dx*.01*H},${sh[1]+.045*H}Z`;
  shape(x,d,S.slCol||S.col,{sw:.9,shade:S.slColS||S.colS,shadeD:`M${sx-60},${sy+.03*H} L${sx+60},${sy+.03*H} L${sx+60},${sy+.2*H} L${sx-60},${sy+.2*H}Z`});
  limb(x,[el,ha],w*.75,S.skin,S.skinS,{lx});hand(x,ha,.022*H,S.skin);return}
 if(sl==='short'){limb(x,[sh,[(sh[0]+el[0])/2,(sh[1]+el[1])/2]],w,S.slCol||S.col,S.slColS||S.colS,{lx});limb(x,[[(sh[0]+el[0])/2,(sh[1]+el[1])/2],el,ha],w*.78,S.skin,S.skinS,{lx})}
 else{limb(x,[sh,el,ha],w*.95,S.slCol||S.col,S.slColS||S.colS,{lx});if(S.cuff)limb(x,[[ha[0]+(el[0]-ha[0])*.12,ha[1]+(el[1]-ha[1])*.12],ha],w*1.0,S.cuff,S.cuff)}
 if(S.mitten){ell(x,ha[0],ha[1],.026*H,.03*H,S.mitten,OL,.9)}else hand(x,[ha[0]+(ha[0]-el[0])*.1,ha[1]+(ha[1]-el[1])*.1],.021*H,S.skin)}
function personDraw(x,J,S){ // S: cloth spec
 const H=J.H;
 if(S.behind&&S.behind.L)armDraw(x,J,S,'L');if(S.behind&&S.behind.R)armDraw(x,J,S,'R');
 if(S.preBody)S.preBody(x,J);
 // neck
 const nk=J.neck;limb(x,[[nk[0],nk[1]-.045*H],[nk[0],nk[1]+.01*H]],.05*H,S.skin,S.skinS,{});
 legsDraw(x,J,S);
 // robe/skirt
 if(S.skirt){S.skirt(x,J)}
 const P=torsoPath(J,S);const d=pathFromPts(P);
 const pth=shape(x,d,S.col,{sw:1,shade:S.colS,shadeD:`M${(J.shL[0]+J.shR[0])/2+(S.lx===-1||S.lx===undefined?.01:-.01)*H},${J.shL[1]-20} L${J.shR[0]+40},${J.shL[1]-20} L${J.shR[0]+40},${J.fy} L${(J.shL[0]+J.shR[0])/2+.03*H},${J.fy}Z`});
 if(S.torsoDetail)S.torsoDetail(x,J,pth);
 if(!(S.behind&&S.behind.L))armDraw(x,J,S,'L');if(!(S.behind&&S.behind.R))armDraw(x,J,S,'R');
}

// skirt/robe: returns fn. opts: hemY, flare (half width multiplier at hem), col, colS, sway, trim
function skirtFn(o){return (x,J)=>{const H=J.H;const wy=J.hip[1]-.07*H,hx=J.hip[0];const hw=(J.sex==='m'?.08:.085)*H*(o.top||1);
  const hem=o.hemY,fl=hw*(o.flare||1.3),sw=(o.sway||0),lift=o.lift||0,tilt=o.tilt||0;
  const d=`M${hx-hw+tilt*.2},${wy} Q${hx-hw*1.1+tilt*.4},${(wy+hem)/2} ${hx-fl+sw+tilt},${hem-lift*.5} Q${hx+sw*.5+tilt},${hem+.015*H-lift} ${hx+fl+sw+tilt},${hem-lift*.5} Q${hx+hw*1.1+tilt*.4},${(wy+hem)/2} ${hx+hw+tilt*.2},${wy}Z`;
  const p=shape(x,d,o.col,{sw:1,shade:o.colS,shadeD:`M${hx+hw*.2},${wy-5} L${hx+fl*1.5},${wy-5} L${hx+fl*1.5},${hem+20} L${hx+fl*.1+sw+tilt},${hem+20}Z`});
  x.save();x.clip(p);x.strokeStyle=o.fold||o.colS;x.lineWidth=.9;for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(hx+k*hw*.28+tilt*.2,wy+3);x.quadraticCurveTo(hx+k*hw*.34+tilt*.4,(wy+hem)/2,hx+k*fl*.36+sw+tilt,hem)}x.stroke();
  if(o.trim){x.fillStyle=o.trim;x.fillRect(hx-fl*1.2+sw,hem-(o.trimH||3)-lift*.5,fl*2.4,(o.trimH||3)+4)}x.restore();x.strokeStyle=OL;x.lineWidth=1;x.stroke(p)}}

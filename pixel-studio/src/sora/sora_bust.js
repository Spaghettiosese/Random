const SP={line:'#2e1f3e',skin:'#fff0ec',skinS:'#f3c9c0',skinD:'#e5a9a6',blush:'#ffb0bf',blushD:'#ff8fa8',
 hair:'#e4e0fa',hairL:'#f6f4ff',hairS:'#b6add9',hairD:'#8f86c4',hairDD:'#5a5088',
 white:'#ffffff',iris:'#ff6fae',irisD:'#b3307a',irisL:'#ffb3d6',pupil:'#52123a',
 navy:'#2b2f6b',navyS:'#1b1d4a',navyL:'#4a50a0',cream:'#f3f0ff',creamS:'#cdc8ea',
 pink:'#ff6fae',pinkS:'#c93f85',pinkL:'#ff9cc9',gold:'#ffd54a',goldS:'#d9921c',
 mouth:'#c8506c',mouthD:'#7c2442',tongue:'#ff8a9a',tear:'#c6ecff',red:'#ff5a6e'};
const MOUTH=(h,o,x0=80,y0=107)=>{ // generic mouth by expression
 const {path,P}=h,t=o.talk||0,e=o.ex;
 if(e==='surprised'){const r=t===2?5:t===1?4:3.6;path(`M${x0-r*.8},${y0+1} C${x0-r*.8},${y0-r*1.1} ${x0+r*.8},${y0-r*1.1} ${x0+r*.8},${y0+1} C${x0+r*.8},${y0+r*1.9} ${x0-r*.8},${y0+r*1.9} ${x0-r*.8},${y0+1}Z`,P.mouthD,.9,'L');h.fillE(x0,y0+r*1.1+.4,r*.55,r*.4,P.tongue);return}
 if(e==='happy'){ if(t){const w=t===2?7:6,d=t===2?9:6;path(`M${x0-w},${y0-1} Q${x0},${y0-3} ${x0+w},${y0-1} Q${x0+w-1},${y0+d} ${x0},${y0+d} Q${x0-w+1},${y0+d} ${x0-w},${y0-1}Z`,P.mouthD,.9,'L');h.fillE(x0,y0+d-1.6,w*.55,1.6,P.tongue);path(`M${x0-w+.6},${y0-.8} Q${x0},${y0-2.4} ${x0+w-.6},${y0-.8} L${x0+w-1.4},${y0+1} Q${x0},${y0-.4} ${x0-w+1.4},${y0+1}Z`,P.white,0)}
  else path(`M${x0-6},${y0-1} Q${x0},${y0-3} ${x0+6},${y0-1} Q${x0+4},${y0+7} ${x0},${y0+7} Q${x0-4},${y0+7} ${x0-6},${y0-1}Z`,P.mouthD,.9,'L')&&h.fillE(x0,y0+5.2,2.8,1.5,P.tongue);return}
 if(e==='angry'){ if(t){const d=t===2?6:4;path(`M${x0-6},${y0+1} L${x0+6},${y0+1} L${x0+5},${y0+d} L${x0-5},${y0+d}Z`,P.mouthD,.9,'L');path(`M${x0-5.2},${y0+1.4} L${x0+5.2},${y0+1.4} L${x0+4.8},${y0+3} L${x0-4.8},${y0+3}Z`,P.white,0)}
  else h.line(`M${x0-5},${y0+3} Q${x0},${y0-0.5} ${x0+5},${y0+3}`,'L',1.1);return}
 if(e==='sad'){ if(t){const d=t===2?6:4;path(`M${x0-4},${y0+3} Q${x0},${y0-1} ${x0+4},${y0+3} Q${x0},${y0+3+d} ${x0-4},${y0+3}Z`,P.mouthD,.9,'L');h.fillE(x0,y0+3+d*.55,2,1,P.tongue)}
  else h.line(`M${x0-4},${y0+4} Q${x0-1},${y0+1} ${x0+1},${y0+2} Q${x0+3},${y0+2.5} ${x0+4},${y0+4.6}`,'L',1.1);return}
 if(e==='shy'){ if(t){const d=t===2?5:3.4;path(`M${x0-3.5},${y0+1} Q${x0},${y0-.6} ${x0+3.5},${y0+1} Q${x0+2.5},${y0+1+d} ${x0},${y0+1+d} Q${x0-2.5},${y0+1+d} ${x0-3.5},${y0+1}Z`,P.mouthD,.9,'L');h.fillE(x0,y0+d-.2,1.6,.9,P.tongue)}
  else h.line(`M${x0-4},${y0+2} Q${x0-2},${y0+4} ${x0},${y0+2} Q${x0+2},${y0} ${x0+4},${y0+2}`,'L',1.1);return}
 // open / neutral
 if(t){const d=t===2?6.5:4;path(`M${x0-5},${y0} Q${x0},${y0-1.4} ${x0+5},${y0} Q${x0+4},${y0+d} ${x0},${y0+d} Q${x0-4},${y0+d} ${x0-5},${y0}Z`,P.mouthD,.9,'L');h.fillE(x0,y0+d-1.4,2.6,1.4,P.tongue);path(`M${x0-4.4},${y0+.2} Q${x0},${y0-1} ${x0+4.4},${y0+.2} L${x0+3.6},${y0+1.6} Q${x0},${y0+.6} ${x0-3.6},${y0+1.6}Z`,P.white,0)}
 else{h.line(`M${x0-5},${y0} Q${x0},${y0+4.6} ${x0+5},${y0}`,'L',1.1);h.line(`M${x0+5},${y0} l1,-.8`,'L',.9)}
};
function soraDraw(h,o){
 const {path,line,P}=h,e=o.ex,sw=o.sway||0,b=o.b||0;
 const S=(y)=>sw*Math.max(0,(y-100))/90; // sway grows with depth
 // ---------- back hair ----------
 path(`M46,62 C26,92 ${30+S(120)},130 ${24+S(150)},${170} C${22+S(190)},182 ${24+S(192)},190 ${20+S(192)},192 L${140+S(192)},192 C${134+S(190)},180 ${136+S(170)},170 ${134+S(150)},150 C${132+S(130)},120 ${134},90 114,62 Q80,40 46,62Z`,P.hairS);
 path(`M60,100 C54,140 ${58+S(150)},170 ${56+S(192)},192 L${108+S(192)},192 C${108+S(170)},170 ${112+S(150)},140 104,100Z`,P.hairD,0);
 line(`M44,96 C36,130 ${38+S(150)},160 ${34+S(190)},190`,P.hairD,1.2);line(`M116,96 C124,130 ${122+S(150)},160 ${126+S(190)},190`,P.hairD,1.2);
 line(`M38,110 C32,140 ${34+S(160)},170 ${30+S(190)},190`,P.hairL,1.1);line(`M124,112 C130,140 ${128+S(160)},170 ${132+S(190)},190`,P.hairL,1.1);
 // ---------- body ----------
 // neck
 path('M72,106 L88,106 L89,140 L71,140Z',P.skin,0);
 path('M70,112 L90,112 L90,124 C84,130 76,130 70,124Z',P.skinS,0);
 // sleeves (arms hang)
 const arm=(f)=>{const m=x=>f<0?x:160-x;
   path(`M${m(36)},152 C${m(30)},162 ${m(26)},176 ${m(24)},192 L${m(48)},192 C${m(48)},178 ${m(52)},164 ${m(62)},150Z`,P.cream);
   path(`M${m(26)},182 L${m(25)},192 L${m(48)},192 L${m(48)},184 Q${m(36)},188 ${m(26)},182Z`,P.navy,.9);
   line(`M${m(27)},181 Q${m(37)},187 ${m(47)},183`,P.pink,1)};
 arm(-1);arm(1);
 path('M120,152 C124,162 128,176 130,192 L116,192 C114,176 112,164 104,150Z',P.creamS,0);
 path('M40,156 C34,172 34,182 36,192 L46,192 C44,178 44,166 52,154Z',P.creamS,0);
 // bodice
 path('M56,136 L104,136 L110,192 L50,192Z',P.navy);
 path('M86,138 L104,136 L110,192 L90,192Z',P.navyS,0);
 line('M80,170 L80,192',P.navyL,1);
 h.fillC(80,181,1.5,P.gold);h.fillC(80,189,1.5,P.gold);
 // sailor collar
 const col=(f)=>{const m=x=>f<0?x:160-x;path(`M${m(68)},126 C${m(56)},130 ${m(44)},137 ${m(34)},150 C${m(46)},160 ${m(62)},168 ${m(76)},172 L${m(81)},164 L${m(71)},131Z`,P.cream);
  line(`M${m(38)},151 C${m(50)},159 ${m(62)},165 ${m(74)},169`,P.navy,2.1);line(`M${m(40)},155 C${m(52)},162 ${m(63)},168 ${m(75)},172`,P.pink,0.9)};
 // chest V
 path('M70,130 L90,130 L81,166 L79,166Z',P.skin,0);
 col(-1);col(1);
 path('M70,130 L90,130 L84,148 L76,148Z',P.skinS,0);
 // bow
 path('M80,164 C74,156 64,158 62,166 C64,174 74,172 80,166Z',P.pink);path('M80,164 C86,156 96,158 98,166 C96,174 86,172 80,166Z',P.pink);
 path('M62,166 C66,162 72,162 76,164 C72,166 66,168 62,166Z',P.pinkL,0);
 path('M80,166 L74,184 L80,180 L83,186 L84,170Z',P.pinkS);
 path('M78,163 L83,163 L83,169 L78,169Z',P.pinkS);
 h.star(66,182,4.2,P.gold,.8);
 // ---------- head group ----------
 h.save();h.translate(0,b);
 // bun
 const bx=46,by=48;
 h.fillC(bx,by,12,P.hair);path(new Path2D(`M${bx-12},${by} a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0`),null,1.1,'L');
 h.fillE(bx+3,by+4,8,6,P.hairS);line(`M${bx-8},${by-3} Q${bx},${by-9} ${bx+8},${by-3}`,P.hairL,1.4);line(`M${bx-6},${by+3} Q${bx-1},${by-2} ${bx+6},${by+5}`,P.hairD,1);
 // face
 path('M54,76 C54,100 62,112 71,117 C76,120.5 84,120.5 89,117 C98,112 106,100 106,76 C106,56 96,46 80,46 C64,46 54,56 54,76Z',P.skin,1.7);
 path('M54,84 C55,102 62,112 71,117 C76,120.5 84,120.5 89,117 C98,112 106,102 106,84 C100,104 90,114 80,114 C70,114 60,104 54,84Z',P.skinS,0);
 // ears hidden by locks. cheeks
 const bl=o.blushStr||0;
 h.fillE(61,101,5.4,2.6,bl>1?P.blushD:P.blush);h.fillE(99,101,5.4,2.6,bl>1?P.blushD:P.blush);
 if(bl>1){for(const cx of [60,100])for(let k=-1;k<=1;k++)line(`M${cx+k*3-1},${99} l2,4`,P.blushD,.9)}
 line('M80,100 l0.5,1.2',P.skinD,1.1);
 // ---- eyes ----
 const eye=(cx,f)=>{ // f=-1 left(viewer), +1 right
  const closed=o.closed;
  if(e==='happy'||(closed==='smile')){line(`M${cx-7.5},91 Q${cx},${82.5} ${cx+7.5},91`,'L',1.9);line(`M${cx+7*f},90 l${2.6*f},-1.4`,'L',1.1);return}
  if(closed){line(`M${cx-8},90 Q${cx},${95.5} ${cx+8},90`,'L',1.6);line(`M${cx+7*f},90.4 l${3*f},-.6`,'L',1.1);return}
  let rx=8.2,top=80.5,bot=99,ir=6.2,ix=cx,iy=90,ph=2.6;
  if(e==='surprised'){rx=8.6;top=78;bot=100;ir=5.2;ph=1.8;iy=89.5}
  if(e==='angry'){top=84;bot=97;ir=5.2;iy=91;ph=2.4}
  if(e==='sad'){top=82;bot=99.5;ir=6.4;iy=91.5;ph=2.4}
  if(e==='shy'){top=82;bot=98;ir=5.2;iy=92.2;ix=cx-2.4;ph=2.2}
  const lookx=o.look||0;ix+=lookx;
  const eh=bot-top;
  // sclera
  const sc=`M${cx-rx},${(top+bot)/2} C${cx-rx},${top-1} ${cx+rx},${top-1} ${cx+rx},${(top+bot)/2} C${cx+rx},${bot+1} ${cx-rx},${bot+1} ${cx-rx},${(top+bot)/2}Z`;
  path(sc,P.white,0);
  h.save();h.clip(new Path2D(sc));
  // iris
  h.fillE(ix,iy,ir,ir*(e==='surprised'?1.18:1.22),P.iris);
  h.fillE(ix,iy-ir*.55,ir*1.02,ir*.8,P.irisD);
  h.fillE(ix,iy+ir*.75,ir*.8,ir*.45,P.irisL);
  h.fillE(ix,iy+.4,ph,ph*1.25,P.pupil);
  h.fillE(ix,iy-ir*.2,ir*.55,ir*.2,P.irisD);
  h.restore();
  // highlights
  h.fillC(ix-2*f-.2,iy-3,1.9,P.white);h.fillC(ix+2.3*f,iy+3.2,.95,P.white);
  if(e==='sad'||e==='shy'){h.fillC(ix+1.5*f,iy+1.4,.8,P.white)}
  if(o.sparkle){h.fillC(ix+3.4*f,iy-3.4,.7,P.white)}
  // upper lid + lash
  let lidTop=`M${cx-rx-1},${top+8} C${cx-rx},${top-1.5} ${cx+rx},${top-1.5} ${cx+rx+1},${top+8}`;
  if(e==='angry'){// slanted lid
    lidTop=`M${cx-rx-1},${top+(f<0?-1:3)} C${cx-rx*.4},${top+(f<0?1:0)} ${cx+rx*.4},${top+(f<0?0:1)} ${cx+rx+1},${top+(f<0?3:-1)}`;
    path(`M${cx-rx-1},${top+(f<0?-1:3)-3} L${cx+rx+1},${top+(f<0?3:-1)-3} L${cx+rx+1},${top+(f<0?3:-1)} C${cx+rx*.4},${top+(f<0?0:1)} ${cx-rx*.4},${top+(f<0?1:0)} ${cx-rx-1},${top+(f<0?-1:3)}Z`,null,0)}
  line(lidTop,'L',e==='surprised'?1.4:2.1);
  if(e!=='surprised'){line(`M${cx+rx*f},${top+(e==='angry'?(f<0?1:0):6)} l${3.4*f},${e==='angry'?(f<0?1:-1)*1:-2.2}`,'L',1.3);line(`M${cx+(rx-1.5)*f},${top+(e==='angry'?(f<0?0:-.5):3)-.4} l${3*f},-2.4`,'L',1)}
  else line(`M${cx+rx*f},${top+5} l${2.6*f},-1.8`,'L',1.1);
  // lower lash line
  
  if(e==='sad'||o.tear){line(`M${cx-rx+1},${bot-1.5} Q${cx},${bot+2} ${cx+rx-1},${bot-1.5}`,P.tear,1.2);h.fillE(cx,bot-1.2,rx*.5,.9,P.tear)}
 };
 eye(67,-1);eye(93,1);
 // tear drop
 if(o.tearDrop!==undefined&&o.tearDrop>=0){const ty=100+o.tearDrop*3;path(`M99,${ty-3} C101,${ty} 102,${ty+2} 99,${ty+3.4} C96,${ty+2} 97,${ty} 99,${ty-3}Z`,P.tear,.8,'L')}
 // mouth
 MOUTH(h,o,80,107);
 // ---- hair front ----
 const hairTop='M50,86 C44,50 60,35 80,35 C100,35 116,50 110,86 C106,72 98,60 80,58 C62,60 54,72 50,86Z';
 path(hairTop,P.hair,0);line('M50,86 C44,50 60,35 80,35 C100,35 116,50 110,86','L',1.1);
 // inner shade under front hair
 path('M54,70 C60,58 70,54 80,54 C90,54 100,58 106,70 C100,62 90,60 80,60 C70,60 60,62 54,70Z',P.hairS,0);
 // bangs: left
 const bang=(f)=>{const m=x=>f<0?x:160-x;
  path(`M${m(80)},43 C${m(64)},44 ${m(54)},54 ${m(52)},72 C${m(52)},78 ${m(52)},82 ${m(53)},88 L${m(56)},84 L${m(59)},78 L${m(62)},84 L${m(66)},73 L${m(69)},80 L${m(73)},68 L${m(76)},74 L${m(80)},62Z`,P.hair);
  path(`M${m(56)},64 C${m(60)},54 ${m(68)},49 ${m(78)},47 C${m(70)},56 ${m(66)},68 ${m(66)},84 L${m(63)},78 L${m(59)},84Z`,P.hairL,0);
  path(`M${m(70)},73 L${m(74)},80 L${m(78)},66 L${m(80)},68 L${m(79)},50 C${m(74)},60 ${m(72)},66 ${m(70)},73Z`,P.hairS,0);
  line(`M${m(64)},52 C${m(72)},46 ${m(78)},46 ${m(80)},45`,P.white,1.2);
  line(`M${m(60)},70 L${m(58)},82`,P.hairS,.8);line(`M${m(68)},62 L${m(66)},76`,P.hairS,.8)};
 bang(-1);bang(1);
 // hair shine ring
 line('M60,50 C68,43 80,41 92,43',P.white,1.6);
 // side locks long
 const lock=(f)=>{const m=x=>f<0?x:160-x;const s=y=>sw*Math.max(0,(y-100))/60;
  path(`M${m(54)},66 C${m(46)},90 ${m(44)},120 ${m(46+s(150))},150 C${m(44+s(170))},162 ${m(46+s(180))},170 ${m(44+s(190))},180 C${m(54+s(170))},160 ${m(58)},130 ${m(58)},100 C${m(58)},88 ${m(56)},78 ${m(54)},66Z`,P.hair);
  path(`M${m(50)},90 C${m(46)},112 ${m(46)},130 ${m(47+s(150))},150 C${m(51)},132 ${m(53)},112 ${m(55)},96Z`,P.hairS,0);
  line(`M${m(52)},84 C${m(49)},110 ${m(48)},130 ${m(49+s(150))},148`,P.white,1);
  // little inner lock
  path(`M${m(56)},96 C${m(58)},116 ${m(60)},134 ${m(58+s(150))},150 C${m(64)},134 ${m(64)},114 ${m(60)},96Z`,P.hair,0)};
 lock(-1);lock(1);
 // eyebrows
 const brow=(cx,f)=>{let y=78.5,a=0,c=P.hairDD,ww=1.1;
  if(e==='sad'){const i=cx-f*5,ou=cx+f*7;line(`M${ou},${80.5} Q${cx},${77} ${i},${74.6}`,c,ww);return}
  if(e==='angry'){const i=cx-f*5,ou=cx+f*7.5;line(`M${ou},${77.2} Q${cx},${77.4} ${i},${81.4}`,c,1.4);return}
  if(e==='surprised'){line(`M${cx-6},${73.5} Q${cx},${70} ${cx+6},${73.5}`,c,ww);return}
  if(e==='shy'){const i=cx-f*5,ou=cx+f*7;line(`M${ou},${78.8} Q${cx},${76.4} ${i},${75.6}`,c,ww);return}
  if(e==='happy'){line(`M${cx-6},${77} Q${cx},${74.4} ${cx+6},${77}`,c,ww);return}
  line(`M${cx-6},${78.4} Q${cx},${76.2} ${cx+6},${78.2}`,c,ww)};
 if(e==='surprised'){ // draw brows on top, over bangs
  brow(67,-1);brow(93,1)}else {brow(67,-1);brow(93,1)}
 // bun ribbon + star clip
 path(`M${bx-3},${by+9} C${bx-12},${by+4} ${bx-16},${by+14} ${bx-12},${by+19} C${bx-8},${by+17} ${bx-5},${by+13} ${bx-3},${by+10}Z`,P.pink);
 path(`M${bx+1},${by+9} C${bx+8},${by+5} ${bx+14},${by+10} ${bx+12},${by+17} C${bx+7},${by+16} ${bx+3},${by+13} ${bx},${by+10}Z`,P.pink);
 h.fillC(bx-1,by+9,2.2,P.pinkS);
 h.star(100,62,5.6,P.gold,.8);h.fillC(98.6,60.6,.8,P.white);
 if(e==='angry'){// vein mark
  const vx=110,vy=62;line(`M${vx-3},${vy-3} q2,2 0,4 M${vx+3},${vy-3} q-2,2 0,4 M${vx-3},${vy+3} q2,-2 4,0 M${vx+3},${vy+3} q-2,-2 -4,0`,P.red,1.2)}
 if(e==='surprised'){line('M112,56 l4,-3 M114,64 l5,0 M112,72 l4,3','L',.9)}
 h.restore();
}

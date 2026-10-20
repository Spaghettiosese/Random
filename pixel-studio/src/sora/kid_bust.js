const KP_H={line:'#2e1f3e',skin:'#fff0e8',skinS:'#f3c9b8',skinD:'#e5a9a0',blush:'#ffa8b4',blushD:'#ff8aa0',
 hair:'#e4e0fa',hairL:'#f6f4ff',hairS:'#b6add9',hairD:'#8f86c4',hairDD:'#5a5088',white:'#ffffff',
 iris:'#f0709c',irisD:'#a52c6e',irisL:'#ffc0d8',pupil:'#52123a',
 navy:'#2b2f6b',navyS:'#1b1d4a',navyL:'#4a50a0',cream:'#f3f0ff',creamS:'#cdc8ea',
 pink:'#ff6fae',pinkS:'#c93f85',pinkL:'#ff9cc9',gold:'#ffd54a',goldS:'#d9921c',
 mouth:'#c8506c',mouthD:'#7c2442',tongue:'#ff8a9a',tear:'#c6ecff',red:'#ff5a6e'};
const KP_K={line:'#2a1d36',skin:'#ffeadb',skinS:'#f0bfa6',skinD:'#e2a08e',blush:'#ffa4a8',blushD:'#ff8696',
 hair:'#4a3d66',hairL:'#7a6aa0',hairS:'#33294d',hairD:'#241c38',hairDD:'#241c38',white:'#ffffff',
 iris:'#b97a46',irisD:'#6e3f1e',irisL:'#e8b27c',pupil:'#2a1408',
 navy:'#3a4390',navyS:'#242a66',navyL:'#5b66c0',cream:'#fff6d8',creamS:'#e3d4a4',
 pink:'#ff6fae',pinkS:'#c93f85',pinkL:'#ff9cc9',gold:'#ffd54a',goldS:'#d9921c',
 mouth:'#c8506c',mouthD:'#7c2442',tongue:'#ff8a9a',tear:'#c6ecff',red:'#ff5a6e'};
function kidDraw(h,o){
 const {path,line,P}=h,e=o.ex,sw=o.sway||0,b=o.b||0,girl=o.girl;
 const S=y=>sw*Math.max(0,y-100)/60;
 const hairC=P.hair;
 // back hair
 if(girl){
  path(`M50,60 C40,76 40,100 44,118 L116,118 C120,100 120,76 110,60Z`,P.hairS);
 }else path(`M52,60 C46,80 50,104 56,110 L104,110 C110,104 114,80 108,60Z`,P.hairD,0);
 // body
 path('M71,112 L89,112 L90,134 L70,134Z',P.skin,0);path('M71,116 L89,116 L89,126 C84,130 76,130 71,126Z',P.skinS,0);
 // torso + arms (small shoulders)
 path('M34,192 C34,160 46,140 68,131 L92,131 C114,140 126,160 126,192Z',P.navy);
 path('M104,144 C118,152 124,168 126,192 L110,192 C110,170 108,156 100,142Z',P.navyS,0);
 line('M44,160 C40,172 38,182 38,192','L',1);line('M116,160 C120,172 122,182 122,192','L',1);
 if(girl){ // sailor collar small + bow
  path('M68,134 C58,138 48,146 44,156 C54,160 66,162 78,164 L80,150Z',P.cream);path('M92,134 C102,138 112,146 116,156 C106,160 94,162 82,164 L80,150Z',P.cream);
  path('M70,134 L90,134 L80,152Z',P.skin,0);
  path('M80,155 C74,148 66,150 66,156 C68,162 76,160 80,157Z',P.pink);path('M80,155 C86,148 94,150 94,156 C92,162 84,160 80,157Z',P.pink);h.fillC(80,156,2,P.pinkS);
  h.star(100,176,5,P.gold,.8);
 } else { // pyjama: round collar + stars
  path('M68,128 C72,140 88,140 92,128 L92,134 C86,144 74,144 68,134Z',P.cream);
  path('M70,128 L90,128 C88,136 72,136 70,128Z',P.skin,0);
  [[56,168,4],[102,160,3.4],[84,182,4.4],[116,184,3.4],[48,188,3]].forEach(([x,y,r],i)=>h.star(x,y,r,P.gold,.7,i*.3));
  h.fillC(80,150,1.5,P.goldS);h.fillC(80,162,1.5,P.goldS);
 }
 h.save();h.translate(0,b);
 // girl pigtails behind face
 if(girl){const tail=(f)=>{const m=x=>f<0?x:160-x;
   path(`M${m(52)},64 C${m(36)},80 ${m(32+S(150))},110 ${m(34+S(150))},138 C${m(38+S(170))},152 ${m(48+S(170))},152 ${m(50+S(150))},138 C${m(52)},114 ${m(54)},96 ${m(58)},80Z`,P.hair);
   path(`M${m(40)},96 C${m(36)},112 ${m(36+S(150))},128 ${m(40+S(150))},144 C${m(46)},128 ${m(46)},112 ${m(48)},96Z`,P.hairS,0);
   line(`M${m(44)},74 C${m(38)},96 ${m(38+S(140))},120 ${m(40+S(150))},140`,P.white,1);
   path(`M${m(48)},62 a4,5 0 1,0 8,0 a4,5 0 1,0 -8,0`,P.pink);
   path(`M${m(52)},66 C${m(42)},62 ${m(40)},72 ${m(46)},74 Z`,P.pinkL,0)};tail(-1);tail(1)}
 // face
 path('M48,82 C48,106 62,120 80,121 C98,120 112,106 112,82 C112,58 98,44 80,44 C62,44 48,58 48,82Z',P.skin,1.7);
 path('M48,90 C50,108 62,120 80,121 C98,120 110,108 112,90 C104,108 92,116 80,116 C68,116 56,108 48,90Z',P.skinS,0);
 // ears
 for(const f of [-1,1]){const m=x=>f<0?x:160-x;path(`M${m(48)},92 C${m(42)},90 ${m(42)},102 ${m(49)},103Z`,P.skin)}
 const bl=o.blushStr||1;
 h.fillE(58,103,6.5,3.2,bl>1?P.blushD:P.blush);h.fillE(102,103,6.5,3.2,bl>1?P.blushD:P.blush);
 if(bl>1){for(const cx of [58,102])for(let k=-1;k<=1;k++)line(`M${cx+k*3.4-1},${101} l2,4`,P.blushD,.9)}
 line('M80,102 l.5,1.2',P.skinD,1.1);
 const eye=(cx,f)=>{
  if(e==='happy'){line(`M${cx-8},93 Q${cx},${83} ${cx+8},93`,'L',2);return}
  if(o.closed){line(`M${cx-8},91 Q${cx},${96.5} ${cx+8},91`,'L',1.7);return}
  let rx=9,top=80,bot=101,ir=6.9,ix=cx,iy=91.5,ph=3;
  if(e==='surprised'){rx=9.6;top=77;bot=103;ir=6.2;ph=2.2;iy=90.5}
  if(e==='angry'){top=84;bot=100;ir=6.4;iy=93}
  if(e==='sad'){top=82;bot=102;ir=7;iy=93.5}
  if(e==='shy'){top=81;bot=101;ir=6.4;iy=94;ix=cx-2.5+(o.look||0)}
  const sc=`M${cx-rx},${(top+bot)/2} C${cx-rx},${top-1} ${cx+rx},${top-1} ${cx+rx},${(top+bot)/2} C${cx+rx},${bot+1} ${cx-rx},${bot+1} ${cx-rx},${(top+bot)/2}Z`;
  path(sc,P.white,0);h.save();h.clip(new Path2D(sc));
  h.fillE(ix,iy,ir,ir*1.2,P.iris);h.fillE(ix,iy-ir*.55,ir*1.02,ir*.8,P.irisD);h.fillE(ix,iy+ir*.75,ir*.8,ir*.45,P.irisL);h.fillE(ix,iy+.4,ph,ph*1.2,P.pupil);h.restore();
  h.fillC(ix-2.4*f,iy-3.4,2.3,P.white);h.fillC(ix+2.6*f,iy+3.6,1.1,P.white);
  if(e==='sad')h.fillC(ix+1.8*f,iy+1.5,.9,P.white);
  let lid=`M${cx-rx-.5},${top+9} C${cx-rx},${top-1.5} ${cx+rx},${top-1.5} ${cx+rx+.5},${top+9}`;
  if(e==='angry')lid=`M${cx-rx-.5},${top+(f<0?-1:3)} C${cx-rx*.4},${top+(f<0?1:0)} ${cx+rx*.4},${top+(f<0?0:1)} ${cx+rx+.5},${top+(f<0?3:-1)}`;
  line(lid,'L',2);line(`M${cx+rx*f},${top+7} l${2.6*f},-1.6`,'L',1.2);
  if(e==='sad'){line(`M${cx-rx+1},${bot-1.4} Q${cx},${bot+2} ${cx+rx-1},${bot-1.4}`,P.tear,1.3)}
 };
 eye(65,-1);eye(95,1);
 if(o.tearDrop!==undefined&&o.tearDrop>=0){const ty=106+o.tearDrop*3;path(`M101,${ty-3} C103,${ty} 104,${ty+2} 101,${ty+3.4} C98,${ty+2} 99,${ty} 101,${ty-3}Z`,P.tear,.8,'L')}
 h.save();h.translate(80,111);h.fx.scale(.82,.82);h.lx.scale(.82,.82);MOUTH(h,o,0,0);h.restore();
 // hair top
 if(girl){
  path('M48,84 C42,50 60,36 80,36 C100,36 118,50 112,84 C108,70 98,60 80,58 C62,60 52,70 48,84Z',P.hair,0);line('M48,84 C42,50 60,36 80,36 C100,36 118,50 112,84','L',1.1);
  const bang=f=>{const m=x=>f<0?x:160-x;
   path(`M${m(80)},45 C${m(64)},46 ${m(52)},56 ${m(50)},74 L${m(51)},86 L${m(56)},78 L${m(60)},86 L${m(65)},76 L${m(70)},83 L${m(75)},72 L${m(80)},66Z`,P.hair);
   path(`M${m(58)},64 C${m(62)},55 ${m(70)},50 ${m(78)},48 C${m(72)},58 ${m(68)},68 ${m(68)},80 L${m(64)},74Z`,P.hairL,0);
   path(`M${m(70)},83 L${m(75)},72 L${m(80)},66 L${m(80)},52 C${m(76)},60 ${m(72)},70 ${m(70)},83Z`,P.hairS,0)};bang(-1);bang(1);
  line('M62,52 C70,45 82,44 94,46',P.white,1.6);
  h.star(100,60,5.4,P.gold,.8);h.star(60,56,4,P.gold,.7);
 } else {
  path('M48,86 C44,52 60,38 80,38 C102,38 116,52 112,86 C108,72 100,62 90,60 C84,66 70,66 60,62 C54,68 50,76 48,86Z',P.hair);
  path('M58,60 C66,48 80,46 94,52 L88,64 L82,56 L76,66 L68,58 L62,68Z',P.hair);
  path('M66,56 L74,66 L80,54 L88,66 L96,56 C88,46 74,46 66,56Z',P.hair,0);
  path('M80,40 C78,30 86,24 94,28 C88,30 86,34 88,42Z',P.hair);
  line('M62,52 C68,46 78,44 88,46',P.hairL,1.6);line('M54,70 C52,78 52,84 52,88',P.hairS,1);
  path('M48,86 C52,80 58,74 60,62 C54,66 50,76 48,86Z',P.hairS,0);
  path('M112,86 C108,80 102,74 100,62 C106,66 110,76 112,86Z',P.hairS,0);
 }
 // brows
 const brow=(cx,f)=>{const c=P.hairDD;
  if(e==='sad')return line(`M${cx+f*7},${81} Q${cx},${77} ${cx-f*5},${74}`,c,1.2);
  if(e==='angry')return line(`M${cx+f*7.5},${77} Q${cx},${77.4} ${cx-f*5},${82}`,c,1.5);
  if(e==='surprised')return line(`M${cx-6},${72.5} Q${cx},${69} ${cx+6},${72.5}`,c,1.1);
  if(e==='shy')return line(`M${cx+f*7},${78.6} Q${cx},${76} ${cx-f*5},${75.4}`,c,1.1);
  if(e==='happy')return line(`M${cx-6},${77} Q${cx},${74.2} ${cx+6},${77}`,c,1.1);
  line(`M${cx-6},${78} Q${cx},${75.8} ${cx+6},${77.8}`,c,1.1)};
 brow(65,-1);brow(95,1);
 if(e==='angry')line('M110,60 q2,2 0,4 M116,60 q-2,2 0,4 M110,68 q2,-2 4,0 M116,68 q-2,-2 -4,0',P.red,1.1);
 if(e==='surprised')line('M114,56 l4,-3 M116,64 l5,0 M114,72 l4,3','L',.9);
 h.restore();
}

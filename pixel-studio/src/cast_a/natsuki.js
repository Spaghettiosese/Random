CAST.natsuki=(()=>{
const BANGS=[[[58,64],[56,72],[58,80],[54,90],6],[[70,64],[68,71],[71,76],[69,82],6],[[88,64],[90,71],[92,76],[96,82],6],[[100,64],[104,72],[104,82],[108,94],6]];
return{
P:{line:'#3a2216',skin:'#fde6d8',skinS:'#f0bca6',skinD:'#c98a76',blush:'#ff9a8a',blushD:'#e8604e',hair:'#ffd566',hairS:'#e8a030',hairD:'#a8641c',hairH:'#fff6d2',mouthD:'#a04a3a',
 hat:'#ffcf3f',hatS:'#e0a010',hatD:'#a87400',hatH:'#fff3a8',jk:'#ff7a2a',jkS:'#d45a14',jkD:'#9a3a0c',ref:'#e4e8ee',refS:'#98a2b2',tee:'#454a60',teeS:'#2c2f40',red:'#e8322a'},
face:{hw:26,jw:21,jawY:108,chinY:123,cw:5.5,top:46,sx:3.5,sy:2.5},
eye:{cx:[67,93],y:91,w:7.8,ty:7.2,by:6.6,ir:5.4,tilt:.4,lash:2.2,lash2:1,cols:[{d:'#123b8c',m:'#3aa6ff',l:'#c8f2ff',p:'#08164a'},{d:'#123b8c',m:'#3aa6ff',l:'#c8f2ff',p:'#08164a'}]},
brow:{y:80,in:3,out:8.5,th:2,arch:1.5,col:'#a8641c'},mouth:{y:110.5,w:7,d:3},ears:false,blushY:103,
backHair(o){const s=o.sway;
 // ponytail
 lock([[108,66],[136,66],[148+s,104],[136+s*2,146]],13,{fill:P.hair,sh:P.hairS,hi:P.hairH,wf:BLUNT});
 lock([[108,70],[130,80],[138+s,116],[128+s*2,150]],8,{fill:P.hairS,sh:P.hairD,wf:BLUNT});
 mass('M50,90 C42,52 56,34 80,34 C104,34 118,52 110,90 L106,116 L54,116Z',P.hair,P.hairS,3,2);
 lock([[56,76],[44,100],[44,132],[50,156]],9,{fill:P.hair,sh:P.hairS,hi:P.hairH,wf:BLUNT});
},
neckShadow(){},
body(o){
 mass('M16,192 L18,166 C20,152 42,144 62,140 L98,140 C118,144 140,152 142,166 L144,192Z',P.jk,P.jkS,5,3);
 line('M28,154 C22,170 20,182 20,192',P.jkD,1.3);line('M132,154 C138,170 140,182 140,192',P.jkD,1.3);
 clipped('M16,192 L18,166 C20,152 42,144 62,140 L98,140 C118,144 140,152 142,166 L144,192Z',()=>{X.fillStyle=P.ref;X.fillRect(0,176,160,6);X.fillStyle=P.refS;X.fillRect(0,180.5,160,1.5);X.fillRect(0,0,0,0)});
 path('M18,178 L142,178',null,0);
 const neck='M72,104 L88,104 L90,142 L70,142Z';mass(neck,P.skin,P.skinS,4,0);clipped(neck,()=>{X.fillStyle=P.skinS;X.fillRect(70,104,22,8)});path(neck,null,1.1);
 // tee V
 path('M62,140 L80,168 L98,140 Q80,150 62,140Z',P.tee,1.1);path('M80,168 L98,140 Q88,148 84,160Z',P.teeS,0);
 path('M58,140 L70,138 L80,166 L72,170Z',P.jk,1.1);path('M102,140 L90,138 L80,166 L88,170Z',P.jkS,1.1);
 line('M80,170 L80,192',P.jkD,1.4);
 // name patch
 path('M104,162 L120,162 L120,170 L104,170Z',P.red,1);line('M107,166 h10',P.ref,1);
},
fringe(o){return BANGS.map(b=>ribbon(b.slice(0,4),b[4],-1,1,BLUNT)).concat(['M44,72 L116,72 L116,60 L44,60Z'])},
frontHair(o){const s=o.sway;
 [[[50,66],[45,84],[46,104],[50,120],5.5],[[110,66],[115,84],[114,104],[110,120],5.5]].forEach(b=>lock(b.slice(0,4),b[4],{fill:P.hair,sh:P.hairS,wf:BLUNT}));
 BANGS.forEach((b,i)=>lock(b.slice(0,4).map((p,j)=>[p[0]+(j>2?s*.3:0),p[1]]),b[4],{fill:P.hair,sh:P.hairS,hi:i%2?P.hairH:null,wf:BLUNT}));
 // hard hat
 mass('M45,68 C42,36 60,24 80,24 C100,24 118,36 115,68Z',P.hat,P.hatS,5,3);
 path('M76,24 L84,24 L85,68 L75,68Z',P.hatS,0);path('M82,24 L84,24 L85,68 L83,68Z',P.hatD,0);
 line('M52,46 C54,36 62,30 72,28',P.hatH,1.8);
 mass('M38,68 Q80,59 122,68 L124,73 Q80,66 36,73Z',P.hatS,P.hatD,3,2);
 // badge
 path('M69,44 L91,44 L91,55 L69,55Z',P.ref,1.1);line('M80,46 v7 M76.5,49.5 h7',P.red,2);
 ell(112,52,.01,.01);
},
acc(o){}
}})();

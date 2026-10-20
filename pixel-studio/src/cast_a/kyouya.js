CAST.kyouya=(()=>{
const BANGS=[[[84,38],[70,50],[58,66],[52,88],8],[[88,38],[82,52],[77,64],[73,77],7],[[92,38],[100,52],[104,64],[103,77],7],[[98,42],[110,52],[115,68],[116,92],6]];
return{
P:{line:'#1c2838',skin:'#f8eeea',skinS:'#e2cac6',skinD:'#b49694',blush:'#f0b4b4',blushD:'#e08890',hair:'#f2f7fa',hairS:'#a2d8ec',hairD:'#5aa6c8',hairH:'#ffffff',mouthD:'#8a5a64',
 cy:'#5fe6ff',cyL:'#d0fbff',cyD:'#1a8aaa',cyDD:'#0e5a78',coat:'#eef2f6',coatS:'#c0ccda',coatD:'#8a9ab0',blk:'#2e3040',blkS:'#171822'},
face:{hw:28,jw:23,jawY:109,chinY:125,cw:11,top:44,sx:4,sy:3},
eye:{cx:[65,95],y:91,w:8,ty:5.2,by:5,ir:4.7,tilt:1.4,lash:2.4,cols:[{d:'#0a4a66',m:'#5fe6ff',l:'#e0fcff',p:'#052a3a'},{d:'#0a4a66',m:'#5fe6ff',l:'#e0fcff',p:'#052a3a'}]},
brow:{y:80,in:2.5,out:9.5,th:2.4,arch:.8,col:'#6a98b0'},mouth:{y:112,w:6.5,d:1.4},nose:'bridge',ears:false,blushY:104,blushK:.7,
backHair(o){const s=o.sway;
 mass('M50,90 C42,48 56,30 80,30 C104,30 118,48 110,90 L108,106 L52,106Z',P.hair,P.hairS,3,2);
},
neckShadow(){},
body(o){
 const T='M6,192 L8,164 C10,150 34,142 58,138 L102,138 C126,142 150,150 152,164 L154,192Z';
 mass(T,P.coat,P.coatS,6,3);
 line('M24,154 C18,170 16,182 16,192',P.coatD,1.3);line('M136,154 C142,170 144,182 144,192',P.coatD,1.3);
 const neck='M66,104 L94,104 L96,136 L64,136Z';mass(neck,P.skin,P.skinS,5,0);clipped(neck,()=>{X.fillStyle=P.skinS;X.fillRect(62,104,36,7)});path(neck,null,1.1);
 // black under-shirt
 path('M58,132 L102,132 L98,192 L62,192Z',P.blk,1.1);path('M84,134 L102,132 L98,192 L88,192Z',P.blkS,0);
 // high collar
 path('M62,124 C70,134 90,134 98,124 L100,142 C90,150 70,150 60,142Z',P.blk,1.1);path('M80,138 C90,138 96,134 98,124 L100,142 C94,147 88,149 80,149Z',P.blkS,0);
 // coat lapels
 path('M40,144 L60,134 L78,158 L68,192 L30,192 L30,162Z',P.coat,1.1);
 path('M120,144 L100,134 L82,158 L92,192 L130,192 L130,162Z',P.coat,1.1);path('M100,134 L82,158 L84,172 L104,148Z',P.coatS,0);path('M120,144 L130,162 L130,192 L118,192Z',P.coatS,0);
 line('M60,135 L78,158 L68,192',P.cy,1.3);line('M100,135 L82,158 L92,192',P.cyD,1.3);
 // glass brooch
 path('M96,168 L102,177 L96,190 L90,177Z',P.cyL,1.1);path('M96,168 L102,177 L96,177Z',P.cy,0);path('M96,177 L102,177 L96,190Z',P.cyD,0);line('M96,168 L96,190',P.cyL,.6);
 // glass cracks on shoulder
 line('M124,152 l7,9 l-5,7 l7,9',P.cy,1.2);line('M32,156 l-6,8 l5,7',P.cy,1.1);
},
fringe(o){return BANGS.map(b=>ribbon(b.slice(0,4),b[4],-1,1,BLUNT))},
frontHair(o){const s=o.sway;
 lock([[52,66],[46,84],[48,104],[52,118]],5.5,{fill:P.hair,sh:P.hairS,wf:BLUNT});
 mass('M49,84 C42,46 58,28 80,28 C102,28 118,46 111,84 C106,68 98,52 80,50 C62,52 54,68 49,84Z',P.hair,P.hairS,4,3);
 BANGS.forEach((b,i)=>lock(b.slice(0,4).map((p,j)=>[p[0]+(j>2?s*.4:0),p[1]]),b[4],{fill:P.hair,sh:P.hairS,hi:i%2?null:P.hairH,wf:BLUNT}));
 lock([[70,36],[72,26],[84,20],[100,24]],8,{fill:P.hair,sh:P.hairS,hi:P.hairH,wf:BLUNT});
 line('M64,44 Q78,36 98,42',P.hairH,1.4);
 // glass earring
 path('M52,108 L55,113 L52,120 L49,113Z',P.cyL,.9);path('M52,108 L55,113 L52,113Z',P.cy,0);
},
acc(o){const sh=(x,y,sc,k)=>{const yy=y+Math.sin((o.i+k)*.8)*1.5;path(`M${x},${yy-9*sc} L${x+4*sc},${yy-1*sc} L${x+1*sc},${yy+8*sc} L${x-3*sc},${yy+1*sc}Z`,P.cyL,.9);path(`M${x},${yy-9*sc} L${x+4*sc},${yy-1*sc} L${x},${yy}Z`,P.cy,0);path(`M${x+1*sc},${yy+8*sc} L${x-3*sc},${yy+1*sc} L${x},${yy}Z`,P.cyD,0)};
 sh(136,84,1.3,0);sh(24,64,1,3);sh(142,126,.8,5)}
}})();

CAST.shiori=(()=>{
const BANGS=[[[78,42],[66,52],[58,64],[54,77],8],[[85,42],[79,54],[76,64],[72,76],7],[[90,42],[98,54],[103,64],[104,76],8],[[96,44],[108,52],[114,64],[116,82],7]];
return{
P:{line:'#070a18',skin:'#fcebe1',skinS:'#ecc4b4',skinD:'#bf8e80',blush:'#f8a0a8',blushD:'#e0607a',hair:'#34447c',hairS:'#1e2858',hairD:'#101736',hairH:'#9ab0ea',mouthD:'#9a4458',
 uni:'#f6f7fc',uniS:'#cfd5e8',uniD:'#9aa4c4',gold:'#e8bf4c',goldS:'#aa8420',goldH:'#fff0a8',navy:'#232c54',navyS:'#141a38'},
face:{hw:25,jw:19,jawY:108,chinY:122.5,cw:3.5,top:46,sx:3.5,sy:2.5},
eye:{cx:[67,93],y:91,w:8,ty:6.2,by:5.8,ir:5,tilt:1.8,lash:2.5,lash2:1,cols:[{d:'#6a4400',m:'#f2c14e',l:'#fff4b8',p:'#2a1800'},{d:'#6a4400',m:'#f2c14e',l:'#fff4b8',p:'#2a1800'}]},
brow:{y:79,in:3,out:9.5,th:1.7,arch:1.6,col:'#1e2858'},mouth:{y:110.5,w:5.5,d:1.6},ears:false,blushY:102,blushK:.9,
backHair(o){const s=o.sway;
 path(`M46,70 C28,112 30,160 ${28+s},192 L${132+s},192 C130,160 132,112 114,70Z`,P.hair,1.1);
 path(`M114,70 C132,112 130,160 ${132+s},192 L${108+s},192 C112,150 112,110 106,76Z`,P.hairS,0);
 lock([[60,60],[40,110],[38+s*.5,160],[34+s,192]],10,{fill:P.hair,sh:P.hairS,hi:P.hairH,wf:BLUNT,noline:false});
 mass('M50,90 C42,52 56,34 80,34 C104,34 118,52 110,90 L106,116 L54,116Z',P.hair,P.hairS,3,2);
},
neckShadow(){},
body(o){
 const T='M14,192 L16,164 C18,150 40,142 62,138 L98,138 C120,142 142,150 144,164 L146,192Z';
 mass(T,P.uni,P.uniS,6,3);
 clipped(T,()=>{X.fillStyle=P.uniS;X.beginPath();X.moveTo(98,140);X.lineTo(120,150);X.lineTo(130,192);X.lineTo(100,192);X.fill()});
 line('M27,152 C22,168 20,180 20,192',P.gold,1.8);line('M133,152 C138,168 140,180 140,192',P.goldS,1.8);
 const neck='M72,104 L88,104 L90,136 L70,136Z';mass(neck,P.skin,P.skinS,4,0);clipped(neck,()=>{X.fillStyle=P.skinS;X.fillRect(70,104,22,8)});path(neck,null,1.1);
 // epaulets
 path('M24,164 L52,148 L58,155 L30,172Z',P.gold,1.1);path('M30,172 L58,155 L59,158 L32,175Z',P.goldS,0);
 path('M136,164 L108,148 L102,155 L130,172Z',P.goldS,1.1);path('M108,148 L136,164 L132,167 L104,152Z',P.gold,0);
 // front lapels
 path('M64,138 L80,160 L80,192 L40,192 L44,160Z',P.uni,1.1);path('M96,138 L80,160 L80,192 L120,192 L116,160Z',P.uni,1.1);path('M96,138 L80,160 L80,172 L100,150Z',P.uniS,0);path('M116,160 L120,192 L108,192Z',P.uniS,0);
 line('M80,160 L80,192',P.gold,1.6);
 [[70,168],[70,180],[90,168],[90,180]].forEach(([x,y])=>dot(x,y,1.6,P.gold));
 // collar
 path('M62,132 C70,138 90,138 98,132 L100,146 C90,154 70,154 60,146Z',P.uni,1.1);
 line('M61,146 C70,154 90,154 99,146',P.gold,2);
 // emblem
 X.beginPath();X.arc(106,172,6,0,7);X.strokeStyle=P.gold;X.lineWidth=2;X.stroke();line('M100,172 l-8,-3 M100,175 l-7,1 M112,172 l8,-3 M112,175 l7,1',P.gold,1.5);
},
fringe(o){return BANGS.map(b=>ribbon(b.slice(0,4),b[4],-1,1,BLUNT))},
frontHair(o){const s=o.sway;
 lock([[52,64],[43,100],[44,140+s*.5],[44+s,186]],7.5,{fill:P.hair,sh:P.hairS,hi:P.hairH,wf:BLUNT});
 lock([[108,64],[117,100],[116,140+s*.5],[116+s,186]],7.5,{fill:P.hair,sh:P.hairS,wf:BLUNT});
 mass('M50,84 C44,50 58,34 80,34 C102,34 116,50 110,84 C106,68 98,54 80,52 C62,54 54,68 50,84Z',P.hair,P.hairS,4,3);
 BANGS.forEach((b,i)=>lock(b.slice(0,4).map((p,j)=>[p[0]+(j>2?s*.3:0),p[1]]),b[4],{fill:P.hair,sh:P.hairS,hi:i%2?null:P.hairH,wf:BLUNT}));
 line('M62,48 Q78,40 98,46',P.hairH,1.4);
 // hair clip
 path('M104,58 L114,56 L116,60 L106,63Z',P.gold,.9);
},
acc(o){}
}})();

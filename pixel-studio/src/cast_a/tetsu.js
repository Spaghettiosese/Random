CAST.tetsu=(()=>{
const BANGS=[[[64,40],[60,50],[60,58],[56,68],6.5],[[76,36],[74,48],[76,58],[79,70],7.5],[[90,38],[93,50],[95,58],[100,67],6.5],[[102,46],[107,54],[108,62],[111,74],5]];
const SPIKES=[[[64,46],[58,38],[52,32],[44,30],7],[[74,40],[70,30],[68,22],[62,16],7],[[88,40],[90,30],[96,22],[104,18],7],[[100,46],[106,38],[112,34],[119,34],7],[[80,38],[80,30],[84,24],[88,19],6]];
return{
P:{line:'#27161e',skin:'#f3d2bc',skinS:'#dfae92',skinD:'#b98468',blush:'#f0a090',hair:'#7a4e2c',hairS:'#4a2e1a',hairH:'#c89a6a',mouthD:'#8a4a3a',
 steel:'#9aa3b3',steelS:'#5f6776',steelH:'#d6dde8',sleeve:'#3b3e49',sleeveS:'#23252d',vest:'#7a8292',vestS:'#515867',orange:'#ff8a2a',orangeS:'#c8601a',silver:'#e4e8ee',band:'#f7e2c6',bandS:'#d6b894'},
face:{hw:31,jw:27,jawY:110,chinY:127,cw:14,top:43,sx:4,sy:3},
eye:{cx:[64,96],y:91,w:7.6,ty:6.2,by:5.6,ir:5,tilt:-.8,lash:2.1,cols:[{d:'#4a2a0a',m:'#c98a3a',l:'#ffd9a0',p:'#2a1406'},{d:'#4a2a0a',m:'#c98a3a',l:'#ffd9a0',p:'#2a1406'}]},
brow:{y:80,in:2.5,out:9.5,th:2.8,arch:1.3},mouth:{y:112,w:8,d:2.6},nose:'bridge',ears:true,blushY:103,blushK:.9,
backHair(o){mass('M50,86 C42,50 56,30 80,30 C104,30 118,50 110,86Z',P.hair,P.hairS,3,2)},
neckShadow(){},
body(o){
 const neck='M63,104 L97,104 L100,140 L60,140Z';
 mass('M-6,192 L-4,166 C-2,150 18,142 48,138 L112,138 C142,142 162,150 164,166 L166,192Z',P.sleeve,P.sleeveS,5,3);
 line('M22,152 C16,168 14,182 14,192',P.sleeveS,1.4);line('M138,152 C144,168 146,182 146,192',P.sleeveS,1.4);
 mass(neck,P.skin,P.skinS,5,0);
 clipped(neck,()=>{ // steel plating on neck + collarbone
  path('M82,108 L100,108 L100,140 L86,140 C88,128 86,118 82,108Z',P.steel,0);path('M91,108 L100,108 L100,140 L94,140 C95,128 94,118 91,108Z',P.steelS,0);
  line('M83,114 L99,114 M85,124 L99,124 M87,133 L99,133',P.steelS,.9);line('M84,110 L88,112',P.steelH,1);dot(88,119,.9,P.steelH);dot(90,129,.9,P.steelH)});
 X.save();X.clip(new Path2D(neck));X.fillStyle=P.skinS;X.fillRect(60,104,50,6);X.restore();
 path(neck,null,1.1);
 path('M60,138 Q80,152 100,138 L104,144 Q80,160 56,144Z',P.sleeveS,1.1);
 // vest
 const vl='M46,140 L64,138 Q70,160 66,192 L22,192 C22,172 32,152 46,140Z',vr='M114,140 L96,138 Q90,160 94,192 L138,192 C138,172 128,152 114,140Z';
 [vl,vr].forEach((d,k)=>{mass(d,P.vest,P.vestS,k?-0:5,2);
  clipped(d,()=>{X.fillStyle=P.orange;X.fillRect(0,165,160,8);X.fillRect(0,181,160,8);X.fillStyle=P.orangeS;X.fillRect(0,170.5,160,2.5);X.fillRect(0,186.5,160,2.5);X.fillStyle=P.silver;X.fillRect(0,168,160,1.4);X.fillRect(0,184,160,1.4)});path(d,null,1.1)});
 line('M66,142 Q68,166 66,192',P.vestS,1.2);line('M94,142 Q92,166 94,192',P.vestS,1.2);
},
fringe(o){return BANGS.map(b=>ribbon(b.slice(0,4),b[4],-1,1,BLUNT))},
frontHair(o){const s=o.sway;
 // sideburns
 [[ [52,60],[49,74],[50,90],[54,102],6 ],[ [108,60],[111,74],[110,90],[106,102],6 ]].forEach(b=>lock(b.slice(0,4),b[4],{fill:P.hair,sh:P.hairS,wf:BLUNT}));
 mass('M49,80 C42,50 56,30 80,30 C104,30 118,50 111,80 C106,66 98,58 80,56 C62,58 54,66 49,80Z',P.hair,P.hairS,4,3);
 SPIKES.forEach(b=>lock(b.slice(0,4).map((p,i)=>[p[0]+(i>2?s*.6*(b[0][0]>80?1:-1):0),p[1]]),b[4],{fill:P.hair,sh:P.hairS,wf:PROF}));
 BANGS.forEach((b,i)=>lock(b.slice(0,4).map((p,j)=>[p[0]+(j>2?s*.4:0),p[1]]),b[4],{fill:P.hair,sh:P.hairS,hi:i%2?P.hairH:null,wf:BLUNT}));
 line('M70,40 Q80,34 92,38',P.hairH,1.3);
},
acc(o){X.save();X.translate(78,100);X.rotate(-.14);path('M-7,-2.4 L7,-2.4 L7,2.4 L-7,2.4Z',P.band,1);X.fillStyle=P.bandS;X.fillRect(-2,-2.2,4,4.4);X.restore()}
}})();

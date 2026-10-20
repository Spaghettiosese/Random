CAST.rin=(()=>{
const BANGS=[[[62,46],[59,58],[60,68],[56,80],6.5],[[74,44],[72,56],[75,66],[74,77],6.5],[[86,44],[88,56],[90,66],[93,77],6.5],[[98,46],[103,58],[104,70],[107,84],6],[[56,56],[52,70],[52,88],[50,104],5]];
return{
P:{line:'#2a3454',skin:'#f9f0f5',skinS:'#e8cfe0',skinD:'#bf9ab6',blush:'#ff9ec8',blushD:'#e8609e',hair:'#eaf4ff',hairS:'#9cc2ec',hairD:'#6d94c8',hairH:'#ffffff',mouthD:'#a04a78',
 cy:'#5fe6ff',cyD:'#25a8c8',cyL:'#c4f8ff',pk:'#ff7ae0',hood:'#3a4870',hoodS:'#263050',hoodL:'#566aa0',str:'#e4ecf8',strS:'#a8b6d0',pant:'#20222e'},
face:{hw:26,jw:20,jawY:108,chinY:122,cw:4,top:46,sx:3.5,sy:2.5},
eye:{cx:[67,93],y:90,w:8,ty:7.4,by:6.8,ir:5.6,tilt:.6,lash:2.2,lash2:1,cols:[{d:'#0a4a66',m:'#4adcf4',l:'#d8fcff',p:'#04283a'},{d:'#7a1470',m:'#ff6ee0',l:'#ffe0f8',p:'#3c0838'}]},
brow:{y:79,in:3,out:8,th:1.5,arch:1.8,col:'#6d94c8'},mouth:{y:109.5,w:5.5,d:2},ears:false,blushY:102,
backHair(o){const s=o.sway;
 mass('M50,90 C42,52 56,34 80,34 C104,34 118,52 110,90 L104,118 L56,118Z',P.hair,P.hairS,3,2);
 lock([[54,70],[34,100],[38+s,150],[30+s*2,186]],15,{fill:P.hair,sh:P.hairS,hi:P.hairH,wf:BLUNT});
 lock([[106,70],[124,100],[120+s,150],[128+s*2,186]],15,{fill:P.hair,sh:P.hairS,hi:P.hairH,wf:BLUNT});
 lock([[70,70],[58,110],[60+s,150],[54+s*1.5,176]],12,{fill:P.hairS,sh:P.hairD,wf:BLUNT});
},
neckShadow(){},
body(o){
 mass('M18,192 L20,166 C22,152 44,144 62,140 L98,140 C116,144 138,152 140,166 L142,192Z',P.hood,P.hoodS,5,3);
 line('M30,156 C26,170 24,182 24,192',P.hoodS,1.3);line('M130,156 C134,170 136,182 136,192',P.hoodS,1.3);
 line('M24,164 C22,174 22,184 22,192',P.cy,1);line('M136,164 C138,174 138,184 138,192',P.cyD,1);
 const neck='M72,104 L88,104 L90,140 L70,140Z';mass(neck,P.skin,P.skinS,4,0);
 clipped(neck,()=>{X.fillStyle=P.skinS;X.fillRect(70,104,22,7)});path(neck,null,1.1);
 // cyan rift crack on neck
 line('M72,116 l4,5 l-3,4 l5,6',P.cy,1.2);dot(77,127,.9,P.cyL);
 // hood bunched
 mass('M48,138 C50,156 64,164 80,164 C96,164 110,156 112,138 L102,132 Q80,146 58,132Z',P.hoodL,P.hood,3,2);
 line('M58,134 Q80,150 102,134',P.hoodS,1.2);
 // drawstrings
 line('M72,148 Q70,162 72,176',P.str,1.6);line('M88,148 Q90,162 88,178',P.str,1.6);dot(72,177,1.5,P.strS);dot(88,179,1.5,P.strS);
 // badge
 X.beginPath();X.arc(110,170,7,0,7);X.fillStyle=P.hoodS;X.fill();X.strokeStyle=P.cy;X.lineWidth=1.6;X.stroke();line('M110.5,166 L110.5,174 M108.5,167.5 L110.5,166',P.cy,1.4);
},
fringe(o){return BANGS.map(b=>ribbon(b.slice(0,4),b[4],-1,1,BLUNT))},
frontHair(o){const s=o.sway;
 // side locks in front of shoulders
 lock([[53,70],[44,110],[46+s*.5,142],[42+s,166]],5.5,{fill:P.hair,sh:P.hairS,hi:P.hairH,wf:BLUNT});
 // braid (viewer right)
 const bx=(t)=>110+t*14+Math.sin(t*5)*3+s*t*1.5,by=(t)=>96+t*84;
 for(let i=0;i<8;i++){const t=i/7;const cx=bx(t),cy=by(t);const r=6.2-t*2.4;ell(cx,cy,r,6.6-t*1.4,P.hair,(i%2?.35:-.35),1.05);path(`M${cx-r*.7},${cy-1} Q${cx},${cy+3} ${cx+r*.7},${cy-1}`,null,0);ell(cx+1.2,cy+1.5,r*.55,3,P.hairS,(i%2?.35:-.35))}
 path(`M${bx(1)-4},${by(1)+4} L${bx(1)+4},${by(1)+4} L${bx(1)+2},${by(1)+14} L${bx(1)-2},${by(1)+14}Z`,P.hairS,1);
 ell(bx(1),by(1)+3,4.2,2.4,P.cy,0,1);
 mass('M50,84 C44,50 58,34 80,34 C102,34 116,50 110,84 C106,68 98,56 80,54 C62,56 54,68 50,84Z',P.hair,P.hairS,4,3);
 BANGS.forEach((b,i)=>lock(b.slice(0,4).map((p,j)=>[p[0]+(j>2?s*.4:0),p[1]]),b[4],{fill:P.hair,sh:P.hairS,hi:i%2?P.hairH:null,wf:BLUNT}));
 // cyan tint tips
 BANGS.forEach(b=>{const t0=.72;const pts=b.slice(0,4);clipped(ribbon(pts,b[4],-1,1,BLUNT),()=>{X.fillStyle=P.cy;X.globalAlpha=.9;const e=bez(pts,.97);X.beginPath();X.ellipse(e[0],e[1]+4,9,5,0,0,7);X.fill();X.globalAlpha=1})});
 line('M64,50 Q76,44 92,47',P.hairH,1.3);
},
acc(o){const s=o.sway,fl=(x,y,k,sc)=>{const yy=y+Math.sin((o.i+k)*.8)*1.6;path(`M${x},${yy-6*sc} L${x+3*sc},${yy} L${x},${yy+5*sc} L${x-3*sc},${yy}Z`,P.cyL,.9);path(`M${x},${yy-6*sc} L${x+3*sc},${yy} L${x},${yy}Z`,P.cy,0)};
 fl(28,80,0,1.2);fl(136,118,2,1);fl(128,34,4,.9);
 line('M84,60 l4,6 l-3,4',P.cy,1.1)}
}})();

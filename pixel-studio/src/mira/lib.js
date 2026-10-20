// shared bust helpers (browser)
const W=160,H=192,K=4;
function hex(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mkctx(x){
  const path=(d,fill,sw=1.1,col)=>{const p=new Path2D(d);if(fill){x.fillStyle=fill;x.fill(p)}if(sw){x.strokeStyle=col||P.line;x.lineWidth=sw;x.stroke(p)}return p};
  const line=(d,c,w)=>{x.strokeStyle=c;x.lineWidth=w;x.stroke(new Path2D(d))};
  const dot=(cx,cy,r,c)=>{x.fillStyle=c;x.beginPath();x.arc(cx,cy,r,0,7);x.fill()};
  const ell=(cx,cy,rx,ry,c,a=1,rot=0)=>{x.globalAlpha=a;x.fillStyle=c;x.beginPath();x.ellipse(cx,cy,rx,ry,rot,0,7);x.fill();x.globalAlpha=1};
  return {path,line,dot,ell};
}
// generic eye. o: cx, cy, n (inner dir), w, hu, hd, slant, gx, gy, ir (iris rx), iry
function eye(x,H_,o){
  const {path,line,dot}=H_,{cx,cy,n}=o;const w=o.w||8,hu=o.hu||9,hd=o.hd||8,s=o.slant||0;
  const ox=cx-n*w,oy=cy+(o.oy||0),ix=cx+n*w,iy=cy+s;
  const shape=`M${ox},${oy} C${ox+n*2},${cy-hu} ${ix-n*3},${cy-hu+s} ${ix},${iy} C${ix-n*3},${cy+hd+s} ${ox+n*3},${cy+hd} ${ox},${oy} Z`;
  x.save();x.clip(new Path2D(shape));
  x.fillStyle=P.white;x.fillRect(cx-12,cy-14,24,30);
  x.fillStyle=P.eyeSh;x.fillRect(cx-12,cy-hu-2,24,(o.shadeH||4)+2);
  const gx=cx+(o.gx||0),gy=cy+(o.gy||0)+1,rx=o.ir||5.8,ry=o.iry||7.4;
  path(`M${gx-rx},${gy} a${rx},${ry} 0 1,0 ${rx*2},0 a${rx},${ry} 0 1,0 ${-rx*2},0`,P.iris,0);
  x.fillStyle=P.irisD;x.beginPath();x.ellipse(gx,gy-ry*.35,rx,ry*.75,0,Math.PI,0);x.fill(); // darker upper
  x.fillStyle=P.iris;x.beginPath();x.ellipse(gx,gy+1.3,rx*.9,ry*.62,0,0,7);x.fill();
  x.fillStyle=P.irisL;x.beginPath();x.ellipse(gx,gy+ry*.62,rx*.62,ry*.28,0,0,7);x.fill();
  const pr=o.pr||2.7;x.fillStyle=P.pupil;x.beginPath();x.ellipse(gx,gy,pr,pr*1.35,0,0,7);x.fill();
  x.fillStyle=P.white;x.beginPath();x.arc(gx-n*2.2-0,gy-3.2,o.hl||1.9,0,7);x.fill();x.beginPath();x.arc(gx+n*2.4,gy+3.4,.95,0,7);x.fill();
  if(o.tear){x.fillStyle=P.tear;x.globalAlpha=.9;x.beginPath();x.ellipse(cx,cy+hd-1.2+s*.3,w-1,1.8,0,0,7);x.fill();x.globalAlpha=1;x.fillStyle=P.white;x.beginPath();x.arc(gx+n*1,gy+3,1.3,0,7);x.fill()}
  x.restore();
  // lash line
  line(`M${ox-n*1},${oy+1} C${ox+n*2},${cy-hu-.5} ${ix-n*3},${cy-hu+s-.5} ${ix},${iy-.5}`,P.line,o.lash||2.2);
  line(`M${ox-n*.5},${oy+.5} l${-n*2.6},${o.flick===undefined?-1.6:o.flick}`,P.line,1.3); // outer flick
  line(`M${ix},${iy} C${ix-n*3},${cy+hd+s} ${ox+n*3},${cy+hd} ${ox},${oy}`,P.lineSoft,.6);
}
function eyeClosed(x,H_,cx,cy,n,kind,w=8){
  const {line}=H_;
  if(kind==='happy'){line(`M${cx-w},${cy+2} Q${cx},${cy-8} ${cx+w},${cy+2}`,P.line,2.1);line(`M${cx-n*w},${cy+1.5} l${-n*2.4},-1.4`,P.line,1.2);line(`M${cx-w+2},${cy+3.2} Q${cx},${cy-3} ${cx+w-2},${cy+3.2}`,P.blush,.7)}
  else{line(`M${cx-w},${cy+1} Q${cx},${cy+6.5} ${cx+w},${cy+1}`,P.line,1.9);line(`M${cx-n*w},${cy+1.2} l${-n*2.4},-1.2`,P.line,1.2)}
}
// quantize pipeline
function makePipeline(PALobj,lineKey,noEdgeKeys,drawFn){
  const keys=Object.keys(PALobj),PAL=keys.map(k=>hex(PALobj[k])),li=keys.indexOf(lineKey),ne=new Set(noEdgeKeys.map(k=>keys.indexOf(k)));
  const LI=PAL[li],lineLike=new Set(keys.map((k,j)=>/^line/.test(k)?j:-1).filter(j=>j>=0));
  function toPix(o){const c=document.createElement('canvas');c.width=W*K;c.height=H*K;const cx=c.getContext('2d');cx.save();cx.scale(K,K);cx.lineJoin='round';cx.lineCap='round';drawFn(cx,o);cx.restore();
    const m=document.createElement('canvas');m.width=W*2;m.height=H*2;m.getContext('2d').drawImage(c,0,0,W*2,H*2);
    const s=document.createElement('canvas');s.width=W;s.height=H;const sx=s.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(m,0,0,W,H);return sx.getImageData(0,0,W,H).data}
  return function build(o){const d=toPix(o),out=new Uint8ClampedArray(W*H*4),op=i=>d[i*4+3]>110,solid=new Uint8Array(W*H);
    const lines=new Uint8Array(W*H);
    for(let i=0;i<W*H;i++){if(!op(i))continue;const a=d[i*4+3]/255;const r=d[i*4]/a,g=d[i*4+1]/a,b=d[i*4+2]/a;let bi=0,bd=1e9;
      PAL.forEach((c,j)=>{if(lineLike.has(j)&&(r*.3+g*.59+b*.11)>105)return;if(ne.has(j)&&d[i*4+3]<250)return;const q=(c[0]-r)**2*.3+(c[1]-g)**2*.59+(c[2]-b)**2*.11;if(q<bd){bd=q;bi=j}});
      const c=PAL[bi];out.set([c[0],c[1],c[2],255],i*4)}
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(op(i))continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const X=x+a,Y=y+b;return X>=0&&Y>=0&&X<W&&Y<H&&op(Y*W+X)}))out.set([...LI,255],i*4)}
    return out}
}
function b64(u8){let s='';const n=u8.length;for(let i=0;i<n;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)}
function mouth(x,H_,cx,cy,type,open){
  const {path,line}=H_,M=P.mouth,T=P.tongue;
  const D=(d,f=M)=>path(d,f,1.0);
  const T_=(ex,ey,rx,ry)=>{x.fillStyle=T;x.beginPath();x.ellipse(cx+ex,cy+ey,rx,ry,0,0,7);x.fill()};
  switch(type){
   case 'smile': if(open){D(`M${cx-4.5},${cy-.5} Q${cx},${cy+1.5} ${cx+4.5},${cy-.5} Q${cx+3},${cy+5.5} ${cx},${cy+5.5} Q${cx-3},${cy+5.5} ${cx-4.5},${cy-.5}Z`);T_(0,3.8,2,1.1)} else {line(`M${cx-4},${cy} Q${cx},${cy+3.4} ${cx+4},${cy}`,P.line,1.2);line(`M${cx-4.4},${cy-.4} l-.8,-.8 M${cx+4.4},${cy-.4} l.8,-.8`,P.line,.7)} break;
   case 'grin': if(open){D(`M${cx-5.5},${cy-1} Q${cx},${cy+1} ${cx+5.5},${cy-1} Q${cx+4.5},${cy+7} ${cx},${cy+7} Q${cx-4.5},${cy+7} ${cx-5.5},${cy-1}Z`);T_(0,4.6,2.6,1.4);path(`M${cx-4.5},${cy-.4} Q${cx},${cy+1.4} ${cx+4.5},${cy-.4} L${cx+4},${cy+1.3} Q${cx},${cy+2.7} ${cx-4},${cy+1.3}Z`,P.white,0)} else {D(`M${cx-5},${cy-1} Q${cx},${cy+.8} ${cx+5},${cy-1} Q${cx+3.5},${cy+5} ${cx},${cy+5} Q${cx-3.5},${cy+5} ${cx-5},${cy-1}Z`);T_(0,3.3,2,1)} break;
   case 'wavy': if(open){D(`M${cx-2.6},${cy} Q${cx},${cy-1.2} ${cx+2.6},${cy} Q${cx+2.6},${cy+3.8} ${cx},${cy+3.8} Q${cx-2.6},${cy+3.8} ${cx-2.6},${cy}Z`)} else {line(`M${cx-4},${cy+.6} q1.4,-1.6 2.7,0 t2.7,0 t2.7,0`,P.line,1.1)} break;
   case 'frown': if(open){D(`M${cx-4},${cy+3} Q${cx},${cy-1.5} ${cx+4},${cy+3} Q${cx},${cy+2} ${cx-4},${cy+3}Z`);x.fillStyle=M;x.fillRect(cx-2,cy+.8,4,2)} else {line(`M${cx-4},${cy+2.6} Q${cx},${cy-1.2} ${cx+4},${cy+2.6}`,P.line,1.3)} break;
   case 'grit': if(open){D(`M${cx-6},${cy-.5} L${cx+6},${cy-.5} L${cx+5},${cy+5} L${cx-5},${cy+5}Z`,P.white);line(`M${cx-6},${cy+2.2} L${cx+6},${cy+2.2} M${cx},${cy-.5} L${cx},${cy+5}`,P.line,.7)} else {D(`M${cx-5},${cy} L${cx+5},${cy} L${cx+4.2},${cy+3.6} L${cx-4.2},${cy+3.6}Z`,P.white);line(`M${cx-4.6},${cy+1.8} L${cx+4.6},${cy+1.8}`,P.line,.6)} break;
   case 'o': D(`M${cx-2.8},${cy+.5} C${cx-2.8},${cy-2.5} ${cx+2.8},${cy-2.5} ${cx+2.8},${cy+.5} C${cx+2.8},${cy+5.5} ${cx-2.8},${cy+5.5} ${cx-2.8},${cy+.5}Z`);T_(0,3.4,1.7,1) ;break;
  }
}

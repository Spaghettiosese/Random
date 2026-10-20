// shared pixel pipeline (browser). vector draw at K x -> downsample -> palette quantize -> indexed output
const hexRGB=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
// downsample canvas (w*K x h*K) to w x h, returns RGBA data
function down(c,W,H,K){let cur=c;while(cur.width>W*2){const n=mkCanvas(cur.width/2,cur.height/2);const x=n.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(cur,0,0,n.width,n.height);cur=n}
 const s=mkCanvas(W,H);const sx=s.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(cur,0,0,W,H);return sx.getImageData(0,0,W,H).data}
// Bust pipeline: palette P (object name->hex, 'line' key is outline). fill & line layers.
function bustPix(W,H,K,P,drawFn,o){
 const fc=mkCanvas(W*K,H*K),lc=mkCanvas(W*K,H*K);const fx=fc.getContext('2d'),lx=lc.getContext('2d');
 for(const x of [fx,lx]){x.save();x.scale(K,K);x.lineJoin='round';x.lineCap='round'}
 const h=mkHelper(fx,lx,P);drawFn(h,o);fx.restore();lx.restore();
 const fd=down(fc,W,H,K),ld=down(lc,W,H,K);
 const names=Object.keys(P).filter(k=>k!=='line'),PAL=names.map(k=>hexRGB(P[k]));
 const idx=new Uint8Array(W*H);// 0 transparent,1 = line, 2.. = fill
 const LINE=1;
 const lineAt=i=>ld[i*4+3]>118;
 const opaque=i=>fd[i*4+3]>100||lineAt(i);
 for(let i=0;i<W*H;i++){
  if(lineAt(i)){idx[i]=LINE;continue}
  if(fd[i*4+3]<=100)continue;
  const a=fd[i*4+3]/255;const r=fd[i*4]/a,g=fd[i*4+1]/a,b=fd[i*4+2]/a;let bi=0,bd=1e9;
  PAL.forEach((c,j)=>{const q=(c[0]-r)**2*.3+(c[1]-g)**2*.59+(c[2]-b)**2*.11;if(q<bd){bd=q;bi=j}});idx[i]=bi+2}
 // silhouette outline
 const add=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(idx[i])continue;
  let nb=false,ln=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b;if(X<0||Y<0||X>=W||Y>=H)continue;const j=Y*W+X;if(idx[j]){nb=true;if(idx[j]===LINE)ln=true}}
  if(nb&&!ln)add.push(i)}
 add.forEach(i=>idx[i]=LINE);
 return {idx,pal:[[0,0,0],hexRGB(P.line),...PAL],W,H}}
function mkHelper(fx,lx,P){
 const h={fx,lx,P};
 h.path=(d,fill,sw=1.1,lc)=>{const p=typeof d==='string'?new Path2D(d):d;if(fill){lx.globalCompositeOperation='destination-out';lx.fill(p);lx.globalCompositeOperation='source-over';fx.fillStyle=fill;fx.fill(p)}if(sw){const t=(lc&&lc!=='L')?fx:lx;t.strokeStyle=(lc&&lc!=='L')?lc:'#000';t.lineWidth=sw;t.stroke(p)}return p};
 h.line=(d,c,w)=>{const t=(c===P.line||c==='L')?lx:fx;t.strokeStyle=(c==='L'?'#000':c);t.lineWidth=w;t.stroke(new Path2D(d))};
 h.fillC=(cx,cy,r,c)=>{fx.fillStyle=c;fx.beginPath();fx.arc(cx,cy,r,0,7);fx.fill();lx.globalCompositeOperation='destination-out';lx.beginPath();lx.arc(cx,cy,r,0,7);lx.fill();lx.globalCompositeOperation='source-over'};
 h.fillE=(cx,cy,rx,ry,c,rot=0)=>{fx.fillStyle=c;fx.beginPath();fx.ellipse(cx,cy,rx,ry,rot,0,7);fx.fill();lx.globalCompositeOperation='destination-out';lx.beginPath();lx.ellipse(cx,cy,rx,ry,rot,0,7);lx.fill();lx.globalCompositeOperation='source-over'};
 h.star=(cx,cy,r,c,sw=.8,rot=0)=>{const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+rot+i*Math.PI/5,rr=i%2?r*.45:r;pts.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr])}
  const d='M'+pts.map(p=>p[0].toFixed(2)+','+p[1].toFixed(2)).join(' L')+'Z';return h.path(d,c,sw)};
 h.save=()=>{fx.save();lx.save()};h.restore=()=>{fx.restore();lx.restore()};
 h.clip=p=>{fx.clip(p);lx.clip(p)};h.translate=(x,y)=>{fx.translate(x,y);lx.translate(x,y)};
 return h}
// export for node: indexed -> base64
function packIdx(r){let s='';const u=r.idx;for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return {w:r.W,h:r.H,pal:r.pal,px:btoa(s)}}
// seeded rng
function rng(seed){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
// preview composite of idx result
function idxCanvas(r,bg){const c=mkCanvas(r.W,r.H);const x=c.getContext('2d');const id=x.createImageData(r.W,r.H);for(let i=0;i<r.idx.length;i++){const k=r.idx[i];if(!k&&!bg){continue}const p=k?r.pal[k]:bg;id.data.set([p[0],p[1],p[2],255],i*4)}x.putImageData(id,0,0);return c}

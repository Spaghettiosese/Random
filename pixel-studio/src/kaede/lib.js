// shared pipeline: render at K x, snap to palette (mode snap), outline pass
const PX={};
PX.rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
PX.render=(W,H,K,fn)=>{const c=document.createElement('canvas');c.width=W*K;c.height=H*K;const x=c.getContext('2d',{willReadFrequently:true});x.save();x.scale(K,K);x.lineJoin='round';x.lineCap='round';fn(x);x.restore();return x.getImageData(0,0,W*K,H*K).data};
// bust: explicit palette, idx 0 = line. returns Uint8Array idx (255 transparent)
PX.snapBust=(d,W,H,K,pal,wt)=>{
 const cache=new Map();
 const near=(r,g,b)=>{const k=r<<16|g<<8|b;let v=cache.get(k);if(v!==undefined)return v;let bd=1e9,bi=0;const lum=r*.3+g*.59+b*.11;
  for(let j=0;j<pal.length;j++){if(j===0&&lum>80)continue;const c=pal[j];const q=(c[0]-r)**2*.3+(c[1]-g)**2*.59+(c[2]-b)**2*.11;if(q<bd){bd=q;bi=j}}cache.set(k,bi);return bi};
 const out=new Uint8Array(W*H).fill(255),cnt=new Float32Array(pal.length);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let n=0;cnt.fill(0);
  for(let sy=0;sy<K;sy++)for(let sx=0;sx<K;sx++){const i=((y*K+sy)*W*K+x*K+sx)*4;if(d[i+3]<128)continue;n++;const j=near(d[i],d[i+1],d[i+2]);cnt[j]+=wt[j]||1}
  if(n<K*K*.42)continue;let bj=0,bv=-1;for(let j=0;j<pal.length;j++)if(cnt[j]>bv){bv=cnt[j];bj=j}out[y*W+x]=bj}
 const o2=out.slice();
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(out[y*W+x]!==255)continue;
  for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b;if(X>=0&&Y>=0&&X<W&&Y<H&&out[Y*W+X]!==255){o2[y*W+x]=0;break}}}
 return o2};
PX.b64=u8=>{let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s)};
// median cut palette from pooled RGB samples [[r,g,b,w]]
PX.medcut=(px,k)=>{let boxes=[px];while(boxes.length<k){let bi=-1,bs=-1;boxes.forEach((b,i)=>{if(b.length<2)return;let mn=[255,255,255],mx=[0,0,0];b.forEach(p=>{for(let c=0;c<3;c++){mn[c]=Math.min(mn[c],p[c]);mx[c]=Math.max(mx[c],p[c])}});const r=Math.max(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2]),s=r*Math.sqrt(b.reduce((a,p)=>a+p[3],0));if(s>bs){bs=s;bi=i}});if(bi<0)break;const b=boxes[bi];let mn=[255,255,255],mx=[0,0,0];b.forEach(p=>{for(let c=0;c<3;c++){mn[c]=Math.min(mn[c],p[c]);mx[c]=Math.max(mx[c],p[c])}});let ch=0,rg=0;for(let c=0;c<3;c++)if(mx[c]-mn[c]>rg){rg=mx[c]-mn[c];ch=c}b.sort((p,q)=>p[ch]-q[ch]);const tot=b.reduce((a,p)=>a+p[3],0);let acc=0,cut=1;for(let i=0;i<b.length;i++){acc+=b[i][3];if(acc>=tot/2){cut=Math.min(Math.max(i+1,1),b.length-1);break}}boxes.splice(bi,1,b.slice(0,cut),b.slice(cut))}
 return boxes.map(b=>{let w=0,r=0,g=0,bb=0;b.forEach(p=>{w+=p[3];r+=p[0]*p[3];g+=p[1]*p[3];bb+=p[2]*p[3]});return [Math.round(r/w),Math.round(g/w),Math.round(bb/w)]})};
// CG: render frames, build palette from all, quantize w/ Bayer dither on smooth areas, mode on edges
PX.quantCG=(frames,W,H,K,ncol,force)=>{
 // box average each frame
 const avg=frames.map(d=>{const a=new Uint8ClampedArray(W*H*3),v=new Float32Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++){let r=0,g=0,b=0,r2=0;const ls=[];for(let sy=0;sy<K;sy++)for(let sx=0;sx<K;sx++){const i=((y*K+sy)*W*K+x*K+sx)*4;r+=d[i];g+=d[i+1];b+=d[i+2];ls.push(d[i]*.3+d[i+1]*.59+d[i+2]*.11)}const n=K*K,m=ls.reduce((s,q)=>s+q,0)/n;v[y*W+x]=Math.sqrt(ls.reduce((s,q)=>s+(q-m)**2,0)/n);const o=(y*W+x)*3;a[o]=r/n;a[o+1]=g/n;a[o+2]=b/n}return {a,v}});
 const hist=new Map();
 frames.forEach((_,fi)=>{const {a,v}=avg[fi];for(let i=0;i<W*H;i++){if(v[i]>10&&fi%2)continue;const r=a[i*3]>>2<<2,g=a[i*3+1]>>2<<2,b=a[i*3+2]>>2<<2,k=r<<16|g<<8|b;hist.set(k,(hist.get(k)||0)+1)}});
 const px=[...hist].map(([k,c])=>[k>>16&255,k>>8&255,k&255,Math.pow(c,.6)]);
 let pal=PX.medcut(px,ncol-(force?force.length:0));
 if(force)pal=force.concat(pal);
 const cache=new Map();const near=(r,g,b)=>{const k=(r|0)<<16|(g|0)<<8|(b|0);let v=cache.get(k);if(v!==undefined)return v;let bd=1e9,bi=0;for(let j=0;j<pal.length;j++){const c=pal[j];const q=(c[0]-r)**2*.3+(c[1]-g)**2*.59+(c[2]-b)**2*.11;if(q<bd){bd=q;bi=j}}cache.set(k,bi);return bi};
 const B=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 const outs=frames.map((d,fi)=>{const {a,v}=avg[fi],out=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;
   if(v[i]>14){const m=new Map();let bj=0,bv=0;for(let sy=0;sy<K;sy++)for(let sx=0;sx<K;sx++){const q=((y*K+sy)*W*K+x*K+sx)*4;const j=near(d[q],d[q+1],d[q+2]);const c=(m.get(j)||0)+1;m.set(j,c);if(c>bv){bv=c;bj=j}}out[i]=bj}
   else{const t=(B[(y&3)*4+(x&3)]/16-.47)*13;out[i]=near(Math.max(0,Math.min(255,a[i*3]+t)),Math.max(0,Math.min(255,a[i*3+1]+t)),Math.max(0,Math.min(255,a[i*3+2]+t)))}}
  return out});
 return {pal,outs}};

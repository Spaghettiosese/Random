// minimal indexed-PNG encoder (palette + tRNS), deterministic
const zlib=require('zlib');
const crcT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=b=>{let c=0xffffffff;for(let i=0;i<b.length;i++)c=crcT[(c^b[i])&255]^(c>>>8);return(c^0xffffffff)>>>0};
function chunk(type,data){const o=Buffer.alloc(12+data.length);o.writeUInt32BE(data.length,0);o.write(type,4,'ascii');Buffer.from(data).copy(o,8);o.writeUInt32BE(crc(o.subarray(4,8+data.length)),8+data.length);return o}
// idx: Uint8Array w*h of palette indices, pal: [[r,g,b]...], transIdx: index that is transparent (or -1)
function encode(w,h,idx,pal,transIdx=-1){
  const bits=pal.length<=2?1:pal.length<=4?2:pal.length<=16?4:8;
  const rowB=Math.ceil(w*bits/8),raw=Buffer.alloc((rowB+1)*h);
  for(let y=0;y<h;y++){let p=y*(rowB+1);raw[p++]=0;
    if(bits===8){for(let x=0;x<w;x++)raw[p+x]=idx[y*w+x]}
    else{for(let x=0;x<w;x++){const v=idx[y*w+x];const bp=x*bits,sh=8-bits-(bp%8);raw[p+(bp>>3)]|=v<<sh}}}
  // try filter 0 only for determinism; sub filter often better:
  const filt=Buffer.alloc(raw.length);
  for(let y=0;y<h;y++){const p=y*(rowB+1);filt[p]=1;const bpp=1;for(let i=0;i<rowB;i++){filt[p+1+i]=(raw[p+1+i]-(i>=bpp?raw[p+1+i-bpp]:0))&255}}
  const z0=zlib.deflateSync(raw,{level:9,memLevel:9}),z1=zlib.deflateSync(filt,{level:9,memLevel:9});
  const z=z1.length<z0.length?z1:z0;
  if(z!==z1){/*filter 0 chosen*/}
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=bits;ihdr[9]=3;
  const plte=Buffer.alloc(pal.length*3);pal.forEach((c,i)=>{plte[i*3]=c[0];plte[i*3+1]=c[1];plte[i*3+2]=c[2]});
  const parts=[Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('PLTE',plte)];
  if(transIdx>=0){const t=Buffer.alloc(transIdx+1,255);t[transIdx]=0;parts.push(chunk('tRNS',t))}
  parts.push(chunk('IDAT',z),chunk('IEND',Buffer.alloc(0)));return Buffer.concat(parts)}
const url=b=>'data:image/png;base64,'+b.toString('base64');
module.exports={encode,url};

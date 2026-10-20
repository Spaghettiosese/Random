const zlib=require('zlib');
const T=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=b=>{let c=~0;for(const x of b)c=T[(c^x)&255]^(c>>>8);return (~c)>>>0};
const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c])};
// frame: {w,h,pal,px(base64 idx)}; transparent: palette idx 0 is transparent if trans
exports.encode=(f,trans)=>{
 const idx=Buffer.from(f.px,'base64');const n=f.pal.length;let bits=n<=2?1:n<=4?2:n<=16?4:8;
 const rowB=Math.ceil(f.w*bits/8);const raw=Buffer.alloc((rowB+1)*f.h);
 for(let y=0;y<f.h;y++){raw[y*(rowB+1)]=0;for(let x=0;x<f.w;x++){const v=idx[y*f.w+x];if(bits===8)raw[y*(rowB+1)+1+x]=v;else{const bp=x*bits,by=bp>>3,sh=8-bits-(bp&7);raw[y*(rowB+1)+1+by]|=v<<sh}}}
 const ih=Buffer.alloc(13);ih.writeUInt32BE(f.w,0);ih.writeUInt32BE(f.h,4);ih[8]=bits;ih[9]=3;
 const pl=Buffer.from(f.pal.flat());
 const parts=[Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',pl)];
 if(trans)parts.push(chunk('tRNS',Buffer.from([0])));
 parts.push(chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0)));
 return Buffer.concat(parts)};
exports.url=(f,t)=>'data:image/png;base64,'+exports.encode(f,t).toString('base64');

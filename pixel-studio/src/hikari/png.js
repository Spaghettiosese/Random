const zlib=require('zlib');
const crcT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=b=>{let c=0xffffffff;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0};
const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c])};
// idx: Uint8Array w*h with values = palette index (+1 if transparent0)
function pngIndexed(w,h,idx,pal,transparent0){
 const n=pal.length+(transparent0?1:0);const bd=n<=2?1:n<=4?2:n<=16?4:8;
 const plte=Buffer.alloc(n*3);let o=0;if(transparent0)o=3;pal.forEach((c,i)=>{plte[o+i*3]=c[0];plte[o+i*3+1]=c[1];plte[o+i*3+2]=c[2]});
 const rb=Math.ceil(w*bd/8);const raw=Buffer.alloc((rb+1)*h);
 const rows=[];
 for(let y=0;y<h;y++){const row=Buffer.alloc(rb);for(let x=0;x<w;x++){const v=idx[y*w+x];if(bd===8)row[x]=v;else{const bit=x*bd;row[bit>>3]|=v<<(8-bd-(bit&7))}}
  // choose best filter (0 none,1 sub,2 up)
  const prev=y?rows[y-1]:Buffer.alloc(rb);const bpp=1;const cands=[row,Buffer.from(row.map((v,i)=>(v-(i>=bpp?row[i-bpp]:0))&255)),Buffer.from(row.map((v,i)=>(v-prev[i])&255))];
  let best=0,bs=1e12;cands.forEach((c,f)=>{let s=0;for(const v of c)s+=v<128?v:256-v;if(s<bs){bs=s;best=f}});
  raw[y*(rb+1)]=best;cands[best].copy(raw,y*(rb+1)+1);rows.push(row)}
 const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=bd;ih[9]=3;
 const parts=[Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',plte)];
 if(transparent0)parts.push(chunk('tRNS',Buffer.from([0])));
 parts.push(chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0)));
 return Buffer.concat(parts);
}
module.exports={pngIndexed};

const zlib=require('zlib');
const T=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;T[n]=c>>>0}
const crc=b=>{let c=0xffffffff;for(const x of b)c=T[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0};
const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c])};
// idx: Uint8Array w*h; pal: [[r,g,b,a]]
module.exports=function(w,h,idx,pal){const n=pal.length,bd=n<=2?1:n<=4?2:n<=16?4:8,rb=Math.ceil(w*bd/8);
 const raw=[];const rows=[];for(let y=0;y<h;y++){const r=Buffer.alloc(rb);for(let x=0;x<w;x++){const v=idx[y*w+x];if(bd===8)r[x]=v;else{const bit=x*bd;r[bit>>3]|=v<<(8-bd-(bit&7))}}rows.push(r)}
 const prev0=Buffer.alloc(rb);
 for(let y=0;y<h;y++){const r=rows[y],p=y?rows[y-1]:prev0;let best=null,bs=1e18;
  for(let f=0;f<5;f++){const o=Buffer.alloc(rb);for(let i=0;i<rb;i++){const a=i?r[i-1]:0,b=p[i],c=i?p[i-1]:0;let pr=0;if(f===1)pr=a;else if(f===2)pr=b;else if(f===3)pr=(a+b)>>1;else if(f===4){const pp=a+b-c,pa=Math.abs(pp-a),pb=Math.abs(pp-b),pc=Math.abs(pp-c);pr=pa<=pb&&pa<=pc?a:pb<=pc?b:c}o[i]=(r[i]-pr)&255}let s=0;for(const v of o)s+=v>127?256-v:v;if(s<bs){bs=s;best=Buffer.concat([Buffer.from([f]),o])}}
  raw.push(best)}
 const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=bd;ih[9]=3;
 const plte=Buffer.from(pal.flatMap(c=>[c[0],c[1],c[2]]));let last=-1;pal.forEach((c,i)=>{if(c[3]<255)last=i});
 const parts=[Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',plte)];
 if(last>=0)parts.push(chunk('tRNS',Buffer.from(pal.slice(0,last+1).map(c=>c[3]))));
 parts.push(chunk('IDAT',zlib.deflateSync(Buffer.concat(raw),{level:9})),chunk('IEND',Buffer.alloc(0)));
 return 'data:image/png;base64,'+Buffer.concat(parts).toString('base64')};

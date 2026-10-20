const zlib=require('zlib');
const T=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=b=>{let c=0xffffffff;for(let i=0;i<b.length;i++)c=T[(c^b[i])&255]^(c>>>8);return (c^0xffffffff)>>>0};
const chunk=(t,d)=>{const b=Buffer.alloc(12+d.length);b.writeUInt32BE(d.length,0);b.write(t,4,'latin1');d.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,8+d.length)),8+d.length);return b};
// rgba: Buffer w*h*4. returns indexed PNG Buffer
function encode(w,h,rgba){
  const map=new Map(),pal=[],idx=new Uint8Array(w*h);let hasA=false;
  for(let i=0;i<w*h;i++){let r=rgba[i*4],g=rgba[i*4+1],b=rgba[i*4+2],a=rgba[i*4+3];if(a<128){r=g=b=0;a=0;hasA=true}else a=255;
    const k=(r<<24|g<<16|b<<8|a)>>>0;let j=map.get(k);if(j===undefined){j=pal.length;map.set(k,j);pal.push([r,g,b,a])}idx[i]=j}
  if(pal.length>256)throw new Error('palette>256: '+pal.length);
  // put transparent first
  const bd=pal.length<=2?1:pal.length<=4?2:pal.length<=16?4:8;
  const rb=Math.ceil(w*bd/8),raw=Buffer.alloc((rb+1)*h);
  for(let y=0;y<h;y++){const row=Buffer.alloc(rb);for(let x=0;x<w;x++){const v=idx[y*w+x];if(bd===8)row[x]=v;else{const bit=x*bd;row[bit>>3]|=v<<(8-bd-(bit&7))}}
    // choose filter by min abs sum
    let best=0,bs=1e18,bf=null;for(const f of [0,1,2,4]){const o=Buffer.alloc(rb);for(let i=0;i<rb;i++){const a=i>=1?row[i-1]:0,up=y?prevRow[i]:0,ul=(y&&i)?prevRow[i-1]:0;let p=0;
      if(f===1)p=a;else if(f===2)p=up;else if(f===4){const pp=a+up-ul,pa=Math.abs(pp-a),pb=Math.abs(pp-up),pc=Math.abs(pp-ul);p=pa<=pb&&pa<=pc?a:pb<=pc?up:ul}o[i]=(row[i]-p)&255}
      let s=0;for(let i=0;i<rb;i++){const v=o[i];s+=v<128?v:256-v}if(s<bs){bs=s;best=f;bf=o}}
    raw[y*(rb+1)]=best;bf.copy(raw,y*(rb+1)+1);var prevRow=row;}
  const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=bd;ih[9]=3;
  const plte=Buffer.alloc(pal.length*3);pal.forEach((c,i)=>{plte[i*3]=c[0];plte[i*3+1]=c[1];plte[i*3+2]=c[2]});
  const parts=[Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('PLTE',plte)];
  if(hasA)parts.push(chunk('tRNS',Buffer.from(pal.map(c=>c[3]))));
  parts.push(chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0)));
  return Buffer.concat(parts);
}
module.exports={encode};

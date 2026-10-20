// page-side bust harness
const W=160,H=192,K=4;
function toPix(draw,o){const c=document.createElement('canvas');c.width=W*K;c.height=H*K;const x=c.getContext('2d');x.save();x.scale(K,K);x.lineJoin='round';x.lineCap='round';draw(x,o);x.restore();
 const m=document.createElement('canvas');m.width=W*2;m.height=H*2;const mx=m.getContext('2d');mx.imageSmoothingQuality='high';mx.drawImage(c,0,0,W*2,H*2);
 const s=document.createElement('canvas');s.width=W;s.height=H;const sx=s.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(m,0,0,W,H);return sx.getImageData(0,0,W,H).data}
function b64(u8){let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s)}
// EMOS: {name:{...opts}} ; frames(i) -> {sw,br,blink}
function buildAll(draw,P,EMOS){
 const out={};const SW=i=>Math.sin(i*Math.PI/4)*1.4, BR=[0,0,1,1,1,1,0,0];
 for(const [name,e] of Object.entries(EMOS))for(const talk of [0,1]){
  out[name+(talk?'Talk':'')]=[...Array(8)].map((_,i)=>b64(new Uint8Array(toPix(draw,Object.assign({},e,{emo:name,sw:SW(i),br:BR[i],i,blink:!e.noBlink&&!talk&&i===6,mouthOpen:talk&&(i%2===0)?(i%4===0?1:.6):0})))))}
 return {pal:Object.values(P),W,H,sets:out}}

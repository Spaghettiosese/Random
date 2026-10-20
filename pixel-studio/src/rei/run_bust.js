const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {encode,url}=require('./png.js');
const [,,html,outJs,id,previewPng]=process.argv;
(async()=>{
 const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
 const pg=await br.newPage();pg.on('console',m=>console.log('[page]',m.text()));pg.on('pageerror',e=>console.log('[err]',e.message));
 await pg.goto('file://'+path.resolve(html));
 const R=await pg.evaluate(()=>window.build());
 const pal=[[0,0,0],...R.pal.map(h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)])];
 const W=R.W,H=R.H;let total=0,max=0;const out={};
 const frames={};
 for(const [k,arr] of Object.entries(R.sets)){out[k]=arr.map(b=>{const d=Buffer.from(b,'base64');const idx=new Uint8Array(W*H);
   for(let i=0;i<W*H;i++){const a=d[i*4+3];if(a<110){idx[i]=0;continue}let bi=1,bd=1e9;const r=d[i*4],g=d[i*4+1],bl=d[i*4+2];
     for(let j=1;j<pal.length;j++){const c=pal[j];const q=(c[0]-r)**2*.3+(c[1]-g)**2*.59+(c[2]-bl)**2*.11;if(q<bd){bd=q;bi=j}}idx[i]=bi}
   // drop isolated stray pixels? keep.
   const png=encode(W,H,idx,pal,0);total+=png.length;max=Math.max(max,png.length);return {u:url(png),idx}})}
 const sets=['open','openTalk','happy','happyTalk','shy','shyTalk','sad','sadTalk','angry','angryTalk','surprised','surprisedTalk'];
 let js=`(window.PIXEL=window.PIXEL||{}).${id} = {\n`+sets.map(s=>`${s}:[${out[s].map(f=>JSON.stringify(f.u)).join(',')}]`).join(',\n')+'\n};\n';
 fs.writeFileSync(outJs,js);
 console.log('wrote',outJs,(js.length/1024|0)+'KB','max frame',max,'avg',total/96|0);
 // preview sheet: one frame (0) of each set + blink at 6
 const rows=[['open',0],['openTalk',0],['happy',0],['shy',0],['sad',0],['angry',0],['surprised',0],['open',6]];
 const pv=rows.map(([s,i])=>out[s][i].u);
 const pg2=await br.newPage({viewport:{width:160*4*2,height:192*4*2}});
 await pg2.setContent(`<body style="margin:0;background:#4a3a6a;display:flex;flex-wrap:wrap">${pv.map(u=>`<img src="${u}" style="width:${160*2}px;height:${192*2}px;image-rendering:pixelated;margin:0">`).join('')}</body>`);
 await pg2.waitForTimeout(300);
 await pg2.screenshot({path:previewPng});
 await br.close();
})();

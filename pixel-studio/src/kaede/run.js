// usage: node run.js <page.html> <out.js> [query]  -- page sets window.RESULT
const {chromium}=require('playwright');const fs=require('fs');const png=require('./png.js');
(async()=>{const [,,page,out,q]=process.argv;
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error'||m.text().startsWith('LOG'))console.log(m.text())});
 await p.goto('file://'+__dirname+'/'+page+(q||''));await p.waitForFunction('window.RESULT',null,{timeout:600000});
 const R=await p.evaluate(()=>window.RESULT);await b.close();
 const dec=s=>Uint8Array.from(Buffer.from(s,'base64'));let js='';
 if(R.kind==='bust'){const pal=[[0,0,0,0],...R.pal.map(c=>[c[0],c[1],c[2],255])];
  // idx: 255 -> 0 transparent, else +1
  const o={};for(const k in R.sets)o[k]=R.sets[k].map(s=>{const a=dec(s).map(v=>v===255?0:v+1);return png(R.w,R.h,a,pal)});
  js=`(window.PIXEL=window.PIXEL||{}).${R.id} = {\n`+Object.keys(o).map(k=>`${k}:[\n${o[k].map(u=>JSON.stringify(u)).join(',\n')}]`).join(',\n')+'\n};\n'}
 else{js='(window.PXCG=window.PXCG||{});\n';for(const n in R.cgs){const c=R.cgs[n];const pal=c.pal.map(x=>[x[0],x[1],x[2],255]);js+=`window.PXCG[${JSON.stringify(n)}] = { w:480, h:270, fps:6, frames:[\n${c.frames.map(s=>JSON.stringify(png(480,270,dec(s),pal))).join(',\n')}] };\n`}}
 fs.writeFileSync(out,js);console.log(out,(js.length/1024).toFixed(0)+'KB')})();

// usage: node run.js <source.html> <out.js> <kind>  ; page exposes window.generate() -> {key:{frames:[b64rgba],w,h,...}}
const {chromium}=require('playwright');const fs=require('fs');const {encode}=require('./png');
const [src,out,kind,only]=process.argv.slice(2);
(async()=>{
 const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await br.newPage();pg.on('console',m=>console.log('[page]',m.text()));pg.on('pageerror',e=>console.log('[err]',e.message));
 await pg.goto('file://'+require('path').resolve(src));
 const res=await pg.evaluate(async o=>await window.generate(o),only||null);
 let js='',tot=0;
 for(const key of Object.keys(res)){const a=res[key];const urls=a.frames.map(b=>{const buf=encode(a.w,a.h,Buffer.from(b,'base64'));tot+=buf.length;a._max=Math.max(a._max||0,buf.length);return 'data:image/png;base64,'+buf.toString('base64')});
  console.log(key,'max frame KB',(a._max/1024).toFixed(1));
  if(kind==='bust'){a.urls=urls}
  else{js+=`(window.PXCG=window.PXCG||{})['${key}'] = { w:${a.w}, h:${a.h}, fps:${a.fps||6}, frames:${JSON.stringify(urls)} };\n`}}
 if(kind==='bust'){const o={};for(const k of Object.keys(res)){const [id,set]=k.split('/');(o[id]=o[id]||{})[set]=res[k].urls}
  for(const id of Object.keys(o)){let s=`(window.PIXEL=window.PIXEL||{}).${id} = {`+Object.keys(o[id]).map(k=>`${k}:${JSON.stringify(o[id][k])}`).join(',')+'};\n';fs.writeFileSync(out.replace('%',id),s);console.log('wrote',out.replace('%',id),(s.length/1024).toFixed(0)+'KB')}}
 else{fs.writeFileSync(out,js);console.log('wrote',out,(js.length/1024).toFixed(0)+'KB')}
 await br.close()})();

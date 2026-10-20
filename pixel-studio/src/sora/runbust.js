// node runbust.js page.html id outfile
const {chromium}=require('playwright');const fs=require('fs');const png=require('./png.js');
(async()=>{const [,,page,id,out]=process.argv;const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.cwd()+'/'+page);const r=await p.evaluate(`gen('${id}')`);
let js=`(window.PIXEL=window.PIXEL||{}).${id} = {\n`;const sizes=[];
for(const k of Object.keys(r)){js+=` ${k}:[\n`+r[k].map(f=>{const u=png.url(f,true);sizes.push(u.length);return '  "'+u+'"'}).join(',\n')+'\n ],\n'}
js=js.replace(/,\n$/,'\n')+'};\n';fs.writeFileSync(out,js);
console.log(out,fs.statSync(out).size,'bytes; max frame b64 chars',Math.max(...sizes),'frames',sizes.length);await b.close()})();

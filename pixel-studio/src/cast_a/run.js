const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const ids=process.argv.slice(2);const mode=ids[0]==='--build'?'build':'sheet';const list=(mode==='build'?ids.slice(1):ids);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
await p.goto('file://'+path.join(__dirname,'index.html'));
for(const id of list){
 if(mode==='sheet'){const u=await p.evaluate(id=>sheetOf(id),id);fs.writeFileSync(path.join(__dirname,'prev_'+id+'.png'),Buffer.from(u.split(',')[1],'base64'));console.log('sheet',id)}
 else{const R=await p.evaluate(id=>allOf(id),id);let out='(window.PIXEL=window.PIXEL||{}).'+id+' = {';const keys=Object.keys(R);let tot=0,mx=0;
  out+=keys.map(k=>{R[k].forEach(u=>{tot+=u.length;mx=Math.max(mx,u.length)});return k+':'+JSON.stringify(R[k])}).join(',')+'};\n';
  fs.writeFileSync('/home/user/random/heartline/js/px/bust_'+id+'.js',out);console.log(id,'bytes',out.length,'max frame b64',mx)}}
await b.close()})();

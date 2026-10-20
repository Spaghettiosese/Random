// usage: node run.js [names...]  -> out/<name>_<f>.png then pack.py builds bg.js
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log(m.text())});
await p.goto('file://'+path.resolve('build.html'));
const all=await p.evaluate(()=>Object.keys(SCENES));
const want=process.argv.slice(2).length?process.argv.slice(2):all;
fs.mkdirSync('out',{recursive:true});
for(const n of want){ if(!all.includes(n)){console.log('missing',n);continue;}
 try{for(let f=0;f<4;f++){const d=await p.evaluate(([n,f])=>renderBG(n,f),[n,f]);fs.writeFileSync(`out/${n}_${f}.png`,Buffer.from(d.split(',')[1],'base64'));}}catch(e){console.log('FAIL',n,e.message)} }
fs.writeFileSync('out/_all.json',JSON.stringify(all));
await b.close()})();

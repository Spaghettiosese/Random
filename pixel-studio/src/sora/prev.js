// usage: node prev.js page.html out.png 'js expr returning dataURL'
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [,,page,out,expr]=process.argv;const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
await p.goto('file://'+process.cwd()+'/'+page);const d=await p.evaluate(expr);fs.writeFileSync(out,Buffer.from(d.split(',')[1],'base64'));await b.close()})();

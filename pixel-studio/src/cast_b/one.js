const {chromium}=require('playwright');const path=require('path');
(async()=>{const [id,...ex]=process.argv.slice(2);const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const p=await b.newPage();await p.goto('file://'+path.join(__dirname,'cast_b.html'));
const exps=ex.length?ex:['open','sad'];
const urls=[];for(const e of exps){const o=await p.evaluate(([id,e])=>buildAll(id,e),[id,e]);urls.push(o[e][2])}
const q=await b.newPage({viewport:{width:640*exps.length,height:768}});
await q.setContent(`<body style="margin:0;background:#4a3a66;display:flex">`+urls.map(u=>`<img style="width:640px;image-rendering:pixelated" src="${u}">`).join(''));
await q.waitForTimeout(150);await q.screenshot({path:path.join(__dirname,`one_${id}.png`)});await b.close()})();

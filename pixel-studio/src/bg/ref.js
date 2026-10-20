const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1600,height:900}});
const js=['art.js','art2.js'].map(f=>fs.readFileSync('/home/user/random/heartline/js/'+f,'utf8'));
await p.setContent('<body></body>');
await p.addScriptTag({content:'window.PIXEL={};window.CH={};'});
let names=[];
try{ await p.addScriptTag({content:fs.readFileSync('/home/user/random/heartline/js/chars.js','utf8')});}catch(e){console.log('chars',e.message)}
for(const s of js){await p.addScriptTag({content:s}).catch(e=>console.log(e.message));}
names=await p.evaluate(()=>Object.keys(Art._h.BG).filter(n=>!n.startsWith('cg_')));
console.log(names.join(' '));
fs.mkdirSync('ref',{recursive:true});
for(const n of names){await p.evaluate(n=>{document.body.style.margin=0;document.body.innerHTML='<div style="width:1600px;height:900px;position:relative">'+Art.bg(n)+'</div>'},n);await p.waitForTimeout(50);await p.screenshot({path:'ref/'+n+'.png',clip:{x:0,y:0,width:1600,height:900}});}
await b.close()})();

// node one.js out.png file.js:id name1,name2 [scale]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [,,out,spec,names,sc]=process.argv;const [f,id]=spec.split(':');const SC=+(sc||4);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage();
 const html=`<body style="margin:0;background:#5a4a78"><canvas id=c></canvas><script>${fs.readFileSync(f,'utf8')}</script><script>(async()=>{const n=${JSON.stringify(names.split(','))};const c=document.getElementById('c');c.width=160*${SC}*n.length;c.height=192*${SC};const x=c.getContext('2d');x.imageSmoothingEnabled=false;for(let k=0;k<n.length;k++){const [nm,fr]=n[k].split('@');await new Promise(r=>{const i=new Image();i.onload=()=>{x.drawImage(i,k*160*${SC},0,160*${SC},192*${SC});r()};i.src=window.PIXEL['${id}'][nm][+(fr||0)]})}document.title='done'})()</script>`;
 fs.writeFileSync('/tmp/_one.html',html);await p.goto('file:///tmp/_one.html');await p.waitForFunction('document.title==="done"');await p.locator('#c').screenshot({path:out});await b.close()})();

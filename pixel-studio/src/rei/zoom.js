// usage: node zoom.js out.png scale file.js id set frame [set frame ...]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [,,out,sc,file,id,...rest]=process.argv;
 global.window={};eval(fs.readFileSync(file,'utf8'));const D=window.PIXEL[id];const imgs=[];
 for(let i=0;i<rest.length;i+=2)imgs.push(D[rest[i]][+rest[i+1]]);
 const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await br.newPage({viewport:{width:160*sc*Math.min(imgs.length,3),height:192*sc*Math.ceil(imgs.length/3)}});
 await pg.setContent(`<body style="margin:0;background:#6a5a8a;display:flex;flex-wrap:wrap">${imgs.map(u=>`<img src="${u}" style="width:${160*sc}px;height:${192*sc}px;image-rendering:pixelated">`).join('')}</body>`);
 await pg.waitForTimeout(300);await pg.screenshot({path:out});await br.close()})();

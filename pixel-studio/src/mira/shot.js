const {chromium}=require('playwright');const [url,out,w,h]=process.argv.slice(2);
(async()=>{const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const pg=await br.newPage({viewport:{width:+w||1400,height:+h||800}});pg.on('pageerror',e=>console.log(e.message));
await pg.goto(url);await pg.waitForFunction(()=>document.title==='done',null,{timeout:60000});await pg.locator('#c').screenshot({path:out});await br.close()})();

const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
 const ids=process.argv.slice(2).length?process.argv.slice(2):['aya','saeki','kuroda','oba','haru'];
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
 const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
 await p.goto('file://'+path.join(__dirname,'cast_b.html'));
 for(const id of ids){
  const o=await p.evaluate(id=>buildAll(id),id);
  const order=['open','openTalk','happy','happyTalk','shy','shyTalk','sad','sadTalk','angry','angryTalk','surprised','surprisedTalk'];
  let js=`(window.PIXEL=window.PIXEL||{}).${id} = {`+order.map(k=>`${k}:${JSON.stringify(o[k])}`).join(',')+'};\n';
  fs.writeFileSync(`/home/user/random/heartline/js/px/bust_${id}.js`,js);
  let max=0;order.forEach(k=>o[k].forEach(u=>max=Math.max(max,u.length)));
  console.log(id,(js.length/1024).toFixed(0)+'KB total, max frame',(max/1024*.75).toFixed(1)+'KB');
  // contact sheet: 6 expressions frame 0 (talk frame 1 for variety) at 2x
  const sheet=`<body style="margin:0;background:#2a2238"><div style="display:flex;flex-wrap:wrap;width:${160*6*2}px">`+['open','happy','shy','sad','angry','surprised'].map(k=>`<img style="width:320px;image-rendering:pixelated" src="${o[k][2]}">`).join('')+['openTalk','happyTalk','shyTalk','sadTalk','angryTalk','surprisedTalk'].map(k=>`<img style="width:320px;image-rendering:pixelated" src="${o[k][2]}">`).join('')+'</div>';
  const q=await b.newPage({viewport:{width:1920,height:768}});await q.setContent(sheet);await q.waitForTimeout(200);
  await q.screenshot({path:path.join(__dirname,`sheet_${id}.png`)});await q.close();
 }
 await b.close();
})();

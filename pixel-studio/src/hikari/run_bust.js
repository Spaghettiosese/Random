const {chromium}=require('playwright');const fs=require('fs');const zlib=require('zlib');const path=require('path');
const {pngIndexed}=require('./png.js');
(async()=>{
 const ids=process.argv.slice(2);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
 for(const id of ids){
  const p=await b.newPage({viewport:{width:1600,height:700}});
  p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log(m.text()));
  await p.goto('file://'+path.resolve('bust.html')+'?id='+id+'&m='+(process.env.M||'head'));
  await p.waitForFunction('window.RESULT',{timeout:300000});
  await p.screenshot({path:`prev_${id}_${process.env.M||'head'}.png`});
  const R=await p.evaluate('window.RESULT');
  const pal=R.pal.map(h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]);
  const order=['open','openTalk','happy','happyTalk','shy','shyTalk','sad','sadTalk','angry','angryTalk','surprised','surprisedTalk'];
  let out=`(window.PIXEL=window.PIXEL||{}).${id} = {\n`; let mx=0;
  for(const k of order){const fr=R.sets[k].map(s=>{const u=Buffer.from(s,'base64');const png=pngIndexed(160,192,u,pal,true);mx=Math.max(mx,png.length);return 'data:image/png;base64,'+png.toString('base64')});out+=` ${k}:[\n  "${fr.join('",\n  "')}"],\n`}
  out+='};\n';
  fs.writeFileSync(`/home/user/random/heartline/js/px/bust_${id}.js`,out);
  console.log(id,'bytes',out.length,'max frame png',mx);
  await p.close();
 }
 await b.close();
})();

// node sheet.js out.png file1.js:id [file2.js:id ...] -> contact sheet of frame 0 for each set
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const out=process.argv[2];const specs=process.argv.slice(3);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:1700,height:900}});
 let html='<body style="margin:0;background:#8a8f9c;font:10px sans-serif"><canvas id=c></canvas>';
 for(const s of specs)html+=`<script>${fs.readFileSync(s.split(':')[0],'utf8')}</script>`;
 html+=`<script>(async()=>{const specs=${JSON.stringify(specs.map(s=>s.split(':')))};const SC=1.5;const names=['open','openTalk','happy','happyTalk','shy','shyTalk','sad','sadTalk','angry','angryTalk','surprised','surprisedTalk'];const fr=+(location.hash.slice(1)||0);
 const c=document.getElementById('c');c.width=160*SC*6+10;c.height=192*SC*2*specs.length+10;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 const ld=u=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=u});
 for(let s=0;s<specs.length;s++){const set=window.PIXEL[specs[s][1]];for(let n=0;n<12;n++){x.fillStyle=['#5a4a78','#486a78'][(n>>1)%2];x.fillRect((n%6)*160*SC,(s*2+(n/6|0))*192*SC,160*SC,192*SC);const i=await ld(set[names[n]][fr]);x.drawImage(i,(n%6)*160*SC,(s*2+(n/6|0))*192*SC,160*SC,192*SC)}}
 document.title='done'})()</script>`;
 fs.writeFileSync('/tmp/_sheet.html',html);await p.goto('file:///tmp/_sheet.html'+(process.env.FR?'#'+process.env.FR:''));await p.waitForFunction('document.title==="done"');
 await p.locator('#c').screenshot({path:out});await b.close()})();

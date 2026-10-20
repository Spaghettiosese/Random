var SCENES={},SCENEOPT={};
const MIRA={skin:'#fff0e9',skinS:'#f4cbbd',hair:{style:'long',col:'#ffcfe0',colS:'#eb94b6',colH:'#fff6fa',clip:'#26c6a6'},iris:'#22c3a3'};
const HARU={skin:'#f6d6bf',skinS:'#e0ae92',hair:{style:'haru',col:'#4a3226',colS:'#35231a',colH:'#7a5440'},iris:'#6a4028',irisD:'#3a2014',browC:'#35231a'};
SCENES.test=(f)=>{
 rect(0,0,CW,CHH,'#5a4a7a');
 const sw=sinp(f);
 figure({x:110,y:150,h:130,view:'f',skin:'#f6d6bf',top:'#23305a',topS:'#1a2444',bottom:'#16192e',legs:'pants',shoe:'#222',lean:0,aL:[.15,.2],aR:[-.15,-.2],head:Object.assign({view:'b',dir:1},HARU)});
 figure({x:250,y:150,h:120,view:'s',facing:1,skin:'#fff0e9',top:'#fbfdff',bottom:'#fbfdff',legs:'skirt',skirtLen:.34,skirtW:.09,fem:1,lean:.02,aL:[.3,.6],aR:[.5,1.2],head:Object.assign({view:'s',dir:1,hair:Object.assign({},MIRA.hair,{sway:sw*.3}),expr:{eye:'open',mouth:'smile'}},{skin:MIRA.skin,skinS:MIRA.skinS,iris:MIRA.iris})});
 figure({x:380,y:150,h:120,view:'f',skin:'#fff0e9',top:'#fbfdff',bottom:'#63c8bb',legs:'skirt',skirtLen:.3,skirtW:.09,fem:1,aL:[.2,.4],aR:[-.2,-.4],head:{view:'q',dir:1,skin:MIRA.skin,skinS:MIRA.skinS,iris:MIRA.iris,hair:Object.assign({},MIRA.hair),expr:{eye:'open',mouth:'smile'}}});
};

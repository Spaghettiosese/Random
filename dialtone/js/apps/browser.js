import { A } from '../audio.js';
import { F, MONO, bevel, button, field, wrap, typed, inside } from '../ui.js';

const HOME = 'www.jumpstation.com', TOP = 54, BOT = 20;
const MIDNIGHT = 86400;
const store = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
const fmtLeft = (s) => { s = Math.max(0, Math.floor(s)); return [s / 3600, (s / 60) % 60, s % 60].map(n => String(Math.floor(n)).padStart(2, '0')).join(':'); };

class Layout {
  constructor(br, g, w, t) { this.br = br; this.g = g; this.w = w; this.t = t; this.y = 8; this.m = 16; }
  text(s, { font = F(12), color = '#000', align = 'left', lh = 16, x = this.m, w = this.w - this.m * 2 } = {}) {
    const g = this.g; g.font = font; g.fillStyle = color; g.textAlign = align;
    for (const l of wrap(g, s, w)) { this.y += lh; g.fillText(l, align === 'center' ? x + w / 2 : x, this.y); }
    g.textAlign = 'left'; this.y += 5;
  }
  h(s, color = '#000', size = 20, align = 'left') { this.text(s, { font: F(size, 'bold'), color, lh: size + 4, align }); }
  link(s, url, { x = this.m, font = F(12), color = '#0000ee', desc = null } = {}) {
    const g = this.g; g.font = font; const tw = g.measureText(s).width, y = this.y + 16;
    const hov = this.br.hover(x, y - 13, tw, 17);
    g.fillStyle = hov ? '#e00' : color; g.fillText(s, x, y); g.fillRect(x, y + 2, tw, 1);
    this.br.links.push({ r: [x, y - 13, tw, 17], url });
    if (desc) { g.fillStyle = '#444'; g.font = F(12); g.fillText(' - ' + desc, x + tw, y); }
    this.y += 20;
  }
  row(items, x = this.m) {
    const g = this.g; g.font = F(12); const y = this.y + 16;
    items.forEach(([s, url], i) => {
      const tw = g.measureText(s).width, hov = this.br.hover(x, y - 13, tw, 17);
      g.fillStyle = hov ? '#e00' : '#0000ee'; g.fillText(s, x, y); g.fillRect(x, y + 2, tw, 1);
      this.br.links.push({ r: [x, y - 13, tw, 17], url }); x += tw;
      if (i < items.length - 1) { g.fillStyle = '#000'; g.fillText('  |  ', x, y); x += g.measureText('  |  ').width; }
    });
    this.y += 22;
  }
  input(id, w, label, submit, x = this.m) {
    field(this.g, x, this.y, w, 22, this.br.fields[id] || '', this.br.focusField === id, this.t);
    this.br.fieldRects.push({ r: [x, this.y, w, 22], id, submit });
    button(this.g, x + w + 6, this.y, 70, 22, label);
    this.br.links.push({ r: [x + w + 6, this.y, 70, 22], action: submit });
    this.y += 30;
  }
  btn(label, action, x = this.m, w = 180) { button(this.g, x, this.y, w, 24, label, false, F(12, 'bold')); this.br.links.push({ r: [x, this.y, w, 24], action }); this.y += 32; }
  hr() { this.y += 8; this.g.fillStyle = '#888'; this.g.fillRect(this.m, this.y, this.w - this.m * 2, 1); this.g.fillStyle = '#fff'; this.g.fillRect(this.m, this.y + 1, this.w - this.m * 2, 1); this.y += 10; }
  block(h, fn) { fn(this.g, this.m, this.y, this.w - this.m * 2, h); this.y += h; }
  space(n) { this.y += n; }
}

const PAGES = {
  'www.jumpstation.com': { title: 'JumpStation! - Your launchpad to the Web', kb: 14, draw(L, br, t) {
    L.block(62, (g, x, y) => {
      g.font = F(42, 'bold italic'); g.fillStyle = '#d11'; g.fillText('Jump', x, y + 44); let o = g.measureText('Jump').width;
      g.fillStyle = '#1a3fcf'; g.fillText('Station', x + o, y + 44); o += g.measureText('Station').width; g.fillStyle = '#f0b400'; g.fillText('!', x + o, y + 44);
      g.font = F(12, 'italic'); g.fillStyle = '#555'; g.fillText('Your launchpad to the World Wide Web  •  over 2 million pages indexed!', x + 4, y + 60);
    });
    L.space(6); L.input('q', 380, 'Search', () => br.go('search?q=' + (br.fields.q || '')));
    L.row([['News', 'www.jumpstation.com/news'], ['Weather', 'www.weather.net'], ['Videos', 'app:tube'], ['Chat', 'app:chat'], ['Personal Pages', 'www.geovillages.com/~kevin99'], ['Y2K Info', 'www.y2kbunker.net']]);
    L.hr();
    L.block(92, (g, x, y, w) => {
      const pulse = 0.5 + 0.5 * Math.sin(t * 5);
      g.fillStyle = '#1a0000'; g.fillRect(x, y, w, 84); g.strokeStyle = `rgb(255,${80 + pulse * 120},0)`; g.lineWidth = 3; g.strokeRect(x + 1, y + 1, w - 2, 82); g.lineWidth = 1;
      for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(255,${100 + i * 10},0,.6)`; const fh = 20 + Math.sin(t * 8 + i) * 10; g.fillRect(x + 6 + i * 8, y + 80 - fh, 7, fh); }
      g.fillStyle = '#fc0'; g.font = F(12, 'bold'); g.fillText('★ HOT DOWNLOAD OF THE WEEK ★', x + 130, y + 20);
      g.fillStyle = '#fff'; g.font = F(22, 'bold'); g.fillText('DOOMED Shareware v1.9', x + 130, y + 46);
      g.font = F(12); g.fillStyle = '#ccc'; g.fillText('"The scariest game of 1999" - PC Gamer Monthly.   doomed_sw.zip (2.4 MB)', x + 130, y + 66);
    });
    L.y -= 60; L.btn('⬇ DOWNLOAD NOW', 'dl:doomed', 450, 140); L.y += 28;
    L.h('Cool Sites of the Day', '#1a3fcf', 16);
    L.link('Y2K Bunker', 'www.y2kbunker.net', { desc: 'Is YOUR family prepared for midnight?' });
    L.link('The Gerbil Groove', 'www.gerbilgroove.com', { desc: 'you will NOT believe this' });
    L.link("Kevin's Awesome Homepage", 'www.geovillages.com/~kevin99', { desc: 'DOOMED tips, my dog, and a GUESTBOOK' });
    L.link('Weather.net', 'www.weather.net', { desc: 'Severe storms tonight in your area' });
    L.link('NiteTube', 'app:tube', { desc: 'watch VIDEOS on your computer (!!)' });
    L.hr();
    const left = MIDNIGHT - br.os.clock;
    L.text(left > 0 ? `COUNTDOWN TO 2000:  ${fmtLeft(left)}` : 'WELCOME TO THE YEAR 2000!', { font: F(18, 'bold'), color: '#b00', align: 'center', lh: 22 });
    L.text('© 1999 JumpStation Inc.  |  Best viewed in NetVoyager 4.0 at 640x480  |  Add JumpStation to your Bookmarks!', { font: F(10), color: '#777', align: 'center' });
  } },
  'www.jumpstation.com/news': { title: 'JumpStation News', kb: 10, draw(L) {
    L.h('JumpStation News', '#1a3fcf', 24);
    L.text('Friday, December 31, 1999 - updated 11:30 PM', { color: '#666' }); L.hr();
    for (const [h, d] of [['Millions Prepare For Y2K Rollover', 'Banks, airlines and power companies say they are ready. Your uncle says they are lying.'], ['Record Crowds Gather For Midnight', 'Celebrations are under way worldwide as the clock ticks down to 2000.'], ['"DOOMED" Tops Shareware Charts', "Players report strange things in level 2: \"it's my house,\" one user wrote. Developer declined to comment."], ['Storm Rolls Through Suburbs', 'Scattered power outages possible. Keep a flashlight handy tonight.'], ['Pets Online Stock Soars 400%', 'Analysts: "the internet will sell dog food forever."']]) {
      L.text(h, { font: F(15, 'bold'), color: '#900', lh: 18 }); L.text(d);
    }
    L.link('« Back to JumpStation', HOME);
  } },
  'www.y2kbunker.net': { title: 'Y2K BUNKER - THE END IS NEAR', kb: 18, bg: '#000', draw(L, br, t) {
    const G = '#3f3', left = MIDNIGHT - br.os.clock;
    if (Math.floor(t * 2) % 2) L.text('!!! WARNING !!!', { font: MONO(26), color: '#f00', align: 'center', lh: 30 }); else L.space(35);
    L.text('THE MILLENNIUM BUG IS REAL. THE GOVERNMENT KNOWS.', { font: MONO(16), color: G, align: 'center', lh: 20 });
    L.text(left > 0 ? fmtLeft(left) : '00:00:00 ... WE ARE STILL HERE??', { font: MONO(44), color: '#f33', align: 'center', lh: 50 });
    L.text('TIME REMAINING UNTIL TOTAL COLLAPSE*', { font: MONO(12), color: '#0a0', align: 'center' });
    L.btn('>> SYNC YOUR CLOCK TO ATOMIC TIME <<', () => {
      if (br.os.clock < MIDNIGHT - 40) { br.os.clock = MIDNIGHT - 40; br.os.emit('bunker-sync'); br.os.toast('System clock synced: 11:59:20 PM', null); } else br.os.toast('Clock already synced.');
    }, 170, 290);
    L.text('SURVIVAL CHECKLIST:', { font: MONO(14), color: G });
    for (const s of ['[x] 400 cans of beans', '[x] bathtub full of water', '[x] cash under mattress (NOT the bank!!)', '[ ] convince wife this is normal', '[x] unplug EVERYTHING at 11:59']) L.text('  ' + s, { font: MONO(13), color: G, lh: 15 });
    L.space(8); L.text('SECRET FREQUENCIES THEY DONT WANT YOU TO KNOW:', { font: MONO(14), color: '#ff0' });
    L.text('  IDDQD  - the invulnerability frequency\n  IDKFA  - the arsenal frequency\n  (works in DOOMED. coincidence? I THINK NOT)', { font: MONO(13), color: '#ff0', lh: 15 });
    L.space(8); L.text('*or not. my lawyer says i have to say that.', { font: MONO(10), color: '#060' });
    L.link('<< back to civilization', HOME, { color: '#6af' });
  } },
  'www.gerbilgroove.com': { title: 'THE GERBIL GROOVE!!!', kb: 22, bg: '#ffc8e8', enter(br) { br.stopMusic = A.tune('E5 E5 D5 C5 D5 - G4 - E5 E5 D5 C5 D5 - C5 - A4 C5 A4 C5 D5 E5 D5 C5 G4 - G4 - C5 - - -', 180, { vol: 0.05, type: 'square', bass: 'C3 - G3 - C3 - G3 - F3 - C3 - G3 - D3 -' }); },
    draw(L, br, t) {
      L.text('THE GERBIL GROOVE', { font: F(34, 'bold italic'), color: `hsl(${t * 120 % 360},90%,45%)`, align: 'center', lh: 40 });
      L.text('dance, gerbils, DANCE!!!', { font: F(14, 'italic'), color: '#903', align: 'center' });
      L.block(270, (g, x, y, w) => {
        for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
          const cx = x + 36 + c * 72, cy = y + 40 + r * 66 - Math.abs(Math.sin(t * 6 + c + r)) * 14, s = (c + r) % 2 ? 1 : -1;
          g.fillStyle = ['#c8864a', '#e8d0a0', '#8a5a3a'][(c + r) % 3]; g.beginPath(); g.ellipse(cx, cy, 20, 16, Math.sin(t * 6 + c) * 0.3, 0, 7); g.fill();
          g.beginPath(); g.arc(cx + 14 * s, cy - 10, 10, 0, 7); g.fill(); g.fillStyle = '#fcc'; g.beginPath(); g.arc(cx + 10 * s, cy - 20, 5, 0, 7); g.fill();
          g.fillStyle = '#000'; g.fillRect(cx + 17 * s - 1, cy - 12, 3, 3);
        }
      });
      L.text(`You are visitor #${(store('dt_gg') || 88213)}  -  turn your speakers UP!!!`, { align: 'center', color: '#903' });
      L.link('<< back', HOME, { x: 280 });
    } },
  'www.weather.net': { title: 'Weather.net - Local Forecast', kb: 16, draw(L, br, t) {
    L.h('Weather.net', '#036', 26); L.text('Local Forecast for YOUR AREA - New Year\'s Eve', { color: '#555' });
    L.block(40, (g, x, y, w) => { g.fillStyle = Math.floor(t * 2) % 2 ? '#d00' : '#900'; g.fillRect(x, y, w, 32); g.fillStyle = '#fff'; g.font = F(14, 'bold'); g.fillText('⚠ SEVERE THUNDERSTORM WARNING until 2:00 AM', x + 12, y + 21); });
    L.block(190, (g, x, y, w) => {
      g.fillStyle = '#020'; g.fillRect(x, y, 260, 180); g.strokeStyle = '#063'; for (let i = 1; i < 4; i++) { g.beginPath(); g.arc(x + 130, y + 90, i * 30, 0, 7); g.stroke(); }
      for (let i = 0; i < 9; i++) { const bx = x + ((i * 47 + t * 12) % 300) - 20, by = y + 30 + (i * 37) % 130; g.fillStyle = i % 3 ? 'rgba(40,200,40,.6)' : 'rgba(240,200,0,.7)'; g.beginPath(); g.ellipse(bx, by, 26, 14, 0.4, 0, 7); g.fill(); if (i % 4 === 0) { g.fillStyle = 'rgba(230,30,30,.8)'; g.beginPath(); g.arc(bx, by, 6, 0, 7); g.fill(); } }
      const a = t * 2; g.strokeStyle = '#6f6'; g.beginPath(); g.moveTo(x + 130, y + 90); g.lineTo(x + 130 + Math.cos(a) * 90, y + 90 + Math.sin(a) * 90); g.stroke();
      g.fillStyle = '#fff'; g.fillRect(x + 128, y + 88, 4, 4); g.font = F(10); g.fillText('YOU', x + 134, y + 86);
      g.fillStyle = '#000'; g.font = F(13); ['Tonight: Heavy rain, thunder. Low 38°F', 'Midnight: 36°F, lightning likely', 'Sat 1/1/2000: Clearing. High 45°F', '', 'Power outages possible.', 'Stay indoors. Keep a flashlight', 'and maybe some beans.'].forEach((s, i) => g.fillText(s, x + 280, y + 20 + i * 20));
    });
    L.link('<< JumpStation', HOME);
  } },
  'www.geovillages.com/~kevin99': { title: "~*~ KeViN's AwEsOmE hOmEpAgE ~*~", kb: 26, bg: '#000', draw(L, br, t) {
    L.block(20, (g, x, y, w) => { g.font = F(13, 'bold'); g.fillStyle = '#ff0'; g.fillText('~*~ WELCOME 2 MY PAGE ~*~ YOU ARE THE BEST ~*~ SIGN MY GUESTBOOK ~*~', x + w - (t * 90 % (w + 520)), y + 14); });
    const title = "KEVIN'S AWESOME HOMEPAGE!!!"; L.block(44, (g, x, y) => { g.font = F(28, 'bold'); let o = 0; for (let i = 0; i < title.length; i++) { g.fillStyle = `hsl(${(i * 25 + t * 200) % 360},100%,60%)`; g.fillText(title[i], x + 40 + o, y + 34 + Math.sin(t * 5 + i * 0.5) * 3); o += g.measureText(title[i]).width; } });
    L.block(60, (g, x, y, w) => {
      for (let i = 0; i < 20; i++) { g.fillStyle = i % 2 ? '#000' : '#fc0'; g.beginPath(); g.moveTo(x + 150 + i * 16, y); g.lineTo(x + 166 + i * 16, y); g.lineTo(x + 150 + i * 16, y + 16); g.lineTo(x + 134 + i * 16, y + 16); g.fill(); }
      g.fillStyle = '#fc0'; g.font = F(15, 'bold'); g.fillText('UNDER CONSTRUCTION', x + 215, y + 38);
      const dx = x + 180 + Math.abs(Math.sin(t * 3)) * 6; g.strokeStyle = '#fc0'; g.lineWidth = 2; g.beginPath(); g.arc(dx, y + 30, 5, 0, 7); g.moveTo(dx, y + 35); g.lineTo(dx, y + 48); g.moveTo(dx, y + 40); g.lineTo(dx + 10, y + 32 + Math.sin(t * 12) * 4); g.stroke(); g.lineWidth = 1;
    });
    L.text("hi!! im kevin and im 13. this is my page about my favorite stuff. my favorite game is DOOMED, my dog is named Pixel, and i am gonna be a programmer when i grow up.", { color: '#0ff', lh: 16 });
    L.text('MY DOOMED TIPS:', { font: F(14, 'bold'), color: '#f0f' });
    L.text("* hold CTRL or SPACE to shoot, E opens doors\n* the red blobs are health, the yellow boxes are shells\n* LEVEL 2 IS WEIRD. it looks like somebody's house. there's a computer at the end. i didn't touch it.", { color: '#fff', lh: 16 });
    const visits = br.visits;
    L.block(34, (g, x, y) => { g.fillStyle = '#fff'; g.font = F(12); g.fillText('You are visitor number:', x, y + 20); String(visits).padStart(6, '0').split('').forEach((d, i) => { g.fillStyle = '#222'; g.fillRect(x + 150 + i * 18, y + 4, 16, 22); g.fillStyle = '#3f3'; g.font = MONO(16); g.fillText(d, x + 153 + i * 18, y + 21); }); });
    L.text('~ GUESTBOOK ~', { font: F(16, 'bold'), color: '#f60' });
    L.input('gb', 380, 'Sign it!', () => { const s = (br.fields.gb || '').trim(); if (!s) return; br.guest.unshift(['you', s]); store('dt_gb', br.guest); br.fields.gb = ''; A.ding(); });
    for (const [n, s] of br.guest.slice(0, 8)) L.text(`${n}: ${s}`, { color: n === 'you' ? '#ff0' : '#ccc', lh: 15 });
    L.space(6); L.row([['<< prev', 'www.gerbilgroove.com'], ['DOOMED WEBRING', 'www.jumpstation.com'], ['next >>', 'www.y2kbunker.net']], 170);
  } },
};
const INDEX = [
  ['doomed download shareware game shotgun demon', 'DOOMED Shareware - free download', HOME, 'Download the scariest game of 1999.'],
  ['y2k bug millennium end world bunker beans', 'Y2K BUNKER - are you ready?', 'www.y2kbunker.net', 'TIME IS RUNNING OUT'],
  ['gerbil dance funny music hamster', 'The Gerbil Groove', 'www.gerbilgroove.com', 'dancing gerbils. that is all.'],
  ['weather storm rain thunder forecast', 'Weather.net - local forecast', 'www.weather.net', 'Severe thunderstorm warning.'],
  ['kevin homepage doomed tips guestbook dog pixel', "Kevin's Awesome Homepage", 'www.geovillages.com/~kevin99', 'DOOMED tips, my dog, guestbook!!!'],
  ['news today y2k headlines', 'JumpStation News', 'www.jumpstation.com/news', 'Top stories for Dec 31, 1999.'],
  ['video videos movie funny skate', 'NiteTube videos', 'app:tube', 'Watch videos right on your computer.'],
];

function normalize(s) {
  s = s.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
  if (/^(search\?|app:|dl:)/.test(s)) return s;
  s = s.toLowerCase();
  if (!s.includes('.') || s.includes(' ')) return 'search?q=' + s;
  if (!s.startsWith('www.')) s = 'www.' + s;
  return s;
}

export class Browser {
  constructor(os) {
    this.os = os; this.hist = []; this.links = []; this.fieldRects = []; this.fields = {}; this.focusField = null;
    this.addr = ''; this.addrFocus = false; this.scroll = 0; this.pageH = 400; this.load = 1; this.mx = -1; this.my = -1;
    this.guest = store('dt_gb') || [['xXangelXx', '~*~ luv ur page ~*~'], ['Mike_T', 'cool page!!! add more DOOMED stuff'], ['d4rkst4r', 'level 2 of doomed is NOT funny kevin'], ['kevin99', 'thx 4 visiting!! sign my guestbook plz']];
    this.visits = (store('dt_visits') || 1336) + 1; store('dt_visits', this.visits);
    if (os.online) this.go(HOME, true); else { this.dialing = true; this.dialT = 0; this.dialDur = A.modem(); }
  }
  winTitle() { return this.dialing ? 'Dial-Up Networking' : `${this.page ? this.page.title : ''} - NetVoyager`; }
  hover(x, y, w, h) { return inside(this.mx, this.my, [x, y, w, h]); }
  close() { this.stopMusic && this.stopMusic(); }
  wantsEsc() { if (this.addrFocus || this.focusField) { this.addrFocus = false; this.focusField = null; return true; } return false; }
  go(raw, noHist) {
    const url = normalize(raw);
    if (url.startsWith('app:')) { this.os.launch(url.slice(4)); return; }
    if (url === 'dl:doomed') {
      if (this.os.icons.includes('doom')) this.os.toast('DOOMED is already installed. Check your desktop!');
      else if (!this.os.dl) this.os.download('doomed_sw.zip', 2400, () => this.os.installDoom());
      return;
    }
    if (this.url && !noHist) this.hist.push(this.url);
    this.stopMusic && this.stopMusic(); this.stopMusic = null;
    this.url = url; this.addr = url; this.scroll = 0; this.load = 0; this.focusField = null; this.addrFocus = false;
    if (url.startsWith('search?q=')) this.page = this.searchPage(decodeURIComponent(url.slice(9)));
    else this.page = PAGES[url] || this.notFound(url);
    this.page.enter && this.page.enter(this);
  }
  searchPage(q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = INDEX.filter(([kw]) => words.some(w => kw.includes(w)));
    return { title: `JumpStation Search: ${q}`, kb: 8, draw(L) {
      L.h('JumpStation! Search', '#1a3fcf', 20); L.text(`Results for "${q}" - ${hits.length ? hits.length : 'no'} matching sites found`, { color: '#555' }); L.hr();
      for (const [, t, url, d] of hits) { L.link(t, url, { font: F(14, 'bold') }); L.text(d + '   ' + url, { color: '#070', lh: 14 }); }
      L.link(`${q} - free ${q} pics and more!!!`, `www.free-${words[0] || 'stuff'}-4u.com`, { font: F(14, 'bold') }); L.text('Under construction. Sign my guestbook.', { color: '#070', lh: 14 });
      L.hr(); L.link('« Back to JumpStation', HOME);
    } };
  }
  notFound(url) {
    return { title: 'Cannot find server', kb: 4, draw(L) {
      L.h('The page cannot be displayed', '#000', 18);
      L.text(`The page you are looking for (${url}) is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings. Or it's Y2K already.`);
      L.hr(); L.text('Please try the following:\n • Click the Refresh button, or try again later.\n • Check that the address is spelled correctly.\n • Make sure your mom isn\'t on the phone.', { lh: 17 });
      L.link('JumpStation Home', HOME);
    } };
  }
  update(dt) {
    if (this.dialing) { this.dialT += dt; if (this.dialT >= this.dialDur) { this.dialing = false; this.os.online = true; this.os.emit('online'); this.go(HOME, true); } return; }
    if (!this.os.online) { this.dialing = true; this.dialT = 0; this.dialDur = A.modem(); return; }
    if (this.load < 1) { this.load = Math.min(1, this.load + dt * 9 / this.page.kb); this.os.busy = this.load < 1; }
  }
  draw(g, w, h) {
    g.fillStyle = '#c0c0c0'; g.fillRect(0, 0, w, h);
    if (this.dialing) return this.drawDial(g, w, h);
    ['Back', 'Reload', 'Home'].forEach((b, i) => button(g, 4 + i * 58, 3, 54, 22, b, false, F(11, 'bold')));
    g.fillStyle = '#000'; g.fillRect(w - 40, 2, 36, 24);
    if (this.load < 1) for (let i = 0; i < 6; i++) { const a = this.os.t * 6 - i * 0.4; g.fillStyle = `rgba(120,180,255,${1 - i / 6})`; g.fillRect(w - 22 + Math.cos(a) * 10 - 2, 14 + Math.sin(a) * 7 - 2, 4, 4); }
    else { g.fillStyle = '#6af'; g.font = F(16, 'bold italic'); g.fillText('N', w - 28, 20); }
    g.fillStyle = '#000'; g.font = F(11); g.fillText('Location:', 4, 44);
    field(g, 60, 30, w - 110, 20, this.addrFocus && this.addrSel ? '' : this.addr, this.addrFocus, this.os.t);
    if (this.addrFocus && this.addrSel && this.addr) { g.fillStyle = '#000080'; g.font = F(12); g.fillRect(63, 33, g.measureText(this.addr).width + 2, 14); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(this.addr, 64, 41); g.textBaseline = 'alphabetic'; }
    button(g, w - 46, 30, 42, 20, 'Go');
    const vh = h - TOP - BOT;
    g.fillStyle = this.page.bg || '#fff'; g.fillRect(0, TOP, w, vh);
    const shown = this.load < 1 ? this.load * this.pageH - this.scroll : vh;
    g.save(); g.beginPath(); g.rect(0, TOP, w, Math.max(0, Math.min(vh, shown))); g.clip(); g.translate(0, TOP - this.scroll);
    this.links = []; this.fieldRects = [];
    const L = new Layout(this, g, w, this.os.t); this.page.draw(L, this, this.os.t); this.pageH = L.y + 20;
    g.restore();
    if (this.pageH > vh) { const sh = vh * vh / this.pageH; bevel(g, w - 14, TOP, 14, vh, true, '#d8d8d8'); bevel(g, w - 14, TOP + (this.scroll / this.pageH) * vh, 14, sh); }
    bevel(g, 0, h - BOT, w, BOT, true);
    g.fillStyle = '#000'; g.font = F(11);
    const host = this.url.split('/')[0];
    g.fillText(this.load < 1 ? `Transferring data from ${host}... ${Math.floor(this.load * 100)}% of ${this.page.kb}K` : 'Document: Done', 6, h - 6);
    if (this.load < 1) { bevel(g, w - 130, h - 16, 120, 12, true, '#fff'); g.fillStyle = '#000080'; g.fillRect(w - 128, h - 14, 116 * this.load, 8); }
  }
  drawDial(g, w, h) {
    bevel(g, w / 2 - 170, 100, 340, 180);
    g.fillStyle = '#000080'; g.fillRect(w / 2 - 167, 103, 334, 18); g.fillStyle = '#fff'; g.font = F(11, 'bold'); g.fillText('Connecting to NiteNet', w / 2 - 160, 116);
    const t = this.dialT, st = t < 1 ? 'Waiting for dial tone...' : t < 2.6 ? 'Dialing 555-0199...' : t < 5 ? 'Verifying user name and password...' : t < 7 ? 'Logging on to network...' : 'Connected at 49,333 bps';
    g.fillStyle = '#000'; g.font = F(12); g.fillText('User name:  pwnz0r1999', w / 2 - 150, 150); g.fillText('Password:   ********', w / 2 - 150, 172); g.fillText('Phone:        555-0199', w / 2 - 150, 194);
    g.font = F(12, 'bold'); g.fillText('Status: ' + st, w / 2 - 150, 226);
    for (let i = 0; i < 2; i++) { g.fillStyle = Math.random() < 0.5 && t > 2.6 ? '#3f3' : '#060'; g.fillRect(w / 2 + 110 + i * 14, 140, 10, 10); }
    g.fillStyle = '#c0c0c0'; bevel(g, w / 2 - 150, 240, 300, 14, true, '#fff'); g.fillStyle = '#000080'; g.fillRect(w / 2 - 148, 242, 296 * Math.min(1, t / this.dialDur), 10);
  }
  vh() { return 424 - TOP - BOT; }
  scrollBy(d) { this.scroll = Math.max(0, Math.min(Math.max(0, this.pageH - this.vh()), this.scroll + d)); }
  mouse(type, x, y, btn) {
    this.mx = x; this.my = y - TOP + this.scroll; if (y < TOP || y > 424 - BOT) this.mx = -1;
    if (this.dialing) return;
    if (type === 'wheel') { this.scrollBy(btn > 0 ? 50 : -50); return; }
    if (type !== 'down') return;
    if (y < 28) {
      const b = Math.floor((x - 4) / 58); if (x < 4 || b > 2) return; A.click();
      if (b === 0 && this.hist.length) this.go(this.hist.pop(), true);
      if (b === 1) this.go(this.url, true);
      if (b === 2) this.go(HOME);
      return;
    }
    if (y < TOP) {
      if (x > 632 - 46) { this.go(this.addr); return; }
      if (x > 60) { this.addrFocus = true; this.addrSel = true; this.focusField = null; }
      return;
    }
    this.addrFocus = false;
    if (x > 632 - 14) { this.scroll = Math.max(0, (y - TOP) / this.vh() * this.pageH - this.vh() / 2); this.scrollBy(0); return; }
    const py = y - TOP + this.scroll;
    const f = this.fieldRects.find(f => inside(x, py, f.r)); if (f) { this.focusField = f.id; return; }
    const l = this.links.find(l => inside(x, py, l.r));
    this.focusField = null;
    if (l) { A.click(); if (l.action) l.action(); else this.go(l.url); }
  }
  key(e, down) {
    if (!down || this.dialing) return;
    if (this.addrFocus) {
      if (e.code === 'Enter') { this.go(this.addr); return; }
      if (e.code === 'Backspace') { this.addr = this.addrSel ? '' : this.addr.slice(0, -1); this.addrSel = false; return; }
      const c = typed(e); if (c) { this.addr = (this.addrSel ? '' : this.addr) + c; this.addrSel = false; }
      return;
    }
    if (this.focusField) {
      const id = this.focusField, fr = this.fieldRects.find(f => f.id === id);
      if (e.code === 'Enter') { fr && fr.submit(); return; }
      if (e.code === 'Backspace') { this.fields[id] = (this.fields[id] || '').slice(0, -1); return; }
      const c = typed(e); if (c && (this.fields[id] || '').length < 60) this.fields[id] = (this.fields[id] || '') + c;
      return;
    }
    const vh = this.vh();
    const d = { ArrowDown: 40, ArrowUp: -40, PageDown: vh - 30, PageUp: -(vh - 30), Space: vh - 30, Home: -1e5, End: 1e5 }[e.code];
    if (d) this.scrollBy(d);
    else if (e.code === 'Backspace' && this.hist.length) this.go(this.hist.pop(), true);
    else if (e.code === 'F5') this.go(this.url, true);
    else if (e.code === 'F6' || (e.ctrlKey && e.code === 'KeyL')) { this.addrFocus = true; this.addrSel = true; }
    else if (typed(e)) { // start typing anywhere = type an address, like a power user
      if (this.url === HOME) { this.focusField = 'q'; this.fields.q = (this.fields.q || '') + typed(e); }
    }
  }
}

import { A } from '../audio.js';
import { F, bevel, button, field, wrap, typed, icon, inside } from '../ui.js';

const SCRIPT = [
  [4, 'yo u online??'],
  [10, "my parents dragged me to my aunt's NYE party. at least she has a computer lol"],
  [22, 'u NEED to get DOOMED. its on the front page of jumpstation.com'],
  [65, 'btw ppl on the forums say DOOMED level 2 looks exactly like THEIR house. creepy'],
  [110, 'also check y2kbunker.net lmao. this guy owns 400 cans of beans'],
  [170, "bet u cant beat my KeyStorm score. 64 wpm baby"],
  [240, "my aunt keeps unplugging stuff 'just in case'. the fridge. THE FRIDGE"],
];
const CLOCK = [[23 * 3600 + 50 * 60, '10 MINUTES TIL 2000!!'], [23 * 3600 + 55 * 60, '5 min. ngl im kinda scared'], [23 * 3600 + 59 * 60, 'ONE MINUTE. if i dont make it tell my tamagotchi i loved it']];
const EVENTS = {
  'doom-installed': ['nice u got it!! E opens doors, CTRL or SPACE shoots', "finish E1M1 and ull see what i mean about level 2"],
  'doom-level2': ['WAIT r u on level 2??', 'does it look like ur house too?? that is NOT funny', 'how does it know'],
  'doom-end': ['dude. what did the computer in the game say', 'ok im logging that as a Y2K thing and not thinking about it'],
  countdown: ['10!!!', '9!!', 'HERE WE GO'],
  newyear: ['HAPPY NEW YEAR!!!!!!', 'did ur power go out?? my whole street went dark lmao', 'the fireworks tho', 'guess the world didnt end. gg humanity'],
  'typer-score': null,
  'bunker-sync': ['did u just sync ur clock with the BEAN GUY?? lol ok 40 seconds'],
};
const REPLIES = [
  [/^(hi|hey|yo|sup|hello|hii)/i, ['sup', 'heyyy', 'yo yo yo']],
  [/doom/i, ['DOOMED is the best game ever made dont @ me', 'try typing IDDQD while playing. trust me', 'level 2 tho...']],
  [/y2k|midnight|end|world|2000/i, ["if the world ends i want my last words to be 'lol'", 'my dad filled the bathtub with water. just in case', 'the bean guy says planes will fall. my uncle says hes an idiot']],
  [/lol|lmao|haha|rofl/i, ['lmao', 'ROFL', 'hehe']],
  [/house|level|creepy|scary/i, ['i swear the level 2 map has ur DESK in it. like the same desk', 'dont go to level 2 alone lol']],
  [/bye|cya|gtg|brb/i, ["noooo dont leave me here with my aunt's karaoke"]],
  [/wpm|keystorm|type/i, ['64 wpm. thats the number to beat', 'my fingers r lightning']],
  [/\?$/, ['idk man', 'maybe?? ask jeeves lol', 'good question. no idea']],
  [/.*/, ['lol', 'true', 'totally', 'brb my aunt is doing karaoke', 'wait what', 'haha nice', 'same', 'fr']],
];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export class ChatBot {
  constructor(os) { this.os = os; this.log = [{ from: '*', text: 'd4rkst4r has signed on.' }]; this.t = 0; this.q = []; this.si = 0; this.ci = 0; this.unread = false; }
  say(text, delay = 0) { this.q.push({ text, at: this.t + delay }); this.q.sort((a, b) => a.at - b.at); }
  on(name, data) {
    if (name === 'typer-score') { this.say(data >= 64 ? `${data} WPM?!?! ok ur a cyborg` : `${data} wpm? cute. my record is 64 ;)`, 2); return; }
    const lines = EVENTS[name]; if (!lines) return;
    lines.forEach((l, i) => this.say(l, 1.2 + i * (name === 'countdown' ? 1.1 : 2.6)));
  }
  user(text) {
    this.log.push({ from: 'me', text });
    const r = REPLIES.find(([re]) => re.test(text.trim()));
    this.say(pick(r[1]), 1.5 + Math.random() * 2);
  }
  get typing() { return this.q.length && this.q[0].at - this.t < 1.8; }
  update(dt) {
    this.t += dt;
    while (this.si < SCRIPT.length && this.t >= SCRIPT[this.si][0]) this.say(SCRIPT[this.si++][1]);
    while (this.ci < CLOCK.length && this.os.clock >= CLOCK[this.ci][0]) this.say(CLOCK[this.ci++][1]);
    while (this.q.length && this.q[0].at <= this.t) {
      const m = this.q.shift(); this.log.push({ from: 'd4rkst4r', text: m.text });
      const app = this.os.open.chat;
      if (this.os.focus === app && app && !app.min) A.beep(1500, 0.05, 0.06, 'triangle');
      else { this.unread = true; this.os.toast(m.text, () => this.os.launch('chat')); }
    }
  }
}

export class Chat {
  constructor(os) { this.os = os; this.bot = os.chat; this.input = ''; this.bot.unread = false; }
  winTitle() { return 'd4rkst4r - Instant Message'; }
  draw(g, w, h) {
    g.fillStyle = '#c0c0c0'; g.fillRect(0, 0, w, h);
    bevel(g, 6, 6, w - 12, 44, true, '#dfe6f5'); icon(g, 'chat', 12, 12);
    g.fillStyle = '#000'; g.font = F(13, 'bold'); g.fillText('d4rkst4r', 52, 24);
    g.font = F(11); g.fillStyle = '#444'; g.fillText("Away msg: stuck at my aunt's party :(  ~*~ 2000 or bust ~*~", 52, 40);
    const lx = 6, ly = 56, lw = w - 12, lh = h - 56 - 44;
    bevel(g, lx, ly, lw, lh, true, '#fff');
    g.save(); g.beginPath(); g.rect(lx + 2, ly + 2, lw - 4, lh - 4); g.clip();
    g.font = F(12);
    const rows = [];
    for (const m of this.bot.log) {
      const name = m.from === 'me' ? 'you' : m.from;
      const lines = wrap(g, (m.from === '*' ? '' : name + ': ') + m.text, lw - 20);
      lines.forEach((l, i) => rows.push({ l, m, first: i === 0, name }));
    }
    if (this.bot.typing) rows.push({ l: 'd4rkst4r is typing' + '.'.repeat(1 + Math.floor(this.os.t * 3) % 3), m: { from: '*' } });
    const y0 = ly + lh - 8 - rows.length * 17;
    rows.forEach((r, i) => {
      const y = y0 + (i + 1) * 17;
      if (r.m.from === '*') { g.fillStyle = '#888'; g.font = F(11, 'italic'); g.fillText(r.l, lx + 8, y); g.font = F(12); return; }
      if (r.first) {
        g.fillStyle = r.m.from === 'me' ? '#00f' : '#d00'; g.font = F(12, 'bold'); g.fillText(r.name + ':', lx + 8, y);
        const nw = g.measureText(r.name + ': ').width; g.fillStyle = '#000'; g.font = F(12); g.fillText(r.l.slice(r.name.length + 2), lx + 8 + nw, y);
      } else { g.fillStyle = '#000'; g.fillText(r.l, lx + 8, y); }
    });
    g.restore();
    field(g, 6, h - 36, w - 90, 28, this.input, true, this.os.t);
    button(g, w - 78, h - 36, 72, 28, 'Send', false, F(12, 'bold'));
  }
  send() { const t = this.input.trim(); if (!t) return; this.input = ''; this.bot.user(t); A.beep(900, 0.05, 0.05, 'triangle'); }
  key(e, down) {
    if (!down) return;
    if (e.code === 'Enter') return this.send();
    if (e.code === 'Backspace') { this.input = this.input.slice(0, -1); return; }
    const c = typed(e); if (c && this.input.length < 120) this.input += c;
  }
  mouse(type, x, y) { if (type === 'down' && inside(x, y, [632 - 78, 424 - 36, 72, 28])) this.send(); }
}

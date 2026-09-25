import { G, input, task, wait, tween, unlockPointer, lockPointer, shake } from './engine.js';
import { Audio, speak, stopSpeech } from './audio.js';
import { drawScare } from './characters.js';

const $ = id => document.getElementById(id);
export { $ };

const SPEAKERS = {
  Carlos: ['#8fc1ff', 1.0], Eric: ['#ffd36a', 1.35], Mom: ['#ff9fb4', 1.2], Dad: ['#9fe39a', 0.8],
  'Ms. Rosebrook': ['#d9b38c', 1.05], 'Sister Agnes': ['#e6e6ff', 1.1], 'Miss Gloria': ['#ffb870', 1.05],
  Jaden: ['#c49fff', 1.15], Class: ['#aaaaaa', 1.3], MOONKAI: ['#ff3b30', 0.35], '???': ['#ff6b6b', 0.5],
  'Eric?': ['#ff5a3a', 0.6], TV: ['#8adfff', 0.9], Narrator: ['#bbbbbb', 0.9],
};

function advancePressed() { return input.hit('KeyE') || input.hit('Space') || input.hit('Enter') || input.clicked; }

// Dialogue line. Resolves when the player advances (or after `auto` seconds).
export function say(name, text, opts = {}) {
  const box = $('dialogue'), nameEl = box.querySelector('.name'), textEl = box.querySelector('.text'), hint = box.querySelector('.hint');
  const [color, pitch] = SPEAKERS[name] || ['#fff', 1];
  box.classList.remove('hidden');
  box.classList.toggle('shake', !!opts.shake || name === 'MOONKAI');
  nameEl.textContent = name === 'Narrator' ? '' : name; nameEl.style.color = color;
  textEl.style.color = opts.color || (name === 'MOONKAI' ? '#ffb0a8' : '');
  textEl.style.fontStyle = opts.italic ? 'italic' : '';
  textEl.textContent = '';
  hint.style.visibility = 'hidden';
  speak(name, text, G.settings.tts);
  const speed = opts.speed || (name === 'MOONKAI' ? 22 : 45);
  let shown = 0, t = 0, done = false, hold = 0;
  return new Promise(res => {
    task(dt => {
      t += dt; hold += dt;
      if (!done) {
        const want = Math.min(text.length, Math.floor(t * speed));
        while (shown < want) {
          shown++;
          const ch = text[shown - 1];
          if (shown % 2 === 0 && /\w/.test(ch) && !G.settings.tts) Audio.blip(pitch);
        }
        textEl.textContent = text.slice(0, shown);
        if (shown >= text.length) { done = true; hint.style.visibility = 'visible'; hold = 0; }
        else if (advancePressed() && t > 0.15) { shown = text.length; textEl.textContent = text; done = true; hint.style.visibility = 'visible'; hold = 0; return false; }
      } else {
        if ((opts.auto && hold >= opts.auto) || (!opts.auto && advancePressed() && hold > 0.08)) {
          if (!opts.keep) box.classList.add('hidden');
          stopSpeech();
          res(); return true;
        }
      }
      return false;
    });
  });
}
export function hideDialogue() { $('dialogue').classList.add('hidden'); }

// Script helper: run a list of [speaker, line] pairs
export async function talk(lines) {
  for (const l of lines) {
    if (typeof l === 'function') { await l(); continue; }
    if (typeof l[0] === 'function') { await l[0](); continue; }
    await say(l[0], l[1], l[2] || {});
  }
}

// Branching choice. options: strings or {text, disabled}
export function choice(question, options) {
  const box = $('choices');
  box.innerHTML = '';
  if (question) { const q = document.createElement('div'); q.className = 'q'; q.textContent = question; box.appendChild(q); }
  G.inChoice = true;
  unlockPointer();
  box.classList.remove('hidden');
  return new Promise(res => {
    let finished = false;
    const pick = (i) => {
      if (finished) return; finished = true;
      Audio.click();
      box.classList.add('hidden'); box.innerHTML = '';
      lockPointer();
      setTimeout(() => { G.inChoice = false; }, 250);
      res(i);
    };
    options.forEach((o, i) => {
      const opt = typeof o === 'string' ? { text: o } : o;
      const b = document.createElement('button');
      b.textContent = `${i + 1}. ${opt.text}`;
      b.disabled = !!opt.disabled;
      b.onclick = (e) => { e.stopPropagation(); pick(i); };
      box.appendChild(b);
    });
    task(() => {
      if (finished) return true;
      for (let i = 0; i < options.length; i++) {
        const opt = typeof options[i] === 'string' ? {} : options[i];
        if (input.hit('Digit' + (i + 1)) && !opt.disabled) { pick(i); return true; }
      }
      return false;
    });
  });
}

export function objective(text) {
  const el = $('objective');
  if (el.textContent !== text) { el.textContent = text; if (text) Audio.tone(880, 0.15, { type: 'triangle', vol: 0.05 }); }
}
let toastTimer = null;
export function toast(text, sec = 2.5) {
  const el = $('toast'); el.textContent = text; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), sec * 1000);
}
export function card(big, small = '') {
  const el = $('card');
  el.querySelector('.big').textContent = big; el.querySelector('.small').textContent = small;
  el.classList.remove('hidden', 'fadein'); void el.offsetWidth; el.classList.add('fadein');
  Audio.tone(110, 3, { type: 'sine', vol: 0.12, attack: 0.5, rev: 0.6 });
  return wait(4.2).then(() => el.classList.add('hidden'));
}
export function fade(to, dur = 1) {
  const el = $('fade'); const from = parseFloat(el.style.opacity || getComputedStyle(el).opacity);
  if (dur <= 0) { el.style.opacity = to; return Promise.resolve(); }
  return tween(dur, k => { el.style.opacity = from + (to - from) * k; }, k => k);
}
export function setFade(v) { $('fade').style.opacity = v; }
export function letterbox(on) { $('letterbox').classList.toggle('on', on); }
export function hud(on) { $('hud').classList.toggle('hidden', !on); }
export function flash(dur = 0.3, color = '#fff') {
  const el = $('flash'); el.style.background = color;
  return tween(dur, k => { el.style.opacity = 1 - k; }, k => k);
}
export async function scare(kind = 'moonkai', dur = 0.85) {
  const c = $('scare');
  drawScare(c, kind);
  c.classList.remove('hidden');
  Audio.stinger(); if (kind.startsWith('moonkai')) Audio.screech();
  shake(0.4);
  await wait(dur);
  c.classList.add('hidden');
}
export function hurtFlash(k = 1) {
  const el = $('hurt'); el.style.opacity = Math.min(1, k);
  setTimeout(() => { el.style.opacity = 0; }, 180);
}
export function setThreads(n, show = true) {
  $('threads').classList.toggle('hidden', !show);
  $('thread-count').textContent = `${n}/5`;
}

// Phone text thread. msgs: [{t, me, delay, bad}]
export async function phone(who, msgs, clock = '11:47 PM') {
  const el = $('phone'), list = el.querySelector('.msgs');
  el.querySelector('.who').textContent = who; el.querySelector('.clock').textContent = clock;
  list.innerHTML = '';
  el.classList.remove('hidden');
  for (const m of msgs) {
    await wait(m.delay ?? 1.1);
    const d = document.createElement('div'); d.className = 'msg' + (m.me ? ' me' : '') + (m.bad ? ' bad' : '');
    d.textContent = m.t; list.appendChild(d);
    while (list.children.length > 12) list.removeChild(list.firstChild);
    m.me ? Audio.click() : Audio.phone();
  }
  await wait(0.6);
  await say('Narrator', '(Press E to put the phone away)', { color: '#888' });
  el.classList.add('hidden');
}

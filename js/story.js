import { THREE, G, player, placePlayer, applyPlayerCam, wait, until, tween, camTo, camToPlayer, interact, removeInteract, trigger, triggerOnce,
  addNPC, onUpdate, yawTo, shake, setFlashlight, addCollider, unlockPointer, clamp, rand, forwardVec } from './engine.js';
import { Audio, stopSpeech } from './audio.js';
import { LOOKS, makeHuman, makeEric, makeMoonkai, randomStudent, ericFaceCanvas, paintFace, degradeFace } from './characters.js';
import { buildSchool, buildHome, buildCar, buildDream, car, put, threadPiece, notePaper, makeBall, bananaPeel, block, banana } from './world.js';
import { basketball, createBallSystem, createShooter } from './ball.js';
import { runBoss } from './boss.js';
import { $, say, talk, choice, objective, toast, card, fade, setFade, letterbox, hud, flash, scare, setThreads, phone, hideDialogue } from './ui.js';
import { mat, basic } from './engine.js';
import { T } from './textures.js';

// ---------------------------------------------------------------------------
// Save data
// ---------------------------------------------------------------------------
const KEY = 'moonkai_save_v1';
export const SAVE = { chapter: null, threads: [], notes: [], endings: [], unlocked: ['day1'] };
export function loadSave() {
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) Object.assign(SAVE, s); } catch (e) { }
}
export function writeSave() { try { localStorage.setItem(KEY, JSON.stringify(SAVE)); } catch (e) { } }
export function newGame() { SAVE.threads = []; SAVE.notes = []; SAVE.chapter = 'day1'; writeSave(); }

export const CHAPTER_LIST = [
  ['day1', 'Monday — Just Another Day'],
  ['day2', 'Tuesday — Something Is Off'],
  ['day3', 'Wednesday — Hungry'],
  ['dream', 'Wednesday Night — The Dream'],
  ['day4', 'Thursday, 3:33 AM — Saint Joseph at Night'],
  ['boss', 'The Gym — Moonkai'],
];

export const NOTES = {
  photo: ['A photo in your locker', 'Science fair, last year. Eric\'s volcano erupted early and hit Sister Agnes right in the veil. She gave us both detention. Best day ever.'],
  drawing: ['A drawing slipped into your desk', 'A fat monkey with a crescent moon on its forehead, drawn over and over until the paper tore. In tiny letters underneath: HE IS HUNGRY. It\'s signed "E".'],
  backpack: ['Note from Eric (in your backpack)', 'carlos if u find this KEEP IT. my lola\'s red thread snapped. she says the pieces have to stay with somebody who isn\'t scared. i think i\'m scared. there are 5 pieces. dont lose them ok. — E'],
  lola: ['Eric\'s Lola\'s story (left on the bench)', 'When Lola was little, the old people in the province warned about the Moonkai — a moon-monkey that eats the dreams of children who stare at the moon too long. It can eat anything. Except a promise. That\'s what the red thread is: a promise, tied in a knot.'],
  diary: ['Page from Eric\'s notebook (it fell from the dream sky)', 'It came to my window. It said it wanted CARLOS, because Carlos looks at the moon every night. I said take me instead. I\'m smaller. I\'m a grade younger. I\'m easier. It laughed. It said friends are the hardest thing to eat. So first it\'s going to make Carlos afraid of me. Carlos, if you\'re reading this: I\'m not the monster. Please don\'t hate me.'],
  gloria: ['Miss Gloria\'s clipboard', 'Wed: 400 bananas delivered. Thu 7am: ZERO bananas. Peels arranged in a CIRCLE on the floor??? That boy has a problem. Calling Sister Agnes. — G.'],
  agnes: ['Prayer card by the crucifix', 'Sister Agnes\'s handwriting on the back: "Whatever is bound together in love cannot be devoured."'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function cut() { player.enabled = false; letterbox(true); $('prompt').textContent = ''; }
async function play(dur = 0.6) { letterbox(false); hideDialogue(); await camToPlayer(dur); player.enabled = true; }
function npc(key, x, z, yaw = 0, extra = {}) { return addNPC(makeHuman({ ...LOOKS[key], ...extra }), x, z, yaw); }
function ericNPC(stage, x, z, yaw = 0) { const n = addNPC(makeEric(stage), x, z, yaw); n.stage = stage; return n; }
function setEricStage(n, stage) { n.h.setFace(ericFaceCanvas(stage)); n.stage = stage; }
function sit(n, seatY = 0.46) {
  const hipY = 0.82 * n.h.height / 1.7;
  n.pos.y = seatY - hipY + 0.03;
  n.h.pose = (dt, t) => {
    n.h.legs.forEach(l => { l.rotation.x = -1.45; });
    n.h.arms.forEach(a => { a.rotation.x = -0.7; });
    n.h.head.rotation.y *= 0.9;
    n.h.body.position.y = Math.sin(t * 1.3) * 0.004;
  };
}
function stand(n) { n.pos.y = 0; n.h.pose = null; }
async function path(n, pts, speed = 1.4) { for (const [x, z] of pts) await n.walkTo(x, z, speed); }
function angleWrap(from, to) { let d = to - from; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return from + d; }
function lookTween(x, y, z, dur = 0.5) {
  const y0 = player.yaw, p0 = player.pitch;
  const y1 = angleWrap(y0, yawTo(x, z));
  const p1 = Math.atan2(y - (player.pos.y + player.eye), Math.hypot(x - player.pos.x, z - player.pos.z));
  return tween(dur, k => { player.yaw = y0 + (y1 - y0) * k; player.pitch = p0 + (p1 - p0) * k; applyPlayerCam(); });
}
function chatter(n, label, linesFn, after) {
  let count = 0;
  return interact(n.h.group, label, async () => {
    player.enabled = false;
    if (!n.h.pose) n.facePlayer();
    n.watch = true;
    await lookTween(n.pos.x, n.pos.y + n.h.height * 0.9, n.pos.z, 0.35);
    const c = count++;
    await talk(typeof linesFn === 'function' ? linesFn(c) : linesFn);
    player.enabled = true;
    if (after) after(c);
  });
}
function waitUse(obj, label, range) { return new Promise(res => interact(obj, label, res, { once: true, range })); }
function examine(obj, label, lines, opts = {}) {
  return interact(obj, label, async () => {
    player.enabled = false;
    await talk(typeof lines === 'function' ? lines() : lines);
    if (opts.note) collectNote(opts.note);
    player.enabled = true;
  }, { once: !!opts.once, range: opts.range });
}
function collectNote(id) {
  if (SAVE.notes.includes(id)) return;
  SAVE.notes.push(id); writeSave();
  Audio.pickup(); toast(`Journal updated: "${NOTES[id][0]}"  (J to read)`, 3.5);
}
function noteAt(id, x, y, z, rot = 0) {
  if (SAVE.notes.includes(id)) return;
  const m = notePaper(x, y, z, rot);
  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), new THREE.MeshBasicMaterial({ visible: false })); put(hit, x, y, z);
  interact(hit, 'Read note', async () => {
    m.removeFromParent(); hit.removeFromParent();
    player.enabled = false;
    await say('Narrator', NOTES[id][1], { italic: true, color: '#e9dfc8', speed: 90 });
    collectNote(id);
    player.enabled = true;
  }, { once: true });
}
function threadAt(id, x, y, z, flavor) {
  if (SAVE.threads.includes(id)) return null;
  const m = threadPiece(x, y, z);
  const it = interact(m, 'Pick up the red thread', () => collectThread(id, m, flavor), { once: true });
  return m;
}
function collectThread(id, m, flavor) {
  if (m) m.removeFromParent();
  if (!SAVE.threads.includes(id)) { SAVE.threads.push(id); writeSave(); }
  Audio.thread(); setThreads(SAVE.threads.length);
  toast(flavor || `A piece of Eric's red thread (${SAVE.threads.length}/5)`, 3);
}
function bark(name, text, sec = 2) {
  const el = $('toast'); el.innerHTML = ''; const b = document.createElement('b'); b.textContent = name + ': '; b.style.color = name === 'Eric' ? '#ffd36a' : '#8fc1ff';
  el.append(b, document.createTextNode(text)); el.classList.add('show');
  clearTimeout(bark.t); bark.t = setTimeout(() => el.classList.remove('show'), sec * 1000);
}
function lookingAt(p, maxAng = 0.18) {
  const f = forwardVec(); const d = new THREE.Vector3(p.x - G.camera.position.x, p.y - G.camera.position.y, p.z - G.camera.position.z).normalize();
  return f.angleTo(d) < maxAng;
}
function next(id) { setTimeout(() => runChapter(id), 0); }

export const hooks = { death: null, ending: null };
async function die(title, sub, checkpoint) {
  if (G.mode === 'dead') return;
  G.mode = 'dead'; player.enabled = false;
  G.checkpoint = checkpoint;
  hooks.death && hooks.death(title, sub);
}

// ---------------------------------------------------------------------------
// Chapter runner
// ---------------------------------------------------------------------------
export async function runChapter(id) {
  G.runToken++;
  G.tasks = [];
  hideDialogue(); $('choices').classList.add('hidden'); $('phone').classList.add('hidden'); $('card').classList.add('hidden');
  ['score', 'charge', 'boss', 'hp', 'hold-ball'].forEach(e => $(e).classList.add('hidden'));
  stopSpeech();
  SAVE.chapter = id; if (!SAVE.unlocked.includes(id)) SAVE.unlocked.push(id); writeSave();
  G.mode = 'game'; G.paused = false; G.checkpoint = id;
  player.enabled = false; player.canRun = true; player.canJump = false; player.moveMult = 1; player.hp = 100;
  objective(''); letterbox(false); hud(true); setFade(1);
  setThreads(SAVE.threads.length, SAVE.threads.length > 0 || ['day3', 'dream', 'day4', 'boss'].includes(id));
  try { await CHAPTERS[id](); } catch (e) { console.error(e); }
}

// ---------------------------------------------------------------------------
// Shared scenes
// ---------------------------------------------------------------------------
async function carRide(driverKey, time, script) {
  const L = buildCar({ time });
  Audio.setAmbient('car');
  const d = npc(driverKey, -0.45, -0.72, Math.PI); sit(d, 0.9);
  d.h.pose = null; d.pos.y = 0.9 - 0.82 * d.h.height / 1.7 + 0.03;
  const baseHead = () => { d.h.legs.forEach(l => l.rotation.x = -1.45); d.h.arms.forEach(a => a.rotation.x = -1.1); };
  d.h.pose = (dt) => { baseHead(); d.h.head.rotation.y += ((d.talking ? 0.9 : 0) - d.h.head.rotation.y) * Math.min(1, dt * 3); };
  player.enabled = false;
  placePlayer(0.45, 0.75, 0.25, -0.05); player.pos.y = -0.45; applyPlayerCam();
  await camTo([0.45, 1.3, 0.75], [0.0, 1.25, -3], 0);
  await fade(0, 1.2);
  await script(L, d);
  await fade(1, 1.2);
}

async function sleepScene(L) {
  cut();
  await camTo([14.2, 1.1, -1.4], [14.2, 2.8, -1.8], 1.4);
  Audio.setAmbient('none');
  await fade(1, 2);
}

// ---------------------------------------------------------------------------
// DAY 1 — MONDAY
// ---------------------------------------------------------------------------
async function day1() {
  // prologue over black
  hud(false);
  await wait(0.8);
  await talk([
    ['Narrator', 'My name is Carlos. Seventh grade. Saint Joseph School.'],
    ['Narrator', 'My best friend is Eric. He\'s a grade below me, which he says "doesn\'t count."'],
    ['Narrator', 'This is the story of the week Eric got... hungry.'],
  ]);
  hud(true);
  const L = buildSchool({ time: 'day' });
  Audio.setAmbient('school');
  // classroom
  const teacher = npc('bautista', -20.6, -10.5, Math.PI / 2);
  teacher.watch = true;
  const jaden = npc('jaden', -10.0, -10.5, -Math.PI / 2); sit(jaden);
  const students = [];
  const seats = [[-16.5, -12.5], [-16.5, -8.5], [-13.5, -10.5], [-13.5, -6.5], [-10.5, -12.5], [-7.5, -8.5], [-7.5, -10.5], [-16.5, -6.5], [-13.5, -12.5]];
  seats.forEach(([x, z], i) => { const s = addNPC(makeHuman(randomStudent(i)), x + 0.5, z, -Math.PI / 2); sit(s); students.push(s); });
  placePlayer(-10.0, -8.5, Math.PI / 2, -0.05); player.pos.y = -0.35;
  applyPlayerCam();
  card('MONDAY', 'Saint Joseph School — Homeroom 7B');
  await fade(0, 2);
  cut();
  await wait(1.2);
  // snoring Jaden
  const snore = onUpdate(() => { if (Math.floor(G.time * 0.6) !== snore.t) { snore.t = Math.floor(G.time * 0.6); Audio.noise(0.9, { vol: 0.05, freq: 200, attack: 0.4 }); } });
  jaden.h.pose = (dt, t) => { jaden.h.legs.forEach(l => l.rotation.x = -1.45); jaden.h.arms.forEach(a => a.rotation.x = -1.4); jaden.h.head.rotation.x = 0.7; };
  await talk([
    ['Mr. Bautista', 'So. If a train leaves Manila at three o\'clock going sixty kilometers an hour...'],
    ['Mr. Bautista', '...and a second train leaves Cebu at four...'],
    ['Class', '(snoooooore)'],
    ['Mr. Bautista', 'Jaden.'],
    ['Mr. Bautista', 'JADEN.'],
  ]);
  snore();
  jaden.h.pose = null; sit(jaden);
  await talk([
    ['Jaden', 'I\'M AWAKE. The answer is... banana?'],
    [() => { Audio.laugh(14); return wait(0.6); }],
    ['Mr. Bautista', '...Why is it always bananas with you kids lately.'],
    ['Mr. Bautista', 'Carlos. Save this class. Where do the trains meet?'],
  ]);
  const a = await choice('Your answer:', ['"Forty-two."', '"They don\'t. Trains here are always late."', '"Can I go to the bathroom?"']);
  if (a === 0) await talk([['Carlos', 'Forty-two?'], ['Mr. Bautista', 'That is... the answer to a different question, Carlos. But I respect the confidence.']]);
  else if (a === 1) await talk([['Carlos', 'They don\'t. The trains here are always late.'], [() => { Audio.laugh(12); return wait(0.4); }], ['Mr. Bautista', '...Historically accurate. Half a point.']]);
  else await talk([['Carlos', 'Can I go to the bathroom?'], ['Mr. Bautista', 'You can wait eleven seconds.'], ['Carlos', 'Why eleven—']]);
  Audio.bell();
  await wait(0.6);
  await talk([
    ['Mr. Bautista', 'LUNCH. Walk, don\'t run. Sister Agnes has eyes in the back of her veil.'],
    ['Mr. Bautista', 'And somebody tell the sixth graders to stop leaving banana peels in my classroom!'],
  ]);
  // everyone leaves
  students.forEach((s, i) => { stand(s); wait(i * 0.25).then(() => path(s, [[s.pos.x, -7.5], [-6, -7.5], [-6, -2], [-6 + (i % 2 ? 12 : -12), 0]], 1.6).then(() => s.remove())); });
  jaden.h.pose = (dt, t) => { jaden.h.legs.forEach(l => l.rotation.x = -1.45); jaden.h.arms.forEach(a => a.rotation.x = -1.4); jaden.h.head.rotation.x = 0.7; };
  placePlayer(-10.2, -7.5, Math.PI / 2 + 1.2, 0);
  await play(0.8);
  objective('Meet Eric in the cafeteria');
  // optional flavor
  chatter(jaden, 'Talk to Jaden', (n) => n === 0
    ? [['Jaden', 'zzz... five more minutes, Mom...'], ['Carlos', '...I\'ll let him sleep.']]
    : [['Jaden', 'zzz... banana...']]);
  chatter(teacher, 'Talk to Mr. Bautista', [['Mr. Bautista', 'Eric was here before school asking me about the moon. Phases, craters, "can it get hungry." Odd kid.'], ['Mr. Bautista', 'Go eat, Carlos.']]);
  examine(L.chalk, 'Read the chalkboard', [['Narrator', '"Moon phases quiz FRIDAY!" ...Great.']]);
  // hallway
  const agnes = npc('agnes', -1.5, 1.8, Math.PI); agnes.watch = true;
  chatter(agnes, 'Talk to Sister Agnes', (n) => n === 0
    ? [['Sister Agnes', 'Mr. Carlos. Tuck in that shirt.'], ['Carlos', 'Yes, Sister.'], ['Sister Agnes', 'And tell your little friend the lost-and-found is not a banana storage facility.'], ['Sister Agnes', 'There are forty-one bananas in there. I counted.']]
    : [['Sister Agnes', 'Forty-one, Mr. Carlos.']]);
  let scolded = false;
  onUpdate(() => {
    if (scolded || !player.enabled) return;
    const d = Math.hypot(player.pos.x - agnes.pos.x, player.pos.z - agnes.pos.z);
    if (d < 4 && player.running) {
      scolded = true;
      (async () => { player.enabled = false; agnes.facePlayer(); await lookTween(agnes.pos.x, 1.5, agnes.pos.z, 0.3); await talk([['Sister Agnes', 'MR. CARLOS. We WALK in the halls of Saint Joseph.'], ['Carlos', '...Sorry, Sister.']]); player.enabled = true; })();
    }
  });
  const hallKids = [];
  for (let i = 0; i < 5; i++) {
    const s = addNPC(makeHuman(randomStudent(i + 10)), -20 + i * 9, i % 2 ? 1.6 : -1.6, i % 2 ? Math.PI / 2 : -Math.PI / 2);
    s.watch = true; hallKids.push(s);
    const lines = [['Kid', 'Your friend Eric ate a banana with the PEEL on in homeroom. It was sick.'], ['Kid', 'Did you hear the drums last night? My mom says it\'s the quarry.'], ['Kid', 'Falcons tryouts Friday! You trying out?'], ['Kid', 'Mr. Bautista gave me detention for yawning. Yawning!'], ['Kid', 'The moon was HUGE last night. Like, wrong-huge.']];
    chatter(s, 'Talk', [[ 'Class', lines[i][1] ]]);
  }
  const locker = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.4), new THREE.MeshBasicMaterial({ visible: false })); put(locker, -10, 1, -2.6);
  examine(locker, 'Open your locker', [['Narrator', 'Your locker. Textbooks, a Falcons jersey, and a photo taped to the door.']], { note: 'photo', once: true });
  // cafeteria
  const gloria = npc('gloria', 8, 17.4, Math.PI); gloria.watch = true;
  chatter(gloria, 'Talk to Miss Gloria', [['Miss Gloria', 'Eat your vegetables, baby. They\'re in the Monday Surprise somewhere.']]);
  const eric = ericNPC(0, 0, 7.1, 0); sit(eric);
  eric.watch = true;
  let waving = true;
  eric.extra = () => { if (waving) eric.h.arms[1].rotation.x = -2.8 + Math.sin(G.time * 8) * 0.3; };
  for (let i = 0; i < 6; i++) { const s = addNPC(makeHuman(randomStudent(i + 3)), 6 + (i % 3) * 1.1, i < 3 ? 7.15 : 8.85, i < 3 ? 0 : Math.PI); sit(s); s.watch = i % 2 === 0; }
  await waitUse(eric.h.group, 'Sit with Eric', 3.5);
  waving = false; eric.extra = null;
  cut();
  placePlayer(0.2, 8.95, 0, -0.1); player.pos.y = -0.35;
  await camTo([0.2, 1.08, 8.95], [0, 1.0, 7.1], 1);
  await talk([
    ['Eric', 'CARLOS! Finally. I saved you a seat.'],
    ['Eric', 'And by "saved" I mean I licked it.'],
    ['Carlos', '...Please tell me you\'re joking.'],
    ['Eric', 'I\'m joking.'],
    ['Eric', '...Mostly.'],
    ['Carlos', 'What even is this?'],
    ['Eric', 'Monday Surprise. I asked Miss Gloria what the surprise was.'],
    ['Carlos', 'And?'],
    ['Eric', 'She said "nobody knows, baby." Then she stared at me for a really long time.'],
    ['Eric', 'Hey. Trade you my banana for your cookie.'],
  ]);
  const t = await choice('Trade?', ['Trade (he does this every day)', 'No way. It\'s chocolate chip.']);
  if (t === 0) await talk([['Carlos', 'Fine.'], ['Eric', 'Pleasure doing business. You\'re my favorite seventh grader.'], ['Carlos', 'I\'m the only seventh grader who talks to you.'], ['Eric', 'Exactly. Favorite.']]);
  else await talk([['Carlos', 'Not a chance.'], ['Eric', 'Wow. After everything we\'ve been through.'], ['Eric', '(He eats the banana in one bite. Aggressively. While maintaining eye contact.)']]);
  await talk([
    ['Eric', 'After lunch. The gym. One-on-one. First to three.'],
    ['Carlos', 'You\'ve literally never beaten me.'],
    ['Eric', 'The sixth grade is RISING, Carlos. Loser carries the winner\'s backpack.'],
  ]);
  stand(eric);
  placePlayer(0.2, 9.9, 0.2, 0);
  await play(0.6);
  objective('Go to the gym (east end of the hallway)');
  path(eric, [[1.5, 5.5], [4, 4.5], [4, 0.2], [29, 0.2], [48, 0.5]], 2.0).then(() => eric.face(55, 0));
  await triggerOnce(30.5, -3, 34, 3);
  cut();
  await lookTween(eric.pos.x, 1.3, eric.pos.z, 0.5);
  await talk([
    ['Eric', 'Rules: first to three. Hold the mouse to power up, let go in the GREEN.'],
    ['Eric', 'Aim at the hoop or it goes wherever. Like your life choices.'],
    ['Carlos', 'You\'re so annoying.'],
    ['Eric', 'Annoyingly GOOD. Let\'s go!'],
  ]);
  placePlayer(45.5, 1.2, yawTo(L.hoopE.rim.x, L.hoopE.rim.z, { x: 45.5, z: 1.2 }), 0.15);
  await play(0.5);
  objective('Beat Eric — first to 3');
  const game = basketball({ L, eric, target: 3, ericSkill: 0.45, lines: {
    ericScores: () => bark('Eric', ['SIXTH GRADE SUPREMACY!', 'Cash money!', 'Did you SEE that?'][Math.floor(Math.random() * 3)]),
    carlosScores: () => bark('Eric', ['...Lucky.', 'The rim likes you. Rude.', 'I\'m just warming up!'][Math.floor(Math.random() * 3)]),
  } });
  const res = await game.done;
  cut();
  eric.facePlayer();
  await lookTween(eric.pos.x, 1.3, eric.pos.z, 0.5);
  if (res.carlos > res.eric) await talk([['Eric', 'RIGGED. The rim was on your side the whole time.'], ['Carlos', 'Backpack. Now.'], ['Eric', '...Fine. But I\'m putting a banana in it.']]);
  else await talk([['Eric', 'SIXTH GRADE! SIXTH GRADE!'], ['Carlos', 'Okay, okay. You got me.'], ['Eric', 'Carry my backpack, peasant.']]);
  await wait(0.5);
  Audio.drum(0.15); await wait(0.5); Audio.drum(0.12); await wait(0.5); Audio.drum(0.15);
  eric.h.head.rotation.x = -0.4;
  await talk([
    ['Eric', '...Hey. You hear that?'],
    ['Carlos', 'Hear what?'],
    ['Eric', 'Like... drums. Coming from... up.'],
    ['Carlos', 'Probably band practice.'],
    ['Eric', 'We don\'t have a band.'],
    ['Carlos', '...The recorder club, then.'],
    ['Eric', 'Yeah. Yeah, must be the recorder club.'],
  ]);
  Audio.bell();
  await fade(1, 1.5);
  // pickup
  eric.remove();
  const e2 = ericNPC(0, -32.2, -7.8, -Math.PI / 2); sit(e2, 0.45); e2.watch = true;
  car(-40, 3, 0, '#7a2f36');
  const mom = npc('mom', -38.6, 3.5, -Math.PI / 2); mom.watch = true;
  placePlayer(-31.4, 0, Math.PI / 2 - 0.3, 0);
  Audio.setAmbient('outside');
  objective('Say bye to Eric, then get in Mom\'s car');
  await fade(0, 1.2);
  player.enabled = true;
  let saidBye = false;
  chatter(e2, 'Talk to Eric', (n) => {
    if (n > 0) return [['Eric', 'Go, your mom\'s waiting. Tell her I said hi. And that I\'m very mature.']];
    saidBye = true;
    return [
      ['Eric', 'My Lola\'s picking me up. She\'s always late. She says time is "a suggestion."'],
      ['Carlos', 'Cool necklace, by the way. Is that new?'],
      ['Eric', 'This? It\'s just red string. Lola tied it on me. Tied like nine knots, praying the whole time.'],
      ['Eric', 'She says it keeps bad things from "eating your dreams." Old people, man.'],
      ['Eric', '...See you tomorrow, Carlos.'],
    ];
  });
  chatter(mom, 'Talk to Mom', [['Mom', 'Hi mijo! Say bye to Eric and let\'s go, I have a casserole in the oven.']]);
  const carHit = new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, 4.4), new THREE.MeshBasicMaterial({ visible: false })); put(carHit, -40, 0.8, 3);
  await waitUse(carHit, 'Get in the car');
  if (!saidBye) await talk([['Eric', 'BYE CARLOS! DON\'T MISS ME TOO MUCH!']]);
  await fade(1, 1);
  await carRide('mom', 'day', async (L2, d) => {
    await wait(0.8);
    d.talking = true;
    await talk([['Mom', 'So? How was school, mijo?']]);
    const c = await choice('', ['"Eric licked my seat. Allegedly."', '"Fine."', '"I beat Eric at basketball." (maybe)']);
    if (c === 0) await talk([['Carlos', 'Eric licked my seat. Allegedly.'], ['Mom', '(laughing) That boy! His Lola is going to have a heart attack one day.']]);
    else if (c === 1) await talk([['Carlos', 'Fine.'], ['Mom', '"Fine." Wow. Such detail. I feel so included in your life.']]);
    else await talk([['Carlos', 'Basketball happened.'], ['Mom', 'Ooh. Did you let him win?'], ['Carlos', 'I don\'t LET anyone win, Mom.']]);
    d.talking = false;
    await wait(1.5);
    d.talking = true;
    await talk([['Mom', 'Look at the moon out already. In the daytime. So big and pale.'], ['Mom', 'My Lola used to say don\'t stare at it too long. It stares back.'], ['Carlos', '...Everybody\'s Lola says weird stuff.']]);
    d.talking = false;
    await wait(1.5);
  });
  // home
  const H = buildHome({ time: 'evening' });
  Audio.setAmbient('home');
  const dad = npc('dad', H.spots.dad[0], H.spots.dad[1], Math.PI); dad.watch = true;
  placePlayer(4, 5.8, 0, 0);
  card('HOME', 'Monday evening');
  await fade(0, 1.5);
  player.enabled = true;
  objective('Say hi to Dad in the kitchen');
  await new Promise(res => chatter(dad, 'Talk to Dad', (n) => n === 0 ? [
    ['Dad', 'There he is! How\'s my favorite son?'],
    ['Carlos', 'I\'m your only son.'],
    ['Dad', 'And you\'re crushing it. Dinner\'s adobo. Wash your hands.'],
    ['Dad', 'Hey. Why don\'t monkeys play cards in the jungle?'],
    ['Carlos', 'Dad, no.'],
    ['Dad', 'Too many cheetahs! HA!'],
    ['Carlos', '(...I need to go lie down.)'],
  ] : [['Dad', 'Adobo in twenty. Go do your homework. Or stare at your phone. Whatever you kids do.']], (n) => { if (n === 0) res(); }));
  objective('Go to your room (east door) and get some sleep');
  examine(H.tv, 'Watch TV', [['TV', '...and residents near the old quarry continue to report strange drumming at night. Officials say it is "probably teenagers."'], ['TV', 'In other news, a local grocery store reports its entire banana supply stolen. Again.']]);
  examine(H.bananas, 'Look at the fruit bowl', [['Narrator', 'Bananas. Eric would inhale these.']]);
  examine(H.photo, 'Look at the photo', [['Narrator', 'Family photo from Christmas. Dad is making the same face he makes when he tells jokes.']]);
  await waitUse(H.bed, 'Go to sleep');
  cut();
  await phone('Eric', [
    { t: 'gg today', delay: 0.8 }, { t: 'rematch tmrw' }, { t: 'also check ur backpack' },
    { t: 'i put a banana in it', delay: 1.4 }, { t: 'why', me: true }, { t: 'for emergencies', delay: 1.6 },
    { t: 'go to sleep eric', me: true }, { t: 'ok. goodnight carlos', delay: 1.5 }, { t: 'dont look at the moon lol', delay: 2.2 },
  ], '9:41 PM');
  await sleepScene(H);
  next('day2');
}

// ---------------------------------------------------------------------------
// DAY 2 — TUESDAY
// ---------------------------------------------------------------------------
async function day2() {
  const L = buildSchool({ time: 'overcast' });
  Audio.setAmbient('school');
  placePlayer(-10, -1.9, 0, 0);
  const eric = ericNPC(1, 6, 0.8, -Math.PI / 2);
  card('TUESDAY', 'Saint Joseph School');
  await fade(0, 2);
  cut();
  await wait(1);
  Audio.locker();
  await wait(0.8);
  eric.walkTo(-8.8, -1.2, 2.6);
  await lookTween(-5, 1.4, 0.5, 1.2);
  await until(() => !eric.target);
  eric.facePlayer(); eric.watch = true;
  await lookTween(eric.pos.x, 1.3, eric.pos.z, 0.6);
  await talk([
    ['Eric', 'Carlos.'],
    ['Carlos', 'Whoa. You look terrible. Did you sleep?'],
    ['Eric', 'Did YOU dream last night?'],
    ['Carlos', 'Not really. Why?'],
    ['Eric', 'I dreamt the moon was a face. And it was... chewing.'],
    ['Eric', '...'],
    ['Eric', 'Anyway! Ha. I\'m fine. Totally fine. Did you know monkeys can\'t swim? I looked it up.'],
    ['Carlos', 'When?'],
    ['Eric', 'At 3 AM. Normal time to look stuff up.'],
  ]);
  Audio.bell();
  await talk([['Eric', 'Lunch. Gym after. Don\'t be late.']]);
  path(eric, [[8, 0], [20, 0]], 1.8).then(() => eric.remove());
  await fade(1, 1.2);
  // classroom
  placePlayer(-10.0, -8.5, Math.PI / 2, -0.25); player.pos.y = -0.35; applyPlayerCam();
  const teacher = npc('bautista', -10.6, -7.6, -Math.PI / 2 - 0.4); teacher.watch = true;
  const jaden = npc('jaden', -10.0, -10.5, -Math.PI / 2); sit(jaden); jaden.watch = true;
  const drawing = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.32), basic({ map: T.monkeyDrawing() }));
  drawing.rotation.x = -Math.PI / 2; drawing.rotation.z = Math.PI / 2; put(drawing, -10.5, 0.77, -8.5);
  await fade(0, 1);
  await talk([
    ['Mr. Bautista', 'Quizzes back. Most of you did... fine. Jaden, you wrote "banana" for every answer.'],
    ['Jaden', 'It\'s a lifestyle.'],
    ['Mr. Bautista', 'And Carlos—what is THIS?'],
  ]);
  await camTo([-10.0, 1.05, -8.5], [-10.5, 0.7, -8.5], 0.8);
  await wait(0.6);
  Audio.tone(60, 1.5, { vol: 0.2, attack: 0.3 });
  await talk([
    ['Narrator', 'A drawing. A fat monkey with a moon on its forehead. Over and over, pressed so hard the paper tore.'],
    ['Mr. Bautista', 'It\'s... actually quite good. Disturbing. But good.'],
    ['Carlos', 'That\'s not mine.'],
    ['Jaden', 'Bro, that\'s Eric\'s. He was drawing that in the library all morning. Same monkey. Like forty times.'],
    ['Jaden', 'He kept saying "he\'s so loud, he\'s so loud."'],
  ]);
  collectNote('drawing');
  drawing.removeFromParent();
  Audio.bell();
  await fade(1, 1.2);
  teacher.remove(); jaden.remove();
  // cafeteria cutscene
  const eric2 = ericNPC(1, 0, 7.1, 0); sit(eric2); eric2.watch = true;
  const gloria = npc('gloria', 8, 17.4, Math.PI); gloria.watch = true;
  const peels = [];
  for (let i = 0; i < 5; i++) { const b = banana(); b.rotation.x = Math.PI / 2; put(b, -0.6 + i * 0.3, 0.8, 7.7); peels.push(b); }
  placePlayer(0.2, 8.95, 0, -0.1); player.pos.y = -0.35;
  await camTo([0.2, 1.08, 8.95], [0, 1.0, 7.1], 0);
  await fade(0, 1);
  await talk([
    ['Narrator', 'Eric has five bananas. He is eating them with the peel on.'],
    ['Carlos', 'Dude. The peel.'],
    ['Eric', 'The peel is the best part.'],
    [() => { Audio.chew(); return wait(1.6); }],
    ['Eric', '...'],
    ['Eric', 'What? It\'s a joke. I\'m joking.'],
    [() => { peels.pop().removeFromParent(); return wait(0.1); }],
    ['Carlos', 'You\'re still chewing.'],
  ]);
  await gloria.walkTo(1.8, 9.9, 1.6); gloria.face(0, 7.1);
  await talk([
    ['Miss Gloria', 'Baby, that\'s your ninth banana today. I\'m cutting you off.'],
    ['Eric', 'Miss Gloria, do you ever hear drums? At night?'],
    ['Miss Gloria', '...Only when I eat spicy food before bed. Finish your milk.'],
  ]);
  gloria.walkTo(8, 17.4, 1.4);
  await talk([['Eric', 'Gym. Now. Before it gets louder.']]);
  await fade(1, 1.2);
  eric2.remove(); gloria.remove(); peels.forEach(p => p.removeFromParent());
  // gym game
  const eric3 = ericNPC(1, 48, 0.5, Math.PI / 2);
  placePlayer(45.5, 1.2, yawTo(L.hoopE.rim.x, L.hoopE.rim.z, { x: 45.5, z: 1.2 }), 0.15);
  applyPlayerCam();
  await fade(0, 1);
  await play(0.2);
  objective('Play Eric — first to 3');
  const game = basketball({ L, eric: eric3, target: 3, ericSkill: 0.6, stopWhen: s => s.carlos + s.eric >= 2, lines: {
    ericScores: () => bark('Eric', 'Heh. Heh heh.'), carlosScores: () => bark('Eric', '...') } });
  await game.done;
  cut();
  eric3.target = null;
  eric3.h.pose = (dt, t) => { eric3.h.head.rotation.x = -0.9; eric3.h.arms.forEach(a => a.rotation.x = 0); };
  await lookTween(eric3.pos.x, 1.3, eric3.pos.z, 0.6);
  for (let i = 0; i < 6; i++) Audio.drum(0.25, i * 0.4);
  await talk([
    ['Eric', '...It\'s so loud.'],
    ['Carlos', 'What is?'],
    ['Eric', 'The drums. Carlos, it\'s SO LOUD. You really don\'t hear it?'],
  ]);
  // the ball rolls away into the equipment room
  const sys = createBallSystem({ bounds: { x0: 30.2, x1: 55.8, z0: -12.8, z1: 19 } });
  const rolling = sys.spawn(new THREE.Vector3(47.5, 0.5, 5), new THREE.Vector3(0.1, 0, 2.3), 'x');
  await lookTween(48, 0.3, 12, 1.5);
  await wait(1.5);
  sys.clear();
  const ballMesh = makeBall(); put(ballMesh, 47.2, 0.12, 17.2);
  L.equipLight.intensity = 0.7;
  const flick = onUpdate(() => { L.equipLight.intensity = Math.random() < 0.08 ? 0 : 0.7; });
  await talk([['Eric', '...Can you get that? I don\'t... I don\'t want to go in there.']]);
  await play(0.4);
  objective('Get the ball from the equipment room');
  threadAt('t1', 51.2, 0.7, 18.1, 'A piece of red string... tangled in the mats? (1 of 5)');
  await waitUse(ballMesh, 'Pick up the ball');
  ballMesh.removeFromParent();
  Audio.pickup();
  player.enabled = false;
  eric3.h.pose = null;
  eric3.place(48, 14.2); eric3.face(48, 18);
  setEricStage(eric3, 3);
  if (eric3.h.group.userData.necklace) eric3.h.group.userData.necklace.visible = false;
  await wait(1.2);
  Audio.creak();
  await wait(0.8);
  await lookTween(48, 1.25, 14.2, 0.18);
  scare('eric', 0.5);
  await wait(0.5);
  setEricStage(eric3, 1);
  await talk([
    ['Eric', 'Found it? Cool.'],
    ['Carlos', 'DUDE. Why were you standing right behind me?!'],
    ['Eric', 'I... I don\'t know. I was over there. Then I was here.'],
    ['Eric', 'Sorry. I don\'t know why I did that.'],
    ['Carlos', 'Wait. Where\'s your necklace?'],
    ['Eric', '...What necklace?'],
    ['Narrator', 'Eric turns and walks out without another word. He says he\'s going to the nurse.'],
  ]);
  flick();
  eric3.walkTo(48, 8, 1.4).then(() => eric3.walkTo(31, 0, 1.4)).then(() => eric3.remove());
  await fade(1, 1.5);
  // pickup with Dad
  const e4 = ericNPC(1, -32.2, -7.8, -Math.PI / 2); sit(e4, 0.45);
  e4.h.pose = (dt) => { e4.h.legs.forEach(l => l.rotation.x = -1.45); e4.h.head.rotation.x = -0.6; e4.h.arms.forEach(a => a.rotation.x = -0.4); };
  if (e4.h.group.userData.necklace) e4.h.group.userData.necklace.visible = false;
  car(-40, 3, 0, '#2f4a3a');
  const dad = npc('dad', -38.6, 3.5, -Math.PI / 2); dad.watch = true;
  placePlayer(-31.4, 0, Math.PI / 2 - 0.3, 0);
  Audio.setAmbient('outside');
  objective('Talk to Eric');
  await fade(0, 1.2);
  player.enabled = true;
  await new Promise(res => chatter(e4, 'Talk to Eric', (n) => {
    if (n > 0) return [['Eric', '...']];
    return [
      ['Narrator', 'Eric is staring straight up at the pale daytime moon. He doesn\'t blink.'],
      ['Carlos', 'Eric? Dad\'s here. You want a ride?'],
      ['Eric', 'Carlos. Don\'t look at the moon tonight.'],
      ['Eric', 'Promise me.'],
    ];
  }, (n) => { if (n === 0) res(); }));
  player.enabled = false;
  const p = await choice('', ['"I promise."', '"Why? What\'s wrong with you?"']);
  if (p === 0) await talk([['Carlos', 'Okay. I promise.'], ['Eric', 'Good. Good...'], ['Eric', 'Because it looks back.']]);
  else await talk([['Carlos', 'Why? Eric, what\'s WRONG with you?'], ['Eric', 'Nothing. Nothing\'s wrong with me.'], ['Eric', 'Just... it looks back, Carlos. It looks back.']]);
  player.enabled = true;
  objective('Get in Dad\'s car');
  chatter(dad, 'Talk to Dad', [['Dad', 'Let\'s roll, champ. Your mom\'s working late.']]);
  const carHit = new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, 4.4), new THREE.MeshBasicMaterial({ visible: false })); put(carHit, -40, 0.8, 3);
  await waitUse(carHit, 'Get in the car');
  await fade(1, 1);
  await carRide('dad', 'overcast', async (L2, d) => {
    await wait(0.6);
    d.talking = true;
    await talk([
      ['Dad', 'Okay. Okay. What do you call a monkey that loves potato chips?'],
      ['Carlos', 'Dad.'],
      ['Dad', 'A CHIP-MUNK!'],
      ['Carlos', 'That\'s not even a monkey.'],
      ['Dad', 'Tough crowd.'],
    ]);
    d.talking = false; await wait(1.4); d.talking = true;
    await talk([
      ['Dad', '...Hey. Eric\'s Lola called the house today. She sounded scared.'],
      ['Dad', 'She asked if Eric left anything at our place. Some kind of red string?'],
      ['Carlos', 'His necklace. It\'s gone. He acted like he didn\'t even know what it was.'],
      ['Dad', 'Huh. Well. Be a good friend to him, okay? Sounds like he needs one.'],
    ]);
    d.talking = false; await wait(1.5);
  });
  // home night
  const H = buildHome({ time: 'night' });
  Audio.setAmbient('home-night');
  const dad2 = npc('dad', -2, 4.9, Math.PI); sit(dad2, 0.45); dad2.watch = true;
  const tvGlow = new THREE.PointLight(0x7fa8ff, 1.2, 8, 1.2); put(tvGlow, -5.2, 1.6, -5.8);
  onUpdate(() => { tvGlow.intensity = 0.8 + Math.random() * 0.6; });
  H.tv.material.color.setHex(0x3a5a9a);
  chatter(dad2, 'Talk to Dad', [['Dad', 'Mom\'s still at work. Get some sleep, champ. Big day tomorrow. Probably. I don\'t know your schedule.']]);
  placePlayer(4, 5.8, 0, 0);
  card('HOME', 'Tuesday night');
  await fade(0, 1.5);
  player.enabled = true;
  objective('Go to your room');
  await triggerOnce(8.2, -7, 15, 0);
  Audio.phone(); await wait(0.6); Audio.phone();
  objective('Check your phone (on the nightstand)');
  const phoneHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), new THREE.MeshBasicMaterial({ visible: false })); put(phoneHit, 13.6, 0.95, -3.3);
  await waitUse(phoneHit, 'Check phone');
  cut();
  await phone('Eric', [
    { t: 'carlos' }, { t: 'are u awake', delay: 1.4 }, { t: 'ya whats up', me: true },
    { t: 'dont look out ur window', delay: 1.8 }, { t: 'why??', me: true },
    { t: 'its sitting on the roof across the street', delay: 2 }, { t: 'its so big carlos', delay: 1.4 },
    { t: 'it says its hungry', delay: 1.6, bad: true }, { t: 'it says it wants YOU', delay: 1.6, bad: true },
    { t: 'i told it no', delay: 2.4 }, { t: 'eric what are u talking about', me: true }, { t: '...', delay: 3 },
  ], '11:47 PM');
  await play(0.4);
  objective('Look out the window');
  const mkk = makeMoonkai(0.9); put(mkk.group, 12, 4.2, -21.5); mkk.group.rotation.y = 0;
  onUpdate(dt => mkk.update(dt));
  await until(() => player.pos.z < -4.5 && lookingAt(new THREE.Vector3(12, 8, -21.5), 0.3));
  player.enabled = false;
  await lookTween(12, 8.2, -21.5, 0.6);
  Audio.heartbeat(0.5); await wait(0.8); Audio.heartbeat(0.6);
  await tween(1.2, k => { mkk.head.rotation.z = k * 0.5; });
  await wait(0.5);
  Audio.stinger(); flash(0.25, '#300'); shake(0.2);
  mkk.group.visible = false;
  await wait(1.2);
  await talk([['Carlos', '...W-what was that?'], ['Carlos', '...Eric said to check my backpack yesterday.']]);
  player.enabled = true;
  objective('Check your backpack');
  await waitUse(H.backpack, 'Open backpack');
  player.enabled = false;
  await talk([['Narrator', 'Under the emergency banana: a folded note, and a tangle of red string.']]);
  collectThread('t2', null, 'A piece of Eric\'s red thread');
  collectNote('backpack');
  await wait(1);
  player.enabled = true;
  objective('Go to sleep');
  await waitUse(H.bed, 'Go to sleep');
  await sleepScene(H);
  next('day3');
}

// ---------------------------------------------------------------------------
// DAY 3 — WEDNESDAY
// ---------------------------------------------------------------------------
async function day3() {
  let L = buildSchool({ time: 'dim', flicker: 0.4, chalk: ['HE IS HUNGRY HE IS HUNGRY HE IS', 'HUNGRY HE IS HUNGRY HE IS HUNGRY', 'HE IS HUNGRY  HE IS HUNGRY'] });
  Audio.setAmbient('school-quiet');
  setThreads(SAVE.threads.length, true);
  placePlayer(-28, 0, -Math.PI / 2, 0);
  card('WEDNESDAY', 'Half the school stayed home sick');
  const agnes = npc('agnes', -20, 1.6, -Math.PI / 2 + 0.3); agnes.watch = true;
  await fade(0, 2);
  player.enabled = true;
  objective('Find Eric');
  noteAt('agnes', -12, 0.02, -2.2);
  trigger(-24, -3, -18, 3, async () => {
    player.enabled = false;
    agnes.facePlayer();
    await lookTween(agnes.pos.x, 1.45, agnes.pos.z, 0.4);
    await talk([
      ['Sister Agnes', 'Mr. Carlos. Come here, child.'],
      ['Sister Agnes', 'The chapel bell rang at three o\'clock this morning. Nobody was in the tower.'],
      ['Sister Agnes', 'And your friend... Eric. I saw him before sunrise. By the garbage bins.'],
      ['Sister Agnes', 'Eating. Peels and all. He looked at me like... like I was food.'],
      ['Sister Agnes', 'Stay near the light today. And pray for him.'],
    ]);
    player.enabled = true;
  });
  // classroom: Jaden alone
  const jaden = npc('jaden', -12, -7.4, Math.PI); jaden.watch = true;
  chatter(jaden, 'Talk to Jaden', (n) => n === 0 ? [
    ['Jaden', 'Dude. DUDE. Eric was in here before school. He wrote all that on the board.'],
    ['Jaden', 'Then he climbed out the window.'],
    ['Jaden', 'We\'re on the first floor, so. Not dramatic. But STILL.'],
    ['Jaden', 'Mr. Bautista went home "sick." I think he got scared.'],
  ] : [['Jaden', 'I\'m not going in the cafeteria. It smells like a thousand bananas.']]);
  examine(L.chalk, 'Read the chalkboard', [['Narrator', 'HE IS HUNGRY. Over and over, in Eric\'s handwriting. The chalk is ground down to nothing.']]);
  // lockers bang as you pass
  trigger(-2, -3, 2, 3, async () => { for (let i = 0; i < 6; i++) { await wait(0.12); Audio.locker(); shake(0.03); } toast('...the lockers are banging. From the inside?', 2.5); });
  // cafeteria
  const gloria = npc('gloria', 8, 17.4, Math.PI); gloria.watch = true;
  chatter(gloria, 'Talk to Miss Gloria', [['Miss Gloria', 'I\'m closing early, baby. Something ate every banana in the storage room.'], ['Miss Gloria', 'Four hundred bananas. Just peels left. In a circle.'], ['Miss Gloria', 'Your friend\'s over there. He won\'t talk to me. Try, okay?']]);
  const eric = ericNPC(2, 7, 7.15, 0); sit(eric);
  eric.h.pose = (dt, t) => { eric.h.legs.forEach(l => l.rotation.x = -1.45); eric.h.arms.forEach(a => a.rotation.x = -1.2); eric.h.head.rotation.x = 0.5 + Math.sin(t * 5) * 0.05; };
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; bananaPeel(7 + Math.cos(a) * 1.9, 7.2 + Math.sin(a) * 1.6, a); }
  const tray = block(0.45, 0.03, 0.32, mat({ color: '#9aa1a8' }), 7, 0.75, 7.95, { collide: false });
  await triggerOnce(-6, 3, 16, 19);
  Audio.chew();
  toast('...chewing.', 2);
  await waitUse(eric.h.group, 'Eric?', 3.2);
  cut();
  placePlayer(7, 5.6, 0, 0); // behind him, looking at his back
  await camTo([7.1, 1.35, 5.6], [7, 1.1, 7.15], 0.8);
  await talk([['Carlos', 'Eric?'], ['Eric', '...'], ['Carlos', 'Eric, everyone\'s freaking out. Your Lola called my house.']]);
  eric.h.pose = (dt, t) => { eric.h.legs.forEach(l => l.rotation.x = -1.45); eric.h.arms.forEach(a => a.rotation.x = -0.3); };
  await tween(2.5, k => { eric.yaw = k * Math.PI; });
  eric.watch = true;
  Audio.tone(55, 3, { vol: 0.25, attack: 1 });
  await talk([
    ['Eric', 'Carlos. You came.'],
    ['Carlos', 'You look sick, man. Like, really sick.'],
    ['Eric', 'I\'m not sick. I\'m FULL.'],
    ['Eric', '...No. No, I\'m not. I\'m so hungry, Carlos. I\'m so, so hungry.'],
    ['Eric', 'Listen. LISTEN. Whatever you see tonight—it\'s not me.'],
    ['Eric', 'Remember that. It\'s NOT me.'],
  ]);
  L.setLights(false); Audio.buzz(0.6); Audio.slam();
  await wait(2.2);
  eric.remove();
  Audio.buzz(0.3);
  L.setLights(true);
  const th = threadPiece(7, 0.85, 7.95);
  await wait(0.6);
  await talk([['Carlos', 'Eric?! ...ERIC!'], ['Narrator', 'He\'s gone. There\'s something on his tray.']]);
  await play(0.5);
  objective('Take what Eric left on his tray');
  await waitUse(th, 'Take the red thread');
  collectThread('t3', th, 'Another piece of the red thread.');
  objective('Search the gym');
  await triggerOnce(30.5, -3, 34, 3);
  L.setGymLights(0.4);
  const ball = makeBall(); put(ball, 43, 0.12, 0);
  objective('...There\'s a ball on the court.');
  await waitUse(ball, 'Pick up the ball');
  ball.removeFromParent();
  const sys = createBallSystem({ hoops: [L.hoopE, L.hoopW], bounds: { x0: 30.2, x1: 55.8, z0: -12.8, z1: 12.8, ceil: 30 } });
  toast('Take a shot. Hold and release the mouse.', 3);
  let thrown = false;
  const sh = createShooter(sys, { aimAt: () => ({ pos: L.hoopE.rim }), returnBall: 0, onThrow: () => { thrown = true; } });
  await until(() => thrown);
  sh.stop();
  await wait(0.45);
  // the ball goes up... and doesn't come down
  sys.balls.forEach(b => { b.vel.set(0, 12, 0); });
  await wait(0.5);
  sys.clear();
  player.enabled = false;
  await lookTween(player.pos.x + 2, 8, player.pos.z, 0.8);
  Audio.chew(); await wait(1.8);
  const peel = bananaPeel(player.pos.x + 1.2, player.pos.z, 0); peel.position.y = 7.5;
  await tween(1.2, k => { peel.position.y = 7.5 * (1 - k) + 0.01; peel.rotation.y += 0.2; }, k => k * k);
  await lookTween(player.pos.x + 1.2, 0, player.pos.z, 0.6);
  await wait(0.8);
  await talk([['Sister Agnes', 'CARLOS! Out of the gym. NOW.'], ['Sister Agnes', 'School is closing early. Go wait for your mother outside. Go!']]);
  await fade(1, 1.2);
  // dusk pickup
  L = buildSchool({ time: 'dusk' });
  Audio.setAmbient('dusk');
  placePlayer(-31.4, 0, Math.PI / 2 - 0.3, 0);
  card('', 'Mom is late.');
  await fade(0, 1.5);
  player.enabled = true;
  objective('Wait for Mom');
  threadAt('t4', -68.8, 0.7, -21.5, 'A piece of red thread, knotted to the fence by the swings.');
  noteAt('lola', -32.2, 0.48, -8.3);
  const swOff = onUpdate(() => { L.swings.forEach((s, i) => { s.rotation.x = Math.sin(G.time * 1.6 + i) * 0.6; }); if (Math.floor(G.time / 2.2) !== swOff.t) { swOff.t = Math.floor(G.time / 2.2); Audio.creak(); } });
  // Eric watching from the roof
  const roofEric = ericNPC(2, -31.2, 10, -Math.PI / 2); roofEric.pos.y = 7.1;
  let sawRoof = false;
  const roofWatch = onUpdate(() => {
    if (!sawRoof && roofEric.visible && lookingAt(new THREE.Vector3(-31.2, 8, 10), 0.2) && Math.hypot(player.pos.x + 31, player.pos.z - 10) > 6) {
      sawRoof = true;
      wait(0.5).then(() => { roofEric.visible = false; Audio.stinger(); shake(0.15); toast('Was that... Eric? On the roof?', 3); });
    }
  });
  const t0 = G.time;
  await until(() => G.time - t0 > 50 || (sawRoof && G.time - t0 > 22));
  // Mom arrives
  Audio.engineStart();
  const momCar = car(-40, -30, 0, '#7a2f36');
  await tween(4, k => { momCar.position.z = -30 + 33 * k; });
  const mom = npc('mom', -38.6, 3.5, -Math.PI / 2); mom.watch = true;
  toast('Headlights. Finally.', 2.5);
  objective('Get in Mom\'s car');
  const carHit = new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, 4.4), new THREE.MeshBasicMaterial({ visible: false })); put(carHit, -40, 0.8, 3);
  await waitUse(carHit, 'Get in the car');
  swOff(); roofWatch();
  await fade(1, 1);
  await carRide('mom', 'dusk', async (L2, d) => {
    await wait(0.6);
    d.talking = true;
    await talk([
      ['Mom', 'I\'m so sorry, mijo. Traffic. They closed two lanes on the highway.'],
      ['Mom', 'People said there was an animal on the road. A huge one. Like a gorilla.'],
      ['Carlos', '...Or a monkey?'],
      ['Mom', 'Ha. Sure, mijo. A monkey the size of a truck.'],
    ]);
    d.talking = false;
    await wait(2);
    // something runs through the trees
    const mk = makeMoonkai(0.8); put(mk.group, 12, 0, -60); mk.group.rotation.y = Math.PI; mk.mode = 'walk';
    onUpdate(dt => { mk.update(dt); mk.group.position.z += dt * 22; });
    await wait(1.8);
    Audio.drum(0.4); Audio.drum(0.4, 0.3);
    await wait(1.2);
    d.talking = true;
    await talk([['Mom', 'Did you say something?'], ['Carlos', '...No. Just drive, Mom. Please.']]);
    d.talking = false; await wait(1);
  });
  const H = buildHome({ time: 'night' });
  Audio.setAmbient('home-night');
  const mom2 = npc('mom', 0.5, -2, Math.PI);
  placePlayer(0.5, -0.4, 0, 0);
  await fade(0, 1.2);
  cut();
  mom2.watch = true;
  await lookTween(0.5, 1.5, -2, 0.1);
  await talk([
    ['Mom', 'Mijo... Eric\'s Lola called again.'],
    ['Mom', 'Eric didn\'t come home last night. The police are looking for him.'],
    ['Carlos', '...What?'],
    ['Mom', 'I\'m sure he\'s okay. Kids run off sometimes. Try to get some sleep, okay?'],
  ]);
  mom2.walkTo(-4, 8, 1.2).then(() => mom2.remove());
  await play(0.4);
  objective('Go to bed');
  await waitUse(H.bed, 'Go to sleep');
  await sleepScene(H);
  next('dream');
}

// ---------------------------------------------------------------------------
// THE DREAM
// ---------------------------------------------------------------------------
async function dream() {
  const L = buildDream();
  Audio.setAmbient('dream');
  setThreads(SAVE.threads.length, true);
  placePlayer(0, 6.5, 0, 0);
  const eric = ericNPC(1, 0, -2, 0); eric.watch = true;
  if (eric.h.group.userData.necklace) eric.h.group.userData.necklace.visible = false;
  card('', 'Wednesday night');
  await fade(0, 3);
  player.enabled = true;
  objective('Walk to Eric');
  await waitUse(eric.h.group, 'Eric?');
  cut();
  await lookTween(0, 1.3, -2, 0.4);
  await talk([
    ['Eric', 'Carlos?! How are you HERE?'],
    ['Carlos', 'It\'s a dream. I\'m dreaming.'],
    ['Eric', 'No. No no no. It\'s HIS dream. We\'re inside him, Carlos.'],
    ['Eric', 'You have to leave. You have to WAKE UP—'],
  ]);
  // the moon becomes a face
  Audio.roar(); shake(0.3);
  await camTo([0, 2, 5], [0, 30, -120], 1.2);
  const mk = L.moonkai;
  mk.group.visible = true; mk.group.position.set(0, 70, -24); mk.group.rotation.y = 0;
  await tween(4, k => { mk.group.position.y = 70 * (1 - k); }, k => 1 - Math.pow(1 - k, 3));
  Audio.slam(); shake(0.8);
  await camTo([0, 3, 6], [0, 9, -20], 0.8);
  await talk([
    ['MOONKAI', 'LITTLE FRIEND.'],
    ['MOONKAI', 'YOU LOOKED AT ME. EVERY NIGHT, FROM YOUR WINDOW. YOU LOOKED AND LOOKED.'],
    ['MOONKAI', 'SO I CAME TO EAT YOU.'],
    ['MOONKAI', 'BUT THIS ONE... THIS ONE SAID "TAKE ME INSTEAD."'],
    ['MOONKAI', 'HOW SWEET. HOW... FILLING.'],
  ]);
  // possession
  await camTo([2.5, 1.6, 2.5], [0, 1.4, -2], 0.8);
  Audio.screech();
  const hand = mk.arms[1];
  await tween(1.2, k => { hand.sh.rotation.x = -1.6 * k; });
  eric.h.pose = (dt, t) => { eric.h.arms.forEach(a => a.rotation.x = -0.2 + Math.sin(t * 20) * 0.1); eric.h.legs.forEach(l => l.rotation.x = Math.sin(t * 18) * 0.15); eric.h.head.rotation.x = -0.5; };
  await tween(1.5, k => { eric.pos.y = k * 1.2; });
  for (let i = 0; i < 6; i++) { setEricStage(eric, i % 2 ? 3 : 1); Audio.buzz(0.1); await wait(0.12); }
  setEricStage(eric, 3);
  flash(0.4, '#f00'); shake(0.6); Audio.stinger();
  await tween(0.8, k => { eric.pos.y = 1.2 * (1 - k); hand.sh.rotation.x = -1.6 * (1 - k); });
  eric.h.pose = (dt, t) => { eric.h.head.rotation.z = Math.sin(t * 3) * 0.3; eric.h.arms.forEach(a => a.rotation.x = 0.1); };
  await camTo([0, 1.4, 1.2], [0, 1.25, -2], 0.4);
  await talk([
    ['Eric?', 'r u n ,  c a r l o s .', { shake: true }],
    ['MOONKAI', 'HE CALLED ME HERE, YOU KNOW. HE WANTED YOU GONE. HE WAS JEALOUS. A WHOLE GRADE ABOVE HIM.'],
    ['MOONKAI', 'HE IS THE MONSTER NOW. HATE HIM, LITTLE FRIEND. HATE HIM AND RUN.'],
  ]);
  // Eric's diary page flutters down
  const page = notePaper(0.3, 3, 4, 0.4); page.rotation.x = -0.4;
  await camTo([0, 1.5, 6.5], [0.3, 2, 4], 0.6);
  await tween(1.5, k => { page.position.y = 3 - k * 1.6; page.rotation.z += 0.05; });
  await talk([['Narrator', 'A page from Eric\'s notebook drifts out of the red sky...'], ['Narrator', NOTES.diary[1], { italic: true, color: '#e9dfc8', speed: 90 }]]);
  collectNote('diary');
  page.removeFromParent();
  await talk([['Carlos', '...He lied. Eric didn\'t call it. Eric was protecting ME.']]);
  eric.remove(); mk.group.visible = false;
  next('dream_chase');
}
async function dreamChase() {
  const L = buildDream();
  Audio.setAmbient('chase');
  setThreads(SAVE.threads.length, true);
  placePlayer(0, -6, 0, 0);
  const mk = L.moonkai; mk.group.visible = true; mk.group.position.set(0, 0, 20); mk.group.rotation.y = Math.PI;
  const eric = ericNPC(3, 0, 3, Math.PI);
  eric.h.pose = null;
  camTo([0, 1.4, -6], [0, 1.2, 3], 0);
  await fade(0, 0.4);
  toast('RUN! (hold Shift) Get to the door!', 3);
  objective('RUN to the door');
  player.enabled = true;
  let over = false, speed = 2.9;
  const t0 = G.time;
  const off = onUpdate(dt => {
    if (over) return;
    speed = 2.9 + Math.min(0.9, (G.time - t0) * 0.02);
    eric.target = new THREE.Vector3(player.pos.x, 0, player.pos.z); eric.speed = speed;
    eric.pos.x = clamp(eric.pos.x, L.path(eric.pos.z) - 1.4, L.path(eric.pos.z) + 1.4);
    const d = Math.hypot(player.pos.x - eric.pos.x, player.pos.z - eric.pos.z);
    if (Math.floor(G.time * (d < 4 ? 3 : 1.5)) !== off.b) { off.b = Math.floor(G.time * (d < 4 ? 3 : 1.5)); Audio.heartbeat(d < 4 ? 0.6 : 0.3); }
    $('hurt').style.opacity = d < 5 ? (5 - d) / 8 : 0;
    // Moonkai lumbers behind
    mk.mode = 'walk'; mk.group.position.z = Math.max(eric.pos.z + 12, mk.group.position.z - dt * 2.8); mk.group.position.x = L.path(mk.group.position.z) * 0.5;
    if (d < 0.9) {
      over = true; off(); $('hurt').style.opacity = 0;
      (async () => { player.enabled = false; await scare('eric', 0.9); die('YOU WERE CAUGHT', 'Eric isn\'t Eric right now. Keep running.', 'dream_chase'); })();
    }
    if (player.pos.z < -85.5) {
      over = true; off(); $('hurt').style.opacity = 0;
      (async () => {
        player.enabled = false;
        await lookTween(L.doorPos[0], 1.1, -88, 0.3);
        await wait(0.3);
        await scare('moonkai', 1.1);
        setFade(1);
        Audio.setAmbient('none');
        await wait(1);
        next('wake');
      })();
    }
  });
}
async function wake() {
  const H = buildHome({ time: 'night' });
  Audio.setAmbient('home-night');
  placePlayer(14.2, -1.6, 0, 0);
  cut(); letterbox(false);
  await camTo([14.2, 1.0, -1.6], [14.2, 3, -1.8], 0);
  await wait(0.4);
  Audio.tone(200, 0.4, { type: 'sawtooth', vol: 0.1, slide: 400 });
  await fade(0, 0.3);
  await camTo([14.2, 1.3, -1.4], [11.5, 1.6, -7], 0.8);
  await talk([['Carlos', '(gasping) ...It was a dream. Just a dream.']]);
  Audio.phone(); await wait(0.6); Audio.phone();
  await phone('Eric', [
    { t: 'carlos', delay: 1.5 }, { t: 'come to the gym', delay: 1.8 }, { t: 'im so hungry', delay: 2, bad: true },
    { t: 'please', delay: 2.5 }, { t: 'Eric, is that you??', me: true }, { t: 'its me', delay: 1.5 }, { t: 'its still me', delay: 1.8 }, { t: 'for now', delay: 2.5, bad: true },
  ], '3:33 AM');
  await talk([['Carlos', '...Hold on, Eric. I\'m coming.'], ['Narrator', 'You grab your flashlight and sneak out the back door.']]);
  await fade(1, 1.5);
  next('day4');
}

// ---------------------------------------------------------------------------
// DAY 4 — THURSDAY 3:33 AM
// ---------------------------------------------------------------------------
async function day4() {
  const L = buildSchool({ time: 'night', chalk: ['CARLOS CARLOS CARLOS CARLOS', 'CARLOS CARLOS CARLOS', 'COME PLAY  COME PLAY  COME PLAY'] });
  Audio.setAmbient('night');
  setThreads(SAVE.threads.length, true);
  player.canFlash = true; setFlashlight(true);
  L.doors.front.userData.collider.off = false;
  L.doors.sevenB.visible = true;
  // red emergency lights
  const reds = [[-24, 0], [-6, -1.5], [10, 1.5], [26, 0], [-13, -9], [4, 10]].map(([x, z]) => { const l = new THREE.PointLight(0xff2010, 0.9, 7, 1.4); put(l, x, 2.9, z); return l; });
  onUpdate(() => { reds.forEach((l, i) => { l.intensity = 0.7 + Math.sin(G.time * 2 + i) * 0.3; }); });
  // peel trail
  for (let i = 0; i < 12; i++) bananaPeel(-28 + i * 1.8, Math.sin(i) * 0.8, i);
  for (let i = 0; i < 4; i++) bananaPeel(-6 + Math.sin(i) * 0.4, -3.5 - i * 1.3, i);
  placePlayer(-52, 0, -Math.PI / 2, 0);
  card('THURSDAY', '3:33 AM — Saint Joseph School');
  await fade(0, 2.5);
  player.enabled = true;
  toast('F toggles your flashlight', 3);
  objective('Get inside Saint Joseph');
  const doorHit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.4, 3), new THREE.MeshBasicMaterial({ visible: false })); put(doorHit, -30.7, 1.2, 0);
  await waitUse(doorHit, 'Open the front door', 3);
  Audio.creak(); await wait(0.4); Audio.door();
  L.doors.front.userData.collider.off = true;
  doorHit.removeFromParent();
  toast('...It was unlocked.', 2);
  objective('Follow the banana peels');
  threadAt('t5', -19.5, 1.05, -9, 'The last piece of the red thread—on Mr. Bautista\'s desk.');
  noteAt('gloria', 10, 0.02, 15);
  if (!SAVE.notes.includes('agnes')) noteAt('agnes', -12, 0.02, -2.2);
  examine(L.chalk, 'Read the chalkboard', [['Narrator', 'CARLOS CARLOS CARLOS. COME PLAY.']]);
  // a figure crosses the far end of the hallway
  trigger(-24, -3, -20, 3, async () => {
    const f = ericNPC(3, 20, 2.5, Math.PI);
    await wait(0.2);
    f.walkTo(20, -2.5, 6).then(() => f.remove());
    Audio.whoosh(); Audio.heartbeat(0.5);
  });
  trigger(-8, -3, -4, 3, async () => { for (let i = 0; i < 8; i++) { await wait(0.1); Audio.locker(); } shake(0.05); });
  // the classroom: once you've been inside and step back into the hallway, it begins
  await triggerOnce(-21, -14, -5, -4);
  objective('Find Eric');
  await wait(0.5);
  await triggerOnce(-10, -3.2, 2, 3);
  G.carry = 'chase';
  next('chase');
}
async function chase(fromCheckpoint) {
  let L = G.level;
  const fresh = fromCheckpoint || G.carry !== 'chase' || !L || L.name !== 'school';
  G.carry = null;
  if (!fresh) setFade(0);
  if (fresh) {
    L = buildSchool({ time: 'night' });
    player.canFlash = true; setFlashlight(true);
    Audio.setAmbient('night');
    setThreads(SAVE.threads.length, true);
    placePlayer(-4, 0, -Math.PI / 2, 0);
    await fade(0, 0.5);
  }
  // doors slam so there's nowhere to hide
  const blocks = [addCollider(-6.8, -3.3, -5.2, -2.9), addCollider(2.5, 2.9, 5.5, 3.3)];
  const cafDoor = block(3, 2.3, 0.1, mat({ color: '#6a2020' }), 4, 0, 3, { collide: false });
  L.doors.sevenB.rotation.y = 0; L.doors.sevenB.position.set(-6, 1.15, -3);
  Audio.slam(); shake(0.3);
  L.setLights(true);
  L.lights.forEach(l => l.color.setHex(0xff3020));
  L.lamps.forEach(m => m.material.color.setHex(0xff3020));
  player.enabled = false;
  const eric = ericNPC(3, -26, 0, -Math.PI / 2);
  eric.collide = true;
  await lookTween(-26, 1.3, 0, 0.5);
  Audio.setAmbient('chase');
  await say('Eric?', 'CARLOSSSS. LET\'S PLAY BALL.', { auto: 1.8, shake: true });
  player.enabled = true;
  objective('RUN! Get to the gym!');
  toast('Hold Shift to run', 2);
  let over = false;
  const off = onUpdate(() => {
    if (over) return;
    eric.target = new THREE.Vector3(player.pos.x, 0, player.pos.z); eric.speed = 3.5;
    const d = Math.hypot(player.pos.x - eric.pos.x, player.pos.z - eric.pos.z);
    if (Math.floor(G.time * (d < 5 ? 3 : 1.5)) !== off.b) { off.b = Math.floor(G.time * (d < 5 ? 3 : 1.5)); Audio.heartbeat(d < 5 ? 0.6 : 0.3); }
    $('hurt').style.opacity = d < 5 ? (5 - d) / 8 : 0;
    if (d < 0.9) {
      over = true; off(); $('hurt').style.opacity = 0;
      (async () => { player.enabled = false; await scare('eric', 0.9); die('YOU WERE CAUGHT', 'Don\'t stop running. The gym is at the east end of the hall.', 'chase_cp'); })();
    }
    if (player.pos.x > 30.8) {
      over = true; off(); $('hurt').style.opacity = 0;
      eric.remove();
      L.doors.gym.visible = true; L.doors.gym.userData.collider.off = false;
      Audio.slam(); shake(0.4);
      G.carry = 'boss';
      next('boss');
    }
  });
}

// ---------------------------------------------------------------------------
// BOSS + ENDINGS
// ---------------------------------------------------------------------------
async function boss() {
  let L = G.level;
  const fresh = G.carry !== 'boss' || !L || L.name !== 'school';
  G.carry = null;
  if (!fresh) setFade(0);
  if (fresh) {
    L = buildSchool({ time: 'night' });
    player.canFlash = true; setFlashlight(false);
    L.doors.gym.visible = true; L.doors.gym.userData.collider.off = false;
    placePlayer(32, 0, -Math.PI / 2, 0);
  }
  setThreads(SAVE.threads.length, true);
  Audio.setAmbient('none');
  player.enabled = false;
  cut();
  if (fresh) await fade(0, 1);
  placePlayer(Math.max(32, player.pos.x), 0, -Math.PI / 2, 0);
  await camTo([32.5, 1.45, 0], [43, 5, 0], 1);
  // lights stutter on
  L.setGymLights(0);
  for (let i = 0; i < 5; i++) { L.setGymLights(Math.random() < 0.5 ? 1 : 0.1); Audio.buzz(0.1); await wait(0.15); }
  L.setGymLights(0.6);
  const intro = makeMoonkai(1.05); put(intro.group, 45, 14, 0); intro.group.rotation.y = -Math.PI / 2;
  const trapped = makeEric(3); trapped.group.scale.setScalar(0.42); trapped.group.position.set(0, 1.6, 1.75); intro.body.add(trapped.group); intro.orb.material.opacity = 0.35;
  trapped.pose = () => { trapped.body.rotation.x = 0.5; trapped.legs.forEach(l => l.rotation.x = -1.2); };
  const iu = onUpdate(dt => intro.update(dt));
  Audio.drum(0.4); await wait(0.5); Audio.drum(0.5); await wait(0.5);
  await camTo([32.5, 1.45, 0], [45, 8, 0], 0.5);
  await tween(1.1, k => { intro.group.position.y = 14 * (1 - k); }, k => k * k);
  Audio.slam(); shake(1); flash(0.3);
  await camTo([33, 1.4, 0], [45, 4.2, 0], 0.6);
  Audio.setAmbient('boss');
  await talk([
    ['MOONKAI', 'LET\'S PLAY BALL, LITTLE FRIEND.'],
    ['Carlos', 'Let him GO!'],
    ['MOONKAI', 'HE GAVE HIMSELF TO ME. FOR YOU. AND NOW YOU WILL WATCH HIM DIGEST.'],
    ['Eric?', 'c...carlos... the crescent... on its head... hit it...'],
  ]);
  iu(); intro.group.removeFromParent();
  await play(0.4);
  toast('Grab basketballs from the racks. Jump shockwaves with SPACE.', 4);
  objective('Hit the glowing crescent when Moonkai roars');
  const b = runBoss(L, { onDeath: async () => { player.enabled = false; await scare('moonkai', 0.9); die('YOU WERE EATEN', 'Tip: jump (Space) over shockwaves, keep moving, and only throw when the crescent glows.', 'boss'); } });
  await b.done;
  // defeat
  cut();
  const mk = b.mk;
  objective('');
  Audio.setAmbient('none');
  Audio.roar(); shake(0.6);
  const mp = mk.group.position, fx = Math.sin(b.st.yaw), fz = Math.cos(b.st.yaw);
  await camTo([clamp(mp.x + fx * 7, 31, 55), 2, clamp(mp.z + fz * 7, -8.5, 12.5)], [mp.x, 3, mp.z], 0.8);
  await tween(2.4, k => { mk.body.rotation.x = k * 0.5; mk.body.position.y = -k * 1.2; mk.head.rotation.x = k * 0.6; });
  Audio.slam(); shake(0.6);
  b.stopMoving();
  // Eric falls out of the orb
  const eric = ericNPC(3, clamp(mp.x + fx * 3.2, 32, 54), clamp(mp.z + fz * 3.2, -8, 11), 0);
  b.eric.group.visible = false; mk.orb.visible = false;
  flash(0.4); Audio.stinger();
  eric.h.pose = (dt, t) => { eric.h.body.rotation.x = -1.3; eric.h.body.position.y = 0.2; };
  placePlayer(clamp(eric.pos.x + fx * 3, 31.5, 55), clamp(eric.pos.z + fz * 3, -8.5, 12.5), 0, 0);
  player.yaw = yawTo(eric.pos.x, eric.pos.z);
  await camToPlayer(0.6);
  await wait(1);
  eric.h.pose = null; eric.facePlayer(); eric.watch = true;
  await lookTween(eric.pos.x, 1.3, eric.pos.z, 0.5);
  await talk([
    ['Eric?', 'Carlos...'],
    ['Eric?', 'It\'s still in me. I can feel it chewing.'],
    ['Eric?', 'Finish it. Before it wakes up. PLEASE.'],
    ['MOONKAI', '(whispering) HE BROUGHT ME HERE. HE DESERVES IT. THROW THE BALL, LITTLE FRIEND.'],
  ]);
  const have = SAVE.threads.length;
  const c = await choice('What do you do?', [
    'Throw the ball. Finish it.',
    'Reach for Eric.',
    { text: have >= 5 ? 'Tie the red thread around both your wrists.' : `Tie the red thread... (you only have ${have}/5 pieces)`, disabled: have < 5 },
  ]);
  if (c === 0) return badEnding(L, eric, mk);
  if (c === 1) return goodEnding(L, eric, mk);
  return trueEnding(L, eric, mk);
}

async function endCard(key, title, sub) {
  if (!SAVE.endings.includes(key)) SAVE.endings.push(key);
  SAVE.chapter = null; writeSave();
  G.mode = 'ending';
  hooks.ending && hooks.ending(title, sub, `Red thread pieces: ${SAVE.threads.length}/5 · Journal pages: ${SAVE.notes.length}/${Object.keys(NOTES).length} · Endings found: ${SAVE.endings.length}/3`);
}

async function badEnding(L, eric, mk) {
  await talk([['Carlos', '...I\'m sorry, Eric.']]);
  Audio.whoosh(); flash(0.5); Audio.hit();
  eric.h.pose = (dt, t) => { eric.h.body.rotation.x = -1.5; eric.h.body.position.y = 0.15; };
  await wait(1.5);
  await talk([['MOONKAI', 'HA. HA. HA. HA.'], ['MOONKAI', 'THERE IT IS. THE TASTE I WAS WAITING FOR.'], ['MOONKAI', 'I NEVER WANTED HIM, LITTLE FRIEND. I WANTED A FRIEND WHO WOULD GIVE UP ON HIM.']]);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), basic({ color: 0xffd35a })); put(glow, mk.group.position.x, 4, mk.group.position.z);
  const cp = G.camera.position.clone();
  Audio.roar();
  await tween(1.4, k => { glow.position.lerpVectors(new THREE.Vector3(mk.group.position.x, 4, mk.group.position.z), cp, k); });
  flash(1, '#ffd35a'); shake(1);
  await fade(1, 1.5);
  // epilogue
  const H = buildHome({ time: 'morning' });
  Audio.setAmbient('home-night');
  const mom = npc('mom', -4, 9.2, Math.PI); sit(mom, 0.46); mom.watch = true;
  placePlayer(-4, 11.3, 0, -0.15);
  await camTo([-4, 1.1, 11.2], [-4, 1.1, 9.2], 0);
  await fade(0, 2);
  await talk([
    ['Narrator', 'One week later.'],
    ['Mom', 'Mijo... you haven\'t eaten in days. I made adobo. Your favorite.'],
    ['Carlos', 'I\'m not hungry for adobo, Mom.'],
    ['Mom', '...Then what ARE you hungry for?'],
  ]);
  const c = document.createElement('canvas'); c.width = 128; c.height = 160;
  const face = degradeFace(paintFace(LOOKS.carlos), 3);
  const sc = $('scare'); const g = sc.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 256, 256); g.drawImage(face, 26, 0, 204, 256);
  sc.classList.remove('hidden'); Audio.stinger(); Audio.hoot(); shake(0.4);
  await wait(1.2); sc.classList.add('hidden');
  setFade(1);
  await wait(1);
  endCard('bad', 'BAD ENDING — HUNGRY', 'Moonkai never needed Eric. It needed a friend who would give up on him. Somewhere over Saint Joseph, the moon is grinning — and so is Carlos.');
}

async function goodEnding(L, eric, mk) {
  await talk([['Carlos', 'No. I\'m not doing that. Come HERE.']]);
  await tween(0.8, k => { player.pos.x += (eric.pos.x - player.pos.x) * 0.05; player.pos.z += (eric.pos.z - player.pos.z) * 0.05; applyPlayerCam(); });
  await talk([['Narrator', 'You grab Eric\'s hand. It\'s ice cold. You pull.'], ['Eric?', 'Carlos—it\'s waking up—'], ['Carlos', 'Then RUN!']]);
  Audio.roar(); shake(1);
  L.doors.gym.userData.collider.off = true; L.doors.gym.visible = false;
  await fade(1, 1.5);
  const S = buildSchool({ time: 'dawn' });
  Audio.setAmbient('dawn');
  const e = ericNPC(1, -32.2, -7.2, -Math.PI / 2); sit(e, 0.45); e.watch = true;
  placePlayer(-33.3, -8.5, yawTo(-32.2, -7.2, { x: -33.3, z: -8.5 }) , 0);
  await fade(0, 2.5);
  cut();
  await lookTween(-32.2, 1.1, -7.2, 0.1);
  await talk([
    ['Narrator', 'Sunrise. Two kids on the bench outside Saint Joseph, soaked in sweat and banana.'],
    ['Eric', '...You came back for me.'],
    ['Carlos', 'Obviously. You still owe me a backpack carry.'],
    ['Eric', '(laughs) ...Thanks for not hating me, Carlos.'],
    ['Carlos', 'You\'re annoying. You\'re not a monster.'],
  ]);
  await camTo([-33.3, 1.3, -8.5], [-140, 60, 30], 2.5);
  await wait(1);
  if (S.moon) { S.moon.scale.y = 0.1; await wait(0.15); S.moon.scale.y = 1; }
  Audio.hoot();
  await wait(1.5);
  await fade(1, 2);
  endCard('good', 'GOOD ENDING — DAWN', 'Eric is home. Lola re-tied a new thread, fourteen knots this time. But on quiet nights, you can still hear drumming... and in the daytime sky, the moon sometimes blinks. (Find all 5 red thread pieces to discover the TRUE ending.)');
}

async function trueEnding(L, eric, mk) {
  await talk([
    ['Carlos', 'Eric. Give me your hand.'],
    ['Narrator', 'You tie the five pieces of Lola\'s red thread into one loop — around your wrist, and around his.'],
    ['Narrator', 'Nine knots. Like Lola did. You don\'t know any prayers, so you just say the truest thing you know.'],
    ['Carlos', 'You\'re my best friend. I\'m not afraid of you. I was never going to be.'],
  ]);
  collectNote('agnes');
  Audio.thread(); flash(0.6, '#ff3030');
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 4, 16), basic({ color: 0xff2020 })); loop.rotation.x = Math.PI / 2; put(loop, eric.pos.x, 1, eric.pos.z);
  onUpdate(dt => { loop.rotation.z += dt * 4; loop.scale.setScalar(1 + Math.sin(G.time * 6) * 0.1); });
  await wait(0.8);
  setEricStage(eric, 1); await wait(0.3); setEricStage(eric, 0);
  await talk([['MOONKAI', 'NO. NO NO NO. I CAN\'T— A PROMISE— I CAN\'T CHEW IT—'], ['MOONKAI', 'IT\'S STUCK IN MY TEEEEETH—']]);
  Audio.roar(); shake(1);
  await tween(3, k => { const s = 1 - k * 0.95; mk.group.scale.setScalar(s); mk.body.rotation.x = 0.5 * (1 - k); mk.body.position.y = -1.2 * (1 - k); });
  flash(0.6);
  await wait(0.6);
  mk.group.scale.setScalar(0.07); mk.body.rotation.x = 0; mk.body.position.y = 0;
  const p = mk.group.position;
  await lookTween(p.x, 0.2, p.z, 0.6);
  Audio.tone(1200, 0.12, { type: 'triangle', vol: 0.15 }); Audio.tone(1500, 0.1, { type: 'triangle', vol: 0.12, at: 0.15 });
  await talk([
    ['???', '...ook?'],
    ['Carlos', '...Is that it? Is that the demon?'],
    ['Eric', '(normal voice) It\'s... so small. Carlos. It\'s so small.'],
    ['Eric', 'It was just really, really hungry. And really, really lonely.'],
    ['Eric', '...Can we keep him?'],
    ['Carlos', 'Absolutely not.'],
  ]);
  await fade(1, 2);
  // epilogue: next Monday
  buildSchool({ time: 'day' });
  Audio.setAmbient('school');
  const e = ericNPC(0, 0, 7.1, 0); sit(e); e.watch = true;
  const gloria = npc('gloria', 1.8, 9.9, Math.PI + 0.4); gloria.watch = true;
  const bp = block(0.35, 0.45, 0.2, mat({ color: '#2b4b7a' }), 0.9, 0.75, 7.5, { collide: false });
  const tiny = makeMoonkai(0.06); put(tiny.group, 0.9, 1.2, 7.5); tiny.group.rotation.y = 0.4;
  onUpdate(dt => { tiny.update(dt); bp.rotation.z = Math.sin(G.time * 14) * 0.08; tiny.group.position.y = 1.2 + Math.abs(Math.sin(G.time * 3)) * 0.05; });
  placePlayer(0.2, 8.95, 0, -0.1); player.pos.y = -0.35;
  await camTo([0.2, 1.08, 8.95], [0.5, 1.0, 7.3], 0);
  card('MONDAY', 'One week later');
  await fade(0, 2);
  Audio.tone(1200, 0.1, { type: 'triangle', vol: 0.12 });
  await talk([
    ['Miss Gloria', 'Eric, baby. Is that... a MONKEY in your backpack?'],
    ['Eric', 'No ma\'am. It\'s a very hairy banana.'],
    ['???', 'ook.'],
    ['Miss Gloria', '...I\'m not paid enough for this. Monday Surprise, boys.'],
    ['Eric', 'Hey Carlos. After lunch. The gym. First to three.'],
    ['Carlos', 'You\'ve never beaten me.'],
    ['Eric', 'The sixth grade is RISING, Carlos.'],
    ['???', 'OOK OOK!'],
  ]);
  await fade(1, 2);
  endCard('true', 'TRUE ENDING — THE RED THREAD', 'Some things can\'t be eaten. A promise is one of them. Eric and Carlos still wear matching red bracelets. Moonkai eats one banana a day now, and sleeps in Eric\'s sock drawer.');
}

export const CHAPTERS = {
  day1, day2, day3, dream, dream_chase: dreamChase, wake, day4,
  chase: () => chase(false), chase_cp: () => chase(true), boss,
};

import { THREE, G, mat, basic } from './engine.js';
import { T } from './textures.js';

// ---------------------------------------------------------------------------
// Painted faces. Front face texture is 128x160; eyes sit on a fixed guide line
// (y = 0.42) so effects like "possessed eyes" line up on any face, including a
// custom photo the player lines up in Settings.
// ---------------------------------------------------------------------------
export const FACE_W = 128, FACE_H = 160;
export const EYE_L = [0.31, 0.42], EYE_R = [0.69, 0.42], MOUTH = [0.5, 0.77];

function newCanvas(w = FACE_W, h = FACE_H) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

export function paintFace(o) {
  const c = newCanvas(), g = c.getContext('2d'), W = FACE_W, H = FACE_H;
  const skin = o.skin || '#d6a57c';
  g.fillStyle = skin; g.fillRect(0, 0, W, H);
  // soft 3D shading
  let gr = g.createRadialGradient(W / 2, H * 0.5, 10, W / 2, H * 0.55, W * 0.75);
  gr.addColorStop(0, 'rgba(255,235,215,0.25)'); gr.addColorStop(0.6, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(60,25,10,0.45)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // cheeks
  g.fillStyle = o.blush || 'rgba(215,110,100,0.18)';
  g.beginPath(); g.ellipse(W * 0.25, H * 0.6, 16, 11, 0, 0, 7); g.ellipse(W * 0.75, H * 0.6, 16, 11, 0, 0, 7); g.fill();
  // eye sockets shade
  g.fillStyle = 'rgba(90,50,30,0.16)';
  for (const [ex] of [EYE_L, EYE_R]) { g.beginPath(); g.ellipse(W * ex, H * 0.41, 17, 9, 0, 0, 7); g.fill(); }
  // eyes
  const ey = H * EYE_L[1];
  for (const [ex, side] of [[EYE_L[0], -1], [EYE_R[0], 1]]) {
    const x = W * ex, ew = o.eyeW || 11, eh = o.eyeH || 4.5;
    g.fillStyle = '#f1ece4'; g.beginPath(); g.ellipse(x, ey, ew, eh, side * -0.06, 0, 7); g.fill();
    g.save(); g.beginPath(); g.ellipse(x, ey, ew, eh, 0, 0, 7); g.clip();
    g.fillStyle = o.iris || '#3a2414'; g.beginPath(); g.arc(x + side * 0.5, ey + 0.5, 4.6, 0, 7); g.fill();
    g.fillStyle = '#0b0605'; g.beginPath(); g.arc(x + side * 0.5, ey + 0.5, 2.2, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.fillRect(x - 2, ey - 2, 1.5, 1.5);
    g.restore();
    g.strokeStyle = '#1b0f0a'; g.lineWidth = 1.8;
    g.beginPath(); g.ellipse(x, ey, ew, eh, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    g.strokeStyle = 'rgba(80,40,25,0.5)'; g.lineWidth = 0.8;
    g.beginPath(); g.ellipse(x, ey + 0.5, ew - 1, eh, 0, 0.15, Math.PI - 0.15); g.stroke();
    // brows
    g.strokeStyle = o.brow || '#1a120d'; g.lineWidth = o.browW || 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x - side * 11, ey - 11); g.quadraticCurveTo(x, ey - 15 - (o.browLift || 0), x + side * 13, ey - 11 + (o.browTilt || 0)); g.stroke();
  }
  // nose
  const nx = W / 2, ny = H * 0.6;
  g.strokeStyle = 'rgba(110,60,35,0.45)'; g.lineWidth = 1.4;
  g.beginPath(); g.moveTo(nx - 4, ey + 6); g.quadraticCurveTo(nx - 7, ny, nx - 9, ny + 3); g.stroke();
  g.fillStyle = 'rgba(120,65,40,0.35)'; g.beginPath(); g.ellipse(nx, ny + 3, 10, 5, 0, 0, 7); g.fill();
  g.fillStyle = 'rgba(255,230,210,0.35)'; g.beginPath(); g.ellipse(nx + 1, ny - 3, 3, 6, 0, 0, 7); g.fill();
  g.fillStyle = '#3a1c14'; g.beginPath(); g.ellipse(nx - 5, ny + 5, 3, 1.8, 0.3, 0, 7); g.ellipse(nx + 5, ny + 5, 3, 1.8, -0.3, 0, 7); g.fill();
  // mouth
  const mx = W * MOUTH[0], my = H * MOUTH[1], mw = o.mouthW || 15;
  g.fillStyle = o.lips || '#b06a60';
  g.beginPath(); g.moveTo(mx - mw, my); g.quadraticCurveTo(mx - 5, my - 6, mx, my - 3); g.quadraticCurveTo(mx + 5, my - 6, mx + mw, my);
  g.quadraticCurveTo(mx, my + 8, mx - mw, my); g.fill();
  g.strokeStyle = '#5a2a24'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(mx - mw, my); g.quadraticCurveTo(mx, my + (o.smile || 1.5), mx + mw, my); g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(mx - 4, my + 2, 8, 1.5);
  // chin shadow
  gr = g.createLinearGradient(0, H * 0.86, 0, H); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(60,25,10,0.35)');
  g.fillStyle = gr; g.fillRect(0, H * 0.86, W, H * 0.14);
  // extras
  if (o.stubble) { g.fillStyle = 'rgba(40,30,25,0.28)'; g.beginPath(); g.ellipse(mx, my + 8, 34, 22, 0, 0, Math.PI); g.fill(); }
  if (o.mustache) { g.fillStyle = o.hair || '#222'; g.beginPath(); g.ellipse(mx - 7, my - 7, 9, 3.5, 0.2, 0, 7); g.ellipse(mx + 7, my - 7, 9, 3.5, -0.2, 0, 7); g.fill(); }
  if (o.beard) { g.fillStyle = o.hair || '#222'; g.beginPath(); g.moveTo(10, H * 0.6); g.quadraticCurveTo(W / 2, H * 1.15, W - 10, H * 0.6); g.lineTo(W - 10, H); g.lineTo(10, H); g.fill();
    g.fillStyle = o.lips || '#a06060'; g.fillRect(mx - 9, my - 1, 18, 4); }
  if (o.wrinkles) { g.strokeStyle = 'rgba(90,50,35,0.35)'; g.lineWidth = 1; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(W / 2 + s * 14, H * 0.66); g.quadraticCurveTo(W / 2 + s * 22, H * 0.74, W / 2 + s * 20, H * 0.8); g.stroke(); } g.beginPath(); g.moveTo(40, 36); g.lineTo(88, 36); g.stroke(); }
  // hair / headwear on the front
  drawFrontHair(g, o);
  if (o.glasses) {
    g.strokeStyle = o.glasses; g.lineWidth = 2.5;
    for (const [ex] of [EYE_L, EYE_R]) { g.beginPath(); g.arc(W * ex, ey, 13, 0, 7); g.stroke(); }
    g.beginPath(); g.moveTo(W * EYE_L[0] + 13, ey - 2); g.lineTo(W * EYE_R[0] - 13, ey - 2); g.stroke();
  }
  return c;
}

function drawFrontHair(g, o) {
  const W = FACE_W, H = FACE_H, hair = o.hair || '#141010';
  switch (o.hairStyle) {
    case 'bangs': { // Eric: heavy straight black bangs with strands
      g.fillStyle = hair; g.fillRect(0, 0, W, 30);
      g.beginPath(); g.moveTo(0, 28);
      for (let x = 0; x <= W; x += 6) g.lineTo(x, 34 + Math.sin(x * 0.7) * 5 + (x % 12 ? 6 : 0));
      g.lineTo(W, 0); g.lineTo(0, 0); g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.08)'; g.lineWidth = 1;
      for (let x = 4; x < W; x += 7) { g.beginPath(); g.moveTo(x, 2); g.lineTo(x + 3, 34); g.stroke(); }
      g.fillRect(0, 0, 8, 70); g.fillRect(W - 8, 0, 8, 70);
      break;
    }
    case 'short': g.fillStyle = hair; g.beginPath(); g.moveTo(0, 26); g.quadraticCurveTo(W / 2, 14, W, 26); g.lineTo(W, 0); g.lineTo(0, 0); g.fill(); g.fillRect(0, 0, 6, 55); g.fillRect(W - 6, 0, 6, 55); break;
    case 'bald': g.fillStyle = 'rgba(255,255,255,0.12)'; g.beginPath(); g.ellipse(W / 2, 12, 30, 8, 0, 0, 7); g.fill(); g.fillStyle = hair; g.fillRect(0, 30, 6, 30); g.fillRect(W - 6, 30, 6, 30); break;
    case 'long': g.fillStyle = hair; g.beginPath(); g.moveTo(0, H * 0.8); g.lineTo(0, 0); g.lineTo(W, 0); g.lineTo(W, H * 0.8); g.lineTo(W - 12, H * 0.8); g.quadraticCurveTo(W - 14, 20, W / 2 + 4, 16); g.quadraticCurveTo(14, 20, 12, H * 0.8); g.fill(); break;
    case 'bun': g.fillStyle = hair; g.beginPath(); g.moveTo(0, 30); g.quadraticCurveTo(W / 2, 8, W, 30); g.lineTo(W, 0); g.lineTo(0, 0); g.fill(); g.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = 6; x < W; x += 8) g.fillRect(x, 8, 1, 18); break;
    case 'nun': g.fillStyle = '#f3f1ea'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 0); g.lineTo(W, 0); g.lineTo(W, H); g.lineTo(W - 14, H); g.quadraticCurveTo(W - 12, 24, W / 2, 26); g.quadraticCurveTo(12, 24, 14, H); g.fill(); g.fillStyle = '#1a1a22'; g.fillRect(0, 0, W, 12); break;
    default: break;
  }
}
export function paintSide(o, back = false) {
  const c = newCanvas(64, 80), g = c.getContext('2d');
  g.fillStyle = o.skin || '#d6a57c'; g.fillRect(0, 0, 64, 80);
  g.fillStyle = 'rgba(60,25,10,0.25)'; g.fillRect(0, 0, 64, 80);
  const hair = o.hair || '#141010';
  if (o.hairStyle === 'nun') { g.fillStyle = '#1a1a22'; g.fillRect(0, 0, 64, 80); g.fillStyle = '#f3f1ea'; g.fillRect(back ? 0 : 50, 0, back ? 0 : 14, 80); return c; }
  if (o.hairStyle === 'long') { g.fillStyle = hair; g.fillRect(0, 0, 64, 80); return c; }
  g.fillStyle = hair;
  const lvl = o.hairStyle === 'bald' ? 22 : back ? 56 : 30;
  if (o.hairStyle === 'bald') { g.fillRect(0, 22, 64, 26); } else g.fillRect(0, 0, 64, lvl);
  if (!back && o.hairStyle !== 'bald') { g.fillRect(0, 0, 18, 50); }
  if (!back) { // ear
    g.fillStyle = o.skin || '#d6a57c'; g.beginPath(); g.ellipse(32, 40, 7, 11, 0, 0, 7); g.fill();
    g.strokeStyle = 'rgba(90,40,20,0.5)'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(32, 40, 4, 7, 0, 0, 7); g.stroke();
  }
  if (o.hairStyle === 'bun' && back) { g.fillStyle = hair; g.beginPath(); g.arc(32, 22, 14, 0, 7); g.fill(); }
  return c;
}

// Face "stages" for Eric: 0 normal, 1 tired, 2 sick, 3 possessed
export function degradeFace(src, stage) {
  if (!stage) return src;
  const c = newCanvas(), g = c.getContext('2d'), W = FACE_W, H = FACE_H;
  g.drawImage(src, 0, 0, W, H);
  const ex = [EYE_L[0] * W, EYE_R[0] * W], ey = EYE_L[1] * H;
  if (stage >= 1) { // dark circles
    g.fillStyle = stage >= 2 ? 'rgba(60,20,50,0.45)' : 'rgba(70,35,60,0.28)';
    for (const x of ex) { g.beginPath(); g.ellipse(x, ey + 8, 12, 5, 0, 0, 7); g.fill(); }
  }
  if (stage >= 2) { // pale & sickly
    g.globalCompositeOperation = 'color'; g.fillStyle = 'rgba(150,170,150,0.45)'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = 'rgba(210,225,210,0.18)'; g.fillRect(0, 0, W, H);
  }
  if (stage >= 3) { // possessed: black eyes, red pupils, veins, grin
    g.fillStyle = 'rgba(20,0,10,0.35)'; g.fillRect(0, 0, W, H);
    for (const x of ex) {
      g.fillStyle = '#050000'; g.beginPath(); g.ellipse(x, ey, 13, 7, 0, 0, 7); g.fill();
      const gr = g.createRadialGradient(x, ey, 0, x, ey, 6); gr.addColorStop(0, '#ffdd66'); gr.addColorStop(0.4, '#ff2a1a'); gr.addColorStop(1, 'rgba(255,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, ey, 6, 0, 7); g.fill();
      g.strokeStyle = 'rgba(20,0,20,0.7)'; g.lineWidth = 1;
      for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x, ey); let px = x, py = ey; for (let s = 0; s < 4; s++) { px += (Math.random() - 0.5) * 12; py += 4 + Math.random() * 6; g.lineTo(px, py); } g.stroke(); }
    }
    const mx = MOUTH[0] * W, my = MOUTH[1] * H;
    g.fillStyle = '#120202'; g.beginPath(); g.moveTo(mx - 30, my - 6); g.quadraticCurveTo(mx, my + 22, mx + 30, my - 6); g.quadraticCurveTo(mx, my + 6, mx - 30, my - 6); g.fill();
    g.fillStyle = '#d8d0b8'; for (let i = -24; i <= 24; i += 6) g.fillRect(mx + i - 1, my - 1 + Math.abs(i) * -0.15 + 2, 3, 4);
    // crescent mark on forehead
    g.strokeStyle = '#ffcc55'; g.lineWidth = 2.5; g.beginPath(); g.arc(W / 2, 24, 8, 0.4, Math.PI - 0.4); g.stroke();
  }
  return c;
}

// Custom face from a photo, framed with zoom/offset so the eyes sit on the guides
export function faceFromImage(img, zoom = 1, ox = 0, oy = 0) {
  const c = newCanvas(), g = c.getContext('2d'), W = FACE_W, H = FACE_H;
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  // crop rectangle with the face-box aspect ratio
  let cw = iw * 0.9 / zoom, ch = cw * H / W;
  if (ch > ih / zoom) { ch = ih / zoom; cw = ch * W / H; }
  const cx = iw / 2 + ox * iw, cy = ih * 0.47 + oy * ih;
  g.fillStyle = '#c99a78'; g.fillRect(0, 0, W, H);
  g.drawImage(img, cx - cw / 2, cy - ch / 2, cw, ch, 0, 0, W, H);
  return c;
}
export function sampleSkin(canvas) {
  const g = canvas.getContext('2d');
  const d = g.getImageData(FACE_W * 0.22, FACE_H * 0.6, 10, 10).data;
  let r = 0, gg = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; }
  const n = d.length / 4; const hx = v => Math.round(v / n).toString(16).padStart(2, '0');
  return '#' + hx(r) + hx(gg) + hx(b);
}

function faceTex(canvas) {
  const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
  return t;
}

// ---------------------------------------------------------------------------
// Low-poly humanoid
// ---------------------------------------------------------------------------
function part(w, h, d, m, segs = 1) {
  const geo = new THREE.BoxGeometry(w, h, d, segs, segs, segs);
  return new THREE.Mesh(geo, m);
}
function taper(rTop, rBot, h, m, sides = 5) {
  const geo = new THREE.CylinderGeometry(rTop, rBot, h, sides, 1);
  return new THREE.Mesh(geo, m);
}

export function makeHuman(o) {
  const s = (o.height || 1.7) / 1.7, kid = o.kid;
  const group = new THREE.Group();
  const body = new THREE.Group(); group.add(body);
  const skinM = mat({ color: o.skin || '#d6a57c' });
  const shirtM = mat({ color: o.shirt || '#9fc1de', map: T.fabric('#ffffff') });
  const pantsM = mat({ color: o.pants || '#1f2a44', map: T.fabric('#ffffff') });
  const shoeM = mat({ color: o.shoes || '#1a1717' });
  const bw = (o.build || 1);

  const hipY = 0.82 * s;
  const legs = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(side * 0.1 * s * bw, hipY, 0);
    const upper = taper(0.075 * s * bw, 0.06 * s, 0.78 * s, o.skirt ? skinM : pantsM);
    upper.position.y = -0.39 * s; pivot.add(upper);
    const shoe = part(0.12 * s, 0.08 * s, 0.24 * s, shoeM); shoe.position.set(0, -0.78 * s, 0.04 * s); pivot.add(shoe);
    body.add(pivot); legs.push(pivot);
  }
  if (o.skirt) { const sk = taper(0.2 * s * bw, 0.3 * s * bw, 0.5 * s, pantsM, 7); sk.position.y = hipY - 0.12 * s; body.add(sk); }
  if (o.robe) { const rb = taper(0.22 * s, 0.34 * s, 1.0 * s, pantsM, 8); rb.position.y = 0.52 * s; body.add(rb); legs.forEach(l => l.visible = false); }

  const torso = taper(0.22 * s * bw, 0.18 * s * bw, 0.6 * s, shirtM, 6);
  torso.scale.z = 0.62; torso.position.y = hipY + 0.3 * s; torso.rotation.y = Math.PI / 6;
  body.add(torso);
  if (o.belly) { const bl = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2 * s, 0), shirtM); bl.position.set(0, hipY + 0.18 * s, 0.07 * s); bl.scale.set(1.1, 0.9, 0.9); body.add(bl); }
  if (o.apron) { const ap = part(0.3 * s, 0.55 * s, 0.02, mat({ color: o.apron })); ap.position.set(0, hipY + 0.12 * s, 0.14 * s); body.add(ap); }
  if (o.collar) { const cl = part(0.3 * s, 0.05 * s, 0.2 * s, mat({ color: o.collar })); cl.position.y = hipY + 0.6 * s; body.add(cl); }

  const arms = [];
  const shoulderY = hipY + 0.56 * s;
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(side * 0.25 * s * bw, shoulderY, 0);
    const sleeve = taper(0.06 * s, 0.05 * s, 0.32 * s, shirtM); sleeve.position.y = -0.16 * s; pivot.add(sleeve);
    const fore = taper(0.05 * s, 0.042 * s, 0.3 * s, o.longSleeve ? shirtM : skinM); fore.position.y = -0.46 * s; pivot.add(fore);
    const hand = part(0.07 * s, 0.09 * s, 0.07 * s, skinM); hand.position.y = -0.64 * s; pivot.add(hand);
    pivot.rotation.z = side * 0.06;
    body.add(pivot); arms.push(pivot);
  }
  const neck = taper(0.05 * s, 0.055 * s, 0.1 * s, skinM); neck.position.y = shoulderY + 0.03 * s; body.add(neck);

  // head: box with painted faces
  const head = new THREE.Group(); head.position.y = shoulderY + 0.07 * s; body.add(head);
  const hw = (kid ? 0.25 : 0.23) * s * (o.headScale || 1), hh = hw * 1.25, hd = hw * 1.08;
  const faceCanvas = o.faceCanvas || paintFace(o);
  const sideCanvas = paintSide(o), backCanvas = paintSide(o, true);
  const frontMat = mat({ map: faceTex(faceCanvas), flat: false });
  const sideMat = mat({ map: faceTex(sideCanvas) });
  const sideMatL = sideMat;
  const topMat = mat({ color: o.hairStyle === 'bald' ? (o.skin || '#d6a57c') : o.hairStyle === 'nun' ? '#1a1a22' : (o.hair || '#141010') });
  const botMat = mat({ color: o.skin || '#d6a57c' });
  const backMat = mat({ map: faceTex(backCanvas) });
  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(hw, hh, hd), [sideMat, sideMatL, topMat, botMat, frontMat, backMat]);
  headMesh.position.y = hh / 2;
  head.add(headMesh);
  // jaw taper to break the box silhouette
  const jaw = part(hw * 0.8, hh * 0.18, hd * 0.8, botMat); jaw.position.y = hh * 0.02; head.add(jaw);
  jaw.visible = false;
  if (o.hairStyle && !['bald', 'nun'].includes(o.hairStyle)) {
    const cap = part(hw * 1.08, hh * 0.22, hd * 1.08, topMat); cap.position.y = hh * 0.96; head.add(cap);
    if (o.hairStyle === 'bangs') { const fringe = part(hw * 1.06, hh * 0.18, 0.03, topMat); fringe.position.set(0, hh * 0.84, hd / 2 + 0.005); fringe.visible = false; head.add(fringe); }
  }
  if (o.hairStyle === 'nun') { const veil = part(hw * 1.3, hh * 1.2, hd * 1.2, mat({ color: '#1a1a22' })); veil.position.set(0, hh * 0.55, -hd * 0.12); head.add(veil); headMesh.position.z = 0.02; }
  if (o.glasses3d) { const gl = part(hw * 1.02, 0.02, 0.02, mat({ color: o.glasses3d })); gl.position.set(0, hh * 0.58, hd / 2 + 0.01); head.add(gl); }
  if (o.necklace) {
    const nk = new THREE.Mesh(new THREE.TorusGeometry(0.075 * s, 0.006, 4, 12), basic({ color: 0xd11a1a }));
    nk.rotation.x = Math.PI / 2 - 0.35; nk.position.set(0, shoulderY + 0.02 * s, 0.015); body.add(nk);
    group.userData.necklace = nk;
  }
  if (o.backpack) { const bp = part(0.3 * s, 0.38 * s, 0.14 * s, mat({ color: o.backpack })); bp.position.set(0, hipY + 0.34 * s, -0.17 * s); body.add(bp); }

  group.traverse(m => { if (m.isMesh) m.userData.human = true; });

  let phase = Math.random() * 10, breath = Math.random() * 10;
  const h = {
    group, body, head, headMesh, arms, legs, torso, frontMat, height: o.height || 1.7,
    pose: null, // custom pose override fn(t)
    setFace(canvas) {
      const old = frontMat.map; frontMat.map = faceTex(canvas); frontMat.needsUpdate = true; old && old.dispose();
    },
    update(dt, speed, headYaw = 0) {
      breath += dt;
      if (h.pose) { h.pose(dt, breath); return; }
      if (speed > 0.01) phase += dt * speed * 3.4;
      const amp = speed > 0.01 ? Math.min(0.7, 0.25 + speed * 0.12) : 0;
      const sw = Math.sin(phase) * amp;
      legs[0].rotation.x = sw; legs[1].rotation.x = -sw;
      arms[0].rotation.x = -sw * 0.8; arms[1].rotation.x = sw * 0.8;
      body.position.y = speed > 0.01 ? Math.abs(Math.cos(phase)) * 0.03 : 0;
      torso.scale.y = 1 + Math.sin(breath * 2) * 0.012;
      head.rotation.y += (headYaw - head.rotation.y) * Math.min(1, dt * 5);
      head.rotation.x *= 0.9;
    },
    wave(on) { arms[1].rotation.z = on ? 2.6 : 0.06; },
  };
  return h;
}

// ---------------------------------------------------------------------------
// Cast
// ---------------------------------------------------------------------------
export const LOOKS = {
  eric: { kid: true, height: 1.38, skin: '#d2a07a', hair: '#0e0b0a', hairStyle: 'bangs', shirt: '#a9c6e3', pants: '#1f2a44', iris: '#24160f', lips: '#b36d62', necklace: true, eyeH: 4, build: 1.08, headScale: 1.05, backpack: '#2b4b7a' },
  carlos: { kid: true, height: 1.48, skin: '#c48e66', hair: '#1b130e', hairStyle: 'short', shirt: '#a9c6e3', pants: '#1f2a44', iris: '#3a2414' },
  mom: { height: 1.62, skin: '#c99870', hair: '#2a1a12', hairStyle: 'long', shirt: '#7e3b4a', pants: '#2b2b33', lips: '#a8505a', longSleeve: true },
  dad: { height: 1.76, skin: '#bf8a62', hair: '#15100c', hairStyle: 'short', shirt: '#3b5b3a', pants: '#3a3228', stubble: true, mustache: true, build: 1.12, belly: true },
  bautista: { height: 1.72, skin: '#c9966c', hair: '#1a1a1a', hairStyle: 'bald', shirt: '#e9e4d6', pants: '#4a4538', mustache: true, glasses: '#222', glasses3d: '#222', wrinkles: true, collar: '#8a2a2a', longSleeve: true },
  agnes: { height: 1.6, skin: '#e0b89a', hairStyle: 'nun', shirt: '#1a1a22', pants: '#1a1a22', robe: true, wrinkles: true, glasses: '#7a6a50', lips: '#b98a80', longSleeve: true },
  gloria: { height: 1.58, skin: '#a8714c', hair: '#3a2a22', hairStyle: 'bun', shirt: '#e8e2d2', pants: '#3a4a5a', apron: '#d8d8c8', build: 1.25, belly: true, lips: '#9a4a4a' },
  jaden: { kid: true, height: 1.5, skin: '#8a5a3c', hair: '#120c08', hairStyle: 'short', shirt: '#a9c6e3', pants: '#1f2a44' },
};
export function randomStudent(i) {
  const skins = ['#e8c09a', '#c48e66', '#8a5a3c', '#d6a57c', '#6e4630', '#f0cdb0'];
  const hairs = ['#141010', '#3a2616', '#6b4a2a', '#0e0b0a', '#a8742e'];
  return { kid: true, height: 1.35 + (i % 4) * 0.05, skin: skins[i % skins.length], hair: hairs[(i * 3) % hairs.length], hairStyle: i % 3 === 0 ? 'long' : 'short', shirt: '#a9c6e3', pants: i % 3 === 0 ? '#2a3a5a' : '#1f2a44', skirt: i % 3 === 0 };
}

// Eric's face: custom photo (if the player loaded one) or painted default
export function ericFaceCanvas(stage = 0) {
  let base;
  const s = G.settings;
  if (G.customFaceImg) base = faceFromImage(G.customFaceImg, s.faceZoom, s.faceX, s.faceY);
  else base = paintFace(LOOKS.eric);
  return degradeFace(base, stage);
}
export function makeEric(stage = 0) {
  const look = { ...LOOKS.eric, faceCanvas: ericFaceCanvas(stage) };
  if (G.customFaceImg) look.skin = sampleSkin(look.faceCanvas);
  if (stage >= 1) look.necklace = false;
  if (stage >= 2) look.shirt = '#8fa5b8';
  return makeHuman(look);
}

// ---------------------------------------------------------------------------
// MOONKAI — the giant fat moon monkey
// ---------------------------------------------------------------------------
export function makeMoonkai(scale = 1) {
  const g = new THREE.Group();
  const furM = mat({ color: '#6b5048', map: T.fur(), emissive: 0x1a0d0a });
  const skinM = mat({ color: '#b98f7a', emissive: 0x241412 });
  const darkM = mat({ color: '#140808' });
  const eyeM = basic({ color: 0xffe28a });
  const moonM = basic({ color: 0xffd35a });
  const S = scale;

  const body = new THREE.Group(); g.add(body);
  const belly = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7 * S, 1), furM); belly.position.y = 2.1 * S; belly.scale.set(1.15, 1, 1); body.add(belly);
  const tummy = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25 * S, 1), skinM); tummy.position.set(0, 1.95 * S, 0.75 * S); tummy.scale.set(1, 1, 0.6); body.add(tummy);
  const chest = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3 * S, 1), furM); chest.position.y = 3.4 * S; chest.scale.set(1.2, 0.8, 0.95); body.add(chest);
  // glowing belly orb (Eric gets trapped in here during the finale)
  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62 * S, 1), basic({ color: 0xffe9a8, transparent: true, opacity: 0.0 }));
  orb.position.set(0, 2.0 * S, 1.7 * S); body.add(orb);

  const head = new THREE.Group(); head.position.y = 4.35 * S; body.add(head);
  const skull = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95 * S, 1), furM); skull.scale.set(1.1, 0.95, 1); head.add(skull);
  const face = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7 * S, 1), skinM); face.position.set(0, -0.1 * S, 0.45 * S); face.scale.set(1.15, 0.95, 0.7); head.add(face);
  const muzzle = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48 * S, 1), skinM); muzzle.position.set(0, -0.42 * S, 0.72 * S); muzzle.scale.set(1.2, 0.8, 0.8); head.add(muzzle);
  const jaw = new THREE.Group(); jaw.position.set(0, -0.5 * S, 0.5 * S); head.add(jaw);
  const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75 * S, 0.18 * S, 0.5 * S), skinM); jawMesh.position.set(0, -0.12 * S, 0.25 * S); jaw.add(jawMesh);
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.7 * S, 0.1 * S, 0.3 * S), darkM); mouth.position.set(0, -0.48 * S, 0.9 * S); head.add(mouth);
  for (let i = -3; i <= 3; i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(0.035 * S, 0.14 * S, 3), basic({ color: 0xe8dcc0 })); t.rotation.x = Math.PI; t.position.set(i * 0.09 * S, -0.43 * S, 1.02 * S); head.add(t); }
  const eyes = [];
  for (const side of [-1, 1]) {
    const socket = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2 * S, 0), darkM); socket.position.set(side * 0.3 * S, 0.08 * S, 0.83 * S); head.add(socket);
    const eye = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1 * S, 1), eyeM); eye.position.set(side * 0.3 * S, 0.08 * S, 0.97 * S); head.add(eye); eyes.push(eye);
    const ear = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34 * S, 0), skinM); ear.position.set(side * 1.02 * S, 0.05 * S, 0); ear.scale.set(0.5, 1, 1); head.add(ear);
  }
  const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.28 * S, 0.07 * S, 4, 10, Math.PI * 1.25), moonM);
  crescent.position.set(0, 0.62 * S, 0.72 * S); crescent.rotation.set(-0.5, 0, Math.PI * 1.12); head.add(crescent);

  const arms = [];
  for (const side of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(side * 1.45 * S, 3.6 * S, 0); body.add(sh);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * S, 0.32 * S, 2.0 * S, 6), furM); up.position.y = -1.0 * S; sh.add(up);
    const elbow = new THREE.Group(); elbow.position.y = -2.0 * S; sh.add(elbow);
    const lo = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * S, 0.28 * S, 1.8 * S, 6), furM); lo.position.y = -0.9 * S; elbow.add(lo);
    const hand = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45 * S, 0), skinM); hand.position.y = -1.9 * S; hand.scale.set(1, 0.7, 1.2); elbow.add(hand);
    sh.rotation.z = side * 0.25; elbow.rotation.x = -0.3;
    arms.push({ sh, elbow, hand });
  }
  const legs = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(side * 0.9 * S, 1.0 * S, 0); body.add(hip);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.45 * S, 0.35 * S, 1.1 * S, 6), furM); leg.position.y = -0.45 * S; hip.add(leg);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.6 * S, 0.25 * S, 0.9 * S), skinM); foot.position.set(0, -0.95 * S, 0.2 * S); hip.add(foot);
    legs.push(hip);
  }
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.8 * S, 0.12 * S, 4, 10, Math.PI * 1.4), furM); tail.position.set(0, 1.3 * S, -1.6 * S); tail.rotation.y = Math.PI / 2; body.add(tail);

  let t = Math.random() * 10;
  const mk = {
    group: g, body, head, jaw, eyes, crescent, arms, legs, orb, moonM, eyeM,
    mode: 'idle', walk: 0,
    setGlow(k) { moonM.color.setRGB(1, 0.83 + 0.17 * k, 0.35 + 0.6 * k); crescent.scale.setScalar(1 + k * 0.5); },
    update(dt) {
      t += dt;
      body.scale.y = 1 + Math.sin(t * 1.6) * 0.02;
      body.scale.x = body.scale.z = 1 - Math.sin(t * 1.6) * 0.01;
      if (mk.mode === 'idle' || mk.mode === 'walk') {
        const w = mk.mode === 'walk' ? Math.sin(t * 5) : 0;
        legs[0].rotation.x = w * 0.4; legs[1].rotation.x = -w * 0.4;
        arms[0].sh.rotation.x = -w * 0.4 + Math.sin(t) * 0.05; arms[1].sh.rotation.x = w * 0.4 - Math.sin(t) * 0.05;
        body.rotation.z = w * 0.06;
        head.rotation.z = Math.sin(t * 0.7) * 0.08;
      }
      eyes.forEach(e => e.scale.setScalar(1 + Math.sin(t * 9) * 0.08));
    },
  };
  return mk;
}

// 2D jumpscare faces drawn on the overlay canvas
export function drawScare(canvas, kind) {
  const g = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  if (kind === 'eric' || kind === 'eric-soft') {
    const f = ericFaceCanvas(kind === 'eric' ? 3 : 2);
    g.drawImage(f, W * 0.1, 0, W * 0.8, H);
    g.fillStyle = 'rgba(120,0,0,0.25)'; g.fillRect(0, 0, W, H);
  } else { // moonkai face
    const cx = W / 2, cy = H / 2;
    g.fillStyle = '#3a2620'; g.beginPath(); g.arc(cx, cy, W * 0.48, 0, 7); g.fill();
    g.fillStyle = '#b98f7a'; g.beginPath(); g.ellipse(cx, cy + 14, W * 0.36, H * 0.34, 0, 0, 7); g.fill();
    for (const s of [-1, 1]) {
      g.fillStyle = '#000'; g.beginPath(); g.ellipse(cx + s * 44, cy - 20, 30, 24, 0, 0, 7); g.fill();
      const gr = g.createRadialGradient(cx + s * 44, cy - 20, 0, cx + s * 44, cy - 20, 16); gr.addColorStop(0, '#fff'); gr.addColorStop(0.3, '#ffe28a'); gr.addColorStop(1, 'rgba(255,200,0,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(cx + s * 44, cy - 20, 16, 0, 7); g.fill();
    }
    g.fillStyle = '#0a0000'; g.beginPath(); g.ellipse(cx, cy + 62, 76, 44, 0, 0, 7); g.fill();
    g.fillStyle = '#e8dcc0';
    for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(cx + i * 11 - 5, cy + 26); g.lineTo(cx + i * 11 + 5, cy + 26); g.lineTo(cx + i * 11, cy + 46 - Math.abs(i) * 1.5); g.fill(); g.beginPath(); g.moveTo(cx + i * 11 - 5, cy + 100); g.lineTo(cx + i * 11 + 5, cy + 100); g.lineTo(cx + i * 11, cy + 82); g.fill(); }
    g.strokeStyle = '#ffd35a'; g.lineWidth = 8; g.beginPath(); g.arc(cx, cy - 72, 22, 0.4, Math.PI - 0.4); g.stroke();
    g.fillStyle = '#1a0a08'; g.beginPath(); g.ellipse(cx - 10, cy + 8, 6, 9, 0.3, 0, 7); g.ellipse(cx + 10, cy + 8, 6, 9, -0.3, 0, 7); g.fill();
  }
}

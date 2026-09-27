import * as THREE from '../../vendor/three.module.min.js';

// 1u = 19mm. [code, label, width] ; null code = gap
const U = 0.019;
const ROWS = [
  [['Escape', 'Esc'], [null, '', 1], ...'1234'.split('').map(n => ['F' + n, 'F' + n]), [null, '', .5], ...'5678'.split('').map(n => ['F' + n, 'F' + n]), [null, '', .5], ...['9', '10', '11', '12'].map(n => ['F' + n, 'F' + n])],
  [['Backquote', '`'], ...'1234567890'.split('').map(n => ['Digit' + n, n]), ['Minus', '-'], ['Equal', '='], ['Backspace', '←Bksp', 2]],
  [['Tab', 'Tab', 1.5], ...'QWERTYUIOP'.split('').map(k => ['Key' + k, k]), ['BracketLeft', '['], ['BracketRight', ']'], ['Backslash', '\\', 1.5]],
  [['CapsLock', 'Caps', 1.75], ...'ASDFGHJKL'.split('').map(k => ['Key' + k, k]), ['Semicolon', ';'], ['Quote', "'"], ['Enter', 'Enter', 2.25]],
  [['ShiftLeft', 'Shift', 2.25], ...'ZXCVBNM'.split('').map(k => ['Key' + k, k]), ['Comma', ','], ['Period', '.'], ['Slash', '/'], ['ShiftRight', 'Shift', 2.75]],
  [['ControlLeft', 'Ctrl', 1.25], ['MetaLeft', '◆', 1.25], ['AltLeft', 'Alt', 1.25], ['Space', '', 6.25], ['AltRight', 'Alt', 1.25], ['MetaRight', '◆', 1.25], ['ContextMenu', '≡', 1.25], ['ControlRight', 'Ctrl', 1.25]],
];
const NAV = [ // x offset in u, row index
  ['Insert', 'Ins', 15.5, 1], ['Home', 'Home', 16.5, 1], ['PageUp', 'PgUp', 17.5, 1],
  ['Delete', 'Del', 15.5, 2], ['End', 'End', 16.5, 2], ['PageDown', 'PgDn', 17.5, 2],
  ['ArrowUp', '↑', 16.5, 4], ['ArrowLeft', '←', 15.5, 5], ['ArrowDown', '↓', 16.5, 5], ['ArrowRight', '→', 17.5, 5],
  ['PrintScreen', 'Prt', 15.5, 0], ['ScrollLock', 'Scr', 16.5, 0], ['Pause', 'Brk', 17.5, 0],
];
const DARK = /Escape|Backspace|Tab|Caps|Enter|Shift|Control|Meta|Alt|Context|Arrow|Insert|Home|Page|Delete|End|Print|Scroll|Pause|^F\d/;

function legend(label, dark) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = dark ? '#e8e4da' : '#3a3833';
  const short = label.length <= 2;
  g.font = `${short ? 'bold 30' : 'bold 17'}px Arial, sans-serif`;
  g.textBaseline = 'top';
  g.fillText(label, short ? 10 : 6, short ? 8 : 10);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export class Keyboard3D {
  constructor(parent) {
    this.group = new THREE.Group(); parent.add(this.group);
    this.keys = {}; this.caps = [];
    const beige = new THREE.MeshStandardMaterial({ color: 0xe0d8c3, roughness: 0.55 });
    const grey = new THREE.MeshStandardMaterial({ color: 0x9a968b, roughness: 0.55 });
    const capGeo = new THREE.CylinderGeometry(0.0125 / Math.SQRT2 * 1.0, 0.0178 / Math.SQRT2, 0.009, 4, 1);
    capGeo.rotateY(Math.PI / 4); capGeo.translate(0, 0.0045, 0);
    const W = 18.5 * U, D = 6.25 * U;
    const add = (code, label, x, row, w = 1) => {
      const g = new THREE.Group();
      const dark = DARK.test(code);
      const cap = new THREE.Mesh(capGeo, dark ? grey : beige);
      cap.scale.x = (w * U - 0.0012) / 0.0178; cap.castShadow = true; cap.receiveShadow = true;
      g.add(cap);
      if (label) {
        const lw = 0.0125;
        const lm = new THREE.Mesh(new THREE.PlaneGeometry(lw, lw), new THREE.MeshStandardMaterial({ map: legend(label, dark), transparent: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 }));
        lm.rotation.x = -Math.PI / 2; lm.position.set(w > 1.3 ? -(w * U) / 2 + lw / 2 + 0.003 : 0, 0.0092, 0);
        g.add(lm);
      }
      const z = row === 0 ? 0 : row + 0.25;
      g.position.set((x + w / 2) * U - W / 2, 0.012, z * U - D / 2 + U / 2);
      this.group.add(g);
      this.keys[code] = { g, t: 0, y0: g.position.y };
      if (code === 'ShiftLeft' || code === 'ControlLeft' || code === 'AltLeft') this.keys[code.replace('Left', '')] = this.keys[code];
    };
    ROWS.forEach((row, r) => { let x = 0; for (const [code, label, w = 1] of row) { if (code) add(code, label, x, r, w); x += w; } });
    for (const [code, label, x, r] of NAV) add(code, label, x, r);
    // case
    const base = new THREE.Mesh(new THREE.BoxGeometry(W + 0.03, 0.02, D + 0.035), new THREE.MeshStandardMaterial({ color: 0xd6ceb8, roughness: 0.6 }));
    base.position.y = 0.006; base.castShadow = base.receiveShadow = true; this.group.add(base);
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.002, 0.003), new THREE.MeshBasicMaterial({ color: 0x22ff44 }));
    led.position.set(W / 2 - 0.02, 0.017, -D / 2 - 0.008); this.group.add(led);
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.3), new THREE.MeshStandardMaterial({ color: 0xcfc6ae }));
    cable.rotation.x = Math.PI / 2; cable.position.set(0, 0.008, -D / 2 - 0.15); this.group.add(cable);
    this.group.rotation.x = 0.07;
  }
  press(code, down) {
    const k = this.keys[code]; if (!k) return;
    k.down = down;
  }
  update(dt) {
    for (const code in this.keys) {
      const k = this.keys[code];
      const target = k.down ? -0.0038 : 0;
      k.t += (target - k.t) * Math.min(1, dt * (k.down ? 60 : 28));
      k.g.position.y = k.y0 + k.t;
    }
  }
}

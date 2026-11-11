'use strict';
// Boot: wait for a first click (browsers need one before audio can start), then show the title.
(function () {
  const start = document.querySelector('#start');
  AHAudio.setVol('music', AH.cfg.music); AHAudio.setVol('sfx', AH.cfg.sfx);
  AH.scene.custom = AHArt.CG.title;
  let begun = false;
  const go = () => { if (begun) return; begun = true; AHAudio.init(); AHAudio.setVol('music', AH.cfg.music); AHAudio.setVol('sfx', AH.cfg.sfx); AHAudio.sfx('confirm'); start.classList.add('hidden'); AH.hooks.toTitle(); };
  start.addEventListener('click', go); window.addEventListener('keydown', go, { once: true });
})();

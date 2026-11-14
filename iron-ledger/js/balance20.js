// 2.0 balance: the opening years of the war belong to Germany, as they did. These fade by 1942.
'use strict';
Object.assign(SPIRITS, {
  luftwaffe_edge: ['The Luftwaffe', 'The most modern air force in the world, built for one kind of war.', { air: 0.3, cas: 0.2 }],
  blitz_edge: ['Auftragstaktik', 'Officers trained to act on their own initiative.', { atk: 0.06, org: 0.05 }],
  french_air_crisis: ['Armée de l\'Air in Crisis', 'Nationalised factories that deliver half their quota, of aircraft that are already obsolete.', { air: -0.3, mil_out: -0.05 }],
  bef_unready: ['A Small Professional Army', 'Britain has a navy and an empire; its field army is six divisions.', { atk: -0.06, org: -0.04, manpower: -0.1 }]
});
{ const _ng = newGame; newGame = function (...a) { const r = _ng(...a); const add = (t, s, days) => { if (ok(t)) addSpirit(C(t), s, days); };
  add('GER', 'luftwaffe_edge', 365 * 6); add('GER', 'blitz_edge', 365 * 6); add('FRA', 'french_air_crisis', 365 * 4.5); add('ENG', 'bef_unready', 365 * 5); return r; }; }

// ── Sound ────────────────────────────────────────────────────────────────────
// A tiny guitar-ish synthesizer (Web Audio, no samples) so every interval,
// scale, chord and progression can be heard. Buttons are made with playBtn()
// and handled by one document-level click listener at the bottom.
//
// Play specs (JSON in the button's data-play):
//   {mode:'note',     notes:['A']}
//   {mode:'interval', notes:['C'], semis:4}            melodic, then together
//   {mode:'scale',    notes:['A','B','C#',…], drone?}   up to the octave
//   {mode:'chord',    notes:['C','E','G'], arp?}       strummed (or arpeggiated)
//   {mode:'prog',     steps:[['C','E','G'], …], beat?} chords one after another

let AUDIO = null;      // {ctx, out}
let voices = [];       // nodes of the sound currently playing, for stop()

function audioOut() {
  if (!AUDIO) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx(), comp = ctx.createDynamicsCompressor(), out = ctx.createGain();
    out.gain.value = 0.5;
    out.connect(comp); comp.connect(ctx.destination);
    AUDIO = {ctx, out};
  }
  if (AUDIO.ctx.state === 'suspended') AUDIO.ctx.resume();
  return AUDIO;
}

function stopSound() {
  voices.forEach(n => { try { n.stop(); } catch (e) {} });
  voices = [];
}

// One plucked note: triangle + quiet octave sine through a closing low-pass
function pluck(midi, t, dur, gain = 0.3) {
  const {ctx, out} = AUDIO, f = 440 * Math.pow(2, (midi - 69) / 12);
  const g = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(Math.min(6000, f * 8), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.5), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  [['triangle', 1, 1], ['sine', 2, 0.25]].forEach(([type, mult, level]) => {
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = type; o.frequency.value = f * mult; og.gain.value = level;
    o.connect(og); og.connect(lp);
    o.start(t); o.stop(t + dur + 0.05);
    voices.push(o);
  });
  lp.connect(g); g.connect(out);
}

// MIDI number of a spelled note in a given octave (C4 = 60); B# and Cb cross octaves correctly
function noteMidi(name, octave) {
  const n = parseNote(name);
  return 12 * (octave + 1) + LETTER_PC[n.letter] + n.acc;
}

// Stack notes upwards from the first one: each note goes above the previous
function voiceUp(names, octave = 3) {
  const out = [];
  names.forEach((n, i) => {
    let m = noteMidi(n, octave);
    if (i > 0) while (m <= out[i - 1]) m += 12;
    out.push(m);
  });
  return out;
}

function playSpec(spec) {
  if (!audioOut()) return;
  stopSound();
  const t0 = AUDIO.ctx.currentTime + 0.05;
  const strum = (midis, t, dur) => midis.forEach((m, i) => pluck(m, t + i * 0.03, dur, 0.32 / Math.sqrt(midis.length)));
  switch (spec.mode) {
    case 'note':
      pluck(noteMidi(spec.notes[0], 3), t0, 1.6);
      break;
    case 'interval': {
      const a = noteMidi(spec.notes[0], 3), b = a + spec.semis;
      pluck(a, t0, 0.9); pluck(b, t0 + 0.6, 0.9);
      strum([a, b], t0 + 1.4, 1.6);
      break;
    }
    case 'scale': {
      const ms = voiceUp([...spec.notes, spec.notes[0]], spec.octave || 3), step = 0.32;
      if (spec.drone) pluck(ms[0] - 12, t0, step * ms.length + 1.2, 0.18);
      ms.forEach((m, i) => pluck(m, t0 + i * step, 0.7));
      break;
    }
    case 'chord': {
      const ms = voiceUp(spec.notes, 3);
      if (spec.arp) ms.forEach((m, i) => pluck(m, t0 + i * 0.28, 1.2));
      else strum(ms, t0, 2.2);
      break;
    }
    case 'prog': {
      const beat = spec.beat || 1.1;
      spec.steps.forEach((notes, i) => strum(voiceUp(notes, 3), t0 + i * beat, beat + 0.4));
      break;
    }
  }
}

// ▶ button. label is optional text after the triangle.
function playBtn(spec, label = '') {
  return `<button type="button" class="play" data-play="${encodeURIComponent(JSON.stringify(spec))}" title="Listen">▶${label ? ' ' + label : ''}</button>`;
}

document.addEventListener('click', e => {
  const b = e.target.closest('.play');
  if (b) playSpec(JSON.parse(decodeURIComponent(b.dataset.play)));
});

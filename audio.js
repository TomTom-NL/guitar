// ── Sound ────────────────────────────────────────────────────────────────────
// Plucked-string synthesis (Karplus–Strong) through a small guitar-body filter,
// so every interval, scale, chord and progression can be heard without samples.
// Chords are played as the real guitar voicing of their shape (every string, at
// its actual pitch), strummed low to high. Buttons are made with playBtn() and
// handled by one document-level click listener; clicking a playing button stops it.
//
// Play specs (JSON in the button's data-play):
//   {mode:'note',     notes:['A']}
//   {mode:'interval', notes:['C'], semis:4}             melodic, then together
//   {mode:'scale',    notes:['A','B','C#',…], drone?}    up to the octave
//   {mode:'chord',    notes:['C','E','G'] | midis:[…], arp?}
//   {mode:'prog',     steps:[['C','E','G'] | [48,52,…], …], beat?}
//   {mode:'shuffle',  root:'A', style:'boogie'|'strum', bpm?}   12-bar blues shuffle
//   {mode:'run',      root:'A', scale:'minorPent'|'major'|'mode:dorian'…, pos:1, bpm?, drone?}
//                     a scale position up across all strings and back down; the
//                     matching fretboard dots light up as they sound

const SR_FALLBACK = 44100;
let AUDIO = null;          // {ctx, out}
let voices = [];           // sources currently scheduled, for stopSound()
let playing = null;        // {btn, until}
let litTimers = [];        // pending fretboard highlights for a scale run
const ksCache = new Map(); // "midi" → AudioBuffer

// Guitar-body colour: low resonances, gentle top roll-off, then a compressor.
// Returns the node notes connect to.
function buildChain(ctx) {
    const body1 = ctx.createBiquadFilter(), body2 = ctx.createBiquadFilter(), air = ctx.createBiquadFilter();
    body1.type = 'peaking'; body1.frequency.value = 110; body1.Q.value = 1.2; body1.gain.value = 4;
    body2.type = 'peaking'; body2.frequency.value = 230; body2.Q.value = 1.4; body2.gain.value = 3;
    air.type = 'lowpass'; air.frequency.value = 5200; air.Q.value = 0.5;
    const comp = ctx.createDynamicsCompressor(), out = ctx.createGain();
    out.gain.value = 0.9;
    out.connect(body1); body1.connect(body2); body2.connect(air); air.connect(comp); comp.connect(ctx.destination);
    return out;
}

function audioOut() {
  if (!AUDIO) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    AUDIO = {ctx, out: buildChain(ctx)};
  }
  if (AUDIO.ctx.state === 'suspended' && AUDIO.ctx.resume) AUDIO.ctx.resume().catch(() => {});
  return AUDIO;
}

function stopSound() {
  voices.forEach(n => { try { n.stop(); } catch (e) {} });
  voices = [];
  litTimers.forEach(clearTimeout); litTimers = [];
  document.querySelectorAll('.lit').forEach(el => el.classList.remove('lit'));
  if (playing) { playing.btn && playing.btn.classList.remove('is-playing'); playing = null; }
}

// Karplus–Strong string: a burst of filtered noise circulating in a delay line one
// period long; the two-point average damps high harmonics like a real string.
// A first-order all-pass keeps the pitch exact (Jaffe & Smith).
function ksBuffer(midi) {
  if (ksCache.has(midi)) return ksCache.get(midi);
  const ctx = AUDIO.ctx, sr = ctx.sampleRate || SR_FALLBACK;
  const f = 440 * Math.pow(2, (midi - 69) / 12);
  const seconds = Math.max(1.6, Math.min(4.5, 4.5 - (midi - 40) * 0.07));   // low strings ring longer
  const len = Math.floor(sr * seconds), out = new Float32Array(len);
  const L = sr / f - 0.5;
  let N = Math.floor(L), frac = L - N;
  if (frac < 0.1) { N -= 1; frac += 1; }
  const C = (1 - frac) / (1 + frac);
  const rho = Math.pow(0.001, 1 / (f * seconds * 1.3));                       // per-period loss
  // excitation: noise, softened (pick nearer the middle of the string = warmer)
  let prev = 0;
  for (let i = 0; i <= N; i++) { const w = Math.random() * 2 - 1; prev = 0.55 * w + 0.45 * prev; out[i] = prev; }
  let apX = 0, apY = 0;
  for (let n = N + 1; n < len; n++) {
    const x = rho * 0.5 * (out[n - N] + out[n - N - 1]);
    const y = C * x + apX - C * apY;
    apX = x; apY = y;
    out[n] = y;
  }
  // remove DC and normalise
  let mean = 0, peak = 0;
  for (let i = 0; i < len; i++) mean += out[i];
  mean /= len;
  for (let i = 0; i < len; i++) { out[i] -= mean; peak = Math.max(peak, Math.abs(out[i])); }
  const buf = ctx.createBuffer(1, len, sr), ch = buf.getChannelData(0), k = peak ? 0.9 / peak : 1;
  for (let i = 0; i < len; i++) ch[i] = out[i] * k;
  ksCache.set(midi, buf);
  return buf;
}

// One plucked note. opts.mute = palm-muted (short and dark)
function pluck(midi, t, dur, gain = 0.4, opts = {}) {
  const {ctx, out} = AUDIO;
  const src = ctx.createBufferSource(), g = ctx.createGain();
  src.buffer = ksBuffer(midi);
  const ring = Math.min(dur, src.buffer.duration);
  g.gain.setValueAtTime(gain, t);
  g.gain.setValueAtTime(gain, t + Math.max(0.01, ring - 0.08));
  g.gain.exponentialRampToValueAtTime(0.0001, t + ring);
  if (opts.mute) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.7;
    src.connect(lp); lp.connect(g);
  } else src.connect(g);
  g.connect(out);
  src.start(t); src.stop(t + ring + 0.02);
  voices.push(src);
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

// A chord as the guitar plays it: the shape's real voicing when the chord is a
// known type with a shape, otherwise the notes stacked upwards
function chordMidis(chord) {
  if (typeof chord[0] === 'number') return chord;
  const type = identify(chord), v = type && chordVoicing(chord[0], type);
  return v || voiceUp(chord, 3);
}

// Strum: down = low to high, up = high to low (and usually only the top strings)
function strum(midis, t, dur, opts = {}) {
  const order = opts.up ? midis.slice().reverse() : midis, gap = opts.gap ?? 0.016;
  const level = (opts.level ?? 0.55) / Math.sqrt(midis.length);
  order.forEach((m, i) => pluck(m, t + i * gap, dur, level, opts));
}

// 12-bar blues in swung eighths: I I I I | IV IV I I | V IV I V
function playShuffle(spec, t0) {
  const bpm = spec.bpm || 96, beat = 60 / bpm, long = beat * 2 / 3, short = beat / 3;
  const bars = ['1','1','1','1','4','4','1','1','5','4','1','5'].map(d => spellDeg(spec.root, d));
  let t = t0;
  bars.forEach(root => {
    if (spec.style === 'strum') {
      const v = chordMidis(chordNotes(root, 'dom7'));
      for (let b = 0; b < 4; b++) {
        strum(v, t, long + 0.05, {level: 0.5});                                     // down on the beat
        strum(v.slice(-4), t + long, short + 0.25, {up: true, level: 0.28, gap: 0.012}); // light upstroke on the "a"
        t += beat;
      }
    } else {
      // boogie riff on the low strings: root + 5th, 5th, 6th, 6th, ♭7th, ♭7th, 6th, 6th
      const r = 40 + (pcOf(root) - 4 + 12) % 12;
      [7, 7, 9, 9, 10, 10, 9, 9].forEach((top, i) => {
        const at = t + Math.floor(i / 2) * beat + (i % 2 ? long : 0);
        const d = (i % 2 ? short : long) * 0.95;
        pluck(r, at, d, 0.42, {mute: true});
        pluck(r + top, at + 0.008, d, 0.34, {mute: true});
      });
      t += 4 * beat;
    }
  });
  // final chord
  strum(chordMidis(chordNotes(spec.root, 'dom7')), t, 2.4);
  return t + 2.4;
}

// Light up fretboard dot (string s, fret f) inside board at time t (audio clock)
function lightAt(board, s, f, t, dur) {
  if (!board) return;
  const dot = board.querySelector(`[data-s="${s}"][data-f="${f}"]`);
  if (!dot) return;
  const now = AUDIO.ctx.currentTime;
  litTimers.push(setTimeout(() => dot.classList.add('lit'), Math.max(0, (t - now) * 1000)));
  litTimers.push(setTimeout(() => dot.classList.remove('lit'), Math.max(0, (t + dur - now) * 1000)));
}

// The fretboard that belongs to a play button (same explorer output or page section)
function boardFor(btn) {
  const scope = btn && btn.closest('.ex-out, .player-scope, .key-section');
  return scope ? scope.querySelector('.fb-wrap') : null;
}

function playSpec(spec, btn) {
  if (!audioOut()) return 0;
  stopSound();
  const t0 = AUDIO.ctx.currentTime + 0.06;
  let end = t0;
  switch (spec.mode) {
    case 'note':
      pluck(noteMidi(spec.notes[0], 3), t0, 2); end = t0 + 2;
      break;
    case 'interval': {
      const a = noteMidi(spec.notes[0], 3), b = a + spec.semis;
      pluck(a, t0, 1.2); pluck(b, t0 + 0.7, 1.2);
      pluck(a, t0 + 1.6, 2, 0.25); pluck(b, t0 + 1.6, 2, 0.25);
      end = t0 + 3.6;
      break;
    }
    case 'scale': {
      const ms = voiceUp([...spec.notes, spec.notes[0]], spec.octave || 3), step = 0.34;
      if (spec.drone) for (let k = 0; k * 1.8 < step * ms.length + 0.6; k++) pluck(ms[0] - 12, t0 + k * 1.8, 2.4, 0.18);
      ms.forEach((m, i) => pluck(m, t0 + i * step, 1.1));
      end = t0 + step * ms.length + 1.2;
      break;
    }
    case 'chord': {
      const ms = spec.midis || chordMidis(spec.notes);
      if (spec.arp) { ms.forEach((m, i) => pluck(m, t0 + i * 0.3, 2.2, 0.3)); end = t0 + ms.length * 0.3 + 1.8; }
      else { strum(ms, t0, 3); end = t0 + 3; }
      break;
    }
    case 'prog': {
      const beat = spec.beat || 1.2;
      spec.steps.forEach((c, i) => strum(chordMidis(c), t0 + i * beat, beat + 0.6));
      end = t0 + spec.steps.length * beat + 0.6;
      break;
    }
    case 'shuffle':
      end = playShuffle(spec, t0);
      break;
    case 'run': {
      const step = 30 / (spec.bpm || 90), run = scaleRun(spec.root, spec.scale, spec.pos), board = boardFor(btn);
      const len = step * run.length + 0.8;
      if (spec.drone) for (let t = 0; t < len; t += 2.2) pluck(40 + (pcOf(spec.root) - 4 + 12) % 12, t0 + t, 2.8, 0.2);
      run.forEach((p, i) => {
        pluck(p.midi, t0 + i * step, Math.max(0.9, step * 2.5), 0.45);
        lightAt(board, p.s, p.f, t0 + i * step, step * 0.95);
      });
      end = t0 + len;
      break;
    }
  }
  return end - AUDIO.ctx.currentTime;
}

// ▶ button. label is optional text after the triangle.
function playBtn(spec, label = '') {
  return `<button type="button" class="play" data-play="${encodeURIComponent(JSON.stringify(spec))}" title="Listen (click again to stop)">▶${label ? ' ' + label : ''}</button>`;
}

document.addEventListener('click', e => {
  const b = e.target.closest('.play');
  if (!b) return;
  if (playing && playing.btn === b) { stopSound(); return; }   // second click = stop
  const secs = playSpec(JSON.parse(decodeURIComponent(b.dataset.play)), b);
  if (!secs) return;
  b.classList.add('is-playing');
  const token = {btn: b};
  playing = token;
  setTimeout(() => { if (playing === token) { b.classList.remove('is-playing'); playing = null; } }, secs * 1000);
});

// ── Clickable notes ──────────────────────────────────────────────────────────
// Any element with data-midi="52" plays that note; data-chord="48 52 55 60 64"
// strums those notes. Taps don't stop a running track, so you can play along.
// Elements that are invisible (opacity 0, e.g. hidden blue-note dots) are ignored.

// Attributes for a tappable note/chord. focus = reachable with Tab + Enter/Space.
function tapNote(midi, label, focus = false) {
  return ` data-midi="${midi}"${focus ? ` role="button" tabindex="0" aria-label="Play ${label}"` : ''}`;
}
function tapChord(midis, label, focus = true) {
  return ` data-chord="${midis.join(' ')}"${focus ? ` role="button" tabindex="0" aria-label="Play ${label} chord"` : ''}`;
}

function isShown(el) {
  for (let e = el; e && e.nodeType === 1; e = e.parentElement) if (getComputedStyle(e).opacity === '0') return false;
  return true;
}

function tap(el) {
  if (!audioOut()) return;
  const t = AUDIO.ctx.currentTime + 0.01;
  if (el.dataset.chord) strum(el.dataset.chord.split(' ').map(Number), t, 2.6);
  else pluck(+el.dataset.midi, t, 1.8, 0.5);
  el.classList.remove('tapped');
  void el.getBoundingClientRect();          // restart the flash animation
  el.classList.add('tapped');
  setTimeout(() => el.classList.remove('tapped'), 450);
}

document.addEventListener('click', e => {
  if (e.target.closest('.play')) return;
  const el = e.target.closest('[data-midi], [data-chord]');
  if (el && isShown(el)) tap(el);
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-midi], [data-chord]')) {
    e.preventDefault();
    tap(e.target);
  }
});

// ── Scale player ─────────────────────────────────────────────────────────────
// A small control set (scale / position / speed) with a ▶ that plays the chosen
// position up and back down while lighting up the fretboard. Used on the Blues
// pages; explorers build their own controls and call runBtn().

const SPEEDS = [['60', 'slow'], ['90', 'medium'], ['130', 'fast']];

function runBtn(root, scale, pos, bpm, opts = {}) {
  const first = scalePosition(root, scale, pos)[0];
  return playBtn({mode: 'run', root, scale, pos: +pos, bpm: +bpm, drone: !!opts.drone},
    opts.label || `play position ${pos} up & down (from ${fmt(noteNameAt(first.s, first.f, root, scale))})`);
}

// Spelled name of the note at a string/fret, using the scale's own spelling
function noteNameAt(s, f, root, scale) {
  return noteAt(s, f, scaleNotes(root, scaleDegs(scale)));
}

function scalePlayer(root, scales, opts = {}) {
  const base = encodeURIComponent(JSON.stringify({root, drone: !!opts.drone}));
  const sel = (key, label, options, value) => `<label class="ctl"><span>${label}</span><select data-player="${key}">${options.map(([v, t]) => `<option value="${v}"${v === value ? ' selected' : ''}>${t}</option>`).join('')}</select></label>`;
  return `<div class="player" data-base="${base}">
    ${sel('scale', 'Scale', scales, scales[0][0])}
    ${sel('pos', 'Position', [1, 2, 3, 4, 5].map(k => [String(k), 'Box ' + k]), '1')}
    ${sel('bpm', 'Speed', SPEEDS, '90')}
    ${runBtn(root, scales[0][0], 1, 90, {drone: opts.drone})}
  </div>`;
}

document.addEventListener('change', e => {
  const sel = e.target.closest('[data-player]');
  if (!sel) return;
  const pl = sel.closest('.player'), base = JSON.parse(decodeURIComponent(pl.dataset.base));
  const v = k => pl.querySelector(`[data-player="${k}"]`).value;
  const old = pl.querySelector('.play');
  if (playing && playing.btn === old) stopSound();
  old.outerHTML = runBtn(base.root, v('scale'), +v('pos'), +v('bpm'), {drone: base.drone});
  prettifyAccidentals(pl);
});

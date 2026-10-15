// ── Theory engine ────────────────────────────────────────────────────────────
// Spells notes, intervals, scales, chords and keys for any root, using the rule
// that each scale step gets the next letter (so F major has Bb, not A#).
// Note names use '#' and 'b' internally; fmt() turns them into ♯ / ♭ for display.

const LETTERS = ['C','D','E','F','G','A','B'];
const LETTER_PC = {C:0, D:2, E:4, F:5, G:7, A:9, B:11};
const MAJOR_STEPS = [0,2,4,5,7,9,11];  // semitones of degrees 1–7 in a major scale

function parseNote(name) {
  const m = /^([A-G])(#{1,2}|b{1,2})?$/.exec(name);
  if (!m) throw new Error('Bad note name: ' + name);
  const acc = m[2] ? (m[2][0] === '#' ? m[2].length : -m[2].length) : 0;
  return {letter: m[1], acc};
}

function pcOf(name) {
  const n = parseNote(name);
  return ((LETTER_PC[n.letter] + n.acc) % 12 + 12) % 12;
}

function noteName(letter, acc) {
  return letter + (acc > 0 ? '#'.repeat(acc) : 'b'.repeat(-acc));
}

// The note `steps` letters and `semis` semitones above root, spelled correctly
function spellUp(root, steps, semis) {
  const letter = LETTERS[(LETTERS.indexOf(parseNote(root).letter) + steps) % 7];
  let acc = ((pcOf(root) + semis - LETTER_PC[letter]) % 12 + 12) % 12;
  if (acc > 6) acc -= 12;
  return noteName(letter, acc);
}

// Pretty-print a note name: Bb → B♭, F# → F♯
function fmt(name) {
  return name[0] + name.slice(1).replace(/#/g, '♯').replace(/b/g, '♭');
}

// Both names of a pitch class, e.g. 1 → "C♯/D♭"
const PC_NAMES = ['C','C#/Db','D','D#/Eb','E','F','F#/Gb','G','G#/Ab','A','A#/Bb','B'];
function pcLabel(pc) { return PC_NAMES[pc].split('/').map(fmt).join('/'); }

// ── Degrees and intervals ─────────────────────────────────────────────────────
// A degree is written relative to the major scale: '1', 'b3', '#4', 'bb7', '9', '13'

function parseDeg(deg) {
  const m = /^(#{1,2}|b{1,2})?(\d+)$/.exec(deg);
  const num = +m[2], acc = m[1] ? (m[1][0] === '#' ? m[1].length : -m[1].length) : 0;
  const steps = num - 1;
  return {num, steps, semis: MAJOR_STEPS[steps % 7] + 12 * Math.floor(steps / 7) + acc};
}

function spellDeg(root, deg) {
  const d = parseDeg(deg);
  return spellUp(root, d.steps, d.semis);
}

// Simple intervals (within an octave): semitones, letter steps, short name, full name
const INTERVALS = [
  {sh:'P1', s:0,  st:0, deg:'1',   name:'Perfect unison',  feel:'same note',                 song:''},
  {sh:'m2', s:1,  st:1, deg:'b2',  name:'Minor 2nd',       feel:'sharp clash, tense',        song:'Jaws theme'},
  {sh:'M2', s:2,  st:1, deg:'2',   name:'Major 2nd',       feel:'mild, stepwise',            song:'Happy Birthday'},
  {sh:'m3', s:3,  st:2, deg:'b3',  name:'Minor 3rd',       feel:'sad, dark',                 song:'Greensleeves'},
  {sh:'M3', s:4,  st:2, deg:'3',   name:'Major 3rd',       feel:'bright, happy',             song:'When the Saints Go Marching In'},
  {sh:'P4', s:5,  st:3, deg:'4',   name:'Perfect 4th',     feel:'open, wants to resolve',    song:'Here Comes the Bride'},
  {sh:'A4', s:6,  st:3, deg:'#4',  name:'Augmented 4th',   feel:'tritone: unstable, eerie',  song:'The Simpsons theme'},
  {sh:'d5', s:6,  st:4, deg:'b5',  name:'Diminished 5th',  feel:'tritone: unstable, eerie',  song:''},
  {sh:'P5', s:7,  st:4, deg:'5',   name:'Perfect 5th',     feel:'strong, hollow, stable',    song:'Twinkle Twinkle Little Star'},
  {sh:'A5', s:8,  st:4, deg:'#5',  name:'Augmented 5th',   feel:'restless, dreamy',          song:''},
  {sh:'m6', s:8,  st:5, deg:'b6',  name:'Minor 6th',       feel:'bittersweet',               song:''},
  {sh:'M6', s:9,  st:5, deg:'6',   name:'Major 6th',       feel:'warm, sweet',               song:'My Bonnie Lies Over the Ocean'},
  {sh:'m7', s:10, st:6, deg:'b7',  name:'Minor 7th',       feel:'bluesy, unresolved',        song:'Star Trek (original theme)'},
  {sh:'M7', s:11, st:6, deg:'7',   name:'Major 7th',       feel:'jazzy, yearning',           song:''},
  {sh:'P8', s:12, st:7, deg:'8',   name:'Perfect octave',  feel:'same note, higher',         song:'Somewhere Over the Rainbow'},
];
// The 13 everyday intervals (one per semitone, tritone shown as A4/d5)
const MAIN_INTERVALS = INTERVALS.filter(i => !['d5','A5'].includes(i.sh));

function intervalAbove(root, sh) {
  const iv = INTERVALS.find(i => i.sh === sh);
  return spellUp(root, iv.st, iv.s);
}

// Name the interval from note a up to note b (within an octave)
function intervalBetween(a, b) {
  const steps = (LETTERS.indexOf(parseNote(b).letter) - LETTERS.indexOf(parseNote(a).letter) + 7) % 7;
  const semis = (pcOf(b) - pcOf(a) + 12) % 12;
  return INTERVALS.find(i => i.st === steps && i.s === semis) || {sh:'?', name:`${steps + 1}th, ${semis} semitones`, s:semis, st:steps};
}

// Inversion: number adds to 9, quality flips (M↔m, A↔d, P stays P)
function invertInterval(sh) {
  const q = sh[0], n = +sh.slice(1);
  const flip = {M:'m', m:'M', P:'P', A:'d', d:'A'}[q];
  return flip + (n === 1 ? 8 : n === 8 ? 1 : 9 - n);
}

// ── Scales and modes ──────────────────────────────────────────────────────────

const SCALES = {
  major:          {name:'Major (Ionian)',   degs:['1','2','3','4','5','6','7']},
  naturalMinor:   {name:'Natural minor',    degs:['1','2','b3','4','5','b6','b7']},
  harmonicMinor:  {name:'Harmonic minor',   degs:['1','2','b3','4','5','b6','7']},
  melodicMinor:   {name:'Melodic minor',    degs:['1','2','b3','4','5','6','7']},
  majorPent:      {name:'Major pentatonic', degs:['1','2','3','5','6']},
  minorPent:      {name:'Minor pentatonic', degs:['1','b3','4','5','b7']},
  blues:          {name:'Blues scale',      degs:['1','b3','4','b5','5','b7']},
  majorBlues:     {name:'Major blues scale', degs:['1','2','b3','3','5','6']},
};

// The 7 modes of the major scale, brightest first is Lydian; listed in rotation order
const MODES = [
  {key:'ionian',     name:'Ionian',     degs:['1','2','3','4','5','6','7'],   char:'',  vs:'major',  chord:'maj7', mood:'bright, settled: the plain major scale'},
  {key:'dorian',     name:'Dorian',     degs:['1','2','b3','4','5','6','b7'], char:'6',  vs:'minor',  chord:'m7',   mood:'minor but hopeful, funky, jazzy'},
  {key:'phrygian',   name:'Phrygian',   degs:['1','b2','b3','4','5','b6','b7'], char:'b2', vs:'minor', chord:'m7',  mood:'dark, Spanish / flamenco, metal'},
  {key:'lydian',     name:'Lydian',     degs:['1','2','3','#4','5','6','7'],  char:'#4', vs:'major',  chord:'maj7', mood:'dreamy, floating, film-score'},
  {key:'mixolydian', name:'Mixolydian', degs:['1','2','3','4','5','6','b7'],  char:'b7', vs:'major',  chord:'7',    mood:'major but bluesy, rock, the sound of a dominant 7th'},
  {key:'aeolian',    name:'Aeolian',    degs:['1','2','b3','4','5','b6','b7'], char:'', vs:'minor', chord:'m7',   mood:'the plain natural minor: sad, serious'},
  {key:'locrian',    name:'Locrian',    degs:['1','b2','b3','4','b5','b6','b7'], char:'b5', vs:'minor', chord:'m7b5', mood:'unstable, rarely used as a home'},
];
const MODE_BRIGHTNESS = ['lydian','ionian','mixolydian','dorian','aeolian','phrygian','locrian'];

function scaleNotes(root, degs) { return degs.map(d => spellDeg(root, d)); }

// ── Keys ──────────────────────────────────────────────────────────────────────

// Major keys in circle-of-fifths order (clockwise from C)
const CIRCLE_MAJOR = ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F'];
const SHARP_ORDER = ['F','C','G','D','A','E','B'];
const FLAT_ORDER  = ['B','E','A','D','G','C','F'];

function majorScale(root) { return scaleNotes(root, SCALES.major.degs); }

// {type:'#'|'b'|'', count, notes:[...]} for a major key
function keySignature(root) {
  const sc = majorScale(root);
  const sharps = sc.filter(n => n.includes('#')), flats = sc.filter(n => n.includes('b'));
  if (sharps.length) return {type:'#', count:sharps.length, notes:SHARP_ORDER.slice(0, sharps.length).map(l => l + '#')};
  if (flats.length)  return {type:'b', count:flats.length,  notes:FLAT_ORDER.slice(0, flats.length).map(l => l + 'b')};
  return {type:'', count:0, notes:[]};
}

function sigText(sig) {
  if (!sig.count) return 'no sharps or flats';
  return `${sig.count} ${sig.type === '#' ? 'sharp' : 'flat'}${sig.count > 1 ? 's' : ''}`;
}

function relativeMinor(majorRoot) { return spellDeg(majorRoot, '6'); }
function relativeMajor(minorRoot) { return spellDeg(minorRoot, 'b3'); }

// Minor-key root names in circle order, matching CIRCLE_MAJOR
const CIRCLE_MINOR = CIRCLE_MAJOR.map(relativeMinor);

// Roots offered in pickers: one common spelling per pitch class
const ROOTS = ['C','C#','Db','D','Eb','E','F','F#','Gb','G','Ab','A','Bb','B'];
const MINOR_ROOTS = ['C','C#','D','D#','Eb','E','F','F#','G','G#','A','Bb','B'];

// ── Chords ────────────────────────────────────────────────────────────────────

const CHORD_TYPES = {
  maj:   {sym:'',        name:'Major',               degs:['1','3','5'],          family:'triad'},
  min:   {sym:'m',       name:'Minor',               degs:['1','b3','5'],         family:'triad'},
  dim:   {sym:'°',       name:'Diminished',          degs:['1','b3','b5'],        family:'triad'},
  aug:   {sym:'+',       name:'Augmented',           degs:['1','3','#5'],         family:'triad'},
  sus2:  {sym:'sus2',    name:'Suspended 2nd',       degs:['1','2','5'],          family:'triad'},
  sus4:  {sym:'sus4',    name:'Suspended 4th',       degs:['1','4','5'],          family:'triad'},
  maj7:  {sym:'maj7',    name:'Major 7th',           degs:['1','3','5','7'],      family:'seventh'},
  dom7:  {sym:'7',       name:'Dominant 7th',        degs:['1','3','5','b7'],     family:'seventh'},
  min7:  {sym:'m7',      name:'Minor 7th',           degs:['1','b3','5','b7'],    family:'seventh'},
  m7b5:  {sym:'ø7',      name:'Half-diminished (m7♭5)', degs:['1','b3','b5','b7'], family:'seventh'},
  dim7:  {sym:'°7',      name:'Diminished 7th',      degs:['1','b3','b5','bb7'],  family:'seventh'},
  mMaj7: {sym:'m(maj7)', name:'Minor-major 7th',     degs:['1','b3','5','7'],     family:'seventh'},
  maj6:  {sym:'6',       name:'Major 6th',           degs:['1','3','5','6'],      family:'sixth'},
  min6:  {sym:'m6',      name:'Minor 6th',           degs:['1','b3','5','6'],     family:'sixth'},
  add9:  {sym:'add9',    name:'Add 9',               degs:['1','3','5','9'],      family:'extended'},
  dom9:  {sym:'9',       name:'Dominant 9th',        degs:['1','3','5','b7','9'], family:'extended'},
  maj9:  {sym:'maj9',    name:'Major 9th',           degs:['1','3','5','7','9'],  family:'extended'},
  min9:  {sym:'m9',      name:'Minor 9th',           degs:['1','b3','5','b7','9'], family:'extended'},
  dom13: {sym:'13',      name:'Dominant 13th',       degs:['1','3','5','b7','9','13'], family:'extended'},
};

function chordNotes(root, type) { return scaleNotes(root, CHORD_TYPES[type].degs); }
function chordName(root, type) { return root + CHORD_TYPES[type].sym; }
function chordLabel(root, type) { return fmt(root) + CHORD_TYPES[type].sym; }

// Identify a stacked chord from the semitone distances of its notes above the root
const SHAPE_TO_TYPE = {
  '4,7':'maj', '3,7':'min', '3,6':'dim', '4,8':'aug',
  '4,7,11':'maj7', '4,7,10':'dom7', '3,7,10':'min7', '3,6,10':'m7b5', '3,6,9':'dim7', '3,7,11':'mMaj7', '4,8,11':'augMaj7',
};
CHORD_TYPES.augMaj7 = {sym:'+maj7', name:'Augmented major 7th', degs:['1','3','#5','7'], family:'seventh'};

function identify(notes) {
  const r = pcOf(notes[0]);
  return SHAPE_TO_TYPE[notes.slice(1).map(n => (pcOf(n) - r + 12) % 12).join(',')];
}

// Roman numeral for a chord on a scale degree (1-based)
const ROMAN = ['I','II','III','IV','V','VI','VII'];
function roman(degree, type) {
  const upper = ['maj','aug','maj7','dom7','augMaj7'].includes(type);
  const base = upper ? ROMAN[degree - 1] : ROMAN[degree - 1].toLowerCase();
  const suffix = {dim:'°', aug:'+', maj7:'maj7', dom7:'7', min7:'7', m7b5:'ø7', dim7:'°7', mMaj7:'(maj7)', augMaj7:'+maj7'}[type] || '';
  return base + suffix;
}

// Chords built on each degree of a 7-note scale: stack every other note
function diatonicChords(scale, sevenths) {
  return scale.map((root, i) => {
    const notes = [0, 2, 4, 6].slice(0, sevenths ? 4 : 3).map(k => scale[(i + k) % 7]);
    const type = identify(notes);
    return {root, type, notes, degree: i + 1, numeral: roman(i + 1, type), name: chordName(root, type), label: chordLabel(root, type)};
  });
}

// Harmonic function of each degree in a major key
const FUNCTION_OF_DEGREE = ['T','S','T','S','D','T','D'];
const FUNCTION_NAMES = {T:'Tonic', S:'Subdominant (pre-dominant)', D:'Dominant'};

// Secondary dominant (V7) of a chord root
function secondaryDominant(targetRoot) { return spellDeg(targetRoot, '5'); }

// ── Fretboard ─────────────────────────────────────────────────────────────────

const TUNING = ['E','A','D','G','B','E'];  // low to high

// Note name at a string/fret, spelled to match a given set of names when possible
function noteAt(string, fret, names) {
  const pc = (OS[string] + fret) % 12;
  const hit = names && names.find(n => pcOf(n) === pc);
  return hit || NN[pc];
}

// ── Playable chord shapes ─────────────────────────────────────────────────────
// Hand-picked shapes win (including the ones from Tom's teacher); otherwise a
// movable E-shape (root on low E) or A-shape (root on A string) is generated.

const SHAPE_OVERRIDES = {
  'C|maj':'x32010', 'D|maj':'xx0232', 'E|maj':'022100', 'G|maj':'320003', 'A|maj':'x02220',
  'F|maj':{frets:'133211', barre:1},
  'D|min':'xx0231', 'E|min':'022000', 'A|min':'x02210',
  'B|dim':'x2343x',
  'C|dom7':'x32310', 'D|dom7':'xx0212', 'E|dom7':'020100', 'G|dom7':'320001', 'A|dom7':'x02020', 'B|dom7':'x21202',
  'F#|dom7':'2x232x',
  'B|m7b5':'x2323x',
  'C|maj7':'x32000', 'D|maj7':'xx0222', 'E|maj7':'021100', 'F|maj7':'xx3210', 'A|maj7':'x02120',
  'A|min7':'x02010', 'D|min7':'xx0211', 'E|min7':'022030',
  'A|sus2':'x02200', 'D|sus2':'xx0230', 'A|sus4':'x02230', 'D|sus4':'xx0233', 'E|sus4':'022200',
  'C|add9':'x32030',
};

// Offsets from the root fret per string (low E → high e), null = muted.
// barre: true = both shapes are barred, 'E' / 'A' = only that shape
const SHAPE_TEMPLATES = {
  maj:   {E:[0,2,2,1,0,0],          A:[null,0,2,2,2,0],    barre:true},
  min:   {E:[0,2,2,0,0,0],          A:[null,0,2,2,1,0],    barre:true},
  dom7:  {E:[0,2,0,1,0,0],          A:[null,0,2,0,2,0],    barre:true},
  min7:  {E:[0,2,0,0,0,0],          A:[null,0,2,0,1,0],    barre:true},
  maj7:  {E:[0,null,1,1,0,null],    A:[null,0,2,1,2,0],    barre:'A'},
  m7b5:  {E:[0,null,0,0,-1,null],   A:[null,0,1,0,1,null]},
  dim7:  {E:[0,null,-1,0,-1,null],  A:[null,0,1,-1,1,null]},
  dim:   {E:[0,1,2,0,null,null],    A:[null,0,1,2,1,null]},
  aug:   {A:[null,0,3,2,2,null]},
  sus2:  {A:[null,0,2,2,0,0],       barre:true},
  sus4:  {E:[0,2,2,2,0,0],          A:[null,0,2,2,3,0],    barre:true},
  maj6:  {E:[0,2,2,1,2,0],          A:[null,0,2,2,2,2],    barre:true},
  min6:  {E:[0,2,2,0,2,0],          A:[null,0,2,2,1,2],    barre:true},
  dom9:  {A:[null,0,-1,0,0,null]},
  min9:  {A:[null,0,-2,0,0,null]},
};

// Build a chordSVG config from per-string frets (null = muted)
function shapeFromFrets(frets, barreFret, barreFrom) {
  const used = frets.filter(f => f !== null && f > 0);
  const max = used.length ? Math.max(...used) : 0;
  const sf = max <= 4 ? 0 : Math.min(...used);
  const br = barreFret ? {f: barreFret, a: barreFrom, b: 5} : null;
  const dots = [];
  frets.forEach((f, s) => {
    if (f === null || f === 0) return;
    if (br && f === br.f && s >= br.a) return;
    dots.push({s, f});
  });
  const code = frets.some(f => f > 9) ? frets.map(f => f === null ? 'x' : f).join('-') : frets.map(f => f === null ? 'x' : f).join('');
  return {sf, mu: frets.flatMap((f, s) => f === null ? [s] : []), dots, br, code};
}

function parseFrets(code) { return [...code].map(c => c === 'x' ? null : +c); }

function chordShape(root, type) {
  const ov = SHAPE_OVERRIDES[root + '|' + type];
  if (ov) {
    const o = typeof ov === 'string' ? {frets: ov} : ov;
    const frets = parseFrets(o.frets);
    const sh = shapeFromFrets(frets, o.barre, o.barre ? frets.findIndex(f => f === o.barre) : 0);
    return {...sh, lbl: (sh.br ? `barre ${sh.br.f}fr · ` : '') + sh.code};
  }
  const t = SHAPE_TEMPLATES[type];
  if (!t) return null;
  const options = [];
  for (const [shape, rs] of [['E', 0], ['A', 1]]) {
    const tpl = t[shape];
    if (!tpl) continue;
    let r = (pcOf(root) - OS[rs] + 12) % 12;
    const offs = tpl.filter(o => o !== null);
    if (r + Math.min(...offs) < 0) r += 12;
    const frets = tpl.map(o => o === null ? null : r + o);
    const barred = (t.barre === true || t.barre === shape) && r > 0;
    const sh = shapeFromFrets(frets, barred ? r : 0, rs);
    options.push({...sh, max: Math.max(...frets.filter(f => f !== null)), lbl: `${shape} shape${sh.sf ? ` · ${sh.sf}fr` : r === 0 ? ' · open' : ''} · ${sh.code}`});
  }
  options.sort((a, b) => a.max - b.max);
  return options[0];
}

// Chord card config ready for chordCard(): shape + spelled names + title
function chordCfg(root, type, tag) {
  const shape = chordShape(root, type);
  if (!shape) return null;
  return {...shape, root, name: chordLabel(root, type), tag, names: chordNotes(root, type)};
}

// Major scale whose k-th mode (0 = Ionian … 6 = Locrian) starts on root
function parentMajor(root, k) {
  const letter = LETTERS[(LETTERS.indexOf(parseNote(root).letter) - k + 7) % 7];
  let acc = ((pcOf(root) - MAJOR_STEPS[k] - LETTER_PC[letter]) % 12 + 12) % 12;
  if (acc > 6) acc -= 12;
  return noteName(letter, acc);
}

// ── Pentatonic boxes ──────────────────────────────────────────────────────────
// The five classic positions. Box k (1–5) starts on the k-th note of the
// pentatonic on the low E string, then climbs the scale two notes per string.
// Blues scales are their pentatonic box plus the extra note wherever it falls
// inside that box's fret range.

const OPEN_MIDI = [40, 45, 50, 55, 59, 64];  // E2 A2 D3 G3 B3 E4
const PENT_BASE = {minorPent: 'minorPent', majorPent: 'majorPent', blues: 'minorPent', majorBlues: 'majorPent'};

function pentBox(root, type, k) {
  const base = SCALES[PENT_BASE[type]].degs, pcs = base.map(d => pcOf(spellDeg(root, d)));
  const walk = start => {
    let pitch = OPEN_MIDI[0] + start, idx = k - 1;
    const pos = [];
    for (let s = 0; s < 6; s++) {
      for (let n = 0; n < 2; n++) {
        pos.push({s, f: pitch - OPEN_MIDI[s]});
        pitch += (pcs[(idx + 1) % 5] - pcs[idx % 5] + 12) % 12;
        idx++;
      }
    }
    return pos;
  };
  let startFret = (pcs[k - 1] - OS[0] + 12) % 12, pos = walk(startFret);
  // near the nut a box can need frets below 0: play it an octave higher instead
  if (pos.some(p => p.f < 0)) { startFret += 12; pos = walk(startFret); }
  if (type !== PENT_BASE[type]) {
    const extra = pcOf(spellDeg(root, type === 'blues' ? 'b5' : 'b3'));
    const lo = Math.min(...pos.map(p => p.f)), hi = Math.max(...pos.map(p => p.f));
    for (let s = 0; s < 6; s++)
      for (let f = lo; f <= hi; f++)
        if ((OS[s] + f) % 12 === extra) pos.push({s, f, extra: true});
  }
  return {startFret, positions: pos};
}

// MIDI notes of a chord shape, low string to high (what a guitar actually sounds)
// Fret played on string s by a shape (null = not played)
function stringFret(sh, s) {
  if (sh.mu.includes(s)) return null;
  const d = sh.dots.find(x => x.s === s);
  return d ? d.f : sh.br && s >= sh.br.a && s <= sh.br.b ? sh.br.f : sh.sf === 0 ? 0 : null;
}

function shapeMidis(sh) {
  return [0, 1, 2, 3, 4, 5].flatMap(s => { const f = stringFret(sh, s); return f === null ? [] : [OPEN_MIDI[s] + f]; });
}

function chordVoicing(root, type) {
  const sh = chordShape(root, type);
  return sh ? shapeMidis(sh) : null;
}

// ── Scale positions (for playing and highlighting a scale on the neck) ────────
// Pentatonic / blues scales use the five boxes (pentBox). Seven-note scales use
// the seven three-notes-per-string positions: position k starts on the k-th
// scale note on the low E string and climbs the scale three notes per string.

function scaleDegs(key) {
  if (key.startsWith('mode:')) return MODES.find(m => m.key === key.slice(5)).degs;
  return SCALES[key].degs;
}
function isPentKey(key) { return key in PENT_BASE; }
function positionCount(key) { return isPentKey(key) ? 5 : 7; }

function nps3Position(root, degs, k) {
  const pcs = degs.map(d => pcOf(spellDeg(root, d)));
  const walk = start => {
    let pitch = OPEN_MIDI[0] + start, idx = k - 1;
    const pos = [];
    for (let s = 0; s < 6; s++) for (let n = 0; n < 3; n++) {
      pos.push({s, f: pitch - OPEN_MIDI[s]});
      pitch += (pcs[(idx + 1) % 7] - pcs[idx % 7] + 12) % 12;
      idx++;
    }
    return pos;
  };
  let start = (pcs[k - 1] - OS[0] + 12) % 12, pos = walk(start);
  if (pos.some(p => p.f < 0)) { start += 12; pos = walk(start); }
  return {startFret: start, positions: pos};
}

// Notes of one position, low to high, each {s, f, midi}; no pitch appears twice
function scalePosition(root, key, k) {
  const raw = isPentKey(key) ? pentBox(root, key, k).positions : nps3Position(root, scaleDegs(key), k).positions;
  const seen = new Set();
  return raw.map(p => ({...p, midi: OPEN_MIDI[p.s] + p.f}))
    .sort((a, b) => a.midi - b.midi || a.s - b.s)
    .filter(p => !seen.has(p.midi) && seen.add(p.midi));
}

// Play order: up through the position and back down to the first note, top note once
function scaleRun(root, key, k) {
  const up = scalePosition(root, key, k);
  return up.concat(up.slice(0, -1).reverse());
}

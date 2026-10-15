// Run with: node tests/theory-test.js
// Loads the browser scripts into a sandbox and checks the theory engine against known answers.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = {console};
vm.createContext(ctx);
for (const f of ['data.js', 'theory.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, {filename: f});
const T = (expr) => vm.runInContext(expr, ctx);

let fail = 0, pass = 0;
function eq(expr, want) {
  const got = JSON.stringify(T(expr)), exp = JSON.stringify(want);
  if (got === exp) pass++; else { fail++; console.log(`FAIL ${expr}\n  got  ${got}\n  want ${exp}`); }
}

// spelling
eq(`majorScale('F')`, ['F','G','A','Bb','C','D','E']);
eq(`majorScale('F#')`, ['F#','G#','A#','B','C#','D#','E#']);
eq(`majorScale('Db')`, ['Db','Eb','F','Gb','Ab','Bb','C']);
eq(`scaleNotes('C', SCALES.naturalMinor.degs)`, ['C','D','Eb','F','G','Ab','Bb']);
eq(`scaleNotes('G#', SCALES.harmonicMinor.degs)`, ['G#','A#','B','C#','D#','E','F##']);
eq(`scaleNotes('D', MODES[1].degs)`, ['D','E','F','G','A','B','C']);
eq(`scaleNotes('F', MODES[3].degs)`, ['F','G','A','B','C','D','E']);
// intervals
eq(`intervalAbove('C','A4')`, 'F#'); eq(`intervalAbove('C','d5')`, 'Gb'); eq(`intervalAbove('Eb','M3')`, 'G');
eq(`intervalAbove('B','m3')`, 'D'); eq(`intervalAbove('F#','P5')`, 'C#'); eq(`intervalAbove('Ab','M7')`, 'G');
eq(`intervalBetween('C','Eb').sh`, 'm3'); eq(`intervalBetween('C','D#').sh`, '?'); eq(`intervalBetween('B','F').sh`, 'd5');
eq(`intervalBetween('E','C').sh`, 'm6');
eq(`invertInterval('M3')`, 'm6'); eq(`invertInterval('P4')`, 'P5'); eq(`invertInterval('A4')`, 'd5'); eq(`invertInterval('m2')`, 'M7');
// keys
eq(`keySignature('D')`, {type:'#', count:2, notes:['F#','C#']});
eq(`keySignature('Eb')`, {type:'b', count:3, notes:['Bb','Eb','Ab']});
eq(`keySignature('C').count`, 0);
eq(`CIRCLE_MAJOR.map(k => keySignature(k).count)`, [0,1,2,3,4,5,6,5,4,3,2,1]);
eq(`CIRCLE_MINOR`, ['A','E','B','F#','C#','G#','D#','Bb','F','C','G','D']);
eq(`relativeMajor('C')`, 'Eb');
eq(`parentMajor('D', 1)`, 'C'); eq(`parentMajor('F#', 2)`, 'D'); eq(`parentMajor('Bb', 4)`, 'Eb'); eq(`parentMajor('C#', 6)`, 'D');
// chords
eq(`chordNotes('B','m7b5')`, ['B','D','F','A']);
eq(`chordNotes('B','dim7')`, ['B','D','F','Ab']);
eq(`chordNotes('Eb','dom7')`, ['Eb','G','Bb','Db']);
eq(`chordNotes('C','dom13')`, ['C','E','G','Bb','D','A']);
eq(`diatonicChords(majorScale('C'), false).map(c => c.numeral)`, ['I','ii','iii','IV','V','vi','vii°']);
eq(`diatonicChords(majorScale('C'), true).map(c => c.name)`, ['Cmaj7','Dm7','Em7','Fmaj7','G7','Am7','Bø7']);
eq(`diatonicChords(scaleNotes('A', SCALES.harmonicMinor.degs), false).map(c => c.numeral)`, ['i','ii°','III+','iv','V','VI','vii°']);
eq(`diatonicChords(scaleNotes('A', SCALES.harmonicMinor.degs), true)[4].name`, 'E7');
eq(`diatonicChords(majorScale('C'), false).map(c => secondaryDominant(c.root))`, ['G','A','B','C','D','E','F#']);
// shapes: every generated shape must sound exactly the chord's notes and fit a 4-fret window
const shapeCheck = T(`(() => {
  const bad = [];
  for (const root of ROOTS) for (const type of Object.keys(CHORD_TYPES)) {
    const sh = chordShape(root, type); if (!sh) continue;
    const want = new Set(chordNotes(root, type).map(pcOf));
    const frets = [0,1,2,3,4,5].map(s => sh.mu.includes(s) ? null : (sh.dots.find(d => d.s === s) || {}).f ?? (sh.br && s >= sh.br.a ? sh.br.f : (sh.sf === 0 ? 0 : null)));
    const got = new Set(frets.flatMap((f, s) => f === null ? [] : [(OS[s] + f) % 12]));
    const used = frets.filter(f => f !== null && f > 0), span = used.length ? Math.max(...used) - (sh.sf || 1) : 0;
    if ([...got].some(p => !want.has(p)) || !got.has(pcOf(root)) || span > 3 || sh.dots.length > 4) bad.push(root + type + ' ' + sh.lbl);
  }
  return bad;
})()`);
if (shapeCheck.length) { fail++; console.log('FAIL chord shapes:', shapeCheck); } else pass++;
eq(`chordShape('B','m7b5').code`, 'x2323x');
eq(`chordShape('F#','dom7').code`, '2x232x');

// pentatonics and boxes
eq(`scaleNotes('A', SCALES.minorPent.degs)`, ['A','C','D','E','G']);
eq(`scaleNotes('C', SCALES.majorPent.degs)`, ['C','D','E','G','A']);
eq(`scaleNotes('E', SCALES.blues.degs)`, ['E','G','A','Bb','B','D']);
eq(`scaleNotes('C', SCALES.majorBlues.degs)`, ['C','D','Eb','E','G','A']);
eq(`pentBox('A','minorPent',1).positions.map(p => p.f)`, [5,8,5,7,5,7,5,7,5,8,5,8]);
eq(`pentBox('A','minorPent',2).positions.map(p => p.f)`, [8,10,7,10,7,10,7,9,8,10,8,10]);
eq(`pentBox('A','minorPent',4).positions.map(p => p.f)`, [0,3,0,3,0,2,0,2,1,3,0,3]);
eq(`pentBox('C','majorPent',1).positions.map(p => p.f)`, [8,10,7,10,7,10,7,9,8,10,8,10]);
eq(`pentBox('A','blues',1).positions.filter(p => p.extra).map(p => p.s + ':' + p.f)`, ['1:6','3:8']);
// every box: 12 notes, all in the scale, within a 5-fret window, root present
const boxCheck = T(`(() => { const bad = [];
  for (const r of ROOTS) for (const t of ['minorPent','majorPent']) for (let k = 1; k <= 5; k++) {
    const b = pentBox(r, t, k), pcs = scaleNotes(r, SCALES[t].degs).map(pcOf);
    const fs = b.positions.map(p => p.f);
    if (b.positions.length !== 12 || b.positions.some(p => !pcs.includes((OS[p.s] + p.f) % 12)) || Math.max(...fs) - Math.min(...fs) > 4 || Math.min(...fs) < 0) bad.push(r + t + k);
  } return bad; })()`);
if (boxCheck.length) { fail++; console.log('FAIL boxes:', boxCheck); } else pass++;

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

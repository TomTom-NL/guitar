// ── Foundations: notes & fretboard, intervals ────────────────────────────────

const THEORY_PAGES = [];

// ── Notes & the fretboard ────────────────────────────────────────────────────

const ENHARMONIC_PAIRS = [['C#','Db'],['D#','Eb'],['F#','Gb'],['G#','Ab'],['A#','Bb'],['E#','F'],['B#','C'],['Fb','E'],['Cb','B']];

function chromaticStrip() {
  const cells = PC_NAMES.map((n, pc) => {
    const black = n.includes('/');
    return `<div class="chr${black ? ' blk' : ''}">${black ? n.split('/').map(fmt).join('<br>') : n}<span class="chr-pc">${pc}</span></div>`;
  });
  // mark the two natural semitones (E–F, B–C)
  cells.splice(5, 0, '<div class="chr-gap" title="no note between E and F">½</div>');
  cells.push('<div class="chr-gap" title="no note between B and C">½</div>');
  return `<div class="chr-wrap"><div class="chr-row">${cells.join('')}</div></div>`;
}

EXPLORERS.findNote = {
  controls: () =>
    selectCtl('pc', 'Note', PC_NAMES.map((n, pc) => [String(pc), n.split('/').map(fmt).join(' / ')]), '0') +
    selectCtl('show', 'Also show', [['none', 'nothing else'], ['nat', 'all natural notes'], ['all', 'all 12 notes']], 'nat'),
  render: st => {
    const pc = +st.pc, marks = {};
    for (let p = 0; p < 12; p++) {
      const natural = !PC_NAMES[p].includes('/');
      if (p === pc) marks[p] = {label: PC_NAMES[p].split('/')[0], col: '#b83800', root: true};
      else if (st.show === 'all' || (st.show === 'nat' && natural)) marks[p] = {label: PC_NAMES[p].split('/')[0], col: '#7a7262', faint: true};
    }
    const count = TUNING.length * 13;
    let hits = 0;
    eachPosition((i, f, ni) => { if (ni === pc) hits++; });
    return `<p class="ex-sum"><b>${pcLabel(pc)}</b> appears <b>${hits}</b> times between the open strings and the 12th fret (out of ${count} positions). Look for the repeating <b>octave shapes</b> described below.</p>${listen(playBtn({mode: 'note', notes: [PC_NAMES[pc].split('/')[0].replace('#', '#')]}, 'hear it'))}${noteMapSVG(marks)}`;
  }
};

QUIZZES.nameNote = () => {
  const s = Math.floor(Math.random() * 6), f = Math.floor(Math.random() * 13), pc = (OS[s] + f) % 12;
  const answer = pcLabel(pc);
  return {
    q: `What note is on the <b>${['low E', 'A', 'D', 'G', 'B', 'high e'][s]} string</b>, <b>fret ${f}</b>?`,
    answer, options: optionsFor(answer, Array.from({length: 12}, (_, p) => pcLabel(p))),
    why: `The open ${SL[s]} string is ${TUNING[s]}. Counting up ${f} fret${f === 1 ? '' : 's'} (1 fret = 1 semitone)${f >= 12 ? ', and fret 12 is the octave' : ''} lands on ${answer}.`
  };
};

QUIZZES.enharmonic = () => {
  const [a, b] = shuffle(pick(ENHARMONIC_PAIRS));
  const pool = ENHARMONIC_PAIRS.flat().filter(n => pcOf(n) !== pcOf(a));
  return {
    q: `Which note sounds exactly the same as <b>${a}</b>?`,
    answer: b, options: optionsFor(b, pool),
    why: `${a} and ${b} are <b>enharmonic</b>: the same pitch (pitch class ${pcOf(a)}), spelled with a different letter.`
  };
};

THEORY_PAGES.push({id: 'notes', group: 'Foundations', label: 'Notes & fretboard', render: () => `
${pageHead('notes', '♪', 'Notes & the fretboard', 'the 12 notes · their names · where they live on the neck')}
${guideIntro('notes')}

${section(1, 'The musical alphabet')}
${prose(`<p>Western music names notes with just <b>7 letters</b>: A B C D E F G, then it starts again. Between most neighbouring letters there's an extra note. Raising a note by one semitone adds a <b>sharp ♯</b>, lowering it adds a <b>flat ♭</b>.</p>
<p>Two pairs have <b>no note in between</b>: <b>E–F</b> and <b>B–C</b> are already a semitone apart. That gives <b>12 different notes</b>, the <b>chromatic scale</b>. Every scale and chord in music is a selection from these 12.</p>`)}
${chromaticStrip()}
${prose(`<p class="cap">The 12 pitch classes, numbered 0–11 from C (the small number). Dark cells have two names. "½" marks the natural semitones E–F and B–C. On a piano these are the places where two white keys touch with no black key between.</p>`)}

${section(2, 'Same sound, different name')}
${prose(`<p>C♯ and D♭ are the same pitch. Notes like this are <b>enharmonic</b>. Even "white" notes have other names: E♯ = F, B♯ = C, F♭ = E, C♭ = B.</p>
<p><b>Which name is correct depends on the context.</b> The rule: a scale uses <b>each letter exactly once</b>. F major is F G A <b>B♭</b> C D E, not A♯, because A is already taken and B would be missing. That's why this site writes E♭ in C minor, not D♯.</p>
<p class="nerd">Nerd corner: the rule sometimes forces <b>double sharps</b> (𝄪, written ##) or <b>double flats</b> (𝄫, bb). G♯ harmonic minor needs F𝄪, which sounds like G but keeps the letter sequence intact.</p>`)}
${quiz('enharmonic', 'Enharmonic spellings')}

${section(3, 'The fretboard is a grid of semitones')}
${prose(`<p>Standard tuning, low to high: <b>E A D G B E</b>. Each fret raises the pitch by <b>one semitone</b>, so fret 12 is the same note one <b>octave</b> higher, and the pattern repeats from there.</p>
<p>Neighbouring strings are a <b>perfect 4th</b> apart (5 semitones), so fret 5 of one string equals the next open string. The one exception is <b>G → B, a major 3rd</b> (4 semitones). That's why you tune the B string at the 4th fret, and why every shape shifts up one fret when it crosses from the G to the B string.</p>`)}
${explorer('findNote', 'Find any note on the neck')}

${section(4, 'Octave shapes')}
${prose(`<p>You don't need to memorise all 78 positions. Learn the notes on the low E and A strings, then use these shapes to find the same note elsewhere:</p>`)}
${table(['From a note on…', 'Same note, one octave up', 'Same note, nearby'], [
  ['Low E string', '2 strings up (D), 2 frets higher', 'Next string up (A), 5 frets lower'],
  ['A string', '2 strings up (G), 2 frets higher', 'Next string up (D), 5 frets lower'],
  ['D string', '2 strings up (B), <b>3</b> frets higher (crosses G→B)', 'Next string up (G), 5 frets lower'],
  ['G string', '2 strings up (high e), <b>3</b> frets higher', 'Next string up (B), <b>4</b> frets lower'],
  ['Low E string', 'High e string, same fret (2 octaves up)', ''],
])}
${guideMid('notes')}
${quiz('nameNote', 'Name the note')}
${guideEnd('notes')}
</div>`});

// ── Intervals ────────────────────────────────────────────────────────────────

EXPLORERS.interval = {
  controls: () =>
    selectCtl('root', 'From', ROOTS, 'C') +
    selectCtl('iv', 'Up a', INTERVALS.filter(i => i.sh !== 'P1').map(i => [i.sh, `${i.name} (${i.sh})`]), 'M3'),
  render: st => {
    const iv = INTERVALS.find(i => i.sh === st.iv), top = intervalAbove(st.root, st.iv);
    const inv = invertInterval(st.iv), invIv = INTERVALS.find(i => i.sh === inv);
    const letters = Array.from({length: iv.st + 1}, (_, k) => LETTERS[(LETTERS.indexOf(st.root[0]) + k) % 7]);
    const marks = {[pcOf(st.root)]: {label: st.root, col: '#1a5291', root: true}};
    if (iv.s % 12 !== 0) marks[pcOf(top)] = {label: top, col: '#b83800'};
    return `<p class="ex-sum"><b>${st.root}</b> up a <b>${iv.name.toLowerCase()}</b> is <b>${top}</b>.</p>
      ${listen(playBtn({mode: 'interval', notes: [st.root], semis: iv.s}, 'hear it: apart, then together'))}
      <ul class="ex-list">
        <li><b>Number:</b> count the letters ${letters.join(' ')} = ${iv.st + 1} letters → a <b>${ordinal(iv.st + 1)}</b>.</li>
        <li><b>Quality:</b> ${iv.s} semitone${iv.s === 1 ? '' : 's'} → <b>${iv.name.split(' ')[0].toLowerCase()}</b>.</li>
        <li><b>Sound:</b> ${iv.feel}${iv.song ? `. Think of the start of <i>${iv.song}</i>` : ''}.</li>
        ${invIv ? `<li><b>Inverted</b> (${top} up to ${st.root}): ${invIv.name.toLowerCase()} (${inv}). ${iv.st + 1} + ${invIv.st + 1} = 9.</li>` : ''}
      </ul>
      <p class="cap">Blue ring = ${st.root} (the starting note), orange = ${top}. Find pairs that sit close together to see the interval's shape.</p>
      ${noteMapSVG(marks)}`;
  }
};

function ordinal(n) { return n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'); }

const QUIZ_IVS = MAIN_INTERVALS.filter(i => !['P1', 'P8'].includes(i.sh));
const QUIZ_ROOTS = ['C','D','E','F','G','A','B','Bb','Eb','F#','Ab'];

QUIZZES.nameInterval = () => {
  const root = pick(QUIZ_ROOTS), iv = pick(QUIZ_IVS), top = intervalAbove(root, iv.sh);
  const answer = `${iv.name} (${iv.sh})`;
  return {
    q: `What is the interval from <b>${root}</b> up to <b>${top}</b>?`,
    answer, options: optionsFor(answer, QUIZ_IVS.map(i => `${i.name} (${i.sh})`)),
    why: `Letters ${root[0]}→${top[0]} span ${iv.st + 1} letters (a ${ordinal(iv.st + 1)}), and ${root}→${top} is ${iv.s} semitones, so it's a ${iv.name.toLowerCase()}.`
  };
};

QUIZZES.buildInterval = () => {
  const root = pick(QUIZ_ROOTS), iv = pick(QUIZ_IVS), answer = intervalAbove(root, iv.sh);
  // distractors: same letter with other accidentals, and neighbouring letters
  const pool = [answer[0], answer[0] + '#', answer[0] + 'b', ...MAIN_INTERVALS.map(i => intervalAbove(root, i.sh))].filter(n => n !== answer);
  return {
    q: `What note is a <b>${iv.name.toLowerCase()}</b> above <b>${root}</b>?`,
    answer, options: optionsFor(answer, pool),
    why: `A ${iv.name.toLowerCase()} is ${iv.st + 1} letters and ${iv.s} semitones. From ${root}, the ${ordinal(iv.st + 1)} letter is ${answer[0]}, adjusted to ${iv.s} semitones: <b>${answer}</b>.`
  };
};

QUIZZES.invertInterval = () => {
  const iv = pick(QUIZ_IVS), answer = invertInterval(iv.sh);
  return {
    q: `What do you get when you invert a <b>${iv.name.toLowerCase()} (${iv.sh})</b>?`,
    answer, options: optionsFor(answer, QUIZ_IVS.map(i => i.sh)),
    why: `Numbers add up to 9 (${iv.sh.slice(1)} + ${answer.slice(1)} = 9) and the quality flips: major ↔ minor, augmented ↔ diminished, perfect stays perfect.`
  };
};

THEORY_PAGES.push({id: 'intervals', group: 'Foundations', label: 'Intervals', render: () => `
${pageHead('intervals', '↕', 'Intervals', 'the distance between two notes, the building block of everything')}
${guideIntro('intervals')}

${section(1, 'Two numbers describe every interval')}
${prose(`<p>An <b>interval</b> is the distance between two notes. It has two parts:</p>
<ul>
  <li><b>Number:</b> count the <b>letters</b>, including both ends. C up to E is C D E = 3 letters → a <b>3rd</b>.</li>
  <li><b>Quality:</b> the exact size in <b>semitones</b>. C→E is 4 semitones (a <b>major</b> 3rd); C→E♭ is 3 semitones (a <b>minor</b> 3rd). Same number, different quality.</li>
</ul>
<p>The letter count is why spelling matters. C→D♯ and C→E♭ sound the same (3 semitones), but C→D♯ is an <b>augmented 2nd</b> and C→E♭ a <b>minor 3rd</b>. In a chord they play different roles.</p>`)}
${table(['', 'Short', 'Name', 'Semitones', 'From C', 'Sound', 'Remember it by'],
  MAIN_INTERVALS.map(i => [playBtn({mode: 'interval', notes: ['C'], semis: i.s}), `<b>${i.sh}</b>`, i.name + (i.sh === 'A4' ? ' / dim 5th (d5)' : ''), i.s, `C → ${fmt(intervalAbove('C', i.sh))}${i.sh === 'A4' ? ` / ${fmt(intervalAbove('C', 'd5'))}` : ''}`, i.feel, i.song ? `<i>${i.song}</i>` : '—']))}

${section(2, 'Perfect, major, minor, augmented, diminished')}
${prose(`<ul>
  <li><b>Perfect</b> intervals: unison, 4th, 5th and octave. They sound so stable they have only one "normal" size.</li>
  <li><b>Major / minor</b> intervals: 2nds, 3rds, 6ths and 7ths come in two sizes. Minor is one semitone smaller than major.</li>
  <li><b>Augmented</b> = one semitone bigger than major or perfect. <b>Diminished</b> = one semitone smaller than minor or perfect.</li>
  <li>The <b>tritone</b> (6 semitones, exactly half an octave) is either an augmented 4th (C→F♯) or a diminished 5th (C→G♭). It's the most unstable interval and the engine of the dominant 7th chord (see <i>Function &amp; cadences</i>).</li>
</ul>
<p><b>Consonance → dissonance</b>, roughly: octave, 5th, 4th, major/minor 3rds and 6ths (sweet), then major 2nd and minor 7th (mild tension), then minor 2nd, major 7th and the tritone (strong tension). Tension isn't bad. It's what makes music move.</p>`)}

${section(3, 'Inversions')}
${prose(`<p>Flip an interval by moving the bottom note up an octave. C→E (major 3rd) becomes E→C (minor 6th). Two rules:</p>
<ul><li>The numbers <b>add up to 9</b>: 3rd ↔ 6th, 2nd ↔ 7th, 4th ↔ 5th.</li>
<li>The quality <b>flips</b>: major ↔ minor, augmented ↔ diminished, perfect stays perfect.</li></ul>
<p>Handy consequence: going <b>up a 4th</b> lands on the same note name as going <b>down a 5th</b>.</p>`)}
${explorer('interval', 'Build any interval')}

${section(4, 'Interval shapes on the guitar')}
${prose(`<p>Because the strings are tuned in 4ths, every interval has a fixed shape you can move anywhere. This table assumes the root is on the low E, A or D string and you don't cross the G→B pair. If you do, add one fret for any note on the B or high e string.</p>`)}
${table(['Interval', 'Same string', 'Next string up', 'Two strings up'], [
  ['m2', '+1 fret', '−4 frets', ''], ['M2', '+2 frets', '−3 frets', ''], ['m3', '+3 frets', '−2 frets', ''],
  ['M3', '+4 frets', '−1 fret', ''], ['P4', '+5 frets', 'same fret', ''], ['Tritone', '+6 frets', '+1 fret', ''],
  ['P5', '+7 frets', '+2 frets', '−3 frets'], ['m6', '+8 frets', '+3 frets', '−2 frets'], ['M6', '+9 frets', '+4 frets', '−1 fret'],
  ['m7', '+10 frets', '', 'same fret'], ['M7', '+11 frets', '', '+1 fret'], ['Octave', '+12 frets', '', '+2 frets'],
])}
${guideMid('intervals')}
${quiz('nameInterval', 'Name the interval')}
${quiz('buildInterval', 'Build the interval')}
${quiz('invertInterval', 'Invert the interval')}
${quiz('earInterval', 'Ear training: name the interval')}
${guideEnd('intervals')}
</div>`});

// Ear training: hear an interval, name it
const EAR_IVS = ['m2','M2','m3','M3','P4','A4','P5','M6','m7','P8'];
QUIZZES.earInterval = () => {
  const sh = pick(EAR_IVS), iv = INTERVALS.find(i => i.sh === sh), root = pick(['C','D','E','F','G','A']);
  const answer = iv.sh === 'A4' ? 'Tritone' : iv.name;
  const names = EAR_IVS.map(sh => sh === 'A4' ? 'Tritone' : INTERVALS.find(i => i.sh === sh).name);
  return {
    q: `Listen ${playBtn({mode: 'interval', notes: [root], semis: iv.s})}. Which interval is it?`,
    answer, options: optionsFor(answer, names),
    why: `It was ${root} up to ${intervalAbove(root, iv.sh)}: ${iv.s} semitones, ${iv.feel}${iv.song ? ` (think <i>${iv.song}</i>)` : ''}.`
  };
};

// ── Scales & keys: major scale & key signatures, circle of fifths, minor, modes ─

const DEGREE_NAMES = ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading tone'];

// Step pattern (W/H/A2) between consecutive notes of a 7-note scale, wrapping to the octave
function stepPattern(scale) {
  return scale.map((n, i) => {
    const d = (pcOf(scale[(i + 1) % 7]) - pcOf(n) + 12) % 12;
    return d === 1 ? 'H' : d === 2 ? 'W' : d === 3 ? 'W+H' : d + '?';
  });
}

function stepsRow(scale) {
  return `<div class="steps">${stepPattern(scale).map(s => `<span class="step ${s === 'H' ? 'h' : s === 'W' ? 'w' : 'x'}">${s}</span>`).join('')}</div>`;
}

// ── Major scale & key signatures ────────────────────────────────────────────

EXPLORERS.majorKey = {
  controls: () => selectCtl('key', 'Major key', CIRCLE_MAJOR, 'D'),
  render: st => {
    const sc = majorScale(st.key), sig = keySignature(st.key);
    return `<p class="ex-sum"><b>${st.key} major</b> has <b>${sigText(sig)}</b>${sig.count ? `: ${sig.notes.join(' ')}` : ''}. Relative minor: <b>${relativeMinor(st.key)} minor</b>.</p>
      ${listen(playBtn({mode: 'scale', notes: sc}, 'scale'), playBtn({mode: 'prog', steps: [[0, 2, 4], [3, 5, 0], [4, 6, 1], [0, 2, 4]].map(ix => ix.map(i => sc[i]))}, 'I–IV–V–I'))}
      ${chips([...sc, sc[0]], {colors: [...sc, sc[0]].map((_, i) => DEG_COL[(i % 7) + 1]), under: ['1','2','3','4','5','6','7','8']})}
      ${stepsRow(sc)}
      ${noteMapSVG(degreeMarks(st.key, SCALES.major.degs))}`;
  }
};

const QUIZ_KEYS = CIRCLE_MAJOR;

QUIZZES.keySig = () => {
  const k = pick(QUIZ_KEYS), answer = sigText(keySignature(k));
  return {
    q: `How many sharps or flats does <b>${k} major</b> have?`,
    answer, options: optionsFor(answer, QUIZ_KEYS.map(x => sigText(keySignature(x)))),
    why: `${k} major: ${majorScale(k).join(' ')}. ${keySignature(k).count ? 'Accidentals: ' + keySignature(k).notes.join(' ') + '.' : ''}`
  };
};

QUIZZES.keyFromSig = () => {
  const k = pick(QUIZ_KEYS.filter(x => x !== 'C')), sig = keySignature(k);
  return {
    q: `Which major key has <b>${sig.notes.join(' ')}</b>?`,
    answer: k, options: optionsFor(k, QUIZ_KEYS),
    why: sig.type === '#' ? `Sharp keys: the key is one semitone above the last sharp (${sig.notes[sig.count - 1]} → ${k}).`
      : sig.count === 1 ? 'One flat (B♭) is F major: memorise this one.' : `Flat keys: the key is the second-to-last flat (${sig.notes[sig.count - 2]}).`
  };
};

QUIZZES.scaleDegree = () => {
  const k = pick(QUIZ_KEYS), d = 2 + Math.floor(Math.random() * 6), answer = majorScale(k)[d - 1];
  return {
    q: `What is the <b>${ordinal(d)} note</b> (${DEGREE_NAMES[d - 1].toLowerCase()}) of <b>${k} major</b>?`,
    answer, options: optionsFor(answer, [...majorScale(k), answer[0] + (answer.includes('#') ? '' : '#'), answer[0] + (answer.includes('b') ? '' : 'b')]),
    why: `${k} major = ${majorScale(k).join(' ')}.`
  };
};

THEORY_PAGES.push({id: 'major', group: 'Scales & keys', label: 'Major scale & keys', render: () => `
${pageHead('major', '1', 'The major scale & key signatures', 'one pattern, twelve keys')}
${guideIntro('major')}

${section(1, 'One pattern for every major scale')}
${prose(`<p>A <b>major scale</b> is 7 notes chosen by a fixed pattern of whole (W = 2 frets) and half (H = 1 fret) steps:</p>
<p class="big">W &nbsp;W &nbsp;H &nbsp;W &nbsp;W &nbsp;W &nbsp;H</p>
<p>The half steps fall between degrees <b>3–4</b> and <b>7–8</b>. Measured from the root, the degrees are a major 2nd, major 3rd, perfect 4th, perfect 5th, major 6th and major 7th. Every other scale is described by how it differs from this one (b3, #4 and so on).</p>`)}
${table(['Degree', 'Name', 'Interval from root', 'Role'], [
  ['1', 'Tonic', 'P1', 'home, total rest'], ['2', 'Supertonic', 'M2', 'passing, leads to 1 or 3'], ['3', 'Mediant', 'M3', 'decides major vs minor'],
  ['4', 'Subdominant', 'P4', 'moves away from home, falls to 3'], ['5', 'Dominant', 'P5', 'strongest support for the tonic'],
  ['6', 'Submediant', 'M6', 'root of the relative minor'], ['7', 'Leading tone', 'M7', 'a semitone below 1, pulls up into it'],
])}

${section(2, 'Building a scale in any key')}
${prose(`<p>Write the 7 letters starting on the root, then add sharps or flats until the steps match W W H W W W H. Example, <b>D major</b>: D E F G A B C. Between E and F is a half step, but the pattern needs a whole step there, so F → <b>F♯</b>. The same thing happens at C → <b>C♯</b>. Result: D E F♯ G A B C♯, two sharps.</p>
<p>A key uses <b>either</b> sharps <b>or</b> flats, never both, and every letter appears once.</p>`)}
${explorer('majorKey', 'Any major key')}

${section(3, 'Key signatures')}
${prose(`<p>Sharps and flats always arrive in a fixed order:</p>
<ul><li><b>Sharps:</b> F C G D A E B ("<b>F</b>ather <b>C</b>harles <b>G</b>oes <b>D</b>own <b>A</b>nd <b>E</b>nds <b>B</b>attle")</li>
<li><b>Flats:</b> B E A D G C F, the same list backwards ("<b>B</b>attle <b>E</b>nds <b>A</b>nd <b>D</b>own <b>G</b>oes <b>C</b>harles's <b>F</b>ather")</li></ul>
<p><b>Shortcuts:</b> in a sharp key, the <b>last sharp + a semitone</b> names the key (F♯ C♯ → D). In a flat key, the <b>second-to-last flat</b> names the key (B♭ E♭ A♭ → E♭). One flat is F major.</p>`)}
${table(['Key', 'Signature', 'Accidentals', 'Relative minor'],
  CIRCLE_MAJOR.map(k => { const s = keySignature(k); return [`<b>${fmt(k)} major</b>`, sigText(s), s.notes.map(fmt).join(' ') || '—', fmt(relativeMinor(k)) + ' minor']; }))}
${guideMid('major')}
${quiz('keySig', 'Key signatures')}
${quiz('keyFromSig', 'Which key?')}
${quiz('scaleDegree', 'Scale degrees')}
${guideEnd('major')}
</div>`});

// ── Circle of fifths ────────────────────────────────────────────────────────

function circleSVG(sel) {
  const cx = 170, cy = 170, ro = 118, ri = 78, k = CIRCLE_MAJOR.indexOf(sel);
  const around = j => (j - k + 12) % 12;
  const role = j => ({11: 'IV', 0: 'I', 1: 'V'})[around(j)];
  const mrole = j => ({11: 'ii', 0: 'vi', 1: 'iii'})[around(j)];
  const pos = (j, r) => { const a = (j * 30 - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const alt = {6: 'G♭', 7: 'C♯', 5: 'C♭'};
  let s = `<svg viewBox="0 0 340 340" class="cof">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${ro + 22}" fill="var(--surface)" stroke="var(--faint)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${ri + 20}" fill="var(--bg)" stroke="var(--faint)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${ri - 22}" fill="var(--surface)" stroke="var(--faint)"/>`;
  // shade the key's slice (IV · I · V and their relative minors)
  [11, 0, 1].forEach(o => {
    const j = (k + o) % 12, [x, y] = pos(j, ro), [mx, my] = pos(j, ri);
    s += `<circle cx="${x}" cy="${y}" r="21" fill="${o === 0 ? '#1a5291' : '#c97b20'}" opacity="${o === 0 ? 1 : 0.9}"/>`;
    s += `<circle cx="${mx}" cy="${my}" r="17" fill="#6b2d8b" opacity="0.85"/>`;
  });
  CIRCLE_MAJOR.forEach((m, j) => {
    const [x, y] = pos(j, ro), [mx, my] = pos(j, ri), [sx, sy] = pos(j, ro + 36), on = role(j);
    const sig = keySignature(m);
    s += `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="13" font-weight="700" font-family="Georgia,serif" fill="${on ? 'white' : 'var(--ink)'}">${fmt(m)}</text>`;
    if (alt[j]) s += `<text x="${x}" y="${y + 15}" text-anchor="middle" font-size="7" fill="${on ? 'white' : '#888'}" font-family="Courier New">${alt[j]}</text>`;
    s += `<text x="${mx}" y="${my + 4}" text-anchor="middle" font-size="10" font-weight="700" font-family="Courier New" fill="${mrole(j) ? 'white' : 'var(--ink2)'}">${fmt(CIRCLE_MINOR[j])}m</text>`;
    s += `<text x="${sx}" y="${sy + 3}" text-anchor="middle" font-size="8" fill="#998f7a" font-family="Courier New">${sig.count ? sig.count + (sig.type === '#' ? '♯' : '♭') : '0'}</text>`;
    if (on) s += `<text x="${x}" y="${y - 25}" text-anchor="middle" font-size="9" font-weight="700" fill="#1c1a14" font-family="Courier New">${on}</text>`;
  });
  s += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="9" fill="#998f7a" font-family="Courier New">outer: major</text>`;
  s += `<text x="${cx}" y="${cy + 9}" text-anchor="middle" font-size="9" fill="#998f7a" font-family="Courier New">inner: minor</text>`;
  return s + `</svg>`;
}

EXPLORERS.circle = {
  controls: () => selectCtl('key', 'Key', CIRCLE_MAJOR, 'C'),
  render: st => {
    const k = CIRCLE_MAJOR.indexOf(st.key), IV = CIRCLE_MAJOR[(k + 11) % 12], V = CIRCLE_MAJOR[(k + 1) % 12];
    const chords = diatonicChords(majorScale(st.key), false);
    return `<div class="cof-row"><div class="cof-wrap">${circleSVG(st.key)}</div>
      <div class="cof-info">
        <p><b>${st.key} major</b>: ${sigText(keySignature(st.key))}. Relative minor <b>${relativeMinor(st.key)}m</b>.</p>
        ${listen(playBtn({mode: 'prog', steps: [0, 3, 4, 0].map(i => chords[i].notes)}, `${chords[0].label}–${chords[3].label}–${chords[4].label}–${chords[0].label}`), playBtn({mode: 'prog', steps: [5, 1, 4, 0].map(i => chords[i].notes)}, 'vi–ii–V–I'))}
        <p>Its neighbours are <b>${IV}</b> (IV, one step anticlockwise) and <b>${V}</b> (V, one step clockwise). Each shares 6 of ${st.key}'s 7 notes.</p>
        <p><b>The key's chords sit in one slice:</b> the three majors on the outside (${IV} · ${st.key} · ${V}) and their relative minors on the inside (${chords[1].label} · ${chords[5].label} · ${chords[2].label}). Only the vii° chord, <b>${chords[6].label}</b>, isn't on the wheel.</p>
      </div></div>`;
  }
};

QUIZZES.relMinor = () => {
  const k = pick(CIRCLE_MAJOR), answer = relativeMinor(k) + 'm';
  return {
    q: `What is the <b>relative minor</b> of ${k} major?`, answer, options: optionsFor(answer, CIRCLE_MINOR.map(m => m + 'm')),
    why: `The relative minor starts on the 6th degree (3 semitones below the root): ${k} → ${relativeMinor(k)}. Same notes, same key signature.`
  };
};

QUIZZES.fifthAbove = () => {
  const i = Math.floor(Math.random() * 12), dir = pick(['clockwise', 'anticlockwise']);
  const answer = CIRCLE_MAJOR[(i + (dir === 'clockwise' ? 1 : 11)) % 12];
  return {
    q: `Which key is one step <b>${dir}</b> from <b>${CIRCLE_MAJOR[i]}</b> on the circle of fifths?`, answer, options: optionsFor(answer, CIRCLE_MAJOR),
    why: dir === 'clockwise' ? `Clockwise = up a perfect 5th (${CIRCLE_MAJOR[i]} → ${answer}): one more sharp / one fewer flat.` : `Anticlockwise = up a perfect 4th (= down a 5th) (${CIRCLE_MAJOR[i]} → ${answer}): one more flat / one fewer sharp.`
  };
};

THEORY_PAGES.push({id: 'fifths', group: 'Scales & keys', label: 'Circle of fifths', render: () => `
${pageHead('fifths', '○', 'The circle of fifths', 'how all 24 keys relate to each other')}
${guideIntro('fifths')}

${section(1, 'Why a circle?')}
${prose(`<p>Start at C and keep going <b>up a perfect 5th</b>: C → G → D → A → E → B → F♯… After 12 steps you're back at C. Arrange those 12 keys in a ring and you get the <b>circle of fifths</b>.</p>
<ul>
  <li><b>Clockwise</b> (up a 5th): each key adds <b>one sharp</b>. The new sharp is always the new key's <b>7th degree</b> (its leading tone).</li>
  <li><b>Anticlockwise</b> (up a 4th): each key adds <b>one flat</b>. The new flat is always the new key's <b>4th degree</b>.</li>
  <li>At the bottom the sharp and flat keys meet: <b>F♯ = G♭</b> (6 sharps or 6 flats), and C♯/D♭ and B/C♭ overlap too.</li>
  <li>The <b>inner ring</b> shows each key's <b>relative minor</b> (same notes, different home).</li>
</ul>`)}
${explorer('circle', 'Pick a key on the circle')}

${section(2, 'What the circle is good for')}
${prose(`<ul>
  <li><b>Key signatures at a glance:</b> the small number outside each key.</li>
  <li><b>Chords of a key:</b> the I, IV and V are the key and its two neighbours; ii, vi and iii are directly inside them.</li>
  <li><b>Changing key (modulation):</b> neighbouring keys differ by a single note, so moving to them sounds smooth. Keys across the circle sound distant.</li>
  <li><b>Chord progressions:</b> moving <b>anticlockwise</b> = roots falling by 5ths, the strongest root motion in music. Read anticlockwise from E: E → A → D → G → C, which is iii–vi–ii–V–I in C (the "circle progression").</li>
</ul>`)}
${guideMid('fifths')}
${quiz('relMinor', 'Relative minors')}
${quiz('fifthAbove', 'Walking the circle')}
${guideEnd('fifths')}
</div>`});

// ── Minor scales ────────────────────────────────────────────────────────────

const MINOR_TYPES = [['naturalMinor', 'Natural minor'], ['harmonicMinor', 'Harmonic minor'], ['melodicMinor', 'Melodic minor (ascending)']];

EXPLORERS.minor = {
  controls: () => selectCtl('root', 'Root', MINOR_ROOTS, 'A') + selectCtl('type', 'Type', MINOR_TYPES, 'harmonicMinor'),
  render: st => {
    const degs = SCALES[st.type].degs, sc = scaleNotes(st.root, degs);
    const natural = SCALES.naturalMinor.degs, raised = degs.map((d, i) => d !== natural[i]);
    const chords = diatonicChords(sc, false), sev = diatonicChords(sc, true);
    return `<p class="ex-sum"><b>${st.root} ${SCALES[st.type].name.toLowerCase()}</b>${raised.some(Boolean) ? `: raised notes highlighted` : ''}. Relative major: <b>${relativeMajor(st.root)} major</b>.</p>
      ${listen(playBtn({mode: 'scale', notes: sc}, 'scale'), playBtn({mode: 'prog', steps: [chordNotes(st.root, 'min'), chordNotes(spellDeg(st.root, '4'), 'min'), chordNotes(spellDeg(st.root, '5'), 'dom7'), chordNotes(st.root, 'min')]}, 'i–iv–V7–i'))}
      ${chips(sc, {colors: degs.map(d => DEG_COL[degNum(d)]), under: degs, highlight: raised})}
      ${stepsRow(sc)}
      <div class="tbl-wrap"><table class="ref"><thead><tr><th>Chord</th>${chords.map(c => `<th>${c.numeral}</th>`).join('')}</tr></thead><tbody>
        <tr><td>Triad</td>${chords.map(c => `<td><b>${c.label}</b></td>`).join('')}</tr>
        <tr><td>7th</td>${sev.map(c => `<td>${c.label}</td>`).join('')}</tr></tbody></table></div>
      <p class="cap">${st.type === 'naturalMinor' ? `Notice the v chord, ${chords[4].label}, is <b>minor</b>: no leading tone, weak pull home.` : `The raised 7th turns the V chord into <b>${chords[4].label}</b> (${sev[4].label} as a 7th): a real dominant with a leading tone pulling into ${st.root}.`}</p>
      ${noteMapSVG(degreeMarks(st.root, degs))}`;
  }
};

QUIZZES.relMajor = () => {
  const m = pick(CIRCLE_MINOR), answer = relativeMajor(m);
  return {
    q: `${m} minor is the relative minor of which major key?`, answer, options: optionsFor(answer, CIRCLE_MAJOR),
    why: `Go up a minor 3rd (3 semitones) from the minor root: ${m} → ${answer}.`
  };
};

QUIZZES.harmonicV = () => {
  const m = pick(['A','E','D','G','C','B','F#','F']), sc = scaleNotes(m, SCALES.harmonicMinor.degs);
  const V = diatonicChords(sc, true)[4], answer = V.label;
  return {
    q: `In <b>${m} harmonic minor</b>, what is the V7 chord?`,
    answer, options: optionsFor(answer, [V.root + 'm7', V.root + 'maj7', V.root + 'ø7', diatonicChords(scaleNotes(m, SCALES.naturalMinor.degs), true)[4].label, V.root + '7'].map(fmt)),
    why: `The raised 7th (${sc[6]}) is the 3rd of the V chord: ${V.notes.join(' ')} = ${V.label}.`
  };
};

THEORY_PAGES.push({id: 'minor', group: 'Scales & keys', label: 'Minor scales', render: () => `
${pageHead('minor', 'm', 'Minor scales', 'relative vs parallel · natural, harmonic, melodic')}
${guideIntro('minor')}

${section(1, 'Relative vs parallel minor')}
${prose(`<ul>
  <li><b>Relative minor:</b> same notes, different home. A minor uses exactly the notes of C major but treats A as the root. It starts on the major key's <b>6th degree</b> and shares its key signature.</li>
  <li><b>Parallel minor:</b> same root, different notes. C minor (C D E♭ F G A♭ B♭) is the parallel minor of C major: the 3rd, 6th and 7th are lowered.</li>
</ul>
<p>Relative is about <b>key signatures</b>; parallel is about <b>sound</b>, comparing major and minor on the same root. The Blues pages use the parallel minor.</p>`)}

${section(2, 'Three kinds of minor')}
${prose(`<p>The plain minor scale has a problem: its 7th degree is a <b>whole step</b> below the root, so nothing pulls strongly toward home. Classical composers fixed this in two ways:</p>`)}
${table(['Scale', 'Formula', 'In A', 'Character'], [
  ['<b>Natural minor</b> (Aeolian)', '1 2 ♭3 4 5 ♭6 ♭7', 'A B C D E F G', 'the pure minor sound; v chord is minor (Em)'],
  ['<b>Harmonic minor</b>', '1 2 ♭3 4 5 ♭6 <b>7</b>', 'A B C D E F <b>G♯</b>', 'raised 7th = leading tone → <b>major V (E, E7)</b>. The gap F→G♯ (an augmented 2nd) sounds exotic'],
  ['<b>Melodic minor</b>', '1 2 ♭3 4 5 <b>6 7</b>', 'A B C D E <b>F♯ G♯</b>', 'raises the 6th too, smoothing that gap. Classical: only going up. Jazz: both ways'],
])}
${prose(`<p><b>In practice</b>, a song "in A minor" mixes these freely: natural minor for most chords, but often the <b>major V (E or E7)</b> borrowed from harmonic minor. That's why <b>E7 → Am</b> sounds so convincing (compare <i>Secondary dominants</i> on the Chords in a key page).</p>`)}
${explorer('minor', 'Compare the three minors')}
${guideMid('minor')}
${quiz('relMinor', 'Relative minors')}
${quiz('relMajor', 'Relative majors')}
${quiz('harmonicV', 'The dominant in minor')}
${quiz('earMinor', 'Ear training: which scale?')}
${guideEnd('minor')}
</div>`});

// ── Modes ───────────────────────────────────────────────────────────────────

EXPLORERS.modes = {
  controls: () => selectCtl('root', 'Root', ROOTS, 'D') + selectCtl('mode', 'Mode', MODES.map(m => [m.key, m.name]), 'dorian'),
  render: st => {
    const k = MODES.findIndex(m => m.key === st.mode), m = MODES[k], sc = scaleNotes(st.root, m.degs);
    const parent = parentMajor(st.root, k), chordType = {maj7: 'maj7', '7': 'dom7', m7: 'min7', m7b5: 'm7b5'}[m.chord];
    const isChar = d => m.char && d === m.char;
    return `<p class="ex-sum"><b>${st.root} ${m.name}</b> = the notes of <b>${parent} major</b>, starting on its ${ordinal(k + 1)} note. Mood: ${m.mood}.</p>
      ${listen(playBtn({mode: 'scale', notes: sc, drone: true}, 'over a drone'), playBtn({mode: 'scale', notes: sc}, 'scale'), playBtn({mode: 'chord', notes: chordNotes(st.root, chordType)}, 'home chord'))}
      ${chips(sc, {colors: m.degs.map(d => isChar(d) ? '#b83800' : DEG_COL[degNum(d)]), under: m.degs, highlight: m.degs.map(isChar)})}
      <p class="cap">${m.char ? `Characteristic note: <b>${m.char}</b> (${sc[m.degs.indexOf(m.char)]}), highlighted. It's what separates ${m.name} from plain ${m.vs}.` : `${m.name} is the plain ${m.vs} scale: the reference the other ${m.vs} modes are compared with.`} Home chord: <b>${chordLabel(st.root, chordType)}</b>.</p>
      ${noteMapSVG(degreeMarks(st.root, m.degs, {colorOf: d => isChar(d) ? '#b83800' : DEG_COL[degNum(d)]}))}`;
  }
};

QUIZZES.modeParent = () => {
  const k = 1 + Math.floor(Math.random() * 6), m = MODES[k], parentKey = pick(['C','G','D','F','Bb','A','E','Eb']);
  const root = majorScale(parentKey)[k];
  return {
    q: `<b>${root} ${m.name}</b> uses the same notes as which major scale?`,
    answer: parentKey, options: optionsFor(parentKey, CIRCLE_MAJOR),
    why: `${m.name} is the ${ordinal(k + 1)} mode, so ${root} is the ${ordinal(k + 1)} note of ${parentKey} major (${majorScale(parentKey).join(' ')}).`
  };
};

QUIZZES.modeChar = () => {
  const m = pick(MODES.filter(x => x.char)), answer = m.name;
  return {
    q: `Which mode is a <b>${m.vs}</b> scale with a <b>${m.char}</b>?`, answer, options: optionsFor(answer, MODES.map(x => x.name)),
    why: `${m.name}: ${m.degs.join(' ')}. Its characteristic note is the ${m.char}.`
  };
};

THEORY_PAGES.push({id: 'modes', group: 'Scales & keys', label: 'Modes', render: () => `
${pageHead('modes', '◐', 'Modes', 'seven scales hiding inside the major scale')}
${guideIntro('modes')}

${section(1, 'Modes as rotations')}
${prose(`<p>Play the notes of C major but start and end on D: D E F G A B C D. Same 7 notes, but D is now home. The pattern of steps changes, so it <b>sounds different</b>. That's the <b>Dorian</b> mode. Starting on each of the 7 notes gives 7 modes:</p>`)}
${table(['Starts on degree', 'Mode', 'From C major', 'Formula'], MODES.map((m, k) => [k + 1, `<b>${m.name}</b>`, `${fmt(majorScale('C')[k])} – ${fmt(majorScale('C')[k])}`, m.degs.join(' ').replace(/b/g, '♭').replace(/#/g, '♯')]))}

${section(2, 'Modes as colours (the useful view)')}
${prose(`<p>Thinking "D Dorian = C major from D" explains where modes come from, but it hides what they <b>sound</b> like. Compare each mode with the major or minor scale <b>on the same root</b> and one note stands out, its <b>characteristic note</b>:</p>`)}
${table(['Mode', 'Compared with', 'Characteristic note', 'Home chord', 'Sound'], MODES.map(m => [`<b>${m.name}</b>`, m.vs, m.char ? `<b>${m.char.replace('b', '♭').replace('#', '♯')}</b>` : '(reference)', m.chord.replace('m7b5', 'm7♭5'), m.mood]))}
${prose(`<p><b>From brightest to darkest</b>, each step lowers exactly one note: <b>Lydian → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian</b>.</p>
<p><b>Mixolydian</b> is the scale of the <b>dominant 7th chord</b> (major 3rd + ♭7). Blues lives here and in <b>Dorian</b>, the minor mode with a brighter natural 6th.</p>`)}
${explorer('modes', 'Any mode on any root')}
${guideMid('modes')}
${quiz('modeParent', 'Find the parent scale')}
${quiz('modeChar', 'Characteristic notes')}
${quiz('earMode', 'Ear training: which mode?')}
${guideEnd('modes')}
</div>`});

// ── Pentatonic & blues scales ───────────────────────────────────────────────

const PENT_TYPES = [['minorPent', 'Minor pentatonic'], ['majorPent', 'Major pentatonic'], ['blues', 'Blues scale (minor + ♭5)'], ['majorBlues', 'Major blues (major + ♭3)']];
const BLUE_COL = '#1e5fa8';

EXPLORERS.pentatonic = {
  controls: () => selectCtl('root', 'Root', ROOTS, 'A') + selectCtl('type', 'Scale', PENT_TYPES, 'minorPent') +
    selectCtl('box', 'Position', [['all', 'whole neck'], ['1', 'Box 1'], ['2', 'Box 2'], ['3', 'Box 3'], ['4', 'Box 4'], ['5', 'Box 5']], '1'),
  render: st => {
    const degs = SCALES[st.type].degs, notes = scaleNotes(st.root, degs);
    const isMinor = st.type === 'minorPent' || st.type === 'blues';
    const rel = isMinor ? relativeMajor(st.root) : relativeMinor(st.root);
    const extraDeg = st.type === 'blues' ? 'b5' : st.type === 'majorBlues' ? 'b3' : null;
    const colorOf = d => d === extraDeg ? BLUE_COL : DEG_COL[degNum(d)];
    let focus = null, boxText = '';
    if (st.box !== 'all') {
      const b = pentBox(st.root, st.type, +st.box), keys = new Set(b.positions.map(p => p.s + ':' + p.f));
      const fs = b.positions.map(p => p.f), lo = Math.min(...fs), hi = Math.max(...fs);
      focus = (s, f) => keys.has(s + ':' + f);
      boxText = `<b>Box ${st.box}</b> starts on <b>${scaleNotes(st.root, SCALES[PENT_BASE[st.type]].degs)[st.box - 1]}</b> on the low E string (fret ${b.startFret}) and covers frets ${lo}–${hi}. Faded notes belong to the neighbouring boxes.`;
    }
    return `<p class="ex-sum"><b>${st.root} ${SCALES[st.type].name.toLowerCase()}</b>: ${notes.join(' ')}. Same five notes as <b>${rel} ${isMinor ? 'major' : 'minor'} pentatonic</b>${extraDeg ? ` (plus the blue note ${spellDeg(st.root, extraDeg)})` : ''}.</p>
      ${listen(playBtn({mode: 'scale', notes, drone: true}, 'over a drone'), playBtn({mode: 'scale', notes}, 'scale'))}
      ${chips(notes, {colors: degs.map(colorOf), under: degs, highlight: degs.map(d => d === extraDeg)})}
      <p class="cap">${boxText || 'All five boxes together cover the whole neck. Pick a box to see one shape.'}</p>
      ${noteMapSVG(degreeMarks(st.root, degs, {colorOf}), {frets: 15, focus})}`;
  }
};

const PENT_QUIZ_ROOTS = ['A','E','D','G','C','B','F#','F','Bb'];

QUIZZES.spellPent = () => {
  const root = pick(PENT_QUIZ_ROOTS), t = pick(['minorPent', 'majorPent']), answer = scaleNotes(root, SCALES[t].degs).join(' ');
  // distractors: the other pentatonic and near-miss five-note sets on the same root
  const near = [SCALES[t === 'minorPent' ? 'majorPent' : 'minorPent'].degs, ['1','3','4','5','7'], ['1','2','b3','5','b7'], ['1','b3','4','5','6'], ['1','2','4','5','6']];
  return {
    q: `Spell the <b>${root} ${t === 'minorPent' ? 'minor' : 'major'} pentatonic</b>.`,
    answer, options: optionsFor(answer, near.map(d => scaleNotes(root, d).join(' '))),
    why: `${t === 'minorPent' ? 'Minor pentatonic = 1 ♭3 4 5 ♭7' : 'Major pentatonic = 1 2 3 5 6'} from ${root}: ${answer}.`
  };
};

QUIZZES.relativePent = () => {
  const root = pick(PENT_QUIZ_ROOTS), answer = relativeMajor(root);
  return {
    q: `<b>${root} minor pentatonic</b> has exactly the same notes as which <b>major</b> pentatonic?`,
    answer, options: optionsFor(answer, CIRCLE_MAJOR),
    why: `Up a minor 3rd from ${root} is ${answer}. ${root} minor pentatonic (${scaleNotes(root, SCALES.minorPent.degs).join(' ')}) = ${answer} major pentatonic (${scaleNotes(answer, SCALES.majorPent.degs).join(' ')}) starting on a different note.`
  };
};

QUIZZES.boxStart = () => {
  const root = pick(PENT_QUIZ_ROOTS), k = 1 + Math.floor(Math.random() * 5), b = pentBox(root, 'minorPent', k);
  const answer = `fret ${b.startFret}`;
  return {
    q: `On the low E string, at which fret does <b>box ${k}</b> of <b>${root} minor pentatonic</b> start?`,
    answer, options: optionsFor(answer, Array.from({length: 16}, (_, f) => `fret ${f}`)),
    why: `Box ${k} starts on note ${k} of the scale (${scaleNotes(root, SCALES.minorPent.degs).join(' ')}): ${scaleNotes(root, SCALES.minorPent.degs)[k - 1]}, which is fret ${b.startFret} on the low E string.`
  };
};

QUIZZES.pentRemoved = () => {
  const items = [
    ['Which two degrees of the <b>major scale</b> does the <b>major pentatonic</b> leave out?', '4 and 7', 'The 4th and 7th are the notes a semitone away from their neighbours (3–4 and 7–8). Without them there are no semitones left.'],
    ['Which two degrees of the <b>natural minor</b> does the <b>minor pentatonic</b> leave out?', '2 and ♭6', 'The 2nd and ♭6 sit a semitone from ♭3 and 5. Removing them leaves only whole steps and minor 3rds.'],
    ['Which note turns the minor pentatonic into the <b>blues scale</b>?', '♭5', 'The ♭5 (tritone) squeezed between 4 and 5 is the "blue note".'],
    ['Which note turns the major pentatonic into the <b>major blues scale</b>?', '♭3', 'The ♭3, used as a passing note into the major 3rd: the sweet, B.B. King–style sound.'],
  ];
  const [q, answer, why] = pick(items);
  return {q, answer, options: optionsFor(answer, ['4 and 7', '2 and ♭6', '3 and 6', '2 and 5', '♭5', '♭3', '♭7', '♯4']), why};
};

THEORY_PAGES.splice(THEORY_PAGES.findIndex(p => p.id === 'modes'), 0, {id: 'pentatonic', group: 'Scales & keys', label: 'Pentatonic & blues', render: () => `
${pageHead('pentatonic', '5', 'Pentatonic & blues scales', 'five-note scales · relative pentatonics · the five boxes · the blue note')}
${guideIntro('pentatonic')}

${section(1, 'Five notes, no semitones')}
${prose(`<p>A <b>pentatonic</b> scale has five notes per octave. The two common ones are cut from the 7-note scales by removing exactly the notes that create <b>semitones</b>:</p>`)}
${table(['Scale', 'Formula', 'Removed from…', 'In A', 'Sound'], [
  ['<b>Major pentatonic</b>', '1 2 3 5 6', 'major scale: the <b>4</b> and <b>7</b>', 'A B C♯ E F♯', 'open, sweet, country, pop'],
  ['<b>Minor pentatonic</b>', '1 ♭3 4 5 ♭7', 'natural minor: the <b>2</b> and <b>♭6</b>', 'A C D E G', 'rock, blues, the classic solo sound'],
])}
${prose(`<p>With no semitones, every step is either a whole step or a minor 3rd. No two notes rub against each other, and none of them strongly needs to resolve. That's why the pentatonic sounds good over so many chords, and why it's usually the first scale guitarists learn for soloing.</p>
<p class="nerd">Nerd corner: the pentatonic is a stack of perfect 5ths. C–G–D–A–E is C major pentatonic: five neighbours on the circle of fifths. That makes it the most "consonant" five-note set there is, and it appears in folk music all over the world.</p>`)}

${section(2, 'Relative pentatonics: one shape, two sounds')}
${prose(`<p>Just like relative major and minor keys, <b>A minor pentatonic</b> (A C D E G) and <b>C major pentatonic</b> (C D E G A) contain <b>exactly the same notes</b>. The relative major pentatonic starts a minor 3rd above the minor root, or 3 frets higher.</p>
<p>So every box shape you learn is both scales at once. What decides the sound is which note you treat as <b>home</b>: the note you start and end phrases on, and which chord is underneath. Over A major, the same shape moved down 3 frets (F♯ minor pentatonic = A major pentatonic) gives the bright country/major sound.</p>`)}

${section(3, 'The five boxes')}
${prose(`<p>On the guitar the pentatonic falls into <b>five shapes</b> ("boxes" or "positions") that link up along the neck. Box 1 starts on the root on the low E string. Each next box starts on the next scale note, and the top of one box is the bottom of the next. After box 5 the pattern starts again at box 1, 12 frets higher.</p>
<p>Each box has <b>two notes per string</b>, so it fits under one hand. Where a box crosses from the G to the B string the pattern shifts by one fret, because that pair is tuned a major 3rd apart (see <i>Notes &amp; fretboard</i>). Learning all five means you're never stuck in box 1.</p>`)}
${explorer('pentatonic', 'Pentatonics on the neck')}

${section(4, 'The blues scales')}
${prose(`<ul>
<li><b>Blues scale</b> = minor pentatonic + <b>♭5</b> (1 ♭3 4 <b>♭5</b> 5 ♭7). The ♭5, the tritone, is the "blue note". Use it as a quick chromatic step between 4 and 5 (D → E♭ → E in A), not a note to sit on.</li>
<li><b>Major blues scale</b> = major pentatonic + <b>♭3</b> (1 2 <b>♭3</b> 3 5 6). Slide or hammer from the ♭3 into the major 3rd for the sweet, B.B. King / Allman Brothers sound.</li>
<li>Over a 12-bar blues, players mix the two. Minor pentatonic over a major chord puts the ♭3 against the chord's major 3rd, the "blue third" clash explored on the <a href="#A">Blues pages</a>. Bending the ♭3 slightly sharp is the classic way to play it.</li>
</ul>`)}
${guideMid('pentatonic')}
${quiz('spellPent', 'Spell the pentatonic')}
${quiz('relativePent', 'Relative pentatonics')}
${quiz('boxStart', 'Where does the box start?')}
${quiz('pentRemoved', 'How the scales are built')}
${guideEnd('pentatonic')}
</div>`});

// Ear training: major vs the three minors, and modes over a drone
QUIZZES.earMinor = () => {
  const types = ['major', 'naturalMinor', 'harmonicMinor', 'melodicMinor'], t = pick(types), root = pick(['C','D','E','F','G','A']);
  const name = x => x === 'major' ? 'Major' : SCALES[x].name.replace(' (ascending)', '');
  return {
    q: `Listen ${playBtn({mode: 'scale', notes: scaleNotes(root, SCALES[t].degs)})}. Which scale is it?`,
    answer: name(t), options: shuffle(types.map(name)),
    why: `${root} ${name(t).toLowerCase()}: ${SCALES[t].degs.join(' ')}. Listen to the 3rd (major or minor), then the 6th and 7th.`
  };
};

QUIZZES.earMode = () => {
  const set = ['lydian','ionian','mixolydian','dorian','aeolian','phrygian'], key = pick(set), m = MODES.find(x => x.key === key), root = pick(['A','D','E','G']);
  return {
    q: `Listen ${playBtn({mode: 'scale', notes: scaleNotes(root, m.degs), drone: true})} (over a ${root} drone). Which mode is it?`,
    answer: m.name, options: optionsFor(m.name, set.map(k => MODES.find(x => x.key === k).name)),
    why: `${root} ${m.name}: ${m.degs.join(' ')}${m.char ? `. Listen for the ${m.char}` : ''}.`
  };
};

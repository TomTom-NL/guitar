// ── Chords: construction, chords in a key, function & cadences ───────────────

// Colour per chord role: root, 3rd, 5th, 7th, extensions
const ROLE_COL = {1:'#1a5291', 2:'#0e7a7a', 3:'#b83800', 4:'#0e7a7a', 5:'#2d6a1e', 6:'#8b5e00', 7:'#6b2d8b'};
const DEG_TO_IV = {'1':'R', 'b3':'m3', '3':'M3', '2':'M2', '4':'P4', 'b5':'d5', '5':'P5', '#5':'A5', '6':'M6', 'bb7':'d7', 'b7':'m7', '7':'M7', '9':'M9', '13':'M13'};
const MAIN_CHORDS = ['maj','min','dim','aug','maj7','dom7','min7','m7b5','dim7'];
const QUIZ_CHORD_ROOTS = ['C','D','E','F','G','A','B','Bb','Eb','Ab','F#'];

function roleColor(root, type) {
  const notes = chordNotes(root, type), degs = CHORD_TYPES[type].degs;
  return n => ROLE_COL[degNum(degs[notes.indexOf(n)] || '1')] || '#888';
}

// Chord diagram card for a root/type, coloured by a note → colour function
function chordDiagram(root, type, tag, colorOf) {
  const cfg = chordCfg(root, type, tag);
  if (!cfg) return `<div class="citem prog-empty">no shape for ${chordLabel(root, type)} yet</div>`;
  return `<div class="cd">${chordCard(cfg, colorMap(cfg.names, colorOf))}${playBtn({mode: 'chord', notes: chordNotes(root, type)})}</div>`;
}

// ── Chord construction ──────────────────────────────────────────────────────

EXPLORERS.chordBuilder = {
  controls: () => selectCtl('root', 'Root', ROOTS, 'C') +
    selectCtl('type', 'Type', Object.entries(CHORD_TYPES).filter(([k]) => k !== 'augMaj7').map(([k, t]) => [k, `${t.name} (${t.sym || 'maj'})`]), 'dom7'),
  render: st => {
    const t = CHORD_TYPES[st.type], notes = chordNotes(st.root, st.type), col = roleColor(st.root, st.type);
    const inversions = ['triad', 'seventh', 'sixth'].includes(t.family)
      ? notes.slice(1).map((n, i) => `<li>${['1st', '2nd', '3rd'][i]} inversion (${['3rd', '5th', '7th'][i]} in the bass): <b>${chordLabel(st.root, st.type)}/${fmt(n)}</b> → ${[...notes.slice(i + 1), ...notes.slice(0, i + 1)].map(fmt).join(' ')}</li>`).join('') : '';
    return `<p class="ex-sum"><b>${chordLabel(st.root, st.type)}</b>: ${t.name.toLowerCase()} chord. Formula <b>${t.degs.join(' ').replace(/b/g, '♭').replace(/#/g, '♯')}</b>.</p>
      ${listen(playBtn({mode: 'chord', notes}, 'strum'), playBtn({mode: 'chord', notes, arp: true}, 'one note at a time'))}
      ${chips(notes, {colors: notes.map(col), under: t.degs.map(d => DEG_TO_IV[d] || d)})}
      <div class="cb-row"><div class="cpair">${chordDiagram(st.root, st.type, t.name.toLowerCase(), col)}</div>
        <div class="cb-text">${inversions ? `<ul class="ex-list"><li>Root position: <b>${notes.map(fmt).join(' ')}</b></li>${inversions}</ul>` : '<p>Extended chords are usually voiced with notes left out (often the 5th, sometimes the root). The diagram shows one common grip.</p>'}</div></div>
      <p class="cap">Where the chord tones live on the neck (colour = role: <span style="color:${ROLE_COL[1]}">root</span>, <span style="color:${ROLE_COL[3]}">3rd</span>, <span style="color:${ROLE_COL[5]}">5th</span>, <span style="color:${ROLE_COL[7]}">7th</span>, <span style="color:${ROLE_COL[2]}">9th</span>). Play them in any order across the neck and you're playing an <b>arpeggio</b>.</p>
      ${noteMapSVG(degreeMarks(st.root, t.degs, {colorOf: d => ROLE_COL[degNum(d)]}))}`;
  }
};

QUIZZES.spellChord = () => {
  const root = pick(QUIZ_CHORD_ROOTS), type = pick(MAIN_CHORDS), answer = chordNotes(root, type).join(' ');
  return {
    q: `Spell <b>${chordLabel(root, type)}</b> (${CHORD_TYPES[type].name.toLowerCase()}).`,
    answer, options: optionsFor(answer, MAIN_CHORDS.map(t => chordNotes(root, t).join(' '))),
    why: `Formula ${CHORD_TYPES[type].degs.join(' ')} from ${root}: ${answer}.`
  };
};

QUIZZES.nameChord = () => {
  const root = pick(QUIZ_CHORD_ROOTS), type = pick(MAIN_CHORDS), answer = chordLabel(root, type);
  return {
    q: `Which chord is <b>${chordNotes(root, type).join(' ')}</b>?`,
    answer, options: optionsFor(answer, MAIN_CHORDS.map(t => chordLabel(root, t))),
    why: `Stacked in thirds from ${root}: ${CHORD_TYPES[type].degs.map(d => DEG_TO_IV[d]).join(' · ')} → ${CHORD_TYPES[type].name.toLowerCase()}.`
  };
};

QUIZZES.chordFormula = () => {
  const type = pick(MAIN_CHORDS), f = t => CHORD_TYPES[t].degs.join(' ');
  return {
    q: `What is the formula of a <b>${CHORD_TYPES[type].name.toLowerCase()}</b> chord (symbol <b>${CHORD_TYPES[type].sym || 'none, just the root'}</b>)?`,
    answer: f(type), options: optionsFor(f(type), MAIN_CHORDS.map(f)),
    why: `${CHORD_TYPES[type].name}: ${f(type)}. In C: ${chordNotes('C', type).join(' ')}.`
  };
};

THEORY_PAGES.push({id: 'chords', group: 'Chords', label: 'Chord construction', render: () => `
${pageHead('chords', '△', 'Chord construction', 'stacking thirds · triads · 7ths · extensions · inversions')}
${guideIntro('chords')}

${section(1, 'Chords are stacked thirds')}
${prose(`<p>Take a root, add the note a 3rd above it, then another 3rd on top. That's a <b>triad</b>: root, 3rd, 5th. Chords are written as <b>formulas</b> relative to the major scale of their root, so you can build any chord on any root.</p>
<ul><li>The <b>3rd</b> decides <b>major</b> (M3, 4 semitones) or <b>minor</b> (m3, 3 semitones).</li>
<li>The <b>5th</b> is normally perfect. Squeeze it to a ♭5 and you get <b>diminished</b>; stretch it to a ♯5 and you get <b>augmented</b>.</li></ul>`)}
${table(['Type', 'Symbol', 'Formula', 'Stack (bottom → top)', 'In C', 'Sound'], [
  ['Major', 'C', '1 3 5', 'M3 + m3', 'C E G', 'stable, bright'],
  ['Minor', 'Cm', '1 ♭3 5', 'm3 + M3', 'C E♭ G', 'stable, dark'],
  ['Diminished', 'C°', '1 ♭3 ♭5', 'm3 + m3', 'C E♭ G♭', 'tense, wants to move'],
  ['Augmented', 'C+', '1 3 ♯5', 'M3 + M3', 'C E G♯', 'restless, dreamy'],
  ['Sus2 / Sus4', 'Csus2 / Csus4', '1 2 5 / 1 4 5', 'not thirds', 'C D G / C F G', 'open, "suspended", no major/minor'],
])}

${section(2, 'Seventh chords')}
${prose(`<p>Stack one more 3rd and you get a <b>7th chord</b>. Five types cover almost everything:</p>`)}
${table(['Type', 'Symbol', 'Formula', 'In C', 'Where it occurs naturally'], [
  ['Major 7th', 'Cmaj7', '1 3 5 7', 'C E G B', 'I and IV of a major key: lush, jazzy'],
  ['Dominant 7th', 'C7', '1 3 5 ♭7', 'C E G B♭', 'V of a major key: tension that resolves (and all over the blues)'],
  ['Minor 7th', 'Cm7', '1 ♭3 5 ♭7', 'C E♭ G B♭', 'ii, iii and vi of a major key: mellow'],
  ['Half-diminished', 'Cø7 = Cm7♭5', '1 ♭3 ♭5 ♭7', 'C E♭ G♭ B♭', 'vii of a major key, ii of a minor key'],
  ['Diminished 7th', 'C°7', '1 ♭3 ♭5 𝄫7', 'C E♭ G♭ B𝄫 (= A)', 'vii of harmonic minor: built from minor 3rds only, perfectly symmetrical'],
])}
${prose(`<p class="callout"><b>B°, Bø7 or B°7?</b> (the question from your teacher's sheet)<br>
<b>B°</b> = B D F (triad). <b>Bø7</b> = B D F <b>A</b>: the 7th is a <b>minor 7th</b>. <b>B°7</b> = B D F <b>A♭</b>: the 7th is a <b>diminished 7th</b>, a semitone lower.<br>
Only <b>Bø7</b> fits in C major (A is in the key, A♭ isn't). B°7 belongs to C minor / A harmonic minor territory.</p>`)}

${section(3, '6ths, 9ths and beyond')}
${prose(`<ul>
<li><b>Extensions</b> keep stacking 3rds past the octave: <b>9</b> = the 2nd an octave up, <b>11</b> = the 4th, <b>13</b> = the 6th.</li>
<li>A <b>9 chord</b> (C9) includes the ♭7. <b>add9</b> (Cadd9) is just a triad plus the 9th, with no 7th. A <b>6 chord</b> (C6) adds the 6th, with no 7th.</li>
<li>On guitar you rarely play every note. The 5th is the first to go, then the root (the bass player has it). In a 13 chord the 11th is usually left out because it clashes with the 3rd.</li>
</ul>`)}

${section(4, 'Inversions, voicings and slash chords')}
${prose(`<ul>
<li><b>Root position:</b> the root is the lowest note. <b>1st inversion:</b> the 3rd is in the bass. <b>2nd inversion:</b> the 5th is. (<b>3rd inversion:</b> the 7th, for 7th chords.)</li>
<li><b>Slash chords</b> name the bass note: <b>C/E</b> = C major with E in the bass (1st inversion). The bass can even be a non-chord note (D/C).</li>
<li>A <b>voicing</b> is the exact order, octave and doubling of the notes. Open C (x32010) voices C major as C E G C E. Every guitar shape is one voicing of its chord.</li>
<li><b>Naming a chord from its notes:</b> rearrange them into stacked 3rds. The bottom of the stack is the root. E G C → C E G = C major (1st inversion).</li>
</ul>`)}
${explorer('chordBuilder', 'Build any chord')}
${guideMid('chords')}
${quiz('spellChord', 'Spell the chord')}
${quiz('nameChord', 'Name the chord')}
${quiz('chordFormula', 'Chord formulas')}
${quiz('earTriad', 'Ear training: chord quality')}
${guideEnd('chords')}
</div>`});

// ── Chords in a key ─────────────────────────────────────────────────────────

const FUNC_COL = {T: '#1a5291', S: '#2d6a1e', D: '#b83800'};

EXPLORERS.keyChords = {
  controls: () => selectCtl('key', 'Key', CIRCLE_MAJOR.map(k => [k, fmt(k) + ' major']), 'C') +
    selectCtl('view', 'Show', [['triads', 'Triads'], ['sevenths', 'Seventh chords']], 'triads'),
  render: st => {
    const sc = majorScale(st.key), triads = diatonicChords(sc, false), chords = st.view === 'sevenths' ? diatonicChords(sc, true) : triads;
    const keyCol = n => { const i = sc.indexOf(n); return i < 0 ? '#888' : DEG_COL[i + 1]; };
    const top = chords.map(c => chordDiagram(c.root, c.type, c.numeral, keyCol)).join('');
    const func = chords.map((c, i) => { const f = FUNCTION_OF_DEGREE[i]; return `<div class="func" style="color:${FUNC_COL[f]}">${FUNCTION_NAMES[f].split(' ')[0]}</div>`; }).join('');
    const sec = triads.map((c, i) => {
      const r = secondaryDominant(c.root);
      return chordDiagram(r, 'dom7', i === 0 ? 'V7' : `V7/${c.numeral}`, keyCol);
    }).join('');
    const arrows = triads.map(c => `<div class="prog-arrow">↑ resolves to ${c.label}</div>`).join('');
    return `<p class="ex-sum"><b>${st.key} major</b>: ${chords.map(c => `${c.label} <span class="dim">(${c.numeral})</span>`).join(' · ')}</p>
      ${listen(playBtn({mode: 'prog', steps: chords.map(c => c.notes), beat: 0.9}, 'all seven'), playBtn({mode: 'prog', steps: [0, 5, 3, 4, 0].map(i => chords[i].notes)}, 'I–vi–IV–V–I'), playBtn({mode: 'prog', steps: [triads[0].notes, chordNotes(secondaryDominant(triads[1].root), 'dom7'), triads[1].notes, chordNotes(triads[4].root, 'dom7'), triads[0].notes]}, `I–V7/ii–ii–V7–I`))}
      <div class="prog-wrap">
        <div class="prog-grid">${top}</div>
        <div class="prog-grid">${func}</div>
        <div class="sl" style="margin:14px 0 4px">Secondary dominants: the V7 of each chord above</div>
        <div class="prog-grid">${arrows}</div>
        <div class="prog-grid">${sec}</div>
      </div>
      <p class="cap">Dot colours follow the scale degree in ${st.key} major; <b>grey dots are notes outside the key</b>. In a secondary dominant that grey note is usually the leading tone into its target.${st.key === 'C' ? ' C uses the shapes from your teacher\'s sheet (Bø7 x2323x, F♯7 2x232x).' : ''}</p>`;
  }
};

QUIZZES.keyChord = () => {
  const k = pick(CIRCLE_MAJOR), i = Math.floor(Math.random() * 7), cs = diatonicChords(majorScale(k), false), answer = cs[i].label;
  return {
    q: `In <b>${k} major</b>, what is the <b>${cs[i].numeral}</b> chord?`,
    answer, options: optionsFor(answer, [...cs.map(c => c.label), chordLabel(cs[i].root, cs[i].type === 'maj' ? 'min' : 'maj')]),
    why: `${k} major: ${cs.map(c => `${c.numeral} = ${c.label}`).join(', ')}.`
  };
};

QUIZZES.secDom = () => {
  const k = pick(['C','G','D','F','A','Bb','E','Eb']), cs = diatonicChords(majorScale(k), false), i = 1 + Math.floor(Math.random() * 5);
  const answer = chordLabel(secondaryDominant(cs[i].root), 'dom7');
  return {
    q: `In <b>${k} major</b>, what is <b>V7/${cs[i].numeral}</b> (the chord that leads into ${cs[i].label})?`,
    answer, options: optionsFor(answer, cs.map(c => chordLabel(secondaryDominant(c.root), 'dom7')).concat(cs.map(c => chordLabel(c.root, 'dom7')))),
    why: `Go up a perfect 5th from ${cs[i].root} → ${secondaryDominant(cs[i].root)}, and make it a dominant 7th: ${answer}.`
  };
};

THEORY_PAGES.push({id: 'inkey', group: 'Chords', label: 'Chords in a key', render: () => `
${pageHead('inkey', 'I', 'Chords in a key', 'the diatonic family · numerals · secondary dominants')}
${guideIntro('inkey')}

${section(1, 'The family of seven chords')}
${prose(`<p>Build a triad on every note of a major scale, using only notes from that scale, and the qualities always come out the same:</p>
<p class="big">I &nbsp;ii &nbsp;iii &nbsp;IV &nbsp;V &nbsp;vi &nbsp;vii°</p>
<p><b>Roman numerals</b> name chords by scale degree, independent of key: CAPITALS are major, lowercase minor, ° diminished. That's why musicians say "a I–IV–V" or "a ii–V–I" instead of naming chords. The numerals work in every key.</p>
<p>As 7th chords the pattern becomes <b>Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7</b>. Only one chord is a dominant 7th, the V7. That makes V7 a strong signal of the key.</p>`)}
${prose(`<p>Under each chord is its <b>function</b> (explained on <i>Function &amp; cadences</i>): <span style="color:${FUNC_COL.T}"><b>Tonic</b></span> = home, <span style="color:${FUNC_COL.S}"><b>Subdominant</b></span> = moving away, <span style="color:${FUNC_COL.D}"><b>Dominant</b></span> = tension that wants to resolve home.</p>`)}
${LEARN.chordDiagram()}
${explorer('keyChords', 'Chords in any major key')}

${section(2, 'Secondary dominants')}
${prose(`<p>V7 → I is the strongest pull in tonal music. A <b>secondary dominant</b> borrows that pull for another chord of the key: play the V7 <i>of that chord</i> right before it, and for a moment that chord feels like home. This is called <b>tonicization</b>.</p>
<ul><li><b>How to find one:</b> go up a perfect 5th from the target's root and play a dominant 7th there. Target Dm in C: D → A, so <b>A7</b> (written <b>V7/ii</b>, "five of two").</li>
<li><b>Why it works:</b> the dominant's 3rd is the leading tone of the target. A7 contains C♯, a semitone below D. That note isn't in the key (it's grey in the diagrams), which is what makes the move sound so purposeful.</li>
<li>V7/I is just the key's own V7. V7/vii° is mostly theoretical: a diminished chord isn't stable enough to feel like a temporary home.</li></ul>
<p><b>Try in C:</b> C → <b>A7</b> → Dm → G7 → C, or C → <b>E7</b> → Am → <b>D7</b> → G → C.</p>`)}
${guideMid('inkey')}
${quiz('keyChord', 'Chords of a key')}
${quiz('secDom', 'Secondary dominants')}
${guideEnd('inkey')}
</div>`});

// ── Function & cadences ─────────────────────────────────────────────────────

const CADENCES = {
  authentic: {name: 'Authentic (perfect)', chords: [['5', 'dom7', 'V7'], ['1', 'maj', 'I']], text: 'V → I. The strongest ending: a full stop.'},
  plagal:    {name: 'Plagal ("Amen")',     chords: [['4', 'maj', 'IV'], ['1', 'maj', 'I']], text: 'IV → I. A softer, gospel/hymn ending: the "A-men" at the end of a hymn.'},
  half:      {name: 'Half',               chords: [['2', 'min', 'ii'], ['5', 'maj', 'V']], text: 'Anything → V. Stops on the tension, like a comma or a question.'},
  deceptive: {name: 'Deceptive',          chords: [['5', 'dom7', 'V7'], ['6', 'min', 'vi']], text: 'V → vi. Sets up I, then lands on its relative minor instead: a musical plot twist.'},
};

const PROGRESSIONS = {
  pop:     {name: 'I–V–vi–IV (pop)',          steps: [['1','maj'],['5','maj'],['6','min'],['4','maj']]},
  doowop:  {name: 'I–vi–IV–V (50s)',          steps: [['1','maj'],['6','min'],['4','maj'],['5','maj']]},
  twofive: {name: 'ii–V–I (jazz)',            steps: [['2','min7'],['5','dom7'],['1','maj7']]},
  sad:     {name: 'vi–IV–I–V',                steps: [['6','min'],['4','maj'],['1','maj'],['5','maj']]},
  circle:  {name: 'iii–vi–ii–V–I (circle)',   steps: [['3','min7'],['6','min7'],['2','min7'],['5','dom7'],['1','maj7']]},
  blues:   {name: '12-bar blues',             steps: [['1','dom7'],['1','dom7'],['1','dom7'],['1','dom7'],['4','dom7'],['4','dom7'],['1','dom7'],['1','dom7'],['5','dom7'],['4','dom7'],['1','dom7'],['5','dom7']]},
  mixo:    {name: 'I–♭VII–IV (borrowed ♭VII)', steps: [['1','maj'],['b7','maj'],['4','maj']]},
};

function stepNumeral(deg, type) {
  const d = parseDeg(deg), base = roman(d.num, type);
  return (deg.startsWith('b') ? '♭' : deg.startsWith('#') ? '♯' : '') + base;
}

EXPLORERS.voiceLead = {
  controls: () => selectCtl('key', 'Key', CIRCLE_MAJOR.map(k => [k, fmt(k) + ' major']), 'C'),
  render: st => {
    const k = st.key, n = d => spellDeg(k, d);
    const rows = [
      ['3rd of V7 (leading tone, degree 7)', n('7'), n('1'), 'up a semitone', true],
      ['7th of V7 (degree 4)', n('4'), n('3'), 'down a semitone', true],
      ['5th of V7 (degree 2)', n('2'), n('1'), 'down a whole step', false],
      ['root of V7 (degree 5)', n('5'), n('1'), 'down a 5th (or stays as the 5th of I)', false],
    ];
    return `<p class="ex-sum"><b>${chordLabel(n('5'), 'dom7')} → ${fmt(k)}</b> in ${fmt(k)} major. The two highlighted notes form a <b>tritone</b> (${n('7')}–${n('4')}, a ${intervalBetween(n('7'), n('4')).name.toLowerCase()}) and both move by a semitone.</p>
      ${listen(playBtn({mode: 'prog', steps: [chordNotes(n('5'), 'dom7'), chordNotes(k, 'maj')], beat: 1.6}, 'V7 → I'))}
      <div class="tbl-wrap"><table class="ref vl"><thead><tr><th>Voice</th><th>${chordLabel(n('5'), 'dom7')}</th><th></th><th>${fmt(k)}</th><th>Motion</th></tr></thead><tbody>
      ${rows.map(([v, a, b, m, hot]) => `<tr${hot ? ' class="hot"' : ''}><td>${v}</td><td><b>${a}</b></td><td>→</td><td><b>${b}</b></td><td>${m}</td></tr>`).join('')}
      </tbody></table></div>`;
  }
};

EXPLORERS.cadence = {
  controls: () => selectCtl('key', 'Key', CIRCLE_MAJOR.map(k => [k, fmt(k) + ' major']), 'C') +
    selectCtl('cad', 'Cadence', Object.entries(CADENCES).map(([k, c]) => [k, c.name]), 'authentic'),
  render: st => {
    const c = CADENCES[st.cad], sc = majorScale(st.key), keyCol = n => { const i = sc.indexOf(n); return i < 0 ? '#888' : DEG_COL[i + 1]; };
    return `<p class="ex-sum"><b>${c.name}</b> in ${fmt(st.key)}: ${c.chords.map(([d, t, num]) => `${chordLabel(spellDeg(st.key, d), t)} (${num})`).join(' → ')}. ${c.text}</p>
      ${listen(playBtn({mode: 'prog', steps: c.chords.map(([d, t]) => chordNotes(spellDeg(st.key, d), t)), beat: 1.4}, 'hear the cadence'))}
      <div class="cpair">${c.chords.map(([d, t, num]) => chordDiagram(spellDeg(st.key, d), t, num, keyCol)).join('<div class="arrow-big">→</div>')}</div>`;
  }
};

EXPLORERS.progression = {
  controls: () => selectCtl('key', 'Key', CIRCLE_MAJOR.map(k => [k, fmt(k) + ' major']), 'G') +
    selectCtl('prog', 'Progression', Object.entries(PROGRESSIONS).map(([k, p]) => [k, p.name]), 'twofive'),
  render: st => {
    const p = PROGRESSIONS[st.prog], sc = majorScale(st.key), keyCol = n => { const i = sc.indexOf(n); return i < 0 ? '#888' : DEG_COL[i + 1]; };
    const seq = p.steps.map(([d, t]) => ({root: spellDeg(st.key, d), type: t, num: stepNumeral(d, t)}));
    const uniq = [...new Map(seq.map(c => [c.root + c.type, c])).values()];
    return `${listen(playBtn({mode: 'prog', steps: seq.map(c => chordNotes(c.root, c.type)), beat: seq.length > 8 ? 0.75 : 1.1}, 'play it'))}<div class="prog-seq">${seq.map(c => `<div class="ps"><b>${chordLabel(c.root, c.type)}</b><span>${c.num}</span></div>`).join('')}</div>
      <div class="cpair">${uniq.map(c => chordDiagram(c.root, c.type, c.num, keyCol)).join('')}</div>`;
  }
};

QUIZZES.cadenceName = () => {
  const key = pick(Object.keys(CADENCES)), c = CADENCES[key];
  return {
    q: `A phrase ends <b>${c.chords.map(x => x[2]).join(' → ')}</b>. Which cadence is that?`,
    answer: c.name, options: optionsFor(c.name, Object.values(CADENCES).map(x => x.name)), why: c.text
  };
};

QUIZZES.functionOf = () => {
  const i = Math.floor(Math.random() * 7), cs = diatonicChords(majorScale('C'), false), answer = FUNCTION_NAMES[FUNCTION_OF_DEGREE[i]];
  return {
    q: `What is the usual function of the <b>${cs[i].numeral}</b> chord?`,
    answer, options: Object.values(FUNCTION_NAMES),
    why: `Tonic: I, vi, iii · Subdominant: IV, ii · Dominant: V, vii°. ${i === 2 ? '(iii is the weakest tonic, sometimes heard as dominant because it shares two notes with V.)' : ''}`
  };
};

QUIZZES.transpose = () => {
  const k = pick(CIRCLE_MAJOR), p = PROGRESSIONS[pick(['pop','twofive','doowop','sad'])];
  const line = key => p.steps.map(([d, t]) => chordLabel(spellDeg(key, d), t)).join(' ');
  const answer = line(k);
  return {
    q: `Transpose <b>${p.name.split(' (')[0]}</b> to <b>${fmt(k)} major</b>.`,
    answer, options: optionsFor(answer, CIRCLE_MAJOR.map(line)),
    why: `Same numerals, new key: in ${fmt(k)}, ${p.steps.map(([d, t]) => `${stepNumeral(d, t)} = ${chordLabel(spellDeg(k, d), t)}`).join(', ')}.`
  };
};

THEORY_PAGES.push({id: 'function', group: 'Chords', label: 'Function & cadences', render: () => `
${pageHead('function', 'V', 'Function & cadences', 'why chords move the way they do')}
${guideIntro('function')}

${section(1, 'Three jobs a chord can do')}
${prose(`<p>Every chord in a key has a <b>function</b>, a role in the story of tension and release:</p>`)}
${table(['Function', 'Chords', 'Job', 'Feels like'], [
  [`<b style="color:${FUNC_COL.T}">Tonic (T)</b>`, 'I, vi, (iii)', 'home base', 'rest, arrival'],
  [`<b style="color:${FUNC_COL.S}">Subdominant (S)</b>`, 'IV, ii', 'leaves home, prepares the dominant', 'moving, opening up'],
  [`<b style="color:${FUNC_COL.D}">Dominant (D)</b>`, 'V, V7, vii°', 'maximum tension, points back home', 'leaning, unresolved'],
])}
${prose(`<p>Chords with the same function share notes (vi shares two with I; ii shares two with IV), so they can stand in for each other. The classic motion is <b>T → S → D → T</b>: I–IV–V–I, I–ii–V–I, I–vi–ii–V–I…</p>`)}

${section(2, 'Why the dominant pulls home')}
${prose(`<ul>
<li><b>The leading tone:</b> V contains the 7th degree, a semitone below the tonic. A semitone is the smallest step, and the ear expects it to finish the job.</li>
<li><b>The 7th of V7</b> is the 4th degree, a semitone above the 3rd of I. It wants to fall.</li>
<li>Together those two notes form a <b>tritone</b>, the most unstable interval. In the resolution they move in opposite directions by a semitone each and collapse into the stable 3rd of the tonic chord.</li>
<li>Meanwhile the root falls a 5th (G → C), the strongest bass motion there is.</li>
</ul>`)}
${explorer('voiceLead', 'Voice leading V7 → I')}

${section(3, 'Cadences: musical punctuation')}
${prose(`<p>A <b>cadence</b> is how a phrase ends. Four types cover most music:</p>`)}
${table(['Cadence', 'Chords', 'Punctuation'], Object.values(CADENCES).map(c => [`<b>${c.name}</b>`, c.chords.map(x => x[2]).join(' → '), c.text]))}
${explorer('cadence', 'Hear each cadence in any key')}

${section(4, 'Progressions and transposing')}
${prose(`<p>Because numerals describe <b>function</b> rather than pitch, a progression is a recipe you can cook in any key. Transposing a song = keep the numerals, change the key. The ♭VII in the last progression is <b>borrowed</b> from the parallel minor (Mixolydian territory): a very common rock move.</p>`)}
${explorer('progression', 'Progressions in any key')}
${guideMid('function')}
${quiz('functionOf', 'Chord functions')}
${quiz('cadenceName', 'Name the cadence')}
${quiz('transpose', 'Transpose it')}
${quiz('earCadence', 'Ear training: name the cadence')}
${guideEnd('function')}
</div>`});

// Ear training: chord quality and cadences
QUIZZES.earTriad = () => {
  const types = pick([['maj','min','dim','aug'], ['maj7','dom7','min7','m7b5']]), type = pick(types), root = pick(['C','D','E','F','G','A']);
  const answer = CHORD_TYPES[type].name;
  return {
    q: `Listen ${playBtn({mode: 'chord', notes: chordNotes(root, type)})} ${playBtn({mode: 'chord', notes: chordNotes(root, type), arp: true}, 'slowly')}. What kind of chord is it?`,
    answer, options: shuffle(types.map(t => CHORD_TYPES[t].name)),
    why: `${chordLabel(root, type)} (${chordNotes(root, type).join(' ')}): ${CHORD_TYPES[type].degs.join(' ')}.`
  };
};

QUIZZES.earCadence = () => {
  const key = pick(Object.keys(CADENCES)), c = CADENCES[key], k = pick(['C','G','D','F','A']);
  // lead-in chord so the ear hears the key first
  const steps = [chordNotes(k, 'maj'), ...c.chords.map(([d, t]) => chordNotes(spellDeg(k, d), t))];
  return {
    q: `Listen ${playBtn({mode: 'prog', steps, beat: 1.3})} (the first chord is just I, to set the key). How does the phrase end?`,
    answer: c.name, options: shuffle(Object.values(CADENCES).map(x => x.name)),
    why: `${c.chords.map(x => x[2]).join(' → ')} in ${k}: ${c.text}`
  };
};

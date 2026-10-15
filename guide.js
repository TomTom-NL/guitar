// ── Guided learning path ─────────────────────────────────────────────────────
// Every page opens with why it matters, what you'll be able to do and what it
// builds on, and closes with key takeaways, practice and the next step.
// guideIntro(id) goes under the page banner; guideMid(id) before the final
// quizzes; guideEnd(id) at the very bottom.

const PATH = ['notes', 'intervals', 'major', 'fifths', 'minor', 'pentatonic', 'modes', 'chords', 'inkey', 'function', 'A', 'E', 'C', 'review'];

const GUIDE = {
  notes: {
    why: `Every scale, chord and solo is built from the same 12 notes. Once you know where they are on the neck, the shapes you've memorised turn into music you understand, and anything you learn in one key can be moved to any other.`,
    goals: ['Name all 12 notes and explain sharps, flats and enharmonic spellings', 'Find any note on the low E and A strings within a few seconds', 'Use octave shapes to find that note anywhere on the neck'],
    builds: [],
    takeaways: ['7 letters, 12 notes. <b>E–F</b> and <b>B–C</b> have no note between them.', 'One fret = one semitone. Fret 12 = the octave, where the pattern repeats.', 'C♯ and D♭ are the same pitch. The right name depends on the key, because a scale uses <b>each letter once</b>.', 'Strings are tuned a 4th apart (5 frets), except <b>G → B</b>, a major 3rd (4 frets).', 'Octave shape: two strings up, two frets higher (three when you cross the B string).'],
    practice: [
      ['guitar', 'Natural-note walk: on the low E string play every natural note from fret 0 to 12, saying the names (E F G A B C D E). Repeat on the A string. Then name a random note and find it on both strings in under 3 seconds.'],
      ['ear', 'Octave check: play a note on the low E string, then its octave two strings up and two frets higher. They should sound like the "same" note. Do this for five notes, then try the three-fret shape from the D and G strings.'],
      ['music', 'Take a song you are learning and name the root of every barre chord from the fret its lowest note is on (a barre at fret 5 on the low E = A).'],
    ],
    next: 'Now that you can name notes, the next step is measuring the distance between them.',
  },
  intervals: {
    why: `Intervals are the DNA of music: every chord is a stack of intervals and every melody is a chain of them. Learn their names, sounds and shapes and you start hearing <i>why</i> a riff sounds tense or a chord sounds sad.`,
    goals: ['Name any interval by its number and quality', 'Recognise the sound of 3rds, 4ths, 5ths and the tritone', 'Play every interval as a movable shape on the neck'],
    builds: ['notes'],
    takeaways: ['<b>Number</b> = letters counted including both ends. <b>Quality</b> = exact semitones.', 'Perfect: 1, 4, 5, 8. Major/minor: 2, 3, 6, 7. Minor is one semitone smaller than major.', 'The <b>tritone</b> (6 semitones) is the most unstable interval.', 'Inversions add up to 9 and flip the quality (M3 ↔ m6).', 'Every interval is a fixed shape across two neighbouring strings.'],
    practice: [
      ['guitar', 'Shape drill: from A on the low E string (fret 5) play the M3, P4, P5 and octave using the "next string up" shapes in the table. Then move the same shapes to G (fret 3) and C (fret 8).'],
      ['ear', 'Press ▶ on each row of the table and hum along, linking each interval to its song. Then do the ear-training quiz below until you get major vs minor 3rds right 8 times out of 10.'],
      ['music', 'Find the first two notes of a melody you know (Happy Birthday, a riff, a vocal line) on one string and name the interval between them.'],
    ],
    next: 'A scale is a fixed pattern of intervals. Next up is the one everything else is measured against.',
  },
  major: {
    why: `The major scale is the ruler the rest of theory is measured with: chords, other scales and modes are all described against it (♭3, ♯4…). Knowing how it's built lets you work out any key instead of memorising it.`,
    goals: ['Build any major scale from W W H W W W H', 'Name the seven scale degrees and what each one does', 'Work out any key signature with the two shortcuts'],
    builds: ['intervals'],
    takeaways: ['Major scale = <b>W W H W W W H</b>. The half steps sit between 3–4 and 7–8.', 'Write the letters first, then add sharps or flats: each letter appears once.', 'A key uses only sharps or only flats.', 'Sharps arrive in the order F C G D A E B; flats in the reverse order.', 'Last sharp + a semitone = the key. Second-to-last flat = the key.'],
    practice: [
      ['guitar', 'One-string scales: play G major on the G string from the open string to fret 12 (W W H W W W H), saying the note names. Then D major on the D string.'],
      ['ear', 'Press ▶ on the scale in the explorer and sing it back with numbers (1 2 3 4 5 6 7 8). Then sing just 1–3–5–8: that is the major chord hiding in the scale.'],
      ['music', 'Look up the key of a song you are learning, write out its major scale, and check that the roots of its chords are in it.'],
    ],
    next: 'Twelve keys, each with its own signature. The circle of fifths shows how they all fit together.',
  },
  fifths: {
    why: `The circle of fifths is a map of all keys. It tells you instantly how many sharps or flats a key has, which chords belong together, which keys are close neighbours, and why so many progressions move the way they do.`,
    goals: ['Draw the circle from memory: C G D A E B F♯ one way, F B♭ E♭ A♭ D♭ the other', 'Read a key\'s I, IV, V and its ii, iii, vi straight off the circle', 'Explain why chords moving anticlockwise sound like resolution'],
    builds: ['major'],
    takeaways: ['Clockwise = up a 5th = one more sharp (the new sharp is the new key\'s 7th degree).', 'Anticlockwise = up a 4th = one more flat (the new flat is the new key\'s 4th degree).', 'The inner ring shows each key\'s relative minor.', 'A key\'s chords form a slice: IV · I · V outside, ii · vi · iii inside (plus vii°).', 'Neighbouring keys share 6 of their 7 notes.'],
    practice: [
      ['guitar', 'Circle walk: play a major chord on every key going clockwise (C G D A E B F♯…), then anticlockwise (C F B♭ E♭…). Notice that the anticlockwise direction sounds like each chord "resolves" into the next.'],
      ['ear', 'In the explorer press ▶ on I–IV–V–I for C, then for G (its neighbour), then for F♯ (opposite side). The neighbour feels related; the far key feels like a different world.'],
      ['music', 'Find the chords of a song you know on the circle. Most songs stay inside one slice; spot any chord that falls outside it.'],
    ],
    next: 'The inner ring is the other half of the story: minor keys and the three minor scales.',
  },
  minor: {
    why: `Half of all music is in minor. The three minor scales explain why minor songs borrow a major V chord, why harmonic minor sounds "exotic", and how a relative major and minor share every note.`,
    goals: ['Tell relative minor from parallel minor', 'Build natural, harmonic and melodic minor on any root', 'Explain why the V chord in a minor key is usually major (E7 → Am)'],
    builds: ['major', 'fifths'],
    takeaways: ['Relative minor = the 6th degree of a major key: same notes, different home.', 'Parallel minor = same root, with ♭3, ♭6 and ♭7.', 'Harmonic minor raises the 7th: a leading tone and a <b>major V chord</b>.', 'Melodic minor raises the 6th and 7th, smoothing the gap harmonic minor creates.', 'Real songs mix them: natural minor for most chords, the major V borrowed for the pull home.'],
    practice: [
      ['guitar', 'Play A natural minor on one string, then A harmonic minor (G becomes G♯). Then strum Am – Dm – E7 – Am and find the G♯ inside the E7 shape (G string, fret 1).'],
      ['ear', 'Press ▶ on the three minors in the explorer, one after another. Listen for the three-fret gap (F → G♯) that gives harmonic minor its exotic sound. Then take the ear quiz.'],
      ['music', 'Pick a minor-key song you know and check whether its V chord is minor (natural minor) or major (harmonic minor).'],
    ],
    next: 'Cut two notes out of the major and minor scales and you get the guitarist\'s favourite: the pentatonic.',
  },
  pentatonic: {
    why: `The pentatonic is the soloing scale of rock, blues, country and pop. Understanding where it comes from and how its five shapes connect turns "box 1 noodling" into choices: which note to land on, when to sound major or minor, where the blue notes sit.`,
    goals: ['Build major and minor pentatonics and explain why they have no semitones', 'Use one shape as both relative pentatonics', 'Connect box 1 to box 2, and place the blue notes'],
    builds: ['major', 'minor'],
    takeaways: ['Major pentatonic = major scale without 4 and 7. Minor pentatonic = natural minor without 2 and ♭6.', 'No semitones means no clashes, which is why it is so forgiving.', 'A minor pentatonic = C major pentatonic: the note you treat as home decides the sound.', 'Five boxes, each starting on the next scale note, cover the whole neck.', 'Blues scale = minor pentatonic + ♭5. Major blues = major pentatonic + ♭3.'],
    practice: [
      ['guitar', 'Box link: over the open A string, play box 1 (fret 5), slide up into box 2 on the G string and back. End every phrase on A, then on C, then on E, and hear how the landing note changes the mood.'],
      ['ear', 'Press ▶ on A minor pentatonic, then A major pentatonic over the drone: same root, different mood. Then play the blues scale and listen for the ♭5.'],
      ['music', 'Over the 12-bar on the Blues pages, switch between A minor pentatonic (box 1 at fret 5) and A major pentatonic (the same shape at fret 2).'],
    ],
    next: 'The major scale has seven possible "homes". Each one is a mode with its own colour.',
  },
  modes: {
    why: `Modes explain why some songs feel neither major nor minor, and why a funky Dorian groove sounds different from a Mixolydian rock riff. They use the same notes as the major scale with a different home, and each has one note that gives it its character.`,
    goals: ['Name the 7 modes and the degree each one starts on', 'Describe each mode by its characteristic note compared with major or minor', 'Find the parent major scale of any mode'],
    builds: ['major', 'pentatonic'],
    takeaways: ['Modes are rotations of the major scale; the home note and chord give each its sound.', 'Characteristic notes: Dorian ♮6, Phrygian ♭2, Lydian ♯4, Mixolydian ♭7, Locrian ♭5.', 'Brightest to darkest: Lydian, Ionian, Mixolydian, Dorian, Aeolian, Phrygian, Locrian.', 'Mixolydian is the sound of a dominant 7th chord, which is why blues and rock live there.', 'Dorian is minor with a bright 6th: think funk and Santana-style grooves.'],
    practice: [
      ['guitar', 'Drone test: let the open A string ring and play A Aeolian (A B C D E F G), then A Dorian (F becomes F♯), then A Mixolydian (C♯ and G). Lean on the characteristic note each time.'],
      ['ear', 'Press ▶ "over a drone" in the explorer for the same root in all seven modes, in brightness order. Describe each in one word, then try the ear quiz.'],
      ['music', 'Loop a two-chord vamp and improvise with the matching mode: Am – D (A Dorian), A – G (A Mixolydian), A – B (A Lydian).'],
    ],
    next: 'From scales to harmony: how chords are built from stacked intervals.',
  },
  chords: {
    why: `Chord symbols like m7♭5, sus4 or 9 stop being scary once you see they're just recipes: stacked intervals from a root. Knowing the recipe lets you build, find and substitute any chord instead of memorising hundreds of shapes.`,
    goals: ['Build triads (major, minor, diminished, augmented, sus) and the five 7th chords on any root', 'Read extended symbols such as 6, 9, add9 and 13', 'Recognise inversions and slash chords, and name a chord from its notes'],
    builds: ['intervals', 'major'],
    takeaways: ['A triad is root + 3rd + 5th. The 3rd decides major or minor; the 5th decides diminished or augmented.', 'Five 7th chords: maj7, 7, m7, ø7 (m7♭5), °7.', '9 = 2, 11 = 4, 13 = 6, an octave higher. "add9" has no 7th.', 'A slash chord names the bass note: C/E = C with E in the bass.', 'To name unknown notes, restack them in 3rds; the bottom note is the root.'],
    practice: [
      ['guitar', 'Chord-tone hunt: in open C (x32010) name every note and its role (C root, E 3rd, G 5th). Turn it into C7 by adding B♭ (G string, fret 3: x32310) and into Cmaj7 by letting the B string ring open (x32000).'],
      ['ear', 'Use ▶ to compare C, Cm, C° and C+, then Cmaj7, C7, Cm7, Cø7 and C°7. Describe each in one word, then do the chord-quality ear quiz.'],
      ['music', 'Take three unfamiliar chord symbols from a song sheet and spell them in the explorer before you play them.'],
    ],
    next: 'Which chords belong together? Build a chord on every note of a key.',
  },
  inkey: {
    why: `Songs aren't random chords: most use the seven chords of one key. Thinking in Roman numerals lets you understand a song in any key, transpose it instantly, and spot the special chords (like secondary dominants) that make it interesting.`,
    goals: ['List the diatonic triads and 7th chords of any major key', 'Use Roman numerals to describe a progression', 'Find and use secondary dominants (V7 of another chord)'],
    builds: ['chords', 'major', 'fifths'],
    takeaways: ['Every major key: <b>I ii iii IV V vi vii°</b>.', 'As 7ths: Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7. Only V is a dominant 7th.', 'Numerals describe function, not pitch, so they work in every key.', 'A secondary dominant is the V7 of another chord: up a 5th from its root.', 'Its out-of-key note is the target\'s leading tone, a semitone below it.'],
    practice: [
      ['guitar', 'Play the seven chords of G major in order (G Am Bm C D Em F♯°) saying the numerals out loud. Then play I–vi–IV–V in G, C and D.'],
      ['ear', 'With ▶, compare C – Dm with C – A7 – Dm. The A7 makes Dm feel like a small arrival.'],
      ['music', 'Write the numerals under the chords of a song you are learning. Any chord that does not fit the key is probably a secondary dominant or a borrowed chord: work out which.'],
    ],
    next: 'You know which chords belong together. Next: why they move the way they do.',
  },
  function: {
    why: `This is the "why" behind everything: why V wants to go to I, why songs end the way they do, why the same four-chord loop works in a thousand songs. Once you hear tension and release you can predict, write and remember progressions.`,
    goals: ['Sort chords into tonic, subdominant and dominant', 'Explain the V7 → I pull (leading tone and tritone)', 'Name the four cadences on paper and by ear, and transpose any progression'],
    builds: ['inkey'],
    takeaways: ['Tonic (I vi iii) = home. Subdominant (IV ii) = away. Dominant (V vii°) = tension.', 'The basic story: T → S → D → T.', 'In V7 → I the 7th degree rises to the root and the 4th falls to the 3rd: the tritone resolves.', 'Cadences: authentic V–I, plagal IV–I, half (ends on V), deceptive V–vi.', 'Progressions are numerals, so they move to any key unchanged.'],
    practice: [
      ['guitar', 'Play G7 → C slowly and watch two notes move by a semitone: B (A string, fret 2) up to C (fret 3), and F (high e, fret 1) down to E (open).'],
      ['ear', 'Press ▶ on each cadence and close your eyes: full stop (authentic), "Amen" (plagal), question (half), surprise (deceptive). Then take the cadence ear quiz.'],
      ['music', 'Look at the last two chords of three songs you know. Which cadence does each one use?'],
    ],
    next: 'Time to apply it all in one style: the blues, starting in A.',
  },
};

// Blues pages: same structure, examples worked out for the page's key
function bluesGuide(key) {
  const kd = KEYS[key], I = kd.root, IV = spellDeg(I, '4'), V = spellDeg(I, '5'), box = lowEFret(I);
  const third = r => spellDeg(r, '3');
  return {
    why: `The blues is where the theory comes together: I–IV–V from the key, dominant 7ths on every chord, the minor pentatonic played over major chords, and the clash between ♭3 and 3. This page applies everything in ${I}.`,
    goals: [`Play the 12-bar in ${I} with triads and with 7th chords`, `Solo with ${I} minor pentatonic and know which notes clash with the chords`, 'Explain why blues mixes major and minor'],
    builds: ['inkey', 'pentatonic', 'function'],
    takeaways: [`12-bar in ${I}: ${I} ${I} ${I} ${I} | ${IV} ${IV} ${I} ${I} | ${V} ${IV} ${I} ${V}.`, `Blues plays all three chords as dominant 7ths (${I}7 ${IV}7 ${V}7), against the "only V gets a 7th" rule.`, `${I} minor pentatonic over ${I} major gives the blue third: ${spellDeg(I, 'b3')} against ${third(I)}.`, `The ${spellDeg(I, 'b5')} (♭5) is a passing note between ${spellDeg(I, '4')} and ${V}.`, `Bending ${spellDeg(I, 'b3')} slightly toward ${third(I)} is the signature blues sound.`],
    practice: [
      ['guitar', `Play along with ▶ "12-bar shuffle": first the boogie riff on the low strings (root + 5th, then the 6th and ♭7th), then the strummed 7th chords. Count 1-2-3-4 per bar with a long-short swing.`],
      ['ear', `Press ▶ on the 12-bar shuffle and follow the form: say "one" at every chord change, and notice the V–IV–I–V turnaround at the end.`],
      ['music', `Solo over the 12-bar using box 1 at fret ${box}. At each change, aim for the chord's 3rd: ${third(I)} over ${I}7, ${third(IV)} over ${IV}7, ${third(V)} over ${V}7.`],
    ],
    next: key === 'A' ? 'The same blues in E: the guitar\'s favourite blues key, with open strings everywhere.'
      : key === 'E' ? 'And in C: a key that uses flats in its minor side.'
      : 'You have been through the whole path. Use the review page to keep it fresh.',
  };
}

function guideFor(id) { return GUIDE[id] || (KEYS[id] ? bluesGuide(id) : null); }

function pageLabelOf(id) {
  const p = THEORY_PAGES.find(x => x.id === id);
  return p ? p.label : KEYS[id] ? KEYS[id].full : id === 'review' ? 'Progress & review' : id;
}

const PRACTICE_LABEL = {guitar: 'On the guitar', ear: 'For the ear', music: 'In real music'};

function guideIntro(id) {
  const g = guideFor(id);
  if (!g) return '';
  const builds = g.builds.length
    ? `<p class="gi-builds">Builds on: ${g.builds.map(b => `<a href="#${b}">${pageLabelOf(b)}</a>`).join(' · ')}</p>`
    : `<p class="gi-builds">Start here: no previous knowledge needed.</p>`;
  return `<div class="guide-intro">
    <div class="gi-why"><span class="gi-tag">Why this matters</span>${g.why}</div>
    <div class="gi-goals"><b>After this page you'll be able to:</b><ul>${g.goals.map(x => `<li>${x}</li>`).join('')}</ul></div>
    ${builds}
    <p class="gi-builds">Tip: click any note, dot or chord name on this page to hear it, even while a track is playing.</p>
  </div>`;
}

function guideMid(id) {
  const g = guideFor(id);
  if (!g) return '';
  return `<div class="sh"><span class="sn">✓</span><span class="st">Key takeaways</span></div>
  <ul class="takeaways">${g.takeaways.map(t => `<li>${t}</li>`).join('')}</ul>
  <div class="sh"><span class="sn">✎</span><span class="st">Practice</span></div>
  <div class="practice">${g.practice.map(([type, text]) => `<div class="pr pr-${type}"><div class="pr-h">${PRACTICE_LABEL[type]}</div><div class="pr-b">${text}</div></div>`).join('')}</div>
  <div class="sh"><span class="sn">?</span><span class="st">Test yourself</span></div>`;
}

function guideEnd(id) {
  const g = guideFor(id);
  if (!g) return '';
  const nextId = PATH[PATH.indexOf(id) + 1];
  return `<div class="guide-end">
    <button type="button" class="done-btn" data-done="${id}"></button>
    ${nextId ? `<a class="next-link" href="#${nextId}"><span>Next up →</span><b>${pageLabelOf(nextId)}</b><small>${g.next}</small></a>` : ''}
  </div>`;
}

// Blues quiz for each key page
Object.keys(KEYS).forEach(key => {
  QUIZZES['blues' + key] = () => {
    const I = KEYS[key].root, chord = d => chordLabel(spellDeg(I, d), 'dom7'), sevens = ['1', '4', '5'].map(chord);
    const bars = ['1','1','1','1','4','4','1','1','5','4','1','5'];
    const notes = d => spellDeg(I, d), pool = ['b3', '3', 'b5', '5', 'b7', '4'].map(notes);
    const items = [
      () => { const n = 1 + Math.floor(Math.random() * 12), answer = chord(bars[n - 1]);
        return {q: `In a 12-bar blues in <b>${I}</b>, which chord is played in <b>bar ${n}</b>?`, answer, options: shuffle(sevens),
          why: `I I I I | IV IV I I | V IV I V: bar ${n} is ${['I','IV','V'][['1','4','5'].indexOf(bars[n - 1])]} = ${answer}.`}; },
      () => { const answer = notes('b3');
        return {q: `Over <b>${chord('1')}</b>, which note from ${I} minor pentatonic is the "blue third" that clashes with the chord?`, answer, options: optionsFor(answer, pool),
          why: `${chord('1')} contains ${notes('3')} (major 3rd). The minor pentatonic has ${answer} (♭3), a semitone lower: bend it toward ${notes('3')}.`}; },
      () => { const answer = notes('b5');
        return {q: `Which note does the <b>blues scale</b> add to ${I} minor pentatonic?`, answer, options: optionsFor(answer, pool),
          why: `The ♭5 of ${I} is ${answer}, used as a passing note between ${notes('4')} and ${notes('5')}.`}; },
      () => { const d = pick(['4', '5']), answer = chord(d);
        return {q: `What is the <b>${d === '4' ? 'IV7' : 'V7'}</b> chord in a blues in ${I}?`, answer, options: shuffle(sevens.concat(chordLabel(spellDeg(I, d), 'maj7'))),
          why: `${d === '4' ? 'IV' : 'V'} of ${I} is ${spellDeg(I, d)}; blues plays it as a dominant 7th: ${answer}.`}; },
    ];
    return pick(items)();
  };
});

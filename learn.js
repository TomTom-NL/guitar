// ── Beginner theory notes shown next to each diagram ─────────────────────────
// Each function returns a "Learn" box. Text is built from the key
// data so the examples always match the page they appear on.

function learnBox(title, body) {
  return `<div class="learn"><div class="learn-h"><span class="learn-tag">Learn</span>${title}</div><div class="learn-b">${body}</div></div>`;
}

// Fret of a note on the low E string (0–11)
function lowEFret(note) { return (NN.indexOf(note) - 4 + 12) % 12; }

const LEARN = {

  // ── Reading the diagrams ──────────────────────────────────────────────────

  chordDiagram: () => learnBox('How to read a chord diagram', `
    <p>Imagine the guitar standing upright in front of you, headstock at the top.</p>
    <ul>
      <li><b>Vertical lines</b> are the 6 strings: thick low <b>E</b> on the left, thin high <b>e</b> on the right (labels on top).</li>
      <li><b>Horizontal lines</b> are the frets. The thick bar at the top is the <b>nut</b>, the end of the neck.</li>
      <li><b>Filled dot</b> = press here. The letter inside is the note that string plays.</li>
      <li><b>Small ring above a string</b> = play it open (no finger). <b>✕</b> = don't play that string.</li>
      <li><b>Long grey bar</b> = a <b>barre</b>: one finger flat across all those strings.</li>
      <li><b>"5fr"</b> on the right = the diagram starts at the 5th fret instead of the nut.</li>
      <li>The <b>letters underneath</b> are the notes you hear, low string to high.</li>
      <li>The code under the name, e.g. <code>x02220</code>, lists the fret for each string from low E to high e (<code>x</code> = muted, <code>0</code> = open).</li>
    </ul>`),

  // ── §1 Scale & theory ─────────────────────────────────────────────────────

  majorScale: kd => {
    const s = kd.scale;
    return learnBox(`The ${kd.root} major scale`, `
      <p>Music uses 12 different notes. A <b>scale</b> picks 7 of them. Every major scale follows the same pattern of steps:</p>
      <p class="learn-big">T &nbsp;T &nbsp;S &nbsp;T &nbsp;T &nbsp;T &nbsp;S</p>
      <ul>
        <li><b>T</b> = tone (whole step) = <b>2 frets</b> on the guitar.</li>
        <li><b>S</b> = semitone (half step) = <b>1 fret</b>. For example ${s[2]} → ${s[3]} is just one fret apart.</li>
      </ul>
      <p>Start on <b>${kd.root}</b>, follow the pattern, and you get ${s.join(' – ')} – ${kd.root}.
      The small numbers above the notes are the <b>scale degrees</b>: ${kd.root} is <b>1</b>, the <b>root</b> or "home" note. <b>8</b> is ${kd.root} again, one octave higher.</p>
      <p>Each degree has its own colour, and those colours are used all over this page. When you see a note in that colour, you know which degree it is.</p>
      <p class="learn-try"><b>Try it:</b> on one string, play any ${kd.root}, then move up 2-2-1-2-2-2-1 frets. You just played the ${kd.root} major scale.</p>`);
  },

  triads: kd => {
    const t = kd.triads;
    return learnBox('Chords from the scale (triads)', `
      <p>A <b>triad</b> is a 3-note chord. To build one, start on a scale note and stack <b>every other</b> note: 1, 3, 5.</p>
      <p>Starting on ${kd.root}: <b>${t[0].n.join(' – ')}</b> = ${t[0].c} major. Do this from every note of the scale and you get the 7 chords that belong to the key:</p>
      <ul>
        <li><b>Blue boxes, △</b> = <b>major</b>: bright, happy (${t.filter(x => x.q === 'maj').map(x => x.c).join(', ')}).</li>
        <li><b>Purple boxes, −</b> = <b>minor</b>: darker, sad (${t.filter(x => x.q === 'min').map(x => x.c).join(', ')}).</li>
        <li><b>Red box, °</b> = <b>diminished</b>: tense, unstable (${t.filter(x => x.q === 'dim').map(x => x.c).join(', ')}).</li>
      </ul>
      <p>Each box shows the chord's notes, read <b>bottom (root) to top (5th)</b>. The <b>Roman numeral</b> at the bottom names the chord by its scale degree: CAPITALS = major, lowercase = minor. Every major key has the same pattern: <b>I ii iii IV V vi vii°</b>.</p>`);
  },

  cycle: kd => {
    const c = kd.cycle;
    return learnBox('Cycle of thirds', `
      <p>These are the same 7 notes in a circle, each one a <b>third</b> apart (skipping one scale note each time).</p>
      <p><b>Any 3 neighbours form a chord:</b> ${c[0]}–${c[1]}–${c[2]} is the I chord, ${c[1]}–${c[2]}–${c[3]} is the iii chord, and so on around the circle.</p>
      <p>The small labels between notes give the distance: <b>Maj3</b> = 4 frets, <b>Min3</b> = 3 frets.</p>
      <ul>
        <li>Maj3 then Min3 → <b>major</b> chord</li>
        <li>Min3 then Maj3 → <b>minor</b> chord</li>
        <li>Min3 then Min3 → <b>diminished</b> chord</li>
      </ul>
      <p>The three filled circles are the <b>I, IV and V</b> chords (root, 4th, 5th), the three chords of the blues.</p>
      <p class="learn-try"><b>Bonus:</b> take 4 neighbours (${c.slice(0, 4).join('–')}) and you get a 7th chord.</p>`);
  },

  tertian: () => learnBox('Tertian table', `
    <p><b>Tertian</b> means "built in thirds". This table lists the same 7 triads, one per row:</p>
    <ul>
      <li><b>R</b> = root (the note the chord is named after), <b>3</b> = third, <b>5</b> = fifth.</li>
      <li><b>#</b> = which scale degree the chord starts on; the last column is its Roman numeral.</li>
      <li>Row tint: blue = major, purple = minor, red = diminished.</li>
    </ul>
    <p>Notice that the R, 3 and 5 columns just walk through the scale. That's the "every other note" rule in action.</p>`),

  parallelMinor: kd => {
    const maj = kd.scale, min = kd.rel.scale;
    const changed = [2, 5, 6].map(i => `${maj[i]} → ${min[i]}`).join(', ');
    return learnBox(`The parallel minor: ${kd.rel.name}`, `
      <p>The <b>parallel minor</b> starts on the <b>same root</b> (${kd.root}) but uses a different step pattern:</p>
      <p class="learn-big">T &nbsp;S &nbsp;T &nbsp;T &nbsp;S &nbsp;T &nbsp;T</p>
      <p>Compared with ${kd.root} major, three notes drop by one fret: the 3rd, 6th and 7th (${changed}). They are called <b>b3, b6 and b7</b> ("flat 3" etc.). Those lowered notes make minor sound darker.</p>
      <p><b>Why this matters for blues:</b> blues mixes the two. It plays the <b>b3</b> and <b>b7</b> from minor over major chords. That clash of major and minor is the heart of the blues sound.</p>
      <p>The chord family changes too: <b>i ii° III iv v VI VII</b>. Everything below works exactly like the major section above.</p>`);
  },

  // ── §2 Chord shapes ──────────────────────────────────────────────────────

  openChords: kd => {
    const [I, IV, V] = [kd.triads[0].c, kd.triads[3].c, kd.triads[4].c];
    return learnBox('The three blues chords: I, IV and V', `
      <p>A standard blues uses only three chords, the ones built on degrees <b>1, 4 and 5</b> of the scale. In ${kd.root} that's <b>${I}</b> (I), <b>${IV}</b> (IV) and <b>${V}</b> (V).</p>
      <p>The classic <b>12-bar blues</b> plays them in this order, one chord per bar (count 1-2-3-4 for each):</p>
      <p class="learn-big">${I} ${I} ${I} ${I} | ${IV} ${IV} ${I} ${I} | ${V} ${IV} ${I} ${V}</p>
      <p class="learn-try"><b>Try it:</b> strum each chord 4 times and loop the 12 bars. Thousands of songs are built on this.</p>`);
  },

  seventhChords: kd => {
    const [I, IV, V] = [kd.triads[0].c, kd.triads[3].c, kd.triads[4].c];
    return learnBox('Dominant 7th chords', `
      <p>Add one more note to each chord, the <b>b7</b> (2 frets below the root's octave), and you get a <b>dominant 7th</b> chord: <b>${I}7, ${IV}7, ${V}7</b>.</p>
      <p>In textbook theory only the V chord gets a 7th. Blues puts a 7th on <b>all three</b>, which gives that gritty, restless sound that never quite settles.</p>
      <p class="learn-try"><b>Try it:</b> play the 12-bar again with these 7th chords and hear the difference.</p>`);
  },

  minorChords: kd => {
    const t = kd.rel.triads;
    return learnBox('Minor blues chords: i, iv and v', `
      <p>These are the same three positions (1, 4, 5) taken from the <b>parallel minor</b>: <b>${t[0].c}, ${t[3].c} and ${t[4].c}</b>. Lowercase numerals = minor chords.</p>
      <p>Use them in place of the major chords for a <b>minor blues</b>: the same 12-bar pattern, but moodier.</p>`);
  },

  // ── §3 Pentatonics ───────────────────────────────────────────────────────

  pentatonic: kd => {
    const box = lowEFret(kd.root);
    const where = box === 0 ? 'open position (fret 0) or at the 12th fret' : `fret ${box}`;
    return learnBox('Pentatonic scales on the fretboard', `
      <p><b>Penta</b> = five. A pentatonic scale is a 5-note scale: a normal 7-note scale with the two "trickiest" notes left out, so almost nothing you play sounds wrong. That's why it's the first scale most guitarists learn for soloing.</p>
      <ul>
        <li><b>Major pentatonic</b> = degrees 1 2 3 5 6 (${kd.mpN.join(' ')}): sweet, bright, country.</li>
        <li><b>Minor pentatonic</b> = degrees 1 b3 4 5 b7 (${kd.mnN.join(' ')}): the classic rock and blues sound.</li>
      </ul>
      <p><b>Reading the fretboard:</b> unlike the chord diagrams, this one lies <b>sideways like tab</b>. The <b>top line is the thin high e</b>, the bottom line is the thick low E, and frets are numbered along the bottom. Every dot is a place you can play a scale note. The <b>root ${kd.root}</b> has a white ring.</p>
      <p>Use the buttons to switch each scale on or off and see where they overlap (green = in both). The <b>Blues note</b> button adds the <b>b5</b> (${spellDeg(kd.root, 'b5')}), the "blue note". Use it as a quick passing note between the 4 and the 5, rather than a note to stay on.</p>
      <p class="learn-try"><b>Try it:</b> turn off major, then find the ${kd.root} on the low E string at ${where}. Play the purple and green notes from there across 4 frets, one finger per fret. That's the famous <b>minor pentatonic "box 1"</b>. The other four boxes, and why pentatonics work, are on <a href="#pentatonic">Scales &amp; keys → Pentatonic &amp; blues</a>.</p>`);
  },

  comparison: kd => {
    const b3 = kd.comp.find(r => r.d === 'b3').mn, n3 = kd.comp.find(r => r.d === '3').mj;
    return learnBox('Comparing the two pentatonics', `
      <p>This table lines up both scales degree by degree. A dash means the note isn't in that scale.</p>
      <ul>
        <li><b>1 and 5</b> are in both, so they're always safe to land on.</li>
        <li>The interesting clash is <b>b3 (${b3}) vs 3 (${n3})</b>, one fret apart.</li>
      </ul>
      <p class="learn-try"><b>Try it:</b> play ${b3} and <b>bend</b> the string slightly up toward ${n3}. That in-between pitch is the most "bluesy" sound there is.</p>`);
  },

  legend: () => learnBox('Colour key', `
    <p>Each of the 7 scale degrees always has the same colour on this page: in the scale row, inside chord diagrams and in the tables. Grey means the note is outside the scale.</p>`)
};

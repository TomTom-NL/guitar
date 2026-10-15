// ── Shared UI for the theory pages ───────────────────────────────────────────
// Page layout helpers, the fretboard note map, explorers (controls + live
// output) and quizzes. Pages register explorers in EXPLORERS and quiz
// generators in QUIZZES; app.js wires them up after rendering.

// ── Layout ───────────────────────────────────────────────────────────────────

function pageHead(id, letter, title, sub) {
  return `<div class="key-section" id="key-${id}">
  <div class="key-banner">
    <div class="key-letter">${letter}</div>
    <div class="key-info"><div class="key-name">${title}</div><div class="key-sub">${sub}</div></div>
  </div>`;
}

function section(n, title) {
  return `<div class="sh"><span class="sn">§${n}</span><span class="st">${title}</span></div>`;
}

// Row of ▶ buttons under an explorer result
function listen(...buttons) { return `<div class="listen">${buttons.join('')}</div>`; }

// Prose block (not collapsible): the core explanation of a section
function prose(html) { return `<div class="prose">${html}</div>`; }

function table(head, rows, cls = '') {
  return `<div class="tbl-wrap"><table class="ref ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

// Inline row of note "chips", optionally coloured and with a caption under each
function chips(notes, opts = {}) {
  return `<div class="chips">${notes.map((n, i) => {
    const col = opts.colors ? opts.colors[i] : null;
    const style = col ? ` style="border-color:${col};color:${col}"` : '';
    const hl = opts.highlight && opts.highlight[i] ? ' hl' : '';
    return `<div class="chip${hl}"><span class="chip-n"${style}>${fmt(n)}</span>${opts.under ? `<span class="chip-u">${String(opts.under[i]).replace(/^bb/, '𝄫').replace(/^b/, '♭').replace(/^#/, '♯')}</span>` : ''}</div>`;
  }).join('')}</div>`;
}

// ── Accidentals ──────────────────────────────────────────────────────────────
// Turn note names written as Bb / F# / Ebm7 into B♭ / F♯ / E♭m7 in rendered text
// (including SVG labels). Internal data keeps plain ASCII.

const ACC_RE = /\b([A-G])(##|#|bb|b)(?=$|[^a-z]|m|aj|add|sus|dim)/g;
function prettifyAccidentals(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(t => {
    if (t.parentElement && t.parentElement.closest('code, select, option')) return;
    const v = t.nodeValue.replace(ACC_RE, (_, l, a) => l + a.replace(/#/g, '♯').replace(/b/g, '♭'));
    if (v !== t.nodeValue) t.nodeValue = v;
  });
}

// ── Fretboard note map ───────────────────────────────────────────────────────
// marks: {pc: {label, col, root?, faint?}} → every position of those notes.
// opts.frets: board length (default 12); opts.focus(string, fret): positions that
// return false are drawn faded (used to highlight one pentatonic box).

function noteMapSVG(marks, opts = {}) {
  const R = FB.R;
  let s = fretboardBase(opts.frets);
  eachPosition((i, f, ni, x, y) => {
    const m = marks[ni];
    if (!m) return;
    const op = m.faint || (opts.focus && !opts.focus(i, f)) ? (opts.focus ? 0.22 : 0.6) : 1;
    const ring = m.root && op >= 0.5;  // faded roots (outside a highlighted box) get no ring
    if (ring) s += `<circle cx="${x}" cy="${y}" r="${R+4}" fill="none" stroke="${m.col}" stroke-width="1" opacity="0.4"/>`;
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="${m.col}" opacity="${op}"/>`;
    if (ring) s += `<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="white" stroke-width="1.8"/>`;
    s += `<text x="${x}" y="${y+4}" text-anchor="middle" font-size="${m.label.length > 2 ? 7 : m.label.length > 1 ? 8 : 9}" fill="white" font-weight="700" font-family="Courier New"${op < 0.5 ? ' opacity="0.5"' : ''}>${m.label}</text>`;
  }, opts.frets);
  return `<div class="fb-wrap">${s}</svg></div>`;
}

// Colour per scale degree number (1–7), shared by the theory pages
const DEG_COL = {1:'#1a5291', 2:'#0e7a7a', 3:'#8b5e00', 4:'#6b2d8b', 5:'#2d6a1e', 6:'#b83800', 7:'#555'};
function degNum(deg) { return ((parseDeg(deg).num - 1) % 7) + 1; }

// Marks for a scale/chord: notes coloured by degree, root ringed
function degreeMarks(root, degs, opts = {}) {
  const marks = {};
  degs.forEach(d => {
    const n = spellDeg(root, d);
    marks[pcOf(n)] = {label: n, col: (opts.colorOf || (dd => DEG_COL[degNum(dd)]))(d), root: d === '1', faint: opts.faint && opts.faint(d)};
  });
  return marks;
}

// Colour map for chordCard(): note name → {c}
function colorMap(names, colorOf) {
  const m = {};
  names.forEach((n, i) => m[n] = {c: colorOf(n, i)});
  return m;
}

// ── Controls ─────────────────────────────────────────────────────────────────

function selectCtl(name, label, options, value) {
  const opts = options.map(o => {
    const [v, t] = Array.isArray(o) ? o : [o, fmt(o)];
    return `<option value="${v}"${v === value ? ' selected' : ''}>${t}</option>`;
  }).join('');
  return `<label class="ctl"><span>${label}</span><select data-ctl="${name}">${opts}</select></label>`;
}

// ── Explorers ────────────────────────────────────────────────────────────────
// EXPLORERS[id] = {controls: () => html, render: state => html}

const EXPLORERS = {};

function explorer(id, title) {
  return `<div class="explorer" data-explorer="${id}">
    <div class="ex-h"><span class="learn-tag ex-tag">Explore</span>${title}</div>
    <div class="ex-ctls">${EXPLORERS[id].controls()}</div>
    <div class="ex-out"></div>
  </div>`;
}

function readState(el) {
  const st = {};
  el.querySelectorAll('[data-ctl]').forEach(c => st[c.dataset.ctl] = c.value);
  return st;
}

function renderExplorer(el) {
  const out = el.querySelector('.ex-out');
  out.innerHTML = EXPLORERS[el.dataset.explorer].render(readState(el));
  prettifyAccidentals(out);
}

// ── Progress (stored in this browser only) ──────────────────────────────────
// {done: {pageId: true}, quiz: {quizId: {right, total, last}}}

const PROGRESS_KEY = 'atlas:progress';
const PROGRESS = loadProgress();

function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    if (p && p.done && p.quiz) return p;
  } catch (e) {}
  return {done: {}, quiz: {}};
}

function saveProgress() {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(PROGRESS)); } catch (e) {}
}

function recordAnswer(id, ok) {
  const q = PROGRESS.quiz[id] || (PROGRESS.quiz[id] = {right: 0, total: 0, last: 0});
  q.total++; if (ok) q.right++; q.last = Date.now();
  saveProgress();
}

function quizStats(id) { return PROGRESS.quiz[id] || {right: 0, total: 0, last: 0}; }

// Called after anything that changes progress (app.js sets it)
let onProgress = () => {};

// ── Quizzes ──────────────────────────────────────────────────────────────────
// QUIZZES[id] = () => {q, answer, options?, why}

const QUIZZES = {};

function quiz(id, title) {
  return `<div class="quiz" data-quiz="${id}">
    <div class="quiz-h"><span class="learn-tag quiz-tag">Quiz</span>${title}<span class="quiz-score"></span></div>
    <div class="quiz-q"></div><div class="quiz-opts"></div><div class="quiz-fb"></div>
    <button class="quiz-next" type="button">Next question →</button>
  </div>`;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// Answer plus up to n-1 distinct distractors, shuffled
function optionsFor(answer, pool, n = 4) {
  return shuffle([answer, ...shuffle([...new Set(pool)].filter(p => p !== answer)).slice(0, n - 1)]);
}

function nextQuestion(el) {
  const q = QUIZZES[el.dataset.quiz]();
  el._q = q;
  if (!el._score) {
    const all = quizStats(el.dataset.quiz);
    if (all.total) el.querySelector('.quiz-score').textContent = `${all.right} / ${all.total} all time`;
  }
  el.querySelector('.quiz-q').innerHTML = q.q;
  el.querySelector('.quiz-fb').innerHTML = '';
  el.querySelector('.quiz-opts').innerHTML = q.options.map(o => `<button type="button" class="quiz-opt" data-v="${o}">${o}</button>`).join('');
  prettifyAccidentals(el);
}

function answerQuestion(el, btn) {
  if (el._q.done) return;
  el._q.done = true;
  const ok = btn.dataset.v === el._q.answer;
  el._score = el._score || {right: 0, total: 0};
  el._score.total++; if (ok) el._score.right++;
  el.querySelectorAll('.quiz-opt').forEach(b => {
    b.disabled = true;
    if (b.dataset.v === el._q.answer) b.classList.add('right');
  });
  if (!ok) btn.classList.add('wrong');
  el.querySelector('.quiz-fb').innerHTML = `<b>${ok ? 'Correct.' : 'Not quite.'}</b> ${el._q.why || ''}`;
  const id = el._q.src || el.dataset.quiz, all = (recordAnswer(id, ok), quizStats(id));
  el.querySelector('.quiz-score').textContent = `${el._score.right} / ${el._score.total} now · ${all.right} / ${all.total} all time`;
  prettifyAccidentals(el);
  onProgress();
}

// Wire explorers and quizzes inside a container (call once after render)
function mountInteractive(root) {
  root.querySelectorAll('.explorer').forEach(renderExplorer);
  root.querySelectorAll('.quiz').forEach(nextQuestion);
  root.addEventListener('change', e => {
    const ex = e.target.closest('.explorer');
    if (ex && e.target.matches('[data-ctl]')) renderExplorer(ex);
  });
  root.addEventListener('click', e => {
    const qz = e.target.closest('.quiz');
    if (!qz) return;
    if (e.target.matches('.quiz-opt')) answerQuestion(qz, e.target);
    if (e.target.matches('.quiz-next')) nextQuestion(qz);
  });
}

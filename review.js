// ── Progress & review page ───────────────────────────────────────────────────
// Overview of finished pages and quiz accuracy, plus one mixed quiz that draws
// from every page you've marked as done, favouring weak and stale topics.

const QUIZ_PAGE = {};   // quiz id → page id, filled by app.js after rendering

const REVIEW_PAGE = {id: 'review', group: 'Review', label: 'Progress & review', render: () => `
${pageHead('review', '↻', 'Progress & review', 'what you have covered · where you are weakest · mixed practice')}
${prose(`<p>Memory fades unless it's used. The most effective way to keep theory is <b>spaced, mixed review</b>: come back every few days and answer questions from different topics in random order, rather than repeating one page until it feels easy.</p>
<p>Mark a page as done with the button at the bottom of each page. The mixed quiz below then draws questions from those pages, and asks more often about topics you get wrong or haven't practised for a while. Your progress is stored only in this browser.</p>`)}
<div id="progress-overview"></div>
${quiz('review', 'Mixed review')}
<p class="cap"><button type="button" class="reset-btn">Reset all progress</button></p>
</div>`};

// Accuracy of all quizzes on a page: {right, total}
function pageStats(pageId) {
  return Object.keys(QUIZ_PAGE).filter(q => QUIZ_PAGE[q] === pageId).map(quizStats)
    .reduce((a, s) => ({right: a.right + s.right, total: a.total + s.total}), {right: 0, total: 0});
}

function reviewPool() {
  const all = Object.keys(QUIZ_PAGE);
  const done = all.filter(q => PROGRESS.done[QUIZ_PAGE[q]]);
  return done.length ? done : all;
}

// Weight: more for low accuracy and for time since last practice (capped at 2 weeks)
function reviewWeight(id) {
  const s = quizStats(id), acc = s.total ? s.right / s.total : 0.5;
  const days = s.last ? (Date.now() - s.last) / 864e5 : 14;
  return 1 + 3 * (1 - acc) + Math.min(days, 14) / 2;
}

QUIZZES.review = () => {
  const pool = reviewPool(), weights = pool.map(reviewWeight);
  let r = Math.random() * weights.reduce((a, b) => a + b, 0), i = 0;
  while (r > weights[i] && i < pool.length - 1) r -= weights[i++];
  const id = pool[i], q = QUIZZES[id]();
  return {...q, src: id, q: `<span class="from">From <a href="#${QUIZ_PAGE[id]}">${pageLabelOf(QUIZ_PAGE[id])}</a></span>${q.q}`};
};

function renderOverview() {
  const el = document.getElementById('progress-overview');
  if (!el) return;
  const pages = PATH.filter(id => id !== 'review');
  const done = pages.filter(id => PROGRESS.done[id]).length;
  const rows = pages.map(id => {
    const st = pageStats(id), pct = st.total ? Math.round(100 * st.right / st.total) : null;
    return [`<a href="#${id}">${pageLabelOf(id)}</a>`, PROGRESS.done[id] ? '✓ done' : '—',
      st.total ? `${st.right} / ${st.total}` : '—',
      pct === null ? '' : `<span class="bar"><span style="width:${pct}%;background:${pct >= 80 ? 'var(--pboth)' : pct >= 50 ? 'var(--pmaj)' : '#c44'}"></span></span> ${pct}%`];
  });
  const weak = Object.keys(QUIZ_PAGE).map(id => ({id, s: quizStats(id)})).filter(x => x.s.total >= 3)
    .sort((a, b) => a.s.right / a.s.total - b.s.right / b.s.total).slice(0, 3).filter(x => x.s.right / x.s.total < 0.8);
  el.innerHTML = `<p class="ex-sum"><b>${done} of ${pages.length}</b> pages done.${done ? '' : ' Mark pages as done (button at the bottom of each page) to focus the review on what you have studied; until then it mixes questions from every page.'}</p>
    ${table(['Page', 'Status', 'Quiz answers', 'Accuracy'], rows)}
    ${weak.length ? `<p class="ex-sum"><b>Worth revisiting:</b> ${weak.map(x => `<a href="#${QUIZ_PAGE[x.id]}">${pageLabelOf(QUIZ_PAGE[x.id])}</a> (${Math.round(100 * x.s.right / x.s.total)}%)`).join(', ')}</p>` : ''}`;
  prettifyAccidentals(el);
}

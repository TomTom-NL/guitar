// ── Pentatonic toggle state (Blues pages) ─────────────────────────────────────

const KEY_LIST = Object.keys(KEYS);

const pentState = Object.fromEntries(
  KEY_LIST.map(k => [k, {maj: true, min: true, blues: false}])
);

function togglePent(key, which) {
  pentState[key][which] = !pentState[key][which];
  const st = pentState[key];
  document.querySelectorAll(`#key-${key} .pent-btn`).forEach(b => {
    b.setAttribute('aria-pressed', String(st[b.dataset.which]));
  });
  document.querySelectorAll(`#key-${key} .fb-dot`).forEach(g => {
    const t = g.dataset.type;
    const show = t === 'shared' ? (st.maj || st.min)
               : t === 'major'  ? st.maj
               : t === 'minor'  ? st.min
               : t === 'blues'  ? st.blues
               : false;
    g.style.opacity = show ? '1' : '0';
  });
}

// ── Pages and navigation ──────────────────────────────────────────────────────
// Groups (top row) → pages (second row). The URL hash holds the page id so
// links and refreshes keep your place; the last page is also remembered.

const PAGES = [
  ...THEORY_PAGES,
  ...KEY_LIST.map(k => ({id: k, group: 'Applied', label: KEYS[k].full, render: () => renderKey(k)})),
  REVIEW_PAGE
];
const GROUPS = [...new Set(PAGES.map(p => p.group))];
const pageById = id => PAGES.find(p => p.id === id);
const lastInGroup = {};

const content = document.getElementById('content');
content.innerHTML = PAGES.map(p => p.render()).join('');
// which page each quiz lives on (the review page draws from these)
PAGES.forEach(p => document.querySelectorAll(`#key-${p.id} .quiz`).forEach(q => {
  if (q.dataset.quiz !== 'review') QUIZ_PAGE[q.dataset.quiz] = p.id;
}));
prettifyAccidentals(content);
mountInteractive(content);

const groupsNav = document.getElementById('groups'), tabsNav = document.getElementById('tabs');
function renderNav(page) {
  groupsNav.innerHTML = GROUPS.map(g => {
    const ps = PAGES.filter(p => p.group === g && p.id !== 'review'), n = ps.filter(p => PROGRESS.done[p.id]).length;
    return `<button class="group${g === page.group ? ' active' : ''}" data-group="${g}">${g}${ps.length && n ? ` <span class="gcount">${n}/${ps.length}</span>` : ''}</button>`;
  }).join('');
  tabsNav.innerHTML = PAGES.filter(p => p.group === page.group)
    .map(p => `<button class="tab${p.id === page.id ? ' active' : ''}" data-key="${p.id}">${p.label}${PROGRESS.done[p.id] ? ' <span class="tick">✓</span>' : ''}</button>`).join('');
}

function refreshDoneButtons() {
  document.querySelectorAll('.done-btn').forEach(b => {
    const done = !!PROGRESS.done[b.dataset.done];
    b.classList.toggle('is-done', done);
    b.textContent = done ? '✓ Done (click to undo)' : 'Mark this page as done';
  });
}

let currentPage = null;
onProgress = () => { renderOverview(); if (currentPage) renderNav(currentPage); };

function showPage(id) {
  const page = pageById(id) || PAGES[0];
  lastInGroup[page.group] = page.id;
  currentPage = page;
  renderNav(page);
  if (page.id === 'review') renderOverview();
  PAGES.forEach(p => {
    document.getElementById('key-' + p.id).style.display = p.id === page.id ? 'block' : 'none';
  });
  // On phones the nav rows scroll sideways; keep the active items visible
  [groupsNav.querySelector('.active'), tabsNav.querySelector('.active')].forEach(b => b && b.scrollIntoView({block: 'nearest', inline: 'nearest'}));
  try { localStorage.setItem('atlas:page', page.id); } catch (e) {}
  if (location.hash.slice(1) !== page.id) history.replaceState(null, '', '#' + page.id);
}

function go(id) {
  showPage(id);
  window.scrollTo({top: 0, behavior: 'smooth'});
}

groupsNav.addEventListener('click', e => {
  const b = e.target.closest('.group');
  if (b) go(lastInGroup[b.dataset.group] || PAGES.find(p => p.group === b.dataset.group).id);
});
tabsNav.addEventListener('click', e => {
  const b = e.target.closest('.tab');
  if (b) go(b.dataset.key);
});
window.addEventListener('hashchange', () => { showPage(location.hash.slice(1)); window.scrollTo({top: 0}); });

let start = location.hash.slice(1);
if (!pageById(start)) { try { start = localStorage.getItem('atlas:page'); } catch (e) { start = null; } }
showPage(pageById(start) ? start : PAGES[0].id);

// Notes / degrees view (remembered)
let degPref = false;
try { degPref = localStorage.getItem('atlas:deg') === '1'; } catch (e) {}
setDegreeMode(degPref);

// Done buttons and progress reset
refreshDoneButtons();
content.addEventListener('click', e => {
  const d = e.target.closest('.done-btn');
  if (d) {
    if (PROGRESS.done[d.dataset.done]) delete PROGRESS.done[d.dataset.done]; else PROGRESS.done[d.dataset.done] = true;
    saveProgress(); refreshDoneButtons(); onProgress();
  }
  if (e.target.closest('.reset-btn') && confirm('Clear all done marks and quiz scores stored in this browser?')) {
    PROGRESS.done = {}; PROGRESS.quiz = {};
    saveProgress(); refreshDoneButtons(); onProgress();
  }
});

// Pentatonic toggles
document.querySelectorAll('.pent-btn').forEach(btn => {
  btn.addEventListener('click', () => togglePent(btn.dataset.key, btn.dataset.which));
});

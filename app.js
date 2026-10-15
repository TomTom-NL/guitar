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
  ...KEY_LIST.map(k => ({id: k, group: 'Applied', label: KEYS[k].full, render: () => renderKey(k)}))
];
const GROUPS = [...new Set(PAGES.map(p => p.group))];
const pageById = id => PAGES.find(p => p.id === id);
const lastInGroup = {};

const content = document.getElementById('content');
content.innerHTML = PAGES.map(p => p.render()).join('');
prettifyAccidentals(content);
mountInteractive(content);

const groupsNav = document.getElementById('groups'), tabsNav = document.getElementById('tabs');
groupsNav.innerHTML = GROUPS.map(g => `<button class="group" data-group="${g}">${g}</button>`).join('');

function showPage(id) {
  const page = pageById(id) || PAGES[0];
  lastInGroup[page.group] = page.id;
  groupsNav.querySelectorAll('.group').forEach(b => b.classList.toggle('active', b.dataset.group === page.group));
  tabsNav.innerHTML = PAGES.filter(p => p.group === page.group)
    .map(p => `<button class="tab${p.id === page.id ? ' active' : ''}" data-key="${p.id}">${p.label}</button>`).join('');
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
window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));

let start = location.hash.slice(1);
if (!pageById(start)) { try { start = localStorage.getItem('atlas:page'); } catch (e) { start = null; } }
showPage(pageById(start) ? start : PAGES[0].id);

// Pentatonic toggles
document.querySelectorAll('.pent-btn').forEach(btn => {
  btn.addEventListener('click', () => togglePent(btn.dataset.key, btn.dataset.which));
});

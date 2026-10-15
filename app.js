// ── Pentatonic toggle state ───────────────────────────────────────────────────

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

// ── Render and init ───────────────────────────────────────────────────────────

// One tab per chord sheet, then one per key page
const PAGES = [
  ...Object.keys(CHORD_SHEETS).map(id => ({id, label: CHORD_SHEETS[id].tab, render: renderChordSheet})),
  ...KEY_LIST.map(k => ({id: k, label: KEYS[k].full, render: renderKey}))
];

document.getElementById('tabs').innerHTML = PAGES
  .map(p => `<button class="tab" data-key="${p.id}">${p.label}</button>`)
  .join('');

document.getElementById('content').innerHTML = PAGES.map(p => p.render(p.id)).join('');

function showKey(key) {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.key === key));
  PAGES.forEach(p => {
    document.getElementById('key-' + p.id).style.display = p.id === key ? 'block' : 'none';
  });
}

// Show only the first page on load
showKey(PAGES[0].id);

// Tab switching
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    showKey(btn.dataset.key);
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
});

// Pentatonic toggles
document.querySelectorAll('.pent-btn').forEach(btn => {
  btn.addEventListener('click', () => togglePent(btn.dataset.key, btn.dataset.which));
});

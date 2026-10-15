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

document.getElementById('tabs').innerHTML = KEY_LIST
  .map((k, i) => `<button class="tab${i === 0 ? ' active' : ''}" data-key="${k}">${KEYS[k].full}</button>`)
  .join('');

document.getElementById('content').innerHTML = KEY_LIST.map(renderKey).join('');

function showKey(key) {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.key === key));
  KEY_LIST.forEach(k => {
    document.getElementById('key-' + k).style.display = k === key ? 'block' : 'none';
  });
}

// Show only the first key on load
showKey(KEY_LIST[0]);

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

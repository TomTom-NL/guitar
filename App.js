// ── Pentatonic toggle state ───────────────────────────────────────────────────

const pentState = {
  A: {maj: true, min: true},
  E: {maj: true, min: true},
  C: {maj: true, min: true}
};

function togglePent(key, which) {
  pentState[key][which] = !pentState[key][which];
  const st = pentState[key];
  document.getElementById(`btn-maj-${key}`).style.opacity = st.maj ? '1' : '0.35';
  document.getElementById(`btn-min-${key}`).style.opacity = st.min ? '1' : '0.35';
  document.querySelectorAll(`#key-${key} .fb-dot`).forEach(g => {
    const t = g.dataset.type;
    const show = (t === 'shared') ? (st.maj || st.min) : (t === 'major' ? st.maj : st.min);
    g.style.opacity = show ? '1' : '0';
  });
}

// ── Render and init ───────────────────────────────────────────────────────────

document.getElementById('content').innerHTML =
  renderKey('A') + renderKey('E') + renderKey('C');

// Hide non-active keys on load
['E','C'].forEach(k => document.getElementById('key-' + k).style.display = 'none');

// Tab switching
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['A','E','C'].forEach(k => {
      document.getElementById('key-' + k).style.display = btn.dataset.key === k ? 'block' : 'none';
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
});

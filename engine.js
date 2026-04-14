// HELPER FUNCTIONS
function cm(scale) { const m = {}; scale.forEach((n, i) => m[n] = { c: DC[i], b: DB[i] }); return m; }
function gc(n, m) { return m[n]?.c || '#888'; }
function dy(f, sf) { return 32 + 32 * (sf === 0 ? f : f - sf + 1); }

function chordSVG(cfg, cmap) {
  const sx = [22, 51, 80, 109, 138, 167];
  let s = `<svg viewBox="0 0 195 218" style="width:100%;max-width:162px">`;
  SL.forEach((l, i) => s += `<text x="${sx[i]}" y="13" text-anchor="middle" font-size="9" fill="#999">${l}</text>`);
  for (let i = 0; i <= 4; i++) {
    const y = 48 + 32 * i, isN = (cfg.sf === 0 && i === 0);
    s += `<line x1="${sx[0]}" y1="${y}" x2="${sx[5]}" y2="${y}" stroke="${isN ? '#1c1a14' : '#ccc'}" stroke-width="${isN ? 3.5 : 0.8}"/>`;
  }
  sx.forEach(x => s += `<line x1="${x}" y1="48" x2="${x}" y2="176" stroke="#ccc" stroke-width="0.9"/>`);
  cfg.dots.forEach(dot => {
    const x = sx[dot.s], y = dy(dot.f, cfg.sf), n = NN[(OS[dot.s] + dot.f) % 12], col = gc(n, cmap);
    s += `<circle cx="${x}" cy="${y}" r="12" fill="${col}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="9" fill="white" font-weight="700">${n}</text>`;
  });
  return s + `</svg>`;
}

function overlayFretSVG(kd, ri, key) {
  const mpSet = new Set(kd.mpIdx);
  const mnSet = new Set(kd.mnIdx);
  const blueNote = kd.blueNoteIdx;
  const SHARED = '#2d7a2d', MAJ = '#c97b20', MIN = '#1e5fa8', BLUE = '#6a1eb8';
  const NX = 68, FW = 57, SS = 36, TY = 70, R = 13;
  const sy = i => TY + (5 - i) * SS, nx = f => f === 0 ? NX - 28 : NX + (f - 0.5) * FW;
  let s = `<svg viewBox="0 0 820 298" style="width:100%;min-width:540px;display:block">`;
  s += `<rect x="${NX}" y="${TY - 22}" width="${NX + 12 * FW - NX}" height="224" rx="3" fill="#18100a"/>`;
  for (let i = 0; i < 6; i++) {
    for (let f = 0; f <= 12; f++) {
      const ni = (OS[i] + f) % 12;
      const isBlue = (ni === blueNote);
      if (!mpSet.has(ni) && !mnSet.has(ni) && !isBlue) continue;
      let type = (mpSet.has(ni) && mnSet.has(ni)) ? 'shared' : mpSet.has(ni) ? 'major' : 'minor';
      if (isBlue) type = 'blue';
      const col = isBlue ? BLUE : (type === 'shared' ? SHARED : type === 'major' ? MAJ : MIN);
      const x = Math.round(nx(f)), y = Math.round(sy(i)), n = NN[ni], ir = (ni === ri);
      s += `<g class="fb-dot ${isBlue ? 'blue-note-target' : ''}" data-type="${type}"><circle cx="${x}" cy="${y}" r="${R}" fill="${col}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="9" fill="white" font-weight="700">${n}</text></g>`;
    }
  }
  return s + `</svg>`;
}

function renderKey(key) {
  const kd = KEYS[key], cmap2 = cm(kd.scale), ri = NN.indexOf(kd.root);
  return `<div class="key-section" id="key-${key}">
    <div class="sh"><span class="st">${kd.full}</span></div>
    <div style="margin-bottom:20px; display:flex; align-items:center; gap:10px;">
      <label class="switch"><input type="checkbox" onclick="document.body.classList.toggle('show-blues')"><span class="slider"></span></label>
      <span style="font-weight:700; font-size:12px;">Add Blues Notes (b5)</span>
    </div>
    <div style="border:1.5px solid #ccc;border-radius:6px;overflow-x:auto">${overlayFretSVG(kd, ri, key)}</div>
    <div class="insight"><div class="insight-b">${kd.insight}</div></div>
  </div>`;
}

// ── SVG: chord diagram ────────────────────────────────────────────────────────

function chordSVG(cfg, cmap) {
  const sx = [22,51,80,109,138,167];
  let s = `<svg viewBox="0 0 195 218" style="width:100%;max-width:162px">`;
  SL.forEach((l,i) => s += `<text x="${sx[i]}" y="13" text-anchor="middle" font-size="10" fill="${COL.mute}" font-family="Courier New">${l}</text>`);
  for (let i = 0; i <= 4; i++) {
    const y = 48 + 32*i, isN = (cfg.sf === 0 && i === 0);
    s += `<line x1="${sx[0]}" y1="${y}" x2="${sx[5]}" y2="${y}" stroke="${isN?'#1c1a14':'#ccc'}" stroke-width="${isN?3.5:0.8}" stroke-linecap="round"/>`;
  }
  sx.forEach(x => s += `<line x1="${x}" y1="48" x2="${x}" y2="176" stroke="#ccc" stroke-width="0.9"/>`);
  if (cfg.sf > 0) s += `<text x="187" y="${dy(cfg.sf,cfg.sf)+4}" text-anchor="middle" font-size="10" fill="${COL.mute}" font-family="Courier New">${cfg.sf}fr</text>`;
  for (let f = 1; f <= 4; f++) {
    const a = cfg.sf === 0 ? f : cfg.sf + f - 1;
    s += `<text x="10" y="${dy(a,cfg.sf)+4}" text-anchor="middle" font-size="10" fill="${COL.mute}" font-family="Courier New">${f}</text>`;
  }
  for (let i = 0; i < 6; i++) {
    const n = nat(i,cfg), hd = cfg.dots.find(d => d.s === i), ib = cfg.br && i >= cfg.br.a && i <= cfg.br.b;
    if (!n && cfg.mu.includes(i)) {
      s += `<text x="${sx[i]}" y="33" text-anchor="middle" font-size="12" fill="${COL.mute}">✕</text>`;
    } else if (n && !hd && !ib) {
      const col = gc(n,cmap);
      s += `<g class="tap"${tapNote(OPEN_MIDI[i], n)}><circle cx="${sx[i]}" cy="33" r="13" fill="transparent"/>`;
      s += `<circle cx="${sx[i]}" cy="33" r="8.5" fill="none" stroke="${col}" stroke-width="1.5"/>`;
      s += `<text x="${sx[i]}" y="37" text-anchor="middle" font-size="8" fill="${col}" font-weight="700" font-family="Courier New">${n}</text></g>`;
    }
  }
  if (cfg.br) {
    const by = dy(cfg.br.f, cfg.sf);
    s += `<rect x="${sx[cfg.br.a]-10}" y="${by-9}" width="${sx[cfg.br.b]-sx[cfg.br.a]+20}" height="18" rx="9" fill="#555" opacity="0.7"/>`;
  }
  cfg.dots.forEach(dot => {
    const x = sx[dot.s], y = dy(dot.f,cfg.sf), n = noteAt(dot.s, dot.f, cfg.names), col = gc(n,cmap), fs = n.length > 1 ? 8.5 : 10;
    s += `<g class="tap"${tapNote(OPEN_MIDI[dot.s] + dot.f, n)}><circle cx="${x}" cy="${y}" r="12" fill="${col}"/>`;
    s += `<text x="${x}" y="${y+4}" text-anchor="middle" font-size="${fs}" fill="white" font-weight="700" font-family="Courier New">${n}</text></g>`;
  });
  const ns = Array.from({length:6}, (_,i) => nat(i,cfg));
  ns.forEach((n,i) => {
    if (!n) s += `<text x="${sx[i]}" y="195" text-anchor="middle" font-size="10" fill="${COL.mute}" font-family="Courier New">—</text>`;
    else { const col = gc(n,cmap); s += `<text class="tap"${tapNote(OPEN_MIDI[i] + stringFret(cfg, i), n)} x="${sx[i]}" y="195" text-anchor="middle" font-size="10" fill="${col}" font-weight="700" font-family="Courier New">${n}</text>`; }
  });
  s += `<text x="${(sx[0]+sx[5])/2}" y="212" text-anchor="middle" font-size="9" fill="${COL.mute}" font-family="Courier New">${ns.filter(Boolean).join(' · ')}</text>`;
  return s + `</svg>`;
}

// ── SVG: cycle of thirds circle ───────────────────────────────────────────────

function cycleSVG(kd, cints) {
  const cx=145, cy=145, r=108, sz=295;
  const pts = Array.from({length:7}, (_,i) => {
    const a = (-90 + i*360/7) * Math.PI/180;
    return {x: cx + r*Math.cos(a), y: cy + r*Math.sin(a)};
  });
  const ints = cints || ['Maj3','Min3','Maj3','Min3','Min3','Maj3','Min3'];
  const ic = ints.map(x => x === 'Maj3' ? COL.accent : COL.mute);
  const dl = ['root','3rd','5th','7th','2nd','4th','6th'];
  const cc = {0: DC[0], 2: DC[4], 5: DC[3]};
  let s = `<svg viewBox="0 0 ${sz} ${sz}" style="width:100%;max-width:248px">`;
  s += `<circle cx="${cx}" cy="${cy}" r="38" fill="var(--surface)" stroke="var(--faint)" stroke-width="1"/>`;
  s += `<text x="${cx}" y="${cy-5}" text-anchor="middle" font-size="10" fill="${COL.mute}" font-family="Courier New">cycle of</text>`;
  s += `<text x="${cx}" y="${cy+8}" text-anchor="middle" font-size="10" fill="${COL.mute}" font-family="Courier New">thirds</text>`;
  for (let i = 0; i < 7; i++) {
    const j = (i+1)%7, p = pts[i], q = pts[j];
    s += `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="var(--faint)" stroke-width="1"/>`;
  }
  for (let i = 0; i < 7; i++) {
    const j = (i+1)%7, p = pts[i], q = pts[j], mx = (p.x+q.x)/2, my = (p.y+q.y)/2;
    s += `<rect x="${(mx-14).toFixed(1)}" y="${(my-7).toFixed(1)}" width="28" height="13" rx="3" fill="var(--bg)" stroke="var(--faint)" stroke-width="0.5"/>`;
    s += `<text x="${mx.toFixed(1)}" y="${(my+4).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="${ic[i]}" font-weight="700" font-family="Courier New">${ints[i]}</text>`;
  }
  for (let i = 0; i < 7; i++) {
    const p = pts[i], n = kd.cycle[i], fill = cc[i]||'white', tc = cc[i]?'white':'var(--ink)', sc2 = cc[i]?'rgba(255,255,255,0.92)':'var(--ink2)';
    s += `<g class="tap"${tapNote(noteMidi(n, 3), n, true)}><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="19" fill="${fill}" stroke="var(--faint)" stroke-width="1.5"/>`;
    s += `<text x="${p.x.toFixed(1)}" y="${(p.y-3).toFixed(1)}" text-anchor="middle" font-size="11" fill="${tc}" font-weight="700" font-family="Courier New">${n}</text>`;
    s += `<text x="${p.x.toFixed(1)}" y="${(p.y+9).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="${sc2}" font-family="Courier New">${dl[i]}</text></g>`;
  }
  return s + `</svg>`;
}

// ── SVG: fretboard ───────────────────────────────────────────────────────────

// Pentatonic overlay colours — keep in sync with --p* variables in styles.css
const PENT_COL = {shared: COL.both, major: COL.major, minor: COL.minor, blues: COL.blues};

// Fretboard geometry, shared by the base drawing and the note dots
const FB = {NX:68, FW:57, SS:36, TY:70, R:13};
FB.sy = i => FB.TY + (5-i)*FB.SS;
FB.nx = f => f === 0 ? FB.NX-28 : FB.NX + (f-0.5)*FB.FW;

// Empty board (12 frets unless told otherwise): wood, inlays, nut, frets, strings, labels.
// Opens <svg>; the caller closes it.
function fretboardBase(frets = 12) {
  const {NX, FW, SS, TY} = FB;
  const FBT=TY-22, FBB=TY+5*SS+22, FBR=NX+frets*FW, MY=(FBT+FBB)/2;
  let s = `<svg viewBox="0 0 ${FBR + 68} 298" style="width:100%;min-width:${Math.round(540 * (FBR + 68) / 820)}px;display:block">`;
  s += `<rect x="${NX}" y="${FBT}" width="${FBR-NX}" height="${FBB-FBT}" rx="3" fill="#18100a"/>`;
  [3,5,7,9,15].filter(f => f <= frets).forEach(f => s += `<circle cx="${NX+(f-0.5)*FW}" cy="${MY}" r="5" fill="rgba(255,255,255,0.08)"/>`);
  s += `<circle cx="${NX+11.5*FW}" cy="${MY-11}" r="5" fill="rgba(255,255,255,0.08)"/>`;
  s += `<circle cx="${NX+11.5*FW}" cy="${MY+11}" r="5" fill="rgba(255,255,255,0.08)"/>`;
  s += `<line x1="${NX}" y1="${FBT}" x2="${NX}" y2="${FBB}" stroke="#c8a84a" stroke-width="4" stroke-linecap="round"/>`;
  for (let f = 1; f <= frets; f++) s += `<line x1="${NX+f*FW}" y1="${FBT}" x2="${NX+f*FW}" y2="${FBB}" stroke="#5a4a30" stroke-width="1.5"/>`;
  for (let i = 0; i < 6; i++) {
    const y = FB.sy(i), t = [2,1.6,1.35,1.1,0.9,0.7][i];
    s += `<line x1="22" y1="${y}" x2="${NX}" y2="${y}" stroke="#777" stroke-width="${t}" opacity="0.5"/>`;
    s += `<line x1="${NX}" y1="${y}" x2="${FBR}" y2="${y}" stroke="rgba(210,185,120,0.38)" stroke-width="${t}"/>`;
    s += `<text x="14" y="${y+4}" text-anchor="middle" font-size="11" fill="${COL.mute}" font-family="Courier New" font-weight="700">${SL[i]}</text>`;
  }
  s += `<text x="${NX-28}" y="${FBB+14}" text-anchor="middle" font-size="10" fill="${COL.mute}" font-family="Courier New">0</text>`;
  for (let f = 1; f <= frets; f++) s += `<text x="${NX+(f-0.5)*FW}" y="${FBB+14}" text-anchor="middle" font-size="10" fill="${COL.mute}" font-family="Courier New">${f}</text>`;
  return s;
}

// Call fn(stringIdx, fret, noteIdx, x, y) for every position on the board
function eachPosition(fn, frets = 12) {
  for (let i = 0; i < 6; i++)
    for (let f = 0; f <= frets; f++)
      fn(i, f, (OS[i]+f) % 12, Math.round(FB.nx(f)), Math.round(FB.sy(i)));
}

// ── SVG: overlay pentatonic fretboard ────────────────────────────────────────

function overlayFretSVG(kd, ri) {
  const mpSet = new Set(kd.mpIdx), mnSet = new Set(kd.mnIdx), R = FB.R;
  const names = [...kd.mpN, ...kd.mnN, spellDeg(kd.root, 'b5')];
  const nameOf = pc => names.find(n => pcOf(n) === pc) || NN[pc];
  // scale degree of each note relative to the key's root, for the degrees view
  const degOf = pc => ['1','2','b3','3','4','b5','5','6','b7'].find(d => pcOf(spellDeg(kd.root, d)) === pc);
  const text = (x, y, t, cls) => `<text class="${cls}" x="${x}" y="${y+4}" text-anchor="middle" font-size="${t.length > 1 ? 9 : 10}" fill="white" font-weight="700" font-family="Courier New">${t}</text>`;
  const label = (x, y, n) => text(x, y, n, 'lbl-n') + text(x, y, degLabel(degOf(pcOf(n))), 'lbl-d');
  let s = fretboardBase();
  eachPosition((i, f, ni, x, y) => {
    const inM = mpSet.has(ni), inn = mnSet.has(ni);
    if (!inM && !inn) return;
    const type = (inM && inn) ? 'shared' : inM ? 'major' : 'minor';
    const col = PENT_COL[type], ir = (ni === ri);
    s += `<g class="fb-dot tap" data-type="${type}"${tapNote(OPEN_MIDI[i] + f, nameOf(ni))} style="opacity:1;transition:opacity 0.18s">`;
    if (ir) s += `<circle cx="${x}" cy="${y}" r="${R+4}" fill="none" stroke="${col}" stroke-width="1" opacity="0.3"/>`;
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="${col}"/>`;
    if (ir) s += `<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="white" stroke-width="1.8"/>`;
    s += label(x, y, nameOf(ni)) + `</g>`;
  });
  // Blues note (b5) — rendered on top, hidden by default
  eachPosition((i, f, ni, x, y) => {
    if (ni !== kd.bluesIdx) return;
    s += `<g class="fb-dot tap" data-type="blues"${tapNote(OPEN_MIDI[i] + f, nameOf(ni))} style="opacity:0;transition:opacity 0.18s">`;
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="${PENT_COL.blues}"/>`;
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="white" stroke-width="1.8" stroke-dasharray="3 2"/>`;
    s += label(x, y, nameOf(ni)) + `</g>`;
  });
  return s + `</svg>`;
}

// ── Scale theory block (reusable for major + minor) ───────────────────────────

// notes: optional Learn boxes {scale, triads, cycle, tertian}
function renderScaleBlock(scale, triads, cycle, cmap2, tsInts, cints, notes = {}) {
  const s8 = [...scale, scale[0]], s8m = voiceUp(s8, 3);
  let srow = '<div class="srow">';
  s8.forEach((n,i) => {
    if (i > 0) srow += '<div class="sc"></div>';
    const idx = i===7 ? 0 : i, co = DC[idx], bg = DB[idx];
    srow += `<div class="sn2"><span class="dg">${i===7?'8':i+1}</span><span class="nc"${tapNote(s8m[i], n, true)} style="border-color:${co};color:${co};background:${bg}">${n}</span></div>`;
  });
  srow += '</div>';
  let irow = '<div class="irow">';
  s8.forEach((_,i) => {
    irow += '<div class="ic"></div>';
    if (i < 7) { const t = tsInts[i]; irow += `<div class="im ${t.toLowerCase()}">${t}</div>`; }
  });
  irow += '</div>';
  let tickRow = '<div class="tick-row">';
  for (let i = 0; i < 7; i++) {
    if (i > 0) tickRow += '<div class="tick-sp" style="flex:1"></div>';
    tickRow += '<div class="tick"><div class="tick-line"></div></div>';
  }
  tickRow += '<div class="tick-sp" style="flex:1"></div><div style="width:54px;flex-shrink:0"></div></div>';
  const qSym = {maj:'△', min:'−', dim:'°'};
  let triadRow = '<div class="tir">';
  triads.forEach((t,i) => {
    if (i > 0) triadRow += '<div class="sp"></div>';
    const tm = voiceUp(t.n, 3);
    const ns = t.n.map((n, k) => `<div${tapNote(tm[k], n)} style="color:${gc(n,cmap2)}">${n}</div>`).reverse().join('');
    triadRow += `<div class="tri-slot ${t.q}"><div class="tn"${tapChord(chordMidis(t.n), t.c)}>${t.c}<span class="qs">${qSym[t.q]}</span></div><div class="tns">${ns}</div><div class="trm">${t.r}</div></div>`;
  });
  triadRow += '<div class="sp"></div><div class="es"></div></div>';
  const qr = {maj:'rm', min:'rn', dim:'rd'};
  let tert = `<table class="tt"><thead><tr><th>R</th><th>3</th><th>5</th><th class="dc">#</th><th class="rc">—</th></tr></thead><tbody>`;
  triads.forEach((t,i) => {
    tert += `<tr class="${qr[t.q]}">`;
    const tm = voiceUp(t.n, 3);
    t.n.forEach((n, k) => tert += `<td${tapNote(tm[k], n)} style="color:${gc(n,cmap2)}">${n}</td>`);
    tert += `<td class="dc">${i+1}</td><td class="rc">${t.r}</td></tr>`;
  });
  tert += `</tbody></table>`;
  return `${notes.scale || ''}<div class="scale-wrap"><div class="scale-inner">${srow}${irow}${tickRow}${triadRow}</div></div>${notes.triads || ''}
  <hr class="dv">
  <div class="theory-bottom">
    <div>
      <div class="sl" style="margin-bottom:4px">Cycle of thirds</div>
      <div class="cywrap">${cycleSVG({cycle}, cints)}</div>
    </div>
    <div>
      <div class="sl" style="margin-bottom:6px">Tertian (R · 3 · 5)</div>
      ${tert}
    </div>
  </div>
  ${notes.cycle || ''}${notes.tertian || ''}`;
}

// ── Full key page ─────────────────────────────────────────────────────────────

function renderKey(key) {
  const kd = KEYS[key], cmap2 = cm(kd.scale), ri = NN.indexOf(kd.root);
  const relCmap = cm(kd.rel.scale);

  const majorBlock = renderScaleBlock(
    kd.scale, kd.triads, kd.cycle, cmap2,
    ['T','T','S','T','T','T','S'], null,
    {scale: LEARN.majorScale(kd), triads: LEARN.triads(kd), cycle: LEARN.cycle(kd), tertian: LEARN.tertian()}
  );
  const minorBlock = renderScaleBlock(
    kd.rel.scale, kd.rel.triads, kd.rel.cycle, relCmap,
    ['T','S','T','T','S','T','T'], ['Min3','Maj3','Min3','Maj3','Min3','Min3','Maj3']
  );

  // Major open + dominant 7th chord rows
  // Spell diagram notes with this key's names (major, minor and pentatonic) so C gets Bb, not A#
  const names = [...kd.scale, ...kd.rel.scale, ...kd.mnN];
  let openRow = '<div class="cpair">', seventhRow = '<div class="cpair">';
  kd.chords.forEach(ch => openRow += chordCard({...ch.open, name: ch.name, tag: ch.tag, names}, cmap2));
  kd.sevenths.forEach(ch => seventhRow += chordCard({...ch, names}, cmap2));
  openRow += '</div>'; seventhRow += '</div>';

  // Minor chord row
  let minorChordRow = '<div class="cpair">';
  kd.rel.chords.forEach(ch => minorChordRow += chordCard({...ch, names}, relCmap));
  minorChordRow += '</div>';

  // Scale comparison table
  let comp = `<table class="ct"><thead><tr><th class="cdeg">Deg</th><th>${key} major pent</th><th>${key} minor pent</th><th>Note</th></tr></thead><tbody>`;
  kd.comp.forEach(r => {
    const mj = r.mj ? `<b style="color:var(--pmaj-k)">${r.mj}</b>` : `<span style="color:var(--mute)">—</span>`;
    const mn = r.mn ? `<b style="color:var(--pmin-k)">${r.mn}</b>` : `<span style="color:var(--mute)">—</span>`;
    comp += `<tr><td class="cdeg">${r.d}</td><td>${mj}</td><td>${mn}</td><td style="font-size:10px;color:var(--mute)">${r.t}</td></tr>`;
  });
  comp += `</tbody></table>`;

  const leg = kd.scale.map((n,i) => `<div class="li"><b style="color:${DC[i]}">■</b><span>${n} (${i+1})</span></div>`).join('');

  return `
<div class="key-section" id="key-${key}">
  <div class="key-banner">
    <div class="key-letter" aria-hidden="true">${key}</div>
    <div class="key-info">
      <div class="key-name">${kd.full}</div>
      <div class="key-sub">${kd.scale.join(' — ')}</div>
    </div>
  </div>

  ${guideIntro(key)}
  <div class="sh"><span class="sn">§1</span><span class="st">Scale &amp; Theory</span></div>
  <div class="sl" style="margin-bottom:6px">${key} major — ${kd.scale.join(' — ')}</div>
  ${majorBlock}
  <div style="margin:24px 0 16px;display:flex;align-items:center;gap:12px">
    <hr style="flex:1;border:none;border-top:1px dashed var(--faint);margin:0">
    <span style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mute);white-space:nowrap">Parallel minor · ${kd.rel.name}</span>
    <hr style="flex:1;border:none;border-top:1px dashed var(--faint);margin:0">
  </div>
  ${LEARN.parallelMinor(kd)}
  <div class="sl" style="margin-bottom:6px">${kd.rel.root} natural minor — ${kd.rel.scale.join(' — ')}</div>
  ${minorBlock}

  <div class="sh"><span class="sn">§2</span><span class="st">Chord Shapes — 1 · 4 · 5</span></div>
  ${LEARN.chordDiagram()}
  ${LEARN.openChords(kd)}
  <div class="sl" style="margin-bottom:8px">Open positions</div>
  ${openRow}
  ${LEARN.seventhChords(kd)}
  <div class="sl" style="margin-top:18px;margin-bottom:8px">Dominant 7th positions</div>
  ${seventhRow}
  ${listen(playBtn({mode: 'shuffle', root: kd.root, style: 'boogie'}, '12-bar shuffle: boogie riff'), playBtn({mode: 'shuffle', root: kd.root, style: 'strum'}, '12-bar shuffle: strummed 7ths'))}
  ${LEARN.minorChords(kd)}
  <div class="sl" style="margin-top:18px;margin-bottom:8px">${kd.rel.root} minor positions — i · iv · v</div>
  ${minorChordRow}

  <div class="sh"><span class="sn">§3</span><span class="st">Pentatonic Scales</span></div>
  ${LEARN.pentatonic(kd)}
  <div class="pent-btns">
    <button class="pent-btn maj" data-key="${key}" data-which="maj" aria-pressed="true"><span class="sw"></span>Major pentatonic — ${kd.mpN.join(' ')}</button>
    <button class="pent-btn min" data-key="${key}" data-which="min" aria-pressed="true"><span class="sw"></span>Minor pentatonic — ${kd.mnN.join(' ')}</button>
    <button class="pent-btn blues" data-key="${key}" data-which="blues" aria-pressed="false"><span class="sw"></span>Blues note — ${spellDeg(kd.root, 'b5')} (b5)</button>
  </div>
  ${listen(playBtn({mode: 'scale', notes: kd.mnN, drone: true}, 'minor pentatonic'), playBtn({mode: 'scale', notes: kd.mpN, drone: true}, 'major pentatonic'), playBtn({mode: 'scale', notes: scaleNotes(kd.root, SCALES.blues.degs), drone: true}, 'blues scale'))}
  <div class="pent-legend">
    <span class="maj"><span class="sw"></span>Major only</span>
    <span class="min"><span class="sw"></span>Minor only</span>
    <span class="both"><span class="sw"></span>In both</span>
    <span class="blues"><span class="sw"></span>Blues note (b5)</span>
  </div>
  ${degToggle()}<div class="fb-wrap">${overlayFretSVG(kd,ri)}</div>
  <hr class="dv">
  ${LEARN.comparison(kd)}
  <div class="sl" style="margin-bottom:7px">Scale comparison</div>
  ${comp}
  <div class="insight"><div class="insight-t">Blues tension</div><div class="insight-b">${kd.insight}</div></div>
  <hr class="dv">
  ${LEARN.legend()}
  <div class="legend">${leg}</div>
  ${guideMid(key)}
  ${quiz('blues' + key, 'Blues in ' + key)}
  ${guideEnd(key)}
</div>`;
}

// ── Chord cards ─────────────────────────────────────────────────────────────

// One chord diagram with its title and fingering label
function chordCard(ch, cmap) {
  const col = gc(ch.root || ch.name.match(/^[A-G](#|b)?/)[0], cmap);
  return `<div class="citem"><div class="cgtitle"${tapChord(shapeMidis(ch), ch.name)} style="color:${col};margin-bottom:4px">${ch.name}<span class="cgtag">· ${ch.tag}</span></div><div class="citemsub">${ch.lbl}</div>${chordSVG(ch, cmap)}</div>`;
}

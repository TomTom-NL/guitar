// Legibility check: WCAG contrast of every visible text on every page (notes and
// degrees view), plus colour-blind separation of the meaningful colour sets.
// Needs Playwright:  NODE_PATH=$(npm root -g) node tests/contrast-check.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({viewport: {width: 1300, height: 900}});
  await page.goto('file://' + path.join(__dirname, '..', 'index.html'));

  const result = await page.evaluate(() => {
    const parse = c => { const v = c.match(/[\d.]+/g).map(Number); return {r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1}; };
    const css = c => { const d = document.createElement('div'); d.style.color = c; document.body.appendChild(d); const v = parse(getComputedStyle(d).color); d.remove(); return v; };
    const lum = ({r, g, b}) => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const mix = (fg, bg, a) => ({r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a)});
    const ratio = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); };
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c.a > 0.5) return c; } return css('#fdf9ef'); };
    const opac = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
    const visible = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) if (getComputedStyle(e).display === 'none') return false; return opac(el) > 0.05; };
    const WOOD = css('#18100a');
    const out = [];
    const scan = mode => document.querySelectorAll('.key-section').forEach(sec => {
      sec.style.display = 'block';
      sec.querySelectorAll('*').forEach(el => {
        if (el.closest('svg') || el.closest('[aria-hidden="true"]') || !visible(el)) return;
        if (![...el.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim().length > 0)) return;
        const cs = getComputedStyle(el), fg = parse(cs.color), bg = bgOf(el);
        const r = ratio(mix(fg, bg, fg.a * opac(el)), bg), size = parseFloat(cs.fontSize), large = size >= 18.66 || (+cs.fontWeight >= 700 && size >= 14);
        out.push({mode, page: sec.id, what: (typeof el.className === 'string' && el.className) || el.tagName, txt: el.textContent.trim().slice(0, 24), r, need: large ? 3 : 4.5, size});
      });
      sec.querySelectorAll('svg text').forEach(t => {
        if (!visible(t)) return;
        const svg = t.closest('svg'), onWood = svg.querySelector('rect[fill="#18100a"]') && +t.getAttribute('x') > 68 && +t.getAttribute('y') < 285;
        // background = the last filled circle/rect drawn before this label that contains its centre
        let bg = onWood ? WOOD : bgOf(svg.parentElement);
        const tx = +t.getAttribute('x'), ty = +t.getAttribute('y') - 4;
        [...svg.querySelectorAll('circle, rect')].filter(sh => sh.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING).forEach(sh => {
          const f = sh.getAttribute('fill');
          if (!f || f === 'none' || f.startsWith('rgba(255,255,255,0.08') || f === '#18100a') return;
          const inside = sh.tagName === 'circle'
            ? Math.hypot(+sh.getAttribute('cx') - tx, +sh.getAttribute('cy') - ty) <= +sh.getAttribute('r')
            : tx >= +sh.getAttribute('x') && tx <= +sh.getAttribute('x') + +sh.getAttribute('width') && ty >= +sh.getAttribute('y') && ty <= +sh.getAttribute('y') + +sh.getAttribute('height');
          if (inside) bg = mix(css(f.replace('var(--bg)', '#fdf9ef').replace('var(--surface)', '#f7f2e3')), bg, +(sh.getAttribute('opacity') || 1));
        });
        const fill = t.getAttribute('fill') || '#000';
        const fg = css(fill.startsWith('var(') ? getComputedStyle(document.documentElement).getPropertyValue(fill.slice(4, -1)).trim() : fill);
        const r = ratio(mix(fg, bg, fg.a * +(t.getAttribute('opacity') || 1) * opac(svg)), bg);
        out.push({mode, page: sec.id, what: 'svg text', txt: t.textContent.slice(0, 20), r, need: 4.5, size: +t.getAttribute('font-size')});
      });
    });
    setDegreeMode(false); scan('notes');
    setDegreeMode(true); scan('degrees');
    setDegreeMode(false);
    return {items: out, sets: {'scale degrees': COL.deg, 'pentatonic overlay': {major: COL.major, minor: COL.minor, both: COL.both, blues: COL.blues}, 'chord functions': {T: COL.T, S: COL.S, D: COL.D}}};
  });

  const fails = result.items.filter(x => x.r < x.need - 0.005);
  const small = result.items.filter(x => x.what !== 'svg text' && x.size < 10);
  console.log(`text checked: ${result.items.length}   below WCAG AA: ${fails.length}   html text under 10px: ${small.length}`);
  const groups = {};
  fails.forEach(x => { const k = `${x.page} | ${x.what}`; (groups[k] = groups[k] || {n: 0, min: 99, ex: x.txt}).n++; groups[k].min = Math.min(groups[k].min, x.r); });
  Object.entries(groups).sort((a, b) => b[1].n - a[1].n).slice(0, 25).forEach(([k, v]) => console.log(`  ${String(v.n).padStart(3)}  min ${v.min.toFixed(2)}  ${k}  e.g. "${v.ex}"`));

  // colour-blind separation (CIE76 ΔE after Machado 2009 simulation)
  const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4), gam = c => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  const M = {normal: [[1,0,0],[0,1,0],[0,0,1]], deutan: [[0.367,0.861,-0.228],[0.280,0.673,0.047],[-0.012,0.043,0.969]], protan: [[0.152,1.053,-0.205],[0.115,0.786,0.099],[-0.004,-0.048,1.052]]};
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const sim = (c, t) => { const l = c.map(lin); return M[t].map(r => gam(Math.min(1, Math.max(0, r[0]*l[0] + r[1]*l[1] + r[2]*l[2])))); };
  const lab = c => { const l = c.map(lin); const X = (0.4124*l[0] + 0.3576*l[1] + 0.1805*l[2]) / 0.9505, Y = 0.2126*l[0] + 0.7152*l[1] + 0.0722*l[2], Z = (0.0193*l[0] + 0.1192*l[1] + 0.9505*l[2]) / 1.089; const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787*t + 16/116; return [116*f(Y) - 16, 500*(f(X) - f(Y)), 200*(f(Y) - f(Z))]; };
  let cvdFail = false;
  for (const [name, set] of Object.entries(result.sets)) {
    const e = Object.entries(set); let worst = 1e9, where = '';
    for (const t of Object.keys(M)) for (let i = 0; i < e.length; i++) for (let j = i + 1; j < e.length; j++) {
      const d = Math.hypot(...lab(sim(rgb(e[i][1]), t)).map((v, x) => v - lab(sim(rgb(e[j][1]), t))[x]));
      if (d < worst) { worst = d; where = `${t}: ${e[i][0]} vs ${e[j][0]}`; }
    }
    if (worst < 15) cvdFail = true;
    console.log(`colour set "${name}": smallest difference ΔE ${worst.toFixed(1)} (${where})${worst < 15 ? '  ← too close' : ''}`);
  }
  await browser.close();
  process.exit(fails.length || small.length || cvdFail ? 1 : 0);
})();

:root {
  --bg: #fdf9ef; --surface: #f7f2e3; --ink: #1c1a14; --ink2: #4a4639;
  --faint: #e2ddd0; --faint2: #ece8da;
  --mc: #c97b20; --mk: #8a5010; --ml: #fdf0dc;
  --nc: #1e5fa8; --nk: #133f75; --nl: #ddeaf8;
  --qmb: #dceaf7; --qmd: #9bbcd8;
  --qnb: #ede8f5; --qnd: #b9add4;
  --qdb: #fde8e8; --qdd: #d8a9a9;
}

* { box-sizing: border-box; margin: 0; padding: 0 }

body {
  background: var(--bg); color: var(--ink);
  font-family: 'Courier New', monospace; font-size: 13px;
  line-height: 1.5; zoom: 1.75;
}

.site-header {
  background: var(--ink); color: #f5f0e0;
  padding: 16px 28px 0; position: sticky; top: 0; z-index: 100;
}

.header-top { display: flex; align-items: baseline; gap: 14px; margin-bottom: 14px }
.site-header h1 { font-family: Georgia, serif; font-size: 20px; font-weight: 700 }
.site-header .sub { font-size: 12px; opacity: 0.4 }

.tabs { display: flex; gap: 2px }
.tab {
  background: none; border: none; color: rgba(245,240,224,0.45);
  font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700;
  letter-spacing: 0.5px; padding: 9px 22px 11px; cursor: pointer;
  border-bottom: 3px solid transparent; transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.tab:hover { color: rgba(245,240,224,0.8) }
.tab.active { color: #f5f0e0; border-bottom-color: #c97b20 }

.page { max-width: 960px; margin: 0 auto; padding: 0 28px 60px }

.key-section { margin-bottom: 56px }
.key-banner {
  display: flex; align-items: baseline; gap: 0; padding: 28px 0 14px;
  border-bottom: 3px solid var(--ink); margin-bottom: 24px;
}

.key-letter {
  font-family: Georgia, serif; font-size: 64px; font-weight: 700;
  line-height: 1; margin-right: 16px; opacity: 0.12; user-select: none;
}

.key-info { display: flex; flex-direction: column; gap: 2px }
.key-name { font-family: Georgia, serif; font-size: 24px; font-weight: 700 }
.key-sub { font-size: 11px; opacity: 0.45; letter-spacing: 1px; text-transform: uppercase }

.sh {
  display: flex; align-items: center; gap: 10px; margin: 28px 0 16px;
  padding-bottom: 7px; border-bottom: 1.5px solid var(--faint);
}

.sh:first-of-type { margin-top: 0 }
.sn { font-size: 10px; opacity: 0.3; font-weight: 700; letter-spacing: 1px }
.st { font-family: Georgia, serif; font-size: 15px; font-weight: 700 }
.sl { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.42; margin-bottom: 6px }
hr.dv { border: none; border-top: 1px solid var(--faint); margin: 18px 0 }

.srow { display: flex; align-items: center }
.sn2 { width: 54px; text-align: center }
.sn2 .dg { font-size: 10px; color: #999; display: block; margin-bottom: 2px }
.sn2 .nc {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 50%; font-size: 12px; font-weight: 700;
  border: 2px solid var(--faint); background: var(--surface);
}

.sc { flex: 1; height: 2px; background: var(--faint); position: relative; top: 7px }
.irow { display: flex; margin-top: 3px }
.ic { width: 54px }
.im { flex: 1; text-align: center; font-size: 10px; font-weight: 700 }
.im.t { color: #8b5e00 }
.im.s { color: #c44 }

.tg { display: grid; grid-template-columns: 82px 1fr 188px; gap: 14px; align-items: start; margin-bottom: 20px }
@media(max-width:680px) { .tg { grid-template-columns: 1fr } }

.tir { display: flex; align-items: flex-start; margin-top: 8px }
.tir .sp { flex: 1 }
.tir .es { width: 54px; flex-shrink: 0 }

.tri-slot { width: 54px; flex-shrink: 0; border: 1.5px solid; border-radius: 4px; padding: 4px 2px 3px; text-align: center }
.tri-slot.maj { background: var(--qmb); border-color: var(--qmd) }
.tri-slot.min { background: var(--qnb); border-color: var(--qnd) }
.tri-slot.dim { background: var(--qdb); border-color: var(--qdd) }
.tri-slot .tn { font-size: 10px; font-weight: 700; margin-bottom: 2px; line-height: 1.2 }
.tri-slot.maj .tn { color: #1a5291 }
.tri-slot.min .tn { color: #6b2d8b }
.tri-slot.dim .tn { color: #8b1a1a }
.tri-slot .tns { font-size: 8px; line-height: 1.4; margin-bottom: 2px }
.tri-slot .trm { font-size: 8px; font-style: italic; opacity: 0.5; border-top: 1px solid

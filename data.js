// ── Constants ────────────────────────────────────────────────────────────────

const NN = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const OS = [4,9,2,7,11,4];            // open string semitone offsets E A D G B e
const SL = ['E','A','D','G','B','e']; // string labels

// 7 degree colours (root → 7th)
const DC = ['#1a5291','#0e7a7a','#8b5e00','#6b2d8b','#2d6a1e','#b83800','#555'];
const DB = [
  'rgba(26,82,145,0.13)','rgba(14,122,122,0.11)','rgba(139,94,0,0.11)',
  'rgba(107,45,139,0.11)','rgba(45,106,30,0.11)','rgba(184,56,0,0.11)',
  'rgba(0,0,0,0.05)'
];

// ── Key data ─────────────────────────────────────────────────────────────────

const KEYS = {
  A:{root:'A',full:'Blues in A',scale:['A','B','C#','D','E','F#','G#'],
    triads:[{c:'A',q:'maj',n:['A','C#','E'],r:'I'},{c:'Bm',q:'min',n:['B','D','F#'],r:'ii'},{c:'C#m',q:'min',n:['C#','E','G#'],r:'iii'},{c:'D',q:'maj',n:['D','F#','A'],r:'IV'},{c:'E',q:'maj',n:['E','G#','B'],r:'V'},{c:'F#m',q:'min',n:['F#','A','C#'],r:'vi'},{c:'G#°',q:'dim',n:['G#','B','D'],r:'vii°'}],
    cycle:['A','C#','E','G#','B','D','F#'],
    mpIdx:[9,11,1,4,6],mpN:['A','B','C#','E','F#'],mpF:'1 — 2 — 3 — 5 — 6',mpD:['1=A','2=B','3=C#','5=E','6=F#'],
    mnIdx:[9,0,2,4,7], mnN:['A','C','D','E','G'], mnF:'1 — b3 — 4 — 5 — b7',mnD:['1=A','b3=C','4=D','5=E','b7=G'],
    bluesIdx:3,  // D# · b5 of A minor pentatonic
    comp:[{d:'1',mj:'A',mn:'A',sh:1,t:'Shared — root'},{d:'2',mj:'B',mn:null,sh:0,t:'Major only'},{d:'b3',mj:null,mn:'C',sh:0,t:'Blues note — C vs C# over A chord'},{d:'3',mj:'C#',mn:null,sh:0,t:'Major only — bright'},{d:'4',mj:null,mn:'D',sh:0,t:'Minor only'},{d:'5',mj:'E',mn:'E',sh:1,t:'Shared — fifth'},{d:'6',mj:'F#',mn:null,sh:0,t:'Major only'},{d:'b7',mj:null,mn:'G',sh:0,t:'Minor only — bluesy'}],
    insight:'The key clash is <b>C natural vs C#</b>. Minor pent has C (b3), but the A major chord has C#. Bending C toward C# is the defining blues move in A.',
    chords:[
      {name:'A major',tag:'I',
       open:{lbl:'open · x02220',sf:0,mu:[0],dots:[{s:2,f:2},{s:3,f:2},{s:4,f:2}],br:null},
       barre:{lbl:'barre 5fr · E shape',sf:5,mu:[],dots:[{s:1,f:7},{s:2,f:7},{s:3,f:6}],br:{f:5,a:0,b:5}}},
      {name:'D major',tag:'IV',
       open:{lbl:'open · xx0232',sf:0,mu:[0,1],dots:[{s:3,f:2},{s:4,f:3},{s:5,f:2}],br:null},
       barre:{lbl:'barre 5fr · A shape',sf:5,mu:[0],dots:[{s:2,f:7},{s:3,f:7},{s:4,f:7}],br:{f:5,a:1,b:5}}},
      {name:'E major',tag:'V',
       open:{lbl:'open · 022100',sf:0,mu:[],dots:[{s:1,f:2},{s:2,f:2},{s:3,f:1}],br:null},
       barre:{lbl:'barre 7fr · A shape',sf:7,mu:[0],dots:[{s:2,f:9},{s:3,f:9},{s:4,f:9}],br:{f:7,a:1,b:5}}}],
    sevenths:[
      {name:'A7',tag:'I7', lbl:'open · x02020',sf:0,mu:[0],  dots:[{s:2,f:2},{s:4,f:2}],br:null},
      {name:'D7',tag:'IV7',lbl:'open · xx0212',sf:0,mu:[0,1],dots:[{s:3,f:2},{s:4,f:1},{s:5,f:2}],br:null},
      {name:'E7',tag:'V7', lbl:'open · 020100',sf:0,mu:[],   dots:[{s:1,f:2},{s:3,f:1}],br:null}],
    rel:{root:'A',name:'A natural minor',scale:['A','B','C','D','E','F','G'],
      triads:[
        {c:'Am',q:'min',n:['A','C','E'], r:'i'},
        {c:'B°',q:'dim',n:['B','D','F'], r:'ii°'},
        {c:'C', q:'maj',n:['C','E','G'], r:'III'},
        {c:'Dm',q:'min',n:['D','F','A'], r:'iv'},
        {c:'Em',q:'min',n:['E','G','B'], r:'v'},
        {c:'F', q:'maj',n:['F','A','C'], r:'VI'},
        {c:'G', q:'maj',n:['G','B','D'], r:'VII'}],
      cycle:['A','C','E','G','B','D','F'],
      chords:[
        {name:'Am',tag:'i',  lbl:'open · x02210',sf:0,mu:[0],  dots:[{s:2,f:2},{s:3,f:2},{s:4,f:1}],br:null},
        {name:'Dm',tag:'iv', lbl:'open · xx0231',sf:0,mu:[0,1],dots:[{s:3,f:2},{s:4,f:3},{s:5,f:1}],br:null},
        {name:'Em',tag:'v',  lbl:'open · 022000',sf:0,mu:[],   dots:[{s:1,f:2},{s:2,f:2}],br:null}]}},

  E:{root:'E',full:'Blues in E',scale:['E','F#','G#','A','B','C#','D#'],
    triads:[{c:'E',q:'maj',n:['E','G#','B'],r:'I'},{c:'F#m',q:'min',n:['F#','A','C#'],r:'ii'},{c:'G#m',q:'min',n:['G#','B','D#'],r:'iii'},{c:'A',q:'maj',n:['A','C#','E'],r:'IV'},{c:'B',q:'maj',n:['B','D#','F#'],r:'V'},{c:'C#m',q:'min',n:['C#','E','G#'],r:'vi'},{c:'D#°',q:'dim',n:['D#','F#','A'],r:'vii°'}],
    cycle:['E','G#','B','D#','F#','A','C#'],
    mpIdx:[4,6,8,11,1],mpN:['E','F#','G#','B','C#'],mpF:'1 — 2 — 3 — 5 — 6',mpD:['1=E','2=F#','3=G#','5=B','6=C#'],
    mnIdx:[4,7,9,11,2],mnN:['E','G','A','B','D'], mnF:'1 — b3 — 4 — 5 — b7',mnD:['1=E','b3=G','4=A','5=B','b7=D'],
    bluesIdx:10, // A# · b5 of E minor pentatonic
    comp:[{d:'1',mj:'E',mn:'E',sh:1,t:'Shared — root'},{d:'2',mj:'F#',mn:null,sh:0,t:'Major only'},{d:'b3',mj:null,mn:'G',sh:0,t:'Blues note — G vs G# over E chord'},{d:'3',mj:'G#',mn:null,sh:0,t:'Major only — bright'},{d:'4',mj:null,mn:'A',sh:0,t:'Minor only'},{d:'5',mj:'B',mn:'B',sh:1,t:'Shared — fifth'},{d:'6',mj:'C#',mn:null,sh:0,t:'Major only'},{d:'b7',mj:null,mn:'D',sh:0,t:'Minor only — bluesy'}],
    insight:'The key clash is <b>G natural vs G#</b>. Minor pent has G (b3), but the E major chord has G#. Bending G toward G# is the defining SRV/BB King blues move in E.',
    chords:[
      {name:'E major',tag:'I',
       open:{lbl:'open · 022100',sf:0,mu:[],dots:[{s:1,f:2},{s:2,f:2},{s:3,f:1}],br:null},
       barre:{lbl:'barre 7fr · A shape',sf:7,mu:[0],dots:[{s:2,f:9},{s:3,f:9},{s:4,f:9}],br:{f:7,a:1,b:5}}},
      {name:'A major',tag:'IV',
       open:{lbl:'open · x02220',sf:0,mu:[0],dots:[{s:2,f:2},{s:3,f:2},{s:4,f:2}],br:null},
       barre:{lbl:'barre 5fr · E shape',sf:5,mu:[],dots:[{s:1,f:7},{s:2,f:7},{s:3,f:6}],br:{f:5,a:0,b:5}}},
      {name:'B major',tag:'V',
       open:{lbl:'x24442 · A shape 2fr',sf:2,mu:[0],dots:[{s:2,f:4},{s:3,f:4},{s:4,f:4}],br:{f:2,a:1,b:5}},
       barre:{lbl:'barre 7fr · E shape',sf:7,mu:[],dots:[{s:1,f:9},{s:2,f:9},{s:3,f:8}],br:{f:7,a:0,b:5}}}],
    sevenths:[
      {name:'E7',tag:'I7', lbl:'open · 020100',sf:0,mu:[],   dots:[{s:1,f:2},{s:3,f:1}],br:null},
      {name:'A7',tag:'IV7',lbl:'open · x02020',sf:0,mu:[0],  dots:[{s:2,f:2},{s:4,f:2}],br:null},
      {name:'B7',tag:'V7', lbl:'open · x21202',sf:0,mu:[0],  dots:[{s:1,f:2},{s:2,f:1},{s:3,f:2},{s:5,f:2}],br:null}],
    rel:{root:'E',name:'E natural minor',scale:['E','F#','G','A','B','C','D'],
      triads:[
        {c:'Em', q:'min',n:['E','G','B'],   r:'i'},
        {c:'F#°',q:'dim',n:['F#','A','C'],  r:'ii°'},
        {c:'G',  q:'maj',n:['G','B','D'],   r:'III'},
        {c:'Am', q:'min',n:['A','C','E'],   r:'iv'},
        {c:'Bm', q:'min',n:['B','D','F#'],  r:'v'},
        {c:'C',  q:'maj',n:['C','E','G'],   r:'VI'},
        {c:'D',  q:'maj',n:['D','F#','A'],  r:'VII'}],
      cycle:['E','G','B','D','F#','A','C'],
      chords:[
        {name:'Em',tag:'i',  lbl:'open · 022000',      sf:0,mu:[],  dots:[{s:1,f:2},{s:2,f:2}],br:null},
        {name:'Am',tag:'iv', lbl:'open · x02210',      sf:0,mu:[0], dots:[{s:2,f:2},{s:3,f:2},{s:4,f:1}],br:null},
        {name:'Bm',tag:'v',  lbl:'barre 2fr · A shape',sf:2,mu:[0], dots:[{s:2,f:4},{s:3,f:4},{s:4,f:3}],br:{f:2,a:1,b:5}}]}},

  C:{root:'C',full:'Blues in C',scale:['C','D','E','F','G','A','B'],
    triads:[{c:'C',q:'maj',n:['C','E','G'],r:'I'},{c:'Dm',q:'min',n:['D','F','A'],r:'ii'},{c:'Em',q:'min',n:['E','G','B'],r:'iii'},{c:'F',q:'maj',n:['F','A','C'],r:'IV'},{c:'G',q:'maj',n:['G','B','D'],r:'V'},{c:'Am',q:'min',n:['A','C','E'],r:'vi'},{c:'B°',q:'dim',n:['B','D','F'],r:'vii°'}],
    cycle:['C','E','G','B','D','F','A'],
    mpIdx:[0,2,4,7,9], mpN:['C','D','E','G','A'],  mpF:'1 — 2 — 3 — 5 — 6', mpD:['1=C','2=D','3=E','5=G','6=A'],
    mnIdx:[0,3,5,7,10],mnN:['C','D#','F','G','A#'],mnF:'1 — b3 — 4 — 5 — b7',mnD:['1=C','b3=D#','4=F','5=G','b7=A#'],
    bluesIdx:6,  // F# · b5 of C minor pentatonic
    comp:[{d:'1',mj:'C',mn:'C',sh:1,t:'Shared — root'},{d:'2',mj:'D',mn:null,sh:0,t:'Major only'},{d:'b3',mj:null,mn:'D#',sh:0,t:'Blues note — D#/Eb vs E over C chord'},{d:'3',mj:'E',mn:null,sh:0,t:'Major only — bright'},{d:'4',mj:null,mn:'F',sh:0,t:'Minor only'},{d:'5',mj:'G',mn:'G',sh:1,t:'Shared — fifth'},{d:'6',mj:'A',mn:null,sh:0,t:'Major only'},{d:'b7',mj:null,mn:'A#',sh:0,t:'Minor only — bluesy'}],
    insight:'The key clash is <b>D#/Eb vs E natural</b>. Minor pent has Eb (b3), but the C major chord has E. Bending Eb toward E is the blues tension in C.',
    chords:[
      {name:'C major',tag:'I',
       open:{lbl:'open · x32010',sf:0,mu:[0],dots:[{s:1,f:3},{s:2,f:2},{s:4,f:1}],br:null},
       barre:{lbl:'barre 8fr · E shape',sf:8,mu:[],dots:[{s:1,f:10},{s:2,f:10},{s:3,f:9}],br:{f:8,a:0,b:5}}},
      {name:'F major',tag:'IV',
       open:{lbl:'barre 1fr · E shape',sf:0,mu:[],dots:[{s:1,f:3},{s:2,f:3},{s:3,f:2}],br:{f:1,a:0,b:5}},
       barre:{lbl:'barre 8fr · A shape',sf:8,mu:[0],dots:[{s:2,f:10},{s:3,f:10},{s:4,f:10}],br:{f:8,a:1,b:5}}},
      {name:'G major',tag:'V',
       open:{lbl:'open · 320003',sf:0,mu:[],dots:[{s:0,f:3},{s:1,f:2},{s:5,f:3}],br:null},
       barre:{lbl:'barre 3fr · E shape',sf:3,mu:[],dots:[{s:1,f:5},{s:2,f:5},{s:3,f:4}],br:{f:3,a:0,b:5}}}],
    sevenths:[
      {name:'C7',tag:'I7', lbl:'open · x32310',sf:0,mu:[0],  dots:[{s:1,f:3},{s:2,f:2},{s:3,f:3},{s:4,f:1}],br:null},
      {name:'F7',tag:'IV7',lbl:'open · xx3241',sf:0,mu:[0,1],dots:[{s:2,f:3},{s:3,f:2},{s:4,f:4},{s:5,f:1}],br:null},
      {name:'G7',tag:'V7', lbl:'open · 320001',sf:0,mu:[],   dots:[{s:0,f:3},{s:1,f:2},{s:5,f:1}],br:null}],
    rel:{root:'C',name:'C natural minor',scale:['C','D','D#','F','G','G#','A#'],
      triads:[
        {c:'Cm', q:'min',n:['C','D#','G'],   r:'i'},
        {c:'D°', q:'dim',n:['D','F','G#'],   r:'ii°'},
        {c:'D#', q:'maj',n:['D#','G','A#'],  r:'III'},
        {c:'Fm', q:'min',n:['F','G#','C'],   r:'iv'},
        {c:'Gm', q:'min',n:['G','A#','D'],   r:'v'},
        {c:'G#', q:'maj',n:['G#','C','D#'],  r:'VI'},
        {c:'A#', q:'maj',n:['A#','D','F'],   r:'VII'}],
      cycle:['C','D#','G','A#','D','F','G#'],
      chords:[
        {name:'Cm',tag:'i',  lbl:'barre 3fr · A shape', sf:3,mu:[0],dots:[{s:2,f:5},{s:3,f:5},{s:4,f:4}],br:{f:3,a:1,b:5}},
        {name:'Fm',tag:'iv', lbl:'barre 1fr · Em shape',sf:0,mu:[],  dots:[{s:1,f:3},{s:2,f:3}],br:{f:1,a:0,b:5}},
        {name:'Gm',tag:'v',  lbl:'open · 310033',       sf:0,mu:[],  dots:[{s:0,f:3},{s:1,f:1},{s:4,f:3},{s:5,f:3}],br:null}]}}
};

// ── Pure helper functions ─────────────────────────────────────────────────────

// Build a note → {colour, bg} map from a scale array
function cm(scale) {
  const m = {};
  scale.forEach((n, i) => m[n] = {c: DC[i], b: DB[i]});
  return m;
}

// Look up a note's colour in a map, fallback grey
function gc(n, m) { return m[n]?.c || '#888'; }

// Resolve the note name at a string/fret position given a chord config
function nat(s, cfg) {
  if (cfg.mu.includes(s)) return null;
  const d = cfg.dots.find(x => x.s === s);
  if (d) return NN[(OS[s] + d.f) % 12];
  if (cfg.br && s >= cfg.br.a && s <= cfg.br.b) return NN[(OS[s] + cfg.br.f) % 12];
  return cfg.sf === 0 ? NN[OS[s]] : null;
}

// Y position of a fret on a chord diagram
function dy(f, sf) { return 32 + 32 * (sf === 0 ? f : f - sf + 1); }

let __s=12345; Math.random=()=>((__s=(__s*1103515245+12345)%2147483648)/2147483648);
// Search for a 7-colour degree palette: dark enough for white text (>=4.5:1) and readable as text on cream (>=4.5:1),
// maximising the smallest colour difference (CIE76 ΔE) under normal, deutan and protan vision.
const lin=c=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4), gam=c=>c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055;
const M={normal:[[1,0,0],[0,1,0],[0,0,1]],deutan:[[0.367,0.861,-0.228],[0.280,0.673,0.047],[-0.012,0.043,0.969]],protan:[[0.152,1.053,-0.205],[0.115,0.786,0.099],[-0.004,-0.048,1.052]]};
const sim=(rgb,t)=>{const l=rgb.map(lin);return M[t].map(r=>gam(Math.min(1,Math.max(0,r[0]*l[0]+r[1]*l[1]+r[2]*l[2]))))};
const lab=rgb=>{const l=rgb.map(lin);const X=(0.4124*l[0]+0.3576*l[1]+0.1805*l[2])/0.9505,Y=0.2126*l[0]+0.7152*l[1]+0.0722*l[2],Z=(0.0193*l[0]+0.1192*l[1]+0.9505*l[2])/1.089;const f=t=>t>0.008856?Math.cbrt(t):7.787*t+16/116;return [116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))]};
const lum=rgb=>{const l=rgb.map(lin);return 0.2126*l[0]+0.7152*l[1]+0.0722*l[2]};
const cr=(a,b)=>{const A=lum(a),B=lum(b);return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05)};
const fromLch=(L,C,h)=>{const a=C*Math.cos(h*Math.PI/180),b=C*Math.sin(h*Math.PI/180);const fy=(L+16)/116,fx=fy+a/500,fz=fy-b/200;const inv=t=>t**3>0.008856?t**3:(t-16/116)/7.787;const X=inv(fx)*0.9505,Y=inv(fy),Z=inv(fz)*1.089;
 const r=3.2406*X-1.5372*Y-0.4986*Z,g=-0.9689*X+1.8758*Y+0.0415*Z,bb=0.0557*X-0.2040*Y+1.0570*Z;const o=[r,g,bb].map(gam);return o.every(v=>v>=0&&v<=1)?o:null};
const hex=c=>'#'+c.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');
const cream=[253,249,239].map(v=>v/255), white=[1,1,1];
const cands=[];
for(let L=22;L<=56;L+=3)for(let C=20;C<=90;C+=7)for(let h=0;h<360;h+=6){const c=fromLch(L,C,h);if(c&&cr(c,white)>=4.6&&cr(c,cream)>=4.6)cands.push(c)}
const labs=cands.map(c=>['normal','deutan','protan'].map(t=>lab(sim(c,t))));
const d=(i,j)=>Math.min(...[0,1,2].map(k=>Math.hypot(...labs[i][k].map((v,x)=>v-labs[j][k][x]))));
// seed: degree 1 stays close to the current blue #1a5291
const want=lab([0x1a,0x52,0x91].map(v=>v/255));let seed=0,best=1e9;cands.forEach((c,i)=>{const e=Math.hypot(...lab(c).map((v,x)=>v-want[x]));if(e<best){best=e;seed=i}});
let bestSet=null,bestMin=0;
for(let trial=0;trial<400;trial++){
  const set=[seed];
  while(set.length<7){let bi=-1,bv=-1;for(let i=0;i<cands.length;i++){if(set.includes(i))continue;const m=Math.min(...set.map(j=>d(i,j)))*(0.85+Math.random()*0.3);if(m>bv){bv=m;bi=i}}set.push(bi)}
  // local improvement
  for(let it=0;it<300;it++){const k=1+Math.floor(Math.random()*6),i=Math.floor(Math.random()*cands.length);if(set.includes(i))continue;const old=set[k];const score=s=>{let m=1e9;for(let a=0;a<7;a++)for(let b=a+1;b<7;b++)m=Math.min(m,d(s[a],s[b]));return m};const before=score(set);set[k]=i;if(score(set)<before)set[k]=old}
  let m=1e9;for(let a=0;a<7;a++)for(let b=a+1;b<7;b++)m=Math.min(m,d(set[a],set[b]));
  if(m>bestMin){bestMin=m;bestSet=set.slice()}
}
console.log(cands.length,'candidates; best worst-case ΔE across normal/deutan/protan:',bestMin.toFixed(1));
bestSet.forEach(i=>{const c=cands[i],l=lab(c);console.log(hex(c),'L',l[0].toFixed(0),'hue',(Math.atan2(l[2],l[1])*180/Math.PI+360).toFixed(0)%360,'white',cr(c,white).toFixed(1),'cream',cr(c,cream).toFixed(1))});
const P=bestSet.map(i=>cands[i]);
const L2=P.map(c=>['normal','deutan','protan'].map(t=>lab(sim(c,t))));
const dd=(i,j)=>Math.min(...[0,1,2].map(k=>Math.hypot(...L2[i][k].map((v,x)=>v-L2[j][k][x]))));
const combos=(n,k,s=0,cur=[])=>cur.length===k?[cur]:Array.from({length:n-s},(_,i)=>combos(n,k,s+i+1,[...cur,s+i])).flat();
for(const k of [3,4]){let best=null,bm=0;for(const c of combos(7,k)){let m=1e9;for(let a=0;a<k;a++)for(let b=a+1;b<k;b++)m=Math.min(m,dd(c[a],c[b]));if(m>bm){bm=m;best=c}}console.log('best',k,':',best.map(i=>hex(P[i])).join(' '),'min ΔE',bm.toFixed(1))}

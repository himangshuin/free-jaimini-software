// Jaimini Upadesa Sutras engine (Adhyaya 1 & 2). Pure functions on a sidereal chart `sid` (longitudes incl. Lagna).
// Source: Jaimini Sutras, tr. B. Suryanarain Rao, rev. B.V. Raman (references written as Su 1.1.x = Adhyaya.Pada.Sutra).
const J_BENEFIC=['Jupiter','Venus','Mercury','Ketu'];            // per the book's notes to Su 2.1.40 (Moon: benefic unless with Mars)
const J_MALEFIC=['Sun','Mars','Saturn','Rahu'];
const J_SAVYA=new Set([0,1,2,6,7,8]);                            // Su 1.1.25-27 (odd signs direct; Taurus/Scorpio direct; Leo/Aquarius reverse)
const J_DUAL={7:['Mars','Ketu'],10:['Saturn','Rahu']};
const J_HOUSE_TOPIC=['Self, body, vitality','Wealth, family, speech','Courage, younger siblings, effort','Home, mother, comforts, vehicles','Intelligence, children, mantra','Enemies, debts, service, illness','Spouse, partnerships','Obstacles, sudden change, inheritance','Dharma, father, fortune, teachers','Career, status, action','Gains, elder siblings, fulfilment','Expenses, losses, foreign lands, liberation'];
const J_sign=p=>Math.floor(n(p)/30), J_cnt=(a,b)=>((b-a+12)%12)+1;
const J_at=(s,h)=>(s+h-1)%12;
const J_occ=(sid,s)=>PLN.filter(p=>J_sign(sid[p])===s);
const J_asp=s=>{const t=s%3;return t===2?[2,5,8,11].filter(x=>x!==s):t===0?[1,4,7,10].filter(x=>x!==(s+1)%12):[0,3,6,9].filter(x=>x!==(s+11)%12)}; // Su 1.1.2-4
// planets whose sign aspects sign s (rasi drishti)
const J_aspBy=(sid,s)=>PLN.filter(p=>J_asp(J_sign(sid[p])).includes(s));
// planets influencing sign s: occupying or aspecting
const J_infl=(sid,s)=>[...new Set([...J_occ(sid,s),...J_aspBy(sid,s)])];
const J_isBen=(sid,p)=>p==='Moon'?!(J_occ(sid,J_sign(sid.Moon)).includes('Mars')):J_BENEFIC.includes(p);
const J_isMal=(sid,p)=>!J_isBen(sid,p);
const J_dms=d=>{const t=Math.round(d*3600);return`${Math.floor(t/3600)}\u00b0${String(Math.floor(t%3600/60)).padStart(2,'0')}\u2032${String(t%60).padStart(2,'0')}\u2033`};
const J_dignity=(p,s)=>EX[p]===undefined?'':EX[p]===s?'exalted':(EX[p]+6)%12===s?'debilitated':SL[s]===p?'own sign':'';

// ---- Chara Karakas (Su 1.1.11-18), ranked by arc-minutes then arc-seconds within the degree; whole degrees are ignored.
// Only the seven planets Sun to Saturn take part: Rahu and Ketu are not karakas.
const J_KNAMES7=['Atmakaraka','Amatyakaraka','Bhratrukaraka','Matrukaraka','Putrakaraka','Gnatikaraka','Darakaraka'];
function J_karakas(sid){
 const g=PLN.slice(0,7);
 const mk=p=>{const deg=n(sid[p])%30,t=Math.round(deg*3600)%3600,m=Math.floor(t/60),sec=t%60;return{planet:p,deg,m,sec,key:m*60+sec}};
 const ranked=g.map(mk).sort((a,b)=>b.key-a.key||b.deg-a.deg||g.indexOf(a.planet)-g.indexOf(b.planet)).map((x,i)=>({...x,role:J_KNAMES7[i]}));
 const by={};ranked.forEach(x=>by[x.role]=x.planet);
 const ak=ranked[0].planet,ks=nav(sid[ak]);
 return{ranked,by,ak,ks,mode:7}}
// ---- Rasi strength sources (Su 2.3.6-9, 14, 16) used to rank competing signs / co-lords
function J_signStrength(sid,s,akSign){
 const occ=J_occ(sid,s),good=occ.filter(p=>['exalted','own sign'].includes(J_dignity(p,s))).length;
 return[occ.includes(sid._ak)?1:0,occ.length,good,s%3===2?2:s%3===1?1:0]}
const J_cmp=(a,b)=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return b[i]-a[i];return 0};
// ---- Lord of a sign for sign-counting (dual lordship Scorpio/Aquarius per Su 1.1.28 notes)
function J_lordTarget(sid,s){
 const d=J_DUAL[s];if(!d)return{lord:SL[s],tgt:J_sign(sid[SL[s]]),note:''};
 const t=d.map(p=>({p,s:J_sign(sid[p])})),home=t.filter(x=>x.s===s);
 if(home.length===2)return{lord:d.join('/'),tgt:s,note:'both co-lords in the sign'};
 if(home.length===1){const o=t.find(x=>x.s!==s);return{lord:o.p,tgt:o.s,note:`one co-lord at home, counted to the other (${o.p})`}}
 if(t[0].s===t[1].s)return{lord:d.join('/'),tgt:t[0].s,note:'both co-lords in the same sign'};
 const sc=x=>[J_occ(sid,x.s).length,J_dignity(x.p,x.s)==='exalted'?1:0,x.s%3===2?2:x.s%3===1?1:0];
 const w=[...t].sort((a,b)=>J_cmp(sc(a),sc(b)))[0];
 return{lord:w.p,tgt:w.s,note:`stronger co-lord ${w.p} (more companions, exaltation, dual>fixed>movable)`}}
// ---- Arudha / Pada (Su 1.1.29-31, 1.4.1). style 'std' applies the 10th/4th corrections used by Rath/K.N. Rao; 'literal' follows Rao's notes with none.
function J_padas(sid,style='std'){
 const L=J_sign(sid.Lagna);
 return Array.from({length:12},(_,i)=>{
  const H=(L+i)%12,lt=J_lordTarget(sid,H),dist=(lt.tgt-H+12)%12;let pada=(lt.tgt+dist)%12,rule='double count from the house to its lord';
  if(style==='std'){if(pada===H){pada=(H+9)%12;rule='fell on the house itself → 10th from it'}else if(pada===(H+6)%12){pada=(H+3)%12;rule='fell on the 7th → 4th from the house'}}
  return{no:i+1,name:i===0?'AL (Arudha Lagna)':i===11?'UL (Upapada)':'A'+(i+1),house:H,lord:lt.lord,lordSign:lt.tgt,pada,rule}})}
// ---- Chara dasha (Su 1.1.28, 2.3.28, 1.1.34). Sequence starts at Lagna, direction by parity of the 9th sign (Su 2.3.28).
function J_signYears(sid,s){
 const lt=J_lordTarget(sid,s),sav=J_SAVYA.has(s);
 if(lt.tgt===s)return{years:12,lord:lt.lord,tgt:s,why:'lord in own sign → 12 years'};
 const c=sav?J_cnt(s,lt.tgt):J_cnt(lt.tgt,s);let y=c-1,adj=0;
 if(!lt.lord.includes('/')&&EX[lt.lord]!==undefined){const dg=J_dignity(lt.lord,lt.tgt);if(dg==='exalted')adj=1;if(dg==='debilitated')adj=-1}
 y=Math.max(1,Math.min(12,y+adj));
 return{years:y,lord:lt.lord,tgt:lt.tgt,why:`${c} signs counted ${sav?'direct':'backward'} to ${lt.lord} in ${SG[lt.tgt]}, minus 1${adj?(adj>0?', +1 exalted':', −1 debilitated'):''}${lt.note?'; '+lt.note:''}`}}
function J_charaDasha(sid,birthMs,maxAge=120){
 const L=J_sign(sid.Lagna),ninth=(L+8)%12,fwd=ninth%2===0,step=fwd?1:-1,YR=365.25*864e5;
 const order=Array.from({length:12},(_,i)=>(L+step*i+12)%12),base=order.map(s=>({sign:s,...J_signYears(sid,s)}));
 const out=[];let t=birthMs;
 for(let cyc=1;cyc<=2&&(t-birthMs)/YR<maxAge;cyc++)for(const b of base){
  const y=cyc===1?b.years:12-b.years;if(y<=0)continue;
  const md={sign:b.sign,years:y,cycle:cyc,start:t,end:t+y*YR,lord:b.lord,why:b.why,sub:[]};
  const sd=b.sign;let st=md.start;
  for(let k=0;k<12;k++){const s=(sd+step*k+12)%12,e=st+md.years*YR/12;md.sub.push({sign:s,start:st,end:e});st=e}
  out.push(md);t=md.end}
 return{L,ninth,fwd,periods:out,base}}
// ---- Argala (Su 1.1.5-10). target sign s; reverse=true counts backward (Rahu/Ketu, Su 1.1.10)
function J_argala(sid,s,reverse=false){
 const hs=h=>reverse?((s-(h-1))%12+12)%12:J_at(s,h);
 const pairs=[[2,12],[4,10],[11,3]],rows=pairs.map(([a,o])=>{
  const ap=J_occ(sid,hs(a)),op=J_occ(sid,hs(o));
  return{a,o,ap,op,state:!ap.length?'none':op.length>=ap.length?'obstructed':'effective',kind:ap.length&&op.length<ap.length?(ap.filter(p=>J_isBen(sid,p)).length>=ap.length/2?'benefic':'malefic'):''}});
 const m3=J_occ(sid,hs(3)).filter(p=>J_isMal(sid,p)),o3=J_occ(sid,hs(11));
 rows.push({a:3,o:11,ap:m3.length>=2?m3:[],op:o3,state:m3.length<2?'none':o3.length>=m3.length?'obstructed':'effective',kind:m3.length>=2&&o3.length<m3.length?'malefic':'',note:'needs 2+ malefics (Su 1.1.6)'});
 const f5=J_occ(sid,hs(5)),o9=J_occ(sid,hs(9));
 rows.push({a:5,o:9,ap:f5,op:o9,state:!f5.length?'none':o9.length>=f5.length?'obstructed':'effective',kind:f5.length&&o9.length<f5.length?(f5.filter(p=>J_isBen(sid,p)).length>=f5.length/2?'benefic':'malefic'):'',note:'trikona (Su 1.1.9)'});
 return rows}
// ---- Lagnas needing sunrise: Hora Lagna (1 sign / 2.5 ghatis) and Ghatika Lagna (1 sign / ghati) from the Sun (Su 1.1.32 notes)
function J_specialLagnas(sid,localHour,sunriseHour){
 let el=localHour-sunriseHour;if(el<0)el+=24;const gh=el*2.5;
 return{hora:J_sign(sid.Sun+gh/2.5*30),ghatika:J_sign(sid.Sun+gh*30),ghatis:gh}}

// ---- Rasi strength (Su 2.3.5-17, 27): ordered sources of strength, compared in the book's order.
// 1 Atmakaraka in sign (Su 2.3.6) 2 number of planets (7) 3 planets exalted/own (8) 4 dual > fixed > movable (9)
// 5 sign lord, Jupiter, Mercury aspecting or joining (14) 6 lord in kendra/panapara/apoklima from Atmakaraka (16)
function J_strengthTable(sid,K){
 const aks=J_sign(sid[K.ak]);
 const rows=Array.from({length:12},(_,s)=>{
  const occ=J_occ(sid,s),inf=J_infl(sid,s),lord=SL[s],ls=J_sign(sid[lord]),h=J_cnt(aks,ls),typ=(h-1)%3;
  const strong=occ.filter(p=>['exalted','own sign'].includes(J_dignity(p,s))).length,second=[...new Set([lord,'Jupiter','Mercury'])].filter(p=>inf.includes(p)||J_sign(sid[p])===s).length;
  return{sign:s,key:[occ.includes(K.ak)?1:0,occ.length,strong,s%3===2?2:s%3===1?1:0,second,2-typ],ak:occ.includes(K.ak),n:occ.length,strong,mod:['movable','fixed','dual'][s%3],second,pos:['kendra','panapara','apoklima'][typ]}});
 [...rows].sort((a,b)=>J_cmp(a.key,b.key)).forEach((r,i)=>r.rank=i+1);
 return rows}
// ---- Yogardha Dasha (Su 2.4.19-20): half of (Chara years + Sthira years 7/8/9) per sign; starts from the stronger of Lagna and 7th.
function J_refSign(sid,K,g){ // Su 2.4.7: males prefer Lagna, females the 7th, provided it is strong (upper half of the ranking); otherwise the stronger of the two
 const L=J_sign(sid.Lagna),T=J_strengthTable(sid,K),S7=(L+6)%12,stronger=T[L].rank<=T[S7].rank?L:S7,pref=g==='F'?S7:g==='M'?L:null;
 return{sign:pref!==null&&T[pref].rank<=6?pref:stronger,stronger,pref,T}}
function J_yogardha(sid,K,birthMs,g){
 const L=J_sign(sid.Lagna),T=J_strengthTable(sid,K),start=J_refSign(sid,K,g).sign,step=start%2===0?1:-1,YR=365.25*864e5;
 let t=birthMs;const periods=Array.from({length:12},(_,i)=>{const s=(start+step*i+12)%12,ch=J_signYears(sid,s).years,st=s%3===0?7:s%3===1?8:9,y=(ch+st)/2,p={sign:s,chara:ch,sthira:st,years:y,start:t,end:t+y*YR};t=p.end;return p});
 return{start,step,periods,total:periods.reduce((a,p)=>a+p.years,0)}}
// ---- Paka (Dwara) and Bhoga (Bahya) Rasi of a dasha sign (Su 2.4.2-6)
function J_pakaBhoga(sid,s){
 const L=J_sign(sid.Lagna),h=J_cnt(L,s),bhoga=(s+h-1)%12,mal=sg=>J_occ(sid,sg).filter(p=>J_isMal(sid,p));
 const check=sg=>mal(sg).filter(p=>!(J_dignity(p,sg)==='own sign'||J_occ(sid,sg).includes('Jupiter')));
 return{paka:s,bhoga,bad:[...new Set([...check(s),...check(bhoga)])]}}
// ---- Natural karakas (notes to Su 1.1.23) and day/night parent karakas (Brihat Jataka, quoted in notes to Su 1.1.11)
const J_NAISARGIKA=[['Sun','Soul force, reputation, vitality, father'],['Moon','Mind, mother, gems'],['Mars','Land, strength, brothers'],['Mercury','Intelligence, maternal uncle, speech'],['Jupiter','Children, education, wealth, spiritual growth'],['Venus','Desire, sensual pleasure, wife'],['Saturn','Longevity, livelihood, endurance'],['Rahu','Maternal grandfather, poison'],['Ketu','Paternal grandfather, liberation (Kaivalya)']];

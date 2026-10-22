// Core: constants, ephemeris loader, planetary positions, Lagna, sunrise. No DOM access (testable in Node).
const R=Math.PI/180,n=x=>((x%360)+360)%360,S=x=>Math.sin(x*R),C=x=>Math.cos(x*R);
const SG=['Mesha','Vrishabha','Mithuna','Kataka','Simha','Kanya','Thula','Vrischika','Dhanus','Makara','Kumbha','Meena'];
const SGE=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const PLN=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke',Lagna:'Lg'};
const SL=['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
const EX={Sun:0,Moon:1,Mars:9,Mercury:5,Jupiter:3,Venus:11,Saturn:6};
const tx=s=>s;
const EPH_JD0=Date.UTC(1930,0,1)/864e5+2440587.5;
let EPH=null;
function parseEph(t){const L=t.split('\n').filter(l=>l&&l[0]!='#'&&l[0]!='a'),N=L.length,E={n:N,ay:new Float64Array(N),lon:PLN.map(()=>new Float64Array(N))};
 L.forEach((l,i)=>{const c=l.split(',');E.ay[i]=+c[0];for(let k=0;k<9;k++)E.lon[k][i]=+c[1+k]});EPH=E}
const wrapA=u=>((u+648000)%1296000+1296000)%1296000-648000;
function ephAt(jd){
 if(!EPH)return null;const x=jd-EPH_JD0,i=Math.floor(x);if(i<1||i>EPH.n-3)return null;
 const f=x-i,w=[-f*(f-1)*(f-2)/6,0,-(f+1)*f*(f-2)/2,(f+1)*f*(f-1)/6],
 mix=(a,wr)=>{const b=a[i];let s=b;for(const j of[-1,1,2]){const u=a[i+j]-b;s+=w[j+1]*(wr?wrapA(u):u)}return s};
 const sid={};PLN.forEach((k,j)=>sid[k]=((mix(EPH.lon[j],1)%1296000+1296000)%1296000)/3600);
 return{sid,ay:mix(EPH.ay,0)/3600}}
// Compact formulas used only outside the ephemeris table range (about 0.1-0.5 degree).
const PL={Mercury:[48.3313,3.24587e-5,7.0047,29.1241,1.01444e-5,.387098,.205635,5.59e-10,168.6562,4.0923344368],Venus:[76.6799,2.4659e-5,3.3946,54.891,1.38374e-5,.72333,.006773,-1.302e-9,48.0052,1.6021302244],Mars:[49.5574,2.11081e-5,1.8497,286.5016,2.92961e-5,1.523688,.093405,2.516e-9,18.6021,.5240207766],Jupiter:[100.4542,2.76854e-5,1.303,273.8777,1.64505e-5,5.20256,.048498,4.469e-9,19.895,.0830853001],Saturn:[113.6634,2.3898e-5,2.4886,339.3939,2.97661e-5,9.55475,.055546,-9.499e-9,316.967,.0334442282]};
function kep(N,i,w,a,e,M){let E=M+e/R*S(M)*(1+e*C(M));for(let k=0;k<8;k++)E-=(E-e/R*S(E)-M)/(1-e*C(E));const x=a*(C(E)-e),y=a*Math.sqrt(1-e*e)*S(E),v=Math.atan2(y,x)/R,r=Math.hypot(x,y),u=v+w;return[r*(C(N)*C(u)-S(N)*S(u)*C(i)),r*(S(N)*C(u)+C(N)*S(u)*C(i)),r,n(v+w)]}
function calc(jd,lat,lon){
 const d=jd-2451543.5,res={};
 const sw=282.9404+4.70935e-5*d,sM=356.047+.9856002585*d;
 const sun=kep(0,0,sw,1,.016709-1.151e-9*d,sM),sl=Math.atan2(sun[1],sun[0])/R;
 let ay=23.857+(jd-2451545)/365.25*.013972;
 res.Sun=n(sl);
 const N=125.1228-.0529538083*d,Mm=115.3654+13.0649929509*d,w=318.0634+.1643573223*d;
 const mo=kep(N,5.1454,w,60.2666,.0549,Mm);let ml=Math.atan2(mo[1],mo[0])/R;
 const Ls=sw+sM,Lm=N+w+Mm,D=Lm-Ls,F=Mm+w;
 ml+=-1.274*S(Mm-2*D)+.658*S(2*D)-.186*S(sM)-.059*S(2*Mm-2*D)-.057*S(Mm-2*D+sM)+.053*S(Mm+2*D)+.046*S(2*D-sM)+.041*S(Mm-sM)-.035*S(D)-.031*S(Mm+sM)-.015*S(2*F-2*D)+.011*S(Mm-4*D);
 res.Moon=n(ml);res.Rahu=n(N);res.Ketu=n(N+180);
 const el=k=>{const p=PL[k];return[p[0]+p[1]*d,p[2],p[3]+p[4]*d,p[5],p[6]+p[7]*d,p[8]+p[9]*d]};
 const Mj=el('Jupiter')[5],Mt=el('Saturn')[5];
 for(const k in PL){const q=el(k);let h=kep(...q),lh=Math.atan2(h[1],h[0])/R;
  if(k=='Jupiter')lh+=-.332*S(2*Mj-5*Mt-67.6)-.056*S(2*Mj-2*Mt+21)+.042*S(3*Mj-5*Mt+21)-.036*S(Mj-2*Mt)+.022*C(Mj-Mt)+.023*S(2*Mj-3*Mt+52)-.016*S(Mj-5*Mt-69);
  if(k=='Saturn')lh+=.812*S(2*Mj-5*Mt-67.6)-.229*C(2*Mj-4*Mt-2)+.119*S(Mj-2*Mt-3)+.046*S(2*Mj-6*Mt-69)+.014*S(Mj-3*Mt+32);
  const x=h[2]*C(lh)+sun[2]*C(sl),y=h[2]*S(lh)+sun[2]*S(sl);res[k]=n(Math.atan2(y,x)/R)}
 const sid={};for(const k in res)sid[k]=n(res[k]-ay);
 let table=false;const E=ephAt(jd);if(E){Object.assign(sid,E.sid);ay=E.ay;table=true}
 const th=n(280.46061837+360.98564736629*(jd-2451545)+lon),eps=23.4393-3.563e-7*(jd-2451545);
 const asc=n(Math.atan2(C(th),-(S(th)*C(eps)+Math.tan(lat*R)*S(eps)))/R);
 sid.Lagna=n(asc-ay);return{sid,ay,table,tropSun:n(sid.Sun+ay)}}
// Vedic (disc-centre) sunrise in local clock hours, used for Hora Lagna / Ghatika Lagna.
function vedicSunrise(Y,Mo,D,lat,lon,tz,tropSun){
 const N=(Date.UTC(Y,Mo-1,D)-Date.UTC(Y,0,0))/864e5,B=360/365*(N-81),eot=9.87*S(2*B)-7.53*C(B)-1.5*S(B),
 dec=Math.asin(S(23.44)*S(tropSun))/R,nn=12-lon/15+tz-eot/60,
 Hv=Math.acos(Math.max(-1,Math.min(1,-S(lat)*S(dec)/(C(lat)*C(dec)))))/R/15;
 return{rise:nn-Hv,set:nn+Hv}}
const nav=L=>Math.floor(n(L)*9/30)%12;

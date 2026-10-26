// Dasha results from the sutras. The book gives no event table; it says the results of the combinations are felt in the
// Dasa and Antardasa of the signs concerned (Su 1.2.121, 2.4.34), graded by sign and lord strength (Su 2.3.35-36), with the
// Paka/Bhoga signs (Su 2.4.4-6) and the karakas (Su 2.4.26). Each rule is therefore tied to the sign(s) that form its combination.
function J_anchors(su,c){
 const[,pd,k]=su.split('.').map(Number),{ks,L,AL,UL,from,sid}=c,A=[],q=(a,b)=>k>=a&&k<=b,add=(...s)=>s.forEach(x=>{if(!A.includes(x))A.push(x)});
 const aks=J_sign(sid[c.K.ak]);
 if(pd===2){
  if(q(2,38)||k===69||q(72,79)||q(86,87))add(ks);
  else if(q(39,41))add(from(ks,10));
  else if(q(42,47)||q(96,101))add(from(ks,4));
  else if(q(48,56))add(from(ks,9));
  else if(q(57,62))add(from(ks,7));
  else if(k===64||k===65)add(from(ks,3));
  else if(k===66)add(from(ks,3),from(ks,6));
  else if(k===67)add(from(ks,9));
  else if(k===68||k===71)add(from(ks,12));
  else if(q(83,85))add(from(ks,5),from(ks,9));
  else if(k===93||k===94)add(from(ks,4),from(ks,5));
  else if(q(102,115))add(ks,from(ks,5));
  else if(k===118)add(from(ks,2));
  else if(k===119)add(from(L,2),from(L,8),from(AL,2),from(AL,8));
 }else if(pd===3){
  if(q(2,5))add(from(AL,11));
  else if(q(6,12))add(from(L,12),from(AL,12),from(L,11),from(AL,11));
  else if(k===13)add(from(AL,7));
  else if(q(14,16))add(from(AL,2),from(AL,6));
  else if(q(18,21))add(AL,c.pad[6].pada);
  else if(k===22||k===23)add(AL,from(AL,7));
  else if(q(24,27)||q(38,42))add(L,ks);
  else if(k===28)add(J_sign(sid.Moon),J_sign(sid.Venus));
  else if(k===29)add(J_sign(sid.Venus),J_sign(sid.Mars),J_sign(sid.Ketu));
  else if(k===30)add(from(ks,2),from(ks,4),from(ks,5));
  else if(k===31)add(from(aks,3),from(aks,6));
  else if(k===32||k===35||k===36)add(L,from(L,7));
  else if(k===43)add(c.pad[4].pada);
  else if(k===44)add(from(aks,4));
 }else if(pd===4){
  if(q(2,12))add(UL,from(UL,2));
  else if(q(25,30))add(from(from(UL,7),5));
  else if(q(32,38))add(from(UL,3),from(UL,11));
  else if(k===39||k===40)add(from(from(UL,7),2));
  else if(k===43||k===49)add(ks);
 }
 return A}
const J_withSigns=(rules,c)=>rules.map(r=>({...r,signs:J_anchors(r.su,c)}));
// results felt in a Dasa/Antardasa sign: rules anchored in it, and the karakas it holds or aspects
function J_periodResults(c,s){
 const hit=c.RS.filter(r=>r.signs.includes(s)),occ=J_occ(c.sid,s),asp=J_aspBy(c.sid,s);
 return{rules:hit,karakas:c.KR.filter(x=>occ.includes(x.planet)||asp.includes(x.planet))}}

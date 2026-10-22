// Sutra rules from Adhyaya 1 (Padas 1-4). Each result cites the sutra and shows the chart fact that triggered it.
// Adhyaya 2 longevity / death-timing sutras are intentionally not implemented.
const J_gw=(g,t)=>g==='M'?t.replace(/\bspouse\b/g,'wife').replace(/\bSpouse\b/g,'Wife'):g==='F'?t.replace(/\bspouse\b/g,'husband').replace(/\bSpouse\b/g,'Husband'):t;
function J_ctx(sid,mode,style,sp,g){
 const K=J_karakas(sid),pad=J_padas(sid,style),L=J_sign(sid.Lagna);sid._ak=K.ak;
 const sg=p=>J_sign(sid[p]),ks=K.ks,from=(s,h)=>J_at(s,h);
 const d9=PLN.reduce((o,p)=>(o[p]=nav(sid[p]),o),{});
 const withAK=PLN.filter(p=>p!==K.ak&&d9[p]===ks);                 // planets with the Atmakaraka in the Navamsa
 return{g:g||'N',sid,K,pad,L,ks,AL:pad[0].pada,UL:pad[11].pada,d9,withAK,sp,sg,from,
  occ:s=>J_occ(sid,s),infl:s=>J_infl(sid,s),aspBy:s=>J_aspBy(sid,s),
  lordSign:s=>J_sign(sid[SL[s]]),mal:p=>J_isMal(sid,p),ben:p=>J_isBen(sid,p)}}
const J_N=p=>p.join(', ');
function J_rules(c){
 const{sid,K,ks,L,AL,UL,withAK,from,occ,infl,aspBy,sg}=c,R=[];
 const add=(su,topic,text,why)=>R.push({su,topic,text,why});
 const has=(arr,...ps)=>ps.every(p=>arr.includes(p));
 const hasAny=(arr,...ps)=>ps.some(p=>arr.includes(p));
 const signsTxt=s=>SG[s];
 // ===== Su 1.2.2-13: Atmakaraka's Navamsa
 const navTxt=[
 ['1.2.2','Nuisance or fear from rats, cats and similar small animals.'],
 ['1.2.3','Dealings with quadrupeds (cattle, horses, elephants). Rao: gain when the Karaka is strong, trouble when weak or afflicted.'],
 ['1.2.4','Tendency to corpulence, itching and skin eruptions.'],
 ['1.2.5','Troubles linked to watery places and impure water; skin complaints.'],
 ['1.2.6','Trouble through dogs and canine animals.'],
 ['1.2.7','Skin irritation and corpulence as for Mithuna, plus risk from fire.'],
 ['1.2.8','Earnings through trade and merchandise.'],
 ['1.2.9','Fear from water creatures and snakes; mother may have little milk, so the infant is partly nursed by others.'],
 ['1.2.10','Risk of falls, from vehicles, horses or heights such as trees, hills and aircraft.'],
 ['1.2.11','Trouble from aquatic animals and fierce birds or beasts; skin eruptions and glandular swellings.'],
 ['1.2.12','Charitable works such as wells, tanks, gardens, temples and rest-houses.'],
 ['1.2.13','Delight in virtuous deeds and charity; Kaivalya (final liberation) is indicated.']][ks];
 add(navTxt[0],'Karakamsa',navTxt[1],`Atmakaraka ${K.ak} falls in ${SG[ks]} Navamsa`);
 // ===== Su 1.2.14-22: planets with Atmakaraka in the Navamsa
 const w=withAK,why=p=>`${p} shares the Navamsa sign ${SG[ks]} with Atmakaraka ${K.ak}`;
 const el=n(sid.Moon-sid.Sun),bright=el>90&&el<270;
 if(w.includes('Sun'))add('1.2.14','Livelihood','Inclined to public service and political or administrative work.',why('Sun'));
 if(has(w,'Moon','Venus')&&bright)add('1.2.15','Livelihood','Comfort and wealth; may earn through teaching or education.','Bright Moon and Venus both with the Atmakaraka in Navamsa');
 if(w.includes('Mars'))add('1.2.16','Livelihood','Skill in medicinal or chemical preparations, arms, or work with fire (cooking, engines, metalwork).',why('Mars'));
 if(w.includes('Mercury'))add('1.2.17','Livelihood','Trade, textiles, crafts and art, and shrewdness in social and political dealings.',why('Mercury'));
 if(w.includes('Jupiter'))add('1.2.18','Learning','Versed in Vedic ritual and religious wisdom; Vedanta and a religious disposition.',why('Jupiter'));
 if(w.includes('Venus'))add('1.2.19','Livelihood','Official or political standing; strong attraction to pleasures and lasting vitality.',why('Venus'));
 if(w.includes('Saturn'))add('1.2.20','Livelihood','Becomes famous in his or her chosen line of work.',why('Saturn'));
 if(w.includes('Rahu'))add('1.2.21','Livelihood','Work with weapons, poisons/toxins or metal machinery; guard against unscrupulous means.',why('Rahu'));
 if(w.includes('Ketu'))add('1.2.22','Livelihood','Trade in large animals or heavy goods; guard against dishonest means.',why('Ketu'));
 if(has(w,'Sun','Rahu'))add('1.2.23','Caution','Affliction through serpents or poison. Su 1.2.24-25: benefic aspect removes it and may instead give skill with poisons/antidotes.','Sun and Rahu both with the Atmakaraka');
 // ===== Su 1.2.32-38: Ketu with Atmakaraka and aspects on Karakamsa (D1 sign)
 if(w.includes('Ketu')){const a=aspBy(ks).concat(occ(ks)),m=a.filter(p=>c.mal(p)&&p!=='Ketu');
  if(m.length)add('1.2.32','Health','Ear complaints or injury to the ears.',`Ketu with Atmakaraka; malefic influence (${J_N(m)}) on Karakamsa`);
  if(a.includes('Venus'))add('1.2.33','Dharma','Disciplined ritual life, a Dikshita (performer of sacrifices).','Ketu with Atmakaraka; Venus influences Karakamsa');
  if(a.includes('Saturn'))add('1.2.36','Dharma','Ascetic or recluse, or a dependent in service.','Ketu with Atmakaraka; Saturn influences Karakamsa');
  if(has(a,'Sun','Venus'))add('1.2.38','Livelihood','Trusted by rulers or powerful people and employed in their work.','Ketu with Atmakaraka; Sun and Venus influence Karakamsa')}
 // ===== Su 1.2.39-41: 10th from Karakamsa
 {const s10=from(ks,10),o=occ(s10),a=infl(s10);
  if(a.some(p=>c.ben(p))&&!a.some(p=>c.mal(p)))add('1.2.40','Character','Steadfast and determined, not capricious.',`10th from Karakamsa (${SG[s10]}) influenced only by benefics: ${J_N(a)}`);
  if(o.includes('Sun')&&aspBy(s10).filter(p=>p!=='Sun').join()==='Jupiter')add('1.2.41','Livelihood','Success through trade in cattle.','Sun in 10th from Karakamsa with only Jupiter aspecting')}
 // ===== Su 1.2.42-47: 4th from Karakamsa (home)
 {const s4=from(ks,4),o=occ(s4),lord=SL[s4],ls=sg(lord),lin=[...occ(ls),...aspBy(ls)];
  if(has(lin,'Moon','Venus'))add('1.2.42','Home','Fine, multi-storeyed houses.',`Lord of 4th from Karakamsa (${lord}) is joined or aspected by Moon and Venus`);
  const ex=o.filter(p=>J_dignity(p,s4)==='exalted');if(ex.length)add('1.2.43','Home','Many splendid houses.',`Exalted ${J_N(ex)} in the 4th from Karakamsa`);
  if(has(o,'Rahu','Saturn'))add('1.2.44','Home','House built of rough, unplastered stone.','Rahu and Saturn in 4th from Karakamsa');
  if(has(o,'Mars','Ketu'))add('1.2.45','Home','House of brick or earth.','Mars and Ketu in 4th from Karakamsa');
  if(o.includes('Jupiter'))add('1.2.46','Home','Wooden house.','Jupiter in 4th from Karakamsa');
  if(o.includes('Sun'))add('1.2.47','Home','Thatch or grass roofing (simple dwelling).','Sun in 4th from Karakamsa')}
 // ===== Su 1.2.48-56: 9th from Karakamsa (dharma)
 {const s9=from(ks,9),a=infl(s9),ben=a.filter(p=>c.ben(p)),mal=a.filter(p=>c.mal(p));
  if(ben.length&&!mal.length)add('1.2.48','Dharma','Truthful, righteous, devoted to elders, teachers and gurus.',`9th from Karakamsa (${SG[s9]}) influenced only by benefics: ${J_N(ben)}`);
  if(mal.length&&!ben.length)add('1.2.49','Dharma','Opposite tendencies: weak faith, evasiveness about truth, little respect for elders.',`9th from Karakamsa influenced only by malefics: ${J_N(mal)}`);
  if(has(a,'Saturn','Rahu'))add('1.2.50','Dharma','Risk of ingratitude or disloyalty toward teachers.','Saturn and Rahu on the 9th from Karakamsa');
  if(has(a,'Jupiter','Sun'))add('1.2.51','Dharma','Little regard for parents, elders and preceptors.','Jupiter and Sun on the 9th from Karakamsa');
  if(has(a,'Mars','Venus'))add('1.2.53','Relationships','Persistent attraction to unconventional or illicit liaisons.','Mars and Venus on the 9th from Karakamsa');
  if(a.includes('Rahu'))add('1.2.56','Wealth','Wealth can be lost through excess in relationships.','Rahu on the 9th from Karakamsa')}
 // ===== Su 1.2.57-62: 7th from Karakamsa (spouse)
 {const s7=from(ks,7),o=occ(s7),a=infl(s7),sp=[];
  if(has(o,'Jupiter','Moon'))add('1.2.57','Spouse','Attractive and affectionate spouse.','Jupiter and Moon in 7th from Karakamsa');
  if(a.includes('Rahu'))add('1.2.58','Spouse','Relationship with a previously married or widowed partner.','Rahu influences 7th from Karakamsa');
  if(a.includes('Saturn'))add('1.2.59','Spouse','Spouse older, frail, or of an austere/contemplative nature.','Saturn influences 7th from Karakamsa');
  if(a.includes('Mars'))add('1.2.60','Spouse','Spouse with a physical blemish or injury.','Mars influences 7th from Karakamsa');
  if(a.includes('Sun'))add('1.2.61','Spouse','Spouse well protected by the family, without physical defect.','Sun influences 7th from Karakamsa');
  if(a.includes('Mercury'))add('1.2.62','Spouse','Spouse skilled in music, arts and refined accomplishments.','Mercury influences 7th from Karakamsa')}
 // ===== Su 1.2.64-71: 3rd/6th/9th/12th from Karakamsa
 {const s3=from(ks,3),s6=from(ks,6),o3=occ(s3),o6=occ(s6);
  if(o3.some(p=>c.mal(p)))add('1.2.64','Character','Courageous, warrior-like.',`Malefic(s) ${J_N(o3.filter(c.mal))} in 3rd from Karakamsa`);
  else if(o3.some(p=>c.ben(p)))add('1.2.65','Character','Timid, hesitant in confrontation.',`Only benefic(s) ${J_N(o3)} in 3rd from Karakamsa`);
  if(o3.some(c.mal)&&o6.some(c.mal))add('1.2.66','Livelihood','Livelihood from agriculture and the land.','Malefics in both 3rd and 6th from Karakamsa');
  if(occ(from(ks,9)).includes('Jupiter'))add('1.2.67','Livelihood','Success in agriculture.','Jupiter in 9th from Karakamsa');
  const o12=occ(from(ks,12));
  if(o12.some(c.ben)&&!o12.some(c.mal))add('1.2.68','Dharma','Merit that leads toward higher worlds; a spiritually oriented end.',`Benefic(s) ${J_N(o12)} in 12th from Karakamsa`);
  if(o12.some(c.mal))add('1.2.71','Dharma','Spiritual obstacles; lower tendencies need conscious effort.',`Malefic(s) ${J_N(o12.filter(c.mal))} in 12th from Karakamsa`);
  if(w.includes('Ketu'))add('1.2.69','Dharma','Kaivalya (final liberation) is indicated.','Ketu with Atmakaraka in the Navamsa')}
 // ===== Su 1.2.72-79: Ishta devata by planets with Atmakaraka in Navamsa
 {const dv=[];
  if(has(w,'Sun','Ketu'))dv.push(['1.2.72','Shiva (Saivite)','Sun and Ketu']);
  else if(w.includes('Ketu'))dv.push(['1.2.79','Ganesa and Kumaraswami (Skanda)','Ketu']);
  if(w.includes('Moon'))dv.push(['1.2.73','Gauri (Parvati)','Moon']);
  if(w.includes('Venus'))dv.push(['1.2.74','Lakshmi','Venus']);
  if(w.includes('Mars'))dv.push(['1.2.75','Skanda (Subrahmanya)','Mars']);
  if(has(w,'Mercury','Saturn'))dv.push(['1.2.76','Vishnu','Mercury and Saturn']);
  if(w.includes('Jupiter'))dv.push(['1.2.77','Sambasiva (Shiva with Parvati)','Jupiter']);
  if(w.includes('Rahu'))dv.push(['1.2.78','Durga (and tamasic/protective powers)','Rahu']);
  dv.forEach(x=>add(x[0],'Devotion',`Worship tends toward ${x[1]}.`,`${x[2]} with the Atmakaraka in Navamsa`));
  // Su 1.4.43: planet next to Amatyakaraka
 }
 // ===== Su 1.2.83-87 occult / learned skills
 {const s5=from(ks,5),s9=from(ks,9),m5=occ(s5).filter(c.mal),m9=occ(s9).filter(c.mal);
  if(m5.length&&m9.length){const ia=[...aspBy(s5),...aspBy(s9)],bi=ia.some(c.ben),mi=ia.filter(p=>c.mal(p)&&![...m5,...m9].includes(p)).length>0;
   add('1.2.83','Skills','Aptitude for mantra, occult and ritual practice.',`Malefics in both 5th (${J_N(m5)}) and 9th (${J_N(m9)}) from Karakamsa`);
   if(bi)add('1.2.85','Skills','Uses these powers to help and heal others.','Benefic aspect on the malefics in 5th/9th from Karakamsa');
   else if(mi)add('1.2.84','Skills','Strong ability to counter harmful influences and spirits.','Further malefic aspect on the malefics in 5th/9th from Karakamsa')}
  const aks=aspBy(ks);
  if(aks.includes('Mercury')&&aspBy(sg('Moon')).includes('Mercury'))add('1.2.87','Livelihood','Aptitude for medicine and healing.','Mercury aspects both Karakamsa and the Moon');
  if(aks.includes('Venus')&&aspBy(sg('Moon')).includes('Venus'))add('1.2.86','Skills','Aptitude for chemistry, alchemy or the science of essences.','Venus aspects both Karakamsa and the Moon')}
 // ===== Su 1.2.96-101: 4th from Karakamsa, professions
 {const o=occ(from(ks,4));
  const t={Saturn:['1.2.96','Skill with weapons or the use of force.'],Ketu:['1.2.97','Skill in clocks, instruments and precise mechanical devices.'],Mercury:['1.2.98','Ascetic, contemplative bent (Paramahamsa) or a staff-bearing recluse.'],Rahu:['1.2.99','Skill in metal machinery; a clever mechanic.'],Sun:['1.2.100','Livelihood by the sword (armed or authority-based service).'],Mars:['1.2.101','Livelihood by arms, lances or heavy weapons.']};
  o.filter(p=>t[p]).forEach(p=>add(t[p][0],'Livelihood',t[p][1],`${p} in 4th from Karakamsa`))}
 // ===== Su 1.2.102-115: learning, from Karakamsa and 5th from it
 {const z=[...occ(ks),...occ(from(ks,5))],why5=p=>`${p} in Karakamsa or its 5th`;
  if(has(z,'Moon','Jupiter'))add('1.2.102','Learning','Writes and may live by authorship.','Moon and Jupiter in Karakamsa / 5th from it');
  else if(has(z,'Moon','Venus'))add('1.2.103','Learning','Writes, at an ordinary level of renown.','Moon and Venus in Karakamsa / 5th from it');
  if(z.includes('Venus'))add('1.2.105','Learning','Poet, eloquent speaker, literary talent.',why5('Venus'));
  if(z.includes('Jupiter'))add('1.2.106','Learning','Wide, versatile scholarship; Vedic literature, grammar and the Vedangas.',why5('Jupiter'));
  if(z.includes('Saturn'))add('1.2.109','Learning','Learned but nervous in assemblies.',why5('Saturn'));
  if(z.includes('Mercury'))add('1.2.110','Learning','Shines in ritual philosophy (Mimamsa).',why5('Mercury'));
  if(z.includes('Mars'))add('1.2.111','Learning','Logician, strong in debate.',why5('Mars'));
  if(z.includes('Moon'))add('1.2.112','Learning','Sankhya, language, drama, poetry and music.',why5('Moon'));
  if(z.includes('Sun'))add('1.2.113','Learning','Vedanta and music.',why5('Sun'));
  if(z.includes('Ketu'))add('1.2.114','Learning','Mathematics.',why5('Ketu'));
  if(z.includes('Jupiter')&&z.length>1)add('1.2.115','Learning','Learning is well founded and traditionally trained when Jupiter joins or aspects.',why5('Jupiter'))}
 // ===== Su 1.2.118-120
 {const s2=from(ks,2);if(occ(s2).includes('Ketu')&&aspBy(s2).some(c.mal))add('1.2.118','Speech','Indistinct or hesitant speech.','Ketu in 2nd from Karakamsa, aspected by a malefic');
  const bad=s=>occ(from(s,2)).some(c.mal)&&occ(from(s,8)).some(c.mal);
  if(bad(L)||bad(AL))add('1.2.119','Wealth','Financial hardship (Jaimini Kemadruma); Su 1.2.120 intensifies it with Moon\u2019s aspect.',`Malefics in 2nd and 8th from ${bad(L)?'Lagna':'Arudha Lagna'}`)}
 // ===== Pada 3: Arudha Lagna (AL)
 {const s11=from(AL,11),a=infl(s11);
  if(a.length){const ben=a.filter(c.ben),mal=a.filter(c.mal);
   add('1.3.2','Wealth','Prosperity; a Sreemanta who does not know poverty.',`11th from AL (${SG[s11]}) has ${J_N(a)}`);
   if(mal.length&&!ben.length)add('1.3.4','Wealth','Wealth may come by questionable means.','Only malefics influence the 11th from AL');
   else if(ben.length&&!mal.length)add('1.3.3','Wealth','Wealth comes by fair and lawful means.','Only benefics influence the 11th from AL');
   const ex=a.filter(p=>['exalted','own sign'].includes(J_dignity(p,sg(p))));if(ex.length)add('1.3.5','Wealth','Abundant wealth (planets in strength).',`${J_N(ex)} strong while influencing the 11th from AL`)}
  for(const[ref,lbl]of[[L,'Lagna'],[AL,'AL']]){const s12=from(ref,12),b=infl(s12),b11=infl(from(ref,11));
   if(b.length){const mix=b.some(c.mal);add('1.3.6','Expenses',mix?'Expenditure exceeds income, with some spending on vices or needless disputes.':'Expenditure exceeds income, mostly on charity and religious works.',`12th from ${lbl} influenced by ${J_N(b)}`)}
   const lossMap=[['1.3.7',['Sun','Rahu','Venus'],2,'losses through penalties or displeasure of authorities'],['1.3.9',['Mercury'],1,'losses through relatives and litigation'],['1.3.10',['Jupiter'],1,'losses through taxes and levies'],['1.3.11',['Mars','Saturn'],2,'losses through brothers or siblings']];
   lossMap.forEach(([su,ps,need,t])=>{if(ps.filter(p=>b.includes(p)).length>=need)add(su,'Expenses',`Risk of ${t}.`,`${J_N(ps)} on 12th from ${lbl}`);
    if(ps.filter(p=>b11.includes(p)).length>=need)add('1.3.12','Gains',`Gains come from the same source: ${t.replace('losses','gain').replace('losses through','gain through')}.`,`${J_N(ps)} on 11th from ${lbl} (Su 1.3.12 reverses 12th-house losses into gains)`)})}
  const a2=occ(from(AL,2));
  if(a2.includes('Ketu'))add('1.3.14','Body','Appears older than his or her years.','Ketu in 2nd from AL');
  if(a2.some(p=>['Moon','Jupiter','Venus'].includes(p)))add('1.3.15','Wealth','Rich.',`${J_N(a2.filter(p=>['Moon','Jupiter','Venus'].includes(p)))} in 2nd from AL`);
  if(a2.some(p=>J_dignity(p,from(AL,2))==='exalted'))add('1.3.16','Wealth','Rich (an exalted planet in the 2nd from AL).','Exalted planet in 2nd from AL');
  const h=J_cnt(L,AL);
  if([1,4,5,7,9,10].includes(h))add('1.3.18','Status',`Great prosperity: AL falls in ${h===1?'Lagna':h+'th'} from Lagna (kendra/trikona/7th).`,`AL ${SG[AL]} is the ${h}th from Lagna`);
  if([6,8,12].includes(h))add('1.3.19','Status','Struggle in matters of status and wealth.',`AL ${SG[AL]} is the ${h}th from Lagna (dusthana)`);
  const h7=J_cnt(L,c.pad[6].pada);
  if([1,4,7,10,5,9,3,11].includes(h7))add('1.3.20','Spouse','Agreement and harmony between the couple.',`A7 ${SG[c.pad[6].pada]} is the ${h7}th from Lagna`);
  else if([6,8,12].includes(h7))add('1.3.21','Spouse','Friction in partnership matters.',`A7 falls in the ${h7}th from Lagna`)}
 // ===== Pada 3: Raja-type combinations
 {const sl=c.sp;
  if(sl){const lag=[L,sl.hora,sl.ghatika];const one=PLN.find(p=>lag.every(s=>s===sg(p)||J_asp(sg(p)).includes(s)));
   if(one)add('1.3.24','Status','Rulership or equal eminence.',`${one} aspects/occupies Lagna, Hora Lagna (${SG[sl.hora]}) and Ghatika Lagna (${SG[sl.ghatika]})`)}
  const m=sg('Moon'),v=sg('Venus');
  if(J_asp(m).includes(v)||J_cnt(m,v)===3||J_cnt(v,m)===3||m===v&&false)add('1.3.28','Comforts','Many conveyances.','Moon and Venus aspect each other or stand in the 3rd from each other');
  const ak=sg(K.ak),lord1=SL[L],lord7=SL[(L+6)%12];
  for(const[lb,ld]of[['Lagna lord',lord1],['7th lord',lord7]]){const s5=from(sg(ld),5);
   if(occ(s5).some(p=>['Jupiter','Venus','Moon'].includes(p)))add('1.3.35','Status','A senior government or political position.',`${J_N(occ(s5).filter(p=>['Jupiter','Venus','Moon'].includes(p)))} in 5th from ${lb} ${ld}`);
   if(occ(from(sg(ld),3)).some(c.mal)&&occ(from(sg(ld),6)).some(c.mal))add('1.3.36','Livelihood','Leadership in an army or disciplined force.',`Malefics in 3rd and 6th from ${lb} ${ld}`)}
  const ll=J_infl(sid,L).includes(SL[(L+3)%12])&&J_infl(sid,ks).includes(SL[(L+3)%12]);
  if(ll)add('1.3.38','Happiness','Contentment.',`4th lord (${SL[(L+3)%12]}) influences both Lagna and Karaka Lagna`);
  if(infl(L).includes(SL[(L+7)%12])&&infl(ks).includes(SL[(L+7)%12]))add('1.3.39','Wealth','Financial strain.','8th lord influences both Lagna and Karaka Lagna');
  if(infl(L).includes(SL[(L+11)%12])&&infl(ks).includes(SL[(L+11)%12]))add('1.3.40','Wealth','Spendthrift tendency.','12th lord influences both Lagna and Karaka Lagna');
  if(infl(L).includes(lord1)&&infl(ks).includes(SL[ks])&&sg(lord1)!==L)add('1.3.41','Status','Strong Raja Yoga.','Lagna lord aspects Lagna and Karaka Lagna lord aspects Karaka Lagna');
  const o4=occ(from(ak,4));if(has(o4,'Venus','Moon'))add('1.3.44','Status','Signs of royalty: honour, retinue and ceremony.','Venus and Moon in 4th from Atmakaraka\u2019s sign')}
 // ===== Pada 4: Upapada (UL), children, siblings, leadership
 {const s2=from(UL,2),o2=occ(s2),a2=infl(s2),ulInf=infl(UL),sib=(s,n)=>from(UL,n);
  const evil=ulInf.filter(p=>c.mal(p)).length||o2.some(p=>c.mal(p)&&p!=='Sun');
  if(evil&&!a2.concat(ulInf).some(p=>c.ben(p)&&['Jupiter','Venus'].includes(p)))add('1.4.2','Marriage','Strain or interruption in marriage, or a renunciate turn.',`UL ${SG[UL]} / its 2nd has malefic influence (${J_N(ulInf.filter(c.mal)||o2)})`);
  if(o2.some(p=>J_dignity(p,s2)==='debilitated'))add('1.4.5','Marriage','Hardship in marriage during adverse periods (debilitation in 2nd from UL).','Debilitated planet in 2nd from UL');
  if(o2.some(p=>J_dignity(p,s2)==='exalted')||J_dignity(SL[s2],sg(SL[s2]))==='exalted')add('1.4.6','Marriage','More than one significant partnership is possible.','Exalted planet in/around the 2nd from UL');
  if(s2===2)add('1.4.7','Marriage','More than one significant partnership is possible.','2nd from UL is Mithuna');
  if(o2.includes(K.ak)||o2.includes(SL[s2]))add('1.4.8','Marriage','Spouse may be absent in the latter part of life.','Atmakaraka or the lord of the 2nd from UL occupies that sign');
  if(J_dignity(SL[s2],sg(SL[s2]))==='exalted')add('1.4.9','Spouse','Spouse from a respectable family.','Lord of 2nd from UL is exalted');
  if(J_dignity(SL[s2],sg(SL[s2]))==='debilitated')add('1.4.10','Spouse','Spouse from a modest background.','Lord of 2nd from UL is debilitated');
  if(a2.some(p=>c.ben(p)))add('1.4.11','Spouse','Beautiful or pleasing spouse.',`2nd from UL influenced by benefic(s) ${J_N(a2.filter(c.ben))}`);
  if(has(a2,'Saturn','Rahu'))add('1.4.12','Marriage','Estrangement or scandal in marriage.','Saturn and Rahu influence the 2nd from UL');
  // children: 5th from 7th from UL / Putra Karakamsa
  const s7=from(UL,7),s5=from(s7,5),i5=infl(s5);
  if(has(i5,'Sun','Rahu','Jupiter'))add('1.4.25','Children','Many children.','Sun, Rahu and Jupiter influence the 5th from the 7th from UL');
  else if(i5.length===1&&i5[0]==='Moon')add('1.4.26','Children','Only one child.','Only the Moon influences the 5th from the 7th from UL');
  if(has(i5,'Mars','Saturn'))add('1.4.28','Children','An adopted child is indicated.','Mars and Saturn influence the 5th from the 7th from UL');
  const pk=c.K.by.Putrakaraka,pks=sg(pk);
  if(s5%2===0)add('1.4.29','Children','Many children (odd sign).',`5th from 7th from UL is ${SG[s5]}`);else add('1.4.30','Children','Few children (even sign).',`5th from 7th from UL is ${SG[s5]}`);
  // brothers
  const s3=from(UL,3),s11=from(UL,11),i3=infl(s3),i11=infl(s11);
  if(has(i3.concat(i11),'Saturn','Mars'))add('1.4.36','Siblings','Hardship or separation among siblings.','Saturn and Mars influence the 3rd/11th from UL');
  if(has(i3.concat(i11),'Jupiter','Mars','Moon','Mercury'))add('1.4.35','Siblings','Many siblings.','Mars, Jupiter, Moon and Mercury influence the 3rd/11th from UL');
  if(occ(s3).concat(occ(s11)).includes('Ketu'))add('1.4.38','Siblings','Many sisters.','Ketu in the 3rd/11th from UL');
  const am=K.by.Amatyakaraka,nx=K.by.Bhratrukaraka;
  const gods={Sun:'Shiva',Moon:'Gauri',Mars:'Skanda',Mercury:'Vishnu',Jupiter:'Sambasiva',Venus:'Lakshmi',Saturn:'Vishnu / folk deities',Rahu:'Durga / fierce powers',Ketu:'Ganesa and Skanda'};
  add('1.4.43','Devotion',`Inclination to worship ${gods[nx]}${c.mal(nx)?' (a malefic Karaka: intensity or fierce forms of worship)':''}.`,`Planet next to the Amatyakaraka (${am}) is ${nx}, the Bhratrukaraka`);
  if(occ(ks).length>=2)add('1.4.49','Status','A leader in his or her community or field.',`Two or more planets in the Karakamsa sign (${J_N(occ(ks))})`)}
 // ===== Additions: more Pada 3 and Pada 4 sutras
 {const sl=c.sp,reach=(p,t)=>sg(p)===t||J_asp(sg(p)).includes(t),moon=sg('Moon'),dre=Math.floor(n(sid.Lagna)/10)%3*4+L,nl=c.d9.Lagna===undefined?nav(sid.Lagna):nav(sid.Lagna);
  const dr=(L+4*Math.floor((n(sid.Lagna)%30)/10))%12,chLags=[['Lagna',L],['Chandra Lagna',moon],['Navamsa Lagna',nl],['Drekkana Lagna',dr]];
  if(sl)chLags.push(['Hora Lagna',sl.hora],['Ghatika Lagna',sl.ghatika]);
  if(sl){const best=PLN.map(p=>({p,hit:chLags.filter(x=>reach(p,x[1]))})).sort((a,b)=>b.hit.length-a.hit.length)[0];
   const six=chLags.length===6?best.hit.length:0;
   if(six===5)add('1.3.26','Status','An ordinary Raja Yoga: authority and standing above the average.',`${best.p} reaches five of the six Lagnas (${best.hit.map(x=>x[0]).join(', ')})`);
   const sub=PLN.find(p=>['Navamsa Lagna','Hora Lagna','Ghatika Lagna'].every(nm=>reach(p,chLags.find(x=>x[0]===nm)[1]))||['Drekkana Lagna','Hora Lagna','Ghatika Lagna'].every(nm=>reach(p,chLags.find(x=>x[0]===nm)[1])));
   if(sub&&six<5)add('1.3.27','Status','Rajayoga: a position of authority.',`${sub} reaches the Navamsa/Drekkana, Hora and Ghatika Lagnas`)}
  const seven=l=>(l+6)%12,pairs=[moon,nl,dr].flatMap(l=>[l,seven(l)]),one=PLN.find(p=>pairs.every(t=>reach(p,t)));
  if(one)add('1.3.25','Status','A great ruler or Maharaja-level eminence.',`${one} reaches Chandra, Navamsa and Drekkana Lagnas and their 7ths`);
  const rel=(a,b)=>J_asp(sg(a)).includes(sg(b))||J_cnt(sg(a),sg(b))===3||J_cnt(sg(b),sg(a))===3;
  if(rel('Venus','Mars')&&rel('Mars','Ketu')&&rel('Venus','Ketu'))add('1.3.29','Status','An aristocratic or ritual-minded family lineage.','Venus, Mars and Ketu mutually aspect or stand in the 3rd from one another');
  const bk=h=>occ(from(ks,h)).some(c.ben);
  if(bk(2)&&bk(4)&&bk(5))add('1.3.30','Status','Ruler-like standing.','Benefics in the 2nd, 4th and 5th from the Karakamsa');
  const cnt=h=>occ(from(L,h)).length,gs=[[2,12],[5,9],[12,6],[11,3],[4,10]].filter(([a,b])=>cnt(a)>0&&cnt(a)===cnt(b));
  if(gs.length)add('1.3.42','Legal','Periods of legal trouble or restriction; benefic influence on those houses leads to acquittal.',`Equal planet counts in house pairs ${gs.map(x=>x.join('/')).join(', ')} from Lagna (Grahasamya)`);
  if(occ(c.pad[4].pada).includes('Rahu')&&aspBy(c.pad[4].pada).includes('Sun'))add('1.3.43','Health','Eyesight needs care.','Rahu in A5 with the Sun aspecting it');
  if(infl(from(AL,7)).some(p=>['Rahu','Ketu'].includes(p)))add('1.3.13','Health','Digestive troubles.','Rahu or Ketu influences the 7th from AL');
  const s7=from(UL,7),s2=from(s7,2);
  if(occ(s2).includes('Rahu'))add('1.4.39','Speech','Prominent or irregular teeth, or reserved speech.','Rahu in 2nd from the 7th from UL');
  if(occ(s2).includes('Ketu'))add('1.4.40','Speech','Indistinct pronunciation or a stammer.','Ketu in 2nd from the 7th from UL')}
 return R.map(r=>({...r,topic:J_gw(c.g,r.topic),text:J_gw(c.g,r.text)}))}
// Karaka status (Su 1.1.12-18 notes): strength of each role-holder
function J_karakaReading(c){
 const{sid}=c,txt={Atmakaraka:'self, soul, final liberation (Su 1.1.12)',Amatyakaraka:'career, counsel, advisers (Su 1.1.13)',Bhratrukaraka:'brothers and sisters (Su 1.1.14)',Matrukaraka:'mother (Su 1.1.15)',Pitrukaraka:'father (8-karaka scheme)',Putrakaraka:'children (Su 1.1.16)',Gnatikaraka:'cousins and relatives (Su 1.1.17)',Darakaraka:'spouse (Su 1.1.18)'};
 return c.K.ranked.map(x=>{const s=J_sign(sid[x.planet]),dg=J_dignity(x.planet,s),inf=J_infl(sid,s).filter(p=>p!==x.planet),b=inf.filter(p=>c.ben(p)),m=inf.filter(p=>c.mal(p));
  const score=(dg==='exalted'?2:dg==='own sign'?1:dg==='debilitated'?-2:0)+b.length-m.length;
  return{...x,sign:s,dg,b,m,score,verdict:score>=2?'Strong: prosperity for this relation/area':score>=0?'Moderate: mixed results':'Afflicted: difficulty or loss in this area',topic:J_gw(c.g,txt[x.role])}})}

// Languages: Assamese, Bengali, Hindi, English. The app renders in English; this layer translates the finished text.
// Sentences are matched as patterns: planet names, sign names and numbers are lifted out as {0},{1}... and translated separately.
const LANGS=[['as','অসমীয়া'],['bn','বাংলা'],['hi','हिन्दी'],['en','English']];
let LANG='en';try{LANG=localStorage.getItem('jk_lang')||'en'}catch(e){}
if(!LANGS.some(l=>l[0]===LANG))LANG='en';
const LI={as:0,bn:1,hi:2},DT=Object.create(null),NM=Object.create(null);
const AND={as:' আৰু ',bn:' ও ',hi:' और '};
function lst(en,as,bn,hi){const E=en.split(','),A=as.split(','),B=bn.split(','),H=hi.split(',');E.forEach((e,i)=>NM[e.trim()]=[A[i],B[i],H[i]])}
lst('Mesha,Vrishabha,Mithuna,Kataka,Simha,Kanya,Thula,Vrischika,Dhanus,Makara,Kumbha,Meena','মেষ,বৃষ,মিথুন,কৰ্কট,সিংহ,কন্যা,তুলা,বৃশ্চিক,ধনু,মকৰ,কুম্ভ,মীন','মেষ,বৃষ,মিথুন,কর্কট,সিংহ,কন্যা,তুলা,বৃশ্চিক,ধনু,মকর,কুম্ভ,মীন','मेष,वृषभ,मिथुन,कर्क,सिंह,कन्या,तुला,वृश्चिक,धनु,मकर,कुंभ,मीन');
lst('Aries,Taurus,Gemini,Cancer,Leo,Virgo,Libra,Scorpio,Sagittarius,Capricorn,Aquarius,Pisces','মেষ,বৃষ,মিথুন,কৰ্কট,সিংহ,কন্যা,তুলা,বৃশ্চিক,ধনু,মকৰ,কুম্ভ,মীন','মেষ,বৃষ,মিথুন,কর্কট,সিংহ,কন্যা,তুলা,বৃশ্চিক,ধনু,মকর,কুম্ভ,মীন','मेष,वृषभ,मिथुन,कर्क,सिंह,कन्या,तुला,वृश्चिक,धनु,मकर,कुंभ,मीन');
lst('Sun,Moon,Mars,Mercury,Jupiter,Venus,Saturn,Rahu,Ketu,Lagna','ৰবি,চন্দ্ৰ,মঙ্গল,বুধ,বৃহস্পতি,শুক্ৰ,শনি,ৰাহু,কেতু,লগ্ন','রবি,চন্দ্র,মঙ্গল,বুধ,বৃহস্পতি,শুক্র,শনি,রাহু,কেতু,লগ্ন','सूर्य,चन्द्र,मंगल,बुध,गुरु,शुक्र,शनि,राहु,केतु,लग्न');
lst('Atmakaraka,Amatyakaraka,Bhratrukaraka,Matrukaraka,Pitrukaraka,Putrakaraka,Gnatikaraka,Darakaraka','আত্মকাৰক,অমাত্যকাৰক,ভ্ৰাতৃকাৰক,মাতৃকাৰক,পিতৃকাৰক,পুত্ৰকাৰক,জ্ঞাতিকাৰক,দাৰকাৰক','আত্মকারক,অমাত্যকারক,ভ্রাতৃকারক,মাতৃকারক,পিতৃকারক,পুত্রকারক,জ্ঞাতিকারক,দারকারক','आत्मकारक,अमात्यकारक,भ्रातृकारक,मातृकारक,पितृकारक,पुत्रकारक,ज्ञातिकारक,दारकारक');
lst('exalted,debilitated,own sign','উচ্চ,নীচ,স্বক্ষেত্ৰ','উচ্চ,নীচ,স্বক্ষেত্র','उच्च,नीच,स्वराशि');
const TOPICS=['Self, body, vitality','Wealth, family, speech','Courage, younger siblings, effort','Home, mother, comforts, vehicles','Intelligence, children, mantra','Enemies, debts, service, illness','Spouse, partnerships','Obstacles, sudden change, inheritance','Dharma, father, fortune, teachers','Career, status, action','Gains, elder siblings, fulfilment','Expenses, losses, foreign lands, liberation'];
const TOPA=['নিজ, শৰীৰ, জীৱনীশক্তি|ধন, পৰিয়াল, বাক্|সাহস, কনিষ্ঠ ভাই-ভনী, প্ৰচেষ্টা|ঘৰ, মাতৃ, সুখ-সুবিধা, বাহন|বুদ্ধি, সন্তান, মন্ত্ৰ|শত্ৰু, ঋণ, সেৱা, ৰোগ|দাম্পত্য সঙ্গী, অংশীদাৰী|বাধা, আকস্মিক পৰিৱৰ্তন, উত্তৰাধিকাৰ|ধৰ্ম, পিতৃ, ভাগ্য, গুৰু|বৃত্তি, মৰ্যাদা, কৰ্ম|লাভ, জ্যেষ্ঠ ভাই-ভনী, পূৰ্ণতা|ব্যয়, ক্ষতি, বিদেশ, মোক্ষ',
'নিজ, শরীর, জীবনীশক্তি|ধন, পরিবার, বাক্য|সাহস, ছোট ভাইবোন, প্রচেষ্টা|গৃহ, মাতা, সুখসুবিধা, যানবাহন|বুদ্ধি, সন্তান, মন্ত্র|শত্রু, ঋণ, সেবা, রোগ|দাম্পত্য সঙ্গী, অংশীদারি|বাধা, আকস্মিক পরিবর্তন, উত্তরাধিকার|ধর্ম, পিতা, ভাগ্য, গুরু|বৃত্তি, মর্যাদা, কর্ম|লাভ, বড় ভাইবোন, পূর্ণতা|ব্যয়, ক্ষতি, বিদেশ, মোক্ষ',
'स्वयं, शरीर, जीवनशक्ति|धन, परिवार, वाणी|साहस, छोटे भाई-बहन, पराक्रम|घर, माता, सुख, वाहन|बुद्धि, संतान, मंत्र|शत्रु, ऋण, सेवा, रोग|जीवनसाथी, साझेदारी|बाधाएँ, अचानक परिवर्तन, विरासत|धर्म, पिता, भाग्य, गुरु|करियर, प्रतिष्ठा, कर्म|लाभ, बड़े भाई-बहन, पूर्ति|व्यय, हानि, विदेश, मोक्ष'].map(x=>x.split('|'));
TOPICS.forEach((t,i)=>NM[t]=[TOPA[0][i],TOPA[1][i],TOPA[2][i]]);
lst('wife,husband,spouse,Wife,Husband,Spouse','পত্নী,স্বামী,জীৱনসংগী,পত্নী,স্বামী,জীৱনসংগী','স্ত্রী,স্বামী,জীবনসঙ্গী,স্ত্রী,স্বামী,জীবনসঙ্গী','पत्नी,पति,जीवनसाथी,पत्नी,पति,जीवनसाथी');
const ABL={as:'ৰ,চ,ম,বু,বৃ,শু,শ,ৰা,কে,ল',bn:'র,চ,ম,বু,বৃ,শু,শ,রা,কে,ল',hi:'सू,चं,मं,बु,गु,शु,श,रा,के,ल'},ABK='Su,Mo,Ma,Me,Ju,Ve,Sa,Ra,Ke,Lg'.split(',');
const PR='Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu',SR='Mesha|Vrishabha|Mithuna|Kataka|Simha|Kanya|Thula|Vrischika|Dhanus|Makara|Kumbha|Meena|Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces';
const RR='Atmakaraka|Amatyakaraka|Bhratrukaraka|Matrukaraka|Pitrukaraka|Putrakaraka|Gnatikaraka|Darakaraka',TR=TOPICS.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
const TOK=new RegExp(`(${TR})|\\b((?:${PR})(?:(?:, | and )(?:${PR}))*)\\b|\\b(${SR})\\b|\\b((?:${RR})(?:(?:, | and )(?:${RR}))*)\\b|\\((exalted|debilitated|own sign)\\)|\\b(wife|husband|spouse|Wife|Husband|Spouse)\\b|(\\d+(?:[.,]\\d+)*)(?:st|nd|rd|th)?\\b`,'g');
const dec=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function nm(w){const e=NM[w];return LANG==='en'||!e?w:e[LI[LANG]]}
function skel(s){const a=[];const key=s.replace(TOK,(m,top,p,sg,ro,dg,gn,num)=>{a.push(top?['T',top]:p?['P',p]:sg?['S',sg]:ro?['P',ro]:dg?['D',dg]:gn?['T',gn]:['N',num]);return'{'+(a.length-1)+'}'});return{key,a}}
function tokOut(t){if(t[0]==='N')return t[1];if(t[0]==='S'||t[0]==='T')return nm(t[1]);if(t[0]==='D')return'('+nm(t[1])+')';return t[1].split(/(, | and )/).map(x=>x===', '?', ':x===' and '?AND[LANG]:nm(x)).join('')}
let MISS=null;
const SEPS=['; ',' · ','. ',': '];
function splitTop(c,sep){const out=[];let d=0,cur='';
 for(let i=0;i<c.length;i++){const ch=c[i];if(ch==='(')d++;else if(ch===')')d=Math.max(0,d-1);
  if(!d&&c.startsWith(sep,i)){
   if(sep==='. '){if(/[A-Z“‘]/.test(c[i+2]||'')){out.push(cur+'.');cur='';i+=1;continue}}
   else{out.push(cur);cur='';i+=sep.length-1;continue}}
  cur+=ch}
 out.push(cur);return out}
function trR(c){
 const{key,a}=skel(c),d=DT[key];
 if(d&&d[LI[LANG]])return d[LI[LANG]].replace(/\{(\d+)\}/g,(m,i)=>a[i]?tokOut(a[i]):m);
 for(const sep of SEPS){const parts=splitTop(c,sep);if(parts.length>1&&parts.every(x=>x.trim()))return parts.map(trR).join(sep==='. '?' ':sep)}
 if(MISS&&/[A-Za-z]/.test(key.replace(/\{\d+\}/g,'')))MISS.push(key);
 return key.replace(/\{(\d+)\}/g,(m,i)=>tokOut(a[i]))}
function trCore(c){
 if(LANG==='en')return c;
 if(/^[A-Za-z]{2}(?: [A-Za-z]{2})*$/.test(c)&&c.split(' ').every(x=>ABK.includes(x))){const A=ABL[LANG].split(',');return c.split(' ').map(x=>A[ABK.indexOf(x)]).join(' ')}
 if(c.startsWith('Because: '))return trCore('Because:')+' '+trCore(c.slice(9));
 if(c.startsWith('Activates: '))return trCore('Activates:')+' '+trCore(c.slice(11));
 return trR(c)}
function trText(s){if(LANG==='en')return s;const m=s.match(/^(\s*)([\s\S]*?)(\s*)$/);return m[2]?m[1]+trCore(m[2])+m[3]:s}
const tx=s=>LANG==='en'?String(s):trCore(String(s));
const L10=h=>LANG==='en'?h:h.replace(/>([^<>]+)</g,(m,s)=>'>'+esc(trText(dec(s)))+'<');
function applyStatic(){
 if(typeof document==='undefined'||!document.createTreeWalker)return;
 const w=document.createTreeWalker(document.body,4,{acceptNode:n=>n.parentNode&&/^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)||n.parentNode.closest&&n.parentNode.closest('#out')?2:1});
 const ns=[];while(w.nextNode())ns.push(w.currentNode);
 ns.forEach(n=>{if(n.__en===undefined)n.__en=n.nodeValue;n.nodeValue=LANG==='en'?n.__en:trText(n.__en)});
 document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>['placeholder','aria-label','title'].forEach(k=>{if(!e.hasAttribute(k))return;const kk='_en_'+k;if(e[kk]===undefined)e[kk]=e.getAttribute(k);e.setAttribute(k,LANG==='en'?e[kk]:trText(e[kk]))}));
 document.documentElement.lang=LANG;
 if(document.title!==undefined){if(!document._enTitle)document._enTitle=document.title;document.title=LANG==='en'?document._enTitle:trText(document._enTitle)}}
function X(rows){rows.forEach(r=>DT[r[0]]=[r[1],r[2],r[3]])}

const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const core=require('../web/core.js');
const data=require('../data/directory.json'),t=require('../data/translations.json'),content=require('../data/content.json');
test('Kolkata filter and native-language query select only their intended branch',()=>{
 assert.deepEqual(core.filterHospitals(data.hospitals,{city:'kolkata'},'bn',t.bn).map(x=>x.id),['apollo-kolkata','fortis-kolkata','fortis-kidney-kolkata']);
 assert.deepEqual(core.filterHospitals(data.hospitals,{city:'kolkata',query:'ফোর্টিস'},'bn',t.bn).map(x=>x.id),['fortis-kolkata']);
 assert.equal(core.filterHospitals(data.hospitals,{city:'delhi',specialty:'ent'},'en',t.en).length,0);
});
test('expanded directory has 43 hospital records across 15 cities and flags review work',()=>{
 assert.equal(data.hospitals.length,43);assert.equal(new Set(data.hospitals.map(h=>h.city)).size,15);
 const branch=data.hospitals.find(h=>h.id==='apollo-guwahati');assert.ok(branch.source.includes('apollohospitals.com'));assert.equal(branch.specialties.length,0);assert.equal(branch.hotelSearch,true);
 assert.ok(core.filterHospitals(data.hospitals,{city:'guwahati',stay:true},'en',t.en).some(h=>h.id===branch.id));
 assert.ok(['en','bn','hi'].every(lang=>t[lang].departmentsUnconfirmed&&t[lang].hotelMapSearch));
});
test('rule matching applies selected hard constraints and preserves editorial order without clinical rankings',()=>{
 const match=core.matchHospitals(data.hospitals,{city:'chennai',specialty:'ortho',stay:true});
 assert.deepEqual(match.map(x=>x.hospital.id),['apollo-chennai','miot-chennai','h-chn-002','h-chn-004']);
 assert.ok(match.every(x=>x.reasons.length===3));
 assert.ok(core.matchHospitals(data.hospitals,{}).every(x=>x.fit===null));
 assert.equal(core.matchHospitals(data.hospitals,{city:'delhi',specialty:'eye'}).length,0);
});
test('budget includes each cost once, uses manually entered exchange rate and contingency',()=>{
 const result=core.calculateBudget({days:7,roomRate:2000,meals:500,treatment:100000,transport:5000,extra:2500,buffer:10,rate:1.45});
 assert.equal(result.subtotal,125000);assert.equal(Math.round(result.inr),137500);assert.equal(Math.round(result.bdt),199375);
 assert.equal(core.calculateBudget({days:7}).bdt,null);
});
test('hostile budget values are bounded, finite and non-negative',()=>{
 const b=core.normaliseBudget({days:9.7,roomRate:-5,treatment:Infinity,extra:'not-a-number',rate:1000000,buffer:200});
 assert.equal(b.days,9);assert.equal(b.roomRate,0);assert.equal(b.treatment,0);assert.equal(b.extra,0);assert.equal(b.rate,1000);assert.equal(b.buffer,100);
 assert.ok(Number.isFinite(core.calculateBudget(b).inr));
});
test('import rejects bad schemas, whitelists IDs and deduplicates saved/checklist values',()=>{
 const id=content.checklist[0].id;
 const p=core.validatePlan({schema:'meditrip-plan-v1',saved:['miot-chennai','miot-chennai','<script>'],done:[id,id,'unknown'],budget:{days:-1}},data,content.checklist);
 assert.deepEqual(p.saved,['miot-chennai']);assert.deepEqual(p.done,[id]);assert.equal(p.budget.days,0);
 assert.throws(()=>core.validatePlan({schema:'other',saved:[],done:[]},data,content.checklist));
 assert.throws(()=>core.validatePlan({schema:'meditrip-plan-v1',saved:'bad',done:[]},data,content.checklist));
});
test('speech chunking preserves every character including long unbroken Bangla text',()=>{
 for(const text of ['ক'.repeat(3501),'Long words '.repeat(700),'हिन्दी\nবাংলা English '.repeat(150)]){
  const parts=core.speechChunks(text);assert.equal(parts.join(''),text);assert.ok(parts.every(p=>p.length<=1001));
 }
 assert.deepEqual(core.speechChunks(''),[]);
});
test('all UI keys and nested content exist in every language',()=>{
 assert.deepEqual(Object.keys(t.en).sort(),Object.keys(t.bn).sort());assert.deepEqual(Object.keys(t.en).sort(),Object.keys(t.hi).sort());
 function walk(x){if(!x||typeof x!=='object')return;if('en' in x||'bn' in x||'hi' in x){for(const lang of ['en','bn','hi'])assert.equal(typeof x[lang],'string');for(const lang of ['en','bn','hi'])assert.ok(x[lang].trim());}
  else for(const value of Object.values(x))walk(value);}
 walk(content);for(const x of data.treatments)walk(x.name);
 const app=fs.readFileSync(path.join(__dirname,'../web/app.js'),'utf8');
 for(const match of app.matchAll(/\bt\('([^']+)'\)/g)){for(const lang of ['en','bn','hi'])assert.ok(t[lang][match[1]],lang+':'+match[1]);}
 for(const lang of ['en','bn','hi']){for(const city of ['kolkata','chennai','bengaluru','delhi','hyderabad','kochi','ahmedabad'])assert.ok(t[lang]['city.'+city]);for(const sp of ['cardiac','cancer','neuro','ortho','gastro','kidney','ent','eye','other'])assert.ok(t[lang]['sp.'+sp]);}
});
test('directory references are reciprocal, unique and source-backed; no unsubstantiated price/distance/rating',()=>{
 const records=[...data.hospitals,...data.hotels,...data.doctors];
 assert.equal(new Set(records.map(x=>x.id)).size,records.length);
 for(const x of records){assert.ok(x.source.startsWith('https://'));for(const key of ['price','rating','distanceKm','walkingMinutes'])assert.ok(!(key in x));}
 for(const x of data.hospitals)assert.ok(['page','search'].includes(x.sourceMode));
 for(const h of data.hospitals)for(const id of h.hotels){const hotel=data.hotels.find(x=>x.id===id);assert.ok(hotel);assert.equal(hotel.hospital,h.id);}
 for(const d of data.doctors)assert.ok(data.hospitals.some(x=>x.id===d.hospital));
 assert.equal(data.hotels.filter(x=>x.relation!=='area').length,4);
 assert.equal(data.doctors.length,69);assert.equal(data.hotels.length,11);
 assert.equal(data.doctors.filter(x=>x.verificationStatus==='verified_official').length,25);
});
test('canonical data and shipped offline JS data are identical',()=>{
 const vm=require('node:vm');const context={window:{}};vm.createContext(context);
 for(const [file,key,value] of [['data','MEDI_DATA',data],['i18n','MEDI_I18N',t],['content','MEDI_CONTENT',content]]){
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../web/'+file+'.js'),'utf8'),context);assert.deepEqual(JSON.parse(JSON.stringify(context.window[key])),value);
 }
});
test('all PWA precache files and PNG icons exist',()=>{
 const web=path.join(__dirname,'../web');const sw=fs.readFileSync(path.join(web,'sw.js'),'utf8');
 for(const match of sw.matchAll(/'\.\/([^']*)'/g))if(match[1])assert.ok(fs.existsSync(path.join(web,match[1])),match[1]);
 const manifest=JSON.parse(fs.readFileSync(path.join(web,'manifest.webmanifest'),'utf8'));
 for(const icon of manifest.icons)assert.ok(fs.existsSync(path.join(web,icon.src)));
});

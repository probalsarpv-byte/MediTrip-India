// Developer-only: npm install --no-save playwright ; npx playwright install chromium
// Start python tools/serve.py first. Override MEDITRIP_BROWSER/MEDITRIP_PLAYWRIGHT when needed.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.MEDITRIP_PLAYWRIGHT||'playwright');
const t=require('../data/translations.json');const base=process.env.MEDITRIP_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.MEDITRIP_BROWSER||undefined,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(base+'/index.html');await page.locator('h1').waitFor();
 assert.equal(await page.locator('html').getAttribute('lang'),'bn');
 await page.locator('#language').selectOption('en');
 assert.equal(await page.locator('h1').innerText(),t.en.heroTitle);
 await page.screenshot({path:path.join(__dirname,'../docs/previews/screen-home-en-desktop.png'),fullPage:true,animations:"disabled"});
 await page.goto(base+'/index.html#/hospitals');
 await page.locator('#hospital-city').selectOption('kolkata');
 assert.equal(await page.locator('[data-hospital]').count(),3);
 await page.locator('[data-action="compare"][data-id="apollo-kolkata"]').click();
 assert.equal(await page.locator('#hospital-city').inputValue(),'kolkata');
 assert.equal(await page.locator('[data-hospital]').count(),3);
 await page.locator('[data-action="save"][data-id="fortis-kolkata"]').click();
 assert.equal(await page.locator('#hospital-city').inputValue(),'kolkata');
 await page.locator('[data-action="compare"][data-id="fortis-kolkata"]').click();
 await page.locator('#compare-tray a').click();
 await page.locator('.compare-grid article').first().waitFor();assert.equal(await page.locator('.compare-grid article').count(),2);
 await page.goto(base+'/index.html#/trip');await page.locator('#budget-form').waitFor();
 await page.locator('[name="days"]').fill('7');await page.locator('[name="roomRate"]').fill('2000');await page.locator('[name="meals"]').fill('500');await page.locator('[name="treatment"]').fill('100000');await page.locator('[name="transport"]').fill('5000');await page.locator('[name="extra"]').fill('2500');await page.locator('[name="buffer"]').fill('10');await page.locator('[name="rate"]').fill('1.45');
 assert.ok((await page.locator('#budget-total').innerText()).includes('1,37,500'));
 await page.locator('[data-check]').first().check();
 await page.locator('#language').selectOption('bn');
 assert.equal(await page.locator('[name="roomRate"]').inputValue(),'2000');
 await page.reload();assert.equal(await page.locator('[name="roomRate"]').inputValue(),'2000');assert.equal(await page.locator('[data-check]').first().isChecked(),true);
 // A genuine export produces the allowlisted versioned plan.
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('[data-action="export"]').click()]);
 const exportPath=await download.path();const exported=JSON.parse(fs.readFileSync(exportPath,'utf8'));assert.equal(exported.schema,'meditrip-plan-v1');assert.ok(exported.saved.includes('fortis-kolkata'));
 await page.locator('#import-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"schema":"wrong"}')});
 await page.waitForFunction(text=>document.getElementById('toast').textContent===text,t.bn.importError);
 await page.locator('#import-file').setInputFiles({name:'plan.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
 await page.waitForFunction(text=>document.getElementById('toast').textContent===text,t.bn.importDone);
 await page.goto(base+'/index.html#/guide');await page.locator('.phrase').first().waitFor();assert.equal(await page.locator('.phrase').count(),24);
 await page.locator('[data-action="listenGuide"]').first().click();
 // Headless environment does not have offline speech voices; translated absence feedback must be visible.
 assert.ok([t.bn.voiceMissing,t.bn.audioUnavailable].includes(await page.locator('#toast').innerText()));
 await page.setViewportSize({width:390,height:844});
 for(const lang of ['bn','en','hi']){
  await page.locator('#language').selectOption(lang);
  for(const route of ['home','treatment','treatment/T-CARD-002','hospitals','hospital/miot-chennai','stays','stay/lemon-shimona','doctors','trip','guide','article/choose','settings','more']){
   await page.goto(base+'/index.html#/'+route);
   await page.waitForFunction((route)=>{const main=document.getElementById('main');if(route.startsWith('article/'))return !!main.querySelector('.article');if(route==='home')return !!main.querySelector('.hero');if(route==='hospitals')return !!main.querySelector('#hospital-grid');if(route==='treatment')return !!main.querySelector('#treatment-grid');if(route==='stays')return !!main.querySelector('#stay-grid');if(route==='trip')return !!main.querySelector('#budget-form');if(route==='settings')return !!main.querySelector('#settings-language');if(route==='more')return !!main.querySelector('.more-card');if(route==='guide')return !!main.querySelector('.phrase');if(route==='doctors')return !!main.querySelector('#doctor-city');return !!main.querySelector('.detail-hero');},route);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,lang+' '+route+' overflow');
   assert.ok(await page.locator('h1').count(),lang+' '+route+' h1 missing');
  }
  await page.goto(base+'/index.html#/home');await page.locator('#global-search').fill('CABG');await page.locator('.global-results a').first().waitFor();assert.ok((await page.locator('.global-results').innerText()).includes('CABG'));await page.goto(base+'/index.html#/treatment');await page.locator('#treatment-search').fill('CABG');assert.equal(await page.locator('#treatment-grid .treatment-card').count(),1);await page.goto(base+'/index.html#/home');await page.waitForFunction(()=>!document.getElementById('toast').classList.contains('visible'));await page.screenshot({path:path.join(__dirname,`../docs/previews/screen-home-${lang}-mobile.png`),fullPage:true,animations:"disabled"});
 }
 await page.locator('#language').selectOption('bn');await page.goto(base+'/index.html#/hospitals');
 await page.screenshot({path:path.join(__dirname,'../docs/previews/screen-hospitals-bn-mobile.png'),fullPage:true,animations:"disabled"});
 await page.goto(base+'/index.html#/settings');await page.locator('#settings-theme').selectOption('dark');
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.goto(base+'/index.html#/trip');await page.locator('#budget-form').waitFor();await page.waitForFunction(()=>!document.getElementById('toast').classList.contains('visible'));await page.screenshot({path:path.join(__dirname,'../docs/previews/screen-trip-bn-dark-mobile.png'),fullPage:true,animations:"disabled"});
 assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: language, filter/compare retention, persistence, budget, export/import, audio fallback, 39 multilingual mobile routes, dark mode and page errors.');
})().catch(e=>{console.error(e);process.exit(1)});

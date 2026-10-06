/* Developer-only asset tool: npm install --no-save sharp then node tools/make-icons.cjs.
 * No generated/provider photographs, only original project SVGs. */
const fs=require('node:fs'),path=require('node:path');
const sharp=require(process.env.MEDITRIP_SHARP||'sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
 const source=path.join(root,'web/assets/icon.svg');
 for(const size of [192,512])await sharp(source).resize(size,size).png().toFile(path.join(root,`web/assets/icon-${size}.png`));
 await sharp(source).resize(512,512).png().toFile(path.join(root,'web/assets/icon-maskable.png'));
 fs.mkdirSync(path.join(root,'store'),{recursive:true});
 const graphic=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500"><rect width="1024" height="500" fill="#103f44"/><circle cx="864" cy="85" r="280" fill="#295e60"/><circle cx="890" cy="365" r="135" fill="#b99057" opacity=".3"/><text x="62" y="208" fill="#f8f6ef" font-family="sans-serif" font-size="68" font-weight="bold">MediTrip India</text><text x="64" y="268" fill="#d6e1ce" font-family="sans-serif" font-size="27">Plan your journey with confidence</text><text x="64" y="345" fill="#eed7ae" font-family="sans-serif" font-size="20">Hospital directory · Stays · Offline trip planning</text></svg>`);
 await sharp(graphic).png().toFile(path.join(root,'store/feature-graphic-en.png'));
 console.log('PWA icons and 1024×500 feature graphic generated. Android adaptive vectors are in res/.');
})().catch(e=>{console.error(e);process.exit(1)});

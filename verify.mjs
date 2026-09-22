import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {validBarcode,miles,cleanBasket} from './dist/logic.js';
import {products,stores} from './dist/data.js';
for(const code of ['4006381333931','036000291452','96385074']) assert(validBarcode(code),code);
for(const code of ['4006381333932','123','abcdefghijklmn','400638133393100','-036000291452']) assert(!validBarcode(code),code);
assert.equal(miles({latitude:55.95,longitude:-3.2},{latitude:55.95,longitude:-3.2}),0);
assert(Math.abs(miles({latitude:0,longitude:0},{latitude:1,longitude:0})-69.1)<.1);
assert.deepEqual(cleanBasket({good:2,negative:-2,string:'3',unknown:3,huge:100},['good','negative','string','huge']),{good:2});
assert.deepEqual(cleanBasket(null,[]),{});
assert.deepEqual(cleanBasket(['x'],['x']),{});
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
for(const p of products){assert(p.url.startsWith('https://'));assert(p.note.length>20);assert(!p.tags.some(t=>/vegan|plant-based/i.test(t)));}
const manifest=JSON.parse(readFileSync('dist/manifest.webmanifest','utf8'));
assert.equal(manifest.display,'standalone');
assert.equal(manifest.scope,'./');
for(const entry of manifest.icons){const file='dist/'+entry.src.replace(/^\.\//,'');assert(existsSync(file),file);const buf=readFileSync(file);const [width,height]=entry.sizes.split('x').map(Number);assert.equal(buf.readUInt32BE(16),width);assert.equal(buf.readUInt32BE(20),height);}
const html=readFileSync('dist/index.html','utf8');
for(const m of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g))assert(existsSync('dist/'+m[1]),m[1]);
const coords=JSON.parse(readFileSync('dist/locations.json','utf8'));
for(const s of stores)assert(coords[s.postcode],s.name);
assert(readFileSync('dist/sw.js','utf8').includes("./assets/zxing.min.js"));
console.log('PASS: valid and invalid barcodes; distance calculations; storage validation; product records; manifest; PNG icons; local assets; all shop coordinates; offline scanner asset.');

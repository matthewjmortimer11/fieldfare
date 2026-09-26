#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createGunzip} from 'node:zlib';
import {createInterface} from 'node:readline';
import {dirname,resolve} from 'node:path';
import {departmentFor,cutFor} from '../dist/catalogue-taxonomy.js';

const [inputPath,retailer,outputPath]=process.argv.slice(2);
if(!inputPath||!retailer||!outputPath){console.error('Usage: node tools/import-off-discovery.mjs export.json|export.jsonl[.gz] "Tesco" output.json');process.exit(1)}
async function readProducts(path){
 const resolved=resolve(path);
 if(/\.jsonl(?:\.gz)?$/i.test(resolved)){
  const input=createReadStream(resolved);const stream=/\.gz$/i.test(resolved)?input.pipe(createGunzip()):input;
  const records=[];
  for await(const line of createInterface({input:stream,crlfDelay:Infinity})){if(line.trim())records.push(JSON.parse(line));}
  return records;
 }
 const raw=JSON.parse(await readFile(resolved,'utf8'));const records=Array.isArray(raw)?raw:raw.products;
 if(!Array.isArray(records))throw new Error('Expected an Open Food Facts products array, search response, JSONL or gzipped JSONL export.');
 return records;
}
const products=await readProducts(inputPath);
const animalTerms=/\b(beef|veal|lamb|mutton|pork|bacon|ham|chicken|turkey|duck|goose|venison|pheasant|partridge|game|sausage|meatball|meat)\b/i;
const retailerTerm=retailer.toLowerCase().replace(/[’']/g,'').split(/\s+/)[0];
const seen=new Set();
const queue=products.flatMap(product=>{
 const name=String(product.product_name_en||product.product_name||'').trim();
 const stores=String(product.stores||'').toLowerCase();
 const categories=String(product.categories||'');
 const code=String(product.code||'').replace(/\D/g,'');
 if(!name||!code||!animalTerms.test(name+' '+categories)||!(stores.includes(retailerTerm)||String(product.brands||'').toLowerCase().includes(retailerTerm)))return [];
 if(seen.has(code))return [];seen.add(code);
 const draft={name,species:null,tags:[],department:'Other meat'};
 const department=departmentFor(draft);
 return [{discoveryId:'open-food-facts-'+code,retailer,gtin:code,name,brand:product.brands||null,packSize:product.quantity||null,
  department,cut:cutFor({name}),reviewStatus:'needs_evidence',identityStatus:'community_candidate',
  source:'https://world.openfoodfacts.org/product/'+code,capturedAt:new Date().toISOString(),
  provenance:'Open Food Facts community data',limitations:'Identity, current retailer availability, product version and all welfare claims require confirmation from the exact pack or an approved retailer feed.',
  observedStores:product.stores||null,observedCategories:product.categories||null,observedLabels:product.labels||null,observedOrigins:product.origins||null}];
});
const payload={schemaVersion:1,retailer,kind:'community_discovery_queue',generatedAt:new Date().toISOString(),recordCount:queue.length,records:queue};
payload.contentHash=createHash('sha256').update(JSON.stringify(queue)).digest('hex');
await mkdir(dirname(resolve(outputPath)),{recursive:true});
await writeFile(resolve(outputPath),JSON.stringify(payload,null,2)+'\n');
console.log('Created '+queue.length+' Open Food Facts discovery candidates for '+retailer+'; none are welfare-reviewed.');

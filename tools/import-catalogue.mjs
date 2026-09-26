#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';

const departments=new Set(['Beef','Lamb','Pork','Chicken','Turkey','Duck','Game','Other meat']);
const statuses=new Set(['listed','out_of_stock','not_currently_ranged_online','unknown']);
const reviewStates=new Set(['discovered','needs_evidence','reviewed','retired']);
const required=['retailerProductId','name','url','department'];

const inputPath=process.argv[2],outputPath=process.argv[3];
if(!inputPath||!outputPath){console.error('Usage: node tools/import-catalogue.mjs input.json output.json');process.exit(1)}
const source=JSON.parse(await readFile(resolve(inputPath),'utf8'));
if(!source.retailer||!source.retrievedAt||!source.source)throw new Error('Input needs retailer, retrievedAt and source.');
if(!Array.isArray(source.records))throw new Error('Input needs a records array.');
if(!Number.isFinite(Date.parse(source.retrievedAt)))throw new Error('retrievedAt must be an ISO date/time.');
if(!/^https:\/\//.test(source.source))throw new Error('source must be an HTTPS URL.');

const keys=new Set();
const records=source.records.map((record,index)=>{
 for(const field of required)if(!record[field])throw new Error(`records[${index}] is missing ${field}.`);
 if(!/^https:\/\//.test(record.url))throw new Error(`records[${index}].url must be HTTPS.`);
 if(!departments.has(record.department))throw new Error(`records[${index}].department is unsupported.`);
 if(record.identityStatus!=='exact_variant')throw new Error(`records[${index}] must be an exact variant, not a range or family.`);
 const key=`${source.retailer}:${record.retailerProductId}`;
 if(keys.has(key))throw new Error(`Duplicate retailer product ID: ${key}`);keys.add(key);
 const gtin=record.gtin??null;
 if(gtin!==null&&!/^\d{8}$|^\d{12,14}$/.test(String(gtin)))throw new Error(`records[${index}].gtin must be 8, 12, 13 or 14 digits.`);
 const availabilityStatus=record.availabilityStatus||'unknown';
 if(!statuses.has(availabilityStatus))throw new Error(`records[${index}].availabilityStatus is unsupported.`);
 const reviewStatus=record.reviewStatus||'discovered';
 if(!reviewStates.has(reviewStatus))throw new Error(`records[${index}].reviewStatus is unsupported.`);
 return {fieldfareVariantId:record.fieldfareVariantId||`${source.retailer.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${record.retailerProductId}`,
  retailer:source.retailer,retailerProductId:String(record.retailerProductId),name:record.name.trim(),brand:record.brand||null,
  gtin:gtin===null?null:String(gtin),packSize:record.packSize||null,department:record.department,cut:record.cut||'other',
  availabilityStatus,identityStatus:'exact_variant',reviewStatus,url:record.url,capturedAt:source.retrievedAt,
  source:source.source,welfareEvidence:record.welfareEvidence||null};
});
const coverage=Object.fromEntries([...departments].map(department=>{const items=records.filter(record=>record.department===department);return [department,{discovered:items.length,reviewed:items.filter(record=>record.reviewStatus==='reviewed').length,needsEvidence:items.filter(record=>record.reviewStatus==='needs_evidence').length}]}));
const payload={schemaVersion:1,retailer:source.retailer,retrievedAt:source.retrievedAt,source:source.source,recordCount:records.length,coverage,records};
payload.contentHash=createHash('sha256').update(JSON.stringify(records)).digest('hex');
await mkdir(dirname(resolve(outputPath)),{recursive:true});
await writeFile(resolve(outputPath),JSON.stringify(payload,null,2)+'\n');
console.log(`Imported ${records.length} exact variants for ${source.retailer}; SHA-256 ${payload.contentHash}`);

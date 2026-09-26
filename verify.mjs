import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {validBarcode,miles,cleanBasket,isCurrentlyUnavailable,availabilityLabel,evaluateProduct} from './dist/logic.js';
import {stores} from './dist/data.js';
import {products,productReviews,productAliases,resolveProductId,catalogueSummary,verifiedBarcodeIndex,lookupReviewedBarcode} from './dist/catalogue.js';
import {departmentFor,cutFor} from './dist/catalogue-taxonomy.js';
for(const code of ['4006381333931','036000291452','96385074']) assert(validBarcode(code),code);
for(const code of ['4006381333932','123','abcdefghijklmn','400638133393100','-036000291452']) assert(!validBarcode(code),code);
assert.equal(miles({latitude:55.95,longitude:-3.2},{latitude:55.95,longitude:-3.2}),0);
assert(Math.abs(miles({latitude:0,longitude:0},{latitude:1,longitude:0})-69.1)<.1);
assert.deepEqual(cleanBasket({good:2,negative:-2,string:'3',unknown:3,huge:100},['good','negative','string','huge']),{good:2});
assert.deepEqual(cleanBasket(null,[]),{});
assert.deepEqual(cleanBasket(['x'],['x']),{});
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
for(const p of products){assert(p.url.startsWith('https://'));assert(p.note.length>20);assert(!p.tags.some(t=>/vegan|plant-based/i.test(t)));}
for(const p of products){assert.equal(p.department,departmentFor(p));assert(p.cut);assert(['reviewed','category_listing'].includes(p.reviewStatus));}
assert.equal(departmentFor({name:'British turkey breast steaks'}),'Turkey');
assert.equal(cutFor({name:'Organic lamb loin chops'}),'chops');
const manifest=JSON.parse(readFileSync('dist/manifest.webmanifest','utf8'));
assert.equal(manifest.display,'standalone');
assert.equal(manifest.scope,'./');
for(const entry of manifest.icons){const file='dist/'+entry.src.replace(/^\.\//,'');assert(existsSync(file),file);const buf=readFileSync(file);const [width,height]=entry.sizes.split('x').map(Number);assert.equal(buf.readUInt32BE(16),width);assert.equal(buf.readUInt32BE(20),height);}
const html=readFileSync('dist/index.html','utf8');
for(const m of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)){const asset=m[1].split('?')[0];assert(existsSync('dist/'+asset),m[1]);}
const coords=JSON.parse(readFileSync('dist/locations.json','utf8'));
for(const s of stores)assert(coords[s.postcode],s.name);
assert(readFileSync('dist/sw.js','utf8').includes("./assets/zxing.min.js"));
console.log('PASS: valid and invalid barcodes; distance calculations; storage validation; product records; manifest; PNG icons; local assets; all shop coordinates; offline scanner asset.');

// Prevent organic recommendations based on welfare labels or supplier-wide claims.
const {retailerReviews,retailerResearch,publishedRetailerRankings}=await import('./dist/reviews.js');
const {hasOrganicListing,organicEvidenceLabel}=await import('./dist/logic.js');
for(const id of ['aldi-free-range','lidl-free-range','tesco-finest-free-range','oakham','tesco-slower','freecompany-beef','peelham-beef']) assert.equal(hasOrganicListing(productReviews[id]),false,id);
assert.equal(hasOrganicListing(undefined),false);
for(const id of ['tesco-organic-whole','asda-organic','morrisons-organic','duchy-pork','ms-organic-whole','ocado-daylesford-mince']) assert.equal(hasOrganicListing(productReviews[id]),true,id);
assert.equal(productReviews['sainsbury-organic-whole'].code,null);
assert.equal(productReviews['sainsbury-organic-lamb'].certifier,'Organic Farmers and Growers');
const bodies={'GB-ORG-02':'Organic Farmers and Growers','GB-ORG-04':'Organic Food Federation','GB-ORG-05':'Soil Association'};
for(const p of products){const r=productReviews[p.id];assert(r,p.id);assert(['code','named','listing','supplier','none'].includes(r.level));assert(r.why.length>40);assert(r.limits.length>40);assert(r.sources.length);for(const source of r.sources){assert(source.url.startsWith('https://'));assert(source.label)}if(r.code){assert(r.certifier.includes(bodies[r.code]),p.id);assert.equal(r.level,'code')}assert(organicEvidenceLabel(r));}
assert.equal(Object.keys(retailerReviews).length,11);
assert.equal(retailerResearch.checked,'2026-09-23');
assert.equal(retailerResearch.retailers.Waitrose.points.length,4);
assert(retailerResearch.retailers['M&S'].sources.some(source=>source.url.includes('marksandspencer.com')));
assert(retailerResearch.framework.sources.some(source=>source.url.includes('betterchicken.org.uk')));
assert.equal(publishedRetailerRankings.wwf.scores['M&S'],81);
assert.equal(publishedRetailerRankings.wwf.scores.Iceland,0);
assert.equal(publishedRetailerRankings.bbfaw.ratings.Waitrose,'C');
assert.equal(publishedRetailerRankings.bbfaw.ratings.Tesco,'E');
assert(retailerReviews['Co-op'].verdict.includes('No exact'));
assert(productReviews['ocado-daylesford-chicken'].operatorDirectory.includes('DC19409'));
assert.equal(productReviews['ocado-daylesford-chicken'].certificate,'Not independently retrieved');
assert(readFileSync('dist/sw.js','utf8').includes("'./reviews.js?v=122'"));
assert.equal(products.filter(p=>hasOrganicListing(productReviews[p.id])).length,164);
assert.equal(hasOrganicListing(productReviews['waitrose-no1-free-range-pork-sausages-6']),false);
assert.equal(hasOrganicListing(productReviews['tesco-room-to-roam-chicken-breast-fillets']),false);
assert.equal(hasOrganicListing(productReviews[resolveProductId('tesco-organic-chicken-fillets-250-500g')]),true);
assert.equal(catalogueSummary.legacyRecordCount,95);
assert.equal(catalogueSummary.canonicalVariantCount,2232);
assert.equal(catalogueSummary.categoryListingCandidateCount,2142);
assert.equal(catalogueSummary.mergedLegacyRecordCount,5);
assert.equal(resolveProductId('tesco-organic-chicken-fillets-250-500g'),'tesco-organic');
assert.equal(productAliases['coop-british-chicken-breast'],'coop-breast');
for(const id of catalogueSummary.unknownOutdoorCorrections)assert.equal(products.find(p=>p.id===resolveProductId(id))?.outdoor,null,id);
for(const id of catalogueSummary.listingOnlyCertifierCorrections)assert.equal(productReviews[id]?.level,'listing',id);
console.log('PASS: 2232 catalogue variants; 11 grocers; 164 organic listings; aliases, unknown rearing, control-code identity, welfare-only exclusions, category-listing safeguards, operator directory distinction and offline reviews.');

const {decision,alternatives}=await import('./dist/logic.js');
const get=id=>products.find(p=>p.id===id);
assert.equal(products.length,2232);
assert.equal(decision(get('waitrose-duchy-chicken-breast-fillets'),productReviews['waitrose-duchy-chicken-breast-fillets']).key,'likely');
assert.equal(decision(get('tesco-chicken-wings-1000'),productReviews['tesco-chicken-wings-1000']).key,'unknown');
assert.equal(decision(get('tesco-organic-whole'),productReviews['tesco-organic-whole']).key,'meets');
assert.equal(decision(get('aldi-free-range'),productReviews['aldi-free-range']).key,'meets');
assert.equal(decision(get('tesco-finest-free-range-thigh-drumsticks-600'),productReviews['tesco-finest-free-range-thigh-drumsticks-600']).key,'likely');
assert.equal(decision(get('tesco-slower'),productReviews['tesco-slower']).key,'outside');
assert.equal(decision(get('aldi-breast'),productReviews['aldi-breast']).key,'unknown');
assert.equal(decision(get('aldi-breast'),productReviews['aldi-breast']).tone,'neutral');
assert.equal(decision(get('tesco-lamb-mince'),productReviews['tesco-lamb-mince']).key,'check');
assert.equal(decision(get('duchy-sausages'),productReviews['duchy-sausages']).key,'meets');
assert.equal(decision(get('tesco-organic-whole'),productReviews['tesco-organic-whole'],{strict:true}).key,'check');
assert.equal(decision(get('tesco-slower'),productReviews['tesco-slower'],{outdoor:false}).key,'unknown');
for(const p of products){const swaps=alternatives(p,products,productReviews);for(const q of swaps){assert.equal(q.species,p.species);assert.notEqual(q.id,p.id);assert.notEqual(q.availability,'unavailable');assert(['meets','likely'].includes(decision(q,productReviews[q.id]).key))}assert.equal(alternatives(p,products,productReviews,{strict:true}).length,0)}
assert.equal(alternatives(get('tesco-slower'),products,productReviews)[0].retailer,'Tesco');
assert(!alternatives(get('asda-organic'),products,productReviews).some(p=>p.availability==='unavailable'));
assert.equal(decision(get('aldi-lamb-mince'),productReviews['aldi-lamb-mince']).key,'unknown');
assert.equal(decision(get('waitrose-duchy-organic-streaky-bacon'),productReviews['waitrose-duchy-organic-streaky-bacon']).key,'likely');
assert.equal(isCurrentlyUnavailable({availabilityStatus:'out_of_stock'}),true);
assert.equal(isCurrentlyUnavailable({availabilityStatus:'listed_range'}),false);
assert.equal(availabilityLabel({availabilityStatus:'listed_range'}),'Range-level listing · match the exact pack');
assert.equal(evaluateProduct(get('tesco-organic-whole'),productReviews['tesco-organic-whole']).criteria[0].value,'Exact variant recorded');
assert.deepEqual(verifiedBarcodeIndex,{});
assert.equal(lookupReviewedBarcode('5012345678900'),null);
console.log('PASS: 2232 catalogue variants; unknown vs indoor vs category candidates, strict scope, species and retailer swap priority, aliases and unavailable alternatives.');
assert.equal(decision(get('tesco-organic-whole'),productReviews['tesco-organic-whole'],{asOf:Date.parse('2027-01-01')}).key,'check');
assert.equal(decision(get('morrisons-organic'),productReviews['morrisons-organic']).key,'check');
console.log('PASS: stale organic evidence and existing conflicting pack details require a fresh check.');

const {evidenceScore,retailerCoverage}=await import('./dist/logic.js');
const {brandLogos}=await import('./dist/brands.js');
const scoringDate={asOf:Date.parse('2026-09-22')};
assert.equal(evidenceScore(get('tesco-organic-whole'),productReviews['tesco-organic-whole'],scoringDate).total,85);
assert.equal(evidenceScore(get('aldi-lean-beef-mince'),productReviews['aldi-lean-beef-mince'],scoringDate).total,20);
assert.equal(evidenceScore(get('tesco-slower'),productReviews['tesco-slower'],scoringDate).total,35);
assert.equal(decision(get('tesco-slower'),productReviews['tesco-slower'],scoringDate).key,'outside');
assert.equal(evidenceScore(get('tesco-organic-whole'),productReviews['tesco-organic-whole'],{asOf:Date.parse('2027-01-01')}).total,75);
assert.equal(evidenceScore(get('tesco-organic-whole'),undefined).total,null);
for(const p of products){const score=evidenceScore(p,productReviews[p.id],scoringDate);assert(score.total>=0&&score.total<=100);assert.equal(score.parts.reduce((n,x)=>n+x.max,0),100);assert.equal(score.parts.at(-1).points,0);}
assert.equal(retailerCoverage('Aldi',products,productReviews,scoringDate).percent,1);
assert.equal(retailerCoverage('Not reviewed',products,productReviews,scoringDate).percent,null);
assert.equal(retailerCoverage('Tesco',products,productReviews,{...scoringDate,strict:true}).matches,0);
assert.equal(decision(get('tesco-organic-sirloin'),productReviews['tesco-organic-sirloin'],scoringDate).key,'likely');
assert.equal(Object.keys(brandLogos).length,11);
for(const name of Object.keys(retailerReviews)){assert(brandLogos[name]);assert(existsSync('dist/'+brandLogos[name].slice(2)));assert(readFileSync('dist/sw.js','utf8').includes(brandLogos[name]));}
assert(readFileSync('dist/sw.js','utf8').includes('./brands.js'));
console.log('PASS: evidence rubric bounds and exact examples, stale score, score never overrides verdict, coverage denominators, all 11 offline logo assets.');

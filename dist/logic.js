export function validBarcode(code){if(!/^\d{8}$|^\d{12,14}$/.test(code))return false;const body=code.slice(0,-1);let sum=0;for(let i=body.length-1,pos=0;i>=0;i--,pos++)sum+=Number(body[i])*(pos%2===0?3:1);return (10-sum%10)%10===Number(code.at(-1))}
export function miles(a,b){const rad=n=>n*Math.PI/180;const dLat=rad(b.latitude-a.latitude),dLon=rad(b.longitude-a.longitude);const h=Math.sin(dLat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;return 3958.8*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}
export function cleanBasket(value,ids){if(!value||typeof value!=='object'||Array.isArray(value))return {};return Object.fromEntries(Object.entries(value).filter(([id,n])=>ids.includes(id)&&Number.isInteger(n)&&n>0&&n<=99))}

// Organic is the strongest evidence tier. A named, exact-product outdoor/free-range
// claim can also meet the default factory-farming avoidance preference, but never
// becomes an organic claim or a substitute for a pack check.
export function hasOrganicListing(review){return ['code','named','listing'].includes(review?.level)}
export function organicEvidenceLabel(review){return ({code:'Organic · control code listed',named:'Organic · certifier named',listing:'Organic product listing',supplier:'Organic scope not confirmed',none:'Not verified organic'})[review?.level]||'Organic not checked'}
export function hasOutdoorProductEvidence(product){return product?.outdoor===true}
export function matchesFieldfareStandard(product,review){return hasOrganicListing(review)||hasOutdoorProductEvidence(product)}
export function isCurrentlyUnavailable(product){return product?.availabilityStatus==='out_of_stock'||product?.availability==='unavailable'}
export function availabilityLabel(product){
 if(isCurrentlyUnavailable(product))return 'Listing showed unavailable · local stock unknown';
 if(product?.availabilityStatus==='listed_range')return 'Range-level listing · match the exact pack';
 if(product?.availabilityStatus==='listed')return 'Listed when reviewed · branch stock unknown';
 return 'Availability not established';
}

// This is deliberately a status, not a welfare score. It tells a shopper how
// closely our cited record maps to the pack in front of them.
export function evidenceRecordLabel(product,review){
 if(product?.identityStatus==='range_candidate')return 'Category listing · check the pack';
 if(review?.level==='code')return 'Exact product review · control code recorded';
 if(review?.level==='named')return 'Exact product review · certifier named';
 if(product?.identityStatus==='exact_variant')return 'Exact product review';
 return 'Evidence needs checking';
}

export function evaluateProduct(product,review,preferences={}){
 const verdict=decision(product,review,preferences);
 return {verdict,criteria:[
  {label:'Exact product identity',value:product?.identityStatus==='exact_variant'?'Exact variant recorded':'Range or unresolved variant',status:product?.identityStatus==='exact_variant'?'supported':'check'},
  {label:'Organic evidence',value:organicEvidenceLabel(review),status:hasOrganicListing(review)?'supported':'missing'},
  {label:'Organic certifier or code',value:review?.code||review?.certifier||'Not established from reviewed sources',status:review?.code||review?.certifier?'supported':'missing'},
  {label:'Outdoor access',value:product?.outdoor===true?'Recorded':product?.outdoor===false?'Indoor system recorded':'Not established',status:product?.outdoor===true?'supported':product?.outdoor===false?'outside':'check'},
  {label:'Availability',value:availabilityLabel(product),status:isCurrentlyUnavailable(product)?'check':'unknown'}
 ]};
}

export function exactStandardReason(product,review){
 const organic=hasOrganicListing(review);
 const organicText=organic?`The reviewed listing states organic${review?.code?` and shows ${review.code}`:review?.certifier?` and names ${review.certifier}`:''}.`:hasOutdoorProductEvidence(product)?'This exact product has a named outdoor or free-range claim, but organic status is not established.':'No exact organic or outdoor-access claim is established for this listing.';
 const rearing=product?.outdoor===true?'Outdoor or free-range evidence is recorded.':product?.outdoor===false?'The documented system is indoor; it does not meet your outdoor-access preference.':'Outdoor access is not established from the reviewed source.';
 const welfare=review?.certifier&&!/organic/i.test(review.certifier)?` Welfare evidence recorded: ${review.certifier}.`:'';
 return `${organicText} ${rearing}${welfare}`;
}

export function decision(product, review, {outdoor=true, strict=false, asOf=Date.now()}={}) {
 if(outdoor && product.outdoor===false) return {key:'outside',label:'Confirmed mismatch',reason:`The reviewed source documents an indoor system. ${exactStandardReason(product,review)}`,tone:'red'};
 if(!matchesFieldfareStandard(product,review)) return {key:'unknown',label:'Not enough evidence',reason:exactStandardReason(product,review),tone:'neutral'};
 const checked=Date.parse(review?.checked||product.checked);
 if(!Number.isFinite(checked)||asOf-checked>90*86400000) return {key:'check',label:'Check this pack',reason:'This product evidence needs a fresh review (over 90 days old or missing its review date).',tone:'amber'};
 if(strict && !review.certificateScopeChecked) return {key:'check',label:'Check this pack',reason:'Current certification scope for this exact product has not been independently checked.',tone:'amber'};
 if(product.packConflict) return {key:'check',label:'Check this pack',reason:'The retailer listing has conflicting pack details. Match your pack before relying on this entry.',tone:'amber'};
 if(product.identityStatus==='range_candidate') return {key:'likely',label:'Pack check needed',reason:`${exactStandardReason(product,review)} The official source is a category or range listing, so this is not a confirmed match. Buy only if this exact shelf pack repeats the claim.`,tone:'amber'};
 if(outdoor&&product.outdoor!==true) return {key:'likely',label:'Pack check needed',reason:`${exactStandardReason(product,review)} Outdoor access was not established for this exact product. This is not a confirmed match until the current pack supplies that evidence.`,tone:'amber'};
 if(hasOutdoorProductEvidence(product)) return {key:'meets',label:'Confirmed match',reason:`${exactStandardReason(product,review)} The reviewed product-level evidence meets your outdoor-access preference.`,tone:'green'};
 if(hasOrganicListing(review)&&!['code','named'].includes(review.level)) return {key:'likely',label:'Pack check needed',reason:'The exact product is listed as organic, but the certifier or control code still needs checking on the current pack. It is not a confirmed match yet.',tone:'amber'};
 return {key:'check',label:'Check this pack',reason:'Listed as organic; the certifier or control code still needs checking.',tone:'amber'};
}
export function cutOf(p){return p.cut||(/mince/i.test(p.name)?'mince':/breast|fillet/i.test(p.name)&&p.species==='Chicken'?'breast':/whole|chicken$/i.test(p.name)&&p.species==='Chicken'?'whole':/steak|sirloin|ribeye/i.test(p.name)?'steak':/sausage/i.test(p.name)?'sausages':p.species)}
export function alternatives(product,products,reviews,preferences={}) {
 return products.filter(p=>p.id!==product.id&&p.species===product.species&&!isCurrentlyUnavailable(p)&&['meets','likely'].includes(decision(p,reviews[p.id],preferences).key))
 .sort((a,b)=>Number(decision(b,reviews[b.id],preferences).key==='meets')-Number(decision(a,reviews[a.id],preferences).key==='meets')||Number(b.retailer===product.retailer)-Number(a.retailer===product.retailer)||Number(cutOf(b)===cutOf(product))-Number(cutOf(a)===cutOf(product))||a.name.localeCompare(b.name)).slice(0,3);
}

// Editorial evidence-coverage rubric v1. This never determines the buying verdict.
export function evidenceScore(product,review,{asOf=Date.now()}={}){
 if(!review)return {total:null,parts:[],version:1};
 const fresh=Number.isFinite(Date.parse(review.checked||product.checked))&&asOf-Date.parse(review.checked||product.checked)<=90*86400000;
 const parts=[
  {label:'Exact product organic claim',points:hasOrganicListing(review)?25:0,max:25,detail:hasOrganicListing(review)?'The exact reviewed product is explicitly described as organic.':'No exact-product organic claim established; this is a gap, not a welfare finding.'},
  {label:'Organic certifier identified',points:review.level==='code'&&review.code?25:review.level==='named'&&review.certifier?18:0,max:25,detail:review.code?`Control code observed: ${review.code}. Operator/product scope is a separate check.`:review.certifier&&review.level==='named'?'Certifier named (18 points); control code not observed.':'No product-level certifier or control code established.'},
  {label:'Rearing-system evidence',points:typeof product.outdoor==='boolean'?15:0,max:15,detail:product.outdoor===true?'Outdoor / organic-system claim recorded. No individual animal audit.':product.outdoor===false?'Indoor system documented. These are evidence points, not approval of indoor rearing.':'Rearing system not established.'},
  {label:'Linked primary sources',points:review.sources?.some(s=>s.url?.startsWith('https://'))?10:0,max:10,detail:'Points for linked reviewed source material, not independent corroboration.'},
  {label:'Recent, consistent record',points:fresh&&!product.packConflict?10:0,max:10,detail:product.packConflict?'Conflicting pack details require a new check.':fresh?'Reviewed within 90 days. This does not establish current shelf stock.':'Record is older than 90 days or has no review date.'},
  {label:'Independent product verification',points:(review.certificateScopeChecked?10:0)+(product.verifiedGtin?5:0),max:15,detail:'10 points for checked current certificate/product scope; 5 for independently matched pack GTIN. No points for a barcode checksum alone.'}
 ];
 return {total:parts.reduce((sum,p)=>sum+p.points,0),parts,version:1};
}
export function retailerCoverage(name,products,reviews,preferences={}){const sample=products.filter(p=>p.retailer===name),decisions=sample.map(p=>({p,d:decision(p,reviews[p.id],preferences)})),matches=decisions.filter(({d})=>d.key==='meets').length,likely=decisions.filter(({d})=>d.key==='likely').length;return {reviewed:sample.length,matches,likely,percent:sample.length?Math.round(100*matches/sample.length):null}}

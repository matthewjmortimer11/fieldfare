import {products as legacyProducts} from './data.js?v=122';
import {productReviews as legacyReviews} from './reviews.js?v=122';
import {catalogueRecord} from './catalogue-taxonomy.js?v=122';
import {categoryListingProducts,categoryListingReviews} from './category-listings.js?v=122';

// Legacy IDs remain resolvable so saved lists survive reviewed product merges.
export const productAliases=Object.freeze({
 'lidl-deluxe-free-range-whole-chicken':'lidl-free-range',
 'tesco-organic-chicken-fillets-250-500g':'tesco-organic',
 'tesco-organic-chicken-fillets-2':'tesco-organic',
 'morrisons-organic-whole-chicken-22kg':'morrisons-organic',
 'coop-british-chicken-breast':'coop-breast',
 'aldi-specially-selected-free-range-chicken-thigh-fillets':'aldi-free-range-thigh'
});

const unknownOutdoor=new Set([
 'aldi-lamb-mince','aldi-turkey-mince','aldi-turkey-breast-steaks','aldi-beef-pork-mince',
 'aldi-british-turkey','coop-british-chicken-breast','coop-scottish-rump','coop-turkey-thigh-mince',
 'coop-british-meatballs','lidl-birchwood-lamb-half-leg','lidl-deluxe-turkey',
 'aldi-pork-loin-medallions','aldi-british-lamb-chops','lidl-birchwood-sirloin',
 'waitrose-duchy-organic-lamb-loin-chops','sainsburys-so-organic-lamb-mince-400g',
 'sainsburys-so-organic-lamb-chops','aldi-specially-selected-free-range-chicken-thigh-fillets'
]);

const listingOnlyCertifiers=new Set([
 'waitrose-duchy-organic-pork-meatballs','waitrose-duchy-organic-streaky-bacon',
 'waitrose-duchy-organic-lamb-loin-chops','marks-spencer-organic-free-range-chicken-breast-fillets',
 'sainsburys-so-organic-lamb-mince-400g','sainsburys-so-organic-lamb-chops'
]);

const rangeAvailability=/range|category|policy|selected stores|seasonal|while-stocks|promotion|search result|menu example/i;
const unavailable=/unavailable|out of stock/i;

export const organicBodies=Object.freeze({
 'Organic Food Federation':['GB-ORG-04'],
 'Organic Farmers and Growers':['GB-ORG-02'],
 'Soil Association':['GB-ORG-05']
});

// Only mappings observed on a photographed pack and reviewed against its exact
// product record belong here. An empty map deliberately means a barcode scan
// stays unverified rather than being guessed from a similar product.
export const verifiedBarcodeIndex=Object.freeze({});

export function resolveProductId(id){
 const seen=new Set(); let current=id;
 while(productAliases[current]&&!seen.has(current)){seen.add(current);current=productAliases[current]}
 return current;
}

export function lookupReviewedBarcode(code){
 const productId=verifiedBarcodeIndex[code];
 if(!productId)return null;
 const canonicalId=resolveProductId(productId);
 return products?.find?.(product=>product.id===canonicalId)||null;
}

const correctedOutdoorIds=new Set([...unknownOutdoor].map(resolveProductId));

export function availabilityStatus(value){
 if(!value)return 'unknown';
 if(unavailable.test(value))return 'out_of_stock';
 if(rangeAvailability.test(value))return 'listed_range';
 return 'listed';
}

function identityStatus(product){
 if(product.identityStatus)return product.identityStatus;
 if(product.packConflict||availabilityStatus(product.availability)==='listed_range')return 'range_candidate';
 return 'exact_variant';
}

function welfareSchemes(review){
 const value=review?.certifier||'';
 return /(RSPCA|Red Tractor|Better Chicken|Quality Meat Scotland|free range|outdoor bred|Select Farms)/i.test(value)?[value]:[];
}

function normaliseReview(id,review){
 const base={...review,welfareSchemes:welfareSchemes(review)};
 if(listingOnlyCertifiers.has(id)){
  return {...base,level:'listing',certifier:null,organicCertifierStatus:'not_identified'};
 }
 return {...base,organicCertifierStatus:base.level==='named'||base.level==='code'?'identified':'not_identified'};
}

const canonicalLegacyProducts=legacyProducts
 .filter(product=>resolveProductId(product.id)===product.id)
 .map(product=>Object.freeze(catalogueRecord({...product,
  outdoor:correctedOutdoorIds.has(product.id)?null:product.outdoor,
  availabilityStatus:availabilityStatus(product.availability),
  identityStatus:identityStatus(product),
  canonicalId:product.id
 })));

// A category page sometimes repeats a product we have separately audited from its
// exact product page. Keep the exact record only: it has the stronger evidence and
// avoids making one pack look like two different choices.
const supersededCategoryCandidates=new Set(['tesco-organic-chicken-fillets-2']);
const activeCategoryListingProducts=categoryListingProducts.filter(product=>!supersededCategoryCandidates.has(product.id));
export const products=Object.freeze([...canonicalLegacyProducts,...activeCategoryListingProducts.map(product=>Object.freeze(catalogueRecord({...product,availabilityStatus:availabilityStatus(product.availability),canonicalId:product.id})))]);

export const productReviews=Object.freeze(Object.fromEntries(products.map(product=>[
 product.id,Object.freeze(normaliseReview(product.id,legacyReviews[product.id]||categoryListingReviews[product.id]))
])));

export const catalogueSummary=Object.freeze({
 legacyRecordCount:legacyProducts.length,
 canonicalVariantCount:products.length,
 categoryListingCandidateCount:activeCategoryListingProducts.length,
 mergedLegacyRecordCount:legacyProducts.length-canonicalLegacyProducts.length,
 unknownOutdoorCorrections:[...unknownOutdoor].filter(id=>legacyProducts.some(product=>product.id===id)),
 listingOnlyCertifierCorrections:[...listingOnlyCertifiers]
});

export const meatDepartments=Object.freeze(['Beef','Lamb','Pork','Chicken','Turkey','Duck','Game','Other meat']);

const cutRules=[
 ['mince',/mince|ground/i],['breast',/breast|fillet/i],['whole',/whole chicken|whole turkey|whole duck|^whole\b/i],
 ['sausages',/sausage|chipolata/i],['bacon',/bacon|pancetta/i],['meatballs',/meatball/i],
 ['steak',/steak|sirloin|ribeye|rump/i],['chops',/chop|cutlet/i],['joint',/joint|roast|leg|shoulder/i],['thighs and drumsticks',/thigh|drumstick/i],['other',/.*/]
];

export function departmentFor(product){
 const declared=product?.species;
 if(meatDepartments.includes(declared))return declared;
 const text=`${product?.name||''} ${product?.tags?.join(' ')||''}`;
 if(/turkey/i.test(text))return 'Turkey';
 if(/duck/i.test(text))return 'Duck';
 if(/venison|game|pheasant|partridge/i.test(text))return 'Game';
 if(/beef|steak|ribeye|sirloin/i.test(text))return 'Beef';
 if(/lamb|mutton/i.test(text))return 'Lamb';
 if(/pork|bacon|sausage|ham/i.test(text))return 'Pork';
 if(/chicken/i.test(text))return 'Chicken';
 return 'Other meat';
}

export function cutFor(product){
 const text=product?.name||'';
 return cutRules.find(([,pattern])=>pattern.test(text))?.[0]||'other';
}

export function catalogueRecord(product){
 return Object.freeze({...product,department:departmentFor(product),cut:product.cut||cutFor(product),reviewStatus:product.reviewStatus||'reviewed'});
}

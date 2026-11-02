export const money=(kobo:number)=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN'}).format(kobo/100);

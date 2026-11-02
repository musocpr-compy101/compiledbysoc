import {createHmac,timingSafeEqual,createHash} from 'node:crypto';
export const referenceOK=(s:string)=>/^SOC_[a-f0-9]{32}$/.test(s);
export const hashAccess=(s:string)=>createHash('sha256').update(s).digest('hex');
export function validWebhook(raw:string,signature:string|null,secret:string){if(!signature||!/^[a-f0-9]{128}$/i.test(signature)||!secret)return false;return timingSafeEqual(Buffer.from(signature,'hex'),createHmac('sha512',secret).update(raw).digest());}
export function expectedDomain(secret:string){if(secret.startsWith('sk_test_'))return 'test';if(secret.startsWith('sk_live_'))return 'live';throw new Error('Invalid payment configuration.');}
export const money=(kobo:number)=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN'}).format(kobo/100);
export const PAYMENT_COLUMNS='id,reference,item_id,item_title,academic_session,payer_name,email,matric,programme,level,amount_kobo,currency,domain,status,provider_id,channel,fees_kobo,paid_at,created_at,verified_at,review_reason,duplicate_of';
export type Payment={id:string;reference:string;item_id:string;item_title:string;academic_session:string;payer_name:string;email:string;matric:string;programme:string;level:string;amount_kobo:number;currency:string;domain:string;status:string;provider_id:string|null;channel:string|null;fees_kobo:number|null;paid_at:string|null;created_at:string;verified_at:string|null;review_reason:string|null;duplicate_of:string|null};
export type PaymentItem={id:string;title:string;description:string;academic_session:string;amount_kobo:number;currency:string;active:boolean};
export function csvCell(value:unknown){let text=String(value??'');if(/^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}
export function validateProvider(data:unknown,reference:string){
 const d=data as Record<string,any>;
 if(!d||d.reference!==reference||!Number.isSafeInteger(d.amount)||d.amount<1||!['test','live'].includes(d.domain)||typeof d.currency!=='string'||typeof d.status!=='string'||typeof d.customer?.email!=='string')throw new Error('Incomplete provider verification.');
 if(d.status==='success'&&(!d.id||typeof d.paid_at!=='string'||!Number.isFinite(Date.parse(d.paid_at))))throw new Error('Incomplete successful transaction.');
 return {p_reference:reference,p_provider_id:d.id==null?null:String(d.id),p_amount:d.amount,p_currency:d.currency,p_domain:d.domain,p_email:d.customer.email,p_status:d.status,p_channel:typeof d.channel==='string'?d.channel:null,p_fees:Number.isSafeInteger(d.fees)&&d.fees>=0?d.fees:null,p_paid_at:d.paid_at&&Number.isFinite(Date.parse(d.paid_at))?d.paid_at:null};
}

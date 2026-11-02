import {randomUUID} from 'node:crypto';import {z} from 'zod';import {serviceDb} from '@/lib/supabase/admin';import {paymentConfigured,paystack} from '@/lib/paystack';import {hashAccess,expectedDomain} from '@/lib/payments-core';import {sameOrigin,boundedJson,limited,setReceiptCookie} from '@/lib/payment-auth';
export const runtime='nodejs';
const schema=z.object({attempt:z.string().uuid(),access_code:z.string().regex(/^[a-f0-9]{64}$/),item_id:z.string().uuid(),name:z.string().trim().min(2).max(120),email:z.email().trim().toLowerCase(),matric:z.string().trim().min(4).max(60),programme:z.enum(['Computer Science','Software Engineering','Cybersecurity','Information Technology']),level:z.enum(['100','200','300','400'])});
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Invalid request origin.'},{status:403});if(!paymentConfigured())return Response.json({error:'Online payments are not available yet.'},{status:503});
 try{const parsed=schema.safeParse(await boundedJson(request));if(!parsed.success)return Response.json({error:'Check your name, email, matric number and programme.'},{status:400});const v=parsed.data;
 if(!await limited('checkout:'+v.email))return Response.json({error:'Too many attempts. Wait 15 minutes before retrying.'},{status:429});
 const c=serviceDb();const {data:p,error}=await c.rpc('reserve_payment',{p_id:v.attempt,p_reference:'SOC_'+randomUUID().replaceAll('-',''),p_hash:hashAccess(v.access_code),p_item:v.item_id,p_name:v.name,p_email:v.email,p_matric:v.matric,p_programme:v.programme,p_level:v.level,p_domain:expectedDomain(process.env.PAYSTACK_SECRET_KEY!)});
 if(error)return Response.json({error:error.message.includes('successful payment')?'A successful payment is already recorded for this item and matric number. Use your receipt or contact finance.':'Could not start this payment. Use “Start a different payment” if you changed your details, or check that the item is available.'},{status:409});
 await setReceiptCookie(p.reference,v.access_code);
 if(p.status==='paid')return Response.json({receipt:'/pay-dues/receipt/'+p.reference,reference:p.reference});
 if(p.authorization_url)return Response.json({authorization_url:p.authorization_url,reference:p.reference});
 const provider=await paystack('/transaction/initialize',{email:p.email,amount:String(p.amount_kobo),currency:p.currency,reference:p.reference,callback_url:new URL('/pay-dues/result',process.env.APP_URL!).href,metadata:{payment_id:p.id,item_id:p.item_id}});
 const url=new URL(provider.authorization_url);if(url.protocol!=='https:'||url.hostname!=='checkout.paystack.com'||provider.reference!==p.reference)throw new Error('Invalid checkout response.');
 const {error:saveError}=await c.from('payments').update({authorization_url:url.href}).eq('id',p.id).eq('status','pending');if(saveError)throw saveError;
 return Response.json({authorization_url:url.href,reference:p.reference},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'We couldn’t confirm checkout. Keep your access code and retry this attempt. Don’t start another payment if you were charged.'},{status:502});}
}

import {createHash} from 'node:crypto';import {validWebhook,referenceOK} from '@/lib/payments-core';import {verifyPayment} from '@/lib/paystack';import {serviceDb} from '@/lib/supabase/admin';
export const runtime='nodejs';
export async function POST(request:Request){
 const secret=process.env.PAYSTACK_SECRET_KEY;if(!secret)return new Response('Unavailable',{status:503});
 const reader=request.body?.getReader();if(!reader)return new Response('Empty',{status:400});const chunks:Uint8Array[]=[];let size=0;while(true){const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>1024*1024){await reader.cancel();return new Response('Too large',{status:413});}chunks.push(r.value);}const raw=Buffer.concat(chunks).toString('utf8');
 if(!validWebhook(raw,request.headers.get('x-paystack-signature'),secret))return new Response('Invalid signature',{status:401});
 try{const event=JSON.parse(raw);const reference=event.data?.reference||event.data?.transaction?.reference;
 if(event.event==='charge.success'){
  if(typeof reference!=='string'||!referenceOK(reference))return new Response('Ignored',{status:200});
  await verifyPayment(reference);return new Response('OK',{status:200});
 }
 // Signed refund/dispute notices are logged for finance review, never counted as new payments.
 if(typeof event.event==='string'&&/^(refund\.|charge\.dispute\.)/.test(event.event)){
  const c=serviceDb();let query=c.from('payments').select('id');
  if(typeof reference==='string'&&referenceOK(reference))query=query.eq('reference',reference);
  else {const transaction=event.data?.transaction?.id??event.data?.transaction;if(!['string','number'].includes(typeof transaction))return new Response('Ignored',{status:200});query=query.eq('provider_id',String(transaction));}
  const {data:p,error}=await query.maybeSingle();if(error)throw error;
  if(p){const {error:recordError}=await c.from('payment_events').upsert({payment_id:p.id,event_key:createHash('sha256').update(raw).digest('hex'),event_type:event.event,summary:{provider_event_id:event.data?.id,amount_kobo:event.data?.amount,status:event.data?.status,action:'Reconcile refund/dispute in Paystack.'}},{onConflict:'event_key',ignoreDuplicates:true});if(recordError)throw recordError;const {error:flagError}=await c.from('payments').update({review_reason:'Provider refund/dispute notice received. Review event log and Paystack.'}).eq('id',p.id);if(flagError)throw flagError;}
 }
 return new Response('OK',{status:200});
 }catch{return new Response('Retry verification',{status:503});}
}

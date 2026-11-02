import {PutObjectCommand,DeleteObjectCommand} from '@aws-sdk/client-s3';import {randomUUID} from 'node:crypto';
import {canAccess,AREAS,type Area} from '@/lib/access';
import {storage} from '@/lib/r2';import {db,identity} from '@/lib/supabase/server';import {MAX_FILE,detectType,safeFilename} from '@/lib/upload-validation';
export const runtime='nodejs';
export async function POST(request:Request){
 const origin=process.env.APP_URL;if(!origin||request.headers.get('origin')!==new URL(origin).origin)return Response.json({error:'Invalid request origin.'},{status:403});
 const me=await identity();if(!me||!AREAS.some(a=>canAccess(me,a)))return Response.json({error:'Publishing access required.'},{status:403});
 try{
  const limit=MAX_FILE+100000;const reader=request.body?.getReader();if(!reader)return Response.json({error:'Choose a file.'},{status:400});
  let count=0;const chunks:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;count+=value.length;if(count>limit){await reader.cancel();return Response.json({error:'Files must be 4 MB or smaller.'},{status:413});}chunks.push(value);}
  const parsed=new Request(request.url,{method:'POST',headers:{'Content-Type':request.headers.get('content-type')||''},body:Buffer.concat(chunks)});
  const form=await parsed.formData();const area=String(form.get('area')||'content') as Area;if(!AREAS.includes(area)||area==='elections'||!canAccess(me,area))return Response.json({error:'Access denied for this area.'},{status:403});const file=form.get('file');if(!(file instanceof File)||!file.size||file.size>MAX_FILE)return Response.json({error:'Choose an image or PDF under 4 MB.'},{status:400});
  const body=Buffer.from(await file.arrayBuffer());const type=detectType(body);if(!type||type!==file.type)return Response.json({error:'Use a JPG, PNG, WebP or PDF file.'},{status:400});
  const id=randomUUID();const name=safeFilename(file.name);const key=`editorial/${id}/${name}`;const {client,bucket}=storage();
  await client.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:body,ContentType:type,ContentDisposition:type==='application/pdf'?`attachment; filename="${name}"`:'inline'}));
  const {error}=await(await db()).from('media').insert({id,object_key:key,name,content_type:type,size_bytes:file.size,owner_id:me.user.id,area});
  if(error){await client.send(new DeleteObjectCommand({Bucket:bucket,Key:key}));throw error;}
  return Response.json({id,name,type},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Upload failed. Check the file and storage connection, then retry.'},{status:500});}
}

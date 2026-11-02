import {GetObjectCommand} from '@aws-sdk/client-s3';import {getSignedUrl} from '@aws-sdk/s3-request-presigner';import {storage} from '@/lib/r2';import {db,isConfigured} from '@/lib/supabase/server';import {uuid} from '@/lib/validation';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!uuid.safeParse(id).success||!isConfigured())return new Response('Not found',{status:404});
 const {data,error}=await(await db()).from('media').select('object_key,name,content_type').eq('id',id).maybeSingle();
 if(error||!data)return new Response('Not found',{status:404});
 try{const {client,bucket}=storage();const url=await getSignedUrl(client,new GetObjectCommand({Bucket:bucket,Key:data.object_key,ResponseContentType:data.content_type,ResponseContentDisposition:data.content_type==='application/pdf'?`attachment; filename="${data.name.replace(/[^a-zA-Z0-9._-]/g,'_')}"`:'inline'}),{expiresIn:60});return new Response(null,{status:307,headers:{Location:url,'Cache-Control':'private, no-store'}});}catch{return new Response('File temporarily unavailable',{status:503});}
}

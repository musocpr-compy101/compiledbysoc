import {db,isConfigured} from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export async function GET(){if(!isConfigured())return Response.json([]);const {data,error}=await(await db()).from('posts').select('id,kind,title,excerpt,byline,image_id,published_at').eq('status','published').neq('kind','rule').order('published_at',{ascending:false}).limit(50);if(error)return Response.json({error:'Posts unavailable'},{status:503});return Response.json(data,{headers:{'Cache-Control':'no-store'}});}

import {db,isConfigured} from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export async function GET(){if(!isConfigured())return Response.json({configured:false,events:[]});const {data,error}=await(await db()).from('events').select('*').order('starts_at');if(error)return Response.json({error:'Calendar unavailable'},{status:503});return Response.json({configured:true,events:data},{headers:{'Cache-Control':'no-store'}});}

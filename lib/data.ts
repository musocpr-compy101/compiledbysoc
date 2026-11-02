import 'server-only';
import { db,isConfigured } from './supabase/server';
import type {Post,Election,CampusEvent} from './validation';
export async function importantData() {
  if (!isConfigured()) return {posts:[] as Post[],elections:[] as Election[],events:[] as CampusEvent[],unavailable:false};
  const c=await db();
  const [p,e,v]=await Promise.all([
    c.from('posts').select('*').eq('status','published').order('pinned',{ascending:false}).order('published_at',{ascending:false}),
    c.from('elections').select('*').neq('status','draft').order('starts_at',{ascending:false}),
    c.from('events').select('*').order('starts_at',{ascending:true})
  ]);
  return {posts:(p.data||[]) as Post[],elections:(e.data||[]) as Election[],events:(v.data||[]) as CampusEvent[],unavailable:!!(p.error||e.error||v.error)};
}
export const prettyDate=(s:string)=>new Intl.DateTimeFormat('en-NG',{dateStyle:'medium',timeZone:'Africa/Lagos'}).format(new Date(s));
export const prettyTime=(s:string)=>new Intl.DateTimeFormat('en-NG',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Lagos'}).format(new Date(s))+' WAT';

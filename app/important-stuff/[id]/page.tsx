import {notFound} from 'next/navigation';
import {Chrome} from '@/components/Chrome';
import {db,isConfigured} from '@/lib/supabase/server';
import {uuid} from '@/lib/validation';
import {prettyDate} from '@/lib/data';
export const dynamic='force-dynamic';
export default async function PostPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!uuid.safeParse(id).success||!isConfigured())notFound();
 const {data:p,error}=await(await db()).from('posts').select('*').eq('id',id).eq('status','published').maybeSingle();
 if(error)throw new Error('Unable to load post.');if(!p)notFound();
 return <Chrome><main className="app-main app-reading" id="main-content"><a className="app-text-button" href="/important-stuff">← Important Stuff</a><article><div className="app-post-meta">{p.kind} · {prettyDate(p.published_at)}</div><h1>{p.title}</h1><p className="app-lead">{p.excerpt}</p><p className="app-muted">By {p.byline}</p>{p.image_id&&<img className="app-article-cover" src={'/api/media/'+p.image_id} alt=""/>}<div className="app-prose">{p.body}</div>{p.attachment_id&&<a className="app-button secondary" href={'/api/media/'+p.attachment_id}>Download document ↓</a>}</article></main></Chrome>;
}

import {readFile} from 'node:fs/promises';import {join} from 'node:path';import {pageRegistry} from '@/content/pages/registry';import {db,isConfigured} from '@/lib/supabase/server';import {catalogue,fieldsFor} from '@/lib/cms-core';
export const dynamic='force-dynamic';
export async function GET(){
 const original=JSON.parse(await readFile(join(process.cwd(),'public/reference/search.json'),'utf8')) as {title:string;url:string;section:string;text:string}[];
 const rows=[...original.filter(r=>!['/account','/sign-in'].includes(r.url.replace(/\/$/,''))),{title:'Important Stuff',url:'/important-stuff',section:'Student life',text:'announcements rules elections voting'},{title:'Pay dues & receipts',url:'/pay-dues',section:'Finance',text:'guest payment paystack dues receipt no signup'},{title:'Executive access',url:'/staff/sign-in',section:'Administration',text:'executive admin finance academics staff email code'}];
 for(const [path,p] of Object.entries(pageRegistry))if(path.startsWith('/stories/'))rows.push({title:p.title,url:path,section:'Journal',text:p.leaves.filter(l=>l.type==='text').map(l=>l.value).join(' ')});
 if(isConfigured()){
  const c=await db();const [posts,docs,blocks]=await Promise.all([c.from('posts').select('id,title,kind,excerpt').eq('status','published'),c.from('content_documents').select('page_key,fields'),c.from('content_blocks').select('page_key,title,body').eq('enabled',true)]);
  if(posts.error||docs.error||blocks.error)return Response.json({error:'Search is temporarily unavailable.'},{status:503});
  for(const p of posts.data||[])rows.push({title:p.title,url:'/important-stuff/'+p.id,section:p.kind,text:p.excerpt});
  for(const doc of docs.data||[]){const page=catalogue().find(p=>p.key===doc.page_key);if(!page||page.key.startsWith('@'))continue;const values=doc.fields as Record<string,string>;const text=fieldsFor(page.key).filter(f=>f.type==='text').map(f=>typeof values[f.key]==='string'?values[f.key]:f.value).join(' ');for(let i=rows.length-1;i>=0;i--)if((rows[i].url.replace(/\/$/,'')||'/')===page.key)rows.splice(i,1);rows.push({title:page.title,url:page.key,section:page.area,text});}
  for(const b of blocks.data||[]){const row=rows.find(r=>(r.url.replace(/\/$/,'')||'/')===b.page_key);if(row)row.text+=' '+b.title+' '+b.body;}
 }
 return Response.json(rows,{headers:{'Cache-Control':'no-store'}});
}

import 'server-only';
import {unstable_rethrow} from 'next/navigation';
import {db,isConfigured} from './supabase/server';
import {overlay} from './page-data';
import {nativePages,safeUrl} from './cms-core';
export type Block={id:string;page_key:string;title:string;body:string;media_id:string|null;link_url:string;link_label:string;position:number;enabled:boolean;media?:{content_type:string}|null};
export async function documentData(key:string){if(!isConfigured())return {fields:{} as Record<string,string>,revision:0};const {data,error}=await(await db()).from('content_documents').select('fields,revision').eq('page_key',key).maybeSingle();if(error){console.error('[cms] content_documents query error for '+key+':',error.message);throw new Error('Page content could not load.');}return {fields:(data?.fields||{}) as Record<string,string>,revision:data?.revision||0};}
export async function nativeCopy(key:string){const doc=await documentData(key);return {...nativePages[key]?.fields,...doc.fields};}
export async function blocksFor(key:string){if(!isConfigured())return [] as Block[];const {data,error}=await(await db()).from('content_blocks').select('*,media(content_type)').eq('page_key',key).eq('enabled',true).order('position');if(error)throw new Error('Page blocks could not load.');return (data||[]) as Block[];}

/** Typed page content: component defaults overlaid with saved admin edits (links/images validated). */
export async function pageData<T>(key:string,defaults:T):Promise<T>{const fields=await savedFields(key);return overlay(defaults,fields,(v,image)=>safeUrl(v,image));}
/** Public pages must stay up if the CMS database is unreachable: fall back to the built-in copy (the failure is logged).
 *  After a failure the database is skipped for 30s so pages stay fast instead of waiting on timeouts. */
let downUntil=0;
async function guarded<T>(work:()=>Promise<T>,fallback:T):Promise<T>{
 if(Date.now()<downUntil)return fallback;
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{return await Promise.race([work(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('CMS lookup timed out')),3000);})]);}
 catch(e){unstable_rethrow(e);downUntil=Date.now()+30000;console.error('[cms] database unavailable, using built-in content for 30s:',e instanceof Error?e.message:e);return fallback;}
 finally{if(timer)clearTimeout(timer);}
}
export const savedFields=(key:string)=>guarded(async()=>(await documentData(key)).fields,{} as Record<string,string>);
export const blocksSafe=(key:string)=>guarded(()=>blocksFor(key),[] as Block[]);

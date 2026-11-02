import 'server-only';
import {db,isConfigured} from './supabase/server';
import {overlay} from './page-data';
import {nativePages,safeUrl} from './cms-core';
export type Block={id:string;page_key:string;title:string;body:string;media_id:string|null;link_url:string;link_label:string;position:number;enabled:boolean;media?:{content_type:string}|null};
export async function documentData(key:string){if(!isConfigured())return {fields:{} as Record<string,string>,revision:0};const {data,error}=await(await db()).from('content_documents').select('fields,revision').eq('page_key',key).maybeSingle();if(error)throw new Error('Page content could not load.');return {fields:(data?.fields||{}) as Record<string,string>,revision:data?.revision||0};}
export async function nativeCopy(key:string){const doc=await documentData(key);return {...nativePages[key]?.fields,...doc.fields};}
export async function blocksFor(key:string){if(!isConfigured())return [] as Block[];const {data,error}=await(await db()).from('content_blocks').select('*,media(content_type)').eq('page_key',key).eq('enabled',true).order('position');if(error)throw new Error('Page blocks could not load.');return (data||[]) as Block[];}

/** Typed page content: component defaults overlaid with saved admin edits (links/images validated). */
export async function pageData<T>(key:string,defaults:T):Promise<T>{const doc=await documentData(key);return overlay(defaults,doc.fields,(v,image)=>safeUrl(v,image));}

import {contentArea} from './access';
import type {Leaf} from './page-data';
import {pageRegistry} from '@/content/pages/registry';
export type Field=Leaf;
// Pages whose copy is a few flat strings used directly by hand-written components.
export const nativePages:Record<string,{title:string;fields:Record<string,string>}>={
 '/pay-dues':{title:'Pay dues & receipts',fields:{title:'Dues, sorted.',intro:'Choose what you’re paying for, enter your details and pay securely. No account needed.',help:'Keep your reference and receipt access code. Contact the finance team if a payment needs checking.'}},
 '/important-stuff':{title:'Important Stuff',fields:{title:'Important stuff.',intro:'Announcements, the rules and your next student election. Everything worth keeping up with.'}}
};
export function safeUrl(value:string,image=false){
 const s=value.trim();if(s.includes('\\')||/[\u0000-\u001f\u007f]/.test(s))return '';
 if(s.startsWith('/')&&!s.startsWith('//'))return s;
 if(!image&&(s.startsWith('#')||/^(mailto:|tel:)/i.test(s)))return s;
 try{const u=new URL(s);return u.protocol==='https:'?u.href:'';}catch{return '';}
}
export function catalogue(){return [...Object.entries(pageRegistry).map(([key,p])=>({key,title:p.title,area:contentArea(key)})),...Object.entries(nativePages).map(([key,p])=>({key,title:p.title,area:contentArea(key)}))];}
export function fieldsFor(page:string):Field[]{
 if(pageRegistry[page])return pageRegistry[page].leaves;
 if(nativePages[page])return Object.entries(nativePages[page].fields).map(([key,value])=>({key,label:key,group:'Page introduction',type:'text' as const,value}));
 return [];
}
export function validateFields(page:string,values:Record<string,string>){
 const known=new Map(fieldsFor(page).map(f=>[f.key,f]));if(!known.size)throw new Error('Unknown page.');
 for(const [key,value] of Object.entries(values)){const f=known.get(key);if(!f||typeof value!=='string'||value.length>30000)throw new Error('Invalid content field.');if((f.type==='url'||f.type==='image')&&value&&!safeUrl(value,f.type==='image'))throw new Error('Use a site path, HTTPS link or supported contact link.');}
 return values;
}
export const escapeHtml=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

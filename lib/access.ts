export const AREAS=['content','academics','finance','community','elections','settings'] as const;
export type Area=typeof AREAS[number];
export const AREA_LABELS:Record<Area,string>={content:'News, posts & general pages',academics:'Academics & study resources',finance:'Payments & finance',community:'Community & welfare content',elections:'Election administration',settings:'Shared header, footer & navigation'};
export type StaffIdentity={role:string;active:boolean;areas:string[]};
export function canAccess(me:StaffIdentity|null,area:Area){return !!me?.active&&(me.role==='admin'||me.areas.includes(area)||(me.role==='editor'&&area==='content')||(me.role==='election_officer'&&area==='elections'));}
export function isStaff(me:StaffIdentity|null){return !!me?.active&&(me.role==='admin'||AREAS.some(a=>canAccess(me,a)));}
export function contentArea(page:string):Area{return page.startsWith('/academics')||page.startsWith('/resources/')?'academics':page.startsWith('/pay-dues')?'finance':page.startsWith('/communities')||page==='/feedback'?'community':page.startsWith('@')?'settings':'content';}

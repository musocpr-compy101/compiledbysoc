import 'server-only';
import {redirect} from 'next/navigation';import {identity} from './supabase/server';import {canAccess,isStaff,type Area} from './access';
export async function requireStaff(area?:Area){const me=await identity();if(!me)redirect('/staff/sign-in');if(!isStaff(me)||area&&!canAccess(me,area))redirect('/account');return me;}
export async function requireOwner(){const me=await requireStaff();if(me.role!=='admin')redirect('/admin');return me;}

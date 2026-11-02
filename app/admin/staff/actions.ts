'use server';
import {z} from 'zod';import {revalidatePath} from 'next/cache';import {identity,db} from '@/lib/supabase/server';import {serviceDb} from '@/lib/supabase/admin';import {AREAS} from '@/lib/access';
const input=z.object({id:z.string().uuid().optional(),email:z.email().trim().toLowerCase(),name:z.string().trim().min(2).max(100),areas:z.array(z.enum(AREAS)),active:z.boolean(),administrator:z.boolean()});
export async function saveStaff(value:unknown){
 const p=input.safeParse(value);if(!p.success)return {ok:false,message:'Check the email, name and selected areas.'};
 const me=await identity();if(!me?.active||me.role!=='admin')return {ok:false,message:'Administrator access required.'};
 try{const c=await db();const v=p.data;let userId=v.id;
  if(!userId){const {data:existing,error}=await c.rpc('staff_find_email',{p_email:v.email});if(error)throw error;userId=existing||undefined;
   if(!userId){const {data,error}=await serviceDb().auth.admin.createUser({email:v.email,email_confirm:false,user_metadata:{display_name:v.name}});if(error||!data.user)throw error;userId=data.user.id;}
  }
  const {error}=await c.rpc('set_staff_access',{p_user:userId,p_name:v.name,p_areas:v.areas,p_active:v.active,p_admin:v.administrator});if(error)return {ok:false,message:error.message.includes('your own access')?'Another administrator must change your own access.':'Could not assign access. Choose at least one area and try again.'};
  revalidatePath('/admin/staff');return {ok:true,message:'Account saved. They can use their email code at /staff/sign-in. No password or signup form needed.'};
 }catch{return {ok:false,message:'Could not save the account. Check the server credentials and email, then retry.'};}
}

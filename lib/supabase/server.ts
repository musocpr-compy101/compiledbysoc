import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export function isConfigured() { return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY); }
export async function db() {
  if (!isConfigured()) throw new Error('Accounts are not connected yet.');
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: { getAll: () => jar.getAll(), setAll: values => { try { values.forEach(({name,value,options}) => jar.set(name,value,options)); } catch { /* Read-only Server Component. Proxy refreshes cookies. */ } } }
  });
}
export async function identity() {
  if (!isConfigured()) return null;
  const client = await db();
  const {data:{user},error} = await client.auth.getUser();
  if (error || !user) return null;
  const {data:profile} = await client.from('profiles').select('role,display_name,active').eq('id',user.id).maybeSingle();
  const {data:access}=await client.from('staff_access').select('area').eq('user_id',user.id);
  return { active:profile?.active!==false,areas:(access||[]).map(a=>a.area as string), user, role: (profile?.role || 'student') as string, name: profile?.display_name || user.email };
}

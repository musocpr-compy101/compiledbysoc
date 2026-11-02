'use server';
import {db} from '@/lib/supabase/server';import {redirect} from 'next/navigation';
export async function signOut(){await(await db()).auth.signOut();redirect('/');}

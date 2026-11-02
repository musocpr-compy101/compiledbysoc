import {Chrome} from '@/components/Chrome';import {SignIn} from '@/components/SignIn';import {isConfigured} from '@/lib/supabase/server';
export default function Page(){return <Chrome><main id="main-content" className="app-main app-narrow"><SignIn configured={isConfigured()} staff/></main></Chrome>;}

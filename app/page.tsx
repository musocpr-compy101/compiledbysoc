import {PageFrame} from '@/components/PageFrame';
import {ContentBlocks} from '@/components/ContentBlocks';
import {HomeView} from '@/components/pages/HomeView';
import {homeDefaults} from '@/content/pages/home';
import {pageCopy} from '@/lib/page-copy';
export const dynamic='force-dynamic';
export const metadata={title:{absolute:"Compiled By SOC — The School of Computing Journal"}};
export default async function Page(){
 const t=await pageCopy("/",homeDefaults);
 return <PageFrame route="/" hero bodyClass="" skip={{href:"#student-desk",label:"Skip to the student desk"}}><HomeView t={t}><ContentBlocks page="/" wrap/></HomeView></PageFrame>;
}

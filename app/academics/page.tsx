import {PageFrame} from '@/components/PageFrame';
import {ContentBlocks} from '@/components/ContentBlocks';
import {AcademicsView} from '@/components/pages/AcademicsView';
import {academicsDefaults} from '@/content/pages/academics';
import {pageCopy} from '@/lib/page-copy';
export const dynamic='force-dynamic';
export const metadata={title:{absolute:"Academics — Compiled By SOC"}};
export default async function Page(){
 const t=await pageCopy("/academics",academicsDefaults);
 return <PageFrame route="/academics"><AcademicsView t={t}><ContentBlocks page="/academics" wrap/></AcademicsView></PageFrame>;
}

import {PageFrame} from '@/components/PageFrame';
import {ContentBlocks} from '@/components/ContentBlocks';
import {CommunitiesView} from '@/components/pages/CommunitiesView';
import {communitiesDefaults} from '@/content/pages/communities';
import {pageCopy} from '@/lib/page-copy';
export const dynamic='force-dynamic';
export const metadata={title:{absolute:"Communities — Compiled By SOC"}};
export default async function Page(){
 const t=await pageCopy("/communities",communitiesDefaults);
 return <PageFrame route="/communities"><CommunitiesView t={t}><ContentBlocks page="/communities" wrap/></CommunitiesView></PageFrame>;
}

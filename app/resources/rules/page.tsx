import {PageFrame} from '@/components/PageFrame';
import {ContentBlocks} from '@/components/ContentBlocks';
import {ResourcesRulesView} from '@/components/pages/ResourcesRulesView';
import {resources_rulesDefaults} from '@/content/pages/resources-rules';
import {pageCopy} from '@/lib/page-copy';
export const dynamic='force-dynamic';
export const metadata={title:{absolute:"Rules & Regulations — Compiled By SOC"}};
export default async function Page(){
 const t=await pageCopy("/resources/rules",resources_rulesDefaults);
 return <PageFrame route="/resources/rules"><ResourcesRulesView t={t}><ContentBlocks page="/resources/rules" wrap/></ResourcesRulesView></PageFrame>;
}

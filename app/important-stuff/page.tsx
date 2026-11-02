import {nativeCopy} from '@/lib/cms';
import {ContentBlocks} from '@/components/ContentBlocks';
import {Chrome} from '@/components/Chrome';
import {ImportantHub} from '@/components/ImportantHub';
import {importantData} from '@/lib/data';
export const dynamic='force-dynamic';
export const metadata={title:'Important Stuff'};
export default async function ImportantPage(){return <Chrome><main className="app-main" id="main-content"><ImportantHub {...await importantData()} copy={await nativeCopy('/important-stuff')}/><ContentBlocks page="/important-stuff"/></main></Chrome>;}

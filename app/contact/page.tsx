import { PageFrame } from '@/components/PageFrame';
import { ContentBlocks } from '@/components/ContentBlocks';
import { ContactView } from '@/components/pages/ContactView';
import { contactDefaults } from '@/content/pages/contact';
import { pageCopy } from '@/lib/page-copy';
export const dynamic = 'force-dynamic';
export const metadata = { title: { absolute: 'Contact — Compiled By SOC' } };
export default async function Page() {
  const t = await pageCopy('/contact', contactDefaults);
  return (
    <PageFrame route="/contact">
      <ContactView t={t}>
        <ContentBlocks page="/contact" wrap />
      </ContactView>
    </PageFrame>
  );
}

import { PageFrame } from '@/components/PageFrame';
import { ContentBlocks } from '@/components/ContentBlocks';
import { About } from '@/components/about/About';
import { aboutDefaults } from '@/content/pages/about';
import { pageData } from '@/lib/cms';
export const dynamic = 'force-dynamic';
export const metadata = { title: { absolute: 'About SOC — Compiled By SOC' } };
export default async function AboutPage() {
  const content = await pageData('/about', aboutDefaults);
  return (
    <PageFrame route="/about">
      <About c={content}>
        <ContentBlocks page="/about" wrap />
      </About>
    </PageFrame>
  );
}

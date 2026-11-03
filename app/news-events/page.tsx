import { PageFrame } from '@/components/PageFrame';
import { ContentBlocks } from '@/components/ContentBlocks';
import { NewsEventsView } from '@/components/pages/NewsEventsView';
import { news_eventsDefaults } from '@/content/pages/news-events';
import { pageCopy } from '@/lib/page-copy';
export const dynamic = 'force-dynamic';
export const metadata = { title: { absolute: 'News & Events — Compiled By SOC' } };
export default async function Page() {
  const t = await pageCopy('/news-events', news_eventsDefaults);
  return (
    <PageFrame route="/news-events">
      <NewsEventsView t={t}>
        <ContentBlocks page="/news-events" wrap />
      </NewsEventsView>
    </PageFrame>
  );
}

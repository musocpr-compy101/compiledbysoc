import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/PageFrame';
import { ContentBlocks } from '@/components/ContentBlocks';
import { pageTitles } from '@/content/pages/titles';
import { pageCopy } from '@/lib/page-copy';
import { ArticleView } from '@/components/pages/ArticleView';
import { articlesDefaults } from '@/content/pages/articles';
import { EventView } from '@/components/pages/EventView';
import { eventsDefaults } from '@/content/pages/events';
import { ReferenceView } from '@/components/pages/ReferenceView';
import { referencesDefaults } from '@/content/pages/references';
export const dynamic = 'force-dynamic';
// One route for every news article, event and reference page; each shares a template component.
const pages: Record<string, { View: typeof ArticleView; defaults: Record<string, string> }> = {
  a1: { View: ArticleView, defaults: articlesDefaults['/news-events/a1'] },
  a2: { View: ArticleView, defaults: articlesDefaults['/news-events/a2'] },
  a3: { View: ArticleView, defaults: articlesDefaults['/news-events/a3'] },
  a4: { View: ArticleView, defaults: articlesDefaults['/news-events/a4'] },
  a5: { View: ArticleView, defaults: articlesDefaults['/news-events/a5'] },
  feat: { View: ArticleView, defaults: articlesDefaults['/news-events/feat'] },
  g1: { View: ArticleView, defaults: articlesDefaults['/news-events/g1'] },
  g2: { View: ArticleView, defaults: articlesDefaults['/news-events/g2'] },
  g3: { View: ArticleView, defaults: articlesDefaults['/news-events/g3'] },
  ev1: { View: EventView, defaults: eventsDefaults['/news-events/ev1'] },
  ev2: { View: EventView, defaults: eventsDefaults['/news-events/ev2'] },
  ev3: { View: EventView, defaults: eventsDefaults['/news-events/ev3'] },
  ev4: { View: EventView, defaults: eventsDefaults['/news-events/ev4'] },
  'reference-10': {
    View: ReferenceView,
    defaults: referencesDefaults['/news-events/reference-10'],
  },
  'reference-11': {
    View: ReferenceView,
    defaults: referencesDefaults['/news-events/reference-11'],
  },
  'reference-4': { View: ReferenceView, defaults: referencesDefaults['/news-events/reference-4'] },
  'reference-5': { View: ReferenceView, defaults: referencesDefaults['/news-events/reference-5'] },
  'reference-6': { View: ReferenceView, defaults: referencesDefaults['/news-events/reference-6'] },
  'reference-7': { View: ReferenceView, defaults: referencesDefaults['/news-events/reference-7'] },
  'reference-8': { View: ReferenceView, defaults: referencesDefaults['/news-events/reference-8'] },
  'reference-9': { View: ReferenceView, defaults: referencesDefaults['/news-events/reference-9'] },
};
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: { absolute: pageTitles['/news-events/' + slug] || 'Page not found' } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = pages[slug];
  if (!entry) notFound();
  const route = '/news-events/' + slug;
  const t = await pageCopy(route, entry.defaults);
  const { View } = entry;
  return (
    <PageFrame route={route}>
      <View t={t}>
        <ContentBlocks page={route} wrap />
      </View>
    </PageFrame>
  );
}

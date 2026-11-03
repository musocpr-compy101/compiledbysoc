import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/PageFrame';
import { ContentBlocks } from '@/components/ContentBlocks';
import { pageTitles } from '@/content/pages/titles';
import { pageCopy } from '@/lib/page-copy';
import { StoriesBugInTheBriefView } from '@/components/pages/StoriesBugInTheBriefView';
import { stories_bug_in_the_briefDefaults } from '@/content/pages/stories-bug-in-the-brief';
import { StoriesFirstPullRequestView } from '@/components/pages/StoriesFirstPullRequestView';
import { stories_first_pull_requestDefaults } from '@/content/pages/stories-first-pull-request';
import { StoriesSecurityIsAHabitView } from '@/components/pages/StoriesSecurityIsAHabitView';
import { stories_security_is_a_habitDefaults } from '@/content/pages/stories-security-is-a-habit';
import { StoriesStartBeforeReadyView } from '@/components/pages/StoriesStartBeforeReadyView';
import { stories_start_before_readyDefaults } from '@/content/pages/stories-start-before-ready';
export const dynamic = 'force-dynamic';
const stories: Record<
  string,
  { View: typeof StoriesBugInTheBriefView; defaults: Record<string, string> }
> = {
  'bug-in-the-brief': {
    View: StoriesBugInTheBriefView,
    defaults: stories_bug_in_the_briefDefaults,
  },
  'first-pull-request': {
    View: StoriesFirstPullRequestView,
    defaults: stories_first_pull_requestDefaults,
  },
  'security-is-a-habit': {
    View: StoriesSecurityIsAHabitView,
    defaults: stories_security_is_a_habitDefaults,
  },
  'start-before-ready': {
    View: StoriesStartBeforeReadyView,
    defaults: stories_start_before_readyDefaults,
  },
};
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: { absolute: pageTitles['/stories/' + slug] || 'Page not found' } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = stories[slug];
  if (!entry) notFound();
  const route = '/stories/' + slug;
  const t = await pageCopy(route, entry.defaults);
  const { View } = entry;
  return (
    <PageFrame route={route} bodyClass="" skip={{ href: '#article', label: 'Skip to article' }}>
      <View t={t}>
        <ContentBlocks page={route} wrap />
      </View>
    </PageFrame>
  );
}

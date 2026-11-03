import { PageFrame } from '@/components/PageFrame';
import { ContentBlocks } from '@/components/ContentBlocks';
import { FeedbackView } from '@/components/pages/FeedbackView';
import { feedbackDefaults } from '@/content/pages/feedback';
import { pageCopy } from '@/lib/page-copy';
export const dynamic = 'force-dynamic';
export const metadata = { title: { absolute: 'Feedback & welfare — Compiled By SOC' } };
export default async function Page() {
  const t = await pageCopy('/feedback', feedbackDefaults);
  return (
    <PageFrame route="/feedback">
      <FeedbackView t={t}>
        <ContentBlocks page="/feedback" wrap />
      </FeedbackView>
    </PageFrame>
  );
}

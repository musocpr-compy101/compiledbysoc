import type { T } from '@/lib/page-copy';
export function ReferenceView({ t, children }: { t: T; children?: React.ReactNode }) {
  return (
    <main id="main-content">
      <article className="reference-article">
        <a className="article-back" href={t('reference-article.article-back.href')}>
          {t('reference-article.article-back.text')}
        </a>
        <div className="reference-article-meta">
          {t('reference-article.reference-article-meta.text')}
        </div>
        <h1>{t('reference-article.h1.text')}</h1>
        <p className="article-source-note">{t('reference-article.article-source-note.text')}</p>
        <div className="article-body">
          <p>{t('reference-article.article-body.p.text')}</p>
        </div>
        <div className="article-share">
          <span>{t('reference-article.article-share.span-1.text')}</span>
          <button type="button" data-share-link="">
            {t('reference-article.article-share.button.text')}
          </button>
          <a href={t('reference-article.article-share.a.href')}>
            {t('reference-article.article-share.a.text')}
          </a>
          <span role="status" data-share-status="" />
        </div>
      </article>
      <aside className="t-ad" data-ad-slot="7" aria-label={t('t-ad.aria-label')}>
        <span className="t-tag">{t('t-ad.t-tag.text')}</span>
        <strong>{t('t-ad.strong.text')}</strong>
        <a href={t('t-ad.a.href')}>{t('t-ad.a.text')}</a>
      </aside>
      {children}
    </main>
  );
}

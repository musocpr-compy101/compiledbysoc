import type { T } from '@/lib/page-copy';
export function NewsEventsView({ t, children }: { t: T; children?: React.ReactNode }) {
  return (
    <main id="main-content">
      <div className="reference-surface reference-news-events">
        <header className="editorial-masthead type-only">
          <div className="masthead-copy">
            <h1>
              {t('reference-surface.editorial-masthead.masthead-copy.h1.text')}
              <br />
              <em>{t('editorial-masthead.masthead-copy.h1.em.text')}</em>
            </h1>
            <p className="masthead-deck">
              {t('reference-surface.editorial-masthead.masthead-copy.masthead-deck.text')}
            </p>
          </div>
          <div className="masthead-note">
            <span>{t('reference-surface.editorial-masthead.masthead-note.span.text')}</span>
            <p>
              {t('reference-surface.editorial-masthead.masthead-note.p.text')}
              <br />
              {t('reference-surface.editorial-masthead.masthead-note.p.text-2')}
            </p>
          </div>
        </header>
        <EditorialBody t={t} />
        <div className="newsletter">
          <div className="nl-text">
            <div className="nl-title">
              {t('reference-surface.newsletter.nl-text.nl-title.text')}
            </div>
            <div className="nl-sub">{t('reference-surface.newsletter.nl-text.nl-sub.text')}</div>
          </div>
          <form className="nl-form" data-newsletter-form="" method="post" action="/api/legacy-form">
            <input
              className="nl-input"
              placeholder={t('reference-surface.newsletter.nl-form.nl-input.placeholder')}
              type="email"
              name="email"
              required
              aria-label={t('reference-surface.newsletter.nl-form.nl-input.aria-label')}
            />
            <button className="nl-btn" type="submit">
              {t('reference-surface.newsletter.nl-form.nl-btn.text')}
            </button>
            <p className="newsletter-hint">
              {t('reference-surface.newsletter.nl-form.newsletter-hint.text')}
            </p>
          </form>
        </div>
      </div>
      {children}
    </main>
  );
}

function Pill({ t, i }: { t: T; i: number }) {
  return (
    <button
      className="pill"
      data-news-filter={t(`tab-content-1.filter-bar.filter-pills.pill-2.${i}.data-news-filter~`)}
      type="button"
    >
      {t(`tab-content-1.filter-bar.filter-pills.pill-2.${i}.text`)}
    </button>
  );
}

function SidebarItem({ t, i }: { t: T; i: number }) {
  return (
    <a
      className="sidebar-item soc-brief"
      data-cat={t(`news-layout.div.sidebar.sidebar-item-1.${i}.data-cat~`)}
      href={t(`news-layout.div.sidebar.sidebar-item-1.${i}.href`)}
      data-news-id={t(`news-layout.div.sidebar.sidebar-item-1.${i}.data-news-id~`)}
      data-news-item=""
    >
      <span
        className="soc-brief-date"
        aria-label={t(`news-layout.div.sidebar.sidebar-item-1.${i}.soc-brief-date.aria-label`)}
      >
        <span>{t(`news-layout.div.sidebar.sidebar-item-1.${i}.soc-brief-date.span-1.text`)}</span>
        <span>{t(`news-layout.div.sidebar.sidebar-item-1.${i}.soc-brief-date.span-2.text`)}</span>
      </span>
      <div className="soc-brief-copy">
        <h3 className="sb-title">
          {t(`news-layout.div.sidebar.sidebar-item-1.${i}.soc-brief-copy.sb-title.text`)}
        </h3>
        <span className="sb-cat">
          {t(`news-layout.div.sidebar.sidebar-item-1.${i}.soc-brief-copy.sb-cat.text`)}
        </span>
      </div>
    </a>
  );
}

function NewsCard({ t, i }: { t: T; i: number }) {
  return (
    <a
      className="news-card soc-post"
      data-cat={t(`tab-content-1.news-grid-section.news-grid.news-card-1.${i}.data-cat~`)}
      href={t(`tab-content-1.news-grid-section.news-grid.news-card-1.${i}.href`)}
      data-news-id={t(`tab-content-1.news-grid-section.news-grid.news-card-1.${i}.data-news-id~`)}
      data-news-item=""
      data-news-page-item=""
    >
      <div className="soc-post-cover">
        <span className="soc-cover-mark" aria-hidden="true">
          {t(
            `tab-content-1.news-grid-section.news-grid.news-card-1.${i}.soc-post-cover.soc-cover-mark.text`,
          )}
        </span>
        <div className="soc-cover-meta">
          <span className="soc-post-category">
            {t(
              `tab-content-1.news-grid-section.news-grid.news-card-1.${i}.soc-post-cover.soc-cover-meta.soc-post-category.text`,
            )}
          </span>
          <span className="soc-cover-date">
            {t(
              `tab-content-1.news-grid-section.news-grid.news-card-1.${i}.soc-post-cover.soc-cover-meta.soc-cover-date.text`,
            )}
          </span>
        </div>
      </div>
      <div className="soc-post-body nc-body">
        <h3 className="soc-post-title nc-title">
          {t(
            `tab-content-1.news-grid-section.news-grid.news-card-1.${i}.soc-post-body.soc-post-title.text`,
          )}
        </h3>
        <p className="soc-post-excerpt nc-excerpt">
          {t(
            `tab-content-1.news-grid-section.news-grid.news-card-1.${i}.soc-post-body.soc-post-excerpt.text`,
          )}
        </p>
        <div className="soc-post-footer">
          <span className="soc-post-author">
            {t(
              `tab-content-1.news-grid-section.news-grid.news-card-1.${i}.soc-post-body.soc-post-footer.soc-post-author.text`,
            )}
          </span>
          <span className="soc-post-read">
            {t(
              `tab-content-1.news-grid-section.news-grid.news-card-1.${i}.soc-post-body.soc-post-footer.soc-post-read.text`,
            )}
            <span aria-hidden="true">
              {t(
                `tab-content-1.news-grid-section.news-grid.news-card-1.${i}.soc-post-body.soc-post-footer.soc-post-read.span.text`,
              )}
            </span>
          </span>
        </div>
      </div>
    </a>
  );
}

function NewsCard2({ t, i }: { t: T; i: number }) {
  return (
    <a
      className="news-card soc-post"
      href={t(`tab-content-1.news-grid-section.news-grid.news-card-6.${i}.href`)}
      data-news-item=""
      data-news-page-item=""
      data-cat={t(`tab-content-1.news-grid-section.news-grid.news-card-6.${i}.data-cat~`)}
    >
      <div className="soc-post-cover">
        <span className="soc-cover-mark" aria-hidden="true">
          {t(
            `tab-content-1.news-grid-section.news-grid.news-card-6.${i}.soc-post-cover.soc-cover-mark.text`,
          )}
        </span>
        <div className="soc-cover-meta">
          <span className="soc-post-category">
            {t(
              `tab-content-1.news-grid-section.news-grid.news-card-6.${i}.soc-post-cover.soc-cover-meta.soc-post-category.text`,
            )}
          </span>
          <span className="soc-cover-date">
            {t(
              `tab-content-1.news-grid-section.news-grid.news-card-6.${i}.soc-post-cover.soc-cover-meta.soc-cover-date.text`,
            )}
          </span>
        </div>
      </div>
      <div className="soc-post-body nc-body">
        <h3 className="soc-post-title nc-title">
          {t(
            `tab-content-1.news-grid-section.news-grid.news-card-6.${i}.soc-post-body.soc-post-title.text`,
          )}
        </h3>
        <p className="soc-post-excerpt nc-excerpt">
          {t(
            `tab-content-1.news-grid-section.news-grid.news-card-6.${i}.soc-post-body.soc-post-excerpt.text`,
          )}
        </p>
        <div className="soc-post-footer">
          <span className="soc-post-author">
            {t(
              `tab-content-1.news-grid-section.news-grid.news-card-6.${i}.soc-post-body.soc-post-footer.soc-post-author.text`,
            )}
          </span>
          <span className="soc-post-read">
            {t(
              `tab-content-1.news-grid-section.news-grid.news-card-6.${i}.soc-post-body.soc-post-footer.soc-post-read.text`,
            )}
            <span aria-hidden="true">
              {t(
                `tab-content-1.news-grid-section.news-grid.news-card-6.${i}.soc-post-body.soc-post-footer.soc-post-read.span.text`,
              )}
            </span>
          </span>
        </div>
      </div>
    </a>
  );
}

function EventMetaItem({ t, i }: { t: T; i: number }) {
  return (
    <span className="event-meta-item">
      <span className="event-meta-icon" aria-hidden="true">
        {t(`event-feat-1.event-body.event-meta-row.event-meta-item-1.${i}.event-meta-icon.text`)}
      </span>
      {t(`event-feat-1.event-body.event-meta-row.event-meta-item-1.${i}.text`)}
    </span>
  );
}

function EventMetaItem2({ t, i }: { t: T; i: number }) {
  return (
    <span className="event-meta-item">
      <span className="event-meta-icon" aria-hidden="true">
        {t(`event-feat-2.event-body.event-meta-row.event-meta-item-1.${i}.event-meta-icon.text`)}
      </span>
      {t(`event-feat-2.event-body.event-meta-row.event-meta-item-1.${i}.text`)}
    </span>
  );
}

function EventMetaItem3({ t, i }: { t: T; i: number }) {
  return (
    <span className="event-meta-item">
      <span className="event-meta-icon" aria-hidden="true">
        {t(`event-feat-3.event-body.event-meta-row.event-meta-item-1.${i}.event-meta-icon.text`)}
      </span>
      {t(`event-feat-3.event-body.event-meta-row.event-meta-item-1.${i}.text`)}
    </span>
  );
}

function EventMetaItem4({ t, i }: { t: T; i: number }) {
  return (
    <span className="event-meta-item">
      <span className="event-meta-icon" aria-hidden="true">
        {t(`event-feat-4.event-body.event-meta-row.event-meta-item-1.${i}.event-meta-icon.text`)}
      </span>
      {t(`event-feat-4.event-body.event-meta-row.event-meta-item-1.${i}.text`)}
    </span>
  );
}

function PastCard({ t, i }: { t: T; i: number }) {
  return (
    <div className="past-card">
      <div className="past-date">
        {t(`events-layout.past-events.past-grid.past-card-1.${i}.past-date.text`)}
      </div>
      <div className="past-title">
        {t(`events-layout.past-events.past-grid.past-card-1.${i}.past-title.text`)}
      </div>
      <div className="past-badge">
        {t(`events-layout.past-events.past-grid.past-card-1.${i}.past-badge.text`)}
      </div>
    </div>
  );
}

function TPaper({ t, i }: { t: T; i: number }) {
  return (
    <article className="t-paper">
      <span className="t-tag">
        {t(`tab-content-3.section.t-grid-two.t-paper-1.${i}.t-tag.text`)}
      </span>
      <h3>{t(`tab-content-3.section.t-grid-two.t-paper-1.${i}.h3.text`)}</h3>
      <p>{t(`tab-content-3.section.t-grid-two.t-paper-1.${i}.p.text`)}</p>
      <span className="t-meta">
        {t(`tab-content-3.section.t-grid-two.t-paper-1.${i}.t-meta.text`)}
      </span>
    </article>
  );
}

function EditorialBody({ t }: { t: T }) {
  return (
    <div className="editorial-body">
      <aside
        className="section-index"
        aria-label={t('reference-surface.editorial-body.section-index.aria-label')}
      >
        <div className="desktop-index-intro">
          <h2>{t('editorial-body.section-index.desktop-index-intro.h2.text')}</h2>
          <p>{t('editorial-body.section-index.desktop-index-intro.p.text')}</p>
        </div>
        <p className="section-index-label">
          {t('reference-surface.editorial-body.section-index.section-index-label.text')}
        </p>
        <div className="main-tabs">
          <button
            className="main-tab active"
            id="tab-news-btn"
            data-tab-target="tab-news"
            data-tab-group="main"
            type="button"
            data-section-label={t(
              'editorial-body.section-index.main-tabs.main-tab-1.data-section-label',
            )}
          >
            {t('editorial-body.section-index.main-tabs.main-tab-1.text')}
            <span className="tab-count">
              {t('section-index.main-tabs.main-tab-1.tab-count.text')}
            </span>
            <span className="desktop-index-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z" />
              </svg>
            </span>
            <span className="desktop-index-description" aria-hidden="true">
              {t('section-index.main-tabs.main-tab-1.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="main-tab"
            id="tab-events-btn"
            data-tab-target="tab-events"
            data-tab-group="main"
            type="button"
            data-section-label={t(
              'editorial-body.section-index.main-tabs.main-tab-2.data-section-label',
            )}
          >
            {t('editorial-body.section-index.main-tabs.main-tab-2.text')}
            <span className="tab-count">
              {t('section-index.main-tabs.main-tab-2.tab-count.text')}
            </span>
            <span className="desktop-index-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M7 3v4M17 3v4M3 11h18M7 15h3M14 15h3" />
              </svg>
            </span>
            <span className="desktop-index-description" aria-hidden="true">
              {t('section-index.main-tabs.main-tab-2.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="main-tab"
            type="button"
            data-tab-group="main"
            data-tab-target="tab-opportunities"
            data-section-label={t(
              'editorial-body.section-index.main-tabs.main-tab-3.data-section-label',
            )}
          >
            {t('editorial-body.section-index.main-tabs.main-tab-3.text')}
            <span className="desktop-index-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 21V3h14l-3 5 3 5H5" />
              </svg>
            </span>
            <span className="desktop-index-description" aria-hidden="true">
              {t('section-index.main-tabs.main-tab-3.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="main-tab"
            type="button"
            data-tab-group="main"
            data-tab-target="tab-polls"
            data-section-label={t(
              'editorial-body.section-index.main-tabs.main-tab-4.data-section-label',
            )}
          >
            {t('editorial-body.section-index.main-tabs.main-tab-4.text')}
            <span className="desktop-index-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>
            <span className="desktop-index-description" aria-hidden="true">
              {t('section-index.main-tabs.main-tab-4.desktop-index-description.text')}
            </span>
          </button>
        </div>
      </aside>
      <div className="section-panels">
        <div className="tab-content active" id="tab-news">
          <div className="filter-bar">
            <div className="filter-pills">
              <button className="pill active" data-news-filter="all" type="button">
                {t('tab-content-1.filter-bar.filter-pills.pill-1.text')}
              </button>
              {Array.from({ length: 4 }, (_, i) => (
                <Pill key={i} t={t} i={i} />
              ))}
            </div>
            <input
              className="search-news"
              placeholder={t('section-panels.tab-content-1.filter-bar.search-news.placeholder')}
              type="search"
              data-news-search=""
              aria-label={t('section-panels.tab-content-1.filter-bar.search-news.aria-label')}
            />
          </div>
          <p className="news-status" data-news-status="" role="status">
            {t('editorial-body.section-panels.tab-content-1.news-status.text')}
          </p>
          <div className="news-layout">
            <a
              className="feat-post soc-post"
              data-cat="news"
              href={t('section-panels.tab-content-1.news-layout.feat-post.href')}
              data-news-id="feat"
              data-news-item=""
            >
              <div className="soc-post-cover has-image">
                <img
                  src={t('news-layout.feat-post.soc-post-cover.img.src')}
                  alt={t('news-layout.feat-post.soc-post-cover.img.alt')}
                  width="1200"
                  height="675"
                  loading="lazy"
                  decoding="async"
                />
                <div className="soc-cover-meta">
                  <span className="soc-post-category">
                    {t('feat-post.soc-post-cover.soc-cover-meta.soc-post-category.text')}
                  </span>
                  <span className="soc-cover-date">
                    {t('feat-post.soc-post-cover.soc-cover-meta.soc-cover-date.text')}
                  </span>
                </div>
              </div>
              <div className="soc-post-body feat-body">
                <h3 className="soc-post-title feat-title">
                  {t('news-layout.feat-post.soc-post-body.soc-post-title.text')}
                </h3>
                <p className="soc-post-excerpt feat-excerpt">
                  {t('news-layout.feat-post.soc-post-body.soc-post-excerpt.text')}
                </p>
                <div className="soc-post-footer">
                  <span className="soc-post-author">
                    {t('feat-post.soc-post-body.soc-post-footer.soc-post-author.text')}
                  </span>
                  <span className="soc-post-read">
                    {t('feat-post.soc-post-body.soc-post-footer.soc-post-read.text')}
                    <span aria-hidden="true">
                      {t('soc-post-body.soc-post-footer.soc-post-read.span.text')}
                    </span>
                  </span>
                </div>
              </div>
            </a>
            <div>
              <h2 className="sidebar-title">
                {t('tab-content-1.news-layout.div.sidebar-title.text')}
              </h2>
              <div className="sidebar">
                {Array.from({ length: 5 }, (_, i) => (
                  <SidebarItem key={i} t={t} i={i} />
                ))}
              </div>
            </div>
          </div>
          <div className="news-grid-section">
            <h2 className="grid-title">
              {t('section-panels.tab-content-1.news-grid-section.grid-title.text')}
            </h2>
            <div className="news-grid" id="newsGrid">
              {Array.from({ length: 3 }, (_, i) => (
                <NewsCard key={i} t={t} i={i} />
              ))}
              <a
                className="news-card soc-post"
                href={t('tab-content-1.news-grid-section.news-grid.news-card-4.href')}
                data-news-item=""
                data-news-page-item=""
                data-cat="event"
              >
                <div className="soc-post-cover has-image">
                  <img
                    src={t('news-grid.news-card-4.soc-post-cover.img.src')}
                    alt={t('news-grid.news-card-4.soc-post-cover.img.alt')}
                    width="1200"
                    height="675"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="soc-cover-meta">
                    <span className="soc-post-category">
                      {t('news-card-4.soc-post-cover.soc-cover-meta.soc-post-category.text')}
                    </span>
                    <span className="soc-cover-date">
                      {t('news-card-4.soc-post-cover.soc-cover-meta.soc-cover-date.text')}
                    </span>
                  </div>
                </div>
                <div className="soc-post-body nc-body">
                  <h3 className="soc-post-title nc-title">
                    {t('news-grid.news-card-4.soc-post-body.soc-post-title.text')}
                  </h3>
                  <p className="soc-post-excerpt nc-excerpt">
                    {t('news-grid.news-card-4.soc-post-body.soc-post-excerpt.text')}
                  </p>
                  <div className="soc-post-footer">
                    <span className="soc-post-author">
                      {t('news-card-4.soc-post-body.soc-post-footer.soc-post-author.text')}
                    </span>
                    <span className="soc-post-read">
                      {t('news-card-4.soc-post-body.soc-post-footer.soc-post-read.text')}
                      <span aria-hidden="true">
                        {t('soc-post-body.soc-post-footer.soc-post-read.span.text#2')}
                      </span>
                    </span>
                  </div>
                </div>
              </a>
              <a
                className="news-card soc-post"
                href={t('tab-content-1.news-grid-section.news-grid.news-card-5.href')}
                data-news-item=""
                data-news-page-item=""
                data-cat="news"
              >
                <div className="soc-post-cover">
                  <span className="soc-cover-mark" aria-hidden="true">
                    {t('news-grid.news-card-5.soc-post-cover.soc-cover-mark.text')}
                  </span>
                  <div className="soc-cover-meta">
                    <span className="soc-post-category">
                      {t('news-card-5.soc-post-cover.soc-cover-meta.soc-post-category.text')}
                    </span>
                    <span className="soc-cover-date">
                      {t('news-card-5.soc-post-cover.soc-cover-meta.soc-cover-date.text')}
                    </span>
                  </div>
                </div>
                <div className="soc-post-body nc-body">
                  <h3 className="soc-post-title nc-title">
                    {t('news-grid.news-card-5.soc-post-body.soc-post-title.text')}
                  </h3>
                  <p className="soc-post-excerpt nc-excerpt">
                    {t('news-grid.news-card-5.soc-post-body.soc-post-excerpt.text')}
                  </p>
                  <div className="soc-post-footer">
                    <span className="soc-post-author">
                      {t('news-card-5.soc-post-body.soc-post-footer.soc-post-author.text')}
                    </span>
                    <span className="soc-post-read">
                      {t('news-card-5.soc-post-body.soc-post-footer.soc-post-read.text')}
                      <span aria-hidden="true">
                        {t('soc-post-body.soc-post-footer.soc-post-read.span.text#3')}
                      </span>
                    </span>
                  </div>
                </div>
              </a>
              <aside
                className="t-ad"
                data-ad-slot="3"
                aria-label={t('tab-content-1.news-grid-section.news-grid.t-ad.aria-label')}
              >
                <span className="t-tag">{t('news-grid-section.news-grid.t-ad.t-tag.text')}</span>
                <strong>{t('news-grid-section.news-grid.t-ad.strong.text')}</strong>
                <a href={t('news-grid-section.news-grid.t-ad.a.href')}>
                  {t('news-grid-section.news-grid.t-ad.a.text')}
                </a>
              </aside>
              {Array.from({ length: 3 }, (_, i) => (
                <NewsCard2 key={i} t={t} i={i} />
              ))}
              <a
                className="news-card soc-post"
                href={t('tab-content-1.news-grid-section.news-grid.news-card-9.href')}
                data-news-item=""
                data-news-page-item=""
                data-cat="event"
              >
                <div className="soc-post-cover has-image">
                  <img
                    src={t('news-grid.news-card-9.soc-post-cover.img.src')}
                    alt={t('news-grid.news-card-9.soc-post-cover.img.alt')}
                    width="1200"
                    height="675"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="soc-cover-meta">
                    <span className="soc-post-category">
                      {t('news-card-9.soc-post-cover.soc-cover-meta.soc-post-category.text')}
                    </span>
                    <span className="soc-cover-date">
                      {t('news-card-9.soc-post-cover.soc-cover-meta.soc-cover-date.text')}
                    </span>
                  </div>
                </div>
                <div className="soc-post-body nc-body">
                  <h3 className="soc-post-title nc-title">
                    {t('news-grid.news-card-9.soc-post-body.soc-post-title.text')}
                  </h3>
                  <p className="soc-post-excerpt nc-excerpt">
                    {t('news-grid.news-card-9.soc-post-body.soc-post-excerpt.text')}
                  </p>
                  <div className="soc-post-footer">
                    <span className="soc-post-author">
                      {t('news-card-9.soc-post-body.soc-post-footer.soc-post-author.text')}
                    </span>
                    <span className="soc-post-read">
                      {t('news-card-9.soc-post-body.soc-post-footer.soc-post-read.text')}
                      <span aria-hidden="true">
                        {t('soc-post-body.soc-post-footer.soc-post-read.span.text#4')}
                      </span>
                    </span>
                  </div>
                </div>
              </a>
              <a
                className="news-card soc-post"
                href={t('tab-content-1.news-grid-section.news-grid.news-card-10.href')}
                data-news-item=""
                data-news-page-item=""
                data-cat="announcement"
              >
                <div className="soc-post-cover">
                  <span className="soc-cover-mark" aria-hidden="true">
                    {t('news-grid.news-card-10.soc-post-cover.soc-cover-mark.text')}
                  </span>
                  <div className="soc-cover-meta">
                    <span className="soc-post-category">
                      {t('news-card-10.soc-post-cover.soc-cover-meta.soc-post-category.text')}
                    </span>
                    <span className="soc-cover-date">
                      {t('news-card-10.soc-post-cover.soc-cover-meta.soc-cover-date.text')}
                    </span>
                  </div>
                </div>
                <div className="soc-post-body nc-body">
                  <h3 className="soc-post-title nc-title">
                    {t('news-grid.news-card-10.soc-post-body.soc-post-title.text')}
                  </h3>
                  <p className="soc-post-excerpt nc-excerpt">
                    {t('news-grid.news-card-10.soc-post-body.soc-post-excerpt.text')}
                  </p>
                  <div className="soc-post-footer">
                    <span className="soc-post-author">
                      {t('news-card-10.soc-post-body.soc-post-footer.soc-post-author.text')}
                    </span>
                    <span className="soc-post-read">
                      {t('news-card-10.soc-post-body.soc-post-footer.soc-post-read.text')}
                      <span aria-hidden="true">
                        {t('soc-post-body.soc-post-footer.soc-post-read.span.text#5')}
                      </span>
                    </span>
                  </div>
                </div>
              </a>
              <a
                className="news-card soc-post"
                href={t('tab-content-1.news-grid-section.news-grid.news-card-11.href')}
                data-news-item=""
                data-news-page-item=""
                data-cat="event"
              >
                <div className="soc-post-cover has-image">
                  <img
                    src={t('news-grid.news-card-11.soc-post-cover.img.src')}
                    alt={t('news-grid.news-card-11.soc-post-cover.img.alt')}
                    width="1200"
                    height="675"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="soc-cover-meta">
                    <span className="soc-post-category">
                      {t('news-card-11.soc-post-cover.soc-cover-meta.soc-post-category.text')}
                    </span>
                    <span className="soc-cover-date">
                      {t('news-card-11.soc-post-cover.soc-cover-meta.soc-cover-date.text')}
                    </span>
                  </div>
                </div>
                <div className="soc-post-body nc-body">
                  <h3 className="soc-post-title nc-title">
                    {t('news-grid.news-card-11.soc-post-body.soc-post-title.text')}
                  </h3>
                  <p className="soc-post-excerpt nc-excerpt">
                    {t('news-grid.news-card-11.soc-post-body.soc-post-excerpt.text')}
                  </p>
                  <div className="soc-post-footer">
                    <span className="soc-post-author">
                      {t('news-card-11.soc-post-body.soc-post-footer.soc-post-author.text')}
                    </span>
                    <span className="soc-post-read">
                      {t('news-card-11.soc-post-body.soc-post-footer.soc-post-read.text')}
                      <span aria-hidden="true">
                        {t('soc-post-body.soc-post-footer.soc-post-read.span.text#6')}
                      </span>
                    </span>
                  </div>
                </div>
              </a>
            </div>
            <nav
              className="news-pagination"
              data-news-pagination=""
              aria-label={t(
                'section-panels.tab-content-1.news-grid-section.news-pagination.aria-label',
              )}
            />
          </div>
        </div>
        <div className="tab-content" id="tab-events">
          <aside
            className="t-ad t-ad--slim"
            data-ad-slot="4"
            aria-label={t('editorial-body.section-panels.tab-content-2.t-ad.aria-label')}
          >
            <span className="t-tag">{t('section-panels.tab-content-2.t-ad.t-tag.text')}</span>
            <strong>{t('section-panels.tab-content-2.t-ad.strong.text')}</strong>
            <a href={t('section-panels.tab-content-2.t-ad.a.href')}>
              {t('section-panels.tab-content-2.t-ad.a.text')}
            </a>
          </aside>
          <div className="events-layout">
            <div className="events-header">
              <div>
                <div style={{ textTransform: 'uppercase', marginBottom: '4px' }}>
                  {t('events-layout.events-header.div.div-1.text')}
                </div>
                <div style={{}}>{t('events-layout.events-header.div.div-2.text')}</div>
              </div>
              <div className="events-view-btns">
                <button
                  className="view-btn active"
                  type="button"
                  data-calendar-view="list"
                  aria-pressed="true"
                >
                  {t('events-layout.events-header.events-view-btns.view-btn-1.text')}
                </button>
                <button
                  className="view-btn"
                  type="button"
                  data-calendar-view="calendar"
                  aria-pressed="false"
                >
                  {t('events-layout.events-header.events-view-btns.view-btn-2.text')}
                </button>
              </div>
            </div>
            <div className="upcoming-label">
              {t('section-panels.tab-content-2.events-layout.upcoming-label-1.text')}
            </div>
            <a
              className="event-feat"
              href={t('section-panels.tab-content-2.events-layout.event-feat-1.href')}
              data-news-id="ev1"
              data-event-date={t(
                'section-panels.tab-content-2.events-layout.event-feat-1.data-event-date',
              )}
              data-event-title={t(
                'section-panels.tab-content-2.events-layout.event-feat-1.data-event-title',
              )}
              data-event-end-date={t(
                'section-panels.tab-content-2.events-layout.event-feat-1.data-event-end-date',
              )}
            >
              <div className="event-date-block">
                <div className="event-day">
                  {t('events-layout.event-feat-1.event-date-block.event-day.text')}
                </div>
                <div className="event-month">
                  {t('events-layout.event-feat-1.event-date-block.event-month.text')}
                </div>
                <div className="event-year">
                  {t('events-layout.event-feat-1.event-date-block.event-year.text')}
                </div>
              </div>
              <div className="event-body">
                <div className="event-badge">
                  {t('events-layout.event-feat-1.event-body.event-badge.text')}
                </div>
                <div className="event-title">
                  {t('events-layout.event-feat-1.event-body.event-title.text')}
                </div>
                <div className="event-meta-row">
                  {Array.from({ length: 3 }, (_, i) => (
                    <EventMetaItem key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <div className="event-cta">
                <span className="event-register">
                  {t('events-layout.event-feat-1.event-cta.event-register.text')}
                </span>
              </div>
            </a>
            <a
              className="event-feat"
              href={t('section-panels.tab-content-2.events-layout.event-feat-2.href')}
              data-news-id="ev2"
              data-event-date={t(
                'section-panels.tab-content-2.events-layout.event-feat-2.data-event-date',
              )}
              data-event-title={t(
                'section-panels.tab-content-2.events-layout.event-feat-2.data-event-title',
              )}
              data-event-end-date={t(
                'section-panels.tab-content-2.events-layout.event-feat-2.data-event-end-date',
              )}
            >
              <div className="event-date-block">
                <div className="event-day">
                  {t('events-layout.event-feat-2.event-date-block.event-day.text')}
                </div>
                <div className="event-month">
                  {t('events-layout.event-feat-2.event-date-block.event-month.text')}
                </div>
                <div className="event-year">
                  {t('events-layout.event-feat-2.event-date-block.event-year.text')}
                </div>
              </div>
              <div className="event-body">
                <div className="event-badge">
                  {t('events-layout.event-feat-2.event-body.event-badge.text')}
                </div>
                <div className="event-title">
                  {t('events-layout.event-feat-2.event-body.event-title.text')}
                </div>
                <div className="event-meta-row">
                  {Array.from({ length: 3 }, (_, i) => (
                    <EventMetaItem2 key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <div className="event-cta">
                <span className="event-register">
                  {t('events-layout.event-feat-2.event-cta.event-register.text')}
                </span>
              </div>
            </a>
            <div className="upcoming-label" style={{ marginTop: '28px' }}>
              {t('section-panels.tab-content-2.events-layout.upcoming-label-2.text')}
            </div>
            <a
              className="event-feat"
              href={t('section-panels.tab-content-2.events-layout.event-feat-3.href')}
              data-news-id="ev3"
              data-event-date={t(
                'section-panels.tab-content-2.events-layout.event-feat-3.data-event-date',
              )}
              data-event-title={t(
                'section-panels.tab-content-2.events-layout.event-feat-3.data-event-title',
              )}
              data-event-end-date={t(
                'section-panels.tab-content-2.events-layout.event-feat-3.data-event-end-date',
              )}
            >
              <div className="event-date-block">
                <div className="event-day">
                  {t('events-layout.event-feat-3.event-date-block.event-day.text')}
                </div>
                <div className="event-month">
                  {t('events-layout.event-feat-3.event-date-block.event-month.text')}
                </div>
                <div className="event-year">
                  {t('events-layout.event-feat-3.event-date-block.event-year.text')}
                </div>
              </div>
              <div className="event-body">
                <div className="event-badge">
                  {t('events-layout.event-feat-3.event-body.event-badge.text')}
                </div>
                <div className="event-title">
                  {t('events-layout.event-feat-3.event-body.event-title.text')}
                </div>
                <div className="event-meta-row">
                  {Array.from({ length: 3 }, (_, i) => (
                    <EventMetaItem3 key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <div className="event-cta">
                <span className="event-register">
                  {t('events-layout.event-feat-3.event-cta.event-register.text')}
                </span>
              </div>
            </a>
            <div className="upcoming-label" style={{ marginTop: '28px' }}>
              {t('section-panels.tab-content-2.events-layout.upcoming-label-3.text')}
            </div>
            <a
              className="event-feat"
              href={t('section-panels.tab-content-2.events-layout.event-feat-4.href')}
              data-news-id="ev4"
              data-event-date={t(
                'section-panels.tab-content-2.events-layout.event-feat-4.data-event-date',
              )}
              data-event-title={t(
                'section-panels.tab-content-2.events-layout.event-feat-4.data-event-title',
              )}
              data-event-end-date={t(
                'section-panels.tab-content-2.events-layout.event-feat-4.data-event-end-date',
              )}
            >
              <div className="event-date-block">
                <div className="event-day">
                  {t('events-layout.event-feat-4.event-date-block.event-day.text')}
                </div>
                <div className="event-month">
                  {t('events-layout.event-feat-4.event-date-block.event-month.text')}
                </div>
                <div className="event-year">
                  {t('events-layout.event-feat-4.event-date-block.event-year.text')}
                </div>
              </div>
              <div className="event-body">
                <div className="event-badge">
                  {t('events-layout.event-feat-4.event-body.event-badge.text')}
                </div>
                <div className="event-title">
                  {t('events-layout.event-feat-4.event-body.event-title.text')}
                </div>
                <div className="event-meta-row">
                  {Array.from({ length: 3 }, (_, i) => (
                    <EventMetaItem4 key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <div className="event-cta">
                <span className="event-register">
                  {t('events-layout.event-feat-4.event-cta.event-register.text')}
                </span>
              </div>
            </a>
            <div className="past-events">
              <div style={{ textTransform: 'uppercase', marginBottom: '14px' }}>
                {t('tab-content-2.events-layout.past-events.div.text')}
              </div>
              <div className="past-grid">
                {Array.from({ length: 3 }, (_, i) => (
                  <PastCard key={i} t={t} i={i} />
                ))}
              </div>
            </div>
            <section className="reference-calendar" data-calendar="" hidden>
              <div className="calendar-toolbar">
                <h2 data-calendar-label="" />
                <div>
                  <button
                    type="button"
                    data-calendar-step="-1"
                    aria-label={t('reference-calendar.calendar-toolbar.div.button-1.aria-label')}
                  >
                    {t('reference-calendar.calendar-toolbar.div.button-1.text')}
                  </button>
                  <button type="button" data-calendar-now="">
                    {t('reference-calendar.calendar-toolbar.div.button-2.text')}
                  </button>
                  <button
                    type="button"
                    data-calendar-step="1"
                    aria-label={t('reference-calendar.calendar-toolbar.div.button-3.aria-label')}
                  >
                    {t('reference-calendar.calendar-toolbar.div.button-3.text')}
                  </button>
                </div>
              </div>
              <div data-calendar-grid="" />
              <p className="calendar-status" role="status" />
            </section>
          </div>
          <div className="t-inline-note">
            <span className="t-tag">
              {t('section-panels.tab-content-2.t-inline-note.t-tag.text')}
            </span>
            <h3>{t('section-panels.tab-content-2.t-inline-note.h3.text')}</h3>
            <p>{t('section-panels.tab-content-2.t-inline-note.p.text')}</p>
            <button className="t-button" type="button" data-demo-rsvp="">
              {t('section-panels.tab-content-2.t-inline-note.t-button.text')}
            </button>
            <p className="t-meta" data-rsvp-status="" role="status" />
            <a
              className="t-text-link"
              href={t('section-panels.tab-content-2.t-inline-note.t-text-link.href')}
            >
              {t('section-panels.tab-content-2.t-inline-note.t-text-link.text')}
            </a>
          </div>
        </div>
        <div className="tab-content" id="tab-opportunities">
          <section className="section t-workspace">
            <h2 className="t-section-title">
              {t('section-panels.tab-content-3.section.t-section-title.text')}
            </h2>
            <p className="t-intro">{t('section-panels.tab-content-3.section.t-intro.text')}</p>
            <div className="t-grid-two">
              {Array.from({ length: 4 }, (_, i) => (
                <TPaper key={i} t={t} i={i} />
              ))}
            </div>
          </section>
        </div>
        <div className="tab-content" id="tab-polls">
          <section className="section t-workspace">
            <h2 className="t-section-title">
              {t('section-panels.tab-content-4.section.t-section-title.text')}
            </h2>
            <p className="t-intro">{t('section-panels.tab-content-4.section.t-intro.text')}</p>
            <form className="t-poll" data-demo-poll="" method="post" action="/api/legacy-form">
              <span className="t-tag">{t('tab-content-4.section.t-poll.t-tag.text')}</span>
              <fieldset>
                <legend className="sr-only">{t('section.t-poll.fieldset.sr-only.text')}</legend>
                <label>
                  <input type="radio" name="pulse" defaultValue="materials" required />
                  {t('section.t-poll.fieldset.label-1.text')}
                </label>
                <label>
                  <input type="radio" name="pulse" defaultValue="tutorials" />
                  {t('section.t-poll.fieldset.label-2.text')}
                </label>
                <label>
                  <input type="radio" name="pulse" defaultValue="events" />
                  {t('section.t-poll.fieldset.label-3.text')}
                </label>
              </fieldset>
              <button type="submit" className="t-button">
                {t('tab-content-4.section.t-poll.t-button.text')}
              </button>
              <p className="t-meta" role="status" data-poll-status="">
                {t('tab-content-4.section.t-poll.t-meta.text')}
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

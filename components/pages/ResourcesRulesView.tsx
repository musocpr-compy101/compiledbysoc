import type { T } from '@/lib/page-copy';
export function ResourcesRulesView({ t, children }: { t: T; children?: React.ReactNode }) {
  return (
    <main id="main-content">
      <div className="reference-surface reference-about printable-rules">
        <div className="print-toolbar">
          <button className="solid-action" type="button" data-print="">
            {t('reference-surface.print-toolbar.solid-action.text')}
          </button>
          <a href={t('reference-surface.print-toolbar.a.href')}>
            {t('reference-surface.print-toolbar.a.text')}
          </a>
        </div>
        <h1>{t('reference-surface.h1.text')}</h1>
        <p className="article-source-note">{t('reference-surface.article-source-note.text')}</p>
        <div className="tab-content" id="tab-rules">
          <div className="section" style={{ background: '#fff' }}>
            <h2 className="sec-title">
              {t('reference-surface.tab-content-1.section.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <p className="sec-sub">{t('reference-surface.tab-content-1.section.sec-sub.text')}</p>
            <div className="rules-wrap">
              {Array.from({ length: 8 }, (_, i) => (
                <RuleItem key={i} t={t} i={i} />
              ))}
            </div>
            <a
              className="pdf-download"
              type="button"
              href={t('reference-surface.tab-content-1.section.pdf-download.href')}
              target="_blank"
              rel="noopener"
            >
              {t('reference-surface.tab-content-1.section.pdf-download.text')}
            </a>
          </div>
        </div>
        <TabDresscode t={t} />
      </div>
      {children}
    </main>
  );
}

function RuleItem({ t, i }: { t: T; i: number }) {
  return (
    <div className="rule-item">
      <div className="rule-num">
        {t(`tab-content-1.section.rules-wrap.rule-item-1.${i}.rule-num.text`)}
      </div>
      <div className="rule-text">
        {t(`tab-content-1.section.rules-wrap.rule-item-1.${i}.rule-text.text`)}
      </div>
    </div>
  );
}

function TabDresscode({ t }: { t: T }) {
  return (
    <div className="tab-content" id="tab-dresscode">
      <div className="section" style={{ background: '#fff' }}>
        <h2 className="sec-title">{t('reference-surface.tab-content-2.section.sec-title.text')}</h2>
        <div className="sec-rule" />
        <p className="sec-sub">{t('reference-surface.tab-content-2.section.sec-sub.text')}</p>
        <div className="dress-grid">
          <div className="dress-card">
            <div className="dress-img">
              <div className="dress-swatch">
                <div className="swatch" style={{ background: '#111' }}>
                  <span className="swatch-label" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {t('dress-img.dress-swatch.swatch-1.swatch-label.text')}
                  </span>
                </div>
                <div className="swatch" style={{ background: '#888' }}>
                  <span className="swatch-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {t('dress-img.dress-swatch.swatch-2.swatch-label.text')}
                  </span>
                </div>
              </div>
            </div>
            <div className="dress-body">
              <div className="dress-combo">
                {t('dress-grid.dress-card-1.dress-body.dress-combo.text')}
              </div>
              <div className="dress-note">
                {t('dress-grid.dress-card-1.dress-body.dress-note.text')}
              </div>
              <span className="dress-badge">
                {t('dress-grid.dress-card-1.dress-body.dress-badge.text')}
              </span>
            </div>
          </div>
          <div className="dress-card">
            <div className="dress-img">
              <div className="dress-swatch">
                <div
                  className="swatch"
                  style={{ background: '#F5F5F5', borderRight: '1px solid #E8E8E8' }}
                >
                  <span className="swatch-label" style={{ color: '#AAA' }}>
                    {t('dress-img.dress-swatch.swatch-1.swatch-label.text#2')}
                  </span>
                </div>
                <div className="swatch" style={{ background: '#503c0a' }}>
                  <span className="swatch-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {t('dress-img.dress-swatch.swatch-2.swatch-label.text#2')}
                  </span>
                </div>
              </div>
            </div>
            <div className="dress-body">
              <div className="dress-combo">
                {t('dress-grid.dress-card-2.dress-body.dress-combo.text')}
              </div>
              <div className="dress-note">
                {t('dress-grid.dress-card-2.dress-body.dress-note.text')}
              </div>
              <span className="dress-badge">
                {t('dress-grid.dress-card-2.dress-body.dress-badge.text')}
              </span>
            </div>
          </div>
        </div>
        <div className="dress-note-box">
          <div className="dress-note-title">
            {t('tab-content-2.section.dress-note-box.dress-note-title.text')}
          </div>
          <div className="dress-note-text">
            {t('tab-content-2.section.dress-note-box.dress-note-text.text')}
          </div>
        </div>
      </div>
    </div>
  );
}

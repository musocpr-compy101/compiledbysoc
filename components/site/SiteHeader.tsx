import type { T } from '@/lib/page-copy';
import { pageCopy } from '@/lib/page-copy';
import { headerDefaults } from '@/content/pages/chrome-header';
export async function SiteHeader({ hero }: { hero?: boolean }) {
  const t = await pageCopy('@header', headerDefaults);
  return (
    <>
      <header className={hero ? 'cmd-header cmd-header--hero' : 'cmd-header'} data-cmd-header="">
        <a
          className="cmd-brand"
          href={t('cmd-header.cmd-brand.href')}
          aria-label={t('cmd-header.cmd-brand.aria-label')}
        >
          <span className="cmd-logo" aria-hidden="true">
            {t('cmd-header.cmd-brand.cmd-logo.text')}
            <span>{t('cmd-header.cmd-brand.cmd-logo.span.text')}</span>
          </span>
          <span className="cmd-brand-name" aria-hidden="true">
            <span>{t('cmd-header.cmd-brand.cmd-brand-name.span-1.text')}</span>
            <span>
              <span className="cmd-brand-by">
                {t('cmd-brand.cmd-brand-name.span-2.cmd-brand-by.text')}
              </span>
              {t('cmd-header.cmd-brand.cmd-brand-name.span-2.text')}
            </span>
          </span>
        </a>
        <div className="cmd-actions">
          <button
            className="cmd-search"
            type="button"
            data-site-search=""
            aria-label={t('cmd-header.cmd-actions.cmd-search.aria-label')}
          >
            <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
              <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="m15 15 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <a className="cmd-pay" href={t('cmd-header.cmd-actions.cmd-pay.href')}>
            {t('cmd-header.cmd-actions.cmd-pay.text')}
          </a>
          <button
            className="cmd-menu-toggle"
            type="button"
            data-cmd-menu=""
            aria-label={t('cmd-header.cmd-actions.cmd-menu-toggle.aria-label')}
            aria-expanded="false"
            aria-controls="cmd-navigation"
          >
            <span className="cmd-menu-label">
              {t('cmd-header.cmd-actions.cmd-menu-toggle.cmd-menu-label.text')}
            </span>
            <span className="cmd-menu-icon" aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <CmdMenuIconSpanItem key={i} t={t} i={i} />
              ))}
            </span>
          </button>
        </div>
      </header>
      <noscript>
        <nav className="cmd-fallback" aria-label={t('noscript.cmd-fallback.aria-label')}>
          {Array.from({ length: 8 }, (_, i) => (
            <CmdFallbackAItem key={i} t={t} i={i} />
          ))}
        </nav>
      </noscript>
    </>
  );
}

function CmdMenuIconSpanItem({ t, i }: { t: T; i: number }) {
  return <span />;
}

function CmdFallbackAItem({ t, i }: { t: T; i: number }) {
  return (
    <a href={t(`noscript.cmd-fallback.a-1.${i}.href`)}>
      {t(`noscript.cmd-fallback.a-1.${i}.text`)}
    </a>
  );
}

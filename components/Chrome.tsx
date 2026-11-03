import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteDialogs } from '@/components/site/SiteDialogs';
/** Shared page frame: skip link, header, footer and dialogs. `hero` means the page draws the header itself (home). */
export async function Chrome({
  children,
  bodyClass = 'reference-page',
  hero = false,
  appCss = true,
  skip = { href: '#main-content', label: 'Skip to content' },
}: {
  children: React.ReactNode;
  bodyClass?: string;
  hero?: boolean;
  appCss?: boolean;
  skip?: { href: string; label: string };
}) {
  return (
    <div className={bodyClass || undefined}>
      {appCss && <link rel="stylesheet" href="/app-design.css" precedence="design" />}
      <a className="skip-link" href={skip.href}>
        {skip.label}
      </a>
      {!hero && <SiteHeader />}
      {children}
      <SiteFooter />
      <SiteDialogs />
    </div>
  );
}

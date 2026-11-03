import type { T } from '@/lib/page-copy';
export function AcademicsView({ t, children }: { t: T; children?: React.ReactNode }) {
  return (
    <main id="main-content">
      <div className="reference-surface reference-academics">
        <header className="editorial-masthead has-photo">
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
          <figure className="masthead-photo">
            <img
              src={t('reference-surface.editorial-masthead.masthead-photo.img.src')}
              alt={t('reference-surface.editorial-masthead.masthead-photo.img.alt')}
              width="1200"
              height="900"
              decoding="async"
            />
            <figcaption>
              {t('reference-surface.editorial-masthead.masthead-photo.figcaption.text')}
            </figcaption>
          </figure>
        </header>
        <EditorialBody t={t} />
      </div>
      {children}
    </main>
  );
}

function TFiltersOptionItem({ t, i }: { t: T; i: number }) {
  return (
    <option value={t(`t-filters.label-1.select.option-1.${i}.value~`)}>
      {t(`t-filters.label-1.select.option-1.${i}.text`)}
    </option>
  );
}

function TFiltersOptionItem2({ t, i }: { t: T; i: number }) {
  return (
    <option value={t(`t-filters.label-2.select.option-1.${i}.value~`)}>
      {t(`t-filters.label-2.select.option-1.${i}.text`)}
    </option>
  );
}

function TTableThItem({ t, i }: { t: T; i: number }) {
  return <th>{t(`t-table.thead.tr.th-1.${i}.text`)}</th>;
}

function TTableTrItem({ t, i }: { t: T; i: number }) {
  return (
    <tr
      data-study-row=""
      data-programmes={t(`t-table-scroll.t-table.tbody.tr-1.${i}.data-programmes~`)}
      data-levels={t(`t-table-scroll.t-table.tbody.tr-1.${i}.data-levels~`)}
    >
      <td>
        <span className="t-tag">{t(`t-table-scroll.t-table.tbody.tr-1.${i}.td-1.t-tag.text`)}</span>
      </td>
      <td>{t(`t-table-scroll.t-table.tbody.tr-1.${i}.td-2.text`)}</td>
      <td>
        <strong>{t(`t-table-scroll.t-table.tbody.tr-1.${i}.td-3.strong.text`)}</strong>
        <span>{t(`t-table-scroll.t-table.tbody.tr-1.${i}.td-3.span.text`)}</span>
      </td>
      <td>{t(`t-table-scroll.t-table.tbody.tr-1.${i}.td-4.text`)}</td>
    </tr>
  );
}

function DhcSkill({ t, i }: { t: T; i: number }) {
  return (
    <span className="dhc-skill">
      {t(`dept-hero-card-1.dhc-body.dhc-skills.dhc-skill-1.${i}.text`)}
    </span>
  );
}

function DhcSkill2({ t, i }: { t: T; i: number }) {
  return (
    <span className="dhc-skill">
      {t(`dept-hero-card-2.dhc-body.dhc-skills.dhc-skill-1.${i}.text`)}
    </span>
  );
}

function DhcSkill3({ t, i }: { t: T; i: number }) {
  return (
    <span className="dhc-skill">
      {t(`dept-hero-card-3.dhc-body.dhc-skills.dhc-skill-1.${i}.text`)}
    </span>
  );
}

function OutcomeItem({ t, i }: { t: T; i: number }) {
  return (
    <div className="outcome-item">
      <div className="outcome-dot" />
      <div className="outcome-text">
        {t(`dept-detail.dept-detail-body.ddb-main.outcome-item-1.${i}.outcome-text.text`)}
      </div>
    </div>
  );
}

function SideStat({ t, i }: { t: T; i: number }) {
  return (
    <div className="side-stat">
      <div className="side-stat-n">
        {t(`dept-detail.dept-detail-body.ddb-side.side-stat-1.${i}.side-stat-n.text`)}
      </div>
      <div className="side-stat-l">
        {t(`dept-detail.dept-detail-body.ddb-side.side-stat-1.${i}.side-stat-l.text`)}
      </div>
    </div>
  );
}

function SideItem({ t, i }: { t: T; i: number }) {
  return (
    <div className="side-item">
      {t(`dept-detail.dept-detail-body.ddb-side.side-item-1.${i}.text`)}
    </div>
  );
}

function OutcomeItem2({ t, i }: { t: T; i: number }) {
  return (
    <div className="outcome-item">
      <div className="outcome-dot" />
      <div className="outcome-text">
        {t(`dept-detail.dept-detail-body.ddb-main.outcome-item-1#2.${i}.outcome-text.text`)}
      </div>
    </div>
  );
}

function SideStat2({ t, i }: { t: T; i: number }) {
  return (
    <div className="side-stat">
      <div className="side-stat-n">
        {t(`dept-detail.dept-detail-body.ddb-side.side-stat-1#2.${i}.side-stat-n.text`)}
      </div>
      <div className="side-stat-l">
        {t(`dept-detail.dept-detail-body.ddb-side.side-stat-1#2.${i}.side-stat-l.text`)}
      </div>
    </div>
  );
}

function SideItem2({ t, i }: { t: T; i: number }) {
  return (
    <div className="side-item">
      {t(`dept-detail.dept-detail-body.ddb-side.side-item-1#2.${i}.text`)}
    </div>
  );
}

function OutcomeItem3({ t, i }: { t: T; i: number }) {
  return (
    <div className="outcome-item">
      <div className="outcome-dot" />
      <div className="outcome-text">
        {t(`dept-detail.dept-detail-body.ddb-main.outcome-item-1#3.${i}.outcome-text.text`)}
      </div>
    </div>
  );
}

function SideStat3({ t, i }: { t: T; i: number }) {
  return (
    <div className="side-stat">
      <div className="side-stat-n">
        {t(`dept-detail.dept-detail-body.ddb-side.side-stat-1#3.${i}.side-stat-n.text`)}
      </div>
      <div className="side-stat-l">
        {t(`dept-detail.dept-detail-body.ddb-side.side-stat-1#3.${i}.side-stat-l.text`)}
      </div>
    </div>
  );
}

function SideItem3({ t, i }: { t: T; i: number }) {
  return (
    <div className="side-item">
      {t(`dept-detail.dept-detail-body.ddb-side.side-item-1#3.${i}.text`)}
    </div>
  );
}

function FacTag({ t, i }: { t: T; i: number }) {
  return (
    <span className="fac-tag">{t(`fac-card-1.fac-body.fac-tag-row.fac-tag-1.${i}.text`)}</span>
  );
}

function FacTag2({ t, i }: { t: T; i: number }) {
  return (
    <span className="fac-tag">{t(`fac-card-2.fac-body.fac-tag-row.fac-tag-1.${i}.text`)}</span>
  );
}

function FacTag3({ t, i }: { t: T; i: number }) {
  return (
    <span className="fac-tag">{t(`fac-card-3.fac-body.fac-tag-row.fac-tag-1.${i}.text`)}</span>
  );
}

function DrtBtn({ t, i }: { t: T; i: number }) {
  return (
    <button
      className="drt-btn"
      data-tab-target={t(`tab-content-4.section.dept-req-tabs.drt-btn-2.${i}.data-tab-target~`)}
      data-tab-group="requirements"
      type="button"
    >
      {t(`tab-content-4.section.dept-req-tabs.drt-btn-2.${i}.text`)}
    </button>
  );
}

function ReqItem({ t, i }: { t: T; i: number }) {
  return (
    <div className="req-item">
      <div className="req-check">
        {t(`req-tab-content-1.req-block-1.req-list.req-item-1.${i}.req-check.text`)}
      </div>
      <div className="req-text">
        {t(`req-tab-content-1.req-block-1.req-list.req-item-1.${i}.req-text.text`)}
      </div>
    </div>
  );
}

function ReqItem2({ t, i }: { t: T; i: number }) {
  return (
    <div className="req-item">
      <div className="req-check">
        {t(`req-tab-content-1.req-block-2.req-list.req-item-1.${i}.req-check.text`)}
      </div>
      <div className="req-text">
        {t(`req-tab-content-1.req-block-2.req-list.req-item-1.${i}.req-text.text`)}
      </div>
    </div>
  );
}

function ReqItem3({ t, i, j }: { t: T; i: number; j: number }) {
  return (
    <div className="req-item">
      <div className="req-check">
        {t(
          `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-1.req-list.req-item-1.${j}.req-check.text`,
        )}
      </div>
      <div className="req-text">
        {t(
          `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-1.req-list.req-item-1.${j}.req-text.text`,
        )}
      </div>
    </div>
  );
}

function ReqCs({ t, i }: { t: T; i: number }) {
  return (
    <div
      className="req-tab-content"
      id={t(`section-panels.tab-content-4.section.req-tab-content-2.${i}.id~`)}
    >
      <div className="req-block">
        <div className="req-block-title">
          <span className="req-badge">
            {t(
              `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-1.req-block-title.req-badge.text`,
            )}
          </span>
          {t(
            `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-1.req-block-title.text`,
          )}
        </div>
        <div className="req-list">
          {Array.from({ length: 3 }, (_, j) => (
            <ReqItem3 key={j} t={t} i={i} j={j} />
          ))}
        </div>
      </div>
      <div className="req-block">
        <div className="req-block-title">
          <span className="req-badge">
            {t(
              `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-2.req-block-title.req-badge.text`,
            )}
          </span>
          {t(
            `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-2.req-block-title.text`,
          )}
        </div>
        <div className="req-list">
          <div className="req-item">
            <div className="req-check">
              {t(
                `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-2.req-list.req-item-1.req-check.text`,
              )}
            </div>
            <div className="req-text">
              {t(
                `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-2.req-list.req-item-1.req-text.text`,
              )}
            </div>
          </div>
          <div className="req-item">
            <div className="req-check">
              {t(
                `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-2.req-list.req-item-2.req-check.text`,
              )}
            </div>
            <div className="req-text">
              {t(
                `section-panels.tab-content-4.section.req-tab-content-2.${i}.req-block-2.req-list.req-item-2.req-text.text`,
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResItem({ t, i }: { t: T; i: number }) {
  return (
    <div className="res-item">
      <div className="res-item-meta">
        <span className="res-item-cat">
          {t(`section.research-grid.res-list.res-item-1.${i}.res-item-meta.res-item-cat.text`)}
        </span>
        <span className="res-item-date">
          {t(`section.research-grid.res-list.res-item-1.${i}.res-item-meta.res-item-date.text`)}
        </span>
      </div>
      <div className="res-item-title">
        {t(`section.research-grid.res-list.res-item-1.${i}.res-item-title.text`)}
      </div>
      <div className="res-item-authors">
        {t(`section.research-grid.res-list.res-item-1.${i}.res-item-authors.text`)}
      </div>
    </div>
  );
}

function CourseTableThItem({ t, i }: { t: T; i: number }) {
  return <th>{t(`course-table.thead.tr.th-1.${i}.text`)}</th>;
}

function CourseTableTrItem({ t, i }: { t: T; i: number }) {
  return (
    <tr>
      <td className="course-code">
        {t(`semester-block-1.course-table.tbody.tr-1.${i}.course-code.text`)}
      </td>
      <td className="course-title-cell">
        {t(`semester-block-1.course-table.tbody.tr-1.${i}.course-title-cell.text`)}
      </td>
      <td className="course-units">
        {t(`semester-block-1.course-table.tbody.tr-1.${i}.course-units.text`)}
      </td>
      <td>
        <span className="ct-core">
          {t(`semester-block-1.course-table.tbody.tr-1.${i}.td.ct-core.text`)}
        </span>
      </td>
    </tr>
  );
}

function CourseTableThItem2({ t, i }: { t: T; i: number }) {
  return <th>{t(`course-table.thead.tr.th-1#2.${i}.text`)}</th>;
}

function CourseTableTrItem2({ t, i }: { t: T; i: number }) {
  return (
    <tr>
      <td className="course-code">
        {t(`semester-block-2.course-table.tbody.tr-1.${i}.course-code.text`)}
      </td>
      <td className="course-title-cell">
        {t(`semester-block-2.course-table.tbody.tr-1.${i}.course-title-cell.text`)}
      </td>
      <td className="course-units">
        {t(`semester-block-2.course-table.tbody.tr-1.${i}.course-units.text`)}
      </td>
      <td>
        <span className="ct-core">
          {t(`semester-block-2.course-table.tbody.tr-1.${i}.td.ct-core.text`)}
        </span>
      </td>
    </tr>
  );
}

function CourseTableThItem3({ t, i }: { t: T; i: number }) {
  return <th>{t(`course-table.thead.tr.th-1#3.${i}.text`)}</th>;
}

function CourseTableTrItem3({ t, i }: { t: T; i: number }) {
  return (
    <tr>
      <td className="course-code">
        {t(`semester-block-1.course-table.tbody.tr-1#2.${i}.course-code.text`)}
      </td>
      <td className="course-title-cell">
        {t(`semester-block-1.course-table.tbody.tr-1#2.${i}.course-title-cell.text`)}
      </td>
      <td className="course-units">
        {t(`semester-block-1.course-table.tbody.tr-1#2.${i}.course-units.text`)}
      </td>
      <td>
        <span className="ct-core">
          {t(`semester-block-1.course-table.tbody.tr-1#2.${i}.td.ct-core.text`)}
        </span>
      </td>
    </tr>
  );
}

function CourseTableThItem4({ t, i }: { t: T; i: number }) {
  return <th>{t(`course-table.thead.tr.th-1#4.${i}.text`)}</th>;
}

function CourseTableTrItem4({ t, i }: { t: T; i: number }) {
  return (
    <tr>
      <td className="course-code">
        {t(`semester-block-2.course-table.tbody.tr-1#2.${i}.course-code.text`)}
      </td>
      <td className="course-title-cell">
        {t(`semester-block-2.course-table.tbody.tr-1#2.${i}.course-title-cell.text`)}
      </td>
      <td className="course-units">
        {t(`semester-block-2.course-table.tbody.tr-1#2.${i}.course-units.text`)}
      </td>
      <td>
        <span className="ct-core">
          {t(`semester-block-2.course-table.tbody.tr-1#2.${i}.td.ct-core.text`)}
        </span>
      </td>
    </tr>
  );
}

function CourseTableThItem5({ t, i }: { t: T; i: number }) {
  return <th>{t(`course-table.thead.tr.th-1#5.${i}.text`)}</th>;
}

function CourseTableTrItem5({ t, i }: { t: T; i: number }) {
  return (
    <tr>
      <td className="course-code">
        {t(`semester-block-1.course-table.tbody.tr-1#3.${i}.course-code.text`)}
      </td>
      <td className="course-title-cell">
        {t(`semester-block-1.course-table.tbody.tr-1#3.${i}.course-title-cell.text`)}
      </td>
      <td className="course-units">
        {t(`semester-block-1.course-table.tbody.tr-1#3.${i}.course-units.text`)}
      </td>
      <td>
        <span className="ct-core">
          {t(`semester-block-1.course-table.tbody.tr-1#3.${i}.td.ct-core.text`)}
        </span>
      </td>
    </tr>
  );
}

function CourseTableThItem6({ t, i }: { t: T; i: number }) {
  return <th>{t(`course-table.thead.tr.th-1#6.${i}.text`)}</th>;
}

function CourseTableTrItem6({ t, i }: { t: T; i: number }) {
  return (
    <tr>
      <td className="course-code">
        {t(`semester-block-2.course-table.tbody.tr-1#3.${i}.course-code.text`)}
      </td>
      <td className="course-title-cell">
        {t(`semester-block-2.course-table.tbody.tr-1#3.${i}.course-title-cell.text`)}
      </td>
      <td className="course-units">
        {t(`semester-block-2.course-table.tbody.tr-1#3.${i}.course-units.text`)}
      </td>
      <td>
        <span className="ct-core">
          {t(`semester-block-2.course-table.tbody.tr-1#3.${i}.td.ct-core.text`)}
        </span>
      </td>
    </tr>
  );
}

function CareerPath({ t, i, j }: { t: T; i: number; j: number }) {
  return (
    <div className="career-path">
      <div className="cp-icon">
        <span>
          {t(
            `tab-content-7.section.career-grid.career-dept-1.${i}.career-dept-body.career-path-1.${j}.cp-icon.span.text`,
          )}
        </span>
      </div>
      <div>
        <div className="cp-title">
          {t(
            `tab-content-7.section.career-grid.career-dept-1.${i}.career-dept-body.career-path-1.${j}.div.cp-title.text`,
          )}
        </div>
        <div className="cp-desc">
          {t(
            `tab-content-7.section.career-grid.career-dept-1.${i}.career-dept-body.career-path-1.${j}.div.cp-desc.text`,
          )}
        </div>
      </div>
    </div>
  );
}

function CareerDept({ t, i }: { t: T; i: number }) {
  return (
    <div className="career-dept">
      <div className="career-dept-header">
        <div className="cdh-code">
          {t(
            `tab-content-7.section.career-grid.career-dept-1.${i}.career-dept-header.cdh-code.text`,
          )}
        </div>
        <div className="cdh-name">
          {t(
            `tab-content-7.section.career-grid.career-dept-1.${i}.career-dept-header.cdh-name.text`,
          )}
        </div>
      </div>
      <div className="career-dept-body">
        {Array.from({ length: 4 }, (_, j) => (
          <CareerPath key={j} t={t} i={i} j={j} />
        ))}
      </div>
    </div>
  );
}

function InspoCard({ t, i }: { t: T; i: number }) {
  return (
    <div className="inspo-card">
      <div className="inspo-quote">
        {t(`tab-content-7.inspo-section.inspo-grid.inspo-card-1.${i}.inspo-quote.text`)}
      </div>
      <div className="inspo-text">
        {t(`tab-content-7.inspo-section.inspo-grid.inspo-card-1.${i}.inspo-text.text`)}
      </div>
      <div className="inspo-name">
        {t(`tab-content-7.inspo-section.inspo-grid.inspo-card-1.${i}.inspo-name.text`)}
      </div>
      <div className="inspo-title-sm">
        {t(`tab-content-7.inspo-section.inspo-grid.inspo-card-1.${i}.inspo-title-sm.text`)}
      </div>
    </div>
  );
}

function TFiltersOptionItem3({ t, i }: { t: T; i: number }) {
  return (
    <option value={t(`t-filters.label-1.select.option-1#2.${i}.value~`)}>
      {t(`t-filters.label-1.select.option-1#2.${i}.text`)}
    </option>
  );
}

function TFiltersOptionItem4({ t, i }: { t: T; i: number }) {
  return (
    <option value={t(`t-filters.label-2.select.option-1#2.${i}.value~`)}>
      {t(`t-filters.label-2.select.option-1#2.${i}.text`)}
    </option>
  );
}

function TResource({ t, i }: { t: T; i: number }) {
  return (
    <article
      className="t-resource"
      data-material-card=""
      data-programmes={t(
        `tab-content-9.section.t-resource-list.t-resource-1.${i}.data-programmes~`,
      )}
      data-levels={t(`tab-content-9.section.t-resource-list.t-resource-1.${i}.data-levels~`)}
    >
      <span className="t-file">
        {t(`tab-content-9.section.t-resource-list.t-resource-1.${i}.t-file.text`)}
      </span>
      <div>
        <h3>{t(`tab-content-9.section.t-resource-list.t-resource-1.${i}.div.h3.text`)}</h3>
        <p>{t(`tab-content-9.section.t-resource-list.t-resource-1.${i}.div.p.text`)}</p>
      </div>
      <button
        type="button"
        className="t-button t-button--light"
        data-unavailable="View details"
        data-unavailable-message="This is a sample material listing. No approved file has been uploaded yet."
      >
        {t(`tab-content-9.section.t-resource-list.t-resource-1.${i}.t-button.text`)}
      </button>
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
        <div className="tab-nav" id="tabNav">
          <button
            className="tab-btn active"
            type="button"
            data-tab-group="main"
            data-tab-target="tab-timetable"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-1.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-1.text')}
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
              {t('section-index.tab-nav.tab-btn-1.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="tab-btn"
            data-tab-target="tab-departments"
            data-tab-group="main"
            type="button"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-2.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-2.text')}
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
              {t('section-index.tab-nav.tab-btn-2.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="tab-btn"
            data-tab-target="tab-facilities"
            data-tab-group="main"
            type="button"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-3.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-3.text')}
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
              {t('section-index.tab-nav.tab-btn-3.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="tab-btn"
            data-tab-target="tab-admission"
            data-tab-group="main"
            type="button"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-4.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-4.text')}
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
              {t('section-index.tab-nav.tab-btn-4.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="tab-btn"
            data-tab-target="tab-research"
            data-tab-group="main"
            type="button"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-5.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-5.text')}
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
                <circle cx="10" cy="10" r="7" />
                <path d="m15 15 6 6" />
              </svg>
            </span>
            <span className="desktop-index-description" aria-hidden="true">
              {t('section-index.tab-nav.tab-btn-5.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="tab-btn"
            data-tab-target="tab-courses"
            data-tab-group="main"
            type="button"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-6.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-6.text')}
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
              {t('section-index.tab-nav.tab-btn-6.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="tab-btn"
            data-tab-target="tab-careers"
            data-tab-group="main"
            type="button"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-7.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-7.text')}
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
              {t('section-index.tab-nav.tab-btn-7.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="tab-btn"
            type="button"
            data-tab-group="main"
            data-tab-target="tab-tutoring"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-8.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-8.text')}
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
                <circle cx="9" cy="7" r="3" />
                <path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a3 3 0 0 1 0 6M18 13a6 6 0 0 1 4 6v2" />
              </svg>
            </span>
            <span className="desktop-index-description" aria-hidden="true">
              {t('section-index.tab-nav.tab-btn-8.desktop-index-description.text')}
            </span>
          </button>
          <button
            className="tab-btn"
            type="button"
            data-tab-group="main"
            data-tab-target="tab-materials"
            data-section-label={t(
              'editorial-body.section-index.tab-nav.tab-btn-9.data-section-label',
            )}
          >
            {t('editorial-body.section-index.tab-nav.tab-btn-9.text')}
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
                <path d="M3 6h7l3 3h8v11H3z" />
              </svg>
            </span>
            <span className="desktop-index-description" aria-hidden="true">
              {t('section-index.tab-nav.tab-btn-9.desktop-index-description.text')}
            </span>
          </button>
        </div>
      </aside>
      <div className="section-panels">
        <div className="tab-content active" id="tab-timetable">
          <section className="section t-workspace">
            <h2 className="t-section-title">
              {t('section-panels.tab-content-1.section.t-section-title.text')}
            </h2>
            <p className="t-intro">{t('section-panels.tab-content-1.section.t-intro.text')}</p>
            <div className="t-filters" data-preference-group="study">
              <label>
                {t('tab-content-1.section.t-filters.label-1.text')}
                <select
                  data-programme=""
                  aria-label={t('section.t-filters.label-1.select.aria-label')}
                >
                  {Array.from({ length: 4 }, (_, i) => (
                    <TFiltersOptionItem key={i} t={t} i={i} />
                  ))}
                </select>
              </label>
              <label>
                {t('tab-content-1.section.t-filters.label-2.text')}
                <select data-level="" aria-label={t('section.t-filters.label-2.select.aria-label')}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <TFiltersOptionItem2 key={i} t={t} i={i} />
                  ))}
                </select>
              </label>
            </div>
            <div
              className="t-tab-pills"
              role="group"
              aria-label={t('section-panels.tab-content-1.section.t-tab-pills.aria-label')}
            >
              <button className="is-active" type="button" data-schedule="class" aria-pressed="true">
                {t('tab-content-1.section.t-tab-pills.is-active.text')}
              </button>
              <button type="button" data-schedule="exam" aria-pressed="false">
                {t('tab-content-1.section.t-tab-pills.button.text')}
              </button>
            </div>
            <div className="t-table-scroll" data-class-schedule="">
              <table className="t-table">
                <caption>{t('section.t-table-scroll.t-table.caption.text')}</caption>
                <thead>
                  <tr>
                    {Array.from({ length: 4 }, (_, i) => (
                      <TTableThItem key={i} t={t} i={i} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 3 }, (_, i) => (
                    <TTableTrItem key={i} t={t} i={i} />
                  ))}
                </tbody>
              </table>
            </div>
            <p className="t-empty" data-exam-schedule="" hidden>
              {t('section-panels.tab-content-1.section.t-empty.text')}
            </p>
            <p className="t-meta" data-study-status="" role="status" />
            <aside
              className="t-ad t-ad--slim"
              data-ad-slot="5"
              aria-label={t('section-panels.tab-content-1.section.t-ad.aria-label')}
            >
              <span className="t-tag">{t('tab-content-1.section.t-ad.t-tag.text')}</span>
              <strong>{t('tab-content-1.section.t-ad.strong.text')}</strong>
              <a href={t('tab-content-1.section.t-ad.a.href')}>
                {t('tab-content-1.section.t-ad.a.text')}
              </a>
            </aside>
          </section>
        </div>
        <div className="tab-content" id="tab-departments">
          <div className="section" style={{ paddingBottom: '32px' }}>
            <h2 className="sec-title">
              {t('section-panels.tab-content-2.section-1.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <p className="sec-sub">{t('section-panels.tab-content-2.section-1.sec-sub.text')}</p>
            <div className="dept-hero-grid">
              <div className="dept-hero-card">
                <div className="dhc-top" />
                <div className="dhc-body">
                  <div className="dhc-code">
                    {t('dept-hero-grid.dept-hero-card-1.dhc-body.dhc-code.text')}
                  </div>
                  <div className="dhc-name">
                    {t('dept-hero-grid.dept-hero-card-1.dhc-body.dhc-name.text')}
                  </div>
                  <div className="dhc-tag">
                    {t('dept-hero-grid.dept-hero-card-1.dhc-body.dhc-tag.text')}
                  </div>
                  <div className="dhc-desc">
                    {t('dept-hero-grid.dept-hero-card-1.dhc-body.dhc-desc.text')}
                  </div>
                  <div className="dhc-skills">
                    {Array.from({ length: 4 }, (_, i) => (
                      <DhcSkill key={i} t={t} i={i} />
                    ))}
                  </div>
                  <a
                    className="dhc-link"
                    href={t('dept-hero-grid.dept-hero-card-1.dhc-body.dhc-link.href')}
                  >
                    {t('dept-hero-grid.dept-hero-card-1.dhc-body.dhc-link.text')}
                  </a>
                </div>
              </div>
              <div className="dept-hero-card">
                <div className="dhc-top" />
                <div className="dhc-body">
                  <div className="dhc-code">
                    {t('dept-hero-grid.dept-hero-card-2.dhc-body.dhc-code.text')}
                  </div>
                  <div className="dhc-name">
                    {t('dept-hero-grid.dept-hero-card-2.dhc-body.dhc-name.text')}
                  </div>
                  <div className="dhc-tag">
                    {t('dept-hero-grid.dept-hero-card-2.dhc-body.dhc-tag.text')}
                  </div>
                  <div className="dhc-desc">
                    {t('dept-hero-grid.dept-hero-card-2.dhc-body.dhc-desc.text')}
                  </div>
                  <div className="dhc-skills">
                    {Array.from({ length: 4 }, (_, i) => (
                      <DhcSkill2 key={i} t={t} i={i} />
                    ))}
                  </div>
                  <a
                    className="dhc-link"
                    href={t('dept-hero-grid.dept-hero-card-2.dhc-body.dhc-link.href')}
                  >
                    {t('dept-hero-grid.dept-hero-card-2.dhc-body.dhc-link.text')}
                  </a>
                </div>
              </div>
              <div className="dept-hero-card">
                <div className="dhc-top" />
                <div className="dhc-body">
                  <div className="dhc-code">
                    {t('dept-hero-grid.dept-hero-card-3.dhc-body.dhc-code.text')}
                  </div>
                  <div className="dhc-name">
                    {t('dept-hero-grid.dept-hero-card-3.dhc-body.dhc-name.text')}
                  </div>
                  <div className="dhc-tag">
                    {t('dept-hero-grid.dept-hero-card-3.dhc-body.dhc-tag.text')}
                  </div>
                  <div className="dhc-desc">
                    {t('dept-hero-grid.dept-hero-card-3.dhc-body.dhc-desc.text')}
                  </div>
                  <div className="dhc-skills">
                    {Array.from({ length: 3 }, (_, i) => (
                      <DhcSkill3 key={i} t={t} i={i} />
                    ))}
                  </div>
                  <a
                    className="dhc-link"
                    href={t('dept-hero-grid.dept-hero-card-3.dhc-body.dhc-link.href')}
                  >
                    {t('dept-hero-grid.dept-hero-card-3.dhc-body.dhc-link.text')}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="section-alt">
            <h2 className="sec-title">
              {t('section-panels.tab-content-2.section-alt-1.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <div className="dept-detail" id="programme-computer-science">
              <div className="dept-detail-header">
                <div>
                  <div className="ddh-code">
                    {t('dept-detail.dept-detail-header.div.ddh-code.text')}
                  </div>
                  <div className="ddh-name">
                    {t('dept-detail.dept-detail-header.div.ddh-name.text')}
                  </div>
                </div>
                <div className="ddh-right">
                  <div className="ddh-duration">
                    {t('dept-detail.dept-detail-header.ddh-right.ddh-duration.text')}
                  </div>
                  <div className="ddh-degree">
                    {t('dept-detail.dept-detail-header.ddh-right.ddh-degree.text')}
                  </div>
                </div>
              </div>
              <div className="dept-detail-body">
                <div className="ddb-main">
                  <div className="ddb-section-title">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-section-title-1.text')}
                  </div>
                  <p className="ddb-para">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-para-1.text')}
                  </p>
                  <p className="ddb-para">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-para-2.text')}
                  </p>
                  <div className="ddb-section-title" style={{ marginTop: '24px' }}>
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-section-title-2.text')}
                  </div>
                  {Array.from({ length: 4 }, (_, i) => (
                    <OutcomeItem key={i} t={t} i={i} />
                  ))}
                </div>
                <div className="ddb-side">
                  <div className="ddb-section-title">
                    {t('dept-detail.dept-detail-body.ddb-side.ddb-section-title-1.text')}
                  </div>
                  {Array.from({ length: 3 }, (_, i) => (
                    <SideStat key={i} t={t} i={i} />
                  ))}
                  <div className="ddb-section-title" style={{ marginTop: '24px' }}>
                    {t('dept-detail.dept-detail-body.ddb-side.ddb-section-title-2.text')}
                  </div>
                  <div className="side-tag">
                    {t('dept-detail.dept-detail-body.ddb-side.side-tag.text')}
                  </div>
                  {Array.from({ length: 5 }, (_, i) => (
                    <SideItem key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <a
                className="dept-admission-link"
                href={t('tab-content-2.section-alt-1.dept-detail.dept-admission-link.href')}
                data-panel-link="tab-admission"
              >
                <div>
                  <div className="dal-text">
                    {t('dept-detail.dept-admission-link.div.dal-text.text')}
                  </div>
                  <div className="dal-sub">
                    {t('dept-detail.dept-admission-link.div.dal-sub.text')}
                  </div>
                </div>
                <div className="dal-arrow" />
              </a>
            </div>
          </div>
          <div className="section">
            <h2 className="sec-title">
              {t('section-panels.tab-content-2.section-2.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <div className="dept-detail" id="programme-software-engineering">
              <div className="dept-detail-header">
                <div>
                  <div className="ddh-code">
                    {t('dept-detail.dept-detail-header.div.ddh-code.text#2')}
                  </div>
                  <div className="ddh-name">
                    {t('dept-detail.dept-detail-header.div.ddh-name.text#2')}
                  </div>
                </div>
                <div className="ddh-right">
                  <div className="ddh-duration">
                    {t('dept-detail.dept-detail-header.ddh-right.ddh-duration.text#2')}
                  </div>
                  <div className="ddh-degree">
                    {t('dept-detail.dept-detail-header.ddh-right.ddh-degree.text#2')}
                  </div>
                </div>
              </div>
              <div className="dept-detail-body">
                <div className="ddb-main">
                  <div className="ddb-section-title">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-section-title-1.text#2')}
                  </div>
                  <p className="ddb-para">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-para-1.text#2')}
                  </p>
                  <p className="ddb-para">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-para-2.text#2')}
                  </p>
                  <div className="ddb-section-title" style={{ marginTop: '24px' }}>
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-section-title-2.text#2')}
                  </div>
                  {Array.from({ length: 4 }, (_, i) => (
                    <OutcomeItem2 key={i} t={t} i={i} />
                  ))}
                </div>
                <div className="ddb-side">
                  <div className="ddb-section-title">
                    {t('dept-detail.dept-detail-body.ddb-side.ddb-section-title-1.text#2')}
                  </div>
                  {Array.from({ length: 3 }, (_, i) => (
                    <SideStat2 key={i} t={t} i={i} />
                  ))}
                  <div className="ddb-section-title" style={{ marginTop: '24px' }}>
                    {t('dept-detail.dept-detail-body.ddb-side.ddb-section-title-2.text#2')}
                  </div>
                  <div className="side-tag">
                    {t('dept-detail.dept-detail-body.ddb-side.side-tag.text#2')}
                  </div>
                  {Array.from({ length: 5 }, (_, i) => (
                    <SideItem2 key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <a
                className="dept-admission-link"
                href={t('tab-content-2.section-2.dept-detail.dept-admission-link.href')}
                data-panel-link="tab-admission"
              >
                <div>
                  <div className="dal-text">
                    {t('dept-detail.dept-admission-link.div.dal-text.text#2')}
                  </div>
                  <div className="dal-sub">
                    {t('dept-detail.dept-admission-link.div.dal-sub.text#2')}
                  </div>
                </div>
                <div className="dal-arrow" />
              </a>
            </div>
          </div>
          <div className="section-alt">
            <h2 className="sec-title">
              {t('section-panels.tab-content-2.section-alt-2.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <div className="dept-detail" id="programme-cybersecurity">
              <div className="dept-detail-header">
                <div>
                  <div className="ddh-code">
                    {t('dept-detail.dept-detail-header.div.ddh-code.text#3')}
                  </div>
                  <div className="ddh-name">
                    {t('dept-detail.dept-detail-header.div.ddh-name.text#3')}
                  </div>
                </div>
                <div className="ddh-right">
                  <div className="ddh-duration">
                    {t('dept-detail.dept-detail-header.ddh-right.ddh-duration.text#3')}
                  </div>
                  <div className="ddh-degree">
                    {t('dept-detail.dept-detail-header.ddh-right.ddh-degree.text#3')}
                  </div>
                </div>
              </div>
              <div className="dept-detail-body">
                <div className="ddb-main">
                  <div className="ddb-section-title">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-section-title-1.text#3')}
                  </div>
                  <p className="ddb-para">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-para-1.text#3')}
                  </p>
                  <p className="ddb-para">
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-para-2.text#3')}
                  </p>
                  <div className="ddb-section-title" style={{ marginTop: '24px' }}>
                    {t('dept-detail.dept-detail-body.ddb-main.ddb-section-title-2.text#3')}
                  </div>
                  {Array.from({ length: 4 }, (_, i) => (
                    <OutcomeItem3 key={i} t={t} i={i} />
                  ))}
                </div>
                <div className="ddb-side">
                  <div className="ddb-section-title">
                    {t('dept-detail.dept-detail-body.ddb-side.ddb-section-title-1.text#3')}
                  </div>
                  {Array.from({ length: 3 }, (_, i) => (
                    <SideStat3 key={i} t={t} i={i} />
                  ))}
                  <div className="ddb-section-title" style={{ marginTop: '24px' }}>
                    {t('dept-detail.dept-detail-body.ddb-side.ddb-section-title-2.text#3')}
                  </div>
                  <div className="side-tag">
                    {t('dept-detail.dept-detail-body.ddb-side.side-tag.text#3')}
                  </div>
                  {Array.from({ length: 5 }, (_, i) => (
                    <SideItem3 key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <a
                className="dept-admission-link"
                href={t('tab-content-2.section-alt-2.dept-detail.dept-admission-link.href')}
                data-panel-link="tab-admission"
              >
                <div>
                  <div className="dal-text">
                    {t('dept-detail.dept-admission-link.div.dal-text.text#3')}
                  </div>
                  <div className="dal-sub">
                    {t('dept-detail.dept-admission-link.div.dal-sub.text#3')}
                  </div>
                </div>
                <div className="dal-arrow" />
              </a>
            </div>
          </div>
        </div>
        <div className="tab-content" id="tab-facilities">
          <div className="section">
            <h2 className="sec-title">
              {t('section-panels.tab-content-3.section.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <p className="sec-sub">{t('section-panels.tab-content-3.section.sec-sub.text')}</p>
            <div className="facilities-grid">
              <div className="fac-card featured">
                <div className="img-ph" style={{ height: '260px' }}>
                  <div className="img-ph-icon">
                    {t('facilities-grid.fac-card-1.img-ph.img-ph-icon.text')}
                  </div>
                  <div className="img-ph-label">
                    {t('facilities-grid.fac-card-1.img-ph.img-ph-label.text')}
                  </div>
                </div>
                <div className="fac-body">
                  <div className="fac-num">
                    {t('facilities-grid.fac-card-1.fac-body.fac-num.text')}
                  </div>
                  <div className="fac-name">
                    {t('facilities-grid.fac-card-1.fac-body.fac-name.text')}
                  </div>
                  <div className="fac-desc">
                    {t('facilities-grid.fac-card-1.fac-body.fac-desc.text')}
                  </div>
                  <div className="fac-tag-row">
                    {Array.from({ length: 4 }, (_, i) => (
                      <FacTag key={i} t={t} i={i} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="fac-card">
                <div className="img-ph" style={{ height: '180px' }}>
                  <div className="img-ph-icon">
                    {t('facilities-grid.fac-card-2.img-ph.img-ph-icon.text')}
                  </div>
                  <div className="img-ph-label">
                    {t('facilities-grid.fac-card-2.img-ph.img-ph-label.text')}
                  </div>
                </div>
                <div className="fac-body">
                  <div className="fac-num">
                    {t('facilities-grid.fac-card-2.fac-body.fac-num.text')}
                  </div>
                  <div className="fac-name">
                    {t('facilities-grid.fac-card-2.fac-body.fac-name.text')}
                  </div>
                  <div className="fac-desc">
                    {t('facilities-grid.fac-card-2.fac-body.fac-desc.text')}
                  </div>
                  <div className="fac-tag-row">
                    {Array.from({ length: 3 }, (_, i) => (
                      <FacTag2 key={i} t={t} i={i} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="fac-card">
                <div className="img-ph" style={{ height: '180px' }}>
                  <div className="img-ph-icon">
                    {t('facilities-grid.fac-card-3.img-ph.img-ph-icon.text')}
                  </div>
                  <div className="img-ph-label">
                    {t('facilities-grid.fac-card-3.img-ph.img-ph-label.text')}
                  </div>
                </div>
                <div className="fac-body">
                  <div className="fac-num">
                    {t('facilities-grid.fac-card-3.fac-body.fac-num.text')}
                  </div>
                  <div className="fac-name">
                    {t('facilities-grid.fac-card-3.fac-body.fac-name.text')}
                  </div>
                  <div className="fac-desc">
                    {t('facilities-grid.fac-card-3.fac-body.fac-desc.text')}
                  </div>
                  <div className="fac-tag-row">
                    {Array.from({ length: 3 }, (_, i) => (
                      <FacTag3 key={i} t={t} i={i} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="fac-card">
                <div className="img-ph" style={{ height: '180px' }}>
                  <div className="img-ph-icon">
                    {t('facilities-grid.fac-card-4.img-ph.img-ph-icon.text')}
                  </div>
                  <div className="img-ph-label">
                    {t('facilities-grid.fac-card-4.img-ph.img-ph-label.text')}
                  </div>
                </div>
                <div className="fac-body">
                  <div className="fac-num">
                    {t('facilities-grid.fac-card-4.fac-body.fac-num.text')}
                  </div>
                  <div className="fac-name">
                    {t('facilities-grid.fac-card-4.fac-body.fac-name.text')}
                  </div>
                  <div className="fac-desc">
                    {t('facilities-grid.fac-card-4.fac-body.fac-desc.text')}
                  </div>
                  <div className="fac-tag-row">
                    <span className="fac-tag">
                      {t('fac-card-4.fac-body.fac-tag-row.fac-tag-1.text')}
                    </span>
                    <span className="fac-tag">
                      {t('fac-card-4.fac-body.fac-tag-row.fac-tag-2.text')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="fac-card">
                <div className="img-ph" style={{ height: '180px' }}>
                  <div className="img-ph-icon">
                    {t('facilities-grid.fac-card-5.img-ph.img-ph-icon.text')}
                  </div>
                  <div className="img-ph-label">
                    {t('facilities-grid.fac-card-5.img-ph.img-ph-label.text')}
                  </div>
                </div>
                <div className="fac-body">
                  <div className="fac-num">
                    {t('facilities-grid.fac-card-5.fac-body.fac-num.text')}
                  </div>
                  <div className="fac-name">
                    {t('facilities-grid.fac-card-5.fac-body.fac-name.text')}
                  </div>
                  <div className="fac-desc">
                    {t('facilities-grid.fac-card-5.fac-body.fac-desc.text')}
                  </div>
                  <div className="fac-tag-row">
                    <span className="fac-tag">
                      {t('fac-card-5.fac-body.fac-tag-row.fac-tag-1.text')}
                    </span>
                    <span className="fac-tag">
                      {t('fac-card-5.fac-body.fac-tag-row.fac-tag-2.text')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-content" id="tab-admission">
          <div className="section">
            <h2 className="sec-title">
              {t('section-panels.tab-content-4.section.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <p className="sec-sub">{t('section-panels.tab-content-4.section.sec-sub.text')}</p>
            <div className="dept-req-tabs" style={{ marginTop: '32px' }}>
              <button
                className="drt-btn active"
                data-tab-target="req-all"
                data-tab-group="requirements"
                type="button"
              >
                {t('tab-content-4.section.dept-req-tabs.drt-btn-1.text')}
              </button>
              {Array.from({ length: 3 }, (_, i) => (
                <DrtBtn key={i} t={t} i={i} />
              ))}
            </div>
            <div className="req-tab-content active" id="req-all">
              <div className="req-block">
                <div className="req-block-title">
                  <span className="req-badge">
                    {t('req-tab-content-1.req-block-1.req-block-title.req-badge.text')}
                  </span>
                  {t('section.req-tab-content-1.req-block-1.req-block-title.text')}
                </div>
                <div className="req-list">
                  {Array.from({ length: 4 }, (_, i) => (
                    <ReqItem key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <div className="req-block">
                <div className="req-block-title">
                  <span className="req-badge">
                    {t('req-tab-content-1.req-block-2.req-block-title.req-badge.text')}
                  </span>
                  {t('section.req-tab-content-1.req-block-2.req-block-title.text')}
                </div>
                <div className="req-list">
                  {Array.from({ length: 3 }, (_, i) => (
                    <ReqItem2 key={i} t={t} i={i} />
                  ))}
                </div>
              </div>
              <div className="req-note">
                <div className="req-note-title">
                  {t('section.req-tab-content-1.req-note.req-note-title.text')}
                </div>
                <div className="req-note-text">
                  {t('section.req-tab-content-1.req-note.req-note-text.text')}
                </div>
              </div>
            </div>
            {Array.from({ length: 3 }, (_, i) => (
              <ReqCs key={i} t={t} i={i} />
            ))}
          </div>
        </div>
        <div className="tab-content" id="tab-research">
          <div className="t-inline-note">
            <strong>{t('section-panels.tab-content-5.t-inline-note.strong.text')}</strong>
            <p>{t('section-panels.tab-content-5.t-inline-note.p.text')}</p>
            <button
              type="button"
              className="t-button"
              data-unavailable="Submit research"
              data-unavailable-message="Research submissions will include title, abstract, authors, tags, PDF or link, and author consent. Nothing goes live before approval."
            >
              {t('section-panels.tab-content-5.t-inline-note.t-button.text')}
            </button>
          </div>
          <div className="section">
            <h2 className="sec-title">
              {t('section-panels.tab-content-5.section.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <p className="sec-sub">{t('section-panels.tab-content-5.section.sec-sub.text')}</p>
            <div className="research-grid">
              <div className="res-featured">
                <div className="img-ph" style={{ height: '200px' }}>
                  <div className="img-ph-icon">
                    {t('research-grid.res-featured.img-ph.img-ph-icon.text')}
                  </div>
                  <div className="img-ph-label">
                    {t('research-grid.res-featured.img-ph.img-ph-label.text')}
                  </div>
                </div>
                <div className="res-feat-body">
                  <div className="res-feat-meta">
                    <span className="res-cat">
                      {t('res-featured.res-feat-body.res-feat-meta.res-cat.text')}
                    </span>
                    <span className="res-date">
                      {t('res-featured.res-feat-body.res-feat-meta.res-date.text')}
                    </span>
                  </div>
                  <div className="res-feat-title">
                    {t('research-grid.res-featured.res-feat-body.res-feat-title.text')}
                  </div>
                  <div className="res-feat-excerpt">
                    {t('research-grid.res-featured.res-feat-body.res-feat-excerpt.text')}
                  </div>
                  <div className="res-authors">
                    {t('research-grid.res-featured.res-feat-body.res-authors.text')}
                    <strong>{t('res-featured.res-feat-body.res-authors.strong.text')}</strong>
                    {t('research-grid.res-featured.res-feat-body.res-authors.text-2')}
                  </div>
                </div>
              </div>
              <div className="res-list">
                {Array.from({ length: 4 }, (_, i) => (
                  <ResItem key={i} t={t} i={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="tab-content" id="tab-courses">
          <div className="section">
            <h2 className="sec-title">
              {t('section-panels.tab-content-6.section.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <p className="sec-sub">{t('section-panels.tab-content-6.section.sec-sub.text')}</p>
            <div className="course-dept-sel" style={{ marginTop: '32px' }}>
              <button
                className="cds-btn active"
                data-tab-target="course-cs"
                data-tab-group="courses"
                type="button"
              >
                {t('tab-content-6.section.course-dept-sel.cds-btn-1.text')}
              </button>
              <button
                className="cds-btn"
                data-tab-target="course-se"
                data-tab-group="courses"
                type="button"
              >
                {t('tab-content-6.section.course-dept-sel.cds-btn-2.text')}
              </button>
              <button
                className="cds-btn"
                data-tab-target="course-cyb"
                data-tab-group="courses"
                type="button"
              >
                {t('tab-content-6.section.course-dept-sel.cds-btn-3.text')}
              </button>
            </div>
            <div className="course-dept-panel active" id="course-cs">
              <div className="semester-block">
                <div className="sem-header">
                  <span className="sem-label">
                    {t('course-dept-panel-1.semester-block-1.sem-header.sem-label.text')}
                  </span>
                  <div className="sem-line" />
                </div>
                <table className="course-table">
                  <thead>
                    <tr>
                      {Array.from({ length: 4 }, (_, i) => (
                        <CourseTableThItem key={i} t={t} i={i} />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }, (_, i) => (
                      <CourseTableTrItem key={i} t={t} i={i} />
                    ))}
                    <tr>
                      <td className="course-code">
                        {t('course-table.tbody.tr-6.course-code.text')}
                      </td>
                      <td className="course-title-cell">
                        {t('course-table.tbody.tr-6.course-title-cell.text')}
                      </td>
                      <td className="course-units">
                        {t('course-table.tbody.tr-6.course-units.text')}
                      </td>
                      <td>
                        <span className="ct-elective">{t('tbody.tr-6.td.ct-elective.text')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="semester-block">
                <div className="sem-header">
                  <span className="sem-label">
                    {t('course-dept-panel-1.semester-block-2.sem-header.sem-label.text')}
                  </span>
                  <div className="sem-line" />
                </div>
                <table className="course-table">
                  <thead>
                    <tr>
                      {Array.from({ length: 4 }, (_, i) => (
                        <CourseTableThItem2 key={i} t={t} i={i} />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }, (_, i) => (
                      <CourseTableTrItem2 key={i} t={t} i={i} />
                    ))}
                    <tr>
                      <td className="course-code">
                        {t('course-table.tbody.tr-5.course-code.text')}
                      </td>
                      <td className="course-title-cell">
                        {t('course-table.tbody.tr-5.course-title-cell.text')}
                      </td>
                      <td className="course-units">
                        {t('course-table.tbody.tr-5.course-units.text')}
                      </td>
                      <td>
                        <span className="ct-elective">{t('tbody.tr-5.td.ct-elective.text')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: '8px' }}>
                {t('tab-content-6.section.course-dept-panel-1.p.text')}
              </p>
            </div>
            <div className="course-dept-panel" id="course-se">
              <div className="semester-block">
                <div className="sem-header">
                  <span className="sem-label">
                    {t('course-dept-panel-2.semester-block-1.sem-header.sem-label.text')}
                  </span>
                  <div className="sem-line" />
                </div>
                <table className="course-table">
                  <thead>
                    <tr>
                      {Array.from({ length: 4 }, (_, i) => (
                        <CourseTableThItem3 key={i} t={t} i={i} />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }, (_, i) => (
                      <CourseTableTrItem3 key={i} t={t} i={i} />
                    ))}
                    <tr>
                      <td className="course-code">
                        {t('course-table.tbody.tr-5.course-code.text#2')}
                      </td>
                      <td className="course-title-cell">
                        {t('course-table.tbody.tr-5.course-title-cell.text#2')}
                      </td>
                      <td className="course-units">
                        {t('course-table.tbody.tr-5.course-units.text#2')}
                      </td>
                      <td>
                        <span className="ct-elective">{t('tbody.tr-5.td.ct-elective.text#2')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="semester-block">
                <div className="sem-header">
                  <span className="sem-label">
                    {t('course-dept-panel-2.semester-block-2.sem-header.sem-label.text')}
                  </span>
                  <div className="sem-line" />
                </div>
                <table className="course-table">
                  <thead>
                    <tr>
                      {Array.from({ length: 4 }, (_, i) => (
                        <CourseTableThItem4 key={i} t={t} i={i} />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }, (_, i) => (
                      <CourseTableTrItem4 key={i} t={t} i={i} />
                    ))}
                    <tr>
                      <td className="course-code">
                        {t('course-table.tbody.tr-5.course-code.text#3')}
                      </td>
                      <td className="course-title-cell">
                        {t('course-table.tbody.tr-5.course-title-cell.text#3')}
                      </td>
                      <td className="course-units">
                        {t('course-table.tbody.tr-5.course-units.text#3')}
                      </td>
                      <td>
                        <span className="ct-elective">{t('tbody.tr-5.td.ct-elective.text#3')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: '8px' }}>
                {t('tab-content-6.section.course-dept-panel-2.p.text')}
              </p>
            </div>
            <div className="course-dept-panel" id="course-cyb">
              <div className="semester-block">
                <div className="sem-header">
                  <span className="sem-label">
                    {t('course-dept-panel-3.semester-block-1.sem-header.sem-label.text')}
                  </span>
                  <div className="sem-line" />
                </div>
                <table className="course-table">
                  <thead>
                    <tr>
                      {Array.from({ length: 4 }, (_, i) => (
                        <CourseTableThItem5 key={i} t={t} i={i} />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }, (_, i) => (
                      <CourseTableTrItem5 key={i} t={t} i={i} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="semester-block">
                <div className="sem-header">
                  <span className="sem-label">
                    {t('course-dept-panel-3.semester-block-2.sem-header.sem-label.text')}
                  </span>
                  <div className="sem-line" />
                </div>
                <table className="course-table">
                  <thead>
                    <tr>
                      {Array.from({ length: 4 }, (_, i) => (
                        <CourseTableThItem6 key={i} t={t} i={i} />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }, (_, i) => (
                      <CourseTableTrItem6 key={i} t={t} i={i} />
                    ))}
                    <tr>
                      <td className="course-code">
                        {t('course-table.tbody.tr-5.course-code.text#4')}
                      </td>
                      <td className="course-title-cell">
                        {t('course-table.tbody.tr-5.course-title-cell.text#4')}
                      </td>
                      <td className="course-units">
                        {t('course-table.tbody.tr-5.course-units.text#4')}
                      </td>
                      <td>
                        <span className="ct-elective">{t('tbody.tr-5.td.ct-elective.text#4')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: '8px' }}>
                {t('tab-content-6.section.course-dept-panel-3.p.text')}
              </p>
            </div>
            <div className="drive-link-box editorial-resource" style={{ marginTop: '40px' }}>
              <div>
                <div className="dlb-icon">{t('section.drive-link-box.div.dlb-icon.text')}</div>
                <div className="dlb-title">{t('section.drive-link-box.div.dlb-title.text')}</div>
                <div className="dlb-sub">{t('section.drive-link-box.div.dlb-sub.text')}</div>
              </div>
              <button
                className="dlb-btn"
                type="button"
                data-unavailable="Course materials"
                data-unavailable-message="The reference includes a course-drive section, but no drive address was supplied. Please request the current materials from SOC."
              >
                {t('tab-content-6.section.drive-link-box.dlb-btn.text')}
              </button>
            </div>
          </div>
        </div>
        <div className="tab-content" id="tab-careers">
          <div className="section">
            <h2 className="sec-title">
              {t('section-panels.tab-content-7.section.sec-title.text')}
            </h2>
            <div className="sec-rule" />
            <p className="sec-sub">{t('section-panels.tab-content-7.section.sec-sub.text')}</p>
            <div className="career-grid">
              {Array.from({ length: 3 }, (_, i) => (
                <CareerDept key={i} t={t} i={i} />
              ))}
            </div>
          </div>
          <div className="inspo-section">
            <div className="inspo-title">
              {t('section-panels.tab-content-7.inspo-section.inspo-title.text')}
            </div>
            <div className="inspo-sub">
              {t('section-panels.tab-content-7.inspo-section.inspo-sub.text')}
            </div>
            <div className="inspo-grid">
              {Array.from({ length: 3 }, (_, i) => (
                <InspoCard key={i} t={t} i={i} />
              ))}
            </div>
          </div>
        </div>
        <div className="tab-content" id="tab-tutoring">
          <section className="section t-workspace">
            <h2 className="t-section-title">
              {t('section-panels.tab-content-8.section.t-section-title.text')}
            </h2>
            <p className="t-intro">{t('section-panels.tab-content-8.section.t-intro.text')}</p>
            <div className="t-grid-two">
              <article className="t-paper">
                <span className="t-tag">{t('section.t-grid-two.t-paper-1.t-tag.text')}</span>
                <h3>{t('section.t-grid-two.t-paper-1.h3.text')}</h3>
                <p>{t('section.t-grid-two.t-paper-1.p.text')}</p>
                <button
                  type="button"
                  className="t-button"
                  data-unavailable="Find a tutor"
                  data-unavailable-message="Tutor names and available courses will appear after students opt in and the academics team approves them."
                >
                  {t('section.t-grid-two.t-paper-1.t-button.text')}
                </button>
              </article>
              <article className="t-paper t-paper--grey">
                <h3>{t('section.t-grid-two.t-paper-2.h3.text')}</h3>
                <p>{t('section.t-grid-two.t-paper-2.p.text')}</p>
                <button
                  type="button"
                  className="t-button"
                  data-unavailable="Offer to tutor"
                  data-unavailable-message="The tutor submission form is part of the later build. This mockup does not collect your details."
                >
                  {t('section.t-grid-two.t-paper-2.t-button.text')}
                </button>
              </article>
            </div>
          </section>
        </div>
        <div className="tab-content" id="tab-materials">
          <section className="section t-workspace">
            <h2 className="t-section-title">
              {t('section-panels.tab-content-9.section.t-section-title.text')}
            </h2>
            <p className="t-intro">{t('section-panels.tab-content-9.section.t-intro.text')}</p>
            <aside
              className="t-ad t-ad--slim"
              data-ad-slot="6"
              aria-label={t('section-panels.tab-content-9.section.t-ad.aria-label')}
            >
              <span className="t-tag">{t('tab-content-9.section.t-ad.t-tag.text')}</span>
              <strong>{t('tab-content-9.section.t-ad.strong.text')}</strong>
              <a href={t('tab-content-9.section.t-ad.a.href')}>
                {t('tab-content-9.section.t-ad.a.text')}
              </a>
            </aside>
            <div className="t-filters" data-preference-group="materials">
              <label>
                {t('tab-content-9.section.t-filters.label-1.text')}
                <select
                  data-programme=""
                  aria-label={t('section.t-filters.label-1.select.aria-label#2')}
                >
                  {Array.from({ length: 4 }, (_, i) => (
                    <TFiltersOptionItem3 key={i} t={t} i={i} />
                  ))}
                </select>
              </label>
              <label>
                {t('tab-content-9.section.t-filters.label-2.text')}
                <select
                  data-level=""
                  aria-label={t('section.t-filters.label-2.select.aria-label#2')}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <TFiltersOptionItem4 key={i} t={t} i={i} />
                  ))}
                </select>
              </label>
            </div>
            <div className="t-resource-list">
              {Array.from({ length: 4 }, (_, i) => (
                <TResource key={i} t={t} i={i} />
              ))}
            </div>
            <p className="t-meta" data-material-status="" role="status" />
          </section>
        </div>
      </div>
    </div>
  );
}

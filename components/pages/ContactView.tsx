import type { T } from '@/lib/page-copy';
export function ContactView({ t, children }: { t: T; children?: React.ReactNode }) {
  return (
    <main id="main-content">
      <ReferenceSurface t={t} />
      {children}
    </main>
  );
}

function ContactCategoryOptionItem({ t, i }: { t: T; i: number }) {
  return <option>{t(`contact-form.form-group-3.form-select.option-1.${i}.text`)}</option>;
}

function ReferenceSurfaceSection({ t }: { t: T }) {
  return (
    <div className="section" style={{ background: '#fff' }}>
      <h2 className="sec-title">{t('reference-surface.section.sec-title.text')}</h2>
      <div className="sec-rule" />
      <div className="contact-grid">
        <form
          id="contact-form"
          data-contact-form=""
          data-inbox="soc@madukauniversity.edu.ng"
          data-mockup-contact=""
          method="post"
          action="/api/legacy-form"
        >
          <div className="form-group">
            <label className="form-label" htmlFor="contact-name">
              {t('contact-grid.contact-form.form-group-1.form-label.text')}
            </label>
            <input
              className="form-input"
              type="text"
              placeholder={t('contact-grid.contact-form.form-group-1.form-input.placeholder')}
              name="name"
              id="contact-name"
              required
              maxLength={200}
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="contact-email">
              {t('contact-grid.contact-form.form-group-2.form-label.text')}
            </label>
            <input
              className="form-input"
              type="email"
              placeholder={t('contact-grid.contact-form.form-group-2.form-input.placeholder')}
              name="email"
              id="contact-email"
              required
              maxLength={200}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="contact-category">
              {t('contact-grid.contact-form.form-group-3.form-label.text')}
            </label>
            <select className="form-select" name="category" id="contact-category" required>
              {Array.from({ length: 11 }, (_, i) => (
                <ContactCategoryOptionItem key={i} t={t} i={i} />
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="contact-subject">
              {t('contact-grid.contact-form.form-group-4.form-label.text')}
            </label>
            <input
              className="form-input"
              type="text"
              placeholder={t('contact-grid.contact-form.form-group-4.form-input.placeholder')}
              name="subject"
              id="contact-subject"
              required
              maxLength={200}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="contact-message">
              {t('contact-grid.contact-form.form-group-5.form-label.text')}
            </label>
            <textarea
              className="form-textarea"
              placeholder={t('contact-grid.contact-form.form-group-5.form-textarea.placeholder')}
              name="message"
              id="contact-message"
              required
              maxLength={4000}
            />
          </div>
          <button className="btn-send" type="submit">
            {t('section.contact-grid.contact-form.btn-send.text')}
          </button>
          <p className="form-notice">{t('section.contact-grid.contact-form.form-notice.text')}</p>
          <p className="form-status" role="status" />
        </form>
        <div className="contact-info">
          <div className="info-block">
            <div className="info-label">
              {t('contact-grid.contact-info.info-block-1.info-label.text')}
            </div>
            <div className="info-val">
              <a href={t('contact-info.info-block-1.info-val.a.href')}>
                {t('contact-info.info-block-1.info-val.a.text')}
              </a>
            </div>
          </div>
          <div className="info-block">
            <div className="info-label">
              {t('contact-grid.contact-info.info-block-2.info-label.text')}
            </div>
            <div className="info-val">
              {t('contact-grid.contact-info.info-block-2.info-val.text')}
              <br />
              {t('contact-grid.contact-info.info-block-2.info-val.text-2')}
              <br />
              {t('contact-grid.contact-info.info-block-2.info-val.text-3')}
            </div>
          </div>
          <div className="info-block">
            <div className="info-label">
              {t('contact-grid.contact-info.info-block-3.info-label.text')}
            </div>
            <div className="info-val">
              {t('contact-grid.contact-info.info-block-3.info-val.text')}
              <br />
              {t('contact-grid.contact-info.info-block-3.info-val.text-2')}
            </div>
          </div>
          <div className="info-block">
            <div className="info-label">
              {t('contact-grid.contact-info.info-block-4.info-label.text')}
            </div>
            <div className="info-val">
              <button type="button" data-unavailable="+234 XXX XXX XXXX">
                {t('contact-info.info-block-4.info-val.button.text')}
              </button>
            </div>
          </div>
          <div className="info-block">
            <div className="info-label">
              {t('contact-grid.contact-info.info-block-5.info-label.text')}
            </div>
            <div className="info-val">
              <a href={t('contact-info.info-block-5.info-val.a.href')}>
                {t('contact-info.info-block-5.info-val.a.text')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialCard({ t, i }: { t: T; i: number }) {
  return (
    <button
      className="social-card"
      type="button"
      data-unavailable={t(
        `reference-surface.socials-section.socials-grid.social-card-1.${i}.data-unavailable~`,
      )}
    >
      <div className="social-icon">
        {t(`reference-surface.socials-section.socials-grid.social-card-1.${i}.social-icon.text`)}
      </div>
      <div>
        <div className="social-name">
          {t(
            `reference-surface.socials-section.socials-grid.social-card-1.${i}.div.social-name.text`,
          )}
        </div>
        <div className="social-handle">
          {t(
            `reference-surface.socials-section.socials-grid.social-card-1.${i}.div.social-handle.text`,
          )}
        </div>
      </div>
    </button>
  );
}

function ContactCard({ t, i }: { t: T; i: number }) {
  return (
    <div className="contact-card">
      <div className="contact-card-role">
        {t(
          `reference-surface.staff-contacts.contacts-grid.contact-card-1.${i}.contact-card-role.text`,
        )}
      </div>
      <div className="contact-card-name">
        {t(
          `reference-surface.staff-contacts.contacts-grid.contact-card-1.${i}.contact-card-name.text`,
        )}
      </div>
      <div className="contact-card-title">
        {t(
          `reference-surface.staff-contacts.contacts-grid.contact-card-1.${i}.contact-card-title.text`,
        )}
      </div>
      <div className="contact-detail">
        <div className="contact-detail-icon" aria-hidden="true">
          {t(
            `reference-surface.staff-contacts.contacts-grid.contact-card-1.${i}.contact-detail-1.contact-detail-icon.text`,
          )}
        </div>
        <div className="contact-detail-text">
          <a
            href={t(
              `reference-surface.staff-contacts.contacts-grid.contact-card-1.${i}.contact-detail-1.contact-detail-text.a.href`,
            )}
          >
            {t(
              `reference-surface.staff-contacts.contacts-grid.contact-card-1.${i}.contact-detail-1.contact-detail-text.a.text`,
            )}
          </a>
        </div>
      </div>
      <div className="contact-detail">
        <div className="contact-detail-icon" aria-hidden="true">
          {t(
            `reference-surface.staff-contacts.contacts-grid.contact-card-1.${i}.contact-detail-2.contact-detail-icon.text`,
          )}
        </div>
        <div className="contact-detail-text">
          {t(
            `reference-surface.staff-contacts.contacts-grid.contact-card-1.${i}.contact-detail-2.contact-detail-text.text`,
          )}
        </div>
      </div>
    </div>
  );
}

function ReferenceSurface({ t }: { t: T }) {
  return (
    <div className="reference-surface reference-contact">
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
      <ReferenceSurfaceSection t={t} />
      <div className="map-section">
        <div className="map-ph">
          <a
            className="map-directions"
            href={t('reference-surface.map-section.map-ph.map-directions.href')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{t('map-section.map-ph.map-directions.span-1.text')}</span>
            <strong>
              {t('map-section.map-ph.map-directions.strong.text')}
              <br />
              {t('map-section.map-ph.map-directions.strong.text-2')}
            </strong>
            <span>{t('map-section.map-ph.map-directions.span-2.text')}</span>
          </a>
        </div>
      </div>
      <div className="socials-section">
        <h2 className="sec-title" style={{}}>
          {t('reference-surface.socials-section.sec-title.text')}
        </h2>
        <div style={{ width: '26px', height: '2px', background: '#fff', margin: '12px 0 20px' }} />
        <p style={{ maxWidth: '500px' }}>{t('reference-surface.socials-section.p.text')}</p>
        <div className="socials-grid">
          {Array.from({ length: 4 }, (_, i) => (
            <SocialCard key={i} t={t} i={i} />
          ))}
        </div>
      </div>
      <div className="staff-contacts">
        <h2 className="sec-title">{t('reference-surface.staff-contacts.sec-title.text')}</h2>
        <div style={{ width: '26px', height: '2px', background: '#111', margin: '12px 0 20px' }} />
        <div className="contacts-grid">
          {Array.from({ length: 3 }, (_, i) => (
            <ContactCard key={i} t={t} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

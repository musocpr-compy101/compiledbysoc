/* Mobile page sections: one trigger and a native, keyboard-accessible sheet. */
(() => {
  const surface = document.querySelector('.reference-surface');
  const index = surface?.querySelector('.section-index');
  const tabs = index ? [...index.querySelectorAll('[data-tab-group="main"]')] : [];
  if (!tabs.length || typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const mobile = matchMedia('(max-width: 768px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'section-picker-trigger';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'section-picker-dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = '<span class="section-picker-current"></span><span class="section-picker-action">Sections <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 6h18M6 12h12M10 18h4"/></svg></span>';
  index.prepend(trigger);
  const sheet = document.createElement('dialog');
  sheet.id = 'section-picker-dialog';
  sheet.className = 'section-picker-sheet';
  sheet.setAttribute('aria-labelledby', 'section-picker-title');
  sheet.innerHTML = '<div class="section-picker-top"><div><h2 id="section-picker-title">Where to?</h2><p>Choose a section to explore.</p></div><button type="button" class="section-picker-close" aria-label="Close section picker"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="section-picker-options"></div>';
  document.body.append(sheet);
  const options = sheet.querySelector('.section-picker-options');
  const labels = tabs.map(tab => (tab.dataset.sectionLabel || tab.textContent).replace(/\s+/g, ' ').trim().replace(/\s+\d+$/, ''));
  const choices = tabs.map((tab, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'section-picker-option';
    const icon = tab.querySelector('.desktop-index-icon');
    if (icon) {
      const clone = icon.cloneNode(true);
      clone.className = 'section-picker-icon';
      button.append(clone);
    }
    const copy = document.createElement('span');
    copy.className = 'section-picker-copy';
    const title = document.createElement('strong');
    title.textContent = labels[i];
    const description = document.createElement('small');
    description.textContent = tab.querySelector('.desktop-index-description')?.textContent || '';
    copy.append(title, description);
    const check = document.createElement('span');
    check.className = 'section-picker-check';
    check.setAttribute('aria-hidden', 'true');
    check.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>';
    button.append(copy, check);
    button.addEventListener('click', () => {
      tab.click();
      sheet.close();
      requestAnimationFrame(() => {
        const top = index.getBoundingClientRect().top;
        if (top < 0 || top > innerHeight / 2) index.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'instant' : 'smooth' });
      });
    });
    options.append(button);
    return button;
  });
  const sync = () => {
    let current = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    if (current < 0) current = 0;
    trigger.querySelector('.section-picker-current').textContent = labels[current];
    trigger.setAttribute('aria-label', 'Choose a section. Current section: ' + labels[current]);
    choices.forEach((button, i) => {
      if (i === current) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  };
  trigger.addEventListener('click', () => {
    sync();
    sheet.showModal();
    document.documentElement.classList.add('section-picker-open');
    trigger.setAttribute('aria-expanded', 'true');
    choices.find(button => button.hasAttribute('aria-current'))?.focus({ preventScroll: true });
    choices.find(button => button.hasAttribute('aria-current'))?.scrollIntoView({ block: 'nearest' });
  });
  sheet.querySelector('.section-picker-close').addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', event => {
    if (event.target !== sheet) return;
    const box = sheet.getBoundingClientRect();
    if (event.clientY < box.top || event.clientY > box.bottom || event.clientX < box.left || event.clientX > box.right) sheet.close();
  });
  sheet.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('section-picker-open');
  });
  mobile.addEventListener('change', () => { if (!mobile.matches && sheet.open) sheet.close(); });
  surface.addEventListener('soc:sectionchange', sync);
  index.classList.add('has-section-picker');
  sync();
})();

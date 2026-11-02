(() => {
  const header = document.querySelector('[data-cmd-header]');
  const dialog = document.getElementById('cmd-navigation');
  if (!header || !dialog) return;

  const toggle = header.querySelector('[data-cmd-menu]');
  const closeButton = dialog.querySelector('[data-cmd-close]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = null;

  function reset() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    document.documentElement.classList.remove('cmd-menu-open');
  }

  function openMenu() {
    if (dialog.open || closing) return;
    dialog.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    document.documentElement.classList.add('cmd-menu-open');
  }

  function closeMenu() {
    if (closing) return closing;
    if (!dialog.open) return Promise.resolve();
    if (reduceMotion.matches || typeof dialog.animate !== 'function') {
      dialog.close();
      reset();
      return Promise.resolve();
    }
    const animation = dialog.animate(
      [{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(100%)', opacity: .5 }],
      { duration: 180, easing: 'ease-in' }
    );
    closing = animation.finished.catch(() => {}).then(() => {
      if (dialog.open) dialog.close();
      reset();
      closing = null;
    });
    return closing;
  }

  toggle.addEventListener('click', () => dialog.open ? closeMenu() : openMenu());
  closeButton.addEventListener('click', closeMenu);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeMenu();
  });
  dialog.addEventListener('close', reset);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeMenu();
  });

  dialog.addEventListener('click', async event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin === location.origin && destination.pathname === location.pathname && destination.hash) {
      event.preventDefault();
      await closeMenu();
      let id;
      try { id = decodeURIComponent(destination.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      location.hash = destination.hash;
      requestAnimationFrame(() => {
        if (!target) return;
        if (!target.hasAttribute('tabindex')) {
          target.tabIndex = -1;
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start' });
      });
    } else {
      closeMenu();
    }
  });

  function markCurrentSection() {
    const segment = location.pathname.split('/').filter(Boolean)[0] || 'home';
    const section = ({
      'news-events': 'updates', stories: 'updates', events: 'updates',
      academics: 'study', 'pay-dues': 'pay', about: 'about', resources: 'about',
      communities: 'community', community: 'community', feedback: 'community', contact: 'contact', home: 'home'
    })[segment];
    dialog.querySelectorAll('[data-nav-section]').forEach(link => {
      const current = link.dataset.navSection === section;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    dialog.querySelectorAll('.cmd-group-links a').forEach(link => {
      const url = new URL(link.href, location.href);
      const current = !!location.hash && url.pathname === location.pathname && url.hash === location.hash;
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', markCurrentSection);
  window.addEventListener('pageshow', () => {
    if (dialog.open) dialog.close();
    reset();
    markCurrentSection();
  });
  markCurrentSection();
})();

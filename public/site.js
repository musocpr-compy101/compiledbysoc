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

(() => {
  const surface = document.querySelector('.reference-surface');
  const groups = [];
  if (surface) {
    for (const name of ['main', 'requirements', 'courses']) {
      const buttons = [...surface.querySelectorAll('[data-tab-group="' + name + '"]')];
      if (!buttons.length) continue;
      const panels = buttons.map(button => document.getElementById(button.dataset.tabTarget));
      const tablist = buttons[0].parentElement;
      tablist.setAttribute('role', 'tablist');
      const indexLayout = window.matchMedia('(min-width: 1081px)');
      const updateOrientation = () => tablist.setAttribute('aria-orientation', name === 'main' && indexLayout.matches ? 'vertical' : 'horizontal');
      updateOrientation();
      indexLayout.addEventListener('change', updateOrientation);
      tablist.setAttribute('aria-label', name === 'main' ? 'Page sections' : name === 'courses' ? 'Courses by programme' : 'Admission requirements by programme');
      function select(button, focus = false, updateHash = false) {
        buttons.forEach((item, index) => {
          const active = item === button;
          item.id = item.id || 'button-' + item.dataset.tabTarget;
          item.setAttribute('role', 'tab');
          item.setAttribute('aria-selected', String(active));
          item.setAttribute('aria-controls', item.dataset.tabTarget);
          item.tabIndex = active ? 0 : -1;
          item.classList.toggle('active', active);
          const panel = panels[index];
          if (panel) {
            panel.hidden = !active;
            panel.classList.toggle('active', active);
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', item.id);
            panel.tabIndex = 0;
          }
        });
        if (focus) button.focus({ preventScroll: true });
        if (updateHash) history.replaceState(null, '', '#' + button.dataset.tabTarget);
        if (name === 'main') {
          surface.dispatchEvent(new CustomEvent('soc:sectionchange', { detail: { id: button.dataset.tabTarget } }));
          if (updateHash && indexLayout.matches) {
            const panel = document.getElementById(button.dataset.tabTarget);
            const content = surface.querySelector('.section-panels');
            if (content && content.getBoundingClientRect().top < -24) content.scrollIntoView({ block: 'start', behavior: 'instant' });
            if (panel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof panel.animate === 'function') {
              panel.animate([{ opacity: .45, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180, easing: 'ease-out' });
            }
          }
        }
      }
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => select(button, false, true));
        button.addEventListener('keydown', event => {
          let next;
          if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % buttons.length;
          if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + buttons.length) % buttons.length;
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = buttons.length - 1;
          if (next === undefined) return;
          event.preventDefault();
          select(buttons[next], true, true);
        });
      });
      select(buttons.find(button => button.classList.contains('active')) || buttons[0]);
      groups.push({ buttons, panels, select });
    }
    function revealHash(hash = location.hash) {
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id) || document.getElementById('tab-' + id);
      if (!target) return;
      for (const group of groups) {
        const index = group.panels.findIndex(panel => panel && (panel === target || panel.contains(target)));
        if (index >= 0) group.select(group.buttons[index]);
      }
    }
    revealHash();
    window.addEventListener('hashchange', () => revealHash());
    surface.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (link) revealHash(link.getAttribute('href'));
    });
    surface.classList.add('enhanced-tabs');
  }

  const slides = [...document.querySelectorAll('.reference-home .slide')];
  const dots = [...document.querySelectorAll('[data-slide]')];
  if (slides.length) {
    function selectSlide(index) {
      slides.forEach((slide, i) => {
        slide.hidden = i !== index;
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-pressed', String(i === index));
      });
    }
    dots.forEach(dot => dot.addEventListener('click', () => selectSlide(Number(dot.dataset.slide))));
    selectSlide(0);
  }

  const newsItems = [...document.querySelectorAll('[data-news-item]')];
  if (newsItems.length) {
    const filters = [...document.querySelectorAll('[data-news-filter]')];
    const search = document.querySelector('[data-news-search]');
    const pager = document.querySelector('[data-news-pagination]');
    const status = document.querySelector('[data-news-status]');
    const gridSection = document.querySelector('.news-grid-section');
    const layout = document.querySelector('.news-layout');
    const pageSize = 6;
    let category = 'all';
    let page = 1;
    const text = new Map(newsItems.map(item => [item, item.textContent.toLowerCase()]));
    function renderNews(moveFocus = false) {
      const query = search.value.trim().toLowerCase();
      const matches = newsItems.filter(item => (category === 'all' || item.dataset.cat === category) && (!query || text.get(item).includes(query)));
      const gridMatches = matches.filter(item => item.hasAttribute('data-news-page-item'));
      const totalPages = Math.max(1, Math.ceil(gridMatches.length / pageSize));
      page = Math.min(page, totalPages);
      newsItems.forEach(item => {
        const index = gridMatches.indexOf(item);
        const onPage = !item.hasAttribute('data-news-page-item') || (index >= (page - 1) * pageSize && index < page * pageSize);
        item.hidden = !matches.includes(item) || !onPage;
      });
      const nativeAd = document.querySelector('[data-ad-slot="3"]');
      if (nativeAd) {
        const visibleCards = gridMatches.filter(item => !item.hidden);
        nativeAd.hidden = visibleCards.length < 5;
        if (visibleCards.length >= 5) visibleCards[4].after(nativeAd);
      }
      filters.forEach(button => {
        const selected = button.dataset.newsFilter === category;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      layout.hidden = !matches.some(item => !item.hasAttribute('data-news-page-item'));
      const sidebar = layout.querySelector('.sidebar');
      const hasSidebar = matches.some(item => item.classList.contains('sidebar-item'));
      const hasFeature = matches.some(item => item.classList.contains('feat-post'));
      if (sidebar) sidebar.parentElement.hidden = !hasSidebar;
      layout.classList.toggle('single-column', !hasSidebar || !hasFeature);
      gridSection.hidden = gridMatches.length === 0;
      status.textContent = matches.length ? matches.length + ' matching ' + (matches.length === 1 ? 'story' : 'stories') : 'No stories match. Try another topic or search term.';
      pager.replaceChildren();
      if (totalPages > 1) {
        for (let index = 1; index <= totalPages; index++) {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = String(index);
          button.setAttribute('aria-label', 'News page ' + index);
          if (index === page) button.setAttribute('aria-current', 'page');
          button.addEventListener('click', () => { page = index; renderNews(true); });
          pager.append(button);
        }
        if (page < totalPages) {
          const next = document.createElement('button');
          next.type = 'button';
          next.textContent = 'Next →';
          next.addEventListener('click', () => { page++; renderNews(true); });
          pager.append(next);
        }
      }
      if (moveFocus) pager.querySelector('[aria-current="page"]')?.focus({ preventScroll: true });
    }
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.newsFilter; page = 1; renderNews();
    }));
    search.addEventListener('input', () => { page = 1; renderNews(); });
    const badge = document.querySelector('#tab-news-btn .tab-count');
    if (badge) badge.textContent = String(newsItems.length);
    renderNews();
  }

  const eventCards = [...document.querySelectorAll('[data-event-date]')];
  if (eventCards.length) {
    const layout = document.querySelector('.events-layout');
    const calendar = document.querySelector('[data-calendar]');
    const viewButtons = [...document.querySelectorAll('[data-calendar-view]')];
    const listChildren = [...layout.children].filter(child => !child.classList.contains('events-header') && child !== calendar);
    const entries = eventCards.map(card => ({ date: card.dataset.eventDate, endDate: card.dataset.eventEndDate || card.dataset.eventDate, title: card.dataset.eventTitle, url: card.getAttribute('href'), detail: card.querySelector('.event-meta-row')?.textContent || card.textContent, id: card.dataset.newsId }));
    const calendarDialog = document.createElement('dialog');
    calendarDialog.className = 'soc-dialog calendar-popup';
    calendarDialog.setAttribute('aria-labelledby', 'calendar-popup-title');
    calendarDialog.innerHTML = '<div class="dialog-top"><h2 id="calendar-popup-title">SOC calendar</h2><button type="button" class="dialog-close" data-close-dialog aria-label="Close calendar">×</button></div>';
    calendar.parentNode.insertBefore(calendarDialog, calendar);
    calendarDialog.append(calendar);
    const eventDialog = document.createElement('dialog');
    eventDialog.className = 'soc-dialog';
    eventDialog.setAttribute('aria-labelledby', 'event-popup-title');
    eventDialog.innerHTML = '<div class="dialog-top"><h2 id="event-popup-title"></h2><button type="button" class="dialog-close" data-close-dialog aria-label="Close event">×</button></div><p data-event-popup-date></p><p data-event-popup-detail></p><p class="dialog-hint">Reference schedule. Confirm dates with SOC.</p><a class="solid-action" data-event-popup-link>Full event details →</a>';
    document.body.append(eventDialog);
    function openEvent(entry) {
      eventDialog.querySelector('h2').textContent = entry.title;
      eventDialog.querySelector('[data-event-popup-date]').textContent = entry.date + (entry.endDate !== entry.date ? ' to ' + entry.endDate : '');
      eventDialog.querySelector('[data-event-popup-detail]').textContent = entry.detail;
      eventDialog.querySelector('[data-event-popup-link]').href = entry.url;
      eventDialog.showModal();
    }
    eventCards.forEach((card, i) => card.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); openEvent(entries[i]);
    }));
    let year = Number(entries[0].date.slice(0, 4));
    let month = Number(entries[0].date.slice(5, 7)) - 1;
    const todayParts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const today = ['year', 'month', 'day'].map(type => todayParts.find(part => part.type === type).value).join('-');
    function renderCalendar() {
      const label = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
      const prefix = year + '-' + String(month + 1).padStart(2, '0');
      calendar.querySelector('[data-calendar-label]').textContent = label;
      const table = document.createElement('table');
      table.className = 'calendar-table';
      const caption = table.createCaption();
      caption.className = 'sr-only';
      caption.textContent = label + ' SOC reference schedule';
      const heading = table.createTHead().insertRow();
      for (const name of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
        const th = document.createElement('th');
        th.scope = 'col'; th.textContent = name; heading.append(th);
      }
      const offset = (new Date(year, month, 1).getDay() + 6) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      const body = table.createTBody();
      let row;
      for (let index = 0; index < Math.ceil((offset + days) / 7) * 7; index++) {
        if (index % 7 === 0) row = body.insertRow();
        const cell = row.insertCell();
        const day = index - offset + 1;
        if (day < 1 || day > days) { cell.setAttribute('aria-hidden', 'true'); continue; }
        const date = prefix + '-' + String(day).padStart(2, '0');
        const time = document.createElement('time');
        time.dateTime = date; time.textContent = String(day); cell.append(time);
        if (date === today) { cell.classList.add('today'); time.setAttribute('aria-current', 'date'); }
        for (const entry of entries.filter(item => item.date <= date && item.endDate >= date)) {
          const link = document.createElement('a');
          link.href = entry.url;
          link.addEventListener('click', event => { event.preventDefault(); openEvent(entry); });
          link.setAttribute('aria-label', entry.title + ', ' + day + ' ' + label + '. View event.');
          const desktop = document.createElement('span');
          desktop.className = 'calendar-desktop-label'; desktop.textContent = entry.title;
          const mobile = document.createElement('span');
          mobile.className = 'calendar-mobile-label'; mobile.textContent = 'View';
          link.append(desktop, mobile); cell.append(link);
        }
      }
      calendar.querySelector('[data-calendar-grid]').replaceChildren(table);
      const count = entries.filter(entry => entry.date <= prefix + '-' + String(days).padStart(2, '0') && entry.endDate >= prefix + '-01').length;
      calendar.querySelector('.calendar-status').textContent = count ? count + ' events in the reference schedule. Confirm dates with SOC.' : 'No events listed for this month.';
    }
    viewButtons.filter(button => button.dataset.calendarView === 'calendar').forEach(button => { button.setAttribute('aria-haspopup','dialog'); button.removeAttribute('aria-pressed'); });
    viewButtons.forEach(button => button.addEventListener('click', () => {
      if (button.dataset.calendarView === 'calendar') {
        calendar.hidden = false;
        renderCalendar(); calendarDialog.showModal();
      }
    }));
    document.querySelectorAll('[data-calendar-step]').forEach(button => button.addEventListener('click', () => {
      const date = new Date(year, month + Number(button.dataset.calendarStep), 1);
      year = date.getFullYear(); month = date.getMonth(); renderCalendar();
    }));
    document.querySelector('[data-calendar-now]').addEventListener('click', () => {
      year = Number(today.slice(0, 4)); month = Number(today.slice(5, 7)) - 1; renderCalendar();
    });
  }

  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('.soc-dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  const noticeDialog = document.getElementById('notice-dialog');
  document.querySelectorAll('[data-unavailable]').forEach(button => button.addEventListener('click', () => {
    if (!noticeDialog) return;
    document.getElementById('notice-title').textContent = button.dataset.unavailable;
    document.getElementById('notice-message').textContent = button.dataset.unavailableMessage || 'The verified details for this resource have not been supplied yet. Contact the School of Computing for the current information.';
    noticeDialog.showModal();
  }));
  document.querySelectorAll('[data-open-payment]').forEach(button => button.addEventListener('click', () => document.getElementById('pay-dialog')?.showModal()));
  document.querySelectorAll('[data-payment-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelector('.form-status').textContent = 'Checkout is not connected. No payment has been taken and your details have not been sent. Contact SOC for the confirmed payment channel.';
  }));

  const searchDialog = document.getElementById('site-search-dialog');
  if (searchDialog) {
    const input = document.getElementById('site-search-input');
    const output = searchDialog.querySelector('[data-search-results]');
    const status = searchDialog.querySelector('[data-search-status]');
    let indexPromise;
    let requestNumber = 0;
    async function renderSearch() {
      const request = ++requestNumber;
      const query = input.value.trim().toLowerCase();
      status.textContent = 'Searching…';
      try {
        if (!indexPromise) indexPromise = fetch('/api/search').then(response => {
          if (!response.ok) throw new Error('Search index unavailable');
          return response.json();
        }).catch(error => { indexPromise = undefined; throw error; });
        const index = await indexPromise;
        if (request !== requestNumber) return;
        const terms = query.split(/\s+/).filter(Boolean);
        const matches = index.filter(item => !terms.length || terms.every(term => (item.title + ' ' + item.section + ' ' + item.text).toLowerCase().includes(term)));
        const seen = new Set();
        const unique = matches.filter(item => { if (seen.has(item.url)) return false; seen.add(item.url); return true; });
        const sorted = unique.sort((a, b) => Number(b.title.toLowerCase().includes(query)) - Number(a.title.toLowerCase().includes(query)));
        output.replaceChildren();
        for (const item of sorted.slice(0, 15)) {
          const link = document.createElement('a'); link.href = item.url;
          const section = document.createElement('small'); section.textContent = item.section;
          const title = document.createElement('span'); title.textContent = item.title;
          link.append(section, title); output.append(link);
        }
        status.textContent = query ? (unique.length ? unique.length + ' results' + (unique.length > 15 ? ' · showing the first 15' : '') : 'No results. Try a programme, page, or topic.') : 'Explore pages and topics, or type to search.';
      } catch {
        if (request === requestNumber) status.textContent = 'Search could not load. Please try again.';
      }
    }
    document.querySelectorAll('[data-site-search]').forEach(button => button.addEventListener('click', () => {
      searchDialog.showModal(); input.focus(); renderSearch();
    }));
    input.addEventListener('input', renderSearch);
    output.addEventListener('click', event => {
      if (event.target.closest('a')) searchDialog.close();
    });
  }

  const contact = document.querySelector('[data-contact-form]');
  if (contact) {
    const category = contact.elements.category;
    const requested = new URLSearchParams(location.search).get('category');
    if (requested) {
      if (![...category.options].some(option => option.value === requested)) {
        const option = document.createElement('option'); option.textContent = requested.slice(0, 80); category.append(option);
      }
      category.value = requested;
    }
    contact.addEventListener('submit', event => {
      event.preventDefault();
      if (contact.hasAttribute('data-mockup-contact')) {
        contact.querySelector('.form-status').textContent = 'Preview complete. Your message was not sent or stored.';
        contact.reset();
        return;
      }
      const values = new FormData(contact);
      const topic = String(values.get('category'));
      const welfare = /welfare|suggestion|complaint|feedback/i.test(topic);
      const inbox = welfare ? 'welfare.soc@madukauniversity.edu.ng' : contact.dataset.inbox;
      const body = 'Name: ' + values.get('name') + '\nEmail: ' + values.get('email') + '\nCategory: ' + topic + '\n\n' + values.get('message');
      const subject = '[' + topic + '] ' + values.get('subject');
      location.href = 'mailto:' + inbox + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      contact.querySelector('.form-status').textContent = 'Your email draft is ready. Review and send it in your email app; this website has not sent the message.';
    });
  }
  document.querySelectorAll('[data-newsletter-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    location.href = 'mailto:soc@madukauniversity.edu.ng?subject=' + encodeURIComponent('SOC newsletter subscription request') + '&body=' + encodeURIComponent('Please add ' + email + ' to School of Computing news and event updates.');
    form.querySelector('.newsletter-hint').textContent = 'Send the email draft to request a subscription. You have not been subscribed automatically.';
  }));
  document.querySelectorAll('[data-share-link]').forEach(button => button.addEventListener('click', async () => {
    const status = document.querySelector('[data-share-status]');
    try { await navigator.clipboard.writeText(location.href); status.textContent = 'Link copied.'; }
    catch { status.textContent = 'Copy the address from your browser to share this story.'; }
  }));
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
})();

(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem('soc-design-' + key)); } catch { return null; } },
    set(key, value) { try { localStorage.setItem('soc-design-' + key, JSON.stringify(value)); } catch {} }
  };

  // Only programme, level and the first-week checklist are device preferences.
  let preferences = store.get('preferences') || { programme: 'all', level: 'all' };
  const programmes = ['all', 'cs', 'se', 'cy'];
  const levels = ['all', '100', '200', '300', '400'];
  if (!programmes.includes(preferences.programme) || !levels.includes(preferences.level)) preferences = { programme: 'all', level: 'all' };
  const matches = (value, choice) => choice === 'all' || value === 'all' || (value || '').split(' ').includes(choice);
  function filterStudents() {
    document.querySelectorAll('[data-programme]').forEach(select => { select.value = preferences.programme; });
    document.querySelectorAll('[data-level]').forEach(select => { select.value = preferences.level; });
    for (const [selector, statusSelector, name] of [
      ['[data-feed-card]', '[data-feed-status]', 'sample posts'],
      ['[data-study-row]', '[data-study-status]', 'sample classes'],
      ['[data-material-card]', '[data-material-status]', 'sample materials']
    ]) {
      const cards = [...document.querySelectorAll(selector)];
      let visible = 0;
      cards.forEach(card => {
        card.hidden = !(matches(card.dataset.programmes, preferences.programme) && matches(card.dataset.levels, preferences.level));
        if (!card.hidden) visible++;
      });
      const status = document.querySelector(statusSelector);
      if (status) status.textContent = visible ? visible + ' ' + name + ' for your selection.' : 'No sample entries for this selection. Try all programmes or levels.';
    }
  }
  document.querySelectorAll('[data-preference-group]').forEach(group => group.addEventListener('change', () => {
    preferences = { programme: group.querySelector('[data-programme]').value, level: group.querySelector('[data-level]').value };
    store.set('preferences', preferences);
    filterStudents();
  }));
  filterStudents();

  const carousel = document.querySelector('[data-campus-carousel]');
  if (carousel) {
    const mobileCarousel = window.matchMedia('(max-width: 768px)');
    const slides = [...carousel.querySelectorAll('[data-campus-slide]')];
    const dots = [...carousel.querySelectorAll('[data-campus-dot]')];
    const pause = carousel.querySelector('[data-campus-pause]');
    let current = 0, timer = null, userPaused = reduced.matches, pointerStart = null;
    let inView = false;
    const loadImage = index => {
      const img = slides[index].querySelector('img[data-src]');
      if (img) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
    };
    function stop() { clearInterval(timer); timer = null; }
    function schedule() {
      stop();
      if (!mobileCarousel.matches && !userPaused && !reduced.matches && inView && !document.hidden && !carousel.contains(document.activeElement)) timer = setInterval(() => show(current + 1), 5500);
    }
    function show(index) {
      current = (index + slides.length) % slides.length;
      loadImage(current);
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
        dots[i].setAttribute('aria-pressed', String(active));
      });
      carousel.querySelector('[data-slide-position]').textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      // Preload only the next photograph after the carousel has entered view.
      if (inView) loadImage((current + 1) % slides.length);
    }
    function setPaused(value) {
      userPaused = reduced.matches || value;
      pause.disabled = reduced.matches;
      pause.textContent = reduced.matches ? 'Paused' : userPaused ? 'Play' : 'Pause';
      pause.setAttribute('aria-label', reduced.matches ? 'Autoplay paused for reduced motion' : userPaused ? 'Play carousel' : 'Pause carousel');
      schedule();
    }
    function manual(index) { setPaused(true); show(index); }
    dots.forEach((button, i) => button.addEventListener('click', () => manual(i)));
    carousel.querySelector('[data-campus-prev]').addEventListener('click', () => manual(current - 1));
    carousel.querySelector('[data-campus-next]').addEventListener('click', () => manual(current + 1));
    pause.addEventListener('click', () => setPaused(!userPaused));
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', () => requestAnimationFrame(schedule));
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', schedule);
    carousel.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); manual(current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    carousel.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') { pointerStart = { x: event.clientX, y: event.clientY }; setPaused(true); }
    }, { passive: true });
    carousel.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) manual(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
    carousel.addEventListener('pointercancel', () => { pointerStart = null; });
    document.addEventListener('visibilitychange', schedule);
    const updateCarouselMode = () => {
      carousel.setAttribute('aria-label', mobileCarousel.matches ? 'Around SOC. Swipe left or right, or use the arrow keys, to browse photographs.' : 'Around SOC');
      schedule();
    };
    mobileCarousel.addEventListener('change', updateCarouselMode);
    updateCarouselMode();
    reduced.addEventListener('change', () => setPaused(true));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        if (inView) loadImage((current + 1) % slides.length);
        schedule();
      }, { threshold: .1 }).observe(carousel);
    } else { inView = true; schedule(); }
    setPaused(userPaused);
  }

  document.querySelectorAll('[data-schedule]').forEach(button => button.addEventListener('click', () => {
    const exam = button.dataset.schedule === 'exam';
    document.querySelector('[data-class-schedule]').hidden = exam;
    document.querySelector('[data-exam-schedule]').hidden = !exam;
    document.querySelector('[data-study-status]').hidden = exam;
    document.querySelectorAll('[data-schedule]').forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
  }));

  document.querySelectorAll('[data-checklist]').forEach(input => {
    input.checked = store.get('check-' + input.dataset.checklist) === true;
    input.addEventListener('change', () => store.set('check-' + input.dataset.checklist, input.checked));
  });
  document.querySelectorAll('[data-demo-poll]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = form.querySelector('input:checked');
    if (!selected) return;
    form.querySelector('[data-poll-status]').textContent = 'Preview selected: ' + selected.parentElement.textContent.trim() + '. No vote has been submitted.';
    form.querySelector('button[type=submit]').textContent = 'Update preview choice';
  }));
  document.querySelector('[data-demo-rsvp]')?.addEventListener('click', event => {
    event.currentTarget.textContent = 'Preview RSVP selected';
    document.querySelector('[data-rsvp-status]').textContent = 'This is the confirmation state. No event registration or QR check-in pass has been created.';
  });
  document.querySelector('[data-demo-upvote]')?.addEventListener('click', event => {
    const button = event.currentTarget, selected = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(selected));
    button.querySelector('span').textContent = selected ? '1' : '0';
  });

  const feedback = document.querySelector('[data-feedback-preview]');
  if (feedback) {
    const type = feedback.elements.type;
    const requested = new URLSearchParams(location.search).get('type');
    if ([...type.options].some(option => option.value === requested)) type.value = requested;
    const recipients = { suggestion: 'PRO office', bug: 'PRO office', complaint: 'Welfare Officer; serious cases may be referred to the HOD under the agreed policy', welfare: 'Welfare Officer', dues: 'Financial Officer', event: 'Events team', course: 'HOD only', ict: 'ICT support through the PRO office' };
    function updateFeedback() {
      const course = type.value === 'course';
      const anonymous = feedback.querySelector('input[value=anonymous]');
      const named = feedback.querySelector('input[value=named]');
      if (course) anonymous.checked = true;
      named.disabled = course;
      feedback.querySelector('[data-feedback-name]').hidden = !named.checked;
      feedback.elements.name.required = named.checked;
      feedback.querySelector('[data-event-rating]').hidden = type.value !== 'event';
      feedback.querySelector('[data-feedback-route]').textContent = 'Intended recipient: ' + recipients[type.value] + '. ' + (course ? 'Anonymous; private to the HOD. Only aggregated results can be shown after the minimum response count.' : 'This preview sends nothing.');
    }
    type.addEventListener('change', updateFeedback);
    feedback.querySelectorAll('[name=identity]').forEach(input => input.addEventListener('change', updateFeedback));
    updateFeedback();
    feedback.addEventListener('submit', event => {
      event.preventDefault();
      const result = feedback.querySelector('[data-feedback-result]');
      result.hidden = false;
      result.replaceChildren();
      const title = document.createElement('strong'); title.textContent = 'Preview code: DEMO-1042';
      const message = document.createElement('span'); message.textContent = 'Received is the first status in this design. Nothing was sent or stored. Try this sample code in the tracker.';
      result.append(title, message);
      feedback.elements.message.value = '';
      feedback.elements.name.value = '';
    });
  }
  document.querySelector('[data-feedback-track]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const output = form.querySelector('[data-track-result]');
    output.className = 't-status-result';
    output.textContent = form.elements.code.value.trim().toUpperCase() === 'DEMO-1042'
      ? 'Demo record · Reviewing. Status journey: Received → Reviewing → Resolved. No real feedback is attached to this code.'
      : 'No live records are connected. Use DEMO-1042 to view the sample status.';
  });
  document.querySelector('[data-proof-preview]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    form.querySelector('[data-proof-status]').textContent = 'Preview complete. Your file was not uploaded and your matric number was not stored. Finance verification will happen in the live platform.';
    form.reset();
  });
  document.querySelector('[data-payment-check]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget, result = form.querySelector('[data-payment-result]');
    result.hidden = false;
    result.textContent = form.elements.matric.value.trim().toUpperCase() === 'PREVIEW-001'
      ? 'Sample status: Reviewing. Proof received, awaiting finance verification. A receipt becomes available after a real payment is approved.'
      : 'This mockup has no student payment records. Use PREVIEW-001 for the example.';
  });

  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('t-reveal'); observer.unobserve(entry.target);
    }), { threshold: .1 });
    document.querySelectorAll('.t-feed-card,.t-heading-row').forEach(node => observer.observe(node));
  }
})();

/* Freshers section: a zig-zag path. Curved lines draw as you scroll; each card lights up when a line reaches it. */
(() => {
  const sec = document.querySelector('.t-fresh');
  const path = sec && sec.querySelector('[data-fresh-path]');
  if (!path) return;
  const cards = [...path.querySelectorAll('.t-fresh-card')];
  const svg = path.querySelector('.t-fresh-lines');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  let segs = [];

  const build = () => {
    svg.innerHTML = '';
    const W = path.clientWidth, H = path.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    segs = cards.slice(0, -1).map((a, i) => {
      const b = cards[i + 1];
      const fromLeft = a.offsetLeft + a.offsetWidth / 2 < W / 2;
      const ex = b.offsetLeft + b.offsetWidth / 2, ey = b.offsetTop;
      const inside = ex > a.offsetLeft + 24 && ex < a.offsetLeft + a.offsetWidth - 24;
      let d, sx, sy;
      if (inside) {
        sx = a.offsetLeft + a.offsetWidth * (fromLeft ? .72 : .28); sy = a.offsetTop + a.offsetHeight;
        d = `M${sx},${sy} C${sx},${sy + (ey - sy) * .7} ${ex},${ey - (ey - sy) * .7} ${ex},${ey}`;
      } else {
        sx = fromLeft ? a.offsetLeft + a.offsetWidth : a.offsetLeft; sy = a.offsetTop + a.offsetHeight / 2;
        const dir = fromLeft ? 1 : -1, reach = Math.max(70, Math.abs(ex - sx) * .6);
        d = `M${sx},${sy} C${sx + dir * reach},${sy} ${ex},${ey - (ey - sy) * .55} ${ex},${ey}`;
      }
      const track = document.createElementNS(NS, 'path');
      track.setAttribute('d', d); track.setAttribute('class', 'fresh-track');
      const line = document.createElementNS(NS, 'path');
      line.setAttribute('d', d); line.setAttribute('class', 'fresh-line');
      const len = line.getTotalLength();
      line.style.strokeDasharray = len; line.style.strokeDashoffset = reduced ? 0 : len;
      const head = document.createElementNS(NS, 'circle');
      head.setAttribute('r', 6); head.setAttribute('class', 'fresh-head');
      svg.append(track, line, head);
      return { line, head, len, sy, ey };
    });
    update();
  };

  const light = (card, on) => {
    if (on && !card.classList.contains('is-lit')) {
      card.classList.add('is-in', 'is-lit', 'is-flash');
      setTimeout(() => card.classList.remove('is-flash'), 1100);
    } else if (!on) card.classList.remove('is-lit');
  };

  function update() {
    if (reduced) { cards.forEach(c => c.classList.add('is-in', 'is-lit')); return; }
    const top = path.getBoundingClientRect().top, read = innerHeight * .66;
    light(cards[0], top + cards[0].offsetTop < innerHeight * .8);
    segs.forEach((s, i) => {
      const a = top + s.sy, b = top + s.ey;
      const t = clamp((read - a) / (b - a));
      s.line.style.strokeDashoffset = s.len * (1 - t);
      if (t > 0 && t < 1) {
        const pt = s.line.getPointAtLength(s.len * t);
        s.head.setAttribute('cx', pt.x); s.head.setAttribute('cy', pt.y); s.head.style.opacity = 1;
      } else s.head.style.opacity = 0;
      light(cards[i + 1], t >= .985);
    });
  }

  const photo = sec.querySelector('.t-fresh-photo');
  if (photo && !reduced && 'IntersectionObserver' in window) {
    photo.addEventListener('transitionend', e => { if (e.propertyName === 'transform') photo.classList.add('is-done'); });
    new IntersectionObserver((es, io) => es.forEach(e => { if (e.isIntersecting) { photo.classList.add('is-in'); io.disconnect(); } }), { threshold: .2 }).observe(photo);
  } else if (photo) photo.classList.add('is-in');
  if (!reduced) sec.classList.add('is-armed');
  cards.forEach(c => c.addEventListener('transitionend', e => { if (e.propertyName === 'transform' && c.classList.contains('is-in')) c.classList.add('is-done'); }));
  let queued = false;
  const tick = () => { if (!queued) { queued = true; requestAnimationFrame(() => { update(); queued = false; }); } };
  addEventListener('scroll', tick, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(build).observe(path); else addEventListener('resize', build);
  addEventListener('load', build);
  build();

  // Floating background shapes drift with scroll.
  const shapes = [...sec.querySelectorAll('.t-shape,.t-ico')];
  if (!reduced) addEventListener('scroll', () => requestAnimationFrame(() => {
    const r = sec.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
    shapes.forEach(sh => sh.style.setProperty('--p', p.toFixed(3)));
  }), { passive: true });
})();

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

(() => {
  const hero = document.querySelector('.terminal-hero');
  if (!hero) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Type and delete loop for the search prompt.
  const target = hero.querySelector('[data-ask-word]');
  const words = ['SOC', 'Academics', 'Events', 'Course Information', 'Timetable', 'Dues', 'Communities', 'Freshmen'];
  if (target && !reduced.matches) {
    let w = 0, n = 0, deleting = false;
    target.textContent = '';
    const tick = () => {
      const word = words[w];
      n += deleting ? -1 : 1;
      target.textContent = word.slice(0, n);
      let wait = deleting ? 45 : 95;
      if (!deleting && n === word.length) { deleting = true; wait = 1300; }
      else if (deleting && n === 0) { deleting = false; w = (w + 1) % words.length; wait = 380; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 700);
  }

  // "You're in the right place" prints in once it scrolls into view.
  const reveal = hero.querySelector('[data-hero-reveal]');
  if (reveal) {
    if (reduced.matches || !('IntersectionObserver' in window)) reveal.classList.add('is-in');
    else new IntersectionObserver((entries, io) => entries.forEach(e => {
      if (e.isIntersecting) { reveal.classList.add('is-in'); io.disconnect(); }
    }), { threshold: .6 }).observe(reveal);
  }
})();

(() => {
  const journal = document.querySelector('[data-journal]');
  if (!journal) return;
  const search = journal.querySelector('[data-journal-search]');
  const buttons = [...journal.querySelectorAll('[data-topic]')];
  const stories = [...journal.querySelectorAll('.featured-story, .story-card')].map(element => {
    const category = element.querySelector('.story-category').textContent.toLowerCase();
    const topic = category.includes('engineering') ? 'engineering' : category.includes('security') ? 'security' : 'perspectives';
    return { element, topic, text: element.textContent.toLowerCase() };
  });
  let topic = 'all';
  function render() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    for (const story of stories) {
      const matches = (topic === 'all' || story.topic === topic) && story.text.includes(query);
      story.element.hidden = !matches;
      if (matches) count++;
    }
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
    journal.querySelector('[data-journal-count]').textContent = `${count} ${count === 1 ? 'story' : 'stories'}`;
    journal.querySelector('[data-journal-empty]').hidden = count !== 0;
    journal.querySelector('.more-header').hidden = topic !== 'all' || query !== '';
    journal.querySelector('.story-grid').hidden = !stories.some(story => story.element.matches('.story-card') && !story.element.hidden);
  }
  buttons.forEach(button => button.addEventListener('click', () => { topic = button.dataset.topic; render(); }));
  search.addEventListener('input', render);
  journal.querySelector('[data-journal-reset]').addEventListener('click', () => {
    topic = 'all'; search.value = ''; render(); search.focus();
  });
  journal.querySelector('[data-journal-tools]').hidden = false;
})();

/* Bridge published records into the retained public design during migration. */
(async()=>{
 const feed=document.querySelector('.t-feed-list');const news=document.querySelector('#tab-news');
 if(!feed&&!news)return;
 try{
  const response=await fetch('/api/posts');if(!response.ok)return;
  const posts=await response.json();if(!posts.length)return;
  function card(p){
   const a=document.createElement('a');a.className='soc-post app-post';a.href='/important-stuff/'+p.id;
   const cover=document.createElement('div');cover.className='app-post-cover';
   if(p.image_id){const img=document.createElement('img');img.src='/api/media/'+p.image_id;img.alt='';img.loading='lazy';cover.append(img);}else{const mark=document.createElement('span');mark.textContent='C_';cover.append(mark);}
   const tags=document.createElement('div');tags.className='app-post-tags';const kind=document.createElement('strong');kind.textContent=p.kind;const date=document.createElement('time');date.textContent=new Date(p.published_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'Africa/Lagos'});tags.append(kind,date);cover.append(tags);
   const body=document.createElement('div');body.className='app-post-body';const title=document.createElement('h3');title.textContent=p.title;const text=document.createElement('p');text.textContent=p.excerpt;const footer=document.createElement('footer');const author=document.createElement('span');author.textContent=p.byline;const more=document.createElement('strong');more.textContent='Read more →';footer.append(author,more);body.append(title,text,footer);a.append(cover,body);return a;
  }
  if(feed){feed.replaceChildren(...posts.slice(0,6).map(card));const status=document.querySelector('[data-feed-status]');if(status)status.textContent='Latest published posts for all SOC students.';document.querySelector('.t-feed-preferences')?.setAttribute('hidden','');const tag=document.querySelector('#your-feed .t-tag');if(tag)tag.textContent='Latest from SOC';}
  if(news){const current=posts.filter(p=>p.kind==='news'||p.kind==='journal');if(current.length){const section=document.createElement('section');section.className='app-main';section.style.padding='0 0 32px';const h=document.createElement('h2');h.textContent='Latest from SOC';const grid=document.createElement('div');grid.className='app-post-grid';grid.append(...current.map(card));section.append(h,grid);news.prepend(section);}}
 }catch{/* Existing reference content stays available on network failure. */}
})();

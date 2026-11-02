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
        if (!indexPromise) indexPromise = fetch('/reference/search.json').then(response => {
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

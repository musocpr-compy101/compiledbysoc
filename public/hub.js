(() => {
  const programmes = document.querySelector('[data-programmes]');
  if (programmes) {
    const tablist = programmes.querySelector('.programme-tabs');
    const tabs = [...tablist.querySelectorAll('[data-programme]')];
    const panels = [...programmes.querySelectorAll('[data-programme-panel]')];
    tablist.setAttribute('role', 'tablist');

    function activate(tab, moveFocus = false, updateHash = false) {
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('role', 'tab');
        item.setAttribute('aria-selected', String(selected));
        item.setAttribute('aria-controls', 'programme-' + item.dataset.programme);
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(panel => {
        panel.hidden = panel.dataset.programmePanel !== tab.dataset.programme;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', 'tab-' + panel.dataset.programmePanel);
        panel.tabIndex = 0;
      });
      if (moveFocus) tab.focus();
      if (updateHash) history.replaceState(null, '', tab.getAttribute('href'));
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        activate(tab, false, true);
      });
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (event.key === ' ') next = index;
        if (next === undefined) return;
        event.preventDefault();
        activate(tabs[next], true, true);
      });
    });
    function selectFromHash() {
      const target = tabs.find(tab => tab.getAttribute('href') === location.hash);
      if (target) activate(target);
    }
    activate(tabs.find(tab => tab.getAttribute('href') === location.hash) || tabs[0]);
    window.addEventListener('hashchange', selectFromHash);
  }

  const board = document.querySelector('[data-events]');
  if (!board) return;
  const search = board.querySelector('[data-event-search]');
  const category = board.querySelector('[data-event-category]');
  const period = board.querySelector('[data-event-period]');
  const viewButtons = [...board.querySelectorAll('[data-event-view]')];
  const list = board.querySelector('[data-event-list]');
  const calendar = board.querySelector('[data-event-calendar]');
  const count = board.querySelector('[data-event-count]');
  const empty = board.querySelector('[data-event-empty]');
  const dateParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const today = ['year', 'month', 'day'].map(type => dateParts.find(part => part.type === type).value).join('-');
  const entries = [...board.querySelectorAll('[data-event]')].map(element => ({
    element,
    date: element.dataset.date,
    category: element.dataset.category,
    title: element.dataset.title,
    text: element.textContent.toLowerCase()
  }));
  entries.forEach(entry => {
    entry.element.querySelector('[data-event-time-label]').textContent =
      entry.date < today ? 'Past example' : 'Upcoming example';
  });
  const initialDate = entries[0] ? entries[0].date : today;
  let year = Number(initialDate.slice(0, 4));
  let month = Number(initialDate.slice(5, 7)) - 1;
  let view = 'list';

  function matchesFilters(entry) {
    const query = search.value.trim().toLowerCase();
    return (!query || entry.text.includes(query)) &&
      (category.value === 'all' || entry.category === category.value) &&
      (period.value === 'all' || (period.value === 'upcoming' ? entry.date >= today : entry.date < today));
  }

  function renderCalendar(matches) {
    const monthName = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
    board.querySelector('[data-calendar-heading]').textContent = monthName;
    board.querySelector('[data-calendar-caption]').textContent = monthName + ' — sample SOC events';
    const monthPrefix = year + '-' + String(month + 1).padStart(2, '0');
    const monthEntries = matches.filter(entry => entry.date.startsWith(monthPrefix));
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((offset + days) / 7) * 7;
    const fragment = document.createDocumentFragment();
    let row;

    for (let index = 0; index < cellCount; index++) {
      if (index % 7 === 0) {
        row = document.createElement('tr');
        fragment.append(row);
      }
      const cell = document.createElement('td');
      const day = index - offset + 1;
      if (day > 0 && day <= days) {
        const date = monthPrefix + '-' + String(day).padStart(2, '0');
        const time = document.createElement('time');
        time.dateTime = date;
        time.textContent = String(day);
        cell.append(time);
        if (date === today) {
          cell.classList.add('is-today');
          time.setAttribute('aria-current', 'date');
        }
        for (const entry of monthEntries.filter(item => item.date === date)) {
          const link = document.createElement('a');
          link.href = '#' + entry.element.id;
          link.className = 'calendar-event';
          link.dataset.calendarEvent = entry.element.id;
          link.setAttribute('aria-label', entry.title + ', ' + day + ' ' + monthName + ', sample event. View details.');
          const desktop = document.createElement('span');
          desktop.className = 'calendar-event-desktop';
          desktop.textContent = entry.title;
          desktop.setAttribute('aria-hidden', 'true');
          const mobile = document.createElement('span');
          mobile.className = 'calendar-event-mobile';
          mobile.textContent = 'View';
          mobile.setAttribute('aria-hidden', 'true');
          link.append(desktop, mobile);
          cell.append(link);
        }
      } else {
        cell.setAttribute('aria-hidden', 'true');
      }
      row.append(cell);
    }
    board.querySelector('[data-calendar-body]').replaceChildren(fragment);
    board.querySelector('[data-calendar-message]').textContent = monthEntries.length ?
      'Select an event to read its details. All listings are examples.' :
      'No matching events in this month. Browse another month or switch to the list.';
    return monthEntries.length;
  }

  function render() {
    const matches = entries.filter(matchesFilters);
    entries.forEach(entry => { entry.element.hidden = !matches.includes(entry); });
    list.hidden = view !== 'list';
    calendar.hidden = view !== 'calendar';
    empty.hidden = view !== 'list' || matches.length > 0;
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.eventView === view)));
    const visibleCount = view === 'calendar' ? renderCalendar(matches) : matches.length;
    count.textContent = visibleCount + ' sample ' + (visibleCount === 1 ? 'event' : 'events') + (view === 'calendar' ? ' this month' : '');
  }

  function reset() {
    search.value = '';
    category.value = 'all';
    period.value = 'all';
    render();
  }
  search.addEventListener('input', render);
  category.addEventListener('change', render);
  period.addEventListener('change', render);
  viewButtons.forEach(button => button.addEventListener('click', () => {
    view = button.dataset.eventView;
    render();
  }));
  board.querySelector('[data-event-reset]').addEventListener('click', reset);
  board.querySelector('[data-event-show-all]').addEventListener('click', () => {
    view = 'list'; reset(); search.focus();
  });
  function moveMonth(amount) {
    const next = new Date(year, month + amount, 1);
    year = next.getFullYear();
    month = next.getMonth();
    render();
  }
  board.querySelector('[data-calendar-previous]').addEventListener('click', () => moveMonth(-1));
  board.querySelector('[data-calendar-next]').addEventListener('click', () => moveMonth(1));
  board.querySelector('[data-calendar-today]').addEventListener('click', () => {
    year = Number(today.slice(0, 4));
    month = Number(today.slice(5, 7)) - 1;
    render();
  });
  calendar.addEventListener('click', event => {
    const link = event.target.closest('[data-calendar-event]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const entry = entries.find(item => item.element.id === link.dataset.calendarEvent);
    if (!entry) return;
    view = 'list';
    render();
    entry.element.open = true;
    history.replaceState(null, '', '#' + entry.element.id);
    entry.element.querySelector('summary').focus({ preventScroll: true });
    entry.element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  });
  const linkedEvent = entries.find(entry => '#' + entry.element.id === location.hash);
  if (linkedEvent) linkedEvent.element.open = true;
  board.querySelector('[data-event-tools]').hidden = false;
  board.querySelector('[data-event-status]').hidden = false;
  render();
})();
